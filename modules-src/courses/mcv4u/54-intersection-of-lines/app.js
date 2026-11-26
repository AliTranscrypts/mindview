// MCV4U 54 Intersection of Lines in R² and R³: hero (V1 3D view: the "fake cross" lines seen from above, then tilted to
// show the gap of 1), Two lines in space (Explore: V1 view with its own s and t sliders, line inputs, gallery, exact
// readouts and a "crossing in this view only" marker), Skew or crossing? (Part 3: a tap-through flowchart on five pairs,
// each confirmed in a V1 view), Find it (Practice 2: point and number boxes plus chips) and the "Skew partner" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function fx(v, dp){ var s = (Math.abs(v) < 0.5 * Math.pow(10, -dp) ? 0 : v).toFixed(dp); return s.replace("-", MINUS); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function copyL(L){ return { r1:L.r1.slice(), m1:L.m1.slice(), r2:L.r2.slice(), m2:L.m2.slice() }; }
function eqv(a, b){ return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; }
function segBtns(name, opts, val, label, dis){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '"' + (dis ? " disabled" : "") + ">" + MV.md(o.t) + "</button>"; }).join("") + "</span>";
}

// =====================================================================================================================
// ---------- exact line algebra: integer points and directions in, rationals (MV.mcv.Q) out ----------
var AX = ["x", "y", "z"], PAIRS = [[0, 1], [0, 2], [1, 2]];
function vsub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function isZero(v){ return !v[0] && !v[1] && !v[2]; }
function qi(n){ return Q.of(n, 1); }
function qAt(r, mv, q){ return [0, 1, 2].map(function(c){ return Q.add(qi(r[c]), Q.mul(qi(mv[c]), q)); }); }
function nAt(r, mv, v){ return [r[0] + v * mv[0], r[1] + v * mv[1], r[2] + v * mv[2]]; }
// classify r1 + s m1 and r2 + t m2 -> {kind: meet|parallel|same|skew, par, k (m2 = k m1), on, s0, s, t, pair, third, v1, v2, pt}
function classify(L){
  var d = vsub(L.r2, L.r1), o = { par:isZero(cross(L.m1, L.m2)), d:d };
  if (o.par) {
    var i = L.m1[0] ? 0 : L.m1[1] ? 1 : 2;
    o.k = Q.of(L.m2[i], L.m1[i]);
    o.on = isZero(cross(d, L.m1));
    if (o.on) o.s0 = Q.of(d[i], L.m1[i]);
    o.kind = o.on ? "same" : "parallel";
    return o;
  }
  for (var p = 0; p < 3; p++) {
    var a = PAIRS[p][0], b = PAIRS[p][1], det = L.m2[a] * L.m1[b] - L.m1[a] * L.m2[b];
    if (!det) continue;
    o.pair = PAIRS[p]; o.third = 3 - a - b;
    o.s = Q.of(L.m2[a] * d[b] - d[a] * L.m2[b], det);
    o.t = Q.of(L.m1[a] * d[b] - d[a] * L.m1[b], det);
    break;
  }
  var k = o.third;
  o.v1 = Q.add(qi(L.r1[k]), Q.mul(qi(L.m1[k]), o.s));
  o.v2 = Q.add(qi(L.r2[k]), Q.mul(qi(L.m2[k]), o.t));
  o.kind = Q.eq(o.v1, o.v2) ? "meet" : "skew";
  if (o.kind === "meet") o.pt = qAt(L.r1, L.m1, o.s);
  return o;
}
// text pieces in m() source
function nS(n){ return String(n); }
function vecS(v, dim){ return "(" + v.slice(0, dim).map(nS).join(", ") + ")"; }
function qS(q){ return (q.n < 0 ? "-" : "") + Math.abs(q.n) + (q.d > 1 ? "/" + q.d : ""); }
function qVecS(v, dim){ return "(" + v.slice(0, dim).map(qS).join(", ") + ")"; }
function lineS(r, mv, p, dim){ return "vec{r} = " + (isZero(r) ? "" : vecS(r, dim) + " + ") + p + vecS(mv, dim); }
function lin(a, b, v){
  if (!b) return nS(a);
  var bv = (Math.abs(b) === 1 ? "" : Math.abs(b)) + v;
  if (!a) return (b < 0 ? "-" : "") + bv;
  return a + (b < 0 ? " - " : " + ") + bv;
}
function kS(q){ return q.d === 1 ? (q.n === 1 ? "" : q.n === -1 ? "-" : String(q.n)) : "(" + qS(q) + ")"; }
// exact length of a vector with rational components: a√r/d (m() source) and a decimal
function lenS(v){
  var s2 = v.reduce(function(acc, q){ return Q.add(acc, Q.mul(q, q)); }, qi(0));
  if (!s2.n) return { src:"0", val:0, exact:true };
  var N = s2.n * s2.d, D = s2.d, a = 1, r = N;
  for (var f = 2; f * f <= r; f++) while (r % (f * f) === 0) { r /= f * f; a *= f; }
  var g = gcd(a, D); a /= g; D /= g;
  var core = r === 1 ? String(a) : (a === 1 ? "" : a) + "√" + r;
  return { src:D > 1 ? core + "/" + D : core, val:Math.sqrt(s2.n / s2.d), exact:r === 1 };
}
// --------------------------------------------------- end of exact line algebra ---------------------------------------

