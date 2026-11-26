// MCV4U 37 Vectors in R³: hero (a dot walks 2 along x, 3 parallel to y and 6 up, outlining the box; floor diagonal √13, space
// diagonal 7), 3D point plotter (Explore: V1 view3d with Point / Two points / Planes modes, box, position vector, shadows,
// octant tint, R² vs R³ mini grid, the "found n of 12" tracker), Reading 3D sketches (Part 3: handedness, read the point with
// "Rotate to check", planes not lines) and the "Hidden beacon" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function md(s){ return MV.md(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function fmtN(v){ return v < 0 ? MINUS + (-v) : String(v); }
function ptTxt(p){ return "(" + p.map(fmtN).join(", ") + ")"; }
function eq3(a, b){ return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; }
function lerp3(a, b, t){ return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function sq3(p){ return p[0] * p[0] + p[1] * p[1] + p[2] * p[2]; }
// exact √n as text: 7, √13, 2√2
function surd(n){
  if (n === 0) return "0";
  var a = 1, b = n;
  for (var k = Math.floor(Math.sqrt(n)); k > 1; k--) if (n % (k * k) === 0) { a = k; b = n / (k * k); break; }
  return b === 1 ? String(a) : (a === 1 ? "" : a) + "√" + b;
}
function sqSrc(v){ return v < 0 ? "(" + v + ")^2" : v + "^2"; }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + md(o.t) + "</button>"; }).join("") + "</span>";
}
var AX = ["x", "y", "z"], PLN = ["yz", "xz", "xy"];            // PLN[i]: the coordinate plane where coordinate i is 0
function locHTML(p, T){
  var z = p.map(function(v){ return v === 0; }), nz = z.filter(Boolean).length;
  if (nz === 3) return T.origin;
  if (nz === 2) return md(T.onAxis.replace("{a}", "`" + AX[z.indexOf(false)] + "`"));
  if (nz === 1) { var j = z.indexOf(true); return md(T.onPlane.replace("{p}", "`" + PLN[j] + "`").replace("{e}", "`" + AX[j] + " = 0`")); }
  return (p.every(function(v){ return v > 0; }) ? T.first : T.octant) + " (" + p.map(function(v){ return v > 0 ? "+" : MINUS; }).join(", ") + ")";
}

