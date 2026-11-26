// MCV4U 08 Derivatives from First Principles: hero storyboard; difference-quotient engine (Explore: Numbers first table,
// Simplify first move menu with two traps, challenge 3 workbench); pattern hunter (Part 3: power table with Pascal's row 4,
// conjecture, zoom lens on non-differentiable points); wrong-order feedback for "Put the steps in order"; "First principles
// by the numbers" boxes (Practice 2); "Hilltop at x = 2" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, Q = MV.mcv.Q, rpow = MV.mcv.rpow;
function m(s){ return MV.m(s); }
function md(h){ return MV.md(h); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function nsrc(v){ return String(r9(v)); }                          // number as m() source (a hyphen becomes a true minus)
function ntx(v, dp){ return num(v, dp == null ? 4 : dp); }            // number as text (true minus)
function close(a, b, t){ return Math.abs(a - b) <= (t || 1e-9); }
function isDec(v){ var s = v * 1e4; return Math.abs(Math.round(s) - s) < 1e-6; }
// m() source for an exact value: a decimal with at most 4 places, otherwise a fraction
function vsrc(v){
  v = r9(v);
  if (isDec(v)) return nsrc(Math.round(v * 1e4) / 1e4);
  var q = Q.of(v);
  return q && q.d <= 9999 ? Q.src(q) : nsrc(Math.round(v * 1e4) / 1e4);
}
function vtx(v){ return MV.plain(m(vsrc(v))); }
function par(s){ return String(s).charAt(0) === "-" ? "(" + s + ")" : s; }
// linear combination [[coef, "x"], [coef, ""], …] -> "6x - 5 + 3h"
function lin(parts){
  var out = "";
  parts.forEach(function(p){
    var x = r9(p[0]); if (!x) return;
    var ax = Math.abs(x), body = p[1] ? (ax === 1 ? "" : vsrc(ax)) + p[1] : vsrc(ax);
    out += out ? (x < 0 ? " - " : " + ") + body : (x < 0 ? "-" : "") + body;
  });
  return out || "0";
}
// polynomial from coefficients c[k] of v^k; desc:true writes the highest power first
function polySrc(c, v, desc){
  var parts = c.map(function(x, k){ return [x, k === 0 ? "" : v + (k > 1 ? "^" + k : "")]; });
  return lin(desc ? parts.reverse() : parts);
}
// canvas label with a sheet-coloured backing
function cLabel(ctx, text, X, Y, o){
  o = o || {};
  ctx.save(); ctx.font = (o.font || "600 13px ") + (css("--font-ui") || "sans-serif"); ctx.textBaseline = "middle"; ctx.textAlign = o.align || "left";
  var w = ctx.measureText(text).width, x0 = o.align === "right" ? X - w : o.align === "center" ? X - w / 2 : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.9; ctx.fillRect(x0 - 4, Y - 10, w + 8, 20); ctx.globalAlpha = 1;
  ctx.fillStyle = o.color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}

// @component exactDec (copied from MCV4U 02) — exact rationals (BigInt) for values and difference quotients, printed as exact
// decimals (7.003, not 7.0029999…); of(v) reads any decimal up to 12 places exactly; decS() adds "≈ " when it had to round.
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
    return { s:(neg && /[1-9]/.test(str) ? MV.MINUS : "") + str, exact:exact };
  }
  function decS(a, maxDp, rDp){ var r = dec(a, maxDp, rDp); return (r.exact ? "" : "≈ ") + r.s; }
  return { of:of, add:add, sub:sub, mul:mul, div:div, abs:qabs, toNum:toNum, dec:dec, decS:decS };
})();

