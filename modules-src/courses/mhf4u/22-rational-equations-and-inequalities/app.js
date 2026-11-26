// MHF4U 22 Rational Equations and Inequalities: hero, two-sides grapher (Explore), sign charts with restrictions (Part 3),
// "Reverse and extend" practice and the "Design the inequality" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS, iv = MV.iv;
function mi(s){ var h = m(s); return h.slice(16, h.length - 7); }   // math markup without the outer .m span
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function seq(steps, done){ var i = 0; (function next(){ if (i >= steps.length) { if (done) done(); return; } steps[i++](next); })(); }
var LIN = function(t){ return t; };

// @component exactQ22 — exact fractions {n, d}, polynomials with fraction coefficients (low → high), exact roots of degree ≤ 2
//   (rational, or (p ± k√m)/r labels), integer tidy-up, factor strings and interval labels for rational equations/inequalities
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function Q(n, d){ if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return { n:n / g, d:d / g }; }
function qn(v){ if (v && typeof v === "object") return v; for (var d = 1; d <= 2000; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9 * Math.max(1, Math.abs(v))) return Q(n, d); } return null; }
function qadd(a, b){ return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
function qsub(a, b){ return Q(a.n * b.d - b.n * a.d, a.d * b.d); }
function qmul(a, b){ return Q(a.n * b.n, a.d * b.d); }
function qdiv(a, b){ return !a || !b || b.n === 0 ? null : Q(a.n * b.d, a.d * b.n); }
function qv(a){ return a.n / a.d; }
function qeq(a, b){ return !!a && !!b && a.n === b.n && a.d === b.d; }
function qt(a){ return a.d === 1 ? num(a.n) : (a.n < 0 ? MINUS : "") + Math.abs(a.n) + "/" + a.d; }
var Z = Q(0), ONE = Q(1);
function pdeg(p){ for (var i = p.length - 1; i >= 0; i--) if (p[i].n !== 0) return i; return -1; }
function pev(p, x){ var y = Z; for (var i = p.length - 1; i >= 0; i--) y = qadd(qmul(y, x), p[i]); return y; }
function pfl(p){ var c = p.map(qv); return function(x){ var y = 0; for (var i = c.length - 1; i >= 0; i--) y = y * x + c[i]; return y; }; }
function pmulRoot(p, r){ var out = []; for (var i = 0; i <= p.length; i++) out.push(qsub(i > 0 ? p[i - 1] : Z, i < p.length ? qmul(p[i], r) : Z)); return out; }
function pdivRoot(p, r){ var d = pdeg(p), out = [], acc = Z; for (var i = d; i >= 1; i--) { acc = qadd(p[i], qmul(acc, r)); out[i - 1] = acc; } return out.length ? out : [Z]; }
function pquo(n, d){ var r = n.slice(), dd = pdeg(d), q = []; for (var i = pdeg(n) - dd; i >= 0; i--) { var c = qdiv(r[i + dd], d[dd]); q[i] = c; for (var j = 0; j <= dd; j++) r[i + j] = qsub(r[i + j], qmul(c, d[j])); } return q; }
function lcm(a, b){ return a / gcd(a, b) * b; }
// p = s · c with c integer, gcd 1, leading coefficient > 0
function pint(p){
  var d = pdeg(p), i; if (d < 0) return { c:[0], s:ONE };
  var L = 1; for (i = 0; i <= d; i++) L = lcm(L, p[i].d);
  var c = []; for (i = 0; i <= d; i++) c.push(p[i].n * (L / p[i].d));
  var g = 0; c.forEach(function(v){ g = gcd(g, v); }); if (c[d] < 0) g = -g;
  return { c:c.map(function(v){ return v / g; }), s:Q(g, L) };
}
function pstr(c){ var s = ""; for (var i = c.length - 1; i >= 0; i--) { var v = c[i]; if (!v) continue; var a = Math.abs(v), t = i === 0 ? String(a) : (a === 1 ? "" : a) + (i === 1 ? "x" : "x^" + i); s += s ? (v < 0 ? " - " : " + ") + t : (v < 0 ? "-" : "") + t; } return s || "0"; }
function isq(n){ var r = Math.round(Math.sqrt(n)); return r * r === n ? r : -1; }
function roots(p){
  var d = pdeg(p);
  if (d === 1) { var r = qdiv(qsub(Z, p[0]), p[1]); return [{ q:r, v:qv(r) }]; }
  if (d !== 2) return [];
  var c = pint(p).c, A = c[2], B = c[1], C = c[0], D = B * B - 4 * A * C;
  if (D < 0) return [];
  if (D === 0) { var r0 = Q(-B, 2 * A); return [{ q:r0, v:qv(r0), dbl:true }]; }
  var s = isq(D);
  if (s >= 0) return [Q(-B - s, 2 * A), Q(-B + s, 2 * A)].map(function(x){ return { q:x, v:qv(x) }; });
  var k = 1, mm = D; for (var f = 2; f * f <= mm; f++) while (mm % (f * f) === 0) { mm /= f * f; k *= f; }
  var g = gcd(gcd(Math.abs(B), k), 2 * A), P = -B / g, K = k / g, R = 2 * A / g, rad = (K === 1 ? "" : K) + "√" + mm, sq = Math.sqrt(D);
  var wrap = function(t){ return R === 1 ? t : "{" + t + "}/{" + R + "}"; };
  var lab = function(sg){ return wrap(P ? num(P) + (sg < 0 ? " - " : " + ") + rad : (sg < 0 ? "-" : "") + rad); };
  var pm = wrap((P ? num(P) + " ± " : "±") + rad);
  return [{ q:null, v:(-B - sq) / (2 * A), lab:lab(-1), pm:pm }, { q:null, v:(-B + sq) / (2 * A), lab:lab(1), pm:pm }];
}
// linear factor qx − p as markup; products with a positive integer coefficient
function lin(q, p){ var xs = q === 1 ? "x" : q + "x"; return p === 0 ? xs : xs + (p > 0 ? " - " : " + ") + Math.abs(p); }
function fstr(f){ var s = lin(f.q, f.p); return f.e > 1 ? (s === "x" ? "x^" + f.e : "(" + s + ")^" + f.e) : s; }
function prod(coef, fs, quad){
  var parts = fs.map(fstr); if (quad) parts.push(pstr(quad));
  if (!parts.length) return String(coef);
  if (parts.length === 1 && coef === 1) return parts[0];
  return (coef === 1 ? "" : coef) + parts.map(function(s){ return s === "x" || /^\(|^x\^/.test(s) ? s : "(" + s + ")"; }).join("");
}
function frac(n, d){ return d === "1" ? n : "{" + n + "}/{" + d + "}"; }
// factor a polynomial: K · Π (qx − p)^e [· quad]
function factorize(p, ord){
  var d = pdeg(p); if (d < 0) return { K:Z, f:[], quad:null };
  var it = pint(p), c = it.c, f = [], quad = null;
  if (d === 1) f.push({ q:c[1], p:-c[0], e:1 });
  else if (d === 2) {
    var rs = roots(p);
    if (rs.length && rs[0].q) { if (rs[0].dbl) f.push({ q:rs[0].q.d, p:rs[0].q.n, e:2 }); else rs.forEach(function(r){ f.push({ q:r.q.d, p:r.q.n, e:1 }); }); }
    else quad = c;
  }
  if (ord < 0) f.reverse();
  return { K:it.s, f:f, quad:quad };
}
var FLIP = { "<":">", ">":"<", "≤":"≥", "≥":"≤" };
function sat(s, sym){ return sym === ">" ? s > 0 : sym === "≥" ? s >= 0 : sym === "<" ? s < 0 : s <= 0; }
function incl(sym){ return sym === "≤" || sym === "≥"; }
function sgnQ(a){ return a.n > 0 ? 1 : a.n < 0 ? -1 : 0; }
// one test value strictly inside (a, b): a whole number if possible, else the smallest denominator; nearest the middle (ties toward 0)
function pickTest(a, b){
  var E = 1e-9, k, best = null, mid = (a + b) / 2;
  if (a === -Infinity && b === Infinity) return Z;
  if (a === -Infinity) return Q(Math.ceil(b - E) - 1);
  if (b === Infinity) return Q(Math.floor(a + E) + 1);
  var better = function(v, w){ return w === null || Math.abs(v - mid) < Math.abs(w - mid) - E || (Math.abs(Math.abs(v - mid) - Math.abs(w - mid)) < E && Math.abs(v) < Math.abs(w)); };
  for (k = Math.floor(a + E) + 1; k <= Math.ceil(b - E) - 1; k++) if (better(k, best)) best = k;
  if (best !== null) return Q(best);
  for (var d = 2; d <= 64; d++) {
    var bq = null;
    for (var n = Math.floor(a * d) - 1; n <= Math.ceil(b * d) + 1; n++) { if (gcd(n, d) !== 1) continue; var v = n / d; if (v <= a + E || v >= b - E) continue; if (better(v, bq === null ? null : qv(bq))) bq = Q(n, d); }
    if (bq) return bq;
  }
  return qn(mid);
}
// interval text with exact endpoint labels (markup for m())
function ivMark(ps, lab){
  return ps.map(function(p){ if (p.a === p.b) return "{" + lab(p.a) + "}"; return (p.aIn ? "[" : "(") + lab(p.a) + ", " + lab(p.b) + (p.bIn ? "]" : ")"); }).join(" ∪ ");
}
function wordsMark(ps, lab){
  if (ps.length === 2 && ps[0].a === -Infinity && ps[1].b === Infinity && ps[0].b === ps[1].a && !ps[0].bIn && !ps[1].aIn) return "x ≠ " + lab(ps[0].b);
  return ps.map(function(p){
    if (p.a === p.b) return "x = " + lab(p.a);
    if (p.a === -Infinity && p.b === Infinity) return "x ∈ ℝ";
    if (p.a === -Infinity) return "x " + (p.bIn ? "≤ " : "< ") + lab(p.b);
    if (p.b === Infinity) return "x " + (p.aIn ? "≥ " : "> ") + lab(p.a);
    return lab(p.a) + (p.aIn ? " ≤ " : " < ") + "x" + (p.bIn ? " ≤ " : " < ") + lab(p.b);
  }).join(" or ");
}

// ---------- the eight cases (plan: "The algebra behind each case"); a coefficient is a number or [k0, kb] = k0 + kb·□ ----------
var CASES = {
  1:{ box:{ min:-4, max:6, step:0.5, def:3 }, win:[-8, 8, -6, 8], Ln:[1, 2], Ld:[-1, 1], Rn:[[0, 1]], Rd:[1], N:[[1, 1], [2, -1]], lcd:[1], restr:[1],
    L:"{2x + 1}/{x - 1}", R:"□", menu:"(2x + 1)/(x − 1) = □", mult:"(x - 1)", cleared:"2x + 1 = □(x - 1)", start:"{2x + 1}/{x - 1} - □" },
  2:{ box:{ min:-4, max:8, step:1, def:0 }, win:[-6, 8, -6, 8], Ln:[0, 1], Ld:[-2, 1], Rn:[[-6, 1], 3], Rd:[-2, 1], N:[[6, -1], -2], lcd:[2], restr:[2],
    L:"{x}/{x - 2}", R:"{□}/{x - 2} + 3", menu:"x/(x − 2) = □/(x − 2) + 3", mult:"(x - 2)", cleared:"x = □ + 3(x - 2)", start:"{x}/{x - 2} - ({□}/{x - 2} + 3)" },
  3:{ box:{ min:-4, max:4, step:0.5, def:3 }, win:[-6, 6, -6, 6], Ln:[1], Ld:[0, 1], Rn:[[0, 1], -1], Rd:[1], N:[1, [0, -1], 1], lcd:[0], restr:[0],
    L:"{1}/{x}", R:"□ - x", menu:"1/x = □ − x", mult:"x", cleared:"1 = x(□ - x)", start:"{1}/{x} - (□ - x)" },
  4:{ win:[-8, 8, -8, 8], Ln:[6], Ld:[0, 1], Rn:[-1, 1], Rd:[1], N:[6, 1, -1], lcd:[0], restr:[0], ord:-1,
    L:"{6}/{x}", R:"x - 1", menu:"6/x = x − 1", mult:"x", cleared:"6 = x(x - 1)", start:"{6}/{x} - (x - 1)" },
  5:{ win:[-6, 6, -4, 8], Ln:[-4, 0, 1], Ld:[-2, 1], Rn:[4], Rd:[1], N:[4, -4, 1], lcd:[2], restr:[2],
    L:"{x^2 - 4}/{x - 2}", R:"4", menu:"(x² − 4)/(x − 2) = 4", mult:"(x - 2)", cleared:"x^2 - 4 = 4(x - 2)", start:"{x^2 - 4}/{x - 2} - 4" },
  6:{ win:[-5, 9, -10, 12], Ln:[0, 2], Ld:[-3, 1], Rn:[6, -3, 1], Rd:[-3, 1], N:[-6, 5, -1], lcd:[3], restr:[3],
    L:"{2x}/{x - 3}", R:"{6}/{x - 3} + x", menu:"2x/(x − 3) = 6/(x − 3) + x", mult:"(x - 3)", cleared:"2x = 6 + x(x - 3)", start:"{2x}/{x - 3} - ({6}/{x - 3} + x)" },
  7:{ win:[-6, 6, -6, 6], Ln:[0, 2], Ld:[-4, 0, 1], Rn:[4], Rd:[-4, 0, 1], N:[-4, 2], lcd:[2, -2], restr:[-2, 2],
    L:"{1}/{x - 2} + {1}/{x + 2}", R:"{4}/{x^2 - 4}", menu:"1/(x − 2) + 1/(x + 2) = 4/(x² − 4)", mult:"(x - 2)(x + 2)", cleared:"(x + 2) + (x - 2) = 4", start:"{1}/{x - 2} + {1}/{x + 2} - {4}/{x^2 - 4}" },
  8:{ win:[-5, 5, -4, 6], Ln:[-1, 0, 1], Ld:[-1, 1], Rn:[1, 1], Rd:[1], N:[0], lcd:[1], restr:[1], same:true,
    L:"{x^2 - 1}/{x - 1}", R:"x + 1", menu:"(x² − 1)/(x − 1) = x + 1", mult:"(x - 1)", cleared:"x^2 - 1 = (x + 1)(x - 1)", start:"{x^2 - 1}/{x - 1} - (x + 1)" }
};
function co(c, b){ return Array.isArray(c) ? qadd(Q(c[0]), qmul(Q(c[1]), b)) : Q(c); }
function PB(arr, b){ return arr.map(function(c){ return co(c, b); }); }
function ratF(n, d){ var fn = pfl(n), fd = pfl(d); return function(x){ var q = fd(x); return Math.abs(q) < 1e-13 ? NaN : fn(x) / q; }; }
// one rational side: reduced form, holes, vertical asymptotes, horizontal / oblique asymptote
function sideInfo(n, d){
  if (pdeg(n) < 0) return { n:n, d:d, nr:[Z], dr:[ONE], holes:roots(d).map(function(r){ return { q:r.q, y:Z }; }), vas:[], asy:null, f:function(){ return 0; } };
  var nr = n.slice(), dr = d.slice(), holes = [];
  roots(d).forEach(function(r){ if (r.q && pdeg(dr) >= 1 && pev(nr, r.q).n === 0 && pev(dr, r.q).n === 0) { nr = pdivRoot(nr, r.q); dr = pdivRoot(dr, r.q); holes.push({ q:r.q }); } });
  holes.forEach(function(h){ h.y = qdiv(pev(nr, h.q), pev(dr, h.q)); });
  var dn = pdeg(nr), dd = pdeg(dr), asy = null;
  if (dd >= 1) { if (dn === dd) asy = { y:qdiv(nr[dn], dr[dd]) }; else if (dn === dd + 1) { var qq = pquo(nr, dr); asy = { m:qq[1], b:qq[0] }; } }
  return { n:n, d:d, nr:nr, dr:dr, holes:holes, vas:roots(dr).map(function(r){ return r.q; }), asy:asy, f:ratF(nr, dr) };
}
function sideAt(s, x){ return qdiv(pev(s.n, x), pev(s.d, x)); }
function analyse(ci, b){
  var C = CASES[ci]; b = C.box && b ? b : Z;
  var A = { ci:ci, C:C, b:b, L:sideInfo(PB(C.Ln, b), PB(C.Ld, b)), R:sideInfo(PB(C.Rn, b), PB(C.Rd, b)), N:PB(C.N, b) };
  var lp = [ONE]; C.lcd.forEach(function(r){ lp = pmulRoot(lp, Q(r)); });
  A.D = sideInfo(A.N, lp); A.restr = C.restr.map(function(r){ return Q(r); });
  var deg = pdeg(A.N);
  A.kind = deg < 0 ? "all" : deg === 0 ? "never" : "eq";
  A.cands = deg >= 1 ? roots(A.N) : [];
  if (A.kind === "eq" && !A.cands.length) A.kind = "noreal";
  A.cands.forEach(function(r){ r.bad = !!r.q && A.restr.some(function(z){ return qeq(z, r.q); }); if (r.q) r.lab = qt(r.q); });
  A.sols = A.cands.filter(function(r){ return !r.bad; });
  if (A.kind === "eq" && !A.sols.length) A.kind = "allbad";
  A.sols.forEach(function(r){ r.y = r.q ? sideAt(A.L, r.q) : null; r.yv = r.q ? qv(r.y) : A.L.f(r.v); });
  A.exact = b.d === 1;
  return A;
}
function ineqA(A, sym){
  var crit = [];
  A.restr.forEach(function(r){ crit.push({ v:qv(r), q:r, lab:qt(r), tag:"restriction" }); });
  A.sols.forEach(function(r){ if (!crit.some(function(c){ return Math.abs(c.v - r.v) < 1e-9; })) crit.push({ v:r.v, q:r.q, lab:r.lab, tag:"sides equal" }); });
  crit.sort(function(a, b){ return a.v - b.v; });
  var bnd = [-Infinity].concat(crit.map(function(c){ return c.v; }), [Infinity]), tests = [], ps = [];
  for (var i = 0; i + 1 < bnd.length; i++) {
    var t = pickTest(bnd[i], bnd[i + 1]), l = sideAt(A.L, t), r = sideAt(A.R, t), ok = sat(sgnQ(qsub(l, r)), sym);
    tests.push({ t:t, l:l, r:r, ok:ok });
    if (ok) ps.push({ a:bnd[i], b:bnd[i + 1], aIn:false, bIn:false });
  }
  if (incl(sym)) crit.forEach(function(c){ if (c.tag === "sides equal") ps.push({ a:c.v, b:c.v, aIn:true, bIn:true }); });
  var lab = function(v){ if (v === -Infinity) return "-∞"; if (v === Infinity) return "∞"; for (var k = 0; k < crit.length; k++) if (Math.abs(crit[k].v - v) < 1e-9) return crit[k].lab; return num(v); };
  return { crit:crit, tests:tests, pieces:iv.norm(ps), lab:lab };
}

// ---------- readout text ----------
function boxHTML(b){ return '<span class="bx">' + (b ? num(qv(b), 2) : "&#8203;") + "</span>"; }
function capM(mark, b){ return m(mark).replace(/□/g, boxHTML(b)); }
function plainM(mark, b){ return MV.plain(m(mark)).replace(/□/g, b ? num(qv(b), 2) : "□"); }
function restrHTML(A){ return A.restr.map(function(r){ return m("x ≠ " + qt(r)); }).join(" and "); }
function clearedHTML(A){
  if (A.kind === "all") return m("0 = 0") + ", which is always true";
  if (A.kind === "never") return m(qt(A.N[0]) + " = 0") + ", which is never true";
  return m(pstr(pint(A.N).c) + " = 0");
}
function candHTML(A){
  if (A.kind === "all") return "Every " + m("x");
  if (A.kind === "never") return "None: the cleared form is never true";
  if (A.kind === "noreal") return "None: the cleared form has no real roots";
  if (!A.cands[0].q) return A.cands.map(function(r){ return m("x ≈ " + num(r.v, 2)); }).join(", ") + (A.exact ? "; exact form " + m("x = " + A.cands[0].pm) : "");
  return A.cands.map(function(r){ return m("x = " + r.lab) + (r.dbl ? " (a double root)" : ""); }).join(", ");
}
function yText(r){ return r.q ? "equal " + qt(r.y) : "≈ " + num(r.yv, 2); }
function noTest(A){
  if (A.kind === "noreal") return "No candidates to test: the cleared form has no real roots.";
  if (A.kind === "never") return "No candidates to test: the cleared form is never true.";
  if (A.kind === "all") return "Every allowed " + m("x") + " is a solution: there’s nothing to reject except the restriction " + m("x = " + qt(A.restr[0])) + ".";
  return null;
}
function checkHTML(A, upto){
  var nt = noTest(A); if (nt) return nt;
  if (upto == null) return "Press Test the candidates.";
  return A.cands.slice(0, upto).map(function(r){
    var xs = m("x " + (r.q ? "= " + r.lab : "≈ " + num(r.v, 2)));
    return r.bad ? xs + " ✗ extraneous (a restriction)" : xs + " ✓ allowed: both sides " + yText(r);
  }).join(" · ") || "Testing…";
}
function solHTML(A){
  if (A.kind === "all") return "Every real " + m("x") + " except " + m("x = " + qt(A.restr[0])) + ", that is, " + m("{x ∈ ℝ | x ≠ " + qt(A.restr[0]) + "}");
  if (A.kind === "never") return "No solution: the cleared form is never true";
  if (A.kind === "noreal") return "No real solution: the cleared form has no real roots";
  if (A.kind === "allbad") return "No solution: the only candidate is a restriction";
  if (!A.sols[0].q) return A.sols.map(function(r){ return m("x ≈ " + num(r.v, 2)); }).join(" and ") + (A.exact ? ", that is, " + m("x = " + A.sols[0].pm) : "");
  return A.sols.map(function(r){ return m("x = " + r.lab); }).join(" and ");
}
function inView(v, x, y){ return x >= v.xmin && x <= v.xmax && y >= v.ymin && y <= v.ymax; }
var COUNT = ["never", "once", "twice"];
function graphsHTML(A, diff, v){
  var ci = A.ci, off = function(x, y){ return inView(v, x, y) ? "" : " (off the screen)"; }, tail = "";
  if (!diff) {
    if (ci === 5) return "The graphs never meet: the line " + m("y = 4") + " passes through the hole at (2, 4).";
    if (ci === 8) return "The graphs lie on top of each other, except at the left side’s hole (1, 2).";
    var n = A.sols.length;
    if (!n) return "The graphs never meet.";
    var pts = A.sols.map(function(r){ return (r.q ? "(" + qt(r.q) + ", " + qt(r.y) + ")" : "≈ (" + num(r.v, 2) + ", " + num(r.yv, 2) + ")") + off(r.v, r.yv); });
    return "The graphs meet " + COUNT[n] + ", at " + pts.join(" and ") + "." + (A.sols[0].dbl ? " The line just touches the curve there." : "");
  }
  var Y = m("y = L(x) - R(x)");
  if (ci === 5) return Y + " never crosses the " + m("x") + "-axis: its only would-be " + m("x") + "-intercept, (2, 0), is a hole.";
  if (ci === 8) return Y + " is the " + m("x") + "-axis itself, with a hole at (1, 0).";
  if (A.D.holes.length) tail = " It has a hole at " + A.D.holes.map(function(h){ return "(" + qt(h.q) + ", " + qt(h.y) + ")" + off(qv(h.q), qv(h.y)); }).join(" and ") + ".";
  var k = A.sols.length, xs = A.sols.map(function(r){ return m("x " + (r.q ? "= " + r.lab : "≈ " + num(r.v, 2))) + off(r.v, 0); });
  if (!k) return Y + " never crosses the " + m("x") + "-axis." + tail;
  if (A.sols[0].dbl) return Y + " touches the " + m("x") + "-axis once, at " + xs[0] + ", without crossing it." + tail;
  return Y + " crosses the " + m("x") + "-axis " + COUNT[k] + ", at " + xs.join(" and ") + "." + tail;
}
// One side row: start form, the factored one-fraction form, then the reduced form (flip for a negative constant; cancel)
function oneSideHTML(A, sym){
  var C = A.C, start = capM(C.start, A.b) + " " + m(sym + " 0");
  var F = factorize(A.N, C.ord);
  var Df = C.lcd.map(function(r){ return { q:1, p:r, e:1 }; });
  if (A.kind === "all") {
    var dz = prod(1, Df);
    return start + ", which is " + m(frac("0", dz) + " " + sym + " 0") + ", so " + m("0 " + sym + " 0") + " with " + m("x ≠ " + qt(A.restr[0])) + ", which is " + (incl(sym) ? "always" : "never") + " true";
  }
  var K = F.K, neg = K.n < 0, kn = Math.abs(K.n), kd = K.d, sg = neg ? "-" : "";
  var full = sg + frac(prod(kn, F.f, F.quad), prod(kd, Df));
  // cancel common linear factors
  var Nf = F.f.map(function(f){ return { q:f.q, p:f.p, e:f.e }; }), Dr = Df.map(function(f){ return { q:f.q, p:f.p, e:f.e }; }), cancelled = [];
  Nf.forEach(function(f){ Dr.forEach(function(g){ if (f.e > 0 && g.e > 0 && f.q === g.q && f.p === g.p) { f.e--; g.e--; cancelled.push(Q(g.p, g.q)); } }); });
  Nf = Nf.filter(function(f){ return f.e > 0; }); Dr = Dr.filter(function(f){ return f.e > 0; });
  var red, sym2 = sym, verdict = "";
  if (Nf.length || F.quad) { red = frac(prod(1, Nf, F.quad), prod(1, Dr)); if (neg) sym2 = FLIP[sym]; }
  else {
    red = sg + frac(String(kn), prod(kd, Dr));
    if (!Dr.length) verdict = ", which is " + (sat(neg ? -1 : 1, sym) ? "always" : "never") + " true";
  }
  var h = start + ", which is " + m(full + " " + sym + " 0");
  if (red !== full || sym2 !== sym || cancelled.length) h += ", so " + m(red + " " + sym2 + " 0") + (cancelled.length ? " with " + m("x ≠ " + cancelled.map(qt).join(", ")) : "") + verdict;
  return h;
}
function ineqRows(A, sym, I){
  var e = I.pieces, lab = I.lab, setTxt, allBut = e.length === A.restr.length + 1 && iv.text(e) === iv.text(iv.complement(A.restr.map(function(r){ return { a:qv(r), b:qv(r), aIn:true, bIn:true }; })));
  if (!e.length) setTxt = "No real " + m("x");
  else setTxt = (allBut ? "Every real " + m("x") + " except " + A.restr.map(function(r){ return m("x = " + qt(r)); }).join(" and ") + ": " : "") + m(ivMark(e, lab));
  return [
    ["One side", oneSideHTML(A, sym)],
    ["Critical values", I.crit.map(function(c){ return m("x = " + c.lab) + " (" + c.tag + ")"; }).join(", ")],
    ["Test values", I.tests.map(function(t){ return m("x = " + qt(t.t)) + ": " + m(qt(t.l) + " " + sym + " " + qt(t.r)) + " " + (t.ok ? "✓" : "✗"); }).join(" · ")],
    ["Solution set", setTxt],
    ["In words", e.length ? m(wordsMark(e, lab)) : "No real " + m("x")]
  ];
}

// ---------- drawing helpers ----------
function lineLab(mq, bq){ var mv = qv(mq), mt = mv === 1 ? "x" : mv === -1 ? MINUS + "x" : qt(mq) + "x"; return mt + (bq.n === 0 ? "" : (bq.n > 0 ? " + " : " " + MINUS + " ") + qt(Q(Math.abs(bq.n), bq.d))); }
function asyOf(s){
  var out = []; (s.vas || []).forEach(function(q){ out.push({ k:"x" + qt(q), x:qv(q) }); });
  if (s.asy && s.asy.y && s.asy.y.n !== 0) out.push({ k:"y" + qt(s.asy.y), y:qv(s.asy.y) });
  if (s.asy && s.asy.m) out.push({ k:"m" + qt(s.asy.m) + "b" + qt(s.asy.b), m:qv(s.asy.m), b:qv(s.asy.b), label:"y = " + lineLab(s.asy.m, s.asy.b) });
  return out;
}
function drawAsy(p, a, alpha, color){
  if (alpha <= 0.01) return;
  var v = p.v, lab = a.label || (a.x != null ? "x = " + num(a.x) : "y = " + num(a.y)), X, Y, al = "left";
  p.ctx.save(); p.ctx.globalAlpha = alpha; p.asymptote({ x:a.x, y:a.y, m:a.m, b:a.b, label:"", color:color });
  if (a.x != null) { X = p.X(a.x) + 6; Y = 14; if (X > p.W - 60) { X -= 12; al = "right"; } }
  else if (a.y != null) { X = p.W - 6; Y = p.Y(a.y) - 11; al = "right"; }
  else { var x0 = v.xmin + (v.xmax - v.xmin) * 0.04; X = 6; Y = p.Y(a.m * x0 + a.b) + (a.m > 0 ? -13 : 13); }
  if (X > -20 && X < p.W + 20 && Y > 4 && Y < p.H - 4) bgText(p, lab, X, Y, al, color || css("--ink-2"), "italic 13px " + p.fontM);
  p.ctx.restore();
}
function ptLabel(p, x, y, txt, above){ var X = p.X(x), Y = p.Y(y); if (X < -5 || X > p.W + 5 || Y < -5 || Y > p.H + 5) return; var right = X > p.W - 110, up = above || Y > p.H - 30; bgText(p, txt, X + (right ? -11 : 11), Y + (up ? -16 : 16), right ? "right" : "left", css("--ink")); }
function drawCurve(p, f, color, width, alpha, gaps, dom){
  if (alpha <= 0.01) return;
  var v = p.v, e = 7 * (v.xmax - v.xmin) / p.W, a = dom ? dom[0] : -Infinity, b = dom ? dom[1] : Infinity, cuts = [a];
  (gaps || []).forEach(function(g){ cuts.push(g - e, g + e); }); cuts.push(b);
  for (var i = 0; i + 1 < cuts.length; i += 2) if (cuts[i + 1] > cuts[i]) p.curve({ f:f, color:color, width:width, alpha:alpha, domain:[cuts[i], cuts[i + 1]] });
}
function drawHole(p, x, y, color, alpha, clear, extra){
  var X = p.X(x), Y = p.Y(y), ctx = p.ctx; if (alpha <= 0.01 || X < -10 || X > p.W + 10 || Y < -10 || Y > p.H + 10) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(X, Y, 5 + (extra || 0), 0, Math.PI * 2);
  if (!clear) { ctx.fillStyle = css("--sheet"); ctx.fill(); }
  ctx.lineWidth = 2.2; ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
function vline(p, x, y0, y1, color, width, dash){ var ctx = p.ctx; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width || 2; ctx.setLineDash(dash || [6, 5]); ctx.beginPath(); ctx.moveTo(p.X(x), p.Y(y0)); ctx.lineTo(p.X(x), p.Y(y1)); ctx.stroke(); ctx.restore(); }
function bgText(p, txt, X, Y, align, color, font){
  var ctx = p.ctx; ctx.save(); ctx.font = font || ("600 13px " + p.fontM); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(txt).width, bx = align === "right" ? X - w : align === "center" ? X - w / 2 : X;
  bx = Math.max(2, Math.min(p.W - w - 2, bx)); X = align === "right" ? bx + w : align === "center" ? bx + w / 2 : bx;
  var a0 = ctx.globalAlpha; ctx.globalAlpha = 0.9 * a0; ctx.fillStyle = css("--sheet"); ctx.fillRect(bx - 3, Y - 9, w + 6, 18); ctx.globalAlpha = a0;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(txt, X, Y); ctx.restore();
}
function axisBand(p, a, b, alpha){ var v = p.v, x0 = p.X(Math.max(a, v.xmin)), x1 = p.X(Math.min(b, v.xmax)), Y = p.Y(0); if (x1 <= x0) return; p.ctx.save(); p.ctx.globalAlpha = alpha == null ? 1 : alpha; p.ctx.fillStyle = css("--hi-soft"); p.ctx.fillRect(x0, Y - 8, x1 - x0, 16); p.ctx.restore(); }
// G14 strip: pieces, open/closed dots, a "restriction" tag under each restriction, optional dashed target outline
function drawStrip(p, o){
  p.draw({ numberLine:{ min:o.min, max:o.max, step:(o.max - o.min) > 18 ? 2 : 1, pieces:o.pieces || [], y:0.36 }, describe:o.describe, after:function(ctx, pl){
    var H = pl.H, cy = Math.round(H * 0.36) + 0.5, band = Math.min(26, H * 0.32);
    ctx.save(); ctx.font = "italic " + (H < 70 ? 10 : 11) + "px " + pl.fontUI; ctx.fillStyle = css("--ink-2"); ctx.textAlign = "center"; ctx.textBaseline = "top";
    (o.restr || []).forEach(function(r){ if (r >= o.min && r <= o.max) ctx.fillText("restriction", pl.X(r), cy + band / 2 + (H < 70 ? 15 : 18)); });
    ctx.restore();
    if (o.short) { ctx.save(); ctx.strokeStyle = css("--red"); ctx.lineWidth = 2; ctx.setLineDash([6, 4]); o.short.forEach(function(s){ var a = s.a === -Infinity ? 3 : pl.X(s.a), b = s.b === Infinity ? pl.W - 3 : pl.X(s.b); ctx.strokeRect(a, cy - band / 2 - 3, b - a, band + 6); }); ctx.restore(); }
    if (o.extra) o.extra(ctx, pl, cy);
    if (o.target) { ctx.save(); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); var ta = pl.X(o.target[0]), tb = pl.X(o.target[1]); ctx.strokeRect(ta, 3, tb - ta, cy - band / 2 - 6); ctx.setLineDash([]); ctx.font = "600 11px " + pl.fontUI; ctx.fillStyle = css("--ink"); ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillText("target", tb + 4, (cy - band / 2) / 2 + 1.5); ctx.restore(); }
  } });
}

// ---------- hero (storyboard: asymptote, two curves, typed line, candidate lines, caption) ----------
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:-5, xmax:9, ymin:-10, ymax:12 }), st = { asy:0, L:0, R:0, c2:0, dot:false, c3:0, fl:false, tag3:false };
  var Lf = function(x){ return 2 * x / (x - 3); }, Rf = function(x){ return 6 / (x - 3) + x; };
  function prog(fn, pr, color, w){ if (pr <= 0) return; var a = Math.min(1, pr * 2), b = Math.max(0, pr * 2 - 1); p.curve({ f:fn, color:color, width:w, domain:[-5.2, -5.2 + (2.995 + 5.2) * a] }); if (b > 0) p.curve({ f:fn, color:color, width:w, domain:[3.005, 3.005 + (9.2 - 3.005) * b] }); }
  p.render = function(){
    p.draw({ view:{ xmin:-5, xmax:9, ymin:-10, ymax:12 }, describe:"Graphs of y = 2x/(x − 3) in blue and y = 6/(x − 3) + x in teal, with the vertical asymptote x = 3. A dashed line at x = 2 stops where the curves cross at (2, −4): x = 2 is a solution. A dashed line at x = 3 lies on the asymptote and meets nothing: x = 3 is extraneous.",
      after:function(ctx, pl){
        if (st.asy > 0) { vline(pl, 3, 12, 12 - 22 * st.asy, st.fl ? css("--red") : css("--ink-2"), 1.5, [8, 6]); if (st.asy >= 1) bgText(pl, "x = 3", pl.X(3) + 6, 14, "left", css("--ink-2"), "italic 13px " + pl.fontM); }
        prog(Lf, st.L, css("--pen"), 3); prog(Rf, st.R, css("--f3"), 2.6);
        if (st.c2 > 0) vline(pl, 2, 12, 12 - 16 * st.c2, css("--hi"), 2.5);
        if (st.dot) { pl.point({ x:2, y:-4, r:5.5, ring:true, color:css("--ink") }); bgText(pl, "x = 2 ✓", pl.X(2) - 10, pl.Y(-4) + 20, "right", css("--green")); }
        if (st.c3 > 0) vline(pl, 3, 12, 12 - 24 * st.c3, st.fl || st.tag3 ? css("--red") : css("--hi"), 2.5);
        if (st.tag3) bgText(pl, "x = 3 ✗ extraneous", pl.X(3) + 8, pl.Y(-7.5), "left", css("--red"));
      } });
  };
  var line1 = "Multiply by (x − 3): x² − 5x + 6 = 0, so x = 2 or x = 3", fin = function(){
    f.cap.innerHTML = '<span class="hero-sent">' + MV.md("Multiply by `(x - 3)`: `x^2 - 5x + 6 = 0`, so `x = 2` or `x = 3`") + "</span><br><span class=\"hero-sent hero-cap2\">Two candidates, one solution.</span>";
  };
  if (MV.reduceMotion) { st = { asy:1, L:1, R:1, c2:1, dot:true, c3:1, fl:false, tag3:true }; p.render(); fin(); return; }
  p.render();
  var tw = function(key, dur){ return function(nx){ MV.tween({ dur:dur, ease:LIN, step:function(t){ st[key] = t; p.render(); }, done:nx }); }; };
  seq([tw("asy", 700), tw("L", 1200), tw("R", 1200),
    function(nx){ var n = 0, tm = setInterval(function(){ n += 2; f.cap.innerHTML = '<span class="hero-sent">' + MV.esc(line1.slice(0, n)) + "</span>"; if (n >= line1.length) { clearInterval(tm); nx(); } }, 35); },
    tw("c2", 600), function(nx){ st.dot = true; p.render(); MV.wait(500, nx); }, tw("c3", 900),
    function(nx){ var k = 0; (function fl(){ st.fl = k % 2 === 0; p.render(); if (++k < 5) MV.wait(170, fl); else { st.fl = false; st.tag3 = true; p.render(); nx(); } })(); }
  ], fin);
}

