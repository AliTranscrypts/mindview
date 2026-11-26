// SBI4U course helpers (toolkit/courses/sbi4u.js). The assembler adds this file to every SBI4U module, after the core.
// Usage:
//   MV.bio.chem("6CO2 + 6H2O -> C6H12O6 + 6O2")  -> "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂"   plain Unicode, so it is safe in SVG <text>,
//        canvas fillText, aria-labels and summary text. Rules:
//          digits right after a letter or ")" become subscripts; a leading coefficient stays full size ("2H2O" -> 2H₂O);
//          "^" + digits and/or a sign is a superscript: "Ca^2+" -> Ca²⁺, "NAD^+" -> NAD⁺, "^18O2" -> ¹⁸O₂, "^14C" -> ¹⁴C;
//          a bare + or - stuck to the end of a formula is a charge: "H+" -> H⁺, "Cl-" -> Cl⁻, "e-" -> e⁻, "Ca2+" -> Ca²⁺
//          ("A + B" with spaces stays a plus); "_i" -> ᵢ (P_i -> Pᵢ); "->" -> →; "<=>" -> ⇌.
//   MV.bio.chemHTML(s)  the same, with <sub>/<sup> elements instead of Unicode (for long running text).
//   MV.bio.tok(formula, token)  -> '<span class="bio-tok" style="--tok:var(--bio-carbon)">CO₂</span>' (token default "--ink").
//   MV.bio.rng(seed)  repeatable random numbers (mulberry32). seed: a number or a string. r = MV.bio.rng("leaf");
//        r() -> [0, 1);  r.int(n) -> 0 … n − 1;  r.range(a, b) -> [a, b);  r.pick(array).
//        Same seed, same sequence on every device: use it for decorative particles and model-data runs, so simulations stay
//        deterministic (course plan §4: same settings, same numbers).
(function(){
"use strict";
var MV = window.MV; if (!MV) return;
var SUB = { "0":"₀", "1":"₁", "2":"₂", "3":"₃", "4":"₄", "5":"₅", "6":"₆", "7":"₇", "8":"₈", "9":"₉" };
var SUP = { "0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "+":"⁺", "-":"⁻", "−":"⁻" };
function map(t, tbl){ return t.split("").map(function(c){ return tbl[c] || c; }).join(""); }
function chem(s){
  s = String(s == null ? "" : s).replace(/<=>/g, "⇌").replace(/->/g, "→");
  s = s.replace(/\^([0-9]*[+\-−]?)/g, function(m, g){ return map(g, SUP); });
  s = s.replace(/([A-Za-z\)₀-₉])([0-9]?)([+\-−])(?=\s|$|[,.;:)\]])/g, function(m, a, d, sg){ return a + map(d + sg, SUP); });
  s = s.replace(/_i\b/g, "ᵢ").replace(/_([0-9]+)/g, function(m, d){ return map(d, SUB); });
  return s.replace(/([A-Za-z\)\]])([0-9]+)/g, function(m, a, d){ return a + map(d, SUB); });
}
var UNSUB = {}, UNSUP = {};
Object.keys(SUB).forEach(function(k){ UNSUB[SUB[k]] = k; }); UNSUB["ᵢ"] = "i";
Object.keys(SUP).forEach(function(k){ if (k !== "-") UNSUP[SUP[k]] = k; }); UNSUP["⁻"] = "−";
function chemHTML(s){
  return chem(s).replace(/[₀-₉ᵢ]+/g, function(m){ return "<sub>" + map(m, UNSUB) + "</sub>"; })
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/g, function(m){ return "<sup>" + map(m, UNSUP) + "</sup>"; });
}
function rng(seed){
  var h = 1779033703;
  if (typeof seed === "number") h = (seed * 2654435761) >>> 0;
  else { var str = String(seed == null ? "" : seed); for (var i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } }
  var a = h >>> 0;
  var r = function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  r.int = function(n){ return Math.floor(r() * n); };
  r.range = function(lo, hi){ return lo + r() * (hi - lo); };
  r.pick = function(arr){ return arr[Math.floor(r() * arr.length)]; };
  r.seed = seed;
  return r;
}
MV.bio = {
  chem:chem, chemHTML:chemHTML, rng:rng,
  tok:function(f, token){ return '<span class="bio-tok" style="--tok:var(' + (token || "--ink") + ')">' + chem(f) + "</span>"; }
};
})();
