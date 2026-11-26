// MCV4U 09 Derivatives of Polynomials: hero (power-rule typography + slope trail), Rule checker (Explore: V5 derivative panels
// with Multiply, Add/Build and Any power modes, a stacked slope bar), Given a slope (Part 3: slope dial; tangent and normal),
// V8 coefficient entry (Practice 1), V8 point entry (Practice 2) and the "Peak at x = 1" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function md(s){ return MV.md(s); }
function mi(s){ return MV.m(s).replace(/^<span class="m">/, "").replace(/<\/span>$/, ""); }   // m() without the outer span
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function snapTo(v, st, lo, hi){ v = Math.round(v / st) * st; return r9(Math.max(lo, Math.min(hi, v))); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(sz, w){ return (w || 600) + " " + sz + "px " + (css("--font-ui") || "sans-serif"); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
// 4-decimal readout with a true minus (plan: measured slopes "0.2500")
function f4(v){
  if (!isFinite(v)) return "none";
  var s = Math.abs(v).toFixed(4), p = s.split(".");
  if (p[0].length > 4) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (v < 0 && +s !== 0 ? MINUS : "") + p.join(".");
}

// ---------- exact values: rationals and A + B√s ----------
var ONE = { n:1, d:1 }, ZERO = { n:0, d:1 };
function qv(v){ return Q.of(r9(v)); }
function qpow(a, e){ var r = ONE; if (e < 0) { a = Q.div(ONE, a); e = -e; } for (var i = 0; i < e; i++) r = Q.mul(r, a); return r; }
function qInline(q){ return q.d === 1 ? String(q.n) : (q.n < 0 ? "-" : "") + Math.abs(q.n) + "/" + q.d; }
function termDec(q){ var d = q.d; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1 && 10000 % q.d === 0; }
// m() source for a rational: integers; halves, quarters and eighths as fractions; other terminating values as decimals
function ratSrc(q){ if (q.d === 1) return String(q.n); if (q.d > 8 && termDec(q)) return String(r9(q.n / q.d)); return qInline(q); }
function ratNeedsApprox(q){ return q.d > 1 && !termDec(q); }
// exact Σ c·p·x^(p − 1) for terms [{c, p}] (p a multiple of 1/2): {A, B, s} meaning A + B√s, s square-free
function exactD(T, x){
  var X = qv(x), A = ZERO, B = ZERO, s = 1, rt = null;
  T.forEach(function(t){
    if (!t.p) return;
    var coef = Q.mul(qv(t.c), qv(t.p)), e = t.p - 1;
    if (Number.isInteger(e)) { if (e < 0 && !X.n) return; A = Q.add(A, Q.mul(coef, qpow(X, e))); return; }
    if (X.n <= 0) return;
    if (!rt) { var kf = MV.mcv.kfree(X.n * X.d, 2); rt = { r:Q.of(kf[0], X.d), s:kf[1] }; }
    s = rt.s; B = Q.add(B, Q.mul(Q.mul(coef, qpow(X, Math.floor(e))), rt.r));
  });
  if (s === 1) { A = Q.add(A, B); B = ZERO; }
  return { A:A, B:B, s:s };
}
function exVal(E){ return Q.val(E.A) + Q.val(E.B) * Math.sqrt(E.s); }
function exSrc(E){
  var out = E.A.n ? ratSrc(E.A) : "";
  if (E.B.n) {
    var b = Q.abs(E.B), body = (b.n === 1 ? "" : b.n) + "√" + E.s + (b.d > 1 ? "/" + b.d : "");
    out += (E.B.n < 0 ? (out ? " - " : "-") : (out ? " + " : "")) + body;
  }
  return out || "0";
}
function exApprox(E){ return E.B.n || ratNeedsApprox(E.A); }
function exHTML(E){ return m(exSrc(E)) + (exApprox(E) ? " ≈ " + f4(exVal(E)) : ""); }
function wrapSrc(src){ return /^-|\s[+-]\s/.test(src) ? "(" + src + ")" : src; }
function exAdd(E1, E2){ if (E1.B.n && E2.B.n && E1.s !== E2.s) return null; return { A:Q.add(E1.A, E2.A), B:Q.add(E1.B, E2.B), s:E1.B.n ? E1.s : E2.s }; }

// ---------- polynomials as terms [{c, p}] ----------
function fval(T, x){
  var s = 0;
  for (var i = 0; i < T.length; i++) {
    var t = T[i];
    if (!t.p) { s += t.c; continue; }
    if (!Number.isInteger(t.p) && x < 0) return NaN;
    if (t.p < 0 && Math.abs(x) < 1e-12) return NaN;
    s += t.c * Math.pow(x, t.p);
  }
  return s;
}
function dval(T, x){
  var s = 0;
  for (var i = 0; i < T.length; i++) {
    var t = T[i]; if (!t.p) continue;
    if (!Number.isInteger(t.p) && x <= 0) return NaN;
    if (t.p < 1 && Math.abs(x) < 1e-12) return NaN;
    s += t.c * t.p * Math.pow(x, t.p - 1);
  }
  return s;
}
var HSTEP = 1e-4;                                    // plan: central difference with h = 0.0001
function measured(f, x){ return (f(x + HSTEP) - f(x - HSTEP)) / (2 * HSTEP); }
function agree(meas, ex){ return isFinite(meas) && Math.abs(meas - ex) <= 0.001 * Math.max(1, Math.abs(ex)); }
function cSrc(c, isConst){ var q = qv(c), a = Q.abs(q); if (!isConst && a.n === 1 && a.d === 1) return ""; return a.d === 1 ? String(a.n) : "{" + a.n + "}/{" + a.d + "}"; }
function eSrc(p){ return qInline(qv(p)); }
function xpow(p, sq){ if (p === 1) return "x"; if (p === 0.5 && sq) return "√x"; return "x^{" + eSrc(p) + "}"; }
function termSrc(t, first, sq){
  var neg = t.c < 0, body = t.p === 0 ? cSrc(t.c, true) : cSrc(t.c) + xpow(t.p, sq);
  return (first ? (neg ? "-" : "") : (neg ? " - " : " + ")) + body;
}
function combine(T){
  var mp = {}, keys = [];
  T.forEach(function(t){ var k = String(t.p); if (!(k in mp)) { mp[k] = 0; keys.push(t.p); } mp[k] = r9(mp[k] + t.c); });
  return keys.sort(function(a, b){ return b - a; }).map(function(p){ return { c:mp[String(p)], p:p }; }).filter(function(t){ return t.c !== 0; });
}
function polySrc(T, sq){ var C = combine(T); return C.length ? C.map(function(t, i){ return termSrc(t, !i, sq); }).join("") : "0"; }
function derivTerms(T){ return T.map(function(t){ return { c:r9(t.c * t.p), p:t.p ? t.p - 1 : 0 }; }); }
// term-by-term derivative, keeping a "+ 0" for each constant (plan: "20x³ − 2 + 0")
function termwiseSrc(T){ return T.map(function(t, i){ var d = { c:r9(t.c * t.p), p:t.p - 1 }; if (!t.p) return i ? " + 0" : "0"; return termSrc(d, !i); }).join(""); }

// ---------- views ----------
function fitY(fns, lo, hi, skip0){
  var a = Infinity, b = -Infinity;
  for (var i = 0; i <= 160; i++) {
    var x = lo + (hi - lo) * i / 160; if (skip0 && Math.abs(x) < 0.45) continue;
    fns.forEach(function(f){ var y = f(x); if (isFinite(y)) { a = Math.min(a, y); b = Math.max(b, y); } });
  }
  if (!isFinite(a)) { a = -1; b = 1; }
  a = Math.min(a, 0); b = Math.max(b, 0);
  if (b - a < 2) { var c = (a + b) / 2; a = c - 1; b = c + 1; }
  var pad = (b - a) * 0.12;
  return { ymin:a - pad, ymax:b + pad };
}

// =====================================================================================================================
// @component V5 derivativePanels (copied from MCV4U 07, trimmed: no Trail/Table/Sketch layers; the probe's key step follows
// the current domain; no0:true skips x = 0) — linked panels for f and f′ on one shared x-axis with one probe line.
//   Top panel: f (--pen, 3 px), its tangent (--ink, 2 px), an optional "slope = 4.00" label; a probe point outside the window
//   becomes an edge arrow. Lower panel: f′ (--f3) when layers(1).show, a dot at (x, f′(x)) when layers(1).dot.
//   var dp = derivativePanels(host, { fn:function(){ return FN; }, x, big:10, aria:[…], labels:["f(x)", "f′(x)"],
//     layers:function(i){ return { tangent, slopeLabel, show, dot }; }, extra:function(i, scene, plot, x){},
//     describe:function(i, x){}, locked:function(){}, onMove:function(x, how, prev){} })
//   FN = { f, d, view:{xmin, xmax, ymin, ymax}, dv:{ymin, ymax}, lo, hi, step, no0 }  -> { get(), set(x, how), render(), plots }
function dpSlopeLabel(v){
  if (!isFinite(v)) return "no single tangent";
  var c = Math.round(r9(v) * 100), exact = Math.abs(r9(v) * 100 - c) < 1e-6;
  return "slope " + (exact ? "= " : "≈ ") + (c < 0 ? MINUS : "") + (Math.abs(c) / 100).toFixed(2);
}
function dpEdge(ctx, p, x, y, col){
  var v = p.v, X = p.X(x), up = y > v.ymax; if (!isFinite(y) || (y <= v.ymax && y >= v.ymin)) return;
  var Y = up ? 4 : p.H - 4, s = 8;
  ctx.save(); ctx.fillStyle = col; ctx.beginPath();
  if (up) { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y + s * 1.4); ctx.lineTo(X + s, Y + s * 1.4); }
  else { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y - s * 1.4); ctx.lineTo(X + s, Y - s * 1.4); }
  ctx.closePath(); ctx.fill();
  ctx.font = ui(13); ctx.textAlign = X > p.W - 70 ? "right" : "left"; ctx.textBaseline = up ? "top" : "bottom";
  ctx.fillText(num(y, 2), X + (X > p.W - 70 ? -12 : 12), up ? 4 : p.H - 4);
  ctx.restore();
}
function probeLine(ctx, p, x){
  var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
}
function derivativePanels(host, o){
  var cls = ["dp-top", "dp-low"], aria = o.aria || [], labels = o.labels || ["f(x)", "f′(x)"];
  host.classList.add("dp-panels");
  host.innerHTML = cls.map(function(c, i){ return '<div class="plot-wrap dp-panel"><canvas class="plot ' + c + '" role="img" aria-label="' + MV.esc(aria[i] || "") + '"></canvas></div>'; }).join("");
  var cv = $$("canvas", host), x = o.x, plots = cv.map(function(c){ return new MV.Plot(c, { xmin:-1, xmax:1, ymin:-1, ymax:1 }); });
  function F(){ return o.fn(); }
  function step(){ return F().step || 0.1; }
  function snap(v){ var Fn = F(), st = step(); v = snapTo(v, st, Fn.lo, Fn.hi); if (Fn.no0 && Math.abs(v) < 1e-9) v = x > 0 ? -st : st; return r9(v); }
  function scene(i){
    var Fn = F(), V = Fn.view, L = (o.layers && o.layers(i)) || {}, ink = css("--ink");
    if (i === 0) {
      var y = Fn.f(x), d = Fn.d(x), ok = isFinite(d), yc = Math.max(V.ymin, Math.min(V.ymax, y)), right = (x - V.xmin) / (V.xmax - V.xmin) > 0.55;
      var sc = { view:V, yLabel:labels[0], curves:[{ f:Fn.f, color:css("--pen"), width:3 }], lines:[], points:[], labels:[], segments:[] };
      if (ok && L.tangent !== false) sc.lines.push({ p:[x, y], q:[x + 1, y + d], color:ink, width:2 });
      if (isFinite(y) && y === yc) sc.points.push({ x:x, y:y, r:6, color:ink, ring:true });
      if (L.slopeLabel !== false && isFinite(y)) sc.labels.push({ x:x, y:yc, text:dpSlopeLabel(d), dx:right ? -14 : 14, dy:yc > V.ymax - (V.ymax - V.ymin) * 0.15 ? 22 : -22, align:right ? "right" : "left", bg:true, font:ui(14) });
      sc.after = function(ctx, pl){ probeLine(ctx, pl, x); dpEdge(ctx, pl, x, y, ink); };
      return sc;
    }
    var g = Fn.d, c = css("--f3"), v2 = { xmin:V.xmin, xmax:V.xmax, ymin:Fn.dv.ymin, ymax:Fn.dv.ymax }, gy = g(x);
    var s2 = { view:v2, yLabel:labels[1], curves:[], points:[], labels:[], segments:[], lines:[] };
    if (L.show) s2.curves.push({ f:g, color:c, width:2.6 });
    if (L.dot && isFinite(gy) && gy >= v2.ymin && gy <= v2.ymax) s2.points.push({ x:x, y:gy, r:5.5, color:c, ring:true });
    s2.after = function(ctx, pl){ probeLine(ctx, pl, x); if (L.dot) dpEdge(ctx, pl, x, gy, c); };
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
  var stp = { x:step(), y:step() };
  function set(v, how){
    if (o.locked && o.locked() && how !== "anim" && how !== "set") return;
    stp.x = stp.y = step();
    v = snap(v); if (v === x && how !== "set") return;
    var prev = x; x = v;
    if (o.onMove) o.onMove(x, how, prev);
    render();
  }
  var dr = MV.drag(plots[0], { axis:"x", step:stp, big:o.big || 10,
    handles:function(){ var Fn = F(), y = Fn.f(x), V = Fn.view; return [{ id:"probe", x:x, y:isFinite(y) ? Math.max(V.ymin, Math.min(V.ymax, y)) : 0, label:o.handleLabel ? o.handleLabel(x) : "Probe at x = " + num(x, 2) + ". Arrow keys move it; Shift moves it 10 steps." }]; },
    move:function(id, nx, ny, how){ set(nx, how === "key" ? "key" : "drag"); } });
  plots.forEach(function(p){
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
    p.c.addEventListener("pointerdown", function(e){
      if (e.defaultPrevented || (o.locked && o.locked())) return;
      active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {}
      set(at(e), "tap");
    });
    p.c.addEventListener("pointermove", function(e){ if (active) set(at(e), "drag"); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  });
  return { get:function(){ return x; }, set:set, render:render, plots:plots, focus:function(){ dr.focus("probe"); } };
}
// ------------------------------------------------- end of V5 derivativePanels ---------------------------------------------------

// ---------- the rule checker's functions ----------
var BASES = { x2:[{ c:1, p:2 }], x3:[{ c:1, p:3 }], sqrt:[{ c:1, p:0.5 }] };
var ADDS = { x:[{ c:1, p:1 }], x2:[{ c:1, p:2 }], x3:[{ c:1, p:3 }], m2x2:[{ c:-2, p:2 }], c4:[{ c:4, p:0 }], sqrt:[{ c:1, p:0.5 }] };
var BUILDS = { x3:{ c:1, p:3 }, x2:{ c:1, p:2 }, mx2:{ c:-1, p:2 }, m2x:{ c:-2, p:1 }, m3x:{ c:-3, p:1 }, c5:{ c:5, p:0 }, sqrt:{ c:1, p:0.5 } };
var BORDER = ["x3", "x2", "mx2", "m2x", "m3x", "c5", "sqrt"];
function hasRoot(T){ return T.some(function(t){ return !Number.isInteger(t.p); }); }
function scaled(T, k){ return T.map(function(t){ return { c:r9(t.c * k), p:t.p }; }); }
// fixed windows for Multiply (room for |k| up to 3 near the probe)
var MULV = { x2:{ view:{ xmin:-3.4, xmax:3.4, ymin:-14, ymax:14 }, dv:{ ymin:-19, ymax:19 } },
  x3:{ view:{ xmin:-3.4, xmax:3.4, ymin:-30, ymax:30 }, dv:{ ymin:-40, ymax:40 } },
  sqrt:{ view:{ xmin:-0.4, xmax:4.4, ymin:-6.5, ymax:6.5 }, dv:{ ymin:-3.4, ymax:3.4 } } };
function nTxt(n){ return qInline(qv(n)).replace("-", MINUS); }
function nIsInt(n){ return Number.isInteger(r9(n)); }

// ---------- hero: x³ → 3x², a slope trail that draws 3x², then 5x⁴ − 2x + 7 → 20x³ − 2 + 0 ----------
function hero(f){
  var top = f.canvas, low = $("#hero-d"), hx = $("#rc-hx"); if (!top || !low || !hx) return;
  var Hf = function(x){ return x * x * x; }, Hd = function(x){ return 3 * x * x; };
  var V = { xmin:-2.3, xmax:2.3, ymin:-9, ymax:9 }, DV = { xmin:-2.3, xmax:2.3, ymin:-1.5, ymax:13 };
  var pt = new MV.Plot(top, V), pl = new MV.Plot(low, DV), st = { x:-2, done:false, trail:false };
  hx.innerHTML = '<div class="hx-row hx-r1"><span class="m"><span class="hx-co">3</span><i>x</i><sup class="hx-sup"><span class="hx-old">3</span><span class="hx-new">2</span></sup></span></div>' +
    '<div class="hx-row hx-r2"><span class="m">' +
      '<span class="hx-t"><span class="hx-b">' + mi("5x^4") + '</span><span class="hx-a">' + mi("20x^3") + "</span></span>" +
      '<span class="hx-t"><span class="hx-b">' + mi(" - 2x") + '</span><span class="hx-a">' + mi(" - 2") + "</span></span>" +
      '<span class="hx-t hx-t3"><span class="hx-b">' + mi(" + 7") + '</span><span class="hx-a">' + mi(" + 0") + "</span></span></span></div>";
  var co = $(".hx-co", hx), old = $(".hx-old", hx), nw = $(".hx-new", hx), r2 = $(".hx-r2", hx), T = $$(".hx-t", hx);
  function draw(){
    var x = st.x, y = Hf(x), d = Hd(x), ink = css("--ink"), f3 = css("--f3");
    pt.draw({ view:V, yLabel:"y", curves:[{ f:Hf, color:css("--pen"), width:3 }], lines:st.trail ? [{ p:[x, y], q:[x + 1, y + d], color:ink, width:2 }] : [],
      points:st.trail ? [{ x:x, y:y, r:6, color:ink }] : [],
      labels:st.trail ? [{ x:x, y:y, text:dpSlopeLabel(d), dx:x > 0.6 ? -14 : 14, dy:-22, align:x > 0.6 ? "right" : "left", bg:true, font:ui(14) }] : [],
      describe:"Top panel: y = x³" + (st.trail ? ", with its tangent at x = " + num(x, 2) + ", slope " + num(d, 2) + "." : "."),
      after:function(ctx, p){ if (st.trail) probeLine(ctx, p, x); } });
    pl.draw({ view:DV, yLabel:"slope", curves:[{ f:Hd, color:f3, width:2, dash:[5, 6], alpha:0.55 }].concat(st.trail ? [{ f:Hd, color:f3, width:3.2, domain:[-2, x] }] : []),
      points:st.trail ? [{ x:x, y:d, r:5.5, color:f3 }] : [],
      labels:st.done ? [{ x:1.15, y:10, text:"3x²", color:f3, align:"right", font:"italic 600 17px " + (css("--font-math") || "serif"), bg:true }] : [],
      describe:"Bottom panel: the formula 3x² dashed" + (st.trail ? ", and the slopes of the tangent traced from x = −2 to x = " + num(x, 2) + (st.done ? ": they lie exactly on 3x²." : ".") : "."),
      after:function(ctx, p){ if (st.trail) probeLine(ctx, p, x); } });
  }
  pt.render = draw; pl.render = draw;
  function cap(h){ if (f.cap) f.cap.innerHTML = h; }
  var CAPS = ["Bring the 3 down, lower the exponent: " + m("x^3 → 3x^2") + ".", "The slope of " + m("y = x^3") + " traces " + m("3x^2") + ".",
    "Term by term: " + m("5x^4 - 2x + 7 → 20x^3 - 2 + 0") + ", and the 0 fades."];
  function final(){
    co.style.opacity = 1; old.style.opacity = 0; old.style.transform = ""; nw.style.opacity = 1; r2.style.opacity = 1;
    T.forEach(function(t, i){ $(".hx-b", t).style.opacity = 0; $(".hx-a", t).style.opacity = i === 2 ? 0 : 1; });
    st.x = 2; st.trail = true; st.done = true; draw();
    cap("Term by term: " + m("5x^4 - 2x + 7 → 20x^3 - 2") + ". The slopes of " + m("x^3") + " trace " + m("3x^2") + ".");
  }
  draw();
  if (MV.reduceMotion) { final(); return; }
  r2.style.opacity = 0;
  MV.wait(600, function(){
    var ro = old.getBoundingClientRect(), rc = co.getBoundingClientRect();
    if (!ro.width || !rc.width) { final(); return; }
    cap(CAPS[0]);
    var dx = rc.left + rc.width / 2 - (ro.left + ro.width / 2), dy = rc.top + rc.height / 2 - (ro.top + ro.height / 2), k = rc.height / Math.max(1, ro.height);
    MV.tween({ dur:1100, step:function(t){ old.style.transform = "translate(" + dx * t + "px," + dy * t + "px) scale(" + (1 + (k - 1) * t) + ")"; }, done:function(){
      co.style.opacity = 1; old.style.opacity = 0;
      MV.tween({ dur:500, step:function(t){ nw.style.opacity = t; }, done:function(){
        MV.wait(500, function(){
          cap(CAPS[1]); st.trail = true;
          MV.tween({ dur:3800, ease:function(t){ return t; }, step:function(t){ st.x = -2 + 4 * t; draw(); }, done:function(){
            st.x = 2; st.done = true; draw();
            MV.wait(700, function(){
              cap(CAPS[2]);
              MV.tween({ dur:400, step:function(t){ r2.style.opacity = t; }, done:function(){
                var i = 0;
                (function next(){
                  if (i > 2) { MV.wait(300, function(){ MV.tween({ dur:700, step:function(t){ $(".hx-a", T[2]).style.opacity = 1 - t; }, done:final }); }); return; }
                  var tt = T[i++];
                  MV.wait(250, function(){ MV.tween({ dur:600, step:function(t){ $(".hx-b", tt).style.opacity = 1 - t; $(".hx-a", tt).style.opacity = t; }, done:next }); });
                })();
              } });
            });
          } });
        });
      } });
    } });
  });
}

// ---------- Explore: Rule checker ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["mul", "add", "pow"].indexOf(S.mode) < 0) S.mode = "mul";
  S.mul = S.mul || { base:"x2", k:2 }; if (!BASES[S.mul.base]) S.mul.base = "x2";
  S.add = S.add || { sub:"pair", f:"x2", g:"x", set:[] }; S.add.set = (S.add.set || []).filter(function(k){ return BUILDS[k]; });
  S.pow = S.pow || { k:1, n:2 };
  S.xs = S.xs || { mul:2, add:1, pow:2 };
  var busy = false, mark = null, CUR = null, SL = {};
  host.innerHTML = '<div class="dp-ex rc-ex"><div class="dp-main" data-mv="graph"><p class="eq-cap rc-cap" id="rc-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p><div id="rc-panels"></div>' +
    '<p class="tiny muted rc-key" id="rc-key"></p></div>' +
    '<div class="dp-side" id="rc-side"><div class="seg-wrap" id="rc-mode"></div><p class="tiny muted rc-how" id="rc-how"></p><div id="rc-ctl"></div>' +
    '<label class="slider rc-xsl"><span class="slider-top"><span>Probe ' + m("x") + '</span><output id="rc-xout"></output></span>' +
    '<input type="range" id="rc-x" min="-3" max="3" step="0.1" style="accent-color:var(--ink)" aria-label="Probe x (Shift + arrow moves 10 steps)"></label>' +
    '<dl class="read rc-read" id="rc-read" aria-live="polite"></dl><div id="rc-bar"></div></div></div>';
  function key(){ return S.mode; }
  function xv(){ var v = S.xs[key()]; return v == null ? 1 : v; }
  // the current state as functions: top (main f, optional g / f + g), derivative, windows and the probe's domain
  function state(){
    var md0 = S.mode, o = { mode:md0 };
    if (md0 === "mul") {
      o.f = BASES[S.mul.base]; o.k = S.mul.k; o.g = scaled(o.f, o.k); o.main = o.f;
      Object.assign(o, MULV[S.mul.base]);
    } else if (md0 === "add" && S.add.sub === "pair") {
      o.f = ADDS[S.add.f]; o.g = ADDS[S.add.g]; o.sum = o.f.concat(o.g); o.main = o.f;
    } else if (md0 === "add") {
      o.build = true; o.sum = S.add.set.slice().sort(function(a, b){ return BORDER.indexOf(a) - BORDER.indexOf(b); }).map(function(k){ return BUILDS[k]; }); o.main = o.sum;
    } else { o.k = S.pow.k; o.n = S.pow.n; o.main = [{ c:o.k, p:o.n }]; }
    var root = hasRoot(o.main.concat(o.g || [], o.sum || []));
    o.skip = md0 === "pow" && o.n < 0;
    if (md0 === "pow") {
      var intN = nIsInt(o.n);
      o.lo = intN ? -4 : 0.25; o.hi = 4; o.step = intN ? 0.1 : 0.05; o.no0 = intN && o.n <= 0;
      o.dom = !intN ? "pos" : o.n <= 0 ? "no0" : "all";
    } else if (root) { o.lo = 0.25; o.hi = 4; o.step = 0.05; o.dom = "pos"; }
    else { o.lo = -3; o.hi = 3; o.step = 0.1; o.dom = "all"; }
    var T = o.main, n0 = o.no0;
    o.fx = function(x){ return n0 && Math.abs(x) < 1e-12 ? NaN : fval(T, x); };
    o.dx = function(x){ return n0 && Math.abs(x) < 1e-12 ? NaN : dval(T, x); };
    if (!o.view) {
      var xa = o.dom === "pos" ? -0.4 : o.lo - 0.4, xb = o.hi + 0.4, fs = [o.fx], ds = [o.dx];
      if (o.g) { fs.push(function(x){ return fval(o.g, x); }); ds.push(function(x){ return dval(o.g, x); }); }
      if (o.sum && !o.build) { fs.push(function(x){ return fval(o.sum, x); }); ds.push(function(x){ return dval(o.sum, x); }); }
      o.view = Object.assign({ xmin:xa, xmax:xb }, fitY(fs, o.dom === "pos" ? 0.25 : o.lo, o.hi, o.skip)); o.dv = fitY(ds, o.dom === "pos" ? 0.25 : o.lo, o.hi, o.skip);
    }
    return o;
  }
  function FNOBJ(){ var o = CUR; return { f:o.fx, d:o.dx, view:o.view, dv:o.dv, lo:o.lo, hi:o.hi, step:o.step, no0:o.no0 }; }
  var FNC = null;
  function refresh(){ CUR = state(); FNC = FNOBJ(); }
  refresh();
  var dp = derivativePanels($("#rc-panels", host), {
    fn:function(){ return FNC; }, x:xv(), big:10,
    aria:["Top panel: the functions with tangents at the probe", "Bottom panel: their derivatives"], labels:["y", "slope"],
    layers:function(i){ var two = CUR.mode === "mul" || (CUR.mode === "add" && !CUR.build); return i ? { show:true, dot:true } : { slopeLabel:!two }; },
    extra:extra, describe:describe, locked:function(){ return busy; },
    handleLabel:function(x){ return "Probe at x = " + num(x, 2) + ". Arrow keys move it; Shift moves it 10 steps."; },
    onMove:function(x, how){ S.xs[key()] = x; if (how !== "anim" && how !== "set") mark = null; api.save(); syncX(); paintRead(); MV.changed(); }
  });
  // second curve (g or f + g), its tangent and dot, the reveal marks
  function extra(i, sc, p, x){
    var o = CUR, ink = css("--ink"), V = sc.view;
    if (o.mode === "mul" || (o.mode === "add" && !o.build)) {
      var G = o.mode === "mul" ? o.g : o.sum, gy = fval(G, x), gd = dval(G, x), fy = o.fx(x), fd = o.dx(x);
      if (i === 0) {
        if (o.mode === "add") sc.curves.push({ f:function(t){ return fval(o.g, t); }, color:css("--ink-2"), width:2, dash:[6, 6] });
        sc.curves.push({ f:function(t){ return fval(G, t); }, color:ink, width:o.mode === "add" ? 3.4 : 3 });
        if (isFinite(gd)) sc.lines.push({ p:[x, gy], q:[x + 1, gy + gd], color:ink, width:2, dash:[8, 5] });
        if (isFinite(gy) && gy >= V.ymin && gy <= V.ymax) sc.points.push({ x:x, y:gy, r:6, color:ink, ring:true });
        var right = (x - V.xmin) / (V.xmax - V.xmin) > 0.55, lab = function(y, txt, below){ var yc = Math.max(V.ymin, Math.min(V.ymax, y)); if (yc > V.ymax - (V.ymax - V.ymin) * 0.1) below = true; if (yc < V.ymin + (V.ymax - V.ymin) * 0.1) below = false; sc.labels.push({ x:x, y:yc, text:txt, dx:right ? -14 : 14, dy:below ? 20 : -20, align:right ? "right" : "left", bg:true, font:ui(13) }); };
        var gAbove = gy >= fy;
        if (isFinite(fy)) lab(fy, (o.mode === "mul" ? "f: " : "f: ") + dpSlopeLabel(fd), gAbove);
        if (isFinite(gy)) lab(gy, (o.mode === "mul" ? "g: " : "f + g: ") + dpSlopeLabel(gd), !gAbove);
        var a0 = sc.after; sc.after = function(ctx, pl){ a0(ctx, pl); dpEdge(ctx, pl, x, gy, ink); };
      } else {
        var D2 = o.mode === "mul" ? o.g : o.g, dd = dval(D2, x);
        sc.curves.push({ f:function(t){ return dval(D2, t); }, color:ink, width:2.6, dash:[8, 6] });
        if (isFinite(dd) && dd >= sc.view.ymin && dd <= sc.view.ymax) sc.points.push({ x:x, y:dd, r:5, color:ink });
      }
    }
    if (mark) (mark.pts || []).forEach(function(q){
      if (q.i !== i) return;
      sc.points.push({ x:q.x, y:q.y, r:8.5, open:true, color:ink });
      sc.labels.push({ x:q.x, y:q.y, text:q.text, dx:q.dx || 12, dy:q.dy || -20, align:q.align || "left", color:ink, bg:true, font:ui(13) });
    });
  }
  function fNames(){ var o = CUR; return o.mode === "mul" ? ["f", "g"] : ["f", "f + g"]; }
  function describe(i, x){
    var o = CUR, sq = true;
    if (o.mode === "pow") {
      if (!i) return "Top: y = " + MV.plain(m(powFnSrc())) + ", tangent at x = " + num(x, 2) + ", measured slope " + f4(measured(o.fx, x)) + ".";
      return "Bottom: the power-rule derivative " + MV.plain(m(powPredFormula())) + " in teal, with the dot at (" + num(x, 2) + ", " + num(o.dx(x), 4) + ").";
    }
    if (o.build) {
      if (!i) return "Top: the sum " + MV.plain(m(polySrc(o.sum, sq))) + ", tangent at x = " + num(x, 2) + ".";
      return "Bottom: its derivative " + MV.plain(m(polySrc(derivTerms(o.sum)))) + " in teal.";
    }
    var G = o.mode === "mul" ? o.g : o.sum, nm = fNames();
    if (!i) return "Top: f(x) = " + MV.plain(m(polySrc(o.f, sq))) + " in blue and " + (o.mode === "mul" ? "g(x) = " + MV.plain(m(polySrc(o.g, sq))) : "f + g = " + MV.plain(m(polySrc(o.sum, sq))) + " in black, with g dashed") + ". Tangents at x = " + num(x, 2) + ": slopes " + num(o.dx(x), 3) + " (" + nm[0] + ") and " + num(dval(G, x), 3) + " (" + nm[1] + ").";
    return "Bottom: f′ in teal and g′ in black dashes; at x = " + num(x, 2) + ", f′ = " + num(o.dx(x), 3) + " and g′ = " + num(dval(o.g, x), 3) + ".";
  }
  function powFnSrc(){
    var o = CUR, k = o.k, n = o.n, alt = { "0.5":"√x", "-0.5":"{1}/{√x}", "-1":"{1}/{x}", "-2":"{1}/{x^2}", "-3":"{1}/{x^3}", "1.5":"x√x", "0":"1", "1":"x" }[String(n)];
    var s = "y = " + (k === 1 ? "" : k === -1 ? "@a{-}" : "@a{" + String(k) + "}") + "x^{@n{" + eSrc(n) + "}}";
    if (alt && k === 1) s += " = " + alt;
    else if (alt) s += " = @a{" + String(k) + "}" + (alt === "1" ? "" : alt.charAt(0) === "{" ? " · " + alt : alt);
    return s;
  }
  function powPredFormula(){ return (CUR.k === 1 ? "" : "@a{k}") + "@n{n}x^{@n{n} - 1}"; }
  function syncX(){
    var o = CUR, el = $("#rc-x", host);
    el.min = o.lo; el.max = o.hi; el.step = o.step; el.value = xv();
    $("#rc-xout", host).textContent = num(xv(), 2);
  }
  // ---- readouts ----
  function agreeTxt(ok){ return ok ? '<span class="rc-yes">✓ Agree</span> (within 0.001)' : '<span class="rc-no">✗ Not yet</span>'; }
  function paintRead(){
    var o = CUR, x = xv(), rows = [], bar = $("#rc-bar", host), sq = true;
    bar.innerHTML = "";
    if (o.mode === "pow") {
      var E = exactD(o.main, x), meas = measured(o.fx, x), sub = "(" + String(r9(x)) + ")^{" + eSrc(o.n - 1) + "}";
      rows.push(["Function", m(powFnSrc())]);
      rows.push(["Domain", o.dom === "pos" ? m("x > 0") + " (a fractional power)" : o.dom === "no0" ? m("x ≠ 0") + ": " + m("x = 0") + " isn’t in the domain" : "every real " + m("x")]);
      rows.push(["Measured tangent slope", f4(meas) + ' <span class="tiny muted">(central difference, ' + m("h = 0.0001") + ")</span>"]);
      rows.push(["Power-rule prediction", m(powPredFormula() + " = " + (o.k === 1 ? "" : "(@a{" + String(o.k) + "})") + "(@n{" + eSrc(o.n) + "})" + sub + " =") + " " + exHTML(E)]);
      rows.push(["Agree?", agreeTxt(agree(meas, exVal(E)))]);
    } else if (o.mode === "mul") {
      var Ef = exactD(o.f, x), Eg = exactD(o.g, x), mg = measured(function(t){ return fval(o.g, t); }, x);
      rows.push(["Function", m("f(x) = " + polySrc(o.f, sq)) + "; " + m("g(x) = @a{" + num(o.k) + "} · " + polySrc(o.f, sq))]);
      rows.push(["Measured tangent slope", m("f") + ": " + f4(measured(o.fx, x)) + "; " + m("g") + ": " + f4(mg)]);
      rows.push(["Power-rule prediction", m("g′(x) = @a{k} · f′(x) = (@a{" + String(o.k) + "})(" + exSrc(Ef) + ") =") + " " + exHTML(Eg)]);
      rows.push(["Agree?", agreeTxt(agree(mg, exVal(Eg)))]);
      if (Math.abs(exVal(Ef)) > 1e-12) rows.push([m("g′(x) ÷ f′(x)"), m(wrapSrc(exSrc(Eg)) + " ÷ " + wrapSrc(exSrc(Ef)) + " = @a{" + num(o.k) + "}")]);
    } else if (!o.build) {
      var Ef2 = exactD(o.f, x), Eg2 = exactD(o.g, x), Es = exAdd(Ef2, Eg2) || exactD(o.sum, x), ms = measured(function(t){ return fval(o.sum, t); }, x);
      rows.push(["Function", m("f(x) = " + polySrc(o.f, sq)) + "; " + m("g(x) = " + polySrc(o.g, sq)) + "; " + m("f + g = " + polySrc(o.sum, sq))]);
      rows.push(["Measured tangent slope of " + m("f + g"), f4(ms)]);
      rows.push(["Power-rule prediction", m("f′ + g′ = " + wrapSrc(exSrc(Ef2)) + " + " + wrapSrc(exSrc(Eg2)) + " = " + exSrc(Es) + " = (f + g)′") + (exApprox(Es) ? " ≈ " + f4(exVal(Es)) : "")]);
      rows.push(["Agree?", agreeTxt(agree(ms, exVal(Es)))]);
      bar.innerHTML = barHTML(exVal(Ef2), exVal(Eg2), x);
    } else {
      var T = o.sum;
      if (!T.length) rows.push(["Sum", '<span class="muted">Tap chips to build a sum.</span>']);
      else {
        var Eb = exactD(T, x), mb = measured(o.fx, x);
        rows.push(["Sum", m("f(x) = " + T.map(function(t, i){ return termSrc(t, !i, true); }).join(""))]);
        rows.push(["Derivative, term by term", m("f′(x) = " + termwiseSrc(T))]);
        rows.push(["Measured tangent slope", f4(mb)]);
        rows.push(["Power-rule prediction", m("f′(" + String(r9(x)) + ") =") + " " + exHTML(Eb)]);
        rows.push(["Agree?", agreeTxt(agree(mb, exVal(Eb)))]);
      }
    }
    $("#rc-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function barHTML(fd, gd, x){
    var tot = fd + gd, lo = Math.min(0, fd, tot), hi = Math.max(0, fd, tot);
    if (hi - lo < 1e-9) { lo = -1; hi = 1; }
    var pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    function P(v){ return ((v - lo) / (hi - lo) * 100).toFixed(2) + "%"; }
    function seg(a, b, cls){ var l = Math.min(a, b), r = Math.max(a, b); return '<span class="rc-seg ' + cls + '" style="left:' + P(l) + ";width:" + ((r - l) / (hi - lo) * 100).toFixed(2) + '%"></span>'; }
    var gz = Math.abs(gd) < 1e-12, fz = Math.abs(fd) < 1e-12;
    var aria = "Stacked bar at x = " + num(x, 2) + ": f′(x) = " + num(fd, 3) + ", then g′(x) = " + num(gd, 3) + (gz ? " (no segment)" : "") + ", adding to (f + g)′(x) = " + num(tot, 3) + ".";
    return '<div class="rc-bar" role="img" aria-label="' + MV.esc(aria) + '"><p class="tiny rc-bar-h">Slopes at the probe add up</p>' +
      '<div class="rc-bar-tr"><span class="rc-zero" style="left:' + P(0) + '"></span>' +
      '<div class="rc-lane">' + (fz ? "" : seg(0, fd, "rc-sf")) + "</div>" +
      '<div class="rc-lane">' + (gz ? "" : seg(fd, tot, "rc-sg")) + "</div>" +
      '<span class="rc-tot" style="left:' + P(tot) + '"></span></div>' +
      '<p class="rc-bar-k"><span><i class="rc-sw rc-sf"></i>' + m("f′(x)") + " = " + num(fd, 3) + "</span><span><i class=\"rc-sw rc-sg\"></i>" + m("g′(x)") + " = " + num(gd, 3) + (gz ? " (no segment)" : "") + "</span><span><i class=\"rc-sw rc-st\"></i>" + m("(f + g)′(x)") + " = " + num(tot, 3) + "</span></p></div>";
  }
  // ---- controls ----
  function chipRow(attr, list, isOn, label){
    return '<div class="chips rc-chips" role="group" aria-label="' + MV.esc(label) + '">' + list.map(function(c){ var on = isOn(c.id); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-' + attr + '="' + c.id + '" data-k="' + attr + c.id + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
  }
  function paintMode(){
    MV.keepFocus($("#rc-mode", host), function(){ $("#rc-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("rcm", C.modes, S.mode, "Mode"); });
    $$("#rc-mode button", host).forEach(function(b){ b.disabled = busy; });
    $("#rc-how", host).innerHTML = S.mode === "add" ? C.modeHow[S.add.sub === "build" ? "build" : "add"] : C.modeHow[S.mode];
  }
  function paintCtl(){
    var el = $("#rc-ctl", host), h = "";
    if (S.mode === "mul") h = '<p class="tiny rc-lab">' + m("f(x)") + " =</p>" + chipRow("base", C.bases, function(id){ return S.mul.base === id; }, "Choose f") + '<div class="rc-sl"></div>';
    else if (S.mode === "add") {
      h = '<div class="seg-wrap">' + segBtns("sub", C.subs, S.add.sub, "Add mode") + "</div>";
      if (S.add.sub === "pair") h += '<p class="tiny rc-lab">' + m("f(x)") + " =</p>" + chipRow("af", C.addChips, function(id){ return S.add.f === id; }, "Choose f") +
        '<p class="tiny rc-lab">' + m("g(x)") + " =</p>" + chipRow("ag", C.addChips, function(id){ return S.add.g === id; }, "Choose g");
      else h += chipRow("bc", C.buildChips, function(id){ return S.add.set.indexOf(id) >= 0; }, "Chips in the sum (each once)") +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="bclear" data-k="rcbclear"' + (busy || !S.add.set.length ? " disabled" : "") + ">Clear the sum</button></div>";
    } else h = '<div class="rc-sl"></div>';
    MV.keepFocus(el, function(){ el.innerHTML = h; });
    $$("#rc-ctl .seg button", host).forEach(function(b){ b.disabled = busy; });
    var slh = $(".rc-sl", el); SL = {};
    if (!slh) return;
    if (S.mode === "mul") SL.k = MV.sliders(slh, [{ id:"rck", label:"Stretch factor " + m("@a{k}"), param:"a", min:-3, max:3, step:0.5, value:S.mul.k }], function(id, v){ if (busy) return; S.mul.k = v; changed(); });
    else SL.p = MV.sliders(slh, [
      { id:"rcpn", label:"Exponent " + m("@n{n}"), param:"n", min:-3, max:4, step:0.5, value:S.pow.n, fmt:nTxt },
      { id:"rcpk", label:"Stretch factor " + m("@a{k}"), param:"a", min:-3, max:3, step:0.5, value:S.pow.k }
    ], function(id, v){ if (busy) return; if (id === "rcpn") S.pow.n = v; else S.pow.k = v; changed(); });
    $$("input", slh).forEach(function(i){ i.disabled = busy; });
  }
  function paintTop(){
    var o = CUR, cap;
    if (o.mode === "mul") cap = m("g(x) = @a{" + num(o.k) + "} · f(x)") + ", with " + m("f(x) = " + polySrc(o.f, true));
    else if (o.mode === "pow") cap = m(powFnSrc());
    else if (o.build) cap = o.sum.length ? m("f(x) = " + o.sum.map(function(t, i){ return termSrc(t, !i, true); }).join("")) : "Build a sum from the chips.";
    else cap = m("f(x) = " + polySrc(o.f, true)) + ", " + m("g(x) = " + polySrc(o.g, true));
    $("#rc-eq", host).innerHTML = cap;
    $("#rc-key", host).innerHTML = o.mode === "mul" ? "Top: " + m("f") + " (blue) and " + m("g") + " (black), with their tangents at the probe. Bottom: " + m("f′") + " (teal) and " + m("g′") + " (black dashes)."
      : o.mode === "add" && !o.build ? "Top: " + m("f") + " (blue), " + m("g") + " (grey dashes) and " + m("f + g") + " (black). Bottom: " + m("f′") + " (teal) and " + m("g′") + " (black dashes)."
      : "Top: the function with its tangent at the probe. Bottom: the power-rule derivative (teal); the dot sits at the probe.";
  }
  function paintAll(){ paintMode(); paintCtl(); paintTop(); syncX(); paintRead(); dp.render(); }
  function changed(){ refresh(); dp.set(xv(), "set"); paintTop(); syncX(); paintRead(); api.save(); MV.changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b) || b.classList.contains("drag-h")) return;
    if (b.dataset.rcm) { S.mode = b.dataset.rcm; mark = null; refresh(); dp.set(xv(), "set"); paintAll(); api.save(); MV.changed(); return; }
    if (b.dataset.sub) { S.add.sub = b.dataset.sub; mark = null; refresh(); dp.set(xv(), "set"); paintAll(); api.save(); MV.changed(); return; }
    if (b.dataset.base) S.mul.base = b.dataset.base;
    else if (b.dataset.af) S.add.f = b.dataset.af;
    else if (b.dataset.ag) S.add.g = b.dataset.ag;
    else if (b.dataset.bc) { var i = S.add.set.indexOf(b.dataset.bc); if (i >= 0) S.add.set.splice(i, 1); else S.add.set.push(b.dataset.bc); }
    else if (b.dataset.act === "bclear") S.add.set = [];
    else return;
    mark = null; paintCtl(); changed();
  });
  var xsl = $("#rc-x", host);
  xsl.addEventListener("input", function(){ if (busy) { syncX(); return; } dp.set(+xsl.value, "slider"); });
  xsl.addEventListener("keydown", function(e){
    if (busy) { e.preventDefault(); return; }
    if (e.shiftKey && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) { e.preventDefault(); dp.set(xv() + (/Left|Down/.test(e.key) ? -10 : 10) * CUR.step, "slider"); }
  });
  paintAll();

  // ---- predictions ----
  var stopAnim = null;
  function setBusy(b){ busy = b; paintMode(); paintCtl(); $("#rc-x", host).disabled = b; }
  function sweep(a, z, dur, cb){
    stopAnim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ dp.set(a + (z - a) * t, "anim"); }, done:function(){ stopAnim = null; if (cb) cb(); } });
  }
  function setup(p){
    mark = null;
    if (p.id === "p1") { S.mode = "mul"; S.mul.base = "x2"; S.mul.k = 1; S.xs.mul = 2; }
    else if (p.id === "p2") { S.mode = "add"; S.add.sub = "pair"; S.add.f = "x2"; S.add.g = "c4"; S.xs.add = -2; }
    else if (p.id === "p3") { S.mode = "pow"; S.pow.k = 1; S.pow.n = -1; S.xs.pow = 0.5; }
    else { S.mode = "pow"; S.pow.k = 1; S.pow.n = 0.5; S.xs.pow = 1; }
    refresh(); dp.set(xv(), "set");
  }
  function chal(id){
    var M = MS[id], o = CUR;
    if (id === "tc1") {
      if (o.mode !== "pow") return { ok:false, msg:M.mode };
      if (o.k !== 1) return { ok:false, msg:M.k };
      if (o.n === 3) return { ok:true };
      if (o.n === 2) return { ok:false, msg:M.n2 };
      if (o.n === 4) return { ok:false, msg:M.n4 };
      if (o.n === 3.5) return { ok:false, msg:M.n35 };
      return { ok:false, msg:tpl(M.other, { s:exHTML(exactD([{ c:1, p:o.n }], 4)) }) };
    }
    if (id === "tc2") {
      if (o.mode !== "add" || !o.build) return { ok:false, msg:M.mode };
      var set = S.add.set;
      if (!set.length) return { ok:false, msg:M.empty };
      if (set.indexOf("sqrt") >= 0) return { ok:false, msg:M.sqrt };
      var s1 = exVal(exactD(o.sum, 1)), s2 = exVal(exactD(o.sum, 2));
      if (near(s1, 0) && near(s2, 9)) return { ok:true };
      function only(a){ return set.length === a.length && a.every(function(k){ return set.indexOf(k) >= 0; }); }
      if (only(["x2", "m2x"])) return { ok:false, msg:M.x2m2x };
      if (only(["x3", "m2x"])) return { ok:false, msg:M.x3m2x };
      return { ok:false, msg:tpl(M.other, { a:num(s1), b:num(s2) }) };
    }
    if (id === "tc3") {
      if (o.mode !== "pow") return { ok:false, msg:M.mode };
      var k = o.k, n = o.n;
      if (k === 2 && n === 1.5) return { ok:true };
      if (k === 1 && n === 2) return { ok:false, msg:M.k1n2 };
      if (k === 4 && n === 1) return { ok:false, msg:M.k4n1 };
      if (k === 2) return { ok:false, msg:M.k2 };
      var two = { n:2, d:1 }, y4 = Q.mul(qv(k), qpow(two, Math.round(2 * n))), s4 = Q.mul(Q.mul(qv(k), qv(n)), qpow(two, Math.round(2 * n - 2)));
      if (y4.n === 16 && y4.d === 1) return { ok:false, msg:tpl(M.through, { s:m(ratSrc(s4)) }) };
      return { ok:false, msg:tpl(M.miss, { y:m(ratSrc(y4)) }) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){ if (stopAnim) { stopAnim(); stopAnim = null; } setBusy(true); setup(p); paintAll(); },
      run:function(p, done){
        function fin(){ setBusy(false); api.save(); paintAll(); MV.changed(); done(); }
        function show(pts, cb){ mark = { pts:pts }; dp.render(); MV.wait(1000, cb); }
        if (p.id === "p1") {
          stopAnim = MV.tween({ dur:1800, ease:function(t){ return t; }, step:function(t){ S.mul.k = Math.round((1 + 2 * t) * 100) / 100; if (SL.k) SL.k.set("rck", S.mul.k); refresh(); dp.render(); paintTop(); paintRead(); },
            done:function(){ stopAnim = null; S.mul.k = 3; if (SL.k) SL.k.set("rck", 3); refresh(); paintTop(); paintRead(); show([{ i:0, x:2, y:4, text:"slope 4", dx:14, dy:22 }, { i:0, x:2, y:12, text:"slope 12", dx:-14, align:"right" }], fin); } });
        } else if (p.id === "p2") sweep(-2, 2, 2600, function(){ show([{ i:0, x:2, y:8, text:"parallel tangents", dx:-14, align:"right" }, { i:1, x:2, y:0, text:"g′ = 0 everywhere", dx:-14, dy:18, align:"right" }], fin); });
        else if (p.id === "p3") sweep(0.5, 2, 1800, function(){ show([{ i:1, x:2, y:-0.25, text:"measured −0.2500", dx:-14, dy:20, align:"right" }], fin); });
        else sweep(1, 4, 2000, function(){ show([{ i:1, x:4, y:0.25, text:"measured 0.2500", dx:-14, dy:-20, align:"right" }], fin); });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Given a slope, find the point ----------
var DIAL = { f:function(x){ return x * x * x - 6 * x * x + 9 * x + 1; }, d:function(x){ return 3 * x * x - 12 * x + 9; } };
function dialSolve(mm){
  var D = 36 + 12 * mm;
  if (D < -1e-12) return [];
  if (Math.abs(D) < 1e-12) return [2];
  var r = Math.sqrt(D); return [(12 - r) / 6, (12 + r) / 6];
}
function sqDisc(D){ var r = Math.round(Math.sqrt(D)); return r * r === D ? r : null; }
function ptTxt(x, y){ var ex = near(x, Math.round(x), 1e-9) && near(y, Math.round(y), 1e-9); return (ex ? "" : "≈ ") + "(" + num(x, 2) + ", " + num(y, 2) + ")"; }
function part3(host, api){
  var S = api.S, C = api.content, ST = C.stations, M1 = ST[0].msgs;
  S.m = S.m == null ? 9 : S.m; S.e1 = S.e1 || { v:{}, none:false }; S.a = S.a == null ? 3 : S.a;
  var fb1 = null;
  host.innerHTML =
    '<div class="part p3-st" id="gs1"><h3>' + ST[0].title + "</h3><p>" + ST[0].text + '</p><div class="gs-grid"><div class="gs-pan"><div class="dp-panels">' +
      '<div class="plot-wrap dp-panel"><canvas class="plot dp-top" id="gs-top" role="img" aria-label="The dial curve"></canvas></div>' +
      '<div class="plot-wrap dp-panel"><canvas class="plot dp-low" id="gs-low" role="img" aria-label="Its derivative with the line y = m"></canvas></div></div>' +
      '<p class="tiny muted" style="margin:6px 0 0">Top: ' + m("f") + " (blue); the points with slope " + m("m") + " light up with their tangents. Bottom: " + m("f′") + " (teal) and the line " + m("y = m") + " (dashed).</p></div>" +
      '<div class="gs-side"><div class="gs-dialbox"><svg class="gs-dial" id="gs-dial" viewBox="0 0 200 178" aria-hidden="true"></svg>' +
      '<label class="slider gs-msl"><span class="slider-top"><span>Slope ' + m("m") + '</span><output id="gs-mout"></output></span><input type="range" id="gs-m" min="-6" max="12" step="1" style="accent-color:var(--ink)" aria-label="Slope m, from −6 to 12 (Page Up and Page Down move by 3)"></label></div>' +
      '<dl class="read" id="gs-read" aria-live="polite"></dl><div id="gs-entry"></div>' +
      '<details class="alg" id="gs-alg"><summary>Check it with algebra</summary><div class="alg-lines" id="gs-algb"></div></details></div></div></div>' +
    '<div class="part p3-st" id="gs2"><h3>' + ST[1].title + "</h3><p>" + ST[1].text + '</p><div class="gs-grid"><div class="gs-pan"><div class="plot-wrap"><canvas class="plot gs-sq" id="gs-n" role="img" aria-label="y = x² − 4x with a tangent and a normal"></canvas></div></div>' +
      '<div class="gs-side"><label class="slider"><span class="slider-top"><span>Point at ' + m("x = a") + '</span><output id="gs-aout"></output></span><input type="range" id="gs-a" min="-1" max="5" step="0.5" style="accent-color:var(--ink)" aria-label="x-value of the point on the curve"></label>' +
      '<dl class="read" id="gs-nread" aria-live="polite"></dl></div></div></div>';

  // ---- Station 1: the dial ----
  var V1 = { xmin:-0.8, xmax:4.8, ymin:-2.5, ymax:8.5 }, D1 = { ymin:-6.5, ymax:13.5 };
  var pT = new MV.Plot($("#gs-top", host), V1), pL = new MV.Plot($("#gs-low", host), Object.assign({}, V1, D1));
  function pts(){ return dialSolve(S.m).map(function(x){ return { x:x, y:DIAL.f(x) }; }); }
  function tanAt(ctx, p, x, y, s){
    var ux = p.X(x + 1) - p.X(x), uy = p.Y(y + s) - p.Y(y), L = Math.hypot(ux, uy), k = 70 / L, X = p.X(x), Y = p.Y(y);
    ctx.save(); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(X - ux * k, Y - uy * k); ctx.lineTo(X + ux * k, Y + uy * k); ctx.stroke(); ctx.restore();
  }
  function draw1(){
    var P = pts(), ink = css("--ink"), mm = S.m;
    var desc = "y = x³ − 6x² + 9x + 1. " + (P.length ? "Tangent" + (P.length > 1 ? "s" : "") + " with slope " + num(mm) + " at " + P.map(function(q){ return ptTxt(q.x, q.y); }).join(" and ") + "." : "No tangent has slope " + num(mm) + ": the least slope is −3.");
    pT.draw({ view:V1, yLabel:"f(x)", curves:[{ f:DIAL.f, color:css("--pen"), width:3 }], points:P.map(function(q){ return { x:q.x, y:q.y, r:6.5, color:ink, ring:true }; }), describe:desc,
      after:function(ctx, p){ P.forEach(function(q){ tanAt(ctx, p, q.x, q.y, mm); }); } });
    var lv = Object.assign({}, V1, D1);
    pL.draw({ view:lv, yLabel:"f′(x)", curves:[{ f:DIAL.d, color:css("--f3"), width:2.6 }],
      segments:[{ x1:lv.xmin, y1:mm, x2:lv.xmax, y2:mm, color:ink, width:1.8, dash:[7, 5] }].concat(P.map(function(q){ return { x1:q.x, y1:lv.ymin, x2:q.x, y2:lv.ymax, color:css("--ink-2"), width:1, dash:[3, 5] }; })),
      points:P.map(function(q){ return { x:q.x, y:mm, r:5.5, color:ink }; }),
      labels:[{ x:lv.xmax, y:mm, text:"y = " + num(mm), dx:-6, dy:-12, align:"right", color:ink, bg:true, font:"italic 600 13px " + (css("--font-math") || "serif") }],
      describe:"f′(x) = 3x² − 12x + 9, an upward parabola with vertex (2, −3), and the line y = " + num(mm) + ": " + (P.length ? P.length + " intersection" + (P.length > 1 ? "s" : "") + " at x = " + P.map(function(q){ return num(q.x, 2); }).join(" and ") + "." : "no intersection.") });
  }
  pT.render = draw1; pL.render = draw1;
  var svg = $("#gs-dial", host), CX = 100, CY = 98, R = 70;
  function ang(mm){ return (-135 + 270 * (mm + 6) / 18) * Math.PI / 180; }
  function pol(a, r){ return [CX + r * Math.sin(a), CY - r * Math.cos(a)]; }
  function drawDial(){
    var h = "", a0 = pol(ang(-6), R), a1 = pol(ang(12), R);
    h += '<path class="gs-trk" d="M' + a0[0].toFixed(1) + " " + a0[1].toFixed(1) + " A" + R + " " + R + " 0 1 1 " + a1[0].toFixed(1) + " " + a1[1].toFixed(1) + '"/>';
    for (var t = -6; t <= 12; t++) {
      var a = ang(t), big = t % 3 === 0, p1 = pol(a, R - (big ? 11 : 6)), p2 = pol(a, R + 1);
      h += '<line class="gs-tk' + (big ? " big" : "") + '" x1="' + p1[0].toFixed(1) + '" y1="' + p1[1].toFixed(1) + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '"/>';
      if (big) { var pl = pol(a, R + 15); h += '<text class="gs-tl" x="' + pl[0].toFixed(1) + '" y="' + (pl[1] + 4).toFixed(1) + '">' + num(t) + "</text>"; }
    }
    var an = ang(S.m), tip = pol(an, R - 8);
    h += '<line class="gs-ndl" x1="' + CX + '" y1="' + CY + '" x2="' + tip[0].toFixed(1) + '" y2="' + tip[1].toFixed(1) + '"/><circle class="gs-hub" cx="' + CX + '" cy="' + CY + '" r="9"/>';
    h += '<text class="gs-val" x="' + CX + '" y="' + (CY + 40) + '">m = ' + num(S.m) + "</text>";
    svg.innerHTML = h;
  }
  function paintRead1(){
    var P = pts();
    $("#gs-m", host).value = S.m; $("#gs-mout", host).textContent = num(S.m);
    $("#gs-read", host).innerHTML = MV.readoutHTML([["Slope " + m("m"), num(S.m)], ["Points with this slope", P.length ? String(P.length) : "none"]]);
    var c = 9 - S.m, D = 36 + 12 * S.m, L = [];
    L.push(m("3x^2 - 12x + 9 = " + num(S.m).replace(MINUS, "-")));
    L.push(m("3x^2 - 12x" + (c ? (c > 0 ? " + " : " - ") + Math.abs(c) : "") + " = 0"));
    L.push("Discriminant " + m("144 - 12(" + (c < 0 ? "-" : "") + Math.abs(c) + ") = " + D) + " <small>(" + m("b^2 - 4ac") + " with " + m("a = 3") + ", " + m("b = -12") + ")</small>");
    if (D < 0) L.push("Negative: no real solutions. <small>" + M1.none + "</small>");
    else if (D === 0) L.push(m("x = {12}/{6} = 2") + ": one point, " + m("(2, 3)") + ".");
    else {
      var r = sqDisc(D), xs = dialSolve(S.m);
      L.push(m("x = {12 ± √" + D + "}/{6}") + (r != null ? " " + m("= " + num(xs[0]) + " or " + num(xs[1])) : ", so " + m("x ≈ " + num(xs[0], 2) + " or " + num(xs[1], 2))));
      L.push("Points: " + xs.map(function(x){ return ptTxt(x, DIAL.f(x)); }).join(" and ") + ".");
    }
    $("#gs-algb", host).innerHTML = L.map(function(l){ return "<div>" + l + "</div>"; }).join("");
  }
  function paintEntry(){
    var e = S.e1, el = $("#gs-entry", host);
    function box(k, lab){ return '<input class="numin gs-in" data-e1="' + k + '" data-k="gs' + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + lab + '" value="' + MV.esc(e.v[k] || "") + '"' + (e.none ? " disabled" : "") + ">"; }
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="tiny gs-eh">Your points with slope ' + m("m = " + num(S.m).replace(MINUS, "-")) + '</p><div class="gs-pts">' +
        '<span class="gs-pt">(' + box("x1", "Point 1, x") + "," + box("y1", "Point 1, y") + ')</span><span class="gs-and">and</span><span class="gs-pt">(' + box("x2", "Point 2, x") + "," + box("y2", "Point 2, y") + ")</span></div>" +
        '<div class="q-actions"><button type="button" class="chip" data-act="none" data-k="gsnone" aria-pressed="' + !!e.none + '">No point has this slope</button><button type="button" class="btn primary sm" data-act="check1" data-k="gschk">Check</button></div>' +
        (fb1 ? MV.fbHTML(fb1.kind, fb1.html) : "");
    });
  }
  function judge1(){
    var e = S.e1, P = pts(), got = [], i;
    if (e.none) return P.length ? { kind:"bad", html:"<strong>✗ Not quite.</strong> " + tpl(M1.extra, { n:P.length, s:P.length > 1 ? "s" : "", have:P.length > 1 ? "have" : "has" }).replace("Only ", "") + " " + M1.other }
      : { kind:"good", html:"<strong>✓ Correct.</strong> " + M1.none };
    for (i = 1; i <= 2; i++) {
      var sx = String(e.v["x" + i] || "").trim(), sy = String(e.v["y" + i] || "").trim();
      if (!sx && !sy) continue;
      if (!sx || !sy) return { kind:"", html:M1.partial };
      var px = MV.parseNum(sx), py = MV.parseNum(sy);
      if (!px || !py || px.length !== 1 || py.length !== 1) return { kind:"", html:"Type a number in each box, such as 4, −2 or 1/2." };
      got.push({ x:px[0], y:py[0] });
    }
    if (!got.length) return { kind:"", html:M1.empty };
    function hit(g, q){ return near(g.x, q.x, 0.01) && near(g.y, q.y, 0.05); }
    var matched = got.filter(function(g){ return P.some(function(q){ return hit(g, q); }); });
    if (!P.length) return { kind:"bad", html:"<strong>✗ Not quite.</strong> " + M1.none };
    if (matched.length === got.length && got.length === P.length && !(got.length === 2 && hit(got[0], got[1]) && P.length === 2)) {
      var special = M1[String(S.m)];
      return { kind:"good", html:"<strong>✓ Correct.</strong> " + (special || M1.good) };
    }
    if (got.some(function(g){ return near(g.y, S.m, 1e-9) && P.some(function(q){ return near(g.x, q.x, 0.01); }) && !near(S.m, DIAL.f(g.x), 0.05); })) return { kind:"bad", html:"<strong>✗ Not quite.</strong> " + M1.swap };
    if (matched.length === got.length && got.length < P.length) return { kind:"bad", html:"<strong>✗ Not quite.</strong> " + M1.missing };
    if (got.length > P.length && matched.length >= P.length) return { kind:"bad", html:"<strong>✗ Not quite.</strong> " + tpl(M1.extra, { n:P.length, s:P.length > 1 ? "s" : "", have:P.length > 1 ? "have" : "has" }) };
    return { kind:"bad", html:"<strong>✗ Not quite.</strong> " + M1.other };
  }
  function setM(v){ v = Math.max(-6, Math.min(12, Math.round(v))); if (v === S.m) return; S.m = v; S.e1 = { v:{}, none:false }; fb1 = null; api.save(); drawDial(); draw1(); paintRead1(); paintEntry(); }
  var dragging = false;
  function fromPointer(e){ var r = svg.getBoundingClientRect(), sx = 200 / r.width, x = (e.clientX - r.left) * sx - CX, y = (e.clientY - r.top) * sx - CY, a = Math.atan2(x, -y) * 180 / Math.PI; a = Math.max(-135, Math.min(135, a)); setM((a + 135) / 270 * 18 - 6); }
  svg.addEventListener("pointerdown", function(e){ dragging = true; try { svg.setPointerCapture(e.pointerId); } catch (err) {} fromPointer(e); e.preventDefault(); });
  svg.addEventListener("pointermove", function(e){ if (dragging) fromPointer(e); });
  svg.addEventListener("pointerup", function(){ dragging = false; }); svg.addEventListener("pointercancel", function(){ dragging = false; });
  var msl = $("#gs-m", host);
  msl.addEventListener("input", function(){ setM(+msl.value); });
  msl.addEventListener("keydown", function(e){ if (e.key === "PageUp" || e.key === "PageDown") { e.preventDefault(); setM(S.m + (e.key === "PageUp" ? 3 : -3)); } });
  $("#gs-entry", host).addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.e1; if (!k) return; S.e1.v[k] = e.target.value; api.save(); });
  $("#gs-entry", host).addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.e1) { var b = $('[data-act="check1"]', host); if (b) b.click(); } });
  $("#gs-entry", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.act === "none") { S.e1.none = !S.e1.none; fb1 = null; api.save(); paintEntry(); return; }
    if (b.dataset.act === "check1") { fb1 = judge1(); paintEntry(); MV.focusFb($("#gs-entry", host)); }
  });

  // ---- Station 2: tangent and normal ----
  var NF = function(x){ return x * x - 4 * x; }, V2 = { xmin:-2.2, xmax:6.2, ymin:-5.5, ymax:6 };
  var pN = new MV.Plot($("#gs-n", host), V2, { equal:true });
  function lineSrcQ(mq, bq){
    var s = "y = ", a = Q.abs(mq);
    if (mq.n) s += (mq.n < 0 ? "-" : "") + (a.n === 1 && a.d === 1 ? "" : a.d === 1 ? a.n : "{" + a.n + "}/{" + a.d + "}") + "x";
    if (bq.n || !mq.n) { var b = Q.abs(bq), bs = b.d === 1 ? String(b.n) : "{" + b.n + "}/{" + b.d + "}"; s += mq.n ? (bq.n < 0 ? " - " : " + ") + bs : (bq.n < 0 ? "-" : "") + bs; }
    return s;
  }
  function drawN(){
    var a = S.a, y = NF(a), s = 2 * a - 4, ink = css("--ink"), lines = [{ p:[a, y], q:[a + 1, y + s], color:ink, width:2.2 }];
    if (s === 0) lines.push({ p:[a, y], q:[a, y + 1], color:ink, width:2.2, dash:[8, 6] }); else lines.push({ p:[a, y], q:[a + 1, y - 1 / s], color:ink, width:2.2, dash:[8, 6] });
    pN.draw({ view:V2, equal:true, yLabel:"y", curves:[{ f:NF, color:css("--pen"), width:3 }], lines:lines, points:[{ x:a, y:y, r:6, color:ink, ring:true }],
      describe:"y = x² − 4x with the point (" + num(a) + ", " + num(y) + "). Tangent slope " + num(s) + (s === 0 ? "; the normal is the vertical line x = 2." : "; normal slope " + num(-1 / s, 3) + ". A right-angle mark sits where they meet."),
      after:function(ctx, p){
        var X = p.X(a), Y = p.Y(y), tx = p.X(a + 1) - X, ty = p.Y(y + s) - Y, L = Math.hypot(tx, ty), k = 13;
        tx /= L; ty /= L; var nx = -ty, ny = tx; if (ny > 0) { nx = -nx; ny = -ny; }
        ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.8; ctx.beginPath();
        ctx.moveTo(X + tx * k, Y + ty * k); ctx.lineTo(X + tx * k + nx * k, Y + ty * k + ny * k); ctx.lineTo(X + nx * k, Y + ny * k); ctx.stroke(); ctx.restore();
      } });
  }
  pN.render = drawN;
  function paintN(){
    var a = S.a, aq = qv(a), yq = Q.sub(Q.mul(aq, aq), Q.mul({ n:4, d:1 }, aq)), sq = Q.sub(Q.mul({ n:2, d:1 }, aq), { n:4, d:1 }), rows;
    $("#gs-a", host).value = a; $("#gs-aout", host).textContent = num(a);
    rows = [["Point", m("(" + qInline(aq) + ", " + qInline(yq) + ")")], ["Tangent slope " + m("m"), m("2a - 4 = " + qInline(sq))]];
    if (!sq.n) rows.push(["Normal slope " + m("-1/m"), "undefined; the normal is " + m("x = " + qInline(aq))], ["Tangent", m("y = " + qInline(yq))], ["Normal", m("x = " + qInline(aq))]);
    else {
      var nq = Q.div({ n:-1, d:1 }, sq);
      rows.push(["Normal slope " + m("-1/m"), m(qInline(nq))]);
      rows.push(["Tangent", m(lineSrcQ(sq, Q.sub(yq, Q.mul(sq, aq))))]);
      rows.push(["Normal", m(lineSrcQ(nq, Q.sub(yq, Q.mul(nq, aq))))]);
    }
    $("#gs-nread", host).innerHTML = MV.readoutHTML(rows);
  }
  function setA(v){ v = snapTo(v, 0.5, -1, 5); if (v === S.a) return; S.a = v; api.save(); drawN(); paintN(); }
  MV.drag(pN, { axis:"x", step:{ x:0.5, y:0.5 }, big:4,
    handles:function(){ return [{ id:"pt", x:S.a, y:NF(S.a), label:"Point at x = " + num(S.a) + " on the curve. Arrow keys move it by 0.5." }]; },
    move:function(id, nx){ setA(nx); } });
  var actN = false;
  pN.c.addEventListener("pointerdown", function(e){ if (e.defaultPrevented) return; actN = true; try { pN.c.setPointerCapture(e.pointerId); } catch (err) {} var r = pN.c.getBoundingClientRect(); setA(pN.xOf(e.clientX - r.left)); });
  pN.c.addEventListener("pointermove", function(e){ if (!actN) return; var r = pN.c.getBoundingClientRect(); setA(pN.xOf(e.clientX - r.left)); });
  pN.c.addEventListener("pointerup", function(){ actN = false; }); pN.c.addEventListener("pointercancel", function(){ actN = false; });
  var asl = $("#gs-a", host); asl.addEventListener("input", function(){ setA(+asl.value); });

  drawDial(); draw1(); paintRead1(); paintEntry(); drawN(); paintN();
  return {};
}

