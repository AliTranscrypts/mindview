// MCV4U 21 Critical Points and the First Derivative Test: hero (a corner, a smooth peak, a cusp and a flat point get their
// tangents, sign chips and labels), Critical point classifier (Explore: V5 linked f / f′ panels with a probe, Zoom ×1–×1000,
// a V11 sign chart builder in Classify mode, Build mode for a cubic), Test it (Part 3: factor boxes and V11 test tables for a
// polynomial and two rational functions; "run it backwards" sketch picker with a vertical shift), Find and design (Practice 2,
// V8 boxes) and the "Design the derivative" task (live V11 chart and sketch of f).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q, rpow = MV.mcv.rpow;
function m(s){ return MV.m(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function asc(a, b){ return a - b; }
// placeholders #1, #2 (they survive backtick math, unlike {x})
function tpl(s, a){ return String(s).replace(/#(\d)/g, function(_, k){ return a[k - 1] != null ? a[k - 1] : "#" + k; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function xt(x){ return num(r9(x), 2); }
function end(v){ return v === -Infinity ? MINUS + "∞" : v === Infinity ? "∞" : xt(v); }
function ivTxt(a, b){ return "(" + end(a) + ", " + end(b) + ")"; }
function sgn(v){ return v > 1e-12 ? 1 : v < -1e-12 ? -1 : 0; }
function sgTxt(s){ return s > 0 ? "+" : s < 0 ? MINUS : "0"; }
// m() source of a value that is a fraction with a small denominator ("-{2}/{3}", "5"), else null
function fracSrc(v){
  if (!isFinite(v)) return null;
  for (var d = 1; d <= 12; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return d === 1 ? String(n) : (n < 0 ? "-" : "") + "{" + Math.abs(n) + "}/{" + d + "}"; }
  return null;
}
function valHTML(v){ var s = fracSrc(v); return s != null ? m(s) : "≈ " + num(v, 2); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function has(list, x){ return list.some(function(v){ return near(v, x); }); }
function kindAt(d, x){ var e = 1e-4, l = sgn(d(x - e)), r = sgn(d(x + e)); return l > 0 && r < 0 ? "max" : l < 0 && r > 0 ? "min" : "neither"; }
var KSHORT = { max:"max", min:"min", neither:"neither" };
function probeLine(ctx, p, x){
  var X = p.X(x); if (X < -2 || X > p.W + 2) return;
  ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
}
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "center"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "left" ? X : align === "right" ? X - w : X - w / 2;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 4, Y - 10, w + 8, 20); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
function diamond(ctx, X, Y, r, stroke, filled){
  ctx.save(); ctx.beginPath(); ctx.moveTo(X, Y - r); ctx.lineTo(X + r, Y); ctx.lineTo(X, Y + r); ctx.lineTo(X - r, Y); ctx.closePath();
  ctx.fillStyle = filled ? stroke : css("--sheet"); ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = filled ? css("--sheet") : stroke; ctx.stroke();
  if (filled) { ctx.lineWidth = 1.2; ctx.strokeStyle = stroke; ctx.beginPath(); ctx.moveTo(X, Y - r - 1.5); ctx.lineTo(X + r + 1.5, Y); ctx.lineTo(X, Y + r + 1.5); ctx.lineTo(X - r - 1.5, Y); ctx.closePath(); ctx.stroke(); }
  ctx.restore();
}
// edge arrow with the value when the probe's point is above or below the window (from MCV4U 07)
function edgeArrow(ctx, p, x, y, col){
  var v = p.v, X = p.X(x), up = y > v.ymax; if (!isFinite(y) || (y <= v.ymax && y >= v.ymin)) return;
  var Y = up ? 4 : p.H - 4, s = 8;
  ctx.save(); ctx.fillStyle = col; ctx.beginPath();
  if (up) { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y + s * 1.4); ctx.lineTo(X + s, Y + s * 1.4); } else { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y - s * 1.4); ctx.lineTo(X + s, Y - s * 1.4); }
  ctx.closePath(); ctx.fill(); ctx.font = ui(13); ctx.textAlign = X > p.W - 70 ? "right" : "left"; ctx.textBaseline = up ? "top" : "bottom";
  ctx.fillText(num(y, 2), X + (X > p.W - 70 ? -12 : 12), up ? 4 : p.H - 4); ctx.restore();
}
function slopeLabel(v){
  var c = Math.round(r9(v) * 100), exact = Math.abs(r9(v) * 100 - c) < 1e-6;
  return "slope " + (exact ? "= " : "≈ ") + (c < 0 ? MINUS : "") + (Math.abs(c) / 100).toFixed(2);
}
// sample g on [a, b] with the pen lifted at brk and the values at inc included exactly (corners stay sharp at any zoom)
function curvePts(g, a, b, brk, inc){
  var cuts = brk.filter(function(x){ return x > a && x < b; }).sort(asc), edges = [a].concat(cuts, [b]), out = [], n = 420, eps = (b - a) * 1e-7;
  for (var i = 0; i + 1 < edges.length; i++) {
    var lo = edges[i] + (i ? eps : 0), hi = edges[i + 1] - (i + 2 < edges.length ? eps : 0), xs = [], j;
    for (j = 0; j <= n; j++) xs.push(lo + (hi - lo) * j / n);
    (inc || []).forEach(function(x){ if (x > lo && x < hi) xs.push(x); });
    xs.sort(asc).forEach(function(x){ out.push([x, g(x)]); });
    if (i + 2 < edges.length) out.push([NaN, NaN]);
  }
  return out;
}
// polynomial helpers (coefficients lowest power first)
function pEval(p, x){ var v = 0; for (var i = p.length - 1; i >= 0; i--) v = v * x + p[i]; return v; }
function pMul(a, b){ var o = []; for (var i = 0; i < a.length + b.length - 1; i++) o.push(0); a.forEach(function(u, i){ b.forEach(function(w, j){ o[i + j] += u * w; }); }); return o; }
function pInt(p){ return [0].concat(p.map(function(c, i){ return c / (i + 1); })); }
function polySrc(p, v){
  v = v || "x"; var out = "";
  for (var i = p.length - 1; i >= 0; i--) {
    var c = p[i]; if (!c) continue;
    var a = Math.abs(c), body = i === 0 ? String(a) : (a === 1 ? "" : a) + v + (i > 1 ? "^" + i : "");
    out += out ? (c < 0 ? " - " : " + ") + body : (c < 0 ? "-" : "") + body;
  }
  return out || "0";
}

// =====================================================================================================================
// Functions F1–F8 (exact formulas; real cube roots for x^(1/3), x^(2/3)). crit: {x, t:"zero"|"dne", shape, y (m source)}.
function CR(x, t, shape, y){ return { x:x, t:t, shape:shape || null, y:y }; }
var FN = {
  F1:{ src:"f(x) = x^3 - 3x", dsrc:"f′(x) = 3x^2 - 3 = 3(x + 1)(x - 1)", f:function(x){ return x * x * x - 3 * x; }, d:function(x){ return 3 * x * x - 3; },
    crit:[CR(-1, "zero", null, "2"), CR(1, "zero", null, "-2")], nd:[], y:[-5, 5], dy:[-5, 16] },
  F2:{ src:"f(x) = x^3", dsrc:"f′(x) = 3x^2", f:function(x){ return x * x * x; }, d:function(x){ return 3 * x * x; },
    crit:[CR(0, "zero", null, "0")], nd:[], y:[-8, 8], dy:[-3, 16] },
  F3:{ src:"f(x) = |x^2 - 4|", f:function(x){ return Math.abs(x * x - 4); }, d:function(x){ var u = x * x - 4; return Math.abs(u) < 1e-12 ? NaN : 2 * x * (u > 0 ? 1 : -1); },
    crit:[CR(-2, "dne", "corner", "0"), CR(0, "zero", null, "4"), CR(2, "dne", "corner", "0")], sl:{ "-2":[-4, 4], "2":[-4, 4] }, nd:[], y:[-2, 10], dy:[-10, 10] },
  F4:{ src:"f(x) = x^{2/3}", dsrc:"f′(x) = {2}/{3}x^{-1/3} = {2}/{3∛x}", f:function(x){ return rpow(x, 2, 3); }, d:function(x){ return x === 0 ? NaN : 2 / (3 * Math.cbrt(x)); },
    crit:[CR(0, "dne", "cusp", "0")], nd:[], y:[-1, 3.2], dy:[-3, 3] },
  F5:{ src:"f(x) = x^{1/3}", dsrc:"f′(x) = {1}/{3}x^{-2/3} = {1}/{3∛{x^2}}", f:function(x){ return Math.cbrt(x); }, d:function(x){ return x === 0 ? NaN : 1 / (3 * Math.cbrt(x * x)); },
    crit:[CR(0, "dne", "vtan", "0")], nd:[], y:[-2.2, 2.2], dy:[-0.6, 3] },
  F6:{ src:"f(x) = x^4 - 4x^3", dsrc:"f′(x) = 4x^3 - 12x^2 = 4x^2(x - 3)", f:function(x){ return x * x * x * x - 4 * x * x * x; }, d:function(x){ return 4 * x * x * (x - 3); },
    crit:[CR(0, "zero", null, "0"), CR(3, "zero", null, "-27")], nd:[], y:[-32, 20], dy:[-40, 40] },
  F7:{ src:"f(x) = x + {4}/{x}", dsrc:"f′(x) = 1 - {4}/{x^2} = {(x - 2)(x + 2)}/{x^2}", f:function(x){ return x === 0 ? NaN : x + 4 / x; }, d:function(x){ return x === 0 ? NaN : 1 - 4 / (x * x); },
    crit:[CR(-2, "zero", null, "-4"), CR(2, "zero", null, "4")], nd:[0], y:[-10, 10], dy:[-8, 3] },
  F8:{ src:"f(x) = x^{2/3}(x - 5)", dsrc:"f′(x) = {5}/{3}x^{2/3} - {10}/{3}x^{-1/3} = {5(x - 2)}/{3∛x}", f:function(x){ return rpow(x, 2, 3) * (x - 5); }, d:function(x){ return x === 0 ? NaN : 5 * (x - 2) / (3 * Math.cbrt(x)); },
    crit:[CR(0, "dne", "cusp", "0"), CR(2, "zero", null, "-3∛4")], nd:[], y:[-8, 4], dy:[-6, 6] }
};
FN.F3.dhtml = function(){ return m("f′(x) = 2x") + " when " + m("|x| > 2") + "; " + m("f′(x) = -2x") + " when " + m("|x| < 2"); };
// Build mode: f(x) = ax³ + bx² + cx + d with whole-number coefficients
function buildFn(B){
  var a = B.a, b = B.b, c = B.c, dd = B.d, crit = [], every = false;
  var f = function(x){ return ((a * x + b) * x + c) * x + dd; }, d = function(x){ return (3 * a * x + 2 * b) * x + c; };
  function push(r){ crit.push(CR(r9(r) === 0 ? 0 : r, "zero", null, null)); }
  if (a) {
    var D = 4 * b * b - 12 * a * c;
    if (D > 1e-12) { var s = Math.sqrt(D); [(-2 * b - s) / (6 * a), (-2 * b + s) / (6 * a)].sort(asc).forEach(push); }
    else if (Math.abs(D) <= 1e-12) push(-b / (3 * a));
  } else if (b) push(-c / (2 * b));
  else if (!c) every = true;
  return { src:"f(x) = " + polySrc([dd, c, b, a]), dsrc:"f′(x) = " + polySrc([c, 2 * b, 3 * a]), f:f, d:d, crit:crit, nd:[], every:every, y:[-4, 12], dy:[-12, 12], build:true };
}
function critAt(Fn, x){ return Fn.crit.filter(function(c){ return near(c.x, x, 1e-7); })[0] || null; }
function xHTML(x){ var s = fracSrc(x); return s != null ? m("x = " + s) : m("x") + " ≈ " + num(x, 2); }
function ptHTML(Fn, c){
  var xs = fracSrc(c.x), ys = c.y != null ? m(c.y) : valHTML(Fn.f(c.x));
  return "(" + (xs != null ? m(xs) : "≈ " + num(c.x, 2)) + ", " + ys + ")";
}

// =====================================================================================================================
// @component V11 signBuilder — an interactive derivative sign chart (MHF4U N11 / MCV4U V11 adapted for building; MCV4U 21):
// the student places the critical numbers (chips), picks the sign of f′ on each interval (+/− cycle buttons), the behaviour
// (↗/↘ cycle buttons, or automatic arrows) and classifies each critical number (local max / local min / neither). Points not
// in the domain are fixed columns ("not in the domain"). Check reports the first problem with a named message; done locks it.
//   signBuilder(host, { key, st (persisted {crit, sign, arrow, kind, done, tries}), T (texts), xs:[chip x-values],
//     truth:{ d(x), crit:[{x, t}], nd:[x] }, arrows:"auto"|"pick", tests:bool, testTxt:"`x = #1`", extraHTML(done),
//     extraCheck() -> null | msg, goodHTML, locked(), save(), onChange(), onSolved() }) -> { paint(), cols() }
var SG = ["", "+", "-"], AR = ["", "up", "down"], KD = ["", "max", "min", "neither"];
function nextOf(list, v){ return list[(list.indexOf(v || "") + 1) % list.length]; }
function ka(v){ return v === -Infinity ? "-i" : v === Infinity ? "i" : String(r9(v)); }
function midOf(a, b){ return !isFinite(a) && !isFinite(b) ? 0 : !isFinite(a) ? b - 1 : !isFinite(b) ? a + 1 : (a + b) / 2; }
function signBuilder(host, o){
  var st = o.st, T = o.T, tr = o.truth, fb = null;
  st.crit = Array.isArray(st.crit) ? st.crit : []; st.sign = st.sign || {}; st.arrow = st.arrow || {}; st.kind = st.kind || {};
  function cols(){
    var pts = st.crit.slice(); tr.nd.forEach(function(z){ if (!has(pts, z)) pts.push(z); }); pts.sort(asc);
    var b = [-Infinity].concat(pts, [Infinity]), out = [];
    for (var i = 0; i + 1 < b.length; i++) {
      out.push({ iv:true, a:b[i], b:b[i + 1], mid:midOf(b[i], b[i + 1]), key:ka(b[i]) + "|" + ka(b[i + 1]) });
      if (i < pts.length) out.push({ iv:false, x:pts[i], nd:has(tr.nd, pts[i]) && !has(st.crit, pts[i]), key:ka(pts[i]) });
    }
    return out;
  }
  function ptSign(c){
    if (has(tr.nd, c.x)) return T.und;
    var t = tr.crit.filter(function(q){ return near(q.x, c.x); })[0];
    return t ? (t.t === "zero" ? "0" : T.und) : T.notZero;
  }
  function locked(){ return !!(o.locked && o.locked()); }
  function paint(){
    var cs = cols(), done = !!st.done, lk = done || locked();
    var h = '<p class="tiny cp-chh">' + T.pick + '</p><div class="chips cp-xs" role="group" aria-label="' + MV.esc(MV.plain(T.pick)) + '">' + o.xs.map(function(x){
      var on = has(st.crit, x);
      return '<button type="button" class="chip' + (on ? " on" : "") + '" data-cx="' + x + '" data-k="' + o.key + "cx" + x + '" aria-pressed="' + on + '"' + (lk ? " disabled" : "") + ">" + m("x = " + x) + "</button>";
    }).join("") + "</div>";
    h += '<div class="tbl-wrap cp-scw"><table class="vt cp-sct"><caption class="vh">Sign chart of f′</caption><thead><tr><th scope="col">' + T.rowX + "</th>" +
      cs.map(function(c){ return '<th scope="col"' + (c.iv ? "" : ' class="cp-ptc"') + ">" + (c.iv ? ivTxt(c.a, c.b) : xt(c.x)) + "</th>"; }).join("") + "</tr></thead><tbody>";
    if (o.tests) h += '<tr class="cp-trow"><th scope="row">' + T.rowTest + "</th>" + cs.map(function(c){ return "<td>" + (c.iv ? tpl(o.testTxt, [xt(c.mid)]) : "") + "</td>"; }).join("") + "</tr>";
    h += '<tr><th scope="row">' + T.rowSign + "</th>" + cs.map(function(c){
      if (!c.iv) return '<td class="cp-pt">' + ptSign(c) + "</td>";
      var v = st.sign[c.key] || "";
      return '<td><button type="button" class="cp-sg' + (v ? " on" : "") + '" data-sg="' + c.key + '" data-k="' + o.key + "sg" + c.key + '" aria-label="' + MV.esc("Sign of f′ on " + ivTxt(c.a, c.b) + ": " + (v === "+" ? "plus" : v === "-" ? "minus" : "not chosen") + ". Activate to change.") + '"' + (lk ? " disabled" : "") + ">" + (v === "+" ? "+" : v === "-" ? MINUS : T.unset) + "</button></td>";
    }).join("") + "</tr>";
    h += '<tr class="cp-frow"><th scope="row">' + T.rowF + "</th>" + cs.map(function(c){
      if (c.iv) {
        if (o.arrows === "pick") {
          var a = st.arrow[c.key] || "";
          return '<td><button type="button" class="cp-ar' + (a ? " on" : "") + '" data-ar="' + c.key + '" data-k="' + o.key + "ar" + c.key + '" aria-label="' + MV.esc("Behaviour of f on " + ivTxt(c.a, c.b) + ": " + (a === "up" ? "increasing" : a === "down" ? "decreasing" : "not chosen") + ". Activate to change.") + '"' + (lk ? " disabled" : "") + ">" + (a === "up" ? "↗" : a === "down" ? "↘" : T.unset) + "</button></td>";
        }
        var s = st.sign[c.key];
        return '<td class="cp-auto">' + (s === "+" ? '<span aria-hidden="true">↗</span><span class="cp-w">increasing</span>' : s === "-" ? '<span aria-hidden="true">↘</span><span class="cp-w">decreasing</span>' : "") + "</td>";
      }
      if (c.nd) return '<td class="cp-pt">' + T.nd + "</td>";
      var k = st.kind[c.key] || "";
      return '<td><button type="button" class="cp-kd' + (k ? " on" : "") + '" data-kd="' + c.key + '" data-k="' + o.key + "kd" + c.key + '" aria-label="' + MV.esc("Classify x = " + xt(c.x) + ": " + (k ? T.kinds[k] : "not chosen") + ". Activate to change.") + '"' + (lk ? " disabled" : "") + ">" + (k ? T.kinds[k] : T.unset) + "</button></td>";
    }).join("") + "</tr></tbody></table></div>";
    h += '<p class="tiny muted cp-chhow">' + T.how + "</p>";
    if (o.extraHTML) h += o.extraHTML(done || locked());
    h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="bcheck" data-k="' + o.key + 'chk"' + (lk ? " disabled" : "") + ">" + T.check + "</button>" +
      '<button type="button" class="btn ghost sm" data-act="bclear" data-k="' + o.key + 'clr"' + (locked() ? " disabled" : "") + ">" + T.clear + "</button></div>";
    h += '<div class="cp-bfb">' + (done ? MV.fbHTML("good", o.goodHTML || T.good) : fb ? MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + fb) : "") + "</div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  function check(){
    var msg = null, cs, i, c;
    var ndHit = st.crit.filter(function(x){ return has(tr.nd, x); });
    if (ndHit.length) msg = tpl(T.mNd, [xt(ndHit[0])]);
    if (!msg) { var miss = tr.crit.filter(function(q){ return !has(st.crit, q.x); }); if (miss.length) msg = miss[0].t === "dne" ? T.mMissDne : tpl(T.mMissZero, [xt(miss[0].x)]); }
    if (!msg) { var ex = st.crit.filter(function(x){ return !tr.crit.some(function(q){ return near(q.x, x); }); }); if (ex.length) msg = tpl(T.mExtra, [xt(ex[0])]); }
    if (!msg) {
      cs = cols();
      for (i = 0; i < cs.length && !msg; i++) {
        c = cs[i]; if (!c.iv) continue;
        var s = st.sign[c.key], want = sgn(tr.d(c.mid)) > 0 ? "+" : "-";
        if (!s) msg = T.mSignBlank; else if (s !== want) msg = tpl(T.mSign, [ivTxt(c.a, c.b)]);
      }
      if (!msg && o.arrows === "pick") for (i = 0; i < cs.length && !msg; i++) {
        c = cs[i]; if (!c.iv) continue;
        var a = st.arrow[c.key];
        if (!a) msg = T.mArrowBlank; else if ((a === "up") !== (st.sign[c.key] === "+")) msg = T.mArrow;
      }
      for (i = 0; i < tr.crit.length && !msg; i++) {
        c = tr.crit[i];
        var k = st.kind[ka(c.x)], w = kindAt(tr.d, c.x);
        if (!k) msg = T.mKindBlank;
        else if (k !== w) msg = w === "neither" ? tpl(T.mNeither, [xt(c.x)]) : k === "neither" ? tpl(T.mExt, [xt(c.x)]) : w === "max" ? T.mMax : T.mMin;
      }
    }
    if (!msg && o.extraCheck) msg = o.extraCheck();
    if (msg) { fb = msg; st.tries = (st.tries || 0) + 1; } else { fb = null; st.done = true; }
    o.save(); paint();
    if (st.done && o.onSolved) o.onSolved(); else if (o.onChange) o.onChange();
    MV.focusFb(host);
  }
  function changed(){ o.save(); paint(); if (o.onChange) o.onChange(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || locked()) return;
    if (b.dataset.act === "bclear") { st.crit = []; st.sign = {}; st.arrow = {}; st.kind = {}; st.done = false; fb = null; changed(); return; }
    if (st.done) return;
    if (b.dataset.cx != null) {
      var x = +b.dataset.cx, i = st.crit.findIndex(function(v){ return near(v, x); });
      if (i >= 0) st.crit.splice(i, 1); else st.crit.push(x);
      st.crit.sort(asc); fb = null; changed(); return;
    }
    if (b.dataset.sg) { st.sign[b.dataset.sg] = nextOf(SG, st.sign[b.dataset.sg]); fb = null; changed(); return; }
    if (b.dataset.ar) { st.arrow[b.dataset.ar] = nextOf(AR, st.arrow[b.dataset.ar]); fb = null; changed(); return; }
    if (b.dataset.kd) { st.kind[b.dataset.kd] = nextOf(KD, st.kind[b.dataset.kd]); fb = null; changed(); return; }
    if (b.dataset.act === "bcheck") check();
  });
  paint();
  return { paint:paint, cols:cols };
}
// ------------------------------------------------- end of V11 signBuilder ---------------------------------------------------

