// SBI4U 01 Leaf Structure: hero (leaf → cross-section), S1 leaf cross-section explorer (Explore: zoom levels, gas and light
// modes), habitat cards (Part 3), label quiz and leaf investigations (Practice), "Design a desert leaf" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, chem = MV.bio.chem;

// ---------- small SVG helpers ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function fmt(v){ return String(Math.round(v * 10) / 10); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

// ---------- @component radioGroup (adapted from MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list)}
function radios(host, o){
  var val = String(o.value);
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (x.dis ? -1 : tab) + '" data-rg="' + x.id + '"' + (x.dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, setOptions:function(list){ o.options = list; paint(); } };
}

// ---------- @component S1 diagramExplorer — zoomable schematic SVG with native-button hotspots (organ → tissue → cell) ----------
// diagramExplorer(host, { levels:[{ id, name, vb:[w, h], draw() -> SVG markup, aria() -> text for role="img",
//     hotspots:[{ id, label (accessible name of its button), zones:[[x, y, w, h], …] (viewBox units), tag:[x, y, "l"|"r"|"c"] }] }],
//   level:"id", onTap(id, levelId) })
// -> { level(), setLevel(id), select(id|null), selected(), marks({id:"good"|"bad"}), names({id:html}) (name tags at hs.tag),
//      tags([{x, y, html, align, cls}]) (free tags in viewBox units), over() (<g> above the drawing, for animation), svg(),
//      setAria(text), labels(fn(id) -> accessible name), refresh() }
// Buttons sit over the drawing in reading order (top to bottom) and grow to at least 24 × 24 px; smaller zones sit on top.
// A tap on the picture that misses every button falls back to the shape under the pointer (data-hs), then the nearest zone.
// Highlight: the selected zone's button gets aria-pressed="true" (styled in app.css: .s1-b).
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
    hsBox.setAttribute("aria-label", "Structures in the " + lv.name.toLowerCase() + " view");
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
  function paintTags(){
    var lv = L(), w = lv.vb[0], h = lv.vb[1], out = [];
    lv.hotspots.forEach(function(hs){ if (names[hs.id] && hs.tag) out.push({ x:hs.tag[0], y:hs.tag[1], align:hs.tag[2], html:names[hs.id], cls:"s1-name" }); });
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

// ---------- leaf geometry (viewBox 360 × 300; cross-section layers top to bottom) ----------
var XS = { cut0:28, epi0:35, pal0:54, spg0:120, epiL0:236, cutL0:254, cutL1:258, pore:268 };
var VEIN = { cx:140, cy:160, rx:31, ry:27 };
var SPONGY = (function(){
  var r = MV.bio.rng("lf-spongy"), out = [];
  [133, 157, 181, 205, 225].forEach(function(y, ri){
    for (var x = ri % 2 ? 22 : 8; x < 358; x += 27) {
      var cx = x + r.range(-3, 3), cy = y + r.range(-2, 2), rx = r.range(10, 12.5), ry = r.range(8.5, 10);
      if (Math.pow((cx - VEIN.cx) / (VEIN.rx + 12), 2) + Math.pow((cy - VEIN.cy) / (VEIN.ry + 10), 2) < 1) continue;
      if (cx > 232 && cx < 304 && cy > 192) continue;
      if (cy + ry > 235) ry = 235 - cy;
      out.push({ x:cx, y:cy, rx:rx, ry:ry });
    }
  });
  return out;
})();
var AIRPTS = (function(){
  var out = [];
  for (var y = 128; y <= 230; y += 9) for (var x = 12; x <= 350; x += 13) {
    var inCell = SPONGY.some(function(c){ return Math.pow((x - c.x) / (c.rx + 2), 2) + Math.pow((y - c.y) / (c.ry + 2), 2) < 1; });
    var inVein = Math.pow((x - VEIN.cx) / (VEIN.rx + 4), 2) + Math.pow((y - VEIN.cy) / (VEIN.ry + 4), 2) < 1;
    if (!inCell && !inVein) out.push([x, y]);
  }
  return out;
})();
// hotspot zones and name-tag anchors per zoom level
var ZONES = {
  leaf:{ vein:{ zones:[[171, 30, 18, 144]], tag:[194, 64, "l"] } },
  xs:{
    cuticle:{ zones:[[0, 8, 360, 27]], tag:[6, 14, "l"] },
    upper:{ zones:[[0, 35, 360, 19]], tag:[6, 44, "l"] },
    palisade:{ zones:[[0, 54, 360, 66]], tag:[6, 87, "l"] },
    spongy:{ zones:[[0, 120, 360, 116]], tag:[6, 212, "l"] },
    xylem:{ zones:[[116, 140, 50, 22]], tag:[176, 146, "l"] },
    phloem:{ zones:[[118, 162, 46, 18]], tag:[176, 174, "l"] },
    air:{ zones:[[244, 200, 48, 36]], tag:[240, 212, "r"] },
    guard:{ zones:[[230, 234, 26, 26], [280, 234, 26, 26]], tag:[236, 270, "r"] },
    lower:{ zones:[[0, 236, 360, 22]], tag:[6, 245, "l"] },
    stoma:{ zones:[[258, 240, 20, 40]], tag:[268, 290, "c"] }
  },
  cell:{
    wall:{ zones:[[112, 2, 136, 14]], tag:[252, 10, "l"] },
    nucleus:{ zones:[[119, 112, 22, 40]], tag:[108, 132, "r"] },
    vacuole:{ zones:[[150, 62, 68, 192]], tag:[184, 160, "c"] },
    chloro:{ zones:[[226, 30, 16, 240]], tag:[250, 150, "l"] }
  }
};
var LEVEL_OF = {}; Object.keys(ZONES).forEach(function(l){ Object.keys(ZONES[l]).forEach(function(id){ LEVEL_OF[id] = l; }); });

function guardCells(d){
  var cell = function(cx, side){ return sv("ellipse", { cx:cx, cy:245, rx:12, ry:9.5, "class":"lf-tis lf-guard" }) + sv("ellipse", { cx:cx + side * 3, cy:242, rx:2, ry:1.6, "class":"lf-chl" }) + sv("ellipse", { cx:cx - side * 1, cy:248, rx:2, ry:1.6, "class":"lf-chl" }) + sv("ellipse", { cx:cx + side * 5, cy:248, rx:1.8, ry:1.5, "class":"lf-chl" }); };
  return '<g data-hs="guard"><g class="lf-gl" transform="translate(' + f1(-d) + ',0)">' + cell(256, -1) + '</g><g class="lf-gr" transform="translate(' + f1(d) + ',0)">' + cell(280, 1) + "</g></g>";
}
function xsSVG(o){
  o = o || {};
  var h = "", g = "", x, i, k;
  h += sv("rect", { x:0, y:XS.epi0, width:360, height:XS.cutL0 - XS.epi0, "class":"lf-air", "data-hs":"air" });
  h += sv("rect", { x:0, y:XS.cut0, width:360, height:XS.epi0 - XS.cut0, "class":"lf-cut", "data-hs":"cuticle" });
  for (x = 0; x < 360; x += 24) g += sv("rect", { x:x + .6, y:XS.epi0 + .6, width:22.8, height:XS.pal0 - XS.epi0 - 1.2, rx:3, "class":"lf-epi" });
  h += sv("g", { "data-hs":"upper" }, g); g = "";
  for (i = 0; i < 18; i++) {
    x = i * 20 + 1;
    g += sv("rect", { x:x, y:XS.pal0 + 1.5, width:18, height:XS.spg0 - XS.pal0 - 3, rx:7, "class":"lf-tis" });
    for (k = 0; k < 5; k++) { var cy = 62 + k * 12.4; g += sv("ellipse", { cx:x + 4.4, cy:cy, rx:2.3, ry:3.5, "class":"lf-chl" }) + sv("ellipse", { cx:x + 13.6, cy:cy + 5, rx:2.3, ry:3.5, "class":"lf-chl" }); }
  }
  h += sv("g", { "data-hs":"palisade" }, g); g = "";
  SPONGY.forEach(function(c){
    g += sv("ellipse", { cx:c.x, cy:c.y, rx:c.rx, ry:c.ry, "class":"lf-tis" }) + sv("ellipse", { cx:c.x - 4, cy:c.y - 3, rx:2, ry:1.6, "class":"lf-chl" }) + sv("ellipse", { cx:c.x + 4, cy:c.y - 2, rx:2, ry:1.6, "class":"lf-chl" }) + sv("ellipse", { cx:c.x, cy:c.y + 4, rx:2, ry:1.6, "class":"lf-chl" });
  });
  h += sv("g", { "data-hs":"spongy" }, g); g = "";
  h += sv("path", { d:"M246 236 C246 216 255 205 268 205 C281 205 290 216 290 236", "class":"lf-chamber", "data-hs":"air" });
  // vein: bundle sheath ring, xylem (upper side, big thick-walled tubes), phloem (lower side, small cells)
  h += sv("ellipse", { cx:VEIN.cx, cy:VEIN.cy, rx:VEIN.rx - 4, ry:VEIN.ry - 4, "class":"lf-vein-in" });
  for (i = 0; i < 16; i++) { var a = i / 16 * Math.PI * 2; g += sv("circle", { cx:VEIN.cx + Math.cos(a) * VEIN.rx, cy:VEIN.cy + Math.sin(a) * VEIN.ry, r:5.4, "class":"lf-sheath" }); }
  h += sv("g", {}, g); g = "";
  [[124, 152, 5], [136, 147, 6.5], [150, 148, 6], [160, 155, 4.4], [129, 160, 3.6]].forEach(function(c){ g += sv("circle", { cx:c[0], cy:c[1], r:c[2], "class":"lf-xy" }); });
  h += sv("g", { "data-hs":"xylem" }, g); g = "";
  [[126, 169], [133, 173], [141, 175], [149, 173], [156, 168], [138, 166], [146, 166]].forEach(function(c){ g += sv("circle", { cx:c[0], cy:c[1], r:2.8, "class":"lf-ph" }); });
  h += sv("g", { "data-hs":"phloem" }, g); g = "";
  for (x = 0; x + 24 <= 240; x += 24) g += sv("rect", { x:x + .6, y:XS.epiL0 + .6, width:22.8, height:XS.cutL0 - XS.epiL0 - 1.2, rx:3, "class":"lf-epi" });
  for (x = 298; x < 360; x += 24) g += sv("rect", { x:x + .6, y:XS.epiL0 + .6, width:Math.min(22.8, 360 - x), height:XS.cutL0 - XS.epiL0 - 1.2, rx:3, "class":"lf-epi" });
  h += sv("g", { "data-hs":"lower" }, g);
  h += sv("g", { "data-hs":"cuticle" }, sv("rect", { x:0, y:XS.cutL0, width:243, height:XS.cutL1 - XS.cutL0, "class":"lf-cut" }) + sv("rect", { x:293, y:XS.cutL0, width:67, height:XS.cutL1 - XS.cutL0, "class":"lf-cut" }));
  h += sv("rect", { x:261, y:XS.epiL0, width:14, height:20, "class":"lf-pore", "data-hs":"stoma" });
  h += guardCells(o.open == null ? 3.5 : o.open / 100 * 7);
  return h;
}
var MAPLE = [[-90, 1, 40], [-150, 0.9, 34], [-30, 0.9, 34], [148, 0.58, 30], [32, 0.58, 30]];   // lobe angle (°), size, half-width (°)
function mapleR(th, R){
  var D = Math.PI / 180, best = 0;
  function g(phi, w){ var a = Math.abs(phi); return a < w ? Math.pow(1 - a / w, 0.75) : 0; }
  function wrap(d){ while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; }
  MAPLE.forEach(function(L){
    var d = wrap(th - L[0] * D), w = L[2] * D;
    best = Math.max(best, L[1] * g(d, w), L[1] * 0.62 * g(wrap(d - 0.55 * w), 0.22 * w), L[1] * 0.62 * g(wrap(d + 0.55 * w), 0.22 * w));
  });
  var saw = (th / (2 * Math.PI) * 60) % 1; if (saw < 0) saw += 1;
  return R * (0.3 + 0.7 * best) + R * 0.03 * (saw - 0.5) * best;
}
function mapleSVG(){
  var cx = 180, cy = 142, R = 124, d = "";
  for (var k = 0; k <= 900; k++) { var th = k / 900 * 2 * Math.PI - Math.PI / 2, r = mapleR(th, R); d += (k ? "L" : "M") + f1(cx + r * Math.cos(th)) + " " + f1(cy + r * Math.sin(th)); }
  var bx = cx, by = cy + R * 0.3 - 4, h = sv("line", { x1:bx, y1:by, x2:bx, y2:286, "class":"lf-petiole" }) + sv("path", { d:d + "Z", "class":"lf-blade" });
  var veins = MAPLE.map(function(L){ var th = L[0] / 180 * Math.PI, r = mapleR(th, R) - 9; return sv("line", { x1:bx, y1:by, x2:cx + r * Math.cos(th), y2:cy + r * Math.sin(th), "class":"lf-vein" }); }).join("");
  return h + sv("g", { "data-hs":"vein" }, veins) + sv("line", { x1:52, y1:118, x2:308, y2:118, "class":"lf-cutline" }) + sv("text", { x:312, y:114, "class":"lf-txt" }, "slice");
}
function cellSVG(){
  var h = "", i;
  [[4, 104], [256, 356]].forEach(function(x){ h += sv("rect", { x:x[0], y:12, width:x[1] - x[0], height:276, rx:24, "class":"lf-tis lf-faint" }); for (i = 0; i < 9; i++) h += sv("ellipse", { cx:x[0] === 4 ? 96 : 264, cy:30 + i * 30, rx:4, ry:8, "class":"lf-chl lf-faint" }); });
  h += sv("rect", { x:115.5, y:9.5, width:129, height:281, rx:28, "class":"lf-wall", "data-hs":"wall" });
  h += sv("rect", { x:121, y:15, width:118, height:270, rx:23, "class":"lf-mem" });
  h += sv("rect", { x:148, y:56, width:72, height:204, rx:32, "class":"lf-vac", "data-hs":"vacuole" });
  h += sv("g", { "data-hs":"nucleus" }, sv("ellipse", { cx:131, cy:132, rx:9.5, ry:18, "class":"lf-nuc" }) + sv("circle", { cx:132, cy:128, r:3.2, "class":"lf-nucl" }));
  var g = "";
  for (i = 0; i < 11; i++) g += chloro(233, 40 + i * 22, true);
  [40, 62, 84, 186, 208, 230, 252].forEach(function(y){ g += chloro(129, y, true); });
  [150, 172, 194, 216].forEach(function(x){ g += chloro(x, 31, false) + chloro(x, 272, false); });
  return h + sv("g", { "data-hs":"chloro" }, g);
  function chloro(x, y, vert){ return sv("ellipse", { cx:x, cy:y, rx:vert ? 4.6 : 9, ry:vert ? 9 : 4.6, "class":"lf-chl" }) + sv("line", vert ? { x1:x, y1:y - 5, x2:x, y2:y + 5, "class":"lf-gran" } : { x1:x - 5, y1:y, x2:x + 5, y2:y, "class":"lf-gran" }); }
}

// small schematic cross-sections for habitat cards and the task (viewBox 160 × 100)
function miniLeafSVG(d){
  var h = "", x, i, L;
  if (d.needle) {
    h += sv("circle", { cx:80, cy:50, r:43, "class":"lf-cut lf-wax" }) + sv("circle", { cx:80, cy:50, r:38, "class":"lf-epi" }) + sv("circle", { cx:80, cy:50, r:34, "class":"lf-tis" });
    for (i = 0; i < 14; i++) { var a = i / 14 * Math.PI * 2; h += sv("circle", { cx:80 + Math.cos(a) * 25, cy:50 + Math.sin(a) * 25, r:5.5, "class":"lf-tis" }); }
    h += sv("circle", { cx:80, cy:50, r:11, "class":"lf-vein-in" }) + sv("circle", { cx:76, cy:46, r:3.4, "class":"lf-xy m" }) + sv("circle", { cx:85, cy:47, r:3, "class":"lf-xy m" }) + sv("circle", { cx:80, cy:55, r:2.4, "class":"lf-ph" });
    for (i = 0; i < 6; i++) { var b = (i / 6 + 1 / 12) * Math.PI * 2, px = 80 + Math.cos(b) * 39, py = 50 + Math.sin(b) * 39; h += sv("circle", { cx:px, cy:py, r:4.2, "class":"lf-pit" }) + sv("circle", { cx:80 + Math.cos(b) * 36, cy:50 + Math.sin(b) * 36, r:2.2, "class":"lf-chl" }); }
    return h;
  }
  var th = 18 + d.t * 110, y0 = 50 - th / 2, y1 = 50 + th / 2, X0 = 6, X1 = 154, cw = d.cut >= 4 ? 4.5 : d.cut >= 2 ? 2.2 : 1, ep = 5;
  h += sv("rect", { x:X0, y:y0, width:X1 - X0, height:th, "class":"lf-air" });
  var iy0 = y0 + ep, iy1 = y1 - ep, ih = iy1 - iy0, palH = ih * (d.pal >= 3 ? 0.62 : d.pal === 2 ? 0.5 : 0.36), lh = palH / d.pal;
  for (L = 0; L < d.pal; L++) for (x = X0; x < X1 - 1; x += 6) h += sv("rect", { x:x + .5, y:iy0 + L * lh + .5, width:5, height:lh - 1, rx:2, "class":"lf-tis" });
  var sy0 = iy0 + palH, sh = iy1 - sy0, rows = Math.max(1, Math.round(sh / 9)), rh = sh / rows, gap = d.bigAir ? 19 : 9.5;
  for (i = 0; i < rows; i++) for (x = X0 + 5 + (i % 2) * gap / 2; x < X1 - 3; x += gap) {
    if (Math.abs(x - 80) < 12 && !d.bigAir) continue;
    h += sv("ellipse", { cx:x, cy:sy0 + rh * (i + 0.5), rx:d.bigAir ? 4 : 4.2, ry:Math.min(4, rh / 2 - .4), "class":"lf-tis" });
  }
  var vr = Math.min(6.5, sh / 2 - 0.5), vy = sy0 + sh / 2;
  if (d.kranz) { for (i = 0; i < 9; i++) { var c = i / 9 * Math.PI * 2; h += sv("circle", { cx:80 + Math.cos(c) * (vr + 3.2), cy:vy + Math.sin(c) * (vr + 3.2), r:3, "class":"lf-kranz" }); } }
  h += sv("circle", { cx:80, cy:vy, r:vr, "class":"lf-vein-in" }) + sv("circle", { cx:78, cy:vy - vr * 0.35, r:vr * 0.32, "class":"lf-xy m" }) + sv("circle", { cx:82, cy:vy + vr * 0.45, r:vr * 0.22, "class":"lf-ph" });
  for (x = X0; x < X1 - 1; x += 8) { h += sv("rect", { x:x + .4, y:y0 + .4, width:7.2, height:ep - .8, rx:1.5, "class":"lf-epi" }) + sv("rect", { x:x + .4, y:y1 - ep + .4, width:7.2, height:ep - .8, rx:1.5, "class":"lf-epi" }); }
  h += sv("rect", { x:X0, y:y0 - cw, width:X1 - X0, height:cw, "class":"lf-cut" }) + sv("rect", { x:X0, y:y1, width:X1 - X0, height:cw, "class":"lf-cut" });
  function stomata(dens, top){
    var n = dens >= 400 ? 5 : dens >= 200 ? 3 : dens > 0 ? 2 : 0, s = "";
    for (var k = 0; k < n; k++) {
      var sx = X0 + (k + 0.5) * (X1 - X0) / n + (n === 2 ? 0 : 6), sy = top ? y0 : y1, pit = d.pits && !top ? 6 : 0;
      if (pit) s += sv("rect", { x:sx - 5, y:sy - pit, width:10, height:pit + cw + 0.5, "class":"lf-pit" });
      s += sv("rect", { x:sx - 1.4, y:top ? sy - cw - 0.5 : sy - ep - pit, width:2.8, height:ep + cw + 1, "class":"lf-pit" });
      var gy = top ? sy + ep / 2 : sy - ep / 2 - pit;
      s += sv("ellipse", { cx:sx - 3.4, cy:gy, rx:2.4, ry:2.2, "class":"lf-gsm" }) + sv("ellipse", { cx:sx + 3.4, cy:gy, rx:2.4, ry:2.2, "class":"lf-gsm" });
    }
    return s;
  }
  h += stomata(d.up, true) + stomata(d.low, false);
  if (d.hairs) for (x = X0 + 4; x < X1; x += 7) h += sv("path", { d:"M" + f1(x) + " " + f1(y1 + cw) + " q 2 4 -1 " + f1(7), "class":"lf-hair" });
  return h;
}

// ---------- gas and light model (plan's gas-model table and light model values) ----------
var GASN = { co2:"CO₂", o2:"O₂", h2o:"Water vapour" }, TOKL = { co2:chem("CO2"), o2:chem("O2"), h2o:chem("H2O") }, TOKC = { co2:"--bio-carbon", o2:"--bio-o2", h2o:"--bio-o2" };
var PHOTO = ["Zero", "Very low", "Low", "Medium", "High"], WATER = { 0:["Very low (through the cuticle)", 1], 25:["Low", 2], 50:["Medium", 3], 75:["High", 4], 100:["Very high", 5] };
function gasState(gas, light, open, t){
  if (gas === "h2o") return { out:"Low", air:"High", cell:"High", move:open > 0 ? "out" : "none" };
  var make = gas === "co2" ? light !== "on" : light === "on", settled = t >= 60;   // cells give off CO₂ in the dark, O₂ in the light
  if (open > 0) return make ? { out:"Low", air:"Medium", cell:"High", move:"out" } : { out:"High", air:"Medium", cell:"Low", move:"in" };
  return make ? { out:"Low", air:settled ? "High" : "Medium", cell:"High", move:"none" } : { out:"High", air:settled ? "Low" : "Medium", cell:"Low", move:"none" };
}
var LIGHT = { reach:{ cuticle:100, upper:92, palisade:92, spongy:30, lower:8 }, abs:{ cuticle:0, upper:0, palisade:62, spongy:22, lower:0 },
  layerOf:{ cuticle:"cuticle", upper:"upper", palisade:"palisade", spongy:"spongy", air:"spongy", xylem:"spongy", phloem:"spongy", lower:"lower", stoma:"lower", guard:"lower" },
  name:{ cuticle:"Cuticle", upper:"Upper epidermis", palisade:"Palisade", spongy:"Spongy mesophyll", lower:"Lower epidermis" },
  bars:[["Reflected", 8], ["Cuticle", 0, "cuticle"], ["Upper epidermis", 0, "upper"], ["Palisade mesophyll", 62, "palisade"], ["Spongy mesophyll", 22, "spongy"], ["Lower epidermis", 0, "lower"], ["Passes through", 8]] };
function remain(y){ if (y < XS.cut0) return 100; if (y < XS.pal0) return 92; if (y < XS.spg0) return 92 - 62 * (y - XS.pal0) / (XS.spg0 - XS.pal0); if (y < XS.epiL0) return 30 - 22 * (y - XS.spg0) / (XS.epiL0 - XS.spg0); return 8; }
function wavy(x, ya, yb){ var d = ""; for (var y = ya; y <= yb + 0.01; y += 1.5) d += (y === ya ? "M" : "L") + f1(x + 2.6 * Math.sin(y / 4.2)) + " " + f1(y); return d; }
function lightMarkup(I, depth, xs){
  if (I <= 0) return "";
  var h = "", ymax = 4 + depth * 292;
  (xs || [46, 118, 200, 322]).forEach(function(x, n){
    for (var y = 2; y < Math.min(ymax, 296); y += 8) {
      var y2 = Math.min(y + 8, ymax), rem = remain((y + y2) / 2) / 100 * I / 100;
      if (rem < 0.03) continue;
      h += sv("path", { d:wavy(x, y, y2), "class":"lf-beam", "stroke-opacity":f1(Math.min(1, rem) * 100) / 100 });
    }
    if (ymax > 22) h += sv("path", { d:"M" + (x - 4.5) + " 18 L" + x + " 26 L" + (x + 4.5) + " 18", "class":"lf-beam-h", opacity:f1(I) / 100 });
    if (n < 2 && ymax > 30) h += sv("path", { d:"M" + (x + 8) + " 26 L" + (x + 20) + " 6", "class":"lf-beam lf-refl", "stroke-opacity":f1(0.55 * I) / 100 });
  });
  return h;
}
// token paths (deterministic): outside ↔ pore ↔ chamber ↔ air space ↔ cell
function palPt(r){ return [r.int(18) * 20 + 10, r.range(66, 110)]; }
function spgPt(r){ var c = r.pick(SPONGY); return [c.x, c.y]; }
function cellPt(r, guards){ var u = r(); if (guards && u < 0.1) return [r() < 0.5 ? 249 : 287, 245]; return u < 0.55 ? palPt(r) : spgPt(r); }
function inPath(r, dest){ return [[XS.pore + r.range(-36, 36), 300], [XS.pore + r.range(-6, 6), 270], [XS.pore, 245], [XS.pore + r.range(-8, 8), 222], r.pick(AIRPTS), dest]; }
function tokPath(r, gas, move){
  if (move === "in") return inPath(r, gas === "co2" ? palPt(r) : cellPt(r, false));
  if (move === "out") return inPath(r, gas === "co2" ? cellPt(r, true) : gas === "o2" ? cellPt(r, false) : spgPt(r)).reverse();
  return [r.pick(AIRPTS), r.pick(AIRPTS), r.pick(AIRPTS)];
}
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function tokSVG(gas){ var w = gas === "h2o" ? 27 : gas === "co2" ? 25 : 20; return '<g class="lf-tok" opacity="0"><rect x="' + (-w / 2) + '" y="-6.8" width="' + w + '" height="13.6" rx="6.8" style="fill:var(' + TOKC[gas] + ')"/><text y="3.4" text-anchor="middle">' + TOKL[gas] + "</text></g>"; }

// ---------- Explore: leaf cross-section explorer ----------
var EXP = null;
function explore(host, api){
  var C = api.content, HSD = C.hotspots, S = api.S;
  S.zoom = S.zoom || "leaf"; S.mode = S.mode || "explore"; S.gas = S.gas || "co2"; S.light = S.light || "on";
  if (S.open == null) S.open = 50; if (S.inten == null) S.inten = 100; S.trail = S.trail || []; if (S.sel === undefined) S.sel = null;
  var sim = { t:60, from:3, hold:false, barK:1, depth:1, visible:false }, toks = [], R = MV.bio.rng("lf-gas"), raf = 0, last = 0, readSig = "", anim = 0;
  host.innerHTML = '<div class="pg lf-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div id="lf-dx"></div><p class="lf-cap" id="lf-cap"></p><div class="lf-trail" id="lf-trail"></div></div>' +
    '<div class="pg-ctrl"><div class="lf-row" id="lf-zoom"></div><div class="lf-row" id="lf-mode"></div><div class="lf-panel" id="lf-gasp"></div><div class="lf-panel" id="lf-lightp"></div></div>' +
    '<div class="pg-read"><dl class="read" id="lf-read" aria-live="polite"></dl><div id="lf-meters" aria-hidden="true"></div></div></div>';
  var labelOf = function(id){ return HSD[id].name; };
  var levels = [
    { id:"leaf", name:"Whole leaf", vb:[360, 300], draw:mapleSVG, aria:function(){ return "Whole maple leaf with its veins. A dashed line marks the slice shown in the cross-section."; }, hotspots:hsList("leaf") },
    { id:"xs", name:"Cross-section", vb:[360, 300], draw:function(){ return xsSVG({ open:S.open }); }, aria:xsAria, hotspots:hsList("xs") },
    { id:"cell", name:"Palisade cell", vb:[360, 300], draw:cellSVG, aria:function(){ return "One palisade cell: cell wall, nucleus near one side, a large central vacuole, and many chloroplasts along the wall."; }, hotspots:hsList("cell") }
  ];
  function hsList(l){ return Object.keys(ZONES[l]).map(function(id){ return { id:id, label:labelOf(id), zones:ZONES[l][id].zones, tag:ZONES[l][id].tag }; }); }
  var dx = diagramExplorer($("#lf-dx"), { levels:levels, level:S.zoom, onTap:onTap });

  // controls
  var zoomR = radios($("#lf-zoom"), { label:"Zoom", options:[{ id:"leaf", t:"Whole leaf" }, { id:"xs", t:"Cross-section" }, { id:"cell", t:"Palisade cell" }], value:S.zoom, onChange:setZoom });
  var modeR = radios($("#lf-mode"), { label:"Mode", options:[{ id:"explore", t:"Explore" }, { id:"gas", t:"Follow the gas" }, { id:"light", t:"Follow the light" }], value:S.mode, onChange:function(m){ setMode(m); } });
  $("#lf-gasp").innerHTML = '<div class="lf-row" id="lf-gas"></div><div class="lf-row" id="lf-light"></div>' +
    '<label class="slider lf-sl"><span class="slider-top"><span>Stomatal opening</span><output id="lf-open-out"></output></span><input type="range" id="lf-open" min="0" max="100" step="25"></label>' +
    '<p class="tiny muted lf-note">' + C.darkNote + "</p>";
  $("#lf-lightp").innerHTML = '<label class="slider lf-sl"><span class="slider-top"><span>Light intensity</span><output id="lf-int-out"></output></span><input type="range" id="lf-int" min="0" max="100" step="10"></label><p class="tiny muted lf-note">' + C.lightNote + "</p>";
  var gasR = radios($("#lf-gas"), { label:"Gas", cls:"chips", options:[{ id:"co2", t:"CO₂" }, { id:"o2", t:"O₂" }, { id:"h2o", t:"Water vapour" }], value:S.gas, onChange:function(g){ S.gas = g; changed(false); } });
  var lightR = radios($("#lf-light"), { label:"Light", options:[{ id:"on", t:"On" }, { id:"off", t:"Off" }], value:S.light, onChange:function(v){ var p = photo(); S.light = v; sim.hold = false; closeClock(p); changed(true); } });
  $("#lf-open").addEventListener("input", function(e){ var p = photo(); S.open = +e.target.value; sim.hold = false; closeClock(p); changed(true); });
  $("#lf-int").addEventListener("input", function(e){ S.inten = +e.target.value; sim.barK = 1; sim.depth = 1; changed(false); });
  $("#lf-trail").addEventListener("click", function(e){
    var b = e.target.closest("[data-tr]"); if (!b || b.disabled) return;
    if (b.dataset.tr === "undo") S.trail.pop(); else S.trail = [];
    api.save(); paintTrail(); MV.changed();
  });

  function syncControls(){
    zoomR.set(S.zoom); modeR.set(S.mode); gasR.set(S.gas); lightR.set(S.light);
    $("#lf-open").value = S.open; $("#lf-open-out").textContent = S.open + "%";
    $("#lf-int").value = S.inten; $("#lf-int-out").textContent = S.inten + "%";
    $("#lf-gasp").hidden = S.mode !== "gas"; $("#lf-lightp").hidden = S.mode !== "light";
  }
  function setZoom(z){
    S.zoom = z; if (S.mode !== "explore") S.mode = "explore";
    dx.setLevel(z); afterLevel(); api.save(); syncControls(); paint(); MV.changed();
  }
  function setMode(m){
    S.mode = m; if (m !== "explore" && S.zoom !== "xs") { S.zoom = "xs"; dx.setLevel("xs"); afterLevel(); }
    sim.barK = 1; sim.depth = 1; resetToks(); api.save(); syncControls(); paint(); MV.changed();
  }
  function afterLevel(){ dx.select(S.sel && LEVEL_OF[S.sel] === S.zoom ? S.sel : null); resetToks(); }
  function photo(){
    if (S.light !== "on") return { lvl:0, txt:PHOTO[0] };
    if (S.open > 0) { var l = S.open >= 75 ? 4 : S.open >= 50 ? 3 : 2; return { lvl:l, txt:PHOTO[l] }; }
    var k = clamp(sim.t / 60, 0, 1); return { lvl:lerp(sim.from, 1, k), txt:k >= 1 ? "Very low" : "Slowing" };
  }
  function closeClock(prev){ if (S.open === 0) { sim.from = prev.lvl >= 2 ? prev.lvl : 3; sim.t = MV.reduceMotion ? 60 : 0; } else sim.t = 60; }
  function changed(geom){
    if (geom) { var gl = $(".lf-gl", dx.svg()), gr = $(".lf-gr", dx.svg()), d = S.open / 100 * 7; if (gl) gl.setAttribute("transform", "translate(" + f1(-d) + ",0)"); if (gr) gr.setAttribute("transform", "translate(" + f1(d) + ",0)"); }
    resetToks(); api.save(); syncControls(); paint(); MV.changed(); kick();
  }
  function onTap(id){
    S.sel = id; if (S.trail[S.trail.length - 1] !== id) S.trail.push(id); if (S.trail.length > 12) S.trail.shift();
    dx.select(id); api.save(); paintTrail(); paint(); MV.changed();
  }
  function paintTrail(){
    var n = S.trail.length;
    MV.keepFocus($("#lf-trail"), function(){
      $("#lf-trail").innerHTML = '<p class="lf-trail-p"><span class="lf-trail-lab">Your taps:</span> ' + (n ? S.trail.map(function(id, i){ return (i ? '<span class="lf-arr" aria-hidden="true">→</span><span class="vh">, then</span> ' : "") + '<span class="lf-step">' + HSD[id].name + "</span>"; }).join(" ") : '<span class="muted">none yet</span>') + "</p>" +
        '<span class="lf-trail-btns"><button type="button" class="btn ghost sm" data-tr="undo" data-k="trundo"' + (n ? "" : " disabled") + '>Undo last tap</button><button type="button" class="btn ghost sm" data-tr="clear" data-k="trclear"' + (n ? "" : " disabled") + ">Clear taps</button></span>";
    });
  }
  function gs(){ return gasState(S.gas, S.light, S.open, sim.t); }
  function xsAria(){
    var base = "Leaf cross-section, top to bottom: cuticle, upper epidermis, palisade mesophyll, spongy mesophyll with air spaces and a vein (xylem above, phloem below), lower epidermis with a stoma between two guard cells.";
    if (S.mode === "gas") { var g = gs(), w = WATER[S.open][0]; return base + " " + GASN[S.gas] + (g.move === "in" ? " moving into the leaf" : g.move === "out" ? " moving out of the leaf" : " not moving through the stoma") + "; photosynthesis " + photo().txt + "; water loss " + w + "."; }
    if (S.mode === "light") return base + " Light at " + S.inten + "% enters from the top; most is absorbed in the palisade layer.";
    return base;
  }
  // readout + meters + diagram tags
  function paint(){
    var hs = S.sel ? HSD[S.sel] : null, rows = [];
    rows.push(["Selected structure", hs ? hs.name : '<span class="muted">Tap a structure in the diagram</span>']);
    rows.push(["Its job", hs ? hs.job : "—"]);
    rows.push(["Chloroplasts?", hs ? hs.chl : "—"]);
    var tags = [], meters = "";
    if (S.mode === "gas" && S.zoom === "xs") {
      var g = gs(), p = photo(), w = WATER[S.open], gn = GASN[S.gas];
      var mv = g.move === "in" ? gn + ": <strong>in</strong>, because outside (" + g.out + ") &gt; air spaces (" + g.air + ")" :
        g.move === "out" ? gn + ": <strong>out</strong>, because air spaces (" + g.air + ") &gt; outside (" + g.out + ")" :
        gn + ": <strong>none</strong>, because the stomata are closed" + (S.gas === "h2o" ? " (a very little escapes through the cuticle)" : "");
      rows.push(["Gas movement at the stoma", mv]);
      rows.push(["Photosynthesis rate", p.txt]);
      rows.push(["Water loss", w[0]]);
      tags.push({ x:356, y:66, align:"r", html:"Palisade cell: " + g.cell, cls:"lf-ctag" }, { x:356, y:197, align:"r", html:"Air spaces: " + g.air, cls:"lf-ctag" }, { x:250, y:288, align:"r", html:"Outside: " + g.out, cls:"lf-ctag" });
      meters = meterHTML("Photosynthesis rate", p.lvl / 4, "lf-m-photo") + meterHTML("Water loss", w[1] / 5, "lf-m-water");
    }
    if (S.mode === "light" && S.zoom === "xs") {
      var I = S.inten / 100 * sim.barK, lay = S.sel && LIGHT.layerOf[S.sel];
      rows.push(["Light reaching this layer / absorbed here", lay ? (lay === S.sel ? LIGHT.name[lay] : "In the " + LIGHT.name[lay].toLowerCase() + " layer") + ": " + fmt(LIGHT.reach[lay] * I) + " reach it, " + fmt(LIGHT.abs[lay] * I) + " absorbed" + (lay === "cuticle" ? " (" + fmt(8 * I) + " reflected)" : "") : '<span class="muted">Tap a layer in the cross-section</span>']);
      rows.push(["Light absorbed in each layer (model values)", '<span class="lf-bars">' + LIGHT.bars.map(function(b){ var v = b[1] * I; return '<span class="lf-bar' + (b[2] && b[2] === lay ? " on" : "") + '"><span class="lf-bar-l">' + b[0] + '</span><span class="lf-bar-t"><i style="width:' + f1(v) + '%"></i></span><span class="lf-bar-v">' + fmt(v) + "</span></span>"; }).join("") + "</span>"]);
      var J = S.inten / 100 * sim.barK;
      if (S.inten > 0) tags.push({ x:356, y:14, align:"r", html:fmt(8 * J) + " reflected", cls:"lf-ltag" }, { x:356, y:87, align:"r", html:fmt(62 * J) + " absorbed", cls:"lf-ltag" }, { x:356, y:184, align:"r", html:fmt(22 * J) + " absorbed", cls:"lf-ltag" }, { x:356, y:284, align:"r", html:fmt(8 * J) + " pass through", cls:"lf-ltag" });
    }
    var sig = JSON.stringify(rows);
    if (sig !== readSig) { readSig = sig; $("#lf-read").innerHTML = MV.readoutHTML(rows); }
    var mh = $("#lf-meters"); if (mh.dataset.sig !== S.mode + S.zoom) { mh.dataset.sig = S.mode + S.zoom; mh.innerHTML = meters; } else updMeters();
    var nm = {}; if (S.sel && LEVEL_OF[S.sel] === S.zoom) nm[S.sel] = HSD[S.sel].name;
    dx.names(nm); dx.tags(tags); dx.setAria(S.zoom === "xs" ? xsAria() : levels.filter(function(l){ return l.id === S.zoom; })[0].aria());
    paintCap(); drawStatic();
  }
  function meterHTML(lab, v, id){ return '<div class="lf-meter"><span class="lf-meter-l">' + lab + '</span><span class="lf-meter-t"><i id="' + id + '" style="width:' + f1(v * 100) + '%"></i></span></div>'; }
  function updMeters(){
    if (S.mode !== "gas") return;
    var a = $("#lf-m-photo"), b = $("#lf-m-water"); if (a) a.style.width = f1(photo().lvl / 4 * 100) + "%"; if (b) b.style.width = f1(WATER[S.open][1] / 5 * 100) + "%";
  }
  function paintCap(){
    var c = "";
    if (S.zoom === "leaf") c = "Tap a vein, or choose Cross-section to look at the slice.";
    else if (S.zoom === "cell") c = "One palisade cell, zoomed in. Tap its parts.";
    else if (S.mode === "gas") c = "Follow the gas: " + GASN[S.gas] + " · light " + S.light + " · stomata " + S.open + "% open" + (S.open === 0 ? " · time since the stomata closed: " + Math.round(sim.t) + " s" : "");
    else if (S.mode === "light") c = "Follow the light: intensity " + S.inten + "%. Wavy arrows are light; they fade as layers absorb it.";
    else c = "Tap any layer or structure to read its job.";
    $("#lf-cap").textContent = c;
  }
  // static overlay: gas direction arrow or light beams; tokens are animated separately
  function drawStatic(){
    var ov = dx.over(); if (!ov) return;
    var h = "";
    if (S.zoom === "xs" && S.mode === "gas") {
      var g = gs(), col = TOKC[S.gas];
      if (g.move !== "none") h += sv("path", { d:g.move === "in" ? "M268 298 L268 268 M260 276 L268 266 L276 276" : "M268 262 L268 292 M260 284 L268 294 L276 284", "class":"lf-dir", style:"stroke:var(" + col + ")" });
      h += '<g class="lf-toks"></g>';
    }
    if (S.zoom === "xs" && S.mode === "light") h += lightMarkup(S.inten, sim.depth);
    ov.innerHTML = h; placeToks();
  }
  // gas tokens
  function tokCount(move){ if (move === "none") return 6; return { 25:4, 50:7, 75:10, 100:13 }[S.open] || 0; }
  function resetToks(){
    R = MV.bio.rng("lf-gas-" + S.gas + S.light + S.open); toks = [];
    if (S.mode !== "gas" || S.zoom !== "xs") return;
    var g = gs(), n = tokCount(g.move);
    for (var i = 0; i < n; i++) toks.push({ path:tokPath(R, S.gas, g.move), p:MV.reduceMotion ? (i + 0.5) / n : -i / n, dur:R.range(3.2, 4.6), ph:R.range(0, 6) });
    if (g.move === "none" && S.gas === "h2o") { var cx = R.range(30, 330); toks.push({ path:[[cx, 70], [cx, 44], [cx, 31], [cx, 6]], p:MV.reduceMotion ? 0.8 : 0, dur:8, ph:0, trickle:true }); }
  }
  function placeToks(){
    var box = $(".lf-toks", dx.svg()); if (!box) return;
    if (box.childElementCount !== toks.length) box.innerHTML = toks.map(function(){ return tokSVG(S.gas); }).join("");
    var kids = box.children;
    toks.forEach(function(t, i){
      var pos = polyAt(t.path, t.p), wob = 2 * Math.sin(t.p * 18 + t.ph), op = t.p < 0 ? 0 : Math.min(1, t.p * 8, (1 - t.p) * 8);
      if (t.path.length === 3) op = t.p < 0 ? 0 : 1;
      kids[i].setAttribute("transform", "translate(" + f1(pos[0] + wob) + "," + f1(pos[1]) + ")"); kids[i].setAttribute("opacity", f1(op * 100) / 100);
    });
  }
  function stepToks(dt){
    var g = gs();
    toks.forEach(function(t){
      t.p += dt / t.dur;
      if (t.p >= 1) {
        if (t.trickle) { t.p -= 1; return; }
        if (g.move === "none") { t.path = [t.path[t.path.length - 1], R.pick(AIRPTS), R.pick(AIRPTS)]; t.p -= 1; }
        else { t.path = tokPath(R, S.gas, g.move); t.p = -R.range(0, 0.3); t.dur = R.range(3.2, 4.6); }
      }
    });
    placeToks();
  }
  // animation loop: gas tokens, the closed-stomata clock (1 sim minute ≈ 4 s), only while Explore is on screen
  function clockOn(){ return S.open === 0 && sim.t < 60 && !sim.hold && S.mode === "gas"; }
  function running(){ return sim.visible && S.zoom === "xs" && ((S.mode === "gas" && !MV.reduceMotion) || clockOn()); }
  function loop(ts){
    raf = 0; var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
    if (clockOn()) { var before = photo().txt + gs().air; sim.t = Math.min(60, sim.t + dt * 15); if (photo().txt + gs().air !== before) paint(); else { updMeters(); paintCap(); } }
    if (!MV.reduceMotion) stepToks(dt);
    if (running()) raf = requestAnimationFrame(loop); else last = 0;
  }
  function kick(){ if (!raf && running()) { last = 0; raf = requestAnimationFrame(loop); } }
  if (S.mode !== "explore" && S.zoom !== "xs") S.mode = "explore";
  syncControls(); afterLevel(); paintTrail(); paint();
  EXP = { show:function(v){ sim.visible = v; if (v) kick(); } };

  function chal(id){
    var tr = S.trail, set = {}; tr.forEach(function(x){ set[x] = 1; }); var keys = Object.keys(set);
    if (id === "tc1") {
      if (keys.length === 3 && set.palisade && set.spongy && set.guard) return { ok:true };
      if (!keys.length) return { ok:false, msg:"Tap the structures first. Your taps are listed under the diagram." };
      if (set.upper || set.lower) return { ok:false, msg:"Epidermis cells are clear, with no chloroplasts, so light reaches the mesophyll." };
      if (set.xylem || set.phloem) return { ok:false, msg:"Vein cells transport; they don’t photosynthesize." };
      if (set.cuticle) return { ok:false, msg:"The cuticle is a waxy layer, not cells." };
      if (!set.guard) return { ok:false, msg:"Look closely at the pair of cells around each stoma." };
      return { ok:false };
    }
    if (id === "tc2") {
      var want = ["stoma", "air", "palisade", "chloro"];
      if (tr.length === 4 && want.every(function(k, i){ return tr[i] === k; })) return { ok:true };
      if (!tr.length) return { ok:false, msg:"Tap the structures in order. Your taps are listed under the diagram." };
      if (tr[0] === "cuticle") return { ok:false, msg:"The cuticle is waxy and almost gas-tight; gases enter through stomata." };
      if (set.xylem || set.phloem) return { ok:false, msg:"Veins carry liquids, not CO₂ from the air." };
      var si = tr.indexOf("stoma"); if (si >= 0 && tr[si + 1] === "palisade") return { ok:false, msg:"From the stoma, CO₂ first spreads through the air spaces." };
      if (tr[0] === "upper") return { ok:false, msg:"Most stomata on this leaf are on the lower surface." };
      if (tr.length < 4 && tr.every(function(k, i){ return want[i] === k; })) return { ok:false, msg:"So far, so good. Keep tracing: " + (tr.length === 3 ? "zoom in to the palisade cell and tap the part where CO₂ is used." : "where does the CO₂ go next?") };
      return { ok:false };
    }
    if (id === "tc3") {
      if (S.light === "on" && S.open === 25) return { ok:true };
      if (S.light !== "on") return { ok:false, msg:"Without light there’s no photosynthesis, so no O₂ to release." };
      if (S.open === 0) return { ok:false, msg:"Closed stomata trap the O₂ inside, so none is released." };
      return { ok:false, msg:"O₂ is released, but you’re losing more water than you need to." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        var s = p.start; if (anim) { anim(); anim = 0; }
        if (s.mode === "gas") { S.gas = s.gas; S.light = s.light; S.open = s.open; sim.from = 3; sim.t = s.open === 0 ? 0 : 60; sim.hold = s.open === 0; }
        else { S.inten = s.intensity; sim.barK = 0; sim.depth = 0; }
        S.mode = s.mode; if (S.zoom !== "xs") { S.zoom = "xs"; dx.setLevel("xs"); afterLevel(); }
        changed(true); if (s.mode === "light") { sim.barK = 0; sim.depth = 0; paint(); }
      },
      run:function(p, done){
        if (p.start.mode === "light") anim = MV.tween({ dur:1800, ease:function(t){ return t; }, step:function(t){ sim.depth = Math.min(1, t * 1.6); sim.barK = clamp((t - 0.3) / 0.7, 0, 1); paint(); }, done:function(){ anim = 0; sim.depth = 1; sim.barK = 1; paint(); done(); } });
        else if (p.start.open === 0) anim = MV.tween({ dur:3200, ease:function(t){ return t; }, step:function(t){ sim.t = 60 * t; paint(); }, done:function(){ anim = 0; sim.t = 60; sim.hold = false; paint(); done(); } });
        else MV.wait(3400, done);
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: leaves built for their habitat ----------
function part3(host, api){
  var C = api.content, S = api.S; S.m = S.m || {}; S.tries = S.tries || {};
  var habs = MV.shuffle(C.habitats, MV.meta.id + "-habitats"), sel = null;
  function habName(id){ return C.habitats.filter(function(x){ return x.id === id; })[0].t; }
  host.innerHTML = '<div class="lfh-cards">' + C.cards.map(function(c){
    return '<div class="lfh-card" data-card="' + c.id + '"><button type="button" class="lfh-pick" data-pick="' + c.id + '" data-k="lfp' + c.id + '" aria-pressed="false"><svg viewBox="0 0 160 100" aria-hidden="true" focusable="false">' + miniLeafSVG(c.draw) + '</svg><span class="lfh-name">Leaf ' + c.id + '</span></button>' +
      '<div class="lfh-res" id="lfh-res-' + c.id + '"></div>' +
      '<details class="alg lfh-data"><summary>Check it with data</summary><p class="tiny lfh-mnote"><span class="bio-model">Model data</span> ' + C.modelNote + '</p><dl class="lfh-dl">' + c.rows.map(function(r){ return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("") + "</dl></details></div>";
  }).join("") + '</div><div id="lfh-fb" aria-live="polite"></div><h4 class="lfh-h">Habitats</h4><div class="lfh-habs" role="group" aria-label="Habitats">' +
    habs.map(function(hb){ return '<button type="button" class="lfh-hab" data-hab="' + hb.id + '" data-k="lfh' + hb.id + '">' + hb.t + "</button>"; }).join("") + "</div>";
  function paint(){
    C.cards.forEach(function(c){
      var b = $('[data-pick="' + c.id + '"]', host), m = S.m[c.id];
      b.setAttribute("aria-pressed", String(sel === c.id)); b.disabled = !!m; b.classList.toggle("done", !!m);
      b.setAttribute("aria-label", "Leaf " + c.id + (m ? ", matched: " + MV.plain(habName(m)) : ""));
      $("#lfh-res-" + c.id).innerHTML = m ? '<p class="lfh-ok"><strong>✓ ' + habName(m) + ".</strong> " + c.why + "</p>" : "";
    });
    var used = {}; Object.keys(S.m).forEach(function(k){ used[S.m[k]] = 1; });
    $$(".lfh-hab", host).forEach(function(b){ b.disabled = !!used[b.dataset.hab]; b.classList.toggle("done", !!used[b.dataset.hab]); b.classList.toggle("ready", !!sel); });
  }
  function fb(kind, html){ $("#lfh-fb").innerHTML = kind ? '<div class="fb ' + kind + '" role="status"><p>' + html + "</p></div>" : (html ? '<p class="fb" role="status">' + html + "</p>" : ""); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pick) { sel = sel === b.dataset.pick ? null : b.dataset.pick; fb("", sel ? "Leaf " + sel + " selected. Now tap the habitat it fits." : ""); paint(); return; }
    if (b.dataset.hab) {
      if (!sel) { fb("", "Tap a leaf card first, then tap the habitat it fits."); return; }
      var c = C.cards.filter(function(x){ return x.id === sel; })[0];
      if (MV.ans(c) === b.dataset.hab) { S.m[c.id] = b.dataset.hab; fb("good", "<strong>✓ Leaf " + c.id + ": " + habName(b.dataset.hab) + ".</strong> " + c.why); sel = null; }
      else { S.tries[c.id] = (S.tries[c.id] || 0) + 1; fb("bad", "<strong>✗ Not that habitat for Leaf " + c.id + ".</strong> " + C.wrong); }
      api.save(); paint(); MV.focusFb(host);
      if (Object.keys(S.m).length === C.cards.length) $("#lfh-fb").insertAdjacentHTML("beforeend", '<p class="sort-done">All six leaves are matched to their habitats.</p>');
    }
  });
  paint();
}

// ---------- Practice 1: label the leaf (S1 label-quiz mode) ----------
function labelQuiz(host, api, a){
  var S = api.S; S.done = S.done || {}; S.tries = S.tries || {}; S.hints = S.hints || {};
  var HSD = MV.C.explore.hotspots, cur = null, msg = null;
  host.innerHTML = '<div class="lq-labs" id="lq-labs"></div><div id="lq-help"></div><div id="lq-fb" aria-live="polite"></div><div class="lq-dx" id="lq-dx"></div><div id="lq-done"></div>';
  var labs = radios($("#lq-labs", host), { label:"Labels", cls:"chips", options:opts(), value:"", onChange:function(id){ cur = id; msg = null; paint(); } });
  var dx = diagramExplorer($("#lq-dx", host), { levels:[{ id:"xs", name:"Cross-section", vb:[360, 300], draw:function(){ return xsSVG({ open:50 }); },
    aria:function(){ return "Unlabelled leaf cross-section with ten structures to name."; },
    hotspots:Object.keys(ZONES.xs).map(function(id){ return { id:id, label:aria(id), zones:ZONES.xs[id].zones, tag:ZONES.xs[id].tag }; }) }], level:"xs", onTap:onTap });
  function aria(id){ return S.done[id] ? HSD[id].name + " (labelled)" : HSD[id].where; }
  function opts(){ return a.labels.map(function(l){ return { id:l.id, t:(S.done[l.id] ? "✓ " : "") + l.t, dis:!!S.done[l.id] }; }); }
  function onTap(id){
    if (!cur) { msg = { k:"", h:"Tap a label first, then tap the structure it names." }; paint(); return; }
    var L = a.labels.filter(function(x){ return x.id === cur; })[0];
    if (id === cur) { S.done[cur] = true; msg = { k:"good", h:"<strong>✓ That’s the " + L.t + ".</strong> " + HSD[cur].job }; cur = null; labs.setOptions(opts()); labs.set(""); }
    else { S.tries[cur] = (S.tries[cur] || 0) + 1; var key = [cur, id].sort().join("|"); msg = { k:"bad", h:"<strong>✗ That’s not the " + L.t + ".</strong> " + (a.pairs[key] || a.wrongDefault) }; }
    api.save(); paint(); MV.focusFb($("#lq-fb", host));
  }
  function paint(){
    var m = {}, n = {}; Object.keys(S.done).forEach(function(id){ m[id] = "good"; n[id] = HSD[id].name; });
    dx.marks(m); dx.names(n); dx.labels(aria);
    var L = cur && a.labels.filter(function(x){ return x.id === cur; })[0], lvl = cur ? (S.hints[cur] || 0) : 0;
    MV.keepFocus($("#lq-help", host), function(){ $("#lq-help", host).innerHTML = L ? '<div class="sel-bar"><span>Selected label: <strong>' + L.t + "</strong></span>" + MV.hintBtn("lqh", lvl) + "</div>" + MV.hintsHTML(L.hints, lvl) : ""; });
    $("#lq-fb", host).innerHTML = msg ? '<div class="fb' + (msg.k ? " " + msg.k : "") + '" role="status"><p>' + msg.h + "</p></div>" : "";
    var s = stats(); $("#lq-done", host).innerHTML = s.done === s.total ? '<p class="sort-done">All labelled! You got ' + s.first + " of " + s.total + " right on the first try, without the worked solution.</p>" : "";
  }
  $("#lq-help", host).addEventListener("click", function(e){ var b = e.target.closest('[data-act="hint"]'); if (!b || !cur) return; S.hints[cur] = Math.min(3, (S.hints[cur] || 0) + 1); api.save(); paint(); });
  function stats(){ var f = 0, d = 0; a.labels.forEach(function(l){ if (S.done[l.id]) { d++; if (!(S.tries[l.id] > 0) && (S.hints[l.id] || 0) < 3) f++; } }); return { first:f, done:d, total:a.labels.length }; }
  paint();
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:a.summary + " (first try): " + s.first + "/" + s.total + (s.done < s.total ? " (unfinished)" : "") }; },
    missed:function(){ return a.labels.some(function(l){ return S.tries[l.id] > 0 || (S.hints[l.id] || 0) >= 3; }) ? MV.goalIdx(a.goal) : []; }
  };
}

// ---------- Practice 2: leaf investigations (N4 number entry, N7 select all, choice) ----------
function investigations(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", pick:{}, choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function parseVal(raw){
    var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Z²].*$/, "").replace(/[\s   ]/g, "");
    if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, "");
    var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
  }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
    else {
      h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
      if (it.kind === "num") {
        h += '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="lf-unit">' + it.unit + "</span></div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
      } else {
        h += '<div class="opts" role="group" aria-label="Options (select all that apply)">' + it.options.map(function(o, oi){
          var on = !!x.pick[oi], c = "opt sa-opt", good = MV.ok(o);
          if (x.checked) { if (on && good) c += " right"; else if (on && !good) c += " wrong"; else if (!on && good && x.solved) c += " right"; }
          return '<button type="button" class="' + c + '" role="checkbox" aria-checked="' + on + '" data-k="' + it.id + "o" + oi + '" data-oi="' + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>";
        }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.checked) {
          var lines = it.options.map(function(o, oi){ var on = !!x.pick[oi], good = MV.ok(o); if (on && !good) return "<p>✗ " + o.t + ": " + o.why + "</p>"; if (!on && good && !x.solved) return "<p>○ One more option belongs in your selection.</p>"; return ""; }).filter(Boolean);
          lines = lines.filter(function(l, k){ return lines.indexOf(l) === k; });
          h += x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + it.why + "</p></div>" : '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> Your selection isn’t right yet.</p>' + lines.join("") + "</div>";
        }
      }
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = item(box.dataset.li), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (it.kind === "mc" && b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (it.kind === "sel" && b.dataset.oi != null) { var oi = +b.dataset.oi; x.pick[oi] = !x.pick[oi]; x.checked = false; }
    else if (b.dataset.act === "check") {
      var ok = false;
      if (it.kind === "mc") { x.checked = true; ok = MV.ok(it.options[x.choice]); }
      else if (it.kind === "sel") { x.checked = true; ok = it.options.every(function(o, k){ return !!x.pick[k] === MV.ok(o); }); }
      else {
        var v = parseVal(x.val), ans = MV.ans(it), tol = it.tol || 1e-6;
        if (v == null) { msgs[it.id] = "Enter a number, such as 12, 0.5 or 3/4."; paintItem(it); return; }
        ok = Math.abs(v - ans) <= tol * Math.max(1, Math.abs(ans));
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return Math.abs(v - w.match) <= 1e-6 * Math.max(1, Math.abs(w.match)); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : "Check your working and try again."); }
        else msgs[it.id] = null;
      }
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else return;
    api.save(); paintItem(it); if (b.dataset.act === "check") MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: design a desert leaf ----------
var SC = { cut:{ thin:2, medium:1, thick:0 }, on:{ upper:1, lower:0, both:1 }, dens:{ low:0, medium:1, high:2 }, sizeW:{ small:0, medium:1, large:3 }, sizeP:{ small:0, medium:1, large:2 } };
function scores(d){
  var w = SC.cut[d.cut] + SC.on[d.on] + SC.dens[d.dens] + SC.sizeW[d.size] - (d.hairs === "yes" ? 1 : 0);
  return { water:Math.max(0, w), photo:+d.pal + SC.dens[d.dens] + SC.sizeP[d.size] };
}
var task = (function(){
  var api = null, T = null, DEF = { cut:"thin", on:"both", dens:"medium", pal:"1", size:"medium", hairs:"no" };
  function read(){ var s = api ? api.S : {}, d = {}; Object.keys(DEF).forEach(function(k){ d[k] = s[k] || DEF[k]; }); return d; }
  function draw(){
    var d = read(), sc = scores(d), dn = { low:120, medium:250, high:400 }[d.dens], sz = { small:0.55, medium:0.8, large:1.05 }[d.size];
    var leaf = miniLeafSVG({ t:0.13 + 0.09 * +d.pal, pal:+d.pal, up:d.on !== "lower" ? dn : 0, low:d.on !== "upper" ? dn : 0, cut:{ thin:1, medium:2, thick:4 }[d.cut], hairs:d.hairs === "yes" });
    var icon = '<g transform="translate(206 52) scale(' + sz + ')"><path class="lf-blade" d="M0 -40 C24 -26 26 12 0 40 C-26 12 -24 -26 0 -40 Z"/><line class="lf-vein" x1="0" y1="-36" x2="0" y2="46"/></g>';
    $("#dl-pv").innerHTML = '<svg viewBox="0 0 250 104" role="img" aria-label="' + MV.esc("Your leaf: " + d.cut + " cuticle, stomata on " + ({ upper:"the upper surface only", lower:"the lower surface only", both:"both surfaces" })[d.on] + ", " + d.dens + " density, " + d.pal + " palisade layer" + (d.pal === "1" ? "" : "s") + ", " + d.size + " size, " + (d.hairs === "yes" ? "hairs" : "no hairs") + ".") + '">' + leaf + icon + '<text class="lf-txt" x="206" y="101" text-anchor="middle">' + d.size + " leaf</text></svg>";
    $("#dl-m").innerHTML = '<div class="lf-meter"><span class="lf-meter-l">Water-loss score: <strong>' + sc.water + '</strong> <span class="muted">(aim: 2 or less)</span></span><span class="lf-meter-t"><i style="width:' + f1(sc.water / 8 * 100) + '%"></i><b class="lf-aim" style="left:' + f1(2 / 8 * 100) + '%"></b></span></div>' +
      '<div class="lf-meter"><span class="lf-meter-l">Photosynthesis score: <strong>' + sc.photo + '</strong> <span class="muted">(aim: 5 or more)</span></span><span class="lf-meter-t"><i style="width:' + f1(sc.photo / 7 * 100) + '%"></i><b class="lf-aim" style="left:' + f1(5 / 7 * 100) + '%"></b></span></div>';
  }
  function key(d){ return [d.cut, d.on, d.dens, d.pal, d.size, d.hairs].join("|"); }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      Object.keys(DEF).forEach(function(k){ if (!a.S[k]) a.S[k] = DEF[k]; });
      inp.innerHTML = '<div class="dl-inputs">' + T.inputs.map(function(x){ return '<div class="lf-row" id="dl-' + x.id + '"></div>'; }).join("") + "</div>";
      T.inputs.forEach(function(x){ radios($("#dl-" + x.id), { label:x.label, cls:"chips", options:x.options.map(function(o){ return { id:o[0], t:o[1] }; }), value:a.S[x.id], onChange:function(v){ a.S[x.id] = v; a.save(); draw(); a.update(); } }); });
      pv.innerHTML = '<div class="dl-pv" id="dl-pv"></div><div id="dl-m"></div><div class="dl-models">' + T.models.map(function(m){ return '<p class="tiny">' + m + "</p>"; }).join("") + "</div>";
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){ var st = MV.taskState(), g = $("#task-fb .fb.good"); if (g && st.found.length >= 7 && !$(".dl-all", g)) g.insertAdjacentHTML("beforeend", '<p class="dl-all">' + T.afterAll + "</p>"); }, 0); });
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var s = scores(d); return [s.water <= 2, s.photo >= 5, d.on === "lower", d.cut === "thick"]; },
    key:key,
    label:function(k){ var p = k.split("|"); return p[2] + " density, " + p[3] + " layer" + (p[3] === "1" ? "" : "s") + ", " + p[4] + ", " + (p[5] === "yes" ? "hairs" : "no hairs"); },
    text:function(k){ var p = k.split("|"); return p[0] + " cuticle, stomata on " + (p[1] === "both" ? "both surfaces" : p[1] + " surface only") + ", " + p[2] + " density, " + p[3] + " palisade layer" + (p[3] === "1" ? "" : "s") + ", " + p[4] + " leaf, " + (p[5] === "yes" ? "hairs" : "no hairs"); }
  };
})();

