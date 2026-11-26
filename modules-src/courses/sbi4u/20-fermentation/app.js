// SBI4U 20 Alternate pathways (fermentation): hero (O₂ runs out, the NAD⁺ gauge falls, lactate fermentation refills it),
// Oxygen switch (S2 pathway map with pyruvate tokens, a poolGauges NAD⁺ gauge and teal carrier loops; S3 ledger strip with an
// ATP split bar; Other fuels mode with entry points and a beta-oxidation strip), "Fermentation at work" (five stations: bread,
// yogurt, fuel ethanol, the S7 yeast bench with a variable tagger and data graph, the after-the-sprint lactate graph),
// standard practice (sorter, number entry, Spot the Error), "Rise to the occasion" task (S7 fermenter with a balloon).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (SVG helpers from SBI4U 08 / 13 / 14) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function frac(v){ return v - Math.floor(v); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "fe-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function op(a, g){ return a == null || a >= 0.98 ? g : a <= 0.02 ? "" : '<g opacity="' + Math.round(a * 100) / 100 + '">' + g + "</g>"; }
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!tot) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
// polyline with an arrowhead at its end
function arrow(pts, cls, noHead){
  var d = pts.map(function(p, i){ return (i ? "L" : "M") + f1(p[0]) + " " + f1(p[1]); }).join(" "), a = pts[pts.length - 2], b = pts[pts.length - 1];
  var L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return sv("path", { d:d, "class":cls }) + (noHead ? "" : sv("path", { d:head(b[0], b[1], (b[0] - a[0]) / L, (b[1] - a[1]) / L, 6), "class":cls + " fe-hd" }));
}
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/,/g, "").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function hexPath(x, y, r){ var d = ""; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; d += (i ? "L" : "M") + f1(x + r * Math.cos(a)) + " " + f1(y + r * Math.sin(a)); } return d + "Z"; }
// carbon token: a brown pill with its carbon count ("3C"), or a hexagon for glucose
function cpill(x, y, lab, a){ var w = 12 + lab.length * 7; return op(a, sv("rect", { x:x - w / 2, y:y - 9, width:w, height:18, rx:9, "class":"fe-c" }) + txt(x, y + 4, lab, "fe-ct", "middle")); }
function chex(x, y, r, a){ return op(a, sv("path", { d:hexPath(x, y, r), "class":"fe-c" }) + (r >= 12 ? txt(x, y + 4, "6C", "fe-ct", "middle") : "")); }
function co2Tok(x, y, a){ return op(a, sv("rect", { x:x - 15, y:y - 8, width:30, height:16, rx:8, "class":"fe-co2" }) + txt(x, y + 4, "CO₂", "fe-co2t", "middle")); }

// ---------- @component radioGroup (copied from SBI4U 14 / 08 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + (o.key || "") + x.id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || off) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); e.stopPropagation();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}
// range slider with output (from SBI4U 14 / 08): slider(host, {id, label, min, max, step, value, unit(v), onChange(v)}) -> {set(v), disable(b)}
function slider(host, o){
  host.innerHTML = '<label class="slider fe-sl"><span class="slider-top"><span>' + o.label + '</span><output id="' + o.id + '-out" for="' + o.id + '"></output></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host);
  function show(v){ out.textContent = o.unit(v); inp.setAttribute("aria-valuetext", o.unit(v)); }
  inp.addEventListener("input", function(){ show(+inp.value); o.onChange(+inp.value); });
  show(o.value);
  return { set:function(v){ inp.value = v; show(v); }, disable:function(b){ inp.disabled = b; } };
}

// ---------- model (plan: Explore model rules; deterministic) ----------
// Glycolysis runs at 10 glucose/s while it has NAD⁺. Pool: 100 units, 2 per glucose (20 units/s). O₂ (the chain) or a working
// fermentation enzyme returns them; with O₂ absent and the enzyme blocked the pool empties at 5 s and glycolysis stops.
var ENZ = { muscle:"lactate dehydrogenase", yeast:"alcohol dehydrogenase" };
function oxModel(S, T){
  var o2 = S.o2 === "present", work = S.enz === "working", yeast = S.cell === "yeast", cur = S.atpA === "current";
  var route = o2 ? "aerobic" : work ? (yeast ? "alcohol" : "lactate") : "none", regen = route !== "none", running = regen || T < 5 - 1e-9;
  var m = { o2:o2, work:work, yeast:yeast, cur:cur, route:route, regen:regen, running:running, T:T,
    pool:regen ? 100 : Math.max(0, 100 - 20 * T), glu:Math.round(10 * (regen ? T : Math.min(T, 5))) };
  m.atpN = route === "aerobic" ? (cur ? 31 : 36) : running ? 2 : 0;
  m.atpShort = route === "aerobic" ? (cur ? "≈ 30–32" : "36") : String(m.atpN);
  m.co2N = route === "aerobic" ? 6 : route === "alcohol" || (route === "none" && yeast && running) ? 2 : 0;
  m.routeText = { aerobic:"Aerobic respiration", lactate:"Lactate fermentation", alcohol:"Alcohol fermentation" }[route] ||
    (running ? "None: nothing recycles NAD⁺ (glycolysis will stop at 5 s)" : "None: glycolysis has stopped");
  m.pyrText = { aerobic:"Acetyl-CoA (and CO₂), then the Krebs cycle", lactate:"Lactate (all 3 carbons kept)", alcohol:"Acetaldehyde, then ethanol" }[route] ||
    (yeast ? "Acetaldehyde (and CO₂), which piles up: the ethanol step is blocked" : "Nothing: pyruvate piles up");
  m.regenText = { aerobic:"Electron transport chain", lactate:"Lactate dehydrogenase", alcohol:"Alcohol dehydrogenase" }[route] || "Nothing (" + ENZ[S.cell] + " is blocked)";
  m.atpText = route === "aerobic" ? (cur ? "about 30–32 (current estimate)" : "36 (theoretical, eukaryote)") : regen ? "2" : running ? "2, only until the NAD⁺ runs out" : "0: glycolysis has stopped";
  m.co2Text = route === "aerobic" ? "6" : route === "alcohol" ? "2" : route === "lactate" ? "0" : yeast ? (running ? "2, until glycolysis stops" : "0: glycolysis has stopped") : "0";
  m.endText = { aerobic:"6 CO₂, 6 H₂O", lactate:"2 lactate", alcohol:"2 ethanol, 2 CO₂" }[route] ||
    (yeast ? "None: acetaldehyde and NADH pile up (CO₂ escapes)" : "None: pyruvate and NADH pile up");
  m.poolText = regen ? "100 units (steady)" : m.pool > 0 ? MV.num(m.pool) + " units (falling 20 units/s)" : "0 units (empty at 5 s)";
  m.runText = running ? "Yes" : "No: no NAD⁺ left (stopped at 5 s)";
  m.nadhText = route === "aerobic" ? "10 made · 10 emptied" : regen ? "2 made · 2 emptied" : "2 made · 0 emptied";
  return m;
}
// Other fuels (plan readouts). VERIFY: glycerol → G3P counted with 1 NADH (SBI4U 14's model); the amino acids' own deamination
// carriers are not counted (the plan gives no values), so alanine counts only pyruvate oxidation and glutamate none.
function fuelModel(S){
  var n = S.len, f = S.fuel;
  if (f === "fatty") return { name:"Fatty acid, " + n + " carbons", entry:"Krebs cycle, as acetyl-CoA (after beta-oxidation in the mitochondrion)", acetyl:n / 2, nadh:n / 2 - 1, fadh:n / 2 - 1, rounds:n / 2 - 1, nitrogen:"None",
    nadhT:String(n / 2 - 1) + " (1 per round)", fadhT:String(n / 2 - 1) + " (1 per round)", roundsT:String(n / 2 - 1) };
  var D = {
    glucose:{ name:"Glucose", entry:"Glycolysis (the start)", acetyl:2, nadh:4, fadh:0, nadhT:"4 (2 in glycolysis, 2 in pyruvate oxidation)" },
    glycerol:{ name:"Glycerol (from fats)", entry:"Glycolysis, as G3P (a 3-carbon sugar phosphate)", acetyl:1, nadh:3, fadh:0, nadhT:"3 (1 making G3P, 1 in glycolysis, 1 in pyruvate oxidation)" },
    alanine:{ name:"Alanine (an amino acid)", entry:"Pyruvate (after deamination)", acetyl:1, nadh:1, fadh:0, nadhT:"1 (pyruvate oxidation)", n:true },
    glutamate:{ name:"Glutamate (an amino acid)", entry:"Krebs cycle, as α-ketoglutarate (after deamination)", acetyl:0, nadh:0, fadh:0, nadhT:"0 (it joins the cycle itself)", n:true }
  }[f];
  D.rounds = null; D.roundsT = "None: not a fatty acid"; D.fadhT = "0";
  D.nitrogen = D.n ? "1 amino group → ammonia → urea in the liver" : "None";
  return D;
}

