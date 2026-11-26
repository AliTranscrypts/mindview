// HFA4U 20 Indigenous Food Sovereignty: support (header Support button and dialog, journal note, support above the footer),
// hero (corn, beans and squash grow inside a four-part ring of principles; two questions appear), Explore "Food sovereignty
// circle" (Principles / Timeline / Security vs sovereignty; tap a card, then tap a place; readout; prediction figures),
// Part 3 "Food sovereignty in action" (initiative cards, allies sort, Check it with data) and the "Strengthen the circle"
// initiative brief. Plan wording lives in content.mjs; this file adds control labels only.
// Images (plan §5): neutral drawings only. The plants are simple botanical shapes; the ring is a plain four-segment ring in the
// plan's tints (no cross, no sacred or culturally specific design). Nothing a student writes leaves the device.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function seg01(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function words(s){ return String(s || "").trim().split(/\s+/).filter(function(w){ return /[A-Za-z0-9À-ɏ]/.test(w); }).length; }
function lc(s){ return s.charAt(0).toLowerCase() + s.slice(1); }

// ---------- @component radioGroup (copied from HFA4U 17 / 12; per-option class, custom layout class, function labels, lock) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, repaint, lock}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "ifs-chipset" : o.cls && o.cls !== "seg" ? "ifs-" + o.cls : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="ifs-rgw">' + (lab ? '<span class="ifs-rgl">' + lab + "</span>" : "") + '<span class="ifs-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (o.disabled ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b) && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || b.disabled) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint,
    lock:function(on){ if (!!o.disabled !== !!on) { o.disabled = !!on; paint(); } } };
}

// ---------- support (copied from HFA4U 10's header dialog): header Support button + dialog, journal note, support above the footer ----------
var decorated = false;
function decorate(){
  if (decorated) return; decorated = true;
  var C = MV.C, hb = $(".hd-btns");
  if (hb && !$("#ifs-supbtn")) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn ghost sm ifs-supbtn"; b.id = "ifs-supbtn"; b.setAttribute("aria-haspopup", "dialog"); b.textContent = "Support";
    hb.insertBefore(b, hb.firstChild);
    var dlg = document.createElement("dialog");
    dlg.className = "ifs-dlg"; dlg.id = "ifs-dlg"; dlg.setAttribute("aria-labelledby", "ifs-dlg-t");
    dlg.innerHTML = '<div class="ifs-dlg-top"><h2 id="ifs-dlg-t">Support</h2><button type="button" class="btn ghost sm" data-ifs="close">Close</button></div>' + C.support;
    ($("#mv-root") || document.body).appendChild(dlg);
    var close = function(){ if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); b.focus(); };
    b.addEventListener("click", function(){ if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });
    dlg.addEventListener("click", function(e){ if (e.target === dlg || e.target.closest('[data-ifs="close"]')) close(); });
  }
  var j = $("#journal");
  if (j && C.reflect.journalNote) j.insertAdjacentHTML("beforebegin", '<p class="ifs-jnote"><span class="hfa-private">Private</span> ' + C.reflect.journalNote + "</p>");
  var ft = $("footer.foot");
  if (ft) ft.insertAdjacentHTML("beforebegin", '<div class="ifs-footsup">' + C.support + "</div>");
}

// ---------- @component plantArt — corn, beans and squash growing together (neutral botanical drawing, SVG string). ----------
//   o: {x, gy (ground line), h (corn height), corn, bean, squash (0..1 growth), roots, nod, drops (0..1, P1 cross-section)}
//   Plants use --leaf (plant illustration only, course plan §4); soil --plate-grain; moisture --nu-water. Every part is labelled
//   in the figure text where it matters.
function plantArt(o){
  var x = o.x, gy = o.gy, H = o.h, k = H / 116, h = "", i;
  if (o.roots > 0) {
    var rl = 34 * k * o.roots;
    [-15, -8, 0, 7, 13].forEach(function(dx, n){ h += '<path class="ifs-root" d="M' + f1(x) + " " + f1(gy) + " q " + f1(dx * 0.5) + " " + f1(rl * 0.5) + " " + f1(dx * 1.6) + " " + f1(rl * (0.8 + 0.12 * (n % 2))) + '"/>'; });
    var bx = x + 9 * k;
    h += '<path class="ifs-root bean" d="M' + f1(bx) + " " + f1(gy) + " q 2 " + f1(rl * 0.6) + " 3 " + f1(rl * 1.1) + '"/>' +
      '<path class="ifs-root bean" d="M' + f1(bx + 1) + " " + f1(gy + rl * 0.4) + " l " + f1(9 * k) + " " + f1(rl * 0.2) + '"/>' +
      '<path class="ifs-root bean" d="M' + f1(bx + 2) + " " + f1(gy + rl * 0.7) + " l " + f1(-8 * k) + " " + f1(rl * 0.18) + '"/>';
    if (o.nod > 0) [[1, 0.35], [8, 0.55], [-5, 0.82], [4, 0.98]].forEach(function(p){ h += '<circle class="ifs-nod" cx="' + f1(bx + p[0] * k) + '" cy="' + f1(gy + rl * p[1]) + '" r="' + f1(3.3 * k * o.nod) + '"/>'; });
  }
  if (o.drops > 0) {
    h += '<rect class="ifs-shade" x="' + f1(x - 66 * k) + '" y="' + f1(gy) + '" width="' + f1(134 * k) + '" height="' + f1(7 * k) + '" style="opacity:' + f1(o.drops * 0.16) + '"/>';
    [[-52, 12], [-30, 18], [-44, 26], [38, 14], [56, 22], [-12, 24]].forEach(function(p){ h += '<path class="ifs-drop" style="opacity:' + f1(o.drops) + '" d="M' + f1(x + p[0] * k) + " " + f1(gy + p[1] * k - 4 * k) + " q " + f1(3 * k) + " " + f1(4 * k) + " 0 " + f1(6 * k) + " q " + f1(-3 * k) + " " + f1(-2 * k) + ' 0 ' + f1(-6 * k) + 'z"/>'; });
  }
  // corn
  if (o.corn > 0) {
    var top = gy - H * o.corn;
    h += '<line class="ifs-stalk" x1="' + f1(x) + '" y1="' + f1(gy) + '" x2="' + f1(x) + '" y2="' + f1(top) + '" style="stroke-width:' + f1(4.2 * k) + '"/>';
    [[0.2, -1], [0.36, 1], [0.52, -1], [0.68, 1], [0.82, -1]].forEach(function(lf){
      var g = clamp((o.corn - lf[0]) / 0.14, 0, 1); if (g <= 0) return;
      var ly = gy - H * lf[0], L = 38 * k * g, d = lf[1];
      h += '<path class="ifs-leaf" d="M' + f1(x) + " " + f1(ly) + " Q " + f1(x + d * L * 0.5) + " " + f1(ly - 17 * k * g) + " " + f1(x + d * L) + " " + f1(ly + 5 * k * g) + " Q " + f1(x + d * L * 0.45) + " " + f1(ly - 6 * k * g) + " " + f1(x) + " " + f1(ly + 2 * k) + 'Z"/>';
    });
    if (o.corn > 0.6) {
      var ey = gy - H * 0.47, ea = clamp((o.corn - 0.6) / 0.25, 0, 1);
      h += '<g style="opacity:' + f1(ea) + '"><ellipse class="ifs-ear" cx="' + f1(x + 7 * k) + '" cy="' + f1(ey) + '" rx="' + f1(4.6 * k) + '" ry="' + f1(12 * k) + '" transform="rotate(18 ' + f1(x + 7 * k) + " " + f1(ey) + ')"/>' +
        '<path class="ifs-husk" d="M' + f1(x + 1) + " " + f1(ey + 10 * k) + " q " + f1(10 * k) + " " + f1(-4 * k) + " " + f1(12 * k) + " " + f1(-20 * k) + '"/></g>';
    }
    if (o.corn > 0.96) for (i = -1; i <= 1; i++) h += '<line class="ifs-tassel" x1="' + f1(x) + '" y1="' + f1(top) + '" x2="' + f1(x + i * 7 * k) + '" y2="' + f1(top - 9 * k + Math.abs(i) * 3 * k) + '"/>';
  }
  // beans climb the corn
  if (o.bean > 0) {
    var ymax = H * 0.86 * o.bean, pts = [];
    for (var yy = 0; yy <= ymax; yy += 2) pts.push(f1(x + 6 * k * Math.sin(yy / (7 * k))) + "," + f1(gy - yy));
    if (pts.length > 1) h += '<polyline class="ifs-vine" points="' + pts.join(" ") + '"/>';
    for (i = 0; 16 * k + i * 19 * k < ymax; i++) {
      var vy = 16 * k + i * 19 * k, sd = i % 2 ? 1 : -1;
      h += '<ellipse class="ifs-bleaf" cx="' + f1(x + sd * 11 * k) + '" cy="' + f1(gy - vy) + '" rx="' + f1(6.5 * k) + '" ry="' + f1(3.8 * k) + '" transform="rotate(' + (sd * -24) + " " + f1(x + sd * 11 * k) + " " + f1(gy - vy) + ')"/>';
    }
    if (o.bean > 0.85) [[-9, 0.5, 20], [10, 0.64, -20]].forEach(function(p){
      var px = x + p[0] * k, py = gy - H * p[1];
      h += '<ellipse class="ifs-pod" cx="' + f1(px) + '" cy="' + f1(py) + '" rx="' + f1(2.2 * k) + '" ry="' + f1(8 * k) + '" transform="rotate(' + p[2] + " " + f1(px) + " " + f1(py) + ')"/>';
    });
  }
  // squash spreads across the soil
  if (o.squash > 0) {
    var s = o.squash;
    h += '<line class="ifs-vine" x1="' + f1(x - 62 * k * s) + '" y1="' + f1(gy - 2) + '" x2="' + f1(x + 64 * k * s) + '" y2="' + f1(gy - 2) + '"/>';
    [-56, -33, -13, 16, 38, 60].forEach(function(dx, n){
      var r = (11 + (n % 2) * 3) * k * s;
      h += '<circle class="ifs-sleaf" cx="' + f1(x + dx * k * s) + '" cy="' + f1(gy - r * 0.6) + '" r="' + f1(r) + '"/>' +
        '<path class="ifs-svein" d="M' + f1(x + dx * k * s) + " " + f1(gy - r * 0.6) + " l 0 " + f1(-r * 0.8) + " M" + f1(x + dx * k * s) + " " + f1(gy - r * 0.6) + " l " + f1(-r * 0.7) + " " + f1(-r * 0.4) + " M" + f1(x + dx * k * s) + " " + f1(gy - r * 0.6) + " l " + f1(r * 0.7) + " " + f1(-r * 0.4) + '"/>';
    });
    if (s > 0.6) h += '<ellipse class="ifs-squash" cx="' + f1(x + 27 * k) + '" cy="' + f1(gy - 7 * k) + '" rx="' + f1(12 * k * seg01(s, 0.6, 1)) + '" ry="' + f1(7.5 * k * seg01(s, 0.6, 1)) + '"/>';
  }
  return h;
}

