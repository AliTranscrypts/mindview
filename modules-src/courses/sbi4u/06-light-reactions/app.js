// SBI4U 06 Light Reactions: hero (photon → electron chain → H⁺ gradient → ATP), Thylakoid membrane simulator (S4 membraneSim,
// with an Energy budget mode drawn by S3 energyLedger), "Acid bath" (S7 experiment bench, data table with tappable rows,
// ATP synthase close-up), "Predict and calculate" (N4 numbers + chips), "Balance the budget" task.
(function(){
"use strict";
var $ = MV.$;

// ---------- small SVG helpers (from SBI4U 03) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "lr-t", "text-anchor":anchor || null }, s); }
function fmt(v){ return MV.num(Math.round(v * 100) / 100); }
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
function photonSVG(x1, y1, x2, y2){ var L = Math.hypot(x2 - x1, y2 - y1) || 1; return L < 3 ? "" : sv("path", { d:wavy(x1, y1, x2, y2) + " " + head(x2, y2, (x2 - x1) / L, (y2 - y1) / L), "class":"lr-photon" }); }
function arrowPath(pts, cls){
  var a = pts[pts.length - 2], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return sv("polyline", { points:pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":cls }) + sv("path", { d:head(b[0], b[1], (b[0] - a[0]) / L, (b[1] - a[1]) / L, 6), "class":cls + " lr-ah" });
}
// stateless particle stream: particles spawn every 1/rate s and live `life` s; fn(k 0…1, index) -> svg
function stream(rate, life, t, fn){
  if (!(rate > 0)) return "";
  var per = 1 / rate, h = "";
  for (var i = Math.floor((t - life) / per) + 1, n1 = Math.floor(t / per); i <= n1; i++) { var k = (t - i * per) / life; if (k >= 0 && k <= 1) h += fn(k, i); }
  return h;
}
function pm(i, n){ return ((i % n) + n) % n; }
function fade(k){ return k < 0.12 ? k / 0.12 : k > 0.85 ? (1 - k) / 0.15 : 1; }
function hDot(x, y, op){ return sv("circle", { cx:x, cy:y, r:3.6, "class":"lr-h", opacity:op == null ? null : f1(op * 100) / 100 }); }
function eDot(x, y, op){ return sv("circle", { cx:x, cy:y, r:4.6, "class":"lr-e", opacity:op == null ? null : f1(op * 100) / 100 }); }
// molecule token pill: role colour from the course tokens
var TOKC = { ATP:"--bio-atp", NADPH:"--bio-nadh", "O₂":"--bio-o2", "H₂O":"--bio-o2", ADP:"--ink-2", "Pᵢ":"--ink-2", "NADP⁺":"--ink-2" };
function tok(lab, x, y, op){
  var w = Math.max(22, lab.length * 6.6 + 10);
  return '<g transform="translate(' + f1(x) + "," + f1(y) + ')"' + (op == null || op >= 1 ? "" : ' opacity="' + f1(clamp(op, 0, 1) * 100) / 100 + '"') + '><rect x="' + f1(-w / 2) + '" y="-8" width="' + f1(w) + '" height="16" rx="8" style="fill:var(' + (TOKC[lab] || "--ink") + ')"/><text y="4" text-anchor="middle" class="lr-tokt">' + lab + "</text></g>";
}

// ---------- @component radioGroup (copied from SBI4U 03 / MHF4U 25: options may be disabled with dis:true) ----------
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
// on/off switches (role="switch"): switches(host, {items:[[id, label]], get(id) -> bool, onChange(id, on)}) -> {paint()}
function switches(host, o){
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = o.items.map(function(it){ var on = !!o.get(it[0]); return '<button type="button" class="lr-swb" role="switch" aria-checked="' + on + '" data-sw="' + it[0] + '" data-k="sw' + it[0] + '"><span class="lr-swk" aria-hidden="true"></span><span>' + it[1] + '</span><span class="lr-swst" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>"; }).join(""); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-sw]"); if (b) o.onChange(b.dataset.sw, !o.get(b.dataset.sw)); });
  paint();
  return { paint:paint };
}
// range slider with output: slider(host, {id, label, min, max, step, value, unit(v), onChange(v)}) -> {set(v)}
function slider(host, o){
  host.innerHTML = '<label class="slider lr-sl"><span class="slider-top"><span>' + o.label + '</span><output id="' + o.id + '-out" for="' + o.id + '"></output></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host);
  function show(v){ out.textContent = o.short ? o.short(v) : o.unit(v); inp.setAttribute("aria-valuetext", o.unit(v)); }
  inp.addEventListener("input", function(){ show(+inp.value); o.onChange(+inp.value); });
  show(o.value);
  return { set:function(v){ inp.value = v; show(v); } };
}

// ---------- @component S4 membraneSim — thylakoid membrane in cross-section (stroma above, lumen below): PSII, PQ, cytochrome b₆f,
// PC, PSI, Fd, NADP⁺ reductase and ATP synthase; lumen H⁺ dots by pH; toggles for a PSII herbicide, an uncoupler (leak) and an
// ATP synthase blocker; live particle flows (stream()) or a still frame with arrows (reduced motion). Deterministic rate model. ----------
var LN = ["Off", "Low", "Medium", "High"];
// Rate model (plan §4 Explore). s = {mode:"mem"|"budget", L, herb, unc, blk, c, t}
function rates(s){
  var L = +s.L || 0, r = { L:L, o2:0, e:0, nadph:0, hw:0, hc:0, atp:0, lum:8, leak:0, cyc:0, flow:0, stuck:false, budget:s.mode === "budget" };
  if (r.budget) {
    var c = +s.c || 0, t = +s.t || 0;
    r.o2 = L; r.e = 4 * L; r.nadph = 2 * L; r.hw = 4 * L; r.hc = 4 * L + 2 * c; r.atp = 2 * L + c / 2; r.lum = 8 - L; r.cyc = c; r.flow = 4 * r.atp;
    r.dA = 3 * t; r.dN = 2 * t;
    r.status = L ? "Electron flow normal · gradient " + (L >= 2 ? "steep" : "shallow") + (c ? " · cyclic flow adds ATP" : "") : "No light: no noncyclic electron flow";
  } else if (!L) r.status = "No light: no electron flow";
  else if (s.herb) { r.stuck = true; r.status = "Electron flow blocked at PSII"; }
  else if (s.unc) { r.o2 = L; r.e = 4 * L; r.nadph = 2 * L; r.hw = 4 * L; r.hc = 4 * L; r.leak = 8 * L; r.status = "Electron flow normal · H⁺ leaking back: no gradient"; }
  else if (s.blk) { r.o2 = L / 2; r.e = 2 * L; r.nadph = L; r.hw = 2 * L; r.hc = 2 * L; r.lum = 8 - L - 1; r.status = "Back-pressure: electron flow slowed · gradient very steep"; }
  else { r.o2 = L; r.e = 4 * L; r.nadph = 2 * L; r.hw = 4 * L; r.hc = 4 * L; r.atp = 2 * L; r.lum = 8 - L; r.flow = 8 * L; r.status = "Electron flow normal · gradient " + (L >= 2 ? "steep" : "shallow"); }
  r.hin = r.hw + r.hc;
  r.ratio = Math.pow(10, 8 - r.lum);
  return r;
}
function ratioText(v){ return v <= 1 ? "1 time (no gradient)" : MV.num(v) + " times as many"; }
function per(v){ return fmt(v) + " per second"; }
function budgetText(s, d){ return fmt(s) + " vs " + fmt(d) + " per second: " + (Math.abs(s - d) < 1e-9 ? "matched" : s < d ? "short by " + fmt(d - s) : "surplus of " + fmt(s - d)); }

// geometry (viewBox 520 × 290): stroma 0–110, membrane 110–158, lumen 158–290
var VW = 520, VH = 290, MT = 110, MB = 158;
var EP = [[66, 134], [118, 134], [166, 134], [214, 184], [262, 134], [310, 92], [356, 96]];                       // electron path
var CP = [[262, 134], [310, 92], [200, 90], [130, 102], [118, 134], [166, 134], [214, 184], [262, 134]];         // cyclic loop
var SYN = [[486, 236], [476, 170], [476, 132], [454, 104], [430, 84]], LEAK = [[18, 248], [18, 160], [18, 108], [18, 56]];
var STROMA_H = [[44, 62], [232, 52], [292, 18], [420, 96]];
var POOL = (function(){                                                                                            // lumen H⁺ dot spots
  var r = MV.bio.rng("lr-lumen"), out = [], n = 0;
  while (out.length < 56 && n < 8000) {
    n++; var x = r.range(32, 508), y = r.range(170, 278);
    if ((x < 250 && y > 262) || Math.hypot(x - 214, y - 184) < 20 || (x > 426 && y < 198) || (x > 34 && x < 104 && y < 214)) continue;
    if (out.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < 13; })) continue;
    out.push([x, y]);
  }
  return out;
})();
function nDots(ph){ return clamp(Math.round(3 + 12 * (8 - ph)), 0, POOL.length); }
var SPANS = [[6, 30], [38, 94], [104, 132], [140, 192], [234, 290], [442, 494]];
function cplx(x, y, w, h, l1, l2){ return sv("rect", { x:x, y:y, width:w, height:h, rx:13, "class":"lr-cx" }) + (l2 ? txt(x + w / 2, y + h / 2 - 4, l1, "lr-tc", "middle") + txt(x + w / 2, y + h / 2 + 11, l2, "lr-tc", "middle") : txt(x + w / 2, y + h / 2 + 4, l1, "lr-tc", "middle")); }
function carrier(x, y, lab){ return sv("circle", { cx:x, cy:y, r:12.5, "class":"lr-cr" }) + txt(x, y + 3.6, lab, "lr-tcs", "middle"); }
// o = {ph, herb, unc, blk}
function sceneSVG(o){
  var h = sv("rect", { x:0, y:0, width:VW, height:MT, "class":"lr-stroma" }) + sv("rect", { x:0, y:MB, width:VW, height:VH - MB, "class":"lr-lumen" }) + sv("rect", { x:0, y:MT, width:VW, height:MB - MT, "class":"lr-mem" });
  var g = "";
  for (var x = 5; x < VW; x += 9) { if (SPANS.some(function(s){ return x > s[0] - 4 && x < s[1] + 4; })) continue; g += sv("circle", { cx:x, cy:MT + 4, r:3.2 }) + sv("circle", { cx:x, cy:MB - 4, r:3.2 }); }
  h += sv("g", { "class":"lr-lip" }, g) + sv("line", { x1:0, y1:MT, x2:VW, y2:MT, "class":"lr-edge" }) + sv("line", { x1:0, y1:MB, x2:VW, y2:MB, "class":"lr-edge" });
  if (o.unc) h += sv("rect", { x:10, y:MT - 1, width:16, height:MB - MT + 2, "class":"lr-pore" }) + txt(18, 102, "leak", "lr-tb lr-halo", "middle");
  // lumen and stroma H⁺
  h += POOL.slice(0, nDots(o.ph)).map(function(p){ return hDot(p[0], p[1]); }).join("") + STROMA_H.slice(0, 3).map(function(p){ return hDot(p[0], p[1]); }).join("");
  // complexes, left to right
  h += cplx(40, 96, 52, 80, "PSII") + carrier(118, 134, "PQ") + cplx(142, 98, 48, 74, "cyt", "b₆f") + carrier(214, 184, "PC") + cplx(236, 96, 52, 80, "PSI") + carrier(310, 92, "Fd");
  h += sv("rect", { x:334, y:80, width:44, height:32, rx:9, "class":"lr-cx" }) + txt(378, 72, "NADP⁺ reductase", "lr-tb", "end");
  h += txt(42, 194, "splits water", "lr-ts lr-halo", "middle");
  if (o.herb) h += sv("rect", { x:91, y:124, width:16, height:20, rx:3, "class":"lr-plug" }) + sv("path", { d:"M94 128 L104 140 M104 128 L94 140", "class":"lr-plugx" }) + txt(66, 158, "blocked", "lr-tcs", "middle");
  // ATP synthase: membrane part (rotor drawn by the flow layer), stalk, stator, head
  h += sv("rect", { x:444, y:106, width:48, height:56, rx:9, "class":"lr-fo" }) + sv("rect", { x:463, y:62, width:10, height:46, rx:3, "class":"lr-stalk" }) + sv("path", { d:"M490 108 L494 58", "class":"lr-stator" });
  h += sv("ellipse", { cx:468, cy:44, rx:26, ry:19, "class":"lr-head" }) + sv("path", { d:"M450 36 Q468 28 486 36 M447 50 Q468 58 489 50", "class":"lr-lobe" });
  if (o.blk) h += sv("rect", { x:438, y:158, width:60, height:14, rx:3, "class":"lr-plug" }) + txt(468, 168.5, "blocked", "lr-tplug", "middle");
  h += txt(468, o.blk ? 188 : 180, "ATP synthase", "lr-tb lr-halo", "middle");
  // compartment labels
  h += txt(96, 20, "Stroma: pH 8", "lr-tb lr-halo") + txt(8, 282, "Lumen (inside the thylakoid): pH " + MV.num(Math.round(o.ph * 10) / 10), "lr-tb lr-halo");
  return h;
}
function rotorSVG(rot){
  var h = "";
  for (var k = 0; k < 6; k++) { var a = (rot + k * 60) * Math.PI / 180, c = Math.cos(a); if (c <= 0) continue; h += sv("rect", { x:468 + 19 * Math.sin(a) - 3, y:111, width:6, height:46, rx:3, "class":"lr-rot", opacity:f1((0.45 + 0.55 * c) * 100) / 100 }); }
  return h;
}
// live particles at time t (s); r = rates(); n = visible lumen dots (targets for incoming H⁺)
function flowSVG(r, t, rot, n){
  var h = rotorSVG(rot), m = Math.max(1, n);
  function tgt(i){ return POOL[pm(i * 7, m)] || [260, 230]; }
  if (r.L) {
    var pr = r.L * 0.7;
    h += stream(pr, 0.5, t, function(k){ return photonSVG(20, 22, lerp(20, 50, k), lerp(22, 92, k)); });
    h += stream(pr, 0.5, t + 0.37, function(k){ return photonSVG(214, 22, lerp(214, 244, k), lerp(22, 92, k)); });
  }
  h += stream(r.hw * 0.15, 1.1, t, function(k, i){ var q = tgt(i); return hDot(lerp(66, q[0], k), lerp(192, q[1], k), fade(k) * 0.6 + 0.4); });
  h += stream(r.hc * 0.15, 1.4, t, function(k, i){ var p = polyAt([[166, 50], [166, 110], [166, 162], tgt(i + 3)], k); return hDot(p[0], p[1]); });
  h += stream(r.flow * 0.15, 1.6, t, function(k){ var p = polyAt(SYN, k); return hDot(p[0], p[1], k > 0.8 ? (1 - k) / 0.2 : 1); });
  h += stream(r.leak * 0.15, 1.5, t, function(k){ var p = polyAt(LEAK, k); return hDot(p[0], p[1], k > 0.8 ? (1 - k) / 0.2 : 1); });
  h += stream(r.nadph * 0.3, 0.9, t, function(k){ var p = polyAt([[294, 36], [342, 86]], k); return hDot(p[0], p[1], k > 0.8 ? (1 - k) / 0.2 : 1); });
  h += stream(r.e * 0.25, 3, t, function(k){ var p = polyAt(EP, k); return eDot(p[0], p[1], k > 0.9 ? (1 - k) / 0.1 : 1); });
  h += stream(r.cyc * 0.5, 3.2, t, function(k){ var p = polyAt(CP, k); return eDot(p[0], p[1]); });
  h += stream(r.o2 * 0.6, 2, t, function(k){ var p = polyAt([[84, 198], [120, 230], [140, 254]], k); return tok("O₂", p[0], p[1], fade(k)); });
  h += stream(r.nadph * 0.3, 1.5, t, function(k){ var p = polyAt([[402, 88], [418, 24]], k); return tok("NADPH", p[0], p[1], fade(k)); });
  h += stream(r.atp * 0.3, 1.5, t, function(k){ var p = polyAt([[492, 48], [494, 14]], k); return tok("ATP", p[0], p[1], fade(k)); });
  if (r.stuck) h += eDot(70, 126);
  return h;
}
// still frame (reduced motion, hero end): arrows for every flow that is running, tokens at the outputs
function flowStaticSVG(r){
  var h = rotorSVG(20), i;
  for (i = 0; i < r.L; i++) h += photonSVG(12 + i * 10, 24 + i * 6, 42 + i * 8, 92) + photonSVG(206 + i * 10, 24 + i * 6, 236 + i * 8, 92);
  if (r.e) { h += arrowPath(EP, "lr-epath"); [0.12, 0.45, 0.8].forEach(function(k){ var p = polyAt(EP, k); h += eDot(p[0], p[1]); }); }
  if (r.cyc) h += arrowPath(CP, "lr-epath lr-cyc");
  if (r.hc) h += arrowPath([[166, 50], [166, 112], [166, 214]], "lr-hpath");
  if (r.hw) h += arrowPath([[74, 192], [108, 214]], "lr-hpath");
  if (r.flow) h += arrowPath(SYN, "lr-hpath");
  if (r.leak) h += arrowPath(LEAK, "lr-hpath");
  if (r.nadph) h += arrowPath([[294, 36], [336, 80]], "lr-hpath") + tok("NADPH", 418, 24);
  if (r.atp) h += tok("ATP", 494, 16);
  if (r.o2) h += arrowPath([[82, 196], [124, 236]], "lr-tpath") + tok("O₂", 134, 250);
  if (r.stuck) h += eDot(70, 126);
  return h;
}
var LEGEND = '<span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5" class="lr-e"/></svg>electron (e⁻)</span><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="4.4" class="lr-h"/></svg>H⁺</span>' +
  '<span><svg viewBox="0 0 22 14" aria-hidden="true"><path d="M1 3 Q6 0 9 5 T17 8 M13 10 L18 9 L15 5" class="lr-photon"/></svg>light</span><span class="lr-lg-t" style="--c:var(--bio-o2)">O₂</span><span class="lr-lg-t" style="--c:var(--bio-nadh)">NADPH</span><span class="lr-lg-t" style="--c:var(--bio-atp)">ATP</span>';

// ---------- @component S3 energyLedger — supply vs demand bars for ATP and NADPH (Energy budget mode; task preview) ----------
// ledgerHTML({aS, aD, nS, nD, k (0…1 grow), hide, max}) -> html
function ledgerHTML(o){
  var max = o.max || 12, k = o.k == null ? 1 : o.k;
  function bar(cls, v){ return '<span class="lr-bt"><i class="' + cls + '" style="width:' + f1(clamp(v * k / max, 0, 1) * 100) + '%"></i></span>'; }
  function grp(name, tokc, s, d){
    var st = o.hide ? "? (predict first)" : budgetText(s, d);
    return '<div class="lr-lg" style="--lc:var(' + tokc + ')"><p class="lr-lgh"><span class="bio-tok" style="--tok:var(' + tokc + ')">' + name + "</span> " + st + "</p>" +
      '<div class="lr-br"><span class="lr-bl">Supply</span>' + bar("lr-bs", o.hide ? 0 : s) + "<b>" + (o.hide ? "?" : fmt(s * k)) + "</b></div>" +
      '<div class="lr-br"><span class="lr-bl">Demand</span>' + bar("lr-bd", o.hide ? 0 : d) + "<b>" + (o.hide ? "?" : fmt(d * k)) + "</b></div></div>";
  }
  return '<div class="lr-ledger" role="group" aria-label="Energy budget: supply and demand per second">' + grp("ATP", "--bio-atp", o.aS, o.aD) + grp("NADPH", "--bio-nadh", o.nS, o.nD) + "</div>";
}

// ---------- Explore: Thylakoid membrane simulator ----------
var EXR = null;   // restarts the live loop (onShow)
function explore(host, api){
  var C = api.content, S = api.S;
  var D = { mode:"mem", L:0, herb:false, unc:false, blk:false, c:0, t:0 };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  var disp = { ph:rates(S).lum }, hide = false, barK = 1, anim = null, pend = null, raf = null, lastT = 0, lastDraw = 0, rot = 0, readSig = "", what = "";
  host.innerHTML = '<div class="pg lr-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="lr-stage"><svg id="lr-svg" viewBox="0 0 520 290" role="img" focusable="false"><g id="lr-gs"></g><g id="lr-gf"></g></svg></div>' +
    '<p class="lr-legend tiny">' + LEGEND + '</p><p class="lr-cap" id="lr-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="lr-mode"></div><div id="lr-light"></div>' +
      '<div class="lr-panel" id="lr-tog"><p class="lr-ptitle">Switch parts of the membrane</p><div class="lr-sws" id="lr-sws"></div></div>' +
      '<div class="lr-panel" id="lr-bud"><div id="lr-cyc"></div><div id="lr-dem"></div><p class="tiny muted lr-pnote">Energy budget mode uses an intact membrane: the toggles apply in Membrane mode only.</p></div></div>' +
    '<div class="pg-read"><dl class="read" id="lr-read" aria-live="polite"></dl><div id="lr-led"></div><p class="tiny muted lr-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var svg = $("#lr-svg"), gS = $("#lr-gs"), gF = $("#lr-gf");
  var TG = {}; C.toggles.forEach(function(t){ TG[t[0]] = t[1]; });
  var modeR = radios($("#lr-mode"), { label:"Mode", options:[{ id:"mem", t:"Membrane" }, { id:"budget", t:"Energy budget" }], value:S.mode, onChange:function(v){ change({ mode:v }, "Mode: " + (v === "mem" ? "Membrane" : "Energy budget")); } });
  var lightR = radios($("#lr-light"), { label:"Light", options:LN.map(function(t, i){ return { id:i, t:t }; }), value:S.L, onChange:function(v){ change({ L:+v }, "Light: " + LN[+v]); } });
  var sws = switches($("#lr-sws"), { items:C.toggles, get:function(id){ return S[id]; }, onChange:function(id, on){ var p = {}; p[id] = on; change(p, MV.plain(TG[id]) + (on ? " switched on" : " switched off")); } });
  var cycS = slider($("#lr-cyc"), { id:"lr-c", label:"Cyclic electron flow (electron pairs per second)", min:0, max:8, step:1, value:S.c, short:String, unit:function(v){ return v + " electron pair" + (v === 1 ? "" : "s") + " per second"; }, onChange:function(v){ change({ c:v }, "Cyclic electron flow: " + v + " pair" + (v === 1 ? "" : "s") + " per second"); } });
  var demS = slider($("#lr-dem"), { id:"lr-t", label:"Calvin cycle demand (CO₂ fixed per second)", min:0, max:3, step:1, value:S.t, short:String, unit:function(v){ return v + " CO₂ fixed per second"; }, onChange:function(v){ change({ t:v }, "Calvin cycle demand: " + v + " CO₂ per second"); } });

  function mem(){ return S.mode === "mem"; }
  function sceneOpts(){ return { ph:disp.ph, herb:mem() && S.herb, unc:mem() && S.unc, blk:mem() && S.blk }; }
  function describe(label, b, a){
    var parts = [], outs = [];
    if (b.lum !== a.lum) parts.push("Lumen pH " + fmt(b.lum) + " → " + fmt(a.lum) + " (" + (a.ratio <= 1 ? "no gradient" : MV.num(a.ratio) + " times the stroma’s H⁺") + ")");
    [["o2", "O₂"], ["nadph", "NADPH"], ["atp", "ATP"]].forEach(function(q){ if (b[q[0]] !== a[q[0]]) outs.push(q[1] + " " + fmt(b[q[0]]) + " → " + fmt(a[q[0]])); });
    if (outs.length) parts.push("Per second: " + outs.join(", "));
    return label + ". " + (parts.length ? parts.join(". ") + "." : "No change to the outputs.");
  }
  function stop(){
    if (anim) { anim(); anim = null; }
    disp.ph = rates(S).lum; barK = 1;
    if (pend) { var d = pend; pend = null; d(); }
  }
  function change(patch, label){
    stop();
    var b = rates(S);
    Object.keys(patch).forEach(function(k){ S[k] = patch[k]; });
    hide = false;
    var a = rates(S);
    what = describe(label, b, a);
    api.save(); paint(); MV.changed();
    phTo(b.lum, a.lum, 1300, null);
  }
  function phTo(from, to, dur, done){
    if (from === to) { disp.ph = to; paintStatic(); if (done) done(); return; }
    anim = MV.tween({ dur:dur, ease:MV.ease, step:function(k){ disp.ph = lerp(from, to, k); paintStatic(); }, done:function(){ anim = null; disp.ph = to; paintStatic(); if (done) done(); } });
  }
  function sync(){
    modeR.set(S.mode); lightR.set(S.L); sws.paint(); cycS.set(S.c); demS.set(S.t);
    $("#lr-tog").hidden = !mem(); $("#lr-bud").hidden = mem();
  }
  function aria(r){
    var d = LN[S.L] + " light. Lumen pH " + fmt(r.lum) + ", stroma pH 8. Making " + fmt(r.atp) + " ATP and " + fmt(r.nadph) + " NADPH per second.";
    if (mem()) C.toggles.forEach(function(t){ if (S[t[0]]) d += " " + MV.plain(t[1]) + " on."; });
    else d += " Cyclic flow " + S.c + " pairs per second; Calvin cycle demand " + S.t + " CO₂ per second" + (hide ? "." : ": ATP " + budgetText(r.atp, r.dA) + "; NADPH " + budgetText(r.nadph, r.dN) + ".");
    return d;
  }
  function paintStatic(){
    gS.innerHTML = sceneSVG(sceneOpts());
    if (MV.reduceMotion) gF.innerHTML = flowStaticSVG(rates(S));
  }
  function paintLedger(){
    var r = rates(S);
    $("#lr-led").innerHTML = mem() ? "" : ledgerHTML({ aS:r.atp, aD:r.dA, nS:r.nadph, nD:r.dN, k:barK, hide:hide });
  }
  function paintRead(){
    var r = rates(S), rows = [];
    rows.push(["Light", LN[S.L]]);
    rows.push(["O₂ released", per(r.o2)]);
    rows.push(["Electrons through the chain", per(r.e) + (r.cyc ? " (+ " + 2 * r.cyc + " cycling around PSI)" : "")]);
    rows.push(["NADPH made", per(r.nadph)]);
    rows.push(["H⁺ moved into the lumen", r.hin ? per(r.hin) + " (" + fmt(r.hw) + " from water, " + fmt(r.hc) + " by cytochrome b₆f)" + (r.leak ? ", all leaking back out" : "") : "0 per second"]);
    rows.push(["ATP made", per(r.atp)]);
    rows.push(["Lumen pH / stroma pH", fmt(r.lum) + " / 8"]);
    rows.push(["H⁺ in lumen compared with stroma", ratioText(r.ratio)]);
    rows.push(["Status", r.status]);
    if (!mem()) { rows.push(["ATP supply vs demand", hide ? "? (make your prediction)" : budgetText(r.atp, r.dA)]); rows.push(["NADPH supply vs demand", hide ? "? (make your prediction)" : budgetText(r.nadph, r.dN)]); }
    var sig = JSON.stringify(rows); if (sig !== readSig) { readSig = sig; $("#lr-read").innerHTML = MV.readoutHTML(rows); }
    svg.setAttribute("aria-label", aria(r));
  }
  function paint(){
    sync(); paintStatic(); paintRead(); paintLedger();
    $("#lr-cap").textContent = what || (mem() ? "Membrane mode: set the light, then switch parts of the membrane on or off." : "Energy budget mode: compare what the light reactions supply with what the Calvin cycle uses.");
    run();
  }
  // live loop (about 30 frames per second, only while the diagram is on screen)
  function visible(){ var b = svg.getBoundingClientRect(); return b.width > 0 && !document.hidden; }
  function frame(now){
    raf = null;
    if (MV.reduceMotion || !visible()) return;
    raf = requestAnimationFrame(frame);
    if (now - lastDraw < 32) return;
    var t = now / 1000, dt = lastT ? Math.min(0.1, t - lastT) : 0; lastT = t; lastDraw = now;
    var r = rates(S); rot = (rot + dt * r.atp * 45) % 360;
    gF.innerHTML = flowSVG(r, t, rot, nDots(disp.ph));
  }
  function run(){ if (MV.reduceMotion) return; if (!raf) { lastT = 0; raf = requestAnimationFrame(frame); } }
  EXR = run;
  document.addEventListener("visibilitychange", function(){ if (!document.hidden) run(); });
  paint();

  function chal(id){
    var r = rates(S), anyT = S.herb || S.unc || S.blk;
    if (!mem()) return { ok:false, msg:"Switch to Membrane mode first: this challenge is about the membrane itself." };
    if (id === "tc1") {
      if (anyT) return { ok:false, msg:"Use the light alone: switch every toggle off." };
      if (S.L === 2) return { ok:true };
      if (S.L === 3) return { ok:false, msg:"That’s 1000 times: 3 pH units." };
      if (S.L === 1) return { ok:false, msg:"That’s only 10 times." };
      return { ok:false, msg:"With the light off there’s no gradient: the lumen and the stroma are both pH 8." };
    }
    if (id === "tc2") {
      if (S.L !== 3) return { ok:false, msg:"Set the light to High first." };
      if (S.herb) return { ok:false, msg:"Everything stops." };
      if (S.unc) return { ok:true };
      if (S.blk) return { ok:false, msg:"ATP stops, but back-pressure halves electron flow: O₂ is 1.5 per second, not 3." };
      return { ok:false, msg:"O₂ and NADPH are at full rate, but ATP is still being made: " + per(r.atp) + "." };
    }
    if (id === "tc3") {
      if (S.herb) return { ok:false, msg:"The herbicide stops everything: no H⁺ is moved in, so the lumen stays at pH 8." };
      if (S.unc) return { ok:false, msg:"A leak flattens the gradient." };
      if (S.L === 3 && S.blk) return { ok:true };
      if (S.L === 3) return { ok:false, msg:"1000 times. The H⁺ still has a way out." };
      if (S.blk && S.L === 2) return { ok:false, msg:"Lumen pH 5: 1000 times." };
      if (S.blk && S.L === 1) return { ok:false, msg:"Lumen pH 6: 100 times." };
      return { ok:false, msg:"Lumen pH " + fmt(r.lum) + ": " + ratioText(r.ratio) + ". You need lumen pH 4." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop(); var s = p.start;
        S.mode = s.mode; S.L = s.L; S.herb = S.unc = S.blk = false;
        if (s.mode === "budget") { S.c = s.c; S.t = s.t; }
        hide = !!p.reveal; barK = p.reveal ? 0 : 1; disp.ph = rates(S).lum; what = "";
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        function fin(){ var d = pend; pend = null; if (d) MV.wait(400, d); }
        if (p.reveal) {
          hide = false; paintRead();
          anim = MV.tween({ dur:1800, ease:MV.ease, step:function(k){ barK = k; paintLedger(); }, done:function(){ anim = null; barK = 1; var r = rates(S); what = "Revealed: supply " + fmt(r.atp) + " ATP and " + fmt(r.nadph) + " NADPH per second; demand " + fmt(r.dA) + " ATP and " + fmt(r.dN) + " NADPH. ATP is short by " + fmt(r.dA - r.atp) + " per second."; paint(); fin(); } });
          return;
        }
        var b = rates(S), lab = [];
        Object.keys(p.to).forEach(function(k){ S[k] = p.to[k]; lab.push(k === "L" ? "Light: " + LN[p.to[k]] : MV.plain(TG[k]) + " switched on"); });
        var a = rates(S);
        what = describe(lab.join(", "), b, a);
        api.save(); paint(); MV.changed();
        phTo(b.lum, a.lum, 2600, fin);
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: the acid-bath experiment ----------
// @component S7 experimentBench (acid bath) — two beakers in the dark, a thylakoid sac with ATP synthase that soaks, moves and
// releases H⁺; step player stages; an ATP reading. benchSVG(st, t): st = {x, y, ph, atp, seep, flow}
var TPOOL = (function(){ var r = MV.bio.rng("lr-thy"), out = [], n = 0; while (out.length < 24 && n < 4000) { n++; var x = r.range(-40, 40), y = r.range(-16, 16); if ((x * x) / 1764 + (y * y) / 324 > 1) continue; if (out.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < 9; })) continue; out.push([x, y]); } return out; })();
function bufDots(seed, x0, n){ var r = MV.bio.rng(seed), out = []; while (out.length < n) { var x = r.range(x0 + 12, x0 + 168), y = r.range(92, 196); if (Math.abs(x - (x0 + 90)) < 56 && Math.abs(y - 128) < 34) continue; out.push([x, y]); } return out; }
var BA = bufDots("lr-ba", 30, 22), BB = bufDots("lr-bb", 300, 3);
var ATPSPOT = [[322, 104], [458, 104], [322, 148], [458, 148], [390, 168]];
function beaker(x0){ return sv("rect", { x:x0 + 2, y:84, width:176, height:120, rx:8, "class":"lr-buf" }) + sv("path", { d:"M" + x0 + " 56 V198 q0 10 10 10 H" + (x0 + 170) + " q10 0 10 -10 V56", "class":"lr-glass" }); }
function thySVG(x, y, ph){
  var n = clamp(Math.round(2 + 5.5 * (8 - ph)), 0, TPOOL.length), h = sv("ellipse", { cx:x, cy:y, rx:46, ry:24, "class":"lr-thy" });
  h += TPOOL.slice(0, n).map(function(p){ return hDot(x + p[0] * 0.85, y + p[1] * 0.85); }).join("");
  return h + sv("rect", { x:x - 6, y:y - 30, width:12, height:12, rx:3, "class":"lr-fo" }) + sv("rect", { x:x - 2, y:y - 42, width:4, height:13, "class":"lr-stalk" }) + sv("circle", { cx:x, cy:y - 48, r:8, "class":"lr-head" });
}
function benchSVG(st, t){
  var h = sv("circle", { cx:20, cy:20, r:9, "class":"lr-lamp" }) + sv("path", { d:"M13 27 L27 13", "class":"lr-lampx" }) + txt(36, 24, "Lights off: every step is in the dark", "lr-tb");
  h += beaker(30) + beaker(300);
  h += BA.map(function(p){ return hDot(p[0], p[1]); }).join("") + BB.map(function(p){ return hDot(p[0], p[1]); }).join("");
  h += tok("ADP", 326, 190) + tok("Pᵢ", 362, 190) + tok("ADP", 420, 190) + tok("Pᵢ", 456, 190);
  var na = Math.round(st.atp / 20);
  for (var i = 0; i < na; i++) h += tok("ATP", ATPSPOT[i][0], ATPSPOT[i][1]);
  h += txt(120, 226, "pH 4 buffer", "lr-tb", "middle") + txt(390, 226, "pH 8 buffer + ADP + Pᵢ", "lr-tb", "middle");
  if (st.seep) h += stream(5, 1.1, t, function(k, i){ var a = TPOOL[pm(i * 5, TPOOL.length)], s = BA[pm(i * 3, BA.length)]; return hDot(lerp(s[0], st.x + a[0], k), lerp(s[1], st.y + a[1], k)); });
  h += thySVG(st.x, st.y, st.ph) + txt(508, 24, "Thylakoid lumen: pH " + MV.num(Math.round(st.ph * 10) / 10), "lr-tb", "end");
  if (st.flow) h += stream(6, 1.2, t, function(k, i){ var a = TPOOL[pm(i * 7, TPOOL.length)], p = polyAt([[st.x + a[0], st.y + a[1]], [st.x, st.y - 24], [st.x, st.y - 48], [st.x + (i % 2 ? 62 : -62), st.y - 34]], k); return hDot(p[0], p[1], k > 0.8 ? (1 - k) / 0.2 : 1); });
  h += sv("rect", { x:300, y:236, width:150, height:8, rx:4, "class":"lr-gauge" }) + sv("rect", { x:300, y:236, width:f1(150 * clamp(st.atp / 100, 0, 1)), height:8, rx:4, "class":"lr-gauge-f" }) + txt(456, 244, "ATP " + Math.round(st.atp), "lr-tb");
  return h + txt(296, 244, "ATP measured (relative units)", "lr-ts", "end");
}
var BEND = [{ x:120, y:130, ph:8, atp:0 }, { x:120, y:130, ph:4, atp:0 }, { x:390, y:130, ph:4, atp:0 }, { x:390, y:130, ph:7.6, atp:100 }];

// @component atpSynthaseZoom — ATP synthase close-up: rotor ring of c-subunits turned by H⁺ from the lumen side, stalk, stator,
// head whose β lobes change shape; ADP + Pᵢ → ATP; "reversed gradient" still frame. zoomSVG({rot, t, rev, still})
var ZL = (function(){ var r = MV.bio.rng("lr-zl"), out = [], n = 0; while (out.length < 24 && n++ < 6000) { var x = r.range(24, 500), y = r.range(164, 232); if ((x < 180 && y > 200) || (x > 120 && x < 230 && y < 200)) continue; if (out.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < 14; })) continue; out.push([x, y]); } return out; })();
var ZS = (function(){ var r = MV.bio.rng("lr-zs"), out = [], n = 0; while (out.length < 24 && n++ < 6000) { var x = r.range(300, 508), y = r.range(12, 86); if (x < 480 && y < 54) continue; if (x > 318 && x < 350 && y > 50) continue; if (out.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < 13; })) continue; out.push([x, y]); } return out; })();
var HP = [[150, 228], [192, 178], [204, 132], [236, 141], [288, 141], [318, 129], [326, 96], [362, 78], [410, 74]];
function zoomSVG(o){
  var rev = o.rev, rot = o.rot || 0, h = "";
  h += sv("rect", { x:0, y:0, width:520, height:92, "class":"lr-stroma" }) + sv("rect", { x:0, y:150, width:520, height:100, "class":"lr-lumen" }) + sv("rect", { x:0, y:92, width:520, height:58, "class":"lr-mem" });
  h += sv("line", { x1:0, y1:92, x2:520, y2:92, "class":"lr-edge" }) + sv("line", { x1:0, y1:150, x2:520, y2:150, "class":"lr-edge" });
  h += ZL.slice(0, rev ? 3 : 22).map(function(p){ return hDot(p[0], p[1]); }).join("") + ZS.slice(0, rev ? 22 : 3).map(function(p){ return hDot(p[0], p[1]); }).join("");
  // stator, ring (back bars, outline, front bars), stalk, head
  h += sv("path", { d:"M330 116 L342 70 L300 30", "class":"lr-stator2" });
  var back = "", front = "";
  for (var k = 0; k < 10; k++) {
    var a = (rot + k * 36) * Math.PI / 180, s = Math.sin(a), x = 260 + 62 * Math.cos(a), w = 8 + 4 * Math.max(0, s);
    var bar = sv("rect", { x:x - w / 2, y:99, width:w, height:44, rx:4, "class":"lr-csub", opacity:s > 0 ? null : 0.35 });
    if (s > 0) front += bar; else back += bar;
  }
  h += back + sv("ellipse", { cx:260, cy:121, rx:66, ry:20, "class":"lr-ring" }) + front;
  h += sv("rect", { x:255, y:62, width:10, height:40, rx:3, "class":"lr-stalk" }) + sv("ellipse", { cx:260, cy:84, rx:f1(1 + 4.5 * Math.abs(Math.cos(rot * Math.PI / 180))), ry:3, "class":"lr-mark" });
  for (var j = 0; j < 6; j++) {
    var ph = (30 + j * 60) * Math.PI / 180, cx = 260 + 22 * Math.cos(ph), cy = 40 + 14 * Math.sin(ph), beta = j % 2 === 0;
    var rr = beta ? 11 + 2.6 * Math.cos(rot * Math.PI / 180 * 1 + j * 2.094) : 11;
    h += sv("circle", { cx:cx, cy:cy, r:rr, "class":beta ? "lr-beta" : "lr-alpha" });
  }
  // labels
  h += txt(8, 16, "Stroma side: pH " + (rev ? "5" : "8"), "lr-tb lr-halo") + txt(8, 244, "Lumen: pH " + (rev ? "8" : "5"), "lr-tb lr-halo");
  h += txt(356, 34, "head", "lr-tb") + txt(356, 48, "ADP + Pᵢ → ATP", "lr-ts") + txt(272, 88, "stalk", "lr-ts") + txt(340, 146, "rotor ring", "lr-ts");
  if (rev) {
    h += txt(260, 204, "Rotor stopped: no ATP", "lr-tbig lr-halo", "middle") + txt(260, 222, "(the gradient points the wrong way)", "lr-ts lr-halo", "middle");
    return h;
  }
  h += txt(36, 214, "H⁺ in from the lumen", "lr-ts lr-halo");
  if (o.still) {
    h += arrowPath(HP, "lr-hpath") + arrowPath([[214, 150], [260, 147], [306, 150]], "lr-rotarr") + txt(260, 166, "turns", "lr-ts lr-halo", "middle");
    h += tok("ADP", 150, 40) + tok("Pᵢ", 160, 66) + arrowPath([[178, 50], [228, 46]], "lr-tpath") + tok("ATP", 200, 12);
    return h;
  }
  var t = o.t || 0;
  h += stream(2.4, 3.4, t, function(k){ var p = polyAt(HP, k); return hDot(p[0], p[1], k > 0.85 ? (1 - k) / 0.15 : 1); });
  var cyc = (t % 1.6) / 1.6;
  if (cyc < 0.45) { var q = cyc / 0.45; h += tok("ADP", lerp(70, 234, q), lerp(42, 42, q)) + tok("Pᵢ", lerp(84, 238, q), lerp(76, 58, q)); }
  else if (cyc < 0.55) h += sv("circle", { cx:240, cy:44, r:14, "class":"lr-flash" });
  else { var q2 = (cyc - 0.55) / 0.45; h += tok("ATP", lerp(244, 150, q2), lerp(32, 10, q2), 1 - Math.max(0, (q2 - 0.8) / 0.2)); }
  return h;
}

function part3(host, api){
  var C = api.content, S = api.S, B = C.bench, Dd = C.data, Z = C.zoom;
  S.dq = S.dq || {}; S.dqi = S.dqi || 0; S.rev = !!S.rev;
  host.innerHTML = '<div class="lr-p3">' +
    '<div class="lr-st"><h3>' + B.title + "</h3><p>" + B.how + '</p><figure class="lr-fig"><div class="lr-stage lr-stage-bench"><svg id="lr-bench" viewBox="0 0 520 250" role="img" focusable="false"></svg></div>' +
      '<figcaption><span class="lr-bcap" id="lr-bcap"></span> <span class="tiny muted">' + B.caption + '</span></figcaption></figure><div id="lr-bplay"></div></div>' +
    '<details class="alg lr-data" open><summary>' + Dd.title + "</summary><p>" + Dd.how + '</p><div id="lr-tbl"></div><div class="lr-dq" id="lr-dq"></div></details>' +
    '<div class="lr-st lr-zst"><h3>' + Z.title + "</h3><p>" + Z.how + '</p><figure class="lr-fig"><div class="lr-stage lr-stage-zoom"><svg id="lr-zoom" viewBox="0 0 520 250" role="img" focusable="false"></svg></div><figcaption id="lr-zcap" aria-live="polite"></figcaption></figure>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="lr-zplay" data-k="lrzplay">Play the close-up</button><button type="button" class="btn ghost sm" id="lr-zrev" data-k="lrzrev" aria-pressed="false">Reverse the gradient</button></div></div></div>';

  // Station 1: bench + step player
  var bAnim = null, bPrev = null, bsvg = $("#lr-bench", host);
  function bDraw(st, t){ bsvg.innerHTML = benchSVG(st, t); }
  function bAria(i){ bsvg.setAttribute("aria-label", "Experiment bench, in the dark. Left beaker: pH 4 buffer. Right beaker: pH 8 buffer with ADP and Pᵢ. Step " + (i + 1) + " of 4: " + MV.plain(B.steps[i]) + (i === 3 ? " The ATP reading rises to 100 relative units." : "")); }
  function bGo(i){
    if (bAnim) { bAnim(); bAnim = null; }
    var from = bPrev; bPrev = i;
    $("#lr-bcap", host).textContent = MV.plain(B.steps[i]); bAria(i);
    if (from === null || i !== from + 1 || MV.reduceMotion) { bDraw(BEND[i], 0); return; }
    var A = BEND[from], Z2 = BEND[i], dur = i === 3 ? 2800 : 2000;
    bAnim = MV.tween({ dur:dur, ease:lin, step:function(k){
      var st = { x:lerp(A.x, Z2.x, k), y:lerp(A.y, Z2.y, k) - (i === 2 ? 92 * Math.sin(Math.PI * k) : 0), ph:lerp(A.ph, Z2.ph, i === 3 ? Math.min(1, k * 1.15) : k), atp:lerp(A.atp, Z2.atp, k), seep:i === 1 && k < 0.95, flow:i === 3 && k < 0.97 };
      bDraw(st, k * dur / 1000);
    }, done:function(){ bAnim = null; bDraw(BEND[i], 0); } });
  }
  MV.player($("#lr-bplay", host), { count:4, render:bGo, label:function(i){ return "Step " + (i + 1) + " of 4: " + B.short[i]; }, interval:3400 });

  // Station 2: data table with tappable rows + four prompts
  function dqs(id){ return S.dq[id] || (S.dq[id] = { sel:[], solved:false, tries:0 }); }
  function cur(){ return Dd.prompts[S.dqi]; }
  function paintTable(){
    var p = cur(), st = dqs(p.id), rowsP = p.kind === "rows", ans = rowsP && st.solved ? MV.ans(p) : [];
    MV.keepFocus($("#lr-tbl", host), function(){
      $("#lr-tbl", host).innerHTML = '<div class="tbl-wrap"><table class="lr-tbl"><caption class="vh">Model data: six tubes of thylakoids, all kept in the dark</caption><thead><tr>' + Dd.head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
        Dd.rows.map(function(r, i){ var n = i + 1, on = st.sel.indexOf(n) >= 0, ok = ans.indexOf(n) >= 0;
          return '<tr class="' + (on ? "on" : "") + (ok ? " ok" : "") + '"><th scope="row"><button type="button" class="lr-rowb" data-row="' + n + '" data-k="lrrow' + n + '" aria-pressed="' + on + '"' + (!rowsP || st.solved ? " disabled" : "") + '><span aria-hidden="true">' + (ok ? "✓" : on ? "●" : "○") + "</span> Tube " + n + "</button></th>" + r.map(function(c){ return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") +
        '</tbody></table></div><p class="tiny muted lr-tnote"><span class="bio-model">Model data</span> ' + (rowsP ? "Tap rows to select them for this prompt." : "Rows aren’t used for this prompt: choose an answer below.") + "</p>";
    });
  }
  function paintDQ(){
    var P = Dd.prompts, i = S.dqi, p = P[i], st = dqs(p.id), h = '<div class="pred-top"><span class="tiny muted">Prompt ' + (i + 1) + " of " + P.length + '</span><span class="dots" aria-hidden="true">' + P.map(function(q, k){ return '<span class="dot' + (dqs(q.id).solved ? " done" : "") + (k === i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<p class="lr-dqp">' + p.prompt + "</p>";
    if (p.kind === "rows") {
      h += '<p class="tiny">Selected: <strong>' + (st.sel.length ? st.sel.slice().sort().map(function(n){ return "tube " + n; }).join(", ") : "none yet") + "</strong></p>";
      if (!st.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-dq="check" data-k="lrdqchk"' + (st.sel.length ? "" : " disabled") + '>Check</button><button type="button" class="btn ghost sm" data-dq="clear" data-k="lrdqclr"' + (st.sel.length ? "" : " disabled") + ">Clear</button></div>";
    } else {
      h += '<div class="sq-c lr-dqc" role="group" aria-label="Choices">' + p.options.map(function(o, k){ var on = st.last === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-dc="' + k + '" data-k="lrdc' + p.id + k + '"' + (st.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    }
    if (st.msg) h += MV.fbHTML(st.msg[0], st.msg[1]);
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-dq="prev" data-k="lrdqprev"' + (i === 0 ? " disabled" : "") + '>Previous prompt</button><button type="button" class="btn ' + (st.solved ? "primary" : "ghost") + ' sm" data-dq="next" data-k="lrdqnext"' + (i === P.length - 1 ? " disabled" : "") + ">Next prompt</button></div>";
    if (P.every(function(q){ return dqs(q.id).solved; })) h += '<p class="sort-done">All four prompts answered. The pattern: ATP needs a pH difference pointing out of the thylakoid, a sealed membrane, and ADP; light isn’t needed once the gradient exists.</p>';
    MV.keepFocus($("#lr-dq", host), function(){ $("#lr-dq", host).innerHTML = h; });
  }
  function checkRows(p, st){
    var ans = MV.ans(p), sel = st.sel.slice().sort(), ok = sel.length === ans.length && ans.every(function(n){ return sel.indexOf(n) >= 0; });
    if (ok) { st.solved = true; st.msg = ["good", "<strong>✓ Correct.</strong> " + p.right]; return; }
    st.tries++;
    var bad = sel.filter(function(n){ return ans.indexOf(n) < 0; })[0];
    st.msg = ["bad", "<strong>✗ Not quite.</strong> " + (bad != null ? p.rowFb[String(bad)] + " Change your selection and check again." : p.missing)];
  }
  $("#lr-tbl", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-row]"); if (!b || b.disabled) return;
    var p = cur(), st = dqs(p.id), n = +b.dataset.row, k = st.sel.indexOf(n);
    if (k >= 0) st.sel.splice(k, 1); else st.sel.push(n);
    st.msg = null; api.save(); paintTable(); paintDQ();
  });
  $("#lr-dq", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var p = cur(), st = dqs(p.id), a = b.dataset.dq;
    if (a === "prev" || a === "next") { S.dqi = clamp(S.dqi + (a === "next" ? 1 : -1), 0, Dd.prompts.length - 1); api.save(); paintTable(); paintDQ(); return; }
    if (a === "clear") { st.sel = []; st.msg = null; }
    else if (a === "check") checkRows(p, st);
    else if (b.dataset.dc != null) {
      var k = +b.dataset.dc, o = p.options[k]; st.last = k;
      if (MV.ok(o)) { st.solved = true; st.msg = ["good", "<strong>✓ Correct.</strong> " + o.why]; }
      else { st.tries++; st.msg = ["bad", "<strong>✗ Not quite.</strong> " + o.why + " Try another answer."]; }
    } else return;
    api.save(); paintTable(); paintDQ();
    if (a === "check" || b.dataset.dc != null) MV.focusFb($("#lr-dq", host));
  });

  // Station 3: ATP synthase close-up
  var zsvg = $("#lr-zoom", host), zAnim = null, zRot = 0, zplay = $("#lr-zplay", host), zrev = $("#lr-zrev", host);
  function zAria(){ zsvg.setAttribute("aria-label", S.rev ? "ATP synthase close-up with the gradient reversed: many H⁺ on the stroma side, few in the lumen. The rotor ring is still and no ATP is made." : "ATP synthase close-up: H⁺ from the crowded lumen enters the rotor ring in the membrane, rides around and leaves into the stroma. The ring and stalk turn, the head changes shape, and ADP + Pᵢ are joined into ATP."); }
  function zPaint(still){ zsvg.innerHTML = zoomSVG({ rot:zRot, t:0, rev:S.rev, still:still }); zAria(); $("#lr-zcap", host).innerHTML = S.rev ? Z.reversed : Z.normal; zrev.setAttribute("aria-pressed", String(S.rev)); }
  function zStop(){ if (zAnim) { zAnim(); zAnim = null; } zplay.disabled = false; }
  function zPlay(){
    zStop();
    if (MV.reduceMotion) { zPaint(true); return; }
    zplay.disabled = true;
    var rot0 = zRot, rev = S.rev, dur = rev ? 2400 : 6000;
    zAnim = MV.tween({ dur:dur, ease:lin, step:function(k){
      var t = k * dur / 1000;
      zRot = rev ? rot0 + 140 * (dur / 1000) * (k - k * k / 2) : rot0 + 140 * t;
      zsvg.innerHTML = zoomSVG({ rot:zRot, t:t, rev:rev, still:false });
    }, done:function(){ zAnim = null; zplay.disabled = false; zPaint(true); } });
  }
  zplay.addEventListener("click", function(){ if (!zplay.disabled) zPlay(); });
  zrev.addEventListener("click", function(){ S.rev = !S.rev; api.save(); zPaint(true); zPlay(); });
  paintTable(); paintDQ(); zPaint(true);
}

// ---------- Practice 2: Predict and calculate (N4 number entry incl. a two-box item, and chips; adapted from SBI4U 03 puzzles) ----------
function calc(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:"", vals:["", ""], tries:0, hint:0, solved:false, first:null }); if (!x.vals) x.vals = ["", ""]; return x; }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function parseVal(raw){ var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Z].*$/, "").replace(/×/g, "").replace(/\s/g, ""); var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function inputs(it, x){
    if (it.kind === "pair") return '<div class="lr-pair">' + it.labels.map(function(l, k){ return '<div class="numrow"><label for="li-' + it.id + k + '">' + l + ':</label><input class="numin" id="li-' + it.id + k + '" data-lin="' + it.id + '" data-ix="' + k + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.vals[k]) + '"' + (x.solved ? " disabled" : "") + "></div>"; }).join("") + "</div>";
    return '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="lr-unit">' + it.unit + "</span></div>";
  }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = host.querySelector('[data-li="' + it.id + '"]');
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "chips") {
      h += '<div class="sq-c lr-chips" role="group" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.last === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ci="' + k + '" data-k="' + it.id + "c" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
      if (!x.solved && it.hints) h += '<div class="q-actions">' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    } else {
      h += inputs(it, x);
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
    }
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (x.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; var x = ist(id); if (e.target.dataset.ix != null) x.vals[+e.target.dataset.ix] = e.target.value; else x.val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = item(box.dataset.li), x = ist(it.id), ok = null;
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.ci != null) {
      var o = it.options[+b.dataset.ci]; x.last = +b.dataset.ci; ok = MV.ok(o);
      msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + o.why + " Try again.";
      if (ok) x.why = o.why;
    } else if (b.dataset.act === "check") {
      if (it.kind === "pair") {
        var vs = x.vals.map(parseVal), ans = MV.ans(it);
        if (vs[0] == null || vs[1] == null) { msgs[it.id] = "Enter a number in both boxes, such as 3 or 6."; paintItem(it); return; }
        ok = Math.abs(vs[0] - ans[0]) < 1e-6 && Math.abs(vs[1] - ans[1]) < 1e-6;
        msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + it.wrongFb + " Try again.";
      } else {
        var v = parseVal(x.val), an = MV.ans(it);
        if (v == null) { msgs[it.id] = "Enter a number, such as 10 or 250."; paintItem(it); return; }
        ok = Math.abs(v - an) <= 1e-6 * Math.max(1, Math.abs(an));
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return Math.abs(v - w.match) <= 1e-6 * Math.max(1, Math.abs(w.match)); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : "Check your working against the model and try again.") + " Try again."; }
        else msgs[it.id] = null;
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

// ---------- Performance task: Balance the budget (inputs + S3 energy ledger) ----------
var task = (function(){
  var api = null, T = null;
  function st(){ var s = api.S; if (s.L == null) s.L = 0; if (s.c == null) s.c = 0; if (s.t == null) s.t = 1; s.unc = !!s.unc; return s; }
  function read(){ if (!api) return { L:0, c:0, t:1, unc:false }; var s = st(); return { L:+s.L, c:+s.c, t:+s.t, unc:!!s.unc }; }
  function supply(d){ return { atp:d.unc ? 0 : 2 * d.L + d.c / 2, nadph:2 * d.L }; }
  function draw(){
    var d = read(), s = supply(d), box = $("#lr-tled"); if (!box) return;
    box.innerHTML = ledgerHTML({ aS:s.atp, aD:3 * d.t, nS:s.nadph, nD:2 * d.t, max:12 });
    $("#lr-tnote").innerHTML = "Supply: ATP = 2 × " + d.L + " + " + d.c + " ÷ 2 = " + fmt(2 * d.L + d.c / 2) + (d.unc ? ", but the uncoupler’s leak wastes the gradient, so ATP supply is 0" : "") + "; NADPH = 2 × " + d.L + " = " + fmt(s.nadph) + ". Demand: ATP = 3 × " + d.t + " = " + 3 * d.t + "; NADPH = 2 × " + d.t + " = " + 2 * d.t + ".";
  }
  function parse(k){ var m = /t(\d)-L(\d)-c(\d)/.exec(k) || [0, 0, 0, 0]; return { t:+m[1], L:+m[2], c:+m[3] }; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = st();
      inp.innerHTML = '<div class="lr-tin"><div id="lr-tt"></div><div id="lr-tL"></div><div id="lr-tc"></div><div class="lr-sws" id="lr-tu"></div></div>';
      function upd(){ a.save(); draw(); a.update(); }
      radios($("#lr-tt"), { label:"Calvin demand <i>t</i>", aria:"Calvin demand t, CO₂ per second", cls:"chips", options:[1, 2, 3].map(function(n){ return { id:n, t:n + " CO₂ per second" }; }), value:s.t, onChange:function(v){ s.t = +v; upd(); } });
      radios($("#lr-tL"), { label:"Light level <i>L</i>", aria:"Light level L", options:LN.map(function(t, i){ return { id:i, t:t }; }), value:s.L, onChange:function(v){ s.L = +v; upd(); } });
      slider($("#lr-tc"), { id:"lr-tcs", label:"Cyclic electron pairs per second, <i>c</i>", min:0, max:8, step:1, value:s.c, short:String, unit:function(v){ return v + " pair" + (v === 1 ? "" : "s") + " per second"; }, onChange:function(v){ s.c = v; upd(); } });
      var sw = switches($("#lr-tu"), { items:[["unc", "Uncoupler (H⁺ leak)"]], get:function(){ return s.unc; }, onChange:function(id, on){ s.unc = on; sw.paint(); upd(); } });
      pv.innerHTML = '<div class="lr-tpv"><h4>Energy budget</h4><div id="lr-tled"></div><p class="tiny muted" id="lr-tnote"></p></div>';
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"); if (!g || MV.taskState().found.length < 3) return;
        var ps = g.querySelectorAll("p"); if (ps[1] && T.more) ps[1].innerHTML = ps[1].innerHTML.replace(T.more, "You’ve found all three answers.");
      }, 0); });
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [!d.unc && Math.abs(2 * d.L + d.c / 2 - 3 * d.t) < 1e-9, 2 * d.L === 2 * d.t, !d.unc]; },
    key:function(d){ return "t" + d.t + "-L" + d.L + "-c" + d.c; },
    label:function(k){ var q = parse(k); return "<i>t</i> = " + q.t + ": " + LN[q.L] + " light, <i>c</i> = " + q.c; },
    text:function(k){ var q = parse(k); return "t = " + q.t + ", " + LN[q.L] + " light, c = " + q.c; }
  };
})();