// ---------- polynomials ----------
function binom(n, k){ var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
// Taylor coefficients at a: d[k] = f^(k)(a)/k!  (so the difference quotient at x = a is d1 + d2 h + d3 h^2)
function taylor(c, a){ var d = []; for (var k = 0; k < c.length; k++) { var s = 0; for (var j = k; j < c.length; j++) s += c[j] * binom(j, k) * Math.pow(a, j - k); d.push(r9(s)); } return d; }
function pval(c, x){ var s = 0; for (var k = c.length - 1; k >= 0; k--) s = s * x + c[k]; return s; }
function pvalQ(c, X){ var s = XQ.of(0); for (var k = c.length - 1; k >= 0; k--) s = XQ.add(XQ.mul(s, X), c[k]); return s; }

// ---------- the engine's functions and their algebra (stored as data; no computer algebra) ----------
// Each step: {mv (the move that produces it), e (m() source), n (note), den (h still in the denominator), first (wrong line
// for the "first term only" trap)}. Polynomials may also cancel straight after subtracting (dividing every term).
var START = { e:"{f(x + h) - f(x)}/{h}", n:"The difference quotient: the slope of the secant over a run of `h`. Choose a move.", den:false };
function S_(mv, e, n, o){ var s = { mv:mv, e:e, n:n, den:true }; if (o) Object.keys(o).forEach(function(k){ s[k] = o[k]; }); return s; }
var NT = { write:"Replace every `x` with `(x + h)`.", sub:"The `f(x)` terms cancel. Every term left has a factor of `h`.", factor:"Factor out `h`.",
  cancel:"Cancel `h`. That’s allowed because `h ≠ 0`.", lim:"Let `h → 0`: every term with an `h` vanishes." };
function polySteps(o){
  return [S_("write", o.w, NT.write), S_("expand", o.x, o.xn), S_("sub", o.s, NT.sub, { first:o.first }), S_("factor", o.f, NT.factor),
    S_("cancel", o.c, NT.cancel, { den:false }), S_("lim", o.l, NT.lim, { den:false })];
}
var FN = {
  sq:{ kind:"poly", chip:"x^2", eq:"f(x) = x^2", cf:[0, 0, 1], a0:2, simp:"2x + h", der:"2x", zero:"{(x + 0)^2 - x^2}/{0} = {0}/{0}",
    steps:polySteps({ w:"{(x + h)^2 - x^2}/{h}", x:"{x^2 + 2xh + h^2 - x^2}/{h}", xn:"Expand: `(x + h)^2 = x^2 + 2xh + h^2`.", s:"{2xh + h^2}/{h}",
      f:"{h(2x + h)}/{h}", c:"2x + h", l:"f′(x) = 2x", first:"2x + h^2" }) },
  cube:{ kind:"poly", chip:"x^3", eq:"f(x) = x^3", cf:[0, 0, 0, 1], a0:1, simp:"3x^2 + 3xh + h^2", der:"3x^2", zero:"{(x + 0)^3 - x^3}/{0} = {0}/{0}",
    steps:polySteps({ w:"{(x + h)^3 - x^3}/{h}", x:"{x^3 + 3x^2h + 3xh^2 + h^3 - x^3}/{h}", xn:"Expand with Pascal’s row 1 3 3 1.", s:"{3x^2h + 3xh^2 + h^3}/{h}",
      f:"{h(3x^2 + 3xh + h^2)}/{h}", c:"3x^2 + 3xh + h^2", l:"f′(x) = 3x^2", first:"3x^2 + 3xh^2 + h^3" }) },
  qd:{ kind:"poly", chip:"3x^2 - 5x", eq:"f(x) = 3x^2 - 5x", cf:[0, -5, 3], a0:2, simp:"6x - 5 + 3h", der:"6x - 5", zero:"{3(x + 0)^2 - 5(x + 0) - (3x^2 - 5x)}/{0} = {0}/{0}",
    steps:polySteps({ w:"{3(x + h)^2 - 5(x + h) - (3x^2 - 5x)}/{h}", x:"{3x^2 + 6xh + 3h^2 - 5x - 5h - 3x^2 + 5x}/{h}", xn:"Expand both brackets, and distribute the minus sign over `f(x)`.",
      s:"{6xh - 5h + 3h^2}/{h}", f:"{h(6x - 5 + 3h)}/{h}", c:"6x - 5 + 3h", l:"f′(x) = 6x - 5", first:"6x - 5h + 3h^2" }) },
  gen:{ kind:"poly", gen:true, chip:"ax^2 + bx + c", a0:1, simp:"2ax + b + ah", der:"2ax + b", zero:"{f(x + 0) - f(x)}/{0} = {0}/{0}",
    steps:polySteps({ w:"{a(x + h)^2 + b(x + h) + c - (ax^2 + bx + c)}/{h}", x:"{ax^2 + 2axh + ah^2 + bx + bh + c - ax^2 - bx - c}/{h}", xn:"Expand, and distribute the minus sign over `f(x)`.",
      s:"{2axh + bh + ah^2}/{h}", f:"{h(2ax + b + ah)}/{h}", c:"2ax + b + ah", l:"f′(x) = 2ax + b", first:"2ax + bh + ah^2" }) },
  rec:{ kind:"rec", chip:"{1}/{x}", eq:"f(x) = {1}/{x}", a0:1, aMin:-4, aMax:4, skip:[0], simp:"-{1}/{x(x + h)}", der:"-{1}/{x^2}", zero:"{{1}/{x + 0} - {1}/{x}}/{0} = {0}/{0}",
    steps:[S_("write", "{{1}/{x + h} - {1}/{x}}/{h}", NT.write),
      S_("cd", "{{x - (x + h)}/{x(x + h)}}/{h}", "Combine the fractions over the common denominator `x(x + h)`."),
      S_("sub", "{{-h}/{x(x + h)}}/{h}", "Simplify the top: `x - (x + h) = -h`."),
      S_("cancel", "-{1}/{x(x + h)}", "Divide by `h`: the `h` on top cancels (`h ≠ 0`).", { den:false }),
      S_("lim", "f′(x) = -{1}/{x^2}", "Let `h → 0`: `x(x + h) → x^2`.", { den:false })] },
  rt:{ kind:"rt", chip:"√x", eq:"f(x) = √x", a0:4, aMin:0.5, aMax:36, simp:"{1}/{√{x + h} + √x}", der:"{1}/{2√x}", zero:"{√{x + 0} - √x}/{0} = {0}/{0}",
    steps:[S_("write", "{√{x + h} - √x}/{h}", NT.write),
      S_("conj", "{(x + h) - x}/{h(√{x + h} + √x)}", "Multiply top and bottom by the conjugate `√{x + h} + √x`. The roots on top square away."),
      S_("sub", "{h}/{h(√{x + h} + √x)}", "Simplify the top: `(x + h) - x = h`."),
      S_("cancel", "{1}/{√{x + h} + √x}", "Cancel `h` (`h ≠ 0`).", { den:false }),
      S_("lim", "f′(x) = {1}/{2√x}", "Let `h → 0`: the bottom becomes `√x + √x = 2√x`.", { den:false })] },
  abs:{ kind:"abs", chip:"|x|", eq:"f(x) = |x|", a0:0, zero:"{|x + 0| - |x|}/{0} = {0}/{0}",
    steps:[S_("write", "{|x + h| - |x|}/{h}", NT.write),
      S_("lim", "f′(x) = 1 for x > 0;  f′(x) = -1 for x < 0", "For `x > 0` and small `h` the top is `h`, so the quotient is 1; for `x < 0` it’s `-h`, so −1. At `x = 0` the quotient is `{|h|}/{h}`: 1 from the right, −1 from the left, so `f′(0)` does not exist.", { den:false })] }
};
var ORDER = ["sq", "cube", "qd", "gen", "rec", "rt", "abs"];
var HS = [1, 0.1, 0.01, 0.001, -0.001, -0.01, -0.1, -1];
var MOVES = [
  { id:"write", t:"Write " + m("f(x + h)") }, { id:"expand", t:"Expand" }, { id:"sub", t:"Subtract " + m("f(x)") },
  { id:"cd", t:"Common denominator" }, { id:"conj", t:"Multiply by the conjugate" }, { id:"factor", t:"Factor out " + m("h") },
  { id:"first", t:"Cancel " + m("h") + " from the first term only" }, { id:"cancel", t:"Cancel " + m("h") + " (" + m("h ≠ 0") + ")" },
  { id:"zero", t:"Let " + m("h = 0") + " now" }, { id:"lim", t:"Let " + m("h → 0") }
];
var MNAME = {}; MOVES.forEach(function(x){ MNAME[x.id] = x.t; });
var TRAP = { zero:"That gives 0/0, which tells you nothing yet. Cancel `h` first.", first:"Every term on top has a factor of `h`; divide each one." };
var ABS = "`|x + h|` can’t be expanded or split, so there’s no `h` to cancel for every `x` at once. Let `h → 0` on each side instead.";
var CANC = "`h` has already been cancelled.";
function idx(F, mv){ for (var i = 0; i < F.steps.length; i++) if (F.steps[i].mv === mv) return i; return -1; }
// -> {ok, to, note} | {trap, e} | {no:reason}
function tryMove(F, st, mv){
  var n = F.steps.length, cur = st ? F.steps[st - 1] : START;
  if (st >= n) return { no:"you’ve already reached `f′(x)`. Press <strong>Start over</strong> to try again." };
  if (F.steps[st].mv === mv) return { ok:true, to:st + 1 };
  if (st === 0) return { no:"write `f(x + h)` first: replace every `x` in the rule with `(x + h)`." };
  if (mv === "write") return { no:"`f(x + h)` is already written." };
  if (mv === "zero") return cur.den ? { trap:"zero", e:F.zero } : { no:"`h` is never 0 in a limit. Now that `h` is cancelled, use Let `h → 0`." };
  if (F.kind === "poly" && mv === "cancel" && st === idx(F, "factor")) return { ok:true, to:idx(F, "cancel") + 1, note:"Divide every term by `h`. That’s allowed because `h ≠ 0`." };
  if (mv === "first" && cur.first) return { trap:"first", e:cur.first };
  return { no:reason(F, st, mv) };
}
function reason(F, st, mv){
  var k = F.kind, did = function(x){ var i = idx(F, x); return i >= 0 && st > i; };
  switch (mv) {
    case "expand":
      if (k === "rec" && !did("cd")) return "there are no brackets to multiply out. The fractions need a common denominator.";
      if (k === "rt" && !did("conj")) return "a square root can’t be expanded: `√{x + h}` isn’t `√x + √h`. Use the conjugate.";
      if (k === "abs") return "an absolute value can’t be expanded: `|x + h|` isn’t `|x| + |h|`.";
      return "there’s nothing left to expand.";
    case "sub":
      if (did("sub")) return "`f(x)` has already been subtracted.";
      if (k === "poly") return "expand `f(x + h)` first, so you can see which terms cancel.";
      if (k === "rec") return "the fractions have different denominators. Find a common denominator first.";
      if (k === "rt") return "the roots won’t cancel by subtracting. Multiply by the conjugate first.";
      return ABS;
    case "cd": return k === "rec" ? "the fractions already share a denominator." : "there are no fractions to combine.";
    case "conj": return k === "rt" ? "the roots are already cleared from the top." : "there are no square roots to clear.";
    case "factor":
      if (did("cancel")) return CANC;
      if (did("factor")) return "`h` has already been factored out.";
      if (k === "abs") return ABS;
      if (!did("sub")) return k === "poly" ? "subtract `f(x)` first, so every term on top has a factor of `h`." : "simplify the top first; then you’ll see the factor of `h`.";
      return "the top, `" + (k === "rec" ? "-h" : "h") + "`, is already a single factor of `h`. Cancel it.";
    case "cancel":
      if (did("cancel")) return CANC;
      if (k === "abs") return ABS;
      return k === "poly" ? "not every term on top has a factor of `h` yet. Subtract `f(x)` first." :
        "there’s no factor of `h` on top yet. " + (k === "rec" ? "Combine the fractions and simplify the top first." : "Multiply by the conjugate and simplify the top first.");
    case "first":
      if (did("cancel")) return CANC;
      if (k === "abs") return ABS;
      if (k === "poly" && did("factor")) return "the top is one product, `h(…)`. Cancel the `h` from the whole top.";
      if (!did("sub")) return k === "poly" ? "subtract `f(x)` first, so every term on top has a factor of `h`." : "there’s no factor of `h` on top yet.";
      return "there’s only one term on top. Cancel its `h`.";
    case "lim": return "`h` is still in the denominator, so letting `h → 0` heads to 0/0. Cancel `h` first.";
  }
  return "that move isn’t possible here.";
}
function sqr(a){ var s = Math.sqrt(a); return close(s, Math.round(s), 1e-12) ? Math.round(s) : null; }   // root of a perfect square, else null

// ---------- Explore: the difference-quotient engine ----------
// var eng = engine(host, {S, save, changed}); eng.apply({fn, mode, a, h, clear, alg:"reset"|"write"}), eng.pressH(h, cb),
// eng.seqH([h…], cb), eng.move(mv, cb), eng.seqMoves([mv…], cb), eng.lock(bool), eng.check(id), eng.paint()
function engine(host, o){
  var S = o.S;
  S.fn = FN[S.fn] ? S.fn : "qd"; S.mode = S.mode === "simp" ? "simp" : "num";
  S.a = S.a && typeof S.a === "object" ? S.a : {}; S.h = typeof S.h === "number" && S.h ? r9(S.h) : 1;
  S.rows = S.rows && typeof S.rows === "object" ? S.rows : {}; S.alg = S.alg && typeof S.alg === "object" ? S.alg : {};
  S.cf = Array.isArray(S.cf) && S.cf.length === 3 ? S.cf : [-3, 2, 1]; S.wb = S.wb || { mt:"", mb:"", bt:"", bb:"" }; S.all = !!S.all;
  var locked = false, anim = null, A = { h:null }, fb = null, lastA = null;
  host.innerHTML = '<div class="fp-eng">' +
    '<div class="fp-top"><p class="fp-lab" id="fp-fnlab">Function</p><div class="chips fp-fns" role="group" aria-labelledby="fp-fnlab"></div>' +
      '<div class="fp-coef" hidden><span class="fp-lab">Coefficients of ' + m("ax^2 + bx + c") + ' <span class="tiny muted">(whole numbers, −9 to 9)</span></span><span class="fp-cfrow">' +
        ["a", "b", "c"].map(function(k, i){ return '<label class="fp-cfl"><span>' + m(k) + '</span><input type="number" class="numin fp-cfin" data-cf="' + (2 - i) + '" min="-9" max="9" step="1" autocomplete="off" aria-label="Coefficient ' + k + '"></label>'; }).join("") + "</span></div>" +
      '<div class="fp-mode"></div></div>' +
    '<div class="fp-main" data-mv="graph"><p class="banner fp-banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="fp-work">' +
        '<div class="fp-num"><p class="fp-lab" id="fp-hlab">Press an ' + m("h") + ' chip to add a row</p><div class="chips fp-hch" role="group" aria-labelledby="fp-hlab"></div>' +
          '<p class="tiny muted fp-tcap"></p><div class="fp-tbl"></div><div class="q-actions"><button type="button" class="btn ghost sm" data-act="clear" data-k="fpclear">Clear the table</button></div></div>' +
        '<div class="fp-simp" hidden><p class="fp-lab">The algebra</p><ol class="fp-hist" aria-live="polite"></ol><button type="button" class="btn ghost sm fp-showall" data-act="all" data-k="fpall">Show all lines</button>' +
          '<p class="fp-lab" id="fp-mlab">Choose the next move</p><div class="fp-moves" role="group" aria-labelledby="fp-mlab">' +
            MOVES.map(function(x){ return '<button type="button" class="fp-mv" data-mv="' + x.id + '" data-k="fpm' + x.id + '">' + x.t + "</button>"; }).join("") + "</div>" +
          '<div class="fp-mfb" aria-live="polite"></div><div class="fp-acts"><span class="fp-cnt"></span><button type="button" class="btn ghost sm" data-act="restart" data-k="fprestart">Start over</button></div></div>' +
      "</div>" +
      '<div class="fp-gcol"><div class="eq-cap fp-cap" aria-live="polite"></div><div class="plot-wrap"><canvas class="plot" role="img" aria-label="Graph of the chosen function with the secant and tangent at P"></canvas></div>' +
        '<label class="slider fp-asl"><span class="slider-top"><span>Point ' + m("P") + " at " + m("x = a") + '</span><output class="fp-aout"></output></span><input type="range" class="fp-a" step="0.5" style="accent-color:var(--ink)"></label></div>' +
    "</div>" +
    '<dl class="read fp-read" aria-live="polite"></dl>' +
    '<div class="fp-wb"><h3 class="fp-wbh">Challenge 3 workbench</h3><p class="tiny muted">The tangent to ' + m("y = √x") + ' as ' + m("y = mx + b") + '. Type fractions top over bottom; leave a bottom box empty for a whole number.</p>' +
      '<div class="fp-wbr"><span class="m">y =</span>' + fbox("m", "slope m") + '<span class="m"><i>x</i> +</span>' + fbox("b", "intercept b") + "</div></div>" +
    "</div>";
  function fbox(k, lab){
    return '<span class="fp-fbx" role="group" aria-label="' + lab + '"><input class="numin fp-fbin" data-wb="' + k + 't" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + lab + ', top" value="' + MV.esc(S.wb[k + "t"]) + '">' +
      '<span class="fp-fbar" aria-hidden="true"></span><input class="numin fp-fbin" data-wb="' + k + 'b" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + lab + ', bottom (leave empty for a whole number)" value="' + MV.esc(S.wb[k + "b"]) + '"></span>';
  }
  var q = function(sel){ return $(sel, host); };
  var E = { fns:q(".fp-fns"), coef:q(".fp-coef"), num:q(".fp-num"), simp:q(".fp-simp"), hch:q(".fp-hch"), tcap:q(".fp-tcap"), tbl:q(".fp-tbl"), hist:q(".fp-hist"),
    all:q(".fp-showall"), moves:q(".fp-moves"), mfb:q(".fp-mfb"), cnt:q(".fp-cnt"), cap:q(".fp-cap"), canvas:q(".fp-gcol canvas"), asl:q(".fp-a"), aout:q(".fp-aout"), read:q(".fp-read") };
  var plot = new MV.Plot(E.canvas, { xmin:-4, xmax:4, ymin:-4, ymax:4 });
  var modeSeg = MV.seg(q(".fp-mode"), { label:"Mode:", value:S.mode, options:[{ id:"num", t:"Numbers first" }, { id:"simp", t:"Simplify first" }],
    onChange:function(v){ if (locked) { modeSeg.set(S.mode); return; } S.mode = v; fb = null; save(); paint(); } });

  // ---- model ----
  function F(){ return FN[S.fn]; }
  function cf(Fx){ return Fx.gen ? S.cf : Fx.cf; }
  function fv(Fx, x){ if (Fx.kind === "poly") return pval(cf(Fx), x); if (Fx.kind === "rec") return x === 0 ? NaN : 1 / x; if (Fx.kind === "rt") return x < 0 ? NaN : Math.sqrt(x); return Math.abs(x); }
  function fq(Fx, x){ var X = XQ.of(x); if (Fx.kind === "poly") return pvalQ(cf(Fx), X); if (Fx.kind === "rec") return x === 0 ? null : XQ.div(1, X); if (Fx.kind === "abs") return XQ.abs(X); return null; }
  function aV(id){ id = id || S.fn; var v = S.a[id]; return typeof v === "number" ? v : FN[id].a0; }
  function alg(id){ id = id || S.fn; var x = S.alg[id]; if (!x || !Array.isArray(x.log)) x = S.alg[id] = { st:0, log:[], moves:0, traps:{} }; x.traps = x.traps || {}; return x; }
  function done(id){ return alg(id).st >= FN[id || S.fn].steps.length; }
  function key(){ return S.fn + "|" + aV(); }
  function rows(){ return S.rows[key()] || (S.rows[key()] = []); }
  function eqSrc(){ var Fx = F(); return Fx.gen ? "f(x) = " + polySrc(S.cf, "x", true) : Fx.eq; }
  function slopeV(Fx, a){ if (Fx.kind === "poly") return taylor(cf(Fx), a)[1]; if (Fx.kind === "rec") return -1 / (a * a); if (Fx.kind === "rt") return 1 / (2 * Math.sqrt(a)); return a > 0 ? 1 : a < 0 ? -1 : null; }
  function slopeS(Fx, a){
    var v = slopeV(Fx, a); if (v == null) return null;
    if (Fx.kind === "rt" && sqr(a) == null) return { s:"{1}/{2√{" + nsrc(a) + "}} ≈ " + ntx(v, 4), t:"≈ " + ntx(v, 4) };
    return { s:vsrc(v), t:vtx(v) };
  }
  function tanSrc(Fx, a){
    var v = slopeV(Fx, a); if (v == null) return null;
    var b = fv(Fx, a) - v * a;
    if (Fx.kind === "rt" && sqr(a) == null) return "y ≈ " + ntx(v, 4) + "x + " + ntx(b, 4);
    return "y = " + lin([[v, "x"], [b, ""]]);
  }
  function simpAt(Fx, a){
    if (Fx.kind === "poly") return polySrc(taylor(cf(Fx), a).slice(1), "h");
    if (Fx.kind === "rec") return "{-1}/{" + (a === 1 ? "" : par(vsrc(a))) + (a === 1 ? polySrc([a, 1], "h") : "(" + polySrc([a, 1], "h") + ")") + "}";
    if (Fx.kind === "rt") { var s = sqr(a); return "{1}/{√{" + polySrc([a, 1], "h") + "} + " + (s != null ? s : "√{" + nsrc(a) + "}") + "}"; }
    return a === 0 ? "{|h|}/{h}" : a > 0 ? "1" : "-1";
  }
  function faTxt(Fx, a){ if (Fx.kind === "rt") { var s = sqr(a); return s != null ? ntx(s) : "≈ " + ntx(Math.sqrt(a), 4); } return XQ.decS(fq(Fx, a), 9, 4); }
  // one table row: f(a + h) and the difference quotient (exact where possible, up to 4 decimals)
  function rowV(h){
    var Fx = F(), a = aV(), x2 = r9(a + h), y2 = fv(Fx, x2);
    if (!isFinite(y2)) return { undef:true };
    if (Fx.kind === "rt") { var sb = Math.sqrt(x2), qv = 1 / (sb + Math.sqrt(a)); return { fs:sqr(x2) != null ? ntx(sqr(x2)) : "≈ " + ntx(sb, 4), ds:"≈ " + ntx(qv, 4), dv:qv }; }
    var d = XQ.div(XQ.sub(fq(Fx, x2), fq(Fx, a)), h);
    return { fs:XQ.decS(fq(Fx, x2), 9, 4), ds:XQ.decS(d, 4, 4), dv:XQ.toNum(d) };
  }
  function known(){ var Fx = F(); if (slopeV(Fx, aV()) == null) return false; return done() || rows().some(function(h){ return Math.abs(h) <= 0.001 + 1e-12; }); }
  function save(){ o.save(); if (o.changed) o.changed(); }
  function stopAnim(){ if (anim) anim(); anim = null; A.h = null; }

  // ---- graph ----
  var VIEWS = { sq:{ xmin:-3.8, xmax:4.2, ymin:-2, ymax:13 }, cube:{ xmin:-3.4, xmax:3.4, ymin:-14, ymax:14 }, qd:{ xmin:-3.6, xmax:3.8, ymin:-6, ymax:24 },
    rec:{ xmin:-4.6, xmax:4.6, ymin:-4.5, ymax:4.5 }, abs:{ xmin:-3.6, xmax:3.6, ymin:-1.2, ymax:4.2 } };
  function view(){
    var Fx = F(), a = aV(), v;
    if (Fx.kind === "rt") v = a <= 9.5 ? { xmin:-0.8, xmax:10.6, ymin:-0.7, ymax:3.9 } : { xmin:-1.6, xmax:38, ymin:-0.9, ymax:7 };
    else if (Fx.gen) {
      var lo = 0, hi = 0; for (var x = -3.5; x <= 3.5; x += 0.5) { var y = fv(Fx, x); lo = Math.min(lo, y); hi = Math.max(hi, y); }
      lo = Math.max(lo, -40); hi = Math.min(hi, 40); if (hi - lo < 6) { hi += 3; lo -= 3; }
      var pd = (hi - lo) * 0.08; v = { xmin:-3.8, xmax:3.8, ymin:lo - pd, ymax:hi + pd };
    } else v = VIEWS[S.fn];
    var ya = fv(Fx, a), hh = v.ymax - v.ymin, pad = hh * 0.1;
    if (ya > v.ymax - pad) v = { xmin:v.xmin, xmax:v.xmax, ymin:ya + pad - hh, ymax:ya + pad };
    else if (ya < v.ymin + pad) v = { xmin:v.xmin, xmax:v.xmax, ymin:ya - pad, ymax:ya - pad + hh };
    return v;
  }
  function draw(){
    var Fx = F(), a = aV(), v = view(), ya = fv(Fx, a), h = A.h != null ? A.h : S.h, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen");
    var sc = { view:v, lines:[], points:[], curves:[] }, leg = [];
    if (Fx.kind === "abs") sc.curves.push({ pts:[[v.xmin - 1, Math.abs(v.xmin - 1)], [0, 0], [v.xmax + 1, Math.abs(v.xmax + 1)]], color:pen, width:3 });
    else sc.curves.push({ f:function(x){ return fv(Fx, x); }, color:pen, width:3, domain:Fx.kind === "rt" ? [0, 1e6] : null });
    var desc = "Graph of " + MV.plain(m(eqSrc())) + ". P(" + ntx(a) + ", " + MV.plain(faTxt(Fx, a)) + ").";
    var x2 = r9(a + h), y2 = fv(Fx, x2);
    if (isFinite(y2) && Math.abs(h) > 1e-12) {
      sc.lines.push({ p:[a, ya], q:[x2, y2], color:ink2, width:2 });
      if (x2 >= v.xmin && x2 <= v.xmax && y2 >= v.ymin && y2 <= v.ymax) sc.points.push({ x:x2, y:y2, color:ink2, r:5, label:Math.abs(h) > (v.xmax - v.xmin) * 0.07 ? "Q" : "" });
      var sT = A.h != null ? ntx((y2 - ya) / h, 3) : rowV(h).ds;
      leg.push({ t:"secant (h = " + ntx(h) + "): slope " + sT, c:ink2, dash:false });
      desc += " Secant from x = " + ntx(a) + " to x = " + ntx(x2) + ", slope " + sT + ".";
    } else if (Math.abs(h) > 1e-12) { leg.push({ t:"h = " + ntx(h) + ": Q is outside the domain", c:ink2 }); desc += " Q would be at x = " + ntx(x2) + ", outside the domain."; }
    if (A.h == null && known()) {
      var sv = slopeV(Fx, a), sS = slopeS(Fx, a);
      sc.lines.push({ p:[a, ya], q:[a + 1, ya + sv], color:ink, width:2.2 });
      leg.push({ t:"tangent: slope " + sS.t, c:ink });
      desc += " The tangent at P has slope " + sS.t + ".";
    } else if (Fx.kind === "abs" && a === 0 && (done() || rows().length > 1)) { leg.push({ t:"no tangent at the corner", c:ink }); desc += " There is no tangent at the corner."; }
    sc.points.push({ x:a, y:ya, color:ink, r:5.5, label:"P", below:ya > v.ymax - (v.ymax - v.ymin) * 0.12 });
    sc.after = function(ctx, pl){
      if (!leg.length) return;
      var X = pl.X(a), Y = pl.Y(ya), topLeft = !(X < pl.W * 0.55 && Y < pl.H * 0.42), x0 = topLeft ? 10 : pl.W - 10, y0 = topLeft ? 16 : pl.H - 16 - (leg.length - 1) * 22;
      leg.forEach(function(l, i){
        var yy = y0 + i * 22;
        ctx.save(); ctx.font = "600 13px " + (css("--font-ui") || "sans-serif");
        var w = ctx.measureText(l.t).width + 30, lx = topLeft ? x0 : x0 - w;
        ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.9; ctx.fillRect(lx - 4, yy - 10, w + 8, 20); ctx.globalAlpha = 1;
        ctx.strokeStyle = l.c; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(lx, yy); ctx.lineTo(lx + 22, yy); ctx.stroke();
        ctx.fillStyle = l.c; ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillText(l.t, lx + 30, yy); ctx.restore();
      });
    };
    sc.describe = desc;
    plot.draw(sc);
  }
  plot.render = draw;

  // ---- panels ----
  function histItems(){
    var Fx = F(), Al = alg(), st = 0, out = [{ e:START.e, tag:"Start", n:START.n }];
    Al.log.forEach(function(tok){
      var trap = tok.charAt(0) === "!", mv = trap ? tok.slice(1) : tok, r = tryMove(Fx, st, mv);
      if (trap && r.trap) out.push({ e:r.e, tag:MNAME[mv], dead:true, n:TRAP[mv] });
      else if (r.ok) { st = r.to; out.push({ e:Fx.steps[st - 1].e, tag:MNAME[mv], n:r.note || Fx.steps[st - 1].n }); }
    });
    return out;
  }
  function curLine(){ var Fx = F(), st = alg().st; return st ? Fx.steps[st - 1].e : START.e; }
  function paintNum(){
    var Fx = F(), a = aV(), r = rows();
    MV.keepFocus(E.hch, function(){
      E.hch.innerHTML = HS.map(function(h){ var on = S.h === h && r.indexOf(h) >= 0; return '<button type="button" class="chip fp-hc' + (on ? " on" : "") + '" data-h="' + h + '" data-k="fph' + h + '" aria-pressed="' + on + '"' + (locked ? " disabled" : "") + ">" + ntx(h) + "</button>"; }).join("");
    });
    E.tcap.innerHTML = "From " + m("P") + "(" + ntx(a) + ", " + faTxt(Fx, a) + "). Each row moves " + m("Q") + " to " + m("x = " + nsrc(a) + " + h") + ".";
    if (!r.length) { E.tbl.innerHTML = '<p class="muted fp-empty">No rows yet.</p>'; return; }
    var body = r.map(function(h){ var x = rowV(h); return [ntx(h), x.undef ? '<span class="muted">undefined</span>' : x.fs, x.undef ? '<span class="muted">undefined</span>' : "<strong>" + x.ds + "</strong>"]; });
    E.tbl.innerHTML = MV.tableHTML({ head:[m("h"), m("f(" + nsrc(a) + " + h)"), "Difference quotient " + m("{f(" + nsrc(a) + " + h) - f(" + nsrc(a) + ")}/{h}")], rows:body,
      hiRow:r.indexOf(S.h), caption:"Difference quotients at a = " + ntx(a) + ", one row per h chip pressed" });
  }
  function paintSimp(){
    var items = histItems(), n = items.length, lastOk = -1;
    items.forEach(function(it, i){ if (!it.dead) lastOk = i; });
    E.hist.classList.toggle("fp-allon", S.all);
    E.hist.innerHTML = items.map(function(it, i){
      var cls = "fp-ln" + (it.dead ? " fp-dead" : "") + (i === lastOk ? " cur" : "") + (i < n - 2 ? " fp-old" : "");
      return '<li class="' + cls + '"><span class="fp-tag">' + (it.dead ? "✗ dead end: " : "") + it.tag + '</span><div class="fp-lm">' + m(it.e) + "</div>" + (i === n - 1 ? '<p class="fp-note">' + md(it.n) + "</p>" : "") + "</li>";
    }).join("");
    E.all.hidden = n <= 2; E.all.textContent = S.all ? "Show the last two lines" : "Show all lines";
    $$(".fp-mv", E.moves).forEach(function(b){ b.disabled = locked; });
    var Al = alg(), tr = Object.keys(Al.traps);
    E.cnt.innerHTML = "Moves: <strong>" + Al.moves + '</strong> <span class="tiny muted">(Write ' + m("f(x + h)") + " is free)</span>" + (tr.length ? ' <span class="fp-trapped">· trap used</span>' : "");
    q('[data-act="restart"]').disabled = locked || !Al.log.length;
    E.mfb.innerHTML = fb ? MV.fbHTML(fb.bad ? "bad" : "", fb.h) : "";
  }
  function agreeTxt(){
    var Fx = F(), a = aV(), r = rows(), small = r.some(function(h){ return Math.abs(h) <= 0.01 + 1e-12; }), dn = done();
    if (Fx.kind === "abs" && a === 0) {
      var L = r.some(function(h){ return h < 0 && Math.abs(h) <= 0.1 + 1e-12; }), R = r.some(function(h){ return h > 0 && Math.abs(h) <= 0.1 + 1e-12; });
      return L && R ? "Left → −1, right → 1: no single limit" : '<span class="muted">Try small ' + m("h") + " on both sides of 0.</span>";
    }
    var sS = slopeS(Fx, a), lim0 = m(simpAt(Fx, a) + " → " + (sS.t.charAt(0) === "≈" ? "" : sS.s));
    if (small && dn) return "✓ The table approaches " + sS.t + ", and " + (Fx.kind === "abs" ? "the algebra gives " + sS.t : (sS.t.charAt(0) === "≈" ? m(simpAt(Fx, a)) + " → " + sS.t.replace("≈ ", "") : lim0));
    if (small) return "The table heads toward " + sS.t + '. <span class="muted">Finish the algebra in Simplify first to compare.</span>';
    if (dn) return "The algebra gives " + sS.t + '. <span class="muted">Try ' + m("h = 0.01") + " or smaller in Numbers first to compare.</span>";
    return '<span class="muted">Try small ' + m("h") + " in Numbers first and finish the algebra in Simplify first, then compare.</span>";
  }
  function paintRead(){
    var Fx = F(), a = aV(), Al = alg(), dn = done(), ci = idx(F(), "cancel"), cancelled = ci >= 0 ? Al.st > ci : Al.st >= 1, rowsOut = [], qm = '<span class="muted">?</span> ';
    if (S.mode === "simp") rowsOut.push(["Current line", m(curLine())]);
    else { var rv = rows().indexOf(S.h) >= 0 ? rowV(S.h) : null; rowsOut.push(["Difference quotient at " + m("h = " + nsrc(S.h)), rv ? (rv.undef ? "undefined: " + m("x = " + nsrc(a + S.h)) + " is outside the domain" : "<strong>" + rv.ds + "</strong>") : qm + '<span class="tiny muted">Press an ' + m("h") + " chip.</span>"]); }
    var simpTxt;
    if (!cancelled) simpTxt = qm + '<span class="tiny muted">Appears after Cancel ' + m("h") + " in Simplify first.</span>";
    else if (Fx.kind === "abs") simpTxt = "at " + m("x = " + nsrc(a)) + ": " + m(simpAt(Fx, a)) + (a === 0 ? " (1 if " + m("h > 0") + ", −1 if " + m("h < 0") + ")" : " for small " + m("h"));
    else simpTxt = m(Fx.simp) + (Fx.gen ? " = " + m(lin([[2 * S.cf[2], "x"], [S.cf[1], ""], [S.cf[2], "h"]])) : "") + "; at " + m("x = " + nsrc(a)) + ": " + m(simpAt(Fx, a));
    rowsOut.push(["Simplified form", simpTxt]);
    var limTxt;
    if (!dn) limTxt = qm + '<span class="tiny muted">After Let ' + m("h → 0") + ".</span>";
    else if (Fx.kind === "abs") limTxt = m("f′(x) = 1") + " for " + m("x > 0") + ", −1 for " + m("x < 0") + "; " + (a === 0 ? m("f′(0)") + " does not exist" : m("f′(" + nsrc(a) + ") = " + (a > 0 ? "1" : "-1")));
    else { var sS = slopeS(Fx, a); limTxt = m("f′(x) = " + Fx.der) + (Fx.gen ? " = " + m(lin([[2 * S.cf[2], "x"], [S.cf[1], ""]])) : "") + "; " + m("f′(" + nsrc(a) + ") = " + sS.s); }
    rowsOut.push(["Limit as " + m("h → 0"), limTxt]);
    var ts = known() ? tanSrc(Fx, a) : null;
    rowsOut.push(["Tangent at " + m("x = " + nsrc(a)), ts ? m(ts) + ' <span class="tiny muted">(' + m("y - f(a) = f′(a)(x - a)") + ")</span>" : Fx.kind === "abs" && a === 0 ? "none: the graph has a corner at " + m("x = 0") : qm + '<span class="tiny muted">Once ' + m("h → 0") + ".</span>"]);
    rowsOut.push(["Agree?", agreeTxt()]);
    E.read.innerHTML = MV.readoutHTML(rowsOut);
  }
  function paintTop(){
    MV.keepFocus(E.fns, function(){
      E.fns.innerHTML = ORDER.map(function(id){ return '<button type="button" class="fchip fp-fchip" data-fn="' + id + '" data-k="fpf' + id + '" aria-pressed="' + (S.fn === id) + '"' + (locked ? " disabled" : "") + ">" + m(FN[id].chip) + "</button>"; }).join("");
    });
    E.coef.hidden = !F().gen;
    $$(".fp-cfin", E.coef).forEach(function(inp){ if (document.activeElement !== inp) inp.value = S.cf[+inp.dataset.cf]; inp.disabled = locked; });
    modeSeg.set(S.mode);
    var Fx = F(), lo = Fx.aMin != null ? Fx.aMin : -3, hi = Fx.aMax != null ? Fx.aMax : 3;
    E.asl.min = lo; E.asl.max = hi; E.asl.value = aV(); E.asl.disabled = locked; lastA = aV();
    E.asl.setAttribute("aria-label", "a, the x-value of P, from " + ntx(lo) + " to " + ntx(hi));
    E.aout.textContent = ntx(aV());
    E.cap.innerHTML = m(eqSrc()) + (Fx.gen ? ' <span class="tiny muted fp-gen">(' + m("ax^2 + bx + c") + ")</span>" : "");
  }
  function paint(){
    paintTop();
    E.num.hidden = S.mode !== "num"; E.simp.hidden = S.mode !== "simp";
    if (S.mode === "num") paintNum(); else paintSimp();
    paintRead(); draw();
  }

  // ---- actions ----
  function pressH(h, cb){
    stopAnim();
    var from = S.h; S.h = h; var r = rows(); if (r.indexOf(h) < 0) r.push(h);
    fb = null; save(); paint();
    if (from === h || MV.reduceMotion) { if (cb) cb(); return; }
    var geo = from * h > 0;
    anim = MV.tween({ dur:650, step:function(t){ A.h = geo ? from * Math.pow(h / from, t) : from + (h - from) * t; draw(); },
      done:function(){ anim = null; A.h = null; draw(); if (cb) cb(); } });
  }
  function toTangent(cb){
    stopAnim();
    var from = Math.abs(S.h) > 0.0015 ? S.h : (S.h < 0 ? -1 : 1), sg = from < 0 ? -1 : 1, to = sg * 0.0008;
    anim = MV.tween({ dur:1400, step:function(t){ A.h = from * Math.pow(to / from, t); draw(); },
      done:function(){ anim = null; A.h = null; S.h = sg * 0.001; o.save(); paint(); if (cb) cb(); } });
  }
  function move(mv, cb){
    var Fx = F(), Al = alg(), wasDone = Al.st >= Fx.steps.length, r = tryMove(Fx, Al.st, mv);
    if (!wasDone && !(r.ok && mv === "write")) Al.moves++;
    if (r.ok) { Al.st = r.to; Al.log.push(mv); fb = null; }
    else if (r.trap) { Al.log.push("!" + mv); Al.traps[mv] = 1; fb = { bad:true, h:"<strong>✗ " + MNAME[mv] + ":</strong> " + md(TRAP[mv]) }; }
    else fb = { bad:true, h:"<strong>✗</strong> " + MNAME[mv] + " doesn’t apply here: " + md(r.no) };
    save(); paint();
    if (r.ok && mv === "lim") toTangent(cb); else if (cb) cb();
  }
  function seq(list, fn, gap, cb){
    var i = 0;
    (function next(){ if (i >= list.length) { if (cb) cb(); return; } var x = list[i++]; fn(x, function(){ if (i >= list.length) { if (cb) cb(); return; } MV.wait(gap, next); }); })();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked) return;
    if (b.dataset.fn) { if (b.dataset.fn !== S.fn) { stopAnim(); S.fn = b.dataset.fn; fb = null; save(); paint(); } return; }
    if (b.dataset.h != null && b.closest(".fp-hch")) { pressH(r9(+b.dataset.h)); return; }
    if (b.dataset.mv && b.closest(".fp-moves")) { move(b.dataset.mv); return; }
    var act = b.dataset.act;
    if (act === "clear") { S.rows[key()] = []; save(); paint(); }
    else if (act === "restart") { stopAnim(); S.alg[S.fn] = { st:0, log:[], moves:0, traps:{} }; fb = null; save(); paint(); }
    else if (act === "all") { S.all = !S.all; o.save(); paintSimp(); }
  });
  E.asl.addEventListener("input", function(){
    if (locked) { E.asl.value = aV(); return; }
    var Fx = F(), v = r9(+E.asl.value), sk = Fx.skip || [], lo = +E.asl.min, hi = +E.asl.max;
    if (sk.indexOf(v) >= 0) { var dir = v >= lastA ? 1 : -1; v = r9(v + dir * 0.5); if (v > hi || v < lo) v = r9(v - dir); E.asl.value = v; }
    lastA = v; stopAnim(); S.a[S.fn] = v; fb = null; save(); paint();
  });
  E.coef.addEventListener("input", function(e){
    var i = e.target.dataset.cf; if (i == null || locked) return;
    var t = String(e.target.value).trim(), v = Number(t);
    if (t === "" || !Number.isInteger(v) || v < -9 || v > 9) return;
    S.cf[+i] = v; stopAnim(); save(); paint();
  });
  q(".fp-wb").addEventListener("input", function(e){ var k = e.target.dataset.wb; if (!k) return; S.wb[k] = e.target.value; save(); });

  // ---- challenges (exact tests from the plan) ----
  function wbVal(k){
    var t = String(S.wb[k + "t"] || "").trim(), bt = String(S.wb[k + "b"] || "").trim();
    if (!t) return null;
    var p = MV.parseNum(t), d = bt ? MV.parseNum(bt) : [1];
    if (!p || !d || p.length !== 1 || d.length !== 1 || !d[0]) return NaN;
    return p[0] / d[0];
  }
  function check(id){
    if (id === "tc1") {
      var Al = S.alg.cube;
      if (!Al || !Al.log || !Al.log.length) return { ok:false, msg:"Choose " + m("x^3") + ", switch to <strong>Simplify first</strong>, and start with Write " + m("f(x + h)") + "." };
      if (Al.traps && Al.traps.zero) return { ok:false, msg:"0/0 stopped you; that move doesn’t count toward the goal. Press <strong>Start over</strong> and try again." };
      if (Al.traps && Al.traps.first) return { ok:false, msg:md("Cancelling `h` from the first term only is a trap: every term on top has a factor of `h`. Press <strong>Start over</strong> and try again.") };
      if (Al.moves >= 6) return { ok:false, msg:"Expand, subtract, factor, cancel, limit: five moves. Press <strong>Start over</strong> and try again." };
      if (Al.st < FN.cube.steps.length) return { ok:false, msg:md("Keep going: the last line isn’t `f′(x)` yet.") };
      return { ok:true };
    }
    if (id === "tc2") {
      if (S.fn !== "rec") return { ok:false, msg:"Choose " + m("{1}/{x}") + " first, then move the point " + m("a") + "." };
      var a = aV("rec");
      if (a === 2) return { ok:true };
      if (a === 4) return { ok:false, msg:md("That gives `-1/a = -1/4`, but the slope is `-1/a^2`.") };
      if (a === 0.5) return { ok:false, msg:md("`-1/(1/2)^2 = -4`.") };
      if (a === -2) return { ok:false, msg:md("`-1/(-2)^2 = -1/4` too, but the challenge needs `x > 0`.") };
      return { ok:false, msg:md("At `a = " + nsrc(a) + "` the tangent’s slope is `-1/a^2 = " + vsrc(-1 / (a * a)) + "`, not `-{1}/{4}`.") };
    }
    if (id === "tc3") {
      if (S.fn !== "rt") return { ok:false, msg:"Choose " + m("√x") + " first, then move the point " + m("a") + "." };
      var b = aV("rt");
      if (b === 36) return { ok:false, msg:md("`1/(2√a) = 1/6` means `2√a = 6`, so `√a = 3`, not 6.") };
      if (b === 3) return { ok:false, msg:md("`√a = 3` means `a = 9`.") };
      if (b !== 9) return { ok:false, msg:md("At `a = " + nsrc(b) + "` the tangent’s slope is `{1}/{2√a}` ≈ " + ntx(1 / (2 * Math.sqrt(b)), 3) + ", not `{1}/{6}`.") };
      var mv = wbVal("m"), bv = wbVal("b");
      if (mv == null || bv == null) return { ok:false, msg:"The point is right. Now enter the tangent’s " + m("m") + " and " + m("b") + " in the workbench." };
      if (isNaN(mv) || isNaN(bv)) return { ok:false, msg:"Type a whole number or a fraction in each workbench box (the bottom boxes can’t be 0)." };
      if (!close(mv, 1 / 6)) return { ok:false, msg:md("The slope is `f′(9) = {1}/{2√9} = {1}/{6}`.") };
      if (close(bv, 4.5)) return { ok:false, msg:md("Sign slip: `3 = (1/6)(9) + b` gives `b = 3 - 3/2`.") };
      if (!close(bv, 1.5)) return { ok:false, msg:md("Use the point (9, 3): `3 = {1}/{6}(9) + b`.") };
      return { ok:true };
    }
    return { ok:false };
  }

  paint();
  return {
    apply:function(st){
      stopAnim();
      if (st.fn) S.fn = st.fn; if (st.mode) S.mode = st.mode; if (st.a != null) S.a[S.fn] = st.a; if (st.h != null) S.h = st.h;
      if (st.clear) S.rows[key()] = [];
      if (st.alg) { S.alg[S.fn] = { st:0, log:[], moves:0, traps:{} }; if (st.alg === "write") { S.alg[S.fn].st = 1; S.alg[S.fn].log = ["write"]; } }
      fb = null; save(); paint();
    },
    pressH:pressH, move:move,
    seqH:function(list, cb){ seq(list, pressH, 750, cb); },
    seqMoves:function(list, cb){ seq(list, move, 950, cb); },
    lock:function(v){ locked = !!v; host.classList.toggle("fp-locked", locked); paint(); },
    check:check, paint:paint
  };
}

