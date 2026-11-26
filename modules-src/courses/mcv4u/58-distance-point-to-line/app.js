// MCV4U 58 Distance from a Point to a Line in R² and R³: hero (F slides along 3x + 4y − 12 = 0 until |PF| = 5 at F(0, 3);
// then a line in space with the parallelogram on QP⃗ and m⃗ and its glowing height), Shortest path (Explore: V3 2D board with a
// draggable P and an F slider, V1 3D view with P sliders, distance graph, Formula view with the projection band or the
// parallelogram), Feet and parallels (Part 3: three N13 step-through stations), Beyond the formula (V8 box frames) and the
// "Five from P" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol) * Math.max(1, Math.abs(b)); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
function fx(v, dp){ var s = (Math.abs(v) < 0.5 * Math.pow(10, -dp) ? 0 : v).toFixed(dp); return s.replace("-", MINUS); }
function cn(v){ return num(v, 2); }
function ptTxt(a){ return "(" + a.map(cn).join(", ") + ")"; }
// vectors (2D or 3D arrays)
function add(a, b){ return a.map(function(v, i){ return v + b[i]; }); }
function sub(a, b){ return a.map(function(v, i){ return v - b[i]; }); }
function scl(a, k){ return a.map(function(v){ return v * k; }); }
function dot(a, b){ return a.reduce(function(s, v, i){ return s + v * b[i]; }, 0); }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function unit(a){ var l = len(a); return l ? scl(a, 1 / l) : a; }
// exact forms
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function sqrtSimp(n){ var s = 1, r = n; for (var k = 2; k * k <= r; k++) while (r % (k * k) === 0) { r /= k * k; s *= k; } return [s, r]; }
function fracSrc(p, q){ if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; p /= g; q /= g; return q === 1 ? String(p) : (p < 0 ? "-" : "") + Math.abs(p) + "/" + q; }
// √N / q in simplest form (m() source)
function surdSrc(N, q){
  if (N === 0) return "0";
  var sr = sqrtSimp(N), s = sr[0], r = sr[1], g = gcd(s, q); s /= g; q /= g;
  var top = r === 1 ? String(s) : (s === 1 ? "" : s) + "√" + r;
  return q === 1 ? top : top + "/" + q;
}
function isSq(n){ var r = Math.round(Math.sqrt(n)); return r * r === n; }
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
// a vector name with an over-arrow on a canvas ("QP", "n", "m")
function vecText(ctx, name, X, Y, color, px){
  ctx.save(); ctx.font = mfont(px || 15); ctx.textAlign = "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(name).width;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(X - 4, Y - 16, w + 8, 27); ctx.globalAlpha = 1;
  ctx.fillStyle = color; ctx.fillText(name, X, Y);
  var y0 = Y - 11; ctx.strokeStyle = color; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(X + 1, y0); ctx.lineTo(X + w + 1, y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X + w - 3, y0 - 3); ctx.lineTo(X + w + 1, y0); ctx.lineTo(X + w - 3, y0 + 3); ctx.stroke();
  ctx.restore();
}
// right-angle mark on a Plot: corner at data point `at`, legs along data directions u and v, `size` px
function raMark(ctx, p, at, u, v, size, color){
  var X = p.X(at[0]), Y = p.Y(at[1]);
  function px(d){ var dx = p.X(at[0] + d[0]) - X, dy = p.Y(at[1] + d[1]) - Y, l = Math.hypot(dx, dy) || 1; return [dx / l * size, dy / l * size]; }
  var a = px(u), b = px(v);
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.beginPath();
  ctx.moveTo(X + a[0], Y + a[1]); ctx.lineTo(X + a[0] + b[0], Y + a[1] + b[1]); ctx.lineTo(X + b[0], Y + b[1]); ctx.stroke(); ctx.restore();
}

