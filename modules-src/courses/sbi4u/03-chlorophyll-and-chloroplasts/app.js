// SBI4U 03 Chlorophyll and Chloroplasts: hero (palisade cell → chloroplast → photosystem), Chloroplast zoom (S1 levels plus a
// photosystem simulator), "Where" (process sorter with molecule clips, endosymbiosis data), label quiz and photosystem puzzles
// (Practice), "Prove the chloroplasts did it" tube builder (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small SVG helpers ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "cz-txt", "text-anchor":anchor || null }, s); }
function fmt(v){ return MV.num(Math.round(v * 100) / 100); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
// sequential tweens: steps [{dur, step(t), end()}] -> cancel(). With reduced motion each step jumps to its end.
function chain(steps, done){
  var i = 0, cancel = null, live = true;
  (function next(){
    if (!live) return;
    if (i >= steps.length) { if (done) done(); return; }
    var s = steps[i++];
    cancel = MV.tween({ dur:s.dur, ease:s.ease || lin, step:s.step || function(){}, done:function(){ if (!live) return; if (s.end) s.end(); next(); } });
  })();
  return function(){ live = false; if (cancel) cancel(); };
}
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!segs.length) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
// photons: wavy arrows in ink (course plan §3)
function wavy(x1, y1, x2, y2){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, n = Math.max(2, Math.round(L / 2)), d = "";
  for (var i = 0; i <= n; i++) { var s = L * i / n, o = 3 * Math.sin(s / 9 * 2 * Math.PI) * Math.min(1, (L - s) / 7); d += (i ? "L" : "M") + f1(x1 + ux * s - uy * o) + " " + f1(y1 + uy * s + ux * o); }
  return d;
}
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function photonSVG(x1, y1, x2, y2, cls){ var L = Math.hypot(x2 - x1, y2 - y1) || 1; return L < 2 ? "" : sv("path", { d:wavy(x1, y1, x2, y2) + " " + head(x2, y2, (x2 - x1) / L, (y2 - y1) / L), "class":cls || "cz-photon" }); }
function arrowLine(pts, cls){
  var a = pts[pts.length - 2], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return sv("polyline", { points:pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":cls || "cz-track" }) + sv("path", { d:head(b[0], b[1], (b[0] - a[0]) / L, (b[1] - a[1]) / L, 5), "class":(cls || "cz-track") + " cz-head" });
}

// ---------- @component radioGroup (copied from SBI4U 01 / MHF4U 25: options may be disabled with dis:true) ----------
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

// ---------- @component S1 diagramExplorer (copied from SBI4U 01; a hotspot without tag:[x, y, align] gets its name tag at the
// centre of its first zone) — zoomable schematic SVG with native-button hotspots ----------
// diagramExplorer(host, { levels:[{ id, name, vb:[w, h], draw() -> SVG markup, aria() -> text for role="img",
//     hotspots:[{ id, label (accessible name of its button), zones:[[x, y, w, h], …] (viewBox units), tag:[x, y, "l"|"r"|"c"] }] }],
//   level:"id", onTap(id, levelId) })
// -> { level(), setLevel(id), select(id|null), selected(), marks({id:"good"|"bad"}), names({id:html}) (name tags at hs.tag),
//      tags([{x, y, html, align, cls}]) (free tags in viewBox units), over() (<g> above the drawing), svg(), setAria(text),
//      labels(fn(id) -> accessible name), refresh() }
// Buttons sit over the drawing in reading order (top to bottom) and grow to at least 24 × 24 px; smaller zones sit on top.
// A tap on the picture that misses every button falls back to the shape under the pointer (data-hs), then the nearest zone.
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
    hsBox.setAttribute("aria-label", "Structures in the " + MV.plain(lv.name).toLowerCase() + " view");
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

// ---------- drawings (every zoom level is 400 × 270 viewBox units) ----------
function ys(g){ var a = []; for (var i = 0; i < g.n; i++) a.push(g.y0 + i * (g.h + g.gap)); return a; }
// a thylakoid bridge (stroma lamella): membrane outline with lumen inside, round ends
function band(x1, y1, x2, y2, w){ return sv("line", { x1:x1, y1:y1, x2:x2, y2:y2, "class":"cz-lam-o", "stroke-width":w + 2.6 }) + sv("line", { x1:x1, y1:y1, x2:x2, y2:y2, "class":"cz-lam-i", "stroke-width":w }); }
function dnaLoop(cx, cy, r){ var d = ""; for (var k = 0; k <= 48; k++) { var a = k / 48 * 2 * Math.PI, rr = r + 2.6 * Math.sin(5 * a) + 1.2 * Math.sin(9 * a + 1); d += (k ? "L" : "M") + f1(cx + rr * Math.cos(a)) + " " + f1(cy + rr * 0.8 * Math.sin(a)); } return d + "Z"; }

// palisade cell
function cellSVG(){
  var h = "", i, g = "";
  [[8, 124], [276, 392]].forEach(function(x, s){ h += sv("rect", { x:x[0], y:10, width:x[1] - x[0], height:250, rx:24, "class":"cz-tis cz-faint" }); for (i = 0; i < 8; i++) h += sv("ellipse", { cx:s ? 286 : 114, cy:32 + i * 29, rx:4, ry:9, "class":"cz-chl cz-faint" }); });
  h += sv("rect", { x:135.5, y:6.5, width:129, height:257, rx:26, "class":"cz-wall", "data-hs":"wall" });
  h += sv("rect", { x:141, y:12, width:118, height:246, rx:21, "class":"cz-pm" });
  h += sv("rect", { x:170, y:48, width:62, height:174, rx:28, "class":"cz-vac", "data-hs":"vacuole" });
  h += sv("g", { "data-hs":"nucleus" }, sv("ellipse", { cx:152, cy:135, rx:9.5, ry:18, "class":"cz-nuc" }) + sv("circle", { cx:153, cy:131, r:3.2, "class":"cz-nucl" }));
  function cp(x, y, v){ return sv("ellipse", { cx:x, cy:y, rx:v ? 4.6 : 9, ry:v ? 9 : 4.6, "class":"cz-chl" }) + sv("line", v ? { x1:x, y1:y - 5, x2:x, y2:y + 5, "class":"cz-gran" } : { x1:x - 5, y1:y, x2:x + 5, y2:y, "class":"cz-gran" }); }
  for (i = 0; i < 11; i++) g += cp(248, 30 + i * 21, true);
  [32, 54, 76, 194, 216, 238].forEach(function(y){ g += cp(150, y, true); });
  [177, 199, 221].forEach(function(x){ g += cp(x, 25, false) + cp(x, 245, false); });
  return h + sv("g", { "data-hs":"chloro" }, g);
}
// chloroplast: double envelope, stroma, three grana (the middle one drawn larger, cut open), lamellae, starch, DNA, ribosomes
var G1 = { x:52, w:60, n:6, h:9, gap:2.5, y0:91 }, G2 = { x:160, w:80, n:4, h:18, gap:5, y0:80.5 }, G3 = { x:288, w:60, n:6, h:9, gap:2.5, y0:91 };
var LAM = [[110, 95.5, 162, 112.5], [110, 153, 162, 135.5], [238, 112.5, 290, 95.5], [238, 135.5, 290, 153]];
var RIB = [[196, 54], [206, 49], [216, 57], [226, 51], [202, 63], [221, 64], [236, 59]], RIBS = [[70, 72], [118, 172], [330, 180], [300, 66], [176, 198], [250, 200]];
function chloroSVG(){
  var h = sv("ellipse", { cx:200, cy:124, rx:192, ry:114, "class":"cz-env", "data-hs":"outer" });
  h += sv("ellipse", { cx:200, cy:124, rx:176, ry:98, "class":"cz-stroma", "data-hs":"stroma" });
  h += sv("ellipse", { cx:200, cy:124, rx:176, ry:98, "class":"cz-envi", "data-hs":"inner" });
  h += sv("g", { "data-hs":"lamella" }, LAM.map(function(l){ return band(l[0], l[1], l[2], l[3], 3.4); }).join(""));
  [G1, G2, G3].forEach(function(g, gi){ h += sv("g", { "data-hs":gi === 1 ? "thylakoid" : "granum" }, ys(g).map(function(y){ return sv("rect", { x:g.x, y:y, width:g.w, height:g.h, rx:g.h / 2, "class":"cz-thy" + (gi === 1 ? " cz-thy-m" : "") }); }).join("")); });
  h += sv("ellipse", { cx:118, cy:192, rx:22, ry:11, "class":"cz-starch", "data-hs":"starch" });
  h += sv("path", { d:dnaLoop(285, 192, 10), "class":"cz-dna", "data-hs":"dna" });
  h += sv("g", { "data-hs":"ribosome" }, RIB.map(function(p){ return sv("circle", { cx:p[0], cy:p[1], r:2.4, "class":"cz-ribo" }); }).join(""));
  h += RIBS.map(function(p){ return sv("circle", { cx:p[0], cy:p[1], r:2.4, "class":"cz-ribo" }); }).join("");
  h += sv("line", { x1:12, y1:259, x2:88.8, y2:259, "class":"cz-scale" }) + txt(94, 263, "1 µm", "cz-txt-s") + txt(390, 263, "≈ 5 µm long", "cz-txt-s", "end");
  return h;
}
// granum (side view), lamellae leaving it, a brace marking the stack
var GR = { x:80, w:240, h:30, gap:8, n:5, y0:22 }, GLAM = [[84, 75, -6, 120], [316, 151, 406, 106], [84, 189, -6, 234]];
function granumSVG(){
  var h = sv("rect", { x:0, y:0, width:400, height:270, "class":"cz-stroma", "data-hs":"stroma" });
  h += sv("g", { "data-hs":"lamella" }, GLAM.map(function(l){ return band(l[0], l[1], l[2], l[3], 13); }).join(""));
  var s = "";
  ys(GR).forEach(function(y){
    s += sv("rect", { x:GR.x, y:y, width:GR.w, height:GR.h, rx:15, "class":"cz-thy cz-thy-g" });
    for (var x = GR.x + 22; x < GR.x + GR.w - 16; x += 18) s += sv("circle", { cx:x, cy:y, r:2.1, "class":"cz-pig" }) + sv("circle", { cx:x + 9, cy:y + GR.h, r:2.1, "class":"cz-pig" });
  });
  h += sv("g", { "data-hs":"thylakoid" }, s);
  return h + sv("path", { d:"M327 22 q 9 0 9 10 v 71 q 0 10 9 10 q -9 0 -9 10 v 71 q 0 10 -9 10", "class":"cz-brace", "data-hs":"granum" });
}
// thylakoid membrane: bilayer between stroma (top) and lumen (bottom), two photosystems built in
function memSVG(){
  var h = sv("rect", { x:0, y:0, width:400, height:92, "class":"cz-stroma", "data-hs":"stroma" }) + sv("rect", { x:0, y:178, width:400, height:92, "class":"cz-lumen", "data-hs":"lumen" });
  h += sv("rect", { x:0, y:92, width:400, height:86, "class":"cz-core", "data-hs":"tmem" });
  function lipid(x, y, d){ return sv("line", { x1:x - 1.6, y1:y + d * 4, x2:x - 1.6, y2:y + d * 34, "class":"cz-lt" }) + sv("line", { x1:x + 1.6, y1:y + d * 4, x2:x + 1.6, y2:y + d * 34, "class":"cz-lt" }) + sv("circle", { cx:x, cy:y, r:4.2, "class":"cz-head" }); }
  var g = "";
  for (var x = 5; x < 400; x += 10) { if ((x > 60 && x < 180) || (x > 230 && x < 350)) continue; g += lipid(x, 98, 1) + lipid(x, 172, -1); }
  h += sv("g", { "data-hs":"tmem" }, g);
  [120, 290].forEach(function(cx){
    var p = sv("rect", { x:cx - 54, y:78, width:108, height:114, rx:30, "class":"cz-psb" });
    for (var i = 0; i < 10; i++) { var a = i * 36 * Math.PI / 180; p += sv("circle", { cx:cx + 30 * Math.cos(a), cy:135 + 30 * Math.sin(a), r:5, "class":"cz-pa" }); }
    p += sv("circle", { cx:cx - 6.5, cy:135, r:6.5, "class":"cz-rc" }) + sv("circle", { cx:cx + 6.5, cy:135, r:6.5, "class":"cz-rc" });
    h += sv("g", { "data-hs":"ps" }, p);
  });
  return h + txt(10, 20, "stroma side") + txt(10, 262, "lumen side");
}
// chlorophyll molecule: four small rings around Mg, the side group that differs (a: CH₃, b: CHO), the long tail in the membrane
function molSVG(isB){
  var P = [[140, 52, 90], [180, 92, 180], [140, 132, 270], [100, 92, 0]], h = "";
  var V = P.map(function(p){ var v = []; for (var k = 0; k < 5; k++) { var a = (p[2] + k * 72) * Math.PI / 180; v.push([p[0] + 16 * Math.cos(a), p[1] + 16 * Math.sin(a)]); } return v; });
  h += sv("rect", { x:0, y:150, width:400, height:120, "class":"cz-core" }) + sv("line", { x1:0, y1:150, x2:400, y2:150, "class":"cz-mline" }) + txt(392, 262, "thylakoid membrane (oily core)", "cz-txt-s", "end");
  // tail: ester link, then a zigzag hydrocarbon chain with methyl branches
  var t = "M" + f1(V[2][3][0]) + " " + f1(V[2][3][1]) + " L122 158 L134 170", br = "";
  for (var j = 1; j <= 21; j++) { var x = 134 + 12 * j, y = 170 + (j % 2 ? 7 : 0) + j * 1.2; t += " L" + f1(x) + " " + f1(y); if (j % 4 === 0) br += "M" + f1(x) + " " + f1(y) + " L" + f1(x) + " " + f1(y - 9) + " "; }
  h += sv("g", { "data-hs":"tail" }, sv("path", { d:t, "class":"cz-bond" }) + sv("path", { d:br, "class":"cz-bond" }));
  // bridges between neighbouring small rings
  var g = "";
  [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(function(pr){
    var A = P[pr[0]], B = P[pr[1]];
    function near(vs, c){ return vs.slice().sort(function(p, q){ return Math.hypot(p[0] - c[0], p[1] - c[1]) - Math.hypot(q[0] - c[0], q[1] - c[1]); })[0]; }
    var va = near(V[pr[0]], B), vb = near(V[pr[1]], A), mx = (va[0] + vb[0]) / 2, my = (va[1] + vb[1]) / 2, L = Math.hypot(mx - 140, my - 92);
    g += sv("path", { d:"M" + f1(va[0]) + " " + f1(va[1]) + " L" + f1(mx + (mx - 140) / L * 5) + " " + f1(my + (my - 92) / L * 5) + " L" + f1(vb[0]) + " " + f1(vb[1]), "class":"cz-bond" });
  });
  V.forEach(function(v){ g += sv("polygon", { points:v.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":"cz-pent" }); });
  V.forEach(function(v){ g += sv("line", { x1:v[0][0], y1:v[0][1], x2:lerp(v[0][0], 140, 0.55), y2:lerp(v[0][1], 92, 0.55), "class":"cz-bond" }); });
  V.forEach(function(v){ g += sv("circle", { cx:v[0][0], cy:v[0][1], r:5.6, "class":"cz-atom" }) + txt(v[0][0], v[0][1] + 3.4, "N", "cz-atxt", "middle"); });
  h += sv("g", { "data-hs":"ring" }, g);
  h += sv("g", { "data-hs":"mg" }, sv("circle", { cx:140, cy:92, r:10.5, "class":"cz-mg" }) + txt(140, 96, "Mg", "cz-atxt cz-mgt", "middle"));
  h += sv("g", { "data-hs":"group" }, sv("rect", { x:203, y:40, width:54, height:28, rx:6, "class":"cz-grpbox" }) + sv("line", { x1:V[1][2][0], y1:V[1][2][1], x2:210, y2:60, "class":"cz-bond" }) + txt(213, 59, isB ? "CHO" : "CH₃", "cz-gtxt"));
  return h + sv("text", { x:12, y:24, "class":"cz-txt-b" }, 'Chlorophyll <tspan font-style="italic">' + (isB ? "b" : "a") + "</tspan>");
}
// hotspot zones (and name-tag anchors) per zoom level
var ZONES = {
  cell:{ chloro:{ zones:[[240, 18, 16, 236], [142, 22, 16, 64], [142, 184, 16, 64], [166, 17, 66, 16], [166, 237, 66, 16]], tag:[236, 135, "r"] },
    nucleus:{ zones:[[142, 116, 21, 38]] }, vacuole:{ zones:[[170, 48, 62, 174]] }, wall:{ zones:[[150, 0, 100, 10], [150, 260, 100, 10]], tag:[200, 12, "c"] } },
  chloro:(function(){
    var z = { outer:{ zones:[[140, 0, 120, 14], [140, 234, 120, 14]], tag:[200, 243, "c"] }, inner:{ zones:[[140, 24, 120, 10], [140, 216, 120, 10]], tag:[200, 31, "c"] },
      stroma:{ zones:[[24, 36, 352, 176]], tag:[100, 62, "c"] }, granum:{ zones:[[G1.x, G1.y0, G1.w, 67], [G3.x, G3.y0, G3.w, 67]], tag:[318, 124, "c"] },
      thylakoid:{ zones:[], tag:[240, 72, "l"] }, lumen:{ zones:[], tag:[200, 158.5, "c"] },
      lamella:{ zones:LAM.map(function(l){ return [(l[0] + l[2]) / 2 - 12, (l[1] + l[3]) / 2 - 6, 24, 12]; }), tag:[136, 104, "c"] },
      dna:{ zones:[[272, 179, 26, 26]] }, ribosome:{ zones:[[190, 44, 52, 24]], tag:[215, 56, "c"] }, starch:{ zones:[[96, 181, 44, 22]] } };
    ys(G2).forEach(function(y){ z.thylakoid.zones.push([G2.x, y, 16, G2.h], [G2.x + G2.w - 16, y, 16, G2.h]); z.lumen.zones.push([G2.x + 20, y + 4, G2.w - 40, G2.h - 8]); });
    return z;
  })(),
  granum:(function(){
    var z = { thylakoid:{ zones:[], tag:[95, 37, "c"] }, tmem:{ zones:[], tag:[200, 60, "c"] }, lumen:{ zones:[], tag:[200, 113, "c"] }, granum:{ zones:[[324, 20, 24, 186]], tag:[318, 113, "r"] },
      lamella:{ zones:GLAM.map(function(l){ return [lerp(l[0], l[2], 0.66) - 22, lerp(l[1], l[3], 0.66) - 12, 44, 24]; }) }, stroma:{ zones:[[0, 0, 400, 270]], tag:[40, 250, "c"] } };
    ys(GR).forEach(function(y){ z.thylakoid.zones.push([GR.x, y, 30, GR.h], [GR.x + GR.w - 30, y, 30, GR.h]); z.tmem.zones.push([GR.x + 40, y - 4, GR.w - 80, 8]); z.lumen.zones.push([GR.x + 40, y + 9, GR.w - 80, 14]); });
    return z;
  })(),
  mem:{ tmem:{ zones:[[0, 94, 62, 82], [178, 94, 54, 82], [348, 94, 52, 82]], tag:[205, 135, "c"] }, ps:{ zones:[[66, 78, 108, 114], [236, 78, 108, 114]], tag:[120, 70, "c"] },
    chl:{ zones:[[86, 108, 20, 20], [256, 108, 20, 20]], tag:[96, 100, "c"] }, stroma:{ zones:[[0, 0, 400, 76]], tag:[200, 40, "c"] }, lumen:{ zones:[[0, 196, 400, 74]], tag:[200, 232, "c"] } },
  mol:{ ring:{ zones:[[124, 36, 32, 32], [164, 76, 32, 32], [124, 116, 32, 32], [84, 76, 32, 32]], tag:[60, 60, "c"] }, mg:{ zones:[[130, 82, 20, 20]], tag:[140, 70, "c"] },
    tail:{ zones:[[140, 160, 124, 40], [264, 170, 124, 40]], tag:[300, 228, "c"] }, group:{ zones:[[202, 38, 58, 30]], tag:[392, 22, "r"] } }
};
var DRAW = { cell:cellSVG, chloro:chloroSVG, granum:granumSVG, mem:memSVG };
var ARIA = {
  cell:"One palisade cell: cell wall, a nucleus near one side, a large central vacuole, and many chloroplasts along the wall.",
  chloro:"A chloroplast about 5 µm long: a double envelope (outer and inner membranes) around the stroma. Three grana (stacks of thylakoids), the middle one drawn larger, are joined by thin stroma lamellae. A starch grain, a loop of chloroplast DNA and small ribosomes sit in the stroma.",
  granum:"A granum seen from the side: five thylakoids stacked up, each a flattened sac whose membrane encloses a lumen. Stroma lamellae leave the stack; stroma all around.",
  mem:"A stretch of thylakoid membrane, a lipid bilayer, with the stroma above and the lumen below. Two photosystems are built into it, each holding many chlorophyll molecules.",
  mol:"A chlorophyll molecule: a ring made of four smaller rings, with a magnesium atom at its centre held by four nitrogen atoms; one side group on the ring; and a long hydrocarbon tail running into the oily core of the membrane."
};

// ---------- @component photosystemSim — antenna rings around a reaction centre + acceptor (psSVG), rate model, fixed hop paths
// per photon colour (hopPath), and a single-photon run with energy-hop flashes, an electron dot or a red glow (photonRun) ----------
// Rate model (plan): photons captured = antenna × light factor; electrons sent = min(captured, 100), 0 if blocked; lost = captured − sent.
var LF = { low:0.25, mod:0.5, high:1 }, LN = { low:"Low", mod:"Moderate", high:"High" };
function rate(light, ant, acc){ var cap = ant * LF[light], sent = acc === "work" ? Math.min(cap, 100) : 0; return { cap:cap, sent:sent, lost:cap - sent, busy:Math.round(sent) }; }
// Antenna drawing: one dot = 10 pigments, rings of 8, 14 and 18 around the reaction centre; type a / b / c (carotenoid).
var PSC = [200, 140], ACC = { x:226, y:131, w:24, h:18 };
var RINGS = [{ r:58, m:8, off:22.5, ty:"aabaaaba" }, { r:86, m:14, off:0, ty:"abcabaabcababa" }, { r:114, m:18, off:10, ty:"bcbabcbbacbcbabcba" }];
function pigs(ant){
  var n = Math.round(ant / 10), out = [], before = 0;
  RINGS.forEach(function(R, ri){
    var k = clamp(n - before, 0, R.m); before += R.m;
    for (var j = 0; j < k; j++) { var deg = (R.off + j * 360 / k) % 360, a = deg * Math.PI / 180; out.push({ x:PSC[0] + R.r * Math.cos(a), y:PSC[1] + R.r * Math.sin(a), ring:ri, j:j, k:k, ty:R.ty.charAt(Math.floor(j * R.m / k)), ang:deg }); }
  });
  return out;
}
// Fixed hop pattern per photon chip (replays are identical): start on the outermost ring near the top-left; 450 nm (chlorophyll b)
// adds one sideways hop, the rare absorbed 550 nm photon two; then one hop inward per ring, then the reaction centre.
function hopPath(nm, ant){
  var P = pigs(ant); if (!P.length) return null;
  var outer = Math.max.apply(null, P.map(function(p){ return p.ring; })), ring = P.filter(function(p){ return p.ring === outer; });
  var want = nm === 680 ? "a" : "b", cand = ring.filter(function(p){ return p.ty === want; });
  if (!cand.length) cand = ring;
  function ad(a, b){ var d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
  var cur = cand.slice().sort(function(p, q){ return ad(p.ang, 225) - ad(q.ang, 225); })[0], path = [cur], lat = nm === 450 ? 1 : nm === 550 ? 2 : 0;
  for (var i = 0; i < lat && ring.length > 1; i++) { var c0 = cur; cur = ring.filter(function(p){ return p.j === (c0.j + 1) % c0.k; })[0]; path.push(cur); }
  for (var r = outer - 1; r >= 0; r--) { var c1 = cur; cur = P.filter(function(p){ return p.ring === r; }).sort(function(p, q){ return Math.hypot(p.x - c1.x, p.y - c1.y) - Math.hypot(q.x - c1.x, q.y - c1.y); })[0]; path.push(cur); }
  path.push({ x:PSC[0], y:PSC[1], rc:true });
  return path;
}
function pigDot(p){
  if (p.ty === "c") return sv("path", { d:"M" + f1(p.x) + " " + f1(p.y - 6.5) + " L" + f1(p.x + 6) + " " + f1(p.y) + " L" + f1(p.x) + " " + f1(p.y + 6.5) + " L" + f1(p.x - 6) + " " + f1(p.y) + "Z", "class":"cz-pc" });
  return sv("circle", { cx:p.x, cy:p.y, r:6, "class":p.ty === "a" ? "cz-pa" : "cz-pb" });
}
function glowSVG(gid, k){
  if (k <= 0) return "";
  return sv("circle", { cx:200, cy:140, r:40, fill:"url(#" + gid + ")", opacity:f1(clamp(k, 0, 1) * 100) / 100 }) +
    [186, 200, 214].map(function(x){ return sv("path", { d:wavy(x, 124, x, 104), "class":"cz-heat", opacity:f1(clamp(k, 0, 1) * 100) / 100 }); }).join("") +
    (k > 0.3 ? txt(200, 98, "heat", "cz-txt-s cz-halo-t", "middle") + txt(200, 183, "red glow (fluorescence)", "cz-txt-s cz-halo-t", "middle") : "");
}
// static photosystem: o = {gid, ant, acc, view:"photon"|"rate", light, r (rate result), labels, ov (overlay markup)}
function psSVG(o){
  var h = '<defs><radialGradient id="' + o.gid + '"><stop offset="0" style="stop-color:var(--red);stop-opacity:.8"/><stop offset=".55" style="stop-color:var(--red);stop-opacity:.35"/><stop offset="1" style="stop-color:var(--red);stop-opacity:0"/></radialGradient></defs>';
  h += sv("circle", { cx:200, cy:140, r:131, "class":"cz-psdisc" });
  if (o.view === "rate") { var n = { low:1, mod:2, high:4 }[o.light]; for (var i = 0; i < n; i++) h += photonSVG(14 + i * 22, 6, 52 + i * 22, 44); }
  if (o.labels) h += sv("path", { d:"M246 131 L332 26", "class":"cz-lead" }) + txt(392, 18, "primary electron acceptor", "cz-txt-s", "end") ;
  h += pigs(o.ant).map(pigDot).join("");
  if (o.view === "rate" && o.r) {
    var b = o.r.busy / 100;
    if (b > 0) h += b >= 1 ? sv("circle", { cx:200, cy:140, r:20, "class":"cz-busy" }) : sv("path", { d:"M200 120 A20 20 0 " + (b > 0.5 ? 1 : 0) + " 1 " + f1(200 + 20 * Math.sin(b * 2 * Math.PI)) + " " + f1(140 - 20 * Math.cos(b * 2 * Math.PI)), "class":"cz-busy" });
    if (o.r.lost > 0) h += glowSVG(o.gid, 0.35 + 0.65 * o.r.lost / o.r.cap);
  }
  h += sv("circle", { cx:191, cy:140, r:9, "class":"cz-rc" }) + sv("circle", { cx:209, cy:140, r:9, "class":"cz-rc" });
  h += sv("rect", { x:ACC.x, y:ACC.y, width:ACC.w, height:ACC.h, rx:4, "class":"cz-acc" + (o.acc === "block" ? " off" : "") });
  if (o.acc === "block") h += sv("path", { d:"M" + (ACC.x + 3) + " " + (ACC.y + 3) + " L" + (ACC.x + ACC.w - 3) + " " + (ACC.y + ACC.h - 3) + " M" + (ACC.x + ACC.w - 3) + " " + (ACC.y + 3) + " L" + (ACC.x + 3) + " " + (ACC.y + ACC.h - 3), "class":"cz-x" });
  if (o.labels) h += txt(8, 18, "antenna (each dot = 10 pigments)", "cz-txt-s") + txt(200, 165, "reaction centre", "cz-txt-s cz-halo-t", "middle");
  return h + '<g class="cz-ov">' + (o.ov || "") + "</g>";
}
// overlay frame for a single photon: F = {ph:[x1, y1, x2, y2], phLab, trail:[pts], halo:{x, y, r, o}, rc, e:[x, y], glow, note, done}
function ovSVG(F, gid){
  var h = "";
  if (F.glow) h += glowSVG(gid, F.glow);
  if (F.trail && F.trail.length > 1) {
    var pts = F.trail.map(function(p){ return f1(p.x) + "," + f1(p.y); }).join(" ");
    h += sv("polyline", { points:pts, "class":"cz-trail-u" }) + sv("polyline", { points:pts, "class":"cz-trail" });
    if (F.done) for (var i = 1; i < F.trail.length; i++) { var a = F.trail[i - 1], b = F.trail[i], L = Math.hypot(b.x - a.x, b.y - a.y) || 1, ux = (b.x - a.x) / L, uy = (b.y - a.y) / L, s = b.rc ? 13 : 8; h += sv("path", { d:head(b.x - ux * s, b.y - uy * s, ux, uy, 5), "class":"cz-trail-h" }); }
  }
  if (F.ph) h += photonSVG(F.ph[0], F.ph[1], F.ph[2], F.ph[3]) + (F.phLab ? txt(F.ph[0] + 6, F.ph[1] + 16, F.phLab, "cz-txt-s cz-halo-t") : "");
  if (F.halo) h += sv("circle", { cx:F.halo.x, cy:F.halo.y, r:F.halo.r, "class":"cz-halo", opacity:F.halo.o });
  if (F.rc) h += sv("ellipse", { cx:200, cy:140, rx:19 + 9 * F.rc, ry:12 + 9 * F.rc, "class":"cz-halo", opacity:f1(F.rc * 90) / 100 });
  if (F.e) {
    if (F.done) h += sv("path", { d:"M211 140 L" + f1(F.e[0] - 7) + " 140 " + head(F.e[0] - 7, 140, 1, 0, 4), "class":"cz-earrow" });
    h += sv("circle", { cx:F.e[0], cy:F.e[1], r:5.2, "class":"cz-e" }) + txt(F.e[0], F.e[1] - 9, "e⁻", "cz-etxt cz-halo-t", "middle");
  }
  if (F.note) h += txt(F.note[0], F.note[1], F.note[2], "cz-txt-b cz-halo-t", "middle");
  if (F.done && F.trail && F.trail.length > 1) { var m = F.trail[Math.min(1, F.trail.length - 1)]; h += txt(m.x - 8, m.y - 12, "energy", "cz-txt-s cz-halo-t", "end"); }
  return h;
}
// animate one photon: o = {gid, nm, pass, path, blocked, hop (ms per hop), from:[x, y], exit:[x, y], draw(html)} -> cancel()
function photonRun(o, done){
  var F = {}, draw = function(){ o.draw(ovSVG(F, o.gid)); }, steps = [];
  var fx = o.from, tx = o.pass ? o.exit : [o.path[0].x, o.path[0].y];
  steps.push({ dur:o.pass ? 1300 : 700, step:function(t){ F.ph = [fx[0], fx[1], lerp(fx[0], tx[0], t), lerp(fx[1], tx[1], t)]; F.phLab = o.nm + " nm"; draw(); } });
  if (o.pass) steps.push({ dur:200, step:function(){ F.note = [tx[0] - 40, tx[1] - 14, "not absorbed"]; F.done = true; draw(); } });
  else {
    steps.push({ dur:260, step:function(t){ F.halo = { x:tx[0], y:tx[1], r:4 + 8 * t, o:0.95 }; F.trail = [o.path[0]]; draw(); } });
    o.path.slice(1).forEach(function(b, k){
      var a = o.path[k];
      steps.push({ dur:o.hop, step:function(t){ var x = lerp(a.x, b.x, t), y = lerp(a.y, b.y, t); F.halo = { x:x, y:y, r:b.rc && t > 0.8 ? 14 : 11, o:0.95 }; F.trail = o.path.slice(0, k + 1).concat([{ x:x, y:y, rc:b.rc && t >= 1 }]); draw(); } });
    });
    steps.push({ dur:380, step:function(t){ F.halo = null; F.rc = 0.4 + 0.6 * t; draw(); } });
    if (!o.blocked) steps.push({ dur:520, step:function(t){ F.rc = 1 - 0.7 * t; F.e = [lerp(209, ACC.x + ACC.w / 2, t), 140]; draw(); } });
    else steps.push({ dur:800, step:function(t){ F.rc = 1 - 0.6 * t; F.glow = t; draw(); } });
    steps.push({ dur:0, step:function(){ F.done = true; F.ph = null; F.trail = o.path; draw(); } });
  }
  draw();
  return chain(steps, done);
}
var PIGN = { a:"chlorophyll <i>a</i>", b:"chlorophyll <i>b</i>", c:"a carotenoid" };

// ---------- Explore: Chloroplast zoom (S1 levels + photosystem simulator) ----------
function explore(host, api){
  var C = api.content, HSD = C.hotspots, S = api.S;
  var D = { mode:"zoom", lvl:"cell", sel:null, chlb:false, path:[], tube:false, lit:0, psv:"photon", nm:450, light:"mod", ant:300, acc:"work", last:null, saved:{}, n550:0 };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  var anim = null, pend = null, busy = false, antShow = null, ovHTML = "", saveMsg = "", readSig = "";
  var PP = [2, 5, 0, 4, 3, 1].map(function(i){ return C.pathParts[i]; });       // shown out of the answer order
  var PN = {}; C.pathParts.forEach(function(p){ PN[p[0]] = p[1]; });
  host.innerHTML = '<div class="pg cz-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="cz-tube"></div><div id="cz-dx"></div>' +
    '<div id="cz-psbox" hidden><div class="cz-stage"><svg id="cz-ps" viewBox="0 0 400 270" role="img" focusable="false"></svg></div>' +
    '<p class="cz-legend tiny"><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" class="cz-pa"/></svg>chlorophyll <i>a</i></span><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" class="cz-pb"/></svg>chlorophyll <i>b</i></span><span><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1 L13 7 L7 13 L1 7Z" class="cz-pc"/></svg>carotenoid</span><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" class="cz-e"/></svg>electron</span></p></div>' +
    '<p class="cz-cap" id="cz-cap"></p><div class="cz-path" id="cz-path"></div></div>' +
    '<div class="pg-ctrl"><div class="cz-row" id="cz-mode"></div>' +
      '<div class="cz-panel" id="cz-zp"><div class="cz-row" id="cz-lv"></div><div class="cz-row" id="cz-ab"></div></div>' +
      '<div class="cz-panel" id="cz-pp"><div class="cz-row" id="cz-psv"></div>' +
        '<div class="cz-sub" id="cz-photon"><div class="cz-row" id="cz-nm"></div><div class="q-actions cz-fire"><button type="button" class="btn primary sm" id="cz-fire" data-k="czfire">Fire</button></div></div>' +
        '<div class="cz-sub" id="cz-ratep"><div class="cz-row" id="cz-light"></div></div>' +
        '<label class="slider cz-sl"><span class="slider-top"><span>Antenna size</span><output id="cz-ant-out" for="cz-ant"></output></span><input type="range" id="cz-ant" min="0" max="400" step="50"></label>' +
        '<div class="cz-row" id="cz-acc"></div>' +
        '<div class="cz-save" id="cz-save"></div>' +
        '<p class="tiny muted cz-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>" +
    '<div class="pg-read"><dl class="read" id="cz-read" aria-live="polite"></dl><div id="cz-meters" aria-hidden="true"></div></div></div>';

  var ZN = { cell:ZONES.cell, chloro:ZONES.chloro, granum:ZONES.granum, mem:ZONES.mem, mol:ZONES.mol };
  function hsList(l){ return Object.keys(ZN[l]).map(function(id){ return { id:id, label:MV.plain(HSD[id].name), zones:ZN[l][id].zones, tag:ZN[l][id].tag }; }); }
  var levels = C.levels.map(function(l){ return { id:l[0], name:l[1], vb:[400, 270], draw:l[0] === "mol" ? function(){ return molSVG(S.chlb); } : DRAW[l[0]], aria:function(){ return ARIA[l[0]] + (l[0] === "mol" ? " This is chlorophyll " + (S.chlb ? "b: the side group is −CHO." : "a: the side group is −CH₃.") : ""); }, hotspots:hsList(l[0]) }; });
  var dx = diagramExplorer($("#cz-dx"), { levels:levels, level:S.lvl, onTap:function(id){ S.sel = id; dx.select(id); api.save(); paint(); MV.changed(); } });

  // controls
  var modeR = radios($("#cz-mode"), { label:"Mode", options:[{ id:"zoom", t:"Zoom" }, { id:"ps", t:"Photosystem" }], value:S.mode, onChange:function(m){ stop(); S.mode = m; changed(); } });
  var lvR = radios($("#cz-lv"), { label:"Zoom level", aria:"Zoom level", cls:"chips cz-crumbs", options:C.levels.map(function(l){ return { id:l[0], t:l[1] }; }), value:S.lvl, onChange:function(v){ S.lvl = v; dx.setLevel(v); dx.select(S.sel); changed(); } });
  var abR = radios($("#cz-ab"), { label:"Molecule", cls:"chips", options:[{ id:"a", t:"Chlorophyll <i>a</i>" }, { id:"b", t:"Chlorophyll <i>b</i>" }], value:S.chlb ? "b" : "a", onChange:function(v){ S.chlb = v === "b"; dx.refresh(); dx.select(S.sel); changed(); } });
  var psvR = radios($("#cz-psv"), { label:"Show", options:[{ id:"photon", t:"Single photon" }, { id:"rate", t:"Rate" }], value:S.psv, onChange:function(v){ stop(); S.psv = v; changed(); } });
  var nmR = radios($("#cz-nm"), { label:"Photon", cls:"chips", options:[450, 550, 680].map(function(n){ return { id:n, t:n + " nm" }; }), value:S.nm, onChange:function(v){ stop(); S.nm = +v; changed(); } });
  var lightR = radios($("#cz-light"), { label:"Light level", cls:"chips", options:["low", "mod", "high"].map(function(k){ return { id:k, t:LN[k] }; }), value:S.light, onChange:function(v){ stop(); S.light = v; changed(); } });
  var accR = radios($("#cz-acc"), { label:"Acceptor", options:[{ id:"work", t:"Working" }, { id:"block", t:"Blocked" }], value:S.acc, onChange:function(v){ stop(); S.acc = v; changed(); } });
  var antIn = $("#cz-ant");
  antIn.addEventListener("input", function(){ stop(); S.ant = +antIn.value; changed(); });
  $("#cz-fire").addEventListener("click", function(){ if (!busy) fire({}); });
  $("#cz-save").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.sv === "save") { if (S.light === "mod") saveMsg = "Choose Low light (shade leaves) or High light (sun leaves) first, then save."; else { S.saved[S.light] = { ant:S.ant, acc:S.acc }; saveMsg = ""; } }
    else { S.saved = {}; saveMsg = ""; }
    changed();
  });
  $("#cz-path").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.pp) { if (S.path.length < 8) S.path.push(b.dataset.pp); }
    else if (b.dataset.pt === "undo") S.path.pop(); else if (b.dataset.pt === "clear") S.path = [];
    changed();
  });
  $("#cz-tube").addEventListener("click", function(e){ if (e.target.closest("[data-tube]")) { stop(); S.tube = false; changed(); } });

  function curAnt(){ return antShow != null ? antShow : S.ant; }
  function stop(){
    if (anim) { anim(); anim = null; }
    busy = false; antShow = null; ovHTML = "";
    if (pend) { var d = pend; pend = null; d(); }
  }
  function changed(){ api.save(); paint(); MV.changed(); }
  function sync(){
    modeR.set(S.mode); lvR.set(S.lvl); abR.set(S.chlb ? "b" : "a"); psvR.set(S.psv); nmR.set(S.nm); lightR.set(S.light); accR.set(S.acc);
    antIn.value = S.ant; var a = curAnt(); $("#cz-ant-out").textContent = a + " pigments"; antIn.setAttribute("aria-valuetext", S.ant + " pigments");
    var z = S.mode === "zoom";
    $("#cz-zp").hidden = !z; $("#cz-pp").hidden = z; $("#cz-dx").hidden = !z; $("#cz-psbox").hidden = z; $("#cz-path").hidden = !z; $("#cz-tube").hidden = !z || !S.tube;
    $("#cz-ab").hidden = S.lvl !== "mol";
    $("#cz-photon").hidden = S.psv !== "photon"; $("#cz-ratep").hidden = S.psv !== "rate"; $("#cz-save").hidden = S.psv !== "rate";
    $("#cz-fire").disabled = busy;
  }
  function lastText(){
    var L = S.last; if (!L) return '<span class="muted">none yet: choose a photon and press Fire</span>';
    if (L.none) return L.nm + " nm: no antenna pigments to absorb it (antenna 0)";
    if (L.pass) return L.nm + " nm: not absorbed: passes through or is reflected";
    return L.nm + " nm: absorbed by " + PIGN[L.ty] + ", " + L.hops + " hop" + (L.hops === 1 ? "" : "s") + ", " + (L.blocked ? "no electron sent (acceptor blocked): lost as red fluorescence and heat" : "electron sent");
  }
  function psDescribe(r){
    var a = curAnt(), d = LN[S.light] + " light, antenna " + a + ". " + fmt(r.cap) + " photons captured, " + fmt(r.sent) + " electrons sent, " + fmt(r.lost) + " lost as heat and fluorescence.";
    if (S.acc === "block") d += " The acceptor is blocked.";
    if (S.psv === "photon") d = "Photosystem: " + pigs(a).length * 10 + " antenna pigments around a reaction centre, with the primary electron acceptor beside it" + (S.acc === "block" ? " (blocked)" : "") + ". Last photon: " + MV.plain(lastText()) + ". " + d;
    return d;
  }
  function meter(lab, v, cls, top){ return '<div class="cz-meter"><span class="cz-meter-l">' + lab + '</span><span class="cz-meter-t"><i class="' + cls + '" style="width:' + f1(clamp(v / 400, 0, 1) * 100) + '%"></i>' + (top ? '<b class="cz-top" style="left:25%"></b>' : "") + "</span></div>"; }
  function paint(){
    sync();
    var rows = [], r = rate(S.light, curAnt(), S.acc);
    if (S.mode === "zoom") {
      var hs = S.sel && HSD[S.sel];
      rows.push(["Selected structure", hs ? "<strong>" + hs.name + "</strong>: " + hs.job : '<span class="muted">Tap a structure in the diagram</span>']);
    } else {
      rows.push(["Photons captured", fmt(r.cap) + " per s"]);
      rows.push(["Electrons sent to acceptor", fmt(r.sent) + " per s" + (r.sent >= 100 ? " (maximum)" : "")]);
      rows.push(["Energy lost as heat and fluorescence", r.lost > 0 ? '<mark class="cz-hl">' + fmt(r.lost) + " per s</mark>" : "0 per s"]);
      rows.push(["Reaction centre busy", r.busy + "%"]);
      rows.push(["Last photon", lastText()]);
    }
    var sig = JSON.stringify(rows); if (sig !== readSig) { readSig = sig; $("#cz-read").innerHTML = MV.readoutHTML(rows); }
    $("#cz-meters").innerHTML = S.mode === "ps" ? meter("Photons captured", r.cap, "cz-m-cap") + meter("Electrons sent (mark: top speed, 100)", r.sent, "cz-m-e", true) + meter("Lost as heat and fluorescence", r.lost, "cz-m-lost") : "";
    if (S.mode === "zoom") {
      var nm = {}; if (S.sel && ZN[S.lvl][S.sel]) nm[S.sel] = HSD[S.sel].name.split(":")[0];
      dx.names(nm);
      $("#cz-cap").textContent = "Zoom level: " + MV.plain(byLevel(S.lvl)) + ". Tap any structure to read its job.";
      paintPath(); paintTube();
    } else {
      psRender(r);
      $("#cz-cap").textContent = S.psv === "photon" ? "Choose a photon and press Fire. Dotted path: energy hopping between pigments. e⁻: the electron sent to the acceptor." : "Rate view: " + LN[S.light] + " light (wavy arrows), antenna " + curAnt() + " pigments, acceptor " + (S.acc === "work" ? "working" : "blocked") + ".";
    }
    var sv0 = S.saved || {};
    $("#cz-save").innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" data-sv="save" data-k="czsave">Save this antenna</button><button type="button" class="btn ghost sm" data-sv="clear" data-k="czsclear"' + (sv0.low || sv0.high ? "" : " disabled") + ">Clear saved</button></div>" +
      '<p class="tiny cz-saved">Saved for challenge 3: shade leaves (Low light) <strong>' + (sv0.low ? sv0.low.ant + (sv0.low.acc === "block" ? ", acceptor blocked" : "") : "—") + "</strong> · sun leaves (High light) <strong>" + (sv0.high ? sv0.high.ant + (sv0.high.acc === "block" ? ", acceptor blocked" : "") : "—") + "</strong></p>" + (saveMsg ? '<p class="tiny cz-savemsg" role="status">' + saveMsg + "</p>" : "");
  }
  function byLevel(id){ var l = C.levels.filter(function(x){ return x[0] === id; })[0]; return l ? l[1] : ""; }
  function psRender(r){
    var svg = $("#cz-ps");
    svg.innerHTML = psSVG({ gid:"czg", ant:curAnt(), acc:S.acc, view:S.psv, light:S.light, r:r, labels:true, ov:S.psv === "photon" ? ovHTML : "" });
    svg.setAttribute("aria-label", psDescribe(r));
  }
  function paintPath(){
    var n = S.path.length;
    MV.keepFocus($("#cz-path"), function(){
      $("#cz-path").innerHTML = '<p class="cz-pi">' + C.pathIntro + '</p><div class="cz-pchips" role="group" aria-label="Parts to add to the photon path">' + PP.map(function(p){ return '<button type="button" class="cz-pchip" data-pp="' + p[0] + '" data-k="pp' + p[0] + '">' + p[1] + "</button>"; }).join("") + "</div>" +
        '<p class="cz-trail-p"><span class="cz-lab">Photon path:</span> ' + (n ? S.path.map(function(id, i){ return (i ? '<span aria-hidden="true"> → </span><span class="vh">, then </span>' : "") + "<strong>" + PN[id] + "</strong>"; }).join("") : '<span class="muted">none yet</span>') + "</p>" +
        '<span class="cz-btns"><button type="button" class="btn ghost sm" data-pt="undo" data-k="ptundo"' + (n ? "" : " disabled") + '>Undo</button><button type="button" class="btn ghost sm" data-pt="clear" data-k="ptclear"' + (n ? "" : " disabled") + ">Clear</button></span>";
    });
  }
  // P1 side panel: a test tube of chlorophyll extract in a dark room, lit with blue light; k = 0 … 1 (lamp, then red glow)
  function paintTube(){
    var box = $("#cz-tube"); if (!S.tube) { box.innerHTML = ""; return; }
    var k = S.lit, beam = clamp(k / 0.35, 0, 1), glow = clamp((k - 0.35) / 0.65, 0, 1), g = "";
    g += '<defs><radialGradient id="cz-tg"><stop offset="0" style="stop-color:var(--red);stop-opacity:.9"/><stop offset=".6" style="stop-color:var(--red);stop-opacity:.4"/><stop offset="1" style="stop-color:var(--red);stop-opacity:0"/></radialGradient></defs>';
    g += sv("rect", { x:0, y:0, width:340, height:150, rx:8, "class":"cz-room" }) + txt(10, 18, "dark room", "cz-rtxt");
    g += sv("circle", { cx:38, cy:78, r:13, "class":"cz-lamp" + (beam > 0 ? " on" : "") }) + sv("path", { d:"M30 95 H46 M32 100 H44", "class":"cz-rline" }) + txt(38, 122, "blue lamp", "cz-rtxt", "middle");
    if (beam > 0) { g += sv("polygon", { points:"52,70 176,52 176,128 52,88", "class":"cz-beam", opacity:f1(beam * 100) / 100 }); for (var i = 0; i < 3; i++) g += sv("path", { d:wavy(60, 68 + i * 10, 60 + 80 * beam, 64 + i * 13), "class":"cz-rwave" }); }
    if (glow > 0) g += sv("ellipse", { cx:205, cy:92, rx:48, ry:58, fill:"url(#cz-tg)", opacity:f1(glow * 100) / 100 });
    g += sv("path", { d:"M192 24 V124 a13 13 0 0 0 26 0 V24", "class":"cz-glass" }) + sv("path", { d:"M194 62 V124 a11 11 0 0 0 22 0 V62 Z", "class":"cz-extract" });
    if (glow > 0.5) g += sv("path", { d:"M238 88 L256 84", "class":"cz-rline" }) + txt(260, 84, "red glow", "cz-rtxt") + txt(260, 98, "(fluorescence)", "cz-rtxt");
    box.innerHTML = '<figure class="cz-tubefig"><div class="cz-stage cz-stage-tube"><svg viewBox="0 0 340 150" role="img" aria-label="' + MV.esc(C.tubeNote + (k >= 1 ? " Lit with blue light, the solution glows deep red." : beam > 0 ? " The blue lamp is on." : " The blue lamp is off.")) + '">' + g + '</svg></div><figcaption class="tiny">' + C.tubeNote + ' <button type="button" class="btn ghost sm" data-tube="hide" data-k="czhide">Hide the tube</button></figcaption></figure>';
  }
  // fire one photon (o: {pass, slow, done})
  function fire(o){
    stop();
    var nm = S.nm, a = S.ant, path = hopPath(nm, a), pass = false, res = { nm:nm };
    if (nm === 550) { if (o.pass) pass = true; else { S.n550 = (S.n550 || 0) + 1; pass = S.n550 % 10 !== 0; } }
    if (!pass && !path) { res.none = true; S.last = res; changed(); if (o.done) o.done(); return; }
    if (pass) res.pass = true; else { res.ty = path[0].ty; res.hops = path.length - 1; res.blocked = S.acc === "block"; }
    busy = true; pend = o.done || null; ovHTML = ""; paint();
    var from = pass ? [70, 4] : [clamp(path[0].x - 62, 6, 394), clamp(path[0].y - 62, 4, 266)];
    anim = photonRun({ gid:"czg", nm:nm, pass:pass, path:path, blocked:res.blocked, hop:o.slow ? 460 : 150, from:from, exit:[392, 214],
      draw:function(h){ ovHTML = h; var g = $("#cz-ps .cz-ov"); if (g) g.innerHTML = h; } },
      function(){ anim = null; busy = false; S.last = res; var d = pend; pend = null; api.save(); paint(); MV.changed(); if (d) d(); });
  }
  if (!ZN[S.lvl]) S.lvl = "cell";
  paint();

  function chal(id){
    if (id === "tc1") {
      var p = S.path, want = ["outer", "inner", "stroma", "tmem"];
      if (p.length === 4 && want.every(function(k, i){ return p[i] === k; })) return { ok:true };
      if (!p.length) return { ok:false, msg:"Tap the parts in order first, with the photon path chips under the diagram (Zoom mode)." };
      if (p.indexOf("stoma") >= 0) return { ok:false, msg:"A stoma is a pore in the leaf’s surface. Inside the chloroplast it’s the stroma." };
      var li = p.indexOf("lumen"), ti = p.indexOf("tmem");
      if (li >= 0 && (ti < 0 || li < ti)) return { ok:false, msg:"The lumen is inside the thylakoid; the chlorophyll is in the membrane around it." };
      if (p[p.length - 1] === "stroma") return { ok:false, msg:"The stroma has no chlorophyll; it holds the sugar-making enzymes." };
      return { ok:false };
    }
    if (id === "tc2") {
      if (S.light !== "mod") return { ok:false, msg:"Set the light level to Moderate first (Photosystem mode, Rate view)." };
      if (S.acc !== "work") return { ok:false, msg:"With the acceptor blocked, no electrons are sent. Set the acceptor to Working." };
      if (S.ant === 200) return { ok:true };
      if (S.ant > 200) return { ok:false, msg:"Top speed, but " + fmt(S.ant * 0.5 - 100) + " photons’ worth of energy per second is wasted as heat and fluorescence." };
      return { ok:false, msg:"Only " + fmt(S.ant * 0.5) + " electrons per second: the reaction centre is waiting." };
    }
    if (id === "tc3") {
      var lo = (S.saved || {}).low, hi = (S.saved || {}).high;
      if (!lo || !hi) return { ok:false, msg:"Save an antenna for both kinds of leaf: in the Rate view, set Low light (shade), choose an antenna and press Save this antenna; then do the same at High light (sun)." };
      if (lo.acc !== "work" || hi.acc !== "work") return { ok:false, msg:"A saved leaf has its acceptor blocked, so it sends no electrons. Set the acceptor to Working and save it again." };
      if (lo.ant === 400 && hi.ant === 100) return { ok:true };
      if (lo.ant === hi.ant) return { ok:false, msg:"One size can’t fit both: shade needs a bigger funnel, sun a smaller one." };
      if (hi.ant > 100) return { ok:false, msg:"Top speed, but " + (hi.ant - 100) + " photons’ worth per second is wasted." };
      if (hi.ant < 100) return { ok:false, msg:"Only " + hi.ant + " electrons per second in the sun." };
      return { ok:false, msg:"Only " + fmt(lo.ant * 0.25) + " electrons per second in the shade." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop(); var s = p.start;
        if (s.mode === "zoom") { S.mode = "zoom"; S.tube = true; S.lit = 0; }
        else {
          S.mode = "ps"; S.acc = "work"; S.psv = s.mode === "rate" ? "rate" : "photon";
          if (s.nm) { S.nm = s.nm; if (S.ant < 300) S.ant = 300; }
          if (s.light) { S.light = s.light; S.ant = s.ant; }
        }
        changed();
      },
      run:function(p, done){
        var s = p.start;
        if (s.mode === "zoom") {
          pend = done;
          anim = MV.tween({ dur:2400, ease:lin, step:function(t){ S.lit = t; paintTube(); }, done:function(){ anim = null; S.lit = 1; api.save(); paintTube(); var d = pend; pend = null; if (d) MV.wait(300, d); } });
        } else if (s.mode === "rate") {
          var a0 = s.ant, a1 = s.to; pend = done;
          anim = MV.tween({ dur:2000, ease:lin, step:function(t){ antShow = Math.round(lerp(a0, a1, t) / 10) * 10; paint(); }, done:function(){ anim = null; antShow = null; S.ant = a1; changed(); var d = pend; pend = null; if (d) MV.wait(400, d); } });
        } else fire({ pass:s.nm === 550, slow:!!s.slow, done:function(){ MV.wait(300, done); } });
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: which reactions happen where (process sorter on a big thylakoid + molecule clips; endosymbiosis data) ----------
var WZ = { tm:[[100, 52, 200, 24], [100, 176, 200, 24], [44, 100, 24, 52], [332, 100, 24, 52]], lu:[[100, 84, 200, 84]], st:[[0, 0, 400, 240]] };
function whereSVG(){
  var h = sv("rect", { x:0, y:0, width:400, height:240, "class":"cz-stroma", "data-hs":"st" });
  h += sv("rect", { x:50, y:56, width:300, height:140, rx:62, "class":"cz-wmem", "data-hs":"tm" });
  h += sv("rect", { x:66, y:72, width:268, height:108, rx:48, "class":"cz-wlu", "data-hs":"lu" });
  for (var x = 112; x <= 288; x += 22) h += (Math.abs(x - 250) > 10 ? sv("circle", { cx:x, cy:64, r:3, "class":"cz-pa" }) : "") + sv("circle", { cx:x + 11, cy:188, r:3, "class":"cz-pa" });
  return h + sv("rect", { x:246, y:44, width:8, height:24, rx:2, "class":"cz-psb" }) + sv("circle", { cx:250, cy:34, r:11, "class":"cz-psb" });
}
// @component moleculeClip — "Zoom to the molecules" clips (clipFrame): stroma / membrane / lumen scene, molecule tokens in their
// role colours moving along paths over 3 s; reduced motion shows reactants, products and dashed tracks in one still frame.
// clip scenes (400 × 200): stroma on top, membrane band 78–122, lumen below. Actors move along paths over 3 s.
// O₂ and H₂O are drawn in ink here: blue (--pen) depicts the blue light and the DCPIP dye in this module (colour rule 4).
var TK = { e:["e⁻", "--bio-e"], h:["H⁺", "--bio-h"], atp:["ATP", "--bio-atp"], adp:["ADP", "--ink-2"], pi:["Pᵢ", "--ink-2"], nadp:["NADP⁺", "--ink-2"], nadph:["NADPH", "--bio-nadh"],
  w:["H₂O", "--ink"], o2:["O₂", "--ink"], co2:["CO₂", "--bio-carbon"], c5:["5C", "--bio-carbon"], c3:["3C", "--bio-carbon"], g3p:["G3P", "--bio-carbon"], rib:["70S", "--ink-2"] };
function cxBlob(x, w, lab){ var h = sv("rect", { x:x, y:70, width:w, height:60, rx:16, "class":"cz-psb" }); for (var i = 0; i < 5; i++) h += sv("circle", { cx:x + 18 + i * (w - 36) / 4, cy:i % 2 ? 98 : 84, r:3.6, "class":"cz-pa" }); return h + txt(x + w / 2, 124, lab, "cz-txt-s", "middle"); }
function synth(x){ return sv("rect", { x:x - 7, y:66, width:14, height:66, rx:4, "class":"cz-psb" }) + sv("circle", { cx:x, cy:46, r:19, "class":"cz-psb" }) + txt(x + 26, 22, "ATP synthase", "cz-txt-s"); }
function enz(x, y, lab){ return sv("circle", { cx:x, cy:y, r:15, "class":"cz-enz" }) + txt(x, y + 30, lab, "cz-txt-s", "middle"); }
var CLIPS = {
  c1:{ s:cxBlob(140, 120, "photosystem"), a:[{ photon:[30, 6, 196, 80], t:[0, 0.45] }, { flash:[200, 84], t:[0.45, 0.75] }, { label:"energy absorbed", at:[200, 64], t:[0.7] }] },
  c2:{ s:cxBlob(30, 100, "photosystem II") + cxBlob(166, 68, "cytochrome") + cxBlob(270, 100, "photosystem I"), a:[{ k:"e", p:[[80, 106], [200, 106], [320, 106]], t:[0.1, 0.9] }] },
  c3:{ s:synth(200), a:[{ k:"h", p:[[150, 182], [200, 150], [200, 70], [250, 30]], t:[0, 0.55] }, { k:"h", p:[[260, 186], [200, 150], [200, 70], [282, 46]], t:[0.2, 0.75] }, { k:"h", p:[[110, 160], [200, 150], [200, 70], [150, 26]], t:[0.4, 0.95] }] },
  c4:{ s:cxBlob(140, 120, "photosystem II"), a:[{ k:"w", p:[[60, 182], [186, 142]], t:[0, 0.35], keep:false, pre:true }, { k:"w", p:[[340, 184], [214, 142]], t:[0, 0.35], keep:false, pre:true },
    { k:"o2", p:[[200, 142], [100, 184]], t:[0.42, 1] }, { k:"h", p:[[200, 142], [268, 176]], t:[0.42, 0.9] }, { k:"h", p:[[200, 142], [322, 152]], t:[0.48, 0.95] }, { k:"e", p:[[200, 140], [200, 100]], t:[0.42, 0.75] }, { label:"2H₂O → 4H⁺ + 4e⁻ + O₂", at:[200, 194], t:[0.8] }] },
  c5:{ s:cxBlob(150, 100, "photosystem II"), a:[[60, 150], [104, 176], [150, 154], [244, 180], [290, 152], [338, 178], [380, 156]].map(function(q, i){ return { k:"h", p:[[200, 132], q], t:[i * 0.08, i * 0.08 + 0.4] }; }).concat([{ k:"h", p:[[50, 30]], t:[0, 0], pre:true }, { k:"h", p:[[340, 22]], t:[0, 0], pre:true }]) },
  c6:{ s:synth(200), a:[{ k:"adp", p:[[56, 24], [182, 44]], t:[0, 0.42], keep:false, pre:true }, { k:"pi", p:[[344, 54], [220, 50]], t:[0, 0.42], keep:false, pre:true }, { k:"h", p:[[200, 184], [200, 72]], t:[0, 0.45], keep:false, pre:true }, { k:"atp", p:[[200, 46], [330, 24]], t:[0.5, 1] }, { label:"ADP + Pᵢ → ATP", at:[100, 58], t:[0.6] }] },
  c7:{ s:cxBlob(240, 100, "photosystem I") + enz(290, 50, "") + txt(312, 54, "NADP⁺ reductase", "cz-txt-s"), a:[{ k:"e", p:[[290, 100], [290, 64]], t:[0, 0.35], keep:false, pre:true }, { k:"nadp", p:[[70, 22], [272, 46]], t:[0, 0.45], keep:false, pre:true }, { k:"h", p:[[60, 58], [278, 58]], t:[0.05, 0.45], keep:false, pre:true }, { k:"nadph", p:[[290, 46], [356, 18]], t:[0.5, 1] }, { label:"NADP⁺ + H⁺ + 2e⁻ → NADPH", at:[130, 40], t:[0.6] }] },
  c8:{ s:enz(200, 40, "rubisco"), a:[{ k:"co2", p:[[36, 20], [182, 38]], t:[0, 0.45], keep:false, pre:true }, { k:"c5", p:[[366, 20], [218, 38]], t:[0, 0.45], keep:false, pre:true }, { k:"c3", p:[[200, 40], [112, 60]], t:[0.5, 1] }, { k:"c3", p:[[200, 40], [288, 60]], t:[0.5, 1] }, { label:"CO₂ + 5C sugar → 2 × 3C", at:[200, 14], t:[0.6] }] },
  c9:{ s:enz(200, 40, ""), a:[{ k:"c3", p:[[40, 40], [184, 40]], t:[0, 0.4], keep:false, pre:true }, { k:"atp", p:[[110, 14], [190, 30]], t:[0.05, 0.42], keep:false, pre:true }, { k:"nadph", p:[[110, 64], [190, 52]], t:[0.1, 0.45], keep:false, pre:true }, { k:"g3p", p:[[200, 40], [340, 28]], t:[0.5, 1] }, { label:"G3P: a 3-carbon sugar", at:[320, 56], t:[0.6] }] },
  c10:{ s:sv("path", { d:dnaLoop(64, 38, 20), "class":"cz-dna" }) + txt(64, 72, "chloroplast DNA", "cz-txt-s", "middle") + sv("line", { x1:120, y1:40, x2:384, y2:40, "class":"cz-mrna" }) + txt(384, 62, "message from its DNA", "cz-txt-s", "end"), a:[{ k:"rib", p:[[140, 34], [360, 34]], t:[0, 1], pre:true }] }
};
function tokSVG(key, x, y){ var t = TK[key], lab = t[0], w = Math.max(20, lab.length * 6.6 + 10); return '<g transform="translate(' + f1(x) + "," + f1(y) + ')"><rect x="' + f1(-w / 2) + '" y="-7.5" width="' + f1(w) + '" height="15" rx="7.5" style="fill:var(' + t[1] + ')"/><text y="3.8" text-anchor="middle" class="cz-tokt">' + lab + "</text></g>"; }
function clipBase(){ return sv("rect", { x:0, y:0, width:400, height:78, "class":"cz-stroma" }) + sv("rect", { x:0, y:78, width:400, height:44, "class":"cz-core" }) + sv("line", { x1:0, y1:78, x2:400, y2:78, "class":"cz-mline2" }) + sv("line", { x1:0, y1:122, x2:400, y2:122, "class":"cz-mline2" }) + sv("rect", { x:0, y:122, width:400, height:78, "class":"cz-lumen" }) + txt(6, 14, "stroma", "cz-txt-s") + txt(6, 194, "thylakoid lumen", "cz-txt-s"); }
function clipFrame(def, t, still){
  var h = clipBase() + (def.s || "");
  (def.a || []).forEach(function(a){
    var t0 = a.t[0], t1 = a.t[1] == null ? t0 : a.t[1], k = t1 > t0 ? clamp((t - t0) / (t1 - t0), 0, 1) : (t >= t0 ? 1 : 0);
    if (a.photon) { if (t >= t0) h += photonSVG(a.photon[0], a.photon[1], lerp(a.photon[0], a.photon[2], k), lerp(a.photon[1], a.photon[3], k)); return; }
    if (a.flash) { if (t >= t0) h += sv("circle", { cx:a.flash[0], cy:a.flash[1], r:4 + 9 * k, "class":"cz-halo", opacity:0.9 }); return; }
    if (a.label) { if (t >= t0) h += txt(a.at[0], a.at[1], a.label, "cz-txt-b cz-halo-t", "middle"); return; }
    if (still) {                                     // reduced motion: reactants where they start, products where they end, dashed tracks
      if (a.p.length > 1) h += arrowLine(a.p);
      var q = a.keep === false ? a.p[0] : a.p[a.p.length - 1]; h += tokSVG(a.k, q[0], q[1]); return;
    }
    if (t < t0 && !a.pre) return;
    if (t > t1 && a.keep === false) return;
    var pos = polyAt(a.p, k); h += tokSVG(a.k, pos[0], pos[1]);
  });
  return h;
}

function part3(host, api){
  var C = api.content, S = api.S; S.placed = S.placed || {}; S.tries = S.tries || {}; S.rows = S.rows || {};
  var cards = MV.shuffle(C.cards, "cz-where-cards"), sel = null, clipStop = null, clipId = null;
  host.innerHTML = '<div class="cz-p3"><h3>' + C.sorterTitle + "</h3><p>" + C.sorterHow + "</p>" +
    '<div class="cz-cards" id="cz-cards" role="group" aria-label="Process cards"></div><div id="cz-wfb" aria-live="polite"></div>' +
    '<div class="cz-wdx" id="cz-wdx"></div><div class="cz-bins" id="cz-bins"></div><div id="cz-wdone"></div>' +
    '<div class="cz-clip" id="cz-clip" hidden><h4 id="cz-clip-h"></h4><figure class="cz-clipfig"><div class="cz-stage cz-stage-clip"><svg id="cz-clip-svg" viewBox="0 0 400 200" role="img" focusable="false"></svg></div><figcaption id="cz-clip-cap" class="tiny"></figcaption></figure>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="cz-clip-re" data-k="czre">Replay</button><button type="button" class="btn ghost sm" id="cz-clip-x" data-k="czx">Close the clip</button></div></div>' +
    '<details class="alg cz-data" open><summary>' + C.dataTitle + "</summary><p>" + C.dataHow + '</p><div id="cz-endo"></div><div id="cz-endo-done" aria-live="polite"></div></details></div>';
  var RN = {}; C.regions.forEach(function(r){ RN[r.id] = r.t; });
  var dx = diagramExplorer($("#cz-wdx", host), { levels:[{ id:"w", name:"Chloroplast regions", vb:[400, 240], draw:whereSVG,
    aria:function(){ return "A thylakoid drawn large and cut open: its membrane, with photosystems and ATP synthase, encloses the thylakoid lumen. The stroma is all around it. Tap a region after choosing a card."; },
    hotspots:C.regions.map(function(r){ return { id:r.id, label:r.t, zones:WZ[r.id] }; }) }], level:"w", onTap:onTap });
  dx.tags([{ x:12, y:22, html:"Stroma", align:"l" }, { x:200, y:128, html:"Thylakoid lumen", align:"c" }, { x:200, y:64, html:"Thylakoid membrane", align:"c" }]);
  function fb(kind, html){ $("#cz-wfb", host).innerHTML = html ? (kind ? MV.fbHTML(kind, html) : '<p class="fb" role="status">' + html + "</p>") : ""; }
  function card(id){ return byId(C.cards, id); }
  function onTap(rid){
    if (!sel) { fb("", "Tap a card first, then tap the region where it happens."); return; }
    var c = card(sel);
    if (MV.ans(c) === rid) { S.placed[c.id] = rid; fb("good", "<strong>✓ " + c.t + ": " + RN[rid] + ".</strong>" + (c.note ? " " + c.note : "") + " Press <strong>Zoom to the molecules</strong> to watch it happen."); sel = null; }
    else { S.tries[c.id] = (S.tries[c.id] || 0) + 1; fb("bad", "<strong>✗ Not quite.</strong> " + ((c.wrong && c.wrong[rid]) || C.wrongDefault) + " Try another region."); }
    api.save(); paint(); MV.focusFb($("#cz-wfb", host));
  }
  function paint(){
    MV.keepFocus($("#cz-cards", host), function(){
      var left = cards.filter(function(c){ return !S.placed[c.id]; });
      $("#cz-cards", host).innerHTML = left.length ? left.map(function(c){ return '<button type="button" class="cz-card" data-card="' + c.id + '" data-k="czc' + c.id + '" aria-pressed="' + (sel === c.id) + '">' + c.t + "</button>"; }).join("") : '<p class="muted">Every card is placed.</p>';
    });
    MV.keepFocus($("#cz-bins", host), function(){
      $("#cz-bins", host).innerHTML = C.regions.map(function(r){
        var list = cards.filter(function(c){ return S.placed[c.id] === r.id; });
        return '<div class="cz-bin"><h4>' + r.t + ' <span class="muted">(' + list.length + ")</span></h4><ul>" + list.map(function(c){ return '<li><span><span aria-hidden="true">✓ </span>' + c.t + (c.note ? ' <span class="muted">' + c.note + "</span>" : "") + '</span><button type="button" class="btn ghost sm cz-zoom" data-clip="' + c.id + '" data-k="czz' + c.id + '">Zoom to the molecules</button></li>'; }).join("") + "</ul></div>";
      }).join("");
    });
    var n = Object.keys(S.placed).length;
    $("#cz-wdone", host).innerHTML = n === C.cards.length ? '<p class="sort-done">All sorted! The light-capturing parts are in the thylakoid membrane, H⁺ and water splitting are in the lumen, and the sugar-making happens in the stroma.</p>' : "";
    paintEndo();
  }
  function play(id){
    if (clipStop) { clipStop(); clipStop = null; }
    clipId = id; var c = card(id), def = CLIPS[id], box = $("#cz-clip", host), svg = $("#cz-clip-svg", host);
    box.hidden = false; $("#cz-clip-h", host).innerHTML = "Zoom to the molecules: " + c.t; $("#cz-clip-cap", host).innerHTML = c.clip;
    svg.setAttribute("aria-label", MV.plain(c.clip));
    if (MV.reduceMotion) { svg.innerHTML = clipFrame(def, 1, true); return; }
    clipStop = MV.tween({ dur:3000, ease:lin, step:function(t){ svg.innerHTML = clipFrame(def, t, false); }, done:function(){ clipStop = null; } });
  }
  function paintEndo(){
    var T = C.table, n = T.rows.filter(function(r){ return S.rows[r.id]; }).length;
    MV.keepFocus($("#cz-endo", host), function(){
      $("#cz-endo", host).innerHTML = '<div class="tbl-wrap"><table class="cz-endo"><thead><tr>' + T.head.map(function(h){ return '<th scope="col">' + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
        T.rows.map(function(r){ var on = !!S.rows[r.id]; return '<tr class="' + (on ? "on" : "") + '"><th scope="row"><button type="button" class="cz-rowb" data-row="' + r.id + '" data-k="czr' + r.id + '" aria-pressed="' + on + '"><span aria-hidden="true">' + (on ? "✓" : "○") + "</span> " + r.cells[0] + "</button></th>" + r.cells.slice(1).map(function(x){ return "<td>" + x + "</td>"; }).join("") + "</tr>"; }).join("") +
        '</tbody></table></div><p class="tiny muted">' + n + " of " + T.rows.length + " rows tapped.</p>" +
        (n ? '<ul class="cz-whys">' + T.rows.filter(function(r){ return S.rows[r.id]; }).map(function(r){ return "<li><strong>" + r.cells[0] + ":</strong> " + r.why + "</li>"; }).join("") + "</ul>" : "");
    });
    $("#cz-endo-done", host).innerHTML = n === T.rows.length ? '<div class="cz-closing"><p><strong>All five rows support endosymbiosis.</strong> ' + C.closing + "</p></div>" : "";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.card) { sel = sel === b.dataset.card ? null : b.dataset.card; fb("", sel ? "Selected: <strong>" + card(sel).t + "</strong>. Now tap the region where it happens." : ""); paint(); return; }
    if (b.dataset.clip) { play(b.dataset.clip); var bx = $("#cz-clip", host); if (bx.scrollIntoView) bx.scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" }); return; }
    if (b.id === "cz-clip-re" && clipId) { play(clipId); return; }
    if (b.id === "cz-clip-x") { if (clipStop) { clipStop(); clipStop = null; } $("#cz-clip", host).hidden = true; return; }
    if (b.dataset.row) { S.rows[b.dataset.row] = !S.rows[b.dataset.row]; if (!S.rows[b.dataset.row]) delete S.rows[b.dataset.row]; api.save(); paintEndo(); }
  });
  paint();
}

// ---------- Practice 1: label the chloroplast (S1 label-quiz mode; adapted from SBI4U 01) ----------
function labelQuiz(host, api, a){
  var S = api.S; S.done = S.done || {}; S.tries = S.tries || {}; S.hints = S.hints || {};
  var HSD = MV.C.explore.hotspots, cur = null, msg = null;
  host.innerHTML = '<div class="lq-labs" id="lq-labs"></div><div id="lq-help"></div><div id="lq-fb" aria-live="polite"></div><div class="lq-dx" id="lq-dx"></div><div id="lq-done"></div>';
  var labs = radios($("#lq-labs", host), { label:"Labels", cls:"chips", options:opts(), value:"", onChange:function(id){ cur = id; msg = null; paint(); } });
  var dx = diagramExplorer($("#lq-dx", host), { levels:[{ id:"chloro", name:"Chloroplast", vb:[400, 270], draw:chloroSVG,
    aria:function(){ return "Unlabelled chloroplast with nine structures to name."; },
    hotspots:a.labels.map(function(l){ var z = ZONES.chloro[l.id]; return { id:l.id, label:aria(l.id), zones:z.zones, tag:z.tag }; }) }], level:"chloro", onTap:onTap });
  function aria(id){ return S.done[id] ? MV.plain(HSD[id].name) + " (labelled)" : HSD[id].where; }
  function opts(){ return a.labels.map(function(l){ return { id:l.id, t:(S.done[l.id] ? "✓ " : "") + l.t, dis:!!S.done[l.id] }; }); }
  function onTap(id){
    if (!cur) { msg = { k:"", h:"Tap a label first, then tap the structure it names." }; paint(); return; }
    var L = byId(a.labels, cur);
    if (id === cur) { S.done[cur] = true; msg = { k:"good", h:"<strong>✓ That’s the " + L.t + ".</strong> " + HSD[cur].job }; cur = null; labs.setOptions(opts()); labs.set(""); }
    else { S.tries[cur] = (S.tries[cur] || 0) + 1; var key = [cur, id].sort().join("|"); msg = { k:"bad", h:"<strong>✗ That’s not the " + L.t + ".</strong> " + (a.pairs[key] || a.wrongDefault) }; }
    api.save(); paint(); MV.focusFb($("#lq-fb", host));
  }
  function paint(){
    var m = {}, n = {}; Object.keys(S.done).forEach(function(id){ m[id] = "good"; n[id] = HSD[id].name; });
    dx.marks(m); dx.names(n); dx.labels(aria);
    var L = cur && byId(a.labels, cur), lvl = cur ? (S.hints[cur] || 0) : 0;
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

// ---------- Practice 2: photosystem puzzles (N4 number entry incl. a two-box item, choice; adapted from SBI4U 02 experiments) ----------
function puzzles(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:"", vals:["", ""], choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); if (!x.vals) x.vals = ["", ""]; return x; }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function item(id){ return byId(a.items, id); }
  function parseVal(raw){
    var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Z].*$/, "").replace(/\s/g, "");
    var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
  }
  function inputs(it, x){
    if (it.kind === "pair") return '<div class="cz-pair">' + it.labels.map(function(l, k){ return '<div class="numrow"><label for="li-' + it.id + k + '">' + l + ':</label><input class="numin" id="li-' + it.id + k + '" data-lin="' + it.id + '" data-ix="' + k + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.vals[k]) + '"' + (x.solved ? " disabled" : "") + "></div>"; }).join("") + "</div>";
    return '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="cz-unit">' + it.unit + "</span></div>";
  }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
    else {
      h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>" + inputs(it, x);
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; var x = ist(id); if (e.target.dataset.ix != null) x.vals[+e.target.dataset.ix] = e.target.value; else x.val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = item(box.dataset.li), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (it.kind === "mc" && b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.act === "check") {
      var ok = false;
      if (it.kind === "mc") { x.checked = true; ok = MV.ok(it.options[x.choice]); }
      else if (it.kind === "pair") {
        var vs = x.vals.map(parseVal), ans = MV.ans(it);
        if (vs[0] == null || vs[1] == null) { msgs[it.id] = "Enter a number in both boxes, such as 0 or 25."; paintItem(it); return; }
        ok = Math.abs(vs[0] - ans[0]) < 1e-6 && Math.abs(vs[1] - ans[1]) < 1e-6;
        msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + it.wrongFb + " Try again.";
      } else {
        var v = parseVal(x.val), an = MV.ans(it);
        if (v == null) { msgs[it.id] = "Enter a number, such as 25 or 12.5."; paintItem(it); return; }
        ok = Math.abs(v - an) <= 1e-6 * Math.max(1, Math.abs(an));
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return Math.abs(v - w.match) <= 1e-6 * Math.max(1, Math.abs(w.match)); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : "Use the model: captured = antenna × light factor; sent = the smaller of captured and 100.") + " Try again."; }
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

// ---------- @component S9 tubeBuilder — Performance task "Prove the chloroplasts did it": test-tube slots with chip choices, a rack
// preview and a Run animation of the predicted colour change (5 slots × chloroplasts / DCPIP / conditions) ----------
var task = (function(){
  var api = null, T = null, fade = 0, ran = false, anim = null;
  var ORDER = ["FYL", "FYD", "NYL", "NYD", "BYL", "BYD"], CHN = { F:"fresh", B:"boiled", N:"no chloroplasts" };
  function slot(i){ var s = api.S.slots || (api.S.slots = []); return s[i] || (s[i] = { chl:"", dye:"", cond:"" }); }
  function read(){
    var tubes = [], partial = [];
    if (!api) return { tubes:tubes, partial:partial };
    for (var i = 0; i < T.slots; i++) { var s = slot(i), n = (s.chl ? 1 : 0) + (s.dye ? 1 : 0) + (s.cond ? 1 : 0); if (n === 3) tubes.push({ i:i, chl:s.chl, dye:s.dye, cond:s.cond, code:s.chl + s.dye + s.cond }); else if (n) partial.push(i + 1); }
    return { tubes:tubes, partial:partial };
  }
  function distinct(d){ var u = []; d.tubes.forEach(function(t){ if (u.indexOf(t.code) < 0) u.push(t.code); }); return u; }
  function codeText(c){ return CHN[c.charAt(0)] + (c.charAt(1) === "X" ? ", no DCPIP" : "") + " + " + (c.charAt(2) === "L" ? "light" : "dark"); }
  function result(c){ return c.charAt(1) === "X" ? "no dye" : c === "FYL" ? "colourless" : "stays blue"; }
  function draw(){
    var h = "", desc = [];
    for (var i = 0; i < T.slots; i++) {
      var s = slot(i), x = 40 + i * 80, full = s.chl && s.dye && s.cond, c = full ? s.chl + s.dye + s.cond : "";
      if (full && s.cond === "D") h += sv("rect", { x:x - 25, y:6, width:50, height:150, rx:6, "class":"cz-room" }) + txt(x, 20, "dark", "cz-rtxt", "middle");
      if (full && s.cond === "L") h += photonSVG(x - 36, 4, x - 18, 30);
      if (!full) { h += sv("path", { d:"M" + (x - 14) + " 26 V128 a14 14 0 0 0 28 0 V26", "class":"cz-glass cz-empty" }) + txt(x, 86, s.chl || s.dye || s.cond ? "unfinished" : "empty", "cz-txt-s", "middle"); }
      else {
        var liq = "M" + (x - 12) + " 64 V128 a12 12 0 0 0 24 0 V64 Z";
        h += sv("path", { d:liq, "class":"cz-liq" });
        if (s.chl !== "N") h += sv("path", { d:liq, "class":s.chl === "F" ? "cz-liq-f" : "cz-liq-b" });
        if (s.dye === "Y") { var k = c === "FYL" ? 1 - fade : 1; if (k > 0.01) h += sv("path", { d:liq, "class":"cz-liq-dye", opacity:f1(k * 100) / 100 }); }
        h += sv("path", { d:"M" + (x - 14) + " 26 V128 a14 14 0 0 0 28 0 V26", "class":"cz-glass2" });
        if (ran) h += txt(x, 160, result(c), "cz-txt-b", "middle");
        desc.push("tube " + (i + 1) + ": " + codeText(c) + (s.dye === "Y" ? " with DCPIP" : "") + (ran ? ", " + result(c) : ""));
      }
      h += txt(x, 178, "Tube " + (i + 1), "cz-txt-s", "middle") + (full ? txt(x, 192, CHN[s.chl] === "no chloroplasts" ? "none" : CHN[s.chl], "cz-txt-s", "middle") + txt(x, 206, s.dye === "Y" ? "DCPIP" : "no dye", "cz-txt-s", "middle") : "");
    }
    var svg = $("#cz-rack");
    if (svg) { svg.innerHTML = h; svg.setAttribute("aria-label", "Test-tube rack. " + (desc.length ? desc.join("; ") + "." : "No tubes set up yet.") + (ran ? "" : " Press Run to see the result.")); }
  }
  function key(d){ return distinct(d).sort(function(p, q){ var a = ORDER.indexOf(p), b = ORDER.indexOf(q); return (a < 0 ? 99 : a) - (b < 0 ? 99 : b); }).join("+"); }
  function reset(){ if (anim) { anim(); anim = null; } ran = false; fade = 0; var b = $("#cz-run"); if (b) b.disabled = false; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      inp.innerHTML = '<div class="cz-slots">' + Array.apply(null, Array(T.slots)).map(function(_, i){ return '<fieldset class="cz-slot"><legend>Tube ' + (i + 1) + "</legend>" + T.inputs.map(function(x){ return '<div class="cz-row" id="cz-s' + i + x.id + '"></div>'; }).join("") + '<button type="button" class="btn ghost sm" data-clr="' + i + '" data-k="czclr' + i + '" aria-label="Clear tube ' + (i + 1) + '">Clear</button></fieldset>'; }).join("") + "</div>";
      var groups = [];
      for (var i = 0; i < T.slots; i++) (function(i){
        T.inputs.forEach(function(x){ groups.push({ i:i, id:x.id, rg:radios($("#cz-s" + i + x.id), { label:x.label, aria:"Tube " + (i + 1) + ": " + x.label, cls:"chips", options:x.options.map(function(o){ return { id:o[0], t:o[1] }; }), value:slot(i)[x.id], onChange:function(v){ slot(i)[x.id] = v; a.save(); reset(); draw(); a.update(); } }) }); });
      })(i);
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-clr]"); if (!b) return; var k = +b.dataset.clr; api.S.slots[k] = { chl:"", dye:"", cond:"" }; groups.forEach(function(g){ if (g.i === k) g.rg.set(""); }); a.save(); reset(); draw(); a.update(); });
      pv.innerHTML = '<div class="cz-stage cz-stage-rack"><svg id="cz-rack" viewBox="0 0 400 214" role="img" focusable="false"></svg></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="cz-run" data-k="czrun">Run</button><span class="tiny muted">DCPIP is blue; it turns colourless when it gains electrons. Green in a tube is the chloroplasts themselves.</span></div>';
      $("#cz-run").addEventListener("click", function(){
        var b = $("#cz-run"); if (b.disabled) return;
        if (anim) { anim(); anim = null; }
        b.disabled = true; ran = false; fade = 0; draw();
        anim = MV.tween({ dur:1800, ease:lin, step:function(t){ fade = t; draw(); }, done:function(){ anim = null; fade = 1; ran = true; draw(); b.disabled = false; } });
      });
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){ var st = MV.taskState(), g = $("#task-fb .fb.good"); if (g && st.found.length >= 7 && !$(".cz-all", g)) g.insertAdjacentHTML("beforeend", '<p class="cz-all">' + T.afterAll + "</p>"); }, 0); });
    },
    read:read,
    valid:function(d){
      if (d.partial.length) return "Tube " + d.partial.join(" and tube ") + (d.partial.length > 1 ? " are" : " is") + " only partly set up: choose its chloroplasts, DCPIP and conditions, or clear it.";
      if (!d.tubes.length) return "Set up at least one tube: choose its chloroplasts, DCPIP and conditions.";
      return true;
    },
    checks:function(d){
      var has = function(c){ return d.tubes.some(function(t){ return t.code === c; }); }, n = distinct(d).length;
      return [has("FYL"), has("FYD"), has("NYL") || has("BYL"), d.tubes.length > 0 && d.tubes.every(function(t){ return t.dye === "Y"; }), n >= 3 && n <= 4];
    },
    key:key,
    label:function(k){ return "{" + k.split("+").map(codeText).join(", ") + "}"; },
    text:function(k){ return k.split("+").map(codeText).join(", ") + " (all with DCPIP)"; }
  };
})();

