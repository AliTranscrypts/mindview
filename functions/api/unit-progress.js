// functions/api/unit-progress.js
// ─────────────────────────────────────────────────────────────────────────────
// Student progress records for MindView Academy.
//
// Progress records per student per course. These are records for the
// teacher's Student Progress panel; they do NOT control chapter access.
// Every chapter is open to students (owner decision 2026-11-09).
//   • AS Practice Quiz — auto-recorded by client JS when student answers ≥60% of Qs
//   • FOR Diagnostic   — teacher marks "reviewed" in admin progress panel
//   • OF Unit Test     — "submitted" when the student clicks Submit Unit Test on
//                        the test page (of_submit) or a teacher records it
//                        (mark_of_submitted); graded pass/fail by the teacher (mark_of).
//
// Final Exam unlocks only when teacher explicitly grants it (after all OFs passed).
//
// KV schema (stored in USERS_KV):
//   progress:{studentId}:{courseCode}
//   → {
//       ch1: { as_done, for_done, of_submitted, of_passed, completed, ...timestamps },
//       ch2: { ... },
//       ...
//       final_unlocked: bool,
//     }
//
// Endpoints
// ─────────
//   GET  /api/unit-progress?course=eng4u
//        Returns the calling student's full progress for a course.
//        Teachers/admins: add &studentId=X to fetch another user's progress.
//
//   POST /api/unit-progress
//        { action: "as_done", course, chapterNum }         ← student (auto)
//        { action: "of_submit", path }                     ← student, from the
//              OF test page; only accepted while the teacher's unlock grant for
//              that test exists, so it can't be sent for a test never taken
//        { action: "mark_for", course, chapterNum, studentId, done }   ← teacher
//        { action: "mark_of_submitted", course, chapterNum, studentId, submitted } ← teacher
//        { action: "mark_of",  course, chapterNum, studentId, passed } ← teacher
//        { action: "unlock_final", course, studentId }     ← teacher
//        { action: "reset_chapter", course, chapterNum, studentId }    ← admin only
//
// Owner-approved 2026-06-03.
// ─────────────────────────────────────────────────────────────────────────────

import { readSessionFromRequest } from '../lib/session.js';
import {
  slugifyAssessmentPath,
  parseUnitTestPath,
  COURSE_CHAPTER_COUNTS,
} from '../lib/assessment-paths.js';

const ROLE_RANK = { student: 0, teacher: 1, admin: 2, superuser: 3 };

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function progressKey(studentId, course) {
  return `progress:${studentId}:${course.toLowerCase()}`;
}

async function getProgress(kv, studentId, course) {
  const key = progressKey(studentId, course);
  const data = await kv.get(key, 'json');
  return data || {};
}

async function saveProgress(kv, studentId, course, data) {
  const key = progressKey(studentId, course);
  await kv.put(key, JSON.stringify(data));
}

