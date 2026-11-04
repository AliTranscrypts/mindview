// functions/api/login.js
// POST /api/login  body: {email, password}
//
// Looks up the user in USERS_KV by email (case-insensitive), verifies the
// password against user.passwordHash (PBKDF2 "v2:" or legacy SHA-256 hex, see
// ../lib/password.js), then signs a session cookie and returns it.
//
// On ANY failure path (no body, missing env, missing user, bad password) we
// return 401 with the same generic message so we don't leak which part was
// wrong.
//
// TODO: KV has no email -> id index, so we paginate `USERS_KV.list()` and scan.
// This is fine for <~1000 users. Add a secondary index ("email:" + lowercased
// email -> id) on user create/update, and use it here, when we outgrow it.

import { signSession, serializeSessionCookie } from '../lib/session.js';
import { verifyPassword, hashPassword, needsRehash } from '../lib/password.js';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Transparent upgrade of legacy SHA-256 hashes to PBKDF2 "v2:" on successful
// login. Keep this OFF until this code is live on production: staging shares
// USERS_KV with production, so an upgrade triggered by a staging login would
// rewrite a real user's record into a format the production code running at
// that moment may not be able to verify, locking that user out of production.
// Once production runs this code, flip it to true and redeploy.
const UPGRADE_LEGACY_HASH_ON_LOGIN = false;

function json(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

// Scan USERS_KV for a user whose email matches (case-insensitive). Handles
// cursor pagination so we don't silently miss users in a large namespace.
async function findUserByEmail(kv, email) {
  const target = email.trim().toLowerCase();
  let cursor;
  // Hard cap to avoid runaway loops; in practice we expect <1000 users.
  for (let safety = 0; safety < 50; safety++) {
    const page = cursor ? await kv.list({ cursor }) : await kv.list();
    for (const k of page.keys) {
      const u = await kv.get(k.name, 'json');
      if (u && typeof u.email === 'string' && u.email.toLowerCase() === target) {
        return u;
      }
    }
    if (page.list_complete || !page.cursor) return null;
    cursor = page.cursor;
  }
  return null;
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed' }, { Allow: 'POST' });
  }

  if (!env.SESSION_SECRET) {
    return json(500, {
      error:
        'SESSION_SECRET is not configured. Set it as a Pages environment variable in the Cloudflare dashboard.',
    });
  }
  if (!env.USERS_KV) {
    return json(503, {
      error:
        'User store not configured. Bind a KV namespace named USERS_KV in Cloudflare Pages settings.',
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(401, { error: 'Invalid email or password' });
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!email || !password) {
    return json(401, { error: 'Invalid email or password' });
  }

  const user = await findUserByEmail(env.USERS_KV, email);
  if (!user || typeof user.passwordHash !== 'string') {
    return json(401, { error: 'Invalid email or password' });
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    return json(401, { error: 'Invalid email or password' });
  }

  if (UPGRADE_LEGACY_HASH_ON_LOGIN && needsRehash(user.passwordHash)) {
    // Best effort: a failed upgrade must never block a valid login.
    try {
      const upgraded = { ...user, passwordHash: await hashPassword(password) };
      await env.USERS_KV.put(user.id, JSON.stringify(upgraded));
    } catch (e) {
      console.error('login: password hash upgrade failed', e);
    }
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const cookieValue = await signSession(
    { sub: user.id, email: user.email, role: user.role, exp },
    env.SESSION_SECRET
  );

  return json(
    200,
    {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name || '',
        role: user.role,
      },
    },
    { 'Set-Cookie': serializeSessionCookie(cookieValue, { maxAge: SESSION_TTL_SECONDS }) }
  );
}
