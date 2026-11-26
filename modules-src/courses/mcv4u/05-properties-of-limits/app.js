// MCV4U 05 Properties of Limits: hero storyboard; the 0/0 detective (Explore: limit chips, "Substitute directly", V7 technique
// chooser with N13 algebra steps, V6 approach table, limit-law card builder) and its challenge workbench; one-sided stations
// (Part 3); Evaluate the limit (Practice 2, V8 fraction box); "Design a fillable hole".
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q, SX = MV.mcv.S, EXACT = MV.mcv.exact;
function m(s){ return MV.m(s); }
function md(h){ return MV.md(h); }
function mi(s){ return m(s).replace(/^<span class="m">/, "").replace(/<\/span>$/, ""); }          // m() without its wrapper
function mx(s){ return m(s).split("⟦").join('<span class="pl-x">').split("⟧").join("</span>"); }  // ⟦…⟧ marks a cancelled factor
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function nsrc(v){ return String(r9(v)); }                         // number as m() source (a hyphen becomes a true minus)
function ntx(v, dp){ return num(v, dp == null ? 4 : dp); }        // number as text (true minus)
function close(a, b, t){ return Math.abs(a - b) <= (t || 1e-9); }
function fracTxt(v){ if (Math.abs(v - Math.round(v)) < 1e-12) return ntx(Math.round(v), 0); var f = Q.of(v); return f ? Q.txt(f) : ntx(v); }
// lim with the approach underneath (course plan §2); hidden brackets keep MV.plain() readable
function lim(sub){ return '<span class="pl-lim"><span class="pl-lt">lim</span><span class="vh"> (</span><span class="pl-lu">' + m(sub) + '</span><span class="vh">)</span></span>'; }
// canvas label with a sheet-coloured backing
function cLabel(ctx, text, X, Y, o){
  o = o || {};
  ctx.save(); ctx.font = (o.font || "600 14px ") + (css("--font-math") || "serif"); ctx.textBaseline = "middle"; ctx.textAlign = o.align || "left";
  var w = ctx.measureText(text).width, x0 = o.align === "right" ? X - w : o.align === "center" ? X - w / 2 : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(x0 - 4, Y - 10, w + 8, 20); ctx.globalAlpha = 1;
  ctx.fillStyle = o.color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
function ring(ctx, X, Y, r){ ctx.save(); ctx.beginPath(); ctx.arc(X, Y, r, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.strokeStyle = css("--hi"); ctx.stroke(); ctx.restore(); }
// piecewise caption: rows [[expression source, condition source]]
function pw(rows){
  return '<span class="pl-pw"><span class="pl-br" aria-hidden="true">{</span><span class="pl-cases">' + rows.map(function(r){ return '<span class="pl-case">' + m(r[0]) + '<span class="pl-cond">' + m(r[1]) + "</span></span>"; }).join("") + "</span></span>";
}

// @component exactDec (copied from MCV4U 04 / 02) — exact rationals (BigInt) printed as exact decimals (2.996001, not 2.9960009…);
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

// @component V6 approachTable (copied from MCV4U 04) — x → a from the left and from the right (a ∓ 0.1, 0.01, 0.001, or o.steps),
// values computed exactly in code (exactDec XQ), "undefined" where f is undefined (and at x = a). Float functions are rounded
// to o.rdp places.
//   F = { q(X, x) -> XQ | null (exact; null = undefined)  or  f(x) -> number (NaN = undefined), at:"(0/0)" (note at x = a) }
//   V6.val(F, x, o) -> {s, v, undef}
//   V6.html(F, a, o) -> left and right tables side by side (stacked on phones), then the x = a line.
//        o = { steps:[0.1, 0.01, 0.001], shownL, shownR (rows filled; default all), hiL, hiR, name:"f", dp:6, rdp:4, note, noAt }
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
    return '<div class="pl-v6s"><table class="vt pl-v6t"><caption class="vh">Values of ' + nm + "(x) as x approaches " + ntx(a) + " from the " + word + "</caption><thead>" +
      '<tr><th scope="colgroup" colspan="2" class="pl-v6h">' + m("x → " + nsrc(a) + (dir < 0 ? "^{-}" : "^{+}")) + " from the " + word + "</th></tr>" +
      '<tr><th scope="col">' + m("x") + '</th><th scope="col">' + m(nm + "(x)") + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>";
  }
  function html(F, a, o){
    o = o || {};
    var n = (o.steps || [0.1, 0.01, 0.001]).length, nm = o.name || "f", at = "";
    if (!o.noAt) { var va = val(F, a, o); at = '<p class="pl-v6at">At ' + m("x = " + nsrc(a)) + ": " + m(nm + "(" + nsrc(a) + ")") + (va.undef ? " is <strong>undefined</strong>" + (F.at ? " " + F.at : "") : " = " + va.s) + "</p>"; }
    return '<div class="pl-v6"><div class="pl-v6g">' + side(F, a, -1, o, o.shownL == null ? n : o.shownL, o.hiL) + side(F, a, 1, o, o.shownR == null ? n : o.shownR, o.hiR) + "</div>" + at +
      (o.note ? '<p class="tiny muted pl-v6n">' + o.note + "</p>" : "") + "</div>";
  }
  return { val:val, html:html };
})();