function explore(host, api){
  var eng = engine(host, { S:api.S, save:api.save, changed:api.changed });
  var PST = {
    p1:{ fn:"qd", mode:"num", a:2, h:1, clear:true },
    p2:{ fn:"sq", mode:"simp", alg:"write" },
    p3:{ fn:"rec", mode:"simp", a:1, h:1, alg:"reset" },
    p4:{ fn:"abs", mode:"num", a:0, h:1, clear:true }
  };
  return {
    predict:{
      start:function(p){ eng.lock(false); eng.apply(PST[p.id] || {}); eng.lock(true); },
      run:function(p, done){
        var fin = function(){ eng.lock(false); done(); };
        if (p.id === "p1") eng.seqH([1, 0.1, 0.01, 0.001], function(){ MV.wait(400, fin); });
        else if (p.id === "p2") eng.move("zero", function(){ MV.wait(1500, function(){ eng.seqMoves(["expand", "sub", "factor", "cancel", "lim"], fin); }); });
        else if (p.id === "p3") eng.seqMoves(["write", "cd", "sub", "cancel", "lim"], function(){ MV.wait(400, fin); });
        else if (p.id === "p4") eng.seqH([0.1, 0.01, -0.1, -0.01], function(){ MV.wait(400, fin); });
        else fin();
      }
    },
    challenge:function(id){ return eng.check(id); }
  };
}