// =====================================================================================================================
// @component V1 view3d — orthographic 3D view in SVG (course plan V1). Right-handed axes (z up); drag or arrow keys rotate
// it (Shift: bigger steps); presets iso / front (xz) / side (yz) / top (xy) via animTo (MV.tween, so reduced motion jumps).
// Draws a faint floor grid (z = 0), axes, lines clipped to the ±B box and split into pieces that fade with depth, dashed
// segments, ring / solid / star / hollow point markers and labels. Colours are CSS tokens (var(--pen) …), so dark mode
// needs no redraw. scene = {flat, lines:[{r, m, color, width, dash}], segs:[{a, b, color, dash, width, label}],
// pts:[{p, color, r, ring, star, hollow, label, dx, dy}], axis:{z:true} (emphasise the z-axis), describe:"…"}.
// flat:true locks the camera to Top and labels the x- and y-axes (the R² grid, V3 style).
var D2R = Math.PI / 180;
var CAMS = { iso:{ az:40, el:24 }, front:{ az:-90, el:0 }, side:{ az:0, el:0 }, top:{ az:-90, el:90 } };
var VNAME = { iso:"isometric", front:"front (xz)", side:"side (yz)", top:"looking from above (xy)" };
function normAz(a){ a = ((a + 180) % 360 + 360) % 360 - 180; return a === -180 ? 180 : a; }
function View3D(host, o){
  o = o || {};
  var B = o.B || 7, W = 400, H = o.H || 340, K = o.k || (H / 2 - 6) / (B * 1.3);
  host.innerHTML = '<div class="il-3d" tabindex="0" role="group" aria-label="' + MV.esc(o.label || "3D view. Drag it, or use the arrow keys, to rotate it.") + '"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="3D view"></svg></div>';
  var wrap = host.firstChild, svg = wrap.firstChild, V = { az:CAMS.iso.az, el:CAMS.iso.el, locked:false, scene:null, wrap:wrap, svg:svg }, stopA = null, drag = null;
  function bas(){
    var a = V.az * D2R, e = V.el * D2R, ca = Math.cos(a), sa = Math.sin(a), ce = Math.cos(e), se = Math.sin(e);
    return { R:[-sa, ca, 0], U:[-se * ca, -se * sa, ce], F:[ce * ca, ce * sa, se] };
  }
  function dot(p, q){ return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; }
  function pr(p, b){ return [W / 2 + K * dot(p, b.R), H / 2 - K * dot(p, b.U), dot(p, b.F)]; }
  function f1(v){ return (Math.round(v * 10) / 10).toFixed(1); }
  function lineEl(a, b, st, w, dash, op){ return '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '" style="stroke:' + st + ";stroke-width:" + w + (dash ? ";stroke-dasharray:" + dash : "") + (op != null && op < 1 ? ";stroke-opacity:" + op.toFixed(2) : "") + '" stroke-linecap="round"/>'; }
  function textEl(x, y, t, col, cls, anchor){ return '<text x="' + f1(x) + '" y="' + f1(y) + '" class="il-t' + (cls ? " " + cls : "") + '" text-anchor="' + (anchor || "start") + '" style="fill:' + (col || "var(--ink)") + '">' + t + "</text>"; }
  function clip(r, mv){
    var t0 = -1e9, t1 = 1e9;
    for (var c = 0; c < 3; c++) {
      if (!mv[c]) { if (Math.abs(r[c]) > B + 1e-9) return null; continue; }
      var a = (-B - r[c]) / mv[c], b = (B - r[c]) / mv[c];
      t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
    }
    return t1 > t0 ? [t0, t1] : null;
  }
  function star(x, y, R){
    var s = "";
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.45 : R; s += (i ? "L" : "M") + f1(x + rr * Math.cos(a)) + " " + f1(y + rr * Math.sin(a)); }
    return '<path d="' + s + 'Z" style="fill:var(--hi);stroke:var(--ink);stroke-width:1.6"/>';
  }
  V.viewName = function(){
    for (var k in CAMS) if (Math.abs(normAz(V.az - CAMS[k].az)) < 1.5 && Math.abs(V.el - CAMS[k].el) < 1.5) return k;
    if (V.el > 88.5) return "top";
    return null;
  };
  V.draw = function(sc){
    if (sc) V.scene = sc; sc = V.scene; if (!sc) return;
    var b = bas(), out = "", Dm = B * 1.75, flat = !!sc.flat, i, g, c;
    // floor grid
    var gs = flat ? "var(--plot-grid)" : "var(--plot-grid)", gw = flat ? 1 : 0.9;
    for (g = -B; g <= B; g++) {
      if (!g) continue;
      out += lineEl(pr([g, -B, 0], b), pr([g, B, 0], b), gs, gw, null, flat ? 1 : 0.8);
      out += lineEl(pr([-B, g, 0], b), pr([B, g, 0], b), gs, gw, null, flat ? 1 : 0.8);
    }
    // axes
    for (c = 0; c < (flat ? 2 : 3); c++) {
      var e0 = [0, 0, 0], e1 = [0, 0, 0], emph = sc.axis && sc.axis[AX[c]]; e0[c] = -B; e1[c] = B;
      out += lineEl(pr(e0, b), pr(e1, b), emph ? "var(--ink)" : "var(--plot-axis)", emph ? 2.6 : 1.5);
      var lp = [0, 0, 0]; lp[c] = B + 0.55; var q = pr(lp, b);
      out += textEl(q[0], q[1] + 5, AX[c], emph ? "var(--ink)" : "var(--ink-2)", "il-ax", "middle");
      if (flat) for (g = -B + (B % 2); g <= B; g += 2) {
        if (!g) continue;
        var tp = [0, 0, 0]; tp[c] = g; var tq = pr(tp, b);
        out += c === 0 ? textEl(tq[0], tq[1] + 16, nS(g).replace("-", MINUS), "var(--ink-2)", "il-tk", "middle") : textEl(tq[0] - 7, tq[1] + 4, nS(g).replace("-", MINUS), "var(--ink-2)", "il-tk", "end");
      }
    }
    // lines, split into pieces that fade with depth
    (sc.lines || []).forEach(function(L){
      var tt = clip(L.r, L.m); if (!tt) return;
      var N = flat ? 1 : 18;
      for (var j = 0; j < N; j++) {
        var ta = tt[0] + (tt[1] - tt[0]) * j / N, tb = tt[0] + (tt[1] - tt[0]) * (j + 1) / N;
        var A = pr(nAt(L.r, L.m, ta), b), Bp = pr(nAt(L.r, L.m, tb), b), op = flat ? 1 : 0.38 + 0.62 * clamp(((A[2] + Bp[2]) / 2 + Dm) / (2 * Dm), 0, 1);
        out += lineEl(A, Bp, L.color, L.width || 3, L.dash, op);
      }
    });
    (sc.segs || []).forEach(function(s){
      var A = pr(s.a, b), Bp = pr(s.b, b);
      out += lineEl(A, Bp, s.color || "var(--ink-2)", s.width || 2.2, s.dash || "6 5");
      if (s.label) out += textEl((A[0] + Bp[0]) / 2 + 9, (A[1] + Bp[1]) / 2 + 4, s.label, s.color || "var(--ink)", "il-lb");
    });
    (sc.pts || []).forEach(function(p){
      var P = pr(p.p, b), r = p.r || 6, col = p.color || "var(--ink)";
      if (p.star) out += star(P[0], P[1], 12);
      else if (p.hollow) out += '<circle cx="' + f1(P[0]) + '" cy="' + f1(P[1]) + '" r="10" style="fill:none;stroke:' + col + ';stroke-width:2;stroke-dasharray:3 3"/>';
      else if (p.ring) out += '<circle cx="' + f1(P[0]) + '" cy="' + f1(P[1]) + '" r="' + r + '" style="fill:var(--sheet);stroke:' + col + ';stroke-width:3"/>';
      else out += '<circle cx="' + f1(P[0]) + '" cy="' + f1(P[1]) + '" r="' + r + '" style="fill:' + col + '"/>';
      if (p.label) out += textEl(P[0] + (p.dx == null ? 11 : p.dx), P[1] + (p.dy == null ? -10 : p.dy), p.label, p.lcolor || col, "il-lb", p.anchor);
    });
    svg.innerHTML = out;
    var vn = V.viewName();
    svg.setAttribute("aria-label", (flat ? "Flat grid (R²), seen from above. " : "3D view, " + (vn ? VNAME[vn] : "rotated") + ". ") + (sc.describe || ""));
  };
  V.set = function(az, el){ V.az = normAz(az); V.el = clamp(el, -10, 90); V.draw(); };
  V.stop = function(){ if (stopA) { stopA(); stopA = null; } };
  V.animTo = function(name, dur, cb){
    V.stop();
    var to = CAMS[name], a0 = V.az, e0 = V.el, da = normAz(to.az - a0), de = to.el - e0;
    if (Math.abs(da) < 0.01 && Math.abs(de) < 0.01) { V.set(to.az, to.el); if (cb) cb(); return; }
    stopA = MV.tween({ dur:dur || 900, step:function(t){ V.set(a0 + da * t, e0 + de * t); if (o.onRotate) o.onRotate(true); },
      done:function(){ stopA = null; V.set(to.az, to.el); if (o.onRotate) o.onRotate(); if (cb) cb(); } });
  };
  V.jump = function(name){ V.stop(); V.set(CAMS[name].az, CAMS[name].el); };
  svg.addEventListener("pointerdown", function(e){
    if (V.locked) return;
    V.stop(); drag = { x:e.clientX, y:e.clientY, az:V.az, el:V.el };
    try { svg.setPointerCapture(e.pointerId); } catch (err) {}
  });
  svg.addEventListener("pointermove", function(e){
    if (!drag) return;
    var r = svg.getBoundingClientRect(), f = W / Math.max(1, r.width);
    V.set(drag.az - (e.clientX - drag.x) * f * 0.5, drag.el + (e.clientY - drag.y) * f * 0.5);
    if (o.onRotate) o.onRotate(true);
  });
  function endDrag(){ if (!drag) return; drag = null; if (o.onRotate) o.onRotate(); }
  svg.addEventListener("pointerup", endDrag); svg.addEventListener("pointercancel", endDrag);
  wrap.addEventListener("keydown", function(e){
    if (V.locked) return;
    var st = e.shiftKey ? 15 : 5, k = e.key;
    if (k === "ArrowLeft") V.set(V.az + st, V.el); else if (k === "ArrowRight") V.set(V.az - st, V.el);
    else if (k === "ArrowUp") V.set(V.az, V.el + st); else if (k === "ArrowDown") V.set(V.az, V.el - st);
    else return;
    e.preventDefault(); V.stop(); if (o.onRotate) o.onRotate();
  });
  return V;
}
// view preset buttons for a View3D (Isometric · Front · Side · Look from above)
function viewBtns(views, cur, dis){ return segBtns("view", views, cur, "View", dis); }
// --------------------------------------------------- end of V1 view3d -----------------------------------------------

