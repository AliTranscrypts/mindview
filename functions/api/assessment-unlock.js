// functions/api/assessment-unlock.js
// Server-side unlock gate for supervised assessments (FOR, OF, Final Exam).
//
// All operations go through USERS_KV so there is a single source of truth that
// the middleware can also read without a network round-trip.
//
// KV key schema (two separate namespaces within USERS_KV):
//   unlock-req:{studentId}:{slug}   — student's pending request to be unlocked
//   unlock-grant:{studentId}:{slug} — teacher's grant (contains expiry)
//
// {slug} is a normalised URL-safe string derived from the assessment path,
// e.g. /assessments/eng4u/Unit1_Critical_Reading_OF.html
//       → "assessments__eng4u__Unit1_Critical_Reading_OF"
//
// Endpoints
// ─────────
//   GET  /api/assessment-unlock?path=<encoded-path>
//        Returns the lock status for the calling user (student or teacher).
//        Students: { status: "locked"|"requested"|"granted", expiresAt? }
//        Teachers: { pendingRequests: [...] } — all un-granted requests
//
//   POST /api/assessment-unlock
//        Body { action: "request", path, jitsiRoom }   ← student
//        Body { action: "grant",   path, studentId }   ← teacher/admin/superuser
//        Body { action: "revoke",  path, studentId }   ← teacher/admin/superuser
//
// Expiry
//        Grants expire after the time-limit for the assessment type plus a
//        30-minute grace period:
//          FOR diagnostic  → 30 + 30 = 60 min
//          OF unit test    → 60 + 30 = 90 min
//          Final Exam      → 120 + 30 = 150 min
//
// Security
//        Teacher endpoints require role === teacher | admin | superuser.
//        Student endpoints require role === student AND can only act on
//        their own records.
//
// Owner-approved 2026-06-03.

import { readSessionFromRequest } from '../lib/session.js';

const ROLE_RANK = { student: 0, teacher: 1, admin: 2, superuser: 3 };

// Normalise an assessment path into a safe KV key segment.
function slugify(path) {
  return String(path)
    .replace(/^\/+/, '')           // strip leading slash
    .replace(/\.html?$/i, '')      // strip .html
    .replace(/[^a-zA-Z0-9_-]/g, '__'); // replace non-safe chars
}

// Determine expiry ms from assessment type.
function expiryMs(path) {
  const p = path.toUpperCase();
  if (/FINAL_EXAM|_FINAL_EXAM/.test(p)) return (120 + 30) * 60_000;
  if (/_FOR\.HTML|_CH\d+_FOR/.test(p)) return (30 + 30) * 60_000;
  if (/_OF\.HTML|_CH\d+_OF/.test(p))  return (60 + 30) * 60_000;
  return 90 * 60_000; // default 90 min
}

