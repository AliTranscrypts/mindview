// SBI4U 09 C3, C4 and CAM: hero (rubisco's dilemma → three strategies), Rubisco's dilemma simulator (rubiscoSim + S3 carbon
// bars + TC3 toggle grid; "Three strategies side by side" with S2 pathway steppers), "Which plant wins where?" (S7 data
// stations, climate board, enzyme zoom), "Photorespiration problems" (N4 numbers + chips), "A plant for its place" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small SVG helpers (from SBI4U 06 / 04) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "cc-t", "text-anchor":anchor || null }, s); }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!segs.length) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function arrowPath(pts, cls){
  var a = pts[pts.length - 2], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return sv("polyline", { points:pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":cls }) + sv("path", { d:head(b[0], b[1], (b[0] - a[0]) / L, (b[1] - a[1]) / L, 6), "class":cls + " cc-ah" });
}
function fade(k){ return k < 0.12 ? k / 0.12 : k > 0.85 ? (1 - k) / 0.15 : 1; }
function op(v){ return v >= 0.99 ? null : f1(clamp(v, 0, 1) * 100) / 100; }
// molecule token pills in the course role colours (carbon brown, O₂ blue, ATP orange)
var TOKC = { "CO₂":"--bio-carbon", "O₂":"--bio-o2", "ATP":"--bio-atp", "2 ATP":"--bio-atp", "4C acid":"--bio-carbon", "3C":"--bio-carbon", "malic acid":"--bio-carbon", "HCO₃⁻":"--bio-carbon", "sugar":"--bio-carbon" };
var TS = 1;   // token scale: 1.3 on narrow stages (phone), set before each repaint
function tok(lab, x, y, o, sc){
  var w = Math.max(22, lab.length * 6.3 + 10), s = (sc || 1) * TS;
  return '<g transform="translate(' + f1(x) + "," + f1(y) + ")" + (s !== 1 ? " scale(" + f1(s * 100) / 100 + ")" : "") + '"' + (op(o == null ? 1 : o) == null ? "" : ' opacity="' + op(o) + '"') + '><rect x="' + f1(-w / 2) + '" y="-8" width="' + f1(w) + '" height="16" rx="8" style="fill:var(' + (TOKC[lab] || "--ink") + ')"/><text y="3.8" text-anchor="middle" class="cc-tokt">' + lab + "</text></g>";
}
function cDot(x, y, r, o){ return sv("circle", { cx:x, cy:y, r:r || 4.2, "class":"cc-cdot", opacity:op(o == null ? 1 : o) }); }
function oDot(x, y, r, o){ return sv("circle", { cx:x, cy:y, r:r || 4.2, "class":"cc-odot", opacity:op(o == null ? 1 : o) }); }
function hexPath(x, y, r){ var d = ""; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; d += (i ? "L" : "M") + f1(x + r * Math.cos(a)) + " " + f1(y + r * Math.sin(a)); } return d + "Z"; }
function sugar(x, y, o){ return sv("path", { d:hexPath(x, y, 8), "class":"cc-sugar", opacity:op(o == null ? 1 : o) }); }
// enzyme blob with its active-site pocket on the left (pocket centre at x − 27·s): rubisco and PEP carboxylase
function enzSVG(x, y, s, cls){
  return '<g transform="translate(' + f1(x) + "," + f1(y) + ") scale(" + f1(s * 100) / 100 + ')"><path class="' + (cls || "cc-enz") + '" d="M-36 -12 C-36 -30 -14 -33 4 -31 C26 -29 40 -18 40 0 C40 20 24 31 2 31 C-18 31 -36 27 -36 12 L-21 8 C-15 4 -15 -4 -21 -8 Z"/></g>';
}
function wheelSVG(x, y, r, rot, cls){
  var h = sv("circle", { cx:x, cy:y, r:r, "class":"cc-wring" }), a0 = (rot || 0) * Math.PI / 180;
  for (var i = 0; i < 6; i++) { var a = a0 + i * Math.PI / 3; h += sv("line", { x1:x, y1:y, x2:x + r * Math.cos(a), y2:y + r * Math.sin(a), "class":"cc-wspoke" }); }
  return '<g class="' + (cls || "") + '">' + h + sv("circle", { cx:x, cy:y, r:Math.max(2.5, r * 0.18), "class":"cc-whub" }) + "</g>";
}
// guard-cell pair seen from the side of the leaf surface; ap = 0 (closed) … 1 (open)
function stomaSVG(x, y, ap, s){
  s = s || 1; var g = 6.5 * ap * s, rx = 8 * s, ry = 6 * s;
  return sv("ellipse", { cx:x - rx - g / 2 + 1, cy:y, rx:rx, ry:ry, "class":"cc-guard" }) + sv("ellipse", { cx:x + rx + g / 2 - 1, cy:y, rx:rx, ry:ry, "class":"cc-guard" });
}
function sunSVG(x, y, r){ var h = sv("circle", { cx:x, cy:y, r:r, "class":"cc-sun" }); for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; h += sv("line", { x1:x + (r + 2) * Math.cos(a), y1:y + (r + 2) * Math.sin(a), x2:x + (r + 5.5) * Math.cos(a), y2:y + (r + 5.5) * Math.sin(a), "class":"cc-ray" }); } return h; }
// crescent: the left half of a circle minus a half-ellipse
function moonSVG(x, y, r){ return sv("path", { d:"M" + f1(x) + " " + f1(y - r) + " A" + r + " " + r + " 0 1 0 " + f1(x) + " " + f1(y + r) + " A" + f1(r * 0.5) + " " + r + " 0 0 1 " + f1(x) + " " + f1(y - r) + " Z", "class":"cc-moon" }); }
// 24-hour dial: night (20 h → 6 h) shaded, hand at hour h, sun or moon in the middle
function dialSVG(x, y, r, h){
  var A = function(hr){ return (hr / 24) * 2 * Math.PI - Math.PI / 2; }, p = function(hr, rr){ return [x + rr * Math.cos(A(hr)), y + rr * Math.sin(A(hr))]; };
  var n0 = p(20, r), n1 = p(6, r), out = sv("circle", { cx:x, cy:y, r:r, "class":"cc-dial" });
  out += sv("path", { d:"M" + f1(x) + " " + f1(y) + " L" + f1(n0[0]) + " " + f1(n0[1]) + " A" + r + " " + r + " 0 0 1 " + f1(n1[0]) + " " + f1(n1[1]) + " Z", "class":"cc-night" });
  [0, 6, 12, 18].forEach(function(hr){ var a = p(hr, r - 1), b = p(hr, r - 5); out += sv("line", { x1:a[0], y1:a[1], x2:b[0], y2:b[1], "class":"cc-tick" }); });
  var day = h >= 6 && h < 20, e = p(h, r - 4);
  out += sv("line", { x1:x, y1:y, x2:e[0], y2:e[1], "class":"cc-hand" }) + sv("circle", { cx:x, cy:y, r:2.4, "class":"cc-whub" });
  return out + (day ? sunSVG(x + r + 11, y - r + 7, 4.5) : moonSVG(x + r + 11, y - r + 7, 6));
}

// ---------- @component radioGroup (copied from SBI4U 06 / 03 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list)}
function radios(host, o){
  var val = o.value == null ? null : String(o.value);
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
  return { set:function(id){ var v = id == null ? null : String(id); if (v !== val) { val = v; paint(); } }, get:function(){ return val; }, setOptions:function(list){ o.options = list; paint(); } };
}

// ---------- Rubisco's dilemma model (plan: model rules, exact and deterministic) ----------
var TEMPS = [10, 20, 30, 40], STS = ["open", "partly", "closed"];
var STN = { open:"Open", partly:"Partly closed", closed:"Closed" }, STL = { open:"open", partly:"partly closed", closed:"closed" };
var OT = { open:[1, 2, 3, 4], partly:[2, 3, 4, 5], closed:[4, 5, 6, 7] }, WATER = { open:3, partly:2, closed:1 }, WL = { 1:"low", 2:"medium", 3:"high" };
var PATHN = { c3:"C3", c4:"C4", cam:"CAM" }, AP = { open:1, partly:0.5, closed:0 };
function camPH(h){ var t = ((h - 20) % 24 + 24) % 24; return t <= 10 ? 6 - 0.2 * t : t <= 20 ? 4 + 0.2 * (t - 10) : 6; }
function camOpen(h){ h = ((h % 24) + 24) % 24; return h >= 20 || h < 6; }
function camRun(h){ h = ((h % 24) + 24) % 24; return h >= 6 && h < 16; }
function c3o(st, T){ return OT[st][TEMPS.indexOf(T)]; }
function model(path, st, T, clock){
  var m = { path:path, st:st, T:T };
  if (path === "c3") { var o = c3o(st, T); m.o = o; m.fixed = 10 - o; m.lost = o / 2; m.net = 10 - 1.5 * o; m.atp = 30 + 2 * o; m.per = m.net > 0 ? m.atp / m.net : null; m.water = WATER[st]; m.mix = o; }
  else if (path === "c4") { m.o = 0; m.fixed = 10; m.lost = 0; m.net = 10; m.atp = 50; m.per = 5; m.water = WATER[st]; m.mix = c3o(st, T); }
  else {
    var h = ((clock % 24) + 24) % 24;
    m.o = 0; m.water = 1; m.clock = h; m.open = camOpen(h); m.ph = Math.round(camPH(h) * 10) / 10; m.run = camRun(h);
    m.fixed = m.run ? 10 : 0; m.lost = 0; m.net = m.run ? 10 : 0; m.atp = null; m.per = null; m.mix = m.open ? 2 : 6; m.st = m.open ? "open" : "closed";
  }
  return m;
}
function num(v){ return MV.num(v, 1); }
function perText(m){ return m.path === "cam" ? "not priced in the model" : m.per == null ? "no net gain" : m.per.toFixed(1); }
function waterText(w){ return w + " (" + WL[w] + ")"; }
function clockText(h){ return h + " h" + (h === 20 ? " (dusk)" : h === 6 ? " (dawn)" : h === 0 ? " (midnight)" : h === 12 ? " (noon)" : ""); }
function camRow(m){ return m.clock + " h · stomata " + (m.open ? "open" : "closed") + " · pH " + m.ph.toFixed(1) + " · Calvin cycle " + (m.run ? "running" : "idle"); }
function ariaOf(m){
  if (m.path === "cam") return "CAM at " + m.clock + " h. Stomata " + (m.open ? "open" : "closed") + ", vacuole pH " + m.ph.toFixed(1) + ", Calvin cycle " + (m.run ? "running: 10 of 10 rubisco reactions use CO₂ released from malic acid." : "idle" + (m.open ? ": CO₂ is being stored as malic acid." : "."));
  return PATHN[m.path] + " at " + m.T + " degrees, stomata " + STL[m.st] + ". " + m.o + " of 10 rubisco reactions use oxygen. Net carbon gained: " + num(m.net) + " per 10.";
}

