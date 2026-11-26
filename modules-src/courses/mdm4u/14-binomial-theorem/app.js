// MDM4U 14 The Binomial Theorem: hero (three brackets (a + b); a pointer writes the 8 choice words, which group into 1, 3,
// 3, 1 and become 1a³ + 3a²b + 3ab² + 1b³ while row 3 of the triangle lights up), Expansion builder (Explore: binomial
// chips, n slider, Choice words / Coefficient / Term finder modes, D5 mini triangle and readouts), Working backwards
// (Part 3: two balance stations and a coin station with the D6 seeded simulator), Expand it (N4 coefficient lists),
// Design a binomial (task). Every count comes from MV.mdm.nCr.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css;
function M(s){ return MV.m(s); }
function C(n, k){ if (n < 0 || k < 0 || k > n) return 0; var v = MV.mdm.nCr(n, k); return typeof v === "bigint" ? Number(v) : v; }
function clampInt(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function ipow(b, e){ var r = 1; for (var i = 0; i < e; i++) r *= b; return r; }
function ord(n){ var v = n % 100; return n + ((v >= 11 && v <= 13) ? "th" : ({ 1:"st", 2:"nd", 3:"rd" })[n % 10] || "th"); }
function lin(t){ return t; }
function muted(h){ return ' <span class="muted bt-rule">' + h + "</span>"; }
function readInt(raw){ var s = String(raw == null ? "" : raw).trim().replace(/[−–]/g, "-").replace(/[\s  ,]/g, ""); return /^[+-]?\d+$/.test(s) ? parseInt(s, 10) : null; }

// @component radioGroup (copied from MDM4U 12) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) || ids.indexOf(val) < 0 ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// @component D5 pascalExplorer (copied from MDM4U 12; trimmed to val / row / view) — Pascal's triangle explorer, rows and
// positions from 0. Every entry is a button: tap (or arrow keys + Enter; one tab stop, roving focus) -> onTap(n, r).
//   t = D5.view(host, {rows:8, label, onTap(n, r)});  t.render({marks:{"n,r":"sel" | "up1" | "up2"}, row:n, say:{"n,r":"words"}})
//   Mark styles (app.css): sel = highlighter, up1 = blue --pen, up2 = teal --f3, row = --hi-soft. Keep a worded legend beside it.
var D5 = (function(){
  function val(n, r){ return C(n, r); }
  function row(n){ var a = []; for (var r = 0; r <= n; r++) a.push(val(n, r)); return a; }
  function view(host, o){
    var rows = Math.max(0, Math.min(15, o.rows == null ? 10 : o.rows)), cur = [0, 0];
    var h = '<div class="d5-wrap"><div class="d5-tri" role="group" aria-label="' + MV.esc(o.label || "Pascal’s triangle") + ", rows 0 to " + rows + '. Arrow keys move between entries.">';
    for (var n = 0; n <= rows; n++) {
      h += '<div class="d5-row"><span class="d5-cells">';
      for (var r = 0; r <= n; r++) h += '<button type="button" class="d5-c" data-n="' + n + '" data-r="' + r + '" tabindex="' + (n === 0 ? 0 : -1) + '"></button>';
      h += '</span><span class="d5-sum" aria-hidden="true"></span></div>';
    }
    host.innerHTML = h + "</div></div>";
    var tri = $(".d5-tri", host);
    function btn(n, r){ return tri.querySelector('[data-n="' + n + '"][data-r="' + r + '"]'); }
    function rove(n, r, focus){
      var b0 = btn(cur[0], cur[1]); if (b0) b0.tabIndex = -1;
      cur = [n, r]; var b = btn(n, r); if (!b) return; b.tabIndex = 0;
      if (focus) b.focus({ preventScroll:false });
    }
    tri.addEventListener("click", function(e){
      var b = e.target.closest(".d5-c"); if (!b) return;
      rove(+b.dataset.n, +b.dataset.r, false);
      if (o.onTap) o.onTap(+b.dataset.n, +b.dataset.r);
    });
    tri.addEventListener("keydown", function(e){
      var b = e.target.closest(".d5-c"); if (!b) return;
      var n = +b.dataset.n, r = +b.dataset.r, k = e.key;
      if (k === "ArrowLeft") r = Math.max(0, r - 1); else if (k === "ArrowRight") r = Math.min(n, r + 1);
      else if (k === "ArrowUp") { n = Math.max(0, n - 1); r = Math.min(r, n); } else if (k === "ArrowDown") n = Math.min(rows, n + 1);
      else if (k === "Home") r = 0; else if (k === "End") r = n; else return;
      e.preventDefault(); rove(n, r, true);
    });
    function render(s){
      s = s || {};
      var marks = s.marks || {}, say = s.say || {};
      for (var n = 0; n <= rows; n++) {
        for (var r = 0; r <= n; r++) {
          var b = btn(n, r), v = val(n, r), k = n + "," + r, m = marks[k] || "";
          b.className = "d5-c" + (m ? " " + m : "") + (s.row === n ? " row" : "");
          b.textContent = String(v);
          b.setAttribute("aria-label", "Row " + n + ", position " + r + ": C(" + n + ", " + r + ") = " + v + (say[k] ? ", " + say[k] : ""));
        }
      }
    }
    return { render:render, el:tri };
  }
  return { val:val, row:row, view:view };
})();

// ---------- binomials: first part c1·x^p1 (blue), second part c2·x^p2 (teal); (a + b) is symbolic ----------
var BINS = [
  { id:"ab", sym:true, c1:1, p1:1, c2:1, p2:0 },
  { id:"x+1", c1:1, p1:1, c2:1, p2:0 }, { id:"x+2", c1:1, p1:1, c2:2, p2:0 },
  { id:"x-1", c1:1, p1:1, c2:-1, p2:0 }, { id:"x-2", c1:1, p1:1, c2:-2, p2:0 },
  { id:"2x+1", c1:2, p1:1, c2:1, p2:0 }, { id:"2x-1", c1:2, p1:1, c2:-1, p2:0 },
  { id:"x+1/x", c1:1, p1:1, c2:1, p2:-1 }, { id:"x2+2/x", c1:1, p1:2, c2:2, p2:-1 }
];
var BIN = {}; BINS.forEach(function(b){ BIN[b.id] = b; });
// |c|·x^e as m() source (no sign): 8x^3, x, 4, {16}/{x^4}
function xSrc(c, e){
  if (e === 0) return String(c);
  if (e > 0) return (c === 1 ? "" : String(c)) + "x" + (e > 1 ? "^" + e : "");
  return "{" + c + "}/{x" + (e < -1 ? "^" + (-e) : "") + "}";
}
// m() source of a part (which = 1 first, 2 second): a, b, 2x, x^2, -1, 2/x
function partSrc(B, which){
  if (B.sym) return which === 1 ? "a" : "b";
  var c = which === 1 ? B.c1 : B.c2, p = which === 1 ? B.p1 : B.p2;
  if (p === 0) return String(c);
  if (p > 0) return (c === 1 ? "" : c === -1 ? "-" : String(c)) + "x" + (p > 1 ? "^" + p : "");
  return c + "/x" + (p < -1 ? "^" + (-p) : "");
}
function bare(s){ return /^([a-z]|\d+)$/.test(s); }
function colr(which, s){ return "@" + (which === 1 ? "n" : "d") + "{" + s + "}"; }
function pw(B, which, e){ var s = partSrc(B, which); return bare(s) ? colr(which, s) + "^{" + e + "}" : "(" + colr(which, s) + ")^{" + e + "}"; }
function binSrc(B, col){
  var a = partSrc(B, 1), b = partSrc(B, 2), neg = !B.sym && B.c2 < 0;
  var bs = neg ? "- " + b.slice(1) : "+ " + b;
  return col ? "(" + colr(1, a) + " " + (neg ? colr(2, bs) : "+ " + colr(2, b)) + ")" : "(" + a + " " + bs + ")";
}
function termOf(B, n, k){ return { k:k, coef:C(n, k) * ipow(B.c1, n - k) * ipow(B.c2, k), e:B.p1 * (n - k) + B.p2 * k }; }
function terms(B, n){ var t = []; for (var k = 0; k <= n; k++) t.push(termOf(B, n, k)); return t; }
function bodySrc(B, n, t){
  var c = Math.abs(t.coef);
  if (B.sym) { var ea = n - t.k, eb = t.k, v = (ea ? "a" + (ea > 1 ? "^" + ea : "") : "") + (eb ? "b" + (eb > 1 ? "^" + eb : "") : ""); return v ? (c === 1 ? "" : String(c)) + v : String(c); }
  return xSrc(c, t.e);
}
function termSrc(B, n, t, first){ return (t.coef < 0 ? (first ? "-" : "- ") : (first ? "" : "+ ")) + bodySrc(B, n, t); }
function expHTML(B, n, hit){
  return '<span class="bt-exp">' + terms(B, n).map(function(t, i){ return '<span class="bt-t' + (hit === t.k ? " bt-hit" : "") + '">' + M(termSrc(B, n, t, i === 0)) + "</span>"; }).join(" ") + "</span>";
}
function genShort(B, n){
  return "t_{k + 1} = C(" + n + ", k)" + (B.sym ? colr(1, "a") + "^{" + n + " - k}" + colr(2, "b") + "^k" : pw(B, 1, n + " - k") + pw(B, 2, "k"));
}
function expoSrc(A, Bk){ var kk = (Bk === 1 ? "" : Bk) + "k"; return A === 0 ? "-" + kk : A + " - " + kk; }
function genLong(B, n){
  if (B.sym) return genShort(B, n);
  var f = "C(" + n + ", k)";
  if (B.c1 !== 1) f += " " + B.c1 + "^{" + n + " - k}";
  if (B.c2 !== 1) f += (B.c2 < 0 ? "(" + B.c2 + ")" : " " + B.c2) + "^k";
  return genShort(B, n) + " = " + f + " x^{" + expoSrc(B.p1 * n, B.p1 - B.p2) + "}";
}
function sumSrc(B, n){
  if (B.sym) return "(1 + 1)^" + n + " = " + ipow(2, n);
  return "(" + B.c1 + (B.c2 < 0 ? " - " + (-B.c2) : " + " + B.c2) + ")^" + n + " = " + ipow(B.c1 + B.c2, n);
}
function sumLine(B, n){ return terms(B, n).map(function(t, i){ return (i ? (t.coef < 0 ? " - " : " + ") + Math.abs(t.coef) : String(t.coef)); }).join("") + " = " + ipow(B.sym ? 2 : B.c1 + B.c2, n); }
// value of (part)^e, coloured; a negative value is bracketed: 8x^3, (-1), {16}/{x^4}
function factorSrc(B, which, e){
  var c = which === 1 ? B.c1 : B.c2, p = which === 1 ? B.p1 : B.p2, cv = ipow(c, e), s = xSrc(Math.abs(cv), p * e);
  return colr(which, cv < 0 ? "(-" + s + ")" : s);
}
function lhsSrc(B, n, k){ return "C(" + n + ", " + k + ")" + (B.sym ? colr(1, "a") + "^{" + (n - k) + "}" + colr(2, "b") + "^{" + k + "}" : pw(B, 1, n - k) + pw(B, 2, k)); }
function midSrc(B, n, k){ return C(n, k) + " × " + factorSrc(B, 1, n - k) + " × " + factorSrc(B, 2, k); }
function wordsOf(n){ var out = []; for (var m = 0; m < (1 << n); m++) { var w = ""; for (var j = n - 1; j >= 0; j--) w += (m >> j) & 1 ? "b" : "a"; out.push(w); } return out; }
function nB(w){ return (w.match(/b/g) || []).length; }
function wordHTML(w, cls){ return '<span class="bt-w' + (cls ? " " + cls : "") + '" data-w="' + w + '">' + (w ? w.split("").map(function(ch){ return '<i class="bt-l' + ch + '">' + ch + "</i>"; }).join("") : "–") + "</span>"; }
function bsWord(k){ return k + ' <i class="bt-lb">b</i>' + (k === 1 ? "" : "’s"); }

// ---------- Explore: Expansion builder ----------
var MODES = [{ id:"words", t:"Choice words" }, { id:"coef", t:"Coefficient" }, { id:"term", t:"Term finder" }];
var BYS = [{ id:"k", t:"Choose " + M("k") }, { id:"pow", t:"Power of " + M("x") }];
function explore(host, api){
  var S = api.S;
  if (!BIN[S.bin]) S.bin = "ab";
  if (!MODES.some(function(x){ return x.id === S.mode; })) S.mode = "words";
  S.n = clampInt(S.n, 0, 8, 3);
  S.by = S.by === "pow" ? "pow" : "k";
  ["k", "pow", "c2", "c3"].forEach(function(f){ if (typeof S[f] !== "string") S[f] = f === "k" ? "1" : ""; });
  S.grouped = !!S.grouped;
  var pv = {}, anim = null, tapMsg = "";

  host.innerHTML =
    '<div class="bt-top" id="bt-mode"></div>' +
    '<div class="pg bt-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap bt-cap" id="bt-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="bt-panel" id="bt-panel"></div></div>' +
    '<div class="pg-ctrl"><div id="bt-bins"></div>' +
      '<label class="slider"><span class="slider-top"><span>Power ' + M("n") + '</span><output id="bt-n-out"></output></span><input type="range" id="bt-n-in" min="0" max="8" step="1"></label>' +
      '<div class="bt-chal"><p class="bt-chalh">Answers for the target challenges</p>' +
        '<div class="numrow"><label for="bt-c2">Challenge 2: coefficient of ' + M("x^3") + " =</label>" + '<input class="numin short" id="bt-c2" type="text" inputmode="numeric" autocomplete="off"></div>' +
        '<div class="numrow"><label for="bt-c3">Challenge 3: constant term =</label>' + '<input class="numin short" id="bt-c3" type="text" inputmode="numeric" autocomplete="off"></div></div>' +
      '<p class="tiny muted" id="bt-how"></p></div>' +
    '<div class="pg-read"><div class="bt-tribox"><p class="bt-trih">Pascal’s triangle <span class="tiny muted">(rows 0 to 8; tap an entry)</span></p><div id="bt-tri"></div>' +
      '<p class="bt-legend"><span class="bt-lg"><i class="d5-c row" aria-hidden="true"></i> row ' + M("n") + ': the coefficient counts</span><span class="bt-lg" id="bt-lgk"><i class="d5-c sel" aria-hidden="true"></i> the term you found</span></p><p class="tiny bt-tap" id="bt-tap" aria-live="polite"></p></div>' +
      '<dl class="read" id="bt-read" aria-live="polite"></dl></div></div>';

  var modeR = radios($("#bt-mode", host), { label:"Mode", options:MODES, value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; tapMsg = ""; save(); render(); MV.changed(); } });
  var binR = radios($("#bt-bins", host), { label:"Binomial", options:BINS.map(function(b){ return { id:b.id, t:M(binSrc(b)) }; }), value:S.bin, cls:"chips",
    onChange:function(v){ user(); S.bin = v; if (BIN[v].sym && S.by === "pow") S.by = "k"; tapMsg = ""; save(); render(); MV.changed(); } });
  var nIn = $("#bt-n-in", host), c2 = $("#bt-c2", host), c3 = $("#bt-c3", host), panel = $("#bt-panel", host);
  var tri = D5.view($("#bt-tri", host), { rows:8, label:"Pascal’s triangle", onTap:function(n, r){
    user(); S.n = n;
    if (S.mode === "term") { S.by = "k"; S.k = String(r); }
    tapMsg = "Row " + n + " holds the coefficient counts of " + M(binSrc(BIN[S.bin]) + "^" + n) + "; position " + r + " is " + M("C(" + n + ", " + r + ") = " + C(n, r)) + ".";
    save(); render(); MV.changed();
  } });
  c2.value = S.c2; c3.value = S.c3;
  nIn.addEventListener("input", function(){ user(); S.n = +nIn.value; tapMsg = ""; save(); render(); MV.changed(); });
  c2.addEventListener("input", function(){ S.c2 = c2.value; save(); MV.changed(); });
  c3.addEventListener("input", function(){ S.c3 = c3.value; save(); MV.changed(); });
  panel.addEventListener("click", function(e){
    var b = e.target.closest("#bt-grp"); if (!b) return;
    user(); var to = !S.grouped; save(); group(to, null);
  });
  panel.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.tf) return;
    user(); S[t.dataset.tf] = t.value; save(); paintTF(); paintTri(); MV.changed();
  });

  function save(){ api.save(); }
  function user(){ if (anim) finish(); if (pv.on || pv.hit != null || pv.glow != null || pv.sumHit) { pv = {}; paintAll(); } MV.banner("", ""); }

  // --- animation bookkeeping: any user action finishes the running animation at once (end() sets the final state) ---
  function newAnim(end, done){ if (anim) finish(); anim = { timers:[], stops:[], end:end || null, done:done || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function tween(o){ var a = anim; if (!a) return; a.stops.push(MV.tween({ dur:o.dur, ease:o.ease, step:function(t){ if (anim === a) o.step(t); }, done:function(){ if (anim === a) o.done(); } })); }
  function finish(){
    var a = anim; if (!a) return; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    if (a.end) a.end();
    save(); render(); MV.changed();
    if (a.done) a.done();
  }

  // --- painting ---
  function B(){ return BIN[S.bin]; }
  function render(){ modeR.set(S.mode); binR.set(S.bin); paintSlider(); paintAll(); }
  function paintAll(){ paintCap(); paintPanel(); paintTri(); paintRead(); paintHow(); }
  function paintSlider(){ nIn.value = S.n; nIn.setAttribute("aria-valuetext", "n = " + S.n); $("#bt-n-out", host).textContent = String(S.n); }
  function paintCap(){ $("#bt-cap", host).innerHTML = M(binSrc(B(), true) + "^" + S.n); }
  function paintHow(){
    $("#bt-how", host).innerHTML = S.mode === "words" ? "Each word picks " + M("a") + " or " + M("b") + " from every bracket. Words are listed for " + M("n") + " up to 4." :
      S.mode === "coef" ? "Each row is one term: the triangle’s count times the power of each part, multiplied out." :
      "Choose " + M("k") + ", or type a power of " + M("x") + ", to find that term in one step.";
  }
  function paintPanel(){
    var h = S.mode === "words" ? wordsHTML() : S.mode === "coef" ? coefHTML() : tfHTML();
    MV.keepFocus(panel, function(){ panel.innerHTML = h; });
    if (S.mode === "term") { radios($("#bt-by", panel), { label:"Find the term by", options:BYS, value:S.by, cls:"seg", disabled:function(id){ return id === "pow" && B().sym; },
      onChange:function(v){ user(); S.by = v; save(); $("#bt-krow", panel).hidden = v !== "k"; $("#bt-prow", panel).hidden = v !== "pow"; paintTF(); paintTri(); MV.changed(); } }); paintTF(); }
  }
  function legendHTML(){
    var b = B();
    if (b.sym) return "";
    return '<p class="bt-parts">Here ' + M(colr(1, "a") + " = " + colr(1, partSrc(b, 1))) + " and " + M(colr(2, "b") + " = " + colr(2, partSrc(b, 2))) + ".</p>";
  }
  // Choice words: every word for n <= 4, as one list or grouped by the number of b's
  function wordsHTML(){
    var b = B(), n = S.n, q = pv.on, h = '<p class="bt-brk" aria-label="' + n + ' brackets">' + (n ? M(new Array(n + 1).join(binSrc({ sym:true }, true))) : M("(a + b)^0 = 1")) + "</p>" + legendHTML();
    var row = D5.row(n);
    if (n > 4) {
      h += '<p class="bt-wnote">With ' + M("n = " + n) + " there are " + M("2^" + n + " = " + ipow(2, n)) + " words: too many to list here. Grouped by the number of " + M("b") + "’s, the group sizes are row " + n + ": <strong>" + (q ? "?" : row.join(" ")) + "</strong>.</p>";
      h += '<div class="bt-groups bt-gsum">' + row.map(function(c, k){ return groupHTML(k, "", q ? "?" : c); }).join("") + "</div>";
      return h;
    }
    var W = wordsOf(n);
    h += '<div class="q-actions bt-wact"><button type="button" class="btn sm" id="bt-grp" data-k="btgrp" aria-pressed="' + S.grouped + '">' + (S.grouped ? "Show one list" : "Group by the number of " + M("b") + "’s") + "</button></div>";
    h += '<p class="vh">' + W.length + " words: " + W.join(", ") + ".</p>";
    if (S.grouped) h += '<div class="bt-groups" aria-hidden="true">' + row.map(function(c, k){ return groupHTML(k, W.filter(function(w){ return nB(w) === k; }).map(function(w){ return wordHTML(w, pv.glow === k ? "bt-glow" : ""); }).join(""), q ? "?" : c); }).join("") + "</div>";
    else h += '<div class="bt-wlist" aria-hidden="true">' + W.map(function(w){ return wordHTML(w); }).join("") + "</div>";
    h += '<p class="bt-wcount">' + M("2^" + n + " = " + W.length) + " word" + (W.length === 1 ? "" : "s") + (S.grouped ? ". Group sizes: " + (q ? "?" : row.join(", ") + ", which is row " + n + " of the triangle") + "." : ". Group them to count how many have each number of " + M("b") + "’s.") + "</p>";
    return h;
  }
  function groupHTML(k, words, cnt){
    var b = B(), n = S.n, t = termOf(b, n, k), q = cnt === "?";
    var foot = q ? "" : M("C(" + n + ", " + k + ") = " + C(n, k)) + " → " + M((C(n, k) === 1 ? "" : C(n, k)) + (n - k ? colr(1, "a") + (n - k > 1 ? "^" + (n - k) : "") : "") + (k ? colr(2, "b") + (k > 1 ? "^" + k : "") : "") || "1");
    if (!q && !b.sym) foot += " " + M("= " + lhsSrc(b, n, k).replace("C(" + n + ", " + k + ")", C(n, k)) + " = " + termSrc(b, n, t, true));
    return '<div class="bt-g' + (pv.glow === k ? " bt-glow" : "") + '" data-g="' + k + '"><p class="bt-gh">' + bsWord(k) + ': <strong class="bt-gc">' + cnt + "</strong></p>" + (words ? '<div class="bt-gw">' + words + "</div>" : "") + (foot ? '<p class="bt-gt">' + foot + "</p>" : "") + "</div>";
  }
  // Coefficient mode: one row per term, numeric factors before they are multiplied
  function coefHTML(){
    var b = B(), n = S.n, q = pv.on, h = legendHTML();
    h += '<p class="bt-ph">Each term: ' + M("C(n, k)") + " × " + (b.sym ? M(colr(1, "a") + "^{n - k}") + " × " + M(colr(2, "b") + "^k") : '(<span class="bt-ca">first part</span>)' + M("^{n - k}") + ' × (<span class="bt-cb">second part</span>)' + M("^k")) + "</p>";
    h += '<div class="bt-rows">' + terms(b, n).map(function(t){
      var hid = q && pv.shown != null && t.k >= pv.shown;
      return '<div class="bt-row' + (hid ? " bt-hid" : "") + (pv.hit === t.k ? " bt-hit" : "") + '" data-k="' + t.k + '"><span class="bt-rk">' + M("k = " + t.k) + '</span><span class="bt-rp">' + M(lhsSrc(b, n, t.k)) + "</span>" +
        (b.sym ? "" : '<span class="bt-rp">' + M("= " + midSrc(b, n, t.k)) + "</span>") + '<span class="bt-rp bt-rr">' + M("= " + termSrc(b, n, t, true)) + "</span></div>";
    }).join("") + "</div>";
    h += '<p class="bt-sum' + (pv.sumHit ? " bt-hit" : "") + '">Sum of the coefficients: ' + (q ? "?" : M(sumLine(b, n))) + (q ? "" : muted("(set " + M(b.sym ? "a = b = 1" : "x = 1") + ": " + M(sumSrc(b, n)) + ")")) + "</p>";
    return h;
  }
  // Term finder: the general term, then the term for a chosen k or a target power of x
  function tfHTML(){
    var b = B(), n = S.n;
    return legendHTML() + '<p class="bt-gen">' + M(genLong(b, n)) + "</p>" + '<div id="bt-by"></div>' +
      '<div class="bt-tfin"><div class="numrow" id="bt-krow"' + (S.by === "k" ? "" : " hidden") + '><label for="bt-kin">' + M("k =") + '</label><input class="numin short" id="bt-kin" data-tf="k" data-k="btkin" type="number" min="0" max="' + n + '" step="1" value="' + MV.esc(S.k) + '"><span class="tiny muted">(0 to ' + n + ")</span></div>" +
        '<div class="numrow" id="bt-prow"' + (S.by === "pow" ? "" : " hidden") + '><label for="bt-pin">Power of ' + M("x") + ':</label><input class="numin short" id="bt-pin" data-tf="pow" data-k="btpin" type="number" step="1" value="' + MV.esc(S.pow) + '"><span class="tiny muted">(0 for the constant term)</span></div>' +
      '</div><div class="bt-tfout" id="bt-tfout" aria-live="polite"></div>';
  }
  // the k the term finder points at (or a message): {k} | {msg}
  function tfK(){
    var b = B(), n = S.n;
    if (S.by === "k") {
      var k = readInt(S.k);
      if (k == null) return { msg:"Type a whole number " + M("k") + " from 0 to " + n + "." };
      if (k < 0 || k > n) return { msg:M("k") + " runs from 0 to " + n + " here: there are " + (n + 1) + " terms." };
      return { k:k };
    }
    var m = readInt(S.pow);
    if (m == null) return { msg:"Type a whole-number power of " + M("x") + " (0 for the constant term)." };
    var A = b.p1 * n, Bk = b.p1 - b.p2, steps = [expoSrc(A, Bk) + " = " + m];
    if (Bk !== 1) steps.push(Bk + "k = " + (A - m));
    var num = A - m;
    if (num % Bk !== 0 || num / Bk < 0 || num / Bk > n) {
      var kv = num % Bk === 0 ? String(num / Bk) : (num < 0 ? "-" : "") + "{" + Math.abs(num) + "}/{" + Bk + "}";
      steps.push("k = " + kv);
      return { steps:steps, msg:M("k = " + kv) + " is not a whole number from 0 to " + n + ", so there is no " + M(m === 0 ? "x^0" : xSrc(1, m)) + " term" + (m === 0 ? " (no constant term)" : "") + ": its coefficient is 0." };
    }
    steps.push("k = " + num / Bk);
    return { k:num / Bk, steps:steps };
  }
  function paintTF(){
    var out = $("#bt-tfout", panel); if (!out) return;
    var b = B(), n = S.n, r = tfK(), h = "";
    if (r.steps) h += '<p class="bt-tfs">Power of ' + M("x") + " in the general term: " + r.steps.map(function(s){ return M(s); }).join(" → ") + "</p>";
    if (r.k == null) { out.innerHTML = h + '<p class="bt-tfmsg">' + r.msg + "</p>"; return; }
    var t = termOf(b, n, r.k);
    h += '<p class="bt-tfr">' + M("k = " + r.k) + " gives the " + ord(r.k + 1) + " term:</p>" +
      '<p class="bt-tfterm"><span class="bt-rp">' + M("t_{" + (r.k + 1) + "} = " + lhsSrc(b, n, r.k)) + "</span>" + (b.sym ? "" : '<span class="bt-rp">' + M("= " + midSrc(b, n, r.k)) + "</span>") + '<span class="bt-rp bt-rr">' + M("= " + termSrc(b, n, t, true)) + "</span></p>" +
      '<p class="bt-tfc">Coefficient: <strong>' + M(String(t.coef)) + "</strong></p>";
    out.innerHTML = h;
  }
  function paintTri(){
    var b = B(), n = S.n, marks = {}, say = {}, q = pv.on;
    if (S.mode === "term") { var r = tfK(); if (r.k != null) { marks[n + "," + r.k] = "sel"; say[n + "," + r.k] = "the term you found"; } }
    tri.render({ marks:marks, say:say, row:q ? null : n });
    $("#bt-lgk", host).hidden = S.mode !== "term";
    $("#bt-tap", host).innerHTML = tapMsg;
  }
  function paintRead(){
    var b = B(), n = S.n, q = pv.on, row = D5.row(n);
    $("#bt-read", host).innerHTML = MV.readoutHTML([
      ["Number of terms", q ? "?" : String(n + 1) + muted("(" + M("n + 1") + ")")],
      ["Coefficients from the triangle", q ? "?" : row.join(" ") + muted("(row " + n + ")")],
      ["Expansion", q ? "?" : expHTML(b, n, pv.hit) + (!b.sym && b.c2 < 0 && n > 0 ? muted("Signs alternate: the second part is negative.") : "")],
      ["General term", M(genShort(b, n))],
      ["Sum of coefficients", q ? "?" : M(sumSrc(b, n)) + muted("(set " + M(b.sym ? "a = b = 1" : "x = 1") + ")")]
    ]);
  }

  // --- Choice words grouping, sliding each word from the list to its group (FLIP) ---
  function group(to, next){
    var before = {};
    $$(".bt-w", panel).forEach(function(el){ var r = el.getBoundingClientRect(); before[el.dataset.w] = [r.left, r.top]; });
    S.grouped = to; save(); paintPanel();
    var els = $$(".bt-w", panel), moves = [];
    els.forEach(function(el){ var b0 = before[el.dataset.w]; if (!b0) return; var r = el.getBoundingClientRect(), dx = b0[0] - r.left, dy = b0[1] - r.top; if (Math.abs(dx) + Math.abs(dy) > 1) moves.push([el, dx, dy]); });
    function place(t){ moves.forEach(function(m){ m[0].style.transform = t >= 1 ? "" : "translate(" + (m[1] * (1 - t)).toFixed(1) + "px, " + (m[2] * (1 - t)).toFixed(1) + "px)"; }); }
    if (!moves.length || MV.reduceMotion) { place(1); if (next) next(); return; }
    var a = anim || newAnim(null, null);
    place(0);
    tween({ dur:1000, step:place, done:function(){ place(1); if (next) next(); else if (anim === a && !a.done) { anim = null; } } });
  }

  render();

  // --- predictions ---
  function startPred(p){
    if (anim) finish();
    var s = p.start || {};
    S.bin = s.bin; S.n = s.n; S.mode = s.mode; if (s.mode === "words") S.grouped = false; tapMsg = "";
    pv = { on:true, shown:0 }; save(); render(); MV.changed();
  }
  function revealRows(next){
    var rows = $$(".bt-row", panel), N = rows.length, shown = 0;
    tween({ dur:Math.min(2200, 300 + N * 260), ease:lin, step:function(t){ var k = Math.round(t * N); while (shown < k) { rows[shown].classList.remove("bt-hid"); shown++; } }, done:function(){ if (next) next(); } });
  }
  function runPred(p, done){
    var id = p.id;
    newAnim(function(){ pv.on = false; pv.shown = null; if (id === "p2") { S.grouped = true; pv.glow = 2; } if (id === "p3") pv.hit = 3; if (id === "p4") pv.sumHit = true; }, done);
    if (id === "p2") {
      later(300, function(){ group(true, function(){ pv.glow = 2; $$('.bt-g[data-g="2"], .bt-g[data-g="2"] .bt-w', panel).forEach(function(el){ el.classList.add("bt-glow"); }); later(1100, finish); }); });
      return;
    }
    later(250, function(){
      revealRows(function(){
        if (id === "p3") { var r = $('.bt-row[data-k="3"]', panel); if (r) r.classList.add("bt-hit"); later(900, finish); }
        else if (id === "p4") { pv.on = false; pv.sumHit = true; paintPanel(); later(1000, finish); }
        else later(600, finish);
      });
    });
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id, opt){ return chal(id, opt || {}); }
  };

  function chal(id, opt){
    var b = B(), n = S.n;
    if (id === "tc1") {
      if (n !== 4) return { ok:false, msg:"Set " + M("n = 4") + " first." };
      if (b.sym || b.p1 !== 1 || b.p2 !== 0) return { ok:false, msg:"Choose a chip of the form " + M("(x + b)") + ", where " + M("b") + " is a number." };
      if (b.c1 !== 1) return { ok:false, msg:"That’s " + M("C(4, 2) × 2^2 = 24") + " too, but the challenge asks for " + M("(x + b)") + "." };
      if (Math.abs(b.c2) === 2) return { ok:true };
      return { ok:false, msg:"The " + M("x^2") + " coefficient is " + M("C(4, 2) × " + (b.c2 < 0 ? "(" + b.c2 + ")" : b.c2) + "^2 = " + C(4, 2) * b.c2 * b.c2) + "." };
    }
    if (id === "tc2" || id === "tc3") {
      if (opt.live) return { ok:false };                         // a typed value gets no live tick
      var raw = id === "tc2" ? S.c2 : S.c3, v = readInt(raw), box = id === "tc2" ? "Challenge 2" : "Challenge 3";
      if (!String(raw || "").trim()) return { ok:false, msg:"Type your answer in the <strong>" + box + "</strong> box under the controls first." };
      if (v == null) return { ok:false, msg:"Type a whole number in the <strong>" + box + "</strong> box." };
      if (id === "tc2") {
        if (v === 80) return { ok:true };
        if (v === 10) return { ok:false, msg:"You used " + M("C(5, 2)") + " but forgot " + M("(2x)^3 = 8x^3") + "." };
        if (v === 20) return { ok:false, msg:M("2^3 = 8") + ", not 2." };
        if (v === 40) return { ok:false, msg:"That’s the " + M("x^2") + " coefficient." };
        return { ok:false, msg:"Try Term finder with " + M("(2x + 1)") + ", " + M("n = 5") + " and the power 3 of " + M("x") + "." };
      }
      if (v === 240) return { ok:true };
      if (v === 15) return { ok:false, msg:M("C(6, 4) = 15") + ", but " + M("(2/x)^4") + " brings " + M("2^4 = 16") + "." };
      if (v === 160) return { ok:false, msg:"That’s " + M("k = 3") + ", which gives " + M("x^3") + ", not a constant." };
      if (v === 60) return { ok:false, msg:M("k = 2") + " gives " + M("x^6") + "." };
      return { ok:false, msg:"Try Term finder with " + M("(x^2 + 2/x)") + ", " + M("n = 6") + " and the power 0 of " + M("x") + "." };
    }
    return { ok:false };
  }
}