// ---------- hero storyboard: secant on y = x², the algebra builds, h slides to 0 and the secant turns into the tangent ----------
function hero(f){
  if (!f.canvas) return;
  var V = { xmin:-0.7, xmax:2.9, ymin:-0.7, ymax:6.4 }, p = new MV.Plot(f.canvas, V), sq = function(x){ return x * x; };
  var st = { h:1, tan:0, n:0, fin:false, pulse:false }, hl = $("#fp-hl"), sl = $("#fp-hh"), out = $("#fp-hho");
  var L1 = m("{(x + h)^2 - x^2}/{h}"), L2 = m("= {2xh + h^2}/{h}");
  function l3(){ return m("= 2x +") + ' <span class="fp-ph' + (st.pulse ? " on" : "") + '">' + m("h") + "</span>" + (st.fin ? " " + m("→ 2x") : ""); }
  function paintLines(){
    var rs = []; if (st.n >= 1) rs.push(L1); if (st.n >= 2) rs.push(L2); if (st.n >= 3) rs.push(l3());
    hl.innerHTML = rs.map(function(r, i){ return '<div class="fp-hrow' + (i === rs.length - 1 ? " cur" : "") + '">' + r + "</div>"; }).join("");
  }
  function cap(){
    f.cap.innerHTML = st.h < 0.005 ? "As " + m("h → 0") + ", the secant becomes the tangent at " + m("x = 1") + ": slope " + m("2x") + " = 2." :
      "Secant from " + m("x = 1") + " to " + m("x = 1 + h") + ": slope " + m("2x + h") + " = " + ntx(2 + st.h, 2) + ".";
  }
  p.render = function(){
    var ink = css("--ink"), ink2 = css("--ink-2"), sc = { view:V, xTicks:{ step:1 }, yTicks:{ step:1 }, curves:[{ f:sq, color:css("--pen"), width:3.2 }], lines:[], segments:[], points:[], labels:[] };
    if (st.tan > 0) sc.segments.push({ x1:V.xmin, y1:2 * V.xmin - 1, x2:V.xmax, y2:2 * V.xmax - 1, color:ink, width:2.2, alpha:st.tan });
    var x2 = 1 + st.h;
    if (st.h > 0.004) {
      sc.lines.push({ p:[1, 1], q:[x2, sq(x2)], color:ink2, width:2 });
      sc.points.push({ x:x2, y:sq(x2), color:ink2, r:5, label:st.h > 0.3 ? "x + h" : "" });
    }
    sc.points.push({ x:1, y:1, color:ink, r:5.5, label:"x", below:true });
    sc.after = function(ctx, pl){
      if (st.h > 0.004) cLabel(ctx, "secant", pl.X(V.xmin) + 10, pl.Y(5.9), { color:ink2 });
      if (st.tan >= 1) cLabel(ctx, "tangent", pl.X(2.45), pl.Y(2 * 2.45 - 1) + 20, { align:"right" });
    };
    sc.describe = "The parabola y = x squared with the point at x = 1. " + (st.h > 0.004 ? "A secant runs to x = 1 + h with h = " + ntx(st.h, 2) + ", slope " + ntx(2 + st.h, 2) + ". " : "") + (st.tan >= 1 ? "The tangent at x = 1 has slope 2." : "");
    p.draw(sc);
  };
  function setH(v){ st.h = v; sl.value = v; out.textContent = ntx(v, 2); }
  function finish(){ st.n = 3; st.fin = true; st.pulse = false; setH(0); st.tan = 1; paintLines(); cap(); p.render(); sl.disabled = false; }
  sl.addEventListener("input", function(){ setH(+sl.value); st.fin = st.h < 0.005; paintLines(); cap(); p.render(); });
  if (MV.reduceMotion) { finish(); return; }
  setH(1); paintLines(); cap(); p.render();
  MV.wait(900, function(){ st.n = 1; paintLines();
    MV.wait(1300, function(){ st.n = 2; paintLines();
      MV.wait(1300, function(){ st.n = 3; st.pulse = true; paintLines();
        MV.wait(2300, function(){ st.pulse = false; paintLines();
          MV.tween({ dur:2400, step:function(t){ setH(r9(1 - t)); st.tan = t > 0.8 ? (t - 0.8) / 0.2 : 0; cap(); p.render(); }, done:finish });
        });
      });
    });
  });
}