// ---------- @component rubiscoSim — rubisco in a leaf cell (viewBox 520 × 300): an air space with the O₂ : CO₂ mix and a stoma,
// a thermometer, rubisco with a left-facing active site, a Calvin wheel and a sugar conveyor; C4 adds a Kranz ring of
// bundle-sheath cells and PEP carboxylase; CAM adds a vacuole of malic acid, a sun/moon dial and a pH gauge. Molecules arrive
// 10 per cycle (o of them O₂, spread evenly); an O₂ hit shows a "✗ carbon lost" badge, a CO₂ puff and an ATP spent.
// Stateless in time: flowSVG(m, t) draws the moving layer for time t (s); stillSVG(m) is the reduced-motion frame. ----------
var VW = 520, VH = 300, CELL = [104, 52, 362, 240], RUB = [292, 158], SITE = [RUB[0] - 27, RUB[1]], WHEEL = [354, 158], PEP = [160, 164], PSITE = [PEP[0] - 27 * 0.55, PEP[1]];
var KR = { cx:316, cy:168, r:100 }, VAC = [120, 222, 150, 62], STOMA = [52, 282];
var P = 0.5, CYC = 10 * P, TRAV = 1.9;
var SLOTS = (function(){ var r = MV.bio.rng("cc-air"), out = []; for (var i = 0; i < 10; i++) out.push([lerp(22, 82, r()), 96 + i * 16.5 + r.range(-3, 3)]); return out; })();
var CONV = [[WHEEL[0], WHEEL[1] + 22], [WHEEL[0], 236], [442, 236], [442, 270]];
var RING = (function(){ var out = []; for (var i = 0; i < 14; i++) { var a = i / 14 * Math.PI * 2 + 0.11; out.push([KR.cx + KR.r * Math.cos(a), KR.cy + KR.r * 0.78 * Math.sin(a)]); } return out; })();
var RINGIN = (function(){ var r = MV.bio.rng("cc-ring"), out = [], n = 0; while (out.length < 12 && n++ < 3000) { var x = r.range(KR.cx - 78, KR.cx + 78), y = r.range(KR.cy - 58, KR.cy + 58); if (Math.pow((x - KR.cx) / 76, 2) + Math.pow((y - KR.cy) / 58, 2) > 1) continue; if (Math.hypot(x - RUB[0], y - RUB[1]) < 42 || Math.hypot(x - WHEEL[0], y - WHEEL[1]) < 28) continue; if (out.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < 13; })) continue; out.push([x, y]); } return out; })();
var VACD = (function(){ var r = MV.bio.rng("cc-vac"), out = [], n = 0; while (out.length < 14 && n++ < 3000) { var x = r.range(VAC[0] + 14, VAC[0] + VAC[2] - 14), y = r.range(VAC[1] + 22, VAC[1] + VAC[3] - 10); if (out.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < 12; })) continue; out.push([x, y]); } return out; })();
function isO(i, o){ return Math.floor((i + 1) * o / 10) > Math.floor(i * o / 10); }
function pathIn(i){ var s = SLOTS[i % 10]; return [s, [98, s[1] * 0.4 + SITE[1] * 0.6], [150, SITE[1] + (i % 3 - 1) * 6], SITE]; }
// static layer; d = display values {T, ap, ring 0..1, clock, idle}
function sceneSVG(m, d){
  var h = "", i;
  // air space (left strip) with the gas mix, stoma at the bottom
  h += sv("rect", { x:8, y:CELL[1], width:88, height:CELL[3], rx:10, "class":"cc-air" }) + txt(52, CELL[1] + 16, "air space", "cc-ts", "middle");
  var mix = Math.round(d.mix == null ? m.mix : d.mix);
  SLOTS.forEach(function(s, k){ h += isO(k, mix) ? oDot(s[0], s[1], 4.4, 0.55) : cDot(s[0], s[1], 4.4, 0.55); });
  h += txt(52, CELL[1] + 30, "O₂ : CO₂ " + mix + " : " + (10 - mix), "cc-ts", "middle");
  h += sv("rect", { x:8, y:STOMA[1] - 6, width:88, height:12, "class":"cc-epi" }) + stomaSVG(STOMA[0], STOMA[1], d.ap);
  h += txt(52, VH - 2, d.ap > 0.75 ? "stomata open" : d.ap > 0.25 ? "partly closed" : "stomata closed", "cc-ts", "middle");
  // cell, chloroplast
  h += sv("rect", { x:CELL[0], y:CELL[1], width:CELL[2], height:CELL[3], rx:22, "class":"cc-cell" });
  h += txt(CELL[0] + 12, CELL[1] + 18, m.path === "c4" ? "mesophyll cell" : "mesophyll cell (chloroplast)", "cc-ts");
  if (m.path !== "c4") h += sv("ellipse", { cx:318, cy:166, rx:126, ry:84, "class":"cc-chl" });
  // C4: Kranz ring of bundle-sheath cells around rubisco, concentrated CO₂ inside, PEP carboxylase outside
  if (m.path === "c4" && d.ring > 0.01) {
    var g = "";
    RING.forEach(function(p){ g += sv("circle", { cx:p[0], cy:p[1], r:15, "class":"cc-bs" }) + sv("circle", { cx:p[0] - 4, cy:p[1] - 3, r:2.6, "class":"cc-chlo" }) + sv("circle", { cx:p[0] + 4, cy:p[1] + 3, r:2.6, "class":"cc-chlo" }); });
    g += txt(KR.cx, KR.cy - KR.r * 0.78 - 20, "bundle-sheath cells (Kranz ring)", "cc-ts cc-halo", "middle");
    var nIn = Math.round(d.ring * RINGIN.length);
    g += RINGIN.slice(0, nIn).map(function(p){ return cDot(p[0], p[1], 4); }).join("");
    h += '<g opacity="' + (op(d.ring) == null ? 1 : op(d.ring)) + '">' + g + "</g>";
  }
  if (m.path !== "c3") h += enzSVG(PEP[0], PEP[1], 0.55, "cc-enz cc-pep") + txt(PEP[0], PEP[1] + 30, "PEP carboxylase", "cc-ts cc-halo", "middle");
  // CAM: vacuole with malic acid, pH gauge, sun/moon dial
  if (m.path === "cam") {
    var ph = camPH(d.clock), nd = clamp(Math.round((6 - ph) / 2 * VACD.length), 0, VACD.length);
    h += sv("rect", { x:VAC[0], y:VAC[1], width:VAC[2], height:VAC[3], rx:20, "class":"cc-vac" }) + txt(VAC[0] + 10, VAC[1] + 14, "vacuole: malic acid", "cc-ts");
    h += VACD.slice(0, nd).map(function(p){ return cDot(p[0], p[1], 4); }).join("");
    // pH gauge (pH 6 at the top, 4 at the bottom), ink ticks
    var gx = 486, gy0 = 92, gy1 = 262, yOf = function(v){ return lerp(gy0, gy1, (6 - v) / 2); };
    h += sv("rect", { x:gx - 7, y:gy0 - 6, width:14, height:gy1 - gy0 + 12, rx:7, "class":"cc-gauge" });
    h += sv("rect", { x:gx - 5, y:yOf(ph), width:10, height:Math.max(0, gy1 + 4 - yOf(ph)), rx:5, "class":"cc-gfill" });
    [6, 5, 4].forEach(function(v){ h += sv("line", { x1:gx - 11, y1:yOf(v), x2:gx - 7, y2:yOf(v), "class":"cc-gtick" }) + txt(gx - 13, yOf(v) + 4, String(v), "cc-ts", "end"); });
    h += sv("path", { d:"M" + (gx + 9) + " " + f1(yOf(ph)) + " l8 -5 v10 Z", "class":"cc-gmark" }) + txt(gx, gy0 - 12, "pH", "cc-ts", "middle") + txt(gx, gy1 + 24, ph.toFixed(1), "cc-tb", "middle");
    h += dialSVG(470, 30, 19, Math.round(((d.clock % 24) + 24) % 24 * 10) / 10) + txt(440, 34, Math.floor(((d.clock % 24) + 24) % 24) + " h", "cc-tb", "end");
  } else {
    // thermometer (horizontal) at the top
    var tx0 = 300, tx1 = 460, tf = clamp((d.T - 5) / 40, 0, 1);
    h += sv("rect", { x:tx0, y:14, width:tx1 - tx0, height:10, rx:5, "class":"cc-gauge" }) + sv("rect", { x:tx0, y:14, width:f1((tx1 - tx0) * tf), height:10, rx:5, "class":"cc-tfill" }) + sv("circle", { cx:tx0 - 4, cy:19, r:8, "class":"cc-tbulb" });
    TEMPS.forEach(function(v){ var x = lerp(tx0, tx1, (v - 5) / 40); h += sv("line", { x1:x, y1:26, x2:x, y2:31, "class":"cc-gtick" }) + txt(x, 42, v + "°", "cc-ts", "middle"); });
    h += txt(tx0 - 16, 23, "leaf " + Math.round(d.T) + " °C", "cc-tb", "end");
  }
  // rubisco + Calvin wheel (+ idle label for CAM at night)
  h += enzSVG(RUB[0], RUB[1], 1, "cc-enz" + (d.idle ? " cc-idle" : "")) + txt(RUB[0] + 2, RUB[1] + 4, "rubisco", "cc-tb", "middle");
  if (d.idle) h += txt(RUB[0] + 2, RUB[1] + 18, "(idle)", "cc-ts", "middle");
  else h += txt(RUB[0] + 46, RUB[1] + 60, "of every 10: " + (10 - m.o) + " CO₂ · " + m.o + " O₂", "cc-tb cc-halo", "end");
  h += txt(WHEEL[0] + 26, WHEEL[1] - 26, "Calvin cycle", "cc-ts cc-halo", "start");
  h += arrowPath(CONV.slice(1), "cc-conv") + txt(CONV[3][0] - 6, CONV[3][1] + 4, "sugar", "cc-ts", "end");
  void i;
  return h;
}
// moving layer at time t (s)
function flowSVG(m, t, d){
  var h = "", o = m.o, fixedNow = 0, rot = 0;
  var c4 = m.path === "c4", cam = m.path === "cam", run = !cam || m.run, store = cam && m.open && !m.run;
  // stoma exchange arrows (open / partly: CO₂ in, O₂ out)
  if (d.ap > 0.2) {
    var k1 = ((t * 0.6) % 1), k2 = (((t + 0.8) * 0.6) % 1);
    h += tok("CO₂", STOMA[0] - 14, lerp(VH + 6, STOMA[1] - 30, k1), fade(k1) * d.ap, 0.8) + tok("O₂", STOMA[0] + 16, lerp(STOMA[1] - 30, VH + 6, k2), fade(k2) * d.ap, 0.8);
  }
  var n0 = Math.floor((t - TRAV - 2.4) / P), n1 = Math.floor(t / P), n, age, i, p;
  if (run) {
    for (n = n0; n <= n1; n++) {
      if (n < 0 && t > 0) continue;
      age = t - n * P; i = ((n % 10) + 10) % 10;
      var ox = isO(i, o);
      if (age < 0) continue;
      if (age < TRAV) {
        var k = age / TRAV;
        if (cam) { // malic acid leaves the vacuole and releases CO₂ to rubisco
          var src = VACD[i % VACD.length], q = polyAt([src, [src[0] + 30, VAC[1] - 18], [232, 186], SITE], k);
          h += k < 0.45 ? tok("4C acid", q[0], q[1], Math.min(1, k * 6), 0.92) : tok("CO₂", q[0], q[1], 1, 1);
        } else if (c4) { // CO₂ → PEP carboxylase → 4C acid → into the ring → CO₂ at rubisco
          var s = SLOTS[i];
          if (k < 0.34) { q = polyAt([s, [98, s[1] * 0.5 + PSITE[1] * 0.5], PSITE], k / 0.34); h += tok("CO₂", q[0], q[1], Math.min(1, k * 8), 1); }
          else if (k < 0.78) { q = polyAt([[PEP[0], PEP[1] - 26], [205, 140], [236, 148]], (k - 0.34) / 0.44); h += tok("4C acid", q[0], q[1], 1, 0.92); if (k < 0.5) h += tok("ATP", PEP[0] - 10, PEP[1] - 40 - (k - 0.34) * 60, 1 - (k - 0.34) / 0.16, 0.8); }
          else { q = polyAt([[236, 148], SITE], (k - 0.78) / 0.22); h += tok("CO₂", q[0], q[1], 1, 1); }
        } else {
          q = polyAt(pathIn(i), k);
          h += ox ? tok("O₂", q[0], q[1], Math.min(1, k * 8), 1) : tok("CO₂", q[0], q[1], Math.min(1, k * 8), 1);
        }
      } else {
        var a = age - TRAV;
        if (ox && !c4 && !cam) {
          // photorespiration: badge, a CO₂ puff escaping, an ATP spent
          if (a < 1.3) { h += txt(SITE[0] - 34, SITE[1] - 46, "✗ carbon lost", "cc-badge cc-halo", "middle"); }
          if (a < 2.2) { var pk = a / 2.2; q = polyAt([SITE, [210, 110], [120, 96], [70, 70]], pk); h += tok("CO₂", q[0], q[1], 1 - Math.max(0, (pk - 0.7) / 0.3), 0.8); }
          if (a < 1.4) { var ak = a / 1.4; h += tok("ATP", SITE[0] + 30, SITE[1] - 44 - ak * 16, 1 - ak, 1 - ak * 0.4); }
        } else if (!ox || c4 || cam) {
          if (a < 0.6) { q = polyAt([SITE, [WHEEL[0] - 20, WHEEL[1]], [WHEEL[0], WHEEL[1] + 22]], a / 0.6); h += cDot(q[0], q[1]); }
          else if (a < CYC + 0.6) { q = polyAt(CONV, (a - 0.6) / CYC); h += cDot(q[0], q[1], 4.2, a > CYC + 0.3 ? (CYC + 0.6 - a) / 0.3 : 1); fixedNow++; }
        }
      }
    }
    rot = t * 60 * (m.fixed / 10);
  } else if (store) {
    // night: CO₂ through the open stoma → PEP carboxylase → malic acid into the vacuole
    for (n = n0; n <= n1; n++) {
      age = t - n * P; i = ((n % 10) + 10) % 10; if (age < 0 || age > TRAV + 0.2) continue;
      var kk = age / TRAV, s2 = SLOTS[i];
      if (kk < 0.45) { q = polyAt([s2, [104, s2[1] * 0.5 + PSITE[1] * 0.5], PSITE], kk / 0.45); h += tok("CO₂", q[0], q[1], Math.min(1, kk * 8), 1); }
      else { var dst = VACD[i % VACD.length]; q = polyAt([[PEP[0], PEP[1] + 20], [PEP[0] + 20, VAC[1] - 6], dst], (kk - 0.45) / 0.55); h += tok("4C acid", q[0], q[1], kk > 0.95 ? (1 - kk) / 0.05 + 0.2 : 1, 0.92); }
    }
  }
  h += wheelSVG(WHEEL[0], WHEEL[1], 20, rot);
  void fixedNow;
  return h;
}
// reduced-motion still: a queue of the 10 molecules, the sugar chain, puffs and ATP for each O₂ event
function stillSVG(m){
  var h = "", o = m.o, i, q;
  var c4 = m.path === "c4", cam = m.path === "cam";
  if (cam && !m.run) {
    if (m.open) { h += arrowPath([[60, 150], [104, 160], [PSITE[0] - 4, PSITE[1]]], "cc-cpath") + arrowPath([[PEP[0], PEP[1] + 20], [PEP[0] + 20, VAC[1] + 10]], "cc-cpath") + tok("CO₂", 78, 150, 1, 1) + tok("4C acid", PEP[0] + 40, VAC[1] - 8, 1, 0.92); }
    return h + wheelSVG(WHEEL[0], WHEEL[1], 20, 0);
  }
  if (cam) { h += arrowPath([[VAC[0] + 70, VAC[1] + 6], [232, 186], [SITE[0] - 6, SITE[1] + 4]], "cc-cpath") + tok("4C acid", VAC[0] + 76, VAC[1] - 8, 1, 0.92) + tok("CO₂", 236, 176, 1, 1); }
  else if (c4) {
    h += arrowPath([[60, 140], [98, 150], [PSITE[0] - 4, PSITE[1]]], "cc-cpath") + arrowPath([[PEP[0], PEP[1] - 26], [205, 140], [SITE[0] - 6, SITE[1]]], "cc-cpath");
    h += tok("CO₂", 80, 140, 1, 1) + tok("4C acid", 206, 132, 1, 0.92) + tok("2 ATP", PEP[0] - 6, PEP[1] - 40, 1, 0.8);
    h += arrowPath([[52, 100], [150, 104], [190, 108]], "cc-opath") + oDot(52, 100) + txt(196, 112, "O₂ turned away", "cc-ts cc-halo");
  } else {
    for (i = 0; i < 10; i++) { q = polyAt(pathIn(i), 0.08 + i * 0.085); h += isO(i, o) ? tok("O₂", q[0], q[1], 1, 0.75) : tok("CO₂", q[0], q[1], 1, 0.75); }
    if (o) {
      h += txt(SITE[0] - 34, SITE[1] - 46, "✗ carbon lost × " + o, "cc-badge cc-halo", "middle");
      for (i = 0; i < o; i++) { h += tok("CO₂", 150 + (i % 4) * 30, 98 - Math.floor(i / 4) * 18, 0.85, 0.7); h += tok("ATP", SITE[0] + 34 + (i % 4) * 28, SITE[1] - 48 - Math.floor(i / 4) * 16, 0.85, 0.7); }
      h += arrowPath([[SITE[0] - 8, SITE[1] - 14], [180, 108]], "cc-cpath");
    }
  }
  var nf = m.fixed;
  for (i = 0; i < nf; i++) { q = polyAt(CONV, 0.05 + i * 0.09); h += cDot(q[0], q[1]); }
  return h + wheelSVG(WHEEL[0], WHEEL[1], 20, 0);
}
var LEGEND = '<span><span class="cc-lg-t" style="--c:var(--bio-carbon)">CO₂</span> carbon (brown dots)</span><span><span class="cc-lg-t" style="--c:var(--bio-o2)">O₂</span></span><span><span class="cc-lg-t" style="--c:var(--bio-atp)">ATP</span> spent</span><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" class="cc-cdot"/></svg>fixed carbon</span>';