// ---------- hero: choose a or b from each of three brackets; 8 words group into 1, 3, 3, 1 ----------
function hero(f){
  var svg = $("#bt-h-svg"), cap = f.cap;
  if (!svg) return;
  var WORDS = ["aaa", "aab", "aba", "baa", "abb", "bab", "bba", "bbb"];
  var BX = [70, 200, 330], GX = [52, 146, 254, 348];
  var grid = WORDS.map(function(_, i){ return [60 + (i % 4) * 93, 104 + Math.floor(i / 4) * 34]; });
  var gi = [0, 0, 0, 0], dest = WORDS.map(function(w){ var k = nB(w), j = gi[k]++; return [GX[k], 98 + j * 28]; });
  var h = "";
  BX.forEach(function(x, i){
    h += '<g class="bt-hb"><text class="bt-hp" x="' + (x - 42) + '" y="40">(</text><text class="bt-hla" x="' + (x - 22) + '" y="40" id="bt-hx' + i + 'a">a</text><text class="bt-hp" x="' + x + '" y="40">+</text><text class="bt-hlb" x="' + (x + 22) + '" y="40" id="bt-hx' + i + 'b">b</text><text class="bt-hp" x="' + (x + 42) + '" y="40">)</text></g>' +
      '<circle class="bt-hring" id="bt-hr' + i + '" cx="' + (x - 22) + '" cy="33" r="14" style="opacity:0"/>';
  });
  WORDS.forEach(function(w, i){
    h += '<text class="bt-hw" id="bt-hw' + i + '" text-anchor="middle">' + w.split("").map(function(ch, j){ return '<tspan class="bt-hl' + ch + '" data-j="' + j + '">' + ch + "</tspan>"; }).join("") + "</text>";
  });
  GX.forEach(function(x, k){ h += '<text class="bt-hcnt" id="bt-hc' + k + '" x="' + x + '" y="190" style="opacity:0">×' + [1, 3, 3, 1][k] + "</text>"; });
  var TERMS = [["1", "a", "³", "", ""], ["3", "a", "²", "b", ""], ["3", "a", "", "b", "²"], ["1", "", "", "b", "³"]];
  h += '<g id="bt-hterms" style="opacity:0">';
  TERMS.forEach(function(t, k){
    h += '<text class="bt-hterm" x="' + GX[k] + '" y="226" text-anchor="middle">' + t[0] + (t[1] ? '<tspan class="bt-hla">a</tspan>' + (t[2] ? '<tspan class="bt-hsup">' + t[2] + "</tspan>" : "") : "") + (t[3] ? '<tspan class="bt-hlb">b</tspan>' + (t[4] ? '<tspan class="bt-hsup">' + t[4] + "</tspan>" : "") : "") + "</text>";
    if (k < 3) h += '<text class="bt-hp sm" x="' + ((GX[k] + GX[k + 1]) / 2) + '" y="226" text-anchor="middle">+</text>';
  });
  h += "</g>";
  for (var r = 0; r <= 3; r++) for (var j = 0; j <= r; j++) {
    var x = 200 + (j - r / 2) * 32, y = 262 + r * 24;
    if (r === 3) h += '<rect class="bt-hrow" x="' + (x - 13) + '" y="' + (y - 13) + '" width="26" height="21" rx="5" style="opacity:0"/>';
    h += '<text class="bt-htri' + (r === 3 ? " r3" : "") + '" x="' + x + '" y="' + y + '" text-anchor="middle">' + C(r, j) + "</text>";
  }
  h += '<text class="bt-hrowl" id="bt-hrowl" x="120" y="334" text-anchor="end" style="opacity:0">row 3</text>';
  svg.innerHTML = h;
  var words = WORDS.map(function(_, i){ return $("#bt-hw" + i, svg); });
  function wordAt(i, x, y, shown){ var el = words[i]; el.setAttribute("x", x.toFixed(1)); el.setAttribute("y", y.toFixed(1)); $$("tspan", el).forEach(function(ts, j){ ts.setAttribute("visibility", j < shown ? "visible" : "hidden"); }); }
  function ring(i, ch, on){ var c = $("#bt-hr" + i, svg); c.setAttribute("cx", BX[i] + (ch === "a" ? -22 : 22)); c.style.opacity = on ? 1 : 0; }
  function rowOn(on){ $$(".bt-hrow", svg).forEach(function(el){ el.style.opacity = on ? 1 : 0; }); $$(".bt-htri.r3", svg).forEach(function(el){ el.classList.toggle("on", on); }); $("#bt-hrowl", svg).style.opacity = on ? 1 : 0; }
  function finalFrame(){
    WORDS.forEach(function(_, i){ wordAt(i, dest[i][0], dest[i][1], 3); });
    [0, 1, 2].forEach(function(i){ ring(i, "a", false); });
    $$(".bt-hcnt", svg).forEach(function(el){ el.style.opacity = 1; });
    $("#bt-hterms", svg).style.opacity = 1; rowOn(true);
    cap.innerHTML = M("(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3") + ": row 3 of Pascal’s triangle";
  }
  if (MV.reduceMotion) { finalFrame(); return; }
  WORDS.forEach(function(_, i){ wordAt(i, grid[i][0], grid[i][1], 0); });
  cap.innerHTML = "Pick " + M("a") + " or " + M("b") + " from each bracket.";
  var steps = [];
  WORDS.forEach(function(w, i){ for (var j = 0; j < 3; j++) steps.push([i, j]); steps.push([i, 3]); });
  var s = 0;
  (function next(){
    if (s >= steps.length) {
      [0, 1, 2].forEach(function(i){ ring(i, "a", false); });
      cap.innerHTML = "8 words: " + M("2 × 2 × 2 = 8") + ". Now group them by the number of " + M("b") + "’s.";
      MV.wait(1100, function(){
        MV.tween({ dur:1300, step:function(t){ WORDS.forEach(function(_, i){ wordAt(i, grid[i][0] + (dest[i][0] - grid[i][0]) * t, grid[i][1] + (dest[i][1] - grid[i][1]) * t, 3); }); }, done:function(){
          $$(".bt-hcnt", svg).forEach(function(el){ el.style.opacity = 1; });
          cap.innerHTML = "Groups of 1, 3, 3, 1";
          MV.wait(900, function(){ $("#bt-hterms", svg).style.opacity = 1; MV.wait(700, function(){ rowOn(true); MV.wait(500, finalFrame); }); });
        } });
      });
      return;
    }
    var st = steps[s++], i = st[0], j = st[1];
    if (j < 3) { ring(j, WORDS[i][j], true); wordAt(i, grid[i][0], grid[i][1], j + 1); MV.wait(170, next); }
    else { [0, 1, 2].forEach(function(b){ ring(b, "a", false); }); MV.wait(220, next); }
  })();
}

