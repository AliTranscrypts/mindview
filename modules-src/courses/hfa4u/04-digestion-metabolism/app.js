// HFA4U 04 Digestion, Absorption & Metabolism: hero (forkful → tract → blood and lymph), Journey of a meal (Explore: F4
// digestive system explorer on the SBI4U S1 diagram explorer; meal / follow-a-nutrient / what-if modes, 7 stops with an N13
// player, model clock, molecule panel, villus close-up, readout; predictions; challenge chips inside the challenge cards),
// When digestion works differently (Part 3: lactose data bars, villi toggle, allergy-or-intolerance sort), Trace it (custom
// practice), "Pack Lin's lunch" task. Plan wording lives in content.mjs; this file adds control labels and molecule captions.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function P(x, y){ return f1(x) + "," + f1(y); }
function seg01(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
function txt(x, y, s, cls, anchor){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '">' + s + "</text>"; }
function byId(list, id){ return (list || []).filter(function(x){ return x.id === id; })[0]; }
function cap1(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function lc(s){ return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }

// ---------- @component radioGroup (copied from HFA4U 03 / 02; adds a per-option class) ----------
//   Segmented control or chip row as a real radio group (arrow keys, roving tabindex). No option needs to be checked.
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, off(ids), repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), offs = {};
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="dg-rgw">' + (lab ? '<span class="dg-rgl">' + lab + "</span>" : "") + '<span class="dg-rg ' + (o.cls === "chips" ? "dg-chipset" : "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (offs[x.id] ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (offs[id]) return; var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }).filter(function(x){ return !offs[x]; }); if (!ids.length) return;
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : (k + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint,
    off:function(ids){ var n = {}; (ids || []).forEach(function(x){ n[x] = 1; }); if (JSON.stringify(n) !== JSON.stringify(offs)) { offs = n; paint(); } } };
}

// ---------- @component S1 diagramExplorer (copied from SBI4U 03; one level here: the GI tract) — zoomable schematic SVG
// with native-button hotspots ----------
// diagramExplorer(host, { levels:[{ id, name, vb:[w, h], draw() -> SVG markup, aria() -> text for role="img",
//     hotspots:[{ id, label (accessible name of its button), zones:[[x, y, w, h], …] (viewBox units), tag:[x, y, "l"|"r"|"c"] }] }],
//   level:"id", onTap(id, levelId) })
// -> { level(), setLevel(id), select(id|null), selected(), marks({id:"good"|"bad"}), names({id:html}) (name tags at hs.tag),
//      tags([{x, y, html, align, cls}]) (free tags in viewBox units), over() (<g> above the drawing), svg(), setAria(text),
//      labels(fn(id) -> accessible name), refresh() }
function diagramExplorer(host, o){
  var lvId = o.level || o.levels[0].id, sel = null, marks = {}, free = [], names = {};
  host.innerHTML = '<div class="s1"><div class="s1-stage"><svg class="s1-svg" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg><div class="s1-tags" aria-hidden="true"></div><div class="s1-hs" role="group"></div></div></div>';
  var stage = $(".s1-stage", host), svg = $(".s1-svg", host), tagBox = $(".s1-tags", host), hsBox = $(".s1-hs", host);
  function L(){ return o.levels.filter(function(x){ return x.id === lvId; })[0]; }
  function p2(v){ return Math.round(v * 100) / 100; }
  function render(){
    var lv = L(), w = lv.vb[0], h = lv.vb[1];
    stage.style.aspectRatio = w + " / " + h;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.innerHTML = lv.draw() + '<g class="s1-over"></g>';
    svg.setAttribute("aria-label", lv.aria ? lv.aria() : lv.name);
    hsBox.setAttribute("aria-label", "Organs in the " + MV.plain(lv.name).toLowerCase());
    var list = [];
    lv.hotspots.forEach(function(hs){ hs.zones.forEach(function(z, zi){ list.push({ hs:hs, z:z, zi:zi, area:z[2] * z[3] }); }); });
    list.slice().sort(function(a, b){ return b.area - a.area; }).forEach(function(it, i){ it.zx = 1 + i; });
    list.sort(function(a, b){ return (a.z[1] - b.z[1]) || (a.z[0] - b.z[0]); });
    hsBox.innerHTML = list.map(function(it){
      var z = it.z, cx = (z[0] + z[2] / 2) / w * 100, cy = (z[1] + z[3] / 2) / h * 100, pw = z[2] / w * 100, ph = z[3] / h * 100;
      return '<button type="button" class="s1-b" data-hs="' + it.hs.id + '" data-k="s1' + lvId + it.hs.id + it.zi + '" aria-label="' + MV.esc(it.hs.label) + '" aria-pressed="false" style="left:calc(' + p2(cx) + "% - max(12px, " + p2(pw / 2) + "%));top:calc(" + p2(cy) + "% - max(12px, " + p2(ph / 2) + "%));width:max(24px, " + p2(pw) + "%);height:max(24px, " + p2(ph) + "%);z-index:" + it.zx + '"></button>';
    }).join("");
    paint();
  }
  function paint(){
    $$(".s1-b", hsBox).forEach(function(b){ var id = b.dataset.hs; b.setAttribute("aria-pressed", String(id === sel)); b.className = "s1-b" + (marks[id] ? " " + marks[id] : ""); });
    paintTags();
  }
  function tagOf(hs){ if (hs.tag) return hs.tag; var z = hs.zones[0]; return [z[0] + z[2] / 2, z[1] + z[3] / 2, "c"]; }
  function paintTags(){
    var lv = L(), w = lv.vb[0], h = lv.vb[1], out = [];
    lv.hotspots.forEach(function(hs){ if (names[hs.id]) { var t = tagOf(hs); out.push({ x:t[0], y:t[1], align:t[2], html:names[hs.id], cls:"s1-name" }); } });
    tagBox.innerHTML = out.concat(free).map(function(t){ return '<span class="s1-tag ' + (t.align || "l") + (t.cls ? " " + t.cls : "") + '" style="left:' + p2(t.x / w * 100) + "%;top:" + p2(t.y / h * 100) + '%">' + t.html + "</span>"; }).join("");
  }
  function tap(id){ if (o.onTap) o.onTap(id, lvId); }
  hsBox.addEventListener("click", function(e){ var b = e.target.closest(".s1-b"); if (b) tap(b.dataset.hs); });
  svg.addEventListener("click", function(e){
    var lv = L(), t = e.target.closest ? e.target.closest("[data-hs]") : null, id = t ? t.getAttribute("data-hs") : null;
    if (id && !lv.hotspots.some(function(hs){ return hs.id === id; })) id = null;
    if (!id) {
      var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * lv.vb[0], y = (e.clientY - r.top) / r.height * lv.vb[1], best = 41;
      lv.hotspots.forEach(function(hs){ hs.zones.forEach(function(z){ var dx = Math.max(z[0] - x, 0, x - z[0] - z[2]), dy = Math.max(z[1] - y, 0, y - z[1] - z[3]), d = Math.sqrt(dx * dx + dy * dy); if (d < best) { best = d; id = hs.id; } }); });
    }
    if (id) tap(id);
  });
  render();
  return {
    level:function(){ return lvId; },
    setLevel:function(id){ lvId = id; render(); },
    select:function(id){ sel = id; paint(); },
    selected:function(){ return sel; },
    marks:function(m){ marks = m || {}; paint(); },
    names:function(m){ names = m || {}; paintTags(); },
    tags:function(list){ free = list || []; paintTags(); },
    over:function(){ return $(".s1-over", svg); },
    svg:function(){ return svg; },
    setAria:function(t){ svg.setAttribute("aria-label", t); },
    labels:function(fn){ $$(".s1-b", hsBox).forEach(function(b){ b.setAttribute("aria-label", fn(b.dataset.hs)); }); },
    refresh:render
  };
}