// =====================================================================================================================
// @component V1 view3d — orthographic 3D view in SVG (course plan V1). view3d(svg, {static}) -> {draw(scene), preset(id), render}.
// Drag or arrow keys turn it (Shift for 15° steps); preset(id) with id iso | front (xz) | side (yz) | top (xy). Draws the axes
// (--ink-2, negative halves dashed, x y z at the positive ends) and scene.items, nearer objects drawn later and farther ones
// fainter: {k:"line", p0, m, color, w, label} (clipped to the ±R box), {k:"seg", a, b, color, w, dash, label},
// {k:"arrow", a, b, color, w, label}, {k:"poly", pts, color, alpha}, {k:"pt", p, color, r, label, ring, guides (dashed box
// to the axes)}, {k:"ra", at, u, v, size, color} (right-angle mark), {k:"text", p, text, color}. Colours are token names
// ("--pen"), written as var() so the view follows the theme. scene.describe becomes the aria-label. No inertia.
var PRESETS = { iso:[45, 35.26], front:[-90, 0], side:[0, 0], top:[-90, 90] };
function f1(v){ return (Math.round(v * 10) / 10).toString(); }
function clipLine(p0, d, R){
  var lo = -Infinity, hi = Infinity;
  for (var i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-12) { if (Math.abs(p0[i]) > R) return null; continue; }
    var t1 = (-R - p0[i]) / d[i], t2 = (R - p0[i]) / d[i];
    lo = Math.max(lo, Math.min(t1, t2)); hi = Math.min(hi, Math.max(t1, t2));
  }
  return hi > lo ? [lo, hi] : null;
}
function view3d(svg, o){
  o = o || {};
  var vb = (svg.getAttribute("viewBox") || "0 0 420 320").split(/[\s,]+/).map(Number), W = vb[2], H = vb[3];
  var st = { az:35, el:24 }, sc = null, drag = null;
  function basis(){
    var a = st.az * Math.PI / 180, e = st.el * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), ce = Math.cos(e), se = Math.sin(e);
    return { r:[-sa, ca, 0], u:[-se * ca, -se * sa, ce], v:[ce * ca, ce * sa, se] };
  }
  function line(a, b, c, w, dash, opa){
    return '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '" style="stroke:var(' + c + ');stroke-width:' + w + 'px;stroke-linecap:round' +
      (dash ? ";stroke-dasharray:" + dash : "") + (opa != null ? ";opacity:" + opa : "") + '"/>';
  }
  function text(p, t, c, opa, dx, dy, math){
    return '<text x="' + f1(p[0] + (dx || 0)) + '" y="' + f1(p[1] + (dy || 0)) + '" style="fill:var(' + c + ');stroke:var(--sheet);stroke-width:4px;paint-order:stroke;stroke-linejoin:round;' +
      (math ? "font:italic 600 15px var(--font-math, serif)" : "font:600 13px var(--font-ui, sans-serif)") + (opa != null ? ";opacity:" + opa : "") + '">' + MV.esc(t) + "</text>";
  }
  function render(){
    if (!sc) return;
    var R = sc.R || 7, b = basis(), s = Math.min(W, H) * 0.5 / (R * 1.5), cx = W / 2, cy = H / 2;
    function pr(p){ return [cx + s * dot(p, b.r), cy - s * dot(p, b.u), dot(p, b.v)]; }
    function op(d){ return clamp(0.72 + 0.28 * d / (R * 1.2), 0.45, 1).toFixed(2); }
    var h = "", out = [];
    ["x", "y", "z"].forEach(function(nm, i){
      var e = [0, 0, 0], ne = [0, 0, 0], lb = [0, 0, 0]; e[i] = R; ne[i] = -R; lb[i] = R * 1.12;
      var O = pr([0, 0, 0]);
      h += line(O, pr(e), "--ink-2", 1.5, null, 0.9) + line(pr(ne), O, "--ink-2", 1.5, "4 4", 0.6) + text(pr(lb), nm, "--ink-2", null, -4, 5, true);
    });
    (sc.items || []).forEach(function(it){
      var c = it.color || "--ink", A, B, d, H2 = "";
      if (it.k === "line") {
        var tr = clipLine(it.p0, it.m, R); if (!tr) return;
        A = pr(add(it.p0, scl(it.m, tr[0]))); B = pr(add(it.p0, scl(it.m, tr[1]))); d = (A[2] + B[2]) / 2;
        H2 = line(A, B, c, it.w || 3, it.dash, op(d));
        if (it.label) { var La = pr(add(it.p0, scl(it.m, tr[0] + (tr[1] - tr[0]) * (it.lt == null ? 0.88 : it.lt)))); H2 += text(La, it.label, c, null, 8, -8, true); }
        out.push({ L:1, d:d, h:H2 });
      } else if (it.k === "seg" || it.k === "arrow") {
        A = pr(it.a); B = pr(it.b); d = (A[2] + B[2]) / 2;
        var tip = B;
        if (it.k === "arrow") {
          var dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, hl = Math.min(11, l * 0.45);
          tip = [B[0] - ux * hl, B[1] - uy * hl];
          H2 = '<polygon points="' + [B, [tip[0] - uy * 5, tip[1] + ux * 5], [tip[0] + uy * 5, tip[1] - ux * 5]].map(function(q){ return f1(q[0]) + "," + f1(q[1]); }).join(" ") + '" style="fill:var(' + c + ');opacity:' + op(d) + '"/>';
        }
        if (it.glow) H2 = line(A, tip, "--hi", (it.w || 3) + 7, null, it.glow) + H2;
        H2 = line(A, tip, c, it.w || 2.4, it.dash, op(d)) + H2;
        if (it.label) { var M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; H2 += text(M, it.label, c, null, it.ldx == null ? 8 : it.ldx, it.ldy == null ? -6 : it.ldy, !it.ui); }
        out.push({ L:it.k === "arrow" ? 3 : 2, d:d, h:H2 });
      } else if (it.k === "poly") {
        var ps = it.pts.map(pr); d = ps.reduce(function(s2, q){ return s2 + q[2]; }, 0) / ps.length;
        out.push({ L:0, d:d, h:'<polygon points="' + ps.map(function(q){ return f1(q[0]) + "," + f1(q[1]); }).join(" ") + '" style="fill:var(' + c + ');fill-opacity:' + (it.alpha == null ? 0.14 : it.alpha) +
          ";stroke:var(" + c + ");stroke-opacity:" + (0.6 * Math.min(1, (it.alpha == null ? 0.14 : it.alpha) / 0.14)).toFixed(2) + ';stroke-width:1.5px"/>' });
      } else if (it.k === "ra") {
        var u = scl(unit(it.u), it.size || 0.5), v = scl(unit(it.v), it.size || 0.5), p1 = pr(add(it.at, u)), p2 = pr(add(add(it.at, u), v)), p3 = pr(add(it.at, v));
        out.push({ L:4, d:p2[2], h:'<polyline points="' + [p1, p2, p3].map(function(q){ return f1(q[0]) + "," + f1(q[1]); }).join(" ") + '" style="fill:none;stroke:var(' + c + ');stroke-width:1.8px"/>' });
      } else if (it.k === "pt") {
        A = pr(it.p); d = A[2];
        if (it.guides) {
          var g1 = pr([it.p[0], it.p[1], 0]), g2 = pr([it.p[0], 0, 0]), g3 = pr([0, it.p[1], 0]);
          out.push({ L:1, d:d - 50, h:line(A, g1, "--ink-2", 1, "3 4", 0.7) + line(g1, g2, "--ink-2", 1, "3 4", 0.7) + line(g1, g3, "--ink-2", 1, "3 4", 0.7) });
        }
        H2 = (it.ring ? '<circle cx="' + f1(A[0]) + '" cy="' + f1(A[1]) + '" r="' + ((it.r || 5) + 4) + '" style="fill:none;stroke:var(' + c + ');stroke-width:1.5px;opacity:.55"/>' : "") +
          '<circle cx="' + f1(A[0]) + '" cy="' + f1(A[1]) + '" r="' + (it.r || 5) + '" style="fill:var(' + (it.open ? "--sheet" : c) + ");stroke:var(" + c + ');stroke-width:2px"/>';
        if (it.label) H2 += text(A, it.label, c, null, it.ldx == null ? 9 : it.ldx, it.ldy == null ? -9 : it.ldy, false);
        out.push({ L:5, d:d, h:H2 });
      } else if (it.k === "text") {
        A = pr(it.p); out.push({ L:6, d:A[2], h:text(A, it.text, c, null, it.dx || 0, it.dy || 0, false) });
      }
    });
    out.sort(function(p, q){ return p.L - q.L || p.d - q.d; });
    svg.innerHTML = h + out.map(function(q){ return q.h; }).join("");
    svg.setAttribute("aria-label", sc.describe || "3D view");
  }
  if (!o.static) {
    svg.setAttribute("tabindex", "0");
    svg.style.touchAction = "none";
    svg.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY, az:st.az, el:st.el }; try { svg.setPointerCapture(e.pointerId); } catch (err) {} });
    svg.addEventListener("pointermove", function(e){
      if (!drag) return;
      st.az = drag.az - (e.clientX - drag.x) * 0.5; st.el = clamp(drag.el + (e.clientY - drag.y) * 0.5, -89, 90); render();
    });
    function end(){ drag = null; }
    svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
    svg.addEventListener("keydown", function(e){
      var k = e.key, stp = e.shiftKey ? 15 : 5;
      if (k === "ArrowLeft") st.az += stp; else if (k === "ArrowRight") st.az -= stp;
      else if (k === "ArrowUp") st.el = clamp(st.el + stp, -89, 90); else if (k === "ArrowDown") st.el = clamp(st.el - stp, -89, 90);
      else return;
      e.preventDefault(); render();
    });
  }
  return {
    draw:function(s2){ sc = s2; render(); },
    preset:function(id){ var p = PRESETS[id]; if (!p) return; st.az = p[0]; st.el = p[1]; render(); },
    render:render
  };
}
function presetHTML(T, pre){
  return '<div class="dp-pre" role="group" aria-label="' + MV.esc(T.presets) + '"><span class="tiny dp-h">' + T.presets + "</span>" + ["iso", "front", "side", "top"].map(function(id){
    return '<button type="button" class="btn ghost sm" data-pre="' + id + '" data-k="' + pre + id + '">' + T[id] + "</button>"; }).join("") + "</div>";
}
var PRE_TXT = { presets:"3D view", iso:"Isometric", front:"Front (xz)", side:"Side (yz)", top:"Top (xy)" };
// ------------------------------------------------- end of V1 view3d -------------------------------------------------

// the two lines of the module
var L2 = { r0:[4, 0], m:[4, -3], n:[3, 4], tmin:-4, tmax:3 };
var L3 = { r0:[1, 0, 2], m:[2, 1, -2], tmin:-3, tmax:3 };
var V2 = { xmin:-12.5, xmax:16.5, ymin:-9.5, ymax:12.25 };

