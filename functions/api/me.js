// functions/api/me.js
// GET /api/me — returns the current user (driven by the mv_session cookie).
//
// Response shape (kept compatible with the previous Cloudflare-Access-JWT
// version that index.html / admin/dashboard.html / admin/users.html consume):
//
//   {
//     authenticated: true,
//     user: {
//       id, email, full_name, role, role_label, can_manage_users,
//       enrolled_courses?: string[]  // students only; absent on other roles
//     }
//   }
//
// When no valid session cookie is present we return 200 with
// {authenticated:false} so the home page can render without triggering a
// redirect loop with the middleware. (The middleware itself doesn't gate
// /api/me precisely so this endpoint can be polled safely.)

import { readSessionFromRequest } from '../lib/session.js';

const ROLE_LABELS = {
  superuser: 'Super User',
  admin: 'Administrator',
  teacher: 'Teacher',
  student: 'Student',
  reviewer: 'Reviewer',
};

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  // If the secret isn't configured we treat the request as unauthenticated
  // here (rather than 500), so the static pages can still render their
  // "logged-out" state without throwing. The middleware will already 500 on
  // protected routes, which is the right place to surface that failure.
  if (!env.SESSION_SECRET) {
    return json(200, { authenticated: false });
  }

  const payload = await readSessionFromRequest(request, env.SESSION_SECRET);
  if (!payload) {
    return json(200, { authenticated: false });
  }

  // Try to enrich with full_name + enrolled_courses from KV if available.
  // If KV isn't bound or the user record has since been deleted, fall back
  // to cookie data only — a stale cookie shouldn't crash the endpoint.
  let fullName = '';
  let enrolledCourses = null;  // null = "not loaded from KV", [] = "loaded, empty"
  if (env.USERS_KV && payload.sub) {
    try {
      const rec = await env.USERS_KV.get(payload.sub, 'json');
      if (rec) {
        if (typeof rec.full_name === 'string') fullName = rec.full_name;
        if (Array.isArray(rec.enrolled_courses)) enrolledCourses = rec.enrolled_courses;
        // If the role in KV has changed since the cookie was issued, prefer the
        // cookie (which is what we signed). The cookie will be re-issued on
        // next login. This avoids privilege-escalation surprises mid-session.
      } else {
        // User was deleted while their cookie was still valid. Treat as
        // unauthenticated so they're bounced to /login on the next protected
        // request.
        return json(200, { authenticated: false });
      }
    } catch {
      // Swallow KV errors — fall back to cookie-only data.
    }
  }

  const role = payload.role;
  const user = {
    id: payload.sub,
    email: payload.email,
    full_name: fullName || payload.email,
    role,
    role_label: ROLE_LABELS[role] || role,
    can_manage_users: role === 'admin' || role === 'superuser',
  };
  // Only attach enrolled_courses for students and reviewers (whose list is the
  // courses they may review) — for teachers/admins/superusers it's meaningless
  // (they have full access regardless). Defaults to [] for students whose
  // record predates the field.
  if (role === 'student' || role === 'reviewer') {
    user.enrolled_courses = enrolledCourses || [];
  }
  return json(200, { authenticated: true, user });
}