// =====================================================================================================================
// @component V1 view3d — rotatable 3D axes view (MCV4U 37 first use; for 38–60). SVG, orthographic projection of a
// right-handed system. Camera at azimuth phi (degrees, from +x toward +y) and elevation eps: screen-right R = (−sin φ, cos φ, 0),
// screen-up U = (−sin ε cos φ, −sin ε sin φ, cos ε), toward the viewer F = R × U. Presets V3PRE: iso, front (xz), side (yz),
// top (xy). view3d(svg, {range, ticks, tl (tick-label step), negLabels, names, phi, eps, interactive, locked, onView}) ->
// {draw(scene), redraw(), set(phi, eps, animate), get(), lock(on), is(preset)}. Scene keys (all optional): axes:false;
// planes:[{pts:[[x,y,z]…], cls, alpha}] drawn first; segs:[{a, b, color:"--pen", w, dash:"5 4", arrow, fade:false}];
// polys:[{pts, color, w, dash, arrow}]; pts:[{p, r, color, open, ring}]; texts:[{p, t, color, dx, dy, anchor, cls}];
// describe (aria-label). Axes in --ink-2 with dashed negative halves; far parts fade (depth reads without colour). Drag or arrow
// keys on the focused SVG rotate (5°, Shift 15°); lock(true) stops rotation so touch scrolling works again.
var D2R = Math.PI / 180;
var V3PRE = { iso:{ phi:35, eps:24 }, front:{ phi:-90, eps:0 }, side:{ phi:0, eps:0 }, top:{ phi:-90, eps:90 } };
function dot3(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross3(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function normPhi(p){ p = ((p + 180) % 360 + 360) % 360 - 180; return p === -180 ? 180 : p; }
function view3d(svg, o){
  o = o || {};
  var V = { phi:o.phi == null ? V3PRE.iso.phi : o.phi, eps:o.eps == null ? V3PRE.iso.eps : o.eps }, locked = !!o.locked, scene = {};
  var Rg = o.range || 10, W = 360, C = W / 2, sc = (C - 18) / (Rg * (o.fit || 1.25)), B = null, stop = null;
  var names = o.names || AX;
  function basis(){
    var p = V.phi * D2R, e = V.eps * D2R, cp = Math.cos(p), sp = Math.sin(p), ce = Math.cos(e), se = Math.sin(e);
    B = { R:[-sp, cp, 0], U:[-se * cp, -se * sp, ce], F:[ce * cp, ce * sp, se] };
  }
  function P2(p){ return [C + sc * dot3(p, B.R), C - sc * dot3(p, B.U), dot3(p, B.F)]; }
  function r1(v){ return Math.round(v * 10) / 10; }
  function op(d){ return clamp(0.72 + 0.28 * d / (Rg * 1.3), 0.4, 1); }
  function col(c){ return "var(" + (c || "--ink") + ")"; }
  function head(h, a, b, c, o2, hs){
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); if (L < 2) return;
    var ux = dx / L, uy = dy / L, s = Math.min(hs || 12, L * 0.7), w = s * 0.42;
    h.push('<polygon points="' + r1(b[0]) + "," + r1(b[1]) + " " + r1(b[0] - ux * s + uy * w) + "," + r1(b[1] - uy * s - ux * w) + " " + r1(b[0] - ux * s - uy * w) + "," + r1(b[1] - uy * s + ux * w) +
      '" style="fill:' + col(c) + '" opacity="' + o2.toFixed(2) + '"/>');
  }
  function line(h, g){
    var a = P2(g.a), b = P2(g.b), o2 = g.fade === false ? 1 : op((a[2] + b[2]) / 2), L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 0.6) return;
    var x2 = b[0], y2 = b[1];
    if (g.arrow && L > 4) { var s = Math.min(12, L * 0.7) * 0.8; x2 -= (b[0] - a[0]) / L * s; y2 -= (b[1] - a[1]) / L * s; }
    h.push('<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" style="stroke:' + col(g.color) + ";stroke-width:" + (g.w || 2) +
      (g.dash ? ";stroke-dasharray:" + g.dash : "") + '" stroke-linecap="round" opacity="' + o2.toFixed(2) + '"/>');
    if (g.arrow) head(h, a, b, g.color, o2);
  }
  function poly(h, g){
    if (!g.pts || g.pts.length < 2) return;
    var q = g.pts.map(P2), d = q.map(function(p, i){ return (i ? "L" : "M") + r1(p[0]) + " " + r1(p[1]); }).join("");
    h.push('<path d="' + d + '" style="fill:none;stroke:' + col(g.color) + ";stroke-width:" + (g.w || 2) + (g.dash ? ";stroke-dasharray:" + g.dash : "") + '" stroke-linecap="round" stroke-linejoin="round"/>');
    if (g.arrow) head(h, q[q.length - 2], q[q.length - 1], g.color, 1, 11);
  }
  function text(h, t){
    var p = P2(t.p);
    h.push('<text x="' + r1(p[0] + (t.dx || 0)) + '" y="' + r1(p[1] + (t.dy || 0)) + '" text-anchor="' + (t.anchor || "middle") + '" dominant-baseline="middle" class="' + (t.cls || "v3-lb") +
      '" style="fill:' + col(t.color) + '">' + MV.esc(t.t) + "</text>");
  }
  function axes(h){
    for (var i = 0; i < 3; i++) {
      var e = [0, 0, 0]; e[i] = 1;
      var tip = e.map(function(v){ return v * Rg; }), neg = e.map(function(v){ return -v * Rg; });
      line(h, { a:[0, 0, 0], b:tip, color:"--ink-2", w:1.7 });
      line(h, { a:neg, b:[0, 0, 0], color:"--ink-2", w:1.5, dash:"5 5" });
      if (o.ticks !== false) {
        var td = [0, 0, 0]; td[i === 0 ? 1 : 0] = 0.22;
        var a0 = P2([0, 0, 0]), a1 = P2(tip), ax = a1[0] - a0[0], ay = a1[1] - a0[1], aL = Math.hypot(ax, ay) || 1, nx = -ay / aL, ny = ax / aL;
        if (ny < 0 || (Math.abs(ny) < 1e-6 && nx < 0)) { nx = -nx; ny = -ny; }
        for (var k = -Rg; k <= Rg; k++) {
          if (!k) continue;
          var c = e.map(function(v){ return v * k; });
          line(h, { a:[c[0] - td[0], c[1] - td[1], c[2] - td[2]], b:[c[0] + td[0], c[1] + td[1], c[2] + td[2]], color:"--ink-2", w:1.3 });
          if (o.tl && k % o.tl === 0 && (k > 0 || o.negLabels) && aL > Rg * 3) text(h, { p:c, t:fmtN(k), dx:nx * 11, dy:ny * 11, cls:"v3-tk", color:"--ink-2" });
        }
      }
      var lp = e.map(function(v){ return v * Rg * 1.1; });
      if (Math.hypot(P2(lp)[0] - C, P2(lp)[1] - C) > 8) text(h, { p:lp, t:names[i], cls:"v3-t", color:"--ink" });
    }
  }
  function render(){
    basis();
    var h = [], s = scene;
    (s.planes || []).forEach(function(pl){
      h.push('<polygon class="' + (pl.cls || "v3-plane") + '" points="' + pl.pts.map(function(p){ var q = P2(p); return r1(q[0]) + "," + r1(q[1]); }).join(" ") + '"' + (pl.alpha != null ? ' opacity="' + pl.alpha.toFixed(2) + '"' : "") + "/>");
    });
    if (s.axes !== false) axes(h);
    (s.segs || []).forEach(function(g){ line(h, g); });
    (s.polys || []).forEach(function(g){ poly(h, g); });
    (s.pts || []).forEach(function(pt){
      var q = P2(pt.p), o2 = pt.fade === false ? 1 : op(q[2]), r = pt.r || 5;
      if (pt.ring) h.push('<circle cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" r="' + (r + 5) + '" style="fill:none;stroke:var(--hi);stroke-width:3.5"/>');
      h.push('<circle cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" r="' + r + '" style="fill:' + (pt.open ? "var(--sheet)" : col(pt.color)) + ";stroke:" + col(pt.color) + ";stroke-width:" + (pt.open ? 2 : 1) + '" opacity="' + o2.toFixed(2) + '"/>');
    });
    (s.texts || []).forEach(function(t){ text(h, t); });
    svg.innerHTML = h.join("");
    if (s.describe) svg.setAttribute("aria-label", s.describe);
  }
  function view(){ if (o.onView) o.onView({ phi:V.phi, eps:V.eps }); }
  if (o.interactive) {
    svg.setAttribute("tabindex", "0");
    var drag = null;
    svg.addEventListener("pointerdown", function(e){
      if (locked) return;
      if (stop) { stop(); stop = null; }
      drag = { x:e.clientX, y:e.clientY, phi:V.phi, eps:V.eps, id:e.pointerId };
      try { svg.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    svg.addEventListener("pointermove", function(e){
      if (!drag || locked) return;
      var k = 0.55 * W / (svg.getBoundingClientRect().width || W);
      V.phi = normPhi(drag.phi - (e.clientX - drag.x) * k); V.eps = clamp(drag.eps + (e.clientY - drag.y) * k, -89, 90);
      render(); drag.moved = true;
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function(ev){ svg.addEventListener(ev, function(){ if (drag && drag.moved) view(); drag = null; }); });
    svg.addEventListener("keydown", function(e){
      if (locked || !/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return;
      e.preventDefault(); if (stop) { stop(); stop = null; }
      var st = e.shiftKey ? 15 : 5;
      if (e.key === "ArrowLeft") V.phi = normPhi(V.phi + st);
      else if (e.key === "ArrowRight") V.phi = normPhi(V.phi - st);
      else if (e.key === "ArrowUp") V.eps = clamp(V.eps + st, -89, 90);
      else V.eps = clamp(V.eps - st, -89, 90);
      render(); view();
    });
  }
  var api = {
    draw:function(s){ scene = s || {}; render(); },
    redraw:render,
    get:function(){ return { phi:V.phi, eps:V.eps }; },
    is:function(p){ return Math.abs(normPhi(V.phi - p.phi)) < 0.5 && Math.abs(V.eps - p.eps) < 0.5; },
    set:function(phi, eps, anim, cb){
      if (stop) { stop(); stop = null; }
      var p0 = V.phi, e0 = V.eps, dp = normPhi(phi - p0), de = eps - e0;
      if (!anim) { V.phi = normPhi(phi); V.eps = eps; render(); view(); if (cb) cb(); return; }
      stop = MV.tween({ dur:550, step:function(t){ V.phi = normPhi(p0 + dp * t); V.eps = e0 + de * t; render(); },
        done:function(){ stop = null; V.phi = normPhi(phi); V.eps = eps; render(); view(); if (cb) cb(); } });
    },
    lock:function(on){ locked = !!on; svg.style.touchAction = locked ? "auto" : "none"; svg.classList.toggle("v3-locked", locked); }
  };
  api.lock(locked || !o.interactive);
  return api;
}
// box with opposite corners a and b: its distinct non-degenerate edges
function boxEdges(a, b){
  var out = [], seen = {};
  for (var c = 0; c < 8; c++) for (var d = 0; d < 3; d++) {
    if (c & (1 << d)) continue;
    var n = c | (1 << d), p = [0, 1, 2].map(function(i){ return (c & (1 << i)) ? b[i] : a[i]; }), q = [0, 1, 2].map(function(i){ return (n & (1 << i)) ? b[i] : a[i]; });
    if (a[d] === b[d]) continue;
    var k = [p.join(","), q.join(",")].sort().join("|"); if (seen[k]) continue; seen[k] = 1; out.push([p, q]);
  }
  return out;
}
function planePatch(axis, c, R){
  R = R || 9;
  var i = AX.indexOf(axis), j = (i + 1) % 3, k = (i + 2) % 3;
  return [[-R, -R], [R, -R], [R, R], [-R, R]].map(function(uv){ var p = [0, 0, 0]; p[i] = c; p[j] = uv[0]; p[k] = uv[1]; return p; });
}
function octFaces(P, R){
  R = R || 9;
  var s = P.map(function(v){ return v > 0 ? R : -R; });
  return [[[0, 0, 0], [s[0], 0, 0], [s[0], s[1], 0], [0, s[1], 0]], [[0, 0, 0], [s[0], 0, 0], [s[0], 0, s[2]], [0, 0, s[2]]], [[0, 0, 0], [0, s[1], 0], [0, s[1], s[2]], [0, 0, s[2]]]]
    .map(function(f){ return { pts:f, cls:"v3-oct" }; });
}
// right-angle mark at corner K between directions u1 and u2 (unit vectors), size s
function rightMark(K, u1, u2, s){
  return { pts:[[K[0] + u1[0] * s, K[1] + u1[1] * s, K[2] + u1[2] * s], [K[0] + (u1[0] + u2[0]) * s, K[1] + (u1[1] + u2[1]) * s, K[2] + (u1[2] + u2[2]) * s], [K[0] + u2[0] * s, K[1] + u2[1] * s, K[2] + u2[2] * s]], color:"--ink", w:1.6 };
}
function unit3(v){ var L = Math.sqrt(sq3(v)) || 1; return [v[0] / L, v[1] / L, v[2] / L]; }
// flat R² grid (−6 to 6) with vertical / horizontal lines {x:c} / {y:c} and dots {p:[x, y]}, as SVG markup
function grid2d(lines, dots){
  var W = 240, C = 120, s = 16, h = [];
  function X(x){ return C + x * s; } function Y(y){ return C - y * s; }
  for (var k = -6; k <= 6; k++) {
    h.push('<line x1="' + X(k) + '" y1="' + Y(-7) + '" x2="' + X(k) + '" y2="' + Y(7) + '" style="stroke:var(--rule);stroke-width:1"/>');
    h.push('<line x1="' + X(-7) + '" y1="' + Y(k) + '" x2="' + X(7) + '" y2="' + Y(k) + '" style="stroke:var(--rule);stroke-width:1"/>');
  }
  h.push('<line x1="' + X(-7) + '" y1="' + C + '" x2="' + X(7) + '" y2="' + C + '" style="stroke:var(--ink-2);stroke-width:1.6"/><line x1="' + C + '" y1="' + Y(-7) + '" x2="' + C + '" y2="' + Y(7) + '" style="stroke:var(--ink-2);stroke-width:1.6"/>');
  h.push('<text x="' + (X(7) - 4) + '" y="' + (C - 9) + '" text-anchor="end" class="v3-t" style="fill:var(--ink)">x</text><text x="' + (C + 9) + '" y="' + (Y(7) + 10) + '" class="v3-t" style="fill:var(--ink)">y</text>');
  (lines || []).forEach(function(L){
    if (L.x != null) h.push('<line x1="' + X(L.x) + '" y1="' + Y(-7) + '" x2="' + X(L.x) + '" y2="' + Y(7) + '" style="stroke:var(--pen);stroke-width:3"/><text x="' + (X(L.x) + (L.x < 4 ? 6 : -6)) + '" y="' + Y(5.6) + '" text-anchor="' + (L.x < 4 ? "start" : "end") + '" class="v3-lb" style="fill:var(--pen)">' + MV.esc(L.t) + "</text>");
    else h.push('<line x1="' + X(-7) + '" y1="' + Y(L.y) + '" x2="' + X(7) + '" y2="' + Y(L.y) + '" style="stroke:var(--pen);stroke-width:3"/><text x="' + X(-5.8) + '" y="' + (Y(L.y) + (L.y > -5 ? -10 : 12)) + '" class="v3-lb" style="fill:var(--pen)">' + MV.esc(L.t) + "</text>");
  });
  (dots || []).forEach(function(d){ h.push('<circle cx="' + X(d.p[0]) + '" cy="' + Y(d.p[1]) + '" r="6" style="fill:var(--ink);stroke:var(--sheet);stroke-width:2"/>' + (d.t ? '<text x="' + (X(d.p[0]) + 9) + '" y="' + (Y(d.p[1]) + 16) + '" class="v3-lb" style="fill:var(--ink)">' + MV.esc(d.t) + "</text>" : "")); });
  return h.join("");
}
// ------------------------------------------------------ end of V1 view3d ------------------------------------------------------

// point-and-box layers shared by the hero, Explore and the task: box edges O→P dashed --ink-2, position vector --pen
function pLayers(P, o){
  var segs = [], pts = [], planes = [], texts = [];
  if (o.oct && P.every(function(v){ return v !== 0; })) planes = planes.concat(octFaces(P));
  if (o.box) boxEdges([0, 0, 0], P).forEach(function(e){ segs.push({ a:e[0], b:e[1], color:"--ink-2", w:1.5, dash:"5 4" }); });
  if (o.vec && sq3(P) > 1e-9) segs.push({ a:[0, 0, 0], b:P, color:"--pen", w:3.2, arrow:true });
  if (o.sh) [[P[0], P[1], 0], [P[0], 0, P[2]], [0, P[1], P[2]]].forEach(function(q){ pts.push({ p:q, r:3.6, color:"--ink-2", open:true }); });
  pts.push({ p:P, r:5.5, color:"--pen", ring:!!o.ring });
  if (o.label) texts.push({ p:P, t:o.label, dx:14, dy:-14, anchor:"start", cls:"v3-lb" });
  return { segs:segs, pts:pts, planes:planes, texts:texts };
}
function merge(a, b){ ["segs", "pts", "planes", "texts", "polys"].forEach(function(k){ a[k] = (a[k] || []).concat(b[k] || []); }); return a; }

// ---------- hero: walk 2 along x, 3 parallel to y, 6 up; floor diagonal √13, space diagonal 7; rotate 30° ----------
function hero(f){
  var svg = $("#v3-hero"); if (!svg) return;
  var P = [2, 3, 6], F = [2, 3, 0], st = { a:0, b:0, c:0, d1:0, d2:0 }, v = view3d(svg, { range:7, phi:28, eps:22, fit:1.2 });
  function draw(){
    var s = { segs:[], pts:[], texts:[], polys:[] }, x = 2 * st.a, y = 3 * st.b, z = 6 * st.c, dot = [x, y, z];
    if (st.a > 0) s.segs.push({ a:[0, 0, 0], b:[x, 0, 0], color:"--ink-2", w:2, dash:"5 4" });
    if (st.b > 0) s.segs.push({ a:[2, 0, 0], b:[2, y, 0], color:"--ink-2", w:2, dash:"5 4" });
    if (st.b >= 1) { s.segs.push({ a:[0, 0, 0], b:[0, 3, 0], color:"--ink-2", w:1.5, dash:"5 4" }); s.segs.push({ a:[0, 3, 0], b:[2, 3, 0], color:"--ink-2", w:1.5, dash:"5 4" }); }
    if (st.c > 0) s.segs.push({ a:F, b:[2, 3, z], color:"--ink-2", w:2, dash:"5 4" });
    if (st.c >= 1) boxEdges([0, 0, 0], P).forEach(function(e){ if (e[0][2] === 6 || e[1][2] === 6) s.segs.push({ a:e[0], b:e[1], color:"--ink-2", w:1.5, dash:"5 4" }); });
    if (st.a >= 1) s.texts.push({ p:[1, 0, 0], t:"2", dx:-4, dy:14, cls:"v3-lb" });
    if (st.b >= 1) s.texts.push({ p:[2, 1.5, 0], t:"3", dx:0, dy:15, cls:"v3-lb" });
    if (st.c >= 1) s.texts.push({ p:[2, 3, 3], t:"6", dx:12, dy:0, anchor:"start", cls:"v3-lb" });
    if (st.d1 > 0) { s.segs.push({ a:[0, 0, 0], b:lerp3([0, 0, 0], F, st.d1), color:"--ink", w:2.4 }); if (st.d1 >= 1) s.texts.push({ p:[1, 1.5, 0], t:"√(2² + 3²) = √13", dx:-6, dy:26, anchor:"middle", cls:"v3-lb" }); }
    if (st.d2 > 0) {
      s.segs.push({ a:[0, 0, 0], b:lerp3([0, 0, 0], P, st.d2), color:"--pen", w:3.4, arrow:st.d2 >= 1 });
      if (st.d2 >= 1) { s.polys.push(rightMark(F, unit3([-2, -3, 0]), [0, 0, 1], 0.55)); s.texts.push({ p:[1, 1.5, 3], t:"√(13 + 6²) = 7", dx:-14, dy:-8, anchor:"end", cls:"v3-lb", color:"--pen" }); }
    }
    if (st.a > 0 || st.d2 >= 1) s.pts.push({ p:st.d2 >= 1 ? P : dot, r:5.5, color:"--pen" });
    if (st.d2 >= 1) s.texts.push({ p:P, t:"P(2, 3, 6)", dx:12, dy:-12, anchor:"start", cls:"v3-lb" });
    s.describe = "3D axes. " + (st.d2 >= 1 ? "The box from O to P(2, 3, 6), the floor diagonal √13 and the space diagonal from O to P, length 7, with a right angle at (2, 3, 0)." : "A dot moves from the origin along the box edges.");
    v.draw(s);
    if (f.cap) f.cap.innerHTML = st.d2 >= 1 ? "Pythagoras twice: across the floor, " + m("√{2^2 + 3^2} = √13") + ", then up: " + m("√{13 + 6^2} = 7") + "." :
      st.d1 >= 1 ? "The floor diagonal is " + m("√{2^2 + 3^2} = √13") + "." : st.c > 0 ? "Then 6 up, parallel to " + m("z") + ": a box." : st.b > 0 ? "Then 3 parallel to " + m("y") + ": a floor rectangle." : "From O, 2 along " + m("x") + ".";
  }
  function fin(){ st = { a:1, b:1, c:1, d1:1, d2:1 }; v.set(58, 22, false); draw(); }
  if (MV.reduceMotion) { fin(); return; }
  draw();
  function go(k, dur, cb){ MV.tween({ dur:dur, step:function(t){ st[k] = t; draw(); }, done:function(){ st[k] = 1; draw(); cb(); } }); }
  MV.wait(700, function(){ go("a", 900, function(){ go("b", 900, function(){ go("c", 1200, function(){ MV.wait(500, function(){ go("d1", 900, function(){ MV.wait(700, function(){
    go("d2", 1000, function(){ MV.wait(700, function(){ MV.tween({ dur:1600, step:function(t){ v.set(28 + 30 * t, 22, false); draw(); }, done:function(){ v.set(58, 22, false); draw(); } }); }); });
  }); }); }); }); }); }); });
}

// =====================================================================================================================
// ---------- Explore: 3D point plotter ----------
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function v3(a, d){ return Array.isArray(a) && a.length === 3 && a.every(function(v){ return Number.isInteger(v) && v >= -9 && v <= 9; }) ? a : d.slice(); }
  if (["pt", "two", "pl"].indexOf(S.mode) < 0) S.mode = "pt";
  S.P = v3(S.P, [2, 3, 6]); S.A = v3(S.A, [1, -2, 3]); S.B = v3(S.B, [4, 2, 3]);
  if (AX.indexOf(S.eq) < 0) S.eq = "z";
  if (!(Number.isInteger(S.c) && S.c >= -6 && S.c <= 6)) S.c = 2;
  ["box", "vec"].forEach(function(k){ if (typeof S[k] !== "boolean") S[k] = true; });
  ["sh", "oct", "lock"].forEach(function(k){ if (typeof S[k] !== "boolean") S[k] = false; });
  if (!Array.isArray(S.found)) S.found = [];
  if (typeof S.phi !== "number" || typeof S.eps !== "number") { S.phi = V3PRE.iso.phi; S.eps = V3PRE.iso.eps; }
  var an = {}, busy = false, stopA = null;
  host.innerHTML = '<div class="v3-ex"><div class="v3-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<svg class="v3-svg" id="v3-ex" viewBox="0 0 360 360" role="img" aria-label="3D view"></svg>' +
    '<div class="v3-vctl"><div id="v3-pre"></div><div class="v3-vbtn"><button type="button" class="btn ghost sm" data-act="reset" data-k="v3reset">' + T.reset + "</button>" +
    '<label class="v3-chk"><input type="checkbox" data-tg="lock" data-k="v3lock"' + (S.lock ? " checked" : "") + "> " + T.lock + "</label></div></div>" +
    '<p class="tiny muted v3-note">' + md(T.viewNote) + '</p><p class="tiny muted v3-note">' + md(T.key) + "</p></div>" +
    '<div class="v3-side"><div class="v3-ctl" id="v3-mode"></div><div id="v3-sls"></div><div class="v3-tgs" id="v3-tgs"></div>' +
    '<dl class="read v3-read" id="v3-read" aria-live="polite"></dl><div id="v3-extra"></div></div></div>';
  var svg = $("#v3-ex", host);
  var view = view3d(svg, { range:10, tl:3, phi:S.phi, eps:S.eps, interactive:true, locked:S.lock,
    onView:function(v){ S.phi = v.phi; S.eps = v.eps; api.save(); paintPre(); } });

  function curP(){ return an.P || S.P; }
  function sat(P){ return Math.abs(P[AX.indexOf(S.eq)] - S.c) < 1e-9; }
  function tc3ok(P){ return P.every(function(v){ return v >= 1; }) && sq3(P) === 81; }
  function describe(){
    var P = S.P;
    if (S.mode === "two") { var d = [S.B[0] - S.A[0], S.B[1] - S.A[1], S.B[2] - S.A[2]]; return "3D view: point A at " + ptTxt(S.A) + " and point B at " + ptTxt(S.B) + ". Vector AB is " + ptTxt(d) + ", length " + MV.plain(surd(sq3(d))) + "."; }
    var s = "3D view: point P at " + P.map(fmtN).join(", ") + ", " + MV.plain(locHTML(P, T)).replace(/^./, function(c){ return c.toLowerCase(); }) + ", " + surd(sq3(P)) + " units from the origin.";
    if (S.mode === "pl") s += " The plane " + AX[AX.indexOf(S.eq)] + " = " + fmtN(S.c) + (sat(P) ? " passes through P." : " doesn’t pass through P.");
    return s;
  }
  function scene(){
    var s = { segs:[], pts:[], planes:[], texts:[], polys:[] };
    if (S.mode === "two") {
      var A = S.A, Bp = S.B, t = an.ab == null ? 1 : an.ab;
      if (S.box) boxEdges(A, Bp).forEach(function(e){ s.segs.push({ a:e[0], b:e[1], color:"--ink-2", w:1.5, dash:"5 4" }); });
      if ((S.vec || an.ab != null) && t > 0 && !eq3(A, Bp)) s.segs.push({ a:A, b:lerp3(A, Bp, t), color:"--pen", w:3.2, arrow:t >= 1 });
      s.pts.push({ p:A, r:5.5, color:"--ink" }, { p:Bp, r:5.5, color:"--ink" });
      s.texts.push({ p:A, t:"A" + ptTxt(A), dx:-12, dy:-14, anchor:"end" }, { p:Bp, t:"B" + ptTxt(Bp), dx:12, dy:-14, anchor:"start" });
    } else {
      var P = curP(), ring = S.mode === "pl" && sat(P);
      if (S.mode === "pl") {
        var pa = an.planeA == null ? 1 : an.planeA;
        if (pa > 0) { s.planes.push({ pts:planePatch(S.eq, S.c), alpha:pa }); var c = planePatch(S.eq, S.c)[2]; s.texts.push({ p:c, t:S.eq + " = " + fmtN(S.c), dx:0, dy:-12, color:"--pen", cls:"v3-lb" }); }
      }
      merge(s, pLayers(P, { box:S.box, vec:S.vec && !an.noVec, sh:S.sh, oct:S.oct && !an.P, ring:ring, label:an.P ? null : "P" + ptTxt(P) }));
      var Fl = [P[0], P[1], 0];
      if (an.diag != null && an.diag > 0) {
        s.segs.push({ a:[0, 0, 0], b:lerp3([0, 0, 0], Fl, an.diag), color:"--ink", w:2.6 });
        if (an.diag >= 1) s.texts.push({ p:lerp3([0, 0, 0], Fl, 0.5), t:surd(P[0] * P[0] + P[1] * P[1]), dy:18, cls:"v3-lb" });
      }
      if (an.space != null && an.space > 0) {
        s.segs.push({ a:[0, 0, 0], b:lerp3([0, 0, 0], P, an.space), color:"--pen", w:3.4, arrow:an.space >= 1 });
        if (an.space >= 1) { s.polys.push(rightMark(Fl, unit3([-P[0], -P[1], 0]), [0, 0, P[2] < 0 ? -1 : 1], 0.7)); s.texts.push({ p:lerp3([0, 0, 0], P, 0.5), t:surd(sq3(P)), dx:-12, anchor:"end", cls:"v3-lb", color:"--pen" }); }
      }
      if (an.note) s.texts.push({ p:an.note.p, t:an.note.t, dx:an.note.dx || 0, dy:an.note.dy || 26, cls:"v3-lb" });
    }
    s.describe = describe();
    return s;
  }
  function draw(){ view.draw(scene()); }

  // ---- controls ----
  function slHTML(key, i, min, max, val, who){
    return '<label class="slider v3-sl"><span class="slider-top"><span>' + m(AX[i]) + '</span><output data-o="' + key + i + '">' + fmtN(val) + "</output></span>" +
      '<input type="range" min="' + min + '" max="' + max + '" step="1" value="' + val + '" data-s="' + key + i + '" data-k="s' + key + i + '" aria-label="' + MV.esc(who + " " + AX[i] + "-coordinate") + '" aria-valuetext="' + fmtN(val) + '"></label>';
  }
  function grp(key, title){ return '<div class="v3-grp"><p class="v3-h">' + title + "</p>" + [0, 1, 2].map(function(i){ return slHTML(key, i, -9, 9, S[key][i], key); }).join("") + "</div>"; }
  function paintMode(){ var h = '<span class="v3-h">' + T.mode + "</span>" + segBtns("mode", C.modes, S.mode, T.mode); var el = $("#v3-mode", host); MV.keepFocus(el, function(){ el.innerHTML = h; }); }
  function paintSliders(){
    var h = "";
    if (S.mode === "two") h = '<div class="v3-two">' + grp("A", T.aH) + grp("B", T.bH) + "</div>";
    else {
      if (S.mode === "pl") h += '<div class="v3-ctl"><span class="v3-h">' + T.eqH + "</span>" + segBtns("eq", C.eqs, S.eq, T.eqH) + "</div>" +
        '<label class="slider v3-sl"><span class="slider-top"><span>' + md(T.cLab) + '</span><output data-o="c">' + fmtN(S.c) + '</output></span><input type="range" min="-6" max="6" step="1" value="' + S.c + '" data-s="c" data-k="sc" aria-label="c" aria-valuetext="' + fmtN(S.c) + '"></label>';
      h += grp("P", T.pH);
    }
    var el = $("#v3-sls", host); MV.keepFocus(el, function(){ el.innerHTML = h; });
    var tg = (S.mode === "two" ? ["box", "vec"] : ["box", "vec", "sh", "oct"]).map(function(k){
      return '<label class="v3-chk"><input type="checkbox" data-tg="' + k + '" data-k="tg' + k + '"' + (S[k] ? " checked" : "") + "> " + T.toggles[k] + "</label>"; }).join("");
    var t2 = $("#v3-tgs", host); MV.keepFocus(t2, function(){ t2.innerHTML = tg; });
  }
  function paintOut(){
    $$("[data-s]", host).forEach(function(inp){
      var k = inp.dataset.s, v = k === "c" ? S.c : S[k[0]][+k[1]];
      if (+inp.value !== v) inp.value = v;
      inp.setAttribute("aria-valuetext", fmtN(v));
      var o = $('[data-o="' + k + '"]', host); if (o) o.textContent = fmtN(v);
    });
    $$("[data-eq]", host).forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.eq === S.eq)); });
  }
  function paintPre(){
    var el = $("#v3-pre", host), cur = null;
    Object.keys(V3PRE).forEach(function(k){ if (view.is(V3PRE[k])) cur = k; });
    MV.keepFocus(el, function(){ el.innerHTML = segBtns("pre", C.presets, cur, T.view); });
  }
  function paintRead(){
    var R = T.rows, rows = [], el = $("#v3-read", host);
    if (an.hideRead) { el.innerHTML = '<div><dd class="muted">' + T.hidden + "</dd></div>"; return; }
    if (S.mode === "two") {
      var A = S.A, Bp = S.B, d = [Bp[0] - A[0], Bp[1] - A[1], Bp[2] - A[2]];
      var diff = [0, 1, 2].map(function(i){ return Bp[i] + " - " + (A[i] < 0 ? "(" + A[i] + ")" : A[i]); }).join(", ");
      rows.push([R.a, "A" + ptTxt(A)], [R.b, "B" + ptTxt(Bp)],
        [md(R.ab), "B − A = " + m("(" + diff + ") = (" + d.join(", ") + ")")],
        [R.dist, m("√{" + d.map(function(v){ return v * v; }).join(" + ") + "} = " + surd(sq3(d)))]);
    } else {
      var P = S.P, fl = P[0] * P[0] + P[1] * P[1];
      rows.push([R.point, "P" + ptTxt(P)], [R.loc, locHTML(P, T)], [R.pv, m("vec{OP}") + " = " + ptTxt(P)]);
      if (P[2] !== 0) rows.push([R.floor, m("√{" + sqSrc(P[0]) + " + " + sqSrc(P[1]) + "} = " + surd(fl))]);
      rows.push([md(R.mag), m("√{" + P.map(function(v){ return v * v; }).join(" + ") + "} = " + surd(sq3(P)))]);
      if (S.mode === "pl") {
        var e = "`" + S.eq + " = " + S.c + "`";
        rows.push([R.sat, sat(P) ? md(T.sat.replace("{e}", e)) : md(T.notSat.replace("{e}", e).replace("{v}", "`" + S.eq + "`").replace("{n}", fmtN(P[AX.indexOf(S.eq)])))]);
      }
    }
    el.innerHTML = MV.readoutHTML(rows);
  }
  function paintExtra(){
    var el = $("#v3-extra", host), h = "";
    if (S.mode === "pt") {
      var list = S.found.map(function(k){ return "(" + k.split(",").join(", ") + ")"; }).join(" · ");
      h = '<p class="tiny v3-found"><strong>' + T.found.replace("{n}", S.found.length) + "</strong>: " + (list || '<span class="muted">' + T.foundNone + "</span>") + "</p>" + (S.found.length >= 12 ? '<p class="tiny v3-found">' + T.complete + "</p>" : "");
    } else if (S.mode === "pl") {
      var e2 = S.eq === "x" ? "x = " + S.c : "y = " + S.c, L = S.eq === "x" ? { x:S.c, t:"x = " + fmtN(S.c) } : { y:S.c, t:"y = " + fmtN(S.c) };
      h = '<p class="v3-h">' + T.r2H + '</p><svg class="v3-flat" viewBox="0 0 240 240" role="img" aria-label="' + MV.esc(T.r2Fig.replace("{e2}", e2.replace("-", MINUS))) + '">' + grid2d([L]) + "</svg>" +
        '<p class="tiny">' + md(T.r2r3.replace("{e3}", "`" + S.eq + " = " + S.c + "`").replace("{e2}", "`" + e2 + "`")) + "</p>";
    }
    el.innerHTML = h;
  }
  function paintAll(){ paintMode(); paintSliders(); paintPre(); paintRead(); paintExtra(); draw(); }
  function paintLive(){ paintOut(); paintRead(); paintExtra(); draw(); }
  function track(){ if (S.mode !== "two" && tc3ok(S.P)) { var k = S.P.join(","); if (S.found.indexOf(k) < 0) S.found.push(k); } }
  function changed(full){ an = {}; track(); api.save(); if (full) paintAll(); else paintLive(); MV.changed(); }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b)) return;
    if (b.dataset.mode) { S.mode = b.dataset.mode; changed(true); return; }
    if (b.dataset.eq) { S.eq = b.dataset.eq; changed(); return; }
    if (b.dataset.pre) { var p = V3PRE[b.dataset.pre]; view.set(p.phi, p.eps, true); return; }
    if (b.dataset.act === "reset") view.set(V3PRE.iso.phi, V3PRE.iso.eps, true);
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.s; if (!k) return;
    if (busy) { paintOut(); return; }
    var v = clamp(Math.round(+e.target.value), k === "c" ? -6 : -9, k === "c" ? 6 : 9);
    if (k === "c") S.c = v; else S[k[0]][+k[1]] = v;
    changed();
  });
  host.addEventListener("change", function(e){
    var k = e.target.dataset && e.target.dataset.tg; if (!k) return;
    S[k] = !!e.target.checked;
    if (k === "lock") { view.lock(S.lock); api.save(); return; }
    changed();
  });
  track();
  paintAll();

  // ---- challenges (plan's exact tests and named wrong states) ----
  function chal(id){
    var M = MS[id], P = S.P, x = P[0], y = P[1], z = P[2];
    if (id === "tc1") {
      if (S.mode === "two") return { ok:false, msg:M.mode };
      if (y === 0 && ((x === 3 && z === -4) || (x === 4 && z === -3))) return { ok:true };
      if (x === 0 && y !== 0) return { ok:false, msg:M.yz };
      if (z === 0 && y !== 0) return { ok:false, msg:M.xy };
      if (y === 0 && z === 0 && x !== 0) return { ok:false, msg:M.xaxis };
      if (y !== 0) return { ok:false, msg:M.noty };
      if (z > 0) return { ok:false, msg:M.above };
      if (x <= 0) return { ok:false, msg:M.sign };
      return { ok:false, msg:M.dist };
    }
    if (id === "tc2") {
      if (S.mode !== "two") return { ok:false, msg:M.mode };
      if (!eq3(S.A, [1, 2, -1])) return { ok:false, msg:M.setA };
      if (eq3(S.B, [3, -1, 5])) return { ok:true };
      if (eq3(S.B, [2, -3, 6])) return { ok:false, msg:M.atVec };
      if (eq3(S.B, [-1, 5, -7])) return { ok:false, msg:M.rev };
      return { ok:false, msg:M.general };
    }
    if (S.mode === "two") return { ok:false, msg:M.mode };
    if (tc3ok(P)) return { ok:true };
    if (eq3(P, [3, 3, 3])) return { ok:false, msg:M.m333 };
    if (eq3(P, [9, 0, 0])) return { ok:false, msg:M.x9 };
    if (eq3(P, [2, 3, 6])) return { ok:false, msg:M.seven };
    if (P.some(function(v){ return v === 0; })) return { ok:false, msg:M.zero };
    if (P.some(function(v){ return v < 0; })) return { ok:false, msg:M.neg };
    return { ok:false, msg:M.general };
  }

  // ---- predictions ----
  function tweenP(a, b, dur, cb){ stopA = MV.tween({ dur:dur, step:function(t){ an.P = lerp3(a, b, t); draw(); }, done:function(){ stopA = null; an.P = null; S.P = b.slice(); paintLive(); cb(); } }); }
  function tw(k, dur, cb){ an[k] = 0; stopA = MV.tween({ dur:dur, step:function(t){ an[k] = t; draw(); }, done:function(){ stopA = null; an[k] = 1; draw(); cb(); } }); }
  return {
    predict:{
      start:function(p){
        if (stopA) { stopA(); stopA = null; }
        an = {}; busy = true;
        if (p.id === "p1") { S.mode = "pt"; S.P = [0, 0, 0]; S.box = true; }
        else if (p.id === "p2") { S.mode = "pt"; S.P = [2, 3, 6]; S.box = true; an.hideRead = true; an.noVec = true; }
        else if (p.id === "p3") { S.mode = "pl"; S.eq = "z"; S.c = 2; S.P = [2, 3, 6]; an.planeA = 0; }
        else { S.mode = "two"; S.A = [1, -2, 3]; S.B = [4, 2, 3]; S.box = true; an.hideRead = true; an.ab = 0; }
        view.set(V3PRE.iso.phi, V3PRE.iso.eps, false);
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; an.hideRead = false; an.noVec = false; lock(false); api.save(); paintAll(); MV.changed(); done(); }
        if (p.id === "p1") tweenP([0, 0, 0], [0, 4, 0], 1600, function(){ an.note = { p:[0, 4, 0], t:"on the y-axis: the box is a segment", dy:28 }; draw(); MV.wait(1200, fin); });
        else if (p.id === "p2") tw("diag", 1100, function(){ MV.wait(700, function(){ tw("space", 1100, function(){ MV.wait(900, fin); }); }); });
        else if (p.id === "p3") tw("planeA", 900, function(){ tweenP([2, 3, 6], [2, 3, 2], 900, function(){ MV.wait(400, function(){ tweenP([2, 3, 2], [-4, -3, 2], 1300, function(){ tweenP([-4, -3, 2], [5, -2, 2], 1300, function(){ MV.wait(700, fin); }); }); }); }); });
        else tw("ab", 1300, function(){ MV.wait(900, fin); });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Reading 3D sketches ----------
function part3(host, api){
  var S = api.S, C = api.content, L = C.txt, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  S.s1 = S.s1 || { sel:[], shown:false };
  S.s2 = S.s2 || { i:0, pick:{}, ok:{}, rot:{} };
  S.s3 = S.s3 || { eq:"x3", dim:"r3" };
  var curl = S.s1.shown ? 1 : 0, s1msg = null;
  host.innerHTML =
    '<div class="part v3-st" id="v3-s1"><h3>' + S1.title + "</h3><p>" + md(S1.text) + '</p><div class="v3-hands" role="group" aria-label="' + MV.esc(L.tapNote) + '">' +
      S1.sketches.map(function(k, i){ return '<button type="button" class="v3-hand" data-h="' + i + '" data-k="h' + i + '" aria-pressed="false"><svg class="v3-mini" viewBox="0 0 360 360" role="img" aria-label="Sketch ' + (i + 1) + '"></svg><span class="v3-hcap">' + L.sketch + " " + (i + 1) + '</span><span class="v3-hres tiny"></span></button>'; }).join("") +
      '</div><div class="q-actions"><button type="button" class="btn primary sm" data-s1="chk" data-k="s1chk">' + L.check + '</button><button type="button" class="btn ghost sm" data-s1="curl" data-k="s1curl">' + L.curl + '</button></div><div id="v3-s1fb"></div></div>' +
    '<div class="part v3-st" id="v3-s2"><h3>' + S2.title + "</h3><p>" + md(S2.text) + '</p><div class="v3-ctl" id="v3-s2tabs"></div><div class="sym v3-stg"><div><svg class="v3-svg" id="v3-s2v" viewBox="0 0 360 360" role="img" aria-label="Sketch"></svg><div class="v3-ctl" id="v3-s2pre"></div><p class="tiny muted v3-note">' + L.rotNote + '</p></div><div id="v3-s2q"></div></div></div>' +
    '<div class="part v3-st" id="v3-s3"><h3>' + S3.title + "</h3><p>" + md(S3.text) + '</p><div class="v3-ctl" id="v3-s3eq"></div><div class="v3-ctl" id="v3-s3dim"></div><div class="sym v3-stg"><div><svg class="v3-svg" id="v3-s3v" viewBox="0 0 360 360" role="img" aria-label="3D view"></svg><svg class="v3-flat v3-flat-big" id="v3-s3f" viewBox="0 0 240 240" role="img" aria-label="Flat grid" hidden></svg></div><div id="v3-s3t"></div></div></div>';

  // ---- Station 1: right-handed or not? ----
  var hv = S1.sketches.map(function(k, i){ return view3d($('[data-h="' + i + '"] svg', host), { range:4, phi:k.phi, eps:k.eps, fit:1.15, ticks:false }); });
  function rightHanded(k){ return dot3(cross3(k.dirs[0], k.dirs[1]), k.dirs[2]) > 0; }
  function drawHand(i){
    var k = S1.sketches[i], s = { axes:false, segs:[], texts:[], polys:[] }, X = k.dirs[0], Y = k.dirs[1];
    k.dirs.forEach(function(d, j){ s.segs.push({ a:[0, 0, 0], b:[d[0] * 3.3, d[1] * 3.3, d[2] * 3.3], color:"--ink", w:2.6, arrow:true, fade:false }); s.texts.push({ p:[d[0] * 4, d[1] * 4, d[2] * 4], t:AX[j], cls:"v3-t v3-big" }); });
    if (curl > 0) {
      var n = 24, pts = [], T1 = Math.min(1, curl * 1.6);
      for (var q = 0; q <= n * T1; q++) { var t = q / n * Math.PI / 2; pts.push([1.7 * (Math.cos(t) * X[0] + Math.sin(t) * Y[0]), 1.7 * (Math.cos(t) * X[1] + Math.sin(t) * Y[1]), 1.7 * (Math.cos(t) * X[2] + Math.sin(t) * Y[2])]); }
      if (pts.length > 1) s.polys.push({ pts:pts, color:"--f3", w:4, arrow:true });
      if (curl >= 1) { var th = cross3(X, Y); s.segs.push({ a:[0, 0, 0], b:[th[0] * 2.6, th[1] * 2.6, th[2] * 2.6], color:"--pen", w:5, arrow:true, fade:false }); s.texts.push({ p:[th[0] * 2.6, th[1] * 2.6, th[2] * 2.6], t:"thumb", dx:30, dy:0, cls:"v3-lb", color:"--pen" }); }
    }
    s.describe = "Sketch " + (i + 1) + ": axes labelled x, y and z." + (curl >= 1 ? " The right hand curls from x to y; the thumb points along " + (rightHanded(k) ? "+z: right-handed." : "−z: left-handed.") : "");
    hv[i].draw(s);
    var res = $('[data-h="' + i + '"] .v3-hres', host); if (res) res.innerHTML = curl >= 1 ? md(rightHanded(k) ? L.thumbOk : L.thumbBad) : "";
  }
  function paint1(){
    S1.sketches.forEach(function(k, i){ var b = $('[data-h="' + i + '"]', host); b.setAttribute("aria-pressed", String(S.s1.sel.indexOf(k.id) >= 0)); drawHand(i); });
    $("#v3-s1fb", host).innerHTML = s1msg ? MV.fbHTML(s1msg.good ? "good" : "bad", md(s1msg.html)) : "";
  }
  function check1(){
    var sel = S.s1.sel, bad = null, miss = null;
    if (!sel.length) { s1msg = { html:S1.none }; return; }
    S1.sketches.forEach(function(k, i){ var on = sel.indexOf(k.id) >= 0, ok = MV.ok(k); if (on && !ok && bad == null) bad = i; if (!on && ok && miss == null) miss = i; });
    if (bad != null) s1msg = { html:"<strong>✗ Not quite.</strong> " + S1.left.replace("{n}", bad + 1) };
    else if (miss != null) s1msg = { html:"<strong>✗ Not quite.</strong> " + S1.miss.replace("{n}", miss + 1) };
    else s1msg = { good:true, html:S1.good };
  }
  var stopC = null;
  function playCurl(){
    if (stopC) { stopC(); stopC = null; }
    S.s1.shown = true; api.save();
    stopC = MV.tween({ dur:1600, ease:function(t){ return t; }, step:function(t){ curl = t; S1.sketches.forEach(function(k, i){ drawHand(i); }); }, done:function(){ stopC = null; curl = 1; paint1(); } });
  }
  paint1();

  // ---- Station 2: read the point, then rotate to check ----
  var v2 = view3d($("#v3-s2v", host), { range:5, tl:1, negLabels:true, interactive:true, locked:true, fit:1.2 });
  var s2msg = {};
  function it2(){ return S2.items[clamp(S.s2.i | 0, 0, S2.items.length - 1)]; }
  function parsePt(t){ return t.replace(/[()\s]/g, "").replace(/−/g, "-").split(",").map(Number); }
  function draw2(){
    var it = it2(), rot = !!S.s2.rot[it.id], s = merge({ segs:[], pts:[], texts:[], polys:[] }, pLayers(it.p, { box:true, vec:false }));
    if (rot) s.texts.push({ p:it.p, t:S2.trueLab + " " + ptTxt(it.p), dx:14, dy:-14, anchor:"start", cls:"v3-lb", color:"--pen" });
    var pk = S.s2.pick[it.id];
    if (rot && pk && !S.s2.ok[it.id]) {
      var q = parsePt(pk);
      if (q.length === 3 && q.every(isFinite)) { s.pts.push({ p:q, r:5, color:"--red", open:true }); s.texts.push({ p:q, t:"your reading", dx:-12, dy:16, anchor:"end", cls:"v3-lb", color:"--red" }); }
    }
    s.describe = "Sketch: a point drawn with its box" + (rot ? ", at " + ptTxt(it.p) + ". The view can be rotated." : ".");
    v2.draw(s);
  }
  function paint2(){
    var it = it2(), id = it.id, rot = !!S.s2.rot[id], pk = S.s2.pick[id], solved = !!S.s2.ok[id];
    var tabs = $("#v3-s2tabs", host); MV.keepFocus(tabs, function(){ tabs.innerHTML = segBtns("s2i", S2.items.map(function(x, i){ return { id:String(i), t:L.sketch + " " + (i + 1) + (S.s2.ok[x.id] ? " ✓" : "") }; }), String(S.s2.i | 0), L.sketch); });
    var pre = $("#v3-s2pre", host); MV.keepFocus(pre, function(){ pre.innerHTML = segBtns("s2pre", C.presets, null, L.view); });
    $$("[data-s2pre]", host).forEach(function(b){ b.disabled = !rot; });
    var h = '<p class="v3-h">' + S2.prompt + '</p><div class="chips v3-chips" role="group" aria-label="' + MV.esc(S2.prompt) + '">' + it.options.map(function(o, j){
      return '<button type="button" class="chip" data-s2o="' + j + '" data-k="s2o' + j + '" aria-pressed="' + (pk === o.t) + '"' + (solved ? " disabled" : "") + ">" + md(o.t) + "</button>"; }).join("") + "</div>";
    if (s2msg[id]) h += MV.fbHTML(s2msg[id].good ? "good" : "bad", md(s2msg[id].html));
    else if (solved) h += MV.fbHTML("good", md(S2.good + " " + (MV.right(it.options) || {}).why));
    if (pk && !rot) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-s2="rot" data-k="s2rot">' + L.rotate + "</button></div>";
    var q = $("#v3-s2q", host); MV.keepFocus(q, function(){ q.innerHTML = h; });
    v2.lock(!rot);
    draw2();
  }
  paint2();

  // ---- Station 3: planes, not lines ----
  var v3v = view3d($("#v3-s3v", host), { range:9, tl:3, interactive:true });
  function eq3item(){ return S3.eqs.filter(function(e){ return e.id === S.s3.eq; })[0] || S3.eqs[0]; }
  function paint3(){
    var e = eq3item(), r3 = S.s3.dim !== "r2";
    var a = $("#v3-s3eq", host); MV.keepFocus(a, function(){ a.innerHTML = '<span class="v3-h">' + L.eqH + "</span>" + segBtns("s3eq", S3.eqs, e.id, L.eqH); });
    var b = $("#v3-s3dim", host); MV.keepFocus(b, function(){ b.innerHTML = '<span class="v3-h">' + L.dimH + "</span>" + segBtns("s3dim", [{ id:"r2", t:L.r2 }, { id:"r3", t:L.r3 }], r3 ? "r3" : "r2", L.dimH); });
    var sv = $("#v3-s3v", host), fv = $("#v3-s3f", host);
    sv.hidden = !r3; fv.hidden = r3;
    if (r3) {
      var s = { planes:[], segs:[], pts:[], texts:[] };
      if (e.id === "x3" || e.id === "both") { s.planes.push({ pts:planePatch("x", 3, 8) }); s.texts.push({ p:[3, 8, 8], t:"x = 3", dy:-10, color:"--pen" }); }
      if (e.id === "ym2" || e.id === "both") { s.planes.push({ pts:planePatch("y", -2, 8) }); s.texts.push({ p:[8, -2, 8], t:"y = −2", dy:-10, color:"--pen" }); }
      if (e.id === "z0") { s.planes.push({ pts:planePatch("z", 0, 8) }); s.texts.push({ p:[8, 8, 0], t:"z = 0", dy:-10, color:"--pen" }); }
      if (e.id === "both") { s.segs.push({ a:[3, -2, -8], b:[3, -2, 8], color:"--ink", w:4, fade:false }); [[3, -2, 0], [3, -2, 5], [3, -2, -4]].forEach(function(p){ s.pts.push({ p:p, r:5, color:"--ink", fade:false }); }); }
      s.describe = e.id === "both" ? S3.figBoth : S3.fig3.replace("{e}", MV.plain(md(e.t)));
      v3v.draw(s);
    } else {
      var lines = [], dots = [];
      if (e.id === "x3" || e.id === "both") lines.push({ x:3, t:"x = 3" });
      if (e.id === "ym2" || e.id === "both") lines.push({ y:-2, t:"y = " + MINUS + "2" });
      if (e.id === "both") dots.push({ p:[3, -2], t:"(3, " + MINUS + "2)" });
      fv.innerHTML = grid2d(lines, dots);
      fv.setAttribute("aria-label", e.id === "z0" ? S3.fig2none : S3.fig2.replace("{e}", MV.plain(md(e.t))));
    }
    var t = $("#v3-s3t", host);
    t.innerHTML = '<p class="v3-s3txt">' + md(r3 ? e.r3 : e.r2) + '</p><details class="alg"><summary>' + S3.algH + '</summary><div class="alg-lines"><div>' + md(e.alg) + "</div></div></details>";
  }
  paint3();

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.h != null) { var id = S1.sketches[+b.dataset.h].id, sel = S.s1.sel, k = sel.indexOf(id); if (k >= 0) sel.splice(k, 1); else sel.push(id); s1msg = null; api.save(); paint1(); return; }
    if (b.dataset.s1 === "chk") { check1(); api.save(); paint1(); MV.focusFb($("#v3-s1", host)); playCurl(); return; }
    if (b.dataset.s1 === "curl") { playCurl(); return; }
    if (b.dataset.s2i != null) { S.s2.i = +b.dataset.s2i; api.save(); v2.set(V3PRE.iso.phi, V3PRE.iso.eps, false); paint2(); return; }
    if (b.dataset.s2o != null) {
      var it = it2(), o = it.options[+b.dataset.s2o];
      S.s2.pick[it.id] = o.t;
      if (MV.ok(o)) { S.s2.ok[it.id] = true; s2msg[it.id] = { good:true, html:S2.good + " " + o.why }; }
      else s2msg[it.id] = { good:false, html:S2.bad + " " + o.why + " " + S2.again };
      api.save(); paint2(); MV.focusFb($("#v3-s2q", host)); return;
    }
    if (b.dataset.s2 === "rot") { S.s2.rot[it2().id] = true; api.save(); paint2(); var sv = $("#v3-s2v", host); if (sv) sv.focus({ preventScroll:true }); return; }
    if (b.dataset.s2pre) { var p = V3PRE[b.dataset.s2pre]; v2.set(p.phi, p.eps, true); return; }
    if (b.dataset.s3eq) { S.s3.eq = b.dataset.s3eq; api.save(); paint3(); return; }
    if (b.dataset.s3dim) { S.s3.dim = b.dataset.s3dim; api.save(); paint3(); }
  });
  return {};
}