// ---------- Practice 1: Differentiate it (@component V8 coefficientEntry — f′(x) as rows "□x^□" plus a constant box;
// fractions accepted; the answer is compared as a polynomial, so term order and like terms don't matter) ----------
function qKey(q){ return q.n + "/" + q.d; }
function qParse(raw){ var p = MV.parseNum(raw); if (!p || p.length !== 1 || !isFinite(p[0])) return null; return Q.of(p[0]); }
function polyMap(list){ var mp = {}; list.forEach(function(t){ var k = qKey(t.e); mp[k] = mp[k] ? Q.add(mp[k], t.c) : t.c; }); Object.keys(mp).forEach(function(k){ if (!mp[k].n) delete mp[k]; }); return mp; }
function ansMap(arr){ return polyMap(arr.map(function(t){ return { c:Q.of(Q.raw(t[0])), e:Q.of(Q.raw(t[1])) }; })); }
function sameMap(a, b){ var ka = Object.keys(a), kb = Object.keys(b); return ka.length === kb.length && ka.every(function(k){ return b[k] && Q.eq(a[k], b[k]); }); }
function diffAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, G = a.general || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function box(it, k, cls, lab){ var x = ist(it.id); return '<input class="numin df-in ' + cls + '" data-f="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + lab + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function row(it){
    return '<div class="df-row" role="group" aria-label="Your derivative, term by term"><span class="df-lab">' + m("f′(x) =") + "</span>" +
      [1, 2].map(function(r){ return '<span class="df-term">' + box(it, "c" + r, "df-c", "Coefficient of term " + r) + '<span class="m df-x"><i>x</i></span><sup class="df-sup">' + box(it, "e" + r, "df-e", "Exponent of term " + r + " (empty means 1)") + "</sup></span>"; }).join('<span class="df-plus">+</span>') +
      '<span class="df-plus">+</span>' + box(it, "c0", "df-c", "Constant term") + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q df-q" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">Differentiate ' + m("f(x) =") + " " + it.fx + ".</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="df-box"></div><div class="df-ctl"></div></div>';
  }).join("");
  function paintBox(it){ var el = $('[data-q="' + it.id + '"] .df-box', host); MV.keepFocus(el, function(){ el.innerHTML = row(it); }); }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .df-ctl', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + m("f′(x) =") + " " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  a.items.forEach(function(it){ paintBox(it); paintCtl(it); });
  function judge(it){
    var x = ist(it.id), list = [];
    for (var r = 1; r <= 2; r++) {
      var sc = String(x.v["c" + r] || "").trim(), se = String(x.v["e" + r] || "").trim();
      if (!sc && !se) continue;
      if (!sc) return { err:"Fill in the coefficient in front of each " + m("x") + " you use." };
      var cq = qParse(sc), eq = se ? qParse(se) : ONE;
      if (!cq || !eq) return { err:"Type whole numbers or fractions such as 3, −6 or −1/2." };
      list.push({ c:cq, e:eq });
    }
    var s0 = String(x.v.c0 || "").trim();
    if (s0) { var c0 = qParse(s0); if (!c0) return { err:"Type whole numbers or fractions such as 3, −6 or −1/2." }; list.push({ c:c0, e:ZERO }); }
    if (!list.length) return { err:"Fill in your derivative first." };
    var mine = polyMap(list), ans = ansMap(MV.ans(it)), i;
    if (sameMap(mine, ans)) return { ok:true };
    var W = it.wrong || [];
    for (i = 0; i < W.length; i++) {
      var w = W[i];
      if (w.exact && sameMap(mine, ansMap(w.exact))) return { ok:false, msg:w.fb };
      if (w.has) { var kk = qKey(Q.of(Q.raw(w.has[1]))), cq2 = Q.of(Q.raw(w.has[0])); if (mine[kk] && Q.eq(mine[kk], cq2)) return { ok:false, msg:w.fb }; }
    }
    if (it.general) return { ok:false, msg:it.general };
    var zk = qKey(ZERO);
    if (mine[zk] && !ans[zk]) return { ok:false, msg:G.m2 };
    var km = Object.keys(mine).sort().join("|"), ka = Object.keys(ans).sort().join("|");
    if (km === ka) return { ok:false, msg:G.m1 };
    return { ok:false, msg:G.other };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.f) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.f] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.f) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintBox(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Find the points (@component V8 pointEntry — coordinate pairs, named coefficients or lines y = □x + □;
// pairs are order-free; fractions accepted; missing a root gets the M7 message) ----------
function pointsAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, GM = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function inp(it, k, lab, cls){ var x = ist(it.id); return '<input class="numin pe-in' + (cls ? " " + cls : "") + '" data-f="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + lab + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function form(it){
    if (it.form === "pts") return '<div class="pe-row" role="group" aria-label="Your points">' + [1, 2].map(function(r){ return '<span class="pe-pt">(' + inp(it, "x" + r, "Point " + r + ", x") + "," + inp(it, "y" + r, "Point " + r + ", y") + ")</span>"; }).join('<span class="pe-and">and</span>') + "</div>";
    if (it.form === "ab") return '<div class="pe-row" role="group" aria-label="Your values"><label class="pe-lab">' + m("a =") + inp(it, "a", "a") + '</label><label class="pe-lab">' + m("b =") + inp(it, "b", "b") + "</label></div>";
    if (it.form === "c") return '<div class="pe-row" role="group" aria-label="Your value"><label class="pe-lab">' + m("c =") + inp(it, "c", "c") + "</label></div>";
    return '<div class="pe-row pe-lines" role="group" aria-label="Your tangent lines">' + [1, 2].map(function(r){ return '<span class="pe-ln">' + m("y =") + inp(it, "m" + r, "Line " + r + ", slope") + '<span class="m"><i>x</i> +</span>' + inp(it, "b" + r, "Line " + r + ", intercept") + "</span>"; }).join('<span class="pe-and">and</span>') + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q pe-q" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="pe-box"></div><div class="pe-ctl"></div></div>';
  }).join("");
  function paintBox(it){ var el = $('[data-q="' + it.id + '"] .pe-box', host); MV.keepFocus(el, function(){ el.innerHTML = form(it); }); }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .pe-ctl', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  a.items.forEach(function(it){ paintBox(it); paintCtl(it); });
  function val(raw){ var p = MV.parseNum(raw); return p && p.length === 1 ? p[0] : null; }
  function close(p, q){ return Math.abs(p - q) <= 1e-6 * Math.max(1, Math.abs(q)); }
  function samePair(p, q){ return close(p[0], q[0]) && close(p[1], q[1]); }
  function sameSet(A, B){ if (A.length !== B.length) return false; var used = []; return A.every(function(p){ for (var j = 0; j < B.length; j++) if (used.indexOf(j) < 0 && samePair(p, B[j])) { used.push(j); return true; } return false; }); }
  function within(A, B){ return A.every(function(p){ return B.some(function(q){ return samePair(p, q); }); }); }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), W = it.wrong || [], i;
    if (it.form === "pts" || it.form === "lines") {
      var kx = it.form === "pts" ? ["x", "y"] : ["m", "b"], got = [];
      for (i = 1; i <= 2; i++) {
        var s1 = String(x.v[kx[0] + i] || "").trim(), s2 = String(x.v[kx[1] + i] || "").trim();
        if (!s1 && !s2) continue;
        if (!s1 || !s2) return { err:it.form === "pts" ? GM.partial : GM.partialLine };
        var v1 = val(s1), v2 = val(s2); if (v1 == null || v2 == null) return { err:GM.number };
        got.push([v1, v2]);
      }
      if (!got.length) return { err:GM.empty };
      if (sameSet(got, ans)) return { ok:true };
      for (i = 0; i < W.length; i++) if (W[i].pts && sameSet(got, W[i].pts)) return { ok:false, msg:W[i].fb };
      if (got.length < ans.length && within(got, ans)) return { ok:false, msg:it.form === "pts" ? GM.missing : GM.missingLine };
      if (it.form === "pts" && got.length === ans.length && got.every(function(p){ return ans.some(function(q){ return close(p[0], q[0]); }); })) return { ok:false, msg:GM.xok };
      return { ok:false, msg:it.general };
    }
    var keys = Object.keys(ans), vals = {};
    for (i = 0; i < keys.length; i++) {
      var raw = String(x.v[keys[i]] || "").trim();
      if (!raw) return { err:keys.length > 1 ? GM.both : GM.empty };
      var v = val(raw); if (v == null) return { err:GM.number };
      vals[keys[i]] = v;
    }
    if (keys.every(function(k){ return close(vals[k], ans[k]); })) return { ok:true };
    return { ok:false, msg:it.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.f) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.f] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.f) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintBox(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Peak at x = 1 ----------
var task = (function(){
  var api, plot;
  function read(){ var s = api ? api.S : {}; function g(k){ var v = s[k]; return v == null ? 0 : v; } return { b:g("b"), c:g("c"), d:g("d") }; }
  function f(D, x){ return x * x * x + D.b * x * x + D.c * x + D.d; }
  function fd(D, x){ return 3 * x * x + 2 * D.b * x + D.c; }
  function polyS(D){ return polySrc([{ c:1, p:3 }, { c:D.b, p:2 }, { c:D.c, p:1 }, { c:D.d, p:0 }]); }
  function dS(D){ return polySrc([{ c:3, p:2 }, { c:2 * D.b, p:1 }, { c:D.c, p:0 }]); }
  function draw(){
    var D = read(), V = { xmin:-1.6, xmax:4.4 }, fit = fitY([function(x){ return f(D, x); }], -1.2, 4, false), ink = css("--ink");
    fit.ymin = Math.max(fit.ymin, -45); fit.ymax = Math.min(fit.ymax, 45);
    if (fit.ymax < 2) fit.ymax = 2; if (fit.ymin > -2) fit.ymin = -2;
    var view = Object.assign({}, V, fit), y0 = f(D, 0), y1 = f(D, 1);
    plot.draw({ view:view, yLabel:"f(x)", curves:[{ f:function(x){ return f(D, x); }, color:css("--pen"), width:3 }],
      lines:[{ p:[0, y0], q:[1, y0 + D.c], color:ink, width:2 }, { p:[1, y1], q:[2, y1 + fd(D, 1)], color:ink, width:2, dash:[8, 5] }],
      points:[{ x:0, y:y0, r:5, color:ink }, { x:1, y:y1, r:5, color:ink }, { x:1, y:0, r:6, open:true, color:css("--ink-2") }],
      labels:[{ x:1, y:0, text:"(1, 0)", dx:10, dy:16, color:css("--ink-2"), bg:true, font:ui(12) }],
      describe:"f(x) = " + MV.plain(m(polyS(D))) + ". Tangent at x = 0: y = " + num(D.c) + "x + " + num(D.d) + " (solid), passing through (1, " + num(D.c + D.d) + "). Tangent at x = 1 (dashed) has slope " + num(fd(D, 1)) + ". The open circle marks (1, 0)." });
    var el = $("#pk-read"); if (!el) return;
    var s1 = fd(D, 1), rows = [[m("f′(x)"), m(dS(D))], [m("f′(1)"), m("3 + 2b + c = 3 + 2(" + D.b + ")" + (D.c < 0 ? " - " + (-D.c) : " + " + D.c) + " = " + s1)]];
    if (s1 === 0) rows.push(["Other zero of " + m("f′"), m("x = c/3 = " + qInline(Q.of(D.c, 3))) + (D.c / 3 > 1 ? " (right of 1)" : D.c / 3 < 1 ? " (left of 1)" : " (at 1 too: a double zero)")]);
    rows.push(["Tangent at " + m("x = 0"), m(lineS(D.c, D.d)) + "; at " + m("x = 1") + " it reaches " + num(D.c + D.d)]);
    el.innerHTML = MV.readoutHTML(rows);
  }
  function lineS(c, d){ var s = "y = "; if (c) s += (c < 0 ? "-" : "") + (Math.abs(c) === 1 ? "" : Math.abs(c)) + "x"; if (d || !c) s += c ? (d < 0 ? " - " : " + ") + Math.abs(d) : String(d); return s; }
  function paintIn(inp){
    var D = read();
    MV.keepFocus(inp, function(){
      inp.innerHTML = ["b", "c", "d"].map(function(k){
        var v = D[k];
        return '<div class="tk-step"><span class="tk-lab">' + m(k) + '</span><button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="pk' + k + 'm" aria-label="Decrease ' + k + '"' + (v <= -9 ? " disabled" : "") + ">" + MINUS + '</button><output class="tk-val" aria-live="polite">' + num(v) + '</output><button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="pk' + k + 'p" aria-label="Increase ' + k + '"' + (v >= 9 ? " disabled" : "") + ">+</button></div>";
      }).join("") + '<p class="eq-cap tk-eq">' + m("f(x) = " + polyS(D)) + "</p>";
    });
  }
  return {
    render:function(inp, pv, a){
      api = a;
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="pk-plot" role="img" aria-label="Your cubic with its tangents at x = 0 and x = 1"></canvas></div><dl class="read pk-read" id="pk-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#pk-plot"), { xmin:-1.6, xmax:4.4, ymin:-10, ymax:10 });
      plot.render = draw;
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled || !b.dataset.st) return;
        var D = read(), k = b.dataset.st; a.S[k] = Math.max(-9, Math.min(9, D[k] + +b.dataset.dir));
        ["b", "c", "d"].forEach(function(z){ if (a.S[z] == null) a.S[z] = D[z]; });
        a.save(); paintIn(inp); draw(); a.update();
      });
      paintIn(inp); draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(D){ var l1 = 3 + 2 * D.b + D.c === 0; return [l1, l1 && D.c / 3 > 1, D.c + D.d === 0]; },
    key:function(D){ return D.b + "|" + D.c + "|" + D.d; },
    label:function(k){ var s = k.split("|"); return m("(b, c, d) = (" + s.join(", ") + ")"); },
    text:function(k){ return "(b, c, d) = (" + k.split("|").map(function(v){ return num(+v); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){
    var r = explore(host, api);
    $$(".rc-lim").forEach(function(el){ el.outerHTML = MV.mcv.lim(el.dataset.sub); });
    return r;
  },
  part3:part3,
  activities:{ diff:diffAct, points:pointsAct },
  task:task
});
})();