// =====================================================================================================================
// @component V11 signChart (adapted from MCV4U 17) — a finished derivative sign chart: one row per factor, the sign row of f′
// and a behaviour row (↗ increasing / ↘ decreasing, the extremum named at each zero). Scrolls inside its box on phones.
//   signChartHTML({ rows:[{s (m source), f(x), z:[x]}], d(x), pts:[x], dLabel, caption })
function signChartHTML(o){
  var pts = o.pts.slice().sort(asc), b = [-Infinity].concat(pts, [Infinity]), cols = [], i;
  for (i = 0; i + 1 < b.length; i++) { cols.push({ iv:true, a:b[i], b:b[i + 1], mid:midOf(b[i], b[i + 1]) }); if (i < pts.length) cols.push({ iv:false, x:pts[i] }); }
  var h = '<div class="tbl-wrap cp-scw"><table class="vt cp-sct cp-static"><caption class="vh">' + MV.esc(o.caption || "Sign chart") + '</caption><thead><tr><th scope="col">' + m("x") + "</th>" +
    cols.map(function(c){ return '<th scope="col">' + (c.iv ? ivTxt(c.a, c.b) : xt(c.x)) + "</th>"; }).join("") + "</tr></thead><tbody>";
  h += o.rows.map(function(F){
    return '<tr><th scope="row">' + m(F.s) + "</th>" + cols.map(function(c){ return "<td>" + (c.iv ? sgTxt(sgn(F.f(c.mid))) : has(F.z, c.x) ? "0" : sgTxt(sgn(F.f(c.x)))) + "</td>"; }).join("") + "</tr>";
  }).join("");
  h += '<tr class="cp-drow"><th scope="row">' + o.dLabel + "</th>" + cols.map(function(c){ return "<td>" + (c.iv ? sgTxt(sgn(o.d(c.mid))) : "0") + "</td>"; }).join("") + "</tr>";
  h += '<tr class="cp-frow"><th scope="row">' + m("f") + "</th>" + cols.map(function(c){
    if (c.iv) { var up = o.d(c.mid) > 0; return '<td class="cp-auto"><span aria-hidden="true">' + (up ? "↗" : "↘") + '</span><span class="cp-w">' + (up ? "increasing" : "decreasing") + "</span></td>"; }
    var k = kindAt(o.d, c.x); return '<td class="cp-pt">' + (k === "max" ? "local max" : k === "min" ? "local min" : "neither") + "</td>";
  }).join("") + "</tr></tbody></table></div>";
  return h;
}
// ------------------------------------------------- end of V11 signChart -----------------------------------------------------

