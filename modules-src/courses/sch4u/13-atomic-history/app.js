// SCH4U 13 Atomic History: hero (a timeline of five atom pictures over a gold-foil storyboard), Model timeline (Explore:
// Timeline cards with an Evidence board, a Thomson cathode ray tube, and a Geiger–Marsden gold-foil lab with sample
// trails and a histogram), Read Rutherford's data (Part 3: data table + log graph with inference chips, and a rink-to-
// nucleus zoom), "Reasoning from evidence" (ratio, number and choice items) and "A model that fits" (task with a live
// gold-foil preview).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
var N = " ", TINY = "1/100" + N + "000";
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function num(v){ return MV.num(v, 2); }
function LIN(t){ return t; }
function rng(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hashS(s){ var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
var DEG = Math.PI / 180;

// ---------- model values (plan §4) ----------
// Gold-foil counts per 8000 alpha particles: [< 10°, 10°–90°, > 90°].
var GF = { plum:[8000, 0, 0], n5:[7990, 9, 1], n4:[7000, 900, 100], n3:[800, 5200, 2000] };
// Task preview only: a centre 1/10 of the atom's width. Model value added in this module (the plan's table stops at 1/1000).
var GF_TENTH = [0, 3200, 4800];
// Nucleus widths (fraction of the atom's width); R = drawn nucleus radius in px (far larger than scale).
var WID = [{ id:"n5", t:"1/100" + N + "000", R:2.6 }, { id:"n4", t:"1/10" + N + "000", R:5 }, { id:"n3", t:"1/1000", R:10 }];
function widOf(id){ return WID.filter(function(w){ return w.id === id; })[0] || WID[0]; }
var METALS = [{ id:"cu", t:"copper" }, { id:"fe", t:"iron" }, { id:"al", t:"aluminium" }];
function metalT(id){ return (METALS.filter(function(m){ return m.id === id; })[0] || METALS[0]).t; }
var BINS = ["< 10°", "10°–90°", "> 90°"];
function cum(key, k){ var c = GF[key], m = Math.round(c[1] * k / 8), b = Math.round(c[2] * k / 8); return [1000 * k - m - b, m, b]; }
function oneIn(fired, b){ return b ? " (1 in " + num(Math.round(fired / b)) + ")" : ""; }

// @component radioGroup (from MHF4U 25, via SCH4U 01–07) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '"' + (o.i ? ' font-style="italic"' : "") + ' fill="' + (o.c || "var(--ink)") + '"' + opA(o.op) + ">" + s + "</text>"; }
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.cls ? ' class="' + o.cls + '"' : "") + opA(o.op) + "/>"; }
function poly(pts, o){ o = o || {}; if (pts.length < 2) return ""; return '<polyline points="' + pts.map(function(p){ return r1(p[0]) + "," + r1(p[1]); }).join(" ") + '" fill="none" stroke="' + (o.c || "var(--pen)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' + opA(o.op) + "/>"; }
// arc-length helpers: lens(pts) -> cumulative lengths; cut(tr, f) -> {pts, head} for the first fraction f of the path
function lens(pts){ var L = [0]; for (var i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; }
function cutAt(pts, L, d){
  if (d <= 0) return { pts:[pts[0]], head:pts[0] };
  var tot = L[L.length - 1]; if (d >= tot) return { pts:pts, head:pts[pts.length - 1] };
  var out = [pts[0]];
  for (var i = 1; i < pts.length; i++) {
    if (L[i] >= d) { var u = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1), h = [lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)]; out.push(h); return { pts:out, head:h }; }
    out.push(pts[i]);
  }
  return { pts:pts, head:pts[pts.length - 1] };
}
function alphaGlyph(x, y, lab){ return circ(x, y, 5, "var(--pen)") + (lab ? tx(x, y - 13, "2+", { fs:11.5, w:700, c:"var(--pen)" }) : ""); }

// Path of a positive alpha particle past a positive nucleus at (nx, ny). It starts at x0, height ny + b, moving right,
// and leaves deflected by th (radians) away from the nucleus (inverse-square repulsion, integrated in small steps).
// box = [xmin, ymin, xmax, ymax]; the path stops when it leaves the box.
function rpath(nx, ny, b, th, x0, box){
  var pts = [[x0, ny + b]];
  if (th < 1e-4) { pts.push([box[2], ny + b]); return pts; }
  var K = Math.abs(b) * Math.tan(Math.min(th, 3.1) / 2), x = x0, y = ny + b, vx = 1, vy = 0, lx = x, ly = y, la = 0, n = 0;
  function acc(){ var dx = x - nx, dy = y - ny, r2 = dx * dx + dy * dy, r = Math.sqrt(r2), f = K / (r2 * r); return [f * dx, f * dy, r]; }
  var a = acc();
  while (n++ < 20000) {
    var sp = Math.sqrt(vx * vx + vy * vy), h = Math.min(2.5, a[2] / 30) / Math.max(sp, 0.25);
    vx += 0.5 * a[0] * h; vy += 0.5 * a[1] * h; x += vx * h; y += vy * h; a = acc(); vx += 0.5 * a[0] * h; vy += 0.5 * a[1] * h;
    if (x < box[0] || x > box[2] || y < box[1] || y > box[3]) { pts.push([x, y]); break; }
    var d = Math.hypot(x - lx, y - ly), ang = Math.atan2(vy, vx);
    if (d >= 90 || (d >= 2.5 && Math.abs(ang - la) > 0.04)) { pts.push([x, y]); lx = x; ly = y; la = ang; }
  }
  return pts;
}

// @component atomPic — the five historical atom models as SVG pictures: Dalton's solid ball, Thomson's plum pudding,
// Rutherford's nucleus in empty space, Bohr's rings of energy levels, the quantum orbital cloud (nucleus cerulean with
// "+", electrons violet). atomPic(kind, cx, cy, r, {seed, s}) -> SVG string; s (0–1) morphs a plum pudding into a nucleus.
var PL_E = [[-0.45, -0.38], [0.36, -0.5], [0.52, 0.12], [-0.08, 0.06], [-0.5, 0.36], [0.18, 0.55], [-0.05, -0.66]];
var PL_P = [[0.02, -0.3], [-0.3, 0.12], [0.28, 0.32], [0.3, -0.12]];
function atomPic(kind, cx, cy, r, o){
  o = o || {}; var h = "", R = rng(o.seed || 7), er = Math.max(1.8, r * 0.075), nr = Math.max(2.2, r * 0.08);
  function nuc(){ return circ(cx, cy, nr, "var(--at-m)") + (r >= 34 ? tx(cx + nr + 5, cy - nr - 4, "+", { fs:Math.round(r * 0.26), w:700, c:"var(--at-m)" }) : ""); }
  if (kind === "dalton") {
    h += circ(cx, cy, r, "var(--ink-2)", { op:0.5 }) + circ(cx - r * 0.3, cy - r * 0.32, r * 0.32, "var(--sheet)", { op:0.4 }) + circ(cx, cy, r, "none", { s:"var(--ink)", sw:1.6 });
  } else if (kind === "thomson") {
    var s = o.s || 0, sr = lerp(r, nr, s);
    h += circ(cx, cy, sr, "var(--at-m)", { op:lerp(0.2, 1, s * s) });
    if (s < 0.98) h += circ(cx, cy, sr, "none", { s:"var(--at-m)", sw:1.4, op:1 - s });
    if (s > 0.02) h += circ(cx, cy, r, "none", { s:"var(--ink-2)", sw:1.1, d:"3 3", op:0.7 * s });
    if (r >= 26 && s < 0.5) PL_P.forEach(function(p){ h += tx(cx + p[0] * r, cy + p[1] * r, "+", { fs:Math.round(r * 0.3), w:700, c:"var(--at-m)", op:1 - 2 * s }); });
    PL_E.forEach(function(p){ h += circ(cx + p[0] * r, cy + p[1] * r, er, "var(--e-pair)"); });
  } else if (kind === "rutherford") {
    h += circ(cx, cy, r, "none", { s:"var(--ink-2)", sw:1.1, d:"3 3", op:0.75 });
    [[0.95, 0.42, 25], [0.95, 0.42, -40], [0.62, 0.3, 75]].forEach(function(e){ h += '<ellipse cx="' + r1(cx) + '" cy="' + r1(cy) + '" rx="' + r1(r * e[0] * 0.9) + '" ry="' + r1(r * e[1] * 0.9) + '" fill="none" stroke="var(--e-pair)" stroke-width="1" opacity=".4" transform="rotate(' + e[2] + " " + r1(cx) + " " + r1(cy) + ')"/>'; });
    [[0.75, -0.35], [-0.62, -0.42], [-0.28, 0.58], [0.4, 0.42]].forEach(function(p){ h += circ(cx + p[0] * r, cy + p[1] * r, er, "var(--e-pair)"); });
    h += nuc();
  } else if (kind === "bohr") {
    [0.36, 0.66, 0.96].forEach(function(f){ h += circ(cx, cy, r * f, "none", { s:"var(--ink-2)", sw:1.2, op:0.75 }); });
    [[0.36, -60], [0.36, 120], [0.66, 20], [0.66, 200], [0.66, 290], [0.96, 150]].forEach(function(e){ h += circ(cx + r * e[0] * Math.cos(e[1] * DEG), cy + r * e[0] * Math.sin(e[1] * DEG), er, "var(--e-pair)"); });
    h += nuc();
  } else if (kind === "qm") {
    var dots = "";
    for (var i = 0; i < 110; i++) {
      var u = Math.max(1e-6, R()), v = R(), g = Math.sqrt(-2 * Math.log(u)) * 0.36, rr = Math.min(0.98, Math.abs(g)) * r, an = v * 2 * Math.PI;
      dots += circ(cx + rr * Math.cos(an), cy + rr * Math.sin(an), Math.max(0.8, r * 0.032), "var(--e-pair)", { op:0.55 });
    }
    h += dots + nuc();
  }
  return h;
}

// ---------- hero: timeline strip + gold-foil storyboard ----------
var HK = ["dalton", "thomson", "rutherford", "bohr", "qm"], HN = ["Dalton", "Thomson", "Rutherford", "Bohr", "Quantum"], HY = ["1808", "1904", "1911", "1913", "1926"];
var HA = [160, 225, 290], HX = 290, HBOX = [36, 120, 482, 332];
// [start height, deflection in degrees]: two swerves, one bounce-back off the middle nucleus, the rest nearly straight
var HT = [[133, 1.5], [146, 3], [155, 38], [172, 3.5], [186, 1.6], [199, 1.6], [212, 3.3], [225.9, 172], [238, 3.3], [251, 1.6], [266, 1.8], [284, 30], [300, 4], [314, 1.8]];
function heroTrails(nuclear){
  return HT.map(function(t, i){
    var y0 = t[0], ny = HA.reduce(function(a, y){ return Math.abs(y - y0) < Math.abs(a - y0) ? y : a; }, HA[0]);
    var pts = nuclear ? rpath(HX, ny, y0 - ny, t[1] * DEG, 50, HBOX) : [[50, y0], [482, y0]];
    return { pts:pts, L:lens(pts), st:((i * 37) % 7) / 7 * 150, back:t[1] > 90 };
  });
}
function hero(f){
  var svg = $("#ah-hx-svg"), ctr = $("#ah-hx-ctr"), rep = $("#ah-hx-replay"), cap = f.cap;
  if (!svg) return;
  var P0 = heroTrails(false), P1 = heroTrails(true), st = { hi:1, s:0, ph:0, prog:0, done:false }, run = 0;
  function strip(){
    var h = "";
    HK.forEach(function(k, i){
      var x = 48 + i * 96;
      if (st.hi === i) h += rect(x - 45, 2, 90, 106, "var(--hi-soft)", { rx:10, s:"var(--hi)", sw:2 });
      h += atomPic(k, x, 42, 30, { seed:5 + i }) + tx(x, 85, HN[i], { fs:12.5, w:st.hi === i ? 700 : 400 }) + tx(x, 100, HY[i], { fs:12.5, w:700, c:"var(--ink-2)" });
    });
    return h + ln(10, 116, 470, 116, { c:"var(--rule)", w:1.2 });
  }
  function draw(){
    var h = strip(), T = st.ph === 0 ? P0 : P1, tr = "", heads = "";
    h += rect(268, 124, 44, 202, null, { cls:"ah-foil" });
    HA.forEach(function(y, i){ h += atomPic("thomson", HX, y, 31, { seed:20 + i, s:st.s }); });
    T.forEach(function(t){
      var Lm = t.L[t.L.length - 1], d = st.done ? Lm : st.prog * (520 + 150) - t.st;
      if (d <= 0) return;
      var c = cutAt(t.pts, t.L, d);
      tr += poly(c.pts, { c:"var(--pen)", w:t.back && st.ph ? 2.6 : 1.4, op:t.back && st.ph ? 1 : 0.6 });
      if (d < Lm) heads += circ(c.head[0], c.head[1], 3.6, "var(--pen)");
    });
    h += tr + heads + alphaGlyph(22, 225, true) + tx(10, 312, "alpha particles", { a:"start", fs:11.5, c:"var(--ink-2)" });
    svg.innerHTML = h;
  }
  function counter(html){ ctr.innerHTML = html; }
  function final(){ st = { hi:2, s:1, ph:1, prog:1, done:true }; draw(); counter("Bounced straight back: <strong>1 in 8000</strong>"); cap.textContent = "Something tiny, dense and positive."; rep.hidden = false; }
  function play(){
    var id = ++run; rep.hidden = true; cap.textContent = ""; st = { hi:1, s:0, ph:0, prog:0, done:false }; draw();
    counter("Plum pudding atoms: every alpha particle passes straight through.");
    MV.tween({ dur:2600, ease:LIN, step:function(t){ if (id !== run) return; st.prog = t; draw(); }, done:function(){
      if (id !== run) return; st.done = true; draw();
      MV.wait(500, function(){
        if (id !== run) return; counter("Now shrink the positive charge into a tiny nucleus…"); st.done = false; st.prog = 0; st.hi = 2;
        MV.tween({ dur:1100, step:function(t){ if (id !== run) return; st.s = t; draw(); }, done:function(){
          if (id !== run) return; st.ph = 1;
          counter("Most pass straight, a few swerve, and one bounces straight back.");
          MV.tween({ dur:3000, ease:LIN, step:function(t){ if (id !== run) return; st.prog = t; draw(); }, done:function(){ if (id !== run) return; final(); } });
        } });
      });
    } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore geometry ----------
// cathode ray tube (viewBox 640 × 270): beam axis y 135; + plate at the bottom, so "toward +" is down
var CR = { y:135, xc:52, xa:124, x1:250, x2:390, xs:600 };
function crtNet(c){ return (c.pl || 0) + (c.mg ? (c.dir === "up" ? -c.mg : c.mg) : 0); }
function beamPts(d){
  var s = d * 3, pts = [[CR.xc, CR.y], [CR.x1, CR.y]];
  for (var i = 1; i <= 14; i++) { var u = i / 14; pts.push([CR.x1 + u * 140, CR.y + s * u * u]); }
  pts.push([CR.xs, CR.y + s + 2 * s * (CR.xs - CR.x2) / 140]);
  return pts;
}
function fracAtX(pts, L, x){ for (var i = 1; i < pts.length; i++) if (pts[i][0] >= x) { var u = (x - pts[i - 1][0]) / ((pts[i][0] - pts[i - 1][0]) || 1); return lerp(L[i - 1], L[i], u) / L[L.length - 1]; } return 1; }
// gold foil (viewBox 640 × 300): one column of four gold atoms, the foil band behind them
var GA = [38, 104, 170, 236], GX = 330, GRAD = 33, GBOX = [6, -12, 646, 312], GX0 = 14;
var TCACHE = {};
function gfTrails(key){
  if (TCACHE[key]) return TCACHE[key];
  var c = GF[key], plum = key === "plum", nB = plum ? 0 : Math.max(1, Math.round(40 * c[2] / 8000)), nM = plum ? 0 : Math.max(1, Math.round(40 * c[1] / 8000)), nS = 40 - nB - nM;
  var list = [], R = rng(hashS("gf" + key)), Rn = plum ? 0 : widOf(key).R, i;
  // interleave the categories evenly through the 8 batches of 5 drawn paths (the bounce-back of 1/100 000 lands in batch 4)
  for (i = 0; i < nB; i++) list.push({ c:"B", p:(i + 0.5) / nB, o:0 });
  for (i = 0; i < nM; i++) list.push({ c:"M", p:(i + 0.5) / nM, o:1 });
  for (i = 0; i < nS; i++) list.push({ c:"S", p:(i + 0.5) / nS, o:2 });
  list.sort(function(a, b){ return a.p - b.p || a.o - b.o; });
  var nAt = { B:0, M:0 }, ORD = { B:[1, 2, 0, 3], M:[2, 1, 3, 0] };
  list.forEach(function(it, j){
    var ny = GA[it.c === "S" ? j % 4 : ORD[it.c][nAt[it.c]++ % 4]], sg = R() < 0.5 ? -1 : 1, b, th;
    if (plum) {
      b = sg * (1.5 + R() * 30.5); th = (0.15 + R() * 0.7) * DEG * (R() < 0.5 ? -1 : 1);
      it.pts = [[GX0, ny + b], [GX, ny + b], [GBOX[2], ny + b + Math.tan(th) * (GBOX[2] - GX)]];
    } else {
      if (it.c === "S") { b = sg * lerp(2 * Rn + 4, 32, R()); th = clamp(30 / Math.abs(b), 0.4, 8) * DEG; }
      else if (it.c === "M") { var lo = Rn * 0.6 + 0.8, hi = Rn * 1.9 + 1.5, ab = lerp(lo, hi, R()); b = sg * ab; th = (lerp(80, 15, (ab - lo) / (hi - lo)) + R() * 4) * DEG; }
      else { var hb = Math.max(0.95, Rn * 0.45), bb = lerp(0.5, hb, R()); b = sg * bb; th = lerp(176, 138, (bb - 0.5) / (hb - 0.5 || 1)) * DEG; }
      it.pts = rpath(GX, ny, b, th, GX0, GBOX);
    }
    it.L = lens(it.pts);
  });
  TCACHE[key] = list;
  return list;
}
function gfAtom(y, key, i){
  var h = "";
  if (key === "plum") {
    h += circ(GX, y, GRAD, "var(--at-m)", { op:0.18 }) + circ(GX, y, GRAD, "none", { s:"var(--at-m)", sw:1.3, op:0.65 });
    [[-0.3, -0.35], [0.32, 0.1], [-0.18, 0.42]].forEach(function(p){ h += tx(GX + p[0] * GRAD, y + p[1] * GRAD, "+", { fs:12, w:700, c:"var(--at-m)" }); });
    [[0.3, -0.45], [-0.5, 0.05], [0.05, 0.6], [0.55, 0.45], [0.05, -0.1]].forEach(function(p){ h += circ(GX + p[0] * GRAD, y + p[1] * GRAD, 2.6, "var(--e-pair)"); });
  } else {
    var R = widOf(key).R;
    h += circ(GX, y, GRAD, "none", { s:"var(--ink-2)", sw:1.1, d:"3 3", op:0.6 });
    [[0.62, -0.52], [-0.66, 0.36], [0.2, 0.78]].forEach(function(p){ h += circ(GX + p[0] * GRAD, y + p[1] * GRAD, 2.4, "var(--e-pair)"); });
    h += circ(GX, y, R, "var(--at-m)") + (R >= 7 ? tx(GX, y + 0.5, "+", { fs:13, w:700, c:"var(--sheet)" }) : tx(GX + R + 5, y - R - 5, "+", { fs:11, w:700, c:"var(--at-m)" }));
  }
  return h;
}

// ---------- Explore: Model timeline ----------
function explore(host, api){
  var S = api.S, C = api.content, CARDS = C.cards, EV = C.evidence, TG = C.targets;
  if (["tl", "crt", "gf"].indexOf(S.mode) < 0) S.mode = "tl";
  var tl = S.tl = S.tl || {}; tl.cur = clamp(Math.round(+tl.cur || 0), 0, 4); if (!tl.place || typeof tl.place !== "object") tl.place = {};
  Object.keys(tl.place).forEach(function(k){ if (TG.indexOf(tl.place[k]) < 0) delete tl.place[k]; });
  var cr = S.crt = S.crt || {}; cr.pl = clamp(Math.round(+cr.pl || 0), 0, 5); cr.mg = clamp(Math.round(+cr.mg || 0), 0, 5); cr.dir = cr.dir === "down" ? "down" : "up";
  if (!METALS.some(function(m){ return m.id === cr.metal; })) cr.metal = "cu"; cr.f = clamp(+cr.f || 0, 0, 1);
  var gf = S.gf = S.gf || {}; gf.model = gf.model === "nuc" ? "nuc" : "plum"; if (!WID.some(function(w){ return w.id === gf.w; })) gf.w = "n5";
  gf.fired = clamp(Math.round((+gf.fired || 0) / 1000) * 1000, 0, 8000);
  var busy = false, locked = false, tw = null, playT = null, note = "", metalNote = false, hlBack = false, part = null, flow = -1, sel = null, bmsg = "", drag = null, ghost = null, noClick = false;

  host.innerHTML = '<p class="how ah-how">' + C.how + '</p><div class="ah-modes"></div>' +
    '<div class="ah-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ah-pane" data-pane="tl"><div class="ah-cards" role="list" aria-label="Five atomic models, oldest first"></div><div class="ah-board"></div></div>' +
    '<div class="ah-pane" data-pane="crt"><div class="ah-box"><svg class="ah-svg" id="ah-crt" viewBox="0 0 640 270" role="img" aria-label=""></svg></div></div>' +
    '<div class="ah-pane" data-pane="gf"><div class="ah-gfgrid"><div class="ah-gfv"><div class="ah-box"><svg class="ah-svg" id="ah-gf" viewBox="0 0 640 300" role="img" aria-label=""></svg></div>' +
    '<p class="ah-legend"><span><i class="ah-dot" style="background:var(--pen)"></i>alpha particle (2+)</span><span><i class="ah-dot" style="background:var(--at-m)"></i>gold nucleus (+)</span><span><i class="ah-dot" style="background:var(--e-pair)"></i>electron (−)</span></p></div>' +
    '<div class="ah-hist"><p class="ah-hl">Particles counted at the screen</p><canvas class="plot" role="img" aria-label=""></canvas></div></div></div>' +
    '<p class="ah-cap" aria-live="polite"></p><div class="ah-bar"></div></div>' +
    '<div class="ah-grid"><div class="ah-ctrl">' +
    '<div class="ah-c" data-for="tl"><div class="ah-pick"></div></div>' +
    '<div class="ah-c" data-for="crt"><div class="ah-pl"></div><div class="ah-mg"></div><div class="ah-dir"></div><div class="ah-mt"></div><p class="tiny muted">' + C.crtNote + "</p></div>" +
    '<div class="ah-c" data-for="gf"><div class="ah-md"></div><div class="ah-wd"></div><p class="tiny muted">' + C.gfNote + "</p></div>" +
    '</div><div class="ah-right"><dl class="read ah-read" aria-live="polite"></dl></div></div>';
  var crtSvg = $("#ah-crt"), gfSvg = $("#ah-gf"), cardsBox = $(".ah-cards", host), board = $(".ah-board", host), bar = $(".ah-bar", host);

  // ----- controls -----
  var offN = function(u){ return [{ id:"0", t:"off" }].concat([1, 2, 3, 4, 5].map(function(v){ return { id:String(v), t:v + (u || "") }; })); };
  var RG = {};
  RG.mode = radios($(".ah-modes", host), { label:"Mode", aria:"Lab mode", options:C.modes, value:S.mode, onChange:function(v){ stopPlay(); S.mode = v; note = ""; api.save(); paint(); } });
  RG.pick = radios($(".ah-pick", host), { label:"Model", aria:"Model shown", cls:"chips", options:CARDS.map(function(c, i){ return { id:String(i), t:c.name }; }), value:String(tl.cur), onChange:function(v){ stopPlay(); tl.cur = +v; api.save(); paint(true); } });
  RG.pl = radios($(".ah-pl", host), { label:"Electric plates", aria:"Electric plates, kilovolts", cls:"chips", options:offN(" kV"), value:String(cr.pl), onChange:function(v){ cr.pl = +v; crtChanged(); } });
  RG.mg = radios($(".ah-mg", host), { label:"Magnet strength", aria:"Magnet strength", cls:"chips", options:offN(""), value:String(cr.mg), onChange:function(v){ cr.mg = +v; crtChanged(); } });
  RG.dir = radios($(".ah-dir", host), { label:"Magnet pushes the beam", aria:"Magnet direction", options:[{ id:"up", t:"up" }, { id:"down", t:"down" }], value:cr.dir, onChange:function(v){ cr.dir = v; crtChanged(); } });
  RG.mt = radios($(".ah-mt", host), { label:"Cathode metal", aria:"Cathode metal", cls:"chips", options:METALS, value:cr.metal, onChange:function(v){ cr.metal = v; note = ""; api.save(); paint(); metalNote = true; paintRead(); } });
  RG.md = radios($(".ah-md", host), { label:"Atom model", aria:"Atom model", options:[{ id:"plum", t:"plum pudding" }, { id:"nuc", t:"nuclear" }], value:gf.model, onChange:function(v){ gf.model = v; gfChanged(); } });
  RG.wd = radios($(".ah-wd", host), { label:"Nucleus width (nuclear model only)", aria:"Nucleus width as a fraction of the atom’s width", cls:"chips", options:WID, value:gf.w,
    disabled:function(){ return gf.model === "plum"; }, onChange:function(v){ gf.w = v; gfChanged(); } });
  function crtChanged(){ metalNote = false; note = ""; api.save(); paint(); }
  function gfChanged(){ gf.fired = 0; part = null; hlBack = false; note = ""; RG.wd.paint(); api.save(); paint(); }
  function lock(b){
    locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); });
    paintBar(); paintBoard();
  }
  function gkey(){ return gf.model === "plum" ? "plum" : gf.w; }

  // ----- histogram (graph engine) -----
  var hist = new MV.Plot($(".ah-hist canvas", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  function shown(){ var key = gkey(); if (part) { var a = cum(key, part.k - 1), b = cum(key, part.k); return a.map(function(v, i){ return Math.round(lerp(v, b[i], part.t)); }); } return cum(key, gf.fired / 1000); }
  function firedNow(){ return part ? Math.round(lerp((part.k - 1) * 1000, part.k * 1000, part.t)) : gf.fired; }
  hist.render = function(){
    var c = shown(), F = firedNow();
    hist.draw({ grid:false, axes:false, ticks:false,
      describe:"Deflection histogram, " + F + " of 8000 particles counted: fewer than 10°, " + c[0] + "; 10° to 90°, " + c[1] + "; more than 90°, " + c[2] + ".",
      after:function(ctx, p){
        var W = p.W, H = p.H, L = 48, Rm = 10, T = 28, B = 44, ph = H - T - B, pw = W - L - Rm, fu = p.fontUI, ink = MV.css("--ink"), ink2 = MV.css("--ink-2");
                ctx.font = "12px " + fu; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        for (var g = 0; g <= 8000; g += 2000) { var y = T + ph - g / 8000 * ph; ctx.strokeStyle = MV.css("--plot-grid"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Math.round(y) + 0.5); ctx.lineTo(W - Rm, Math.round(y) + 0.5); ctx.stroke(); ctx.fillStyle = ink2; ctx.fillText(num(g), L - 6, y); }
        ctx.strokeStyle = MV.css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, T + ph + 0.5); ctx.lineTo(W - Rm, T + ph + 0.5); ctx.stroke();
        var bw = pw / 3;
        c.forEach(function(v, i){
          var x = L + bw * (i + 0.5), w = bw * 0.58, hh = v > 0 ? Math.max(3, v / 8000 * ph) : 0;
          if (hlBack && i === 2) { ctx.fillStyle = MV.css("--hi"); ctx.fillRect(x - w / 2 - 4, T + ph - hh - 26, w + 8, hh + 26); }
          ctx.fillStyle = MV.css("--pen"); ctx.fillRect(x - w / 2, T + ph - hh, w, hh);
          ctx.font = "700 14px " + fu; ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(num(v), x, T + ph - hh - 4);
          ctx.font = "12.5px " + fu; ctx.fillStyle = ink2; ctx.textBaseline = "top"; ctx.fillText(BINS[i], x, T + ph + 6);
        });
        ctx.font = "12px " + fu; ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("deflection angle", L + pw / 2, H - 4);
      } });
  };

  // ----- drawing -----
  function crtSVG(f){
    var c = cr, d = crtNet(c), h = "", on = f > 0, pts = beamPts(d), L = lens(pts);
    h += '<path d="M30 86 H420 L600 14 V256 L420 184 H30 Q16 184 16 170 V100 Q16 86 30 86 Z" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.6"/>';
    h += tx(636, 8, "screen", { a:"end", fs:12, c:"var(--ink-2)" });
    for (var k = -10; k <= 10; k++) h += ln(600, CR.y + 12 * k, k % 5 ? 606 : 610, CR.y + 12 * k, { c:"var(--ink-2)", w:k % 5 ? 1 : 1.6 });
    h += ln(600, 16, 600, 254, { c:"var(--ink-2)", w:4 });
    // cathode and anode
    h += rect(CR.xc - 9, 110, 8, 50, "var(--at-m)", { rx:2 }) + tx(CR.xc - 5, 100, "cathode (−)", { fs:12 }) + tx(CR.xc - 5, 172, metalT(c.metal), { fs:12, w:700, c:"var(--at-m)" });
    h += rect(CR.xa - 4, 104, 8, 25, "var(--at-m)", { rx:2 }) + rect(CR.xa - 4, 141, 8, 25, "var(--at-m)", { rx:2 }) + tx(CR.xa, 96, "anode", { fs:12 });
    // plates (− on top, + at the bottom)
    var pOn = c.pl > 0, pc = pOn ? "var(--ink)" : "var(--ink-2)", po = pOn ? 1 : 0.45;
    h += rect(CR.x1, 92, 140, 7, pc, { rx:2, op:po }) + rect(CR.x1, 171, 140, 7, pc, { rx:2, op:po });
    h += tx(CR.x1 - 12, 95, "−", { fs:20, w:700, op:pOn ? 1 : 0.55 }) + tx(CR.x1 - 12, 175, "+", { fs:20, w:700, op:pOn ? 1 : 0.55 });
    h += tx(CR.x1 + 70, 110, pOn ? "plates " + c.pl + " kV" : "plates off", { fs:12, c:"var(--ink-2)" });
    // magnet poles outside the glass
    var mOn = c.mg > 0, mo = mOn ? 1 : 0.4;
    h += rect(CR.x1, 50, 140, 22, "none", { rx:5, s:"var(--ink)", sw:1.6, op:mo }) + rect(CR.x1, 198, 140, 22, "none", { rx:5, s:"var(--ink)", sw:1.6, op:mo });
    h += tx(320, 61, mOn ? "magnet " + c.mg + (c.dir === "up" ? " ↑ pushes up" : " ↓ pushes down") : "magnet off", { fs:12, w:mOn ? 700 : 400, op:mOn ? 1 : 0.7 }) + tx(320, 209, "magnet", { fs:12, op:mo });
    if (on) {
      var cu = cutAt(pts, L, f * L[L.length - 1]);
      h += poly(cu.pts, { c:"var(--e-pair)", w:8, op:0.22 }) + poly(cu.pts, { c:"var(--e-pair)", w:2.6 });
      if (f >= 1) { var sp = pts[pts.length - 1]; h += circ(sp[0], sp[1], 9, "var(--e-pair)", { op:0.3 }) + circ(sp[0], sp[1], 4.5, "var(--e-pair)"); }
      else h += circ(cu.head[0], cu.head[1], 4.2, "var(--e-pair)");
      var fl = flow < 0 ? 0 : flow, lab = false;
      [0.1, 0.3, 0.5, 0.7, 0.9].forEach(function(q){
        var qq = (q + fl) % 1; if (qq > f - 0.02) return;
        var e = cutAt(pts, L, qq * L[L.length - 1]).head;
        h += circ(e[0], e[1], 3.4, "var(--e-pair)");
        if (!lab && e[0] > 150 && e[0] < 240) { lab = true; h += tx(e[0], e[1] - 13, "e<tspan dy='-5' font-size='10'>−</tspan>", { fs:13, w:700, c:"var(--e-pair)" }); }
      });
    }
    return h;
  }
  function crtDescribe(){
    var d = crtNet(cr), f = cr.f;
    var t = "Cathode ray tube. Cathode made of " + metalT(cr.metal) + ". Plates " + (cr.pl ? cr.pl + " kV, with + at the bottom" : "off") + "; magnet " + (cr.mg ? "strength " + cr.mg + ", pushing " + cr.dir : "off") + ". ";
    if (f <= 0) return t + "The beam is off.";
    if (f < 1) return t + "The beam has reached " + (f < 0.3 ? "the anode." : "the end of the plates.");
    return t + "The beam hits the screen " + (d === 0 ? "in the centre: it goes straight." : Math.abs(d) + " unit" + (Math.abs(d) > 1 ? "s" : "") + (d > 0 ? " toward the + plate side." : " away from the + plate side."));
  }
  function gfSVG(){
    var key = gkey(), T = gfTrails(key), k = gf.fired / 1000, full = 5 * (part ? part.k - 1 : k), h = "", lay = { S:"", M:"", B:"", hl:"" }, heads = "", headLab = false;
    h += rect(GX - 33, 0, 66, 272, null, { cls:"ah-foil" });
    GA.forEach(function(y, i){ h += gfAtom(y, key, i); });
    T.forEach(function(tr, j){
      var pts = null, head = null;
      if (j < full) pts = tr.pts;
      else if (part && j < 5 * part.k) { var cu = cutAt(tr.pts, tr.L, part.t * tr.L[tr.L.length - 1]); pts = cu.pts; if (part.t < 1) head = cu.head; }
      if (!pts) return;
      var st = tr.c === "S" ? { w:1.2, op:0.55 } : tr.c === "M" ? { w:1.9, op:0.9 } : { w:2.6, op:1 };
      if (tr.c === "B" && hlBack) lay.hl += poly(pts, { c:"var(--hi)", w:8, op:0.8 });
      lay[tr.c] += poly(pts, { c:"var(--pen)", w:st.w, op:st.op });
      if (head) { heads += circ(head[0], head[1], 4.4, "var(--pen)"); if (!headLab) { headLab = true; heads += tx(head[0], head[1] - 12, "2+", { fs:11, w:700, c:"var(--pen)" }); } }
    });
    h += lay.hl + lay.S + lay.M + lay.B + heads;
    h += alphaGlyph(22, 286, true) + tx(34, 286, "alpha beam →", { a:"start", fs:14, c:"var(--ink-2)" });
    h += tx(GX, 287, "gold foil, zoomed in", { fs:14, c:"var(--ink-2)" }) + tx(634, 287, "to the screen →", { a:"end", fs:14, c:"var(--ink-2)" });
    return h;
  }
  function gfModelT(){ return gf.model === "plum" ? "plum pudding: positive charge spread through each atom" : "nuclear: a tiny positive nucleus " + widOf(gf.w).t + " of the atom’s width"; }
  function gfDescribe(){
    var c = shown(), F = firedNow();
    return "Gold-foil lab, " + gfModelT() + ". " + (F ? F + " alpha particles fired: " + c[0] + " passed nearly straight, " + c[1] + " turned 10° to 90°, " + c[2] + " bounced back. " + Math.min(40, F / 200) + " sample paths are drawn." : "No particles fired yet.");
  }
  function drawGF(){ gfSvg.innerHTML = gfSVG(); gfSvg.setAttribute("aria-label", gfDescribe()); hist.render(); }
  function drawCRT(){ crtSvg.innerHTML = crtSVG(cr.f); crtSvg.setAttribute("aria-label", crtDescribe()); }

  // ----- timeline cards and the evidence board -----
  cardsBox.innerHTML = CARDS.map(function(c, i){
    return '<article class="ah-card" data-card="' + i + '" role="listitem"><svg class="ah-pic" viewBox="0 0 120 92" aria-hidden="true">' + atomPic(c.id, 60, 46, 40, { seed:3 + i }) + "</svg>" +
      '<h4><span>' + c.name + '</span> <span class="ah-yr">' + c.year + '</span></h4><p class="ah-sub">' + c.sub + "</p>" +
      '<dl class="ah-dl"><dt>What it explained</dt><dd>' + c.explained + "</dd><dt>What it couldn’t explain</dt><dd>" + c.couldnt + "</dd><dt>The evidence</dt><dd>" + c.evidence + "</dd></dl></article>";
  }).join("");
  function paintCards(scroll){
    $$(".ah-card", cardsBox).forEach(function(el, i){ var on = i === tl.cur; el.classList.toggle("on", on); if (on) el.setAttribute("aria-current", "true"); else el.removeAttribute("aria-current"); });
    if (scroll && cardsBox.scrollWidth > cardsBox.clientWidth + 2) {
      var el = $$(".ah-card", cardsBox)[tl.cur];
      cardsBox.scrollTo({ left:Math.max(0, el.offsetLeft - 8), behavior:MV.reduceMotion ? "auto" : "smooth" });
    }
  }
  function tgName(id){ var c = CARDS.filter(function(x){ return x.id === id; })[0]; return c ? c.name : id; }
  function paintBoard(){
    var P = tl.place, left = EV.filter(function(e){ return !P[e.id]; }), dis = locked || busy ? " disabled" : "";
    var h = '<h4 class="ah-h4">Evidence board</h4><p class="how">Tap a piece of evidence, then tap the model it ruled out or couldn’t explain (or drag it there). Tap a placed card to take it back.</p>' +
      '<div class="ah-tray" role="group" aria-label="Evidence to place">' + (left.length ? left.map(function(e){
        return '<button type="button" class="ah-ev" data-ev="' + e.id + '" data-k="ev' + e.id + '" aria-pressed="' + (sel === e.id) + '"' + dis + ">" + e.t + "</button>"; }).join("") : '<p class="ah-done">All four placed. Check challenge 3 below.</p>') + "</div>" +
      '<p class="ah-bmsg" aria-live="polite">' + bmsg + '</p><div class="ah-tgts">' + TG.map(function(t){
        var c = CARDS.filter(function(x){ return x.id === t; })[0], inside = EV.filter(function(e){ return P[e.id] === t; });
        return '<div class="ah-tgt" data-tgt="' + t + '"><button type="button" class="ah-tgtb" data-tgt="' + t + '" data-k="tg' + t + '"' + dis + ">" + c.name + " <small>" + c.year + "</small></button>" +
          (inside.length ? inside.map(function(e){ return '<button type="button" class="ah-ev placed" data-ev="' + e.id + '" data-k="pv' + e.id + '" aria-label="' + esc(MV.plain(e.t)) + ", placed on " + c.name + '. Tap to take it back."' + dis + ">" + e.t + "</button>"; }).join("") : '<span class="ah-empty">Drop evidence here</span>') + "</div>";
      }).join("") + "</div>";
    MV.keepFocus(board, function(){ board.innerHTML = h; });
  }
  function place(id, t){
    tl.place[id] = t; sel = null; bmsg = "Placed on " + tgName(t) + ".";
    api.save(); paintBoard(); paintRead(); MV.changed();
  }
  board.addEventListener("click", function(e){
    if (noClick) { noClick = false; return; }
    var b = e.target.closest("button"); if (!b || b.disabled || locked || busy) return;
    if (b.classList.contains("ah-ev")) {
      var id = b.dataset.ev;
      if (b.classList.contains("placed")) { delete tl.place[id]; sel = id; bmsg = "Back in the tray. Tap a model to place it again."; api.save(); }
      else { sel = sel === id ? null : id; bmsg = ""; }
      paintBoard(); paintRead(); MV.changed(); return;
    }
    if (b.dataset.tgt) {
      if (!sel) { bmsg = "Tap a piece of evidence first, then tap a model."; paintBoard(); return; }
      place(sel, b.dataset.tgt);
      var nb = board.querySelector('[data-k="tg' + b.dataset.tgt + '"]'); if (nb) nb.focus({ preventScroll:true });
    }
  });
  // pointer drag (no HTML5 drag-and-drop): drag an evidence card onto a model box
  board.addEventListener("pointerdown", function(e){
    var b = e.target.closest(".ah-ev"); if (!b || b.disabled || locked || busy || e.button > 0) return;
    drag = { id:b.dataset.ev, x:e.clientX, y:e.clientY, on:false, el:b, pid:e.pointerId };
  });
  function overTgt(x, y){ var el = document.elementFromPoint(x, y), t = el && el.closest(".ah-tgt"); return t && board.contains(t) ? t : null; }
  function endDrag(e, drop){
    if (!drag) return; var d = drag; drag = null;
    $$(".ah-tgt.over", board).forEach(function(t){ t.classList.remove("over"); });
    if (!d.on) return;
    if (ghost) { ghost.remove(); ghost = null; }
    noClick = true; setTimeout(function(){ noClick = false; }, 60);
    var t = drop && overTgt(e.clientX, e.clientY);
    if (t) place(d.id, t.dataset.tgt); else { bmsg = "Drop it on a model box."; paintBoard(); }
  }
  document.addEventListener("pointermove", function(e){
    if (!drag || e.pointerId !== drag.pid) return;
    if (!drag.on && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 8) {
      drag.on = true; ghost = document.createElement("div"); ghost.className = "ah-ghost"; ghost.innerHTML = drag.el.innerHTML; document.body.appendChild(ghost);
      try { drag.el.setPointerCapture(e.pointerId); } catch (err) {}
    }
    if (drag.on) {
      e.preventDefault(); ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px";
      var t = overTgt(e.clientX, e.clientY); $$(".ah-tgt", board).forEach(function(x){ x.classList.toggle("over", x === t); });
    }
  });
  document.addEventListener("pointerup", function(e){ if (drag && e.pointerId === drag.pid) endDrag(e, true); });
  document.addEventListener("pointercancel", function(e){ if (drag && e.pointerId === drag.pid) endDrag(e, false); });

  // ----- player bar (N13: Play, Step, Reset in every mode) -----
  var STAGE = ["Beam off. Press Play to switch it on, or Step through it.", "Stage 1 of 3: electrons leave the cathode and pass through the anode.", "Stage 2 of 3: between the plates, the beam bends.", "Stage 3 of 3: the beam hits the screen."];
  function crtStages(){ var pts = beamPts(crtNet(cr)), L = lens(pts); return [0, fracAtX(pts, L, CR.xa + 6), fracAtX(pts, L, CR.x2), 1]; }
  function crtStage(){ var s = crtStages(), f = cr.f; for (var i = s.length - 1; i >= 0; i--) if (f >= s[i] - 1e-6) return i; return 0; }
  function paintBar(){
    var m = S.mode, dis = locked || busy, play, step, stat;
    if (m === "tl") { play = playT ? "Pause" : "Play"; step = "Step"; stat = "Model " + (tl.cur + 1) + " of 5: " + CARDS[tl.cur].name + " (" + CARDS[tl.cur].year + ")"; }
    else if (m === "crt") { play = "Play"; step = "Step"; stat = busy ? "Beam on its way…" : STAGE[crtStage()]; }
    else { play = "Fire " + (gf.fired >= 8000 ? "8000 again" : gf.fired ? "the rest" : "8000 alpha particles"); step = "Step: fire 1000"; stat = busy ? "Firing…" : "Fired: " + num(gf.fired) + " of 8000"; }
    var stepOff = m === "tl" ? tl.cur >= 4 : m === "crt" ? cr.f >= 1 : gf.fired >= 8000;
    MV.keepFocus(bar, function(){
      bar.innerHTML = '<div class="player"><button type="button" class="btn primary sm" data-pl="play" data-k="ahplay"' + (dis && !(m === "tl" && playT) ? " disabled" : "") + ">" + play + "</button>" +
        '<button type="button" class="btn ghost sm" data-pl="step" data-k="ahstep"' + (dis || stepOff ? " disabled" : "") + ">" + step + "</button>" +
        '<button type="button" class="btn ghost sm" data-pl="reset" data-k="ahreset"' + (dis ? " disabled" : "") + '>Reset</button><span class="ctr" aria-live="polite">' + stat + "</span></div>";
    });
  }
  function stopPlay(){ if (playT) { clearInterval(playT); playT = null; } }
  bar.addEventListener("click", function(e){
    var b = e.target.closest("[data-pl]"); if (!b || b.disabled) return;
    var a = b.dataset.pl, m = S.mode; note = "";
    if (m === "tl") {
      if (a === "play") {
        if (playT) { stopPlay(); paintBar(); return; }
        if (tl.cur >= 4) tl.cur = 0;
        playT = setInterval(function(){ if (tl.cur >= 4) { stopPlay(); paint(); return; } tl.cur++; api.save(); RG.pick.set(String(tl.cur)); paint(true); if (tl.cur >= 4) { stopPlay(); paintBar(); } }, 1700);
        RG.pick.set(String(tl.cur)); api.save(); paint(true);
      } else if (a === "step") { stopPlay(); tl.cur = Math.min(4, tl.cur + 1); RG.pick.set(String(tl.cur)); api.save(); paint(true); }
      else { stopPlay(); tl.cur = 0; RG.pick.set("0"); api.save(); paint(true); }
    } else if (m === "crt") {
      if (a === "play") beamTo(1, cr.f >= 1 ? 0 : cr.f, 1800);
      else if (a === "step") { var s = crtStages(), i = crtStage(); beamTo(s[Math.min(3, i + 1)], cr.f, 700); }
      else { cr.pl = 0; cr.mg = 0; cr.dir = "up"; cr.metal = "cu"; cr.f = 0; metalNote = false; ["pl", "mg"].forEach(function(k){ RG[k].set("0"); }); RG.dir.set("up"); RG.mt.set("cu"); api.save(); paint(); }
    } else {
      if (a === "play") { if (gf.fired >= 8000) gf.fired = 0; fire(8000, 520); }
      else if (a === "step") fire(Math.min(8000, gf.fired + 1000), 750);
      else { gf.fired = 0; part = null; hlBack = false; api.save(); paint(); }
    }
  });
  function beamTo(target, from, dur, cb){
    if (tw) { tw(); tw = null; }
    busy = true; lock(true); cr.f = from; flow = 0; paintCap();
    tw = MV.tween({ dur:dur, ease:LIN, step:function(t){ cr.f = lerp(from, target, t); flow = (t * dur / 1400) % 1; drawCRT(); }, done:function(){
      tw = null; cr.f = target; flow = -1; busy = false; api.save(); lock(false); paint(); if (cb) cb();
    } });
  }
  function fire(target, dur, cb){
    if (tw) { tw(); tw = null; }
    busy = true; hlBack = false; lock(true); paintCap();
    function batch(){
      if (gf.fired >= target) { part = null; tw = null; busy = false; api.save(); lock(false); paint(); if (cb) cb(); return; }
      var k = gf.fired / 1000 + 1; part = { k:k, t:0 };
      tw = MV.tween({ dur:dur, ease:LIN, step:function(t){ if (part) { part.t = t; drawGF(); paintRead(); } }, done:function(){ gf.fired = k * 1000; part = null; drawGF(); batch(); } });
    }
    batch();
  }
  function cancelAnim(){ if (tw) { tw(); tw = null; } part = null; flow = -1; if (busy) { busy = false; } stopPlay(); }

  // ----- readouts and caption -----
  function paintRead(){
    var rows = [], m = S.mode;
    if (m === "tl") {
      var c = CARDS[tl.cur], nx = CARDS[tl.cur + 1], placed = EV.filter(function(e){ return tl.place[e.id]; }).length;
      rows.push(["Model", c.name + " (" + c.year + "): " + c.sub.charAt(0).toLowerCase() + c.sub.slice(1)], ["The evidence", c.evidence],
        ["Next model", nx ? nx.name + " (" + nx.year + ")" : "none yet: it’s today’s model"], ["Evidence board", placed + " of 4 placed"]);
    } else if (m === "crt") {
      var d = crtNet(cr), on = cr.f >= 1, main;
      if (!on) main = muted(cr.f > 0 ? "the beam hasn’t reached the screen yet" : "beam off: press Play");
      else if (d > 0) main = "Beam bends toward + plate: negative particles";
      else if (d === 0) main = cr.pl ? "Beam goes straight: the magnet’s push balances the plates’ pull" : "Beam goes straight: no plates or magnet on";
      else main = cr.pl ? "Beam bends away from the + plate: the magnet’s push is stronger" : "Beam bends away from the + plate: the magnet pushes it";
      if (metalNote && on) main = "<strong>Same for every metal.</strong> " + main;
      rows.push(["Model", "Thomson: cathode rays are streams of small negative particles"], ["Electric plates", cr.pl ? cr.pl + " kV: pulls the beam " + cr.pl + " unit" + (cr.pl > 1 ? "s" : "") + " toward the + plate" : "off"],
        ["Magnet", cr.mg ? "strength " + cr.mg + ", pushing " + cr.dir + ": " + cr.mg + " unit" + (cr.mg > 1 ? "s" : "") + (cr.dir === "up" ? " away from" : " toward") + " the + plate" : "off"],
        ["Cathode metal", metalT(cr.metal)], ["Beam at the screen", on ? (d === 0 ? "centre (0)" : Math.abs(d) + " unit" + (Math.abs(d) > 1 ? "s" : "") + (d > 0 ? " toward the + plate" : " away from the + plate")) : muted("—")],
        ["Cathode ray readout", main]);
    } else {
      var cc = shown(), F = firedNow(), match;
      if (F < 8000 || busy) match = muted("fire all 8000 to compare");
      else if (gf.model === "plum") match = "No: no bounce-backs";
      else if (gf.w === "n5") match = "<strong>Yes</strong>";
      else match = "No: " + num(cc[2]) + " bounce-backs, far too many";
      rows.push(["Model", gf.model === "plum" ? "Plum pudding: positive charge spread through the atom" : "Nuclear: a tiny positive nucleus (" + widOf(gf.w).t + " of the atom’s width)"],
        ["Particles fired", num(F)], ["Passed nearly straight (< 10°)", num(cc[0])], ["Deflected 10°–90°", num(cc[1])],
        ["Bounced back (> 90°)", num(cc[2]) + oneIn(F, cc[2])], ["Matches Geiger and Marsden?", match]);
    }
    $(".ah-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var m = S.mode, t = "";
    if (m === "tl") t = "Each model explained the evidence of its day, until new evidence didn’t fit.";
    else if (m === "crt") t = busy ? "The beam travels down the tube…" : cr.f >= 1 ? (crtNet(cr) > 0 ? "The beam curves toward the + plate." : crtNet(cr) === 0 ? "The beam goes straight." : "The beam curves away from the + plate.") : STAGE[crtStage()];
    else if (busy) t = "Firing alpha particles at the foil…";
    else if (!gf.fired) t = "Press <strong>Fire</strong> to send 8000 alpha particles at the foil.";
    else { var c = cum(gkey(), gf.fired / 1000); t = num(gf.fired) + " fired: " + num(c[0]) + " passed nearly straight, " + num(c[1]) + " turned 10°–90°, " + num(c[2]) + " bounced back."; }
    $(".ah-cap", host).innerHTML = t + (note && !busy ? " " + note : "");
  }
  function paint(scroll){
    var m = S.mode;
    $$(".ah-pane", host).forEach(function(p){ p.hidden = p.dataset.pane !== m; });
    $$(".ah-c", host).forEach(function(p){ p.hidden = p.dataset.for !== m; });
    host.classList.toggle("ah-tlmode", m === "tl");
    if (m === "tl") { paintCards(scroll); paintBoard(); }
    else if (m === "crt") drawCRT();
    else drawGF();
    paintRead(); paintCap(); paintBar();
    MV.changed();
  }

  // ----- predictions -----
  var hooks = {
    start:function(p){
      cancelAnim(); note = ""; hlBack = false; metalNote = false;
      if (p.id === "p4") { S.mode = "crt"; cr.pl = 3; cr.mg = 0; cr.dir = "up"; cr.f = 0; RG.pl.set("3"); RG.mg.set("0"); RG.dir.set("up"); }
      else { S.mode = "gf"; gf.model = p.id === "p1" ? "plum" : "nuc"; if (p.id === "p2") gf.w = "n5"; if (p.id === "p3") gf.w = "n4"; gf.fired = 0; RG.md.set(gf.model); RG.wd.set(gf.w); RG.wd.paint(); }
      RG.mode.set(S.mode); api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(n){ note = n || ""; busy = false; lock(false); paint(); MV.wait(150, done); }
      if (p.id === "p4") { beamTo(1, 0, 1800, function(){ lock(true); fin("Negative particles are pulled toward the + plate."); }); return; }
      fire(8000, 480, function(){
        lock(true);
        if (p.id === "p2") hlBack = true;
        fin(p.id === "p1" ? "All 8000 land in the < 10° bin." : p.id === "p2" ? "One path curls straight back: 1 in 8000." : "The > 90° bin rises to 100, up from 1 with the " + TINY + " nucleus.");
      });
    }
  };
  // ----- challenges -----
  function chal(id){
    if (id === "tc1") {
      if (gf.model === "plum") return { ok:false, msg:"No bounce-backs at all." };
      if (gf.w === "n4") return { ok:false, msg:"100 bounce-backs: far too many. Make the nucleus smaller." };
      if (gf.w === "n3") return { ok:false, msg:"2000 bounce-backs: far too many. Make the nucleus smaller." };
      if (gf.fired < 8000 || busy) return { ok:false, msg:"Right model and nucleus. Now fire all 8000 alpha particles." };
      return { ok:true };
    }
    if (id === "tc2") {
      if (!cr.pl) return { ok:false, msg:"Switch the plates on first: the beam has to go straight while they’re on." };
      if (!cr.mg) return { ok:false, msg:"The plates bend the beam toward the + plate. Use the magnet to push it back." };
      if (cr.dir === "down") return { ok:false, msg:"That bends the beam the same way as the plates." };
      if (cr.mg !== cr.pl) return { ok:false, msg:"Close: balance the two pushes exactly." };
      return { ok:true };
    }
    if (id === "tc3") {
      var P = tl.place;
      if (EV.some(function(e){ return !P[e.id]; })) return { ok:false, msg:"Place all four pieces of evidence on the Evidence board first (Timeline mode)." };
      if (P.e3 === "thomson") return { ok:false, msg:"Line spectra troubled Rutherford’s model too; it said nothing about electron energies." };
      if (P.e2 === "dalton") return { ok:false, msg:"Dalton’s solid ball was already gone when the gold foil was run." };
      var right = EV.filter(function(e){ return P[e.id] === MV.ans(e); }).length;
      if (right === 4) return { ok:true };
      return { ok:false, msg:right + " of 4 are on the right model. Each piece of evidence led to the next model." };
    }
    return { ok:false };
  }
  paint(true);
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Read Rutherford's data ----------
var RINK = { w:60, h:26, cr:8.5, circle:4.5, dot:0.3, blue:7.6, view:132 };   // view: metres across the picture at ×1
function zText(v){ var z = Math.pow(10, v); return "×" + (z < 10 ? num(Math.round(z * 10) / 10) : num(Number(z.toPrecision(2)))); }
function lenT(m){ return m >= 1 ? num(Number(m.toPrecision(2))) + " m" : m >= 0.01 ? num(Number((m * 100).toPrecision(2))) + " cm" : num(Number((m * 1000).toPrecision(2))) + " mm"; }
function rinkSVG(v){
  var k = 600 / RINK.view * Math.pow(10, v), cx = 300, cy = 150, h = "", W = RINK.w * k, H = RINK.h * k;
  h += '<rect x="0" y="0" width="600" height="300" fill="var(--paper)"/>';
  if (W < 200000) {
    h += '<rect x="' + r1(cx - W / 2) + '" y="' + r1(cy - H / 2) + '" width="' + r1(W) + '" height="' + r1(H) + '" rx="' + r1(RINK.cr * k) + '" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2.5"/>';
    h += ln(cx, cy - H / 2, cx, cy + H / 2, { c:"var(--ink-2)", w:Math.max(1.5, Math.min(8, 0.3 * k)), op:0.7 });
    [-1, 1].forEach(function(s){ h += ln(cx + s * RINK.blue * k, cy - H / 2, cx + s * RINK.blue * k, cy + H / 2, { c:"var(--pen)", w:Math.max(2, Math.min(10, 0.3 * k)), op:0.75 }); });
    h += circ(cx, cy, RINK.circle * k, "none", { s:"var(--pen)", sw:Math.max(1.5, Math.min(8, 0.05 * k)), op:0.75 });
    h += circ(cx, cy, RINK.dot * k, "var(--pen)", { op:0.55 });
  }
  var g = 0.0003 * k;     // grain of sand: 0.6 mm wide
  if (g >= 0.6) {
    var pts = [];
    for (var i = 0; i < 14; i++) { var a = i / 14 * 2 * Math.PI, rr = g * (0.88 + 0.12 * Math.sin(i * 2.7 + 1)); pts.push(r1(cx + rr * Math.cos(a)) + "," + r1(cy + rr * Math.sin(a) * 0.92)); }
    h += '<polygon points="' + pts.join(" ") + '" fill="var(--at-m)" stroke="var(--ink)" stroke-width="' + (g > 20 ? 2 : 0.6) + '"/>';
    if (g > 14) h += tx(cx, cy + 1, "+", { fs:Math.min(90, g * 0.9), w:700, c:"var(--sheet)" });
  }
  // scale bar
  var vw = RINK.view / Math.pow(10, v), raw = vw / 4, mag = Math.pow(10, Math.floor(Math.log10(raw))), nice = [1, 2, 5, 10].map(function(m){ return m * mag; }).filter(function(m){ return m <= raw * 1.6; }).pop() || mag, bl = nice * k;
  h += rect(18, 262, bl + 16, 30, "var(--sheet)", { rx:6, op:0.9 }) + ln(26, 280, 26 + bl, 280, { c:"var(--ink)", w:3 }) + ln(26, 274, 26, 286, { c:"var(--ink)", w:2 }) + ln(26 + bl, 274, 26 + bl, 286, { c:"var(--ink)", w:2 });
  h += tx(26 + bl / 2, 269, lenT(nice), { fs:12, w:700 });
  return h;
}
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2;
  S.inf = S.inf && typeof S.inf === "object" ? S.inf : {}; S.inf.sel = S.inf.sel || {};
  S.z = typeof S.z === "number" ? clamp(S.z, 0, 5) : 0;
  var head = ["Angle"].concat(s1.angles.map(function(a){ return a + "°"; })), row = ["Counts per hour"].concat(s1.counts.map(function(c){ return num(c); }));
  host.innerHTML = '<div class="part ah-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><details class="alg" open><summary>The data: counts per hour at each angle</summary>' +
    MV.tableHTML({ head:head, rows:[row], caption:"Model counts per hour at each angle" }) +
    '<canvas class="plot wide ah-logc" role="img" aria-label=""></canvas><p class="tiny muted">Model data, shaped like the real results. The graph uses a log scale: each step up means 10 times more counts.</p></details>' +
    '<p class="ah-ask">' + s1.ask + '</p><div class="ah-inf" role="group" aria-label="Inferences"></div><div class="q-actions"><button type="button" class="btn primary sm" data-inf="check" data-k="infchk">Check</button></div><div class="ah-inffb"></div></div>' +
    '<div class="part ah-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="ah-box ah-rinkbox"><svg class="ah-svg ah-rink" viewBox="0 0 600 300" role="img" aria-label=""></svg></div><div class="ah-zsl"></div><dl class="read ah-zread" aria-live="polite"></dl></div>';
  // station 1: log graph of the counts
  var lp = new MV.Plot($(".ah-logc", host), { xmin:-34, xmax:180, ymin:-0.5, ymax:6.4 });
  lp.render = function(){
    var pts = s1.angles.map(function(a, i){ return [a, Math.log10(s1.counts[i])]; }), W = lp.c.getBoundingClientRect().width || 600;
    lp.draw({ view:{ xmin:-70 * 180 / Math.max(140, W - 70), xmax:180, ymin:-0.5, ymax:6.4 }, xTicks:{ step:30, fmt:function(v){ return v < 0 ? "" : v + "°"; } }, yTicks:{ step:1, fmt:function(t){ return num(Math.pow(10, t)); } },
      xLabel:"angle", yLabel:"counts per hour (log scale)",
      curves:[{ pts:pts, color:MV.css("--pen"), width:2.4 }], data:pts.map(function(p){ return { x:p[0], y:p[1], color:MV.css("--pen") }; }),
      describe:"Counts per hour against deflection angle on a log scale: 550 000 at 5°, 7000 at 15°, 450 at 30°, 32 at 60°, 4 at 120° and 2 at 150°. The counts fall steeply, but never reach zero." });
  };
  lp.render();
  var infBox = $(".ah-inf", host), infFb = $(".ah-inffb", host);
  function paintInf(){
    MV.keepFocus(infBox, function(){ infBox.innerHTML = s1.chips.map(function(c){ var on = !!S.inf.sel[c.id]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ic="' + c.id + '" data-k="ic' + c.id + '">' + c.t + "</button>"; }).join(""); });
    var r = S.inf.res;
    infFb.innerHTML = !r ? "" : r.ok ? MV.fbHTML("good", "<strong>✓ Both inferences fit the data.</strong> " + r.msg) : MV.fbHTML(r.k || "bad", r.msg);
  }
  infBox.addEventListener("click", function(e){ var b = e.target.closest("[data-ic]"); if (!b) return; S.inf.sel[b.dataset.ic] = !S.inf.sel[b.dataset.ic]; S.inf.res = null; api.save(); paintInf(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-inf]"); if (!b) return;
    var picked = s1.chips.filter(function(c){ return S.inf.sel[c.id]; }), bad = picked.filter(function(c){ return !MV.ok(c); }), good = picked.filter(function(c){ return MV.ok(c); }), all = s1.chips.filter(function(c){ return MV.ok(c); });
    if (!picked.length) S.inf.res = { ok:false, k:"", msg:"Tap at least one inference first." };
    else if (bad.length) S.inf.res = { ok:false, msg:"<strong>✗ Not quite.</strong> “" + bad[0].t + "”: " + bad[0].why };
    else if (good.length < all.length) S.inf.res = { ok:false, msg:"<strong>✗ Not quite.</strong> That one fits. Another inference fits the data too." };
    else S.inf.res = { ok:true, msg:all.map(function(c){ return c.why; }).join(" ") };
    api.save(); paintInf(); MV.focusFb(infFb.parentNode);
  });
  paintInf();
  // station 2: rink zoom
  var rk = $(".ah-rink", host);
  function paintZoom(){
    var v = S.z, vw = RINK.view / Math.pow(10, v), g = 0.0006 * 600 / RINK.view * Math.pow(10, v);
    rk.innerHTML = rinkSVG(v);
    rk.setAttribute("aria-label", v < 0.05 ? "A 60 m hockey rink from above. The nucleus would be a grain of sand at centre ice, too small to see." : "Zoomed in " + MV.plain(zText(v)) + " on centre ice. The view is " + MV.plain(lenT(vw)) + " across. " + (g >= 1.2 ? "The grain of sand, 0.6 mm wide, is now visible." : "The grain of sand is still too small to see."));
    var rows = [["Zoom", zText(v)], ["View across", lenT(vw)], ["Hockey rink (the atom)", "60 m wide" + (v <= 0.34 ? ": the whole rink is in view" : ": past the edges of the view")], ["Grain of sand (the nucleus)", "0.6 mm wide" + (g < 1.2 ? ": too small to see yet" : v >= 4.95 ? ": as wide on screen as the whole rink was at ×1" : ": now visible")]];
    if (v >= 4.95) rows.push(["Result", "<strong>" + s2.result + "</strong>"]);
    $(".ah-zread", host).innerHTML = MV.readoutHTML(rows);
  }
  MV.sliders($(".ah-zsl", host), [{ id:"ahz", label:"Zoom in on centre ice", min:0, max:5, step:0.1, value:S.z, fmt:zText, note:"×1 shows the whole rink; ×100" + N + "000 shows the nucleus." }], function(id, v){ S.z = v; api.save(); paintZoom(); });
  paintZoom();
}

// ---------- Practice 2: Reasoning from evidence (ratio + number entry + chips; from SCH4U 07's reasonAct) ----------
function reasonAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", va:"", vb:"", pick:null, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "ratio") h += '<div class="numrow ah-numrow"><span id="rl-' + it.id + '">Ratio:</span><input class="numin ah-rin" data-rin="' + it.id + '" data-part="va" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-labelledby="rl-' + it.id + '" aria-label="first number" value="' + esc(x.va) + '"' + dis + '><span class="ah-colon" aria-hidden="true">:</span><input class="numin ah-rin" data-rin="' + it.id + '" data-part="vb" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="second number" value="' + esc(x.vb) + '"' + dis + "></div>";
    else if (it.kind === "num") h += '<div class="numrow ah-numrow"><label for="ri-' + it.id + '">Your answer:</label><input class="numin" id="ri-' + it.id + '" data-rin="' + it.id + '" data-part="val" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span class="ah-unit">' + it.unit + "</span></div>";
    else h += '<div class="chips ah-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + (it.kind === "chips" ? it.options[x.pick].why || "" : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function one(s){ var v = MV.parseNum(String(s || "").replace(/about|per\s*8\s*000|bounce-?backs?|times/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, w){ return Math.abs(v - w) <= Math.abs(w) * 0.01 + 1e-9; }
  function judge(it, x){
    if (it.kind === "ratio") {
      var p = one(x.va), q = one(x.vb), ans = MV.ans(it);
      if (p == null || q == null || p <= 0 || q <= 0) return { bad:"Enter a number in each box." };
      if (near(p, ans[0]) && near(q, ans[1])) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return near(p, z.match[0]) && near(q, z.match[1]); })[0];
      if (w) return { fb:w.fb };
      if (Math.abs(p / q - ans[0] / ans[1]) < 1e-6) return { fb:it.simplify };
      return { fb:it.fb };
    }
    if (it.kind === "num") {
      var v = one(x.val);
      if (v == null) return { bad:"Enter one number." };
      if (near(v, MV.ans(it))) return { ok:true };
      var w2 = (it.wrong || []).filter(function(z){ return near(v, z.match); })[0];
      return { fb:w2 ? w2.fb : it.fb };
    }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.rin) return; ist(d.rin)[d.part] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.rin) { var b = host.querySelector('[data-k="' + e.target.dataset.rin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ri]"); if (!bx) return;
    var it = item(bx.dataset.ri), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: A model that fits ----------
var task = (function(){
  var S = null, api = null, T = null, tw = null, shownC = [0, 0, 0], rA = null, rB = null;
  function read(){ return { a:S && S.a || "", b:S && S.b || "" }; }
  function counts(a){ return a === "spread" ? GF.plum : a === "tenth" ? GF_TENTH : a === "tiny" ? GF.n5 : null; }
  var SHORT = { spread:"spread-out charge", tenth:"1/10 centre", tiny:TINY + " centre", inside:"electrons scattered inside", moving:"electrons moving around it", orbits:"electrons in fixed orbits", cloud:"electrons in a probability cloud" };
  function optT(list, id){ var o = list.filter(function(x){ return x.id === id; })[0]; return o ? o.t : ""; }
  function picSVG(d){
    var cx = 92, cy = 104, r = 80, h = "", R = rng(11), i;
    if (!d.a) return circ(cx, cy, r, "none", { s:"var(--rule)", sw:1.5, d:"4 4" }) + tx(cx, cy, "choose A", { fs:13, c:"var(--ink-2)" });
    var cr = d.a === "spread" ? r : d.a === "tenth" ? r * 0.1 : 2.4;
    h += circ(cx, cy, r, "none", { s:"var(--ink-2)", sw:1.1, d:"3 3", op:0.7 });
    h += circ(cx, cy, cr, "var(--at-m)", { op:d.a === "spread" ? 0.2 : 1 });
    if (d.a === "spread") [[-0.3, -0.35], [0.32, 0.1], [-0.18, 0.42], [0.25, -0.5]].forEach(function(p){ h += tx(cx + p[0] * r, cy + p[1] * r, "+", { fs:15, w:700, c:"var(--at-m)" }); });
    else h += cr >= 7 ? tx(cx, cy + 0.5, "+", { fs:12, w:700, c:"var(--sheet)" }) : tx(cx + 9, cy - 9, "+", { fs:13, w:700, c:"var(--at-m)" });
    var E = [];
    if (d.b === "inside") { var lim = d.a === "spread" ? r * 0.8 : Math.max(cr * 0.8, 3); for (i = 0; i < 8; i++) { var a = R() * 2 * Math.PI, rr = Math.sqrt(R()) * lim; E.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); } }
    else if (d.b === "moving") { for (i = 0; i < 6; i++) { var a2 = i / 6 * 2 * Math.PI + 0.4, rr2 = r * (0.45 + 0.35 * R()); E.push([cx + rr2 * Math.cos(a2), cy + rr2 * Math.sin(a2)]); h += ln(cx + rr2 * Math.cos(a2), cy + rr2 * Math.sin(a2), cx + rr2 * Math.cos(a2) + 9 * Math.cos(a2 + 1.9), cy + rr2 * Math.sin(a2) + 9 * Math.sin(a2 + 1.9), { c:"var(--e-pair)", w:1.4, op:0.7 }); } }
    else if (d.b === "orbits") { [0.4, 0.72].forEach(function(f){ h += circ(cx, cy, r * f, "none", { s:"var(--ink-2)", sw:1.2, op:0.7 }); }); [[0.4, -50], [0.4, 130], [0.72, 10], [0.72, 100], [0.72, 200], [0.72, 290]].forEach(function(e){ E.push([cx + r * e[0] * Math.cos(e[1] * DEG), cy + r * e[0] * Math.sin(e[1] * DEG)]); }); }
    else if (d.b === "cloud") { for (i = 0; i < 120; i++) { var u = Math.max(1e-6, R()), g = Math.min(0.97, Math.abs(Math.sqrt(-2 * Math.log(u)) * 0.36)) * r, a3 = R() * 2 * Math.PI; h += circ(cx + g * Math.cos(a3), cy + g * Math.sin(a3), 1.3, "var(--e-pair)", { op:0.5 }); } }
    E.forEach(function(p){ h += circ(p[0], p[1], 3.2, "var(--e-pair)"); });
    return h;
  }
  function histSVG(c){
    var h = "", L = 200, B = 172, top = 40, ph = B - top, bw = 50;
    h += tx(L - 8, 18, "8000 alpha particles", { a:"start", fs:12.5, w:700 });
    h += ln(L - 6, B + 0.5, L + 3 * bw + 4, B + 0.5, { c:"var(--plot-axis)", w:1.5 });
    c.forEach(function(v, i){
      var x = L + bw * (i + 0.5), hh = v > 0 ? Math.max(2.5, v / 8000 * ph) : 0;
      h += rect(x - 15, B - hh, 30, hh, "var(--pen)") + tx(x, B - hh - 9, num(Math.round(v)), { fs:12.5, w:700 }) + tx(x, B + 14, BINS[i], { fs:11.5, c:"var(--ink-2)" });
    });
    return h;
  }
  function paint(){
    var d = read(), sv = $("#ah-tksvg"); if (!sv) return;
    sv.innerHTML = picSVG(d) + histSVG(shownC);
    var c = counts(d.a);
    sv.setAttribute("aria-label", "Your model: " + (d.a ? MV.plain(optT(T.optsA, d.a)) : "positive charge not chosen") + "; electrons " + (d.b ? MV.plain(optT(T.optsB, d.b)).toLowerCase() : "not placed") + ". " + (c ? "Gold-foil preview: " + c[0] + " pass nearly straight, " + c[1] + " turn 10° to 90°, " + c[2] + " bounce back." : ""));
    $("#ah-tkcap").innerHTML = c ? "8000 fired: <strong>" + num(c[0]) + "</strong> passed nearly straight, <strong>" + num(c[1]) + "</strong> turned 10°–90°, <strong>" + num(c[2]) + "</strong> bounced back." + (d.a === "tenth" ? ' <span class="muted">(model values)</span>' : "") : "Choose where the positive charge is, and the preview fires 8000 alpha particles.";
  }
  function fire(){
    if (tw) { tw(); tw = null; }
    var c = counts(read().a), from = shownC.slice();
    if (!c) { shownC = [0, 0, 0]; paint(); return; }
    tw = MV.tween({ dur:900, step:function(t){ shownC = from.map(function(v, i){ return lerp(v, c[i], t); }); paint(); }, done:function(){ tw = null; shownC = c.slice(); paint(); } });
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      if (!T.optsA.some(function(o){ return o.id === S.a; })) S.a = ""; if (!T.optsB.some(function(o){ return o.id === S.b; })) S.b = "";
      inp.innerHTML = '<div class="ah-tq"><p class="ah-lab">' + T.qA + '</p><div class="ah-ta"></div></div><div class="ah-tq"><p class="ah-lab">' + T.qB + '</p><div class="ah-tb"></div></div>';
      rA = radios($(".ah-ta", inp), { aria:MV.plain(T.qA), cls:"chips ah-tlist", options:T.optsA, value:S.a, onChange:function(v){ S.a = v; api.save(); fire(); api.update(); } });
      rB = radios($(".ah-tb", inp), { aria:MV.plain(T.qB), cls:"chips ah-tlist", options:T.optsB, value:S.b, onChange:function(v){ S.b = v; api.save(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="ah-h4">Live gold-foil preview</h4><div class="ah-box"><svg class="ah-svg" id="ah-tksvg" viewBox="0 0 360 200" role="img" aria-label=""></svg></div><p class="ah-tcap" id="ah-tkcap" aria-live="polite"></p>';
      var c0 = counts(S.a); shownC = c0 ? c0.slice() : [0, 0, 0];
      paint();
    },
    read:read,
    valid:function(d){ return d.a && d.b ? true : "Choose an answer for A and for B first."; },
    checks:function(d){ return [d.a === "spread" || d.a === "tiny", d.a === "tenth" || d.a === "tiny", !!d.a && !!d.b && (d.a === "spread" ? d.b === "inside" : d.b !== "inside")]; },
    tips:function(d, res){
      var out = [];
      if (!res[0]) out.push(T.tips[0]);
      if (!res[1]) out.push(T.tips[1]);
      if (!res[2]) out.push(d.a === "spread" ? T.tipSpread : T.tips[2]);
      return out;
    },
    key:function(d){ return d.a + "|" + d.b; },
    label:function(k){ var p = k.split("|"); return (SHORT[p[0]] || p[0]) + ", " + (SHORT[p[1]] || p[1]); },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ reason:reasonAct },
  task:task
});
})();
