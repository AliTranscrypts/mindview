// SBI4U 15 Krebs Cycle: hero (pyruvate oxidation, then one turn), Carbon wheel (S2 pathway stepper, cycle form + S3 energy
// ledger; modes Run the cycle, Block a step, NAD⁺ supply), Where did the glucose go? (¹⁴C tracker, totals table, isolated
// mitochondria data), Tag the cycle and Ledger puzzles (Practice), "Fuel the cycle" (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 08 / 04) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "kc-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!tot) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function arrowLine(pts, cls){
  var a = pts[pts.length - 2], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return sv("polyline", { points:pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":cls }) + sv("path", { d:head(b[0], b[1], (b[0] - a[0]) / L, (b[1] - a[1]) / L, 6), "class":cls + " kc-ah" });
}
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/,/g, "").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function plural(n, one, many){ return n + " " + (n === 1 ? one : many); }
function sum(a){ return a.reduce(function(s, x){ return s + x; }, 0); }

// ---------- @component radioGroup (copied from SBI4U 08 / 04 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || off) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}
// @component stepper (from SBI4U 08 / 10) — − / + buttons around a live value: stepper(host, {id, label, min, max, value, unit(v), onChange(v)}) -> {set(v), disable(b)}
function stepper(host, o){
  var v = o.value, off = false, nm = MV.plain(o.label);
  host.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="' + o.id + '-l">' + o.label + '</span><span class="kc-stp" role="group" aria-labelledby="' + o.id + '-l">' +
    '<button type="button" class="kc-stb" data-d="-1" data-k="' + o.id + 'm" aria-label="' + MV.esc("Decrease " + nm) + '">−</button><output id="' + o.id + '" aria-live="polite"></output>' +
    '<button type="button" class="kc-stb" data-d="1" data-k="' + o.id + 'p" aria-label="' + MV.esc("Increase " + nm) + '">+</button></span></span>';
  var out = $("#" + o.id, host);
  function paint(){ out.textContent = o.unit ? o.unit(v) : v; $$("[data-d]", host).forEach(function(b){ b.disabled = off || (+b.dataset.d < 0 ? v <= o.min : v >= o.max); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (!b || b.disabled) return; v = clamp(v + (+b.dataset.d), o.min, o.max); paint(); o.onChange(v); });
  paint();
  return { set:function(x){ v = x; paint(); }, disable:function(b){ off = b; paint(); } };
}

// ---------- tokens (course colour roles: carbon brown, NADH teal, FADH₂ cerulean, ATP orange; CO₂ = brown dot in a grey outline) ----------
var CAR = { nadh:["NADH", "--bio-nadh", 38, 1], nad:["NAD⁺", "--bio-nadh", 36, 0], fadh:["FADH₂", "--bio-fadh", 42, 1], fad:["FAD", "--bio-fadh", 30, 0], atp:["ATP", "--bio-atp", 30, 1], coa:["CoA", "--ink-2", 30, 0] };
function carTok(k, x, y, a){
  if (a != null && a <= 0.02) return "";
  var t = CAR[k], c = "--c:var(" + t[1] + ")", g = sv("rect", { x:x - t[2] / 2, y:y - 7.5, width:t[2], height:15, rx:7.5, "class":t[3] ? "kc-cs" : "kc-co", style:c }) + sv("text", { x:x, y:y + 3.4, "class":t[3] ? "kc-cst" : "kc-cot", "text-anchor":"middle", style:c }, t[0]);
  return a != null && a < 0.98 ? '<g opacity="' + f1(a * 100) / 100 + '">' + g + "</g>" : g;
}
function co2Tok(x, y, a, ring){
  if (a != null && a <= 0.02) return "";
  var g = sv("rect", { x:x - 19, y:y - 7.5, width:38, height:15, rx:7.5, "class":"kc-co2" }) + sv("circle", { cx:x - 10, cy:y, r:2.8, "class":"kc-c" }) + (ring ? sv("circle", { cx:x - 10, cy:y, r:5, "class":"kc-ring14" }) : "") + txt(x + 5, y + 3.3, "CO₂", "kc-tk", "middle");
  return a != null && a < 0.98 ? '<g opacity="' + f1(a * 100) / 100 + '">' + g + "</g>" : g;
}
// carbon dots in a small ring (n carbons), or a "nC" label when carbon atoms are hidden
function dotRing(x, y, n, show, rr){
  if (!show) return txt(x, y + 3.8, n + "C", "kc-cn", "middle");
  if (n === 1) return sv("circle", { cx:x, cy:y, r:2.8, "class":"kc-c" });
  rr = rr || (n >= 6 ? 7.5 : n >= 4 ? 6 : 4.5); var h = "";
  for (var i = 0; i < n; i++) { var a = -Math.PI / 2 + 2 * Math.PI * i / n; h += sv("circle", { cx:x + rr * Math.cos(a), cy:y + rr * Math.sin(a), r:2.6, "class":"kc-c" }); }
  return h;
}
function molTok(x, y, n, show, a){
  if (a != null && a <= 0.02) return "";
  var g = sv("circle", { cx:x, cy:y, r:14, "class":"kc-mol" }) + dotRing(x, y, n, show);
  return a != null && a < 0.98 ? '<g opacity="' + f1(a * 100) / 100 + '">' + g + "</g>" : g;
}
function pillTok(x, y, n, show, a){
  if (a != null && a <= 0.02) return "";
  var w = 10 + 8 * n, g = sv("rect", { x:x - w / 2, y:y - 7, width:w, height:14, rx:7, "class":"kc-pill" }), i;
  if (show) for (i = 0; i < n; i++) g += sv("circle", { cx:x + (i - (n - 1) / 2) * 7.5, cy:y, r:2.6, "class":"kc-c" });
  else g += txt(x, y + 3.4, n + "C", "kc-cn", "middle");
  return a != null && a < 0.98 ? '<g opacity="' + f1(a * 100) / 100 + '">' + g + "</g>" : g;
}

// ---------- @component S2 pathwayStepper — cycle form (adapted from SBI4U 08's Calvin wheel): the Krebs wheel in the matrix.
// Eight intermediates on a ring (node 0 citrate … node 7 oxaloacetate), an entry ramp (pyruvate box → step 0 → acetyl-CoA box →
// step 1), product badges outside each arc, optional enzyme names inside, a block gate, an empty-NAD⁺ tray and a ledger tray.
// Model (deterministic, whole molecules): the matrix holds 3 oxaloacetate; each Step runs exactly one reaction, choosing the
// furthest-along molecule that can move, then pyruvate oxidation, then acetyl-CoA joining oxaloacetate. ----------
var KW = { w:440, h:456, cx:214, cy:262, r:104 };
var CARB = [6, 6, 5, 4, 4, 4, 4, 4];
function nodeDeg(i){ return -67.5 + 45 * i; }
function ringXY(deg, rr){ var a = deg * Math.PI / 180; rr = rr == null ? KW.r : rr; return [KW.cx + rr * Math.cos(a), KW.cy + rr * Math.sin(a)]; }
function nodeXY(i){ return ringXY(nodeDeg(i)); }
function midDeg(k){ return -90 + 45 * (k - 1); }
var PYB = { x:8, y:8, w:140, h:72 }, ACB = { x:282, y:8, w:150, h:72 }, LEDT = [372, 431], S0 = [215, 46];
function pyrSlot(j){ j = clamp(j, 0, 7); return [PYB.x + 20 + 33 * (j % 4), PYB.y + 40 + 19 * Math.floor(j / 4)]; }
function acSlot(j){ j = clamp(j, 0, 7); return [ACB.x + 22 + 34 * (j % 4), ACB.y + 40 + 19 * Math.floor(j / 4)]; }
function nadSlot(j){ return [96 + 17 * clamp(j, 0, 9), 431]; }
var ENZ2 = { 0:["pyruvate dehydrogenase complex"], 1:["citrate", "synthase"], 2:["aconitase"], 3:["isocitrate", "dehydrogenase"], 4:["α-ketoglutarate", "dehydrogenase"], 5:["succinyl-CoA", "synthetase"], 6:["succinate", "dehydrogenase"], 7:["fumarase"], 8:["malate", "dehydrogenase"] };
var PROD = { 0:["co2", "nadh"], 3:["co2", "nadh"], 4:["co2", "nadh"], 5:["atp"], 6:["fadh"], 8:["nadh"] };
var NADSTEP = { 0:1, 3:1, 4:1, 8:1 };
var CNT = [[20, -2, "start"], [0, -19, "middle"], [0, 31, "middle"], [-8, -20, "end"], [8, -20, "start"], [0, 31, "middle"], [0, -19, "middle"], [-20, -2, "end"]];

function W0(nad){ return { pyr:0, aco:0, occ:[0, 0, 0, 0, 0, 0, 0, 3], nad:nad, addG:0, addP:0, addA:0, pox:0, turns:0, entries:0, po:{ co2:0, nadh:0 }, kr:{ co2:0, nadh:0, fadh:0, atp:0 }, turn:null, last:null, cur:null }; }
function cloneW(w){ return JSON.parse(JSON.stringify(w)); }
function gate(w, k, cx){ if (cx.mode === "block" && cx.block === String(k)) return "block"; if (cx.mode === "nad" && NADSTEP[k] && w.nad < 1) return "nad"; return null; }
function nextStep(w, cx){
  for (var i = 6; i >= 0; i--) if (w.occ[i] > 0 && !gate(w, i + 2, cx)) return { k:i + 2, from:i, to:i + 1 };
  if (w.pyr > 0 && !gate(w, 0, cx)) return { k:0 };
  if (w.aco > 0 && w.occ[7] > 0) return { k:1, from:7, to:0 };
  return null;
}
function stateOf(w, cx){
  if (nextStep(w, cx)) return { kind:"run" };
  for (var i = 6; i >= 0; i--) if (w.occ[i] > 0) return { kind:gate(w, i + 2, cx) === "block" ? "block" : "stall", k:i + 2, node:i };
  if (w.pyr > 0) return { kind:"stall", k:0 };
  return { kind:"idle" };
}
function applyStep(w, r, cx, STEPS){
  var st = STEPS[r.k];
  if (r.k === 0) { w.pyr--; w.aco++; w.pox++; w.po.co2++; w.po.nadh++; if (cx.mode === "nad") w.nad--; w.cur = null; }
  else if (r.k === 1) { w.aco--; w.occ[7]--; w.occ[0]++; w.entries++; w.turn = { n:w.entries, co2:0, nadh:0, fadh:0, atp:0 }; w.cur = 0; }
  else {
    w.occ[r.from]--; w.occ[r.to]++;
    ["co2", "nadh", "fadh", "atp"].forEach(function(p){ if (st[p]) { w.kr[p] += st[p]; if (w.turn) w.turn[p] += st[p]; } });
    if (st.nadh && cx.mode === "nad") w.nad--;
    if (r.k === 8) w.turns++;
    w.cur = r.to === 7 ? null : r.to;
  }
  w.last = r.k;
}
function totals(w){ return { co2:w.po.co2 + w.kr.co2, nadh:w.po.nadh + w.kr.nadh, fadh:w.kr.fadh, atp:w.kr.atp, gN:2 * w.addG, gA:2 * w.addG }; }
function idleEmpty(w){ return w.pyr === 0 && w.aco === 0 && w.occ[7] === 3; }
function carbonsIn(w){ return 6 * w.addG + 3 * w.addP + 2 * w.addA; }
function carbonsMid(w){ var c = 3 * w.pyr + 2 * w.aco; for (var i = 0; i < 8; i++) c += w.occ[i] * CARB[i]; return c - 12; }

// static + dynamic scene. v: {disp, F, k, hi, showC, showE, mode, block, ctr}
function wheelSVG(o){ return '<svg viewBox="0 0 ' + KW.w + " " + KW.h + '" class="kc-svg"' + (o && o.aria ? ' role="img" aria-label="' + MV.esc(o.aria) + '"' : ' aria-hidden="true"') + ' focusable="false"><g class="kc-dyn"></g></svg>'; }
function arcPath(d0, d1){ var p0 = ringXY(d0), p1 = ringXY(d1); return "M" + f1(p0[0]) + " " + f1(p0[1]) + " A" + KW.r + " " + KW.r + " 0 0 1 " + f1(p1[0]) + " " + f1(p1[1]); }
function scene(v){
  var w = v.disp, h = "", i, k, W = KW;
  // matrix and inner membrane
  h += sv("rect", { x:1, y:1, width:W.w - 2, height:W.h - 2, rx:16, "class":"kc-mat" }) + sv("rect", { x:5, y:5, width:W.w - 10, height:W.h - 10, rx:13, "class":"kc-mem" });
  h += txt(14, 112, "mitochondrial matrix", "kc-sub");
  // fuel boxes
  h += sv("rect", { x:PYB.x + 4, y:PYB.y + 4, width:PYB.w - 4, height:PYB.h - 4, rx:8, "class":"kc-box" }) + txt(PYB.x + 12, PYB.y + 21, "Pyruvate waiting: " + w.pyr, "kc-bxt");
  h += sv("rect", { x:ACB.x, y:ACB.y + 4, width:ACB.w - 4, height:ACB.h - 4, rx:8, "class":"kc-box" }) + txt(ACB.x + 8, ACB.y + 21, "Acetyl-CoA waiting: " + w.aco, "kc-bxt");
  for (i = 0; i < Math.min(8, w.pyr); i++) { var ps = pyrSlot(i); h += pillTok(ps[0], ps[1], 3, v.showC); }
  for (i = 0; i < Math.min(8, w.aco); i++) { var as = acSlot(i); h += pillTok(as[0], as[1], 2, v.showC); }
  // step 0 arrow (pyruvate oxidation) and step 1 entry arrow
  h += arrowLine([[PYB.x + PYB.w + 2, S0[1]], [ACB.x - 4, S0[1]]], "kc-arr" + (v.hi === 0 ? " hi" : ""));
  h += txt(S0[0], S0[1] - 8, "0 · pyruvate oxidation", "kc-stn", "middle");
  h += carTok("nadh", S0[0] + 20, S0[1] + 17) + co2Tok(S0[0] - 22, S0[1] + 17);
  if (v.showE) h += txt(S0[0], 93, ENZ2[0][0], "kc-enz", "middle");
  h += arrowLine([[ACB.x + 48, ACB.y + 74], [W.cx + 8, W.cy - W.r - 8]], "kc-arr" + (v.hi === 1 ? " hi" : ""));
  // ring arcs with arrowheads
  for (k = 1; k <= 8; k++) {
    var d0 = nodeDeg(k === 1 ? 7 : k - 2) + 10.5, d1 = nodeDeg(k - 1) - 10.5 + (k === 1 ? 360 : 0);
    if (k === 1) { d0 -= 360; d1 -= 360; }
    var p1 = ringXY(d1), a1 = d1 * Math.PI / 180;
    h += sv("path", { d:arcPath(d0, d1), "class":"kc-ring" + (v.hi === k ? " hi" : "") }) + sv("path", { d:head(p1[0], p1[1], -Math.sin(a1), Math.cos(a1), 7), "class":"kc-ringh" + (v.hi === k ? " hi" : "") });
    var lab = ringXY(midDeg(k) - (k === 1 ? 7 : 0), W.r + 12);
    h += txt(lab[0], lab[1] + 3.5, String(k), "kc-stn", "middle");
  }
  // block gate: a bar across the blocked arrow
  if (v.mode === "block" && v.block !== "none") {
    var bd = midDeg(+v.block), g0 = ringXY(bd, W.r - 13), g1 = ringXY(bd, W.r + 13);
    h += sv("line", { x1:g0[0], y1:g0[1], x2:g1[0], y2:g1[1], "class":"kc-gate" });
  }
  // product badges just inside each arc (pairs stacked)
  [3, 4, 5, 6, 8].forEach(function(k2){
    var c = ringXY(midDeg(k2), W.r - 32), P = PROD[k2];
    if (P.length === 2) h += co2Tok(c[0], c[1] - 8.5) + carTok(P[1], c[0], c[1] + 8.5);
    else h += carTok(P[0], c[0], c[1]);
  });
  // enzyme names outside the ring (toggle)
  if (v.showE) for (k = 1; k <= 8; k++) {
    var en = ENZ2[k], ad = midDeg(k), ar = ad * Math.PI / 180, ep = ringXY(ad, W.r + 26), cs = Math.cos(ar), sn = Math.sin(ar);
    var anc = cs > 0.35 ? "start" : cs < -0.35 ? "end" : "middle", y0;
    if (k === 1) { ep = [W.cx, W.cy - W.r + 22]; anc = "middle"; sn = 0; }
    y0 = sn > 0.35 ? ep[1] + 8 : sn < -0.35 ? ep[1] - (en.length - 1) * 11 : ep[1] - (en.length - 1) * 5.5 + 3.5;
    en.forEach(function(line, li){ h += txt(ep[0], y0 + li * 11, line, "kc-enz", anc); });
  }
  // nodes: glow, molecule, count badge, label
  if (v.glow != null) { var gp = nodeXY(v.glow); h += sv("circle", { cx:gp[0], cy:gp[1], r:20, "class":"kc-glow" }); }
  for (i = 0; i < 8; i++) {
    var np = nodeXY(i), n = w.occ[i];
    h += n > 0 ? molTok(np[0], np[1], CARB[i], v.showC) : sv("circle", { cx:np[0], cy:np[1], r:14, "class":"kc-empty" });
    if (n > 1) { var co = CNT[i]; h += txt(np[0] + co[0], np[1] + co[1], "×" + n, "kc-cnt", co[2]); }
    h += nodeLabel(i, v.names[i]);
  }
  // centre counter
  var ct = v.ctr || [];
  if (ct.length) h += txt(W.cx, W.cy - 16, ct[0], "kc-ctr", "middle") + txt(W.cx, W.cy + 12, ct[1], "kc-ctrb", "middle") + (ct[2] ? txt(W.cx, W.cy + 32, ct[2], "kc-ctr", "middle") : "");
  // trays
  if (v.mode === "nad") {
    h += txt(12, 435, "Empty NAD⁺: " + w.nad, "kc-bxt");
    for (i = 0; i < Math.min(10, w.nad); i++) { var q = nadSlot(i); h += sv("circle", { cx:q[0], cy:q[1], r:6.5, "class":"kc-nadt" }); }
    h += txt(272, 435, "FAD: always available", "kc-sub", "end");
  } else h += txt(12, 435, "Empty NAD⁺ and FAD: plenty", "kc-sub");
  h += sv("rect", { x:316, y:418, width:112, height:26, rx:8, "class":"kc-tray" }) + txt(LEDT[0], 435, "↓ to the ledger", "kc-sub", "middle");
  // flights
  (v.F || []).forEach(function(f){
    var u;
    if (v.k < f.t0) { if (!f.pre) return; u = 0; }
    else if (v.k > f.t1) { if (!f.stay) return; u = 1; }
    else u = (v.k - f.t0) / Math.max(1e-6, f.t1 - f.t0);
    var e = MV.ease(u), p = f.arc ? ringXY(lerp(f.arc[0], f.arc[1], e), f.rr) : polyAt(f.p, e), a = 1;
    if (f.fade === "out") a = u > 0.7 ? (1 - u) / 0.3 : 1;
    if (f.fade === "in") a = u < 0.25 ? u / 0.25 : 1;
    if (f.kind === "mol") h += molTok(p[0], p[1], f.c, v.showC, a);
    else if (f.kind === "pill") h += pillTok(p[0], p[1], f.c, v.showC, a);
    else if (f.kind === "co2") h += co2Tok(p[0], p[1], a);
    else h += carTok(f.kind, p[0], p[1], a);
  });
  return h;
}
function nodeLabel(i, name){
  var np = nodeXY(i), right = i <= 3, y = np[1], x = np[0] + (right ? 1 : -1) * 20, l1, l2, anc = right ? "start" : "end";
  if (i === 0 || i === 7) { x = np[0] + (right ? 6 : -6); l1 = y - 30; l2 = y - 18; }
  else if (i === 3 || i === 4) { x = np[0] + (right ? 6 : -6); l1 = y + 29; l2 = y + 41; }
  else { l1 = y - 2; l2 = y + 11; }
  return txt(x, l1, name, "kc-nl", anc) + txt(x, l2, CARB[i] + "C", "kc-sub", anc);
}
// flights for one step from the state before it; returns {F, disp}
function flightsFor(b, r, cx){
  var F = [], d = cloneW(b), k = r.k, md, m, src, tray = cx.mode === "nad";
  function carrier(kind, empty, from, to, t0, fadeIn){ F.push({ kind:empty, p:[from, to], t0:t0, t1:t0 + 0.4, pre:!fadeIn, fade:fadeIn ? "in" : null }); F.push({ kind:kind, p:[to, [LEDT[0] + (F.length % 3 - 1) * 14, LEDT[1]]], t0:t0 + 0.47, t1:1, fade:"out" }); }
  if (k === 0) {
    d.pyr--;
    F.push({ kind:"pill", c:3, p:[pyrSlot(b.pyr - 1), S0], t0:0, t1:0.42, pre:true });
    F.push({ kind:"pill", c:2, p:[S0, acSlot(b.aco)], t0:0.5, t1:1, stay:true });
    F.push({ kind:"co2", p:[S0, [S0[0] - 8, -12]], t0:0.44, t1:1, fade:"out" });
    src = tray ? nadSlot(b.nad - 1) : [S0[0] + 20, S0[1] + 40];
    carrier("nadh", "nad", src, [S0[0] + 4, S0[1]], 0.02, !tray);
  } else if (k === 1) {
    d.aco--; d.occ[7]--;
    F.push({ kind:"mol", c:4, arc:[nodeDeg(7) - 360, -90], t0:0, t1:0.45, pre:true });
    F.push({ kind:"pill", c:2, p:[acSlot(b.aco - 1), [KW.cx + 8, KW.cy - KW.r - 30], ringXY(-90)], t0:0, t1:0.45, pre:true });
    F.push({ kind:"mol", c:6, arc:[-90, nodeDeg(0)], t0:0.5, t1:1, stay:true });
    F.push({ kind:"coa", p:[ringXY(-90), [KW.cx - 30, KW.cy - KW.r - 34]], t0:0.5, t1:0.95, fade:"out" });
  } else {
    d.occ[r.from]--; md = midDeg(k);
    F.push({ kind:"mol", c:CARB[r.from], arc:[nodeDeg(r.from), md], t0:0, t1:0.48, pre:true });
    F.push({ kind:"mol", c:CARB[r.to], arc:[md, nodeDeg(r.to) + (r.to === 0 ? 360 : 0)], t0:0.5, t1:1, stay:true });
    m = ringXY(md);
    (PROD[k] || []).forEach(function(p){
      if (p === "co2") F.push({ kind:"co2", p:[m, ringXY(md, KW.r + 86)], t0:0.44, t1:1, fade:"out" });
      else if (p === "nadh") { src = tray ? nadSlot(b.nad - 1) : ringXY(md, KW.r + 46); carrier("nadh", "nad", src, m, 0.04, !tray); }
      else if (p === "fadh") carrier("fadh", "fad", ringXY(md, KW.r + 46), m, 0.04, true);
      else if (p === "atp") F.push({ kind:"atp", p:[m, ringXY(md, KW.r + 30), [LEDT[0], LEDT[1]]], t0:0.46, t1:1, fade:"out" });
    });
  }
  return { F:F, disp:d };
}

// ---------- @component S3 energyLedger (from SBI4U 08 / 13): tallies + per-stage table, glycolysis column greyed ----------
function tally(n, col, cap){
  cap = cap || 24; var h = "";
  for (var i = 0; i < Math.min(n, cap); i++) h += "<i></i>";
  return '<span class="kc-tal" style="--c:var(' + col + ')" aria-hidden="true">' + h + (n > cap ? "<b>+" + (n - cap) + "</b>" : "") + "</span>";
}

// ---------- Explore: Carbon wheel ----------
var EXF = null;
function explore(host, api){
  var S = api.S, X = api.content, STEPS = X.steps, NAMES = X.mols.map(function(m){ return m.t; });
  CARB = X.mols.map(function(m){ return m.c; });
  if (!S.mode) S.mode = "run";
  if (!S.block) S.block = "none";
  if (S.nadSet == null) S.nadSet = 10;
  if (S.showC == null) S.showC = true;
  if (S.showE == null) S.showE = false;
  if (!S.led) S.led = "total";
  if (!S.w) S.w = W0(S.nadSet);
  var hist = [], busy = false, playing = false, anim = null, pend = null, seq = null, disp = null, fl = null, fk = 0, hi = null, msg = "", bad = false, readSig = "", ledSig = "", barSig = "", svg = null;
  var wide = !window.matchMedia || window.matchMedia("(min-width: 700px)").matches;
  function cx(){ return { mode:S.mode, block:S.block }; }
  host.innerHTML = '<div class="pg kc-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="kc-stage" id="kc-stage"></div><p class="kc-cap" id="kc-cap"></p>' +
      '<div class="kc-conc" id="kc-conc" hidden></div><p class="vh" id="kc-live" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div class="kc-row" id="kc-mode"></div>' +
      '<div class="kc-fuel" role="group" aria-label="Add fuel"><button type="button" class="btn ghost sm" data-fuel="g" data-k="fg">+ 1 glucose</button><button type="button" class="btn ghost sm" data-fuel="p" data-k="fp">+ 1 pyruvate</button>' +
        '<span class="kc-fa"><button type="button" class="btn ghost sm" data-fuel="a" data-k="fa">+ 1 acetyl-CoA</button><span class="tiny muted">' + X.acetylNote + "</span></span></div>" +
      '<div class="player kc-player" id="kc-player" role="group" aria-label="Step through the wheel (← and → keys work here)"><button type="button" class="btn ghost sm" id="kc-back" data-k="kcback">Back</button><button type="button" class="btn primary sm" id="kc-step" data-k="kcstep">Step</button>' +
        (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" id="kc-play" data-k="kcplay">Play</button>') + '<button type="button" class="btn ghost sm" id="kc-reset" data-k="kcreset">Reset</button></div>' +
      '<p class="kc-stat" id="kc-stat" role="status"></p>' +
      '<div class="kc-panel" id="kc-bp"><label class="kc-sel"><span class="rg-lab">Block</span> <select id="kc-block">' + X.blocks.map(function(b){ return '<option value="' + b.id + '">' + b.t + "</option>"; }).join("") + "</select></label></div>" +
      '<div class="kc-panel" id="kc-np"></div>' +
      '<div class="kc-tog"><label class="kc-chk"><input type="checkbox" id="kc-showc"> <span>Show carbon atoms</span></label><label class="kc-chk"><input type="checkbox" id="kc-showe"> <span>Show enzyme names</span></label></div>' +
      '<div class="kc-row" id="kc-ledm"></div><p class="tiny muted kc-note"><span class="bio-model">Model</span> ' + X.oaaNote + "</p></div>" +
    '<div class="pg-read"><dl class="read" id="kc-read"></dl><details class="kc-led" id="kc-led"' + (wide ? " open" : "") + '><summary><span id="kc-ls"></span> <span class="kc-lsd">Show details</span></summary><div id="kc-ledb"></div></details></div></div>';
  var stage = $("#kc-stage", host);
  stage.innerHTML = wheelSVG({ aria:"Krebs cycle wheel" });
  svg = $("svg", stage);
  var modeR = radios($("#kc-mode", host), { label:"Mode", options:[{ id:"run", t:"Run the cycle" }, { id:"block", t:"Block a step" }, { id:"nad", t:"NAD⁺ supply" }], value:S.mode,
    onChange:function(m){ stop(); S.mode = m; msg = ""; bad = false; changed(); announce(); } });
  var nadS = stepper($("#kc-np", host), { id:"kc-nad", label:"Empty NAD⁺ available", min:0, max:10, value:S.w.nad, onChange:function(v){ stop(); S.w.nad = v; S.nadSet = v; msg = ""; changed(); announce(); } });
  var ledR = radios($("#kc-ledm", host), { label:"Ledger", cls:"chips", options:[{ id:"turn", t:"per turn" }, { id:"total", t:"running total" }], value:S.led, onChange:function(v){ S.led = v; api.save(); paintLedger(); } });
  var blk = $("#kc-block", host), chC = $("#kc-showc", host), chE = $("#kc-showe", host);
  blk.value = S.block; chC.checked = !!S.showC; chE.checked = !!S.showE;
  blk.addEventListener("change", function(){ stop(); S.block = blk.value; msg = ""; changed(); announce(); });
  chC.addEventListener("change", function(){ S.showC = chC.checked; api.save(); frame(); });
  chE.addEventListener("change", function(){ S.showE = chE.checked; api.save(); frame(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-fuel]"); if (b && !b.disabled) { addFuel(b.dataset.fuel); return; }
  });
  $("#kc-step", host).addEventListener("click", function(){ userStep(); });
  $("#kc-back", host).addEventListener("click", function(){ back(); });
  $("#kc-reset", host).addEventListener("click", function(){ stop(); reset(); msg = "Reset: the wheel is empty and holds 3 oxaloacetate."; bad = false; changed(); announce(); });
  var playB = $("#kc-play", host);
  if (playB) playB.addEventListener("click", function(){ if (playing) { stopPlay(); return; } startPlay(); });
  $("#kc-player", host).addEventListener("keydown", function(e){
    if (e.key === "ArrowRight") { e.preventDefault(); userStep(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); back(); }
  });

  function reset(){ S.w = W0(S.nadSet); hist = []; hi = null; }
  function push(){ hist.push(cloneW(S.w)); if (hist.length > 300) hist.shift(); }
  function addFuel(kind){
    stop();
    var w = S.w, n = kind === "g" ? 2 : 1;
    if (w.pyr + w.aco + n > 8) { msg = "The matrix holds up to 8 fuel molecules at once. Step to use some first."; bad = true; paintStat(); say(msg); return; }
    push();
    if (kind === "g") { w.pyr += 2; w.addG++; msg = "Added 1 glucose: glycolysis (already done, in the cytosol) made 2 pyruvate, 2 ATP and 2 NADH."; }
    else if (kind === "p") { w.pyr++; w.addP++; msg = "Added 1 pyruvate."; }
    else { w.aco++; w.addA++; msg = "Added 1 acetyl-CoA (from fats)."; }
    bad = false; changed(); announce();
  }
  // a press during a single-step animation finishes it at once (the state is already committed), so focus never leaves Step/Back
  function finish(){ if (anim) { anim(); anim = null; } if (busy) { busy = false; disp = null; fl = null; } }
  function back(){
    if (seq || pend || playing) return;
    finish();
    if (!hist.length) { msg = "Nothing to undo."; bad = false; paintStat(); return; }
    S.w = hist.pop(); hi = S.w.last; msg = "Went back one step."; bad = false; changed(); announce();
  }
  function stepText(k){ var s = STEPS[k]; return "Step " + k + ": " + (k === 1 ? "acetyl-CoA + oxaloacetate" : s.from) + " → " + s.to + " (" + s.enz.replace(/ \(.*\)$/, "") + ")"; }
  function stepSay(k){
    var s = STEPS[k], parts = [];
    if (k === 0) parts.push("Step 0: pyruvate, 3 carbons, becomes acetyl-CoA, 2 carbons.");
    else if (k === 1) parts.push("Step 1: acetyl-CoA, 2 carbons, joins oxaloacetate, 4 carbons, to make citrate, 6 carbons.");
    else parts.push("Step " + k + ": " + s.from + ", " + CARB[k - 2] + " carbons, becomes " + s.to + ", " + CARB[k - 1] + " carbons.");
    if (s.co2) parts.push("Released 1 CO₂.");
    var made = []; if (s.nadh) made.push("1 NADH"); if (s.fadh) made.push("1 FADH₂"); if (s.atp) made.push("1 ATP (via GTP)");
    if (made.length) parts.push("Made " + made.join(" and ") + ".");
    if (k === 8) parts.push("Turn complete: oxaloacetate is back.");
    return parts.join(" ");
  }
  function statusText(){
    var st = stateOf(S.w, cx());
    if (st.kind === "run") return "Running";
    if (st.kind === "idle") return "Waiting for acetyl-CoA";
    if (st.kind === "block") return "Blocked at step " + st.k + ": " + NAMES[st.node] + " building up";
    return "Stalled at step " + st.k + ": no NAD⁺ left";
  }
  function userStep(){
    if (seq || pend || playing) return;
    if (busy) { finish(); paintAll(); }
    var r = nextStep(S.w, cx());
    if (!r) { msg = "The wheel can’t move. Status: " + statusText() + "."; bad = true; paintStat(); say(msg); return; }
    animStep(800, null);
  }
  function animStep(dur, done){
    var r = nextStep(S.w, cx()); if (!r) { if (done) done(false); return; }
    push();
    var before = cloneW(S.w); applyStep(S.w, r, cx(), STEPS); api.save();
    var fx = flightsFor(before, r, cx()); disp = fx.disp; fl = fx.F; fk = 0; hi = r.k; busy = true; msg = stepSay(r.k); bad = false;
    sync(); paintStat();
    anim = MV.tween({ dur:dur, ease:lin, step:function(k){ fk = k; frame(); }, done:function(){ anim = null; busy = false; disp = null; fl = null; paintAll(); announce(true); MV.changed(); if (done) done(true); } });
  }
  function startPlay(){ finish(); if (!nextStep(S.w, cx())) { userStep(); return; } playing = true; sync(); loop(); }
  function loop(){ if (!playing) return; animStep(800, function(ok){ if (!playing) return; if (!ok || !nextStep(S.w, cx())) { stopPlay(); return; } MV.wait(400, function(){ if (playing && !busy) loop(); }); }); }
  function stopPlay(){ playing = false; sync(); }
  function runSeq(n, dur, done){
    seq = { n:n };
    (function next(){
      if (!seq) return;
      if (seq.n <= 0 || !nextStep(S.w, cx())) { seq = null; if (done) done(); return; }
      seq.n--; animStep(dur, function(){ if (!seq) return; MV.wait(160, next); });
    })();
  }
  function stop(){
    if (anim) { anim(); anim = null; }
    playing = false; seq = null;
    if (busy) { busy = false; disp = null; fl = null; }
    if (pend) { var d = pend; pend = null; d(); }
  }
  function changed(){ api.save(); paintAll(); MV.changed(); }

  // ---- painting ----
  function ctrLines(w){ return ["Turns done", String(w.turns), "CO₂ out: " + totals(w).co2]; }
  function frame(){
    if (!svg) return;
    var w = S.w, g = $(".kc-dyn", svg);
    g.innerHTML = scene({ disp:disp || w, F:fl, k:fk, hi:hi, glow:disp ? null : w.cur, showC:S.showC, showE:S.showE, mode:S.mode, block:S.block, names:NAMES, ctr:ctrLines(disp ? w : w) });
  }
  function describe(){
    var w = S.w, t = totals(w), inW = [];
    for (var i = 0; i < 8; i++) if (w.occ[i]) inW.push(w.occ[i] + " " + NAMES[i]);
    return "Pyruvate waiting " + w.pyr + ", acetyl-CoA waiting " + w.aco + ". In the wheel: " + inW.join(", ") + ". " + plural(w.pox, "pyruvate oxidation", "pyruvate oxidations") + " and " + plural(w.turns, "turn", "turns") + " done. " +
      t.co2 + " CO₂, " + t.nadh + " NADH, " + t.fadh + " FADH₂, " + t.atp + " ATP. Status: " + statusText() + ".";
  }
  function say(t){ var L = $("#kc-live", host); L.textContent = ""; setTimeout(function(){ L.textContent = t; }, 30); }
  var liveSig = "";
  function announce(afterStep){ if (svg) svg.setAttribute("aria-label", "Krebs cycle wheel. " + describe()); var st = statusText(), d = (msg ? msg + " " : "") + (afterStep && st !== "Running" ? "Status: " + st + "." : ""); if (d && d !== liveSig) { liveSig = d; say(d); } }
  function paintStat(){ var p = $("#kc-stat", host); p.className = "kc-stat" + (bad ? " bad" : ""); p.innerHTML = msg ? (bad ? "<strong>✗</strong> " : "") + msg : '<span class="muted">Add fuel, then press Step. Every carbon is a brown dot.</span>'; }
  function capText(){
    var w = S.w;
    if (S.mode === "block") return S.block === "none" ? "Block a step: choose an enzyme to block, add fuel, then step. The bars show each intermediate in the matrix." : "Blocked: " + byId(X.blocks, S.block).t + " (step " + S.block + "). The bars show each intermediate in the matrix.";
    if (S.mode === "nad") return "NAD⁺ supply: each NAD⁺ step uses up one empty NAD⁺ (" + w.nad + " left). FAD is always available.";
    return "Run the cycle: NAD⁺ and FAD are plentiful. Two turns per glucose.";
  }
  function carbonText(w){ return carbonsIn(w) + " carbons in = " + totals(w).co2 + " out as CO₂ + " + carbonsMid(w) + " in intermediates"; }
  function paintRead(){
    var w = S.w, t = totals(w), cur = w.last != null ? stepText(w.last) : (idleEmpty(w) ? "Waiting for acetyl-CoA" : "Ready: press Step");
    var rows = [["Current step", cur], ["Pyruvate oxidations done", w.pox], ["Turns completed", w.turns], ["CO₂ released (this module’s steps)", t.co2],
      ["NADH made", t.nadh + (t.gN ? ' <span class="kc-gl">(+ ' + t.gN + " from glycolysis)</span>" : "")], ["FADH₂ made", t.fadh], ["ATP made (via GTP)", t.atp],
      ["Carbon check", carbonText(w) + " ✓"], ["Status", statusText()]];
    var sig = JSON.stringify(rows); if (sig === readSig) return; readSig = sig;
    $("#kc-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintLedger(){
    var w = S.w, t = totals(w), body;
    $("#kc-ls", host).textContent = "Ledger: " + t.co2 + " CO₂ · " + t.nadh + " NADH · " + t.fadh + " FADH₂ · " + t.atp + " ATP";
    if (S.led === "turn") {
      var tu = w.turn, inWheel = w.occ.slice(0, 7).some(function(x){ return x > 0; });
      body = "<p class=\"kc-lh\">" + (tu ? "Turn " + tu.n + (inWheel ? " (in progress)" : " (complete)") : "No turn yet: add fuel and step.") + "</p>" +
        [["CO₂", "--bio-carbon", "co2", 2], ["NADH", "--bio-nadh", "nadh", 3], ["FADH₂", "--bio-fadh", "fadh", 1], ["ATP", "--bio-atp", "atp", 1]].map(function(q){
          var v = tu ? tu[q[2]] : 0; return '<div class="kc-tr"><span class="kc-tn">' + q[0] + "</span>" + tally(v, q[1]) + "<b>" + v + " of " + q[3] + "</b></div>"; }).join("") +
        '<p class="tiny muted">Pyruvate oxidation isn’t part of a turn: it adds 1 CO₂ and 1 NADH per pyruvate before the cycle (' + w.po.co2 + " CO₂ and " + w.po.nadh + " NADH so far).</p>";
    } else {
      var R = [["CO₂", "--bio-carbon", 0, w.po.co2, w.kr.co2, t.co2], ["NADH", "--bio-nadh", t.gN, w.po.nadh, w.kr.nadh, t.nadh], ["FADH₂", "--bio-fadh", 0, 0, w.kr.fadh, t.fadh], ["ATP", "--bio-atp", t.gA, 0, w.kr.atp, t.atp]];
      body = '<div class="tbl-wrap"><table class="kc-lt"><caption class="vh">Energy ledger by stage</caption><thead><tr><th scope="col"></th><th scope="col" class="kc-gl">From glycolysis</th><th scope="col">Pyruvate oxidation</th><th scope="col">Krebs cycle</th><th scope="col">Total (this module)</th></tr></thead><tbody>' +
        R.map(function(r){ return '<tr><th scope="row">' + r[0] + '</th><td class="kc-gl">' + r[2] + "</td><td>" + r[3] + "</td><td>" + r[4] + "</td><td><strong>" + r[5] + "</strong></td></tr>"; }).join("") + "</tbody></table></div>" +
        R.map(function(r){ return '<div class="kc-tr"><span class="kc-tn">' + r[0] + "</span>" + tally(r[5], r[1]) + "<b>" + r[5] + "</b></div>"; }).join("") +
        '<p class="tiny muted">One mark per molecule. The greyed column is glycolysis’s 2 ATP and 2 NADH per glucose, made earlier in the cytosol and not counted in this module’s totals.</p>';
    }
    var sig = S.led + body; if (sig === ledSig) return; ledSig = sig;
    $("#kc-ledb", host).innerHTML = body;
  }
  function paintConc(){
    var box = $("#kc-conc", host); box.hidden = S.mode !== "block";
    if (S.mode !== "block") return;
    var w = S.w, h = '<p class="kc-ch">Intermediates in the matrix <span class="bio-model">Model</span></p>' + NAMES.map(function(nm, i){
      var v = w.occ[i]; return '<div class="kc-br"><span class="kc-bl">' + nm + '</span><span class="kc-bt"><i style="width:' + f1(v / 3 * 100) + '%"></i></span><b class="kc-bv">' + v + "</b></div>"; }).join("");
    if (h !== barSig) { barSig = h; box.innerHTML = h; }
  }
  function sync(){
    modeR.set(S.mode); ledR.set(S.led); nadS.set(S.w.nad);
    $("#kc-bp", host).hidden = S.mode !== "block"; $("#kc-np", host).hidden = S.mode !== "nad";
    var lock = !!seq || !!pend;
    $(".kc-pg", host).dataset.busy = busy || lock ? "1" : "0";
    $$("[data-fuel]", host).forEach(function(b){ b.disabled = lock || playing; });
    $("#kc-step", host).disabled = lock || playing; $("#kc-back", host).disabled = lock || playing; $("#kc-reset", host).disabled = lock;
    if (playB) { playB.textContent = playing ? "Pause" : "Play"; playB.disabled = lock; playB.setAttribute("aria-pressed", playing); }
    modeR.disable(lock); nadS.disable(lock); blk.disabled = lock;
  }
  function paintAll(){ sync(); frame(); paintStat(); $("#kc-cap", host).textContent = capText(); paintRead(); paintLedger(); paintConc(); if (svg) svg.setAttribute("aria-label", "Krebs cycle wheel. " + describe()); }

  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var w = S.w, t = totals(w), st = stateOf(w, cx());
    if (id === "tc1") {
      if (w.addG === 1 && !w.addP && !w.addA && w.pox === 2 && w.turns === 2 && idleEmpty(w) && t.co2 === 6 && t.nadh === 8 && t.fadh === 2 && t.atp === 2) return { ok:true };
      if (w.addG !== 1 || w.addP || w.addA) return { ok:false, msg:"Start with exactly one glucose and no other fuel: press Reset, then “+ 1 glucose”." };
      if (w.pox === 0) return { ok:false, msg:"The pyruvates must be oxidized to acetyl-CoA first." };
      if (w.turns === 1) return { ok:false, msg:"One glucose gives 2 acetyl-CoA, so the cycle must turn twice." };
      if (st.kind === "block" || st.kind === "stall") return { ok:false, msg:"The wheel is stuck (" + statusText() + "). Switch to Run the cycle so both turns can finish." };
      return { ok:false, msg:"Keep stepping until the status reads “Waiting for acetyl-CoA” with 2 turns done." };
    }
    if (id === "tc2") {
      var p = w.addP, a = w.addA;
      if (w.addG) return { ok:false, msg:"Use only “+ 1 pyruvate” and “+ 1 acetyl-CoA”, with no glucose: press Reset and start again." };
      if (p === 2 && a === 1) {
        if (idleEmpty(w) && t.nadh === 11 && t.fadh === 3) return { ok:true };
        return { ok:false, msg:"That fuel will do it. Now run everything: step until the status reads “Waiting for acetyl-CoA”." };
      }
      if (p === 0 && a === 3) return { ok:false, msg:"Each pyruvate adds an extra NADH in pyruvate oxidation before the cycle." };
      if (p === 3 && a === 0) return { ok:false, msg:"One fuel too many of the NADH-rich kind." };
      if (p + a === 0) return { ok:false, msg:"Add some fuel first, with “+ 1 pyruvate” and “+ 1 acetyl-CoA”." };
      return { ok:false, msg:plural(p, "pyruvate", "pyruvate") + " and " + a + " acetyl-CoA give " + (4 * p + 3 * a) + " NADH and " + (p + a) + " FADH₂ once everything has run." };
    }
    if (id === "tc3") {
      var stuck = st.kind === "block" || st.kind === "stall";
      if (w.addA === 1 && !w.addG && !w.addP && t.nadh === 1 && t.co2 === 1 && t.fadh === 0 && t.atp === 0 && stuck) return { ok:true };
      if (w.addA !== 1 || w.addG || w.addP) return { ok:false, msg:"Feed in exactly 1 acetyl-CoA and no other fuel: press Reset, then “+ 1 acetyl-CoA”." };
      if (S.mode === "run") return { ok:false, msg:"Choose Block a step or NAD⁺ supply: in Run the cycle the wheel never stalls." };
      if (stuck) {
        if (t.nadh === 0) return { ok:false, msg:"That stops the wheel before any carbon leaves." };
        if (t.nadh >= 2) return { ok:false, msg:S.mode === "nad" ? "One NAD⁺ too many." : "Too late: two decarboxylations have already happened." };
      }
      if (S.mode === "block" && S.block === "none") return { ok:false, msg:"Choose an enzyme to block, then step." };
      if (st.kind === "idle") return { ok:false, msg:"The wheel finished the whole turn without stalling. Stop it earlier." };
      return { ok:false, msg:"Keep stepping until the wheel stalls." };
    }
    return { ok:false };
  }

  EXF = { show:function(v){ if (!v) { stop(); } else paintAll(); } };
  paintAll(); announce();
  return {
    predict:{
      start:function(p){
        stop(); msg = ""; bad = false; S.showC = true; chC.checked = true;
        if (p.id === "p1") { S.mode = "run"; reset(); S.w.pyr = 2; S.w.addG = 1; }
        else if (p.id === "p2") { S.mode = "run"; reset(); S.w.aco = 1; S.w.addA = 1; }
        else if (p.id === "p3") { S.mode = "nad"; S.nadSet = 0; reset(); S.w.aco = 1; S.w.addA = 1; }
        else { S.mode = "block"; S.block = "6"; blk.value = "6"; reset(); S.w.aco = 3; S.w.addA = 3; }
        changed();
      },
      run:function(p, done){
        pend = done; sync();
        function fin(){ var d = pend; pend = null; sync(); announce(true); if (d) d(); }
        if (p.id === "p1") runSeq(2, 1100, fin);
        else if (p.id === "p2") runSeq(8, 700, fin);
        else if (p.id === "p3") runSeq(9, 900, fin);
        else runSeq(30, 420, fin);
      }
    },
    challenge:chal
  };
}

// ---------- hero: pyruvate oxidation, then one turn (storyboard 1–5); reduced motion: final frame with all labels ----------
function hero(f){
  var box = $("#kc-hero"); if (!box) return;
  var cap = f && f.cap, C = [250, 142], R = 62;
  var CAPS = ["A pyruvate from glycolysis (3 carbons) drifts into the mitochondrion’s matrix.",
    "Pyruvate oxidation: one carbon breaks off as CO₂ and NAD⁺ fills to NADH. The other two carbons ride in on CoA.",
    "The 2-carbon acetyl group joins oxaloacetate (4 carbons) to make citrate (6 carbons).",
    "The wheel turns. Two carbons peel off as CO₂; three NADH and one FADH₂ fill, and one ATP pops out.",
    "Oxaloacetate (4 carbons) is back where it started. Turn 1 of 2 for one glucose."];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  function rp(deg, rr){ var a = (deg - 90) * Math.PI / 180; return [C[0] + rr * Math.cos(a), C[1] + rr * Math.sin(a)]; }
  // events around the ring (degrees clockwise from the top)
  var EV = [{ d:70, k:"co2", c:"nadh" }, { d:118, k:"co2", c:"nadh" }, { d:168, c:"atp" }, { d:205, c:"fadh" }, { d:292, c:"nadh" }];
  function cluster(x, y, n){ return dotRing(x, y, n, true, n >= 6 ? 9 : n >= 4 ? 7.5 : 5); }
  function base(){
    var h = sv("rect", { x:52, y:10, width:342, height:262, rx:70, "class":"kc-hout" }) + sv("rect", { x:64, y:22, width:318, height:238, rx:60, "class":"kc-hin" });
    h += txt(8, 18, "cytosol", "kc-sub") + txt(372, 252, "matrix", "kc-sub", "end");
    h += sv("circle", { cx:C[0], cy:C[1], r:R, "class":"kc-ring" });
    [40, 130, 220, 310].forEach(function(d){ var p = rp(d, R), a = (d) * Math.PI / 180; h += sv("path", { d:head(p[0], p[1], Math.cos(a), Math.sin(a), 7), "class":"kc-ringh" }); });
    return h;
  }
  function draw(t){
    // t in [0, 5]: phase index + progress
    var h = base(), ph = Math.floor(t), u = t - ph, e = MV.ease(clamp(u, 0, 1)), i;
    var PO = [118, 142];
    // phase 0: pyruvate drifts in
    if (ph === 0) { var p0 = [lerp(-10, PO[0], e), PO[1]]; h += pillTok(p0[0], p0[1], 3, true); h += carTok("nad", PO[0], 200, 0.4 + 0.6 * e); }
    // pyruvate oxidation products
    if (ph >= 1) {
      var cu = ph === 1 ? e : 1;
      if (ph === 1) h += co2Tok(lerp(PO[0] - 8, 92, cu), lerp(PO[1], 62, cu), cu > 0.85 ? (1 - cu) / 0.15 + 0.4 : 1);
      else h += co2Tok(92, 62, 0.45);
      h += ph === 1 && cu < 0.5 ? carTok("nad", PO[0], 200) : carTok("nadh", PO[0], 200);
      h += txt(PO[0], 226, "pyruvate oxidation", "kc-sub", "middle");
    }
    if (ph === 1) { h += pillTok(PO[0], PO[1], e < 0.4 ? 3 : 2, true); if (e > 0.4) h += txt(PO[0], PO[1] - 14, "acetyl-CoA", "kc-hl", "middle"); }
    // oxaloacetate waits at the top of the wheel
    var top = rp(0, R);
    if (ph <= 2) {
      if (ph === 2) {
        var ap = [lerp(PO[0], top[0] - 4, e), lerp(PO[1], top[1], e)];
        if (e < 0.92) { h += sv("circle", { cx:top[0], cy:top[1], r:16, "class":"kc-mol" }) + cluster(top[0], top[1], 4) + pillTok(ap[0], ap[1], 2, true); }
        else h += sv("circle", { cx:top[0], cy:top[1], r:16, "class":"kc-mol kc-hmol" }) + cluster(top[0], top[1], 6);
      } else h += sv("circle", { cx:top[0], cy:top[1], r:16, "class":"kc-mol" }) + cluster(top[0], top[1], 4);
      h += txt(top[0], top[1] - 24, ph === 2 && e >= 0.92 ? "citrate (6C)" : "oxaloacetate (4C)", "kc-hl", "middle");
    }
    // phase 3: the wheel turns
    var deg = ph === 3 ? 360 * e : ph >= 4 ? 360 : 0, nC = 6;
    EV.forEach(function(ev){
      if (ph < 3 || deg < ev.d) return;
      var since = (deg - ev.d) / 50, op = rp(ev.d, R + 32);
      if (ev.k === "co2") { nC--; var k2 = ph >= 4 ? 1 : clamp(since, 0, 1), cp = [lerp(rp(ev.d, R)[0], rp(ev.d, R + 66)[0], k2), lerp(rp(ev.d, R)[1], rp(ev.d, R + 66)[1], k2)]; h += co2Tok(cp[0], cp[1], ph >= 4 ? 0.55 : 1); op = rp(ev.d - 14, R + 30); }
      h += carTok(ev.c, op[0], op[1]);
    });
    if (ph >= 3) {
      var mp = rp(deg, R);
      h += sv("circle", { cx:mp[0], cy:mp[1], r:16, "class":"kc-mol kc-hmol" }) + cluster(mp[0], mp[1], ph >= 4 ? 4 : nC);
      if (ph >= 4) h += txt(mp[0], mp[1] - 24, "oxaloacetate (4C)", "kc-hl", "middle");
    }
    if (ph >= 4) h += txt(C[0], C[1] - 4, "Turn 1 of 2", "kc-ctrb2", "middle") + txt(C[0], C[1] + 14, "for one glucose", "kc-ctr", "middle");
    box.innerHTML = '<svg viewBox="0 0 400 282" class="kc-svg" aria-hidden="true" focusable="false">' + h + "</svg>";
  }
  if (MV.reduceMotion) { draw(4.999); setCap(4); return; }
  var DUR = [1500, 2100, 1700, 5200], ph = 0;
  draw(0); setCap(0);
  function run(){
    if (ph > 3) { draw(4.999); setCap(4); return; }
    setCap(ph);
    var p = ph;
    MV.tween({ dur:DUR[p], ease:lin, step:function(k){ draw(p + Math.min(k, 0.999)); }, done:function(){ ph++; setTimeout(run, ph > 3 ? 200 : 500); } });
  }
  setTimeout(run, 900);
}

// ---------- Part 3: Where did the glucose go? ----------
// Station 1: @component tracer14C — six ¹⁴C-ringed carbon dots moved stage by stage, with a two-part bar;
// Station 2: @component tableFill — tap-chip / tap-cell (or pointer-drag) number chips into a totals table, each cell checked on drop;
// Station 3: S7 data table ("Check it with data") with chip prompts.
var P3F = null;
function part3(host, api){
  var P = api.content, S = api.S, s1 = P.s1, s2 = P.s2, s3 = P.s3;
  S.s1 = S.s1 || { stage:"start", ask:false, val:"", tries:0, solved:false };
  S.s2 = S.s2 || { cells:{}, tries:{} };
  S.s3 = S.s3 || {};
  var sel = null, s2msg = null, s1msg = null, s1anim = null, from = null, prog = 1;
  var ORDER = s1.stages.map(function(s){ return s.id; });
  host.innerHTML =
    '<section class="kc-sta" aria-labelledby="kc-s1h"><h3 id="kc-s1h">' + s1.title + "</h3><p>" + s1.text + "</p>" +
      '<div class="kc-s1btns" id="kc-s1b" role="group" aria-label="Move the markers forward"></div>' +
      '<div class="kc-trk" id="kc-trk"></div><p class="kc-s1cap" id="kc-s1cap" aria-live="polite"></p><div class="kc-s1bar" id="kc-s1bar"></div>' +
      '<details class="alg"><summary>' + s1.zoomTitle + "</summary><p>" + s1.zoom + "</p></details>" +
      '<div class="kc-ask" id="kc-ask"></div></section>' +
    '<section class="part kc-sta" aria-labelledby="kc-s2h"><h3 id="kc-s2h">' + s2.title + "</h3><p>" + s2.text + "</p>" +
      '<div class="kc-nchips" id="kc-nchips" role="group" aria-label="Number chips"></div><div id="kc-s2fb" aria-live="polite"></div>' +
      '<div class="tbl-wrap"><table class="kc-tt" id="kc-tt"><caption class="vh">Totals per glucose</caption><thead><tr><th scope="col">Stage</th><th scope="col">Where</th>' + s2.cols.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody></tbody></table></div></section>" +
    '<section class="part kc-sta" aria-labelledby="kc-s3h"><h3 id="kc-s3h">' + s3.title + "</h3><p>" + s3.text + "</p>" +
      '<details class="alg" open><summary>' + s3.dataTitle + '</summary><div class="tbl-wrap"><table class="kc-dt"><caption class="vh">Isolated mitochondria results</caption><thead><tr>' + s3.head.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + "</tr></thead><tbody>" +
        s3.rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th>" + r.slice(1).map(function(c){ return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + '</tbody></table></div><p class="tiny muted">' + s3.caption + ' <span class="bio-model">Model data</span></p>' +
      s3.prompts.map(function(p){ return '<div class="kc-pr" data-pr="' + p.id + '"></div>'; }).join("") + "</details></section>";

  // ---- Station 1: ¹⁴C tracker ----
  var CO2SLOT = { 0:0, 3:1, 1:2, 4:3, 2:4, 5:5 };
  function co2Pos(d){ var s = CO2SLOT[d]; return [330 + 62 * (s % 2), 62 + 36 * Math.floor(s / 2)]; }
  function inCO2(stage, d){ var i = ORDER.indexOf(stage); if (i >= ORDER.indexOf("po") && (d === 0 || d === 3)) return true; if (i >= ORDER.indexOf("t2") && (d === 1 || d === 4)) return true; if (i >= ORDER.indexOf("more")) return true; return false; }
  function dotPos(stage, d){
    if (inCO2(stage, d)) { var c = co2Pos(d); return [c[0] - 13, c[1]]; }
    if (stage === "start") { var a = -Math.PI / 2 + 2 * Math.PI * d / 6; return [138 + 24 * Math.cos(a), 104 + 24 * Math.sin(a)]; }
    var row = d < 3 ? 0 : 1, j = d % 3, y = row ? 132 : 76;
    if (stage === "gly") return [116 + 22 * j, y];
    if (stage === "po") return [116 + 22 * (j - 1), y];
    return [[0, 92, 132][j], row ? 124 : 88];
  }
  function trackerSVG(stage, prevStage, k){
    var h = sv("rect", { x:4, y:4, width:272, height:178, rx:10, "class":"kc-zone" }) + sv("rect", { x:284, y:4, width:152, height:178, rx:10, "class":"kc-zone" });
    h += txt(14, 22, "In organic molecules", "kc-bxt") + txt(294, 22, "Released as CO₂", "kc-bxt");
    var st = byId(s1.stages, stage), i;
    if (stage === "start") h += sv("circle", { cx:138, cy:104, r:40, "class":"kc-mol" }) + txt(138, 164, "glucose (6C)", "kc-nl", "middle");
    else if (stage === "gly") [76, 132].forEach(function(y){ h += sv("rect", { x:96, y:y - 14, width:84, height:28, rx:14, "class":"kc-pill" }) + txt(188, y + 4, "pyruvate (3C)", "kc-nl"); });
    else if (stage === "po") [76, 132].forEach(function(y){ h += sv("rect", { x:93, y:y - 14, width:68, height:28, rx:14, "class":"kc-pill" }) + txt(170, y + 4, "acetyl-CoA (2C)", "kc-nl"); });
    else h += sv("rect", { x:52, y:50, width:120, height:110, rx:16, "class":"kc-cyc" }) + txt(112, 176, "cycle intermediates", "kc-nl", "middle") + sv("circle", { cx:112, cy:105, r:42, "class":"kc-ring kc-faint" });
    for (i = 0; i < 6; i++) { if (inCO2(stage, i) && (!prevStage || inCO2(prevStage, i) || k >= 0.95)) { var cp = co2Pos(i); h += sv("rect", { x:cp[0] - 26, y:cp[1] - 12, width:52, height:24, rx:12, "class":"kc-co2" }) + txt(cp[0] + 8, cp[1] + 4, "CO₂", "kc-tk", "middle"); } }
    for (i = 0; i < 6; i++) {
      var p = dotPos(stage, i);
      if (prevStage && k < 1) { var p0 = dotPos(prevStage, i), e = MV.ease(k); p = [lerp(p0[0], p[0], e), lerp(p0[1], p[1], e)]; }
      h += sv("circle", { cx:p[0], cy:p[1], r:4.6, "class":"kc-c" }) + sv("circle", { cx:p[0], cy:p[1], r:8, "class":"kc-ring14" });
    }
    var aria = "¹⁴C tracker. " + st.cap + " Labelled carbons in organic molecules: " + st.org + "; released as CO₂: " + st.co2 + (st.avg ? " (on average)." : ".");
    return '<svg viewBox="0 0 440 186" class="kc-svg" role="img" aria-label="' + MV.esc(aria) + '">' + h + "</svg>";
  }
  function paintS1(){
    var cur = S.s1.stage, ci = ORDER.indexOf(cur), st = byId(s1.stages, cur);
    var bb = $("#kc-s1b", host);
    MV.keepFocus(bb, function(){
      bb.innerHTML = s1.stages.slice(1).map(function(s){ var i = ORDER.indexOf(s.id), done = i <= ci; return '<button type="button" class="btn sm ' + (i === ci + 1 ? "primary" : "ghost") + (done ? " kc-done" : "") + '" data-s1="' + s.id + '" data-k="s1' + s.id + '"' + (i !== ci + 1 || s1anim ? " disabled" : "") + ">" + (done ? "✓ " : "") + s.t + "</button>"; }).join("") +
        '<button type="button" class="btn ghost sm" data-s1="start" data-k="s1start"' + (ci === 0 || s1anim ? " disabled" : "") + ">Start again</button>";
    });
    $("#kc-trk", host).innerHTML = trackerSVG(cur, from, prog);
    $("#kc-s1cap", host).innerHTML = "<strong>" + st.t + ".</strong> " + st.cap;
    var cells = ""; for (var i = 0; i < 6; i++) cells += '<i class="' + (i < st.org ? "org" : "gone") + '"></i>';
    $("#kc-s1bar", host).innerHTML = '<div class="kc-6" aria-hidden="true">' + cells + '</div><p class="tiny"><span class="kc-k org"></span> ' + s1.barOrg + ": <strong>" + st.org + '</strong> · <span class="kc-k gone"></span> ' + s1.barCo2 + ": <strong>" + st.co2 + "</strong>" + (st.avg ? " (on average)" : "") + "</p>";
    paintAsk();
  }
  function paintAsk(){
    var a = S.s1, box = $("#kc-ask", host), h;
    if (!a.ask) h = '<div class="q-actions"><button type="button" class="btn ghost sm" id="kc-askb" data-k="kcaskb">' + s1.ask + "</button></div>";
    else {
      h = '<div class="numrow"><label for="kc-ask-in">' + s1.ask + '</label><input class="numin" id="kc-ask-in" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(a.val || "") + '"' + (a.solved ? " disabled" : "") + '><span class="kc-unit">CO₂</span></div>';
      if (!a.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" id="kc-askc" data-k="kcaskc">Check</button></div>';
      if (a.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s1.askGood);
      else if (s1msg) h += MV.fbHTML("bad", s1msg);
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function goStage(id){
    var prev = S.s1.stage; if (id === prev) return;
    S.s1.stage = id; api.save();
    if (id === "start" || MV.reduceMotion) { from = null; prog = 1; paintS1(); return; }
    from = prev; prog = 0; s1anim = true; paintS1();
    MV.tween({ dur:1100, step:function(k){ prog = k; $("#kc-trk", host).innerHTML = trackerSVG(id, from, k); }, done:function(){ s1anim = null; from = null; prog = 1; paintS1(); } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.s1) { goStage(b.dataset.s1); return; }
    if (b.id === "kc-askb") { S.s1.ask = true; api.save(); paintAsk(); var inp = $("#kc-ask-in", host); if (inp) inp.focus(); return; }
    if (b.id === "kc-askc") {
      var a = S.s1, v = parseVal(a.val);
      if (v == null) { s1msg = "Enter a whole number, such as 4."; paintAsk(); return; }
      if (v === MV.ans(s1)) { a.solved = true; s1msg = null; }
      else { a.tries++; var nw = (s1.askWrong || []).filter(function(x){ return x.match === v; })[0]; s1msg = "<strong>✗ Not quite.</strong> " + (nw ? nw.fb : s1.askGeneral) + " Try again."; }
      api.save(); paintAsk(); MV.focusFb($("#kc-ask", host)); return;
    }
    if (b.dataset.num != null) { if (b.dataset.drag === "1") return; sel = sel === +b.dataset.num ? null : +b.dataset.num; s2msg = null; paintS2(); return; }
    if (b.dataset.cell) { dropOn(b.dataset.cell); return; }
    if (b.dataset.ci != null) { var box = b.closest("[data-pr]"); answerS3(box.dataset.pr, +b.dataset.ci); }
  });
  host.addEventListener("input", function(e){ if (e.target.id === "kc-ask-in") { S.s1.val = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.id === "kc-ask-in") { var c = $("#kc-askc", host); if (c) c.click(); } });

  // ---- Station 2: totals table ----
  function cellFb(row, j, v){
    if (row.id === "kr" && row.perTurn[j] === v) return s2.fbTurn;
    if (row.id === "po" && j === 1 && v === 0) return s2.fbPoNadh;
    if (row.total) return s2.fbTotal;
    return s2.fbGeneral;
  }
  function dropOn(cell){
    var parts = cell.split("-"), row = byId(s2.rows, parts[0]), j = +parts[1], st = S.s2;
    if (st.cells[cell] != null) return;
    if (sel == null) { s2msg = { kind:"", html:"Tap or drag a number chip first, then drop it on a cell." }; paintS2(); return; }
    var ans = MV.ans(row)[j], lab = MV.plain(row.stage) + ", " + MV.plain(s2.cols[j]);
    if (sel === ans) { st.cells[cell] = ans; s2msg = { kind:"good", html:"<strong>✓ " + lab + ": " + ans + (row.net && j === 0 ? " (net)" : "") + ".</strong>" }; }
    else { st.tries[cell] = (st.tries[cell] || 0) + 1; s2msg = { kind:"bad", html:"<strong>✗ " + lab + ": not " + sel + ".</strong> " + cellFb(row, j, sel) }; }
    api.save(); paintS2(); MV.focusFb($("#kc-s2fb", host));
  }
  function paintS2(){
    var st = S.s2, filled = Object.keys(st.cells).length, total = s2.rows.length * s2.cols.length;
    var ch = $("#kc-nchips", host);
    MV.keepFocus(ch, function(){ ch.innerHTML = s2.chips.map(function(n){ return '<button type="button" class="chip kc-nchip' + (sel === n ? " on" : "") + '" aria-pressed="' + (sel === n) + '" data-num="' + n + '" data-k="nc' + n + '">' + n + "</button>"; }).join(""); });
    var tb = $("#kc-tt tbody", host);
    MV.keepFocus(tb, function(){
      tb.innerHTML = s2.rows.map(function(r){
        return '<tr class="' + (r.total ? "kc-tot" : "") + '"><th scope="row">' + r.stage + "</th><td>" + r.where + "</td>" + s2.cols.map(function(c, j){
          var id = r.id + "-" + j, v = st.cells[id], ok = v != null;
          return '<td><button type="button" class="kc-cell' + (ok ? " ok" : "") + (sel != null && !ok ? " ready" : "") + '" data-cell="' + id + '" data-k="cl' + id + '" aria-label="' + MV.esc(MV.plain(r.stage) + ", " + MV.plain(c) + ": " + (ok ? v + ", correct" : "empty")) + '"' + (ok ? " disabled" : "") + ">" + (ok ? v + (r.net && j === 0 ? " (net)" : "") + ' <span aria-hidden="true">✓</span>' : '<span class="kc-q" aria-hidden="true">?</span>') + "</button></td>";
        }).join("") + "</tr>";
      }).join("");
    });
    var fb = "";
    if (s2msg) fb = s2msg.kind ? MV.fbHTML(s2msg.kind, s2msg.html) : '<p class="tiny">' + s2msg.html + "</p>";
    if (filled === total) fb += MV.fbHTML("good", s2.done);
    else fb += '<p class="tiny muted">' + filled + " of " + total + " cells filled.</p>";
    $("#kc-s2fb", host).innerHTML = fb;
  }
  // pointer drag for the number chips (no HTML5 drag-and-drop: the site blocks dragstart)
  var drag = null;
  host.addEventListener("pointerdown", function(e){
    var b = e.target.closest("[data-num]"); if (!b || e.button > 0) return;
    drag = { n:+b.dataset.num, x:e.clientX, y:e.clientY, el:null, b:b, id:e.pointerId };
  });
  window.addEventListener("pointermove", function(e){
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.el && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
    if (!drag.el) { drag.el = document.createElement("span"); drag.el.className = "kc-ghost"; drag.el.textContent = drag.n; document.body.appendChild(drag.el); drag.b.dataset.drag = "1"; }
    drag.el.style.left = e.clientX + "px"; drag.el.style.top = e.clientY + "px";
    e.preventDefault();
  }, { passive:false });
  function endDrag(e){
    if (!drag || (e && e.pointerId !== drag.id)) return;
    var d = drag; drag = null;
    if (!d.el) return;
    d.el.remove(); setTimeout(function(){ delete d.b.dataset.drag; }, 0);
    if (!e || e.type === "pointercancel") return;
    var t = document.elementFromPoint(e.clientX, e.clientY), c = t && t.closest ? t.closest("[data-cell]") : null;
    if (c && !c.disabled && host.contains(c)) { sel = d.n; dropOn(c.dataset.cell); }
  }
  window.addEventListener("pointerup", endDrag); window.addEventListener("pointercancel", endDrag);

  // ---- Station 3: data prompts ----
  function paintS3(id){
    var p = byId(s3.prompts, id), st = S.s3[id] || {}, ri = MV.right(p.choices), box = $('[data-pr="' + id + '"]', host), done = st.last === ri;
    var h = '<p class="kc-tp"><span class="tag">Data</span> ' + p.q + '</p><div class="sq-c kc-prc" role="group" aria-label="Choices">' + p.choices.map(function(c, i){ return '<button type="button" class="chip' + (st.last === i ? " on" : "") + '" aria-pressed="' + (st.last === i) + '" data-ci="' + i + '" data-k="' + id + "c" + i + '"' + (done ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    if (st.last != null) { var c = p.choices[st.last], good = st.last === ri; h += MV.fbHTML(good ? "good" : "bad", "<strong>" + (good ? "✓ Correct." : "✗ Not quite. Try another answer.") + "</strong> " + c.fb); }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function answerS3(id, i){
    var p = byId(s3.prompts, id), st = S.s3[id] || (S.s3[id] = { tries:0 }), ri = MV.right(p.choices);
    st.tries++; st.last = i; if (i === ri && st.first == null) st.first = st.tries === 1; if (i !== ri) st.first = false;
    api.save(); paintS3(id); MV.focusFb($('[data-pr="' + id + '"]', host));
  }
  paintS1(); paintS2(); s3.prompts.forEach(function(p){ paintS3(p.id); });
  P3F = { show:function(){} };
  return {};
}

// ---------- Practice 1: Tag the cycle (@component chipTagger — N7-style product chips + carbon box per step) ----------
function tagger(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:{}, c:"", tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">Tap every product the step releases (or “nothing extra”), type the carbons that come out, then press Check.</p>' + a.items.map(function(it){ return '<div class="q" data-tg="' + it.id + '"></div>'; }).join("");
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-tg="' + it.id + '"]', host);
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt"><strong>' + it.step + "</strong></div></div>";
    h += '<div class="kc-tgp" role="group" aria-label="Products released by this step">' + a.products.map(function(p){ var on = !!x.pick[p.id]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-tp="' + p.id + '" data-k="' + it.id + p.id + '"' + (x.solved ? " disabled" : "") + ">" + p.t + "</button>"; }).join("") + "</div>";
    h += '<div class="numrow kc-tgc"><label for="tg-' + it.id + '">Carbons: ' + it.cin + ' →</label><input class="numin" id="tg-' + it.id + '" data-tgc="' + it.id + '" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(x.c) + '"' + (x.solved ? " disabled" : "") + '><span class="kc-unit">carbons out</span></div>';
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.tgc; if (!id) return; ist(id).c = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.tgc) { var b = host.querySelector('[data-k="' + e.target.dataset.tgc + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-tg]"); if (!box) return;
    var it = byId(a.items, box.dataset.tg), x = ist(it.id);
    if (b.dataset.tp) {
      var p = b.dataset.tp; x.pick[p] = !x.pick[p];
      if (x.pick[p] && p === "none") Object.keys(x.pick).forEach(function(q){ if (q !== "none") x.pick[q] = false; });
      if (x.pick[p] && p !== "none") x.pick.none = false;
      msgs[it.id] = null; api.save(); paintItem(it); return;
    }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    var ans = MV.ans(it), picks = a.products.map(function(q){ return q.id; }).filter(function(q){ return x.pick[q]; }), c = parseVal(x.c);
    if (!picks.length || c == null) { msgs[it.id] = "Tap at least one product (or “nothing extra”) and type the carbons that come out."; paintItem(it); return; }
    var want = ans.p.slice().sort().join(","), got = picks.slice().sort().join(","), pOk = want === got, cOk = c === ans.c;
    if (pOk && cOk) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else {
      x.tries++;
      var m = [];
      if (!pOk) {
        var named = picks.filter(function(q){ return it.wrong && it.wrong[q] && ans.p.indexOf(q) < 0; })[0];
        m.push(named ? it.wrong[named] : "Check the products: a CO₂ means a carbon leaves, and each dehydrogenase loads one carrier.");
      }
      if (!cOk) m.push(Math.abs(c - ans.c) === 1 ? a.offByOne : "Count the carbons in the product.");
      msgs[it.id] = "<strong>✗ Not quite.</strong> " + m.join(" ") + " Try again.";
    }
    api.save(); paintItem(it); MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Ledger puzzles (N4 number entry with one or two boxes; adapted from SBI4U 08's detective) ----------
function ledgerPuzzles(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { vals:[], tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">Type whole numbers, then press Check.</p>' + a.items.map(function(it){ return '<div class="q" data-lp="' + it.id + '"></div>'; }).join("");
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-lp="' + it.id + '"]', host);
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += it.boxes.map(function(bx, j){ return '<div class="numrow"><label for="lp-' + it.id + j + '">' + bx.label + ':</label><input class="numin" id="lp-' + it.id + j + '" data-lpi="' + it.id + '" data-j="' + j + '" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(x.vals[j] || "") + '"' + (x.solved ? " disabled" : "") + '><span class="kc-unit">' + bx.unit + "</span></div>"; }).join("");
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lpi; if (!id) return; ist(id).vals[+e.target.dataset.j] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lpi) { var b = host.querySelector('[data-k="' + e.target.dataset.lpi + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-lp]"); if (!box) return;
    var it = byId(a.items, box.dataset.lp), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    var ans = MV.ans(it), v = it.boxes.map(function(_, j){ return parseVal(x.vals[j]); });
    if (v.some(function(q){ return q == null; })) { msgs[it.id] = "Enter a whole number in " + (it.boxes.length > 1 ? "each box" : "the box") + ", such as 12."; paintItem(it); return; }
    var ok = v.every(function(q, j){ return q === ans[j]; });
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else {
      x.tries++;
      var named = (it.wrong || []).filter(function(w){ return w.box != null ? v[w.box] === w.match[0] && v[w.box] !== ans[w.box] : w.match.every(function(m, j){ return v[j] === m; }); })[0];
      var part = it.boxes.length > 1 && !named ? " " + it.boxes.map(function(bx, j){ return v[j] === ans[j] ? bx.label + " ✓" : bx.label + " ✗"; }).join(" · ") + "." : "";
      msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general) + part + " Try again.";
    }
    api.save(); paintItem(it); MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Fuel the cycle (three steppers; live ledger with target marks) ----------
var task = (function(){
  var api = null;
  function st(){ var s = api.S; ["g", "p", "a"].forEach(function(k){ if (s[k] == null) s[k] = 0; }); return s; }
  function read(){ if (!api) return { g:0, p:0, a:0 }; var s = st(); return { g:+s.g, p:+s.p, a:+s.a }; }
  function calc(d){ var t = 2 * d.g + d.p + d.a; return { turns:t, co2:6 * d.g + 3 * d.p + 2 * d.a, nadh:8 * d.g + 4 * d.p + 3 * d.a, fadh:t, atp:t, gN:2 * d.g, gA:2 * d.g }; }
  function hex(x, y){ var p = ""; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; p += (i ? "L" : "M") + f1(x + 11 * Math.cos(a)) + " " + f1(y + 11 * Math.sin(a)); } return sv("path", { d:p + "Z", "class":"kc-hex" }) + dotRing(x, y, 6, true, 6); }
  function bar(lab, v, max, mark, tok, extra){
    return '<div class="kc-br"><span class="kc-bl">' + lab + '</span><span class="kc-bt">' + (mark != null ? '<b style="left:' + f1(mark / max * 100) + '%"></b>' : "") + '<i style="width:' + f1(clamp(v / max, 0, 1) * 100) + "%;background:var(" + tok + ')"></i></span><b class="kc-bv">' + v + "</b></div>" + (extra || "");
  }
  function draw(){
    var d = read(), c = calc(d), box = $("#kc-tpv"); if (!box) return;
    var icons = "", x = 14, i;
    for (i = 0; i < d.g; i++) { icons += hex(x, 18); x += 28; }
    if (d.g && (d.p || d.a)) x += 6;
    for (i = 0; i < d.p; i++) { icons += pillTok(x + 6, 18, 3, true); x += 36; }
    if (d.p && d.a) x += 6;
    for (i = 0; i < d.a; i++) { icons += pillTok(x + 4, 18, 2, true); x += 28; }
    box.innerHTML = '<h4 class="kc-th">Your fuel mix</h4>' + (d.g || d.p || d.a ? '<svg viewBox="0 0 ' + Math.max(40, x) + ' 36" class="kc-fsvg" aria-hidden="true" focusable="false">' + icons + "</svg>" : '<p class="tiny muted">No fuel yet.</p>') +
      "<p>" + plural(d.g, "glucose", "glucose") + " · " + plural(d.p, "extra pyruvate", "extra pyruvate") + " · " + d.a + " acetyl-CoA</p>" +
      '<h4 class="kc-th">Live ledger</h4>' +
      bar("Turns", c.turns, 12, 6, "--ink") + bar("CO₂ (pyruvate oxidation + cycle)", c.co2, 32, 16, "--bio-carbon") + bar("NADH", c.nadh, 48, null, "--bio-nadh") + bar("FADH₂", c.fadh, 12, null, "--bio-fadh") + bar("ATP (via GTP)", c.atp, 12, null, "--bio-atp") +
      '<p class="tiny muted">Marks: 6 turns and 16 CO₂.' + (c.gN ? " Glycolysis also made " + c.gA + " ATP and " + c.gN + " NADH in the cytosol (not counted above)." : "") + "</p>";
    box.setAttribute("aria-label", "Fuel mix: " + d.g + " glucose, " + d.p + " extra pyruvate, " + d.a + " acetyl-CoA. Turns " + c.turns + ", CO₂ " + c.co2 + ", NADH " + c.nadh + ", FADH₂ " + c.fadh + ", ATP " + c.atp + ".");
  }
  function parse(k){ var p = k.split("-").map(Number); return { g:p[0], p:p[1], a:p[2] }; }
  function lab(k){ var q = parse(k); return plural(q.g, "glucose", "glucose") + ", " + plural(q.p, "pyruvate", "pyruvate") + ", " + q.a + " acetyl-CoA"; }
  return {
    render:function(inp, pv, a){
      api = a; var s = st();
      inp.innerHTML = '<div class="kc-tin"><div id="kc-tg"></div><div id="kc-tp"></div><div id="kc-ta"></div></div>';
      function upd(){ a.save(); draw(); a.update(); }
      stepper($("#kc-tg", inp), { id:"kc-tgv", label:"Glucose <i>g</i> (via glycolysis)", min:0, max:4, value:s.g, onChange:function(v){ s.g = v; upd(); } });
      stepper($("#kc-tp", inp), { id:"kc-tpv2", label:"Extra pyruvate <i>p</i> (from the blood)", min:0, max:8, value:s.p, onChange:function(v){ s.p = v; upd(); } });
      stepper($("#kc-ta", inp), { id:"kc-tav", label:"Acetyl-CoA <i>a</i> (from fats)", min:0, max:10, value:s.a, onChange:function(v){ s.a = v; upd(); } });
      pv.innerHTML = '<div class="kc-tpv" id="kc-tpv" role="group"></div>';
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var c = calc(d); return [c.turns === 6, c.co2 === 16, [d.g, d.p, d.a].filter(function(v){ return v > 0; }).length >= 2]; },
    key:function(d){ return d.g + "-" + d.p + "-" + d.a; },
    label:lab,
    text:lab
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ tag:tagger, ledger:ledgerPuzzles },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