// ---------- hero: palisade cell → dive into a chloroplast → zoom bubble on a thylakoid membrane → photon, hops, one electron ----------
function hero(f){
  var box = $("#cz-hero"); if (!box) return;
  var cap = f && f.cap, path = hopPath(450, 400);
  var CAPS = ["A palisade cell, packed with chloroplasts.", "Diving into one chloroplast…", "A chloroplast cut open: the envelope, the stroma and stacks of thylakoids (grana).", "Zooming onto one thylakoid membrane: a photosystem.", "A photon lands on an outer antenna pigment. Its energy hops from pigment to pigment toward the centre…", "…and the reaction centre sends one electron to the primary electron acceptor.",
    "A chloroplast cut open (envelope, stroma, grana), with one photosystem zoomed in: the dotted path is the energy hopping inward; the reaction centre has sent one electron to the acceptor."];
  var lab = function(x, y, x2, y2, s, anchor){ return sv("path", { d:"M" + x + " " + y + " L" + x2 + " " + y2, "class":"cz-lead" }) + txt(x, y + (y < y2 ? -4 : 12), s, "cz-hlab", anchor || "middle"); };
  var gr = ""; [112, 140, 168, 196].forEach(function(y){ gr += sv("rect", { x:375, y:y - 10, width:140, height:20, rx:10, "class":"cz-thy cz-thy-g" }); });
  box.innerHTML = '<svg viewBox="0 0 560 320" aria-hidden="true" focusable="false"><defs><clipPath id="cz-hclip"><circle cx="445" cy="160" r="104"/></clipPath></defs>' +
    '<g class="hz-cell">' + '<g transform="translate(80 25)">' + cellSVG() + sv("circle", { cx:248, cy:135, r:15, "class":"cz-focus" }) + "</g></g>" +
    '<g class="hz-cp"><g transform="translate(10 52) scale(0.78)">' + chloroSVG() + "</g></g>" +
    '<g class="hz-lab">' + lab(30, 38, 70, 80, "envelope", "start") + lab(52, 290, 96, 208, "stroma", "middle") + lab(230, 290, 258, 176, "granum", "middle") + "</g>" +
    '<g class="hz-bub"><path d="M197 115 L398 70 M197 183 L398 250" class="cz-lead"/><circle cx="445" cy="160" r="104" class="cz-bubbg"/><g clip-path="url(#cz-hclip)"><g class="hz-gr">' + gr + '</g><g class="hz-ps" transform="translate(445 160) scale(0.62) translate(-200 -140)">' + psSVG({ gid:"czhg", ant:400, acc:"work", view:"photon", labels:false }) + "</g></g>" +
      '<circle cx="445" cy="160" r="104" class="cz-bubring"/>' + txt(445, 288, "one photosystem", "cz-hlab", "middle") + txt(445, 304, "(thylakoid membrane)", "cz-hlab cz-hsub", "middle") + "</g></svg>";
  var cell = $(".hz-cell", box), cp = $(".hz-cp", box), labs = $(".hz-lab", box), bub = $(".hz-bub", box), grg = $(".hz-gr", box), ps = $(".hz-ps", box), ov = $(".hz-ps .cz-ov", box);
  function setCap(i){ if (cap) cap.textContent = CAPS[i]; }
  function op(el, v){ el.setAttribute("opacity", f1(clamp(v, 0, 1) * 100) / 100); }
  function sc(el, cx, cy, s){ el.setAttribute("transform", "translate(" + cx + " " + cy + ") scale(" + f1(s * 100) / 100 + ") translate(" + (-cx) + " " + (-cy) + ")"); }
  function photon(hop, done){ return photonRun({ gid:"czhg", nm:450, pass:false, path:path, blocked:false, hop:hop, from:[path[0].x - 70, path[0].y - 60], draw:function(h){ ov.innerHTML = h; } }, done); }
  if (MV.reduceMotion) { op(cell, 0); op(cp, 1); op(labs, 1); op(bub, 1); op(grg, 0); op(ps, 1); setCap(6); photon(0); return; }
  op(cell, 0); op(cp, 0); op(labs, 0); op(bub, 0); op(ps, 0); setCap(0);
  chain([
    { dur:700, step:function(t){ op(cell, t); } },
    { dur:300 },
    { dur:1600, ease:MV.ease, step:function(t){ if (t > 0.02) setCap(1); sc(cell, 328, 160, 1 + 8 * t); op(cell, 1 - clamp((t - 0.45) / 0.4, 0, 1)); sc(cp, 328, 160, 0.12 + 0.88 * t); op(cp, clamp((t - 0.3) / 0.5, 0, 1)); } },
    { dur:600, step:function(t){ setCap(2); op(labs, t); } },
    { dur:900 },
    { dur:800, ease:MV.ease, step:function(t){ setCap(3); sc(bub, 445, 160, 0.2 + 0.8 * t); op(bub, t); } },
    { dur:500 },
    { dur:700, step:function(t){ op(grg, 1 - t); op(ps, t); } },
    { dur:300 }
  ], function(){ setCap(4); photon(280, function(){ setCap(5); MV.wait(2600, function(){ setCap(6); }); }); });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ label:labelQuiz, puzzles:puzzles },
  task:task
});
})();
