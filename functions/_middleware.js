// functions/_middleware.js
// Runs for every request handled by Pages Functions (i.e. every HTML page
// AND every /api/* call — static-asset requests served directly from the
// edge cache also pass through here on cache miss).
//
// Behavior:
//   - Pass-through (no auth gate) for: /login, /api/login, /api/logout,
//     /api/bootstrap, /api/me, /logo.png, and any path with a static-asset
//     extension (.css .js .png .jpg .jpeg .gif .svg .webp .ico .woff .woff2
//     .ttf .map). Note that /js/content-protection.js is covered by the .js
//     extension rule, so the login page can fetch it unauthenticated (the
//     script self-skips on the login pages anyway).
//   - For everything else: require a valid mv_session cookie. If missing/
//     invalid, 302 to /login?next=<encoded original URL>.
//   - If SESSION_SECRET is unset, return 500 with a clear error so the owner
//     notices in dev/prod instead of silently allowing traffic through.
//   - For HTML responses (content-type starts with text/html) on any path
//     other than the login pages, inject
//       <script src="/js/content-protection.js" defer></script>
//       <script src="/js/role-gated.js" defer></script>
//     at the end of <head> via HTMLRewriter. This applies to public paths
//     too (e.g. the index page), so both scripts are always loaded. The two
//     scripts are independent and complementary: content-protection disables
//     copy/paste/etc for non-superusers; role-gated hides .instructor-only
//     content (answer keys, solutions, rubrics) from students.

import { readSessionFromRequest } from './lib/session.js';

// ── Sequential unit-progression helpers ──────────────────────────────────

// Per-course chapter counts.  Mirrors COURSES_AND_CHAPTERS in verify-baseline.py.
const COURSE_CHAPTER_COUNTS = {
  baf3m:5, bat4m:5, bbb4m:5, boh4m:5,
  cgf3m:5, cgw4u:5, chc2d:5, chv2o:3,
  chw3m:5, chy4u:6, cln4u:5, clu3m:5,
  cpc3o:3, cpw4u:5, eng2d:5, eng3u:6,
  eng4u:6, glc2o:3, gle3o:5, gle4o:5,
  gpp3o:5, gwl3o:3, hfa4m:5, hfn3m:5,
  hsc4m:5, ics3u:5, ics4u:5, mcr3u:8,
  mct3m:5, mct4m:5, mcv4u:9, mdm4u:8,
  mhf4u:8, sbi3u:5, sbi4u:5, sch3u:5,
  sch4u:5, snc2d:5, sph3u:5, sph4u:5,
};

// Extract { courseCode, chapterNum } from a chapter-page URL, or null.
// /courses/eng4u/ch3.html → { code:'eng4u', ch:3 }
function parseChapterUrl(pathname) {
  const m = pathname.match(/^\/courses\/([a-z0-9]+)\/ch(\d+)\.html$/i);
  if (!m) return null;
  return { code: m[1].toLowerCase(), ch: parseInt(m[2], 10) };
}

// Returns true when the URL is the final exam for any course.
function isFinalExamUrl(pathname) {
  return /\/final_exam\.html$/i.test(pathname) || /\/Final_Exam\.html$/.test(pathname);
}

// Extract course code from a final-exam URL.
function courseFromFinalExamUrl(pathname) {
  let m = pathname.match(/^\/assessments\/([a-z0-9]+)\/Final_Exam\.html$/i);
  if (m) return m[1].toLowerCase();
  m = pathname.match(/^\/assessments\/([a-z0-9]+)_final_exam\.html$/i);
  if (m) return m[1].toLowerCase();
  return null;
}

