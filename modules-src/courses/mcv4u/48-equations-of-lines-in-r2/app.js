// MCV4U 48 Equations of Lines in R²: hero (a point and a direction make a line), Point and direction (Explore: V3 vector board
// with Build / Two descriptions / Segment modes, a t slider with Play and a V12 equivalence verdict), Same line or not? (Part 3:
// verdict-then-algebra stations), The missing piece (Practice 2, number boxes) and the "Quadrant to quadrant" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;

function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mf(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function sg(v){ v = r9(v); return (v < 0 ? MINUS : "") + Math.abs(v); }
function same(a, b){ return a[0] === b[0] && a[1] === b[1]; }
function tk(t){ return Math.round(t) % 2 ? "" : num(t); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}

// =====================================================================================================================
// @component V12 lineAlgebra — lines in R² as {p:[x0, y0], d:[m1, m2]} (whole numbers, d ≠ 0), written and compared exactly.
//   vecEq(p, d, "t") m() source "vec{r} = (1, 2) + t(3, -1)" (origin dropped: "vec{r} = t(2, 5)"); comp("x", x0, m1, "t") one
//   parametric equation ("x = 1 + 3t", "y = 2" when the coefficient is 0); slopeQ(d) (null when vertical); ymxb(p, d) "y = mx + b"
//   source with stacked fractions (null when vertical). relate(L1, L2) is the equivalence test behind TC1–TC3, Part 3 and the
//   task: same line ⇔ parallel directions and a shared point -> {kind:"same", t} | {kind:"par"} | {kind:"cross", t, s, x, y} (Q).
function nS(v){ return String(r9(v)); }
function ptSrc(x, y){ return "(" + nS(x) + ", " + nS(y) + ")"; }
function ptTxt(x, y){ return "(" + sg(x) + ", " + sg(y) + ")"; }
function vecEq(p, d, par){ return "vec{r} = " + (p[0] === 0 && p[1] === 0 ? "" : ptSrc(p[0], p[1]) + " + ") + (par || "t") + ptSrc(d[0], d[1]); }
function comp(name, c0, c1, par){
  var s = name + " = "; c0 = r9(c0); c1 = r9(c1);
  if (!c1) return s + nS(c0);
  var tt = (Math.abs(c1) === 1 ? "" : nS(Math.abs(c1))) + (par || "t");
  if (!c0) return s + (c1 < 0 ? "-" : "") + tt;
  return s + nS(c0) + (c1 < 0 ? " - " : " + ") + tt;
}
function slopeQ(d){ return d[0] ? Q.of(d[1], d[0]) : null; }
function fracS(q){ var a = Math.abs(q.n); return (q.n < 0 ? "-" : "") + (q.d === 1 ? a : "{" + a + "}/{" + q.d + "}"); }
function coefX(q){ if (q.d === 1) return (q.n === 1 ? "" : q.n === -1 ? "-" : String(q.n)) + "x"; return (q.n < 0 ? "-" : "") + "{" + Math.abs(q.n) + "}/{" + q.d + "}x"; }
function ymxb(p, d){
  if (!d[0]) return null;
  var mq = Q.of(d[1], d[0]), b = Q.sub(Q.of(p[1]), Q.mul(mq, Q.of(p[0])));
  if (!mq.n) return "y = " + fracS(b);
  return "y = " + coefX(mq) + (b.n ? (b.n < 0 ? " - " : " + ") + fracS(Q.abs(b)) : "");
}
function relate(p1, d1, p2, d2){
  var cr = d1[0] * d2[1] - d1[1] * d2[0], dx = p2[0] - p1[0], dy = p2[1] - p1[1];
  if (!cr) {
    var on = dx * d1[1] - dy * d1[0] === 0;
    return on ? { kind:"same", t:d1[0] ? Q.of(dx, d1[0]) : Q.of(dy, d1[1]) } : { kind:"par" };
  }
  var t = Q.of(dx * d2[1] - d2[0] * dy, cr), s = Q.of(d1[0] * dy - dx * d1[1], -cr);
  return { kind:"cross", t:t, s:s, x:Q.add(Q.of(p1[0]), Q.mul(t, Q.of(d1[0]))), y:Q.add(Q.of(p1[1]), Q.mul(t, Q.of(d1[1]))) };
}
function qPt(x, y){ return "(" + Q.txt(x) + ", " + Q.txt(y) + ")"; }
// ---------------------------------------------- end of lineAlgebra ---------------------------------------------------

// @component V3 lineBoard — scene pieces for a line on the vector board: the line in --ink through r⃗₀, the dashed position
// arrow to r⃗₀ in --ink-2, the direction arrow m⃗ (--pen, or --f3 for a second description) and labels. Used by Explore,
// Part 3 and the task. lineScene(sc, p, d, o) with o = {color, dash, arrowColor, posArrow, label, tag}.
function lineScene(sc, p, d, o){
  o = o || {};
  sc.lines.push({ p:p, q:[p[0] + d[0], p[1] + d[1]], color:o.color || css("--ink"), width:o.width || 2.4, dash:o.dash });
  if (o.posArrow) sc.segments.push({ x1:0, y1:0, x2:p[0], y2:p[1], color:css("--ink-2"), width:1.6, dash:[6, 6], arrow:!(p[0] === 0 && p[1] === 0) });
  if (o.arrowColor) sc.segments.push({ x1:p[0], y1:p[1], x2:p[0] + d[0], y2:p[1] + d[1], color:o.arrowColor, width:3, arrow:true });
  if (o.pt !== false) sc.points.push({ x:p[0], y:p[1], r:5, color:o.ptColor || o.color || css("--ink") });
  if (o.tag) {
    var len = Math.hypot(d[0], d[1]) || 1, nx = -d[1] / len, ny = d[0] / len;
    sc.labels.push({ x:p[0] + d[0] / 2, y:p[1] + d[1] / 2, text:o.tag, dx:nx * 16, dy:-ny * 16, align:"center", color:o.arrowColor, font:mf(16), bg:true });
  }
  if (o.label) sc.labels.push({ x:p[0], y:p[1], text:o.label, dx:-10, dy:14, align:"right", color:o.ptColor || o.color || css("--ink"), font:mf(15), bg:true });
}
var GRID = { xTicks:{ step:1, fmt:tk }, yTicks:{ step:1, fmt:tk } };
function scene(V, extra){
  var sc = { view:V, equal:true, xLabel:"x", yLabel:"y", xTicks:GRID.xTicks, yTicks:GRID.yTicks, lines:[], segments:[], points:[], labels:[] };
  if (extra) Object.keys(extra).forEach(function(k){ sc[k] = extra[k]; });
  return sc;
}

// ---------- hero: a point, a direction, steps of t, then the whole line ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var V = { xmin:-7, xmax:12, ymin:-3, ymax:6.5 }, p = new MV.Plot(cv, V), P0 = [1, 2], D = [3, -1];
  var st = { pt:false, arrow:0, dots:[], cur:null, fill:0 };
  var cap = null;
  if (f.cap) { f.cap.innerHTML = '<span class="ln-hcap">' + m("vec{r} = (1, 2) + t(3, -1)") + "</span>"; cap = $(".ln-hcap", f.cap); }
  function at(t){ return [P0[0] + t * D[0], P0[1] + t * D[1]]; }
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), sc = scene(V);
    if (st.fill >= 1) sc.lines.push({ p:P0, q:at(1), color:ink, width:2.6 });
    else if (st.fill > 0) { var a = at(-2 - 12 * st.fill), b = at(3 + 12 * st.fill); sc.segments.push({ x1:a[0], y1:a[1], x2:b[0], y2:b[1], color:ink, width:2.6 }); }
    if (st.pt) {
      sc.segments.push({ x1:0, y1:0, x2:P0[0], y2:P0[1], color:ink2, width:1.6, dash:[6, 6], arrow:true });
      sc.labels.push({ x:P0[0], y:P0[1], text:"(1, 2)", dx:-10, dy:-16, align:"right", bg:true, font:ui(13) });
    }
    st.dots.forEach(function(t){ var q = at(t); sc.points.push({ x:q[0], y:q[1], r:3.5, color:ink2 }); sc.labels.push({ x:q[0], y:q[1], text:"t = " + sg(t), dx:0, dy:18, align:"center", color:ink2, font:"italic 12px " + (css("--font-math") || "serif") }); });
    if (st.arrow > 0) {
      sc.segments.push({ x1:P0[0], y1:P0[1], x2:P0[0] + D[0] * st.arrow, y2:P0[1] + D[1] * st.arrow, color:pen, width:3, arrow:true });
      if (st.arrow >= 1) sc.labels.push({ x:P0[0] + 1.5, y:P0[1] - 0.5, text:"m", dx:6, dy:-16, align:"center", color:pen, font:mf(16), bg:true });
    }
    if (st.pt) sc.points.push({ x:P0[0], y:P0[1], r:5, color:ink });
    if (st.cur != null) { var c = at(st.cur); sc.points.push({ x:c[0], y:c[1], r:6.5, color:ink, ring:true }); }
    sc.describe = "Grid with the point (1, 2), its dashed position arrow from the origin" + (st.arrow ? ", the blue direction arrow (3, −1)" : "") +
      (st.dots.length ? ", dots at t = " + st.dots.map(sg).join(", ") : "") + (st.fill >= 1 ? " and the whole line r = (1, 2) + t(3, −1) through them." : ".");
    p.draw(sc);
  }
  p.render = draw;
  function finish(){ st.pt = true; st.arrow = 1; st.dots = [0, 1, 2, 3, -1, -2]; st.cur = null; st.fill = 1; if (cap) cap.style.clipPath = "none"; draw(); }
  if (MV.reduceMotion) { finish(); return; }
  if (cap) cap.style.clipPath = "inset(0 100% 0 0)";
  draw();
  var seq = [1, 2, 3, -1, -2];
  function stepTo(i){
    if (i >= seq.length) {
      MV.wait(300, function(){ st.cur = null;
        MV.tween({ dur:1300, step:function(u){ st.fill = u; draw(); }, done:function(){ st.fill = 1; draw();
          MV.tween({ dur:1100, ease:function(u){ return u; }, step:function(u){ if (cap) cap.style.clipPath = "inset(0 " + (100 - 100 * u) + "% 0 0)"; }, done:finish });
        } });
      });
      return;
    }
    var from = i === 3 ? 0 : (i ? seq[i - 1] : 0), to = seq[i];
    MV.tween({ dur:i === 3 ? 900 : 520, step:function(u){ st.cur = from + (to - from) * u; draw(); }, done:function(){ st.cur = to; st.dots.push(to); draw(); MV.wait(260, function(){ stepTo(i + 1); }); } });
  }
  MV.wait(400, function(){ st.pt = true; draw();
    MV.wait(600, function(){
      MV.tween({ dur:800, step:function(u){ st.arrow = u; draw(); }, done:function(){ st.arrow = 1; st.cur = 0; st.dots = [0]; draw(); MV.wait(450, function(){ stepTo(0); }); } });
    });
  });
}

