// functions/api/users.js
// Admin CRUD for users stored in USERS_KV.
//
// Auth: reads identity from the mv_session HttpOnly cookie via the shared
// session lib. Only admin and superuser may call this endpoint; admins may
// only manage student/teacher accounts, superusers may manage anyone.
//
// User-record shape (DO NOT change order — preserved for KV compatibility):
//   { id, email, full_name, role, passwordHash, created_at,
//     enrolled_courses?: string[] }
// passwordHash = PBKDF2-SHA256 "v2:" hash for new or changed passwords (see
// ../lib/password.js). Older records may still hold legacy unsalted SHA-256 hex;
// login accepts both formats.
//
// enrolled_courses (added 2026-06-01) is meaningful only for role=student;
// it's an array of Ontario course codes (lowercased) the student is
// authorized to access content for. Missing/empty = no enrolment. The
// middleware enforces this on every /courses/{code}/* request; students
// can browse the home page and course landing pages regardless, but
// chapters / lessons / assessments require enrolment. Teachers / admins /
// superusers ignore this field and have full access.
//
// TODO: Add an "email:<lower>" -> id secondary index on create/update so login
//       no longer needs to scan the namespace.

import { readSessionFromRequest } from '../lib/session.js';
import { hashPassword } from '../lib/password.js';

const ROLE_RANK = { student: 0, teacher: 1, admin: 2, superuser: 3 };
const ALL_ROLES = ['student', 'teacher', 'admin', 'superuser'];
const MIN_PW_LENGTH = 8;

// The 34 Ontario course codes that can appear in a student's enrolled_courses
// array. Single source of truth — keep in sync with the home-page LAYOUT in
// scripts/_rebuild_index_grid.py and the COURSES_AND_CHAPTERS list in
// scripts/verify-baseline.py.
const VALID_COURSE_CODES = new Set([
  'mcr3u', 'mhf4u', 'mcv4u', 'mdm4u', 'mct3m', 'mct4m',
  'snc2d', 'sbi3u', 'sbi4u', 'sch3u', 'sch4u', 'sph3u', 'sph4u',
  'eng2d', 'eng3u', 'eng4u',
  'ics3u', 'ics4u',
  'chv2o', 'cpc3o', 'cpw4u',                                     // Politics: G10 → G11 → G12
  'chc2d', 'chw3m', 'chy4u',
  'clu3m', 'cln4u',
  'cgf3m', 'cgw4u',
  'baf3m', 'bat4m', 'bbb4m', 'boh4m',
  'hfn3m', 'hfa4m', 'hsc4m',
  'glc2o', 'gwl3o', 'gpp3o', 'gle3o', 'gle4o',                   // GCE: G10 → G11 (×3) → G12
]);