// Determine human-readable exam type.
function examType(path) {
  const p = path.toUpperCase();
  if (/FINAL_EXAM|_FINAL_EXAM/.test(p)) return 'Final Exam';
  if (/_FOR\.HTML|_CH\d+_FOR/.test(p)) return 'Diagnostic (FOR)';
  if (/_OF\.HTML|_CH\d+_OF/.test(p))  return 'Unit Test (OF)';
  return 'Assessment';
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.SESSION_SECRET) return json(500, { error: 'SESSION_SECRET not configured' });
  if (!env.USERS_KV)       return json(503, { error: 'USERS_KV not configured' });

  const session = await readSessionFromRequest(request, env.SESSION_SECRET);
  if (!session) return json(401, { error: 'Authentication required' });

  const { role, sub: userId, email } = session;
  const isInstructor = ROLE_RANK[role] >= ROLE_RANK.teacher;

  const method = request.method.toUpperCase();
  const url = new URL(request.url);

  // ── GET — status check ────────────────────────────────────────────────────
  if (method === 'GET') {
    const path = url.searchParams.get('path');

    // Teacher: list all pending requests (path not required)
    if (isInstructor && !path) {
      const list = await env.USERS_KV.list({ prefix: 'unlock-req:' });
      const requests = [];
      for (const key of list.keys) {
        const data = await env.USERS_KV.get(key.name, 'json');
        if (data) requests.push({ key: key.name, ...data });
      }
      // Filter out requests that already have a grant
      const ungrantedRequests = [];
      for (const req of requests) {
        const grantKey = 'unlock-grant:' + req.studentId + ':' + slugify(req.assessmentPath);
        const grant = await env.USERS_KV.get(grantKey, 'json');
        if (!grant || Date.now() > grant.expiresAt) {
          ungrantedRequests.push(req);
        }
      }
      return json(200, { pendingRequests: ungrantedRequests });
    }

    if (!path) return json(400, { error: 'path required' });
    const slug = slugify(path);

    if (!isInstructor) {
      // Student: check their own grant
      const grantKey = `unlock-grant:${userId}:${slug}`;
      const grant = await env.USERS_KV.get(grantKey, 'json');

      if (!grant) {
        // Check if they have a pending request
        const reqKey = `unlock-req:${userId}:${slug}`;
        const req = await env.USERS_KV.get(reqKey, 'json');
        return json(200, { status: req ? 'requested' : 'locked' });
      }
      if (Date.now() > grant.expiresAt) {
        await env.USERS_KV.delete(grantKey);
        return json(200, { status: 'locked', reason: 'expired' });
      }
      return json(200, {
        status: 'granted',
        expiresAt: grant.expiresAt,
        jitsiRoom: grant.jitsiRoom,
        teacherEmail: grant.teacherEmail,
      });
    }

    // Instructor: check a specific student's status (requires studentId param)
    const studentId = url.searchParams.get('studentId');
    if (!studentId) return json(400, { error: 'studentId required for instructors' });
    const grantKey = `unlock-grant:${studentId}:${slug}`;
    const grant = await env.USERS_KV.get(grantKey, 'json');
    return json(200, { status: grant && Date.now() < grant.expiresAt ? 'granted' : 'locked', grant });
  }

  // ── POST — create/revoke ──────────────────────────────────────────────────
  if (method === 'POST') {
    let body;
    try { body = await request.json(); }
    catch { return json(400, { error: 'Invalid JSON body' }); }

    const { action, path: assessmentPath, jitsiRoom, studentId: targetStudentId } = body || {};
    if (!action)         return json(400, { error: 'action required' });
    if (!assessmentPath) return json(400, { error: 'path required' });

    const slug = slugify(assessmentPath);

    // ── Student: request unlock ──
    if (action === 'request') {
      if (role !== 'student') return json(403, { error: 'Only students can request unlock' });

      const reqKey = `unlock-req:${userId}:${slug}`;
      const reqData = {
        studentId: userId,
        studentEmail: email,
        assessmentPath,
        assessmentType: examType(assessmentPath),
        jitsiRoom: jitsiRoom || null,
        requestedAt: new Date().toISOString(),
        requestedAtMs: Date.now(),
      };
      // Request expires in 4 hours (prevents stale requests)
      await env.USERS_KV.put(reqKey, JSON.stringify(reqData), { expirationTtl: 4 * 3600 });
      return json(200, { ok: true, message: 'Unlock request sent to teacher' });
    }

    // ── Teacher: grant unlock ──
    if (action === 'grant') {
      if (!isInstructor) return json(403, { error: 'Only teachers/admins can grant unlock' });
      if (!targetStudentId) return json(400, { error: 'studentId required to grant' });

      const expiry = Date.now() + expiryMs(assessmentPath);
      const grantKey = `unlock-grant:${targetStudentId}:${slug}`;
      const grantData = {
        studentId: targetStudentId,
        teacherId: userId,
        teacherEmail: email,
        assessmentPath,
        assessmentType: examType(assessmentPath),
        jitsiRoom: jitsiRoom || null,
        grantedAt: new Date().toISOString(),
        expiresAt: expiry,
      };
      // KV TTL slightly longer than expiresAt so we can detect expired grants
      await env.USERS_KV.put(grantKey, JSON.stringify(grantData), {
        expirationTtl: Math.ceil(expiryMs(assessmentPath) / 1000) + 300,
      });

      // Remove the pending request now that it's been granted
      const reqKey = `unlock-req:${targetStudentId}:${slug}`;
      await env.USERS_KV.delete(reqKey);

      return json(200, { ok: true, expiresAt: expiry, assessmentType: examType(assessmentPath) });
    }

    // ── Teacher: revoke unlock ──
    if (action === 'revoke') {
      if (!isInstructor) return json(403, { error: 'Only teachers/admins can revoke' });
      if (!targetStudentId) return json(400, { error: 'studentId required' });

      const grantKey = `unlock-grant:${targetStudentId}:${slug}`;
      await env.USERS_KV.delete(grantKey);
      return json(200, { ok: true });
    }

    return json(400, { error: `Unknown action: ${action}` });
  }

  return json(405, { error: 'Method not allowed' });
}
