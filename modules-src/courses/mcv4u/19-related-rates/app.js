// MCV4U 19 Related Rates: hero (a 10 m ladder slides out at a steady pace; footprints and top marks at equal time ticks),
// Rates in motion (Explore: V10 shape stage in time mode with a sliding-ladder and a filling-cone scene, y–t / h–t graphs with
// the tangent at the moment, speed arrows, "Show the algebra", a V8 □√□ box for TC3), Set up the relation (Part 3: N29
// chip-slot setup builder for four scenes with a line-by-line algebra check), Put the steps in order (Practice 1: N5 with
// pattern feedback), Solve it (Practice 2: V8 boxes) and the "Design a ladder moment" task (live ladder preview).
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;

// Upright d in dx/dt, dV/dt, d/dt and d(x + s)/dt (course plan §2; adapted from MCV4U 13): content `dx/dt` typesets as d𝑥/d𝑡.
(function(){
  var base = MV.m;
  MV.m = function(s){ return base(s).replace(/<i>d<\/i>(?=<i>[A-Za-z]<\/i>|\/<i>d<\/i>|\()/g, "d"); };
})();

function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function f1(v){ return Math.round(v * 10) / 10; }
function lin(t){ return t; }
function exactAt(v, dp){ var p = Math.pow(10, dp), r = r9(v) * p; return Math.abs(r - Math.round(r)) < 1e-6; }
function eqa(v, dp){ return (exactAt(v, dp) ? "= " : "≈ ") + num(r9(v), dp); }       // "= 0.45" or "≈ 0.35"
function about(v, dp){ return (exactAt(v, dp) ? "" : "about ") + num(r9(v), dp); }
function piTxt(k){ return k === 1 ? "π" : k + "π"; }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function chipRow(name, opts, val, label){
  return '<div class="chips rr-chips" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    var on = val === o.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + on + '">' + o.t + "</button>"; }).join("") + "</div>";
}
function togBtn(id, label, on){ return '<button type="button" class="chip rr-tog" data-tog="' + id + '" data-k="tog' + id + '" aria-pressed="' + on + '">' + (on ? "✓ " : "") + label + "</button>"; }

// ---------- the scenes' mathematics ----------
function ladY(x, L){ L = L || 10; return Math.sqrt(Math.max(0, L * L - x * x)); }
function ladV(x){ var y = ladY(x); return y > 1e-9 ? r9(-x / y * 0.6) : -Infinity; }      // dy/dt for the 10 m ladder, dx/dt = 0.6
function coneDh(h, k){ return 4 * k / (h * h); }                                           // dV/dt = kπ, V = πh³/12
// exact y = √(400 − n²)/2 for x = n/2 on the 10 m ladder -> {src (m() source), rational}
function ySurd(n){
  var kf = MV.mcv.kfree(400 - n * n, 2), c = Q.of(kf[0], 2);
  if (kf[1] === 1) return { src:Q.txt(c), rational:true };
  var co = c.n === 1 ? "" : String(c.n);
  return { src:co + "√" + kf[1] + (c.d > 1 ? "/" + c.d : ""), rational:false };
}
function gridN(v){ var n = Math.round(v * 2); return near(v * 2, n, 1e-7) ? n : null; }

// =====================================================================================================================
// SVG figures (colours from tokens through classes in app.css)
function svArr(x1, y1, x2, y2, cls){
  var a = Math.atan2(y2 - y1, x2 - x1), h = 9, w = 5.5, bx = x2 - h * Math.cos(a), by = y2 - h * Math.sin(a);
  return '<line class="' + cls + '" x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(bx) + '" y2="' + f1(by) + '"/><polygon class="' + cls + 'h" points="' +
    f1(x2) + "," + f1(y2) + " " + f1(bx + w * Math.sin(a)) + "," + f1(by - w * Math.cos(a)) + " " + f1(bx - w * Math.sin(a)) + "," + f1(by + w * Math.cos(a)) + '"/>';
}
function svT(x, y, txt, cls, anchor){ return '<text class="' + (cls || "rr-t") + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "start") + '">' + txt + "</text>"; }
function vi(v){ return '<tspan class="rr-i">' + v + "</tspan>"; }
function dd(v){ return "d" + vi(v) + "/d" + vi("t"); }
function sNum(v, dp){ return num(r9(v), dp == null ? 2 : dp); }