// Lookup a student by email → returns their user record.
async function findStudentByEmail(kv, email) {
  const list = await kv.list();
  for (const k of list.keys) {
    if (k.name.startsWith('unlock-') || k.name.startsWith('progress:')) continue;
    const rec = await kv.get(k.name, 'json');
    if (rec && rec.email && rec.email.toLowerCase() === email.toLowerCase()) return rec;
  }
  return null;
}

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.SESSION_SECRET) return json(500, { error: 'SESSION_SECRET not configured' });
  if (!env.USERS_KV)       return json(503, { error: 'USERS_KV not configured' });

  const session = await readSessionFromRequest(request, env.SESSION_SECRET);
  if (!session) return json(401, { error: 'Authentication required' });

  const { role, sub: userId, email } = session;
  const isInstructor = ROLE_RANK[role] >= ROLE_RANK.teacher;
  const isAdmin = ROLE_RANK[role] >= ROLE_RANK.admin;

  const method = request.method.toUpperCase();
  const url = new URL(request.url);

  // ── GET — fetch progress ──────────────────────────────────────────────────
  if (method === 'GET') {
    const course = url.searchParams.get('course');
    if (!course) return json(400, { error: 'course required' });

    // Students only see their own; teachers can see any student
    const targetId = isInstructor ? (url.searchParams.get('studentId') || userId) : userId;
    if (!isInstructor && targetId !== userId) return json(403, { error: 'Forbidden' });

    const progress = await getProgress(env.USERS_KV, targetId, course);
    return json(200, { progress, studentId: targetId });
  }

  // ── POST — record progress ────────────────────────────────────────────────
  if (method === 'POST') {
    let body;
    try { body = await request.json(); } catch { return json(400, { error: 'Invalid JSON' }); }

    const { action, course, chapterNum, studentId: targetId, done, passed, submitted, path: testPath } = body || {};

    // ── Student: record that they handed in an OF unit test ──
    if (action === 'of_submit') {
      if (role !== 'student') return json(403, { error: 'Only students submit unit tests' });
      const test = parseUnitTestPath(testPath);
      if (!test) return json(400, { error: 'path must be a unit test (OF) page' });
      // The test page is only served while the teacher's unlock grant exists
      // (KV keeps it ~95 min after the teacher unlocks). Requiring it here
      // stops a student marking a test submitted without having taken it.
      const grantKey = `unlock-grant:${userId}:${slugifyAssessmentPath(testPath)}`;
      const grant = await env.USERS_KV.get(grantKey, 'json');
      if (!grant) {
        return json(403, {
          error: 'This test session has ended. Ask your teacher to mark your test as submitted.',
        });
      }
      const progress = await getProgress(env.USERS_KV, userId, test.course);
      const key = `ch${test.ch}`;
      if (!progress[key]) progress[key] = {};
      if (!progress[key].of_submitted) {
        progress[key].of_submitted = true;
        progress[key].of_submitted_at = new Date().toISOString();
        progress[key].of_submitted_by = email;
        await saveProgress(env.USERS_KV, userId, test.course, progress);
      }
      const total = COURSE_CHAPTER_COUNTS[test.course] || 0;
      return json(200, {
        ok: true,
        course: test.course,
        chapterNum: test.ch,
        nextChapter: test.ch < total ? test.ch + 1 : null,
        submittedAt: progress[key].of_submitted_at,
      });
    }

    if (!action || !course) return json(400, { error: 'action and course required' });

    // ── Student: auto-record AS quiz completion ──
    if (action === 'as_done') {
      if (!chapterNum) return json(400, { error: 'chapterNum required' });
      const progress = await getProgress(env.USERS_KV, userId, course);
      const key = `ch${chapterNum}`;
      if (!progress[key]) progress[key] = {};
      progress[key].as_done = true;
      progress[key].as_done_at = new Date().toISOString();
      await saveProgress(env.USERS_KV, userId, course, progress);
      return json(200, { ok: true });
    }

    // ── Teacher: mark FOR as reviewed ──
    if (action === 'mark_for') {
      if (!isInstructor) return json(403, { error: 'Teachers only' });
      if (!chapterNum || !targetId) return json(400, { error: 'chapterNum and studentId required' });

      const progress = await getProgress(env.USERS_KV, targetId, course);
      const key = `ch${chapterNum}`;
      if (!progress[key]) progress[key] = {};
      progress[key].for_done = done !== false; // default true
      progress[key].for_done_by = email;
      progress[key].for_done_at = new Date().toISOString();
      await saveProgress(env.USERS_KV, targetId, course, progress);
      return json(200, { ok: true });
    }

    // ── Teacher: record that a student handed in the OF test ──
    // For papers handed in without the student clicking Submit, e.g. tests
    // taken before the Submit button existed.
    if (action === 'mark_of_submitted') {
      if (!isInstructor) return json(403, { error: 'Teachers only' });
      if (!chapterNum || !targetId) return json(400, { error: 'chapterNum and studentId required' });

      const progress = await getProgress(env.USERS_KV, targetId, course);
      const key = `ch${chapterNum}`;
      if (!progress[key]) progress[key] = {};
      if (submitted === false) {
        delete progress[key].of_submitted;
        delete progress[key].of_submitted_at;
        delete progress[key].of_submitted_by;
      } else if (!progress[key].of_submitted) {
        progress[key].of_submitted = true;
        progress[key].of_submitted_at = new Date().toISOString();
        progress[key].of_submitted_by = email;
      }
      await saveProgress(env.USERS_KV, targetId, course, progress);
      return json(200, { ok: true });
    }

    // ── Teacher: grade the OF test pass/fail ──
    // A marked test was handed in, so it is recorded as submitted either way.
    if (action === 'mark_of') {
      if (!isInstructor) return json(403, { error: 'Teachers only' });
      if (!chapterNum || !targetId) return json(400, { error: 'chapterNum and studentId required' });

      const progress = await getProgress(env.USERS_KV, targetId, course);
      const key = `ch${chapterNum}`;
      if (!progress[key]) progress[key] = {};
      progress[key].of_passed = passed !== false; // default true
      progress[key].of_passed_by = email;
      progress[key].of_passed_at = new Date().toISOString();
      if (!progress[key].of_submitted) {
        progress[key].of_submitted = true;
        progress[key].of_submitted_at = progress[key].of_passed_at;
        progress[key].of_submitted_by = email;
      }

      if (passed !== false) {
        progress[key].completed = true;
        progress[key].completed_at = new Date().toISOString();
      } else {
        progress[key].completed = false;
        progress[key].of_passed = false;
      }

      await saveProgress(env.USERS_KV, targetId, course, progress);
      return json(200, { ok: true, unlockedNext: true });
    }

    // ── Teacher: unlock final exam ──
    if (action === 'unlock_final') {
      if (!isInstructor) return json(403, { error: 'Teachers only' });
      if (!targetId) return json(400, { error: 'studentId required' });

      const progress = await getProgress(env.USERS_KV, targetId, course);
      progress.final_unlocked = true;
      progress.final_unlocked_by = email;
      progress.final_unlocked_at = new Date().toISOString();
      await saveProgress(env.USERS_KV, targetId, course, progress);
      return json(200, { ok: true });
    }

    // ── Admin: reset a chapter (e.g. student retakes an exam) ──
    if (action === 'reset_chapter') {
      if (!isAdmin) return json(403, { error: 'Admins only' });
      if (!chapterNum || !targetId) return json(400, { error: 'chapterNum and studentId required' });

      const progress = await getProgress(env.USERS_KV, targetId, course);
      const key = `ch${chapterNum}`;
      delete progress[key];
      // Also clear final unlock if resetting any chapter
      delete progress.final_unlocked;
      await saveProgress(env.USERS_KV, targetId, course, progress);
      return json(200, { ok: true });
    }

    return json(400, { error: `Unknown action: ${action}` });
  }

  return json(405, { error: 'Method not allowed' });
}