// ---------- hero: a corner, a smooth peak, a cusp and a flat point ----------
function sOf(u){ var v = Math.pow(Math.max(u, 0), 2 / 3); return 1 - (1 - v) * (1 - v); }
function heroF(x){
  if (x <= -4) return -1.5 * (x + 4);
  if (x <= -1.5) { var u = (x + 1.5) / 2.5; return 3 - 3 * u * u; }
  if (x <= 1) return 3 * sOf((1 - x) / 2.5);
  if (x <= 3.5) return 2 * sOf((x - 1) / 2.5);
  return 2 + 0.25 * Math.pow(x - 3.5, 3);
}
var HP = [{ x:-4, k:"min", sh:"corner", s:[-1, 1], sl:[-1.5, 2.4] }, { x:-1.5, k:"max", sh:"flat", s:[1, -1] }, { x:1, k:"min", sh:"cusp", s:[-1, 1] }, { x:3.5, k:"neither", sh:"flat", s:[1, 1] }];
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var V = { xmin:-6.3, xmax:6.3, ymin:-1.9, ymax:7 }, p = new MV.Plot(cv, V), st;
  var FIN = { draw:1, tan:4, chips:4, lab:4 };
  function cap(t){ if (f.cap) f.cap.textContent = t; }
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), xr = V.xmin + (V.xmax - V.xmin) * st.draw;
    var sc = { view:V, xLabel:"x", yLabel:"y", curves:[{ pts:curvePts(heroF, V.xmin, xr, [], [-4, -1.5, 1, 3.5]), color:pen, width:3 }], segments:[], points:[] };
    HP.forEach(function(q, i){
      if (i >= st.tan) return;
      var y = heroF(q.x);
      if (q.sh === "flat") sc.segments.push({ x1:q.x - 1.1, y1:y, x2:q.x + 1.1, y2:y, color:ink, width:2 });
      if (q.sh === "cusp") sc.segments.push({ x1:q.x, y1:-0.9, x2:q.x, y2:2.6, color:ink, width:2 });
    });
    sc.after = function(ctx, pl){
      ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
      var q0 = HP[0];
      if (st.tan > 0) {
        var X = pl.X(q0.x), Y = pl.Y(0), sx = pl.W / (V.xmax - V.xmin), sy = pl.H / (V.ymax - V.ymin);
        [[-sx, q0.sl[0] * sy], [sx, -q0.sl[1] * sy]].forEach(function(v){ var n = Math.hypot(v[0], v[1]); ctx.beginPath(); ctx.moveTo(X - v[0] / n * 26, Y - v[1] / n * 26); ctx.lineTo(X + v[0] / n * 62, Y + v[1] / n * 62); ctx.stroke(); });
      }
      ctx.restore();
      HP.forEach(function(q, i){
        if (i >= st.tan) return;
        var X = pl.X(q.x), Y = pl.Y(heroF(q.x)), lab = i < st.lab ? q.k : "critical", up = q.k !== "max";
        diamond(ctx, X, Y, 6.5, pen, i < st.lab);
        if (q.sh === "cusp") bgText(ctx, lab, X + 14, Y - 30, "left", ink, ui(13, 700));
        else bgText(ctx, lab, X, Y + (up ? -26 : 24), "center", ink, ui(13, 700));
        if (i < st.chips) {
          var yb = pl.Y(-1.25);
          [-1, 1].forEach(function(sd, j){
            var cx = X + sd * 22, s = q.s[j] > 0 ? "+" : MINUS;
            ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.strokeStyle = css("--f3"); ctx.lineWidth = 1.6; ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(cx - 11, yb - 11, 22, 22, 6); else ctx.rect(cx - 11, yb - 11, 22, 22);
            ctx.fill(); ctx.stroke(); ctx.fillStyle = ink; ctx.font = ui(16, 700); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, cx, yb + 1); ctx.restore();
          });
        }
      });
    };
    sc.describe = "Graph of a curve with four critical points. At x = −4 a corner (two one-sided tangents), signs − then +: a local minimum. At x = −1.5 a smooth peak with a horizontal tangent, signs + then −: a local maximum. At x = 1 a cusp with a vertical tangent, signs − then +: a local minimum. At x = 3.5 a flat point with a horizontal tangent, signs + and +: neither.";
    p.draw(sc);
  }
  p.render = draw;
  if (MV.reduceMotion) { st = FIN; draw(); cap("Corner: min. Peak: max. Cusp: min. Flat point: neither."); return; }
  st = { draw:0, tan:0, chips:0, lab:0 }; draw(); cap("");
  function stepK(k, n, gap, cb){ if (st[k] >= n) { cb(); return; } st[k]++; draw(); MV.wait(gap, function(){ stepK(k, n, gap, cb); }); }
  MV.wait(400, function(){
    MV.tween({ dur:2400, ease:function(t){ return t; }, step:function(t){ st.draw = t; draw(); }, done:function(){
      st.draw = 1; cap("Four critical points: the tangent is flat, or there is no single slope.");
      MV.wait(300, function(){ stepK("tan", 4, 520, function(){
        MV.wait(500, function(){ cap("The signs of f′ on each side decide."); stepK("chips", 4, 420, function(){
          MV.wait(400, function(){ stepK("lab", 4, 480, function(){ cap("Corner: min. Peak: max. Cusp: min. Flat point: neither."); }); });
        }); });
      }); });
    } });
  });
}