// ---------- hero (storyboard: corn rises, beans climb, squash spreads; the four labels fade in; two lines appear in turn) ----------
// Ring: four segments with gaps (cerulean, violet, orange, blue tints; labels in --ink on the ring).
var HC = { x:200, y:150, ro:128, ri:96 };
function polar(r, deg){ var a = deg * Math.PI / 180; return [HC.x + r * Math.cos(a), HC.y + r * Math.sin(a)]; }
function arcSeg(a0, a1){
  var p1 = polar(HC.ro, a0), p2 = polar(HC.ro, a1), p3 = polar(HC.ri, a1), p4 = polar(HC.ri, a0);
  return "M" + f1(p1[0]) + " " + f1(p1[1]) + " A" + HC.ro + " " + HC.ro + " 0 0 1 " + f1(p2[0]) + " " + f1(p2[1]) + " L" + f1(p3[0]) + " " + f1(p3[1]) + " A" + HC.ri + " " + HC.ri + " 0 0 0 " + f1(p4[0]) + " " + f1(p4[1]) + "Z";
}
function arcPath(r, a0, a1, rev){ var p = polar(r, rev ? a1 : a0), q = polar(r, rev ? a0 : a1); return "M" + f1(p[0]) + " " + f1(p[1]) + " A" + r + " " + r + " 0 0 " + (rev ? 0 : 1) + " " + f1(q[0]) + " " + f1(q[1]); }
// principle order around the ring (clockwise from top-left): sacred, participation, self-determination, policy
var RING = [{ a0:183, a1:267, rev:false }, { a0:273, a1:357, rev:false }, { a0:3, a1:87, rev:true }, { a0:93, a1:177, rev:true }];
function heroSVG(H, P, c, b, s, lab, l1, l2){
  var h = '<defs><clipPath id="ifs-hclip"><circle cx="' + HC.x + '" cy="' + HC.y + '" r="' + (HC.ri - 3) + '"/></clipPath>' +
    RING.map(function(r, i){ return '<path id="ifs-harc' + i + '" d="' + arcPath(r.rev ? 116 : 107, r.a0, r.a1, r.rev) + '"/>'; }).join("") + "</defs>";
  P.forEach(function(p, i){
    var r = RING[i];
    h += '<path class="ifs-seg ifs-' + p.tint + '" d="' + arcSeg(r.a0, r.a1) + '" style="opacity:' + f1(0.3 + 0.7 * lab) + '"/>';
    h += '<text class="ifs-hlab" style="opacity:' + f1(lab) + '"><textPath href="#ifs-harc' + i + '" startOffset="50%" text-anchor="middle">' + p.t + "</textPath></text>";
  });
  h += '<g clip-path="url(#ifs-hclip)"><rect class="ifs-soil" x="90" y="205" width="220" height="60"/></g><line class="ifs-ground" x1="' + (HC.x - 76) + '" y1="205" x2="' + (HC.x + 76) + '" y2="205"/>';
  h += plantArt({ x:200, gy:205, h:116, corn:c, bean:b, squash:s, roots:0, nod:0, drops:0 });
  h += '<text class="ifs-hl1" x="200" y="308" text-anchor="middle" style="opacity:' + f1(l1) + '">' + H.lines[0] + "</text>";
  h += '<text class="ifs-hl2" x="200" y="333" text-anchor="middle" style="opacity:' + f1(l2) + '">' + H.lines[1] + "</text>";
  return h;
}
function hero(f){
  decorate();
  var host = $("#ifs-hero"); if (!host) return;
  var H = MV.C.hero, P = MV.C.explore.principles;
  host.innerHTML = '<svg class="ifs-hsvg" viewBox="0 0 400 344" role="img" aria-label="' + esc(H.aria) + '"></svg>';
  var svg = $("svg", host);
  function frame(t){ svg.innerHTML = heroSVG(H, P, seg01(t, 0, 0.2), seg01(t, 0.18, 0.4), seg01(t, 0.38, 0.56), seg01(t, 0.56, 0.7), seg01(t, 0.72, 0.8), seg01(t, 0.88, 0.96)); }
  function cap(){ if (f.cap) { f.cap.textContent = H.caption; f.cap.classList.add("ifs-cap"); } }
  if (MV.reduceMotion) { frame(1); cap(); return; }
  frame(0);
  MV.wait(300, function(){ MV.tween({ dur:5200, ease:function(t){ return t; }, step:frame, done:cap }); });
}