// ---------- Part 3: Working backwards ----------
// @component balanceScale — a two-pan balance (SVG) that tips toward the heavier pan; tilt eases with MV.tween (instant
// with reduced motion). bal = balanceScale(host, {aria}); bal.set(left, right, leftLabel, rightLabel)
function balanceScale(host, o){
  host.innerHTML = '<svg class="bt-bal" viewBox="0 0 320 178" role="img" aria-label="' + MV.esc(o.aria || "Balance") + '"><polygon class="bt-bstand" points="160,58 138,160 182,160"/><rect class="bt-bbase" x="104" y="160" width="112" height="8" rx="3"/>' +
    '<g class="bt-bbeam"><rect x="38" y="52" width="244" height="8" rx="4"/></g><circle class="bt-bpiv" cx="160" cy="56" r="6"/>' +
    '<g class="bt-bpan" data-p="L"><line x1="0" y1="0" x2="-26" y2="56"/><line x1="0" y1="0" x2="26" y2="56"/><path d="M-36 56 h72 a36 12 0 0 1 -72 0z"/><rect class="bt-bw" x="-30" y="26" width="60" height="28" rx="5"/><text class="bt-bwt" x="0" y="45" text-anchor="middle"></text></g>' +
    '<g class="bt-bpan" data-p="R"><line x1="0" y1="0" x2="-26" y2="56"/><line x1="0" y1="0" x2="26" y2="56"/><path d="M-36 56 h72 a36 12 0 0 1 -72 0z"/><rect class="bt-bw" x="-30" y="26" width="60" height="28" rx="5"/><text class="bt-bwt" x="0" y="45" text-anchor="middle"></text></g></svg>';
  var svg = $("svg", host), beam = $(".bt-bbeam", svg), pans = $$(".bt-bpan", svg), ang = 0, stop = null;
  function draw(a){
    ang = a; var r = a * Math.PI / 180, cx = 160, cy = 56, L = 112;
    beam.setAttribute("transform", "rotate(" + a.toFixed(2) + " " + cx + " " + cy + ")");
    pans[0].setAttribute("transform", "translate(" + (cx - L * Math.cos(r)).toFixed(1) + " " + (cy - L * Math.sin(r)).toFixed(1) + ")");
    pans[1].setAttribute("transform", "translate(" + (cx + L * Math.cos(r)).toFixed(1) + " " + (cy + L * Math.sin(r)).toFixed(1) + ")");
  }
  draw(0);
  return {
    set:function(lv, rv, ltxt, rtxt, aria){
      $(".bt-bwt", pans[0]).textContent = ltxt; $(".bt-bwt", pans[1]).textContent = rtxt;
      svg.setAttribute("aria-label", aria);
      var target = -14 * Math.max(-1, Math.min(1, (lv - rv) / rv)), from = ang;
      if (stop) stop();
      stop = MV.tween({ dur:450, step:function(t){ draw(from + (target - from) * t); }, done:function(){ stop = null; } });
    }
  };
}
// @component D6 simulator (copied from MDM4U 01 / 05) — repeatable trials, running tallies and a running relative-frequency graph.
// sim = makeSim({ trial:function(rng) -> outcome key, seed:"…", repeatable:true }); sim.run(n, {step, done}); sim.seq; sim.counts.
// drawRelFreq(plot, { seq, series:[{ pred(key) -> bool, color, theory }], describe })
function makeSim(o){
  var s = { seq:[], counts:{}, rep:o.repeatable !== false, seed:o.seed, rng:null, raf:null };
  function stop(){ if (s.raf) cancelAnimationFrame(s.raf); s.raf = null; }
  function one(){ var k = o.trial(s.rng); s.seq.push(k); s.counts[k] = (s.counts[k] || 0) + 1; }
  s.reset = function(){ stop(); s.seq = []; s.counts = {}; s.rng = MV.mdm.seededRandom(s.rep ? s.seed : Math.floor(Math.random() * 4294967296)); };
  s.setRepeatable = function(b){ s.rep = !!b; s.reset(); };
  s.run = function(n, cb){
    stop(); cb = cb || {};
    if (MV.reduceMotion) { for (var i = 0; i < n; i++) one(); if (cb.step) cb.step(s); if (cb.done) cb.done(s); return; }
    var left = n, frames = Math.min(40, Math.max(5, Math.ceil(n / 12))), per = Math.ceil(n / frames);
    (function tick(){ var m = Math.min(per, left); for (var j = 0; j < m; j++) one(); left -= m; if (cb.step) cb.step(s);
      if (left > 0) s.raf = requestAnimationFrame(tick); else { s.raf = null; if (cb.done) cb.done(s); } })();
  };
  s.stop = stop; s.busy = function(){ return !!s.raf; };
  s.reset();
  return s;
}
function drawRelFreq(plot, o){
  var seq = o.seq, n = seq.length, xmax = Math.max(10, n), every = Math.max(1, Math.ceil(n / 600)), curves = [], segs = [], pts1 = [];
  o.series.forEach(function(s){
    var h = 0, pts = [];
    for (var i = 0; i < n; i++) { if (s.pred(seq[i])) h++; if ((i + 1) % every === 0 || i === n - 1) pts.push([i + 1, h / (i + 1)]); }
    if (pts.length > 1) curves.push({ pts:pts, color:s.color, width:2.6 }); else if (pts.length === 1) pts1.push({ x:pts[0][0], y:pts[0][1], color:s.color, r:4 });
    if (s.theory != null) segs.push({ x1:0, y1:s.theory, x2:xmax, y2:s.theory, color:s.color, width:1.6, dash:[7, 6] });
  });
  plot.draw({ view:{ xmin:-xmax * 0.07, xmax:xmax * 1.02, ymin:-0.08, ymax:1.06 }, grid:true, yTicks:{ step:0.25, fmt:function(v){ return MV.num(v, 2); } },
    xTicks:{ fmt:function(v){ return MV.num(v, 0); } }, curves:curves, segments:segs, points:pts1, xLabel:"sets of 4 tosses", yLabel:"relative frequency", describe:o.describe });
}
function coinSeqs(h){ var out = []; for (var m = 0; m < 16; m++) { var w = ""; for (var j = 3; j >= 0; j--) w += (m >> j) & 1 ? "T" : "H"; if ((w.match(/H/g) || []).length === h) out.push(w); } return out; }
function coinHTML(w){ return '<span class="bt-cseq">' + w.split("").map(function(c){ return '<span class="bt-coin bt-coin' + c + '">' + c + "</span>"; }).join("") + "</span>"; }
function hTermSrc(h){ var c = C(4, h), t = 4 - h; return (c === 1 ? "" : c) + (h ? "H" + (h > 1 ? "^" + h : "") : "") + (t ? "T" + (t > 1 ? "^" + t : "") : ""); }