// @component radioGroup (copied from MHF4U 25; adapted: with nothing chosen yet the first option holds the tab stop)
// radios(host, {aria, options:[{id, t}], value, onChange(id)}) -> {set(id), get(), lock(bool)}
function radios(host, o){
  var val = o.value == null ? null : String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="pl-rg" role="radiogroup" aria-label="' + MV.esc(o.aria) + '">' + o.options.map(function(x, i){
      var on = String(x.id) === val, tab = on || (val == null && i === 0);
      return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? " disabled" : "") + ">" + x.t + "</button>";
    }).join("") + "</span>";
    if (f) { var b = host.querySelector('[data-rg="' + (val == null ? o.options[0].id : val) + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ if (locked) return; id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), cur = ids.indexOf(val == null ? b.dataset.rg : val);
    choose(ids[(cur + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ id = id == null ? null : String(id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, lock:function(v){ v = !!v; if (v !== locked) { locked = v; paint(); } } };
}

// ---------- the seven detective limits ----------
// kind: "00" (0/0), "n0" (nonzero/0) or "num" (substitution gives the limit). steps: {p prefix ("=" or text), s lim subscript, e expression, n note}
var LIMS = {
  L1:{ a:3, sub:"x → 3", expr:"{x^2 - 9}/{x - 3}", subst:"{3^2 - 9}/{3 - 3} = {0}/{0}", kind:"00", tech:"fac", simp:"x + 3", v:6, vs:"6", lab:"lu",
    f:function(x){ return x + 3; }, view:[-1.2, 7.2, -1.5, 10.5], ys:2, desc:"Graph of y = (x² − 9)/(x − 3): the line y = x + 3 with an open circle at (3, 6).",
    F:{ q:function(X, x){ return x === 3 ? null : XQ.div(XQ.sub(XQ.mul(X, X), 9), XQ.sub(X, 3)); }, at:"(0/0)" },
    steps:[{ s:"x → 3", e:"{x^2 - 9}/{x - 3}", n:"Substitution gave 0/0, so simplify first." },
      { p:"=", s:"x → 3", e:"{(x - 3)(x + 3)}/{x - 3}", n:"Factor the numerator: a difference of squares." },
      { p:"=", s:"x → 3", e:"{⟦(x - 3)⟧(x + 3)}/{⟦x - 3⟧}", n:"Cancel `x - 3`. That’s allowed because `x ≠ 3` in a limit." },
      { p:"=", s:"x → 3", e:"(x + 3)", n:"This equals the original expression for every `x ≠ 3`." },
      { p:"=", e:"3 + 3 = 6", n:"Substitute into the simpler expression: the limit is 6." }] },
  L2:{ a:2, sub:"x → 2", expr:"{x^3 - 8}/{x - 2}", subst:"{2^3 - 8}/{2 - 2} = {0}/{0}", kind:"00", tech:"fac", simp:"x^2 + 2x + 4", v:12, vs:"12", lab:"lu",
    f:function(x){ return x * x + 2 * x + 4; }, view:[-2.8, 4.2, -2, 22], ys:4, desc:"Graph of y = (x³ − 8)/(x − 2): the parabola y = x² + 2x + 4 with an open circle at (2, 12).",
    F:{ q:function(X, x){ return x === 2 ? null : XQ.div(XQ.sub(XQ.mul(X, XQ.mul(X, X)), 8), XQ.sub(X, 2)); }, at:"(0/0)" },
    steps:[{ s:"x → 2", e:"{x^3 - 8}/{x - 2}", n:"Substitution gave 0/0, so simplify first." },
      { p:"=", s:"x → 2", e:"{(x - 2)(x^2 + 2x + 4)}/{x - 2}", n:"Factor the difference of cubes." },
      { p:"=", s:"x → 2", e:"{⟦(x - 2)⟧(x^2 + 2x + 4)}/{⟦x - 2⟧}", n:"Cancel `x - 2`. That’s allowed because `x ≠ 2` in a limit." },
      { p:"=", s:"x → 2", e:"(x^2 + 2x + 4)", n:"This equals the original expression for every `x ≠ 2`." },
      { p:"=", e:"4 + 4 + 4 = 12", n:"Substitute into the simpler expression: the limit is 12." }] },
  L3:{ a:4, sub:"x → 4", expr:"{√x - 2}/{x - 4}", subst:"{√4 - 2}/{4 - 4} = {0}/{0}", kind:"00", tech:"rat", simp:"{1}/{√x + 2}", v:0.25, vs:"{1}/{4}", lab:"ru",
    f:function(x){ return x < 0 ? NaN : 1 / (Math.sqrt(x) + 2); }, dom:[0, 60], dots:[[0, 0.5]], view:[-0.8, 9.6, -0.12, 0.66], ys:0.1,
    desc:"Graph of y = (√x − 2)/(x − 4) for x ≥ 0: a curve starting at the filled dot (0, 0.5) and falling slowly, with an open circle at (4, 0.25).",
    F:{ f:function(x){ return x === 4 ? NaN : (Math.sqrt(x) - 2) / (x - 4); }, at:"(0/0)" },
    steps:[{ s:"x → 4", e:"{√x - 2}/{x - 4}", n:"Substitution gave 0/0, and the radical causes it." },
      { p:"=", s:"x → 4", e:"{√x - 2}/{x - 4} · {√x + 2}/{√x + 2}", n:"Multiply top and bottom by the conjugate `√x + 2`." },
      { p:"=", s:"x → 4", e:"{x - 4}/{(x - 4)(√x + 2)}", n:"Top: `(√x)^2 - 4 = x - 4`. Leave the bottom factored." },
      { p:"=", s:"x → 4", e:"{⟦x - 4⟧}/{⟦(x - 4)⟧(√x + 2)}", n:"Cancel `x - 4`. That’s allowed because `x ≠ 4` in a limit." },
      { p:"=", s:"x → 4", e:"{1}/{√x + 2}", n:"This equals the original expression for every `x ≠ 4` (with `x ≥ 0`)." },
      { p:"=", e:"{1}/{√4 + 2} = {1}/{4}", n:"Substitute into the simpler expression: the limit is `{1}/{4}`." }] },
  L4:{ a:0, sub:"x → 0", expr:"{{1}/{x + 2} - {1}/{2}}/{x}", subst:"{{1}/{2} - {1}/{2}}/{0} = {0}/{0}", kind:"00", tech:"cd", simp:"-{1}/{2(x + 2)}", v:-0.25, vs:"-{1}/{4}", lab:"rd",
    f:function(x){ return -1 / (2 * (x + 2)); }, va:-2, view:[-4.6, 3.6, -1.3, 0.8], ys:0.25,
    desc:"Graph of y = [1/(x + 2) − 1/2]/x: a curve with a vertical asymptote x = −2 and an open circle at (0, −0.25).",
    F:{ q:function(X, x){ return x === 0 || x === -2 ? null : XQ.div(XQ.sub(XQ.div(1, XQ.add(X, 2)), 0.5), X); }, at:"(0/0)" },
    steps:[{ s:"x → 0", e:"{{1}/{x + 2} - {1}/{2}}/{x}", n:"Substitution gave 0/0, and the fractions on top cause it." },
      { p:"=", s:"x → 0", e:"{{2 - (x + 2)}/{2(x + 2)}}/{x}", n:"Combine the top over the common denominator `2(x + 2)`." },
      { p:"=", s:"x → 0", e:"{-x}/{2x(x + 2)}", n:"The top simplifies to `-x`, and dividing by `x` puts an `x` in the bottom." },
      { p:"=", s:"x → 0", e:"{-⟦x⟧}/{2⟦x⟧(x + 2)}", n:"Cancel `x`. That’s allowed because `x ≠ 0` in a limit." },
      { p:"=", s:"x → 0", e:"-{1}/{2(x + 2)}", n:"This equals the original expression for every `x ≠ 0`." },
      { p:"=", e:"-{1}/{2(0 + 2)} = -{1}/{4}", n:"Substitute into the simpler expression: the limit is `-{1}/{4}`." }] },
  L5:{ a:1, sub:"x → 1", expr:"{∛x - 1}/{x - 1}", subst:"{∛1 - 1}/{1 - 1} = {0}/{0}", kind:"00", tech:"cv", simp:"{1}/{u^2 + u + 1}", v:1 / 3, vs:"{1}/{3}", lab:"ru",
    f:function(x){ var u = Math.cbrt(x); return 1 / (u * u + u + 1); }, view:[-3.2, 6.4, -0.2, 1.55], ys:0.25,
    desc:"Graph of y = (∛x − 1)/(x − 1): a smooth hump with its peak near x = 0, falling toward 0 on both sides, with an open circle at (1, 1/3).",
    F:{ f:function(x){ return x === 1 ? NaN : (Math.cbrt(x) - 1) / (x - 1); }, at:"(0/0)" },
    steps:[{ s:"x → 1", e:"{∛x - 1}/{x - 1}", n:"Substitution gave 0/0, and the cube root causes it." },
      { p:"=", s:"u → 1", e:"{u - 1}/{u^3 - 1}", n:"Let `u = ∛x`. Then `x = u^3`, and `u → 1` as `x → 1`." },
      { p:"=", s:"u → 1", e:"{⟦u - 1⟧}/{⟦(u - 1)⟧(u^2 + u + 1)}", n:"Factor the difference of cubes and cancel `u - 1` (`u ≠ 1`)." },
      { p:"=", s:"u → 1", e:"{1}/{u^2 + u + 1}", n:"This equals the original expression for every `x ≠ 1`." },
      { p:"=", e:"{1}/{1 + 1 + 1} = {1}/{3}", n:"Substitute `u = 1`: the limit is `{1}/{3}`." }] },
  L6:{ a:2, sub:"x → 2", expr:"{x + 1}/{x - 2}", subst:"{2 + 1}/{2 - 2} = {3}/{0}", kind:"n0", tech:"side", v:null,
    f:function(x){ return (x + 1) / (x - 2); }, va:2, view:[-3, 7, -12, 14], ys:4,
    desc:"Graph of y = (x + 1)/(x − 2): a curve with a vertical asymptote x = 2. Left of 2 it falls without bound; right of 2 it rises without bound.",
    F:{ q:function(X, x){ return x === 2 ? null : XQ.div(XQ.add(X, 1), XQ.sub(X, 2)); }, at:"(division by 0)" },
    steps:[{ s:"x → 2", e:"{x + 1}/{x - 2}", n:"Substitution gave 3/0: not 0/0, so there’s nothing to cancel. Check each side." },
      { p:"Left:", e:"{1.99 + 1}/{1.99 - 2} = {2.99}/{-0.01} = -299", n:"Top near 3, bottom tiny and negative: the values decrease without bound." },
      { p:"Right:", e:"{2.01 + 1}/{2.01 - 2} = {3.01}/{0.01} = 301", n:"Top near 3, bottom tiny and positive: the values grow without bound." },
      { p:"So:", t:"no limit", n:"The sides don’t approach a number, so the limit does not exist. The graph has a vertical asymptote `x = 2`." }] },
  L7:{ a:1, sub:"x → 1", expr:"{x^2 + 3}/{x + 1}", subst:"{1^2 + 3}/{1 + 1} = {4}/{2} = 2", kind:"num", v:2, vs:"2", lab:"rd",
    f:function(x){ return (x * x + 3) / (x + 1); }, va:-1, dots:[[1, 2]], view:[-4.5, 5, -10, 10], ys:2,
    desc:"Graph of y = (x² + 3)/(x + 1): a curve with a vertical asymptote x = −1 that passes smoothly through the filled point (1, 2).",
    F:{ q:function(X, x){ return x === -1 ? null : XQ.div(XQ.add(XQ.mul(X, X), 3), XQ.add(X, 1)); } },
    steps:[{ s:"x → 1", e:"{x^2 + 3}/{x + 1} = {1^2 + 3}/{1 + 1} = 2", n:"No 0/0: direct substitution gives the limit." }] }
};
var LORDER = ["L1", "L2", "L3", "L4", "L5", "L6", "L7"];
var TECH = [{ id:"fac", t:"Factor and cancel" }, { id:"rat", t:"Rationalize" }, { id:"cd", t:"Common denominator" },
  { id:"cv", t:"Change of variable (" + m("u = ∛x") + ")" }, { id:"side", t:"Check each side" }];
var TNAME = { fac:"Factor and cancel", rat:"Rationalize the numerator", cd:"Common denominator", cv:"Change of variable, " + m("u = ∛x"), side:"Check each side" };
var R00 = "checking each side is for nonzero/0. This is 0/0, so simplify first.";
var FAC = { rat:"there’s no radical to clear. Factor the numerator.", cd:"there are no fractions to combine. Factor the numerator.", cv:"there’s no cube root to replace. Factor the numerator.", side:R00 };
var N0 = "3/0 isn’t 0/0, so there’s nothing to simplify. Check each side.";
var WHY = {
  L1:FAC, L2:FAC,
  L3:{ fac:"the radical is what makes it 0/0; rationalize.", cd:"there are no fractions to combine; the radical is what makes it 0/0.", cv:"`u = ∛x` replaces a cube root, and this is a square root. Rationalize.", side:R00 },
  L4:{ fac:"combine the fractions in the numerator first.", rat:"there’s no radical. Combine the fractions in the numerator.", cv:"there’s no cube root. Combine the fractions in the numerator.", side:R00 },
  L5:{ fac:"`∛x - 1` isn’t a polynomial factor yet. Let `u = ∛x` first.", rat:"a cube root has no two-term conjugate. Let `u = ∛x`.", cd:"there are no fractions to combine. Let `u = ∛x`.", side:R00 },
  L6:{ fac:"3/0 isn’t 0/0, so there’s no common factor to cancel. Check each side.", rat:N0, cd:N0, cv:N0 }
};

// ---------- limit laws (Explore mode 3): lim f = 4, lim g = −2; cards evaluate a ready piece, innermost first ----------
function T(op, a, b, k){ return { op:op, a:a, b:b, k:k }; }
function Fn(){ return { op:"f" }; } function Gn(){ return { op:"g" }; } function Cn(v){ return { op:"c", k:v }; }
var LEXP = {
  E1:T("sub", T("cmul", Fn(), null, 3), T("pow", Gn(), null, 2)),
  E2:T("div", Fn(), Gn()),
  E3:T("root", Fn()),
  E4:T("add", T("mul", Fn(), Gn()), Cn(3)),
  E5:T("div", Fn(), T("add", Gn(), Cn(2)))
};
var LORD = ["E1", "E2", "E3", "E4", "E5"];
function nodes(e){ var out = []; (function walk(n){ if (!n) return; walk(n.a); walk(n.b); out.push(n); })(LEXP[e]); return out; }
LORD.forEach(function(e){ nodes(e).forEach(function(n, i){ n.id = i; }); });
var LAWS = [{ id:"add", t:"Sum law", w:"sum" }, { id:"sub", t:"Difference law", w:"difference" }, { id:"cmul", t:"Constant multiple law", w:"constant multiple" },
  { id:"mul", t:"Product law", w:"product" }, { id:"div", t:"Quotient law", w:"quotient" }, { id:"pow", t:"Power law", w:"power" }, { id:"root", t:"Root law", w:"root" }];
var LAWI = {}; LAWS.forEach(function(l){ LAWI[l.id] = l; });
function leaf(n){ return n.op === "f" || n.op === "g" || n.op === "c"; }
function lval(n){
  if (n.op === "f") return 4; if (n.op === "g") return -2; if (n.op === "c") return n.k;
  var a = lval(n.a), b = n.b ? lval(n.b) : 0;
  return n.op === "add" ? a + b : n.op === "sub" ? a - b : n.op === "cmul" ? n.k * a : n.op === "mul" ? a * b : n.op === "div" ? (b ? a / b : NaN) : n.op === "pow" ? Math.pow(a, n.k) : Math.sqrt(a);
}
function compound(n){ return n.op === "add" || n.op === "sub" || n.op === "mul" || n.op === "cmul"; }
function lsrc(n){
  switch (n.op) {
    case "f": return "f(x)"; case "g": return "g(x)"; case "c": return String(n.k);
    case "add": return lsrc(n.a) + " + " + lsrc(n.b);
    case "sub": return lsrc(n.a) + " - " + lsrc(n.b);
    case "cmul": return n.k + lsrc(n.a);
    case "mul": return lsrc(n.a) + " · " + lsrc(n.b);
    case "div": return "{" + lsrc(n.a) + "}/{" + lsrc(n.b) + "}";
    case "pow": return (compound(n.a) ? "[" + lsrc(n.a) + "]" : lsrc(n.a)) + "^" + n.k;
    default: return "√{" + lsrc(n.a) + "}";
  }
}
function br(n){ return compound(n) ? "[" + lsrc(n) + "]" : lsrc(n); }
function limIn(n){ return lim("x → a") + mi(br(n)); }            // HTML for use inside one .m span
function pv(v){ v = r9(v); return v < 0 ? "(" + nsrc(v) + ")" : nsrc(v); }
function lawLine(n){
  var va = lval(n.a), vb = n.b ? lval(n.b) : null, R = nsrc(lval(n)), h = limIn(n) + mi(" = ");
  if (n.op === "add" || n.op === "sub") { var s = n.op === "add" ? " + " : " - "; h += limIn(n.a) + mi(s) + limIn(n.b) + mi(" = " + nsrc(va) + s + pv(vb) + " = " + R); }
  else if (n.op === "cmul") h += mi(String(n.k)) + " " + limIn(n.a) + mi(" = " + n.k + "(" + nsrc(va) + ") = " + R);
  else if (n.op === "mul") h += limIn(n.a) + mi(" · ") + limIn(n.b) + mi(" = " + nsrc(va) + pv(vb) + " = " + R);
  else if (n.op === "div") h += '<span class="frac"><span class="fn">' + limIn(n.a) + '</span><span class="fd">' + limIn(n.b) + "</span></span>" + mi(" = {" + nsrc(va) + "}/{" + nsrc(vb) + "} = " + R);
  else if (n.op === "pow") h += mi("[") + limIn(n.a) + mi("]^" + n.k + " = " + pv(va) + "^" + n.k + " = " + R);
  else h += '<span class="rad"><span class="rs">√</span><span class="rb">' + limIn(n.a) + "</span></span>" + mi(" = √" + nsrc(va) + " = " + R);
  return '<span class="m">' + h + "</span>";
}

// ---------- the 0/0 detective (Explore centrepiece) ----------
// @component V7 ruleChooser — MHF4U N15 extended to limits: a technique menu as a real radio group (radios above) with an apply
//   button ("Simplify"), named "That doesn’t apply here: <reason>." feedback per (expression, rule) pair (WHY), and an N13
//   step-through of the chosen rule's algebra lines (MV.player in a fresh host; lines {p, s, e, n}; ⟦…⟧ strikes a cancelled
//   factor in --ink-2), auto-played once after a correct choice. Also here: the substitution badge, the V6 table view and the
//   limit-law card builder (lawLine/LEXP: bottom-up law cards with the quotient law refused when the bottom's limit is 0).
//   var t = detective(host, {S, save, changed}); t.apply(state), t.simplify(cb), t.law(id), t.fill(cb), t.lock(bool), t.get(), t.paint()
function detective(host, o){
  var S = o.S;
  if (!LIMS[S.L]) S.L = "L3";
  S.mode = ["steps", "table", "laws"].indexOf(S.mode) >= 0 ? S.mode : "steps";
  S.sub = !!S.sub; S.done = !!S.done; S.tech = TNAME[S.tech] ? S.tech : null; S.step = S.step | 0;
  S.tL = S.tL == null ? 3 : S.tL; S.tR = S.tR == null ? 3 : S.tR;
  if (!S.law || !LEXP[S.law.e] || !Array.isArray(S.law.log)) S.law = { e:"E1", log:[] };
  var locked = false, fb = null, lfb = null, tok = 0, timer = null, pending = null, pl = null, stepsKey = "";
  var Lay = MV.pgLayout(host, { aria:"Graph of the chosen limit’s function" });
  var pg = $(".pg", host); pg.classList.add("pl-pg");
  var pwrap = $(".plot-wrap", Lay.graph);
  Lay.banner.insertAdjacentHTML("afterend", '<p class="pl-subl" aria-live="polite"></p><div class="pl-steps"></div><div class="pl-laws"></div>');
  pwrap.insertAdjacentHTML("afterend", '<div class="pl-tbl"></div>');
  var E = { subl:$(".pl-subl", host), steps:$(".pl-steps", host), laws:$(".pl-laws", host), tbl:$(".pl-tbl", host) };
  Lay.ctrl.innerHTML = '<div class="pl-modes"></div>' +
    '<div class="pl-det"><p class="pl-lab" id="pl-limlab">Limit</p><div class="chips pl-lims" role="group" aria-labelledby="pl-limlab"></div>' +
      '<div class="pl-stp"><span class="pl-sn">Step 1</span><button type="button" class="btn primary sm" data-act="sub" data-k="plsub">Substitute directly</button></div>' +
      '<div class="pl-stp pl-stp2"><span class="pl-sn">Step 2</span><span class="pl-sl2">Choose a technique</span><div class="pl-techs"></div>' +
        '<div class="pl-acts"><button type="button" class="btn primary sm" data-act="simp" data-k="plsimp">Simplify</button><button type="button" class="btn ghost sm" data-act="reset" data-k="plreset">Start this limit over</button></div></div>' +
      '<div class="pl-fb" aria-live="polite"></div></div>' +
    '<div class="pl-lawc" hidden><p class="pl-lab" id="pl-explab">Expression</p><div class="chips pl-exps" role="group" aria-labelledby="pl-explab"></div>' +
      '<p class="pl-lab" id="pl-cardlab">Law cards <span class="tiny muted">(each one you tap joins the list)</span></p><div class="pl-cards" role="group" aria-labelledby="pl-cardlab"></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="lclear" data-k="pllclear">Clear the list</button></div><div class="pl-lfb" aria-live="polite"></div></div>';
  var plot = new MV.Plot(Lay.canvas, { xmin:-1, xmax:7, ymin:-1, ymax:10 });
  function save(){ o.save(); if (o.changed) o.changed(); }
  var modeSeg = MV.seg($(".pl-modes", host), { label:"Mode:", value:S.mode, options:[{ id:"steps", t:"Algebra steps" }, { id:"table", t:"Graph + table" }, { id:"laws", t:"Limit laws" }],
    onChange:function(v){ if (locked) { modeSeg.set(S.mode); return; } S.mode = v; save(); paint(); } });
  var rg = radios($(".pl-techs", host), { aria:"Technique", options:TECH, value:S.tech,
    onChange:function(id){ if (locked || S.done) return; S.tech = id; fb = null; save(); paint(); } });

  // ---- actions ----
  function cancelAuto(){ tok++; clearTimeout(timer); var c = pending; pending = null; if (c) c(); }
  function setL(id){ cancelAuto(); S.L = id; S.sub = false; S.done = false; S.tech = null; S.step = 0; S.tL = 3; S.tR = 3; fb = null; }
  function substitute(){ if (S.sub) return; S.sub = true; if (LIMS[S.L].kind === "num") S.done = true; fb = null; save(); paint(); }
  function goStep(i){ S.step = i; if (pl) pl.go(i); o.save(); }
  function autoplay(cb){
    cancelAuto(); pending = cb || null;
    var n = LIMS[S.L].steps.length, my = tok;
    (function next(){
      if (my !== tok) return;
      if (S.step >= n - 1) { var c = pending; pending = null; if (c) c(); return; }
      timer = MV.wait(S.step === 0 ? 550 : 950, function(){ if (my !== tok) return; goStep(S.step + 1); next(); });
    })();
  }
  function simplify(cb){
    var sp = LIMS[S.L];
    if (!S.sub) { fb = { h:"Substitute first: press <strong>Substitute directly</strong>." }; paint(); if (cb) cb(); return; }
    if (sp.kind === "num") { fb = { bad:true, h:"That doesn’t apply here: direct substitution already gives the limit, 2." }; paint(); if (cb) cb(); return; }
    if (S.done) { if (cb) cb(); return; }
    if (!S.tech) { fb = { h:"Choose a technique first." }; paint(); if (cb) cb(); return; }
    if (S.tech !== sp.tech) { fb = { bad:true, wrong:true, h:"That doesn’t apply here: " + md(WHY[S.L][S.tech]) }; paint(); if (cb) cb(); return; }
    S.done = true; fb = null;
    if (S.mode !== "steps") { S.step = sp.steps.length - 1; save(); paint(); if (cb) cb(); return; }
    S.step = 0; save(); paint(); autoplay(cb);
  }
  function lawState(){
    var st = S.law, list = nodes(st.e), done = {}, refused = null;
    st.log.forEach(function(x){ if (x.refused) refused = x; else done[x.node] = 1; });
    var root = list[list.length - 1];
    return { list:list, done:done, refused:refused, root:root, finished:!!refused || !!done[root.id] };
  }
  function law(id){
    var st = S.law, L = lawState(), w = LAWI[id].w;
    function ready(n){ return leaf(n) || L.done[n.id]; }
    if (L.finished) { lfb = { h:"This one is finished. Choose another expression, or clear the list." }; paint(); return; }
    var cand = L.list.filter(function(n){ return n.op === id && !L.done[n.id]; });
    if (!cand.length) { lfb = { bad:true, h:"The " + LAWI[id].t.toLowerCase() + " doesn’t apply: there’s no " + w + " left to evaluate in this expression." }; paint(); return; }
    var rd = cand.filter(function(n){ return ready(n.a) && (!n.b || ready(n.b)); });
    if (!rd.length) { var c = cand[0], need = [c.a, c.b].filter(function(x){ return x && !ready(x); })[0];
      lfb = { bad:true, h:"Not yet: find " + '<span class="m">' + limIn(need) + "</span> first. The " + w + " is built from it." }; paint(); return; }
    var n = rd[0];
    if (id === "div" && lval(n.b) === 0) { st.log.push({ law:id, node:n.id, refused:true });
      lfb = { bad:true, h:"The quotient law needs a non-zero denominator limit." }; save(); paint(); return; }
    st.log.push({ law:id, node:n.id }); lfb = null; save(); paint();
  }

  // ---- drawing ----
  function draw(){
    if (S.mode === "laws") return;
    var sp = LIMS[S.L], v = { xmin:sp.view[0], xmax:sp.view[1], ymin:sp.view[2], ymax:sp.view[3] }, found = S.done;
    var sc = { view:v, xTicks:{ step:1 }, yTicks:{ step:sp.ys }, curves:[{ f:sp.f, domain:sp.dom, color:css("--pen"), width:3 }], asymptotes:[], points:[] };
    if (sp.va != null) sc.asymptotes.push({ x:sp.va });
    (sp.dots || []).forEach(function(p){ sc.points.push({ x:p[0], y:p[1], color:css("--pen"), r:5.5 }); });
    if (sp.kind === "00") sc.points.push({ x:sp.a, y:sp.v, open:true, color:css("--pen"), r:6 });
    var desc = sp.desc;
    if (found && sp.v != null) desc += " A ring marks the limit, " + fracTxt(sp.v) + (sp.kind === "00" ? ", at the hole, which stays open." : ".");
    if (found && sp.kind === "n0") desc += " The limit does not exist.";
    sc.describe = desc;
    sc.after = function(ctx, pl){
      if (found && sp.v != null) {
        var X = pl.X(sp.a), Y = pl.Y(sp.v), left = sp.lab.charAt(0) === "l", up = sp.lab.charAt(1) === "u";
        ring(ctx, X, Y, 11);
        cLabel(ctx, "limit " + fracTxt(sp.v), X + (left ? -16 : 16), Y + (up ? -20 : 22), { align:left ? "right" : "left" });
      }
      if (found && sp.kind === "n0") {
        var XA = pl.X(sp.va);
        cLabel(ctx, "grows without bound ↑", XA + 10, 16, { align:"left", font:"600 13px " });
        cLabel(ctx, "↓ decreases without bound", XA - 10, pl.H - 16, { align:"right", font:"600 13px " });
      }
    };
    plot.draw(sc);
  }
  plot.render = draw;

  // ---- panels ----
  function lineHTML(st){
    return (st.p ? (st.p === "=" ? m("=") : '<span class="pl-pre">' + st.p + "</span>") + " " : "") + (st.s ? lim(st.s) + " " : "") + (st.e ? mx(st.e) : "") + (st.t ? "<strong>" + st.t + "</strong>" : "");
  }
  function renderLines(i){
    var sp = LIMS[S.L], box = $(".pl-lines", E.steps); if (!box) return;
    S.step = i;
    box.innerHTML = sp.steps.slice(0, i + 1).map(function(st, j){
      return '<div class="pl-ln' + (j === i ? " cur" : "") + '"><div class="pl-lm">' + lineHTML(st) + "</div>" + (j === i ? '<p class="pl-note">' + md(st.n) + "</p>" : "") + "</div>";
    }).join("");
  }
  function paintSteps(){
    var sp = LIMS[S.L], key = S.L + "|" + S.sub + "|" + S.done;
    if (key === stepsKey) return;
    stepsKey = key; pl = null;
    var head = '<p class="pl-sth">Algebra steps</p>';
    if (S.done && sp.kind !== "num") {
      E.steps.innerHTML = head + '<div class="pl-lines" aria-live="polite"></div><div class="pl-pl"></div>';
      var keep = Math.max(0, Math.min(sp.steps.length - 1, S.step));
      pl = MV.player($(".pl-pl", E.steps), { count:sp.steps.length, interval:1300, render:renderLines, label:function(i){ return "Step " + (i + 1) + " of " + sp.steps.length; } });
      $(".pl-pl", E.steps).addEventListener("click", function(e){ if (e.target.closest("[data-pl]")) cancelAuto(); }, true);
      pl.go(keep);
      return;
    }
    var note = !S.sub ? "Step 1: press <strong>Substitute directly</strong>." :
      sp.kind === "00" ? "0/0 is indeterminate: it says “simplify first”. Choose a technique in step 2, then press <strong>Simplify</strong>." :
      sp.kind === "n0" ? "Nonzero/0 isn’t indeterminate. Choose a technique in step 2, then press <strong>Simplify</strong>." : md(sp.steps[0].n);
    var st0 = sp.kind === "num" && S.sub ? sp.steps[0] : { s:sp.sub, e:sp.expr };
    E.steps.innerHTML = head + '<div class="pl-lines"><div class="pl-ln cur"><div class="pl-lm">' + lineHTML(st0) + '</div><p class="pl-note">' + note + "</p></div></div>";
  }
  function paintSub(){
    var sp = LIMS[S.L];
    if (!S.sub) { E.subl.innerHTML = '<span class="muted">Direct substitution: not tried yet.</span>'; return; }
    var badge = sp.kind === "00" ? "0/0: indeterminate" : sp.kind === "n0" ? "nonzero/0: the values grow without bound" : "a number: that’s the limit";
    E.subl.innerHTML = "Direct substitution: " + mx(sp.subst) + ' <span class="pl-badge">' + badge + "</span>";
  }
  function paintTable(){
    if (S.mode !== "table") return;
    var sp = LIMS[S.L];
    E.tbl.innerHTML = V6.html(sp.F, sp.a, { shownL:S.tL, shownR:S.tR, hiL:S.tL - 1, hiR:S.tR - 1, rdp:4, note:sp.F.f ? "Values rounded to 4 decimal places." : "Computed exactly by the tool." });
  }
  function paintLaws(){
    if (S.mode !== "laws") return;
    var st = S.law, L = lawState(), tree = LEXP[st.e];
    var h = '<p class="pl-sth">Your list of laws</p><p class="pl-lexp">' + '<span class="m">' + limIn(tree) + "</span></p>";
    if (!st.log.length) h += '<p class="muted pl-lemp">The list is empty. Tap law cards in the order you use them, starting with the innermost piece.</p>';
    else h += '<ol class="pl-slots">' + st.log.map(function(x){
      var n = L.list[x.node];
      return '<li' + (x.refused ? ' class="no"' : "") + '><span class="pl-card">' + LAWI[x.law].t + (x.refused ? " ✗" : "") + '</span><span class="pl-sline">' +
        (x.refused ? '<span class="m">' + limIn(n.b) + mi(" = 0") + "</span>: the quotient law needs a non-zero denominator limit." : lawLine(n)) + "</span></li>";
    }).join("") + "</ol>";
    if (L.refused) h += MV.fbHTML("bad", "<strong>The laws can’t finish this one.</strong> The top heads to 4 and the bottom to 0: that’s nonzero/0, so the values grow without bound and the limit doesn’t exist.");
    else if (L.finished) h += MV.fbHTML("good", "<strong>✓ Done:</strong> " + '<span class="m">' + limIn(tree) + mi(" = " + nsrc(lval(tree))) + "</span>. The laws combined the known limits without the formulas for " + m("f") + " and " + m("g") + ".");
    E.laws.innerHTML = h;
  }
  function paintRead(){
    var sp = LIMS[S.L], q = '<span class="muted">?</span>';
    if (S.mode === "laws") {
      var st = S.law, L = lawState(), tree = LEXP[st.e];
      Lay.read.innerHTML = MV.readoutHTML([
        ["Given", lim("x → a") + " " + m("f(x) = 4") + ", " + lim("x → a") + " " + m("g(x) = -2")],
        ["Expression", lim("x → a") + " " + m(br(tree))],
        ["Laws used", st.log.length ? st.log.map(function(x){ return LAWI[x.law].t.replace(" law", "") + (x.refused ? " (can’t be used)" : ""); }).join(", then ") : '<span class="muted">none yet</span>'],
        ["Limit", L.refused ? "<strong>does not exist</strong> (nonzero/0)" : L.finished ? "<strong>" + ntx(lval(tree)) + "</strong>" : q]
      ]);
      return;
    }
    var tech = fb && fb.wrong ? '<span class="pl-no">' + fb.h + "</span>" : S.done ? (sp.kind === "num" ? "None needed: direct substitution works" : TNAME[sp.tech]) : q;
    var simp = !S.done ? q : sp.kind === "n0" ? m(sp.expr) + " (nothing cancels)" : sp.kind === "num" ? m(sp.expr) + " (no simplifying needed)" : m(sp.simp) + (S.L === "L5" ? ", with " + m("u = ∛x") : "");
    var val = !S.done ? q : sp.kind === "n0" ? "<strong>does not exist</strong> (left: decreases without bound; right: grows without bound)" : "<strong>" + m(sp.vs) + "</strong>";
    var graph = sp.kind === "n0" ? "Vertical asymptote " + m("x = 2") : sp.kind === "num" ? "No hole: the graph passes through " + m("(1, 2)") :
      S.done ? "Hole at " + m("(" + sp.a + ", " + sp.vs + ")") : "Hole at " + m("x = " + nsrc(sp.a)) + ' <span class="tiny muted">(its height is the limit)</span>';
    Lay.read.innerHTML = MV.readoutHTML([
      ["Limit", lim(sp.sub) + " " + m(sp.expr)],
      ["Direct substitution", !S.sub ? '<span class="muted">Press Substitute directly.</span>' : sp.kind === "00" ? "0/0: indeterminate, more work needed" : sp.kind === "n0" ? "3/0: the values grow without bound" : "2 (a number, so that’s the limit)"],
      ["Technique", tech],
      ["Simplified (" + m("x ≠ " + nsrc(sp.a)) + ")", simp],
      ["Limit value", val],
      ["Graph", graph]
    ]);
  }
  function paintCtl(){
    var laws = S.mode === "laws";
    $(".pl-det", host).hidden = laws; $(".pl-lawc", host).hidden = !laws;
    MV.keepFocus($(".pl-lims", host), function(){
      $(".pl-lims", host).innerHTML = LORDER.map(function(id){ var on = S.L === id; return '<button type="button" class="fchip pl-lchip" data-l="' + id + '" data-k="pll' + id + '" aria-pressed="' + on + '"' + (locked ? " disabled" : "") + '><span class="pl-cn">' + id + "</span> " + m(LIMS[id].expr) + "</button>"; }).join("");
    });
    var bs = $('[data-act="sub"]', host), bm = $('[data-act="simp"]', host), br0 = $('[data-act="reset"]', host);
    bs.disabled = locked || S.sub; bm.disabled = locked || S.done; br0.disabled = locked || !S.sub;
    bs.textContent = S.sub ? "Substituted" : "Substitute directly";
    rg.set(S.tech); rg.lock(locked || S.done);
    modeSeg.set(S.mode);
    $(".pl-fb", host).innerHTML = fb ? MV.fbHTML(fb.bad ? "bad" : "", (fb.bad ? "<strong>✗</strong> " : "") + fb.h) : "";
    var L = lawState();
    MV.keepFocus($(".pl-exps", host), function(){
      $(".pl-exps", host).innerHTML = LORD.map(function(e){ var on = S.law.e === e; return '<button type="button" class="fchip pl-echip" data-e="' + e + '" data-k="ple' + e + '" aria-pressed="' + on + '"' + (locked ? " disabled" : "") + ">" + m(br(LEXP[e])) + "</button>"; }).join("");
    });
    MV.keepFocus($(".pl-cards", host), function(){
      $(".pl-cards", host).innerHTML = LAWS.map(function(l){ return '<button type="button" class="btn ghost sm pl-lawb" data-law="' + l.id + '" data-k="plw' + l.id + '"' + (locked || L.finished ? " disabled" : "") + ">" + l.t + "</button>"; }).join("");
    });
    $('[data-act="lclear"]', host).disabled = locked || !S.law.log.length;
    $(".pl-lfb", host).innerHTML = lfb ? MV.fbHTML(lfb.bad ? "bad" : "", (lfb.bad ? "<strong>✗</strong> " : "") + lfb.h) : "";
  }
  function paint(){
    var sp = LIMS[S.L], laws = S.mode === "laws";
    Lay.cap.innerHTML = laws ? '<span class="pl-giv">' + lim("x → a") + m("f(x) = 4") + ',</span><span class="pl-giv">' + lim("x → a") + m("g(x) = -2") + "</span>" : lim(sp.sub) + " " + mx(sp.expr);
    pwrap.hidden = laws; E.subl.hidden = laws; E.steps.hidden = S.mode !== "steps"; E.laws.hidden = !laws; E.tbl.hidden = S.mode !== "table";
    paintCtl(); paintSub(); paintSteps(); paintTable(); paintLaws(); paintRead(); draw();
  }
  Lay.ctrl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked) return;
    if (b.dataset.l) { if (b.dataset.l !== S.L) { setL(b.dataset.l); save(); paint(); } return; }
    if (b.dataset.e) { if (b.dataset.e !== S.law.e) { S.law = { e:b.dataset.e, log:[] }; lfb = null; save(); paint(); } return; }
    if (b.dataset.law) { law(b.dataset.law); return; }
    var act = b.dataset.act;
    if (act === "sub") substitute();
    else if (act === "simp") simplify();
    else if (act === "reset") { setL(S.L); save(); paint(); }
    else if (act === "lclear") { S.law.log = []; lfb = null; save(); paint(); }
  });
  paint();
  return {
    apply:function(st){
      cancelAuto();
      if (st.L) setL(st.L);
      ["mode", "sub", "tech", "done", "tL", "tR"].forEach(function(k){ if (st[k] !== undefined) S[k] = st[k]; });
      if (st.law) S.law = { e:st.law, log:[] };
      fb = null; lfb = null; stepsKey = ""; save(); paint();
    },
    simplify:simplify,
    law:law,
    fill:function(cb){
      var seq = ["tR", "tL", "tR", "tL", "tR", "tL"], i = 0;
      (function next(){
        if (i >= seq.length) { if (cb) cb(); return; }
        var k = seq[i++]; S[k] = Math.min(3, S[k] + 1); paintTable(); o.save();
        MV.wait(i === 1 ? 300 : 650, next);
      })();
    },
    setTech:function(id){ S.tech = id; rg.set(id); paintCtl(); },
    lock:function(v){ locked = !!v; host.classList.toggle("pl-locked", locked); paintCtl(); },
    get:function(){ return S; },
    paint:paint
  };
}