// ---------- @component S2 pathwayStepper — oxygen-switch map (adapted from SBI4U 13's station map): glycolysis in the cytosol,
// pyruvate oxidation, Krebs and the chain in a mitochondrion outline, the lactate or alcohol branch, brown pyruvate tokens that flow
// with the model time, teal NADH → NAD⁺ loops at the active regenerator. Other-fuels form: entry arrows and a fuel strip.
// @component poolGauges (one pool; adapted from SBI4U 12) — the NAD⁺ gauge under the cell. mapSVG(S, T, {xf:{from, k}}) ----------
var MW = 460, MH = 358, GX = 84;
var AER1 = [[104, 198], [142, 174], [176, 128]], AER2 = [[252, 118], [274, 118]];
var LAC = [[96, 218], [118, 258], [316, 258]], ALC1 = [[96, 218], [118, 258], [200, 258]], ALC2 = [[256, 258], [336, 258]];
// teal carrier loop (@component carrierLoop — NADH → NAD⁺ shown as a spinning ring, from SBI4U 12's electron shuttle idea)
function loopSVG(cx, cy, rx, ry, a, T){
  if (a <= 0.02) return "";
  var ang = T * 2.2, px = cx + rx * Math.cos(ang), py = cy + ry * Math.sin(ang);
  return op(a, sv("ellipse", { cx:cx, cy:cy, rx:rx, ry:ry, "class":"fe-loop" }) + sv("path", { d:head(cx + 6, cy - ry, 1, 0, 5), "class":"fe-loop fe-hd" }) +
    sv("circle", { cx:f1(px), cy:f1(py), r:3.4, "class":"fe-nadh" }) + txt(cx, cy + 3.5, "NADH → NAD⁺", "fe-lt", "middle"));
}
function blockMark(x, y){ return sv("circle", { cx:x, cy:y, r:8, "class":"fe-blk" }) + sv("path", { d:"M" + (x - 5.5) + " " + (y + 5.5) + " L" + (x + 5.5) + " " + (y - 5.5), "class":"fe-blk" }); }
function deck(x, y, lab, n, a, dx){ var h = ""; dx = dx || 4; for (var i = Math.min(n, 4); i >= 1; i--) h += cpill(x + dx * i, y - 4 * i, lab, 1); return op(a, h); }
function mapSVG(S, T, o){
  o = o || {};
  var fuels = S.mode === "fuels", xf = o.xf;
  var m = oxModel(fuels ? { o2:"present", enz:"working", cell:"muscle", atpA:S.atpA } : S, T);
  function A(r){ var a = m.route === r ? (xf ? xf.k : 1) : 0; if (xf && xf.from === r) a += 1 - xf.k; return a; }
  var aAer = A("aerobic"), aLac = A("lactate"), aAlc = A("alcohol"), run = m.running;
  var h = "";
  // cell outline (yeast get a cell wall)
  if (!fuels && S.cell === "yeast") h += sv("rect", { x:3, y:3, width:454, height:316, rx:34, "class":"fe-wall" });
  h += sv("rect", { x:8, y:8, width:444, height:306, rx:30, "class":"fe-cell" });
  h += txt(24, 30, fuels ? "A body cell · cytosol" : (S.cell === "yeast" ? "Yeast cell · cytosol" : "Muscle cell · cytosol"), "fe-title");
  // glycolysis lane
  var lane = run ? frac(T * 0.5) : 0.35;
  h += sv("path", { d:hexPath(GX, 72, 17), "class":"fe-c" }) + txt(GX, 76, "6C", "fe-ct", "middle") + txt(GX - 24, 76, "glucose", "fe-sm", "end");
  h += sv("path", { d:"M" + GX + " 92 L" + GX + " 112", "class":"fe-lane", "stroke-dashoffset":f1(-T * 14) }) + sv("path", { d:head(GX, 114, 0, 1, 6), "class":"fe-lanehd" });
  h += sv("rect", { x:GX - 46, y:116, width:92, height:58, rx:10, "class":"fe-gbox" + (run ? "" : " off") });
  h += txt(GX, 136, "Glycolysis", "fe-bt", "middle") + (run ? txt(GX, 151, "net 2 ATP", "fe-atpt", "middle") : txt(GX, 151, "✗ stopped", "fe-stop", "middle")) + txt(GX, 166, "NAD⁺ → NADH", "fe-nt", "middle");
  h += sv("path", { d:"M" + GX + " 176 L" + GX + " 192", "class":"fe-lane", "stroke-dashoffset":f1(-T * 14) }) + sv("path", { d:head(GX, 195, 0, 1, 6), "class":"fe-lanehd" });
  if (run) { h += chex(GX, lerp(94, 112, lane), 7, 1 - seg(lane, 0.8, 1)); h += cpill(GX, lerp(178, 190, lane), "3C", 0.9 * (1 - seg(lane, 0.85, 1))); }
  h += cpill(GX, 206, "3C") + txt(GX - 20, 210, "pyruvate", "fe-sm", "end");
  // mitochondrion
  var mf = fuels ? 1 : 0.3 + 0.7 * aAer, mi = "";
  mi += sv("rect", { x:150, y:44, width:296, height:138, rx:48, "class":"fe-mo" }) + sv("rect", { x:157, y:51, width:282, height:124, rx:42, "class":"fe-mi" });
  mi += txt(182, 166, "mitochondrion", "fe-sm");
  mi += sv("rect", { x:178, y:96, width:72, height:44, rx:8, "class":"fe-stn" }) + txt(214, 115, "Pyruvate", "fe-st", "middle") + txt(214, 129, "oxidation", "fe-st", "middle");
  mi += sv("circle", { cx:300, cy:118, r:25, "class":"fe-stn" }) + txt(300, 116, "Krebs", "fe-st", "middle") + txt(300, 129, "cycle", "fe-st", "middle");
  mi += sv("rect", { x:346, y:94, width:82, height:48, rx:8, "class":"fe-stn" }) + txt(387, 110, "electron", "fe-st2", "middle") + txt(387, 122, "transport", "fe-st2", "middle") + txt(387, 134, "chain", "fe-st2", "middle");
  mi += arrow([[251, 118], [273, 118]], "fe-ar") + arrow([[326, 118], [344, 118]], "fe-ar");
  h += op(mf, mi);
  var o2on = fuels ? 1 : aAer;
  if (o2on > 0.02) h += op(o2on, sv("rect", { x:340, y:64, width:30, height:18, rx:9, "class":"fe-o2" }) + txt(355, 77, "O₂", "fe-o2t", "middle") + arrow([[362, 83], [372, 92]], "fe-o2a") + txt(376, 77, "→ H₂O", "fe-o2l"));
  if (!fuels && o2on < 0.98) h += op(1 - o2on, txt(355, 78, "no O₂", "fe-noo2", "middle"));
  // aerobic route: pyruvate → mitochondrion
  var aa = fuels ? 1 : aAer;
  h += op(fuels ? 1 : 0.25 + 0.75 * aAer, arrow(AER1, "fe-rt" + (aa > 0.5 ? " on" : "")));
  h += loopSVG(387, 160, 44, 9, aa, T);
  if (aa > 0.02) {
    var th = "";
    for (var i = 0; i < 3; i++) {
      var u = frac(T * 0.12 + i / 3), p;
      if (u < 0.6) { p = polyAt(AER1, u / 0.6); th += cpill(p[0], p[1], "3C", seg(u, 0, 0.06) * (1 - seg(u, 0.55, 0.6))); }
      else if (u >= 0.62 && u < 0.95) th += co2Tok(214, lerp(84, 58, seg(u, 0.62, 0.92)), seg(u, 0.62, 0.66) * (1 - seg(u, 0.84, 0.95)));
      if (u >= 0.7 && u < 0.95) { p = [lerp(256, 290, (u - 0.7) / 0.25), 118]; th += cpill(p[0], p[1], "2C", seg(u, 0.7, 0.74) * (1 - seg(u, 0.88, 0.95))); }
      var kc = frac(T * 0.12 + i / 3 + 0.5);
      if (i < 2 && kc < 0.5) th += co2Tok(300, lerp(84, 58, kc / 0.5), seg(kc, 0, 0.05) * (1 - seg(kc, 0.3, 0.5)));
    }
    h += op(aa, th);
  }
  if (!fuels) h += branchSVG(S, T, m, aLac, aAlc);
  else h += fuelSVG(S);
  // NAD⁺ gauge (poolGauges, one pool): oxygen mode only
  if (!fuels) {
    var pw = 250, fill = m.pool / 100 * pw;
    h += txt(12, 343, "NAD⁺ pool", "fe-gl") + sv("rect", { x:96, y:329, width:pw, height:20, rx:5, "class":"fe-gt" }) + (fill > 0.5 ? sv("rect", { x:96, y:329, width:f1(fill), height:20, rx:5, "class":"fe-gf" }) : "");
    h += sv("path", { d:"M" + (96 + pw) + " 325 L" + (96 + pw) + " 353", "class":"fe-gm" });
    h += txt(354, 344, MV.num(m.pool) + " units" + (m.regen ? " · steady" : m.pool > 0 ? " · falling" : " · empty"), "fe-gv");
  }
  return h;
}
function branchSVG(S, T, m, aLac, aAlc){
  var h = "", run = m.running, none = m.route === "none", yeast = S.cell === "yeast";
  if (!yeast) {
    var on = aLac;
    h += op(0.3 + 0.7 * Math.max(on, none ? 1 : 0), arrow(LAC, "fe-rt" + (on > 0.5 ? " on" : "") + (none ? " blk" : "")));
    h += txt(214, 248, "lactate dehydrogenase", "fe-enz", "middle");
    if (none) h += blockMark(214, 258);
    h += cpill(350, 258, "3C", none ? 0.3 : 0.35 + 0.65 * on) + txt(350, 284, "lactate", "fe-sm", "middle");
    h += loopSVG(214, 300, 42, 9, on, T);
    if (on > 0.02) { var th = ""; for (var i = 0; i < 3; i++) { var u = frac(T * 0.12 + i / 3), p = polyAt(LAC, u); th += cpill(p[0], p[1], "3C", seg(u, 0, 0.06) * (1 - seg(u, 0.94, 1))); } h += op(on, th); }
    if (none) { var n = run ? Math.ceil(T) : 4; if (n > 0) h += deck(GX, 206, "3C", n, 1) + txt(GX - 20, 223, "piling up", "fe-pile", "end"); }
  } else {
    var on2 = aAlc;
    h += op(0.3 + 0.7 * Math.max(on2, none ? 1 : 0), arrow(ALC1, "fe-rt" + (on2 > 0.5 || none ? " on" : "")));
    h += op(0.3 + 0.7 * on2, arrow(ALC2, "fe-rt" + (on2 > 0.5 ? " on" : "") + (none ? " blk" : "")));
    h += txt(158, 236, "pyruvate", "fe-enz", "middle") + txt(158, 248, "decarboxylase", "fe-enz", "middle");
    h += txt(296, 236, "alcohol", "fe-enz", "middle") + txt(296, 248, "dehydrogenase", "fe-enz", "middle");
    if (none) h += blockMark(296, 258);
    var acOn = on2 > 0.02 || (none && (run || T > 0)) ? 1 : 0.3;
    h += cpill(228, 258, "2C", acOn) + txt(228, 284, none ? "acetaldehyde (piling up)" : "acetaldehyde", none ? "fe-pile" : "fe-sm", "middle");
    h += cpill(366, 258, "2C", none ? 0.3 : 0.35 + 0.65 * on2) + txt(366, 284, "ethanol", "fe-sm", "middle");
    h += loopSVG(296, 300, 42, 9, on2, T);
    var flow = Math.max(on2, none && run ? 1 : 0);
    if (flow > 0.02) {
      var tk = "";
      for (var j = 0; j < 3; j++) {
        var v = frac(T * 0.12 + j / 3), q;
        if (v < 0.5) { q = polyAt(ALC1, v / 0.5); tk += cpill(q[0], q[1], "3C", seg(v, 0, 0.06)); }
        else { tk += co2Tok(228, lerp(238, 198, seg(v, 0.5, 0.85)), 1 - seg(v, 0.75, 0.88)); if (!none) { q = polyAt(ALC2, (v - 0.5) / 0.5); tk += cpill(q[0], q[1], "2C", 1 - seg(v, 0.94, 1)); } }
      }
      h += op(flow, tk);
    }
    if (none) { var n2 = run ? Math.ceil(T) : 4; if (n2 > 0) h += deck(228, 258, "2C", n2, 1, -3.5); }
  }
  return h;
}
// fuel strip and entry arrow (Other fuels)
function fuelSVG(S){
  var f = S.fuel, h = "", y = 258, n = S.len;
  function entry(pts, lab, lx, ly, anchor, ring){
    return sv("path", { d:pts.map(function(p, i){ return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" "), "class":"fe-enu" }) + arrow(pts, "fe-en") +
      (ring ? sv("circle", { cx:ring[0], cy:ring[1], r:ring[2], "class":"fe-ringh" }) + sv("circle", { cx:ring[0], cy:ring[1], r:ring[2], "class":"fe-ring" }) : "") + (lab ? lab.map(function(t, i){ return txt(lx, ly + i * 13, t, "fe-enl", anchor); }).join("") : "");
  }
  if (f === "glucose") {
    h += chex(230, y, 16) + txt(230, 284, "glucose", "fe-sm", "middle");
    h += entry([[210, 254], [150, 150], [98, 80]], ["enters at the start", "of glycolysis"], 160, 222, "middle", [GX, 72, 24]);
  } else if (f === "glycerol") {
    h += cpill(230, y, "3C") + txt(230, 284, "glycerol", "fe-sm", "middle");
    h += entry([[212, 252], [164, 200], [136, 150]], ["enters glycolysis", "as G3P"], 176, 236, "end");
  } else if (f === "fatty") {
    var k = n - 1, s = Math.min(16, 270 / k), x0 = 300 - s * k / 2, beads = "", cuts = "";
    beads += sv("path", { d:"M" + f1(x0) + " " + y + " L" + f1(x0 + s * k) + " " + y, "class":"fe-chain" });
    for (var i = 0; i < n; i++) beads += sv("circle", { cx:f1(x0 + s * i), cy:y, r:Math.min(6, s / 2.4), "class":"fe-bead" });
    for (var c = 1; c < n / 2; c++) { var cx = x0 + s * (2 * c - 0.5); cuts += sv("path", { d:"M" + f1(cx) + " " + (y - 12) + " L" + f1(cx) + " " + (y + 12), "class":"fe-cut" }); }
    h += beads + cuts + txt(300, 284, n + " carbons · " + (n / 2 - 1) + " cuts · " + n / 2 + " acetyl-CoA", "fe-sm", "middle");
    h += entry([[300, 248], [300, 146]], ["beta-oxidation", "→ acetyl-CoA"], 308, 196, "start", [300, 118, 31]);
  } else {
    var glu = f === "glutamate";
    h += cpill(214, y, glu ? "5C" : "3C") + sv("rect", { x:244, y:y - 9, width:36, height:18, rx:4, "class":"fe-nh2" }) + txt(262, y + 4, "NH₂", "fe-nh2t", "middle");
    h += sv("path", { d:"M234 " + (y - 14) + " L234 " + (y + 14), "class":"fe-cut" });
    h += txt(214, 284, glu ? "glutamate" : "alanine", "fe-sm", "middle") + txt(288, y + 4, "→ NH₃ → urea (liver)", "fe-sm");
    if (glu) h += entry([[200, 250], [240, 196], [282, 140]], ["deamination", "→ α-ketoglutarate"], 238, 222, "end", [300, 118, 31]);
    else h += entry([[196, 252], [150, 226], [102, 212]], ["deamination", "→ pyruvate"], 150, 210, "middle", [GX, 206, 24]);
  }
  return h;
}

// ---------- @component S3 energyLedger — tally strip (from SBI4U 14) with an ATP split bar (from SBI4U 17's split-bar form):
// fermentation's 2 ATP against the aerobic 36 on one scale. ----------
function tally(n, col, cap){
  cap = cap || 12; var h = "";
  for (var i = 0; i < Math.min(n, cap); i++) h += "<i></i>";
  return '<span class="fe-tal" style="--c:var(' + col + ')" aria-hidden="true">' + h + (n > cap ? "<b>+" + (n - cap) + "</b>" : "") + "</span>";
}
function lcell(lab, val, extra, cls){ return '<div class="fe-cell' + (cls ? " " + cls : "") + '"><span class="fe-cl">' + lab + "</span><b>" + val + "</b>" + (extra || "") + "</div>"; }
function ledgerHTML(S, m, f, xfAtp){
  if (S.mode === "fuels") return '<div class="fe-lrow">' + lcell("Acetyl-CoA", f.acetyl, tally(f.acetyl, "--bio-carbon")) + lcell("NADH before Krebs", f.nadh, tally(f.nadh, "--bio-nadh")) +
    lcell("FADH₂ before Krebs", f.fadh, tally(f.fadh, "--bio-fadh")) + lcell("Rounds of beta-oxidation", f.rounds == null ? "—" : f.rounds, "") + "</div>";
  var atp = xfAtp != null ? xfAtp : m.atpN, lab = xfAtp != null ? String(Math.round(xfAtp)) : m.atpShort;
  var bar = '<span class="fe-abar" aria-hidden="true"><i style="width:' + f1(atp / 38 * 100) + '%"></i><b style="left:' + f1(2 / 38 * 100) + '%"></b><b style="left:' + f1(36 / 38 * 100) + '%"></b><em style="left:' + f1(2 / 38 * 100) + '%">2</em><em style="left:' + f1(36 / 38 * 100) + '%">36</em></span>';
  return '<div class="fe-lrow">' + lcell("ATP per glucose", lab, bar, "fe-catp") + lcell("CO₂ per glucose", m.co2N, tally(m.co2N, "--bio-carbon")) +
    lcell("NADH per glucose", m.nadhText, "") + lcell("Glucose used", MV.num(m.glu) + (m.running ? "" : " (stopped)"), "") +
    lcell("ATP counting", m.cur ? "2.5 / 1.5" : "3 / 2", "") + "</div>";
}

// ---------- Explore: Oxygen switch ----------
var EXF = null;
function explore(host, api){
  var C = api.content, S = api.S;
  var D = { mode:"ox", cell:"muscle", o2:"present", enz:"working", t:0, atpA:"theory", fuel:"glucose", len:16, a3:["", ""] };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = Array.isArray(D[k]) ? D[k].slice() : D[k]; });
  S.t = clamp(Math.round(+S.t || 0), 0, 60); S.len = clamp(2 * Math.round((+S.len || 16) / 2), 4, 20);
  var Td = S.t, anim = null, playing = false, busy = false, pend = null, cap = "", xf = null, xfAtp = null, readSig = "", ledSig = "";
  host.innerHTML = '<div class="fe-ex"><div class="fe-led" id="fe-led" aria-live="polite"></div>' +
    '<div class="pg fe-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="fe-map"><svg id="fe-svg" viewBox="0 0 ' + MW + " " + MH + '" role="img" focusable="false"></svg></div>' +
      '<p class="tiny fe-key" aria-hidden="true"><span class="fe-kk fe-kk-c">3C</span> carbon compounds <span class="fe-kk fe-kk-n"></span> NADH / NAD⁺ <span class="fe-kk fe-kk-o">O₂</span> oxygen <span class="fe-kk fe-kk-a"></span> ATP</p>' +
      '<p class="fe-cap" id="fe-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="fe-mode"></div>' +
      '<div class="fe-panel" id="fe-oxp"><div id="fe-cell"></div><div id="fe-o2"></div><div id="fe-enz"></div><p class="tiny muted fe-enote">' + C.enzNote + "</p>" +
        '<div class="fe-time"><div id="fe-t"></div><div class="fe-player" role="group" aria-label="Time controls"><button type="button" class="btn ghost sm" data-pa="play" data-k="feplay">Play</button><button type="button" class="btn primary sm" data-pa="step" data-k="festep">Step 1 s</button></div></div>' +
        '<div id="fe-atp"></div></div>' +
      '<div class="fe-panel" id="fe-fup"><div id="fe-fuel"></div><div id="fe-len"></div>' +
        '<fieldset class="fe-ans"><legend>Answer boxes for challenge 3</legend><div class="fe-ansrow">' +
          '<div class="numrow"><label for="fe-a3-0">NADH:</label><input class="numin" id="fe-a3-0" data-ix="0" type="text" inputmode="numeric" autocomplete="off"></div>' +
          '<div class="numrow"><label for="fe-a3-1">FADH₂:</label><input class="numin" id="fe-a3-1" data-ix="1" type="text" inputmode="numeric" autocomplete="off"></div></div></fieldset></div></div>' +
    '<div class="pg-read"><dl class="read fe-read" id="fe-read" aria-live="polite"></dl><p class="tiny muted fe-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div></div>";
  var svg = $("#fe-svg", host), led = $("#fe-led", host), player = $(".fe-player", host);
  var modeR = radios($("#fe-mode", host), { label:"Mode", key:"m", options:[{ id:"ox", t:"Oxygen switch" }, { id:"fuels", t:"Other fuels" }], value:S.mode, onChange:function(v){ setting({ mode:v }); } });
  var cellR = radios($("#fe-cell", host), { label:"Cell", key:"c", cls:"chips", options:[{ id:"muscle", t:"Muscle cell" }, { id:"yeast", t:"Yeast cell" }], value:S.cell, onChange:function(v){ setting({ cell:v }); } });
  var o2R = radios($("#fe-o2", host), { label:"O₂", key:"o", options:[{ id:"present", t:"Present" }, { id:"absent", t:"Absent" }], value:S.o2, onChange:function(v){ setting({ o2:v }); } });
  var enzR = radios($("#fe-enz", host), { label:"Fermentation enzyme", key:"e", options:[{ id:"working", t:"Working" }, { id:"blocked", t:"Blocked" }], value:S.enz, onChange:function(v){ setting({ enz:v }); } });
  var tS = slider($("#fe-t", host), { id:"fe-tr", label:"Time", min:0, max:60, step:1, value:S.t, unit:function(v){ return v + " s"; }, onChange:function(v){ stopPlay(); S.t = v; Td = v; cap = ""; api.save(); paintAll(); MV.changed(); } });
  var atpR = radios($("#fe-atp", host), { label:"ATP assumption", key:"a", options:[{ id:"theory", t:"Theoretical (3/2)" }, { id:"current", t:"Current estimate (2.5/1.5)" }], value:S.atpA, onChange:function(v){ setting({ atpA:v }); } });
  var fuelR = radios($("#fe-fuel", host), { label:"Fuel", key:"f", cls:"chips", options:[{ id:"glucose", t:"Glucose" }, { id:"glycerol", t:"Glycerol" }, { id:"fatty", t:"Fatty acid" }, { id:"alanine", t:"Alanine" }, { id:"glutamate", t:"Glutamate" }], value:S.fuel, onChange:function(v){ setting({ fuel:v }); } });
  var lenS = slider($("#fe-len", host), { id:"fe-lr", label:"Fatty-acid chain length", min:4, max:20, step:2, value:S.len, unit:function(v){ return v + " carbons"; }, onChange:function(v){ setting({ len:v }); } });
  $$("[data-ix]", host).forEach(function(inp){ inp.value = S.a3[+inp.dataset.ix] || ""; });
  host.addEventListener("input", function(e){ var ix = e.target.dataset && e.target.dataset.ix; if (ix == null || !e.target.closest(".fe-ans")) return; S.a3[+ix] = e.target.value; api.save(); MV.changed(); });
  player.addEventListener("click", function(e){ var b = e.target.closest("[data-pa]"); if (!b || b.disabled || busy) return; if (b.dataset.pa === "play") play(); else step(); });

  // ---- time ----
  function stopPlay(){ if (anim) { anim(); anim = null; } if (playing) { playing = false; S.t = clamp(Math.floor(Td + 1e-6), 0, 60); Td = S.t; api.save(); } }
  function tick(v){ Td = v; var it = clamp(Math.floor(v + 1e-6), 0, 60); if (it !== S.t) { S.t = it; tS.set(it); paintRead(); paintLed(); MV.changed(); } paintMap(); }
  function play(){
    if (playing) { stopPlay(); paintAll(); MV.changed(); return; }
    if (S.t >= 60) { S.t = 0; Td = 0; }
    var from = S.t; playing = true; cap = ""; paintPlayer(); paintCap();
    anim = MV.tween({ dur:(60 - from) * 200, ease:lin, step:function(k){ tick(lerp(from, 60, k)); }, done:function(){ anim = null; playing = false; S.t = 60; Td = 60; api.save(); paintAll(); MV.changed(); } });
  }
  function step(){
    stopPlay(); if (S.t >= 60) return;
    var from = S.t; S.t = from + 1; api.save(); cap = ""; paintPlayer();
    anim = MV.tween({ dur:200, ease:lin, step:function(k){ Td = from + k; paintMap(); }, done:function(){ anim = null; Td = S.t; paintAll(); MV.changed(); } });
    tS.set(S.t); paintRead(); paintLed(); paintCap(); MV.changed();
  }
  function setting(p){
    stopPlay();
    Object.keys(p).forEach(function(k){ S[k] = p[k]; });
    var m = oxModel(S, S.t);
    if (p.mode) cap = p.mode === "fuels" ? "Other fuels: fats and proteins feed the same pathway. Pick a fuel to see where it enters." : "";
    else if (p.cell) cap = p.cell === "yeast" ? "Yeast cell: without O₂, pyruvate loses CO₂ to become acetaldehyde, then ethanol." : "Muscle cell: without O₂, pyruvate becomes lactate.";
    else if (p.o2) cap = p.o2 === "absent" ? "O₂ off: the chain stops, so " + (m.work ? (m.yeast ? "alcohol" : "lactate") + " fermentation takes over recycling NAD⁺." : "nothing recycles NAD⁺.") : "O₂ on: pyruvate goes into the mitochondrion, and the chain recycles NADH.";
    else if (p.enz) cap = p.enz === "blocked" ? "Enzyme blocked: " + ENZ[S.cell] + " can’t take NADH’s electrons." + (m.o2 ? " With O₂ present, the chain still recycles NAD⁺." : "") : "Enzyme working: " + ENZ[S.cell] + " can take NADH’s electrons.";
    else if (p.atpA) cap = p.atpA === "current" ? "Current estimate: about 2.5 ATP per NADH and 1.5 per FADH₂, so about 30–32 ATP aerobically." : "Theoretical count: 3 ATP per NADH and 2 per FADH₂, so 36 ATP for a eukaryote.";
    else cap = "";
    api.save(); paintAll(); MV.changed();
  }
  function capFor(){
    if (S.mode === "fuels") {
      var n = S.len;
      return { glucose:"Glucose enters at the start of glycolysis.", glycerol:"Glycerol, from fats, enters glycolysis as G3P, a 3-carbon sugar phosphate.",
        fatty:"Beta-oxidation cuts the " + n + "-carbon chain into " + n / 2 + " two-carbon pieces with " + (n / 2 - 1) + " cuts. Each acetyl-CoA goes straight into the Krebs cycle.",
        alanine:"Alanine loses its amino group (deamination) and becomes pyruvate. The nitrogen goes to the liver as ammonia and leaves as urea.",
        glutamate:"Glutamate is deaminated to α-ketoglutarate, a Krebs-cycle intermediate. The nitrogen becomes urea in the liver." }[S.fuel];
    }
    var m = oxModel(S, S.t);
    if (m.route === "aerobic") return "Pyruvate enters the mitochondrion. The chain passes the electrons to O₂ and recycles NAD⁺: " + m.atpShort + " ATP per glucose.";
    if (m.route === "lactate") return "No O₂: pyruvate takes NADH’s electrons and becomes lactate. NAD⁺ comes back, so glycolysis keeps making its 2 ATP.";
    if (m.route === "alcohol") return "No O₂: pyruvate loses CO₂ to become acetaldehyde, which takes NADH’s electrons and becomes ethanol. NAD⁺ comes back.";
    if (m.running) return "Nothing recycles NAD⁺, so the pool falls by 20 units each second. " + (S.t === 0 ? "Press Play or Step to watch." : "");
    return "The NAD⁺ pool emptied at 5 s. Glycolysis has stopped, so the cell makes no ATP.";
  }

  // ---- painting ----
  function describe(){
    if (S.mode === "fuels") { var f = fuelModel(S); return "Pathway map, other fuels. " + f.name + " enters at: " + f.entry + ". Acetyl-CoA made: " + f.acetyl + ". NADH before the Krebs cycle: " + f.nadh + "; FADH₂: " + f.fadh + "." + (f.rounds != null ? " Rounds of beta-oxidation: " + f.rounds + "." : "") + (f.n ? " The amino group is removed and becomes urea." : ""); }
    var m = oxModel(S, S.t);
    return "Pathway map: " + (S.cell === "yeast" ? "yeast" : "muscle") + " cell, O₂ " + S.o2 + ", fermentation enzyme " + S.enz + ", at " + S.t + " s. Route after glycolysis: " + m.routeText + ". Pyruvate becomes: " + m.pyrText + ". NAD⁺ pool: " + m.poolText + ". Glycolysis running: " + m.runText + ".";
  }
  function paintMap(){ svg.innerHTML = mapSVG(S, Td, { xf:xf }); }
  function paintLed(){ var h = ledgerHTML(S, oxModel(S, S.t), S.mode === "fuels" ? fuelModel(S) : null, xfAtp); if (h !== ledSig) { ledSig = h; led.innerHTML = h; } }
  function paintRead(){
    var rows;
    if (S.mode === "fuels") { var f = fuelModel(S); rows = [["Fuel", f.name], ["Entry point", f.entry], ["Acetyl-CoA made", String(f.acetyl)], ["NADH made before the Krebs cycle", f.nadhT], ["FADH₂ made before the Krebs cycle", f.fadhT], ["Rounds of beta-oxidation", f.roundsT], ["Nitrogen removed", f.nitrogen]]; }
    else { var m = oxModel(S, S.t); rows = [["Oxygen", m.o2 ? "Present" : "Absent"], ["Route after glycolysis", m.routeText], ["Pyruvate becomes", m.pyrText], ["NAD⁺ regenerated by", m.regenText], ["ATP per glucose", m.atpText], ["CO₂ per glucose", m.co2Text], ["End products", m.endText], ["NAD⁺ pool", m.poolText], ["Glycolysis running?", m.runText]]; }
    var h = MV.readoutHTML(rows); if (h !== readSig) { readSig = h; $("#fe-read", host).innerHTML = h; }
  }
  function paintPlayer(){
    $$("[data-pa]", player).forEach(function(b){
      if (b.dataset.pa === "play") { b.textContent = playing ? "Pause" : "Play"; b.disabled = busy; }
      else b.disabled = busy || S.t >= 60;
    });
  }
  function paintCap(){ $("#fe-cap", host).textContent = cap || capFor(); }
  function sync(){
    modeR.set(S.mode); cellR.set(S.cell); o2R.set(S.o2); enzR.set(S.enz); atpR.set(S.atpA); fuelR.set(S.fuel); tS.set(S.t); lenS.set(S.len);
    $("#fe-oxp", host).hidden = S.mode !== "ox"; $("#fe-fup", host).hidden = S.mode !== "fuels"; $("#fe-len", host).hidden = S.fuel !== "fatty";
    [modeR, cellR, o2R, enzR, atpR, fuelR].forEach(function(r){ r.disable(busy); }); tS.disable(busy); lenS.disable(busy);
    $$(".fe-ans input", host).forEach(function(i){ i.disabled = busy; });
  }
  function paintAll(){ sync(); paintPlayer(); paintLed(); paintMap(); paintRead(); paintCap(); svg.setAttribute("aria-label", describe()); }
  function stickTop(){
    var hd = document.querySelector("header.top"); if (!hd) return;
    var top = (parseFloat(getComputedStyle(hd).top) || 0) + hd.getBoundingClientRect().height;
    led.style.setProperty("--fe-top", Math.round(top) + "px");
  }
  window.addEventListener("resize", stickTop);
  stickTop(); paintAll();

  // ---- target challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var c = byId(C.challenges, id), N = c.named || {};
    if (id === "tc1") {
      if (S.mode !== "ox") return { ok:false, msg:N.mode };
      if (S.cell !== "muscle") return { ok:false, msg:N.cell };
      if (S.o2 === "present") return { ok:false, msg:N.o2 };
      if (S.enz === "blocked") return { ok:false, msg:N.blocked };
      var m = oxModel(S, S.t);
      if (S.t === 60 && m.running) return { ok:true };
      return { ok:false, msg:N.time };
    }
    if (id === "tc2") {
      if (S.mode !== "ox") return { ok:false, msg:N.mode };
      if (S.cell === "yeast" && S.o2 === "absent" && S.enz === "working") return { ok:true };
      if (S.cell === "muscle" && S.o2 === "absent" && S.enz === "working") return { ok:false, msg:N.muscle };
      if (S.o2 === "present") return { ok:false, msg:N.aerobic };
      if (S.cell === "yeast" && S.enz === "blocked") return { ok:false, msg:N.blocked };
      return { ok:false, msg:c.general };
    }
    if (id === "tc3") {
      if (S.mode !== "fuels" || S.fuel !== "fatty") return { ok:false, msg:N.fuel };
      if (S.len !== 14) return { ok:false, msg:N.len };
      var a = parseVal(S.a3[0]), b = parseVal(S.a3[1]);
      if (a == null || b == null) return { ok:false, msg:N.blank };
      if (a === 6 && b === 6) return { ok:true };
      if (a === 7 || b === 7) return { ok:false, msg:N.n7 };
      if (a === 21) return { ok:false, msg:N.n21 };
      return { ok:false, msg:c.general };
    }
    return { ok:false };
  }
  EXF = { show:function(v){ if (v) { stickTop(); paintAll(); } else if (playing) { stopPlay(); paintAll(); } } };
  function finishPred(p){
    busy = false; xf = null; xfAtp = null; cap = p.reveal; api.save(); paintAll(); MV.changed();
    var d = pend; pend = null; if (d) MV.wait(250, d);
  }
  return {
    predict:{
      start:function(p){
        stopPlay(); busy = true; xf = null; xfAtp = null;
        var s = p.start; S.mode = "ox"; S.cell = s.cell; S.o2 = s.o2; S.enz = s.enz; S.atpA = "theory"; S.t = s.t; Td = s.t;
        cap = ""; api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p4") {
          var from = oxModel(S, S.t).route; S.o2 = "present"; xf = { from:from, k:0 }; xfAtp = 2;
          paintAll();
          anim = MV.tween({ dur:1800, ease:lin, step:function(k){ xf.k = MV.ease(k); xfAtp = lerp(2, 36, MV.ease(seg(k, 0.3, 1))); Td = 10 + 2 * k; paintMap(); paintLed(); }, done:function(){ anim = null; Td = S.t; finishPred(p); } });
          return;
        }
        var from2 = S.t;
        anim = MV.tween({ dur:(p.to - from2) * 450, ease:lin, step:function(k){ tick(lerp(from2, p.to, k)); }, done:function(){ anim = null; S.t = p.to; Td = p.to; finishPred(p); } });
      }
    },
    challenge:chal
  };
}