function part3(host, api){
  var S = api.S, ST = api.content.stations, F = MV.mdm.frac;
  S.n1 = clampInt(S.n1, 2, 12, 4); S.k2 = clampInt(S.k2, -5, 5, 1);
  S.found2 = Array.isArray(S.found2) ? S.found2.filter(function(v){ return v === 3 || v === -3; }) : [];
  S.h3 = clampInt(S.h3, 0, 4, 2); S.rep3 = S.rep3 !== false;
  function algHTML(s){ return '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + s.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details>"; }
  host.innerHTML =
    '<div class="bt3-st" data-st="1"><h3>' + ST[0].title + "</h3><p>" + ST[0].ask + '</p><div class="sym"><div><div id="bt3-bal1"></div></div><div>' +
      '<label class="slider"><span class="slider-top"><span>' + M("n") + '</span><output id="bt3-n-out"></output></span><input type="range" id="bt3-n" min="2" max="12" step="1"></label><p class="tiny muted">' + ST[0].how + '</p>' +
      '<dl class="read" id="bt3-read1" aria-live="polite"></dl><div id="bt3-fb1" aria-live="polite"></div>' + algHTML(ST[0]) + "</div></div></div>" +
    '<div class="bt3-st part" data-st="2"><h3>' + ST[1].title + "</h3><p>" + ST[1].ask + '</p><div class="sym"><div><div id="bt3-bal2"></div></div><div>' +
      '<label class="slider"><span class="slider-top"><span>' + M("k") + '</span><output id="bt3-k-out"></output></span><input type="range" id="bt3-k" min="-5" max="5" step="1"></label><p class="tiny muted">' + ST[1].how + '</p>' +
      '<dl class="read" id="bt3-read2" aria-live="polite"></dl><div id="bt3-fb2" aria-live="polite"></div>' + algHTML(ST[1]) + "</div></div></div>" +
    '<div class="bt3-st part" data-st="3"><h3>' + ST[2].title + "</h3><p>" + ST[2].ask + '</p><p class="bt3-exp">' + M("(H + T)^4 =") + ' <span class="bt3-terms" id="bt3-terms"></span></p>' +
      '<div class="sym"><div><div id="bt3-seqs" aria-live="polite"></div><dl class="read" id="bt3-read3" aria-live="polite"></dl>' + algHTML(ST[2]) + "</div>" +
      '<div><p class="bt3-simh">Simulator: toss a coin 4 times, 1600 times over</p><div class="q-actions"><button type="button" class="btn primary sm" id="bt3-go">Toss 1600 sets of 4</button><button type="button" class="btn ghost sm" id="bt3-reset">Reset</button><label class="bt3-check"><input type="checkbox" id="bt3-rep"> Repeatable run</label></div>' +
      '<div class="plot-wrap"><canvas class="plot wide" id="bt3-rf" role="img" aria-label="Relative frequency graph"></canvas></div><p class="legend tiny"><span><i class="sw" style="background:var(--pen)"></i>relative frequency</span><span><i class="sw dash"></i>theory (dashed)</span></p>' +
      '<div id="bt3-tally"></div></div></div></div>';

  // station 1: C(n, 2) = 28
  var bal1 = balanceScale($("#bt3-bal1", host), { aria:"Balance" }), nI = $("#bt3-n", host);
  nI.value = S.n1;
  nI.addEventListener("input", function(){ S.n1 = +nI.value; api.save(); paint1(); });
  function paint1(){
    var n = S.n1, L = C(n, 2), R = 28;
    $("#bt3-n-out", host).textContent = String(n); nI.setAttribute("aria-valuetext", "n = " + n);
    var state = L < R ? "lighter" : L > R ? "heavier" : "level";
    bal1.set(L, R, String(L), "28", "Balance: left pan C(" + n + ", 2) = " + L + ", right pan 28. " + (state === "level" ? "The pans are level." : "The left pan is " + state + "."));
    $("#bt3-read1", host).innerHTML = MV.readoutHTML([["Left pan", M("C(" + n + ", 2) = {" + n + " × " + (n - 1) + "}/{2} = " + L)], ["Right pan", "28"]]);
    $("#bt3-fb1", host).innerHTML = state === "level" ? MV.fbHTML("good", "<strong>✓ Balanced:</strong> " + M("C(8, 2) = 28") + ", so " + M("n = 8") + ".") :
      '<p class="bt3-msg">' + M("C(" + n + ", 2) = " + L) + " is " + (state === "lighter" ? "less" : "more") + " than 28: the left pan is " + state + ". Try a " + (state === "lighter" ? "larger" : "smaller") + " " + M("n") + ".</p>";
  }
  // station 2: C(5, 2)k^2 = 90
  var bal2 = balanceScale($("#bt3-bal2", host), { aria:"Balance" }), kI = $("#bt3-k", host);
  kI.value = S.k2;
  kI.addEventListener("input", function(){ S.k2 = +kI.value; if (S.k2 * S.k2 === 9 && S.found2.indexOf(S.k2) < 0) S.found2.push(S.k2); api.save(); paint2(); });
  function paint2(){
    var k = S.k2, L = 10 * k * k, R = 90, ks = k < 0 ? "(" + k + ")" : String(k);
    $("#bt3-k-out", host).textContent = MV.num(k); kI.setAttribute("aria-valuetext", "k = " + MV.num(k));
    var state = L < R ? "lighter" : L > R ? "heavier" : "level";
    bal2.set(L, R, String(L), "90", "Balance: left pan 10 k squared = " + L + ", right pan 90. " + (state === "level" ? "The pans are level." : "The left pan is " + state + "."));
    var both = S.found2.length === 2;
    $("#bt3-read2", host).innerHTML = MV.readoutHTML([["Left pan", M("C(5, 2)k^2 = 10 × " + ks + "^2 = " + L)], ["Right pan", "90"],
      ["Values that balance", S.found2.length ? S.found2.slice().sort(function(a, b){ return b - a; }).map(function(v){ return M("k = " + v); }).join(" and ") + (both ? "" : " (is there another?)") : "none found yet"]]);
    var fb;
    if (state === "level") fb = both ? MV.fbHTML("good", "<strong>✓ Both balance:</strong> " + M("k = 3") + " and " + M("k = -3") + ". Squaring hides the sign, " + M("(-3)^2 = 9") + " too, so " + M("k = ±3") + ".") :
      MV.fbHTML("good", "<strong>✓ Balanced at " + M("k = " + k) + ":</strong> " + M("10 × " + ks + "^2 = 90") + ". Is that the only value? " + M("k^2 = 9") + " has two solutions.");
    else fb = '<p class="bt3-msg">' + M("10 × " + ks + "^2 = " + L) + " is " + (state === "lighter" ? "less" : "more") + " than 90: the left pan is " + state + "." + (both ? " You’ve found both values: " + M("k = ±3") + "." : "") + "</p>";
    $("#bt3-fb2", host).innerHTML = fb;
  }
  // station 3: (H + T)^4 and the coin simulator (D6, seeded)
  var termsR = radios($("#bt3-terms", host), { aria:"Terms of (H + T) to the 4th", options:[4, 3, 2, 1, 0].map(function(h){ return { id:h, t:M(hTermSrc(h)) }; }), value:S.h3, cls:"chips bt3-tchips",
    onChange:function(v){ S.h3 = +v; api.save(); paint3(); } });
  var sim = makeSim({ seed:121, repeatable:S.rep3, trial:function(r){ var h = 0; for (var i = 0; i < 4; i++) if (r() < 0.5) h++; return String(h); } });
  var plot = new MV.Plot($("#bt3-rf", host), { xmin:0, xmax:10, ymin:0, ymax:1 });
  plot.render = function(){
    var h = S.h3, th = C(4, h) / 16;
    drawRelFreq(plot, { seq:sim.seq, series:[{ pred:function(x){ return +x === h; }, color:css("--pen"), theory:th }],
      describe:sim.seq.length ? "Running relative frequency of exactly " + h + " heads over " + sim.seq.length + " sets of 4 tosses, settling near the dashed theoretical line at " + F.dec(F.of(C(4, h), 16), 4) + "." : "Empty relative frequency graph. Press Toss 1600 sets of 4." });
  };
  $("#bt3-rep", host).checked = S.rep3;
  $("#bt3-go", host).addEventListener("click", function(){ if (sim.busy()) return; var b = $("#bt3-go", host); b.disabled = true; sim.run(1600, { step:paintSim, done:function(){ b.disabled = false; paintSim(); } }); });
  $("#bt3-reset", host).addEventListener("click", function(){ sim.reset(); $("#bt3-go", host).disabled = false; paintSim(); });
  $("#bt3-rep", host).addEventListener("change", function(e){ S.rep3 = e.target.checked; api.save(); sim.setRepeatable(S.rep3); $("#bt3-go", host).disabled = false; paintSim(); });
  function paint3(){
    var h = S.h3, c = C(4, h), seqs = coinSeqs(h);
    termsR.set(String(h));
    $("#bt3-seqs", host).innerHTML = '<p class="bt3-seqh">' + M(hTermSrc(h)) + ": <strong>" + c + "</strong> sequence" + (c === 1 ? "" : "s") + " with exactly " + h + " head" + (h === 1 ? "" : "s") + "</p>" +
      '<div class="bt3-seqs">' + seqs.map(coinHTML).join("") + "</div>";
    $("#bt3-read3", host).innerHTML = MV.readoutHTML([
      ["Sequences of 4 tosses", M("2^4 = 16") + ", all equally likely"],
      ['<span class="m"><i>P</i></span>(exactly ' + h + " head" + (h === 1 ? "" : "s") + " in 4 fair tosses)", M("C(4, " + h + ")/2^4") + " = " + MV.mdm.frac.prob(c, 16)]
    ]);
    paintSim();
  }
  function paintSim(){
    var h = S.h3, n = sim.seq.length, hits = 0;
    for (var i = 0; i < n; i++) if (+sim.seq[i] === h) hits++;
    var th = F.of(C(4, h), 16);
    $("#bt3-tally", host).innerHTML = MV.tableHTML({ head:["Sets of 4 tosses", "Exactly " + h + " head" + (h === 1 ? "" : "s"), "Relative frequency", "Theory"], caption:"Simulation tally",
      rows:[[n ? String(n) : "–", n ? String(hits) : "–", n ? hits + "/" + n + " ≈ " + F.dec(F.of(hits, n), 4) : "–", F.txt(th) + (F.exactDec(th, 4) ? " = " : " ≈ ") + F.dec(th, 4)]] }) +
      '<p class="tiny muted">' + (n ? n + " sets so far" + (S.rep3 ? " (repeatable run)" : " (random run)") + (S.rep3 && n === 1600 ? ' <span class="mdm-model">model data</span>' : "") + (n === 1600 ? ". Close to the theory, not exact." : "") : "No tosses yet.") + "</p>";
    plot.render();
  }
  paint1(); paint2(); paint3();
  return {};
}

// ---------- Practice: Expand it ----------
// @component N4 coefList — fill-in-the-coefficients by list: type an expansion's coefficients (highest power first, separated
// by commas or spaces); a live preview typesets the expansion the list makes; judged in order, with named wrong lists
// (wrong:[{match:[…], fb}]), a term-count check and a sign check. First try = right on the first Check without the worked solution.
// items: [{id, goal, bin (html), first:{c, p}, second:{c, p}, sym (a/b template), n, answer:[…], note, wrong, why, hints:[3]}]
function coefList(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ return st.items[id] || (st.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  function parse(raw){
    var s = String(raw == null ? "" : raw).replace(/[−–]/g, "-").trim(); if (!s) return null;
    var parts = s.split(/[,;\s]+/).filter(Boolean), out = [];
    for (var i = 0; i < parts.length; i++) { if (!/^[+-]?\d+$/.test(parts[i])) return "bad"; out.push(parseInt(parts[i], 10)); }
    return out;
  }
  function same(x, y){ return x.length === y.length && x.every(function(v, i){ return v === y[i]; }); }
  function preview(it, v){
    if (!v || v === "bad" || !v.length) return "";
    var n = it.n, extra = v.length > n + 1, B = it.sym ? { sym:true, c1:1, c2:1 } : { c1:1, p1:it.first.p, c2:1, p2:it.second.p };
    var ts = v.slice(0, n + 1).map(function(c, i){ return { k:i, coef:c, e:(B.p1 || 0) * (n - i) + (B.p2 || 0) * i }; });
    var src = ts.map(function(t, i){ var body = t.coef === 0 ? (B.sym ? "0" + bodySrc(B, n, { k:t.k, coef:1 }) : "0" + xSrc(1, t.e).replace(/^1$/, "")) : bodySrc(B, n, t); return (t.coef < 0 ? (i ? "- " : "-") : (i ? "+ " : "")) + body; });
    return '<p class="bt-pv">Your expansion: ' + src.map(function(s){ return '<span class="bt-t">' + M(s) + "</span>"; }).join(" ") + (extra ? ' <span class="muted">(you typed ' + v.length + " numbers; only " + (n + 1) + " fit)</span>" : "") + "</p>";
  }
  function judge(it, raw){
    var v = parse(raw), ans = MV.ans(it);
    if (v == null) return { bad:"Type the coefficients first, separated by commas." };
    if (v === "bad") return { bad:"Type whole numbers separated by commas, such as 1, −4, 6." };
    if (same(v, ans)) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ return same(v, w.match); })[0];
    if (named) return { ok:false, fb:named.fb };
    if (v.length !== ans.length) return { ok:false, fb:it.bin + " has " + ans.length + " terms, so type " + ans.length + " coefficients." };
    if (v.every(function(x, i){ return Math.abs(x) === Math.abs(ans[i]); })) return { ok:false, fb:"Check the signs." + (it.second.c < 0 ? " The second part is negative, so its odd powers are negative." : " Every part here is positive.") };
    return { ok:false, fb:"Check each coefficient: " + M("C(n, k)") + " × (first part)" + M("^{n - k}") + " × (second part)" + M("^k") + "." };
  }
  function itemHTML(it, i){
    var x = ist(it.id), v = parse(x.val);
    var h = '<div class="q" data-ni="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">Expand ' + it.bin + (it.note ? ' <span class="muted">(coefficients ' + it.note + ")</span>" : "") + ".</div></div>";
    h += '<div class="numrow"><label for="cl-' + it.id + '">Coefficients, highest power first:</label><input class="numin bt-clin" id="cl-' + it.id + '" data-nin="' + it.id + '" type="text" inputmode="text" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
    h += '<div class="bt-pvbox" data-pv="' + it.id + '" aria-live="polite">' + preview(it, v) + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (it.why || "") + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + (a.how || "") + "</p>" + a.items.map(itemHTML).join(""); }); }
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.nin; if (!id) return;
    var it = a.items.filter(function(z){ return z.id === id; })[0];
    ist(id).val = e.target.value; api.save();
    var pvb = host.querySelector('[data-pv="' + id + '"]'); if (pvb) pvb.innerHTML = preview(it, parse(e.target.value));
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var b = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ni]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.ni; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-ni="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ni="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a binomial ----------
var task = (function(){
  var api = null, S = null, pv = null, rA, rB, rN;
  var AS = [1, 2, 3], BS = [-3, -2, -1, 1, 2, 3], NS = [2, 3, 4, 5, 6];
  function d(){ return { a:S.a, b:S.b, n:S.n }; }
  function x2(x){ return C(x.n, 2) * x.a * x.a * ipow(x.b, x.n - 2); }
  function x1(x){ return x.n * x.a * ipow(x.b, x.n - 1); }
  function lead(x){ return ipow(x.a, x.n); }
  function src(a, b, n){ return "(" + (a === 1 ? "" : a) + "x " + (b < 0 ? "- " + (-b) : "+ " + b) + ")^" + n; }
  function paint(){
    var x = d(), Bn = { c1:x.a, p1:1, c2:x.b, p2:0 }, ts = terms(Bn, x.n);
    pv.innerHTML = '<p class="bt-tk-eq">' + M(src(x.a, x.b, x.n)) + " =</p>" + '<p class="bt-tk-exp">' + expHTML(Bn, x.n) + "</p>" +
      MV.tableHTML({ head:["Term", "Coefficient", "Checklist"], caption:"Every coefficient",
        rows:ts.map(function(t){
          var tag = t.e === x.n ? "leading (line 3)" : t.e === 2 ? "line 1" : t.e === 1 ? "line 2" : "";
          if (t.e === 2 && x.n === 2) tag = "leading (line 3); line 1";
          return [t.e === 0 ? "constant" : M(xSrc(1, t.e)), M(String(t.coef)), tag];
        }) }) +
      '<dl class="read bt-tk-read" aria-live="polite">' + MV.readoutHTML([
        [M("x^2") + " coefficient", M("C(" + x.n + ", 2) × " + x.a + "^2 × " + (x.b < 0 ? "(" + x.b + ")" : x.b) + "^" + (x.n - 2) + " = " + x2(x))],
        [M("x") + " coefficient", M("C(" + x.n + ", 1) × " + x.a + " × " + (x.b < 0 ? "(" + x.b + ")" : x.b) + "^" + (x.n - 1) + " = " + x1(x))],
        ["Leading coefficient", M(x.a + "^" + x.n + " = " + lead(x))]]) + "</dl>";
  }
  return {
    render:function(inHost, pvHost, a){
      api = a; S = a.S; pv = pvHost;
      if (AS.indexOf(S.a) < 0) S.a = 1; if (BS.indexOf(S.b) < 0) S.b = 2; if (NS.indexOf(S.n) < 0) S.n = 3;
      inHost.innerHTML = '<div class="bt-tk-in"><div id="bt-tk-a"></div><div id="bt-tk-b"></div><div id="bt-tk-n"></div></div>';
      function on(f){ return function(v){ S[f] = +v; api.save(); paint(); api.update(); }; }
      rA = radios($("#bt-tk-a"), { label:M("a"), aria:"a", options:AS.map(function(v){ return { id:v, t:String(v) }; }), value:S.a, cls:"chips", onChange:on("a") });
      rB = radios($("#bt-tk-b"), { label:M("b"), aria:"b", options:BS.map(function(v){ return { id:v, t:MV.num(v) }; }), value:S.b, cls:"chips", onChange:on("b") });
      rN = radios($("#bt-tk-n"), { label:M("n"), aria:"n", options:NS.map(function(v){ return { id:v, t:String(v) }; }), value:S.n, cls:"chips", onChange:on("n") });
      // "After all four" note (the toolkit's after3 line would show after three answers)
      var tc = $("#task-check");
      if (tc) tc.addEventListener("click", function(){
        setTimeout(function(){
          var fb = $("#task-fb .fb.good"), T = MV.C.task;
          if (fb && T.afterAll && MV.taskState().found.length >= 4 && !$(".bt-tk-all", fb)) { var p = document.createElement("p"); p.className = "bt-tk-all"; p.innerHTML = T.afterAll; fb.appendChild(p); }
        }, 0);
      });
      paint();
    },
    read:function(){ return d(); },
    valid:function(x){ return AS.indexOf(x.a) >= 0 && BS.indexOf(x.b) >= 0 && NS.indexOf(x.n) >= 0 ? true : "Choose " + M("a") + ", " + M("b") + " and " + M("n") + "."; },
    checks:function(x){ var c2 = x2(x); return [c2 >= 20 && c2 <= 100, x1(x) < 0, lead(x) <= 16]; },
    key:function(x){ return x.a + "," + x.b + "," + x.n; },
    label:function(k){ var p = k.split(",").map(Number); return '<span class="bt-nw">' + M(src(p[0], p[1], p[2])) + "</span>"; },
    text:function(k){ var p = k.split(",").map(Number); return MV.plain(M(src(p[0], p[1], p[2]))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ expand:coefList },
  task:task
});
})();