// ---------- hero storyboard: substitute (0/0?), factor, cancel (x ≠ 3), x + 3 remains, ring at the hole's height ----------
function hero(f){
  if (!f.canvas) return;
  var V = { xmin:-1.2, xmax:7.2, ymin:-1.5, ymax:10.5 }, p = new MV.Plot(f.canvas, V), st = { q:0, ring:0, lab:false };
  p.render = function(){
    p.draw({ view:V, xTicks:{ step:1 }, yTicks:{ step:2 }, curves:[{ f:function(x){ return x + 3; }, color:css("--pen"), width:3.2 }],
      points:[{ x:3, y:6, open:true, color:css("--pen"), r:6 }],
      describe:"The graph of y = (x² − 9)/(x − 3): the line y = x + 3 with an open circle at (3, 6)." + (st.lab ? " A ring marks the limit 6 at the hole, which stays open." : st.q ? " Substituting x = 3 gives 0/0." : ""),
      after:function(ctx, pl){
        var X = pl.X(3), Y = pl.Y(6);
        if (st.q > 0) {
          ctx.save(); ctx.globalAlpha = st.q; ctx.font = "700 17px " + (css("--font-math") || "serif"); ctx.textAlign = "center"; ctx.textBaseline = "middle";
          var w = ctx.measureText("0/0?").width; ctx.fillStyle = css("--hi"); ctx.fillRect(X - w / 2 - 6, Y - 44, w + 12, 26);
          ctx.fillStyle = css("--hi-ink"); ctx.fillText("0/0?", X, Y - 31); ctx.restore();
        }
        if (st.ring > 0) ring(ctx, X, Y, 11 * st.ring);
        if (st.lab) {
          ctx.save(); ctx.font = "600 14px " + (css("--font-math") || "serif"); var wl = ctx.measureText("limit 6 (the hole stays open)").width; ctx.restore();
          if (X - 16 - wl > 6) cLabel(ctx, "limit 6 (the hole stays open)", X - 16, Y - 22, { align:"right" });
          else { cLabel(ctx, "limit 6", X + 14, Y + 22); cLabel(ctx, "(the hole stays open)", X + 14, Y + 42); }
        }
      } });
  };
  var cap0 = m("y = {x^2 - 9}/{x - 3}"), capEnd = m("{x^2 - 9}/{x - 3} = x + 3") + ' <span class="pl-hnote">for ' + m("x ≠ 3") + "</span>";
  function finish(){ st = { q:0, ring:1, lab:true }; f.cap.innerHTML = capEnd; p.render(); }
  if (MV.reduceMotion) { finish(); return; }
  f.cap.innerHTML = cap0; p.render();
  MV.wait(900, function(){
    f.cap.innerHTML = "Substitute " + m("x = 3") + ": " + m("{9 - 9}/{3 - 3} = {0}/{0}");
    var n = 0;
    (function flash(){ st.q = n % 2 ? 0.25 : 1; p.render(); n++; if (n < 6) MV.wait(330, flash); else {
      st.q = 1; p.render();
      MV.wait(700, function(){
        f.cap.innerHTML = mx("{x^2 - 9}/{x - 3} = {(x - 3)(x + 3)}/{x - 3}");
        MV.wait(1400, function(){
          f.cap.innerHTML = mx("{⟦(x - 3)⟧(x + 3)}/{⟦x - 3⟧}") + ' <span class="pl-hnote">' + m("x ≠ 3") + "</span>";
          MV.wait(80, function(){ f.cap.classList.add("pl-fade"); });
          MV.wait(1500, function(){
            f.cap.classList.remove("pl-fade"); f.cap.innerHTML = m("x + 3") + ' <span class="pl-hnote">(' + m("x ≠ 3") + ")</span>"; st.q = 0;
            MV.tween({ dur:1800, step:function(t){ st.ring = 1 + 0.45 * Math.sin(t * Math.PI * 3) * (1 - t); p.render(); }, done:function(){
              st.ring = 1; st.lab = true; p.render(); MV.wait(900, function(){ f.cap.innerHTML = capEnd; });
            } });
          });
        });
      });
    } })();
  });
}