// ---------- a two-line scene: line 1 (--pen) with P, line 2 (--f3) with Q, the dashed P–Q gap, markers ----------
function twoLineScene(L, o){
  var flat = !!o.flat, cls = o.cls || classify(L), sc = { flat:flat, lines:[], pts:[], segs:[] };
  var r2 = o.lift ? [L.r2[0], L.r2[1], L.r2[2] + o.lift] : L.r2;
  sc.lines.push({ r:L.r1, m:L.m1, color:"var(--pen)", width:3.2 });
  sc.lines.push({ r:r2, m:L.m2, color:"var(--f3)", width:3, dash:cls.kind === "same" && !o.lift ? "10 8" : null });
  var words = [];
  if (o.top && !flat && cls.kind === "skew" && cls.pair) {
    var det = L.m2[0] * L.m1[1] - L.m1[0] * L.m2[1];
    if (det) {
      var d = cls.d, s0 = (L.m2[0] * d[1] - d[0] * L.m2[1]) / det, X = nAt(L.r1, L.m1, s0);
      sc.pts.push({ p:X, hollow:true, color:"var(--ink)", label:o.onlyView || "crossing in this view only", dx:14, dy:24 });
      words.push("In this view the lines seem to cross at (" + fx(X[0], 2) + ", " + fx(X[1], 2) + "), but that crossing is in this view only.");
    }
  }
  if (o.P) {
    var same = o.gap && o.gap.val === 0;
    if (!same) sc.segs.push({ a:o.P, b:o.Qp, color:o.gapColor || "var(--ink-2)", label:o.gapLabel });
    if (same) sc.pts.push({ p:o.P, star:true, label:o.meetLabel || "P = Q", lcolor:"var(--ink)", dx:14, dy:-12 });
    else {
      sc.pts.push({ p:o.P, ring:true, color:"var(--pen)", label:"P", dx:-12, dy:-10, anchor:"end" });
      sc.pts.push({ p:o.Qp, ring:true, color:"var(--f3)", label:"Q", dx:11, dy:-10 });
    }
  }
  if (o.extra) sc.pts = sc.pts.concat(o.extra);
  sc.words = words;
  return sc;
}
var KIND_W = { meet:"intersect", parallel:"are parallel and distinct", same:"are the same line (coincident)", skew:"are skew" };

// =====================================================================================================================
// ---------- hero: from above the lines cross like an X; the camera tilts and a gap of 1 appears ----------
var HERO_L = { r1:[1, 0, 2], m1:[1, 1, 0], r2:[3, 0, 0], m2:[-1, 1, 1] };
function heroScene(gap){
  var cls = classify(HERO_L), sc = twoLineScene(HERO_L, { cls:cls });
  if (gap) {
    sc.segs.push({ a:[2, 1, 2], b:[2, 1, 1], color:"var(--hi)", width:3, dash:"5 4", label:"gap 1" });
    sc.pts.push({ p:[2, 1, 2], r:5, color:"var(--pen)" }, { p:[2, 1, 1], r:5, color:"var(--f3)" });
  } else sc.pts.push({ p:[2, 1, 2], r:6, color:"var(--ink)", label:"crossing?", dx:12, dy:-10 });
  sc.describe = "Line 1 in blue and line 2 in teal. " + (gap ? "At the apparent crossing, line 1 is at (2, 1, 2) and line 2 at (2, 1, 1): a dashed vertical gap of 1 unit." : "From above, the two lines cross like an X at (2, 1).");
  return sc;
}
function hero(f){
  var host = $("#il-hero"); if (!host) return;
  var CAP = "From above they cross. From the side, one passes over the other: skew.";
  if (MV.reduceMotion) {
    host.innerHTML = '<div class="il-hpair"><div><p class="tiny il-hc">From above</p><div id="il-h1"></div></div><div><p class="tiny il-hc">From the side</p><div id="il-h2"></div></div></div>';
    var a = View3D($("#il-h1", host), { B:4, label:"Hero view from above" }), b = View3D($("#il-h2", host), { B:4, label:"Hero view from the side" });
    a.locked = b.locked = true; a.az = CAMS.top.az; a.el = CAMS.top.el; a.draw(heroScene(false)); b.az = 30; b.el = 14; b.draw(heroScene(true));
    if (f.cap) f.cap.textContent = CAP;
    return;
  }
  var v = View3D(host, { B:4, label:"Hero animation" }); v.locked = true;
  v.az = CAMS.top.az; v.el = CAMS.top.el; v.draw(heroScene(false));
  if (f.cap) f.cap.textContent = "From above: a blue line and a teal line cross like an X.";
  MV.wait(1500, function(){
    var a0 = v.az, e0 = v.el;
    MV.tween({ dur:2400, step:function(t){ v.set(a0 + (30 - a0) * t, e0 + (14 - e0) * t); }, done:function(){
      v.set(30, 14); v.draw(heroScene(true)); if (f.cap) f.cap.textContent = CAP;
    } });
  });
}

