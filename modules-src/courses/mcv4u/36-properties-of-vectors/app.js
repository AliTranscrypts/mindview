// MCV4U 36 Properties of Vectors: hero (u then v and v then u close a parallelogram on one tip; then u − v and v − u point
// opposite ways), Property tester (Explore: V3 2D vector board with seven property modes, k/m scalars, Diagram/Numbers view,
// magnitude ring and meter), Simplify and solve (Part 3: name-the-property lines, N15 move chooser, route builder in a
// parallelogram), Simplify and solve set (Practice 2: V8 coefficient boxes □a⃗ + □b⃗) and the "Close the triangle" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function mv(s){ return MV.m(String(s).replace(/~([A-Za-z]+)/g, "vec{$1}")); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }

// =====================================================================================================================
// @component V3 vectorBoard — 2D vector board (self-contained; MCV4U 33/34 had no board yet). Vector maths on [x, y]
// pairs; exact lengths as simplified radicals (halves allowed); canvas arrows with partial drawing (frac), perpendicular
// pixel offsets for overlapping arrows, labels with over-arrows (vlab "~u+~v"), zero-vector dot. Colours: u --pen,
// v --f3, w --f5, results --ink 3.6 px, gap arrow --ink-2 dashed. Draggable tips via MV.drag (integer grid steps).
var O = [0, 0];
function add(a, b){ return [a[0] + b[0], a[1] + b[1]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1]]; }
function scl(k, a){ return [k * a[0], k * a[1]]; }
function eqv(a, b){ return Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9; }
function len(a){ return Math.hypot(a[0], a[1]); }
function cross(a, b){ return a[0] * b[1] - a[1] * b[0]; }
function fN(x){ var r = Math.round(x * 1000) / 1000; if (Math.abs(r) < 1e-9) r = 0; return String(r).replace("-", MINUS); }
function onHalf(a){ return a.every(function(x){ return Math.abs(2 * x - Math.round(2 * x)) < 1e-9; }); }
function vt(a){ return (onHalf(a) ? "" : "≈ ") + "(" + fN(a[0]) + ", " + fN(a[1]) + ")"; }
function simp(n){ var c = 1, r = n; for (var f = 2; f * f <= r; f++) while (r % (f * f) === 0) { r /= f * f; c *= f; } return [c, r]; }
function lenSrc(a){
  if (!onHalf(a)) return null;
  var N4 = Math.round(4 * (a[0] * a[0] + a[1] * a[1])); if (N4 === 0) return "0";
  var s = simp(N4), c = s[0], r = s[1];
  if (r === 1) return fN(c / 2);
  if (c % 2 === 0) return (c / 2 === 1 ? "" : c / 2) + "√" + r;
  return (c === 1 ? "" : c) + "√" + r + "/2";
}
function lenHTML(a){ var s = lenSrc(a), d = len(a); if (s === null) return "≈ " + num(d, 2); return m(s) + (/√/.test(s) ? " ≈ " + num(d, 2) : ""); }
function stepsTxt(a){
  var x = Math.round(a[0] * 1000) / 1000, y = Math.round(a[1] * 1000) / 1000;
  return (x === 0 ? "0 right" : fN(Math.abs(x)) + (x > 0 ? " right" : " left")) + ", " + (y === 0 ? "0 up" : fN(Math.abs(y)) + (y > 0 ? " up" : " down"));
}
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mf(px, it){ return (it ? "italic " : "") + "600 " + px + "px " + (css("--font-math") || "serif"); }
// arrow from data point A to B; o = {color, w, dash, off (px, perpendicular), frac (0..1), alpha}
function arrow(ctx, p, A, B, o){
  var X1 = p.X(A[0]), Y1 = p.Y(A[1]), X2 = p.X(B[0]), Y2 = p.Y(B[1]), dx = X2 - X1, dy = Y2 - Y1, L = Math.hypot(dx, dy);
  var f = o.frac == null ? 1 : o.frac; if (L < 1 || f <= 0) return null;
  var ux = dx / L, uy = dy / L, nx = -uy, ny = ux, off = o.off || 0;
  X1 += nx * off; Y1 += ny * off; X2 = X1 + dx * f; Y2 = Y1 + dy * f;
  var w = o.w || 2.5, hl = Math.min(8 + w * 2, L * f * 0.6), hw = hl * 0.55;
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.strokeStyle = o.color; ctx.fillStyle = o.color; ctx.lineWidth = w; ctx.lineCap = "round";
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(X1, Y1); ctx.lineTo(X2 - ux * hl * 0.7, Y2 - uy * hl * 0.7); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(X2, Y2); ctx.lineTo(X2 - ux * hl + nx * hw, Y2 - uy * hl + ny * hw); ctx.lineTo(X2 - ux * hl - nx * hw, Y2 - uy * hl - ny * hw); ctx.closePath(); ctx.fill();
  ctx.restore();
  return { mx:(X1 + X2) / 2, my:(Y1 + Y2) / 2, nx:nx, ny:ny, L:L * f, X2:X2, Y2:Y2 };
}
// label with over-arrows: "~u+~v" (vector letters), "k(~u+~v)" (k, m italic scalars), "~0" for the zero vector
function vlab(ctx, spec, X, Y, color, o){
  o = o || {}; var px = o.px || 15, toks = [], i = 0, W = 0;
  while (i < spec.length) { var c = spec[i]; if (c === "~") { toks.push({ t:spec[i + 1], v:true }); i += 2; continue; } toks.push({ t:c, it:/[a-zA-Z]/.test(c) }); i++; }
  ctx.save();
  toks.forEach(function(t){ ctx.font = mf(px, t.v || t.it); t.pad = /[+−=≠]/.test(t.t) ? 3 : 0; t.w = ctx.measureText(t.t).width + 2 * t.pad; W += t.w; });
  var al = o.align || "center", x = al === "center" ? X - W / 2 : al === "right" ? X - W : X;
  if (o.bg !== false) { ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.86; ctx.fillRect(x - 3, Y - px * 0.95, W + 6, px * 1.75); ctx.globalAlpha = 1; }
  ctx.fillStyle = color; ctx.strokeStyle = color; ctx.textBaseline = "middle"; ctx.textAlign = "left";
  toks.forEach(function(t){
    ctx.font = mf(px, t.v || t.it); ctx.fillText(t.t, x + t.pad, Y);
    if (t.v) { var ay = Y - px * 0.74, a1 = x + 1.5, a2 = x + t.w + 0.5; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(a1, ay); ctx.lineTo(a2 - 2, ay); ctx.stroke(); ctx.beginPath(); ctx.moveTo(a2 + 0.5, ay); ctx.lineTo(a2 - 3.5, ay - 2.6); ctx.lineTo(a2 - 3.5, ay + 2.6); ctx.closePath(); ctx.fill(); }
    x += t.w;
  });
  ctx.restore();
  return W;
}
function txt(ctx, s, X, Y, color, align, font){
  ctx.save(); ctx.font = font || ui(13, 700); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(s).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.86; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(s, X, Y); ctx.restore();
}
// draw a list of scene arrows {A, B, c (token), w, dash, off, lab, alpha} with drawing progress prog (0..1)
function drawArrows(ctx, p, list, prog, centre){
  var N = list.length, cx = p.X(centre[0]), cy = p.Y(centre[1]), labs = [];
  list.forEach(function(a, i){
    var f = prog >= 1 ? 1 : clamp(prog * N - i, 0, 1);
    var r = arrow(ctx, p, a.A, a.B, { color:css(a.c), w:a.w, dash:a.dash, off:a.off, frac:f, alpha:a.alpha });
    if (r && f >= 1 && a.lab && r.L > 22) labs.push([a, r]);
  });
  labs.forEach(function(q){
    var a = q[0], r = q[1], d = a.ld || 17, t = a.lt == null ? 0.5 : a.lt, side;
    var bx = r.X2 - (r.X2 - r.mx) * 2, by = r.Y2 - (r.Y2 - r.my) * 2, X = bx + (r.X2 - bx) * t, Y = by + (r.Y2 - by) * t;
    if (a.off) side = a.off > 0 ? 1 : -1;
    else side = Math.hypot(X + r.nx * d - cx, Y + r.ny * d - cy) >= Math.hypot(X - r.nx * d - cx, Y - r.ny * d - cy) ? 1 : -1;
    vlab(ctx, a.lab, X + side * r.nx * d, Y + side * r.ny * d, css(a.c === "--ink-2" ? "--ink" : a.c), { px:a.px || 15 });
  });
}
function zeroDot(ctx, p, at, txtS){
  var X = p.X(at[0]), Y = p.Y(at[1]);
  ctx.save(); ctx.fillStyle = css("--ink"); ctx.beginPath(); ctx.arc(X, Y, 6.5, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
  var w = vlab(ctx, "~0", X + 12, Y - 18, css("--ink"), { align:"left" });
  if (txtS) txt(ctx, txtS, X + 18 + w, Y - 18, css("--ink"), "left", ui(12, 700));
}
// ------------------------------------------------------ end of V3 vectorBoard (helpers) ---------------------------------

// =====================================================================================================================
// ---------- Hero ----------
function hero(f){
  var c = f.canvas; if (!c) return;
  var V = { xmin:-1.2, xmax:6.4, ymin:-0.9, ymax:4.6 }, p = new MV.Plot(c, V, { equal:true }), st = { t:0 };
  var u = [4, 1], v = [1, 3], s = add(u, v), D = [7, 6];
  var L = [
    { A:O, B:u, c:"--pen", w:3.2, lab:"~u" }, { A:O, B:v, c:"--f3", w:3.2, lab:"~v" },
    { A:u, B:s, c:"--f3", w:3.2, lab:"~v" }, { A:v, B:s, c:"--pen", w:3.2, dash:D, lab:"~u" },
    { A:O, B:s, c:"--ink", w:3.6, lab:"~u+~v", lt:0.62 },
    { A:v, B:u, c:"--ink", w:3.2, off:-5, lab:"~u−~v", lt:0.3 }, { A:u, B:v, c:"--ink", w:3.2, dash:D, off:5, lab:"~v−~u", lt:0.3 }];
  function draw(){
    var t = st.t, N = L.length;
    p.draw({ view:V, equal:true, xTicks:{ step:1 }, yTicks:{ step:1 }, ticks:false,
      after:function(ctx, P){
        if (t >= 4) { ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.globalAlpha = 0.9; ctx.beginPath(); [O, u, s, v].forEach(function(q, i){ ctx[i ? "lineTo" : "moveTo"](P.X(q[0]), P.Y(q[1])); }); ctx.closePath(); ctx.fill(); ctx.restore(); }
        drawArrows(ctx, P, L, t / N, [2.5, 2]);
        if (t >= 5) txt(ctx, "same vector", P.X(s[0]) - 6, P.Y(s[1]) - 16, css("--ink"), "right");
        if (t >= 7) txt(ctx, "not the same", P.X(3.3), P.Y(0.2), css("--ink"), "left");
      },
      describe:"u (blue) and v (teal) from one point. u then v (solid) and v then u (dashed) close a parallelogram at one tip: u + v is the same vector either way. The other diagonal shows u − v and v − u: equal lengths, opposite directions, not the same." });
    if (f.cap) f.cap.innerHTML = t >= 7 ? mv("~u + ~v = ~v + ~u") + ", but " + mv("~u - ~v") + " and " + mv("~v - ~u") + " point opposite ways." :
      t >= 5 ? "Both paths end at one tip: " + mv("~u + ~v = ~v + ~u") + "." : "Path 1: " + mv("~u") + " then " + mv("~v") + ". Path 2: " + mv("~v") + " then " + mv("~u") + ".";
  }
  p.render = draw;
  if (MV.reduceMotion) { st.t = L.length; draw(); return; }
  draw();
  function go(a, b, dur, cb){ MV.tween({ dur:dur, ease:function(x){ return x; }, step:function(x){ st.t = a + (b - a) * x; draw(); }, done:function(){ st.t = b; draw(); if (cb) cb(); } }); }
  MV.wait(600, function(){ go(0, 2, 1400, function(){ MV.wait(400, function(){ go(2, 4, 1600, function(){ MV.wait(500, function(){ go(4, 5, 900, function(){ MV.wait(1300, function(){ go(5, 7, 1500); }); }); }); }); }); }); });
}

// =====================================================================================================================
// ---------- Explore: Property tester ----------
var MODES = ["comm", "assoc", "zero", "distV", "distS", "sub", "mag"];
function okVec(a){ return Array.isArray(a) && a.length === 2 && a.every(function(x){ return Number.isInteger(x) && x >= -5 && x <= 5; }); }
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, R = T.rows;
  if (MODES.indexOf(S.mode) < 0) S.mode = "comm";
  if (!okVec(S.u)) S.u = [3, 1]; if (!okVec(S.v)) S.v = [-1, 2]; if (!okVec(S.w)) S.w = [2, -2];
  if (typeof S.k !== "number" || S.k < -3 || S.k > 3) S.k = 2;
  if (typeof S.m !== "number" || S.m < -3 || S.m > 3) S.m = 1;
  if (S.view !== "num") S.view = "dia";
  if (S.subv !== "br") S.subv = "order";
  if (typeof S.vAng !== "number" || typeof S.vLen !== "number" || S.mode !== "mag") S.vAng = null;
  var busy = false, prog = 1, stopA = null, drag = null, frozen = null, SC = null;
  var modeBtns = C.modes.map(function(o){ return '<button type="button" class="chip pv-mode" data-mode="' + o.id + '" data-k="pvm' + o.id + '" aria-pressed="false">' + MV.md(o.t) + "</button>"; }).join("");
  function slider(id, label, col, note){
    return '<label class="slider pv-sl" id="pv-sl-' + id + '"><span class="slider-top"><span>' + MV.md(label) + '</span><output id="pv-' + id + '-out" style="color:var(' + col + ')"></output></span>' +
      '<input type="range" id="pv-' + id + '" data-sc="' + id + '" min="-3" max="3" step="0.5" style="accent-color:var(' + col + ')" aria-label="Scalar ' + id + '"></label>' + (note ? '<p class="tiny muted pv-knote" id="pv-' + id + '-note">' + MV.md(note) + "</p>" : "");
  }
  host.innerHTML = '<div class="pv-ex">' +
    '<div class="pv-modes" role="group" aria-label="' + MV.esc(T.modes) + '">' + modeBtns + "</div>" +
    '<div class="pv-cols"><div class="pv-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap" id="pv-bwrap"><canvas class="plot square" id="pv-board" role="img" aria-label="Vector board"></canvas></div>' +
    '<div id="pv-num" class="pv-num" hidden></div><div id="pv-meter" class="pv-meter" aria-live="polite"></div>' +
    '<p class="tiny muted pv-order" id="pv-order"></p><p class="tiny muted">' + MV.md(T.key) + " " + MV.md(T.dragNote) + "</p></div>" +
    '<div class="pv-side"><div id="pv-viewseg"></div><div id="pv-subseg"></div>' +
    slider("k", T.kLabel, "--acol", T.kNote) + slider("m", T.mLabel, "--ink") +
    '<div class="pv-turn" id="pv-turn"><p class="tiny" style="font-weight:700;margin:0 0 4px">' + MV.md(T.turn) + '</p><button type="button" class="btn ghost sm" data-turn="15" data-k="pvtl">' + T.turnL + '</button> <button type="button" class="btn ghost sm" data-turn="-15" data-k="pvtr">' + T.turnR + "</button></div>" +
    '<dl class="read pv-read" id="pv-read" aria-live="polite"></dl>' +
    '<div class="pv-setups"><p class="tiny" style="font-weight:700;margin:0 0 4px">' + T.setups + '</p><div class="chips">' +
    [1, 2, 3].map(function(i){ return '<button type="button" class="btn ghost sm" data-setup="' + i + '" data-k="pvsu' + i + '">' + T.setup + " " + i + "</button>"; }).join(" ") + "</div></div>" +
    "</div></div></div>";
  var plot = new MV.Plot($("#pv-board", host), { xmin:-6, xmax:6, ymin:-6, ymax:6 }, { equal:true });
  plot.render = draw;
  var viewSeg = MV.seg($("#pv-viewseg", host), { label:T.view, options:[{ id:"dia", t:T.diagram }, { id:"num", t:T.numbers }], value:S.view, onChange:function(id){ S.view = id; paintAll(); api.save(); } });
  var subSeg = MV.seg($("#pv-subseg", host), { label:T.subView, options:[{ id:"order", t:MV.md(T.subOrder) }, { id:"br", t:MV.md(T.subBr) }], value:S.subv, onChange:function(id){ S.subv = id; build(); animate(); api.save(); MV.changed(); } });

  function V(){ return S.vAng == null ? S.v : [S.vLen * Math.cos(S.vAng * Math.PI / 180), S.vLen * Math.sin(S.vAng * Math.PI / 180)]; }
  function snapV(){ if (S.vAng == null) return; var v = V(); S.v = [clamp(Math.round(v[0]), -5, 5), clamp(Math.round(v[1]), -5, 5)]; S.vAng = null; }

  // ---- the construction for the current mode ----
  function build(){
    var u = S.u, v = V(), w = S.w, k = S.k, mm = S.m, D = [7, 6], A = [], sc = { arrows:A, tails:{}, gap:false };
    function ar(P, Q, c, o){ o = o || {}; o.A = P; o.B = Q; o.c = c; A.push(o); }
    var uv = add(u, v);
    switch (S.mode) {
      case "comm":
        ar(O, u, "--pen", { w:3, lab:"~u" }); ar(u, uv, "--f3", { w:3, lab:"~v" });
        ar(O, v, "--f3", { w:3, dash:D, lab:"~v" }); ar(v, add(v, u), "--pen", { w:3, dash:D, lab:"~u" });
        ar(O, uv, "--ink", { w:3.6, lab:"~u+~v", lt:0.62 });
        sc.poly = [O, u, uv, v]; sc.L = uv; sc.R = add(v, u); sc.tails = { u:O, v:O };
        sc.order = "`~u` then `~v` (solid); `~v` then `~u` (dashed); then `~u + ~v`."; break;
      case "assoc":
        var uvw = add(uv, w);
        ar(O, u, "--pen", { w:3, lab:"~u" }); ar(u, uv, "--f3", { w:3, lab:"~v" });
        ar(O, uv, "--ink", { w:2, lab:"~u+~v", px:13 }); ar(uv, uvw, "--f5", { w:3, lab:"~w" });
        ar(u, uvw, "--ink", { w:2, dash:D, lab:"~v+~w", px:13 });
        ar(O, uvw, "--ink", { w:3.6, lab:"~u+~v+~w", lt:0.6 });
        sc.L = add(uv, w); sc.R = add(u, add(v, w)); sc.tails = { u:O, v:u, w:uv };
        sc.order = "`~u`, `~v`; then `(~u + ~v)` and `~w`; then `(~v + ~w)` from `~u`’s tip."; break;
      case "zero":
        var ch = add(uv, w);
        ar(O, u, "--pen", { w:3, lab:"~u" }); ar(u, O, "--pen", { w:2.6, dash:D, off:6, lab:"−~u" });
        ar(u, uv, "--f3", { w:3, lab:"~v" }); ar(uv, ch, "--f5", { w:3, lab:"~w" });
        if (!eqv(ch, O)) ar(O, ch, "--ink", { w:3.6, lab:"~u+~v+~w", lt:0.6 });
        sc.L = O; sc.R = O; sc.chain = ch; sc.zero = true; sc.tails = { u:O, v:u, w:uv };
        sc.order = "`~u`, then `-~u` back to the tail; then the chain `~u`, `~v`, `~w`."; break;
      case "distV":
        var ku = scl(k, u), kv = scl(k, v), kuv = scl(k, uv);
        ar(O, u, "--pen", { w:2.2, alpha:0.55, lab:"~u", px:13 }); ar(u, uv, "--f3", { w:2.2, alpha:0.55, lab:"~v", px:13 }); ar(O, uv, "--ink", { w:2, alpha:0.45 });
        ar(O, ku, "--pen", { w:3, dash:D, lab:"k~u" }); ar(ku, kuv, "--f3", { w:3, dash:D, lab:"k~v" });
        ar(O, kuv, "--ink", { w:3.6, lab:"k(~u+~v)", lt:0.62 });
        sc.L = kuv; sc.R = add(ku, kv); sc.tails = { u:O, v:u };
        sc.order = "the triangle `~u`, `~v`, `~u + ~v`; then `k~u` and `k~v` (dashed); then `k(~u + ~v)`."; break;
      case "distS":
        var km = k + mm, kU = scl(k, u);
        ar(O, u, "--pen", { w:2.4, alpha:0.6, lab:"~u", px:13 });
        ar(O, kU, "--pen", { w:3, dash:D, off:8, lab:"k~u" }); ar(kU, add(kU, scl(mm, u)), "--ink-2", { w:3, dash:D, off:8, lab:"m~u" });
        ar(O, scl(km, u), "--ink", { w:3.6, off:-8, lab:"(k+m)~u" });
        sc.L = scl(km, u); sc.R = add(kU, scl(mm, u)); sc.tails = { u:O }; sc.noGapDraw = true;
        sc.order = "`~u`; then `k~u` and `m~u` end to end (dashed); then `(k + m)~u` beside them."; break;
      case "sub":
        var P = sub(u, v);
        if (S.subv === "order") {
          ar(O, u, "--pen", { w:2.6, lab:"~u" }); ar(O, v, "--f3", { w:2.6, lab:"~v" });
          ar(v, u, "--ink", { w:3.6, off:-6, lab:"~u−~v", lt:0.4 }); ar(u, v, "--ink", { w:3.6, dash:D, off:6, lab:"~v−~u", lt:0.4 });
          sc.L = P; sc.R = sub(v, u); sc.tails = { u:O, v:O }; sc.noGapDraw = true; sc.opp = true;
          sc.order = "`~u` and `~v`; then `~u - ~v` from `~v`’s tip to `~u`’s tip; then `~v - ~u` back (dashed).";
        } else {
          ar(O, u, "--pen", { w:2, alpha:0.6, lab:"~u", px:13 }); ar(O, v, "--f3", { w:2, alpha:0.6, lab:"~v", px:13 });
          ar(O, P, "--ink", { w:2, lab:"~u−~v", px:13 });
          ar(P, sub(P, w), "--f5", { w:3, lab:"−~w" }); ar(P, add(P, w), "--f5", { w:3, dash:D, lab:"~w" });
          ar(O, sub(P, w), "--ink", { w:3.6, lab:"(~u−~v)−~w", lt:0.62, px:13 }); ar(O, add(P, w), "--ink", { w:3.6, dash:D, lab:"~u−(~v−~w)", lt:0.62, px:13 });
          sc.L = sub(P, w); sc.R = sub(u, sub(v, w)); sc.tails = { u:O, v:O, w:P };
          sc.order = "`~u - ~v`; then `-~w` (solid) and `+~w` (dashed) from its tip; then both results.";
        }
        break;
      default: // mag
        ar(O, u, "--pen", { w:3, lab:"~u" }); ar(u, uv, "--f3", { w:3, lab:"~v" });
        ar(O, uv, "--ink", { w:3.6, lab:"~u+~v", lt:0.6 });
        sc.ring = { c:u, r:len(v) }; sc.L = uv; sc.R = uv; sc.tails = { u:O, v:u }; sc.mag = true; sc.noGapDraw = true;
        sc.order = "`~u`, then `~v` from its tip, then `~u + ~v`. The ring is the path of `~v`’s tip as it turns.";
    }
    sc.same = eqv(sc.L, sc.R);
    sc.gap = !sc.same && !sc.noGapDraw;
    SC = sc; return sc;
  }
  function bounds(sc){
    var mx = 6;
    sc.arrows.forEach(function(a){ [a.A, a.B].forEach(function(q){ mx = Math.max(mx, Math.abs(q[0]) + 1, Math.abs(q[1]) + 1); }); });
    if (sc.ring) mx = Math.max(mx, Math.abs(sc.ring.c[0]) + sc.ring.r + 1, Math.abs(sc.ring.c[1]) + sc.ring.r + 1);
    mx = Math.ceil(mx);
    if (frozen) mx = Math.max(mx, frozen);
    return mx;
  }
  function describe(sc){
    var u = S.u, v = V(), s = "Vector board, " + C.modes.filter(function(o){ return o.id === S.mode; })[0].t + " mode. u = " + stepsTxt(u) + "; v = " + stepsTxt(v);
    if (["assoc", "zero"].indexOf(S.mode) >= 0 || (S.mode === "sub" && S.subv === "br")) s += "; w = " + stepsTxt(S.w);
    if (S.mode === "distV" || S.mode === "distS") s += "; k = " + fN(S.k) + (S.mode === "distS" ? ", m = " + fN(S.m) : "");
    s += ". Left side = " + stepsTxt(sc.L) + "; right side = " + stepsTxt(sc.R) + "; " + (sc.same ? "both sides equal." : "the sides differ by " + stepsTxt(sub(sc.R, sc.L)) + ".");
    if (sc.zero) s += " u + v + w = " + stepsTxt(sc.chain) + (eqv(sc.chain, O) ? ", the zero vector." : ".");
    return s;
  }
  function draw(){
    var sc = SC || build(), Rr = bounds(sc), st = Rr <= 8 ? 1 : Rr <= 16 ? 2 : 5;
    plot.draw({ view:{ xmin:-Rr, xmax:Rr, ymin:-Rr, ymax:Rr }, equal:true, xTicks:{ step:st }, yTicks:{ step:st },
      after:function(ctx, p){
        var ink = css("--ink"), centre = sc.L ? scl(0.5, sc.L) : O;
        if (sc.poly && prog >= 1 && !eqv(sc.L, O)) { ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.beginPath(); sc.poly.forEach(function(q, i){ ctx[i ? "lineTo" : "moveTo"](p.X(q[0]), p.Y(q[1])); }); ctx.closePath(); ctx.fill(); ctx.restore(); }
        if (sc.ring && sc.ring.r > 0) { ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.arc(p.X(sc.ring.c[0]), p.Y(sc.ring.c[1]), sc.ring.r * (p.X(1) - p.X(0)), 0, 2 * Math.PI); ctx.stroke(); ctx.restore(); }
        drawArrows(ctx, p, sc.arrows, prog, centre);
        if (prog < 1) return;
        if (sc.zero) {
          zeroDot(ctx, p, O, T.zeroDot);
          if (eqv(sc.chain, O)) vlab(ctx, "~u+~v+~w=~0", p.X(0) + 14, p.Y(0) + 24, ink, { align:"left", px:14 });
        } else if (sc.gap) {
          var g = arrow(ctx, p, sc.L, sc.R, { color:css("--ink-2"), w:2, dash:[5, 4] });
          if (g) txt(ctx, vt(sub(sc.R, sc.L)), g.mx + g.nx * 16, g.my + g.ny * 16, css("--ink"), "center");
        } else if (sc.same && !sc.mag && !eqv(sc.L, O)) {
          txt(ctx, "✓ " + T.sameTip, p.X(sc.L[0]) + 12, p.Y(sc.L[1]) - 16, ink, "left");
        } else if (sc.opp && !sc.same) {
          txt(ctx, "opposite directions: not the same", p.X((S.u[0] + V()[0]) / 2), p.Y((S.u[1] + V()[1]) / 2) + 30, ink, "center", ui(12, 700));
        }
        if (sc.same && eqv(sc.L, O) && !sc.zero) zeroDot(ctx, p, O, "");
      },
      describe:describe(sc) });
  }
  // ---- draggable tips ----
  drag = MV.drag(plot, {
    handles:function(){
      if (S.view === "num" || !SC) return [];
      var hs = [], t = SC.tails, v = V();
      [["u", S.u], ["v", v], ["w", S.w]].forEach(function(q){ var tl = t[q[0]]; if (!tl) return; var tip = add(tl, q[1]); hs.push({ id:q[0], x:tip[0], y:tip[1], label:"Tip of vector " + q[0] + ": " + stepsTxt(q[1]) + ". Arrow keys move it one grid step." }); });
      return hs;
    },
    snap:function(x, y){ return [Math.round(x), Math.round(y)]; },
    move:function(id, x, y, how){
      if (busy || !SC) return;
      var tl = SC.tails[id]; if (!tl) return;
      if (id === "v" && S.vAng != null) { S.v = [clamp(Math.round(V()[0]), -5, 5), clamp(Math.round(V()[1]), -5, 5)]; S.vAng = null; }
      var nv = [clamp(Math.round(x - tl[0]), -5, 5), clamp(Math.round(y - tl[1]), -5, 5)];
      if (how === "drag" && !frozen) frozen = bounds(SC);
      if (eqv(nv, S[id])) return;
      S[id] = nv; prog = 1; build(); paintAll(); api.save(); MV.changed();
    },
    end:function(){ frozen = null; draw(); }
  });

  // ---- readouts ----
  function readRows(sc){
    var u = S.u, v = V(), w = S.w, k = S.k, mm = S.m, rows = [], P = sub(u, v), K = '<span class="p-a">' + fN(k) + "</span>";
    function sameRow(){ rows.push([R.same, sc.same ? T.yes : T.no + " " + vt(sub(sc.R, sc.L))]); }
    function lenRow(){ rows.push([R.len, lenHTML(sc.L)]); }
    function brRows(){
      var L2 = sub(P, w), R2 = sub(u, sub(v, w));
      rows.push([mv(R.brL), vt(P) + " − " + vt(w) + " = " + vt(L2)]);
      rows.push([mv(R.brR), vt(u) + " − " + vt(sub(v, w)) + " = " + vt(R2)]);
      rows.push([R.gap, mv("|2~w|") + " = " + lenHTML(sub(R2, L2))]);
    }
    switch (S.mode) {
      case "comm":
        rows.push([R.prop, mv("~u + ~v = ~v + ~u") + ": commutative"]);
        rows.push([R.left, mv("~u + ~v") + " = " + vt(u) + " + " + vt(v) + " = " + vt(sc.L)]);
        rows.push([R.right, mv("~v + ~u") + " = " + vt(v) + " + " + vt(u) + " = " + vt(sc.R)]); sameRow(); lenRow(); break;
      case "assoc":
        rows.push([R.prop, mv("(~u + ~v) + ~w = ~u + (~v + ~w)") + ": associative"]);
        rows.push([R.left, vt(add(u, v)) + " + " + vt(w) + " = " + vt(sc.L)]);
        rows.push([R.right, vt(u) + " + " + vt(add(v, w)) + " = " + vt(sc.R)]); sameRow(); lenRow(); break;
      case "zero":
        rows.push([R.prop, mv("~u + (-~u) = 0⃗") + ": opposites cancel to the zero vector"]);
        rows.push([R.left, vt(u) + " + " + vt(scl(-1, u)) + " = (0, 0)"]);
        rows.push([R.right, m("0⃗") + " = (0, 0): length 0, no direction"]); sameRow();
        rows.push([mv(R.chain), vt(u) + " + " + vt(v) + " + " + vt(w) + " = " + vt(sc.chain) + (eqv(sc.chain, O) ? " = " + m("0⃗") + " ✓" : "")]); break;
      case "distV":
        rows.push([R.prop, mv("@a{k}(~u + ~v) = @a{k}~u + @a{k}~v") + ": distributive over vectors"]);
        rows.push([R.left, K + " × " + vt(add(u, v)) + " = " + vt(sc.L)]);
        rows.push([R.right, vt(scl(k, u)) + " + " + vt(scl(k, v)) + " = " + vt(sc.R)]); sameRow(); lenRow();
        if (S.tc2) rows.push([R.other, S.tc2 === "neg" ? mv("k = -2") + ", " + mv("~v") + " = (−1, −4)" : mv("k = 2") + ", " + mv("~v") + " = (−5, 2)"]);
        break;
      case "distS":
        rows.push([R.prop, mv("(@a{k} + m)~u = @a{k}~u + m~u") + ": distributive over scalars"]);
        rows.push([R.left, "(" + K + " + " + fN(mm) + ") × " + vt(u) + " = " + fN(k + mm) + " × " + vt(u) + " = " + vt(sc.L)]);
        rows.push([R.right, vt(scl(k, u)) + " + " + vt(scl(mm, u)) + " = " + vt(sc.R)]); sameRow(); lenRow(); break;
      case "sub":
        if (S.subv === "order") {
          rows.push([R.prop, mv("~u - ~v") + " and " + mv("~v - ~u") + ": does subtraction commute?"]);
          rows.push([R.left, mv("~u - ~v") + " = " + vt(u) + " − " + vt(v) + " = " + vt(sc.L)]);
          rows.push([R.right, mv("~v - ~u") + " = " + vt(v) + " − " + vt(u) + " = " + vt(sc.R)]); sameRow();
          rows.push(["", mv("~u - ~v = -(~v - ~u)") + " ✓ (same length " + lenHTML(sc.L) + ", opposite directions)"]);
        } else {
          rows.push([R.prop, mv("(~u - ~v) - ~w") + " and " + mv("~u - (~v - ~w)") + ": is subtraction associative?"]);
          rows.push([R.left, vt(P) + " − " + vt(w) + " = " + vt(sc.L)]);
          rows.push([R.right, vt(u) + " − " + vt(sub(v, w)) + " = " + vt(sc.R)]); sameRow(); lenRow();
        }
        if (S.subv === "order") brRows(); else rows.push([R.gap, mv("|2~w|") + " = " + lenHTML(sub(sc.R, sc.L))]);
        break;
      default:
        var a = len(u), b = len(v), sm = len(sc.L), eq = Math.abs(sm - (a + b)) < 1e-9, sA = lenSrc(u), sB = lenSrc(v);
        var sumS = (sA !== null && sB !== null) ? (/√/.test(sA + sB) ? m(sA + " + " + sB) : m(fN(a + b))) + " ≈ " + num(a + b, 2) : "≈ " + num(a + b, 2);
        rows.push([R.prop, mv("|~u + ~v| ≤ |~u| + |~v|") + ": the triangle inequality"]);
        rows.push([R.left, mv("~u + ~v") + " = " + vt(sc.L)]);
        rows.push([R.mag, mv("|~u + ~v|") + " = " + lenHTML(sc.L) + " " + (eq ? "=" : "≤") + " " + mv("|~u| + |~v|") + " = " + sumS + (eq ? " (same direction)" : "")]);
        rows.push(["Range", "from " + mv("||~u| - |~v||") + " ≈ " + num(Math.abs(a - b), 2) + " to " + mv("|~u| + |~v|") + " ≈ " + num(a + b, 2)]);
    }
    return rows;
  }
  function numTable(){
    var u = S.u, v = V(), w = S.w, k = S.k, mm = S.m, Lr, Rr, P = sub(u, v);
    function r(lab, val){ return [mv(lab), typeof val === "string" ? val : vt(val)]; }
    switch (S.mode) {
      case "comm": Lr = [r("~u", u), r("~v", v), r("~u + ~v", add(u, v))]; Rr = [r("~v", v), r("~u", u), r("~v + ~u", add(v, u))]; break;
      case "assoc": Lr = [r("~u + ~v", add(u, v)), r("~w", w), r("(~u + ~v) + ~w", add(add(u, v), w))]; Rr = [r("~u", u), r("~v + ~w", add(v, w)), r("~u + (~v + ~w)", add(u, add(v, w)))]; break;
      case "zero": Lr = [r("~u", u), r("-~u", scl(-1, u)), r("~u + (-~u)", O)]; Rr = [r("0⃗", O)]; break;
      case "distV": Lr = [r("~u + ~v", add(u, v)), r("k(~u + ~v)", scl(k, add(u, v)))]; Rr = [r("k~u", scl(k, u)), r("k~v", scl(k, v)), r("k~u + k~v", add(scl(k, u), scl(k, v)))]; break;
      case "distS": Lr = [r("k + m", fN(k + mm)), r("(k + m)~u", scl(k + mm, u))]; Rr = [r("k~u", scl(k, u)), r("m~u", scl(mm, u)), r("k~u + m~u", add(scl(k, u), scl(mm, u)))]; break;
      case "sub":
        if (S.subv === "order") { Lr = [r("~u", u), r("-~v", scl(-1, v)), r("~u - ~v", P)]; Rr = [r("~v", v), r("-~u", scl(-1, u)), r("~v - ~u", sub(v, u))]; }
        else { Lr = [r("~u - ~v", P), r("-~w", scl(-1, w)), r("(~u - ~v) - ~w", sub(P, w))]; Rr = [r("~v - ~w", sub(v, w)), r("~u - (~v - ~w)", sub(u, sub(v, w)))]; }
        break;
      default: Lr = [r("~u + ~v", add(u, v)), r("|~u + ~v|", lenHTML(add(u, v)))]; Rr = [r("|~u|", lenHTML(u)), r("|~v|", lenHTML(v)), r("|~u| + |~v|", "≈ " + num(len(u) + len(v), 2))];
    }
    var n = Math.max(Lr.length, Rr.length), h = '<div class="tbl-wrap"><table class="pv-tbl"><caption class="vh">Grid steps (right, up) for the left and right sides</caption><thead><tr><th scope="col">' + T.numHead[1] + '</th><th scope="col">' + T.numHead[2] + "</th></tr></thead><tbody>";
    for (var i = 0; i < n; i++) h += "<tr><td>" + (Lr[i] ? Lr[i][0] + " = " + Lr[i][1] : "") + "</td><td>" + (Rr[i] ? Rr[i][0] + " = " + Rr[i][1] : "") + "</td></tr>";
    var sc = SC; h += '</tbody></table></div><p class="tiny" style="margin:6px 0 0"><strong>' + R.same + "</strong> " + (sc.same ? T.yes : T.no + " " + vt(sub(sc.R, sc.L))) + "</p>";
    return h;
  }
  function meter(){
    var el = $("#pv-meter", host); if (S.mode !== "mag") { el.innerHTML = ""; return; }
    var a = len(S.u), b = len(V()), lo = Math.abs(a - b), hi = a + b, cur = len(add(S.u, V())), top = Math.max(hi * 1.12, 1), W = 300;
    function X(x){ return 14 + x / top * (W - 28); }
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' 54" class="pv-msvg" role="img" aria-label="Meter: |u + v| is about ' + num(cur, 2) + ", between " + num(lo, 2) + " and " + num(hi, 2) + '.">' +
      '<line x1="' + X(0) + '" y1="24" x2="' + X(top) + '" y2="24" style="stroke:var(--ink-2);stroke-width:1.5"/>' +
      '<rect x="' + X(lo) + '" y="16" width="' + Math.max(1, X(hi) - X(lo)) + '" height="16" rx="3" style="fill:var(--hi-soft);stroke:var(--ink-2);stroke-width:1"/>' +
      '<text x="' + X(lo) + '" y="48" text-anchor="middle" class="pv-mt">' + num(lo, 2) + '</text><text x="' + X(hi) + '" y="48" text-anchor="middle" class="pv-mt">' + num(hi, 2) + "</text>" +
      '<text x="' + X(0) + '" y="48" text-anchor="middle" class="pv-mt">0</text>' +
      '<polygon points="' + X(cur) + ",15 " + (X(cur) - 6) + ",4 " + (X(cur) + 6) + ',4" style="fill:var(--ink)"/><line x1="' + X(cur) + '" y1="14" x2="' + X(cur) + '" y2="34" style="stroke:var(--ink);stroke-width:3"/></svg>' +
      '<p class="tiny" style="margin:0">' + mv("|~u + ~v|") + " ≈ " + num(cur, 2) + " (range " + num(lo, 2) + " to " + num(hi, 2) + ")</p>";
  }
  function paintAll(){
    var sc = SC || build();
    $$(".pv-mode", host).forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.mode === S.mode)); });
    $("#pv-sl-k", host).hidden = !(S.mode === "distV" || S.mode === "distS"); var kn = $("#pv-k-note", host); if (kn) kn.hidden = $("#pv-sl-k", host).hidden;
    $("#pv-sl-m", host).hidden = S.mode !== "distS";
    $("#pv-turn", host).hidden = S.mode !== "mag";
    $("#pv-subseg", host).hidden = S.mode !== "sub";
    ["k", "m"].forEach(function(id){ $("#pv-" + id, host).value = S[id]; $("#pv-" + id + "-out", host).textContent = fN(S[id]); });
    var numV = S.view === "num";
    $("#pv-bwrap", host).hidden = numV; $("#pv-num", host).hidden = !numV;
    if (numV) $("#pv-num", host).innerHTML = numTable();
    $("#pv-read", host).innerHTML = MV.readoutHTML(readRows(sc));
    $("#pv-order", host).innerHTML = "<strong>" + T.order + "</strong> " + MV.md(sc.order.replace(/~([A-Za-z]+)/g, "vec{$1}"));
    meter();
    if (!numV) draw();
    host.querySelectorAll(".pv-side button, .pv-side input, .pv-modes button").forEach(function(b){ b.disabled = busy; });
  }
  function animate(){
    if (stopA) { stopA(); stopA = null; }
    prog = 0; paintAll();
    stopA = MV.tween({ dur:1500, ease:function(x){ return x; }, step:function(x){ prog = x; draw(); }, done:function(){ stopA = null; prog = 1; draw(); } });
  }
  function setMode(md){ if (S.mode === "mag" && md !== "mag") snapV(); S.mode = md; build(); animate(); api.save(); MV.changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.mode) { if (b.dataset.mode !== S.mode) setMode(b.dataset.mode); return; }
    if (b.dataset.turn) {
      var v = V(); if (S.vAng == null) { S.vLen = len(v); S.vAng = Math.atan2(v[1], v[0]) * 180 / Math.PI; }
      if (S.vLen < 1e-9) return;
      S.vAng = ((S.vAng + +b.dataset.turn) % 360 + 360) % 360;
      var nv = V(); if (Math.abs(nv[0] - Math.round(nv[0])) < 1e-9 && Math.abs(nv[1] - Math.round(nv[1])) < 1e-9) { S.v = [Math.round(nv[0]), Math.round(nv[1])]; S.vAng = null; }
      build(); paintAll(); api.save(); MV.changed(); return;
    }
    if (b.dataset.setup) {
      var i = +b.dataset.setup; snapV(); S.u = [3, 1]; S.v = [-1, 2];
      if (i === 1) { S.mode = "zero"; S.w = [1, -1]; }
      else if (i === 2) { S.mode = "distV"; S.k = 1; }
      else { S.mode = "sub"; S.subv = "br"; S.w = [1, 1]; subSeg.set("br"); }
      S.view = "dia"; viewSeg.set("dia"); build(); animate(); api.save(); MV.changed();
    }
  });
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.sc; if (!id || busy) return;
    S[id] = +e.target.value; prog = 1; build(); paintAll(); api.save(); MV.changed();
  });
  build(); paintAll();

  // ---- challenges ----
  function chal(id, live){
    var M = {}; C.challenges.forEach(function(c){ if (c.id === id) M = c.msgs; });
    var u = S.u, v = V(), w = S.w;
    function fixedUV(){ return eqv(u, [3, 1]) && eqv(v, [-1, 2]) && S.vAng == null; }
    if (id === "tc1") {
      if (S.mode !== "zero") return { ok:false, msg:M.mode };
      if (!fixedUV()) return { ok:false, msg:M.fixed };
      if (eqv(add(add(u, v), w), O)) return { ok:true };
      if (eqv(w, [2, 3])) return { ok:false, msg:M.same };
      if (eqv(w, [-3, -1])) return { ok:false, msg:M.onlyU };
      return { ok:false, msg:M.general };
    }
    if (id === "tc2") {
      if (S.mode !== "distV") return { ok:false, msg:M.mode };
      if (!eqv(u, [3, 1])) return { ok:false, msg:M.fixed };
      if (eqv(scl(S.k, add(u, v)), [-4, 6])) {
        if (!live) { S.tc2 = S.k > 0 ? "neg" : "pos"; api.save(); paintAll(); }
        return { ok:true };
      }
      if (S.k === 2 && eqv(v, [-2, 3])) return { ok:false, msg:M.half };
      if (S.k === 1) return { ok:false, msg:M.k1 };
      return { ok:false, msg:M.general };
    }
    if (S.mode !== "sub") return { ok:false, msg:M.mode };
    if (!fixedUV()) return { ok:false, msg:M.fixed };
    var L2 = w[0] * w[0] + w[1] * w[1];
    if (L2 === 9) return { ok:true };
    if (eqv(w, [3, 3])) return { ok:false, msg:M.w33 };
    if (L2 === 25) return { ok:false, msg:M.w50 };
    if (L2 === 0) return { ok:false, msg:M.zero };
    return { ok:false, msg:M.general };
  }

  // ---- predictions ----
  function lock(on){ busy = on; paintAll(); }
  return {
    predict:{
      start:function(p){
        if (stopA) { stopA(); stopA = null; }
        snapV(); S.view = "dia"; viewSeg.set("dia"); S.u = [3, 1]; S.v = [-1, 2];
        if (p.id === "p1") { S.mode = "comm"; prog = 0; }
        else if (p.id === "p2") { S.mode = "sub"; S.subv = "order"; subSeg.set("order"); prog = 0; }
        else if (p.id === "p3") { S.mode = "distV"; S.k = 1; prog = 1; }
        else { S.mode = "mag"; S.u = [3, 0]; S.v = [4, 0]; S.vLen = 4; S.vAng = 180; prog = 1; }
        build(); lock(true);
      },
      run:function(p, done){
        function fin(){ stopA = null; prog = 1; build(); lock(false); api.save(); MV.changed(); done(); }
        if (p.id === "p1" || p.id === "p2") stopA = MV.tween({ dur:3200, ease:function(x){ return x; }, step:function(x){ prog = x; draw(); }, done:fin });
        else if (p.id === "p3") stopA = MV.tween({ dur:2000, step:function(x){ S.k = 1 + x; build(); paintAll(); }, done:function(){ S.k = 2; fin(); } });
        else stopA = MV.tween({ dur:3600, ease:function(x){ return x; }, step:function(x){ S.vAng = 180 * (1 - x); build(); paintAll(); }, done:function(){ S.vAng = null; S.v = [4, 0]; fin(); } });
      }
    },
    challenge:function(id, opt){ return chal(id, opt && opt.live); }
  };
}
// ------------------------------------------------------------ end of Property tester ------------------------------------