// ---------- hero: storyboard (plan) — a muscle cell; the O₂ supply drains, the NAD⁺ gauge falls while glycolysis keeps turning,
// then pyruvate → lactate lights up, the teal loop spins and the gauge refills. Reduced motion: the final frame. ----------
function hero(f){
  var box = $("#fe-hero"); if (!box) return;
  var cap = f && f.cap, last = -1, HW = 400, HH = 280;
  var CAPS = ["With O₂, the electron transport chain recycles NADH back to NAD⁺.", "The O₂ supply runs out, and the chain stops.", "Glycolysis keeps using NAD⁺, so the NAD⁺ gauge falls.",
    "Pyruvate takes the electrons from NADH and becomes lactate: NAD⁺ comes back.", "Fermentation keeps glycolysis going."];
  box.innerHTML = '<svg viewBox="0 0 ' + HW + " " + HH + '" class="fe-hsvg" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  function scene(T){
    var o2 = T < 1 ? 1 : T < 3.5 ? 1 - (T - 1) / 2.5 : 0;
    var nad = T < 3.5 ? 1 : T < 6 ? 1 - 0.88 * (T - 3.5) / 2.5 : T < 6.5 ? 0.12 : T < 8.5 ? 0.12 + 0.88 * MV.ease((T - 6.5) / 2) : 1;
    var lac = seg(T, 6, 6.6), lp = seg(T, 6.2, 6.8), lane = frac(T * 0.55);
    var h = sv("rect", { x:6, y:6, width:HW - 12, height:HH - 12, rx:36, "class":"fe-cell" }) + txt(28, 34, "muscle cell", "fe-title");
    // O₂ supply bar
    h += txt(28, 62, "O₂ supply", "fe-sm") + sv("rect", { x:100, y:51, width:150, height:14, rx:4, "class":"fe-gt" }) + (o2 > 0.01 ? sv("rect", { x:100, y:51, width:f1(150 * o2), height:14, rx:4, "class":"fe-o2bar" }) : "");
    // mitochondrion (chain) with its loop while O₂ lasts
    h += op(0.3 + 0.7 * o2, sv("ellipse", { cx:222, cy:108, rx:62, ry:30, "class":"fe-mo" }) + txt(222, 104, "chain", "fe-st", "middle") + txt(222, 119, "(mitochondrion)", "fe-sm", "middle"));
    h += loopSVG(222, 154, 40, 9, o2, T);
    // glycolysis lane
    h += sv("path", { d:hexPath(70, 96, 16), "class":"fe-c" }) + txt(70, 100, "6C", "fe-ct", "middle");
    h += sv("path", { d:"M70 114 L70 130", "class":"fe-lane", "stroke-dashoffset":f1(-T * 18) });
    h += sv("rect", { x:26, y:132, width:88, height:46, rx:10, "class":"fe-gbox" }) + txt(70, 152, "Glycolysis", "fe-bt", "middle") + txt(70, 168, "NAD⁺ → NADH", "fe-nt", "middle");
    h += sv("path", { d:"M70 180 L70 198", "class":"fe-lane", "stroke-dashoffset":f1(-T * 18) });
    h += chex(70, lerp(112, 130, lane), 6, 1 - seg(lane, 0.8, 1)) + cpill(70, lerp(184, 198, lane), "3C", 0.9 * (1 - seg(lane, 0.85, 1)));
    h += cpill(70, 212, "3C") + txt(70, 238, "pyruvate", "fe-sm", "middle");
    // pyruvate → lactate
    h += op(0.25 + 0.75 * lac, arrow([[94, 212], [196, 212]], "fe-rt" + (lac > 0.5 ? " on" : "")));
    h += op(lac, txt(145, 202, "lactate dehydrogenase", "fe-enz", "middle") + cpill(222, 212, "3C") + txt(222, 238, "lactate", "fe-sm", "middle"));
    h += loopSVG(145, 254, 40, 9, lp, T);
    if (lac > 0.5) { var u = frac(T * 0.5), p = [lerp(94, 196, u), 212]; h += cpill(p[0], p[1], "3C", lac * seg(u, 0, 0.1) * (1 - seg(u, 0.9, 1))); }
    // NAD⁺ gauge
    var gy = 236, gh = 120;
    h += txt(345, 108, "NAD⁺", "fe-gl", "middle") + sv("rect", { x:332, y:gy - gh, width:26, height:gh, rx:5, "class":"fe-gt" });
    if (nad > 0.01) h += sv("rect", { x:332, y:f1(gy - gh * nad), width:26, height:f1(gh * nad), rx:5, "class":"fe-gf" });
    h += txt(345, 256, Math.round(nad * 100) + "%", "fe-gv", "middle");
    setCap(T < 1 ? 0 : T < 3.5 ? 1 : T < 6 ? 2 : T < 8.5 ? 3 : 4);
    return h;
  }
  function draw(T){ svg.innerHTML = scene(T); }
  if (MV.reduceMotion) { draw(11.3); return; }
  draw(0);
  MV.tween({ dur:11000, ease:lin, step:function(k){ draw(k * 11); }, done:function(){ draw(11.3); } });
}