// ---------- @component S3 carbonBars — carbon fixed / lost / net per 10 rubisco reactions (scale −1 … 10, zero line) ----------
function barsHTML(list, k){
  var lo = -1, hi = 10, span = hi - lo, z = -lo / span * 100;
  function bar(cls, v){ var w = Math.abs(v) / span * 100, l = v >= 0 ? z : z - w; return '<span class="cc-bt"><i class="' + cls + '" style="left:' + f1(l) + "%;width:" + f1(w) + '%"></i><b class="cc-zero" style="left:' + f1(z) + '%"></b></span>'; }
  return '<div class="cc-bars" role="group" aria-label="Carbon per 10 rubisco reactions">' + list.map(function(it){
    var m = it.m, a = it.from || m, f = function(key){ return lerp(a[key], m[key], k == null ? 1 : k); };
    return '<div class="cc-bg">' + (list.length > 1 || it.title ? '<p class="cc-bgh">' + (it.title || PATHN[m.path]) + "</p>" : "") +
      '<div class="cc-br"><span class="cc-bl">Carbon fixed</span>' + bar("cc-b-fix", f("fixed")) + "<b>" + num(m.fixed) + "</b></div>" +
      '<div class="cc-br"><span class="cc-bl">Carbon lost</span>' + bar("cc-b-lost", f("lost")) + "<b>" + num(m.lost) + "</b></div>" +
      '<div class="cc-br"><span class="cc-bl">Net gain</span>' + bar("cc-b-net", f("net")) + "<b>" + num(m.net) + "</b></div></div>";
  }).join("") + '<p class="tiny muted cc-bnote">Per 10 rubisco reactions. Hatched: carbon lost to photorespiration.</p></div>';
}

// ---------- S2 pathway steppers for "Three strategies side by side" (viewBox 300 × 210 per pathway) ----------
var SD = {
  c3:{ stoma:62, steps:[
    { path:[[62, 210], [62, 186], [70, 160], [80, 132]], tok:"CO₂", sun:true },
    { path:[[80, 132], [80, 108], [79, 94]], tok:"CO₂", sun:true, o2:true },
    { path:[[150, 92], [186, 100], [188, 150]], tok:"sugar", sun:true }] },
  c4:{ stoma:56, steps:[
    { path:[[56, 210], [56, 186], [52, 160], [48, 132]], tok:"CO₂", sun:true },
    { path:[[48, 132], [52, 112], [64, 82]], tok:"4C acid", sun:true },
    { path:[[64, 82], [108, 92], [150, 100]], tok:"4C acid", sun:true },
    { path:[[150, 116], [110, 134], [74, 142]], tok:"3C", sun:true, release:true },
    { path:[[176, 104], [212, 104]], tok:"sugar", sun:true, release:true }] },
  cam:{ stoma:150, steps:[
    { path:[[150, 210], [150, 186], [158, 160], [166, 140]], tok:"CO₂", night:true },
    { path:[[166, 122], [124, 116], [86, 108]], tok:"malic acid", night:true, fill:true },
    { path:[[86, 108], [124, 98], [146, 96]], tok:"CO₂", fill:true, closed:true },
    { path:[[146, 96], [156, 74], [188, 78], [206, 116]], tok:"sugar", closed:true }] }
};
function epiSVG(x0, open){ return sv("rect", { x:0, y:182, width:x0 - 14, height:12, "class":"cc-epi" }) + sv("rect", { x:x0 + 14, y:182, width:300 - x0 - 14, height:12, "class":"cc-epi" }) + stomaSVG(x0, 188, open ? 1 : 0, 1) + txt(150, 207, "outside air", "cc-ts", "middle"); }
function stratBase(id, st){
  var h = "", D = SD[id], s = D.steps[st] || {};
  if (id === "c3") {
    h += sv("rect", { x:16, y:22, width:190, height:150, rx:16, "class":"cc-cell" }) + txt(24, 38, "mesophyll cell", "cc-ts");
    h += sv("ellipse", { cx:120, cy:92, rx:76, ry:40, "class":"cc-chl" }) + enzSVG(92, 92, 0.45) + txt(90, 122, "rubisco", "cc-ts", "middle") + wheelSVG(150, 92, 14, 0) + txt(152, 70, "Calvin cycle", "cc-ts", "middle");
    for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2; h += sv("circle", { cx:256 + 36 * Math.cos(a), cy:100 + 36 * Math.sin(a), r:9, "class":"cc-bs0" }); }
    h += sv("circle", { cx:256, cy:100, r:24, "class":"cc-vein" }) + txt(256, 104, "vein", "cc-ts", "middle");
    h += sunSVG(276, 18, 6);
  } else if (id === "c4") {
    h += sv("rect", { x:10, y:34, width:108, height:140, rx:14, "class":"cc-cell" }) + txt(16, 50, "mesophyll", "cc-ts");
    h += enzSVG(70, 104, 0.42, "cc-enz cc-pep") + txt(64, 134, "PEP", "cc-ts", "middle") + txt(64, 146, "carboxylase", "cc-ts", "middle");
    for (var j = 0; j < 10; j++) { var b = j / 10 * Math.PI * 2 + Math.PI; var x = 212 + 52 * Math.cos(b), y = 104 + 52 * Math.sin(b); h += sv("circle", { cx:x, cy:y, r:j === 0 ? 22 : 17, "class":"cc-bs" + (j === 0 ? " cc-bs-on" : "") }) + (j ? sv("circle", { cx:x - 4, cy:y - 3, r:2.6, "class":"cc-chlo" }) + sv("circle", { cx:x + 4, cy:y + 4, r:2.6, "class":"cc-chlo" }) : ""); }
    h += enzSVG(164, 104, 0.3) + wheelSVG(170, 120, 7, 0);
    h += sv("circle", { cx:212, cy:104, r:26, "class":"cc-vein" }) + txt(212, 108, "vein", "cc-ts", "middle") + txt(212, 176, "bundle-sheath cells (Kranz)", "cc-ts", "middle");
    if (s.release) { [[150, 92], [176, 90], [180, 116], [152, 120]].forEach(function(p){ h += cDot(p[0], p[1], 3.6); }); h += tok("2 ATP", 40, 162, 1, 0.8); }
    h += sunSVG(284, 16, 6);
  } else {
    h += sv("rect", { x:14, y:22, width:206, height:152, rx:16, "class":"cc-cell" }) + txt(22, 38, "mesophyll cell", "cc-ts");
    h += sv("rect", { x:26, y:50, width:100, height:112, rx:20, "class":"cc-vac" }) + txt(76, 66, "vacuole", "cc-ts", "middle");
    var nd = s.fill ? 8 : 0; for (var k = 0; k < nd; k++) h += cDot(46 + (k % 4) * 20, 96 + Math.floor(k / 4) * 22, 3.8);
    h += txt(76, 154, "pH " + (s.fill ? (st === 1 ? "6.0 → 4.0" : "4.0 → 6.0") : "6.0"), "cc-ts", "middle");
    h += sv("ellipse", { cx:176, cy:76, rx:38, ry:24, "class":"cc-chl" }) + enzSVG(164, 76, 0.36, "cc-enz" + (s.night ? " cc-idle" : "")) + wheelSVG(194, 76, 9, 0);
    h += enzSVG(178, 132, 0.36, "cc-enz cc-pep") + txt(178, 154, "PEP carboxylase", "cc-ts", "middle");
    var hr = s.night ? 0 : 12; h += dialSVG(252, 62, 24, hr) + txt(252, 106, s.night ? "night" : "day", "cc-tb", "middle");
  }
  h += epiSVG(D.stoma, !(s.closed));
  if (s.closed) h += txt(D.stoma, 178, "closed", "cc-ts cc-halo", "middle");
  return h;
}
function stratHi(id, st, k){
  var s = SD[id].steps[st], h = arrowPath(s.path, "cc-spath");
  if (s.o2) h += oDot(40, 64, 5) + txt(30, 56, "O₂", "cc-tb") + arrowPath([[44, 66], [70, 84]], "cc-opath") + txt(26, 80, "competes", "cc-ts");
  var p = polyAt(s.path, k == null ? 1 : k);
  h += s.tok === "sugar" ? sugar(p[0], p[1]) : tok(s.tok, p[0], p[1], 1, 1);
  return h;
}