// ---------- Explore: detective, challenge workbench, predictions and challenges ----------
var PSTART = {
  p1:{ mode:"steps", L:"L1", sub:true },
  p2:{ mode:"table", L:"L6", sub:true, tL:0, tR:0 },
  p3:{ mode:"steps", L:"L3", sub:true, tech:"rat" },
  p4:{ mode:"laws", law:"E4" }
};
function tc3F(a){ return { f:function(x){ return x === 0 ? NaN : (Math.sqrt(a * x + 9) - 3) / x; }, at:"(0/0)" }; }
function numIn(raw){
  var s = String(raw || "").trim(); if (!s) return { err:"empty" };
  if (/undef|exist|dne|no limit|none|∞|infin/i.test(s)) return { word:true };
  var q = Q.raw(s); if (q) return { v:q.n / q.d };
  var p = MV.parseNum(s); if (p && p.length === 1 && isFinite(p[0])) return { v:p[0] };
  return { err:"bad" };
}
function explore(host, api){
  var S = api.S;
  S.tc1 = typeof S.tc1 === "string" ? S.tc1 : ""; S.tc2 = typeof S.tc2 === "string" ? S.tc2 : ""; S.a = typeof S.a === "number" ? S.a : 0;
  var wrap = document.createElement("div"); host.appendChild(wrap);
  var tool = detective(wrap, { S:S, save:api.save, changed:api.changed });
  var wb = document.createElement("div"); wb.className = "pl-wb"; host.appendChild(wb);
  wb.innerHTML = '<h3 class="pl-wbh">Challenge workbench</h3>' +
    '<div class="pl-wbr"><span class="pl-wbn">Challenge 1</span><label class="pl-wbq" for="pl-tc1">' + lim("x → -1") + " " + m("{x^2 + 4x + 3}/{x + 1} =") + '</label><input class="numin short" id="pl-tc1" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(S.tc1) + '"></div>' +
    '<div class="pl-wbr"><span class="pl-wbn">Challenge 2</span><label class="pl-wbq" for="pl-tc2">' + lim("x → 0") + " " + m("{√{9 + x} - 3}/{x} =") + '</label><input class="numin short" id="pl-tc2" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(S.tc2) + '"></div>' +
    '<p class="tiny muted pl-wbt">Type a whole number or a fraction such as 3/4.</p>' +
    '<div class="pl-wb3"><span class="pl-wbn">Challenge 3</span><p class="pl-wbq">' + lim("x → 0") + " " + m("{√{ax + 9} - 3}/{x}") + '</p>' +
      '<label class="slider pl-sl"><span class="slider-top"><span>' + m("a") + ' <span class="tiny muted">(from −20 to 20)</span></span><output id="pl-aout"></output></span>' +
      '<input type="range" id="pl-a" min="-20" max="20" step="1" style="accent-color:var(--ink)" aria-label="a, from −20 to 20"></label><div id="pl-tc3t" aria-live="polite"></div></div>';
  function paintTc3(){
    $("#pl-a").value = S.a; $("#pl-aout").textContent = ntx(S.a, 0);
    $("#pl-tc3t").innerHTML = '<p class="pl-tc3c">Table for ' + m("g(x) = {√{ax + 9} - 3}/{x}") + " with " + m("a = " + nsrc(S.a)) + "</p>" + V6.html(tc3F(S.a), 0, { name:"g", rdp:4, note:"Values rounded to 4 decimal places." });
  }
  wb.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "pl-tc1") S.tc1 = t.value; else if (t.id === "pl-tc2") S.tc2 = t.value;
    else if (t.id === "pl-a") { S.a = Math.round(+t.value); paintTc3(); }
    else return;
    api.save(); api.changed();
  });
  paintTc3();
  function numChal(raw, ans, named, gen){
    var r = numIn(raw);
    if (r.err === "empty") return { ok:false, msg:"Type the limit in the workbench first." };
    if (r.err) return { ok:false, msg:"Type a whole number or a fraction, such as 2 or 3/4." };
    if (r.word) return { ok:false, msg:md("Substitution gives 0/0, which isn’t “no limit”: simplify first. " + gen) };
    if (close(r.v, ans, 1e-9)) return { ok:true };
    for (var i = 0; i < named.length; i++) if (close(r.v, named[i][0], 1e-9)) return { ok:false, msg:md(named[i][1]) };
    return { ok:false, msg:md(gen) };
  }
  function chal(id){
    if (id === "tc1") return numChal(S.tc1, 2, [[0, "0/0 isn’t 0. Factor: `(x + 1)(x + 3)`."], [4, "`x + 3` at `x = -1` is 2."], [-2, "Sign slip in `x + 3`."]],
      "Factor the numerator, cancel `x + 1`, then substitute `x = -1`.");
    if (id === "tc2") return numChal(S.tc2, 1 / 6, [[1 / 3, "The denominator is `√9 + 3 = 6`, not `√9`."], [0, "0/0 isn’t 0: it says “simplify first”. Rationalize the numerator."], [6, "The fraction is flipped."]],
      "Rationalize the numerator, cancel `x`, then substitute `x = 0`.");
    if (id === "tc3") {
      if (S.a === 12) return { ok:true };
      if (S.a === 6) return { ok:false, msg:md("That solves `a/3 = 2`. The denominator approaches 3 + 3 = 6.") };
      if (S.a === 2) return { ok:false, msg:md("The limit isn’t `a`; rationalize to see how it depends on `a`.") };
      return { ok:false, msg:md("With `a = " + nsrc(S.a) + "`, both columns of the table head to about " + ntx(S.a / 6, 3) + ", not 2.") };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){ tool.lock(false); tool.apply(PSTART[p.id]); tool.lock(true); },
      run:function(p, done){
        var fin = function(){ tool.lock(false); tool.paint(); done(); };
        if (p.id === "p1") { tool.setTech("fac"); MV.wait(500, function(){ tool.simplify(function(){ MV.wait(500, fin); }); }); }
        else if (p.id === "p2") tool.fill(function(){ tool.setTech("side"); MV.wait(400, function(){ tool.simplify(function(){ MV.wait(300, fin); }); }); });
        else if (p.id === "p3") tool.simplify(function(){ MV.wait(500, fin); });
        else if (p.id === "p4") MV.wait(300, function(){ tool.law("mul"); MV.wait(1100, function(){ tool.law("add"); MV.wait(700, fin); }); });
        else fin();
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: one-sided limits and piecewise functions (three stations) ----------
var P3 = {
  abs1:{ st:"s1", a:2, chip:"{|x - 2|}/{x - 2}", eq:"f(x) = {|x - 2|}/{x - 2}", view:[-0.6, 4.6, -2.4, 2.4], ys:1,
    pieces:function(){ return [{ f:function(){ return -1; }, domain:[-50, 2] }, { f:function(){ return 1; }, domain:[2, 50] }]; },
    open:function(){ return [[2, -1], [2, 1]]; }, dots:function(){ return []; }, fx:function(x){ return x < 2 ? -1 : 1; },
    lL:function(){ return -1; }, lR:function(){ return 1; }, fa:function(){ return null; },
    desc:"Two horizontal rays: y = −1 for x < 2 and y = 1 for x > 2, each ending at an open circle at x = 2.",
    say:function(){ return md("Left of 2 the graph is the ray `y = -1`; right of 2 it’s the ray `y = 1`. The one-sided limits disagree, so ") + lim("x → 2") + " " + m("f(x)") + " doesn’t exist."; },
    alg:"<p>" + md("For `x > 2`, `|x - 2| = x - 2`, so the quotient is `{x - 2}/{x - 2} = 1`.") + "</p><p>" + md("For `x < 2`, `|x - 2| = -(x - 2)`, so the quotient is `{-(x - 2)}/{x - 2} = -1`.") + "</p>" },
  abs2:{ st:"s1", a:2, chip:"{x^2 - 4}/{|x - 2|}", eq:"f(x) = {x^2 - 4}/{|x - 2|}", view:[-1.2, 5.2, -7.5, 7.5], ys:2,
    pieces:function(){ return [{ f:function(x){ return -(x + 2); }, domain:[-50, 2] }, { f:function(x){ return x + 2; }, domain:[2, 50] }]; },
    open:function(){ return [[2, -4], [2, 4]]; }, dots:function(){ return []; }, fx:function(x){ return x < 2 ? -(x + 2) : x + 2; },
    lL:function(){ return -4; }, lR:function(){ return 4; }, fa:function(){ return null; },
    desc:"Two rays: y = −(x + 2) for x < 2, falling to an open circle at (2, −4), and y = x + 2 for x > 2, starting at an open circle at (2, 4).",
    say:function(){ return md("Left of 2, `f(x) = -(x + 2)`, heading to −4; right of 2, `f(x) = x + 2`, heading to 4. The sides disagree: no limit."); },
    alg:"<p>" + md("For `x > 2`: `{(x - 2)(x + 2)}/{x - 2} = x + 2`, which approaches 4.") + "</p><p>" + md("For `x < 2`: `{(x - 2)(x + 2)}/{-(x - 2)} = -(x + 2)`, which approaches −4.") + "</p>" },
  pw:{ st:"s2", a:1, view:[-2.3, 4.3, -6, 12], ys:2,
    pieces:function(k){ return [{ f:function(x){ return x * x + k; }, domain:[-50, 1] }, { f:function(x){ return 3 * x - k; }, domain:[1, 50] }]; },
    open:function(k){ return close(1 + k, 3 - k) ? [] : [[1, 1 + k]]; }, dots:function(k){ return [[1, 3 - k]]; }, fx:function(x, k){ return x < 1 ? x * x + k : 3 * x - k; },
    lL:function(k){ return 1 + k; }, lR:function(k){ return 3 - k; }, fa:function(k){ return 3 - k; },
    desc:"Left piece y = x² + k for x < 1, ending at an open circle; right piece y = 3x − k for x ≥ 1, starting at a filled dot.",
    say:function(k){ return close(k, 1) ? md("With `k = 1` both sides head to 2: the limit exists and equals 2.") : md("The left side heads to `1 + k = " + nsrc(1 + k) + "` and the right side to `3 - k = " + nsrc(3 - k) + "`. They disagree, so there’s no limit yet. Move `k` until they meet."); },
    alg:"<p>" + md("Left: `1^2 + k = 1 + k`. Right: `3(1) - k = 3 - k`.") + "</p><p>" + md("They agree when `1 + k = 3 - k`, so `k = 1`, and both sides head to 2.") + "</p>" },
  sqrt:{ st:"s3", a:3, chip:"√{x - 3}", eq:"f(x) = √{x - 3}", view:[-0.6, 9.6, -1, 3.6], ys:1, noLeft:true,
    pieces:function(){ return [{ f:function(x){ return x < 3 ? NaN : Math.sqrt(x - 3); }, domain:[3, 50] }]; },
    open:function(){ return []; }, dots:function(){ return [[3, 0]]; }, fx:function(x){ return Math.sqrt(x - 3); },
    lL:function(){ return null; }, lR:function(){ return 0; }, fa:function(){ return 0; },
    desc:"The curve y = √(x − 3), starting at the filled dot (3, 0) and rising to the right. Nothing is drawn left of x = 3.",
    say:function(){ return md("Only `x ≥ 3` is in the domain, so there’s nothing to approach from the left. From the right, `√{x - 3}` heads to 0."); },
    alg:"<p>" + md("`√{x - 3}` needs `x - 3 ≥ 0`, so `x ≥ 3`. No `x` just left of 3 is in the domain.") + "</p><p>" + md("From the right, `x - 3` shrinks toward 0 through positive values, so `√{x - 3}` approaches 0.") + "</p>" },
  recip:{ st:"s3", a:3, chip:"{1}/{x - 3}", eq:"f(x) = {1}/{x - 3}", view:[-1.2, 7.2, -8, 8], ys:2, va:3,
    pieces:function(){ return [{ f:function(x){ return 1 / (x - 3); } }]; },
    open:function(){ return []; }, dots:function(){ return []; }, fx:function(x){ return 1 / (x - 3); },
    lL:function(){ return -Infinity; }, lR:function(){ return Infinity; }, fa:function(){ return null; },
    desc:"The curve y = 1/(x − 3) with a vertical asymptote x = 3: it falls without bound just left of 3 and rises without bound just right of 3.",
    say:function(){ return md("From the left the values decrease without bound; from the right they grow without bound. There’s a vertical asymptote `x = 3`, so the limit doesn’t exist."); },
    alg:"<p>" + md("Left of 3, `x - 3` is a tiny negative number, so `{1}/{x - 3}` is a large negative number: it decreases without bound.") + "</p><p>" + md("Right of 3, `x - 3` is a tiny positive number, so `{1}/{x - 3}` is a large positive number: it grows without bound.") + "</p>" }
};
var STN = { s1:{ h:"Station 1: absolute values", fns:["abs1", "abs2"] }, s2:{ h:"Station 2: tune a constant", fns:["pw"] }, s3:{ h:"Station 3: domain edges and asymptotes", fns:["sqrt", "recip"] } };
function limWords(L){ return L === Infinity ? "grows without bound" : L === -Infinity ? "decreases without bound" : ntx(L); }
function part3(host, api){
  var S = api.S;
  S.st = STN[S.st] ? S.st : "s1"; S.f1 = S.f1 === "abs2" ? "abs2" : "abs1"; S.f3 = S.f3 === "recip" ? "recip" : "sqrt";
  S.k = typeof S.k === "number" ? Math.max(-4, Math.min(4, S.k)) : -2;
  var A = { L:null, R:null }, anim = { L:null, R:null };
  host.innerHTML = '<div class="pl-st"></div><h3 class="pl-h"></h3><div class="sym pl-p3"><div>' +
    '<div class="chips pl-fns" role="group" aria-label="Function"></div>' +
    '<label class="slider pl-sl pl-ksl"><span class="slider-top"><span>' + m("k") + ' <span class="tiny muted">(from −4 to 4)</span></span><output id="pl-kout"></output></span>' +
      '<input type="range" id="pl-k" min="-4" max="4" step="0.5" style="accent-color:var(--ink)" aria-label="k, from −4 to 4"></label>' +
    '<p class="eq-cap pl-p3cap" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot" id="pl-p3plot" role="img" aria-label="Graph of the station’s function"></canvas></div>' +
    '<div class="pl-probe" role="group" aria-label="Probes"><button type="button" class="btn primary sm" data-pr="L" data-k="plpl">From the left</button><button type="button" class="btn primary sm" data-pr="R" data-k="plpr">From the right</button><button type="button" class="btn ghost sm" data-pr="clear" data-k="plpc">Clear probes</button></div>' +
    '<p class="pl-pline" aria-live="polite"></p></div>' +
    '<div><dl class="read pl-p3read" aria-live="polite"></dl><p class="pl-say" aria-live="polite"></p><details class="alg"><summary>Check it with algebra</summary><div class="pl-alg"></div></details></div></div>';
  var seg = MV.seg($(".pl-st", host), { label:"Station:", value:S.st, options:[{ id:"s1", t:"1" }, { id:"s2", t:"2" }, { id:"s3", t:"3" }],
    onChange:function(v){ S.st = v; stopAll(); api.save(); paint(); } });
  var plot = new MV.Plot($("#pl-p3plot", host), { xmin:-1, xmax:5, ymin:-3, ymax:3 });
  function fnId(){ return S.st === "s1" ? S.f1 : S.st === "s2" ? "pw" : S.f3; }
  function stopAll(){ ["L", "R"].forEach(function(s){ if (anim[s]) { anim[s](); anim[s] = null; } A[s] = null; }); }
  function draw(){
    var F = P3[fnId()], k = S.k, v = { xmin:F.view[0], xmax:F.view[1], ymin:F.view[2], ymax:F.view[3] };
    var sc = { view:v, xTicks:{ step:1 }, yTicks:{ step:F.ys }, curves:F.pieces(k).map(function(p){ return { f:p.f, domain:p.domain, color:css("--pen"), width:3 }; }), asymptotes:[], points:[], segments:[] };
    if (F.va != null) sc.asymptotes.push({ x:F.va });
    var desc = F.desc, labs = [];
    if (F === P3.pw) desc += " With k = " + ntx(k) + ": the open circle is at (1, " + ntx(1 + k) + ") and the filled dot at (1, " + ntx(3 - k) + ").";
    ["L", "R"].forEach(function(s){
      var d = A[s]; if (d == null) return;
      var x = F.a + (s === "L" ? -d : d), y = F.fx(x, k), word = s === "L" ? "left" : "right";
      if (!isFinite(y)) return;
      if (y > v.ymax || y < v.ymin) {
        var up = y > v.ymax, yE = up ? v.ymax : v.ymin, yS = yE + (up ? -1 : 1) * (v.ymax - v.ymin) * 0.12;
        sc.segments.push({ x1:x, y1:yS, x2:x, y2:yE, color:css("--ink"), width:2.4, arrow:true });
        labs.push({ x:x, y:yS + (up ? -1 : 1) * (v.ymax - v.ymin) * 0.06, s:s, t:"f(" + ntx(x, 3) + ") = " + ntx(y, 0) });
      } else {
        sc.segments.push({ x1:x, y1:y, x2:0, y2:y, color:css("--ink-2"), width:1.6, dash:[5, 5] });
        sc.points.push({ x:x, y:y, color:css("--ink"), r:4.5 });
        labs.push({ x:x, y:y, s:s, t:ntx(y, 3) });
      }
      desc += " The " + word + " probe is at x = " + ntx(x, 3) + ", where f(x) = " + ntx(y, 3) + ".";
    });
    F.open(k).forEach(function(p){ sc.points.push({ x:p[0], y:p[1], open:true, color:css("--pen"), r:5.5 }); });
    F.dots(k).forEach(function(p){ sc.points.push({ x:p[0], y:p[1], color:css("--pen"), r:5.5 }); });
    sc.describe = desc;
    sc.after = function(ctx, pl){ labs.forEach(function(l){ cLabel(ctx, l.t, pl.X(l.x) + (l.s === "L" ? -12 : 12), pl.Y(l.y) + (l.s === "L" ? -16 : 16), { align:l.s === "L" ? "right" : "left", font:"600 13px " }); }); };
    plot.draw(sc);
  }
  plot.render = draw;
  function probe(s){
    var F = P3[fnId()]; if (s === "L" && F.noLeft) return;
    if (anim[s]) anim[s]();
    var from = 1, to = 0.01;
    anim[s] = MV.tween({ dur:1300, step:function(t){ A[s] = from * Math.pow(to / from, t); draw(); }, done:function(){ anim[s] = null; A[s] = to; draw(); paintLine(); } });
    paintLine();
  }
  function paintLine(){
    var F = P3[fnId()], k = S.k, out = [];
    ["L", "R"].forEach(function(s){
      var word = s === "L" ? "left" : "right";
      if (s === "L" && F.noLeft) { out.push("From the left: not in the domain"); return; }
      if (A[s] == null || anim[s]) return;
      var x = F.a + (s === "L" ? -A[s] : A[s]); out.push("From the " + word + ": " + m("f(" + nsrc(r9(x)) + ") = " + nsrc(r9(Math.round(F.fx(x, k) * 1000) / 1000))));
    });
    $(".pl-pline", host).innerHTML = out.length ? out.join(' <span aria-hidden="true">·</span> ') : '<span class="muted">Send a probe toward ' + m("x = " + F.a) + " from each side.</span>";
  }
  function paint(){
    var id = fnId(), F = P3[id], k = S.k, a = F.a, st = STN[S.st];
    seg.set(S.st);
    $(".pl-h", host).textContent = st.h;
    var fns = $(".pl-fns", host); fns.hidden = st.fns.length < 2;
    MV.keepFocus(fns, function(){ fns.innerHTML = st.fns.map(function(f){ return '<button type="button" class="fchip" data-fn="' + f + '" data-k="plfn' + f + '" aria-pressed="' + (f === id) + '">' + m(P3[f].chip) + "</button>"; }).join(""); });
    $(".pl-ksl", host).hidden = id !== "pw"; $("#pl-k").value = k; $("#pl-kout").textContent = ntx(k, 1);
    $(".pl-p3cap", host).innerHTML = id === "pw" ? m("f(x) =") + " " + pw([["x^2 " + (k < 0 ? "- " + nsrc(-k) : "+ " + nsrc(k)), "x < 1"], ["3x " + (k < 0 ? "+ " + nsrc(-k) : "- " + nsrc(k)), "x ≥ 1"]]) : m(F.eq);
    var bl = $('[data-pr="L"]', host); bl.disabled = !!F.noLeft; bl.textContent = F.noLeft ? "From the left: not in the domain" : "From the left";
    var lL = F.lL(k), lR = F.lR(k), ex = lL != null && isFinite(lL) && isFinite(lR) && close(lL, lR), fa = F.fa(k);
    var limTxt = F.noLeft ? "Only the right-hand limit exists: nothing left of 3 is in the domain." : ex ? "<strong>" + ntx(lL) + "</strong>" :
      "<strong>does not exist</strong>" + (isFinite(lL) ? " (the one-sided limits disagree)" : " (the values are unbounded)");
    $(".pl-p3read", host).innerHTML = MV.readoutHTML([
      ["Left-hand limit " + lim("x → " + a + "^{-}") + " " + m("f(x)"), lL == null ? '<span class="pl-grey">not in the domain</span>' : id === "pw" ? m("1 + k = " + nsrc(lL)) : limWords(lL)],
      ["Right-hand limit " + lim("x → " + a + "^{+}") + " " + m("f(x)"), id === "pw" ? m("3 - k = " + nsrc(lR)) : limWords(lR)],
      ["Limit " + lim("x → " + a) + " " + m("f(x)"), limTxt],
      [m("f(" + a + ")"), fa == null ? "undefined" : ntx(fa)]
    ]);
    $(".pl-say", host).innerHTML = F.say(k);
    $(".pl-alg", host).innerHTML = F.alg;
    paintLine(); draw();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.fn) { if (S.st === "s1") S.f1 = b.dataset.fn; else S.f3 = b.dataset.fn; stopAll(); api.save(); paint(); return; }
    if (b.dataset.pr === "clear") { stopAll(); paint(); return; }
    if (b.dataset.pr) probe(b.dataset.pr);
  });
  $("#pl-k", host).addEventListener("input", function(e){ S.k = Math.round(+e.target.value * 2) / 2; api.save(); paint(); });
  paint();
  return {};
}

