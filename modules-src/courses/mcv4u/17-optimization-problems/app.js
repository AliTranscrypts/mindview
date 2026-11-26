// MCV4U 17 Optimization Problems: hero (a 24 cm sheet folds into a box while V(x) traces to its peak), Box builder (Explore:
// V10 shape stage with a box-from-a-sheet and a field-along-a-river scenario, V5-style V′ panel), The optimization algorithm
// (Part 3: N5 step ordering, N29 chip-slot model builder, V11 sign chart), Model builder (Practice 1, slot chips), Solve it
// (Practice 2, V8 boxes) and the "Design a sheet" task (V10 preview).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
// at most dp decimals, with "≈ " in front when rounding changed the value
function dec(v, dp){ var r = r9(v), p = Math.pow(10, dp); return (Math.abs(r * p - Math.round(r * p)) > 1e-6 ? "≈ " : "") + num(r, dp); }
// placeholders #1, #2, #3 (they survive backtick math, unlike {x})
function tpl(s, a){ return String(s).replace(/#(\d)/g, function(_, k){ return a[k - 1] != null ? a[k - 1] : "#" + k; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function narrow(){ return !!(window.matchMedia && window.matchMedia("(max-width: 560px)").matches); }
function f2(v){ return Math.round(v * 10) / 10; }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function chipRow(name, opts, val, label){
  return '<div class="chips op-chips" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    var on = val === o.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + on + '">' + o.t + "</button>"; }).join("") + "</div>";
}
function probeLine(ctx, p, x){
  var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
}
// number typed by a student: spaces, thin spaces and thousands commas removed
function typedNum(raw){ var t = String(raw == null ? "" : raw).replace(/[\s  ]/g, "").replace(/,(?=\d{3}\b)/g, ""); if (!t) return null; var p = MV.parseNum(t); return p && p.length === 1 && isFinite(p[0]) ? p[0] : NaN; }

// =====================================================================================================================
// @component V10 shapeStage — a figure driven by one variable (box from a sheet, field along a river; a can or a path plugs in
// as another fig function) beside its objective graph. The graph shows the feasible domain (a light band, a --hi strip on the
// x-axis and closed endpoint dots), the objective on the domain (--pen 3 px; upTo draws it only up to a value, for traces),
// the current point (ink) with a value label and a dashed drop line, a "best so far" ring and labelled marks. An optional
// derivative panel underneath (V5 style: --f3 2.6 px, shared dashed probe line, "slope" label) shares the x-axis. The probe
// drags on either graph (tap anywhere too) and has a keyboard handle (arrows = step, Shift + arrows = big step).
//   var st = shapeStage(host, { spec(){ return { f, df, dom:[lo, hi], view, dView, xLabel, yLabel, dLabel, step, big,
//       fig(x) -> { svg, view:"0 0 w h", aria }, upTo, marks:[{x, y, text, dx, dy, align}], best:{x, y}, showD,
//       valueText(x), describe(x), dDescribe(x), handleLabel(x) }; }, x, noDrag, locked(), onMove(x, how) })
//   -> { set(x, how), get(), render(), plots:[main, d], focus() }   how: "drag" | "key" | "tap" | "slider" | "typed" | "set" | "anim"
// Figures: v10Box({L, W, x, fold, cuts, cutHi, labels}) folds an open box up from an L × W sheet (isometric view, base --pen
// at --v10-fo, flaps outside/inside shades, dashed corner squares while flat); v10Field({P, x, k, div, quads, labels}) is a top
// view (river band --op-river, fence --ink, field --hi-soft, optional divider, scale bar).
function shapeStage(host, o){
  var x = o.x || 0;
  host.classList.add("v10");
  host.innerHTML = '<div class="v10-fig"><svg class="v10-svg" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" aria-label="Figure"></svg></div>' +
    '<div class="v10-gr"><div class="plot-wrap"><canvas class="plot v10-main" role="img" aria-label="Graph of the quantity"></canvas></div>' +
    '<div class="v10-low" hidden><div class="plot-wrap"><canvas class="plot v10-d" role="img" aria-label="Graph of the derivative"></canvas></div></div></div>';
  var svg = $("svg", host), low = $(".v10-low", host);
  var P = new MV.Plot($(".v10-main", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), D = new MV.Plot($(".v10-d", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  function snapX(v, sp){ var st = sp.step || 1; return r9(clamp(Math.round(v / st) * st, sp.dom[0], sp.dom[1])); }
  function drawFig(sp){ var F = sp.fig(x); svg.setAttribute("viewBox", F.view); svg.innerHTML = F.svg; svg.setAttribute("aria-label", F.aria); }
  function drawMain(sp){
    var V = sp.view, y = sp.f(x), ink = css("--ink"), lo = sp.dom[0], hi = sp.dom[1], yr = V.ymax - V.ymin;
    var to = sp.upTo == null ? hi : clamp(sp.upTo, lo, hi);
    var sc = { view:V, xLabel:sp.xLabel, yLabel:sp.yLabel, bands:[{ x0:lo, x1:hi, color:css("--hi-soft"), alpha:0.6 }],
      curves:to > lo ? [{ f:sp.f, color:css("--pen"), width:3, domain:[lo, to] }] : [],
      segments:[{ x1:lo, y1:0, x2:hi, y2:0, color:css("--hi"), width:4 }], points:[], labels:[] };
    (sp.marks || []).forEach(function(q){
      sc.points.push({ x:q.x, y:q.y, r:7, open:true, color:ink });
      var right = (q.x - V.xmin) / (V.xmax - V.xmin) > 0.6, top = (q.y - V.ymin) / yr > 0.82;
      sc.labels.push({ x:q.x, y:q.y, text:q.text, dx:q.dx != null ? q.dx : right ? -10 : 10, dy:q.dy != null ? q.dy : top ? 18 : -16, align:q.align || (right ? "right" : "left"), bg:true, font:ui(12) });
    });
    if (sp.best && !near(sp.best.x, x, 1e-6)) sc.points.push({ x:sp.best.x, y:sp.best.y, r:6, open:true, color:css("--ink-2") });
    sc.segments.push({ x1:x, y1:0, x2:x, y2:y, color:css("--ink-2"), width:1.5, dash:[4, 4] });
    sc.points.push({ x:lo, y:0, r:4.5, color:ink }, { x:hi, y:0, r:4.5, color:ink }, { x:x, y:y, r:6.5, color:ink });
    if (sp.valueText && !(sp.marks || []).some(function(q){ return near(q.x, x, 1e-6); })) {
      var rt = (x - V.xmin) / (V.xmax - V.xmin) > 0.62, hiY = (y - V.ymin) / yr > 0.8;
      sc.labels.push({ x:x, y:y, text:sp.valueText(x), dx:rt ? -12 : 12, dy:hiY ? 20 : -18, align:rt ? "right" : "left", bg:true, font:ui(13, 700) });
    }
    sc.describe = sp.describe ? sp.describe(x) : "";
    P.draw(sc);
  }
  function drawD(sp){
    if (!sp.showD) return;
    var V = { xmin:sp.view.xmin, xmax:sp.view.xmax, ymin:sp.dView.ymin, ymax:sp.dView.ymax }, d = sp.df(x), f3 = css("--f3"), inV = d >= V.ymin && d <= V.ymax;
    var rt = (x - V.xmin) / (V.xmax - V.xmin) > 0.62, txt = Math.abs(d) < 1e-9 ? "slope = 0" : "slope " + (dec(d, 1).indexOf("≈") === 0 ? "≈ " : "= ") + num(d, 1);
    D.draw({ view:V, xLabel:sp.xLabel, yLabel:sp.dLabel, curves:[{ f:sp.df, color:f3, width:2.6, domain:sp.dom }],
      points:inV ? [{ x:x, y:d, r:5, color:f3 }] : [],
      labels:[{ x:x, y:clamp(d, V.ymin, V.ymax), text:txt, dx:rt ? -12 : 12, dy:d > (V.ymin + V.ymax) / 2 ? 18 : -16, align:rt ? "right" : "left", bg:true, font:ui(12) }],
      after:function(ctx, pl){ probeLine(ctx, pl, x); }, describe:sp.dDescribe ? sp.dDescribe(x) : "" });
  }
  var drawing = false;
  function render(){
    if (drawing) return; drawing = true;
    try { var sp = o.spec(); low.hidden = !sp.showD; drawFig(sp); drawMain(sp); drawD(sp); } finally { drawing = false; }
  }
  P.render = render; D.render = render;
  function set(v, how){
    if (o.locked && o.locked() && how !== "anim" && how !== "set") return;
    var sp = o.spec();
    v = how === "anim" ? clamp(v, sp.dom[0], sp.dom[1]) : snapX(v, sp);
    var prev = x; x = v;
    if (o.onMove) o.onMove(x, how, prev);
    render();
  }
  var dr = null;
  if (!o.noDrag) {
    dr = MV.drag(P, { axis:"x", step:{ x:1, y:1 },
      handles:function(){ var sp = o.spec(), V = sp.view; return [{ id:"probe", x:x, y:clamp(sp.f(x), V.ymin, V.ymax), label:sp.handleLabel ? sp.handleLabel(x) : "Probe at x = " + num(x) }]; },
      key:function(id, e){
        if (!/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return false;
        var sp = o.spec(), dir = /Left|Down/.test(e.key) ? -1 : 1; set(x + dir * (e.shiftKey ? sp.big : sp.step), "key"); return true;
      },
      move:function(id, nx){ set(nx, "drag"); } });
    [P, D].forEach(function(p){
      var active = false;
      function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
      p.c.addEventListener("pointerdown", function(e){
        if (e.defaultPrevented || !p.v || (o.locked && o.locked())) return;
        active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {}
        set(at(e), "tap");
      });
      p.c.addEventListener("pointermove", function(e){ if (active) set(at(e), "drag"); });
      p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
    });
  }
  return { set:set, get:function(){ return x; }, render:render, plots:[P, D], focus:function(){ if (dr) dr.focus("probe"); } };
}
// ---- V10 figures ----
var V10_PHI = 0.52, V10_EL = 0.6, v10Frames = {};
function v10Prj(X, Y, Z){
  var c = Math.cos(V10_PHI), s = Math.sin(V10_PHI), rx = X * c - Y * s, ry = X * s + Y * c;
  return [rx, -(Z * Math.cos(V10_EL) + ry * Math.sin(V10_EL)), ry * Math.cos(V10_EL) - Z * Math.sin(V10_EL)];
}
function v10Frame(L, W){
  var key = L + "x" + W; if (v10Frames[key]) return v10Frames[key];
  var hm = Math.min(L, W) / 2, pts = [];
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function(s){ pts.push(v10Prj(s[0] * L / 2, s[1] * W / 2, 0), v10Prj(s[0] * (L / 2 - hm), s[1] * (W / 2 - hm), hm)); });
  var x0 = Math.min.apply(null, pts.map(function(p){ return p[0]; })), x1 = Math.max.apply(null, pts.map(function(p){ return p[0]; }));
  var y0 = Math.min.apply(null, pts.map(function(p){ return p[1]; })), y1 = Math.max.apply(null, pts.map(function(p){ return p[1]; }));
  var k = Math.min(290 / (x1 - x0), 190 / (y1 - y0)), H = Math.round((y1 - y0) * k + 64);
  return (v10Frames[key] = { k:k, tx:35 + (290 - (x1 - x0) * k) / 2 - x0 * k, ty:26 - y0 * k, H:H });
}
function v10Poly(pts, cls){ return '<polygon class="' + cls + '" points="' + pts.map(function(p){ return f2(p[0]) + "," + f2(p[1]); }).join(" ") + '"/>'; }
function v10Text(x, y, t, anchor, cls){ return '<text class="v10-dim' + (cls ? " " + cls : "") + '" x="' + f2(x) + '" y="' + f2(y) + '" text-anchor="' + (anchor || "middle") + '">' + t + "</text>"; }
function v10Box(o){
  var L = o.L, W = o.W, h = clamp(o.x, 0, Math.min(L, W) / 2), fold = o.fold == null ? 1 : o.fold, th = fold * Math.PI / 2, c = Math.cos(th), s = Math.sin(th);
  var a = L / 2 - h, b = W / 2 - h, F = v10Frame(L, W);
  function P(X, Y, Z){ var p = v10Prj(X, Y, Z); return [F.tx + p[0] * F.k, F.ty + p[1] * F.k, p[2]]; }
  function area(q){ var A = 0; for (var i = 0; i < q.length; i++) { var p = q[i], n = q[(i + 1) % q.length]; A += p[0] * n[1] - n[0] * p[1]; } return A; }
  var g = v10Poly([P(-a, -b, 0), P(a, -b, 0), P(a, b, 0), P(-a, b, 0)], "v10-base");
  if (o.cuts && fold < 0.02 && h > 0) {
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function(sg){
      var X0 = sg[0] * a, X1 = sg[0] * L / 2, Y0 = sg[1] * b, Y1 = sg[1] * W / 2;
      g += v10Poly([P(X0, Y0, 0), P(X1, Y0, 0), P(X1, Y1, 0), P(X0, Y1, 0)], "v10-cut" + (o.cutHi ? " hi" : ""));
    });
  }
  var flaps = [
    [P(-a, -b, 0), P(-a, -b - h * c, h * s), P(a, -b - h * c, h * s), P(a, -b, 0)],
    [P(a, b, 0), P(a, b + h * c, h * s), P(-a, b + h * c, h * s), P(-a, b, 0)],
    [P(-a, b, 0), P(-a - h * c, b, h * s), P(-a - h * c, -b, h * s), P(-a, -b, 0)],
    [P(a, -b, 0), P(a + h * c, -b, h * s), P(a + h * c, b, h * s), P(a, b, 0)]
  ].map(function(q){ return { q:q, z:(q[0][2] + q[1][2] + q[2][2] + q[3][2]) / 4 }; }).sort(function(u, v){ return v.z - u.z; });
  if (h > 0) flaps.forEach(function(fl){ g += v10Poly(fl.q, area(fl.q) > 0 ? "v10-out" : "v10-in"); });
  var cm = " cm";
  if (o.labels && fold > 0.98 && h > 0) {
    var fm = P(0, -b, 0), lm = P(-a, 0, 0), h0 = P(a, -b, 0), h1 = P(a, -b, h);
    g += v10Text(fm[0], fm[1] + 17, num(L - 2 * h, 1) + cm) + v10Text(lm[0] - 8, lm[1] + 14, num(W - 2 * h, 1) + cm, "end") +
      v10Text((h0[0] + h1[0]) / 2 + 9, (h0[1] + h1[1]) / 2 + 5, num(h, 1) + cm, "start", "v10-hgt");
  } else if (o.labels && fold < 0.02) {
    var sf = P(0, -W / 2, 0), sl = P(-L / 2, 0, 0);
    g += v10Text(sf[0], sf[1] + 17, num(L) + cm) + v10Text(sl[0] - 8, sl[1] + 14, num(W) + cm, "end");
    if (o.cuts && h > 0) { var cc = P(-L / 2 + h / 2, -W / 2 + h / 2, 0); g += v10Text(cc[0], cc[1] + 4, MV.plain(m("x")), "middle", "v10-cx"); }
  }
  var aria = fold < 0.02 ? "A flat " + num(L) + " cm by " + num(W) + " cm sheet" + (o.cuts && h > 0 ? " with " + num(h, 1) + " cm squares marked at the corners." : ".")
    : h <= 0 ? "A flat " + num(L) + " cm by " + num(W) + " cm sheet: no cut, so no box."
    : "An open box folded from a " + num(L) + " cm by " + num(W) + " cm sheet with " + num(h, 1) + " cm squares cut from the corners: base " + num(L - 2 * h, 1) + " cm by " + num(W - 2 * h, 1) + " cm, height " + num(h, 1) + " cm.";
  return { svg:g, view:"0 0 360 " + F.H, aria:aria };
}
function v10Field(o){
  var top = 30, s = 340 / o.P, len = Math.max(0, o.P - o.k * o.x), wpx = len * s, hpx = o.x * s, x0 = 180 - wpx / 2, y0 = top, H = top + o.P / 2 * s + 46, g = "";
  g += '<rect class="v10-river" x="0" y="0" width="360" height="' + top + '"/><line class="v10-bank" x1="0" y1="' + top + '" x2="360" y2="' + top + '"/>' + v10Text(10, 19, "River", "start", "v10-rl");
  g += '<rect class="v10-field" x="' + f2(x0) + '" y="' + y0 + '" width="' + f2(wpx) + '" height="' + f2(hpx) + '"/>';
  if (o.quads && hpx > 4 && wpx > 4) g += '<line class="v10-quad" x1="' + f2(x0) + '" y1="' + f2(y0 + hpx / 2) + '" x2="' + f2(x0 + wpx) + '" y2="' + f2(y0 + hpx / 2) + '"/><line class="v10-quad" x1="' + f2(x0 + wpx / 2) + '" y1="' + y0 + '" x2="' + f2(x0 + wpx / 2) + '" y2="' + f2(y0 + hpx) + '"/>';
  g += '<polyline class="v10-fence" points="' + f2(x0) + "," + y0 + " " + f2(x0) + "," + f2(y0 + hpx) + " " + f2(x0 + wpx) + "," + f2(y0 + hpx) + " " + f2(x0 + wpx) + "," + y0 + '"/>';
  if (o.div) g += '<line class="v10-fence" x1="' + f2(x0 + wpx / 2) + '" y1="' + y0 + '" x2="' + f2(x0 + wpx / 2) + '" y2="' + f2(y0 + hpx) + '"/>';
  if (o.labels) {
    var wl = num(o.x) + " m", out = x0 > 62;
    if (hpx > 10) g += v10Text(out ? x0 - 6 : x0 + 6, y0 + hpx / 2 + 4, wl, out ? "end" : "start");
    g += v10Text(180, y0 + hpx + 18, num(len) + " m along the river");
  }
  var bar = o.P / 6, bp = bar * s;
  g += '<line class="v10-bar" x1="' + f2(350 - bp) + '" y1="' + (H - 9) + '" x2="350" y2="' + (H - 9) + '"/>' + v10Text(350 - bp / 2, H - 14, num(bar) + " m", "middle", "v10-sb");
  var aria = "Top view of a field along a river, " + num(o.x) + " m wide and " + num(len) + " m along the river, fenced on three sides" + (o.div ? " with a divider making two pens" : "") + "; the river side has no fence.";
  return { svg:g, view:"0 0 360 " + Math.round(H), aria:aria };
}
// ------------------------------------------------- end of V10 shapeStage ---------------------------------------------------

function boxModel(L, W){
  var hi = Math.min(L, W) / 2, xs = (L + W - Math.sqrt(L * L - L * W + W * W)) / 6;
  return { L:L, W:W, dom:[0, hi], xs:xs, f:function(x){ return x * (L - 2 * x) * (W - 2 * x); }, df:function(x){ return 12 * x * x - 4 * (L + W) * x + L * W; },
    src:L === W ? "V(x) = x(" + L + " - 2x)^2" : "V(x) = x(" + L + " - 2x)(" + W + " - 2x)" };
}
function fieldModel(P, k){ return { P:P, k:k, dom:[0, P / k], xs:P / (2 * k), f:function(x){ return x * (P - k * x); }, df:function(x){ return P - 2 * k * x; }, src:"A(x) = x(" + P + " - " + k + "x)" }; }
function boxDescribe(M, x){
  var top = M.f(M.xs);
  return "Volume graph " + MV.plain(m(M.src)) + " on 0 ≤ x ≤ " + num(M.dom[1]) + ": it rises to " + dec(top, 1).replace("≈ ", "about ") + " at x = " + dec(M.xs, 2).replace("≈ ", "about ") + ", then falls to 0 at x = " + num(M.dom[1]) + ". The current cut x = " + num(x, 2) + " gives V = " + dec(M.f(x), 1) + ".";
}

// ---------- hero: the sheet gets its corner squares, folds into a shallow box, grows into a tower, then settles at the best cut ----------
function hero(f){
  var host = $("#op-hero"); if (!host) return;
  var M = boxModel(24, 24), st = { x:0, fold:0, cuts:false, cutHi:false, upTo:0, done:false };
  var stage = shapeStage(host, { noDrag:true, x:0, spec:function(){ return {
    f:M.f, dom:M.dom, view:{ xmin:-2.4, xmax:13, ymin:-140, ymax:1250 }, xLabel:"x", yLabel:"V(x)", step:0.5, upTo:st.upTo,
    fig:function(x){ return v10Box({ L:24, W:24, x:x, fold:st.fold, cuts:st.cuts, cutHi:st.cutHi, labels:true }); },
    marks:st.done ? [{ x:4, y:1024, text:"best cut: 4 cm", dy:-16 }] : [],
    describe:function(x){ return st.done ? "Volume graph V(x) = x(24 − 2x)² rises to 1024 at x = 4, then falls to 0 at x = 12. The dot sits at the peak: best cut 4 cm." : "Volume graph traced up to x = " + num(st.upTo, 1) + "; the cut is " + num(x, 1) + " cm."; } }; } });
  function lin(t){ return t; }
  function finish(){ st.fold = 1; st.cuts = false; st.upTo = 12; st.done = true; stage.set(4, "set"); }
  if (MV.reduceMotion) { finish(); return; }
  stage.render();
  MV.wait(700, function(){
    st.cuts = true; st.cutHi = true; stage.set(2, "anim"); st.upTo = 2; stage.render();
    MV.wait(900, function(){
      st.cutHi = false;
      MV.tween({ dur:1100, step:function(t){ st.fold = t; stage.render(); }, done:function(){
        st.cuts = false;
        MV.tween({ dur:3400, ease:lin, step:function(t){ var x = 2 + 9 * t; st.upTo = x; stage.set(x, "anim"); }, done:function(){
          MV.wait(500, function(){ MV.tween({ dur:1500, step:function(t){ stage.set(11 - 7 * t, "anim"); }, done:finish }); });
        } });
      } });
    });
  });
}

// ---------- Explore: box builder ----------
var VIEWS = {
  b24:{ view:{ xmin:-2.4, xmax:13, ymin:-130, ymax:1220 }, dView:{ ymin:-270, ymax:660 } },
  b45:{ view:{ xmin:-2.4, xmax:13, ymin:-310, ymax:2920 }, dView:{ ymin:-650, ymax:1230 } },
  f600:{ view:{ xmin:-56, xmax:322 }, y:[-5600, 53500] }, f1200:{ view:{ xmin:-112, xmax:644 }, y:[-22400, 214000] }
};
function explore(host, api){
  var S = api.S, C = api.content, U = C.ui, R = U.rows, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["box", "field"].indexOf(S.scen) < 0) S.scen = "box";
  if (["24", "45"].indexOf(S.sheet) < 0) S.sheet = "24";
  if (["600", "1200"].indexOf(S.fence) < 0) S.fence = "600";
  if (typeof S.bx !== "number") S.bx = 2;
  if (typeof S.fx !== "number") S.fx = 50;
  S.div = !!S.div; S.showD = !!S.showD; S.best = S.best || {}; S.ans = S.ans || {}; if (typeof S.typed !== "number") S.typed = null;
  var busy = false, marks = null, quads = false, ghost = null, fold = 1, anim = null, note = "";
  host.innerHTML = '<div class="op-ex"><div class="op-main" data-mv="graph"><p class="eq-cap op-eq" id="op-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p><div id="op-stage"></div></div>' +
    '<div class="op-bot"><div class="op-ctl"><div class="seg-wrap" id="op-scen"></div><div id="op-cfg"></div>' +
      '<label class="slider op-sl"><span class="slider-top"><span id="op-xlab"></span><output id="op-xout"></output></span><input type="range" id="op-x" style="accent-color:var(--ink)"></label>' +
      '<div class="op-type"><label for="op-tx" id="op-txl"></label><input class="numin short" id="op-tx" type="text" inputmode="decimal" autocomplete="off"><span id="op-txu"></span><button type="button" class="btn ghost sm" id="op-tgo" data-k="optgo">Set</button></div>' +
      '<p class="tiny op-note" id="op-note" aria-live="polite"></p><p class="tiny muted op-how" id="op-how"></p>' +
      '<div class="op-ans"><label for="op-ans">' + U.ansLabel + '</label><span class="op-ansrow"><span id="op-ansq"></span><input class="numin" id="op-ans" type="text" inputmode="decimal" autocomplete="off"><span id="op-ansu"></span></span></div></div>' +
    '<div class="op-rd"><dl class="read" id="op-read" aria-live="polite"></dl><details class="op-more" id="op-more"><summary>' + U.more + '</summary><dl class="read" id="op-read2"></dl></details></div></div></div>';
  function cfg(){
    if (S.scen === "box") { var M = boxModel(S.sheet === "45" ? 45 : 24, 24), Vb = VIEWS["b" + S.sheet]; M.box = true; M.key = "b" + S.sheet; M.view = Vb.view; M.dView = Vb.dView; M.step = 0.5; M.big = 2; M.unit = "cm"; M.q = "V"; M.qu = "cm³"; return M; }
    var F = fieldModel(+S.fence, S.div ? 3 : 2), Vf = VIEWS["f" + S.fence];
    F.box = false; F.key = "f" + S.fence + (S.div ? "d" : ""); F.view = { xmin:Vf.view.xmin, xmax:Vf.view.xmax, ymin:Vf.y[0], ymax:Vf.y[1] }; F.step = 5; F.big = 50; F.unit = "m"; F.q = "A"; F.qu = "m²";
    return F;
  }
  function cur(){ return S.scen === "box" ? S.bx : S.fx; }
  function xTxt(M, x){ return num(x, M.box ? 2 : 1); }
  function qTxt(M, v){ return dec(v, M.box ? 2 : 1) + " " + M.qu; }
  var stage = shapeStage($("#op-stage", host), { x:cur(), locked:function(){ return busy; }, spec:function(){
    var M = cfg(), b = S.best[M.key];
    return { f:M.f, df:M.df, dom:M.dom, view:M.view, dView:M.dView, xLabel:"x", yLabel:M.q + "(x)", dLabel:"V′(x)", step:M.step, big:M.big,
      showD:M.box && S.showD, marks:marks || [], best:b ? { x:b.x, y:b.v } : null,
      fig:function(x){ return M.box ? v10Box({ L:M.L, W:M.W, x:x, fold:fold, labels:true }) : v10Field({ P:M.P, x:x, k:M.k, div:S.div, quads:quads, labels:true }); },
      valueText:function(x){ return M.q + " = " + MV.plain(dec(M.f(x), M.box ? 1 : 0)); },
      describe:function(x){
        if (M.box) return boxDescribe(M, x);
        return "Area graph " + MV.plain(m(M.src)) + " on 0 ≤ x ≤ " + num(M.dom[1]) + ": it rises to " + num(M.f(M.xs)) + " at x = " + num(M.xs) + ", then falls to 0 at x = " + num(M.dom[1]) + ". The current width x = " + num(x, 1) + " gives A = " + dec(M.f(x), 0) + "." + (ghost ? " A ring marks the 600 m best, 45 000 m²." : "");
      },
      dDescribe:function(x){ return "Derivative graph V′(x) = " + MV.plain(m(M.L === M.W ? "(24 - 2x)(24 - 6x)" : "12x^2 - 276x + 1080")) + " in teal: 0 at x = " + dec(M.xs, 2) + "; at x = " + num(x, 2) + " it is " + dec(M.df(x), 1) + "."; },
      handleLabel:function(x){ return (M.box ? "Cut x = " + num(x, 2) + " cm" : "Width x = " + num(x, 1) + " m") + ", " + M.q + " = " + MV.plain(qTxt(M, M.f(x))) + ". Arrow keys move it by " + num(M.step) + "; Shift + arrows by " + num(M.big) + "."; }
    }; },
    onMove:function(x, how){
      var M = cfg();
      if (M.box) S.bx = x; else S.fx = x;
      if (how !== "anim" && how !== "set") { marks = null; quads = false; ghost = null; if (how !== "typed") { S.typed = null; note = ""; } }
      var b = S.best[M.key], v = M.f(x);
      if (how !== "anim" && (!b || v > b.v + 1e-9)) S.best[M.key] = { v:r9(v), x:r9(x) };
      api.save(); syncX(); paintRead(); MV.changed();
    } });
  // ---- painting ----
  function paintEq(){ var M = cfg(); $("#op-eq", host).innerHTML = m(M.src) + ", " + m("0 <= x <= " + num(M.dom[1])); }
  function paintCtl(){
    var M = cfg();
    MV.keepFocus($("#op-scen", host), function(){ $("#op-scen", host).innerHTML = '<span class="tiny op-lab">Scenario</span>' + segBtns("scen", U.scen, S.scen, "Scenario"); });
    MV.keepFocus($("#op-cfg", host), function(){
      $("#op-cfg", host).innerHTML = M.box
        ? '<div class="op-crow"><span class="tiny op-lab">Sheet</span>' + chipRow("sheet", U.sheets, S.sheet, "Sheet") + '</div><div class="op-crow"><button type="button" class="chip op-tog" data-tog="d" data-k="togd" aria-pressed="' + S.showD + '">' + (S.showD ? "✓ " : "") + U.showD + "</button></div>"
        : '<div class="op-crow"><span class="tiny op-lab">Fence</span>' + chipRow("fence", U.fences, S.fence, "Fence") + '</div><div class="op-crow"><button type="button" class="chip op-tog" data-tog="div" data-k="togdiv" aria-pressed="' + S.div + '">' + (S.div ? "✓ " : "") + U.divider + "</button></div>";
    });
    var sl = $("#op-x", host); sl.min = M.dom[0]; sl.max = M.dom[1]; sl.step = M.step;
    sl.setAttribute("aria-label", (M.box ? "Cut x in centimetres" : "Width x in metres") + " (Shift + arrow moves by " + num(M.big) + ")");
    $("#op-xlab", host).innerHTML = (M.box ? "Cut, " : "Width, ") + m("x");
    $("#op-txl", host).innerHTML = M.box ? "Type a cut:" : "Type a width:";
    $("#op-txu", host).textContent = M.unit;
    $("#op-how", host).innerHTML = U.how[S.scen];
    $("#op-ansq", host).innerHTML = m(M.q + " =");
    $("#op-ansu", host).textContent = M.qu;
    var ai = $("#op-ans", host); if (document.activeElement !== ai) ai.value = S.ans[S.scen] || "";
    ai.setAttribute("aria-label", (M.box ? "Volume" : "Area") + " in " + (M.box ? "cubic centimetres" : "square metres"));
    $$("#op-scen button, #op-cfg button, #op-tgo", host).forEach(function(b){ b.disabled = busy; });
    sl.disabled = busy; $("#op-tx", host).disabled = busy;
    $("#op-note", host).innerHTML = note;
    syncX();
  }
  function syncX(){ var M = cfg(), x = stage.get(); $("#op-x", host).value = x; $("#op-xout", host).textContent = xTxt(M, x) + " " + M.unit; }
  function paintRead(){
    var M = cfg(), x = stage.get(), v = M.f(x), d = M.df(x), b = S.best[M.key], len = M.box ? 0 : Math.max(0, M.P - M.k * x);
    var word = Math.abs(d) < 1e-9 ? "level" : d > 0 ? "rising" : "falling";
    var rows = {
      model:[R.model, m(M.src)], domain:[R.domain, m("0 <= x <= " + num(M.dom[1]))],
      dims:[R.dims, M.box ? num(M.L - 2 * x, 2) + " cm × " + num(M.W - 2 * x, 2) + " cm × " + num(x, 2) + " cm" : num(x, 1) + " m wide, " + num(len, 1) + " m along the river" + (S.div ? " (two pens)" : "")],
      qty:[R.qty, m(M.q) + " = " + qTxt(M, v) + (S.div && !M.box ? " in total" : "")],
      slope:[R.slope + " " + m(M.q + "′(x)"), dec(d, 2) + " (" + word + ")"],
      best:[R.best, b ? qTxt(M, b.v) + " at " + m("x = " + xTxt(M, b.x)) : "none yet"]
    };
    var nar = narrow(), more = $("#op-more", host);
    $("#op-read", host).innerHTML = MV.readoutHTML(nar ? [rows.model, rows.dims, rows.qty] : [rows.model, rows.domain, rows.dims, rows.qty, rows.slope, rows.best]);
    more.hidden = !nar;
    $("#op-read2", host).innerHTML = nar ? MV.readoutHTML([rows.domain, rows.slope, rows.best]) : "";
  }
  function paintAll(){ paintEq(); paintCtl(); paintRead(); stage.render(); }
  // ---- fold animation when a sheet is chosen ----
  function refold(){
    if (anim) { anim(); anim = null; }
    if (MV.reduceMotion) { fold = 1; stage.render(); return; }
    fold = 0; stage.render();
    anim = MV.tween({ dur:900, step:function(t){ fold = t; stage.render(); }, done:function(){ anim = null; fold = 1; stage.render(); } });
  }
  function reset(){ marks = null; quads = false; ghost = null; note = ""; var tx = $("#op-tx", host); if (tx) tx.value = ""; }
  // ---- events ----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.classList.contains("drag-h") || busy) return;
    if (b.dataset.scen) { if (S.scen === b.dataset.scen) return; S.scen = b.dataset.scen; S.typed = null; reset(); api.save(); stage.set(cur(), "set"); paintAll(); if (S.scen === "box") refold(); MV.changed(); return; }
    if (b.dataset.sheet) { if (S.sheet === b.dataset.sheet) return; S.sheet = b.dataset.sheet; S.typed = null; reset(); api.save(); stage.set(S.bx, "set"); paintAll(); refold(); MV.changed(); return; }
    if (b.dataset.fence) { if (S.fence === b.dataset.fence) return; S.fence = b.dataset.fence; S.fx = S.fx * (S.fence === "1200" ? 2 : 0.5); S.typed = null; reset(); api.save(); stage.set(S.fx, "set"); paintAll(); MV.changed(); return; }
    if (b.dataset.tog === "d") { S.showD = !S.showD; api.save(); paintCtl(); stage.render(); return; }
    if (b.dataset.tog === "div") { S.div = !S.div; S.typed = null; reset(); api.save(); stage.set(S.fx, "set"); paintAll(); MV.changed(); return; }
    if (b.id === "op-tgo") typed();
  });
  function typed(){
    var M = cfg(), v = typedNum($("#op-tx", host).value);
    if (v === null || isNaN(v)) { note = "Type a number, such as " + (M.box ? "4.5" : "150") + "."; paintCtl(); return; }
    if (v < M.dom[0] - 1e-9 || v > M.dom[1] + 1e-9) {
      S.typed = v; note = m("x = " + num(v, 2)) + " is outside the domain " + m("0 <= x <= " + num(M.dom[1])) + ", so the stage can’t show it."; api.save(); paintCtl(); MV.changed(); return;
    }
    var sv = r9(Math.round(v / M.step) * M.step);
    S.typed = null; marks = null; quads = false; ghost = null;
    note = near(sv, v) ? "" : "Rounded to the nearest " + num(M.step) + " " + M.unit + ".";
    stage.set(v, "typed"); paintCtl();
  }
  $("#op-tx", host).addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); if (!busy) typed(); } });
  $("#op-ans", host).addEventListener("input", function(e){ S.ans[S.scen] = e.target.value; api.save(); MV.changed(); });
  var sl = $("#op-x", host);
  sl.addEventListener("input", function(){ if (busy) { syncX(); return; } stage.set(+sl.value, "slider"); });
  sl.addEventListener("keydown", function(e){
    if (busy) { e.preventDefault(); return; }
    if (e.shiftKey && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) { e.preventDefault(); stage.set(stage.get() + (/Left|Down/.test(e.key) ? -1 : 1) * cfg().big, "slider"); }
  });
  if (window.matchMedia) { var mq = window.matchMedia("(max-width: 560px)"), onMq = function(){ paintRead(); }; if (mq.addEventListener) mq.addEventListener("change", onMq); else if (mq.addListener) mq.addListener(onMq); }
  stage.set(cur(), "set"); paintAll();

  // ---- predictions ----
  function lin(t){ return t; }
  function go(to, dur, cb){ var from = stage.get(); anim = MV.tween({ dur:dur, step:function(t){ stage.set(from + (to - from) * t, "anim"); }, done:function(){ anim = null; stage.set(to, "set"); cb(); } }); }
  function mark(x, text, o2){ var M = cfg(); marks.push(Object.assign({ x:x, y:M.f(x), text:text }, o2 || {})); stage.render(); }
  function visit(list, pause, cb){
    if (!list.length) { cb(); return; }
    var v = list[0]; go(v[0], 750, function(){ mark(v[0], v[1], v[2]); MV.wait(pause, function(){ visit(list.slice(1), pause, cb); }); });
  }
  // ---- challenges ----
  function chal(id){
    var M = cfg(), x = stage.get(), Ms = MS[id], ans = typedNum(S.ans[S.scen]);
    if (id === "tc1") {
      if (S.scen !== "box") return { ok:false, msg:Ms.scen };
      if (S.sheet !== "24") return { ok:false, msg:Ms.sheet };
      if (near(x, 4, 1e-6)) { if (ans === null || isNaN(ans)) return { ok:false, msg:Ms.noAns }; return near(ans, 1024, 1e-6) ? { ok:true } : { ok:false, msg:Ms.badAns }; }
      if (near(x, 8, 1e-6)) return { ok:false, msg:Ms.cube };
      if (near(x, 6, 1e-6)) return { ok:false, msg:Ms.six };
      if (near(x, 12, 1e-6)) return { ok:false, msg:Ms.end };
      return { ok:false, msg:tpl(Ms.other, [num(x, 2), dec(M.f(x), 2), dec(M.df(x), 2)]) };
    }
    if (id === "tc2") {
      if (S.scen !== "box") return { ok:false, msg:Ms.scen };
      if (S.sheet !== "45") return { ok:false, msg:Ms.sheet };
      if (near(x, 5, 1e-6)) return { ok:true };
      if (S.typed != null && near(S.typed, 18, 1e-6)) return { ok:false, msg:Ms.typed18 };
      return { ok:false, msg:tpl(Ms.other, [num(x, 2), dec(M.df(x), 2)]) };
    }
    if (id === "tc3") {
      if (S.scen !== "field") return { ok:false, msg:Ms.scen };
      if (S.fence !== "600") return { ok:false, msg:Ms.fence };
      if (near(x, 150, 1e-6)) return { ok:false, msg:Ms.w150 };
      if (!S.div) return { ok:false, msg:Ms.div };
      if (near(x, 200, 1e-6)) return { ok:false, msg:Ms.w200 };
      if (!near(x, 100, 1e-6)) return { ok:false, msg:tpl(Ms.other, [num(x, 1), dec(M.df(x), 1)]) };
      if (ans === null || isNaN(ans)) return { ok:false, msg:Ms.noAns };
      return near(ans, 30000, 1e-6) ? { ok:true } : { ok:false, msg:Ms.badAns };
    }
    return { ok:false };
  }
  var START = { p1:{ scen:"box", sheet:"24", x:1 }, p2:{ scen:"box", sheet:"24", x:2 }, p3:{ scen:"field", fence:"600", x:50 }, p4:{ scen:"field", fence:"600", x:150 } };
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        busy = true; reset(); marks = []; fold = 1;
        var s = START[p.id]; S.scen = s.scen; S.typed = null;
        if (s.sheet) { S.sheet = s.sheet; S.showD = false; S.bx = s.x; } else { S.fence = s.fence; S.div = false; S.fx = s.x; }
        api.save(); stage.set(s.x, "set"); paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; api.save(); paintAll(); MV.changed(); done(); }
        if (p.id === "p1") { mark(1, "484"); go(4, 1100, function(){ mark(4, "1024"); go(11, 1600, function(){ mark(11, "44"); MV.wait(700, fin); }); }); }
        else if (p.id === "p2") visit([[6, "864", { dx:12, dy:6, align:"left" }], [8, "512: a cube", { dx:12, dy:6, align:"left" }], [12, "0", { dx:-12, dy:-12, align:"right" }], [4, "1024: the largest", { dx:0, dy:-18, align:"center" }]], 650, fin);
        else if (p.id === "p3") visit([[100, "40 000"], [150, "45 000"], [200, "40 000"], [300, "0"]], 600, function(){
          marks = marks.filter(function(q){ return q.x !== 150; }); go(150, 900, function(){ mark(150, "45 000 m²: the largest"); MV.wait(500, fin); }); });
        else if (p.id === "p4") {
          mark(150, "best for 600 m: 45 000");
          MV.wait(900, function(){
            S.fence = "1200"; marks = [{ x:150, y:45000, text:"600 m best: 45 000", dy:16 }]; ghost = true; paintAll();
            go(300, 1400, function(){ mark(300, "180 000 = 4 × 45 000"); quads = true; stage.render(); MV.wait(700, fin); });
          });
        }
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// @component V11 signChart (adapted from MCV4U 14 / 11) — one row per factor of the numerator and denominator of a derivative,
// the derivative's sign row, and a behaviour row (↘ decreasing / ↗ increasing, the extremum named at a zero, "not in the domain"
// at an excluded point). The domain may start at lo. The table scrolls inside its box on phones.
//   signChartHTML({ top:[{s, f, z:[x]}], bot:[{s, f, z:[x]}], d(x), pts:[{x, t:"nd" | "zero", text}], lo, dLabel, fLabel })
function signChartHTML(o){
  var lo = o.lo == null ? -Infinity : o.lo, pts = o.pts.slice().sort(function(a, b){ return a.x - b.x; }), cols = [], i;
  var inner = pts.filter(function(p){ return p.x > lo + 1e-9; }), edges = [lo].concat(inner.map(function(p){ return p.x; }), [Infinity]);
  var p0 = pts.filter(function(p){ return near(p.x, lo); })[0];
  if (p0) cols.push({ iv:false, x:p0.x, t:p0.t, text:p0.text });
  for (i = 0; i + 1 < edges.length; i++) {
    var a0 = edges[i], a1 = edges[i + 1], mid = !isFinite(a0) ? a1 - 1 : !isFinite(a1) ? a0 + 1 : (a0 + a1) / 2;
    cols.push({ iv:true, a:a0, b:a1, mid:mid });
    if (i < inner.length) cols.push({ iv:false, x:inner[i].x, t:inner[i].t, text:inner[i].text });
  }
  function end(v){ return v === -Infinity ? MINUS + "∞" : v === Infinity ? "∞" : num(v); }
  function sg(v){ return v > 1e-12 ? "+" : v < -1e-12 ? MINUS : "0"; }
  function frow(F, kind){
    return '<tr><th scope="row">' + m(F.s) + '<span class="op-sck">' + kind + "</span></th>" + cols.map(function(c){
      return "<td>" + (c.iv ? sg(F.f(c.mid)) : F.z.some(function(z){ return near(z, c.x); }) ? "0" : sg(F.f(c.x))) + "</td>";
    }).join("") + "</tr>";
  }
  var h = '<div class="tbl-wrap op-scw"><table class="vt op-sct"><caption class="vh">Sign chart of ' + MV.plain(o.dLabel) + '</caption><thead><tr><th scope="col">' + m("x") + "</th>" +
    cols.map(function(c){ return '<th scope="col">' + (c.iv ? "(" + end(c.a) + ", " + end(c.b) + ")" : end(c.x)) + "</th>"; }).join("") + "</tr></thead><tbody>";
  h += o.top.map(function(F){ return frow(F, "numerator"); }).join("") + o.bot.map(function(F){ return frow(F, "denominator"); }).join("");
  h += '<tr class="op-scd"><th scope="row">' + o.dLabel + "</th>" + cols.map(function(c){ return c.iv ? "<td>" + sg(o.d(c.mid)) + "</td>" : '<td class="op-scu">' + (c.t === "zero" ? "0" : "undefined") + "</td>"; }).join("") + "</tr>";
  h += '<tr class="op-scb"><th scope="row">' + o.fLabel + "</th>" + cols.map(function(c){
    if (c.iv) { var up = o.d(c.mid) > 0; return '<td class="op-scar"><span aria-hidden="true">' + (up ? "↗" : "↘") + '</span><span class="op-scw2">' + (up ? "increasing" : "decreasing") + "</span></td>"; }
    return '<td class="op-scu">' + (c.text || (c.t === "nd" ? "not in the domain" : "")) + "</td>";
  }).join("") + "</tr></tbody></table></div>";
  return h;
}
// ------------------------------------------------- end of V11 signChart ---------------------------------------------------------