// =====================================================================================================================
// ---------- Part 3: Simplify and solve ----------
// @component N15 moveChooser (station 2) — choose the next legal move on both sides; trap moves get named feedback.
function part3(host, api){
  var S = api.S || {}, C = api.content, T1 = C.st1, T2 = C.st2, T3 = C.st3;
  S.l = Array.isArray(S.l) && S.l.length === 3 ? S.l : [false, false, false];
  S.s2 = S.s2 === 1 || S.s2 === 2 ? S.s2 : 0;
  S.route = Array.isArray(S.route) && S.route[0] === "A" ? S.route : ["A"];
  var lmsg = [null, null, null], m2 = null, p2prog = S.s2 === 2 ? 1 : 0;
  host.innerHTML =
    '<div class="sheet pv-st"><h3>' + T1.title + "</h3><p>" + MV.md(T1.text) + '</p><div class="pv-st1"><div class="pv-lines" id="pv-lines"></div>' +
    '<div class="pv-fig"><div class="plot-wrap"><canvas class="plot" id="pv-s1" role="img" aria-label="' + MV.esc(MV.plain(MV.md(T1.fig))) + '"></canvas></div><p class="tiny muted">' + MV.md(T1.fig) + "</p>" +
    '<details class="alg"><summary>Check it with algebra</summary><ol>' + T1.alg.map(function(s){ return "<li>" + MV.md(s) + "</li>"; }).join("") + "</ol></details></div></div></div>" +
    '<div class="sheet pv-st"><h3>' + MV.md(T2.title) + "</h3><p>" + MV.md(T2.text) + '</p><div class="pv-st1"><div><div class="pv-eqs" id="pv-eqs" aria-live="polite"></div><div class="q-actions pv-moves" id="pv-moves"></div><div id="pv-m2"></div></div>' +
    '<div class="pv-fig"><div class="plot-wrap"><canvas class="plot" id="pv-s2" role="img" aria-label="' + MV.esc(MV.plain(MV.md(T2.fig))) + '"></canvas></div></div></div></div>' +
    '<div class="sheet pv-st"><h3>' + T3.title + "</h3><p>" + MV.md(T3.text) + '</p><div class="pv-st1"><div class="pv-fig" id="pv-s3fig"></div><div><div id="pv-route" aria-live="polite"></div><div class="q-actions" id="pv-rbtns"></div></div></div></div>';
  // ---- station 1 ----
  var p1 = new MV.Plot($("#pv-s1", host), { xmin:-1, xmax:8, ymin:-8, ymax:2 }, { equal:true });
  p1.render = function(){
    var done = S.l.every(Boolean), a = [2, 1], b = [0, 1];
    var orig = [[O, [6, 3]], [[6, 3], [6, -3]], [[6, -3], [2, -5]], [[2, -5], [2, -7]]];
    p1.draw({ view:{ xmin:-1, xmax:8, ymin:-8, ymax:2 }, equal:true, xTicks:{ step:1 }, yTicks:{ step:1 },
      after:function(ctx, p){
        orig.forEach(function(s){ arrow(ctx, p, s[0], s[1], { color:css("--ink-2"), w:2, dash:[5, 4] }); });
        arrow(ctx, p, O, a, { color:css("--pen"), w:3 }); arrow(ctx, p, O, b, { color:css("--f3"), w:3, off:-4 });
        vlab(ctx, "~a", p.X(1.2), p.Y(1.25), css("--pen")); vlab(ctx, "~b", p.X(-0.5), p.Y(0.6), css("--f3"));
        if (done) { arrow(ctx, p, a, [2, -7], { color:css("--ink"), w:3.2 }); vlab(ctx, "~a−8~b", p.X(2) - 8, p.Y(-3), css("--ink"), { align:"right" }); }
        ctx.save(); ctx.fillStyle = css("--ink"); ctx.beginPath(); ctx.arc(p.X(2), p.Y(-7), 6, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
        txt(ctx, "(2, " + MINUS + "7)" + (done ? " same tip ✓" : ""), p.X(2) + 12, p.Y(-7), css("--ink"), "left");
      },
      describe:"a = (2, 1) and b = (0, 1). The original expression 3(a − 2b) − 2(a + b), drawn step by step in dashes, ends at (2, −7)." + (done ? " The simplified a − 8b ends at the same tip." : "") });
  };
  function paint1(){
    var el = $("#pv-lines", host), h = '<p class="pv-eqline">' + MV.md(T1.start) + "</p>";
    T1.lines.forEach(function(L, i){
      var on = i === 0 || S.l[i - 1];
      if (!on) return;
      h += '<div class="pv-line"><p class="pv-eqline">' + MV.md(L.t) + "</p>";
      if (S.l[i]) h += MV.fbHTML("good", "✓ " + T1.chips.filter(function(c){ return c.id === MV.ans(L); })[0].t + ". " + MV.md(L.good));
      else {
        h += '<div class="chips pv-chips" role="group" aria-label="Property for line ' + (i + 1) + '">' + T1.chips.map(function(c){ return '<button type="button" class="chip" data-line="' + i + '" data-chip="' + c.id + '" data-k="pvl' + i + c.id + '">' + c.t + "</button>"; }).join("") + "</div>";
        if (lmsg[i]) h += MV.fbHTML("bad", "✗ Not quite. " + MV.md(lmsg[i]));
      }
      h += "</div>";
    });
    if (S.l.every(Boolean)) h += '<p class="pv-eqline">' + MV.md(T1.last) + ' <span class="tiny muted">' + T1.lastNote + "</span></p>" + MV.fbHTML("good", T1.done);
    MV.keepFocus(el, function(){ el.innerHTML = h; });
    p1.render();
  }
  // ---- station 2 ----
  var p2 = new MV.Plot($("#pv-s2", host), { xmin:-3, xmax:7, ymin:-1, ymax:4 }, { equal:true }), A2 = [-2, 1], B2 = [4, 3], X2 = [3, 1];
  p2.render = function(){
    p2.draw({ view:{ xmin:-3, xmax:7, ymin:-1, ymax:4 }, equal:true, xTicks:{ step:1 }, yTicks:{ step:1 },
      after:function(ctx, p){
        arrow(ctx, p, O, A2, { color:css("--pen"), w:3 }); arrow(ctx, p, O, B2, { color:css("--f3"), w:3 });
        vlab(ctx, "~a", p.X(-1.3), p.Y(0.95), css("--pen")); vlab(ctx, "~b", p.X(2.2), p.Y(2.05), css("--f3"));
        if (S.s2 === 2) {
          var L = [[O, X2, "--ink", 3.6, null], [O, scl(2, X2), "--ink", 2.4, [6, 5]], [scl(2, X2), B2, "--pen", 3, [6, 5]]];
          L.forEach(function(s, i){ var f = clamp(p2prog * 3 - i, 0, 1); arrow(ctx, p, s[0], s[1], { color:css(s[2]), w:s[3], dash:s[4], frac:f, off:i === 1 ? 5 : 0 }); });
          if (p2prog >= 1) { vlab(ctx, "~x", p.X(1.6), p.Y(0.2), css("--ink")); vlab(ctx, "2~x", p.X(4.6), p.Y(2.15), css("--ink")); vlab(ctx, "~a", p.X(5.4), p.Y(2.9), css("--pen")); txt(ctx, "lands on b’s tip ✓", p.X(4) - 10, p.Y(3) - 18, css("--ink"), "right"); }
        }
      },
      describe:"a = (−2, 1) and b = (4, 3) from the origin." + (S.s2 === 2 ? " The solution x = (3, 1); 2x = (6, 2) followed by a lands on b’s tip (4, 3)." : "") });
  };
  function paint2(){
    var eq = $("#pv-eqs", host), mv2 = $("#pv-moves", host), fb = $("#pv-m2", host), h = "";
    for (var i = 0; i <= S.s2; i++) h += '<p class="pv-eqline">' + MV.md(T2.eqs[i]) + "</p>";
    eq.innerHTML = h;
    MV.keepFocus(mv2, function(){
      mv2.innerHTML = S.s2 < 2 ? T2.moves.map(function(o){ return '<button type="button" class="btn ghost sm" data-move="' + o.id + '" data-k="pvmv' + o.id + '">' + MV.md(o.t) + "</button>"; }).join("") :
        '<button type="button" class="btn ghost sm" data-move="reset" data-k="pvmvreset">' + T2.reset + "</button>";
    });
    fb.innerHTML = m2 ? MV.fbHTML(m2[0], MV.md(m2[1])) : "";
    p2.render();
  }
  // ---- station 3 ----
  var PT = { A:[0, 0], B:[4, 0], C:[5.6, 2.6], D:[1.6, 2.6], M:[3.6, 2.6] };
  var NB = { A:["B", "D"], B:["A", "C"], C:["B", "M"], D:["A", "M"], M:["D", "C"] };
  var EV = { AB:[1, 0], BA:[-1, 0], AD:[0, 1], DA:[0, -1], BC:[0, 1], CB:[0, -1], DM:[0.5, 0], MD:[-0.5, 0], MC:[0.5, 0], CM:[-0.5, 0] };
  function cf(c, vn, first){
    var a = Math.abs(c), s = a === 1 ? "" : a === 0.5 ? "½" : fN(a);
    return (c < 0 ? (first ? "-" : " - ") : (first ? "" : " + ")) + s + "~" + vn;
  }
  function svg3(){
    var sx = function(q){ return 24 + q[0] * 52; }, sy = function(q){ return 170 - q[1] * 52; }, r = S.route, cur = r[r.length - 1];
    var h = '<svg viewBox="0 0 340 196" class="pv-svg" role="img" aria-label="Parallelogram ABCD with M the midpoint of CD. Route so far: ' + r.join(" to ") + '.">';
    h += '<polygon points="' + ["A", "B", "C", "D"].map(function(k){ return sx(PT[k]) + "," + sy(PT[k]); }).join(" ") + '" style="fill:var(--hi-soft);stroke:var(--ink-2);stroke-width:1.5"/>';
    function ln(P, Q, col, w, dash){ return '<line x1="' + sx(P) + '" y1="' + sy(P) + '" x2="' + sx(Q) + '" y2="' + sy(Q) + '" style="stroke:var(' + col + ');stroke-width:' + w + (dash ? ";stroke-dasharray:" + dash : "") + '"/>'; }
    function head(P, Q, col){ var x1 = sx(P), y1 = sy(P), x2 = sx(Q), y2 = sy(Q), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, mx = (x1 + x2) / 2 + ux * 6, my = (y1 + y2) / 2 + uy * 6; return '<polygon points="' + mx + "," + my + " " + (mx - ux * 11 - uy * 6) + "," + (my - uy * 11 + ux * 6) + " " + (mx - ux * 11 + uy * 6) + "," + (my - uy * 11 - ux * 6) + '" style="fill:var(' + col + ')"/>'; }
    h += ln(PT.A, PT.B, "--pen", 3) + head(PT.A, PT.B, "--pen") + ln(PT.A, PT.D, "--f3", 3) + head(PT.A, PT.D, "--f3");
    h += '<text x="' + (sx([2, 0]) - 4) + '" y="' + (sy([2, 0]) + 20) + '" class="pv-sv pv-svp">a⃗</text><text x="' + (sx([0.8, 1.3]) - 22) + '" y="' + sy([0.8, 1.3]) + '" class="pv-sv pv-svt">b⃗</text>';
    for (var i = 1; i < r.length; i++) h += ln(PT[r[i - 1]], PT[r[i]], "--ink", 4.5) + head(PT[r[i - 1]], PT[r[i]], "--ink");
    Object.keys(PT).forEach(function(k){ var q = PT[k], on = k === cur; h += '<circle cx="' + sx(q) + '" cy="' + sy(q) + '" r="' + (on ? 7 : 4.5) + '" style="fill:var(' + (on ? "--ink" : "--sheet") + ');stroke:var(--ink);stroke-width:2"/>' +
      '<text x="' + (sx(q) + (k === "A" || k === "D" ? -16 : 10)) + '" y="' + (sy(q) + (q[1] > 0 ? -10 : 20)) + '" class="pv-svl">' + k + "</text>"; });
    return h + "</svg>";
  }
  function paint3(){
    var r = S.route, cur = r[r.length - 1], at = cur === "M" && r.length > 1, el = $("#pv-route", host), bt = $("#pv-rbtns", host);
    $("#pv-s3fig", host).innerHTML = svg3();
    var terms = [], ca = 0, cb = 0;
    for (var i = 1; i < r.length; i++) { var e = EV[r[i - 1] + r[i]]; ca += e[0]; cb += e[1]; terms.push(e[0] ? cf(e[0], "a", i === 1) : cf(e[1], "b", i === 1)); }
    var lit = terms.join(""), h = "<p><strong>" + T3.route + ":</strong> " + r.join(" → ") + "</p>";
    if (r.length > 1) h += '<p class="pv-eqline">' + mv("~A" + cur + " = " + lit) + "</p>";
    if (at) {
      var simpl = (ca ? cf(ca, "a", true) : "") + (cb ? cf(cb, "b", !ca) : ""), single = terms.length === (ca ? 1 : 0) + (cb ? 1 : 0);
      h += MV.fbHTML("good", T3.done + " " + mv("~AM = " + (single ? lit : simpl)) + (single ? "" : " (after collecting like vectors)") + ".");
    } else if (r.length === 1) h += '<p class="tiny muted">' + T3.empty + "</p>";
    el.innerHTML = h;
    MV.keepFocus(bt, function(){
      bt.innerHTML = (at || r.length > 8 ? "" : '<span class="tiny" style="font-weight:700">' + T3.go + "</span> " + NB[cur].map(function(k){ return '<button type="button" class="btn ghost sm" data-go="' + k + '" data-k="pvgo' + k + '">' + k + "</button>"; }).join(" ")) +
        (r.length > 1 ? ' <button type="button" class="btn ghost sm" data-go="reset" data-k="pvgoreset">' + T3.reset + "</button>" : "");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.chip) {
      var i = +b.dataset.line, L = T1.lines[i];
      if (b.dataset.chip === MV.ans(L)) { S.l[i] = true; lmsg[i] = null; } else lmsg[i] = L.bad;
      api.save && api.save(); paint1(); return;
    }
    if (b.dataset.move) {
      var mvv = b.dataset.move;
      if (mvv === "reset") { S.s2 = 0; m2 = null; p2prog = 0; }
      else if (mvv === "div") m2 = ["bad", "✗ " + T2.trap];
      else if (S.s2 === 0) { if (mvv === "sub") { S.s2 = 1; m2 = ["good", T2.good1]; } else m2 = ["bad", "✗ " + T2.early]; }
      else if (S.s2 === 1) {
        if (mvv === "half") { S.s2 = 2; m2 = ["good", T2.good2]; p2prog = 0; paint2(); MV.tween({ dur:2200, ease:function(x){ return x; }, step:function(x){ p2prog = x; p2.render(); }, done:function(){ p2prog = 1; p2.render(); } }); api.save && api.save(); return; }
        m2 = ["bad", "✗ " + T2.again];
      }
      api.save && api.save(); paint2(); return;
    }
    if (b.dataset.go) {
      if (b.dataset.go === "reset") S.route = ["A"]; else S.route.push(b.dataset.go);
      api.save && api.save(); paint3();
    }
  });
  paint1(); paint2(); paint3();
}

// =====================================================================================================================
// ---------- Practice 2: Simplify and solve set ----------
// @component V8 coefBoxes — coefficient entry "□a⃗ + □b⃗" (or "k = □, m = □") per row; whole numbers or fractions
// (decimals tolerated), a blank box counts as 0, "−" alone means −1; first-try scoring and three-level help.
function figSVG(kind){
  if (kind === "para") {
    var A = [30, 150], B = [210, 150], C = [290, 40], D = [110, 40], M = [200, 40];
    return '<svg viewBox="0 0 320 180" class="pv-svg pv-sfig" role="img" aria-label="Parallelogram ABCD: AB = a along the bottom, AD = b up the left side, M the midpoint of CD.">' +
      '<polygon points="' + [A, B, C, D].map(String).join(" ") + '" style="fill:var(--hi-soft);stroke:var(--ink-2);stroke-width:1.5"/>' +
      '<line x1="30" y1="150" x2="210" y2="150" style="stroke:var(--pen);stroke-width:3"/><polygon points="126,150 114,144 114,156" style="fill:var(--pen)"/>' +
      '<line x1="30" y1="150" x2="110" y2="40" style="stroke:var(--f3);stroke-width:3"/><polygon points="73,91 64,98 74,103" style="fill:var(--f3)"/>' +
      '<text x="114" y="172" class="pv-sv pv-svp">a⃗</text><text x="50" y="92" class="pv-sv pv-svt">b⃗</text>' +
      [["A", A, -16, 16], ["B", B, 8, 16], ["C", C, 8, -6], ["D", D, -16, -6], ["M", M, -4, -10]].map(function(q){ return '<circle cx="' + q[1][0] + '" cy="' + q[1][1] + '" r="4" style="fill:var(--ink)"/><text x="' + (q[1][0] + q[2]) + '" y="' + (q[1][1] + q[3]) + '" class="pv-svl">' + q[0] + "</text>"; }).join("") + "</svg>";
  }
  var P = [], cx = 160, cy = 95, r = 70, names = ["A", "B", "C", "D", "E", "F"];
  for (var i = 0; i < 6; i++) { var t = (240 + 60 * i) * Math.PI / 180; P.push([cx + r * Math.cos(t), cy - r * Math.sin(t)]); }
  function f(n){ return Math.round(n * 10) / 10; }
  return '<svg viewBox="0 0 320 190" class="pv-svg pv-sfig" role="img" aria-label="Regular hexagon ABCDEF with AB = a and BC = b.">' +
    '<polygon points="' + P.map(function(q){ return f(q[0]) + "," + f(q[1]); }).join(" ") + '" style="fill:var(--hi-soft);stroke:var(--ink-2);stroke-width:1.5"/>' +
    '<line x1="' + f(P[0][0]) + '" y1="' + f(P[0][1]) + '" x2="' + f(P[1][0]) + '" y2="' + f(P[1][1]) + '" style="stroke:var(--pen);stroke-width:3"/>' +
    '<line x1="' + f(P[1][0]) + '" y1="' + f(P[1][1]) + '" x2="' + f(P[2][0]) + '" y2="' + f(P[2][1]) + '" style="stroke:var(--f3);stroke-width:3"/>' +
    '<text x="' + f((P[0][0] + P[1][0]) / 2 - 6) + '" y="' + f(P[0][1] + 20) + '" class="pv-sv pv-svp">a⃗</text><text x="' + f((P[1][0] + P[2][0]) / 2 + 10) + '" y="' + f((P[1][1] + P[2][1]) / 2 + 12) + '" class="pv-sv pv-svt">b⃗</text>' +
    P.map(function(q, i){ var dx = q[0] - cx, dy = q[1] - cy; return '<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="4" style="fill:var(--ink)"/><text x="' + f(q[0] + dx * 0.22 - 5) + '" y="' + f(q[1] + dy * 0.22 + 5) + '" class="pv-svl">' + names[i] + "</text>"; }).join("") + "</svg>";
}
function parseBox(s){
  var t = String(s == null ? "" : s).trim().replace(/[−–]/g, "-").replace(/\s+/g, "");
  if (t === "") return { blank:true, v:0 };
  if (t === "-") return { v:-1 }; if (t === "+") return { v:1 };
  var f = /^([+-]?\d+)\/(\d+)$/.exec(t); if (f) return +f[2] === 0 ? { err:true } : { v:+f[1] / +f[2] };
  if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) return { v:+t };
  return { err:true };
}
function solveAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function box(it, r, j, x){ var k = r + "_" + j; return '<input class="numin short pv-box" data-bx="' + k + '" data-k="bx' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc((it.rows[r].kind === "km" ? ["k", "m"][j] : (it.rows.length > 1 ? "row " + (r + 1) + ", " : "") + "coefficient of " + ["a", "b"][j])) + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function rowsHTML(it){
    var x = ist(it.id);
    return it.rows.map(function(rw, r){
      if (rw.kind === "km") return '<p class="pv-frame">' + m("k =") + " " + box(it, r, 0, x) + " &nbsp; " + m("m =") + " " + box(it, r, 1, x) + "</p>";
      return '<p class="pv-frame">' + (rw.lab ? MV.md(rw.lab) + " " : "") + box(it, r, 0, x) + " " + m("vec{a}") + " + " + box(it, r, 1, x) + " " + m("vec{b}") + "</p>";
    }).join("");
  }
  host.innerHTML = '<p class="how">' + MV.md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>" +
      (it.fig ? figSVG(it.fig) : "") + '<div class="pv-din"></div><div class="pv-dcl"></div></div>';
  }).join("");
  function paintIn(it){ var el = $('[data-q="' + it.id + '"] .pv-din', host); MV.keepFocus(el, function(){ el.innerHTML = rowsHTML(it); }); }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .pv-dcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints.map(MV.md), x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + MV.md(it.display) + ".</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", MV.md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function close(x, y){ return Math.abs(x - y) < 1e-9; }
  function judge(it){
    var x = ist(it.id), got = [], blank = true, err = false;
    it.rows.forEach(function(rw, r){ var row = []; [0, 1].forEach(function(j){ var p = parseBox(x.v[r + "_" + j]); if (p.err) err = true; if (!p.blank) blank = false; row.push(p.v); }); got.push(row); });
    if (blank) return { err:TX.fill }; if (err) return { err:TX.err };
    function match(target){ return target.every(function(row, r){ return row === null || row.every(function(s, j){ var p = parseBox(s); return close(p.v, got[r][j]); }); }); }
    if (match(MV.ans(it))) return { ok:true };
    var W = it.wrong || [];
    for (var i = 0; i < W.length; i++) if (match(W[i].v)) return { msg:W[i].fb };
    return { msg:TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
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
// ---------- Performance task: Close the triangle (V3 board, u = (3, 4) fixed; v and w tips draggable) ----------
var task = (function(){
  var api, plot, U = [3, 4], VIEW = { xmin:-7, xmax:13, ymin:-6, ymax:14 };
  function gv(k, d){ var a = api && api.S[k]; return okVec(a) ? a : d; }
  function read(){ return { v:gv("v", [2, 1]), w:gv("w", [-1, -3]) }; }
  function checks(D){
    var v = D.v, w = D.w, s = add(add(U, v), w);
    var np = !eqv(v, O) && !eqv(w, O) && cross(U, v) !== 0 && cross(U, w) !== 0 && cross(v, w) !== 0;
    return [eqv(s, O), w[0] * w[0] + w[1] * w[1] === 25, np];
  }
  function draw(){
    var D = read(), v = D.v, w = D.w, uv = add(U, v), s = add(uv, w), c = checks(D);
    plot.draw({ view:VIEW, equal:true, xTicks:{ step:2 }, yTicks:{ step:2 },
      after:function(ctx, p){
        if (c[0]) { ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.beginPath(); [O, U, uv].forEach(function(q, i){ ctx[i ? "lineTo" : "moveTo"](p.X(q[0]), p.Y(q[1])); }); ctx.closePath(); ctx.fill(); ctx.restore(); }
        drawArrows(ctx, p, [{ A:O, B:U, c:"--pen", w:3.2, lab:"~u" }, { A:U, B:uv, c:"--f3", w:3.2, lab:"~v" }, { A:uv, B:s, c:"--f5", w:3.2, lab:"~w" }], 1, scl(1 / 3, add(U, uv)));
        if (!c[0]) { var g = arrow(ctx, p, s, O, { color:css("--ink-2"), w:2, dash:[5, 4] }); if (g) txt(ctx, "gap " + vt(scl(-1, s)), g.mx + g.nx * 14, g.my + g.ny * 14, css("--ink"), "center", ui(12, 700)); }
        else txt(ctx, "closed ✓", p.X(0) - 10, p.Y(0) + 18, css("--ink"), "right");
      },
      describe:"u = (3, 4) from the origin, then v = " + stepsTxt(v) + ", then w = " + stepsTxt(w) + ". The chain ends at " + stepsTxt(s) + (c[0] ? ": it closes a triangle." : ".") });
  }
  function panel(){
    var D = read(), L = api.content.labels, v = D.v, w = D.w, P = sub(U, v), L2 = sub(P, w), R2 = sub(U, sub(v, w)), el = $("#ct-read");
    if (!el) return;
    el.innerHTML = '<p class="tiny" style="font-weight:700;margin:0 0 4px">' + L.line2 + '</p><dl class="read">' + MV.readoutHTML([
      [mv(L.vv), vt(v)], [mv(L.ww), vt(w) + ", " + mv(L.lenW) + " = " + lenHTML(w)], [mv(L.sum), vt(add(add(U, v), w))],
      [mv(L.brL), vt(P) + " − " + vt(w) + " = " + vt(L2)], [mv(L.brR), vt(U) + " − " + vt(sub(v, w)) + " = " + vt(R2)], [L.gap, lenHTML(sub(R2, L2))]]) + "</dl>";
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (!okVec(a.S.v)) a.S.v = [2, 1]; if (!okVec(a.S.w)) a.S.w = [-1, -3];
      inp.innerHTML = '<p class="tiny" style="margin:0 0 6px">' + MV.md(L.board) + '</p><div class="plot-wrap"><canvas class="plot square" id="ct-plot" role="img" aria-label="Task board"></canvas></div>';
      pv.innerHTML = '<div id="ct-read" aria-live="polite"></div>';
      plot = new MV.Plot($("#ct-plot"), VIEW, { equal:true }); plot.render = draw;
      MV.drag(plot, {
        handles:function(){ var D = read(), uv = add(U, D.v), s = add(uv, D.w); return [{ id:"v", x:uv[0], y:uv[1], label:"Tip of vector v: " + stepsTxt(D.v) }, { id:"w", x:s[0], y:s[1], label:"Tip of vector w: " + stepsTxt(D.w) }]; },
        snap:function(x, y){ return [Math.round(x), Math.round(y)]; },
        move:function(id, x, y){
          var D = read(), tail = id === "v" ? U : add(U, D.v), nv = [clamp(Math.round(x - tail[0]), -5, 5), clamp(Math.round(y - tail[1]), -5, 5)];
          if (eqv(nv, D[id])) return;
          a.S[id] = nv; a.save(); draw(); panel(); a.update();
        }
      });
      draw(); panel();
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    key:function(D){ return D.v.join(",") + "|" + D.w.join(","); },
    label:function(k){ var s = k.split("|"); return mv("~v") + " = (" + s[0].replace(/-/g, MINUS).replace(",", ", ") + "), " + mv("~w") + " = (" + s[1].replace(/-/g, MINUS).replace(",", ", ") + ")"; },
    text:function(k){ var s = k.split("|"); return "v = (" + s[0].replace(/-/g, MINUS).replace(",", ", ") + "), w = (" + s[1].replace(/-/g, MINUS).replace(",", ", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ solve:solveAct },
  task:task
});

})();