// ---------- Practice 2: evaluate the limit (@component V8 fracBox — exact answer "□/□": top and bottom boxes, blank bottom = 1;
// equivalent forms accepted, with a "lowest terms" note from MV.mcv.exact.judge) ----------
function evalAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { top:"", bot:"", tries:0, hint:0, solved:false, first:null, note:"" }); }
  function box(it){
    var x = ist(it.id), dis = x.solved ? " disabled" : "";
    return '<div class="pl-v8" role="group" aria-label="Your answer as a fraction"><span class="pl-v8l">Limit ' + m("=") + '</span><span class="pl-v8f">' +
      '<input class="numin" data-f="top" data-k="' + it.id + 'top" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="Top (numerator)" value="' + MV.esc(x.top) + '"' + dis + '>' +
      '<span class="pl-v8bar" aria-hidden="true"></span>' +
      '<input class="numin" data-f="bot" data-k="' + it.id + 'bot" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="Bottom (denominator); leave it empty for a whole number" value="' + MV.esc(x.bot) + '"' + dis + "></span></div>";
  }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .pl-v8c', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + fracTxt(ansV(it)) + ".</strong> " + (it.why || "") + (x.note ? " " + x.note : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", (msgs[it.id].bad ? "<strong>✗ Not quite.</strong> " : "") + msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  function ansQ(it){ return Q.raw(MV.ans(it)); }
  function ansV(it){ var q = ansQ(it); return q.n / q.d; }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it, i){
    return '<div class="q pl-eq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">Find ' + it.ask + ".</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>" +
      box(it) + '<div class="pl-v8c"></div></div>';
  }).join("");
  a.items.forEach(paintCtl);
  function judge(it){
    var x = ist(it.id), ts = String(x.top || "").trim(), bs = String(x.bot || "").trim();
    if (!ts) return { err:"Fill in the top box first." };
    var t = numIn(ts), b = bs ? numIn(bs) : { v:1 };
    if (t.word || b.word) return { ok:false, msg:"This limit exists. Simplify, then substitute." };
    if (t.err || b.err) return { err:"Type a whole number or a fraction such as 3/2 in each box." };
    if (!b.v) return { err:"The bottom can’t be 0." };
    var v = t.v / b.v, av = ansV(it);
    if (close(v, av, 1e-12)) {
      var qt = Q.raw(ts), qb = bs ? Q.raw(bs) : { n:1, d:1 }, note = "";
      if (qt && qb) {
        var aq = ansQ(it), j = EXACT.judge({ num:[{ c:qt, r:1, k:1 }], den:[{ c:qb, r:1, k:1 }] }, { num:SX.of([[aq.n]]), den:SX.of([[aq.d]]) });
        if (j.equal && !j.simplified && j.msg) note = '<span class="muted">' + md(j.msg) + "</span>";
      }
      return { ok:true, note:note };
    }
    var w = (it.wrong || []).filter(function(z){ var q = Q.raw(z.v); return q && close(v, q.n / q.d, 1e-12); })[0];
    return { ok:false, msg:w ? md(w.fb) : "Substitute to see the 0/0, simplify, then substitute into the simpler expression." };
  }
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.f) return;
    var q = t.closest("[data-q]"); ist(q.dataset.q)[t.dataset.f] = t.value; api.save();
  });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.f) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.note = r.note || ""; msgs[it.id] = null; $$("input", q).forEach(function(inp){ inp.disabled = true; }); }
    else { x.tries++; msgs[it.id] = { bad:true, html:r.msg + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- performance task: design a fillable hole ----------
function polySrc(b, c){                          // "x^2 + 3x - 4"
  var s = "x^2";
  if (b) s += (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x";
  if (c) s += (c < 0 ? " - " : " + ") + Math.abs(c);
  return s;
}
function linSrc(k){ return k === 0 ? "x" : "x " + (k < 0 ? "+ " + -k : "- " + k); }   // x − k
var task = (function(){
  var api, plot;
  function g(k){ var s = api ? api.S : {}, t = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -10 && v <= 10 ? v : null; }
  function read(){ var A = g("a"), B = g("b"), C = g("c"); return { a:A, b:B, c:C, valid:A !== null && B !== null && C !== null }; }
  function info(d){ var z = d.a * d.a + d.a * d.b + d.c, r = -(d.a + d.b); return { z:z, r:r, L:2 * d.a + d.b }; }
  function roots(d){ var D = d.b * d.b - 4 * d.c; if (D < 0) return []; if (D === 0) return [-d.b / 2]; var s = Math.sqrt(D); return [(-d.b - s) / 2, (-d.b + s) / 2]; }
  function rootTxt(x){ return Math.abs(x - Math.round(x)) < 1e-9 ? ntx(Math.round(x), 0) : "≈ " + ntx(x, 2); }
  function draw(){
    var d = read();
    if (!d.valid) { plot.draw({ view:{ xmin:-8, xmax:8, ymin:-8, ymax:8 }, describe:"Enter whole numbers from −10 to 10 for a, b and c to draw f." }); return; }
    var I = info(d), a = d.a, xs = [a], pts = [], desc;
    if (I.z === 0) {
      if (I.r !== a) xs.push(I.r);
      var xmin = Math.min(-3, Math.min.apply(null, xs) - 3), xmax = Math.max(3, Math.max.apply(null, xs) + 3);
      var ys = [xmin - I.r, xmax - I.r, I.L, 0], ymin = Math.min.apply(null, ys) - 1.5, ymax = Math.max.apply(null, ys) + 1.5;
      pts.push({ x:a, y:I.L, open:true, color:css("--pen"), r:6 });
      if (I.r !== a) pts.push({ x:I.r, y:0, color:css("--ink"), r:4.5 });
      desc = "The line y = " + MV.plain(m(linSrc(I.r))) + " with a hole (open circle) at (" + ntx(a) + ", " + ntx(I.L) + ")" + (I.r !== a ? ", crossing the x-axis at x = " + ntx(I.r) + "." : "; the hole sits on the x-axis, so the graph doesn’t cross it.");
      plot.draw({ view:{ xmin:xmin, xmax:xmax, ymin:ymin, ymax:ymax }, curves:[{ f:function(x){ return x - I.r; }, color:css("--pen"), width:3 }], points:pts, describe:desc,
        after:function(ctx, pl){ ring(ctx, pl.X(a), pl.Y(I.L), 11); } });
      return;
    }
    var rt = roots(d); rt.forEach(function(x){ xs.push(x); });
    var x0 = Math.min(-3, Math.min.apply(null, xs) - 3), x1 = Math.max(3, Math.max.apply(null, xs) + 3);
    rt.forEach(function(x){ pts.push({ x:x, y:0, color:css("--ink"), r:4.5 }); });
    desc = "f(x) = (" + MV.plain(m(polySrc(d.b, d.c))) + ")/(" + MV.plain(m(linSrc(a))) + "): substitution gives " + I.z + "/0, so there’s no hole: a vertical asymptote x = " + ntx(a) + "." + (rt.length ? " The graph crosses the x-axis at " + rt.map(rootTxt).join(" and ") + "." : "");
    plot.draw({ view:{ xmin:x0, xmax:x1, ymin:-15, ymax:15 }, curves:[{ f:function(x){ return (x * x + d.b * x + d.c) / (x - a); }, color:css("--pen"), width:3 }], asymptotes:[{ x:a }], points:pts, describe:desc });
  }
  function readout(){
    var d = read(), el = $("#fh-read"), cap = $("#fh-cap"); if (!el) return;
    if (!d.valid) { cap.innerHTML = m("f(x) = {x^2 + bx + c}/{x - a}"); el.innerHTML = '<div><dd class="muted">Enter whole numbers from −10 to 10 for ' + m("a") + ", " + m("b") + " and " + m("c") + ".</dd></div>"; return; }
    var I = info(d), a = d.a, rt = I.z === 0 ? (I.r !== a ? [I.r] : []) : roots(d);
    cap.innerHTML = m("f(x) = {" + polySrc(d.b, d.c) + "}/{" + linSrc(a) + "}");
    el.innerHTML = MV.readoutHTML([
      ["Direct substitution at " + m("x = " + nsrc(a)), I.z === 0 ? '<span class="pl-badge">0/0: indeterminate</span>' : m("{" + nsrc(I.z) + "}/{0}") + ' <span class="pl-badge">nonzero/0: no hole, a vertical asymptote</span>'],
      ["After cancelling (" + m("x ≠ " + nsrc(a)) + ")", I.z === 0 ? m("f(x) = " + linSrc(I.r)) : "nothing cancels"],
      ["Limit " + lim("x → " + nsrc(a)) + " " + m("f(x)"), I.z === 0 ? "<strong>" + ntx(I.L) + "</strong>" : "<strong>does not exist</strong>"],
      ["Hole", I.z === 0 ? m("(" + nsrc(a) + ", " + nsrc(I.L) + ")") : "none"],
      ["Crosses the " + m("x") + "-axis at", rt.length ? rt.map(function(x){ var t = rootTxt(x); return t.charAt(0) === "≈" ? m("x") + " " + t : m("x = " + t.replace(MINUS, "-")); }).join(" and ") : "nowhere"]
    ]);
  }
  function after4(){
    var ts = MV.taskState(), fbEl = $("#task-fb"), T = MV.C.task;
    if (!fbEl || !T || !T.after4 || ts.found.length < 4 || !$(".fb.good", fbEl) || $(".pl-after4", fbEl)) return;
    $(".fb.good", fbEl).insertAdjacentHTML("beforeend", '<p class="pl-after4">' + md(T.after4) + "</p>");
  }
  return {
    render:function(inp, pv, ap){
      api = ap; if (ap.S.a == null) { ap.S.a = "1"; ap.S.b = "0"; ap.S.c = "0"; }
      inp.innerHTML = '<div class="inrow">' + ["a", "b", "c"].map(function(k){ return '<label for="fh-' + k + '"><span>' + m(k) + ' <span class="tiny muted">(−10 to 10)</span></span><input id="fh-' + k + '" data-fh="' + k + '" type="number" min="-10" max="10" step="1" autocomplete="off" value="' + MV.esc(ap.S[k]) + '"></label>'; }).join("") + "</div>";
      pv.innerHTML = '<p class="pl-tcap" id="fh-cap" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot" id="fh-plot" role="img" aria-label="Your function f"></canvas></div><dl class="read" id="fh-read" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#fh-plot"), { xmin:-8, xmax:8, ymin:-8, ymax:8 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.fh; if (!k) return; ap.S[k] = e.target.value; ap.save(); draw(); readout(); ap.update(); });
      document.addEventListener("click", function(e){ if (e.target.closest && e.target.closest("#task-check")) setTimeout(after4, 0); });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers from −10 to 10 for a, b and c."; },
    checks:function(d){ if (!d.valid) return [false, false, false, false]; var I = info(d); return [I.z === 0, I.z === 0 && I.L === 5, I.r < 0 && I.r !== d.a, d.a > 0]; },
    key:function(d){ return d.a + "," + d.b + "," + d.c; },
    label:function(k){ return "(" + k.split(",").map(function(v){ return ntx(+v, 0); }).join(", ") + ")"; },
    text:function(k){ var p = k.split(","); return "a = " + ntx(+p[0], 0) + ", b = " + ntx(+p[1], 0) + ", c = " + ntx(+p[2], 0); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ evaluate:evalAct },
  task:task
});
})();