// ---------- Explore: Food sovereignty circle (@component sovereigntyCircle — module-specific tap-to-place circle with three
// modes: four principle quadrants with inner (strengthens ✚) and outer (undermines −) rings, a five-slot timeline with marks
// and a content-noted card, and a security × sovereignty 2 × 2 grid; readout, screen-reader announcements, arrow keys
// between targets, and prediction figures: plant cross-section, cost flow, food-chain ladder, sea-ice map) ----------
function explore(host, api){
  var D = api.content, S = api.S, CH = D.challenges, P = D.principles, K = D.kcards, T = D.tcards, SC = D.scards, CELLS = D.cells;
  S.mode = byId(D.modes, S.mode) ? S.mode : "circle";
  S.k = S.k || {}; S.t = S.t || {}; S.s = S.s || {};
  Object.keys(S.k).forEach(function(id){ var v = S.k[id]; if (!byId(K, id) || !v || !byId(P, v.q) || (v.ring !== "in" && v.ring !== "out")) delete S.k[id]; });
  S.tcv = S.tcv === "full" || S.tcv === "sum" ? S.tcv : "";
  var used = {};
  T.forEach(function(c){
    var v = S.t[c.id] || {}, p = v.pos >= 1 && v.pos <= 5 ? Math.round(v.pos) : 0;
    if (p && used[p]) p = 0; if (p) used[p] = 1;
    S.t[c.id] = { pos:p, mark:v.mark === "str" || v.mark === "und" ? v.mark : "" };
  });
  if (!S.tcv) S.t.tc.pos = 0;
  Object.keys(S.s).forEach(function(id){ if (!byId(SC, id) || !byId(CELLS, S.s[id])) delete S.s[id]; });
  var ALL = K.concat(T, SC);
  if (!byId(ALL, S.note)) S.note = "";
  var sel = null, busy = false, anim = null, pend = null, stage = null, newly = null;

  host.innerHTML = '<div id="ifs-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ifs-lab" data-mv="graph">' +
      '<figure class="ifs-stage" id="ifs-stage" hidden><div class="ifs-sbody" id="ifs-sbody"></div><div class="ifs-sfoot"><button type="button" class="btn ghost sm" data-act="hidestage" data-k="hidestage">Hide this figure</button></div></figure>' +
      '<div class="ifs-panel" id="ifs-pa">' +
        '<details class="ifs-pdef" open><summary>The four principles</summary><p class="tiny muted">' + D.principlesIntro + '</p><dl class="ifs-pdl">' +
          P.map(function(p){ return '<div class="ifs-' + p.tint + '"><dt>' + p.long + "</dt><dd>" + p.d.charAt(0).toUpperCase() + p.d.slice(1) + "</dd></div>"; }).join("") + "</dl></details>" +
        '<div id="ifs-pa-d"></div></div>' +
      '<div class="ifs-panel" id="ifs-pb" hidden></div>' +
      '<div class="ifs-panel" id="ifs-pc" hidden></div>' +
      '<div class="ifs-readw"><h4 class="ifs-h4">Readout</h4><dl class="read ifs-read" id="ifs-read" aria-live="polite"></dl></div>' +
      '<p class="vh" id="ifs-say" aria-live="polite"></p>' +
    "</div>";
  var pa = $("#ifs-pa-d", host), pb = $("#ifs-pb", host), pc = $("#ifs-pc", host), stg = $("#ifs-stage", host), sbody = $("#ifs-sbody", host);

  var modeRG = radios($("#ifs-mode", host), { label:"Mode", aria:"Explore mode", options:D.modes, value:S.mode, onChange:function(v){
    if (busy) { modeRG.set(S.mode); return; }
    sel = null; stage = null; S.mode = v; MV.banner("", ""); commit();
  } });

  // ---------- helpers ----------
  function kindOf(id){ return byId(K, id) ? "k" : byId(T, id) ? "t" : byId(SC, id) ? "s" : ""; }
  function card(id){ return byId(ALL, id); }
  function placed(id){ var k = kindOf(id); return k === "k" ? !!S.k[id] : k === "t" ? !!S.t[id].pos : k === "s" ? !!S.s[id] : false; }
  function tcText(c, short){ return S.tcv === "sum" ? (short ? c.sumShort : c.sum) : (short ? c.short : c.t); }
  function ctext(c, short){ return c.id === "tc" ? tcText(c, short) : (short && c.short ? c.short : c.t); }
  function inner(c, short){ return '<span class="ifs-code">' + c.code + "</span>" + (c.date ? '<span class="ifs-date">' + c.date + "</span>" : "") + '<span class="ifs-ct">' + ctext(c, short) + "</span>"; }
  function markHTML(c){ var m = S.t[c.id].mark; return '<span class="ifs-mk ' + (m || "none") + '">' + (m === "str" ? '<b aria-hidden="true">✚</b> strengthens' : m === "und" ? '<b aria-hidden="true">−</b> undermines' : "not marked") + "</span>"; }
  function dis(){ return busy ? " disabled" : ""; }
  function cardBtn(c, cls, short){
    return '<button type="button" class="' + cls + (c.id === newly && !MV.reduceMotion ? " ifs-new" : "") + '" data-card="' + c.id + '" data-k="cd' + c.id + '" aria-pressed="' + (sel === c.id) + '"' + dis() + ">" + inner(c, short) + (kindOf(c.id) === "t" ? markHTML(c) : "") + "</button>";
  }
  function selBar(c, extra){
    return '<div class="ifs-selbar" role="group" aria-label="' + esc("Selected card " + c.code) + '"><p class="ifs-selt">Selected: <strong>' + c.code + "</strong> " + ctext(c) + "</p>" +
      '<div class="ifs-selrow">' + (extra || "") + (placed(c.id) ? '<button type="button" class="btn ghost sm" data-act="tray" data-k="seltray"' + dis() + ">Back to the tray</button>" : "") +
      '<button type="button" class="btn ghost sm" data-act="seldone" data-k="seldone"' + dis() + ">Done</button></div>" +
      '<p class="tiny muted ifs-selh">Now tap a <strong>Place here</strong> button.</p></div>';
  }
  function tgt(key, label, aria){ return sel && !busy ? '<button type="button" class="ifs-tgt" data-tgt="' + key + '" data-k="tg' + key.replace("|", "") + '" aria-label="' + esc(aria) + '"><span aria-hidden="true">＋</span> ' + label + "</button>" : ""; }
  function clearBtn(){ return '<div class="q-actions ifs-clr"><button type="button" class="btn ghost sm" data-act="clear" data-k="clr' + S.mode + '"' + dis() + ">Start this mode again</button></div>"; }
  function say(t){ var s = $("#ifs-say", host); if (s) { s.textContent = ""; setTimeout(function(){ s.textContent = t; }, 30); } }

  // ---------- Principles mode ----------
  function counts(pid){ var a = 0, b = 0; K.forEach(function(c){ var v = S.k[c.id]; if (v && v.q === pid) { if (v.ring === "in") a++; else b++; } }); return [a, b]; }
  function ringHTML(p, r){
    var list = K.filter(function(c){ var v = S.k[c.id]; return v && v.q === p.id && v.ring === r; }), sc = sel && kindOf(sel) === "k" ? card(sel) : null;
    return '<div class="ifs-ring ' + r + '"><p class="ifs-rl"><b aria-hidden="true">' + (r === "in" ? "✚" : "−") + "</b> " + D.rings[r] + "</p>" +
      (list.length ? '<div class="ifs-chips">' + list.map(function(c){ return cardBtn(c, "ifs-chip"); }).join("") + "</div>" : "") +
      (sc ? tgt(p.id + "|" + r, "Place here", "Place " + sc.code + " in " + p.t + ", " + D.rings[r]) : "") + "</div>";
  }
  function paintA(){
    var un = K.filter(function(c){ return !S.k[c.id]; }), sc = sel && kindOf(sel) === "k" ? card(sel) : null;
    var h = '<p class="how">Tap a card, then tap a place on the circle: the inner ring if the card strengthens that principle, the outer ring if it undermines it.</p>' +
      '<div class="ifs-tray" role="group" aria-label="Cards to place">' + (un.length ? un.map(function(c){ return cardBtn(c, "ifs-card"); }).join("") : '<p class="tiny muted">All four cards are placed. Tap a placed card to move it.</p>') + "</div>" +
      (sc ? selBar(sc) : "") +
      '<div class="ifs-circle">' + P.map(function(p){
        var n = counts(p.id);
        return '<section class="ifs-q ifs-' + p.tint + " ifs-q-" + p.id + (n[1] ? " dim" : "") + (n[0] ? " glow" : "") + '" aria-label="' + esc(p.t) + '"><h5 class="ifs-qh"><span>' + p.t + '</span><span class="ifs-qc">✚ ' + n[0] + " · − " + n[1] + "</span></h5>" +
          ringHTML(p, "in") + ringHTML(p, "out") + "</section>";
      }).join("") + "</div>" + clearBtn();
    MV.keepFocus(pa, function(){ pa.innerHTML = h; });
  }

  // ---------- Timeline mode ----------
  function tAt(n){ for (var i = 0; i < T.length; i++) if (S.t[T[i].id].pos === n) return T[i]; return null; }
  function rank(c){ return MV.ans(c).pos; }
  function outOfOrder(){   // first slot (1–5) whose card is earlier than a card in an earlier slot, or 0
    var mx = 0;
    for (var n = 1; n <= 5; n++) { var c = tAt(n); if (!c) continue; var r = rank(c); if (r < mx) return n; mx = Math.max(mx, r); }
    return 0;
  }
  function paintB(){
    var CN = D.contentNote, sc = sel && kindOf(sel) === "t" ? card(sel) : null, allIn = T.every(function(c){ return S.t[c.id].pos; });
    var trayH = T.filter(function(c){ return !S.t[c.id].pos; }).map(function(c){
      if (c.id === "tc" && !S.tcv) return '<div class="ifs-cnote" role="note"><p><strong>Content note.</strong> ' + CN.text + "</p>" + CN.lines +
        '<div class="ifs-cnbtns"><button type="button" class="btn sm" data-tcv="full" data-k="tcvfull"' + dis() + ">" + CN.full + '</button><button type="button" class="btn sm" data-tcv="sum" data-k="tcvsum"' + dis() + ">" + CN.sum + "</button></div></div>";
      return cardBtn(c, "ifs-card");
    }).join("");
    var extra = "";
    if (sc) {
      extra = '<span class="ifs-mkrow" role="group" aria-label="Mark the card">' + ["str", "und"].map(function(m){
        var on = S.t[sc.id].mark === m;
        return '<button type="button" class="btn sm ' + (on ? "primary" : "ghost") + '" data-mark="' + m + '" data-k="mk' + m + '" aria-pressed="' + on + '"' + dis() + '><b aria-hidden="true">' + (m === "str" ? "✚" : "−") + "</b> " + D.marks[m] + "</button>";
      }).join("") + "</span>";
      if (sc.id === "tc") extra += '<button type="button" class="btn ghost sm" data-tcv="' + (S.tcv === "sum" ? "full" : "sum") + '" data-k="tcvswap"' + dis() + ">" + (S.tcv === "sum" ? CN.swapFull : CN.swapSum) + "</button>";
    }
    var slots = "";
    for (var n = 1; n <= 5; n++) {
      var c = tAt(n), off = allIn && c && rank(c) !== n;
      slots += '<li class="ifs-slot' + (c ? " full" : "") + (off ? " off" : "") + '"><span class="ifs-sn">' + n + "</span>" +
        (c ? cardBtn(c, "ifs-chip", true) : '<span class="ifs-empty">empty</span>') + (off ? '<span class="ifs-offt">out of order</span>' : "") +
        (sc ? tgt("t|" + n, "Place here", "Place " + sc.code + " in position " + n) : "") + "</li>";
    }
    var h = '<p class="how">Tap a card, mark it, then tap a place on the timeline. The earliest event goes on the left.</p>' +
      '<div class="ifs-tray" role="group" aria-label="Cards to place">' + (trayH || '<p class="tiny muted">All five cards are on the timeline. Tap a placed card to move or re-mark it.</p>') + "</div>" +
      (sc ? selBar(sc, extra) : "") +
      '<div class="ifs-tlw" role="group" aria-label="Timeline, earliest on the left"><ol class="ifs-tl">' + slots + '</ol><p class="ifs-axis" aria-hidden="true"><span>earlier</span><span>later</span></p></div>' + clearBtn();
    MV.keepFocus(pb, function(){ pb.innerHTML = h; });
  }

  // ---------- Security vs sovereignty mode ----------
  function cellHTML(cl){
    var list = SC.filter(function(c){ return S.s[c.id] === cl.id; }), sc = sel && kindOf(sel) === "s" ? card(sel) : null;
    return '<div class="ifs-cell ifs-cell-' + cl.id + '"><p class="ifs-cl">' + cl.t + "</p>" + (list.length ? '<div class="ifs-chips">' + list.map(function(c){ return cardBtn(c, "ifs-chip", true); }).join("") + "</div>" : "") +
      (sc ? tgt("s|" + cl.id, "Place here", "Place " + sc.code + " in " + cl.t) : "") + "</div>";
  }
  function paintC(){
    var un = SC.filter(function(c){ return !S.s[c.id]; }), sc = sel && kindOf(sel) === "s" ? card(sel) : null, Y = "<b>Yes</b>", N = "<b>No</b>";
    var h = '<p class="how">Tap a scenario below the grid, then tap the cell that fits it.</p><p class="tiny muted">' + D.sNote + "</p>" + (sc ? selBar(sc) : "") +
      '<div class="ifs-grid" role="group" aria-label="Security and sovereignty grid">' +
        '<div class="ifs-gh ifs-corner" aria-hidden="true"></div><div class="ifs-gh ifs-col">' + D.cols + " " + Y + '</div><div class="ifs-gh ifs-col">' + D.cols + " " + N + "</div>" +
        '<div class="ifs-gh ifs-row">' + D.rows + " " + Y + "</div>" + cellHTML(byId(CELLS, "both")) + cellHTML(byId(CELLS, "sov")) +
        '<div class="ifs-gh ifs-row">' + D.rows + " " + N + "</div>" + cellHTML(byId(CELLS, "sec")) + cellHTML(byId(CELLS, "none")) +
      "</div>" +
      '<div class="ifs-tray ifs-tray-s" role="group" aria-label="Scenarios to place">' + (un.length ? un.map(function(c){ return cardBtn(c, "ifs-card"); }).join("") : '<p class="tiny muted">All four scenarios are in the grid. Tap a placed scenario to move it.</p>') + "</div>" + clearBtn();
    MV.keepFocus(pc, function(){ pc.innerHTML = h; });
  }

  // ---------- readout ----------
  function noteOf(c){
    if (!c) return '<span class="muted">Place or tap a card to read its note.</span>';
    if (kindOf(c.id) === "s") return c.code + " · " + c.t;
    return c.id === "tc" && S.tcv === "sum" ? c.sumNote : c.note;
  }
  function paintRead(){
    var rows = [], deck = S.mode === "circle" ? K : S.mode === "time" ? T : SC, n = deck.filter(function(c){ return placed(c.id); }).length, nc = card(S.note);
    rows.push(["Cards placed", "<strong>" + n + " of " + deck.length + "</strong>"]);
    if (S.mode === "circle") rows.push(["Per principle", P.map(function(p){ var c = counts(p.id); return p.t + ": strengthens " + c[0] + ", undermines " + c[1]; }).join("<br>")]);
    else if (S.mode === "time") { var o = outOfOrder(); rows.push(["Timeline order", !n ? '<span class="muted">No cards placed yet</span>' : o ? "Card " + o + " is out of order" : "In order so far"]); }
    else rows.push(["Grid", ["sec", "sov", "both", "none"].map(function(id){ return byId(CELLS, id).t + ": " + SC.filter(function(c){ return S.s[c.id] === id; }).length; }).join(" · ")]);
    rows.push(["Card note", nc && deck.indexOf(nc) >= 0 ? noteOf(nc) : noteOf(null)]);
    $("#ifs-read", host).innerHTML = MV.readoutHTML(rows);
  }

  // ---------- prediction figures ----------
  function p1SVG(t){
    var r = seg01(t, 0, 0.35), nd = seg01(t, 0.3, 0.5), dr = seg01(t, 0.45, 0.65), L = [seg01(t, 0.6, 0.72), seg01(t, 0.74, 0.86), seg01(t, 0.88, 1)];
    var h = '<rect class="ifs-soil" x="0" y="165" width="420" height="125"/><line class="ifs-ground" x1="0" y1="165" x2="420" y2="165"/>' +
      plantArt({ x:210, gy:165, h:128, corn:1, bean:1, squash:1, roots:r, nod:nd, drops:dr });
    h += '<g style="opacity:' + f1(L[0]) + '"><line class="ifs-lead" x1="238" y1="44" x2="214" y2="60"/><text class="ifs-slab" x="242" y="44">Corn: a pole to climb</text></g>';
    h += '<g style="opacity:' + f1(L[1]) + '"><line class="ifs-lead" x1="104" y1="140" x2="146" y2="154"/><text class="ifs-slab" x="6" y="100">Squash leaves shade</text><text class="ifs-slab" x="6" y="117">the soil and hold</text><text class="ifs-slab" x="6" y="134">in moisture</text></g>';
    h += '<g style="opacity:' + f1(L[2]) + '"><line class="ifs-lead" x1="250" y1="222" x2="230" y2="192"/><text class="ifs-slab" x="250" y="238">Nodules on bean roots</text><text class="ifs-slab" x="250" y="255">add nitrogen</text><text class="ifs-slab" x="250" y="272">to the soil</text></g>';
    return '<svg class="ifs-ssvg" viewBox="0 0 420 290" role="img" aria-label="' + esc(t < 1 ? "Corn, beans and squash growing together, above and below the soil." : "Cross-section: the bean vine climbs the corn stalk, nodules on the bean roots add nitrogen to the soil, and squash leaves shade the soil and hold in moisture.") + '">' + h + "</svg>";
  }
  function p2HTML(t, p){
    var k = t >= 1 ? p.flow.length : Math.floor(t * p.flow.length + 0.001);
    return '<div class="ifs-p2"><p class="ifs-scen"><span class="tag">Scenario</span> ' + p.scenario + '</p><ol class="ifs-flow" aria-label="What happens, in order">' +
      p.flow.map(function(s, i){ return '<li class="' + (i < k ? "on" : "") + '">' + (i < k ? s : '<span class="vh">(not shown yet)</span>') + "</li>"; }).join("") + "</ol></div>";
  }
  var LADW = [7, 22, 50, 100], LADL = ["lowest", "low", "higher", "highest"];
  function p3HTML(t, p){
    return '<div class="ifs-ladder"><p class="tiny muted">Relative mercury concentration up the food chain: an illustration, not measurements.</p><ol class="ifs-rungs">' +
      p.ladder.map(function(lab, i){ var g = seg01(t, i / 4, (i + 1) / 4); return '<li><span class="ifs-rgl2">' + lab + '</span><span class="ifs-rbar" aria-hidden="true"><i style="width:' + f1(LADW[i] * g) + '%"></i></span><span class="ifs-rlv">' + (g >= 1 ? LADL[i] : "") + "</span></li>"; }).reverse().join("") + "</ol></div>";
  }
  function p4SVG(t){
    var E = lerp(396, 186, t), A = [{ x:236, y:78 }, { x:352, y:178 }], cx = 104, cy = 138, h = "";
    h += '<rect class="ifs-sea" x="0" y="0" width="420" height="250"/>';
    var wave = function(ex){ var d = "M110 0 L" + f1(ex) + " 0"; for (var y = 0; y <= 250; y += 25) d += " Q" + f1(ex + (y / 25 % 2 ? -7 : 7)) + " " + f1(y + 12.5) + " " + f1(ex) + " " + (y + 25); return d + " L110 250 Z"; };
    h += '<path class="ifs-ice" d="' + wave(E) + '"/>';
    if (t > 0) h += '<line class="ifs-oldedge" x1="396" y1="0" x2="396" y2="250"/><text class="ifs-mlab" x="392" y="244" text-anchor="end">earlier ice edge</text>';
    h += '<path class="ifs-land" d="M0 0 L112 0 C124 60 96 118 120 168 C134 204 102 232 112 250 L0 250 Z"/><text class="ifs-mlab" x="18" y="28">land</text>';
    h += '<text class="ifs-mlab" x="' + f1((122 + E) / 2) + '" y="24" text-anchor="middle">sea ice</text>';
    A.forEach(function(a, i){
      var reach = a.x < E - 10, ex = reach ? a.x : E - 10, ey = cy + (a.y - cy) * (ex - cx) / (a.x - cx);
      h += '<line class="ifs-route" x1="' + cx + '" y1="' + cy + '" x2="' + f1(ex) + '" y2="' + f1(ey) + '"/>';
      h += '<path class="ifs-hunt' + (reach ? "" : " out") + '" d="M' + a.x + " " + (a.y - 8) + " l8 8 l-8 8 l-8 -8z\"/>" +
        '<text class="ifs-mlab" x="' + a.x + '" y="' + (a.y + (i ? 26 : -14)) + '" text-anchor="middle">' + (reach ? "hunting area" : "out of reach") + "</text>";
    });
    h += '<circle class="ifs-comm" cx="' + cx + '" cy="' + cy + '" r="6"/><text class="ifs-mlab b" x="' + (cx - 12) + '" y="' + (cy + 5) + '" text-anchor="end">community</text>';
    var desc = t < 1 ? "Schematic map: sea ice reaches far from the shore, and travel routes on the ice lead from the community to two hunting areas." : "Schematic map: the ice edge has moved toward the shore. The travel routes on the ice are shorter, and both hunting areas are now out of reach.";
    return '<svg class="ifs-ssvg" viewBox="0 0 420 250" role="img" aria-label="' + esc(desc) + '">' + h + "</svg>";
  }
  var CAPS = { p1:"Corn, beans and squash, above and below the soil.", p2:"How a fuel price change travels through the food system.", p3:"A food-chain ladder.", p4:"Schematic, not a real map: an Inuit community, sea ice and travel routes." };   // module-written
  function paintStage(t){
    if (!stage) { stg.hidden = true; return; }
    stg.hidden = false;
    var p = byId(D.predictions, stage), b = stage === "p1" ? p1SVG(t) : stage === "p2" ? p2HTML(t, p) : stage === "p3" ? p3HTML(t, p) : p4SVG(t);
    sbody.innerHTML = b + '<figcaption class="tiny muted">' + CAPS[stage] + "</figcaption>";
    var hb = $('[data-act="hidestage"]', stg); if (hb) hb.disabled = busy;
  }
  stg.addEventListener("click", function(e){ var b = e.target.closest('[data-act="hidestage"]'); if (b && !b.disabled && !busy) { stage = null; paintStage(1); } });

  // ---------- paint / commit ----------
  function paint(){
    modeRG.set(S.mode); modeRG.lock(busy);
    $("#ifs-pa", host).hidden = S.mode !== "circle"; pb.hidden = S.mode !== "time"; pc.hidden = S.mode !== "grid";
    if (S.mode === "circle") paintA(); else if (S.mode === "time") paintB(); else paintC();
    paintRead();
  }
  function commit(){ api.save(); paint(); MV.changed(); }

  // ---------- interaction (one handler for the three panels) ----------
  function panelFor(id){ var k = kindOf(id); return k === "k" ? pa : k === "t" ? pb : pc; }
  function focusK(panel, key){ var el = panel.querySelector('[data-k="' + key + '"]'); if (el) el.focus({ preventScroll:false }); }
  function place(key){
    var c = card(sel), q = key.split("|"), msg = "";
    if (kindOf(sel) === "k") {
      var p = byId(P, q[0]); S.k[sel] = { q:q[0], ring:q[1] };
      var n = counts(p.id); msg = c.code + " placed in " + p.t + ", " + (q[1] === "in" ? "strengthens" : "undermines") + ". " + p.t + ": " + (q[1] === "in" ? "strengthens " + n[0] : "undermines " + n[1]) + ".";
    } else if (kindOf(sel) === "t") {
      var pos = +q[1], occ = tAt(pos), old = S.t[sel].pos;
      if (occ && occ.id !== sel) S.t[occ.id].pos = old || 0;
      S.t[sel].pos = pos;
      msg = c.code + " placed in position " + pos + (S.t[sel].mark ? ", marked " + (S.t[sel].mark === "str" ? "strengthens" : "undermines") : ", not marked yet") + "." + (occ && occ.id !== sel ? " " + occ.code + (old ? " moved to position " + old : " went back to the tray") + "." : "");
    } else {
      var cl = byId(CELLS, q[1]); S.s[sel] = cl.id;
      msg = c.code + " placed in " + cl.t + ". " + cl.t + ": " + SC.filter(function(x){ return S.s[x.id] === cl.id; }).length + ".";
    }
    newly = sel; S.note = sel; var id = sel; sel = null; commit(); newly = null;
    focusK(panelFor(id), "cd" + id); say(msg);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest(".ifs-panel button"); if (!b || b.disabled || busy) return;
    var d = b.dataset;
    if (d.card) {
      sel = sel === d.card ? null : d.card; S.note = d.card; paint(); api.save();
      if (sel) { var t1 = panelFor(sel).querySelector("[data-tgt]"); if (t1) t1.focus({ preventScroll:true }); say("Selected " + card(sel).code + ". Choose where to place it."); }
      return;
    }
    if (d.tgt && sel) { place(d.tgt); return; }
    if (d.mark && sel) { S.t[sel].mark = d.mark; S.note = sel; commit(); focusK(pb, "mk" + d.mark); say(card(sel).code + " marked " + (d.mark === "str" ? "strengthens" : "undermines") + "."); return; }
    if (d.tcv) {
      var first = !S.tcv; S.tcv = d.tcv; S.note = "tc";
      if (first) sel = "tc";
      commit(); focusK(pb, first ? "cdtc" : "tcvswap"); if (first) { var t2 = pb.querySelector("[data-tgt]"); if (t2) t2.focus({ preventScroll:true }); }
      return;
    }
    if (d.act === "tray" && sel) {
      var k = kindOf(sel), id = sel;
      if (k === "k") delete S.k[id]; else if (k === "t") S.t[id].pos = 0; else delete S.s[id];
      sel = null; commit(); focusK(panelFor(id), "cd" + id); say(card(id).code + " is back in the tray."); return;
    }
    if (d.act === "seldone") { var id2 = sel; sel = null; paint(); if (id2) focusK(panelFor(id2), "cd" + id2); return; }
    if (d.act === "clear") {
      if (S.mode === "circle") S.k = {}; else if (S.mode === "time") T.forEach(function(c){ S.t[c.id] = { pos:0, mark:"" }; }); else S.s = {};
      sel = null; S.note = ""; commit(); say("This mode is cleared."); return;
    }
  });
  // arrow keys move between the Place here targets
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-tgt]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    var list = $$("[data-tgt]", b.closest(".ifs-panel")), i = list.indexOf(b);
    if (i >= 0) { e.preventDefault(); var n = list[clamp(i + d, 0, list.length - 1)]; if (n) n.focus(); }
  });
  paint();

  // ---------- target challenges (plan's exact tests and named wrong states) ----------
  function test(id, live){
    var c = byId(CH, id), m = c.msgs;
    if (id === "tc1") {
      var un = K.filter(function(x){ return !S.k[x.id]; });
      if (un.length) return { ok:false, msg:fill(m.tray, { n:un.length }) };
      var bad = K.filter(function(x){ var a = MV.ans(x), v = S.k[x.id]; return v.q !== a.q || v.ring !== a.ring; });
      if (!bad.length) return { ok:true };
      if (S.k.k3.q === "pol") return { ok:false, msg:m.k3pol };
      if (S.k.k4.q === "self") return { ok:false, msg:m.k4self };
      if (K.some(function(x){ return S.k[x.id].ring === "out"; })) return { ok:false, msg:m.outer };
      return { ok:false, msg:fill(m.general, { n:bad.length }) };
    }
    if (id === "tc2") {
      var np = T.filter(function(x){ return !S.t[x.id].pos; }).length;
      if (np) return { ok:false, msg:fill(m.tray, { n:np }) };
      var nm = T.filter(function(x){ return !S.t[x.id].mark; }).length;
      if (nm) return { ok:false, msg:fill(m.mark, { n:nm }) };
      var good = T.every(function(x){ var a = MV.ans(x); return S.t[x.id].pos === a.pos && S.t[x.id].mark === a.mark; });
      if (good) return { ok:true };
      if (S.t.td.pos > S.t.te.pos) return { ok:false, msg:m.de };
      if (S.t.tb.mark === "str") return { ok:false, msg:m.bstr };
      var o = outOfOrder(); if (o) return { ok:false, msg:fill(m.order, { n:o }) };
      return { ok:false, msg:m.general };
    }
    if (id === "tc3") {
      var ns = SC.filter(function(x){ return !S.s[x.id]; }).length;
      if (ns) return { ok:false, msg:fill(m.tray, { n:ns }) };
      if (SC.every(function(x){ return S.s[x.id] === MV.ans(x); })) { if (!live) api.banner("good", "✓ " + MV.plain(c.banner)); return { ok:true }; }
      if (S.s.s1 === "both") return { ok:false, msg:m.s1both };
      if (S.s.s3 === "both") return { ok:false, msg:m.s3both };
      if (S.s.s4 === "sec") return { ok:false, msg:m.s4sec };
      return { ok:false, msg:m.general };
    }
    return { ok:false };
  }

  // ---------- predictions ----------
  var START = { p1:"circle", p2:"grid", p3:"time", p4:"grid" }, DUR = { p1:3000, p2:2600, p3:2600, p4:2600 };
  function cancelAll(){ if (anim) { anim(); anim = null; } }
  function finish(){ anim = null; busy = false; paint(); paintStage(1); api.save(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  return {
    predict:{
      start:function(p){
        cancelAll(); busy = true; sel = null; S.mode = START[p.id] || S.mode; stage = p.id;
        api.save(); paint(); paintStage(0);
      },
      run:function(p, done){
        pend = done;
        try {
          stg.scrollIntoView && (function(){ var r = stg.getBoundingClientRect(); if (r.top < 100 || r.bottom > window.innerHeight) stg.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); })();
          anim = MV.tween({ dur:DUR[p.id] || 2400, ease:function(t){ return t; }, step:function(t){ paintStage(t); }, done:finish });
        } catch (err) { console.error(err); finish(); }
      }
    },
    challenge:function(id, opt){ return test(id, opt && opt.live); }
  };
}

