// functions/lib/reviewer.js
// Reviewer role (added 2026-11-27, owner request): a view-only account for an
// outside reviewer.
//
//   - The reviewer's user record lists the courses it may open in
//     enrolled_courses. The middleware gates /courses/{code}/* and
//     /assessments/* against that list on every host (staging included).
//   - Its dashboard shows a read-only list of real students: name, email and
//     which of the reviewer's courses each is enrolled in (GET /api/users).
//     Students whose record has test_account: true are left out.
//   - It gets no student progress, no module work and no user counts: those
//     endpoints treat it as below teacher.
//
// 'reviewer' is deliberately NOT in any ROLE_RANK table, so every
// "rank >= teacher" check treats it as below teacher.

export async function reviewerCourses(env, userId) {
  const rec = await env.USERS_KV.get(userId, 'json');
  return new Set(rec && Array.isArray(rec.enrolled_courses) ? rec.enrolled_courses : []);
}

export function visibleToReviewer(user) {
  return !!user && user.role === 'student' && user.test_account !== true;
}
