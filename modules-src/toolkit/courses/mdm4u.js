// MDM4U course helpers (toolkit/courses/mdm4u.js). The assembler adds this file to every MDM4U module, after the core.
// Usage:
//   MV.mdm.fact(n), MV.mdm.nPr(n, r), MV.mdm.nCr(n, r)
//        exact counts, worked out with BigInt. They return a Number when the result is at most Number.MAX_SAFE_INTEGER,
//        otherwise a BigInt (52! and the like); nPr/nCr give 0 when r > n; null for negative or non-integer input.
//        MV.mdm.factB / nPrB / nCrB always return a BigInt.
//   MV.mdm.fmt(v)   a whole Number or BigInt with thin-space thousands from 10 000 up (2598960 -> "2 598 960"), true minus.
//   MV.mdm.frac     exact fractions {n, d} with whole-number n and d, d > 0, lowest terms:
//        frac.of(n, d) | frac.of(0.25) (decimals become exact fractions) ; add / sub / mul / div / comp (1 − f) / eq / cmp / val
//        frac.txt(f) "5/12" (true minus, no spaces)   frac.src(f) MV.m() source "{5}/{12}" (stacked; whole numbers stay whole)
//        frac.parse("15/36" | "0.25" | "−3" | "25%") -> {n, d} as typed value, or null    frac.dec(f, dp = 4) "0.4167" (zeros trimmed)
//        frac.prob(n, d, {dec:true}) readout text "6/36 = 1/6 ≈ 0.1667": the count fraction, then lowest terms, then a 4-place
//        decimal ("=" when that decimal is exact: "9/36 = 1/4 = 0.25"; {dec:false} drops it: "30/36 = 5/6").
//   MV.mdm.seededRandom(seed)   repeatable random numbers (mulberry32). seed: a number or a string. r = seededRandom("x");
//        r() -> [0, 1);  r.int(n) -> 0 … n − 1;  r.pick(weights) -> index i with probability weights[i] ÷ Σ weights;  r.seed.
//        Same seed, same sequence on every device: use it for "Repeatable run" switches and model-data runs (D6).
(function(){
"use strict";
var MV = window.MV; if (!MV) return;
var MINUS = "−";

// ---------- counting ----------
function okInt(n){ return typeof n === "number" ? Number.isInteger(n) && n >= 0 : typeof n === "bigint" && n >= 0n; }
function factB(n){ if (!okInt(n)) return null; var r = 1n; for (var k = 2n; k <= BigInt(n); k++) r *= k; return r; }
function nPrB(n, r){ if (!okInt(n) || !okInt(r)) return null; n = BigInt(n); r = BigInt(r); if (r > n) return 0n; var out = 1n; for (var k = n - r + 1n; k <= n; k++) out *= k; return out; }
function nCrB(n, r){ if (!okInt(n) || !okInt(r)) return null; n = BigInt(n); r = BigInt(r); if (r > n) return 0n; if (r > n - r) r = n - r; var out = 1n; for (var k = 1n; k <= r; k++) out = out * (n - r + k) / k; return out; }
function small(b){ return b == null ? null : (b <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(b) : b); }
function fmt(v){
  var neg = typeof v === "bigint" ? v < 0n : v < 0, s = String(typeof v === "bigint" ? (neg ? -v : v) : Math.abs(Math.round(v)));
  if (s.length > 4) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (neg ? MINUS : "") + s;
}

// ---------- exact fractions ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
var frac = {
  of:function(n, d){
    if (n && typeof n === "object") return frac.of(n.n, n.d);
    if (d == null) d = 1;
    if (!Number.isInteger(n) || !Number.isInteger(d)) {
      var v = n / d; if (!isFinite(v)) return null;
      for (var k = 1; k <= 1000000; k *= 10) { var m = Math.round(v * k); if (Math.abs(m / k - v) < 1e-12 * Math.max(1, Math.abs(v))) return frac.of(m, k); }
      return null;
    }
    if (!d) return null;
    var g = gcd(n, d) || 1; if (d < 0) g = -g;
    return { n:n / g + 0, d:d / g };
  },
  add:function(a, b){ return frac.of(a.n * b.d + b.n * a.d, a.d * b.d); },
  sub:function(a, b){ return frac.of(a.n * b.d - b.n * a.d, a.d * b.d); },
  mul:function(a, b){ return frac.of(a.n * b.n, a.d * b.d); },
  div:function(a, b){ return frac.of(a.n * b.d, a.d * b.n); },
  comp:function(a){ return frac.of(a.d - a.n, a.d); },
  eq:function(a, b){ return !!a && !!b && a.n * b.d === b.n * a.d; },
  cmp:function(a, b){ return a.n * b.d - b.n * a.d; },
  val:function(a){ return a.n / a.d; },
  txt:function(a){ a = frac.of(a); return (a.n < 0 ? MINUS : "") + fmt(Math.abs(a.n)) + (a.d === 1 ? "" : "/" + fmt(a.d)); },
  src:function(a){ a = frac.of(a); return a.d === 1 ? String(a.n) : (a.n < 0 ? "-" : "") + "{" + Math.abs(a.n) + "}/{" + a.d + "}"; },
  parse:function(raw){
    var s = String(raw == null ? "" : raw).trim().replace(/−/g, "-").replace(/\s+/g, "");
    var pct = /%$/.test(s); if (pct) s = s.slice(0, -1);
    var m = /^([+-]?\d+)\/([+-]?\d+)$/.exec(s), f = null;
    if (m) f = frac.of(parseInt(m[1], 10), parseInt(m[2], 10));
    else if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) { var parts = s.replace(/^[+-]/, "").split("."), dp = parts[1] ? parts[1].length : 0; f = frac.of((s[0] === "-" ? -1 : 1) * parseInt(parts.join("") || "0", 10), Math.pow(10, dp)); }
    if (f && pct) f = frac.of(f.n, f.d * 100);
    return f;
  },
  dec:function(a, dp){
    dp = dp == null ? 4 : dp; var v = frac.val(frac.of(a)), p = Math.pow(10, dp), r = Math.round(v * p) / p;
    var s = r.toFixed(dp).replace(/\.?0+$/, ""); if (s === "-0") s = "0";
    return s.replace("-", MINUS);
  },
  exactDec:function(a, dp){ a = frac.of(a); var p = Math.pow(10, dp == null ? 4 : dp); return Number.isInteger(a.n * p / a.d) || Math.abs(a.n * p / a.d - Math.round(a.n * p / a.d)) < 1e-9; },
  prob:function(n, d, o){
    o = o || {};
    var f = frac.of(n, d), raw = fmt(n) + "/" + fmt(d), out = raw;
    if (f.d !== d || f.n !== n) out += " = " + frac.txt(f);
    if (o.dec !== false && f.d !== 1) out += (frac.exactDec(f, 4) ? " = " : " ≈ ") + frac.dec(f, 4);
    return out;
  }
};

// ---------- seeded random numbers ----------
function seedOf(s){ if (typeof s === "number" && isFinite(s)) return s >>> 0; return parseInt((MV._fnv || function(x){ return String(x.length); })(String(s)), 16) >>> 0; }
function seededRandom(seed){
  var a = seedOf(seed);
  var r = function(){ a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  r.seed = seedOf(seed);
  r.int = function(n){ return Math.floor(r() * n); };
  r.pick = function(w){ var tot = 0, i; for (i = 0; i < w.length; i++) tot += w[i]; var u = r() * tot; for (i = 0; i < w.length; i++) { u -= w[i]; if (u < 0) return i; } return w.length - 1; };
  return r;
}

MV.mdm = {
  fact:function(n){ return small(factB(n)); }, nPr:function(n, r){ return small(nPrB(n, r)); }, nCr:function(n, r){ return small(nCrB(n, r)); },
  factB:factB, nPrB:nPrB, nCrB:nCrB, fmt:fmt, frac:frac, seededRandom:seededRandom
};
})();
