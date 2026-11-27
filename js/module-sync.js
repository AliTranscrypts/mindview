// js/module-sync.js — copies a student's interactive-module work to the server
// (POST /api/module-work) so teachers can see it in admin/work.html.
// Injected by functions/_middleware.js on courses/{code}/modules/*.html only.
// The module itself still saves to localStorage; this script watches those
// saves and sends the module state at most every 8 s, plus when the page is hidden.
(function () {
  'use strict';
  var path = location.pathname;
  if (!/^\/courses\/[a-z0-9]+\/modules\/[^/]+$/.test(path) || /\/index(\.html)?$/.test(path)) return;

  var THROTTLE = 8000, timer = null, lastSent = '', off = false;

  function payload() {
    var MV = window.MV;
    if (!MV || !MV.meta || !MV.S) return null;
    var p = null;
    try { p = MV._progress ? MV._progress() : null; } catch (e) {}
    var title = '';
    try { title = MV.C && MV.plain ? MV.plain(MV.C.title) : document.title; } catch (e) { title = document.title; }
    return { course: MV.meta.site || MV.meta.course, module: MV.meta.id, title: title, state: MV.S, progress: p };
  }

  function send(leaving) {
    clearTimeout(timer); timer = null;
    if (off) return;
    var d = payload(); if (!d) return;
    var sig = JSON.stringify(d.state);
    if (sig === lastSent) return;
    lastSent = sig;
    var body = JSON.stringify(d);
    fetch('/api/module-work', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: body, keepalive: !!leaving && body.length < 60000
    }).then(function (r) {
      if (r.status === 204 || r.status === 401 || r.status === 403) { off = true; return; }
      if (!r.ok) { lastSent = ''; schedule(30000); }
    }).catch(function () { lastSent = ''; schedule(30000); });
  }

  function schedule(ms) { if (!off && !timer) timer = setTimeout(send, ms || THROTTLE); }

  var orig = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) {
    orig.call(this, k, v);
    try { var MV = window.MV; if (MV && MV.meta && k === MV.meta.storageKey) schedule(); } catch (e) {}
  };

  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') send(true); });
  window.addEventListener('pagehide', function () { send(true); });

  // First send uploads any work already saved in this browser before tracking existed.
  var tries = 0;
  (function wait() {
    if (window.MV && window.MV.meta && window.MV.S) { send(false); return; }
    if (++tries < 60) setTimeout(wait, 500);
  })();
})();
