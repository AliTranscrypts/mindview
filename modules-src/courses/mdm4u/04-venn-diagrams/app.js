// MDM4U 04 Venn Diagrams & Set Operations: hero (the four regions light up with their names; the outside is A′ ∩ B′),
// Venn workbench (Explore: D2 Venn with 2 or 3 sets; Shade → name, Name → shade with a chip notation builder, Survey fill
// with number boxes in the regions, De Morgan side by side with hatching), "Three-set puzzles" stations (Part 3: inside-out
// fill in a forced order, region-count colouring as the formula runs, probabilities ÷ n(S)), and the Club census task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.mdm.frac, MI = "−", AB = "abc";
function intOf(s){ s = String(s == null ? "" : s).trim().replace(/−/g, "-"); if (!s) return null; var v = Number(s); return Number.isInteger(v) ? v : NaN; }
function isNum(v){ return typeof v === "number" && !isNaN(v); }
function muted(h){ return '<span class="muted">' + h + "</span>"; }
function arr(x){ return Array.isArray(x) ? x.slice() : []; }
function same(a, b){ a = a.slice().sort(); b = b.slice().sort(); return a.length === b.length && a.every(function(x, i){ return x === b[i]; }); }
function N(v){ return MV.num(v, 0); }

// @component radioGroup (copied from MDM4U 02 / 03; a value that matches no option leaves the first option tabbable)
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 && !off(val) ? val : ids.filter(function(id){ return !off(id); })[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + tab + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
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

// @component D2 vennDiagram — Venn diagram (course plan D2), self-contained; extended from MDM4U 03 (tokens dropped): 2 or 3
// event circles (--ev-a/b/c) in a sample-space box. Tap a region, or its button in the strip under the box (fixed keyboard
// order: A only, B only, [C only, A and B only, A and C only, B and C only,] both / all three, outside), to shade it in
// highlighter. Values per region (counts, ×n labels, region numbers); number boxes inside the regions (survey fill); hatching
// layers in two directions (De Morgan); pulsing regions; per-region count colouring c1–c3; live set notation for any set of
// regions with equivalent names, simplest first (A ∩ B′ = A − B, (A ∪ B)′ = A′ ∩ B′ …, found by search) and a words reading.
// v = vennDiagram(host, {sets:2|3, letters:["A","B","C"], shade:true, strip:true, note:true, universe:"S", stripAria,
//       onShade(codes), onInput(code, text), stripNote(code) -> html, noteExtra(codes) -> html, inputLabel(code) -> text})
// v.set({letters, names:[html], values:{code:html}, inputs:bool, inVals:{code:text}, hatch:[{codes, dir:"h"|"v"}],
//       pulse:[codes], fills:{code:"c1"|"c2"|"c3"}, shade:[codes]})        (each key optional; redraws)
// v.shade(codes) (no redraw: shading fades) · v.shaded() · v.names(codes) -> [simplest, …equivalents] · v.words(codes) -> html
// v.regionName(code) -> "A only" · v.regionText(code) -> "in A only" · v.codes · v.refresh() (strip + note) · v.relayout() · v.el
// Region codes: "a", "b", "c" (only), "ab", "ac", "bc" (exactly those two), "abc", "o" (outside every circle).
var VD_UID = 0, VD_TBL = {};
function vdCodes(n){ return n === 3 ? ["a", "b", "c", "ab", "ac", "bc", "abc", "o"] : ["a", "b", "ab", "o"]; }
function vdMaskOf(R, cs){ var m = 0; cs.forEach(function(c){ var i = R.indexOf(c); if (i >= 0) m |= 1 << i; }); return m; }
function vdCodesOf(R, m){ return R.filter(function(c, i){ return m & (1 << i); }); }
function vdLit(R, j){ var m = 0; R.forEach(function(c, i){ if (c.indexOf(AB[j]) >= 0) m |= 1 << i; }); return m; }
// every region set's names: cheapest expressions in A, B, C, ′, ∪, ∩ (up to 4 per set) plus a set-difference form
function vdTable(n, L){
  var id = n + L.join(""); if (VD_TBL[id]) return VD_TBL[id];
  var R = vdCodes(n), full = (1 << R.length) - 1, alt = {}, best = {}, diff = {}, lit = [], j, k;
  function okey(s){ for (var i = 0; i < s.length; i++) { var q = L.indexOf(s[i]); if (q >= 0) return q * 2 + (s[i + 1] === "′" ? 1 : 0); } return 9; }
  function terms(X, op){ return X.op === op ? X.t : [X.op ? "(" + X.s + ")" : X.s]; }
  function join(X, Y, op){
    var t = terms(X, op).concat(terms(Y, op)), seen = {};
    for (var i = 0; i < t.length; i++) { if (seen[t[i]]) return null; seen[t[i]] = 1; }
    t.sort(function(p, q){ return okey(p) - okey(q) || p.length - q.length; });
    return { s:t.join(" " + op + " "), t:t };
  }
  function add(m, s, cost, op, t){
    var l = alt[m] || (alt[m] = []);
    for (var i = 0; i < l.length; i++) if (l[i].s === s) return;
    l.push({ s:s, cost:cost, op:op, t:t });
    l.sort(function(p, q){ return p.cost - q.cost || p.s.length - q.s.length; });
    if (l.length > 4) l.length = 4;
    best[m] = l[0];
  }
  add(full, "S", 1, ""); add(0, "∅", 1, "");
  for (j = 0; j < n; j++) { lit[j] = vdLit(R, j); add(lit[j], L[j], 1, ""); add(full ^ lit[j], L[j] + "′", 2, ""); }
  for (var round = 0; round < 3; round++) {
    var keys = Object.keys(best).map(Number).filter(function(x){ return x !== 0 && x !== full; });
    for (var x = 0; x < keys.length; x++) for (var y = x + 1; y < keys.length; y++) {
      var X = best[keys[x]], Y = best[keys[y]], cost = X.cost + Y.cost + 1;
      if (cost > 11) continue;
      var U = join(X, Y, "∪"), I = join(X, Y, "∩");
      if (U) add(keys[x] | keys[y], U.s, cost, "∪", U.t);
      if (I) add(keys[x] & keys[y], I.s, cost, "∩", I.t);
    }
    Object.keys(best).forEach(function(q){ var B = best[q]; if (B.op) add(full ^ Number(q), "(" + B.s + ")′", B.cost + 1, ""); });
  }
  // set difference (an equivalent name only)
  var Xs = [], Ys = [];
  for (j = 0; j < n; j++) { Xs.push({ s:L[j], m:lit[j] }); Ys.push({ s:L[j], m:lit[j] }); }
  if (n === 3) for (j = 0; j < 3; j++) for (k = j + 1; k < 3; k++) { Xs.push({ s:"(" + L[j] + " ∩ " + L[k] + ")", m:lit[j] & lit[k] }); Ys.push({ s:"(" + L[j] + " ∪ " + L[k] + ")", m:lit[j] | lit[k] }); }
  Xs.forEach(function(P){ Ys.forEach(function(Q){
    var m = P.m & ~Q.m & full; if (!(P.m & Q.m) || !m) return;
    var s = P.s + " − " + Q.s; if (!diff[m] || s.length < diff[m].length) diff[m] = s;
  }); });
  return (VD_TBL[id] = { R:R, full:full, alt:alt, diff:diff, lit:lit });
}
function vdRegionText(n, L, c){
  var Lm = L.map(function(x){ return MV.m(x); });
  if (c === "o") return n === 2 ? "in neither " + Lm[0] + " nor " + Lm[1] : "in none of " + Lm[0] + ", " + Lm[1] + " and " + Lm[2];
  var ls = c.split("").map(function(ch){ return Lm[AB.indexOf(ch)]; });
  if (ls.length === 1) return "in " + ls[0] + " only";
  if (ls.length === 2) return n === 2 ? "in both " + ls[0] + " and " + ls[1] : "in " + ls[0] + " and " + ls[1] + " only";
  return "in all three";
}
function vdRegionName(n, L, c){
  if (c === "o") return n === 2 ? "Neither" : "None";
  var ls = c.split("").map(function(ch){ return MV.m(L[AB.indexOf(ch)]); });
  if (ls.length === 1) return ls[0] + " only";
  if (ls.length === 2) return n === 2 ? "Both " + ls[0] + " and " + ls[1] : ls[0] + " and " + ls[1] + " only";
  return "All three";
}
function vdNames(n, L, cs){
  var T = vdTable(n, L), m = vdMaskOf(T.R, cs), l = T.alt[m];
  if (!l) return [cs.map(function(c){ var b = T.alt[vdMaskOf(T.R, [c])]; return b ? "(" + b[0].s + ")" : c; }).join(" ∪ ")];
  var b = l[0], out = [b.s];
  if (T.diff[m]) out.push(T.diff[m]);
  l.slice(1).forEach(function(x){ if (out.length < 3 && x.cost <= b.cost + 2 && !/[S∅]/.test(x.s)) out.push(x.s); });
  return out;
}
// a plain-words reading of a set of regions (html: letters typeset)
function vdWords(n, L, cs){
  var R = vdCodes(n), full = (1 << R.length) - 1, m = vdMaskOf(R, cs), j, k, Lm = L.slice(0, n).map(function(x){ return MV.m(x); }), lit = [];
  function list(a, w){ return a.length === 1 ? a[0] : a.length === 2 ? a[0] + " " + w + " " + a[1] : a.slice(0, -1).join(", ") + " " + w + " " + a[a.length - 1]; }
  if (!m) return "nowhere: the empty set";
  if (m === full) return "anywhere in the sample space";
  for (j = 0; j < n; j++) lit[j] = vdLit(R, j);
  var P = Math.pow(3, n), cpl = null;
  for (var p = 1; p < P; p++) {
    var q = p, bm = full, pos = [], neg = [];
    for (j = 0; j < n; j++) { var s = q % 3; q = Math.floor(q / 3); if (s === 1) { bm &= lit[j]; pos.push(Lm[j]); } else if (s === 2) { bm &= full ^ lit[j]; neg.push(Lm[j]); } }
    if (bm === m) {
      if (pos.length && !neg.length) return pos.length === 1 ? "in " + pos[0] : pos.length === 2 ? "in both " + pos[0] + " and " + pos[1] : "in all three of " + list(pos, "and");
      if (pos.length) return "in " + list(pos, "and") + " but not in " + list(neg, "or");
      return neg.length === 1 ? "not in " + neg[0] : neg.length === 2 ? "in neither " + neg[0] + " nor " + neg[1] : "in none of " + list(neg, "and");
    }
    if (!cpl && (full ^ bm) === m && pos.length >= 2 && !neg.length) cpl = pos.length === 2 ? "not in both " + pos[0] + " and " + pos[1] : "not in all three of " + list(pos, "and");
  }
  for (var u = 3; u < (1 << n); u++) {
    var um = 0, us = []; for (j = 0; j < n; j++) if (u & (1 << j)) { um |= lit[j]; us.push(Lm[j]); }
    if (us.length >= 2 && um === m) return us.length === 2 ? "in " + us[0] + " or " + us[1] + " or both" : "in at least one of " + list(us, "and");
  }
  if (cpl) return cpl;
  var byK = []; for (k = 0; k <= n; k++) byK[k] = 0;
  R.forEach(function(c, i){ byK[c === "o" ? 0 : c.length] |= 1 << i; });
  var ks = []; for (k = 0; k <= n; k++) { if ((m & byK[k]) === byK[k]) ks.push(k); else if (m & byK[k]) { ks = null; break; } }
  if (ks) {
    var all = list(Lm, "and"), KW = { "1":"in exactly one of " + all, "2":"in exactly two of " + all, "23":"in at least two of " + all, "01":"in at most one of " + all, "12":"in one or two of " + all + ", but not all three" };
    if (KW[ks.join("")]) return KW[ks.join("")];
  }
  return vdCodesOf(R, m).map(function(c){ return vdRegionText(n, L, c); }).join(", or ");
}
function vennDiagram(host, o){
  o = o || {};
  var n = o.sets === 3 ? 3 : 2, L = (o.letters || ["A", "B", "C"]).slice(0, n), codes = vdCodes(n), uid = "vw" + (++VD_UID);
  var st = { names:[], values:{}, inputs:false, inVals:{}, hatch:[], pulse:[], fills:{} }, shade = {}, cur = null, inEl = {};
  var canShade = o.shade !== false, hasStrip = canShade && o.strip !== false;
  host.innerHTML = '<div class="vd' + (n === 3 ? " vd3" : "") + '"><p class="vd-names" aria-hidden="true"></p><div class="vd-box' + (canShade ? "" : " vd-ro") + '"><svg class="vd-svg" focusable="false" aria-hidden="true"></svg><div class="vd-vals" aria-hidden="true"></div><div class="vd-ins" hidden></div></div>' +
    (hasStrip ? '<div class="vd-strip" role="group" aria-label="' + MV.esc(o.stripAria || "Shade a region") + '"></div>' : "") + (canShade && o.note !== false ? '<p class="vd-note" aria-live="polite"></p>' : "") + "</div>";
  var root = host.firstChild, box = $(".vd-box", root), svg = $(".vd-svg", root), vals = $(".vd-vals", root), ins = $(".vd-ins", root), strip = $(".vd-strip", root), note = $(".vd-note", root), namesEl = $(".vd-names", root);
  function regionText(c){ return vdRegionText(n, L, c); }
  function regionName(c){ return vdRegionName(n, L, c); }
  function small(W){ return W < 480; }
  function baseH(W){ return Math.max(200, Math.round(n === 2 ? (small(W) ? 0.92 * W : 0.6 * W) : (small(W) ? 1.05 * W : 0.82 * W))); }
  function geom(W, H){
    var g = { W:W, H:H, pad:4, c:[], lab:[] }, r, dF = small(W) ? 0.95 : 0.98;
    if (n === 2) { var wl = small(W) ? (W - 12) / (2 + dF) : 0.262 * W * 2.98 / (2 + dF); r = Math.min(wl, (small(W) ? 0.42 : 0.4) * H); var d = dF * r, cy = H * 0.54; g.c = [{ x:W / 2 - d / 2, y:cy, r:r }, { x:W / 2 + d / 2, y:cy, r:r }]; }
    else { r = Math.min((small(W) ? 0.29 : 0.245) * W, (small(W) ? 0.255 : 0.25) * H); var cy3 = H * 0.47; g.c = [{ x:W / 2 - 0.6 * r, y:cy3 - 0.36 * r, r:r }, { x:W / 2 + 0.6 * r, y:cy3 - 0.36 * r, r:r }, { x:W / 2, y:cy3 + 0.68 * r, r:r }]; }
    var ang = n === 2 ? [-130, -50] : [-140, -40, 90];
    g.c.forEach(function(c, i){ var a = ang[i] * Math.PI / 180; g.lab.push({ x:c.x + Math.cos(a) * (c.r + 13), y:c.y + Math.sin(a) * (c.r + 13) }); });
    g.vo = { x:W - g.pad - 32, y:H - g.pad - 24 };
    return g;
  }
  function regionAt(g, x, y){ var code = ""; for (var i = 0; i < n; i++) { var c = g.c[i]; if ((x - c.x) * (x - c.x) + (y - c.y) * (y - c.y) <= c.r * c.r) code += AB[i]; } return code || "o"; }
  // the point of each region farthest from every edge (labels and number boxes sit there)
  function anchors(g){
    var an = {}, far = {}, step = Math.max(3, Math.round(g.W / 130));
    for (var y = g.pad + 2; y < g.H - g.pad; y += step) for (var x = g.pad + 2; x < g.W - g.pad; x += step) {
      var code = "", dm = Infinity;
      for (var i = 0; i < n; i++) { var c = g.c[i], d = Math.sqrt((x - c.x) * (x - c.x) + (y - c.y) * (y - c.y)); if (d < c.r) code += AB[i]; dm = Math.min(dm, Math.abs(d - c.r)); }
      if (!code) continue;
      if (far[code] == null || dm > far[code]) { far[code] = dm; an[code] = { x:x, y:y }; }
    }
    an.o = g.vo;
    return an;
  }
  function f1(v){ return Math.round(v * 10) / 10; }
  function circ(c, extra){ return '<circle cx="' + f1(c.x) + '" cy="' + f1(c.y) + '" r="' + f1(c.r) + '"' + (extra || "") + "/>"; }
  function pattern(id, rot, cls, s){ return '<pattern id="' + id + '" width="' + s + '" height="' + s + '" patternUnits="userSpaceOnUse"' + (rot ? ' patternTransform="rotate(' + rot + ')"' : "") + '><line x1="2" y1="0" x2="2" y2="' + s + '" class="' + cls + '"/></pattern>'; }
  function drawSvg(){
    var g = cur.g, W = g.W, H = g.H, all = 'x="0" y="0" width="' + W + '" height="' + H + '"', h = "<defs>";
    var uRect = 'x="' + g.pad + '" y="' + g.pad + '" width="' + (W - 2 * g.pad) + '" height="' + (H - 2 * g.pad) + '" rx="10"';
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("width", W); svg.setAttribute("height", H);
    g.c.forEach(function(c, i){ h += '<clipPath id="' + uid + "c" + i + '">' + circ(c) + "</clipPath>"; });
    codes.forEach(function(code){
      var outs = []; for (var i = 0; i < n; i++) if (code.indexOf(AB[i]) < 0) outs.push(g.c[i]);
      if (outs.length) h += '<mask id="' + uid + "m" + code + '" maskUnits="userSpaceOnUse" ' + all + "><rect " + uRect + ' fill="white"/>' + outs.map(function(c){ return circ(c, ' fill="black"'); }).join("") + "</mask>";
    });
    h += pattern(uid + "p", 45, "vd-hl", 9) + pattern(uid + "h", 90, "vd-ht", 8) + pattern(uid + "v", 0, "vd-ht", 8) + "</defs>";
    function reg(code, attrs){
      var inner = "<rect " + all + (attrs ? " " + attrs : "") + (code === "o" || code.length < n ? ' mask="url(#' + uid + "m" + code + ')"' : "") + "/>";
      if (code !== "o") code.split("").forEach(function(ch){ inner = '<g clip-path="url(#' + uid + "c" + AB.indexOf(ch) + ')">' + inner + "</g>"; });
      return inner;
    }
    h += '<rect class="vd-u" ' + uRect + "/>";
    g.c.forEach(function(c, i){ h += circ(c, ' class="vd-f vd-' + AB[i] + '"'); });
    codes.forEach(function(code){ if (st.fills[code]) h += '<g class="vd-fl ' + st.fills[code] + '">' + reg(code, "") + "</g>"; });
    codes.forEach(function(code){ h += '<g class="vd-reg' + (shade[code] ? " on" : "") + '" data-r="' + code + '">' + reg(code, 'class="vd-sh"') + reg(code, 'fill="url(#' + uid + 'p)"') + "</g>"; });
    st.hatch.forEach(function(ly){ h += '<g class="vd-hat">' + ly.codes.map(function(code){ return reg(code, 'fill="url(#' + uid + (ly.dir === "v" ? "v" : "h") + ')"'); }).join("") + "</g>"; });
    if (st.pulse.length) h += '<g class="vd-pul">' + st.pulse.map(function(code){ return reg(code, 'class="vd-pr"'); }).join("") + "</g>";
    g.c.forEach(function(c, i){ h += circ(c, ' class="vd-o vd-' + AB[i] + '"'); });
    g.lab.forEach(function(p, i){ h += '<text class="vd-l vd-' + AB[i] + '" x="' + f1(p.x) + '" y="' + f1(p.y) + '" text-anchor="middle" dominant-baseline="central">' + L[i] + "</text>"; });
    h += '<text class="vd-s" x="' + (g.pad + 14) + '" y="' + (g.pad + 14) + '" text-anchor="middle" dominant-baseline="central">' + (o.universe || "S") + "</text>";
    svg.innerHTML = h;
  }
  function drawVals(){
    vals.innerHTML = codes.map(function(c){
      var v = st.values[c], p = cur.an[c]; if (v == null || v === "" || !p) return "";
      return '<span class="vd-v" style="left:' + f1(p.x) + "px;top:" + f1(p.y) + 'px">' + v + "</span>";
    }).join("");
  }
  function syncInputs(){
    ins.hidden = !st.inputs; if (!st.inputs) return;
    codes.forEach(function(c){
      var el = inEl[c];
      if (!el) { el = document.createElement("input"); el.type = "text"; el.className = "vd-in"; el.setAttribute("inputmode", "numeric"); el.setAttribute("autocomplete", "off"); el.spellcheck = false; el.dataset.vin = c; ins.appendChild(el); inEl[c] = el; }
      el.setAttribute("aria-label", MV.plain(o.inputLabel ? o.inputLabel(c) : "Count " + regionText(c)));
      var v = st.inVals[c] == null ? "" : String(st.inVals[c]);
      if (document.activeElement !== el && el.value !== v) el.value = v;
      var p = cur.an[c]; if (p) { el.style.left = f1(p.x) + "px"; el.style.top = f1(p.y) + "px"; }
    });
  }
  function paintStrip(){
    if (!strip) return;
    MV.keepFocus(strip, function(){
      strip.innerHTML = codes.map(function(c){
        var sw = c === "o" ? '<i class="mdm-sw vd-sw0"></i>' : c.split("").map(function(ch){ return '<i class="mdm-sw" style="background:var(--ev-' + ch + ')"></i>'; }).join(""), nt = o.stripNote ? o.stripNote(c) : "";
        return '<button type="button" class="vd-rb" data-reg="' + c + '" data-k="' + uid + "r" + c + '" aria-pressed="' + !!shade[c] + '"><span class="vd-sws" aria-hidden="true">' + sw + "</span><span>" + (n === 2 && c === "ab" ? "Both" : regionName(c)) + "</span>" + (nt !== "" ? '<span class="vd-rn">' + nt + "</span>" : "") + "</button>";
      }).join("");
    });
  }
  function shaded(){ return codes.filter(function(c){ return shade[c]; }); }
  function paintNote(){
    if (!note) return;
    var cs = shaded();
    note.innerHTML = cs.length ? "Shaded: " + MV.m(vdNames(n, L, cs)[0]) + (o.noteExtra ? o.noteExtra(cs) : "") : muted("Tap a region, or one of the buttons above, to shade it.");
  }
  function paintShade(){
    $$(".vd-reg", svg).forEach(function(gEl){ gEl.classList.toggle("on", !!shade[gEl.getAttribute("data-r")]); });
    paintStrip(); paintNote();
  }
  function toggle(c){ shade[c] = !shade[c]; paintShade(); if (o.onShade) o.onShade(shaded()); }
  function relayout(){
    var W = box.clientWidth;
    namesEl.innerHTML = st.names.map(function(nm, i){ return '<span class="vd-nm"><b class="ev-' + AB[i] + '">' + L[i] + "</b> " + nm + "</span>"; }).join("");
    if (W < 60) return;
    if (!cur || cur.g.W !== W) { var g = geom(W, baseH(W)); cur = { g:g, an:anchors(g) }; }
    box.style.height = cur.g.H + "px"; root.classList.toggle("vd-sm", small(W));
    drawSvg(); drawVals(); syncInputs(); paintStrip(); paintNote();
  }
  function set(s){
    s = s || {};
    if (s.letters) L = s.letters.slice(0, n);
    ["names", "values", "inputs", "inVals", "hatch", "pulse", "fills"].forEach(function(k){ if (s[k] !== undefined) st[k] = s[k]; });
    if (s.shade) { shade = {}; s.shade.forEach(function(c){ shade[c] = true; }); }
    relayout();
  }
  ins.addEventListener("input", function(e){ var c = e.target.dataset && e.target.dataset.vin; if (!c) return; st.inVals[c] = e.target.value; if (o.onInput) o.onInput(c, e.target.value); });
  root.addEventListener("click", function(e){
    if (e.target.closest("input")) return;
    var rb = e.target.closest("[data-reg]"); if (rb) { toggle(rb.dataset.reg); return; }
    if (!canShade || !cur || !e.target.closest(".vd-box")) return;
    var r = box.getBoundingClientRect(); toggle(regionAt(cur.g, e.clientX - r.left, e.clientY - r.top));
  });
  if (window.ResizeObserver) new ResizeObserver(function(){ var W = box.clientWidth; if (W >= 60 && (!cur || Math.abs(W - cur.g.W) > 1)) relayout(); }).observe(root);
  return { set:set, shade:function(cs){ shade = {}; (cs || []).forEach(function(c){ shade[c] = true; }); if (cur) paintShade(); }, shaded:shaded,
    names:function(cs){ return vdNames(n, L, cs); }, words:function(cs){ return vdWords(n, L, cs); },
    regionName:regionName, regionText:regionText, codes:codes, refresh:function(){ paintStrip(); paintNote(); }, relayout:relayout, el:root };
}

// ---------- notation builder: A, B, C, S, ∅, ∪, ∩, ′ and brackets -> a set of regions ----------
function exprText(tk){ return tk.map(function(t){ return t === "∪" || t === "∩" ? " " + t + " " : t; }).join(""); }
function exprTokens(s){ return String(s).replace(/\s+/g, "").split(""); }
function parseExpr(tk, n, L){
  var R = vdCodes(n), full = (1 << R.length) - 1, i = 0;
  if (!tk.length) return { err:"Build an expression with the chips." };
  function atom(){
    var t = tk[i], j = L.indexOf(t);
    if (t === "(") { i++; if (tk[i] === ")") return { err:"The brackets are empty: put a set inside them." }; var v = expr(); if (v.err) return v; if (tk[i] !== ")") return { err:"A bracket is still open: add “)”." }; i++; return v; }
    if (t === "S") { i++; return { m:full }; }
    if (t === "∅") { i++; return { m:0 }; }
    if (j >= 0 && j < n) { i++; return { m:vdLit(R, j) }; }
    if (t == null) return { err:"The expression ends too soon: add a set after the last symbol." };
    if (t === "′") return { err:"′ goes after a set or a bracket, as in `A′` or `(A ∪ B)′`." };
    if (t === ")") return { err:"There’s a “)” with nothing before it to close." };
    return { err:"Put a set before " + t + "." };
  }
  function term(){ var v = atom(); if (v.err) return v; while (tk[i] === "′") { v = { m:full ^ v.m }; i++; } return v; }
  function expr(){
    var v = term(), op = null; if (v.err) return v;
    while (tk[i] === "∪" || tk[i] === "∩") {
      if (op && tk[i] !== op) return { err:"You mixed ∪ and ∩ without brackets. Add brackets to show which comes first." };
      op = tk[i]; i++;
      var w = term(); if (w.err) return w;
      v = { m:op === "∪" ? v.m | w.m : v.m & w.m };
    }
    return v;
  }
  var r = expr(); if (r.err) return r;
  if (i < tk.length) return { err:tk[i] === ")" ? "There’s a “)” with nothing before it to close." : "Join the parts with ∪ or ∩." };
  return { m:r.m, codes:vdCodesOf(R, r.m) };
}

// ---------- Explore: Venn workbench ----------
function explore(host, api){
  var S = api.S, C = api.content || {}, MSG = C.msg || {}, SV = C.surveys || {}, TG = C.targets || {}, LAWS = C.laws || {}, LET = ["A", "B", "C"];
  if (S.sets !== 3) S.sets = 2;
  if (["shade", "name", "survey", "demorgan"].indexOf(S.mode) < 0) S.mode = "shade";
  S.sh = S.sh && typeof S.sh === "object" ? S.sh : {}; S.expr = S.expr || {}; S.sv = S.sv || {}; S.ti = S.ti || {}; S.dm = S.dm || {};
  if (S.dm.law !== "int") S.dm.law = "uni"; S.dm.L = arr(S.dm.L); S.dm.R = arr(S.dm.R); S.dm.hatch = !!S.dm.hatch;
  ["2", "3"].forEach(function(k){ if (!S.sv[k] || typeof S.sv[k] !== "object") S.sv[k] = {}; S.expr[k] = arr(S.expr[k]); if (!(S.ti[k] >= -1)) S.ti[k] = -1; });
  if (typeof S.tc3 !== "string") S.tc3 = "";
  var HATCH = [{ codes:["b", "o"], dir:"h" }, { codes:["a", "o"], dir:"v" }];
  var TOKS = ["A", "B", "C", "∪", "∩", "′", "(", ")", "S", "∅"], TOKA = { "∪":"union", "∩":"intersection", "′":"complement (prime)", "(":"open bracket", ")":"close bracket", "S":"S, the sample space", "∅":"the empty set" };
  host.innerHTML = '<div class="pg vw-pg"><div class="pg-graph" data-mv="graph"><div id="vw-mode"></div><div id="vw-sets"></div>' +
    '<p class="vw-svp" id="vw-svp" hidden></p><div class="eq-cap vw-cap" id="vw-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="vw-main"><div id="vw-v2"></div><div id="vw-v3" hidden></div></div>' +
    '<div id="vw-dm" hidden><div class="vw-dm2"><div class="vw-dmc"><p class="vw-dmh" id="vw-dmhL"></p><div id="vw-dmL"></div></div><div class="vw-dmc"><p class="vw-dmh" id="vw-dmhR"></p><div id="vw-dmR"></div></div></div>' +
      '<p class="vw-key tiny" id="vw-key" hidden><span><i class="vw-kh" aria-hidden="true"></i> ' + MV.m("A′") + " (outside " + MV.m("A") + ')</span><span><i class="vw-kv" aria-hidden="true"></i> ' + MV.m("B′") + " (outside " + MV.m("B") + ')</span><span><i class="vw-kx" aria-hidden="true"></i> both hatchings cross</span></p></div>' +
    '</div><div class="pg-ctrl">' +
      '<div id="vw-c-sh"><p class="how">Tap regions to shade them, or use the region buttons under the diagram.</p><div class="q-actions"><button type="button" class="btn ghost sm" id="vw-clr">Clear the shading</button></div></div>' +
      '<div id="vw-c-nm" hidden><p class="vw-lab">Your expression</p><div class="vw-expr" id="vw-expr" aria-live="polite"></div><div class="vw-chips" id="vw-chips" role="group" aria-label="Notation chips"></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="vw-ncheck">Check my shading</button><button type="button" class="btn ghost sm" id="vw-next">New expression</button><button type="button" class="btn ghost sm" id="vw-clr2">Clear the shading</button></div><div id="vw-nfb"></div></div>' +
      '<div id="vw-c-sv" hidden><p class="how">Type a count in each region of the diagram. Shade regions to count them and see the probability.</p><div class="q-actions"><button type="button" class="btn ghost sm" id="vw-svclr">Clear the counts</button></div></div>' +
      '<div id="vw-c-dm" hidden><div id="vw-law"></div><p class="how">Shade each diagram to match its name, or press Show me.</p><div class="q-actions"><button type="button" class="btn primary sm" id="vw-show">Show me</button><button type="button" class="btn ghost sm" id="vw-hatch" aria-pressed="false">Hatch ' + MV.m("A′") + " and " + MV.m("B′") + '</button><button type="button" class="btn ghost sm" id="vw-dmclr">Clear both</button></div></div>' +
    '</div><div class="pg-read"><dl class="read" id="vw-read" aria-live="polite"></dl></div></div>';
  var nfb = null, anim = null, fx = {}, capOv = "";

  function sv(){ return SV[String(S.sets)]; }
  function shKey(){ return (S.mode === "survey" ? "s" : "n") + S.sets; }
  function shading(){ return arr(S.sh[shKey()]); }
  function V(){ return S.sets === 3 ? V3 : V2; }
  function onMain(cs){ S.sh[shKey()] = cs; nfb = null; api.save(); user(); render(); }
  function onIn(code, val){ S.sv[String(S.sets)][code] = val; api.save(); V().refresh(); paintCap(); paintRead(); MV.changed(); }
  function stripNote(c){ if (S.mode !== "survey") return ""; var v = intOf(S.sv[String(S.sets)][c]); return isNum(v) ? N(v) : "?"; }
  function inLabel(c){ return "Count " + V().regionText(c); }
  var vOpt = function(k){ return { sets:k, note:false, stripAria:"Shade a region", onShade:onMain, onInput:onIn, stripNote:stripNote, inputLabel:inLabel }; };
  var V2 = vennDiagram($("#vw-v2", host), vOpt(2)), V3 = vennDiagram($("#vw-v3", host), vOpt(3));
  var DL = vennDiagram($("#vw-dmL", host), { sets:2, note:false, stripAria:"Shade a region of the left diagram", onShade:function(cs){ S.dm.L = cs; api.save(); user(); render(); } });
  var DR = vennDiagram($("#vw-dmR", host), { sets:2, note:false, stripAria:"Shade a region of the right diagram", onShade:function(cs){ S.dm.R = cs; api.save(); user(); render(); } });

  var modeRg = radios($("#vw-mode", host), { label:"Mode", cls:"chips", value:S.mode,
    options:[{ id:"shade", t:"Shade → name" }, { id:"name", t:"Name → shade" }, { id:"survey", t:"Survey fill" }, { id:"demorgan", t:"De Morgan" }],
    onChange:function(v){ user(); S.mode = v; nfb = null; api.save(); render(); } });
  var setsRg = radios($("#vw-sets", host), { label:"Sets", cls:"seg", value:String(S.sets), options:[{ id:"2", t:"2 sets" }, { id:"3", t:"3 sets" }],
    onChange:function(v){ user(); S.sets = +v; nfb = null; api.save(); render(); } });
  var lawRg = radios($("#vw-law", host), { label:"Law", cls:"chips", value:S.dm.law,
    options:[{ id:"uni", t:MV.m("(A ∪ B)′") + " beside " + MV.m("A′ ∩ B′") }, { id:"int", t:MV.m("(A ∩ B)′") + " beside " + MV.m("A′ ∪ B′") }],
    onChange:function(v){ user(); S.dm.law = v; S.dm.L = []; S.dm.R = []; api.save(); render(); } });

  // ----- painting -----
  function render(){
    var m = S.mode, dm = m === "demorgan", svm = m === "survey";
    setsRg.lock(dm);
    $("#vw-main", host).hidden = dm; $("#vw-dm", host).hidden = !dm;
    $("#vw-v2", host).hidden = S.sets !== 2; $("#vw-v3", host).hidden = S.sets !== 3;
    $("#vw-c-sh", host).hidden = m !== "shade"; $("#vw-c-nm", host).hidden = m !== "name"; $("#vw-c-sv", host).hidden = !svm; $("#vw-c-dm", host).hidden = !dm;
    var p = $("#vw-svp", host); p.hidden = !svm; if (svm) p.innerHTML = '<span class="mdm-model">Model data</span> ' + sv().intro;
    if (dm) paintDm(); else paintMain();
    paintName(); paintCap(); paintRead(); MV.changed();
  }
  function paintMain(){
    var svm = S.mode === "survey", s = sv();
    V().set({ letters:svm ? s.letters : LET.slice(0, S.sets), names:svm ? s.names : [], inputs:svm, inVals:S.sv[String(S.sets)],
      values:fx.values || {}, hatch:fx.hatch || [], pulse:fx.pulse || [], shade:shading() });
  }
  function paintDm(){
    var Lw = LAWS[S.dm.law], hs = S.dm.hatch ? HATCH : (fx.dmRh || []);
    $("#vw-dmhL", host).innerHTML = "Left: " + MV.m(Lw.left); $("#vw-dmhR", host).innerHTML = "Right: " + MV.m(Lw.right);
    DL.set({ shade:S.dm.L }); DR.set({ shade:S.dm.R, hatch:hs });
    $("#vw-key", host).hidden = !hs.length;
    $("#vw-hatch", host).setAttribute("aria-pressed", String(S.dm.hatch));
  }
  function paintName(){
    if (S.mode !== "name") return;
    var tk = S.expr[String(S.sets)], chips = TOKS.filter(function(t){ return t !== "C" || S.sets === 3; }), ch = $("#vw-chips", host);
    $("#vw-expr", host).innerHTML = tk.length ? MV.m(exprText(tk)) : muted("Tap the chips to build a name, or press New expression.");
    MV.keepFocus(ch, function(){
      ch.innerHTML = chips.map(function(t){ return '<button type="button" class="vw-tok" data-tok="' + t + '" data-k="tok' + t + '" aria-label="' + MV.esc(TOKA[t] || t) + '">' + (/[A-Z]/.test(t) ? MV.m(t) : t) + "</button>"; }).join("") +
        '<button type="button" class="vw-tok vw-tok-x" data-tok="back" data-k="tokback" aria-label="Delete the last symbol">⌫</button><button type="button" class="vw-tok vw-tok-x" data-tok="clear" data-k="tokclear">Clear</button>';
    });
    $("#vw-nfb", host).innerHTML = nfb ? MV.fbHTML(nfb.k, nfb.h) : "";
  }
  function dmOk(){ var Lw = LAWS[S.dm.law]; return { L:same(S.dm.L, Lw.res), R:same(S.dm.R, Lw.res) }; }
  function svData(){ var o = S.sv[String(S.sets)], r = {}; V().codes.forEach(function(c){ r[c] = intOf(o[c]); }); return r; }
  function sumOf(r, cs){ var t = 0; for (var i = 0; i < cs.length; i++) { if (!isNum(r[cs[i]])) return null; t += r[cs[i]]; } return t; }
  function totalsList(){
    var s = sv(), r = svData(), out = s.given.map(function(g){ return { lab:MV.md(g.lab), v:g.v, sum:sumOf(r, g.codes) }; });
    out.push({ lab:"total", v:s.total, sum:sumOf(r, V().codes) });
    return out;
  }
  function failing(){ return totalsList().filter(function(x){ return x.sum != null && x.sum !== x.v; }).map(function(x){ return x.lab + " = " + N(x.sum) + ", not " + N(x.v); }); }
  function totalsHTML(){
    var T = totalsList(); if (T.every(function(x){ return x.sum == null; })) return muted("Fill the regions to check the totals.");
    return T.map(function(x){
      if (x.sum == null) return x.lab + ": " + muted("not filled yet");
      return x.lab + " = " + N(x.sum) + (x.sum === x.v ? ' <span class="vw-y">✓</span>' : ' <span class="vw-n">✗</span> ' + muted("should be " + N(x.v) + ": " + (x.sum > x.v ? N(x.sum - x.v) + " too many" : N(x.v - x.sum) + " too few")));
    }).join("<br>");
  }
  function regionList(v, cs){ return v.codes.filter(function(c){ return cs.indexOf(c) >= 0; }).map(function(c){ return v.regionName(c); }).join(", "); }
  function namesHTML(nm){ return MV.m(nm[0]) + (nm.length > 1 ? ' <span class="vw-also">= ' + nm.slice(1).map(function(x){ return MV.m(x); }).join(" = ") + "</span>" : ""); }
  function paintRead(){
    var rows = [], el = $("#vw-read", host);
    if (S.mode === "demorgan") {
      var Lw = LAWS[S.dm.law], ok = dmOk();
      var side = function(lab, v, cs, good, nm){ return [lab + ": " + MV.m(nm), good ? '<span class="vw-y">✓</span> Shaded correctly: ' + v.words(cs) + "." : cs.length ? "Not yet: that shading is " + MV.m(v.names(cs)[0]) + "." : muted("Shade the regions of " + MV.m(nm) + ".")]; };
      rows.push(side("Left", DL, S.dm.L, ok.L, Lw.left), side("Right", DR, S.dm.R, ok.R, Lw.right));
      rows.push(["Same region?", ok.L && ok.R ? '<span class="vw-y">✓</span> Yes. Both are ' + Lw.same + ", so " + MV.m(Lw.left + " = " + Lw.right) + "." : muted("Shade both diagrams, then compare.")]);
      el.innerHTML = MV.readoutHTML(rows); return;
    }
    var v = V(), cs = shading();
    if (S.mode === "name") {
      var tk = S.expr[String(S.sets)], r = tk.length ? parseExpr(tk, S.sets, LET) : null;
      rows.push(["Your expression", !r ? muted("none yet") : MV.m(exprText(tk)) + (r.err ? "<br>" + muted(MV.md(r.err)) : "")]);
      rows.push(["In words", r && !r.err ? v.words(r.codes) : muted("—")]);
      rows.push(["Shaded regions", cs.length ? regionList(v, cs) : muted("none yet")]);
      el.innerHTML = MV.readoutHTML(rows); return;
    }
    rows.push(["Shaded regions", cs.length ? regionList(v, cs) : muted("Tap a region to shade it.")]);
    rows.push(["Set notation", cs.length ? namesHTML(v.names(cs)) : muted("—")]);
    rows.push(["In words", cs.length ? v.words(cs) : muted("—")]);
    if (S.mode === "survey") {
      var s = sv(), c = sumOf(svData(), cs);
      rows.push(["Count", !cs.length ? muted("Shade regions to count them.") : c == null ? muted("Fill the shaded regions first.") : N(c)]);
      rows.push(["Probability (÷ " + MV.m("n(S)") + " = " + s.total + ")", !cs.length || c == null ? muted("—") : F.prob(c, s.total, { dec:false })]);
      rows.push(["Totals check", totalsHTML()]);
    }
    el.innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var el = $("#vw-cap", host);
    if (capOv) { el.innerHTML = capOv; return; }
    if (S.mode === "demorgan") { var Lw = LAWS[S.dm.law], ok = dmOk(), both = ok.L && ok.R; el.innerHTML = MV.m(Lw.left) + (both ? " " + MV.m("=") + " " : ' <span class="vw-q">and</span> ') + MV.m(Lw.right) + (both ? "" : ' <span class="vw-q">: the same region?</span>'); return; }
    if (S.mode === "name") { var tk = S.expr[String(S.sets)]; el.innerHTML = tk.length ? MV.m(exprText(tk)) : muted("Build a name, then shade it."); return; }
    var cs = shading(), nm = cs.length ? V().names(cs)[0] : null;
    if (S.mode === "survey") { var c = sumOf(svData(), cs); el.innerHTML = MV.m(nm ? "n(" + nm + ") = " + (c == null ? "?" : c) : "n(S) = " + sv().total); return; }
    el.innerHTML = nm ? MV.m(nm) : muted("Tap a region to shade it.");
  }

  // ----- controls -----
  $("#vw-chips", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-tok]"); if (!b) return;
    var k = String(S.sets), t = b.dataset.tok; user();
    if (t === "back") S.expr[k].pop(); else if (t === "clear") S.expr[k] = []; else if (S.expr[k].length < 40) S.expr[k].push(t);
    nfb = null; api.save(); render();
  });
  $("#vw-ncheck", host).addEventListener("click", function(){
    user(); var tk = S.expr[String(S.sets)], v = V();
    if (!tk.length) nfb = { k:"bad", h:"Build a name first: tap the chips, or press <strong>New expression</strong>." };
    else {
      var r = parseExpr(tk, S.sets, LET);
      if (r.err) nfb = { k:"bad", h:"<strong>✗ Not quite.</strong> " + MV.md(r.err) };
      else {
        var got = shading(), ex = MV.m(exprText(tk));
        if (same(got, r.codes)) nfb = { k:"good", h:"<strong>✓ Correct.</strong> Your shading matches " + ex + (r.codes.length ? ": " + v.words(r.codes) + "." : ". It’s the empty set, so nothing is shaded.") };
        else nfb = { k:"bad", h:"<strong>✗ Not quite.</strong> " + (got.length ? "You shaded " + MV.m(v.names(got)[0]) + "." : "Nothing is shaded yet.") + " " + ex + " means " + v.words(r.codes) + "." };
      }
    }
    render(); MV.focusFb($("#vw-c-nm", host));
  });
  $("#vw-next", host).addEventListener("click", function(){
    user(); var k = String(S.sets), list = TG[k] || []; if (!list.length) return;
    S.ti[k] = (S.ti[k] + 1) % list.length; S.expr[k] = exprTokens(list[S.ti[k]]); S.sh[shKey()] = []; nfb = null; api.save(); render();
  });
  function clearShade(){ user(); S.sh[shKey()] = []; nfb = null; api.save(); render(); }
  $("#vw-clr", host).addEventListener("click", clearShade); $("#vw-clr2", host).addEventListener("click", clearShade);
  $("#vw-svclr", host).addEventListener("click", function(){ user(); S.sv[String(S.sets)] = {}; api.save(); render(); });
  $("#vw-show", host).addEventListener("click", function(){ newAnim(function(){ capOv = ""; paintCap(); paintRead(); }); demo(S.dm.law); });
  $("#vw-hatch", host).addEventListener("click", function(){ user(); S.dm.hatch = !S.dm.hatch; api.save(); render(); });
  $("#vw-dmclr", host).addEventListener("click", function(){ user(); S.dm.L = []; S.dm.R = []; S.dm.hatch = false; api.save(); render(); });

  // ----- animations (predictions and Show me) -----
  function endAnim(){ var a = anim; anim = null; if (!a) return; a.timers.forEach(clearTimeout); if (a.fin) { var f = a.fin; a.fin = null; f(); } }
  function newAnim(fin){ endAnim(); anim = { timers:[], fin:fin }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function user(){ var had = !!anim || !!capOv || Object.keys(fx).length > 0; if (anim) endAnim(); fx = {}; capOv = ""; return had; }
  function cap(h){ capOv = h; paintCap(); }
  function setShade(cs){ S.sh[shKey()] = cs; api.save(); V().shade(cs); paintRead(); }
  function demo(id){
    var Lw = LAWS[id];
    S.mode = "demorgan"; S.dm.law = id; S.dm.L = []; S.dm.R = []; S.dm.hatch = false; fx = {}; modeRg.set("demorgan"); lawRg.set(id); api.save();
    capOv = MV.m(Lw.left) + ' <span class="vw-q">and</span> ' + MV.m(Lw.right) + ' <span class="vw-q">: watch</span>'; render();
    later(350, function(){ S.dm.L = Lw.first.slice(); DL.shade(S.dm.L); cap(MV.m(Lw.inner) + ' <span class="vw-q">shaded on the left …</span>');
      later(1300, function(){ S.dm.L = Lw.res.slice(); DL.shade(S.dm.L); cap('<span class="vw-q">… then its complement:</span> ' + MV.m(Lw.left));
        later(1400, function(){ fx.dmRh = [HATCH[0]]; paintDm(); cap(MV.m("A′") + ' <span class="vw-q">hatched across</span>');
          later(1200, function(){ fx.dmRh = HATCH.slice(); paintDm(); cap(MV.m("B′") + ' <span class="vw-q">hatched up and down</span>');
            later(1300, function(){ S.dm.R = Lw.res.slice(); DR.shade(S.dm.R); cap(MV.m(Lw.right) + ' <span class="vw-q">: ' + Lw.rule + "</span>");
              later(1400, function(){ S.dm.hatch = true; fx = {}; api.save(); paintDm(); paintRead(); cap(MV.m(Lw.left + " = " + Lw.right) + ' <span class="vw-q">: the same region</span>');
                later(1600, endAnim);
              });
            });
          });
        });
      });
    });
  }
  function runP1(){
    later(350, function(){ setShade(["a", "b", "ab"]); cap(MV.m("A ∪ B") + ' <span class="vw-q">: everything in either circle</span>');
      later(1500, function(){ setShade(["o"]); cap(MV.m("(A ∪ B)′") + ' <span class="vw-q">: flip it, outside both circles</span>');
        later(1800, endAnim);
      });
    });
  }
  function runP2(){
    later(350, function(){ fx.hatch = [HATCH[0]]; paintMain(); cap(MV.m("A′") + ' <span class="vw-q">hatched: outside</span> ' + MV.m("A"));
      later(1400, function(){ setShade(["b", "ab"]); cap(MV.m("B") + ' <span class="vw-q">shaded</span>');
        later(1400, function(){ fx.pulse = ["b"]; paintMain(); cap(MV.m("A′ ∩ B") + ' <span class="vw-q">= hatched and shaded =</span> ' + MV.m("B") + ' <span class="vw-q">only</span>');
          later(1800, function(){ fx = {}; S.sh[shKey()] = ["b"]; api.save(); paintMain(); paintRead(); endAnim(); });
        });
      });
    });
  }
  function runP4(){
    var cs = V3.codes; fx.values = {};
    cs.forEach(function(c, i){ later(350 + i * 420, function(){ fx.values[c] = '<span class="vw-num">' + (i + 1) + "</span>"; fx.pulse = [c]; paintMain(); cap(MV.m(String(i + 1)) + ' <span class="vw-q">' + (i ? "regions" : "region") + "</span>"); }); });
    later(350 + cs.length * 420 + 250, function(){ fx.pulse = []; paintMain(); cap(MV.m("2 × 2 × 2 = 8") + ' <span class="vw-q">regions, counting the outside</span>'); later(1600, endAnim); });
  }

  // ----- target challenges -----
  var chal = $("#chal");
  function injectTc3(){
    var card = chal && chal.querySelector('[data-c="tc3"]'); if (!card || card.querySelector(".vw-tc3")) return;
    var done = !!(MV.S.chal && MV.S.chal.tc3 && MV.S.chal.tc3.solved), row = document.createElement("div");
    row.className = "inrow vw-tc3";
    row.innerHTML = '<label for="vw-tc3">Exactly one club<input type="text" inputmode="numeric" id="vw-tc3" data-tc3="1" data-k="vw-tc3" autocomplete="off" spellcheck="false"' + (done ? " disabled" : "") + "></label>";
    var head = card.querySelector(".q-head"); card.insertBefore(row, head ? head.nextSibling : card.firstChild);
    $("#vw-tc3").value = S.tc3 || "";
  }
  if (chal) {
    new MutationObserver(injectTc3).observe(chal, { childList:true });
    chal.addEventListener("input", function(e){ if (!(e.target.dataset && e.target.dataset.tc3)) return; S.tc3 = e.target.value; api.save(); MV.liveChallenges(); });
    chal.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.tc3) { var b = chal.querySelector('[data-c="tc3"] [data-act="check"]'); if (b) b.click(); } });
  }
  function vals(k){ var o = S.sv[k], r = {}; vdCodes(+k).forEach(function(c){ r[c] = intOf(o[c]); }); return r; }
  function tc1(){
    if (S.sets !== 3 || S.mode === "survey" || S.mode === "demorgan") return { ok:false, msg:"Switch to <strong>3 sets</strong> and the <strong>Name → shade</strong> mode." };
    var cs = arr(S.sh.n3);
    if (same(cs, ["ac"])) return { ok:true };
    if (same(cs, ["ac", "abc"])) return { ok:false, msg:MSG.tc1Centre };
    if (same(cs, ["a"])) return { ok:false, msg:MSG.tc1Aonly };
    if (!cs.length) return { ok:false, msg:"Shade the region first: tap it, or use the buttons under the diagram." };
    return { ok:false, msg:"Your shading is " + MV.m(V3.names(cs)[0]) + ". " + MV.m("A ∩ B′ ∩ C") + " means " + V3.words(["ac"]) + "." };
  }
  function tc2(){
    if (S.mode !== "survey" || S.sets !== 2) return { ok:false, msg:"Switch to <strong>2 sets</strong> and <strong>Survey fill</strong>." };
    var r = vals("2"), filled = function(c){ return isNum(r[c]); };
    if (!["a", "b", "ab", "o"].some(function(c){ return r[c] != null; })) return { ok:false, msg:"Type a count in each of the four regions. Start in the middle." };
    if (r.a === 34) return { ok:false, msg:MSG.tc2Cat };
    if (r.b === 25) return { ok:false, msg:MSG.tc2Dog };
    if (r.o === 1) return { ok:false, msg:MSG.tc2One };
    if (filled("a") && filled("b") && filled("ab") && (!filled("o") || r.o === 0)) return { ok:false, msg:MSG.tc2None };
    if (!["a", "b", "ab", "o"].every(filled)) return { ok:false, msg:"Fill all four regions with whole numbers." };
    if (r.a === 26 && r.ab === 8 && r.b === 17 && r.o === 9) return { ok:true };
    var f = failing(); return { ok:false, msg:"Check the totals: " + (f.length ? f.join("; ") : "each circle and the whole rectangle") + "." };
  }
  function tc3(){
    if (S.mode !== "survey" || S.sets !== 3) return { ok:false, msg:"Switch to <strong>3 sets</strong> and <strong>Survey fill</strong>." };
    var r = vals("3"), ans = intOf(S.tc3), cs = vdCodes(3);
    if ((r.a === 5 && r.b === 5 && r.c === 8) || (r.ab === 7 && r.ac === 8 && r.bc === 6) || ans === 18) return { ok:false, msg:MSG.tc3Pairs };
    if (ans === 42) return { ok:false, msg:MSG.tc3At };
    if (ans === 60) return { ok:false, msg:MSG.tc3Add };
    if (!cs.every(function(c){ return isNum(r[c]); })) return { ok:false, msg:"Fill all 8 regions with whole numbers. Start at the centre." };
    var want = { a:8, b:8, c:11, ab:4, ac:5, bc:3, abc:3, o:8 };
    if (!cs.every(function(c){ return r[c] === want[c]; })) { var f = failing(); return { ok:false, msg:"Check the totals: " + (f.length ? f.join("; ") : "every club, every pair and the whole rectangle") + "." }; }
    if (ans == null) return { ok:false, msg:"The regions are right. Now type how many are in exactly one club." };
    if (ans !== 27) return { ok:false, msg:"“Exactly one club” is the three “only” regions. Add them." };
    return { ok:true };
  }

  render(); injectTc3();
  return {
    predict:{
      start:function(p){
        endAnim(); fx = {}; capOv = ""; var s = p.start || {};
        if (s.mode === "demorgan") { S.mode = "demorgan"; S.dm.law = s.law || "int"; S.dm.L = []; S.dm.R = []; S.dm.hatch = false; lawRg.set(S.dm.law); }
        else { S.mode = s.mode || "shade"; S.sets = s.sets || 2; S.sh[shKey()] = []; setsRg.set(String(S.sets)); }
        modeRg.set(S.mode); nfb = null; api.save();
        capOv = MV.m(p.id === "p1" ? "(A ∪ B)′ = ?" : p.id === "p2" ? "A′ ∩ B = ?" : p.id === "p3" ? "(A ∩ B)′ = ?" : "?") + (p.id === "p4" ? ' <span class="vw-q">regions</span>' : "");
        render();
      },
      run:function(p, done){
        newAnim(function(){ capOv = ""; paintCap(); paintRead(); done(); });
        if (p.id === "p1") runP1(); else if (p.id === "p2") runP2(); else if (p.id === "p3") demo("int"); else runP4();
      }
    },
    challenge:function(id){
      if (id === "tc1") return tc1();
      if (id === "tc2") return tc2();
      if (id === "tc3") return tc3();
      return { ok:false };
    }
  };
}