// ---------- Part 3: Food sovereignty in action (@component actionStations — station chips; initiative cards with principle
// toggles and a fit check; a two-column allies sort; a "Check it with data" source panel with a coverage question) ----------
function part3(host, api){
  var D = api.content, S = api.S, ST = D.stations, IN = D.initiatives, P = MV.C.explore.principles, S2 = D.s2, S3 = D.s3;
  S.st = byId(ST, S.st) ? S.st : ST[0].id;
  S.s1 = S.s1 || {}; S.s1.cur = byId(IN, S.s1.cur) ? S.s1.cur : IN[0].id; S.s1.pick = S.s1.pick || {}; S.s1.chk = S.s1.chk || {};
  S.s2 = S.s2 || { pick:{}, checked:false }; S.s2.pick = S.s2.pick || {};
  S.s3 = S.s3 || { choice:null, checked:false };
  var ITEMS2 = MV.shuffle(S2.items, MV.meta.id + "allies");
  function pname(id){ var p = byId(P, id); return p ? p.t : id; }
  function s1fit(i){ var pk = S.s1.pick[i.id] || [], acc = MV.ans(i); return pk.length >= 2 && pk.every(function(x){ return acc.indexOf(x) >= 0; }); }
  function s1done(i){ return S.s1.chk[i.id] && s1fit(i); }
  function done(id){
    if (id === "s1") return IN.every(s1done);
    if (id === "s2") return S2.items.every(function(it){ return S.s2.pick[it.id] === MV.ans(it); }) && S.s2.checked;
    return S.s3.checked && S.s3.choice != null && MV.ok(S3.options[S.s3.choice]);
  }
  function stLabels(){ return ST.map(function(s){ return { id:s.id, t:s.t + (done(s.id) ? ' <span class="ifs-stok">✓<span class="vh"> finished</span></span>' : "") }; }); }
  var stOpts = stLabels();
  host.innerHTML = '<div id="ifs-stn"></div><p class="tiny" id="ifs-stp" aria-live="polite"></p>' + ST.map(function(s){ return '<div class="ifs-st" id="ifs-st-' + s.id + '" hidden></div>'; }).join("");
  var stRG = radios($("#ifs-stn", host), { label:"Station", cls:"chips", options:stOpts, value:S.st, onChange:function(v){ S.st = v; api.save(); paintAll(); } });
  function stRepaint(){
    stLabels().forEach(function(x, i){ stOpts[i].t = x.t; }); stRG.repaint();
    $("#ifs-stp", host).textContent = "Stations finished: " + ST.filter(function(s){ return done(s.id); }).length + " of " + ST.length + ".";
  }

  // Station 1: initiative cards
  var b1 = $("#ifs-st-s1", host);
  b1.innerHTML = '<p class="tiny muted">' + D.cardNote + '</p><div id="ifs-icur"></div><div id="ifs-icard"></div>';
  var iOpts = function(){ return IN.map(function(i){ return { id:i.id, t:i.code + (s1done(i) ? ' <span class="ifs-stok">✓<span class="vh"> fits</span></span>' : "") }; }); };
  var iO = iOpts();
  var icRG = radios($("#ifs-icur", b1), { label:"Card", cls:"chips", options:iO, value:S.s1.cur, onChange:function(v){ S.s1.cur = v; api.save(); paintS1(); } });
  function s1fb(i){
    if (!S.s1.chk[i.id]) return "";
    var pk = S.s1.pick[i.id] || [], acc = MV.ans(i), F = D.s1fb;
    if (pk.length < 2) return MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + F.few);
    var bad = pk.filter(function(x){ return acc.indexOf(x) < 0; });
    if (bad.length) return '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong></p><ul class="ifs-fbl">' + bad.map(function(x){ return "<li><strong>" + pname(x) + ":</strong> " + (x === "pol" ? F.pol : F.other) + "</li>"; }).join("") + "</ul></div>";
    var more = acc.filter(function(x){ return pk.indexOf(x) < 0; });
    return MV.fbHTML("good", "<strong>✓ " + F.ok + "</strong>" + (more.length ? " " + fill(F.also, { list:listAnd(more.map(function(x){ return lc(pname(x)); })) }) : ""));
  }
  function paintS1(){
    var i = byId(IN, S.s1.cur), pk = S.s1.pick[i.id] || [], box = $("#ifs-icard", b1);
    icRG.set(S.s1.cur);
    var h = '<article class="ifs-icardx"><p class="tiny"><span class="hfa-model">Practice model</span></p><h4 class="ifs-h4">' + i.code + " · " + i.t + "</h4>" +
      '<dl class="ifs-idl"><div><dt>Who leads</dt><dd>' + i.who + "</dd></div><div><dt>What it does</dt><dd>" + i.does + "</dd></div>" +
      '<div><dt>In the community’s own words</dt><dd><em>' + D.quoteNote + "</em></dd></div><div><dt>Supports that help</dt><dd>" + i.supports + "</dd></div></dl></article>" +
      '<p class="ifs-ask"><strong>' + D.s1ask + "</strong></p>" +
      '<div class="ifs-chipset" role="group" aria-label="Principles">' + P.map(function(p){ var on = pk.indexOf(p.id) >= 0; return '<button type="button" class="ifs-' + p.tint + '" data-pr="' + p.id + '" data-k="pr' + p.id + '" aria-pressed="' + on + '">' + (on ? '<b aria-hidden="true">✓ </b>' : "") + p.t + "</button>"; }).join("") + "</div>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-s1chk="1" data-k="s1chk">Check</button></div><div class="ifs-s1fb">' + s1fb(i) + "</div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  b1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var i = byId(IN, S.s1.cur), pk = S.s1.pick[i.id] = S.s1.pick[i.id] || [];
    if (b.dataset.pr) { var k = pk.indexOf(b.dataset.pr); if (k >= 0) pk.splice(k, 1); else pk.push(b.dataset.pr); S.s1.chk[i.id] = false; api.save(); paintS1(); return; }
    if (b.dataset.s1chk) { S.s1.chk[i.id] = true; api.save(); paintS1(); refreshI(); stRepaint(); MV.focusFb($(".ifs-s1fb", b1)); }
  });
  function refreshI(){ iOpts().forEach(function(x, n){ iO[n].t = x.t; }); icRG.repaint(); }

  // Station 2: allies, not designers
  var b2 = $("#ifs-st-s2", host);
  function paintS2(){
    var all = S2.items.every(function(it){ return S.s2.pick[it.id]; }), right = S2.items.filter(function(it){ return S.s2.pick[it.id] === MV.ans(it); }).length, fin = S.s2.checked && right === S2.items.length;
    var h = "<p><strong>" + S2.ask + '</strong></p><ul class="ifs-sitems">' + ITEMS2.map(function(it){
      var pk = S.s2.pick[it.id], mk = S.s2.checked && pk ? (pk === MV.ans(it) ? "right" : "wrong") : "";
      return '<li class="ifs-si' + (mk ? " " + mk : "") + '"><span class="ifs-sit">' + (mk === "right" ? "✓ " : mk === "wrong" ? "✗ " : "") + "“" + it.t + "”" +
        (mk === "right" ? '<span class="tiny ifs-swhy">' + it.why + "</span>" : mk === "wrong" ? '<span class="tiny ifs-swhy">Try the other column.</span>' : "") + "</span>" +
        '<span class="ifs-chipset" role="group" aria-label="' + esc(it.t) + '">' + S2.cols.map(function(c){ var on = pk === c.id; return '<button type="button" data-so="' + c.id + '" data-it="' + it.id + '" data-k="so' + it.id + c.id + '" aria-pressed="' + on + '"' + (fin ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</span></li>";
    }).join("") + "</ul>";
    if (!fin) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-sochk="1" data-k="sochk"' + (all ? "" : " disabled") + ">Check the sort</button>" + (all ? "" : '<span class="tiny muted">Sort all nine first.</span>') + "</div>";
    if (S.s2.checked) h += fin ? MV.fbHTML("good", "<strong>✓ " + S2.done + "</strong>") : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + fill(S2.off, { n:S2.items.length - right }));
    MV.keepFocus(b2, function(){ b2.innerHTML = h; });
  }
  b2.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.so) { S.s2.pick[b.dataset.it] = b.dataset.so; S.s2.checked = false; api.save(); paintS2(); stRepaint(); return; }
    if (b.dataset.sochk) { S.s2.checked = true; api.save(); paintS2(); stRepaint(); MV.focusFb(b2); }
  });

  // Station 3: Check it with data
  var b3 = $("#ifs-st-s3", host);
  function paintS3(){
    var ok = S.s3.checked && S.s3.choice != null && MV.ok(S3.options[S.s3.choice]);
    var h = '<details class="alg ifs-data" open><summary>Check it with data</summary><p>' + S3.intro + '</p><div class="ifs-drows">' + S3.rows.map(function(r){
      return '<article class="ifs-drow"><h5 class="ifs-h5">' + r.t + '</h5><p><span class="tag">Source</span> ' + r.src + '</p><p class="tiny muted">' + S3.figure + "</p>" + (ok ? '<p class="ifs-cover"><strong>Coverage:</strong> ' + r.cover + "</p>" : "") + "</article>";
    }).join("") + '</div><p class="ifs-ask"><strong>' + S3.q + '</strong></p><div class="ifs-chipset ifs-col1" role="group" aria-label="' + esc(S3.q) + '">' +
      S3.options.map(function(o, i){ var on = S.s3.choice === i; return '<button type="button" data-s3="' + i + '" data-k="s3o' + i + '" aria-pressed="' + on + '"' + (ok ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>" +
      (ok ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-s3chk="1" data-k="s3chk"' + (S.s3.choice == null ? " disabled" : "") + ">Check</button></div>") +
      (S.s3.checked && S.s3.choice != null ? (ok ? MV.fbHTML("good", "<strong>✓ Right.</strong> " + S3.options[S.s3.choice].why) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + S3.options[S.s3.choice].why)) : "") + "</details>";
    MV.keepFocus(b3, function(){ b3.innerHTML = h; });
  }
  b3.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.s3 != null) { S.s3.choice = +b.dataset.s3; S.s3.checked = false; api.save(); paintS3(); return; }
    if (b.dataset.s3chk) { S.s3.checked = true; api.save(); paintS3(); stRepaint(); MV.focusFb(b3); }
  });

  function paintAll(){ stRG.set(S.st); stRepaint(); ST.forEach(function(s){ $("#ifs-st-" + s.id, host).hidden = s.id !== S.st; }); }
  paintS1(); refreshI(); paintS2(); paintS3(); paintAll();
}

