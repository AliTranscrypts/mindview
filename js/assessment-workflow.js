// js/assessment-workflow.js
// ─────────────────────────────────────────────────────────────────────────────
// MindView Academy — Handwritten Assessment Workflow
// Ontario curriculum standards compliance: physical question/answer sheets
// are required for school inspection. Students print and handwrite answers;
// teacher marks physical papers; FOR/OF/Final Exams are invigilated in
// real-time by a teacher (in-person or via Jitsi video link).
//
// This script is auto-injected by functions/_middleware.js on every HTML
// page. It self-skips on pages that are not assessment files.
//
// STUDENT workflow
// ────────────────
//   AS  (Practice Quiz):
//     • All MC radio buttons disabled (cannot click)
//     • All Check/Verify buttons removed
//     • All inline solution reveals hidden
//     • "Print Question Paper" button shown at top
//     • Submission instructions: write answers → mail to teacher
//
//   FOR (Diagnostic) / OF (Unit Test) / Final Exam:
//     • Same disabling as AS PLUS:
//     • Assessment is GATED behind a pre-session screen showing:
//         – Jitsi video meeting link (auto-generated, unique per session)
//         – Exam conditions notice (closed book, no devices)
//         – Allocated time limit (FOR=30 min, OF=60 min, Final=120 min)
//     • "Start Exam with Teacher" button begins countdown timer
//     • Timer is fixed to viewport top-right at all times
//     • When timer reaches 0: "Time's up" overlay with submission instructions
//
// TEACHER / ADMIN / SUPERUSER workflow
// ─────────────────────────────────────
//   Same Jitsi link displayed so the teacher can join the video session.
//   All other functionality unchanged (can see answers, rubrics, etc.).
//
// Owner-approved 2026-06-03.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // ── 1. Detect assessment page ─────────────────────────────────────────────
  var path = location.pathname;

  // Only run on /assessments/... pages
  var isAssessment = path.indexOf('/assessments/') !== -1;
  if (!isAssessment) return;

  // Determine assessment type from URL. Pages redirects /x.html to the clean
  // URL /x, so match on a canonical "*.html" form of the path; matching the raw
  // path only worked for *.html URLs, which students never end up on.
  var htmlPath = path.replace(/\/+$/, '');
  if (!/\.html?$/i.test(htmlPath)) htmlPath += '.html';
  var pathUpper = htmlPath.toUpperCase();
  var isAS    = /_AS\.HTML$/.test(pathUpper) || /_CH\d+_AS\.HTML$/.test(pathUpper);
  var isFOR   = /_FOR\.HTML$/.test(pathUpper) || /_CH\d+_FOR\.HTML$/.test(pathUpper);
  var isOF    = /_OF\.HTML$/.test(pathUpper) || /_CH\d+_OF\.HTML$/.test(pathUpper);
  var isFinal = /FINAL_EXAM\.HTML$/.test(pathUpper) || /_FINAL_EXAM\.HTML$/.test(pathUpper);
  var isSupervised = isFOR || isOF || isFinal;

  // Time limits (minutes)
  var TIME_LIMITS = { FOR: 30, OF: 60, Final: 120 };
  var timeLimit = isFOR ? TIME_LIMITS.FOR : isOF ? TIME_LIMITS.OF : TIME_LIMITS.Final;

  // ── 2. Parse course code and unit name from path ──────────────────────────
  function parseCourseContext() {
    // Pattern: /assessments/{code}/{filename}.html  OR  /assessments/{code}_ch{N}_{type}.html
    var code = '', unitSlug = '';
    var mDir = htmlPath.match(/\/assessments\/([a-z0-9]+)\/([^/]+)\.html$/i);
    if (mDir) {
      code = mDir[1].toUpperCase();
      unitSlug = mDir[2].replace(/_?(AS|FOR|OF|Final_Exam)$/i, '').replace(/_/g, '-');
    } else {
      var mFlat = htmlPath.match(/\/assessments\/([a-z0-9]+)_ch(\d+)_[a-z]+\.html$/i);
      if (mFlat) {
        code = mFlat[1].toUpperCase();
        unitSlug = 'Ch' + mFlat[2];
      } else {
        var mFinalFlat = htmlPath.match(/\/assessments\/([a-z0-9]+)_final_exam\.html$/i);
        if (mFinalFlat) {
          code = mFinalFlat[1].toUpperCase();
          unitSlug = 'Final';
        }
      }
    }
    return { code: code, unitSlug: unitSlug || 'Assessment' };
  }
  var ctx = parseCourseContext();

  // ── 3. Generate unique Jitsi room URL ─────────────────────────────────────
  // Room = MindViewAcademy-{CODE}-{UnitSlug}-{YYYYMMDD}
  // Same URL for both student and teacher on the same day.
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      ('0' + d.getDate()).slice(-2);
  }
  function buildJitsiUrl() {
    var slug = (ctx.code + '-' + ctx.unitSlug + '-' + todayISO())
      .replace(/[^a-zA-Z0-9-]/g, '-').replace(/-{2,}/g, '-');
    return 'https://meet.jit.si/MindViewAcademy-' + slug;
  }

  // ── 4. Inject global print CSS ────────────────────────────────────────────
  function injectPrintCSS() {
    var s = document.createElement('style');
    s.textContent = [
      '@media print {',
      '  .page-nav, .navbar, .chnav-btn, .chnav-finish,',
      '  button, .btn, .btn-check,',
      '  .mv-assessment-banner, .mv-gate-overlay, .mv-timer-chip,',
      '  .mv-teacher-panel, .mv-submit-panel, footer, nav { display:none !important; }',
      '  body { padding:0!important; font-family:"Times New Roman",serif; font-size:12pt; color:#000; }',
      '  .mv-print-header { display:block !important; }',
      '  header h1 { font-size:16pt; font-weight:bold; margin-bottom:4pt; }',
      '  .question-card, .q { page-break-inside:avoid; margin-bottom:18pt; }',
      '  /* Show MC options as plain text list, no circles */',
      '  input[type="radio"] { display:none !important; }',
      '  label { display:block; margin-bottom:4pt; }',
      '  /* Hide solution/answer divs entirely */',
      '  .sol, .solution, .instructor-only, .fb,',
      '  .Communication-Category-Rubric { display:none !important; }',
      '  /* Textareas become ruled answer spaces */',
      '  textarea { display:none !important; }',
      '  .mv-answer-lines { display:block !important; }',
      '  .mv-answer-line { border-bottom:1px solid #aaa; margin:6pt 0; height:18pt; }',
      '}',
      /* Screen styles for the custom elements we add */
      '.mv-print-header { display:none; }',  /* only shown in print */
      '.mv-answer-lines { display:none; }',  /* only shown in print */
    ].join('\n');
    document.head.appendChild(s);
  }

  // ── 5. Transform assessment for student ──────────────────────────────────

  function disableAllInteractivity() {
    // Disable MC radio buttons — cannot click, visually greyed
    document.querySelectorAll('input[type="radio"]').forEach(function (el) {
      el.disabled = true;
      el.style.pointerEvents = 'none';
      el.style.opacity = '0.45';
    });
    // Disable text/numeric input fields
    document.querySelectorAll('input[type="text"]').forEach(function (el) {
      el.disabled = true;
      el.style.pointerEvents = 'none';
      el.placeholder = '(Write your answer on the printed paper)';
    });
    // Make textareas read-only with print hint
    document.querySelectorAll('textarea').forEach(function (el) {
      el.readOnly = true;
      el.style.background = '#f8fafc';
      el.style.color = '#94a3b8';
      el.placeholder = '(Write your answer on the printed paper — lines provided when printed)';
    });
    // Override ALL check/verify functions to no-ops
    var noops = ['cMC','cN','cTX','cText','checkMC','checkNum','checkNumeric',
                 'checkText','chkContains','chkMC','chkNum','chkText','showSol'];
    noops.forEach(function (fn) { window[fn] = function () {}; });
    // Hide and disable all Check/Verify buttons
    document.querySelectorAll('button.btn, button.btn-check').forEach(function (el) {
      var txt = el.textContent.trim().toLowerCase();
      if (/check|verify|submit|show/.test(txt)) {
        el.style.display = 'none';
      }
    });
    // Add print answer lines next to each textarea (shown only in print)
    document.querySelectorAll('textarea').forEach(function (ta) {
      var wrap = document.createElement('div');
      wrap.className = 'mv-answer-lines';
      for (var i = 0; i < 6; i++) {
        var line = document.createElement('div');
        line.className = 'mv-answer-line';
        wrap.appendChild(line);
      }
      ta.parentNode.insertBefore(wrap, ta.nextSibling);
    });
  }

  function buildPrintHeader(courseCode, unitName, typeLabel) {
    var div = document.createElement('div');
    div.className = 'mv-print-header';
    div.style.cssText = 'border:2px solid #000;padding:12px 16px;margin-bottom:18pt;';
    div.innerHTML =
      '<table style="width:100%;border-collapse:collapse;">' +
      '<tr><td colspan="2" style="font-size:14pt;font-weight:bold;text-align:center;padding-bottom:6pt;">' +
        'MindView Academy — ' + typeLabel +
      '</td></tr>' +
      '<tr>' +
        '<td style="width:60%;padding:4pt 0;"><strong>Student name:</strong> ' +
          '<span style="border-bottom:1px solid #000;display:inline-block;width:200px;">&nbsp;</span></td>' +
        '<td style="width:40%;padding:4pt 0;"><strong>Date:</strong> ' +
          '<span style="border-bottom:1px solid #000;display:inline-block;width:120px;">&nbsp;</span></td>' +
      '</tr>' +
      '<tr>' +
        '<td style="padding:4pt 0;"><strong>Course:</strong> ' + escHtml(courseCode) + '</td>' +
        '<td style="padding:4pt 0;"><strong>Time allowed:</strong> ' +
          (isAS ? 'Take-home' : timeLimit + ' minutes') + '</td>' +
      '</tr>' +
      '<tr><td colspan="2" style="padding:6pt 0;font-style:italic;font-size:10pt;">' +
        'Ontario regulations require handwritten responses on this printed paper. ' +
        'Complete all answers in ink, sign below, and return to your teacher.' +
      '</td></tr>' +
      '<tr><td colspan="2" style="padding:4pt 0;"><strong>Student signature:</strong> ' +
        '<span style="border-bottom:1px solid #000;display:inline-block;width:260px;">&nbsp;</span></td>' +
      '</tr>' +
      '</table>';
    return div;
  }

  function escHtml(s) {
    return String(s || '').replace(/[&<>"]/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
  }

  function buildBanner(jitsiUrl, role, typeLabel) {
    var banner = document.createElement('div');
    banner.className = 'mv-assessment-banner';
    banner.style.cssText = [
      'background:#fff8dc','border:2px solid #d97706',
      'border-radius:10px','padding:18px 22px','margin:16px 0',
      'font-family:inherit'
    ].join(';');

    var isTeacher = role === 'teacher' || role === 'admin' || role === 'superuser';
    var icon = isAS ? '📋' : isSupervised ? '📝' : '📋';
    var conditionsHtml = isAS ? (
      '<p style="margin:8px 0;color:#555;">This is a <strong>take-home practice assessment</strong>. ' +
      'Print the question paper, write your answers by hand, and return it to your teacher by mail.</p>'
    ) : (
      '<p style="margin:8px 0;color:#555;">This is a <strong>supervised assessment</strong>. ' +
      'You must complete it in the presence of your teacher (in-person or via video). ' +
      'Closed book — no notes, textbooks, or devices during the exam.</p>' +
      (isTeacher ? '' :
        '<p style="margin:8px 0;"><strong>⏱ Time allowed: ' + timeLimit + ' minutes</strong> — ' +
        'your teacher will start the timer when the session begins.</p>'
      )
    );

    var jitsiHtml = '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;' +
      'padding:14px 16px;margin:14px 0;">' +
      '<p style="font-weight:800;color:#1e40af;margin:0 0 8px;">📹 ' +
        (isTeacher ? 'Administer via Jitsi Video' : 'Join your supervised session via Jitsi Video') + '</p>' +
      '<p style="font-size:13px;color:#475569;margin:0 0 10px;">' +
        (isTeacher
          ? 'Share this link with your student and join to invigilate:'
          : 'Click the link below and wait for your teacher to join — do not start until instructed:') +
      '</p>' +
      '<a href="' + escHtml(jitsiUrl) + '" target="_blank" rel="noopener" ' +
        'style="display:inline-block;background:#2563eb;color:#fff;padding:10px 18px;' +
        'border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;word-break:break-all;">' +
        '🎥 Open Video Session Room</a>' +
      '<p style="font-size:12px;color:#64748b;margin:8px 0 0;">' +
        escHtml(jitsiUrl) + '</p>' +
      '</div>';

    var submissionHtml = '<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;' +
      'padding:14px 16px;margin:14px 0;">' +
      '<p style="font-weight:800;color:#166534;margin:0 0 6px;">📬 Submission instructions</p>' +
      '<ol style="margin:0 0 0 20px;color:#166534;font-size:14px;line-height:1.7;">' +
        '<li>Print the question paper using the <strong>Print Question Paper</strong> button below.</li>' +
        '<li>Write all answers in ink directly on the printed paper.</li>' +
        (isSupervised
          ? '<li>Complete all answers <strong>within the allocated time</strong> while your teacher observes.</li>' +
            '<li>When finished (or when time is up) <strong>stop writing immediately</strong>.</li>' +
            '<li>Hand the completed paper to your teacher directly (in-person) or ' +
              'hold it up to the camera for the teacher to photograph, then mail it.</li>'
          : '<li>Mail the completed paper to your teacher\'s address provided in your course instructions.</li>'
        ) +
        '<li>Keep a copy (photo) of your completed paper for your records.</li>' +
      '</ol>' +
      '</div>';

    banner.innerHTML =
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">' +
        '<span style="font-size:28px;">' + icon + '</span>' +
        '<div>' +
          '<p style="font-weight:900;font-size:17px;margin:0;color:#1e293b;">' + escHtml(typeLabel) + '</p>' +
          '<p style="font-size:13px;color:#64748b;margin:0;">MindView Academy · ' + escHtml(ctx.code) + '</p>' +
        '</div>' +
      '</div>' +
      conditionsHtml +
      jitsiHtml +
      submissionHtml;

    return banner;
  }

  function buildPrintButton() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = '🖨️ Print Question Paper';
    btn.style.cssText = [
      'display:inline-flex','align-items:center','gap:8px',
      'background:#1e40af','color:#fff','border:none','border-radius:8px',
      'padding:12px 22px','font-size:15px','font-weight:800','cursor:pointer',
      'margin:10px 0','font-family:inherit'
    ].join(';');
    btn.addEventListener('mouseenter', function () { btn.style.background = '#1d4ed8'; });
    btn.addEventListener('mouseleave', function () { btn.style.background = '#1e40af'; });
    btn.onclick = function () { window.print(); };
    return btn;
  }

  // ── 6. Supervised session timer (client-side countdown) ──────────────────
  // The gate (showing/hiding questions) is now enforced SERVER-SIDE by the
  // middleware, which serves a "locked" page until the teacher grants access
  // via /api/assessment-unlock. Once the student sees this assessment-
  // workflow.js running, questions are already unlocked and the timer starts
  // automatically for supervised assessments.

  var timerInterval = null;
  var sessionStarted = false;

  function buildTimerChip(secondsLeft) {
    var chip = document.createElement('div');
    chip.id = 'mv-timer-chip';
    chip.className = 'mv-timer-chip';
    chip.style.cssText = [
      'position:fixed','top:' + (document.querySelector('.page-nav') ? '120px' : '73px'),
      'right:18px','z-index:999',
      'background:#dc2626','color:#fff',
      'padding:10px 18px','border-radius:30px',
      'font-weight:900','font-size:16px',
      'box-shadow:0 4px 12px rgba(220,38,38,0.35)',
      'cursor:default','user-select:none',
      'font-family:\'SF Mono\',Menlo,monospace'
    ].join(';');
    updateTimerText(chip, secondsLeft);
    return chip;
  }

  function updateTimerText(chip, s) {
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    chip.textContent = '⏱ ' +
      (h > 0 ? h + ':' : '') +
      ('0' + m).slice(-2) + ':' +
      ('0' + sec).slice(-2);
    if (s <= 300) chip.style.background = '#b91c1c'; // last 5 mins: darker red
    if (s <= 60)  chip.style.animation = 'mv-pulse 1s infinite';
  }

  function startTimer(seconds, onExpire) {
    var remaining = seconds;
    var chip = document.getElementById('mv-timer-chip');
    timerInterval = setInterval(function () {
      remaining--;
      if (chip) updateTimerText(chip, remaining);
      if (remaining <= 0) {
        clearInterval(timerInterval);
        onExpire();
      }
    }, 1000);
  }

  // ── 6b. Unit Test submission (OF unit tests, students) ──────────────────
  // Clicking "Submit Unit Test" records the hand-in (functions/api/unit-progress.js,
  // of_submit) so it shows on the teacher's Student Progress panel. It does not
  // control access: every chapter is open to students.

  var unitTest = (function () {
    if (!isOF) return null;
    var m = htmlPath.match(/\/assessments\/([a-z0-9]+)\/(?:Unit|Chapter)(\d+)_[^/]*_OF\.html$/i) ||
            htmlPath.match(/\/assessments\/([a-z0-9]+)_ch(\d+)_of\.html$/i);
    return m ? { course: m[1].toLowerCase(), ch: parseInt(m[2], 10) } : null;
  })();

  var submitPanels = [];
  var submittedHtml = null; // set once submitted; panels built later reuse it
  var SUBMIT_LABEL = '📬 Submit Unit Test';

  function buildSubmitPanel() {
    var panel = document.createElement('div');
    panel.className = 'mv-submit-panel';
    panel.style.cssText = [
      'background:#f0fdf4','border:2px solid #16a34a','border-radius:10px',
      'padding:16px 18px','margin:16px 0','text-align:left'
    ].join(';');
    panel.innerHTML =
      '<p style="font-weight:800;color:#166534;margin:0 0 6px;">📬 Finished? Submit your Unit Test</p>' +
      '<p style="font-size:13px;color:#166534;margin:0 0 12px;line-height:1.5;">' +
        'After you hand your answer paper to your teacher (or show it on camera), click ' +
        '<strong>Submit Unit Test</strong> so your teacher knows you have finished. ' +
        'Your teacher marks the paper later.</p>' +
      '<button type="button" class="mv-submit-btn" ' +
        'style="background:#16a34a;color:#fff;border:none;border-radius:8px;' +
        'padding:12px 24px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;">' +
        SUBMIT_LABEL + '</button>' +
      '<p class="mv-submit-error" style="display:none;font-size:13px;color:#b91c1c;margin:10px 0 0;"></p>';
    panel.querySelector('.mv-submit-btn').onclick = submitUnitTest;
    if (submittedHtml) panel.innerHTML = submittedHtml;
    submitPanels.push(panel);
    return panel;
  }

  // Swap every submit panel (page top/bottom, time's-up overlay) to the done state.
  function showSubmitted(info) {
    var when = info.submittedAt ? new Date(info.submittedAt).toLocaleString() : '';
    var course = unitTest.course;
    var html =
      '<p style="font-weight:800;color:#166534;margin:0 0 6px;">✅ Unit Test submitted' +
        (when ? ' <span style="font-weight:400;font-size:13px;">(' + escHtml(when) + ')</span>' : '') + '</p>';
    if (info.nextChapter) {
      html +=
        '<p style="font-size:13px;color:#166534;margin:0 0 12px;">Your teacher will mark your paper.</p>' +
        '<a href="/courses/' + escHtml(course) + '/ch' + info.nextChapter + '.html" ' +
          'style="display:inline-block;background:#2563eb;color:#fff;padding:10px 18px;' +
          'border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;">' +
          'Go to Chapter ' + info.nextChapter + ' →</a>';
    } else {
      html +=
        '<p style="font-size:13px;color:#166534;margin:0 0 12px;">Your teacher will mark your paper.</p>' +
        '<a href="/courses/' + escHtml(course) + '.html" ' +
          'style="display:inline-block;background:#2563eb;color:#fff;padding:10px 18px;' +
          'border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;">' +
          '← Back to course</a>';
    }
    submittedHtml = html;
    submitPanels.forEach(function (p) { p.innerHTML = html; });
  }

  function showSubmitError(msg) {
    submitPanels.forEach(function (p) {
      var btn = p.querySelector('.mv-submit-btn');
      if (btn) { btn.disabled = false; btn.textContent = SUBMIT_LABEL; }
      var err = p.querySelector('.mv-submit-error');
      if (err) { err.textContent = msg; err.style.display = 'block'; }
    });
  }

  function submitUnitTest() {
    if (!confirm('Submit your Chapter ' + unitTest.ch + ' Unit Test?\n\n' +
        'Only click OK after you have handed your answer paper to your teacher ' +
        '(or shown it on camera).')) return;
    submitPanels.forEach(function (p) {
      var btn = p.querySelector('.mv-submit-btn');
      if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }
    });
    fetch('/api/unit-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action: 'of_submit', path: location.pathname }),
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; })
          .then(function (d) { return { ok: r.ok, d: d }; });
      })
      .then(function (res) {
        if (!res.ok) throw new Error(res.d.error || 'Could not submit. Please try again.');
        showSubmitted(res.d);
      })
      .catch(function (e) {
        showSubmitError((e && e.message) || 'Could not reach MindView. Check your connection and try again.');
      });
  }

  // If this test was already submitted (e.g. page reloaded), show that instead.
  function checkAlreadySubmitted() {
    fetch('/api/unit-progress?course=' + encodeURIComponent(unitTest.course), { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var ch = d && d.progress && d.progress['ch' + unitTest.ch];
        if (ch && ch.of_submitted) {
          showSubmitted({ submittedAt: ch.of_submitted_at, nextChapter: null });
        }
      })
      .catch(function () {});
  }

  function buildTimeUpOverlay() {
    var ov = document.createElement('div');
    ov.style.cssText = [
      'position:fixed','inset:0','z-index:9999',
      'background:rgba(15,23,42,0.92)',
      'display:flex','align-items:center','justify-content:center',
      'font-family:inherit'
    ].join(';');
    ov.innerHTML =
      '<div style="background:#fff;border-radius:14px;padding:40px 36px;max-width:520px;' +
        'width:90%;text-align:center;">' +
        '<div style="font-size:56px;margin-bottom:12px;">⏰</div>' +
        '<h2 style="font-size:26px;font-weight:900;color:#dc2626;margin-bottom:10px;">Time\'s Up!</h2>' +
        '<p style="color:#475569;margin-bottom:20px;">Your allocated time has ended. ' +
          'Stop writing immediately.</p>' +
        '<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;' +
          'padding:18px;text-align:left;">' +
          '<p style="font-weight:800;color:#166534;margin:0 0 8px;">📬 Submit your paper now</p>' +
          '<ol style="margin:0 0 0 20px;color:#166534;line-height:1.8;font-size:14px;">' +
            '<li>Sign and date your answer sheet.</li>' +
            '<li><strong>Hand it to your teacher immediately</strong> — in-person or ' +
              'show to camera, then mail.</li>' +
            '<li>Do not alter any answers after time has been called.</li>' +
          '</ol>' +
        '</div>' +
        '<div class="mv-timeup-submit"></div>' +
        '<button type="button" class="mv-timeup-close" ' +
          'style="margin-top:20px;background:#2563eb;color:#fff;border:none;border-radius:8px;' +
          'padding:12px 28px;font-size:15px;font-weight:700;cursor:pointer;">' +
          'Acknowledge &amp; Close' +
        '</button>' +
      '</div>';
    // Close removes the whole overlay. (It used to remove only the inner card,
    // leaving the dark backdrop over the page.)
    ov.querySelector('.mv-timeup-close').onclick = function () { ov.remove(); };
    if (unitTest) {
      ov.querySelector('.mv-timeup-submit').appendChild(buildSubmitPanel());
    }
    return ov;
  }

  function buildGateOverlay(jitsiUrl, typeLabel, role) {
    var isTeacher = role === 'teacher' || role === 'admin' || role === 'superuser';
    if (isTeacher) return null; // teachers see the assessment directly

    var overlay = document.createElement('div');
    overlay.id = 'mv-gate-overlay';
    overlay.className = 'mv-gate-overlay';
    overlay.style.cssText = [
      'position:fixed','inset:0','z-index:9990',
      'background:rgba(15,23,42,0.94)',
      'display:flex','align-items:center','justify-content:center',
      'font-family:inherit','overflow-y:auto'
    ].join(';');

    var typeSuffix = isFOR ? 'Diagnostic Assessment' : isOF ? 'Unit Test' : 'Final Exam';
    overlay.innerHTML =
      '<div style="background:#fff;border-radius:14px;padding:36px 32px;' +
        'max-width:600px;width:90%;margin:auto;">' +
        '<div style="text-align:center;margin-bottom:24px;">' +
          '<div style="font-size:52px;margin-bottom:8px;">📋</div>' +
          '<h2 style="font-size:22px;font-weight:900;color:#0f172a;margin:0 0 6px;">' +
            escHtml(ctx.code) + ' — ' + escHtml(typeLabel) + '</h2>' +
          '<p style="color:#64748b;font-size:14px;margin:0;">Supervised ' + typeSuffix +
            ' · MindView Academy</p>' +
        '</div>' +

        '<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:10px;' +
          'padding:16px 18px;margin-bottom:18px;">' +
          '<p style="font-weight:800;color:#78350f;margin:0 0 8px;">⚠️ Exam conditions — please read</p>' +
          '<ul style="margin:0 0 0 18px;color:#78350f;line-height:1.8;font-size:14px;">' +
            '<li>Close all other browser tabs and apps.</li>' +
            '<li><strong>Closed book</strong> — no notes, textbook, or phone.</li>' +
            '<li>Your teacher must be present (in-person or via video) before you start.</li>' +
            '<li>You have <strong>' + timeLimit + ' minutes</strong>. Stop when time is called.</li>' +
            '<li>Write all answers <strong>on the printed paper</strong>, not on screen.</li>' +
            '<li>Submit your paper to your teacher immediately when done.</li>' +
          '</ul>' +
        '</div>' +

        '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;' +
          'padding:16px 18px;margin-bottom:18px;">' +
          '<p style="font-weight:800;color:#1e40af;margin:0 0 8px;">📹 Video session with your teacher</p>' +
          '<p style="font-size:13px;color:#475569;margin:0 0 10px;">' +
            'Open this room and wait for your teacher to join. ' +
            'Your teacher will tell you when to click "Start Exam" below.</p>' +
          '<a href="' + escHtml(jitsiUrl) + '" target="_blank" rel="noopener" ' +
            'style="display:inline-block;background:#2563eb;color:#fff;padding:10px 18px;' +
            'border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;margin-bottom:8px;">' +
            '🎥 Open Video Session</a>' +
          '<p style="font-size:11px;color:#64748b;margin:4px 0 0;word-break:break-all;">' +
            escHtml(jitsiUrl) + '</p>' +
        '</div>' +

        '<div style="text-align:center;">' +
          '<p style="font-size:13px;color:#64748b;margin-bottom:14px;">' +
            'Click below only when your teacher tells you to begin. ' +
            'The ' + timeLimit + '-minute countdown starts immediately.</p>' +
          '<button id="mv-start-btn" ' +
            'style="background:#059669;color:#fff;border:none;border-radius:10px;' +
            'padding:16px 36px;font-size:16px;font-weight:900;cursor:pointer;' +
            'box-shadow:0 4px 14px rgba(5,150,105,0.4);font-family:inherit;">' +
            '▶ Start Exam Now (' + timeLimit + ' min)' +
          '</button>' +
        '</div>' +
      '</div>';

    return overlay;
  }

  // ── 7. Teacher panel (shown to instructors on supervised assessments) ─────

  function buildTeacherPanel(jitsiUrl, typeLabel) {
    var panel = document.createElement('div');
    panel.className = 'mv-teacher-panel';
    panel.style.cssText = [
      'background:#fafafa','border:2px solid #16a34a','border-radius:10px',
      'padding:18px 22px','margin:16px 0'
    ].join(';');
    panel.innerHTML =
      '<p style="font-weight:900;color:#166534;margin:0 0 12px;font-size:15px;">👨‍🏫 Teacher Administration Panel — ' + escHtml(typeLabel) + '</p>' +
      '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 16px;">' +
        '<p style="font-weight:700;color:#1e40af;margin:0 0 6px;">📹 Jitsi Video Session</p>' +
        '<p style="font-size:13px;color:#475569;margin:0 0 10px;">Share this link with the student before the session. Join this room to invigilate.</p>' +
        '<a href="' + escHtml(jitsiUrl) + '" target="_blank" rel="noopener" ' +
          'style="display:inline-block;background:#2563eb;color:#fff;padding:10px 18px;' +
          'border-radius:8px;font-weight:700;text-decoration:none;margin-bottom:6px;">' +
          '🎥 Join as Invigilator</a>' +
        '<p style="font-size:11px;color:#64748b;margin:4px 0;word-break:break-all;">' + escHtml(jitsiUrl) + '</p>' +
      '</div>' +
      '<p style="font-size:13px;color:#475569;margin:12px 0 0;">' +
        '<strong>Instructions:</strong> Join the video room first. ' +
        'Tell the student to click "Start Exam Now" when you are ready. ' +
        'Confirm no unauthorised materials are visible. ' +
        'Student prints the question paper and writes answers by hand. ' +
        'Collect the paper in-person or ask the student to mail it immediately after.</p>';
    return panel;
  }

  // ── 8. Main transformation ────────────────────────────────────────────────

  function run(role) {
    var isStudent = role === 'student';
    var isInstructor = !isStudent;
    var jitsiUrl = buildJitsiUrl();

    // Determine display label
    var typeLabel = isAS ? 'Practice Quiz (AS)' :
                   isFOR ? 'Diagnostic Assessment (FOR)' :
                   isOF  ? 'Unit Test (OF)' :
                           'Final Examination';

    injectPrintCSS();

    // ── Inject pulse keyframes for timer warning ──
    var anim = document.createElement('style');
    anim.textContent = '@keyframes mv-pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }';
    document.head.appendChild(anim);

    // ── Find insertion point: right after <header> element ──
    var headerEl = document.querySelector('header');
    var insertAfter = headerEl || document.body.firstChild;
    var parent = insertAfter ? insertAfter.parentNode : document.body;
    var nextSibling = insertAfter ? insertAfter.nextSibling : null;

    function insertAfterHeader(el) {
      parent.insertBefore(el, nextSibling);
      nextSibling = el.nextSibling; // advance pointer so elements stay in order
    }

    if (isStudent) {
      // ── Student path ────────────────────────────────────────────────
      //
      // AS (Practice Quiz — Assessment AS Learning):
      //   Fully interactive — no restrictions, no teacher required.
      //   Students use AS quizzes independently at any time to check
      //   their own readiness. Radio buttons, Check buttons, and solution
      //   reveals all work normally. Just show a friendly info banner.
      //
      // FOR (Diagnostic) / OF (Unit Test) / Final Exam:
      //   Server-side lock via middleware + USERS_KV (teacher must unlock).
      //   Once unlocked (questions already in browser): disable interactivity,
      //   add print button, start countdown timer.

      if (isAS) {
        // ── AS: fully open, no restrictions ─────────────────────────
        var asBanner = document.createElement('div');
        asBanner.style.cssText = [
          'background:#ecfdf5','border:1px solid #6ee7b7','border-radius:10px',
          'padding:14px 18px','margin:12px 0','display:flex','align-items:flex-start','gap:12px'
        ].join(';');
        asBanner.innerHTML =
          '<span style="font-size:22px;flex-shrink:0;">✅</span>' +
          '<div>' +
            '<p style="font-weight:800;color:#065f46;margin:0 0 4px;">Practice Quiz — No teacher required</p>' +
            '<p style="font-size:13px;color:#047857;margin:0;line-height:1.5;">' +
              'This is an Assessment AS Learning self-check. Take it as many times as you like ' +
              'at any time — no supervision needed. Select your answers and click Check to see ' +
              'instant feedback. Your score here does not affect your course grade.' +
            '</p>' +
          '</div>';
        if (headerEl) {
          headerEl.parentNode.insertBefore(asBanner, headerEl.nextSibling);
        }

        // ── Auto-record AS completion (shown on Student Progress) ─────
        // Extract chapter number and course code from URL:
        //   /assessments/eng4u/Unit3_..._AS.html  → ch=3  code=eng4u
        //   /assessments/mcr3u_ch3_as.html         → ch=3  code=mcr3u
        var chNum = null, courseCode = null;
        var mDir = location.pathname.match(/\/assessments\/([a-z0-9]+)\/(?:Unit|Chapter)(\d+)_/i);
        var mFlat = location.pathname.match(/\/assessments\/([a-z0-9]+)_ch(\d+)_as/i);
        if (mDir)  { courseCode = mDir[1];  chNum = parseInt(mDir[2], 10); }
        if (mFlat) { courseCode = mFlat[1]; chNum = parseInt(mFlat[2], 10); }

        if (chNum && courseCode) {
          var asRecorded = false;
          var totalQuestions = document.querySelectorAll('input[type="radio"][name]').length;
          var questionNames = new Set();
          document.querySelectorAll('input[type="radio"]').forEach(function(r) {
            if (r.name) questionNames.add(r.name);
          });
          var totalGroups = questionNames.size || 1;

          function checkASComplete() {
            if (asRecorded) return;
            var answered = new Set();
            document.querySelectorAll('input[type="radio"]:checked').forEach(function(r) {
              if (r.name) answered.add(r.name);
            });
            // Also count textarea responses
            var textAnswered = 0;
            document.querySelectorAll('textarea').forEach(function(t) {
              if ((t.value || '').trim().length > 10) textAnswered++;
            });
            // Consider complete if student answered ≥ 60% of questions
            if (answered.size + textAnswered >= Math.ceil(totalGroups * 0.6)) {
              asRecorded = true;
              fetch('/api/unit-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ action: 'as_done', course: courseCode, chapterNum: chNum }),
              }).catch(function() {});
            }
          }

          // Listen for any radio button selection or textarea input
          document.addEventListener('change', checkASComplete);
          document.addEventListener('input', checkASComplete);
        }

        // Nothing else — leave all interactive elements fully functional.
        return;
      }

      // ── FOR / OF / Final: print-only + server-side locked (teacher) ──
      disableAllInteractivity();

      // Print header (shows in print mode only, hidden on screen)
      var printHdr = buildPrintHeader(ctx.code, ctx.unitSlug, typeLabel);
      if (headerEl) {
        headerEl.parentNode.insertBefore(printHdr, headerEl);
      } else {
        document.body.insertBefore(printHdr, document.body.firstChild);
      }

      // Instruction banner + print button
      var banner = buildBanner(jitsiUrl, role, typeLabel);
      insertAfterHeader(banner);

      var printBtn = buildPrintButton();
      insertAfterHeader(printBtn);

      if (unitTest) {
        // Submit panel at the top and at the end of the questions.
        insertAfterHeader(buildSubmitPanel());
        var footerEl = document.querySelector('footer');
        var bottomPanel = buildSubmitPanel();
        if (footerEl && footerEl.parentNode) footerEl.parentNode.insertBefore(bottomPanel, footerEl);
        else document.body.appendChild(bottomPanel);
        checkAlreadySubmitted();
      }

      if (isSupervised) {
        // Gate enforced server-side (middleware); student has a valid grant
        // by the time this code runs. Start countdown timer automatically.
        sessionStarted = true;
        var chip = buildTimerChip(timeLimit * 60);
        document.body.appendChild(chip);
        startTimer(timeLimit * 60, function () {
          chip.textContent = '⏱ 00:00';
          chip.style.animation = '';
          document.body.appendChild(buildTimeUpOverlay());
        });
      }

    } else {
      // ── Teacher / Admin / Superuser path ──────────────────────────────
      if (isSupervised) {
        var teacherPanel = buildTeacherPanel(jitsiUrl, typeLabel);
        insertAfterHeader(teacherPanel);
      }
      // Print button for teachers too (to preview what students receive)
      var tBtn = buildPrintButton();
      tBtn.innerHTML = '🖨️ Preview Print Layout';
      insertAfterHeader(tBtn);
    }
  }

  // ── 9. Bootstrap — wait for DOM then fetch role ───────────────────────────

  function bootstrap() {
    fetch('/api/me', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var role = (data && data.authenticated && data.user) ? data.user.role : 'student';
        run(role);
      })
      .catch(function () { run('student'); }); // fail-closed: treat as student
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