// Validate + normalize an incoming enrolled_courses payload.
// Returns { ok: true, value: string[] } or { ok: false, error: string }.
function validateEnrolledCourses(input) {
  if (input === undefined || input === null) return { ok: true, value: [] };
  if (!Array.isArray(input)) {
    return { ok: false, error: 'enrolled_courses must be an array of course codes' };
  }
  const out = [];
  for (const raw of input) {
    if (typeof raw !== 'string') {
      return { ok: false, error: 'enrolled_courses entries must be strings' };
    }
    const code = raw.toLowerCase().trim();
    if (!VALID_COURSE_CODES.has(code)) {
      return { ok: false, error: `Unknown course code: ${raw}` };
    }
    if (!out.includes(code)) out.push(code);  // dedup
  }
  return { ok: true, value: out };
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function canManageRole(actorRole, targetRole) {
  if (actorRole === 'superuser') return true;
  if (actorRole === 'admin') return targetRole === 'teacher' || targetRole === 'student';
  return false;
}

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.SESSION_SECRET) {
    return json(500, {
      error: 'SESSION_SECRET is not configured. Set it as a Pages environment variable.',
    });
  }
  if (!env.USERS_KV) {
    return json(503, {
      error:
        'User store not configured. Bind a KV namespace named USERS_KV in Cloudflare Pages settings.',
    });
  }

  const session = await readSessionFromRequest(request, env.SESSION_SECRET);
  if (!session) return json(401, { error: 'Authentication required' });

  const actorRole = session.role;
  if (actorRole !== 'admin' && actorRole !== 'superuser') {
    return json(403, { error: 'Insufficient permissions' });
  }

  const url = new URL(request.url);
  const targetId = url.searchParams.get('id');
  const method = request.method;

  // ---------- LIST ----------
  if (method === 'GET' && !targetId) {
    const list = await env.USERS_KV.list();
    const users = await Promise.all(list.keys.map((k) => env.USERS_KV.get(k.name, 'json')));
    let filtered = users.filter(Boolean).map((u) => {
      // Never leak passwordHash to the client.
      const { passwordHash, ...safe } = u;
      return safe;
    });
    if (actorRole === 'admin') {
      filtered = filtered.filter((u) => u.role === 'teacher' || u.role === 'student');
    }
    return json(200, { users: filtered, actor_role: actorRole });
  }

  // ---------- CREATE ----------
  if (method === 'POST' && !targetId) {
    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { error: 'Invalid JSON body' });
    }
    const { email, password, full_name, role, enrolled_courses } = body || {};
    if (!email || !password || !role) {
      return json(400, { error: 'email, password, role are required' });
    }
    if (!ALL_ROLES.includes(role)) return json(400, { error: 'Invalid role' });
    if (typeof password !== 'string' || password.length < MIN_PW_LENGTH) {
      return json(400, { error: `Password must be at least ${MIN_PW_LENGTH} characters` });
    }
    if (!canManageRole(actorRole, role)) {
      return json(403, { error: `Your role cannot create ${role} users` });
    }
    // enrolled_courses is only meaningful for students; reject it on other
    // roles so we don't silently persist data that will never be read.
    const enrolCheck = validateEnrolledCourses(enrolled_courses);
    if (!enrolCheck.ok) return json(400, { error: enrolCheck.error });
    if (role !== 'student' && enrolCheck.value.length > 0) {
      return json(400, {
        error: 'enrolled_courses can only be set on student accounts',
      });
    }
    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    const user = {
      id,
      email,
      full_name: full_name || '',
      role,
      passwordHash,
      created_at: new Date().toISOString(),
    };
    if (role === 'student') {
      user.enrolled_courses = enrolCheck.value;
    }
    await env.USERS_KV.put(id, JSON.stringify(user));
    return json(201, { ok: true, id });
  }

  // ---------- UPDATE / DELETE require ?id= ----------
  if (!targetId) return json(400, { error: 'User id required (?id=<uuid>)' });
  const target = await env.USERS_KV.get(targetId, 'json');
  if (!target) return json(404, { error: 'User not found' });
  if (!canManageRole(actorRole, target.role)) {
    return json(403, { error: `Cannot manage ${target.role} users` });
  }

  if (method === 'PUT') {
    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { error: 'Invalid JSON body' });
    }
    if (body.role && !ALL_ROLES.includes(body.role)) return json(400, { error: 'Invalid role' });
    if (body.role && !canManageRole(actorRole, body.role)) {
      return json(403, { error: `Cannot promote to ${body.role}` });
    }
    // If the caller is changing the password, hash it; otherwise keep existing.
    let updates = { ...body };
    if (typeof body.password === 'string' && body.password.length > 0) {
      if (body.password.length < MIN_PW_LENGTH) {
        return json(400, { error: `Password must be at least ${MIN_PW_LENGTH} characters` });
      }
      updates.passwordHash = await hashPassword(body.password);
    }
    delete updates.password;
    // Validate enrolled_courses on update too. Determine the effective role
    // after this update (existing role unless the request changes it).
    if ('enrolled_courses' in updates) {
      const enrolCheck = validateEnrolledCourses(updates.enrolled_courses);
      if (!enrolCheck.ok) return json(400, { error: enrolCheck.error });
      const effectiveRole = updates.role || target.role;
      if (effectiveRole !== 'student' && enrolCheck.value.length > 0) {
        return json(400, {
          error: 'enrolled_courses can only be set on student accounts',
        });
      }
      updates.enrolled_courses = enrolCheck.value;
    }
    // If the role is being changed to something non-student, drop the field
    // so it doesn't sit stale on a teacher/admin record.
    if (updates.role && updates.role !== 'student' && 'enrolled_courses' in target) {
      updates.enrolled_courses = undefined;
    }
    const merged = { ...target, ...updates, id: targetId };
    if (merged.enrolled_courses === undefined) delete merged.enrolled_courses;
    // Never let the caller overwrite the immutable id from the body.
    await env.USERS_KV.put(targetId, JSON.stringify(merged));
    return json(200, { ok: true });
  }

  if (method === 'DELETE') {
    await env.USERS_KV.delete(targetId);
    return json(200, { ok: true });
  }

  return json(405, { error: 'Method not allowed' });
}