// ---------- hero: leaf → slice → cross-section swings toward you → labels → light → gases ----------
function hero(){
  var box = $("#lf-hero"); if (!box) return;
  var HL = [["Cuticle", 31, 20], ["Upper epidermis", 44, 46], ["Palisade mesophyll", 87, 88], ["Spongy mesophyll", 180, 178], ["Lower epidermis", 245, 236], ["Stoma", 250, 266]];
  var labels = HL.map(function(l, i){
    var y = l[2] + 6, lead = i === 5 ? sv("path", { d:"M276 252 L300 268 L378 " + f1(y - 5), "class":"lf-lead" }) : sv("path", { d:"M362 " + l[1] + " L378 " + f1(y - 5), "class":"lf-lead" });
    return '<g class="lf-h-lab" data-i="' + i + '">' + lead + sv("text", { x:384, y:y, "class":"lf-h-txt" }, l[0]) + "</g>";
  }).join("");
  box.innerHTML = '<svg class="lf-h-leaf" viewBox="0 0 560 320" aria-hidden="true" focusable="false"><g transform="translate(100 10)">' + mapleSVG() + "</g></svg>" +
    '<div class="lf-h-xs"><svg viewBox="0 0 560 320" aria-hidden="true" focusable="false">' + xsSVG({ open:60 }) + '<g class="lf-h-light"></g><g class="lf-h-toks"></g>' + labels + "</svg></div>";
  var leaf = $(".lf-h-leaf", box), xsw = $(".lf-h-xs", box), cut = $(".lf-h-leaf .lf-cutline", box), light = $(".lf-h-light", box), tokG = $(".lf-h-toks", box), labs = $$(".lf-h-lab", box);
  var r = MV.bio.rng("lf-hero");
  var T = [
    { gas:"co2", path:inPath(r, [r.pick(AIRPTS)[0], 190]), d:0 }, { gas:"co2", path:inPath(r, palPt(r)), d:0.18 }, { gas:"co2", path:inPath(r, palPt(r)), d:0.36 },
    { gas:"o2", path:inPath(r, palPt(r)).reverse(), d:0.1 }, { gas:"o2", path:inPath(r, spgPt(r)).reverse(), d:0.42 },
    { gas:"h2o", path:inPath(r, spgPt(r)).reverse(), d:0.26 }, { gas:"h2o", path:inPath(r, spgPt(r)).reverse(), d:0.5 }
  ];
  tokG.innerHTML = T.map(function(t){ return tokSVG(t.gas); }).join("");
  var kids = tokG.children;
  function toks(k){ T.forEach(function(t, i){ var p = clamp((k - t.d) / 0.5, 0, 1), pos = polyAt(t.path, p); kids[i].setAttribute("transform", "translate(" + f1(pos[0]) + "," + f1(pos[1]) + ")"); kids[i].setAttribute("opacity", p <= 0 ? 0 : f1(Math.min(1, p * 6, (1 - p) * 6) * 100) / 100); }); }
  function finalGas(){
    tokG.innerHTML = sv("path", { d:"M236 300 L258 266 M249 268 L259 264 L259 275", "class":"lf-dir lf-dir-s", style:"stroke:var(--bio-carbon)" }) + sv("path", { d:"M278 266 L300 300 M290 298 L301 302 L302 291", "class":"lf-dir lf-dir-s", style:"stroke:var(--bio-o2)" }) +
      [["co2", 222, 306], ["o2", 318, 290], ["h2o", 318, 309], ["co2", 268, 222], ["co2", 214, 196]].map(function(t){ return '<g transform="translate(' + t[1] + "," + t[2] + ')">' + tokSVG(t[0]).replace('opacity="0"', "") + "</g>"; }).join("");
  }
  function steps(list){ var i = 0; (function next(){ if (i >= list.length) return; var s = list[i++]; MV.tween({ dur:s.dur, ease:function(t){ return t; }, step:s.step, done:function(){ if (s.done) s.done(); next(); } }); })(); }
  var len = 256; cut.style.strokeDasharray = len; cut.style.strokeDashoffset = len;
  xsw.style.opacity = 0; labs.forEach(function(l){ l.style.opacity = 0; });
  steps([
    { dur:700, step:function(t){ leaf.style.opacity = t; leaf.style.transform = "scale(" + (0.85 + 0.15 * t) + ")"; } },
    { dur:650, step:function(t){ cut.style.strokeDashoffset = len * (1 - t); } },
    { dur:1000, step:function(t){ leaf.style.opacity = 1 - t; xsw.style.opacity = t; xsw.style.transform = "perspective(700px) rotateX(" + f1(78 * (1 - t)) + "deg)"; } },
    { dur:1300, step:function(t){ labs.forEach(function(l, i){ l.style.opacity = clamp(t * 6 - i, 0, 1); }); } },
    { dur:1100, step:function(t){ light.innerHTML = lightMarkup(100, t, [46, 118, 196]); } },
    { dur:4200, step:toks, done:finalGas }
  ]);
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ label:labelQuiz, investigations:investigations },
  task:task,
  onShow:function(v){ if (EXP) EXP.show(v === "explore"); }
});
})();