// ---------- Part 3: Fermentation at work ----------
// @component S7 experimentBench (yeast flasks) — flasks sealed with balloons whose size follows the CO₂ volume (flaskSVG), used in
// station 4 and the task. balloonR(mL) is the shared size rule.
function balloonR(v){ return v > 0 ? 7 + 3.6 * Math.sqrt(v) : 5; }
function flaskSVG(x, by, v, k, lab, sub, o){
  o = o || {};
  var r = lerp(5, balloonR(v), k), h = "";
  h += sv("path", { d:"M" + (x - 9) + " " + (by - 74) + " L" + (x - 9) + " " + (by - 50) + " L" + (x - 30) + " " + by + " L" + (x + 30) + " " + by + " L" + (x + 9) + " " + (by - 50) + " L" + (x + 9) + " " + (by - 74), "class":"fe-flask" });
  h += sv("path", { d:"M" + (x - 22) + " " + (by - 20) + " L" + (x + 22) + " " + (by - 20) + " L" + (x + 30) + " " + by + " L" + (x - 30) + " " + by + " Z", "class":"fe-liq" });
  if (o.sugar !== false) for (var i = 0; i < 4; i++) h += sv("circle", { cx:x - 14 + i * 9, cy:by - 9 + (i % 2) * 3, r:2, "class":"fe-yst" });
  h += sv("rect", { x:x - 10, y:by - 80, width:20, height:8, rx:2, "class":"fe-neck" });
  h += sv("circle", { cx:x, cy:f1(by - 80 - r), r:f1(r), "class":"fe-bal" });
  if (o.target) h += sv("circle", { cx:x, cy:f1(by - 80 - balloonR(o.target)), r:f1(balloonR(o.target)), "class":"fe-tgt" });
  if (lab) h += txt(x, by + 18, lab, "fe-sm", "middle");
  if (sub) h += txt(x, by + 32, sub, "fe-sm", "middle");
  if (o.vol != null) h += txt(x, f1(by - 86 - 2 * r), o.vol, "fe-vol", "middle");
  return h;
}
// @component S7 dataStation — blood lactate after a sprint (MV.Plot, model curve, a breathing-hard band and a time scrubber; from SBI4U 12)
function lactate(t){ return t <= 0 ? 1 : t <= 4 ? 1 + 11 * (1 - Math.cos(Math.PI * t / 4)) / 2 : 1 + 11 * Math.exp(-(t - 4) / 14); }
function part3(host, api){
  var C = api.content, S = api.S, S1 = C.st1, S2 = C.st2, S3 = C.st3, S4 = C.st4, S5 = C.st5;
  var D = { bread:0, yog:0, fs:0, view:null, run:false, ctrl:false, vars:{}, varsOk:false, conc:null, t5:4, z5:0 };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k] && typeof D[k] === "object" ? {} : D[k]; });
  var rng = MV.bio.rng("fe-bread"), BUB = [], YST = [], PROT = [], CLU = [[90, 120], [140, 104], [176, 132], [116, 150], [160, 160]];
  for (var i = 0; i < 14; i++) BUB.push([rng.range(0.08, 0.92), rng.range(0.15, 0.85), rng.range(5, 11)]);
  for (i = 0; i < 7; i++) YST.push([rng.range(0.12, 0.88), rng.range(0.2, 0.8)]);
  var r2 = MV.bio.rng("fe-yog");
  for (i = 0; i < 30; i++) PROT.push([r2.range(70, 200), r2.range(92, 172), i % 5]);
  host.innerHTML = '<div class="fe-p3">' +
    // station 1
    '<section class="fe-sta" aria-labelledby="fe-s1h"><h3 id="fe-s1h">' + S1.title + '</h3><div class="fe-two"><div class="fe-fig"><svg id="fe-b-svg" viewBox="0 0 360 220" role="img" focusable="false"></svg></div>' +
      '<div><div class="q-actions" id="fe-b-btns"></div><p class="fe-scap" id="fe-b-cap" aria-live="polite"></p><p class="tiny muted">' + S1.note + "</p></div></div></section>" +
    // station 2
    '<section class="fe-sta part" aria-labelledby="fe-s2h"><h3 id="fe-s2h">' + S2.title + "</h3><p>" + S2.text + '</p><div class="fe-two"><div class="fe-fig"><svg id="fe-y-svg" viewBox="0 0 320 220" role="img" focusable="false"></svg></div>' +
      '<div><div class="q-actions" id="fe-y-btns"></div><p class="fe-scap" id="fe-y-cap" aria-live="polite"></p></div></div>' +
      '<details class="alg"><summary>' + S2.zoom + '</summary><p class="fe-rxn">' + MV.bio.tok("pyruvate", "--bio-carbon") + " + " + MV.bio.tok("NADH", "--bio-nadh") + ' <span aria-hidden="true">→</span><span class="vh">gives</span> ' + MV.bio.tok("lactate", "--bio-carbon") + " + " + '<span class="fe-nadp">NAD⁺</span></p><p>' + S2.zoomText + "</p></details></section>" +
    // station 3
    '<section class="fe-sta part" aria-labelledby="fe-s3h"><h3 id="fe-s3h">' + S3.title + '</h3><ol class="fe-chainl" id="fe-chain">' + S3.chain.map(function(c, j){ return '<li data-ci="' + j + '">' + c + "</li>"; }).join("") + '</ol><div class="q-actions" id="fe-c-btns"></div>' +
      '<div class="fe-two fe-bal2"><div class="fe-fig"><svg id="fe-bal-svg" viewBox="0 0 340 170" role="img" focusable="false"></svg></div><div><p><strong>' + S3.ask + '</strong></p><div id="fe-view"></div><div id="fe-view-fb" aria-live="polite"></div></div></div></section>' +
    // station 4
    '<section class="fe-sta part" aria-labelledby="fe-s4h"><h3 id="fe-s4h">' + S4.title + "</h3><p>" + S4.setup + '</p><div class="fe-fig fe-bench"><svg id="fe-bench" viewBox="0 0 520 200" role="img" focusable="false"></svg></div>' +
      '<div class="q-actions" id="fe-run-btns"></div><div id="fe-tbl"></div>' +
      '<details class="alg" open><summary>Check it with data</summary><div class="plot-wrap"><canvas class="plot wide" id="fe-s4c" role="img"></canvas></div><p class="tiny muted"><span class="bio-model">Model data</span> CO₂ collected in 20 min at each temperature.</p>' +
        '<h4>Name the variables</h4><p class="how">Tap a variable, then tap the box it belongs in. Tap a placed variable to take it back out. Then press Check my labels.</p><div id="fe-vars"></div>' +
        '<h4>' + S4.conclusion.prompt + '</h4><div id="fe-conc"></div></details>' +
      '<div id="fe-ctrl"></div></section>' +
    // station 5
    '<section class="fe-sta part" aria-labelledby="fe-s5h"><h3 id="fe-s5h">' + S5.title + "</h3><p>" + S5.text + '</p><details class="alg" open><summary>Check it with data</summary>' +
      '<div class="plot-wrap"><canvas class="plot wide" id="fe-s5c" role="img"></canvas></div><p class="tiny muted fe-s5leg"><span class="fe-key5" aria-hidden="true"></span> blood lactate · the sprint ends at 0 min · shaded: breathing hard (extra O₂ use) · <span class="bio-model">Model data</span></p>' +
      '<label class="slider fe-sl"><span class="slider-top"><span>Time after the sprint</span><output id="fe-t5-out" for="fe-t5"></output></span><input type="range" id="fe-t5" min="-10" max="60" step="1"></label><p class="fe-t5r" id="fe-t5r" aria-live="polite"></p></details>' +
      '<details class="alg"><summary>' + S5.zoom + '</summary><div class="fe-fig fe-zfig"><svg id="fe-z5" viewBox="0 0 440 150" role="img" focusable="false"></svg></div><div class="q-actions" id="fe-z5b"></div><p class="fe-scap" id="fe-z5c" aria-live="polite"></p></details>' +
      '<div class="refresh fe-m5"><h4>Lactate and sore muscles</h4><p>' + S5.card + "</p></div></section></div>";

  // ---- station 1: bread (stage 0 mix, 1 rise, 2 bake; k animates the change) ----
  var bAnim = null;
  function breadSVG(st, k){
    var rise = st === 0 ? 0 : st === 1 ? k : 1, bake = st === 2 ? k : 0, top = lerp(150, 70, rise), h = "";
    h += sv("path", { d:"M40 120 Q40 200 180 200 Q320 200 320 120", "class":"fe-bowl" });
    if (bake > 0) for (var j = 0; j < 5; j++) h += op(bake, sv("path", { d:"M" + (90 + j * 45) + " 32 q6 -8 0 -16 q-6 -8 0 -16", "class":"fe-heat" }));
    h += sv("path", { d:"M52 170 Q50 " + f1(top) + " 180 " + f1(top - 6) + " Q310 " + f1(top) + " 308 170 Q300 190 180 192 Q60 190 52 170 Z", "class":"fe-dough" + (bake > 0.5 ? " baked" : "") });
    BUB.forEach(function(b){ var x = lerp(70, 290, b[0]), y = lerp(top + 14, 182, b[1]), r = b[2] * rise; if (r > 0.6) h += sv("circle", { cx:f1(x), cy:f1(y), r:f1(r), "class":"fe-bub" }); });
    YST.forEach(function(y0){ var x = lerp(76, 284, y0[0]), y = lerp(top + 18, 180, y0[1]); h += sv("ellipse", { cx:f1(x), cy:f1(y), rx:5, ry:3.6, "class":"fe-yc" }); if (bake > 0.5) h += txt(x, y + 4, "✗", "fe-x", "middle"); });
    if (bake > 0) h += op(bake, txt(180, 56, "ethanol evaporates", "fe-sm", "middle") + txt(180, 214, "the yeast die", "fe-sm", "middle"));
    else if (rise > 0.3) h += op(seg(rise, 0.3, 0.7), txt(344, 30, "CO₂ bubbles", "fe-co2l", "end") + txt(344, 46, "trapped by gluten", "fe-sm", "end"));
    h += sv("ellipse", { cx:20, cy:212, rx:5, ry:3.6, "class":"fe-yc" }) + txt(30, 216, "yeast cell", "fe-sm") + sv("circle", { cx:112, cy:212, r:5, "class":"fe-bub" }) + txt(122, 216, "CO₂ bubble", "fe-sm");
    return h;
  }
  function paintBread(k){
    var st = S.bread, svg1 = $("#fe-b-svg", host);
    svg1.innerHTML = breadSVG(st, k == null ? 1 : k);
    svg1.setAttribute("aria-label", "Dough cross-section in a bowl. " + (st === 0 ? "Just mixed: flat dough with yeast cells and no bubbles." : st === 1 ? "Risen: CO₂ bubbles from the yeast are trapped in the dough, which has doubled in height." : "Baked: the bubbles are set, the ethanol has evaporated and the yeast cells are dead."));
    $("#fe-b-cap", host).textContent = S1.steps[st].cap;
    var bb = $("#fe-b-btns", host);
    MV.keepFocus(bb, function(){ bb.innerHTML = st < 2 ? '<button type="button" class="btn primary sm" data-bs="' + (st + 1) + '" data-k="febs"' + (bAnim ? " disabled" : "") + ">" + S1.steps[st + 1].t + "</button>" : '<button type="button" class="btn ghost sm" data-bs="0" data-k="febs">Start again</button>'; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-bs]"); if (!b || b.disabled) return;
    S.bread = +b.dataset.bs; api.save();
    if (S.bread === 0) { paintBread(); return; }
    bAnim = MV.tween({ dur:1800, step:function(k){ $("#fe-b-svg", host).innerHTML = breadSVG(S.bread, k); }, done:function(){ bAnim = null; paintBread(); } });
    paintBread(0);
  });
  paintBread();

  // ---- station 2: yogurt (k: 0 fresh milk → 1 set yogurt) ----
  var yAnim = null;
  function yogSVG(k){
    var h = sv("path", { d:"M60 60 L60 182 Q60 196 74 196 L196 196 Q210 196 210 182 L210 60", "class":"fe-jar" }) + sv("rect", { x:62, y:84, width:146, height:110, rx:8, "class":"fe-milk" });
    if (S.yog) for (var j = 0; j < 8; j++) { var bx = 76 + (j * 17) % 120, byy = 100 + (j * 29) % 80; h += op(seg(k, 0, 0.2), sv("rect", { x:bx, y:byy, width:11, height:4, rx:2, "class":"fe-rod" })); }
    PROT.forEach(function(p){ var c = CLU[p[2]], ox = (p[0] - 135) * 0.12, oy = (p[1] - 132) * 0.1; h += sv("circle", { cx:f1(lerp(p[0], c[0] + ox, k)), cy:f1(lerp(p[1], c[1] + oy, k)), r:3, "class":"fe-prot" }); });
    var ph = 6.5 - 2 * k, y = 196 - (ph - 4) / 3.5 * 140;
    h += sv("rect", { x:264, y:56, width:18, height:140, rx:4, "class":"fe-gt" }) + txt(273, 48, "pH", "fe-gl", "middle");
    [4, 5, 6, 7].forEach(function(v){ var yy = 196 - (v - 4) / 3.5 * 140; h += sv("path", { d:"M282 " + f1(yy) + " L288 " + f1(yy), "class":"fe-tick" }) + txt(292, yy + 4, String(v), "fe-sm"); });
    h += sv("path", { d:head(262, y, 1, 0, 8), "class":"fe-ph" }) + txt(252, y + 4, "≈ " + MV.num(Math.round(ph * 10) / 10), "fe-phv", "end");
    h += txt(135, 214, S.yog ? (k > 0.95 ? "set yogurt: proteins clumped" : "fermenting…") : "fresh milk", "fe-sm", "middle");
    return h;
  }
  function paintYog(k){
    var y = $("#fe-y-svg", host), kk = k == null ? (S.yog ? 1 : 0) : k;
    y.innerHTML = yogSVG(kk);
    y.setAttribute("aria-label", S.yog ? "A jar of milk with lactic acid bacteria. The pH meter reads about 4.5, and the milk proteins have clumped into a few groups." : "A jar of fresh milk. The pH meter reads about 6.5, and the milk proteins are spread out.");
    $("#fe-y-cap", host).textContent = S.yog ? "The bacteria ferment lactose into lactate. The pH fell from about 6.5 to about 4.5, and the proteins clumped: the milk thickened and soured." : "Fresh milk: pH about 6.5, proteins spread out.";
    var yb = $("#fe-y-btns", host);
    MV.keepFocus(yb, function(){ yb.innerHTML = S.yog ? '<button type="button" class="btn ghost sm" data-yg="0" data-k="feyg">Start again</button>' : '<button type="button" class="btn primary sm" data-yg="1" data-k="feyg"' + (yAnim ? " disabled" : "") + ">Add lactic acid bacteria and wait</button>"; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-yg]"); if (!b || b.disabled) return;
    S.yog = b.dataset.yg === "1"; api.save();
    if (!S.yog) { paintYog(); return; }
    yAnim = MV.tween({ dur:2600, ease:lin, step:function(k){ $("#fe-y-svg", host).innerHTML = yogSVG(k); }, done:function(){ yAnim = null; paintYog(); } });
    $("#fe-y-cap", host).textContent = "Fermenting…";
  });
  paintYog();

  // ---- station 3: fuel ethanol chain + balance card ----
  function paintChain(){
    $$("#fe-chain li", host).forEach(function(li){ var j = +li.dataset.ci; li.className = j < S.fs ? "on" : ""; if (j === S.fs - 1) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current"); });
    var cb = $("#fe-c-btns", host);
    MV.keepFocus(cb, function(){ cb.innerHTML = S.fs < S3.chain.length ? '<button type="button" class="btn primary sm" data-fs="1" data-k="fefs">' + (S.fs ? "Next step" : "Follow the corn") + "</button>" : '<button type="button" class="btn ghost sm" data-fs="0" data-k="fefs">Start again</button>'; });
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-fs]"); if (!b) return; S.fs = b.dataset.fs === "1" ? Math.min(S3.chain.length, S.fs + 1) : 0; api.save(); paintChain(); });
  paintChain();
  function balSVG(ang){
    var cx = 170, cy = 62, L = 112, a = ang * Math.PI / 180, lx = cx - L * Math.cos(a), ly = cy - L * Math.sin(a), rx = cx + L * Math.cos(a), ry = cy + L * Math.sin(a);
    var h = sv("path", { d:"M" + cx + " " + cy + " L" + (cx - 16) + " 150 L" + (cx + 16) + " 150 Z", "class":"fe-ful" }) + sv("path", { d:"M" + f1(lx) + " " + f1(ly) + " L" + f1(rx) + " " + f1(ry), "class":"fe-beam" });
    [[lx, ly, ["Renewable", "carbon"]], [rx, ry, ["Land, water and", "energy inputs"]]].forEach(function(p){
      h += sv("path", { d:"M" + f1(p[0]) + " " + f1(p[1]) + " L" + f1(p[0] - 32) + " " + f1(p[1] + 34) + " M" + f1(p[0]) + " " + f1(p[1]) + " L" + f1(p[0] + 32) + " " + f1(p[1] + 34), "class":"fe-str" });
      h += sv("path", { d:"M" + f1(p[0] - 40) + " " + f1(p[1] + 34) + " L" + f1(p[0] + 40) + " " + f1(p[1] + 34) + " Q" + f1(p[0]) + " " + f1(p[1] + 52) + " " + f1(p[0] - 40) + " " + f1(p[1] + 34) + " Z", "class":"fe-pan" });
      p[2].forEach(function(t, j){ h += txt(p[0], p[1] + 68 + j * 14, t, "fe-sm", "middle"); });
    });
    return h;
  }
  var ANG = { l:-10, e:0, r:10 }, curAng = S.view ? ANG[S.view] : 0, balAnim = null;
  function paintBal(){ var b = $("#fe-bal-svg", host); b.innerHTML = balSVG(curAng); b.setAttribute("aria-label", "A balance: renewable carbon on the left pan; land, water and energy inputs on the right pan. " + (S.view === "l" ? "The left pan is lower." : S.view === "r" ? "The right pan is lower." : "The beam is level.")); }
  radios($("#fe-view", host), { aria:"Your judgement", key:"v", cls:"chips", options:S3.views, value:S.view || "", onChange:function(v){
    S.view = v; api.save(); var from = curAng, to = ANG[v];
    if (balAnim) balAnim();
    balAnim = MV.tween({ dur:700, step:function(k){ curAng = lerp(from, to, k); paintBal(); }, done:function(){ balAnim = null; curAng = to; paintBal(); } });
    $("#fe-view-fb", host).innerHTML = '<p class="tiny">' + S3.after + "</p>";
  } });
  paintBal(); if (S.view) $("#fe-view-fb", host).innerHTML = '<p class="tiny">' + S3.after + "</p>";

  // ---- station 4: yeast bench, data table, graph, variables, conclusion, control flask ----
  var runAnim = null, runK = S.run ? 1 : 0;
  function benchSVG(k){
    var n = S.ctrl ? 6 : 5, gap = 520 / n, h = "";
    S4.temps.forEach(function(t, j){ var x = gap * (j + 0.5); h += flaskSVG(x, 160, S4.co2[j], k, t + " °C", null, { vol:k > 0.98 ? S4.co2[j] + " mL" : null }); });
    if (S.ctrl) h += flaskSVG(gap * 5.5, 160, 0, k, "no sugar,", "35 °C", { sugar:false, vol:k > 0.98 ? "0 mL" : null });
    return h;
  }
  function paintBench(k){
    var b = $("#fe-bench", host); b.innerHTML = benchSVG(k == null ? runK : k);
    b.setAttribute("aria-label", "Five flasks of yeast, sugar and water, sealed with balloons, at 15, 25, 35, 45 and 55 °C" + (S.ctrl ? ", plus a control flask with yeast and water but no sugar at 35 °C" : "") + ". " + (S.run ? "After 20 min the balloons hold " + S4.co2.join(", ") + " mL of CO₂" + (S.ctrl ? "; the control balloon is flat" : "") + "." : "The balloons are still flat."));
    var rb = $("#fe-run-btns", host);
    MV.keepFocus(rb, function(){ rb.innerHTML = (S.run ? '<button type="button" class="btn ghost sm" data-rn="0" data-k="fern">Reset the flasks</button>' : '<button type="button" class="btn primary sm" data-rn="1" data-k="fern"' + (runAnim ? " disabled" : "") + ">Run for 20 min</button>") +
      (S.ctrl ? "" : '<button type="button" class="btn ghost sm" data-ct="1" data-k="fect">Add a control flask</button>'); });
    $("#fe-tbl", host).innerHTML = MV.tableHTML({ head:["Temperature (°C)"].concat(S4.temps.map(String)), rows:[["CO₂ collected (mL)"].concat(S4.co2.map(function(v){ return S.run ? String(v) : "?"; }))], caption:"Yeast data (20 min)" });
    $("#fe-ctrl", host).innerHTML = S.ctrl ? '<div class="fb good" role="status"><p><strong>Control flask:</strong> ' + S4.control.label + ". " + S4.control.why + (S.run ? " Its balloon stays flat." : "") + "</p></div>" : "";
    plot4.render();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-rn],[data-ct]"); if (!b || b.disabled) return;
    if (b.dataset.ct) { S.ctrl = true; api.save(); paintBench(); return; }
    if (b.dataset.rn === "0") { S.run = false; runK = 0; api.save(); paintBench(); return; }
    S.run = true; api.save();
    runAnim = MV.tween({ dur:2000, step:function(k){ runK = k; $("#fe-bench", host).innerHTML = benchSVG(k); }, done:function(){ runAnim = null; runK = 1; paintBench(); } });
    paintBench(0);
  });
  var plot4 = new MV.Plot($("#fe-s4c", host), { xmin:5, xmax:62, ymin:-2, ymax:18 });
  plot4.render = function(){
    var c = MV.css("--bio-carbon"), pts = S4.temps.map(function(t, j){ return { x:t, y:S4.co2[j] }; });
    var sc = { view:{ xmin:5, xmax:62, ymin:-2, ymax:18 }, xTicks:{ step:10 }, yTicks:{ step:4 }, xLabel:"temperature (°C)", yLabel:"CO₂ (mL)",
      describe:S.run ? "Model data: CO₂ collected in 20 min against temperature. 4 mL at 15 °C, 10 at 25, 14 at 35, 6 at 45 and 0 at 55 °C. The volume rises to a peak near 35 °C, then falls." : "Graph of CO₂ against temperature. Run the flasks to plot the data." };
    if (S.run) { sc.curves = [{ pts:pts.map(function(p){ return [p.x, p.y]; }), color:c, width:2.4 }]; sc.points = pts.map(function(p){ return { x:p.x, y:p.y, r:5, color:c }; }); }
    else sc.labels = [{ x:33, y:8, text:"Run the flasks to see the data", color:MV.css("--ink-2"), align:"center", bg:true }];
    plot4.draw(sc);
  };
  // variables (tap a variable, then a role box)
  var vSel = null, vMsg = null;
  function paintVars(){
    var vh = $("#fe-vars", host), un = S4.vars.filter(function(v){ return !S.vars[v.id]; });
    var h = '<div class="fe-vtray" role="group" aria-label="Variables to place">' + (un.length ? un.map(function(v){ return '<button type="button" class="tile txt" data-vv="' + v.id + '" data-k="fevv' + v.id + '" aria-pressed="' + (vSel === v.id) + '"' + (S.varsOk ? " disabled" : "") + ">" + v.t + "</button>"; }).join("") : '<span class="tiny muted">Every variable is placed.</span>') + "</div>";
    h += '<div class="fe-roles">' + S4.roles.map(function(r){
      var inside = S4.vars.filter(function(v){ return S.vars[v.id] === r.id; });
      return '<div class="fe-role"><button type="button" class="bin' + (vSel ? " ready" : "") + '" data-vr="' + r.id + '" data-k="fevr' + r.id + '"' + (S.varsOk ? " disabled" : "") + '><span class="bin-head"><span><strong>' + r.t + "</strong><small>" + r.sub + "</small></span></span></button>" +
        '<div class="fe-rin">' + inside.map(function(v){ return '<button type="button" class="chip" data-vo="' + v.id + '" data-k="fevo' + v.id + '"' + (S.varsOk ? " disabled" : "") + ' aria-label="' + MV.esc(v.t + ", placed as " + r.t + ". Tap to take it out.") + '">' + v.t + "</button>"; }).join("") + "</div></div>";
    }).join("") + "</div>";
    if (!S.varsOk) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-vc="1" data-k="fevc">Check my labels</button></div>';
    if (S.varsOk) h += MV.fbHTML("good", S4.varsDone); else if (vMsg) h += MV.fbHTML(vMsg[0], vMsg[1]);
    MV.keepFocus(vh, function(){ vh.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-vv],[data-vr],[data-vo],[data-vc]"); if (!b || b.disabled) return;
    if (b.dataset.vv) { vSel = vSel === b.dataset.vv ? null : b.dataset.vv; vMsg = null; }
    else if (b.dataset.vo) { delete S.vars[b.dataset.vo]; vMsg = null; }
    else if (b.dataset.vr) { if (!vSel) vMsg = ["", "Tap a variable first, then tap the box it belongs in."]; else { S.vars[vSel] = b.dataset.vr; vSel = null; vMsg = null; } }
    else if (b.dataset.vc) {
      var wrong = S4.vars.filter(function(v){ return S.vars[v.id] && S.vars[v.id] !== MV.ans(v); }), con = S4.vars.filter(function(v){ return S.vars[v.id] === "con" && MV.ans(v) === "con"; }).length;
      var ind = S4.vars.filter(function(v){ return S.vars[v.id] === "ind"; }), dep = S4.vars.filter(function(v){ return S.vars[v.id] === "dep"; });
      if (wrong.length) {
        var w = wrong[0], a = MV.ans(w);
        vMsg = ["bad", "<strong>✗ Not quite.</strong> " + (a === "ind" ? "Temperature is what’s changed from flask to flask: the independent variable." : a === "dep" ? "The CO₂ volume is what’s measured: the dependent variable." : w.t + " was kept the same in every flask: it’s a controlled variable.") + " Try again."];
      } else if (ind.length !== 1 || dep.length !== 1) vMsg = ["bad", "<strong>✗ Not yet.</strong> Place one independent variable and one dependent variable."];
      else if (con < 2) vMsg = ["bad", "<strong>✗ Not yet.</strong> Find two controlled variables: things kept the same in every flask."];
      else { S.varsOk = true; vMsg = null; }
    }
    api.save(); paintVars(); if (b.dataset.vc) MV.focusFb($("#fe-vars", host));
  });
  paintVars();
  function paintConc(){
    var ch = $("#fe-conc", host), Q = S4.conclusion, ri = MV.right(Q.options);
    var h = '<div class="opts">' + Q.options.map(function(o, j){ var c = "opt"; if (S.conc === j) c += j === ri ? " right" : " wrong"; return '<button type="button" class="' + c + '" data-cc="' + j + '" data-k="fecc' + j + '"' + (S.conc === ri ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + j) + "</span><span>" + o.t + "</span></button>"; }).join("") + "</div>";
    if (S.conc != null) { var o = Q.options[S.conc], good = S.conc === ri; h += MV.fbHTML(good ? "good" : "bad", "<strong>" + (good ? "✓ That’s the best conclusion." : "✗ Not the best one. Try another.") + "</strong> " + o.why); }
    MV.keepFocus(ch, function(){ ch.innerHTML = h; });
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-cc]"); if (!b || b.disabled) return; S.conc = +b.dataset.cc; api.save(); paintConc(); MV.focusFb($("#fe-conc", host)); });
  paintConc();
  paintBench();

  // ---- station 5: after the sprint ----
  var plot5 = new MV.Plot($("#fe-s5c", host), { xmin:-10, xmax:62, ymin:-1, ymax:14 }), t5 = $("#fe-t5", host);
  plot5.render = function(){
    var c = MV.css("--bio-carbon"), ink2 = MV.css("--ink-2"), t = S.t5;
    plot5.draw({ view:{ xmin:-10, xmax:62, ymin:-1, ymax:14 }, xTicks:{ step:10, fmt:function(v){ return v + " min"; } }, yTicks:{ step:2 }, yLabel:"lactate (mmol/L)",
      bands:[{ x0:0, x1:8, color:MV.css("--hi-soft") }],
      segments:[{ x1:t, y1:-1, x2:t, y2:13.6, color:ink2, width:1.4 }],
      curves:[{ f:lactate, color:c, width:3 }], points:[{ x:t, y:lactate(t), r:5.5, color:c }],
      labels:[{ x:14, y:9, text:"falls back over the next hour", color:ink2, align:"left", bg:true }],
      describe:"Model data. Blood lactate against time: about 1 mmol/L at rest, rising to about 12 mmol/L a few minutes after a 400 m sprint, then falling back to about 1 mmol/L over the next hour. The sprint ends at 0 min. The shaded band, 0 to 8 minutes, marks breathing hard: extra O₂ use. Marker at " + t + " min: " + MV.num(lactate(t), 1) + " mmol/L." });
  };
  function t5Show(){
    var t = S.t5, L = lactate(t);
    t5.value = t; $("#fe-t5-out", host).textContent = t < 0 ? MV.MINUS + Math.abs(t) + " min (before)" : t + " min";
    t5.setAttribute("aria-valuetext", t + " minutes: lactate about " + MV.num(L, 1) + " mmol/L");
    $("#fe-t5r", host).innerHTML = (t < 0 ? "At rest, before the sprint" : "At " + t + " min after the sprint") + ": blood lactate ≈ <strong>" + MV.num(L, 1) + " mmol/L</strong> · extra O₂ use: <strong>" + (t < 0 ? "none" : t <= 8 ? "high" : "back to normal") + "</strong>";
    plot5.render();
  }
  t5.addEventListener("input", function(){ S.t5 = +t5.value; api.save(); t5Show(); });
  t5Show();
  // zoom: muscle → blood → liver (S2-style three-step trace)
  var zAnim = null;
  function z5SVG(st, k){
    var h = "", X = [70, 220, 370];
    ["Muscle", "Blood", "Liver"].forEach(function(n, j){ h += sv("rect", { x:X[j] - 58, y:28, width:116, height:78, rx:12, "class":"fe-zbox" + (j === st ? " on" : "") }) + txt(X[j], 46, n, "fe-st", "middle"); });
    h += arrow([[130, 67], [160, 67]], "fe-ar") + arrow([[280, 67], [310, 67]], "fe-ar");
    var x = st === 0 ? 70 : st === 1 ? lerp(70, 220, k) : lerp(220, 370, k);
    if (st === 0) h += op(1, cpill(48, 76, "3C") + txt(66, 80, "+", "fe-sm", "middle") + sv("rect", { x:72, y:68, width:44, height:16, rx:8, "class":"fe-nadhp" }) + txt(94, 80, "NADH", "fe-nadht", "middle") + txt(70, 100, "→ lactate + NAD⁺", "fe-sm", "middle"));
    else if (st === 1 || k < 0.5) h += cpill(x, 80, "3C") + txt(x, 100, "lactate", "fe-sm", "middle");
    if (st === 2 && k >= 0.5) h += op(seg(k, 0.5, 0.8), chex(370, 78, 14) + txt(370, 102, "pyruvate → glucose", "fe-sm", "middle"));
    if (st === 2) h += op(seg(k, 0.6, 1), sv("rect", { x:300, y:116, width:30, height:18, rx:9, "class":"fe-o2" }) + txt(315, 129, "O₂", "fe-o2t", "middle") + txt(336, 129, "→ ATP for the rebuild", "fe-sm"));
    return h;
  }
  function paintZ5(k){
    var z = $("#fe-z5", host); z.innerHTML = z5SVG(S.z5, k == null ? 1 : k);
    z.setAttribute("aria-label", ["Muscle: pyruvate plus NADH gives lactate plus NAD⁺.", "The lactate travels in the blood.", "In the liver, lactate becomes pyruvate and then glucose, using ATP made with the extra O₂."][S.z5]);
    $("#fe-z5c", host).textContent = S5.zoomSteps[S.z5];
    var zb = $("#fe-z5b", host);
    MV.keepFocus(zb, function(){ zb.innerHTML = '<button type="button" class="btn ghost sm" data-z5="-1" data-k="fez5b"' + (S.z5 === 0 || zAnim ? " disabled" : "") + '>Back</button><button type="button" class="btn primary sm" data-z5="1" data-k="fez5n"' + (S.z5 === 2 || zAnim ? " disabled" : "") + ">Next</button>"; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-z5]"); if (!b || b.disabled) return;
    var d = +b.dataset.z5; S.z5 = clamp(S.z5 + d, 0, 2); api.save();
    if (d > 0) { zAnim = MV.tween({ dur:1400, step:function(k){ $("#fe-z5", host).innerHTML = z5SVG(S.z5, k); }, done:function(){ zAnim = null; paintZ5(); } }); paintZ5(0); }
    else paintZ5();
  });
  paintZ5();
}