// Ladder against a wall (viewBox 0 0 360 300): wall and floor --ink-2, ladder --ink, foot arrow --pen (dx/dt), top arrow --f3
// (dy/dt, both:true), speed arrows ∝ speed (k px per m/s, at least 12 px, at most cap), footprints and top marks at the
// positions in marks (equal time ticks), legend (top right) with x, y and the two rates.
var LX0 = 84, LY0 = 262;
function ladderFig(o){
  var L = o.L || 10, s = 220 / L, x = clamp(o.x, 0, L), y = ladY(x, L), fx = LX0 + x * s, ty = LY0 - y * s, k = o.k || 40, cap = o.cap || 110, v = o.v || 0;
  var vy = y > 1e-9 ? x / y * v : Infinity, g = "";
  g += '<line class="rr-floor" x1="' + (LX0 - 26) + '" y1="' + LY0 + '" x2="356" y2="' + LY0 + '"/><line class="rr-wall" x1="' + LX0 + '" y1="' + (LY0 + 1.5) + '" x2="' + LX0 + '" y2="26"/>';
  (o.marks || []).forEach(function(mx){
    var my = ladY(mx, L);
    g += '<ellipse class="rr-fp" cx="' + f1(LX0 + mx * s) + '" cy="' + (LY0 - 4) + '" rx="5.5" ry="2.8"/><line class="rr-tm" x1="' + (LX0 - 8) + '" y1="' + f1(LY0 - my * s) + '" x2="' + (LX0 + 8) + '" y2="' + f1(LY0 - my * s) + '"/>';
  });
  var dx = LX0 - fx, dy = ty - LY0, len = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / len, uy = dy / len, px = -uy * 3.6, py = ux * 3.6;
  for (var i = 1; i < L; i++) { var cx = fx + dx * i / L, cy = LY0 + dy * i / L; g += '<line class="rr-rung" x1="' + f1(cx - px) + '" y1="' + f1(cy - py) + '" x2="' + f1(cx + px) + '" y2="' + f1(cy + py) + '"/>'; }
  [-1, 1].forEach(function(sg){ g += '<line class="rr-rail" x1="' + f1(fx + sg * px) + '" y1="' + f1(LY0 + sg * py) + '" x2="' + f1(LX0 + sg * px) + '" y2="' + f1(ty + sg * py) + '"/>'; });
  g += svT((fx + LX0) / 2 - uy * 17, (LY0 + ty) / 2 + ux * 17 + 4, L + " m", "rr-t rr-tl", "middle");
  if (x * s > 34) g += svT((LX0 + fx) / 2, LY0 + 18, vi("x"), "rr-t rr-tl rr-tx", "middle");
  if (y * s > 34) g += svT(LX0 - 24, (LY0 + ty) / 2 + 12, vi("y"), "rr-t rr-tl rr-tx", "end");
  if (v > 0) {
    var lf = clamp(k * v, 12, cap);
    g += svArr(fx, LY0 + 13, fx + lf, LY0 + 13, "rr-ap") + svT(Math.min(fx, 314), LY0 + 32, dd("x"), "rr-t rr-tp");
  }
  if (o.both && y > 1e-9) {
    if (vy > 1e-9) g += svArr(LX0 - 13, ty, LX0 - 13, ty + clamp(k * vy, 12, cap), "rr-af");
    g += svT(LX0 - 21, ty + 4, dd("y"), "rr-t rr-tf", "end");
  }
  if (o.legend) {
    g += svT(354, 18, vi("x") + " " + eqa(x, 2) + " m, " + vi("y") + " " + eqa(y, 2) + " m", "rr-t rr-tl", "end");
    if (v > 0) g += svT(354, 38, dd("x") + " = " + sNum(v, 1) + " m/s", "rr-t rr-tp", "end");
    if (o.both && v > 0) g += svT(354, 58, dd("y") + " " + (isFinite(vy) ? eqa(-vy, 2) : "") + " m/s", "rr-t rr-tf", "end");
  }
  var aria = "A " + L + " m ladder leaning on a wall: its foot is " + about(x, 2) + " m from the wall and its top is " + about(y, 2) + " m up the wall." +
    (v > 0 ? " The foot moves out at " + sNum(v, 1) + " m/s" + (o.both ? (vy > 1e-9 ? "; the top slides down at " + about(vy, 2) + " m/s." : "; the top isn’t moving at this instant.") : ".") : "") +
    ((o.marks || []).length > 1 ? " Footprints mark the foot at equal time steps (equally spaced); the marks for the top on the wall start close together and spread apart." : "");
  return { svg:g, aria:aria };
}
// Inverted cone tank (viewBox 0 0 360 300), 6 m deep with top radius 3 m: water --pen at --rr-wfo, surface --pen 3 px, a pipe and
// stream (the inflow, dV/dt), a teal arrow at the surface for dh/dt (15 px per m/min, 12 to 90 px), a ruler for h.
var CX = 170, CAY = 272, CS = 37;
function coneFig(o){
  var h = clamp(o.h, 0, 6), yh = CAY - h * CS, hw = h / 2 * CS, topY = CAY - 6 * CS, tw = 3 * CS, RX = 336, g = "";
  if (h > 0) g += '<polygon class="rr-water" points="' + CX + "," + CAY + " " + f1(CX - hw) + "," + f1(yh) + " " + f1(CX + hw) + "," + f1(yh) + '"/>';
  g += '<rect class="rr-pipe" x="' + (CX - 5) + '" y="9" width="84" height="10" rx="2"/><line class="rr-stream" x1="' + CX + '" y1="19" x2="' + CX + '" y2="' + f1(yh) + '"/>' + svT(CX + 84, 18, dd("V"), "rr-t rr-tp");
  g += '<line class="rr-rim" x1="' + (CX - tw) + '" y1="' + topY + '" x2="' + (CX + tw) + '" y2="' + topY + '"/><polyline class="rr-cone" points="' + (CX - tw) + "," + topY + " " + CX + "," + CAY + " " + (CX + tw) + "," + topY + '"/>';
  if (h > 0) g += '<line class="rr-surf" x1="' + f1(CX - hw) + '" y1="' + f1(yh) + '" x2="' + f1(CX + hw) + '" y2="' + f1(yh) + '"/>';
  g += '<line class="rr-rule" x1="' + RX + '" y1="' + CAY + '" x2="' + RX + '" y2="' + topY + '"/>';
  for (var i = 0; i <= 6; i++) { var yy = CAY - i * CS; g += '<line class="rr-rule" x1="' + (RX - 6) + '" y1="' + yy + '" x2="' + RX + '" y2="' + yy + '"/>' + svT(RX + 6, yy + 4, String(i), "rr-t rr-ts"); }
  g += svT(RX + 6, topY - 14, "m", "rr-t rr-ts") + '<line class="rr-lev" x1="' + f1(CX + hw + 3) + '" y1="' + f1(yh) + '" x2="' + (RX - 6) + '" y2="' + f1(yh) + '"/>';
  if (o.dh > 0) { var ax = CX + hw + 16; g += svArr(ax, yh, ax, yh - clamp(15 * o.dh, 12, 90), "rr-af") + svT(ax + 6, yh + 17, dd("h"), "rr-t rr-tf"); }
  g += svT(8, 18, dd("V") + " = " + piTxt(o.k) + " m³/min", "rr-t rr-tp") + svT(8, 38, dd("h") + " " + eqa(o.dh, 2) + " m/min", "rr-t rr-tf");
  g += svT(8, 292, vi("h") + " " + eqa(h, 2) + " m, " + vi("r") + " " + eqa(h / 2, 2) + " m", "rr-t rr-tl");
  var aria = "An inverted cone tank, 6 m deep with a top radius of 3 m. Water is " + about(h, 2) + " m deep, with a surface radius of " + about(h / 2, 2) +
    " m. Water pours in at " + piTxt(o.k) + " cubic metres per minute and the level rises at " + about(o.dh, 2) + " m/min.";
  return { svg:g, aria:aria };
}