// ---------- Part 3: pattern hunter ----------
var ROWS = [
  { f:"x", e:"x + h", q:"1", d:"1" },
  { f:"x^2", e:"x^2 + 2xh + h^2", q:"2x + h", d:"2x", ex:true },
  { f:"x^3", e:"x^3 + 3x^2h + 3xh^2 + h^3", q:"3x^2 + 3xh + h^2", d:"3x^2", ex:true },
  { f:"x^4", e:"x^4 + 4x^3h + 6x^2h^2 + 4xh^3 + h^4", q:"4x^3 + 6x^2h + 4xh^2 + h^3", d:"4x^3", mine:true }
];
var TERMS = ["x^4", "x^3h", "x^2h^2", "xh^3", "h^4"];
function zpts(f, v){ var out = [], N = 480, i; for (i = 0; i <= N; i++) { var x = v.xmin - 0.02 * (v.xmax - v.xmin) + (v.xmax - v.xmin) * 1.04 * i / N; out.push([x, f(x)]); } return out; }
var ZOOMS = [
  { id:"ord", h:"For comparison: an ordinary point", eq:"y = x^2", at:"(1, 1)", px:1, py:1, f:function(x){ return x * x; },
    sum:"left → 2, right → 2", after:"The curve straightens into its tangent: `f′(1) = 2`.", look:"looks more and more like a straight line" },
  { id:"corner", h:"Corner", eq:"y = |x - 1|", at:"(1, 0)", px:1, py:0, f:function(x){ return Math.abs(x - 1); }, kink:true,
    sum:"left → −1, right → 1", after:"Two straight pieces meet at an angle at every zoom, so `f′(1)` doesn’t exist.", look:"is still a sharp corner" },
  { id:"cusp", h:"Cusp", eq:"y = x^{2/3}", at:"(0, 0)", px:0, py:0, f:function(x){ return rpow(x, 2, 3); },
    sum:"left → −∞, right → +∞", after:"The quotients decrease without bound on the left and grow without bound on the right, so `f′(0)` doesn’t exist.", look:"gets even sharper, a spike pointing down" },
  { id:"vert", h:"Vertical tangent", eq:"y = ∛x", at:"(0, 0)", px:0, py:0, f:function(x){ return rpow(x, 1, 3); },
    sum:"both sides → +∞", after:"The quotients grow without bound: the tangent is vertical, so `f′(0)` doesn’t exist.", look:"looks more and more vertical" },
  { id:"jump", h:"Jump", eq:"y = 0 (x < 0); y = 1 (x ≥ 0)", at:"(0, 1)", px:0, py:1, step:true,
    sum:"not even continuous", after:"There’s a gap at 0, so no tangent can touch the graph there: `f′(0)` doesn’t exist.", look:"still has nothing on the left: the graph jumps" }
];
function part3(host, api){
  var S = api.S, C = api.content, ANS = MV.ans(C.x4) || { row:[1, 4, 6, 4, 1], c:4, e:3 }, opts = C.conj.options;
  S.row = Array.isArray(S.row) && S.row.length === 5 ? S.row : ["", "", "", "", ""]; S.dc = S.dc || ""; S.de = S.de || ""; S.x4 = !!S.x4;
  S.cj = typeof S.cj === "number" ? S.cj : null; S.z = S.z || {}; S.seen = S.seen || {};
  var x4fb = null, Z = {}, plots = {}, anims = {};
  var pas = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
  host.innerHTML = '<section class="fp-st"><h3>Station 1: the power table</h3><p>The first rows come from the engine in Explore. Finish the ' + m("x^4") + " row, then look for the pattern.</p>" +
    '<div class="fp-ptbl"></div>' +
    '<div class="fp-x4"><h4>Your turn: ' + m("f(x) = x^4") + '</h4><p>Fill in row 4 of Pascal’s triangle to expand ' + m("(x + h)^4") + '. Each number is the sum of the two above it.</p>' +
      '<div class="fp-pas" role="group" aria-label="Pascal’s triangle, rows 0 to 4">' + pas.map(function(r, i){ return '<div class="fp-prow"><span class="fp-pn">row ' + i + "</span>" + r.map(function(v){ return '<span class="fp-pv">' + v + "</span>"; }).join("") + "</div>"; }).join("") +
        '<div class="fp-prow"><span class="fp-pn">row 4</span>' + [0, 1, 2, 3, 4].map(function(i){ return '<input class="numin fp-pin" data-pr="' + i + '" type="text" inputmode="numeric" autocomplete="off" aria-label="Row 4, number ' + (i + 1) + '">'; }).join("") + "</div></div>" +
      '<p class="fp-exp" aria-live="polite"></p>' +
      '<p class="fp-dv">Then ' + m("f′(x) =") + ' <input class="numin fp-pin" data-dv="c" type="text" inputmode="numeric" autocomplete="off" aria-label="Coefficient of the derivative">' + m("x") + '<sup><input class="numin fp-pin fp-pow" data-dv="e" type="text" inputmode="numeric" autocomplete="off" aria-label="Power of x in the derivative"></sup></p>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-act="x4" data-k="fpx4">Check the ' + m("x^4") + ' row</button></div><div class="fp-x4fb" aria-live="polite"></div></div>' +
    '<div class="fp-cj"><h4>Make a conjecture</h4><p class="fp-cjp">' + C.conj.prompt + '</p><div class="chips fp-cjc" role="group" aria-label="Conjectures"></div><div class="fp-cjfb" aria-live="polite"></div><div class="fp-test"></div></div>' +
    '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' +
      "<div>" + m("(x + h)^n = x^n + nx^{n - 1}h") + " + (terms with " + m("h^2") + " or more)</div>" +
      "<div>" + m("(x + h)^n - x^n = nx^{n - 1}h") + " + (terms with " + m("h^2") + " or more)</div>" +
      "<div>" + m("{(x + h)^n - x^n}/{h} = nx^{n - 1}") + " + (terms with " + m("h") + " or more)</div>" +
      "<div>Let " + m("h → 0") + ": only " + m("nx^{n - 1}") + " survives the limit.</div></div></details></section>" +
    '<section class="fp-st"><h3>Station 2: where ' + m("f′") + ' doesn’t exist</h3><p>Zoom in on each point. At an ordinary point, zooming makes the graph look straight: that straight line is the tangent. At these four points it never does.</p>' +
      '<div class="fp-zgrid">' + ZOOMS.map(function(z){
        return '<div class="fp-zc' + (z.id === "ord" ? " fp-zord" : "") + '" data-z="' + z.id + '"><h4>' + z.h + ": " + m(z.eq) + " at " + z.at + '</h4><div class="plot-wrap"><canvas class="plot" role="img" aria-label="' + MV.esc(z.h) + '"></canvas></div><div class="fp-zseg"></div><p class="fp-zsum" aria-live="polite"></p></div>';
      }).join("") + "</div></section>";
  var q = function(sel){ return $(sel, host); };
  $$(".fp-pin[data-pr]", host).forEach(function(inp){ inp.value = S.row[+inp.dataset.pr]; });
  q('[data-dv="c"]').value = S.dc; q('[data-dv="e"]').value = S.de;
  function nv(t){ t = String(t).trim().replace(/−/g, "-"); if (!t) return null; var v = Number(t); return isFinite(v) ? v : NaN; }
  function paintTable(){
    q(".fp-ptbl").innerHTML = MV.tableHTML({ head:[m("f(x)"), m("f(x + h)") + " expanded", "difference quotient simplified", m("f′(x)")],
      rows:ROWS.map(function(r){
        var show = !r.mine || S.x4;
        return [m(r.f) + (r.ex ? ' <span class="tiny muted">(engine)</span>' : ""), show ? m(r.e) : '<span class="muted">your turn ↓</span>', show ? m(r.q) : '<span class="muted">?</span>', show ? "<strong>" + m(r.d) + "</strong>" : '<span class="muted">?</span>'];
      }), hiRow:S.x4 ? 3 : -1, caption:"Derivatives of x, x², x³ and x⁴ from first principles" });
  }
  function paintExp(){
    q(".fp-exp").innerHTML = m("(x + h)^4 = " + TERMS.map(function(t, i){ var v = String(S.row[i] || "").trim(); return (v ? v : "□") + t; }).join(" + "));
  }
  function paintX4(){
    var dis = S.x4;
    $$(".fp-x4 input", host).forEach(function(inp){ inp.disabled = dis; });
    q('[data-act="x4"]').disabled = dis;
    var el = q(".fp-x4fb");
    if (S.x4) el.innerHTML = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + m("(x + h)^4 = x^4 + 4x^3h + 6x^2h^2 + 4xh^3 + h^4") + ". Subtract " + m("x^4") + " and divide by " + m("h") + ": " + m("4x^3 + 6x^2h + 4xh^2 + h^3 → 4x^3") + ".");
    else el.innerHTML = x4fb ? MV.fbHTML(x4fb.bad ? "bad" : "", x4fb.h) : "";
  }
  function paintCj(){
    var ri = MV.right(opts), host2 = q(".fp-cjc");
    MV.keepFocus(host2, function(){
      host2.innerHTML = opts.map(function(o, i){ var on = S.cj === i; return '<button type="button" class="chip fp-cjb' + (on ? " on" : "") + '" data-cj="' + i + '" data-k="fpcj' + i + '" aria-pressed="' + on + '"' + (!S.x4 || S.cj === ri ? " disabled" : "") + ">" + o.t + "</button>"; }).join("");
    });
    var fbEl = q(".fp-cjfb"), test = q(".fp-test");
    if (!S.x4) { fbEl.innerHTML = '<p class="tiny muted">Finish the ' + m("x^4") + " row first.</p>"; test.innerHTML = ""; return; }
    if (S.cj == null) { fbEl.innerHTML = ""; test.innerHTML = ""; return; }
    var good = S.cj === ri;
    fbEl.innerHTML = MV.fbHTML(good ? "good" : "bad", (good ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + (opts[S.cj].why || "") + (good ? "" : " Try another."));
    test.innerHTML = good ? "<p><strong>Test it on two functions from Explore.</strong></p>" + MV.tableHTML({ head:["Function", "As a power", "The conjecture " + m("nx^{n - 1}"), "First principles (Explore)"],
      rows:[[m("{1}/{x}"), m("x^{-1}"), m("-1x^{-2} = -{1}/{x^2}"), m("-{1}/{x^2}") + " ✓"], [m("√x"), m("x^{1/2}"), m("{1}/{2}x^{-1/2} = {1}/{2√x}"), m("{1}/{2√x}") + " ✓"]],
      caption:"The conjecture tested on 1/x and the square root of x" }) + '<p class="fp-tnote">The conjecture predicts both. Module 09 turns it into the power rule.</p>' : "";
  }
  function checkX4(){
    var row = S.row.map(nv), c = nv(S.dc), e = nv(S.de);
    if (row.some(function(v){ return v == null; }) || c == null || e == null) { x4fb = { bad:false, h:"Fill in all five numbers in row 4, and both boxes for " + m("f′(x)") + "." }; return; }
    var rowOK = ANS.row.every(function(v, i){ return row[i] === v; });
    if (!rowOK) {
      var h = row.join(",") === "1,4,4,4,1" ? "Each inside number is the sum of the two above it: 3 + 3 = 6." :
        (row[0] !== 1 || row[4] !== 1) ? "Every row of Pascal’s triangle starts and ends with 1." :
        "Each number in row 4 is the sum of the two numbers above it in row 3 (1 3 3 1): 1 + 3, 3 + 3, 3 + 1.";
      x4fb = { bad:true, h:"<strong>✗ Not quite.</strong> " + h + " Try again." }; return;
    }
    if (c === ANS.c && e === ANS.e) { S.x4 = true; x4fb = null; return; }
    var hh = c === 4 && e === 4 ? "Dividing " + m("4x^3h") + " by " + m("h") + " leaves " + m("4x^3") + ": the power is 3." :
      c === 1 ? "The surviving term is " + m("4x^3h") + " divided by " + m("h") + ". What multiplies " + m("x^3") + "?" :
      "Subtract " + m("x^4") + " and divide by " + m("h") + ": " + m("4x^3 + 6x^2h + 4xh^2 + h^3") + ". Then let " + m("h → 0") + ".";
    x4fb = { bad:true, h:"<strong>✗ Not quite.</strong> Row 4 is right. " + hh + " Try again." };
  }
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.pr != null) { S.row[+t.dataset.pr] = t.value; paintExp(); }
    else if (t.dataset.dv) { if (t.dataset.dv === "c") S.dc = t.value; else S.de = t.value; }
    else return;
    api.save();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.act === "x4") { checkX4(); api.save(); paintTable(); paintX4(); paintCj(); MV.focusFb(q(".fp-x4")); return; }
    if (b.dataset.cj != null) { S.cj = +b.dataset.cj; api.save(); paintCj(); MV.focusFb(q(".fp-cj")); }
  });
  // ---- station 2: zoom lens ----
  ZOOMS.forEach(function(z){
    var card = $('[data-z="' + z.id + '"]', host), canvas = $("canvas", card), p = new MV.Plot(canvas, { xmin:-2, xmax:2, ymin:-1.5, ymax:1.5 });
    S.z[z.id] = [1, 4, 16].indexOf(S.z[z.id]) >= 0 ? S.z[z.id] : 1; Z[z.id] = S.z[z.id]; plots[z.id] = p;
    p.render = function(){
      var k = Z[z.id], v = { xmin:z.px - 2 / k, xmax:z.px + 2 / k, ymin:z.py - 1.5 / k, ymax:z.py + 1.5 / k }, pen = css("--pen"), sc = { view:v, curves:[], points:[] };
      if (z.step) {
        sc.curves.push({ pts:[[v.xmin - 1, 0], [0, 0]], color:pen, width:3 }, { pts:[[0, 1], [v.xmax + 1, 1]], color:pen, width:3 });
        sc.points.push({ x:0, y:0, open:true, color:pen, r:5.5 }, { x:0, y:1, color:pen, r:5.5 });
      } else if (z.kink) sc.curves.push({ pts:[[v.xmin - 1, z.f(v.xmin - 1)], [z.px, z.py], [v.xmax + 1, z.f(v.xmax + 1)]], color:pen, width:3 });
      else sc.curves.push({ pts:zpts(z.f, v), color:pen, width:3 });
      sc.after = function(ctx, pl){
        var X = pl.X(z.px), Y = pl.Y(z.py);
        ctx.save(); ctx.beginPath(); ctx.arc(X, Y, 11, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.strokeStyle = css("--hi"); ctx.stroke(); ctx.restore();
        cLabel(ctx, "×" + (Math.round(k * 10) / 10), pl.W - 8, 14, { align:"right", color:css("--ink-2") });
      };
      sc.describe = MV.plain(m(z.eq)) + " near " + z.at + ", zoomed ×" + Math.round(k) + ". " + (k >= 15.9 ? "Zoomed in, the graph " + z.look + "." : "The ring marks the point.");
      p.draw(sc);
    };
    var seg = MV.seg($(".fp-zseg", card), { label:"Zoom:", value:String(S.z[z.id]), options:[{ id:"1", t:"×1" }, { id:"4", t:"×4" }, { id:"16", t:"×16" }],
      onChange:function(val){
        var to = +val, from = Z[z.id]; S.z[z.id] = to; if (to === 16) S.seen[z.id] = true; api.save();
        if (anims[z.id]) anims[z.id]();
        anims[z.id] = MV.tween({ dur:900, step:function(t){ Z[z.id] = from * Math.pow(to / from, t); p.render(); }, done:function(){ anims[z.id] = null; Z[z.id] = to; p.render(); paintZ(z); } });
      } });
    void seg;
    paintZ(z);
  });
  function paintZ(z){
    var el = $('[data-z="' + z.id + '"] .fp-zsum', host);
    el.innerHTML = S.seen[z.id] ? "<strong>Difference quotients:</strong> " + z.sum + ". " + md(z.after) : '<span class="muted">Zoom in to ×16. Does the graph straighten out?</span>';
  }
  paintTable(); paintExp(); paintX4(); paintCj();
  return {};
}