// ---------- Explore: Critical point classifier ----------
var ZL = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
var PSTART = { p1:{ fn:"F2", mode:"probe", px:-1.5 }, p2:{ fn:"F4", mode:"zoom", zp:0 }, p3:{ fn:"F7", mode:"probe", px:-3, hide:true }, p4:{ fn:"F3", mode:"zoom", zp:2 } };
function tc1Solved(){ var c = MV.S.chal && MV.S.chal.tc1; return !!(c && c.solved); }
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, RW = C.rows, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (!FN[S.fn] || (S.fn === "F8" && !tc1Solved())) S.fn = "F1";
  if (["probe", "zoom", "classify", "build"].indexOf(S.mode) < 0) S.mode = "probe";
  S.px = S.px || {}; S.zp = S.zp || {}; S.zi = S.zi || {}; S.cls = S.cls || {};
  if (!S.b || !["a", "b", "c", "d"].every(function(k){ return Number.isInteger(S.b[k]); })) S.b = { a:1, b:0, c:0, d:0 };
  var busy = false, hideAsym = false, zoomCur = null, stopAnim = null, bfn = null, bkey = "", chartFor = null, builder = null;
  host.innerHTML = '<div class="cp-ex"><div class="cp-main" data-mv="graph"><p class="eq-cap cp-eq" id="cx-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="cp-panels"><div class="plot-wrap"><canvas class="plot cp-top" id="cx-top" role="img" aria-label="Graph of f"></canvas></div><div class="plot-wrap"><canvas class="plot cp-low" id="cx-low" role="img" aria-label="Graph of f′"></canvas></div></div>' +
    '<div id="cx-probe"><label class="slider cp-psl"><span class="slider-top"><span>' + T.probeLabel + '</span><output id="cx-pout"></output></span><input type="range" id="cx-px" min="-5" max="5" step="0.05" value="-1.5" style="accent-color:var(--ink)"></label></div>' +
    '<div id="cx-zoom" hidden><p class="tiny cp-zh">' + T.zoomPick + '</p><div class="chips cp-zch" id="cx-zch" role="group" aria-label="' + MV.esc(MV.plain(T.zoomPick)) + '"></div>' +
    '<label class="slider cp-zsl"><span class="slider-top"><span>' + T.zoomLabel + '</span><output id="cx-zout"></output></span><input type="range" id="cx-zi" min="0" max="9" step="1" value="0" style="accent-color:var(--ink)"></label></div>' +
    '<p class="tiny muted cp-key">' + T.key + "</p></div>" +
    '<div class="cp-side"><div class="chips cp-fns" id="cx-fn" role="group" aria-label="Choose a function"></div><div id="cx-mode"></div><p class="tiny muted cp-how" id="cx-how"></p>' +
    '<div id="cx-build" hidden><p class="tiny cp-zh">' + T.buildLabel + "</p>" + ["a", "b", "c", "d"].map(function(k){
      return '<label class="slider cp-bsl"><span class="slider-top"><span>' + m(k) + '</span><output id="cx-bo-' + k + '"></output></span><input type="range" data-bk="' + k + '" min="-6" max="6" step="1" value="0" style="accent-color:var(--ink)" aria-label="' + k + '"></label>';
    }).join("") + "</div>" +
    '<dl class="read cp-read" id="cx-read" aria-live="polite"></dl></div>' +
    '<div class="cp-chartwrap" id="cx-chart" hidden></div></div>';
  var topCv = $("#cx-top", host), lowCv = $("#cx-low", host), topPlot = new MV.Plot(topCv, { xmin:-5, xmax:5, ymin:-5, ymax:5 }), lowPlot = new MV.Plot(lowCv, { xmin:-5, xmax:5, ymin:-5, ymax:5 });
  var chartHost = $("#cx-chart", host);
  function F(){
    if (S.mode !== "build") return FN[S.fn];
    var k = [S.b.a, S.b.b, S.b.c, S.b.d].join(","); if (k !== bkey) { bkey = k; bfn = buildFn(S.b); } return bfn;
  }
  function fkey(){ return S.mode === "build" ? "B" : S.fn; }
  function px(){ var v = S.px[fkey()]; return typeof v === "number" ? clamp(v, -5, 5) : -1.5; }
  function zp(){ var Fn = FN[S.fn], v = S.zp[S.fn]; return typeof v === "number" && has(Fn.crit.map(function(c){ return c.x; }), v) ? v : Fn.crit[0].x; }
  function zIdx(){ return clamp(S.zi[S.fn] | 0, 0, 9); }
  function zf(){ return zoomCur != null ? zoomCur : ZL[zIdx()]; }
  function zoomOn(){ return S.mode === "zoom"; }
  function probeX(){ return zoomOn() ? zp() : px(); }
  function clsSt(fn){ return S.cls[fn] || (S.cls[fn] = { crit:[], sign:{}, arrow:{}, kind:{}, done:false }); }
  function classified(){ return S.mode === "build" || !!(S.cls[S.fn] && S.cls[S.fn].done); }
  function views(){
    var Fn = F();
    if (zoomOn()) {
      var c = zp(), yc = Fn.f(c), hw = 2.5 / zf(), r = topCv.getBoundingClientRect(), k = r.width > 20 ? r.height / r.width : 0.625;
      return [{ xmin:c - hw, xmax:c + hw, ymin:yc - hw * k, ymax:yc + hw * k }, { xmin:c - hw, xmax:c + hw, ymin:Fn.dy[0], ymax:Fn.dy[1] }];
    }
    return [{ xmin:-5.3, xmax:5.3, ymin:Fn.y[0], ymax:Fn.y[1] }, { xmin:-5.3, xmax:5.3, ymin:Fn.dy[0], ymax:Fn.dy[1] }];
  }
  function marks(Fn){
    if (S.mode === "classify" && !clsSt(S.fn).done) return clsSt(S.fn).crit.filter(function(x){ return !has(Fn.nd, x); }).map(function(x){ return { x:x, filled:false }; });
    if (Fn.every) return [];
    var done = classified();
    return Fn.crit.map(function(c){ return { x:c.x, filled:done, label:done ? KSHORT[kindAt(Fn.d, c.x)] : null }; });
  }
  function drawStubs(ctx, pl, Fn, c){
    var X = pl.X(c.x), Y = pl.Y(Fn.f(c.x)), L = 60, v = pl.v, dirs;
    if (c.shape === "corner") {
      var s = Fn.sl[String(c.x)], sx = pl.W / (v.xmax - v.xmin), sy = pl.H / (v.ymax - v.ymin);
      dirs = [[-sx, s[0] * sy], [sx, -s[1] * sy]];
    } else {
      var dl = 0.04 * (v.xmax - v.xmin);
      dirs = [c.x - dl, c.x + dl].map(function(u){ return [pl.X(u) - X, pl.Y(Fn.f(u)) - Y]; });
    }
    ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 2.2; ctx.setLineDash([6, 5]); ctx.lineCap = "round";
    // a corner's one-sided tangents are drawn through the point, so the two different lines cross there; a cusp's are rays
    var back = c.shape === "corner" ? 0.8 : 0;
    dirs.forEach(function(d){ var n = Math.hypot(d[0], d[1]) || 1; ctx.beginPath(); ctx.moveTo(X - d[0] / n * L * back, Y - d[1] / n * L * back); ctx.lineTo(X + d[0] / n * L, Y + d[1] / n * L); ctx.stroke(); });
    ctx.restore();
  }
  function kindWord(k){ return T.local[k]; }
  function critTxt(Fn){
    if (Fn.every) return T.every;
    if (!Fn.crit.length) return T.noCrit;
    return Fn.crit.map(function(c){ return xHTML(c.x) + " (" + (c.t === "zero" ? T.zero : T.dne + "; " + T[c.shape]) + ")"; }).join("<br>");
  }
  function bounds(Fn){ var b = Fn.crit.map(function(c){ return c.x; }); Fn.nd.forEach(function(z){ if (!has(b, z)) b.push(z); }); return b.sort(asc); }
  function signTxt(Fn){
    if (Fn.every) return "0 for every " + m("x");
    var b = [-Infinity].concat(bounds(Fn), [Infinity]), out = [];
    for (var i = 0; i + 1 < b.length; i++) out.push(tpl(T.signOn, [sgTxt(sgn(Fn.d(midOf(b[i], b[i + 1])))), ivTxt(b[i], b[i + 1])]));
    return out.join(", ");
  }
  function clsTxt(Fn){
    if (Fn.every) return T.local.neither;
    if (!Fn.crit.length) return T.none;
    return Fn.crit.map(function(c){ var k = kindAt(Fn.d, c.x); return xHTML(c.x) + ": " + kindWord(k) + (k !== "neither" ? ", " + ptHTML(Fn, c) : ""); }).join("<br>");
  }
  function probeTxt(Fn, x){
    if (has(Fn.nd, x)) return tpl(T.probeNd, [xt(x)]);
    var d = Fn.d(x), cr = critAt(Fn, x);
    if (!isFinite(d)) return tpl(T.probeDne, [xt(x), cr ? T[cr.shape] : ""]);
    var s = fracSrc(r9(d));
    return s != null ? tpl(T.probeVal, [xt(x), m(s)]) : tpl(T.probeApprox, [xt(x), num(d, 2)]);
  }
  function describeTop(Fn, x){
    var s = "Graph of " + MV.plain(m(Fn.src)) + ".";
    if (zoomOn()) s += " Zoomed in ×" + num(zf(), 0) + " around x = " + xt(zp()) + ".";
    else if (has(Fn.nd, x)) s += " The probe is at x = " + xt(x) + ", which is not in the domain.";
    else { var d = Fn.d(x), cr = critAt(Fn, x); s += " Probe at x = " + xt(x) + (isFinite(d) ? ", " + slopeLabel(d) + "." : ": f′ does not exist (" + (cr ? T[cr.shape] : "") + ")."); }
    if (Fn.every) return s + " Every x is critical: f is constant.";
    if (Fn.crit.length) s += " Critical numbers: " + Fn.crit.map(function(c){ return "x = " + num(c.x, 2) + (c.t === "zero" ? " (f′ = 0" : " (f′ does not exist, " + T[c.shape]) + ")" + (classified() ? ", " + kindWord(kindAt(Fn.d, c.x)) : ""); }).join("; ") + ".";
    if (Fn.nd.length && !hideAsym) s += " x = " + Fn.nd.map(xt).join(", ") + " is not in the domain (vertical asymptote).";
    return s;
  }
  function draw(){
    var Fn = F(), V = views(), x = probeX(), pen = css("--pen"), ink = css("--ink"), f3 = css("--f3"), zoom = zoomOn();
    var dneX = Fn.crit.filter(function(c){ return c.t === "dne"; }).map(function(c){ return c.x; }), mk = marks(Fn);
    var sc = { view:V[0], xLabel:"x", yLabel:"f(x)", curves:[{ pts:curvePts(Fn.f, V[0].xmin, V[0].xmax, Fn.nd, Fn.crit.map(function(c){ return c.x; })), color:pen, width:3 }], lines:[], segments:[], points:[], labels:[] };
    if (zoom) sc.ticks = false;
    if (Fn.nd.length && !hideAsym) sc.asymptotes = Fn.nd.map(function(z){ return { x:z, label:"x = " + xt(z) }; });
    var nd = has(Fn.nd, x), cr = critAt(Fn, x), y = nd ? NaN : Fn.f(x), d = nd ? NaN : Fn.d(x), stub = null, tag;
    if (!nd) {
      if (isFinite(d)) { sc.lines.push({ p:[x, y], q:[x + 1, y + d], color:ink, width:2 }); tag = slopeLabel(d); }
      else if (cr && cr.shape === "vtan") { sc.segments.push({ x1:x, y1:V[0].ymin, x2:x, y2:V[0].ymax, color:ink, width:2 }); tag = T.vTan; }
      else if (cr) { stub = cr; tag = T.noTan; }
      if (y >= V[0].ymin && y <= V[0].ymax) sc.points.push({ x:x, y:y, r:6, color:ink, ring:true });
    }
    sc.after = function(ctx, pl){
      probeLine(ctx, pl, x);
      if (stub) drawStubs(ctx, pl, Fn, stub);
      mk.forEach(function(q){
        var yy = Fn.f(q.x), X = pl.X(q.x), Y = pl.Y(yy); if (!isFinite(Y) || X < -10 || X > pl.W + 10 || Y < -10 || Y > pl.H + 10) return;
        diamond(ctx, X, Y, 7, pen, q.filled);
        if (q.label) bgText(ctx, q.label, X, Y + (q.label === "max" ? -24 : 24), "center", ink, ui(12, 700));
      });
      if (nd) bgText(ctx, T.ndLabel, pl.X(x), 30, pl.X(x) > pl.W * 0.6 ? "right" : "left", ink, ui(13, 700));
      else if (tag) {
        var X = pl.X(x), Yc = pl.Y(clamp(y, pl.v.ymin, pl.v.ymax)), right = X > pl.W * 0.58;
        bgText(ctx, tag, X + (right ? -16 : 16), clamp(Yc - 26, 14, pl.H - 14), right ? "right" : "left", ink, ui(13, 700));
        edgeArrow(ctx, pl, x, y, ink);
      }
    };
    sc.describe = describeTop(Fn, x);
    topPlot.draw(sc);
    var s2 = { view:V[1], xLabel:"x", yLabel:"f′(x)", curves:[{ pts:curvePts(Fn.d, V[1].xmin, V[1].xmax, Fn.nd.concat(dneX), []), color:f3, width:2.6 }], points:[], labels:[] };
    if (zoom) s2.ticks = false;
    if (Fn.nd.length && !hideAsym) s2.asymptotes = Fn.nd.map(function(z){ return { x:z, label:"" }; });
    Fn.crit.filter(function(c){ return c.shape === "corner"; }).forEach(function(c){ s2.points.push({ x:c.x, y:Fn.d(c.x - 1e-7), r:5, open:true, color:f3 }, { x:c.x, y:Fn.d(c.x + 1e-7), r:5, open:true, color:f3 }); });
    if (isFinite(d) && d >= V[1].ymin && d <= V[1].ymax) s2.points.push({ x:x, y:d, r:5.5, color:f3, ring:true });
    s2.after = function(ctx, pl){
      probeLine(ctx, pl, x);
      mk.forEach(function(q){ var X = pl.X(q.x); if (X > -10 && X < pl.W + 10) diamond(ctx, X, pl.Y(0), 6, f3, q.filled); });
      if (isFinite(d)) edgeArrow(ctx, pl, x, d, f3);
    };
    s2.describe = "Graph of " + (Fn.dsrc ? MV.plain(m(Fn.dsrc)) : "f′") + "." + (nd ? " f′ is undefined at the probe." : isFinite(d) ? " At the probe, f′(" + xt(x) + ") " + (fracSrc(r9(d)) != null ? "= " : "≈ ") + num(d, 2) + "." : " f′ does not exist at the probe.");
    lowPlot.draw(s2);
  }
  topPlot.render = draw; lowPlot.render = draw;
  // ---- readout ----
  function paintRead(){
    var Fn = F(), rows = [], cls = classified(), hide = S.mode === "classify" && !cls;
    $("#cx-eq", host).innerHTML = m(Fn.src);
    rows.push([RW.f, m(Fn.src)]);
    rows.push([RW.d, Fn.dhtml ? Fn.dhtml() : m(Fn.dsrc)]);
    if (zoomOn()) { var c = zp(); rows.push([RW.zoom, tpl(T.zoomOn, [num(zf(), 0), "(" + xt(c) + ", " + m(critAt(Fn, c).y) + ")"])]); }
    else rows.push([RW.probe, probeTxt(Fn, probeX())]);
    rows.push([RW.crit, hide ? T.findIt : critTxt(Fn)]);
    rows.push([RW.nd, Fn.nd.length ? Fn.nd.map(function(z){ return tpl(T.ndRow, [xt(z)]); }).join("<br>") : T.none]);
    rows.push([RW.sign, cls ? signTxt(Fn) : T.notYet]);
    rows.push([RW.cls, cls ? clsTxt(Fn) : T.notYet]);
    $("#cx-read", host).innerHTML = MV.readoutHTML(rows);
  }
  // ---- controls ----
  function syncProbe(){
    var inp = $("#cx-px", host), x = px();
    if (+inp.value !== x) inp.value = x;
    $("#cx-pout", host).innerHTML = m("x = " + xt(x));
    inp.setAttribute("aria-valuetext", "x = " + xt(x)); inp.disabled = busy;
  }
  function paintCtrl(){
    var fnEl = $("#cx-fn", host), build = S.mode === "build", unlocked = tc1Solved();
    fnEl.hidden = build;
    MV.keepFocus(fnEl, function(){
      fnEl.innerHTML = C.fns.map(function(q){
        var on = q.id === S.fn, lock = q.lock && !unlocked;
        return '<button type="button" class="chip' + (on ? " on" : "") + '" data-fn="' + q.id + '" data-k="fn' + q.id + '" aria-pressed="' + on + '"' + (busy || lock ? " disabled" : "") + ">" + q.chip + (lock ? ' <span class="cp-lock">(' + q.lock + ")</span>" : "") + "</button>";
      }).join("");
    });
    var md = $("#cx-mode", host);
    MV.keepFocus(md, function(){ md.innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode") + "</div>"; });
    $$("[data-mode]", md).forEach(function(b){ b.disabled = busy; });
    $("#cx-how", host).innerHTML = C.modeHow[S.mode];
    $("#cx-probe", host).hidden = zoomOn(); syncProbe();
    var zw = $("#cx-zoom", host); zw.hidden = !zoomOn();
    if (zoomOn()) {
      var Fn = FN[S.fn], zc = $("#cx-zch", host), cur = zp();
      MV.keepFocus(zc, function(){
        zc.innerHTML = Fn.crit.map(function(c){ var on = near(c.x, cur); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-zc="' + c.x + '" data-k="zc' + c.x + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">(" + xt(c.x) + ", " + m(c.y) + ")</button>"; }).join("");
      });
      var zi = $("#cx-zi", host); if (+zi.value !== zIdx()) zi.value = zIdx(); zi.disabled = busy;
      zi.setAttribute("aria-valuetext", "×" + ZL[zIdx()]); $("#cx-zout", host).textContent = "×" + ZL[zIdx()];
    }
    $("#cx-build", host).hidden = !build;
    $$("[data-bk]", host).forEach(function(inp){ var k = inp.dataset.bk; if (+inp.value !== S.b[k]) inp.value = S.b[k]; inp.disabled = busy; $("#cx-bo-" + k, host).textContent = num(S.b[k]); inp.setAttribute("aria-valuetext", k + " = " + num(S.b[k])); });
  }
  // ---- Classify mode: the sign chart builder (and F8's □∛□ box) ----
  function valBoxHTML(lock){
    var v = clsSt("F8").val || {}, CT = T.chart;
    return '<div class="cp-val"><p class="tiny cp-zh">' + CT.valTitle + '</p><div class="cp-cube" role="group" aria-label="f(2) in the form a times the cube root of b">' + m("f(2) =") +
      '<input class="numin short" data-vk="c" data-k="vkc" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="the number in front of the cube root" value="' + MV.esc(v.c || "") + '"' + (lock ? " disabled" : "") + ">" +
      '<span class="cp-rad" aria-hidden="true">∛</span><input class="numin short cp-rin" data-vk="r" data-k="vkr" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="the number under the cube root" value="' + MV.esc(v.r || "") + '"' + (lock ? " disabled" : "") + "></div>" +
      '<p class="tiny muted">' + CT.valHow + "</p></div>";
  }
  function valJudge(){
    var v = clsSt("F8").val || {}, c = String(v.c || "").trim(), r = String(v.r || "").trim();
    if (!c && !r) return { empty:true };
    var cq = c ? Q.raw(c) : { n:1, d:1 }, rn = r ? Number(r.replace(/−/g, "-")) : 1;
    if (!cq || !Number.isInteger(rn) || rn < 1) return { ok:false };
    var J = MV.mcv.exact.judge({ num:[r ? { c:Q.of(cq.n, cq.d), r:rn, k:3 } : { c:Q.of(cq.n, cq.d), r:1, k:1 }], den:[{ c:{ n:1, d:1 }, r:1, k:1 }] },
      { num:MV.mcv.S.of([[-3, 4, 3]]), den:MV.mcv.S.of([[1]]) });
    return { ok:J.equal && J.simplified, equal:J.equal, msg:J.msg };
  }
  function valCheck(){ var J = valJudge(); if (J.empty) return T.chart.mVal; if (J.ok) return null; return J.equal && J.msg ? MV.md(J.msg) : T.chart.mValBad; }
  function paintChart(){
    if (S.mode !== "classify") { chartHost.hidden = true; if (chartFor) { chartHost.innerHTML = ""; chartFor = null; builder = null; } return; }
    chartHost.hidden = false;
    if (chartFor === S.fn && builder) { builder.paint(); return; }
    chartFor = S.fn;
    chartHost.innerHTML = '<div class="cp-chpart"><h3 class="cp-cht">' + T.chart.title + " for " + m(FN[S.fn].src) + '</h3><div class="cp-bhost"></div></div>';
    var Fn = FN[S.fn];
    builder = signBuilder($(".cp-bhost", chartHost), { key:"cx" + S.fn, st:clsSt(S.fn), T:T.chart, xs:[-4, -3, -2, -1, 0, 1, 2, 3, 4], truth:{ d:Fn.d, crit:Fn.crit, nd:Fn.nd },
      arrows:"auto", tests:false, extraHTML:S.fn === "F8" ? valBoxHTML : null, extraCheck:S.fn === "F8" ? valCheck : null,
      locked:function(){ return busy; }, save:api.save,
      onChange:function(){ paintRead(); draw(); MV.changed(); }, onSolved:function(){ paintRead(); draw(); MV.changed(); } });
  }
  chartHost.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.vk; if (!k) return;
    var st = clsSt("F8"); st.val = st.val || {}; st.val[k] = e.target.value; api.save(); MV.changed();
  });
  function paint(){ paintCtrl(); paintRead(); paintChart(); draw(); }
  // ---- events ----
  function setProbe(v){
    v = clamp(Math.round(v * 20) / 20, -5, 5); v = r9(v);
    if (v === px()) return;
    S.px[fkey()] = v; api.save(); syncProbe(); paintRead(); draw();
  }
  function zoomTo(i, dur, cb){
    var z0 = zf(), z1 = ZL[i]; S.zi[S.fn] = i;
    if (stopAnim) { stopAnim(); stopAnim = null; }
    stopAnim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ zoomCur = Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * t); paintRead(); draw(); },
      done:function(){ stopAnim = null; zoomCur = null; api.save(); paintCtrl(); paintRead(); draw(); if (cb) cb(); } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || busy) return;
    if (chartHost.contains(b)) return;
    if (b.dataset.fn) { if (S.fn !== b.dataset.fn) { if (stopAnim) { stopAnim(); stopAnim = null; zoomCur = null; } S.fn = b.dataset.fn; api.save(); paint(); MV.changed(); } return; }
    if (b.dataset.mode) { if (S.mode !== b.dataset.mode) { if (stopAnim) { stopAnim(); stopAnim = null; zoomCur = null; } S.mode = b.dataset.mode; api.save(); paint(); MV.changed(); } return; }
    if (b.dataset.zc != null) { S.zp[S.fn] = +b.dataset.zc; api.save(); paintCtrl(); paintRead(); draw(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (busy) return;
    if (t.id === "cx-px") { setProbe(+t.value); return; }
    if (t.id === "cx-zi") { zoomTo(+t.value, 300); $("#cx-zout", host).textContent = "×" + ZL[+t.value]; t.setAttribute("aria-valuetext", "×" + ZL[+t.value]); return; }
    if (t.dataset && t.dataset.bk) { S.b[t.dataset.bk] = +t.value; api.save(); paintCtrl(); paintRead(); draw(); MV.changed(); }
  });
  $("#cx-px", host).addEventListener("keydown", function(e){
    if (!e.shiftKey) return;
    var d = e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : 0;
    if (!d || busy) return; e.preventDefault(); setProbe(px() + d * 0.5);
  });
  [[topCv, topPlot, 0], [lowCv, lowPlot, 1]].forEach(function(q){
    var cv = q[0], pl = q[1], act = false;
    cv.style.touchAction = "pan-y";
    function xAt(e){ var r = cv.getBoundingClientRect(); return pl.xOf(e.clientX - r.left); }
    cv.addEventListener("pointerdown", function(e){
      if (busy) return;
      if (zoomOn()) {
        if (q[2]) return;
        var r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, Fn = FN[S.fn], best = null, bd = 30;
        Fn.crit.forEach(function(c){ var dd = Math.hypot(pl.X(c.x) - mx, pl.Y(Fn.f(c.x)) - my); if (dd < bd) { bd = dd; best = c.x; } });
        if (best != null && !near(best, zp())) { S.zp[S.fn] = best; api.save(); paintCtrl(); paintRead(); draw(); }
        return;
      }
      act = true; try { cv.setPointerCapture(e.pointerId); } catch (err) {}
      setProbe(xAt(e));
    });
    cv.addEventListener("pointermove", function(e){ if (act && !busy) setProbe(xAt(e)); });
    ["pointerup", "pointercancel"].forEach(function(t){ cv.addEventListener(t, function(){ act = false; }); });
  });
  paint();

  // ---- predictions ----
  function glide(a, b, dur, cb){
    stopAnim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ S.px[S.fn] = r9(Math.round((a + (b - a) * t) * 20) / 20); syncProbe(); paintRead(); draw(); },
      done:function(){ stopAnim = null; S.px[S.fn] = b; syncProbe(); paintRead(); draw(); if (cb) cb(); } });
  }
  // ---- challenges ----
  function stOf(fn){ var st = S.cls[fn]; return st && Array.isArray(st.crit) ? st : null; }
  function sameSet(a, b){ return a.length === b.length && b.every(function(x){ return has(a, x); }); }
  function chalTest(id, opt){
    var M = MS[id], st, kd;
    if (id === "tc1") {
      st = stOf("F6"); if (!st || !st.crit.length) return { ok:false, msg:M.fn };
      if (!sameSet(st.crit, [0, 3])) return { ok:false, msg:has(st.crit, 3) && !has(st.crit, 0) ? M.miss0 : M.crit };
      kd = st.kind || {};
      if (kd["0"] === "max" || kd["0"] === "min") return { ok:false, msg:M.zeroExt };
      if (kd["0"] !== "neither" || kd["3"] !== "min") return { ok:false, msg:M.kind };
      if (!(opt && opt.live)) setTimeout(paintCtrl, 0);       // F8 unlocks once the toolkit records the challenge
      return { ok:true };
    }
    if (id === "tc2") {
      if (!tc1Solved()) return { ok:false, msg:M.lock };
      st = stOf("F8"); if (!st || !st.crit.length) return { ok:false, msg:M.fn };
      if (!sameSet(st.crit, [0, 2])) return { ok:false, msg:sameSet(st.crit, [2]) ? M.only2 : M.crit };
      kd = st.kind || {};
      if (kd["0"] === "min") return { ok:false, msg:M.min0 };
      if (kd["0"] !== "max" || kd["2"] !== "min") return { ok:false, msg:M.kind };
      var J = valJudge();
      if (J.empty) return { ok:false, msg:M.val };
      if (!J.ok) return { ok:false, msg:J.equal && J.msg ? MV.md(J.msg) : M.valBad };
      return { ok:true };
    }
    if (id === "tc3") {
      var B = S.b;
      if (B.a === 1 && B.b === 0 && B.c === -3 && B.d === 4) return { ok:true };
      if (opt && opt.live) return { ok:false };
      if (B.a === 1 && B.b === 0 && B.c === -3) return { ok:false, msg:tpl(M.shift, [num(2 + B.d), B.d < 4 ? M.up : M.down]) };
      if (B.a < 0 && B.b === 0 && B.c === -3 * B.a) return { ok:false, msg:M.neg };
      if (B.a === 1 && B.b === 0 && B.c === -1) return { ok:false, msg:M.c1 };
      return { ok:false, msg:M.general };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stopAnim) { stopAnim(); stopAnim = null; }
        var P = PSTART[p.id] || PSTART.p1;
        busy = true; zoomCur = null; S.fn = P.fn; S.mode = P.mode; hideAsym = !!P.hide;
        if (P.px != null) S.px[P.fn] = P.px;
        if (P.zp != null) { S.zp[P.fn] = P.zp; S.zi[P.fn] = 0; }
        paint();
      },
      run:function(p, done){
        function fin(){ busy = false; hideAsym = false; zoomCur = null; api.save(); paint(); MV.changed(); done(); }
        if (p.id === "p1") glide(-1.5, 0, 1500, function(){ MV.wait(800, function(){ glide(0, 1.5, 1500, function(){ MV.wait(600, fin); }); }); });
        else if (p.id === "p3") glide(-3, 0, 2200, function(){ MV.wait(250, function(){ hideAsym = false; paintRead(); draw(); MV.wait(1400, fin); }); });
        else if (p.id === "p2" || p.id === "p4") MV.wait(300, function(){ zoomTo(9, 3600, function(){ MV.wait(800, fin); }); });
        else fin();
      }
    },
    challenge:chalTest
  };
}