// ---------- Performance task: Rise to the occasion (S7 fermenter with a balloon; plan model) ----------
var BASE = { 10:6, 20:15, 30:30, 40:24, 50:0 };
var task = (function(){
  var api = null, T = null, shown = 0, bAnim = null;
  function read(){ var s = api ? api.S : {}; return { org:s.org || "yeast", o2:s.o2 || "present", sugar:s.sugar == null ? 10 : +s.sugar, temp:s.temp == null ? 20 : +s.temp }; }
  function co2(d){ return d.org === "yeast" ? d.sugar / 10 * BASE[d.temp] : 0; }
  function info(d){
    var v = co2(d), r;
    if (d.org === "lab") r = { route:"Lactate fermentation (no gas)", atp:"2" };
    else if (!d.sugar) r = { route:"None: no sugar to use", atp:"0" };
    else if (!BASE[d.temp]) r = { route:"None: the yeast enzymes are denatured", atp:"0" };
    else if (d.o2 === "present") r = { route:"Aerobic respiration", atp:"36" };
    else r = { route:"Alcohol fermentation", atp:"2" };
    r.co2 = v; return r;
  }
  function parse(k){ var p = String(k).split("-"); return { org:p[0], o2:p[1], sugar:+p[2], temp:+p[3] }; }
  function text(d){ return (d.org === "yeast" ? "yeast" : "lactic acid bacteria") + ", O₂ " + d.o2 + ", " + d.sugar + " g sugar, " + d.temp + " °C (" + co2(d) + " mL)"; }
  function paintPv(k){
    var el = $("#fe-tpv"); if (!el) return;
    var d = read(), r = info(d), v = lerp(shown, r.co2, k == null ? 1 : k);
    $("#fe-tsvg").innerHTML = flaskSVG(110, 196, v, 1, null, null, { target:30, sugar:d.sugar > 0 }) + txt(150, 92, "30 mL", "fe-sm") + txt(150, 106, "target", "fe-sm");
    $("#fe-tsvg").setAttribute("aria-label", "A sealed flask with a balloon holding " + r.co2 + " mL of CO₂. A dashed circle shows the 30 mL target size.");
    el.innerHTML = MV.readoutHTML([["Route", r.route], ["ATP per glucose", r.atp], ["CO₂ collected in 30 min", r.co2 + " mL"]]);
  }
  function update(){
    var target = co2(read());
    if (bAnim) bAnim();
    var from = shown;
    bAnim = MV.tween({ dur:700, step:function(k){ shown = lerp(from, target, k); paintPv(1); }, done:function(){ bAnim = null; shown = target; paintPv(); } });
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = a.S;
      if (!s.org) s.org = "yeast"; if (!s.o2) s.o2 = "present"; if (s.sugar == null) s.sugar = 10; if (s.temp == null) s.temp = 20;
      inp.innerHTML = '<div class="fe-tin"><div id="fe-tg-org"></div><div id="fe-tg-o2"></div><div id="fe-tg-sugar"></div><div id="fe-tg-temp"></div></div>';
      function upd(){ a.save(); update(); a.update(); }
      radios($("#fe-tg-org"), { label:T.inputs.org, key:"to", cls:"chips", options:[{ id:"yeast", t:"Yeast" }, { id:"lab", t:"Lactic acid bacteria" }], value:s.org, onChange:function(v){ s.org = v; upd(); } });
      radios($("#fe-tg-o2"), { label:T.inputs.o2, key:"tx", options:[{ id:"present", t:"Present" }, { id:"absent", t:"Absent" }], value:s.o2, onChange:function(v){ s.o2 = v; upd(); } });
      radios($("#fe-tg-sugar"), { label:T.inputs.sugar, key:"ts", options:[0, 10, 20].map(function(g){ return { id:g, t:g + " g" }; }), value:s.sugar, onChange:function(v){ s.sugar = +v; upd(); } });
      radios($("#fe-tg-temp"), { label:T.inputs.temp, key:"tt", options:[10, 20, 30, 40, 50].map(function(c){ return { id:c, t:c + " °C" }; }), value:s.temp, onChange:function(v){ s.temp = +v; upd(); } });
      pv.innerHTML = '<div class="fe-tpvw"><h4>Your fermenter</h4><div class="fe-fig"><svg id="fe-tsvg" viewBox="0 0 220 230" role="img" focusable="false"></svg></div><dl class="read" id="fe-tpv" aria-live="polite"></dl><p class="tiny muted"><span class="bio-model">Model</span> ' + T.modelNote + "</p></div>";
      shown = co2(read()); paintPv();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var v = co2(d); return [d.org === "yeast" && v > 0, d.o2 === "absent", v >= 30, d.temp <= 35]; },
    key:function(d){ return d.org + "-" + d.o2 + "-" + d.sugar + "-" + d.temp; },
    label:function(k){ return MV.esc(text(parse(k))); },
    text:function(k){ return text(parse(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