// ---------- Practice 1: wrong-order feedback (the plan's rules, checked against the order the student pressed Check with) ----------
function orderRule(a, sid, ord){
  var p = function(i){ return ord.indexOf(i); }, R = a.rules || {};
  if (sid === "s1") { if (p(5) < p(4)) return R.lim; if (p(2) < p(1)) return R.div; }
  if (sid === "s2") { if (p(4) < p(3)) return R.lim; if (p(3) < p(2) || p(3) < p(0)) return R.div; }
  if (sid === "s3") { if (p(4) < p(3)) return R.lim; if (p(1) > p(3)) return R.conj; }
  return null;
}
document.addEventListener("click", function(e){
  var b = e.target.closest ? e.target.closest('[data-act="check"]') : null; if (!b || b.disabled) return;
  var box = b.closest("[data-seq]"); if (!box || !box.closest("#act-order")) return;
  var a = (((MV.C || {}).practice || {}).activities || []).filter(function(x){ return x.id === "order"; })[0]; if (!a) return;
  var s = a.sequences.filter(function(x){ return x.id === box.dataset.seq; })[0], st = MV.S && MV.S.act && MV.S.act.order, x = st && st.seq && s && st.seq[s.id];
  if (!x) return;
  var fb = orderRule(a, s.id, x.order);
  s.wrong = fb ? [{ order:x.order.slice(), fb:fb }] : [];
}, true);

