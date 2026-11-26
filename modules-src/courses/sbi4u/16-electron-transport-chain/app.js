// SBI4U 16 The electron transport chain: hero (electron staircase), Electron staircase (S4 membrane simulator with complexes
// I–IV, Q and cytochrome c, plus an energy-staircase SVG that shares its step state; modes Follow one pair / Steady flow /
// Poisons lab), "Why oxygen?" (electronegativity ladder, oxygen-electrode trace, CO case), The electron route (route builder
// with a distractor tile), Poison detective (chips), "Six pairs, one gradient" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small SVG helpers (from SBI4U 12 / 09) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function lp(a, b, t){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function sm(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "et-t", "text-anchor":anchor || null }, s); }
function opA(o){ if (o == null || o >= 0.99) return ""; return ' opacity="' + f1(clamp(o, 0, 1) * 100) / 100 + '"'; }
function pts(list){ return list.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "); }
function pathD(list){ return list.map(function(p, i){ return (i ? "L" : "M") + f1(p[0]) + " " + f1(p[1]); }).join(" "); }
function polyAt(list, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < list.length; i++) { var l = Math.hypot(list[i][0] - list[i - 1][0], list[i][1] - list[i - 1][1]); segs.push(l); tot += l; }
  if (!segs.length) return list[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return lp(list[i], list[i + 1], k); } d -= segs[i]; }
  return list[list.length - 1];
}
function head(a, b, cls, s){ var L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L; s = s || 6;
  return sv("path", { d:"M" + f1(b[0] - ux * s - uy * s * 0.6) + " " + f1(b[1] - uy * s + ux * s * 0.6) + " L" + f1(b[0]) + " " + f1(b[1]) + " L" + f1(b[0] - ux * s + uy * s * 0.6) + " " + f1(b[1] - uy * s - ux * s * 0.6), "class":cls }); }
function eDots(p, o){ return o != null && o <= 0.02 ? "" : "<g" + opA(o) + ">" + sv("circle", { cx:p[0] - 5.5, cy:p[1], r:5, "class":"et-e" }) + sv("circle", { cx:p[0] + 5.5, cy:p[1], r:5, "class":"et-e" }) + "</g>"; }
function hDot(p, o, r){ return o != null && o <= 0.02 ? "" : sv("circle", { cx:p[0], cy:p[1], r:r || 5, "class":"et-h", opacity:o == null || o >= 0.99 ? null : f1(o * 100) / 100 }); }
function pill(p, w, label, cls, o, tcls){ return "<g" + opA(o) + ">" + sv("rect", { x:p[0] - w / 2, y:p[1] - 12, width:w, height:24, rx:12, "class":cls }) + txt(p[0], p[1] + 4.6, label, tcls || "et-pt", "middle") + "</g>"; }
function o2num(v){ return String(Math.round(v * 2) / 2); }

// ---------- @component radioGroup (copied from SBI4U 12 / 09 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), disable(bool)}
function radios(host, o){
  var val = o.value == null ? null : String(o.value), off = false;
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, tab = on || (!any && i === firstFree()) ? 0 : -1, dis = x.dis || off; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length || off) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ var v = id == null ? null : String(id); if (v !== val) { val = v; paint(); } }, get:function(){ return val; }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}

// ---------- @component S4 membraneSim — mitochondrial inner membrane (course plan S4; adapted from SBI4U 05 / 12): intermembrane
// space above, matrix below; complexes I–IV, ubiquinone (Q) in the membrane, cytochrome c on the intermembrane face, O₂ at
// complex IV, H⁺ pump channels, donor pills, loaded / empty carriers, blocked complexes hatched and labelled "Blocked". ----------
var W = 520, HH = 330, MT = 118, MB = 178;
var CX = { I:{ x:40, y:84, w:72, h:128, c:76 }, II:{ x:140, y:126, w:54, h:86, c:167 }, III:{ x:248, y:84, w:64, h:128, c:280 }, IV:{ x:376, y:84, w:60, h:128, c:406 } };
var SEAT = { nd:[76, 262], fd:[167, 262], I:[76, 148], II:[167, 160], Q:[214, 148], III:[280, 148], c:[344, 104], IV:[406, 148], O2:[478, 252] };
var ROUTE = { n:["nd", "I", "Q", "III", "c", "IV", "O2"], f:["fd", "II", "Q", "III", "c", "IV", "O2"] };
var PUMP = { I:{ x:56, n:4, i:0 }, III:{ x:262, n:4, i:1 }, IV:{ x:390, n:2, i:2 } };
var OUT = { I:70, III:40, IV:110 };                 // model energy released on the move OUT of a pumping complex (kJ/mol)
var STN = { nd:"NADH", fd:"FADH₂", I:"complex I", II:"complex II", Q:"ubiquinone (Q)", III:"complex III", c:"cytochrome <i>c</i>", IV:"complex IV", O2:"O₂" };
var DON = { n:"NADH", f:"FADH₂" }, EMPTYN = { n:"NAD⁺", f:"FAD" };
var HDOTS = (function(){
  var r = MV.bio.rng("et-ims-h"), out = [], n = 0;
  while (out.length < 60 && n++ < 3000) {
    var x = r.range(130, 508), y = r.range(32, 76);
    if (x > 470 && y < 30) continue;
    if (out.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < 11; })) continue;
    out.push([x, y]);
  }
  return out;
})();
function routePts(r){ return ROUTE[r].map(function(k){ return SEAT[k]; }); }
// o: {donors:{n:{on, cnt}, f:{on, cnt}}, load:{I, II, Q, III, c, IV}, pair:[x,y], pumps:[{id, k}], o2:{none, pct, water, hk},
//     blk:{rot, cn, noc}, flow:{n, f}, hc:null|number, hcLab, still:bool}
function memSVG(o){
  var h = "", blk = o.blk || {}, L = o.load || {};
  h += '<defs><pattern id="et-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" class="et-hbg"/><line x1="0" y1="0" x2="0" y2="7" class="et-hl"/></pattern></defs>';
  h += sv("rect", { x:0, y:0, width:W, height:MT, "class":"et-ims" }) + sv("rect", { x:0, y:MT, width:W, height:MB - MT, "class":"et-memb" }) + sv("rect", { x:0, y:MB, width:W, height:HH - MB, "class":"et-mat" });
  h += sv("path", { d:"M0 " + MT + " H" + W + " M0 " + MB + " H" + W, "class":"et-mline" });
  h += txt(8, 20, "intermembrane space", "et-ts et-b") + txt(8, 322, "matrix", "et-ts et-b") + txt(514, 142, "inner", "et-ts", "end") + txt(514, 157, "membrane", "et-ts", "end");
  // H⁺ counter (toggle)
  if (o.hc != null) {
    var nh = Math.min(o.hc, HDOTS.length);
    for (var i = 0; i < nh; i++) h += hDot(HDOTS[i], null, 3.6);
    h += txt(512, 20, (o.hcLab || "H⁺ pumped") + ": " + o.hc + (o.hc > HDOTS.length ? " (dots show " + HDOTS.length + ")" : ""), "et-ts et-b et-halo", "end");
  }
  // pump channels (faint)
  Object.keys(PUMP).forEach(function(id){ var x = PUMP[id].x; h += sv("line", { x1:x, y1:216, x2:x, y2:70, "class":"et-ch0" }) + head([x, 90], [x, 70], "et-ch0h", 5); });
  // complexes
  ["I", "II", "III", "IV"].forEach(function(id){
    var c = CX[id], cls = "et-cx" + (L[id] ? " et-cxl" : "");
    h += sv("rect", { x:c.x, y:c.y, width:c.w, height:c.h, rx:14, "class":cls }) + txt(c.c + (id === "II" ? 0 : 8), 201, id, "et-cxn", "middle");
  });
  // mobile carriers
  h += sv("circle", { cx:SEAT.Q[0], cy:SEAT.Q[1], r:13, "class":"et-mob" + (L.Q ? " et-mobl" : "") }) + txt(SEAT.Q[0], SEAT.Q[1] - 17, "Q", "et-ml", "middle");
  if (blk.noc) h += sv("circle", { cx:SEAT.c[0], cy:SEAT.c[1], r:12, "class":"et-miss" }) + txt(SEAT.c[0], SEAT.c[1] - 18, "no cyt c", "et-ml et-halo", "middle");
  else h += sv("circle", { cx:SEAT.c[0], cy:SEAT.c[1], r:12, "class":"et-mob" + (L.c ? " et-mobl" : "") }) + '<text x="' + SEAT.c[0] + '" y="' + (SEAT.c[1] - 17) + '" text-anchor="middle" class="et-ml">cyt <tspan font-style="italic">c</tspan></text>';
  // the route (faint guide)
  h += sv("polyline", { points:pts(routePts("n")), "class":"et-guide" }) + sv("polyline", { points:pts([SEAT.fd, SEAT.II, SEAT.Q]), "class":"et-guide" });
  // blocked complexes
  function block(id, word){ var c = CX[id]; h += sv("rect", { x:c.x, y:c.y, width:c.w, height:c.h, rx:14, "class":"et-blkx" }) + txt(c.c, c.y - 6, word, "et-blkt et-halo", "middle"); }
  if (blk.rot) block("I", "Blocked");
  if (blk.cn) block("IV", "Blocked");
  // loaded carriers: an electron pair sitting in each
  ["I", "II", "Q", "III", "c", "IV"].forEach(function(k){ if (L[k] && !(k === "c" && blk.noc)) h += eDots(SEAT[k]); });
  // donors
  ["n", "f"].forEach(function(r){
    var d = (o.donors || {})[r] || {}, p = SEAT[r === "n" ? "nd" : "fd"], w = r === "n" ? 58 : 64;
    if (d.on) h += pill(p, w, DON[r], r === "n" ? "et-pn" : "et-pf");
    else h += pill(p, w, EMPTYN[r], r === "n" ? "et-pn0" : "et-pf0", null, r === "n" ? "et-ptn" : "et-ptf");
    if (d.stuck) h += txt(p[0], p[1] + 30, "can’t unload", "et-dn et-halo", "middle");
    else if (d.cnt > 1) h += txt(p[0], p[1] + 30, "×" + d.cnt, "et-dn", "middle");
  });
  // O₂
  var O = o.o2 || {};
  if (O.none) h += pill(SEAT.O2, 60, "no O₂", "et-o2x", null, "et-ptx");
  else if (O.water) h += pill(SEAT.O2, 56, "H₂O", "et-o2");
  else h += pill(SEAT.O2, 56, O.pct != null && O.pct < 100 ? "O₂ " + O.pct + "%" : "½O₂", "et-o2");
  if (O.water2) h += pill([SEAT.O2[0], SEAT.O2[1] + 34], 52, "H₂O", "et-o2");
  if (O.hk > 0 && O.hk < 1) { h += hDot(lp([452, 318], [SEAT.O2[0] - 8, SEAT.O2[1] + 4], sm(O.hk))) + hDot(lp([506, 318], [SEAT.O2[0] + 8, SEAT.O2[1] + 4], sm(O.hk))); }
  // steady flow: moving pairs and pumps (SMIL; static with reduced motion)
  if (o.flow) h += flowSVG(o.flow);
  // the followed pair and pump pops
  (o.pumps || []).forEach(function(pp){ h += pumpPop(pp.id, pp.k); });
  if (o.pair) h += eDots(o.pair);
  return h;
}
function pumpPop(id, k){
  if (!(k > 0)) return "";
  var P = PUMP[id], x = P.x, y = lerp(222, 62, sm(seg(k, 0, 0.75))), fade = 1 - seg(k, 0.85, 1);
  return '<g class="et-pop">' + sv("line", { x1:x, y1:216, x2:x, y2:70, "class":"et-chon" }) + hDot([x - 4, y], fade) + hDot([x + 4, y + 9], fade) + (k > 0.5 ? txt(x + 2, 58, "+" + P.n + " H⁺", "et-hp et-halo", "middle") : "") + "</g>";
}
// flow: {n:bool, f:bool, pumps:{I, III, IV}}
function flowSVG(fl){
  var h = "", still = MV.reduceMotion;
  ["n", "f"].forEach(function(r){
    if (!fl[r]) return;
    var P = routePts(r), d = pathD(P);
    for (var j = 0; j < 3; j++) {
      if (still) { if (j === 0) h += eDots(polyAt(P, r === "n" ? 0.42 : 0.6)); continue; }
      h += '<g class="et-mv">' + sv("circle", { cx:-5.5, cy:0, r:5, "class":"et-e" }) + sv("circle", { cx:5.5, cy:0, r:5, "class":"et-e" }) + '<animateMotion dur="3.6s" repeatCount="indefinite" begin="' + f1(-1.2 * j - (r === "f" ? 0.6 : 0)) + 's" path="' + d + '"/></g>';
    }
  });
  Object.keys(fl.pumps || {}).forEach(function(id){
    if (!fl.pumps[id]) return;
    var x = PUMP[id].x;
    h += sv("line", { x1:x, y1:216, x2:x, y2:70, "class":"et-chon" });
    if (still) { h += hDot([x, 64]) + txt(x + 2, 52, "+" + PUMP[id].n + " H⁺", "et-hp et-halo", "middle"); return; }
    for (var j = 0; j < 2; j++) h += '<circle cx="' + x + '" cy="216" r="5" class="et-h"><animate attributeName="cy" values="216;64" dur="1.8s" repeatCount="indefinite" begin="' + f1(-0.9 * j) + 's"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;0.8;1" dur="1.8s" repeatCount="indefinite" begin="' + f1(-0.9 * j) + 's"/></circle>';
    h += txt(x + 2, 52, "+" + PUMP[id].n + " H⁺", "et-hp et-halo", "middle");
  });
  return h;
}

