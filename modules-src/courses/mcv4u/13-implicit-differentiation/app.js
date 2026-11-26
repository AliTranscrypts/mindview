// MCV4U 13 Implicit Differentiation: hero (a point travels around x² + y² = 25 with its tangent and radius), Off-function
// tangents (Explore: drag P around a circle, an ellipse or a shifted circle; Implicit / Two halves modes), Tangents to any
// curve (Part 3: N13 step-throughs beside tap-a-point graphs), Points and tangents (Practice 2, V8 boxes) and the
// "Tangent from the right quadrant" task (V8 fraction boxes).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
var SQ2 = Math.SQRT2, KEY = Math.atan2(4, 3) * 180 / Math.PI;   // 53.13°: (3, 4) on the circle of radius 5

// Upright d in dy/dx, du/dx and d/dx (course plan §2): this page wraps MV.m so `dy/dx` in content typesets as d𝑦/d𝑥.
(function(){
  var base = MV.m;
  MV.m = function(s){ return base(s).replace(/<i>d<\/i>(?=<i>[xyut]<\/i>|\/<i>d<\/i>)/g, "d"); };
})();

function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function angDiff(a, b){ return ((a - b) % 360 + 540) % 360 - 180; }
function norm360(a){ a = a % 360; return a < 0 ? a + 360 : a; }
function sgnTxt(v){ return (v < 0 ? MINUS : "") + Math.abs(v); }
function par(v){ return v < 0 ? "(" + v + ")" : String(v); }
function xh(h){ return h === 0 ? "x" : "x " + (h > 0 ? "- " + h : "+ " + -h); }
function qTxt(q){ return Q.txt(q); }

// =====================================================================================================================
// @component exactSurd — exact numbers q·√r (r = 1 or 2) for snap-point coordinates, slopes and intercepts.
//   E(n, d, r) -> {q:Q, r}; eSrc(e) inline m() source ("3√2/2", "−4"); eFrac(e) stacked ("{3√2}/{2}"); lineSrc(mq, bE) "y = mx + b".
function E(n, d, r){ return { q:Q.of(n, d || 1), r:r || 1 }; }
function eSrc(e){
  var q = e.q, a = Math.abs(q.n), sg = q.n < 0 ? "-" : "";
  if (!q.n) return "0";
  if (e.r === 1) return sg + a + (q.d > 1 ? "/" + q.d : "");
  return sg + (a === 1 ? "" : a) + "√" + e.r + (q.d > 1 ? "/" + q.d : "");
}
function eFrac(e){
  var q = e.q, a = Math.abs(q.n), sg = q.n < 0 ? "-" : "", body = e.r === 1 ? String(a) : (a === 1 ? "" : a) + "√" + e.r;
  return sg + (q.d > 1 ? "{" + body + "}/{" + q.d + "}" : body);
}
function coefX(q){ if (q.d === 1) return (q.n === 1 ? "" : q.n === -1 ? "-" : String(q.n)) + "x"; return (q.n < 0 ? "-" : "") + "{" + Math.abs(q.n) + "}/{" + q.d + "}x"; }
function lineSrc(mq, b){
  var bt = b && b.q.n ? b : null;
  if (!mq.n) return "y = " + (bt ? eFrac(bt) : "0");
  if (!bt) return "y = " + coefX(mq);
  return "y = " + coefX(mq) + (bt.q.n < 0 ? " - " : " + ") + eFrac({ q:Q.abs(bt.q), r:bt.r });
}
// b = y − m·x for exact x, y (same r, or one of them 0)
function bOf(mq, ex){
  if (!ex.x.q.n) return ex.y;
  var mx = { q:Q.mul(mq, ex.x.q), r:ex.x.r };
  if (!ex.y.q.n) return { q:Q.neg(mx.q), r:mx.r };
  if (ex.y.r !== mx.r) return null;
  return { q:Q.sub(ex.y.q, mx.q), r:mx.r };
}

