// MCV4U 22 Vertical, Horizontal and Oblique Asymptotes: hero storyboard, Asymptote zoom (Explore: Near with the V6 approach
// table, Far with a logarithmic window slider, Divide step-through, Build mode for TC2–TC3), Which side? stations (Part 3:
// gap meter, sign tables), Limits at infinity and design (Practice 2), "Asymptote architect" (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function md(h){ return MV.md(h); }
function lim(sub){ return MV.mcv.lim(sub); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function r1(v){ return r9(Math.round(v * 10) / 10); }
function nsrc(v){ return String(r9(v)); }                         // number as m() source (a hyphen becomes a true minus)
function ntx(v, dp){ return num(v, dp == null ? 4 : dp); }        // number as text (true minus)
function close(a, b, t){ return Math.abs(a - b) <= (t || 1e-9); }
function sig(v, n){ if (!v) return "0"; var dp = Math.max(0, Math.min(12, (n || 2) - 1 - Math.floor(Math.log10(Math.abs(v))))); return num(v, dp); }
function gapNum(v){ return Math.abs(v) >= 0.001 ? num(v, 3) : sig(v, 2); }
function clampI(v, lo, hi, d){ v = typeof v === "number" && isFinite(v) ? Math.round(v) : d; return Math.max(lo, Math.min(hi, v)); }
function fontM(){ return css("--font-math") || "serif"; }
function fontUI(){ return css("--font-ui") || "sans-serif"; }

// @component exactDec (copied from MCV4U 04) — exact rationals (BigInt) printed as exact decimals (−9 003, not −9002.99…);
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

// ---------- canvas helpers (copied from MCV4U 04): maths text with italic letters; y ticks at the left edge ----------
function rich(ctx, s, x, y, o){
  o = o || {};
  var size = o.size || 15, fam = fontM(), parts = String(s).split(/([A-Za-z]+)/), w = 0, ws = [];
  function font(i, p){ return ((i % 2 === 1 && p !== "lim") ? "italic " : "") + (o.weight || 500) + " " + size + "px " + fam; }
  parts.forEach(function(p, i){ ctx.font = font(i, p); var ww = p ? ctx.measureText(p).width : 0; ws.push(ww); w += ww; });
  if (o.measure) return w;
  var x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  if (o.bg) { ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(x0 - 4, y - size * 0.72, w + 8, size * 1.44); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
  parts.forEach(function(p, i){ if (!p) return; ctx.font = font(i, p); ctx.fillText(p, x0, y); x0 += ws[i]; });
  return w;
}
function niceDp(s){ return Math.max(0, Math.ceil(-Math.log10(s) - 1e-9)); }
// y tick labels drawn at the left edge (the plot's own labels clip when the y-axis is off-screen)
function edgeTicks(v, narrow){
  var s = MV.niceStep((v.ymax - v.ymin) / (narrow ? 5 : 7)), dp = niceDp(s);
  return { step:s, after:function(ctx, pl){
    ctx.save(); ctx.font = "12px " + fontUI(); ctx.textAlign = "left"; ctx.textBaseline = "middle";
    for (var yy = Math.ceil(v.ymin / s - 1e-9) * s; yy <= v.ymax + 1e-9; yy += s) {
      var Y = pl.Y(yy), t = num(yy, dp); if (Y < 10 || Y > pl.H - 24 || Math.abs(yy) < s * 1e-6) continue;
      var w = ctx.measureText(t).width; ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(3, Y - 8, w + 6, 16); ctx.globalAlpha = 1;
      ctx.fillStyle = css("--ink-2"); ctx.fillText(t, 6, Y);
    }
    ctx.restore();
  } };
}
function xTicksFor(v, narrow){ var s = MV.niceStep((v.xmax - v.xmin) / (narrow ? 4 : 7)), dp = niceDp(s); return { step:s, fmt:function(t){ return num(t, dp); } }; }

// @component V6 approachTable (copied from MCV4U 04, trimmed) — x → a from the left and from the right (a ∓ 0.1, 0.01, 0.001),
// values computed exactly in code (exactDec XQ), "undefined" at x = a with a note, side by side (stacked on phones).
//   F = { q(X, x) -> XQ | null (null = undefined), at:"(0/0)" }    V6.val(F, x) -> {s, v, undef}    V6.html(F, a, o)
//   o = { name:"f", note (html under the tables) }
var V6 = (function(){
  var STEPS = [0.1, 0.01, 0.001];
  function val(F, x){ var q = F.q(XQ.of(x), x); if (!q) return { s:"undefined", undef:true }; return { s:XQ.decS(q, 6, 4), v:XQ.toNum(q) }; }
  function side(F, a, dir, o){
    var nm = o.name || "f", word = dir < 0 ? "left" : "right";
    var rows = STEPS.map(function(d){
      var x = r9(a + dir * d), vv = val(F, x);
      return "<tr><td>" + ntx(x, 6) + "</td><td>" + (vv.undef ? '<span class="muted">undefined</span>' : vv.s) + "</td></tr>";
    }).join("");
    return '<div class="az-v6s"><table class="vt az-v6t"><caption class="vh">Values of ' + nm + "(x) as x approaches " + ntx(a) + " from the " + word + "</caption><thead>" +
      '<tr><th scope="colgroup" colspan="2" class="az-v6h">' + m("x → " + nsrc(a) + (dir < 0 ? "^{-}" : "^{+}")) + " from the " + word + "</th></tr>" +
      '<tr><th scope="col">' + m("x") + '</th><th scope="col">' + m(nm + "(x)") + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>";
  }
  function html(F, a, o){
    o = o || {};
    var nm = o.name || "f", va = val(F, a);
    return '<div class="az-v6"><div class="az-v6g">' + side(F, a, -1, o) + side(F, a, 1, o) + "</div>" +
      '<p class="az-v6at">At ' + m("x = " + nsrc(a)) + ": " + m(nm + "(" + nsrc(a) + ")") + (va.undef ? " is <strong>undefined</strong>" + (F.at ? " " + F.at : "") : " = " + va.s) + "</p>" +
      (o.note ? '<p class="tiny muted az-v6n">' + o.note + "</p>" : "") + "</div>";
  }
  return { val:val, html:html };
})();

// ---------- polynomials: integer coefficient arrays, lowest power first ----------
function pTrim(p){ p = p.slice(); while (p.length > 1 && Math.abs(p[p.length - 1]) < 1e-12) p.pop(); return p.length ? p : [0]; }
function pEval(p, x){ var v = 0; for (var i = p.length - 1; i >= 0; i--) v = v * x + p[i]; return v; }
function pEvalX(p, X){ var v = XQ.of(0); for (var i = p.length - 1; i >= 0; i--) v = XQ.add(XQ.mul(v, X), XQ.of(p[i])); return v; }
function pDivLin(p, r){ var n = p.length - 1, q = [], c = 0; for (var k = n; k >= 1; k--) { c = p[k] + r * c; q[k - 1] = c; } return q.length ? q : [0]; }
function pSub(a, b){ var n = Math.max(a.length, b.length), o = []; for (var i = 0; i < n; i++) o.push((a[i] || 0) - (b[i] || 0)); return pTrim(o); }
function pScale(p, k){ return p.map(function(c){ return c * k; }); }
function pDiv(N, D){
  N = pTrim(N).slice(); D = pTrim(D);
  var dn = N.length - 1, dd = D.length - 1, q = [], k, j;
  if (dn < dd) return { q:[0], r:N };
  for (k = 0; k <= dn - dd; k++) q.push(0);
  for (k = dn; k >= dd; k--) { var c = N[k] / D[dd]; q[k - dd] = c; for (j = 0; j <= dd; j++) N[k - dd + j] -= c * D[j]; }
  return { q:pTrim(q), r:dd ? pTrim(N.slice(0, dd)) : [0] };
}
// m() source of a polynomial, highest power first: pSrc([2, 5, 1]) -> "x^2 + 5x + 2"
function pSrc(p){
  p = pTrim(p); var out = "";
  for (var k = p.length - 1; k >= 0; k--) {
    var c = r9(p[k]); if (!c && (out || k > 0)) continue;
    var a = Math.abs(c), body = k === 0 ? nsrc(a) : (a === 1 ? "" : nsrc(a)) + "x" + (k > 1 ? "^" + k : "");
    out += out ? (c < 0 ? " - " : " + ") + body : (c < 0 ? "-" : "") + body;
  }
  return out || "0";
}
function facSrc(r){ return r === 0 ? "x" : "(x " + (r < 0 ? "+ " + nsrc(-r) : "- " + nsrc(r)) + ")"; }
// real roots of a polynomial of degree ≤ 2 (null if it is the zero polynomial)
function roots(p){
  p = pTrim(p);
  if (p.length === 1) return p[0] === 0 ? null : [];
  if (p.length === 2) return [-p[0] / p[1]];
  var a = p[2], b = p[1], c = p[0], D = b * b - 4 * a * c;
  if (D < -1e-12) return [];
  if (Math.abs(D) < 1e-12) return [-b / (2 * a)];
  var s = Math.sqrt(D); return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort(function(u, v){ return u - v; });
}

// @component asymptoteModel — a rational function N/D (integer coefficients) analysed the way the module teaches it:
// cancel common factors (x − r) for integer r, then holes, vertical asymptotes (zeros of the reduced denominator), and the
// far behaviour by degree: kind "ha" (L = 0 or the ratio of leading coefficients), "oa" (y = mx + b from division, remainder
// G/d), "poly" (everything cancelled: a line or a constant with holes). f is the original function (undefined at holes).
//   ratModel(N, D) -> { N, D, n, d, kind, L | m, b, G (numerator of f − asymptote over d), vas:[x], holes:[{x, y}],
//                       targets:[x] (zeros of D), f(x), gap(x), asy(x), q(X) (exact, for V6), cross:[x] }
function ratModel(N, D){
  N = pTrim(N); D = pTrim(D);
  var n = N.slice(), d = D.slice(), r, g;
  for (r = -20; r <= 20; r++) {
    g = 0;
    while (d.length > 1 && n.length > 1 && Math.abs(pEval(d, r)) < 1e-9 && Math.abs(pEval(n, r)) < 1e-9 && g++ < 6) { n = pDivLin(n, r); d = pDivLin(d, r); }
  }
  var targets = [];
  for (r = -20; r <= 20; r++) if (Math.abs(pEval(D, r)) < 1e-9) targets.push(r);
  var F = { N:N, D:D, n:n, d:d, targets:targets };
  F.vas = targets.filter(function(x){ return Math.abs(pEval(d, x)) < 1e-9; });
  F.holes = targets.filter(function(x){ return Math.abs(pEval(d, x)) >= 1e-9; }).map(function(x){ return { x:x, y:r9(pEval(n, x) / pEval(d, x)) }; });
  var dn = n.length - 1, dd = d.length - 1;
  if (dd === 0) { F.kind = "poly"; F.poly = pTrim(n.map(function(c){ return c / d[0]; })); }
  else if (dn < dd) { F.kind = "ha"; F.L = 0; }
  else if (dn === dd) { F.kind = "ha"; F.L = r9(n[dn] / d[dd]); }
  else if (dn === dd + 1) { var qr = pDiv(n, d); F.kind = "oa"; F.m = r9(qr.q[1] || 0); F.b = r9(qr.q[0] || 0); F.G = qr.r; }
  else F.kind = "none";
  if (F.kind === "ha") F.G = pSub(n, pScale(d, F.L));
  F.f = function(x){ var dv = pEval(D, x); return Math.abs(dv) < 1e-12 ? NaN : pEval(N, x) / dv; };
  F.asy = function(x){ return F.kind === "ha" ? F.L : F.kind === "oa" ? F.m * x + F.b : NaN; };
  F.gap = function(x){ if (!F.G || isNaN(F.f(x))) return NaN; return pEval(F.G, x) / pEval(d, x); };
  F.q = function(X){ return XQ.div(pEvalX(N, X), pEvalX(D, X)); };
  F.cross = [];
  if (F.kind === "ha") { var rr = roots(F.G) || []; F.cross = rr.filter(function(x){ return isFinite(F.f(x)); }); }
  return F;
}
// R6 = 2x/√(x² + 9): not rational; different horizontal asymptotes at the two ends
function r6Model(){
  var f = function(x){ return 2 * x / Math.sqrt(x * x + 9); };
  return { kind:"r6", vas:[], holes:[], targets:[], cross:[], f:f,
    asy:function(x){ return x >= 0 ? 2 : -2; }, gap:function(x){ return f(x) - (x >= 0 ? 2 : -2); } };
}

// ---------- the functions R1–R6 and the two Build mode templates ----------
var FNS = ["R1", "R2", "R3", "R4", "R5", "R6"];
var DEF = {
  R1:{ N:[-6, 3], D:[1, 1], chip:"(3x - 6)/(x + 1)", eq:"{3x - 6}/{x + 1} = {3(x - 2)}/{x + 1}", y:[-10, 14] },
  R2:{ N:[-4, 0, 1], D:[6, -5, 1], chip:"(x^2 - 4)/(x^2 - 5x + 6)", eq:"{x^2 - 4}/{x^2 - 5x + 6} = {(x - 2)(x + 2)}/{(x - 2)(x - 3)}", y:[-10, 12] },
  R3:{ N:[0, 4], D:[4, 0, 1], chip:"4x/(x^2 + 4)", eq:"{4x}/{x^2 + 4}", y:[-2.5, 2.5], none:"The denominator `x^2 + 4` is never 0, so R3 has no vertical asymptotes and no holes." },
  R4:{ N:[-2, 1, 1], D:[-2, 1], chip:"(x^2 + x - 2)/(x - 2)", eq:"{x^2 + x - 2}/{x - 2} = {(x + 2)(x - 1)}/{x - 2}" },
  R5:{ N:[0, 3, 2], D:[1, 0, 1], chip:"(2x^2 + 3x)/(x^2 + 1)", eq:"{2x^2 + 3x}/{x^2 + 1} = {x(2x + 3)}/{x^2 + 1}", y:[-2, 4.5], none:"The denominator `x^2 + 1` is never 0, so R5 has no vertical asymptotes and no holes." },
  R6:{ chip:"2x/√{x^2 + 9}", eq:"{2x}/{√{x^2 + 9}}", y:[-3, 3], none:"`√{x^2 + 9}` is never 0, so R6 has no vertical asymptotes and no holes." }
};
var WS = [5, 10, 20, 50, 100, 200, 500, 1000];
function buildDef(S){
  if (S.fn === "BA") {
    var a = S.ba.a, b = S.ba.b, N = [3, a], D = [-b, 1], F = ratModel(N, D);
    var eq = "{" + pSrc(N) + "}/{" + pSrc(D) + "}";
    if (F.kind === "poly") eq += " = " + pSrc(F.poly) + "," + " x ≠ " + nsrc(b);
    return { N:N, D:D, eq:eq, F:F, name:"Build", none:"" };
  }
  var p = S.bb.p, q = S.bb.q, N2 = [q, p, 1], D2 = [-1, 1], F2 = ratModel(N2, D2), eq2 = "{" + pSrc(N2) + "}/{x - 1}";
  if (F2.kind === "poly") eq2 += " = " + pSrc(F2.poly) + ", x ≠ 1";
  else if (F2.kind === "oa") eq2 += " = " + pSrc([F2.b, F2.m]) + (pEval(F2.G, 0) < 0 ? " - " : " + ") + "{" + nsrc(Math.abs(pEval(F2.G, 0))) + "}/{x - 1}";
  return { N:N2, D:D2, eq:eq2, F:F2, name:"Build", none:"" };
}
var MCACHE = {};
function modelOf(S){
  if (S.fn === "BA" || S.fn === "BB") return buildDef(S);
  if (!MCACHE[S.fn]) { var d = DEF[S.fn]; MCACHE[S.fn] = Object.assign({}, d, { F:S.fn === "R6" ? r6Model() : ratModel(d.N, d.D), name:S.fn }); }
  return MCACHE[S.fn];
}
function asySrc(F){ return F.kind === "ha" ? nsrc(F.L) : pSrc([F.b, F.m]); }

// ---------- Divide mode: the step-through lines (and the long-division layout for oblique asymptotes) ----------
// terms of p divided by x^d: overSrc([-6, 3], 1) -> "3 - 6/x"
function overSrc(p, d){
  var out = "";
  for (var k = p.length - 1; k >= 0; k--) {
    var c = r9(p[k]); if (!c) continue;
    var e = d - k, a = Math.abs(c), body = e === 0 ? nsrc(a) : nsrc(a) + "/x" + (e > 1 ? "^" + e : "");
    out += out ? (c < 0 ? " - " : " + ") + body : (c < 0 ? "-" : "") + body;
  }
  return out || "0";
}
// one long-division cell: a term c·x^k with its sign (lead: no "+")
function cell(c, k, lead){
  var a = Math.abs(r9(c)), mag = k === 0 ? nsrc(a) : (a === 1 ? "" : nsrc(a)) + (k === 2 ? "x^2" : "x");
  return lead ? (c < 0 ? "-" : "") + mag : (c < 0 ? "- " : "+ ") + mag;
}
function divideSpec(M){
  var F = M.F, L = [];
  if (F.kind === "r6") return { lines:[
    md("For `x > 0`, `√{x^2} = x`. Divide the top and the bottom by `x = √{x^2}`: `{2x}/{√{x^2 + 9}} = {2}/{√{1 + 9/x^2}}`."),
    md("As `x → ∞`, `9/x^2 → 0`, so ") + lim("x → ∞") + md(" `f(x) = {2}/{√1} = 2`: the asymptote `y = 2` on the right."),
    md("For `x < 0`, `√{x^2} = |x| = -x`. Divide by `-x` instead: `{2x}/{√{x^2 + 9}} = {-2}/{√{1 + 9/x^2}}`."),
    lim("x → -∞") + md(" `f(x) = -2`: a different asymptote, `y = -2`, on the left.")], ld:null };
  if (F.kind === "poly") return { lines:[md("Cancel first: `f(x) = " + pSrc(F.poly) + "` for `x ≠ " + nsrc(F.holes.length ? F.holes[0].x : 0) + "`. That’s a line, so there’s nothing to divide: the graph is the line itself (with a hole), not an asymptote.")], ld:null };
  if (F.kind === "ha") {
    var N = F.N, D = F.D, d = D.length - 1, top = N[d] || 0;
    L.push(md("The highest power of `x` in the denominator is `x" + (d > 1 ? "^" + d : "") + "`. Divide every term by it: `f(x) = {" + overSrc(N, d) + "}/{" + overSrc(D, d) + "}`."));
    L.push(md("As `x → ±∞`, every term with `x` in its denominator → 0."));
    L.push(md("So ") + lim("x → ±∞") + md(" `f(x) = {" + nsrc(top) + "}/{" + nsrc(D[d]) + "} = " + nsrc(F.L) + "`. Horizontal asymptote `y = " + nsrc(F.L) + "`."));
    return { lines:L, ld:null };
  }
  // oblique: (Ax² + Bx + C) ÷ (x − c)
  var A = F.N[2], B = F.N[1], C = F.N[0], c = -F.D[0], q0 = r9(B + A * c), R = r9(C + c * q0), dv = pSrc([-c, 1]);
  L.push(md("Long division: `" + cell(A, 2, true) + " ÷ x = " + cell(A, 1, true) + "`. Write `" + cell(A, 1, true) + "` in the quotient."));
  L.push(md("Multiply: `" + cell(A, 1, true) + "(" + dv + ") = " + pSrc([0, -A * c, A]) + "`. Subtract: `" + pSrc([C, q0]) + "`."));
  L.push(q0 ? md("`" + cell(q0, 1, true) + " ÷ x = " + nsrc(q0) + "`. Multiply: `" + nsrc(q0) + "(" + dv + ") = " + pSrc([-q0 * c, q0]) + "`. Subtract: remainder " + ntx(R) + ".")
    : md("No `x`-term is left, so the remainder is " + ntx(R) + "."));
  L.push(md("So `" + pSrc(F.N) + " = (" + dv + ")(" + pSrc([q0, A]) + ")" + (R < 0 ? " - " : " + ") + nsrc(Math.abs(R)) + "`, and `f(x) = " + pSrc([q0, A]) + (R < 0 ? " - " : " + ") + "{" + nsrc(Math.abs(R)) + "}/{" + dv + "}`."));
  L.push(md("As `x → ±∞`, `{" + nsrc(R) + "}/{" + dv + "} → 0`, so `f(x) - (" + pSrc([q0, A]) + ") → 0`: oblique asymptote `y = " + pSrc([q0, A]) + "`."));
  var ld = { rows:[
    { at:1, cells:["", "", cell(A, 1, true), ""], cls:"az-ldq", at2:3, last:cell(q0, 0, false) },
    { at:0, cells:[dv, cell(A, 2, true), cell(B, 1, false), cell(C, 0, false)], cls:"az-ldn" },
    { at:2, cells:["", "−(" + cell(A, 2, true), cell(-A * c, 1, false) + ")", ""], cls:"az-ldp" },
    { at:2, cells:["", "", cell(q0, 1, true), cell(C, 0, false)], cls:"" },
    { at:3, cells:["", "", "−(" + cell(q0, 1, true), cell(-q0 * c, 0, false) + ")"], cls:"az-ldp" },
    { at:3, cells:["", "", "", cell(R, 0, true)], cls:"az-ldr" }] };
  return { lines:L, ld:ld };
}
function ldHTML(ld, shown){
  return '<div class="az-ld-wrap"><table class="az-ld" aria-label="Long division"><tbody>' + ld.rows.map(function(row){
    if (row.at > shown) return '<tr class="' + row.cls + ' az-ldoff">' + row.cells.map(function(){ return "<td></td>"; }).join("") + "</tr>";
    var cs = row.cells.slice(); if (row.at2 != null && shown >= row.at2) cs[3] = row.last;
    return '<tr class="' + row.cls + '">' + cs.map(function(t, i){ return "<td" + (i === 0 && row.cls === "az-ldn" ? ' class="az-ldd"' : "") + ">" + (t ? m(t) : "") + "</td>"; }).join("") + "</tr>";
  }).join("") + "</tbody></table></div>";
}

// ---------- Asymptote zoom (Explore centrepiece) ----------
//   var t = zoomTool(host, {S, save, changed}); t.apply({fn, mode, wi, px, a}), t.setMode(m, cb), t.setW(i, dur, cb), t.target(a, cb),
//   t.divStep(i), t.probeTo(x, dur, cb), t.lock(bool), t.get() -> S, t.paint()
function zoomTool(host, o){
  var S = o.S;
  S.fn = (DEF[S.fn] || S.fn === "BA" || S.fn === "BB") ? S.fn : "R1";
  S.mode = ["near", "far", "divide"].indexOf(S.mode) >= 0 ? S.mode : "far";
  S.wi = clampI(S.wi, 0, WS.length - 1, 1);
  S.ba = S.ba || {}; S.ba.a = clampI(S.ba.a, -6, 6, 1); S.ba.b = clampI(S.ba.b, -6, 6, 1);
  S.bb = S.bb || {}; S.bb.p = clampI(S.bb.p, -10, 10, 0); S.bb.q = clampI(S.bb.q, -10, 10, 0);
  S.px = typeof S.px === "number" && isFinite(S.px) ? r1(S.px) : 4;
  S.near = S.near || {}; S.lims = S.lims || {};
  var A = { view:null }, anim = null, locked = false, player = null, dstep = 0;
  var L = MV.pgLayout(host, { aria:"Graph of the chosen function with its asymptotes" });
  L.graph.parentNode.classList.add("az-ex");
  L.ctrl.innerHTML =
    '<div class="az-row"><span class="az-lab">Function:</span><div class="chips az-fns" role="group" aria-label="Function"></div></div>' +
    '<div class="az-row"><span class="az-lab">Build mode:</span><div class="chips az-bld" role="group" aria-label="Build mode functions"></div></div>' +
    '<div class="az-bsl"></div><div class="az-mode"></div>' +
    '<label class="slider az-sl az-far"><span class="slider-top"><span>Window half-width</span><output class="az-wout"></output></span>' +
      '<input type="range" class="az-w" min="0" max="' + (WS.length - 1) + '" step="1" style="accent-color:var(--ink)" aria-label="Window half-width"></label>' +
    '<div class="az-near"></div><div class="az-panel"></div>';
  var plot = new MV.Plot(L.canvas, { xmin:-10, xmax:10, ymin:-10, ymax:10 });
  function q(sel){ return $(sel, host); }
  function save(){ o.save(); if (o.changed) o.changed(); }
  function stop(){ if (anim) { var a = anim; anim = null; a(); } A.view = null; }
  function M(){ return modelOf(S); }
  function key(){ return S.fn + (S.fn === "BA" ? ":" + S.ba.a + "," + S.ba.b : S.fn === "BB" ? ":" + S.bb.p + "," + S.bb.q : ""); }
  function targetA(){ var F = M().F, t = S.near[key()]; return F.targets.indexOf(t) >= 0 ? t : (F.targets.length ? F.targets[0] : null); }

  // ---- views ----
  function farView(Md){
    var F = Md.F, w = WS[S.wi];
    if (F.kind === "oa" || (F.kind === "poly" && F.poly.length > 1)) { var c = F.kind === "oa" ? F.b : F.poly[0], h = Math.max(10, 1.2 * w); return { xmin:-w, xmax:w, ymin:c - h, ymax:c + h }; }
    var y = Md.y || (F.kind === "ha" ? [F.L - 12, F.L + 12] : F.kind === "poly" ? [F.poly[0] - 12, F.poly[0] + 12] : [-10, 10]);
    return { xmin:-w, xmax:w, ymin:y[0], ymax:y[1] };
  }
  function nearView(Md, a){
    var F = Md.F, hole = F.holes.filter(function(h){ return h.x === a; })[0];
    if (hole) {
      var dv = Math.max(Math.abs(F.f(a - 0.3) - hole.y), Math.abs(F.f(a + 0.3) - hole.y)), hh = Math.max(0.8, 1.6 * (isFinite(dv) ? dv : 1));
      return { xmin:a - 0.5, xmax:a + 0.5, ymin:hole.y - hh, ymax:hole.y + hh };
    }
    var H = 1.25 * Math.max(5, Math.abs(F.f(a - 0.1)) || 0, Math.abs(F.f(a + 0.1)) || 0);
    return { xmin:a - 1, xmax:a + 1, ymin:-H, ymax:H };
  }
  function goalView(){ var Md = M(), a = targetA(); return S.mode === "near" && a != null ? nearView(Md, a) : farView(Md); }
  function viewNow(){ return A.view || goalView(); }
  function tweenView(from, to, dur, cb){
    stop();
    var cx0 = (from.xmin + from.xmax) / 2, cy0 = (from.ymin + from.ymax) / 2, hx0 = (from.xmax - from.xmin) / 2, hy0 = (from.ymax - from.ymin) / 2;
    var cx1 = (to.xmin + to.xmax) / 2, cy1 = (to.ymin + to.ymax) / 2, hx1 = (to.xmax - to.xmin) / 2, hy1 = (to.ymax - to.ymin) / 2;
    var c = MV.tween({ dur:dur == null ? 700 : dur, step:function(t){
        var hx = hx0 * Math.pow(hx1 / hx0, t), hy = hy0 * Math.pow(hy1 / hy0, t), cx = cx0 + (cx1 - cx0) * t, cy = cy0 + (cy1 - cy0) * t;
        A.view = { xmin:cx - hx, xmax:cx + hx, ymin:cy - hy, ymax:cy + hy }; draw();
      }, done:function(){ if (anim === c) anim = null; A.view = null; draw(); if (cb) cb(); } });
    anim = c;
  }
  function clampProbe(v){
    var F = M().F, lo = v.xmin + (v.xmax - v.xmin) * 0.03, hi = v.xmax - (v.xmax - v.xmin) * 0.03, x = r1(Math.max(lo, Math.min(hi, S.px)));
    if (x < lo) x = r1(x + 0.1); if (x > hi) x = r1(x - 0.1);
    for (var k = 0; k < 4 && !isFinite(F.f(x)); k++) x = r1(x + 0.1);
    S.px = x;
  }

  // ---- drawing ----
  function draw(){
    var Md = M(), F = Md.F, v = viewNow(), W = L.canvas.getBoundingClientRect().width || 600, narrow = W < 420;
    var sc = { view:v, curves:[], asymptotes:[], segments:[], points:[], labels:[], regions:[] }, ink2 = css("--ink-2");
    var lo = -1e9, desc = "Graph of y = " + MV.plain(m(Md.eq.split(" = ")[0])) + ".";
    F.vas.slice().sort(function(a, b){ return a - b; }).forEach(function(a){ sc.curves.push({ f:F.f, domain:[lo, a - 1e-9], color:css("--pen"), width:3 }); lo = a + 1e-9; });
    sc.curves.push({ f:F.f, domain:[lo, 1e9], color:css("--pen"), width:3 });
    F.vas.forEach(function(a){ sc.asymptotes.push({ x:a }); });
    if (F.vas.length) desc += " Vertical asymptote" + (F.vas.length > 1 ? "s " : " ") + F.vas.map(function(a){ return "x = " + ntx(a); }).join(" and ") + ".";
    if (F.kind === "ha") { sc.asymptotes.push({ y:F.L }); desc += " Horizontal asymptote y = " + ntx(F.L) + "."; }
    if (F.kind === "oa") { sc.asymptotes.push({ m:F.m, b:F.b, label:"y = " + MV.plain(m(asySrc(F))) }); desc += " Oblique asymptote y = " + MV.plain(m(asySrc(F))) + "."; }
    if (F.kind === "r6") {
      sc.segments.push({ x1:0, y1:2, x2:Math.max(v.xmax, 1), y2:2, color:ink2, width:1.5, dash:[8, 6] }, { x1:Math.min(v.xmin, -1), y1:-2, x2:0, y2:-2, color:ink2, width:1.5, dash:[8, 6] });
      sc.labels.push({ x:v.xmax, y:2, text:"y = 2", align:"right", dx:-6, dy:-12, color:ink2, font:"italic 13px " + fontM(), bg:true },
        { x:v.xmin, y:-2, text:"y = " + MINUS + "2", align:"left", dx:6, dy:12, color:ink2, font:"italic 13px " + fontM(), bg:true });
      desc += " Horizontal asymptote y = 2 on the right and y = −2 on the left.";
    }
    F.holes.forEach(function(h){ sc.points.push({ x:h.x, y:h.y, open:true, color:css("--pen"), r:5.5 }); desc += " Hole at (" + ntx(h.x) + ", " + ntx(h.y) + ")."; });
    if (S.mode !== "near" && F.kind === "ha") F.cross.forEach(function(x){ if (x > v.xmin && x < v.xmax) { sc.points.push({ x:x, y:F.L, r:4.5, color:css("--ink") }); if (WS[S.wi] <= 20) sc.labels.push({ x:x, y:F.L, text:"(" + MV.frac(x, 12) + ", " + ntx(F.L) + ")", align:"right", dx:-8, dy:-14, color:css("--ink"), font:"600 13px " + fontM(), bg:true }); desc += " The graph crosses its horizontal asymptote at (" + MV.frac(x, 12) + ", " + ntx(F.L) + ")."; } });
    if (S.mode === "near" && targetA() != null) {
      var a = targetA();
      [0.1, 0.01, 0.001].forEach(function(dd){ [-1, 1].forEach(function(s){ var x = a + s * dd, y = F.f(x); if (isFinite(y) && y > v.ymin && y < v.ymax && x > v.xmin && x < v.xmax) sc.points.push({ x:x, y:y, r:3.5, color:css("--ink") }); }); });
      desc += " Zoomed in near x = " + ntx(a) + ".";
    } else desc += " Window from x = " + ntx(v.xmin, 1) + " to " + ntx(v.xmax, 1) + ".";
    // probe and the gap to the horizontal or oblique asymptote
    var px = S.px, py = F.f(px);
    if (S.mode !== "near" && isFinite(py) && px >= v.xmin && px <= v.xmax) {
      var ay = F.asy(px), cy = Math.max(v.ymin, Math.min(v.ymax, py));
      if (isFinite(ay)) {
        var dx = 6 * (v.xmax - v.xmin) / W;
        sc.regions.push({ f:function(){ return py; }, g:function(){ return ay; }, x0:px - dx, x1:px + dx, color:css("--hi-soft") });
        sc.segments.push({ x1:px, y1:Math.max(v.ymin, Math.min(v.ymax, ay)), x2:px, y2:cy, color:css("--ink"), width:1.5 });
      }
      sc.points.push({ x:px, y:cy, r:6, color:css("--ink") });
      desc += " Probe at x = " + ntx(px, 1) + ", f(x) ≈ " + sig(py, 3) + ".";
    }
    var yOff = v.xmin > 0 || v.xmax < 0;
    sc.xTicks = xTicksFor(v, narrow);
    if (yOff) { var et = edgeTicks(v, narrow); sc.yTicks = { step:et.step, fmt:function(){ return ""; } }; sc.after = et.after; }
    sc.describe = desc;
    plot.draw(sc);
  }
  plot.render = draw;
  var drag = MV.drag(plot, {
    handles:function(){
      var v = viewNow(), F = M().F, y = F.f(S.px);
      if (S.mode === "near" || !isFinite(y) || S.px < v.xmin || S.px > v.xmax) return [];
      return [{ id:"p", x:S.px, y:Math.max(v.ymin, Math.min(v.ymax, y)), label:"Probe at x = " + ntx(S.px, 1) + ". Arrow keys move it by 0.1; Shift with an arrow moves it by 10." }];
    },
    move:function(id, x, y, how){
      if (locked) return;
      var v = viewNow(), F = M().F, dir = x >= S.px ? 1 : -1;
      x = r1(Math.max(v.xmin, Math.min(v.xmax, x)));
      for (var k = 0; k < 4 && !isFinite(F.f(x)); k++) x = r1(x + 0.1 * dir);
      if (!isFinite(F.f(x)) || x === S.px) return;
      S.px = x; save(); draw(); paintRead();
    },
    snap:function(x, y){ return [r1(x), y]; },
    step:{ x:0.1, y:0.1 }, big:100, axis:"x"
  });
  void drag;

  // ---- readout ----
  function limRow(F, a){
    var hole = F.holes.filter(function(h){ return h.x === a; })[0], sL = m("x → " + nsrc(a) + "^{-}"), sR = m("x → " + nsrc(a) + "^{+}");
    if (hole) return sL + ": " + ntx(hole.y) + "; " + sR + ": " + ntx(hole.y) + ' <span class="tiny muted">(a hole at (' + ntx(a) + ", " + ntx(hole.y) + "), not an asymptote)</span>";
    var e = S.lims[key() + "|" + a] || {}, t = truth(F, a);
    if (e.L !== t.L || e.R !== t.R) return '<span class="muted">Read the table, then enter both one-sided limits under it.</span>';
    function w(s){ return s === "+" ? "+∞" : MINUS + "∞"; }
    return sL + ": <strong>" + w(t.L) + "</strong>; " + sR + ": <strong>" + w(t.R) + '</strong><br><span class="tiny muted">±∞ means the values grow (or decrease) without bound: the limit does not exist as a number.</span>';
  }
  function farRow(Md, dir){
    var F = Md.F, s = dir > 0 ? "x → ∞" : "x → -∞";
    if (F.kind === "ha") return lim(s) + " " + m("f(x) = " + nsrc(F.L)) + ": " + m("y = " + nsrc(F.L));
    if (F.kind === "oa") return m("f(x) - (" + asySrc(F) + ") → 0") + ": oblique asymptote " + m("y = " + asySrc(F));
    if (F.kind === "r6") return lim(s) + " " + m("f(x) = " + (dir > 0 ? "2" : "-2")) + ": " + m("y = " + (dir > 0 ? "2" : "-2"));
    if (F.kind === "poly") return m("f(x) = " + pSrc(F.poly)) + " for every " + m("x ≠ " + nsrc(F.holes[0] ? F.holes[0].x : 0)) + ": the graph is the line itself, not an asymptote";
    return "—";
  }
  function gapRow(F){
    var x = S.px, y = F.f(x);
    if (!isFinite(y) || F.kind === "poly" || F.kind === "none") return "—";
    var g = F.gap(x), side = Math.abs(g) < 1e-12 ? "on" : g > 0 ? "above" : "below", xs = nsrc(x), lhs, val;
    if (F.kind === "oa") lhs = "f(" + xs + ") - (" + (F.m === 1 ? xs : nsrc(F.m) + "(" + xs + ")") + (F.b ? (F.b < 0 ? " - " : " + ") + nsrc(Math.abs(F.b)) : "") + ")";
    else { var Lv = F.asy(x); lhs = "f(" + xs + ") - " + (Lv < 0 ? "(" + nsrc(Lv) + ")" : nsrc(Lv)); }
    if (F.kind !== "r6" && Number.isInteger(x)) {
      var gn = r9(pEval(F.G, x)), gd = r9(pEval(F.d, x)); if (gd < 0) { gn = -gn; gd = -gd; }
      val = (gn < 0 ? MINUS : "") + Math.abs(gn) + (gd !== 1 ? "/" + gd : "") + (gd !== 1 ? (close(g * 1000, Math.round(g * 1000)) ? " = " : " ≈ ") + gapNum(g) : "");
    } else val = (Math.abs(g) >= 0.001 && close(g * 1000, Math.round(g * 1000), 1e-6) ? "" : "≈ ") + gapNum(g);
    return m(lhs) + (val.charAt(0) === "≈" ? " " : " = ") + val + " <strong>(" + side + ")</strong>";
  }
  function crossRow(F){
    if (F.kind === "r6") return "never";
    if (F.kind !== "ha") return "—";
    if (!F.cross.length) return "never";
    return F.cross.map(function(x){ return m("x = " + MV.frac(x, 12).replace(MINUS, "-")); }).join(", ");
  }
  function paintRead(){
    var Md = M(), F = Md.F, a = targetA(), rows = [
      [m("f(x)"), m(Md.eq)],
      ["Vertical asymptotes", F.vas.length ? F.vas.map(function(x){ return m("x = " + nsrc(x)); }).join(", ") : "none"],
      ["Holes", F.holes.length ? F.holes.map(function(h){ return "(" + ntx(h.x) + ", " + ntx(h.y) + ")"; }).join(", ") : "none"],
      ["As " + m("x → ∞"), farRow(Md, 1)],
      ["As " + m("x → -∞"), farRow(Md, -1)]];
    if (S.mode === "near") rows.push(["Near " + (a != null ? m("x = " + nsrc(a)) : "a trouble spot"), a != null ? limRow(F, a) : '<span class="muted">No trouble spots here.</span>']);
    rows.push(["Gap at probe", S.mode === "near" ? '<span class="muted">Far or Divide mode</span>' : gapRow(F)]);
    rows.push(["Crosses the HA at", crossRow(F)]);
    L.read.innerHTML = MV.readoutHTML(rows);
  }
  // the true one-sided behaviour at a vertical asymptote: sign of f just left and right
  function truth(F, a){ return { L:F.f(a - 1e-6) > 0 ? "+" : "-", R:F.f(a + 1e-6) > 0 ? "+" : "-" }; }

  // ---- panel under the controls: V6 table + entry (Near), note (Far), step-through (Divide) ----
  function paintPanel(){
    var Md = M(), F = Md.F, P = q(".az-panel");
    player = null;
    if (S.mode === "near") {
      var a = targetA();
      if (a == null) { P.innerHTML = '<p class="muted az-pnote">' + md(Md.none || "No trouble spots: the denominator is never 0.") + " Try Far or Divide.</p>"; return; }
      var hole = F.holes.some(function(h){ return h.x === a; }), h = V6.html({ q:F.q, at:hole ? "(0/0)" : "(division by 0)" }, a, { note:"Computed exactly by the tool." });
      if (!hole) {
        var e = S.lims[key() + "|" + a] || {}, t = truth(F, a), good = e.L === t.L && e.R === t.R;
        h += '<div class="az-lims"><p class="az-limh">Your one-sided limits at ' + m("x = " + nsrc(a)) + ":</p>" + [["L", "^{-}"], ["R", "^{+}"]].map(function(s){
          return '<div class="az-limrow"><span class="az-limlab">' + lim("x → " + nsrc(a) + s[1]) + " " + m("f(x) =") + '</span><span class="chips" role="group" aria-label="' + (s[0] === "L" ? "Left" : "Right") + '-hand limit">' +
            [["+", "+∞"], ["-", MINUS + "∞"]].map(function(c){ var on = e[s[0]] === c[0]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-lim="' + s[0] + c[0] + '" data-k="azlim' + s[0] + (c[0] === "+" ? "p" : "m") + '">' + c[1] + "</button>"; }).join("") + "</span></div>";
        }).join("") + (good ? '<p class="az-limok">✓ Both match the table.</p>' : "") + "</div>";
      }
      MV.keepFocus(P, function(){ P.innerHTML = h; });
      return;
    }
    if (S.mode === "far") { P.innerHTML = '<p class="muted az-pnote">Widen the window with the slider. Drag the probe, or focus it and use the arrow keys (Shift moves 10), to read the gap between the curve and the asymptote.</p>'; return; }
    var spec = divideSpec(Md), n = spec.lines.length;
    P.innerHTML = '<div class="az-div"><div class="az-dpl"></div>' + (spec.ld ? '<div class="az-dld"></div>' : "") + '<ol class="az-dsteps"></ol></div>';
    var showN = function(i){
      dstep = i;
      $(".az-dsteps", P).innerHTML = spec.lines.slice(0, i).map(function(t, k){ return '<li class="' + (k === i - 1 ? "cur" : "") + '">' + t + "</li>"; }).join("");
      if (spec.ld) $(".az-dld", P).innerHTML = ldHTML(spec.ld, Math.min(3, i));
    };
    var keep = Math.min(dstep, n);
    player = MV.player($(".az-dpl", P), { count:n + 1, interval:1300, render:showN,
      label:function(i){ return i === 0 ? "Press Step to start." : "Step " + i + " of " + n; } });
    if (keep) player.go(keep);
  }

  // ---- controls ----
  var segMode = MV.seg(q(".az-mode"), { label:"Mode:", value:S.mode, options:[{ id:"near", t:"Near" }, { id:"far", t:"Far" }, { id:"divide", t:"Divide" }],
    onChange:function(v){ if (locked) { segMode.set(S.mode); return; } setMode(v); } });
  function setMode(v, cb, dur){
    var from = viewNow(); stop(); S.mode = v; save();
    var to = goalView(); paint(true);
    if (v !== "near") clampProbe(to);
    tweenView(from, to, dur, function(){ paint(); if (cb) cb(); });
  }
  function setFn(fn){
    stop(); S.fn = fn; var to = goalView(); clampProbe(to); dstep = 0; save(); paint();
  }
  function setW(i, dur, cb){
    var from = viewNow(); stop(); S.wi = i; save();
    var to = goalView(); if (S.mode !== "near") clampProbe(to); paintCtl(); paintRead();
    tweenView(from, to, dur == null ? 450 : dur, function(){ paintRead(); if (cb) cb(); });
  }
  function target(a, cb, dur){
    var from = viewNow(); stop(); S.near[key()] = a; save(); paint(true);
    tweenView(from, goalView(), dur, function(){ paint(); if (cb) cb(); });
  }
  q(".az-fns").addEventListener("click", function(e){ var b = e.target.closest("[data-fn]"); if (!b || locked) return; setFn(b.dataset.fn); });
  q(".az-bld").addEventListener("click", function(e){ var b = e.target.closest("[data-fn]"); if (!b || locked) return; setFn(b.dataset.fn); });
  q(".az-bsl").addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.bs; if (!k) return;
    var obj = S.fn === "BA" ? S.ba : S.bb;
    if (locked) { e.target.value = obj[k]; return; }
    stop(); obj[k] = +e.target.value; var to = goalView(); if (S.mode !== "near") clampProbe(to); save();
    var out = $('[data-out="' + k + '"]', host); if (out) out.textContent = ntx(obj[k]);
    e.target.setAttribute("aria-valuetext", MV.plain(ntx(obj[k])));
    paint();
  });
  q(".az-w").addEventListener("input", function(e){ if (locked) { e.target.value = S.wi; return; } setW(+e.target.value); });
  q(".az-near").addEventListener("click", function(e){ var b = e.target.closest("[data-near]"); if (!b || locked) return; target(+b.dataset.near); });
  q(".az-panel").addEventListener("click", function(e){
    var b = e.target.closest("[data-lim]"); if (!b || locked) return;
    var a = targetA(), k = key() + "|" + a, e2 = S.lims[k] || (S.lims[k] = {});
    e2[b.dataset.lim[0]] = b.dataset.lim.slice(1); save(); paintPanel(); paintRead();
  });
  function paintCtl(){
    var Md = M();
    MV.keepFocus(q(".az-fns"), function(){ q(".az-fns").innerHTML = FNS.map(function(id){ var on = S.fn === id; return '<button type="button" class="chip az-fchip' + (on ? " on" : "") + '" data-fn="' + id + '" data-k="azfn' + id + '" aria-pressed="' + on + '"><strong>' + id + "</strong> " + m(DEF[id].chip) + "</button>"; }).join(""); });
    MV.keepFocus(q(".az-bld"), function(){ q(".az-bld").innerHTML = [["BA", "(ax + 3)/(x - b)"], ["BB", "(x^2 + px + q)/(x - 1)"]].map(function(t){ var on = S.fn === t[0]; return '<button type="button" class="chip az-fchip' + (on ? " on" : "") + '" data-fn="' + t[0] + '" data-k="azfn' + t[0] + '" aria-pressed="' + on + '">' + m(t[1]) + "</button>"; }).join(""); });
    var bs = q(".az-bsl"), want = S.fn === "BA" ? "BA" : S.fn === "BB" ? "BB" : "";
    if (bs.dataset.for !== want) {
      bs.dataset.for = want;
      var defs = want === "BA" ? [["a", -6, 6, S.ba.a], ["b", -6, 6, S.ba.b]] : want === "BB" ? [["p", -10, 10, S.bb.p], ["q", -10, 10, S.bb.q]] : [];
      bs.innerHTML = defs.map(function(d){
        return '<label class="slider az-sl"><span class="slider-top"><span>' + m(d[0]) + '</span><output data-out="' + d[0] + '">' + ntx(d[3]) + "</output></span>" +
          '<input type="range" data-bs="' + d[0] + '" min="' + d[1] + '" max="' + d[2] + '" step="1" value="' + d[3] + '" style="accent-color:var(--ink)" aria-label="' + d[0] + ", from " + ntx(d[1]) + " to " + ntx(d[2]) + '" aria-valuetext="' + ntx(d[3]) + '"></label>';
      }).join("");
    } else if (want) {
      var obj = want === "BA" ? S.ba : S.bb;
      $$("[data-bs]", bs).forEach(function(inp){ inp.value = obj[inp.dataset.bs]; inp.setAttribute("aria-valuetext", ntx(obj[inp.dataset.bs])); var out = $('[data-out="' + inp.dataset.bs + '"]', bs); if (out) out.textContent = ntx(obj[inp.dataset.bs]); });
    }
    bs.hidden = !want;
    segMode.set(S.mode);
    var wl = q(".az-far"); wl.hidden = S.mode === "near";
    q(".az-w").value = S.wi; q(".az-wout").textContent = ntx(WS[S.wi]); q(".az-w").setAttribute("aria-valuetext", ntx(WS[S.wi]));
    var nr = q(".az-near"), F = Md.F, a = targetA();
    nr.hidden = S.mode !== "near" || !F.targets.length;
    MV.keepFocus(nr, function(){ nr.innerHTML = '<div class="chips" role="group" aria-label="Trouble spots">' + F.targets.map(function(t){ var on = a === t; return '<button type="button" class="btn sm ghost az-tg' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-near="' + t + '" data-k="aznear' + t + '">Zoom near ' + m("x = " + nsrc(t)) + "</button>"; }).join("") + "</div>"; });
  }
  function paint(noDraw){
    var Md = M();
    L.cap.innerHTML = '<span class="az-cap">' + (Md.name === "Build" ? "Build mode: " : "<strong>" + Md.name + "</strong>: ") + m("f(x) = " + Md.eq.split(" = ")[0]) + "</span>";
    paintCtl(); paintPanel(); paintRead();
    if (!noDraw) draw();
    if (o.changed) o.changed();
  }
  paint();
  return {
    apply:function(st){
      stop();
      ["fn", "mode", "wi", "px"].forEach(function(k){ if (st[k] != null) S[k] = st[k]; });
      if (st.a != null) S.near[key()] = st.a;
      save(); paint();
    },
    setMode:setMode, setW:setW, target:target,
    divStep:function(i){ if (player) player.go(i); },
    divCount:function(){ return divideSpec(M()).lines.length; },
    probeTo:function(x, dur, cb){
      stop(); var from = S.px, F = M().F;
      var c = MV.tween({ dur:dur, step:function(t){ var xx = r1(from + (x - from) * t); if (isFinite(F.f(xx))) S.px = xx; draw(); }, done:function(){ if (anim === c) anim = null; S.px = r1(x); save(); paint(); if (cb) cb(); } });
      anim = c;
    },
    lock:function(v){ locked = !!v; host.classList.toggle("az-locked", locked); },
    get:function(){ return S; }, model:M, key:key, truth:truth,
    paint:paint
  };
}

// ---------- hero storyboard: (x² + 3)/(x − 1) draws from the left, plunges at x = 1, returns from +∞, then zooms out ×20 ----------
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:-5, xmax:7, ymin:-10, ymax:16 });
  function F(x){ return (x * x + 3) / (x - 1); }
  var st = { xl:-5, xr:null, va:false, labL:false, labR:false, z:0, oa:false };
  function view(){ var t = st.z, hx = 6 * Math.pow(20, t), hy = 13 * Math.pow(10, t); return { xmin:1 - hx, xmax:1 + hx, ymin:3 - hy, ymax:3 + hy }; }
  function gapX(){ var v = view(); return Math.round(1 + 0.8 * (v.xmax - 1)); }
  p.render = function(){
    var v = view(), ink2 = css("--ink-2"), sc = { view:v, curves:[], asymptotes:[], labels:[] };
    if (st.xl != null) sc.curves.push({ f:F, domain:[-1e9, Math.min(st.xl, 1 - 1e-9)], color:css("--pen"), width:3.2 });
    if (st.xr != null) sc.curves.push({ f:F, domain:[1 + 1e-9, st.xr], color:css("--pen"), width:3.2 });
    if (st.va) sc.asymptotes.push({ x:1, label:st.z > 0.25 ? "" : "x = 1" });
    if (st.oa) sc.asymptotes.push({ m:1, b:1, label:"" });
    var narrow = (f.canvas.getBoundingClientRect().width || 400) < 420;
    sc.xTicks = xTicksFor(v, narrow);
    sc.after = function(ctx, pl){
      if (st.labL && st.z < 0.25) rich(ctx, "→ " + MINUS + "∞", pl.X(1) - 8, pl.H - 18, { size:15, align:"right", bg:true, color:ink2 });
      if (st.labR && st.z < 0.25) rich(ctx, "+∞", pl.X(1) + 8, 34, { size:15, bg:true, color:ink2 });
      if (st.oa) { var x0 = v.xmin + (v.xmax - v.xmin) * 0.62; rich(ctx, "y = x + 1", pl.X(x0) + 10, pl.Y(x0 + 1) + 22, { size:15, bg:true, color:ink2 }); }
    };
    sc.describe = "Graph of y = (x² + 3)/(x − 1)." + (st.va ? " Dashed vertical asymptote x = 1: the graph falls toward −∞ on the left and comes down from +∞ on the right." : "") + (st.oa ? " Zoomed out " + Math.round(Math.pow(20, st.z)) + " times: the branches run along the dashed oblique asymptote y = x + 1." : "");
    p.draw(sc);
  };
  function gapCap(){ var x = gapX(); f.cap.innerHTML = "Gap at " + m("x = " + x) + ": " + m("f(x) - (x + 1) = {4}/{" + (x - 1) + "}") + " ≈ " + gapNum(4 / (x - 1)); }
  function finish(){ st = { xl:1, xr:1e9, va:true, labL:true, labR:true, z:1, oa:true }; gapCap(); p.render(); }
  if (MV.reduceMotion) { finish(); return; }
  f.cap.innerHTML = "&nbsp;"; p.render();
  MV.wait(500, function(){
    MV.tween({ dur:1900, ease:function(t){ return t; }, step:function(t){ st.xl = -5 + (0.995 + 5) * t; p.render(); }, done:function(){
      st.xl = 1; st.va = true; st.labL = true; f.cap.innerHTML = "Near " + m("x = 1") + ", it plunges: " + m("f(x) → -∞") + "."; p.render();
      MV.wait(900, function(){
        MV.tween({ dur:1500, step:function(t){ st.xr = 1.004 + (7.5 - 1.004) * t; p.render(); }, done:function(){
          st.labR = true; f.cap.innerHTML = "On the other side it comes down from " + m("+∞") + "."; st.xr = 1e9; p.render();
          MV.wait(1100, function(){
            st.oa = true;
            MV.tween({ dur:2600, step:function(t){ st.z = t; gapCap(); p.render(); }, done:function(){ finish(); } });
          });
        } });
      });
    } });
  });
}

// ---------- Explore: Asymptote zoom, predictions and challenges ----------
var PSTART = { p1:{ fn:"R2", mode:"far", wi:1 }, p2:{ fn:"R3", mode:"far", wi:0 }, p3:{ fn:"R5", mode:"far", wi:0, px:-4 }, p4:{ fn:"R4", mode:"divide", wi:1 } };
function explore(host, api){
  var tool = zoomTool(host, { S:api.S, save:api.save, changed:api.changed });
  function chal(id){
    var S = tool.get();
    if (id === "tc1") {
      var e = S.lims["R1|-1"] || {};
      if (!e.L || !e.R) return { ok:false, msg:"Choose R1, switch to <strong>Near</strong> mode, zoom near " + m("x = -1") + ", and enter both one-sided limits under the table." };
      if (e.L === "+" && e.R === "-") return { ok:true };
      if (e.L === "+" && e.R === "+") return { ok:false, msg:md("Just right of −1, the denominator is a small <strong>positive</strong> number and the numerator is near −9: negative ÷ positive.") };
      if (e.L === "-" && e.R === "+") return { ok:false, msg:md("Left of −1, `x + 1 < 0` and `3x - 6 < 0`: negative ÷ negative = positive.") };
      return { ok:false, msg:md("Just left of −1, the denominator is a small <strong>negative</strong> number and the numerator is near −9: negative ÷ negative = positive.") };
    }
    if (id === "tc2") {
      if (S.fn !== "BA") return { ok:false, msg:"Choose the Build mode function " + m("(ax + 3)/(x - b)") + " first." };
      var a = S.ba.a, b = S.ba.b;
      if (a === -3 && b === 2) return { ok:true };
      if (a * b + 3 === 0) return { ok:false, msg:md("The numerator is 0 at `x = b` too: that’s a hole, not an asymptote.") };
      if (a === 3) return { ok:false, msg:md("The horizontal asymptote is `y = a/1 = 3`, not −3.") };
      if (b === -2) return { ok:false, msg:md("`x - b = 0` at `x = b`, so `b = 2`.") };
      return { ok:false, msg:md("Right now the vertical asymptote is `x = " + b + "` and the horizontal asymptote is `y = " + a + "`. You need `x = 2` and `y = -3`.") };
    }
    if (id === "tc3") {
      if (S.fn !== "BB") return { ok:false, msg:"Choose the Build mode function " + m("(x^2 + px + q)/(x - 1)") + " first." };
      var p = S.bb.p, qq = S.bb.q;
      if (p === 3 && qq === -6) return { ok:true };
      if (p === 3 && qq === -4) return { ok:false, msg:md("The remainder `q + 4 = 0`, so `x - 1` cancels: no asymptote at all, just a line with a hole.") };
      if (p === 4) return { ok:false, msg:md("Divide: the quotient is `x + (p + 1)`. For `x + 4` you need `p = 3`.") };
      if (qq === 6) return { ok:false, msg:md("`f(0) = q/(0 - 1) = -q`.") };
      if (p === 3 && qq > -4) return { ok:false, msg:md("The remainder is positive, so for `x > 1` the graph is <strong>above</strong> `y = x + 4`.") };
      if (p === 3) return { ok:false, msg:md("Below `y = x + 4` ✓, but the `y`-intercept is `-q = " + (-qq) + "`. You need 6.") };
      if (qq + p + 1 === 0) return { ok:false, msg:md("The remainder `q + p + 1 = 0`, so `x - 1` cancels: no asymptote at all, just a line with a hole.") };
      return { ok:false, msg:md("Right now the oblique asymptote is `y = " + pSrc([p + 1, 1]) + "`. You need `y = x + 4`.") };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){ tool.lock(false); tool.apply(PSTART[p.id]); tool.lock(true); },
      run:function(p, done){
        var fin = function(){ tool.lock(false); tool.paint(); done(); };
        if (p.id === "p1") {
          tool.setMode("near", function(){ tool.target(2, function(){ MV.wait(1800, function(){ tool.target(3, function(){ MV.wait(1400, fin); }, 900); }); }, 900); }, 600);
          return;
        }
        if (p.id === "p2") {
          var i = 0;
          (function next(){ if (i >= WS.length - 1) { MV.wait(700, fin); return; } i++; tool.setW(i, 520, function(){ MV.wait(160, next); }); })();
          return;
        }
        if (p.id === "p3") { tool.probeTo(5, 3200, function(){ MV.wait(500, fin); }); return; }
        if (p.id === "p4") {
          var k = 0, n = tool.divCount();
          (function step(){ if (k >= n) { MV.wait(500, function(){ tool.setW(4, 1600, function(){ MV.wait(600, fin); }); }); return; } k++; tool.divStep(k); MV.wait(1000, step); })();
          return;
        }
        fin();
      }
    },
    challenge:chal
  };
}

// @component gapMeter — a vertical "gap meter" beside a graph: the zero line is the asymptote; a bar rises (above) or falls
// (below) with the sign and size of f(x) − asymptote (tanh-scaled). meter(host).set(v, scale)
function gapMeter(host){
  host.innerHTML = '<div class="az-gm" aria-hidden="true"><span class="az-gm-t">above</span><div class="az-gm-track"><span class="az-gm-bar"></span><span class="az-gm-zero"></span></div><span class="az-gm-t">below</span></div>';
  var bar = $(".az-gm-bar", host);
  return { set:function(v, s){
    if (!isFinite(v)) { bar.style.height = "0"; return; }
    var h = 50 * Math.tanh(Math.abs(v) / (s || 1));
    bar.style.height = h + "%"; bar.style.top = v > 0 ? (50 - h) + "%" : "50%";
  } };
}

// ---------- Part 3: Which side of the asymptote? ----------
var S2F = {
  a:{ f:function(x){ return x + 3 + 4 / (x - 2); }, asy:function(x){ return x + 3; }, rem:function(x){ return 4 / (x - 2); }, vas:[2],
    view:{ xmin:-10, xmax:10, ymin:-10, ymax:16 }, eq:"f(x) = x + 3 + {4}/{x - 2}", chip:"x + 3 + 4/(x - 2)", line:"x + 3", remSrc:"{4}/{x - 2}", ends:{ R:[3, 1e9], L:[-1e9, 1] },
    ans:{ pos:"above", neg:"below" },
    fb:{ pos:"For large positive `x`, `{4}/{x - 2} > 0`: the graph is above `y = x + 3`.", neg:"For large negative `x`, `{4}/{x - 2} < 0`: the graph is below `y = x + 3`." },
    alg:"The remainder decides. `{4}/{x - 2}` is positive when `x > 2` and negative when `x < 2`, so the graph is above `y = x + 3` on the right and below it on the left. It never equals 0, so the graph never crosses this asymptote." },
  b:{ f:function(x){ return (x * x * x + 2 * x * x) / (x * x - 1); }, asy:function(x){ return x + 2; }, rem:function(x){ return (x + 2) / (x * x - 1); }, vas:[-1, 1],
    view:{ xmin:-10, xmax:10, ymin:-12, ymax:14 }, eq:"f(x) = {x^3 + 2x^2}/{x^2 - 1} = x + 2 + {x + 2}/{x^2 - 1}", chip:"(x^3 + 2x^2)/(x^2 - 1)", line:"x + 2", remSrc:"{x + 2}/{x^2 - 1}", ends:{ R:[2, 1e9], L:[-1e9, -2] },
    ans:{ pos:"above", neg:"below" },
    fb:{ pos:"For large positive `x`, `x + 2 > 0` and `x^2 - 1 > 0`: the remainder is positive, so the graph is above `y = x + 2`.", neg:"For large negative `x`, `x + 2 < 0` and `x^2 - 1 > 0`: the remainder is negative, so the graph is below `y = x + 2`." },
    alg:"Long division: `x^3 + 2x^2 = (x^2 - 1)(x + 2) + (x + 2)`. The remainder `{x + 2}/{x^2 - 1}` has the sign of `x + 2` once `x^2 - 1 > 0`: positive far right, negative far left." }
};
var S3F = {
  a:{ f:function(x){ return (x + 1) / ((x - 2) * (x - 2)); }, q:function(X){ var d = XQ.sub(X, 2); return XQ.div(XQ.add(X, 1), XQ.mul(d, d)); }, vas:[2],
    view:{ xmin:-4, xmax:6, ymin:-6, ymax:14 }, eq:"f(x) = {x + 1}/{(x - 2)^2}", chip:"(x + 1)/(x - 2)^2",
    ends:[{ a:2, s:-1, from:0.4, to:1.995, sign:1 }, { a:2, s:1, from:3.8, to:2.005, sign:1 }] },
  b:{ f:function(x){ return (x + 1) / ((x - 2) * (x + 3)); }, vas:[-3, 2],
    view:{ xmin:-6.5, xmax:5, ymin:-10, ymax:10 }, eq:"f(x) = {x + 1}/{(x - 2)(x + 3)}", chip:"(x + 1)/((x - 2)(x + 3))",
    ends:[{ a:-3, s:-1, from:-5.2, to:-3.003, sign:-1 }, { a:-3, s:1, from:-1.9, to:-2.997, sign:1 }, { a:2, s:-1, from:0.6, to:1.997, sign:-1 }, { a:2, s:1, from:3.4, to:2.003, sign:1 }] }
};
var INTS = ["(-∞, -3)", "(-3, -1)", "(-1, 2)", "(2, ∞)"];
var SIGNROWS = [["x + 3", ["-", "+", "+", "+"]], ["x + 1", ["-", "-", "+", "+"]], ["x - 2", ["-", "-", "-", "+"]]];
var S3B = ["-", "+", "-", "+"];
function sgn(s){ return s === "+" ? "+" : s === "-" ? MINUS : "?"; }

function part3(host, api){
  var S = api.S;
  S.st = ["s1", "s2", "s3"].indexOf(S.st) >= 0 ? S.st : "s1";
  S.s1 = S.s1 || {}; S.s2 = S.s2 || {}; S.s3 = S.s3 || {};
  S.s2.fn = S2F[S.s2.fn] ? S.s2.fn : "a"; S.s3.fn = S3F[S.s3.fn] ? S.s3.fn : "a";
  S.s1.px = typeof S.s1.px === "number" ? S.s1.px : -4; S.s2.px = typeof S.s2.px === "number" ? S.s2.px : 6;
  var fb = {};
  function fbHTML(k){ var x = fb[k]; return x ? MV.fbHTML(x.good ? "good" : "bad", x.html) : ""; }
  function inp(id, val, label, cls){ return '<input class="numin az-in' + (cls ? " " + cls : "") + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-in="' + id + '" data-k="azin' + id + '" aria-label="' + MV.esc(label) + '" value="' + MV.esc(val || "") + '">'; }
  function chipsHTML(group, opts, val, label, dis){ return '<span class="chips" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){ var on = val === o[0]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ch="' + group + "|" + o[0] + '" data-k="azch' + group + o[0] + '"' + (dis ? " disabled" : "") + ">" + o[1] + "</button>"; }).join("") + "</span>"; }

  host.innerHTML = '<div class="az-st"></div>' +
    '<div class="az-pane" data-pane="s1"><h3 class="az-h">Station 1: above or below a horizontal asymptote</h3>' +
      "<p>" + md("`f(x) = {2x^2 + 3x}/{x^2 + 1}` has the horizontal asymptote `y = 2`. The sign of `f(x) - 2` tells you the side: positive means above, negative means below.") + "</p>" +
      '<div class="sym"><div><div class="az-gmrow"><div class="plot-wrap"><canvas class="plot" id="az-s1-plot" role="img" aria-label="Graph of f with its horizontal asymptote"></canvas></div><div id="az-s1-gm"></div></div>' +
        '<label class="slider az-sl"><span class="slider-top"><span>Probe ' + m("x") + '</span><output id="az-s1-pxo"></output></span><input type="range" id="az-s1-px" min="-8" max="8" step="0.1" style="accent-color:var(--ink)" aria-label="Probe x"></label>' +
        '<p class="az-gmt" id="az-s1-gmt" aria-live="polite"></p></div>' +
      '<div id="az-s1-q"></div></div></div>' +
    '<div class="az-pane" data-pane="s2" hidden><h3 class="az-h">Station 2: the remainder decides (oblique)</h3>' +
      '<div class="az-s2f"></div><p class="az-s2eq"></p>' +
      '<div class="sym"><div><div class="az-gmrow"><div class="plot-wrap"><canvas class="plot" id="az-s2-plot" role="img" aria-label="Graph of f with its oblique asymptote"></canvas></div><div id="az-s2-gm"></div></div>' +
        '<label class="slider az-sl"><span class="slider-top"><span>Probe ' + m("x") + '</span><output id="az-s2-pxo"></output></span><input type="range" id="az-s2-px" min="-10" max="10" step="0.1" style="accent-color:var(--ink)" aria-label="Probe x"></label>' +
        '<p class="az-gmt" id="az-s2-gmt" aria-live="polite"></p></div>' +
      '<div id="az-s2-q"></div></div></div>' +
    '<div class="az-pane" data-pane="s3" hidden><h3 class="az-h">Station 3: both sides of a vertical asymptote</h3>' +
      '<div class="az-s3f"></div>' +
      '<div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="az-s3-plot" role="img" aria-label="Graph of f near its vertical asymptotes"></canvas></div><p class="az-gmt" id="az-s3-say" aria-live="polite"></p></div>' +
      '<div id="az-s3-q"></div></div></div>';
  var seg = MV.seg($(".az-st", host), { label:"Station:", value:S.st, options:[{ id:"s1", t:"1. Horizontal" }, { id:"s2", t:"2. Oblique" }, { id:"s3", t:"3. Vertical" }],
    onChange:function(v){ S.st = v; api.save(); show(); } });
  function show(){ $$("[data-pane]", host).forEach(function(p){ p.hidden = p.dataset.pane !== S.st; }); seg.set(S.st); if (S.st === "s1") p1.render(); if (S.st === "s2") p2.render(); if (S.st === "s3") p3.render(); }

  // ----- station 1 -----
  var F1 = function(x){ return (2 * x * x + 3 * x) / (x * x + 1); }, gm1 = gapMeter($("#az-s1-gm", host));
  var p1 = new MV.Plot($("#az-s1-plot", host), { xmin:-8, xmax:8, ymin:-1.5, ymax:3.5 });
  p1.render = function(){
    var x = S.s1.px, y = F1(x), dx = 6 * 16 / (p1.c.getBoundingClientRect().width || 400), pts = [{ x:x, y:y, r:6, color:css("--ink") }];
    if (S.s1.okC) pts.push({ x:2 / 3, y:2, r:5, color:css("--ink"), label:"(2/3, 2)" });
    p1.draw({ view:{ xmin:-8, xmax:8, ymin:-1.5, ymax:3.5 }, xTicks:{ step:2 }, yTicks:{ step:1 }, asymptotes:[{ y:2 }],
      regions:[{ f:function(){ return y; }, g:function(){ return 2; }, x0:x - dx, x1:x + dx, color:css("--hi-soft") }],
      segments:[{ x1:x, y1:2, x2:x, y2:y, color:css("--ink"), width:1.5 }],
      curves:[{ f:F1, color:css("--pen"), width:3 }], points:pts,
      describe:"Graph of f(x) = (2x² + 3x)/(x² + 1) with the dashed horizontal asymptote y = 2. The graph is below y = 2 on the left, crosses it at x = 2/3, rises a little above it and comes back down toward 2 on the right. Probe at x = " + ntx(x, 1) + ", f(x) − 2 ≈ " + sig(y - 2, 3) + "." });
  };
  function paint1meter(){
    var x = S.s1.px, g = F1(x) - 2, side = Math.abs(g) < 1e-9 ? "on the asymptote" : g > 0 ? "above" : "below";
    gm1.set(g, 0.6);
    $("#az-s1-pxo", host).textContent = ntx(x, 1); $("#az-s1-px", host).value = x;
    $("#az-s1-gmt", host).innerHTML = m("f(" + nsrc(x) + ") - 2") + (close(g * 1000, Math.round(g * 1000), 1e-6) ? " = " + num(g, 3) : " ≈ " + sig(g, 3)) + ": <strong>" + side + "</strong>";
  }
  function paint1q(){
    var s = S.s1, box = $("#az-s1-q", host);
    MV.keepFocus(box, function(){
      box.innerHTML =
        '<div class="az-q"><p class="az-qp"><strong>a.</strong> Subtract the asymptote.</p><div class="az-eqrow">' + md("`f(x) - 2 = {2x^2 + 3x - 2(x^2 + 1)}/{x^2 + 1} =`") +
          ' <span class="az-fr"><span class="az-frn">' + inp("n1", s.n1, "Coefficient of x in the numerator", s.okA ? "done" : "") + " " + m("x +") + " " + inp("n0", s.n0, "Constant term in the numerator", s.okA ? "done" : "") + '</span><span class="az-frd">' + m("x^2 + 1") + "</span></span></div>" +
          (s.okA ? MV.fbHTML("good", md("<strong>✓ Correct:</strong> `f(x) - 2 = {3x - 2}/{x^2 + 1}`.")) : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="s1a" data-k="azs1a">Check</button></div>' + fbHTML("s1a")) + "</div>" +
        '<div class="az-q"><p class="az-qp"><strong>b.</strong> Choose the sign of ' + m("f(x) - 2") + ".</p>" +
          '<div class="az-sr"><span>For large positive ' + m("x") + ":</span>" + chipsHTML("pos", [["+", "+ (above)"], ["-", MINUS + " (below)"]], s.pos, "Sign for large positive x", s.pos === "+") + "</div>" +
          '<div class="az-sr"><span>For large negative ' + m("x") + ":</span>" + chipsHTML("neg", [["+", "+ (above)"], ["-", MINUS + " (below)"]], s.neg, "Sign for large negative x", s.neg === "-") + "</div>" + fbHTML("s1b") + "</div>" +
        '<div class="az-q"><p class="az-qp"><strong>c.</strong> Where does the graph cross ' + m("y = 2") + "?</p>" +
          '<div class="az-eqrow">' + m("f(x) - 2 = 0") + " at " + m("x =") + " " + inp("x", s.x, "Crossing x-value", s.okC ? "done" : "") + "</div>" +
          (s.okC ? MV.fbHTML("good", md("<strong>✓ Correct:</strong> `3x - 2 = 0` gives `x = 2/3`. The graph crosses its asymptote there; far out, it still settles toward 2.")) : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="s1c" data-k="azs1c">Check</button></div>' + fbHTML("s1c")) + "</div>" +
        '<details class="alg"><summary>Check it with algebra</summary><p>' + md("`f(x) - 2 = {2x^2 + 3x}/{x^2 + 1} - {2(x^2 + 1)}/{x^2 + 1} = {2x^2 + 3x - 2x^2 - 2}/{x^2 + 1} = {3x - 2}/{x^2 + 1}`.") + "</p><p>" +
          md("The denominator `x^2 + 1` is always positive, so the sign is the sign of `3x - 2`: positive for `x > 2/3` (above), negative for `x < 2/3` (below), and 0 at `x = 2/3`, where the graph crosses `y = 2`.") + "</p></details>";
      if (s.okA || s.okC) $$("input.done", box).forEach(function(i){ i.disabled = true; });
    });
  }
  function num1(raw){ var p = MV.parseNum(raw); return p && p.length === 1 ? p[0] : null; }
  $("#az-s1-px", host).addEventListener("input", function(e){ S.s1.px = r1(+e.target.value); api.save(); paint1meter(); p1.render(); });

  // ----- station 2 -----
  var gm2 = gapMeter($("#az-s2-gm", host)), p2 = new MV.Plot($("#az-s2-plot", host), { xmin:-10, xmax:10, ymin:-10, ymax:16 });
  function st2(){ var k = S.s2.fn; return S.s2[k] || (S.s2[k] = {}); }
  p2.render = function(){
    var Fn = S2F[S.s2.fn], s = st2(), x = S.s2.px, y = Fn.f(x), ay = Fn.asy(x), v = Fn.view, dx = 6 * 20 / (p2.c.getBoundingClientRect().width || 400);
    var regs = [], lo = -1e9, curves = [];
    if (s.pos === Fn.ans.pos) regs.push({ f:Fn.f, g:Fn.asy, x0:Fn.ends.R[0], x1:Fn.ends.R[1], color:css("--hi-soft") });
    if (s.neg === Fn.ans.neg) regs.push({ f:Fn.f, g:Fn.asy, x0:Fn.ends.L[0], x1:Fn.ends.L[1], color:css("--hi-soft") });
    if (isFinite(y)) regs.push({ f:function(){ return y; }, g:function(){ return ay; }, x0:x - dx, x1:x + dx, color:css("--hi-soft") });
    Fn.vas.forEach(function(a){ curves.push({ f:Fn.f, domain:[lo, a - 1e-9], color:css("--pen"), width:3 }); lo = a + 1e-9; });
    curves.push({ f:Fn.f, domain:[lo, 1e9], color:css("--pen"), width:3 });
    p2.draw({ view:v, xTicks:{ step:2 }, yTicks:{ step:4 }, regions:regs,
      asymptotes:Fn.vas.map(function(a, i){ return { x:a, label:Fn.vas.length > 1 && i === 0 ? "" : undefined }; }).concat([{ m:1, b:Fn.asy(0), label:"y = " + MV.plain(m(Fn.line)) }]),
      labels:Fn.vas.length > 1 ? [{ x:Fn.vas[0], y:v.ymax, text:"x = " + ntx(Fn.vas[0]), align:"right", dx:-5, dy:14, color:css("--ink-2"), font:"italic 13px " + fontM() }] : [],
      curves:curves, segments:isFinite(y) ? [{ x1:x, y1:Math.max(v.ymin, Math.min(v.ymax, ay)), x2:x, y2:Math.max(v.ymin, Math.min(v.ymax, y)), color:css("--ink"), width:1.5 }] : [],
      points:isFinite(y) ? [{ x:x, y:Math.max(v.ymin, Math.min(v.ymax, y)), r:6, color:css("--ink") }] : [],
      describe:"Graph of " + MV.plain(m(Fn.eq)) + " with its dashed oblique asymptote y = " + MV.plain(m(Fn.line)) + " and vertical asymptote" + (Fn.vas.length > 1 ? "s x = −1 and x = 1." : " x = 2.") + " Probe at x = " + ntx(x, 1) + (isFinite(y) ? ", remainder ≈ " + sig(Fn.rem(x), 3) + "." : ", which is not in the domain.") +
        (s.pos === Fn.ans.pos ? " The gap on the right is shaded: the graph is above the asymptote." : "") + (s.neg === Fn.ans.neg ? " The gap on the left is shaded: the graph is below the asymptote." : "") });
  };
  function paint2meter(){
    var Fn = S2F[S.s2.fn], x = S.s2.px, g = Fn.rem(x), ok = isFinite(Fn.f(x));
    gm2.set(ok ? g : NaN, 0.8);
    $("#az-s2-pxo", host).textContent = ntx(x, 1); $("#az-s2-px", host).value = x;
    $("#az-s2-gmt", host).innerHTML = ok ? "Remainder " + m(Fn.remSrc) + " at " + m("x = " + nsrc(x)) + ": " + (close(g * 1000, Math.round(g * 1000), 1e-6) ? num(g, 3) : "≈ " + sig(g, 3)) + " → <strong>" + (Math.abs(g) < 1e-9 ? "on the asymptote" : g > 0 ? "above" : "below") + "</strong>" : m("x = " + nsrc(x)) + " is not in the domain.";
  }
  function paint2(){
    var Fn = S2F[S.s2.fn], s = st2(), box = $("#az-s2-q", host);
    MV.keepFocus($(".az-s2f", host), function(){ $(".az-s2f", host).innerHTML = '<div class="chips" role="group" aria-label="Function">' + Object.keys(S2F).map(function(k){ var on = S.s2.fn === k; return '<button type="button" class="fchip" aria-pressed="' + on + '" data-s2="' + k + '" data-k="azs2' + k + '">' + m(S2F[k].chip) + "</button>"; }).join("") + "</div>"; });
    $(".az-s2eq", host).innerHTML = m(Fn.eq) + ". Oblique asymptote " + m("y = " + Fn.line) + "; remainder term " + m(Fn.remSrc) + ".";
    MV.keepFocus(box, function(){
      box.innerHTML = '<div class="az-q"><p class="az-qp">Tap <strong>above</strong> or <strong>below</strong> for each end.</p>' +
        '<div class="az-sr"><span>As ' + m("x → ∞") + ", the graph is</span>" + chipsHTML("p2|pos", [["above", "above"], ["below", "below"]], s.pos, "Side as x goes to infinity", s.pos === Fn.ans.pos) + "<span>" + m("y = " + Fn.line) + "</span></div>" + fbHTML("s2pos" + S.s2.fn) +
        '<div class="az-sr"><span>As ' + m("x → -∞") + ", the graph is</span>" + chipsHTML("p2|neg", [["above", "above"], ["below", "below"]], s.neg, "Side as x goes to negative infinity", s.neg === Fn.ans.neg) + "<span>" + m("y = " + Fn.line) + "</span></div>" + fbHTML("s2neg" + S.s2.fn) + "</div>" +
        '<details class="alg"><summary>Check it with algebra</summary><p>' + md(Fn.alg) + "</p></details>";
    });
    paint2meter(); p2.render();
  }
  $("#az-s2-px", host).addEventListener("input", function(e){ S.s2.px = r1(+e.target.value); api.save(); paint2meter(); p2.render(); });

  // ----- station 3 -----
  var p3 = new MV.Plot($("#az-s3-plot", host), { xmin:-4, xmax:6, ymin:-6, ymax:14 }), endsT = null, endsAnim = null;
  function st3(){ var k = S.s3.fn; return S.s3[k] || (S.s3[k] = {}); }
  p3.render = function(){
    var Fn = S3F[S.s3.fn], s = st3(), v = Fn.view, ink2 = css("--ink-2"), curves = [], labels = [], solved = !!s.ok;
    var prog = endsT != null ? endsT : (solved ? Fn.ends.length : 0);
    Fn.ends.forEach(function(e, i){
      var t = Math.max(0, Math.min(1, prog - i)); if (t <= 0) return;
      var x1 = e.from + (e.to - e.from) * t, dom = e.from < x1 ? [e.from, x1] : [x1, e.from];
      curves.push({ f:Fn.f, domain:dom, color:css("--pen"), width:3 });
      if (t >= 1) labels.push({ x:e.a + e.s * 0.12, y:e.sign > 0 ? v.ymax : v.ymin, text:e.sign > 0 ? "+∞" : MINUS + "∞", align:e.s < 0 ? "right" : "left", dx:e.s * 6, dy:e.sign > 0 ? 40 : -16, color:ink2, font:"600 14px " + fontM(), bg:true });
    });
    if (solved && endsT == null) { var lo = -1e9; curves = []; Fn.vas.forEach(function(a){ curves.push({ f:Fn.f, domain:[lo, a - 1e-9], color:css("--pen"), width:3 }); lo = a + 1e-9; }); curves.push({ f:Fn.f, domain:[lo, 1e9], color:css("--pen"), width:3 }); }
    p3.draw({ view:v, xTicks:{ step:1 }, yTicks:{ step:S.s3.fn === "a" ? 2 : 2 }, asymptotes:Fn.vas.map(function(a){ return { x:a }; }).concat([{ y:0, label:"" }]),
      curves:curves, labels:labels, points:[{ x:-1, y:0, r:5, color:css("--pen") }],
      describe:"Vertical asymptote" + (Fn.vas.length > 1 ? "s x = −3 and x = 2" : " x = 2") + " for " + MV.plain(m(Fn.eq)) + ", with the x-intercept (−1, 0). " +
        (solved ? (S.s3.fn === "a" ? "The graph rises toward +∞ on both sides of x = 2." : "Near x = −3 the graph falls to −∞ on the left and comes down from +∞ on the right; near x = 2 it falls to −∞ on the left and comes down from +∞ on the right.") : "Fill in the signs to see the ends of the graph at the asymptotes.") });
  };
  function animateEnds(){
    var Fn = S3F[S.s3.fn], n = Fn.ends.length;
    if (endsAnim) endsAnim();
    endsT = 0;
    endsAnim = MV.tween({ dur:900 * n, ease:function(t){ return t; }, step:function(t){ endsT = t * n; p3.render(); }, done:function(){ endsAnim = null; endsT = null; p3.render(); } });
  }
  function paint3(){
    var Fn = S3F[S.s3.fn], s = st3(), box = $("#az-s3-q", host), h;
    MV.keepFocus($(".az-s3f", host), function(){ $(".az-s3f", host).innerHTML = '<div class="chips" role="group" aria-label="Function">' + Object.keys(S3F).map(function(k){ var on = S.s3.fn === k; return '<button type="button" class="fchip" aria-pressed="' + on + '" data-s3="' + k + '" data-k="azs3' + k + '">' + m(S3F[k].chip) + "</button>"; }).join("") + "</div>"; });
    if (S.s3.fn === "a") {
      h = "<p>" + md("`f(x) = {x + 1}/{(x - 2)^2}`. The approach table shows the values; the sign table explains them.") + "</p>" +
        V6.html({ q:Fn.q, at:"(division by 0)" }, 2, { note:"Computed exactly by the tool." }) +
        '<div class="tbl-wrap az-sgw"><table class="vt az-sg"><caption class="vh">Signs of the factors just left and just right of x = 2</caption><thead><tr><th scope="col">Factor</th><th scope="col">' + m("x → 2^{-}") + '</th><th scope="col">' + m("x → 2^{+}") + "</th></tr></thead><tbody>" +
        "<tr><th scope=\"row\">" + m("x + 1") + "</th><td>+ (near 3)</td><td>+ (near 3)</td></tr>" +
        "<tr><th scope=\"row\">" + m("(x - 2)^2") + "</th><td>+ (small)</td><td>+ (small)</td></tr>" +
        "<tr><th scope=\"row\">" + m("f(x)") + "</th><td>" + chipsHTML("a|L", [["+", "+∞"], ["-", MINUS + "∞"]], s.L, "f as x approaches 2 from the left", s.ok) + "</td><td>" + chipsHTML("a|R", [["+", "+∞"], ["-", MINUS + "∞"]], s.R, "f as x approaches 2 from the right", s.ok) + "</td></tr></tbody></table></div>" +
        (s.ok ? MV.fbHTML("good", md("<strong>✓ Correct.</strong> Both sides → +∞: `(x - 2)^2` is positive on both sides and the numerator is near 3. An even power keeps its sign.")) : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="s3a" data-k="azs3a">Check</button></div>' + fbHTML("s3a"));
    } else {
      var sg = s.sg || ["?", "?", "?", "?"];
      h = "<p>" + md("`f(x) = {x + 1}/{(x - 2)(x + 3)}`. The factors change sign at −3, −1 and 2. Tap each cell in the last row to set the sign of `f` on that interval (+, then −).") + "</p>" +
        '<div class="tbl-wrap az-sgw"><table class="vt az-sg"><caption class="vh">Sign chart of f on four intervals</caption><thead><tr><th scope="col">Factor</th>' + INTS.map(function(t){ return '<th scope="col">' + m(t) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        SIGNROWS.map(function(r){ return '<tr><th scope="row">' + m(r[0]) + "</th>" + r[1].map(function(c){ return "<td>" + sgn(c) + "</td>"; }).join("") + "</tr>"; }).join("") +
        '<tr><th scope="row">' + m("f(x)") + "</th>" + sg.map(function(c, i){ return '<td><button type="button" class="btn sm ghost az-sgb" data-sg="' + i + '" data-k="azsg' + i + '" aria-label="Sign of f on ' + MV.esc(MV.plain(m(INTS[i]))) + ": " + (c === "?" ? "not set" : c === "+" ? "positive" : "negative") + '"' + (s.ok ? " disabled" : "") + ">" + sgn(c) + "</button></td>"; }).join("") + "</tr></tbody></table></div>" +
        (s.ok ? MV.fbHTML("good", md("<strong>✓ Correct:</strong> −, +, −, +. So `f → -∞` as `x → -3^{-}`, `+∞` as `x → -3^{+}`, `-∞` as `x → 2^{-}` and `+∞` as `x → 2^{+}`. Watch the four ends appear.")) : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="s3b" data-k="azs3b">Check</button></div>' + fbHTML("s3b"));
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    var say = $("#az-s3-say", host);
    say.innerHTML = s.ok ? (S.s3.fn === "a" ? "Both ends at " + m("x = 2") + " go up: " + m("+∞") + " from each side." : "Four ends: " + m("-∞") + " and " + m("+∞") + " at " + m("x = -3") + "; " + m("-∞") + " and " + m("+∞") + " at " + m("x = 2") + ".") : "The ends of the graph appear once your signs are right.";
    p3.render();
  }

  // ----- events -----
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.in; if (!id) return;
    S.s1[id] = e.target.value; api.save();
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.in) return;
    var b = $(e.target.dataset.in === "x" ? '[data-act="s1c"]' : '[data-act="s1a"]', host); if (b) b.click();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var s1 = S.s1, act = b.dataset.act;
    if (act === "s1a") {
      var n1 = num1(s1.n1), n0 = num1(s1.n0);
      if (n1 == null || n0 == null) fb.s1a = { good:false, html:"Type a number in each box." };
      else if (n1 === 3 && n0 === -2) { s1.okA = true; fb.s1a = null; }
      else if (n1 === 3) fb.s1a = { good:false, html:md("<strong>✗ Not quite.</strong> Subtract all of `2(x^2 + 1) = 2x^2 + 2`: the constant is −2.") };
      else fb.s1a = { good:false, html:md("<strong>✗ Not quite.</strong> The `x^2` terms cancel: `2x^2 - 2x^2 = 0`. What is left of `3x`?") };
      api.save(); paint1q(); MV.focusFb($("#az-s1-q", host)); return;
    }
    if (act === "s1c") {
      var xv = num1(s1.x);
      if (xv == null) fb.s1c = { good:false, html:"Type a number, such as 2/3." };
      else if (close(xv, 2 / 3, 1e-9)) { s1.okC = true; fb.s1c = null; p1.render(); }
      else if (close(xv, -2 / 3, 1e-9)) fb.s1c = { good:false, html:md("<strong>✗ Not quite.</strong> `3x - 2 = 0` gives `x = 2/3`.") };
      else fb.s1c = { good:false, html:md("<strong>✗ Not quite.</strong> Set the numerator `3x - 2` equal to 0.") };
      api.save(); paint1q(); MV.focusFb($("#az-s1-q", host)); return;
    }
    var ch = b.dataset.ch;
    if (ch && /^(pos|neg)\|/.test(ch)) {
      var part = ch.split("|"), want = part[0] === "pos" ? "+" : "-";
      s1[part[0]] = part[1];
      fb.s1b = part[1] === want ? { good:true, html:md(part[0] === "pos" ? "<strong>✓ Correct.</strong> For large positive `x`, `3x - 2 > 0` and `x^2 + 1 > 0`: above." : "<strong>✓ Correct.</strong> For large negative `x`, `3x - 2 < 0` and `x^2 + 1 > 0`: below.") }
        : { good:false, html:md(part[0] === "pos" ? "<strong>✗ Not quite.</strong> For large positive `x`, what is the sign of `3x - 2`? The bottom `x^2 + 1` is always positive." : "<strong>✗ Not quite.</strong> For large negative `x`, `3x - 2` is negative and `x^2 + 1` is positive.") };
      api.save(); paint1q(); MV.focusFb($("#az-s1-q", host)); return;
    }
    if (ch && /^p2\|/.test(ch)) {
      var pp = ch.split("|"), Fn = S2F[S.s2.fn], s2 = st2(), end = pp[1];
      s2[end] = pp[2];
      fb["s2" + end + S.s2.fn] = pp[2] === Fn.ans[end] ? { good:true, html:md("<strong>✓ Correct.</strong> " + Fn.fb[end] + " The shaded gap shows it.") }
        : { good:false, html:md("<strong>✗ Not quite.</strong> Look at the sign of the remainder `" + Fn.remSrc + "` when `x` is large and " + (end === "pos" ? "positive" : "negative") + ".") };
      api.save(); paint2(); MV.focusFb($("#az-s2-q", host)); return;
    }
    if (b.dataset.s2) { S.s2.fn = b.dataset.s2; api.save(); paint2(); return; }
    if (b.dataset.s3) { if (endsAnim) { endsAnim(); endsAnim = null; } endsT = null; S.s3.fn = b.dataset.s3; api.save(); paint3(); return; }
    if (ch && /^a\|/.test(ch)) { var s3 = st3(), q3 = ch.split("|"); s3[q3[1]] = q3[2]; fb.s3a = null; api.save(); paint3(); return; }
    if (b.dataset.sg != null) { var s3b = st3(), arr = s3b.sg || (s3b.sg = ["?", "?", "?", "?"]), i = +b.dataset.sg; arr[i] = arr[i] === "?" ? "+" : arr[i] === "+" ? "-" : "?"; fb.s3b = null; api.save(); paint3(); return; }
    if (act === "s3a") {
      var sa = st3();
      if (!sa.L || !sa.R) fb.s3a = { good:false, html:"Choose a limit for each side first." };
      else if (sa.L === "+" && sa.R === "+") { sa.ok = true; fb.s3a = null; api.save(); paint3(); animateEnds(); MV.focusFb($("#az-s3-q", host)); return; }
      else if (sa.L === "-" && sa.R === "+") fb.s3a = { good:false, html:md("<strong>✗ Not quite.</strong> A squared factor is positive on both sides; the numerator is near 3.") };
      else fb.s3a = { good:false, html:md("<strong>✗ Not quite.</strong> The numerator is near 3 (positive) and `(x - 2)^2` is a small positive number on each side: positive ÷ small positive.") };
      api.save(); paint3(); MV.focusFb($("#az-s3-q", host)); return;
    }
    if (act === "s3b") {
      var sb = st3(), cur = sb.sg || ["?", "?", "?", "?"];
      if (cur.indexOf("?") >= 0) fb.s3b = { good:false, html:"Set a sign in every cell of the last row first." };
      else {
        var bad = []; cur.forEach(function(c, k){ if (c !== S3B[k]) bad.push(k); });
        if (!bad.length) { sb.ok = true; fb.s3b = null; api.save(); paint3(); animateEnds(); MV.focusFb($("#az-s3-q", host)); return; }
        fb.s3b = { good:false, html:"<strong>✗ Not quite.</strong> Look again at " + bad.map(function(k){ return m(INTS[k]); }).join(", ") + md(". Count the negative factors in each column: an odd number makes `f` negative, an even number makes it positive.") };
      }
      api.save(); paint3(); MV.focusFb($("#az-s3-q", host)); return;
    }
  });
  paint1q(); paint1meter(); paint2(); paint3(); show();
  return {};
}

// ---------- Practice 2: Limits at infinity and design (N4 number entry and V8 boxes) ----------
function limitsAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function box(it, k, label){ var x = ist(it.id); return '<label class="az-bx" for="lm-' + it.id + k + '"><span>' + label + '</span><input class="numin short" id="lm-' + it.id + k + '" data-lb="' + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + "></label>"; }
  function inputs(it){
    var x = ist(it.id);
    if (it.kind === "boxes") return '<div class="az-bxrow">' + it.boxes.map(function(b){ return box(it, b.id, b.label); }).join("") + "</div>";
    if (it.kind === "oa") return '<div class="az-bxrow az-oa"><span class="az-oay">' + m("y =") + "</span>" + box(it, "m", '<span class="vh">slope</span>') + '<span class="az-oay">' + m("x +") + "</span>" + box(it, "b", '<span class="vh">intercept</span>') + "</div>" +
      '<div class="az-sr"><span>As ' + m("x → ∞") + ", the graph is</span>" + '<span class="chips" role="group" aria-label="Above or below">' + ["above", "below"].map(function(sd){ var on = x.v.side === sd; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-side="' + sd + '" data-k="lmside' + it.id + sd + '"' + (x.solved ? " disabled" : "") + ">" + sd + "</button>"; }).join("") + "</span><span>the asymptote</span></div>";
    return '<div class="az-bxrow">' + box(it, "ans", it.label || '<span class="az-bxt">Your answer:</span>') + "</div>";
  }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-lq="' + it.id + '"] .az-lctl', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", (msgs[it.id].bad ? "<strong>✗ Not quite.</strong> " : "") + msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  function paintIn(it){ var c = $('[data-lq="' + it.id + '"] .az-lin', host); MV.keepFocus(c, function(){ c.innerHTML = inputs(it); }); }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it, i){
    return '<div class="q az-lq" data-lq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>" +
      '<div class="az-lin">' + inputs(it) + '</div><div class="az-lctl"></div></div>';
  }).join("");
  a.items.forEach(paintCtl);
  function num1(raw){ var p = MV.parseNum(raw); return p && p.length === 1 ? p[0] : null; }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), i, w;
    if (it.kind === "num") {
      var raw = String(x.v.ans || "").trim(); if (!raw) return { err:"Type your answer first." };
      var v = num1(raw); if (v == null) return { err:"Type a number, such as 2, −5 or −3/5." };
      if (close(v, ans, 1e-9)) return { ok:true };
      w = (it.wrong || []).filter(function(z){ return z.match.some(function(t){ return close(v, t, 1e-6); }); })[0];
      return { ok:false, msg:w ? w.fb : it.general };
    }
    var keys = it.kind === "oa" ? ["m", "b"] : it.boxes.map(function(b){ return b.id; }), vals = {};
    for (i = 0; i < keys.length; i++) {
      var r = String(x.v[keys[i]] || "").trim(); if (!r) return { err:"Fill in every box." };
      var n = num1(r); if (n == null) return { err:"Type a number in each box, such as 3, −7 or 1/2." };
      vals[keys[i]] = n;
    }
    if (it.kind === "oa") {
      if (!x.v.side) return { err:"Choose above or below too." };
      var lineOk = close(vals.m, ans.m) && close(vals.b, ans.b);
      if (lineOk && x.v.side === ans.side) return { ok:true };
      if (lineOk) return { ok:false, msg:it.sideFb };
      w = (it.wrong || []).filter(function(z){ return close(vals.m, z.m) && close(vals.b, z.b); })[0];
      return { ok:false, msg:w ? w.fb : it.general };
    }
    if (keys.every(function(k){ return close(vals[k], ans[k]); })) return { ok:true };
    if (it.generalA && !close(vals.a, ans.a)) return { ok:false, msg:it.generalA };
    return { ok:false, msg:it.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.lb) return; var bx = t.closest("[data-lq]"); ist(bx.dataset.lq).v[t.dataset.lb] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.lb) return; var bx = e.target.closest("[data-lq]"), b = bx && bx.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-lq]"); if (!bx) return;
    var it = a.items.filter(function(z){ return z.id === bx.dataset.lq; })[0], x = ist(it.id);
    if (b.dataset.side) { x.v.side = b.dataset.side; api.save(); paintIn(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:r.msg + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(bx);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: Asymptote architect ----------
var task = (function(){
  var api, plot, FIELDS = [["a", "a", -4, 4], ["r1", "r_1", -6, 6], ["r2", "r_2", -6, 6], ["s1", "s_1", -6, 6], ["s2", "s_2", -6, 6]];
  function read(){
    var s = api ? api.S : {}, d = { valid:true };
    FIELDS.forEach(function(f){
      var t = String(s[f[0]] == null ? "" : s[f[0]]).trim().replace(/−/g, "-"), v = Number(t);
      var ok = t !== "" && Number.isInteger(v) && v >= f[2] && v <= f[3] && !(f[0] === "a" && v === 0);
      d[f[0]] = ok ? v : null; if (!ok) d.valid = false;
    });
    return d;
  }
  function modelD(d){ return ratModel(pScale(pMulLin([-d.r1, 1], [-d.r2, 1]), d.a), pMulLin([-d.s1, 1], [-d.s2, 1])); }
  function pMulLin(u, v){ return [u[0] * v[0], u[0] * v[1] + u[1] * v[0], u[1] * v[1]]; }
  function checks(d){
    if (!d.valid) return [false, false, false, false];
    var F = modelD(d), S1 = [d.s1, d.s2], R1 = [d.r1, d.r2];
    var c1 = F.vas.length === 1 && F.vas[0] === 3;
    var nS = S1.filter(function(v){ return v === -1; }).length, nR = R1.filter(function(v){ return v === -1; }).length;
    var c2 = nS >= 1 && nR >= nS;
    var c3 = F.kind === "ha" ? close(F.L, 2) : F.kind === "poly" && F.poly.length === 1 ? close(F.poly[0], 2) : false;
    var c4 = true;
    for (var k = 1; k <= 7000 && c4; k++) { var x = (3000 + k) / 1000, y = F.f(x); if (isFinite(y) && !(y - 2 < -1e-12)) c4 = false; }
    [12, 15, 20, 30, 50, 100, 300, 1000, 1e4, 1e6].forEach(function(x){ var y = F.f(x); if (isFinite(y) && !(y - 2 < -1e-12)) c4 = false; });
    return [c1, c2, c3, c4];
  }
  function srcOf(d){
    var lead = d.a === 1 ? "" : d.a === -1 ? "-" : String(d.a);
    return "{" + lead + facSrc(d.r1) + facSrc(d.r2) + "}/{" + facSrc(d.s1) + facSrc(d.s2) + "}";
  }
  function draw(){
    var d = read(), v = { xmin:-8, xmax:10, ymin:-8, ymax:12 };
    if (!d.valid) { plot.draw({ view:v, asymptotes:[{ y:2, label:"y = 2", color:css("--ink-2") }], describe:"The reference line y = 2. Enter whole numbers to draw your function." }); return; }
    var F = modelD(d), curves = [], regs = [], lo = -1e9, asy = [];
    F.vas.slice().sort(function(a, b){ return a - b; }).forEach(function(a){ curves.push({ f:F.f, domain:[lo, a - 1e-9], color:css("--pen"), width:3 }); regs.push({ f:F.f, g:function(){ return 2; }, x0:Math.max(lo, v.xmin), x1:a - 0.02, color:css("--hi-soft") }); lo = a + 1e-9; asy.push({ x:a }); });
    curves.push({ f:F.f, domain:[lo, 1e9], color:css("--pen"), width:3 }); regs.push({ f:F.f, g:function(){ return 2; }, x0:Math.max(lo + 0.02, v.xmin), x1:v.xmax, color:css("--hi-soft") });
    var L = F.kind === "ha" ? F.L : F.kind === "poly" && F.poly.length === 1 ? F.poly[0] : null;
    if (F.kind === "ha") asy.push({ y:F.L, label:"HA y = " + ntx(F.L) });
    if (L == null || !close(L, 2)) asy.push({ y:2, label:"y = 2", color:css("--ink-2") });
    var pts = F.holes.map(function(h){ return { x:h.x, y:h.y, open:true, color:css("--pen"), r:5.5 }; });
    plot.draw({ view:v, xTicks:{ step:2 }, yTicks:{ step:2 }, regions:regs, asymptotes:asy, curves:curves, points:pts,
      describe:"Graph of f(x) = " + MV.plain(m(srcOf(d))) + ". " + (F.vas.length ? "Vertical asymptote" + (F.vas.length > 1 ? "s " : " ") + F.vas.map(function(a){ return "x = " + ntx(a); }).join(" and ") + ". " : "No vertical asymptotes. ") +
        (F.holes.length ? "Hole" + (F.holes.length > 1 ? "s" : "") + " at " + F.holes.map(function(h){ return "(" + ntx(h.x) + ", " + ntx(h.y) + ")"; }).join(" and ") + ". " : "No holes. ") +
        (F.kind === "ha" ? "Horizontal asymptote y = " + ntx(F.L) + ". " : "") + "The gap between the graph and y = 2 is shaded." });
  }
  function readout(){
    var d = read(), el = $("#aa-read"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Choose a whole number from −4 to 4 (not 0) for ' + m("a") + ", and whole numbers from −6 to 6 for the others.</dd></div>"; return; }
    var F = modelD(d);
    el.innerHTML = MV.readoutHTML([
      [m("f(x)"), m(srcOf(d))],
      ["Vertical asymptotes", F.vas.length ? F.vas.map(function(x){ return m("x = " + nsrc(x)); }).join(", ") : "none"],
      ["Holes", F.holes.length ? F.holes.map(function(h){ return "(" + ntx(h.x) + ", " + ntx(h.y) + ")"; }).join(", ") : "none"],
      ["Horizontal asymptote", F.kind === "ha" ? m("y = " + nsrc(F.L)) : F.kind === "poly" ? "none: " + m("f(x) = " + pSrc(F.poly)) + " wherever it is defined" : "none"]
    ]);
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.a == null) { a.S.a = "1"; a.S.r1 = "1"; a.S.r2 = "2"; a.S.s1 = "0"; a.S.s2 = "4"; }
      inp.innerHTML = '<div class="inrow az-arow">' + FIELDS.map(function(f){ return '<label for="aa-' + f[0] + '"><span>' + m(f[1]) + ' <span class="tiny muted">(' + ntx(f[2]) + " to " + ntx(f[3]) + (f[0] === "a" ? ", not 0" : "") + ')</span></span><input id="aa-' + f[0] + '" data-aa="' + f[0] + '" type="number" min="' + f[2] + '" max="' + f[3] + '" step="1" autocomplete="off" value="' + MV.esc(a.S[f[0]]) + '"></label>'; }).join("") + "</div>" +
        '<p class="az-aeq" id="aa-eq" aria-live="polite"></p>';
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="aa-plot" role="img" aria-label="Your rational function"></canvas></div><dl class="read" id="aa-read" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#aa-plot"), { xmin:-8, xmax:10, ymin:-8, ymax:12 }); plot.render = draw;
      function eq(){ var d = read(); $("#aa-eq").innerHTML = d.valid ? m("f(x) = " + srcOf(d)) : "&nbsp;"; }
      inp.addEventListener("input", function(e){ var k = e.target.dataset.aa; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); eq(); a.update(); });
      draw(); readout(); eq();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Choose a whole number from −4 to 4 (not 0) for a, and whole numbers from −6 to 6 for r₁, r₂, s₁ and s₂."; },
    checks:checks,
    key:function(d){ var rs = [d.r1, d.r2].sort(function(x, y){ return x - y; }), ss = [d.s1, d.s2].sort(function(x, y){ return x - y; }); return d.a + "|" + rs.join(",") + "|" + ss.join(","); },
    label:function(k){ var p = k.split("|"), r = p[1].split(",").map(Number), s = p[2].split(",").map(Number); return m(srcOf({ a:+p[0], r1:r[0], r2:r[1], s1:s[0], s2:s[1] })); },
    text:function(k){ var p = k.split("|"), r = p[1].split(",").map(Number), s = p[2].split(",").map(Number); return MV.plain(m("f(x) = " + srcOf({ a:+p[0], r1:r[0], r2:r[1], s1:s[0], s2:s[1] }))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ limits:limitsAct },
  task:task
});
})();
