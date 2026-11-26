// MindView module toolkit: helpers (K1), math typesetting (N3), interval notation, answer decoding.
(function(){
"use strict";
var MV = window.MV = window.MV || {};
var MINUS = "−";
MV.MINUS = MINUS;
MV.reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
MV.$ = function(s, r){ return (r || document).querySelector(s); };
MV.$$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
MV.css = function(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); };
MV.cap = function(s){ return s.charAt(0).toUpperCase() + s.slice(1); };
MV.esc = function(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };

// Number with true minus, rounded to dp decimals (default 3); thousands get a space from 10 000 up.
MV.num = function(v, dp){
  if (v === Infinity) return "∞";
  if (v === -Infinity) return MINUS + "∞";
  var p = Math.pow(10, dp == null ? 3 : dp), r = Math.round(v * p) / p;
  if (Object.is(r, -0)) r = 0;
  var s = String(Math.abs(r)), parts = s.split(".");
  if (parts[0].length > 4) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  s = parts.join(".");
  return (r < 0 ? MINUS : "") + s;
};
// Fraction text for a rational value (e.g. 0.5 -> "1/2"), falling back to num().
MV.frac = function(v, maxDen){
  maxDen = maxDen || 12;
  for (var d = 1; d <= maxDen; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return d === 1 ? MV.num(n) : (n < 0 ? MINUS : "") + Math.abs(n) + "/" + d; }
  return MV.num(v);
};

// ---------- math markup: m("y = ax^n") ----------
// Syntax inside m() (and inside `backticks` in content strings):
//   x^2  x^{n+1}  x_1  log_{2}  {num}/{den} (stacked)  √3  √{x+1}  @a{a} (parameter colour a|n|k|d|c|b|t)
//   vec{u} (over-arrow)   hyphen -> true minus   function names upright   -> becomes →   <= >= != become ≤ ≥ ≠
var WORDS = { sin:1, cos:1, tan:1, csc:1, sec:1, cot:1, log:1, ln:1, exp:1, lim:1, max:1, min:1, arcsin:1, arccos:1, arctan:1,
  and:1, or:1, if:1, not:1, mod:1, gcd:1, lcm:1, det:1, proj:1, undefined:1, for:1, of:1, is:1, the:1, to:1, in:1, as:1,
  where:1, all:1, real:1, otherwise:1, nPr:1, nCr:1, mol:1, kg:1, cm:1, mm:1, km:1, kJ:1, J:0, mL:1, s:0, m:0, deg:1, rad:1, Var:1, SD:1, IQR:1, Med:1 };
MV.mathWords = WORDS;
function escTxt(s){ return s.replace(/&(?![a-z#0-9]+;)/gi, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function letters(t){
  return t.split(/(&[a-z#0-9]+;)/i).map(function(part, i){ return i % 2 ? part : lettersPlain(part); }).join("");
}
function lettersPlain(t){
  return t.replace(/[A-Za-z]+/g, function(w){
    if (WORDS[w] === 1) return '<span class="fnm">' + w + "</span>";
    return w.replace(/[A-Za-z]/g, "<i>$&</i>");
  });
}
// Read a {...} group starting at s[i] === "{"; returns [inner, nextIndex].
function group(s, i){
  var depth = 0, j = i;
  for (; j < s.length; j++) { if (s[j] === "{") depth++; else if (s[j] === "}") { depth--; if (depth === 0) break; } }
  return [s.slice(i + 1, j), j + 1];
}
// Read one token for ^ _ √: a {group}, a run of digits/decimal, a single letter, or a signed number.
function token(s, i){
  if (s[i] === "{") return group(s, i);
  var m = /^([\-−]?[0-9.]+|[\-−]?[A-Za-z½θπαβ∞]|[−\-])/.exec(s.slice(i));
  if (!m) return ["", i];
  return [m[1], i + m[1].length];
}
function inner(s){
  var out = "", i = 0, buf = "";
  function flush(){ if (buf) { out += letters(escTxt(buf).replace(/-/g, MINUS)); buf = ""; } }
  while (i < s.length) {
    var c = s[i], g;
    if (c === "{") {
      g = group(s, i);
      if (s[g[1]] === "/" && s[g[1] + 1] === "{") {
        var g2 = group(s, g[1] + 1);
        flush(); out += '<span class="frac"><span class="fn">' + inner(g[0]) + '</span><span class="fd">' + inner(g2[0]) + "</span></span>";
        i = g2[1]; continue;
      }
      // a literal set brace such as {x ∈ ℝ | x ≥ 0}: keep the braces, typeset the inside
      flush(); out += "{" + inner(g[0]) + "}";
      i = g[1]; continue;
    }
    if (c === "^" || c === "_") {
      g = token(s, i + 1);
      flush(); out += (c === "^" ? "<sup>" : "<sub>") + inner(g[0]) + (c === "^" ? "</sup>" : "</sub>");
      i = g[1]; continue;
    }
    if (c === "√") {
      g = token(s, i + 1);
      flush(); out += '<span class="rad"><span class="rs">√</span><span class="rb">' + inner(g[0]) + "</span></span>";
      i = g[1]; continue;
    }
    if (c === "@" && /[ankdcbt]/.test(s[i + 1] || "") && s[i + 2] === "{") {
      g = group(s, i + 2);
      flush(); out += '<span class="p-' + s[i + 1] + '">' + inner(g[0]) + "</span>";
      i = g[1]; continue;
    }
    if (s.substr(i, 4) === "vec{") {
      g = group(s, i + 3);
      flush(); out += '<span class="vec">' + inner(g[0]) + "</span>";
      i = g[1]; continue;
    }
    if (s.substr(i, 2) === "->") { flush(); out += '<span class="ar">→</span>'; i += 2; continue; }
    if (c === "→") { flush(); out += '<span class="ar">→</span>'; i++; continue; }
    if (s.substr(i, 2) === "<=") { buf += "≤"; i += 2; continue; }
    if (s.substr(i, 2) === ">=") { buf += "≥"; i += 2; continue; }
    if (s.substr(i, 2) === "!=") { buf += "≠"; i += 2; continue; }
    buf += c; i++;
  }
  flush();
  return out;
}
MV.m = function(s){ return '<span class="m">' + inner(String(s)) + "</span>"; };
// Process `math` spans inside an HTML string.
MV.md = function(h){
  if (typeof h !== "string" || h.indexOf("`") < 0) return h;
  return h.replace(/`([^`]+)`/g, function(_, x){ return MV.m(x); });
};

// Plain text from toolkit HTML (for the copy summary, aria labels): sup/sub digits become Unicode, fractions a/b.
var SUP = { "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","−":"⁻","-":"⁻","+":"⁺","n":"ⁿ" };
var SUB = { "0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉" };
function mapChars(t, tbl, fb){ var ok = true, o = ""; for (var i = 0; i < t.length; i++) { if (tbl[t[i]]) o += tbl[t[i]]; else { ok = false; break; } } return ok ? o : fb(t); }
MV.plain = function(h){
  if (h == null) return "";
  var d = document.createElement("div"); d.innerHTML = String(h);
  function walk(n){
    if (n.nodeType === 3) return n.nodeValue;
    if (n.nodeType !== 1) return "";
    var tag = n.tagName, cls = n.className || "";
    if (tag === "BR") return " ";
    var t = Array.prototype.map.call(n.childNodes, walk).join("");
    if (tag === "SUP") return mapChars(t, SUP, function(x){ return "^(" + x + ")"; });
    if (tag === "SUB") return mapChars(t, SUB, function(x){ return "_" + x; });
    if (/\bfrac\b/.test(cls)) { var a = walk(n.children[0]), b = walk(n.children[1]); var w = function(x){ return /^[\w−.]+$/.test(x) ? x : "(" + x + ")"; }; return w(a) + "/" + w(b); }
    if (/\brb\b/.test(cls)) return t.length > 1 ? "(" + t + ")" : t;
    if (/\bvec\b/.test(cls)) return t + "⃗";
    if (tag === "P" || tag === "DIV" || tag === "LI") return t + " ";
    return t;
  }
  return walk(d).replace(/\s+/g, " ").trim();
};
MV.stripTags = MV.plain;

// ---------- interval notation helpers (N3) ----------
// A piece is { a, b, aIn, bIn } with a/b possibly -Infinity / Infinity. Pieces are sorted and merged by norm().
var INF = "∞";
function ivNum(v){ return v === -Infinity ? MINUS + INF : v === Infinity ? INF : MV.num(v); }
MV.iv = {
  norm: function(pieces){
    var ps = pieces.filter(function(p){ return p && (p.a < p.b || (p.a === p.b && p.aIn && p.bIn)); })
      .map(function(p){ return { a:p.a, b:p.b, aIn:p.a === -Infinity ? false : !!p.aIn, bIn:p.b === Infinity ? false : !!p.bIn }; })
      .sort(function(x, y){ return x.a - y.a || (y.aIn - x.aIn); });
    var out = [];
    ps.forEach(function(p){
      var L = out[out.length - 1];
      if (L && (p.a < L.b || (p.a === L.b && (L.bIn || p.aIn)))) {
        if (p.b > L.b) { L.b = p.b; L.bIn = p.bIn; } else if (p.b === L.b) L.bIn = L.bIn || p.bIn;
      } else out.push({ a:p.a, b:p.b, aIn:p.aIn, bIn:p.bIn });
    });
    return out;
  },
  text: function(pieces){
    var ps = MV.iv.norm(pieces);
    if (!ps.length) return "∅";
    return ps.map(function(p){
      if (p.a === p.b) return "{" + ivNum(p.a) + "}";
      return (p.aIn ? "[" : "(") + ivNum(p.a) + ", " + ivNum(p.b) + (p.bIn ? "]" : ")");
    }).join(" ∪ ");
  },
  // inequality form, e.g. "−2 < x ≤ 5", "x ≤ −3 or x > 1", "x ≠ 2", "every real number"
  ineq: function(pieces, v){
    v = v || "x";
    var ps = MV.iv.norm(pieces);
    if (!ps.length) return "no real number";
    if (ps.length === 1 && ps[0].a === -Infinity && ps[0].b === Infinity) return "every real number";
    if (ps.length === 2 && ps[0].a === -Infinity && ps[1].b === Infinity && ps[0].b === ps[1].a && !ps[0].bIn && !ps[1].aIn) return v + " ≠ " + ivNum(ps[0].b);
    return ps.map(function(p){
      if (p.a === p.b) return v + " = " + ivNum(p.a);
      if (p.a === -Infinity) return v + (p.bIn ? " ≤ " : " < ") + ivNum(p.b);
      if (p.b === Infinity) return v + (p.aIn ? " ≥ " : " > ") + ivNum(p.a);
      return ivNum(p.a) + (p.aIn ? " ≤ " : " < ") + v + (p.bIn ? " ≤ " : " < ") + ivNum(p.b);
    }).join(" or ");
  },
  set: function(pieces, v){
    v = v || "x";
    var ps = MV.iv.norm(pieces);
    if (ps.length === 1 && ps[0].a === -Infinity && ps[0].b === Infinity) return "{" + v + " ∈ ℝ}";
    return "{" + v + " ∈ ℝ | " + MV.iv.ineq(pieces, v) + "}";
  },
  complement: function(pieces){
    var ps = MV.iv.norm(pieces), out = [], cur = -Infinity, curIn = false;
    ps.forEach(function(p){
      if (p.a > cur || (p.a === cur && !p.aIn && curIn)) out.push({ a:cur, b:p.a, aIn:curIn, bIn:!p.aIn });
      else if (p.a === cur && !p.aIn && !curIn && cur !== -Infinity) out.push({ a:cur, b:cur, aIn:true, bIn:true });
      cur = p.b; curIn = !p.bIn;
    });
    if (cur < Infinity) out.push({ a:cur, b:Infinity, aIn:curIn, bIn:false });
    return MV.iv.norm(out);
  },
  contains: function(pieces, x){
    return MV.iv.norm(pieces).some(function(p){ return (x > p.a || (x === p.a && p.aIn)) && (x < p.b || (x === p.b && p.bIn)); });
  },
  equal: function(p1, p2){ return MV.iv.text(p1) === MV.iv.text(p2); },
  num: ivNum
};

// ---------- safe number parsing (N4) ----------
// Accepts 3, -2.5, −2.5, 3/4, -3/4, 2π, 2π/3, π/6, √2, 2√3, √2/2, 1/√3, 1e3, ±2 (returns two values). Returns array of values or null.
MV.parseNum = function(raw){
  var s = String(raw == null ? "" : raw).trim().replace(/−/g, "-").replace(/\s+/g, "").replace(/pi/gi, "π").replace(/sqrt/gi, "√").replace(/,(?=\d{3}\b)/g, "");
  if (!s) return null;
  if (s[0] === "±" || s.slice(0, 2) === "+-") { var r = MV.parseNum(s.replace(/^(±|\+-)/, "")); return r ? [r[0], -r[0]] : null; }
  var i = 0;
  function peek(){ return s[i]; }
  function expr(){ var v = term(); while (peek() === "+" || peek() === "-") { var op = s[i++]; var w = term(); v = op === "+" ? v + w : v - w; } return v; }
  function term(){ var v = unary(); while (peek() === "*" || peek() === "/" || peek() === "×" || peek() === "÷" || isImplicit()) { var op = s[i]; if (op === "*" || op === "/" || op === "×" || op === "÷") i++; else op = "*"; var w = unary(); v = (op === "/" || op === "÷") ? v / w : v * w; } return v; }
  function isImplicit(){ var c = peek(); return c === "π" || c === "√" || c === "("; }
  function unary(){ if (peek() === "-") { i++; return -unary(); } if (peek() === "+") { i++; return unary(); } return power(); }
  function power(){ var v = atom(); if (peek() === "^") { i++; var e = unary(); v = Math.pow(v, e); } return v; }
  function atom(){
    var c = peek();
    if (c === "(") { i++; var v = expr(); if (peek() !== ")") throw 0; i++; return v; }
    if (c === "π") { i++; return Math.PI; }
    if (c === "√") { i++; return Math.sqrt(atom()); }
    var m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(s.slice(i));
    if (!m) throw 0;
    i += m[0].length; return parseFloat(m[0]);
  }
  try { var v = expr(); if (i !== s.length || !isFinite(v)) return null; return [v]; } catch (e) { return null; }
};
// Parse a comma/semicolon separated list ("−3, 0, 5", "±1, ±2"); returns sorted values or null if any part fails.
MV.parseList = function(raw){
  var parts = String(raw || "").split(/[,;]|\bor\b|\band\b/).map(function(t){ return t.replace(/^\s*[a-z]\s*=\s*/i, "").trim(); }).filter(Boolean);
  if (!parts.length) return null;
  var out = [];
  for (var k = 0; k < parts.length; k++) { var r = MV.parseNum(parts[k]); if (!r) return null; out = out.concat(r); }
  return out.sort(function(a, b){ return a - b; });
};
MV.sameNums = function(a, b, tol){
  tol = tol == null ? 1e-6 : tol;
  if (!a || !b || a.length !== b.length) return false;
  var x = a.slice().sort(function(p, q){ return p - q; }), y = b.slice().sort(function(p, q){ return p - q; });
  for (var i = 0; i < x.length; i++) if (Math.abs(x[i] - y[i]) > tol * Math.max(1, Math.abs(y[i]))) return false;
  return true;
};

// ---------- answer decoding (decision 7: keys lightly scrambled by the assembler) ----------
function fnv(str){ var h = 0x811c9dc5; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ("0000000" + h.toString(16)).slice(-8); }
MV._fnv = fnv;
// Is this option the correct one?  Works on raw content (ok:true) and on assembled pages (_k/_n, see build/lib.mjs).
MV.ok = function(opt){
  if (!opt) return false;
  if (opt.ok !== undefined) return !!opt.ok;
  if (opt._k === undefined) return false;
  return opt._k === fnv((MV.salt || "") + "|" + opt._n + "|1");
};
// The answer stored on an item (answer: ... in content.mjs; stored encoded as _a in assembled pages).
MV.ans = function(item){
  if (!item) return undefined;
  if (item.answer !== undefined) return item.answer;
  if (item._a === undefined) return undefined;
  if (item._dec !== undefined) return item._dec;
  var salt = MV.salt || "x", bin = atob(item._a), out = "";
  for (var i = 0; i < bin.length; i++) out += String.fromCharCode(bin.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
  var v = JSON.parse(decodeURIComponent(escape(out)));
  try { Object.defineProperty(item, "_dec", { value:v, enumerable:false }); } catch (e) {}
  return v;
};
MV.right = function(opts){ for (var i = 0; i < opts.length; i++) if (MV.ok(opts[i])) return i; return -1; };

// Goal references in content may be 1, "G1", [1, 3] or "G1, G3": returns 0-based indices.
MV.goalIdx = function(g){
  if (g == null) return [];
  if (Array.isArray(g)) return g.reduce(function(a, x){ return a.concat(MV.goalIdx(x)); }, []);
  if (typeof g === "number") return [g - 1];
  return String(g).split(/[,\s]+/).filter(Boolean).map(function(t){ return parseInt(t.replace(/\D/g, ""), 10) - 1; }).filter(function(n){ return n >= 0; });
};

// Deterministic shuffle (so the same page always shows the same order).
MV.shuffle = function(arr, seed){
  var a = arr.slice(), h = parseInt(fnv(String(seed || "s")), 16) || 1;
  function rnd(){ h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
};

// Download a text file (used for backups and printable cards; printing is blocked on the site).
MV.download = function(name, text, type){
  try {
    var b = new Blob([text], { type:type || "text/plain;charset=utf-8" }), u = URL.createObjectURL(b), a = document.createElement("a");
    a.href = u; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(u); a.remove(); }, 500);
    return true;
  } catch (e) { return false; }
};
})();