// ---------- Performance task: Strengthen the circle (@component briefBuilder — initiative chips, principle / ally / evidence
// checkboxes with limits, leader chips, a free-text brief with a live word count, APA citation finder and flagged-phrase check,
// a preview card and a text-file download) ----------
var task = (function(){
  var api = null, rgI = null, rgL = null;
  function T(){ return MV.C.task; }
  function INS(){ return MV.C.part3.initiatives; }
  function PR(){ return MV.C.explore.principles; }
  function ALLY(){ return MV.shuffle(MV.C.part3.s2.items, MV.meta.id + "allies"); }
  function normS(s){ s = s || {}; s.init = s.init || ""; s.princ = Array.isArray(s.princ) ? s.princ : []; s.lead = s.lead || ""; s.ally = Array.isArray(s.ally) ? s.ally : []; s.ev = Array.isArray(s.ev) ? s.ev : []; s.text = typeof s.text === "string" ? s.text : ""; return s; }
  function st(){ return normS(api ? api.S : {}); }
  var CITE = /\(([^()]*?[A-Za-zÀ-ɏ\]][^()]*?),\s*((?:1[6-9]|20)\d{2}[a-z]?|n\.\s?d\.(?:-[a-z])?)\s*\)/g;
  function cites(t){ var out = [], m; CITE.lastIndex = 0; while ((m = CITE.exec(t))) out.push(m[0]); return out; }
  function norm(t){ return String(t || "").replace(/[’‘]/g, "'").replace(/\s+/g, " ").toLowerCase(); }
  function flagged(t){ var n = norm(t); return T().blocked.filter(function(b){ return n.indexOf(b.toLowerCase()) >= 0; }); }
  function read(){ var s = st(); return { init:s.init, princ:s.princ.slice(), lead:s.lead, ally:s.ally.slice(), ev:s.ev.slice(), text:s.text }; }
  function checks(d){
    var i = byId(INS(), d.init), acc = i ? MV.ans(i) : [], A = MV.C.part3.s2.items, n = words(d.text);
    return [
      !!i && d.princ.length >= 2 && d.princ.every(function(p){ return acc.indexOf(p) >= 0; }),
      d.lead === "community",
      d.ally.length === 2 && d.ally.every(function(a){ return MV.ans(byId(A, a)) === "ally"; }),
      d.ev.some(function(e){ return e !== "blog"; }),
      n >= 120 && n <= 220,
      cites(d.text).length > 0,
      !!d.text.trim() && !flagged(d.text).length
    ];
  }
  function pnames(list){ return PR().filter(function(p){ return list.indexOf(p.id) >= 0; }).map(function(p){ return lc(p.t); }); }
  function itTitle(i){ return i.code + " " + lc(i.t); }
  function textK(k){ var q = String(k).split("|"), i = byId(INS(), q[0]); return (i ? MV.plain(itTitle(i)) : q[0]) + "; " + pnames(q[1] ? q[1].split(",") : []).join(", "); }
  function lines(s){
    var i = byId(INS(), s.init), L = [], lead = byId(T().leads, s.lead), A = MV.C.part3.s2.items;
    L.push("Initiative: " + (i ? MV.plain(i.code + " " + i.t + " (" + lc(i.who) + ")") : "(none chosen)"));
    L.push("Principles strengthened: " + (s.princ.length ? pnames(s.princ).join(", ") : "(none)"));
    L.push("Who leads: " + (lead ? MV.plain(lead.t) : "(not chosen)"));
    L.push("Ally actions: " + (s.ally.length ? s.ally.map(function(a){ return MV.plain(byId(A, a).t); }).join("; ") : "(none)"));
    L.push("Evidence: " + (s.ev.length ? s.ev.map(function(e){ return MV.plain(byId(T().evidence, e).t); }).join("; ") : "(none)"));
    L.push("Brief: " + (s.text.trim() ? s.text.trim() : "(not written yet)"));
    return L;
  }
  function paint(){
    var s = st(), X = T().labels, n = words(s.text), c = cites(s.text), fl = flagged(s.text), i = byId(INS(), s.init);
    $("#tk-meta").innerHTML = '<span class="' + (n >= 120 && n <= 220 ? "ifs-okt" : "") + '">' + fill(X.words, { n:n }) + "</span> · " + (c.length ? esc(fill(X.cites, { list:c.join(", ") })) : X.noCite) + (fl.length ? ' · <strong class="ifs-flag">' + esc(fill(X.flagged, { list:fl.map(function(x){ return "“" + x + "”"; }).join(", ") })) + "</strong>" : "");
    // limits: ally actions 2, evidence 3
    $$("[data-ally]", $("#task-in")).forEach(function(cb){ cb.disabled = !cb.checked && s.ally.length >= 2; });
    $$("[data-ev]", $("#task-in")).forEach(function(cb){ cb.disabled = !cb.checked && s.ev.length >= 3; });
    var pv = $("#tk-pv");
    if (pv) pv.innerHTML = '<p class="tiny muted">' + (i ? i.code + " · " + i.t + " · " + i.who : X.pick) + "</p>" +
      (s.princ.length ? '<p class="ifs-pvp">' + PR().filter(function(p){ return s.princ.indexOf(p.id) >= 0; }).map(function(p){ return '<span class="ifs-ptag ifs-' + p.tint + '">' + p.t + "</span>"; }).join(" ") + "</p>" : "") +
      '<div class="ifs-pvtext">' + (s.text.trim() ? esc(s.text.trim()).replace(/\n+/g, "<br>") : '<span class="muted">Your brief appears here as you write.</span>') + "</div>";
  }
  function changed(){ api.save(); paint(); api.update(); MV.paintSummary(); }
  function toggle(list, id, on){ var k = list.indexOf(id); if (on && k < 0) list.push(id); if (!on && k >= 0) list.splice(k, 1); }
  return {
    render:function(inp, pv, a){
      api = a; var s = st(), X = T().labels;
      var ck = function(attr, id, html, on){ return '<label class="ifs-ck"><input type="checkbox" ' + attr + '="' + id + '"' + (on ? " checked" : "") + "> <span>" + html + "</span></label>"; };
      inp.innerHTML = '<div class="ifs-tk"><div id="tk-init"></div>' +
        '<fieldset class="ifs-fs"><legend>' + X.princ + ' <span class="tiny muted">(' + X.princSub + ')</span></legend><div class="ifs-checks">' + PR().map(function(p){ return ck("data-pr", p.id, p.t, s.princ.indexOf(p.id) >= 0); }).join("") + "</div></fieldset>" +
        '<div id="tk-lead"></div>' +
        '<fieldset class="ifs-fs"><legend>' + X.ally + ' <span class="tiny muted">(' + X.allySub + ')</span></legend><div class="ifs-checks">' + ALLY().map(function(x){ return ck("data-ally", x.id, x.t, s.ally.indexOf(x.id) >= 0); }).join("") + "</div></fieldset>" +
        '<fieldset class="ifs-fs"><legend>' + X.ev + ' <span class="tiny muted">(' + X.evSub + ')</span></legend><div class="ifs-checks">' + T().evidence.map(function(x){ return ck("data-ev", x.id, x.t, s.ev.indexOf(x.id) >= 0); }).join("") + "</div></fieldset>" +
        '<div class="ifs-fs"><label class="ifs-lab2" for="tk-brief">' + X.brief + ' <span class="tiny muted">(' + X.briefSub + ')</span></label><textarea id="tk-brief" class="ifs-brief"></textarea><p class="tiny ifs-meta" id="tk-meta" aria-live="polite"></p></div></div>';
      pv.innerHTML = '<div class="ifs-tpv"><h4 class="ifs-h4">Preview</h4><div class="ifs-pvcard" id="tk-pv"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="tk-save">' + X.save + '</button><span class="tiny muted" id="tk-saved" aria-live="polite"></span></div></div>';
      rgI = radios($("#tk-init"), { label:X.init, cls:"chips", aria:X.init, value:s.init, options:INS().map(function(i){ return { id:i.id, t:"<strong>" + i.code + "</strong> " + i.t }; }), onChange:function(v){ st().init = v; changed(); } });
      rgL = radios($("#tk-lead"), { label:"Who leads", cls:"chips", aria:"Who leads", value:s.lead, options:T().leads, onChange:function(v){ st().lead = v; changed(); } });
      $("#tk-brief").value = s.text;
      var tm = null;
      $("#tk-brief").addEventListener("input", function(e){ st().text = e.target.value; paint(); api.update(); clearTimeout(tm); tm = setTimeout(function(){ api.save(); MV.paintSummary(); }, 400); });
      inp.addEventListener("change", function(e){
        var t = e.target, x = st(), d = t.dataset || {};
        if (d.pr) { toggle(x.princ, d.pr, t.checked); changed(); }
        else if (d.ally) { if (t.checked && x.ally.length >= 2) { t.checked = false; return; } toggle(x.ally, d.ally, t.checked); changed(); }
        else if (d.ev) { if (t.checked && x.ev.length >= 3) { t.checked = false; return; } toggle(x.ev, d.ev, t.checked); changed(); }
      });
      $("#tk-save").addEventListener("click", function(){
        var ok = MV.download("initiative-brief.txt", ["STRENGTHEN THE CIRCLE: AN INITIATIVE BRIEF", ""].concat(lines(st())).join("\n") + "\n");
        $("#tk-saved").textContent = ok ? X.saved : X.noSave;
      });
      paint();
    },
    read:read,
    valid:function(d){ return d.init ? true : T().labels.pick; },
    checks:checks,
    key:function(d){ return d.init + "|" + PR().filter(function(p){ return d.princ.indexOf(p.id) >= 0; }).map(function(p){ return p.id; }).join(","); },
    label:function(k){ var q = k.split("|"), i = byId(INS(), q[0]); return (i ? "<strong>" + i.code + "</strong> (" : "(") + pnames(q[1] ? q[1].split(",") : []).join(", ") + ")"; },
    text:textK,
    summary:function(ts){
      var found = ts.found || [], s2 = normS(JSON.parse(JSON.stringify(ts.app || {})));
      var L = [T().summary + ": " + (found.length ? "solved (" + found.map(textK).join(" | ") + ")" : "not solved yet")];
      lines(s2).forEach(function(l){ L.push("  " + l); });
      return L;
    }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