// =====================================================================================================================
// @component N5 orderSteps — put steps in order (toolkit N5 look: .olist/.ostep, Move up / Move down, Check), with pattern
// feedback: o.rule(order) returns the first matching message for a common wrong order (else "Step n is out of place.").
//   orderSteps(host, { key, steps:[html in the right order], st:{order, tries, solved, first}, save(), rule(order), general, done, onSolved() })
function orderSteps(host, o){
  var st = o.st, sel = null, msg = null;
  function paint(){
    MV.keepFocus(host, function(){
      var h = '<ol class="olist">' + st.order.map(function(si, pos){
        var isSel = sel === pos && !st.solved;
        return '<li><button type="button" class="ostep' + (st.solved ? " good" : msg && msg.pos === pos ? " bad" : "") + '" aria-pressed="' + isSel + '" data-k="' + o.key + "p" + si + '" data-pos="' + pos + '"' + (st.solved ? " disabled" : "") + '><span class="sn">' + (pos + 1) + ".</span><span>" + o.steps[si] + "</span></button>" +
          (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + o.key + 'up"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="' + o.key + 'down"' + (pos === st.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
      }).join("") + "</ol>";
      if (!st.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + o.key + 'chk">Check the order</button></div>';
      if (st.solved) h += MV.fbHTML("good", "<strong>✓ That order works.</strong> " + o.done);
      else if (msg) h += MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + msg.html);
      host.innerHTML = h;
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pos != null) { var p = +b.dataset.pos; sel = sel === p ? null : p; paint(); return; }
    if (b.dataset.mv) {
      var i = sel, j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= st.order.length) return;
      var t = st.order[i]; st.order[i] = st.order[j]; st.order[j] = t; sel = j; msg = null; o.save(); paint();
      var nb = host.querySelector('[data-mv="' + b.dataset.mv + '"]'); if (nb && !nb.disabled) nb.focus(); else { var sb = host.querySelector('[data-pos="' + j + '"]'); if (sb) sb.focus(); }
      return;
    }
    if (b.dataset.act === "check") {
      if (st.order.every(function(v, k){ return v === k; })) { st.solved = true; if (st.first == null) st.first = st.tries === 0; sel = null; msg = null; o.save(); paint(); MV.focusFb(host); if (o.onSolved) o.onSolved(); return; }
      st.tries++; st.first = false;
      var pos = 0; while (pos < st.order.length && st.order[pos] === pos) pos++;
      var named = o.rule(st.order);
      msg = { pos:pos, html:named || "Step " + (pos + 1) + " is out of place. " + o.general };
      o.save(); paint(); MV.focusFb(host);
    }
  });
  paint();
}

// =====================================================================================================================
// @component N29 modelSlots — chip-slot model builder (N29 sentence-builder pattern): labelled slots (variable, constraint,
// function, domain) and one tray of chips. Tap a chip, then a slot (or a slot, then a chip; Enter works on every button).
// Each placement is judged at once: chips carry answer = their slot id, or "no" for traps with their own feedback; a right
// chip locks into its slot, a wrong one stays in the tray with feedback.
//   modelSlots(host, { key, slots:[{id, label}], roles:{id:"the …"}, chips:[{t, answer, fb}], st:{placed:{slot:i}, tries}, save(), done, onDone() })
function modelSlots(host, o){
  var st = o.st, sel = null, act = null, msg = null;
  st.placed = st.placed || {}; st.tries = st.tries || 0;
  function placedIdx(){ var u = {}; Object.keys(st.placed).forEach(function(k){ u[st.placed[k]] = 1; }); return u; }
  function full(){ return o.slots.every(function(s){ return st.placed[s.id] != null; }); }
  function paint(){
    var used = placedIdx(), done = full();
    MV.keepFocus(host, function(){
      var h = '<div class="op-slots">' + o.slots.map(function(s){
        var ci = st.placed[s.id], c = ci != null ? o.chips[ci] : null;
        return '<button type="button" class="op-slot' + (c ? " full" : "") + (act === s.id ? " on" : "") + '" data-slot="' + s.id + '" data-k="' + o.key + "s" + s.id + '" aria-pressed="' + (act === s.id) + '"' + (c ? " disabled" : "") +
          ' aria-label="' + MV.esc(s.label + ": " + (c ? MV.plain(c.t) : "empty")) + '"><span class="op-sll">' + s.label + '</span><span class="op-slv">' + (c ? "✓ " + c.t : "empty") + "</span></button>";
      }).join("") + "</div>";
      if (!done) h += '<div class="op-tray" role="group" aria-label="Chips">' + o.chips.map(function(c, i){
        if (used[i]) return "";
        return '<button type="button" class="chip op-mchip" data-chip="' + i + '" data-k="' + o.key + "c" + i + '" aria-pressed="' + (sel === i) + '">' + c.t + "</button>";
      }).join("") + "</div>";
      if (done) h += MV.fbHTML("good", "<strong>✓ " + o.done + "</strong> Open <strong>Check it with algebra</strong> to finish the problem.");
      else if (msg) h += MV.fbHTML(msg.good ? "good" : "bad", msg.html);
      else h += '<p class="tiny muted op-mtip">' + (sel != null ? "Now tap the slot for this chip." : act ? "Now tap the chip for this slot." : "Tap a chip, then its slot.") + "</p>";
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

// ---------- Part 3: the optimization algorithm ----------
function part3(host, api){
  var S = api.S, C = api.content, A = C.st1, B = C.st2;
  S.o1 = S.o1 || {};
  if (!Array.isArray(S.o1.order) || S.o1.order.length !== 6) S.o1 = { order:A.start.slice(), tries:0, solved:false, first:null };
  S.ms = S.ms || {};
  host.innerHTML = '<div class="part op-st" id="op-st1"><h3>' + A.title + '</h3><p class="op-prob">' + A.problem + '</p><p class="how">' + A.how + '</p><div id="op-ord"></div>' +
      '<div class="op-ordg" id="op-ordg" hidden><div class="plot-wrap"><canvas class="plot" id="op-ordc" role="img" aria-label="Graph of A(x)"></canvas></div><p class="tiny muted">' + A.graphCap + "</p></div></div>" +
    '<div class="part op-st" id="op-st2"><h3>' + B.title + '</h3><p class="how">' + B.how + "</p>" + B.problems.map(function(pb){
      return '<div class="op-mp" data-mp="' + pb.id + '"><p class="op-mpt">' + pb.t + '</p><div class="op-mslots"></div>' +
        '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + pb.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div>" + '<div class="op-mx"></div></details></div>';
    }).join("") + "</div>";
  // ---- station 1 ----
  var pg = new MV.Plot($("#op-ordc", host), { xmin:-0.6, xmax:3.9, ymin:-5, ymax:38 }), R3 = 2 * Math.sqrt(3);
  pg.render = function(){
    if ($("#op-ordg", host).hidden) return;
    var ink = css("--ink"), Af = function(x){ return 24 * x - 2 * x * x * x; };
    pg.draw({ view:{ xmin:-0.7, xmax:4.1, ymin:-5, ymax:38 }, xLabel:"x", yLabel:"A(x)", bands:[{ x0:0, x1:R3, color:css("--hi-soft"), alpha:0.6 }],
      curves:[{ f:Af, color:css("--pen"), width:3, domain:[0, R3] }], segments:[{ x1:0, y1:0, x2:R3, y2:0, color:css("--hi"), width:4 }],
      points:[{ x:0, y:0, r:6, color:ink }, { x:2, y:32, r:6, color:ink }, { x:R3, y:0, r:6, color:ink }],
      labels:[{ x:0, y:0, text:"A(0) = 0", dx:8, dy:-14, align:"left", bg:true, font:ui(12) }, { x:2, y:32, text:"A(2) = 32: largest", dx:10, dy:-14, align:"left", bg:true, font:ui(12, 700) },
        { x:R3, y:0, text:"A(2√3) = 0", dx:-8, dy:-14, align:"right", bg:true, font:ui(12) }],
      describe:"Graph of A(x) = 24x − 2x³ on 0 ≤ x ≤ 2√3 with the three candidates: A(0) = 0, A(2) = 32 (the largest) and A(2√3) = 0." });
  };
  function showGraph(){ $("#op-ordg", host).hidden = false; requestAnimationFrame(pg.render); }
  orderSteps($("#op-ord", host), { key:"o1", steps:A.steps, st:S.o1, save:api.save, general:A.general, done:A.done, onSolved:showGraph,
    rule:function(ord){
      var at = function(i){ return ord.indexOf(i); };
      if (at(2) > at(3) || at(2) > at(4)) return A.domainLate;
      if (at(5) < at(4)) return A.answerEarly;
      return null;
    } });
  if (S.o1.solved) showGraph();
  // ---- station 2 ----
  B.problems.forEach(function(pb){
    var el = $('[data-mp="' + pb.id + '"]', host);
    modelSlots($(".op-mslots", el), { key:"ms" + pb.id, slots:B.slots, roles:B.roles, chips:pb.chips, st:(S.ms[pb.id] = S.ms[pb.id] || {}), save:api.save, done:pb.done });
  });
  // algebra extras: V11 sign chart of S′ for Problem A, candidate table for Problem B
  $('[data-mp="A"] .op-mx', host).innerHTML = '<p class="tiny op-sch">Sign chart of ' + m("S′(x)") + " for " + m("x > 0") + "</p>" + signChartHTML({
    lo:0, dLabel:m("S′(x)"), fLabel:m("S(x)"),
    top:[{ s:"x - 20", f:function(x){ return x - 20; }, z:[20] }, { s:"x^2 + 20x + 400", f:function(x){ return x * x + 20 * x + 400; }, z:[] }],
    bot:[{ s:"x^2", f:function(x){ return x * x; }, z:[0] }],
    d:function(x){ return 2 * (x * x * x - 8000) / (x * x); },
    pts:[{ x:0, t:"nd" }, { x:20, t:"zero", text:"minimum: " + m("S(20) = 1200") }] });
  $('[data-mp="B"] .op-mx', host).innerHTML = MV.tableHTML({ head:["Candidate " + m("x"), m("S(x) = x^2 + (16 - x)^2"), ""], caption:"Candidates for problem B",
    rows:[["0 (endpoint)", "256", "largest"], ["8 (critical number)", "128", "smallest"], ["16 (endpoint)", "256", "largest"]] });
  return {};
}

// ---------- Practice 1: model builder ----------
// @component N29 slotChoice — a function slot and a domain slot, each with a bank of four chips (one right; a feedback line
// for each wrong chip). Check judges both; first-try scoring; three-level hints where the item has them.
function modelsAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { fn:null, dom:null, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q op-mq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.t + '</div></div><div class="op-mqb"></div></div>';
  }).join("");
  function row(it, k, label){
    var x = ist(it.id), opts = it[k].options;
    return '<div class="op-mrow"><span class="op-mlab">' + label + '</span><div class="chips" role="group" aria-label="' + label + ' choices">' + opts.map(function(o, oi){
      var on = x[k] === oi, cls = "chip" + (on ? " on" : "") + (x.solved && on ? " op-good" : "");
      return '<button type="button" class="' + cls + '" data-pick="' + k + '" data-oi="' + oi + '" data-k="' + it.id + k + oi + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>";
    }).join("") + "</div></div>";
  }
  function paint(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .op-mqb', host), h = row(it, "fn", "Function") + row(it, "dom", "Domain");
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  a.items.forEach(paint);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.pick) { x[b.dataset.pick] = +b.dataset.oi; msgs[it.id] = null; api.save(); paint(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(it); return; }
    if (b.dataset.act !== "check") return;
    if (x.fn == null || x.dom == null) { msgs[it.id] = { bad:false, html:"Choose a function and a domain first." }; paint(it); MV.focusFb(q); return; }
    var fo = it.fn.options[x.fn], dm = it.dom.options[x.dom], okF = MV.ok(fo), okD = MV.ok(dm);
    if (okF && okD) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else {
      x.tries++;
      var lines = [];
      if (!okF) lines.push("Function: " + fo.why); else lines.push("Your function is right.");
      if (!okD) lines.push("Domain: " + dm.why); else lines.push("Your domain is right.");
      msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + lines.join(" ") + " Try again." };
    }
    api.save(); paint(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: solve it ----------
// @component V8 solveBoxes (adapted from MCV4U 14 ladderBoxes / 11 slopeBoxes) — labelled answer boxes with units: whole
// numbers, decimals and fractions; exact roots through MV.mcv.S.parse + MV.mcv.exact.judge (box.exact: equivalent forms
// accepted, decimals refused); an answer may list alternatives ([0, 40]); named wrong values ({c2:20, fb}); first-try scoring.
function solveAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, SS = MV.mcv.S, EX = MV.mcv.exact;
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q op-sq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + (it.note ? '<p class="tiny muted op-snote">' + it.note + "</p>" : "") + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="op-sin"></div><div class="op-scl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .op-sin', host);
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="op-bxs">' + it.boxes.map(function(b){
        return '<label class="op-bx"><span>' + b.label + '</span><input class="numin short' + (b.exact ? " op-ex" : "") + '" data-bx="' + b.k + '" data-k="' + it.id + b.k + '" type="text" inputmode="' + (b.exact ? "text" : "decimal") + '" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(MV.plain(b.label).replace(/\s*=\s*$/, "")) + (b.unit ? " in " + b.unit : "") + '" value="' + MV.esc(x.v[b.k] || "") + '"' + (x.solved ? " disabled" : "") + ">" + (b.unit ? '<span class="op-bu">' + b.unit + "</span>" : "") + "</label>";
      }).join("") + "</div>";
    });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .op-scl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function exactOf(raw){
    var t = String(raw || "").replace(/\s+/g, "").replace(/sqrt\(?(\d+)\)?/gi, "√$1").replace(/√\((\d+)\)/g, "√$1").replace(/−/g, "-");
    var p = SS.parse(t); return p ? { raw:p, v:EX.value(p) } : null;
  }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, i;
    for (i = 0; i < it.boxes.length; i++) {
      var bx = it.boxes[i], raw = x.v[bx.k];
      if (!String(raw || "").trim()) return { err:it.boxes.length > 1 ? "Fill in every box first." : "Type your answer first." };
      if (bx.exact) {
        var e = exactOf(raw);
        if (!e) { var dv = typedNum(raw); return { err:dv === null || isNaN(dv) ? "Type an exact value, such as 3√2/4." : "Give the exact value (with a root), not a decimal." }; }
        vals[bx.k] = e;
      } else { var v = typedNum(raw); if (v === null || isNaN(v)) return { err:"Type a number in each box, such as 12, 2.5 or 25/2." }; vals[bx.k] = v; }
    }
    function match(k, target){
      var got = vals[k];
      if (got && typeof got === "object") { var tp = SS.parse(String(target)), T = { num:SS.fromRaw(tp.num), den:SS.fromRaw(tp.den) }; return EX.judge(got.raw, T).equal; }
      return Array.isArray(target) ? target.some(function(t){ return near(got, t, 1e-9); }) : near(got, target, 1e-9);
    }
    if (Object.keys(ans).every(function(k){ return match(k, ans[k]); })) return { ok:true };
    var w = (it.wrong || []).filter(function(z){ return Object.keys(z).filter(function(k){ return k !== "fb"; }).every(function(k){ return typeof vals[k] === "number" && near(vals[k], z[k], 1e-9); }); })[0];
    if (w) return { ok:false, msg:w.fb };
    if (it.boxes.length > 1) {
      var right = it.boxes.filter(function(b){ return match(b.k, ans[b.k]); }).map(function(b){ return MV.plain(b.label).replace(/[:=]\s*$/, "").trim(); });
      if (right.length) return { ok:false, msg:(it.wrongDefault || "Check your model and compare the candidates.") + " (Right so far: " + right.join(", ") + ".)" };
    }
    return { ok:false, msg:it.wrongDefault || "Build the model, solve the derivative = 0, and compare the candidates." };
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
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + MV.md(r.msg) + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a sheet ----------
var task = (function(){
  var api = null, stage = null;
  function g(k){ var s = api ? api.S : {}, t = String(s[k] == null ? "" : s[k]).trim(), v = Number(t); return t !== "" && Number.isInteger(v) && v >= 2 && v <= 40 ? v : null; }
  function read(){ var L = g("L"), W = g("W"); return { L:L, W:W, valid:L !== null && W !== null }; }
  // best cut: the smaller root of V′(x) = 12x² − 4(L + W)x + LW; exact form (n − k√r)/d
  function best(d){
    var L = d.L, W = d.W, D = L * L - L * W + W * W, s = Math.round(Math.sqrt(D)), sq = s * s === D, x = (L + W - Math.sqrt(D)) / 6;
    var M = boxModel(L, W), v = M.f(x), src;
    if (sq) { var q = MV.mcv.Q.of(L + W - s, 6); src = MV.mcv.Q.src(q); }
    else {
      var kf = MV.mcv.kfree(D, 2), k = kf[0], r = kf[1], gg = MV.mcv.gcd(MV.mcv.gcd(L + W, k), 6);
      var n = (L + W) / gg, kk = k / gg, dd = 6 / gg;
      src = (dd > 1 ? "{" : "") + n + " - " + (kk > 1 ? kk : "") + "√" + r + (dd > 1 ? "}/{" + dd + "}" : "");
    }
    return { x:x, v:v, whole:sq && (L + W - s) % 6 === 0, src:src, M:M };
  }
  function readout(){
    var el = $("#op-tread"); if (!el) return;
    var d = read();
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Enter whole numbers from 2 to 40 for ' + m("L") + " and " + m("W") + ".</dd></div>"; return; }
    var B = best(d), x = B.x;
    el.innerHTML = MV.readoutHTML([
      ["Model", m(B.M.src) + ", " + m("0 <= x <= " + num(B.M.dom[1]))],
      ["Best cut", m("x = " + B.src) + (B.whole ? " cm" : " ≈ " + num(x, 2) + " cm (not a whole number)")],
      ["Box at the best cut", num(d.L - 2 * x, 2) + " cm × " + num(d.W - 2 * x, 2) + " cm × " + num(x, 2) + " cm"],
      ["Largest volume", dec(B.v, 1) + " cm³"]
    ]);
  }
  function stepper(k, v, label){
    return '<div class="op-tstep"><label for="op-t' + k + '"><span class="m"><i>' + k + '</i></span> <span class="tiny muted">(' + label + ", 2 to 40 cm)</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="opt' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="op-t' + k + '" data-tk="' + k + '" type="number" min="2" max="40" step="1" autocomplete="off" value="' + MV.esc(v) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="opt' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  function refresh(){ if (stage) { var d = read(); if (d.valid) stage.set(best(d).x, "anim"); else stage.render(); } readout(); }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.L == null) { a.S.L = "30"; a.S.W = "20"; }
      inp.innerHTML = stepper("L", a.S.L, "length") + stepper("W", a.S.W, "width");
      pv.innerHTML = '<div class="op-tpv" id="op-tpv"></div><dl class="read" id="op-tread" aria-live="polite" style="margin-top:10px"></dl>';
      stage = shapeStage($("#op-tpv", pv), { noDrag:true, x:0, spec:function(){
        var d = read();
        if (!d.valid) return { f:function(){ return 0; }, dom:[0, 1], view:{ xmin:-0.2, xmax:1.1, ymin:-0.2, ymax:1 }, step:0.5, xLabel:"x", yLabel:"V(x)",
          fig:function(){ return { svg:"", view:"0 0 360 200", aria:"Enter the sheet’s length and width." }; }, describe:function(){ return "Enter whole numbers from 2 to 40 for L and W to draw the box and its volume graph."; } };
        var B = best(d), hi = B.M.dom[1], top = B.v;
        return { f:B.M.f, dom:B.M.dom, view:{ xmin:-hi * 0.19, xmax:hi * 1.08, ymin:-top * 0.12, ymax:top * 1.2 }, step:0.0001, xLabel:"x", yLabel:"V(x)",
          fig:function(x){ return v10Box({ L:d.L, W:d.W, x:x, fold:1, labels:true }); },
          valueText:function(){ return "best cut: " + (B.whole ? num(B.x) : "≈ " + num(B.x, 2)) + " cm"; },
          describe:function(){ return boxDescribe(B.M, B.x); } };
      } });
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); refresh(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, c0 = parseInt(String(a.S[k]), 10);
        if (!isFinite(c0)) c0 = 20;
        a.S[k] = String(clamp(c0 + +b.dataset.dir, 2, 40)); $("#op-t" + k).value = a.S[k];
        a.save(); refresh(); a.update();
      });
      refresh();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers from 2 to 40 for L and W."; },
    checks:function(d){
      if (!d.valid) return [false, false, false];
      var B = best(d);
      return [B.whole, d.L !== d.W, B.v >= 1000 - 1e-9];
    },
    key:function(d){ return Math.max(d.L, d.W) + "x" + Math.min(d.L, d.W); },
    label:function(k){ var p = k.split("x"), B = best({ L:+p[0], W:+p[1] }); return num(+p[0]) + " cm × " + num(+p[1]) + " cm (cut " + num(B.x) + " cm, " + num(B.v) + " cm³)"; },
    text:function(k){ var p = k.split("x"); return p[0] + " × " + p[1]; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ models:modelsAct, solve:solveAct },
  task:task
});
})();