// ---------- Explore: Point and direction ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function okP(a){ return Array.isArray(a) && a.length === 2 && a.every(function(v){ return typeof v === "number" && isFinite(v); }); }
  if (["build", "two", "seg"].indexOf(S.mode) < 0) S.mode = "build";
  if (!S.b || !okP(S.b.p) || !okP(S.b.d)) S.b = { p:[1, 2], d:[3, -1] };
  if (!S.tw || !okP(S.tw.p) || !okP(S.tw.d) || !okP(S.tw.q) || !okP(S.tw.e)) S.tw = { p:[2, 1], d:[4, -2], q:[-2, -3], e:[1, 2] };
  if (!S.sg || !okP(S.sg.a) || !okP(S.sg.b)) S.sg = { a:[-2, 3], b:[4, -1] };
  if (!S.t || typeof S.t !== "object") S.t = { build:0, two:0, seg:0.5 };
  ["build", "two", "seg"].forEach(function(k, i){ if (typeof S.t[k] !== "number" || !isFinite(S.t[k])) S.t[k] = [0, 0, 0.5][i]; });
  S.steps = !!S.steps;
  var V = { xmin:-11, xmax:11, ymin:-11, ymax:11 };
  var busy = false, trail = [], ghost = null, marks = [], stopAnim = null, playStop = null, playing = false;
  host.innerHTML = '<div class="ln-ex"><div class="ln-main" data-mv="graph"><p class="eq-cap ln-eq" id="lx-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot square" id="lx-plot" role="img" aria-label="Vector board with a line, its point and its direction arrow"></canvas></div>' +
    '<label class="slider ln-tsl"><span class="slider-top"><span>' + m("t") + '</span><output id="lx-tout"></output></span>' +
    '<input type="range" id="lx-t" min="-5" max="5" step="0.5" style="accent-color:var(--ink)" aria-label="Parameter t"></label>' +
    '<div class="ln-trow"><button type="button" class="btn ghost sm" id="lx-play" data-k="lxplay" aria-pressed="false">' + C.playLabel + '</button>' +
    '<label class="ln-chk" id="lx-stepw"><input type="checkbox" id="lx-steps"> ' + C.stepsLabel + "</label></div></div>" +
    '<div class="ln-side"><div class="seg-wrap" id="lx-mode"></div><p class="tiny muted ln-how" id="lx-how"></p>' +
    '<dl class="read ln-read" id="lx-read" aria-live="polite"></dl><button type="button" class="btn ghost sm ln-more" id="lx-more" data-k="lxmore" aria-expanded="false">More</button>' +
    '<p class="tiny ln-note">' + C.note + "</p></div></div>";
  var plot = new MV.Plot($("#lx-plot", host), V);
  function L1(){
    if (S.mode === "seg") return { p:S.sg.a, d:[S.sg.b[0] - S.sg.a[0], S.sg.b[1] - S.sg.a[1]] };
    return S.mode === "two" ? { p:S.tw.p, d:S.tw.d } : { p:S.b.p, d:S.b.d };
  }
  function tNow(){ return S.t[S.mode]; }
  function P(t){ var L = L1(); return [r9(L.p[0] + t * L.d[0]), r9(L.p[1] + t * L.d[1])]; }
  function fmt(v){ var r = Math.round(v * 100) / 100; return near(r, v, 1e-9) ? nS(v) : nS(r); }
  function approx(v){ return near(Math.round(v * 100) / 100, v, 1e-9) ? "" : "≈ "; }
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), f3 = css("--f3"), hi = css("--hi"), sc = scene(V), L = L1(), t = tNow(), Pt = P(t);
    if (ghost) sc.lines.push({ p:ghost.p, q:[ghost.p[0] + ghost.d[0], ghost.p[1] + ghost.d[1]], color:hi, width:10 });
    if (S.mode === "seg") {
      var A = S.sg.a, B = S.sg.b;
      sc.lines.push({ p:A, q:B, color:ink2, width:1.5, dash:[6, 6] });
      sc.segments.push({ x1:A[0], y1:A[1], x2:B[0], y2:B[1], color:css("--hi-soft"), width:14 });
      sc.segments.push({ x1:A[0], y1:A[1], x2:B[0], y2:B[1], color:pen, width:3, arrow:true });
      var M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      sc.points.push({ x:M[0], y:M[1], r:5, open:true, color:ink });
      sc.labels.push({ x:M[0], y:M[1], text:"t = 1/2", dx:12, dy:-16, align:"left", bg:true, font:"italic 13px " + (css("--font-math") || "serif") });
      sc.points.push({ x:A[0], y:A[1], r:5.5, color:ink }, { x:B[0], y:B[1], r:5.5, color:ink });
      sc.labels.push({ x:A[0], y:A[1], text:"A", dx:-10, dy:-14, align:"right", bg:true, font:ui(15, 700) }, { x:B[0], y:B[1], text:"B", dx:10, dy:-14, align:"left", bg:true, font:ui(15, 700) });
    } else {
      lineScene(sc, L.p, L.d, { color:ink, posArrow:true, arrowColor:pen, tag:"m", label:"r₀", pt:false });
      if (S.mode === "two") lineScene(sc, S.tw.q, S.tw.e, { color:f3, dash:[10, 7], arrowColor:f3, tag:"m′", label:"r₀′", pt:false });
      if (S.steps) for (var k = -12; k <= 12; k++) { var q = P(k); if (Math.abs(q[0]) <= 11 && Math.abs(q[1]) <= 11) sc.points.push({ x:q[0], y:q[1], r:3.2, color:ink2 }); }
      sc.points.push({ x:L.p[0], y:L.p[1], r:5.5, color:ink });
      sc.points.push({ x:L.p[0] + L.d[0], y:L.p[1] + L.d[1], r:5, color:pen });
      if (S.mode === "two") sc.points.push({ x:S.tw.q[0], y:S.tw.q[1], r:5.5, color:f3 }, { x:S.tw.q[0] + S.tw.e[0], y:S.tw.q[1] + S.tw.e[1], r:5, color:f3 });
    }
    trail.forEach(function(q){ sc.points.push({ x:q[0], y:q[1], r:2.2, color:ink2 }); });
    marks.forEach(function(q){ sc.points.push({ x:q.x, y:q.y, r:8, open:true, color:ink }); sc.labels.push({ x:q.x, y:q.y, text:q.text, dx:q.dx || 0, dy:q.dy || -22, align:q.align || "center", bg:true, font:ui(13) }); });
    sc.points.push({ x:Pt[0], y:Pt[1], r:6.5, color:ink, ring:true });
    sc.labels.push({ x:Pt[0], y:Pt[1], text:"P", dx:10, dy:14, align:"left", font:mf(15), bg:true });
    sc.describe = describe();
    plot.draw(sc);
  }
  plot.render = draw;
  function describe(){
    var L = L1(), t = tNow(), Pt = P(t), sq = slopeQ(L.d);
    var s = (S.mode === "seg" ? "Segment from A" + ptTxt(S.sg.a[0], S.sg.a[1]) + " to B" + ptTxt(S.sg.b[0], S.sg.b[1]) + ", r = A + t(B − A) for 0 ≤ t ≤ 1. " : "Line " + MV.plain(m(vecEq(L.p, L.d, "t"))) + ". ") +
      "Current point at t = " + sg(fmt(t)) + ": " + ptTxt(fmt(Pt[0]), fmt(Pt[1])) + ". Slope " + (sq ? Q.txt(sq) : "undefined (vertical line)") + ".";
    if (S.mode === "two") s += " Second line " + MV.plain(m(vecEq(S.tw.q, S.tw.e, "s"))) + ", teal dashed. " + MV.plain(verdictHTML()) + ".";
    return s;
  }
  function verdictHTML(){
    var w = S.tw, rel = relate(w.p, w.d, w.q, w.e), T = C.verdict, pq = ptTxt(w.q[0], w.q[1]);
    if (rel.kind === "same") return tpl(T.same, { p:pq, t:m("t = " + Q.src(rel.t)) });
    if (rel.kind === "par") return tpl(T.par, { p:pq });
    return tpl(T.cross, { p:qPt(rel.x, rel.y), ts:m("t = " + Q.src(rel.t)) + ", " + m("s = " + Q.src(rel.s)) });
  }
  function paintRead(){
    var R = C.rows, L = L1(), t = tNow(), Pt = P(t), rows = [], sq = slopeQ(L.d);
    var cur = m("t = " + fmt(t)) + ": P = " + (approx(Pt[0]) || approx(Pt[1])) + m(ptSrc(fmt(Pt[0]), fmt(Pt[1])));
    var slope = sq ? m(Q.src(sq)) : C.vertical;
    if (S.mode === "seg") {
      var A = S.sg.a, B = S.sg.b;
      rows.push([R.vec, m("vec{r} = " + ptSrc(A[0], A[1]) + " + t" + ptSrc(L.d[0], L.d[1])) + ", " + m("0 <= t <= 1"), ""]);
      rows.push([R.par, m(comp("x", A[0], L.d[0])) + ", " + m(comp("y", A[1], L.d[1])), " ln-x2"]);
      rows.push([R.pt, cur, ""]);
      rows.push([R.mid, m("t = 1/2") + ": " + m(ptSrc((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)), " ln-x2"]);
      rows.push([R.slope, slope, " ln-x2"]);
    } else {
      rows.push([R.vec, m(vecEq(L.p, L.d, "t")) + ", " + m("t ∈ ℝ"), ""]);
      rows.push([R.par, m(comp("x", L.p[0], L.d[0])) + ", " + m(comp("y", L.p[1], L.d[1])), " ln-x2"]);
      rows.push([R.pt, cur, ""]);
      rows.push([R.slope, slope, " ln-x2"]);
      var yb = ymxb(L.p, L.d); if (yb) rows.push([R.ymxb, m(yb), " ln-x2"]);
      if (S.mode === "two") {
        rows.push([R.second, m(vecEq(S.tw.q, S.tw.e, "s")) + ", " + m("s ∈ ℝ"), " ln-x2"]);
        rows.push([R.verdict, verdictHTML(), ""]);
      }
    }
    $("#lx-read", host).innerHTML = rows.map(function(q){ return '<div class="ln-row' + q[2] + '"><dt>' + q[0] + "</dt><dd>" + q[1] + "</dd></div>"; }).join("");
  }
  function paintSlider(){
    var el = $("#lx-t", host), seg = S.mode === "seg", t = tNow(), Pt = P(t);
    var mn = seg ? "0" : "-5", mx = seg ? "1" : "5", st = seg ? "0.1" : "0.5";
    if (el.min !== mn || el.max !== mx || el.step !== st) { el.min = mn; el.max = mx; el.step = st; }
    if (!near(+el.value, t, 1e-6)) el.value = t;
    $("#lx-tout", host).textContent = sg(fmt(t));
    el.setAttribute("aria-valuetext", "t = " + sg(fmt(t)) + ": P = " + ptTxt(fmt(Pt[0]), fmt(Pt[1])));
  }
  function paintTop(){
    var L = L1();
    $("#lx-eq", host).innerHTML = S.mode === "seg" ? m("vec{r} = " + ptSrc(L.p[0], L.p[1]) + " + t" + ptSrc(L.d[0], L.d[1])) + ", " + m("0 <= t <= 1") :
      m(vecEq(L.p, L.d, "t")) + (S.mode === "two" ? '<span class="ln-eq2">' + m(vecEq(S.tw.q, S.tw.e, "s")) + "</span>" : "");
    MV.keepFocus($("#lx-mode", host), function(){ $("#lx-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    $("#lx-how", host).innerHTML = C.modeHow[S.mode];
    $("#lx-stepw", host).hidden = S.mode === "seg";
    $("#lx-steps", host).checked = S.steps;
  }
  function paintPlay(){ var b = $("#lx-play", host); b.textContent = playing ? "Pause" : C.playLabel.replace(/<[^>]+>/g, ""); b.setAttribute("aria-pressed", String(playing)); }
  function paint(){ paintTop(); paintSlider(); paintRead(); paintPlay(); draw(); }
  function paintLight(){ paintSlider(); paintRead(); draw(); }
  function stopPlay(){ if (playStop) { playStop(); playStop = null; } playing = false; paintPlay(); api.save(); }
  function clearMarks(){ trail = []; ghost = null; marks = []; }
  function setT(v, keepTrail){
    S.t[S.mode] = r9(v);
    if (keepTrail) { trail.push(P(S.t[S.mode])); if (trail.length > 160) trail.shift(); }
    paintLight();
  }
  function play(){
    if (playing) { stopPlay(); return; }
    if (busy) return;
    var seg = S.mode === "seg", lo = seg ? 0 : -5, hi = seg ? 1 : 5;
    clearMarks(); playing = true; paintPlay();
    if (MV.reduceMotion) {
      var stepv = seg ? 0.5 : 1, k = lo, timer = null;
      playStop = function(){ clearTimeout(timer); };
      var tick = function(){
        setT(k, true); k = r9(k + stepv);
        if (k > hi + 1e-9) { playStop = null; playing = false; paintPlay(); api.save(); MV.changed(); return; }
        timer = setTimeout(tick, 450);
      };
      tick();
      return;
    }
    playStop = MV.tween({ dur:seg ? 2200 : 5200, ease:function(u){ return u; }, step:function(u){ setT(lo + (hi - lo) * u, true); },
      done:function(){ playStop = null; playing = false; setT(hi, true); paintPlay(); api.save(); MV.changed(); } });
  }
  function c6(v){ return clamp(Math.round(v), -6, 6); }
  function c4(v){ return clamp(Math.round(v), -4, 4); }
  function setHandle(id, x, y){
    if (S.mode === "seg") {
      var key = id === "A" ? "a" : "b", np = [c6(x), c6(y)], other = S.sg[key === "a" ? "b" : "a"];
      if (same(np, other) || same(np, S.sg[key])) return;
      S.sg[key] = np;
    } else {
      var Lp = S.mode === "two" ? S.tw : S.b, pk = id === "q" || id === "e" ? "q" : "p", dk = pk === "q" ? "e" : "d";
      if (id === "p" || id === "q") { var p2 = [c6(x), c6(y)]; if (same(p2, Lp[pk])) return; Lp[pk] = p2; }
      else { var d2 = [c4(x - Lp[pk][0]), c4(y - Lp[pk][1])]; if ((!d2[0] && !d2[1]) || same(d2, Lp[dk])) return; Lp[dk] = d2; }
    }
    if (playing) stopPlay();
    clearMarks(); api.save(); paint(); MV.changed();
  }
  var dr = MV.drag(plot, {
    handles:function(){
      if (S.mode === "seg") return [
        { id:"A", x:S.sg.a[0], y:S.sg.a[1], label:"Point A at " + ptTxt(S.sg.a[0], S.sg.a[1]) + ". Arrow keys move it one grid step." },
        { id:"B", x:S.sg.b[0], y:S.sg.b[1], label:"Point B at " + ptTxt(S.sg.b[0], S.sg.b[1]) + ". Arrow keys move it one grid step." }];
      var Lp = S.mode === "two" ? S.tw : S.b, hs = [
        { id:"p", x:Lp.p[0], y:Lp.p[1], label:"Point r0 at " + ptTxt(Lp.p[0], Lp.p[1]) + ". Arrow keys move it one grid step." },
        { id:"tip", x:Lp.p[0] + Lp.d[0], y:Lp.p[1] + Lp.d[1], label:"Tip of the direction arrow m = " + ptTxt(Lp.d[0], Lp.d[1]) + ". Arrow keys change it one grid step." }];
      if (S.mode === "two") hs.push(
        { id:"q", x:S.tw.q[0], y:S.tw.q[1], label:"Second point r0′ at " + ptTxt(S.tw.q[0], S.tw.q[1]) + ". Arrow keys move it one grid step." },
        { id:"e", x:S.tw.q[0] + S.tw.e[0], y:S.tw.q[1] + S.tw.e[1], label:"Tip of the second direction arrow m′ = " + ptTxt(S.tw.e[0], S.tw.e[1]) + ". Arrow keys change it one grid step." });
      return hs;
    },
    snap:function(x, y){ return [Math.round(x), Math.round(y)]; },
    move:function(id, x, y){ if (busy) return; setHandle(id, x, y); },
    key:function(id, e){ if (busy && /^Arrow/.test(e.key)) return true; return false; }
  });
  void dr;
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.id === "lx-more") { var on = !$("#lx-read", host).classList.contains("ln-all"); $("#lx-read", host).classList.toggle("ln-all", on); b.setAttribute("aria-expanded", String(on)); b.textContent = on ? "Less" : "More"; return; }
    if (b.id === "lx-play") { play(); return; }
    if (busy) return;
    if (b.dataset.mode && b.dataset.mode !== S.mode) { if (playing) stopPlay(); S.mode = b.dataset.mode; clearMarks(); api.save(); paint(); MV.changed(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "lx-t") { if (busy) { paintSlider(); return; } if (playing) stopPlay(); setT(+t.value, true); api.save(); MV.changed(); return; }
    if (t.id === "lx-steps") { S.steps = t.checked; api.save(); draw(); }
  });
  paint();

  // ---- predictions ----
  function tweenT(a, b, dur, cb){
    stopAnim = MV.tween({ dur:dur, step:function(u){ S.t.build = r9(a + (b - a) * u); trail.push(P(S.t.build)); paintLight(); },
      done:function(){ stopAnim = null; S.t.build = b; paint(); if (cb) cb(); } });
  }
  function anim(dur, step, cb){ stopAnim = MV.tween({ dur:dur, step:step, done:function(){ stopAnim = null; if (cb) cb(); } }); }
  var keepSteps = null;
  // ---- challenges (exact tests from the plan; V12: the same line is accepted however it is described) ----
  function par(d, w){ return d[0] * w[1] - d[1] * w[0] === 0; }
  function chal(id){
    var M = MS[id];
    if (id === "tc1") {
      if (S.mode !== "build") return { ok:false, msg:M.mode };
      var d = S.b.d, p = S.b.p, ok1 = par(d, [6, -4]), on = 2 * p[0] + 3 * p[1] === 5;
      if (ok1 && on) return { ok:true };
      if (same(d, [2, 2])) return { ok:false, msg:M.ab };
      if (par(d, [-2, 3])) return { ok:false, msg:M.swap };
      if (ok1) return { ok:false, msg:M.off };
      return { ok:false, msg:M.other };
    }
    if (id === "tc2") {
      if (S.mode !== "build") return { ok:false, msg:M.mode };
      var d2 = S.b.d, p2 = S.b.p, onNew = 2 * p2[0] - p2[1] === 5, onOld = 2 * p2[0] - p2[1] === -1;
      if (same(d2, [1, 2])) return onNew ? { ok:true } : { ok:false, msg:onOld ? M.orig : M.off };
      if (par(d2, [1, 2])) return { ok:false, msg:onOld ? M.orig : M.xone };
      if (par(d2, [2, 1])) return { ok:false, msg:M.swap };
      var sq = slopeQ(d2);
      return { ok:false, msg:tpl(M.other, { m:sq ? m(Q.src(sq)) : C.vertical }) };
    }
    if (id === "tc3") {
      if (S.mode !== "two") return { ok:false, msg:M.mode };
      var w = S.tw;
      if (!same(w.p, [2, 1]) || !same(w.d, [4, -2])) return { ok:false, msg:M.l1 };
      var pe = par(w.e, [2, -1]), onL = w.q[0] + 2 * w.q[1] === 4;
      if (pe && onL && w.e[0] < 0 && !same(w.q, [2, 1])) return { ok:true };
      if (pe && same(w.q, [0, 0])) return { ok:false, msg:M.origin };
      if (same(w.e, [-4, -2])) return { ok:false, msg:M.notpar };
      if (pe && onL && w.e[0] > 0) return { ok:false, msg:M.pos };
      if (pe && onL) return { ok:false, msg:M.same0 };
      if (pe) return { ok:false, msg:tpl(M.dist, { p:ptTxt(w.q[0], w.q[1]) }) };
      return { ok:false, msg:M.cross };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stopAnim) { stopAnim(); stopAnim = null; }
        if (playing) stopPlay();
        if (keepSteps !== null) { S.steps = keepSteps; keepSteps = null; }
        busy = true; S.mode = "build"; S.b = { p:[1, 2], d:[3, -1] }; S.t.build = 0; clearMarks();
        if (p.id === "p4") marks = [{ x:10, y:0, text:"(10, 0)", dx:-6, dy:-22, align:"right" }];
        paint();
      },
      run:function(p, done){
        function fin(){ busy = false; if (keepSteps !== null) { S.steps = keepSteps; keepSteps = null; } api.save(); paint(); MV.changed(); done(); }
        if (p.id === "p1") tweenT(0, -2, 1500, function(){ marks = [{ x:-5, y:4, text:"t = −2: (−5, 4)", dy:-24 }]; paint(); MV.wait(1000, fin); });
        else if (p.id === "p2") {
          keepSteps = S.steps; S.steps = true; paint();
          MV.wait(500, function(){
            anim(1400, function(u){ S.b.d = [3 * (1 + u), -(1 + u)]; draw(); }, function(){
              S.b.d = [6, -2]; trail = []; paint();
              MV.wait(400, function(){ tweenT(0, 2, 1600, function(){ MV.wait(900, fin); }); });
            });
          });
        }
        else if (p.id === "p3") {
          ghost = { p:[1, 2], d:[3, -1] }; draw();
          MV.wait(400, function(){ anim(1500, function(u){ S.b.p = [1 + 3 * u, 2 - u]; draw(); }, function(){ S.b.p = [4, 1]; paint(); MV.wait(1100, fin); }); });
        }
        else if (p.id === "p4") tweenT(0, 3, 1700, function(){ marks.push({ x:10, y:-1, text:"t = 3: (10, −1)", dx:-6, dy:24, align:"right" }); paint(); MV.wait(1100, fin); });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Same line or not? (verdict chips as a radio group, then "Check it with algebra" with N13 steps) ----------
function part3(host, api){
  var S = api.S, C = api.content, ST = C.stations, VW = { xmin:-3, xmax:9, ymin:-3, ymax:9 };
  S.v = S.v || {}; S.fin = S.fin || {};
  function hasV(st){ return !st.slope; }
  host.innerHTML = ST.map(function(st){
    var e1 = m(vecEq(st.l1.p, st.l1.d, "t")), e2 = m(vecEq(st.l2.p, st.l2.d, "s"));
    return '<div class="part ln-st" data-st="' + st.id + '"><h3>' + st.title + "</h3>" + (st.text ? "<p>" + st.text + "</p>" : "") +
      '<div class="ln-stg"><div class="ln-stl"><p class="ln-eqs"><span class="ln-sw ln-sw1" aria-hidden="true"></span>L₁: ' + e1 + '<br><span class="ln-sw ln-sw2" aria-hidden="true"></span>L₂: ' + e2 + "</p>" +
      (hasV(st) ? '<div class="ln-vd"></div><div class="ln-vfb" aria-live="polite"></div>' : "") +
      '<div class="ln-alg"' + (hasV(st) && !S.v[st.id] ? " hidden" : "") + '><h4>' + C.algTitle + '</h4><ol class="ln-steps" aria-live="polite"></ol><div class="ln-pl"></div>' +
      (st.banner ? '<p class="banner ln-bn" aria-live="polite"></p>' : "") + "</div>" +
      (hasV(st) ? '<p class="tiny muted ln-lock"' + (S.v[st.id] ? " hidden" : "") + ">" + C.locked + "</p>" : "") + "</div>" +
      '<div class="ln-str"><div class="plot-wrap"><canvas class="plot square" role="img" aria-label="The two lines of ' + MV.esc(MV.plain(st.title)) + '"></canvas></div></div></div></div>';
  }).join("");
  var plots = {};
  function boxOf(st){ return $('[data-st="' + st.id + '"]', host); }
  function drawSt(st){
    var pl = plots[st.id], ink = css("--ink"), f3 = css("--f3"), pen = css("--pen"), sc = scene(VW), fin = !!S.fin[st.id];
    lineScene(sc, st.l1.p, st.l1.d, { color:ink, arrowColor:pen, ptColor:ink });
    lineScene(sc, st.l2.p, st.l2.d, { color:f3, dash:[10, 7], arrowColor:f3, ptColor:f3 });
    var l1 = st.slope ? "y = 2x − 2" : "L₁", l2 = st.slope ? "y = −x + 7" : "L₂";
    function edgeLab(L, txt, col, side){
      // place the label where the line leaves the top or right of the view
      var p = L.p, d = L.d, best = null;
      for (var k = -20; k <= 20; k += 0.25) { var x = p[0] + k * d[0], y = p[1] + k * d[1]; if (x > VW.xmin + 0.5 && x < VW.xmax - 0.5 && y > VW.ymin + 0.5 && y < VW.ymax - 0.8) { if (!best || (side ? x > best[0] : y > best[1])) best = [x, y]; } }
      if (best) sc.labels.push({ x:best[0], y:best[1], text:txt, dx:side ? -8 : 10, dy:side ? -16 : 4, align:side ? "right" : "left", color:col, font:st.slope ? "italic 600 14px " + (css("--font-math") || "serif") : ui(14, 700), bg:true });
    }
    edgeLab(st.l1, l1, ink, 0); edgeLab(st.l2, l2, f3, 1);
    var rel = relate(st.l1.p, st.l1.d, st.l2.p, st.l2.d), why;
    if (fin) {
      if (rel.kind === "cross") { var x = Q.val(rel.x), y = Q.val(rel.y); sc.points.push({ x:x, y:y, r:6.5, color:ink, ring:true }); sc.labels.push({ x:x, y:y, text:qPt(rel.x, rel.y), dx:12, dy:4, align:"left", bg:true, font:ui(14) }); why = "They cross at " + qPt(rel.x, rel.y) + "."; }
      else if (rel.kind === "same") { sc.points.push({ x:st.l2.p[0], y:st.l2.p[1], r:6.5, color:f3, ring:true }); sc.labels.push({ x:st.l2.p[0], y:st.l2.p[1], text:"on L₁ at t = " + Q.txt(rel.t), dx:-12, dy:2, align:"right", bg:true, font:ui(13) }); why = "L₂’s point is on L₁: the same line."; }
      else { sc.points.push({ x:st.l2.p[0], y:st.l2.p[1], r:8, open:true, color:f3 }); sc.labels.push({ x:st.l2.p[0], y:st.l2.p[1], text:"not on L₁", dx:12, dy:-14, align:"left", bg:true, font:ui(13) }); why = "L₂’s point is not on L₁: parallel and distinct."; }
    }
    sc.describe = "L₁ " + MV.plain(m(vecEq(st.l1.p, st.l1.d, "t"))) + " in ink and L₂ " + MV.plain(m(vecEq(st.l2.p, st.l2.d, "s"))) + " in teal dashes. " + (why || "");
    pl.draw(sc);
  }
  function rg(st){
    var v = S.v[st.id];
    return '<div class="chips ln-rg" role="radiogroup" aria-label="Verdict for ' + MV.esc(MV.plain(st.title)) + '">' + C.verdicts.map(function(o, i){
      var on = v === o.id, tab = on || (!v && i === 0);
      return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-vd="' + o.id + '" data-k="vd' + st.id + o.id + '">' + o.t + "</button>";
    }).join("") + "</div>";
  }
  function fbOf(st){
    var v = S.v[st.id], a = MV.ans(st), F = C.verdictFb; if (!v) return "";
    if (v === a) return MV.fbHTML("good", F.right);
    var msg = a === "cross" ? F.parWhenCross : v === "cross" ? F.crossWhenPar : v === "same" ? F.sameWhenPar : F.parWhenSame;
    return MV.fbHTML("bad", msg);
  }
  function paintSt(st){
    var box = boxOf(st);
    if (hasV(st)) {
      MV.keepFocus($(".ln-vd", box), function(){ $(".ln-vd", box).innerHTML = rg(st); });
      $(".ln-vfb", box).innerHTML = fbOf(st);
      $(".ln-alg", box).hidden = !S.v[st.id];
      $(".ln-lock", box).hidden = !!S.v[st.id];
    }
    var bn = $(".ln-bn", box); if (bn) { bn.textContent = ""; bn.innerHTML = S.fin[st.id] ? st.banner : ""; bn.hidden = !S.fin[st.id]; }
    drawSt(st);
  }
  ST.forEach(function(st){
    var box = boxOf(st);
    plots[st.id] = new MV.Plot($("canvas", box), VW);
    plots[st.id].render = function(){ drawSt(st); };
    MV.player($(".ln-pl", box), { count:st.steps.length, interval:1700,
      label:function(i){ return "Step " + (i + 1) + " of " + st.steps.length; },
      render:function(i){
        $(".ln-steps", box).innerHTML = st.steps.map(function(t, j){ return j <= i ? '<li class="' + (j === i ? "cur" : "") + '"><span class="sn">' + (j + 1) + ".</span><span>" + t + "</span></li>" : ""; }).join("");
        if (i === st.steps.length - 1 && !S.fin[st.id]) { S.fin[st.id] = true; api.save(); paintSt(st); }
      } });
    paintSt(st);
  });
  function choose(st, id){ S.v[st.id] = id; api.save(); paintSt(st); var b = $('[data-vd="' + id + '"]', boxOf(st)); if (b) b.focus(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button[data-vd]"); if (!b) return;
    var box = b.closest("[data-st]"), st = ST.filter(function(s){ return s.id === box.dataset.st; })[0];
    e.stopPropagation(); choose(st, b.dataset.vd);
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest("button[data-vd]"); if (!b) return;
    var dir = /^Arrow(Right|Down)$/.test(e.key) ? 1 : /^Arrow(Left|Up)$/.test(e.key) ? -1 : 0; if (!dir) return;
    e.preventDefault();
    var box = b.closest("[data-st]"), st = ST.filter(function(s){ return s.id === box.dataset.st; })[0], ids = C.verdicts.map(function(o){ return o.id; });
    choose(st, ids[(ids.indexOf(b.dataset.vd) + dir + ids.length) % ids.length]);
  });
  return {};
}

// ---------- Practice 2: The missing piece (N4 number boxes; a point takes two boxes) ----------
function missingAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function nv(s){ var p = MV.parseNum(s); return p && p.length === 1 ? p[0] : NaN; }
  function keys(it){ return it.point ? ["x", "y"] : it.boxes.map(function(b){ return b.k; }); }
  function kName(it, k){ return it.point ? m(k) + "-coordinate" : m(k); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q ln-pq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="ln-pin"></div><div class="ln-pcl"></div></div>';
  }).join("");
  function inp(it, k, label, x){ return '<input class="numin short" data-bx="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .ln-pin', host), h;
    if (it.point) h = '<div class="ln-ptin"><span class="m">(</span>' + inp(it, "x", "x-coordinate", x) + '<span class="m">,</span>' + inp(it, "y", "y-coordinate", x) + '<span class="m">)</span></div>';
    else h = '<div class="ln-bxs">' + it.boxes.map(function(b){ return "<label><span>" + b.pre + "</span>" + inp(it, b.k, "Value of " + b.label, x) + "</label>"; }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .ln-pcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function val(raw){ var t = String(raw || "").trim(); if (!t) return { empty:true }; var v = nv(t); return isFinite(v) ? { v:v } : { err:true }; }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), ks = keys(it), vals = {}, i;
    for (i = 0; i < ks.length; i++) { var r = val(x.v[ks[i]]); if (r.empty) return { err:TX.empty }; if (r.err) return { err:TX.err }; vals[ks[i]] = r.v; }
    if (ks.every(function(k){ return near(vals[k], nv(ans[k])); })) return { ok:true };
    var w = (it.wrong || []).filter(function(z){ return Object.keys(z.v).every(function(k){ return near(vals[k], nv(z.v[k])); }); })[0];
    if (w) return { ok:false, msg:w.fb };
    var right = ks.filter(function(k){ return near(vals[k], nv(ans[k])); });
    if (ks.length > 1 && right.length) return { ok:false, msg:tpl(TX.half, { k:kName(it, right[0]) }) };
    return { ok:false, msg:TX.wrong };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
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

// ---------- Performance task: Quadrant to quadrant (whole-number steppers for a, b, c, d) ----------
var task = (function(){
  var api, plot;
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -6 && v <= 6 ? v : null; }
  function read(){ var a = gi("a"), b = gi("b"), c = gi("c"), d = gi("d"); return { a:a, b:b, c:c, d:d, valid:a !== null && b !== null && c !== null && d !== null && !(c === 0 && d === 0) }; }
  function checks(d){
    if (!d.valid) return [false, false, false];
    return [d.c + 2 * d.d === 0 && d.a + 2 * d.b === 5, d.a < 0 && d.b > 0, d.a + 2 * d.c > 0 && d.b + 2 * d.d < 0];
  }
  function eqOf(d){ return vecEq([d.a, d.b], [d.c, d.d], "t"); }
  function draw(){
    var d = read(), V = { xmin:-8, xmax:8, ymin:-8, ymax:8 }, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), sc = scene(V, { quads:true, xTicks:{ step:1, fmt:tk }, yTicks:{ step:1, fmt:tk } });
    sc.lines.push({ p:[1, 2], q:[5, 0], color:ink2, width:1.6, dash:[6, 6] });
    sc.points.push({ x:1, y:2, r:4, color:ink2 }, { x:5, y:0, r:4, color:ink2 });
    sc.labels.push({ x:1, y:2, text:"P", dx:8, dy:-14, align:"left", color:ink2, font:ui(13, 700), bg:true }, { x:5, y:0, text:"Q", dx:8, dy:-14, align:"left", color:ink2, font:ui(13, 700), bg:true });
    var desc = "Line L through P(1, 2) and Q(5, 0), faint dashes.";
    if (d.valid) {
      lineScene(sc, [d.a, d.b], [d.c, d.d], { color:ink, arrowColor:pen, pt:false });
      [0, 1, 2].forEach(function(t){ var x = d.a + t * d.c, y = d.b + t * d.d; sc.points.push({ x:x, y:y, r:t === 1 ? 4.5 : 6, color:ink, ring:t !== 1 }); sc.labels.push({ x:x, y:y, text:"t = " + t, dx:10, dy:16, align:"left", bg:true, font:"italic 13px " + (css("--font-math") || "serif") }); });
      desc += " Your line " + MV.plain(m(eqOf(d))) + " with points at t = 0 " + ptTxt(d.a, d.b) + ", t = 1 " + ptTxt(d.a + d.c, d.b + d.d) + " and t = 2 " + ptTxt(d.a + 2 * d.c, d.b + 2 * d.d) + ".";
    }
    sc.describe = desc;
    plot.draw(sc);
  }
  function readout(){
    var d = read(), el = $("#lq-read"); if (!el) return;
    var rows = [["Your line", d.valid ? m(eqOf(d)) : '<span class="muted">Choose whole numbers from −6 to 6, with (' + m("c") + ", " + m("d") + ") ≠ (0, 0).</span>"]];
    if (d.valid) { rows.push([m("t = 0"), m(ptSrc(d.a, d.b))]); rows.push([m("t = 2"), m(ptSrc(d.a + 2 * d.c, d.b + 2 * d.d))]); }
    el.innerHTML = MV.readoutHTML(rows);
  }
  function stepper(k){
    return '<div class="lq-step"><label for="lq-' + k + '"><span class="m lq-lab">' + m(k) + '</span> <span class="tiny muted">(−6 to 6)</span></label>' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="lq' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="lq-' + k + '" data-tk="' + k + '" type="number" min="-6" max="6" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="lq' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.a == null) { a.S.a = "0"; a.S.b = "0"; a.S.c = "1"; a.S.d = "1"; }
      inp.innerHTML = '<p class="tiny" style="font-weight:700;margin:0">' + m("vec{r} = (a, b) + t(c, d)") + "</p>" +
        '<p class="tiny" style="font-weight:700;margin:12px 0 0">Starting point (' + m("a") + ", " + m("b") + ")</p>" + stepper("a") + stepper("b") +
        '<p class="tiny" style="font-weight:700;margin:14px 0 0">Direction (' + m("c") + ", " + m("d") + ")</p>" + stepper("c") + stepper("d");
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot square" id="lq-plot" role="img" aria-label="Line L and your line"></canvas></div><dl class="read" id="lq-read" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#lq-plot"), { xmin:-8, xmax:8, ymin:-8, ymax:8 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(Math.max(-6, Math.min(6, cur + +b.dataset.dir))); $("#lq-" + k).value = a.S[k];
        a.save(); draw(); readout(); a.update();
      });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Choose whole numbers from −6 to 6 for " + m("a") + ", " + m("b") + ", " + m("c") + " and " + m("d") + ", with (" + m("c") + ", " + m("d") + ") ≠ (0, 0)."; },
    checks:checks,
    key:function(d){ return [d.a, d.b, d.c, d.d].join(","); },
    label:function(k){ var v = k.split(",").map(Number); return m(vecEq([v[0], v[1]], [v[2], v[3]], "t")); },
    text:function(k){ var v = k.split(",").map(Number); return MV.plain(m(vecEq([v[0], v[1]], [v[2], v[3]], "t"))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ missing:missingAct },
  task:task
});
})();