// =====================================================================================================================
// ---------- Hero ----------
function hero(f){
  var cv = f.canvas, svg = $("#hero-3d"); if (!cv) return;
  var V = { xmin:-4, xmax:9, ymin:-2, ymax:7.75 }, pl = new MV.Plot(cv, V), st = { t:0.6, foot:false, k:0, h:0 };
  var v3 = svg ? view3d(svg, { static:true }) : null;
  function Fp(t){ return [4 + 4 * t, -3 * t]; }
  function draw2(){
    var F = Fp(st.t), d = Math.hypot(3 - F[0], 7 - F[1]), ink = css("--ink"), pen = css("--pen");
    pl.draw({ view:V, equal:true, xTicks:{ step:1 }, yTicks:{ step:1 },
      segments:[{ x1:-4, y1:6, x2:9, y2:-3.75, color:pen, width:3 }, { x1:3, y1:7, x2:F[0], y2:F[1], color:ink, width:2.6, dash:[7, 5] }],
      points:[{ x:F[0], y:F[1], r:5.5, color:ink }, { x:3, y:7, r:6, color:ink }],
      after:function(ctx, p){
        bgText(ctx, "P(3, 7)", p.X(3) + 12, p.Y(7), "left", ink, ui(13, 700));
        bgText(ctx, "3x + 4y − 12 = 0", p.X(5.2), p.Y(-1.2), "left", pen, mfont(14));
        var mx = (3 + F[0]) / 2, my = (7 + F[1]) / 2;
        bgText(ctx, "|PF| = " + fx(d, 1), p.X(mx) + 12, p.Y(my), "left", ink, ui(14, 700));
        if (st.foot) { raMark(ctx, p, F, [4, -3], [3, 4], 11, ink); bgText(ctx, "F(0, 3)", p.X(0) - 12, p.Y(3) + 4, "right", ink, ui(13, 700)); }
      },
      describe:"The line 3x + 4y − 12 = 0 and the point P(3, 7). A dashed segment joins P to F(" + cn(F[0]) + ", " + cn(F[1]) + ") on the line; |PF| ≈ " + fx(d, 1) + "." +
        (st.foot ? " F(0, 3) is the foot of the perpendicular, marked with a right angle: the shortest distance is 5." : "") });
  }
  function draw3(){
    if (!v3) return;
    var P = [5, -1, 1], Q = L3.r0, Fs = [3, 1, 0], it = [];
    it.push({ k:"line", p0:Q, m:L3.m, color:"--pen", w:3, label:"L" });
    if (st.k > 0) it.push({ k:"poly", pts:[Q, add(Q, L3.m), add(P, L3.m), P], color:"--pen", alpha:0.2 * st.k });
    it.push({ k:"arrow", a:Q, b:add(Q, L3.m), color:"--pen", w:3, label:"m⃗" });
    it.push({ k:"arrow", a:Q, b:P, color:"--f3", w:2.6, label:"QP⃗", ldx:-30, ldy:-6 });
    if (st.h > 0) { it.push({ k:"seg", a:P, b:Fs, color:"--ink", w:3.4, glow:(0.9 * st.h).toFixed(2) }); it.push({ k:"ra", at:Fs, u:L3.m, v:sub(P, Fs), size:0.6 }); }
    it.push({ k:"pt", p:Q, color:"--pen", r:4.5, label:"Q", ldx:-16 });
    it.push({ k:"pt", p:P, color:"--ink", r:5.5, label:"P" });
    v3.draw({ R:6, items:it, describe:"A line L in space with direction m and the point P off it. " + (st.k > 0 ? "The parallelogram on QP and m is shaded. " : "") +
      (st.h > 0 ? "Its height, from P straight across to the line, glows: height = area ÷ base." : "") });
  }
  function cap(){ if (f.cap) f.cap.innerHTML = st.h >= 1 ? "In space: height = area ÷ base, so `d = {|vec{QP} × vec{m}|}/{|vec{m}|}`.".replace(/`([^`]+)`/g, function(_, s){ return m(s); }) : st.foot ? "In the plane, the shortest distance is 5, at the foot F(0, 3)." : "F slides along the line; watch |PF|."; }
  pl.render = draw2;
  function fin(){ st.t = -1; st.foot = true; st.k = 1; st.h = 1; draw2(); draw3(); cap(); }
  if (MV.reduceMotion) { fin(); return; }
  draw2(); draw3(); cap();
  var lin = function(t){ return t; };
  function go(a, b, dur, cb){ MV.tween({ dur:dur, ease:lin, step:function(t){ st.t = a + (b - a) * t; draw2(); }, done:function(){ st.t = b; draw2(); cb(); } }); }
  MV.wait(700, function(){ go(0.6, -1.6, 2200, function(){ go(-1.6, -1, 1100, function(){
    st.foot = true; draw2(); cap();
    MV.wait(1000, function(){
      MV.tween({ dur:1000, step:function(t){ st.k = t; draw3(); }, done:function(){ st.k = 1;
        MV.tween({ dur:900, step:function(t){ st.h = t; draw3(); }, done:function(){ st.h = 1; draw3(); cap(); } }); } });
    });
  }); }); });
}

// =====================================================================================================================
// ---------- Explore: Shortest path ----------
// @component V3 board2d (point-to-line board) — R² mode: the line in --pen, P draggable on the integer grid (MV.drag, arrows
// move it by 1), F on the line from a t slider, PF dashed --ink with a right-angle mark when PF⃗ · m⃗ = 0; Formula view adds
// Q, the normal n⃗ (--f4, with its right-angle mark), QP⃗ (--f3) and the projection of QP⃗ on n⃗ as a --hi band under a thin ink
// arrow. R³ mode uses the V1 view3d above (parallelogram on QP⃗ and m⃗ at 20%, its height in ink). A K21-style distance graph
// plots |PF| against t with the current t marked.
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function okP(p, n, lo, hi){ return Array.isArray(p) && p.length === n && p.every(function(v){ return Number.isInteger(v) && v >= lo && v <= hi; }); }
  function okT(t, L){ return typeof t === "number" && t >= L.tmin && t <= L.tmax && Number.isInteger(t * 4); }
  if (S.mode !== "r3") S.mode = "r2";
  if (!okP(S.P2, 2, -8, 8)) S.P2 = [3, 7];
  if (!okP(S.P3, 3, -6, 6)) S.P3 = [5, -1, 1];
  if (!okT(S.t2, L2)) S.t2 = 0;
  if (!okT(S.t3, L3)) S.t3 = 0;
  S.graph = !!S.graph; S.formula = !!S.formula;
  S.found = S.found || {}; S.shown = S.shown || {};
  var busy = false, stop = null, note = "", bandK = 1, parK = 1, trace = null;

  host.innerHTML = '<div class="dp-ex"><div class="dp-main" data-mv="graph">' +
    '<div class="dp-bar"><span class="seg" role="group" aria-label="' + MV.esc(T.mode) + '" id="dp-mode"></span>' +
    '<span class="dp-vw" role="group" aria-label="' + MV.esc(T.views) + '" id="dp-views"></span></div>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="dp-v2" id="dp-v2"><div class="plot-wrap"><canvas class="plot dp-c2" id="dp-c2" role="img" aria-label="Board in R²"></canvas></div></div>' +
    '<div class="dp-v3" id="dp-v3"><svg class="dp-svg" id="dp-s3" viewBox="0 0 420 320" role="img" aria-label="3D view" focusable="false"></svg>' +
    presetHTML(T, "ex") + '<p class="tiny muted dp-rn">' + T.rotNote + "</p></div>" +
    '<p class="dp-note" id="dp-note" aria-live="polite"></p><p class="tiny muted dp-key" id="dp-key"></p>' +
    '<div class="dp-dg" id="dp-dgw"><p class="tiny dp-h">' + MV.md(T.dgLabel) + '</p><canvas class="plot dp-dgc" id="dp-dg" role="img" aria-label="Distance graph"></canvas></div></div>' +
    '<div class="dp-side"><div id="dp-ctl"></div><div id="dp-showw"></div><dl class="read dp-read" id="dp-read" aria-live="polite"></dl></div></div>';
  var c2 = $("#dp-c2", host), plot = new MV.Plot(c2, V2), dg = new MV.Plot($("#dp-dg", host), { xmin:-4, xmax:3, ymin:0, ymax:10 });
  var v3 = view3d($("#dp-s3", host));
  plot.render = draw2; dg.render = drawDG;

  function r3(){ return S.mode === "r3"; }
  function Lc(){ return r3() ? L3 : L2; }
  function Pc(){ return r3() ? S.P3 : S.P2; }
  function tc(){ return r3() ? S.t3 : S.t2; }
  function setT(v){ var L = Lc(); v = clamp(v, L.tmin, L.tmax); if (r3()) S.t3 = v; else S.t2 = v; }
  // geometry of the current state (exact where it matters)
  function geo(){
    var L = Lc(), P = Pc(), t = tc(), F = add(L.r0, scl(L.m, t)), PF = sub(F, P), mm = dot(L.m, L.m), c = dot(sub(L.r0, P), L.m);
    var dot4 = Math.round(4 * c + mm * 4 * t), tS = -c / mm, Fs = add(L.r0, scl(L.m, tS)), d = len(sub(Fs, P));
    var N16 = Math.round(dot(scl(PF, 4), scl(PF, 4)));
    var g = { L:L, P:P, t:t, F:F, PF:PF, mm:mm, c:c, dotv:c + mm * t, perp:dot4 === 0, pf:len(PF), N16:N16, tS:tS, Fs:Fs, d:d };
    g.FsSrc = "(" + L.r0.map(function(r, i){ return fracSrc(r * mm - L.m[i] * c, mm); }).join(", ") + ")";
    g.tSrc = fracSrc(-c, mm);
    if (r3()) { var QP = sub(P, L.r0), X = cross(QP, L.m); g.QP = QP; g.X = X; g.K = dot(X, X); g.dSrc = surdSrc(g.K, 3); g.dExact = isSq(g.K) && (Math.sqrt(g.K) % 3 === 0); }
    else { g.N = 3 * P[0] + 4 * P[1] - 12; g.QP = sub(P, L.r0); g.dSrc = fracSrc(Math.abs(g.N), 5); g.dExact = true; }
    return g;
  }
  function markFound(){ var g = geo(); if (g.perp) S.found[S.mode] = true; }
  function resetFound(){ S.found[S.mode] = false; S.shown[S.mode] = false; markFound(); }

  // ---- drawing ----
  function draw2(){
    if (r3()) { plot.draw({ view:V2, equal:true, describe:"" }); return; }
    var g = geo(), P = S.P2, F = g.F, ink = css("--ink"), pen = css("--pen"), f3 = css("--f3"), f4 = css("--f4"), Q = L2.r0;
    var segs = [{ x1:-20, y1:18, x2:24, y2:-15, color:pen, width:3 }], pts = [];
    var proj = scl(L2.n, dot(g.QP, L2.n) / 25 * bandK), tip = add(Q, proj);
    if (S.formula) {
      if (bandK > 0.02) {
        segs.push({ x1:Q[0], y1:Q[1], x2:tip[0], y2:tip[1], color:css("--hi"), width:9 });
        segs.push({ x1:Q[0], y1:Q[1], x2:tip[0], y2:tip[1], color:ink, width:1.6, arrow:true });
        if (bandK >= 1) segs.push({ x1:P[0], y1:P[1], x2:tip[0], y2:tip[1], color:css("--ink-2"), width:1.4, dash:[3, 4] });
      }
      segs.push({ x1:Q[0], y1:Q[1], x2:Q[0] + 3, y2:Q[1] + 4, color:f4, width:3, arrow:true });
      if (len(g.QP) > 0) segs.push({ x1:Q[0], y1:Q[1], x2:P[0], y2:P[1], color:f3, width:2.6, arrow:true });
      pts.push({ x:Q[0], y:Q[1], r:4.5, color:pen });
    }
    segs.push({ x1:P[0], y1:P[1], x2:F[0], y2:F[1], color:ink, width:3, dash:[7, 5] });
    pts.push({ x:F[0], y:F[1], r:5.5, color:ink }, { x:P[0], y:P[1], r:6.5, color:ink, ring:true });
    plot.draw({ view:V2, equal:true, xTicks:{ step:2 }, yTicks:{ step:2 }, segments:segs, points:pts,
      after:function(ctx, p){
        if (g.perp && g.pf > 1e-9) raMark(ctx, p, F, L2.m, sub(P, F), 11, ink);
        bgText(ctx, "ℓ", p.X(-10), p.Y(10.5) - 14, "center", pen, mfont(16));
        var up = P[1] >= F[1];
        bgText(ctx, "P(" + cn(P[0]) + ", " + cn(P[1]) + ")", p.X(P[0]) + 12, p.Y(P[1]) + (up ? -14 : 14), "left", ink, ui(13, 700));
        bgText(ctx, "F", p.X(F[0]) - 10, p.Y(F[1]) + (up ? 14 : -14), "right", ink, ui(13, 700));
        if (S.formula) {
          raMark(ctx, p, Q, L2.m, L2.n, 9, f4);
          bgText(ctx, "Q", p.X(Q[0]) + 10, p.Y(Q[1]) + 14, "left", pen, ui(13, 700));
          vecText(ctx, "n", p.X(Q[0] + 3) + 8, p.Y(Q[1] + 4) + 4, f4);
          if (len(g.QP) > 0) vecText(ctx, "QP", p.X((Q[0] + P[0]) / 2) - 34, p.Y((Q[1] + P[1]) / 2) - 2, f3);
        }
      },
      describe:"Line ℓ: 3x + 4y − 12 = 0. Point P(" + cn(P[0]) + ", " + cn(P[1]) + "); F(" + cn(F[0]) + ", " + cn(F[1]) + ") at t = " + cn(g.t) + "; |PF| ≈ " + fx(g.pf, 2) + "." +
        (g.perp && g.pf > 1e-9 ? " PF is perpendicular to the line." : "") +
        (S.found.r2 || S.shown.r2 ? " Point P is " + num(g.d, 2) + " units from the line; the closest point is " + ptTxt(g.Fs) + "." : "") +
        (S.formula ? " Formula view: the normal n = (3, 4) and the projection of QP onto n, length " + num(Math.abs(g.N) / 5, 2) + "." : "") });
  }
  function scene3(){
    var g = geo(), P = S.P3, F = g.F, Q = L3.r0, it = [];
    it.push({ k:"line", p0:Q, m:L3.m, color:"--pen", w:3, label:"L" });
    if (S.formula && parK > 0.02) it.push({ k:"poly", pts:[Q, add(Q, L3.m), add(P, L3.m), P], color:"--pen", alpha:0.2 * parK });
    it.push({ k:"arrow", a:Q, b:add(Q, L3.m), color:"--pen", w:3, label:"m⃗" });
    if (S.formula && len(g.QP) > 0) {
      it.push({ k:"arrow", a:Q, b:P, color:"--f3", w:2.6, label:"QP⃗", ldx:-30 });
      if (parK >= 1 && g.d > 1e-9) { it.push({ k:"seg", a:P, b:g.Fs, color:"--ink", w:3.4, label:"d", ldx:6, ldy:14 }); it.push({ k:"ra", at:g.Fs, u:L3.m, v:sub(P, g.Fs), size:0.55 }); }
    }
    it.push({ k:"seg", a:P, b:F, color:"--ink", w:3, dash:"7 5" });
    if (g.perp && g.pf > 1e-9) it.push({ k:"ra", at:F, u:L3.m, v:sub(P, F), size:0.55 });
    it.push({ k:"pt", p:Q, color:"--pen", r:4.5, label:"Q", ldx:-16, ldy:14 });
    it.push({ k:"pt", p:F, color:"--ink", r:5, label:"F", ldx:-16, ldy:-8 });
    it.push({ k:"pt", p:P, color:"--ink", r:6, label:"P(" + P.map(cn).join(", ") + ")", guides:true });
    return { R:7, items:it, describe:"3D view. Line L through Q(1, 0, 2) with direction m = (2, 1, −2). Point P" + ptTxt(P) + "; F" + ptTxt(F) + " at t = " + cn(g.t) + "; |PF| ≈ " + fx(g.pf, 2) + "." +
      (g.perp && g.pf > 1e-9 ? " PF is perpendicular to the line." : "") + (S.found.r3 || S.shown.r3 ? " P is " + num(g.d, 2) + " units from the line; the closest point is " + ptTxt(g.Fs) + "." : "") +
      (S.formula ? " Formula view: the parallelogram on QP and m is shaded, with its height in ink." : "") };
  }
  function draw3(){ if (r3()) v3.draw(scene3()); }
  function drawDG(){
    var w = $("#dp-dgw", host); if (!S.graph) return;
    var L = Lc(), P = Pc(), t = tc(), g = geo(), ink = css("--ink"), ink2 = css("--ink-2");
    var fd = function(x){ return len(sub(add(L.r0, scl(L.m, x)), P)); };
    var top = Math.max(fd(L.tmin), fd(L.tmax)), ym = Math.ceil((top + 1) / 5) * 5, dom = trace ? [Math.min(trace[0], trace[1]), Math.max(trace[0], trace[1])] : [L.tmin, L.tmax];
    var pts = [{ x:t, y:fd(t), r:5.5, color:ink }], fnd = S.found[S.mode] || S.shown[S.mode];
    if (fnd && !trace) pts.unshift({ x:g.tS, y:g.d, r:5, color:ink, open:true });
    dg.draw({ view:{ xmin:L.tmin - 0.25, xmax:L.tmax + 0.25, ymin:0, ymax:ym }, xTicks:{ step:1 }, yTicks:{ step:ym > 20 ? 5 : ym > 10 ? 2 : 1 }, xLabel:"t", yLabel:"|PF|",
      curves:dom[1] > dom[0] + 1e-6 ? [{ f:fd, color:ink, width:2.6, domain:dom }] : [], points:pts,
      after:function(ctx, p){
        ctx.save(); ctx.strokeStyle = ink2; ctx.globalAlpha = 0.7; ctx.lineWidth = 1.3; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(p.X(t), 0); ctx.lineTo(p.X(t), p.H); ctx.stroke(); ctx.restore();
        if (fnd && !trace) bgText(ctx, "least: " + (g.dExact ? MV.plain(m(g.dSrc)) : "≈ " + fx(g.d, 2)), p.X(g.tS), p.Y(g.d) + 22, "center", ink, ui(12, 700));
      },
      describe:"Distance graph: |PF| against t from " + cn(L.tmin) + " to " + cn(L.tmax) + ", a U-shaped curve. Current t = " + cn(t) + ", |PF| ≈ " + fx(fd(t), 2) + "." +
        (fnd ? " Its lowest point is at t = " + cn(g.tS) + ", |PF| ≈ " + fx(g.d, 2) + "." : "") });
    if (w) w.hidden = false;
  }
  function draw(){ if (r3()) draw3(); else draw2(); drawDG(); }

  // ---- panels ----
  function sliderHTML(id, label, min, max, step, val){
    return '<label class="slider dp-sl"><span class="slider-top"><span>' + MV.md(label) + '</span><output id="dp-o-' + id + '"></output></span>' +
      '<input type="range" id="dp-s-' + id + '" data-sl="' + id + '" data-k="sl' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" style="accent-color:var(--ink)" aria-label="' + MV.esc(MV.plain(MV.md(label))) + '"></label>';
  }
  function paintBars(){
    MV.keepFocus($(".dp-bar", host), function(){
      $("#dp-mode", host).innerHTML = [["r2", T.r2], ["r3", T.r3]].map(function(o){
        return '<button type="button" data-md="' + o[0] + '" data-k="md' + o[0] + '" aria-pressed="' + (S.mode === o[0]) + '">' + o[1] + "</button>"; }).join("");
      $("#dp-views", host).innerHTML = [["graph", T.graph], ["formula", T.formula]].map(function(o){
        return '<button type="button" class="btn ghost sm dp-tg" data-vw="' + o[0] + '" data-k="vw' + o[0] + '" aria-pressed="' + !!S[o[0]] + '">' + o[1] + "</button>"; }).join("");
    });
    $("#dp-v2", host).hidden = r3(); $("#dp-v3", host).hidden = !r3(); $("#dp-dgw", host).hidden = !S.graph;
    $("#dp-key", host).innerHTML = MV.md(r3() ? T.key3 : T.key2);
  }
  function paintCtl(){
    var L = Lc(), h = "";
    if (r3()) h += sliderHTML("x", T.px, -6, 6, 1, S.P3[0]) + sliderHTML("y", T.py, -6, 6, 1, S.P3[1]) + sliderHTML("z", T.pz, -6, 6, 1, S.P3[2]);
    else h += '<p class="tiny muted dp-pn">' + T.pNote + "</p>";
    h += sliderHTML("t", T.tSlider, L.tmin, L.tmax, 0.25, tc()) + '<p class="tiny muted dp-pn">' + T.tNote + "</p>";
    MV.keepFocus($("#dp-ctl", host), function(){ $("#dp-ctl", host).innerHTML = h; });
    syncSl();
  }
  function syncSl(){
    var vals = { t:tc() };
    if (r3()) { vals.x = S.P3[0]; vals.y = S.P3[1]; vals.z = S.P3[2]; }
    Object.keys(vals).forEach(function(k){
      var el = $("#dp-s-" + k, host), o = $("#dp-o-" + k, host); if (!el) return;
      if (+el.value !== vals[k]) el.value = vals[k];
      var txt = k === "t" ? "t = " + cn(vals[k]) : cn(vals[k]);
      if (o) o.textContent = txt; el.setAttribute("aria-valuetext", txt);
    });
  }
  function exprSrc(g){
    var a = g.c, b = g.mm, s = a > 0 ? a + " + " + b + "t" : a < 0 ? b + "t - " + Math.abs(a) : b + "t";
    return s + " = " + cn(g.dotv).replace(MINUS, "-");
  }
  function paintRead(){
    var g = geo(), R = T.rows, rows = [], fnd = S.found[S.mode] || S.shown[S.mode];
    rows.push([R.line, r3() ? m("vec{r} = (1, 0, 2) + t(2, 1, -2)") : m("3x + 4y - 12 = 0") + "; " + m("vec{r} = (4, 0) + t(4, -3)")]);
    rows.push([R.p, ptTxt(g.P)]);
    rows.push([R.f, ptTxt(g.F) + ' <span class="tiny muted">' + m("vec{r}_0 + t vec{m}") + ", " + m("t = " + cn(g.t).replace(MINUS, "-")) + "</span>"]);
    var ex = surdSrc(g.N16, 4), exact = isSq(g.N16) && Math.sqrt(g.N16) % 4 === 0;
    rows.push([MV.md(R.pf), m(ex) + (exact ? "" : " ≈ " + fx(g.pf, 2))]);
    rows.push([MV.md(R.dot), m(exprSrc(g)) + (g.perp ? ": " + T.perp : "")]);
    rows.push([R.best, fnd ? (g.dExact ? m(g.dSrc) : m(g.dSrc) + " ≈ " + fx(g.d, 2)) + ", at F" + m(g.FsSrc) + ", " + m("t = " + g.tSrc) : '<span class="muted">' + T.hidden + "</span>"]);
    if (S.formula) {
      if (r3()) {
        var k = Math.round(Math.sqrt(g.K)), sq = isSq(g.K);
        rows.push([R.formula, m("vec{QP} = (" + g.QP.join(", ") + ")") + "; " + m("vec{QP} × vec{m} = (" + g.X.join(", ") + ")") + "; " +
          m((sq ? k : surdSrc(g.K, 1)) + " ÷ 3 = " + g.dSrc) + (g.dExact ? "" : " ≈ " + fx(g.d, 2))]);
      } else {
        var P = g.P, aN = Math.abs(g.N);
        rows.push([R.formula, m("|3(" + P[0] + ") + 4(" + P[1] + ") - 12|/5 = " + aN + "/5") + " = " + (aN % 5 === 0 ? aN / 5 : cn(aN / 5))]);
      }
    }
    $("#dp-read", host).innerHTML = MV.readoutHTML(rows);
    var sw = $("#dp-showw", host);
    MV.keepFocus(sw, function(){ sw.innerHTML = fnd ? "" : '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="show" data-k="dpshow"' + (busy ? " disabled" : "") + ">" + T.show + "</button></div>"; });
    $("#dp-note", host).textContent = note;
  }
  function paintAll(){ paintBars(); paintCtl(); paintRead(); draw(); }
  function lock(on){
    host.querySelectorAll("input, button").forEach(function(el){ if (on) el.setAttribute("disabled", ""); else el.removeAttribute("disabled"); });
    if (!on) paintAll();
  }
  function changed(){ api.save(); syncSl(); paintRead(); draw(); MV.changed(); }

  // ---- input ----
  var drg = MV.drag(plot, {
    handles:function(){ return !r3() && !busy ? [{ id:"P", x:S.P2[0], y:S.P2[1], label:"Point P at (" + cn(S.P2[0]) + ", " + cn(S.P2[1]) + "). Arrow keys move it by 1." }] : []; },
    snap:function(x, y){ return [clamp(Math.round(x), -8, 8), clamp(Math.round(y), -8, 8)]; },
    move:function(id, x, y){ if (busy || (x === S.P2[0] && y === S.P2[1])) return; S.P2 = [x, y]; note = ""; resetFound(); changed(); },
    step:{ x:1, y:1 }, big:1
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.sl; if (!k || busy) return;
    var v = +e.target.value;
    if (k === "t") { setT(Math.round(v * 4) / 4); markFound(); }
    else { var i = "xyz".indexOf(k); if (S.P3[i] === v) return; S.P3 = S.P3.slice(); S.P3[i] = clamp(Math.round(v), -6, 6); resetFound(); }
    note = ""; changed();
  });
  host.addEventListener("keydown", function(e){
    var d = e.target.dataset || {};
    if (d.sl === "t" && e.shiftKey && /^Arrow/.test(e.key)) {
      e.preventDefault(); if (busy) return;
      setT(tc() + (e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 1)); markFound(); note = ""; changed();
    }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.md) { if (S.mode === b.dataset.md) return; S.mode = b.dataset.md; note = ""; markFound(); api.save(); paintAll(); MV.changed(); return; }
    if (b.dataset.vw) { S[b.dataset.vw] = !S[b.dataset.vw]; api.save(); paintBars(); paintRead(); draw(); return; }
    if (b.dataset.pre) { v3.preset(b.dataset.pre); return; }
    if (b.dataset.act === "show") { S.shown[S.mode] = true; api.save(); paintRead(); draw(); }
  });
  markFound();
  paintAll();

  // ---- challenges (plan's exact tests and named wrong states) ----
  function chal(id){
    var M = MS[id];
    if (id === "tc1") {
      if (r3()) return { ok:false, msg:M.mode };
      if (S.P2[0] !== 3 || S.P2[1] !== 7) return { ok:false, msg:M.p };
      if (S.t2 === -1) return { ok:true };
      if (S.t2 === 0) return { ok:false, msg:M.t0 };
      if (Math.abs(S.t2 + 1) <= 0.5) return { ok:false, msg:M.close };
      return { ok:false, msg:M.general };
    }
    if (id === "tc2") {
      if (r3()) return { ok:false, msg:M.mode };
      var N = 3 * S.P2[0] + 4 * S.P2[1] - 12;
      if (N === 10) return { ok:true };
      if (N === -10) return { ok:false, msg:M.side };
      if (Math.abs(N) === 2) return { ok:false, msg:M.num };
      return { ok:false, msg:M.general };
    }
    if (!r3()) return { ok:false, msg:M.mode };
    var v = sub(S.P3, L3.r0), dv = dot(v, L3.m), L2v = dot(v, v), X = cross(v, L3.m);
    if (dv === 0 && L2v === 9) return { ok:true };
    if (dv !== 0 && dot(X, X) === 81) return { ok:false, msg:M.foot };
    if (dv === 0) return { ok:false, msg:M.len + " " + m("|vec{v}| = " + surdSrc(L2v, 1)) + " " + M.len2 };
    return { ok:false, msg:M.general };
  }

  // ---- predictions ----
  function sweep(a, b, dur, cb){
    stop = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){
        var v = a + (b - a) * t; if (r3()) S.t3 = v; else S.t2 = v;
        if (trace) { trace[0] = Math.min(trace[0], v); trace[1] = Math.max(trace[1], v); }
        syncSl(); paintRead(); draw(); },
      done:function(){ stop = null; if (r3()) S.t3 = b; else S.t2 = b; markFound(); if (cb) cb(); } });
  }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; note = ""; trace = null; bandK = 1; parK = 1;
        if (p.id === "p4") { S.mode = "r3"; S.P3 = [5, -1, 1]; S.t3 = 0; S.formula = true; parK = 0; }
        else {
          S.mode = "r2"; S.t2 = 0;
          if (p.id === "p3") { S.P2 = [-1, -2]; S.formula = true; bandK = 0; }
          else { S.P2 = [3, 7]; S.graph = true; if (p.id === "p1") { S.formula = false; trace = [0, 0]; } }
        }
        S.found[S.mode] = false; S.shown[S.mode] = false; markFound();
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; trace = null; bandK = 1; parK = 1; markFound(); api.save(); lock(false); MV.changed(); done(); }
        function show(txt, cb){ note = txt; paintRead(); draw(); MV.wait(1300, cb); }
        if (p.id === "p1") sweep(0, -2.5, 2600, function(){ sweep(-2.5, -1, 1200, function(){ show("|PF| fell to 5 at F(0, 3), then grew again: a U-shaped graph.", fin); }); });
        else if (p.id === "p2") sweep(0, -1, 1600, function(){ show("At F(0, 3): PF⃗ · m⃗ = 0, a right angle.", fin); });
        else if (p.id === "p3") stop = MV.tween({ dur:1400, step:function(t){ bandK = t; draw(); }, done:function(){ stop = null; bandK = 1; show("The band on n⃗ points the other way; its length is |−23|/5 = 4.6.", fin); } });
        else stop = MV.tween({ dur:1000, step:function(t){ parK = t; draw(); }, done:function(){ stop = null; parK = 1;
          sweep(0, 1, 1400, function(){ show("The parallelogram’s height is 9 ÷ 3 = 3, less than |QP| = 3√2 ≈ 4.24.", fin); }); } });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}
// ------------------------------------------------- end of V3 board2d -------------------------------------------------

// =====================================================================================================================
// ---------- Part 3: Feet and parallels (@component N13 stationStepper: MV.player step-through beside a view) ----------
function part3(host, api){
  var S = api.S, C = api.content, L = C.labels, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  S.alt = !!S.alt;
  function stn(n, st, view){
    return '<div class="part dp-st" id="dp-st' + n + '"><h3>' + st.title + "</h3><p>" + MV.md(st.text) + '</p><div class="sym dp-stg"><div>' + view + '</div><div><ol class="dp-steps" id="dp-l' + n + '"></ol><div id="dp-pl' + n + '"></div></div></div></div>';
  }
  host.innerHTML =
    stn(1, S1, '<svg class="dp-svg dp-ssvg" id="dp-a3" viewBox="0 0 420 300" role="img" aria-label="' + MV.esc(S1.fig) + '" focusable="false"></svg>' + presetHTML(PRE_TXT, "a")) +
    stn(2, S2, '<div class="plot-wrap"><canvas class="plot" id="dp-b2" role="img" aria-label="' + MV.esc(S2.fig) + '"></canvas></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm dp-tg" data-alt="1" data-k="dpalt" aria-pressed="' + S.alt + '">' + MV.md(L.toggle) + "</button></div>") +
    stn(3, S3, '<svg class="dp-svg dp-ssvg" id="dp-c3" viewBox="0 0 420 300" role="img" aria-label="' + MV.esc(S3.fig) + '" focusable="false"></svg>' + presetHTML(PRE_TXT, "c"));
  var va = view3d($("#dp-a3", host)), vc = view3d($("#dp-c3", host));
  function steps(n, list, i){
    $("#dp-l" + n, host).innerHTML = list.slice(0, i + 1).map(function(s, j){ return '<li class="' + (j === i ? "dp-on" : "") + '">' + MV.md(s) + "</li>"; }).join("");
  }
  // Station 1: the foot in R³
  var P1 = [5, -1, 1], F1 = [3, 1, 0];
  function r1(i){
    steps(1, S1.steps, i);
    var it = [{ k:"line", p0:L3.r0, m:L3.m, color:"--pen", w:3, label:"L" }, { k:"arrow", a:L3.r0, b:add(L3.r0, L3.m), color:"--pen", w:3, label:"m⃗" }];
    if (i < 3) {
      it.push({ k:"seg", a:P1, b:L3.r0, color:"--ink-2", w:2, dash:"6 5" });
      it.push({ k:"pt", p:L3.r0, color:"--ink-2", r:5, open:true, label:"F (t = 0)", ldx:-70, ldy:16 });
    } else {
      it.push({ k:"seg", a:P1, b:F1, color:"--ink", w:3.2, label:"3", ui:true });
      it.push({ k:"ra", at:F1, u:L3.m, v:sub(P1, F1), size:0.6 });
      it.push({ k:"pt", p:F1, color:"--ink", r:5.5, label:"F(3, 1, 0)", ldx:-76, ldy:16 });
    }
    it.push({ k:"pt", p:P1, color:"--ink", r:6, label:"P(5, −1, 1)" });
    va.draw({ R:6, items:it, describe:S1.fig + (i < 3 ? " A sample point F at t = 0 is joined to P by a dashed segment." : " The foot F(3, 1, 0) is marked with a right angle; |PF| = 3.") });
  }
  MV.player($("#dp-pl1", host), { count:S1.steps.length, render:r1, interval:1800 });

  // Station 2: parallel lines in R²
  var VB = { xmin:-7, xmax:9, ymin:-6.5, ymax:5.5 }, pb = new MV.Plot($("#dp-b2", host), VB), i2 = 0;
  function draw2(){
    var ink = css("--ink"), pen = css("--pen"), f3 = css("--f3"), segs = [{ x1:-7, y1:8.25, x2:9, y2:-3.75, color:pen, width:3 }, { x1:-7, y1:3.25, x2:9, y2:-8.75, color:f3, width:3 }];
    if (i2 >= 1) segs.push({ x1:4, y1:0, x2:1.6, y2:-3.2, color:ink, width:3 });
    pb.draw({ view:VB, equal:true, xTicks:{ step:2 }, yTicks:{ step:2 }, segments:segs, points:[{ x:4, y:0, r:6, color:ink }].concat(i2 >= 1 ? [{ x:1.6, y:-3.2, r:4.5, color:ink }] : []),
      after:function(ctx, p){
        bgText(ctx, "3x + 4y − 12 = 0", p.X(-3.2), p.Y(5.4) - 16, "left", pen, mfont(14));
        bgText(ctx, S.alt ? "6x + 8y + 16 = 0" : "3x + 4y + 8 = 0", p.X(-6.6), p.Y(2.95) + 20, "left", f3, mfont(14));
        bgText(ctx, "(4, 0)", p.X(4) + 12, p.Y(0) - 12, "left", ink, ui(13, 700));
        if (i2 >= 1) { raMark(ctx, p, [1.6, -3.2], [4, -3], [3, 4], 10, ink); bgText(ctx, "4", p.X(2.8) + 14, p.Y(-1.6), "left", ink, ui(14, 700)); }
      },
      describe:"Two parallel lines, 3x + 4y − 12 = 0 and " + (S.alt ? "6x + 8y + 16 = 0" : "3x + 4y + 8 = 0") + ", with the point (4, 0) on the first." + (i2 >= 1 ? " A perpendicular segment of length 4 joins (4, 0) to (1.6, −3.2) on the second line." : "") });
  }
  pb.render = draw2;
  function r2(i){ i2 = i; steps(2, S.alt ? S2.stepsAlt : S2.steps, i); draw2(); }
  var pl2 = MV.player($("#dp-pl2", host), { count:S2.steps.length, render:r2, interval:1800 });

  // Station 3: parallel lines in R³
  var V = [2, -2, 1], P3 = [5, -1, 1];
  function r3(i){
    steps(3, S3.steps, i);
    var it = [{ k:"line", p0:L3.r0, m:L3.m, color:"--pen", w:3, label:"t-line", lt:0.12 }, { k:"line", p0:P3, m:L3.m, color:"--f3", w:3, label:"s-line", lt:0.12 }];
    if (i >= 1) {
      it.push({ k:"seg", a:P3, b:F1, color:"--ink", w:3.2, label:"3", ui:true }, { k:"ra", at:F1, u:L3.m, v:V, size:0.6 });
      it.push({ k:"pt", p:P3, color:"--f3", r:5.5, label:"(5, −1, 1)" }, { k:"pt", p:F1, color:"--ink", r:4.5 });
    }
    if (i >= 2) {
      var a = add(L3.r0, scl(L3.m, -2)), b = add(L3.r0, scl(L3.m, 2));
      it.push({ k:"poly", pts:[a, b, add(b, V), add(a, V)], color:"--f3", alpha:0.12 });
      [-2, -1, 0, 2].forEach(function(t){ var q = add(L3.r0, scl(L3.m, t)); it.push({ k:"seg", a:q, b:add(q, V), color:"--ink", w:2 }); });
    }
    vc.draw({ R:6, items:it, describe:S3.fig + (i >= 1 ? " The perpendicular from (5, −1, 1) to the first line has length 3." : "") + (i >= 2 ? " A strip of perpendicular segments joins the lines; every one has length 3." : "") });
  }
  MV.player($("#dp-pl3", host), { count:S3.steps.length, render:r3, interval:1800 });

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pre) { var st = b.closest(".dp-st"); (st && st.id === "dp-st3" ? vc : va).preset(b.dataset.pre); return; }
    if (b.dataset.alt) { S.alt = !S.alt; api.save(); b.setAttribute("aria-pressed", S.alt); r2(pl2.get()); }
  });
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Beyond the formula (@component V8 boxFrame: a frame of text pieces and exact-number boxes;
// boxes take whole numbers, fractions or roots via MV.parseNum; answer {k:value} or {set:[…]} for order-free pairs;
// named wrong states {when:{k:v}}, {set:[…]}, {has:[…]}; first-try scoring with three-level help) ----------
function beyondAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function keys(it){ return it.parts.filter(function(p){ return typeof p !== "string"; }).map(function(p){ return p.k; }); }
  host.innerHTML = '<p class="how">' + MV.md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q dp-bq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") +
      '</div><div class="dp-frame"></div><div class="dp-bcl"></div></div>';
  }).join("");
  function frame(it){
    var x = ist(it.id), last = "";
    return it.parts.map(function(p, j){
      if (typeof p === "string") { last = MV.plain(MV.md(p)); return '<span class="dp-ft">' + MV.md(p) + "</span>"; }
      var lab = MV.plain(MV.md(it.prompt)).slice(0, 60) + ": " + (last || "box") + " (box " + (keys(it).indexOf(p.k) + 1) + ")";
      return '<input class="numin short dp-in" data-bx="' + it.id + "_" + p.k + '" data-k="bx' + it.id + p.k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(lab) + '" value="' + MV.esc(x.v[p.k] || "") + '"' + (x.solved ? " disabled" : "") + ">";
    }).join(" ");
  }
  function paint(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"]', host), fr = $(".dp-frame", el), cl = $(".dp-bcl", el), h = "";
    MV.keepFocus(fr, function(){ fr.innerHTML = frame(it); });
    if (x.solved) h = MV.fbHTML("good", "<strong>✓ Correct: " + MV.md(it.display) + ".</strong> " + MV.md(it.why || ""));
    else {
      h = '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" +
        MV.hintsHTML((it.hints || []).map(function(s){ return MV.md(s); }), x.hint);
      if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    }
    MV.keepFocus(cl, function(){ cl.innerHTML = h; });
  }
  function judge(it){
    var x = ist(it.id), ks = keys(it), vals = {}, arr = [];
    for (var i = 0; i < ks.length; i++) {
      var raw = String(x.v[ks[i]] || "").trim(); if (!raw) return { err:"fill" };
      var r = MV.parseNum(raw); if (!r || r.length !== 1) return { err:"err" };
      vals[ks[i]] = r[0]; arr.push(r[0]);
    }
    var ans = MV.ans(it), ok = ans.set ? MV.sameNums(arr, ans.set, 1e-9) : ks.every(function(k){ return near(vals[k], ans[k]); });
    if (ok) return { ok:true };
    var w = (it.wrong || []).filter(function(z){
      if (z.set) return MV.sameNums(arr, z.set, 1e-9);
      if (z.has) return z.has.every(function(h){ return arr.some(function(v){ return near(v, h); }); });
      if (z.when) return Object.keys(z.when).every(function(k){ return vals[k] != null && near(vals[k], z.when[k]); });
      return false;
    })[0];
    return { ok:false, fb:w ? w.fb : (it.general || TX.general) };
  }
  a.items.forEach(paint);
  host.addEventListener("input", function(e){
    var d = e.target.dataset || {}; if (!d.bx) return;
    var cut = d.bx.lastIndexOf("_"), id = d.bx.slice(0, cut), k = d.bx.slice(cut + 1);
    ist(id).v[k] = e.target.value; api.save();
  });
  host.addEventListener("keydown", function(e){
    var d = e.target.dataset || {}; if (e.key !== "Enter" || !d.bx) return;
    e.preventDefault(); var id = d.bx.slice(0, d.bx.lastIndexOf("_")), b = $('[data-k="' + id + 'chk"]', host); if (b) b.click();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-q]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(it); return; }
    if (b.dataset.act === "check") {
      var r = judge(it);
      if (r.err) msgs[it.id] = { bad:false, html:TX[r.err] };
      else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + MV.md(r.fb) + " Try again." }; }
      api.save(); paint(it); MV.focusFb(box);
    }
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal || a.goal)); }); return g; }
  };
}

// =====================================================================================================================
// ---------- Performance task: Five from P (whole-number A, B, C; live graph, distances and an optional circle) ----------
function coefTerm(c, v, first){
  if (c === 0) return "";
  var a = Math.abs(c), s = (a === 1 && v ? "" : a) + v;
  return first ? (c < 0 ? "-" : "") + s : (c < 0 ? " - " : " + ") + s;
}
function lineSrc(A, B, C){
  var s = coefTerm(A, "x", true); s += coefTerm(B, "y", !s); s += coefTerm(C, "", !s);
  return (s || "0") + " = 0";
}
var task = (function(){
  var api, plot, RNG = { A:[-5, 5], B:[-5, 5], C:[-70, 70] };
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= RNG[k][0] && v <= RNG[k][1] ? v : null; }
  function read(){ var A = gi("A"), B = gi("B"), C = gi("C"); return { A:A, B:B, C:C, valid:A !== null && B !== null && C !== null && (A !== 0 || B !== 0) }; }
  function checks(D){
    if (!D.valid) return [false, false, false];
    var S2 = D.A * D.A + D.B * D.B, N = 3 * D.A + 7 * D.B + D.C;
    return [N * N === 25 * S2, D.C * D.C <= 9 * S2, D.A !== 0 && D.B !== 0];
  }
  function distSrc(N, S2){
    var a = Math.abs(N), v = a / Math.sqrt(S2);
    if (isSq(S2)) { var q = Math.round(Math.sqrt(S2)), f = fracSrc(a, q); return m(a + "/" + q) + (f !== a + "/" + q ? " = " + m(f) : "") + (Number.isInteger(a / q) ? "" : " ≈ " + fx(v, 2)); }
    return m(a + "/√" + S2) + " ≈ " + fx(v, 2);
  }
  function preview(){
    var D = read(), Lb = api.content.labels, rd = $("#fp-read"), V = { xmin:-9, xmax:15, ymin:-5, ymax:13 }, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen");
    var circ = !!api.S.circle;
    function circle(ctx, p){
      if (!circ) return;
      ctx.save(); ctx.strokeStyle = ink2; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.arc(p.X(3), p.Y(7), Math.abs(p.X(8) - p.X(3)), 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
    }
    var base = [{ x:3, y:7, r:6, color:ink }, { x:0, y:0, r:5, color:ink }];
    function marks(ctx, p){ bgText(ctx, "P(3, 7)", p.X(3) + 12, p.Y(7) - 12, "left", ink, ui(13, 700)); bgText(ctx, "O", p.X(0) - 10, p.Y(0) + 14, "right", ink, ui(13, 700)); }
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + MV.md(Lb.invalid) + "</p>";
      plot.draw({ view:V, equal:true, xTicks:{ step:2 }, yTicks:{ step:2 }, points:base, after:function(ctx, p){ circle(ctx, p); marks(ctx, p); }, describe:"P(3, 7) and the origin; no line yet: choose A, B and C." });
      return;
    }
    var A = D.A, B = D.B, C = D.C, S2 = A * A + B * B, N = 3 * A + 7 * B + C, seg;
    if (B !== 0) seg = { x1:-30, y1:(-C + 30 * A) / B, x2:40, y2:(-C - 40 * A) / B };
    else seg = { x1:-C / A, y1:-30, x2:-C / A, y2:40 };
    var n = [A, B], fP = sub([3, 7], scl(n, N / S2)), fO = scl(n, -C / S2);
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML([[Lb.line, m(lineSrc(A, B, C))], [Lb.dP, m("|3A + 7B + C|/√{A^2 + B^2}") + " = " + distSrc(N, S2)], [Lb.dO, m("|C|/√{A^2 + B^2}") + " = " + distSrc(C, S2)]]) + "</dl>";
    plot.draw({ view:V, equal:true, xTicks:{ step:2 }, yTicks:{ step:2 },
      segments:[{ x1:seg.x1, y1:seg.y1, x2:seg.x2, y2:seg.y2, color:pen, width:3 }, { x1:3, y1:7, x2:fP[0], y2:fP[1], color:ink, width:2, dash:[6, 5] }, { x1:0, y1:0, x2:fO[0], y2:fO[1], color:ink2, width:2, dash:[3, 4] }],
      points:base, after:function(ctx, p){ circle(ctx, p); marks(ctx, p); },
      describe:"Line ℓ: " + MV.plain(m(lineSrc(A, B, C))) + ". It is about " + num(Math.abs(N) / Math.sqrt(S2), 2) + " units from P(3, 7) and " + num(Math.abs(C) / Math.sqrt(S2), 2) + " units from the origin." + (circ ? " The circle of radius 5 around P is shown." : "") });
  }
  function stepper(k, range){
    var Lb = api.content.labels;
    return '<div class="fs-step dp-stp"><label for="fp-' + k + '"><span class="m">' + MV.md(Lb[k]) + '</span> <span class="tiny muted">' + range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="fp' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="fp-' + k + '" data-tk="' + k + '" type="number" min="' + RNG[k][0] + '" max="' + RNG[k][1] + '" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="fp' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var Lb = a.content.labels;
      if (a.S.A == null) { a.S.A = "1"; a.S.B = "1"; a.S.C = "0"; }
      inp.innerHTML = '<div class="fs-in dp-fin"><p class="tiny" style="font-weight:700;margin:0">' + m("Ax + By + C = 0") + "</p>" + stepper("A", Lb.rangeAB) + stepper("B", Lb.rangeAB) + stepper("C", Lb.rangeC) +
        '<div class="q-actions"><button type="button" class="btn ghost sm dp-tg" data-circ="1" data-k="fpcirc" aria-pressed="' + !!a.S.circle + '">' + Lb.circle + "</button></div></div>";
      pv.innerHTML = '<div id="fp-read" aria-live="polite"></div><p class="tiny">' + MV.md(Lb.graph) + '</p><div class="plot-wrap"><canvas class="plot" id="fp-plot" role="img" aria-label="Graph of the line"></canvas></div>';
      plot = new MV.Plot($("#fp-plot"), { xmin:-9, xmax:15, ymin:-5, ymax:13 }); plot.render = preview;
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.circ) { a.S.circle = !a.S.circle; b.setAttribute("aria-pressed", !!a.S.circle); a.save(); preview(); return; }
        if (!b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        var nv = clamp(cur + +b.dataset.dir, RNG[k][0], RNG[k][1]);
        a.S[k] = String(nv); $("#fp-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : MV.md(api.content.labels.invalid); },
    checks:checks,
    key:function(D){
      var g = gcd(gcd(D.A, D.B), D.C) || 1, A = D.A / g, B = D.B / g, C = D.C / g;
      if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; C = -C; }
      return A + "|" + B + "|" + C;
    },
    label:function(k){ var s = k.split("|").map(Number); return m(lineSrc(s[0], s[1], s[2])); },
    text:function(k){ var s = k.split("|").map(Number); return MV.plain(m(lineSrc(s[0], s[1], s[2]))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ beyond:beyondAct },
  task:task
});

})();