// ---------- hero: the four regions light up with their names; the outside is A′ ∩ B′ ----------
function hero(f){
  var svg = $("#vw-hsvg"), cap = f.cap; if (!svg) return;
  var R = ["a", "ab", "b", "o"];
  var CAPS = ["Two events, A and B, in the sample space S.", "A ∩ B′: in A but not in B.", "A ∩ B: in both.", "A′ ∩ B: in B but not in A.", "(A ∪ B)′: in neither.", "Outside both circles: (A ∪ B)′ = A′ ∩ B′."];
  function phase(k){
    R.forEach(function(r, i){
      $('[data-hr="' + r + '"]', svg).classList.toggle("on", k >= 5 ? r === "o" : i === k - 1);
      $('[data-hn="' + r + '"]', svg).classList.toggle("on", k < 5 && i < k);
    });
    svg.classList.toggle("fin", k >= 5);
    if (cap) cap.textContent = CAPS[k];
  }
  if (MV.reduceMotion) { phase(5); return; }
  phase(0);
  var k = 0;
  (function next(){ MV.wait(k ? 1300 : 700, function(){ k++; phase(k); if (k < 5) next(); }); })();
}

// ---------- Part 3: Three-set puzzles ----------
function part3(host, api){
  var S = api.S, P = api.content || {}, s1 = P.st1 || {}, s2 = P.st2 || {}, s3 = P.st3 || {}, LT = P.letters || ["X", "Y", "Z"], TOT = P.total || 80;
  var STEPS = s1.steps || [], VAL = {}, CODES = vdCodes(3);
  STEPS.forEach(function(st){ VAL[st.code] = MV.ans(st); });
  function tot(code){ var t = 0; CODES.forEach(function(c){ if (c !== "o" && code.split("").every(function(ch){ return c.indexOf(ch) >= 0; })) t += VAL[c]; }); return t; }
  S.st = ["1", "2", "3"].indexOf(S.st) >= 0 ? S.st : "1";
  S.s1 = S.s1 || {}; if (!(S.s1.k >= 0 && S.s1.k <= STEPS.length)) S.s1.k = 0; if (typeof S.s1.v !== "string") S.s1.v = "";
  S.s3 = S.s3 || {}; S.s3.sh = arr(S.s3.sh); if (typeof S.s3.p !== "string") S.s3.p = ""; S.s3.done = S.s3.done || {};
  var Q3 = s3.qs || []; if (!Q3.some(function(q){ return q.id === S.s3.q; })) S.s3.q = Q3.length ? Q3[0].id : "";
  var TERMS = [{ c:"a", s:1 }, { c:"b", s:1 }, { c:"c", s:1 }, { c:"ab", s:-1 }, { c:"ac", s:-1 }, { c:"bc", s:-1 }, { c:"abc", s:1 }];
  function termTxt(t){ return "n(" + t.c.split("").map(function(ch){ return LT[AB.indexOf(ch)]; }).join(" ∩ ") + ")"; }
  var SAY = ["Nothing has been counted yet.",
    "Adding " + MV.m(termTxt(TERMS[0])) + " counts every region inside " + MV.m(LT[0]) + " once.",
    "Adding " + MV.m(termTxt(TERMS[1])) + ": the regions shared by " + MV.m(LT[0]) + " and " + MV.m(LT[1]) + " are now counted twice.",
    "Adding " + MV.m(termTxt(TERMS[2])) + ": each “exactly two” region is counted twice, and the centre three times.",
    "Subtracting " + MV.m(termTxt(TERMS[3])) + " takes one count off " + MV.m(LT[0]) + " and " + MV.m(LT[1]) + " only, and off the centre.",
    "Subtracting " + MV.m(termTxt(TERMS[4])) + ": " + MV.m(LT[0]) + " and " + MV.m(LT[2]) + " only is back to ×1; the centre is down to ×1.",
    "Subtracting " + MV.m(termTxt(TERMS[5])) + ": every “exactly two” region is ×1, but the centre is now ×0. It isn’t counted at all.",
    "Adding " + MV.m(termTxt(TERMS[6])) + " brings the centre back to ×1. Every region is counted exactly once: " + tot("a") + " + " + tot("b") + " + " + tot("c") + " " + MI + " " + tot("ab") + " " + MI + " " + tot("ac") + " " + MI + " " + tot("bc") + " + " + tot("abc") + " = " + (TOT - VAL.o) + " = " + TOT + " " + MI + " " + VAL.o + "."];
  host.innerHTML = '<div id="p3-st" class="p3-st"></div>' +
    '<div class="p3-station" data-st="1"><h3>' + s1.title + "</h3><p>" + s1.text + '</p><div class="sym"><div><div id="p3-v1"></div></div><div><div id="p3-s1q"></div><dl class="read" id="p3-s1read"></dl><div class="q-actions"><button type="button" class="btn ghost sm" id="p3-s1reset">Start again</button></div></div></div></div>' +
    '<div class="p3-station" data-st="2"><h3>' + s2.title + "</h3><p>" + s2.text + '</p><div class="sym"><div><div id="p3-v2"></div>' +
      '<p class="tiny p3-leg"><span><i class="p3-sw" aria-hidden="true"></i> ×0 not counted</span><span><i class="p3-sw c1" aria-hidden="true"></i> ×1 counted once</span><span><i class="p3-sw c2" aria-hidden="true"></i> ×2 twice</span><span><i class="p3-sw c3" aria-hidden="true"></i> ×3 three times</span></p></div>' +
      '<div><div id="p3-pl"></div><p class="p3-say" id="p3-say" aria-live="polite"></p><p class="p3-sum" id="p3-sum"></p>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' +
        "<span>" + tot("a") + " + " + tot("b") + " + " + tot("c") + " = " + (tot("a") + tot("b") + tot("c")) + " <small>adding the three totals: each “exactly two” region ×2, the centre ×3</small></span>" +
        "<span>" + (tot("a") + tot("b") + tot("c")) + " " + MI + " " + tot("ab") + " " + MI + " " + tot("ac") + " " + MI + " " + tot("bc") + " = " + (tot("a") + tot("b") + tot("c") - tot("ab") - tot("ac") - tot("bc")) + " <small>subtracting the three pairs: each “exactly two” region ×1, the centre ×0</small></span>" +
        "<span>" + (tot("a") + tot("b") + tot("c") - tot("ab") - tot("ac") - tot("bc")) + " + " + tot("abc") + " = " + (TOT - VAL.o) + " <small>adding the centre back: every region ×1</small></span>" +
        "<span>" + (TOT - VAL.o) + " = " + TOT + " " + MI + " " + VAL.o + " <small>the " + VAL.o + " who use none are outside every circle</small></span>" +
      "</div></details></div></div></div>" +
    '<div class="p3-station" data-st="3"><h3>' + s3.title + "</h3><p>" + s3.text + '</p><div id="p3-q3"></div><div class="sym"><div><div id="p3-v3"></div></div>' +
      '<div><dl class="read" id="p3-s3read" aria-live="polite"></dl><div class="inrow"><label for="p3-s3p">' + MV.m("P") + ' =<input type="text" inputmode="decimal" id="p3-s3p" autocomplete="off" spellcheck="false" placeholder="e.g. 3/8"></label></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="p3-s3chk">Check</button></div><div id="p3-s3fb"></div></div></div></div>';
  radios($("#p3-st", host), { label:"Station", cls:"chips", value:S.st, options:[{ id:"1", t:"1. Inside out" }, { id:"2", t:"2. Why add the centre back?" }, { id:"3", t:"3. Probabilities" }],
    onChange:function(v){ S.st = v; api.save(); showSt(); } });
  function showSt(){ $$(".p3-station", host).forEach(function(d){ d.hidden = d.dataset.st !== S.st; }); [V1, V2, V3].forEach(function(v){ v.relayout(); }); }

  // station 1: fill in a forced order
  var V1 = vennDiagram($("#p3-v1", host), { sets:3, letters:LT, shade:false }), fb1 = null;
  function paint1(focus){
    var k = S.s1.k, cur = STEPS[k], vs = {}, q = $("#p3-s1q", host);
    STEPS.forEach(function(st, i){ if (i < k) vs[st.code] = N(VAL[st.code]); });
    if (cur) vs[cur.code] = '<span class="p3-qm">?</span>';
    V1.set({ values:vs, pulse:cur ? [cur.code] : [] });
    var prev = k > 0 ? STEPS[k - 1] : null, h = "";
    if (prev && (!fb1 || fb1.k !== "bad")) h += MV.fbHTML("good", "<strong>✓ " + V1.regionName(prev.code) + " = " + N(VAL[prev.code]) + ".</strong> " + MV.md(prev.why));
    if (cur) h += '<div class="p3-step"><p class="tiny muted">Step ' + (k + 1) + " of " + STEPS.length + '</p><p class="p3-sp"><strong>' + MV.md(cur.prompt) + '</strong></p><div class="inrow"><label for="p3-s1in">Count<input type="text" inputmode="numeric" id="p3-s1in" autocomplete="off" spellcheck="false" value="' + MV.esc(S.s1.v) + '"></label></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="p3-s1chk">Check</button></div>' + (fb1 ? MV.fbHTML(fb1.k, fb1.h) : "") + "</div>";
    else h += '<p class="p3-done">Every region is filled. Station 2 shows why the formula needs the centre added back.</p>';
    q.innerHTML = h;
    $("#p3-s1read", host).innerHTML = MV.readoutHTML([["Filled so far", k ? STEPS.slice(0, k).map(function(st){ return V1.regionName(st.code) + " " + N(VAL[st.code]); }).join(" · ") : muted("nothing yet: start at the centre")],
      ["Inside the circles", k >= 7 ? STEPS.slice(0, 7).map(function(st){ return N(VAL[st.code]); }).join(" + ") + " = " + (TOT - VAL.o) : muted("—")]]);
    if (focus) { var inp = $("#p3-s1in", host); if (inp) inp.focus(); else MV.focusFb(q); }
  }
  function gen1(cur){
    if (cur.code === "abc") return "Read it from the survey: how many use all three?";
    if (cur.code === "o") return "Add the seven regions you’ve filled, then subtract from " + TOT + ".";
    if (cur.code.length === 2) return "Start from the pair total, then take out the centre.";
    return "Start from the service total, then take away the three regions inside it that you’ve already filled.";
  }
  function check1(){
    var cur = STEPS[S.s1.k]; if (!cur) return;
    var v = intOf(S.s1.v);
    if (!isNum(v)) { fb1 = { k:"bad", h:"Type a whole number." }; paint1(true); return; }
    if (v === VAL[cur.code]) { fb1 = null; S.s1.k++; S.s1.v = ""; api.save(); paint1(true); return; }
    var w = (cur.wrong || []).filter(function(x){ return x.match === v; })[0];
    fb1 = { k:"bad", h:"<strong>✗ Not quite.</strong> " + (w ? MV.md(w.fb) : gen1(cur)) };
    api.save(); paint1(true);
  }
  host.addEventListener("click", function(e){
    var id = e.target.closest("button") && e.target.closest("button").id;
    if (id === "p3-s1chk") check1();
    else if (id === "p3-s1reset") { S.s1.k = 0; S.s1.v = ""; fb1 = null; api.save(); paint1(false); }
    else if (id === "p3-s3chk") check3();
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter") return;
    if (e.target.id === "p3-s1in") { e.preventDefault(); check1(); }
    else if (e.target.id === "p3-s3p") { e.preventDefault(); check3(); }
  });
  host.addEventListener("input", function(e){
    if (e.target.id === "p3-s1in") { S.s1.v = e.target.value; api.save(); }
    else if (e.target.id === "p3-s3p") { S.s3.p = e.target.value; api.save(); }
  });

  // station 2: region-count colouring as the formula runs
  var V2 = vennDiagram($("#p3-v2", host), { sets:3, letters:LT, shade:false });
  function counts(i){ var c = {}; CODES.forEach(function(code){ c[code] = 0; }); TERMS.slice(0, i).forEach(function(t){ CODES.forEach(function(code){ if (code !== "o" && t.c.split("").every(function(ch){ return code.indexOf(ch) >= 0; })) c[code] += t.s; }); }); return c; }
  function render2(i){
    var c = counts(i), fills = {}, vs = {};
    CODES.forEach(function(code){ vs[code] = "×" + c[code]; if (c[code] > 0) fills[code] = "c" + Math.min(3, c[code]); });
    V2.set({ fills:fills, values:vs });
    var sum = 0, parts = TERMS.slice(0, i).map(function(t, j){ var v = tot(t.c); sum += t.s * v; return (j ? (t.s > 0 ? " + " : " " + MI + " ") : "") + v; });
    $("#p3-say", host).innerHTML = SAY[i];
    $("#p3-sum", host).innerHTML = i ? parts.join("") + " = " + sum : muted("0");
  }
  MV.player($("#p3-pl", host), { count:TERMS.length + 1, render:render2, interval:1700,
    label:function(i){ return i ? "Term " + i + " of " + TERMS.length + ": " + MV.m((TERMS[i - 1].s > 0 ? "+ " : "- ") + termTxt(TERMS[i - 1])) : "Start"; } });

  // station 3: probabilities, always ÷ n(S)
  var fb3 = null, valsAll = {};
  CODES.forEach(function(c){ valsAll[c] = N(VAL[c]); });
  var qOpts = Q3.map(function(q){ return { id:q.id, t:q.t }; });
  var qRg = radios($("#p3-q3", host), { label:"A person who …", cls:"chips", value:S.s3.q, options:qOpts,
    onChange:function(v){ S.s3.q = v; S.s3.sh = []; S.s3.p = ""; fb3 = null; api.save(); $("#p3-s3p", host).value = ""; paint3(); } });
  var V3 = vennDiagram($("#p3-v3", host), { sets:3, letters:LT, note:false, stripAria:"Shade a region", stripNote:function(c){ return N(VAL[c]); },
    onShade:function(cs){ S.s3.sh = cs; fb3 = null; api.save(); paint3(); } });
  function curQ(){ return Q3.filter(function(q){ return q.id === S.s3.q; })[0]; }
  function cnt(cs){ var t = 0; cs.forEach(function(c){ t += VAL[c]; }); return t; }
  function paint3(){
    var q = curQ(), cs = S.s3.sh, nd = Q3.filter(function(x){ return S.s3.done[x.id]; }).length;
    qOpts.forEach(function(o, i){ o.t = (S.s3.done[Q3[i].id] ? "✓ " : "") + Q3[i].t; }); qRg.refresh();
    V3.set({ values:valsAll, shade:cs });
    $("#p3-s3read", host).innerHTML = MV.readoutHTML([
      ["Question", q ? MV.m("P") + "(a random person " + q.t + ")" : "—"],
      ["Shaded", cs.length ? MV.m(V3.names(cs)[0]) + ": " + V3.words(cs) : muted("nothing yet")],
      ["Count", cs.length ? N(cnt(cs)) + " of the " + TOT + " people" : muted("—")],
      ["Questions done", nd + " of " + Q3.length]]);
    $("#p3-s3fb", host).innerHTML = fb3 ? MV.fbHTML(fb3.k, fb3.h) : "";
  }
  function check3(){
    var q = curQ(); if (!q) return;
    var want = MV.ans(q), cs = S.s3.sh;
    if (!cs.length) fb3 = { k:"bad", h:"Shade the regions that answer the question first." };
    else if (!same(cs, want)) fb3 = { k:"bad", h:"<strong>✗ Not quite.</strong> You shaded " + MV.m(V3.names(cs)[0]) + ": people " + V3.words(cs) + ". Shade every region where a person " + q.t + ", and nothing else." };
    else {
      var n = cnt(want), raw = String(S.s3.p).trim(), p = F.parse(raw);
      if (!raw) fb3 = { k:"", h:"The regions are right: " + N(n) + " people. Now type the probability and check again." };
      else if (!p) fb3 = { k:"bad", h:"Type the probability as a fraction such as 3/8, or as a decimal." };
      else if (F.eq(p, F.of(n, TOT))) { fb3 = { k:"good", h:"<strong>✓ Correct.</strong> " + N(n) + " of the " + TOT + " people: " + MV.m("P") + " = " + F.prob(n, TOT, { dec:false }) + "." }; S.s3.done[q.id] = true; }
      else if (F.eq(p, F.of(n, TOT - VAL.o))) fb3 = { k:"bad", h:"<strong>✗ Not quite.</strong> A random person comes from the whole survey, so divide by " + MV.m("n(S)") + " = " + TOT + ", not by the " + (TOT - VAL.o) + " who use a service." };
      else if (F.eq(p, F.of(n, 1))) fb3 = { k:"bad", h:"<strong>✗ Not quite.</strong> " + N(n) + " is the count. A probability divides it by all " + TOT + " people." };
      else fb3 = { k:"bad", h:"<strong>✗ Not quite.</strong> The shaded regions hold " + N(n) + " people. Divide by all " + TOT + "." };
    }
    api.save(); paint3(); MV.focusFb($("#p3-s3fb", host));
  }
  $("#p3-s3p", host).value = S.s3.p;

  paint1(false); paint3(); showSt();
  return {};
}