// =====================================================================================================================
// @component implicitTangent — a point P on a conic (x − cx)²/a² + y²/b² = 1 (circle, ellipse, shifted circle), driven by a
// parametric angle θ (0°–360°) with snap points at exact coordinates; slope from the implicit derivative
// dy/dx = −kN(x − cx)/(kD·y): kN = kD = 1 for circles, kN = 4, kD = 9 for 4x² + 9y² = 36. Horizontal where the numerator is 0,
// vertical where the denominator is 0. geo(S) describes the curve; cur() gives P (exact at snap points).
function geo(S){
  if (S.cv === "ellipse") return { cv:"ellipse", cx:0, a:3, b:2, kN:4, kD:9 };
  if (S.cv === "shift") return { cv:"shift", cx:S.h, a:5, b:5, kN:1, kD:1 };
  return { cv:"circle", cx:0, a:S.r, b:S.r, kN:1, kD:1 };
}
function ptAt(G, th){ var t = th * Math.PI / 180; return [r9(G.cx + G.a * Math.cos(t)), r9(G.b * Math.sin(t))]; }
function angOf(G, x, y){ return norm360(Math.atan2(y / G.b, (x - G.cx) / G.a) * 180 / Math.PI); }
function nicePts(G){
  var L = [], cx = G.cx;
  function add(dx, dy, ex){ L.push({ deg:angOf(G, cx + dx, dy), x:cx + dx, y:dy, ex:ex }); }
  [[G.a, 0], [0, G.b], [-G.a, 0], [0, -G.b]].forEach(function(p){ add(p[0], p[1], { x:E(cx + p[0]), y:E(p[1]) }); });
  if (G.a === 5 && G.b === 5) [[3, 4], [4, 3], [-3, 4], [-4, 3], [-3, -4], [-4, -3], [3, -4], [4, -3]].forEach(function(p){ add(p[0], p[1], { x:E(cx + p[0]), y:E(p[1]) }); });
  if (G.cv === "ellipse") [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(function(s){ add(s[0] * 3 * SQ2 / 2, s[1] * SQ2, { x:E(s[0] * 3, 2, 2), y:E(s[1], 1, 2) }); });
  return L;
}
function snapDeg(G, deg, tol){
  deg = norm360(deg); var best = null, bd = tol;
  nicePts(G).forEach(function(n){ var d = Math.abs(angDiff(deg, n.deg)); if (d <= bd + 1e-9) { bd = d; best = n; } });
  return best ? best.deg : deg;
}
function niceAt(G, th){ return nicePts(G).filter(function(n){ return Math.abs(angDiff(th, n.deg)) < 1e-6; })[0] || null; }
function pointOf(G, th){ var n = niceAt(G, th), p = n ? [n.x, n.y] : ptAt(G, th); return { G:G, th:th, nice:n, x:p[0], y:p[1] }; }
function slopeOf(c){
  var G = c.G, nu = -G.kN * (c.x - G.cx), de = G.kD * c.y, vert = Math.abs(de) < 1e-9, hor = !vert && Math.abs(nu) < 1e-9;
  var R = { nu:nu, de:de, vert:vert, hor:hor, m:vert ? NaN : nu / de, mq:null, b:null };
  if (c.nice && !vert) {
    var ex = c.nice.ex, dx = ex.x.r === 1 ? { q:Q.sub(ex.x.q, Q.of(G.cx)), r:1 } : ex.x;
    if (!dx.q.n) R.mq = Q.of(0);
    else if (dx.r === ex.y.r) R.mq = Q.div(Q.mul(Q.of(-G.kN), dx.q), Q.mul(Q.of(G.kD), ex.y.q));
    if (R.mq) R.b = bOf(R.mq, ex);
  }
  return R;
}
function slopeHTML(si){ return si.vert ? "undefined (vertical)" : si.mq ? m(Q.src(si.mq)) : "≈ " + num(r9(si.m), 2); }
function slopeTxt(si){ return si.vert ? "vertical" : si.mq ? qTxt(si.mq) : "≈ " + num(r9(si.m), 2); }
function ptHTML(c){ return c.nice ? m("(" + eSrc(c.nice.ex.x) + ", " + eSrc(c.nice.ex.y) + ")") : "≈ " + m("(" + num(c.x, 2) + ", " + num(c.y, 2) + ")"); }
function ptTxt(c){ return MV.plain(c.nice ? m("(" + eSrc(c.nice.ex.x) + ", " + eSrc(c.nice.ex.y) + ")") : m("(" + num(c.x, 2) + ", " + num(c.y, 2) + ")")); }
function curveSrc(G){
  if (G.cv === "ellipse") return "4x^2 + 9y^2 = 36";
  if (G.cv === "shift") return (G.cx === 0 ? "x^2" : "(" + xh(G.cx) + ")^2") + " + y^2 = 25";
  return "x^2 + y^2 = " + G.a * G.a;
}
function dSrc(G){ return G.cv === "ellipse" ? "dy/dx = -{4x}/{9y}" : G.cx === 0 ? "dy/dx = -x/y" : "dy/dx = -{" + xh(G.cx) + "}/{y}"; }
function halves(G){
  if (G.cv === "ellipse") return { top:"y = {2}/{3}√{9 - x^2}", bot:"y = -{2}/{3}√{9 - x^2}", dtop:"-{2x}/{3√{9 - x^2}}", dbot:"{2x}/{3√{9 - x^2}}" };
  var inner = G.cv === "shift" ? (G.cx === 0 ? "25 - x^2" : "25 - (" + xh(G.cx) + ")^2") : G.a * G.a + " - x^2", top = G.cv === "shift" ? xh(G.cx) : "x";
  return { top:"y = √{" + inner + "}", bot:"y = -√{" + inner + "}", dtop:"-{" + top + "}/{√{" + inner + "}}", dbot:"{" + top + "}/{√{" + inner + "}}" };
}
function arcPts(G, a0, a1){ var out = [], n = Math.max(12, Math.round(Math.abs(a1 - a0) / 1.5)); for (var i = 0; i <= n; i++) out.push(ptAt(G, a0 + (a1 - a0) * i / n)); return out; }
// right-angle mark between the radius (towards the centre) and the tangent direction, drawn at P in pixels
function rightMark(ctx, pl, P, Cn, dir, col){
  var px = pl.X(P[0]), py = pl.Y(P[1]), ux = pl.X(Cn[0]) - px, uy = pl.Y(Cn[1]) - py, ul = Math.hypot(ux, uy);
  var tx = pl.X(P[0] + dir[0]) - px, ty = pl.Y(P[1] + dir[1]) - py, tl = Math.hypot(tx, ty), s = 11;
  if (ul < 1 || tl < 1e-6) return;
  ux /= ul; uy /= ul; tx /= tl; ty /= tl;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath();
  ctx.moveTo(px + s * ux, py + s * uy); ctx.lineTo(px + s * ux + s * tx, py + s * uy + s * ty); ctx.lineTo(px + s * tx, py + s * ty); ctx.stroke(); ctx.restore();
}
// ------------------------------------------------- end of implicitTangent -----------------------------------------------------

// ---------- hero: a point travels around x² + y² = 25 with its tangent, radius and right-angle mark ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var G = { cv:"circle", cx:0, a:5, b:5, kN:1, kD:1 }, V = { xmin:-6.8, xmax:6.8, ymin:-6.8, ymax:6.8 }, p = new MV.Plot(cv, V);
  var st = { arc:1, pt:true, th:KEY, done:false };
  if (f.cap) f.cap.innerHTML = '<span class="id-hcap"><span data-st="1">' + m("x^2 + y^2 = 25") + '</span><span data-st="2">⟶ ' + m("2x + 2y · dy/dx = 0") + '</span><span data-st="3">⟶ ' + m("dy/dx = -x/y") + "</span></span>";
  function stage(n){ if (f.cap) $$("[data-st]", f.cap).forEach(function(el){ el.style.opacity = +el.dataset.st <= n ? 1 : 0; }); }
  function key(th){ var t = norm360(th); return near(t, KEY, 0.05) ? "slope −3/4" : near(t, 360 - KEY, 0.05) ? "slope 3/4" : (near(t, 0, 0.05) || near(t, 360, 0.05)) ? "vertical" : null; }
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), sc = { view:V, equal:true, curves:[], lines:[], segments:[], points:[], labels:[] };
    sc.curves.push({ pts:arcPts(G, 0, 360 * st.arc), color:pen, width:3 });
    var c = pointOf(G, norm360(st.th)), si = slopeOf(c), P = [c.x, c.y], lab = key(st.th) || (si.vert ? "vertical" : "slope ≈ " + num(r9(si.m), 2));
    if (st.pt) {
      sc.segments.push({ x1:0, y1:0, x2:c.x, y2:c.y, color:ink2, width:1.6, dash:[6, 6] });
      sc.lines.push({ p:P, q:si.vert ? [c.x, c.y + 1] : [c.x + 1, c.y + si.m], color:ink, width:2 });
      sc.points.push({ x:0, y:0, r:3.5, color:ink2 }, { x:c.x, y:c.y, r:6, color:ink });
      var ux = c.x / 5, uy = c.y / 5;
      sc.labels.push({ x:c.x, y:c.y, text:lab, dx:ux * 22, dy:-uy * 22 + (Math.abs(uy) < 0.3 ? -18 : 0), align:ux > 0.25 ? "left" : ux < -0.25 ? "right" : "center", bg:true, font:ui(14) });
    }
    sc.describe = "The circle x² + y² = 25" + (st.pt ? " with the point " + ptTxt(c) + ", its radius and its tangent at right angles; " + (si.vert ? "the tangent is vertical." : "tangent slope " + MV.plain(slopeTxt(si)) + ".") : ".");
    sc.after = function(ctx, pl){ if (st.pt) rightMark(ctx, pl, P, [0, 0], [si.de, si.nu], ink2); };
    p.draw(sc);
  }
  p.render = draw;
  function finish(){ st.arc = 1; st.pt = true; st.th = KEY; stage(3); draw(); }
  if (MV.reduceMotion) { finish(); return; }
  st.arc = 0; st.pt = false; stage(0); draw();
  function go(a, b, dur, cb){ MV.tween({ dur:dur, step:function(t){ st.th = a + (b - a) * t; draw(); }, done:cb }); }
  MV.wait(500, function(){
    MV.tween({ dur:1300, ease:function(t){ return t; }, step:function(t){ st.arc = t; draw(); }, done:function(){
      st.pt = true; st.th = KEY; stage(1); draw();
      MV.wait(1200, function(){ go(KEY, 0, 1500, function(){ stage(2);
        MV.wait(1100, function(){ go(0, -KEY, 1500, function(){ stage(3);
          MV.wait(1200, function(){ go(-KEY, KEY - 360, 4200, function(){ finish(); }); });
        }); });
      }); });
    } });
  });
}

