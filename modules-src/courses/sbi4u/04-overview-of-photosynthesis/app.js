// SBI4U 04 Overview of Photosynthesis: hero (two-station factory storyboard), Two-stage factory (S2 pathway stepper in station
// form, with an atom tracker), Limiting factors (three model graphs with region taps; enzyme zoom), factory and tracer puzzles
// (Practice), "Tune the greenhouse" (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function frac(v){ return v - Math.floor(v); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "fz-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function nm(v){ return MV.num(Math.round(v * 100) / 100); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!segs.length) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
// photons: wavy arrows in ink (course plan §3)
function wavy(x1, y1, x2, y2){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, n = Math.max(2, Math.round(L / 2)), d = "";
  for (var i = 0; i <= n; i++) { var s = L * i / n, o = 3 * Math.sin(s / 9 * 2 * Math.PI) * Math.min(1, (L - s) / 7); d += (i ? "L" : "M") + f1(x1 + ux * s - uy * o) + " " + f1(y1 + uy * s + ux * o); }
  return d;
}
function photonSVG(x1, y1, x2, y2){ var L = Math.hypot(x2 - x1, y2 - y1) || 1; return sv("path", { d:wavy(x1, y1, x2, y2) + " " + head(x2, y2, (x2 - x1) / L, (y2 - y1) / L), "class":"fz-photon" }); }
function arrowPath(pts, cls){
  var a = pts[pts.length - 2], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return sv("polyline", { points:pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":cls }) + sv("path", { d:head(b[0], b[1], (b[0] - a[0]) / L, (b[1] - a[1]) / L, 6), "class":cls + " fz-head" });
}

// ---------- @component radioGroup (copied from SBI4U 03 / 01 / MHF4U 25: options may be disabled with dis:true) ----------
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

// @component S2 pathwayStepper — station form (course plan S2): two stations joined by a forward and a return
// conveyor, with in/out flows drawn as guide paths. Molecule tokens (course colour roles) ride each path; each path has a phase
// that advances with its stage's rate, so tokens speed up, slow down and freeze with the model. stationSVG(layout, o) draws the
// static scene; stationFrame(svg, layout, st) redraws the moving parts. Two layouts: "wide" (stations side by side) and "tall"
// (phone: stations stacked, conveyors running down and back up). The atom-tracker overlay (clusters with a --hi halo and the
// isotope symbol) is drawn by trackerFrame. ----------
var LAY = {
  wide:{ w:480, h:320, lr:[14, 84, 168, 136], cc:[298, 84, 168, 136],
    lrT:[98, 104], lrS:[98, 117], ccT:[382, 104], ccS:[382, 117],
    thy:{ cx:98, cy:168, w:96, h:11, n:4, gap:15 }, wheel:{ cx:382, cy:172, r:30 },
    fwd:[[184, 128], [296, 128]], back:[[296, 186], [184, 186]],
    fwdLab:[[240, 112, "middle", "ATP, NADPH"]], backLab:[[240, 212, "middle", "ADP + Pᵢ, NADP⁺"]],
    photons:[[40, 22, 48, 78], [68, 20, 72, 78], [96, 22, 96, 78]], lightLab:[68, 13, "middle"],
    h2o:[[60, 316], [60, 222]], o2:[[150, 82], [160, 8]], co2:[[340, 6], [340, 82]], glu:[[424, 222], [424, 316]], neww:[[340, 222], [340, 316]],
    h2oLab:[82, 296, "start"], o2Lab:[178, 40, "start"], co2Lab:[362, 40, "start"], gluLab:[406, 296, "end"], newwLab:[328, 296, "end"],
    side:{ h2o:1, o2:1, co2:1, glu:-1, neww:-1 } },
  tall:{ w:340, h:580, lr:[16, 76, 308, 124], cc:[16, 356, 308, 124],
    lrT:[170, 96], lrS:[170, 109], ccT:[170, 376], ccS:[170, 389],
    thy:{ cx:170, cy:152, w:110, h:11, n:3, gap:15 }, wheel:{ cx:170, cy:428, r:27 },
    fwd:[[120, 202], [120, 354]], back:[[240, 354], [240, 202]],
    fwdLab:[[148, 262, "start", "ATP, NADPH"]], backLab:[[212, 298, "end", "ADP + Pᵢ,"], [212, 311, "end", "NADP⁺"]],
    photons:[[34, 16, 42, 72], [62, 14, 66, 72], [90, 16, 90, 72]], lightLab:[104, 30, "start"],
    h2o:[[170, 4], [170, 74]], o2:[[272, 74], [286, 6]], co2:[[60, 262], [60, 354]], glu:[[250, 482], [250, 576]], neww:[[100, 482], [100, 576]],
    h2oLab:[192, 30, "start"], o2Lab:[304, 40, "start"], co2Lab:[40, 296, "end"], gluLab:[264, 540, "start"], newwLab:[114, 540, "start"],
    side:{ h2o:1, o2:1, co2:-1, glu:1, neww:1 }, inU:0.3, wcols:4 }
};
var TOK = { atp:["ATP", "--bio-atp", 28], nadph:["NADPH", "--bio-nadh", 42], adp:["ADP", "--ink-2", 28], nadp:["NADP⁺", "--ink-2", 40],
  co2:["CO₂", "--bio-carbon", 30], h2o:["H₂O", "--bio-o2", 32] };
function hexPath(x, y, r){ var d = ""; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; d += (i ? "L" : "M") + f1(x + r * Math.cos(a)) + " " + f1(y + r * Math.sin(a)); } return d + "Z"; }
function tokSVG(k, x, y, a){
  if (a <= 0.01) return "";
  var o = a < 0.99 ? ' opacity="' + f1(a * 100) / 100 + '"' : "", g;
  if (k === "o2") g = sv("circle", { cx:x, cy:y, r:10, "class":"fz-bub" }) + txt(x, y + 3.4, "O₂", "fz-tt fz-tt-o2", "middle");
  else if (k === "glu") g = sv("path", { d:hexPath(x, y, 10), "class":"fz-glu" });
  else { var t = TOK[k]; g = sv("rect", { x:x - t[2] / 2, y:y - 8, width:t[2], height:16, rx:8, fill:"var(" + t[1] + ")" }) + txt(x, y + 3.4, t[0], "fz-tt", "middle"); }
  return "<g" + o + ">" + g + "</g>";
}
function beltN(L){ var a = L.fwd[0], b = L.fwd[1]; return Math.max(2, Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / 48)); }
function edge(u){ return clamp(Math.min(u / 0.12, (1 - u) / 0.12), 0, 1); }
function flowToks(path, n, phase, kinds, a){
  if (a <= 0.01) return "";
  var h = "";
  for (var k = 0; k < n; k++) { var u = frac(phase + k / n), p = polyAt(path, u); h += tokSVG(kinds[k % kinds.length], p[0], p[1], a * edge(u)); }
  return h;
}
function stationSVG(L, o){
  o = o || {};
  var h = "", r;
  // flow guides
  h += arrowPath(L.h2o, "fz-guide") + arrowPath(L.o2, "fz-guide") + arrowPath(L.co2, "fz-guide") + arrowPath(L.glu, "fz-guide") + '<g class="fz-trkonly">' + arrowPath(L.neww, "fz-guide") + "</g>";
  // conveyors
  [["fwd", L.fwd], ["back", L.back]].forEach(function(c){
    var a = c[1][0], b = c[1][1], ux = Math.sign(b[0] - a[0]), uy = Math.sign(b[1] - a[1]);
    h += sv("line", { x1:a[0], y1:a[1], x2:b[0], y2:b[1], "class":"fz-belt" }) + sv("line", { x1:a[0], y1:a[1], x2:b[0], y2:b[1], "class":"fz-belt-d", "data-b":c[0] });
    h += sv("path", { d:head(b[0] - ux * 2, b[1] - uy * 2, ux, uy, 8), "class":"fz-belt-h" });
  });
  // stations
  r = L.lr; h += sv("rect", { x:r[0], y:r[1], width:r[2], height:r[3], rx:12, "class":"fz-st" });
  r = L.cc; h += sv("rect", { x:r[0], y:r[1], width:r[2], height:r[3], rx:12, "class":"fz-st" });
  h += txt(L.lrT[0], L.lrT[1], "Light reactions", "fz-title", "middle") + txt(L.lrS[0], L.lrS[1], "thylakoid membranes", "fz-sub", "middle");
  h += txt(L.ccT[0], L.ccT[1], "Calvin cycle", "fz-title", "middle") + txt(L.ccS[0], L.ccS[1], "stroma", "fz-sub", "middle");
  // thylakoid stack (granum), lit by a --leaf overlay
  var T = L.thy, th = "", tl = "";
  for (var i = 0; i < T.n; i++) { var y = T.cy - (T.n - 1) * T.gap / 2 + i * T.gap; th += sv("rect", { x:T.cx - T.w / 2, y:y - T.h / 2, width:T.w, height:T.h, rx:T.h / 2, "class":"fz-thy" }); tl += sv("rect", { x:T.cx - T.w / 2, y:y - T.h / 2, width:T.w, height:T.h, rx:T.h / 2, "class":"fz-thyl" }); }
  h += th + '<g class="fz-glow" opacity="0">' + tl + "</g>";
  // Calvin wheel
  var W = L.wheel, wh = sv("circle", { cx:W.cx, cy:W.cy, r:W.r, "class":"fz-ring" });
  for (i = 0; i < 6; i++) { var an = i * Math.PI / 3; wh += sv("line", { x1:W.cx, y1:W.cy, x2:W.cx + W.r * Math.cos(an), y2:W.cy + W.r * Math.sin(an), "class":"fz-spoke" }); }
  for (i = 0; i < 5; i++) { var an2 = i * 2 * Math.PI / 5 + 0.3; wh += sv("circle", { cx:W.cx + W.r * Math.cos(an2), cy:W.cy + W.r * Math.sin(an2), r:4.2, "class":"fz-cdot" }); }
  h += '<g class="fz-wheel">' + wh + "</g>" + sv("circle", { cx:W.cx, cy:W.cy, r:5, "class":"fz-hub" });
  // labels
  L.fwdLab.forEach(function(l){ h += txt(l[0], l[1], l[3], "fz-lab", l[2]); });
  L.backLab.forEach(function(l){ h += txt(l[0], l[1], l[3], "fz-lab", l[2]); });
  h += txt(L.lightLab[0], L.lightLab[1], "light", "fz-lab", L.lightLab[2]);
  h += '<g class="fz-flab">' + txt(L.h2oLab[0], L.h2oLab[1], "H₂O", "fz-lab", L.h2oLab[2]) + txt(L.o2Lab[0], L.o2Lab[1], "O₂", "fz-lab", L.o2Lab[2]) +
    txt(L.co2Lab[0], L.co2Lab[1], "CO₂", "fz-lab", L.co2Lab[2]) + txt(L.gluLab[0], L.gluLab[1], "glucose", "fz-lab", L.gluLab[2]) + "</g>";
  return '<svg viewBox="0 0 ' + L.w + " " + L.h + '" class="fz-svg"' + (o.aria ? ' role="img" aria-label="' + MV.esc(o.aria) + '"' : ' aria-hidden="true" focusable="false"') + ">" + h + '<g class="fz-dyn"></g></svg>';
}
// st: {light (0–100), glow (0–1), c:{atp, lr, cr}, ph:{fwd, back, h2o, o2, co2, glu, wheel}, on:{...} (optional: which flows show)}
function stationFrame(svg, L, st){
  var on = st.on || {}, all = !st.on, c = st.c, ph = st.ph, h = "";
  function is(k){ return all || on[k]; }
  var gl = $(".fz-glow", svg); if (gl) gl.setAttribute("opacity", f1(clamp(st.glow, 0, 1) * 70) / 100);
  var W = L.wheel, wg = $(".fz-wheel", svg); if (wg) wg.setAttribute("transform", "rotate(" + f1(frac(ph.wheel) * 360) + " " + W.cx + " " + W.cy + ")");
  $$(".fz-belt-d", svg).forEach(function(b){ b.style.strokeDashoffset = f1(-(b.dataset.b === "fwd" ? ph.fwd : ph.back) * 120); });
  var np = st.light >= 70 ? 3 : st.light >= 40 ? 2 : st.light > 0 ? 1 : 0;
  if (is("photons")) for (var i = 0; i < np; i++) { var p = L.photons[i]; h += photonSVG(p[0], p[1], p[2], p[3]); }
  var aL = c.lr > 0.001 ? 0.35 + 0.65 * c.lr : 0, aC = c.cr > 0.001 ? 0.35 + 0.65 * c.cr : 0;
  if (is("h2o")) h += flowToks(L.h2o, 3, ph.h2o, ["h2o"], aL);
  if (is("o2")) h += flowToks(L.o2, 3, ph.o2, ["o2"], aL);
  if (is("co2")) h += flowToks(L.co2, 3, ph.co2, ["co2"], aC);
  if (is("glu")) h += flowToks(L.glu, 2, ph.glu, ["glu"], aC);
  var nb = beltN(L);
  if (is("fwd")) h += flowToks(L.fwd, nb, ph.fwd, ["atp", "nadph", "atp"], clamp(c.atp / 18, 0, 1));
  if (is("back")) h += flowToks(L.back, nb, ph.back, ["adp", "nadp", "adp"], clamp((36 - c.atp) / 18, 0, 1));
  $(".fz-dyn", svg).innerHTML = h;
}
// atom tracker overlay: q = 0 … 1 through one full turn (12 H₂O and 6 CO₂ in; 6 O₂, 1 glucose and 6 new H₂O out)
var TRK = {
  w18:{ tag:"¹⁸O", h2o:true, o2:true },
  c18:{ tag:"¹⁸O", co2:true, glu:true, neww:true },
  c14:{ tag:"¹⁴C", co2:true, glu:true }
};
function mol(kind, x, y){
  if (kind === "w") return sv("circle", { cx:x, cy:y, r:4.6, "class":"fz-mw" });
  if (kind === "o") return sv("circle", { cx:x, cy:y, r:4.4, "class":"fz-mo" });
  if (kind === "c") return sv("circle", { cx:x, cy:y, r:4.6, "class":"fz-mc" });
  return sv("path", { d:hexPath(x, y, 10), "class":"fz-glu" });
}
function cluster(kind, n, cols, x, y, a, lab, tag, side){
  if (a <= 0.01) return "";
  var sp = 13, rows = Math.ceil(n / cols), w = (cols - 1) * sp, hh = (rows - 1) * sp, g = "", i;
  var big = kind === "g";
  for (i = 0; i < n; i++) {
    var cx = big ? x : x - w / 2 + (i % cols) * sp, cy = big ? y : y - hh / 2 + Math.floor(i / cols) * sp;
    if (tag) g += sv("circle", { cx:cx, cy:cy, r:big ? 14 : 7.6, "class":"fz-halo" });
    g += mol(kind, cx, cy);
  }
  var half = big ? 12 : w / 2 + 6, tx = x + side * (half + 6), anc = side > 0 ? "start" : "end";
  g += txt(tx, y + 4, lab, "fz-lab fz-clab", anc);
  if (tag) {
    var tw = 24, bx = side > 0 ? tx : tx - tw;
    g += sv("rect", { x:bx, y:y - 22, width:tw, height:14, rx:3, "class":"fz-tag" }) + txt(bx + tw / 2, y - 11.5, tag, "fz-tagt", "middle");
  }
  return "<g" + (a < 0.99 ? ' opacity="' + f1(a * 100) / 100 + '"' : "") + ">" + g + "</g>";
}
function trackerFrame(svg, L, lab, q){
  var T = TRK[lab] || {}, h = "", sd = L.side;
  function seg(a, b){ return clamp((q - a) / (b - a), 0, 1); }
  var A = seg(0, 0.3), B = seg(0.3, 0.55), Cc = seg(0.55, 0.85), D = seg(0.85, 1);
  var gl = $(".fz-glow", svg); if (gl) gl.setAttribute("opacity", f1((q > 0.25 && q < 0.6 ? 0.7 : 0.35) * 100) / 100);
  var W = L.wheel, wg = $(".fz-wheel", svg); if (wg) wg.setAttribute("transform", "rotate(" + f1(Cc * 360) + " " + W.cx + " " + W.cy + ")");
  $$(".fz-belt-d", svg).forEach(function(b){ b.style.strokeDashoffset = f1(-(b.dataset.b === "fwd" ? B : Cc) * 120); });
  for (var i = 0; i < 3; i++) { var p = L.photons[i]; h += photonSVG(p[0], p[1], p[2], p[3]); }
  // inputs: move in during A; reappear at their start in D (summary frame)
  var u0 = L.inU || 0.16, inU = q < 0.3 ? lerp(u0, 0.95, A) : u0, inA = q < 0.3 ? (A > 0.85 ? (1 - A) / 0.15 : 1) : D;
  var pw = polyAt(L.h2o, inU), pc = polyAt(L.co2, inU);
  h += cluster("w", 12, L.wcols || 6, pw[0], pw[1], inA, "12 H₂O", T.h2o ? T.tag : "", sd.h2o);
  h += cluster("c", 6, 3, pc[0], pc[1], inA, "6 CO₂", T.co2 ? T.tag : "", sd.co2);
  // products
  var po = polyAt(L.o2, lerp(0.12, 0.8, B)), pg = polyAt(L.glu, lerp(0.12, 0.72, Cc)), pn = polyAt(L.neww, lerp(0.12, 0.72, Cc));
  if (q > 0.3) h += cluster("o", 6, 3, po[0], po[1], Math.min(1, B * 4), "6 O₂", T.o2 ? T.tag : "", sd.o2);
  if (q > 0.55) {
    h += cluster("g", 1, 1, pg[0], pg[1], Math.min(1, Cc * 4), "C₆H₁₂O₆", T.glu ? T.tag : "", sd.glu);
    h += cluster("w", 6, 3, pn[0], pn[1], Math.min(1, Cc * 4), "6 H₂O (new)", T.neww ? T.tag : "", sd.neww);
  }
  // carriers on the conveyors
  if (q > 0.3) h += flowToks(L.fwd, beltN(L), B, ["atp", "nadph", "atp"], 1);
  if (q > 0.55) h += flowToks(L.back, beltN(L), Cc, ["adp", "nadp", "adp"], 1);
  $(".fz-dyn", svg).innerHTML = h;
}

