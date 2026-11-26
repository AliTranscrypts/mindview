// MCV4U 11 The Quotient Rule: hero (a tangent slides along y = x/(x² + 1)), Rational tangent hunter (Explore: V5 derivative
// panels with Tangent, Sign chart (V11) and Wrong-rule overlay modes, plus Build), Derive it (Part 3: N13 step-through + N5
// ordering, a V4 secant table, a rewrite toggle), Slopes and tangents (Practice 2, V8 boxes) and the "Two flat spots" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
// at most dp decimals, with "≈ " in front when rounding changed the value
function dec(v, dp){ var r = r9(v), p = Math.pow(10, dp); return (Math.abs(r * p - Math.round(r * p)) > 1e-6 ? "≈ " : "") + num(r, dp); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function sgnTxt(n){ return n < 0 ? "- " + Math.abs(n) : "+ " + n; }

// =====================================================================================================================
// @component ratFn — rational functions N/D from integer coefficient arrays (lowest power first): f, f′ by the quotient rule,
// the "wrong rule" N′/D′, and exact values at rational x with MV.mcv.Q (fq, dq return null outside the domain).
function pEval(p, x){ var v = 0; for (var i = p.length - 1; i >= 0; i--) v = v * x + p[i]; return v; }
function pEvalQ(p, q){ var v = Q.of(0); for (var i = p.length - 1; i >= 0; i--) v = Q.add(Q.mul(v, q), Q.of(p[i])); return v; }
function pDer(p){ return p.slice(1).map(function(c, i){ return c * (i + 1); }); }
function pMul(a, b){ var o = [], i; for (i = 0; i < a.length + b.length - 1; i++) o.push(0); a.forEach(function(x, i){ b.forEach(function(y, j){ o[i + j] += x * y; }); }); return o; }
function pSub(a, b){ var n = Math.max(a.length, b.length), o = []; for (var i = 0; i < n; i++) o.push((a[i] || 0) - (b[i] || 0)); return o; }
function ratFn(N, D){
  var dN = pDer(N), dD = pDer(D), T = pSub(pMul(dN, D), pMul(N, dD));
  function zero(v){ return Math.abs(v) < 1e-12; }
  return { N:N, D:D, T:T,
    f:function(x){ var d = pEval(D, x); return zero(d) ? NaN : pEval(N, x) / d; },
    d:function(x){ var d = pEval(D, x); return zero(d) ? NaN : pEval(T, x) / (d * d); },
    w:function(x){ var g = pEval(dD, x); return zero(g) ? NaN : pEval(dN, x) / g; },
    fq:function(q){ var d = pEvalQ(D, q); return d.n ? Q.div(pEvalQ(N, q), d) : null; },
    dq:function(q){ var d = pEvalQ(D, q); return d.n ? Q.div(pEvalQ(T, q), Q.mul(d, d)) : null; } };
}
// √D as [s, t] with D = s²t, t square-free; m() source of −c ± √D
function sqrtParts(D){ var s = 1, t = D; for (var p = 2; p * p <= t; p++) while (t % (p * p) === 0) { t /= p * p; s *= p; } return [s, t]; }
function rootSrc(c, D, sg){
  var st = sqrtParts(D); if (st[1] === 1) return String(-c + sg * st[0]);
  var rt = (st[0] === 1 ? "" : st[0]) + "√" + st[1];
  return c ? String(-c) + (sg < 0 ? " - " : " + ") + rt : (sg < 0 ? "-" : "") + rt;
}
function facSrc(r){ return r === 0 ? "x" : "(x " + (r < 0 ? "+ " + -r : "- " + r) + ")"; }

// =====================================================================================================================
// @component V5 derivativePanels (adapted from MCV4U 07 for rational functions) — linked panels for f and f′ on one shared
// x-axis with one probe line. Top: f (--pen, 3 px) with vertical asymptotes (dashed --ink-2, labelled), the tangent (--ink,
// 2 px) and a "slope = …" label; a point outside the window becomes an edge arrow. Lower: f′ (--f3, 2.6 px), the (x, f′(x))
// dot and anything added by extra(). Non-domain x-values (FN.excl) are skipped in the direction of motion, and onMove is told
// which value was skipped (for the "Skipped x = 1: not in the domain" announcement).
//   var dp = derivativePanels(host, { fn(){ return FN; }, x, big:10, aria:[top, low], labels:["y", "f′(x)"],
//     layers(i){ return { show, dot } }, extra(i, scene, plot, x){}, describe(i, x){}, locked(){}, handleLabel(x){},
//     onMove(x, how, prev, skipped){} })      how: "drag" | "key" | "tap" | "slider" | "set" | "anim"
//   FN = { f, d, view:{xmin, xmax, ymin, ymax, equal?}, dv:{ymin, ymax}, lo, hi, step, excl:[x], asym:[x] }
//   -> { get(), set(x, how), render(), plots, focus() }
function isEx(Fn, v){ return (Fn.excl || []).some(function(e){ return Math.abs(e - v) < 1e-9; }); }
function dpSnap(Fn, v, prev){
  var st = Fn.step || 0.1, lo = Fn.lo, hi = Fn.hi, skipped = null;
  v = r9(Math.max(lo, Math.min(hi, Math.round(v / st) * st)));
  if (isEx(Fn, v)) {
    skipped = v;
    var dir = prev == null || v >= prev ? 1 : -1, w = r9(v + dir * st);
    if (w > hi || w < lo || isEx(Fn, w)) w = r9(v - dir * st);
    v = w;
  }
  return { v:v, skipped:skipped };
}
function dpSlopeLabel(v){
  if (!isFinite(v)) return "no tangent";
  if (Math.abs(v) < 1e-12) return "slope = 0";
  var c = Math.round(r9(v) * 100), exact = Math.abs(r9(v) * 100 - c) < 1e-6;
  return "slope " + (exact ? "= " : "≈ ") + (c < 0 ? MINUS : "") + num(Math.abs(c) / 100, 2);
}
function dpEdge(ctx, p, x, y, col){
  var v = p.v; if (!v || !isFinite(y) || (y <= v.ymax && y >= v.ymin)) return;
  var X = p.X(x), up = y > v.ymax, Y = up ? 4 : p.H - 4, s = 8;
  ctx.save(); ctx.fillStyle = col; ctx.beginPath();
  if (up) { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y + s * 1.4); ctx.lineTo(X + s, Y + s * 1.4); }
  else { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y - s * 1.4); ctx.lineTo(X + s, Y - s * 1.4); }
  ctx.closePath(); ctx.fill();
  ctx.font = ui(13); ctx.textAlign = X > p.W - 70 ? "right" : "left"; ctx.textBaseline = up ? "top" : "bottom";
  ctx.fillText(num(y, 2), X + (X > p.W - 70 ? -12 : 12), up ? 4 : p.H - 4);
  ctx.restore();
}
function derivativePanels(host, o){
  var labels = o.labels || ["y", "f′(x)"], aria = o.aria || [];
  host.classList.add("dp-panels");
  host.innerHTML = '<div class="plot-wrap dp-panel"><canvas class="plot dp-top" role="img" aria-label="' + MV.esc(aria[0] || "") + '"></canvas></div>' +
    '<div class="plot-wrap dp-panel dp-lowwrap"><canvas class="plot dp-low" role="img" aria-label="' + MV.esc(aria[1] || "") + '"></canvas></div>';
  var cv = $$("canvas", host), x = o.x, plots = cv.map(function(c){ return new MV.Plot(c, { xmin:-1, xmax:1, ymin:-1, ymax:1 }); });
  function F(){ return o.fn(); }
  function probeLine(ctx, p){
    var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
  }
  function scene(i){
    var Fn = F(), V = Fn.view, L = (o.layers && o.layers(i)) || {}, ink = css("--ink");
    var asy = (Fn.asym || []).map(function(a){ return { x:a, label:i ? "" : null }; });
    if (i === 0) {
      var y = Fn.f(x), d = Fn.d(x), ok = isFinite(d) && isFinite(y), yc = Math.max(V.ymin, Math.min(V.ymax, y)), right = (x - V.xmin) / (V.xmax - V.xmin) > 0.55;
      var sc = { view:V, equal:!!V.equal, yLabel:labels[0], asymptotes:asy, curves:[{ f:Fn.f, color:css("--pen"), width:3 }], lines:[], points:[], labels:[], segments:[] };
      if (ok) sc.lines.push({ p:[x, y], q:[x + 1, y + d], color:ink, width:2 });
      if (ok && y === yc) sc.points.push({ x:x, y:y, r:6, color:ink, ring:true });
      if (ok) sc.labels.push({ x:x, y:yc, text:dpSlopeLabel(d), dx:right ? -14 : 14, dy:yc > V.ymax - (V.ymax - V.ymin) * 0.15 ? 22 : -22, align:right ? "right" : "left", bg:true, font:ui(14) });
      sc.after = function(ctx, pl){ probeLine(ctx, pl); dpEdge(ctx, pl, x, y, ink); };
      return sc;
    }
    var c = css("--f3"), v2 = { xmin:V.xmin, xmax:V.xmax, ymin:Fn.dv.ymin, ymax:Fn.dv.ymax }, gy = Fn.d(x);
    var s2 = { view:v2, yLabel:labels[1], asymptotes:asy, curves:[], points:[], labels:[], segments:[] };
    if (L.show !== false) s2.curves.push({ f:Fn.d, color:c, width:2.6 });
    if (L.dot !== false && isFinite(gy) && gy >= v2.ymin && gy <= v2.ymax) s2.points.push({ x:x, y:gy, r:5.5, color:c, ring:true });
    s2.after = function(ctx, pl){ probeLine(ctx, pl); if (L.dot !== false) dpEdge(ctx, pl, x, gy, c); };
    return s2;
  }
  var busy = false;
  function render(){
    if (busy) return; busy = true;
    try {
      plots.forEach(function(p, i){
        var sc = scene(i);
        if (o.extra) o.extra(i, sc, p, x);
        if (o.describe) sc.describe = o.describe(i, x);
        p.draw(sc);
      });
    } finally { busy = false; }
  }
  plots.forEach(function(p){ p.render = render; });
  function set(v, how){
    if (o.locked && o.locked() && how !== "anim" && how !== "set") return;
    var s = dpSnap(F(), v, x);
    if (s.v === x && how !== "set") { if (s.skipped != null && o.onMove) { o.onMove(x, how, x, s.skipped); render(); } return; }
    var prev = x; x = s.v;
    if (o.onMove) o.onMove(x, how, prev, s.skipped);
    render();
  }
  var dr = MV.drag(plots[0], { axis:"x", step:{ x:0.1, y:0.1 }, big:o.big || 10,
    handles:function(){ var Fn = F(), y = Fn.f(x), V = Fn.view; return [{ id:"probe", x:x, y:isFinite(y) ? Math.max(V.ymin, Math.min(V.ymax, y)) : 0, label:o.handleLabel ? o.handleLabel(x) : "Point of tangency at x = " + num(x, 1) + ". Arrow keys move it; Shift moves it by 1." }]; },
    move:function(id, nx, ny, how){ set(nx, how === "key" ? "key" : "drag"); } });
  plots.forEach(function(p){
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
    p.c.addEventListener("pointerdown", function(e){
      if (e.defaultPrevented || !p.v) return;
      active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {}
      set(at(e), "tap");
    });
    p.c.addEventListener("pointermove", function(e){ if (active) set(at(e), "drag"); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  });
  return { get:function(){ return x; }, set:set, render:render, plots:plots, focus:function(){ dr.focus("probe"); } };
}
// ------------------------------------------------- end of V5 derivativePanels ---------------------------------------------------

// =====================================================================================================================
// @component V11 signChart — derivative sign chart (MHF4U N11 adapted for MCV4U): one row per factor of the numerator and of
// the denominator of f′, the sign of f′, and a behaviour row (↗ ↘, "slope 0" at flat points, "not in the domain" where the
// denominator is 0). The column holding the probe x is highlighted; the table scrolls inside its box on phones.
//   signChartHTML({ top:[{s, f, z:[x]}], bot:[{s, f, z:[x]}], d:function(x), flats:[x], undef:[x], x, ptHTML(x), fLabel, dLabel })
function signChartHTML(o){
  var pts = o.flats.map(function(z){ return { x:z, t:"flat" }; }).concat(o.undef.map(function(z){ return { x:z, t:"undef" }; }))
    .sort(function(a, b){ return a.x - b.x; });
  var b = [-Infinity].concat(pts.map(function(p){ return p.x; }), [Infinity]), cols = [], i;
  for (i = 0; i < pts.length + 1; i++) {
    var a0 = b[i], a1 = b[i + 1], mid = !isFinite(a0) ? (isFinite(a1) ? a1 - 1 : 0) : !isFinite(a1) ? a0 + 1 : (a0 + a1) / 2;
    cols.push({ iv:true, a:a0, b:a1, mid:mid });
    if (i < pts.length) cols.push({ iv:false, x:pts[i].x, t:pts[i].t });
  }
  var hl = -1;
  cols.forEach(function(c, j){ if (hl < 0 && (c.iv ? o.x > c.a + 1e-9 && o.x < c.b - 1e-9 : near(o.x, c.x, 1e-9))) hl = j; });
  function end(v){ return v === -Infinity ? MINUS + "∞" : v === Infinity ? "∞" : o.ptHTML(v); }
  function sg(v){ return v > 1e-12 ? "+" : v < -1e-12 ? MINUS : "0"; }
  function cell(j, html, cls){ return "<td" + (j === hl || cls ? ' class="' + [j === hl ? "hl" : "", cls || ""].join(" ").trim() + '"' : "") + ">" + html + "</td>"; }
  function frow(F, kind){
    return '<tr><th scope="row">' + m(F.s) + '<span class="qx-sc-k">' + kind + "</span></th>" + cols.map(function(c, j){
      if (c.iv) return cell(j, sg(F.f(c.mid)));
      return cell(j, F.z.some(function(z){ return near(z, c.x, 1e-9); }) ? "0" : sg(F.f(c.x)));
    }).join("") + "</tr>";
  }
  var h = '<div class="tbl-wrap qx-sc-wrap"><table class="vt qx-sct"><caption class="vh">Sign chart of ' + MV.plain(o.dLabel) + "</caption><thead><tr><th scope=\"col\">" + m("x") + "</th>" +
    cols.map(function(c, j){ return "<th scope=\"col\"" + (j === hl ? ' class="hl"' : "") + ">" + (c.iv ? "(" + end(c.a) + ", " + end(c.b) + ")" : end(c.x)) + "</th>"; }).join("") + "</tr></thead><tbody>";
  h += o.top.map(function(F){ return frow(F, "numerator"); }).join("") + o.bot.map(function(F){ return frow(F, "denominator"); }).join("");
  h += '<tr class="qx-sc-d"><th scope="row">' + o.dLabel + "</th>" + cols.map(function(c, j){ return c.iv ? cell(j, sg(o.d(c.mid))) : c.t === "flat" ? cell(j, "0") : cell(j, "undefined", "qx-sc-u"); }).join("") + "</tr>";
  h += '<tr class="qx-sc-b"><th scope="row">' + o.fLabel + "</th>" + cols.map(function(c, j){
    return c.iv ? cell(j, '<span aria-hidden="true">' + (o.d(c.mid) > 0 ? "↗" : "↘") + '</span><span class="vh">' + (o.d(c.mid) > 0 ? "increasing" : "decreasing") + "</span>", "qx-sc-ar")
      : cell(j, c.t === "flat" ? "slope 0" : "not in the domain", "qx-sc-u");
  }).join("") + "</tr></tbody></table></div>";
  return h;
}
// ------------------------------------------------- end of V11 signChart ---------------------------------------------------------

// ---------- Explore functions R1–R4 (Build is made from c and k) ----------
var VX = { xmin:-5.4, xmax:5.4 };
function lin(a, b){ return function(x){ return a * x + b; }; }
var RX = {
  R1:{ r:ratFn([0, 1], [1, 0, 1]), excl:[], asym:[], flats:[-1, 1], view:{ ymin:-0.9, ymax:0.9 }, dv:{ ymin:-0.45, ymax:1.25 },
    top:[{ s:"1 - x", f:lin(-1, 1), z:[1] }, { s:"1 + x", f:lin(1, 1), z:[-1] }], bot:[{ s:"(x^2 + 1)^2", f:function(x){ return Math.pow(x * x + 1, 2); }, z:[] }] },
  R2:{ r:ratFn([3, 0, 1], [-1, 1]), excl:[1], asym:[1], flats:[-1, 3], view:{ ymin:-10, ymax:16 }, dv:{ ymin:-8, ymax:3 },
    top:[{ s:"x - 3", f:lin(1, -3), z:[3] }, { s:"x + 1", f:lin(1, 1), z:[-1] }], bot:[{ s:"(x - 1)^2", f:function(x){ return (x - 1) * (x - 1); }, z:[1] }] },
  R3:{ r:ratFn([1, 2], [-2, 1]), excl:[2], asym:[2], flats:[], view:{ ymin:-6, ymax:10 }, dv:{ ymin:-8, ymax:3 },
    top:[{ s:"-5", f:function(){ return -5; }, z:[] }], bot:[{ s:"(x - 2)^2", f:function(x){ return (x - 2) * (x - 2); }, z:[2] }] },
  R4:{ r:ratFn([0, 0, 1], [-4, 0, 1]), excl:[-2, 2], asym:[-2, 2], flats:[0], view:{ ymin:-5, ymax:6 }, dv:{ ymin:-4, ymax:4 },
    top:[{ s:"-8x", f:lin(-8, 0), z:[0] }], bot:[{ s:"(x^2 - 4)^2", f:function(x){ return Math.pow(x * x - 4, 2); }, z:[-2, 2] }] }
};
var X0 = { R1:-2, R2:-3, R3:-3, R4:-3, B:-2 };
function buildFn(c, k){
  var r = ratFn([c, 1], [k, 0, 1]), D = c * c + k, s = Math.sqrt(D), lo = -5.4, hi = 5.4, M = 0.4, Md = 0.3, i, x;
  for (i = 0; i <= 216; i++) { x = lo + (hi - lo) * i / 216; M = Math.max(M, Math.abs(r.f(x))); Md = Math.max(Md, Math.abs(r.d(x))); }
  var exact = Number.isInteger(s), p = "-x^2" + (c ? " " + sgnTxt(-2 * c) + "x" : "") + " + " + k;
  return { r:r, c:c, k:k, D:D, excl:[], asym:[], flats:[-c - s, -c + s], exact:exact, flatSrc:[rootSrc(c, D, -1), rootSrc(c, D, 1)],
    view:{ ymin:-M * 1.3, ymax:M * 1.3 }, dv:{ ymin:-Md * 1.25, ymax:Md * 1.25 },
    top:[{ s:p, f:function(x){ return -x * x - 2 * c * x + k; }, z:[-c - s, -c + s] }], bot:[{ s:"(x^2 + " + k + ")^2", f:function(x){ return Math.pow(x * x + k, 2); }, z:[] }],
    dSrc:(exact ? "-{" + facSrc(r9(-c - s)) + facSrc(r9(-c + s)) + "}" : "{" + p + "}") + "/{(x^2 + " + k + ")^2}",
    eqSrc:"y = {" + (c ? "x " + sgnTxt(c) : "x") + "}/{x^2 + " + k + "}" };
}

// ---------- hero: a tangent slides along y = x/(x² + 1) and flattens at x = ±1 ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var fn = function(x){ return x / (x * x + 1); }, dfn = function(x){ return (1 - x * x) / Math.pow(x * x + 1, 2); };
  var V = { xmin:-3.6, xmax:3.6, ymin:-0.95, ymax:0.95 }, p = new MV.Plot(cv, V), st = { x:-3, stage:0, seen:{}, done:false, t0:0 };
  if (f.cap) f.cap.innerHTML = '<span class="qr-hcap"><span class="m"><span data-st="1"><i>f</i>′(<i>x</i>) = </span><span class="frac" data-st="2"><span class="fn"><span class="qr-hnum">1 − <i>x</i><sup>2</sup></span></span>' +
    '<span class="fd"><span data-st="3">(<i>x</i><sup>2</sup> + 1)<sup>2</sup></span></span></span></span><span data-st="4" class="qr-hz">numerator = 0 at <span class="m"><i>x</i> = ±1</span></span></span>';
  function stage(n){
    st.stage = n;
    if (!f.cap) return;
    $$("[data-st]", f.cap).forEach(function(el){ el.style.opacity = +el.dataset.st <= n ? 1 : 0; });
    f.cap.classList.toggle("qr-lit", n >= 4);
  }
  function draw(){
    var x = st.x, y = fn(x), d = dfn(x), ink = css("--ink"), pts = [], segs = [], labs = [], now = (window.performance ? performance.now() : 0);
    [-1, 1].forEach(function(z){
      if (!st.seen[z]) return;
      var yz = fn(z); pts.push({ x:z, y:yz, r:5, color:css("--pen") });
      if (st.done) { segs.push({ x1:z - 0.7, y1:yz, x2:z + 0.7, y2:yz, color:ink, width:2, dash:[6, 5] }); labs.push({ x:z, y:yz, text:"slope 0", dy:z < 0 ? 18 : -18, align:"center", bg:true, font:ui(13) }); }
    });
    p.draw({ view:V, yLabel:"y", curves:[{ f:fn, color:css("--pen"), width:3 }], segments:segs, lines:[{ p:[x, y], q:[x + 1, y + d], color:ink, width:2 }],
      points:pts.concat([{ x:x, y:y, r:6, color:ink }]),
      labels:labs.concat([{ x:x, y:y, text:dpSlopeLabel(d), dx:x > 1.8 ? -14 : 14, dy:st.done || y > 0.3 ? 22 : -22, align:x > 1.8 ? "right" : "left", bg:true, font:ui(14) }]),
      describe:"Graph of y = x/(x² + 1) with its tangent at x = " + num(x, 1) + ", slope " + num(d, 2) + (st.done ? ". The tangent is horizontal at (−1, −1/2) and (1, 1/2), where the numerator of f′ is 0." : "."),
      after:function(ctx, pl){
        [-1, 1].forEach(function(z){
          if (!st.seen[z]) return;
          var age = st.done ? 99 : (now - st.seen[z]) / 1000, r = 9 + (age < 1.6 ? 7 * Math.abs(Math.sin(age * Math.PI * 1.25)) : 0);
          ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(pl.X(z), pl.Y(fn(z)), r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        });
      } });
  }
  p.render = draw;
  function finish(){ st.x = 3; st.seen = { "-1":1, "1":1 }; st.done = true; stage(4); draw(); }
  if (MV.reduceMotion) { finish(); return; }
  stage(0); draw();
  MV.wait(600, function(){
    MV.tween({ dur:6400, ease:function(t){ return t; }, step:function(t){
      st.x = -3 + 6 * t; var now = performance.now();
      if (st.x >= -1 && !st.seen[-1]) st.seen[-1] = now;
      if (st.x >= 1 && !st.seen[1]) st.seen[1] = now;
      var n = t > 0.62 ? 3 : t > 0.4 ? 2 : t > 0.15 ? 1 : 0; if (n !== st.stage) stage(n);
      draw();
    }, done:finish });
  });
}

// ---------- Explore: rational tangent hunter ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (!RX[S.fn] && S.fn !== "B") S.fn = "R1";
  if (["tan", "sign", "wrong"].indexOf(S.mode) < 0) S.mode = "tan";
  S.x = S.x || {}; S.showD = S.showD !== false; S.tc2 = S.tc2 || [];
  S.c = Number.isInteger(S.c) ? S.c : 2; S.k = Number.isInteger(S.k) ? S.k : 5;
  var busy = false, mark = null, zoom = false, note = "", tc2msg = "", B = null;
  host.innerHTML = '<div class="dp-ex"><div class="dp-main" data-mv="graph"><p class="eq-cap qx-eq" id="qx-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="qx-panels"></div><div id="qx-sc" class="qx-sc" aria-live="polite"></div><p class="tiny muted qx-key" id="qx-key"></p></div>' +
    '<div class="dp-side"><div class="chips qx-fns" id="qx-fn" role="group" aria-label="Choose a function"></div><div id="qx-build"></div><div class="seg-wrap" id="qx-mode"></div><p class="tiny muted qx-how" id="qx-how"></p>' +
    '<label class="slider qx-sl"><span class="slider-top"><span>Point of tangency, ' + m("x") + '</span><output id="qx-xout"></output></span>' +
    '<input type="range" id="qx-x" min="-5" max="5" step="0.1" style="accent-color:var(--ink)" aria-label="x-value of the point of tangency (Shift + arrow moves by 1)"></label>' +
    '<p class="tiny qx-skip" id="qx-skip" aria-live="polite"></p><div id="qx-tools"></div>' +
    '<dl class="read qx-read" id="qx-read" aria-live="polite"></dl><button type="button" class="btn ghost sm qx-more" id="qx-more" data-k="qxmore" aria-expanded="false">More</button><div id="qx-tc2" aria-live="polite"></div></div></div>';
  function fnC(id){ return C.fns.filter(function(q){ return q.id === (id || S.fn); })[0]; }
  function Bfn(){ if (!B || B.c !== S.c || B.k !== S.k) B = buildFn(S.c, S.k); return B; }
  function spec(){ return S.fn === "B" ? Bfn() : RX[S.fn]; }
  function F(){
    var sp = spec(), r = sp.r, v = zoom ? { xmin:-1.6, xmax:1.6, ymin:-1, ymax:1, equal:true } : { xmin:VX.xmin, xmax:VX.xmax, ymin:sp.view.ymin, ymax:sp.view.ymax };
    return { f:r.f, d:r.d, w:r.w, view:v, dv:sp.dv, lo:-5, hi:5, step:0.1, excl:sp.excl, asym:sp.asym };
  }
  function xv(){ var v = S.x[S.fn]; return v == null ? X0[S.fn] : v; }
  var dp = derivativePanels($("#qx-panels", host), {
    fn:F, x:xv(), big:10, aria:["Top panel: the rational function with its tangent", "Lower panel: the graph of f′, the slope at each x"], labels:["y", "f′(x)"],
    layers:function(i){ return i ? { show:true, dot:true } : {}; },
    extra:function(i, sc){
      var Fn = F(), ink = css("--ink");
      if (i === 1 && S.mode === "wrong") {
        sc.curves.push({ f:Fn.w, color:ink, width:2.2, dash:[14, 8] });
        var wy = Fn.w(xv()); if (isFinite(wy)) sc.points.push({ x:xv(), y:wy, r:5, open:true, color:ink });
        if (S.fn === "R4") sc.points.push({ x:0, y:1, r:4.5, open:true, color:ink });
        sc.labels.push({ x:VX.xmin, y:Fn.dv.ymax, text:"long dashes: wrong rule", dx:8, dy:14, align:"left", bg:true, color:ink, font:ui(12) });
      }
      if (!mark || mark.fn !== S.fn) return;
      mark.pts.forEach(function(q){
        if (q.i !== i) return;
        if (!q.noRing) sc.points.push({ x:q.x, y:q.y, r:8, open:true, color:ink });
        sc.labels.push({ x:q.x, y:q.y, text:q.text, dx:q.dx || 12, dy:q.dy || -18, align:q.align || "left", color:ink, bg:true, font:ui(13) });
      });
    },
    describe:describe,
    locked:function(){ return busy; },
    handleLabel:function(x){ return "Point of tangency at x = " + num(x, 1) + ", slope " + MV.plain(slopeHTML(x)) + ". Arrow keys move it by 0.1; Shift moves it by 1."; },
    onMove:function(x, how, prev, skipped){
      S.x[S.fn] = x;
      if (how !== "anim" && how !== "set") { mark = null; zoom = false; }
      if (skipped != null) note = tpl(C.skip, { x:m("x = " + num(skipped, 1)) });
      else if (how !== "anim") note = "";
      api.save(); syncSlider(); paintRead(); paintSC(); paintTc2();
      MV.changed();
    }
  });
  function plainFn(){ return S.fn === "B" ? MV.plain(m(Bfn().eqSrc)) : fnC().plain; }
  function describe(i, x){
    var Fn = F(), y = Fn.f(x), d = Fn.d(x), sp = spec();
    if (!i) return "Graph of " + plainFn() + (sp.asym.length ? "; vertical asymptote" + (sp.asym.length > 1 ? "s" : "") + " at x = " + sp.asym.map(function(a){ return num(a); }).join(" and ") : "") +
      "; tangent at (" + num(x, 1) + ", " + num(y, 2) + ") " + (Math.abs(d) < 1e-12 ? "is horizontal." : "has slope " + num(d, 2) + ".");
    return "Graph of f′ in teal" + (S.mode === "wrong" ? ", with the wrong rule (derivative of the top over derivative of the bottom) in long dashes; at x = " + num(x, 1) + " the wrong rule gives " + (isFinite(Fn.w(x)) ? num(Fn.w(x), 2) : "no value") + " but" : "; at x = " + num(x, 1)) + " f′ = " + num(d, 2) + ".";
  }
  // ---- exact readouts ----
  function qx(x){ return Q.of(Math.round(x * 10), 10); }
  function half(x){ return Math.abs(x * 2 - Math.round(x * 2)) < 1e-9; }
  function exactAt(x){
    var r = spec().r, q = qx(x), fy = r.fq(q), dy = r.dq(q);
    return { q:q, fy:fy, dy:dy, ptExact:half(x) && fy, slExact:dy && (half(x) || dy.d <= 100) };
  }
  function slopeHTML(x){ var e = exactAt(x); return e.slExact ? m(Q.src(e.dy)) : dec(spec().r.d(x), 2); }
  function coefX(q){ return q.d === 1 ? (q.n === 1 ? "" : q.n === -1 ? "-" : String(q.n)) + "x" : Q.src(q) + "x"; }
  function lineSrc(mq, bq){ if (!mq.n) return "y = " + Q.src(bq); return "y = " + coefX(mq) + (bq.n ? (bq.n < 0 ? " - " : " + ") + Q.src(Q.abs(bq)) : ""); }
  function flatsHTML(){
    if (S.fn !== "B") return fnC().flat;
    var b = Bfn();
    return b.exact ? b.flats.map(function(r){ return m("x = " + r9(r)); }).join(", ") : b.flats.map(function(r, j){ return m("x = " + b.flatSrc[j]) + " ≈ " + num(r, 2); }).join(", ");
  }
  function paintRead(){
    var x = xv(), sp = spec(), r = sp.r, y = r.f(x), d = r.d(x), e = exactAt(x), R = C.rows;
    var pt = e.ptExact ? m("(" + Q.txt(e.q) + ", " + Q.txt(e.fy) + ")") : (dec(y, 2).indexOf("≈") === 0 ? "≈ " : "") + m("(" + num(x, 1) + ", " + num(y, 2) + ")");
    var tan;
    if (e.ptExact && e.slExact) tan = m(lineSrc(e.dy, Q.sub(e.fy, Q.mul(e.dy, e.q))));
    else { var b = y - d * x; tan = m("y ≈ " + (Math.abs(d) < 5e-3 ? "" : num(d, 2) + "x " + (b < 0 ? "- " : "+ ")) + num(Math.abs(d) < 5e-3 ? b : Math.abs(b), 2)); }
    var rows = [
      [R.fn, S.fn === "B" ? m(Bfn().eqSrc) : fnC().eq, " qx-x2"],
      [R.pt, pt, ""],
      [R.d, S.fn === "B" ? m(Bfn().dSrc) : fnC().d, " qx-x2"],
      [R.slope, slopeHTML(x), ""],
      [R.tan, tan, ""],
      [R.flat, flatsHTML(), " qx-x2"],
      [R.undef, fnC().undef, " qx-x2"]
    ];
    if (S.mode === "wrong") { var w = r.w(x); rows.push([R.wrong, isFinite(w) ? dec(w, 2) + (Math.abs(w - d) > 1e-9 ? " (true slope " + slopeHTML(x) + ")" : "") : "no value here", ""]); }
    $("#qx-read", host).innerHTML = rows.map(function(q){ return '<div class="qx-row' + q[2] + '"><dt>' + q[0] + "</dt><dd>" + q[1] + "</dd></div>"; }).join("");
  }
  function paintSC(){
    var el = $("#qx-sc", host), on = S.mode === "sign";
    el.hidden = !on; if (!on) { el.innerHTML = ""; return; }
    var sp = spec(), B2 = S.fn === "B";
    el.innerHTML = '<h4 class="qx-sch">Sign chart of ' + m("f′") + "</h4>" + signChartHTML({ top:sp.top, bot:sp.bot, d:sp.r.d, flats:sp.flats, undef:sp.excl, x:xv(), dLabel:m("f′(x)"), fLabel:"Graph",
      ptHTML:function(v){ if (B2 && !sp.exact) { var j = sp.flats.indexOf(v); if (j >= 0) return m(sp.flatSrc[j]); } return m(num(r9(v))); } });
  }
  function paintTc2(){
    var el = $("#qx-tc2", host), T = C.tc2, f = S.tc2;
    if (S.fn !== "R2" || !f.length) { el.innerHTML = ""; return; }
    var both = f.length >= 2, h = '<div class="qx-tc2"><p class="tiny" style="font-weight:700;margin:0 0 4px">' + T.title + "</p>";
    if (both) h += '<p class="qx-badge">' + T.both + "</p>";
    else h += '<p class="tiny" style="margin:0 0 6px">' + tpl(T.one, { x:m("x = " + num(f[0])) }) + '</p><button type="button" class="btn ghost sm" data-act="tc2rec" data-k="qxtc2">' + T.rec + "</button>" + (tc2msg ? '<p class="tiny qx-note" role="status">' + tc2msg + "</p>" : "");
    MV.keepFocus(el, function(){ el.innerHTML = h + "</div>"; });
  }
  function recordTc2(x){ if (!S.tc2.some(function(v){ return near(v, x); })) { S.tc2.push(r9(x)); S.tc2.sort(function(a, b){ return a - b; }); api.save(); } tc2msg = ""; paintTc2(); }
  function syncSlider(){ var el = $("#qx-x", host); el.value = xv(); $("#qx-xout", host).textContent = num(xv(), 1); $("#qx-skip", host).innerHTML = note; }
  function paintTop(){
    $("#qx-eq", host).innerHTML = S.fn === "B" ? fnC().eq + ' <span class="tiny muted">now</span> ' + m(Bfn().eqSrc) : fnC().eq;
    MV.keepFocus($("#qx-fn", host), function(){
      $("#qx-fn", host).innerHTML = C.fns.map(function(q){ return '<button type="button" class="chip' + (q.id === S.fn ? " on" : "") + '" data-fn="' + q.id + '" data-k="fn' + q.id + '" aria-pressed="' + (q.id === S.fn) + '">' + (q.id === "B" ? "<strong>" + q.chip + "</strong>" : "<strong>" + q.id + "</strong> " + q.chip) + "</button>"; }).join("");
    });
    MV.keepFocus($("#qx-mode", host), function(){ $("#qx-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    $("#qx-how", host).innerHTML = C.modeHow[S.mode];
    var bh = "";
    if (S.fn === "B") bh = '<div class="qx-bsl">' + [["c", -5, 5], ["k", 1, 10]].map(function(t){
      return '<label class="slider"><span class="slider-top"><span>' + m(t[0]) + '</span><output id="qx-' + t[0] + 'out">' + num(S[t[0]]) + '</output></span><input type="range" data-bk="' + t[0] + '" min="' + t[1] + '" max="' + t[2] + '" step="1" value="' + S[t[0]] + '" style="accent-color:var(--ink)" aria-label="' + t[0] + " (" + num(t[1]) + " to " + num(t[2]) + ')"></label>';
    }).join("") + "</div>";
    var bEl = $("#qx-build", host); if (bEl.dataset.on !== String(S.fn === "B")) { bEl.innerHTML = bh; bEl.dataset.on = String(S.fn === "B"); }
  }
  function paintTools(){
    var h = "";
    if (S.mode === "tan") h = '<div class="q-actions"><button type="button" class="chip" data-act="showd" data-k="qxshowd" aria-pressed="' + S.showD + '">Show the ' + m("f′") + " panel</button></div>";
    MV.keepFocus($("#qx-tools", host), function(){ $("#qx-tools", host).innerHTML = h; });
    var low = $(".dp-lowwrap", host), showLow = S.mode === "wrong" || (S.mode === "tan" && S.showD);
    low.hidden = !showLow;
    $("#qx-key", host).innerHTML = S.mode === "sign" ? "Top: the function and its tangent. Below it: the sign chart of " + m("f′") + "; the shaded column holds the point of tangency." :
      S.mode === "wrong" ? "Lower panel: the true " + m("f′") + " in teal and the wrong rule in long dashes, with a dot for each at the point of tangency." :
      showLow ? "Top: the function and its tangent. Lower panel: " + m("f′") + " in teal; the dot is the slope at the point of tangency." : "The function and its tangent. Dashed vertical lines are asymptotes.";
  }
  function paintAll(){ paintTop(); syncSlider(); paintTools(); paintRead(); paintSC(); paintTc2(); dp.render(); }
  function chooseFn(id){ S.fn = id; mark = null; zoom = false; note = ""; tc2msg = ""; api.save(); paintTop(); dp.set(xv(), "set"); paintAll(); MV.changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (busy) return;
    if (b.dataset.fn) { chooseFn(b.dataset.fn); return; }
    if (b.id === "qx-more") { var on = !$("#qx-read", host).classList.contains("qx-all"); $("#qx-read", host).classList.toggle("qx-all", on); b.setAttribute("aria-expanded", String(on)); b.textContent = on ? "Less" : "More"; return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; mark = null; zoom = false; api.save(); paintAll(); MV.changed(); return; }
    var a = b.dataset.act;
    if (a === "showd") { S.showD = !S.showD; api.save(); paintTools(); dp.render(); return; }
    if (a === "tc2rec") {
      var x = xv();
      if (near(x, 0) || near(x, 2)) recordTc2(x);
      else { tc2msg = tpl(C.tc2.not, { x:m("x = " + num(x, 1)), m:slopeHTML(x) }); paintTc2(); }
    }
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.bk; if (!k || busy) return;
    S[k] = +e.target.value; $("#qx-" + k + "out", host).textContent = num(S[k]);
    api.save(); $("#qx-eq", host).innerHTML = fnC().eq + ' <span class="tiny muted">now</span> ' + m(Bfn().eqSrc);
    paintRead(); paintSC(); dp.render(); MV.changed();
  });
  var sl = $("#qx-x", host);
  sl.addEventListener("input", function(){ if (busy) { syncSlider(); return; } dp.set(+sl.value, "slider"); syncSlider(); });
  sl.addEventListener("keydown", function(e){
    if (busy) { e.preventDefault(); return; }
    if (e.shiftKey && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) { e.preventDefault(); dp.set(xv() + (/Left|Down/.test(e.key) ? -1 : 1), "slider"); }
  });
  paintAll();

  // ---- predictions ----
  var stopAnim = null, START = { p1:-2.5, p2:-5, p3:-4, p4:0 };
  function sweep(a, b, dur, cb){ stopAnim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ dp.set(a + (b - a) * t, "anim"); }, done:function(){ stopAnim = null; if (cb) cb(); } }); }
  // ---- challenges ----
  function chal(id, opt){
    var M = MS[id], x = xv();
    if (id === "tc1") {
      if (S.fn !== "R1") return { ok:false, msg:M.fn };
      if (near(x, 1)) return { ok:true };
      if (near(x, -1)) return { ok:false, msg:M.neg };
      if (near(x, 0)) return { ok:false, msg:M.zero };
      return { ok:false, msg:tpl(M.other, { m:slopeHTML(x) }) };
    }
    if (id === "tc2") {
      if (S.fn !== "R2") return { ok:false, msg:M.fn };
      if (near(x, 0) || near(x, 2)) { if (!opt || !opt.live) recordTc2(x); return { ok:true }; }
      if (near(x, 1)) return { ok:false, msg:M.dom };
      if (Math.abs(x - 1) > 2) return { ok:false, msg:M.rise };
      return { ok:false, msg:tpl(M.other, { m:slopeHTML(x) }) };
    }
    if (id === "tc3") {
      if (S.fn !== "B") return { ok:false, msg:M.fn };
      if (S.c === 1 && S.k === 3) return { ok:true };
      if (S.c === -1 && S.k === 3) return { ok:false, msg:M.rev };
      if (S.c === 1) return { ok:false, msg:M.k };
      return { ok:false, msg:tpl(M.other, { r:flatsHTML() }) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stopAnim) { stopAnim(); stopAnim = null; }
        busy = true; S.fn = p.fn; S.mode = p.mode; S.showD = true; mark = null; zoom = false; note = ""; tc2msg = "";
        S.x[p.fn] = START[p.id]; paintTop(); dp.set(S.x[p.fn], "set"); paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; api.save(); paintAll(); MV.changed(); done(); }
        function show(pts, ms, cb){ mark = { fn:p.fn, pts:pts }; dp.render(); MV.wait(ms || 900, cb); }
        if (p.id === "p1") sweep(-2.5, 0, 1800, function(){ zoom = true; show([{ i:0, x:0, y:0, text:"slope 1: the tangent rises at 45°", dy:-24, dx:-12, align:"right" }], 1300, fin); });
        else if (p.id === "p2") sweep(-5, 5, 3000, function(){ show([{ i:1, x:-4.6, y:-3.5, text:"every slope is negative: f′ < 0", noRing:true, dx:0 }, { i:0, x:5, y:RX.R3.r.f(5), text:"no flat spots", dx:-12, dy:-22, align:"right" }], 1000, fin); });
        else if (p.id === "p3") sweep(-4, -1, 1300, function(){
          show([{ i:0, x:-1, y:-2, text:"slope 0 at (−1, −2)", dy:24 }], 800, function(){
            sweep(-1, 3, 2400, function(){ show([{ i:0, x:-1, y:-2, text:"slope 0 at (−1, −2)", dy:24 }, { i:0, x:3, y:6, text:"slope 0 at (3, 6)", dy:24 }, { i:0, x:1, y:-7, text:"no point at x = 1", noRing:true, dx:8 }], 1000, fin); });
          });
        });
        else if (p.id === "p4") sweep(0, 1, 1100, function(){ show([{ i:1, x:1, y:-8 / 9, text:"true slope: −8/9", dy:20 }, { i:1, x:1, y:1, text:"wrong rule: 1", dy:-18 }], 1100, fin); });
        else fin();
      }
    },
    challenge:function(id, opt){ return chal(id, opt); }
  };
}