// =====================================================================================================================
// ---------- Explore: Two lines in space ----------
var RNG = { r:[-6, 6], m:[-4, 4] };
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, PRE = {}, MS = {};
  C.presets.forEach(function(p){ PRE[p.id] = p; });
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function okL(L){ return L && ["r1", "m1", "r2", "m2"].every(function(k){ return Array.isArray(L[k]) && L[k].length === 3 && L[k].every(Number.isInteger); }) && !isZero(L.m1) && !isZero(L.m2); }
  if (S.mode !== "r2" && S.mode !== "r3") S.mode = "r3";
  if (!okL(S.L)) { S.L = copyL(PRE.cross.L); S.preset = "cross"; S.mode = "r3"; }
  if (typeof S.s !== "number" || !isFinite(S.s)) S.s = 0;
  if (typeof S.t !== "number" || !isFinite(S.t)) S.t = 0;
  if (!Q.of(S.s)) S.s = Math.round(S.s * 2) / 2;
  if (!Q.of(S.t)) S.t = Math.round(S.t * 2) / 2;
  if (!S.cam || typeof S.cam.az !== "number") S.cam = { az:CAMS.iso.az, el:CAMS.iso.el };
  var busy = false, lift = 0, inMsg = "", solveMsg = "", stopT = null, anim = false;

  host.innerHTML = '<div class="il-ex"><div class="il-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="il-v"></div><div class="il-vbar"><span class="tiny il-h">' + T.view + '</span><span id="il-views"></span></div>' +
    '<p class="tiny muted il-note" id="il-rot"></p><p class="tiny muted il-note">' + MV.md(T.key) + "</p>" +
    '<dl class="read il-read" id="il-read" aria-live="polite"></dl></div>' +
    '<div class="il-side"><div class="il-ctl"><span class="tiny il-h">' + T.mode + '</span><span id="il-mode"></span></div>' +
    '<p class="tiny il-h">' + T.gallery + '</p><div class="chips il-gal" id="il-gal" role="group" aria-label="' + MV.esc(T.gallery) + '"></div>' +
    '<div class="il-lines" id="il-lines">' + lineBox(1) + lineBox(2) + '<p class="tiny muted il-note">' + MV.md(T.inNote) + '</p><p class="tiny il-bad" id="il-inmsg" aria-live="polite"></p></div>' +
    slider("s", T.sl) + slider("t", T.tl) +
    '<div class="q-actions"><button type="button" class="btn sm" data-act="solve" data-k="ilsolve">' + T.solve + '</button></div><p class="tiny il-note" id="il-smsg" aria-live="polite"></p>' +
    "</div></div>";
  function lineBox(n){
    return '<fieldset class="il-line il-l' + n + '"><legend>' + T["line" + n] + "</legend>" + vecIn("r" + n, "vec{r}_" + n, T.point) + vecIn("m" + n, "vec{m}_" + n, T.dir) + "</fieldset>";
  }
  function vecIn(key, lab, what){
    var R = RNG[key.charAt(0)];
    return '<div class="il-vrow"><span class="il-vl">' + m(lab + " =") + '</span><span class="il-par">(</span>' + [0, 1, 2].map(function(c){
      return (c ? '<span class="il-cm' + (c === 2 ? " il-z" : "") + '">,</span>' : "") + '<input class="numin il-n' + (c === 2 ? " il-z" : "") + '" type="number" step="1" min="' + R[0] + '" max="' + R[1] + '" data-v="' + key + '" data-c="' + c + '" data-k="in' + key + c + '" aria-label="Line ' + key.charAt(1) + " " + what + " " + AX[c] + '" autocomplete="off">';
    }).join("") + '<span class="il-par">)</span></div>';
  }
  function slider(p, lab){
    return '<label class="slider il-sl"><span class="slider-top"><span>' + MV.md(lab) + '</span><output id="il-' + p + 'out"></output></span>' +
      '<input type="range" id="il-' + p + '" min="-5" max="5" step="0.5" style="accent-color:var(--ink)" aria-label="Parameter ' + p + '"></label>';
  }
  var view = View3D($("#il-v", host), { B:7, onRotate:function(live){ S.cam = { az:view.az, el:view.el }; paintViews(); if (!live) api.save(); draw(); } });
  view.az = S.cam.az; view.el = S.cam.el;
  if (S.mode === "r2") { view.az = CAMS.top.az; view.el = CAMS.top.el; }

  function flat(){ return S.mode === "r2"; }
  function dim(){ return flat() ? 2 : 3; }
  function qs(){ return Q.of(S.s); }
  function qt(){ return Q.of(S.t); }
  function PQ(){
    var L = S.L, P = qAt(L.r1, L.m1, qs()), Qp = qAt(L.r2, L.m2, qt());
    return { P:P, Q:Qp, gap:lenS([0, 1, 2].map(function(c){ return Q.sub(Qp[c], P[c]); })) };
  }
  function qNum(v){ return v.map(Q.val); }

  // ---- drawing and readouts ----
  function draw(){
    var L = S.L, cls = classify(L), pq = PQ(), top = !flat() && view.viewName() === "top";
    var sc = twoLineScene(L, { flat:flat(), cls:cls, lift:lift, top:top, onlyView:T.onlyView, P:qNum(pq.P), Qp:qNum(pq.Q), gap:pq.gap,
      gapLabel:pq.gap.val ? (anim ? "≈ " + fx(pq.gap.val, 2) : MV.plain(m(pq.gap.src)) + (pq.gap.exact ? "" : " ≈ " + fx(pq.gap.val, 2))) : "", meetLabel:T.meet });
    var dm = dim();
    sc.describe = "Line 1 (blue): " + MV.plain(m(lineS(L.r1, L.m1, "s", dm))) + ". Line 2 (teal): " + MV.plain(m(lineS(L.r2, L.m2, "t", dm))) + ". The lines " + KIND_W[cls.kind] +
      (cls.kind === "meet" ? " at " + MV.plain(m(qVecS(cls.pt, dm))) : "") + ". P = " + MV.plain(m(qVecS(pq.P, dm))) + ", Q = " + MV.plain(m(qVecS(pq.Q, dm))) +
      (pq.gap.val ? "; gap between P and Q: " + MV.plain(m(pq.gap.src)) + "." : "; P and Q are the same point.") + (sc.words.length ? " " + sc.words.join(" ") : "");
    view.locked = flat() || busy;
    view.draw(sc);
  }
  function readRows(){
    var L = S.L, dm = dim(), cls = classify(L), R = T.rows, rows = [], pq = PQ();
    rows.push([R.l1, m(lineS(L.r1, L.m1, "s", dm))]);
    rows.push([R.l2, m(lineS(L.r2, L.m2, "t", dm))]);
    rows.push([R.dir, cls.par ? T.par + ": " + m("vec{m}_2 = " + kS(cls.k) + " vec{m}_1") : T.notPar]);
    rows.push([R.eqs, [0, 1, 2].slice(0, dm).map(function(c){ return '<span class="il-eqr">' + m(AX[c] + ":  " + lin(L.r1[c], L.m1[c], "s") + " = " + lin(L.r2[c], L.m2[c], "t")) + "</span>"; }).join("")]);
    if (cls.par) {
      rows.push([R.solve, MV.md(T.parSolve)]);
      rows.push([R.ptest, m(vecS(L.r2, dm)) + " " + (cls.on ? T.onL1 + " (" + m("s = " + qS(cls.s0)) + ")" : T.notOnL1)]);
    } else {
      rows.push([R.solve + " " + m(AX[cls.pair[0]]) + " and " + m(AX[cls.pair[1]]), m("s = " + qS(cls.s)) + ", " + m("t = " + qS(cls.t))]);
      if (dm === 3) rows.push([R.check + " " + m(AX[cls.third]), "Line 1: " + m(qS(cls.v1)) + "; line 2: " + m(qS(cls.v2)) + " → " + (cls.kind === "meet" ? T.match : T.noMatch)]);
    }
    rows.push([R.cls, "<strong>" + T.cls[cls.kind] + (cls.kind === "meet" ? " " + m(qVecS(cls.pt, dm)) : "") + "</strong>"]);
    rows.push([R.gap, m(pq.gap.src) + (pq.gap.exact ? "" : " ≈ " + fx(pq.gap.val, 2))]);
    return rows;
  }
  function paintRead(){ $("#il-read", host).innerHTML = MV.readoutHTML(readRows()); }
  function paintViews(){
    var vn = view.viewName();
    MV.keepFocus($("#il-views", host), function(){ $("#il-views", host).innerHTML = viewBtns(C.views, flat() ? "top" : vn, flat() || busy); });
    $("#il-rot", host).innerHTML = MV.md(flat() ? T.flatNote : T.rotNote);
  }
  function paintCtl(){
    MV.keepFocus($("#il-mode", host), function(){ $("#il-mode", host).innerHTML = segBtns("mode", [{ id:"r2", t:"R²" }, { id:"r3", t:"R³" }], S.mode, T.mode, busy); });
    MV.keepFocus($("#il-gal", host), function(){
      $("#il-gal", host).innerHTML = C.presets.map(function(p){ var on = S.preset === p.id; return '<button type="button" class="chip' + (on ? " on" : "") + (p.chal ? " il-cchip" : "") + '" data-pre="' + p.id + '" data-k="pre' + p.id + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">" + p.t + "</button>"; }).join("");
    });
    $("#il-lines", host).classList.toggle("il-flat", flat());
    $("#il-inmsg", host).innerHTML = inMsg ? MV.md(inMsg) : "";
    syncSl();
    var sb = $('[data-act="solve"]', host), chal = PRE[S.preset] && PRE[S.preset].chal;
    sb.disabled = busy || !!chal;
    $("#il-smsg", host).innerHTML = chal ? MV.md(T.solveOff) : solveMsg ? MV.md(solveMsg) : "";
  }
  function setInputs(){
    $$("[data-v]", host).forEach(function(inp){ inp.value = S.L[inp.dataset.v][+inp.dataset.c]; inp.disabled = busy; });
  }
  function syncSl(){
    ["s", "t"].forEach(function(p){
      var sl = $("#il-" + p, host), v = S[p], q = anim ? null : Q.of(v);
      sl.value = clamp(Math.round(v * 2) / 2, -5, 5); sl.disabled = busy;
      var txt = q ? MV.plain(m(qS(q))) : fx(v, 2);
      $("#il-" + p + "out", host).textContent = p + " = " + txt;
      sl.setAttribute("aria-valuetext", p + " = " + txt);
    });
  }
  function paintAll(){ setInputs(); paintCtl(); paintViews(); paintRead(); draw(); }
  function changed(){ api.save(); paintCtl(); paintViews(); paintRead(); draw(); MV.changed(); }

  function setMode(md){
    S.mode = md;
    if (md === "r2") {
      ["r1", "m1", "r2", "m2"].forEach(function(k){ S.L[k][2] = 0; });
      if (isZero(S.L.m1)) S.L.m1 = [1, 0, 0];
      if (isZero(S.L.m2)) S.L.m2 = [0, 1, 0];
      view.jump("top"); S.cam = { az:view.az, el:view.el };
    } else if (view.viewName() === "top") { view.jump("iso"); S.cam = { az:view.az, el:view.el }; }
  }
  function loadPreset(id){
    var p = PRE[id]; if (!p) return;
    S.preset = id; S.L = copyL(p.L); S.s = 0; S.t = 0; inMsg = ""; solveMsg = "";
    setMode(p.mode);
    if (p.mode === "r3" && view.viewName() === "top") { view.jump("iso"); S.cam = { az:view.az, el:view.el }; }
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.mode) { if (b.dataset.mode !== S.mode) { setMode(b.dataset.mode); solveMsg = ""; setInputs(); changed(); } return; }
    if (b.dataset.pre) { loadPreset(b.dataset.pre); setInputs(); changed(); return; }
    if (b.dataset.view) { if (flat()) return; view.animTo(b.dataset.view, 900); return; }
    if (b.dataset.act === "solve") {
      var cls = classify(S.L);
      if (cls.kind === "meet") { S.s = Q.val(cls.s); S.t = Q.val(cls.t); solveMsg = ""; }
      else if (cls.kind === "same") {
        var L = S.L, i = L.m2[0] ? 0 : L.m2[1] ? 1 : 2;
        S.t = Q.val(Q.div(Q.sub(Q.add(qi(L.r1[i]), Q.mul(qi(L.m1[i]), Q.of(S.s))), qi(L.r2[i])), qi(L.m2[i]))); solveMsg = T.solveSame;
      } else solveMsg = T.solveNone;
      changed();
    }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "il-s" || t.id === "il-t") { S[t.id.slice(3)] = +t.value; solveMsg = ""; changed(); return; }
    if (!t.dataset || !t.dataset.v) return;
    var key = t.dataset.v, R = RNG[key.charAt(0)], vals = [0, 1, 2].map(function(c){
      var el = $('[data-v="' + key + '"][data-c="' + c + '"]', host), raw = String(el.value).trim(), v = Number(raw);
      if (c === 2 && flat()) return 0;
      return raw !== "" && Number.isInteger(v) && v >= R[0] && v <= R[1] ? v : null;
    });
    if (vals.some(function(v){ return v === null; }) || (key.charAt(0) === "m" && isZero(vals))) { inMsg = T.badIn; paintCtl(); return; }
    inMsg = ""; solveMsg = ""; S.L[key] = vals; changed();
  });
  paintAll();

  // ---- challenges (plan's exact tests and named wrong states) ----
  function near(a, b){ return Math.abs(a - b) < 1e-9; }
  function chal(id){
    var M = MS[id], L = S.L, P = PRE["c" + id.slice(2)].L;
    if (id === "tc1") {
      if (!flat() || !eqv(L.r1, P.r1) || !eqv(L.m1, P.m1) || !eqv(L.r2, P.r2) || !eqv(L.m2, P.m2)) return { ok:false, msg:M.load };
      if (near(S.s, 2) && near(S.t, -1)) return { ok:true };
      if (near(S.s, 2) && near(S.t, 2)) return { ok:false, msg:M.same };
      if (near(S.s, 2) && near(S.t, 1)) return { ok:false, msg:M.tpos };
      return { ok:false, msg:M.general };
    }
    if (id === "tc2") {
      if (flat() || !eqv(L.r1, P.r1) || !eqv(L.m1, P.m1) || !eqv(L.m2, P.m2) || L.r2[0] !== 3 || L.r2[1] !== 0) return { ok:false, msg:M.load };
      var k = L.r2[2];
      if (k === 1) return { ok:true };
      if (k === 2) return { ok:false, msg:M.k2 };
      if (k === 0) return { ok:false, msg:M.k0 };
      return { ok:false, msg:M.general };
    }
    if (flat() || !eqv(L.r1, P.r1) || !eqv(L.m1, P.m1) || !eqv(L.r2, P.r2)) return { ok:false, msg:M.load };
    var d = L.m2;
    if (isZero(cross(d, [1, 1, 1]))) return { ok:false, msg:M.par };
    if (d.some(function(v){ return Math.abs(v) > 3; })) return { ok:false, msg:M.range };
    if (d[2] !== 0) return { ok:false, msg:M.notHoriz };
    if (isZero(cross(d, [2, 1, 0]))) return { ok:false, msg:M.origin };
    return { ok:true };
  }

  // ---- predictions ----
  function lock(on){ busy = on; paintAll(); }
  function tweenST(s1, t1, dur, cb){
    var s0 = S.s, t0 = S.t; anim = true;
    stopT = MV.tween({ dur:dur, step:function(k){ S.s = Math.round((s0 + (s1 - s0) * k) * 20) / 20; S.t = Math.round((t0 + (t1 - t0) * k) * 20) / 20; syncSl(); draw(); },
      done:function(){ stopT = null; anim = false; S.s = s1; S.t = t1; syncSl(); paintRead(); draw(); cb(); } });
  }
  return {
    predict:{
      start:function(p){
        if (stopT) { stopT(); stopT = null; }
        anim = false; view.stop();
        var st = p.start;
        S.preset = p.id === "p4" ? "fake" : null; S.mode = st.mode; S.L = copyL(st.L); S.s = st.s; S.t = st.t; inMsg = ""; solveMsg = "";
        view.jump(st.view); S.cam = { az:view.az, el:view.el };
        lift = p.id === "p3" ? 2.5 : 0;
        lock(true);
      },
      run:function(p, done){
        function fin(){ lift = 0; lock(false); api.save(); MV.changed(); done(); }
        function hold(){ MV.wait(900, fin); }
        if (p.id === "p1") tweenST(1.5, 1.5, 1800, hold);
        else if (p.id === "p2") {
          if (MV.reduceMotion) { view.jump("side"); S.cam = { az:view.az, el:view.el }; draw(); paintViews(); hold(); }
          else view.animTo("iso", 2000, function(){ S.cam = { az:view.az, el:view.el }; paintViews(); hold(); });
        }
        else if (p.id === "p3") {
          stopT = MV.tween({ dur:1600, step:function(k){ lift = 2.5 * (1 - k); draw(); }, done:function(){ stopT = null; lift = 0; draw(); hold(); } });
        }
        else tweenST(1, 1, 1600, hold);
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Skew or crossing? A tap-through flowchart on five pairs, each with a V1 view to confirm ----------
function part3(host, api){
  var S = api.S, C = api.content, LB = C.labels, PR = C.pairs;
  S.fc = S.fc || {};
  if (!PR.some(function(p){ return p.id === S.pair; })) S.pair = PR[0].id;
  var msg = null;
  function pair(){ return PR.filter(function(p){ return p.id === S.pair; })[0]; }
  function fst(id){ return S.fc[id] || (S.fc[id] = { i:0 }); }
  function nodes(p){
    if (p.par) return [{ id:"par", q:LB.nodes.par, ans:true, work:p.w.par }, { id:"pt", q:LB.nodes.pt, ans:!!p.onLine, work:p.w.pt }];
    if (p.r2) return [{ id:"par", q:LB.nodes.par, ans:false, work:p.w.par }, { id:"solve", q:LB.nodes.solve2, btn:true, work:p.w.solve }];
    return [{ id:"par", q:LB.nodes.par, ans:false, work:p.w.par }, { id:"solve", q:LB.nodes.solve, btn:true, work:p.w.solve }, { id:"third", q:LB.nodes.third, ans:!!p.third, work:p.w.third }];
  }
  host.innerHTML = '<div class="part il-p3"><p class="tiny il-h">' + LB.pairs + '</p><div class="chips il-pairs" id="il-pairs" role="group" aria-label="' + MV.esc(LB.pairs) + '"></div>' +
    '<div class="sym il-p3g"><div><div id="il-peq" class="il-peq"></div><ol class="il-fc" id="il-fc"></ol><div id="il-verd" aria-live="polite"></div></div>' +
    '<div><div id="il-pv"></div><div class="il-vbar"><span id="il-pviews"></span></div><p class="tiny muted il-note" id="il-pnote"></p></div></div></div>';
  var view = View3D($("#il-pv", host), { B:5, onRotate:function(){ paintViews(); draw(); } });
  function paintPairs(){
    MV.keepFocus($("#il-pairs", host), function(){
      $("#il-pairs", host).innerHTML = PR.map(function(p){ var on = p.id === S.pair, d = fst(p.id).i >= nodes(p).length; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-pair="' + p.id + '" data-k="pair' + p.id + '" aria-pressed="' + on + '">' + p.t + (d ? " ✓" : "") + "</button>"; }).join("");
    });
  }
  function paintViews(){
    var p = pair();
    MV.keepFocus($("#il-pviews", host), function(){ $("#il-pviews", host).innerHTML = viewBtns(C.views || [{ id:"iso", t:"Isometric" }, { id:"front", t:"Front" }, { id:"side", t:"Side" }, { id:"top", t:"Look from above" }], p.r2 ? "top" : view.viewName(), !!p.r2); });
  }
  function draw(){
    var p = pair(), st = fst(p.id), done = st.i >= nodes(p).length, cls = classify(p.L), o = { flat:!!p.r2, cls:cls, top:!p.r2 && view.viewName() === "top" };
    if (done && p.kind === "meet") { var pt = p.r2 ? [p.pt2[0], p.pt2[1], 0] : cls.pt.map(Q.val); o.extra = [{ p:pt, star:true, label:"meet", lcolor:"var(--ink)", dx:14, dy:-12 }]; }
    if (done && p.kind === "skew") {
      var P = nAt(p.L.r1, p.L.m1, p.s), Qp = nAt(p.L.r2, p.L.m2, p.tt), g = lenS([0, 1, 2].map(function(c){ return qi(Qp[c] - P[c]); }));
      o.P = P; o.Qp = Qp; o.gap = g; o.gapLabel = "gap " + MV.plain(m(g.src));
    }
    var sc = twoLineScene(p.L, o);
    sc.describe = p.t + ". Line 1 in blue, line 2 in teal. " + (done ? "Verdict: " + MV.plain(MV.md(p.w.v)) : "Verdict not reached yet.") + (sc.words.length ? " " + sc.words.join(" ") : "");
    if (p.kind === "same") sc.describe += " Line 2 is drawn dashed on top of line 1.";
    view.locked = !!p.r2;
    view.draw(sc);
  }
  function paint(){
    var p = pair(), st = fst(p.id), N = nodes(p), done = st.i >= N.length;
    $("#il-peq", host).innerHTML = p.r2 ? '<p class="il-pl"><span class="il-sw1">Line 1</span> ' + MV.md(p.eq1) + '</p><p class="il-pl"><span class="il-sw2">Line 2</span> '  + MV.md(p.eq2) + "</p>" :
      '<p class="il-pl"><span class="il-sw1">Line 1</span> ' + m(lineS(p.L.r1, p.L.m1, "s", 3)) + '</p><p class="il-pl"><span class="il-sw2">Line 2</span> ' + m(lineS(p.L.r2, p.L.m2, "t", 3)) + "</p>";
    var h = "";
    N.forEach(function(n, j){
      if (j > st.i) return;
      h += '<li class="' + (j === st.i && !done ? "cur" : "ok") + '"><p class="il-fq">' + MV.md(n.q) + "</p>";
      if (j < st.i) h += '<p class="il-fw"><strong class="il-okc">✓ ' + (n.btn ? "" : (n.ans ? LB.yes : LB.no) + ". ") + "</strong>" + MV.md(n.work) + "</p>";
      else if (!done) {
        h += '<div class="q-actions">' + (n.btn ? '<button type="button" class="btn sm primary" data-fa="go" data-k="fa' + p.id + j + '">' + LB.solveBtn + "</button>" :
          '<button type="button" class="btn sm" data-fa="yes" data-k="fy' + p.id + j + '">' + LB.yes + '</button><button type="button" class="btn sm" data-fa="no" data-k="fn' + p.id + j + '">' + LB.no + "</button>") + "</div>";
        if (msg) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + MV.md(msg));
      }
      h += "</li>";
      if (p.r2 && n.id === "solve" && j < st.i) h += '<li class="ok il-skip"><p class="tiny muted">' + MV.md(LB.r2skip) + "</p></li>";
    });
    MV.keepFocus($("#il-fc", host), function(){ $("#il-fc", host).innerHTML = h; });
    var v = "";
    if (done) {
      v = MV.fbHTML("good", "<strong>" + LB.verdict + ": " + LB.verd[p.kind] + ".</strong> " + MV.md(p.w.v) + " " + LB.confirm + " " + (p.r2 ? "the flat grid shows the crossing." : "use the view buttons or drag the view.")) +
        (p.alg ? '<details class="alg"><summary>' + LB.working + '</summary><div class="alg-lines">' + p.alg.map(function(l){ return "<div>" + MV.md(l) + "</div>"; }).join("") + "</div></details>" : "") +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-fa="restart" data-k="fr' + p.id + '">' + LB.restart + "</button></div>";
    }
    MV.keepFocus($("#il-verd", host), function(){ $("#il-verd", host).innerHTML = v; });
    $("#il-pnote", host).textContent = p.r2 ? "R²: a flat grid seen from above." : "Drag the view or use the arrow keys to rotate it.";
    paintPairs(); paintViews(); draw();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var p = pair(), st = fst(p.id), N = nodes(p);
    if (b.dataset.pair) { S.pair = b.dataset.pair; msg = null; var np = pair(); if (np.r2) view.jump("top"); else if (view.viewName() === "top") view.jump("iso"); api.save(); paint(); return; }
    if (b.dataset.view) { if (!p.r2) view.animTo(b.dataset.view, 900); return; }
    if (!b.dataset.fa) return;
    if (b.dataset.fa === "restart") { st.i = 0; msg = null; api.save(); paint(); return; }
    var n = N[st.i]; if (!n) return;
    if (n.btn || (b.dataset.fa === "yes") === n.ans) { st.i++; msg = null; }
    else msg = LB.wrong[n.id] || LB.wrong.par;
    api.save(); paint(); MV.focusFb($("#il-fc", host));
  });
  if (pair().r2) view.jump("top");
  paint();
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Find it (N4 point and number boxes plus chips; first-try scoring, three-level help) ----------
function findAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, pick:null, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + MV.md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q il-fq-item" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="il-fin"></div><div class="il-fcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .il-fin', host), h;
    if (it.form === "chips") {
      h = '<div class="opts" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, oi){
        var on = x.pick === oi, c = "opt" + (x.solved && MV.ok(o) ? " right" : on ? " picked" : "");
        return '<button type="button" class="' + c + '" role="radio" aria-checked="' + on + '" data-pick="' + oi + '" data-k="' + it.id + "p" + oi + '"' + (x.solved ? " disabled" : "") + "><span>" + MV.md(o.t) + "</span></button>"; }).join("") + "</div>";
    } else {
      h = '<div class="il-frame">' + it.boxes.map(function(bx){
        return (bx.pre ? '<span class="il-fl">' + MV.md(bx.pre) + "</span>" : "") + '<input class="numin short" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-bx="' + bx.k + '" data-k="' + it.id + "b" + bx.k + '" aria-label="' + MV.esc(it.id.toUpperCase() + " " + bx.k) + '" value="' + MV.esc(x.v[bx.k] || "") + '"' + (x.solved ? " disabled" : "") + ">" + (bx.post ? '<span class="il-fl">' + bx.post + "</span>" : "") + (bx.gap ? '<span class="il-gap"></span>' : "");
      }).join("") + "</div>";
    }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .il-fcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints.map(MV.md), x.hint) : "");
    if (x.solved) {
      var why = it.form === "chips" ? MV.right(it.options) >= 0 ? it.options[MV.right(it.options)].why : "" : it.why;
      h += MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + MV.md(it.display) : "") + ".</strong> " + MV.md(why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", MV.md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id);
    if (it.form === "chips") {
      if (x.pick == null) return { err:TX.pick };
      var o = it.options[x.pick];
      return MV.ok(o) ? { ok:true } : { msg:o.why || TX.general };
    }
    var got = {}, ans = MV.ans(it);
    for (var i = 0; i < it.boxes.length; i++) {
      var k = it.boxes[i].k, raw = String(x.v[k] || "").trim();
      if (!raw) return { err:TX.fill };
      var r = MV.parseNum(raw); if (!r || r.length !== 1 || !isFinite(r[0])) return { err:TX.err };
      got[k] = r[0];
    }
    if (Object.keys(ans).every(function(k){ return Math.abs(got[k] - ans[k]) < 1e-9; })) return { ok:true };
    var W = it.wrong || [];
    for (var j = 0; j < W.length; j++) if (Object.keys(W[j].v).every(function(k){ return Math.abs(got[k] - W[j].v[k]) < 1e-9; })) return { msg:W[j].fb };
    return { msg:it.general || TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.pick != null) { x.pick = +b.dataset.pick; msgs[it.id] = null; api.save(); paintIn(it); paintCl(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// =====================================================================================================================
// ---------- Performance task: Skew partner. Line 1 = s(1, 1, 0); line 2 = (2, 0, 1) + t(a, b, c) ----------
var TL = { r1:[0, 0, 0], m1:[1, 1, 0], r2:[2, 0, 1] };
var task = (function(){
  var api, view;
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -3 && v <= 3 ? v : null; }
  function read(){ var a = gi("a"), b = gi("b"), c = gi("c"); return { a:a, b:b, c:c, valid:a !== null && b !== null && c !== null && !(a === 0 && b === 0 && c === 0) }; }
  function lineOf(D){ return { r1:TL.r1, m1:TL.m1, r2:TL.r2, m2:[D.a, D.b, D.c] }; }
  function checks(D){
    if (!D.valid) return [false, false, false, false];
    var c1 = !isZero(cross([D.a, D.b, D.c], TL.m1)), c2 = c1 && classify(lineOf(D)).kind === "skew", c3 = D.b === 0 && D.a !== 0, c4 = c3 && (D.a - 2 * D.c) * D.a > 0;
    return [c1, c2, c3, c4];
  }
  function norm(D){
    var g = gcd(gcd(D.a, D.b), D.c) || 1, v = [D.a / g, D.b / g, D.c / g], f = v[0] || v[1] || v[2];
    if (f < 0) v = v.map(function(x){ return -x + 0; });
    return v;
  }
  function preview(){
    var D = read(), LB = api.content.labels, rd = $("#sp-read");
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + MV.md(LB.invalid) + "</p>";
      view.draw({ lines:[{ r:TL.r1, m:TL.m1, color:"var(--pen)", width:3.2 }], pts:[{ p:TL.r2, r:5, color:"var(--f3)", label:"A", dx:10, dy:-8 }], axis:{ z:true }, describe:"Line 1 in blue, point A(2, 0, 1) and the z-axis. Choose a direction for line 2." });
      return;
    }
    var L = lineOf(D), cls = classify(L), mv = L.m2, rows = [], R = LB.rows, extra = [], words = [];
    rows.push([R.l2, m(lineS(TL.r2, mv, "t", 3))]);
    var zMeet = D.b === 0 && D.a !== 0 ? Q.of(D.a - 2 * D.c, D.a) : null;
    if (zMeet) { extra.push({ p:[0, 0, Q.val(zMeet)], r:6, color:"var(--ink)", label:"(0, 0, " + MV.plain(m(qS(zMeet))) + ")", dx:-12, dy:-8, anchor:"end" }); rows.push([MV.md(R.z), LB.at + " " + m("(0, 0, " + qS(zMeet) + ")")]); words.push("Line 2 meets the z-axis at (0, 0, " + MV.plain(m(qS(zMeet))) + ")."); }
    else { rows.push([MV.md(R.z), LB.never]); words.push("Line 2 never meets the z-axis."); }
    if (cls.par) { rows.push([R.l1, cls.on ? R.same : LB.par]); words.push(cls.on ? "Line 2 is the same line as line 1." : "Line 2 is parallel to line 1."); }
    else if (cls.kind === "meet") { var pt = cls.pt.map(Q.val); extra.push({ p:pt, star:true, label:"meets line 1", lcolor:"var(--ink)", dx:14, dy:16 }); rows.push([R.l1, LB.yes + " " + m(qVecS(cls.pt, 3))]); words.push("Line 2 meets line 1 at " + MV.plain(m(qVecS(cls.pt, 3))) + "."); }
    else { rows.push([R.l1, LB.no]); words.push("Line 2 never meets line 1: skew."); }
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
    var sc = { lines:[{ r:TL.r1, m:TL.m1, color:"var(--pen)", width:3.2 }, { r:TL.r2, m:mv, color:"var(--f3)", width:3 }], axis:{ z:true },
      pts:[{ p:TL.r2, r:5, color:"var(--f3)", label:"A", dx:10, dy:-8 }].concat(extra),
      describe:"Line 1 (blue) " + MV.plain(m(lineS(TL.r1, TL.m1, "s", 3))) + "; line 2 (teal) " + MV.plain(m(lineS(TL.r2, mv, "t", 3))) + "; the z-axis in black. " + words.join(" ") };
    view.draw(sc);
  }
  function stepper(k){
    var LB = api.content.labels;
    return '<div class="il-step"><label for="sp-' + k + '"><span class="m">' + MV.md(LB[k]) + '</span> <span class="tiny muted">' + LB.range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="sp' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="sp-' + k + '" data-tk="' + k + '" type="number" min="-3" max="3" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="sp' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var LB = a.content.labels;
      if (a.S.a == null) { a.S.a = "1"; a.S.b = "1"; a.S.c = "0"; }
      inp.innerHTML = '<div class="il-tin"><p class="tiny" style="font-weight:700;margin:0">' + MV.md(LB.dir) + "</p>" + stepper("a") + stepper("b") + stepper("c") + "</div>";
      pv.innerHTML = '<div id="sp-read" aria-live="polite"></div><p class="tiny il-tgh">' + MV.md(LB.graph) + '</p><div id="sp-view"></div><div class="il-vbar"><span id="sp-views"></span></div>';
      function paintViews(){ MV.keepFocus($("#sp-views"), function(){ $("#sp-views").innerHTML = viewBtns([{ id:"iso", t:"Isometric" }, { id:"front", t:"Front" }, { id:"side", t:"Side" }, { id:"top", t:"Look from above" }], view.viewName()); }); }
      view = View3D($("#sp-view"), { B:5, onRotate:function(){ paintViews(); } });
      view.az = 35; view.el = 20;
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -3, 3)); $("#sp-" + k).value = a.S[k]; upd();
      });
      pv.addEventListener("click", function(e){ var b = e.target.closest("button"); if (b && b.dataset.view) view.animTo(b.dataset.view, 900); });
      preview(); paintViews();
    },
    read:read,
    valid:function(D){ return D.valid ? true : MV.md(api.content.labels.invalid); },
    checks:checks,
    key:function(D){ return norm(D).join("|"); },
    label:function(k){ return m("vec{m}_2 = (" + k.split("|").join(", ") + ")"); },
    text:function(k){ return "(" + k.split("|").map(function(v){ return v.replace("-", MINUS); }).join(", ") + ")"; },
    summary:function(ts){
      var T = api ? api.content : null, n = (ts.found || []).length;
      return [((T && T.summary) || "Skew partner") + ": " + (n ? "solved (" + n + "/9)" : "not solved yet")];
    }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ find:findAct },
  task:task
});

})();