// =====================================================================================================================
// @component V10 shapeStage (time mode; MCV4U 19, adapted from the MCV4U 16 / 17 shape stage) — related-rates stage: an SVG
// figure driven by one variable u, a small graph of a quantity against time t (the curve --pen 3 px, the current point and
// the tangent at the moment in --ink with its slope as a label), a slider for u (arrows = step, Shift + arrows = big step,
// Space plays or pauses) and Play / Pause, which move u forward in time at a steady model speed (reduced motion: 1-second
// jumps of spec.jump model time, no glide). On phones (≤ 560 px) the graph sits behind a "Show graph" button. spec() is read on
// every paint, so a scene switch only needs set() or render().
//   var st = rateStage({ fig, graph, ctl } hosts, { spec() -> { min, max, step, big, label (html), fmt(u) (html), tOf(u),
//       uOf(t), tEnd, speed (model t per real second), jump, fig(u) -> {svg, aria}, view, g(t), slope(u), slopeText(u),
//       xLabel, yLabel, upTo (trace the curve only to this t), marks:[{t, text, dx, dy, align}], describe(u) },
//       u, onMove(u, how), locked(), showGraph, hideGraph })
//   -> { set(u, how), get(), play(), pause(quiet), playing(), render() }   how: "slider" | "key" | "play" | "pause" | "set" | "anim"
function rateStage(H, o){
  var u = o.u, raf = null, timer = null, open = false;
  H.fig.innerHTML = '<svg class="rr-svg" viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" aria-label="Figure"></svg>';
  H.graph.innerHTML = '<button type="button" class="btn ghost sm rr-gbtn" aria-expanded="false" data-k="rrgbtn">' + o.showGraph + '</button>' +
    '<div class="rr-gw"><div class="plot-wrap"><canvas class="plot rr-g" role="img" aria-label="Graph"></canvas></div></div>';
  H.ctl.innerHTML = '<div class="rr-play"><button type="button" class="btn primary sm rr-pb" data-k="rrplay">Play</button>' +
    '<label class="slider rr-sl"><span class="slider-top"><span class="rr-sll"></span><output></output></span><input type="range" style="accent-color:var(--ink)"></label></div>';
  var svg = $("svg", H.fig), gbtn = $(".rr-gbtn", H.graph), gw = $(".rr-gw", H.graph), P = new MV.Plot($("canvas", H.graph), { xmin:0, xmax:1, ymin:0, ymax:1 });
  var pb = $(".rr-pb", H.ctl), sl = $("input", H.ctl), out = $("output", H.ctl), lab = $(".rr-sll", H.ctl);
  function locked(){ return !!(o.locked && o.locked()); }
  function playing(){ return !!(raf || timer); }
  function drawGraph(sp){
    var V = sp.view, t = sp.tOf(u), y = sp.g(t), sl0 = sp.slope(u), ink = css("--ink"), upTo = sp.upTo == null ? sp.tEnd : sp.upTo, pts = [], labs = [];
    (sp.marks || []).forEach(function(q){ var yy = sp.g(q.t); pts.push({ x:q.t, y:yy, r:5, open:true, color:ink }); labs.push({ x:q.t, y:yy, text:q.text, dx:q.dx == null ? 10 : q.dx, dy:q.dy == null ? -14 : q.dy, align:q.align || "left", bg:true, font:ui(12) }); });
    pts.push({ x:t, y:y, r:6, color:ink });
    var right = (t - V.xmin) / (V.xmax - V.xmin) > 0.5, high = (y - V.ymin) / (V.ymax - V.ymin) > 0.72;
    labs.push({ x:t, y:y, text:sp.slopeText(u), dx:right ? -14 : 14, dy:high ? 24 : -20, align:right ? "right" : "left", bg:true, font:ui(12, 700) });
    P.draw({ view:V, xLabel:sp.xLabel, yLabel:sp.yLabel, curves:upTo > 1e-9 ? [{ f:sp.g, color:css("--pen"), width:3, domain:[0, upTo] }] : [],
      points:pts, labels:labs, describe:sp.describe(u),
      after:function(ctx, p){
        if (!isFinite(sl0) || !p.W) return;
        var sx = p.X(1) - p.X(0), sy = p.Y(0) - p.Y(1), d = 46 / Math.sqrt(sx * sx + sl0 * sl0 * sy * sy);
        ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.X(t - d), p.Y(y - sl0 * d)); ctx.lineTo(p.X(t + d), p.Y(y + sl0 * d)); ctx.stroke(); ctx.restore();
      } });
  }
  function paintCtl(){
    var sp = o.spec(), lk = locked();
    sl.min = sp.min; sl.max = sp.max; sl.step = sp.step; sl.value = u; sl.disabled = lk;
    lab.innerHTML = sp.label; out.innerHTML = sp.fmt(u);
    sl.setAttribute("aria-label", MV.plain(sp.label) + " (Shift + arrows move by " + num(sp.big) + "; Space plays or pauses)");
    sl.setAttribute("aria-valuetext", MV.plain(sp.fmt(u)));
    pb.textContent = playing() ? "Pause" : "Play"; pb.disabled = lk;
  }
  function render(){ var sp = o.spec(), F = sp.fig(u); svg.innerHTML = F.svg; svg.setAttribute("aria-label", F.aria); drawGraph(sp); paintCtl(); }
  P.render = function(){ drawGraph(o.spec()); };
  function set(v, how){
    var sp = o.spec();
    u = (how === "slider" || how === "key") ? r9(clamp(Math.round(v / sp.step) * sp.step, sp.min, sp.max)) : clamp(v, sp.min, sp.max);
    if (o.onMove) o.onMove(u, how);
    render();
  }
  function pause(quiet){
    var was = playing();
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    if (timer) { clearInterval(timer); timer = null; }
    if (was) { paintCtl(); if (o.onMove && !quiet) o.onMove(u, "pause"); }
  }
  function play(){
    if (locked() || playing()) return;
    var sp = o.spec();
    if (u >= sp.max - 1e-9) set(sp.min, "set");
    var t = sp.tOf(u), last = null;
    function step(nt){ t = Math.min(sp.tEnd, nt); set(sp.uOf(t), "play"); if (t >= sp.tEnd - 1e-9) pause(); }
    if (MV.reduceMotion) timer = setInterval(function(){ step(t + sp.jump); }, 1000);
    else raf = requestAnimationFrame(function loop(now){
      if (!raf) return;
      if (last != null) step(t + (now - last) / 1000 * sp.speed);
      last = now;
      if (raf) raf = requestAnimationFrame(loop);
    });
    paintCtl();
  }
  sl.addEventListener("input", function(){ if (locked()) { paintCtl(); return; } pause(true); set(+sl.value, "slider"); });
  sl.addEventListener("keydown", function(e){
    if (locked()) return;
    if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); if (playing()) pause(); else play(); return; }
    if (e.shiftKey && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) { e.preventDefault(); pause(true); set(u + (/Left|Down/.test(e.key) ? -1 : 1) * o.spec().big, "key"); }
  });
  pb.addEventListener("click", function(){ if (locked()) return; if (playing()) pause(); else play(); });
  gbtn.addEventListener("click", function(){
    open = !open; gw.classList.toggle("open", open); gbtn.setAttribute("aria-expanded", String(open)); gbtn.textContent = open ? o.hideGraph : o.showGraph;
    if (open) requestAnimationFrame(P.render);
  });
  return { set:set, get:function(){ return u; }, play:play, pause:pause, playing:playing, render:render };
}
// ------------------------------------------------- end of V10 shapeStage (time mode) ------------------------------------------

// ---------- hero: the foot slides out steadily; footprints at equal time ticks, the top's marks spread apart ----------
function hero(f){
  var host = $("#rr-hero"); if (!host) return;
  host.innerHTML = '<svg class="rr-svg rr-hsvg" viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false"></svg>';
  var svg = $("svg", host), T = [0, 1.5, 3, 4.5, 6, 7.5, 9];
  svg.setAttribute("aria-label", "A 10 m ladder leans on a wall. Its foot slides out at a steady pace and leaves equally spaced footprints on the floor at equal time ticks; the marks for the top’s positions on the wall start close together, then spread apart. Bottom: steady. Top: speeding up.");
  function draw(x, n){ svg.innerHTML = ladderFig({ L:10, x:x, v:0.6, both:true, k:40, marks:T.slice(0, n) }).svg; }
  function finish(){ draw(9, 7); if (f.cap) { f.cap.textContent = "Bottom: steady. Top: speeding up."; f.cap.classList.add("rr-capin"); } }
  if (MV.reduceMotion) { finish(); return; }
  draw(0, 1);
  MV.wait(700, function(){ MV.tween({ dur:5400, ease:lin, step:function(t){ var x = 9 * t; draw(x, 1 + Math.floor(x / 1.5 + 1e-9)); }, done:finish }); });
}