// ---------- Explore: Off-function tangents ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["circle", "ellipse", "shift"].indexOf(S.cv) < 0) S.cv = "circle";
  if (["imp", "two"].indexOf(S.mode) < 0) S.mode = "imp";
  S.r = Number.isInteger(S.r) && S.r >= 1 && S.r <= 6 ? S.r : 5;
  S.h = Number.isInteger(S.h) && S.h >= -5 && S.h <= 5 ? S.h : 0;
  S.th = S.th || {}; ["circle", "ellipse", "shift"].forEach(function(k, i){ if (typeof S.th[k] !== "number") S.th[k] = [120, 150, 300][i]; });
  var busy = false, hideTan = false, marks = [], stopAnim = null;
  host.innerHTML = '<div class="id-ex"><div class="id-main" data-mv="graph"><p class="eq-cap id-eq" id="ix-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot square" id="ix-plot" role="img" aria-label="Curve with the point P and its tangent"></canvas></div><div class="id-legend" id="ix-legend"></div></div>' +
    '<div class="id-side"><div class="chips id-cvs" id="ix-cv" role="group" aria-label="Choose a curve"></div><p class="tiny muted id-cvhow" id="ix-cvhow"></p><div id="ix-par"></div>' +
    '<label class="slider id-sl"><span class="slider-top"><span>Point P</span><output id="ix-pout"></output></span>' +
    '<input type="range" id="ix-pos" min="0" max="360" step="1" style="accent-color:var(--ink)" aria-label="Position of P around the curve, in degrees (Shift + arrow moves 15°)"></label>' +
    '<p class="tiny muted id-how" id="ix-poshow">' + C.posHow + '</p><div class="seg-wrap" id="ix-mode"></div><p class="tiny muted id-how" id="ix-how"></p>' +
    '<dl class="read id-read" id="ix-read" aria-live="polite"></dl><button type="button" class="btn ghost sm id-more" id="ix-more" data-k="ixmore" aria-expanded="false">More</button>' +
    '<p class="tiny id-note">' + C.note + "</p></div></div>";
  var plot = new MV.Plot($("#ix-plot", host), { xmin:-7, xmax:7, ymin:-7, ymax:7 });
  function G(){ return geo(S); }
  function cur(){ return pointOf(G(), S.th[S.cv]); }
  function view(g){ return g.cv === "ellipse" ? { xmin:-4.4, xmax:4.4, ymin:-4.4, ymax:4.4 } : g.cv === "shift" ? { xmin:-10.8, xmax:10.8, ymin:-10.8, ymax:10.8 } : { xmin:-7.2, xmax:7.2, ymin:-7.2, ymax:7.2 }; }
  function draw(){
    var g = G(), c = cur(), si = slopeOf(c), V = view(g), pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), hi = css("--hi");
    var sc = { view:V, equal:true, xLabel:"x", yLabel:"y", curves:[], lines:[], segments:[], points:[], labels:[] }, eps = 1e-9;
    var top = arcPts(g, 0, 180), bot = arcPts(g, 180, 360), circ = g.cv !== "ellipse";
    if (S.mode === "two") {
      if (c.y > eps) sc.curves.push({ pts:top, color:hi, width:12, alpha:0.6 });
      if (c.y < -eps) sc.curves.push({ pts:bot, color:hi, width:12, alpha:0.6 });
      sc.curves.push({ pts:top, color:pen, width:3 }, { pts:bot, color:ink, width:2.6, dash:[14, 8] });
      sc.labels.push({ x:g.cx, y:g.b, text:"top half", dy:-16, align:"center", bg:true, color:pen, font:ui(12) }, { x:g.cx, y:-g.b, text:"bottom half", dy:16, align:"center", bg:true, color:ink, font:ui(12) });
    } else sc.curves.push({ pts:arcPts(g, 0, 360), color:pen, width:3 });
    if (circ) { sc.segments.push({ x1:g.cx, y1:0, x2:c.x, y2:c.y, color:ink2, width:1.6, dash:[6, 6] }); sc.points.push({ x:g.cx, y:0, r:3.5, color:ink2 }); }
    if (g.cv === "shift") { sc.points.push({ x:2, y:4, r:5, open:true, color:ink }); sc.labels.push({ x:2, y:4, text:"(2, 4)", dx:9, dy:-14, align:"left", bg:true, font:ui(12) }); }
    if (!hideTan) {
      sc.lines.push({ p:[c.x, c.y], q:si.vert ? [c.x, c.y + 1] : [c.x + 1, c.y + si.m], color:ink, width:2 });
      var ux = (c.x - g.cx) / g.a, uy = c.y / g.b, txt = si.vert ? "vertical: " + MV.plain(m("x = " + (c.nice ? eSrc(c.nice.ex.x) : num(c.x, 2)))) : si.hor ? "horizontal" : "slope " + slopeTxt(si);
      sc.labels.push({ x:c.x, y:c.y, text:txt, dx:ux * 24, dy:-uy * 24 + (Math.abs(uy) < 0.35 ? -20 : 0), align:ux > 0.3 ? "left" : ux < -0.3 ? "right" : "center", bg:true, font:ui(14) });
    }
    marks.forEach(function(q){ sc.points.push({ x:q.x, y:q.y, r:9, open:true, color:ink }); if (!near(q.x, c.x, 1e-6) || !near(q.y, c.y, 1e-6)) sc.labels.push({ x:q.x, y:q.y, text:q.text, dx:q.dx || 0, dy:q.dy || -22, align:q.align || "center", bg:true, font:ui(13) }); });
    sc.points.push({ x:c.x, y:c.y, r:6.5, color:ink, ring:!busy });
    sc.describe = describe(c, si);
    sc.after = function(ctx, pl){ if (circ && !hideTan) rightMark(ctx, pl, [c.x, c.y], [g.cx, 0], [si.de, si.nu], ink2); };
    plot.draw(sc);
  }
  plot.render = draw;
  function describe(c, si){
    var g = c.G, name = g.cv === "ellipse" ? "Ellipse 4x² + 9y² = 36" : g.cv === "shift" ? "Shifted circle " + MV.plain(m(curveSrc(g))) : "Circle radius " + g.a;
    return name + (S.mode === "two" ? ", drawn as a solid top half and a dashed bottom half" : "") + "; point " + ptTxt(c) + (hideTan ? "." : "; tangent " + (si.vert ? "vertical" : "slope " + MV.plain(slopeTxt(si))) + ".") +
      (g.cv === "shift" ? " The target point (2, 4) is marked." : "");
  }
  var dr = MV.drag(plot, {
    handles:function(){ var c = cur(), si = slopeOf(c); return [{ id:"P", x:c.x, y:c.y, label:"Point P at " + ptTxt(c) + ", slope " + MV.plain(slopeTxt(si)) + ". Arrow keys move it 1°; Shift moves it 15°." }]; },
    move:function(id, x, y){ if (busy) return; var g = G(), d = angOf(g, x, y), s = snapDeg(g, d, 3); setTh(s === d ? Math.round(d) % 360 : s); },
    key:function(id, e){
      if (!/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return false;
      if (busy) return true;
      step(/Left|Down/.test(e.key) ? -1 : 1, e.shiftKey ? 15 : 1); return true;
    } });
  function step(dir, n){ var g = G(), t = norm360(Math.round(S.th[S.cv]) + dir * n); setTh(snapDeg(g, t, 0.5)); }
  function setTh(t){ S.th[S.cv] = norm360(t); marks = []; hideTan = false; api.save(); paint(); MV.changed(); }
  function paintRead(){
    var g = G(), c = cur(), si = slopeOf(c), R = C.rows, h = halves(g), rows = [];
    rows.push([R.curve, m(curveSrc(g)), " id-x2"]);
    rows.push([R.d, m(dSrc(g)), " id-x2"]);
    rows.push([R.p, ptHTML(c), ""]);
    rows.push([R.slope, hideTan ? "?" : slopeHTML(si), ""]);
    if (S.mode === "two") {
      var ex;
      if (hideTan) ex = "?";
      else if (Math.abs(c.y) < 1e-9) ex = "the two halves meet here; " + m(h.dtop.replace(/^-/, "")) + " has a zero denominator: undefined (vertical)";
      else ex = (c.y > 0 ? "top half: " + m(h.dtop) : "bottom half: " + m(h.dbot)) + (si.mq ? " = " : " ") + slopeHTML(si);
      rows.push([R.explicit, ex, " id-x2"]);
    }
    var tan;
    if (hideTan) tan = "?";
    else if (si.vert) tan = m("x = " + (c.nice ? eSrc(c.nice.ex.x) : num(c.x, 2)));
    else if (si.mq && si.b) tan = m(lineSrc(si.mq, si.b));
    else { var b = c.y - si.m * c.x; tan = m("y ≈ " + (Math.abs(si.m) < 5e-3 ? "" : num(r9(si.m), 2) + "x " + (b < 0 ? "- " : "+ ")) + num(Math.abs(si.m) < 5e-3 ? r9(b) : Math.abs(r9(b)), 2)); }
    rows.push([R.tan, tan, " id-x2"]);
    rows.push([R.type, hideTan ? "?" : si.vert ? C.types.vertical : si.hor ? C.types.horizontal : C.types.sloped, ""]);
    $("#ix-read", host).innerHTML = rows.map(function(q){ return '<div class="id-row' + q[2] + '"><dt>' + q[0] + "</dt><dd>" + q[1] + "</dd></div>"; }).join("");
  }
  function paintLegend(){
    var el = $("#ix-legend", host);
    if (S.mode !== "two") { el.innerHTML = ""; return; }
    var h = halves(G());
    el.innerHTML = '<div class="id-leg"><p class="tiny"><span class="id-sw id-sw-top" aria-hidden="true"></span>Top half (solid): ' + m(h.top) + '</p><p class="id-legd">' + m("dy/dx = " + h.dtop) + "</p></div>" +
      '<div class="id-leg"><p class="tiny"><span class="id-sw id-sw-bot" aria-hidden="true"></span>Bottom half (long dashes): ' + m(h.bot) + '</p><p class="id-legd">' + m("dy/dx = " + h.dbot) + "</p></div>";
  }
  function paintSlider(){
    var c = cur(), si = slopeOf(c), el = $("#ix-pos", host), t = Math.round(S.th[S.cv]) % 360;
    if (+el.value % 360 !== t) el.value = t;
    $("#ix-pout", host).textContent = Math.round(S.th[S.cv]) % 360 + "°";
    el.setAttribute("aria-valuetext", Math.round(S.th[S.cv]) % 360 + "°: P " + ptTxt(c) + (hideTan ? "" : ", slope " + MV.plain(slopeTxt(si))));
  }
  function paintTop(){
    $("#ix-eq", host).innerHTML = m(curveSrc(G()));
    MV.keepFocus($("#ix-cv", host), function(){
      $("#ix-cv", host).innerHTML = C.curves.map(function(q){ return '<button type="button" class="chip' + (q.id === S.cv ? " on" : "") + '" data-cv="' + q.id + '" data-k="cv' + q.id + '" aria-pressed="' + (q.id === S.cv) + '">' + q.chip + "</button>"; }).join("");
    });
    $("#ix-cvhow", host).innerHTML = C.curves.filter(function(q){ return q.id === S.cv; })[0].how;
    var pe = $("#ix-par", host), want = S.cv === "circle" ? "r" : S.cv === "shift" ? "h" : "";
    if (pe.dataset.p !== want) {
      pe.dataset.p = want;
      pe.innerHTML = want ? '<label class="slider id-sl"><span class="slider-top"><span>' + m(want) + '</span><output id="ix-parout"></output></span><input type="range" data-par="' + want + '" min="' + (want === "r" ? 1 : -5) + '" max="' + (want === "r" ? 6 : 5) + '" step="1" style="accent-color:var(--ink)" aria-label="' + (want === "r" ? "Radius r (1 to 6)" : "Shift h (−5 to 5)") + '"></label>' : "";
    }
    if (want) { var inp = $("[data-par]", pe); if (+inp.value !== S[want]) inp.value = S[want]; $("#ix-parout", host).textContent = sgnTxt(S[want]); }
    MV.keepFocus($("#ix-mode", host), function(){ $("#ix-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    $("#ix-how", host).innerHTML = C.modeHow[S.mode];
  }
  function paint(){ paintTop(); paintSlider(); paintRead(); paintLegend(); draw(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.id === "ix-more") { var on = !$("#ix-read", host).classList.contains("id-all"); $("#ix-read", host).classList.toggle("id-all", on); b.setAttribute("aria-expanded", String(on)); b.textContent = on ? "Less" : "More"; return; }
    if (busy) return;
    if (b.dataset.cv) { S.cv = b.dataset.cv; marks = []; hideTan = false; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; api.save(); paint(); MV.changed(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (busy) { paint(); return; }
    if (t.dataset && t.dataset.par) { S[t.dataset.par] = +t.value; marks = []; api.save(); paint(); MV.changed(); return; }
    if (t.id === "ix-pos") setTh(snapDeg(G(), +t.value, 0.5));
  });
  $("#ix-pos", host).addEventListener("keydown", function(e){
    if (busy) { if (/^Arrow|^Page|^Home|^End/.test(e.key)) e.preventDefault(); return; }
    if (e.shiftKey && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) { e.preventDefault(); step(/Left|Down/.test(e.key) ? -1 : 1, 15); }
  });
  paint();
  void dr;

  // ---- predictions ----
  function glide(a, b, dur, cb){
    stopAnim = MV.tween({ dur:dur, step:function(t){ S.th[S.cv] = norm360(a + (b - a) * t); paintSlider(); paintRead(); draw(); },
      done:function(){ stopAnim = null; S.th[S.cv] = norm360(b); paint(); if (cb) cb(); } });
  }
  var PSTART = { p1:{ cv:"circle", th:120, mode:"imp", hide:true }, p2:{ cv:"circle", th:KEY, mode:"imp", hide:true }, p3:{ cv:"circle", th:90 - KEY, mode:"imp", hide:true }, p4:{ cv:"ellipse", th:0, mode:"imp", hide:false } };
  // ---- challenges ----
  function chal(id){
    var M = MS[id], c = cur(), si = slopeOf(c);
    function at(x, y){ return near(c.x, x, 0.02) && near(c.y, y, 0.02); }
    if (id === "tc1") {
      if (S.cv !== "circle" || S.r !== 5) return { ok:false, msg:M.curve };
      if (at(4, -3) || at(-4, 3)) return { ok:true };
      if (at(4, 3)) return { ok:false, msg:M.a };
      if (at(3, -4)) return { ok:false, msg:M.b };
      return { ok:false, msg:tpl(M.other, { m:slopeHTML(si) }) };
    }
    if (id === "tc2") {
      if (S.cv !== "ellipse") return { ok:false, msg:M.curve };
      if (at(3 * SQ2 / 2, SQ2)) return { ok:true };
      if (at(-3 * SQ2 / 2, -SQ2)) return { ok:false, msg:M.q3 };
      if (at(0, 2)) return { ok:false, msg:M.top };
      return { ok:false, msg:tpl(M.other, { m:slopeHTML(si) }) };
    }
    if (id === "tc3") {
      if (S.cv !== "shift") return { ok:false, msg:M.curve };
      if (S.h === 5) return { ok:true };
      if (S.h === -1) return { ok:false, msg:M.neg };
      return { ok:false, msg:M.off };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stopAnim) { stopAnim(); stopAnim = null; }
        var P = PSTART[p.id] || PSTART.p1;
        busy = true; S.cv = P.cv; if (P.cv === "circle") S.r = 5; S.mode = P.mode; S.th[P.cv] = P.th; hideTan = P.hide; marks = [];
        paint();
      },
      run:function(p, done){
        function fin(){ busy = false; hideTan = false; api.save(); paint(); MV.changed(); done(); }
        if (p.id === "p1") glide(120, KEY, 1500, function(){ MV.wait(350, function(){ hideTan = false; marks = [{ x:3, y:4, text:"tangent ⟂ radius", dx:0, dy:-40 }]; paint(); MV.wait(1100, fin); }); });
        else if (p.id === "p2") glide(KEY, -KEY, 1700, function(){ MV.wait(350, function(){ S.mode = "two"; hideTan = false; paint(); MV.wait(1300, fin); }); });
        else if (p.id === "p3") glide(90 - KEY, 0, 1200, function(){ MV.wait(350, function(){ hideTan = false; paint(); MV.wait(1100, fin); }); });
        else if (p.id === "p4") glide(0, 90, 1400, function(){
          marks = [{ x:0, y:2, text:"horizontal", dy:-24 }]; paint();
          MV.wait(800, function(){ glide(90, 270, 2200, function(){ marks = [{ x:0, y:2, text:"horizontal", dy:-24 }, { x:0, y:-2, text:"horizontal", dy:26 }]; paint(); MV.wait(1100, fin); }); });
        });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Tangents to any curve (@component N13 stationStepper: step-through beside a tap-a-point graph) ----------
var P3M = {
  xy:{ view:{ xmin:-8, xmax:8, ymin:-8, ymax:8 }, equal:true, curves:function(){ return [{ f:function(x){ return 6 / x; } }]; }, name:"xy = 6",
    slope:function(x, y){ return Q.of(-y, x); }, formula:"dy/dx = -y/x", sub:function(x, y){ return "-" + par(y) + "/" + par(x); } },
  tilt:{ view:{ xmin:-5, xmax:5, ymin:-5, ymax:5 }, equal:true, name:"x² + xy + y² = 7",
    curves:function(){
      var pts = [], A = Math.sqrt(14 / 3), B = Math.sqrt(14);
      for (var i = 0; i <= 240; i++) { var t = 2 * Math.PI * i / 240, u = A * Math.cos(t), v = B * Math.sin(t); pts.push([(u - v) / SQ2, (u + v) / SQ2]); }
      return [{ pts:pts }];
    },
    slope:function(x, y){ return Q.of(-(2 * x + y), x + 2 * y); }, formula:"dy/dx = -(2x + y)/(x + 2y)",
    sub:function(x, y){ return "-{" + (2 * x + y) + "}/{" + (x + 2 * y) + "}"; } },
  pow:{ view:{ xmin:-9.5, xmax:9.5, ymin:-1.5, ymax:6 }, equal:false, name:"y = x^(2/3)", curves:function(){ return [{ f:function(x){ return Math.cbrt(x * x); } }]; },
    slope:function(x, y){ return Q.of(2 * x, 3 * y * y); }, formula:"dy/dx = {2x}/{3y^2}", sub:function(x, y){ return "{" + 2 * x + "}/{" + 3 * y * y + "}"; } },
  cubic:{ view:{ xmin:-5, xmax:5, ymin:-5, ymax:5 }, equal:true, name:"x³ + y³ = 9", curves:function(){ return [{ f:function(x){ return Math.cbrt(9 - x * x * x); } }]; },
    slope:function(x, y){ return Q.of(-x * x, y * y); }, formula:"dy/dx = -x^2/y^2", sub:function(x, y){ return "-{" + x * x + "}/{" + y * y + "}"; } }
};
function part3(host, api){
  var S = api.S, C = api.content, ST = C.stations;
  S.sel = S.sel || {}; S.done = S.done || {}; S.pt = S.pt || {};
  host.innerHTML = ST.map(function(st){
    var multi = st.curves.length > 1;
    return '<div class="part id-st" data-st="' + st.id + '"><h3>' + st.title + "</h3><p>" + st.text + "</p>" + (multi ? '<div class="seg-wrap id-stseg"></div>' : "") +
      '<div class="sym id-stg"><div class="id-stl">' + st.curves.map(function(cv){
        return '<div class="id-stc" data-cv="' + cv.id + '"><ol class="id-steps" aria-live="polite"></ol><div class="id-pl"></div>' +
          (cv.alg ? '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + cv.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details>" : "") +
          (cv.general ? '<p class="id-gen">' + cv.general + "</p>" : "") + "</div>";
      }).join("") + "</div>" +
      '<div class="id-str"><div class="plot-wrap"><canvas class="plot square" role="img" aria-label="Graph"></canvas></div><p class="tiny muted id-taphow">' + C.tapHow + '</p><div class="chips id-pts" role="group" aria-label="Choose a point"></div><p class="id-p3read" aria-live="polite"></p></div></div></div>';
  }).join("");
  var plots = {};
  ST.forEach(function(st){
    var box = $('[data-st="' + st.id + '"]', host);
    if (!S.sel[st.id] || !st.curves.some(function(c){ return c.id === S.sel[st.id]; })) S.sel[st.id] = st.curves[0].id;
    st.curves.forEach(function(cv){
      if (S.pt[cv.id] == null) S.pt[cv.id] = cv.pt0 || 0;
      var el = $('[data-cv="' + cv.id + '"]', box);
      MV.player($(".id-pl", el), { count:cv.steps.length, interval:1600,
        label:function(i){ return "Step " + (i + 1) + " of " + cv.steps.length; },
        render:function(i){
          $(".id-steps", el).innerHTML = cv.steps.map(function(t, j){ return j <= i ? '<li class="' + (j === i ? "cur" : "") + '"><span class="sn">' + (j + 1) + ".</span><span>" + t + "</span></li>" : ""; }).join("");
          if (i === cv.steps.length - 1 && !S.done[cv.id]) { S.done[cv.id] = true; api.save(); paintSt(st); }
        } });
    });
    plots[st.id] = new MV.Plot($("canvas", box), P3M[st.curves[0].id].view);
    plots[st.id].render = function(){ drawSt(st); };
    paintSt(st);
  });
  function curOf(st){ return st.curves.filter(function(c){ return c.id === S.sel[st.id]; })[0]; }
  function drawSt(st){
    var cv = curOf(st), M = P3M[cv.id], pl = plots[st.id], k = S.pt[cv.id], P = cv.pts[k], done = !!S.done[cv.id];
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen");
    var sc = { view:M.view, equal:M.equal, xLabel:"x", yLabel:"y", curves:M.curves().map(function(q){ q.color = pen; q.width = 3; return q; }), lines:[], points:[], labels:[] };
    cv.pts.forEach(function(q, j){ if (j !== k) sc.points.push({ x:q[0], y:q[1], r:4, color:ink2 }); });
    var mq = M.slope(P[0], P[1]), mv = Q.val(mq);
    if (done) {
      sc.lines.push({ p:P, q:[P[0] + 1, P[1] + mv], color:ink, width:2 });
      var right = P[0] > (M.view.xmin + M.view.xmax) / 2;
      sc.labels.push({ x:P[0], y:P[1], text:"slope " + qTxt(mq), dx:right ? -14 : 14, dy:-22, align:right ? "right" : "left", bg:true, font:ui(14) });
    }
    sc.points.push({ x:P[0], y:P[1], r:6.5, color:ink, ring:true });
    sc.describe = "Graph of " + M.name + " with the point (" + sgnTxt(P[0]) + ", " + sgnTxt(P[1]) + ")" + (done ? " and its tangent, slope " + qTxt(mq) + "." : ". The tangent appears once you step through to the formula.");
    pl.draw(sc);
  }
  function readHTML(st){
    var cv = curOf(st), M = P3M[cv.id], P = cv.pts[S.pt[cv.id]], mq = M.slope(P[0], P[1]), ptS = m("(" + P[0] + ", " + P[1] + ")");
    if (!S.done[cv.id]) return '<span class="muted">' + C.locked + "</span>";
    var subQ = M.sub(P[0], P[1]), res = m(Q.src(mq)), first = "At " + ptS + ": " + m(M.formula) + " = " + m(subQ) + (MV.plain(m(subQ)) === MV.plain(res) ? "" : " = " + res) + ".";
    if (cv.id === "pow") {
      var cr = Math.cbrt(P[0]), crS = Math.round(cr), inv = Q.of(1, crS);
      first += "<br>Power rule: " + m("{2}/{3}x^{-1/3} = {2}/{3}" + (inv.n < 0 ? "(" + Q.src(inv) + ")" : " · " + Q.src(inv)) + " = " + Q.src(Q.mul(Q.of(2, 3), inv))) + ". Same.";
    }
    return first;
  }
  function paintSt(st){
    var box = $('[data-st="' + st.id + '"]', host), cv = curOf(st);
    st.curves.forEach(function(c){ $('[data-cv="' + c.id + '"]', box).hidden = c.id !== cv.id; });
    var seg = $(".id-stseg", box);
    if (seg) MV.keepFocus(seg, function(){ seg.innerHTML = '<span class="tiny" style="font-weight:700">Curve</span>' + segBtns("stc", st.curves.map(function(c){ return { id:c.id, t:c.chip }; }), cv.id, "Curve"); });
    var chips = $(".id-pts", box);
    MV.keepFocus(chips, function(){
      chips.innerHTML = cv.pts.map(function(q, j){ var on = j === S.pt[cv.id]; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-pt="' + j + '" data-k="p3' + cv.id + j + '" aria-pressed="' + on + '">' + m("(" + q[0] + ", " + q[1] + ")") + "</button>"; }).join("");
    });
    $(".id-p3read", box).innerHTML = readHTML(st);
    drawSt(st);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-st]"); if (!box) return;
    var st = ST.filter(function(s){ return s.id === box.dataset.st; })[0];
    if (b.dataset.stc) { S.sel[st.id] = b.dataset.stc; api.save(); paintSt(st); return; }
    if (b.dataset.pt != null) { S.pt[curOf(st).id] = +b.dataset.pt; api.save(); paintSt(st); }
  });
  return {};
}

// ---------- Practice 2: Points and tangents ----------
// @component V8 pointBoxes — exact answers in labelled boxes (fractions such as 5/12 accepted) or n points "(□, □)" in any
// order; named wrong states per box value ({m:"0"}), per point ({pt:[3, 0]} / {pts:[…]}), a one-point-only message, first-try
// scoring and three-level help where the plan gives hints. Adapted from MCV4U 11 slopeBoxes.
function pointsAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function nv(s){ var p = MV.parseNum(s); return p && p.length === 1 ? p[0] : NaN; }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q id-pq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="id-pin"></div><div class="id-pcl"></div></div>';
  }).join("");
  function inp(it, k, label, x){ return '<input class="numin short" data-bx="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function npts(it){ return it.n || 2; }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .id-pin', host), h;
    if (it.kind === "boxes") h = '<div class="id-bxs">' + it.boxes.map(function(b){ return "<label><span>" + b.label + "</span>" + inp(it, b.k, MV.plain(b.label), x) + "</label>"; }).join("") + "</div>";
    else { var n = npts(it); h = '<div class="id-pts2">' + Array.apply(null, Array(n)).map(function(_, j){ var L = n > 1 ? "Point " + (j + 1) : "Point"; return '<span class="id-pt"><span class="tiny">' + L + '</span><span class="m">(</span>' + inp(it, "p" + j + "x", L + " x-coordinate", x) + '<span class="m">,</span>' + inp(it, "p" + j + "y", L + " y-coordinate", x) + '<span class="m">)</span></span>'; }).join("") + "</div>"; }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .id-pcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function val(raw){ var t = String(raw || "").trim(); if (!t) return { empty:true }; var v = nv(t); return isFinite(v) ? { v:v } : { err:true }; }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), W = it.wrong || [], i;
    if (it.kind === "boxes") {
      var vals = {};
      for (i = 0; i < it.boxes.length; i++) { var r = val(x.v[it.boxes[i].k]); if (r.empty) return { err:it.boxes.length > 1 ? "Fill in every box first." : "Type your answer first." }; if (r.err) return { err:TX.err }; vals[it.boxes[i].k] = r.v; }
      if (Object.keys(ans).every(function(k){ return near(vals[k], nv(ans[k]), 1e-9); })) return { ok:true };
      var w = W.filter(function(z){ return Object.keys(z).filter(function(k){ return k !== "fb"; }).every(function(k){ return near(vals[k], nv(z[k]), 1e-9); }); })[0];
      if (w) return { ok:false, msg:w.fb };
      var right = it.boxes.filter(function(b){ return near(vals[b.k], nv(ans[b.k]), 1e-9); });
      if (it.boxes.length > 1 && right.length) return { ok:false, msg:"Your " + MV.plain(right[0].label).toLowerCase() + " is right; check the other box." };
      return { ok:false, msg:TX.boxes };
    }
    var n = npts(it), pts = [];
    for (i = 0; i < n; i++) {
      var px = val(x.v["p" + i + "x"]), py = val(x.v["p" + i + "y"]);
      if (px.empty && py.empty) continue;
      if (px.empty || py.empty) return { err:"Fill in both coordinates of each point." };
      if (px.err || py.err) return { err:TX.err };
      pts.push([px.v, py.v]);
    }
    if (!pts.length) return { err:"Type the coordinates first." };
    function same(p, q){ return near(p[0], q[0], 1e-9) && near(p[1], q[1], 1e-9); }
    function has(list, p){ return list.some(function(q){ return same(p, q); }); }
    if (pts.length === n && ans.every(function(q){ return has(pts, q); })) return { ok:true };
    for (i = 0; i < W.length; i++) {
      var z = W[i];
      if (z.pt && has(pts, z.pt)) return { ok:false, msg:z.fb };
      if (z.pts && pts.some(function(p){ return has(z.pts, p); })) return { ok:false, msg:z.fb };
    }
    var good = pts.filter(function(p){ return has(ans, p); });
    if (n > 1 && pts.length < n && good.length) return { ok:false, msg:TX.one };
    if (pts.length === 2 && same(pts[0], pts[1])) return { ok:false, msg:"Enter two different points." };
    if (good.length) return { ok:false, msg:"One point is right; check the other." };
    if (pts.some(function(p){ return ans.some(function(q){ return near(p[0], q[0], 1e-9) || near(p[1], q[1], 1e-9); }); })) return { ok:false, msg:TX.yval };
    return { ok:false, msg:TX.points };
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

// ---------- Performance task: Tangent from the right quadrant (@component V8 fracBoxes: □/□ entry, blank bottom = 1) ----------
var task = (function(){
  var api, plot;
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -10 && v <= 10 ? v : null; }
  function gq(k){
    var top = String(api.S[k + "t"] == null ? "" : api.S[k + "t"]).trim(), bot = String(api.S[k + "b"] == null ? "" : api.S[k + "b"]).trim();
    if (!top) return null;
    var a = Q.raw(top), b = bot ? Q.raw(bot) : { n:1, d:1 };
    if (!a || !b || !b.n) return null;
    return Q.div(Q.of(a.n, a.d), Q.of(b.n, b.d));
  }
  function read(){ var x0 = gi("x0"), y0 = gi("y0"), mq = gq("m"), bq = gq("b"); return { x0:x0, y0:y0, m:mq, b:bq, valid:x0 !== null && y0 !== null && !!mq && !!bq }; }
  function checks(d){
    if (!d.valid) return [false, false, false, false, false];
    var on = d.x0 * d.x0 + d.y0 * d.y0 === 50, sl = d.y0 !== 0 && Q.eq(d.m, Q.of(-d.x0, d.y0));
    var thru = Q.eq(Q.of(d.y0), Q.add(Q.mul(d.m, Q.of(d.x0)), d.b));
    return [on, sl, thru, d.m.n > 0, d.b.n > 0];
  }
  function lineS(d){ return lineSrc(d.m, { q:d.b, r:1 }); }
  function draw(){
    var d = read(), V = { xmin:-11, xmax:11, ymin:-11, ymax:11 }, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), R = Math.sqrt(50);
    var circ = []; for (var i = 0; i <= 240; i++) { var t = 2 * Math.PI * i / 240; circ.push([R * Math.cos(t), R * Math.sin(t)]); }
    var sc = { view:V, equal:true, xLabel:"x", yLabel:"y", curves:[{ pts:circ, color:pen, width:3 }], lines:[], points:[], labels:[], segments:[] };
    if (d.x0 !== null && d.y0 !== null) { sc.points.push({ x:d.x0, y:d.y0, r:6, color:ink }); sc.labels.push({ x:d.x0, y:d.y0, text:"P", dx:10, dy:-14, align:"left", bg:true, font:"italic 600 14px " + (css("--font-math") || "serif") }); sc.segments.push({ x1:0, y1:0, x2:d.x0, y2:d.y0, color:ink2, width:1.4, dash:[6, 6] }); }
    if (d.m && d.b) { var mv = Q.val(d.m), bv = Q.val(d.b); sc.lines.push({ p:[0, bv], q:[1, bv + mv], color:ink, width:2 }); sc.points.push({ x:0, y:bv, r:4.5, color:ink2 }); }
    sc.describe = "The circle x² + y² = 50" + (d.x0 !== null && d.y0 !== null ? ", the point P(" + sgnTxt(d.x0) + ", " + sgnTxt(d.y0) + ")" : "") + (d.m && d.b ? " and the line " + MV.plain(m(lineS(d))) : "") + ".";
    plot.draw(sc);
  }
  function readout(){
    var d = read(), el = $("#it-read"); if (!el) return;
    var rows = [];
    rows.push(["P", d.x0 !== null && d.y0 !== null ? m("(" + d.x0 + ", " + d.y0 + ")") : '<span class="muted">Choose whole numbers from −10 to 10.</span>']);
    if (d.x0 !== null && d.y0 !== null) rows.push([m("x_0^2 + y_0^2"), m(par(d.x0) + "^2 + " + par(d.y0) + "^2 = " + (d.x0 * d.x0 + d.y0 * d.y0))]);
    rows.push(["Your line", d.m && d.b ? m(lineS(d)) : '<span class="muted">Type ' + m("m") + " and " + m("b") + ".</span>"]);
    el.innerHTML = MV.readoutHTML(rows);
  }
  function stepper(k, lab){
    return '<div class="it-step"><label for="it-' + k + '"><span class="m it-lab">' + lab + '</span> <span class="tiny muted">(−10 to 10)</span></label>' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="it' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="it-' + k + '" data-tk="' + k + '" type="number" min="-10" max="10" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="it' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  function fracBox(k){
    return '<div class="it-fr" role="group" aria-label="' + k + ' as a fraction"><span class="m it-lab">' + m(k + " =") + '</span><span class="it-frb">' +
      '<input class="numin short" data-tk="' + k + 't" data-k="it' + k + 't" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + k + ', top (numerator)" value="' + MV.esc(api.S[k + "t"] || "") + '">' +
      '<span class="it-bar" aria-hidden="true"></span>' +
      '<input class="numin short" data-tk="' + k + 'b" data-k="it' + k + 'b" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + k + ', bottom (denominator); leave it empty for a whole number" value="' + MV.esc(api.S[k + "b"] || "") + '"></span></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.x0 == null) { a.S.x0 = "0"; a.S.y0 = "0"; }
      inp.innerHTML = '<p class="tiny" style="font-weight:700;margin:0">Point P</p>' + stepper("x0", m("x_0")) + stepper("y0", m("y_0")) +
        '<p class="tiny" style="font-weight:700;margin:14px 0 0">Tangent line ' + m("y = mx + b") + '</p><div class="it-frs">' + fracBox("m") + fracBox("b") + "</div>";
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot square" id="it-plot" role="img" aria-label="Your point and line"></canvas></div><dl class="read" id="it-read" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#it-plot"), { xmin:-11, xmax:11, ymin:-11, ymax:11 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(Math.max(-10, Math.min(10, cur + +b.dataset.dir))); $("#it-" + k).value = a.S[k];
        a.save(); draw(); readout(); a.update();
      });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Choose whole numbers from −10 to 10 for P, and type " + m("m") + " and " + m("b") + " as whole numbers or fractions."; },
    checks:checks,
    key:function(d){ return d.x0 + "," + d.y0; },
    label:function(k){ var p = k.split(",").map(Number), mq = Q.of(-p[0], p[1]); return m("P(" + p[0] + ", " + p[1] + ")") + ": " + m(lineSrc(mq, { q:Q.of(50, p[1]), r:1 })); },
    text:function(k){ var p = k.split(",").map(Number), mq = Q.of(-p[0], p[1]); return "P(" + sgnTxt(p[0]) + ", " + sgnTxt(p[1]) + ") with " + MV.plain(m(lineSrc(mq, { q:Q.of(50, p[1]), r:1 }))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ points:pointsAct },
  task:task
});
})();