// ---------- factory model (plan: Factory model; deterministic, Blackman's smallest-factor rule) ----------
// Carriers are a fixed pool: ATP + ADP = 36, NADPH + NADP⁺ = 24; steady state holds one minute's worth charged (18 / 12).
// Transients run on a fixed 1-model-minute schedule: stocks and the running stage's rate change linearly.
var ATPMAX = 36, NMAX = 24;
function rateOf(s){ return s.water ? Math.min(s.light, s.co2) / 100 : 0; }
function limitOf(s){ if (!s.water) return "water"; if (s.light === 100 && s.co2 === 100) return "none"; if (s.light === s.co2) return "both"; return s.light < s.co2 ? "light" : "co2"; }
var LIMT = { water:"Water (it’s off)", none:"None at these settings", both:"Light and CO₂ equally", light:"Light", co2:"CO₂" };
var LIMS = { water:"stopped: no water", none:"with no limiting factor at these settings", both:"limited by light and CO₂ equally", light:"limited by light", co2:"limited by CO₂" };
function steadyTr(r){ return { kind:"run", f:{ atp:18, nadph:12, lr:r, cr:r }, t:{ atp:18, nadph:12, lr:r, cr:r } }; }

// ---------- Explore: Two-stage factory ----------
var EXF = null;
function explore(host, api){
  var S = api.S, C = api.content;
  if (S.light == null) { S.mode = "factory"; S.light = 100; S.co2 = 100; S.water = true; S.tr = steadyTr(1); S.p = 1; S.label = "w18"; S.log = []; S.concl = ""; S.last = ""; }
  if (!S.tr) { S.tr = steadyTr(rateOf(S)); S.p = 1; }
  S.log = S.log || [];
  var ph = { fwd:0, back:0.17, h2o:0, o2:0.1, co2:0, glu:0.3, wheel:0 };
  var playing = !MV.reduceMotion, vis = false, raf = 0, lastT = 0, anim = null, pend = null, busy = false, trk = null, hot = false, lay = null, readSig = "", liveSig = "";
  host.innerHTML = '<div class="pg fz-pg"><div class="pg-graph" data-mv="graph"><div class="fz-eq" id="fz-eq"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="fz-stage" id="fz-stage"></div><p class="fz-cap" id="fz-cap"></p><p class="vh" id="fz-live" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div class="fz-row" id="fz-mode"></div>' +
      '<div class="fz-panel" id="fz-fp">' +
        '<label class="slider fz-sl"><span class="slider-top"><span>Light</span><output id="fz-lo" for="fz-light"></output></span><input type="range" id="fz-light" min="0" max="100" step="10"></label>' +
        '<label class="slider fz-sl"><span class="slider-top"><span>CO₂ supply</span><output id="fz-co" for="fz-co2"></output></span><input type="range" id="fz-co2" min="0" max="100" step="10"></label>' +
        '<div class="fz-row" id="fz-water"></div>' +
        '<div class="q-actions fz-play">' + (MV.reduceMotion ? "" : '<button type="button" class="btn primary sm" id="fz-pp" data-k="fzpp">Pause</button>') + '<button type="button" class="btn ghost sm" id="fz-step" data-k="fzstep">Step 1 minute</button></div>' +
      "</div>" +
      '<div class="fz-panel" id="fz-tp"><div class="fz-row" id="fz-lab"></div><div class="q-actions"><button type="button" class="btn primary sm" id="fz-run" data-k="fzrun">Run</button></div>' +
        '<div class="fz-log"><h4 class="fz-h">Results log</h4><ol id="fz-logl"></ol><button type="button" class="btn ghost sm" id="fz-clear" data-k="fzclear">Clear the log</button></div>' +
        '<div class="fz-row" id="fz-concl"></div></div>' +
      '<p class="tiny muted fz-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div>" +
    '<div class="pg-read"><dl class="read" id="fz-read"></dl></div></div>';
  var stage = $("#fz-stage", host), svg = null;
  var modeR = radios($("#fz-mode", host), { label:"Mode", options:[{ id:"factory", t:"Factory" }, { id:"tracker", t:"Atom tracker" }], value:S.mode, onChange:function(m){ stop(); S.mode = m; trk = null; if (m === "tracker") S.p = 1; changed(); ensureLoop(); } });
  var waterR = radios($("#fz-water", host), { label:"Water", options:[{ id:"on", t:"On" }, { id:"off", t:"Off" }], value:S.water ? "on" : "off", onChange:function(v){ stop(); S.water = v === "on"; settings(); } });
  var labR = radios($("#fz-lab", host), { label:"Label", aria:"Label for the atom tracker", cls:"chips", options:C.labels.map(function(l){ return { id:l.id, t:l.t }; }), value:S.label, onChange:function(v){ stop(); S.label = v; trk = null; changed(); } });
  var conR = radios($("#fz-concl", host), { label:"Conclusion", cls:"chips", options:C.conclusions.map(function(l){ return { id:l.id, t:l.t }; }), value:S.concl || "", onChange:function(v){ S.concl = v; changed(); } });
  var lIn = $("#fz-light", host), cIn = $("#fz-co2", host);
  lIn.addEventListener("input", function(){ stop(); S.light = +lIn.value; settings(); });
  cIn.addEventListener("input", function(){ stop(); S.co2 = +cIn.value; settings(); });
  var ppB = $("#fz-pp", host);
  if (ppB) ppB.addEventListener("click", function(){ playing = !playing; sync(); paintCap(); ensureLoop(); });
  $("#fz-step", host).addEventListener("click", function(){ stop(); advance(1); frame(); paintAll(); api.save(); announce(); MV.changed(); });
  $("#fz-run", host).addEventListener("click", function(){ if (!busy) runTracker(null); });
  $("#fz-clear", host).addEventListener("click", function(){ stop(); S.log = []; changed(); });

  function cur(){ var t = S.tr, p = S.p; return { atp:lerp(t.f.atp, t.t.atp, p), nadph:lerp(t.f.nadph, t.t.nadph, p), lr:lerp(t.f.lr, t.t.lr, p), cr:lerp(t.f.cr, t.t.cr, p) }; }
  function retarget(){
    var c = cur(), r = rateOf(S), lrOff = !S.water || S.light === 0, cOff = S.co2 === 0, t;
    if (r > 0) t = { kind:"run", f:{ atp:c.atp, nadph:c.nadph, lr:r, cr:r }, t:{ atp:18, nadph:12, lr:r, cr:r } };
    else if (lrOff && cOff) t = { kind:"both", f:{ atp:c.atp, nadph:c.nadph, lr:0, cr:0 }, t:{ atp:c.atp, nadph:c.nadph, lr:0, cr:0 } };
    else if (lrOff) { var s0 = c.atp > 0.01 ? (c.cr > 0.001 ? Math.min(c.cr, S.co2 / 100) : S.co2 / 100) : 0; t = { kind:"dark", f:{ atp:c.atp, nadph:c.nadph, lr:0, cr:s0 }, t:{ atp:s0 ? 0 : c.atp, nadph:s0 ? 0 : c.nadph, lr:0, cr:0 } }; }
    else { var s1 = c.atp < ATPMAX - 0.01 ? (c.lr > 0.001 ? Math.min(c.lr, S.light / 100) : S.light / 100) : 0; t = { kind:"noco2", f:{ atp:c.atp, nadph:c.nadph, lr:s1, cr:0 }, t:{ atp:s1 ? ATPMAX : c.atp, nadph:s1 ? NMAX : c.nadph, lr:0, cr:0 } }; }
    S.tr = t;
    var same = ["atp", "nadph", "lr", "cr"].every(function(q){ return Math.abs(t.f[q] - t.t[q]) < 1e-6; });
    S.p = same || MV.reduceMotion ? 1 : 0;
  }
  function advance(dm){
    var c = cur();
    ph.fwd += c.lr * dm * 1.5; ph.h2o += c.lr * dm * 1.5; ph.o2 += c.lr * dm * 1.5;
    ph.back += c.cr * dm * 1.5; ph.co2 += c.cr * dm * 1.5; ph.glu += c.cr * dm; ph.wheel += c.cr * dm * 0.75;
    if (S.p < 1) S.p = Math.min(1, S.p + dm);
  }
  function settings(){ hot = false; retarget(); changed(); announce(); ensureLoop(); }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function stop(){
    if (anim) { anim(); anim = null; }
    busy = false;
    if (pend) { var d = pend; pend = null; d(); }
  }
  // layout follows the stage width (phone: stations stacked)
  function layout(){
    var w = stage.clientWidth || 600, k = w < 440 ? "tall" : "wide";
    if (k === lay && svg) return;
    lay = k; stage.innerHTML = stationSVG(LAY[k], { aria:"Two-stage factory" }); svg = $("svg", stage); readSig = ""; frame(); paintAria();
  }
  if (window.ResizeObserver) new ResizeObserver(function(){ if (stage.clientWidth) layout(); }).observe(stage);
  function frame(){
    if (!svg) return;
    var L = LAY[lay];
    svg.classList.toggle("fz-trk", S.mode === "tracker");
    if (S.mode === "tracker") trackerFrame(svg, L, trk ? trk.lab : S.label, trk ? trk.q : 0);
    else stationFrame(svg, L, { light:S.water ? S.light : 0, glow:S.light / 100, c:cur(), ph:ph });
  }
  // ---- text: equation, caption, readouts ----
  var EQ0 = '<span class="bio-chem">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</span>';
  var EQF = {
    w18:'<span class="bio-chem">6CO₂ + <mark class="fz-mk">12H₂¹⁸O</mark> → C₆H₁₂O₆ + <mark class="fz-mk">6¹⁸O₂</mark> + 6H₂O</span>',
    c18:'<span class="bio-chem"><mark class="fz-mk">6C¹⁸O₂</mark> + 12H₂O → <mark class="fz-mk">C₆H₁₂¹⁸O₆</mark> + 6O₂ + <mark class="fz-mk">6H₂¹⁸O</mark></span>',
    c14:'<span class="bio-chem"><mark class="fz-mk">6¹⁴CO₂</mark> + 12H₂O → <mark class="fz-mk">¹⁴C₆H₁₂O₆</mark> + 6O₂ + 6H₂O</span>'
  };
  function paintEq(){
    var e = $("#fz-eq", host);
    if (S.mode === "tracker" && trk && trk.q >= 1) e.innerHTML = '<span class="fz-eqk">Full equation:</span> ' + EQF[trk.lab] + ' <span class="tiny muted fz-eqn">Highlighted: molecules carrying the ' + TRK[trk.lab].tag + " label.</span>";
    else e.innerHTML = EQ0;
  }
  function cause(){ return !S.water && S.light === 0 ? "No light and no water" : !S.water ? "No water" : "No light"; }
  function capText(){
    if (S.mode === "tracker") {
      if (busy) return "Running one full turn with " + MV.plain(byId(C.labels, trk.lab).t) + "…";
      if (trk && trk.q >= 1) return "One full turn: 12 H₂O and 6 CO₂ went in; 6 O₂, 1 glucose and 6 new H₂O came out. Haloed molecules carry the " + TRK[trk.lab].tag + " label.";
      return "Labelled molecules have a halo and the isotope symbol. Choose a label and press Run.";
    }
    var t = S.tr, set = S.p >= 1, r = rateOf(S), s;
    if (t.kind === "run") s = set ? (r >= 1 ? "Both stages are running at full speed." : "Both stages are running at " + Math.round(r * 100) + "% of maximum.") : "Restarting: both stages are running, and the stock of ATP and NADPH is refilling.";
    else if (t.kind === "both") s = "Both stages are stopped: " + cause().toLowerCase() + ", and no CO₂.";
    else if (t.kind === "dark") s = set ? cause() + ": the light reactions stopped at once, so no O₂ is released. The Calvin cycle used up its ATP and NADPH within 1 minute and has stopped too." : cause() + ": the light reactions stopped at once, so no O₂ is released. The Calvin cycle is using up its stock of ATP and NADPH.";
    else s = set ? "No CO₂: the Calvin cycle stopped at once. ATP and NADPH piled up until no NADP⁺ or ADP was left, so within 1 minute the light reactions stalled and O₂ release fell to 0." : "No CO₂: the Calvin cycle stopped at once. ATP and NADPH are piling up, and the light reactions are running out of NADP⁺ and ADP.";
    if (!set) s += " (Minute " + nm(S.p) + " of 1.)" + (playing || anim ? "" : " Press " + (MV.reduceMotion ? "" : "Play or ") + "Step 1 minute to see what happens next.");
    return s;
  }
  function paintCap(){ $("#fz-cap", host).textContent = capText(); }
  function bar(lab, v, max, col){ return '<span class="fz-b"><span class="fz-bn">' + lab + '</span><span class="fz-bt"><i style="width:' + f1(clamp(v / max, 0, 1) * 100) + "%;background:var(" + col + ')"></i></span><span class="fz-bv">' + Math.round(v) + "</span></span>"; }
  function paintRead(){
    var c = cur(), r = rateOf(S), lim = limitOf(S), lab = S.last ? byId(C.labels, S.last) : null;
    var rows = [
      ["Rate", Math.round(r * 100) + "% of maximum" + (S.p < 1 ? ' <span class="muted tiny">(stages still adjusting)</span>' : "")],
      ["Limiting factor", LIMT[lim]],
      ["O₂ released per minute", nm(6 * c.lr)],
      ["CO₂ fixed per minute", nm(6 * c.cr)],
      ["Glucose made per minute", nm(c.cr)],
      ["Stroma stock: ATP / NADPH", '<span class="fz-bars">' + bar("ATP", c.atp, ATPMAX, "--bio-atp") + bar("NADPH", c.nadph, NMAX, "--bio-nadh") + "</span>"],
      ["Waiting to be recharged: ADP / NADP⁺", '<span class="fz-bars">' + bar("ADP", ATPMAX - c.atp, ATPMAX, "--ink-2") + bar("NADP⁺", NMAX - c.nadph, NMAX, "--ink-2") + "</span>"],
      ["Last tracer result", lab ? lab.last : '<span class="muted">none yet</span>']
    ];
    var sig = JSON.stringify(rows) + hot; if (sig === readSig) return; readSig = sig;
    $("#fz-read", host).innerHTML = MV.readoutHTML(rows);
    if (hot) { var rr = $$("#fz-read > div", host); [0, 1].forEach(function(i){ if (rr[i]) rr[i].classList.add("fz-hot"); }); }
  }
  function describe(){
    if (S.mode === "tracker") return "Atom tracker. " + capText();
    var c = cur(), r = rateOf(S), lim = limitOf(S);
    var s = (lim === "water" ? "Rate 0%, stopped: no water." : "Rate " + Math.round(r * 100) + "%, " + LIMS[lim] + ".") + " " + nm(6 * c.lr) + " O₂ released and " + nm(c.cr) + " glucose made per minute.";
    return s + " Stroma stock: " + Math.round(c.atp) + " ATP and " + Math.round(c.nadph) + " NADPH. " + capText();
  }
  function paintAria(){ if (svg) svg.setAttribute("aria-label", "Two-stage factory: light reactions in the thylakoid membranes, Calvin cycle in the stroma. " + describe()); }
  function announce(){ var d = describe(); if (d !== liveSig) { liveSig = d; $("#fz-live", host).textContent = d; } paintAria(); }
  function sync(){
    modeR.set(S.mode); waterR.set(S.water ? "on" : "off"); labR.set(S.label); conR.set(S.concl || "");
    lIn.value = S.light; cIn.value = S.co2;
    $("#fz-lo", host).textContent = S.light + "%"; $("#fz-co", host).textContent = S.co2 + "%";
    lIn.setAttribute("aria-valuetext", S.light + "%"); cIn.setAttribute("aria-valuetext", S.co2 + "%");
    var f = S.mode === "factory";
    $("#fz-fp", host).hidden = !f; $("#fz-tp", host).hidden = f;
    if (ppB) { ppB.textContent = playing ? "Pause" : "Play"; ppB.disabled = busy; }
    $("#fz-step", host).disabled = busy; $("#fz-run", host).disabled = busy;
    $("#fz-clear", host).disabled = busy || !S.log.length;
    lIn.disabled = cIn.disabled = false;
  }
  function paintLog(){
    $("#fz-logl", host).innerHTML = S.log.length ? S.log.map(function(id, i){ return "<li>Run " + (i + 1) + ": " + byId(C.labels, id).log + "</li>"; }).join("") : '<li class="muted fz-none">No runs yet.</li>';
  }
  function paintAll(){ layout(); sync(); frame(); paintEq(); paintCap(); paintRead(); paintLog(); paintAria(); }

  // ---- animation loop (Play runs 1 model minute in 4 s) ----
  function ensureLoop(){ if (!raf && vis && S.mode === "factory" && playing && !anim && !MV.reduceMotion) { lastT = 0; raf = requestAnimationFrame(tick); } }
  function tick(now){
    raf = 0;
    if (!vis || S.mode !== "factory" || !playing || anim) return;
    var dt = lastT ? Math.min(80, now - lastT) : 16; lastT = now;
    var was = S.p; advance(dt / 4000); frame();
    if (S.p !== was || was < 1) { paintRead(); paintCap(); if (S.p >= 1) { api.save(); announce(); MV.changed(); } }
    raf = requestAnimationFrame(tick);
  }
  // ---- atom tracker: one full turn ----
  function runTracker(done){
    stop(); busy = true; S.mode = "tracker"; S.p = 1; trk = { lab:S.label, q:0 }; pend = done || null;
    paintAll();
    anim = MV.tween({ dur:6000, ease:lin, step:function(t){ trk.q = t; frame(); }, done:function(){
      anim = null; busy = false; trk.q = 1; S.log.push(trk.lab); if (S.log.length > 12) S.log.shift(); S.last = trk.lab;
      api.save(); paintAll(); announce(); MV.changed();
      var d = pend; pend = null; if (d) d();
    } });
  }
  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    if (id === "tc1") {
      if (S.light === 100 && S.co2 === 50 && S.water) return { ok:true };
      if (!S.water) return { ok:false, msg:"No water, no electrons: everything stops." };
      if (S.light === 50 && S.co2 === 100) return { ok:false, msg:"That gives 0.5 too, but this challenge keeps the light at 100%." };
      if (S.light === 100 && S.co2 === 100) return { ok:false, msg:"That’s 1 glucose per minute." };
      if (S.light !== 100) return { ok:false, msg:"This challenge keeps the light at 100%. Set the light back to 100%." };
      return { ok:false, msg:"That’s " + nm(rateOf(S)) + " glucose per minute." };
    }
    if (id === "tc2") {
      if (!S.water) return { ok:false, msg:"No water, no electrons: everything stops." };
      var o2 = 6 * rateOf(S);
      if (S.light === 50 && S.co2 >= 50) return { ok:true };
      if (S.light >= 50 && S.co2 < 50) return { ok:false, msg:"CO₂ is now limiting: only " + nm(o2) + " O₂ per minute." };
      if (S.light > 50) return { ok:false, msg:"That works, but less light would do." };
      return { ok:false, msg:"Only " + nm(o2) + " O₂ per minute: light is now limiting." };
    }
    if (id === "tc3") {
      var L = S.log || [], hw = L.indexOf("w18") >= 0, hc = L.indexOf("c18") >= 0, hk = L.indexOf("c14") >= 0;
      if (hw && hc) {
        if (S.concl === "water") return { ok:true };
        if (S.concl === "both") return { ok:false, msg:"Labelled CO₂ never labelled the O₂." };
        if (S.concl === "co2") return { ok:false, msg:"¹⁸O in the water labels the O₂; ¹⁸O in the CO₂ doesn’t. The O₂ comes from splitting water." };
        return { ok:false, msg:"You have the runs you need. Now choose the conclusion under the results log." };
      }
      if (hk && !hc) return { ok:false, msg:"Carbon can’t tell you where the oxygen comes from." };
      if (hw && !hc) return { ok:false, msg:"One run shows water’s oxygen <strong>can</strong> become O₂, but not that CO₂’s doesn’t." };
      return { ok:false };
    }
    return { ok:false };
  }
  // ---- predictions ----
  function settleAt(s){ S.mode = "factory"; S.light = s.light; S.co2 = s.co2; S.water = s.water; S.tr = steadyTr(rateOf(S)); S.p = 1; }
  function finish(){ var d = pend; pend = null; playing = !MV.reduceMotion; sync(); paintCap(); ensureLoop(); if (d) MV.wait(400, d); }
  EXF = { show:function(v){ vis = v; if (v) { paintAll(); ensureLoop(); } } };
  paintAll();
  return {
    predict:{
      start:function(p){
        stop(); hot = false; var s = p.start;
        if (s.mode === "tracker") { S.mode = "tracker"; S.p = 1; S.label = s.label; trk = null; }
        else { settleAt(s); playing = false; }
        changed();
      },
      run:function(p, done){
        var s = p.start, to = p.to || {};
        if (s.mode === "tracker") { runTracker(function(){ MV.wait(300, done); }); return; }
        pend = done; busy = true; playing = false;
        if (to.co2 === 30) {
          var c0 = S.co2;
          anim = MV.tween({ dur:1600, ease:lin, step:function(t){ S.co2 = Math.round(lerp(c0, 30, t) / 10) * 10; retarget(); S.p = 1; paintAll(); }, done:function(){
            anim = null; busy = false; S.co2 = 30; retarget(); S.p = 1; hot = true; api.save(); paintAll(); announce(); MV.changed(); finish();
          } });
          return;
        }
        if (to.light != null) S.light = to.light;
        if (to.co2 != null) S.co2 = to.co2;
        retarget(); paintAll();
        var last = 0;
        anim = MV.tween({ dur:4000, ease:lin, step:function(t){ advance(t - last); last = t; frame(); paintRead(); paintCap(); }, done:function(){
          anim = null; busy = false; S.p = 1; api.save(); paintAll(); announce(); MV.changed(); finish();
        } });
      }
    },
    challenge:chal
  };
}