// ---------- Explore: Rubisco's dilemma ----------
var EXR = null;
function explore(host, api){
  var C = api.content, S = api.S, SG = C.strategies;
  var D0 = { mode:"dil", path:"c3", st:"open", T:20, clock:20, cmp:false, grid:{}, str:{ c3:0, c4:0, cam:0 }, seen:{} };
  Object.keys(D0).forEach(function(k){ if (S[k] === undefined) S[k] = JSON.parse(JSON.stringify(D0[k])); });
  var cur = function(){ return model(S.path, S.st, S.T, S.clock); };
  var disp = { T:S.T, ap:S.path === "cam" ? (camOpen(S.clock) ? 1 : 0) : AP[S.st], ring:S.path === "c4" ? 1 : 0, clock:S.clock, mix:null };
  var anim = null, pend = null, raf = null, lastDraw = 0, what = "", barFrom = null, barK = 1, readSig = "";
  host.innerHTML = '<div class="cc-top" id="cc-mode"></div>' +
    '<div class="pg cc-pg" id="cc-dil"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="cc-stage"><svg id="cc-svg" viewBox="0 0 ' + VW + " " + VH + '" role="img" focusable="false"><g id="cc-gs"></g><g id="cc-gf"></g></svg></div>' +
      '<p class="cc-legend tiny">' + LEGEND + '</p><p class="cc-cap" id="cc-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="cc-path"></div><div id="cc-temp"></div><div id="cc-sto"></div><div id="cc-clock"></div><div id="cc-cmp"></div></div>' +
    '<div class="pg-read"><div id="cc-read" aria-live="polite"></div><div id="cc-bars"></div><div class="cc-grid" id="cc-grid"></div>' +
      '<p class="tiny muted cc-note"><span class="bio-model">Model</span> ' + C.modelNote + '</p><p class="cc-aha" id="cc-aha" hidden><strong>The big idea:</strong> ' + C.aha + "</p></div></div>" +
    '<div class="cc-strat" id="cc-str" hidden><p>' + SG.intro + '</p><div class="cc-panels">' + ["c3", "c4", "cam"].map(function(id){
      var G = SG[id];
      return '<section class="cc-pan" data-sg="' + id + '" aria-labelledby="cc-h-' + id + '"><h3 id="cc-h-' + id + '">' + G.name + ' <span class="cc-sub">' + G.sub + '</span></h3><p class="tiny muted cc-plants">' + G.plants + "</p>" +
        '<div class="cc-sstage"><svg viewBox="0 0 300 214" role="img" focusable="false" id="cc-ss-' + id + '"><g class="cc-sb"></g><g class="cc-sh"></g></svg></div>' +
        '<ol class="cc-steps">' + G.steps.map(function(s, i){ return '<li><button type="button" class="cc-stepb" data-st="' + i + '" data-k="ccst' + id + i + '" aria-pressed="false"><span class="cc-sn">' + (i + 1) + "</span><span>" + s.t + "</span></button></li>"; }).join("") + "</ol>" +
        '<div class="cc-pl" id="cc-pl-' + id + '"></div><p class="cc-scap" id="cc-sc-' + id + '" aria-live="polite"></p><p class="cc-carbon tiny" id="cc-cc-' + id + '"></p></section>';
    }).join("") + "</div></div>";
  var svg = $("#cc-svg"), gS = $("#cc-gs"), gF = $("#cc-gf");
  var modeR = radios($("#cc-mode"), { label:"Mode", options:[{ id:"dil", t:"Rubisco’s dilemma" }, { id:"str", t:"Three strategies side by side" }], value:S.mode, onChange:function(v){ stop(); S.mode = v; api.save(); paint(); MV.changed(); } });
  var pathR = radios($("#cc-path"), { label:"Pathway", options:[{ id:"c3", t:"C3" }, { id:"c4", t:"C4" }, { id:"cam", t:"CAM" }], value:S.path, onChange:function(v){ change({ path:v }, "Pathway: " + PATHN[v]); } });
  var tempR = radios($("#cc-temp"), { label:"Leaf temperature", options:TEMPS.map(function(t){ return { id:t, t:t + " °C" }; }), value:S.T, onChange:function(v){ change({ T:+v }, "Leaf temperature: " + v + " °C"); } });
  var stoR = radios($("#cc-sto"), { label:"Stomata", options:stoOpts(), value:S.st, onChange:function(v){ change({ st:v }, "Stomata: " + STL[v]); } });
  function stoOpts(){ return STS.map(function(s){ return { id:s, t:STN[s], dis:S.path === "cam" }; }); }
  // CAM clock scrubber (step 2 h; arrow keys step it)
  $("#cc-clock").innerHTML = '<label class="slider cc-sl"><span class="slider-top"><span>CAM clock (24 h)</span><output id="cc-clk-out" for="cc-clk"></output></span><input type="range" id="cc-clk" min="0" max="22" step="2" value="' + S.clock + '"></label>';
  var clk = $("#cc-clk"), clkOut = $("#cc-clk-out");
  function clkShow(v){ clkOut.textContent = clockText(v); var m = model("cam", "open", 20, v); clk.setAttribute("aria-valuetext", clockText(v) + ": stomata " + (m.open ? "open" : "closed") + ", vacuole pH " + m.ph.toFixed(1)); }
  clk.addEventListener("input", function(){ var v = +clk.value; clkShow(v); change({ clock:v }, "Clock: " + clockText(v)); });
  // compare switch
  var cmpBox = $("#cc-cmp");
  function paintCmp(){
    var dis = S.path === "cam", on = S.cmp && !dis;
    MV.keepFocus(cmpBox, function(){ cmpBox.innerHTML = '<button type="button" class="cc-swb" role="switch" aria-checked="' + on + '" data-k="cccmp"' + (dis ? " disabled" : "") + '><span class="cc-swk" aria-hidden="true"></span><span>Compare C3 and C4</span><span class="cc-swst" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>" + (dis ? '<span class="tiny muted"> Choose C3 or C4 to compare.</span>' : ""); });
  }
  cmpBox.addEventListener("click", function(e){ var b = e.target.closest(".cc-swb"); if (!b || b.disabled) return; S.cmp = !S.cmp; what = S.cmp ? "Compare on: C3 and C4 readouts side by side, at the same temperature and stomata." : "Compare off."; api.save(); paint(); MV.changed(); });
  // TC3 grid: 3 rows (stomata) × 4 columns (temperature) of toggle buttons
  var gridBox = $("#cc-grid");
  function paintGrid(){
    MV.keepFocus(gridBox, function(){
      gridBox.innerHTML = '<p class="cc-gh"><strong>Challenge 3 grid.</strong> Mark each cell where a C4 leaf spends fewer ATP per carbon gained than a C3 leaf.</p><div class="tbl-wrap"><table class="cc-gt"><caption class="vh">Temperature and stomata cells to mark</caption><thead><tr><th scope="col"><span class="vh">Stomata</span></th>' + TEMPS.map(function(t){ return '<th scope="col">' + t + " °C</th>"; }).join("") + "</tr></thead><tbody>" +
        STS.map(function(s){ return '<tr><th scope="row">' + STN[s] + "</th>" + TEMPS.map(function(t){ var k = s + "-" + t, on = !!S.grid[k], here = S.mode === "dil" && S.path !== "cam" && S.st === s && S.T === t; return '<td><button type="button" class="cc-gb' + (here ? " cc-here" : "") + '" data-g="' + k + '" data-k="ccg' + k + '" aria-pressed="' + on + '" aria-label="' + STN[s] + " stomata, " + t + " °C: " + (on ? "marked" : "not marked") + (here ? " (current setting)" : "") + '"><span aria-hidden="true">' + (on ? "✓" : "") + "</span></button></td>"; }).join("") + "</tr>"; }).join("") +
        '</tbody></table></div><div class="q-actions"><button type="button" class="btn ghost sm" data-gclear="1" data-k="ccgclr"' + (Object.keys(S.grid).some(function(k){ return S.grid[k]; }) ? "" : " disabled") + '>Clear the grid</button><span class="tiny muted">Outlined: the current setting.</span></div>';
    });
  }
  gridBox.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.gclear) S.grid = {};
    else if (b.dataset.g) S.grid[b.dataset.g] = !S.grid[b.dataset.g];
    else return;
    api.save(); paintGrid(); MV.changed();
  });

  function describe(label, b, a){
    if (a.path === "cam") return label + ". Stomata " + (a.open ? "open" : "closed") + " · vacuole pH " + a.ph.toFixed(1) + " · Calvin cycle " + (a.run ? "running" : "idle") + ".";
    var parts = [];
    if (b.path === a.path && b.o === a.o && b.net === a.net) parts.push("No change to rubisco: " + a.o + " O₂ events per 10, net gain " + num(a.net) + ".");
    else parts.push("O₂ events per 10: " + (b.path === "cam" ? "0" : b.o) + " → " + a.o + ". Net carbon gained: " + (b.path === "cam" ? "–" : num(b.net)) + " → " + num(a.net) + " per 10.");
    return label + ". " + parts.join(" ");
  }
  function stop(){
    if (anim) { anim(); anim = null; }
    disp.T = S.T; disp.ap = S.path === "cam" ? (camOpen(S.clock) ? 1 : 0) : AP[S.st]; disp.ring = S.path === "c4" ? 1 : 0; disp.clock = S.clock; disp.mix = null; barK = 1; barFrom = null;
    if (pend) { var d = pend; pend = null; d(); }
  }
  function change(patch, label, dur, done){
    stop();
    var b = cur(), from = { T:disp.T, ap:disp.ap, ring:disp.ring, clock:disp.clock, mix:b.mix };
    Object.keys(patch).forEach(function(k){ S[k] = patch[k]; });
    var a = cur();
    S.seen[S.path] = true;
    what = describe(label, b, a);
    api.save(); paint(); MV.changed();
    var to = { T:S.T, ap:S.path === "cam" ? (camOpen(S.clock) ? 1 : 0) : AP[S.st], ring:S.path === "c4" ? 1 : 0, clock:S.clock, mix:a.mix };
    if (S.path === "cam" && b.path === "cam" && patch.clock != null && from.clock !== to.clock) { // the clock runs forward through the night
      var c1 = to.clock; while (c1 <= from.clock - 0.01) c1 += 24; if (c1 - from.clock > 12 && !done) c1 = to.clock; to.clock = c1;
    }
    barFrom = b.path === a.path || (b.path !== "cam" && a.path !== "cam") ? b : null; barK = 0;
    anim = MV.tween({ dur:dur || 1300, ease:MV.ease, step:function(k){
      disp.T = lerp(from.T, to.T, k); disp.ap = lerp(from.ap, to.ap, k); disp.ring = lerp(from.ring, to.ring, k); disp.clock = lerp(from.clock, to.clock, k); disp.mix = lerp(from.mix, to.mix, k); barK = k;
      paintStatic(); paintBars();
    }, done:function(){ anim = null; disp.clock = S.clock; disp.mix = null; barK = 1; barFrom = null; paintStatic(); paintBars(); if (done) done(); } });
  }
  function dObj(){ var cam = S.path === "cam"; return { T:disp.T, ap:cam ? (camOpen(Math.floor(disp.clock)) ? 1 : 0) : disp.ap, ring:disp.ring, clock:disp.clock, mix:cam ? (camOpen(Math.floor(disp.clock)) ? 2 : 6) : disp.mix, idle:cam && !camRun(Math.floor(disp.clock) % 24) }; }
  function paintStatic(){
    var sw = svg.getBoundingClientRect().width; TS = sw && sw < 460 ? 1.3 : 1;
    var m = cur(); if (S.path === "cam") m = model("cam", "open", 20, disp.clock);
    gS.innerHTML = sceneSVG(m, dObj());
    if (MV.reduceMotion) gF.innerHTML = stillSVG(cur());
  }
  function paintBars(){
    var m = cur(), list;
    if (S.cmp && S.path !== "cam") list = [{ m:model("c3", S.st, S.T), from:barFrom && barFrom.path === "c3" ? barFrom : null }, { m:model("c4", S.st, S.T), from:barFrom && barFrom.path === "c4" ? barFrom : null }];
    else list = [{ m:m, from:barFrom, title:PATHN[m.path] + (m.path === "cam" ? (m.run ? " (by day)" : " (now)") : "") }];
    $("#cc-bars").innerHTML = barsHTML(list, barK);
  }
  function rowsOf(m){
    var r = [];
    r.push(["Pathway", PATHN[m.path]]);
    r.push(["Rubisco reactions with O₂ (per 10)", String(m.o)]);
    if (m.path === "cam" && !m.run) { r.push(["CO₂ fixed (per 10)", "0 now: Calvin cycle idle" + (m.open ? " (CO₂ stored as malic acid)" : "")]); }
    else r.push(["CO₂ fixed (per 10)", num(m.fixed) + (m.path === "cam" ? " (released from malic acid)" : "")]);
    r.push(["CO₂ lost to photorespiration", num(m.lost)]);
    r.push(["Net carbon gained (per 10)", num(m.net)]);
    r.push(["ATP per carbon gained", perText(m)]);
    r.push(["Water-loss index", waterText(m.water)]);
    if (m.path === "cam") r.push(["Time, stomata, vacuole pH, Calvin cycle", camRow(m)]);
    return r;
  }
  function paintRead(){
    var m = cur(), html;
    if (S.cmp && S.path !== "cam") {
      var a = rowsOf(model("c3", S.st, S.T)), b = rowsOf(model("c4", S.st, S.T));
      html = '<div class="tbl-wrap"><table class="cc-cmpt"><caption>' + S.T + " °C, stomata " + STL[S.st] + '</caption><thead><tr><th scope="col">Readout</th><th scope="col">C3</th><th scope="col">C4</th></tr></thead><tbody>' +
        a.slice(1).map(function(r, i){ return '<tr><th scope="row">' + r[0] + "</th><td>" + r[1] + "</td><td>" + b[i + 1][1] + "</td></tr>"; }).join("") + "</tbody></table></div>";
    } else html = '<dl class="read">' + MV.readoutHTML(rowsOf(m)) + "</dl>";
    if (html !== readSig) { readSig = html; $("#cc-read").innerHTML = html; }
    svg.setAttribute("aria-label", ariaOf(m));
    $("#cc-aha").hidden = !(S.seen.c3 && S.seen.c4 && S.seen.cam);
  }
  function sync(){
    modeR.set(S.mode); pathR.set(S.path); tempR.set(S.T); stoR.setOptions(stoOpts()); stoR.set(S.st);
    $("#cc-clock").hidden = S.path !== "cam"; clk.value = S.clock; clkShow(S.clock);
    $("#cc-temp").classList.toggle("cc-dim", S.path === "cam");
    $("#cc-dil").hidden = S.mode !== "dil"; $("#cc-str").hidden = S.mode !== "str";
  }
  function paint(){
    sync(); paintCmp(); paintStatic(); paintRead(); paintBars(); paintGrid();
    var m = cur();
    $("#cc-cap").textContent = what || (m.path === "cam" ? "CAM: move the clock through the day and night." : "Rubisco’s dilemma: change the temperature and the stomata, then switch pathways.") + (S.path === "cam" ? " (Temperature has no effect on CAM in the model.)" : "");
    run();
  }
  // live loop (about 30 frames per second, only while the diagram is on screen)
  function visible(){ var b = svg.getBoundingClientRect(); return b.width > 0 && !document.hidden && S.mode === "dil"; }
  function frame(now){
    raf = null;
    if (MV.reduceMotion || !visible()) return;
    raf = requestAnimationFrame(frame);
    if (now - lastDraw < 32) return;
    lastDraw = now;
    var m = cur(); if (S.path === "cam") m = model("cam", "open", 20, Math.floor(disp.clock));
    gF.innerHTML = flowSVG(m, now / 1000, dObj());
  }
  function run(){ if (MV.reduceMotion) return; if (!raf) raf = requestAnimationFrame(frame); }
  EXR = run;
  document.addEventListener("visibilitychange", function(){ if (!document.hidden) run(); });

  // ---- Three strategies side by side: one S2 stepper (MV.player on its own host) per pathway ----
  var sAnim = {};
  function sPaint(id, i, animate){
    var box = $("#cc-ss-" + id), G = SG[id], s = G.steps[i];
    $(".cc-sb", box).innerHTML = stratBase(id, i);
    box.setAttribute("aria-label", G.name + " pathway, step " + (i + 1) + " of " + G.steps.length + ": " + MV.plain(s.cap));
    $("#cc-sc-" + id).innerHTML = "<strong>Step " + (i + 1) + ".</strong> " + s.cap;
    $("#cc-cc-" + id).innerHTML = '<span class="cc-cct">Carbon counter</span> ' + s.carbon;
    $$('[data-sg="' + id + '"] .cc-stepb', host).forEach(function(b){ var on = +b.dataset.st === i; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); });
    if (sAnim[id]) { sAnim[id](); sAnim[id] = null; }
    var hi = $(".cc-sh", box);
    if (!animate || MV.reduceMotion) { hi.innerHTML = stratHi(id, i, 1); return; }
    sAnim[id] = MV.tween({ dur:950, ease:MV.ease, step:function(k){ hi.innerHTML = stratHi(id, i, k); }, done:function(){ sAnim[id] = null; hi.innerHTML = stratHi(id, i, 1); } });
  }
  var players = {}, ready = false;
  ["c3", "c4", "cam"].forEach(function(id){
    var G = SG[id];
    players[id] = MV.player($("#cc-pl-" + id), { count:G.steps.length, interval:2200, label:function(i){ return "Step " + (i + 1) + " of " + G.steps.length; },
      render:function(i){ S.str[id] = i; if (ready) api.save(); sPaint(id, i, ready); } });
    if (S.str[id]) players[id].go(S.str[id]);
  });
  ready = true;
  $("#cc-str").addEventListener("click", function(e){
    var b = e.target.closest(".cc-stepb"); if (!b) return;
    var id = b.closest("[data-sg]").dataset.sg; players[id].go(+b.dataset.st);
  });
  S.seen[S.path] = true;
  paint();

  function chal(id){
    var m = cur();
    if (id === "tc3") {
      var want = {}; STS.forEach(function(s){ TEMPS.forEach(function(t){ if (c3o(s, t) >= 3) want[s + "-" + t] = true; }); });
      var keys = []; STS.forEach(function(s){ TEMPS.forEach(function(t){ keys.push(s + "-" + t); }); });
      var marked = keys.filter(function(k){ return S.grid[k]; });
      if (keys.every(function(k){ return !!S.grid[k] === !!want[k]; })) return { ok:true };
      if (marked.length === 12) return { ok:false, msg:"In cool, open conditions C3 is cheaper." };
      if (S.grid["open-20"]) return { ok:false, msg:"C3 needs 4.9 there, just under C4’s 5.0." };
      if (!S.grid["closed-40"]) return { ok:false, msg:"Closed stomata at 40 °C: C3 gains no carbon at all there, so any gain is cheaper." };
      if (!marked.length) return { ok:false, msg:"Mark the cells in the grid below the readout first." };
      return { ok:false, msg:"Not every cell is right yet. Compare C3’s ATP per carbon in each cell with C4’s 5.0." };
    }
    if (S.mode !== "dil") return { ok:false, msg:"Switch to Rubisco’s dilemma mode first." };
    if (S.path !== "c3") return { ok:false, msg:"Set the pathway to C3 first: this challenge is about a C3 leaf." };
    if (id === "tc1") {
      if (m.o === 2) return { ok:true };
      if (S.st === "open" && S.T === 10) return { ok:false, msg:"A little too cool: only 1 O₂ event (net 8.5)." };
      if (S.st === "open" && S.T === 30) return { ok:false, msg:"Too warm: 3 O₂ events give a net gain of 5.5." };
      return { ok:false, msg:"That setting gives " + m.o + " O₂ events and a net gain of " + num(m.net) + ". You need exactly 7." };
    }
    if (id === "tc2") {
      if (m.net < 0) return { ok:true };
      if (S.st === "closed" && S.T === 30) return { ok:false, msg:"Still a small gain: net 1 per 10." };
      if (S.st === "partly" && S.T === 40) return { ok:false, msg:"Still a gain: net 2.5 per 10." };
      return { ok:false, msg:"Net gain " + num(m.net) + " per 10: the leaf still gains carbon." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop(); var s = p.start;
        S.mode = "dil"; S.path = s.path; S.cmp = false;
        if (s.st) S.st = s.st; if (s.T) S.T = s.T; if (s.clock != null) S.clock = s.clock;
        S.seen[S.path] = true; what = ""; stop();
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        var lab = Object.keys(p.to).map(function(k){ var v = p.to[k]; return k === "T" ? "Leaf temperature: " + v + " °C" : k === "st" ? "Stomata: " + STL[v] : k === "path" ? "Pathway: " + PATHN[v] : "Clock: " + clockText(v); }).join(", ");
        change(p.to, lab, p.to.clock != null ? 4200 : 2600, function(){ var d = pend; pend = null; if (d) MV.wait(MV.reduceMotion ? 50 : 900, d); });
        pend = done;   // set after change(): its stop() would otherwise finish the prediction at once; a later stop() still calls it
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Which plant wins where? ----------
// @component S7 experimentBench (data stations) — model-data table + graph (Plot) with chip prompts; an oxygen-test bench where
// each column is measured before the prompts unlock.
function promptOrder(p){ var idx = p.options.map(function(o, k){ return k; }); if (!p.shuffle) return idx; var ord = MV.shuffle(idx, "cc" + p.id); if (MV.ok(p.options[ord[0]])) ord.push(ord.shift()); return ord; }
function promptHTML(p, st, lock){
  var h = '<div class="cc-pr" data-pr="' + p.id + '"><p class="cc-prq">' + p.prompt + '</p><div class="sq-c cc-chips" role="group" aria-label="Choices">' + promptOrder(p).map(function(k){ var o = p.options[k], on = st.last === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-pc="' + k + '" data-k="ccpc' + p.id + k + '"' + (st.solved || lock ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
  if (st.last != null) { var o = p.options[st.last], good = MV.ok(o); h += MV.fbHTML(good ? "good" : "bad", (good ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + o.why + (good ? "" : " Try another answer.")); }
  return h + "</div>";
}
// @component climateBoard — tap a plant card, then a climate card (N6-style matching; a plant may fit more than one climate)
// @component enzymeZoom — "Zoom to the molecules": PEP carboxylase and rubisco offered CO₂ (as HCO₃⁻) or O₂
function zoomSVG(gas, k, Z){
  var h = sv("rect", { x:0, y:0, width:520, height:190, rx:10, "class":"cc-zbg" });
  var E = [[150, 120, Z.pep, "cc-enz cc-pep"], [390, 120, Z.rub, "cc-enz"]];
  E.forEach(function(e, i){
    h += enzSVG(e[0], e[1], 1.15, e[3]) + txt(e[0] + 4, e[1] + 52, e[2], "cc-tb", "middle");
    if (!gas) return;
    var site = [e[0] - 31, e[1]], binds = gas === "co2" || i === 1, lab = gas === "co2" ? (i === 0 ? "HCO₃⁻" : "CO₂") : "O₂";
    var start = [site[0] - 90, 20], q;
    if (binds) { q = polyAt([start, [site[0] - 40, site[1] - 30], site], k); h += tok(lab, q[0], q[1], 1, 0.95); if (k >= 1) h += txt(e[0] + 4, e[1] - 48, "✓ binds", "cc-tb cc-halo", "middle"); }
    else { var kk = k < 0.6 ? k / 0.6 : 1 - (k - 0.6) / 0.4 * 0.7; q = polyAt([start, [site[0] - 40, site[1] - 30], [site[0] - 14, site[1] - 6]], kk); h += tok(lab, q[0], q[1], 1, 0.95); if (k >= 1) h += txt(e[0] + 4, e[1] - 48, "✗ never binds", "cc-tb cc-halo", "middle"); }
  });
  return h;
}
function part3(host, api){
  var C = api.content, S = api.S, S1 = C.s1, S2 = C.s2, S3 = C.s3, Z = S3.zoom;
  S.pr = S.pr || {}; S.board = S.board || {}; S.m = S.m || {};
  function pst(id){ return S.pr[id] || (S.pr[id] = { tries:0 }); }
  function tblHTML(head, rows, cap, hide){
    return '<div class="tbl-wrap"><table class="cc-tbl"><caption class="vh">' + cap + '</caption><thead><tr>' + head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function(r){ return "<tr>" + r.map(function(c, i){ return i ? "<td>" + (hide && hide(i) ? '<span class="muted">?</span>' : c) + "</td>" : '<th scope="row">' + c + "</th>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
  }
  host.innerHTML = '<div class="cc-p3">' +
    '<div class="cc-st1"><h3>' + S1.title + '</h3><details class="alg" open><summary>' + S1.panel + "</summary><p>" + S1.intro + '</p><div class="cc-s1row"><div class="cc-s1pl"><div class="plot-wrap"><canvas class="plot" id="cc-s1c" role="img"></canvas></div><p class="tiny muted cc-s1leg"><span class="cc-key cc-key-w" aria-hidden="true"></span> wheat (C3), solid line · <span class="cc-key cc-key-c" aria-hidden="true"></span> corn (C4), long dashes · <span class="bio-model">Model data</span></p></div>' +
      '<div class="cc-s1tb">' + tblHTML(S1.head, S1.rows, "Net photosynthesis (relative units, model data) of wheat and corn at four leaf temperatures") + '</div></div><div class="cc-prs" id="cc-s1q"></div></details></div>' +
    '<div class="cc-st2 part"><h3>' + S2.title + "</h3><p>" + S2.intro + '</p><div class="cc-bench"><div id="cc-s2t"></div><div class="q-actions" id="cc-s2b"></div></div><div class="cc-prs" id="cc-s2q"></div></div>' +
    '<div class="cc-st3 part"><h3>' + S3.title + "</h3><p>" + S3.intro + '</p><div id="cc-board"></div>' +
      '<details class="alg cc-zoom"><summary>' + Z.title + "</summary><p>" + Z.intro + '</p><div class="cc-zstage"><svg id="cc-zsvg" viewBox="0 0 520 190" role="img" focusable="false"></svg></div><div class="q-actions" id="cc-zb"></div><p class="cc-zcap" id="cc-zcap" aria-live="polite"></p></details></div></div>';

  // Station 1 graph
  var cv = $("#cc-s1c", host), plot = new MV.Plot(cv, { xmin:4, xmax:48, ymin:0, ymax:90 });
  plot.render = function(){
    var css = MV.css, pen = css("--pen"), ink = css("--ink"), font = "600 13px " + css("--font-ui");
    var W = S1.rows[0].slice(1).map(function(v, i){ return [TEMPS[i], v]; }), Cn = S1.rows[1].slice(1).map(function(v, i){ return [TEMPS[i], v]; });
    plot.draw({ view:{ xmin:4, xmax:48, ymin:0, ymax:90 }, xTicks:{ step:10, fmt:function(v){ return v + " °C"; } }, yTicks:{ step:20 }, yLabel:S1.yLabel,
      curves:[{ pts:W, color:pen, width:3 }, { pts:Cn, color:ink, width:3, dash:[14, 7] }],
      points:W.map(function(q){ return { x:q[0], y:q[1], r:5, color:pen }; }).concat(Cn.map(function(q){ return { x:q[0], y:q[1], r:4.5, color:ink }; })),
      labels:[{ x:40, y:20, text:"wheat (C3)", color:ink, align:"right", dx:-8, dy:16, font:font, bg:true }, { x:40, y:70, text:"corn (C4)", color:ink, align:"right", dx:-8, dy:-16, font:font, bg:true }],
      describe:"Model data. Net photosynthesis against leaf temperature. Wheat (C3, solid line): 40 at 10 °C, 60 at 20 °C, 45 at 30 °C, 20 at 40 °C. Corn (C4, long dashes): 20, 55, 80 and 70. The lines cross between 20 and 30 °C." });
  };
  plot.render();
  // prompts (stations 1 and 2)
  function paintPrompts(boxId, list, lock){
    var box = $(boxId, host);
    MV.keepFocus(box, function(){ box.innerHTML = (lock ? '<p class="tiny muted">Measure both O₂ levels first: the prompts unlock when the table is full.</p>' : "") + list.map(function(p){ return promptHTML(p, pst(p.id), lock); }).join(""); });
  }
  function s2lock(){ return !(S.m.a21 && S.m.a2); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-pc]"); if (!b || b.disabled) return;
    var pr = b.closest("[data-pr]"), id = pr.dataset.pr, list = S1.prompts.concat(S2.prompts), p = list.filter(function(x){ return x.id === id; })[0], st = pst(id), k = +b.dataset.pc;
    st.last = k; if (MV.ok(p.options[k])) st.solved = true; else st.tries++;
    api.save();
    var inS1 = S1.prompts.indexOf(p) >= 0;
    paintPrompts(inS1 ? "#cc-s1q" : "#cc-s2q", inS1 ? S1.prompts : S2.prompts, !inS1 && s2lock());
    MV.focusFb($('[data-pr="' + id + '"]', host));
  });
  paintPrompts("#cc-s1q", S1.prompts, false);
  // Station 2: the oxygen test bench
  var mAnim = null, shown = { a21:S.m.a21 ? 1 : 0, a2:S.m.a2 ? 1 : 0 };
  function paintBench(){
    var rows = S2.rows.map(function(r){ return [r[0], shown.a21 >= 1 ? r[1] : shown.a21 > 0 ? Math.round(r[1] * shown.a21) : null, shown.a2 >= 1 ? r[2] : shown.a2 > 0 ? Math.round(r[2] * shown.a2) : null]; });
    $("#cc-s2t", host).innerHTML = tblHTML(S2.head, rows.map(function(r){ return [r[0], r[1] == null ? "?" : r[1], r[2] == null ? "?" : r[2]]; }), "Rate of photosynthesis of plants A and B at 21% and 2% O₂ (model data)") + '<p class="tiny muted cc-tnote"><span class="bio-model">Model data</span> Light, CO₂ and temperature (30 °C) are the same in every run.</p>';
  }
  function paintBenchBtns(){
    var bx = $("#cc-s2b", host);
    MV.keepFocus(bx, function(){ bx.innerHTML = '<button type="button" class="btn ' + (S.m.a21 ? "ghost" : "primary") + ' sm" data-ms="a21" data-k="ccm21"' + (S.m.a21 || mAnim ? " disabled" : "") + ">Measure at 21% O₂</button>" + '<button type="button" class="btn ' + (S.m.a2 || !S.m.a21 ? "ghost" : "primary") + ' sm" data-ms="a2" data-k="ccm2"' + (S.m.a2 || mAnim ? " disabled" : "") + ">Measure at 2% O₂</button>"; });
  }
  $("#cc-s2b", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-ms]"); if (!b || b.disabled) return;
    var key = b.dataset.ms; S.m[key] = true; api.save();
    mAnim = MV.tween({ dur:1100, ease:lin, step:function(k){ shown[key] = k; paintBench(); }, done:function(){ mAnim = null; shown[key] = 1; paintBench(); paintBenchBtns(); paintPrompts("#cc-s2q", S2.prompts, s2lock()); } });
    paintBenchBtns();
  });
  paintBench(); paintBenchBtns(); paintPrompts("#cc-s2q", S2.prompts, s2lock());

  // Station 3: climate board
  var sel = null, bmsg = null, board = $("#cc-board", host), ANS = MV.ans(S3);
  function plantBy(id){ return S3.plants.filter(function(p){ return p.id === id; })[0]; }
  function paintBoard(){
    var free = S3.plants.filter(function(p){ return !S.board[p.id]; });
    var h = '<div class="cc-tray" role="group" aria-label="Plant cards">' + (free.length ? free.map(function(p){ return '<button type="button" class="cc-plant" data-pl="' + p.id + '" data-k="ccp' + p.id + '" aria-pressed="' + (sel === p.id) + '">' + p.t + "</button>"; }).join("") : '<p class="sort-done">' + S3.done + "</p>") + "</div>";
    if (bmsg) h += MV.fbHTML(bmsg[0], bmsg[1]);
    h += '<div class="cc-clims">' + S3.climates.map(function(c){
      var inside = S3.plants.filter(function(p){ return S.board[p.id] === c.id; });
      return '<button type="button" class="cc-clim' + (sel ? " ready" : "") + '" data-cl="' + c.id + '" data-k="ccc' + c.id + '"><span class="cc-clh">' + climIcon(c.id) + "<strong>" + c.t + '</strong></span><span class="cc-cli">' + inside.map(function(p){ return '<span class="chip-in txt">' + p.t + ' <span class="cc-ptag">' + p.path + "</span></span>"; }).join("") + "</span></button>";
    }).join("") + "</div>";
    MV.keepFocus(board, function(){ board.innerHTML = h; });
  }
  function climIcon(id){
    var s = '<svg viewBox="0 0 28 22" aria-hidden="true" focusable="false" class="cc-ci">';
    if (id === "cool") s += sv("path", { d:"M6 13 a5 5 0 0 1 4 -7 a6 6 0 0 1 11 2 a4 4 0 0 1 0 8 H8 a4 4 0 0 1 -2 -3 Z", "class":"cc-cloud" }) + sv("line", { x1:10, y1:19, x2:9, y2:21, "class":"cc-drop" }) + sv("line", { x1:16, y1:19, x2:15, y2:21, "class":"cc-drop" });
    else if (id === "desert") s += sunSVG(14, 11, 4.5);
    else s += sunSVG(9, 8, 3.4) + sv("path", { d:"M12 12 a4 4 0 0 1 4 -4 a5 5 0 0 1 9 3 a3 3 0 0 1 0 6 H14 a3 3 0 0 1 -2 -5 Z", "class":"cc-cloud" }) + sv("line", { x1:17, y1:19, x2:16, y2:21, "class":"cc-drop" }) + sv("line", { x1:22, y1:19, x2:21, y2:21, "class":"cc-drop" });
    return s + "</svg>";
  }
  board.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pl) { sel = sel === b.dataset.pl ? null : b.dataset.pl; bmsg = null; paintBoard(); return; }
    if (b.dataset.cl) {
      if (!sel) { bmsg = ["", "Tap a plant card first, then tap its climate."]; paintBoard(); return; }
      var p = plantBy(sel), cl = b.dataset.cl;
      if (ANS[p.id].indexOf(cl) >= 0) { S.board[p.id] = cl; bmsg = ["good", "<strong>✓ " + p.t + ".</strong> " + p.why]; sel = null; api.save(); paintBoard(); MV.focusFb(board); return; }
      var hot = cl === "belt" || cl === "tropic", key = p.path + "|" + (cl === "cool" ? "cool" : cl === "desert" ? "desert" : "hot");
      if (p.path === "C3" && hot) key = "C3|hot";
      bmsg = ["bad", "<strong>✗ Not the best home for " + p.t.toLowerCase() + ".</strong> " + (S3.wrong[key] || "Think about photorespiration and water.") + " Try another climate."];
      paintBoard(); MV.focusFb(board);
    }
  });
  paintBoard();

  // Zoom to the molecules
  var zs = $("#cc-zsvg", host), zAnim = null, zb = $("#cc-zb", host);
  S.zg = S.zg || null;
  function zAria(){ zs.setAttribute("aria-label", "PEP carboxylase on the left and rubisco on the right. " + (S.zg === "co2" ? "CO₂ is offered: both enzymes bind it." : S.zg === "o2" ? "O₂ is offered: PEP carboxylase never binds it; rubisco binds it." : "Nothing offered yet.")); }
  function zBtns(){ MV.keepFocus(zb, function(){ zb.innerHTML = '<button type="button" class="btn ghost sm" data-z="co2" data-k="cczco2" aria-pressed="' + (S.zg === "co2") + '"' + (zAnim ? " disabled" : "") + ">Offer " + Z.co2 + '</button><button type="button" class="btn ghost sm" data-z="o2" data-k="cczo2" aria-pressed="' + (S.zg === "o2") + '"' + (zAnim ? " disabled" : "") + ">Offer O₂</button>"; }); }
  function zCap(){ $("#cc-zcap", host).innerHTML = S.zg === "co2" ? Z.capCO2 : S.zg === "o2" ? Z.capO2 : Z.cap0; }
  zb.addEventListener("click", function(e){
    var b = e.target.closest("[data-z]"); if (!b || b.disabled) return;
    S.zg = b.dataset.z; api.save(); zCap(); zAria();
    zAnim = MV.tween({ dur:1600, ease:MV.ease, step:function(k){ zs.innerHTML = zoomSVG(S.zg, k, Z); }, done:function(){ zAnim = null; zs.innerHTML = zoomSVG(S.zg, 1, Z); zBtns(); } });
    zBtns();
  });
  zs.innerHTML = zoomSVG(S.zg, 1, Z); zBtns(); zCap(); zAria();
}

// ---------- Practice 2: Photorespiration problems (N4 number entry, chips, number + chip, two-box items; from SBI4U 06) ----------
function probs(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:"", vals:["", ""], tries:0, hint:0, solved:false, first:null }); if (!x.vals) x.vals = ["", ""]; return x; }
  host.innerHTML = '<p class="how">Type your answer, then press Check. Fractions like 20/3 are fine. Use the Rubisco’s dilemma model.</p>' + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function parseVal(raw){ var s = String(raw == null ? "" : raw).trim().replace(/[%]/g, "").replace(/[a-zA-Z].*$/, "").replace(/×/g, "").replace(/\s/g, ""); var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, t, tol){ return Math.abs(v - t) <= (tol == null ? 1e-6 * Math.max(1, Math.abs(t)) : tol); }
  function numBox(it, x, k, label, unit){
    var id = "cp-" + it.id + (k == null ? "" : k), val = k == null ? x.val : x.vals[k];
    return '<div class="numrow"><label for="' + id + '">' + label + ':</label><input class="numin" id="' + id + '" data-lin="' + it.id + '"' + (k == null ? "" : ' data-ix="' + k + '"') + ' type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(val) + '"' + (x.solved ? " disabled" : "") + ">" + (unit ? '<span class="cc-unit">' + unit + "</span>" : "") + "</div>";
  }
  function chipsHTML(it, x, list, sel){ return '<div class="sq-c cc-chips" role="group" aria-label="' + (it.chipLabel || "Choices") + '">' + list.map(function(t, k){ var on = sel === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ci="' + k + '" data-k="' + it.id + "c" + k + '"' + (x.solved ? " disabled" : "") + ">" + t + "</button>"; }).join("") + "</div>"; }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = host.querySelector('[data-li="' + it.id + '"]');
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "chips") h += chipsHTML(it, x, it.options.map(function(o){ return o.t; }), x.last);
    else if (it.kind === "numchip") h += numBox(it, x, null, it.label, it.unit) + '<p class="cc-chl-lab">' + it.chipLabel + ":</p>" + chipsHTML(it, x, it.chips, x.chip);
    else if (it.kind === "pair") h += '<div class="cc-pair">' + it.labels.map(function(l, k){ return numBox(it, x, k, l, ""); }).join("") + "</div>";
    else h += numBox(it, x, null, "Your answer", it.unit);
    if (!x.solved) h += '<div class="q-actions">' + (it.kind === "chips" ? "" : '<button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>') + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || x.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; var x = ist(id); if (e.target.dataset.ix != null) x.vals[+e.target.dataset.ix] = e.target.value; else x.val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = item(box.dataset.li), x = ist(it.id), ok = null, ans = MV.ans(it);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.ci != null && it.kind === "numchip") { x.chip = +b.dataset.ci; api.save(); paintItem(it); return; }
    if (b.dataset.ci != null) {
      var o = it.options[+b.dataset.ci]; x.last = +b.dataset.ci; ok = MV.ok(o);
      msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + o.why + " Try again.";
      if (ok) x.why = o.why;
    } else if (b.dataset.act === "check") {
      if (it.kind === "pair") {
        var vs = x.vals.map(parseVal), tl = it.tol || [null, null];
        if (vs[0] == null || vs[1] == null) { msgs[it.id] = "Enter a number in both boxes, such as 4.4 or 40."; paintItem(it); return; }
        ok = near(vs[0], ans[0], tl[0]) && near(vs[1], ans[1], tl[1]);
        msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + it.wrongFb + " Try again.";
      } else if (it.kind === "numchip") {
        var v1 = parseVal(x.val);
        if (v1 == null || x.chip == null) { msgs[it.id] = "Enter a number and choose a pathway."; paintItem(it); return; }
        ok = near(v1, ans[0]) && it.chips[x.chip] === ans[1];
        msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + it.wrongFb + " Try again.";
      } else {
        var v = parseVal(x.val);
        if (v == null) { msgs[it.id] = "Enter a number, such as 5.5 or 20/3."; paintItem(it); return; }
        ok = near(v, ans);
        if (!ok) {
          var named = (it.wrong || []).filter(function(w){ return near(v, w.match); })[0];
          var fb = named ? named.fb : (it.near && Math.abs(v - ans) < 0.06) ? it.near : (it.general || "Check your working against the model.");
          msgs[it.id] = "<strong>✗ Not quite.</strong> " + fb + " Try again.";
        } else msgs[it.id] = null;
      }
    } else return;
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    api.save(); paintItem(it); MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- miniLeafSVG (copied from SBI4U 01; classes renamed ccl-): small schematic cross-section, viewBox 160 × 100 ----------
function miniLeafSVG(d){
  var h = "", x, i, L;
  var th = 18 + d.t * 110, y0 = 50 - th / 2, y1 = 50 + th / 2, X0 = 6, X1 = 154, cw = d.cut >= 4 ? 4.5 : d.cut >= 2 ? 2.2 : 1, ep = 5;
  h += sv("rect", { x:X0, y:y0, width:X1 - X0, height:th, "class":"ccl-air" });
  var iy0 = y0 + ep, iy1 = y1 - ep, ih = iy1 - iy0, palH = ih * (d.pal >= 3 ? 0.62 : d.pal === 2 ? 0.5 : 0.36), lh = palH / d.pal;
  for (L = 0; L < d.pal; L++) for (x = X0; x < X1 - 1; x += 6) h += sv("rect", { x:x + .5, y:iy0 + L * lh + .5, width:5, height:lh - 1, rx:2, "class":"ccl-tis" });
  var sy0 = iy0 + palH, sh = iy1 - sy0, rows = Math.max(1, Math.round(sh / 9)), rh = sh / rows, gap = d.bigAir ? 19 : 9.5;
  for (i = 0; i < rows; i++) for (x = X0 + 5 + (i % 2) * gap / 2; x < X1 - 3; x += gap) {
    if (Math.abs(x - 80) < (d.kranz ? 22 : 12) && !d.bigAir) continue;
    h += sv("ellipse", { cx:x, cy:sy0 + rh * (i + 0.5), rx:d.bigAir ? 4 : 4.2, ry:Math.min(4, rh / 2 - .4), "class":"ccl-tis" });
  }
  var vr = Math.min(6.5, sh / 2 - 0.5), vy = sy0 + sh / 2;
  if (d.kranz) { for (i = 0; i < 9; i++) { var c = i / 9 * Math.PI * 2; h += sv("circle", { cx:80 + Math.cos(c) * (vr + 3.2), cy:vy + Math.sin(c) * (vr + 3.2), r:3, "class":"ccl-kranz" }); } }
  h += sv("circle", { cx:80, cy:vy, r:vr, "class":"ccl-vein-in" }) + sv("circle", { cx:78, cy:vy - vr * 0.35, r:vr * 0.32, "class":"ccl-xy" }) + sv("circle", { cx:82, cy:vy + vr * 0.45, r:vr * 0.22, "class":"ccl-ph" });
  for (x = X0; x < X1 - 1; x += 8) { h += sv("rect", { x:x + .4, y:y0 + .4, width:7.2, height:ep - .8, rx:1.5, "class":"ccl-epi" }) + sv("rect", { x:x + .4, y:y1 - ep + .4, width:7.2, height:ep - .8, rx:1.5, "class":"ccl-epi" }); }
  h += sv("rect", { x:X0, y:y0 - cw, width:X1 - X0, height:cw, "class":"ccl-cut" }) + sv("rect", { x:X0, y:y1, width:X1 - X0, height:cw, "class":"ccl-cut" });
  function stomata(dens, top){
    var n = dens >= 400 ? 5 : dens >= 200 ? 3 : dens > 0 ? 2 : 0, s = "";
    for (var k = 0; k < n; k++) {
      var sx = X0 + (k + 0.5) * (X1 - X0) / n + (n === 2 ? 0 : 6), sy = top ? y0 : y1;
      s += sv("rect", { x:sx - 1.4, y:top ? sy - cw - 0.5 : sy - ep, width:2.8, height:ep + cw + 1, "class":"ccl-pit" });
      var gy = top ? sy + ep / 2 : sy - ep / 2;
      s += sv("ellipse", { cx:sx - 3.4, cy:gy, rx:2.4, ry:2.2, "class":"ccl-gsm" }) + sv("ellipse", { cx:sx + 3.4, cy:gy, rx:2.4, ry:2.2, "class":"ccl-gsm" });
    }
    return s;
  }
  h += stomata(d.up, true) + stomata(d.low, false);
  return h;
}
// three-panel frame (hero end; reduced-motion hero): C3 cross-section, C4 Kranz ring, CAM sun/moon clock
function kranzSVG(cx, cy, s){
  var h = "", i;
  for (i = 0; i < 16; i++) { var a = i / 16 * Math.PI * 2; h += sv("circle", { cx:cx + 62 * s * Math.cos(a), cy:cy + 62 * s * Math.sin(a), r:11 * s, "class":"cc-mes" }); }
  for (i = 0; i < 10; i++) { var b = i / 10 * Math.PI * 2; var x = cx + 38 * s * Math.cos(b), y = cy + 38 * s * Math.sin(b); h += sv("circle", { cx:x, cy:y, r:13 * s, "class":"cc-bs" }) + sv("circle", { cx:x - 3 * s, cy:y - 3 * s, r:2.4 * s, "class":"cc-chlo" }) + sv("circle", { cx:x + 3 * s, cy:y + 3 * s, r:2.4 * s, "class":"cc-chlo" }); }
  return h + sv("circle", { cx:cx, cy:cy, r:22 * s, "class":"cc-vein" }) + txt(cx, cy + 4, "vein", "cc-ts", "middle");
}
function threeSVG(k){
  var h = "", P3 = [[8, "C3", "one cell type", "rubisco fixes CO₂ directly"], [180, "C4", "separated in space", "PEP carboxylase → bundle sheath"], [352, "CAM", "separated in time", "CO₂ stored at night, used by day"]];
  P3.forEach(function(p, i){
    var x = p[0], o = clamp(k * 3 - i * 0.6, 0, 1);
    var g = sv("rect", { x:x, y:8, width:160, height:284, rx:12, "class":"cc-hpan" }) + txt(x + 80, 36, p[1], "cc-thd", "middle") + txt(x + 80, 54, p[2], "cc-ts", "middle");
    if (i === 0) g += '<svg x="' + x + '" y="96" width="160" height="100" viewBox="0 0 160 100">' + miniLeafSVG({ t:0.42, pal:1, up:0, low:200, cut:2 }) + "</svg>" + txt(x + 80, 92, "leaf cross-section", "cc-ts", "middle");
    else if (i === 1) g += kranzSVG(x + 80, 160, 0.95) + txt(x + 80, 236, "Kranz ring of", "cc-ts", "middle") + txt(x + 80, 249, "bundle-sheath cells", "cc-ts", "middle");
    else g += dialSVG(x + 80, 158, 52, 0) + txt(x + 80, 84, "sun/moon clock", "cc-ts", "middle") + moonSVG(x + 54, 178, 7) + sunSVG(x + 104, 136, 6);
    g += txt(x + 80, 276, p[3], "cc-ts", "middle");
    h += '<g opacity="' + (op(o) == null ? 1 : op(o)) + '">' + g + "</g>";
  });
  return h;
}

// ---------- hero: rubisco's dilemma (C3 at 20 °C, then heat and closing stomata) → three strategies ----------
function hero(f){
  var box = $("#cc-hero"); if (!box) return;
  var cap = f && f.cap, lastCap = -1;
  box.innerHTML = '<svg viewBox="0 0 520 300" aria-hidden="true" focusable="false"><g class="cc-hs"></g><g class="cc-hf"></g></svg>';
  var gS = $(".cc-hs", box), gF = $(".cc-hf", box);
  var CAPS = [
    "Rubisco in a leaf cell. When CO₂ lands, its carbon joins the sugar chain and the Calvin cycle turns.",
    "When O₂ lands instead: carbon lost as CO₂, and ATP spent. That’s photorespiration.",
    "The day heats up and the stomata close: O₂ builds up inside the leaf, so more O₂ lands.",
    "Three strategies: C3 fixes CO₂ directly; C4 separates the steps in space; CAM separates them in time."];
  function setCap(i){ if (cap && i !== lastCap) { cap.textContent = CAPS[i]; lastCap = i; } }
  function final(){ gS.innerHTML = threeSVG(1); gF.innerHTML = ""; setCap(3); }
  if (MV.reduceMotion) { final(); return; }
  var lastSig = "";
  function frameAt(T){
    if (T >= 15) { gS.innerHTML = threeSVG(clamp((T - 15) / 1.6, 0, 1)); gF.innerHTML = ""; setCap(3); return; }
    var k = clamp((T - 7) / 2.2, 0, 1), Tc = lerp(20, 40, k), ap = lerp(1, 0, k);
    var m = model("c3", k < 0.5 ? "open" : "closed", k < 0.5 ? 20 : 40, 20);
    var d = { T:Tc, ap:ap, ring:0, clock:20, mix:lerp(2, 7, k) }, sig = Math.round(Tc) + "|" + f1(ap) + "|" + Math.round(d.mix);
    if (sig !== lastSig) { gS.innerHTML = sceneSVG(m, d); lastSig = sig; }
    var fo = T > 14 ? clamp(1 - (T - 14), 0, 1) : 1;
    gF.innerHTML = '<g opacity="' + (op(fo) == null ? 1 : op(fo)) + '">' + flowSVG(m, T, d) + "</g>";
    setCap(T < 3.2 ? 0 : T < 7 ? 1 : 2);
  }
  MV.tween({ dur:17000, ease:lin, step:function(k){ frameAt(k * 17); }, done:final });
}

// ---------- Performance task: A plant for its place ----------
var task = (function(){
  var api = null, T = null, KEYS = ["path", "enz", "loc", "sto", "reg"];
  function read(){ var s = api ? api.S : {}, d = {}; KEYS.forEach(function(k){ d[k] = s[k] || null; }); return d; }
  function partsOK(d){ return (d.path === "C3" && d.enz === "rub" && d.loc === "meso" && d.sto === "day") || (d.path === "C4" && d.enz === "pep" && d.loc === "bs" && d.sto === "day") || (d.path === "CAM" && d.enz === "pep" && d.loc === "meso" && d.sto === "night"); }
  function checks(d){
    var all = KEYS.every(function(k){ return d[k]; });
    if (!all) return [false, false, false, false, false];
    return [partsOK(d), d.reg === "cool" || d.path === "C4" || d.path === "CAM", d.reg !== "dry" || d.sto === "night", d.reg !== "cool" || d.path === "C3", d.reg !== "humid" || d.path !== "CAM"];
  }
  function optText(k, v){ var o = T.inputs[k].options.filter(function(x){ return x[0] === v; })[0]; return o ? o[1] : "?"; }
  function draw(){
    var d = read(), pv = $("#cc-tpv"); if (!pv) return;
    var h = sv("rect", { x:0, y:0, width:320, height:230, rx:10, "class":"cc-tbg" });
    // region strip
    var rg = d.reg, rn = rg ? optText("reg", rg) : "Region: not chosen";
    h += txt(10, 22, rn, "cc-tb");
    if (rg === "cool") h += sv("path", { d:"M268 24 a7 7 0 0 1 6 -10 a9 9 0 0 1 16 3 a6 6 0 0 1 0 12 H272 a5 5 0 0 1 -4 -5 Z", "class":"cc-cloud" }) + [276, 284, 292].map(function(x){ return sv("line", { x1:x, y1:34, x2:x - 2, y2:40, "class":"cc-drop" }); }).join("");
    else if (rg === "humid") h += sunSVG(266, 18, 6) + sv("path", { d:"M278 26 a6 6 0 0 1 6 -8 a8 8 0 0 1 14 3 a5 5 0 0 1 0 10 H282 a5 5 0 0 1 -4 -5 Z", "class":"cc-cloud" }) + [286, 294].map(function(x){ return sv("line", { x1:x, y1:34, x2:x - 2, y2:40, "class":"cc-drop" }); }).join("");
    else if (rg === "dry") h += sunSVG(286, 20, 8);
    // leaf
    var leaf = { t:d.path === "CAM" ? 0.62 : 0.42, pal:1, up:0, low:200, cut:d.reg === "dry" ? 4 : 2, kranz:d.loc === "bs" };
    h += '<svg x="40" y="62" width="240" height="150" viewBox="0 0 160 100">' + miniLeafSVG(leaf) + "</svg>";
    // tags: first enzyme (mesophyll), Calvin cycle location
    if (d.enz) h += txt(10, 48, "First enzyme: " + optText("enz", d.enz), "cc-ts cc-halo") + arrowPath([[70, 52], [92, 108]], "cc-tpath");
    if (d.loc) h += txt(310, 66, "Calvin cycle: " + optText("loc", d.loc).toLowerCase(), "cc-ts cc-halo", "end") + arrowPath(d.loc === "bs" ? [[240, 70], [168, 128]] : [[240, 70], [224, 108]], "cc-tpath");
    if (d.sto) h += (d.sto === "day" ? sunSVG(24, 212, 6) : moonSVG(24, 212, 7)) + txt(40, 216, "stomata open by " + d.sto, "cc-ts");
    if (d.path) h += txt(310, 216, d.path + " design", "cc-tb", "end");
    pv.innerHTML = h;
    pv.setAttribute("aria-label", "Live leaf diagram. " + KEYS.map(function(k){ return T.inputs[k].label + ": " + (d[k] ? optText(k, d[k]) : "not chosen"); }).join(". ") + (d.loc === "bs" ? ". A ring of bundle-sheath cells surrounds the vein." : "") + ".");
  }
  function parse(k){ var p = k.split("-"); return { path:p[0], enz:p[1], loc:p[2], sto:p[3], reg:p[4] }; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      inp.innerHTML = '<div class="cc-tin">' + KEYS.map(function(k){ return '<div id="cc-ti-' + k + '"></div>'; }).join("") + "</div>";
      KEYS.forEach(function(k){
        var I = T.inputs[k];
        radios($("#cc-ti-" + k), { label:I.label, cls:"chips", options:I.options.map(function(o){ return { id:o[0], t:o[1] }; }), value:a.S[k] || null, onChange:function(v){ a.S[k] = v; a.save(); draw(); a.update(); } });
      });
      pv.innerHTML = '<div class="cc-tpvw"><h4>Your plant</h4><svg id="cc-tpv" viewBox="0 0 320 230" role="img" focusable="false"></svg></div>';
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"); if (!g || MV.taskState().found.length < 3) return;
        var ps = g.querySelectorAll("p"); if (ps[1] && T.more) ps[1].innerHTML = ps[1].innerHTML.replace(T.more, "You’ve found all three answers.");
      }, 0); });
    },
    read:read,
    valid:function(d){ return KEYS.every(function(k){ return d[k]; }) ? true : "Choose an answer for every input first: pathway, first enzyme, Calvin cycle location, stomata and region."; },
    checks:checks,
    key:function(d){ return KEYS.map(function(k){ return d[k]; }).join("-"); },
    label:function(k){ var q = parse(k); return q.path + ", " + optText("enz", q.enz).toLowerCase().replace("pep", "PEP") + ", " + optText("loc", q.loc).toLowerCase() + ", " + q.sto + ", " + optText("reg", q.reg).toLowerCase().replace("ontario", "Ontario"); },
    text:function(k){ var q = parse(k); return q.path + " / " + optText("enz", q.enz) + " / " + optText("loc", q.loc) + " / " + q.sto + " / " + optText("reg", q.reg); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ probs:probs },
  task:task,
  onShow:function(v){ if (v === "explore" && EXR) EXR(); }
});
})();