// ---------- hero: photon → electron along the chain → H⁺ into the lumen → pH 8 to 5 → ATP synthase turns, ATP ----------
function hero(f){
  var box = $("#lr-hero"); if (!box) return;
  var cap = f && f.cap;
  box.innerHTML = '<svg viewBox="0 0 520 290" aria-hidden="true" focusable="false"><g class="lr-hs"></g><g class="lr-hf"></g></svg>';
  var gS = $(".lr-hs", box), gF = $(".lr-hf", box), R3 = rates({ mode:"mem", L:3 }), lastPh = null, lastCap = -1;
  var CAPS = [
    "A thylakoid membrane: the stroma above, the lumen (inside the thylakoid) below.",
    "Light hits photosystem II and excites an electron…",
    "…which hops along the chain. At cytochrome b₆f, its energy moves H⁺ into the lumen.",
    "Water splits at PSII: O₂ is released and more H⁺ goes into the lumen. The electron ends at NADP⁺ reductase: NADPH.",
    "H⁺ piles up inside: the lumen falls from pH 8 to pH 5.",
    "H⁺ streams out through ATP synthase. The rotor turns, and ATP appears in the stroma.",
    "Light drives electrons along the chain and piles H⁺ up in the lumen (pH 5). H⁺ flowing out through ATP synthase makes ATP in the stroma; NADPH forms beside it."];
  function setCap(i){ if (cap && i !== lastCap) { cap.textContent = CAPS[i]; lastCap = i; } }
  function scene(ph){ ph = Math.round(ph * 20) / 20; if (ph !== lastPh) { gS.innerHTML = sceneSVG({ ph:ph }); lastPh = ph; } }
  function finalFrame(){ scene(5); gF.innerHTML = flowStaticSVG(R3); setCap(6); }
  if (MV.reduceMotion) { finalFrame(); return; }
  function seg(T, a, b){ return clamp((T - a) / (b - a), 0, 1); }
  function phAt(T){ if (T < 2.6) return 8; if (T < 3.9) return lerp(8, 7.8, seg(T, 2.6, 2.9)); if (T < 5.1) return lerp(7.8, 7.5, seg(T, 3.9, 4.3)); return lerp(7.5, 5, seg(T, 5.1, 7.1)); }
  var RF = rates({ mode:"mem", L:3, blk:false }); RF = Object.assign({}, RF, { atp:0, flow:0 });
  function frameAt(T){
    scene(phAt(T));
    var h = rotorSVG(T > 7.1 ? (T - 7.1) * 270 : 0), p, k;
    setCap(T < 0.6 ? 0 : T < 1.3 ? 1 : T < 3.0 ? 2 : T < 5.1 ? 3 : T < 7.1 ? 4 : 5);
    if (T >= 5.1) { gF.innerHTML = flowSVG(T < 7.1 ? RF : R3, T, T > 7.1 ? (T - 7.1) * 270 : 0, nDots(phAt(T))); return; }
    if (T >= 0.6 && T < 1.3) { k = seg(T, 0.6, 1.3); h += photonSVG(20, 22, lerp(20, 50, k), lerp(22, 92, k)); }
    if (T >= 3.3 && T < 3.8) { k = seg(T, 3.3, 3.8); h += photonSVG(214, 22, lerp(214, 244, k), lerp(22, 92, k)); }
    if (T >= 1.3 && T < 4.5) {
      p = T < 2.3 ? polyAt(EP.slice(0, 3), seg(T, 1.3, 2.3)) : T < 2.9 ? EP[2] : T < 3.8 ? polyAt(EP.slice(2, 5), seg(T, 2.9, 3.8)) : polyAt(EP.slice(4, 7), seg(T, 3.8, 4.5));
      h += eDot(p[0], p[1]) + txt(p[0], p[1] - 9, "e⁻", "lr-etxt lr-halo", "middle");
    }
    if (T >= 2.3 && T < 2.9) { k = seg(T, 2.3, 2.9); p = polyAt([[160, 52], [160, 110], [160, 162], [150, 214]], k); h += hDot(p[0], p[1]); p = polyAt([[172, 58], [172, 110], [172, 162], [192, 226]], k); h += hDot(p[0], p[1]); }
    if (T >= 3.0 && T < 3.5) h += tok("H₂O", 66, 218);
    if (T >= 3.5 && T < 4.6) { k = seg(T, 3.5, 4.6); p = polyAt([[84, 198], [120, 230], [140, 254]], k); h += tok("O₂", p[0], p[1]); h += hDot(lerp(66, 112, Math.min(1, k * 1.6)), lerp(200, 222, Math.min(1, k * 1.6))) + hDot(lerp(66, 30, Math.min(1, k * 1.6)), lerp(200, 236, Math.min(1, k * 1.6))); }
    if (T >= 4.1 && T < 4.5) { k = seg(T, 4.1, 4.5); h += hDot(lerp(294, 342, k), lerp(36, 86, k)); }
    if (T >= 4.5) { k = seg(T, 4.5, 5.1); h += tok("NADPH", lerp(402, 418, k), lerp(88, 24, k), Math.min(1, k * 3)); }
    gF.innerHTML = h;
  }
  setCap(0); frameAt(0);
  MV.tween({ dur:11000, ease:lin, step:function(k){ frameAt(k * 11); }, done:finalFrame });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ calc:calc },
  task:task,
  onShow:function(v){ if (v === "explore" && EXR) EXR(); }
});
})();
