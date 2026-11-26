// HFA4U 21 Global Hunger & Malnutrition: hero (F11 world map draws in; a "food produced per person" bar rises past "enough for
// everyone"; regions shade by hunger rate, the shading turns into count circles, and the final frame shows both maps side by
// side), World hunger map (Explore: F11 world data map in three modes — World view with Rate/Count and two answer slots, Country
// profiles with threshold bars, the double-burden flag and a What-if mode, Causes overlay with arrows to the five components and
// the outcomes), Why hunger persists (Part 3: cause-map builder with "Check it with data"), Data detective (custom practice set)
// and "Design a nutrition response" (task: three of eight interventions for profile A).
// Plan wording lives in content.mjs; this file adds only control labels and layout text. All data shown is model data.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function f1(v){ return String(Math.round(v * 10) / 10); }
function f2(v){ return String(Math.round(v * 100) / 100); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function lc(s){ return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function svgT(x, y, s, cls, anchor, extra){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '"' + (extra || "") + ">" + s + "</text>"; }
function arrowKeys(e){ return (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; }
function numIn(raw){ var r = MV.parseNum(String(raw == null ? "" : raw).replace(/%|millions?|\bm\b|people/gi, "").trim()); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }
var ORD = ["1st", "2nd", "3rd", "4th", "5th"];

// ---------- @component radioGroup (copied from HFA4U 16 / 12; "gh-" classes; options may carry an inline style `st`) ----------
//   radios(host, {label, aria, options:[{id, t, cls, st}], value, cls:"seg"|"chips"|<custom → class gh-<custom>>, onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "gh-chipset" : o.cls && o.cls !== "seg" ? "gh-" + o.cls : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="gh-rgw">' + (lab ? '<span class="gh-rgl">' + lab + "</span>" : "") + '<span class="gh-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (x.st ? ' style="' + x.st + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b) && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = arrowKeys(e); if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint };
}

// ---------- @component switchBtn (copied from HFA4U 14 / 12) — an on/off switch (role="switch" button with a visible On/Off word) ----------
function switchHTML(key, label, on, data){
  return '<button type="button" role="switch" class="gh-sw" aria-checked="' + !!on + '" data-k="' + key + '" ' + data + '><span class="gh-swt" aria-hidden="true"><i></i></span><span class="gh-swl">' + label + '</span><span class="gh-swv" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// ---------- @component F11 worldMap — schematic world map (700 × 280 box, equirectangular, lon −170…180, lat 84…−56) in the
// five FAO-style regions of the model data. Rate view: a single-hue ramp (--pen at increasing opacity); count view: circles
// whose AREA is the count. Colour is never alone: every value is also written (buttons, labels, readout, aria-label).
// Outlines are simplified on purpose (teacher note: schematic; Siberia drawn with Asia, western New Guinea with Asia). ----------
var GEO = {
  ne:[
    [-166,60,-165,65,-162,70,-156,71.3,-141,69.6,-128,70,-115,68.5,-100,68,-95,72,-85,70,-82,73,-75,72,-68,69,-62,66,-64,60,-61,56,-56,52,-59,48,-65,45,-70,43,-70.5,41.5,-74,40.5,-76,38,-76,35,-79,33,-81,31,-80,27,-80.5,25.2,-82,26.5,-83,29,-85,30,-89,30.2,-94,29.6,-97,27.8,-97.2,26,-99.5,27.5,-101.6,29.8,-104,29.5,-106.5,31.8,-108.2,31.3,-111,31.3,-114.8,32.5,-117,32.5,-120.5,34.5,-122.5,37.5,-124,40,-124.5,43,-124,46,-123,48.5,-127,50.5,-130,54.5,-134,58,-138,59,-142,60,-148,60.5,-152,59,-156,57,-161,58.5],
    [-95,59,-94,61,-90,64,-86,66,-82,64.5,-78,62.5,-78,58.5,-80,55.5,-82,52.5,-87,55.5,-92,57],
    [-73,78,-60,82,-35,83.5,-20,82,-18,77,-22,71,-32,68,-42,61,-49,61.5,-53,66,-55,70,-62,76],
    [-9.5,37,-9,43,-1.5,43.5,-1.2,46,-4.5,48,-1.5,49.7,2,51,4,52,8,53.5,8.6,57,10.5,57.6,10.8,54.4,14,54,19,54.4,21,56,21.5,57.5,24,57.5,24,59.3,29,60,23,60.3,21.5,61,21.5,63,25,65,21.5,65.5,17.5,62.5,17.5,60.6,18.8,59.5,16.5,57,14.5,56,12.5,56.3,11,58.8,8,58.1,5.5,58.8,5,61,5.5,62.5,10,64,13,66,15.5,68.5,19,70,24,71,28,71,31,70,33,69,41,67,44,68.5,50,68,55,68.5,60,69,60,51,55,51,50,48,47,45,48,42,44,42.3,41.5,42,38,44.5,36.5,45.3,33.5,44.5,32,46.3,30.5,46.5,29.5,45,28.7,44,28,42,26,40.8,24,40.7,22.5,40.3,24,38,23,36.5,21.7,37,21,39,19.5,40.3,19.5,41.8,16,43.5,13.7,45.5,12.3,45.3,12.5,44,14,42,16,41.5,18.5,40.2,16.5,39,16,38,15.7,40,13,41.2,11,42.5,10,44,8.5,44.4,6,43.1,3.2,43.3,3.2,42,0.8,41,0,39.5,-0.5,38,-2,36.7,-5.5,36,-7.5,37.2],
    [-5.7,50,1.5,51,1.7,52.8,0,53.5,-1.5,55,-2,57.6,-3.3,58.6,-5,58.6,-6.2,57.5,-5.6,56,-5,55,-3,54.5,-3.2,53.3,-4.6,52.8,-5.2,51.7,-3,51.4,-5,51],
    [-10,51.6,-6,52,-6,53.9,-5.6,55.2,-8,55.2,-10,54,-9.8,53],
    [-24,65.5,-22,66.4,-16,66.5,-13.6,65,-18,63.4,-22.5,63.8]],
  la:[
    [-117,32.5,-114.8,32.5,-111,31.3,-108.2,31.3,-106.5,31.8,-104,29.5,-101.6,29.8,-99.5,27.5,-97.2,26,-97.5,24,-97.7,21.8,-96.5,19.5,-94.5,18.2,-91.5,18.5,-90.5,21,-87,21.5,-87.6,18.5,-88.3,16,-86.5,15.8,-83.5,15,-83.5,12,-83.8,11,-82,9,-79.5,9.6,-77.5,8.5,-76,9.5,-75.5,10.6,-73,11.5,-71.5,12.4,-71,11,-68,10.6,-64,10.6,-61.5,10,-60,8.5,-57.5,6,-54,5.7,-51.5,4.2,-50,1.8,-50,-0.5,-48.5,-1,-44.5,-2.5,-40,-2.8,-37.5,-4.5,-35,-5.5,-34.8,-7.5,-35.3,-9.5,-37.5,-12,-38.9,-13.5,-39.2,-17.5,-40,-20,-41.8,-22.5,-44.5,-23.3,-48,-25.5,-48.6,-28.4,-50.7,-31,-53,-33.5,-54,-34.8,-56.5,-36.4,-57.5,-38.2,-62,-38.9,-62.3,-40.8,-65,-41,-63.8,-42.2,-65.3,-44.8,-67.5,-46.4,-65.8,-47.5,-68.6,-50.3,-69,-52,-68.4,-53.5,-66.5,-55,-70,-55.2,-74,-52,-75.5,-48.5,-74,-44,-73.5,-41,-73.7,-37.5,-71.6,-33,-71.4,-30,-70.4,-23.5,-70.2,-18.3,-71.4,-17.6,-76.2,-14,-78,-10.5,-80.5,-6.5,-81.3,-4.5,-80,-2.5,-80.5,-0.5,-79.6,1,-78.6,2.6,-77.4,4,-77.4,6.6,-78.4,8,-80,7.5,-81.5,7.8,-83.5,8.5,-85.7,10,-85.7,11.1,-87.5,13,-89.6,13.5,-91.7,14.2,-93.5,15.8,-94.8,16.2,-96.5,15.7,-98,16.1,-101.5,17.6,-105,19.5,-105.6,20.6,-105.4,22.5,-106.4,23.7,-108,25.2,-109.4,26.5,-111,27.9,-112.6,30,-113.2,31.2,-114.8,31.6],
    [-117,32.5,-116,30.5,-114.2,28,-112.3,26,-110,23.5,-109.4,23.2,-110.5,24.3,-112,26.8,-113.6,29,-114.8,31.4],
    [-85,21.9,-82,23.1,-77.2,21.6,-74.2,20.2,-77.7,19.9,-80,21.7,-83,22],
    [-74.4,18.4,-72.8,19.9,-69.9,19.6,-68.4,18.6,-71.4,17.6]],
  af:[
    [-17,21,-16.5,24,-13,27.6,-10,29.6,-9.5,32.6,-6.8,34,-5.9,35.8,-2,35.1,3,36.8,10,37.3,11,35.2,10.2,34,11.5,33.2,15.2,32.3,19,30.3,20.1,32,23,32.6,25,31.7,29,30.9,32.3,31.3,34.2,31.2,34.9,29.5,33.5,27.8,35.5,24,37.2,21,38.5,18,39.7,15.5,42.4,12.6,43.3,11.8,44.5,10.4,51.1,11.9,51,10.5,50.1,8.1,48.6,5.3,46.6,2.8,43.1,0.3,41.6,-1.7,40.1,-3.3,39.2,-4.7,38.8,-6.5,39.4,-8.3,40.3,-10.3,40.5,-15.4,37.4,-17.6,35.3,-21.3,35.4,-24.1,32.6,-25.7,32.6,-28.6,30.1,-31.1,27.5,-33.2,25,-33.8,22.6,-33.9,20,-34.8,18.4,-34,18.2,-31.7,16.3,-28.6,15.2,-27,14.5,-22.9,11.8,-17.3,11.7,-15.8,12.3,-13.6,13.6,-12,13.2,-9.8,12.3,-6.1,11.8,-4.2,10.5,-2.9,9.3,-1,9.5,1,9.8,3.1,8.5,4.5,6.7,4.3,5,6,3.3,6.4,1,6,-2,4.7,-4.6,5.2,-7.5,4.4,-9.5,5.6,-11.4,6.8,-13.2,8.8,-15,10.9,-16.7,12.4,-17.2,14.9,-16.5,16.2,-16.1,18.1,-16.5,19.6],
    [44,-25,47,-25,50.2,-15.5,49.3,-12,47.8,-14,44.3,-16.5,43.3,-22]],
  as:[
    [26,40.8,28,41.2,31.5,41.2,35,42,38,41,41.5,41.5,41.5,42,44,42.3,48,42,47,45,50,48,55,51,60,51,60,69,66,69.5,68,73,72,72.5,75,72.3,80,73.5,87,74,95,76,104,77.7,112,74,120,73,128,72,132,71.5,140,72.5,150,71.5,160,70,170,70,180,68.5,180,65,176,64.5,178,62,172,60.5,163,59.5,162,57.5,156.5,51,156,57.5,155,59.3,143,59.3,137,54,140.5,52,141,48,138,46,135,43.5,131,42.5,129.5,40.7,129.4,37,128.5,35,126.5,34.5,126,37.7,124.7,38,125.3,39.5,121.5,39.5,122,40.5,119,39.2,118,38.5,119,37.3,122.5,37.4,120,35,121,32,122,30,121,28,119.6,25.7,117,23.6,114,22.3,110.5,21.2,108,21.6,106.7,20,105.8,19,106.5,17.5,109,15,109.3,12,107.5,10.5,105,8.6,104.8,10,103,10.5,102,12.5,100.5,13.5,100,12,99.2,10,100.3,7,103.3,4.2,104,1.3,101,2.8,100,4.6,98.3,8,98.5,10,98.6,13,97.6,16.5,94.4,16,94,19.4,92.2,21.5,91.8,22.6,90,21.9,89,21.6,86.5,20,85,19.3,82,16.6,80.3,15.8,80.2,13.5,79.8,10.3,77.5,8,76.5,9.5,75,12.5,73.5,16,72.8,19,72.7,21.2,70,22.5,68.5,23.5,66.7,25.4,61.5,25.2,57.5,25.7,56.4,27.1,54.7,26.5,51.6,27.9,50,30,48,30,47.9,29.3,48.8,28,50.8,25,51.5,25.8,51.6,24.3,54,24.1,56.3,25.7,56.4,24.9,58.7,23.6,59.8,22.3,57.8,19,56.7,18.2,55.4,17.6,52.2,15.6,49,14.2,45.6,13.3,43.5,12.7,42.7,15.7,42.6,16.8,40.9,19.5,39.1,21.5,38.5,23.7,37.5,25,35.1,28.1,34.6,28.1,34.9,29.5,34.2,31.2,34.6,32.8,35.5,34.6,36,35.8,35.8,36.7,34,36.2,32.5,36.1,30.6,36.7,29.2,36.7,27.6,37,26.3,38.2,26.6,39.4],
    [130,31.5,131.8,33.5,135,33.6,138.5,34.6,140.8,35.6,141,38.3,142,39.6,141.4,41.4,143.3,42,145.6,43.3,141.8,45.5,140,43.2,140,40.5,139.9,38.5,137,37,136,35.7,133,35.5,131,34.5,129.8,33.2],
    [79.8,8,80,9.8,81.8,7.5,81.3,6.2,80,6],
    [120.2,23,121,25.3,122,25,120.7,22],
    [95.3,5.5,98,4,100.5,1.5,104,-1,106,-3,105.8,-5.9,104.5,-5.9,102,-4,100.5,-1,98.6,1.7,97.5,2.5],
    [105.2,-6.8,106.5,-6,108.5,-6.7,111,-6.4,114.5,-7.8,112,-8.4,108,-7.8],
    [109,1.5,109.6,-1,110.2,-3,114,-3.5,116.5,-3.9,116.2,-1.5,118,0.8,119,5,117.5,6.9,116,6,113.8,4,111.5,2.6],
    [119.4,-5.5,120.5,-2,119,0,120,1,124.5,1.2,121.5,-0.9,121.5,-4,120.3,-5.5],
    [120,18.5,122.2,18.5,122,16,124,13,121.5,13.8,120.6,14.5,119.8,16.3],
    [122,7,125.5,9.7,126.5,7.3,125.6,5.6,123.5,7.8],
    [131,-1.2,134.2,-0.9,137.8,-1.5,141,-2.6,141,-9.1,139,-8.1,137.6,-8.4,138.7,-6.8,136,-4.5,133.2,-4,132,-2.8]],
  oc:[
    [113.5,-22,114,-26,115,-29.5,115,-33.5,116.6,-35,118,-35,121,-33.8,124,-33,126,-32.3,129,-31.6,131.3,-31.5,134.3,-32.6,135.9,-34.8,137.6,-35.6,138.4,-34.5,138.5,-35.6,140,-37.5,143,-38.8,146.3,-39.1,148,-37.8,149.9,-37.5,150.6,-35,152,-32.7,153.6,-28.8,153,-25.5,151,-23.5,149.5,-22.3,146.2,-18.8,145.3,-15.1,143.5,-14,142.5,-10.7,141.5,-13.5,141.6,-16.6,140.6,-17.5,139.3,-17.4,137,-15.9,135.5,-14.7,136.7,-12.2,135,-12.2,132.6,-11.6,131,-12.2,129.4,-14.4,127.8,-14.3,125.7,-14.3,123.6,-16.6,122.2,-18,121.1,-19.6,117.4,-20.7,114.6,-21.8],
    [144.7,-40.7,148.3,-40.9,148,-43.2,146.9,-43.6,145.4,-42.3],
    [172.7,-34.5,174.5,-36,176.2,-37.6,178.5,-37.7,177,-39.3,176,-41.3,174.6,-41.3,175.2,-40,173.8,-39.2,174.5,-38,173.9,-36.5],
    [172.7,-40.5,174.3,-41.7,172.8,-43.5,171.2,-44.5,169.3,-46.6,166.5,-46,168.3,-44,170.6,-43,172,-41.5],
    [141,-2.6,145,-4.8,147.6,-6.1,147,-7.4,148.1,-8.1,150,-10.3,147.1,-10.1,144.5,-7.6,142.6,-9.3,141,-9.1]]
};
var RORD = ["af", "as", "la", "oc", "ne"];
var PATH = {};
RORD.forEach(function(r){
  PATH[r] = GEO[r].map(function(a){ var d = ""; for (var i = 0; i < a.length; i += 2) d += (i ? "L" : "M") + f1((a[i] + 170) * 2) + " " + f1((84 - a[i + 1]) * 2); return d + "Z"; }).join("");
});
// CEN: shading label / circle centre; BTN: button anchor (offset where a small circle would hide under the button)
var CEN = { af:[384, 156], as:[530, 88], la:[224, 188], oc:[608, 218], ne:[140, 64] };
var BTN = { af:[384, 156], as:[530, 88], la:[210, 240], oc:[556, 236], ne:[272, 52] };
function EX(){ return MV.C.explore; }
function reg(id){ return byId(EX().regions, id); }
function ramp(r){ return r.low ? 0.06 : 0.12 + 0.78 * r.rate / 20; }
function radius(r){ return r.low ? 0 : 3.2 * Math.sqrt(r.pop * r.rate / 100); }
// o: {draw 0..1 (outline draw-in), shade 0..1, circ 0..1, sel, lw (outline width in map units), selPulse}
function mapSVG(o){
  var h = "", lw = o.lw || 1.2, drawing = o.draw != null && o.draw < 1;
  RORD.forEach(function(r){
    h += '<path class="gh-land" fill-rule="evenodd" d="' + PATH[r] + '" style="stroke-width:' + f2(lw) + (drawing ? ";fill-opacity:" + f2(o.draw) : "") + '"' +
      (drawing ? ' pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="' + f2(1 - o.draw) + '"' : "") + "/>";
  });
  if (o.shade > 0) RORD.forEach(function(r){ h += '<path class="gh-shade" fill-rule="evenodd" d="' + PATH[r] + '" style="fill-opacity:' + f2(ramp(reg(r)) * o.shade) + '"/>'; });
  if (o.sel) h += '<path class="gh-selo" fill-rule="evenodd" d="' + PATH[o.sel] + '" style="stroke-width:' + f2(lw * 2.4) + '"/>';
  if (o.circ > 0) RORD.forEach(function(r){
    var R = reg(r), rr = radius(R) * o.circ; if (!rr) return;
    h += '<circle class="gh-circ' + (o.sel === r ? " sel" : "") + '" cx="' + CEN[r][0] + '" cy="' + CEN[r][1] + '" r="' + f1(Math.max(rr, 0.1)) + '" style="stroke-width:' + f2(lw * 1.6) + '"/>';
  });
  return h;
}
function countT(R, short){ return R.low ? "" : (R.approx ? "≈ " : "") + R.count + (short ? " M" : " million"); }
function rateT(R){ return R.low ? EX().lowRate : R.rate + "%"; }
function mapAria(measure, sel){
  var R = EX().regions, s = sel ? " Selected: " + reg(sel).t + "." : "";
  if (measure === "count") return "World map, model data, with circles sized by the number of people facing hunger: " + R.filter(function(x){ return !x.low; }).slice().sort(function(a, b){ return b.count - a.count; }).map(function(x){ return x.t + " " + countT(x).replace("≈ ", "about "); }).join(", ") + "; Northern America & Europe not shown." + s;
  return "World map, model data, shaded by hunger rate (darker means a higher rate): " + R.map(function(x){ return x.t + " " + rateT(x); }).join(", ") + "." + s;
}

// ---------- hero (storyboard: outline draws in; the "food produced per person" bar rises past "enough for everyone"; regions
// shade by rate ("Share of people facing hunger"); the shading fades into count circles ("Number of people"); final frame: both
// maps side by side, "A share of what?"). Reduced motion: the final frame only. ----------
var HL = {
  w:{ vb:"0 0 640 420", m:[20, 2, 0.857], A:[4, 14, 0.446], B:[322, 14, 0.446], legY:[160, 180], bar:{ x:300, w:40, base:400, top:262, line:298, lx0:252, lx1:388 }, barFade:false, tag:[636, 414], fs:17 },
  n:{ vb:"0 0 400 440", m:[0, 8, 0.571], A:[0, 6, 0.571], B:[0, 226, 0.571], legY:[184, 204], legY2:[404, 424], bar:{ x:182, w:36, base:410, top:244, line:292, lx0:140, lx1:260 }, barFade:true, tag:[4, 18], tagA:"start", fs:18 }
};
function mapG(p, inner){ return '<g transform="translate(' + p[0] + " " + p[1] + ") scale(" + p[2] + ')">' + inner + "</g>"; }
function heroLabels(st, L){
  var h = "", s = L.m[2], fs = L.fs, aR = st.circ > 0 ? clamp(1 - st.circ * 2, 0, 1) * st.shade : st.shade, aC = clamp(st.circ * 2 - 1, 0, 1);
  function at(r, dx, dy){ return [L.m[0] + (CEN[r][0] + (dx || 0)) * s, L.m[1] + (CEN[r][1] + (dy || 0)) * s]; }
  if (aR > 0.02) RORD.forEach(function(r){
    var R = reg(r), p = at(r, 0, 5);
    h += svgT(p[0], p[1], rateT(R), "gh-hlab" + (R.low ? " low" : ""), "middle", ' style="opacity:' + f2(aR) + ";font-size:" + (R.low ? fs - 3 : fs) + 'px"');
  });
  if (aC > 0.02) RORD.forEach(function(r){
    var R = reg(r); if (R.low) return;
    var big = R.count > 100, p = big ? at(r, 0, -2) : at(r, radius(R) + 6, 5);
    h += svgT(p[0], p[1], (R.approx ? "≈ " : "") + R.count, "gh-hlab", big ? "middle" : "start", ' style="opacity:' + f2(aC) + ";font-size:" + fs + 'px"');
    h += svgT(p[0], p[1] + fs * 0.95, "million", "gh-hlab sm", big ? "middle" : "start", ' style="opacity:' + f2(aC) + ";font-size:" + (fs - 4) + 'px"');
  });
  return h;
}
function heroSVG(st, nw){
  var L = nw ? HL.n : HL.w, h = "", F = MV.C.hero.finalLegend, B = L.bar;
  if (st.fin < 1) h += '<g style="opacity:' + f2(1 - st.fin) + '">' + mapG(L.m, mapSVG({ draw:st.draw, shade:st.shade, circ:st.circ, lw:1.3 / L.m[2] })) + heroLabels(st, L) + "</g>";
  if (st.fin > 0) {
    var cxA = nw ? 200 : L.A[0] + 350 * L.A[2], cxB = nw ? 200 : L.B[0] + 350 * L.B[2], y1 = L.legY, y2 = nw ? L.legY2 : L.legY;
    h += '<g style="opacity:' + f2(st.fin) + '">' + mapG(L.A, mapSVG({ shade:1, lw:1.2 / L.A[2] })) + mapG(L.B, mapSVG({ circ:1, lw:1.2 / L.B[2] })) +
      svgT(cxA, y1[0], F.rate, "gh-hleg", "middle") + svgT(cxA, y1[1], F.rateVals, "gh-hlegv", "middle") +
      svgT(cxB, y2[0], F.count, "gh-hleg", "middle") + svgT(cxB, y2[1], F.countVals, "gh-hlegv", "middle") + "</g>";
  }
  var ba = L.barFade ? 1 - st.fin : 1;
  if (ba > 0.01 && st.bar > 0) {
    var top = B.base - (B.base - B.top) * st.bar;
    h += '<g style="opacity:' + f2(ba * Math.min(1, st.bar * 3)) + '"><rect class="gh-hbar" x="' + B.x + '" y="' + f1(top) + '" width="' + B.w + '" height="' + f1(B.base - top) + '" rx="3"/>' +
      '<path class="gh-hbase" d="M' + (B.lx0 - 10) + " " + B.base + "H" + (B.lx1 + 10) + '"/>' +
      '<path class="gh-henough" d="M' + B.lx0 + " " + B.line + "H" + B.lx1 + '"/>' +
      svgT(B.x - 10, B.base - 30, "Food produced", "gh-hbt", "end") + svgT(B.x - 10, B.base - 11, "per person", "gh-hbt", "end") +
      svgT(B.lx1 + 6, B.line - 4, "Enough for", "gh-hbt", "start") + svgT(B.lx1 + 6, B.line + 15, "everyone", "gh-hbt", "start") + "</g>";
  }
  if (st.shade > 0 || st.circ > 0 || st.fin > 0) h += svgT(L.tag[0], L.tag[1], "Model data", "gh-htag", L.tagA || "end");
  return h;
}
function hero(f){
  var host = $("#gh-hero"); if (!host) return;
  var H = MV.C.hero, st = { draw:0, bar:0, shade:0, circ:0, fin:0 };
  host.innerHTML = '<svg class="gh-hsvg" role="img" aria-label="' + esc(H.aria) + '"></svg>';
  var svg = host.firstChild;
  // hidden views measure 0 wide: fall back to the window width (desktop's two-column hero is narrow too), then let the
  // ResizeObserver correct the layout once the Start view is shown
  function narrow(){ var w = host.getBoundingClientRect().width, iw = window.innerWidth; return w ? w < 460 : iw < 500 || iw > 820; }
  function draw(){ var nw = narrow(); svg.setAttribute("viewBox", (nw ? HL.n : HL.w).vb); svg.innerHTML = heroSVG(st, nw); }
  window.addEventListener("resize", draw);
  if (window.ResizeObserver) new ResizeObserver(function(){ draw(); }).observe(host);
  function cap(t){ if (f.cap) { f.cap.textContent = t; f.cap.classList.add("gh-cap"); } }
  if (MV.reduceMotion) { st = { draw:1, bar:1, shade:0, circ:0, fin:1 }; draw(); cap(H.caps.final); return; }
  draw();
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  MV.wait(250, function(){
    tw(1300, function(t){ st.draw = t; draw(); }, function(){
      tw(900, function(t){ st.bar = t; draw(); }, function(){
        cap(H.caps.rate);
        tw(800, function(t){ st.shade = t; draw(); }, function(){
          MV.wait(1100, function(){
            cap(H.caps.count);
            tw(1400, function(t){ st.shade = 1 - t; st.circ = t; draw(); }, function(){
              MV.wait(1200, function(){ cap(H.caps.final); tw(800, function(t){ st.fin = t; draw(); }); });
            });
          });
        });
      });
    });
  });
}

// ---------- profile helpers (bands from content; the module's double-burden rule) ----------
var CHILD = ["s", "w", "o"], INAME = { s:"stunting", w:"wasting", o:"overweight", an:"anemia" }, BIGID = { s:"stunting", w:"wasting", o:"over" };
function prof(id){ return byId(EX().profiles, id); }
function bandOf(k, v){ var r = null; EX().bands[k].forEach(function(b, i){ if (v >= b[0]) r = { i:i, t:b[1] }; }); return r; }
function bandT(k, v){ var b = bandOf(k, v); return b ? b.t : ""; }
function isDB(v){ return v.s >= 20 && v.o >= 10; }
function biggest(v){
  var top = -1, who = [];
  CHILD.forEach(function(k){ var b = bandOf(k, v[k]); if (b.i > top) { top = b.i; who = [k]; } else if (b.i === top) who.push(k); });
  var names = who.map(function(k){ return INAME[k]; }), t = listAnd(names);
  return { ids:who, text:t.charAt(0).toUpperCase() + t.slice(1) + ": " + EX().bands[who[0]][top][1] };
}
function dbText(v){
  if (isDB(v)) return "Yes: stunting " + v.s + "% and overweight " + v.o + "%";
  var why = [];
  if (v.s < 20) why.push("stunting is " + v.s + "% (below 20%)");
  if (v.o < 10) why.push("overweight is " + v.o + "% (below 10%)");
  return "No: " + listAnd(why);
}
// threshold lines for each indicator (lower bounds of the bands above zero); hi = the 'high' (or 'severe') line
var TH = { s:{ at:[2.5, 10, 20, 30], hi:20, hiT:"high" }, w:{ at:[2.5, 5, 10, 15], hi:10, hiT:"high" }, o:{ at:[2.5, 5, 10, 15], hi:10, hiT:"high" }, an:{ at:[5, 20, 40], hi:40, hiT:"severe" } };
var BMAX = 50;
// @component profileCard — model profile with indicator bars against dashed threshold lines, stress tags and a magenta
// "Double burden" ribbon (always with its words). tag: "button" (selectable) or "div". fx: {grow, oT (overweight scale for
// P2), hideRib, pulseW, note}
function cardHTML(p, v, o){
  o = o || {};
  var I = EX().indicators, tag = o.tag || "div", db = isDB(v) && !o.hideRib;
  var h = "<" + tag + (tag === "button" ? ' type="button" data-pf="' + p.id + '" data-k="pf' + p.id + '" aria-pressed="' + !!o.sel + '"' : "") + ' class="gh-pc' + (o.sel ? " sel" : "") + (db ? " db" : "") + '">' +
    '<span class="gh-pch"><span class="gh-pct">Profile ' + p.id + '</span><span class="hfa-model">Model data</span>' + (o.wi ? '<span class="gh-witag">What-if</span>' : "") + "</span>" +
    (db ? '<span class="gh-rib">Double burden</span>' : "") + '<span class="gh-bars">';
  I.forEach(function(ind){
    var k = ind.id, val = v[k], shown = val, hidden = false;
    if (k === "o" && o.oT != null) { shown = val * o.oT; hidden = o.oT <= 0; }
    var w = clamp(shown / BMAX, 0, 1) * 100 * (o.grow == null ? 1 : o.grow), T = TH[k], pulse = k === "w" && o.pulseW;
    h += '<span class="gh-br' + (pulse ? " pulse" : "") + '"><span class="gh-bl">' + ind.t + " <small>" + ind.sub + '</small></span><span class="gh-bt"><span class="gh-bf' + (k === "an" ? " an" : "") + '" style="width:' + f1(w) + "%" + (pulse ? ";outline-width:" + f1(2 + 3 * Math.abs(Math.sin(o.pulseW * Math.PI * 3))) + "px" : "") + '"></span>' +
      T.at.map(function(a){ return '<span class="gh-th' + (a === T.hi ? " hi" : "") + '" style="left:' + f1(a / BMAX * 100) + '%">' + (a === T.hi ? '<span class="gh-thl">' + T.hiT + "</span>" : "") + "</span>"; }).join("") +
      '</span><span class="gh-bv">' + (hidden ? "…" : Math.round(shown) + "% · " + bandT(k, Math.round(shown))) + "</span>" +
      (k === "w" && o.note ? '<span class="gh-bnote">' + o.note + "</span>" : "") + "</span>";
  });
  h += '</span><span class="gh-tags">' + p.stress.map(function(s){ return '<span class="gh-tag">' + s + "</span>"; }).join("") + "</span></" + tag + ">";
  return h;
}

// ---------- @component causeFlow — Causes overlay diagram: one cause → the components it hits → the outcomes (arrows from the
// Part 3 key). Two layouts: three columns (wide) or cause on top with two columns (phones). Arrows draw one by one; reduced
// motion shows them at once. Hit boxes get --hi-soft and bold words; outcomes add "↑". ----------
function P3(){ return MV.C.part3; }
function cause(id){ return byId(P3().causes, id); }
function arrowsOf(c){
  var A = MV.ans(c), list = [];
  P3().components.forEach(function(k){ if (A[k.id]) list.push({ from:"cause", to:k.id, note:(c.notes || {})[k.id] }); });
  P3().outcomes.forEach(function(o){ P3().components.forEach(function(k){ if (A[k.id] && A[k.id].indexOf(o.id) >= 0) list.push({ from:k.id, to:o.id }); }); });
  return list;
}
function wrapT(s, n){ var w = String(s).split(" "), L = [], cur = ""; w.forEach(function(x){ if (cur && (cur + " " + x).length > n) { L.push(cur); cur = x; } else cur = cur ? cur + " " + x : x; }); if (cur) L.push(cur); return L; }
function boxT(x, y, w, h, lines, cls, fs){
  var out = '<rect class="gh-fbox ' + (cls || "") + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7"/>', n = lines.length, lh = fs * 1.15;
  lines.forEach(function(l, i){ out += svgT(x + w / 2, y + h / 2 + (i - (n - 1) / 2) * lh + fs * 0.35, l, "gh-ft " + (cls || ""), "middle", ' style="font-size:' + fs + 'px"'); });
  return out;
}
var FL = {
  w:{ vb:"0 0 720 316", cause:{ x:6, y:142, w:172, h:48 }, cx:262, cw:160, ox:540, ow:174, y0:26, dy:60, bh:40, fs:15, head:true },
  n:{ vb:"0 0 360 420", cause:{ x:60, y:6, w:240, h:46 }, cx:30, cw:140, ox:206, ow:150, y0:96, dy:64, bh:44, fs:14, head:true }
};
// o: {c (cause or null), scen (text for an empty start), t (arrows drawn, 0..n), narrow, pulse (0..1 on hunger)}
function flowSVG(o){
  var L = o.narrow ? FL.n : FL.w, K = P3().components, O = P3().outcomes, h = "", fs = L.fs;
  var arr = o.c ? arrowsOf(o.c) : [], t = o.t == null ? arr.length : o.t, hitK = {}, hitO = {};
  arr.forEach(function(a, i){ if (t >= i + 1 - 1e-6) { if (a.from === "cause") hitK[a.to] = 1; else hitO[a.to] = 1; } });
  function ky(i){ return L.y0 + i * L.dy; }
  function yc(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return ky(i) + L.bh / 2; return 0; }
  if (L.head) {
    if (!o.narrow) h += svgT(L.cause.x + L.cause.w / 2, 14, "Cause", "gh-fh") ;
    h += svgT(L.cx + L.cw / 2, L.y0 - 10, "Components", "gh-fh") + svgT(L.ox + L.ow / 2, L.y0 - 10, "Outcomes", "gh-fh");
  }
  // arrows first (under the boxes' edges)
  var C = L.cause, cyc = C.y + C.h / 2;
  arr.forEach(function(a, i){
    var p = clamp(t - i, 0, 1); if (p <= 0) return;
    var d, ex, ey;
    if (a.from === "cause") {
      ey = yc(K, a.to); ex = L.cx;
      d = o.narrow ? "M" + C.x + " " + f1(cyc) + "H14V" + f1(ey) + "H" + ex : "M" + (C.x + C.w) + " " + f1(cyc) + "C" + f1((C.x + C.w + L.cx) / 2) + " " + f1(cyc) + " " + f1((C.x + C.w + L.cx) / 2) + " " + f1(ey) + " " + ex + " " + f1(ey);
    } else {
      var y1 = yc(K, a.from), x1 = L.cx + L.cw, mx = (x1 + L.ox) / 2; ey = yc(O, a.to); ex = L.ox;
      d = "M" + x1 + " " + f1(y1) + "C" + f1(mx) + " " + f1(y1) + " " + f1(mx) + " " + f1(ey) + " " + ex + " " + f1(ey);
    }
    h += '<path class="gh-farr" d="' + d + '"' + (p < 1 ? ' pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="' + f2(1 - p) + '"' : "") + "/>";
    if (p >= 1) h += '<path class="gh-fhead" d="M' + (ex - 9) + " " + f1(ey - 5.5) + "L" + ex + " " + f1(ey) + "L" + (ex - 9) + " " + f1(ey + 5.5) + 'Z"/>';
    if (p >= 1 && a.note && a.note.length <= 14 && !o.narrow) h += svgT((C.x + C.w + L.cx) / 2, (cyc + ey) / 2 - 7, a.note, "gh-fnote", "middle");
  });
  // boxes
  if (o.c) h += boxT(C.x, C.y, C.w, C.h, wrapT(o.c.ov || o.c.t, o.narrow ? 26 : 19), "cause", fs);
  else h += boxT(C.x, C.y, C.w, C.h, wrapT(o.scen || "Tap a cause card", o.narrow ? 28 : 19), "scen", fs - 1);
  K.forEach(function(k, i){ h += boxT(L.cx, ky(i), L.cw, L.bh, [k.t], hitK[k.id] ? "hit" : "", fs); });
  O.forEach(function(x, i){
    var hit = hitO[x.id], note = hit && o.c && (o.c.onotes || {})[x.id], lines = [x.t + (hit ? " ↑" : "")];
    if (note) { if (o.narrow) lines.push(note); else lines[0] += " " + note; }
    h += boxT(L.ox, ky(i), L.ow, L.bh, lines, (hit ? "hit" : "") + (hit && x.id === "hunger" && o.pulse ? " pulse" : ""), note && o.narrow ? fs - 2 : fs);
    if (hit && x.id === "hunger" && o.pulse) h += '<rect class="gh-fpulse" x="' + (L.ox - 4) + '" y="' + (ky(i) - 4) + '" width="' + (L.ow + 8) + '" height="' + (L.bh + 8) + '" rx="9" style="opacity:' + f2(Math.abs(Math.sin(o.pulse * Math.PI * 2))) + '"/>';
  });
  return h;
}
function flowText(c){
  var A = MV.ans(c), K = P3().components, O = P3().outcomes, comps = [], outs = [];
  K.forEach(function(k){ if (A[k.id]) comps.push(lc(k.t) + ((c.notes || {})[k.id] ? " (" + c.notes[k.id] + ")" : "")); });
  O.forEach(function(o){ if (K.some(function(k){ return A[k.id] && A[k.id].indexOf(o.id) >= 0; })) outs.push(lc(o.t) + " ↑" + ((c.onotes || {})[o.id] ? " " + c.onotes[o.id] : "")); });
  return (c.ov || c.t) + " → " + comps.join(", ") + " → " + outs.join(", ") + ".";
}
function compList(c){ var A = MV.ans(c); return P3().components.filter(function(k){ return A[k.id]; }).map(function(k){ return lc(k.t); }); }

// ---------- Explore: World hunger map (@component F11 worldMap + profileCard + causeFlow) ----------
function explore(host, api){
  var D = api.content, S = api.S, anim = null, pend = null, timers = [], cos = null, sl = null;
  S.mode = byId(D.modes, S.mode) ? S.mode : "world";
  S.measure = S.measure === "count" ? "count" : "rate";
  S.region = reg(S.region) ? S.region : "";
  S.slots = S.slots || { rate:"", count:"" };
  S.prof = prof(S.prof) ? S.prof : "A";
  S.big = ["stunting", "wasting", "over"].indexOf(S.big) >= 0 ? S.big : "";
  S.wi = !!S.wi; S.wv = S.wv || {};
  S.cause = D.overlay.indexOf(S.cause) >= 0 ? S.cause : "";
  var fx = { morph:S.measure === "count" ? 1 : 0, grow:1, oT:null, pulseW:0, note:false, flowT:null, pulse:0, scen:false };

  host.innerHTML = '<div id="gh-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="gh-lab" data-mv="graph"><div class="gh-main">' +
      '<div id="gh-world"><div id="gh-meas"></div><div class="gh-mapw"><svg class="gh-map" id="gh-map" viewBox="0 0 700 280" role="img" aria-label="World map"></svg><div class="gh-rbtns" id="gh-rbtns" role="group" aria-label="Regions"></div><span class="hfa-model gh-mtag">Model data</span></div>' +
        '<p class="tiny gh-key" id="gh-key"></p><div class="gh-slots" id="gh-slots" aria-live="polite"></div>' +
        '<details class="alg gh-real"><summary>Check it with data</summary>' + D.realData + "</details></div>" +
      '<div id="gh-prof" hidden><p class="gh-rule">' + D.rule + '</p><div class="gh-pcards" id="gh-pcards" role="group" aria-label="Model profiles"></div><div id="gh-big"></div><div class="gh-wi" id="gh-wi"></div>' +
        '<details class="alg"><summary>Threshold bands</summary><p>' + D.bandsText + '</p><p class="tiny">' + D.bandsNote + " The thicker dashed line on each bar marks ‘high’ (anemia: ‘severe’).</p></details></div>" +
      '<div id="gh-caus" hidden><div id="gh-cchips"></div><figure class="gh-flowfig"><svg class="gh-flow" id="gh-flow" role="img" aria-label="Causes overlay"></svg><figcaption class="tiny" id="gh-flowtxt" aria-live="polite"></figcaption></figure></div>' +
    '</div><div class="gh-side"><h4 class="gh-h4">Readout</h4><dl class="read" id="gh-read" aria-live="polite"></dl></div></div>';

  var modeRG = radios($("#gh-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); var was = S.mode; S.mode = v; commit(); if (v === "profiles" && was !== "profiles") growBars(); } });
  var measRG = radios($("#gh-meas"), { label:"Measure", options:D.measures, value:S.measure, onChange:function(v){ cancelAnim(); S.measure = v; api.save(); morphTo(v === "count" ? 1 : 0, 650); paintWorld(); paintRead(); MV.changed(); } });
  var bigRG = radios($("#gh-big"), { label:"Name the selected profile’s biggest problem", aria:"Biggest problem", cls:"chips", value:S.big,
    options:[{ id:"stunting", t:"Stunting" }, { id:"wasting", t:"Wasting" }, { id:"over", t:"Overweight" }],
    onChange:function(v){ cancelAnim(); S.big = v; commit(); } });
  var cRG = radios($("#gh-cchips"), { label:"Cause", cls:"chips", value:S.cause,
    options:D.overlay.map(function(id){ var c = cause(id); return { id:id, t:c.ov || c.t }; }),
    onChange:function(v){ cancelAnim(); S.cause = v; fx.scen = false; commit(); drawFlow(); } });

  // ===== World view =====
  $("#gh-rbtns").addEventListener("click", function(e){
    var b = e.target.closest("[data-reg]"); if (!b) return;
    cancelAnim(); S.region = b.dataset.reg; S.slots[S.measure] = S.region; commit();
  });
  $("#gh-slots").addEventListener("click", function(e){ if (e.target.closest("[data-clear]")) { cancelAnim(); S.slots = { rate:"", count:"" }; commit(); var f = $("#gh-rbtns [data-reg]"); if (f) f.focus({ preventScroll:true }); } });
  function vals(id, wiOn){
    var p = prof(id), v = { s:p.s, w:p.w, o:p.o, an:p.an };
    if (wiOn && S.wi && S.wv[id]) CHILD.forEach(function(k){ if (S.wv[id][k] != null) v[k] = S.wv[id][k]; });
    return v;
  }
  function paintWorld(){
    var count = S.measure === "count", R = D.regions;
    $("#gh-map").innerHTML = mapSVG({ shade:1 - fx.morph, circ:fx.morph, sel:S.region, lw:1.2 });
    $("#gh-map").setAttribute("aria-label", mapAria(S.measure, S.region));
    var maxC = 384, rb = $("#gh-rbtns");
    MV.keepFocus(rb, function(){
      rb.innerHTML = R.map(function(x){
        var on = S.region === x.id, v = count ? (x.low ? "not shown" : countT(x)) : rateT(x), w = x.low ? 0 : count ? x.count / maxC * 100 : x.rate / 20 * 100;
        return '<button type="button" class="gh-rb" data-reg="' + x.id + '" data-k="rg' + x.id + '" aria-pressed="' + on + '" style="left:' + f1(BTN[x.id][0] / 7) + "%;top:" + f1(BTN[x.id][1] / 2.8) + '%"><span class="gh-rn">' + x.t + '</span><span class="gh-rv">' + v + '</span><span class="gh-rbar" aria-hidden="true"><i style="width:' + f1(w) + '%"></i></span></button>';
      }).join("");
    });
    $("#gh-key").innerHTML = count ? D.keyCount : D.keyRate;
    var SL = D.slots, sh = $("#gh-slots");
    MV.keepFocus(sh, function(){
      sh.innerHTML = [["rate", SL.rate, SL.rateHow], ["count", SL.count, SL.countHow]].map(function(q, i){
        var v = S.slots[q[0]];
        return '<div class="gh-slot' + (S.measure === q[0] ? " on" : "") + '"><span class="gh-sn">Slot ' + (i + 1) + ": " + q[1] + '</span><span class="gh-sv">' + (v ? reg(v).t : '<span class="muted">(' + q[2] + ")</span>") + "</span></div>";
      }).join("") + '<button type="button" class="btn ghost sm" data-clear="1" data-k="slclr"' + (S.slots.rate || S.slots.count ? "" : " disabled") + ">Clear slots</button>";
    });
  }
  function morphTo(target, dur){
    if (cos) { cos(); cos = null; }
    var from = fx.morph; if (from === target) return;
    cos = MV.tween({ dur:dur, step:function(t){ fx.morph = from + (target - from) * t; $("#gh-map").innerHTML = mapSVG({ shade:1 - fx.morph, circ:fx.morph, sel:S.region, lw:1.2 }); }, done:function(){ cos = null; fx.morph = target; paintWorld(); } });
  }

  // ===== Country profiles =====
  $("#gh-pcards").addEventListener("click", function(e){
    var b = e.target.closest("[data-pf]"); if (!b) return;
    cancelAnim(); if (S.prof !== b.dataset.pf) { S.prof = b.dataset.pf; S.big = ""; } commit(); buildSliders();
  });
  function paintCards(){
    var pc = $("#gh-pcards");
    MV.keepFocus(pc, function(){
      pc.innerHTML = D.profiles.map(function(p){
        var sel = S.prof === p.id, v = vals(p.id, sel);
        return cardHTML(p, v, { tag:"button", sel:sel, wi:sel && S.wi, grow:fx.grow, oT:p.id === "B" && fx.oT != null ? fx.oT : null, hideRib:p.id === "B" && fx.oT != null && fx.oT < 1, pulseW:p.id === "A" ? fx.pulseW : 0, note:p.id === "A" && fx.note ? D.wastingNote : "" });
      }).join("");
    });
  }
  function totalChange(){ var p = prof(S.prof), v = vals(S.prof, true); return Math.abs(v.s - p.s) + Math.abs(v.w - p.w) + Math.abs(v.o - p.o); }
  var wiHost = $("#gh-wi");
  wiHost.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.wi) { cancelAnim(); S.wi = !S.wi; commit(); buildSliders(); var f = $('#gh-wi [data-wi]'); if (f) f.focus({ preventScroll:true }); }
    else if (b.dataset.wireset) { cancelAnim(); delete S.wv[S.prof]; commit(); buildSliders(); var g = $('#gh-wi [data-wireset]'); if (g) g.focus({ preventScroll:true }); }
  });
  function buildSliders(){
    var p = prof(S.prof);
    wiHost.innerHTML = switchHTML("wisw", "What-if mode (for challenge 3)", S.wi, 'data-wi="1"') +
      (S.wi ? '<div class="gh-wis"><p class="tiny">Move the sliders to change profile ' + p.id + "’s child indicators (1% steps).</p><div id=\"gh-sl\"></div>" +
        '<p class="gh-wit" id="gh-wit" aria-live="polite"></p><button type="button" class="btn ghost sm" data-wireset="1" data-k="wireset">Reset profile ' + p.id + "</button></div>" : "");
    sl = null;
    if (!S.wi) return;
    var v = vals(S.prof, true);
    sl = MV.sliders($("#gh-sl"), CHILD.map(function(k){ return { id:"gh" + k, label:byId(D.indicators, k).t + " (children under 5)", min:0, max:40, step:1, value:v[k], fmt:function(x){ return x + "%"; } }; }),
      function(id, val){ cancelAnim(); var k = id.slice(2); S.wv[S.prof] = S.wv[S.prof] || {}; S.wv[S.prof][k] = val; api.save(); paintCards(); paintRead(); paintWit(); MV.changed(); });
    paintWit();
  }
  function paintWit(){ var w = $("#gh-wit"); if (w) w.textContent = "Total change: " + totalChange() + (totalChange() === 1 ? " point" : " points") + " · Double burden: " + (isDB(vals(S.prof, true)) ? "on" : "off"); }
  function growBars(){
    if (MV.reduceMotion) return;
    fx.grow = 0; paintCards();
    anim = MV.tween({ dur:700, step:function(t){ fx.grow = t; paintCards(); }, done:function(){ anim = null; fx.grow = 1; paintCards(); } });
  }

  // ===== Causes overlay =====
  function narrowFlow(){ var w = $("#gh-flow").getBoundingClientRect().width; return w ? w < 520 : window.innerWidth < 600; }
  function drawFlow(){
    var c = S.cause ? cause(S.cause) : null, nw = narrowFlow(), svg = $("#gh-flow");
    svg.setAttribute("viewBox", (nw ? FL.n : FL.w).vb);
    svg.innerHTML = flowSVG({ c:c, scen:fx.scen ? D.normalHarvest : "", t:fx.flowT, narrow:nw, pulse:fx.pulse });
    svg.setAttribute("aria-label", c ? "Causes overlay: " + MV.plain(flowText(c)) : "Causes overlay: " + (fx.scen ? D.normalHarvest + ". No arrows yet." : "no cause chosen yet. Tap a cause card."));
    $("#gh-flowtxt").textContent = c ? flowText(c) : fx.scen ? D.normalHarvest + "." : "Tap a cause card to see the arrows it sends to the components of food security and the forms of malnutrition.";
  }
  window.addEventListener("resize", function(){ if (S.mode === "causes") drawFlow(); });
  if (window.ResizeObserver) new ResizeObserver(function(){ if (S.mode === "causes" && fx.flowT == null) drawFlow(); }).observe($(".gh-flowfig", host));
  function animateFlow(done){
    var c = cause(S.cause), n = arrowsOf(c).length;
    if (MV.reduceMotion) { fx.flowT = null; drawFlow(); if (done) MV.wait(50, done); return; }
    fx.flowT = 0; drawFlow();
    anim = MV.tween({ dur:420 * n, ease:function(t){ return t; }, step:function(t){ fx.flowT = t * n; drawFlow(); }, done:function(){ anim = null; fx.flowT = null; drawFlow(); if (done) done(); } });
  }

  // ===== readout =====
  function paintRead(){
    var L = D.readLabels, rows = [];
    if (S.mode === "world") {
      var R = S.region ? reg(S.region) : null;
      rows.push([L.sel, R ? R.t : '<span class="muted">none yet: tap a region</span>']);
      if (R) {
        var rep = D.regions.filter(function(x){ return !x.low; });
        rows.push([L.rate, rateT(R)]);
        rows.push([L.count, R.low ? D.lowCount : R.rate + "% × " + R.pop + " million " + (R.approx ? "≈ " : "= ") + R.count + " million"]);
        rows.push([L.rank, R.low ? D.lowRank : "Rate: " + ORD[rep.slice().sort(function(a, b){ return b.rate - a.rate; }).indexOf(R)] + " of " + rep.length + " · Count: " + ORD[rep.slice().sort(function(a, b){ return b.count - a.count; }).indexOf(R)] + " of " + rep.length]);
      }
    } else if (S.mode === "profiles") {
      var v = vals(S.prof, true), hid = S.prof === "B" && fx.oT != null && fx.oT < 1;
      rows.push([L.sel, "Profile " + S.prof + (S.wi ? " (What-if)" : "")]);
      rows.push([L.big, hid ? "…" : biggest(v).text]);
      rows.push([L.db, hid ? "…" : dbText(v)]);
      if (S.wi) rows.push([L.change, totalChange() + (totalChange() === 1 ? " point" : " points")]);
    } else {
      var c = S.cause ? cause(S.cause) : null;
      rows.push([L.sel, c ? (c.ov || c.t) : fx.scen ? D.normalHarvest : '<span class="muted">none yet: tap a cause</span>']);
      rows.push([L.cause, c ? (c.ov || c.t) + " → " + compList(c).join(", ") : "…"]);
    }
    rows.push([L.data, D.dataLine]);
    $("#gh-read").innerHTML = MV.readoutHTML(rows);
  }
  function paint(){
    modeRG.set(S.mode); measRG.set(S.measure); bigRG.set(S.big); cRG.set(S.cause);
    $("#gh-world").hidden = S.mode !== "world"; $("#gh-prof").hidden = S.mode !== "profiles"; $("#gh-caus").hidden = S.mode !== "causes";
    if (S.mode === "world") paintWorld();
    if (S.mode === "profiles") { paintCards(); paintWit(); }
    if (S.mode === "causes") drawFlow();
    paintRead();
  }
  function commit(){ api.save(); paint(); MV.changed(); }
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }
  function resetFx(){ fx.oT = null; fx.pulseW = 0; fx.note = false; fx.flowT = null; fx.pulse = 0; fx.grow = 1; }
  function finish(){ anim = null; timers = []; fx.oT = null; fx.pulseW = 0; fx.flowT = null; fx.pulse = 0; api.save(); paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){
    if (anim) { anim(); anim = null; } timers.forEach(clearTimeout); timers = [];
    if (cos) { cos(); cos = null; fx.morph = S.measure === "count" ? 1 : 0; }
    resetFx();
    if (pend) { var d = pend; pend = null; d(); }
  }
  buildSliders();
  paint();

  // ===== target challenges (plan's exact tests and named wrong states) =====
  function challenge(id){
    var M = D.msgs, r = { ok:false };
    if (id === "tc1") {
      var a = S.slots.rate, b = S.slots.count;
      if (a === "af" && b === "as") r = { ok:true };
      else if (a === "af" && b === "af") r.msg = M.tc1AfBoth;
      else if (a === "as" && b === "as") r.msg = M.tc1AsBoth;
      else if (a === "oc") r.msg = M.tc1Oc;
      else if (!a || !b) r.msg = M.tc1Empty;
      else if (a === "as" && b === "af") r.msg = M.tc1Swap;
      else if (a !== "af") r.msg = M.tc1Rate;
      else r.msg = M.tc1Count;
    } else if (id === "tc2") {
      if (S.prof === "B") r.msg = M.tc2B;
      else if (S.prof !== "A") r.msg = M.tc2Other;
      else if (!S.big) r.msg = M.tc2Chip;
      else if (S.big === "wasting") r.msg = M.tc2Wasting;
      else if (S.big === "over") r.msg = M.tc2Over;
      else r = { ok:true };
    } else if (id === "tc3") {
      var v = vals("D", true), tot = Math.abs(v.s - 14) + Math.abs(v.w - 7) + Math.abs(v.o - 6);
      if (!S.wi) r.msg = M.tc3Mode;
      else if (S.prof !== "D") r.msg = M.tc3Prof;
      else if (v.w > 7) r.msg = M.tc3Wasting;
      else if (v.w < 7) r.msg = M.tc3WastingDown;
      else if (isDB(v)) { if (v.s === 20 && v.o === 10) r = { ok:true }; else r.msg = fill(M.tc3Moved, { n:tot }); }
      else if (v.s >= 20) r.msg = M.tc3OnlyS;
      else r.msg = M.tc3Rule;
    }
    return r;
  }

  // ===== predictions =====
  function reveal(el){ var b = el && el.getBoundingClientRect(); if (b && b.height && (b.top < 110 || b.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); fx.note = false;
        if (p.id === "p1") { S.mode = "world"; S.measure = "rate"; fx.morph = 0; }
        else if (p.id === "p2") { S.mode = "profiles"; S.prof = "B"; S.wi = false; fx.oT = 0; buildSliders(); }
        else if (p.id === "p3") { S.mode = "causes"; S.cause = ""; fx.scen = true; }
        else if (p.id === "p4") { S.mode = "profiles"; S.prof = "A"; S.wi = false; buildSliders(); }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") {
          reveal($(".gh-mapw") && $(".gh-mapw").getBoundingClientRect().height ? $(".gh-mapw") : $("#gh-rbtns"));
          later(300, function(){
            S.measure = "count"; measRG.set("count"); paintWorld(); paintRead();
            anim = MV.tween({ dur:1600, step:function(t){ fx.morph = t; $("#gh-map").innerHTML = mapSVG({ shade:1 - t, circ:t, sel:S.region, lw:1.2 }); }, done:function(){ anim = null; fx.morph = 1; later(250, finish); } });
          });
        } else if (p.id === "p2") {
          reveal($("#gh-pcards"));
          later(350, function(){ anim = MV.tween({ dur:1500, step:function(t){ fx.oT = t; paintCards(); paintRead(); }, done:function(){ anim = null; fx.oT = 1; paintCards(); later(350, finish); } }); });
        } else if (p.id === "p3") {
          reveal($("#gh-flow"));
          later(300, function(){ S.cause = "drought"; fx.scen = false; cRG.set("drought"); paintRead(); animateFlow(function(){
            if (MV.reduceMotion) { finish(); return; }
            anim = MV.tween({ dur:1200, ease:function(t){ return t; }, step:function(t){ fx.pulse = t; drawFlow(); }, done:function(){ anim = null; fx.pulse = 0; finish(); } });
          }); });
        } else {
          reveal($("#gh-pcards"));
          later(300, function(){ fx.note = true; anim = MV.tween({ dur:1600, ease:function(t){ return t; }, step:function(t){ fx.pulseW = t; paintCards(); }, done:function(){ anim = null; fx.pulseW = 0; finish(); } }); });
        }
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: Why hunger persists (@component causeMapBuilder — three columns of buttons (causes, components, outcomes);
// "Link to…" taps instead of dragging; accepted links drawn as connectors over the columns (hidden on phones, where the
// columns stack and "Your map" lists the links); "Check it with data" model scenarios tested against the student's map) ----------
function part3(host, api){
  var D = api.content, S = api.S, msg = null, bad = null, ro = null;
  S.links = S.links || {}; D.causes.forEach(function(c){ var x = S.links[c.id] || (S.links[c.id] = {}); x.comps = x.comps || {}; x.outs = x.outs || {}; });
  S.sel = cause(S.sel) ? S.sel : ""; S.cur = S.cur || "";
  function L(id){ return S.links[id]; }
  function compT(id){ return byId(D.components, id).t; }
  function outT(id){ return byId(D.outcomes, id).t; }
  function mapped(c){ var x = L(c.id); return Object.keys(x.comps).some(function(k){ return x.outs[k] && Object.keys(x.outs[k]).length; }); }
  function nMapped(){ return D.causes.filter(mapped).length; }
  host.innerHTML = '<div class="gh-frame" role="note"><p>' + D.frame + '</p></div><p class="how">' + D.how + "</p>" +
    '<div class="gh-cm" id="gh-cm"><svg class="gh-cmsvg" id="gh-cmsvg" aria-hidden="true"></svg>' +
      '<div class="gh-cmc"><h4 class="gh-h4">Causes</h4><div class="gh-cml" id="gh-cmc" role="group" aria-label="Causes"></div></div>' +
      '<div class="gh-cmc"><h4 class="gh-h4">Components of food security</h4><p class="gh-cmh" id="gh-cmkh"></p><div class="gh-cml" id="gh-cmk" role="group" aria-label="Components of food security"></div></div>' +
      '<div class="gh-cmc"><h4 class="gh-h4">Outcomes</h4><p class="gh-cmh" id="gh-cmoh"></p><div class="gh-cml" id="gh-cmo" role="group" aria-label="Outcomes"></div></div></div>' +
    '<div id="gh-cmfb" aria-live="polite"></div><p class="tiny gh-cmprog" id="gh-cmprog" aria-live="polite"></p>' +
    '<div class="gh-cmtxt"><h4 class="gh-h4">Your map</h4><ul id="gh-cmlist"></ul></div>' +
    '<details class="alg gh-p3data"><summary>Check it with data</summary><div id="gh-p3d"></div></details>';
  var cm = $("#gh-cm", host);
  function paintCols(){
    var sel = S.sel ? cause(S.sel) : null, x = sel ? L(sel.id) : null, key = sel ? MV.ans(sel) : null;
    MV.keepFocus($("#gh-cmc", host), function(){
      $("#gh-cmc", host).innerHTML = D.causes.map(function(c){
        var on = S.sel === c.id, m = mapped(c), part = !m && Object.keys(L(c.id).comps).length;
        return '<button type="button" class="gh-cb' + (m ? " done" : "") + '" data-c="' + c.id + '" data-k="cmc' + c.id + '" aria-pressed="' + on + '"><span class="gh-cbm" aria-hidden="true">' + (m ? "✓" : part ? "•" : "") + "</span><span>" + c.t + "</span>" + (m ? '<span class="vh"> (mapped)</span>' : "") + "</button>";
      }).join("");
    });
    $("#gh-cmkh", host).innerHTML = sel ? "Link <strong>" + lc(sel.short) + "</strong> to…" : "Tap a cause first.";
    MV.keepFocus($("#gh-cmk", host), function(){
      $("#gh-cmk", host).innerHTML = D.components.map(function(k){
        var lk = x && x.comps[k.id], cur = lk && S.cur === k.id, wr = bad && bad.kind === "comp" && bad.id === k.id;
        return '<button type="button" class="gh-kb' + (lk ? " linked" : "") + (wr ? " wrong" : "") + '" data-kk="' + k.id + '" data-k="cmk' + k.id + '" aria-pressed="' + !!cur + '"><span>' + k.t + "</span>" + (lk ? '<span class="gh-st">linked ✓</span>' : wr ? '<span class="gh-st">✗</span>' : "") + "</button>";
      }).join("");
    });
    var curOk = sel && S.cur && x.comps[S.cur];
    $("#gh-cmoh", host).innerHTML = curOk ? "Link <strong>" + lc(compT(S.cur)) + "</strong> to…" : sel ? "Link a component first." : "";
    MV.keepFocus($("#gh-cmo", host), function(){
      $("#gh-cmo", host).innerHTML = D.outcomes.map(function(o){
        var lk = curOk && x.outs[S.cur] && x.outs[S.cur][o.id], wr = bad && bad.kind === "out" && bad.id === o.id;
        return '<button type="button" class="gh-ob' + (lk ? " linked" : "") + (wr ? " wrong" : "") + '" data-oo="' + o.id + '" data-k="cmo' + o.id + '"><span>' + o.t + "</span>" + (lk ? '<span class="gh-st">linked ✓</span>' : wr ? '<span class="gh-st">✗</span>' : "") + "</button>";
      }).join("");
    });
    void key;
  }
  function pathText(c){
    var x = L(c.id), parts = [];
    D.components.forEach(function(k){
      if (!x.comps[k.id]) return;
      var outs = D.outcomes.filter(function(o){ return x.outs[k.id] && x.outs[k.id][o.id]; }).map(function(o){ return lc(o.t) + ((c.onotes || {})[o.id] ? " " + c.onotes[o.id] : ""); });
      parts.push(lc(k.t) + ((c.notes || {})[k.id] ? " (" + c.notes[k.id] + ")" : "") + (outs.length ? " → " + outs.join(", ") : ' → <span class="muted">(no outcome yet)</span>'));
    });
    return parts.length ? c.t + " → " + parts.join("; ") : "";
  }
  function paintList(){
    var items = D.causes.map(pathText).filter(Boolean);
    $("#gh-cmlist", host).innerHTML = items.length ? items.map(function(t){ return "<li>" + t + "</li>"; }).join("") : '<li class="muted">No links yet.</li>';
    var n = nMapped();
    $("#gh-cmprog", host).textContent = "Causes mapped: " + n + " of " + D.causes.length + ".";
  }
  function hasPath(p){
    var x = L(p.cause);
    return p.comp.every(function(k){ return x.comps[k]; }) && p.comp.some(function(k){ return x.outs[k] && x.outs[k][p.out]; });
  }
  function pathLabel(p){ return cause(p.cause).t + " → " + p.comp.map(function(k){ return lc(compT(k)); }).join(" and ") + " → " + lc(outT(p.out)); }
  function paintData(){
    var DD = D.data;
    $("#gh-p3d", host).innerHTML = '<p class="tiny">Model scenarios <span class="hfa-model">Model data</span></p><div class="gh-scens">' + DD.scenarios.map(function(s){
      var ok = hasPath(s.path), bars = s.from != null ? '<div class="gh-sbars" role="img" aria-label="' + esc(s.measure + ": " + s.from + "% before, " + s.to + "% after") + '">' +
        [["Before", s.from, ""], ["After", s.to, " after"]].map(function(b){ return '<div class="gh-sb"><span class="gh-sbl">' + b[0] + '</span><span class="gh-sbt"><i class="' + b[2].trim() + '" style="width:' + f1(b[1] / 20 * 100) + '%"></i></span><span class="gh-sbv">' + b[1] + "%</span></div>"; }).join("") + "</div>" : "";
      return '<article class="gh-scen"><h5 class="gh-h5">' + s.t + "</h5><p>" + s.text + "</p>" + (s.measure ? '<p class="tiny"><strong>' + s.measure + ":</strong> " + s.from + "% → " + s.to + "%</p>" : "") + bars +
        '<p class="gh-quote">“' + s.quote + '”</p><p class="tiny gh-scheck">' + (ok ? "✓ Your map has this path: " : "Not in your map yet: ") + pathLabel(s.path) + ".</p></article>";
    }).join("") + "</div>";
  }
  function drawLinks(){
    var svg = $("#gh-cmsvg", host); if (!svg) return;
    var B = cm.getBoundingClientRect();
    if (!B.width || getComputedStyle(svg).display === "none") { svg.innerHTML = ""; return; }
    svg.setAttribute("viewBox", "0 0 " + f1(B.width) + " " + f1(B.height)); svg.setAttribute("width", f1(B.width)); svg.setAttribute("height", f1(B.height));
    function pt(el, right){ var r = el.getBoundingClientRect(); return [(right ? r.right : r.left) - B.left, r.top - B.top + r.height / 2]; }
    function curve(a, b){ var mx = (a[0] + b[0]) / 2; return "M" + f1(a[0]) + " " + f1(a[1]) + "C" + f1(mx) + " " + f1(a[1]) + " " + f1(mx) + " " + f1(b[1]) + " " + f1(b[0]) + " " + f1(b[1]); }
    function head(b){ return '<path class="gh-cmhd" d="M' + f1(b[0] - 8) + " " + f1(b[1] - 5) + "L" + f1(b[0]) + " " + f1(b[1]) + "L" + f1(b[0] - 8) + " " + f1(b[1] + 5) + 'Z"/>'; }
    var lo = "", hi = "", seen = {};
    D.causes.forEach(function(c){
      var x = L(c.id), on = S.sel === c.id, cb = $('[data-c="' + c.id + '"]', host);
      Object.keys(x.comps).forEach(function(k){
        var kb = $('[data-kk="' + k + '"]', host); if (!cb || !kb) return;
        var a = pt(cb, true), b = pt(kb, false), s = '<path class="gh-cmln' + (on ? " on" : "") + '" d="' + curve(a, b) + '"/>' + head(b);
        if (on) hi += s; else lo += s;
        Object.keys(x.outs[k] || {}).forEach(function(o){
          var ob = $('[data-oo="' + o + '"]', host); if (!ob) return;
          var key = k + o; if (!on && seen[key]) return; seen[key] = 1;
          var a2 = pt(kb, true), b2 = pt(ob, false), s2 = '<path class="gh-cmln' + (on ? " on" : "") + '" d="' + curve(a2, b2) + '"/>' + head(b2);
          if (on) hi += s2; else lo += s2;
        });
      });
    });
    svg.innerHTML = '<g class="gh-cmlo">' + lo + "</g>" + hi;
  }
  function paintFb(){
    var fb = $("#gh-cmfb", host);
    fb.innerHTML = (msg ? MV.fbHTML(msg.kind, msg.html) : "") + (nMapped() === D.causes.length ? MV.fbHTML("good", "<strong>✓ " + D.msgs.done + "</strong>") : "");
  }
  function paintAll(){ paintCols(); paintList(); paintData(); paintFb(); drawLinks(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b)) return;
    var M = D.msgs, sel = S.sel ? cause(S.sel) : null;
    if (b.dataset.c) {
      S.sel = b.dataset.c; var x0 = L(S.sel), firstK = D.components.filter(function(k){ return x0.comps[k.id]; })[0];
      S.cur = firstK ? firstK.id : ""; msg = null; bad = null; api.save(); paintAll(); return;
    }
    if (b.dataset.kk) {
      var k = b.dataset.kk;
      if (!sel) { msg = { kind:"", html:M.pickCause }; bad = null; paintFb(); return; }
      var key = MV.ans(sel), x = L(sel.id);
      if (key[k]) {
        x.comps[k] = true; S.cur = k; bad = null;
        var nt = (sel.notes || {})[k];
        msg = { kind:"good", html:"<strong>✓</strong> " + fill(M.compOk, { c:sel.t, k:lc(compT(k)), n:nt ? " (" + nt + ")" : "" }) };
      } else { bad = { kind:"comp", id:k }; msg = { kind:"bad", html:"<strong>✗ Not quite.</strong> " + M.wrongComp }; }
      api.save(); paintAll(); MV.focusFb($("#gh-cmfb", host)); return;
    }
    if (b.dataset.oo) {
      var o = b.dataset.oo;
      if (!sel) { msg = { kind:"", html:M.pickCause }; bad = null; paintFb(); return; }
      var x2 = L(sel.id), key2 = MV.ans(sel);
      if (!S.cur || !x2.comps[S.cur]) { msg = { kind:"", html:M.pickComp }; bad = null; paintFb(); return; }
      if (key2[S.cur].indexOf(o) >= 0) {
        x2.outs[S.cur] = x2.outs[S.cur] || {}; x2.outs[S.cur][o] = true; bad = null;
        var on = (sel.onotes || {})[o];
        msg = { kind:"good", html:"<strong>✓</strong> " + fill(M.outOk, { c:sel.t, k:lc(compT(S.cur)), o:lc(outT(o)) + (on ? " " + on : "") }) };
      } else { bad = { kind:"out", id:o }; msg = { kind:"bad", html:"<strong>✗ Not quite.</strong> " + M.wrongOut }; }
      api.save(); paintAll(); MV.focusFb($("#gh-cmfb", host));
    }
  });
  if (window.ResizeObserver) { ro = new ResizeObserver(function(){ drawLinks(); }); ro.observe(cm); }
  window.addEventListener("resize", drawLinks);
  paintAll();
  part3.redraw = drawLinks;
}

// ---------- Practice 2: Data detective (@component decisionSet, adapted from HFA4U 15 — custom ★ set: N4 number entry, chip
// groups, pick-two toggles and N5 ordering with Move up / Move down; first try = right on the first check without the worked
// solution) ----------
function detective(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {}, sel = {};
  function ist(it){ var x = S.items[it.id]; if (!x) x = S.items[it.id] = { vals:{}, picks:{}, pick:[], order:null, tries:0, hint:0, solved:false, first:null }; x.vals = x.vals || {}; x.picks = x.picks || {}; x.pick = x.pick || []; if (it.steps && !Array.isArray(x.order)) x.order = (it.start || it.steps.map(function(_, i){ return i; })).slice(); return x; }
  function tableHTML(){
    var P = MV.C.explore.profiles;
    return '<div class="tbl-wrap gh-dtab"><table><caption>Model profiles <span class="hfa-model">Model data</span></caption><thead><tr><th scope="col">Profile</th><th scope="col">Stunting</th><th scope="col">Wasting</th><th scope="col">Overweight</th><th scope="col">Stresses</th></tr></thead><tbody>' +
      P.map(function(p){ return '<tr><th scope="row">' + p.id + "</th><td>" + p.s + "% (" + bandT("s", p.s) + ")</td><td>" + p.w + "% (" + bandT("w", p.w) + ")</td><td>" + p.o + "% (" + bandT("o", p.o) + ")</td><td>" + p.stress.join("; ") + "</td></tr>"; }).join("") + "</tbody></table></div>";
  }
  function qHTML(it, i){
    var x = ist(it), dis = x.solved ? " disabled" : "";
    var h = '<div class="q" data-ti="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">D' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★' + (it.inquiry ? " Inquiry" : "") + "</span>" : "") + "</div>";
    if (it.table) h += tableHTML();
    (it.groups || []).forEach(function(g){
      h += '<div class="gh-dg"><span class="gh-rgl">' + g.label + '</span><div class="gh-chipset" role="radiogroup" aria-label="' + esc(MV.plain(g.label)) + '">' + g.choices.map(function(c, ci){
        var on = x.picks[g.id] === ci; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (x.picks[g.id] == null && ci === 0) ? 0 : -1) + '" data-g="' + g.id + '" data-ci="' + ci + '" data-k="' + it.id + g.id + ci + '"' + dis + ">" + c.t + "</button>";
      }).join("") + "</div></div>";
    });
    if (it.pick) h += '<div class="gh-dg"><span class="gh-rgl">' + it.pick.label + '</span><div class="gh-chipset" role="group" aria-label="' + esc(it.pick.label) + '">' + it.pick.options.map(function(p){
      var on = x.pick.indexOf(p.id) >= 0; return '<button type="button" aria-pressed="' + on + '" data-pk="' + p.id + '" data-k="' + it.id + "pk" + p.id + '"' + dis + ">" + (on ? "✓ " : "") + p.t + "</button>";
    }).join("") + "</div></div>";
    if (it.nums) h += '<div class="gh-nums">' + it.nums.map(function(n){
      return '<div class="numrow"><label for="ghd-' + it.id + n.id + '">' + n.label + ':</label><input class="numin short" id="ghd-' + it.id + n.id + '" data-tn="' + it.id + '" data-nn="' + n.id + '" data-k="' + it.id + n.id + 'in" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.vals[n.id] || "") + '"' + dis + ">" + (n.unit ? "<span>" + n.unit + "</span>" : "") + "</div>";
    }).join("") + "</div>";
    if (it.steps) {
      h += '<ol class="olist">' + x.order.map(function(si, pos){
        var isSel = sel[it.id] === pos && !x.solved;
        return '<li><button type="button" class="ostep' + (x.solved ? " good" : "") + '" aria-pressed="' + isSel + '" data-pos="' + pos + '" data-k="' + it.id + "p" + si + '"' + dis + '><span class="sn">' + (pos + 1) + ".</span><span>" + it.steps[si] + "</span></button>" +
          (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + it.id + 'up"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="' + it.id + 'down"' + (pos === x.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
      }).join("") + "</ol>";
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].skip ? "" : "bad", msgs[it.id].h);
    return h + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(qHTML).join("");
  function repaint(it){
    var box = host.querySelector('[data-ti="' + it.id + '"]'), act = document.activeElement, k = act && box.contains(act) && act.dataset ? act.dataset.k : null;
    var div = document.createElement("div"); div.innerHTML = qHTML(it, a.items.indexOf(it)); var nb = div.firstChild; box.parentNode.replaceChild(nb, box);
    if (k) { var f = nb.querySelector('[data-k="' + k + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true }); }
    return nb;
  }
  function judge(it, x){
    var NQ = "<strong>✗ Not quite.</strong> ";
    if (it.groups) {
      if (!it.groups.every(function(g){ return x.picks[g.id] != null; })) return { skip:true, msg:"Choose an answer." };
      for (var gi = 0; gi < it.groups.length; gi++) { var g = it.groups[gi], c = g.choices[x.picks[g.id]]; if (!MV.ok(c)) return { msg:NQ + (c.fb || it.wrongDefault || "") + " Try again." }; }
    }
    if (it.nums) {
      var vs = it.nums.map(function(n){ return numIn(x.vals[n.id]); });
      if (vs.some(function(v){ return v == null; })) return { skip:true, msg:it.nums.length > 1 ? "Enter a number in each box." : "Enter a number in the box." };
      for (var ni = 0; ni < it.nums.length; ni++) {
        if (Math.abs(vs[ni] - MV.ans(it.nums[ni])) > 1e-9) {
          var w = (it.wrong || []).filter(function(q){ return Math.abs(vs[ni] - q.match) < 1e-9; })[0];
          return { msg:NQ + (w ? w.fb : it.numFb || it.wrongDefault) + " Try again." };
        }
      }
    }
    if (it.pick) {
      var n = it.pick.n;
      if (x.pick.length !== n) return { skip:true, msg:"Choose exactly two profiles." };
      var ans = MV.ans(it.pick), extra = x.pick.filter(function(id){ return ans.indexOf(id) < 0; });
      if (extra.length) return { msg:NQ + extra.sort().map(function(id){ return it.pick.fb[id] || ""; }).join(" ") + " Try again." };
    }
    if (it.steps && !x.order.every(function(v, i){ return v === i; })) return { msg:"<strong>✗ Not yet.</strong> " + it.fb };
    return { ok:true };
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.tn) return; ist(byId(a.items, d.tn)).vals[d.nn] = e.target.value; msgs[d.tn] = null; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.tn) { e.preventDefault(); var b = host.querySelector('[data-k="' + e.target.dataset.tn + 'chk"]'); if (b) b.click(); return; }
    var c = e.target.closest && e.target.closest("[data-ci]"), d = arrowKeys(e); if (!c || !d) return;
    e.preventDefault(); var sib = $$("button", c.parentNode), k = sib.indexOf(c), nb = sib[(k + d + sib.length) % sib.length]; if (nb && !nb.disabled) { nb.focus(); nb.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ti]"); if (!box) return;
    var it = byId(a.items, box.dataset.ti), x = ist(it);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.g) { x.picks[b.dataset.g] = +b.dataset.ci; msgs[it.id] = null; }
    else if (b.dataset.pk) { var id = b.dataset.pk, k = x.pick.indexOf(id); if (k >= 0) x.pick.splice(k, 1); else x.pick.push(id); msgs[it.id] = null; }
    else if (b.dataset.pos != null) { var p = +b.dataset.pos; sel[it.id] = sel[it.id] === p ? null : p; repaint(it); return; }
    else if (b.dataset.mv) {
      var i = sel[it.id], j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= x.order.length) return;
      var t = x.order[i]; x.order[i] = x.order[j]; x.order[j] = t; sel[it.id] = j; msgs[it.id] = null; api.save();
      var nb = repaint(it), f = nb.querySelector('[data-mv="' + b.dataset.mv + '"]'); if (f && !f.disabled) f.focus(); else { var sb = nb.querySelector('[data-pos="' + j + '"]'); if (sb) sb.focus(); }
      return;
    }
    else if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; sel[it.id] = null; }
      else { if (!r.skip) x.tries++; msgs[it.id] = { h:r.msg, skip:!!r.skip }; }
      api.save(); MV.focusFb(repaint(it)); return;
    }
    api.save(); repaint(it);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a nutrition response (@component interventionPicker — eight toggle chips, choose
// exactly three; preview: profile A's card and the chosen response) ----------
var task = (function(){
  var api = null;
  function TK(){ return MV.C.task; }
  var LET = "abcdefgh";
  function read(){ var s = (api && api.S) || {}; var sel = (Array.isArray(s.sel) ? s.sel : []).filter(function(id){ return LET.indexOf(id) >= 0 && id.length === 1; }); return { sel:sel.slice().sort() }; }
  function has(d, id){ return d.sel.indexOf(id) >= 0; }
  function checks(d){ return [has(d, "a") || has(d, "e"), has(d, "c") || has(d, "d"), has(d, "b"), !has(d, "g"), d.sel.length === 3]; }
  function keyOf(d){ return d.sel.join(","); }
  function text(k){ return "{" + k.split(",").join(", ") + "}"; }
  function paint(){
    var d = read(), host = $("#gh-tkin"); if (!host) return;
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="gh-rgl">Interventions (' + d.sel.length + " chosen)</p>" + '<div class="gh-ivs" role="group" aria-label="Interventions">' + TK().interventions.map(function(iv){
        var on = has(d, iv.id);
        return '<button type="button" class="gh-iv" data-iv="' + iv.id + '" data-k="iv' + iv.id + '" aria-pressed="' + on + '"><span class="gh-ivl" aria-hidden="true">' + (on ? "✓" : "(" + iv.id + ")") + '</span><span><span class="vh">(' + iv.id + ") </span>" + iv.t + "</span></button>";
      }).join("") + "</div>";
    });
    var pv = $("#gh-tkpv"); if (!pv) return;
    var p = prof(TK().profile);
    pv.innerHTML = cardHTML(p, { s:p.s, w:p.w, o:p.o, an:p.an }, { tag:"div" }) +
      '<div class="gh-resp"><h4 class="gh-h4">Your response (' + d.sel.length + " of 3)</h4>" + (d.sel.length ? "<ol>" + d.sel.map(function(id){ return "<li><strong>(" + id + ")</strong> " + byId(TK().interventions, id).t + "</li>"; }).join("") + "</ol>" : '<p class="tiny muted">Tap interventions to add them.</p>') + "</div>";
  }
  return {
    render:function(inp, pv, a){
      api = a; a.S.sel = read().sel;
      inp.innerHTML = '<div id="gh-tkin"></div>';
      pv.innerHTML = '<div class="gh-tpv" id="gh-tkpv" aria-live="polite"></div>';
      $("#gh-tkin").addEventListener("click", function(e){
        var b = e.target.closest("[data-iv]"); if (!b) return;
        var s = a.S.sel = read().sel, id = b.dataset.iv, k = s.indexOf(id);
        if (k >= 0) s.splice(k, 1); else s.push(id);
        a.S.sel = s.sort(); a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(d){ return d.sel.length ? true : TK().validMsg; },
    checks:checks,
    key:keyOf,
    label:function(k){ return esc(text(k)); },
    text:text
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ detective:detective },
  task:task,
  onShow:function(v){ if (v === "causes" && part3.redraw) MV.wait(30, part3.redraw); }
});
})();
