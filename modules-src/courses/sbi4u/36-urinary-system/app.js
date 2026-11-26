// SBI4U 36 The Urinary System: hero (filtrate through one nephron), S1 + S4 nephron explorer (Explore: trace a substance,
// concentration map, change the conditions), "Hormones that tune the kidney" stations (Part 3: S8 ADH loop, renin–angiotensin
// stepper, pH zoom, urinalysis cards, dialysis schematic), label quiz and kidney calculations (Practice), "Water-saving kidney" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, chem = MV.bio.chem;

// ---------- small helpers ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function fmt(v){ return MV.num(Math.round(v * 10) / 10); }

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

// ---------- @component S1 diagramExplorer (copied from SBI4U 01; single level; o.ordered keeps the hotspot order for Tab
// and arrow keys (filtrate order), o.arrowTap makes arrow keys select as well as move; redraw() repaints only the drawing) ----------
// diagramExplorer(host, { vb:[w, h], draw() -> SVG markup, aria() -> text, hotspots:[{ id, label, zones:[[x, y, w, h], …], tag:[x, y, "l"|"r"|"c"] }],
//   ordered, arrowTap, onTap(id) }) -> { select(id), marks({id:"good"}), names({id:html}), tags([{x, y, html, align, cls}]), over(), svg(), redraw(), setAria(t), labels(fn) }
function diagramExplorer(host, o){
  var sel = null, marks = {}, free = [], names = {}, w = o.vb[0], h = o.vb[1];
  host.innerHTML = '<div class="s1"><div class="s1-stage"><svg class="s1-svg" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg><div class="s1-tags" aria-hidden="true"></div><div class="s1-hs" role="group"></div></div></div>';
  var stage = $(".s1-stage", host), svg = $(".s1-svg", host), tagBox = $(".s1-tags", host), hsBox = $(".s1-hs", host);
  function p2(v){ return Math.round(v * 100) / 100; }
  function redraw(){ svg.innerHTML = o.draw() + '<g class="s1-over"></g>'; svg.setAttribute("aria-label", o.aria ? o.aria() : "Diagram"); }
  function render(){
    stage.style.aspectRatio = w + " / " + h;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    redraw();
    hsBox.setAttribute("aria-label", o.groupLabel || "Structures in the diagram");
    var list = [];
    o.hotspots.forEach(function(hs, hi){ hs.zones.forEach(function(z, zi){ list.push({ hs:hs, hi:hi, z:z, zi:zi, area:z[2] * z[3] }); }); });
    list.slice().sort(function(a, b){ return b.area - a.area; }).forEach(function(it, i){ it.zx = 1 + i; });
    if (o.ordered) list.sort(function(a, b){ return (a.hi - b.hi) || (a.zi - b.zi); });
    else list.sort(function(a, b){ return (a.z[1] - b.z[1]) || (a.z[0] - b.z[0]); });
    hsBox.innerHTML = list.map(function(it){
      var z = it.z, cx = (z[0] + z[2] / 2) / w * 100, cy = (z[1] + z[3] / 2) / h * 100, pw = z[2] / w * 100, ph = z[3] / h * 100;
      return '<button type="button" class="s1-b" data-hs="' + it.hs.id + '" data-k="s1' + (o.key || "") + it.hs.id + it.zi + '" aria-label="' + MV.esc(it.hs.label) + '" aria-pressed="false"' + (it.zi ? ' tabindex="-1"' : "") + ' style="left:calc(' + p2(cx) + "% - max(12px, " + p2(pw / 2) + "%));top:calc(" + p2(cy) + "% - max(12px, " + p2(ph / 2) + "%));width:max(24px, " + p2(pw) + "%);height:max(24px, " + p2(ph) + "%);z-index:" + it.zx + '"></button>';
    }).join("");
    paint();
  }
  function paint(){
    $$(".s1-b", hsBox).forEach(function(b){ var id = b.dataset.hs; b.setAttribute("aria-pressed", String(id === sel)); b.className = "s1-b" + (marks[id] ? " " + marks[id] : ""); });
    paintTags();
  }
  function paintTags(){
    var out = [];
    o.hotspots.forEach(function(hs){ if (names[hs.id] && hs.tag) out.push({ x:hs.tag[0], y:hs.tag[1], align:hs.tag[2], html:names[hs.id], cls:"s1-name" }); });
    tagBox.innerHTML = out.concat(free).map(function(t){ return '<span class="s1-tag ' + (t.align || "l") + (t.cls ? " " + t.cls : "") + '" style="left:' + p2(t.x / w * 100) + "%;top:" + p2(t.y / h * 100) + '%">' + t.html + "</span>"; }).join("");
  }
  function tap(id){ if (o.onTap) o.onTap(id); }
  hsBox.addEventListener("click", function(e){ var b = e.target.closest(".s1-b"); if (b) tap(b.dataset.hs); });
  hsBox.addEventListener("keydown", function(e){
    var b = e.target.closest(".s1-b"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.hotspots.map(function(x){ return x.id; }), i = ids.indexOf(b.dataset.hs), nx = ids[(i + d + ids.length) % ids.length];
    var nb = hsBox.querySelector('.s1-b[data-hs="' + nx + '"]'); if (nb) nb.focus();
    if (o.arrowTap) tap(nx);
  });
  svg.addEventListener("click", function(e){
    var t = e.target.closest ? e.target.closest("[data-hs]") : null, id = t ? t.getAttribute("data-hs") : null;
    if (id && !o.hotspots.some(function(hs){ return hs.id === id; })) id = null;
    if (!id) {
      var r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * w, y = (e.clientY - r.top) / r.height * h, best = 41;
      o.hotspots.forEach(function(hs){ hs.zones.forEach(function(z){ var dx = Math.max(z[0] - x, 0, x - z[0] - z[2]), dy = Math.max(z[1] - y, 0, y - z[1] - z[3]), dd = Math.sqrt(dx * dx + dy * dy); if (dd < best) { best = dd; id = hs.id; } }); });
    }
    if (id) tap(id);
  });
  render();
  return {
    select:function(id){ sel = id; paint(); },
    marks:function(m){ marks = m || {}; paint(); },
    names:function(m){ names = m || {}; paintTags(); },
    tags:function(list){ free = list || []; paintTags(); },
    over:function(){ return $(".s1-over", svg); },
    svg:function(){ return svg; },
    redraw:function(){ redraw(); },
    setAria:function(t){ svg.setAttribute("aria-label", t); },
    labels:function(fn){ $$(".s1-b", hsBox).forEach(function(b){ b.setAttribute("aria-label", fn(b.dataset.hs)); }); }
  };
}

// ---------- nephron geometry (viewBox 420 × 360: cortex above y = 150, medulla below; capsule top left, duct on the right) ----------
var GX = 78, GY = 70, GATES = [172, 202, 232, 262, 292, 322];
function arcPts(cx, cy, r, a0, a1, step){ var out = [], n = Math.max(1, Math.round(Math.abs(a1 - a0) / step)); for (var i = 0; i <= n; i++) { var a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return out; }
function wave(x0, x1, yc, amp, halves){ var out = []; for (var x = x0; x <= x1 + 0.01; x += 3) out.push([x, yc - amp * Math.sin((x - x0) / (x1 - x0) * halves * Math.PI)]); return out; }
var MK = {}, TUBE = (function(){
  var P = [];
  function add(list){ list.forEach(function(p){ var l = P[P.length - 1]; if (!l || Math.hypot(l[0] - p[0], l[1] - p[1]) > 0.5) P.push(p); }); }
  add(arcPts(GX, GY, 27, -100, 0, 20)); MK.capsEnd = P.length - 1;
  add([[112, 70]]); add(wave(114, 194, 70, 14, 3)); MK.pctWave = P.length - 1;
  add([[201, 80], [205, 94], [206, 140]]); MK.pctEnd = P.length - 1;
  add([[206, 230], [206, 318]]); var k = P.length - 1;
  add(arcPts(226, 318, 20, 180, 0, 15)); MK.tip = k + 6;
  add([[246, 230], [246, 140]]); MK.loopEnd = P.length - 1;
  add([[247, 118], [252, 100]]); add(wave(258, 340, 96, 11, 3)); add([[354, 88], [370, 86]]); MK.dctEnd = P.length - 1;
  add([[370, 200], [370, 340]]); MK.end = P.length - 1;
  return P;
})();
var BIN = [[2, 50], [30, 56], [60, 64], [GX, GY]];
var AFF = [[2, 50], [30, 56], [60, 64]], EFF = [[64, 84], [48, 102], [56, 120], [62, 124]];
function mkPath(pts){ var c = [0]; for (var i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { p:pts, c:c, len:c[c.length - 1] }; }
function posAt(path, d){
  var p = path.p, c = path.c; if (d <= 0) return p[0].slice(); if (d >= path.len) return p[p.length - 1].slice();
  var lo = 0, hi = c.length - 1; while (hi - lo > 1) { var m = (lo + hi) >> 1; if (c[m] <= d) lo = m; else hi = m; }
  var k = (d - c[lo]) / ((c[hi] - c[lo]) || 1); return [lerp(p[lo][0], p[hi][0], k), lerp(p[lo][1], p[hi][1], k)];
}
var FULL = mkPath(BIN.concat(TUBE)), BOUNCE = mkPath(BIN.concat([[90, 58], [80, 70]], EFF, [[120, 124]])), CDP = mkPath([[370, 86], [370, 340]]);
var D = (function(){ var o = BIN.length, c = FULL.c; return { filt:c[o], caps:c[o + MK.capsEnd], pctW:c[o + MK.pctWave], pct:c[o + MK.pctEnd], tip:c[o + MK.tip], loop:c[o + MK.loopEnd], dct:c[o + MK.dctEnd], end:FULL.len }; })();
function dOf(pts){ return "M" + pts.map(function(p){ return f1(p[0]) + " " + f1(p[1]); }).join(" L"); }
var SEGD = {
  pct:dOf(TUBE.slice(MK.capsEnd, MK.pctEnd + 1)), desc:dOf(TUBE.slice(MK.pctEnd, MK.tip + 1)), asc:dOf(TUBE.slice(MK.tip, MK.loopEnd + 1)),
  dct:dOf(TUBE.slice(MK.loopEnd, MK.dctEnd + 1)), cd:"M370 24 L370 350"
};
var CAPD = "M62 124 L184 124 Q190 124 190 132 L190 320 A36 36 0 0 0 262 320 L262 142 Q262 136 268 136 L346 136";
function openGates(n){ return n >= 6 ? [0, 1, 2, 3, 4, 5] : n >= 3 ? [0, 2, 4] : []; }
// nephronSVG({ pid (unique pattern prefix), bands (medulla gradient in three hatch densities), open (gates open: 0, 3 or 6),
//   maxC (medulla labels), hero (no zone labels) })
function nephronSVG(o){
  var p = o.pid, h = "", i;
  h += "<defs>" + [["1", 11], ["2", 6.5], ["3", 3.8]].map(function(x){ return '<pattern id="' + p + "h" + x[0] + '" patternUnits="userSpaceOnUse" width="' + x[1] + '" height="' + x[1] + '" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="' + x[1] + '" class="ur-hl"/></pattern>'; }).join("") + "</defs>";
  if (o.bands) h += sv("rect", { x:0, y:150, width:420, height:70, fill:"url(#" + p + "h1)" }) + sv("rect", { x:0, y:220, width:420, height:70, fill:"url(#" + p + "h2)" }) + sv("rect", { x:0, y:290, width:420, height:70, fill:"url(#" + p + "h3)" });
  else h += sv("rect", { x:0, y:150, width:420, height:210, fill:"url(#" + p + "h1)" });
  h += sv("line", { x1:0, y1:150, x2:420, y2:150, "class":"ur-zone" });
  if (!o.hero) h += sv("text", { x:6, y:144, "class":"ur-svgt mut" }, "Cortex") + sv("text", { x:6, y:165, "class":"ur-svgt mut" }, "Medulla");
  h += sv("path", { d:CAPD, "class":"ur-cap", "data-hs":"ptc" });
  h += '<g data-hs="aff">' + sv("path", { d:dOf(AFF), "class":"ur-vw", "stroke-width":10 }) + sv("path", { d:dOf(AFF), "class":"ur-vl", "stroke-width":5.5 }) + "</g>";
  h += '<g data-hs="eff">' + sv("path", { d:dOf(EFF), "class":"ur-vw", "stroke-width":7 }) + sv("path", { d:dOf(EFF), "class":"ur-vl", "stroke-width":3.2 }) + "</g>";
  h += sv("circle", { cx:GX, cy:GY, r:32, "class":"ur-capfill", "data-hs":"caps" });
  var P = function(a, r){ a = a * Math.PI / 180; return f1(GX + r * Math.cos(a)) + " " + f1(GY + r * Math.sin(a)); };
  h += sv("path", { d:"M" + P(200, 32) + " A32 32 0 0 1 " + P(350, 32) + " M" + P(10, 32) + " A32 32 0 0 1 " + P(160, 32), "class":"ur-capsule", "data-hs":"caps" });
  var g = ""; [[-8, -8], [6, -10], [11, 2], [3, 11], [-9, 7], [0, 0], [-12, -1]].forEach(function(c){ g += sv("circle", { cx:GX + c[0], cy:GY + c[1], r:6.6, "class":"ur-knot" }); });
  h += '<g data-hs="glom">' + g + "</g>";
  ["pct", "desc", "asc", "dct", "cd"].forEach(function(s){ h += sv("path", { d:SEGD[s], "class":"ur-tw", "data-hs":s }); });
  ["pct", "desc", "asc", "dct", "cd"].forEach(function(s){ h += sv("path", { d:SEGD[s], "class":"ur-tl", "data-hs":s }); });
  var og = openGates(o.open || 0);
  for (i = 0; i < GATES.length; i++) h += sv("rect", { x:362.5, y:GATES[i] - 5, width:5, height:10, rx:1.5, "class":"ur-gate " + (og.indexOf(i) >= 0 ? "on" : "off") });
  h += sv("path", { d:"M370 351 L370 358 M366 354 L370 358 L374 354", "class":"ur-arr" });
  if (!o.hero) h += sv("text", { x:380, y:346, "class":"ur-svgt mut" }, "urine");
  if (o.bands && o.maxC) h += sv("text", { x:96, y:168, "class":"ur-svgt" }, "300 mOsm/L") + sv("text", { x:96, y:258, "class":"ur-svgt mut" }, "saltier ↓") + sv("text", { x:96, y:350, "class":"ur-svgt" }, MV.num(o.maxC) + " mOsm/L");
  return h;
}

// ---------- the model (plan §Explore, deterministic teaching values) ----------
var MAXC = { short:600, medium:1200, long:3000 }, ADHG = { none:0, moderate:3, high:6 };
function uConc(loop, adh){ var m = MAXC[loop]; return adh === "none" ? 100 : adh === "moderate" ? m / 3 : m; }
function uVol(loop, adh){ return 600 / uConc(loop, adh); }
var SUBN = { water:"water", glucose:"glucose", na:"Na⁺", urea:"urea", protein:"plasma protein", rbc:"red blood cells" };
var SEGS = ["caps", "pct", "loop", "dct", "cd"];
// percentage of the filtered amount still in the tubule at the end of each segment (index 0–4); null = "present"
function pctList(sub, s){
  if (sub === "water") return [100, 35, 20, 10, uVol(s.loop, s.adh) / 180 * 100];
  if (sub === "na") return [100, 35, 10, 4, 1];
  if (sub === "urea") return [100, 50, 50, 50, 40];
  if (sub === "glucose") return +s.bg > 10 ? [100, null, null, null, null] : [100, 0, 0, 0, 0];
  return s.glom === "leaky" ? [null, null, null, null, null] : [0, 0, 0, 0, 0];
}
function aboutPct(v){ return "about " + (v >= 0.95 ? MV.num(Math.round(v)) : MV.num(Number(v.toPrecision(1)))) + "%"; }
function pctText(sub, s, k, short){
  var v = pctList(sub, s)[k];
  if (sub === "protein" || sub === "rbc") return v === null ? "Present" : (short ? "0%" : "0% (not filtered)");
  if (v === null) return short ? "present" : "Present (carriers saturated)";
  if (k === 4 && (sub === "water" || sub === "na")) return aboutPct(v);
  return v + "%";
}

// ---------- molecule tokens and dot animation (shared by the hero, the explorer and the task) ----------
function hexPts(r){ var s = ""; for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i + Math.PI / 6; s += (i ? " L" : "M") + f1(r * Math.cos(a)) + " " + f1(r * Math.sin(a)); } return s + "Z"; }
function tokSVG(sub){
  if (sub === "water") return '<g class="ur-dot" opacity="0"><circle r="3.6" class="ur-d-w"/></g>';
  if (sub === "glucose") return '<g class="ur-dot" opacity="0"><path d="' + hexPts(4.6) + '" class="ur-d-g"/></g>';
  if (sub === "urea") return '<g class="ur-dot" opacity="0"><circle r="3.4" class="ur-d-u"/></g>';
  if (sub === "na") return '<g class="ur-dot" opacity="0"><rect x="-9.5" y="-6" width="19" height="12" rx="6" class="ur-d-na"/><text y="3" class="ur-d-t">Na⁺</text></g>';
  if (sub === "salt") return '<g class="ur-dot" opacity="0"><rect x="-2.6" y="-2.6" width="5.2" height="5.2" class="ur-d-na"/></g>';
  if (sub === "protein") return '<g class="ur-dot" opacity="0"><circle r="7" class="ur-d-p"/><path d="M-4 0 q2 -4 4 0 t4 0" class="ur-d-p"/></g>';
  return '<g class="ur-dot" opacity="0"><ellipse rx="8.5" ry="5.2" class="ur-d-p"/><ellipse rx="4" ry="2" class="ur-d-p thin"/></g>';
}
function exitTgt(d){
  var p = posAt(FULL, d);
  if (d < D.pct) return [p[0], 122];
  if (d < D.tip) return [190, p[1]];
  if (d < D.loop) return [262, p[1]];
  if (d < D.dct) return [p[0], 134];
  return [348, p[1]];
}
// one dot per spec: { sub, path, exit (distance) or null, stop (distance), tgt }
function exitRange(k, sub){
  if (k === 1) return [D.caps + 8, D.pctW];
  if (k === 2) return sub === "water" ? [D.pct + 12, D.tip - 14] : sub === "na" || sub === "salt" ? [D.tip + 14, D.loop - 12] : [D.pct + 12, D.loop - 12];
  if (k === 3) return [D.loop + 45, D.dct - 25];
  return [D.dct + 40, D.end - 30];
}
// counts: dots left at the end of each segment [n0, n1, n2, n3, n4]; returns specs
function flowSpecs(sub, R, gateYs){
  var N = R[0], out = [], stayRank = 0;
  for (var i = 0; i < N; i++) {
    var k = 0; for (var j = 1; j <= 4; j++) if (i >= R[j] && i < R[j - 1]) k = j;
    if (!k) { out.push({ sub:sub, path:FULL, exit:null, stop:D.end - 6 - 8 * stayRank++ }); continue; }
    var rg = exitRange(k, sub), lo = R[k], hi = R[k - 1], fr = (i - lo + 0.5) / (hi - lo), e = rg[0] + (rg[1] - rg[0]) * fr;
    if (k === 4 && gateYs && gateYs.length) e = D.dct + (gateYs[(i - lo) % gateYs.length] - 86);
    out.push({ sub:sub, path:FULL, exit:e, tgt:exitTgt(e) });
  }
  return out;
}
function traceSpecs(s){
  var sub = s.sub;
  if (sub === "protein" || sub === "rbc") {
    var out = [];
    for (var i = 0; i < 8; i++) out.push(s.glom === "leaky" && i % 3 === 1 ? { sub:sub, path:FULL, exit:null, stop:D.end - 8 - 12 * ((i - 1) / 3) } : { sub:sub, path:BOUNCE, exit:null, stop:BOUNCE.len, fade:true });
    return out;
  }
  var pc = pctList(sub, s), N = 20;
  if (sub === "glucose" && pc[1] === null) pc = [100, 30, 30, 30, 30];
  var R = pc.map(function(v, k){ var r = Math.round(N * v / 100); if (k === 4 && v > 0 && r < 1) r = 1; return r; });
  for (var k = 1; k < 5; k++) R[k] = Math.min(R[k], R[k - 1]);
  if (sub === "water" && s.adh === "none") R[4] = R[3];
  var og = openGates(ADHG[s.adh]).map(function(g){ return GATES[g]; });
  return flowSpecs(sub, R, og);
}
// place every dot at time t (0–1): dot i starts at spread × i/N and covers the reference length in `travel`
function placeDots(box, dots, t, spread, travel, Lref){
  var kids = box.children, N = dots.length;
  dots.forEach(function(dt, i){
    var el = kids[i]; if (!el) return;
    var dd = clamp((t - spread * i / Math.max(1, N)) / travel, 0, 1) * Lref, pos, op = dd > 0 ? 1 : 0;
    if (dt.exit != null && dd > dt.exit) { var k = clamp((dd - dt.exit) / 28, 0, 1); pos = [lerp(posAt(dt.path, dt.exit)[0], dt.tgt[0], k), lerp(posAt(dt.path, dt.exit)[1], dt.tgt[1], k)]; op = 1 - 0.62 * k; }
    else { var sp = dt.stop != null ? dt.stop : dt.path.len; pos = posAt(dt.path, Math.min(dd, sp)); if (dt.fade && dd >= sp) op = 0.35; }
    el.setAttribute("transform", "translate(" + f1(pos[0]) + "," + f1(pos[1]) + ")"); el.setAttribute("opacity", f1(op * 100) / 100);
  });
}
// collecting-duct flow (Change the conditions): 12 water dots; the ones that leave pass out through open aquaporin gates
function cdSpecs(s, gatesOpen){
  var V = uVol(s.loop, s.adh), stay = clamp(Math.round(12 * V / 6), 1, 12), og = openGates(gatesOpen).map(function(g){ return GATES[g]; }), out = [];
  if (!og.length) stay = 12;
  for (var i = 0; i < 12; i++) {
    if (i < stay) { out.push({ sub:"water", path:CDP, exit:null, stop:CDP.len - 4 - 7 * i }); continue; }
    var gy = og[(i - stay) % og.length], e = gy - 86;
    out.push({ sub:"water", path:CDP, exit:e, tgt:[346, gy + 6] });
  }
  return out;
}

// ---------- concentration strip graph and urine dipstick ----------
function stripSVG(loop, U){
  var M = MAXC[loop], X = { cap:52, pct:112, tip:200, asc:276, dct:326, cd:404 }, y = function(v){ return 150 - v / 3000 * 124; }, h = "";
  [0, 1000, 2000, 3000].forEach(function(v){ h += sv("line", { x1:44, y1:y(v), x2:410, y2:y(v), "class":"ur-grid" }) + sv("text", { x:40, y:y(v) + 4, "class":"ur-svgt sm", "text-anchor":"end" }, MV.num(v)); });
  var F = [[X.cap, 300], [X.pct, 300], [X.tip, M], [X.asc, 100], [X.dct, 100], [X.cd, U]], Md = [[X.cap, 300], [X.pct, 300], [X.tip, M], [X.asc, 300], [X.dct, 300], [X.cd, M]];
  var pd = function(L){ return "M" + L.map(function(p){ return f1(p[0]) + " " + f1(y(p[1])); }).join(" L"); };
  h += sv("path", { d:pd(Md), "class":"ur-med" }) + sv("path", { d:pd(F), "class":"ur-fil" });
  F.forEach(function(p){ h += sv("circle", { cx:p[0], cy:y(p[1]), r:3, "class":"ur-fdot" }); });
  h += sv("text", { x:X.tip, y:y(M) - 7, "class":"ur-svgt sm b", "text-anchor":"middle" }, MV.num(M)) + sv("text", { x:X.asc, y:y(100) + 14, "class":"ur-svgt sm", "text-anchor":"middle" }, "100") + sv("text", { x:X.cd - 4, y:y(U) - 7, "class":"ur-svgt sm b", "text-anchor":"end" }, MV.num(Math.round(U)));
  [["Capsule", X.cap, "middle"], ["Loop tip", X.tip, "middle"], ["Distal", X.dct, "middle"], ["Urine", X.cd, "end"]].forEach(function(l){ h += sv("text", { x:l[1], y:168, "class":"ur-svgt sm", "text-anchor":l[2] }, l[0]); });
  h += sv("line", { x1:60, y1:10, x2:84, y2:10, "class":"ur-fil" }) + sv("text", { x:88, y:14, "class":"ur-svgt sm" }, "Filtrate") + sv("line", { x1:160, y1:10, x2:184, y2:10, "class":"ur-med" }) + sv("text", { x:188, y:14, "class":"ur-svgt sm" }, "Medulla fluid around it") + sv("text", { x:410, y:14, "class":"ur-svgt sm", "text-anchor":"end" }, "mOsm/L");
  var aria = "Concentration along the nephron (mOsm/L). Filtrate: 300 in the capsule and proximal tubule, " + M + " at the loop tip, 100 leaving the ascending limb and in the distal tubule, " + Math.round(U) + " in the urine. Medulla fluid: 300 in the cortex, rising to " + M + " deep in the medulla.";
  return '<svg class="ur-strip" viewBox="0 0 420 176" role="img" aria-label="' + MV.esc(aria) + '">' + h + "</svg>";
}
function dipHTML(V, U, glu, pro){
  function pad(l, v, flag){ return '<div class="ur-pad' + (flag ? " flag" : "") + '"><span class="ur-pad-l">' + l + '</span><span class="ur-pad-v">' + (flag ? "! " : "") + v + "</span></div>"; }
  return '<div class="ur-dip" role="group" aria-label="Urine dipstick"><p class="ur-dip-h">Urine dipstick</p><div class="ur-pads">' + pad("Volume", fmt(V) + " L/day") + pad("Concentration", MV.num(Math.round(U)) + " mOsm/L") + pad("Glucose", glu ? "Present" : "None", glu) + pad("Protein", pro ? "Present" : "None", pro) + "</div></div>";
}

// ---------- Explore: nephron explorer (S1 diagram + S4 membrane gates) ----------
var EXP_HS = [
  { id:"caps", zones:[[46, 38, 64, 64]] },
  { id:"pct", zones:[[112, 48, 90, 40], [198, 88, 16, 52]] },
  { id:"loop", zones:[[196, 150, 60, 196]] },
  { id:"dct", zones:[[250, 80, 104, 32], [240, 108, 16, 32]] },
  { id:"cd", zones:[[358, 24, 24, 326]] }
];
var PCT_TAG = { caps:[4, 28, "l"], pct:[198, 142, "r"], loop:[254, 142, "l"], dct:[300, 70, "c"], cd:[362, 334, "r"] };
function explore(host, api){
  var C = api.content, SEG = C.segments, S = api.S;
  var DEF = { mode:"trace", sub:"water", adh:"moderate", bg:"5", glom:"intact", loop:"medium", seg:"loop" };
  Object.keys(DEF).forEach(function(k){ if (S[k] == null) S[k] = DEF[k]; });
  var hold = null, disp = null, anim = 0, dots = [], readSig = "";
  host.innerHTML = '<div class="pg ur-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div id="ur-dx"></div><p class="ur-caption" id="ur-cap"></p><div id="ur-strip"></div><p class="tiny muted ur-note"><span class="bio-model">Model data</span> ' + C.modelNote + "</p></div>" +
    '<div class="pg-ctrl"><div id="ur-mode"></div><div id="ur-sub"></div><div id="ur-adh"></div><div id="ur-bg"></div><div id="ur-glom"></div><div id="ur-loop"></div><div><button type="button" class="btn ghost sm" id="ur-replay" data-k="urreplay">Replay the animation</button></div></div>' +
    '<div class="pg-read"><details class="ur-readbox" open><summary>Readout</summary><dl class="read" id="ur-read" aria-live="polite"></dl></details><div id="ur-dip"></div></div></div>';
  function st(){ return { mode:S.mode, sub:S.sub, adh:hold && hold.adh ? hold.adh : S.adh, bg:S.bg, glom:S.glom, loop:S.loop }; }
  var dx = diagramExplorer($("#ur-dx"), { vb:[420, 360], key:"ex", ordered:true, arrowTap:true, groupLabel:"Nephron segments, in filtrate order",
    draw:function(){ var s = st(); return nephronSVG({ pid:"ex", bands:S.mode === "conc", open:ADHG[s.adh], maxC:MAXC[s.loop] }); },
    aria:aria, hotspots:EXP_HS.map(function(h){ return { id:h.id, label:SEG[h.id].name, zones:h.zones }; }), onTap:onTap });
  var modeR = radios($("#ur-mode"), { label:"Mode", options:[{ id:"trace", t:"Trace a substance" }, { id:"conc", t:"Concentration map" }, { id:"cond", t:"Change the conditions" }], value:S.mode, onChange:function(v){ S.mode = v; changed(true); } });
  var subR = radios($("#ur-sub"), { label:"Substance", cls:"chips", options:Object.keys(SUBN).map(function(k){ return { id:k, t:SUBN[k].charAt(0).toUpperCase() + SUBN[k].slice(1) }; }), value:S.sub, onChange:function(v){ S.sub = v; changed(true); } });
  var adhR = radios($("#ur-adh"), { label:"ADH level", options:[{ id:"none", t:"None" }, { id:"moderate", t:"Moderate" }, { id:"high", t:"High" }], value:S.adh, onChange:function(v){ S.adh = v; changed(true); } });
  var bgR = radios($("#ur-bg"), { label:"Blood glucose (mmol/L)", cls:"chips", options:["4", "5", "7", "10", "12", "15", "20"].map(function(v){ return { id:v, t:v }; }), value:S.bg, onChange:function(v){ S.bg = v; changed(true); } });
  var glomR = radios($("#ur-glom"), { label:"Glomerulus", options:[{ id:"intact", t:"Intact" }, { id:"leaky", t:"Leaky" }], value:S.glom, onChange:function(v){ S.glom = v; changed(true); } });
  var loopR = radios($("#ur-loop"), { label:"Loop of Henle", options:[{ id:"short", t:"Short" }, { id:"medium", t:"Medium (human)" }, { id:"long", t:"Long" }], value:S.loop, onChange:function(v){ S.loop = v; changed(true); } });
  $("#ur-replay").addEventListener("click", function(){ animate(); });
  function sync(){ modeR.set(S.mode); subR.set(S.sub); adhR.set(S.adh); bgR.set(S.bg); glomR.set(S.glom); loopR.set(S.loop); $("#ur-sub").hidden = S.mode !== "trace"; $("#ur-replay").hidden = S.mode === "conc"; }
  function changed(run){ hold = null; disp = null; api.save(); sync(); dx.redraw(); paint(); MV.changed(); if (run) animate(); else still(); }
  function onTap(id){ S.seg = id; dx.select(id); api.save(); paint(); MV.changed(); }
  function aria(){
    var s = st();
    return "Nephron: blood enters the glomerulus inside Bowman’s capsule; the proximal tubule winds through the cortex; the loop of Henle dips into the medulla; the distal tubule joins the collecting duct, which runs down through the medulla to the urine. Peritubular capillaries run beside the tubule. Aquaporin gates open on the collecting duct: " + openGates(ADHG[s.adh]).length + " of 6." + (S.mode === "conc" ? " The medulla’s hatching gets denser with depth: 300 mOsm/L at the top, " + MAXC[s.loop] + " deepest." : "");
  }
  function paint(){
    var s = st(), seg = S.seg, k = SEGS.indexOf(seg), U = uConc(s.loop, s.adh), V = uVol(s.loop, s.adh);
    if (disp) { V = disp.V; U = 600 / V; }
    var sub = S.mode === "trace" ? S.sub : "water", glu = +s.bg > 10, pro = s.glom === "leaky";
    var concTxt = k < 0 ? "—" : k <= 1 ? "300 mOsm/L" : k === 2 ? "100 mOsm/L leaving (" + MV.num(MAXC[s.loop]) + " at the tip)" : k === 3 ? "100 mOsm/L" : MV.num(Math.round(U)) + " mOsm/L";
    var rows = [
      ["Segment", k >= 0 ? SEG[seg].row : '<span class="muted">Tap a segment of the nephron</span>'],
      ["Process here", k >= 0 ? SEG[seg].proc : "—"],
      ["% of filtered " + SUBN[sub] + " left", k >= 0 ? (disp && k === 4 && sub === "water" ? aboutPct(V / 180 * 100) : pctText(sub, s, k)) : "—"],
      ["Filtrate concentration here", concTxt],
      ["Medulla fluid concentration (deepest)", MV.num(MAXC[s.loop]) + " mOsm/L"],
      ["Urine", fmt(V) + " L/day at " + MV.num(Math.round(U)) + " mOsm/L"],
      ["Glucose in urine", glu ? "<strong>Present</strong>" : "None"],
      ["Protein in urine", pro ? "<strong>Present</strong>" : "None"]
    ];
    var sig = JSON.stringify(rows); if (sig !== readSig) { readSig = sig; $("#ur-read").innerHTML = MV.readoutHTML(rows); }
    $("#ur-dip").innerHTML = S.mode === "cond" ? dipHTML(V, U, glu, pro) : "";
    $("#ur-strip").innerHTML = S.mode === "conc" ? stripSVG(s.loop, U) : "";
    var cap = S.mode === "trace" ? "Trace: " + SUBN[S.sub] + ". Dots leave the tubule into the capillaries wherever they’re reabsorbed; each tag shows how much of the filtered amount is still in the tubule." :
      S.mode === "conc" ? "Concentration map: denser hatching means a saltier medulla. Aquaporin gates on the collecting duct open with ADH: " + openGates(ADHG[s.adh]).length + " of 6 open." :
      "Change the conditions and read the urine dipstick. Water dots in the collecting duct leave through open aquaporin gates.";
    $("#ur-cap").textContent = cap;
    dx.select(seg); dx.setAria(aria());
  }
  // overlays
  function overlay(){ var ov = dx.over(); if (!ov) return null; ov.innerHTML = '<g class="ur-dots"></g>'; return $(".ur-dots", ov); }
  function traceTags(t){
    var s = st(), front = clamp(t / 0.66, 0, 1) * FULL.len, bound = [D.caps, D.pct, D.loop, D.dct, D.end], out = [];
    SEGS.forEach(function(sg, k){ if (front >= bound[k] - 0.5) { var p = PCT_TAG[sg], txt = pctText(S.sub, s, k, true); out.push({ x:p[0], y:p[1], align:p[2], html:(k === 0 ? (txt === "0%" ? "0% filtered" : txt === "present" || txt === "Present" ? "some filtered" : txt + " filtered") : txt + (/%$/.test(txt) ? " left" : "")), cls:"ur-ptag" }); } });
    var sig = JSON.stringify(out); if (sig !== traceTags.sig) { traceTags.sig = sig; dx.tags(out); }
  }
  function stop(){ if (anim) { anim(); anim = 0; } }
  function still(){
    stop(); traceTags.sig = ""; dx.tags([]);
    if (S.mode === "trace") { var b = overlay(); dots = traceSpecs(st()); b.innerHTML = dots.map(function(d){ return tokSVG(d.sub); }).join(""); placeDots(b, dots, 1, 0.3, 0.66, FULL.len); traceTags(1); }
    else if (S.mode === "cond") { var c = overlay(); dots = cdSpecs(st(), ADHG[st().adh]); c.innerHTML = dots.map(function(d){ return tokSVG(d.sub); }).join(""); placeDots(c, dots, 1, 0.45, 0.5, CDP.len); }
    else overlay();
  }
  function animate(done, dur){
    stop(); traceTags.sig = ""; dx.tags([]);
    if (S.mode === "conc") { overlay(); if (done) done(); return; }
    var b = overlay(), tr = S.mode === "trace";
    dots = tr ? traceSpecs(st()) : cdSpecs(st(), ADHG[st().adh]);
    b.innerHTML = dots.map(function(d){ return tokSVG(d.sub); }).join("");
    anim = MV.tween({ dur:dur || (tr ? 5200 : 2600), ease:function(t){ return t; },
      step:function(t){ if (tr) { placeDots(b, dots, t, 0.3, 0.66, FULL.len); traceTags(t); } else placeDots(b, dots, t, 0.45, 0.5, CDP.len); },
      done:function(){ anim = 0; if (tr) { placeDots(b, dots, 1, 0.3, 0.66, FULL.len); traceTags(1); } else placeDots(b, dots, 1, 0.45, 0.5, CDP.len); if (done) done(); } });
  }
  sync(); dx.select(S.seg); paint(); still();

  function chal(id){
    var U = uConc(S.loop, S.adh), V = uVol(S.loop, S.adh), bg = +S.bg, leaky = S.glom === "leaky";
    if (id === "tc1") {
      if (bg > 10 && !leaky) return { ok:true };
      if (bg === 10) return { ok:false, msg:"At the threshold the carriers just keep up: no glucose in urine." };
      if (bg > 10 && leaky) return { ok:false, msg:"Protein appears too." };
      return { ok:false };
    }
    if (id === "tc2") {
      if (S.loop === "medium" && S.adh === "high" && bg <= 10 && !leaky) return { ok:true };
      if (S.loop === "long" && S.adh === "high") return { ok:false, msg:"3000 mOsm/L: steeper than a human loop makes." };
      if (S.loop === "medium" && S.adh === "moderate") return { ok:false, msg:"400 mOsm/L: ADH isn’t high enough." };
      if (!(S.loop === "medium" && S.adh === "high")) return { ok:false, msg:"Your urine is " + fmt(V) + " L/day at " + MV.num(Math.round(U)) + " mOsm/L; the sample is 0.5 L/day at 1200 mOsm/L." };
      if (bg > 10) return { ok:false, msg:"Glucose present." };
      return { ok:false, msg:"Protein present: the sample has none." };
    }
    if (id === "tc3") {
      if (S.loop === "long" && S.adh === "high") return { ok:true };
      if (S.loop === "long" && S.adh === "moderate") return { ok:false, msg:"The gradient is there, but the collecting duct isn’t open enough to use it." };
      if (S.loop === "medium" && S.adh === "high") return { ok:false, msg:"A medium loop can’t build a gradient beyond 1200." };
      if (S.loop === "short" && S.adh === "high") return { ok:false, msg:"A short loop builds a gradient of only 600 mOsm/L." };
      return { ok:false, msg:"That urine is " + MV.num(Math.round(U)) + " mOsm/L, well below 2000." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        var s = p.start; stop(); hold = null; disp = null;
        S.mode = s.mode;
        if (s.sub) S.sub = s.sub;
        if (s.bg) S.bg = String(s.bg);
        if (s.glom) S.glom = s.glom;
        if (s.mode === "cond") { S.loop = "medium"; S.adh = s.adh; S.glom = "intact"; hold = { adh:"moderate" }; S.seg = "cd"; }
        else S.seg = s.sub === "glucose" ? "pct" : "caps";
        api.save(); sync(); dx.redraw(); paint(); overlay(); dx.tags([]);
      },
      run:function(p, done){
        if (p.id === "p3") {
          var V0 = uVol(S.loop, "moderate"), V1 = uVol(S.loop, S.adh);
          hold = null; disp = { V:V0 }; dx.redraw(); paint();
          var b = overlay(); dots = cdSpecs(st(), 0); b.innerHTML = dots.map(function(d){ return tokSVG(d.sub); }).join("");
          anim = MV.tween({ dur:3000, ease:function(t){ return t; }, step:function(t){ disp.V = lerp(V0, V1, t); paint(); placeDots(b, dots, t, 0.45, 0.5, CDP.len); },
            done:function(){ anim = 0; disp = null; paint(); placeDots(b, dots, 1, 0.45, 0.5, CDP.len); done(); } });
          return;
        }
        if (p.id === "p4") {
          animate(function(){ S.glom = "leaky"; api.save(); sync(); paint(); MV.changed(); MV.wait(MV.reduceMotion ? 0 : 400, function(){ animate(done, 4200); }); }, 3600);
          return;
        }
        animate(done);
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: hormones that tune the kidney ----------
function part3(host, api){
  var C = api.content, S = api.S;
  if (!S.st) S.st = "adh";
  host.innerHTML = '<div class="ur-sttabs" id="ur-sttabs"></div>' + C.stations.map(function(s){ return '<section class="ur-station" data-st="' + s.id + '" id="ur-st-' + s.id + '" aria-label="' + MV.esc(MV.plain(s.t)) + '"></section>'; }).join("");
  radios($("#ur-sttabs"), { label:"Station", aria:"Stations", options:C.stations, value:S.st, onChange:function(v){ S.st = v; api.save(); show(); } });
  function show(){ $$(".ur-station", host).forEach(function(d){ d.hidden = d.dataset.st !== S.st; }); }
  stAdh($("#ur-st-adh"), C.adh, S, api);
  stRaas($("#ur-st-raas"), C.raas, S, api);
  stPh($("#ur-st-ph"), C.ph, S, api);
  stUa($("#ur-st-ua"), C.ua, S, api);
  stDia($("#ur-st-dia"), C.dia, S, api);
  show();
}
// @component S8 feedbackLoop — six boxes in a ring (stimulus → receptor → control → effector → response → back), stepped one at a time
function feedbackLoop(el, list, n, hiIdx){
  el.innerHTML = list.map(function(t, i){ return '<li class="ur-lp' + (i < n ? " on" : "") + (i === n - 1 ? " cur" : "") + (i === hiIdx ? " hi" : "") + '"><span class="ur-lpn" aria-hidden="true">' + (i + 1) + "</span><span>" + (i < n ? t : '<span class="vh">Step ' + (i + 1) + ", not shown yet</span>") + "</span></li>"; }).join("");
}
function stepper(el, prefix, total, get, set, paint){
  el.addEventListener("click", function(e){
    var b = e.target.closest("[data-a]"); if (!b || b.disabled) return;
    var n = get(); if (b.dataset.a === "step") n = Math.min(total(), n + 1); else if (b.dataset.a === "all") n = total(); else n = 0;
    set(n); paint();
  });
  return '<div class="q-actions"><button type="button" class="btn primary sm" data-a="step" data-k="' + prefix + 'step">Next step</button><button type="button" class="btn ghost sm" data-a="all" data-k="' + prefix + 'all">Show all</button><button type="button" class="btn ghost sm" data-a="reset" data-k="' + prefix + 'reset">Start again</button></div>';
}
function stAdh(el, c, S, api){
  if (S.alc == null) S.alc = "off"; if (S.adhN == null) S.adhN = 0;
  function list(){ return S.alc === "on" ? c.alcohol : c.loop; }
  el.innerHTML = '<h4 class="ur-h4">Station 1: ADH</h4><p>' + c.intro + '</p><div id="ur-alc"></div><ol class="ur-loop" id="ur-loopl"></ol><p class="tiny muted ur-back">↺ The response feeds back to the start of the loop.</p>' +
    stepper(el, "uradh", function(){ return list().length; }, function(){ return S.adhN; }, function(n){ S.adhN = n; api.save(); }, paint) +
    '<p class="ur-live" id="ur-adhcap" aria-live="polite"></p><dl class="read" id="ur-adhread"></dl>';
  radios($("#ur-alc", el), { label:"Alcohol", options:[{ id:"off", t:"Off" }, { id:"on", t:"On" }], value:S.alc, onChange:function(v){ S.alc = v; S.adhN = 0; api.save(); paint(); } });
  function paint(){
    var L = list(), n = S.adhN;
    MV.keepFocus(el, function(){
      feedbackLoop($("#ur-loopl", el), L, n, 2);
      $('[data-a="step"]', el).disabled = n >= L.length; $('[data-a="all"]', el).disabled = n >= L.length; $('[data-a="reset"]', el).disabled = n === 0;
    });
    $("#ur-adhcap", el).textContent = n ? "Step " + n + ": " + MV.plain(L[n - 1]) : "Press Next step to start.";
    $("#ur-adhread", el).innerHTML = MV.readoutHTML(c.rows[S.alc]);
  }
  paint();
}
function stRaas(el, c, S, api){
  if (S.raasN == null) S.raasN = 0;
  el.innerHTML = '<h4 class="ur-h4">Station 2: Renin–angiotensin–aldosterone</h4><p>' + c.intro + '</p><ol class="ur-path" id="ur-raasl"></ol>' +
    stepper(el, "urraas", function(){ return c.steps.length; }, function(){ return S.raasN; }, function(n){ S.raasN = n; api.save(); }, paint) +
    '<p class="ur-live" id="ur-raascap" aria-live="polite"></p><div class="ur-hcards">' + c.cards.map(function(k){
      return '<div class="ur-hcard ' + k.id + '"><h5>' + k.h + '</h5><dl><div><dt>Released by</dt><dd>' + k.from + "</dd></div><div><dt>Triggered by</dt><dd>" + k.trig + "</dd></div><div><dt>Acts on</dt><dd>" + k.target + "</dd></div><div><dt>Effect</dt><dd><strong>" + k.act + "</strong></dd></div></dl></div>";
    }).join("") + "</div>";
  function paint(){
    var n = S.raasN;
    MV.keepFocus(el, function(){
      $("#ur-raasl", el).innerHTML = c.steps.map(function(t, i){ return '<li class="ur-ps' + (i < n ? " on" : "") + (i === n - 1 ? " cur" : "") + (i === 3 ? " ald" : "") + '"><span class="ur-lpn" aria-hidden="true">' + (i + 1) + "</span><span>" + (i < n ? t : '<span class="vh">Step ' + (i + 1) + ", not shown yet</span>") + "</span></li>"; }).join("");
      $('[data-a="step"]', el).disabled = n >= c.steps.length; $('[data-a="all"]', el).disabled = n >= c.steps.length; $('[data-a="reset"]', el).disabled = n === 0;
    });
    $("#ur-raascap", el).textContent = n ? "Step " + n + ": " + MV.plain(c.steps[n - 1]) : "Press Next step to start.";
  }
  paint();
}
// @component S4 membraneSim (pH zoom) — one tubule cell between the filtrate and the blood; H⁺ secreted, HCO₃⁻ returned
function stPh(el, c, S, api){
  if (S.ph == null) S.ph = 2;
  el.innerHTML = '<h4 class="ur-h4">Station 3: pH balance</h4><p>' + c.intro + '</p><div class="ur-phwrap"><div id="ur-phsvg"></div><div><label class="slider ur-sl"><span class="slider-top"><span>Blood pH</span><output id="ur-pho"></output></span><input type="range" id="ur-phin" min="0" max="6" step="1"></label><p class="tiny muted">' + c.normal + '</p><dl class="read" id="ur-phread" aria-live="polite"></dl></div></div>';
  var inp = $("#ur-phin", el);
  inp.value = S.ph;
  inp.addEventListener("input", function(){ S.ph = +inp.value; api.save(); paint(); });
  function pill(x, y, txt, cls){ var w = txt.length > 3 ? 40 : 26; return '<g transform="translate(' + f1(x) + "," + f1(y) + ')"><rect x="' + (-w / 2) + '" y="-8" width="' + w + '" height="16" rx="8" class="' + cls + '"/><text y="4" class="ur-d-t big">' + txt + "</text></g>"; }
  function paint(){
    var pH = 7.25 + 0.05 * S.ph, lvl = 6 - S.ph, n = 1 + lvl, st = pH < 7.345 ? "Too acidic" : pH > 7.455 ? "Too basic" : "Normal (7.35–7.45)", amt = pH < 7.345 ? "More" : pH > 7.455 ? "Less" : "Normal";
    var h = sv("rect", { x:0, y:0, width:130, height:210, "class":"ur-fl" }) + sv("rect", { x:290, y:0, width:130, height:210, "class":"ur-bl" });
    h += sv("rect", { x:140, y:20, width:140, height:170, rx:18, "class":"ur-cell" }) + sv("text", { x:210, y:42, "class":"ur-svgt b", "text-anchor":"middle" }, "Tubule cell");
    h += sv("text", { x:210, y:104, "class":"ur-svgt sm", "text-anchor":"middle" }, chem("CO2 + H2O")) + sv("text", { x:210, y:120, "class":"ur-svgt sm", "text-anchor":"middle" }, "↓") + sv("text", { x:210, y:136, "class":"ur-svgt sm", "text-anchor":"middle" }, chem("H+ + HCO3-"));
    h += sv("text", { x:65, y:18, "class":"ur-svgt b", "text-anchor":"middle" }, "Filtrate") + sv("text", { x:355, y:18, "class":"ur-svgt b", "text-anchor":"middle" }, "Blood");
    h += sv("path", { d:"M142 150 L112 150 M118 144 L111 150 L118 156", "class":"ur-ph-arr h", "stroke-width":1.5 + lvl * 0.7 }) + sv("path", { d:"M278 150 L308 150 M302 144 L309 150 L302 156", "class":"ur-ph-arr", "stroke-width":1.5 + lvl * 0.7 });
    for (var i = 0; i < n; i++) h += pill(30 + (i % 3) * 34, 46 + Math.floor(i / 3) * 26, chem("H+"), "ur-d-h");
    for (i = 0; i < n; i++) h += pill(320 + (i % 2) * 48, 46 + Math.floor(i / 2) * 26, chem("HCO3-"), "ur-d-b");
    var aria = "Blood pH " + pH.toFixed(2) + ", " + st.toLowerCase() + ". The tubule cell secretes " + amt.toLowerCase() + " H⁺ into the filtrate and returns " + amt.toLowerCase() + " HCO₃⁻ to the blood.";
    $("#ur-phsvg", el).innerHTML = '<svg viewBox="0 0 420 210" class="ur-phsvg" role="img" aria-label="' + MV.esc(aria) + '">' + h + "</svg>";
    $("#ur-pho", el).textContent = pH.toFixed(2); inp.setAttribute("aria-valuetext", "pH " + pH.toFixed(2));
    $("#ur-phread", el).innerHTML = MV.readoutHTML([["Blood pH", pH.toFixed(2)], ["Status", st], ["H⁺ secreted into the filtrate", amt], ["HCO₃⁻ returned to the blood", amt]]);
  }
  paint();
}
function stUa(el, c, S, api){
  S.ua = S.ua || {}; S.uaT = S.uaT || {};
  var sel = null;
  el.innerHTML = '<h4 class="ur-h4">Station 4: Check it with data</h4><p>' + c.intro + '</p><p class="tiny muted"><span class="bio-model">Model data</span> Model values; real values vary.</p><div class="ur-clues" role="group" aria-label="Clues"></div><div class="ur-samples"></div><div id="ur-uafb" aria-live="polite"></div>';
  function paint(){
    var used = {}; Object.keys(S.ua).forEach(function(k){ used[S.ua[k]] = k; });
    MV.keepFocus(el, function(){
      $(".ur-clues", el).innerHTML = c.clues.map(function(q){ var m = S.ua[q.id]; return '<button type="button" class="ur-clue' + (m ? " done" : "") + '" data-clue="' + q.id + '" data-k="urcl' + q.id + '" aria-pressed="' + (sel === q.id) + '"' + (m ? " disabled" : "") + ">" + (m ? "✓ " : "") + q.t + (m ? " → Sample " + m : "") + "</button>"; }).join("");
      $(".ur-samples", el).innerHTML = c.samples.map(function(s){ var cl = used[s.id];
        return '<button type="button" class="ur-sample' + (cl ? " done" : "") + (sel ? " ready" : "") + '" data-smp="' + s.id + '" data-k="ursm' + s.id + '"' + (cl ? " disabled" : "") + '><span class="ur-sname">Sample ' + s.id + '</span><span class="ur-sdl"><span>Volume</span><span>' + s.vol + " L/day</span><span>Glucose</span><span>" + s.glu + "</span><span>Protein</span><span>" + s.pro + "</span><span>Concentration</span><span>" + s.conc + " mOsm/L</span></span>" + (cl ? '<span class="ur-smatch">✓ ' + c.clues.filter(function(q){ return q.id === cl; })[0].t + "</span>" : "") + "</button>";
      }).join("");
    });
  }
  function fb(kind, html){ $("#ur-uafb", el).innerHTML = kind ? MV.fbHTML(kind, html) : (html ? '<p class="fb" role="status">' + html + "</p>" : ""); }
  el.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.clue) { sel = sel === b.dataset.clue ? null : b.dataset.clue; fb("", sel ? "Clue selected. Now tap the sample that fits it." : ""); paint(); return; }
    if (b.dataset.smp) {
      if (!sel) { fb("", "Tap a clue first, then tap the sample that fits it."); return; }
      var q = c.clues.filter(function(x){ return x.id === sel; })[0];
      if (MV.ans(q) === b.dataset.smp) { S.ua[q.id] = b.dataset.smp; fb("good", "<strong>✓ Sample " + b.dataset.smp + ": " + q.t.toLowerCase() + ".</strong> " + q.why); sel = null; }
      else { S.uaT[q.id] = (S.uaT[q.id] || 0) + 1; fb("bad", "<strong>✗ Sample " + b.dataset.smp + " doesn’t fit “" + q.t.toLowerCase() + "”.</strong> " + c.wrong); }
      api.save(); paint(); MV.focusFb(el);
      if (Object.keys(S.ua).length === c.clues.length) $("#ur-uafb", el).insertAdjacentHTML("beforeend", '<p class="sort-done">All four samples are matched to their clues.</p>');
    }
  });
  paint();
}
// @component dialysisSchematic — blood above, dialysis fluid below a dashed membrane; urea arrows scale with the local gradient
function stDia(el, c, S, api){
  if (!S.flow) S.flow = "opposite"; if (!S.fluid) S.fluid = "normal";
  el.innerHTML = '<h4 class="ur-h4">Station 5: Dialysis</h4><p>' + c.intro + '</p><div class="ur-diactl"><div id="ur-flow"></div><div id="ur-fluid"></div></div><div id="ur-diasvg"></div><p class="tiny muted"><span class="bio-model">Model data</span> Model values; real values vary.</p><dl class="read" id="ur-diaread" aria-live="polite"></dl>' +
    '<div class="ur-stse"><h5>Dialysis or a transplant?</h5><div class="ur-stse-g">' + c.stse.map(function(k){ return '<div class="ur-stse-c"><h6>' + k.h + "</h6><p>" + k.t + "</p></div>"; }).join("") + '</div><p class="ur-canada"><strong>In Canada:</strong> ' + c.canada + "</p></div>";
  radios($("#ur-flow", el), { label:"Flow direction", options:[{ id:"same", t:"Same" }, { id:"opposite", t:"Opposite" }], value:S.flow, onChange:function(v){ S.flow = v; api.save(); paint(); } });
  radios($("#ur-fluid", el), { label:"Dialysis fluid", options:[{ id:"normal", t:"Normal glucose and salts, no urea" }, { id:"water", t:"Pure water" }], value:S.fluid, onChange:function(v){ S.fluid = v; api.save(); paint(); } });
  function paint(){
    var opp = S.flow === "opposite", water = S.fluid === "water";
    var bU = opp ? [6, 5, 4, 3, 2, 1] : [6, 5, 4, 4, 3, 3], fU = opp ? [5, 4, 3, 2, 1, 0] : [0, 1, 2, 2, 3, 3];
    var h = sv("rect", { x:0, y:22, width:420, height:78, "class":"ur-bl" }) + sv("rect", { x:0, y:128, width:420, height:78, "class":"ur-fl" });
    h += sv("line", { x1:0, y1:114, x2:420, y2:114, "class":"ur-memb" }) + sv("text", { x:414, y:110, "class":"ur-svgt sm mut", "text-anchor":"end" }, "membrane");
    h += sv("text", { x:6, y:16, "class":"ur-svgt b" }, "Blood →") + sv("text", { x:opp ? 414 : 6, y:224, "class":"ur-svgt b", "text-anchor":opp ? "end" : "start" }, opp ? "← Dialysis fluid" : "Dialysis fluid →");
    for (var i = 0; i < 6; i++) {
      var x = 36 + i * 70, g = bU[i] - fU[i], j;
      for (j = 0; j < bU[i]; j++) h += '<circle cx="' + (x - 14 + (j % 3) * 10) + '" cy="' + (36 + Math.floor(j / 3) * 11) + '" r="3.6" class="ur-d-u"/>';
      for (j = 0; j < fU[i]; j++) h += '<circle cx="' + (x - 14 + (j % 3) * 10) + '" cy="' + (186 - Math.floor(j / 3) * 11) + '" r="3.6" class="ur-d-u"/>';
      h += '<g transform="translate(' + (x + 22) + ',72)"><path d="' + hexPts(4.4) + '" class="ur-d-g"/></g><g transform="translate(' + (x + 22) + ',88)"><rect x="-9" y="-5.5" width="18" height="11" rx="5.5" class="ur-d-na"/><text y="3" class="ur-d-t">Na⁺</text></g>';
      if (!water) h += '<g transform="translate(' + (x + 22) + ',148)"><path d="' + hexPts(4.4) + '" class="ur-d-g"/></g><g transform="translate(' + (x + 22) + ',164)"><rect x="-9" y="-5.5" width="18" height="11" rx="5.5" class="ur-d-na"/><text y="3" class="ur-d-t">Na⁺</text></g>';
      else h += sv("path", { d:"M" + (x + 34) + " 100 L" + (x + 34) + " 130 M" + (x + 30) + " 124 L" + (x + 34) + " 130 L" + (x + 38) + " 124", "class":"ur-ph-arr g" });
      if (g > 0) h += sv("path", { d:"M" + (x - 4) + " 100 L" + (x - 4) + " 128 M" + (x - 9) + " 122 L" + (x - 4) + " 128 L" + (x + 1) + " 122", "class":"ur-ph-arr u", "stroke-width":1 + g * 0.8 });
    }
    var aria = "Hemodialysis schematic. Blood flows left to right above the membrane; dialysis fluid flows " + (opp ? "right to left" : "left to right") + " below it. Urea (grey dots) diffuses down into the fluid " + (opp ? "all along the membrane, so most is removed." : "strongly at first, then hardly at all once the two sides even out, so about half is removed.") + (water ? " With pure water, glucose and Na⁺ diffuse out of the blood too." : " Glucose and Na⁺ are at the same level on both sides, so they stay in the blood.");
    $("#ur-diasvg", el).innerHTML = '<svg viewBox="0 0 420 230" class="ur-diasvg" role="img" aria-label="' + MV.esc(aria) + '">' + h + "</svg>";
    $("#ur-diaread", el).innerHTML = MV.readoutHTML([["Urea removed", opp ? "Most" : "About half"], ["Why", opp ? "Opposite flow keeps a gradient along the whole membrane." : "The two sides even out partway along, so urea stops diffusing."],
      ["Glucose and salts", water ? "<strong>Lost from the blood too</strong>: pure water pulls them out" : "Stay in the blood: equal levels on both sides, no net diffusion"]]);
  }
  paint();
}

// ---------- Practice 1: label the nephron (S1 label-quiz mode) ----------
var LQ_HS = [
  { id:"aff", zones:[[2, 44, 50, 16]], tag:[4, 36, "l"], where:"Wider vessel entering from the left" },
  { id:"caps", zones:[[44, 36, 68, 68]], tag:[100, 22, "l"], where:"Cup at the top left" },
  { id:"glom", zones:[[64, 56, 28, 28]], tag:[78, 70, "c"], where:"Knot inside the cup" },
  { id:"eff", zones:[[42, 84, 22, 34]], tag:[4, 104, "l"], where:"Narrower vessel leaving below" },
  { id:"pct", zones:[[112, 48, 90, 40], [198, 88, 16, 52]], tag:[204, 46, "l"], where:"Twisted tube leaving the cup" },
  { id:"ptc", zones:[[68, 116, 116, 16], [272, 128, 72, 16]], tag:[120, 140, "c"], where:"Thin vessels running beside the tubes" },
  { id:"desc", zones:[[197, 152, 18, 166]], tag:[200, 250, "r"], where:"Left limb running down into the medulla" },
  { id:"asc", zones:[[237, 152, 18, 166]], tag:[252, 200, "l"], where:"Right limb rising after the bend" },
  { id:"dct", zones:[[250, 80, 104, 32], [240, 108, 16, 32]], tag:[352, 68, "r"], where:"Twisted tube near the top right" },
  { id:"cd", zones:[[358, 24, 24, 326]], tag:[366, 300, "r"], where:"Long straight tube on the right" }
];
function labelQuiz(host, api, a){
  var S = api.S; S.done = S.done || {}; S.tries = S.tries || {}; S.hints = S.hints || {};
  var cur = null, msg = null, LB = {}; a.labels.forEach(function(l){ LB[l.id] = l; });
  host.innerHTML = '<div class="lq-labs" id="lq-labs"></div><div id="lq-help"></div><div id="lq-fb" aria-live="polite"></div><div class="lq-dx" id="lq-dx"></div><div id="lq-done"></div>';
  var labs = radios($("#lq-labs", host), { label:"Labels", cls:"chips", options:opts(), value:"", onChange:function(id){ cur = id; msg = null; paint(); } });
  var dx = diagramExplorer($("#lq-dx", host), { vb:[420, 360], key:"lq", groupLabel:"Structures to label",
    draw:function(){ return nephronSVG({ pid:"lq", open:3 }); },
    aria:function(){ return "Unlabelled nephron with its blood vessels: ten structures to name."; },
    hotspots:LQ_HS.map(function(h){ return { id:h.id, label:aria(h.id), zones:h.zones, tag:h.tag }; }), onTap:onTap });
  function aria(id){ var h = LQ_HS.filter(function(x){ return x.id === id; })[0]; return S.done[id] ? LB[id].t + " (labelled)" : h.where; }
  function opts(){ return a.labels.map(function(l){ return { id:l.id, t:(S.done[l.id] ? "✓ " : "") + l.t, dis:!!S.done[l.id] }; }); }
  function onTap(id){
    if (!cur) { msg = { k:"", h:"Tap a label first, then tap the structure it names." }; paint(); return; }
    var L = LB[cur];
    if (id === cur) { S.done[cur] = true; msg = { k:"good", h:"<strong>✓ That’s the " + L.t.charAt(0).toLowerCase() + L.t.slice(1) + ".</strong> " + L.job + "." }; cur = null; labs.setOptions(opts()); labs.set(""); }
    else { S.tries[cur] = (S.tries[cur] || 0) + 1; msg = { k:"bad", h:"<strong>✗ That’s not the " + L.t.charAt(0).toLowerCase() + L.t.slice(1) + ".</strong> " + (a.wrong[cur + ">" + id] || a.wrong[[cur, id].sort().join("|")] || a.wrongDefault) }; }
    api.save(); paint(); MV.focusFb($("#lq-fb", host));
  }
  function paint(){
    var m = {}, n = {}; Object.keys(S.done).forEach(function(id){ m[id] = "good"; n[id] = LB[id].t; });
    dx.marks(m); dx.names(n); dx.labels(aria);
    var L = cur && LB[cur], lvl = cur ? (S.hints[cur] || 0) : 0;
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

// ---------- Practice 2: kidney calculations and predictions (N4 number entry and multiple choice; adapted from SBI4U 01) ----------
function calcItems(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function parseVal(raw){
    var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Z%].*$/, "").replace(/[\s   ]/g, "");
    var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
  }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
    else {
      h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
      h += '<div class="numrow"><label for="ur-' + it.id + '">Your answer:</label><input class="numin" id="ur-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="ur-unit">' + it.unit + "</span></div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
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
    else if (b.dataset.act === "check") {
      var ok = false;
      if (it.kind === "mc") { if (x.choice == null) return; x.checked = true; ok = MV.ok(it.options[x.choice]); }
      else {
        var v = parseVal(x.val), ans = MV.ans(it), tol = it.tol != null ? it.tol : 1e-6 * Math.max(1, Math.abs(ans));
        if (v == null) { msgs[it.id] = "Enter a number, such as 12, 0.5 or 3/4."; paintItem(it); return; }
        ok = Math.abs(v - ans) <= tol + 1e-9;
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

// ---------- Performance task: water-saving kidney ----------
var task = (function(){
  var api = null, T = null, DEF = { loop:"medium", adh:"moderate", bg:"5", glom:"intact" };
  var NAME = { loop:{ short:"short", medium:"medium", long:"long" }, adh:{ none:"no", moderate:"moderate", high:"high" } };
  function read(){ var s = api ? api.S : {}, d = {}; Object.keys(DEF).forEach(function(k){ d[k] = s[k] || DEF[k]; }); return d; }
  function draw(){
    var d = read(), U = uConc(d.loop, d.adh), V = 600 / U;
    $("#wk-pv").innerHTML = dipHTML(V, U, +d.bg > 10, d.glom === "leaky") + stripSVG(d.loop, U);
  }
  function key(d){ return [d.loop, d.adh, d.bg, d.glom].join("|"); }
  function words(k){ var p = k.split("|"); return NAME.loop[p[0]].charAt(0).toUpperCase() + NAME.loop[p[0]].slice(1) + " loop, " + NAME.adh[p[1]] + " ADH, blood glucose " + p[2] + " mmol/L, " + p[3] + " glomerulus"; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      Object.keys(DEF).forEach(function(k){ if (!a.S[k]) a.S[k] = DEF[k]; });
      inp.innerHTML = '<div class="wk-inputs">' + T.inputs.map(function(x){ return '<div id="wk-' + x.id + '"></div>'; }).join("") + "</div>";
      T.inputs.forEach(function(x){ radios($("#wk-" + x.id), { label:x.label, cls:"chips", options:x.options.map(function(o){ return { id:o[0], t:o[1] }; }), value:a.S[x.id], onChange:function(v){ a.S[x.id] = v; a.save(); draw(); a.update(); } }); });
      pv.innerHTML = '<div id="wk-pv" aria-live="polite"></div><p class="tiny wk-model">' + T.model + '</p><p class="tiny muted"><span class="bio-model">Model data</span> Model values; real values vary.</p>';
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){ var st = MV.taskState(), g = $("#task-fb .fb.good"); if (g && st.found.length >= 4 && !$(".wk-all", g)) g.insertAdjacentHTML("beforeend", '<p class="wk-all">' + T.afterAll + "</p>"); }, 0); });
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var U = uConc(d.loop, d.adh), V = 600 / U; return [U >= 1000 - 1e-9, V >= 0.5 - 1e-9, +d.bg <= 10, d.glom === "intact"]; },
    key:key,
    label:function(k){ return words(k); },
    text:function(k){ return words(k); }
  };
})();

// ---------- hero: dots through one nephron; filtration, reabsorption and secretion arrows; 180 L → 1.5 L ----------
function hero(){
  var box = $("#ur-hero"); if (!box) return;
  function arrow(x1, y1, x2, y2){ var a = Math.atan2(y2 - y1, x2 - x1), L = 7; return sv("path", { d:"M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " M" + f1(x2 - L * Math.cos(a - 0.5)) + " " + f1(y2 - L * Math.sin(a - 0.5)) + " L" + x2 + " " + y2 + " L" + f1(x2 - L * Math.cos(a + 0.5)) + " " + f1(y2 - L * Math.sin(a + 0.5)), "class":"ur-h-arr" }); }
  var lab = arrow(84, 60, 98, 40) + sv("text", { x:102, y:36, "class":"ur-h-t b" }, "Filtration") +
    arrow(160, 90, 160, 118) + sv("text", { x:160, y:146, "class":"ur-h-t b", "text-anchor":"middle" }, "Reabsorption") +
    arrow(300, 134, 300, 114) + sv("text", { x:300, y:154, "class":"ur-h-t b", "text-anchor":"middle" }, "Secretion") +
    sv("text", { x:4, y:16, "class":"ur-h-t" }, "180 L of filtrate a day") + sv("text", { x:378, y:374, "class":"ur-h-t", "text-anchor":"middle" }, "about 1.5 L of urine");
  var leg = [["water", "water"], ["glucose", "glucose"], ["urea", "urea"], ["salt", "salt (Na⁺)"], ["protein", "protein"], ["rbc", "blood cell"]].map(function(r, i){
    return '<g transform="translate(446,' + (40 + i * 26) + ')">' + tokSVG(r[0]).replace(' opacity="0"', "") + "</g>" + sv("text", { x:462, y:45 + i * 26, "class":"ur-h-t sm" }, r[1]);
  }).join("");
  var count = '<g class="ur-h-count" opacity="0">' + sv("text", { x:494, y:242, "class":"ur-h-big", "text-anchor":"middle" }, "180 L → 1.5 L") + sv("text", { x:494, y:264, "class":"ur-h-t sm", "text-anchor":"middle" }, "filtrate → urine, per day") + "</g>";
  box.innerHTML = '<svg viewBox="0 0 560 380" aria-hidden="true" focusable="false">' + nephronSVG({ pid:"hr", hero:true, open:3 }) + lab + leg + count + '<g class="ur-h-dots"></g></svg>';
  var g = $(".ur-h-dots", box), cnt = $(".ur-h-count", box), dots = [];
  function add(sub, R){ dots = dots.concat(flowSpecs(sub, R, [202, 262])); }
  add("water", [12, 4, 2, 2, 1]); add("glucose", [4, 0, 0, 0, 0]); add("urea", [4, 2, 2, 2, 2]); add("salt", [5, 2, 0, 0, 0]);
  [["protein", 0], ["rbc", 1], ["protein", 2]].forEach(function(p){ dots.push({ sub:p[0], path:BOUNCE, exit:null, stop:BOUNCE.len, fade:true }); });
  // interleave so every kind starts early
  var order = dots.map(function(d, i){ return { d:d, k:(i * 7) % dots.length }; }).sort(function(a, b){ return a.k - b.k; }).map(function(o){ return o.d; });
  dots = order;
  g.innerHTML = dots.map(function(d){ return tokSVG(d.sub); }).join("");
  MV.tween({ dur:8000, ease:function(t){ return t; }, step:function(t){ placeDots(g, dots, t, 0.32, 0.62, FULL.len); cnt.setAttribute("opacity", f1(clamp((t - 0.88) / 0.1, 0, 1) * 100) / 100); },
    done:function(){ placeDots(g, dots, 1, 0.32, 0.62, FULL.len); cnt.setAttribute("opacity", 1); } });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ label:labelQuiz, calc:calcItems },
  task:task
});
})();