// ---------- Explore: rates in motion ----------
var STAGE = null;
function explore(host, api){
  var S = api.S, C = api.content, U = C.ui, R = U.rows, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["ladder", "cone"].indexOf(S.scene) < 0) S.scene = "ladder";
  if (typeof S.lx !== "number" || !(S.lx >= 0 && S.lx <= 9.5)) S.lx = 6;
  if (typeof S.ch !== "number" || !(S.ch >= 0.5 && S.ch <= 6)) S.ch = 2;
  if ([1, 2, 4, 8].indexOf(S.k) < 0) S.k = 4;
  S.both = !!S.both; S.alg = !!S.alg; S.ex = S.ex && typeof S.ex === "object" ? S.ex : { a:"", b:"" };
  var busy = false, marks = null, ticks = null, upTo = null, anim = null, algHi = false;
  host.innerHTML = '<div class="rr-ex"><div class="rr-top" data-mv="graph"><div class="seg-wrap" id="rr-scen"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="rr-stage"><div class="rr-fig" id="rr-fig"></div><div class="rr-gcol" id="rr-gcol"></div></div></div>' +
    '<div class="rr-bot"><div class="rr-ctl"><div id="rr-play"></div><div id="rr-opts"></div><p class="tiny muted rr-how" id="rr-how"></p>' +
      '<div class="rr-exact" id="rr-exw"><label class="rr-exl" for="rr-exa">' + U.exact.label + '</label><div class="rr-exrow">' + m("x =") +
        '<input class="numin rr-exa" id="rr-exa" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="Exact x, the number in front of the root (blank means 1)">' +
        '<span class="rr-rt" aria-hidden="true">√</span><input class="numin rr-exb" id="rr-exb" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="Exact x, the number under the root (blank means no root)">' +
        '<span>m</span><button type="button" class="btn ghost sm" id="rr-exgo" data-k="rrexgo">' + U.exact.place + '</button></div>' +
        '<p class="tiny muted rr-exn">' + U.exact.note + '</p><p class="tiny rr-exmsg" id="rr-exmsg" aria-live="polite"></p></div></div>' +
    '<div class="rr-rd"><dl class="read" id="rr-read" aria-live="polite"></dl><div class="rr-alg" id="rr-alg" hidden></div></div></div></div>';
  function coneT(h, k){ return h * h * h / (12 * (k || S.k)); }
  function ladSpec(){ return {
    min:0, max:9.5, step:0.5, big:2, label:U.xLab, fmt:function(x){ return num(r9(x), 2) + " m"; },
    tOf:function(x){ return x / 0.6; }, uOf:function(t){ return 0.6 * t; }, tEnd:9.5 / 0.6, speed:2, jump:1,
    fig:function(x){ return ladderFig({ L:10, x:x, v:0.6, both:S.both, k:40, legend:true, marks:ticks }); },
    view:{ xmin:-1.3, xmax:17.4, ymin:-1, ymax:11.8 }, g:function(t){ return Math.sqrt(Math.max(0, 100 - 0.36 * t * t)); },
    slope:function(x){ return ladV(x); }, slopeText:function(x){ return "slope " + eqa(ladV(x), 2); },
    xLabel:"t", yLabel:"y", upTo:upTo, marks:marks,
    describe:function(x){ var y = ladY(x), v = ladV(x);
      return "Graph of the top’s height y against time t in seconds: it falls slowly at first, then faster and faster. Now t = " + about(x / 0.6, 2) + " s. Ladder foot " + about(x, 2) + " m from the wall, moving out at 0.6 m/s. Top " + about(y, 2) + " m high, " +
        (v === 0 ? "not moving at this instant." : "sliding down at " + about(-v, 2) + " m/s.") + " The tangent’s slope is " + num(v, 2) + "."; }
  }; }
  function coneSpec(){ var k = S.k, T = 18 / k; return {
    min:0.5, max:6, step:0.5, big:2, label:U.hLab, fmt:function(h){ return num(r9(h), 2) + " m"; },
    tOf:function(h){ return coneT(h, k); }, uOf:function(t){ return Math.cbrt(12 * k * Math.max(0, t)); }, tEnd:T, speed:0.75, jump:0.5,
    fig:function(h){ return coneFig({ h:h, k:k, dh:coneDh(h, k) }); },
    view:{ xmin:-0.08 * T, xmax:1.08 * T, ymin:-0.55, ymax:6.9 }, g:function(t){ return Math.cbrt(12 * k * Math.max(0, t)); },
    slope:function(h){ return coneDh(h, k); }, slopeText:function(h){ return "slope " + eqa(coneDh(h, k), 2); },
    xLabel:"t", yLabel:"h", upTo:upTo, marks:marks,
    describe:function(h){ return "Graph of the depth h against time t in minutes at an inflow of " + piTxt(k) + " cubic metres per minute: steep at first, then flattening. Now t = " + about(coneT(h, k), 2) +
      " min, depth " + about(h, 2) + " m, rising at " + about(coneDh(h, k), 2) + " m/min (the tangent’s slope)."; }
  }; }
  function spec(){ return S.scene === "ladder" ? ladSpec() : coneSpec(); }
  var stage = STAGE = rateStage({ fig:$("#rr-fig", host), graph:$("#rr-gcol", host), ctl:$("#rr-play", host) }, {
    spec:spec, u:S.scene === "ladder" ? S.lx : S.ch, locked:function(){ return busy; }, showGraph:U.showGraph, hideGraph:U.hideGraph,
    onMove:function(u, how){
      if (S.scene === "ladder") S.lx = r9(u); else S.ch = r9(u);
      if (!busy && (how === "slider" || how === "key" || how === "play")) { marks = null; ticks = null; upTo = null; }
      $("#rr-read", host).setAttribute("aria-busy", String(how === "play"));
      if (how !== "play") api.save();
      paintRead(); MV.changed();
    } });
  // ---- readouts ----
  function ladRows(x){
    var y = ladY(x), n = gridN(x), Y = n != null ? ySurd(n) : null, v = ladV(x);
    var yTxt = Y ? "= " + m(Y.src) + (Y.rational ? "" : " ≈ " + num(y, 2)) : "≈ " + num(y, 2);
    return [[R.rel, m("x^2 + y^2 = 100")], [R.pos, m("x") + " " + eqa(x, 2) + " m, " + m("y") + " " + yTxt + " m"], [R.given, m("dx/dt") + " = 0.6 m/s"],
      [R.related, m("dy/dt") + " " + eqa(v, 2) + " m/s"], [R.words, v === 0 ? "The top isn’t moving at this instant." : "The top is sliding down at " + about(-v, 2) + " m/s."]];
  }
  function coneRows(h){
    var k = S.k, n = gridN(h), dh = coneDh(h, k), vq = n != null ? Q.of(n * n * n, 96) : null, dq = n != null ? Q.of(16 * k, n * n) : null;
    var vTxt = vq ? "= " + m(vq.d === 1 ? (vq.n === 1 ? "" : vq.n) + "π" : (vq.n === 1 ? "" : vq.n) + "π/" + vq.d) : "≈ " + num(Math.PI * h * h * h / 12, 2);
    var dTxt = dq ? (dq.d === 1 ? "= " + dq.n : "= " + m(Q.txt(dq)) + " ≈ " + num(dh, 2)) : "≈ " + num(dh, 2);
    return [[R.rel, m("V = πh^3/12") + " (from " + m("r = h/2") + ")"], [R.pos, m("h") + " " + eqa(h, 2) + " m, " + m("r") + " " + eqa(h / 2, 2) + " m, " + m("V") + " " + vTxt + " m³"],
      [R.given, m("dV/dt") + " = " + piTxt(k) + " m³/min"], [R.related, m("dh/dt") + " " + dTxt + " m/min"], [R.words, "The water level is rising at " + about(dh, 2) + " m/min."]];
  }
  function ladAlg(x){
    var y = ladY(x), n = gridN(x), Y = n != null ? ySurd(n) : null, v = ladV(x), xs = num(r9(x), 2), ys = Y ? Y.src : num(y, 2), top = num(r9(1.2 * x), 2);
    var L = [m("x^2 + y^2 = 100"), "Differentiate with respect to " + m("t") + ": " + m("2x dx/dt + 2y dy/dt = 0")];
    L.push("At this moment " + m("x = " + xs) + " and " + m("y " + (Y ? "= " : "≈ ") + ys) + ": " + m("2(" + xs + ")(0.6) + 2(" + ys + ") dy/dt = 0"));
    if (v === 0) L.push(m("dy/dt = 0") + ": the top isn’t moving at this instant.");
    else if (Y && Y.rational) L.push(m("dy/dt = -" + top + "/" + num(2 * y, 2) + " = " + num(v, 2)) + " m/s");
    else L.push(m("dy/dt " + (Y ? "= " : "≈ ") + "-{" + top + "}/{2(" + ys + ")}") + " ≈ " + num(v, 2) + " m/s");
    return L;
  }
  function coneAlg(h){
    var k = S.k, n = gridN(h), hs = num(r9(h), 2), dq = n != null ? Q.of(16 * k, n * n) : null, dh = coneDh(h, k);
    var L = [m("V = (1/3)πr^2h") + " with " + m("r = h/2") + ", so " + m("V = πh^3/12"),
      "Differentiate with respect to " + m("t") + ": " + m("dV/dt = (π/4)h^2 dh/dt"),
      "At this moment " + m("h " + (n != null ? "= " : "≈ ") + hs) + " and " + m("dV/dt = " + piTxt(k)) + ": " + m(piTxt(k) + " = (π/4)(" + hs + ")^2 dh/dt")];
    L.push(dq ? m("dh/dt = " + Q.txt(dq)) + (dq.d === 1 ? "" : " ≈ " + num(dh, 2)) + " m/min" : m("dh/dt") + " ≈ " + num(dh, 2) + " m/min");
    return L;
  }
  function paintRead(){
    var u = stage ? stage.get() : (S.scene === "ladder" ? S.lx : S.ch);
    $("#rr-read", host).innerHTML = MV.readoutHTML(S.scene === "ladder" ? ladRows(u) : coneRows(u));
    var al = $("#rr-alg", host);
    al.hidden = !S.alg; al.classList.toggle("rr-hi", algHi);
    if (S.alg) al.innerHTML = '<p class="rr-algh">' + U.algHead + "</p>" + (S.scene === "ladder" ? ladAlg(u) : coneAlg(u)).map(function(l){ return "<div>" + l + "</div>"; }).join("");
  }
  function paintOpts(){
    var sc = $("#rr-scen", host), op = $("#rr-opts", host), lad = S.scene === "ladder";
    MV.keepFocus(sc, function(){ sc.innerHTML = '<span class="tiny rr-lab">' + U.sceneLab + "</span>" + segBtns("scene", U.scenes, S.scene, U.sceneLab); });
    MV.keepFocus(op, function(){
      op.innerHTML = (lad ? "" : '<div class="rr-crow"><span class="tiny rr-lab">' + U.rateLab + "</span>" + chipRow("rate", U.rates, String(S.k), MV.plain(U.rateLab)) + "</div>") +
        '<div class="rr-crow">' + (lad ? togBtn("both", U.both, S.both) : "") + togBtn("alg", U.alg, S.alg) + "</div>";
    });
    $("#rr-how", host).innerHTML = U.how[S.scene];
    $("#rr-exw", host).hidden = !lad;
    [].forEach.call(host.querySelectorAll("#rr-scen button, #rr-opts button, #rr-exw button, #rr-exw input"), function(b){ b.disabled = busy; });
    var ia = $("#rr-exa", host), ib = $("#rr-exb", host);
    if (document.activeElement !== ia) ia.value = S.ex.a || ""; if (document.activeElement !== ib) ib.value = S.ex.b || "";
  }
  function reset(){ marks = null; ticks = null; upTo = null; }
  // ---- exact box (TC3) ----
  function exVal(){
    var a = String(S.ex.a || "").trim(), b = String(S.ex.b || "").trim();
    if (!a && !b) return { empty:true };
    var ai = a ? Number(a) : 1, bi = b ? Number(b) : 1;
    if (!Number.isInteger(ai) || !Number.isInteger(bi) || ai < 1 || bi < 1) return { bad:true };
    return { a:ai, b:bi, v:ai * Math.sqrt(bi), sq:ai * ai * bi, txt:bi === 1 ? String(ai) : (ai === 1 ? "" : ai) + "√" + bi };
  }
  function rootTxt(n){ var s = Math.round(Math.sqrt(n)); return s * s === n ? String(s) : "√" + n + " (about " + num(Math.sqrt(n), 2) + ")"; }
  // ---- events ----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || busy) return;
    if (b.dataset.scene) { if (S.scene === b.dataset.scene) return; stage.pause(true); S.scene = b.dataset.scene; reset(); api.save(); paintOpts(); stage.set(S.scene === "ladder" ? S.lx : S.ch, "set"); return; }
    if (b.dataset.rate) { var k = +b.dataset.rate; if (S.k === k) return; stage.pause(true); S.k = k; reset(); api.save(); paintOpts(); stage.set(S.ch, "set"); return; }
    if (b.dataset.tog === "both") { S.both = !S.both; api.save(); paintOpts(); stage.render(); return; }
    if (b.dataset.tog === "alg") { S.alg = !S.alg; algHi = false; api.save(); paintOpts(); paintRead(); return; }
    if (b.id === "rr-exgo") {
      var e2 = exVal(), msg = $("#rr-exmsg", host);
      if (e2.empty || e2.bad) { msg.innerHTML = e2.empty ? "Type a value first." : MV.plain(MV.md(MS.tc3.whole)); return; }
      if (e2.v > 9.5 + 1e-9) { msg.textContent = "The slider runs from 0 to 9.5 m, so the stage can’t show that."; return; }
      msg.textContent = ""; stage.pause(true); reset(); stage.set(e2.v, "set");
    }
  });
  host.addEventListener("input", function(e){
    if (e.target.id === "rr-exa" || e.target.id === "rr-exb") { S.ex[e.target.id === "rr-exa" ? "a" : "b"] = e.target.value; $("#rr-exmsg", host).textContent = ""; api.save(); MV.changed(); }
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && (e.target.id === "rr-exa" || e.target.id === "rr-exb")) { e.preventDefault(); $("#rr-exgo", host).click(); } });
  paintOpts(); stage.set(S.scene === "ladder" ? S.lx : S.ch, "set");

  // ---- challenges ----
  function chal(id){
    var Ms = MS[id];
    if (id === "tc1") {
      if (S.scene !== "ladder") return { ok:false, msg:Ms.scen };
      var x = S.lx;
      if (near(x, 8, 1e-6)) return { ok:true };
      if (near(x, 6, 1e-6)) return { ok:false, msg:Ms.x6 };
      if (near(x, 5, 1e-6)) return { ok:false, msg:Ms.x5 };
      return { ok:false, msg:tpl(Ms.other, { x:num(x, 2), v:about(-ladV(x), 2), dir:x < 8 ? Ms.out : Ms.back }) };
    }
    if (id === "tc2") {
      if (S.scene !== "cone") return { ok:false, msg:Ms.scen };
      if (!near(S.ch, 4, 1e-6)) return { ok:false, msg:Ms.h };
      if (S.k === 8) return { ok:true };
      if (S.k === 4) return { ok:false, msg:Ms.r4 };
      if (S.k === 2) return { ok:false, msg:Ms.r2 };
      return { ok:false, msg:tpl(Ms.other, { q:piTxt(S.k), v:MV.frac(coneDh(4, S.k)) }) };
    }
    if (id === "tc3") {
      var e = exVal();
      if (e.empty) return { ok:false, msg:Ms.empty };
      if (e.bad) return { ok:false, msg:Ms.whole };
      if (e.sq === 50) return { ok:true };
      if (e.sq === 25) return { ok:false, msg:Ms.five };
      if (e.sq === 49) return { ok:false, msg:Ms.seven };
      if (e.sq >= 100) return { ok:false, msg:Ms.long };
      return { ok:false, msg:tpl(Ms.other, { x:e.txt, y:rootTxt(100 - e.sq) }) };
    }
    return { ok:false };
  }
  // ---- predictions ----
  var START = { p1:{ scene:"ladder", u:1 }, p2:{ scene:"ladder", u:6 }, p3:{ scene:"cone", k:4, u:0.5 }, p4:{ scene:"cone", k:4, u:2 } };
  return {
    predict:{
      start:function(p){
        stage.pause(true); if (anim) { anim(); anim = null; }
        busy = true; reset(); algHi = false;
        var s = START[p.id]; S.scene = s.scene; if (s.k) S.k = s.k;
        if (p.id === "p1") S.both = false;
        if (p.id === "p2") { S.both = true; S.alg = false; }
        if (p.id === "p4") marks = [{ t:coneT(2, 4), text:"at h = 2: slope 4", dx:12, dy:-16 }];
        api.save(); paintOpts(); stage.set(s.u, "set");
      },
      run:function(p, done){
        function fin(){ busy = false; anim = null; api.save(); paintOpts(); paintRead(); stage.render(); MV.changed(); done(); }
        if (p.id === "p1") {
          S.both = true; ticks = [1]; paintOpts();
          anim = MV.tween({ dur:4800, ease:lin, step:function(t){
            var x = 1 + 8.4 * t; ticks = [];
            for (var q = 1; q <= x + 1e-9; q += 1.2) ticks.push(r9(q));
            stage.set(x, "anim");
          }, done:fin });
        } else if (p.id === "p2") {
          S.alg = true; algHi = true; paintOpts(); paintRead();
          MV.wait(1500, fin);
        } else if (p.id === "p3") {
          var t0 = coneT(0.5, 4), t1 = 18 / 4; upTo = t0;
          anim = MV.tween({ dur:6000, ease:lin, step:function(t){ var tt = t0 + (t1 - t0) * t; upTo = tt; stage.set(Math.cbrt(48 * tt), "anim"); }, done:function(){ upTo = null; fin(); } });
        } else if (p.id === "p4") {
          var a0 = coneT(2, 4), a1 = coneT(4, 4);
          anim = MV.tween({ dur:2400, ease:lin, step:function(t){ stage.set(Math.cbrt(48 * (a0 + (a1 - a0) * t)), "anim"); }, done:function(){ MV.wait(700, fin); } });
        } else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// Part 3 scene sketches (viewBox 0 0 160 110)
var ICONS = {
  s1:'<circle class="rr-icp" cx="78" cy="55" r="14"/><circle class="rr-icp" cx="78" cy="55" r="29"/><circle class="rr-icp rr-icout" cx="78" cy="55" r="44"/>' +
    '<line class="rr-ick" x1="78" y1="55" x2="122" y2="55"/><circle class="rr-icdot" cx="78" cy="55" r="2.6"/>' + svT(100, 49, vi("r"), "rr-t rr-tl", "middle"),
  s2:'<line class="rr-icg" x1="6" y1="96" x2="154" y2="96"/><line class="rr-icpost" x1="22" y1="96" x2="22" y2="20"/><circle class="rr-iclamp" cx="22" cy="17" r="4.5"/>' +
    '<line class="rr-icray" x1="22" y1="18" x2="97" y2="96"/><line class="rr-icper" x1="72" y1="96" x2="72" y2="74"/><circle class="rr-icper" cx="72" cy="71" r="3"/>' +
    '<line class="rr-icsh" x1="72" y1="96" x2="97" y2="96"/>' + svT(47, 108, vi("x"), "rr-t rr-tl", "middle") + svT(85, 108, vi("s"), "rr-t rr-tl", "middle") +
    svT(15, 60, "6 m", "rr-t rr-ts", "end") + svT(78, 86, "2 m", "rr-t rr-ts"),
  s3:'<circle class="rr-icbal" cx="78" cy="50" r="36"/><line class="rr-ick" x1="78" y1="50" x2="114" y2="50"/><circle class="rr-icdot" cx="78" cy="50" r="2.6"/>' +
    '<path class="rr-icstr" d="M78 86 q -6 7 0 12 q 6 5 0 10"/>' + svT(96, 44, vi("r"), "rr-t rr-tl", "middle"),
  s4:'<line class="rr-icg" x1="30" y1="96" x2="154" y2="96"/><line class="rr-icg" x1="30" y1="96" x2="30" y2="6"/><line class="rr-icz" x1="30" y1="36" x2="114" y2="96"/>' +
    '<circle class="rr-iccar" cx="114" cy="96" r="5"/><circle class="rr-iccar" cx="30" cy="36" r="5"/>' + svArr(124, 89, 146, 89, "rr-ap") + svArr(38, 30, 38, 10, "rr-ap") +
    svT(114, 86, "B", "rr-t rr-tl", "middle") + svT(16, 40, "A", "rr-t rr-tl", "end") + svT(72, 108, vi("x"), "rr-t rr-tl", "middle") + svT(22, 70, vi("y"), "rr-t rr-tl", "end") + svT(78, 60, vi("z"), "rr-t rr-tl")
};

// =====================================================================================================================
// @component N29 setupSlots (adapted from MCV4U 17 modelSlots) — chip-slot setup builder: labelled slots (given rate, wanted
// rate, relation, the moment, answer) and one tray of chips. Tap a chip, then a slot (or a slot, then a chip; Enter works on
// every button). Each placement is judged at once: chips carry answer = their slot id, or "no" for traps with their own
// feedback; a right chip locks into its slot, a wrong one stays in the tray with feedback.
//   setupSlots(host, { key, slots:[{id, label}], roles:{id:"the …"}, chips:[{t, answer, fb}], st:{placed:{slot:i}, tries}, save(), done, onDone() })
function setupSlots(host, o){
  var st = o.st, sel = null, act = null, msg = null;
  st.placed = st.placed || {}; st.tries = st.tries || 0;
  function used(){ var u = {}; Object.keys(st.placed).forEach(function(k){ u[st.placed[k]] = 1; }); return u; }
  function full(){ return o.slots.every(function(s){ return st.placed[s.id] != null; }); }
  function paint(){
    var u = used(), done = full();
    MV.keepFocus(host, function(){
      var h = '<div class="rr-slots">' + o.slots.map(function(s){
        var ci = st.placed[s.id], c = ci != null ? o.chips[ci] : null;
        return '<button type="button" class="rr-slot' + (c ? " full" : "") + (act === s.id ? " on" : "") + '" data-slot="' + s.id + '" data-k="' + o.key + "s" + s.id + '" aria-pressed="' + (act === s.id) + '"' + (c ? " disabled" : "") +
          ' aria-label="' + MV.esc(s.label + ": " + (c ? MV.plain(c.t) : "empty")) + '"><span class="rr-sll2">' + s.label + '</span><span class="rr-slv">' + (c ? "✓ " + c.t : "empty") + "</span></button>";
      }).join("") + "</div>";
      if (!done) h += '<div class="rr-tray" role="group" aria-label="Chips">' + o.chips.map(function(c, i){
        return u[i] ? "" : '<button type="button" class="chip rr-mchip" data-chip="' + i + '" data-k="' + o.key + "c" + i + '" aria-pressed="' + (sel === i) + '">' + c.t + "</button>";
      }).join("") + "</div>";
      if (done) h += MV.fbHTML("good", "<strong>✓ " + o.done + "</strong> Open <strong>Check it with algebra</strong> to follow the working.");
      else if (msg) h += MV.fbHTML(msg.good ? "good" : "bad", msg.html);
      else h += '<p class="tiny muted rr-mtip">' + (sel != null ? "Now tap the slot for this chip." : act ? "Now tap the chip for this slot." : "Tap a chip, then its slot.") + "</p>";
      host.innerHTML = h;
    });
  }
  function place(ci, sid){
    var c = o.chips[ci], ans = MV.ans(c), sl = o.slots.filter(function(s){ return s.id === sid; })[0];
    sel = null; act = null;
    if (ans === sid) { st.placed[sid] = ci; msg = full() ? null : { good:true, html:"<strong>✓ " + sl.label + ":</strong> " + c.t + "." }; o.save(); paint(); if (full() && o.onDone) o.onDone(); MV.focusFb(host); return; }
    st.tries++;
    msg = { good:false, html:"<strong>✗ Not quite.</strong> " + (ans === "no" ? c.fb : c.t + " is " + o.roles[ans] + ", not " + o.roles[sid] + ".") + " Try again." };
    o.save(); paint(); MV.focusFb(host);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.chip != null) { var ci = +b.dataset.chip; msg = null; if (act) place(ci, act); else { sel = sel === ci ? null : ci; paint(); } return; }
    if (b.dataset.slot) { msg = null; if (sel != null) place(sel, b.dataset.slot); else { act = act === b.dataset.slot ? null : b.dataset.slot; paint(); } }
  });
  paint();
}

// ---------- Part 3: set up the relation ----------
function part3(host, api){
  var S = api.S, C = api.content;
  if (!C.scenes.some(function(sc){ return sc.id === S.sc; })) S.sc = "s1";
  S.slots = S.slots || {}; S.lines = S.lines || {};
  host.innerHTML = '<div class="rr-p3"><p class="how">' + C.how + '</p><div class="seg-wrap rr-tabs" id="rr-p3tabs"></div><div class="rr-scene" id="rr-p3sc"></div></div>';
  var tabs = $("#rr-p3tabs", host), box = $("#rr-p3sc", host);
  function cur(){ return C.scenes.filter(function(sc){ return sc.id === S.sc; })[0]; }
  function done(sc){ var st = S.slots[sc.id]; return !!(st && st.placed && C.slots.every(function(s){ return st.placed[s.id] != null; })); }
  function paintTabs(){
    MV.keepFocus(tabs, function(){
      tabs.innerHTML = '<span class="tiny rr-lab">' + C.sceneLab + "</span>" + segBtns("sc", C.scenes.map(function(sc){ return { id:sc.id, t:(done(sc) ? "✓ " : "") + sc.tab }; }), S.sc, C.sceneLab);
    });
  }
  function paintLines(){
    var sc = cur(), n = clamp(S.lines[sc.id] || 1, 1, sc.alg.length), el = $(".rr-lines", box);
    MV.keepFocus(el, function(){
      el.innerHTML = sc.alg.slice(0, n).map(function(l, i){ return '<div class="rr-line"><span class="rr-ln">' + (i + 1) + ".</span> " + l + "</div>"; }).join("") +
        (n < sc.alg.length ? '<div class="q-actions"><button type="button" class="btn ghost sm" data-line="next" data-k="ln' + sc.id + '">' + C.nextLine + '</button><button type="button" class="btn ghost sm" data-line="all" data-k="la' + sc.id + '">' + C.allLines + "</button></div>" : "");
    });
  }
  function paintNote(){ var sc = cur(), el = $(".rr-note", box); el.innerHTML = sc.note && done(sc) ? '<p class="rr-notep"><strong>Note.</strong> ' + sc.note + "</p>" : ""; }
  function paintScene(){
    var sc = cur();
    box.innerHTML = '<div class="rr-scrow"><svg class="rr-ic" viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" aria-label="' + MV.esc(sc.aria) + '">' + ICONS[sc.id] + '</svg><p class="rr-sct">' + sc.t + "</p></div>" +
      '<div class="rr-slh"></div><details class="alg rr-algd"><summary>Check it with algebra</summary><div class="alg-lines rr-lines"></div></details><div class="rr-note"></div>';
    setupSlots($(".rr-slh", box), { key:"ms" + sc.id, slots:C.slots, roles:C.roles, chips:sc.chips, st:(S.slots[sc.id] = S.slots[sc.id] || {}), save:api.save, done:sc.done,
      onDone:function(){ paintTabs(); paintNote(); } });
    paintLines(); paintNote();
  }
  tabs.addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b || !b.dataset.sc || b.dataset.sc === S.sc) return; S.sc = b.dataset.sc; api.save(); paintTabs(); paintScene(); });
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !b.dataset.line) return;
    var sc = cur(); S.lines[sc.id] = b.dataset.line === "all" ? sc.alg.length : (S.lines[sc.id] || 1) + 1; api.save(); paintLines();
    var nb = box.querySelector('[data-line="next"]'); if (nb && b.dataset.line === "next") nb.focus(); else { var ls = box.querySelectorAll(".rr-line"); if (ls.length) { ls[ls.length - 1].setAttribute("tabindex", "-1"); ls[ls.length - 1].focus(); } }
  });
  paintTabs(); paintScene();
  return {};
}