// ---------- hero: the factory storyboard (thylakoids light up; carriers roll right; empty carriers roll back) ----------
function hero(f){
  var box = $("#fz-hero"); if (!box) return;
  var cap = f && f.cap, L = LAY.wide;
  box.innerHTML = stationSVG(L, {});
  var svg = $("svg", box);
  var CAPS = ["Light hits the thylakoids: water splits and O₂ bubbles away.", "ATP and NADPH roll into the stroma; CO₂ joins the cycle and sugar pops out.",
    "Empty carriers roll back to be recharged.", "ATP and NADPH go one way; ADP + Pᵢ and NADP⁺ come back."];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  var ph = { fwd:0.1, back:0.27, h2o:0.05, o2:0.2, co2:0.15, glu:0.4, wheel:0 }, c = { atp:18, lr:1, cr:1 };
  if (MV.reduceMotion) { stationFrame(svg, L, { light:100, glow:1, c:c, ph:ph }); setCap(3); return; }
  var t0 = null, last = null;
  function step(now){
    if (t0 === null) { t0 = now; last = now; }
    var t = (now - t0) / 1000, dm = Math.min(0.05, (now - last) / 4000); last = now;
    var on = { photons:true, h2o:t > 0.4, o2:t > 1, fwd:t > 2.5, co2:t > 3, glu:t > 4, back:t > 6 };
    if (on.h2o) { ph.h2o += dm * 1.5; ph.o2 += dm * 1.5; }
    if (on.fwd) ph.fwd += dm * 1.5;
    if (on.co2) { ph.co2 += dm * 1.5; ph.wheel += dm * 0.75; }
    if (on.glu) ph.glu += dm;
    if (on.back) ph.back += dm * 1.5;
    stationFrame(svg, L, { light:100, glow:clamp(t / 1.2, 0, 1), c:c, ph:ph, on:t > 9 ? null : on });
    setCap(t < 2.5 ? 0 : t < 6 ? 1 : t < 9 ? 2 : 3);
    if (t < 16) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ---------- Part 3: Limiting factors (three model graphs, region taps, "Check it with data", enzyme zoom) ----------
// @component N8 regionTaps — native buttons laid over a Plot canvas (boxes in data units, or circles on data points), placed
// after each draw with plot.X/Y; the tapped curve segment is underlaid in --hi. Keyboard: Tab to a region, Enter.
var P3F = null;
var RG = {
  g1:{ rise:[3, 47, 0.1, 3.0], loFlat:[54, 100, 2.55, 3.45], hiRise:[56, 100, 3.8, 6.35] },
  g2:{ rise:[0.002, 0.0195, 0.1, 1.5], dimFlat:[0.03, 0.15, 1.1, 1.9], brightRise:[0.03, 0.077, 2.2, 5.85], brightFlat:[0.09, 0.15, 5.6, 6.4] }
};
var GV = { g1:{ xmin:-10, xmax:106, ymin:-0.95, ymax:7.4 }, g2:{ xmin:-0.017, xmax:0.16, ymin:-0.95, ymax:7.4 }, g3:{ xmin:-6, xmax:50, ymin:-0.95, ymax:7.4 } };
function g3rate(T, pts){ for (var i = 1; i < pts.length; i++) if (T <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (T - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0])); return pts[pts.length - 1][1]; }
function part3(host, api){
  var P = api.content, S = api.S; S.t = S.t || {}; S.x = S.x || {}; S.zt = S.zt || 25;
  var plots = {}, msgs = {}, zoomVis = false, zoomOpen = false, zraf = 0, zt0 = null;
  host.innerHTML = P.graphs.map(function(g, gi){
    var tbl = '<details class="alg"><summary>Check it with data</summary><div class="tbl-wrap"><table class="lf-tbl"><thead><tr>' + g.table.head.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + "</tr></thead><tbody>" +
      g.table.rows.map(function(r){ return "<tr>" + r.map(function(x, i){ return i ? "<td>" + x + "</td>" : '<th scope="row">' + x + "</th>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div></details>";
    var zoom = g.zoom ? '<details class="alg lf-zoom" id="lf-zoom"><summary>' + g.zoom.title + '</summary><p class="tiny">' + g.zoom.intro + '</p><div class="fz-row" id="lf-zt"></div><div class="lf-zstage" id="lf-zs"></div><p class="lf-zcap" id="lf-zcap" aria-live="polite"></p><p class="tiny muted">' + g.zoom.preview + "</p></details>" : "";
    return '<div class="lf-g' + (gi ? " part" : "") + '" data-g="' + g.id + '"><h3>' + g.title + '</h3><div class="lf-row"><div class="lf-pl"><div class="plot-wrap"><canvas class="plot" id="lf-c-' + g.id + '" role="img"></canvas><div class="lf-hits" id="lf-h-' + g.id + '"></div></div><p class="tiny muted lf-leg">' + g.legend + "</p></div>" +
      '<div class="lf-side"><div id="lf-t-' + g.id + '"></div>' + tbl + zoom + "</div></div></div>";
  }).join("");
  function task(g){ for (var i = 0; i < g.tasks.length; i++) if (!(S.t[g.tasks[i].id] || {}).solved) return g.tasks[i]; return null; }
  function hitList(g){
    if (g.points) return g.points.map(function(p){ return { id:"t" + p[0], name:p[0] + " °C (rate " + p[1].toFixed(1) + ")", pt:p }; });
    return g.regions.map(function(r){ var b = RG[g.id][r.id]; return { id:r.id, name:r.name, box:b }; });
  }
  function solvedRegions(g){ var out = []; g.tasks.forEach(function(t){ var st = S.t[t.id]; if (st && st.solved) out.push(st.pick); }); return out; }
  function draw(g){
    var p = plots[g.id], css = MV.css, pen = css("--pen"), hi = css("--hi"), sol = solvedRegions(g), cur = task(g), pick = cur && S.t[cur.id] ? S.t[cur.id].pick : null;
    var curves = [], points = [], labels = [], d = "";
    function hl(f, x0, x1){ curves.push({ f:f, color:hi, width:11, domain:[x0, x1] }); }
    if (g.id === "g1") {
      var lo = function(x){ return Math.min(0.06 * x, 3); }, hiC = function(x){ return Math.min(0.06 * x, 6); };
      sol.concat(pick ? [pick] : []).forEach(function(r){ if (r === "rise") hl(lo, 0, 50); if (r === "loFlat") hl(lo, 50, 100); if (r === "hiRise") hl(hiC, 50, 100); });
      curves.push({ f:hiC, color:pen, width:3, domain:[0, 100] }, { f:lo, color:pen, width:3, dash:[8, 6], domain:[0, 100] });
      labels.push({ x:100, y:6, text:"high CO₂", color:css("--ink"), align:"right", dy:-14, font:"600 13px " + css("--font-ui"), bg:true }, { x:100, y:3, text:"low CO₂", color:css("--ink"), align:"right", dy:14, font:"600 13px " + css("--font-ui"), bg:true });
      d = "Graph 1: rate of photosynthesis against light intensity, 0 to 100%. High CO₂ (solid): the rate rises in a straight line from 0 to 6 at 100% light. Low CO₂ (dashed): the same rising line up to 3 at 50% light, then flat at 3.";
    } else if (g.id === "g2") {
      var dim = function(x){ return Math.min(75 * x, 1.5); }, br = function(x){ return Math.min(75 * x, 6); };
      sol.concat(pick ? [pick] : []).forEach(function(r){ if (r === "rise") hl(dim, 0, 0.02); if (r === "dimFlat") hl(dim, 0.02, 0.15); if (r === "brightRise") hl(br, 0.02, 0.08); if (r === "brightFlat") hl(br, 0.08, 0.15); });
      curves.push({ f:br, color:pen, width:3, domain:[0, 0.15] }, { f:dim, color:pen, width:3, dash:[8, 6], domain:[0, 0.15] });
      labels.push({ x:0.15, y:6, text:"bright light", color:css("--ink"), align:"right", dy:-14, font:"600 13px " + css("--font-ui"), bg:true }, { x:0.15, y:1.5, text:"dim light", color:css("--ink"), align:"right", dy:-14, font:"600 13px " + css("--font-ui"), bg:true });
      d = "Graph 2: rate against CO₂ concentration, 0 to 0.15%. Bright light (solid): rises from 0 to 6 at 0.08% CO₂, then flat at 6. Dim light (dashed): the same rising line up to 1.5 at 0.02% CO₂, then flat at 1.5.";
    } else {
      var pts = g.points;
      curves.push({ pts:pts.map(function(q){ return [q[0], q[1]]; }), color:pen, width:3 });
      pts.forEach(function(q){ var id = "t" + q[0], on = sol.indexOf(id) >= 0 || pick === id; points.push({ x:q[0], y:q[1], r:on ? 6.5 : 5, color:css("--ink"), ring:on }); });
      d = "Graph 3: rate against temperature. Points: " + pts.map(function(q){ return q[0] + " °C " + q[1].toFixed(1); }).join(", ") + ". The rate rises to a peak, then falls.";
    }
    var fmt = g.id === "g2" ? function(t){ return t.toFixed(2); } : null;
    p.draw({ view:GV[g.id], curves:curves, points:points, labels:labels, xTicks:g.id === "g2" ? { step:0.02, fmt:fmt } : { step:g.id === "g1" ? 20 : 10 }, yTicks:{ step:1 },
      xLabel:g.id === "g1" ? "light intensity (%)" : g.id === "g2" ? "CO₂ (%)" : "temperature (°C)", yLabel:"rate (O₂ per minute)", describe:d });
    placeHits(g);
  }
  function placeHits(g){
    var p = plots[g.id], box = $("#lf-h-" + g.id, host), cur = task(g), sol = solvedRegions(g);
    if (!p || !p.W) return;
    MV.keepFocus(box, function(){
      box.innerHTML = hitList(g).map(function(h){
        var x0, x1, y0, y1;
        if (h.pt) { var X = p.X(h.pt[0]), Y = p.Y(h.pt[1]), rr = clamp((p.X(30) - p.X(25)) / 2 - 1, 12, 17); x0 = X - rr; x1 = X + rr; y0 = Y - rr; y1 = Y + rr; }
        else { x0 = p.X(h.box[0]); x1 = p.X(h.box[1]); y0 = p.Y(h.box[3]); y1 = p.Y(h.box[2]); if (y1 - y0 < 28) { var m = (y0 + y1) / 2; y0 = m - 14; y1 = m + 14; } }
        var st = cur ? S.t[cur.id] : null, on = sol.indexOf(h.id) >= 0 || (st && st.pick === h.id);
        return '<button type="button" class="lf-hit' + (on ? " on" : "") + (h.pt ? " pt" : "") + '" data-r="' + h.id + '" data-k="lfh' + g.id + h.id + '" style="left:' + f1(x0) + "px;top:" + f1(y0) + "px;width:" + f1(x1 - x0) + "px;height:" + f1(y1 - y0) + 'px" aria-label="' + MV.esc(MV.plain(h.name)) + '"' + (cur ? "" : " disabled") + "></button>";
      }).join("");
    });
  }
  function paintTasks(g){
    var host2 = $("#lf-t-" + g.id, host), cur = task(g), h = "";
    g.tasks.forEach(function(t, i){
      var st = S.t[t.id] || {}, isCur = cur === t;
      if (!st.solved && !isCur) return;
      h += '<div class="lf-task' + (st.solved ? " done" : "") + '"><p class="lf-tp"><span class="tag">Task ' + (i + 1) + " of " + g.tasks.length + "</span> " + t.prompt + "</p>";
      if (st.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + t.fb[st.pick] + (st.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[t.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[t.id] + " Try another part.");
      else h += '<p class="tiny muted">' + (g.points ? "Tap a point on the graph (or Tab to it and press Enter)." : "Tap a part of the graph (the dashed boxes), or Tab to it and press Enter.") + "</p>";
      h += "</div>";
    });
    if (!cur && g.explain) {
      var ex = S.x[g.explain.id] || {};
      h += '<div class="lf-task"><p class="lf-tp"><span class="tag">Explain</span> ' + g.explain.prompt + '</p><label class="vh" for="lf-x-' + g.id + '">Your explanation</label><textarea id="lf-x-' + g.id + '" class="lf-xt" data-x="' + g.explain.id + '" rows="2" placeholder="Your explanation"></textarea>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-show="' + g.explain.id + '" data-k="lfs' + g.id + '"' + (ex.shown ? " disabled" : "") + ">Compare with a model answer</button></div>" + (ex.shown ? MV.fbHTML("", "<strong>Model answer:</strong> " + g.explain.model) : "") + "</div>";
    }
    if (!cur && !g.explain) h += '<p class="tiny muted">All tasks on this graph done.</p>';
    MV.keepFocus(host2, function(){ host2.innerHTML = h; });
    var ta = $("textarea", host2); if (ta) ta.value = (S.x[g.explain.id] || {}).text || "";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var gEl = b.closest("[data-g]"); if (!gEl) return;
    var g = byId(P.graphs, gEl.dataset.g);
    if (b.dataset.show) { var x = S.x[b.dataset.show] || (S.x[b.dataset.show] = {}); x.shown = true; api.save(); paintTasks(g); return; }
    if (!b.dataset.r) return;
    var t = task(g); if (!t) return;
    var st = S.t[t.id] || (S.t[t.id] = { tries:0 }), r = b.dataset.r;
    st.pick = r;
    if (MV.ans(t).indexOf(r) >= 0) { st.solved = true; st.first = st.tries === 0; msgs[t.id] = null; }
    else { st.tries++; msgs[t.id] = t.fb[r] || "Look at that part of the graph again."; }
    api.save(); draw(g); paintTasks(g); MV.focusFb($("#lf-t-" + g.id, host));
  });
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.x; if (!id) return; var x = S.x[id] || (S.x[id] = {}); x.text = e.target.value; api.save(); });
  P.graphs.forEach(function(g){
    var p = plots[g.id] = new MV.Plot($("#lf-c-" + g.id, host), GV[g.id]);
    p.render = function(){ draw(g); };
    paintTasks(g);
  });
  // ---- @component enzymeZoom — "Zoom to the molecules": an enzyme (rubisco) whose substrate tokens speed up with temperature
  // and whose active site deforms above the optimum; products leave at the model rate (reduced motion: one still frame) ----
  var g3 = byId(P.graphs, "g3"), Z = g3.zoom, zs = $("#lf-zs", host);
  radios($("#lf-zt", host), { label:"Temperature", cls:"chips", options:g3.points.map(function(q){ return { id:q[0], t:q[0] + " °C" }; }), value:S.zt, onChange:function(v){ S.zt = +v; api.save(); zcap(); zdraw(0); } });
  function zcap(){ var T = S.zt, r = g3rate(T, g3.points); $("#lf-zcap", host).innerHTML = "<strong>" + T + " °C: model rate " + r.toFixed(1) + ".</strong> " + (T <= 30 ? Z.cool : Z.hot); }
  function enzPath(d){
    // body with an active-site pocket at the top; d = 0 (native shape) … 1 (badly unfolded)
    var cx = 160, top = 84, pw = lerp(30, 46, d), pd = lerp(26, 9, d), sk = lerp(0, 14, d);
    return "M60 " + (130 + 8 * d) + " C60 " + (96 - 6 * d) + " 86 " + top + " " + f1(cx - pw / 2 - 18) + " " + top + " L" + f1(cx - pw / 2) + " " + top +
      " C" + f1(cx - pw / 2 + sk) + " " + f1(top + pd) + " " + f1(cx + pw / 2 - sk) + " " + f1(top + pd + 4 * d) + " " + f1(cx + pw / 2) + " " + f1(top - 4 * d) +
      " L" + f1(cx + pw / 2 + 18) + " " + top + " C234 " + top + " 262 " + (98 + 10 * d) + " 260 " + (132 - 6 * d) + " C258 166 214 " + (176 + 6 * d) + " 160 176 C104 176 60 " + (164 - 8 * d) + " 60 " + (130 + 8 * d) + "Z";
  }
  var ZR = MV.bio.rng("rubisco"), ZP = [0, 1, 2, 3, 4].map(function(){ return { ax:ZR.range(60, 120), ay:ZR.range(12, 26), cy:ZR.range(28, 52), w1:ZR.range(0.7, 1.3), w2:ZR.range(1.1, 1.9), p1:ZR.range(0, 6.28), p2:ZR.range(0, 6.28) }; });
  function zdraw(t){
    var T = S.zt, d = clamp((T - 30) / 15, 0, 1), r = g3rate(T, g3.points), sp = 0.35 + T / 22, h = "";
    h += sv("rect", { x:0, y:0, width:320, height:190, rx:10, "class":"lf-zbg" }) + txt(10, 18, "stroma", "fz-sub");
    h += sv("path", { d:enzPath(d), "class":"lf-enz" }) + txt(160, 150, "rubisco", "fz-lab", "middle") + txt(160, 164, d > 0.05 ? "(losing its shape)" : "(enzyme)", "fz-sub", "middle");
    ZP.forEach(function(q){ var x = 160 + q.ax * Math.sin(q.w1 * sp * t + q.p1), y = q.cy + q.ay * Math.sin(q.w2 * sp * t + q.p2) * 0.5; h += tokSVG("co2", x, clamp(y, 14, 70), 1); });
    // products: two 3C pieces leave the site; how often follows the model rate
    if (!MV.reduceMotion) {
      var per = 5.5 / Math.max(r, 0.2) * 0.9, k = (t % per) / per;
      if (k < 0.6) { var u = k / 0.6, a = 1 - u * u; h += pc(160 + 112 * u, 94 + 4 * u, a) + pc(160 - 112 * u, 94 + 4 * u, a); }
    } else h += pc(262, 96, 1) + pc(58, 96, 1);
    zs.innerHTML = '<svg viewBox="0 0 320 190" class="fz-svg" role="img" aria-label="' + MV.esc("Rubisco at " + T + " °C. CO₂ molecules move " + (T <= 15 ? "slowly" : T <= 30 ? "quickly" : "quickly") + " around the enzyme. " + (d > 0 ? "The enzyme’s active site is deformed, so it fits CO₂ poorly." : "The active site at the top has its normal shape.") + " Model rate " + r.toFixed(1) + ".") + '">' + h + "</svg>";
  }
  function pc(x, y, a){ return a <= 0.02 ? "" : '<g opacity="' + f1(a * 100) / 100 + '">' + sv("rect", { x:x - 13, y:y - 8, width:26, height:16, rx:8, fill:"var(--bio-carbon)" }) + txt(x, y + 3.4, "3C", "fz-tt", "middle") + "</g>"; }
  function zloop(now){ zraf = 0; if (!zoomVis || !zoomOpen || MV.reduceMotion) return; if (zt0 === null) zt0 = now; zdraw((now - zt0) / 1000); zraf = requestAnimationFrame(zloop); }
  function zensure(){ if (!zraf && zoomVis && zoomOpen && !MV.reduceMotion) zraf = requestAnimationFrame(zloop); }
  $("#lf-zoom", host).addEventListener("toggle", function(e){ zoomOpen = e.target.open; zdraw(0); zensure(); });
  zcap(); zdraw(0);
  P3F = { show:function(v){ zoomVis = v; zensure(); } };
  return {};
}

// ---------- Practice 2: factory and tracer puzzles (N4 number entry, N7 select all, choice; adapted from SBI4U 02 / 03) ----------
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/,/g, ".").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function puzzles(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:"", vals:["", ""], pick:{}, choice:null, ch:null, tries:0, hint:0, solved:false, first:null, checked:false }); if (!x.vals) x.vals = ["", ""]; if (!x.pick) x.pick = {}; return x; }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function numBox(it, x, k, lab, unit){
    var id = "li-" + it.id + (k == null ? "" : k), v = k == null ? x.val : x.vals[k];
    return '<div class="numrow"><label for="' + id + '">' + lab + '</label><input class="numin" id="' + id + '" data-lin="' + it.id + '"' + (k == null ? "" : ' data-ix="' + k + '"') + ' type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(v) + '"' + (x.solved ? " disabled" : "") + ">" + (unit ? '<span class="fz-unit">' + unit + "</span>" : "") + "</div>";
  }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
    else {
      h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
      if (it.kind === "num") h += numBox(it, x, null, "Your answer:", it.unit);
      else if (it.kind === "pair") h += '<div class="fz-pair">' + it.labels.map(function(l, k){ return numBox(it, x, k, l + ":", ""); }).join("") + "</div>";
      else if (it.kind === "numch") {
        h += numBox(it, x, null, it.label, it.unit);
        h += '<div class="fz-chrow"><span class="rg-lab" id="lch-' + it.id + '">' + it.chipLabel + '</span><span class="chips fz-chs" role="radiogroup" aria-labelledby="lch-' + it.id + '">' + it.options.map(function(o, k){
          return '<button type="button" class="chip' + (x.ch === k ? " on" : "") + '" role="radio" aria-checked="' + (x.ch === k) + '" data-ch="' + k + '" data-k="' + it.id + "ch" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>";
        }).join("") + "</span></div>";
      } else {
        h += '<div class="opts" role="group" aria-label="Options (select all that apply)">' + it.options.map(function(o, oi){
          var on = !!x.pick[oi], c = "opt sa-opt", good = MV.ok(o);
          if (x.checked) { if (on && good) c += " right"; else if (on && !good) c += " wrong"; else if (!on && good && x.solved) c += " right"; }
          return '<button type="button" class="' + c + '" role="checkbox" aria-checked="' + on + '" data-k="' + it.id + "o" + oi + '" data-oi="' + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>";
        }).join("") + "</div>";
      }
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (it.kind === "sel" && x.checked && !x.solved) {
        var lines = it.options.map(function(o, oi){ var on = !!x.pick[oi], good = MV.ok(o); if (on && !good) return "<p>✗ " + o.t + ": " + o.why + "</p>"; if (!on && good) return "<p>○ One more option belongs in your selection.</p>"; return ""; }).filter(Boolean);
        lines = lines.filter(function(l, k){ return lines.indexOf(l) === k; });
        h += '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> Your selection isn’t right yet.</p>' + lines.join("") + "</div>";
      }
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function near(v, t, tol){ return Math.abs(v - t) <= (tol || 1e-6) * (tol ? 1 : Math.max(1, Math.abs(t))); }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; var x = ist(id); if (e.target.dataset.ix != null) x.vals[+e.target.dataset.ix] = e.target.value; else x.val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = byId(a.items, box.dataset.li), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (it.kind === "mc" && b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (it.kind === "sel" && b.dataset.oi != null) { var oi = +b.dataset.oi; x.pick[oi] = !x.pick[oi]; x.checked = false; }
    else if (b.dataset.ch != null) { x.ch = +b.dataset.ch; msgs[it.id] = null; }
    else if (b.dataset.act === "check") {
      var ok = false, ans = MV.ans(it);
      if (it.kind === "mc") { x.checked = true; ok = MV.ok(it.options[x.choice]); }
      else if (it.kind === "sel") { x.checked = true; ok = it.options.every(function(o, k){ return !!x.pick[k] === MV.ok(o); }); msgs[it.id] = null; }
      else if (it.kind === "pair") {
        var vs = x.vals.map(parseVal);
        if (vs[0] == null || vs[1] == null) { msgs[it.id] = "Enter a number in both boxes, such as 4 or 24."; paintItem(it); return; }
        ok = near(vs[0], ans[0]) && near(vs[1], ans[1]);
        if (!ok) { var nb = near(vs[0], ans[0]) ? (it.wrongB || []).filter(function(w){ return near(vs[1], w.match); })[0] : null; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (nb ? nb.fb : it.general) + " Try again."; }
        else msgs[it.id] = null;
      } else {
        var v = parseVal(x.val);
        if (v == null) { msgs[it.id] = "Enter a number, such as 12 or 0.5."; paintItem(it); return; }
        if (it.kind === "numch") {
          var nOk = near(v, ans, it.tol), ch = x.ch == null ? null : it.options[x.ch], cOk = ch && MV.ok(ch), parts = [];
          if (!nOk) { var w1 = (it.wrong || []).filter(function(w){ return near(v, w.match, it.tol); })[0]; parts.push(w1 ? w1.fb : near(v, ans / 100, 0.01) ? "That’s the fraction stored. Multiply by 100 for the percentage." : it.general); }
          if (ch == null) parts.push("Choose where the rest of the energy went.");
          else if (!cOk) parts.push(ch.why);
          ok = nOk && cOk;
          msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + parts.join(" ") + " Try again.";
        } else {
          ok = near(v, ans, it.tol);
          if (!ok) { var named = (it.wrong || []).filter(function(w){ return near(v, w.match); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general) + " Try again."; }
          else msgs[it.id] = null;
        }
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

// ---------- Performance task: Tune the greenhouse (chips for light, CO₂ and temperature; live greenhouse picture and gauges) ----------
var task = (function(){
  var api = null, T = null;
  function growth(d){ return Math.min(d.L, d.C) / 100 * T.tfac[String(d.T)]; }
  function cost(d){ return d.L / 25 + d.C / 25 + T.heat[String(d.T)]; }
  function read(){ var s = api ? api.S : {}; return { L:s.L == null ? null : +s.L, C:s.C == null ? null : +s.C, T:s.T == null ? null : +s.T }; }
  function full(d){ return d.L != null && d.C != null && d.T != null; }
  function picture(d){
    var ok = full(d), g = ok ? growth(d) : 0, h = "";
    h += sv("rect", { x:0, y:0, width:320, height:200, rx:10, "class":"gh-sky" });
    h += sv("path", { d:"M60 176 V86 L160 34 L260 86 V176", "class":"gh-glass" }) + sv("line", { x1:20, y1:176, x2:300, y2:176, "class":"gh-ground" });
    // lamps (photons in ink): one lit lamp per 25% of light
    var nl = d.L ? d.L / 25 : 0;
    for (var i = 0; i < 4; i++) { var x = 100 + i * 40, lit = i < nl; h += sv("line", { x1:x, y1:66, x2:x, y2:76, "class":"gh-wire" }) + sv("path", { d:"M" + (x - 9) + " 84 Q" + x + " 70 " + (x + 9) + " 84 Z", "class":"gh-lamp" + (lit ? " on" : "") }); if (lit) h += photonSVG(x, 90, x - 4, 112); }
    // CO₂ tank (brown: carbon), fill = CO₂ level
    var cf = (d.C || 0) / 100;
    h += sv("rect", { x:18, y:96, width:26, height:72, rx:8, "class":"gh-tank" }) + sv("rect", { x:21, y:f1(165 - 66 * cf), width:20, height:f1(66 * cf), rx:5, "class":"gh-tankf" }) + txt(31, 92, "CO₂", "fz-lab", "middle");
    // heater: wavy heat lines, one per heating unit
    var hu = d.T != null ? T.heat[String(d.T)] : 0;
    h += sv("rect", { x:228, y:154, width:26, height:16, rx:3, "class":"gh-heat" }) + txt(241, 166, "heat", "fz-sub", "middle");
    for (i = 0; i < hu; i++) h += sv("path", { d:"M" + (232 + i * 6) + " 150 q3 -5 0 -10 q-3 -5 0 -10", "class":"gh-wave" });
    // thermometer
    var tf = d.T != null ? (d.T - 10) / 30 : 0;
    h += sv("rect", { x:282, y:88, width:10, height:72, rx:5, "class":"gh-therm" }) + sv("circle", { cx:287, cy:164, r:8, "class":"gh-bulb" }) + sv("rect", { x:284.5, y:f1(158 - 66 * tf), width:5, height:f1(66 * tf + 4), "class":"gh-tfill" }) + txt(287, 82, d.T != null ? d.T + " °C" : "? °C", "fz-lab", "middle");
    // plants: height follows growth
    [100, 146, 192].forEach(function(x){
      var ht = 10 + 70 * clamp(g / 0.75, 0, 1.33);
      h += sv("line", { x1:x, y1:176, x2:x, y2:f1(176 - ht), "class":"gh-stem" });
      for (var k = 1; k <= 3; k++) { var y = 176 - ht * k / 3.4; h += sv("ellipse", { cx:x - 8, cy:f1(y), rx:8, ry:4, "class":"gh-leaf" }) + sv("ellipse", { cx:x + 8, cy:f1(y - 5), rx:8, ry:4, "class":"gh-leaf" }); }
    });
    return h;
  }
  function gauge(lab, v, max, mark, col, txtv){ return '<div class="gh-g"><span class="gh-gl">' + lab + " <strong>" + txtv + '</strong></span><span class="gh-gt"><i style="width:' + f1(clamp(v / max, 0, 1) * 100) + "%;background:var(" + col + ')"></i><b style="left:' + f1(mark / max * 100) + '%"></b></span></div>'; }
  function draw(){
    var d = read(), ok = full(d), g = ok ? growth(d) : 0, c = ok ? cost(d) : 0, pv = $("#gh-pic");
    if (!pv) return;
    pv.innerHTML = '<svg viewBox="0 0 320 200" class="fz-svg" role="img" aria-label="' + MV.esc("Greenhouse: light " + (d.L != null ? d.L + "%" : "not set") + ", CO₂ " + (d.C != null ? d.C + "%" : "not set") + ", " + (d.T != null ? d.T + " °C" : "temperature not set") + (ok ? ". Growth " + g4(g) + " glucose units per minute; running cost " + nm(c) + "." : ".")) + '">' + picture(d) + "</svg>";
    $("#gh-m").innerHTML = gauge("Growth:", g, 1, 0.5, "--bio-carbon", ok ? g4(g) + " glucose units/min" : "—") + gauge("Running cost:", c, 12, 7, "--ink-2", ok ? nm(c) : "—") +
      '<p class="tiny muted gh-mk">Marks: growth target 0.5; budget 7.</p>';
  }
  function lab(k){ var p = k.split("-"); return "light " + p[0] + "%, CO₂ " + p[1] + "%, " + p[2] + " °C"; }
  function g4(v){ return MV.num(v, 4); }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      inp.innerHTML = '<div class="gh-in"><div id="gh-l"></div><div id="gh-c"></div><div id="gh-t"></div></div>';
      function grp(id, label, list, key, fmt){ radios($(id, inp), { label:label, cls:"chips", options:list.map(function(v){ return { id:v, t:fmt(v) }; }), value:a.S[key] == null ? "" : a.S[key], onChange:function(v){ a.S[key] = +v; a.save(); draw(); a.update(); } }); }
      grp("#gh-l", "Light", T.lights, "L", function(v){ return v + "%"; });
      grp("#gh-c", "CO₂", T.co2s, "C", function(v){ return v + "%"; });
      grp("#gh-t", "Temperature", T.temps, "T", function(v){ return v + " °C"; });
      pv.innerHTML = '<div class="gh-pic" id="gh-pic"></div><div id="gh-m"></div><details class="alg"><summary>' + T.modelTitle + "</summary>" + T.model + "</details>";
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var st = MV.taskState(), g = $("#task-fb .fb.good"); if (!g || st.found.length < 3) return;
        $$("p", g).forEach(function(q){ if (q.innerHTML.indexOf(T.more) >= 0) q.innerHTML = q.innerHTML.replace(T.more, T.allFound); });
      }, 0); });
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Choose a light level, a CO₂ level and a temperature first."; },
    checks:function(d){ if (!full(d)) return [false, false, false]; return [growth(d) >= 0.5 - 1e-9, d.L === d.C, cost(d) <= 7 + 1e-9]; },
    key:function(d){ return d.L + "-" + d.C + "-" + d.T; },
    label:lab,
    text:function(k){ var p = k.split("-").map(Number), d = { L:p[0], C:p[1], T:p[2] }; return lab(k) + ": growth " + g4(growth(d)) + ", cost " + nm(cost(d)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ puzzles:puzzles },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); if (P3F) P3F.show(v === "limiting"); }
});
})();