// Render the "chapter locked" page served by middleware when a student tries
// to access a chapter they haven't unlocked yet.
function renderChapterLockedHTML(opts) {
  const { courseCode, chapterNum, prevCh, prevProgress } = opts;
  const UPPER = courseCode.toUpperCase();

  const prevCompleted = prevProgress && prevProgress.completed;
  const asOk  = prevProgress && prevProgress.as_done;
  const forOk = prevProgress && prevProgress.for_done;
  const ofOk  = prevProgress && prevProgress.of_passed;

  function row(label, done) {
    return `<li style="padding:6px 0;display:flex;align-items:center;gap:10px;">
      <span style="font-size:18px;">${done ? '✅' : '⏳'}</span>
      <span style="${done ? 'color:#065f46;' : 'color:#475569;'}">${label}</span>
    </li>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Unit ${chapterNum} Locked — ${UPPER}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#f1f5f9;
  min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;
  max-width:560px;width:100%;padding:40px 36px;box-shadow:0 4px 16px rgba(15,23,42,0.07);}
.icon{font-size:52px;margin-bottom:14px;}
h1{font-size:22px;font-weight:900;color:#0f172a;margin-bottom:10px;}
p{font-size:14px;color:#475569;line-height:1.6;margin-bottom:16px;}
ul{list-style:none;padding:0;background:#f8fafc;border-radius:10px;
  border:1px solid #e2e8f0;padding:14px 18px;margin-bottom:20px;}
.actions{display:flex;gap:10px;flex-wrap:wrap;}
a.btn{display:inline-block;padding:10px 18px;border-radius:8px;
  font-size:14px;font-weight:700;text-decoration:none;}
.btn-primary{background:#2563eb;color:#fff;}
.btn-ghost{background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;}
</style>
</head>
<body>
<div class="card">
  <div class="icon">🔒</div>
  <h1>Chapter ${chapterNum} is locked</h1>
  <p>
    <strong>${UPPER} — Chapter ${chapterNum}</strong> is not yet available.
    You must complete <strong>Chapter ${prevCh}</strong> before proceeding.
    Your teacher will unlock the next chapter once all required assessments are passed.
  </p>
  <p style="font-weight:700;color:#1e293b;">Chapter ${prevCh} status:</p>
  <ul>
    ${row('AS Practice Quiz — completed', asOk)}
    ${row('FOR Diagnostic — teacher reviewed', forOk)}
    ${row('OF Unit Test — passed', ofOk)}
  </ul>
  <p style="font-size:13px;">
    ${prevCompleted
      ? '✅ Chapter ' + prevCh + ' is complete. Contact your teacher if this chapter is still locked.'
      : 'Contact your teacher when you have submitted your Chapter ' + prevCh + ' papers. They will record your results and unlock the next chapter.'}
  </p>
  <div class="actions">
    <a href="/courses/${courseCode}.html" class="btn btn-primary">← Back to course</a>
    <a href="/courses/${courseCode}/ch${prevCh}.html" class="btn btn-ghost">Go to Chapter ${prevCh}</a>
  </div>
</div>
</body>
</html>`;
}

// Render "Final Exam locked" page.
function renderFinalExamLockedHTML(courseCode) {
  const UPPER = courseCode.toUpperCase();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Final Exam Locked — ${UPPER}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#f1f5f9;
  min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;max-width:520px;
  width:100%;padding:40px 36px;box-shadow:0 4px 16px rgba(15,23,42,0.07);}
.icon{font-size:52px;margin-bottom:14px;}
h1{font-size:22px;font-weight:900;color:#0f172a;margin-bottom:10px;}
p{font-size:14px;color:#475569;line-height:1.6;margin-bottom:16px;}
a.btn{display:inline-block;padding:10px 18px;border-radius:8px;
  font-size:14px;font-weight:700;text-decoration:none;background:#2563eb;color:#fff;}
</style>
</head>
<body>
<div class="card">
  <div class="icon">📋</div>
  <h1>Final Exam — not yet unlocked</h1>
  <p>
    The <strong>${UPPER} Final Exam</strong> is only available after you have passed all
    unit tests (OF assessments) in every chapter of this course.
    Your teacher will unlock the Final Exam when you are ready.
  </p>
  <p>
    If you believe all units are complete, contact your teacher and ask them to
    review your progress on the <strong>Admin → Student Progress</strong> panel.
  </p>
  <a href="/courses/${courseCode}.html" class="btn">← Back to course</a>
</div>
</body>
</html>`;
}

// ── Supervised assessment helpers ─────────────────────────────────────────

// Returns true when the path is a FOR/OF/Final assessment that must be
// teacher-unlocked before a student can view the questions.
function isSupervisedAssessmentPath(pathname) {
  const p = pathname.toUpperCase();
  return (
    p.endsWith('_FOR.HTML') || p.endsWith('_OF.HTML') ||
    p.includes('_CH') && (p.endsWith('_FOR.HTML') || p.endsWith('_OF.HTML')) ||
    /\/FINAL_EXAM\.HTML$/.test(p) || /_FINAL_EXAM\.HTML$/.test(p)
  );
}

// Normalise path to a KV-safe slug (mirrors assessment-unlock.js slugify).
function slugifyPath(path) {
  return path
    .replace(/^\/+/, '')
    .replace(/\.html?$/i, '')
    .replace(/[^a-zA-Z0-9_-]/g, '__');
}

// Determine exam type label from path.
function examTypeLabel(path) {
  const p = path.toUpperCase();
  if (/FINAL_EXAM|_FINAL_EXAM/.test(p)) return 'Final Exam';
  if (/_FOR\.HTML|_CH\d+_FOR/.test(p)) return 'Diagnostic (FOR)';
  if (/_OF\.HTML|_CH\d+_OF/.test(p))  return 'Unit Test (OF)';
  return 'Assessment';
}

// Determine time limit (minutes) from path.
function examTimeLimit(path) {
  const p = path.toUpperCase();
  if (/FINAL_EXAM|_FINAL_EXAM/.test(p)) return 120;
  if (/_FOR\.HTML|_CH\d+_FOR/.test(p)) return 30;
  return 60;
}

// Parse course code from assessment path.
function courseCodeFromPath(path) {
  const m = path.match(/\/assessments\/([a-z0-9]+)\//i) ||
             path.match(/\/assessments\/([a-z0-9]+)_/i);
  return m ? m[1].toUpperCase() : '';
}

// Build a Jitsi room URL (same format as assessment-workflow.js).
function buildJitsiUrl(path, userId) {
  const code = courseCodeFromPath(path);
  const today = new Date();
  const dateStr = today.getFullYear() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0');
  const slug = (code + '-' + slugifyPath(path).slice(-30) + '-' + dateStr)
    .replace(/[^a-zA-Z0-9-]/g, '-').replace(/-{2,}/g, '-').slice(0, 60);
  return 'https://meet.jit.si/MindViewAcademy-' + slug;
}

// ─────────────────────────────────────────────────────────────────────────────
// Render the LOCKED assessment page that students see before unlock.
// Questions are NEVER included — this page replaces the real assessment HTML.
// ─────────────────────────────────────────────────────────────────────────────
function renderLockedAssessmentHTML(opts) {
  const { path, email, userId, status, jitsiUrl, typeLabel, timeLimit, courseCode } = opts;
  const encPath = encodeURIComponent(path);
  const isRequested = status === 'requested';

  const printerSection = `
    <div id="step-printer" class="step-card">
      <div class="step-num">1</div>
      <div class="step-body">
        <h3>Confirm your printer is ready</h3>
        <p>Ontario standards require you to handwrite your answers on the printed question paper.
           You must have a working printer <strong>before</strong> your teacher unlocks the assessment.</p>
        <label class="check-row" for="printer-ok">
          <input type="checkbox" id="printer-ok" onchange="checkPrinter()">
          <span>My printer is ON, paper is loaded, and I have tested a test print.</span>
        </label>
      </div>
    </div>`;

  const requestSection = `
    <div id="step-request" class="step-card disabled" id="step-request">
      <div class="step-num">2</div>
      <div class="step-body">
        <h3>${isRequested ? '⏳ Waiting for your teacher…' : 'Request your teacher to come online'}</h3>
        <p>${isRequested
            ? 'Your unlock request has been sent. Your teacher will see it on their admin panel. This page checks automatically every 8 seconds — do not refresh.'
            : 'Once your printer is confirmed ready, click below to notify your teacher. They will join the Jitsi video session and unlock your assessment.'}</p>
        ${isRequested
          ? `<div class="waiting-anim">⏱ Waiting for teacher approval…</div>`
          : `<button class="act-btn" id="req-btn" disabled onclick="sendRequest()">
               📩 Notify teacher &amp; request unlock
             </button>`}
        <div class="jitsi-box">
          <p><strong>📹 Join this video session with your teacher</strong></p>
          <a href="${jitsiUrl}" target="_blank" rel="noopener">${jitsiUrl}</a>
          <p style="font-size:12px;margin-top:6px;color:#475569;">Share this link with your teacher so they can join and supervise.</p>
        </div>
      </div>
    </div>`;

  const waitSection = `
    <div id="step-wait" class="step-card disabled">
      <div class="step-num">3</div>
      <div class="step-body">
        <h3>Teacher unlocks → you print immediately</h3>
        <p>When your teacher clicks "Unlock" in their admin panel, this page will automatically
           refresh and show the questions. <strong>Print the paper immediately</strong> while
           your teacher is watching.</p>
        <ul style="font-size:14px;color:#475569;padding-left:18px;line-height:1.9;">
          <li>Print all pages of the question paper</li>
          <li>Confirm page count with your teacher</li>
          <li>Begin writing — you have <strong>${timeLimit} minutes</strong></li>
          <li>Submit your completed paper directly to your teacher</li>
        </ul>
      </div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Assessment Locked — ${courseCode} ${typeLabel}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#f1f5f9;color:#1e293b;min-height:100vh;padding:24px 16px;}
.outer{max-width:620px;margin:0 auto;}
.hdr{background:#1e3a8a;color:#fff;border-radius:14px;padding:26px 28px;margin-bottom:20px;}
.hdr h1{font-size:20px;font-weight:800;margin-bottom:4px;}
.hdr p{font-size:14px;opacity:0.85;}
.badge{display:inline-block;background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:10px;}
.step-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:22px 22px 22px 70px;margin-bottom:16px;position:relative;transition:opacity .2s;}
.step-card.disabled{opacity:0.45;pointer-events:none;}
.step-num{position:absolute;left:18px;top:22px;width:36px;height:36px;background:#2563eb;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;}
.step-body h3{font-size:16px;font-weight:800;margin-bottom:8px;}
.step-body p{font-size:14px;color:#475569;line-height:1.6;margin-bottom:12px;}
.step-body ul{font-size:14px;color:#475569;}
.check-row{display:flex;align-items:flex-start;gap:10px;cursor:pointer;padding:12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;}
.check-row input{width:18px;height:18px;flex-shrink:0;margin-top:1px;cursor:pointer;accent-color:#2563eb;}
.act-btn{background:#2563eb;color:#fff;border:none;border-radius:10px;padding:13px 24px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;margin-top:4px;}
.act-btn:hover:not(:disabled){background:#1d4ed8;}
.act-btn:disabled{background:#94a3b8;cursor:not-allowed;}
.jitsi-box{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 16px;margin-top:12px;}
.jitsi-box a{color:#2563eb;font-weight:700;word-break:break-all;font-size:13px;}
.waiting-anim{font-size:14px;font-weight:700;color:#7c3aed;padding:10px 0;}
.footer-note{font-size:12px;color:#94a3b8;text-align:center;margin-top:18px;line-height:1.6;}
@keyframes spin{to{transform:rotate(360deg)}}
</style>
</head>
<body>
<div class="outer">
  <div class="hdr">
    <div class="badge">🔒 LOCKED — Teacher unlock required</div>
    <h1>${courseCode} — ${typeLabel}</h1>
    <p>This supervised assessment cannot be viewed until your teacher explicitly unlocks it.
       Questions will never appear in your browser before that point.</p>
  </div>

  ${printerSection}
  ${requestSection}
  ${waitSection}

  <p class="footer-note">
    Signed in as <strong>${email}</strong> &nbsp;·&nbsp;
    <a href="/api/logout" style="color:#94a3b8;">Sign out</a>
  </p>
</div>

<script>
var ASSESSMENT_PATH = ${JSON.stringify(path)};
var JITSI_URL = ${JSON.stringify(jitsiUrl)};
var POLL_INTERVAL = 8000; // ms between status checks
var printerConfirmed = ${isRequested ? 'true' : 'false'};
var requested = ${isRequested ? 'true' : 'false'};
var polling = null;

function checkPrinter() {
  printerConfirmed = document.getElementById('printer-ok').checked;
  var step2 = document.getElementById('step-request');
  var reqBtn = document.getElementById('req-btn');
  if (printerConfirmed) {
    step2 && step2.classList.remove('disabled');
    reqBtn && (reqBtn.disabled = false);
  } else {
    step2 && step2.classList.add('disabled');
    reqBtn && (reqBtn.disabled = true);
  }
}

async function sendRequest() {
  var btn = document.getElementById('req-btn');
  if (btn) btn.disabled = true;
  try {
    var r = await fetch('/api/assessment-unlock', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      credentials: 'same-origin',
      body: JSON.stringify({ action:'request', path: ASSESSMENT_PATH, jitsiRoom: JITSI_URL })
    });
    var data = await r.json();
    if (!r.ok) { alert('Error: ' + data.error); if(btn) btn.disabled=false; return; }
    requested = true;
    // Update UI
    var step2 = document.getElementById('step-request');
    if (step2) step2.querySelector('.step-body').innerHTML =
      '<h3>⏳ Waiting for your teacher…</h3>' +
      '<p>Your request has been sent. Your teacher will see it on their admin panel. ' +
      'This page checks automatically — do not refresh.</p>' +
      '<div class="waiting-anim">⏱ Waiting for teacher approval…</div>' +
      '<div class="jitsi-box"><p><strong>📹 Join this video session with your teacher</strong></p>' +
      '<a href="' + JITSI_URL + '" target="_blank">' + JITSI_URL + '</a></div>';
  } catch(e) {
    alert('Network error. Please try again.'); if(btn) btn.disabled=false;
  }
  startPolling();
}

async function pollStatus() {
  try {
    var r = await fetch('/api/assessment-unlock?path=' + encodeURIComponent(ASSESSMENT_PATH),
                        { credentials: 'same-origin' });
    if (!r.ok) return;
    var data = await r.json();
    if (data.status === 'granted') {
      // Questions are now unlocked — reload so middleware serves the real HTML
      clearInterval(polling);
      document.body.innerHTML = '<div style="padding:60px;text-align:center;font-size:20px;font-weight:800;color:#059669;">✅ Teacher unlocked your assessment!<br><span style="font-size:15px;font-weight:400;color:#475569;">Loading questions…</span></div>';
      setTimeout(function() { location.reload(); }, 800);
    }
  } catch(e) { /* ignore network errors during polling */ }
}

function startPolling() {
  if (polling) clearInterval(polling);
  polling = setInterval(pollStatus, POLL_INTERVAL);
}

// Auto-start polling if already requested
if (requested) {
  startPolling();
  // Enable step 2 UI
  var step2 = document.getElementById('step-request');
  step2 && step2.classList.remove('disabled');
}
</script>
</body>
</html>`;
}

// Paths that are always allowed through without a valid session.
// Note: trailing slashes are normalized away before matching.
const PUBLIC_EXACT = new Set([
  '/login',
  '/admin/login',       // Cloudflare Pages strips .html — destination of the /login rewrite
  '/admin/login.html',  // direct hit (if anyone links to it explicitly)
  '/api/login',
  '/api/logout',
  '/api/bootstrap',
  '/api/me',
  '/logo.png',
  // Public policy pages — referenced from the home-page footer, intended
  // to be readable without a login (legal compliance + prospective-
  // student transparency).
  '/video-policy',
  '/video-policy.html',
  '/privacy-policy',
  '/privacy-policy.html',
  '/refund-policy',
  '/refund-policy.html',
  '/accessibility',
  '/accessibility.html',
  '/enrollment-terms',
  '/enrollment-terms.html',
]);

// Lowercased file extensions that are always treated as public static assets.
const STATIC_EXTENSIONS = new Set([
  '.css',
  '.js',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.map',
]);

function getExtension(pathname) {
  // Last segment of the path, then the substring from the last "." onwards.
  const lastSlash = pathname.lastIndexOf('/');
  const lastSeg = lastSlash >= 0 ? pathname.slice(lastSlash + 1) : pathname;
  const dot = lastSeg.lastIndexOf('.');
  if (dot <= 0) return '';
  return lastSeg.slice(dot).toLowerCase();
}

function isPublic(pathname) {
  // Normalize: strip trailing slash unless it's the root.
  let p = pathname;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  if (PUBLIC_EXACT.has(p)) return true;
  const ext = getExtension(p);
  if (ext && STATIC_EXTENSIONS.has(ext)) return true;
  return false;
}

// Paths where we deliberately do NOT inject the content-protection script.
// The script self-skips on these too, but skipping the inject avoids a
// pointless network fetch on the login screen.
const NO_INJECT_PATHS = new Set([
  '/login',
  '/admin/login',
  '/admin/login.html',
]);

function shouldInject(pathname) {
  let p = pathname;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return !NO_INJECT_PATHS.has(p);
}

// Wrap a downstream Response: if it's an HTML response, inject the
// content-protection AND role-gated script tags at the end of <head> via
// HTMLRewriter. Non-HTML responses (JSON, CSS, JS, images, redirects, 401s,
// etc.) are returned unchanged.
//
// The two scripts are independent and complementary:
//   - content-protection.js disables copy/paste/right-click/etc for
//     non-superusers (educational integrity for the lesson notes).
//   - role-gated.js hides .instructor-only content (answer keys, solutions,
//     rubrics) from students — only teachers / admins / superusers can see
//     it. Loaded together so both apply on every page.
// Staging-mode banner injected into <body> when NOT on production.
// Reminds testers that the enrolment gate is bypassed on this environment.
function stagingBannerHTML() {
  return `<div id="mv-staging-banner" style="
    position:fixed;bottom:0;left:0;right:0;z-index:9999;
    background:#7c3aed;color:#fff;
    padding:8px 16px;font-size:13px;font-weight:700;
    display:flex;align-items:center;justify-content:center;gap:12px;
    font-family:'Segoe UI',system-ui,sans-serif;
    box-shadow:0 -2px 10px rgba(124,58,237,0.4);">
    🧪 STAGING MODE — Enrolment gate disabled · All 40 courses open for all roles · Production students remain restricted
    <button onclick="document.getElementById('mv-staging-banner').remove()"
      style="background:rgba(255,255,255,0.2);border:none;color:#fff;
      padding:2px 10px;border-radius:6px;cursor:pointer;font-weight:700;">✕</button>
  </div>`;
}

function withProtectionInjected(response, pathname, isProduction) {
  if (!response) return response;
  if (!shouldInject(pathname)) return response;
  const ct = response.headers.get('content-type') || '';
  if (!ct.toLowerCase().includes('text/html')) return response;
  const showStagingBanner = !isProduction;
  return new HTMLRewriter()
    .on('head', {
      element(el) {
        el.append(
          '<script src="/js/content-protection.js" defer></script>',
          { html: true }
        );
        el.append(
          '<script src="/js/role-gated.js" defer></script>',
          { html: true }
        );
        // Universal three-button page-nav widget (Back / Back-to-course /
        // Forward) — added 2026-06-01 per owner request. Self-injects via
        // DOMContentLoaded; auto-detects course context from the URL.
        el.append(
          '<script src="/js/page-nav.js" defer></script>',
          { html: true }
        );
        // Handwritten assessment workflow — added 2026-06-03 per owner request.
        // Ontario standards compliance: physical answer sheets required for
        // inspections. Self-skips on non-assessment pages. On /assessments/*:
        //   - Disables all MC radio buttons, Check buttons, inline solutions
        //   - Adds "Print Question Paper" button + mailing instructions
        //   - FOR/OF/Final Exam: shows supervised-session gate (Jitsi video
        //     link + countdown timer) before questions are accessible
        el.append(
          '<script src="/js/assessment-workflow.js" defer></script>',
          { html: true }
        );
      },
    })
    .on('body', {
      element(el) {
        // Staging-mode banner — only on non-production hosts. Reminds testers
        // that the enrolment gate is bypassed and all 40 courses are open.
        if (showStagingBanner) {
          el.append(stagingBannerHTML(), { html: true });
        }
      },
    })
    .transform(response);
}

// Friendly "you're not enrolled in this course yet" landing page. Rendered
// by the middleware (NOT by an HTML file in /enrolment/) so it works for
// every blocked URL without needing per-course redirects. Course display
// names are kept in sync with the home-page layout — when adding a new
// course, update this map AND scripts/_rebuild_index_grid.py's LAYOUT.
const COURSE_DISPLAY_NAMES = {
  mcr3u: 'MCR3U — Functions (Grade 11)',
  mhf4u: 'MHF4U — Advanced Functions (Grade 12)',
  mcv4u: 'MCV4U — Calculus and Vectors (Grade 12)',
  mdm4u: 'MDM4U — Mathematics of Data Management (Grade 12)',
  mct3m: 'MCT3M — Mathematics for College Technology (Grade 11)',
  mct4m: 'MCT4M — Mathematics for College Technology (Grade 12)',
  snc2d: 'SNC2D — Science Academic (Grade 10)',
  sbi3u: 'SBI3U — Biology (Grade 11)',
  sbi4u: 'SBI4U — Biology (Grade 12)',
  sch3u: 'SCH3U — Chemistry (Grade 11)',
  sch4u: 'SCH4U — Chemistry (Grade 12)',
  sph3u: 'SPH3U — Physics (Grade 11)',
  sph4u: 'SPH4U — Physics (Grade 12)',
  eng2d: 'ENG2D — English Academic (Grade 10)',
  eng3u: 'ENG3U — English (Grade 11)',
  eng4u: 'ENG4U — English (Grade 12)',
  ics3u: 'ICS3U — Introduction to Computer Science (Grade 11)',
  ics4u: 'ICS4U — Computer Science (Grade 12)',
  chv2o: 'CHV2O — Civics and Citizenship (Grade 10)',
  cpc3o: 'CPC3O — Politics in Action: Making Change (Grade 11)',
  cpw4u: 'CPW4U — Canadian and World Politics (Grade 12)',
  chc2d: 'CHC2D — Canadian History since World War I (Grade 10)',
  chw3m: 'CHW3M — World History to the Sixteenth Century (Grade 11)',
  chy4u: 'CHY4U — World History since the Fifteenth Century (Grade 12)',
  clu3m: 'CLU3M — Understanding Canadian Law (Grade 11)',
  cln4u: 'CLN4U — Canadian and International Law (Grade 12)',
  cgf3m: 'CGF3M — Physical Geography (Grade 11)',
  cgw4u: 'CGW4U — World Issues: A Geographic Analysis (Grade 12)',
  baf3m: 'BAF3M — Financial Accounting Fundamentals (Grade 11)',
  bat4m: 'BAT4M — Financial Accounting Principles (Grade 12)',
  bbb4m: 'BBB4M — International Business Fundamentals (Grade 12)',
  boh4m: 'BOH4M — Business Leadership: Management Fundamentals (Grade 12)',
  hfn3m: 'HFN3M — Nutrition and Health (Grade 11)',
  hfa4m: 'HFA4M — Nutrition and Health Issues (Grade 12)',
  hsc4m: 'HSC4M — World Cultures (Grade 12)',
  glc2o: 'GLC2O — Career Studies (Grade 10)',
  gwl3o: 'GWL3O — Designing Your Future (Grade 11)',
  gpp3o: 'GPP3O — Leadership and Peer Support (Grade 11)',
  gle3o: 'GLE3O — Advanced Learning Strategies (Grade 11)',
  gle4o: 'GLE4O — Advanced Learning Strategies: After Secondary School (Grade 12)',
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderEnrolmentRequiredHTML(courseCode, studentEmail) {
  const displayName = COURSE_DISPLAY_NAMES[courseCode]
    || courseCode.toUpperCase();
  const landingHref = `/courses/${encodeURIComponent(courseCode)}.html`;
  const safeName = escapeHtml(displayName);
  const safeEmail = escapeHtml(studentEmail || '');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Enrolment required — ${safeName}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#f8fafc;color:#1e293b;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;max-width:560px;width:100%;padding:42px 36px;box-shadow:0 4px 18px rgba(15,23,42,0.06);}
.icon{font-size:48px;margin-bottom:14px;}
h1{font-size:24px;font-weight:800;margin-bottom:10px;color:#0f172a;}
.course-line{display:inline-block;background:#fef3c7;color:#78350f;padding:6px 12px;border-radius:8px;font-weight:700;font-size:14px;margin-bottom:18px;}
p{color:#475569;line-height:1.6;margin-bottom:14px;}
.steps{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;margin:18px 0;}
.steps ol{padding-left:22px;}
.steps li{margin-bottom:6px;color:#334155;}
.actions{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap;}
.btn{display:inline-block;padding:10px 18px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;border:1px solid transparent;}
.btn.primary{background:#2563eb;color:#fff;}
.btn.primary:hover{background:#1d4ed8;}
.btn.ghost{background:#fff;color:#475569;border-color:#e2e8f0;}
.btn.ghost:hover{border-color:#94a3b8;}
.email-note{font-size:13px;color:#64748b;margin-top:18px;border-top:1px solid #e2e8f0;padding-top:14px;}
.email-note a{color:#2563eb;font-weight:600;text-decoration:none;}
</style>
</head>
<body>
<div class="card">
  <div class="icon">🔒</div>
  <h1>Enrolment required to view this content</h1>
  <div class="course-line">${safeName}</div>
  <p>You're signed in, but you haven't been enrolled in this course yet. The lessons, videos, and assessments for this course are reserved for enrolled students.</p>
  <div class="steps">
    <strong style="display:block;margin-bottom:8px;color:#0f172a;">To get access:</strong>
    <ol>
      <li>Decide which courses you'd like to add.</li>
      <li>Email an administrator with your name, account email, and the courses you want to enrol in.</li>
      <li>An admin will update your account; refresh this page once you're enrolled.</li>
    </ol>
  </div>
  <div class="actions">
    <a class="btn ghost" href="${landingHref}">← Back to course overview</a>
    <a class="btn ghost" href="/">All courses</a>
  </div>
  <p class="email-note">Signed in as <a href="/api/logout">${safeEmail}</a>. See the home page <a href="/#enrolment">Enrolment &amp; Tuition</a> section for fees and contact information.</p>
</div>
</body>
</html>`;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Always allow CORS preflights through unscathed.
  if (request.method === 'OPTIONS') return next();

  // Determine once whether we're on the production domain (used for
  // enrolment-gate enforcement and staging-mode banner).
  const isProductionHost = url.hostname === 'mindview.pages.dev';

  if (isPublic(url.pathname)) {
    // Public path (login page, /api/me, static assets, index, etc.) — still
    // inject the protection script if the response turns out to be HTML.
    const res = await next();
    return withProtectionInjected(res, url.pathname, isProductionHost);
  }

  if (!env.SESSION_SECRET) {
    return new Response(
      JSON.stringify({
        error:
          'SESSION_SECRET is not configured. Set it as a Pages environment variable in the Cloudflare dashboard.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const payload = await readSessionFromRequest(request, env.SESSION_SECRET);
  if (payload) {
    // Per-student course-enrolment gate. If the requester is a student AND
    // they're trying to access content INSIDE a course folder (chapters,
    // lessons, assessments — but NOT the landing page /courses/{code}.html),
    // verify they're enrolled in that course. Other roles bypass this check.
    //
    // STAGING BYPASS (2026-06-03, owner-approved):
    // When running on staging.mindview.pages.dev (or any *.mindview.pages.dev
    // preview deployment that is NOT the production domain), the enrolment
    // gate is disabled so the owner and all test accounts can browse every
    // course across every role without manual enrolment setup.
    // Production (mindview.pages.dev) always enforces enrolment normally.
    const isProductionHost = url.hostname === 'mindview.pages.dev';
    const enrollmentEnforced = isProductionHost;  // false on staging/preview

    if (payload.role === 'student' && enrollmentEnforced) {
      const m = url.pathname.match(/^\/courses\/([a-z0-9]+)\/(.+)$/i);
      if (m) {
        const courseCode = m[1].toLowerCase();
        let enrolled = [];
        if (env.USERS_KV) {
          try {
            const rec = await env.USERS_KV.get(payload.sub, { type: 'json' });
            if (rec && Array.isArray(rec.enrolled_courses)) {
              enrolled = rec.enrolled_courses;
            }
          } catch {
            // KV error → fail closed: treat as not enrolled.
          }
        }
        if (!enrolled.includes(courseCode)) {
          return new Response(
            renderEnrolmentRequiredHTML(courseCode, payload.email),
            {
              status: 200,  // 200 so the user sees the page; the body explains
              headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store',
              },
            }
          );
        }
      }
    }
    // ── Sequential unit-progression gate ─────────────────────────────
    // For students: chapters beyond ch1 are locked until the teacher marks
    // the previous chapter's OF assessment as passed (stored in USERS_KV).
    // The Final Exam is locked until the teacher explicitly unlocks it.
    // Teachers / admins / superusers always bypass this gate.
    if (payload.role === 'student') {
      // Gate 1: chapter pages
      const chapInfo = parseChapterUrl(url.pathname);
      if (chapInfo && chapInfo.ch > 1) {
        const prevCh = chapInfo.ch - 1;
        let prevProgress = null;
        if (env.USERS_KV) {
          try {
            const progKey = `progress:${payload.sub}:${chapInfo.code}`;
            const prog = await env.USERS_KV.get(progKey, 'json');
            if (prog) prevProgress = prog[`ch${prevCh}`] || null;
          } catch { /* KV error → locked */ }
        }
        const prevCompleted = prevProgress && prevProgress.completed;
        if (!prevCompleted) {
          return new Response(
            renderChapterLockedHTML({
              courseCode: chapInfo.code,
              chapterNum: chapInfo.ch,
              prevCh,
              prevProgress,
            }),
            { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
          );
        }
      }

      // Gate 2: final exam
      if (isFinalExamUrl(url.pathname)) {
        const code = courseFromFinalExamUrl(url.pathname);
        if (code) {
          let finalUnlocked = false;
          if (env.USERS_KV) {
            try {
              const progKey = `progress:${payload.sub}:${code}`;
              const prog = await env.USERS_KV.get(progKey, 'json');
              finalUnlocked = !!(prog && prog.final_unlocked);
            } catch { /* locked */ }
          }
          if (!finalUnlocked) {
            return new Response(
              renderFinalExamLockedHTML(code),
              { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
            );
          }
        }
      }
    }
    // ──────────────────────────────────────────────────────────────────

    // ── Server-side supervised-assessment lock ────────────────────────
    // FOR diagnostics, OF unit tests, and Final Exams may only be viewed
    // by students after an explicit teacher unlock stored in USERS_KV.
    // Questions NEVER reach the student's browser until the grant exists;
    // we serve a "locked" HTML page instead of the real assessment HTML.
    // Teachers / admins / superusers always see the real page.
    if (payload.role === 'student' && isSupervisedAssessmentPath(url.pathname)) {
      let unlockStatus = 'locked';
      if (env.USERS_KV) {
        try {
          const slug = slugifyPath(url.pathname);
          const grantKey = `unlock-grant:${payload.sub}:${slug}`;
          const grant = await env.USERS_KV.get(grantKey, 'json');
          if (grant && Date.now() < grant.expiresAt) {
            unlockStatus = 'granted';
          } else {
            // Check if there's a pending request so the UI can reflect it
            const reqKey = `unlock-req:${payload.sub}:${slug}`;
            const req = await env.USERS_KV.get(reqKey, 'json');
            if (req) unlockStatus = 'requested';
          }
        } catch { /* KV error — treat as locked */ }
      }
      if (unlockStatus !== 'granted') {
        const courseCode = courseCodeFromPath(url.pathname);
        const typeLabel = examTypeLabel(url.pathname);
        const timeLimit = examTimeLimit(url.pathname);
        const jitsiUrl = buildJitsiUrl(url.pathname, payload.sub);
        return new Response(
          renderLockedAssessmentHTML({
            path: url.pathname,
            email: payload.email,
            userId: payload.sub,
            status: unlockStatus,
            jitsiUrl,
            typeLabel,
            timeLimit,
            courseCode,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-store, no-cache',
            },
          }
        );
      }
    }
    // ─────────────────────────────────────────────────────────────────

    // Authenticated (and, for students, enrolled in this course's content
    // OR not browsing course content). Let downstream handler / static asset
    // serve, then inject the protection script into any HTML response.
    const res = await next();
    return withProtectionInjected(res, url.pathname, isProductionHost);
  }

  // Not authenticated. For HTML / page navigations, redirect to /login with
  // a `next` param so the login page can bounce back. For API calls, return
  // 401 JSON so XHR / fetch callers can react without a confusing 302.
  // (Neither of these is an HTML body, so no injection here.)
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const nextTarget = url.pathname + url.search;
  const loginUrl = `/login?next=${encodeURIComponent(nextTarget)}`;
  return new Response(null, {
    status: 302,
    headers: {
      Location: loginUrl,
      'Cache-Control': 'no-store',
    },
  });
}