// ---------- Part 3: Derive it ----------
function perms(n){ var out = []; (function go(a, rest){ if (!rest.length) { out.push(a); return; } rest.forEach(function(v, i){ go(a.concat([v]), rest.slice(0, i).concat(rest.slice(i + 1))); }); })([], Array.apply(null, Array(n)).map(function(_, i){ return i; })); return out; }
function part3(host, api){
  var S = api.S, C = api.content, ST = C.stations, s1 = ST[0], s2 = ST[1], s3 = ST[2];
  var HS = [0.1, 0.01, 0.001, -0.1, -0.01, -0.001];
  S.h = HS.indexOf(S.h) >= 0 ? S.h : 0.1; S.hs = Array.isArray(S.hs) ? S.hs : []; S.v3 = S.v3 === "rewrite" ? "rewrite" : "rule"; S.seen3 = S.seen3 || {};
  host.innerHTML =
    '<div class="part p3-st" id="qd-st1"><h3>' + s1.title + "</h3><p>" + s1.text + '</p><ol class="qd-steps" id="qd-steps"></ol><div id="qd-pl"></div><div class="qd-ord" id="qd-ord"></div></div>' +
    '<div class="part p3-st" id="qd-st2"><h3>' + s2.title + "</h3><p>" + s2.text + '</p><div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="qd-plot" role="img" aria-label="Secant and tangent to y = x/(x² + 1) at P(2, 2/5)"></canvas></div><p class="qd-rule">' + s2.rule + "</p></div>" +
      '<div><p class="tiny" style="font-weight:700;margin:0 0 6px">Choose ' + m("h") + '</p><div class="chips" id="qd-h" role="group" aria-label="Choose h"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="qd-fill" data-k="qdfill">Fill the table</button></div><div id="qd-tbl" aria-live="polite"></div></div></div>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + s2.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details></div>" +
    '<div class="part p3-st" id="qd-st3"><h3>' + s3.title + "</h3><p>" + s3.text + '</p><div class="seg-wrap" id="qd-seg"></div><div class="alg-lines qd-lines" id="qd-lines" aria-live="polite"></div>' +
      '<div class="refresh qd-thumb"><h4>Rule of thumb</h4><p>' + s3.thumb + "</p></div></div>";
  // ---- Station 1: N13 step-through, then N5 ordering ----
  function paintSteps(i){ $("#qd-steps", host).innerHTML = s1.steps.map(function(t, j){ return j <= i ? '<li class="' + (j === i ? "cur" : "") + '"><span class="sn">' + (j + 1) + ".</span><span>" + t + "</span></li>" : ""; }).join(""); }
  MV.player($("#qd-pl", host), { count:s1.steps.length, render:paintSteps, label:function(i){ return "Step " + (i + 1) + " of " + s1.steps.length; }, interval:1600 });
  var wrong = perms(5).filter(function(p){ return p.indexOf(3) < p.indexOf(2); }).map(function(p){ return { order:p, fb:s1.orderWrong }; });
  MV.activityTypes.order($("#qd-ord", host), { id:"p3-derive-order", type:"order", how:s1.orderHow,
    sequences:[{ id:"d5", prompt:s1.orderPrompt, steps:s1.steps, start:[2, 4, 0, 3, 1], wrong:wrong, why:s1.orderWhy }] });
  // ---- Station 2: secant table at x = 2 ----
  var f = function(x){ return x / (x * x + 1); }, P = [2, 0.4], TAN = -0.12;
  var V2 = { xmin:0.6, xmax:3.4, ymin:0.15, ymax:0.62 }, pl = new MV.Plot($("#qd-plot", host), V2);
  function slope(h){ return (f(2 + h) - P[1]) / h; }
  function hTxt(h){ return (h < 0 ? MINUS : "") + String(Math.abs(h)); }
  function draw2(){
    var h = S.h, qx = 2 + h, qy = f(qx), sm = slope(h), ink2 = css("--ink-2"), ink = css("--ink");
    pl.draw({ view:V2, yLabel:"y", curves:[{ f:f, color:css("--pen"), width:3 }],
      lines:[{ p:P, q:[3, P[1] + TAN], color:ink, width:2, dash:[7, 5] }, { p:P, q:[qx, qy], color:ink2, width:2 }],
      points:[{ x:P[0], y:P[1], r:5.5, color:ink, label:"P" }, { x:qx, y:qy, r:4.5, color:ink2 }],
      labels:[{ x:qx, y:qy, text:"Q", dx:h > 0 ? 10 : -10, dy:18, align:h > 0 ? "left" : "right", color:ink2, bg:true, font:"italic 600 14px " + (css("--font-math") || "serif") },
        { x:0.7, y:0.18, text:"dashes: tangent, slope −0.12", align:"left", dy:-4, color:ink, bg:true, font:ui(12) }],
      describe:"y = x/(x² + 1) near P(2, 2/5). Secant through Q at x = 2 + h with h = " + hTxt(h) + ", slope about " + num(sm, 6) + "; dashed tangent with slope −0.12." });
  }
  pl.render = draw2;
  function paint2(){
    MV.keepFocus($("#qd-h", host), function(){
      $("#qd-h", host).innerHTML = HS.map(function(h){ return '<button type="button" class="chip' + (h === S.h ? " on" : "") + '" data-h="' + h + '" data-k="qdh' + h + '" aria-pressed="' + (h === S.h) + '">' + m("h = " + hTxt(h)) + "</button>"; }).join("");
    });
    var rows = HS.filter(function(h){ return S.hs.indexOf(h) >= 0; });
    $("#qd-tbl", host).innerHTML = rows.length ? MV.tableHTML({ head:[m("h"), m("f(2 + h)"), "Secant slope"], rows:rows.map(function(h){ return [hTxt(h), dec(f(2 + h), 6), dec(slope(h), 6)]; }),
      hiRow:rows.indexOf(S.h), caption:"Secant slopes through P(2, 2/5)" }) + '<p class="tiny muted" style="margin:6px 0 0">Both columns of ' + m("h") + " close in on −0.12 = −3/25.</p>" : '<p class="tiny muted">Choose a value of ' + m("h") + " to add a row.</p>";
    $("#qd-fill", host).disabled = rows.length === HS.length;
    draw2();
  }
  // ---- Station 3: rewrite instead? ----
  function paint3(){
    S.seen3[S.v3] = true;
    MV.keepFocus($("#qd-seg", host), function(){ $("#qd-seg", host).innerHTML = segBtns("v3", [{ id:"rule", t:"Quotient rule" }, { id:"rewrite", t:"Rewrite first" }], S.v3, "Method"); });
    var L = S.v3 === "rule" ? s3.ruleLines : s3.rewriteLines;
    $("#qd-lines", host).innerHTML = L.map(function(l){ return "<div>" + l + "</div>"; }).join("") + (S.v3 === "rewrite" ? '<div class="qd-same"><small>' + s3.same + "</small></div>" : "") +
      (S.seen3.rule && S.seen3.rewrite ? '<div><small>' + (S.v3 === "rule" ? "4 lines" : "3 lines") + ", both ending at " + m("2x - {2}/{x^2}") + ".</small></div>" : "");
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.h != null) { S.h = +b.dataset.h; if (S.hs.indexOf(S.h) < 0) S.hs.push(S.h); api.save(); paint2(); return; }
    if (b.id === "qd-fill") { S.hs = HS.slice(); api.save(); paint2(); return; }
    if (b.dataset.v3) { S.v3 = b.dataset.v3; api.save(); paint3(); }
  });
  paint2(); paint3();
  return {};
}