// ---------- @component nutrientGlyphs — molecule tokens in the HFA4U role colours, each with its own shape (colour is never
// the only signal): glucose hexagons (carbohydrate, orange), amino-acid beads (protein, magenta), fat droplets, fatty-acid
// zigzags and chylomicrons (fat, teal), fibre strands (orange rods), diamonds (vitamins and minerals, violet), drops (water, blue) ----------
function hexPts(x, y, r){ var p = []; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; p.push(P(x + r * Math.cos(a), y + r * Math.sin(a))); } return p.join(" "); }
var GL = {
  hex:function(x, y, r, gal){ return '<polygon class="dg-c' + (gal ? " gal" : "") + '" points="' + hexPts(x, y, r) + '"/>' + (gal ? '<circle class="dg-cdot" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 0.3) + '"/>' : ""); },
  link:function(x1, y1, x2, y2, cls, op){ return '<line class="' + cls + '" x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '"' + (op != null ? ' style="opacity:' + f1(op) + '"' : "") + "/>"; },
  bead:function(x, y, r){ return '<circle class="dg-p" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '"/>'; },
  drop:function(x, y, r){ return '<circle class="dg-fd" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '"/>'; },
  zig:function(x, y, n, s){ s = s || 3.6; var p = []; for (var i = 0; i <= n; i++) p.push(P(x + i * s, y + (i % 2 ? -2.4 : 2.4))); return '<polyline class="dg-fz" points="' + p.join(" ") + '"/>'; },
  chylo:function(x, y, r){ return '<circle class="dg-ch" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '"/><circle class="dg-chi" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r * 0.42) + '"/>'; },
  dia:function(x, y, r){ return '<polygon class="dg-m" points="' + P(x, y - r) + " " + P(x + r, y) + " " + P(x, y + r) + " " + P(x - r, y) + '"/>'; },
  wat:function(x, y, r){ return '<path class="dg-w" d="M' + P(x, y - r * 1.35) + "C" + P(x + r * 0.95, y - r * 0.15) + " " + P(x + r, y + r * 0.9) + " " + P(x, y + r) + "C" + P(x - r, y + r * 0.9) + " " + P(x - r * 0.95, y - r * 0.15) + " " + P(x, y - r * 1.35) + 'Z"/>'; },
  fib:function(x, y, len){ var d = "M" + P(x, y) + "Q" + P(x + len / 4, y - 4) + " " + P(x + len / 2, y) + "T" + P(x + len, y); return '<path class="dg-fib" d="' + d + '"/><path class="dg-fib2" d="' + d + '"/>'; },
  gas:function(x, y, r){ return '<circle class="dg-gas" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '"/>'; },
  bac:function(x, y, a, cls){ return '<rect class="dg-bac' + (cls ? " " + cls : "") + '" x="' + f1(x - 5) + '" y="' + f1(y - 2.3) + '" width="10" height="4.6" rx="2.3" transform="rotate(' + f1(a) + " " + f1(x) + " " + f1(y) + ')"/>'; }
};
// a chain of hexagons in groups, e.g. [3, 2, 2]; split 0..1 opens the gaps between groups (for the P1 reveal)
function hexGroups(x0, y, groups, r, gap, split, gal){
  var h = "", x = x0 + r, sp = r * 2.15, out = [], k = 0;
  groups.forEach(function(n, g){ for (var i = 0; i < n; i++) { out.push({ x:x, g:g, i:i, gal:gal && k % 2 === 1 }); x += sp; k++; } x += gap * (split == null ? 1 : split); });
  out.forEach(function(p, j){ var q = out[j + 1]; if (q) { var same = q.g === p.g; if (same || split != null) h += GL.link(p.x + r * 0.86, y, q.x - r * 0.86, y, "dg-cl", same ? 1 : 1 - (split == null ? 1 : split)); } });
  out.forEach(function(p){ h += GL.hex(p.x, y, r, p.gal); });
  return h;
}
function beadGroups(x0, y, groups, r, gap, wave){
  var h = "", x = x0 + r, sp = r * 2.2, out = [];
  groups.forEach(function(n, g){ for (var i = 0; i < n; i++) { out.push({ x:x, y:y + (wave ? Math.sin(out.length * 1.3) * 3 : 0), g:g }); x += sp; } x += gap; });
  out.forEach(function(p, j){ var q = out[j + 1]; if (q && q.g === p.g) h += GL.link(p.x, p.y, q.x, q.y, "dg-pl"); });
  out.forEach(function(p){ h += GL.bead(p.x, p.y, r); });
  return h;
}
// one strip of tokens for a nutrient kind in a given state, about 78 units wide, centred on y
function strip(kind, st, x0, y, o){
  o = o || {};
  if (kind === "carb") {
    if (st === "chain") return hexGroups(x0, y, [3, 2, 2], 4.4, 6, o.split == null ? 0 : o.split);
    if (st === "short") return hexGroups(x0, y, [3, 2, 2], 4.4, 6);
    if (st === "maltose") return hexGroups(x0, y, [2, 2, 2], 4.4, 7);
    if (st === "glucose") return hexGroups(x0, y, [1, 1, 1, 1, 1], 4.4, 6.5);
    if (st === "glycogen") return hexGroups(x0, y + 4, [4], 4.4, 0) + hexGroups(x0 + 9.5, y - 5.5, [2], 4.4, 0) + GL.link(x0 + 14, y + 0.5, x0 + 14, y - 1.5, "dg-cl");
  }
  if (kind === "lactose") {
    if (st === "pair") return hexGroups(x0, y, [2, 2], 4.4, 9, null, true);
    if (st === "split") return hexGroups(x0, y, [1, 1, 1, 1], 4.4, 7, null, true);
  }
  if (kind === "protein") {
    if (st === "folded") return beadGroups(x0, y, [8], 3.6, 0, true);
    if (st === "peptides") return beadGroups(x0, y, [3, 3, 2], 3.6, 5);
    if (st === "small") return beadGroups(x0, y, [2, 2, 2, 1], 3.6, 5);
    if (st === "amino") return beadGroups(x0, y, [1, 1, 1, 1, 1], 3.6, 7.5);
    if (st === "built") return beadGroups(x0, y, [8], 3.6, 0);
  }
  if (kind === "fat") {
    if (st === "droplet") return GL.drop(x0 + 12, y, 9.5);
    if (st === "droplets") return GL.drop(x0 + 7, y, 5.6) + GL.drop(x0 + 21, y + 1, 5) + GL.drop(x0 + 34, y - 1, 5.6);
    if (st === "fa") return GL.drop(x0 + 4, y - 4, 2.8) + GL.drop(x0 + 4, y + 5, 2.8) + GL.zig(x0 + 11, y - 5, 6) + GL.zig(x0 + 11, y + 3, 6) + GL.zig(x0 + 38, y - 1, 6) + GL.drop(x0 + 64, y, 2.8);
    if (st === "chylo") return GL.chylo(x0 + 7, y, 6) + GL.chylo(x0 + 22, y, 6) + GL.chylo(x0 + 37, y, 6);
  }
  if (kind === "fibre") {
    if (st === "strand") return GL.fib(x0 + 1, y - 4, 32) + GL.fib(x0 + 8, y + 5, 32);
    if (st === "more") return GL.fib(x0 + 1, y - 6, 32) + GL.fib(x0 + 8, y + 1, 32) + GL.fib(x0 + 3, y + 8, 32) + GL.fib(x0 + 38, y - 2, 30);
    if (st === "ferment") return GL.fib(x0 + 1, y + 3, 14) + GL.fib(x0 + 18, y + 5, 12) + GL.gas(x0 + 38, y - 3, 3.4) + GL.gas(x0 + 47, y + 4, 2.6) + GL.gas(x0 + 54, y - 5, 2.2) + GL.zig(x0 + 60, y + 4, 3, 3);
    if (st === "less") return GL.fib(x0 + 1, y - 1, 30) + GL.gas(x0 + 40, y - 2, 2.4);
  }
  if (kind === "gas") return GL.gas(x0 + 5, y + 2, 3.6) + GL.gas(x0 + 15, y - 4, 3) + GL.gas(x0 + 24, y + 3, 4) + GL.gas(x0 + 34, y - 3, 2.6) + GL.gas(x0 + 43, y + 2, 3.2);
  if (kind === "micro") return GL.dia(x0 + 5, y, 4.4) + GL.dia(x0 + 17, y, 4.4) + GL.dia(x0 + 29, y, 4.4) + GL.dia(x0 + 41, y, 4.4);
  if (kind === "water") return GL.wat(x0 + 5, y + 1, 3.6) + GL.wat(x0 + 16, y + 1, 3.6) + GL.wat(x0 + 27, y + 1, 3.6) + GL.wat(x0 + 38, y + 1, 3.6);
  return "";
}
function arrowR(x1, x2, y){ return '<path class="dg-arr" d="M' + P(x1, y) + "H" + f1(x2 - 1) + '"/><path class="dg-arrh" d="M' + P(x2 - 5, y - 3.5) + "L" + P(x2, y) + "L" + P(x2 - 5, y + 3.5) + '"/>'; }
function miniGlyph(kind){
  var g = kind === "carb" ? GL.hex(9, 9, 5.4) : kind === "lactose" ? GL.hex(9, 9, 5.4, true) : kind === "protein" ? GL.bead(9, 9, 4.6) : kind === "fat" ? GL.chylo(9, 9, 6) : kind === "fibre" ? GL.zig(3, 10, 3, 4) : kind === "micro" ? GL.dia(9, 9, 5.4) : GL.wat(9, 10, 4.6);
  return '<svg class="dg-mini" viewBox="0 0 18 18" aria-hidden="true">' + g + "</svg>";
}

// ---------- molecule captions (module-written, from the plan's overview) ----------
var MOLN = { carb:"Starch (carbohydrate)", protein:"Protein", fat:"Fat", lactose:"Lactose (milk sugar)", fibre:"Fibre", micro:"Vitamins and minerals", water:"Water" };
// per stop: [before state, after state or "", caption]
var MOL = {
  carb:[["chain", "short", "salivary amylase cuts it into shorter sugar chains"], ["short", "", "shorter sugar chains ride down"], ["short", "", "acid stops salivary amylase"], ["short", "maltose", "pancreatic amylase: → maltose"], ["maltose", "glucose", "maltase: → glucose, absorbed into capillaries"], null, ["glucose", "glycogen", "energy (catabolism) or glycogen (anabolism)"]],
  protein:[["folded", "", "chewed, not yet digested"], ["folded", "", "no enzymes yet"], ["folded", "peptides", "pepsin: → peptides"], ["peptides", "small", "trypsin: → smaller peptides"], ["small", "amino", "peptidases: → amino acids, absorbed into capillaries"], null, ["amino", "built", "built into body proteins (anabolism)"]],
  fat:[["droplet", "", "chewed, not yet digested"], ["droplet", "", "no enzymes yet"], ["droplet", "droplets", "churning breaks it into droplets"], ["droplets", "fa", "bile emulsifies; lipase: → fatty acids + monoglycerides"], ["fa", "chylo", "micelles → chylomicrons → lacteal (lymph)"], null, ["chylo", "droplet", "energy (catabolism) or stored fat (anabolism)"]],
  lactose:[["pair", "", "not split yet"], ["pair", "", "not split yet"], ["pair", "", "not split yet"], ["pair", "", "not split yet"], ["pair", "split", "lactase: → glucose + galactose, absorbed"], null, null],
  fibre:[["strand", "", "no human enzyme digests it"], ["strand", "", "no human enzyme digests it"], ["strand", "", "slows stomach emptying"], ["strand", "", "no human enzyme digests it"], ["strand", "", "not absorbed; slows sugar absorption"], ["strand", "ferment", "bacteria ferment it: short-chain fatty acids + gas"], null],
  micro:[["d", "", "freed from food; not digested"], ["d", "", "not digested"], ["d", "", "freed from food; not digested"], ["d", "", "not digested"], ["d", "d", "absorbed: most into capillaries; A, D, E and K with fat"], null, null],
  water:[["w", "", "in the food and drink"], ["w", "", "in the food and drink"], ["w", "", "a little is absorbed"], ["w", "", "juices add more water"], ["w", "w", "most is absorbed"], ["w", "w", "more absorbed, with electrolytes"], null]
};
function kindOfNut(n){ return n.kind || "micro"; }

// ---------- tract drawing (360 × 440 viewBox; schematic, front view) ----------
var VB = [360, 440];
var D_ESO = "M160 48 C 162 86, 168 116, 182 142";
var D_DUO = "M164 240 C 144 246, 134 262, 138 278 C 142 292, 168 298, 186 290 C 194 286, 196 284, 197 281";
var D_SI = "M197 281 C 204 296, 206 306, 204 318 C 236 318, 250 330, 232 338 C 200 350, 112 334, 106 350 C 100 366, 236 356, 240 372 C 244 390, 116 378, 108 392 C 104 400, 96 404, 84 405";
var D_LI = "M84 410 L 72 410 L 72 306 C 72 300, 76 298, 82 298 L 254 298 C 260 298, 264 302, 264 308 L 264 398 C 264 418, 238 424, 214 428 L 188 434";
var COLON_PTS = [[72, 392], [72, 360], [72, 330], [96, 298], [130, 298], [166, 298], [204, 298], [240, 298], [264, 322], [264, 352], [264, 384], [236, 424]];
var SI_PTS = [[222, 324], [238, 332], [196, 346], [150, 341], [118, 346], [150, 361], [196, 360], [234, 368], [200, 384], [152, 383], [116, 390]];
var ANCH = { mouth:[160, 32], eso:[167, 96], stom:[232, 176], duo:[150, 270], jej:[178, 362], li:[96, 322], after:[110, 152] };
var STOP_ORG = ["mouth", "eso", "stom", "duo", "jej", "li", "liver"];
var ORG_STOP = { mouth:0, eso:1, stom:2, duo:3, gall:3, panc:3, jej:4, li:5, liver:6, cells:6 };
function tube(d, w, id){
  return '<g class="dg-tubeg" data-hs="' + id + '" data-org="' + id + '"><path class="dg-tube-o" d="' + d + '" style="stroke-width:' + w + 'px"/><path class="dg-tube-i" d="' + d + '" style="stroke-width:' + (w - 3.6) + 'px"/><path class="dg-tube-t" d="' + d + '" style="stroke-width:' + (w - 3.6) + 'px"/></g>';
}
function tractSVG(){
  var h = "";
  // heart marker (where the lymph joins the blood) and body cells
  h += '<path class="dg-heart" d="M58 96 C 48 89, 46 79, 53 77 C 56 76, 58 78, 58 80 C 58 78, 60 76, 63 77 C 70 79, 68 89, 58 96 Z"/>' + txt(58, 112, "heart", "dg-lab s");
  h += '<g class="dg-org dg-cells" data-hs="cells" data-org="cells"><circle cx="296" cy="60" r="11"/><circle cx="319" cy="70" r="11"/><circle cx="300" cy="83" r="11"/><circle class="dg-nuc" cx="297" cy="60" r="3"/><circle class="dg-nuc" cx="319" cy="71" r="3"/><circle class="dg-nuc" cx="301" cy="84" r="3"/></g>' + txt(306, 110, "Body cells", "dg-lab", "middle");
  // liver, gallbladder and the bile duct
  h += '<path class="dg-org dg-liver" data-hs="liver" data-org="liver" d="M52 132 C 80 116, 150 114, 178 122 C 184 140, 170 160, 150 176 C 126 192, 86 198, 62 190 C 48 180, 44 150, 52 132 Z"/>';
  h += '<path class="dg-duct" d="M140 178 C 146 200, 152 226, 152 248"/>';
  h += '<ellipse class="dg-org dg-gall" data-hs="gall" data-org="gall" cx="140" cy="194" rx="9" ry="13" transform="rotate(-18 140 194)"/>';
  // small intestine (behind the colon), stomach, esophagus, pancreas, duodenum, large intestine
  h += tube(D_SI, 13, "jej");
  h += '<path class="dg-org dg-stom" data-hs="stom" data-org="stom" d="M176 138 C 196 118, 258 120, 266 166 C 272 212, 240 250, 200 250 C 186 250, 172 246, 162 240 L 168 226 C 196 232, 222 222, 226 196 C 228 176, 212 162, 186 158 Z"/>';
  h += tube(D_ESO, 12, "eso");
  h += '<path class="dg-org dg-panc" data-hs="panc" data-org="panc" d="M182 258 C 206 250, 244 246, 266 242 C 276 241, 278 254, 266 256 C 244 262, 208 268, 184 270 C 176 270, 176 260, 182 258 Z"/>';
  h += tube(D_DUO, 14, "duo");
  h += tube(D_LI, 22, "li");
  // mouth: lips, teeth, tongue
  h += '<g data-hs="mouth" data-org="mouth" class="dg-mouthg"><ellipse class="dg-org dg-mouth" cx="160" cy="31" rx="31" ry="15"/><ellipse class="dg-tongue" cx="160" cy="37" rx="16" ry="5"/>';
  for (var i = 0; i < 6; i++) h += '<rect class="dg-tooth" x="' + (143 + i * 6) + '" y="19" width="4.6" height="5" rx="1"/><rect class="dg-tooth" x="' + (143 + i * 6) + '" y="39" width="4.6" height="4.4" rx="1"/>';
  h += "</g>";
  // labels
  h += txt(196, 36, "Mouth", "dg-lab", "start") + txt(178, 84, "Esophagus", "dg-lab", "start") + txt(98, 160, "Liver", "dg-lab dk", "middle") + txt(126, 222, "Gallbladder", "dg-lab", "end");
  h += txt(272, 182, "Stomach", "dg-lab", "start") + txt(282, 255, "Pancreas", "dg-lab", "start") + txt(130, 268, "Duodenum", "dg-lab", "end");
  h += txt(282, 342, "Small", "dg-lab", "start") + txt(282, 356, "intestine", "dg-lab", "start") + txt(282, 400, "Large", "dg-lab", "start") + txt(282, 414, "intestine", "dg-lab", "start");
  return h;
}
var HS = [
  { id:"mouth", label:"Mouth (stop 1)", zones:[[126, 14, 70, 36]] },
  { id:"eso", label:"Esophagus (stop 2)", zones:[[150, 52, 36, 86]] },
  { id:"cells", label:"Body cells (stop 7: after absorption)", zones:[[278, 44, 56, 52]] },
  { id:"liver", label:"Liver (stop 7: after absorption)", zones:[[48, 118, 128, 60]] },
  { id:"gall", label:"Gallbladder (helps at stop 4, the duodenum)", zones:[[128, 180, 26, 28]] },
  { id:"stom", label:"Stomach (stop 3)", zones:[[180, 122, 90, 102]] },
  { id:"panc", label:"Pancreas (helps at stop 4, the duodenum)", zones:[[200, 242, 78, 26]] },
  { id:"duo", label:"Duodenum (stop 4)", zones:[[130, 232, 68, 58]] },
  { id:"jej", label:"Jejunum and ileum (stop 5)", zones:[[96, 316, 152, 92]] },
  { id:"li", label:"Large intestine (stop 6)", zones:[[60, 300, 24, 112], [60, 287, 216, 22], [252, 300, 24, 104], [180, 404, 90, 32]] }
];
// route lines (blood in --pen, lymph in teal and dashed), with arrowheads drawn by hand
function headAt(x, y, ang, cls){ var a1 = ang + 2.6, a2 = ang - 2.6, L = 7; return '<path class="' + cls + '" d="M' + P(x + L * Math.cos(a1), y + L * Math.sin(a1)) + "L" + P(x, y) + "L" + P(x + L * Math.cos(a2), y + L * Math.sin(a2)) + '"/>'; }
function routeSVG(blood, lymph, prog){
  var h = "", p = prog == null ? 1 : prog;
  if (blood) {
    h += '<path class="dg-blood" pathLength="100" style="stroke-dasharray:' + f1(100 * p) + ' 200" d="M212 334 C 214 300, 200 268, 172 238 C 160 224, 148 204, 132 184"/>';
    if (p >= 1) h += headAt(132, 184, Math.atan2(184 - 204, 132 - 148), "dg-bloodh");
    if (p >= 1) h += '<path class="dg-blood" d="M66 136 C 60 122, 58 112, 58 100"/>' + headAt(58, 100, -Math.PI / 2, "dg-bloodh") + '<path class="dg-blood" d="M70 80 C 140 50, 230 46, 282 58"/>' + headAt(282, 58, 0.22, "dg-bloodh");
  }
  if (lymph) {
    h += '<path class="dg-lymph" pathLength="100" style="stroke-dasharray:' + (p >= 1 ? "5 4" : f1(100 * p) + " 200") + '" d="M106 356 C 30 350, 26 232, 36 150 C 40 118, 46 104, 52 96"/>';
    if (p >= 1) h += headAt(52, 96, Math.atan2(96 - 104, 52 - 46), "dg-lymphh");
  }
  return h;
}

// ---------- hero: forkful → mouth → esophagus → stomach → small intestine → blood and lymph ----------
function heroSVG(st){
  // 360 × 256 viewBox: mouth top left, esophagus, stomach, small intestine across, vessels along the bottom
  var h = "", rm = st.rm, A = rm ? 1 : st.a, B = rm ? 1 : st.b, Cc = rm ? 1 : st.c, Dd = rm ? 1 : st.d, E = rm ? 1 : st.e;
  var ESO = [[74, 50], [102, 54], [96, 94], [114, 108]], SI = [[180, 140], [200, 160], [210, 118], [236, 126]];
  h += '<rect class="dg-hblood" x="148" y="204" width="98" height="22" rx="11"/>' + txt(197, 244, "blood (capillary)", "dg-hlab", "middle");
  h += '<rect class="dg-hlymph" x="256" y="204" width="98" height="22" rx="11"/>' + txt(305, 244, "lymph (lacteal)", "dg-hlab", "middle");
  var dE = "M74 50 C 102 54, 96 94, 114 108", dS = "M180 140 C 200 160, 210 118, 236 126 C 262 134, 266 166, 292 156 C 318 146, 322 114, 352 122";
  h += '<path class="dg-htube-o" d="' + dE + '"/><path class="dg-htube-i" d="' + dE + '"/>';
  var wob = rm ? 0 : Math.sin(Dd * Math.PI * 6) * 3 * (Dd > 0 && Dd < 1 ? 1 : 0);
  h += '<path class="dg-hstom" d="M108 106 C 122 ' + f1(84 - wob) + ", 184 " + f1(86 + wob) + ", 188 120 C 192 " + f1(152 + wob) + ', 152 162, 132 152 C 118 146, 108 136, 106 122 Z"/>';
  h += '<path class="dg-htube-o" d="' + dS + '"/><path class="dg-htube-i" d="' + dS + '"/>';
  for (var k = 0; k < 9; k++) { var vx = 184 + k * 19; h += '<path class="dg-hvil" d="M' + vx + " 192 q 4 -13 8 0" + '"/>'; }
  var jaw = rm ? 0 : Math.abs(Math.sin(B * Math.PI * 4)) * 5 * (B > 0 && B < 1 ? 1 : 0);
  h += '<ellipse class="dg-hmouth" cx="48" cy="46" rx="28" ry="' + f1(13 + jaw) + '"/>';
  for (var i = 0; i < 6; i++) h += '<rect class="dg-tooth" x="' + (32 + i * 6) + '" y="' + f1(35 - jaw) + '" width="4.4" height="5" rx="1"/><rect class="dg-tooth" x="' + (32 + i * 6) + '" y="' + f1(52 + jaw) + '" width="4.4" height="5" rx="1"/>';
  // labels appear as each stage is reached
  if (B > 0.05) h += '<g style="opacity:' + f1(seg01(B, 0.05, 0.4)) + '">' + txt(86, 26, "Mouth: teeth chew;", "dg-hlab", "start") + txt(86, 41, "saliva amylase starts", "dg-hlab", "start") + "</g>";
  if (Cc > 0.05) h += '<g style="opacity:' + f1(seg01(Cc, 0.05, 0.4)) + '">' + txt(80, 104, "Esophagus:", "dg-hlab", "end") + txt(80, 119, "peristalsis", "dg-hlab", "end") + "</g>";
  if (Dd > 0.05) h += '<g style="opacity:' + f1(seg01(Dd, 0.05, 0.4)) + '">' + txt(198, 76, "Stomach: churns", "dg-hlab", "start") + "</g>";
  if (E > 0.05) h += '<g style="opacity:' + f1(seg01(E, 0.05, 0.3)) + '">' + txt(266, 104, "Small intestine", "dg-hlab", "middle") + "</g>";
  // the forkful (lentil curry and rice), then the bolus on its way
  if (!rm && A > 0 && B < 1) {
    var fx = lerp(-40, -6, A) + lerp(0, 16, seg01(B, 0, 0.25)), fo = A * (1 - seg01(B, 0.2, 0.35));
    h += '<g style="opacity:' + f1(fo) + '" transform="translate(' + f1(fx) + ' 0)"><path class="dg-hfork" d="M-10 98 L 18 62"/><path class="dg-hfork" d="M14 58 l 9 -9 M18 62 l 9 -9 M22 66 l 9 -9"/>' +
      '<ellipse class="dg-hcurry" cx="28" cy="52" rx="12" ry="7"/><ellipse class="dg-hrice" cx="22" cy="50" rx="2.6" ry="1.6"/><ellipse class="dg-hrice" cx="30" cy="48" rx="2.6" ry="1.6"/><ellipse class="dg-hrice" cx="34" cy="54" rx="2.6" ry="1.6"/></g>';
  }
  function bezier(q, t){ var u = 1 - t; return [u * u * u * q[0][0] + 3 * u * u * t * q[1][0] + 3 * u * t * t * q[2][0] + t * t * t * q[3][0], u * u * u * q[0][1] + 3 * u * u * t * q[1][1] + 3 * u * t * t * q[2][1] + t * t * t * q[3][1]]; }
  if (!rm) {
    var bol = null;
    if (B >= 1 && Cc < 1) bol = bezier(ESO, Cc);
    else if (Cc >= 1 && Dd < 1) bol = [148 + Math.cos(Dd * Math.PI * 6) * 12, 122 + Math.sin(Dd * Math.PI * 6) * 8];
    else if (Dd >= 1 && E < 0.35) bol = bezier(SI, seg01(E, 0, 0.35));
    if (bol) {
      if (Cc > 0 && Cc < 1) { var w = bezier(ESO, clamp(Cc - 0.1, 0, 1)); h += '<circle class="dg-hwave" cx="' + f1(w[0]) + '" cy="' + f1(w[1]) + '" r="11"/>'; }
      h += '<circle class="dg-hbolus" cx="' + f1(bol[0]) + '" cy="' + f1(bol[1]) + '" r="7"/>';
    }
  }
  // the shapes break apart and cross: hexagons and beads into the capillary, teal chains into the lacteal
  var u = rm ? 1 : seg01(E, 0.35, 1);
  if (rm || E > 0.3) {
    var SH = [["hex", 200, 162], ["bead", 222, 180], ["hex", 244, 198], ["bead", 266, 216], ["hex", 284, 234], ["zig", 304, 280], ["zig", 324, 306], ["zig", 344, 332]];
    SH.forEach(function(s, j){
      var x = lerp(s[1], s[2], u), y = lerp(140 + (j % 3) * 6, 215, u);
      if (s[0] === "hex") h += GL.hex(x, y, 6); else if (s[0] === "bead") h += GL.bead(x, y, 5); else h += GL.zig(x - 9, y, 5, 3.6);
    });
  }
  return h;
}
function hero(f){
  var host = $("#dg-hero"); if (!host) return;
  var H = MV.C.hero, st = { a:0, b:0, c:0, d:0, e:0 };
  host.innerHTML = '<svg class="dg-hsvg" viewBox="0 8 360 248" role="img" aria-label="' + esc(H.aria) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ svg.innerHTML = heroSVG(st); }
  function cap(){ if (f.cap) { f.cap.innerHTML = H.caption + '<span class="dg-len">' + H.length + "</span>"; f.cap.classList.add("dg-cap"); } }
  if (MV.reduceMotion) { st = { rm:true }; draw(); cap(); return; }
  draw();
  function run(k, dur, next){ MV.tween({ dur:dur, step:function(t){ st[k] = t; draw(); }, done:function(){ MV.wait(250, next); } }); }
  MV.wait(400, function(){ run("a", 700, function(){ run("b", 1300, function(){ run("c", 1200, function(){ run("d", 1300, function(){ run("e", 2200, cap); }); }); }); }); });
}

// ---------- Explore: Journey of a meal (@component F4 digestiveExplorer) ----------
function explore(host, api){
  var D = api.content, S = api.S, STOPS = D.stops, CH = {}, NUT = {}, COND = {};
  D.challenges.forEach(function(c){ CH[c.id] = c; });
  D.nutrients.forEach(function(n){ NUT[n.id] = n; });
  D.conditions.forEach(function(c){ COND[c.id] = c; });
  S.meal = byId(D.meals, S.meal) ? S.meal : "m1";
  S.mode = ["meal", "follow", "whatif"].indexOf(S.mode) >= 0 ? S.mode : "meal";
  S.nut = NUT[S.nut] ? S.nut : "starch";
  S.cond = COND[S.cond] ? S.cond : "";
  S.stop = clamp(+S.stop || 0, 0, 6);
  S.speed = ["1", "10", "60"].indexOf(String(S.speed)) >= 0 ? String(S.speed) : "10";
  S.tc = S.tc || {}; ["tc1", "tc2", "tc3"].forEach(function(k){ if (!Array.isArray(S.tc[k])) S.tc[k] = []; });
  var fx = { hide:false, p1:null, p2:null, p3:null, p4:null }, anim = null, pend = null, note = "", clockAnim = null, clk = { m:null, ff:false }, booting = true;

  host.innerHTML = '<div class="dg-ex"><div class="dg-ctl"><div id="dg-meal"></div><div id="dg-mode"></div><div id="dg-nut"></div><div id="dg-cond"></div></div>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="dg-grid" data-mv="graph"><div class="dg-main"><div class="dg-tractw"><div id="dg-tract"></div></div>' +
    '<p class="dg-legend" aria-hidden="true"><span>' + miniGlyph("carb") + "carbohydrate</span><span>" + miniGlyph("protein") + "protein</span><span>" + miniGlyph("fat") + "fat</span><span>" + miniGlyph("micro") + "vitamins, minerals</span><span>" + miniGlyph("water") + 'water</span><span><i class="dg-lsw b"></i>blood</span><span><i class="dg-lsw l"></i>lymph</span></p>' +
    '<p class="tiny dg-onote" id="dg-onote" aria-live="polite"></p>' +
    '<div class="dg-stopsw"><div class="dg-stops" id="dg-stops" role="group" aria-label="Stops on the journey (arrow keys move)"></div></div><div id="dg-player"></div>' +
    '<h4 class="dg-h4">Molecules at this stop</h4><div class="dg-mols" id="dg-mols"></div></div>' +
    '<div class="dg-side"><h4 class="dg-h4">Readout</h4><dl class="read" id="dg-read" aria-live="polite"></dl><div class="dg-bmr" id="dg-bmr" hidden></div>' +
    '<div class="dg-clockw"><svg class="dg-clock" id="dg-clock" viewBox="0 0 64 64" aria-hidden="true"></svg><div><p class="dg-clockt" id="dg-clockt"></p><p class="tiny muted">' + D.timeNote + ' <span class="hfa-model">Model data</span></p><div id="dg-speed"></div></div></div>' +
    '<h4 class="dg-h4">Close-up: one villus</h4><svg class="dg-vil" id="dg-vil" viewBox="0 0 300 180" role="img"></svg><p class="tiny dg-vcap" id="dg-vcap"></p>' +
    '<h4 class="dg-h4">Absorbed so far</h4><div class="dg-tray" id="dg-tray" aria-live="polite"></div></div></div></div>';

  function setMode(fn){ return function(v){ cancelAnim(); note = ""; fn(v); commit(); }; }
  var mealRG = radios($("#dg-meal"), { label:"Meal", cls:"chips", options:D.meals.map(function(m, i){ return { id:m.id, t:"<strong>M" + (i + 1) + "</strong> " + m.t }; }), value:S.meal, onChange:setMode(function(v){ S.meal = v; }) });
  var modeRG = radios($("#dg-mode"), { label:"Mode", options:[{ id:"meal", t:"1. Meal mode" }, { id:"follow", t:"2. Follow a nutrient" }, { id:"whatif", t:"3. What if?" }], value:S.mode, onChange:setMode(function(v){ S.mode = v; }) });
  var nutRG = radios($("#dg-nut"), { label:"Nutrient", cls:"chips", options:D.nutrients.map(function(n){ return { id:n.id, t:n.t, cls:"k-" + kindOfNut(n) }; }), value:S.nut, onChange:setMode(function(v){ S.nut = v; }) });
  var condRG = radios($("#dg-cond"), { label:"Condition", aria:"Condition (choose one)", cls:"chips", options:D.conditions.map(function(c){ return { id:c.id, t:c.t }; }), value:S.cond, onChange:setMode(function(v){ S.cond = v; }) });
  var speedRG = radios($("#dg-speed"), { label:"Clock speed", cls:"chips", options:[{ id:"1", t:"×1" }, { id:"10", t:"×10" }, { id:"60", t:"×60" }], value:S.speed, onChange:function(v){ S.speed = v; api.save(); startClock(); } });

  var tr = diagramExplorer($("#dg-tract"), { levels:[{ id:"tract", name:"Digestive tract", vb:VB, draw:tractSVG, aria:function(){ return "Digestive tract"; }, hotspots:HS }],
    onTap:function(id){ cancelAnim(); note = D.organs[id] || ""; player.go(ORG_STOP[id]); } });

  // ===== state helpers =====
  function meal(){ return byId(D.meals, S.meal); }
  function cond(){ return S.mode === "whatif" ? COND[S.cond] || null : null; }
  function lowLac(){ var c = cond(); return !!(c && c.id === "lactase" && meal().has.lactose); }
  function follow(){ return S.mode === "follow" ? NUT[S.nut] : null; }

  // ===== molecules at this stop =====
  function rowsFor(){
    var s = S.stop, m = meal(), c = cond(), out = [], N = follow();
    function add(k, name, spec, capText, over){
      if (!spec) return;
      var b = [k, spec[0]], a = spec[1] ? [k, spec[1]] : null;
      if (over) { if (over.b) b = [over.b[0] || k, over.b[1]]; if (over.a !== undefined) a = over.a; }
      out.push({ k:k, name:name, b:b, a:a, t:capText != null ? capText : spec[2] });
    }
    if (N) {
      var k = kindOfNut(N), map = { starch:"carb", protein:"protein", fat:"fat", fibre:"fibre", water:"water" }, spec = MOL[map[N.id] || "micro"][s];
      if (!spec && s === 6 && k === "micro") spec = ["d", "", ""];
      var mk = map[N.id] || "micro";
      if (spec) add(mk, N.t, [mk === "micro" ? "d" : spec[0], spec[1], ""], N.path[s][0], mk === "micro" && N.fat && s === 4 ? { a:["fat", "chylo"] } : null);
      return out;
    }
    var hi = c && c.id === "fibre", abx = c && c.id === "abx", gall = c && c.id === "gall";
    if (m.has.starch) add("carb", MOLN.carb, MOL.carb[s]);
    if (m.has.protein) add("protein", MOLN.protein, MOL.protein[s]);
    if (m.has.fat) add("fat", MOLN.fat, MOL.fat[s], gall && s === 3 ? "bile only trickles in, so a big fatty meal emulsifies less well" : null);
    if (m.has.lactose) {
      if (lowLac() && s === 4) add("lactose", MOLN.lactose, ["pair", "pair", "too little lactase: it passes unsplit"]);
      else if (lowLac() && s === 5) add("lactose", MOLN.lactose, ["pair", "", "bacteria ferment it: gas; water is drawn in"], null, { a:["gas", "gas"] });
      else add("lactose", MOLN.lactose, MOL.lactose[s]);
    }
    if (m.has.fibre) {
      var fs = MOL.fibre[s];
      if (fs && hi) add("fibre", MOLN.fibre + " (extra)", [fs[0] === "strand" ? "more" : fs[0], fs[1], s === 5 ? "more material to ferment" : fs[2]], null, { b:["fibre", "more"] });
      else if (fs && abx && s === 5) add("fibre", MOLN.fibre, ["strand", "less", "fewer bacteria: less fermentation"]);
      else add("fibre", MOLN.fibre, fs);
    }
    add("micro", MOLN.micro, MOL.micro[s] && ["d", MOL.micro[s][1], MOL.micro[s][2]]);
    add("water", MOLN.water, MOL.water[s] && ["w", MOL.water[s][1], MOL.water[s][2]]);
    return out;
  }
  function stripOf(spec, x0, y, o){ var k = spec[0], st = spec[1]; return strip(k, st === "d" || st === "w" ? "" : st, x0, y, o); }
  function molsPaint(){
    var rows = rowsFor(), s = S.stop, h = "";
    rows.forEach(function(r){
      var hideA = fx.hide, split = fx.p1 != null && r.k === "carb" && s === 0 ? fx.p1 : null, svg = '<svg class="dg-mrow" viewBox="0 0 190 26" aria-hidden="true">';
      if (split != null) svg += strip("carb", "chain", 2, 13, { split:split }) + (split >= 1 ? "" : "");
      else svg += stripOf(r.b, 2, 13);
      if (r.a && !hideA && split == null) svg += arrowR(84, 100, 13) + stripOf(r.a, 106, 13);
      svg += "</svg>";
      h += '<div class="dg-mol k-' + r.k + '">' + svg + '<p><strong>' + r.name + "</strong>" + (hideA || (split != null && split < 1) ? "" : ": " + r.t) + "</p></div>";
    });
    if (!follow() && s === 5) h += '<p class="tiny muted">Glucose, amino acids and fats were absorbed in the small intestine.</p>';
    if (!rows.length) h = '<p class="tiny muted">' + (follow() ? "Nothing of this nutrient is left here." : "") + "</p>";
    $("#dg-mols").innerHTML = h;
  }

  // ===== readout =====
  function chemText(){
    var s = STOPS[S.stop], m = meal(), list = s.chem.filter(function(c){ return c.n === "all" || m.has[c.n]; }).map(function(c){
      if (c.n === "lactose" && lowLac()) return "lactase: too little, so most lactose passes unsplit";
      return c.t;
    });
    if (s.id === "li" && lowLac()) list.push("they also ferment the undigested lactose, making gas");
    if (!list.length) return s.none || "None";
    return cap1(list.join("; "));
  }
  function absText(){
    var s = STOPS[S.stop], m = meal();
    if (!s.absBy) return s.abs;
    var L = [];
    ["starch", "lactose", "protein", "fat", "micro", "water"].forEach(function(n){
      if (n === "lactose" && (!m.has.lactose || lowLac())) return;
      if (n === "micro" || n === "water" || m.has[n]) L.push(n === "fat" ? "fatty acids and monoglycerides" : s.absBy[n]);
    });
    return cap1(L.join(", "));
  }
  function timeText(s){ return s.clock ? s.time + " (varies)" : s.time; }
  function readPaint(){
    var s = STOPS[S.stop], N = follow(), c = cond(), H = "…", rows;
    if (N) {
      var p = N.path[S.stop], src = meal().has[N.id];
      rows = [["Location", s.t], ["In this meal", src ? cap1(src) : "Not a main source in this meal; the path is the same for any you eat."], ["Mechanical action", s.mech],
        ["Chemical action", fx.hide ? H : p[0]], ["Helpers", s.help], ["Absorbed here", fx.hide ? H : (p[1] || "Nothing here")], ["Route", fx.hide ? H : (p[2] || "–")], ["Model time", timeText(s)]];
    } else {
      rows = [["Location", s.t], ["Mechanical action", s.mech], ["Chemical action", fx.hide ? H : chemText()], ["Helpers", s.help], ["Absorbed here", fx.hide ? H : absText()], ["Route", fx.hide ? H : s.route], ["Model time", timeText(s)]];
      if (S.mode === "whatif") {
        var w = !c ? "Choose a condition above." : (c.id === "lactase" && !meal().has.lactose) ? c.noLactose : (c.at[s.id] || c.all);
        rows.push(["What if? effect", fx.hide ? H : w]);
      }
    }
    $("#dg-read").innerHTML = MV.readoutHTML(rows.map(function(r){ return [r[0], r[0] === "Helpers" ? r[1].replace("not an enzyme", "<strong>not an enzyme</strong>") : r[1]]; }));
    var bmr = $("#dg-bmr"); bmr.hidden = S.stop !== 6; bmr.innerHTML = S.stop === 6 ? "<p>" + D.bmr + "</p>" : "";
  }

  // ===== absorbed so far =====
  function trayPaint(){
    var s = S.stop, m = meal(), N = follow(), it = [], c = cond();
    function add(k, t, route){ it.push('<span class="dg-ti k-' + k + '">' + miniGlyph(k) + "<span>" + t + (route ? ' <em class="dg-rt ' + (route === "lymph" ? "l" : "b") + '">' + route + "</em>" : "") + "</span></span>"); }
    if (N) {
      var ab = -1; N.path.forEach(function(p, i){ if (ab < 0 && p[1]) ab = i; });
      if (ab >= 0 && s >= ab && !fx.hide) N.path.forEach(function(p, i){ if (p[1] && i <= s && i < 6) add(kindOfNut(N), p[1], /lacteal|lymph/.test(p[2]) ? "lymph" : /colon cells/.test(p[2]) ? "colon" : "blood"); });
    } else if (!fx.hide) {
      if (s >= 2) add("water", "A little water", "blood");
      if (s >= 4) {
        if (m.has.starch) add("carb", "Glucose", "blood");
        if (m.has.lactose && !lowLac()) add("lactose", "Galactose (and glucose) from lactose", "blood");
        add("protein", "Amino acids", "blood");
        add("fat", "Fatty acids and monoglycerides, in chylomicrons", "lymph");
        add("micro", "Water-soluble vitamins and most minerals", "blood");
        add("micro", "Fat-soluble vitamins A, D, E and K", "lymph");
        add("water", "Most of the water", "blood");
      }
      if (s >= 5) { add("water", "Water and electrolytes", "blood"); add("fibre", c && c.id === "abx" ? "Fewer short-chain fatty acids (fewer bacteria)" : "Short-chain fatty acids from fibre", "colon"); }
    }
    var extra = !N && lowLac() && s >= 4 && !fx.hide ? '<p class="tiny"><strong>Not absorbed:</strong> lactose (it passes on to the colon).</p>' : "";
    $("#dg-tray").innerHTML = it.length ? '<div class="dg-tis">' + it.join("") + "</div>" + extra : '<p class="tiny muted">' + (fx.hide ? "…" : "Nothing absorbed yet.") + "</p>" + extra;
  }

  // ===== villus close-up =====
  var VPATH_W = [[54, 34], [106, 96], [124, 112], [124, 176]], VPATH_F = [[250, 26], [190, 72], [150, 98], [150, 176]], VPATH_W2 = [[246, 120], [194, 124], [176, 132], [176, 176]];
  function along(pts, u){ var n = pts.length - 1, x = clamp(u, 0, 0.999) * n, i = Math.floor(x), t = x - i; return [lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)]; }
  function villusSVG(){
    var h = "", s = S.stop, N = follow();
    h += '<rect class="dg-vtis" x="0" y="164" width="300" height="16"/>';
    h += '<path class="dg-vbody" d="M112 168 L112 72 C112 36 188 36 188 72 L188 168"/>';
    for (var y = 76; y <= 160; y += 7) h += '<line class="dg-mv" x1="112" y1="' + y + '" x2="105" y2="' + y + '"/><line class="dg-mv" x1="188" y1="' + y + '" x2="195" y2="' + y + '"/>';
    for (var a = 0; a <= 10; a++) { var an = Math.PI + a / 10 * Math.PI, cx = 150 + 38 * Math.cos(an), cy = 72 + 27 * Math.sin(an); h += '<line class="dg-mv" x1="' + f1(cx) + '" y1="' + f1(cy) + '" x2="' + f1(cx + 7 * Math.cos(an)) + '" y2="' + f1(cy + 7 * Math.sin(an)) + '"/>'; }
    h += '<path class="dg-capv" d="M124 170 L124 82 C124 58 176 58 176 82 L176 170"/><path class="dg-capv" d="M124 112 L150 102 L176 112 M124 146 L150 136 L176 146"/>';
    h += '<path class="dg-lacv" d="M150 172 L150 86"/><path class="dg-laci" d="M150 172 L150 86"/>';
    h += '<line class="dg-lead" x1="200" y1="44" x2="184" y2="54"/>' + txt(203, 40, "brush border", "dg-vlab", "start") + txt(203, 53, "(microvilli)", "dg-vlab", "start");
    h += '<line class="dg-lead" x1="214" y1="96" x2="178" y2="96"/>' + txt(217, 93, "capillary", "dg-vlab b", "start") + txt(217, 106, "(blood)", "dg-vlab b", "start");
    h += '<line class="dg-lead" x1="86" y1="128" x2="148" y2="128"/>' + txt(83, 125, "lacteal", "dg-vlab l", "end") + txt(83, 138, "(lymph)", "dg-vlab l", "end");
    var showAbs = s === 4 && !fx.hide && (!N || N.id !== "fibre");
    var water = !N || ["starch", "protein", "vitC", "calcium", "water"].indexOf(N.id) >= 0, fat = !N || N.id === "fat" || N.id === "vitA";
    var kindW = N ? kindOfNut(N) : null;
    function tokW(x, y, j){ var k = kindW || ["carb", "protein", "micro", "water"][j % 4]; return k === "carb" ? GL.hex(x, y, 5) : k === "protein" ? GL.bead(x, y, 4.4) : k === "water" ? GL.wat(x, y, 4) : GL.dia(x, y, 4.6); }
    function tokF(x, y){ return N && N.id === "vitA" ? GL.dia(x, y, 4.6) : GL.chylo(x, y, 5.4); }
    var p3 = fx.p3, p2 = fx.p2, p4 = fx.p4;
    if (p4 != null && p4 < 0.5) {
      var q = seg01(p4, 0, 0.5);
      for (var j = 0; j < 3; j++) { var x = lerp(-20, 330, (q + j * 0.3) % 1.15), yy = 22 + j * 5; h += '<g transform="translate(' + f1(x - 9) + " " + f1(yy) + ')">' + hexGroups(0, 0, [2], 4.4, 0, null, true) + "</g>"; }
      h += txt(150, 16, "lactose passes the brush border unsplit", "dg-vlab", "middle");
    } else if (p3 != null) {
      for (var k = 0; k < 3; k++) { var pt = along(VPATH_F, clamp(p3 * 1.25 - k * 0.12, 0, 1)); h += tokF(pt[0], pt[1]); }
    } else if (showAbs || p2 != null) {
      var t = p2 != null ? p2 : 0.55;
      if (water) for (var w = 0; w < 4; w++) { var pw = along(w % 2 ? VPATH_W2 : VPATH_W, clamp(t * 1.2 - w * 0.14, 0, 1)); h += tokW(pw[0], pw[1], w); }
      if (fat && (!N || N.id === "fat" || N.id === "vitA")) for (var z = 0; z < 2; z++) { var pf = along(VPATH_F, clamp(t * 1.2 - z * 0.2, 0, 1)); h += tokF(pf[0], pf[1]); }
      if (water) h += headAt(124, 178, Math.PI / 2, "dg-bloodh") + headAt(176, 178, Math.PI / 2, "dg-bloodh");
      if (fat) h += headAt(150, 178, Math.PI / 2, "dg-lymphh");
    } else if (s === 4 && N && N.id === "fibre" && !fx.hide) {
      h += GL.fib(30, 30, 34) + GL.fib(226, 24, 34) + txt(150, 16, "fibre stays in the gut", "dg-vlab", "middle");
    }
    return h;
  }
  function villusPaint(){
    var svg = $("#dg-vil"), s = S.stop, N = follow();
    svg.innerHTML = villusSVG();
    var cap = s < 4 ? "Absorption happens at the jejunum and ileum stop (stop 5)." : s === 4 ? (fx.hide ? "Watch what happens." : N ? (N.id === "fibre" ? "Fibre isn’t absorbed here." : (N.id === "fat" || N.id === "vitA" ? "Fat products cross into the lacteal (lymph)." : "It crosses into the capillary (blood).")) : "Water-soluble products enter the capillary (blood); fat products enter the lacteal (lymph).") : "Absorption in the small intestine is done.";
    if (fx.p4 != null && fx.p4 < 0.5) cap = "Lactose passes the brush border unsplit.";
    $("#dg-vcap").textContent = cap;
    svg.setAttribute("aria-label", "Close-up of one villus: a finger-shaped fold covered in microvilli (the brush border), with a capillary (blood) and a central lacteal (lymph). " + cap);
  }

  // ===== tract overlay, organ highlight and tags =====
  function overPaint(){
    var s = S.stop, N = follow(), c = cond(), m = meal(), g = tr.over(), svg = tr.svg(), h = "";
    var cur = STOP_ORG[s];
    $$("[data-org]", svg).forEach(function(el){ var id = el.getAttribute("data-org"); el.classList.toggle("on", id === cur || (s === 6 && id === "cells")); el.classList.toggle("gone", id === "gall" && !!c && c.id === "gall"); });
    tr.select(cur === "liver" ? "liver" : cur);
    // bacteria in the colon (always faint; brighter at stop 6); fewer after antibiotics
    var nb = c && c.id === "abx" ? 3 : COLON_PTS.length;
    if (s === 5) for (var i = 0; i < nb; i++) { var cp = COLON_PTS[i * (c && c.id === "abx" ? 4 : 1)]; if (cp) h += GL.bac(cp[0] + (i % 2 ? 3 : -3), cp[1] + (i % 3) - 1, i * 47); }
    // routes after absorption
    var wantB = !N || ["starch", "protein", "vitC", "calcium", "water"].indexOf(N.id) >= 0, wantL = !N || N.id === "fat" || N.id === "vitA";
    if (fx.p3 != null) h += routeSVG(false, true, seg01(fx.p3, 0.35, 1));
    else if ((s === 4 || s === 6) && !fx.hide && (!N || N.id !== "fibre")) h += routeSVG(wantB, wantL);
    // P2: absorption arrows cluster along the jejunum and ileum
    var na = fx.p2 != null ? Math.round(fx.p2 * SI_PTS.length) : (s === 4 && !fx.hide && !N ? SI_PTS.length : 0);
    for (var k = 0; k < na; k++) { var a = SI_PTS[k], lym = k % 3 === 2; h += '<path class="' + (lym ? "dg-lymph s" : "dg-blood s") + '" d="M' + P(a[0], a[1]) + "l" + P(-3, -9) + '"/>' + headAt(a[0] - 3, a[1] - 9, Math.atan2(-9, -3), lym ? "dg-lymphh" : "dg-bloodh"); }
    // gas in the colon: fibre fermentation, much more with low lactase
    if (s === 5 && !fx.hide) {
      var ng = lowLac() ? 9 : (c && c.id === "abx") ? 1 : (c && c.id === "fibre") ? 4 : 2, rise = fx.p4 != null ? seg01(fx.p4, 0.55, 1) : 1;
      for (var q = 0; q < ng; q++) { var gp = COLON_PTS[(q * 5 + 2) % COLON_PTS.length]; h += GL.gas(gp[0] + (q % 2 ? 4 : -4), gp[1] - 4 - (q % 3) * 3 * rise, lerp(1, 3.2 + (q % 3), rise)); }
    }
    // bile drips steadily when the gallbladder is removed
    if (c && c.id === "gall") for (var d2 = 0; d2 < 4; d2++) h += '<circle class="dg-bile" cx="' + f1(148 + d2 * 1.2) + '" cy="' + (192 + d2 * 14) + '" r="2.4"/>';
    // the bolus: a few tokens at the current stop
    var an = ANCH[STOPS[s].id];
    if (an && !(s === 5 && !m.has.fibre) && s !== 6) {
      if (N) { var kk = kindOfNut(N); h += '<g class="dg-bolus">' + (kk === "carb" ? GL.hex(an[0], an[1], 5) : kk === "protein" ? GL.bead(an[0], an[1], 4.6) : kk === "fat" ? GL.drop(an[0], an[1], 5.4) : kk === "fibre" ? GL.zig(an[0] - 8, an[1], 4, 4) : kk === "water" ? GL.wat(an[0], an[1], 4.6) : GL.dia(an[0], an[1], 5)) + "</g>"; }
      else if (s === 5) h += '<g class="dg-bolus">' + GL.zig(an[0] - 8, an[1], 4, 4) + GL.wat(an[0] + 10, an[1] + 8, 3.6) + "</g>";
      else h += '<g class="dg-bolus">' + GL.hex(an[0] - 7, an[1] - 3, 4.4) + GL.bead(an[0] + 6, an[1] - 4, 3.8) + GL.drop(an[0], an[1] + 6, 4.4) + "</g>";
    }
    g.innerHTML = h;
    tr.tags(tagsFor());
    var tx = "Digestive tract, " + STOPS[s].t + " highlighted. " + (N ? "Following " + N.t.toLowerCase() + ". " : "Meal: " + m.t + ". ") + (c ? "Condition: " + c.t + ". " : "") + ((s === 4 || s === 6) && !fx.hide ? "Blood route to the liver" + (wantL ? " and lymph route to the heart" : "") + " shown." : "");
    tr.setAria(tx);
  }
  function tagsFor(){
    var s = S.stop, N = follow(), c = cond(), T = [];
    function tg(x, y, html, al, cls){ T.push({ x:x, y:y, html:html, align:al, cls:cls }); }
    if (fx.hide) return T;
    var nk = N ? N.id : "";
    if (s === 0 && (!N || nk === "starch")) tg(198, 14, "salivary amylase", "l", "dg-enz");
    if (s === 2 && (!N || nk === "protein")) tg(270, 214, "pepsin + acid", "l", "dg-enz");
    if (s === 3) {
      var pz = !N ? "amylase · lipase · trypsin" : nk === "starch" ? "pancreatic amylase" : nk === "protein" ? "trypsin" : nk === "fat" ? "lipase" : "";
      if (pz) tg(354, 230, pz, "r", "dg-enz");
      if (!N || nk === "fat" || nk === "vitA") tg(6, 236, c && c.id === "gall" ? "bile trickles (not an enzyme)" : "bile (not an enzyme)", "l", "dg-help");
    }
    if (s === 4) {
      var bz = !N ? "brush border: maltase · peptidases · lactase" : nk === "starch" ? "maltase" : nk === "protein" ? "peptidases" : "";
      if (bz) tg(6, 428, bz, "l", "dg-enz");
      if (!N || nk === "fat" || nk === "vitA") tg(6, 262, "lymph", "l", "dg-lym");
      if (!N || ["starch", "protein", "vitC", "calcium", "water"].indexOf(nk) >= 0) tg(206, 226, "to the liver", "l", "dg-bld");
    }
    if (s === 5 && (!N || nk === "fibre")) tg(354, 284, c && c.id === "abx" ? "fewer bacteria" : "bacteria ferment fibre", "r", "dg-enz");
    if (s === 6) { tg(6, 206, "liver: processes nutrients", "l", "dg-help"); tg(354, 30, "cells: metabolism", "r", "dg-help"); }
    if (c) {
      if (c.id === "stress" && s === 2) tg(270, 232, "stress: slower emptying", "l", "dg-cond");
      if (c.id === "fibre" && s === 2) tg(270, 232, "fuller for longer", "l", "dg-cond");
      if (c.id === "gall") tg(6, 186, "gallbladder removed", "l", "dg-cond");
      if (c.id === "lactase" && s === 5 && meal().has.lactose) tg(354, 384, "gas from lactose", "r", "dg-cond");
    }
    return T;
  }

  // ===== stop strip, player and clock =====
  var stopsBox = $("#dg-stops");
  function stopLabel(i){
    var s = STOPS[i], N = follow(), abs;
    if (N) abs = N.path[i][1] || "nothing";
    else abs = s.absBy ? "glucose, amino acids, fatty acids, vitamins, minerals and water" : lc(s.abs);
    return "Stop " + (i + 1) + ": " + s.t + ". " + s.mech + " Absorbed: " + abs + ".";
  }
  function stopsPaint(){
    MV.keepFocus(stopsBox, function(){ stopsBox.innerHTML = STOPS.map(function(s, i){ var on = i === S.stop;
      return '<button type="button" class="dg-stop' + (on ? " on" : "") + '" data-stop="' + i + '" data-k="stop' + i + '" aria-pressed="' + on + '" aria-label="' + esc(MV.plain(stopLabel(i))) + '" tabindex="' + (on ? 0 : -1) + '"><span class="dg-sn">' + (i + 1) + "</span>" + s.short + "</button>"; }).join(""); });
    var b = stopsBox.querySelector(".on"); if (b && b.scrollIntoView && stopsBox.scrollWidth > stopsBox.clientWidth + 2) { var r = b.getBoundingClientRect(), R = stopsBox.getBoundingClientRect(); if (r.left < R.left || r.right > R.right) stopsBox.scrollLeft += (r.left - R.left) - (R.width - r.width) / 2; }
  }
  stopsBox.addEventListener("click", function(e){ var b = e.target.closest("[data-stop]"); if (!b) return; cancelAnim(); note = ""; player.go(+b.dataset.stop); });
  stopsBox.addEventListener("keydown", function(e){
    var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "Home" ? -9 : e.key === "End" ? 9 : 0; if (!d) return;
    e.preventDefault(); cancelAnim(); note = ""; player.go(clamp(S.stop + d, 0, 6)); var nb = stopsBox.querySelector('[data-stop="' + S.stop + '"]'); if (nb) nb.focus();
  });
  var player = MV.player($("#dg-player"), { count:7, interval:2800,
    label:function(i){ return "Stop " + (i + 1) + " of 7: " + STOPS[i].short; },
    render:function(i){ if (booting) return; S.stop = i; startClock(); commit(); } });
  function stopPlay(){ var b = $('#dg-player [data-pl="play"]'); if (b && /Pause/.test(b.textContent)) b.click(); }

  function fmtDur(m){ if (m < 1.995) return Math.round(m * 60) + " s"; if (m < 119.5) return Math.round(m) + " min"; var hh = Math.floor(m / 60 + 1e-6), mm = Math.round(m - hh * 60); if (mm === 60) { hh++; mm = 0; } return hh + " h" + (mm ? " " + mm + " min" : ""); }
  function clockPaint(){
    var s = STOPS[S.stop], svg = $("#dg-clock"), h = '<circle class="dg-cface" cx="32" cy="32" r="28"/>';
    for (var i = 0; i < 12; i++) { var a = i / 12 * 2 * Math.PI; h += '<line class="dg-ctick" x1="' + f1(32 + 24 * Math.sin(a)) + '" y1="' + f1(32 - 24 * Math.cos(a)) + '" x2="' + f1(32 + 27 * Math.sin(a)) + '" y2="' + f1(32 - 27 * Math.cos(a)) + '"/>'; }
    var m = s.clock ? (clk.m == null ? s.clock[1] : clk.m) : 0, am = (m % 60) / 60 * 2 * Math.PI, ah = (m / 720) * 2 * Math.PI;
    if (s.clock) h += '<line class="dg-chh" x1="32" y1="32" x2="' + f1(32 + 14 * Math.sin(ah)) + '" y2="' + f1(32 - 14 * Math.cos(ah)) + '"/><line class="dg-cmh" x1="32" y1="32" x2="' + f1(32 + 22 * Math.sin(am)) + '" y2="' + f1(32 - 22 * Math.cos(am)) + '"/>';
    h += '<circle class="dg-cpin" cx="32" cy="32" r="2.4"/>';
    svg.innerHTML = h;
    var where = s.id === "duo" || s.id === "jej" ? "Time in the small intestine" : "Time at this stop";
    $("#dg-clockt").innerHTML = !s.clock ? "<strong>" + s.time + "</strong>" : "<strong>" + where + ":</strong> " + (clk.m == null ? s.time.replace(" in the small intestine", "") + " (varies)" : fmtDur(m) + (clk.ff ? ' <span class="dg-ff">⏩ sped up to fit</span>' : ""));
  }
  function startClock(){
    if (clockAnim) { clockAnim(); clockAnim = null; }
    var s = STOPS[S.stop]; clk = { m:null, ff:false };
    if (!s.clock || MV.reduceMotion) { clockPaint(); return; }
    var span = s.clock[1] - s.clock[0], real = span * 60 / (+S.speed) * 1000, dur = Math.min(2400, real);
    clk = { m:s.clock[0], ff:real > 2400 };
    clockAnim = MV.tween({ dur:Math.max(300, dur), ease:function(t){ return t; }, step:function(t){ clk.m = lerp(s.clock[0], s.clock[1], t); clockPaint(); }, done:function(){ clockAnim = null; clk = { m:null, ff:false }; clockPaint(); } });
  }

  // ===== paint / commit =====
  function paint(){
    mealRG.set(S.meal); modeRG.set(S.mode); nutRG.set(S.nut); condRG.set(S.cond);
    $("#dg-nut").hidden = S.mode !== "follow"; $("#dg-cond").hidden = S.mode !== "whatif";
    stopsPaint(); overPaint(); molsPaint(); readPaint(); villusPaint(); trayPaint(); clockPaint();
    $("#dg-onote").innerHTML = note;
  }
  function commit(){ api.save(); paint(); MV.changed(); }
  function clearFx(){ fx.hide = false; fx.p1 = fx.p2 = fx.p3 = fx.p4 = null; }
  function finish(){ anim = null; clearFx(); paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){ if (anim) { anim(); anim = null; } var had = fx.hide || fx.p1 != null || fx.p2 != null || fx.p3 != null || fx.p4 != null; clearFx(); if (pend) { var d = pend; pend = null; d(); } return had; }
  booting = false;
  player.go(S.stop);

  // ===== challenge chips live inside the challenge cards (re-added each time the toolkit repaints them) =====
  var chal = $("#chal");
  function solved(id){ return !!(MV.S.chal && MV.S.chal[id] && MV.S.chal[id].solved); }
  function cxHTML(id){
    var c = CH[id], v = S.tc[id], done = solved(id), h = '<p class="how">' + c.how + "</p>";
    if (id === "tc1") {
      var order = MV.shuffle(c.chips.map(function(x){ return x.id; }), "dg-tc1-v2");
      h += '<ol class="dg-ord" aria-label="Your order">' + [0, 1, 2, 3].map(function(i){ var x = byId(c.chips, v[i]);
        return "<li>" + (x ? '<button type="button" class="dg-ochip on" data-tc="' + id + '" data-rm="' + x.id + '" data-k="' + id + "rm" + x.id + '"' + (done ? " disabled" : "") + ' aria-label="' + esc("Step " + (i + 1) + ": " + x.t + ". Tap to take it back.") + '">' + x.t + "</button>" : '<span class="dg-slot">Step ' + (i + 1) + "</span>") + "</li>"; }).join("") + "</ol>";
      h += '<div class="dg-cxchips" role="group" aria-label="Steps to place">' + order.filter(function(k){ return v.indexOf(k) < 0; }).map(function(k){ var x = byId(c.chips, k); return '<button type="button" class="chip" data-tc="' + id + '" data-add="' + k + '" data-k="' + id + "add" + k + '"' + (done ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</div>";
      if (v.length && !done) h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-tc="' + id + '" data-clear="1" data-k="' + id + 'clr">Clear the order</button></div>';
    } else {
      h += '<div class="dg-cxchips' + (id === "tc3" ? " dg-cxlong" : "") + '" role="group" aria-label="' + esc(MV.plain(c.how)) + '">' + c.chips.map(function(x){ var on = v.indexOf(x.id) >= 0;
        return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-tc="' + id + '" data-tog="' + x.id + '" data-k="' + id + "t" + x.id + '"' + (done ? " disabled" : "") + ">" + (id === "tc3" ? "<strong>" + x.id + ".</strong> " : "") + x.t + "</button>"; }).join("") + "</div>";
      h += '<p class="tiny muted" aria-live="polite">Chosen: ' + (v.length ? v.map(function(k){ var x = byId(c.chips, k); return id === "tc3" ? k : x.t; }).join(", ") : "none yet") + "</p>";
      if (id === "tc3") h += '<p class="tiny dg-cxnote"><strong>' + c.note + '</strong></p><div class="q-actions"><button type="button" class="btn ghost sm" data-tc="tc3" data-show="1" data-k="tc3show">' + c.show + "</button></div>";
    }
    return h;
  }
  function inject(){
    if (!chal) return;
    ["tc1", "tc2", "tc3"].forEach(function(id){
      var card = chal.querySelector('[data-c="' + id + '"]'); if (!card) return;
      var box = card.querySelector(".dg-cx"); if (box && box.dataset.v === stamp(id)) return;
      if (!box) { box = document.createElement("div"); box.className = "dg-cx"; var head = card.querySelector(".q-head"); card.insertBefore(box, head ? head.nextSibling : card.firstChild); }
      box.dataset.v = stamp(id);
      MV.keepFocus(box, function(){ box.innerHTML = cxHTML(id); });
    });
  }
  function stamp(id){ return S.tc[id].join(",") + (solved(id) ? "|s" : ""); }
  function repaintCx(id){ var card = chal && chal.querySelector('[data-c="' + id + '"]'), box = card && card.querySelector(".dg-cx"); if (!box) return inject(); box.dataset.v = stamp(id); MV.keepFocus(box, function(){ box.innerHTML = cxHTML(id); }); }
  if (chal) {
    new MutationObserver(inject).observe(chal, { childList:true });
    chal.addEventListener("click", function(e){
      var b = e.target.closest("[data-tc]"); if (!b) return;
      e.stopImmediatePropagation(); // the toolkit's card handler would look up a button this repaint has just replaced
      if (b.disabled) return;
      var id = b.dataset.tc, v = S.tc[id];
      if (b.dataset.show) { cancelAnim(); stopPlay(); S.mode = "whatif"; S.cond = "gall"; note = ""; player.go(3); var g = $("#dg-tract"); if (g) g.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); return; }
      if (b.dataset.add) { if (v.indexOf(b.dataset.add) < 0 && v.length < 4) v.push(b.dataset.add); }
      else if (b.dataset.rm) v.splice(v.indexOf(b.dataset.rm), 1);
      else if (b.dataset.clear) v.length = 0;
      else if (b.dataset.tog) { var k = v.indexOf(b.dataset.tog); if (k >= 0) v.splice(k, 1); else v.push(b.dataset.tog); }
      api.save(); repaintCx(id); MV.liveChallenges();
      if (id === "tc1" && (b.dataset.add || b.dataset.rm || b.dataset.clear)) { var card = chal.querySelector('[data-c="tc1"]'), nx = card && (card.querySelector("[data-add]") || card.querySelector("[data-rm]")); if (nx && !card.contains(document.activeElement)) nx.focus({ preventScroll:true }); }
    });
  }
  inject();

  function test(id){
    var c = CH[id], M = c.msgs, v = S.tc[id];
    if (id === "tc1") {
      if (v.length < 4) return { ok:false, msg:M.count };
      var A = MV.ans(c); if (A && A.every(function(x, i){ return v[i] === x; })) return { ok:true };
      if (v.indexOf("cap") !== 3) return { ok:false, msg:M.cap };
      if (v.indexOf("mal") < v.indexOf("pan")) return { ok:false, msg:M.maltase };
      return { ok:false, msg:c.general };
    }
    if (id === "tc2") {
      if (!v.length) return { ok:false, msg:M.none };
      if (v.indexOf("bile") < 0) return { ok:false, msg:M.bile };
      if (v.indexOf("capillary") >= 0) return { ok:false, msg:M.capillary };
      if (v.indexOf("pepsin") >= 0) return { ok:false, msg:M.pepsin };
      if (v.indexOf("lactase") >= 0) return { ok:false, msg:M.lactase };
      var need = c.chips.filter(MV.ok).map(function(x){ return x.id; });
      if (need.every(function(x){ return v.indexOf(x) >= 0; }) && v.length === need.length) return { ok:true };
      return { ok:false, msg:c.general };
    }
    if (id === "tc3") {
      var bad = ["C", "D", "E", "F"].filter(function(x){ return v.indexOf(x) >= 0; })[0];
      if (bad) return { ok:false, msg:M[bad] };
      if (v.length !== 2) return { ok:false, msg:M.count };
      var good = c.chips.filter(MV.ok).map(function(x){ return x.id; });
      if (good.every(function(x){ return v.indexOf(x) >= 0; })) return { ok:true };
      return { ok:false, msg:c.general };
    }
    return { ok:false };
  }

  // ===== predictions =====
  function reveal(el){ var r = el && el.getBoundingClientRect(); if (r && (r.top < 110 || r.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); stopPlay(); note = "";
        S.meal = p.meal; S.mode = p.mode; if (p.nut) S.nut = p.nut; if (p.cond) S.cond = p.cond;
        fx.hide = true; if (p.id === "p1") fx.p1 = 0;
        player.go(p.stop);
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") { reveal($("#dg-mols")); anim = MV.tween({ dur:2200, step:function(t){ fx.p1 = t; molsPaint(); }, done:finish }); return; }
        if (p.id === "p2") {
          reveal($("#dg-tract"));
          var stepAt = { a:false, b:false };
          anim = MV.tween({ dur:3000, ease:function(t){ return t; }, step:function(t){
            if (t > 0.12 && !stepAt.a) { stepAt.a = true; player.go(3); }
            if (t > 0.35 && !stepAt.b) { stepAt.b = true; fx.hide = false; player.go(4); }
            if (stepAt.b) { fx.p2 = seg01(t, 0.35, 1); overPaint(); villusPaint(); }
          }, done:finish });
          if (MV.reduceMotion) { fx.hide = false; player.go(4); }
          return;
        }
        if (p.id === "p3") {
          fx.hide = false; fx.p3 = 0; player.go(4); reveal($("#dg-vil"));
          anim = MV.tween({ dur:2600, ease:function(t){ return t; }, step:function(t){ fx.p3 = t; overPaint(); villusPaint(); }, done:finish });
          return;
        }
        if (p.id === "p4") {
          reveal($("#dg-vil")); fx.hide = false; fx.p4 = 0; paint();
          var moved = false;
          anim = MV.tween({ dur:3400, ease:function(t){ return t; }, step:function(t){
            fx.p4 = t;
            if (t >= 0.5 && !moved) { moved = true; player.go(5); }
            villusPaint(); overPaint();
          }, done:finish });
          return;
        }
        finish();
      }
    },
    challenge:function(id){ return test(id); }
  };
}

// ---------- Part 3: When digestion works differently (lactose data bars, villi toggle, allergy-or-intolerance sort) ----------
function villiRowSVG(t){
  // t = 0 healthy, 1 flattened
  var h = '<rect class="dg-vtis" x="0" y="112" width="340" height="22"/>', base = 112;
  for (var i = 0; i < 6; i++) {
    var cx = 30 + i * 56, w = lerp(30, 46, t), top = lerp(22, 98, t), r = w / 2;
    h += '<path class="dg-vbody" d="M' + f1(cx - r) + " " + base + " L" + f1(cx - r) + " " + f1(top + r) + " A " + f1(r) + " " + f1(r) + " 0 0 1 " + f1(cx + r) + " " + f1(top + r) + " L" + f1(cx + r) + " " + base + '"/>';
    var dens = Math.round(lerp(1, 0.2, t) * 10) / 10;
    if (dens > 0.25) {
      for (var y = top + r; y < base - 3; y += 6) h += '<line class="dg-mv" x1="' + f1(cx - r) + '" y1="' + f1(y) + '" x2="' + f1(cx - r - 5 * dens) + '" y2="' + f1(y) + '"/><line class="dg-mv" x1="' + f1(cx + r) + '" y1="' + f1(y) + '" x2="' + f1(cx + r + 5 * dens) + '" y2="' + f1(y) + '"/>';
      for (var a = 0; a <= 6; a++) { var an = Math.PI + a / 6 * Math.PI, x0 = cx + r * Math.cos(an), y0 = top + r + r * Math.sin(an); h += '<line class="dg-mv" x1="' + f1(x0) + '" y1="' + f1(y0) + '" x2="' + f1(x0 + 5 * dens * Math.cos(an)) + '" y2="' + f1(y0 + 5 * dens * Math.sin(an)) + '"/>'; }
    } else {
      h += '<line class="dg-mv" x1="' + f1(cx) + '" y1="' + f1(top) + '" x2="' + f1(cx) + '" y2="' + f1(top - 3) + '"/>';
    }
  }
  return h;
}
function part3(host, api){
  var D = api.content, S = api.S, LX = D.lactose, CE = D.celiac, AL = D.allergy;
  S.seen = S.seen || {}; S.villi = S.villi === "flat" ? "flat" : "healthy";
  host.innerHTML = '<div class="dg-st" id="dg-st1"></div><div class="dg-st" id="dg-st2"></div><div class="dg-st" id="dg-st3"></div><p class="tiny"><strong>' + D.advice + "</strong></p>";

  // Station 1: lactose intolerance, with the data bars and the management chips
  var s1 = $("#dg-st1", host), max = Math.max.apply(null, LX.foods.map(function(f){ return f.g; }));
  s1.innerHTML = "<h3>" + LX.title + "</h3><p><strong>Mechanism:</strong> " + LX.mech + "</p>" +
    '<details class="alg" open><summary>' + LX.dataTitle + '</summary><p class="tiny"><span class="hfa-model">Model data</span> Lactose in one serving.</p><div class="dg-lbars" role="list">' +
    LX.foods.map(function(f){ var v = f.label || (MV.num(f.g) + " g"); return '<div class="dg-lbar" role="listitem"><span class="dg-llab">' + f.t + " <small>" + f.serve + '</small></span><span class="dg-ltrack" aria-hidden="true"><span class="dg-lfill" style="width:' + f1(f.g / max * 100) + '%"></span></span><span class="dg-lval">' + v + "</span></div>"; }).join("") +
    '</div><p class="dg-insight"><strong>What the data show:</strong> ' + LX.insight + "</p></details>" +
    '<p class="dg-ctx">' + LX.context + '</p><h4 class="dg-h4">Management: tap each one to see why it works</h4><div class="dg-mng" id="dg-mng" role="group" aria-label="Management"></div><div class="dg-mngp" id="dg-mngp" aria-live="polite"></div>';
  function paint1(){
    var box = $("#dg-mng", s1);
    MV.keepFocus(box, function(){ box.innerHTML = LX.manage.map(function(m){ var on = S.mng === m.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-mng="' + m.id + '" data-k="mng' + m.id + '">' + (S.seen[m.id] ? '<span aria-hidden="true">✓ </span>' : "") + m.t + "</button>"; }).join(""); });
    var m = byId(LX.manage, S.mng);
    $("#dg-mngp", s1).innerHTML = m ? '<p class="dg-why"><strong>' + m.t + ":</strong> " + m.why + "</p>" : '<p class="tiny muted">Opened ' + LX.manage.filter(function(x){ return S.seen[x.id]; }).length + " of " + LX.manage.length + ".</p>";
  }
  s1.addEventListener("click", function(e){ var b = e.target.closest("[data-mng]"); if (!b) return; S.mng = b.dataset.mng; S.seen[S.mng] = 1; api.save(); paint1(); });
  paint1();

  // Station 2: celiac disease, with healthy vs flattened villi (model surface units)
  var s2 = $("#dg-st2", host), vt = S.villi === "flat" ? 1 : 0, vanim = null;
  s2.innerHTML = "<h3>" + CE.title + "</h3><p><strong>Mechanism:</strong> " + CE.mech + "</p><p>" + CE.manage + "</p><p>" + CE.diagnosis + "</p>" +
    '<details class="alg" open><summary>' + CE.dataTitle + '</summary><div id="dg-vsel"></div><svg class="dg-villi" id="dg-villi" viewBox="0 0 340 134" role="img"></svg>' +
    '<div class="dg-surf"><span class="dg-slab">Absorbing surface</span><span class="dg-strack" aria-hidden="true"><span class="dg-sfill" id="dg-sfill"></span></span><span class="dg-sval" id="dg-sval" aria-live="polite"></span></div>' +
    '<p class="tiny"><span class="hfa-model">Model data</span> <span id="dg-vread"></span></p></details><p class="tiny"><strong>' + CE.note + "</strong></p>";
  function paint2(){
    var svg = $("#dg-villi", s2), u = lerp(CE.healthy, CE.flat, vt);
    svg.innerHTML = villiRowSVG(vt);
    var flat = vt > 0.5;
    svg.setAttribute("aria-label", flat ? "Flattened villi: low bumps with few microvilli." : "Healthy villi: tall fingers covered in microvilli.");
    $("#dg-sfill", s2).style.width = f1(u / CE.healthy * 100) + "%";
    $("#dg-sval", s2).textContent = Math.round(u) + " units";
    $("#dg-vread", s2).textContent = flat ? CE.readFlat : CE.readHealthy;
  }
  radios($("#dg-vsel", s2), { label:"Show", options:CE.states, value:S.villi, onChange:function(v){
    S.villi = v; api.save(); if (vanim) vanim();
    var from = vt, to = v === "flat" ? 1 : 0;
    vanim = MV.tween({ dur:1100, step:function(t){ vt = lerp(from, to, t); paint2(); }, done:function(){ vanim = null; vt = to; paint2(); } });
  } });
  paint2();

  // Station 3: allergy or intolerance? (the toolkit's K12 sorter; not scored in the summary), allergens, the key rule
  var s3 = $("#dg-st3", host);
  s3.innerHTML = "<h3>" + AL.title + "</h3><p>" + AL.intro + '</p><div id="dg-sort"></div>' +
    '<div class="dg-rule" role="note"><p><strong>Key rule:</strong> ' + AL.rule + "</p></div>" +
    '<h4 class="dg-h4">' + AL.allergensTitle + '</h4><ul class="dg-alg">' + AL.allergens.map(function(a){ return "<li>" + a + "</li>"; }).join("") + "</ul>";
  try {
    MV.activityTypes.sorter($("#dg-sort", s3), { id:"dg-p3sort", noun:"case", txt:true, boxes:AL.boxes, items:AL.cases,
      wrongDefault:"An allergy involves the immune system and can be life-threatening. An intolerance, such as lactose intolerance, is digestive." });
  } catch (e) { console.error(e); }
}

// ---------- Practice 2: Trace it (custom: chips, number entry N4, and a two-set inquiry item) ----------
function trace(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { pick:null, val:"", tries:0, hint:0, solved:false, first:null }); if (x.pick == null) x.pick = null; return x; }
  function order(it, key, n){ return MV.shuffle(Array.from({ length:n }, function(_, i){ return i; }), "dg-" + it.id + key); }
  function chipsHTML(it, x, list, key, sel){
    return '<div class="dg-tchips" role="radiogroup" aria-label="' + esc(key === "main" ? "Choices" : MV.plain(byId(it.sets, key).label)) + '">' + order(it, key, list.length).map(function(i){
      var on = sel === i, good = x.solved && MV.ok(list[i]);
      return '<button type="button" class="chip' + (on ? " on" : "") + (good ? " dg-right" : "") + '" role="radio" aria-checked="' + on + '" data-set="' + key + '" data-ci="' + i + '" data-k="' + it.id + key + i + '"' + (x.solved ? " disabled" : "") + ">" + list[i].t + "</button>";
    }).join("") + "</div>";
  }
  function qHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ti="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">T' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★' + (it.inquiry ? " Investigation" : "") + "</span>" : "") + "</div>";
    if (it.kind === "chips") h += chipsHTML(it, x, it.chips, "main", x.pick);
    else if (it.kind === "num") h += '<div class="numrow"><label for="tn-' + it.id + '">' + it.label + ':</label><input class="numin" id="tn-' + it.id + '" data-tn="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="m">' + it.unit + "</span></div>";
    else it.sets.forEach(function(s){ var pk = x.pick || {}; h += '<p class="dg-tset">' + s.label + "</p>" + chipsHTML(it, x, s.chips, s.id, pk[s.id]); });
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb ' + (msgs[it.id].skip ? "" : "bad") + '" role="status"><p>' + msgs[it.id].h + "</p></div>";
    return h + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(qHTML).join("");
  function item(id){ return byId(a.items, id); }
  function repaint(it){
    var box = host.querySelector('[data-ti="' + it.id + '"]'), act = document.activeElement, k = act && box.contains(act) && act.dataset ? act.dataset.k : null;
    var div = document.createElement("div"); div.innerHTML = qHTML(it, a.items.indexOf(it)); var nb = div.firstChild; box.parentNode.replaceChild(nb, box);
    if (k) { var f = nb.querySelector('[data-k="' + k + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true }); }
    return nb;
  }
  function judge(it, x){
    var NQ = "<strong>✗ Not quite.</strong> ", TA = " Try again.";
    if (it.kind === "chips") {
      if (x.pick == null) return { skip:true, msg:"Tap a choice first." };
      return MV.ok(it.chips[x.pick]) ? { ok:true } : { msg:NQ + it.fb + TA };
    }
    if (it.kind === "num") {
      var r = MV.parseNum(x.val); if (!r) return { skip:true, msg:"Enter a number, such as 4 or 2.5." };
      var v = r[0]; if (Math.abs(v - MV.ans(it)) < 1e-6) return { ok:true };
      var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) < 1e-6; })[0];
      return { msg:NQ + (w ? w.fb : it.wrongDefault) + TA };
    }
    var pk = x.pick || {}, bad = [];
    if (it.sets.some(function(s){ return pk[s.id] == null; })) return { skip:true, msg:"Choose one answer in each set." };
    it.sets.forEach(function(s){ if (!MV.ok(s.chips[pk[s.id]])) bad.push(it.fbSets[s.id]); });
    return bad.length ? { msg:NQ + bad.join(" ") + TA } : { ok:true };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.tn; if (!id) return; ist(id).val = e.target.value; msgs[id] = null; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.tn) { var b = host.querySelector('[data-k="' + e.target.dataset.tn + 'chk"]'); if (b) b.click(); return; }
    var c = e.target.closest && e.target.closest("[data-ci]"); if (!c) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var sibs = $$('[data-ci][data-set="' + c.dataset.set + '"]', c.parentNode), k = sibs.indexOf(c), nb = sibs[(k + d + sibs.length) % sibs.length]; if (nb) { nb.focus(); nb.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ti]"); if (!box) return;
    var it = item(box.dataset.ti), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.ci != null) { var ci = +b.dataset.ci; if (it.kind === "two") { x.pick = x.pick || {}; x.pick[b.dataset.set] = ci; } else x.pick = ci; msgs[it.id] = null; }
    else if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { if (!r.skip) x.tries++; msgs[it.id] = { h:r.msg, skip:!!r.skip }; }
      api.save(); MV.focusFb(repaint(it)); return;
    }
    api.save(); repaint(it);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Pack Lin's lunch (one chip per row; live checklist from the plan's exact tests) ----------
var task = (function(){
  var api = null, rg = {};
  function T(){ return MV.C.task; }
  function row(id){ return byId(T().rows, id); }
  function itemOf(rid, id){ return byId(row(rid).items, id); }
  function read(){ var s = (api && api.S) || {}; return { g:s.g || "", p:s.p || "", v:s.v || "", d:s.d || "" }; }
  function full(d){ return !!(d.g && d.p && d.v && d.d); }
  function parts(d){ return { g:itemOf("g", d.g), p:itemOf("p", d.p), v:itemOf("v", d.v), d:itemOf("d", d.d) }; }
  function fibre(d){ var q = parts(d); return (q.g ? q.g.fibre : 0) + (q.p ? q.p.fibre : 0) + (q.v ? q.v.fibre : 0); }
  function checks(d){
    var q = parts(d);
    return [!!q.d && !q.d.lactose, full(d) && fibre(d) >= 6, !!((q.d && q.d.ca) || (q.p && q.p.ca)), !!(q.v && q.v.bc && q.p && q.p.fat), !!q.d && !q.d.sugary];
  }
  function keyOf(d){ return [d.g, d.p, d.v, d.d].join("|"); }
  function fromKey(k){ var p = k.split("|"); return { g:p[0], p:p[1], v:p[2], d:p[3] }; }
  function label(k){ var q = parts(fromKey(k)); return [q.g, q.p, q.v, q.d].map(function(x){ return x ? lc(x.t) : "?"; }).join(" + "); }
  function optT(it){
    var tg = T().tags, bits = [];
    if (it.fibre != null) bits.push(it.fibre + " g fibre");
    ["fat", "ca", "bc", "lactose", "sugary"].forEach(function(k){ if (it[k]) bits.push(tg[k]); });
    return it.t + (bits.length ? ' <span class="dg-tk">' + bits.join("; ") + "</span>" : "");
  }
  function paint(){
    var d = read(); if (!$("#tk-pv")) return;
    ["g", "p", "v", "d"].forEach(function(k){ rg[k].set(d[k]); });
    var q = parts(d), fb = fibre(d), h = "";
    h += '<div class="dg-tkcard"><h5>Lin’s lunch</h5><ul class="dg-tkl">' + T().rows.map(function(r){ var x = q[r.id]; return "<li><strong>" + r.t + ":</strong> " + (x ? x.t : '<span class="muted">not chosen</span>') + "</li>"; }).join("") + "</ul>";
    h += '<p class="dg-tkm"><strong>Fibre:</strong> ' + fb + ' g</p><div class="dg-ftrack" aria-hidden="true"><span class="dg-ffill" style="width:' + f1(clamp(fb / 14, 0, 1) * 100) + '%"></span><span class="dg-fmark" style="left:' + f1(6 / 14 * 100) + '%"></span></div><p class="tiny muted">The dashed line marks 6 g. <span class="hfa-model">Model data</span></p>';
    var ca = q.d && q.d.ca ? q.d.t : q.p && q.p.ca ? q.p.t : "";
    h += '<p class="tiny"><strong>Calcium from:</strong> ' + (ca ? lc(ca) : "nothing yet") + "</p>";
    h += '<p class="tiny"><strong>Beta-carotene:</strong> ' + (q.v && q.v.bc ? lc(q.v.t) + (q.p && q.p.fat ? ", eaten with fat from " + lc(q.p.t) : ", but no fat with it yet") : "none yet") + "</p></div>";
    $("#tk-pv").innerHTML = h;
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S;
      inp.innerHTML = '<div class="dg-tin">' + T().rows.map(function(r){ return '<div id="tk-' + r.id + '"></div>'; }).join("") + "</div>";
      T().rows.forEach(function(r){
        rg[r.id] = radios($("#tk-" + r.id), { label:r.t, cls:"chips", options:r.items.map(function(it){ return { id:it.id, t:optT(it) }; }), value:s[r.id] || "",
          onChange:function(v){ s[r.id] = v; a.save(); paint(); a.update(); } });
      });
      pv.innerHTML = '<div id="tk-pv" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Choose one item from each row."; },
    checks:function(d){ return checks(d); },
    key:keyOf,
    label:function(k){ return esc(label(k)); },
    text:label
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ trace:trace },
  task:task
});
})();