// ---------- energy staircase (module-specific SVG beside S4, sharing its step state; viewBox 300 × 330) ----------
var LV = { nd:40, I:47, Q:123, III:130, c:170, IV:177, O2:300, fd:104, II:104 };
var TX = { nd:[34, 70], I:[70, 106], Q:[106, 142], III:[142, 178], c:[178, 214], IV:[214, 250], O2:[250, 292], fd:[72, 100], II:[72, 100] };
function tpt(id){ var t = TX[id]; return [(t[0] + t[1]) / 2, LV[id] - 9]; }
function stairRoute(r){ return ROUTE[r].map(tpt); }
// o: {pair:[x,y], lit:{I, III, IV}, stop:{at:"I"|"III"|"IV", word}, flow:{n, f}}
function stairSVG(o){
  var h = "", lit = o.lit || {};
  h += txt(6, 16, "Energy staircase", "et-ts et-b") + txt(6, 30, "model values, kJ/mol", "et-ts");
  h += sv("line", { x1:16, y1:44, x2:16, y2:296, "class":"et-ax" }) + head([16, 280], [16, 298], "et-axh", 6);
  h += '<text class="et-ts" transform="rotate(-90 11 200)" x="11" y="200" text-anchor="middle">lower energy</text>';
  var main = ["nd", "I", "Q", "III", "c", "IV", "O2"], d = "";
  main.forEach(function(k, i){ var t = TX[k]; d += (i ? " L" : "M") + t[0] + " " + LV[k] + " L" + t[1] + " " + LV[k]; });
  h += sv("path", { d:d, "class":"et-stair" });
  h += sv("path", { d:"M" + TX.fd[0] + " " + LV.fd + " L" + TX.fd[1] + " " + LV.fd, "class":"et-stair" }) + sv("path", { d:"M" + TX.fd[1] + " " + LV.fd + " L" + TX.Q[0] + " " + LV.Q, "class":"et-stairf" });
  var LAB = { nd:"NADH", I:"I", Q:"Q", III:"III", IV:"IV", O2:"O₂" };
  Object.keys(LAB).forEach(function(k){ var t = TX[k]; h += txt((t[0] + t[1]) / 2, LV[k] + 15, LAB[k], "et-sl" + (k === "nd" ? " et-sln" : k === "O2" ? " et-slo" : ""), "middle"); });
  h += '<text x="196" y="' + (LV.c + 15) + '" text-anchor="middle" class="et-sl">cyt <tspan font-style="italic">c</tspan></text>';
  h += txt(68, LV.fd + 4, "FADH₂", "et-sl et-slf", "end");
  // drops
  h += txt(110, 78, "I ≈ 70", "et-dl" + (lit.I ? " on" : "")) + txt(110, 93, "4 H⁺ pumped", "et-hp2" + (lit.I ? " on" : ""));
  h += txt(184, 145, "III ≈ 40", "et-dl" + (lit.III ? " on" : "")) + txt(184, 159, "4 H⁺", "et-hp2" + (lit.III ? " on" : ""));
  h += txt(244, 226, "IV ≈ 110", "et-dl" + (lit.IV ? " on" : ""), "end") + txt(244, 241, "2 H⁺ pumped", "et-hp2" + (lit.IV ? " on" : ""), "end");
  h += txt(30, 266, "FADH₂ → Q:", "et-ts") + txt(30, 281, "too small to pump", "et-ts");
  if (o.stop) {
    var S = { I:[106, 64, 98, 84, "end"], III:[178, 150, 172, 160, "end"], IV:[250, 258, 240, 276, "end"], c:[178, 150, 172, 160, "end"] }[o.stop.at];
    h += sv("path", { d:"M" + (S[0] - 7) + " " + (S[1] - 7) + " L" + (S[0] + 7) + " " + (S[1] + 7) + " M" + (S[0] + 7) + " " + (S[1] - 7) + " L" + (S[0] - 7) + " " + (S[1] + 7), "class":"et-x" }) + txt(S[2], S[3], o.stop.word, "et-blkt et-halo", S[4]);
  }
  if (o.flow) ["n", "f"].forEach(function(r){
    if (!o.flow[r]) return;
    var P = stairRoute(r);
    if (MV.reduceMotion) { h += eDots(polyAt(P, 0.5)); return; }
    for (var j = 0; j < 2; j++) h += '<g>' + sv("circle", { cx:-5.5, cy:0, r:5, "class":"et-e" }) + sv("circle", { cx:5.5, cy:0, r:5, "class":"et-e" }) + '<animateMotion dur="3.6s" repeatCount="indefinite" begin="' + f1(-1.8 * j - (r === "f" ? 0.9 : 0)) + 's" path="' + pathD(P) + '"/></g>';
  });
  if (o.loaded) o.loaded.forEach(function(k){ h += eDots(tpt(k)); });
  if (o.pair) h += eDots(o.pair);
  return h;
}

// ---------- Explore: Electron staircase ----------
function snap0(){ return { i:0, s:0, h:[0, 0, 0], w:0, nad:0, fad:0, e:0 }; }
function cloneSnap(x){ return { i:x.i, s:x.s, h:x.h.slice(), w:x.w, nad:x.nad, fad:x.fad, e:x.e }; }
// next move of the followed pair, or null when there is nothing to move; {blocked:"o2"} when O₂ is absent at complex IV
function moveOf(fo, x){
  var i = x.i, s = x.s;
  if (s === 6) { if (i + 1 >= fo.fed.length) return null; i++; s = 0; }
  if (i >= fo.fed.length) return null;
  var m = { i:i, s:s, r:fo.fed[i] };
  if (s === 5 && !fo.o2) m.blocked = "o2";
  return m;
}
function applyMove(x, m){
  var y = cloneSnap(x), from = ROUTE[m.r][m.s];
  y.i = m.i; y.s = m.s + 1;
  if (m.s === 0) { if (m.r === "n") y.nad++; else y.fad++; }
  if (OUT[from]) { y.h[PUMP[from].i] += PUMP[from].n; y.e += OUT[from]; }
  if (y.s === 6) y.w++;
  return y;
}
function started(fo, x){ return !fo.fed.length ? 0 : x.s === 0 ? x.i : x.i + 1; }
function hsum(h){ return h[0] + h[1] + h[2]; }
function hBreak(h){ return hsum(h) + " (I: " + h[0] + " · III: " + h[1] + " · IV: " + h[2] + ")"; }
function eText(v){ return v ? "≈ " + v + " kJ/mol" : "0 kJ/mol"; }
// steady flow / poisons lab: one tick of the model (course plan: pairs per tick = feed × O₂ supply ÷ 100%, rounded down)
function steady(st, blk){
  blk = blk || {};
  var openN = !blk.rot && !blk.cn && !blk.noc, openF = !blk.cn && !blk.noc;
  var F = (openN ? st.n : 0) + (openF ? st.f : 0), raw = F * st.o2 / 100, P = Math.floor(raw + 1e-9);
  var pn = Math.min(openN ? st.n : 0, P), pf = P - pn;
  return { F:F, raw:raw, P:P, pn:pn, pf:pf, openN:openN, openF:openF, h:[4 * pn, 4 * P, 2 * P], o2:P / 2, w:P, e:220 * pn + 150 * pf };
}

