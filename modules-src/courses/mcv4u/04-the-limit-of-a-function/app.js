// MCV4U 04 The Limit of a Function: hero storyboard, approach explorer (Explore, V6 approach table), limits in the long run
// (Part 3 stations and notation matching), Read the limits and Tables and reasoning (Practice 1 and 2), "Build a limit puzzle".
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function md(h){ return MV.md(h); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function nsrc(v){ return String(r9(v)); }                         // number as m() source (a hyphen becomes a true minus)
function ntx(v, dp){ return num(v, dp == null ? 4 : dp); }        // number as text (true minus)
function close(a, b, t){ return Math.abs(a - b) <= (t || 1e-9); }
// lim with the approach underneath (course plan §2); hidden brackets keep MV.plain() readable
function lim(sub){ return '<span class="lm-lim"><span class="lm-lt">lim</span><span class="vh"> (</span><span class="lm-lu">' + m(sub) + '</span><span class="vh">)</span></span>'; }
// 3 decimal places for long-run tables: 0.5, 0.75 stay short; 0.990 keeps its zero
function fmt3(v){ if (Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-9) return num(v, 3); var s = Math.abs(v).toFixed(3); return (v < 0 ? MINUS : "") + s; }

// @component exactDec (copied from MCV4U 02) — exact rationals (BigInt) printed as exact decimals (2.996001, not 2.9960009…);
// of(v) reads any decimal up to 12 places exactly; decS() adds "≈ " when it had to round.
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
  return { of:of, add:add, sub:sub, mul:mul, div:div, toNum:toNum, dec:dec, decS:decS };
})();