// ---------- Part 3: Test it ----------
function f1(x){ return 3 * Math.pow(x, 4) - 4 * Math.pow(x, 3) - 12 * x * x + 5; }
function d1(x){ return 12 * x * (x - 2) * (x + 1); }
var R2 = {
  r1:{ f:function(x){ return x === 0 ? NaN : x + 4 / x; }, d:function(x){ return x === 0 ? NaN : (x - 2) * (x + 2) / (x * x); }, nd:[0],
    pts:[[-2, -4, "local max (−2, −4)"], [2, 4, "local min (2, 4)"]], view:{ xmin:-6.5, xmax:6.5, ymin:-11, ymax:11 } },
  r2:{ f:function(x){ return x / (x * x + 4); }, d:function(x){ return (4 - x * x) / Math.pow(x * x + 4, 2); }, nd:[],
    pts:[[-2, -0.25, "local min (−2, −1/4)"], [2, 0.25, "local max (2, 1/4)"]], view:{ xmin:-7, xmax:7, ymin:-0.42, ymax:0.42 } }
};
var SK = {
  a:function(x){ return Math.pow(x, 4) / 4 - 1.5 * x * x - 2 * x; },
  b:function(x){ return x * x * x / 3 - x * x / 2 - 2 * x; },
  c:function(x){ return -(x * x * x / 3 - x * x / 2 - 2 * x); },
  d:function(x){ return Math.pow(x, 4) / 4 - Math.pow(x, 3) / 2 - 0.75 * x * x + x; }
};
function autoView(g, a, b, pad){
  var lo = Infinity, hi = -Infinity; for (var i = 0; i <= 200; i++) { var y = g(a + (b - a) * i / 200); if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }
  var p = (hi - lo || 1) * (pad == null ? 0.12 : pad); return { xmin:a, xmax:b, ymin:lo - p, ymax:hi + p };
}
function part3(host, api){
  var S = api.S, C = api.content, T = Object.assign({}, MV.C.explore.txt.chart, C.chart);
  S.s1 = S.s1 || {}; S.s1.f = S.s1.f || {}; S.s1.chart = S.s1.chart || {};
  S.s2 = S.s2 || {}; S.s2.tab = S.s2.tab === "r2" ? "r2" : "r1"; S.s2.r1 = S.s2.r1 || {}; S.s2.r2 = S.s2.r2 || {};
  S.s3 = S.s3 || {}; S.s3.C = Number.isInteger(S.s3.C) ? S.s3.C : 0;
  var A = C.s1, B2 = C.s2, C3 = C.s3;
  function fin(k){ return '<input class="numin short cp-fin" data-fk="' + k + '" data-k="fk' + k + '" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="' + { a:"the number in front of x", b:"the number subtracted from x", c:"the number added to x" }[k] + '" value="' + MV.esc(S.s1.f[k] || "") + '">'; }
  var order = MV.shuffle(C3.sketches, "mcv4u21-sketch");
  host.innerHTML =
    '<div class="part cp-st" data-st="s1"><h3>' + A.title + "</h3><p>" + A.text + "</p><p>" + A.step1 + "</p>" +
      '<div class="cp-fac" role="group" aria-label="Factor f′(x)">' + A.f.pre + " " + fin("a") + " " + A.f.mid1 + " " + fin("b") + " " + A.f.mid2 + " " + fin("c") + " " + A.f.post + "</div>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-act="fcheck" data-k="fcheck">' + A.check + '</button></div><div class="cp-ffb"></div>' +
      '<div class="cp-s1b" hidden><p>' + A.step2 + '</p><div class="cp-bhost" id="p3-b1"></div></div>' +
      '<div class="cp-res" id="p3-r1" hidden><div class="plot-wrap"><canvas class="plot wide" id="p3-g1" role="img" aria-label="' + MV.esc(MV.plain(A.graph)) + '"></canvas></div>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + A.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div>" +
      signChartHTML({ rows:[{ s:"12x", f:function(x){ return 12 * x; }, z:[0] }, { s:"x - 2", f:function(x){ return x - 2; }, z:[2] }, { s:"x + 1", f:function(x){ return x + 1; }, z:[-1] }], d:d1, pts:[-1, 0, 2], dLabel:m("f′(x)"), caption:"Sign chart of f′(x) = 12x(x − 2)(x + 1)" }) +
      "</details></div></div>" +
    '<div class="part cp-st" data-st="s2"><h3>' + B2.title + '</h3><div class="seg-wrap" id="p3-tabs"></div><p id="p3-t2"></p><div class="cp-bhost" id="p3-b2"></div>' +
      '<div class="cp-res" id="p3-r2" hidden><div class="plot-wrap"><canvas class="plot wide" id="p3-g2" role="img" aria-label=""></canvas></div><div id="p3-call"></div></div><p class="tiny muted" id="p3-gh">' + B2.graphHow + "</p></div>" +
    '<div class="part cp-st" data-st="s3"><h3>' + C3.title + "</h3><p>" + C3.text + '</p><div class="cp-sks" role="group" aria-label="Four sketches">' + order.map(function(s){
      return '<button type="button" class="cp-sk" data-sk="' + s.id + '" data-k="sk' + s.id + '" aria-label="' + MV.esc(s.aria) + '" aria-pressed="false"><canvas class="plot" aria-hidden="true"></canvas></button>';
    }).join("") + '</div><div class="cp-skfb" aria-live="polite"></div>' +
      '<div class="cp-shift" hidden><label class="slider"><span class="slider-top"><span>' + C3.shift + ' (' + m("C") + ')</span><output id="p3-co"></output></span><input type="range" id="p3-c" min="-6" max="6" step="1" value="0" style="accent-color:var(--ink)"></label>' +
      '<div class="plot-wrap"><canvas class="plot wide" id="p3-g3" role="img" aria-label=""></canvas></div><p class="cp-note">' + C3.shiftNote + "</p></div></div>";
  // ---- station 1 ----
  var s1 = $('[data-st="s1"]', host), b1 = null, g1 = new MV.Plot($("#p3-g1", host), { xmin:-2, xmax:3, ymin:-35, ymax:15 });
  function ival(v){ var t = String(v == null ? "" : v).trim().replace(/−/g, "-"); return /^[-+]?\d+$/.test(t) ? +t : null; }
  function s1Paint(){
    var ok = !!S.s1.fOk;
    $$(".cp-fin", s1).forEach(function(i){ i.disabled = ok; });
    $('[data-act="fcheck"]', s1).hidden = ok;
    $(".cp-ffb", s1).innerHTML = ok ? MV.fbHTML("good", A.fGood) : S.s1.fMsg ? MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + S.s1.fMsg) : "";
    $(".cp-s1b", s1).hidden = !ok;
    if (ok && !b1) b1 = signBuilder($("#p3-b1", host), { key:"s1", st:S.s1.chart, T:T, xs:[-3, -2, -1, 0, 1, 2, 3], truth:{ d:d1, crit:[CR(-1, "zero"), CR(0, "zero"), CR(2, "zero")], nd:[] },
      arrows:"pick", tests:true, testTxt:T.testAt, goodHTML:A.result, save:api.save, onSolved:function(){ s1Res(); } });
    s1Res();
  }
  function s1Res(){ var on = !!S.s1.chart.done; $("#p3-r1", host).hidden = !on; if (on) g1.render(); }
  g1.render = function(){
    var ink = css("--ink");
    g1.draw({ view:{ xmin:-2.2, xmax:3.2, ymin:-34, ymax:16 }, xLabel:"x", yLabel:"y", curves:[{ f:f1, color:css("--pen"), width:3 }],
      points:[[-1, 0], [0, 5], [2, -27]].map(function(q){ return { x:q[0], y:q[1], r:6, color:ink }; }),
      labels:[{ x:-1, y:0, text:"min (−1, 0)", dy:22, align:"center", bg:true, font:ui(13, 700) }, { x:0, y:5, text:"max (0, 5)", dy:-18, align:"center", bg:true, font:ui(13, 700) }, { x:2, y:-27, text:"min (2, −27)", dy:-20, dx:8, align:"left", bg:true, font:ui(13, 700) }],
      describe:"Graph of f(x) = 3x⁴ − 4x³ − 12x² + 5 with a local minimum at (−1, 0), a local maximum at (0, 5) and a local minimum at (2, −27)." });
  };
  s1.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.fk; if (!k) return; S.s1.f[k] = e.target.value; api.save(); });
  s1.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.fk) $('[data-act="fcheck"]', s1).click(); });
  $('[data-act="fcheck"]', s1).addEventListener("click", function(){
    var a = ival(S.s1.f.a), b = ival(S.s1.f.b), c = ival(S.s1.f.c), msg = null;
    if (a == null || b == null || c == null) msg = A.fFill;
    else if (a === 12 && b === 2 && c === 1) S.s1.fOk = true;
    else if (a !== 12) msg = A.fCommon;
    else if (b === 1 && c === 2) msg = A.fSwap;
    else msg = A.fPair;
    S.s1.fMsg = msg; api.save(); s1Paint(); MV.focusFb(s1);
  });
  s1Paint();
  // ---- station 2 ----
  var s2 = $('[data-st="s2"]', host), b2host = $("#p3-b2", host), g2 = new MV.Plot($("#p3-g2", host), R2.r1.view);
  function s2Paint(){
    var tab = S.s2.tab, R = R2[tab], tb = $("#p3-tabs", host);
    MV.keepFocus(tb, function(){ tb.innerHTML = '<span class="tiny" style="font-weight:700">Function</span>' + segBtns("tab", B2.tabs, tab, "Choose a function"); });
    $("#p3-t2", host).innerHTML = B2[tab].text;
    b2host.innerHTML = "<div></div>";
    signBuilder(b2host.firstChild, { key:"s2" + tab, st:S.s2[tab], T:T, xs:[-3, -2, -1, 0, 1, 2, 3], truth:{ d:R.d, crit:[CR(-2, "zero"), CR(2, "zero")], nd:R.nd },
      arrows:"pick", tests:true, testTxt:T.testAt, goodHTML:B2[tab].result, save:api.save, onSolved:s2Res });
    s2Res();
  }
  function s2Res(){
    var tab = S.s2.tab, on = !!S.s2[tab].done;
    $("#p3-r2", host).hidden = !on; $("#p3-gh", host).hidden = on;
    var call = $("#p3-call", host);
    if (on && tab === "r1") {
      MV.keepFocus(call, function(){
        call.innerHTML = '<div class="cp-call"><p><strong>' + B2.callout + "</strong></p>" + (S.s2.rev ? '<p class="cp-ans">' + B2.because + "</p>" : '<button type="button" class="btn ghost sm" data-act="reveal" data-k="reveal">' + B2.reveal + "</button>") + "</div>";
      });
    } else call.innerHTML = "";
    if (on) g2.render();
  }
  g2.render = function(){
    var tab = S.s2.tab, R = R2[tab], ink = css("--ink"), ink2 = css("--ink-2"), V = R.view;
    var sc = { view:V, xLabel:"x", yLabel:"y", curves:[{ pts:curvePts(R.f, V.xmin, V.xmax, R.nd, [-2, 2]), color:css("--pen"), width:3 }], segments:[], points:[], labels:[] };
    if (R.nd.length) sc.asymptotes = [{ x:0, label:"x = 0" }];
    R.pts.forEach(function(q, i){
      sc.segments.push({ x1:V.xmin, y1:q[1], x2:V.xmax, y2:q[1], color:ink2, width:1.3, dash:[3, 5] });
      sc.points.push({ x:q[0], y:q[1], r:6, color:ink });
      sc.labels.push({ x:q[0], y:q[1], text:q[2], dy:(q[1] > 0) === (tab === "r1") ? 22 : -20, align:"center", bg:true, font:ui(13, 700) });
      void i;
    });
    sc.describe = tab === "r1" ? "Graph of f(x) = x + 4/x: two branches on either side of the vertical asymptote x = 0. The left branch has a local maximum at (−2, −4); the right branch has a local minimum at (2, 4), which is higher." :
      "Graph of f(x) = x/(x² + 4): a local minimum at (−2, −1/4) and a local maximum at (2, 1/4).";
    g2.c.setAttribute("aria-label", sc.describe);
    g2.draw(sc);
  };
  s2.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.tab && b.dataset.tab !== S.s2.tab) { S.s2.tab = b.dataset.tab; api.save(); s2Paint(); return; }
    if (b.dataset.act === "reveal") { S.s2.rev = true; api.save(); s2Res(); var a = $(".cp-ans", host); if (a) { a.setAttribute("tabindex", "-1"); a.focus({ preventScroll:true }); } }
  });
  s2Paint();
  // ---- station 3 ----
  var s3 = $('[data-st="s3"]', host), thumbs = [], g3 = new MV.Plot($("#p3-g3", host), { xmin:-3, xmax:3.6, ymin:-8, ymax:8 });
  $$(".cp-sk", s3).forEach(function(btn){
    var id = btn.dataset.sk, g = SK[id], pl = new MV.Plot($("canvas", btn), { xmin:-3, xmax:3.5, ymin:-1, ymax:1 }), V = autoView(g, -2.8, 3.4, 0.14);
    pl.render = function(){
      var ink2 = css("--ink-2");
      pl.draw({ view:V, ticks:false, grid:false, curves:[{ f:g, color:css("--pen"), width:3 }],
        segments:[-1, 2].map(function(x){ return { x1:x, y1:V.ymin, x2:x, y2:V.ymax, color:ink2, width:1.2, dash:[3, 4] }; }),
        labels:[-1, 2].map(function(x){ return { x:x, y:V.ymin, text:x < 0 ? MINUS + "1" : "2", dy:-10, dx:6, align:"left", color:ink2, font:ui(12, 600) }; }) });
    };
    thumbs.push(pl); pl.render();
  });
  function s3Paint(){
    var pick = S.s3.pick, sk = C3.sketches.filter(function(s){ return s.id === pick; })[0], ok = sk && MV.ok(sk);
    $$(".cp-sk", s3).forEach(function(b){ var on = b.dataset.sk === pick; b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); b.classList.toggle("good", on && !!ok); b.disabled = !!S.s3.solved; });
    $(".cp-skfb", s3).innerHTML = !sk ? "" : ok ? MV.fbHTML("good", sk.fb) : MV.fbHTML("bad", "<strong>✗ Not that one.</strong> " + sk.fb + " Try another sketch.");
    $(".cp-shift", s3).hidden = !S.s3.solved;
    if (S.s3.solved) { var inp = $("#p3-c", host); inp.value = S.s3.C; $("#p3-co", host).textContent = num(S.s3.C); inp.setAttribute("aria-valuetext", "C = " + num(S.s3.C)); g3.render(); }
  }
  g3.render = function(){
    var Cc = S.s3.C, pen = css("--pen"), g = SK.a, curves = [];
    for (var k = -6; k <= 6; k += 3) if (k !== Cc) curves.push({ f:function(x){ return g(x) + this.k; }.bind({ k:k }), color:pen, width:2, alpha:0.22 });
    curves.push({ f:function(x){ return g(x) + Cc; }, color:pen, width:3.2 });
    g3.draw({ view:{ xmin:-3, xmax:3.6, ymin:-12, ymax:10 }, xLabel:"x", yLabel:"y", curves:curves,
      points:[{ x:-1, y:g(-1) + Cc, r:5, color:css("--ink") }, { x:2, y:g(2) + Cc, r:5, color:css("--ink") }],
      describe:"The correct sketch shifted by C = " + num(Cc) + ", with faint copies shifted by other amounts. Every copy has the same derivative f′(x) = (x + 1)²(x − 2): flat for a moment at x = −1 and a minimum at x = 2." });
  };
  s3.addEventListener("click", function(e){
    var b = e.target.closest("[data-sk]"); if (!b || b.disabled || S.s3.solved) return;
    var sk = C3.sketches.filter(function(s){ return s.id === b.dataset.sk; })[0];
    S.s3.pick = sk.id; S.s3.tries = (S.s3.tries || 0) + (MV.ok(sk) ? 0 : 1);
    if (MV.ok(sk)) S.s3.solved = true;
    api.save(); s3Paint(); MV.focusFb(s3);
  });
  s3.addEventListener("input", function(e){ if (e.target.id !== "p3-c") return; S.s3.C = +e.target.value; api.save(); s3Paint(); });
  s3Paint();
  return {};
}