// =====================================================================================================================
// Practice 1 — @component N5 orderSteps (adapted from MCV4U 17 / toolkit N5): put steps in order (Move up / Move down, Check),
// several sequences, three-level hints, other accepted orders (accept), and pattern feedback: rules [{a, b, fb}] fire when
// step a is placed before step b. First-try scoring as the toolkit (right on the first check, worked solution not shown).
function stepsAct(host, api, a){
  var S = api.S; S.seq = S.seq || {}; var sel = {}, msgs = {};
  function sq(s){ var x = S.seq[s.id]; if (!x || !Array.isArray(x.order) || x.order.length !== s.steps.length) x = S.seq[s.id] = { order:s.start.slice(), tries:0, hint:0, solved:false, first:null }; return x; }
  function same(ord, ref){ return ref.every(function(v, i){ return ord[i] === v; }); }
  function isRight(s, ord){ return ord.every(function(v, i){ return v === i; }) || (s.accept || []).some(function(acc){ return same(ord, acc); }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.sequences.map(function(s, si){
        var x = sq(s), h = '<div class="q' + (si ? " part" : "") + '" data-seq="' + s.id + '" style="border-bottom:0"><p class="task">Sequence ' + (si + 1) + ": " + s.prompt + "</p>";
        h += '<ol class="olist">' + x.order.map(function(stepI, pos){
          var isSel = sel[s.id] === pos && !x.solved, cls = "ostep" + (x.solved ? " good" : (msgs[s.id] && msgs[s.id].pos === pos ? " bad" : ""));
          return '<li><button type="button" class="' + cls + '" aria-pressed="' + isSel + '" data-k="' + s.id + "p" + stepI + '" data-pos="' + pos + '"' + (x.solved ? " disabled" : "") + '><span class="sn">' + (pos + 1) + ".</span><span>" + s.steps[stepI] + "</span></button>" +
            (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + s.id + 'up"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="' + s.id + 'down"' + (pos === x.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
        }).join("") + "</ol>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + s.id + 'chk">Check the order</button>' + MV.hintBtn(s.id + "hint", x.hint) + "</div>" + MV.hintsHTML(s.hints, x.hint);
        if (x.solved) h += MV.fbHTML("good", "<strong>✓ That order works.</strong> " + (s.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
        else if (msgs[s.id]) h += MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + msgs[s.id].html);
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-seq]"); if (!box) return;
    var s = a.sequences.filter(function(z){ return z.id === box.dataset.seq; })[0], x = sq(s);
    if (b.dataset.pos != null) { var p = +b.dataset.pos; sel[s.id] = sel[s.id] === p ? null : p; paint(); return; }
    if (b.dataset.mv) {
      var i = sel[s.id], j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= x.order.length) return;
      var t = x.order[i]; x.order[i] = x.order[j]; x.order[j] = t; sel[s.id] = j; msgs[s.id] = null; api.save(); paint();
      var nb = host.querySelector('[data-seq="' + s.id + '"] [data-mv="' + b.dataset.mv + '"]'); if (nb && !nb.disabled) nb.focus(); else { var sb = host.querySelector('[data-seq="' + s.id + '"] [data-pos="' + j + '"]'); if (sb) sb.focus(); }
      return;
    }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      if (isRight(s, x.order)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[s.id] = null; sel[s.id] = null; }
      else {
        x.tries++;
        var pos = 0; while (pos < x.order.length && x.order[pos] === pos) pos++;
        var hit = (s.rules || []).filter(function(r){ return x.order.indexOf(r.a) < x.order.indexOf(r.b); })[0];
        msgs[s.id] = { pos:pos, html:hit ? hit.fb : "Step " + (pos + 1) + " is out of place. " + (a.general || "") };
      }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-seq="' + s.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.sequences.forEach(function(s){ var x = sq(s); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.sequences.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.sequences.length + (d < a.sequences.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.sequences.forEach(function(s){ var x = sq(s); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(s.goal != null ? s.goal : a.goal)); }); return g; }
  };
}

// =====================================================================================================================
// Practice 2 — @component V8 rateBoxes (adapted from MCV4U 17 solveBoxes) — labelled answer boxes with units: numbers,
// fractions and multiples of π (MV.parseNum: 60π, 5/12, 0.5); exact roots through MV.mcv.S.parse (box.exact: equivalent forms
// such as 5/√13 accepted, decimals refused); anySign accepts a speed or the signed rate; an optional chip choice (growing /
// shrinking); named wrong values ({v, fb} compared by value, {dir, fb} for the choice); first-try scoring; three-level hints.
function solveAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, SS = MV.mcv.S, EX = MV.mcv.exact;
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, c:null, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q rr-sq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + (it.note ? '<p class="tiny muted rr-snote">' + it.note + "</p>" : "") + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="rr-sin"></div><div class="rr-scl"></div></div>';
  }).join("");
  function val(str){ var p = MV.parseNum(String(str).replace(/−/g, "-")); return p && p.length === 1 ? p[0] : NaN; }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .rr-sin', host);
    MV.keepFocus(el, function(){
      var h = '<div class="rr-bxs">' + it.boxes.map(function(b){
        return '<label class="rr-bx"><span>' + b.label + '</span><input class="numin' + (b.exact ? " rr-exi" : " short") + '" data-bx="' + b.k + '" data-k="' + it.id + b.k + '" type="text" inputmode="' + (b.exact ? "text" : "decimal") + '" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(MV.plain(b.label).replace(/\s*=\s*$/, "")) + (b.unit ? " in " + b.unit : "") + '" value="' + MV.esc(x.v[b.k] || "") + '"' + (x.solved ? " disabled" : "") + ">" + (b.unit ? '<span class="rr-bu">' + b.unit + "</span>" : "") + "</label>";
      }).join("") + "</div>";
      if (it.choose) h += '<div class="rr-crow"><span class="tiny rr-lab">' + it.choose.label + '</span><div class="chips rr-chips" role="group" aria-label="' + MV.esc(it.choose.label) + '">' + it.choose.options.map(function(o){
        var on = x.c === o.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-ch="' + o.id + '" data-k="' + it.id + "ch" + o.id + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div></div>";
      el.innerHTML = h;
    });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .rr-scl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function exactOf(raw){
    var t = String(raw || "").replace(/\s+/g, "").replace(/sqrt\(?(\d+)\)?/gi, "√$1").replace(/√\((\d+)\)/g, "√$1").replace(/−/g, "-");
    var p = SS.parse(t); if (!p) return null;
    var v = EX.value(p); return isFinite(v) ? v : null;
  }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, i;
    for (i = 0; i < it.boxes.length; i++) {
      var bx = it.boxes[i], raw = x.v[bx.k];
      if (!String(raw || "").trim()) return { err:"Type your answer first." };
      if (bx.exact) {
        var e = exactOf(raw);
        if (e == null) return { err:isNaN(val(raw)) ? "Type an exact value, such as 3√2/4." : "Give the exact value (with a root), not a decimal." };
        vals[bx.k] = e;
      } else { var v = val(raw); if (isNaN(v)) return { err:"Type a number, such as 12, 5/12 or 60π." }; vals[bx.k] = v; }
    }
    if (it.choose && x.c == null) return { err:"Choose whether " + it.choose.label.toLowerCase().replace(/^the /, "the ") + " growing or shrinking." };
    function eqv(got, target){ return it.anySign ? near(Math.abs(got), Math.abs(target), 1e-9 * Math.max(1, Math.abs(target))) : near(got, target, 1e-9 * Math.max(1, Math.abs(target))); }
    var okBoxes = it.boxes.every(function(b){ return eqv(vals[b.k], val(ans[b.k])); }), okC = !it.choose || x.c === ans[it.choose.k];
    if (okBoxes && okC) return { ok:true };
    var k0 = it.boxes[0].k;
    var w = (it.wrong || []).filter(function(z){ return z.v != null && eqv(vals[k0], val(z.v)); })[0] || (okBoxes ? (it.wrong || []).filter(function(z){ return z.dir && z.dir === x.c; })[0] : null);
    if (w) return { ok:false, msg:w.fb };
    return { ok:false, msg:"Write the relation, differentiate with respect to `t`, then substitute the moment’s values." };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.ch) { x.c = b.dataset.ch; msgs[it.id] = null; api.save(); paintIn(it); paintCl(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + MV.md(r.msg) + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a ladder moment ----------
var task = (function(){
  var api = null, svg = null;
  function gi(k, lo, hi){ var t = String(api.S[k] == null ? "" : api.S[k]).trim(), v = Number(t); return t !== "" && Number.isInteger(v) && v >= lo && v <= hi ? v : null; }
  function speedK(){ var t = String(api.S.v == null ? "" : api.S.v).trim(), v = Number(t), k = Math.round(v * 10); return t !== "" && isFinite(v) && near(v, k / 10, 1e-9) && k >= 1 && k <= 20 ? k : null; }
  function read(){ var L = gi("L", 5, 15), x = L != null ? gi("x", 1, L - 1) : null, k = speedK(); return { L:L, x:x, k:k, valid:L != null && x != null && k != null }; }
  function stepper(id, label, v, min, max, step){
    return '<div class="rr-tstep"><label for="rr-t' + id + '">' + label + "</label>" +
      '<button type="button" class="btn ghost sm" data-st="' + id + '" data-dir="-1" data-k="rrt' + id + 'm" aria-label="Decrease ' + MV.esc(MV.plain(label)) + '">' + MINUS + "</button>" +
      '<input class="numin short" id="rr-t' + id + '" data-tk="' + id + '" type="number" min="' + min + '" max="' + max + '" step="' + step + '" autocomplete="off" value="' + MV.esc(v) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + id + '" data-dir="1" data-k="rrt' + id + 'p" aria-label="Increase ' + MV.esc(MV.plain(label)) + '">+</button></div>';
  }
  function refresh(){
    if (!svg) return;
    var d = read(), el = $("#rr-tread");
    if (!d.valid) {
      svg.innerHTML = ""; svg.setAttribute("aria-label", "Enter a ladder length, a foot distance and a foot speed to see the ladder.");
      if (el) el.innerHTML = '<div><dd class="muted">' + "Ladder length: whole metres from 5 to 15. Foot distance: whole metres from 1 to " + m("L - 1") + ". Foot speed: 0.1 to 2.0 m/s.</dd></div>";
      return;
    }
    var v = d.k / 10, y2 = d.L * d.L - d.x * d.x, y = Math.sqrt(y2), ys = Math.round(y), whole = ys * ys === y2, top = d.x / y * v;
    var F = ladderFig({ L:d.L, x:d.x, v:v, both:true, k:30, cap:120, legend:true });
    svg.innerHTML = F.svg; svg.setAttribute("aria-label", F.aria);
    if (el) el.innerHTML = MV.readoutHTML([
      ["Top height", m("y = √{" + d.L + "^2 - " + d.x + "^2}") + " " + (whole ? "= " + ys : "= " + m("√" + y2) + " ≈ " + num(y, 2)) + " m"],
      ["Foot speed", m("dx/dt") + " = " + num(v, 1) + " m/s"],
      ["Top speed", m("(x/y) dx/dt") + " " + eqa(top, 2) + " m/s"],
      ["Faster end", near(top, v, 1e-9) ? "Both ends move at the same speed." : top > v ? "The top is faster than the foot." : "The foot is faster than the top."]
    ]);
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.L == null) { a.S.L = "10"; a.S.x = "6"; a.S.v = "1"; }
      inp.innerHTML = stepper("L", "Ladder length " + m("L") + " (m)", a.S.L, 5, 15, 1) + stepper("x", "Foot distance " + m("x") + " (m)", a.S.x, 1, 14, 1) + stepper("v", "Foot speed " + m("dx/dt") + " (m/s)", a.S.v, 0.1, 2, 0.1);
      pv.innerHTML = '<svg class="rr-svg rr-tsvg" viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" aria-label="Ladder"></svg><dl class="read" id="rr-tread" aria-live="polite" style="margin-top:10px"></dl>';
      svg = $("svg", pv);
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); refresh(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, dir = +b.dataset.dir, c0 = Number(a.S[k]);
        if (k === "v") { var kk = isFinite(c0) ? Math.round(c0 * 10) : 10; a.S.v = num(clamp(kk + dir, 1, 20) / 10, 1); }
        else { var L = gi("L", 5, 15) || 10; a.S[k] = String(k === "L" ? clamp((isFinite(c0) ? Math.round(c0) : 10) + dir, 5, 15) : clamp((isFinite(c0) ? Math.round(c0) : 1) + dir, 1, L - 1)); }
        $("#rr-t" + k).value = a.S[k]; a.save(); refresh(); a.update();
      });
      // "after all four" note (the task frame's own note fires after three answers)
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){
        setTimeout(function(){ var fb = $("#task-fb .fb.good"); if (fb && MV.taskState().found.length >= 4 && !fb.querySelector(".rr-all")) fb.insertAdjacentHTML("beforeend", '<p class="rr-all">' + a.content.afterAll + "</p>"); }, 0);
      });
      refresh();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Ladder length: whole metres from 5 to 15. Foot distance: whole metres from 1 to L − 1. Foot speed: 0.1 to 2.0 m/s in steps of 0.1."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      var y2 = d.L * d.L - d.x * d.x, ys = Math.round(Math.sqrt(y2));
      return [ys * ys === y2, d.x * d.x > y2, d.x * d.x * d.k * d.k === 144 * y2, d.k < 10];
    },
    key:function(d){ return d.L + "|" + d.x + "|" + d.k; },
    label:function(k){ var p = k.split("|"); return m("L") + " = " + p[0] + " m, " + m("x") + " = " + p[1] + " m, " + num(+p[2] / 10, 1) + " m/s"; },
    text:function(k){ var p = k.split("|"); return "L = " + p[0] + " m, x = " + p[1] + " m, " + num(+p[2] / 10, 1) + " m/s"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ steps:stepsAct, solve:solveAct },
  task:task,
  onShow:function(){ if (STAGE && STAGE.playing()) STAGE.pause(); }
});
})();
