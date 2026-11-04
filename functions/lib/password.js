// functions/lib/password.js
//
// Password hashing for USERS_KV user records (`passwordHash` field).
//
// Formats understood by verifyPassword():
//   v2:<iterations>:<salt hex>:<hash hex>   PBKDF2-HMAC-SHA256, 16-byte random salt,
//                                          32-byte derived key. Written by hashPassword().
//   <64 lowercase hex chars>               Legacy unsalted SHA-256. Every record created
//                                          before the PBKDF2 upgrade still uses this.
//
// ITERATION CAP: Cloudflare Workers' WebCrypto rejects PBKDF2 iteration counts above
// 100,000 ("NotSupportedError: Pbkdf2 failed: iteration counts above 100000 are not
// supported"). The 2026-06-16 deploy used 200,000, so every hash attempt threw, and
// "Add user" on Manage Users returned 500 (shown in the UI as "Network error").
// The iteration count is stored inside each v2 hash, so PBKDF2_ITERATIONS can change
// later without invalidating existing records, as long as it stays at or below the cap.
//
// All operations use the WebCrypto API built into Workers / Pages Functions.

export const PBKDF2_ITERATIONS = 100000;
const MAX_SUPPORTED_ITERATIONS = 100000; // Workers runtime limit, see above
const SALT_BYTES = 16;
const KEY_BITS = 256;
const V2_PREFIX = 'v2:';

function toHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

// Constant-time compare for equal-length strings; false on any length mismatch.
function timingSafeStrEq(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return toHex(new Uint8Array(buf));
}

async function pbkdf2Hex(password, saltBytes, iterations) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations },
    key,
    KEY_BITS
  );
  return toHex(new Uint8Array(bits));
}

function isLegacyHash(stored) {
  return typeof stored === 'string' && /^[0-9a-f]{64}$/.test(stored);
}

// Parse "v2:<iterations>:<salt hex>:<hash hex>". Returns null if malformed.
function parseV2(stored) {
  if (typeof stored !== 'string' || !stored.startsWith(V2_PREFIX)) return null;
  const parts = stored.slice(V2_PREFIX.length).split(':');
  if (parts.length !== 3) return null;
  const [iterStr, saltHex, hashHex] = parts;
  const iterations = Number(iterStr);
  if (!Number.isInteger(iterations) || iterations < 1) return null;
  if (!/^(?:[0-9a-f]{2})+$/.test(saltHex) || !/^[0-9a-f]{64}$/.test(hashHex)) return null;
  return { iterations, saltHex, hashHex };
}

// Hash a new password. Always produces the current v2 format.
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await pbkdf2Hex(password, salt, PBKDF2_ITERATIONS);
  return `${V2_PREFIX}${PBKDF2_ITERATIONS}:${toHex(salt)}:${hash}`;
}

// Verify a password against a stored hash in any supported format.
// Never throws for bad input: unknown or unsupported formats log and return false,
// so the login endpoint answers 401 instead of crashing with a 500.
export async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || typeof stored !== 'string') return false;

  if (stored.startsWith(V2_PREFIX)) {
    const v2 = parseV2(stored);
    if (!v2) {
      console.error('verifyPassword: malformed v2 password hash');
      return false;
    }
    if (v2.iterations > MAX_SUPPORTED_ITERATIONS) {
      console.error(
        `verifyPassword: v2 hash uses ${v2.iterations} iterations; Workers supports at most ${MAX_SUPPORTED_ITERATIONS}`
      );
      return false;
    }
    const candidate = await pbkdf2Hex(password, fromHex(v2.saltHex), v2.iterations);
    return timingSafeStrEq(candidate, v2.hashHex);
  }

  if (isLegacyHash(stored)) {
    return timingSafeStrEq(await sha256Hex(password), stored);
  }

  console.error('verifyPassword: unrecognised password hash format');
  return false;
}

// True when a stored hash should be rewritten in the current format: legacy
// SHA-256 hashes, and v2 hashes made with a different iteration count.
export function needsRehash(stored) {
  if (isLegacyHash(stored)) return true;
  const v2 = parseV2(stored);
  return !!v2 && v2.iterations !== PBKDF2_ITERATIONS;
}