// ---------- Explore: the two-sides grapher ----------
function explore(host, api){
  var S = api.S, CE = api.content, chalC = {};
  (CE.challenges || []).forEach(function(c){ chalC[c.id] = c; });
  var P = {}; (CE.predictions || []).forEach(function(p){ P[p.id] = p; });
  if (!S.c) S.c = 4;
  S.b = S.b || { 1:Q(3), 2:Q(0), 3:Q(3) };
  S.mode = S.mode || "eq"; S.sym = S.sym || ">"; S.view = S.view || "two"; S.tc3 = S.tc3 || { v:"", shown:null };
  var T = { view:null, morph:S.view === "diff" ? 1 : 0, cancels:[], busy:false };
  var opts = Object.keys(CASES).map(function(k){ return '<option value="' + k + '">Case ' + k + ": " + CASES[k].menu + "</option>"; }).join("");
  host.innerHTML = '<div class="pg ex"><div class="pg-graph" data-mv="graph">' +
    '<div class="eq-cap ex-cap" aria-live="polite"></div><p class="tiny muted ex-capnote"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="refresh ex-panel" hidden></div><div class="ex-chips" aria-live="polite"></div>' +
    '<div class="plot-wrap ex-wrap"><canvas class="plot" tabindex="0" role="img" aria-label="Graph"></canvas><div class="ex-cover" hidden><span>Predict first</span></div></div>' +
    '<p class="ex-hidemsg" hidden>The graph stays hidden until your first <strong>Check challenge</strong>. Reason with the algebra.</p>' +
    '<div class="ex-nlw"><canvas class="plot ex-nl" role="img" aria-label="Number line"></canvas></div><div class="ex-ib" hidden></div></div>' +
    '<div class="pg-ctrl"><div class="ctl-row"><label for="ex-case">Choose an equation</label><select id="ex-case">' +
    '<optgroup label="Cases">' + opts + '</optgroup><optgroup label="Target challenges"><option value="tc2">Challenge 2: build the set for 6/x ≥ x − 1</option><option value="tc3">Challenge 3: Case 2 with a number box</option></optgroup></select></div>' +
    '<div class="ex-box"></div><div class="ex-mode"></div><div class="ex-sym"></div><div class="ex-view"></div>' +
    '<div class="q-actions ex-btns"><button type="button" class="btn primary sm" data-ex="test" data-k="extest">Test the candidates</button><button type="button" class="btn ghost sm" data-ex="alg" data-k="exalg">Show the algebra</button><button type="button" class="btn ghost sm" data-ex="zoom" data-k="exzoom">Zoom out</button></div>' +
    '<p class="tiny ex-chnote" hidden></p></div>' +
    '<div class="pg-read"><dl class="read ex-read" aria-live="polite"></dl></div></div>' +
    '<div class="ex-alg" hidden><h4>The algebra, step by step</h4><div class="ex-algbox"></div></div>';
  var q = function(s){ return host.querySelector(s); };
  var plot = new MV.Plot(q(".ex-wrap canvas"), { xmin:-8, xmax:8, ymin:-8, ymax:8 }), nlp = new MV.Plot(q(".ex-nl"), { xmin:-8, xmax:8, ymin:-1, ymax:1 });
  var segMode = MV.seg(q(".ex-mode"), { label:"Mode:", value:S.mode, options:[{ id:"eq", t:"Equation (=)" }, { id:"ineq", t:"Inequality" }], onChange:function(v){ S.mode = v; if (S.chal === "tc2" && v !== "ineq") S.chal = null; if (S.chal === "tc3" && v !== "eq") S.chal = null; userChange(); } });
  var segSym = MV.seg(q(".ex-sym"), { label:"Sign:", value:S.sym, options:["<", "≤", ">", "≥"].map(function(s){ return { id:s, t:s }; }), onChange:function(v){ S.sym = v; if (S.chal === "tc2" && v !== "≥") S.chal = null; userChange(); } });
  var segView = MV.seg(q(".ex-view"), { label:"View:", value:S.view, options:[{ id:"two", t:"Two sides" }, { id:"diff", t:"Difference" }], onChange:function(v){ switchView(v); } });
  var ib = null;
  function solved(id){ var c = MV.S.chal && MV.S.chal[id]; return !!(c && c.solved); }
  function stopAll(){ T.cancels.forEach(function(c){ try { c(); } catch (e) {} }); T.cancels = []; }
  function anim(o){ var c = MV.tween(o); T.cancels.push(c); return c; }
  function later(ms, fn){ var id = MV.wait(ms, fn); T.cancels.push(function(){ clearTimeout(id); }); }
  function baseView(){ var w = CASES[S.c].win, v = { xmin:w[0], xmax:w[1], ymin:w[2], ymax:w[3] }; if (!S.zoom) return v; var cx = (v.xmin + v.xmax) / 2, cy = (v.ymin + v.ymax) / 2, hx = v.xmax - v.xmin, hy = v.ymax - v.ymin; return { xmin:cx - hx, xmax:cx + hx, ymin:cy - hy, ymax:cy + hy }; }
  function boxVal(){
    if (S.chal === "tc3") { var sh = S.tc3.shown ? Q(S.tc3.shown.n, S.tc3.shown.d) : null; if (sh && !solved("tc3")) return sh; var r = MV.parseNum(S.tc3.v); return r && r.length === 1 ? qn(r[0]) : sh; }
    var b = S.b[S.c]; return b ? Q(b.n, b.d) : null;
  }
  function cur(){ return analyse(S.c, boxVal()); }
  function tc3Hidden(){ return S.chal === "tc3" && !S.tc3.shown && !solved("tc3"); }
  function tc2Hidden(){ return S.chal === "tc2" && !solved("tc2"); }
  // ----- controls -----
  function paintBox(){
    var h = q(".ex-box"), C = CASES[S.c]; h.innerHTML = ""; T.boxKey = S.chal + "|" + S.c;
    if (S.chal === "tc3") {
      h.innerHTML = '<div class="numrow"><label for="ex-tc3"><span class="bx bxl">&#8203;</span> =</label><input class="numin short" id="ex-tc3" type="text" autocomplete="off" value="' + MV.esc(S.tc3.v) + '"></div>' +
        '<p class="tiny muted" style="margin:4px 0 0">' + (solved("tc3") ? "The graph and readout follow the box now." : "The graph and the hidden rows show the value from your last Check challenge.") + "</p>";
      q("#ex-tc3").addEventListener("input", function(e){ S.tc3.v = e.target.value; api.save(); if (solved("tc3")) { S.tested = true; render(); } else paintCap(cur()); });
      return;
    }
    if (!C.box) return;
    var d = document.createElement("div"); h.appendChild(d);
    var b = S.b[S.c] || Q(C.box.def);
    T.sl = MV.sliders(d, [{ id:"bx", label:'<span class="bx bxl">&#8203;</span> =', min:C.box.min, max:C.box.max, step:C.box.step, value:qv(b), fmt:function(v){ return num(v, 2); } }], function(id, v){ S.b[S.c] = qn(v); S.tested = false; userChange(); });
    var inp = d.querySelector("input"), out = d.querySelector("output");
    inp.style.accentColor = "var(--ink)"; out.style.color = "var(--ink)";
    inp.setAttribute("aria-label", "Number in the box");
    inp.addEventListener("keydown", function(e){
      if (!e.shiftKey || ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key) < 0) return;
      e.preventDefault(); var dir = e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 1, v = Math.max(C.box.min, Math.min(C.box.max, +inp.value + dir * 4 * C.box.step));
      inp.value = v; inp.dispatchEvent(new Event("input", { bubbles:true }));
    });
  }
  function paintControls(){
    q("#ex-case").value = S.chal || String(S.c);
    segMode.set(S.mode); segSym.set(S.sym); segView.set(S.view);
    q(".ex-sym").hidden = S.mode !== "ineq";
    var hide3 = tc3Hidden();
    q('[data-ex="test"]').hidden = S.mode !== "eq" || hide3;
    q('[data-ex="alg"]').hidden = hide3;
    q('[data-ex="alg"]').textContent = S.alg ? "Hide the algebra" : "Show the algebra";
    q('[data-ex="zoom"]').textContent = S.zoom ? "Zoom back" : "Zoom out";
    var note = q(".ex-chnote");
    note.hidden = !S.chal;
    if (S.chal === "tc2") note.innerHTML = solved("tc2") ? "Challenge 2 is met: the shading and the full readout are back on. Pick a case in the menu to explore freely." : "<strong>Challenge 2 set-up:</strong> shading off and the answer rows hidden. Build the set on the number line under the graph, then press Check challenge below.";
    if (S.chal === "tc3") note.innerHTML = solved("tc3") ? "Challenge 3 is met. Pick a case in the menu to explore freely." : "<strong>Challenge 3 set-up:</strong> type a number in the box, then press Check challenge below.";
  }
  // ----- caption, chips, readout -----
  function paintCap(A){
    var diff = S.view === "diff", sym = S.mode === "ineq" ? S.sym : "=";
    q(".ex-cap").innerHTML = diff ? '<span class="cside cd">' + capM(A.C.start, A.b) + "</span> " + m(sym + " 0") : '<span class="cside cl">' + capM(A.C.L, A.b) + "</span> " + m(sym) + ' <span class="cside cr">' + capM(A.C.R, A.b) + "</span>";
    q(".ex-capnote").innerHTML = diff ? m("L(x) - R(x) " + sym + " 0") + ": the difference in dark ink" : m("L(x) " + sym + " R(x)") + ": left side in blue, right side in teal";
  }
  function target(A, c){
    var diff = S.view === "diff", x = c.q, has = function(list){ return x && list.some(function(z){ return qeq(z, x); }); }, hole = function(hs){ for (var i = 0; i < hs.length; i++) if (x && qeq(hs[i].q, x)) return qv(hs[i].y); return null; };
    if (!c.bad) return { kind:"ok", y:diff ? 0 : c.yv };
    if (diff) return has(A.D.vas) ? { kind:"va" } : { kind:"hole", y:hole(A.D.holes) };
    if (has(A.L.vas) || has(A.R.vas)) return { kind:"va" };
    var y = hole(A.L.holes); if (y === null) y = hole(A.R.holes);
    return { kind:"hole", y:y };
  }
  function paintChips(A){
    var box = q(".ex-chips"), done = S.tested ? A.cands.length : T.testI;
    if (S.mode !== "eq" || (done == null && !T.busy) || tc3Hidden() || !A.cands.length) { box.innerHTML = ""; return; }
    box.innerHTML = A.cands.map(function(c, i){
      var xs = m("x " + (c.q ? "= " + c.lab : "≈ " + num(c.v, 2)));
      if (done == null || i >= done) return '<span class="cchip">' + xs + "</span>";
      if (!c.bad) return '<span class="cchip ok">' + xs + " ✓</span>";
      var tg = target(A, c);
      return '<span class="cchip bad">' + xs + " ✗ " + (tg.kind === "va" ? "extraneous: makes " + m(lin(1, c.q.n / c.q.d) + " = 0") : "extraneous: the graph has a hole here") + "</span>";
    }).join("");
  }
  function paintRead(A, I){
    var rows = [], C = A.C, hide3 = tc3Hidden(), hide2 = tc2Hidden(), sym = S.sym;
    if (S.mode === "ineq") {
      rows.push(["Inequality", capM(C.L, A.b) + " " + m(sym) + " " + capM(C.R, A.b)]);
      if (!hide2) rows = rows.concat(ineqRows(A, sym, I));
    } else {
      rows.push(["Equation", capM(C.L, A.b) + " " + m("=") + " " + capM(C.R, A.b)]);
      rows.push(["Restrictions", restrHTML(A)]);
      if (!hide3) {
        rows.push(["Cleared form", clearedHTML(A)], ["Candidates", candHTML(A)], ["Check", checkHTML(A, S.tested ? A.cands.length : T.testI)], ["Solutions", solHTML(A)], ["Graphs", graphsHTML(A, S.view === "diff", T.view)]);
      }
    }
    q(".ex-read").innerHTML = MV.readoutHTML(rows);
  }
  // ----- the algebra strip (N13) -----
  var algKey = "";
  function paintAlg(A){
    var box = q(".ex-alg"); box.hidden = !S.alg || tc3Hidden();
    if (box.hidden) { algKey = ""; return; }
    var key = S.c + "|" + qt(A.b); if (key === algKey) return; algKey = key;
    var lines = ["Restrictions: " + restrHTML(A), "Multiply every term by " + m(A.C.mult) + ": " + capM(A.C.cleared, A.b), "Cleared form: " + clearedHTML(A), "Candidates: " + candHTML(A), "Check: " + checkHTML(A, A.cands.length), "Solution: " + solHTML(A)];
    var old = q(".ex-algbox"), fresh = document.createElement("div"); fresh.className = "ex-algbox"; old.parentNode.replaceChild(fresh, old);
    fresh.innerHTML = '<ol class="alg-strip"></ol><div class="alg-pl"></div>';
    var ol = fresh.querySelector("ol");
    MV.player(fresh.querySelector(".alg-pl"), { count:lines.length, interval:1300, label:function(i){ return "Step " + (i + 1) + " of " + lines.length; },
      render:function(i){ ol.innerHTML = lines.slice(0, i + 1).map(function(l, k){ return "<li" + (k === i ? ' class="now"' : "") + ">" + l + "</li>"; }).join(""); } });
  }
  // ----- graph -----
  function describe(A, I){
    var C = A.C, diff = S.view === "diff", b = A.b;
    var s = diff ? "Graph of y = L(x) − R(x), the difference " + plainM(C.start, b) + ", in dark ink. " : "Graph of y = " + plainM(C.L, b) + " in blue and y = " + plainM(C.R, b) + " in teal. ";
    var as = (diff ? asyOf(A.D) : asyOf(A.L).concat(asyOf(A.R))).filter(function(a){ return a.x != null; }).map(function(a){ return "x = " + num(a.x); });
    as = as.filter(function(x, i){ return as.indexOf(x) === i; });
    if (as.length) s += "Vertical asymptote" + (as.length > 1 ? "s " : " ") + as.join(" and ") + ". ";
    s += MV.plain(graphsHTML(A, diff, T.view));
    if (S.mode === "eq" && S.tested) A.cands.forEach(function(c){ if (c.bad) s += " The candidate x = " + c.lab + " is extraneous."; });
    if (S.mode === "ineq" && I && !T.noShade && !tc2Hidden()) s += " Shaded where the inequality holds: " + (I.pieces.length ? MV.plain(m(ivMark(I.pieces, I.lab))) : "nowhere") + ".";
    return s;
  }
  function draw(){
    var A = T.A, I = T.I; if (!A) return;
    var v = T.view, t = T.morph, ink = css("--ink"), pen = css("--pen"), f3 = css("--f3"), hi = css("--hi"), red = css("--red");
    var shade = S.mode === "ineq" && !T.noShade && !tc2Hidden() ? (T.shade || I.pieces.map(function(pc){ return { a:pc.a, b:pc.b, fr:1 }; })) : [];
    plot.draw({ view:v, describe:T.desc, after:function(ctx, p){
      var Lf = A.L.f, Rf = A.R.f, Df = A.D.f, ft = function(x){ return Lf(x) - t * Rf(x); };
      shade.forEach(function(s){
        if (s.a === s.b) { if (s.fr > 0) { ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.beginPath(); ctx.arc(p.X(s.a), p.Y(0), 9, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } return; }
        var a = Math.max(s.a, v.xmin - 1), b0 = Math.min(s.b, v.xmax + 1), b = a + (b0 - a) * s.fr; if (b <= a) return;
        axisBand(p, a, b);
        if (t < 1) p.curve({ f:Lf, color:css("--hi-soft"), width:11, alpha:1 - t, domain:[a, b] });
        if (t > 0) p.region({ f:Df, x0:a, x1:b, alpha:t });
      });
      var A0 = asyOf(A.L).concat(asyOf(A.R)), A1 = asyOf(A.D), k0 = {}, k1 = {};
      A1.forEach(function(a){ k1[a.k] = 1; });
      A0.forEach(function(a){ if (k0[a.k]) return; k0[a.k] = 1; drawAsy(p, a, k1[a.k] ? 1 : 1 - t, T.flash != null && a.x != null && Math.abs(a.x - T.flash) < 1e-9 ? red : null); });
      A1.forEach(function(a){ if (!k0[a.k]) drawAsy(p, a, t, T.flash != null && a.x != null && Math.abs(a.x - T.flash) < 1e-9 ? red : null); });
      var same = A.C.same && t < 1, gaps = same ? A.L.holes.map(function(h){ return qv(h.q); }) : [];
      var dom = T.lProg != null && T.lProg < 1 ? [v.xmin - 1, v.xmin - 1 + (v.xmax - v.xmin + 2) * T.lProg] : null;
      var Rt = T.rY != null ? function(){ return T.rY; } : function(x){ return (1 - t) * Rf(x); };
      var blue = function(){ drawCurve(p, ft, pen, 3, 1 - t, gaps, dom); if (t > 0) drawCurve(p, ft, ink, 3.4, t, gaps); };
      var teal = function(){ if (t < 1 && !T.hideR) drawCurve(p, Rt, f3, 2.6, 1); };
      var lHoles = function(clear){ A.L.holes.forEach(function(h){ var hx = qv(h.q), rv = Rf(hx); if (dom && hx > dom[1]) return; drawHole(p, hx, qv(h.y) - t * (isFinite(rv) ? rv : 0), pen, 1 - t, clear, T.pulse && Math.abs(T.pulse.x - hx) < 1e-9 ? T.pulse.r : 0); }); };
      if (same) { teal(); blue(); lHoles(true); }
      else { blue(); lHoles(false); teal(); A.R.holes.forEach(function(h){ drawHole(p, qv(h.q), 0 + qv(h.y) * (1 - t), f3, 1 - t, false); }); }
      A.D.holes.forEach(function(h){ drawHole(p, qv(h.q), qv(h.y), ink, t, false, T.pulse && t > 0.5 && Math.abs(T.pulse.x - qv(h.q)) < 1e-9 ? T.pulse.r : 0); });
      // candidate lines: the moving test, then the resting state after a test
      if (S.mode === "eq" && !T.busy && S.tested) A.cands.forEach(function(c){ var tg = target(A, c); if (tg.kind !== "va" && tg.y != null) vline(p, c.v, v.ymax, tg.kind === "ok" ? (1 - t) * c.yv : tg.y, hi, 2); });
      if (T.cl) vline(p, T.cl.x, v.ymax, v.ymax - (v.ymax - v.ymin) * T.cl.frac, T.cl.red ? red : hi, 2.5);
      if (T.probe) { ctx.save(); ctx.beginPath(); ctx.arc(p.X(T.probe.x), p.Y(T.probe.y), 6, 0, Math.PI * 2); ctx.fillStyle = hi; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke(); ctx.restore(); }
      // meeting points slide down to become x-intercepts
      if (A.ci !== 8 && !(T.lProg != null && T.lProg < 1) && T.rY == null) A.sols.forEach(function(r){
        var y = (1 - t) * r.yv, lab = t >= 1 ? "x = " + (r.q ? qt(r.q) : "≈ " + num(r.v, 2)) : t <= 0 ? (r.q ? "(" + qt(r.q) + ", " + qt(r.y) + ")" : "≈ (" + num(r.v, 2) + ", " + num(r.yv, 2) + ")") : null;
        p.point({ x:r.v, y:y, r:5.5, ring:true, color:ink }); if (lab) ptLabel(p, r.v, y, lab, t >= 1);
      });
      if (A.ci === 8 && t < 0.5) { bgText(p, "Both graphs are y = x + 1, but the blue", 8, 16, "left", ink); bgText(p, "one has a hole at (1, 2).", 8, 36, "left", ink); }
      if (t > 0.01) { ctx.save(); ctx.globalAlpha = t; bgText(p, "y = 0", 6, p.Y(0) - 12, "left", css("--ink-2"), "italic 13px " + p.fontM); ctx.restore(); }
    } });
  }
  function drawNL(){
    var show = S.mode === "ineq" && (!S.chal || S.chal !== "tc2" || solved("tc2"));
    q(".ex-nlw").hidden = !show; if (!show) return;
    var A = T.A, I = T.I, v = T.view, pieces = T.noShade || T.nlOff ? [] : I.pieces;
    drawStrip(nlp, { min:Math.ceil(v.xmin), max:Math.floor(v.xmax), pieces:pieces, restr:A.restr.map(qv), describe:"Number line for the solution set" + (pieces.length ? ": " + MV.plain(m(ivMark(pieces, I.lab))).replace(/∞/g, "infinity") : ", not shaded yet") + ". Restrictions at " + A.restr.map(function(r){ return num(qv(r)); }).join(" and ") + "." });
  }
  function paintIB(){
    var box = q(".ex-ib"); box.hidden = S.chal !== "tc2";
    if (box.hidden) return;
    if (!ib) {
      ib = MV.intervalBuilder(box, { min:-8, max:8, maxPieces:2, modes:false, test:false, readout:false, halfToggle:false, aria:"Interval builder for challenge 2",
        pieces:[{ a:-2, b:2, aIn:true, bIn:true }], onChange:function(st){ S.tc2 = st; api.save(); MV.changed(); } });
      if (S.tc2) ib.set(S.tc2, true);
    }
    ib.render();
  }
  function render(full){
    T.A = cur(); T.I = S.mode === "ineq" ? ineqA(T.A, S.sym) : null;
    if (!T.view) T.view = baseView();
    T.desc = describe(T.A, T.I);
    var hide3 = tc3Hidden();
    q(".ex-wrap").hidden = hide3; q(".ex-hidemsg").hidden = !hide3;
    q(".ex-cover").hidden = !T.cover;
    var pan = q(".ex-panel"); pan.hidden = !T.panel; pan.innerHTML = T.panel || "";
    paintCap(T.A); paintChips(T.A); paintRead(T.A, T.I);
    if (full !== false) { if (T.boxKey !== S.chal + "|" + S.c) paintBox(); paintControls(); paintAlg(T.A); paintIB(); }
    draw(); drawNL();
  }
  plot.render = draw; nlp.render = drawNL;
  function reset(){ stopAll(); T.cover = false; T.noShade = false; T.nlOff = false; T.shade = null; T.panel = null; T.busy = false; T.cl = null; T.probe = null; T.flash = null; T.pulse = null; T.lProg = null; T.rY = null; T.hideR = false; T.testI = null; T.morph = S.view === "diff" ? 1 : 0; T.view = baseView(); }
  function userChange(){ reset(); api.save(); render(); MV.changed(); }
  // ----- view morph, zoom, candidate test -----
  function switchView(v){
    stopAll(); T.cl = null; T.probe = null; T.busy = false; T.testI = null; S.view = v; api.save();
    var from = T.morph, to = v === "diff" ? 1 : 0; render();
    anim({ dur:1000, step:function(s){ T.morph = from + (to - from) * s; draw(); }, done:function(){ T.morph = to; render(); MV.changed(); } });
  }
  function zoomTo(nv, done){ var a = T.view; anim({ dur:700, step:function(s){ T.view = { xmin:a.xmin + (nv.xmin - a.xmin) * s, xmax:a.xmax + (nv.xmax - a.xmax) * s, ymin:a.ymin + (nv.ymin - a.ymin) * s, ymax:a.ymax + (nv.ymax - a.ymax) * s }; draw(); drawNL(); }, done:function(){ T.view = nv; render(false); if (done) done(); } }); }
  function runTest(){
    var A = cur(); if (T.busy) return;
    var nt = noTest(A); if (nt) { MV.banner("", MV.plain(nt)); return; }
    S.tested = false; T.testI = 0; T.busy = true; render();
    if (MV.reduceMotion) { finishTest(); return; }
    var v = T.view, steps = [];
    A.cands.forEach(function(c, i){
      var tg = target(A, c);
      steps.push(function(nx){ T.cl = { x:c.v, frac:0 }; anim({ dur:400, ease:LIN, step:function(s){ T.cl.frac = s; draw(); }, done:nx }); });
      steps.push(function(nx){ var y0 = v.ymax, y1 = tg.kind === "va" ? v.ymin - (v.ymax - v.ymin) * 0.12 : tg.y; T.cl.frac = 1; anim({ dur:800, step:function(s){ T.probe = { x:c.v, y:y0 + (y1 - y0) * s }; draw(); }, done:nx }); });
      steps.push(function(nx){
        T.testI = i + 1; paintChips(A); paintRead(A, null);
        if (tg.kind === "va") { T.probe = null; var k = 0; (function fl(){ T.flash = k % 2 === 0 ? c.v : null; T.cl.red = T.flash != null; draw(); if (++k < 5) later(170, fl); else { T.flash = null; T.cl = null; draw(); later(200, nx); } })(); }
        else if (tg.kind === "hole") { anim({ dur:900, ease:LIN, step:function(s){ T.pulse = { x:c.v, r:5 * Math.abs(Math.sin(s * Math.PI * 2)) }; draw(); }, done:function(){ T.pulse = null; T.probe = null; T.cl = null; draw(); later(200, nx); } }); }
        else { T.probe = null; T.cl = null; draw(); later(400, nx); }
      });
    });
    seq(steps, finishTest);
  }
  function finishTest(){ T.busy = false; T.cl = null; T.probe = null; T.testI = null; S.tested = true; api.save(); render(); }
  // ----- events -----
  q("#ex-case").addEventListener("change", function(e){
    var v = e.target.value;
    if (v === "tc2") { S.chal = "tc2"; S.c = 4; S.mode = "ineq"; S.sym = "≥"; S.view = "two"; }
    else if (v === "tc3") { S.chal = "tc3"; S.c = 2; S.mode = "eq"; S.tested = !!S.tc3.shown; }
    else { S.chal = null; S.c = +v; }
    if (v !== "tc3") S.tested = false;
    S.zoom = false; paintBox(); userChange();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-ex]"); if (!b) return;
    var a = b.dataset.ex;
    if (a === "test") runTest();
    else if (a === "alg") { S.alg = !S.alg; api.save(); render(); if (S.alg) { var al = q(".ex-alg"); if (al.scrollIntoView) al.scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" }); } }
    else if (a === "zoom") { S.zoom = !S.zoom; api.save(); paintControls(); stopAll(); zoomTo(baseView(), function(){ MV.changed(); }); }
  });
  paintBox(); reset(); render();
  // ----- predictions -----
  function setState(o){ stopAll(); S.chal = null; S.zoom = false; Object.keys(o).forEach(function(k){ S[k] = o[k]; }); reset(); paintBox(); api.save(); }
  var predict = {
    start:function(p){
      if (p.id === "p1") { setState({ c:5, mode:"eq", view:"two", tested:false }); T.cover = true; T.panel = p.panel; }
      else if (p.id === "p2") { S.b[1] = Q(-4); setState({ c:1, mode:"eq", view:"two", tested:false }); paintBox(); }
      else if (p.id === "p3") { S.b[1] = Q(3); setState({ c:1, mode:"ineq", sym:"<", view:"two", tested:false }); paintBox(); T.noShade = true; T.panel = p.panel; }
      else if (p.id === "p4") { setState({ c:6, mode:"eq", view:"two", tested:true }); }
      T.morph = S.view === "diff" ? 1 : 0; render();
    },
    run:function(p, done){
      var v = T.view;
      if (p.id === "p1") {
        T.cover = false; T.lProg = 0; T.hideR = true; render(false);
        seq([
          function(nx){ anim({ dur:1000, ease:LIN, step:function(s){ T.lProg = s; draw(); }, done:nx }); },
          function(nx){ T.lProg = null; T.hideR = false; anim({ dur:1100, step:function(s){ T.rY = v.ymax + 1 + (4 - v.ymax - 1) * s; draw(); }, done:nx }); },
          function(nx){ T.rY = null; draw(); zoomTo({ xmin:0.5, xmax:3.5, ymin:2.875, ymax:5.125 }, nx); },
          function(nx){ MV.banner("", "No meeting point."); anim({ dur:1000, ease:LIN, step:function(s){ T.pulse = { x:2, r:5 * Math.abs(Math.sin(s * Math.PI * 2)) }; draw(); }, done:function(){ T.pulse = null; draw(); later(600, nx); } }); }
        ], done);
      } else if (p.id === "p2") {
        if (MV.reduceMotion) { S.b[1] = Q(2); T.panel = p.still; render(); later(60, done); return; }
        var setB = function(x){ var b = Q(Math.round(x * 10), 10); S.b[1] = b; if (T.sl) T.sl.set("bx", qv(b)); render(false); };
        seq([
          function(nx){ anim({ dur:3600, ease:LIN, step:function(s){ setB(-4 + 6 * s); }, done:nx }); },
          function(nx){ setB(2); MV.banner("", MV.plain(p.banner)); later(1200, nx); },
          function(nx){ MV.banner("", "Watch what happens…"); anim({ dur:2400, ease:LIN, step:function(s){ setB(2 + 4 * s); }, done:nx }); }
        ], function(){ api.save(); done(); });
      } else if (p.id === "p3") {
        var I = ineqA(cur(), "<"), pcs = I.pieces.map(function(pc){ return { a:pc.a, b:pc.b, fr:0 }; });
        T.noShade = false; T.nlOff = true; T.shade = pcs; render(false);
        var steps = pcs.map(function(pc){ return function(nx){ anim({ dur:1000, ease:LIN, step:function(s){ pc.fr = s; draw(); }, done:function(){ later(250, nx); } }); }; });
        steps.push(function(nx){ T.nlOff = false; T.shade = null; drawNL(); later(500, nx); });
        seq(steps, done);
      } else if (p.id === "p4") { switchViewThen("diff", function(){ later(400, done); }); }
      else done();
    }
  };
  function switchViewThen(v, done){ S.view = v; api.save(); segView.set(v); var from = T.morph, to = v === "diff" ? 1 : 0; anim({ dur:1000, step:function(s){ T.morph = from + (to - from) * s; draw(); }, done:function(){ T.morph = to; render(); done(); } }); }
  // ----- target challenges -----
  function challenge(id, opt){
    var C = chalC[id], live = opt && opt.live;
    if (id === "tc1") {
      if (S.c !== 1 || S.chal) return { ok:false, msg:C.notCase };
      var b = Q(S.b[1].n, S.b[1].d);
      if (qeq(b, ONE)) return { ok:true };
      var key = qt(b).replace(MINUS, "-");
      if (C.named[key]) return { ok:false, msg:C.named[key] };
      return { ok:false, msg:fill(C.other, { x:m("x = " + qt(qdiv(qadd(b, ONE), qsub(b, Q(2))))) }) };
    }
    if (id === "tc2") {
      if (S.chal !== "tc2" || !ib) return { ok:false, msg:C.setup };
      var got = iv.text(ib.merged());
      if (got === "(−∞, −2] ∪ (0, 3]") { if (!live) setTimeout(function(){ render(); }, 0); return { ok:true }; }
      return { ok:false, msg:C.named[got] || C.other };
    }
    if (id === "tc3") {
      if (S.chal !== "tc3") return { ok:false, msg:C.setup };
      if (live) return { ok:false };
      var r = MV.parseNum(S.tc3.v); if (!r || r.length !== 1) return { ok:false, msg:C.empty };
      var bq = qn(r[0]); if (!bq) return { ok:false, msg:C.empty };
      S.tc3.shown = bq; S.tested = true; api.save(); setTimeout(function(){ paintBox(); reset(); render(); }, 0);
      if (qeq(bq, Q(2))) return { ok:true };
      var k3 = qt(bq).replace(MINUS, "-");
      if (C.named[k3]) return { ok:false, msg:C.named[k3] };
      return { ok:false, msg:fill(C.other, { v:m(qt(qdiv(qsub(Q(6), bq), Q(2)))) }) };
    }
    return { ok:false };
  }
  return { predict:predict, challenge:challenge };
}

// ---------- Part 3: sign charts with restrictions ----------
// Stage A: probe the shortcut (G7 probe on the x-axis)
var SA = {
  a1:{ f:function(x){ return 3 / (x + 2); }, xs:function(x){ return "{3}/{" + x + " + 2}"; }, val:function(x){ return qdiv(Q(3), qadd(x, Q(2))); }, rhs:1, sym:">", restr:-2, fac:"x + 2",
    win:{ xmin:-6, xmax:4, ymin:-6, ymax:6 }, asy:[{ x:-2 }], short:[{ a:-Infinity, b:1 }], truth:[{ a:-2, b:1 }], inShort:function(x){ return x < 1; }, shortTxt:function(x, i){ return i ? "Included (" + x + " < 1)" : "Not included (" + x + " ≥ 1)"; },
    judge:function(x){ return x === -2 ? "restr" : x < -2 ? "ok" : x < 1 ? "mid" : "right"; } },
  a2:{ f:function(x){ return (2 * x + 1) / (x - 1); }, xs:function(x){ return "{2(" + x + ") + 1}/{" + x + " - 1}"; }, val:function(x){ return qdiv(qadd(qmul(Q(2), x), ONE), qsub(x, ONE)); }, rhs:3, sym:"<", restr:1, fac:"x - 1",
    win:{ xmin:-4, xmax:8, ymin:-4, ymax:8 }, asy:[{ x:1 }, { y:2 }], short:[{ a:4, b:Infinity }], truth:[{ a:-Infinity, b:1 }], inShort:function(x){ return x > 4; }, shortTxt:function(x, i){ return i ? "Included (" + x + " > 4)" : "Not included (" + x + " ≤ 4)"; },
    judge:function(x){ return x === 1 ? "restr" : x < 1 ? "ok" : x <= 4 ? "mid" : "right"; } }
};
function stageA(host, api, C){
  var S = api.S.a || (api.S.a = { k:"a1", x:{ a1:0, a2:2 }, done:{} });
  host.innerHTML = '<div class="pa"><h3>' + C.title + '</h3><p class="how">' + C.how + '</p><div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="pa-plot" role="img" aria-label="Graph"></canvas></div>' +
    '<canvas class="plot ex-nl" id="pa-nl" role="img" aria-label="Number line"></canvas><p class="tiny muted pa-key"><span class="pa-sw" aria-hidden="true"></span> The shortcut’s set (red dashed outline)</p></div>' +
    '<div><p class="pa-ineq"></p><div class="refresh pa-short"></div><dl class="read" id="pa-read" aria-live="polite"></dl><p class="pa-task"></p>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-pa="check" data-k="pachk">Check</button><button type="button" class="btn ghost sm" data-pa="swap" data-k="paswap"></button></div><div class="pa-fb" aria-live="polite"></div></div></div>' +
    '<div class="refresh pa-close">' + C.closing + "</div></div>";
  var q = function(s){ return host.querySelector(s); };
  var plot = new MV.Plot(q("#pa-plot"), SA.a1.win), nlp = new MV.Plot(q("#pa-nl"), { xmin:-6, xmax:4, ymin:-1, ymax:1 }), msg = null;
  function d(){ return SA[S.k]; }
  function cx(){ return S.x[S.k]; }
  plot.render = function(){
    var D = d(), x = cx(), v = D.win, done = S.done[S.k];
    var bands = done ? D.truth.map(function(t){ return { x0:t.a, x1:t.b }; }) : [];
    plot.draw({ view:v, bands:bands, asymptotes:D.asy, curves:[{ f:D.f, color:css("--pen"), width:3 }, { f:function(){ return D.rhs; }, color:css("--f3"), width:2.6 }],
      describe:"Graph of the left side in blue and the line y = " + D.rhs + " in teal, with the asymptote x = " + num(D.restr) + ". Probe at x = " + num(x) + (x === D.restr ? ", a restriction." : ", where the left side is " + MV.plain(m(qt(D.val(qn(x))))) + "."),
      after:function(ctx, p){
        if (x !== D.restr) { var y = D.f(x); vline(p, x, 0, Math.max(v.ymin - 1, Math.min(v.ymax + 1, y)), css("--ink-2"), 1.8, [5, 4]); if (y >= v.ymin && y <= v.ymax) p.point({ x:x, y:y, r:5, color:css("--ink") }); }
        p.point({ x:x, y:0, r:7, ring:true, color:css("--ink") });
      } });
  };
  nlp.render = function(){ var D = d(); drawStrip(nlp, { min:D.win.xmin, max:D.win.xmax, pieces:S.done[S.k] ? iv.norm(D.truth.map(function(t){ return { a:t.a, b:t.b, aIn:false, bIn:false }; })) : [], short:D.short, restr:[D.restr], describe:"Number line: the shortcut’s set is outlined in red" + (S.done[S.k] ? "; the true solution is shaded." : ".") }); };
  var drag = MV.drag(plot, { axis:"x", step:{ x:0.5 }, big:4,
    handles:function(){ return [{ id:"p", x:cx(), y:0, label:"Probe at x = " + num(cx()) + ". Arrow keys move it 0.5; Shift + arrow moves 2." }]; },
    snap:function(x){ var v = d().win; return [Math.max(v.xmin, Math.min(v.xmax, Math.round(x * 2) / 2)), 0]; },
    move:function(id, x){ if (x === S.x[S.k]) return; S.x[S.k] = x; msg = null; api.save(); paint(); } });
  void drag;
  function paint(){
    var D = d(), x = cx(), c = C[S.k], xq = qn(x), xs = num(x), rows;
    q(".pa-ineq").innerHTML = "<strong>" + (S.k === "a1" ? "Case A1: " : "Case A2: ") + "</strong>" + c.ineq;
    q(".pa-short").innerHTML = "<p><strong>The shortcut:</strong> " + c.shortcut + "</p>";
    if (x === D.restr) rows = [["x", m(xs)], ["Left side", c.restr]];
    else {
      var val = D.val(xq), ok = sat(sgnQ(qsub(val, Q(D.rhs))), D.sym), neg = x < D.restr;
      rows = [["x", m(xs)], ["Left side", m(D.xs(xs) + " = " + qt(val))], ["Is it " + D.sym + " " + D.rhs + "?", ok ? "Yes" : "No"],
        ["The shortcut says", D.shortTxt(xs, D.inShort(x))], ["Sign of " + m(D.fac), neg ? "Negative: multiplying by it should flip " + D.sym + " to " + FLIP[D.sym] : "Positive: multiplying by it keeps " + D.sym]];
    }
    q("#pa-read").innerHTML = MV.readoutHTML(rows);
    q(".pa-task").innerHTML = "<strong>Task:</strong> " + c.task;
    q('[data-pa="swap"]').textContent = S.k === "a1" ? "Now the other way" : "Back to the first case";
    q(".pa-fb").innerHTML = S.done[S.k] && msg === null ? MV.fbHTML("good", "<strong>✓ Found one.</strong> " + c.done) : msg ? MV.fbHTML(msg.good ? "good" : "bad", msg.html) : "";
    plot.render(); nlp.render();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-pa]"); if (!b) return;
    if (b.dataset.pa === "swap") { S.k = S.k === "a1" ? "a2" : "a1"; msg = null; api.save(); paint(); return; }
    var D = d(), c = C[S.k], j = D.judge(cx());
    if (j === "ok") { S.done[S.k] = true; msg = { good:true, html:"<strong>✓ Found one.</strong> " + c.done }; }
    else msg = { good:false, html:"<strong>✗ Not quite.</strong> " + c[j] };
    api.save(); paint(); MV.focusFb(q(".pa-fb"));
  });
  paint();
}
// Stage B — @component N11 signChart.rational — guided build for a rational inequality: (one fraction →) critical values placed on a
//   number line and tagged top/bottom (restriction) → sign table (a row per factor, decreasing factors allowed, whole-fraction row)
//   → intervals and endpoints (restrictions locked open), with a graph twin that draws column by column. Feedback per cell/endpoint.
function stageB(host, api, B){
  var SS = api.S.bld || (api.S.bld = { cur:0, st:{} }), builds = B.builds, M = B.msgs, msg = null, bad = {}, twinProg = null;
  host.innerHTML = '<div class="part pb"><h3>' + B.title + '</h3><div class="chips pb-chips" role="group" aria-label="Choose a build"></div><p class="pb-ineq"></p><ol class="sb-st"></ol>' +
    '<div class="sym pb-grid"><div><div class="pb-done"></div><div class="pb-nlw"><canvas class="plot ex-nl" role="img" aria-label="Number line for critical values"></canvas></div><div class="pb-ctl"></div><div class="pb-tbl"></div><div class="pb-strip"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-pb="check" data-k="pbchk">Check</button><span class="pb-hb"></span></div><div class="pb-hints"></div><div class="pb-fb" aria-live="polite"></div></div>' +
    '<div><canvas class="plot" id="pb-twin" role="img" aria-label="Graph twin"></canvas><p class="tiny muted pb-tcap"></p></div></div></div>';
  var q = function(s){ return host.querySelector(s); };
  var nlp = new MV.Plot(q(".pb-nlw canvas"), { xmin:-5, xmax:6, ymin:-1, ymax:1 }), tw = new MV.Plot(q("#pb-twin"), { xmin:-5, xmax:6, ymin:-6, ymax:6 });
  function bd(){ return builds[SS.cur]; }
  function info(b){
    var fac = b.fac.map(function(f){ return { t:f.t, a:f.a, b:f.b, top:!!f.top, r:-f.b / f.a }; }), crit = [];
    fac.forEach(function(f){ if (!crit.some(function(c){ return c.v === f.r; })) crit.push({ v:f.r, top:f.top, f:f }); });
    crit.sort(function(x, y){ return x.v - y.v; });
    var cols = [];
    for (var i = 0; i <= crit.length; i++) { var lo = i ? crit[i - 1].v : -Infinity, hi = i < crit.length ? crit[i].v : Infinity; cols.push({ a:lo, b:hi, mid:lo === -Infinity ? hi - 1 : hi === Infinity ? lo + 1 : (lo + hi) / 2 }); }
    cols.forEach(function(c){ c.s = fac.map(function(f){ return f.a * c.mid + f.b > 0 ? 1 : -1; }); c.w = c.s.reduce(function(x, y){ return x * y; }, 1); });
    var f = function(x){ var y = 1; fac.forEach(function(g){ var t = g.a * x + g.b; y = g.top ? y * t : y / t; }); return y; };
    return { fac:fac, crit:crit, cols:cols, f:f, stages:(b.one ? ["one"] : []).concat(["crit", "signs", "sol"]) };
  }
  function st(){ var b = bd(); return SS.st[b.id] || (SS.st[b.id] = { stage:0, placed:[], cur:0, cells:{}, selI:[], closed:{}, tries:0, hint:0, solved:false, first:null }); }
  function stage(I, s){ return I.stages[Math.min(s.stage, I.stages.length - 1)]; }
  function past(I, s, name){ return s.solved || I.stages.indexOf(name) < s.stage; }
  function colLab(c){ return c.a === -Infinity ? "x < " + num(c.b) : c.b === Infinity ? "x > " + num(c.a) : num(c.a) + " < x < " + num(c.b); }
  function student(I, s){ var ps = []; s.selI.forEach(function(i){ var c = I.cols[i]; ps.push({ a:c.a, b:c.b, aIn:isFinite(c.a) && !!s.closed[c.a], bIn:isFinite(c.b) && !!s.closed[c.b] }); }); return iv.norm(ps); }
  function correct(I, b){ var ps = []; I.cols.forEach(function(c){ if (sat(c.w, b.sym)) ps.push({ a:c.a, b:c.b, aIn:false, bIn:false }); }); if (incl(b.sym)) I.crit.forEach(function(c){ if (c.top) ps.push({ a:c.v, b:c.v, aIn:true, bIn:true }); }); return iv.norm(ps); }
  function drawTwin(){
    var b = bd(), I = info(b), s = st(), w = b.win, v = { xmin:w[0], xmax:w[1], ymin:w[2], ymax:w[3] }, critOk = past(I, s, "crit"), sigOk = past(I, s, "signs");
    var asy = critOk ? I.crit.filter(function(c){ return !c.top; }).map(function(c){ return { x:c.v }; }) : [];
    var n = sigOk ? (twinProg == null ? I.cols.length : twinProg) : 0, pcs = s.solved ? correct(I, b) : stage(I, s) === "sol" ? student(I, s) : [];
    tw.draw({ view:v, asymptotes:asy, describe:"Graph twin: y = " + MV.plain(m(b.form)) + (critOk ? ", with dashed asymptotes at the restrictions" : "") + (sigOk ? "; the curve is drawn on every interval, tinted between the curve and the axis." : ". The curve appears as the signs are confirmed."), after:function(ctx, p){
      for (var i = 0; i < I.cols.length; i++) {
        var fr = Math.max(0, Math.min(1, n - i)); if (fr <= 0) break;
        var c = I.cols[i], a = Math.max(c.a, v.xmin - 1) + 1e-6, bb = Math.min(c.b, v.xmax + 1) - 1e-6, e = a + (bb - a) * fr;
        p.region({ f:I.f, x0:a, x1:e, alpha:0.9 }); p.curve({ f:I.f, color:css("--pen"), width:3, domain:[a, e] });
      }
      pcs.forEach(function(pc){ if (pc.a !== pc.b) axisBand(p, pc.a, pc.b); });
      if (critOk) I.crit.forEach(function(c){ if (c.top) p.point({ x:c.v, y:0, r:5, color:css("--ink") }); });
      pcs.forEach(function(pc){ [[pc.a, pc.aIn], [pc.b, pc.bIn]].forEach(function(e2){ if (!isFinite(e2[0])) return; var X = p.X(e2[0]), Y = p.Y(0); ctx.beginPath(); ctx.arc(X, Y, 6, 0, Math.PI * 2); if (e2[1]) { ctx.fillStyle = css("--ink"); ctx.fill(); } else { ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = css("--ink"); ctx.stroke(); } }); });
    } });
    q(".pb-tcap").innerHTML = "Graph twin: " + m("y = " + b.form) + (sigOk ? "" : ". It fills in as you confirm the signs.");
  }
  tw.render = drawTwin;
  nlp.render = function(){ var b = bd(), s = st(), w = b.win; drawStrip(nlp, { min:w[0], max:w[1], pieces:[], describe:"Number line for placing critical values. Placed: " + (s.placed.length ? s.placed.map(function(p){ return num(p.v); }).join(", ") : "none") + ". Marker at " + num(s.cur) + ".", extra:function(ctx, pl, cy){
    s.placed.forEach(function(p){ ctx.beginPath(); ctx.arc(pl.X(p.v), cy, 7, 0, Math.PI * 2); if (p.tag === "bot") { ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = css("--pen"); ctx.stroke(); } else { ctx.fillStyle = css("--pen"); ctx.fill(); } });
    ctx.beginPath(); ctx.arc(pl.X(s.cur), cy, 12, 0, Math.PI * 2); ctx.lineWidth = 2.5; ctx.strokeStyle = css("--hi"); ctx.stroke(); } }); };
  nlp.c.addEventListener("click", function(e){ var b = bd(), s = st(), I = info(b); if (stage(I, s) !== "crit" || s.solved) return; var r = nlp.c.getBoundingClientRect(), x = Math.round(nlp.xOf(e.clientX - r.left) * 2) / 2; x = Math.max(b.win[0], Math.min(b.win[1], x)); s.cur = x; toggle(s, x); msg = null; api.save(); paint(); });
  function toggle(s, x){ var k = -1; s.placed.forEach(function(p, i){ if (p.v === x) k = i; }); if (k < 0) s.placed.push({ v:x, tag:null }); else s.placed.splice(k, 1); s.placed.sort(function(a, b){ return a.v - b.v; }); }
  function ctl(I, s, b){
    var sg = stage(I, s);
    if (s.solved) return "";
    if (sg === "one") return '<p class="pred-q">' + b.one.prompt + '</p><div class="opts">' + b.one.options.map(function(o, i){ return '<button type="button" class="opt' + (s.one === i ? " picked" : "") + '" data-pb="one" data-i="' + i + '" data-k="pbo' + i + '" aria-pressed="' + (s.one === i) + '"><span>' + o.t + "</span></button>"; }).join("") + "</div>";
    if (sg === "crit") return '<div class="sb-zrow"><span class="tiny" style="font-weight:700">Marker</span><button type="button" class="btn ghost sm sb-pm" data-pb="cm" data-k="pbcm" aria-label="Move the marker left">−</button><output class="sb-cur" aria-live="polite">' + m("x = " + num(s.cur)) + '</output><button type="button" class="btn ghost sm sb-pm" data-pb="cp" data-k="pbcp" aria-label="Move the marker right">+</button><button type="button" class="btn ghost sm" data-pb="place" data-k="pbpl">' + (s.placed.some(function(p){ return p.v === s.cur; }) ? "Remove the value here" : "Place a critical value here") + "</button></div>" +
      '<div class="pb-tags">' + (s.placed.length ? s.placed.map(function(p){ return '<div class="pb-tag"><span class="pb-tv">' + m("x = " + num(p.v)) + '</span><span class="seg" role="group" aria-label="Tag x = ' + num(p.v) + '"><button type="button" data-pb="tag" data-v="' + p.v + '" data-t="top" data-k="pbt' + p.v + 't" aria-pressed="' + (p.tag === "top") + '">makes the top 0</button><button type="button" data-pb="tag" data-v="' + p.v + '" data-t="bot" data-k="pbt' + p.v + 'b" aria-pressed="' + (p.tag === "bot") + '">makes the bottom 0 (restriction)</button></span><button type="button" class="btn ghost sm" data-pb="rm" data-v="' + p.v + '" data-k="pbrm' + p.v + '" aria-label="Remove x = ' + num(p.v) + '">×</button></div>'; }).join("") : '<p class="tiny muted">No critical values placed yet.</p>') + "</div>";
    return "";
  }
  function table(I, s, b){
    var sg = stage(I, s), edit = sg === "signs" && !s.solved, show = past(I, s, "crit");
    if (!show) return "";
    var rows = I.fac.map(function(f, j){ return { lab:m(f.t), key:"f" + j, want:function(i){ return I.cols[i].s[j]; } }; }).concat([{ lab:"whole fraction", key:"w", want:function(i){ return I.cols[i].w; } }]);
    var h = '<div class="tbl-wrap pb-sc"><table class="vt pb-t"><thead><tr><th scope="col"></th>' + I.cols.map(function(c){ return '<th scope="col">' + m(colLab(c)) + "</th>"; }).join("") + "</tr></thead><tbody>";
    rows.forEach(function(r){
      h += "<tr" + (r.key === "w" ? ' class="pb-w"' : "") + '><th scope="row">' + r.lab + "</th>";
      I.cols.forEach(function(c, i){
        var k = r.key + "|" + i, val = edit ? (s.cells[k] || "") : (r.want(i) > 0 ? "+" : "-"), txt = val === "-" ? "−" : val || "?";
        if (edit) h += '<td><button type="button" class="pb-c' + (bad[k] ? " bad" : "") + '" data-pb="cell" data-c="' + k + '" data-k="pbc' + k + '" aria-label="' + MV.esc(MV.plain(r.lab) + ", " + colLab(c) + ": " + (val ? (val === "+" ? "plus" : "minus") : "not set")) + '">' + txt + "</button></td>";
        else h += '<td class="pb-cv">' + txt + "</td>";
      });
      h += "</tr>";
    });
    return h + "</tbody></table></div>";
  }
  function strip(I, s){
    if (stage(I, s) !== "sol" || s.solved) return "";
    var h = '<div class="dt-strip" role="group" aria-label="Intervals and endpoints">';
    I.cols.forEach(function(c, i){
      var on = s.selI.indexOf(i) >= 0;
      h += '<button type="button" class="dt-st" data-pb="si" data-i="' + i + '" data-k="pbsi' + i + '" aria-pressed="' + on + '">' + m(colLab(c)) + "</button>";
      if (i < I.crit.length) {
        var cv = I.crit[i], adj = s.selI.indexOf(i) >= 0 || s.selI.indexOf(i + 1) >= 0, cl = !!s.closed[cv.v] && cv.top;
        h += '<button type="button" class="dt-pt" data-pb="ep" data-v="' + cv.v + '" data-k="pbep' + cv.v + '" aria-pressed="' + cl + '" aria-label="x = ' + num(cv.v) + ": " + (cl ? "closed, included" : "open, left out") + (cv.top ? "" : ", a restriction") + '"' + (adj ? "" : " disabled") + "><span>" + num(cv.v) + '</span><b aria-hidden="true">' + (cl ? "●" : "○") + "</b></button>";
      }
    });
    return h + '</div><p class="sb-live">Your solution: <span class="sb-iv">' + m(iv.text(student(I, s)).replace("∅", "none yet")) + "</span></p>";
  }
  function paint(){
    var b = bd(), I = info(b), s = st(), sg = stage(I, s);
    q(".pb-chips").innerHTML = builds.map(function(x, i){ var y = SS.st[x.id]; return '<button type="button" class="chip' + (i === SS.cur ? " on" : "") + '" data-pb="bld" data-i="' + i + '" data-k="pbb' + i + '" aria-pressed="' + (i === SS.cur) + '">' + (y && y.solved ? "✓ " : "") + "Build " + (i + 1) + "</button>"; }).join("");
    q(".pb-ineq").innerHTML = "<strong>Build " + (SS.cur + 1) + ":</strong> " + b.ineq;
    q(".sb-st").innerHTML = I.stages.map(function(x, i){ var dn = s.solved || i < s.stage; return '<li class="' + (dn ? "done" : i === s.stage ? "now" : "") + '">' + (i + 1) + ". " + (dn ? "✓ " : "") + B.stageNames[x] + "</li>"; }).join("");
    var dn = [];
    if (b.one && past(I, s, "one")) dn.push("One fraction: " + m(b.form + " " + b.sym + " 0"));
    if (!b.one) dn.push("Already one fraction: " + m(b.form + " " + b.sym + " 0"));
    if (past(I, s, "crit")) dn.push("Critical values: " + I.crit.map(function(c){ return m("x = " + num(c.v)) + (c.top ? " (top is 0)" : " (restriction)"); }).join(", "));
    q(".pb-done").innerHTML = dn.map(function(x){ return '<p class="pb-line">' + x + "</p>"; }).join("");
    q(".pb-nlw").hidden = !(sg === "crit" && !s.solved);
    MV.keepFocus(q(".pb-ctl"), function(){ q(".pb-ctl").innerHTML = ctl(I, s, b); });
    MV.keepFocus(q(".pb-tbl"), function(){ q(".pb-tbl").innerHTML = table(I, s, b); });
    MV.keepFocus(q(".pb-strip"), function(){ q(".pb-strip").innerHTML = strip(I, s); });
    q('[data-pb="check"]').hidden = s.solved;
    q(".pb-hb").innerHTML = s.solved ? "" : MV.hintBtn("pbh" + b.id, s.hint);
    q(".pb-hints").innerHTML = s.solved ? "" : MV.hintsHTML(b.hints, s.hint);
    q(".pb-fb").innerHTML = s.solved ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + b.done + (s.first ? "" : ' <span class="muted">(not first try)</span>')) : msg ? MV.fbHTML(msg.good ? "good" : "bad", msg.html) : "";
    if (sg === "crit" && !s.solved) nlp.render();
    drawTwin();
  }
  function fail(s, html){ s.tries++; msg = { good:false, html:"<strong>✗ Not quite.</strong> " + html }; }
  function pass(I, s, b){
    var was = stage(I, s); s.stage++; bad = {}; msg = { good:true, html:"<strong>✓ Correct.</strong>" };
    if (was === "signs" && !MV.reduceMotion) { twinProg = 0; MV.tween({ dur:350 * I.cols.length, ease:LIN, step:function(t){ twinProg = t * I.cols.length; drawTwin(); }, done:function(){ twinProg = null; drawTwin(); } }); }
    if (s.stage >= I.stages.length) { s.solved = true; s.first = s.tries === 0 && s.hint < 3; msg = null; }
  }
  function xc(v){ return m("x = " + num(v)); }
  function check(){
    var b = bd(), I = info(b), s = st(), sg = stage(I, s);
    if (sg === "one") { if (s.one == null) { msg = { good:false, html:"Choose one of the inequalities first." }; return; } var o = b.one.options[s.one]; if (MV.ok(o)) { pass(I, s, b); msg = { good:true, html:"<strong>✓ Correct.</strong> " + o.why }; } else fail(s, o.why); return; }
    if (sg === "crit") {
      var pv = s.placed.map(function(p){ return p.v; });
      var missB = I.crit.filter(function(c){ return !c.top && pv.indexOf(c.v) < 0; }), missT = I.crit.filter(function(c){ return c.top && pv.indexOf(c.v) < 0; });
      var extra = s.placed.filter(function(p){ return !I.crit.some(function(c){ return c.v === p.v; }); });
      if (missB.length) return fail(s, M.missing);
      if (missT.length) return fail(s, M.missingTop);
      if (extra.length) return fail(s, fill(M.extra, { xc:xc(extra[0].v) }));
      if (s.placed.some(function(p){ return !p.tag; })) { msg = { good:false, html:M.untagged }; return; }
      for (var i = 0; i < I.crit.length; i++) { var c = I.crit[i], p = s.placed.filter(function(x){ return x.v === c.v; })[0]; if ((p.tag === "top") !== c.top) return fail(s, fill(c.top ? M.tagTop : M.tagBottom, { xc:xc(c.v), f:m(c.f.t) })); }
      return pass(I, s, b);
    }
    if (sg === "signs") {
      var firstBad = null, wholeBad = false, j; bad = {};
      for (var col = 0; col < I.cols.length; col++) { for (j = 0; j <= I.fac.length; j++) if (!s.cells[(j < I.fac.length ? "f" + j : "w") + "|" + col]) { msg = { good:false, html:M.fill }; return; } }
      I.cols.forEach(function(cc, ci){
        I.fac.forEach(function(f, fj){ var k = "f" + fj + "|" + ci; if ((s.cells[k] === "+" ? 1 : -1) !== cc.s[fj]) { bad[k] = 1; if (!firstBad) firstBad = { f:f, c:cc, s:cc.s[fj] }; } });
        var kw = "w|" + ci; if ((s.cells[kw] === "+" ? 1 : -1) !== cc.w) { bad[kw] = 1; wholeBad = true; }
      });
      if (firstBad) { var f = firstBad.f, cc2 = firstBad.c, where = cc2.a === -Infinity ? "less than " + num(cc2.b) : cc2.b === Infinity ? "greater than " + num(cc2.a) : "between " + num(cc2.a) + " and " + num(cc2.b);
        return fail(s, fill(M.factor, { f:m(f.t), gl:f.a > 0 ? "greater" : "less", c:num(f.r), where:where, s:firstBad.s > 0 ? "+" : "−" })); }
      if (wholeBad) return fail(s, M.whole);
      return pass(I, s, b);
    }
    if (!s.selI.length) { msg = { good:false, html:M.empty }; return; }
    if (iv.text(student(I, s)) === MV.ans(b)) return pass(I, s, b);
    for (var ii = 0; ii < I.cols.length; ii++) { var want = sat(I.cols[ii].w, b.sym), has = s.selI.indexOf(ii) >= 0; if (want !== has) return fail(s, fill(M.interval, { sign:I.cols[ii].w > 0 ? "positive" : "negative", does:want ? "does" : "doesn’t", need:m(b.sym + " 0") })); }
    for (var k2 = 0; k2 < I.crit.length; k2++) { var cv = I.crit[k2]; if (!cv.top) continue; var cl = !!s.closed[cv.v]; if (incl(b.sym) && !cl) return fail(s, fill(M.endOpenZero, { xc:xc(cv.v), z:m("0 " + b.sym + " 0") })); if (!incl(b.sym) && cl) return fail(s, fill(M.endClosedZero, { xc:xc(cv.v), z:m("0 " + b.sym + " 0") })); }
    fail(s, M.empty);
  }
  host.addEventListener("click", function(e){
    var el = e.target.closest("[data-pb]"); if (!el || el.disabled || !host.contains(el)) return;
    var b = bd(), I = info(b), s = st(), a = el.dataset.pb;
    if (a === "bld") { SS.cur = +el.dataset.i; msg = null; bad = {}; twinProg = null; api.save(); paint(); return; }
    if (el.dataset.act === "hint") { s.hint = Math.min(3, s.hint + 1); api.save(); paint(); return; }
    if (s.solved) return;
    if (a === "check") { check(); api.save(); paint(); MV.focusFb(q(".pb-fb")); return; }
    if (a === "one") s.one = +el.dataset.i;
    else if (a === "cm" || a === "cp") s.cur = Math.max(b.win[0], Math.min(b.win[1], s.cur + (a === "cp" ? 0.5 : -0.5)));
    else if (a === "place") toggle(s, s.cur);
    else if (a === "rm") toggle(s, +el.dataset.v);
    else if (a === "tag") { s.placed.forEach(function(p){ if (p.v === +el.dataset.v) p.tag = el.dataset.t; }); }
    else if (a === "cell") { var k = el.dataset.c; s.cells[k] = s.cells[k] === "+" ? "-" : "+"; delete bad[k]; }
    else if (a === "si") { var i = +el.dataset.i, x = s.selI.indexOf(i); if (x < 0) s.selI.push(i); else s.selI.splice(x, 1); }
    else if (a === "ep") { var v = +el.dataset.v, cv = I.crit.filter(function(c){ return c.v === v; })[0]; if (!cv.top) { msg = { good:false, html:fill(M.endRestr, { xc:xc(v) }) }; paint(); MV.focusFb(q(".pb-fb")); return; } s.closed[v] = !s.closed[v]; }
    else return;
    msg = null; api.save(); paint();
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; builds.forEach(function(x){ var y = SS.st[x.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:builds.length, done:d, line:"Sign chart builds (first try): " + f + "/" + builds.length + (d < builds.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; builds.forEach(function(x){ var y = SS.st[x.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(x.goal)); }); return g; }
  };
}
function part3(host, api){
  var C = api.content;
  host.innerHTML = '<div class="p3a"></div><div class="p3b"></div>';
  stageA(host.querySelector(".p3a"), api, C.stageA);
  var made = stageB(host.querySelector(".p3b"), api, C.stageB);
  MV.ACTS.signbuilds = { a:{ id:"signbuilds" }, stats:made.stats, missed:made.missed };
  return {};
}

// ---------- Practice 3: Reverse and extend (number boxes N4 and interval builder N10) ----------
function fv(w){ return Array.isArray(w) ? w[0] / w[1] : w; }
function same(a, b){ return a != null && b != null && Math.abs(a - b) < 1e-9; }
function reverse(host, api, a){
  var S = api.S; if (S.i == null) S.i = 0; S.items = S.items || {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted rv-n"></span><span class="dots rv-dots" aria-hidden="true"></span></div><p class="rv-tag"></p><div class="pred-q rv-q"></div><div class="rv-in"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-rv="check" data-k="rvchk">Check</button><span class="rv-hb"></span></div><div class="rv-hints"></div><div class="rv-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" data-rv="prev" data-k="rvprev">Previous</button><button type="button" class="btn ghost sm" data-rv="next" data-k="rvnext">Next problem</button></div>';
  var q = function(s){ return host.querySelector(s); }, ibs = {}, msgs = {};
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { vals:{}, tries:0, hint:0, solved:false, first:null, marks:null, build:null }); }
  function val(x, k){ var r = MV.parseNum(x.vals[k] || ""); return r && r.length === 1 ? r[0] : null; }
  function inputs(it, x){
    var box = q(".rv-in");
    if (it.builder) {
      if (!ibs[it.id]) { var el = document.createElement("div"); el.className = "rv-ib"; box.innerHTML = ""; box.appendChild(el);
        ibs[it.id] = { el:el, b:MV.intervalBuilder(el, { min:it.builder.min, max:it.builder.max, maxPieces:2, modes:false, test:false, readout:false, aria:"Number line for your answer", pieces:[{ a:0, b:2, aIn:true, bIn:true }],
          onChange:function(st){ var y = ist(it); if (!y.solved) { y.build = st; api.save(); } } }) };
        if (x.build) ibs[it.id].b.set(x.build, true);
      } else { box.innerHTML = ""; box.appendChild(ibs[it.id].el); }
      ibs[it.id].b.render(); return;
    }
    MV.keepFocus(box, function(){
      box.innerHTML = '<div class="rv-boxes">' + it.boxes.map(function(bx){ var mk = x.marks && x.marks[bx.k] != null ? (x.marks[bx.k] ? '<span class="rv-mk ok">✓<span class="vh"> right</span></span>' : '<span class="rv-mk no">✗<span class="vh"> not right</span></span>') : "";
        return '<label class="rv-box"><span>' + bx.label + '</span><input class="numin short" type="text" autocomplete="off" data-rvk="' + bx.k + '" data-k="rvi' + bx.k + '" value="' + MV.esc(x.vals[bx.k] || "") + '"' + (x.solved ? " disabled" : "") + ">" + mk + "</label>"; }).join("") + "</div>";
    });
  }
  function paint(){
    var it = a.items[S.i], x = ist(it);
    q(".rv-n").textContent = "Problem " + (S.i + 1) + " of " + a.items.length;
    q(".rv-dots").innerHTML = a.items.map(function(t, i){ var y = S.items[t.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    q(".rv-tag").innerHTML = '<span class="tag">' + it.tag + "</span>";
    q(".rv-q").innerHTML = it.prompt;
    inputs(it, x);
    q('[data-rv="check"]').disabled = x.solved;
    q(".rv-hb").innerHTML = x.solved ? "" : MV.hintBtn("rvh" + it.id, x.hint);
    q(".rv-hints").innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    q(".rv-fb").innerHTML = x.solved ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : msgs[it.id] ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id]) : "";
    q('[data-rv="prev"]').disabled = S.i === 0; q('[data-rv="next"]').disabled = S.i === a.items.length - 1;
  }
  function judge(it, x){
    var ans = MV.ans(it);
    if (it.builder) { var got = iv.text(ibs[it.id].b.merged()); return got === ans ? { ok:true } : { ok:false, msg:(it.named && it.named[got]) || it.general }; }
    var marks = {}, out = { marks:marks };
    if (it.pair) {
      var v1 = val(x, "p1"), v2 = val(x, "p2"), good = function(v){ return ans.some(function(w){ return same(v, w); }); };
      marks.p1 = good(v1); marks.p2 = good(v2) && !same(v1, v2);
      if (marks.p1 && marks.p2) return { ok:true, marks:marks };
      if (v1 == null && v2 == null) { out.msg = it.general; return out; }
      var okv = marks.p1 ? v1 : marks.p2 ? v2 : null, wv = marks.p1 ? (marks.p2 ? null : v2) : v1 != null ? v1 : v2, parts = [];
      if (okv != null) parts.push(it.only[String(okv)]);
      if (wv != null && !(okv != null && same(wv, okv))) {
        if (it.named[String(wv)]) parts.push(it.named[String(wv)]);
        else if (!same(wv, 3) && !same(wv, -2)) parts.push(fill(it.other, { pp:m("p = " + num(wv)), v:m(qt(qdiv(Q(10), qsub(Q(3), qn(wv))))) }));
      }
      out.msg = parts.join(" ") || it.general; return out;
    }
    var keys = it.boxes.map(function(b){ return b.k; }), all = true;
    keys.forEach(function(k){ marks[k] = same(val(x, k), ans[k]); if (!marks[k]) all = false; });
    if (all) return { ok:true, marks:marks };
    if (it.pairs) { var pr = it.pairs.filter(function(p){ return same(val(x, "p"), p.p) && same(val(x, "q"), p.q); })[0]; if (pr) { out.msg = pr.fb; return out; } }
    for (var i = 0; i < keys.length; i++) { var k = keys[i]; if (marks[k]) continue; var w = ((it.wrong || {})[k] || []).filter(function(o){ return same(val(x, k), fv(o.v)); })[0]; if (w) { out.msg = w.fb; return out; } }
    out.msg = it.general; return out;
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.rvk; if (!k) return; var it = a.items[S.i], x = ist(it); x.vals[k] = e.target.value; if (x.marks) x.marks[k] = null; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.rvk) q('[data-rv="check"]').click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var it = a.items[S.i], x = ist(it);
    if (b.dataset.rv === "prev" || b.dataset.rv === "next") { S.i += b.dataset.rv === "prev" ? -1 : 1; api.save(); paint(); return; }
    if (b.dataset.act === "hint" && b.closest(".rv-hb")) { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.rv === "check") {
      var r = judge(it, x); x.marks = r.marks || null;
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = r.msg; }
      api.save(); paint(); MV.focusFb(q(".rv-fb"));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: design the inequality ----------
var task = (function(){
  var api, plot, nlp;
  function ints(){ var s = api ? api.S : {}; return ["p", "q", "r"].map(function(k){ var v = MV.parseNum(s[k] == null ? "" : String(s[k])); return v && v.length === 1 && Number.isInteger(v[0]) && v[0] >= -6 && v[0] <= 6 ? v[0] : null; }); }
  function read(){ var s = api ? api.S : {}, v = ints(); return { p:v[0], q:v[1], r:v[2], sym:s.sym || "<", valid:v.every(function(x){ return x !== null; }) }; }
  function capMark(d){ var top = d.p === 0 ? "x" : "x " + (d.p > 0 ? "+ " : "- ") + Math.abs(d.p), bot = d.q === 0 ? "x" : "x " + (d.q > 0 ? "- " : "+ ") + Math.abs(d.q); return "{" + top + "}/{" + bot + "} " + d.sym + " " + num(d.r); }
  function solve(d){
    var p = d.p, qq = d.q, r = d.r, sym = d.sym, ps = [];
    if (p === -qq) return { pieces:sat(1 - r, sym) ? [{ a:-Infinity, b:qq, aIn:false, bIn:false }, { a:qq, b:Infinity, aIn:false, bIn:false }] : [], hole:true };
    var A = 1 - r, B = p + r * qq, crit = [qq], z = null;
    if (A !== 0) { z = -B / A; crit.push(z); }
    crit.sort(function(x, y){ return x - y; });
    var bnd = [-Infinity].concat(crit, [Infinity]);
    for (var i = 0; i + 1 < bnd.length; i++) { var lo = bnd[i], hi = bnd[i + 1], t = lo === -Infinity ? hi - 1 : hi === Infinity ? lo + 1 : (lo + hi) / 2, s = (A * t + B) / (t - qq); if (sat(s > 0 ? 1 : s < 0 ? -1 : 0, sym)) ps.push({ a:lo, b:hi, aIn:false, bIn:false }); }
    if (incl(sym) && z !== null) ps.push({ a:z, b:z, aIn:true, bIn:true });
    return { pieces:iv.norm(ps), z:z };
  }
  function inter(p, a, b, aIn, bIn){ var lo = Math.max(p.a, a), hi = Math.min(p.b, b); var loIn = lo === p.a && lo === a ? p.aIn && aIn : lo === p.a ? p.aIn : aIn, hiIn = hi === p.b && hi === b ? p.bIn && bIn : hi === p.b ? p.bIn : bIn; if (lo > hi || (lo === hi && !(loIn && hiIn))) return null; return { a:lo, b:hi, aIn:loIn, bIn:hiIn }; }
  function checks(d){
    if (!d.valid) return [false, false, false, false];
    var R = solve(d).pieces, c2 = false;
    if (d.q !== -1) { var n2 = d.p - 1 + d.r + d.r * d.q, den = -1 - d.q; c2 = sat((n2 > 0 ? 1 : n2 < 0 ? -1 : 0) * (den > 0 ? 1 : -1), d.sym); }
    return [d.q === 2 && d.p !== -2, c2, R.some(function(p){ return p.a <= -1 && p.b >= 2; }), R.every(function(p){ return p.a >= -1 && (p.b < 2 || (p.b === 2 && !p.bIn)); })];
  }
  function tips(d, res){
    var T = api.content.tips, out = [], R = solve(d).pieces;
    if (!res[0]) out.push(T[0]);
    if (!res[1]) out.push(T[1]);
    if (!res[2]) {
      var miss = []; iv.complement(R).forEach(function(p){ var x = inter(p, -1, 2, false, false); if (x) miss.push(x); });
      if (miss.length) { var mp = miss[0], mv = mp.a === mp.b ? qn(mp.a) : qn((mp.a + mp.b) / 2); out.push(fill(T[2], { xm:m("x = " + qt(mv)) })); }
    }
    if (!res[3]) {
      var ex = []; R.forEach(function(p){ var x1 = inter(p, -Infinity, -1, false, false), x2 = inter(p, 2, Infinity, true, false); if (x1) ex.push(x1); if (x2) ex.push(x2); });
      ex.sort(function(x, y){ return x.a - y.a; });
      if (ex.length) { var e = ex[0], ev;
        if (e.a === e.b) ev = qn(e.a); else if (isFinite(e.a) && isFinite(e.b)) ev = qn((e.a + e.b) / 2);
        else if (e.a === -Infinity) ev = Q(e.bIn && Number.isInteger(e.b) ? e.b : Math.ceil(e.b) - 1); else ev = Q(e.aIn && Number.isInteger(e.a) ? e.a : Math.floor(e.a) + 1);
        out.push(fill(T[3], { xv:m("x = " + qt(ev)) })); }
    }
    return out;
  }
  function draw(){
    var d = read(), v = { xmin:-8, xmax:8, ymin:-8, ymax:8 };
    if (!d.valid) { plot.draw({ view:v, describe:"Empty graph. Enter whole numbers from −6 to 6 for p, q and r." }); drawStrip(nlp, { min:-8, max:8, target:[-1, 2], describe:"Number line with the target [−1, 2) outlined." }); return; }
    var R = solve(d), f = function(x){ return (x + d.p) / (x - d.q); }, asy = R.hole ? [] : [{ x:d.q }, { y:1 }];
    plot.draw({ view:v, asymptotes:asy, curves:[{ f:f, color:css("--pen"), width:3 }, { f:function(){ return d.r; }, color:css("--f3"), width:2.6 }],
      describe:"Graph of y = " + MV.plain(m(capMark(d).split(" " + d.sym)[0])) + " in blue and y = " + num(d.r) + " in teal. Solution set " + (R.pieces.length ? iv.text(R.pieces) : "empty") + ".",
      after:function(ctx, p){ R.pieces.forEach(function(pc){ if (pc.a !== pc.b) axisBand(p, pc.a, pc.b); }); if (R.hole) drawHole(p, d.q, 1, css("--pen"), 1, false); } });
    drawStrip(nlp, { min:-8, max:8, pieces:R.pieces, restr:R.hole ? [] : [d.q], target:[-1, 2], describe:"Number line: your solution set " + (R.pieces.length ? iv.text(R.pieces).replace(/∞/g, "infinity") : "is empty") + "; the target [−1, 2) is outlined above it." });
  }
  function cap(){ var d = read(), el = $("#tk-cap"); if (el) el.innerHTML = d.valid ? m(capMark(d)) : '<span class="muted">Fill in p, q and r.</span>'; }
  return {
    render:function(inp, pv, a){
      api = a; var S = a.S; if (S.p == null) { S.p = "3"; S.q = "1"; S.r = "2"; S.sym = "<"; }
      inp.innerHTML = '<div class="eq-cap tk-cap" id="tk-cap" aria-live="polite"></div><div class="tk-rows">' + ["p", "q", "r"].map(function(k){
        return '<div class="tk-row"><label for="tk-' + k + '">' + m(k) + ' =</label><button type="button" class="btn ghost sm tk-st" data-tk="' + k + '" data-d="-1" data-k="tk' + k + 'm" aria-label="Decrease ' + k + '">−</button><input class="numin tk-in" id="tk-' + k + '" data-tki="' + k + '" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(S[k]) + '"><button type="button" class="btn ghost sm tk-st" data-tk="' + k + '" data-d="1" data-k="tk' + k + 'p" aria-label="Increase ' + k + '">+</button></div>'; }).join("") + '</div><div class="tk-sym"></div>';
      pv.innerHTML = '<canvas class="plot" id="tk-plot" role="img" aria-label="Preview graph"></canvas><canvas class="plot ex-nl" id="tk-nl" role="img" aria-label="Number line"></canvas>';
      plot = new MV.Plot($("#tk-plot"), { xmin:-8, xmax:8, ymin:-8, ymax:8 }); nlp = new MV.Plot($("#tk-nl"), { xmin:-8, xmax:8, ymin:-1, ymax:1 });
      plot.render = draw; nlp.render = draw;
      MV.seg(inp.querySelector(".tk-sym"), { label:"Sign:", value:S.sym, options:["<", "≤", ">", "≥"].map(function(s){ return { id:s, t:s }; }), onChange:function(v){ S.sym = v; a.save(); cap(); draw(); a.update(); } });
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tki; if (!k) return; S[k] = e.target.value; a.save(); cap(); draw(); a.update(); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-tk]"); if (!b) return; var k = b.dataset.tk, v = MV.parseNum(S[k]), n = v && v.length === 1 && Number.isInteger(v[0]) ? v[0] : 0; n = Math.max(-6, Math.min(6, n + +b.dataset.d)); S[k] = String(n); $("#tk-" + k).value = num(n); a.save(); cap(); draw(); a.update(); });
      cap(); draw();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter a whole number from −6 to 6 in each box."; },
    checks:checks, tips:tips,
    key:function(d){ return [d.p, d.q, d.r, d.sym].join("|"); },
    label:function(k){ var s = k.split("|"); return m(capMark({ p:+s[0], q:+s[1], r:+s[2], sym:s[3] })); },
    text:function(k){ var s = k.split("|"); return MV.plain(m(capMark({ p:+s[0], q:+s[1], r:+s[2], sym:s[3] }))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ reverse:reverse },
  task:task
});
})();