// ---------- Performance task: Club census ----------
var task = (function(){
  var api = null, TV = null;
  function read(){ var s = api ? api.S : {}; return { x:intOf(s.x), y:intOf(s.y), z:intOf(s.z) }; }
  function okv(v){ return isNum(v) && v >= 0 && v <= 10; }
  function full(d){ return okv(d.x) && okv(d.y) && okv(d.z); }
  function totals(d){ return { R:12 + d.x + d.y + 3, D:9 + d.x + d.z + 3, M:10 + d.y + d.z + 3, T:42 + d.x + d.y + d.z }; }
  function paint(){
    var d = read(), t = full(d) ? totals(d) : null;
    var mine = function(v, nm){ return '<b class="vw-tv">' + (okv(v) ? N(v) : MV.m(nm)) + "</b>"; }, f = function(v, nm){ return okv(v) ? N(v) : MV.m(nm); };
    TV.set({ names:["Robotics", "Drama", "Music"], values:{ a:"12", b:"9", c:"10", abc:"3", o:"8", ab:mine(d.x, "x"), ac:mine(d.y, "y"), bc:mine(d.z, "z") } });
    $("#tk-read").innerHTML = MV.readoutHTML([
      [MV.m("n(R)"), "12 + " + f(d.x, "x") + " + " + f(d.y, "y") + " + 3" + (t ? " = " + t.R : "")],
      [MV.m("n(D)"), "9 + " + f(d.x, "x") + " + " + f(d.z, "z") + " + 3" + (t ? " = " + t.D : "")],
      [MV.m("n(M)"), "10 + " + f(d.y, "y") + " + " + f(d.z, "z") + " + 3" + (t ? " = " + t.M : "")],
      ["Total", "42 + " + f(d.x, "x") + " + " + f(d.y, "y") + " + " + f(d.z, "z") + (t ? " = " + t.T : "")],
      [MV.m("P") + "(Drama)", t ? F.prob(t.D, 60, { dec:false }) + (t.D >= 25 ? " ≥ 5/12" : " < 5/12") : muted("—")]
    ]);
  }
  return {
    render:function(inp, pv, a){
      api = a;
      inp.innerHTML = '<div class="vw-tin">' + [["x", "Robotics and Drama only"], ["y", "Robotics and Music only"], ["z", "Drama and Music only"]].map(function(p){
        return '<label for="tk-' + p[0] + '"><span>' + MV.m(p[0]) + " = " + p[1] + '</span><input type="number" min="0" max="10" step="1" id="tk-' + p[0] + '" data-tk="' + p[0] + '" value="' + MV.esc(a.S[p[0]] == null ? "" : a.S[p[0]]) + '"></label>';
      }).join("") + "</div>";
      pv.innerHTML = '<div class="tk-pv"><div id="tk-venn"></div><dl class="read" id="tk-read" aria-live="polite"></dl></div>';
      TV = vennDiagram($("#tk-venn", pv), { sets:3, letters:["R", "D", "M"], shade:false });
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); paint(); a.update(); });
      paint();
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Type a whole number from 0 to 10 in each box."; },
    checks:function(d){ if (!full(d)) return [false, false, false]; var t = totals(d); return [t.T === 60, t.R === t.M, t.D >= 25]; },
    key:function(d){
      var k = d.x + "," + d.y + "," + d.z, st = MV.taskState(), n = st.found.length + (st.found.indexOf(k) < 0 ? 1 : 0), T = MV.C.task;
      if (T._more == null) T._more = T.more;
      T.more = n >= 3 ? "You’ve found all three answers." : T._more;
      return k;
    },
    label:function(k){ return MV.m("(x, y, z) = (" + k.split(",").join(", ") + ")"); },
    text:function(k){ return "(" + k.split(",").join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