// ---------- Practice 2: Slopes and tangents ----------
// @component V8 slopeBoxes — exact answers in labelled boxes (fractions such as 7/4 accepted), point pairs "(□, □) and (□, □)"
// in any order, or a chip choice; named wrong states per box value ({m:8}), per point ({x:2} / {pt:[1, −2]} / {pts:[…]}), a
// one-point-only message, first-try scoring.
function slopesAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, pick:null, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q qs-q" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="qs-in"></div><div class="qs-cl"></div></div>';
  }).join("");
  function inp(it, k, label, x){ return '<input class="numin short" data-bx="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .qs-in', host), h = "";
    if (it.kind === "boxes") h = '<div class="qs-bxs">' + it.boxes.map(function(b){ return "<label><span>" + b.label + "</span>" + inp(it, b.k, MV.plain(b.label), x) + "</label>"; }).join("") + "</div>";
    else if (it.kind === "points") h = '<div class="qs-pts">' + [0, 1].map(function(j){ return '<span class="qs-pt"><span class="tiny">Point ' + (j + 1) + '</span><span class="m">(</span>' + inp(it, "p" + j + "x", "Point " + (j + 1) + " x-coordinate", x) + '<span class="m">,</span>' + inp(it, "p" + j + "y", "Point " + (j + 1) + " y-coordinate", x) + '<span class="m">)</span></span>'; }).join("") + "</div>";
    else h = '<div class="chips" role="group" aria-label="Choices">' + it.options.map(function(o, j){ return '<button type="button" class="chip' + (x.pick === j ? " on" : "") + '" data-pick="' + j + '" data-k="' + it.id + "c" + j + '" aria-pressed="' + (x.pick === j) + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .qs-cl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    var okO = it.kind === "chips" ? it.options.filter(function(o){ return MV.ok(o); })[0] : null;
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct" + (okO ? ": " + okO.t : it.display ? ": " + it.display : "") + ".</strong> " + (okO ? okO.why : it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function val(raw){ var t = String(raw || "").trim(); if (!t) return { empty:true }; var p = MV.parseNum(t); return p && p.length === 1 ? { v:p[0] } : { err:true }; }
  var ERR = "Type a whole number or a fraction such as 7/4 or −1/2 in each box.";
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), W = it.wrong || [], i;
    if (it.kind === "chips") {
      if (x.pick == null) return { err:"Choose an answer first." };
      var o = it.options[x.pick]; return MV.ok(o) ? { ok:true } : { ok:false, msg:o.why };
    }
    if (it.kind === "boxes") {
      var vals = {};
      for (i = 0; i < it.boxes.length; i++) { var r = val(x.v[it.boxes[i].k]); if (r.empty) return { err:it.boxes.length > 1 ? "Fill in every box first." : "Type your answer first." }; if (r.err) return { err:ERR }; vals[it.boxes[i].k] = r.v; }
      if (Object.keys(ans).every(function(k){ return near(vals[k], ans[k], 1e-9); })) return { ok:true };
      var w = W.filter(function(z){ var ks = Object.keys(z).filter(function(k){ return k !== "fb"; }); return ks.every(function(k){ return near(vals[k], z[k], 1e-9); }); })[0];
      if (w) return { ok:false, msg:w.fb };
      var right = it.boxes.filter(function(b){ return near(vals[b.k], ans[b.k], 1e-9); });
      if (it.boxes.length > 1 && right.length) return { ok:false, msg:"Your " + MV.plain(right[0].label).toLowerCase() + " is right; check the other box." };
      return { ok:false, msg:"Write `f`, `g`, `f′`, `g′`, use the quotient rule, then substitute." };
    }
    var pts = [];
    for (i = 0; i < 2; i++) {
      var px = val(x.v["p" + i + "x"]), py = val(x.v["p" + i + "y"]);
      if (px.empty && py.empty) continue;
      if (px.empty || py.empty) return { err:"Fill in both coordinates of each point." };
      if (px.err || py.err) return { err:ERR };
      pts.push([px.v, py.v]);
    }
    if (!pts.length) return { err:"Type the coordinates of the points first." };
    function same(p, q){ return near(p[0], q[0], 1e-9) && near(p[1], q[1], 1e-9); }
    function has(list, p){ return list.some(function(q){ return same(p, q); }); }
    if (pts.length === 2 && ans.every(function(q){ return has(pts, q); })) return { ok:true };
    for (i = 0; i < W.length; i++) {
      var z = W[i];
      if (z.x != null && pts.some(function(p){ return near(p[0], z.x, 1e-9); })) return { ok:false, msg:z.fb };
      if (z.pt && has(pts, z.pt)) return { ok:false, msg:z.fb };
      if (z.pts && pts.some(function(p){ return has(z.pts, p); })) return { ok:false, msg:z.fb };
    }
    var good = pts.filter(function(p){ return has(ans, p); });
    if (pts.length === 1 && good.length) return { ok:false, msg:it.one || "There are two points. Find the other one." };
    if (pts.length === 2 && same(pts[0], pts[1])) return { ok:false, msg:"Enter two different points." };
    if (good.length) return { ok:false, msg:"One point is right; check the other." };
    if (pts.some(function(p){ return ans.some(function(q){ return near(p[0], q[0], 1e-9); }); })) return { ok:false, msg:"Check each `y`-value in the original function." };
    return { ok:false, msg:"Find where the numerator of `f′` meets the condition, then find each `y`-value from the original function." };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
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
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + MV.md(r.msg) + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Two flat spots ----------
var task = (function(){
  var api, plot;
  function g(k, lo, hi){ var s = api ? api.S : {}, t = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= lo && v <= hi ? v : null; }
  function read(){ var b = g("b", -50, 50), c = g("c", -10, 10); return { b:b, c:c, valid:b !== null && c !== null }; }
  function info(d){
    var D = d.c * d.c + d.b, s = D > 0 ? Math.sqrt(D) : 0;
    return { D:D, cancel:D === 0, roots:D > 0 ? [d.c - s, d.c + s] : [], f:function(x){ return Math.abs(x - d.c) < 1e-12 ? NaN : (x * x + d.b) / (x - d.c); } };
  }
  function numSrc(b){ return "x^2" + (b ? " " + sgnTxt(b) : ""); }
  function denSrc(c){ return c ? "x " + sgnTxt(-c) : "x"; }
  function eqSrc(d){ return "y = {" + numSrc(d.b) + "}/{" + denSrc(d.c) + "}"; }
  function dHTML(d, I){
    if (I.cancel) return m("y = " + (d.c ? "x " + sgnTxt(d.c) : "x")) + " (with a hole), so " + m("f′(x) = 1");
    var top = "x^2" + (d.c ? " " + sgnTxt(-2 * d.c) + "x" : "") + (d.b ? " " + sgnTxt(-d.b) : "");
    if (I.D > 0 && Number.isInteger(Math.sqrt(I.D))) top = facSrc(r9(I.roots[0])) + facSrc(r9(I.roots[1]));
    return m("f′(x) = {" + top + "}/{(" + denSrc(d.c) + ")^2}");
  }
  function draw(){
    var d = read(), V0 = { xmin:-6, xmax:10, ymin:-10, ymax:20 };
    if (!d.valid) { plot.draw({ view:V0, describe:"Enter whole numbers for b (−50 to 50) and c (−10 to 10) to draw the graph." }); return; }
    var I = info(d), xs = [d.c, 0, 5].concat(I.roots), x0 = Math.min.apply(null, xs) - 4, x1 = Math.max.apply(null, xs) + 4;
    if (x1 - x0 < 12) { var mid = (x0 + x1) / 2; x0 = mid - 6; x1 = mid + 6; }
    var ys = I.cancel ? [x0 + d.c, x1 + d.c] : I.roots.map(I.f).concat([I.f(x0), I.f(x1)]).concat(d.c ? [d.b / -d.c] : []);
    ys = ys.filter(isFinite); var y0 = Math.min.apply(null, ys.concat([0])), y1 = Math.max.apply(null, ys.concat([0])), pad = Math.max(4, (y1 - y0) * 0.3);
    var V = { xmin:x0, xmax:x1, ymin:y0 - pad, ymax:y1 + pad }, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen");
    var pts = [], labs = [], segs = [{ x1:5, y1:V.ymin, x2:5, y2:V.ymax, color:ink2, width:1.2, dash:[2, 5] }];
    labs.push({ x:5, y:V.ymin, text:"x = 5", dx:6, dy:-12, align:"left", color:ink2, bg:true, font:"italic 13px " + (css("--font-math") || "serif") });
    if (I.cancel) pts.push({ x:d.c, y:2 * d.c, r:5.5, open:true, color:pen });
    I.roots.forEach(function(r){ var y = I.f(r); pts.push({ x:r, y:y, r:5.5, color:ink }); segs.push({ x1:r - (x1 - x0) * 0.05, y1:y, x2:r + (x1 - x0) * 0.05, y2:y, color:ink, width:2 }); labs.push({ x:r, y:y, text:"slope 0", dy:-16, align:"center", bg:true, font:ui(12) }); });
    if (d.c) { var yi = d.b / -d.c; pts.push({ x:0, y:yi, r:4.5, color:ink2 }); }
    plot.draw({ view:V, yLabel:"y", asymptotes:I.cancel ? [] : [{ x:d.c }], curves:[{ f:I.f, color:pen, width:3 }], segments:segs, points:pts, labels:labs,
      describe:"Graph of " + MV.plain(m(eqSrc(d))) + (I.cancel ? ": it cancels to a line with a hole at x = " + d.c + "." : "; vertical asymptote x = " + d.c + "; " + (I.roots.length ? "horizontal tangents at x = " + I.roots.map(function(r){ return num(r, 2); }).join(" and ") : "no horizontal tangents") + (d.c ? "; y-intercept " + num(d.b / -d.c, 2) : "; no y-intercept") + ".") });
  }
  function readout(){
    var d = read(), el = $("#qt-read"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Enter whole numbers: ' + m("b") + " from −50 to 50 and " + m("c") + " from −10 to 10.</dd></div>"; return; }
    var I = info(d);
    el.innerHTML = MV.readoutHTML([
      ["Function", m(eqSrc(d))],
      ["Derivative", dHTML(d, I)],
      ["Vertical asymptote", I.cancel ? "none: the factor cancels, leaving a hole at " + m("x = " + num(d.c)) : m("x = " + num(d.c))],
      ["Horizontal tangents", I.roots.length ? I.roots.map(function(r){ var R = r9(r); return Number.isInteger(R) ? m("x = " + R) : m("x = " + rootSrc(-d.c, I.D, r < d.c ? -1 : 1)) + " ≈ " + num(r, 2); }).join(", ") : "none"],
      [m("y") + "-intercept", d.c ? dec(d.b / -d.c, 2) : "none: " + m("x = 0") + " isn’t in the domain"]
    ]);
  }
  function stepper(k, lo, hi, v){
    return '<div class="qt-step"><label for="qt-' + k + '"><span class="m qt-lab">' + "<i>" + k + "</i></span> " + '<span class="tiny muted">(' + num(lo) + " to " + num(hi) + ")</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="qt' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="qt-' + k + '" data-tk="' + k + '" type="number" min="' + lo + '" max="' + hi + '" step="1" autocomplete="off" value="' + MV.esc(v) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="qt' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.b == null) { a.S.b = "0"; a.S.c = "1"; }
      inp.innerHTML = stepper("b", -50, 50, a.S.b) + stepper("c", -10, 10, a.S.c);
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="qt-plot" role="img" aria-label="Your function"></canvas></div><dl class="read" id="qt-read" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#qt-plot"), { xmin:-6, xmax:10, ymin:-10, ymax:20 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, lo = k === "b" ? -50 : -10, hi = k === "b" ? 50 : 10, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10);
        if (!isFinite(cur)) cur = 0;
        a.S[k] = String(Math.max(lo, Math.min(hi, cur + +b.dataset.dir))); $("#qt-" + k).value = a.S[k];
        a.save(); draw(); readout(); a.update();
      });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers: b from −50 to 50 and c from −10 to 10."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      var D = d.c * d.c + d.b;
      return [d.c > 0 && D !== 0, D > 0, 25 - 10 * d.c - d.b === 0 && d.c !== 5, d.c !== 0 && d.b / -d.c > 0];
    },
    key:function(d){ return d.b + "|" + d.c; },
    label:function(k){ var p = k.split("|"); return m(eqSrc({ b:+p[0], c:+p[1] })); },
    text:function(k){ var p = k.split("|"); return MV.plain(m(eqSrc({ b:+p[0], c:+p[1] }))).replace(/^y = /, ""); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ slopes:slopesAct },
  task:task
});
})();