// ---------- Practice 2: first principles by the numbers (@component V8 coefBoxes — number and fraction boxes laid out inside the
// answer's form, e.g. "f′(x) = □x + □", "□/x^□", "Point (□, □)"; named wrong values per box set, typed-expression matches) ----------
var BOXLAB = { p:"first box", q:"second box", x:"x-coordinate of the point", y:"y-coordinate of the point", m:"slope m", b:"intercept b" };
function numbersAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function keys(it){ return it.form.filter(function(p){ return p && typeof p === "object"; }).map(function(p){ return p.k; }); }
  function formHTML(it){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", f = it.form, h = "";
    function box(b){
      var lab = b.frac === "top" ? "numerator" : b.frac === "pow" ? "power of x" : BOXLAB[b.k];
      return '<input class="numin fp-bx' + (b.frac === "pow" ? " fp-pow" : "") + '" data-bx="' + b.k + '" data-k="' + it.id + b.k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(lab) + '" value="' + MV.esc(x.v[b.k] || "") + '"' + dis + ">";
    }
    for (var i = 0; i < f.length; i++) {
      var p = f[i];
      if (typeof p === "string") h += p === "<br>" ? '<span class="fp-brk"></span>' : '<span class="fp-ft">' + p + "</span>";
      else if (p.frac === "top") { h += '<span class="fp-bfrac"><span class="fp-bft">' + box(p) + '</span><span class="fp-bfb">' + m("x") + box(f[i + 1]) + "</span></span>"; i++; }
      else h += box(p);
    }
    return '<div class="fp-form" role="group" aria-label="Your answer">' + h + "</div>";
  }
  function paintForm(it){ var el = $('[data-nq="' + it.id + '"] .fp-nf', host); MV.keepFocus(el, function(){ el.innerHTML = formHTML(it); }); }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-nq="' + it.id + '"] .fp-nc', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q fp-nq" data-nq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt"><strong>' + it.label + ".</strong> " + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="fp-nf"></div><div class="fp-nc"></div></div>';
  }).join("");
  a.items.forEach(function(it){ paintForm(it); paintCtl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), ks = keys(it), vals = {}, w;
    for (var i = 0; i < ks.length; i++) {
      var k = ks[i], raw = String(x.v[k] || "").trim();
      if (!raw) return { err:ks.length > 1 ? "Fill in every box first." : "Type your answer first." };
      var p = MV.parseNum(raw);
      if (!p || p.length !== 1) {
        var norm = raw.replace(/−/g, "-").replace(/\s+/g, "").toLowerCase();
        w = (it.wrong || []).filter(function(z){ return z.txt && z.txt === norm; })[0];
        if (w) return { ok:false, msg:w.fb };
        return { err:"Type a number in each box, such as 3, −12 or 1/6." };
      }
      vals[k] = p[0];
    }
    if (ks.every(function(k){ return close(vals[k], ans[k], 1e-9); })) return { ok:true };
    w = (it.wrong || []).filter(function(z){ var zk = Object.keys(z).filter(function(k){ return k !== "fb" && k !== "txt"; }); return zk.length && zk.every(function(k){ return close(vals[k], z[k], 1e-9); }); })[0];
    if (w) return { ok:false, msg:w.fb };
    var right = ks.filter(function(k){ return close(vals[k], ans[k], 1e-9); });
    if (ks.length > 1 && right.length) return { ok:false, msg:"Some boxes are right; check the others. " + a.general };
    return { ok:false, msg:a.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var box = t.closest("[data-nq]"); ist(box.dataset.nq).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var box = e.target.closest("[data-nq]"), b = box && box.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-nq]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.nq; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintForm(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- performance task: Hilltop at x = 2 ----------
var task = (function(){
  var api, plot;
  function g(k){ var s = api ? api.S : {}, t = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -6 && v <= 6 ? v : null; }
  function read(){ var A = g("a"), B = g("b"), C = g("c"); return { a:A, b:B, c:C, zero:A === 0, valid:A !== null && B !== null && C !== null && A !== 0 }; }
  function f(d, x){ return d.a * x * x + d.b * x + d.c; }
  function topSign(d){ return (4 * d.a * d.c - d.b * d.b) * d.a; }      // sign of f(−b/(2a)) = (4ac − b²)/(4a)
  function draw(){
    var d = read(), V0 = { xmin:-2, xmax:5, ymin:-8, ymax:8 };
    if (!d.valid) { plot.draw({ view:V0, segments:[{ x1:2, y1:V0.ymin, x2:2, y2:V0.ymax, color:css("--ink-2"), width:1.5, dash:[3, 5] }], describe:"Enter whole numbers from −6 to 6 for a, b and c (a not 0) to draw f. The dotted line marks x = 2." }); return; }
    var xv = -d.b / (2 * d.a), yv = f(d, xv), x0 = Math.min(-1.5, xv - 2), x1 = Math.max(3.5, xv + 2);
    var ys = [f(d, x0), f(d, x1), yv, d.c, 0], lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
    if (hi - lo > 50) { var mid = (yv + d.c) / 2; lo = Math.min(yv, d.c, 0) - 6; hi = Math.max(yv, d.c, 0) + 6; void mid; }
    var pd = Math.max(1.2, (hi - lo) * 0.1), v = { xmin:x0, xmax:x1, ymin:lo - pd, ymax:hi + pd }, ink = css("--ink"), ink2 = css("--ink-2");
    plot.draw({ view:v, curves:[{ f:function(x){ return f(d, x); }, color:css("--pen"), width:3 }],
      segments:[{ x1:2, y1:v.ymin, x2:2, y2:v.ymax, color:ink2, width:1.5, dash:[3, 5] }],
      lines:[{ p:[0, d.c], q:[1, d.c + d.b], color:ink, width:2 }, { p:[xv, yv], q:[xv + 1, yv], color:ink, width:2, dash:[7, 5] }],
      points:[{ x:0, y:d.c, color:ink, r:4.5 }, { x:xv, y:yv, color:ink, r:5 }],
      after:function(ctx, pl){
        cLabel(ctx, "x = 2", pl.X(2) + 6, 14, { color:ink2 });
        cLabel(ctx, "horizontal tangent", Math.min(pl.W - 8, Math.max(8, pl.X(xv))), pl.Y(yv) + (yv > (v.ymin + v.ymax) / 2 ? 22 : -22), { align:"center" });
        cLabel(ctx, "tangent at x = 0: slope " + ntx(d.b), 8, pl.H - 14, { align:"left" });
      },
      describe:"f(x) = " + MV.plain(m(polySrc([d.c, d.b, d.a], "x", true))) + ". Tangent at x = 0 has slope " + ntx(d.b) + ". The horizontal tangent is at x = " + ntx(xv, 3) + ", through (" + ntx(xv, 3) + ", " + ntx(yv, 3) + "). The y-intercept is " + ntx(d.c) + "." });
  }
  function readout(){
    var d = read(), el = $("#fp-tread"), cap = $("#fp-tkcap"); if (!el) return;
    if (!d.valid) { cap.innerHTML = m("f(x) = ax^2 + bx + c"); el.innerHTML = '<div><dd class="muted">' + (d.zero ? m("a") + " can’t be 0: then " + m("f") + " isn’t a quadratic." : "Enter whole numbers from −6 to 6 for " + m("a") + ", " + m("b") + " and " + m("c") + ".") + "</dd></div>"; return; }
    var xv = -d.b / (2 * d.a);
    cap.innerHTML = m("f(x) = " + polySrc([d.c, d.b, d.a], "x", true));
    el.innerHTML = MV.readoutHTML([
      [m("f′(x) = 2ax + b"), m("f′(x) = " + lin([[2 * d.a, "x"], [d.b, ""]]))],
      [m("f′(2) = 4a + b"), ntx(4 * d.a + d.b)],
      [m("f′(0) = b"), ntx(d.b)],
      ["Horizontal tangent at " + m("x = -b/(2a)"), m("x = " + vsrc(xv)) + ", point " + m("(" + vsrc(xv) + ", " + vsrc(f(d, xv)) + ")")],
      [m("y") + "-intercept", ntx(d.c)]
    ]);
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.a == null) { a.S.a = "1"; a.S.b = "0"; a.S.c = "0"; }
      inp.innerHTML = '<div class="inrow">' + ["a", "b", "c"].map(function(k){ return '<label for="fp-t' + k + '"><span>' + m(k) + ' <span class="tiny muted">(−6 to 6)</span></span><input id="fp-t' + k + '" data-tk="' + k + '" type="number" min="-6" max="6" step="1" autocomplete="off" value="' + MV.esc(a.S[k]) + '"></label>'; }).join("") + "</div>";
      pv.innerHTML = '<p class="fp-tkcap" id="fp-tkcap" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot" id="fp-tplot" role="img" aria-label="Your quadratic with its tangents"></canvas></div><dl class="read" id="fp-tread" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#fp-tplot"), { xmin:-2, xmax:5, ymin:-8, ymax:8 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); a.update(); });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : d.zero ? md("`a` can’t be 0: then `f` isn’t a quadratic.") : "Enter whole numbers from −6 to 6 for a, b and c."; },
    checks:function(d){ if (!d.valid) return [false, false, false, false]; return [4 * d.a + d.b === 0, d.b > 0, topSign(d) > 0, d.c < 0]; },
    key:function(d){ return d.a + "," + d.b + "," + d.c; },
    label:function(k){ return "(" + k.split(",").map(function(v){ return ntx(+v, 0); }).join(", ") + ")"; },
    text:function(k){ return "(" + k.split(",").map(function(v){ return ntx(+v, 0); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ numbers:numbersAct },
  task:task
});
})();
