// MCV4U 02 Slope of a Tangent to a Curve: hero storyboard, secant squeeze (Explore, V4 secant–tangent tool), tangent-line
// stations (Part 3), "Simplify, then let h shrink" boxes (Practice 2) and the "Tangent through a target" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var Qx = MV.mcv.Q;
function m(s){ return MV.m(s); }
function md(h){ return MV.md(h); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function nsrc(v){ return String(r9(v)); }                       // number as m() source (a hyphen becomes a true minus)
function ntx(v){ return num(v, 4); }                              // number as text (true minus)
function par(s){ return String(s).charAt(0) === MINUS ? "(" + s + ")" : s; }
function close(a, b){ return Math.abs(a - b) < 1e-9; }
// polynomial in v from coefficients c[k] of v^k: [12, 6, 1] -> "12 + 6h + h^2"; desc:true writes the highest power first
function polySrc(c, v, desc){
  v = v || "h"; var out = "", ks = [];
  for (var k = 0; k < c.length; k++) ks.push(k);
  if (desc) ks.reverse();
  ks.forEach(function(k){
    var x = r9(c[k]); if (!x) return;
    var ax = Math.abs(x), body = k === 0 ? nsrc(ax) : (ax === 1 ? "" : nsrc(ax)) + v + (k > 1 ? "^" + k : "");
    out += out ? (x < 0 ? " - " : " + ") + body : (x < 0 ? "-" : "") + body;
  });
  return out || "0";
}
function lineSrc(M, B){ return "y = " + polySrc([B, M], "x", true); }

// @component exactDec (adapted from MHF4U 09) — exact rationals (BigInt) for values and secant slopes, printed as exact
// decimals (4.001, not 4.000999…); of(v) reads any decimal up to 12 places exactly; decS() adds "≈ " when it had to round.
var XQ = (function(){
  var B = window.BigInt, Z = B(0), ONE = B(1), TWO = B(2), FIVE = B(5), TEN = B(10);
  function abs(a){ return a < Z ? -a : a; }
  function gcd(a, b){ a = abs(a); b = abs(b); while (b !== Z) { var t = a % b; a = b; b = t; } return a; }
  function mk(n, d){ if (d < Z) { n = -n; d = -d; } var g = gcd(n, d); if (g > ONE) { n = n / g; d = d / g; } return { n:n, d:d }; }
  function of(v){
    if (v && typeof v === "object") return v;
    var s = Number(v).toFixed(12), neg = s.charAt(0) === "-"; if (neg) s = s.slice(1);
    var p = s.split("."), n = B(p[0] + p[1]), d = B("1" + p[1].replace(/\d/g, "0"));
    return mk(neg ? -n : n, d);
  }
  function add(a, b){ a = of(a); b = of(b); return mk(a.n * b.d + b.n * a.d, a.d * b.d); }
  function sub(a, b){ a = of(a); b = of(b); return mk(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mul(a, b){ a = of(a); b = of(b); return mk(a.n * b.n, a.d * b.d); }
  function div(a, b){ a = of(a); b = of(b); return b.n === Z ? null : mk(a.n * b.d, a.d * b.n); }
  function qabs(a){ a = of(a); return { n:abs(a.n), d:a.d }; }
  function toNum(a){ a = of(a); return Number(a.n) / Number(a.d); }
  function pow10(k){ var p = ONE; while (k-- > 0) p = p * TEN; return p; }
  function dec(a, maxDp, rDp){
    a = of(a); maxDp = maxDp == null ? 9 : maxDp; rDp = rDp == null ? 4 : rDp;
    var d = a.d, i = 0, j = 0;
    while (d % TWO === Z) { d = d / TWO; i++; }
    while (d % FIVE === Z) { d = d / FIVE; j++; }
    var k = Math.max(i, j), exact = d === ONE && k <= maxDp;
    if (!exact) k = rDp;
    var neg = a.n < Z, n = abs(a.n), s = pow10(k), q = exact ? n * s / a.d : (n * s * TWO + a.d) / (TWO * a.d), str = q.toString();
    if (k > 0) { while (str.length <= k) str = "0" + str; str = (str.slice(0, str.length - k) + "." + str.slice(str.length - k)).replace(/0+$/, "").replace(/\.$/, ""); }
    var parts = str.split(".");
    if (parts[0].length > 4) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    str = parts.join(".");
    return { s:(neg && /[1-9]/.test(str) ? MINUS : "") + str, exact:exact };
  }
  function decS(a, maxDp, rDp){ var r = dec(a, maxDp, rDp); return (r.exact ? "" : "≈ ") + r.s; }
  function frac(a){ a = of(a); var neg = a.n < Z; return (neg ? MINUS : "") + abs(a.n).toString() + (a.d === ONE ? "" : "/" + a.d.toString()); }
  function src(a){ a = of(a); var neg = a.n < Z; return a.d === ONE ? (neg ? "-" : "") + abs(a.n).toString() : (neg ? "-" : "") + "{" + abs(a.n).toString() + "}/{" + a.d.toString() + "}"; }
  return { of:of, add:add, sub:sub, mul:mul, div:div, abs:qabs, toNum:toNum, dec:dec, decS:decS, frac:frac, src:src };
})();
function slopeTxt(q){ var d = XQ.dec(q, 4, 4); return d.exact ? d.s : XQ.frac(q) + " ≈ " + d.s; }

// ---------- the five Explore functions: values (float and exact), the simplified quotient and its algebra ----------
function aph(a){ return polySrc([a, 1]); }                       // "2 + h", "-1 + h", "h"
function step(src, note){ return { html:m(src), note:note || "" }; }
function polySteps(a, c, head){
  var A = aph(a), fa = "f(" + nsrc(a) + ")", top = "f(" + A + ") - " + fa;
  return [
    step("f(" + A + ") = " + (head ? head + " = " : "") + polySrc(c), "expand"),
    step(top + " = " + polySrc([0].concat(c.slice(1))), md("subtract `" + fa + " = " + nsrc(c[0]) + "`")),
    step("{" + top + "}/{h} = " + polySrc(c.slice(1)), md("divide every term by `h` (`h ≠ 0`)")),
    step(polySrc(c.slice(1)) + " → " + nsrc(c[1]), md("let `h → 0`: the tangent slope"))
  ];
}
function polyFn(o){
  return {
    chip:o.chip, eq:o.eq, f:o.f, view:o.view, a0:o.a0,
    fq:function(x){ return o.fq(XQ.of(x)); },
    quo:function(a){ return m(polySrc(o.c(a).slice(1))); },
    slope:function(a){ return XQ.of(r9(o.c(a)[1])); },
    steps:function(a){ return polySteps(a, o.c(a), a === 0 ? null : o.head(aph(a))); }
  };
}
var FN = {
  sq:polyFn({ chip:"`f(x) = x^2`", eq:"f(x) = x^2", a0:2, f:function(x){ return x * x; }, fq:function(X){ return XQ.mul(X, X); },
    c:function(a){ return [a * a, 2 * a, 1]; }, head:function(A){ return "(" + A + ")^2"; }, view:{ xmin:-3.8, xmax:4.2, ymin:-2, ymax:13 } }),
  cube:polyFn({ chip:"`f(x) = x^3`", eq:"f(x) = x^3", a0:1, f:function(x){ return x * x * x; }, fq:function(X){ return XQ.mul(X, XQ.mul(X, X)); },
    c:function(a){ return [a * a * a, 3 * a * a, 3 * a, 1]; }, head:function(A){ return "(" + A + ")^3"; }, view:{ xmin:-3.2, xmax:3.4, ymin:-14, ymax:14 } }),
  recip:{ chip:"`f(x) = {1}/{x}`", eq:"f(x) = {1}/{x}", a0:1, skip:[0], view:{ xmin:-3.6, xmax:3.6, ymin:-4.5, ymax:4.5 },
    f:function(x){ return x === 0 ? NaN : 1 / x; }, fq:function(x){ return XQ.div(1, x); },
    den:function(a){ return polySrc([a * a, a]); },
    quo:function(a){ return m("{-1}/{" + this.den(a) + "}"); },
    slope:function(a){ return XQ.div(-1, a * a); },
    steps:function(a){
      var A = aph(a), fa = "f(" + nsrc(a) + ")", top = "f(" + A + ") - " + fa, fv = XQ.src(XQ.div(1, a)), D = this.den(a);
      var minus = fv.charAt(0) === "-" ? "- (" + fv + ")" : "- " + fv;
      return [
        step("f(" + A + ") = {1}/{" + A + "}", "substitute"),
        step(top + " = {1}/{" + A + "} " + minus + " = {-h}/{" + D + "}", "combine over a common denominator"),
        step("{" + top + "}/{h} = {-1}/{" + D + "}", md("divide by `h` (`h ≠ 0`)")),
        step("{-1}/{" + D + "} → " + XQ.src(this.slope(a)), md("let `h → 0`: the tangent slope"))
      ];
    } },
  vtx:polyFn({ chip:"`f(x) = x^2 - 4x`", eq:"f(x) = x^2 - 4x", a0:1, f:function(x){ return x * x - 4 * x; }, fq:function(X){ return XQ.sub(XQ.mul(X, X), XQ.mul(4, X)); },
    c:function(a){ return [a * a - 4 * a, 2 * a - 4, 1]; }, head:function(A){ return "(" + A + ")^2 - 4(" + A + ")"; }, view:{ xmin:-3.6, xmax:6.4, ymin:-6, ymax:22 } }),
  abs:{ chip:"`f(x) = |x - 1| + 1`", eq:"f(x) = |x - 1| + 1", a0:1, view:{ xmin:-3.6, xmax:4.4, ymin:-1, ymax:6.5 },
    f:function(x){ return Math.abs(x - 1) + 1; }, fq:function(x){ return XQ.add(XQ.abs(XQ.sub(x, 1)), 1); },
    pts:function(v){ var f = this.f, p = [[v.xmin, f(v.xmin)]]; if (v.xmin < 1 && v.xmax > 1) p.push([1, 1]); p.push([v.xmax, f(v.xmax)]); return p; },
    quo:function(a){
      var b = r9(a - 1);
      if (!b) return "1 if " + m("h > 0") + "; " + MINUS + "1 if " + m("h < 0");
      return (b > 0 ? "1" : MINUS + "1") + " (while " + m("h " + (b > 0 ? ">" : "<") + " " + nsrc(-b)) + ")";
    },
    slope:function(a){ var b = r9(a - 1); return b ? XQ.of(b > 0 ? 1 : -1) : null; },
    sides:{ left:-1, right:1 },
    steps:function(a){
      var A = aph(a), b = r9(a - 1), X = polySrc([b, 1]), fa = "f(" + nsrc(a) + ")", top = "f(" + A + ") - " + fa;
      var out = [step("f(" + A + ") = |" + X + "| + 1", "substitute")];
      if (!b) {
        out.push(step(top + " = |h|", "subtract " + m("f(1) = 1")));
        out.push({ html:m("{|h|}/{h}") + " = 1 when " + m("h > 0") + ", " + MINUS + "1 when " + m("h < 0"), note:"divide by " + m("h") });
        out.push({ html:"slopes from the left (" + MINUS + "1) and right (1) disagree: no tangent", note:"let " + m("h → 0") + " from each side" });
      } else {
        out.push(step(top + " = |" + X + "| - " + nsrc(Math.abs(b)), md("subtract `" + fa + " = " + nsrc(Math.abs(b) + 1) + "`")));
        out.push({ html:m("{|" + X + "| - " + nsrc(Math.abs(b)) + "}/{h}") + " = " + (b > 0 ? "1" : MINUS + "1") + " while " + m("h " + (b > 0 ? ">" : "<") + " " + nsrc(-b)), note:"Q on the same side of the corner as P" });
        out.push(step("→ " + (b > 0 ? "1" : "-1"), md("let `h → 0`: the tangent slope")));
      }
      return out;
    } }
};
var ORDER = ["sq", "cube", "recip", "vtx", "abs"];

// @component V4 secantTangent — secant–tangent tool (MCV4U Ch 1–3). P on a curve (ink slider for a), Q at a + h; h from presets
// (±2 … ±0.001) with Halve h, ÷ 10 and Flip side (|h| never below hMin, never 0); secant --ink-2 and tangent --ink with slope
// labels; N14 two-sided table ("from the right" / "from the left", every h visited, plus an h → 0 row once known); modes
// Numbers / Algebra (step-by-step simplified quotient beside the table) / Zoom (×2, ×10, ×100 on P); Show tangent unlocks after
// |h| ≤ 0.01 on both sides or in Algebra mode; readout P, Q, secant slope, simplified quotient, tangent slope, average rate.
// Exact arithmetic through XQ (exactDec), so slopes print 4.001.
//   var t = secantTangent(host, { S, save, changed, fns:{ id:FN }, order:[ids], aMin, aMax, aStep, mags, hMin, zooms,
//     hide(fnId, a) -> true keeps the algebra and the tangent slope hidden (e.g. while a challenge is open), hideNote:html,
//     extra(scene, {fn, a, view}) adds to the scene });
//   FN = { chip, eq (m source), f(x), fq(x) -> XQ or null, view, a0, skip:[a], pts(view) (piecewise-linear curves),
//          quo(a) -> html, slope(a) -> XQ or null (no tangent), sides:{left, right} (when null), steps(a) -> [{html, note}] }
//   t.apply({fn, a, h, mode, zoom, tan, rows, stage}), t.slideTo(h, ms, cb), t.flip(), t.zoomTo(z, ms, cb), t.setMode(m),
//   t.setTan(bool), t.stage(n | null) (Algebra lines shown: 0 = first only), t.lock(bool), t.get(), t.paint()
function secantTangent(host, o){
  var S = o.S, FNS = o.fns, ORD = o.order, MAGS = o.mags || [2, 1, 0.5, 0.1, 0.01, 0.001], HMIN = o.hMin || 0.001, ZS = o.zooms || [1, 2, 10, 100];
  S.fn = FNS[S.fn] ? S.fn : ORD[0]; S.a = S.a || {}; S.h = typeof S.h === "number" && S.h !== 0 ? r9(S.h) : 1;
  S.mode = ["num", "alg", "zoom"].indexOf(S.mode) >= 0 ? S.mode : "num"; S.zoom = ZS.indexOf(S.zoom) >= 0 ? S.zoom : 1;
  S.tan = !!S.tan; S.rows = S.rows || {}; S.unl = S.unl || {};
  var A = { h:null, zoom:null }, anim = null, locked = false, stage = null;
  var L = MV.pgLayout(host, { aria:o.aria || "Secant and tangent graph" });
  L.graph.parentNode.classList.add("tg-sx");
  var box = document.createElement("div"); box.className = "tg-tblbox"; L.read.parentNode.insertBefore(box, L.read);
  box.innerHTML = '<p class="tiny muted tg-tcap"></p><div class="tg-tbl"></div><div class="tg-alg" hidden></div>';
  L.ctrl.innerHTML = '<div class="chips tg-fn" role="group" aria-label="Choose a function"></div><div class="tg-mode"></div>' +
    '<label class="slider tg-sl"><span class="slider-top"><span>' + m("P") + " at " + m("x = a") + '</span><output class="tg-aout"></output></span>' +
    '<input type="range" class="tg-a" min="' + o.aMin + '" max="' + o.aMax + '" step="' + o.aStep + '" style="accent-color:var(--ink)" aria-label="a, the x-value of P"></label>' +
    '<div class="tg-h"><p class="tg-hcur"><span>' + m("h =") + '</span> <output class="tg-hout" aria-live="polite"></output> <span class="tiny muted tg-hside"></span></p>' +
    '<div class="tg-hmag"></div><div class="q-actions tg-hb"><button type="button" class="btn ghost sm" data-hb="half" data-k="tghalf">Halve ' + m("h") + '</button>' +
    '<button type="button" class="btn ghost sm" data-hb="ten" data-k="tgten">÷ 10</button><button type="button" class="btn ghost sm" data-hb="flip" data-k="tgflip">Flip side</button></div></div>' +
    '<div class="tg-zoom"></div><div class="tg-tanrow"><button type="button" class="chip tg-tan" data-k="tgtan" aria-pressed="false">Show tangent</button><span class="tiny muted tg-tannote"></span></div>';
  var plot = new MV.Plot(L.canvas, FNS[S.fn].view);
  function q(sel){ return $(sel, host); }
  function F(){ return FNS[S.fn]; }
  function aV(){ var v = S.a[S.fn]; return v == null ? F().a0 : v; }
  function key(){ return S.fn + "|" + aV(); }
  function rows(){ return S.rows[key()] || (S.rows[key()] = []); }
  function checkUnl(){
    var r = rows();
    if (S.mode === "alg" || (r.some(function(h){ return h > 0 && h <= 0.01 + 1e-12; }) && r.some(function(h){ return h < 0 && h >= -0.01 - 1e-12; }))) S.unl[key()] = true;
  }
  function addRow(){ var r = rows(), h = r9(S.h); if (r.indexOf(h) < 0) r.push(h); checkUnl(); }
  function hidden(){ return o.hide ? !!o.hide(S.fn, aV()) : false; }
  function known(){ return !!S.unl[key()] && !hidden() && (stage == null || stage >= 3); }
  function save(){ o.save(); if (o.changed) o.changed(); }
  function stop(){ if (anim) anim(); anim = null; A.h = null; A.zoom = null; }
  function sec(h){
    var Fn = F(), a = aV(), P = Fn.fq(a), x2 = r9(a + h), Qv = Fn.fq(x2), r = { a:a, h:h, x2:x2, P:P, Q:Qv, ok:!!Qv && h !== 0 };
    if (r.ok) { r.m = XQ.div(XQ.sub(Qv, P), h); r.ms = XQ.decS(r.m, 4, 4); }
    return r;
  }
  function tanTxt(){
    var Fn = F(), s = Fn.slope(aV());
    if (s) return { r:slopeTxt(s), l:slopeTxt(s), one:slopeTxt(s) };
    var sd = Fn.sides; return { r:ntx(sd.right), l:ntx(sd.left), none:true };
  }

  // ---- views ----
  function baseView(){
    var Fn = F(), v = Fn.view, y = Fn.f(aV()), hh = v.ymax - v.ymin, pad = hh * 0.08;
    if (y > v.ymax - pad) return { xmin:v.xmin, xmax:v.xmax, ymin:y + pad - hh, ymax:y + pad };
    if (y < v.ymin + pad) return { xmin:v.xmin, xmax:v.xmax, ymin:y - pad, ymax:y - pad + hh };
    return v;
  }
  function zNow(){ return A.zoom != null ? A.zoom : S.zoom; }
  function viewNow(){
    var v0 = baseView(); if (S.mode !== "zoom") return v0;
    var k = 1 / zNow(), a = aV(), ya = F().f(a), cx = (v0.xmin + v0.xmax) / 2, cy = (v0.ymin + v0.ymax) / 2, hw = (v0.xmax - v0.xmin) / 2 * k, hh = (v0.ymax - v0.ymin) / 2 * k;
    cx = a + (cx - a) * k; cy = ya + (cy - ya) * k;
    return { xmin:cx - hw, xmax:cx + hw, ymin:cy - hh, ymax:cy + hh };
  }
  function ticks(lo, hi, n){ var s = MV.niceStep((hi - lo) / n), dp = Math.max(0, Math.ceil(-Math.log10(s) - 1e-9)); return { step:s, fmt:function(t){ return num(t, dp); } }; }

  // ---- drawing ----
  function draw(){
    var Fn = F(), a = aV(), ya = Fn.f(a), v = viewNow(), h = A.h != null ? A.h : S.h, W = L.canvas.getBoundingClientRect().width || 600, pxu = W / (v.xmax - v.xmin);
    var sc = { view:v, lines:[], segments:[], points:[], labels:[], curves:[Fn.pts ? { pts:Fn.pts(v), color:css("--pen"), width:3 } : { f:Fn.f, color:css("--pen"), width:3 }] };
    var desc = "Graph of " + MV.plain(m(Fn.eq)) + ". P(" + ntx(a) + ", " + ntx(ya) + ")";
    if (S.mode === "zoom" && zNow() > 1.01) {
      var narrow = W < 420, yt = ticks(v.ymin, v.ymax, narrow ? 5 : 7);
      sc.xTicks = ticks(v.xmin, v.xmax, narrow ? 4 : 7); sc.yTicks = { step:yt.step, fmt:function(){ return ""; } };
      sc.after = function(ctx, pl){
        ctx.save(); ctx.font = "12px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
        for (var yy = Math.ceil(v.ymin / yt.step - 1e-9) * yt.step; yy <= v.ymax + 1e-9; yy += yt.step) {
          var Y = pl.Y(yy), s = yt.fmt(yy); if (Y < 10 || Y > pl.H - 24) continue;
          var w = ctx.measureText(s).width; ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(3, Y - 8, w + 6, 16); ctx.globalAlpha = 1;
          ctx.fillStyle = css("--ink-2"); ctx.fillText(s, 6, Y);
        }
        ctx.restore();
      };
      desc += ", zoomed in ×" + Math.round(zNow());
    }
    var x2 = a + h, y2 = Fn.f(x2), qOK = isFinite(y2) && Math.abs(h) > 1e-12, left = (a - v.xmin) * pxu > 160;
    var pyu = (L.canvas.getBoundingClientRect().height || 450) / (v.ymax - v.ymin);
    // unit normal (pixels) to a line of slope s, on the side away from the curve near x = cx (curve above the line -> label below)
    function away(s, cx, cy){ var dxp = pxu, dyp = -s * pyu, len = Math.hypot(dxp, dyp) || 1, nx = dyp / len * -1, ny = dxp / len, d = Fn.f(cx) - cy; if (!isFinite(d) || Math.abs(d * pyu) < 1 || d < 0) { nx = -nx; ny = -ny; } return { x:nx, y:ny }; }
    function alignOf(n){ return n.x < -0.35 ? "right" : n.x > 0.35 ? "left" : "center"; }
    if (qOK) {
      sc.lines.push({ p:[a, ya], q:[x2, y2], color:css("--ink-2"), width:2 });
      var s = A.h == null ? sec(S.h) : null, lab = "slope " + (s ? s.ms : num((y2 - ya) / h, 3));
      var far = Math.hypot((x2 - a) * pxu, (y2 - ya) * pyu) > 26;
      var inView = x2 >= v.xmin && x2 <= v.xmax && y2 >= v.ymin && y2 <= v.ymax;
      var ms = (y2 - ya) / h, mid = inView && far, lx = mid ? (a + x2) / 2 : a, ly = mid ? (ya + y2) / 2 : ya, nS = away(ms, (a + x2) / 2, (ya + y2) / 2), gap = mid ? 16 : 24;
      sc.labels.push({ x:lx, y:ly, text:lab, dx:nS.x * gap + (mid ? 0 : nS.x * 10), dy:nS.y * gap, align:alignOf(nS), bg:true, color:css("--ink-2") });
      if (inView) sc.points.push({ x:x2, y:y2, color:css("--ink-2"), r:5, label:far ? "Q" : "", below:true });
      desc += " and Q(" + ntx(x2) + ", " + ntx(y2) + "); the secant slope is " + lab.replace("slope ", "") + ".";
    } else desc += (Math.abs(h) > 1e-12 ? ". Q would be at x = " + ntx(x2) + ", where the function is undefined." : ".");
    if (o.extra) o.extra(sc, { fn:S.fn, a:a, view:v });
    if (S.tan && known()) {
      var sl = Fn.slope(a);
      if (sl) {
        var mv = XQ.toNum(sl);
        sc.lines.push({ p:[a, ya], q:[a + 1, ya + mv], color:css("--ink"), width:2 });
        // anchor on the tangent a little to one side of P, label on the side away from the curve; keep it on the canvas
        var H = L.canvas.getBoundingClientRect().height || 450, dlt = (v.xmax - v.xmin) * 0.13 * (left ? -1 : 1), tx, ty, nT, fit = false;
        [dlt, -dlt, dlt * 0.4, -dlt * 0.4].some(function(d){
          var x = a + d, y = ya + mv * d, n = away(mv, x, y);
          [n, { x:-n.x, y:-n.y }].some(function(nn){
            var X = (x - v.xmin) * pxu + nn.x * 16, Y = (v.ymax - y) * pyu + nn.y * 16;
            if (X > 30 && X < W - 30 && Y > 14 && Y < H - 14) { tx = x; ty = y; nT = nn; fit = true; }
            return fit;
          });
          return fit;
        });
        if (!fit) { tx = a; ty = ya; nT = away(mv, a + dlt, ya + mv * dlt); }
        sc.labels.push({ x:tx, y:ty, text:"tangent: slope " + slopeTxt(sl), dx:nT.x * 16, dy:nT.y * 16, align:alignOf(nT), bg:true });
        desc += " The tangent at P has slope " + slopeTxt(sl) + ".";
      } else desc += " There is no tangent at P: the graph has a corner there.";
    }
    sc.points.push({ x:a, y:ya, color:css("--ink"), r:5.5, label:"P" });
    sc.describe = desc;
    plot.draw(sc);
  }
  plot.render = draw;

  // ---- table, algebra, readout ----
  function paintTable(){
    var Fn = F(), r = rows(), mags = [];
    r.forEach(function(h){ var g = r9(Math.abs(h)); if (mags.indexOf(g) < 0) mags.push(g); });
    mags.sort(function(p, qq){ return qq - p; });
    var cell = function(h){ if (r.indexOf(h) < 0) return '<span class="muted">–</span>'; var s = sec(h); return s.ok ? s.ms : "undefined"; };
    var body = mags.map(function(g){ return [ntx(g), cell(g), cell(r9(-g))]; });
    if (known()) { var t = tanTxt(); body.push([m("h → 0"), "<strong>" + t.r + "</strong>", "<strong>" + t.l + "</strong>"]); }
    q(".tg-tcap").innerHTML = "Secant slopes from " + m("P") + "(" + ntx(aV()) + ", " + XQ.decS(Fn.fq(aV()), 9, 4) + ")";
    q(".tg-tbl").innerHTML = MV.tableHTML({ head:[m("|h|"), "from the right (" + m("h > 0") + ")", "from the left (" + m("h < 0") + ")"], rows:body, hiRow:mags.indexOf(r9(Math.abs(S.h))), caption:"Secant slopes from P, from the right and from the left" });
  }
  function paintAlg(){
    var el = q(".tg-alg"); el.hidden = S.mode !== "alg"; if (el.hidden) return;
    var Fn = F(), a = aV(), st = Fn.steps(a), hid = hidden(), n = hid ? 1 : (stage == null ? st.length : Math.min(st.length, stage + 1));
    el.innerHTML = '<p class="tg-alghd">The algebra at ' + m("a = " + nsrc(a)) + "</p><ol class=\"tg-steps\">" + st.slice(0, n).map(function(s){ return "<li>" + s.html + (s.note ? "<small>" + s.note + "</small>" : "") + "</li>"; }).join("") + "</ol>" +
      (hid ? '<p class="tiny tg-hidenote">' + (o.hideNote || "") + "</p>" : "");
  }
  function iv(a, b){ return "[" + ntx(Math.min(a, b)) + ", " + ntx(Math.max(a, b)) + "]"; }
  function paintRead(){
    var Fn = F(), a = aV(), s = sec(S.h), out = [], yP = XQ.decS(s.P, 9, 4);
    out.push([m("P"), "(" + ntx(a) + ", " + yP + ")"]);
    out.push([m("Q"), s.Q ? "(" + ntx(s.x2) + ", " + XQ.decS(s.Q, 9, 4) + ")" : "undefined: " + m("x = " + nsrc(s.x2)) + " isn’t in the domain"]);
    out.push(["Secant slope " + m("{f(a + h) - f(a)}/{h}"), s.ok ? "<strong>" + s.ms + "</strong>" + ' <span class="tiny muted">= (' + XQ.decS(s.Q, 9, 4) + " − " + par(yP) + ") ÷ " + par(ntx(S.h)) + "</span>" : "undefined"]);
    if (S.mode === "alg") out.push(["Simplified quotient", hidden() ? '<span class="muted">Your turn: that’s challenge 2.</span>' : (stage != null && stage < 2 ? '<span class="muted">…</span>' : Fn.quo(a))]);
    var tr;
    if (hidden()) tr = '? <span class="tiny muted">(solve challenge 2 to see it)</span>';
    else if (!S.unl[key()]) tr = '? <span class="tiny muted">(try ' + m("|h| ≤ 0.01") + " on both sides, or switch to Algebra mode)</span>";
    else if (!known()) tr = "?";
    else { var t = tanTxt(); tr = t.none ? "no tangent: slopes from the left (" + t.l + ") and right (" + t.r + ") disagree" : "<strong>" + t.one + "</strong>"; }
    out.push(["Tangent slope (" + m("h → 0") + ")", tr]);
    out.push(["Average rate on " + iv(a, s.x2), s.ok ? s.ms : "undefined"]);
    L.read.innerHTML = MV.readoutHTML(out);
  }

  // ---- controls ----
  var segMode = MV.seg(q(".tg-mode"), { label:"Mode:", value:S.mode, options:[{ id:"num", t:"Numbers" }, { id:"alg", t:"Algebra" }, { id:"zoom", t:"Zoom" }],
    onChange:function(v){ if (locked) { segMode.set(S.mode); return; } setMode(v); } });
  var segMag = MV.seg(q(".tg-hmag"), { label:"Size of " + m("h") + ":", value:String(Math.abs(S.h)), options:MAGS.map(function(g){ return { id:String(g), t:String(g) }; }),
    onChange:function(v){ if (locked) { segMag.set(String(Math.abs(S.h))); return; } slideTo((S.h < 0 ? -1 : 1) * parseFloat(v)); } });
  var segZoom = MV.seg(q(".tg-zoom"), { label:"Zoom on " + m("P") + ":", value:String(S.zoom), options:ZS.map(function(z){ return { id:String(z), t:"×" + z }; }),
    onChange:function(v){ if (locked) { segZoom.set(String(S.zoom)); return; } zoomTo(+v); } });
  q(".tg-fn").addEventListener("click", function(e){
    var b = e.target.closest("[data-fn]"); if (!b || locked) return;
    stop(); S.fn = b.dataset.fn; addRow(); save(); paint();
  });
  var slider = q(".tg-a"), lastA = aV();
  slider.addEventListener("input", function(){
    if (locked) { slider.value = aV(); return; }
    var v = r9(+slider.value), sk = F().skip || [];
    if (sk.indexOf(v) >= 0) { var dir = v >= lastA ? 1 : -1; v = r9(v + dir * o.aStep); if (v > o.aMax || v < o.aMin) v = r9(v - 2 * dir * o.aStep); slider.value = v; }
    lastA = v; setA(v);
  });
  q(".tg-hb").addEventListener("click", function(e){
    var b = e.target.closest("[data-hb]"); if (!b || b.disabled || locked) return;
    if (b.dataset.hb === "flip") flip(); else slideTo(S.h / (b.dataset.hb === "half" ? 2 : 10));
  });
  q(".tg-tan").addEventListener("click", function(){ if (locked || !S.unl[key()] || hidden()) return; S.tan = !S.tan; save(); paint(); });
  function setA(v){ if (v === aV()) return; stop(); S.a[S.fn] = v; addRow(); save(); paint(); }
  function setMode(v){ stop(); S.mode = v; checkUnl(); save(); paint(); }
  function flip(){ stop(); S.h = r9(-S.h); addRow(); save(); paint(); }
  function slideTo(to, dur, cb){
    stop(); to = r9(to); var from = S.h; S.h = to;
    if (from === to) { addRow(); save(); paint(); if (cb) cb(); return; }
    var geo = from * to > 0;
    anim = MV.tween({ dur:dur == null ? 600 : dur, step:function(t){ A.h = geo ? from * Math.pow(to / from, t) : from + (to - from) * t; draw(); },
      done:function(){ anim = null; A.h = null; addRow(); save(); paint(); if (cb) cb(); } });
  }
  function zoomTo(z, dur, cb){
    var from = zNow(); stop(); S.zoom = z;
    anim = MV.tween({ dur:dur == null ? 700 : dur, step:function(t){ A.zoom = from * Math.pow(z / from, t); draw(); },
      done:function(){ anim = null; A.zoom = null; save(); paint(); if (cb) cb(); } });
  }
  function paintCtl(){
    var Fn = F(), un = !!S.unl[key()] && !hidden();
    MV.keepFocus(q(".tg-fn"), function(){ q(".tg-fn").innerHTML = ORD.map(function(k){ return '<button type="button" class="fchip" data-fn="' + k + '" data-k="tgfn' + k + '" aria-pressed="' + (S.fn === k) + '">' + md(FNS[k].chip) + "</button>"; }).join(""); });
    slider.value = aV(); lastA = aV(); q(".tg-aout").textContent = ntx(aV());
    q(".tg-hout").textContent = ntx(S.h); q(".tg-hside").textContent = S.h > 0 ? "(Q right of P)" : "(Q left of P)";
    segMode.set(S.mode); segMag.set(String(r9(Math.abs(S.h)))); segZoom.set(String(S.zoom));
    q(".tg-zoom").hidden = S.mode !== "zoom";
    var ah = Math.abs(S.h);
    $('[data-hb="half"]', host).disabled = ah / 2 < HMIN - 1e-12; $('[data-hb="ten"]', host).disabled = ah / 10 < HMIN - 1e-12;
    var tb = q(".tg-tan"); tb.disabled = !un; tb.setAttribute("aria-pressed", String(S.tan && un)); tb.classList.toggle("on", S.tan && un);
    q(".tg-tannote").innerHTML = hidden() ? "Locked until challenge 2 is met." : un ? (Fn.slope(aV()) ? "" : "There’s no tangent at a corner.") : "Unlocks when you’ve tried " + m("|h| ≤ 0.01") + " on both sides, or in Algebra mode.";
  }
  function paint(){ L.cap.innerHTML = m(F().eq); paintCtl(); paintTable(); paintAlg(); paintRead(); draw(); }
  addRow(); paint();
  return {
    apply:function(st){
      stop();
      if (st.fn) S.fn = st.fn; if (st.a != null) S.a[S.fn] = st.a; if (st.h != null) S.h = r9(st.h); if (st.mode) S.mode = st.mode;
      if (st.zoom) S.zoom = st.zoom; if (st.tan != null) S.tan = st.tan; if (st.rows) S.rows[key()] = st.rows.slice();
      stage = st.stage == null ? null : st.stage; addRow(); save(); paint();
    },
    slideTo:slideTo, zoomTo:zoomTo, flip:flip, setMode:setMode,
    setTan:function(v){ S.tan = !!v; save(); paint(); },
    stage:function(n){ stage = n; paintAlg(); paintRead(); paintTable(); draw(); },
    lock:function(v){ locked = !!v; },
    get:function(){ return { fn:S.fn, a:aV(), h:S.h, mode:S.mode, zoom:S.zoom, tan:S.tan, unlocked:!!S.unl[key()] }; },
    paint:paint
  };
}

// ---------- hero storyboard: Q slides to P on y = x² from the right, the secant settles into the tangent, a ghost Q repeats from the left ----------
function hero(f){
  var p = new MV.Plot(f.canvas, { xmin:-0.7, xmax:3.7, ymin:-1, ymax:10.5 }), sq = function(x){ return x * x; };
  var st = { h:1, lab:"slope 5", g:null, glab:"", tan:0, fin:false }, seqR = ["5"], seqL = [];
  function cap(){
    f.cap.innerHTML = "From the right: " + seqR.join(", ") + (seqL.length ? ". From the left: " + seqL.join(", ") : "") + (st.fin ? ". Both close in on the tangent slope, 4." : ".");
  }
  p.render = function(){
    var v = { xmin:-0.7, xmax:3.7, ymin:-1, ymax:10.5 }, sc = { view:v, curves:[{ f:sq, color:css("--pen"), width:3.2 }], lines:[], segments:[], points:[], labels:[] };
    if (st.tan > 0) sc.segments.push({ x1:v.xmin, y1:4 + 4 * (v.xmin - 2), x2:v.xmax, y2:4 + 4 * (v.xmax - 2), color:css("--ink"), width:2.2, alpha:st.tan });
    if (st.h != null) {
      var x = 2 + st.h;
      sc.lines.push({ p:[2, 4], q:[x, sq(x)], color:css("--ink-2"), width:2 });
      if (st.h > 0.06) sc.points.push({ x:x, y:sq(x), color:css("--ink-2"), r:5, label:"Q" });
      sc.labels.push({ x:st.fin ? v.xmax - 0.08 : (2 + x) / 2, y:st.fin ? 2 : (4 + sq(x)) / 2, text:(st.fin ? "from the right: " : "") + st.lab, dx:st.fin ? 0 : -12, dy:st.fin ? 0 : -8, align:"right", bg:true, color:css("--ink-2") });
    }
    if (st.g != null) {
      var gx = 2 + st.g;
      sc.lines.push({ p:[2, 4], q:[gx, sq(gx)], color:css("--ink-2"), width:2, dash:[6, 6] });
      if (st.g < -0.06) sc.points.push({ x:gx, y:sq(gx), color:css("--ink-2"), r:5, open:true, label:"Q", below:true });
      sc.labels.push({ x:st.fin ? v.xmin + 0.08 : (2 + gx) / 2, y:st.fin ? 2.2 : (4 + sq(gx)) / 2, text:(st.fin ? "from the left: " : "") + st.glab, dx:st.fin ? 0 : -12, dy:st.fin ? 0 : -8, align:st.fin ? "left" : "right", bg:true, color:css("--ink-2") });
    }
    if (st.tan > 0.5) sc.labels.push({ x:2, y:4, text:"tangent: slope 4", dx:-14, dy:-26, align:"right", bg:true });
    sc.points.push({ x:2, y:4, color:css("--ink"), r:5.5, label:"P(2, 4)", below:true });
    sc.describe = "The parabola y = x squared with P at (2, 4). " + (st.fin ? "Secant slopes from the right were 5, 4.5, 4.1, 4.01; from the left 3, 3.5, 3.9, 3.99. The tangent at P has slope 4." : "Q is sliding toward P; the secant slope is " + st.lab.replace("slope ", "") + ".");
    p.draw(sc);
  };
  function finish(){ st = { h:0.01, lab:"4.01", g:-0.01, glab:"3.99", tan:1, fin:true }; seqR = ["5", "4.5", "4.1", "4.01"]; seqL = ["3", "3.5", "3.9", "3.99"]; cap(); p.render(); }
  if (MV.reduceMotion) { finish(); return; }
  cap(); p.render();
  function run(list, side, cb){
    var i = 0;
    function next(){
      if (i >= list.length) { cb(); return; }
      var from = side > 0 ? st.h : st.g, to = list[i];
      MV.tween({ dur:950, step:function(t){ var hv = from * Math.pow(to / from, t); if (side > 0) { st.h = hv; st.lab = "slope " + num(4 + hv, 3); } else { st.g = hv; st.glab = "slope " + num(4 + hv, 3); } p.render(); },
        done:function(){ var s = num(4 + to, 3); if (side > 0) { st.lab = "slope " + s; seqR.push(s); } else { st.glab = "slope " + s; seqL.push(s); } cap(); p.render(); i++; MV.wait(650, next); } });
    }
    next();
  }
  MV.wait(900, function(){
    run([0.5, 0.1, 0.01], 1, function(){
      MV.tween({ dur:900, step:function(t){ st.tan = t; p.render(); }, done:function(){
        st.h = null; p.render();
        MV.wait(900, function(){
          st.g = -1; st.glab = "slope 3"; seqL = ["3"]; cap(); p.render();
          MV.wait(700, function(){ run([-0.5, -0.1, -0.01], -1, function(){ MV.wait(500, finish); }); });
        });
      } });
    });
  });
}

// ---------- Explore: the secant squeeze, challenges and predictions ----------
var PSTART = {
  p1:{ fn:"sq", a:2, h:1, mode:"num", zoom:1, tan:false, rows:[1] },
  p2:{ fn:"sq", a:2, h:-1, mode:"num", zoom:1, tan:false, rows:[1, 0.5, 0.1, 0.01, 0.001] },
  p3:{ fn:"cube", a:1, h:0.1, mode:"alg", zoom:1, tan:false, rows:[0.1], stage:0 },
  p4:{ fn:"abs", a:1, h:1, mode:"num", zoom:1, tan:false, rows:[1] }
};
var TOPS = [["1", "1"], ["-1", "-1"], ["h", "h"], ["-h", "-h"]], BOTS = [["1+h", "1 + h"], ["h(1+h)", "h(1 + h)"], ["1", "1"], ["h", "h"]];
function tc2Solved(){ return !!(MV.S.chal.tc2 || {}).solved; }
function explore(host, api){
  var S = api.S; S.tc2 = S.tc2 || { top:null, bot:null, slope:"" };
  var wrap = document.createElement("div"); host.appendChild(wrap);
  var tool = secantTangent(wrap, { S:S, save:api.save, changed:api.changed, fns:FN, order:ORDER, aMin:-3, aMax:3, aStep:0.5, aria:"Secant squeeze graph",
    hide:function(fn, a){ return fn === "recip" && a === 1 && !tc2Solved(); },
    hideNote:md("Next step: `{f(1 + h) - f(1)}/{h} = {1/(1 + h) - 1}/{h}`. Combine the top over a common denominator yourself in the <strong>Exact slope</strong> box below: that’s challenge 2."),
    extra:function(sc, st){
      if (st.fn !== "vtx") return;
      sc.segments.push({ x1:0, y1:0, x2:5, y2:5, color:css("--ink-2"), width:2, dash:[7, 5] });
      sc.points.push({ x:0, y:0, r:4, color:css("--ink-2") }, { x:5, y:5, r:4, color:css("--ink-2"), label:"(5, 5)" });
    } });
  // challenge 2 work box
  var bx = document.createElement("div"); bx.className = "tg-tc2"; host.appendChild(bx);
  function fracSrc(){ var t = S.tc2, top = TOPS.filter(function(x){ return x[0] === t.top; })[0], bot = BOTS.filter(function(x){ return x[0] === t.bot; })[0]; return { top:top ? top[1] : null, bot:bot ? bot[1] : null }; }
  function paintTc2(){
    var t = S.tc2, done = tc2Solved(), fs = fracSrc();
    var chip = function(part, list){ return list.map(function(c){ return '<button type="button" class="fchip tg-c2" data-part="' + part + '" data-v="' + c[0] + '" data-k="tc2' + part + c[0] + '" aria-pressed="' + (t[part] === c[0]) + '"' + (done ? " disabled" : "") + ">" + m(c[1]) + "</button>"; }).join(""); };
    MV.keepFocus(bx, function(){
      bx.innerHTML = '<h4>Exact slope: ' + m("f(x) = {1}/{x}") + " at " + m("a = 1") + ' <span class="tiny muted">(challenge 2)</span></h4>' +
        '<p class="tg-c2eq" aria-live="polite">' + m("{f(1 + h) - f(1)}/{h} =") + ' <span class="frac tg-c2f"><span class="fn">' + (fs.top ? m(fs.top) : '<span class="tg-c2e">top</span>') + '</span><span class="fd">' + (fs.bot ? m(fs.bot) : '<span class="tg-c2e">bottom</span>') + "</span></span></p>" +
        '<div class="tg-c2row"><span class="tiny tg-c2l">Top:</span><span class="chips" role="group" aria-label="Top of the simplified quotient">' + chip("top", TOPS) + "</span></div>" +
        '<div class="tg-c2row"><span class="tiny tg-c2l">Bottom:</span><span class="chips" role="group" aria-label="Bottom of the simplified quotient">' + chip("bot", BOTS) + "</span></div>" +
        '<label class="tg-c2s" for="tg-slope"><span>Tangent slope (let ' + m("h → 0") + '):</span> <input class="numin short" id="tg-slope" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(t.slope) + '"' + (done ? " disabled" : "") + "></label>" +
        (done ? '<p class="tiny tg-ok">✓ Challenge 2 met: the tangent slope is −1.</p>' : "");
    });
  }
  bx.addEventListener("click", function(e){ var b = e.target.closest("[data-part]"); if (!b || b.disabled) return; S.tc2[b.dataset.part] = b.dataset.v; api.save(); paintTc2(); MV.changed(); });
  bx.addEventListener("input", function(e){ if (e.target.id !== "tg-slope") return; S.tc2.slope = e.target.value; api.save(); MV.changed(); });
  paintTc2();
  function tc2(){
    var t = S.tc2, raw = String(t.slope || "").trim(), pv = raw && !/h/i.test(raw) ? MV.parseNum(raw) : null, v = pv && pv.length === 1 ? pv[0] : null;
    if (/h/i.test(raw)) return md("That’s the secant slope for every `h`. Now let `h → 0`.");
    if (v != null && close(v, 1)) return md("Combine `{1}/{1 + h} - 1 = {-h}/{1 + h}`: the sign is negative.");
    if (v != null && close(v, 0)) return md("That’s 0/0 from substituting `h = 0` first.");
    if (!t.top || !t.bot) return "Assemble the simplified quotient first: tap a chip for the top and one for the bottom.";
    if (t.top === "1" && t.bot === "1+h") return md("Combine `{1}/{1 + h} - 1 = {-h}/{1 + h}`: the sign is negative.");
    if (t.top === "-h" && t.bot === "h(1+h)") return md("Same value, but `h` still divides the top and the bottom. Cancel it: that’s the step that lets you put `h` close to 0.");
    if (!(t.top === "-1" && t.bot === "1+h")) return md("That isn’t equal to `{1/(1 + h) - 1}/{h}`. Combine the top over a common denominator: `{1}/{1 + h} - 1 = {1 - (1 + h)}/{1 + h}`.");
    if (!raw) return md("The quotient is right. Now enter the tangent slope: let `h → 0`.");
    if (v == null) return "Enter the slope as a number, such as −2 or 3/4.";
    if (close(v, -1)) return true;
    return md("Let `h → 0` in `{-1}/{1 + h}`: the bottom approaches 1.");
  }
  function chal(id, opt){
    var g = tool.get(), h = r9(g.h);
    if (id === "tc1") {
      if (g.fn !== "sq") return { ok:false, msg:md("Choose `f(x) = x^2` first.") };
      if (g.a !== 2) return { ok:false, msg:md("Put `P` at `a = 2`.") };
      if (h === 0.5) return { ok:true };
      if (h < 0) return { ok:false, msg:md("A negative `h` puts `Q` on the left, so the slope `4 + h` is less than 4.") };
      return { ok:false, msg:md("`4 + " + nsrc(h) + " = " + nsrc(4 + h) + "`. Which `h` makes `4 + h = 4.5`?") };
    }
    if (id === "tc2") {
      var r = tc2();
      if (r === true) { if (!opt || !opt.live) setTimeout(function(){ tool.paint(); paintTc2(); }, 0); return { ok:true }; }
      return { ok:false, msg:r };
    }
    if (id === "tc3") {
      if (g.fn !== "vtx") return { ok:false, msg:md("Choose `f(x) = x^2 - 4x` first.") };
      if (g.a === 2.5) return { ok:true };
      if (g.a === 2) return { ok:false, msg:"There the tangent is horizontal (slope 0). The secant’s slope is 1." };
      if (g.a === 0 || g.a === 5) return { ok:false, msg:"Those are where the secant meets the curve. You want a tangent with the same slope as the secant." };
      return { ok:false, msg:md("At `a = " + nsrc(g.a) + "` the tangent has slope " + ntx(2 * g.a - 4) + ", but the secant from (0, 0) to (5, 5) has slope 1. Parallel means equal slopes.") };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){ tool.lock(false); tool.apply(PSTART[p.id]); tool.lock(true); },
      run:function(p, done){
        var fin = function(){ tool.lock(false); tool.stage(null); tool.paint(); done(); };
        function seq(list, cb){ var i = 0; (function next(){ if (i >= list.length) { cb(); return; } var h = list[i++]; tool.slideTo(h, 650, function(){ MV.wait(380, next); }); })(); }
        if (p.id === "p1") seq([0.5, 0.1, 0.01, 0.001], function(){ MV.wait(200, fin); });
        else if (p.id === "p2") seq([-0.5, -0.1, -0.01, -0.001], function(){ MV.wait(200, fin); });
        else if (p.id === "p3") MV.wait(500, function(){ tool.stage(1); MV.wait(1100, function(){ tool.stage(2); MV.wait(1100, function(){ tool.stage(3); tool.setTan(true); MV.wait(700, fin); }); }); });
        else if (p.id === "p4") seq([0.1, 0.01], function(){
          MV.wait(300, function(){ tool.apply({ h:-1 }); tool.lock(true);
            MV.wait(500, function(){ seq([-0.1, -0.01], function(){
              tool.setMode("zoom");
              tool.zoomTo(2, 600, function(){ MV.wait(300, function(){ tool.zoomTo(10, 900, function(){ MV.wait(300, function(){ tool.zoomTo(100, 1100, function(){ MV.wait(500, fin); }); }); }); }); });
            }); });
          });
        });
        else fin();
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: tangent lines and where they fail ----------
function sq(x){ return x * x; }
function cu(x){ return x * x * x; }
function part3(host, api){
  var S = api.S; S.st = ["s1", "s2", "s3"].indexOf(S.st) >= 0 ? S.st : "s1";
  S.s1 = S.s1 || { a:2, m:"", b:"", solved:[], wrong:null, last:null };
  S.s2 = S.s2 || { i:0, it:{} }; S.s3 = S.s3 || { v:"corner", m:0, pt:"0", zoom:1 };
  host.innerHTML = '<div class="tl-st"></div>' +
    '<div class="tl-pane" data-pane="s1"><h3 class="tl-h">Station 1: from slope to line</h3><div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="tl1-plot" role="img" aria-label="y = x squared with a point P"></canvas></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="tl1-z" data-k="tl1z">Zoom in on P</button></div></div>' +
      '<div><p class="how">Tap a point on ' + m("y = x^2") + " (or focus " + m("P") + " and use the arrow keys). The module gives the slope from the simplified quotient. Then write the tangent line.</p>" +
      '<dl class="read" id="tl1-read" aria-live="polite"></dl><div class="tl-fill" role="group" aria-label="Tangent line"><span class="m">' + m("y =") + '</span><input class="tl-in" id="tl1-m" type="number" step="any" autocomplete="off" aria-label="Slope m"><span>' + m("x +") + '</span><input class="tl-in" id="tl1-b" type="number" step="any" autocomplete="off" aria-label="y-intercept b"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="tl1-check" data-k="tl1chk">Check</button></div><div id="tl1-fb" aria-live="polite"></div><p class="tiny" id="tl1-done"></p>' +
      '<details class="alg" id="tl1-alg"><summary>Check it with algebra</summary><div id="tl1-algb"></div></details></div></div></div>' +
    '<div class="tl-pane" data-pane="s2"><h3 class="tl-h">Station 2: from slope to point</h3><div class="pred-top"><span class="tiny muted" id="tl2-n"></span><span class="dots" id="tl2-dots" aria-hidden="true"></span></div><p class="pred-q" id="tl2-q"></p>' +
      '<div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="tl2-plot" role="img" aria-label="Graph for this question"></canvas></div></div>' +
      '<div><p class="how" id="tl2-how"></p><dl class="read" id="tl2-read" aria-live="polite"></dl><div class="q-actions" id="tl2-mk"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="tl2-check" data-k="tl2chk">Check</button></div><div id="tl2-fb" aria-live="polite"></div>' +
      '<details class="alg" id="tl2-alg" hidden><summary>Check it with algebra</summary><p id="tl2-algb" style="margin:10px 0 0"></p></details>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="tl2-prev" data-k="tl2prev">Previous</button><button type="button" class="btn ghost sm" id="tl2-next" data-k="tl2next">Next question</button></div></div></div></div>' +
    '<div class="tl-pane" data-pane="s3"><h3 class="tl-h">Station 3: where tangents fail (or surprise)</h3><div class="tl-s3v"></div><div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="tl3-plot" role="img" aria-label="Station 3 graph"></canvas></div><p class="tiny muted tl-cap" id="tl3-cap"></p></div>' +
      '<div><div id="tl3-ctl"></div><dl class="read" id="tl3-read" aria-live="polite"></dl></div></div></div>';
  var seg = MV.seg($(".tl-st", host), { label:"Station:", value:S.st, options:[{ id:"s1", t:"1. Slope to line" }, { id:"s2", t:"2. Slope to point" }, { id:"s3", t:"3. Where tangents fail" }],
    onChange:function(v){ S.st = v; api.save(); show(); } });
  function show(){ $$(".tl-pane", host).forEach(function(p){ p.hidden = p.dataset.pane !== S.st; }); seg.set(S.st); requestAnimationFrame(function(){ (S.st === "s1" ? p1 : S.st === "s2" ? p2 : p3).render(); }); }

  // ---- station 1: slope -> line ----
  var V1 = { xmin:-4, xmax:4, ymin:-3, ymax:12 }, z1 = 0, z1anim = null, s1msg = null;
  var p1 = new MV.Plot($("#tl1-plot"), V1);
  function s1(){ return S.s1; }
  function view1(){
    var a = s1().a, k = 1 - z1 * (1 - 1 / 8), cx = 0 + (a - 0) * z1, cy = 4.5 + (sq(a) - 4.5) * z1;
    return { xmin:cx - 4 * k, xmax:cx + 4 * k, ymin:cy - 7.5 * k, ymax:cy + 7.5 * k };
  }
  function solved1(a){ return s1().solved.indexOf(a) >= 0; }
  p1.render = function(){
    var a = s1().a, y = sq(a), v = view1(), sc = { view:v, curves:[{ f:sq, color:css("--pen"), width:3, arrows:z1 < 0.05 }], lines:[], points:[], labels:[] }, desc = "y = x squared with P at (" + ntx(a) + ", " + ntx(y) + ").";
    var left = a > 0.5;
    if (solved1(a)) {
      sc.lines.push({ p:[a, y], q:[a + 1, y + 2 * a], color:css("--ink"), width:2.2 });
      sc.labels.push({ x:a, y:y, text:MV.plain(m(lineSrc(2 * a, -a * a))), dx:left ? -14 : 14, dy:-24, align:left ? "right" : "left", bg:true });
      desc += " The tangent " + MV.plain(m(lineSrc(2 * a, -a * a))) + " touches the curve at P.";
    } else if (s1().wrong && s1().wrong.a === a) {
      var w = s1().wrong;
      sc.lines.push({ p:[0, w.b], q:[1, w.b + w.m], color:css("--ink-2"), width:2, dash:[7, 6] });
      desc += " Your line y = " + ntx(w.m) + "x + " + ntx(w.b) + " is drawn dashed: it isn’t the tangent.";
    }
    sc.points.push({ x:a, y:y, color:css("--ink"), r:6, ring:true, label:"P(" + ntx(a) + ", " + ntx(y) + ")", below:a < -0.5 || z1 > 0.5 });
    sc.describe = desc;
    p1.draw(sc);
  };
  MV.drag(p1, { axis:"x", step:{ x:1, y:1 },
    handles:function(){ var a = s1().a; return [{ id:"P", x:a, y:sq(a), label:"Point P at x = " + ntx(a) + ". Arrow keys move it." }]; },
    move:function(id, x){ setA1(x); } });
  p1.c.addEventListener("pointerdown", function(e){ if (e.defaultPrevented) return; var r = p1.c.getBoundingClientRect(); setA1(p1.xOf(e.clientX - r.left)); });
  function setA1(x){
    var a = Math.max(-3, Math.min(3, Math.round(x))); if (a === s1().a) return;
    if (z1anim) z1anim(); z1 = 0; s1().a = a; s1().m = ""; s1().b = ""; s1msg = null; api.save(); paint1();
  }
  function paint1(){
    var a = s1().a, y = sq(a), solved = solved1(a);
    $("#tl1-read").innerHTML = MV.readoutHTML([[m("P"), "(" + ntx(a) + ", " + ntx(y) + ")"], ["Simplified quotient", m("2a + h = " + polySrc([2 * a, 1]))], ["Tangent slope", m(polySrc([2 * a, 1]) + " → " + nsrc(2 * a))]]);
    var mi = $("#tl1-m"), bi = $("#tl1-b"); mi.value = s1().m; bi.value = s1().b; mi.disabled = bi.disabled = solved; $("#tl1-check").disabled = solved;
    var fb = $("#tl1-fb");
    if (solved) fb.innerHTML = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + m(lineSrc(2 * a, -a * a)) + " is the tangent at " + m("P") + "(" + ntx(a) + ", " + ntx(y) + "). Zoom in: near " + m("P") + " the curve and the line are almost the same, and they meet only at " + m("P") + ". Tap another point to try again.");
    else fb.innerHTML = s1msg ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s1msg + " Try again.") : "";
    var list = s1().solved.slice().sort(function(p, qq){ return p - qq; });
    $("#tl1-done").innerHTML = list.length ? "Tangent lines you’ve written: " + list.map(function(x){ return m(lineSrc(2 * x, -x * x)); }).join(" · ") : "";
    var la = solved ? a : s1().last;
    $("#tl1-algb").innerHTML = '<p style="margin:10px 0 0">' + (la == null ? "Write one tangent line first; then this panel checks it with algebra." :
      md("`x^2 - " + (la === 0 ? "0 = x^2" : "(" + polySrc([-la * la, 2 * la], "x", true) + ") = " + polySrc([la * la, -2 * la, 1], "x", true) + " = (x " + (la > 0 ? "- " : "+ ") + nsrc(Math.abs(la)) + ")^2") + "`, which is 0 only at `x = " + nsrc(la) + "`. So the line meets the curve only at the point of tangency, and the curve stays above it.")) + "</p>";
    $("#tl1-z").textContent = z1 > 0.5 ? "Zoom out" : "Zoom in on P";
    p1.render();
  }
  function zoom1(to, dur){ if (z1anim) z1anim(); var from = z1; z1anim = MV.tween({ dur:dur || 1100, step:function(t){ z1 = from + (to - from) * t; p1.render(); }, done:function(){ z1anim = null; $("#tl1-z").textContent = z1 > 0.5 ? "Zoom out" : "Zoom in on P"; } }); }
  $("#tl1-z").addEventListener("click", function(){ zoom1(z1 > 0.5 ? 0 : 1, 900); });
  $("#tl1-m").addEventListener("input", function(e){ s1().m = e.target.value; api.save(); });
  $("#tl1-b").addEventListener("input", function(e){ s1().b = e.target.value; api.save(); });
  $("#tl1-check").addEventListener("click", function(){
    var a = s1().a, y = sq(a), M = 2 * a, B = -a * a, pm = MV.parseNum(s1().m), pb = MV.parseNum(s1().b);
    if (!pm || !pb || pm.length !== 1 || pb.length !== 1) { s1msg = "Fill in both boxes with numbers, such as 4 and −4."; paint1(); MV.focusFb($("#tl1-fb").parentNode); return; }
    var mv = pm[0], bv = pb[0];
    if (close(mv, M) && close(bv, B)) { s1().solved.push(a); s1().wrong = null; s1().last = a; s1msg = null; api.save(); paint1(); zoom1(1, 1300); MV.focusFb($("#tl1-fb").parentNode); return; }
    s1().wrong = { a:a, m:mv, b:bv };
    var pt = "(" + ntx(a) + ", " + ntx(y) + ")";
    if (!close(mv, M)) s1msg = md("The slope of the tangent comes from the quotient: `" + polySrc([M, 1]) + " → " + nsrc(M) + "`. Use " + ntx(M) + " for the slope.");
    else if (close(bv, y) && a !== 0) s1msg = md("The tangent passes through " + pt + ", not (0, " + ntx(y) + "). Use `y - f(a) = m(x - a)`: `y - " + nsrc(y) + " = " + nsrc(M) + "(x " + (a > 0 ? "- " : "+ ") + nsrc(Math.abs(a)) + ")`.");
    else if (close(bv, -3 * a * a)) s1msg = md("Expand carefully: `y - " + nsrc(y) + " = " + nsrc(M) + "x - " + nsrc(2 * a * a) + "`, so add " + ntx(y) + " to both sides.");
    else s1msg = md("Check that your line passes through `P`" + pt + ": `" + nsrc(M) + "(" + nsrc(a) + ") + b` must equal " + ntx(y) + ".");
    api.save(); paint1(); MV.focusFb($("#tl1-fb").parentNode);
  });

  // ---- station 2: slope -> point ----
  var IT2 = [
    { id:"sx2", f:sq, d:function(x){ return 2 * x; }, dTxt:function(x){ return "2(" + nsrc(x) + ")"; }, slope:-3, ans:[-1.5], lo:-3, hi:3, x0:1, view:{ xmin:-3.6, xmax:3.6, ymin:-1, ymax:10 }, eq:"y = x^2",
      prompt:"Where is the tangent slope −3 on " + m("y = x^2") + "?", how:"Tap the curve (or focus the point and use the arrow keys). It snaps to steps of 0.5.",
      alg:"`2a = -3` gives `a = -1.5`, and the point is (−1.5, (−1.5)²) = (−1.5, 2.25)." },
    { id:"sx3", f:cu, d:function(x){ return 3 * x * x; }, dTxt:function(x){ return "3(" + nsrc(x) + ")^2"; }, slope:12, ans:[-2, 2], multi:true, lo:-2.5, hi:2.5, x0:1, view:{ xmin:-3, xmax:3, ymin:-18, ymax:18 }, eq:"y = x^3",
      prompt:"Now " + m("y = x^3") + ": where is the tangent slope 12? There are two answers.", how:"Tap the curve to mark a point (tap it again to unmark), or focus the point, use the arrow keys and press M. Mark every answer.",
      alg:"`3a^2 = 12` gives `a^2 = 4`, so `a = 2` or `a = -2`: the points are (2, 8) and (−2, −8)." }
  ];
  var p2 = new MV.Plot($("#tl2-plot"), IT2[0].view), s2msg = {};
  function it2(){ return IT2[S.s2.i]; }
  function st2(){ var t = it2(); return S.s2.it[t.id] || (S.s2.it[t.id] = { x:t.x0, marks:[], solved:false, tries:0 }); }
  function snap2(x){ var t = it2(); return Math.max(t.lo, Math.min(t.hi, Math.round(x * 2) / 2)); }
  p2.render = function(){
    var t = it2(), x = st2(), sc = { view:t.view, curves:[{ f:t.f, color:css("--pen"), width:3, arrows:true }], lines:[], points:[], labels:[] };
    if (x.solved) t.ans.forEach(function(v, i){ sc.lines.push({ p:[v, t.f(v)], q:[v + 1, t.f(v) + t.slope], color:css("--ink"), width:2 }); sc.labels.push({ x:v, y:t.f(v), text:"slope " + ntx(t.slope), dx:v < 0 ? 14 : -14, dy:v < 0 ? 22 : -22, align:v < 0 ? "left" : "right", bg:true }); });
    if (t.multi) x.marks.forEach(function(v){ sc.points.push({ x:v, y:t.f(v), r:7, open:true, color:css("--ink") }); });
    if (!x.solved) sc.points.push({ x:x.x, y:t.f(x.x), r:6, color:css("--ink"), ring:true });
    else t.ans.forEach(function(v){ sc.points.push({ x:v, y:t.f(v), r:5.5, color:css("--ink"), label:"(" + ntx(v) + ", " + ntx(t.f(v)) + ")", below:v < 0 }); });
    sc.describe = "Graph of " + MV.plain(m(t.eq)) + (x.solved ? ". Tangents with slope " + ntx(t.slope) + " drawn at " + t.ans.map(function(v){ return "(" + ntx(v) + ", " + ntx(t.f(v)) + ")"; }).join(" and ") + "." : ". Point at x = " + ntx(x.x) + "." + (t.multi && x.marks.length ? " Marked: x = " + x.marks.map(ntx).join(", ") + "." : ""));
    p2.draw(sc);
  };
  MV.drag(p2, { axis:"x", step:{ x:0.5, y:0.5 },
    handles:function(){ var t = it2(), x = st2(); return x.solved ? [] : [{ id:"T", x:x.x, y:t.f(x.x), label:"Point at x = " + ntx(x.x) + ". Arrow keys move it by 0.5" + (t.multi ? "; press M to mark it." : ".") }]; },
    key:function(id, e){ if ((e.key === "m" || e.key === "M") && it2().multi) { toggle2(st2().x); return true; } return false; },
    move:function(id, x){ set2(x); } });
  p2.c.addEventListener("pointerdown", function(e){
    if (e.defaultPrevented || st2().solved) return;
    var r = p2.c.getBoundingClientRect(), v = snap2(p2.xOf(e.clientX - r.left)); set2(v); if (it2().multi) toggle2(v);
  });
  function set2(x){ var s = st2(); if (s.solved) return; x = snap2(x); if (x === s.x) return; s.x = x; api.save(); paint2(); }
  function toggle2(v){ var s = st2(); if (s.solved) return; var k = s.marks.indexOf(v); if (k >= 0) s.marks.splice(k, 1); else if (s.marks.length < 4) s.marks.push(v); s.marks.sort(function(p, qq){ return p - qq; }); s2msg[it2().id] = null; api.save(); paint2(); }
  function paint2(){
    var t = it2(), s = st2();
    $("#tl2-n").textContent = "Question " + (S.s2.i + 1) + " of " + IT2.length;
    $("#tl2-dots").innerHTML = IT2.map(function(z, i){ var y = S.s2.it[z.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.s2.i ? " cur" : "") + '"></span>'; }).join("");
    $("#tl2-q").innerHTML = t.prompt; $("#tl2-how").innerHTML = t.how;
    var rows = [["Point", "(" + ntx(s.x) + ", " + ntx(t.f(s.x)) + ")"]];
    if (t.multi) rows.push(["Marked", s.marks.length ? s.marks.map(function(v){ return "(" + ntx(v) + ", " + ntx(t.f(v)) + ")"; }).join(", ") : '<span class="muted">none yet: tap the curve</span>']);
    $("#tl2-read").innerHTML = MV.readoutHTML(rows);
    MV.keepFocus($("#tl2-mk"), function(){ $("#tl2-mk").innerHTML = t.multi && !s.solved ? '<button type="button" class="btn ghost sm" data-mk="add" data-k="tl2mk">' + (s.marks.indexOf(s.x) >= 0 ? "Unmark this point" : "Mark this point") + '</button><button type="button" class="btn ghost sm" data-mk="clear" data-k="tl2clr"' + (s.marks.length ? "" : " disabled") + ">Clear marks</button>" : ""; });
    $("#tl2-check").disabled = s.solved || (t.multi && !s.marks.length);
    $("#tl2-fb").innerHTML = s.solved ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + md(t.alg)) : (s2msg[t.id] ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s2msg[t.id] + " Try again.") : "");
    $("#tl2-alg").hidden = !s.solved; $("#tl2-algb").innerHTML = md(t.alg);
    $("#tl2-prev").disabled = S.s2.i === 0; $("#tl2-next").disabled = S.s2.i === IT2.length - 1;
    p2.render();
  }
  $("#tl2-mk").addEventListener("click", function(e){ var b = e.target.closest("[data-mk]"); if (!b || b.disabled) return; if (b.dataset.mk === "add") toggle2(st2().x); else { st2().marks = []; api.save(); paint2(); } });
  $("#tl2-prev").addEventListener("click", function(){ S.s2.i = Math.max(0, S.s2.i - 1); api.save(); paint2(); });
  $("#tl2-next").addEventListener("click", function(){ S.s2.i = Math.min(IT2.length - 1, S.s2.i + 1); api.save(); paint2(); });
  $("#tl2-check").addEventListener("click", function(){
    var t = it2(), s = st2(), pts = t.multi ? s.marks : [s.x], msg = null;
    var bad = pts.filter(function(v){ return t.ans.indexOf(v) < 0; })[0];
    if (bad != null) msg = md("At `x = " + nsrc(bad) + "` the tangent slope is `" + t.dTxt(bad) + " = " + nsrc(t.d(bad)) + "`, not " + ntx(t.slope) + ".");
    else if (t.ans.some(function(v){ return pts.indexOf(v) < 0; })) msg = "That point works, but there’s another one. The slope is the same at " + m("a") + " and " + m("-a") + ": mark both.";
    if (msg) { s.tries++; s2msg[t.id] = msg; } else { s.solved = true; s2msg[t.id] = null; }
    api.save(); paint2(); MV.focusFb($("#tl2-fb").parentNode);
  });

  // ---- station 3: a corner and a crossing tangent ----
  var p3 = new MV.Plot($("#tl3-plot"), { xmin:-2, xmax:4, ymin:-1, ymax:5 }), s3z = null;
  var segV = MV.seg($(".tl-s3v", host), { label:"Show:", value:S.s3.v, options:[{ id:"corner", t:"A corner: " + m("y = |x - 1| + 1") }, { id:"cross", t:"A crossing: " + m("y = x^3") }],
    onChange:function(v){ S.s3.v = v; api.save(); ctl3(); paint3(); } });
  function abs1(x){ return Math.abs(x - 1) + 1; }
  function ctl3(){
    var c = $("#tl3-ctl");
    if (S.s3.v === "corner") {
      c.innerHTML = '<label class="slider tl-sl"><span class="slider-top"><span>Slope of your line through (1, 1)</span><output id="tl3-mo">' + ntx(S.s3.m) + '</output></span><input type="range" id="tl3-m" min="-2" max="2" step="0.25" value="' + S.s3.m + '" style="accent-color:var(--ink)" aria-label="Slope of your line through (1, 1)"></label>';
      $("#tl3-m").addEventListener("input", function(e){ S.s3.m = +e.target.value; $("#tl3-mo").textContent = ntx(S.s3.m); api.save(); paint3(); });
    } else {
      c.innerHTML = '<div class="tl-pt"></div><div class="tl-z"></div>';
      MV.seg($(".tl-pt", c), { label:"Point of tangency:", value:S.s3.pt, options:[{ id:"0", t:"(0, 0)" }, { id:"1", t:"(1, 1)" }], onChange:function(v){ S.s3.pt = v; api.save(); paint3(); } });
      MV.seg($(".tl-z", c), { label:"Zoom:", value:String(S.s3.zoom), options:[{ id:"1", t:"×1" }, { id:"4", t:"×4" }, { id:"16", t:"×16" }], onChange:function(v){ zoom3(+v); } });
    }
  }
  var zz = null;
  function zoom3(z){ if (s3z) s3z(); var from = zz != null ? zz : S.s3.zoom; S.s3.zoom = z; api.save(); s3z = MV.tween({ dur:700, step:function(t){ zz = from * Math.pow(z / from, t); p3.render(); }, done:function(){ s3z = null; zz = null; paint3(); } }); }
  p3.render = function(){
    var sc = { lines:[], segments:[], points:[], labels:[] };
    if (S.s3.v === "corner") {
      var v = { xmin:-2, xmax:4, ymin:-1, ymax:5 }, mm = S.s3.m;
      sc.view = v; sc.curves = [{ pts:[[v.xmin, abs1(v.xmin)], [1, 1], [v.xmax, abs1(v.xmax)]], color:css("--pen"), width:3 }];
      for (var k = -2; k <= 2.001; k += 0.5) sc.segments.push({ x1:v.xmin, y1:1 + k * (v.xmin - 1), x2:v.xmax, y2:1 + k * (v.xmax - 1), color:css("--ink-2"), width:1.5, alpha:0.4 });
      sc.segments.push({ x1:v.xmin, y1:1 + mm * (v.xmin - 1), x2:v.xmax, y2:1 + mm * (v.xmax - 1), color:css("--ink"), width:2.4 });
      sc.labels.push({ x:3.1, y:1 + mm * 2.1, text:"slope " + ntx(mm), dy:mm >= 0 ? -16 : 16, align:"center", bg:true });
      sc.points.push({ x:1, y:1, r:5.5, color:css("--ink"), label:"(1, 1)", below:true });
      sc.describe = "y = |x − 1| + 1 with a corner at (1, 1), a fan of faint candidate lines through the corner, and your line with slope " + ntx(mm) + ". The graph has slope −1 on the left and 1 on the right.";
      $("#tl3-cap").innerHTML = "The faint lines are candidates through the corner. None of them matches the slopes on both sides.";
    } else {
      var a = +S.s3.pt, z = zz != null ? zz : S.s3.zoom, base = { cx:0, cy:0, hw:2.6, hh:10 };
      var k2 = 1 / z, cx = a + (base.cx - a) * k2, cy = cu(a) + (base.cy - cu(a)) * k2, vv = { xmin:cx - base.hw * k2, xmax:cx + base.hw * k2, ymin:cy - base.hh * k2, ymax:cy + base.hh * k2 };
      var ms = 3 * a * a, ya = cu(a);
      sc.view = vv; sc.curves = [{ f:cu, color:css("--pen"), width:3, arrows:z < 1.5 }];
      sc.lines.push({ p:[a, ya], q:[a + 1, ya + ms], color:css("--ink"), width:2.2 });
      sc.labels.push({ x:a, y:ya, text:MV.plain(m(lineSrc(ms, ya - ms * a))), dx:a === 0 ? -14 : 14, dy:-22, align:a === 0 ? "right" : "left", bg:true });
      sc.points.push({ x:a, y:ya, r:5.5, color:css("--ink"), label:"(" + a + ", " + a + ")", below:true });
      if (a === 1) sc.points.push({ x:-2, y:-8, r:6, open:true, color:css("--ink"), label:"meets it again at (−2, −8)", below:false });
      sc.describe = a === 0 ? "y = x cubed with its tangent y = 0 at the origin. The curve is below the tangent on the left and above it on the right, so the tangent crosses the curve." : "y = x cubed with its tangent y = 3x − 2 at (1, 1). The tangent meets the curve again at (−2, −8).";
      $("#tl3-cap").innerHTML = "A tangent shares the curve’s slope at the point. It may cross the curve, or touch it again elsewhere.";
    }
    p3.draw(sc);
  };
  function paint3(){
    var rows;
    if (S.s3.v === "corner") {
      var mm = S.s3.m, verdict = close(mm, 1) ? "Your line matches the graph on the right of (1, 1), but on the left the graph falls with slope −1." : close(mm, -1) ? "Your line matches the graph on the left of (1, 1), but on the right the graph rises with slope 1." : "Your line matches neither side.";
      rows = [["Slope from the left", MINUS + "1"], ["Slope from the right", "1"], ["Your line", "slope " + ntx(mm)], ["Verdict", verdict + " No single line matches the slopes on both sides, so there’s no tangent at the corner."]];
    } else if (S.s3.pt === "0") rows = [["Tangent at (0, 0)", m("y = 0") + " (slope 0)"], ["What it does", "Left of 0 the curve is below the tangent; right of 0 it’s above. The tangent crosses the curve, and it’s still the tangent: it matches the slope at the point."]];
    else rows = [["Tangent at (1, 1)", m("y = 3x - 2") + " (slope 3)"], ["What it does", "It touches the curve at (1, 1) and meets it again at (−2, −8): " + m("x^3 - (3x - 2) = (x - 1)^2(x + 2)") + "."]];
    $("#tl3-read").innerHTML = MV.readoutHTML(rows);
    p3.render();
  }
  ctl3(); paint1(); paint2(); paint3(); show();
}

// ---------- Practice 2: simplify, then let h shrink (V8-style exact boxes) ----------
var DF = { d1:function(x){ return x * x - 3 * x; }, d2:function(x){ return x * x * x; } };
function pq(s){
  s = String(s == null ? "" : s).trim().replace(/−/g, "-").replace(/\s+/g, "");
  if (!s) return null;
  var r = Qx.raw(s); if (r) return Qx.of(r.n, r.d);
  if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) return Qx.of(parseFloat(s));
  return undefined;   // not a number
}
function qtx(q){ return Qx.txt(q); }
function simp(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ return st.items[id] || (st.items[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q tg-dq" data-dq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="tg-fr"></div><div class="tg-dc"></div></div>';
  }).join("");
  function bx(it, k, lab, wide){ var x = ist(it.id); return '<input class="tg-box' + (wide ? " wide" : "") + '" data-v="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(lab) + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function frame(it){
    var x = ist(it.id), h = "", slope = '<div class="tg-frow"><span class="tg-flab">Tangent slope:</span> ' + m("h → 0:") + " " + bx(it, "m", "Tangent slope (exact)") + "</div>";
    var qlab = '<span class="tg-flab">Simplified quotient:</span> ';
    if (it.frame === "lin") h = '<div class="tg-frow">' + qlab + bx(it, "c0", "Constant term") + ' <span class="m">+</span> ' + bx(it, "c1", "Coefficient of h") + m("h") + "</div>" + slope;
    else if (it.frame === "quad") h = '<div class="tg-frow">' + qlab + bx(it, "c0", "Constant term") + ' <span class="m">+</span> ' + bx(it, "c1", "Coefficient of h") + m("h") + ' <span class="m">+</span> ' + bx(it, "c2", "Coefficient of h squared") + m("h^2") + "</div>" + slope;
    else if (it.frame === "rat") h = '<div class="tg-frow">' + qlab + '<span class="frac tg-ff"><span class="fn">' + bx(it, "n", "Top") + '</span><span class="fd">' + bx(it, "k", "Number in front of the bracket") + '<span class="m">(</span>' + bx(it, "c", "Number added to h") + ' <span class="m">+ <i>h</i>)</span></span></span></div>' + slope;
    else if (it.frame === "root") h = '<div class="tg-frow">' + qlab + '<span class="frac tg-ff"><span class="fn">' + bx(it, "n", "Top") + '</span><span class="fd"><span class="m"><span class="rad"><span class="rs">√</span><span class="rb">' + bx(it, "r", "Number under the root, added to h") + " + <i>h</i></span></span> +</span> " + bx(it, "c", "Number added to the root") + "</span></span></div>" + slope;
    else if (it.frame === "b") h = '<div class="tg-frow">' + m("b =") + " " + bx(it, "m", "b") + "</div>";
    else if (it.frame === "pts") {
      var n = Math.max(1, x.v.n || 1);
      for (var i = 0; i < n; i++) h += '<div class="tg-frow tg-pt"><span class="tg-flab">Point ' + (i + 1) + ":</span> <span class=\"m\">(</span>" + bx(it, "x" + i, "Point " + (i + 1) + ": x") + '<span class="m">,</span> ' + bx(it, "y" + i, "Point " + (i + 1) + ": y") + '<span class="m">)</span></div>';
      if (!x.solved) h += '<div class="q-actions tg-pb"><button type="button" class="btn ghost sm" data-pt="add" data-k="' + it.id + 'padd"' + (n >= 4 ? " disabled" : "") + '>+ point</button><button type="button" class="btn ghost sm" data-pt="del" data-k="' + it.id + 'pdel"' + (n <= 1 ? " disabled" : "") + ">− point</button></div>";
    }
    return h;
  }
  function paintFrame(it){ var fr = $('[data-dq="' + it.id + '"] .tg-fr', host); MV.keepFocus(fr, function(){ fr.innerHTML = frame(it); }); }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-dq="' + it.id + '"] .tg-dc', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", (msgs[it.id].bad ? "<strong>✗ Not quite.</strong> " : "") + msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  a.items.forEach(function(it){ paintFrame(it); paintCtl(it); });
  // value of the student's quotient at h = t (Q rational), or null
  function testMsg(it, val, want, t){ return md("Test it at `h = " + t + "`: the quotient should be `{f(" + nsrc(it.a + t) + ") - f(" + nsrc(it.a) + ")}/{" + t + "} = " + Qx.src(want) + "`, but yours gives `" + Qx.src(val) + "`."); }
  function judgeQuo(it, v, Aq){
    var i, k;
    if (it.frame === "lin" || it.frame === "quad") {
      var n = it.frame === "lin" ? 2 : 3, c = [];
      for (i = 0; i < n; i++) { k = pq(v["c" + i]); if (k === null) return { err:md("Fill in every box of the quotient. Type 1 for `h` on its own, or 0 for a missing term.") }; if (k === undefined) return { err:"Use whole numbers or fractions such as −1/4 in the boxes." }; c.push(k); }
      if (c.every(function(x, j){ return Qx.eq(x, Qx.of(Aq[j])); })) return { ok:true };
      var f = DF[it.fn], valAt = function(t){ var s = { n:0, d:1 }, p = { n:1, d:1 }; c.forEach(function(x){ s = Qx.add(s, Qx.mul(x, p)); p = Qx.mul(p, Qx.of(t)); }); return s; };
      var tests = [1, -1, 2];
      for (i = 0; i < tests.length; i++) { var t = tests[i], want = Qx.of((f(it.a + t) - f(it.a)) / t), got = valAt(t); if (!Qx.eq(want, got)) return { ok:false, msg:testMsg(it, got, want, t) }; }
      return { ok:false, msg:"Your quotient agrees with the true one at a few values of " + m("h") + ", but not as an expression. Expand again, carefully." };
    }
    if (it.frame === "rat") {
      var nn = pq(v.n), kk = pq(v.k), cc = pq(v.c);
      if (nn === null || kk === null || cc === null) return { err:"Fill in every box of the quotient." };
      if (nn === undefined || kk === undefined || cc === undefined) return { err:"Use whole numbers or fractions such as −1/4 in the boxes." };
      if (!kk.n) return { err:"The number in front of the bracket can’t be 0." };
      if (Qx.eq(cc, Qx.of(Aq.c)) && Qx.eq(Qx.div(nn, kk), Qx.of(Aq.n, Aq.k))) return { ok:true };
      var w1 = Qx.of(-1, 6), g1 = Qx.div(nn, Qx.mul(kk, Qx.add(cc, Qx.of(1))));
      if (!Qx.eq(w1, g1)) return { ok:false, msg:md("Test it at `h = 1`: the quotient should be `{f(2) - f(1)}/{1} = {1}/{3} - {1}/{2} = -{1}/{6}`, but yours gives `" + Qx.src(g1) + "`.") };
      return { ok:false, msg:md("Combine `{1}/{2 + h} - {1}/{2}` over the common denominator `2(2 + h)`.") };
    }
    if (it.frame === "root") {
      var n2 = pq(v.n), r2 = pq(v.r), c2 = pq(v.c);
      if (n2 === null || r2 === null || c2 === null) return { err:"Fill in every box of the quotient." };
      if (n2 === undefined || r2 === undefined || c2 === undefined) return { err:"Use whole numbers or fractions in the boxes." };
      if (Qx.eq(r2, Qx.of(Aq.r)) && Qx.eq(c2, Qx.of(Aq.c)) && Qx.eq(n2, Qx.of(Aq.n))) return { ok:true };
      if (!Qx.eq(r2, Qx.of(Aq.r))) return { ok:false, msg:md("The number under the root comes from `f(9 + h) = √{9 + h}`.") };
      if (!Qx.eq(c2, Qx.of(Aq.c))) return { ok:false, msg:md("Multiply by the conjugate `√{9 + h} + 3`: the 3 is `√9 = f(9)`.") };
      return { ok:false, msg:md("After rationalizing, the top is `(9 + h) - 9 = h`, which cancels the `h` below and leaves 1.") };
    }
    return { ok:true };
  }
  function judgeM(it, v, target){
    var g = pq(v.m);
    if (g === null) return { err:it.frame === "b" ? md("Type a value for `b`.") : "Fill in the tangent slope too: a whole number or a fraction such as −1/4." };
    if (g === undefined) return { err:"Use a whole number or a fraction such as −1/4." };
    var tq = Qx.raw(target); tq = Qx.of(tq.n, tq.d);
    if (Qx.eq(g, tq)) return { ok:true };
    var nw = (it.wrong || []).filter(function(w){ if (w.m == null) return false; var q = Qx.raw(w.m); return q && Qx.eq(Qx.of(q.n, q.d), g); })[0];
    if (nw) return { ok:false, msg:nw.fb };
    if (it.frame === "b") return { ok:false, msg:md("Find the slope of the tangent at `x = 1` in terms of `b`, then set it equal to 7.") };
    return { ok:false, msg:md("Let `h → 0` in your simplified quotient: what number is left?") };
  }
  function judgePts(it, v, ans){
    var n = Math.max(1, v.n || 1), pts = [], i;
    for (i = 0; i < n; i++) {
      var xs = pq(v["x" + i]), ys = pq(v["y" + i]);
      if (xs === null && ys === null) continue;
      if (xs == null || ys == null) return { err:"Fill in both coordinates of point " + (i + 1) + ", or clear it." };
      pts.push([xs, ys]);
    }
    if (!pts.length) return { err:"Enter at least one point." };
    var key = function(p){ return qtx(p[0]) + "," + qtx(p[1]); }, seen = {}, uniq = pts.filter(function(p){ var k2 = key(p); if (seen[k2]) return false; seen[k2] = 1; return true; });
    for (i = 0; i < uniq.length; i++) {
      var X = uniq[i][0], Y = uniq[i][1], fx = Qx.sub(Qx.mul(X, X), Qx.mul(Qx.of(2), X));
      var pt = "(" + qtx(X) + ", " + qtx(Y) + ")";
      if (!Qx.eq(Y, fx)) return { ok:false, msg:md(pt + " isn’t on `y = x^2 - 2x`.") };
      var M = Qx.sub(Qx.mul(Qx.of(2), X), Qx.of(2));
      var atTwo = Qx.add(Qx.mul(M, Qx.sub(Qx.of(2), X)), fx);
      if (!Qx.eq(atTwo, Qx.of(-1))) return { ok:false, msg:md("The tangent at " + pt + " has slope " + qtx(M) + ", and at `x = 2` it’s at height " + qtx(atTwo) + ", not −1.") };
    }
    var hits = ans.pts.filter(function(p){ return uniq.some(function(u){ return Qx.eq(u[0], Qx.of(p[0])) && Qx.eq(u[1], Qx.of(p[1])); }); }).length;
    if (hits === ans.pts.length && uniq.length === ans.pts.length) return { ok:true };
    var only = (it.wrong || []).filter(function(w){ return w.only; })[0];
    return { ok:false, msg:only ? only.fb : "There’s another point." };
  }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it);
    if (it.frame === "pts") return judgePts(it, x.v, ans);
    if (it.frame === "b") return judgeM(it, x.v, ans.m);
    var qr = judgeQuo(it, x.v, ans.q); if (qr.err) return qr;
    var mr = judgeM(it, x.v, ans.m); if (mr.err) return mr;
    if (qr.ok && mr.ok) return { ok:true };
    return { ok:false, msg:[qr.ok ? "" : qr.msg, mr.ok ? (qr.ok ? "" : "Your tangent slope is right.") : mr.msg].filter(Boolean).join(" ") };
  }
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.v) return;
    var box = t.closest("[data-dq]"); if (!box) return;
    ist(box.dataset.dq).v[t.dataset.v] = t.value; api.save();
  });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.v) return; var box = e.target.closest("[data-dq]"); var b = box && box.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-dq]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.dq; })[0], x = ist(it.id);
    if (b.dataset.pt) { var n = Math.max(1, x.v.n || 1); if (b.dataset.pt === "add") x.v.n = Math.min(4, n + 1); else { x.v.n = Math.max(1, n - 1); delete x.v["x" + (n - 1)]; delete x.v["y" + (n - 1)]; } api.save(); paintFrame(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintFrame(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:r.msg + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: tangent through a target ----------
var task = (function(){
  var api, plot;
  function read(){
    var s = api ? api.S : {};
    function g(k){ var t = String(s[k] == null ? "" : s[k]).trim(), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -6 && v <= 6 ? v : null; }
    var a = g("a"), b = g("b"), c = g("c");
    return { a:a, b:b, c:c, valid:a !== null && b !== null && c !== null };
  }
  function pSrc(d){ return "y = " + polySrc([d.c, d.b, 1], "x", true); }
  function draw(){
    var d = read();
    if (!d.valid) { plot.draw({ view:{ xmin:-6, xmax:6, ymin:-8, ymax:8 }, points:[{ x:0, y:-3, r:6, open:true, color:css("--ink"), label:"target (0, −3)" }], describe:"Empty graph with the target point (0, −3). Enter whole numbers for a, b and c." }); return; }
    var f = function(x){ return x * x + d.b * x + d.c; }, M = 2 * d.a + d.b, ya = f(d.a), vx = -d.b / 2, vy = f(vx);
    var lo = Math.min(-4, d.a - 2.5, vx - 3), hi = Math.max(4, d.a + 2.5, vx + 3), ys = [-3, ya, vy, 0], y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), span = Math.max(8, y1 - y0), pad = span * 0.2;
    var v = { xmin:lo, xmax:hi, ymin:y0 - pad, ymax:y1 + pad };
    plot.draw({ view:v, curves:[{ f:f, color:css("--pen"), width:3, arrows:true }], lines:[{ p:[d.a, ya], q:[d.a + 1, ya + M], color:css("--ink"), width:2 }],
      points:[{ x:vx, y:vy, r:4, color:css("--ink-2"), label:"vertex", below:true }, { x:0, y:-3, r:6, open:true, color:css("--ink"), label:"target (0, −3)" }, { x:d.a, y:ya, r:5.5, color:css("--ink"), label:"x = " + ntx(d.a), below:false }],
      describe:"Graph of " + MV.plain(m(pSrc(d))) + " with its tangent at x = " + ntx(d.a) + " (slope " + ntx(M) + ", y-intercept " + ntx(d.c - d.a * d.a) + "), the vertex at x = " + ntx(vx) + " and the target (0, −3)." });
  }
  function readout(){
    var d = read(), el = $("#tt-read"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Enter whole numbers from −6 to 6 for ' + m("a") + ", " + m("b") + " and " + m("c") + ".</dd></div>"; return; }
    var M = 2 * d.a + d.b, k = d.c - d.a * d.a;
    el.innerHTML = MV.readoutHTML([["Parabola", m(pSrc(d))], ["Tangent at " + m("x = " + nsrc(d.a)), m(lineSrc(M, k)) + " (slope " + ntx(M) + ")"], ["Vertex", "at " + m("x = " + nsrc(-d.b / 2))]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.a == null) { a.S.a = "1"; a.S.b = "0"; a.S.c = "0"; }
      inp.innerHTML = '<div class="inrow">' + ["a", "b", "c"].map(function(k){ return '<label for="tt-' + k + '"><span>' + m(k) + ' <span class="tiny muted">(−6 to 6)</span></span><input id="tt-' + k + '" data-tt="' + k + '" type="number" min="-6" max="6" step="1" autocomplete="off" value="' + MV.esc(a.S[k]) + '"></label>'; }).join("") + "</div>";
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="tt-plot" role="img" aria-label="Your parabola and tangent"></canvas></div><dl class="read" id="tt-read" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#tt-plot"), { xmin:-6, xmax:6, ymin:-8, ymax:8 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tt; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); a.update(); });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers from −6 to 6 for a, b and c."; },
    checks:function(d){ if (!d.valid) return [false, false, false]; return [2 * d.a + d.b === 2, d.c - d.a * d.a === -3, d.b > 0]; },
    key:function(d){ return d.a + "," + d.b + "," + d.c; },
    label:function(k){ return "(" + k.split(",").map(function(v){ return ntx(+v); }).join(", ") + ")"; },
    text:function(k){ var p = k.split(","); return "a = " + ntx(+p[0]) + ", b = " + ntx(+p[1]) + ", c = " + ntx(+p[2]); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ simp:simp },
  task:task
});
})();