// =====================================================================================================================
// ---------- Performance task: Hidden beacon ----------
var task = (function(){
  var api, view;
  function gi(k){ var v = api && api.S[k]; return Number.isInteger(v) && v >= -9 && v <= 9 ? v : null; }
  function read(){ var x = gi("x"), y = gi("y"), z = gi("z"); return { x:x, y:y, z:z, valid:x !== null && y !== null && z !== null }; }
  function checks(D){ if (!D.valid) return [false, false, false]; return [D.x > 0 && D.y < 0 && D.z > 0, D.x * D.x + D.y * D.y + D.z * D.z === 49, D.z > D.x]; }
  function preview(){
    var D = read(); if (!D.valid) return;
    var P = [D.x, D.y, D.z], L = api.content.labels, rd = $("#hb-read");
    var s = merge({ segs:[], pts:[], texts:[] }, pLayers(P, { box:true, vec:true, label:"B" + ptTxt(P) }));
    s.describe = "3D view: beacon B at " + P.map(fmtN).join(", ") + ", " + surd(sq3(P)) + " units from the origin, with its box and position vector.";
    view.draw(s);
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML([[L.point, "B" + ptTxt(P)], [L.oct, "(" + P.map(function(v){ return v > 0 ? "+" : v < 0 ? MINUS : "0"; }).join(", ") + ")"],
      [md(L.mag), m("√{" + P.map(function(v){ return v * v; }).join(" + ") + "} = " + surd(sq3(P)))],
      [L.cmp, m("z = " + D.z) + (D.z > D.x ? " > " : D.z === D.x ? " = " : " < ") + m("x = " + D.x)]]) + "</dl>";
  }
  function sl(k){
    return '<label class="slider v3-sl"><span class="slider-top"><span>' + md(api.content.labels[k]) + '</span><output id="hb-o' + k + '">' + fmtN(api.S[k]) + '</output></span><input type="range" min="-9" max="9" step="1" value="' + api.S[k] + '" data-tk="' + k + '" aria-label="Beacon ' + k + '-coordinate" aria-valuetext="' + fmtN(api.S[k]) + '"></label>';
  }
  return {
    render:function(inp, pv, a){
      api = a;
      ["x", "y", "z"].forEach(function(k, i){ if (!(Number.isInteger(a.S[k]) && a.S[k] >= -9 && a.S[k] <= 9)) a.S[k] = [1, -1, 1][i]; });
      inp.innerHTML = '<div class="hb-in">' + sl("x") + sl("y") + sl("z") + "</div>";
      pv.innerHTML = '<div id="hb-read" aria-live="polite"></div><p class="tiny v3-h">' + md(a.content.labels.graph) + '</p><svg class="v3-svg" id="hb-view" viewBox="0 0 360 360" role="img" aria-label="3D view of the beacon"></svg>';
      view = view3d($("#hb-view"), { range:10, tl:3, interactive:true });
      inp.addEventListener("input", function(e){
        var k = e.target.dataset && e.target.dataset.tk; if (!k) return;
        a.S[k] = clamp(Math.round(+e.target.value), -9, 9); e.target.setAttribute("aria-valuetext", fmtN(a.S[k]));
        var o = $("#hb-o" + k); if (o) o.textContent = fmtN(a.S[k]);
        a.save(); preview(); a.update();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : "Choose whole numbers from −9 to 9."; },
    checks:checks,
    key:function(D){ return D.x + "|" + D.y + "|" + D.z; },
    label:function(k){ return "B" + ptTxt(k.split("|").map(Number)); },
    text:function(k){ return "B" + ptTxt(k.split("|").map(Number)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});

})();
