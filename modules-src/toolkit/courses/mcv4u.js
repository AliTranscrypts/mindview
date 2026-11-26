// MCV4U course helpers (toolkit/courses/mcv4u.js). The assembler adds this file to every MCV4U module, after the core.
// Usage:
//   Typesetting  inside MV.m() and `backticks`: ∛2 and ∛{x + 1} are cube roots with a bar (like √).
//                vec{AB} (two or more letters) gets a full-width arrow (class "vec wide", styled in mcv4u.css).
//   MV.mcv.rpow(x, p, q)   real x^(p/q) keeping the sign for odd q: rpow(-8, 1, 3) = -2, rpow(-1, 2, 3) = 1
//                          (Math.pow returns NaN there); NaN for even q with x < 0. For graphs of (x − 1)^(2/3) etc.
//   MV.mcv.Q   exact rationals {n, d} (d > 0, lowest terms): Q.of(3, 6) -> {n:1, d:2}; Q.add/sub/mul/div/neg/abs/eq/val;
//              Q.raw("−6/4") -> {n:-6, d:4} as typed (null if not an integer or a fraction; "−" alone -> −1, "+" -> 1);
//              Q.txt(q) plain "−2/3"; Q.src(q) m() source "-{2}/{3}".
//   MV.mcv.S   exact surd sums Σ c·ᵏ√r as arrays of terms {c:Q, r, k} (r reduced to square-/cube-free; r = 1, k = 1 is a
//              rational term; insertion order is kept, so expansions read the way you multiply):
//              S.of([[c, r, k], …]) (c a number or Q, r default 1, k default 2); S.add/sub/neg/scale/mul/eq/zero/rational/val;
//              S.tiles(A, B) -> [[S]] term-by-term products (area model); S.src(A) -> m() source "12 + 4√5";
//              S.over(N, D) -> {num, den} in lowest terms (D rational, den an integer > 0); S.fracSrc(N, D) -> "{2√5}/{3}";
//              S.parse("(2 + √2 − √6)/4") -> {num:[raw], den:[raw]} (raw terms as typed) and S.fromRaw(raw) -> S.
//   MV.mcv.exact.judge(entry, target)   V8 exact-answer judge. entry = {num:[raw], den:[raw]} with raw terms
//              {c:{n, d}, r, k} exactly as typed (r = 1, k = 1 for a plain number); target = {num:S, den:S}.
//              -> {value, equal, rational, simplified, issue, msg}; issue: "radical" (root left in the denominator),
//              "radicand" (√8, √9), "like" (like terms not combined), "fraction" (2/4, or fractions over a denominator),
//              "sign" (negative denominator), "common" (10√5/15); msg is a ready feedback sentence (m() markup in backticks).
//   MV.mcv.lim(sub)   HTML for "lim" with the approach written underneath, e.g. MV.mcv.lim("x -> 2^-") + MV.m(" f(x) = 5").
//              Screen readers hear "lim (x → 2⁻)". Styled by .lm-lim in mcv4u.css (promoted from modules 04/05).
//              MV.mcv.exact.same(rawA, rawB) compares two typed forms term by term in any order.
(function(){
"use strict";
var MV = window.MV; if (!MV) return;

// ---------- typesetting ----------
var baseM = MV.m, CUBE = "\u0001";
MV.m = function(s){
  s = String(s);
  var cube = s.indexOf("∛") >= 0, out = baseM(cube ? s.replace(/∛/g, CUBE + "√") : s);
  if (cube) out = out.split(CUBE + '<span class="rad"><span class="rs">√').join('<span class="rad"><span class="rs">∛').split(CUBE).join("");
  if (out.indexOf('class="vec"') >= 0) out = out.replace(/<span class="vec">((?:<i>[A-Za-z]<\/i>){2,})<\/span>/g, '<span class="vec wide">$1</span>');
  return out;
};

// ---------- real powers ----------
function rpow(x, p, q){
  q = q || 1;
  if (x < 0) { if (q % 2 === 0) return NaN; var r = -Math.pow(-x, 1 / q); return Math.pow(r, p); }
  return Math.pow(x, p / q);
}

// ---------- rationals ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
var Q = {
  of:function(n, d){
    if (n && typeof n === "object") return Q.of(n.n, n.d);
    if (d == null) d = 1;
    if (!Number.isInteger(n) || !Number.isInteger(d)) { var v = n / d; for (var k = 1; k <= 100000; k++) { var nn = Math.round(v * k); if (Math.abs(nn / k - v) < 1e-12 * Math.max(1, Math.abs(v))) return Q.of(nn, k); } return null; }
    if (!d) return null;
    var g = gcd(n, d) || 1; if (d < 0) g = -g;
    return { n:n / g + 0, d:d / g };
  },
  add:function(a, b){ return Q.of(a.n * b.d + b.n * a.d, a.d * b.d); },
  sub:function(a, b){ return Q.of(a.n * b.d - b.n * a.d, a.d * b.d); },
  mul:function(a, b){ return Q.of(a.n * b.n, a.d * b.d); },
  div:function(a, b){ return Q.of(a.n * b.d, a.d * b.n); },
  neg:function(a){ return { n:-a.n + 0, d:a.d }; },
  abs:function(a){ return { n:Math.abs(a.n), d:a.d }; },
  eq:function(a, b){ return a.n * b.d === b.n * a.d; },
  val:function(a){ return a.n / a.d; },
  raw:function(str){
    var s = String(str == null ? "" : str).replace(/−/g, "-").replace(/\s+/g, "");
    if (s === "-") return { n:-1, d:1 };
    if (s === "+") return { n:1, d:1 };
    var mm = /^([+-]?)(\d+)(?:\/(\d+))?$/.exec(s);
    if (!mm) return null;
    var d = mm[3] ? parseInt(mm[3], 10) : 1; if (!d) return null;
    return { n:(mm[1] === "-" ? -1 : 1) * parseInt(mm[2], 10), d:d };
  },
  txt:function(q){ return (q.n < 0 ? "−" : "") + Math.abs(q.n) + (q.d > 1 ? "/" + q.d : ""); },
  src:function(q){ return q.d === 1 ? String(q.n) : (q.n < 0 ? "-" : "") + "{" + Math.abs(q.n) + "}/{" + q.d + "}"; }
};

// ---------- surd sums ----------
// r = s^k · f with f k-th-power free  ->  [s, f]
function kfree(r, k){
  var s = 1, f = r;
  for (var p = 2; Math.pow(p, k) <= f; p++) { var pk = Math.pow(p, k); while (f % pk === 0) { f /= pk; s *= p; } }
  return [s, f];
}
function term(c, r, k){
  c = Q.of(c); r = r == null ? 1 : r; k = k || 2;
  if (!r || !c || !c.n) return null;
  var sf = kfree(r, k);
  c = Q.mul(c, Q.of(sf[0]));
  return { c:c, r:sf[1], k:sf[1] === 1 ? 1 : k };
}
function rootVal(t){ return t.k === 1 ? 1 : t.k === 3 ? Math.cbrt(t.r) : Math.sqrt(t.r); }
var S = {
  norm:function(list){
    var out = [];
    list.forEach(function(t){
      if (!t || !t.c.n) return;
      var o = out.filter(function(x){ return x.r === t.r && x.k === t.k; })[0];
      if (o) o.c = Q.add(o.c, t.c); else out.push({ c:t.c, r:t.r, k:t.k });
    });
    return out.filter(function(t){ return t.c.n !== 0; });
  },
  of:function(list){ return S.norm(list.map(function(t){ return Array.isArray(t) ? term(t[0], t[1], t[2]) : term(t.c, t.r, t.k); })); },
  add:function(A, B){ return S.norm(A.concat(B)); },
  neg:function(A){ return A.map(function(t){ return { c:Q.neg(t.c), r:t.r, k:t.k }; }); },
  sub:function(A, B){ return S.add(A, S.neg(B)); },
  scale:function(A, q){ q = Q.of(q); return S.norm(A.map(function(t){ return { c:Q.mul(t.c, q), r:t.r, k:t.k }; })); },
  mulT:function(a, b){
    if (a.k === 1) return term(Q.mul(a.c, b.c), b.r, b.k || 2);
    if (b.k === 1) return term(Q.mul(a.c, b.c), a.r, a.k);
    if (a.k !== b.k) return null;
    return term(Q.mul(a.c, b.c), a.r * b.r, a.k);
  },
  tiles:function(A, B){ return A.map(function(a){ return B.map(function(b){ return S.norm([S.mulT(a, b)]); }); }); },
  mul:function(A, B){ var out = []; A.forEach(function(a){ B.forEach(function(b){ out.push(S.mulT(a, b)); }); }); return S.norm(out); },
  val:function(A){ return A.reduce(function(s, t){ return s + Q.val(t.c) * rootVal(t); }, 0); },
  zero:function(A){ return !A.length; },
  eq:function(A, B){ return !S.sub(A, B).length; },
  rational:function(A){ return A.every(function(t){ return t.k === 1; }); },
  ratQ:function(A){ return A.reduce(function(s, t){ return t.k === 1 ? Q.add(s, t.c) : s; }, { n:0, d:1 }); },
  // m() source; o.plusFirst writes a leading "+" (area-model tiles)
  src:function(A, o){
    o = o || {};
    if (!A.length) return "0";
    return A.map(function(t, i){
      var a = Q.abs(t.c), neg = t.c.n < 0, root = t.k === 1 ? "" : (t.k === 3 ? "∛" : "√") + t.r, body;
      if (t.k === 1) body = a.d === 1 ? String(a.n) : "{" + a.n + "}/{" + a.d + "}";
      else if (a.n === 1 && a.d === 1) body = root;
      else if (a.d === 1) body = a.n + root;
      else body = "{" + (a.n === 1 ? "" : a.n) + root + "}/{" + a.d + "}";
      return (i === 0 ? (neg ? "-" : (o.plusFirst ? "+" : "")) : (neg ? " - " : " + ")) + body;
    }).join("");
  },
  over:function(N, D){
    var q = S.ratQ(D); if (!q.n) return null;
    var C = S.scale(N, Q.div({ n:1, d:1 }, q)), L = 1;
    C.forEach(function(t){ L = L / gcd(L, t.c.d) * t.c.d; });
    return { num:C.map(function(t){ return { c:Q.of(t.c.n * (L / t.c.d)), r:t.r, k:t.k }; }), den:L };
  },
  fracSrc:function(N, D){ var o = S.over(N, D); if (!o) return null; return o.den === 1 ? S.src(o.num) : "{" + S.src(o.num) + "}/{" + o.den + "}"; },
  // "15√5", "√2/2", "10√5/15", "(8 − 4√3)/8", "(√2 + √6 − 2)/(4 + 2√6)", "∛4/2" -> {num:[raw], den:[raw]}
  parse:function(str){
    var s = String(str).replace(/−/g, "-").replace(/\s+/g, ""), top, bot = "1", i;
    function close(at){ var d = 0; for (var j = at; j < s.length; j++) { if (s[j] === "(") d++; else if (s[j] === ")") { d--; if (!d) return j; } } return -1; }
    if (s[0] === "(") { i = close(0); top = s.slice(1, i); if (s[i + 1] === "/") bot = s.slice(i + 2); else if (i !== s.length - 1) return null; }
    else { i = s.indexOf("/"); top = i < 0 ? s : s.slice(0, i); if (i >= 0) bot = s.slice(i + 1); }
    if (bot[0] === "(" && bot[bot.length - 1] === ")") bot = bot.slice(1, -1);
    var a = S.terms(top), b = S.terms(bot);
    return a && b ? { num:a, den:b } : null;
  },
  terms:function(s){
    var out = [], i = 0;
    while (i < s.length) {
      var sg = 1;
      if (s[i] === "+" || s[i] === "-") { sg = s[i] === "-" ? -1 : 1; i++; }
      var d = /^\d*/.exec(s.slice(i))[0]; i += d.length;
      var k = 1, r = 1;
      if (s[i] === "√" || s[i] === "∛") { k = s[i] === "∛" ? 3 : 2; i++; var rr = /^\d+/.exec(s.slice(i)); if (!rr) return null; r = +rr[0]; i += rr[0].length; }
      else if (!d) return null;
      out.push({ c:{ n:sg * (d ? +d : 1), d:1 }, r:r, k:k });
    }
    return out.length ? out : null;
  },
  fromRaw:function(raw){ return S.norm(raw.map(function(t){ return term(Q.of(t.c.n, t.c.d), t.r, t.k === 1 ? 2 : t.k); })); }
};

// ---------- V8 judge ----------
function rawVal(raw){ return raw.reduce(function(s, t){ return s + t.c.n / t.c.d * (t.k === 1 || t.r === 1 ? 1 : t.k === 3 ? Math.cbrt(t.r) : Math.sqrt(t.r)); }, 0); }
function close(a, b){ return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)); }
function rootTxt(t){ return (t.k === 3 ? "∛" : "√") + t.r; }
var exact = {
  value:function(entry){ var d = rawVal(entry.den); return d ? rawVal(entry.num) / d : NaN; },
  same:function(A, B){
    function key(list){ return list.map(function(t){ var c = Q.of(t.c.n, t.c.d); return c.n + "/" + c.d + "|" + (t.k === 1 ? 1 : t.r) + "|" + (t.r === 1 ? 1 : t.k); }).sort().join(";"); }
    return key(A.num) === key(B.num) && key(A.den) === key(B.den);
  },
  judge:function(entry, target){
    var dv = rawVal(entry.den), tv = S.val(target.num) / S.val(target.den);
    var R = { value:dv ? rawVal(entry.num) / dv : NaN, equal:false, rational:true, simplified:false, issue:null, msg:"" };
    if (!dv) { R.issue = "zero"; R.msg = "The denominator can’t be 0."; return R; }
    R.equal = close(R.value, tv);
    R.rational = entry.den.every(function(t){ return t.k === 1 || t.r === 1; });
    if (!R.equal) return R;
    var all = entry.num.concat(entry.den), i, t;
    if (!R.rational) { R.issue = "radical"; R.msg = "Same value, but there’s still a root in the denominator. Rationalize it."; return R; }
    for (i = 0; i < all.length; i++) {
      t = all[i]; if (t.k === 1) continue;
      var sf = kfree(t.r, t.k), rt = rootTxt(t);
      if (t.r === 1) { R.issue = "radicand"; R.msg = "`" + rt + " = 1`: write it without the root."; return R; }
      if (sf[0] > 1) { R.issue = "radicand"; R.msg = sf[1] === 1 ? "`" + rt + " = " + sf[0] + "`: write it without the root." : "`" + rt + "` can be simplified: `" + rt + " = " + sf[0] + (t.k === 3 ? "∛" : "√") + sf[1] + "`."; return R; }
    }
    function dup(list){ var seen = {}; return list.some(function(t){ var kk = t.k === 1 || t.r === 1 ? "1" : t.k + "|" + t.r; if (seen[kk]) return true; seen[kk] = 1; return false; }); }
    if (dup(entry.num) || dup(entry.den)) { R.issue = "like"; R.msg = "Combine like terms."; return R; }
    for (i = 0; i < all.length; i++) { t = all[i]; if (t.c.d > 1 && gcd(t.c.n, t.c.d) > 1) { var q = Q.of(t.c.n, t.c.d); R.issue = "fraction"; R.msg = "Reduce " + Math.abs(t.c.n) + "/" + t.c.d + " to " + Math.abs(q.n) + (q.d > 1 ? "/" + q.d : "") + "."; return R; } }
    var den = entry.den.length === 1 ? entry.den[0] : null, dq = den ? Q.of(den.c.n, den.c.d) : null;
    if (!den || entry.den.some(function(x){ return x.c.d > 1; }) || (entry.num.some(function(x){ return x.c.d > 1; }) && !(dq.n === 1 && dq.d === 1))) { R.issue = "fraction"; R.msg = "Use one whole-number denominator."; return R; }
    if (den.c.n < 0) { R.issue = "sign"; R.msg = "Move the minus sign from the denominator to the top."; return R; }
    if (entry.num.every(function(x){ return x.c.d === 1; }) && den.c.n > 1) {
      var g = entry.num.reduce(function(a, x){ return gcd(a, x.c.n); }, den.c.n);
      if (g > 1) {
        R.issue = "common";
        R.msg = entry.num.length === 1 ? "Simplify " + Math.abs(entry.num[0].c.n) + "/" + den.c.n + " = " + Math.abs(entry.num[0].c.n) / g + (den.c.n / g > 1 ? "/" + den.c.n / g : "") + "."
          : "Every term on top shares a factor of " + g + " with the denominator: divide them all by " + g + ".";
        return R;
      }
    }
    R.simplified = true;
    return R;
  }
};

function lim(sub){ return '<span class="lm-lim"><span class="lm-lt">lim</span><span class="vh"> (</span><span class="lm-lu">' + MV.m(sub) + '</span><span class="vh">)</span></span>'; }
MV.mcv = { rpow:rpow, gcd:gcd, kfree:kfree, Q:Q, S:S, exact:exact, lim:lim };
})();
