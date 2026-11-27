// functions/api/module-work.js
// Student work in the interactive modules (courses/{code}/modules/*.html).
// Owner-approved 2026-11-27. Storage: D1 database `mindview-work`, binding WORK_DB.
//
//   POST /api/module-work   (students only; others get 204 and nothing is stored)
//        { course, module, title, state, progress }
//        Upserts module_work (latest state) and, when progress.final.attempt is
//        new, inserts an immutable final_attempts row (OF evidence).
//   GET  /api/module-work?course=X                         teacher+ : one row per student × module (no state)
//   GET  /api/module-work?course=X&student=ID&module=M      teacher+ : full state + every Final Check attempt
//
// Identity always comes from the session cookie, never from the request body.

import { readSessionFromRequest } from '../lib/session.js';

const ROLE_RANK = { student: 0, teacher: 1, admin: 2, superuser: 3 };
const SLUG = /^[a-z0-9][a-z0-9-]{0,80}$/;
const MAX_BYTES = 400 * 1024;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export async function onRequest({ request, env }) {
  if (!env.SESSION_SECRET) return json(500, { error: 'SESSION_SECRET not configured' });
  if (!env.WORK_DB) return json(503, { error: 'WORK_DB not configured' });
  const session = await readSessionFromRequest(request, env.SESSION_SECRET);
  if (!session) return json(401, { error: 'Not signed in' });
  const { role, sub: userId, email } = session;
  const rank = ROLE_RANK[role] ?? -1;
  const db = env.WORK_DB;

  if (request.method === 'POST') {
    if (role !== 'student') return new Response(null, { status: 204 });
    const raw = await request.text();
    if (raw.length > MAX_BYTES) return json(413, { error: 'Too large' });
    let b;
    try { b = JSON.parse(raw); } catch { return json(400, { error: 'Bad JSON' }); }
    const course = String(b.course || '').toLowerCase();
    const module = String(b.module || '');
    if (!SLUG.test(course) || !SLUG.test(module)) return json(400, { error: 'Bad course/module' });
    const now = new Date().toISOString();
    const state = JSON.stringify(b.state || {});
    const progress = JSON.stringify(Object.assign({}, b.progress || {}, { title: String(b.title || '').slice(0, 200) }));
    const stmts = [
      db.prepare(
        `INSERT INTO module_work (user_id, email, course, module, state, progress, first_seen, updated, saves)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7, 1)
         ON CONFLICT(user_id, course, module) DO UPDATE SET
           email = excluded.email, state = excluded.state, progress = excluded.progress,
           updated = excluded.updated, saves = module_work.saves + 1`
      ).bind(userId, email || '', course, module, state, progress, now),
    ];
    const f = b.progress && b.progress.final;
    const n = f && Number(f.attempt);
    if (n > 0 && Number.isInteger(n)) {
      const s = b.state || {};
      const answers = JSON.stringify({ q: (s.final && s.final.q) || {}, last: s.lastFinal || null });
      stmts.push(db.prepare(
        `INSERT OR IGNORE INTO final_attempts (user_id, course, module, attempt, score, out_of, by_cat, answers, at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
      ).bind(userId, course, module, n, Number(f.score) || 0, Number(f.outOf) || 0, JSON.stringify(f.byCat || {}), answers, now));
    }
    await db.batch(stmts);
    return json(200, { ok: true, saved: now });
  }

  if (request.method === 'GET') {
    if (rank < ROLE_RANK.teacher) return json(403, { error: 'Teachers only' });
    const url = new URL(request.url);
    const course = (url.searchParams.get('course') || '').toLowerCase();
    if (!SLUG.test(course)) return json(400, { error: 'course required' });
    const student = url.searchParams.get('student');
    const module = url.searchParams.get('module');
    if (student && module) {
      const row = await db.prepare(
        `SELECT user_id, email, course, module, state, progress, first_seen, updated, saves
         FROM module_work WHERE user_id = ?1 AND course = ?2 AND module = ?3`
      ).bind(student, course, module).first();
      const att = await db.prepare(
        `SELECT attempt, score, out_of, by_cat, answers, at FROM final_attempts
         WHERE user_id = ?1 AND course = ?2 AND module = ?3 ORDER BY attempt`
      ).bind(student, course, module).all();
      return json(200, { work: row || null, attempts: att.results || [] });
    }
    const rows = await db.prepare(
      `SELECT user_id, email, module, progress, first_seen, updated, saves
       FROM module_work WHERE course = ?1 ORDER BY user_id, module`
    ).bind(course).all();
    return json(200, { rows: rows.results || [] });
  }

  return json(405, { error: 'Method not allowed' });
}
