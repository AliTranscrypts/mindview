// functions/api/bootstrap.js
// POST /api/bootstrap  body: {email, password, full_name, secret}
//
// One-shot endpoint to seed the very first superuser when USERS_KV is empty.
// After the first user exists, this endpoint ALWAYS returns 403 — even if the
// caller provides the correct SESSION_SECRET.
//
// `secret` in the request body must equal env.SESSION_SECRET. This prevents
// random visitors from claiming the first account during the brief window
// between deploying the site and the owner running this call themselves.
//
// We intentionally do NOT issue a session cookie here. The owner is expected
// to immediately log in via /api/login with the password they just chose.

import { hashPassword } from '../lib/password.js';

const ROLE = 'superuser';
const MIN_PW_LENGTH = 8;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

// Constant-time string compare — avoid leaking secret length/prefix via timing.
function timingSafeStrEq(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  if (!env.SESSION_SECRET) {
    return json(500, {
      error:
        'SESSION_SECRET is not configured. Set it as a Pages environment variable in the Cloudflare dashboard before bootstrapping.',
    });
  }
  if (!env.USERS_KV) {
    return json(503, {
      error: 'User store not configured. Bind a KV namespace named USERS_KV in Pages settings.',
    });
  }

  // Reject immediately if KV already has any user. This is the locking
  // condition that makes the endpoint single-use.
  const probe = await env.USERS_KV.list({ limit: 1 });
  if (probe.keys && probe.keys.length > 0) {
    return json(403, { error: 'Bootstrap already complete; this endpoint is disabled.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const fullName = typeof body?.full_name === 'string' ? body.full_name.trim() : '';
  const providedSecret = typeof body?.secret === 'string' ? body.secret : '';

  if (!timingSafeStrEq(providedSecret, env.SESSION_SECRET)) {
    return json(403, { error: 'Invalid bootstrap secret' });
  }
  if (!email || !password) {
    return json(400, { error: 'email and password are required' });
  }
  if (password.length < MIN_PW_LENGTH) {
    return json(400, { error: `Password must be at least ${MIN_PW_LENGTH} characters` });
  }

  // Re-check just before write to narrow (but not eliminate) the TOCTOU
  // window. KV is eventually consistent, so two simultaneous bootstrap calls
  // could in principle both succeed — that's acceptable for a one-shot
  // owner-only endpoint that's never under contention.
  const probe2 = await env.USERS_KV.list({ limit: 1 });
  if (probe2.keys && probe2.keys.length > 0) {
    return json(403, { error: 'Bootstrap already complete; this endpoint is disabled.' });
  }

  const passwordHash = await hashPassword(password);
  const id = crypto.randomUUID();
  const user = {
    id,
    email,
    full_name: fullName,
    role: ROLE,
    passwordHash,
    created_at: new Date().toISOString(),
  };

  await env.USERS_KV.put(id, JSON.stringify(user));

  // Return the new record WITHOUT the password hash.
  const { passwordHash: _omit, ...safeUser } = user;
  return json(200, { ok: true, user: safeUser });
}