var EXP = null;
function explore(host, api){
  var C = api.content, S = api.S, FB = C.fb;
  var D0 = { mode:"follow", fo:{ fed:[], hist:[snap0()], o2:true }, st:{ n:0, f:0, o2:100 }, po:{ n:0, f:0, o2:100, rot:false, cn:false, noc:false }, show:{ stair:true, hc:false }, seen:{} };
  Object.keys(D0).forEach(function(k){ if (S[k] === undefined) S[k] = JSON.parse(JSON.stringify(D0[k])); });
  if (!S.fo.hist || !S.fo.hist.length) S.fo.hist = [snap0()];
  var cap = "", more = false, playing = false, bannerMine = false;
  var A = { cancel:null, finish:null };
  function busy(){ return !!A.finish; }
  function runAnim(dur, step, done){
    var fin = false;
    function end(){ if (fin) return; fin = true; A.cancel = null; A.finish = null; step(1); if (done) done(); else syncCtrl(); }
    A.finish = end;
    A.cancel = MV.tween({ dur:dur, ease:lin, step:step, done:end });
    syncCtrl();
  }
  function stopAll(){ playing = false; var n = 0; while (A.finish && n++ < 20) { if (A.cancel) A.cancel(); A.finish(); } }

  host.innerHTML = '<div class="et-top" id="et-mode"></div>' +
    '<div class="et-pg"><div class="et-scene" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="et-figs"><div class="et-memw"><svg id="et-svg" viewBox="0 0 ' + W + " " + HH + '" role="img" focusable="false"></svg></div>' +
        '<div class="et-stw" id="et-stw"><svg id="et-st" viewBox="0 0 300 330" role="img" focusable="false"></svg></div></div>' +
      '<p class="et-queue" id="et-queue"></p><div class="et-gauges" id="et-gauges" hidden></div>' +
      '<p class="et-legend tiny"><span><i class="et-ld et-ld-e" aria-hidden="true"></i><i class="et-ld et-ld-e" aria-hidden="true"></i>electron pair</span><span><i class="et-ld et-ld-h" aria-hidden="true"></i>H⁺</span><span><i class="et-lk et-lk-n" aria-hidden="true"></i>NADH</span><span><i class="et-lk et-lk-f" aria-hidden="true"></i>FADH₂</span><span><i class="et-lk et-lk-o" aria-hidden="true"></i>O₂ / H₂O</span><span>outline pill = empty carrier (NAD⁺, FAD)</span><span>tinted complex with a pair inside = loaded</span></p>' +
      '<p class="et-cap" id="et-cap" aria-live="polite"></p></div>' +
    '<div class="et-ctrl"><div id="et-cf">' +
        '<div class="et-row"><button type="button" class="btn ghost sm" data-feed="n" data-k="etfn">+ NADH</button><button type="button" class="btn ghost sm" data-feed="f" data-k="etff">+ FADH₂</button><button type="button" class="btn ghost sm" id="et-reset" data-k="etreset">Reset</button></div>' +
        '<p class="tiny muted et-note1">Each press adds one electron pair (up to 12 waiting).</p><div id="et-o2f"></div>' +
        '<div class="et-row et-steps" id="et-steps" role="group" aria-label="Step through the chain (← and → keys work too)"><button type="button" class="btn ghost sm" id="et-back" data-k="etback">← Back</button><button type="button" class="btn primary sm" id="et-step" data-k="etstep">Step →</button><button type="button" class="btn ghost sm" id="et-play" data-k="etplay">Play</button></div>' +
        '<p class="tiny et-why" id="et-why" aria-live="polite"></p></div>' +
      '<div id="et-cs" hidden><div class="et-row"><button type="button" class="btn ghost sm" data-sfeed="n" data-k="etsn">+ NADH</button><button type="button" class="btn ghost sm" data-sfeed="f" data-k="etsf">+ FADH₂</button><button type="button" class="btn ghost sm" id="et-clear" data-k="etclear">Clear feed</button></div>' +
        '<p class="tiny muted et-note1">Each press adds one pair per tick to a steady feed (up to 4 pairs per tick).</p>' +
        '<label class="slider et-sl"><span class="slider-top"><span>O₂ supply</span><output id="et-o2-out" for="et-o2"></output></span><input type="range" id="et-o2" min="0" max="100" step="25"></label>' +
        '<fieldset class="et-blk" id="et-blk"><legend>Blockers (any combination)</legend>' + C.blockers.map(function(b){ return '<label class="et-chk"><input type="checkbox" data-blk="' + b.id + '"> <span><strong>' + b.t + '</strong> <span class="tiny muted">(' + b.what + ")</span></span></label>"; }).join("") + "</fieldset></div>" +
      '<div class="et-tog"><label class="et-chk"><input type="checkbox" id="et-shst"> Show energy staircase</label><label class="et-chk"><input type="checkbox" id="et-shhc"> Show H⁺ counter</label></div></div>' +
    '<div class="et-read"><div id="et-read"></div><button type="button" class="btn ghost sm et-morebtn" id="et-more" aria-expanded="false" data-k="etmore">More readouts</button>' +
      '<p class="tiny muted et-mnote"><span class="bio-model">Model</span> ' + C.modelNote + '</p><p class="et-aha" id="et-aha" hidden><strong>The big idea:</strong> ' + C.aha + "</p></div></div>";
  var svg = $("#et-svg", host), stsvg = $("#et-st", host);

  var modeR = radios($("#et-mode", host), { label:"Mode", options:[{ id:"follow", t:C.modes.follow }, { id:"steady", t:C.modes.steady }, { id:"poison", t:C.modes.poison }], value:S.mode,
    onChange:function(v){ stopAll(); S.mode = v; cap = ""; api.save(); paint(); MV.changed(); } });
  var o2R = radios($("#et-o2f", host), { label:"O₂", options:[{ id:"y", t:"Present" }, { id:"n", t:"Absent" }], value:S.fo.o2 ? "y" : "n",
    onChange:function(v){ S.fo.o2 = v === "y"; cap = S.fo.o2 ? "O₂ present: a pair at complex IV can pass its electrons to O₂." : "O₂ absent: nothing can take the electrons from complex IV."; api.save(); paint(); MV.changed(); } });

  // ---- Follow one pair ----
  function fo(){ return S.fo; }
  function cur(){ var h = S.fo.hist; return h[h.length - 1]; }
  function waiting(){ var f = fo(), x = cur(); return f.fed.slice(started(f, x)); }
  function followState(){
    var f = fo(), x = cur(), m = moveOf(f, x), blocked = !!(m && m.blocked), n = f.fed.length;
    var allDone = n > 0 && x.w === n;
    return { x:x, m:m, blocked:blocked, n:n, allDone:allDone, canStep:!!m && !blocked };
  }
  function followOpts(x, hideCur){
    var f = fo(), fs = followState(), wt = f.fed.slice(started(f, x)), r = x.i < f.fed.length ? f.fed[x.i] : null;
    var nW = wt.filter(function(v){ return v === "n"; }).length, fW = wt.length - nW;
    var o = { donors:{ n:{ on:nW > 0, cnt:nW, stuck:fs.blocked && nW > 0 }, f:{ on:fW > 0, cnt:fW, stuck:fs.blocked && fW > 0 } }, load:{}, o2:{ none:!f.o2, water:x.s === 6 && f.o2 }, blk:{} };
    if (r && x.s >= 1 && x.s <= 5 && !hideCur) o.pair = SEAT[ROUTE[r][x.s]];
    if (r && x.s === 0 && !hideCur) o.donors[r].on = true;
    if (fs.blocked && x === cur()) {
      // backed up: every carrier before complex IV shows loaded
      o.load = { Q:true, III:true, c:true };
      if (f.fed.indexOf("n") >= 0) o.load.I = true;
      if (f.fed.indexOf("f") >= 0) o.load.II = true;
    }
    if (S.show.hc) { o.hc = hsum(x.h); o.hcLab = "H⁺ pumped"; }
    return o;
  }
  function stairFollow(x, extra){
    var f = fo(), fs = followState(), r = x.i < f.fed.length ? f.fed[x.i] : null, o = extra || {};
    if (!o.pair && r && x.s <= 5 && !o.hide) o.pair = tpt(ROUTE[r][x.s]);
    if (fs.blocked && x === cur()) { o.stop = { at:"IV", word:"No O₂" }; o.loaded = ["Q", "III", "c"].concat(f.fed.indexOf("n") >= 0 ? ["I"] : []).concat(f.fed.indexOf("f") >= 0 ? ["fd"] : []); }
    if (!o.lit && r && x.s >= 2) { o.lit = {}; ROUTE[r].slice(0, x.s).forEach(function(k){ if (OUT[k]) o.lit[k] = true; }); }
    return o;
  }
  function drawFollow(){
    var x = cur();
    svg.innerHTML = memSVG(followOpts(x));
    stsvg.innerHTML = stairSVG(stairFollow(x));
  }
  function animMove(m, done){
    var x = cur(), y = applyMove(x, m), from = ROUTE[m.r][m.s], to = ROUTE[m.r][m.s + 1];
    var a = SEAT[from], b = SEAT[to], sa = tpt(from), sb = tpt(to), pump = OUT[from] ? from : null;
    var base = followOpts(x, true);
    if (m.s === 0) base.donors[m.r].on = waiting().filter(function(v){ return v === m.r; }).length > 1;
    if (x.s === 6) base.o2.water = false;
    var lit = {}; ROUTE[m.r].slice(0, m.s).forEach(function(k){ if (OUT[k]) lit[k] = true; });
    var fast = playing && m.i > 0 ? 0.4 : 1;
    runAnim(MV.reduceMotion ? 0 : (to === "O2" ? 1300 : 750) * fast, function(k){
      var o = JSON.parse(JSON.stringify(base)), km = sm(seg(k, 0, to === "O2" ? 0.55 : 0.8));
      if (m.s === 0) o.donors[m.r].on = o.donors[m.r].on || k < 0.25;
      o.pair = lp(a, b, km);
      if (pump) o.pumps = [{ id:pump, k:seg(k, 0.15, 1) }];
      if (to === "O2") { o.o2 = { hk:seg(k, 0.45, 0.85), water:k >= 0.9 }; if (k >= 0.9) o.pair = null; }
      if (S.show.hc) o.hc = hsum(k >= 0.5 ? y.h : x.h);
      svg.innerHTML = memSVG(o);
      var L2 = JSON.parse(JSON.stringify(lit)); if (pump && k > 0.3) L2[pump] = true;
      stsvg.innerHTML = stairSVG({ pair:lp(sa, sb, km), lit:L2 });
    }, function(){
      S.fo.hist.push(y); if (S.fo.hist.length > 300) S.fo.hist.splice(1, 1);
      if (pump) S.seen.pump = true;
      if (to === "O2") S.seen.o2 = true;
      api.save(); MV.changed(); paint();
      if (done) done();
    });
  }
  function stepOnce(done){
    var fs = followState();
    if (!fs.m) { cap = fo().fed.length ? "Every pair has reached O₂. Feed another pair, or press Reset." : "Feed the chain first: press + NADH or + FADH₂."; paint(); if (done) done(false); return; }
    if (fs.blocked) { S.seen.block = true; api.save(); cap = "Nothing can move: with no O₂, complex IV can’t pass its electrons on, so every carrier before it stays loaded and the next pair can’t unload."; paint(); if (done) done(false); return; }
    var m = fs.m, from = ROUTE[m.r][m.s], to = ROUTE[m.r][m.s + 1];
    cap = moveCap(m, from, to);
    animMove(m, function(){ if (done) done(true); });
  }
  function moveCap(m, from, to){
    var who = "Pair " + (m.i + 1) + " (" + DON[m.r] + ")";
    if (m.s === 0) return who + " unloads at " + STN[to] + ": " + DON[m.r] + " becomes " + EMPTYN[m.r] + ", an empty carrier that goes back for more.";
    if (from === "I") return who + ": complex I passes the electrons to Q, and the energy released (≈ 70 kJ/mol) pumps 4 H⁺ into the intermembrane space.";
    if (from === "II") return who + ": complex II passes the electrons to Q. The step is too small to pump any H⁺.";
    if (from === "Q") return who + ": Q carries the electrons through the membrane to complex III.";
    if (from === "III") return who + ": complex III passes the electrons to cytochrome <i>c</i>, pumping 4 H⁺ (≈ 40 kJ/mol).";
    if (from === "c") return who + ": cytochrome <i>c</i> carries the electrons to complex IV.";
    if (from === "IV") return who + ": complex IV hands the electrons to O₂, the final acceptor, pumping 2 H⁺ (≈ 110 kJ/mol, the biggest step). ½O₂ + 2e⁻ + 2H⁺ → H₂O.";
    return who + " moves on.";
  }
  function play(done){
    if (playing) return;
    playing = true; syncCtrl();
    (function next(){
      if (!playing) { syncCtrl(); if (done) done(); return; }
      stepOnce(function(moved){
        if (!moved || !followState().canStep) { playing = false; syncCtrl(); if (done) done(); return; }
        MV.wait(MV.reduceMotion ? 0 : cur().i > 0 ? 100 : 250, next);
      });
    })();
  }
  function back(){
    var h = S.fo.hist; if (h.length <= 1) return;
    h.pop(); cap = "Back one step."; api.save(); paint(); MV.changed();
  }
  function feedFollow(r){
    if (waiting().length >= 12) { cap = "Up to 12 pairs can wait. Step them through the chain, or press Reset."; paint(); return; }
    S.fo.fed.push(r); cap = "+ " + DON[r] + ": " + waiting().length + " pair" + (waiting().length === 1 ? "" : "s") + " waiting. Press Step or Play."; api.save(); paint(); MV.changed();
  }
  function resetFollow(){ S.fo.fed = []; S.fo.hist = [snap0()]; cap = "Reset: no pairs fed, and every counter is back to 0."; api.save(); paint(); MV.changed(); }

  // ---- Steady flow and Poisons lab ----
  function sst(){ return S.mode === "poison" ? S.po : S.st; }
  function sblk(){ return S.mode === "poison" ? S.po : {}; }
  function feedSteady(r){
    var st = sst();
    if (st.n + st.f >= 4) { cap = "The feed is at its maximum: 4 pairs per tick. Press Clear feed to start again."; paint(); return; }
    st[r]++; cap = "+ " + DON[r] + ": the feed is now " + feedText(st) + "."; api.save(); paint(); MV.changed();
  }
  function feedText(st){ if (!st.n && !st.f) return "empty"; var p = []; if (st.n) p.push(st.n + " NADH"); if (st.f) p.push(st.f + " FADH₂"); return p.join(" + ") + " pair" + (st.n + st.f === 1 ? "" : "s") + " per tick"; }
  function steadyStatus(st, b, R){
    if (!st.n && !st.f) return "Idle: no electrons fed";
    if (b.noc) return "Backed up at complex III (no cytochrome <i>c</i>): Q and III loaded, complex IV empty, O₂ unused";
    if (b.cn || st.o2 === 0) return "Backed up before complex IV: carriers loaded, O₂ unused";
    if (b.rot && !st.f) return "Backed up at complex I (blocked): NADH can’t unload, O₂ unused";
    if (R.P === 0) return "Backed up: too little O₂ for a whole pair this tick";
    if (b.rot && st.n) return "NADH backed up at complex I (blocked); FADH₂ flowing";
    if (R.P < R.F) return "Partly backed up: the O₂ supply limits the flow";
    return "Flowing";
  }
  function whereText(st, b, R){
    if (!st.n && !st.f) return "No pairs fed";
    var p = [];
    function one(r, cnt, open, through){
      if (!cnt) return;
      var w;
      if (r === "n" && b.rot) w = "waiting at complex I (blocked)";
      else if (b.noc) w = "stuck at complex III (no cytochrome <i>c</i>)";
      else if (b.cn) w = "stuck at complex IV (blocked)";
      else if (st.o2 === 0) w = "stuck at complex IV (no O₂)";
      else if (through >= cnt) w = "reaching O₂";
      else if (through > 0) w = through + " of " + cnt + " reaching O₂";
      else w = "waiting (not enough O₂)";
      p.push(DON[r] + ": " + w);
    }
    one("n", st.n, R.openN, R.pn); one("f", st.f, R.openF, R.pf);
    return p.join(" · ");
  }
  function loadSteady(st, b){
    var L = {};
    if (!st.n && !st.f) return L;
    var useN = st.n > 0, useF = st.f > 0;
    if (b.rot && useN) L.I = true;
    if (b.noc) { if (useN) L.I = true; if (useF) L.II = true; L.Q = L.III = true; }
    else if (b.cn || st.o2 === 0) { if (useN) L.I = true; if (useF) L.II = true; L.Q = L.III = L.c = L.IV = true; }
    if (b.rot && !useF) { L.Q = L.III = L.c = L.IV = false; }
    return L;
  }
  function steadyOpts(){
    var st = sst(), b = sblk(), R = steady(st, b);
    var o = { donors:{ n:{ on:st.n > 0, cnt:st.n, stuck:st.n > 0 && R.pn === 0 }, f:{ on:st.f > 0, cnt:st.f, stuck:st.f > 0 && R.pf === 0 } }, load:loadSteady(st, b),
      o2:{ none:st.o2 === 0, pct:st.o2, water2:R.P > 0 }, blk:{ rot:!!b.rot, cn:!!b.cn, noc:!!b.noc } };
    if (R.P > 0) o.flow = { n:R.pn > 0, f:R.pf > 0, pumps:{ I:R.pn > 0, III:true, IV:true } };
    if (S.show.hc) { o.hc = hsum(R.h); o.hcLab = "H⁺ pumped per tick"; }
    return { o:o, R:R, st:st, b:b };
  }
  function stairSteady(st, b, R){
    var o = { flow:R.P > 0 ? { n:R.pn > 0, f:R.pf > 0 } : null, lit:R.P > 0 ? { I:R.pn > 0, III:true, IV:true } : {} };
    if (st.n + st.f) {
      if (b.noc) o.stop = { at:"c", word:"Blocked" };
      else if (b.cn) o.stop = { at:"IV", word:"Blocked" };
      else if (st.o2 === 0) o.stop = { at:"IV", word:"No O₂" };
      else if (b.rot && st.n) o.stop = { at:"I", word:"Blocked" };
      var L = loadSteady(st, b), map = { I:"I", II:"fd", Q:"Q", III:"III", c:"c", IV:"IV" };
      o.loaded = Object.keys(L).filter(function(k){ return L[k] && !(k === "c" && b.noc); }).map(function(k){ return map[k]; });
    }
    return o;
  }
  function drawSteady(){
    var z = steadyOpts();
    svg.innerHTML = memSVG(z.o);
    stsvg.innerHTML = stairSVG(stairSteady(z.st, z.b, z.R));
  }
  function gauges(R){
    var o2w = clamp(R.o2 / 2, 0, 1) * 100, hw = clamp(hsum(R.h) / 40, 0, 1) * 100;
    return '<div class="et-gauge"><span class="et-mlab">O₂ use per tick</span><span class="et-mbar et-mbar-o" role="img" aria-label="O₂-use m&#101;ter: ' + o2num(R.o2) + ' O₂ per tick"><i style="width:' + f1(o2w) + '%"></i></span><b>' + o2num(R.o2) + "</b></div>" +
      '<div class="et-gauge"><span class="et-mlab">H⁺ pumped per tick</span><span class="et-mbar et-mbar-h" role="img" aria-label="H⁺ m&#101;ter: ' + hsum(R.h) + ' H⁺ per tick"><i style="width:' + f1(hw) + '%"></i></span><b>' + hsum(R.h) + "</b></div>";
  }
  // one FADH₂ (or NADH) pair passing in steady modes (prediction 4)
  function passOnce(r, done){
    var P = routePts(r), SP = stairRoute(r), z = steadyOpts();
    runAnim(MV.reduceMotion ? 0 : 3000, function(k){
      var o = JSON.parse(JSON.stringify(z.o)); o.flow = null;
      var u = sm(k), idx = Math.min(5, Math.floor(u * 6));
      o.pair = k < 1 ? polyAt(P, u) : null;
      o.pumps = [];
      ["I", "III", "IV"].forEach(function(id){ var j = ROUTE[r].indexOf(id); if (j >= 0) { var start = (j + 0.5) / 6; o.pumps.push({ id:id, k:seg(u, start, start + 0.3) }); } });
      if (u > 0.9) o.o2.water2 = true;
      svg.innerHTML = memSVG(o);
      stsvg.innerHTML = stairSVG({ pair:k < 1 ? polyAt(SP, u) : null, lit:{} });
      return idx;
    }, function(){ paint(); if (done) done(); });
  }

  // ---- readouts, controls, paint ----
  function rowsFollow(){
    var f = fo(), fs = followState(), x = fs.x, n = f.fed.length, r = x.i < n ? f.fed[x.i] : null;
    var nN = f.fed.filter(function(v){ return v === "n"; }).length, at;
    if (!n) at = "No pairs fed yet";
    else if (fs.blocked) at = "Pair " + (x.i + 1) + " of " + n + " (" + DON[r] + "): waiting at complex IV (no O₂)";
    else if (x.s === 0) at = "Pair " + (x.i + 1) + " of " + n + " (" + DON[r] + "): waiting to unload at " + (r === "n" ? "complex I" : "complex II");
    else if (x.s === 6) at = "Pair " + (x.i + 1) + " of " + n + " reached O₂" + (x.i + 1 < n ? "; pair " + (x.i + 2) + " waits" : "");
    else at = "Pair " + (x.i + 1) + " of " + n + " (" + DON[r] + "): " + STN[ROUTE[r][x.s]];
    var status = !n ? "Idle: no electrons fed" : fs.blocked ? "Backed up before complex IV: carriers loaded, O₂ unused" : fs.allDone ? "All " + n + " pairs reached O₂" : "Flowing";
    return [
      { k:"fed", l:"Pairs fed", v:n ? nN + " NADH, " + (n - nN) + " FADH₂ (" + waiting().length + " waiting)" : "none" },
      { k:"at", l:"Electron pair is at", v:at },
      { k:"h", l:"H⁺ pumped (total)", v:hBreak(x.h), keep:true },
      { k:"o2", l:"O₂ used", v:o2num(x.w / 2), keep:true },
      { k:"w", l:"H₂O formed", v:String(x.w) },
      { k:"cr", l:"Carriers regenerated", v:"NAD⁺: " + x.nad + " · FAD: " + x.fad },
      { k:"e", l:"Energy released so far", v:eText(x.e) },
      { k:"st", l:"Chain status", v:status, keep:true }];
  }
  function rowsSteady(){
    var st = sst(), b = sblk(), R = steady(st, b);
    var rnd = !st.n && !st.f ? "0" : (R.F < st.n + st.f ? R.F + " flowing (" + (st.n + st.f - R.F) + " blocked)" : String(R.F)) + " × " + st.o2 + "% = " + (Math.round(R.raw * 100) / 100) + (R.raw !== R.P ? " → " + R.P + " (rounded down" + (R.pn && R.pf ? "; NADH first" : "") + ")" : "");
    return [
      { k:"fed", l:"Feed", v:feedText(st) },
      { k:"p", l:"Electron pairs per tick", v:rnd },
      { k:"at", l:"Electron pairs are at", v:whereText(st, b, R) },
      { k:"h", l:"H⁺ pumped per tick", v:hBreak(R.h), keep:true },
      { k:"o2", l:"O₂ used per tick", v:o2num(R.o2), keep:true },
      { k:"w", l:"H₂O formed per tick", v:String(R.w) },
      { k:"cr", l:"Carriers regenerated per tick", v:"NAD⁺: " + R.pn + " · FAD: " + R.pf },
      { k:"e", l:"Energy released per tick", v:eText(R.e) },
      { k:"st", l:"Chain status", v:steadyStatus(st, b, R), keep:true }];
  }
  function paintRead(){
    var r = S.mode === "follow" ? rowsFollow() : rowsSteady(), box = $("#et-read", host);
    box.innerHTML = '<dl class="read et-rd' + (more ? "" : " et-col") + '" aria-live="polite">' + r.map(function(x){ return '<div class="' + (x.keep ? "et-keep" : "et-x") + '" data-row="' + x.k + '"><dt>' + x.l + "</dt><dd>" + x.v + "</dd></div>"; }).join("") + "</dl>";
    var mb = $("#et-more", host); mb.setAttribute("aria-expanded", String(more)); mb.textContent = more ? "Fewer readouts" : "More readouts";
    $("#et-aha", host).hidden = !(S.seen.pump && S.seen.o2 && S.seen.block);
  }
  $("#et-more", host).addEventListener("click", function(){ more = !more; paintRead(); });
  function aria(){
    if (S.mode === "follow") {
      var fs = followState(), x = fs.x, f = fo(), r = x.i < f.fed.length ? f.fed[x.i] : null, hs = hsum(x.h);
      var where = !f.fed.length ? "No electron pairs fed yet." : fs.blocked ? "Pair " + (x.i + 1) + " waiting at complex IV: no O₂, the chain is backed up and every carrier before complex IV is loaded." : x.s === 0 ? "Pair " + (x.i + 1) + " waiting to unload." : x.s === 6 ? "Pair " + (x.i + 1) + " has reached O₂ and formed water." : "Pair " + (x.i + 1) + " at " + MV.plain(STN[ROUTE[r][x.s]]) + ".";
      return "Inner mitochondrial membrane: intermembrane space above, matrix below, complexes I to IV, Q in the membrane, cytochrome c on the intermembrane side, O₂ " + (f.o2 ? "present" : "absent") + " at complex IV. " + where + " " + hs + " H⁺ pumped so far. " + (x.w ? "O₂ used: " + o2num(x.w / 2) + "." : "O₂ not yet used.");
    }
    var st = sst(), b = sblk(), R = steady(st, b);
    return "Inner mitochondrial membrane in " + (S.mode === "poison" ? "the poisons lab" : "steady flow") + ". Feed: " + feedText(st) + ". O₂ supply " + st.o2 + "%." + (b.rot ? " Rotenone blocks complex I." : "") + (b.cn ? " Cyanide blocks complex IV." : "") + (b.noc ? " No cytochrome c." : "") + " " + MV.plain(whereText(st, b, R)) + ". " + hsum(R.h) + " H⁺ pumped and " + o2num(R.o2) + " O₂ used per tick. Status: " + MV.plain(steadyStatus(st, b, R)) + ".";
  }
  function stairAria(){
    return "Energy staircase, model values: NADH at the top, then complex I, Q, complex III, cytochrome c, complex IV and O₂ at the bottom. Big drops at complex I (about 70 kilojoules per mole, 4 H⁺ pumped), complex III (about 40, 4 H⁺) and complex IV (about 110, 2 H⁺). FADH₂ enters on a lower step beside Q: too small to pump.";
  }
  function syncCtrl(){
    var bz = busy(), fs = followState();
    modeR.disable(bz || playing); o2R.disable(bz || playing);
    $$("[data-feed]", host).forEach(function(b){ b.disabled = bz || playing; });
    $("#et-reset", host).disabled = bz || playing;
    $("#et-back", host).disabled = bz || playing || S.fo.hist.length <= 1;
    $("#et-step", host).disabled = bz || playing || !fs.canStep;
    var pl = $("#et-play", host); pl.textContent = playing ? "Pause" : "Play"; pl.disabled = !playing && (bz || !fs.canStep);
    $$("[data-sfeed]", host).forEach(function(b){ b.disabled = bz; }); $("#et-clear", host).disabled = bz;
    $("#et-o2", host).disabled = bz; $$("[data-blk]", host).forEach(function(b){ b.disabled = bz; });
    var why = "";
    if (S.mode === "follow" && !playing && !bz) {
      if (!S.fo.fed.length) why = "Step is off: feed a pair first.";
      else if (fs.blocked) why = "Step is off: the chain is backed up. Set O₂ to Present, or press Back or Reset.";
      else if (!fs.m) why = "Every pair has reached O₂. Feed another pair to keep going.";
    }
    $("#et-why", host).textContent = why;
  }
  function paintCtrl(){
    var fol = S.mode === "follow";
    $("#et-cf", host).hidden = !fol; $("#et-cs", host).hidden = fol;
    $("#et-blk", host).hidden = S.mode !== "poison";
    o2R.set(S.fo.o2 ? "y" : "n");
    if (!fol) { var st = sst(), sl = $("#et-o2", host); sl.value = st.o2; $("#et-o2-out", host).textContent = st.o2 + "%"; sl.setAttribute("aria-valuetext", st.o2 + "% O₂ supply");
      $$("[data-blk]", host).forEach(function(c){ c.checked = !!S.po[c.dataset.blk]; }); }
    $("#et-shst", host).checked = !!S.show.stair; $("#et-shhc", host).checked = !!S.show.hc;
    $("#et-stw", host).hidden = !S.show.stair;
    host.querySelector(".et-figs").classList.toggle("et-one", !S.show.stair);
  }
  function paintQueue(){
    var q = $("#et-queue", host);
    if (S.mode === "follow") {
      var wt = waiting();
      q.innerHTML = "<strong>Waiting to unload:</strong> " + (wt.length ? wt.map(function(r){ return MV.bio.tok(DON[r], r === "n" ? "--bio-nadh" : "--bio-fadh"); }).join(" ") : '<span class="muted">none</span>');
      $("#et-gauges", host).hidden = true;
    } else {
      var st = sst(), R = steady(st, sblk());
      q.innerHTML = "<strong>Steady feed:</strong> " + feedText(st);
      var mt = $("#et-gauges", host); mt.hidden = false; mt.innerHTML = gauges(R);
    }
  }
  function bannerSync(){
    var bad = S.mode === "follow" ? followState().blocked : (function(){ var st = sst(), b = sblk(); return (st.n + st.f) > 0 && steady(st, b).P === 0; })();
    if (bad) { MV.banner("bad", "Backed up: electrons can’t reach O₂."); bannerMine = true; }
    else if (bannerMine) { MV.banner("", ""); bannerMine = false; }
  }
  function paint(){
    modeR.set(S.mode);
    paintCtrl(); paintQueue();
    if (!busy()) { if (S.mode === "follow") drawFollow(); else drawSteady(); }
    svg.setAttribute("aria-label", aria()); stsvg.setAttribute("aria-label", stairAria());
    $("#et-cap", host).innerHTML = cap || (S.mode === "follow" ? "Press + NADH or + FADH₂, then Step or Play to follow the pair down the chain." : S.mode === "steady" ? "Build a steady feed with + NADH and + FADH₂, then change the O₂ supply." : "Feed the chain, then switch blockers on and off. Watch where the electrons stop.");
    if (!playing) bannerSync();
    paintRead(); syncCtrl();
  }
  EXP = { paint:paint };

  // ---- events ----
  $("#et-cf", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "et-play") { if (playing) { playing = false; syncCtrl(); } else { cap = ""; play(); } return; }
    if (busy() || playing) return;
    if (b.dataset.feed) feedFollow(b.dataset.feed);
    else if (b.id === "et-reset") resetFollow();
    else if (b.id === "et-step") stepOnce();
    else if (b.id === "et-back") back();
  });
  $("#et-steps", host).addEventListener("keydown", function(e){
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault(); if (busy() || playing) return;
    if (e.key === "ArrowRight") { if (followState().canStep) stepOnce(); } else back();
  });
  $("#et-cs", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy()) return;
    if (b.dataset.sfeed) feedSteady(b.dataset.sfeed);
    else if (b.id === "et-clear") { var st = sst(); st.n = 0; st.f = 0; cap = "Feed cleared."; api.save(); paint(); MV.changed(); }
  });
  $("#et-o2", host).addEventListener("input", function(e){ if (busy()) return; sst().o2 = +e.target.value; cap = "O₂ supply " + sst().o2 + "%."; if (sst().o2 === 0) S.seen.block = true; api.save(); paint(); MV.changed(); });
  $("#et-blk", host).addEventListener("change", function(e){
    var c = e.target.closest("[data-blk]"); if (!c) return;
    S.po[c.dataset.blk] = c.checked;
    var B = C.blockers.filter(function(x){ return x.id === c.dataset.blk; })[0];
    cap = B.t + (c.checked ? " on: it " + B.what.replace("a mutant", "removes cytochrome <i>c</i>") + "." : " off.");
    if (c.checked) S.seen.block = true;
    api.save(); paint(); MV.changed();
  });
  $("#et-shst", host).addEventListener("change", function(e){ S.show.stair = e.target.checked; api.save(); paint(); });
  $("#et-shhc", host).addEventListener("change", function(e){ S.show.hc = e.target.checked; api.save(); paint(); });
  paint();

  // ---- challenges ----
  function followTally(){ var f = S.fo, x = f.hist[f.hist.length - 1], n = f.fed.filter(function(v){ return v === "n"; }).length; return { n:n, f:f.fed.length - n, all:f.fed.length, done:x.w, H:hsum(x.h), blocked:!!(moveOf(f, x) || {}).blocked }; }
  function notDone(t){
    if (!t.all) return "Feed the chain first: press + NADH or + FADH₂ in Follow one pair mode.";
    if (t.blocked) return "With O₂ absent the pairs can’t finish. Set O₂ to Present, then keep stepping.";
    return "Step or Play until every pair reaches O₂ (" + t.done + " of " + t.all + " done so far).";
  }
  function chal(id){
    if (id === "tc1") {
      var t = followTally();
      if (t.done < t.all || !t.all) return { ok:false, msg:notDone(t) };
      if (t.n === 2 && t.f === 1) return { ok:true };
      if (t.n === 1 && t.f === 2) return { ok:false, msg:FB.tc1a };
      if (t.n === 0 && t.f === 4) return { ok:false, msg:FB.tc1b };
      return { ok:false, msg:"Your feed pumped " + t.H + " H⁺. " + FB.tc1a };
    }
    if (id === "tc2") {
      var p = S.po, R = steady(p, p);
      if (!p.rot) return { ok:false, msg:FB.tc2b };
      if (R.o2 > 0) return { ok:true };
      if (p.cn || p.noc) return { ok:false, msg:(p.cn ? "Cyanide" : "A missing cytochrome <i>c</i>") + " blocks every route to O₂. Leave rotenone on and switch the other blocker off." };
      if (!p.n && !p.f) return { ok:false, msg:"Feed the chain first: press + NADH or + FADH₂ in the Poisons lab." };
      if (!p.f) return { ok:false, msg:FB.tc2a };
      if (p.o2 < 100) return { ok:false, msg:"Set the O₂ supply to 100%, as the challenge says." };
      return { ok:false, msg:"Which donor doesn’t need complex I?" };
    }
    if (id === "tc3") {
      var u = followTally();
      if (u.done < u.all || !u.all) return { ok:false, msg:notDone(u) };
      if (u.n === 4 && u.f === 2) return { ok:true };
      if (u.n === 4 && u.f === 1) return { ok:false, msg:FB.tc3c };
      if (u.all === 6) return { ok:false, msg:u.H > 52 ? (u.n === 6 ? FB.tc3a : "Right O₂, too many H⁺: swap some NADH for FADH₂.") : FB.tc3b };
      return { ok:false, msg:"Your " + u.all + " pair" + (u.all === 1 ? "" : "s") + " used " + o2num(u.all / 2) + " O₂: you need 6 pairs for 3 O₂." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stopAll(); var s = p.start;
        S.mode = s.mode; cap = "";
        if (s.mode === "follow") { S.fo.fed = s.feed.slice(); S.fo.hist = [snap0()]; S.fo.o2 = s.o2; }
        else { S.po.n = 0; S.po.f = 0; S.po.o2 = s.o2; S.po.rot = !!s.rot; S.po.cn = false; S.po.noc = false; cap = "Poisons lab: rotenone on, O₂ at 100%, nothing fed yet."; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        if (p.id === "p1" || p.id === "p2") play(function(){
          cap = p.id === "p1" ? "H⁺ popped up at complexes I, III and IV only: three pumps, 10 H⁺ for one NADH pair." : "The FADH₂ pair entered at complex II, hopped to Q, then III and IV: two pumps, 6 H⁺ instead of 10.";
          paint(); done();
        });
        else if (p.id === "p3") play(function(){ S.seen.block = true; api.save(); cap = "Backed up: pair 1 waits at complex IV with nowhere to send its electrons, so the next NADH can’t unload. Pumping has stopped."; paint(); done(); });
        else if (p.id === "p4") passOnce("f", function(){ S.po.f = 1; S.seen.block = true; api.save(); cap = "6 H⁺ pumped per tick (III: 4, IV: 2) and O₂ used: the FADH₂ pair enters at complex II, after the rotenone block."; paint(); MV.changed(); done(); });
        else done();
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Why oxygen? ----------
// @component electronegLadder — "Zoom to the molecules": carriers placed by how strongly they hold electrons (spacing follows the
// model energy drops), a rung slider that moves an electron pair down, energy released per rung and in total.
var RY = [26, 49, 121, 145, 192, 215, 321];
function ladderSVG(R, pos){
  var h = "", x0 = 152, x1 = 200;
  h += sv("line", { x1:x0, y1:14, x2:x0, y2:332, "class":"et-rail" }) + sv("line", { x1:x1, y1:14, x2:x1, y2:332, "class":"et-rail" });
  R.rungs.forEach(function(g, i){
    var y = RY[i], cur = Math.round(pos) === i;
    h += sv("line", { x1:x0, y1:y, x2:x1, y2:y, "class":"et-rung" + (cur ? " on" : "") });
    var lab = MV.plain(g.t);
    if (g.id === "c") h += '<text x="' + (x0 - 8) + '" y="' + (y + 4.5) + '" text-anchor="end" class="et-ll' + (cur ? " on" : "") + '">cytochrome <tspan font-style="italic">c</tspan></text>';
    else h += txt(x0 - 8, y + 4.5, lab, "et-ll" + (cur ? " on" : "") + (g.id === "nadh" ? " et-lln" : g.id === "o2" ? " et-llo" : ""), "end");
  });
  var GAP = [[1, 2, "≈ 70 kJ/mol", "complex I: 4 H⁺"], [3, 4, "≈ 40 kJ/mol", "complex III: 4 H⁺"], [5, 6, "≈ 110 kJ/mol", "complex IV: 2 H⁺ (biggest)"]];
  GAP.forEach(function(gp){ var y = (RY[gp[0]] + RY[gp[1]]) / 2, passed = pos >= gp[1] - 0.01; h += txt(x1 + 10, y - 2, gp[2], "et-dl" + (passed ? " on" : "")) + txt(x1 + 10, y + 13, gp[3], "et-hp2" + (passed ? " on" : "")); });
  [[0, 1], [2, 3], [4, 5]].forEach(function(gp){ var y = (RY[gp[0]] + RY[gp[1]]) / 2; h += txt(x1 + 10, y + 4, "small hand-over", "et-ts"); });
  h += sv("line", { x1:368, y1:24, x2:368, y2:318, "class":"et-ax" }) + head([368, 300], [368, 320], "et-axh", 6);
  h += '<text class="et-ts" transform="rotate(90 380 170)" x="380" y="170" text-anchor="middle">holds electrons more tightly</text>';
  var y = pos <= 0 ? RY[0] : pos >= 6 ? RY[6] : lerp(RY[Math.floor(pos)], RY[Math.ceil(pos)], pos - Math.floor(pos));
  h += eDots([(x0 + x1) / 2, y]);
  return h;
}
// @component O2electrode — S7 data station: model oxygen-electrode trace (MV.Plot) with numbered additions and tap-a-segment chips
function o2Trace(t){ return t <= 2 ? 100 : t <= 4 ? 100 - 12 * (t - 2) : t <= 6 ? 76 : t <= 8 ? 76 - 7 * (t - 6) : 62; }
function chipQ(q, st){
  var h = '<p class="et-qp"><strong>' + q.prompt + '</strong></p><div class="et-chips" role="group" aria-label="Choices">' + q.options.map(function(o, i){ var on = st.pick === i; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-qo="' + i + '" data-k="' + q.id + "o" + i + '"' + (st.ok ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
  if (st.pick != null) { var o = q.options[st.pick]; h += MV.ok(o) ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (o.why || "")) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (o.why || "") + " Try again."); }
  return h;
}
function part3(host, api){
  var C = api.content, S = api.S, S1 = C.s1, S2 = C.s2, S3 = C.s3;
  if (S.rung == null) S.rung = 0; S.segs = S.segs || {}; S.q = S.q || {};
  var sel = S.sel || null;
  host.innerHTML = '<div class="et-p3">' +
    '<div class="et-st1"><h3>' + S1.title + '</h3><details class="alg" open><summary>' + S1.panel + "</summary><p>" + S1.intro + '</p><div class="et-lad"><div class="et-ladw"><svg id="et-lsvg" viewBox="0 0 390 340" role="img" focusable="false"></svg></div>' +
      '<div class="et-ladc"><label class="slider et-sl"><span class="slider-top"><span>Move the pair down</span><output id="et-r-out" for="et-r"></output></span><input type="range" id="et-r" min="0" max="6" step="1"></label><p class="et-lread" id="et-lread" aria-live="polite"></p><p class="et-ltext">' + S1.text + '</p><p class="tiny muted"><span class="bio-model">Model values</span> Rungs are spaced by the energy released between them.</p></div></div></details></div>' +
    '<div class="et-st2 part"><h3>' + S2.title + '</h3><details class="alg" open><summary>' + S2.panel + "</summary><p>" + S2.intro + '</p><div class="plot-wrap"><canvas class="plot wide" id="et-o2c" role="img"></canvas></div>' +
      '<ol class="et-adds tiny">' + S2.adds.map(function(a){ return "<li><strong>" + a.t + " min:</strong> " + a.n + (a.note ? " (" + a.note + ")" : "") + "</li>"; }).join("") + '</ol><p class="tiny muted"><span class="bio-model">Model data</span> O₂ left in the sealed chamber, % of the starting amount.</p>' +
      '<div class="et-segs" id="et-segs" role="group" aria-label="Segments of the trace"></div><div id="et-segq" aria-live="polite"></div><div class="et-ask" id="et-s2q"></div></details></div>' +
    '<div class="et-st3 part"><h3>' + S3.title + "</h3><p>" + S3.text + '</p><div class="et-ask" id="et-s3q"></div></div></div>';

  // Station 1
  var lsvg = $("#et-lsvg", host), rIn = $("#et-r", host), lanim = null, lpos = S.rung;
  function released(i){ var tot = 0; for (var k = 1; k <= i; k++) tot += S1.drops[k]; return tot; }
  function lread(){
    var i = S.rung, g = S1.rungs[i], d = S1.drops[i];
    var here = i === 0 ? "The pair starts on NADH, the weakest hold." : d ? "This rung: " + eText(d) + " released" + (i === 2 ? " (complex I’s step: 4 H⁺ pumped)." : i === 4 ? " (complex III’s step: 4 H⁺ pumped)." : " (complex IV’s step, the biggest: 2 H⁺ pumped).") : "This rung: a small hand-over to a carrier that holds the electrons a little more tightly.";
    $("#et-lread", host).innerHTML = "<strong>Pair at: " + g.t + ".</strong> " + here + " Released so far: <strong>" + eText(released(i)) + "</strong>.";
    rIn.value = i; $("#et-r-out", host).innerHTML = "rung " + (i + 1) + " of 7";
    rIn.setAttribute("aria-valuetext", "Rung " + (i + 1) + " of 7: " + MV.plain(g.t) + ", " + MV.plain(eText(released(i))) + " released so far");
  }
  function ldraw(p){ lsvg.innerHTML = ladderSVG(S1, p); lsvg.setAttribute("aria-label", "Electronegativity ladder. From the top: NADH (weakest hold), complex I, ubiquinone, complex III, cytochrome c, complex IV, O₂ (strongest hold). Big gaps: complex I about 70, complex III about 40 and complex IV to O₂ about 110 kilojoules per mole. The electron pair is on " + MV.plain(S1.rungs[S.rung].t) + "."); }
  rIn.addEventListener("input", function(){
    var to = +rIn.value, from = lpos; S.rung = to; api.save(); lread();
    if (lanim) lanim();
    lanim = MV.tween({ dur:350, step:function(k){ lpos = lerp(from, to, k); ldraw(lpos); }, done:function(){ lanim = null; lpos = to; ldraw(to); } });
  });
  ldraw(S.rung); lread();

  // Station 2
  var VIEW = { xmin:-1.1, xmax:10.3, ymin:-9, ymax:118 };
  var cv = $("#et-o2c", host), plot = new MV.Plot(cv, VIEW);
  plot.render = function(){
    var css = MV.css, pen = css("--pen"), ink2 = css("--ink-2"), hi = css("--hi-soft"), s = sel ? S2.segs.filter(function(g){ return g.id === sel; })[0] : null;
    plot.draw({ view:VIEW, xTicks:{ step:2, fmt:function(v){ return v ? v + " min" : ""; } }, yTicks:{ step:20, fmt:function(v){ return v > 0 && v <= 100 ? v + "%" : ""; } },
      bands:s ? [{ x0:s.a, x1:s.b, color:hi }] : [],
      segments:S2.adds.map(function(a){ return { x1:a.t, y1:112, x2:a.t, y2:o2Trace(a.t) + 5, color:ink2, width:1.6, dash:[5, 4], arrow:true }; }),
      curves:[{ f:o2Trace, color:pen, width:3.2, domain:[0, 10] }],
      labels:S2.adds.map(function(a, i){ return { x:a.t, y:112, text:String(i + 1), color:ink2, align:"center", dy:-2, bg:true }; }),
      describe:"Model data. O₂ in the sealed chamber against time, 0 to 10 minutes. Flat at 100% until 2 min. Addition 1 at 2 min, pyruvate plus malate: the trace falls to 76% by 4 min. Addition 2 at 4 min, rotenone: flat. Addition 3 at 6 min, succinate: falls again, less steeply, to 62% by 8 min. Addition 4 at 8 min, cyanide: flat." + (s ? " Highlighted: " + s.a + " to " + s.b + " min." : "") });
  };
  plot.render();
  function segBtns(){
    var box = $("#et-segs", host);
    MV.keepFocus(box, function(){
      box.innerHTML = S2.segs.map(function(g){ var st = S.segs[g.id] || {}, on = sel === g.id; return '<button type="button" class="btn ghost sm et-segb' + (st.ok ? " done" : "") + '" aria-pressed="' + on + '" data-seg="' + g.id + '" data-k="etseg' + g.id + '">' + g.a + "–" + g.b + " min" + (st.ok ? " ✓" : "") + "</button>"; }).join("");
    });
  }
  function segQ(){
    var box = $("#et-segq", host);
    if (!sel) { box.innerHTML = '<p class="tiny muted">Tap a segment of the trace to explain it.</p>'; return; }
    var g = S2.segs.filter(function(x){ return x.id === sel; })[0], st = S.segs[g.id] || (S.segs[g.id] = {});
    var h = '<p class="et-qp"><strong>' + g.a + "–" + g.b + " min: the trace " + g.shape + ".</strong> Which explanation fits?</p>" +
      '<div class="et-chips et-chipcol" role="group" aria-label="Explanations">' + S2.chips.map(function(c){ var on = st.pick === c.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-sc="' + c.id + '" data-k="etsc' + c.id + '"' + (st.ok ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    if (st.pick) {
      var right = MV.ans(g), c = S2.chips.filter(function(x){ return x.id === st.pick; })[0];
      if (st.pick === right) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + c.t);
      else {
        var other = S2.segs.filter(function(x){ return MV.ans(x) === st.pick; })[0], add = S2.adds.filter(function(a){ return a.t === g.a; })[0];
        h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (c.fb ? c.fb : other ? "That explains the " + other.a + "–" + other.b + " min segment." : "") + " Look at what was added at " + g.a + " min (" + add.n + "). Try again.");
      }
    }
    box.innerHTML = h;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.seg) { sel = b.dataset.seg; S.sel = sel; api.save(); segBtns(); segQ(); plot.render(); var f = $("#et-segq .et-qp", host); if (f) { f.setAttribute("tabindex", "-1"); } return; }
    if (b.dataset.sc) { var st = S.segs[sel] || (S.segs[sel] = {}); st.pick = b.dataset.sc; st.ok = st.pick === MV.ans(S2.segs.filter(function(x){ return x.id === sel; })[0]); api.save(); segQ(); segBtns(); MV.focusFb($("#et-segq", host)); return; }
    if (b.dataset.qo != null) { var box = b.closest("[data-ask]"), q = box.dataset.ask === "s2" ? S2.ask : S3.ask, qs = S.q[q.id] || (S.q[q.id] = {}); qs.pick = +b.dataset.qo; qs.ok = MV.ok(q.options[qs.pick]); api.save(); paintAsk(box.dataset.ask); MV.focusFb(box); }
  });
  function paintAsk(k){ var q = k === "s2" ? S2.ask : S3.ask, box = $("#et-" + k + "q", host); box.setAttribute("data-ask", k); MV.keepFocus(box, function(){ box.innerHTML = chipQ(q, S.q[q.id] || {}); }); }
  segBtns(); segQ(); paintAsk("s2"); paintAsk("s3");
}

// ---------- Practice 1: The electron route (@component routeBuilder — N5-style flow chart built by tapping tiles in order; a tile
// can be left out, so distractors work; tap a placed tile to send it back) ----------
function route(host, api, a){
  var S = api.S; S.seq = S.seq || {};
  var msgs = {};
  function sq(s){ return S.seq[s.id] || (S.seq[s.id] = { placed:[], tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">Tap the tiles in order, from the donor to the final acceptor. Tap a tile in your route to send it back. Press Check when the route is complete.</p>' + a.sequences.map(function(s, i){ return '<div class="q' + (i ? " part" : "") + '" data-seq="' + s.id + '" style="border-bottom:0"></div>'; }).join("");
  function paintSeq(s){
    var i = a.sequences.indexOf(s), x = sq(s), box = host.querySelector('[data-seq="' + s.id + '"]');
    var order = MV.shuffle(s.tiles.map(function(_, k){ return k; }), MV.meta.id + s.id);
    var h = '<p class="task">Sequence ' + (i + 1) + ": " + s.prompt + "</p>";
    h += '<div class="et-rlab">Your route:</div><ol class="et-route" aria-label="Your route">' + (x.placed.length ? x.placed.map(function(t, p){ return '<li><button type="button" class="et-rt' + (x.solved ? " good" : "") + '" data-rm="' + p + '" data-k="' + s.id + "r" + t + '"' + (x.solved ? " disabled" : "") + ' aria-label="Step ' + (p + 1) + ": " + MV.esc(MV.plain(s.tiles[t])) + (x.solved ? "" : ". Tap to send it back.") + '">' + s.tiles[t] + "</button>" + (p < x.placed.length - 1 ? '<span class="et-rarr" aria-hidden="true">→</span>' : "") + "</li>"; }).join("") : '<li class="muted et-rempty">Empty: tap a tile below.</li>') + "</ol>";
    if (!x.solved) {
      var left = order.filter(function(t){ return x.placed.indexOf(t) < 0; });
      h += '<div class="et-rlab">Tiles:</div><div class="et-bank" role="group" aria-label="Tiles to place">' + (left.length ? left.map(function(t){ return '<button type="button" class="et-tile" data-add="' + t + '" data-k="' + s.id + "t" + t + '">' + s.tiles[t] + "</button>"; }).join("") : '<span class="muted tiny">All tiles placed.</span>') + "</div>";
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + s.id + 'chk">Check the route</button><button type="button" class="btn ghost sm" data-act="clear" data-k="' + s.id + 'clr">Clear</button>' + MV.hintBtn(s.id + "hint", x.hint) + "</div>" + MV.hintsHTML(s.hints, x.hint);
    }
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ That route works.</strong> ' + s.why + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[s.id]) h += '<div class="fb bad" role="status"><p>' + msgs[s.id] + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function judge(s, placed){
    var ans = MV.ans(s), F = a.fb, T = s.tiles;
    function idx(name){ for (var k = 0; k < T.length; k++) if (MV.plain(T[k]) === name) return placed.indexOf(k); return -1; }
    if (placed.length === ans.length && placed.every(function(v, k){ return v === ans[k]; })) return null;
    var iI = idx("complex I"), iIII = idx("complex III"), iC = idx("cytochrome c"), iQ = idx("ubiquinone (Q)");
    if (s.id === "s2" && iI >= 0) return F.usedI;
    if (iC >= 0 && iIII >= 0 && iC < iIII) return F.cBeforeIII;
    if (iQ >= 0 && iIII >= 0 && iQ > iIII) return F.qAfterIII;
    if (placed.length < ans.length) return F.short;
    for (var p = 0; p < placed.length; p++) if (placed[p] !== ans[p]) return "Step " + (p + 1) + " is out of place. " + F.general;
    return F.general;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-seq]"); if (!box) return;
    var s = a.sequences.filter(function(q){ return q.id === box.dataset.seq; })[0], x = sq(s);
    if (b.dataset.add != null) { x.placed.push(+b.dataset.add); msgs[s.id] = null; api.save(); paintSeq(s); var nb = box.querySelector(".et-tile"); if (nb && !box.contains(document.activeElement)) nb.focus(); return; }
    if (b.dataset.rm != null) { x.placed.splice(+b.dataset.rm, 1); msgs[s.id] = null; api.save(); paintSeq(s); return; }
    if (b.dataset.act === "clear") { x.placed = []; msgs[s.id] = null; api.save(); paintSeq(s); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintSeq(s); return; }
    if (b.dataset.act === "check") {
      if (!x.placed.length) { msgs[s.id] = "Tap the tiles in order first."; paintSeq(s); return; }
      var fb = judge(s, x.placed);
      if (!fb) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[s.id] = null; }
      else { x.tries++; msgs[s.id] = "<strong>✗ Not yet.</strong> " + fb + " Try again."; }
      api.save(); paintSeq(s); MV.focusFb(box);
    }
  });
  a.sequences.forEach(paintSeq);
  return {
    stats:function(){ var f = 0, d = 0; a.sequences.forEach(function(s){ var x = sq(s); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.sequences.length, done:d, line:a.summary + " (first try): " + f + "/" + a.sequences.length + (d < a.sequences.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.sequences.forEach(function(s){ var x = sq(s); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(s.goal != null ? s.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Poison detective (chips; tap a chip to answer; adapted from SBI4U 08 detective) ----------
function detective(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">Tap the chip that answers each case. Wrong chips explain why; try again.</p>' + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = host.querySelector('[data-li="' + it.id + '"]');
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="et-chips" role="group" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.last === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ci="' + k + '" data-k="' + it.id + "c" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (!x.solved && it.hints) h += '<div class="q-actions">' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (x.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.li; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.ci == null) return;
    var o = it.options[+b.dataset.ci], ok = MV.ok(o); x.last = +b.dataset.ci;
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.why = o.why; msgs[it.id] = null; }
    else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + o.why + " Try again."; }
    api.save(); paintItem(it); MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Six pairs, one gradient ----------
// @component S3 energyLedger (gauge form; adapted from SBI4U 08 / 13) — O₂ half-slots and an H⁺ gauge with a target band
var task = (function(){
  var api = null, T = null, BR = null;
  function read(){ var s = api ? api.S : {}; return { n:s.n == null ? 0 : +s.n, f:s.f == null ? 0 : +s.f, b:s.b || "none" }; }
  function flow(d){ var fn = d.b === "none" ? d.n : 0, ff = d.b === "cn" ? 0 : d.f; return { fn:fn, ff:ff, pairs:fn + ff, H:10 * fn + 6 * ff }; }
  function checks(d){ var r = flow(d); return [r.pairs === 6, r.H >= 40 && r.H <= 50, d.f >= 1]; }
  function status(d){ var r = flow(d); if (!d.n && !d.f) return "Idle: nothing fed"; if (d.b === "cn") return "Blocked at complex IV: nothing flows"; if (d.b === "rot" && d.n) return "NADH blocked at complex I" + (d.f ? "; FADH₂ flowing" : ""); return "Flowing"; }
  function draw(){
    var d = read(), r = flow(d), pv = $("#et-tpv"); if (!pv) return;
    var h = sv("rect", { x:0, y:0, width:520, height:220, rx:10, "class":"et-tbg" }), i;
    h += txt(14, 26, "Fed", "et-tb");
    for (i = 0; i < d.n; i++) h += pill([44 + i * 50, 50], 46, "NADH", d.b === "none" ? "et-pn" : "et-pn0", null, d.b === "none" ? "et-pt" : "et-ptn");
    for (i = 0; i < d.f; i++) h += pill([44 + i * 50, 82], 46, "FADH₂", d.b === "cn" ? "et-pf0" : "et-pf", null, d.b === "cn" ? "et-ptf" : "et-pt");
    if (d.b !== "none") h += txt(330, 26, d.b === "rot" ? "rotenone: NADH can’t unload" : "cyanide: no pair reaches O₂", "et-blkt", "start");
    h += txt(14, 124, "O₂ used (½ per pair)", "et-tb");
    for (i = 0; i < 12; i++) { var x = 24 + i * 40, on = i < r.pairs; h += sv("circle", { cx:x, cy:146, r:13, "class":on ? "et-o2s on" : "et-o2s" }) + txt(x, 150.5, "½", on ? "et-pt" : "et-ts", "middle"); }
    h += sv("line", { x1:24 + 5.5 * 40 + 20, y1:128, x2:24 + 5.5 * 40 + 20, y2:166, "class":"et-tgt" }) + txt(24 + 5.5 * 40 + 24, 176, "3 O₂", "et-ts", "start");
    h += txt(14, 192, "H⁺ pumped", "et-tb");
    var gx = 110, gw = 390, sc = gw / 72;
    h += sv("rect", { x:gx, y:182, width:gw, height:18, rx:4, "class":"et-gbg" }) + sv("rect", { x:gx + 40 * sc, y:180, width:10 * sc, height:22, "class":"et-gband" }) + sv("rect", { x:gx, y:182, width:Math.min(72, r.H) * sc, height:18, rx:4, "class":"et-gfill" });
    h += txt(gx + 45 * sc, 214, "40–50", "et-ts", "middle") + txt(gx + Math.min(72, r.H) * sc + 4, 196, String(r.H), "et-tb", "start");
    pv.innerHTML = h;
    pv.setAttribute("aria-label", "Feeding plan: " + d.n + " NADH and " + d.f + " FADH₂, blocker " + BR[d.b] + ". " + r.pairs + " pairs reach O₂, using " + o2num(r.pairs / 2) + " O₂ (target 3). " + r.H + " H⁺ pumped (target 40 to 50).");
    $("#et-tread").innerHTML = "Pairs that reach O₂: <b>" + r.pairs + "</b> · O₂ used: <b>" + o2num(r.pairs / 2) + "</b> · H⁺ pumped: <b>" + r.H + "</b> · Status: <b>" + status(d) + "</b>";
  }
  function lab(k){ var p = k.split("-"); return "<i>n</i> = " + p[0] + ", <i>f</i> = " + p[1] + ", " + (p[2] === "none" ? "no blocker" : BR[p[2]]); }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; BR = {}; T.blockers.forEach(function(b){ BR[b.id] = b.t; });
      inp.innerHTML = '<div class="et-tin">' + ["n", "f"].map(function(k){ var I = T.inputs[k]; return '<label class="slider et-sl"><span class="slider-top"><span>' + I.label + " (<i>" + I.sym + '</i>)</span><output id="et-to-' + k + '" for="et-ti-' + k + '"></output></span><input type="range" id="et-ti-' + k + '" data-ti="' + k + '" min="' + I.min + '" max="' + I.max + '" step="1"></label>'; }).join("") + '<div id="et-tb"></div></div>';
      pv.innerHTML = '<div class="et-tpvw"><h4>Your feeding plan</h4><svg id="et-tpv" viewBox="0 0 520 220" role="img" focusable="false"></svg><p class="et-tread" id="et-tread" aria-live="polite"></p></div>';
      var br = radios($("#et-tb"), { label:"Blocker", options:T.blockers.map(function(b){ return { id:b.id, t:b.t }; }), value:read().b, onChange:function(v){ a.S.b = v; a.save(); show(); a.update(); } });
      function show(){ var d = read(); ["n", "f"].forEach(function(k){ var el = $("#et-ti-" + k); el.value = d[k]; $("#et-to-" + k).textContent = String(d[k]); el.setAttribute("aria-valuetext", T.inputs[k].label + ": " + d[k]); }); br.set(d.b); draw(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.ti; if (!k) return; a.S[k] = +e.target.value; a.save(); show(); a.update(); });
      show();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"); if (!g || MV.taskState().found.length < 3) return;
        var ps = g.querySelectorAll("p"); if (ps[1] && T.more) ps[1].innerHTML = ps[1].innerHTML.replace(T.more, "You’ve found all three answers.");
      }, 0); });
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    key:function(d){ return d.n + "-" + d.f + "-" + d.b; },
    label:lab,
    text:function(k){ return MV.plain(lab(k)); }
  };
})();

// ---------- hero: the electron staircase (storyboard: staircase beside a membrane strip; NADH on the top step; a pair hops down
// with H⁺ pairs popping up at I, III and IV; O₂ catches the electrons and H⁺ and becomes water; "10 H⁺ pumped"; NAD⁺ floats
// back toward the Krebs cycle) ----------
var HL = { nd:116, I:121, Q:173, III:178, c:206, IV:211, O2:296 };
var HX = { nd:[24, 74], I:[74, 124], Q:[124, 174], III:[174, 224], c:[224, 274], IV:[274, 324], O2:[324, 374] };
function hpt(k){ var t = HX[k]; return [(t[0] + t[1]) / 2, HL[k] - 9]; }
function heroSVG(T){
  var h = "", order = ["nd", "I", "Q", "III", "c", "IV", "O2"];
  h += sv("rect", { x:0, y:0, width:520, height:56, "class":"et-ims" }) + sv("rect", { x:0, y:56, width:520, height:28, "class":"et-memb" }) + sv("rect", { x:0, y:84, width:520, height:250, "class":"et-mat" });
  h += sv("path", { d:"M0 56 H520 M0 84 H520", "class":"et-mline" }) + txt(8, 18, "intermembrane space", "et-ts et-b") + txt(512, 75, "inner membrane", "et-ts", "end") + txt(512, 324, "matrix", "et-ts et-b", "end");
  var d = ""; order.forEach(function(k, i){ var t = HX[k]; d += (i ? " L" : "M") + t[0] + " " + HL[k] + " L" + t[1] + " " + HL[k]; });
  h += sv("path", { d:d, "class":"et-stair" });
  var LAB = { nd:"", I:"I", Q:"Q", III:"III", IV:"IV", O2:"" };
  Object.keys(LAB).forEach(function(k){ if (LAB[k]) h += txt((HX[k][0] + HX[k][1]) / 2, HL[k] + 16, LAB[k], "et-sl", "middle"); });
  h += '<text x="249" y="' + (HL.c + 16) + '" text-anchor="middle" class="et-sl">cyt <tspan font-style="italic">c</tspan></text>';
  // Krebs wheel
  h += sv("circle", { cx:70, cy:262, r:24, "class":"et-kw" }) + head([94, 258], [92, 268], "et-kwh", 6) + txt(70, 300, "Krebs cycle", "et-ts", "middle");
  // timeline
  var hop = [[0.08, 0.15], [0.17, 0.25], [0.27, 0.33], [0.35, 0.43], [0.45, 0.51], [0.53, 0.63]];
  var pos = hpt("nd"), stage = 0;
  for (var i = 0; i < hop.length; i++) { if (T >= hop[i][0]) { stage = i; pos = lp(hpt(order[i]), hpt(order[i + 1]), sm(seg(T, hop[i][0], hop[i][1]))); } }
  var pumps = [["I", 0.17, 99], ["III", 0.35, 199], ["IV", 0.53, 299]], count = 0;
  pumps.forEach(function(p, j){
    var k = seg(T, p[1], p[1] + 0.14), x = p[2], y0 = HL[p[0]] - 4;
    if (k <= 0) return;
    count += j === 2 ? 2 : 4;
    var y = lerp(y0, 34, sm(k));
    h += hDot([x - 6, y], null, 6) + hDot([x + 6, y], null, 6);
    if (k >= 1) h += txt(x + 14, 39, "+" + (j === 2 ? 2 : 4), "et-hp", "start");
  });
  // NADH / NAD⁺
  var unl = seg(T, 0.08, 0.12), fl = sm(seg(T, 0.7, 0.92)), np = lp([49, 100], [70, 230], fl);
  if (unl < 1) h += pill([49, 100], 56, "NADH", "et-pn");
  else h += pill(np, 54, "NAD⁺", "et-pn0", fl >= 1 ? 0.85 : 1, "et-ptn");
  // O₂ → H₂O
  var o2p = [349, 278], hk = seg(T, 0.63, 0.74);
  if (T < 0.74) h += pill(o2p, 50, "½O₂", "et-o2");
  else h += pill(o2p, 50, "H₂O", "et-o2");
  if (hk > 0 && hk < 1) h += hDot(lp([320, 326], [339, 282], sm(hk)), null, 6) + hDot(lp([380, 326], [359, 282], sm(hk)), null, 6);
  if (T < 0.64) h += eDots(pos);
  h += txt(512, 22, count + " H⁺ pumped", "et-hc", "end");
  return h;
}
function hero(f){
  var box = $("#et-hero"); if (!box) return;
  var cap = f && f.cap, last = -1;
  box.innerHTML = '<svg viewBox="0 0 520 334" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var CAPS = ["NADH arrives at the top of the staircase, loaded with two high-energy electrons.",
    "The electrons hop down: complex I pumps H⁺ up through the membrane, then Q carries them to complex III, which pumps again.",
    "Cytochrome c hands them to complex IV, which pumps once more. O₂ at the bottom catches the electrons, takes H⁺ from the matrix and becomes water.",
    "10 H⁺ pumped for one NADH. The empty NAD⁺ goes back to the Krebs cycle for another load."];
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  function frame(T){ svg.innerHTML = heroSVG(T); setCap(T < 0.12 ? 0 : T < 0.44 ? 1 : T < 0.76 ? 2 : 3); }
  if (MV.reduceMotion) { frame(1); return; }
  frame(0);
  MV.tween({ dur:11000, ease:lin, step:frame, done:function(){ frame(1); } });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ route:route, detective:detective },
  task:task
});
})();