// ---------- canvas maths text: italic letters, upright digits, operators and "lim" ----------
function rich(ctx, s, x, y, o){
  o = o || {};
  var size = o.size || 15, fam = css("--font-math") || "serif", parts = String(s).split(/([A-Za-z]+)/), w = 0, ws = [];
  function font(i, p){ return ((i % 2 === 1 && p !== "lim") ? "italic " : "") + (o.weight || 500) + " " + size + "px " + fam; }
  parts.forEach(function(p, i){ ctx.font = font(i, p); var ww = p ? ctx.measureText(p).width : 0; ws.push(ww); w += ww; });
  if (o.measure) return w;
  var x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  if (o.bg) { ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(x0 - 4, y - size * 0.72, w + 8, size * 1.44); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
  parts.forEach(function(p, i){ if (!p) return; ctx.font = font(i, p); ctx.fillText(p, x0, y); x0 += ws[i]; });
  return w;
}
// "lim" with the approach under it, then the rest: limCanvas(ctx, x, y, "x → 2", "f(x) = 3", {align, bg, size})
function limCanvas(ctx, x, y, sub, rest, o){
  o = o || {};
  var size = o.size || 16, s2 = Math.round(size * 0.7);
  var wl = rich(ctx, "lim", 0, 0, { size:size, measure:true }), wsub = rich(ctx, sub, 0, 0, { size:s2, measure:true }), wr = rich(ctx, rest, 0, 0, { size:size, measure:true });
  var head = Math.max(wl, wsub), gap = size * 0.3, total = head + gap + wr, x0 = o.align === "right" ? x - total : o.align === "center" ? x - total / 2 : x;
  if (o.bg) { ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.9; ctx.fillRect(x0 - 5, y - size * 0.8, total + 10, size * 2); ctx.globalAlpha = 1; }
  rich(ctx, "lim", x0 + head / 2, y, { size:size, align:"center", color:o.color });
  rich(ctx, sub, x0 + head / 2, y + size * 0.82, { size:s2, align:"center", color:o.color });
  rich(ctx, rest, x0 + head + gap, y, { size:size, color:o.color });
}
// y tick labels drawn at the left edge (the plot's own labels clip when the y-axis is off-screen)
function edgeTicks(v, H, narrow){
  var s = MV.niceStep((v.ymax - v.ymin) / (narrow ? 5 : 7)), dp = Math.max(0, Math.ceil(-Math.log10(s) - 1e-9));
  return { step:s, after:function(ctx, pl){
    ctx.save(); ctx.font = "12px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
    for (var yy = Math.ceil(v.ymin / s - 1e-9) * s; yy <= v.ymax + 1e-9; yy += s) {
      var Y = pl.Y(yy), t = num(yy, dp); if (Y < 10 || Y > pl.H - 24) continue;
      var w = ctx.measureText(t).width; ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(3, Y - 8, w + 6, 16); ctx.globalAlpha = 1;
      ctx.fillStyle = css("--ink-2"); ctx.fillText(t, 6, Y);
    }
    ctx.restore();
  } };
}
function xTicksFor(v, narrow){ var s = MV.niceStep((v.xmax - v.xmin) / (narrow ? 4 : 7)), dp = Math.max(0, Math.ceil(-Math.log10(s) - 1e-9)); return { step:s, fmt:function(t){ return num(t, dp); } }; }

// @component V6 approachTable — x → a from the left and from the right (a ∓ 0.1, 0.01, 0.001, or o.steps), values computed
// exactly in code (exactDec XQ: 2.996001, not 2.9960009…), "undefined" where f is undefined (and at x = a), plus the limit
// wording: one-sided limits, the two-sided limit and the verdict sentence. Float functions (√x, 2^x) are rounded to o.rdp places.
//   F = { q(X, x) -> XQ | null (exact; X = XQ.of(x), x the float; null = undefined)  or  f(x) -> number (NaN = undefined),
//         at:"(0/0)" (optional note after "undefined" at x = a) }
//   V6.val(F, x, o) -> {s, v, undef}
//   V6.html(F, a, o) -> left table (x → a⁻) and right table (x → a⁺), side by side (stacked on phones), then the x = a line.
//        o = { steps:[0.1, 0.01, 0.001], shownL, shownR (rows filled; default all), hiL, hiR (row index), name:"f", dp:6,
//              rdp:4, note (html under the tables), noAt:true }
//   V6.longHTML(head, rows, note) -> one table for n → ∞ or x → ∞; rows [[html, text]]
//   V6.limTxt(L) -> "3" | "grows without bound" | "decreases without bound"     (L a number or ±Infinity)
//   V6.two(lL, lR) -> {exists, v}       V6.verdict(lL, lR, fa, a) -> one of the four verdict sentences
var V6 = (function(){
  function val(F, x, o){
    o = o || {};
    if (F.q) { var q = F.q(XQ.of(x), x); if (!q) return { s:"undefined", undef:true }; return { s:XQ.decS(q, o.dp == null ? 6 : o.dp, o.rdp || 4), v:XQ.toNum(q) }; }
    var v = F.f(x); if (!isFinite(v)) return { s:"undefined", undef:true };
    return { s:num(v, o.rdp || 4), v:v };
  }
  function side(F, a, dir, o, shown, hi){
    var st = o.steps || [0.1, 0.01, 0.001], nm = o.name || "f", word = dir < 0 ? "left" : "right";
    var rows = st.map(function(d, i){
      var x = r9(a + dir * d), vv = i < shown ? val(F, x, o) : null;
      return "<tr" + (i === hi ? ' class="hl"' : "") + "><td>" + ntx(x, 6) + "</td><td>" + (vv ? (vv.undef ? '<span class="muted">undefined</span>' : vv.s) : '<span class="muted">?</span>') + "</td></tr>";
    }).join("");
    return '<div class="lm-v6s"><table class="vt lm-v6t"><caption class="vh">Values of ' + nm + "(x) as x approaches " + ntx(a) + " from the " + word + "</caption><thead>" +
      '<tr><th scope="colgroup" colspan="2" class="lm-v6h">' + m("x → " + nsrc(a) + (dir < 0 ? "^{-}" : "^{+}")) + " from the " + word + "</th></tr>" +
      '<tr><th scope="col">' + m("x") + '</th><th scope="col">' + m(nm + "(x)") + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>";
  }
  function html(F, a, o){
    o = o || {};
    var n = (o.steps || [0.1, 0.01, 0.001]).length, nm = o.name || "f", at = "";
    if (!o.noAt) { var va = val(F, a, o); at = '<p class="lm-v6at">At ' + m("x = " + nsrc(a)) + ": " + m(nm + "(" + nsrc(a) + ")") + (va.undef ? " is <strong>undefined</strong>" + (F.at ? " " + F.at : "") : " = " + va.s) + "</p>"; }
    return '<div class="lm-v6"><div class="lm-v6g">' + side(F, a, -1, o, o.shownL == null ? n : o.shownL, o.hiL) + side(F, a, 1, o, o.shownR == null ? n : o.shownR, o.hiR) + "</div>" + at +
      (o.note ? '<p class="tiny muted lm-v6n">' + o.note + "</p>" : "") + "</div>";
  }
  function longHTML(head, rows, note){
    return '<div class="lm-v6 lm-v6l">' + MV.tableHTML({ head:head, rows:rows, caption:MV.plain(head.join(" and ")) }) + (note ? '<p class="tiny muted lm-v6n">' + note + "</p>" : "") + "</div>";
  }
  function limTxt(L){ return L === Infinity ? "grows without bound" : L === -Infinity ? "decreases without bound" : ntx(L); }
  function two(lL, lR){ var ex = isFinite(lL) && isFinite(lR) && close(lL, lR, 1e-9); return { exists:ex, v:ex ? lL : null }; }
  function verdict(lL, lR, fa, a){
    var t = two(lL, lR), fA = m("f(" + nsrc(a) + ")");
    if (t.exists) {
      if (fa == null) return "The limit exists (" + ntx(t.v) + "), even though " + fA + " is undefined.";
      if (close(fa, t.v)) return "The limit exists (" + ntx(t.v) + ") and equals " + fA + ".";
      return "The limit exists (" + ntx(t.v) + ") but isn’t equal to " + fA + " (" + ntx(fa) + ").";
    }
    if (isFinite(lL) && isFinite(lR)) return "The limit doesn’t exist: the one-sided limits (" + ntx(lL) + " and " + ntx(lR) + ") disagree.";
    if (lL === lR) return "The limit doesn’t exist: the values " + (lL > 0 ? "grow" : "decrease") + " without bound on both sides, so there’s no number to approach.";
    function w(L){ return L === Infinity ? "grow without bound" : L === -Infinity ? "decrease without bound" : "head to " + ntx(L); }
    return "The limit doesn’t exist: from the left the values " + w(lL) + ", and from the right they " + w(lR) + ".";
  }
  return { val:val, html:html, longHTML:longHTML, limTxt:limTxt, two:two, verdict:verdict };
})();

// ---------- the six Explore graphs (all with a = 2) ----------
var TYPES = ["smooth", "hole", "moved", "jump", "asym", "two"];
var TNAME = { smooth:"Smooth", hole:"Hole", moved:"Moved point", jump:"Jump", asym:"Asymptote", two:"Two formulas" };
// piecewise caption: rows [[expression source, condition source]]
function pw(rows){
  return '<span class="lm-pw"><span class="lm-br" aria-hidden="true">{</span><span class="lm-cases">' + rows.map(function(r){ return '<span class="lm-case">' + m(r[0]) + '<span class="lm-cond">' + m(r[1]) + "</span></span>"; }).join("") + "</span></span>";
}
function linSrc(a, b){                     // "ax + b": linSrc(-2, 1) -> "-2x + 1"; linSrc(0, 1) -> "1"
  var out = "";
  if (a) out = (a === 1 ? "" : a === -1 ? "-" : nsrc(a)) + "x";
  if (b || !out) out += out ? (b < 0 ? " - " : " + ") + nsrc(Math.abs(b)) : nsrc(b);
  return out;
}
function sqMinus(a){ return a === 0 ? "x^2" : "x^2 " + (a > 0 ? "- " : "+ ") + nsrc(Math.abs(a)); }
function spec(S){
  var c = S.c, A = S.av;
  if (S.type === "hole") return { eq:m("f(x) = {x^2 - x - 2}/{x - 2}"), at:"(0/0)",
    q:function(X, x){ return x === 2 ? null : XQ.div(XQ.sub(XQ.sub(XQ.mul(X, X), X), 2), XQ.sub(X, 2)); },
    fx:function(x){ return x + 1; }, pieces:[{ f:function(x){ return x + 1; } }], open:[[2, 3]], dots:[], lL:3, lR:3, fa:null, view:[-1.5, 7.5] };
  if (S.type === "moved") return { eq:m("f(x) =") + " " + pw([["x + 1", "x ≠ 2"], ["5", "x = 2"]]),
    q:function(X, x){ return x === 2 ? XQ.of(5) : XQ.add(X, 1); },
    fx:function(x){ return x + 1; }, pieces:[{ f:function(x){ return x + 1; } }], open:[[2, 3]], dots:[[2, 5]], lL:3, lR:3, fa:5, view:[-1.5, 7.5] };
  if (S.type === "jump") { var R = r9(c - 2);
    return { eq:m("f(x) =") + " " + pw([["x + 1", "x < 2"], [c === 0 ? "-x" : nsrc(c) + " - x", "x ≥ 2"]]),
      q:function(X, x){ return x < 2 ? XQ.add(X, 1) : XQ.sub(c, X); },
      fx:function(x){ return x < 2 ? x + 1 : c - x; },
      pieces:[{ f:function(x){ return x + 1; }, domain:[-50, 2] }, { f:function(x){ return c - x; }, domain:[2, 50] }],
      open:R === 3 ? [] : [[2, 3]], dots:[[2, R]], lL:3, lR:R, fa:R, view:[-3.5, 10] }; }
  if (S.type === "asym") {
    if (S.asym === "odd") return { eq:m("f(x) = {1}/{x - 2}"), at:"(division by 0)",
      q:function(X, x){ return x === 2 ? null : XQ.div(1, XQ.sub(X, 2)); },
      fx:function(x){ return 1 / (x - 2); }, pieces:[{ f:function(x){ return 1 / (x - 2); } }], asym:true, open:[], dots:[], lL:-Infinity, lR:Infinity, fa:null, view:[-8, 8] };
    return { eq:m("f(x) = {1}/{(x - 2)^2}"), at:"(division by 0)",
      q:function(X, x){ if (x === 2) return null; var d = XQ.sub(X, 2); return XQ.div(1, XQ.mul(d, d)); },
      fx:function(x){ return 1 / ((x - 2) * (x - 2)); }, pieces:[{ f:function(x){ return 1 / ((x - 2) * (x - 2)); } }], asym:true, open:[], dots:[], lL:Infinity, lR:Infinity, fa:null, view:[-2, 12] };
  }
  if (S.type === "two") {
    if (S.two === "new") { var lL = r9(2 * A + 1), lR = r9(4 - A);
      return { eq:m("f(x) =") + " " + pw([[linSrc(A, 1), "x < 2"], [sqMinus(A), "x ≥ 2"]]),
        q:function(X, x){ return x < 2 ? XQ.add(XQ.mul(A, X), 1) : XQ.sub(XQ.mul(X, X), A); },
        fx:function(x){ return x < 2 ? A * x + 1 : x * x - A; },
        pieces:[{ f:function(x){ return A * x + 1; }, domain:[-50, 2] }, { f:function(x){ return x * x - A; }, domain:[2, 50] }],
        open:lL === lR ? [] : [[2, lL]], dots:[[2, lR]], lL:lL, lR:lR, fa:lR, view:[-10.5, 12.5] }; }
    return { eq:m("f(x) =") + " " + pw([["x^2 - 1", "x < 2"], ["2x - 1", "x ≥ 2"]]),
      q:function(X, x){ return x < 2 ? XQ.sub(XQ.mul(X, X), 1) : XQ.sub(XQ.mul(2, X), 1); },
      fx:function(x){ return x < 2 ? x * x - 1 : 2 * x - 1; },
      pieces:[{ f:function(x){ return x * x - 1; }, domain:[-50, 2] }, { f:function(x){ return 2 * x - 1; }, domain:[2, 50] }],
      open:[], dots:[[2, 3]], lL:3, lR:3, fa:3, view:[-2.5, 9.5] };
  }
  return { eq:m("f(x) = x^2 - 1"), q:function(X){ return XQ.sub(XQ.mul(X, X), 1); },
    fx:function(x){ return x * x - 1; }, pieces:[{ f:function(x){ return x * x - 1; } }], open:[], dots:[], lL:3, lR:3, fa:3, view:[-2.5, 9.5] };
}

// ---------- the approach explorer (Explore centrepiece, uses V6) ----------
//   var t = explorer(host, {S, save, changed});  t.apply({type, c, asym, two, av, mode, zoom, L, R}), t.step("L"|"R", ms, cb),
//   t.setMode(m), t.lock(bool), t.get() -> S, t.paint()
function explorer(host, o){
  var S = o.S;
  S.type = TYPES.indexOf(S.type) >= 0 ? S.type : "smooth";
  S.c = typeof S.c === "number" ? S.c : 7; S.av = typeof S.av === "number" ? S.av : 0;
  S.asym = S.asym === "odd" ? "odd" : "sq"; S.two = S.two === "new" ? "new" : "orig";
  S.mode = ["graph", "table", "zoom"].indexOf(S.mode) >= 0 ? S.mode : "graph"; S.zoom = S.zoom === 100 ? 100 : 10;
  S.L = Math.max(0, Math.min(3, S.L | 0)); S.R = Math.max(0, Math.min(3, S.R | 0));
  var A = { L:null, R:null, zoom:null }, anim = null, locked = false;
  var L = MV.pgLayout(host, { aria:"Approach explorer graph" });
  L.graph.parentNode.classList.add("lm-ex");
  var pwrap = $(".plot-wrap", L.graph);
  var pline = document.createElement("p"); pline.className = "lm-pline"; pline.setAttribute("aria-live", "polite"); pwrap.parentNode.insertBefore(pline, pwrap.nextSibling);
  var tview = document.createElement("div"); tview.className = "lm-tview"; tview.hidden = true; pwrap.parentNode.insertBefore(tview, pline);
  L.ctrl.innerHTML = '<div class="chips lm-types" role="group" aria-label="Graph type"></div>' +
    '<div class="lm-sub">' +
      '<label class="slider lm-sl" data-for="jump"><span class="slider-top"><span>' + m("c") + ' <span class="tiny muted">(right piece ' + m("c - x") + ')</span></span><output class="lm-cout"></output></span>' +
        '<input type="range" class="lm-c" min="0" max="10" step="0.5" style="accent-color:var(--ink)" aria-label="c, from 0 to 10"></label>' +
      '<div data-for="asym" class="lm-asym"></div><div data-for="two" class="lm-two"></div>' +
      '<label class="slider lm-sl" data-for="twonew"><span class="slider-top"><span>' + m("a") + ' <span class="tiny muted">(in ' + m("ax + 1") + " and " + m("x^2 - a") + ')</span></span><output class="lm-aout"></output></span>' +
        '<input type="range" class="lm-a" min="-5" max="5" step="0.5" style="accent-color:var(--ink)" aria-label="a, from −5 to 5"></label>' +
    "</div>" +
    '<div class="lm-probe" role="group" aria-label="Probe"><button type="button" class="btn primary sm" data-pr="L" data-k="lmpl">From the left</button><button type="button" class="btn primary sm" data-pr="R" data-k="lmpr">From the right</button><button type="button" class="btn ghost sm" data-pr="reset" data-k="lmpreset">Reset</button></div>' +
    '<div class="lm-mode"></div><div class="lm-zoom"></div>';
  var plot = new MV.Plot(L.canvas, { xmin:-1.3, xmax:5.3, ymin:-2, ymax:10 });
  function q(sel){ return $(sel, host); }
  function save(){ o.save(); if (o.changed) o.changed(); }
  function stop(){ if (anim) { var a = anim; anim = null; a.cancel(); a.finish(); } }

  // ---- geometry ----
  function zNow(){ return A.zoom != null ? A.zoom : S.zoom; }
  function viewNow(sp){
    var y0 = sp.view[0], y1 = sp.view[1];
    if (S.mode !== "zoom") return { xmin:-1.3, xmax:5.3, ymin:y0, ymax:y1 };
    var z = zNow(), hw = 3.3 / z, cy, hh;
    if (isFinite(sp.lL) && isFinite(sp.lR)) { cy = (sp.lL + sp.lR) / 2; hh = Math.max((y1 - y0) / 2 / z, Math.abs(sp.lL - sp.lR) / 2 * 1.6); }
    else { cy = (y0 + y1) / 2; hh = (y1 - y0) / 2; }
    return { xmin:2 - hw, xmax:2 + hw, ymin:cy - hh, ymax:cy + hh };
  }
  function dOf(side){ var k = S[side]; return A[side] != null ? A[side] : (k ? Math.pow(10, -k) : null); }
  function pval(sp, x){ var r = V6.val(sp, x); return r; }

  // ---- drawing ----
  function draw(){
    var sp = spec(S), v = viewNow(sp), W = L.canvas.getBoundingClientRect().width || 600, narrow = W < 420;
    var sc = { view:v, curves:[], asymptotes:[], segments:[], points:[], labels:[] };
    sp.pieces.forEach(function(p){ sc.curves.push({ f:p.f, domain:p.domain, color:css("--pen"), width:3 }); });
    if (sp.asym) sc.asymptotes.push({ x:2 });
    var zoomed = S.mode === "zoom" && zNow() > 1.01;
    if (zoomed) { var et = edgeTicks(v, 0, narrow); sc.xTicks = xTicksFor(v, narrow); sc.yTicks = { step:et.step, fmt:function(){ return ""; } }; }
    else { sc.xTicks = { step:1 }; sc.yTicks = { step:v.ymax - v.ymin > 16 ? 4 : 2 }; }
    var gx = v.xmin <= 0 && v.xmax >= 0 ? 0 : v.xmin, labs = [];
    var desc = "Graph of " + MV.plain(sp.eq) + ".";
    sp.open.forEach(function(p){ desc += " Open circle at (" + ntx(p[0]) + ", " + ntx(p[1]) + ")."; });
    sp.dots.forEach(function(p){ desc += " Filled dot at (" + ntx(p[0]) + ", " + ntx(p[1]) + ")."; });
    if (sp.asym) desc += " Vertical asymptote x = 2.";
    [["L", -1], ["R", 1]].forEach(function(pr){
      var d = dOf(pr[0]); if (d == null) return;
      var x = 2 + pr[1] * d, y = sp.fx(x), word = pr[1] < 0 ? "left" : "right";
      if (y > v.ymax || y < v.ymin) {
        var up = y > v.ymax, yE = up ? v.ymax : v.ymin, yS = yE + (up ? -1 : 1) * (v.ymax - v.ymin) * 0.12;
        sc.segments.push({ x1:x, y1:yS, x2:x, y2:yE, color:css("--ink"), width:2.4, arrow:true });
        labs.push({ x:x, y:yS, side:pr[1], text:"f(" + ntx(x, 6) + ") = " + ntx(y, 0), edge:up ? "top" : "bottom" });
        desc += " The " + word + " probe at x = " + ntx(x, 6) + " is off the graph: f = " + ntx(y, 0) + ".";
        return;
      }
      sc.segments.push({ x1:x, y1:y, x2:gx, y2:y, color:css("--ink-2"), width:1.6, dash:[5, 5] });
      sc.points.push({ x:x, y:y, color:css("--ink"), r:6 });
      labs.push({ x:gx, y:y, side:pr[1], text:ntx(y, 6) });
      desc += " The " + word + " probe is at x = " + ntx(x, 6) + ", f(x) = " + ntx(y, 6) + ".";
    });
    sp.open.forEach(function(p){ sc.points.push({ x:p[0], y:p[1], open:true, color:css("--pen"), r:5.5 }); });
    sp.dots.forEach(function(p){ sc.points.push({ x:p[0], y:p[1], color:css("--pen"), r:5.5 }); });
    if (zoomed) desc += " Zoomed in ×" + Math.round(zNow()) + " around x = 2.";
    sc.describe = desc;
    sc.after = function(ctx, pl){
      if (zoomed) edgeTicks(v, 0, narrow).after(ctx, pl);
      labs.forEach(function(l){
        if (l.edge) { var X = pl.X(l.x), Y = l.edge === "top" ? 14 : pl.H - 14; rich(ctx, l.text, X + (l.side < 0 ? -10 : 10), Y + (l.side < 0 ? 0 : (l.edge === "top" ? 20 : -20)), { size:13, align:l.side < 0 ? "right" : "left", bg:true }); return; }
        var X2 = pl.X(l.x) + (l.x === v.xmin ? 46 : 8), Y2 = pl.Y(l.y) + (l.side < 0 ? -12 : 12);
        rich(ctx, l.text, X2, Y2, { size:12.5, bg:true, color:css("--ink-2") });
      });
    };
    plot.draw(sc);
  }
  plot.render = draw;

  // ---- table view, probe line and readout ----
  function paintTable(){
    if (S.mode !== "table") return;
    var sp = spec(S);
    tview.innerHTML = V6.html(sp, 2, { shownL:S.L, shownR:S.R, hiL:S.L - 1, hiR:S.R - 1, note:S.L + S.R < 6 ? "Press <strong>From the left</strong> and <strong>From the right</strong> to fill the rows." : "" });
  }
  function paintLine(){
    var sp = spec(S);
    function one(side, word){
      var k = S[side]; if (!k) return "From the " + word + ": not started";
      var x = r9(2 + (side === "L" ? -1 : 1) * Math.pow(10, -k)), r = pval(sp, x);
      return "From the " + word + ": " + m("f(" + nsrc(x) + ")") + " = " + (r.undef ? "undefined" : r.s);
    }
    pline.innerHTML = one("L", "left") + ' <span aria-hidden="true">·</span> ' + one("R", "right");
  }
  function paintRead(){
    var sp = spec(S), kL = S.L >= 3, kR = S.R >= 3, both = kL && kR, t = V6.two(sp.lL, sp.lR);
    var need = function(w, x){ return '? <span class="tiny muted">(step the ' + w + " probe to " + x + ")</span>"; };
    L.read.innerHTML = MV.readoutHTML([
      [m("a"), "2"],
      ["Left-hand limit " + lim("x → 2^{-}") + " " + m("f(x)"), kL ? "<strong>" + V6.limTxt(sp.lL) + "</strong>" : need("left", "1.999")],
      ["Right-hand limit " + lim("x → 2^{+}") + " " + m("f(x)"), kR ? "<strong>" + V6.limTxt(sp.lR) + "</strong>" : need("right", "2.001")],
      ["Limit " + lim("x → 2") + " " + m("f(x)"), both ? "<strong>" + (t.exists ? ntx(t.v) : "does not exist") + "</strong>" : "?"],
      [m("f(2)"), sp.fa == null ? "undefined" + (sp.at ? ' <span class="tiny muted">' + sp.at + "</span>" : "") : ntx(sp.fa)],
      ["Verdict", both ? V6.verdict(sp.lL, sp.lR, sp.fa, 2) : '<span class="muted">Step both probes to within 0.001 of 2 to decide.</span>']
    ]);
  }

  // ---- controls ----
  var segAsym = MV.seg(q(".lm-asym"), { label:"Asymptote:", value:S.asym, options:[{ id:"sq", t:m("{1}/{(x - 2)^2}") }, { id:"odd", t:m("{1}/{x - 2}") }],
    onChange:function(v){ if (locked) { segAsym.set(S.asym); return; } stop(); S.asym = v; S.L = 0; S.R = 0; save(); paint(); } });
  var segTwo = MV.seg(q(".lm-two"), { label:"Pieces:", value:S.two, options:[{ id:"orig", t:"Original" }, { id:"new", t:"New pieces" }],
    onChange:function(v){ if (locked) { segTwo.set(S.two); return; } stop(); S.two = v; S.L = 0; S.R = 0; save(); paint(); } });
  var segMode = MV.seg(q(".lm-mode"), { label:"Mode:", value:S.mode, options:[{ id:"graph", t:"Graph" }, { id:"table", t:"Table" }, { id:"zoom", t:"Zoom" }],
    onChange:function(v){ if (locked) { segMode.set(S.mode); return; } setMode(v); } });
  var segZoom = MV.seg(q(".lm-zoom"), { label:"Zoom around " + m("x = 2") + ":", value:String(S.zoom), options:[{ id:"10", t:"×10" }, { id:"100", t:"×100" }],
    onChange:function(v){ if (locked) { segZoom.set(String(S.zoom)); return; } zoomTo(+v); } });
  q(".lm-types").addEventListener("click", function(e){
    var b = e.target.closest("[data-ty]"); if (!b || locked) return;
    stop(); if (S.type !== b.dataset.ty) { S.type = b.dataset.ty; S.L = 0; S.R = 0; } save(); paint();
  });
  function slide(cls, key){
    var el = q(cls);
    el.addEventListener("input", function(){ if (locked) { el.value = S[key]; return; } stop(); S[key] = r9(+el.value); save(); paint(); });
  }
  slide(".lm-c", "c"); slide(".lm-a", "av");
  q(".lm-probe").addEventListener("click", function(e){
    var b = e.target.closest("[data-pr]"); if (!b || b.disabled || locked) return;
    if (b.dataset.pr === "reset") { stop(); S.L = 0; S.R = 0; save(); paint(); return; }
    step(b.dataset.pr);
  });
  function step(side, dur, cb){
    stop();
    var k = S[side]; if (k >= 3) { if (cb) cb(); return; }
    var from = k ? Math.pow(10, -k) : 1, to = Math.pow(10, -(k + 1)), done = false;
    var finish = function(){ if (done) return; done = true; A[side] = null; S[side] = k + 1; save(); paint(); };
    var cancel = MV.tween({ dur:dur == null ? (S.mode === "table" ? 250 : 750) : dur, step:function(t){ A[side] = from * Math.pow(to / from, t); draw(); },
      done:function(){ anim = null; finish(); if (cb) cb(); } });
    if (!done) anim = { cancel:cancel, finish:finish };
  }
  function setMode(v){
    stop(); var was = S.mode; S.mode = v; save();
    if (v === "zoom" && was !== "zoom") { A.zoom = 1; paint(); zoomTo(S.zoom, null, null, 1); return; }
    paint();
  }
  function zoomTo(z, dur, cb, fromZ){
    stop(); var from = fromZ || zNow(); S.zoom = z; save();
    var fin = function(){ A.zoom = null; paint(); };
    var cancel = MV.tween({ dur:dur == null ? 800 : dur, step:function(t){ A.zoom = from * Math.pow(z / from, t); draw(); },
      done:function(){ anim = null; fin(); if (cb) cb(); } });
    if (A.zoom != null) anim = { cancel:cancel, finish:fin };
  }
  function paintCtl(){
    MV.keepFocus(q(".lm-types"), function(){ q(".lm-types").innerHTML = TYPES.map(function(t){ return '<button type="button" class="chip' + (S.type === t ? " on" : "") + '" data-ty="' + t + '" data-k="lmty' + t + '" aria-pressed="' + (S.type === t) + '">' + TNAME[t] + "</button>"; }).join(""); });
    $$("[data-for]", host).forEach(function(el){ var f = el.dataset.for; el.hidden = !(f === S.type || (f === "twonew" && S.type === "two" && S.two === "new")); });
    q(".lm-c").value = S.c; q(".lm-cout").textContent = ntx(S.c);
    q(".lm-a").value = S.av; q(".lm-aout").textContent = ntx(S.av);
    segAsym.set(S.asym); segTwo.set(S.two); segMode.set(S.mode); segZoom.set(String(S.zoom));
    q(".lm-zoom").hidden = S.mode !== "zoom";
    var bl = $('[data-pr="L"]', host), br = $('[data-pr="R"]', host);
    bl.disabled = S.L >= 3; br.disabled = S.R >= 3;
    bl.setAttribute("aria-label", "From the left: " + (S.L >= 3 ? "done, x = 1.999" : "move the probe to x = " + ntx(2 - Math.pow(10, -(S.L + 1)), 6)));
    br.setAttribute("aria-label", "From the right: " + (S.R >= 3 ? "done, x = 2.001" : "move the probe to x = " + ntx(2 + Math.pow(10, -(S.R + 1)), 6)));
  }
  function paint(){
    var sp = spec(S);
    L.cap.innerHTML = sp.eq;
    pwrap.hidden = S.mode === "table"; tview.hidden = S.mode !== "table";
    paintCtl(); paintTable(); paintLine(); paintRead(); draw();
  }
  paint();
  return {
    apply:function(st){
      stop();
      ["type", "c", "asym", "two", "av", "mode", "zoom", "L", "R"].forEach(function(k){ if (st[k] != null) S[k] = st[k]; });
      A.zoom = null; save(); paint();
    },
    step:step, setMode:setMode, zoomTo:zoomTo,
    lock:function(v){ locked = !!v; host.classList.toggle("lm-locked", locked); },
    get:function(){ return S; },
    paint:paint
  };
}

// ---------- hero storyboard: probes slide along y = x + 1 toward x = 2; guides meet at 3; the dot at (2, 5) flashes ----------
function hero(f){
  if (!f.canvas) return;
  var V = { xmin:-0.9, xmax:4.6, ymin:-0.7, ymax:6.4 }, p = new MV.Plot(f.canvas, V);
  var st = { dl:null, dr:null, lab:0, ring:false, tag:false };
  function line(x){ return x + 1; }
  p.render = function(){
    var sc = { view:V, xTicks:{ step:1 }, yTicks:{ step:1 }, curves:[{ f:line, color:css("--pen"), width:3.2 }], segments:[], points:[], labels:[] };
    [[st.dl, -1], [st.dr, 1]].forEach(function(pr){
      if (pr[0] == null) return; var x = 2 + pr[1] * pr[0], y = line(x);
      sc.segments.push({ x1:x, y1:y, x2:0, y2:y, color:css("--ink-2"), width:1.6, dash:[5, 5] });
      sc.points.push({ x:x, y:y, color:css("--ink"), r:5.5 });
    });
    sc.points.push({ x:2, y:3, open:true, color:css("--pen"), r:6 });
    sc.points.push({ x:2, y:5, color:css("--pen"), r:6, ring:st.ring });
    sc.after = function(ctx, pl){
      if (st.lab > 0) { ctx.save(); ctx.globalAlpha = st.lab; limCanvas(ctx, pl.X(0) + 10, pl.Y(3) - 34, "x → 2", "f(x) = 3", { bg:true, size:17 }); ctx.restore(); }
      if (st.tag) rich(ctx, "f(2) = 5", pl.X(2) + 14, pl.Y(5) - 2, { size:16, bg:true });
    };
    sc.describe = "The line y = x + 1 with an open circle at (2, 3) and a filled dot at (2, 5). " + (st.lab >= 1 ? "Probes from both sides of x = 2 have dashed guides to the y-axis that close in on 3: the limit as x approaches 2 is 3. f(2) = 5: the limit doesn’t care." : "Two probes slide along the line toward x = 2, one from each side.");
    p.draw(sc);
  };
  function capEnd(){ f.cap.innerHTML = m("f(2) = 5") + ": the limit doesn’t care."; }
  function finish(){ st = { dl:0.04, dr:0.04, lab:1, ring:true, tag:true }; capEnd(); p.render(); }
  if (MV.reduceMotion) { finish(); return; }
  f.cap.innerHTML = "&nbsp;"; p.render();
  MV.wait(700, function(){
    MV.tween({ dur:2200, step:function(t){ st.dl = 1.8 * Math.pow(0.04 / 1.8, t); st.dr = 2.2 * Math.pow(0.04 / 2.2, t); p.render(); }, done:function(){
      f.cap.innerHTML = "Both sides head to 3.";
      MV.tween({ dur:600, step:function(t){ st.lab = t; p.render(); }, done:function(){
        var n = 0;
        MV.wait(700, function blink(){
          st.ring = !st.ring; st.tag = true; if (n === 0) capEnd(); p.render(); n++;
          if (n < 6) MV.wait(320, blink); else { st.ring = true; p.render(); }
        });
      } });
    } });
  });
}

// ---------- Explore: approach explorer, the challenge 2 table, predictions and challenges ----------
var PSTART = { p1:{ type:"hole" }, p2:{ type:"moved" }, p3:{ type:"jump", c:7 }, p4:{ type:"asym", asym:"sq", mode:"table" } };
var TC2F = { q:function(X, x){ return x === 1 ? null : XQ.div(XQ.sub(XQ.mul(X, XQ.mul(X, X)), 1), XQ.sub(X, 1)); }, at:"(0/0)" };
function explore(host, api){
  var S = api.S; S.tc2 = typeof S.tc2 === "string" ? S.tc2 : "";
  var wrap = document.createElement("div"); host.appendChild(wrap);
  var tool = explorer(wrap, { S:S, save:api.save, changed:api.changed });
  var bx = document.createElement("div"); bx.className = "lm-tc2"; host.appendChild(bx);
  function tc2Done(){ return !!(MV.S.chal.tc2 || {}).solved; }
  function paintTc2(){
    var done = tc2Done();
    bx.innerHTML = '<h4>Challenge 2: a table for ' + m("f(x) = {x^3 - 1}/{x - 1}") + "</h4>" +
      V6.html(TC2F, 1, { note:"Computed exactly by the tool." }) +
      '<label class="lm-tc2row" for="lm-tc2in"><span>' + lim("x → 1") + " " + m("f(x) =") + '</span><input class="numin short" id="lm-tc2in" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(S.tc2) + '"' + (done ? " disabled" : "") + "></label>" +
      '<p class="tiny muted lm-tc2n">' + (done ? "✓ Challenge 2 met: the limit is 3." : "Type your answer, then press <strong>Check challenge</strong> for challenge 2.") + "</p>";
  }
  bx.addEventListener("input", function(e){ if (e.target.id !== "lm-tc2in") return; S.tc2 = e.target.value; api.save(); MV.changed(); });
  paintTc2();
  function tc2(){
    var raw = String(S.tc2 || "").trim();
    if (!raw) return { ok:false, msg:"Type the limit in the box under the table first." };
    if (/undef/i.test(raw)) return { ok:false, msg:"The expression is undefined at 1, but both sides head to 3." };
    if (/exist|dne|no limit|none/i.test(raw)) return { ok:false, msg:"Both columns head to the same number, so the limit exists. Which number is it?" };
    var p = MV.parseNum(raw); if (!p || p.length !== 1) return { ok:false, msg:"Type the limit as a number, such as 2 or 2.5." };
    var v = p[0];
    if (close(v, 3)) return { ok:true };
    if ([2.71, 2.9701, 2.997001, 2.997, 3.31, 3.0301, 3.003001, 3.003].some(function(w){ return close(v, w); })) return { ok:false, msg:"That’s one table entry. Where are the values heading?" };
    return { ok:false, msg:md("Read both columns: where are the values heading as `x` gets closer to 1?") };
  }
  function chal(id, opt){
    var g = tool.get();
    if (id === "tc1") {
      if (g.type !== "jump") return { ok:false, msg:"Choose the <strong>Jump</strong> graph first." };
      if (g.c === 5) return { ok:true };
      if (g.c === 3) return { ok:false, msg:md("Then the right side heads to 3 − 2 = 1. You need `c - 2 = 3`.") };
      if (g.c === 7) return { ok:false, msg:"Left 3, right 5: still a jump." };
      return { ok:false, msg:md("Left 3, right `c - 2 = " + nsrc(g.c - 2) + "`: still a jump.") };
    }
    if (id === "tc2") {
      var r = tc2();
      if (r.ok && !(opt && opt.live)) setTimeout(paintTc2, 0);
      return r;
    }
    if (id === "tc3") {
      if (g.type !== "two" || g.two !== "new") return { ok:false, msg:"Choose <strong>Two formulas</strong>, then <strong>New pieces</strong>." };
      if (g.av === 1) return { ok:true };
      if (g.av === 3) return { ok:false, msg:md("That solves `2a + 1 = 4 + a`. The right piece at 2 is `4 - a`.") };
      if (g.av === 0) return { ok:false, msg:"Left 1, right 4." };
      return { ok:false, msg:"Left " + ntx(2 * g.av + 1) + ", right " + ntx(4 - g.av) + ": the sides don’t agree yet." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){ tool.lock(false); tool.apply(Object.assign({ mode:"graph", L:0, R:0 }, PSTART[p.id])); tool.lock(true); },
      run:function(p, done){
        var fin = function(){ tool.lock(false); tool.paint(); done(); };
        var seq = ["L", "L", "L", "R", "R", "R"], i = 0, dur = p.id === "p4" ? 300 : 750;
        (function next(){
          if (i >= seq.length) { MV.wait(300, fin); return; }
          var side = seq[i++];
          tool.step(side, dur, function(){ MV.wait(i === 3 ? 650 : 350, next); });
        })();
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: limits in the long run ----------
// Fibonacci ratios F(n+1)/F(n) for n = 1 … 1001 (r1 = 1/1, r(n+1) = 1 + 1/r(n))
var FIB = (function(){ var r = [null, 1]; for (var n = 2; n <= 1001; n++) r[n] = 1 + 1 / r[n - 1]; return r; })();
var SEQ = {
  nn:{ chip:"`t_n = {n}/{n + 1}`", name:"t_n", t:function(n){ return n / (n + 1); }, lim:1, y:[-0.1, 1.3], line:"tₙ → 1", yl:"tₙ",
    say:function(){ return lim("n → ∞") + " " + m("t_n = 1") + ". The terms climb toward 1 and settle there."; } },
  fib:{ chip:"`F_{n+1}/F_n`", name:"F_{n+1}/F_n", t:function(n){ return FIB[n]; }, lim:(1 + Math.sqrt(5)) / 2, y:[0.8, 2.25], line:"≈ 1.618", yl:"Fₙ₊₁/Fₙ",
    say:function(){ return "The ratios of successive Fibonacci numbers bounce above and below, closing in on about 1.618."; } },
  alt:{ chip:"`(-1)^n`", name:"(-1)^n", t:function(n){ return n % 2 ? -1 : 1; }, lim:null, y:[-1.7, 1.7], yl:"(−1)ⁿ",
    say:function(){ return "The terms jump between −1 and 1 and never settle near one number: no limit."; } }
};
var LONGF = {
  f:{ chip:"`f(x) = {2x + 1}/{x - 3}`", nm:"f", f:function(x){ return (2 * x + 1) / (x - 3); }, y:[-6, 10], va:3,
    say:function(){ return lim("x → ∞") + " " + m("f(x) = 2") + ". As the window zooms out, the graph hugs " + m("y = 2") + "."; } },
  g:{ chip:"`g(x) = {2x^2 + x}/{x^2 + 1}`", nm:"g", f:function(x){ return (2 * x * x + x) / (x * x + 1); }, y:[-0.6, 2.7], cross:true,
    say:function(){ return md("`g` <strong>crosses</strong> `y = 2` at `x = 2`, and still approaches 2 in the long run: ") + lim("x → ∞") + " " + m("g(x) = 2") + "."; } }
};
// small SVG graphs for the notation match (data box → 150 × 96 px)
function thumb(id){
  var W = 150, H = 96, P = 8, box = { g1:[-0.6, 10, -0.6, 2.8], g2:[-0.6, 10.6, -0.25, 1.35], g3:[-1, 8, -4.2, 4.2], g4:[-0.6, 10.6, -1.6, 1.6] }[id];
  function X(x){ return P + (x - box[0]) / (box[1] - box[0]) * (W - 2 * P); }
  function Y(y){ return H - P - (y - box[2]) / (box[3] - box[2]) * (H - 2 * P); }
  function path(f, a, b){ var d = "", pen = false; for (var i = 0; i <= 120; i++) { var x = a + (b - a) * i / 120, y = f(x); if (!isFinite(y) || y > box[3] + 1 || y < box[2] - 1) { pen = false; continue; } d += (pen ? "L" : "M") + X(x).toFixed(1) + " " + Y(Math.max(box[2] - 1, Math.min(box[3] + 1, y))).toFixed(1); pen = true; } return d; }
  var s = '<svg class="lm-thumb" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" aria-hidden="true" focusable="false">';
  s += '<path d="M' + X(box[0]) + " " + Y(0) + "H" + X(box[1]) + "M" + X(0) + " " + Y(box[2]) + "V" + Y(box[3]) + '" stroke="var(--plot-axis)" stroke-width="1.2" fill="none"/>';
  function dashH(y, t){ s += '<path d="M' + X(box[0]) + " " + Y(y) + "H" + X(box[1]) + '" stroke="var(--ink-2)" stroke-width="1.3" stroke-dasharray="5 4" fill="none"/><text x="' + (X(0) - 3) + '" y="' + (Y(y) + 3.5) + '" font-size="10" text-anchor="end" fill="var(--ink-2)">' + t + "</text>"; }
  function dots(f){ for (var n = 1; n <= 10; n++) s += '<circle cx="' + X(n).toFixed(1) + '" cy="' + Y(f(n)).toFixed(1) + '" r="3.2" fill="var(--pen)"/>'; }
  if (id === "g1") { dashH(2, "2"); s += '<path d="' + path(function(x){ return 2 - 2 / (x + 1); }, 0, 10) + '" stroke="var(--pen)" stroke-width="2.6" fill="none"/>'; }
  if (id === "g2") { dashH(1, "1"); dots(function(n){ return n / (n + 1); }); }
  if (id === "g3") {
    s += '<path d="M' + X(3) + " " + Y(box[2]) + "V" + Y(box[3]) + '" stroke="var(--ink-2)" stroke-width="1.3" stroke-dasharray="5 4" fill="none"/><text x="' + (X(3) + 3) + '" y="' + (Y(0) + 11) + '" font-size="10" fill="var(--ink-2)">3</text>';
    s += '<path d="' + path(function(x){ return 1 / (x - 3); }, -1, 2.94) + " " + path(function(x){ return 1 / (x - 3); }, 3.06, 8) + '" stroke="var(--pen)" stroke-width="2.6" fill="none"/>';
  }
  if (id === "g4") { s += '<text x="' + (X(0) - 3) + '" y="' + (Y(1) + 3.5) + '" font-size="10" text-anchor="end" fill="var(--ink-2)">1</text><text x="' + (X(0) - 3) + '" y="' + (Y(-1) + 3.5) + '" font-size="10" text-anchor="end" fill="var(--ink-2)">' + MINUS + "1</text>"; dots(function(n){ return n % 2 ? -1 : 1; }); }
  return s + "</svg>";
}
function part3(host, api){
  var S = api.S; S.st = ["s1", "s2", "s3"].indexOf(S.st) >= 0 ? S.st : "s1";
  S.seq = SEQ[S.seq] ? S.seq : "nn"; S.fn = LONGF[S.fn] ? S.fn : "f"; S.z = [1, 10, 100].indexOf(S.z) >= 0 ? S.z : 1;
  host.innerHTML = '<div class="lm-st"></div>' +
    '<div class="lm-pane" data-pane="s1"><h3 class="lm-h">Station 1: sequences</h3><div class="sym"><div>' +
      '<div class="chips lm-seqc" role="group" aria-label="Choose a sequence"></div>' +
      '<div class="plot-wrap"><canvas class="plot" id="lr1-plot" role="img" aria-label="Dot plot of the terms"></canvas></div><div id="lr1-pl"></div></div>' +
      '<div><div id="lr1-tbl"></div><p class="lm-say" id="lr1-say" aria-live="polite"></p>' +
      '<details class="alg" id="lr1-alg"><summary>Check it with algebra</summary><p>' + md("If the ratios `r = F_{n+1}/F_n` settle down, then `F_{n+2} = F_{n+1} + F_n` gives `{F_{n+2}}/{F_{n+1}} = 1 + {F_n}/{F_{n+1}}`, so the limit `r` satisfies `r = 1 + {1}/{r}`, that is, `r^2 = r + 1`.") +
        "</p><p>" + md("Its positive root is `r = {1 + √5}/{2} ≈ 1.618`.") + "</p></details></div></div></div>" +
    '<div class="lm-pane" data-pane="s2" hidden><h3 class="lm-h">Station 2: functions in the long run</h3><div class="sym"><div>' +
      '<div class="chips lm-fnc" role="group" aria-label="Choose a function"></div><div class="lm-zs"></div>' +
      '<div class="plot-wrap"><canvas class="plot" id="lr2-plot" role="img" aria-label="Graph in the long run"></canvas></div></div>' +
      '<div><div id="lr2-tbl"></div><p class="lm-say" id="lr2-say" aria-live="polite"></p>' +
      '<details class="alg" id="lr2-alg"><summary>Check it with algebra</summary><p>' + md("Where does `g(x) = 2`? `{2x^2 + x}/{x^2 + 1} = 2` gives `2x^2 + x = 2x^2 + 2`, so `x = 2`.") + "</p><p>" +
        md("A horizontal asymptote describes the long run. The graph may cross it at some finite `x`.") + "</p></details></div></div></div>" +
    '<div class="lm-pane" data-pane="s3" hidden><h3 class="lm-h">Station 3: notation</h3><p class="muted">Match each statement to the graph it describes.</p><div id="lr3"></div></div>';
  var seg = MV.seg($(".lm-st", host), { label:"Station:", value:S.st, options:[{ id:"s1", t:"Sequences" }, { id:"s2", t:"Functions" }, { id:"s3", t:"Notation" }],
    onChange:function(v){ S.st = v; api.save(); show(); } });
  function show(){ $$("[data-pane]", host).forEach(function(p){ p.hidden = p.dataset.pane !== S.st; }); seg.set(S.st); if (S.st === "s1") p1.render(); if (S.st === "s2") p2.render(); }

  // station 1
  var p1 = new MV.Plot($("#lr1-plot"), { xmin:0, xmax:12.8, ymin:-0.1, ymax:1.3 }), shown = 12;
  function seqT(){ return SEQ[S.seq]; }
  p1.render = function(){
    var Q = seqT(), v = { xmin:-1.5, xmax:13.6, ymin:Q.y[0], ymax:Q.y[1] }, pts = [];
    for (var n = 1; n <= shown; n++) pts.push({ x:n, y:Q.t(n), r:5, color:css("--pen") });
    p1.draw({ view:v, xTicks:{ step:1 }, yTicks:{ step:Q.y[1] - Q.y[0] > 2 ? 0.5 : 0.25 }, xLabel:"n",
      asymptotes:Q.lim != null ? [{ y:Q.lim, label:Q.line }] : [], points:pts,
      describe:"Dot plot of " + MV.plain(m(Q.name)) + " for n = 1 to " + shown + ": " + pts.map(function(p){ return fmt3(p.y); }).join(", ") + (Q.lim != null ? ". Dashed line at the limit, " + fmt3(Q.lim) + "." : ".") });
  };
  function paint1(){
    var Q = seqT();
    MV.keepFocus($(".lm-seqc", host), function(){ $(".lm-seqc", host).innerHTML = Object.keys(SEQ).map(function(k){ return '<button type="button" class="fchip" data-seq="' + k + '" data-k="lmseq' + k + '" aria-pressed="' + (S.seq === k) + '">' + md(SEQ[k].chip) + "</button>"; }).join(""); });
    $("#lr1-tbl").innerHTML = V6.longHTML([m("n"), m(Q.name)], [1, 2, 3, 10, 100, 1000, 1001].map(function(n){ return [ntx(n, 0), fmt3(Q.t(n))]; }), "Values to 3 decimal places.");
    $("#lr1-say").innerHTML = Q.say();
    $("#lr1-alg").hidden = S.seq !== "fib";
    p1.render();
  }
  $(".lm-seqc", host).addEventListener("click", function(e){ var b = e.target.closest("[data-seq]"); if (!b) return; S.seq = b.dataset.seq; api.save(); paint1(); pl.go(pl.get()); });
  var pl = MV.player($("#lr1-pl"), { count:12, interval:700,
    render:function(i){ shown = i + 1; p1.render(); },
    label:function(i){ var Q = seqT(), n = i + 1; return "Terms 1 to " + n + ": " + m(Q.name.replace(/n/g, String(n)).replace("{" + n + "+1}", "{" + (n + 1) + "}")) + " = " + fmt3(Q.t(n)); } });
  paint1(); pl.go(11);

  // station 2
  var p2 = new MV.Plot($("#lr2-plot"), { xmin:-4, xmax:16, ymin:-6, ymax:10 }), zA = null, zAnim = null;
  function fnT(){ return LONGF[S.fn]; }
  p2.render = function(){
    var F = fnT(), z = zA != null ? zA : S.z, Wd = 16 * z, v = { xmin:-0.25 * Wd, xmax:Wd, ymin:F.y[0], ymax:F.y[1] }, narrow = (p2.c.getBoundingClientRect().width || 600) < 420;
    var pts = [], labels = [];
    [10, 100, 1000].forEach(function(x){ if (x <= v.xmax) { pts.push({ x:x, y:F.f(x), r:4.5, color:css("--ink") }); if (x > v.xmax * 0.04) labels.push({ x:x, y:F.f(x), text:"x = " + x, dx:0, dy:-16, align:"center", bg:true, font:"600 12px " + (css("--font-ui") || "sans-serif") }); } });
    if (F.cross && z < 3) { pts.push({ x:2, y:2, r:5.5, color:css("--pen") }); labels.push({ x:2, y:2, text:"crosses at (2, 2)", dx:8, dy:22, align:"left", bg:true }); }
    var asy = [{ y:2, label:"" }]; if (F.va) asy.push({ x:F.va, label:z < 3 ? "x = 3" : "" });
    labels.push({ x:v.xmax, y:2, text:"y = 2", dx:-6, dy:15, align:"right", bg:true, color:css("--ink-2"), font:"italic 13px " + (css("--font-math") || "serif") });
    p2.draw({ view:v, xTicks:xTicksFor(v, narrow), asymptotes:asy, curves:[{ f:F.f, color:css("--pen"), width:3 }], points:pts, labels:labels,
      describe:"Graph of " + MV.plain(md(F.chip)) + " for x up to " + ntx(v.xmax, 0) + ", with the dashed horizontal asymptote y = 2" + (F.va ? " and the vertical asymptote x = 3" : "") + (F.cross ? "; the graph crosses y = 2 at (2, 2), rises a little above 2, then comes back down toward 2" : "; for large x the graph comes down toward y = 2") + "." });
  };
  var segZ = MV.seg($(".lm-zs", host), { label:"Zoom out:", value:String(S.z), options:[{ id:"1", t:"×1" }, { id:"10", t:"×10" }, { id:"100", t:"×100" }],
    onChange:function(v){ var to = +v, from = zA != null ? zA : S.z; if (zAnim) zAnim(); S.z = to; api.save();
      zAnim = MV.tween({ dur:900, step:function(t){ zA = from * Math.pow(to / from, t); p2.render(); }, done:function(){ zA = null; zAnim = null; p2.render(); } }); } });
  function paint2(){
    var F = fnT();
    MV.keepFocus($(".lm-fnc", host), function(){ $(".lm-fnc", host).innerHTML = Object.keys(LONGF).map(function(k){ return '<button type="button" class="fchip" data-fn="' + k + '" data-k="lmfn' + k + '" aria-pressed="' + (S.fn === k) + '">' + md(LONGF[k].chip) + "</button>"; }).join(""); });
    $("#lr2-tbl").innerHTML = V6.longHTML([m("x"), m(F.nm + "(x)")], [10, 100, 1000].map(function(x){ return [ntx(x, 0), fmt3(F.f(x))]; }), "Values to 3 decimal places.");
    $("#lr2-say").innerHTML = F.say();
    $("#lr2-alg").hidden = S.fn !== "g";
    segZ.set(String(S.z)); p2.render();
  }
  $(".lm-fnc", host).addEventListener("click", function(e){ var b = e.target.closest("[data-fn]"); if (!b) return; S.fn = b.dataset.fn; api.save(); paint2(); });
  paint2();

  // station 3: N6 matching (toolkit), graph thumbnails drawn here
  var M0 = api.content.match, MA = Object.assign({}, M0, { right:M0.right.map(function(r){ return Object.assign({}, r, { t:'<span class="lm-th">' + thumb(r.id) + '<span class="lm-thl">' + r.t + '</span><span class="vh">: ' + r.sr + "</span></span>" }); }) });
  var made = MV.activityTypes.match($("#lr3"), MA);
  MV.ACTS[MA.id] = { a:MA, stats:function(){ var s = made.stats(); return { first:s.first, total:s.total, done:s.done, line:"" }; }, missed:made.missed };
  show();
  return {};
}

// ---------- Practice 1: read the limits (N8 chips beside one fixed graph) ----------
function f1(x){ return 4 / (x + 2) + 1.5 * x - 1; }
function f2(x){ return (x - 2) * (x - 2) / 4 + 1; }
function readAct(host, api, a){
  var S = api.S; S.cur = Math.max(0, Math.min(a.items.length - 1, S.cur | 0)); S.it = S.it || {}; var msg = {};
  function ist(id){ return S.it[id] || (S.it[id] = { tries:0, hint:0, solved:false, first:null, pick:null }); }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + '<div class="sym lm-rd"><div class="lm-rdg"><div class="plot-wrap"><canvas class="plot square" id="lm-rd-plot" role="img" aria-label="Graph of f"></canvas></div></div><div class="lm-rdq"></div></div>';
  var plot = new MV.Plot($("#lm-rd-plot", host), { xmin:-6.5, xmax:6.5, ymin:-13, ymax:8 });
  plot.render = function(){
    plot.draw({ view:{ xmin:-6.6, xmax:6.6, ymin:-13, ymax:8 }, xTicks:{ step:1 }, yTicks:{ step:2 }, asymptotes:[{ x:-2, label:"" }],
      labels:[{ x:-2, y:7.2, text:"x = −2", dx:-6, align:"right", bg:true, color:css("--ink-2"), font:"italic 13px " + (css("--font-math") || "serif") },
        { x:4, y:2, text:"(4, 2)", dx:4, dy:17, align:"left", bg:true, color:css("--ink-2"), font:"600 13px " + (css("--font-math") || "serif") }],
      curves:[{ f:f1, domain:[-6, 2], color:css("--pen"), width:3 }, { f:f2, domain:[2, 6], color:css("--pen"), width:3 }],
      points:[{ x:0, y:1, open:true, color:css("--pen"), r:5.5 }, { x:0, y:-1, color:css("--pen"), r:5.5 }, { x:2, y:3, open:true, color:css("--pen"), r:5.5 }, { x:2, y:1, color:css("--pen"), r:5.5 }, { x:4, y:2, color:css("--ink-2"), r:3.5 }],
      describe:"Graph of f for −6 ≤ x ≤ 6. A vertical asymptote at x = −2: just left of it the graph falls without bound, just right of it the graph rises without bound. Open circle at (0, 1) and filled dot at (0, −1). The left part ends at an open circle at (2, 3). The right part starts at a filled dot at (2, 1) and passes through (4, 2)." });
  };
  var chips = a.chips;
  function chipT(id){ return chips.filter(function(c){ return c.id === id; })[0].t; }
  function paint(){
    var it = a.items[S.cur], x = ist(it.id), ans = MV.ans(it), box = $(".lm-rdq", host);
    MV.keepFocus(box, function(){
      var h = '<div class="lm-rdnav" role="group" aria-label="Items">' + a.items.map(function(z, i){ var y = ist(z.id); return '<button type="button" class="btn ghost sm lm-rdn' + (y.solved ? " done" : "") + '" data-go="' + i + '" data-k="rdgo' + i + '" aria-pressed="' + (i === S.cur) + '" aria-label="Item ' + (i + 1) + (y.solved ? ", answered" : "") + '">' + (y.solved ? "✓ " : "") + (i + 1) + "</button>"; }).join("") + "</div>";
      h += '<div class="q lm-rdi" style="border-bottom:0"><div class="q-head"><span class="qn" aria-hidden="true">' + (S.cur + 1) + '</span><div class="q-prompt">What is ' + it.ask + "?</div></div>";
      h += '<div class="chips lm-rdc" role="group" aria-label="Answer chips">' + chips.map(function(c){
        var on = x.solved ? c.id === ans : x.pick === c.id;
        return '<button type="button" class="chip' + (on ? " on" : "") + '" data-ch="' + c.id + '" data-k="rdch' + c.id + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>";
      }).join("") + "</div>";
      if (!x.solved && it.hints) h += '<div class="q-actions">' + MV.hintBtn("rdhint" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + chipT(ans) + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msg[it.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg[it.id]);
      h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-nav="-1" data-k="rdprev"' + (S.cur === 0 ? " disabled" : "") + '>Previous item</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-nav="1" data-k="rdnext"' + (S.cur === a.items.length - 1 ? " disabled" : "") + ">Next item</button></div></div>";
      var done = a.items.filter(function(z){ return ist(z.id).solved; }).length;
      if (done === a.items.length) { var f = a.items.filter(function(z){ return ist(z.id).first; }).length; h += '<p class="sort-done">All 8 done! You got ' + f + " of 8 right on the first try, without the worked solution.</p>"; }
      box.innerHTML = h;
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.cur], x = ist(it.id);
    if (b.dataset.go != null) { S.cur = +b.dataset.go; api.save(); paint(); return; }
    if (b.dataset.nav) { S.cur = Math.max(0, Math.min(a.items.length - 1, S.cur + +b.dataset.nav)); api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.ch) {
      var c = b.dataset.ch; x.pick = c;
      if (c === MV.ans(it)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
      else { x.tries++; var w = it.wrong && it.wrong[c]; msg[it.id] = w ? w + " Try another chip." : a.wrongDefault; }
      api.save(); paint(); MV.focusFb($(".lm-rdq", host));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Practice 2: tables and reasoning (N4 number entry with V6 tables) ----------
var TFN = {
  t1:{ q:function(X, x){ return x === 2 ? null : XQ.div(XQ.sub(XQ.mul(X, X), 4), XQ.sub(X, 2)); }, at:"(0/0)" },
  t2:{ f:function(x){ return x === 1 ? NaN : (Math.sqrt(x) - 1) / (x - 1); }, at:"(0/0)" },
  t3:{ f:function(x){ return x === 0 ? NaN : (Math.pow(2, x) - 1) / x; }, at:"(0/0)" }
};
var TGEN = {
  T1:"Look at where both columns head as `x` gets closer to 2.",
  T2:"Look at where both columns head as `x` gets closer to 1.",
  T3:"Use the closest values from both sides, to 3 decimal places.",
  T4:"Read down the table: where are the values heading?",
  T5:"The left side heads to `9 - k` and the right side to `3k + 1`. Make them equal.",
  T6:"For a finite limit, the numerator must be 0 at `x = 2`. Then factor and cancel `x - 2`."
};
function tablesAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function tableOf(it){
    var t = it.table; if (!t) return "";
    if (t.inf) return V6.longHTML([m("n"), m("(1 + {1}/{n})^n")], [1, 10, 100, 1000, 10000].map(function(n){ return [ntx(n, 0), num(Math.pow(1 + 1 / n, n), 4)]; }), "Values rounded to 4 decimal places.");
    var F = TFN[t.fn];
    return V6.html(F, t.a, { steps:t.steps, note:F.f ? "Values rounded to 4 decimal places." : "Computed exactly by the tool." });
  }
  function inputs(it){
    var x = ist(it.id), dis = x.solved ? " disabled" : "";
    if (it.boxes) return '<div class="numrow lm-tbx">' + it.boxes.map(function(b){ return '<label for="tb-' + it.id + b.id + '"><span>' + b.label + '</span><input class="numin short" id="tb-' + it.id + b.id + '" data-tb="' + b.id + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(x.v[b.id] || "") + '"' + dis + "></label>"; }).join("") + "</div>";
    return '<div class="numrow"><label for="tb-' + it.id + '">Your answer:</label><input class="numin" id="tb-' + it.id + '" data-tb="ans" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(x.v.ans || "") + '"' + dis + "></div>";
  }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-tq="' + it.id + '"] .lm-tctl', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", (msgs[it.id].bad ? "<strong>✗ Not quite.</strong> " : "") + msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it, i){
    return '<div class="q lm-tq" data-tq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + (it.boxes ? it.prompt : "Find " + it.prompt + ".") + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>" +
      tableOf(it) + '<div class="lm-tin">' + inputs(it) + '</div><div class="lm-tctl"></div></div>';
  }).join("");
  a.items.forEach(paintCtl);
  function num1(raw){ var p = MV.parseNum(raw); return p && p.length === 1 ? p[0] : null; }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), w;
    if (it.boxes) {
      var vals = {};
      for (var i = 0; i < it.boxes.length; i++) {
        var b = it.boxes[i], r = String(x.v[b.id] || "").trim();
        if (!r) return { err:it.boxes.length > 1 ? "Fill in both boxes." : "Fill in the box." };
        var n = num1(r); if (n == null) return { err:"Type a number in each box, such as 3, −2 or 1/2." };
        vals[b.id] = n;
      }
      if (Object.keys(ans).every(function(k){ return close(vals[k], ans[k]); })) return { ok:true };
      w = (it.wrong || []).filter(function(z){ return Object.keys(z).filter(function(k){ return k !== "fb"; }).every(function(k){ return close(vals[k], z[k]); }); })[0];
      if (w) return { ok:false, msg:w.fb };
      if (it.id === "T6" && close(vals.a, ans.a)) return { ok:false, msg:md("Your `a` is right. Now factor the numerator and cancel `x - 2` to find the limit.") };
      return { ok:false, msg:md(TGEN[it.id]) };
    }
    var raw = String(x.v.ans || "").trim();
    if (!raw) return { err:"Type your answer first." };
    if (/undef|exist|dne|no limit/i.test(raw)) {
      w = (it.wrong || []).filter(function(z){ return z.word; })[0];
      return { ok:false, msg:w ? w.fb : "Both sides head to the same number, so the limit exists. Which number is it?" };
    }
    var v = num1(raw); if (v == null) return { err:"Type a number, such as 4, 0.5 or 1/2." };
    var good = it.dp != null ? Math.abs(v - ans) <= 0.5 * Math.pow(10, -it.dp) + 1e-12 : close(v, ans, 1e-9);
    if (good) return { ok:true };
    w = (it.wrong || []).filter(function(z){ return z.match && z.match.some(function(t){ return close(v, t, 1e-9); }); })[0];
    return { ok:false, msg:w ? w.fb : md(TGEN[it.id]) };
  }
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.tb) return;
    var box = t.closest("[data-tq]"); ist(box.dataset.tq).v[t.dataset.tb] = t.value; api.save();
  });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.tb) return; var box = e.target.closest("[data-tq]"); var b = box && box.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-tq]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.tq; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; $$("input", box).forEach(function(inp){ inp.disabled = true; }); }
    else { x.tries++; msgs[it.id] = { bad:true, html:r.msg + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: build a limit puzzle ----------
var task = (function(){
  var api, plot;
  function read(){
    var s = api ? api.S : {};
    function g(k){ var t = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -5 && v <= 5 ? v : null; }
    var M = g("m"), Bb = g("b"), C = g("c");
    return { m:M, b:Bb, c:C, valid:M !== null && Bb !== null && C !== null };
  }
  function draw(){
    var d = read(), base = { xmin:-3, xmax:5.5, ymin:-6, ymax:8 };
    if (!d.valid) { plot.draw({ view:base, points:[{ x:2, y:5, r:5.5, color:css("--pen"), label:"(2, 5)" }], describe:"The filled dot (2, 5). Enter whole numbers from −5 to 5 for m, b and c to draw both pieces." }); return; }
    var lL = 2 * d.m + d.b, lR = 4 + d.c;
    var v = { xmin:-3, xmax:5.5, ymin:Math.min(-2, lL - 2.5, lR - 2.5), ymax:Math.max(8, lL + 3, lR + 3) };
    var pts = [{ x:2, y:lL, open:true, color:css("--pen"), r:5.5 }, { x:2, y:lR, open:true, color:css("--pen"), r:5.5 }, { x:2, y:5, color:css("--pen"), r:5.5, label:"(2, 5)" }];
    plot.draw({ view:v, curves:[{ f:function(x){ return d.m * x + d.b; }, domain:[-10, 2], color:css("--pen"), width:3 }, { f:function(x){ return x * x + d.c; }, domain:[2, 10], color:css("--pen"), width:3 }], points:pts,
      describe:"Left piece y = " + MV.plain(m(linSrc(d.m, d.b))) + " for x < 2, ending at an open circle at (2, " + ntx(lL) + "). Right piece y = x² " + (d.c < 0 ? "− " + Math.abs(d.c) : "+ " + d.c) + " for x > 2, starting at an open circle at (2, " + ntx(lR) + "). Filled dot at (2, 5)." });
  }
  function readout(){
    var d = read(), el = $("#lp-read"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Enter whole numbers from −5 to 5 for ' + m("m") + ", " + m("b") + " and " + m("c") + ".</dd></div>"; return; }
    var lL = 2 * d.m + d.b, lR = 4 + d.c, ex = lL === lR;
    el.innerHTML = MV.readoutHTML([
      ["Left-hand limit " + lim("x → 2^{-}") + " " + m("f(x)"), m("2m + b = " + nsrc(lL))],
      ["Right-hand limit " + lim("x → 2^{+}") + " " + m("f(x)"), m("4 + c = " + nsrc(lR))],
      ["Limit " + lim("x → 2") + " " + m("f(x)"), ex ? "<strong>" + ntx(lL) + "</strong>" : "<strong>does not exist</strong> (the sides disagree)"],
      [m("f(2)"), "5"]
    ]);
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.m == null) { a.S.m = "1"; a.S.b = "0"; a.S.c = "0"; }
      inp.innerHTML = '<div class="inrow">' + ["m", "b", "c"].map(function(k){ return '<label for="lp-' + k + '"><span>' + m(k) + ' <span class="tiny muted">(−5 to 5)</span></span><input id="lp-' + k + '" data-lp="' + k + '" type="number" min="-5" max="5" step="1" autocomplete="off" value="' + MV.esc(a.S[k]) + '"></label>'; }).join("") + "</div>";
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="lp-plot" role="img" aria-label="Your piecewise function"></canvas></div><dl class="read" id="lp-read" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#lp-plot"), { xmin:-3, xmax:5.5, ymin:-6, ymax:8 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.lp; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); a.update(); });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers from −5 to 5 for m, b and c."; },
    checks:function(d){ if (!d.valid) return [false, false, false]; var lR = 4 + d.c; return [2 * d.m + d.b === lR, lR > 0 && lR < 3, d.m < 0]; },
    key:function(d){ return d.m + "," + d.b + "," + d.c; },
    label:function(k){ return "(" + k.split(",").map(function(v){ return ntx(+v); }).join(", ") + ")"; },
    text:function(k){ var p = k.split(","); return "m = " + ntx(+p[0]) + ", b = " + ntx(+p[1]) + ", c = " + ntx(+p[2]); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ read:readAct, tables:tablesAct },
  task:task
});
})();