// ---------- Practice 2: Find and design ----------
// @component V8 designBoxes (adapted from MCV4U 16 extremaBoxes) — labelled answer boxes per item: single numbers, lists of
// x-values ("−1, 4" or "none"; order-free), points "(□, □)" and an interval with bracket toggles "[□, □]"; named wrong states
// ({k, eq} a number, {any} a value in any list, {k, missing} a list lacking a value, {k, open} the right numbers with the
// wrong brackets), first-try scoring and three-level help where the plan gives hints.
function designAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q cp-dq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="cp-din"></div><div class="cp-dcl"></div></div>';
  }).join("");
  function box(it, x, k, label, cls){
    return '<input class="numin short' + (cls ? " " + cls : "") + '" data-bx="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">";
  }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .cp-din', host);
    var h = '<div class="cp-dt">' + it.boxes.map(function(b){
      var lab = MV.plain(b.pre);
      if (b.pt) return '<div class="cp-dr"><span class="cp-dl">' + b.pre + '</span><span class="cp-dpt">(' + box(it, x, b.k + "0", lab + ": x") + ", " + box(it, x, b.k + "1", lab + ": y") + ")</span></div>";
      if (b.iv) {
        var L = x.v[b.k + "L"] || "(", R = x.v[b.k + "R"] || ")";
        return '<div class="cp-dr"><span class="cp-dl">' + b.pre + '</span><span class="cp-dpt"><button type="button" class="cp-br" data-br="' + b.k + 'L" data-k="' + it.id + b.k + 'L" aria-label="' + (L === "[" ? "Left end included. Activate to exclude it." : "Left end excluded. Activate to include it.") + '"' + (x.solved ? " disabled" : "") + ">" + L + "</button>" +
          box(it, x, b.k + "a", "left end") + ", " + box(it, x, b.k + "b", "right end") +
          '<button type="button" class="cp-br" data-br="' + b.k + 'R" data-k="' + it.id + b.k + 'R" aria-label="' + (R === "]" ? "Right end included. Activate to exclude it." : "Right end excluded. Activate to include it.") + '"' + (x.solved ? " disabled" : "") + ">" + R + "</button></span></div>";
      }
      return '<div class="cp-dr"><label class="cp-dl2"><span class="cp-dl">' + b.pre + "</span>" + box(it, x, b.k, lab, b.list ? "cp-list" : "") + "</label></div>";
    }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .cp-dcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function one(raw){ var p = MV.parseNum(raw); return p && p.length === 1 && isFinite(p[0]) ? p[0] : null; }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, i, b;
    for (i = 0; i < it.boxes.length; i++) {
      b = it.boxes[i];
      if (b.pt) { var r0 = String(x.v[b.k + "0"] || "").trim(), r1 = String(x.v[b.k + "1"] || "").trim(); if (!r0 || !r1) return { err:TX.fill }; var p0 = one(r0), p1 = one(r1); if (p0 == null || p1 == null) return { err:TX.err }; vals[b.k] = [p0, p1]; }
      else if (b.iv) { var ra = String(x.v[b.k + "a"] || "").trim(), rb = String(x.v[b.k + "b"] || "").trim(); if (!ra || !rb) return { err:TX.fill }; var pa = one(ra), pb = one(rb); if (pa == null || pb == null) return { err:TX.err }; vals[b.k] = { a:pa, b:pb, aIn:(x.v[b.k + "L"] || "(") === "[", bIn:(x.v[b.k + "R"] || ")") === "]" }; }
      else {
        var raw = String(x.v[b.k] || "").trim(); if (!raw) return { err:TX.fill };
        if (b.list) { if (/^none$/i.test(raw)) vals[b.k] = []; else { var l = MV.parseList(raw); if (!l) return { err:TX.err }; var u = []; l.forEach(function(v){ if (!has(u, v)) u.push(v); }); vals[b.k] = u; } }
        else { var p = one(raw); if (p == null) return { err:TX.err }; vals[b.k] = p; }
      }
    }
    function eqK(k){
      var A = ans[k], V = vals[k];
      if (A && typeof A === "object" && !Array.isArray(A)) return near(V.a, A.a, 1e-9) && near(V.b, A.b, 1e-9) && V.aIn === A.aIn && V.bIn === A.bIn;
      var bx = it.boxes.filter(function(q){ return q.k === k; })[0];
      if (bx.pt) return near(V[0], A[0], 1e-9) && near(V[1], A[1], 1e-9);
      if (Array.isArray(A)) return MV.sameNums(V, A, 1e-9);
      return near(V, A, 1e-9);
    }
    var keys = Object.keys(ans);
    if (keys.every(eqK)) return { ok:true };
    var W = it.wrong || [];
    for (i = 0; i < W.length; i++) {
      var w = W[i], V = vals[w.k];
      if (w.k && w.eq != null && typeof V === "number" && near(V, w.eq, 1e-9)) return { ok:false, msg:w.fb };
      if (w.any != null && Object.keys(vals).some(function(k){ var q = vals[k]; return Array.isArray(q) && !it.boxes.filter(function(z){ return z.k === k; })[0].pt && has(q, w.any); })) return { ok:false, msg:w.fb };
      if (w.k && w.missing != null && Array.isArray(V) && !has(V, w.missing)) return { ok:false, msg:w.fb };
      if (w.k && w.open && V && near(V.a, ans[w.k].a, 1e-9) && near(V.b, ans[w.k].b, 1e-9) && !(V.aIn && V.bIn)) return { ok:false, msg:w.fb };
    }
    return { ok:false, msg:it.general || TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.br) { var k = b.dataset.br, L = /L$/.test(k); x.v[k] = L ? ((x.v[k] || "(") === "(" ? "[" : "(") : ((x.v[k] || ")") === ")" ? "]" : ")"); api.save(); paintIn(it); return; }
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

// ---------- Performance task: Design the derivative f′(x) = a(x − p)^m (x − q)^n ----------
var task = (function(){
  var api, plot;
  function gi(k, lo, hi){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= lo && v <= hi ? v : null; }
  function read(){
    var a = gi("a", -5, 5), p = gi("p", -5, 5), q = gi("q", -5, 5), mm = [1, 2, 3].indexOf(api.S.m) >= 0 ? api.S.m : null, n = [1, 2, 3].indexOf(api.S.n) >= 0 ? api.S.n : null;
    return { a:a, p:p, q:q, m:mm, n:n, valid:a !== null && a !== 0 && p !== null && q !== null && mm !== null && n !== null };
  }
  function dOf(D){ return function(x){ return D.a * Math.pow(x - D.p, D.m) * Math.pow(x - D.q, D.n); }; }
  function roots(D){ var r = [D.p]; if (D.q !== D.p) r.push(D.q); return r.sort(asc); }
  function checks(D){
    if (!D.valid) return [false, false, false];
    var d = dOf(D), rs = roots(D), e = 1e-3;
    var c1 = has(rs, 1) && sgn(d(1 - e)) < 0 && sgn(d(1 + e)) > 0;
    var c2 = rs.some(function(r){ return r < 0 && sgn(d(r - e)) === sgn(d(r + e)) && sgn(d(r - e)) !== 0; });
    var c3 = D.a * Math.pow(-D.p, D.m) * Math.pow(-D.q, D.n) === -4;
    return [c1, c2, c3];
  }
  function facSrc(p, k){ var b = p === 0 ? "x" : "(x " + (p > 0 ? "- " + p : "+ " + -p) + ")"; return k > 1 ? b + "^" + k : b; }
  function canon(D){
    var fs = D.p === D.q ? [[D.p, D.m + D.n]] : [[D.p, D.m], [D.q, D.n]];
    fs.sort(function(u, v){ return v[0] - u[0] || u[1] - v[1]; });
    return fs;
  }
  function src(a, fs){ return (a === 1 ? "" : a === -1 ? "-" : String(a)) + fs.map(function(f){ return facSrc(f[0], f[1]); }).join(""); }
  function preview(){
    var D = read(), ch = $("#td-chart"), pen = css("--pen"), ink = css("--ink"), L = api.content.labels;
    if (!D.valid) {
      if (ch) ch.innerHTML = '<p class="tiny muted">' + L.invalid + "</p>";
      plot.draw({ view:{ xmin:-6, xmax:6, ymin:-5, ymax:5 }, xLabel:"x", yLabel:"y", describe:"Empty sketch: choose a, p, q, m and n." });
      return;
    }
    var d = dOf(D), fs = canon(D), rs = roots(D), rows = [];
    if (D.a !== 1) rows.push({ s:String(D.a), f:function(){ return D.a; }, z:[] });
    fs.forEach(function(f){ rows.push({ s:facSrc(f[0], f[1]), f:function(x){ return Math.pow(x - f[0], f[1]); }, z:[f[0]] }); });
    if (ch) ch.innerHTML = '<p class="tiny cp-zh">' + L.chart + ": " + m("f′(x) = " + src(D.a, fs)) + "</p>" + signChartHTML({ rows:rows, d:d, pts:rs, dLabel:m("f′(x)"), caption:"Sign chart of your f′" });
    // f = ∫₀ˣ f′ (exact polynomial), so f(0) = 0
    var poly = [D.a]; fs.forEach(function(f){ for (var k = 0; k < f[1]; k++) poly = pMul(poly, [-f[0], 1]); });
    var F = pInt(poly), g = function(x){ return pEval(F, x); };
    // y-range from the part of the graph around the critical numbers and 0; the far ends may leave the window
    var c0 = Math.min(rs[0], 0) - 0.7, c1 = Math.max(rs[rs.length - 1], 0) + 0.7, Vc = autoView(g, c0, c1, 0.4);
    var V = { xmin:c0 - 1, xmax:c1 + 1, ymin:Vc.ymin, ymax:Vc.ymax }, sc = { view:V, xLabel:"x", yLabel:"y", curves:[{ f:g, color:pen, width:3 }], points:[{ x:0, y:0, r:4.5, color:ink }], labels:[] };
    sc.after = function(ctx, pl){
      rs.forEach(function(r){ var k = kindAt(d, r), X = pl.X(r), Y = pl.Y(g(r)); diamond(ctx, X, Y, 7, pen, true); bgText(ctx, (k === "neither" ? "neither" : k) + " at " + xt(r), X, Y + (k === "max" ? -24 : 24), "center", ink, ui(12, 700)); });
    };
    sc.describe = "Sketch of f with f(0) = 0 for f′(x) = " + MV.plain(m(src(D.a, fs))) + ". " + rs.map(function(r){ var k = kindAt(d, r); return "At x = " + xt(r) + ": " + (k === "neither" ? "neither" : "a local " + (k === "max" ? "maximum" : "minimum")); }).join("; ") + ".";
    plot.draw(sc);
  }
  function stepper(k, range){
    var L = api.content.labels;
    return '<div class="cp-step"><label for="td-' + k + '"><span class="m">' + L[k] + '</span> <span class="tiny muted">' + range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="td' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="td-' + k + '" data-tk="' + k + '" type="number" min="-5" max="5" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="td' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  function powChips(k){
    var L = api.content.labels;
    return '<div class="cp-step"><span class="cp-pl">' + L.pow + " " + L[k] + '</span><span class="seg" role="group" aria-label="Power ' + k + '">' + [1, 2, 3].map(function(v){
      return '<button type="button" data-pw="' + k + '" data-v="' + v + '" data-k="td' + k + v + '" aria-pressed="' + (api.S[k] === v) + '">' + v + "</button>"; }).join("") + "</span></div>";
  }
  function paintPow(inp){ $$("[data-pw]", inp).forEach(function(b){ b.setAttribute("aria-pressed", api.S[b.dataset.pw] === +b.dataset.v); }); }
  function afterAll(){
    // the plan's "after all four" note, added once every valid design has been found (the toolkit's own note fires after 3)
    setTimeout(function(){
      var t = MV.S.task, fb = $("#task-fb"), D = read();
      if (!t || !fb || !D.valid || !checks(D).every(Boolean) || (t.found || []).length < 4 || $(".cp-all", fb)) return;
      var g = $(".fb.good", fb); if (g) g.insertAdjacentHTML("beforeend", '<p class="cp-all">' + api.content.afterAll + "</p>");
    }, 0);
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (a.S.a == null) { a.S.a = "1"; a.S.p = "1"; a.S.q = "-1"; a.S.m = 1; a.S.n = 1; }
      inp.innerHTML = '<div class="cp-tin"><p class="tiny" style="font-weight:700;margin:0">' + m("f′(x) = a(x - p)^m(x - q)^n") + "</p>" +
        stepper("a", L.aRange) + stepper("p", L.pRange) + powChips("m") + stepper("q", L.pRange) + powChips("n") + "</div>";
      pv.innerHTML = '<div id="td-chart" aria-live="polite"></div><p class="tiny cp-zh">' + L.sketch + '</p><div class="plot-wrap"><canvas class="plot" id="td-plot" role="img" aria-label="Sketch of f"></canvas></div>';
      plot = new MV.Plot($("#td-plot"), { xmin:-6, xmax:6, ymin:-5, ymax:5 }); plot.render = preview;
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.pw) { a.S[b.dataset.pw] = +b.dataset.v; paintPow(inp); upd(); return; }
        if (!b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        var nv = clamp(cur + +b.dataset.dir, -5, 5); if (k === "a" && nv === 0) nv = clamp(nv + +b.dataset.dir, -5, 5) || cur;
        a.S[k] = String(nv); $("#td-" + k).value = a.S[k]; upd();
      });
      var ck = $("#task-check"); if (ck) ck.addEventListener("click", afterAll);
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : api.content.labels.invalid; },
    checks:checks,
    key:function(D){ return D.a + "|" + canon(D).map(function(f){ return f.join(","); }).join("|"); },
    label:function(k){ var p = k.split("|"); return m("f′(x) = " + src(+p[0], p.slice(1).map(function(s){ return s.split(",").map(Number); }))); },
    text:function(k){ var p = k.split("|"); return "f′(x) = " + MV.plain(m(src(+p[0], p.slice(1).map(function(s){ return s.split(",").map(Number); })))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ design:designAct },
  task:task
});
})();
