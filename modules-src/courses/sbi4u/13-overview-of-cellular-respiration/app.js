// SBI4U 13 Overview of Cellular Respiration: hero (the four stages on a cell map), Respiration map (S1 diagram explorer with
// drop zones; S2 pathway stepper with an atom tracker; S3 energy ledger with stage switches), Photosynthesis and respiration
// as a cycle (Venn sort, matter-and-energy loop, BTB jar experiment), lab-data puzzles (Practice), "Design a fair
// respiration test" (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 04 / 08) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "cr-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!tot) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function grp(a, inner){ return a <= 0.02 ? "" : a < 0.98 ? '<g opacity="' + f1(a * 100) / 100 + '">' + inner + "</g>" : inner; }
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/,/g, "").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function pc(v){ return "≈ " + Math.round(v) + "%"; }

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

// ---------- @component S1 diagramExplorer (copied from SBI4U 03 / 01; here the buttons grow to at least 44 × 44 px and the
// arrow keys move between them) — schematic SVG with native-button hotspots ----------
// diagramExplorer(host, { levels:[{ id, name, vb:[w, h], draw() -> SVG markup, aria() -> text, hotspots:[{ id, label, zones:[[x, y, w, h]] }] }],
//   level:"id", onTap(id, levelId) }) -> { level(), setLevel(id), over(), svg(), setAria(text), labels(fn), refresh() }
function diagramExplorer(host, o){
  var lvId = o.level || o.levels[0].id;
  host.innerHTML = '<div class="s1"><div class="s1-stage"><svg class="s1-svg" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg><div class="s1-hs" role="group"></div></div></div>';
  var stage = $(".s1-stage", host), svg = $(".s1-svg", host), hsBox = $(".s1-hs", host);
  function L(){ return o.levels.filter(function(x){ return x.id === lvId; })[0]; }
  function p2(v){ return Math.round(v * 100) / 100; }
  function render(){
    var lv = L(), w = lv.vb[0], h = lv.vb[1];
    stage.style.aspectRatio = w + " / " + h;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.innerHTML = lv.draw() + '<g class="s1-over"></g>';
    svg.setAttribute("aria-label", lv.aria ? lv.aria() : lv.name);
    hsBox.setAttribute("aria-label", lv.name);
    hsBox.hidden = !lv.hotspots.length;
    var list = [];
    lv.hotspots.forEach(function(hs){ hs.zones.forEach(function(z, zi){ list.push({ hs:hs, z:z, zi:zi, area:z[2] * z[3] }); }); });
    list.slice().sort(function(a, b){ return b.area - a.area; }).forEach(function(it, i){ it.zx = 1 + i; });
    list.sort(function(a, b){ return (a.z[1] - b.z[1]) || (a.z[0] - b.z[0]); });
    hsBox.innerHTML = list.map(function(it){
      var z = it.z, cx = (z[0] + z[2] / 2) / w * 100, cy = (z[1] + z[3] / 2) / h * 100, pw = z[2] / w * 100, ph = z[3] / h * 100;
      return '<button type="button" class="s1-b" data-hs="' + it.hs.id + '" data-k="s1' + lvId + it.hs.id + it.zi + '" aria-label="' + MV.esc(it.hs.label) + '" style="left:calc(' + p2(cx) + "% - max(22px, " + p2(pw / 2) + "%));top:calc(" + p2(cy) + "% - max(22px, " + p2(ph / 2) + "%));width:max(44px, " + p2(pw) + "%);height:max(44px, " + p2(ph) + "%);z-index:" + it.zx + '"></button>';
    }).join("");
  }
  hsBox.addEventListener("click", function(e){ var b = e.target.closest(".s1-b"); if (b && o.onTap) o.onTap(b.dataset.hs, lvId); });
  hsBox.addEventListener("keydown", function(e){
    var b = e.target.closest(".s1-b"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$(".s1-b", hsBox), i = all.indexOf(b); all[(i + d + all.length) % all.length].focus();
  });
  render();
  return {
    level:function(){ return lvId; },
    setLevel:function(id){ if (id !== lvId) { lvId = id; render(); } },
    over:function(){ return $(".s1-over", svg); },
    svg:function(){ return svg; },
    setAria:function(t){ svg.setAttribute("aria-label", t); },
    labels:function(fn){ $$(".s1-b", hsBox).forEach(function(b){ b.setAttribute("aria-label", fn(b.dataset.hs)); }); },
    refresh:render
  };
}

// ---------- the respiration map (viewBox 420 × 350): cell, nucleus, mitochondrion with cristae, stations ----------
var VW = 420, VH = 350;
var MI = { cx:264, cy:184, orx:146, ory:108, irx:126, iry:88 };
var NUC = { cx:56, cy:66, r:32 };
function ell(rx, ry, x, s){ var d = (x - MI.cx) / rx; return MI.cy + s * ry * Math.sqrt(Math.max(0, 1 - d * d)); }
function inTop(x){ return ell(MI.irx, MI.iry, x, -1); }
function inBot(x){ return ell(MI.irx, MI.iry, x, 1); }
function outTop(x){ return ell(MI.orx, MI.ory, x, -1); }
function onIn(deg){ var r = deg * Math.PI / 180; return [MI.cx + MI.irx * Math.cos(r), MI.cy + MI.iry * Math.sin(r)]; }
var CRIS = { top:[186, 236, 286], bot:[206, 256, 306], w:12, d:28 };
var CPLX = [-38, -13, 12, 37].map(onIn);
var SYN = (function(){ var p = onIn(52), dx = MI.cx - p[0], dy = MI.cy - p[1], L = Math.hypot(dx, dy); return { x:p[0], y:p[1], ux:dx / L, uy:dy / L }; })();
var WH = { cx:276, cy:186, r:21 };
var PT = { gly:[58, 170], po:[152, 186], kr:[WH.cx, WH.cy], c12:CPLX[1], c4:CPLX[3], syn:[SYN.x + SYN.ux * 17, SYN.y + SYN.uy * 17] };
// station titles (Modes B and C, hero) and their leaders
var TT = { gly:[58, 120, "middle"], po:[138, 30, "middle"], kr:[258, 30, "middle"], ch:[410, 58, "end"] };
var TL = { po:[[138, 40], [166, 174]], kr:[[258, 40], [274, 165]], ch:[[392, 78], [365, 119]] };
function crista(x, dir){
  var w = CRIS.w / 2, x1 = x - w, x2 = x + w, edge = dir > 0 ? inTop : inBot, y1 = edge(x1), y2 = edge(x2);
  var tip = (dir > 0 ? Math.max(y1, y2) : Math.min(y1, y2)) + dir * CRIS.d;
  var p = "M" + f1(x1) + " " + f1(y1) + " L" + f1(x1) + " " + f1(tip - dir * w) + " A" + w + " " + w + " 0 0 " + (dir > 0 ? 0 : 1) + " " + f1(x2) + " " + f1(tip - dir * w) + " L" + f1(x2) + " " + f1(y2);
  return sv("path", { d:p, "class":"cr-cris" }) + sv("line", { x1:x1 + 1.3, y1:edge(x1 + 1.3), x2:x2 - 1.3, y2:edge(x2 - 1.3), "class":"cr-crm" });
}
function cellSVG(){
  var h = sv("rect", { x:4, y:4, width:VW - 8, height:VH - 8, rx:32, "class":"cr-cell" });
  h += sv("circle", { cx:NUC.cx, cy:NUC.cy, r:NUC.r, "class":"cr-nuc" }) + sv("circle", { cx:NUC.cx, cy:NUC.cy, r:NUC.r - 4, "class":"cr-nuc2" }) + sv("circle", { cx:NUC.cx + 7, cy:NUC.cy - 5, r:8, "class":"cr-nucl" });
  h += sv("ellipse", { cx:MI.cx, cy:MI.cy, rx:MI.orx, ry:MI.ory, "class":"cr-om" }) + sv("ellipse", { cx:MI.cx, cy:MI.cy, rx:MI.irx, ry:MI.iry, "class":"cr-im" });
  CRIS.top.forEach(function(x){ h += crista(x, 1); });
  CRIS.bot.forEach(function(x){ h += crista(x, -1); });
  return h;
}
function wheelSVG(rot){
  var h = sv("circle", { cx:WH.cx, cy:WH.cy, r:WH.r, "class":"cr-ring" });
  [20, 140, 260].forEach(function(d){ var a = (d + rot) * Math.PI / 180, x = WH.cx + WH.r * Math.cos(a), y = WH.cy + WH.r * Math.sin(a); h += sv("path", { d:head(x, y, -Math.sin(a), Math.cos(a), 6), "class":"cr-ringh" }); });
  for (var i = 0; i < 4; i++) { var b = (i * 90 + 45 + rot) * Math.PI / 180; h += sv("circle", { cx:WH.cx + WH.r * Math.cos(b), cy:WH.cy + WH.r * Math.sin(b), r:3.2, "class":"cr-cdot" }); }
  return h;
}
function chainSVG(rot){
  var h = "";
  CPLX.forEach(function(p, i){ h += sv("ellipse", { cx:p[0], cy:p[1], rx:i === 1 ? 7 : 9, ry:i === 1 ? 9 : 12, "class":"cr-cx", transform:"rotate(" + f1([-38, -13, 12, 37][i] + 90) + " " + f1(p[0]) + " " + f1(p[1]) + ")" }); });
  var S = SYN, bx = S.x - S.ux * 4, by = S.y - S.uy * 4, hx = S.x + S.ux * 17, hy = S.y + S.uy * 17;
  h += sv("line", { x1:bx, y1:by, x2:hx, y2:hy, "class":"cr-synst" }) + sv("rect", { x:bx - 7, y:by - 5, width:14, height:10, rx:3, "class":"cr-synb", transform:"rotate(" + f1(Math.atan2(S.uy, S.ux) * 180 / Math.PI + 90) + " " + f1(bx) + " " + f1(by) + ")" });
  h += sv("circle", { cx:hx, cy:hy, r:8.5, "class":"cr-synh" });
  for (var i = 0; i < 3; i++) { var a = (i * 120 + rot) * Math.PI / 180; h += sv("line", { x1:hx, y1:hy, x2:hx + 7 * Math.cos(a), y2:hy + 7 * Math.sin(a), "class":"cr-synr" }); }
  return h;
}
// titles: o = {hot:"stageId", st:{gly:"running"|…}, dim:{gly:true}}
var ST_TXT = { running:"✓ running", off:"○ off", waiting:"○ waiting", noO2:"✗ stopped: no O₂", noNAD:"✗ stopped: no NAD⁺", ferment:"only by fermenting" };
// on the map, Mode C marks each title ✓ (running), ✗ (stopped) or ○ (off or waiting); the switch panel and readout give the reason
var TN = { gly:["Glycolysis"], po:["Pyruvate oxidation"], kr:["Krebs cycle"], ch:["Electron transport", "chain"] };
var TMARK = { running:"✓ ", ferment:"✓ ", off:"○ ", waiting:"○ ", noO2:"✗ ", noNAD:"✗ " };
function titlesSVG(o){
  o = o || {}; var h = "";
  Object.keys(TL).forEach(function(k){ var l = TL[k]; h += sv("polyline", { points:l.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":"cr-lead2" + (o.dim && o.dim[k] ? " cr-dim" : "") }); });
  ["gly", "po", "kr", "ch"].forEach(function(k){
    var t = TT[k], L = TN[k], pre = o.st && o.st[k] ? TMARK[o.st[k]] : "", n = Math.max.apply(null, L.map(function(s){ return s.length; })) + pre.length, w = n * 7.3 + 10, x0 = t[2] === "end" ? t[0] - w + 6 : t[0] - w / 2;
    if (o.hot === k) h += sv("rect", { x:x0, y:t[1] - 13, width:w, height:18 + 14 * (L.length - 1), rx:5, "class":"cr-hot" });
    L.forEach(function(s, i){ h += txt(t[0], t[1] + 14 * i, (i ? "" : pre) + s, "cr-stt" + (o.dim && o.dim[k] ? " cr-dim" : ""), t[2]); });
    if (o.st && o.st[k] === "ferment") h += txt(t[0], t[1] + 13, "(only by fermenting)", "cr-sts", t[2]);
  });
  return h + txt(18, 298, "cytosol", "cr-sub") + txt(232, 233, "matrix", "cr-sub", "middle") + (o.noSyn ? "" : txt(410, 300, "ATP synthase", "cr-sub", "end") + sv("line", { x1:374, y1:290, x2:SYN.x + 3, y2:SYN.y + 4, "class":"cr-lead2" }));
}

// ---------- @component S2 pathwayStepper — station form (adapted from SBI4U 04): the four stages as stations on the map.
// Frames 0–4 (start, after glycolysis, after pyruvate oxidation, after the Krebs cycle, after the chain) list molecule clusters
// and carrier pills; trans(A, B, k) moves persisting objects, sends leaving ones to their sink and brings new ones from their
// source. The atom tracker (adapted from SBI4U 04's trackerFrame) draws a --hi halo and the isotope tag on labelled clusters. ----------
var KIND = { glu:"glu", pyr:"pyr", acet:"acet", co2:"co2", o2:"o2", h2o:"h2o", nadhG:"nadh", nadhP:"nadh", nadhK:"nadh", fadhK:"fadh", atpG:"atp", atpK:"atp", atpC:"atp" };
var GRID = { pyr:[2, 28, 16], acet:[2, 22, 16], co2:[3, 25, 14], o2:[3, 18, 13], h2o:[4, 9, 9] };
var CAP = { pyr:2, acet:2, co2:6, o2:6, h2o:12 };
var SINK = { glu:[58, 178], pyr:PT.po, acet:PT.kr, nadhG:PT.c12, nadhP:PT.c12, nadhK:PT.c12, fadhK:PT.c12, o2:PT.c4 };
function frames(cur){
  var o2 = { k:"o2", x:302, y:322, n:6, lab:"6 O₂" }, atpG = { k:"atpG", x:58, y:272, t:"2 ATP", src:PT.gly }, nadhG = { k:"nadhG", x:58, y:248, t:"2 NADH", src:PT.gly };
  return [
    [{ k:"glu", x:58, y:152, lab:"glucose" }, o2],
    [{ k:"pyr", x:58, y:198, n:2, lab:"2 pyruvate", src:[58, 152] }, nadhG, atpG, o2],
    [{ k:"acet", x:192, y:186, n:2, lab:"2 acetyl-CoA", src:PT.po }, { k:"co2", x:150, y:322, n:2, lab:"2 CO₂", src:[176, 186] }, { k:"nadhP", x:220, y:152, t:"2 NADH", src:PT.po }, nadhG, atpG, o2],
    [{ k:"co2", x:150, y:322, n:6, lab:"6 CO₂", src:PT.kr }, { k:"nadhP", x:220, y:152, t:"2 NADH" }, { k:"nadhK", x:328, y:152, t:"6 NADH", src:PT.kr }, { k:"fadhK", x:328, y:174, t:"2 FADH₂", src:PT.kr }, { k:"atpK", x:328, y:196, t:"2 ATP", src:PT.kr }, nadhG, atpG, o2],
    [{ k:"co2", x:150, y:322, n:6, lab:"6 CO₂" }, { k:"h2o", x:322, y:152, n:12, lab:"12 H₂O", src:PT.c4 }, { k:"atpK", x:328, y:196, t:"2 ATP" }, { k:"atpC", x:300, y:222, t:cur ? "26–28 ATP" : "32 ATP", src:PT.syn }, atpG]
  ];
}
function slotOf(kind, x, y, i){
  var g = GRID[kind], cols = g[0], rows = Math.ceil(CAP[kind] / cols), c = i % cols, r = Math.floor(i / cols);
  return [x + (c - (cols - 1) / 2) * g[1], y + (r - (rows - 1) / 2) * g[2]];
}
function iconSVG(kind, x, y){
  if (kind === "glu") { var d = ""; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; d += (i ? "L" : "M") + f1(x + 12 * Math.cos(a)) + " " + f1(y + 12 * Math.sin(a)); } return sv("path", { d:d + "Z", "class":"cr-glu" }) + txt(x, y + 3.6, "6C", "cr-tt", "middle"); }
  if (kind === "pyr" || kind === "acet") { var n = kind === "pyr" ? 3 : 2, w = kind === "pyr" ? 24 : 18, h = sv("rect", { x:x - w / 2, y:y - 6.5, width:w, height:13, rx:4, "class":"cr-cmol" }); for (var j = 0; j < n; j++) h += sv("circle", { cx:x + (j - (n - 1) / 2) * 6.5, cy:y, r:2.3, "class":"cr-cin" }); return h; }
  if (kind === "co2") return sv("circle", { cx:x - 6.5, cy:y, r:3.3, "class":"cr-ofill" }) + sv("circle", { cx:x + 6.5, cy:y, r:3.3, "class":"cr-ofill" }) + sv("circle", { cx:x, cy:y, r:4, "class":"cr-cfill" });
  if (kind === "o2") return sv("circle", { cx:x - 3.6, cy:y, r:3.6, "class":"cr-oring" }) + sv("circle", { cx:x + 3.6, cy:y, r:3.6, "class":"cr-oring" });
  if (kind === "h2o") return sv("circle", { cx:x, cy:y, r:3.5, "class":"cr-ofill" });
  return "";
}
var PCOL = { nadh:"--bio-nadh", fadh:"--bio-fadh", atp:"--bio-atp" };
function pillSVG(kind, x, y, t){ var w = t.length * 6.2 + 12; return sv("rect", { x:x - w / 2, y:y - 8, width:w, height:16, rx:8, fill:"var(" + PCOL[kind] + ")" }) + txt(x, y + 3.7, t, "cr-tt", "middle"); }
function boundsOf(ob){
  var kind = KIND[ob.k];
  if (PCOL[kind]) { var w = ob.t.length * 6.2 + 12; return [ob.x - w / 2, ob.y - 8, w, 16]; }
  if (kind === "glu") return [ob.x - 12, ob.y - 12, 24, 24];
  var n = ob.n || 1, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, hw = kind === "pyr" ? 12 : kind === "acet" ? 9 : kind === "co2" ? 10 : kind === "o2" ? 7.5 : 4;
  for (var i = 0; i < n; i++) { var s = slotOf(kind, ob.x, ob.y, i); x0 = Math.min(x0, s[0] - hw); x1 = Math.max(x1, s[0] + hw); y0 = Math.min(y0, s[1] - 7); y1 = Math.max(y1, s[1] + 7); }
  return [x0, y0, x1 - x0, y1 - y0];
}
// draw one object at (x, y); grow = {from:n, src:[x, y], u} brings icons from index `from` in from src
function objSVG(ob, x, y, a, grow, mark){
  var kind = KIND[ob.k], h = "";
  if (mark) { var b = boundsOf({ k:ob.k, x:x, y:y, n:ob.n, t:ob.t }), pd = 4; h += sv("rect", { x:b[0] - pd, y:b[1] - pd, width:b[2] + 2 * pd, height:b[3] + 2 * pd, rx:7, "class":"cr-halo" });
    if (mark.tag) h += sv("rect", { x:b[0] - 10, y:b[1] - pd - 15, width:26, height:14, rx:3, "class":"cr-tag" }) + txt(b[0] + 3, b[1] - pd - 4.5, mark.tag, "cr-tagt", "middle"); }
  if (PCOL[kind]) h += pillSVG(kind, x, y, ob.t);
  else if (kind === "glu") h += iconSVG("glu", x, y);
  else {
    for (var i = 0; i < (ob.n || 1); i++) {
      var s = slotOf(kind, x, y, i);
      if (grow && i >= grow.from) { if (grow.u <= 0.02) continue; var p = [lerp(grow.src[0], s[0], MV.ease(grow.u)), lerp(grow.src[1], s[1], MV.ease(grow.u))]; h += grp(Math.min(1, grow.u * 3), iconSVG(kind, p[0], p[1])); }
      else h += iconSVG(kind, s[0], s[1]);
    }
  }
  if (ob.lab) {
    var bb = boundsOf({ k:ob.k, x:x, y:y, n:ob.n }), L = ob.k === "glu" ? [x, bb[1] + bb[3] + 13, "middle"] : (ob.k === "pyr" || ob.k === "acet" || ob.k === "h2o") ? [x, bb[1] + bb[3] + 12, "middle"] : ob.k === "o2" ? [bb[0] - 6, y + 4, "end"] : [bb[0] + bb[2] + 6, y + 4, "start"];
    h += txt(L[0], L[1], ob.lab, "cr-clab", L[2]);
  }
  return grp(a, h);
}
function find(list, k){ for (var i = 0; i < list.length; i++) if (list[i].k === k) return list[i]; return null; }
// A, B: frame lists; k 0 … 1; marks(k) -> {objKey: {tag}} for the frame shown
function transSVG(A, B, k, markA, markB){
  var h = "", keys = [];
  A.concat(B).forEach(function(o){ if (keys.indexOf(o.k) < 0) keys.push(o.k); });
  keys.forEach(function(key){
    var a = find(A, key), b = find(B, key), e = MV.ease;
    if (a && b) {
      var g = (b.n || 1) > (a.n || 1) ? { from:a.n || 1, src:b.src || [b.x, b.y], u:clamp((k - 0.3) / 0.7, 0, 1) } : null;
      var ob = Object.assign({}, b); if (k < 0.5 && a.lab) ob.lab = a.lab;
      h += objSVG(ob, lerp(a.x, b.x, e(k)), lerp(a.y, b.y, e(k)), 1, g, (k < 0.5 ? markA : markB)[key]);
    } else if (a) {
      var u = clamp(k / 0.55, 0, 1), s = SINK[key] || [a.x, a.y];
      h += objSVG(a, lerp(a.x, s[0], e(u)), lerp(a.y, s[1], e(u)), 1 - u, null, markA[key]);
    } else {
      var v = clamp((k - 0.4) / 0.6, 0, 1), src = b.src || [b.x, b.y]; if (k < 0.4) return;
      h += objSVG(b, lerp(src[0], b.x, e(v)), lerp(src[1], b.y, e(v)), Math.min(1, v * 3), null, v > 0.5 ? markB[key] : null);
    }
  });
  return h;
}
function frameSVG(F, mark){ return transSVG(F, F, 1, mark || {}, mark || {}); }
// electrons (violet) along the chain and H⁺ (magenta) in the intermembrane space, shown at the chain
function chainFlowSVG(a){
  if (a <= 0.02) return "";
  var h = "";
  [CPLX[0], CPLX[2], CPLX[3]].forEach(function(p){ h += sv("circle", { cx:p[0] - 9, cy:p[1], r:3.2, "class":"cr-e" }); });
  [128, 160, 208, 240].forEach(function(y){ var d = (y - MI.cy), xi = MI.cx + MI.irx * Math.sqrt(1 - d * d / (MI.iry * MI.iry)), xo = MI.cx + MI.orx * Math.sqrt(1 - d * d / (MI.ory * MI.ory)); h += sv("circle", { cx:(xi + xo) / 2, cy:y, r:3, "class":"cr-h" }); });
  return grp(a, h);
}

// ---------- atom tracker data (per frame: where the labelled atoms are, model count per glucose) ----------
var LOCN = { glu:"glucose", pyr:"pyruvate", acet:"acetyl-CoA", co2:"CO₂", car:"carriers (as e⁻ + H⁺)", o2:"O₂", h2o:"water made at the chain" };
var TRK = {
  c:[{ glu:6 }, { pyr:6 }, { acet:4, co2:2 }, { co2:6 }, { co2:6 }],
  h:[{ glu:12 }, { pyr:8, car:4 }, { acet:6, car:6 }, { car:12 }, { h2o:12 }],
  o2:[{ o2:12 }, { o2:12 }, { o2:12 }, { o2:12 }, { h2o:12 }],
  og:[{ glu:6 }, { pyr:6 }, { acet:2, co2:4 }, { co2:6 }, { co2:6 }]
};
function marksFor(atom, fi, F, tag){
  var m = {}, loc = TRK[atom][fi];
  Object.keys(loc).forEach(function(l){
    if (l === "car") F.forEach(function(o){ if (/^(nadh|fadh)/.test(o.k)) m[o.k] = { tag:tag }; });
    else if (find(F, l)) m[l] = { tag:tag };
  });
  return m;
}
function whereText(atom, fi){ var loc = TRK[atom][fi]; return Object.keys(loc).map(function(l){ return loc[l] + " in " + LOCN[l]; }).join(", "); }

// ---------- stage model (plan: Mode C ledger values per glucose; deterministic) ----------
var SK = ["gly", "po", "kr", "ch"];
// on: {gly, po, kr, ch}; o2: bool -> {run:{…}, st:{…}}
function runOf(on, o2){
  var r = {}, st = {};
  if (o2) { r.gly = !!on.gly; r.po = !!on.po && r.gly; r.kr = !!on.kr && r.po; r.ch = !!on.ch && r.kr; }
  else { r.gly = !!on.gly; r.po = r.kr = r.ch = false; }
  st.gly = !on.gly ? "off" : o2 ? "running" : "ferment";
  st.po = !on.po ? "off" : !o2 ? "noNAD" : r.gly ? "running" : "waiting";
  st.kr = !on.kr ? "off" : !o2 ? "noNAD" : r.po ? "running" : "waiting";
  st.ch = !on.ch ? "off" : !o2 ? "noO2" : r.kr ? "running" : "waiting";
  return { run:r, st:st, o2:o2 };
}
function depthOf(r){ return r.gly ? r.po ? r.kr ? r.ch ? 4 : 3 : 2 : 1 : 0; }
function totals(R, cur){
  var r = R.run, t = { atpD:(r.gly ? 2 : 0) + (r.kr ? 2 : 0), nadh:(r.gly ? 2 : 0) + (r.po ? 2 : 0) + (r.kr ? 6 : 0), fadh:r.kr ? 2 : 0, co2:(r.po ? 2 : 0) + (r.kr ? 4 : 0), o2:r.ch ? 6 : 0, ch:r.ch };
  t.lo = t.atpD + (r.ch ? (cur ? 26 : 32) : 0); t.hi = t.atpD + (r.ch ? (cur ? 28 : 32) : 0);
  return t;
}
var SNAME = { gly:"Glycolysis", po:"pyruvate oxidation", kr:"the Krebs cycle", ch:"the chain" };
function runningText(R){
  var r = R.run, on = SK.filter(function(k){ return r[k]; });
  if (!R.o2 && r.gly) return "Glycolysis only (if the cell ferments)";
  if (on.length === 4) return "All 4";
  if (!on.length) return "None";
  return on.map(function(k, i){ var n = { gly:"glycolysis", po:"pyruvate oxidation", kr:"Krebs cycle", ch:"chain" }[k]; return i ? n : n.charAt(0).toUpperCase() + n.slice(1); }).join(", ");
}
function atpText(t, cur){
  if (t.ch) return cur ? "≈ 30–32 (current estimate)" : "36 (textbook)";
  return t.atpD ? t.atpD + " (made directly; the chain isn’t running)" : "0";
}
function energy(R, t, cur){
  var r = R.run, f = 30.5 / 2870 * 100;
  if (!r.gly) return { text:"No glucose is broken down.", bars:null };
  if (t.ch) {
    var lo = t.lo * f, hi = t.hi * f;
    return { text:(cur ? "≈ " + Math.round(lo) + "–" + Math.round(hi) + "% in ATP, ≈ " + Math.round(100 - hi) + "–" + Math.round(100 - lo) + "% as heat" : pc(lo) + " in ATP, " + pc(100 - lo) + " as heat"),
      calc:cur ? "Current estimate: 30–32 × 30.5 ÷ 2870" : "Textbook: 36 × 30.5 ÷ 2870", bars:[["In ATP", lo, "--bio-atp"], ["As heat", 100 - hi, "--ink-2"]] };
  }
  var where = !R.o2 ? "the fermentation product (module 20)" : r.kr ? "the loaded carriers (10 NADH, 2 FADH₂)" : r.po ? "2 acetyl-CoA and 4 NADH" : "2 pyruvate and 2 NADH";
  return { text:pc(t.atpD * f) + " in ATP; most of the rest is still stored in " + where + ".", bars:[["In ATP", t.atpD * f, "--bio-atp"], ["Not released yet", 100 - t.atpD * f, "--bio-carbon"]], open:true };
}
function statusText(R, on){
  var r = R.run;
  if (!R.o2) return "Chain stopped → NAD⁺ not regenerated → pyruvate oxidation and Krebs stop. Glycolysis stalls too, unless the cell ferments (module 20).";
  if (SK.every(function(k){ return r[k]; })) return "Running";
  if (!SK.some(function(k){ return on[k]; })) return "Stopped: switch on glycolysis to start.";
  for (var i = 0; i < 4; i++) { var k = SK[i]; if (on[k] && !r[k]) return (i === 3 ? "The chain" : SNAME[k].charAt(0).toUpperCase() + SNAME[k].slice(1)) + " is on but can’t run: the stage before it isn’t running."; }
  if (r.kr && !on.ch) return "Running up to the Krebs cycle. The chain is off, so the loaded carriers aren’t unloaded and no O₂ is used.";
  return "Running: " + runningText(R).toLowerCase() + ".";
}

// ---------- @component S3 energyLedger — per-stage table, tallies (from SBI4U 08) and energy bars (from SBI4U 09's carbonBars) ----------
function tally(n, col, cap, extra){
  cap = cap || 40; var h = "";
  for (var i = 0; i < Math.min(n, cap); i++) h += "<i></i>";
  return '<span class="cr-tal" style="--c:var(' + col + ')" aria-hidden="true">' + h + (extra || "") + "</span>";
}
function ledgerHTML(R, cur){
  var r = R.run, t = totals(R, cur), D = "—";
  var rows = [
    ["gly", "Glycolysis", "2 (net)", "2", "0", "0", "0"],
    ["po", "Pyruvate oxidation", "0", "2", "0", "2", "0"],
    ["kr", "Krebs cycle (2 turns)", "2", "6", "2", "4", "0"],
    ["ch", "Chain + chemiosmosis", cur ? "≈ 26–28" : "32", "unloads all", "unloads all", "0", "6"]];
  var h = '<div class="tbl-wrap cr-ltw"><table class="cr-lt"><caption class="vh">Energy ledger per glucose</caption><thead><tr><th scope="col">Stage</th><th scope="col">ATP made directly</th><th scope="col">NADH</th><th scope="col">FADH₂</th><th scope="col">CO₂</th><th scope="col">O₂ used</th></tr></thead><tbody>' +
    rows.map(function(x){ var on = r[x[0]]; return '<tr class="' + (on ? "on" : "off") + '"><th scope="row">' + x[1] + (on ? "" : ' <span class="vh">(not running)</span>') + "</th>" + x.slice(2).map(function(c){ return "<td>" + (on ? c : D) + "</td>"; }).join("") + "</tr>"; }).join("") +
    '<tr class="tot"><th scope="row">Total</th><td>' + (t.ch ? (cur ? "≈ 30–32" : "36") : t.atpD) + "</td><td>" + t.nadh + "</td><td>" + t.fadh + "</td><td>" + t.co2 + "</td><td>" + t.o2 + "</td></tr></tbody></table></div>";
  h += '<div class="cr-tals">' +
    '<div class="cr-tr"><span class="cr-tn">ATP</span>' + tally(t.lo, "--bio-atp", 40) + "<b>" + (t.ch && cur ? "30–32" : t.lo) + "</b></div>" +
    '<div class="cr-tr"><span class="cr-tn">NADH</span>' + tally(t.nadh, "--bio-nadh") + "<b>" + t.nadh + "</b></div>" +
    '<div class="cr-tr"><span class="cr-tn">FADH₂</span>' + tally(t.fadh, "--bio-fadh") + "<b>" + t.fadh + "</b></div>" +
    '<div class="cr-tr"><span class="cr-tn">CO₂</span>' + tally(t.co2, "--bio-carbon") + "<b>" + t.co2 + "</b></div>" +
    '<div class="cr-tr"><span class="cr-tn">O₂ used</span>' + tally(t.o2, "--bio-o2") + "<b>" + t.o2 + "</b></div></div>";
  var E = energy(R, t, cur);
  if (E.bars) h += '<div class="cr-eb" role="group" aria-label="Where the energy went"><p class="cr-ebh">Where the energy of one glucose went</p>' + E.bars.map(function(b){
    return '<div class="cr-br"><span class="cr-bl">' + b[0] + '</span><span class="cr-bt"><i class="' + (b[0] === "Not released yet" ? "cr-bo" : "cr-bs") + '" style="width:' + f1(clamp(b[1], 0, 100)) + "%;--c:var(" + b[2] + ')"></i></span><b>' + pc(b[1]) + "</b></div>";
  }).join("") + "</div>";
  return h + '<p class="tiny muted cr-lnote">One mark per molecule' + (cur && t.ch ? " (30 ATP marks: the low end of the current estimate)" : "") + ". Carriers are counted when they are loaded, not net.</p>";
}

// ---------- Explore: Respiration map ----------
var EXF = null;
function explore(host, api){
  var S = api.S, C = api.content, ZN;
  if (!S.mode) S.mode = "a";
  S.a = S.a || { place:{}, ok:{} };
  S.b = S.b || { atom:"c", label:false, step:0, seen:{}, po:"", kr:"" };
  S.c = S.c || { on:{ gly:true, po:true, kr:true, ch:true }, o2:true, cur:false };
  var sel = null, afb = null, busy = false, anim = null, pend = null, playing = false, tr = null, casc = null, hot = null, wheelRot = 0, synRot = 0, readSig = "", ledSig = "", liveSig = "";
  host.innerHTML = '<div class="pg cr-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="cr-stage" id="cr-stage"></div><p class="cr-cap" id="cr-cap"></p><p class="vh" id="cr-live" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div class="cr-row" id="cr-mode"></div>' +
      '<div class="cr-panel" id="cr-pa"><p class="tiny cr-how">Tap a stage card, then tap the zone on the map where it happens. Then press <strong>Check placement</strong>.</p>' +
        '<div class="cr-cards" id="cr-cards" role="group" aria-label="Stage cards"></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="cr-chk" data-k="crchk">Check placement</button><button type="button" class="btn ghost sm" id="cr-clr" data-k="crclr">Clear the map</button></div><div id="cr-afb" aria-live="polite"></div></div>' +
      '<div class="cr-panel" id="cr-pb"><div class="cr-row" id="cr-atom"></div>' +
        '<label class="cr-chk"><input type="checkbox" id="cr-label"> <span>Label it: show the isotope tracer</span></label>' +
        '<div class="player cr-player"><button type="button" class="btn ghost sm" id="cr-back" data-k="crback">Back</button><button type="button" class="btn primary sm" id="cr-step" data-k="crstep">Step</button>' + (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" id="cr-play" data-k="crplay">Play</button>') + '<span class="ctr" id="cr-ctr" aria-live="polite"></span></div>' +
        '<fieldset class="cr-cnt"><legend>Count the carbons (challenge 2)</legend>' +
          '<div class="numrow"><label for="cr-npo">Carbons that leave as CO₂ in pyruvate oxidation:</label><input class="numin" id="cr-npo" data-cnt="po" type="text" inputmode="numeric" autocomplete="off"></div>' +
          '<div class="numrow"><label for="cr-nkr">Carbons that leave as CO₂ in the Krebs cycle:</label><input class="numin" id="cr-nkr" data-cnt="kr" type="text" inputmode="numeric" autocomplete="off"></div></fieldset></div>' +
      '<div class="cr-panel" id="cr-pc"><fieldset class="cr-sws"><legend>Stages</legend>' + SK.map(function(k){ var s = byId(C.stages, k); return '<label class="cr-sw" id="cr-sw-' + k + '"><input type="checkbox" data-st="' + k + '"> <span class="cr-swn">' + (k === "ch" ? "Chain" : s.t) + '</span> <span class="cr-swst" id="cr-ss-' + k + '"></span></label>'; }).join("") + "</fieldset>" +
        '<div class="cr-row" id="cr-o2"></div><div class="cr-row" id="cr-atpv"></div></div>' +
      '<p class="tiny muted cr-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div>" +
    '<div class="pg-read"><dl class="read" id="cr-read"></dl><details class="cr-led" id="cr-led" open><summary><span id="cr-ls"></span></summary><div id="cr-ledb"></div><p class="tiny muted">' + C.waterNote + "</p></details></div></div>";

  // ---- the map (S1): level a = drop zones; levels b and c = stations ----
  ZN = {
    nuc:{ box:[10, 39, 104, 54] }, cyto:{ box:[12, 226, 104, 62] },
    om:{ box:[292, 10, 120, 52], lead:[[352, 62], [352, outTop(352)]] },
    ims:{ box:[150, 10, 132, 52], lead:[[216, 62], [216, (outTop(216) + inTop(216)) / 2]] },
    matrix:{ box:[196, 148, 140, 72] },
    im:{ box:[140, 298, 150, 44], lead:[[215, 298], [195, inBot(195)]] }
  };
  var ZORD = ["cyto", "om", "ims", "im", "matrix", "nuc"];
  var dx = diagramExplorer($("#cr-stage", host), { level:S.mode === "a" ? "a" : "b", onTap:zoneTap, levels:[
    { id:"a", name:"Drop zones", vb:[VW, VH], draw:cellSVG, aria:function(){ return "Cell map with six drop zones: cytosol, outer membrane, intermembrane space, inner membrane (cristae), matrix and nucleus."; },
      hotspots:ZORD.map(function(id){ return { id:id, label:zoneName(id), zones:[ZN[id].box] }; }) },
    { id:"b", name:"Respiration map", vb:[VW, VH], draw:function(){ return cellSVG() + '<g class="cr-st"></g>'; }, aria:function(){ return "Respiration map"; }, hotspots:[] }] });
  function zoneName(id){ return byId(C.zones, id).t; }
  function stageName(id){ return byId(C.stages, id).t; }

  // ---- controls ----
  var modeR = radios($("#cr-mode", host), { label:"Mode", options:[{ id:"a", t:"Place the stages" }, { id:"b", t:"Follow the atoms" }, { id:"c", t:"Stage switches" }], value:S.mode,
    onChange:function(m){ stop(); S.mode = m; sel = null; afb = null; changed(); announce(); } });
  var atomR = radios($("#cr-atom", host), { label:"Atom", aria:"Atom to follow", cls:"chips", options:C.atoms.map(function(a){ return { id:a.id, t:a.t }; }), value:S.b.atom,
    onChange:function(v){ stop(); S.b.atom = v; changed(); announce(); } });
  var o2R = radios($("#cr-o2", host), { label:"O₂ supply", options:[{ id:"on", t:"On" }, { id:"off", t:"Off" }], value:S.c.o2 ? "on" : "off",
    onChange:function(v){ stop(); S.c.o2 = v === "on"; changed(); announce(); } });
  var atpR = radios($("#cr-atpv", host), { label:"ATP values", options:[{ id:"text", t:"Textbook" }, { id:"cur", t:"Current estimate" }], value:S.c.cur ? "cur" : "text",
    onChange:function(v){ stop(); S.c.cur = v === "cur"; changed(); announce(); } });
  var labIn = $("#cr-label", host);
  labIn.addEventListener("change", function(){ stop(); S.b.label = labIn.checked; changed(); announce(); });
  $$("[data-st]", host).forEach(function(inp){ inp.addEventListener("change", function(){ stop(); var was = depthOf(runOf(S.c.on, S.c.o2).run); S.c.on[inp.dataset.st] = inp.checked; var now = depthOf(runOf(S.c.on, S.c.o2).run); if (now === was + 1) { api.save(); animDepth(was, now, function(){ announce(); }); } else { changed(); announce(); } }); });
  $$("[data-cnt]", host).forEach(function(inp){ inp.value = S.b[inp.dataset.cnt] || ""; inp.addEventListener("input", function(){ S.b[inp.dataset.cnt] = inp.value; api.save(); MV.changed(); }); });
  $("#cr-back", host).addEventListener("click", function(){ if (busy) return; stopPlay(); if (S.b.step > 0) { S.b.step--; changed(); announce(); } });
  $("#cr-step", host).addEventListener("click", function(){ if (busy) return; stopPlay(); stepTo(S.b.step + 1, null); });
  var playB = $("#cr-play", host);
  if (playB) playB.addEventListener("click", function(){ if (playing) { stopPlay(); sync(); return; } if (busy) return; playing = true; if (S.b.step >= 4) { S.b.step = 0; paintAll(); } playNext(); });
  $("#cr-cards", host).addEventListener("click", function(e){ var b = e.target.closest("[data-card]"); if (!b || busy) return; sel = sel === b.dataset.card ? null : b.dataset.card; afb = sel ? { k:"", h:"Selected: <strong>" + stageName(sel) + "</strong>. Now tap the zone where it happens." } : null; paintA(); });
  $("#cr-chk", host).addEventListener("click", function(){ if (busy) return; checkPlacement(); });
  $("#cr-clr", host).addEventListener("click", function(){ if (busy) return; S.a.place = {}; S.a.ok = {}; sel = null; afb = { k:"", h:"The map is clear. Tap a card to start again." }; changed(); });

  // ---- Mode A: place the stages ----
  function zoneTap(id){
    if (S.mode !== "a" || busy) return;
    if (!sel) { afb = { k:"", h:"Tap a stage card first, then tap the zone where it happens." }; paintA(); return; }
    S.a.place[sel] = id; delete S.a.ok[sel];
    afb = { k:"", h:"<strong>" + stageName(sel) + "</strong> placed in the " + zoneName(id) + "." }; sel = null;
    changed(); announce();
  }
  var RIGHT = { gly:"cyto", po:"matrix", kr:"matrix", ch:"im" };
  function checkPlacement(){
    var n = SK.filter(function(k){ return S.a.place[k]; }).length, good = 0;
    S.a.ok = {}; SK.forEach(function(k){ if (S.a.place[k] && S.a.place[k] === RIGHT[k]) { S.a.ok[k] = true; good++; } });
    if (good === 4) afb = { k:"good", h:"<strong>✓ All four are in the right place.</strong> Glycolysis runs in the cytosol; the other three stages run in the mitochondrion." };
    else afb = { k:"bad", h:"<strong>" + good + " of 4 in the right place.</strong> " + (n < 4 ? "Place all four cards. " : "") + "Correct placements glow; move the others and check again." };
    changed(); MV.focusFb($("#cr-afb", host));
  }
  function zonesSVG(flyK, flyXY){
    var h = "", occ = {};
    SK.forEach(function(k){ var z = S.a.place[k]; if (z && k !== flyK) (occ[z] = occ[z] || []).push(k); });
    ZORD.forEach(function(id){
      var Z = ZN[id], b = Z.box, list = occ[id] || [], hh = Math.max(b[3], 24 + list.length * 17);
      if (Z.lead) h += sv("line", { x1:Z.lead[0][0], y1:Z.lead[0][1], x2:Z.lead[1][0], y2:Z.lead[1][1], "class":"cr-lead" }) + sv("circle", { cx:Z.lead[1][0], cy:Z.lead[1][1], r:3, "class":"cr-leadd" });
      h += sv("rect", { x:b[0], y:b[1], width:b[2], height:hh, rx:8, "class":"cr-zone" + (sel ? " ready" : "") });
      h += txt(b[0] + 8, b[1] + 15, zoneName(id), "cr-zn");
      list.forEach(function(k, i){ var ok = S.a.ok[k], y = b[1] + 22 + i * 17; h += sv("rect", { x:b[0] + 6, y:y, width:b[2] - 12, height:15, rx:7.5, "class":"cr-pill" + (ok ? " ok" : "") + (sel === k ? " sel" : "") }) + txt(b[0] + b[2] / 2, y + 11, (ok ? "✓ " : "") + byId(C.stages, k).short, "cr-pt", "middle"); });
    });
    if (flyK) { var w = 108; h += sv("rect", { x:flyXY[0] - w / 2, y:flyXY[1] - 7.5, width:w, height:15, rx:7.5, "class":"cr-pill sel" }) + txt(flyXY[0], flyXY[1] + 3.5, byId(C.stages, flyK).short, "cr-pt", "middle"); }
    return h;
  }
  function paintA(){
    if (S.mode !== "a") return;
    var ov = dx.over(); if (ov) ov.innerHTML = zonesSVG();
    dx.labels(function(id){ var list = SK.filter(function(k){ return S.a.place[k] === id; }).map(stageName); return zoneName(id) + (list.length ? " (holds: " + list.join(", ") + ")" : " (empty)") + (sel ? ". Press to place " + stageName(sel) + " here." : ""); });
    MV.keepFocus($("#cr-cards", host), function(){
      $("#cr-cards", host).innerHTML = SK.map(function(k){ var z = S.a.place[k], ok = S.a.ok[k];
        return '<button type="button" class="cr-card' + (ok ? " ok" : "") + '" data-card="' + k + '" data-k="crc' + k + '" aria-pressed="' + (sel === k) + '"' + (busy ? " disabled" : "") + '><span class="cr-cn">' + (ok ? '<span aria-hidden="true">✓ </span>' : "") + stageName(k) + '</span><span class="cr-cw">' + (z ? "→ " + zoneName(z) : "not placed yet") + "</span></button>"; }).join("");
    });
    $("#cr-afb", host).innerHTML = afb ? '<div class="fb' + (afb.k ? " " + afb.k : "") + '" role="status"><p>' + afb.h + "</p></div>" : "";
  }

  // ---- Mode B: follow the atoms (S2 stepper) ----
  var FN = ["Start: glucose and O₂", "Step 1: glycolysis", "Step 2: pyruvate oxidation", "Step 3: Krebs cycle", "Step 4: electron transport and chemiosmosis"];
  var HOT = [null, "gly", "po", "kr", "ch"];
  function atomOf(){ return byId(C.atoms, S.b.atom); }
  function stepTo(n, done){
    n = clamp(n, 0, 4); if (n === S.b.step) { if (done) done(); return; }
    var from = S.b.step; S.b.step = n; if (n === 4) S.b.seen[S.b.atom] = true;
    api.save(); busy = true; tr = { a:from, b:n, k:0 }; sync(); paintRead(); paintLedger(); paintCap();
    anim = MV.tween({ dur:1300, ease:lin, step:function(k){ tr.k = k; if (from === 2 && n === 3) wheelRot = k * 360; if (from === 3 && n === 4) synRot = k * 720; frame(); }, done:function(){
      anim = null; tr = null; busy = false; paintAll(); announce(); MV.changed(); if (done) done(); } });
  }
  function playNext(){ if (!playing) return; if (S.b.step >= 4) { stopPlay(); sync(); return; } stepTo(S.b.step + 1, function(){ if (playing) MV.wait(350, playNext); }); }
  function stopPlay(){ playing = false; }

  // ---- Mode C: switches ----
  function curRun(){
    var R = runOf(S.c.on, S.c.o2);
    if (casc === 1) { R = runOf(S.c.on, true); R.run.ch = false; R.st.ch = "noO2"; R.o2 = true; R.casc = 1; }
    else if (casc === 2) { R = runOf(S.c.on, true); R.run.po = R.run.kr = R.run.ch = false; R.st.ch = "noO2"; R.st.po = R.st.kr = "noNAD"; R.casc = 2; }
    return R;
  }
  function animDepth(a, b, done){
    busy = true; tr = { a:a, b:b, k:0, c:true }; paintAll();
    anim = MV.tween({ dur:1100, ease:lin, step:function(k){ tr.k = k; if (a === 2 && b === 3) wheelRot = k * 360; if (a === 3 && b === 4) synRot = k * 720; frame(); }, done:function(){ anim = null; tr = null; busy = false; paintAll(); MV.changed(); if (done) done(); } });
  }

  // ---- shared painting ----
  function stop(){
    playing = false;
    if (anim) { anim(); anim = null; }
    tr = null; casc = null; busy = false;
    if (pend) { var d = pend; pend = null; d(); }
  }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function sceneFrames(){ return frames(S.c.cur); }
  function frame(){
    var lv = S.mode === "a" ? "a" : "b";
    dx.setLevel(lv);
    var ov = dx.over(); if (!ov) return;
    if (lv === "a") { if (!tr) ov.innerHTML = zonesSVG(); return; }
    var F = sceneFrames(), h = "", o = {};
    if (S.mode === "b") {
      var at = atomOf(), tag = S.b.label ? at.iso : "", fa = tr ? tr.a : S.b.step, fb = tr ? tr.b : S.b.step, k = tr ? tr.k : 1;
      o.hot = HOT[k < 0.5 ? fa : fb] || null;
      h += titlesSVG(o) + wheelSVG(wheelRot) + chainSVG(synRot);
      h += transSVG(F[fa], F[fb], k, marksFor(at.id, fa, F[fa], tag), marksFor(at.id, fb, F[fb], tag));
      h += chainFlowSVG(fb === 4 ? (fa === 4 ? 1 : clamp((k - 0.5) * 2, 0, 1)) : fa === 4 ? 1 - k : 0);
    } else {
      var R = curRun(), d = depthOf(R.run), dim = {};
      SK.forEach(function(s){ if (!R.run[s]) dim[s] = true; });
      h += titlesSVG({ st:R.st, dim:dim, hot:hot }) + '<g class="' + (dim.kr ? "cr-dim" : "") + '">' + wheelSVG(wheelRot) + '</g><g class="' + (dim.ch ? "cr-dim" : "") + '">' + chainSVG(synRot) + "</g>";
      var noO2 = function(L){ return R.o2 && !R.casc ? L : L.filter(function(x){ return x.k !== "o2"; }); };
      if (tr && tr.c) h += transSVG(noO2(F[tr.a]), noO2(F[tr.b]), tr.k, {}, {}) + chainFlowSVG(tr.b === 4 ? clamp((tr.k - 0.5) * 2, 0, 1) : 0);
      else h += frameSVG(noO2(F[d])) + chainFlowSVG(d === 4 ? 1 : 0);
    }
    ov.innerHTML = h;
  }
  function capText(){
    if (S.mode === "a") return "The map shows a cell with its nucleus and one mitochondrion: outer membrane, intermembrane space, inner membrane folded into cristae, and the matrix inside.";
    if (S.mode === "b") {
      var at = atomOf(), s = S.b.step, lab = S.b.label ? " (" + at.iso + " label)" : "";
      var base = ["Glucose waits in the cytosol; O₂ is nearby.", "Glycolysis split glucose into 2 pyruvate, making 2 ATP (net) and loading 2 NADH.", "Each pyruvate entered the matrix and lost a CO₂, becoming acetyl-CoA; 2 more NADH loaded.", "Two turns of the Krebs cycle released 4 CO₂ and loaded 6 NADH and 2 FADH₂; 2 ATP made.", "The carriers unloaded at the chain: electrons (violet) passed along it, H⁺ (magenta) was pumped, O₂ accepted the electrons and became water, and ATP synthase made most of the ATP."][s];
      return base + " Tracked: " + MV.plain(at.t).charAt(0).toLowerCase() + MV.plain(at.t).slice(1) + lab + ": " + whereText(at.id, s) + "." + (s === 4 && (at.id === "o2" || at.id === "h") ? " " + C.waterNote : "");
    }
    var R = curRun(), t = totals(R, S.c.cur);
    if (casc === 1) return "O₂ is off: nothing accepts the electrons at the end of the chain, so the chain stops.";
    if (casc === 2) return "The chain no longer gives back NAD⁺, so pyruvate oxidation and the Krebs cycle stop too.";
    return statusText(R, S.c.on) + (R.run.gly ? " Per glucose: " + t.co2 + " CO₂, " + t.nadh + " NADH and " + t.fadh + " FADH₂ loaded, " + t.o2 + " O₂ used." : "");
  }
  function paintCap(){ $("#cr-cap", host).textContent = capText(); }
  function paintRead(){
    var rows;
    if (S.mode === "a") {
      var n = SK.filter(function(k){ return S.a.place[k]; }).length, g = SK.filter(function(k){ return S.a.ok[k]; }).length, chk = Object.keys(S.a.ok).length || afb && afb.k === "bad";
      rows = [["Cards placed", n + " of 4"], ["Placement check", chk ? g + " of 4 in the right place" : '<span class="muted">not checked yet</span>'], ["Status", sel ? "Card selected: " + stageName(sel) + ". Tap a zone." : "Tap a card, then a zone."]];
    } else if (S.mode === "b") {
      var at = atomOf(), s = S.b.step; if (s === 4 && !S.b.seen[at.id]) { S.b.seen[at.id] = true; api.save(); }
      var R = runOf({ gly:s >= 1, po:s >= 2, kr:s >= 3, ch:s >= 4 }, true), t = totals(R, S.c.cur);
      rows = [["Step", FN[s]], ["Tracking", at.t + (S.b.label ? " (" + at.iso + " label)" : "")], ["Where the labelled atoms are now", whereText(at.id, s)],
        ["Labelled atom ends up in", S.b.seen[at.id] ? at.short + " → " + at.end : '<span class="muted">step to the end to find out</span>'],
        ["CO₂ released so far", t.co2], ["NADH loaded / FADH₂ loaded", t.nadh + " / " + t.fadh], ["O₂ used", t.o2]];
    } else {
      var Rc = curRun(), tc = totals(Rc, S.c.cur), E = energy(Rc, tc, S.c.cur);
      rows = [["Stages running", runningText(Rc)], ["CO₂ released", tc.co2], ["NADH loaded / FADH₂ loaded", tc.nadh + " / " + tc.fadh], ["O₂ used", tc.o2], ["ATP per glucose", atpText(tc, S.c.cur)],
        ["Where the energy went", E.text + (E.calc ? ' <span class="tiny muted">(' + E.calc + ")</span>" : "")], ["Status", Rc.casc ? capText() : statusText(Rc, S.c.on)]];
    }
    var sig = JSON.stringify(rows) + hot; if (sig === readSig) return; readSig = sig;
    $("#cr-read", host).innerHTML = MV.readoutHTML(rows);
    if (hot === "co2" && S.mode === "c") { var rr = $$("#cr-read > div", host); if (rr[1]) rr[1].classList.add("cr-hotr"); }
  }
  function paintLedger(){
    var led = $("#cr-led", host); led.hidden = S.mode === "a"; if (S.mode === "a") return;
    var R = S.mode === "b" ? runOf({ gly:S.b.step >= 1, po:S.b.step >= 2, kr:S.b.step >= 3, ch:S.b.step >= 4 }, true) : curRun(), t = totals(R, S.c.cur);
    $("#cr-ls", host).textContent = "Energy ledger (per glucose): " + (t.ch ? (S.c.cur ? "≈ 30–32" : "36") : t.atpD) + " ATP · " + t.nadh + " NADH · " + t.fadh + " FADH₂ · " + t.co2 + " CO₂";
    var body = ledgerHTML(R, S.c.cur); if (body === ledSig) return; ledSig = body;
    $("#cr-ledb", host).innerHTML = body;
  }
  function describe(){
    if (S.mode === "a") return "Place the stages. " + SK.map(function(k){ return stageName(k) + ": " + (S.a.place[k] ? zoneName(S.a.place[k]) : "not placed"); }).join("; ") + ".";
    if (S.mode === "b") return "Follow the atoms. " + FN[S.b.step] + ". " + capText();
    return "Stage switches. " + runningText(curRun()) + " running. " + capText();
  }
  function announce(){ var d = describe(); dx.setAria("Respiration map. " + d); if (d !== liveSig) { liveSig = d; $("#cr-live", host).textContent = d; } }
  function sync(){
    modeR.set(S.mode); atomR.set(S.b.atom); o2R.set(S.c.o2 ? "on" : "off"); atpR.set(S.c.cur ? "cur" : "text");
    modeR.disable(busy); atomR.disable(busy); o2R.disable(busy); atpR.disable(busy);
    $("#cr-pa", host).hidden = S.mode !== "a"; $("#cr-pb", host).hidden = S.mode !== "b"; $("#cr-pc", host).hidden = S.mode !== "c";
    labIn.checked = !!S.b.label; labIn.disabled = busy;
    $("#cr-back", host).disabled = busy || S.b.step <= 0; $("#cr-step", host).disabled = busy || S.b.step >= 4;
    if (playB) { playB.textContent = playing ? "Pause" : S.b.step >= 4 ? "Replay" : "Play"; playB.disabled = busy && !playing; }
    $("#cr-ctr", host).textContent = FN[S.b.step];
    $("#cr-chk", host).disabled = busy; $("#cr-clr", host).disabled = busy;
    var R = curRun();
    SK.forEach(function(k){ var inp = $('[data-st="' + k + '"]', host); inp.checked = !!S.c.on[k]; inp.disabled = busy; $("#cr-sw-" + k, host).classList.toggle("stop", !R.run[k] && !!S.c.on[k]); var ss = $("#cr-ss-" + k, host); ss.textContent = ST_TXT[R.st[k]]; ss.className = "cr-swst s-" + R.st[k]; });
  }
  function paintAll(){ sync(); frame(); paintA(); paintCap(); paintRead(); paintLedger(); }

  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    if (id === "tc1") {
      var p = S.a.place, n = SK.filter(function(k){ return p[k]; }).length;
      if (p.gly === "cyto" && p.po === "matrix" && p.kr === "matrix" && p.ch === "im") return { ok:true };
      if (p.kr === "cyto") return { ok:false, msg:"The Krebs cycle is inside the mitochondrion, in the matrix." };
      if (p.ch === "matrix") return { ok:false, msg:"The chain’s proteins sit <em>in</em> the inner membrane." };
      if (p.po === "cyto") return { ok:false, msg:"Pyruvate is carried into the matrix first." };
      if (n < 4) return { ok:false, msg:"Place all four stage cards on the map first (mode: Place the stages)." };
      var g = SK.filter(function(k){ return p[k] === RIGHT[k]; }).length;
      return { ok:false, msg:g + " of 4 are in the right place. Check the others." };
    }
    if (id === "tc2") {
      var a = parseVal(S.b.po), b = parseVal(S.b.kr);
      if (a == null || b == null) return { ok:false, msg:"Type both numbers in the Follow the atoms panel (Count the carbons)." };
      if (a === 2 && b === 4) return { ok:true };
      if (a === 6 && b === 0) return { ok:false, msg:"Pyruvate oxidation removes one carbon from each pyruvate: 2 total." };
      if (a === 3 && b === 3) return { ok:false, msg:"Two pyruvate oxidations release 2; the Krebs cycle releases 2 per turn × 2 turns." };
      if (a + b !== 6) return { ok:false, msg:"All 6 of glucose’s carbons leave as CO₂, so your two numbers should add up to 6." };
      return { ok:false, msg:"Each pyruvate (3C) becomes acetyl (2C) + CO₂." };
    }
    if (id === "tc3") {
      var R = runOf(S.c.on, S.c.o2), t = totals(R, S.c.cur);
      if (t.nadh === 4 && t.co2 === 2) return { ok:true };
      if (SK.every(function(k){ return R.run[k]; })) return { ok:false, msg:"10 NADH and 6 CO₂." };
      if (R.run.kr) return { ok:false, msg:"The Krebs cycle adds 6 NADH and 4 CO₂." };
      if (!S.c.o2 && S.c.on.po) return { ok:false, msg:"With O₂ off, pyruvate oxidation stops because no NAD⁺ comes back: " + t.nadh + " NADH and 0 CO₂." };
      if (R.run.gly && !R.run.po) return { ok:false, msg:"2 NADH and 0 CO₂." };
      return { ok:false, msg:"That gives " + t.nadh + " NADH and " + t.co2 + " CO₂." };
    }
    return { ok:false };
  }

  EXF = { show:function(v){ if (v) paintAll(); } };
  paintAll(); announce();
  return {
    predict:{
      start:function(p){
        stop(); var s = p.start; hot = null;
        if (s.mode === "a") { S.mode = "a"; delete S.a.place.gly; delete S.a.ok.gly; sel = null; afb = null; }
        else if (s.mode === "b") { S.mode = "b"; S.b.atom = s.atom; S.b.label = !!s.label; S.b.step = 0; }
        else { S.mode = "c"; S.c.o2 = s.o2; S.c.on = {}; s.on.forEach(function(k){ S.c.on[k] = true; }); }
        changed(); announce();
      },
      run:function(p, done){
        pend = done; busy = true; sync();
        function fin(){ busy = false; var d = pend; pend = null; paintAll(); announce(); MV.changed(); if (d) d(); }
        if (p.start.mode === "a") {
          var b = ZN.cyto.box, to = [b[0] + b[2] / 2, b[1] + 29], fr = [210, 8];
          anim = MV.tween({ dur:1400, step:function(k){ var ov = dx.over(); if (ov) ov.innerHTML = zonesSVG("gly", [lerp(fr[0], to[0], k), lerp(fr[1], to[1], k)]); }, done:function(){
            anim = null; S.a.place.gly = "cyto"; S.a.ok.gly = true; afb = { k:"good", h:"<strong>✓ Glycolysis: cytosol.</strong>" }; api.save(); MV.wait(300, fin); } });
          return;
        }
        if (p.start.mode === "b") { busy = false; playing = true; (function nx(){ if (S.b.step >= 4) { playing = false; MV.wait(300, fin); return; } stepTo(S.b.step + 1, function(){ busy = true; MV.wait(250, nx); }); })(); return; }
        if (p.id === "p3") {
          hot = "co2"; var seq = ["gly", "po", "kr"];
          (function nx(){ if (!seq.length) { MV.wait(300, fin); return; } var k = seq.shift(), was = depthOf(runOf(S.c.on, S.c.o2).run); S.c.on[k] = true; api.save();
            animDepth(was, was + 1, function(){ busy = true; sync(); MV.wait(500, nx); }); })();
          return;
        }
        // p4: O₂ off, then the stages stop one after another
        S.c.o2 = false; casc = 1; api.save(); paintAll(); MV.banner("", "Chain stopped: no O₂ to accept the electrons.");
        anim = MV.tween({ dur:1300, ease:lin, step:function(){}, done:function(){
          casc = 2; paintAll(); MV.banner("", "No NAD⁺ comes back, so pyruvate oxidation and the Krebs cycle stop.");
          anim = MV.tween({ dur:1300, ease:lin, step:function(){}, done:function(){ anim = null; casc = null; MV.banner("", "Glycolysis carries on only if the cell ferments (module 20)."); paintAll(); MV.wait(900, fin); } });
        } });
      }
    },
    challenge:chal
  };
}

// ---------- hero: the storyboard on the map (glucose in → glycolysis → pyruvate oxidation → Krebs → chain → total) ----------
function hero(f){
  var box = $("#cr-hero"); if (!box) return;
  var cap = f && f.cap, F = frames(false), ENTER = [{ k:"glu", x:-14, y:152, lab:"glucose" }, F[0][1]];
  box.innerHTML = '<svg viewBox="0 0 ' + VW + " " + VH + '" class="cr-svg" aria-hidden="true" focusable="false">' + cellSVG() + '<g class="cr-dyn"></g></svg>';
  var dyn = $(".cr-dyn", box);
  var CAPS = ["A glucose molecule enters the cytosol.", "Glycolysis splits it into two pyruvates: 2 ATP.", "Each pyruvate enters the matrix and loses a CO₂.",
    "Two acetyl groups turn the Krebs cycle: 4 more CO₂.", "NADH and FADH₂ unload at the inner membrane; O₂ becomes water and ATP synthase makes ATP.", "≈ 36 ATP (textbook) · ≈ 30–32 (current estimate)"];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  function total(){ return sv("rect", { x:232, y:294, width:178, height:44, rx:10, "class":"cr-totb" }) + txt(321, 312, "≈ 36 ATP (textbook)", "cr-tot", "middle") + txt(321, 329, "≈ 30–32 (current estimate)", "cr-tot", "middle"); }
  function draw(A, B, k, hot, wr, sr, flow, end){ dyn.innerHTML = (end ? total() : "") + titlesSVG({ hot:hot, noSyn:end }) + wheelSVG(wr) + chainSVG(sr) + transSVG(A, B, k, {}, {}) + chainFlowSVG(flow); }
  if (MV.reduceMotion) { draw(F[4], F[4], 1, null, 0, 0, 1, true); setCap(5); return; }
  var seq = [[ENTER, F[0], null], [F[0], F[1], "gly"], [F[1], F[2], "po"], [F[2], F[3], "kr"], [F[3], F[4], "ch"]], i = 0;
  draw(ENTER, ENTER, 1, null, 0, 0, 0, false);
  function next(){
    if (i >= seq.length) { draw(F[4], F[4], 1, null, 0, 0, 1, true); setCap(5); return; }
    var s = seq[i], n = i; setCap(n); i++;
    MV.tween({ dur:1900, ease:lin, step:function(k){ draw(s[0], s[1], k, s[2], n === 3 ? k * 360 : 0, n === 4 ? k * 720 : 0, n === 4 ? clamp((k - 0.5) * 2, 0, 1) : 0, false); }, done:function(){ setTimeout(next, 700); } });
  }
  setTimeout(next, 600);
}

// ---------- Part 3: Photosynthesis and respiration as a cycle ----------
// Station 1: a 3-box Venn sorter (tap-to-sort variant); Station 2: the matter-and-energy loop; Station 3: the BTB jar
// experiment (@component jarTubes — four tappable tubes with a colour reveal; BTB colours are fixed hues, always named).
var P3F = null;
function tubeSVG(t, shown, cfg){
  // cfg: {contents:"elodea"|"snail"|"both"|"germ"|…, light:true|false|null, liquid:"btb-blue"|…|null}
  var h = "", liq = shown ? cfg.liquid : null;
  if (cfg.light === true) { h += sv("circle", { cx:50, cy:14, r:7, "class":"cr-sun" }); for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; h += sv("line", { x1:50 + 10 * Math.cos(a), y1:14 + 10 * Math.sin(a), x2:50 + 13 * Math.cos(a), y2:14 + 13 * Math.sin(a), "class":"cr-sunr" }); } }
  else if (cfg.light === false) h += sv("path", { d:"M54 6 A9 9 0 1 0 54 22 A7 7 0 1 1 54 6 Z", "class":"cr-moon" });
  h += sv("rect", { x:22, y:30, width:36, height:12, rx:3, "class":"cr-stop" });
  h += sv("path", { d:"M25 42 V146 A15 15 0 0 0 55 146 V42", "class":"cr-glass-b" });
  var lq = liq === "greenblue" ? "url(#cr-gb-" + t + ")" : liq ? "var(--" + liq + ")" : null;
  h += sv("path", { d:"M26.5 64 V146 A13.5 13.5 0 0 0 53.5 146 V64 Z", "class":liq ? "cr-liq" : "cr-liq0", style:lq ? "fill:" + lq : null });
  if (cfg.contents === "elodea" || cfg.contents === "both") h += sv("path", { d:"M36 156 C35 130 40 112 37 84 M37 140 l-7 -6 M37 126 l7 -6 M37 112 l-7 -6 M38 98 l7 -6", "class":"cr-elo" });
  if (cfg.contents === "snail" || cfg.contents === "both") h += sv("path", { d:"M33 155 h19 l3 -5", "class":"cr-snb" }) + sv("circle", { cx:45, cy:145, r:8, "class":"cr-sns" }) + sv("path", { d:"M45 145 m0 -4.5 a4.5 4.5 0 1 1 -4.5 4.5 a2.2 2.2 0 1 1 2.2 -2.2", "class":"cr-snl" });
  if (cfg.peas) for (var j = 0; j < 5; j++) h += sv("circle", { cx:32 + (j % 3) * 8, cy:150 - Math.floor(j / 3) * 7, r:3.4, "class":"cr-pea" + (cfg.peas === "beads" ? " bead" : cfg.peas === "dry" ? " dry" : cfg.peas === "boiled" ? " boiled" : "") });
  if (cfg.peas) h += sv("line", { x1:27, y1:136, x2:53, y2:136, "class":"cr-gauze" });
  h += sv("path", { d:"M25 42 V146 A15 15 0 0 0 55 146 V42", "class":"cr-glass" });
  var defs = liq === "greenblue" ? '<defs><linearGradient id="cr-gb-' + t + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--btb-green)"/><stop offset="1" style="stop-color:var(--btb-blue)"/></linearGradient></defs>' : "";
  return '<svg viewBox="0 0 80 168" class="cr-tube" aria-hidden="true" focusable="false">' + defs + h + "</svg>";
}
function part3(host, api){
  var P = api.content, S = api.S, V = P.venn, J = P.jar, L = P.loop;
  S.v = S.v || { placed:{}, tries:{} }; S.j = S.j || { rev:{} }; S.l = S.l || { view:"atoms" };
  var vsel = null, vmsg = null, cards = MV.shuffle(V.cards, "cr-venn"), playing = !MV.reduceMotion, vis = false, raf = 0, t0 = null, tNow = 0;
  host.innerHTML = '<div class="cr-p3">' +
    '<div class="cr-s"><h3>' + V.title + '</h3><p>' + V.how + '</p><div class="cr-vtray" id="cr-vtray" role="group" aria-label="Cards to sort"></div><div id="cr-vfb" aria-live="polite"></div>' +
      '<div class="cr-venn"><svg viewBox="0 0 400 200" class="cr-vsvg" aria-hidden="true" focusable="false">' + sv("circle", { cx:150, cy:100, r:92, "class":"cr-vc1" }) + sv("circle", { cx:250, cy:100, r:92, "class":"cr-vc2" }) + "</svg>" +
        '<div class="cr-vbtns" id="cr-vbtns"></div></div><div class="cr-vlists" id="cr-vlists"></div><div id="cr-vdone"></div></div>' +
    '<div class="cr-s part"><h3>' + L.title + "</h3><p>" + L.intro + '</p><div class="cr-row" id="cr-lv"></div><div class="cr-loop" id="cr-loop"></div>' +
      '<div class="q-actions">' + (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" id="cr-lpp" data-k="crlpp">Pause</button>') + '</div><p class="cr-lcap"><strong>' + L.caption + '</strong> <span id="cr-lcap2"></span></p></div>' +
    '<div class="cr-s part"><h3>' + J.title + "</h3><p>" + J.intro + '</p><div class="cr-key" aria-label="Bromothymol blue key"><span><i class="cr-swc" style="background:var(--btb-blue)"></i>blue: low CO₂</span><span><i class="cr-swc" style="background:var(--btb-green)"></i>green: in between</span><span><i class="cr-swc" style="background:var(--btb-yellow)"></i>yellow: high CO₂</span></div>' +
      '<div class="cr-tubes" id="cr-tubes" role="group" aria-label="Sealed tubes"></div><div id="cr-jexp" aria-live="polite"></div>' +
      '<details class="alg"><summary>Check it with data</summary><p class="tiny"><span class="bio-model">Model data</span> Colour of the BTB after 2 h.</p><div id="cr-jtbl"></div></details></div></div>';

  // ---- station 1: Venn sort ----
  var VB = [{ id:"ps", l:11, w:28 }, { id:"both", l:40.5, w:19 }, { id:"resp", l:61, w:28 }];
  function vpaint(){
    var left = cards.filter(function(c){ return !S.v.placed[c.id]; });
    MV.keepFocus($("#cr-vtray", host), function(){ $("#cr-vtray", host).innerHTML = left.length ? left.map(function(c){ return '<button type="button" class="tile txt" data-vc="' + c.id + '" data-k="vc' + c.id + '" aria-pressed="' + (vsel === c.id) + '">' + c.t + "</button>"; }).join("") : '<p class="sort-done">' + V.done + "</p>"; });
    MV.keepFocus($("#cr-vbtns", host), function(){ $("#cr-vbtns", host).innerHTML = VB.map(function(b){ var bx = byId(V.boxes, b.id), n = cards.filter(function(c){ return S.v.placed[c.id] === b.id; }).length;
      return '<button type="button" class="cr-vb' + (vsel ? " ready" : "") + '" data-vb="' + b.id + '" data-k="vb' + b.id + '" style="left:' + b.l + "%;width:" + b.w + '%"><strong>' + bx.t + '</strong><span class="tiny">' + n + " card" + (n === 1 ? "" : "s") + "</span></button>"; }).join(""); });
    $("#cr-vlists", host).innerHTML = V.boxes.map(function(b){ var list = cards.filter(function(c){ return S.v.placed[c.id] === b.id; }); return '<div class="cr-vl"><h4>' + b.t + "</h4><ul>" + (list.length ? list.map(function(c){ return '<li><span aria-hidden="true">✓ </span>' + c.t + "</li>"; }).join("") : '<li class="muted">none yet</li>') + "</ul></div>"; }).join("");
    $("#cr-vfb", host).innerHTML = vmsg ? '<div class="fb' + (vmsg.k ? " " + vmsg.k : "") + '" role="status"><p>' + vmsg.h + "</p></div>" : "";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.vc) { vsel = vsel === b.dataset.vc ? null : b.dataset.vc; vmsg = vsel ? { k:"", h:"Selected: <strong>" + byId(V.cards, vsel).t + "</strong>. Now tap Photosynthesis, Both or Respiration." } : null; vpaint(); return; }
    if (b.dataset.vb) {
      if (!vsel) { vmsg = { k:"", h:"Tap a card first, then tap where it belongs." }; vpaint(); return; }
      var c = byId(V.cards, vsel), ans = MV.ans(c);
      if (b.dataset.vb === ans) { S.v.placed[c.id] = ans; vmsg = { k:"good", h:"<strong>✓ " + c.t + ".</strong> " + c.why }; vsel = null; }
      else { S.v.tries[c.id] = (S.v.tries[c.id] || 0) + 1; vmsg = { k:"bad", h:"<strong>✗ Not there.</strong> " + ((c.wrong && c.wrong[b.dataset.vb]) || V.wrongDefault) + " Try another part." }; }
      api.save(); vpaint(); MV.focusFb($("#cr-vfb", host)); return;
    }
    if (b.dataset.tube) { S.j.rev[b.dataset.tube] = true; api.save(); jpaint(b.dataset.tube); return; }
    if (b.id === "cr-lpp") { playing = !playing; b.textContent = playing ? "Pause" : "Play"; lensure(); }
  });
  vpaint();

  // ---- station 2: the loop (atoms go round; energy enters as light and leaves as heat) ----
  var TOP = [[150, 96], [176, 50], [224, 50], [250, 96]], BOT = [[250, 144], [224, 190], [176, 190], [150, 144]];
  function bez(p, u){ var a = 1 - u; return [a * a * a * p[0][0] + 3 * a * a * u * p[1][0] + 3 * a * u * u * p[2][0] + u * u * u * p[3][0], a * a * a * p[0][1] + 3 * a * a * u * p[1][1] + 3 * a * u * u * p[2][1] + u * u * u * p[3][1]]; }
  function loopAt(u){ u = u - Math.floor(u); return u < 0.4 ? bez(TOP, u / 0.4) : u < 0.5 ? [lerp(250, 250, 0), lerp(96, 144, (u - 0.4) / 0.1)] : u < 0.9 ? bez(BOT, (u - 0.5) / 0.4) : [150, lerp(144, 96, (u - 0.9) / 0.1)]; }
  var EPATH = [[44, 8], [70, 92], [76, 96], [150, 96]].concat([0.25, 0.5, 0.75, 1].map(function(u){ return bez(TOP, u); })).concat([[310, 120], [342, 150], [352, 164], [356, 228]]);
  function wavyD(x1, y1, x2, y2){ var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, n = Math.round(L / 2), d = ""; for (var i = 0; i <= n; i++) { var s = L * i / n, o = 3 * Math.sin(s / 8 * 2 * Math.PI) * Math.min(1, (L - s) / 6); d += (i ? "L" : "M") + f1(x1 + ux * s - uy * o) + " " + f1(y1 + uy * s + ux * o); } return d + " " + head(x2, y2, ux, uy, 6); }
  function loopBase(){
    var h = sv("path", { d:"M150 96 C176 50 224 50 250 96", "class":"cr-larc" }) + sv("path", { d:head(250, 96, 0.5, 0.87, 7), "class":"cr-larch" });
    h += sv("path", { d:"M250 144 C224 190 176 190 150 144", "class":"cr-larc" }) + sv("path", { d:head(150, 144, -0.5, -0.87, 7), "class":"cr-larch" });
    h += sv("rect", { x:30, y:96, width:120, height:48, rx:10, "class":"cr-lbox" }) + txt(90, 117, "Photosynthesis", "cr-lbt", "middle") + txt(90, 132, "chloroplast", "cr-sub", "middle");
    h += sv("rect", { x:250, y:96, width:120, height:48, rx:10, "class":"cr-lbox" }) + txt(310, 117, "Respiration", "cr-lbt", "middle") + txt(310, 132, "mitochondria", "cr-sub", "middle");
    h += txt(200, 40, "C₆H₁₂O₆ + O₂", "cr-lmol", "middle") + txt(200, 214, "CO₂ + H₂O", "cr-lmol", "middle");
    h += '<g class="cr-len">' + sv("path", { d:wavyD(20, 6, 60, 88), "class":"cr-photon" }) + sv("path", { d:wavyD(44, 2, 82, 86), "class":"cr-photon" }) + txt(96, 24, "light energy in", "cr-elab") +
      sv("rect", { x:334, y:153, width:34, height:16, rx:8, fill:"var(--bio-atp)" }) + txt(351, 164.5, "ATP", "cr-tt", "middle") +
      sv("path", { d:wavyD(342, 174, 336, 228), "class":"cr-heat" }) + sv("path", { d:wavyD(362, 174, 372, 226), "class":"cr-heat" }) + txt(396, 238, "heat out", "cr-elab", "end") + "</g>";
    return h;
  }
  function loopDyn(t){
    var h = "", em = S.l.view === "energy";
    for (var i = 0; i < 8; i++) { var p = loopAt(t / 9 + i / 8), c = i % 2 === 0; h += '<g class="' + (em ? "cr-faint" : "") + '">' + (em ? "" : sv("circle", { cx:p[0], cy:p[1], r:8, "class":"cr-halo2" })) + sv("circle", { cx:p[0], cy:p[1], r:c ? 4.4 : 3.8, "class":c ? "cr-cfill" : "cr-ofill" }) + "</g>"; }
    for (var j = 0; j < 2; j++) { var u = (t / 7 + j / 2) % 1, q = polyAt(EPATH, u), a = u > 0.85 ? (1 - u) / 0.15 : u < 0.05 ? u / 0.05 : 1;
      h += grp(a * (em ? 1 : 0.35), (em ? sv("circle", { cx:q[0], cy:q[1], r:9, "class":"cr-halo2" }) : "") + sv("path", { d:"M" + f1(q[0]) + " " + f1(q[1] - 6) + " L" + f1(q[0] + 5) + " " + f1(q[1]) + " L" + f1(q[0]) + " " + f1(q[1] + 6) + " L" + f1(q[0] - 5) + " " + f1(q[1]) + " Z", "class":"cr-en" })); }
    return h;
  }
  var lsvg = null;
  function ldraw(t){
    if (!lsvg) { $("#cr-loop", host).innerHTML = '<svg viewBox="0 0 400 240" class="cr-svg" role="img" focusable="false">' + loopBase() + '<g class="cr-ldyn"></g></svg>'; lsvg = $("#cr-loop svg", host); }
    lsvg.setAttribute("aria-label", "A loop: photosynthesis (chloroplast) turns CO₂ + H₂O into C₆H₁₂O₆ + O₂; respiration (mitochondria) turns them back into CO₂ + H₂O. Brown carbon and blue oxygen atoms go round and round. Energy enters as light at the top, is carried in glucose, becomes ATP and leaves as heat at the bottom; it never loops back.");
    $(".cr-ldyn", lsvg).innerHTML = loopDyn(t);
  }
  var LC = { atoms:"Follow the atoms: the same carbon, hydrogen and oxygen atoms go round and round, between CO₂ + H₂O and glucose + O₂.", energy:"Follow the energy: it enters as sunlight, is stored in glucose, is captured as ATP, and leaves as heat. It never comes back round." };
  radios($("#cr-lv", host), { label:"Show", cls:"chips", options:[{ id:"atoms", t:"Follow the atoms" }, { id:"energy", t:"Follow the energy" }], value:S.l.view, onChange:function(v){ S.l.view = v; api.save(); $("#cr-lcap2", host).textContent = LC[v]; ldraw(tNow); } });
  $("#cr-lcap2", host).textContent = LC[S.l.view];
  function lloop(now){ raf = 0; if (!vis || !playing || MV.reduceMotion) return; if (t0 === null) t0 = now - tNow * 1000; tNow = (now - t0) / 1000; ldraw(tNow); raf = requestAnimationFrame(lloop); }
  function lensure(){ if (!playing) t0 = null; if (!raf && vis && playing && !MV.reduceMotion) raf = requestAnimationFrame(lloop); }
  ldraw(1.3);

  // ---- station 3: the jar experiment ----
  var CNT = { t1:"elodea", t2:"elodea", t3:"snail", t4:"both" }, CNAME = { blue:"Blue", yellow:"Yellow", greenblue:"Green to blue" };
  function jpaint(focusId){
    MV.keepFocus($("#cr-tubes", host), function(){ $("#cr-tubes", host).innerHTML = J.tubes.map(function(t){ var r = !!S.j.rev[t.id];
      return '<button type="button" class="cr-tb' + (r ? " on" : "") + '" data-tube="' + t.id + '" data-k="tb' + t.id + '" aria-label="' + MV.esc("Tube " + t.n + ": " + t.contents + ", " + t.light.toLowerCase() + ". " + (r ? "BTB colour after 2 h: " + t.result : "Tap to see its colour after 2 h.")) + '">' +
        tubeSVG(t.id, r, { contents:CNT[t.id], light:t.light === "Light", liquid:t.colour === "blue" ? "btb-blue" : t.colour === "yellow" ? "btb-yellow" : "greenblue" }) +
        '<span class="cr-tbn">Tube ' + t.n + '</span><span class="cr-tbc">' + t.contents + " · " + t.light.toLowerCase() + '</span><span class="cr-tbr">' + (r ? CNAME[t.colour] : "Tap to reveal") + "</span></button>"; }).join(""); });
    var rv = J.tubes.filter(function(t){ return S.j.rev[t.id]; });
    $("#cr-jexp", host).innerHTML = rv.length ? '<ul class="cr-jl">' + rv.map(function(t){ return '<li' + (t.id === focusId ? ' class="new"' : "") + "><strong>Tube " + t.n + ": " + t.result + ".</strong> " + t.why + "</li>"; }).join("") + "</ul>" + (rv.length === 4 ? '<p class="cr-jclose">' + J.closing + "</p>" : "") : "";
    $("#cr-jtbl", host).innerHTML = MV.tableHTML({ head:["Tube", "Contents", "Light", "Colour after 2 h (model result)"], rows:J.tubes.map(function(t){ return [String(t.n), t.contents, t.light, S.j.rev[t.id] ? t.result : "? (tap the tube)"]; }), caption:"The jar experiment" });
  }
  jpaint();
  P3F = { show:function(v){ vis = v; if (v) lensure(); } };
  return {};
}

// ---------- Practice 2: respiration lab data (N4 number entry and choice; adapted from SBI4U 04's puzzles) ----------
function lab(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); }
  host.innerHTML = '<p class="tiny"><span class="bio-model">Model data</span> ' + a.context + "</p>" + MV.tableHTML({ head:a.table.head, rows:a.table.rows, caption:"Sealed-chamber CO₂ readings" }) +
    a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:"L" + (i + 1), noConf:true, topicLabel:it.star ? "★" : "" });
    else {
      h = '<div class="q-head"><span class="qn" aria-hidden="true">L' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
      h += '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="cr-unit">' + it.unit + "</span></div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function near(v, t){ return Math.abs(v - t) <= 1e-6 * Math.max(1, Math.abs(t)); }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = byId(a.items, box.dataset.li), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (it.kind === "mc" && b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.act === "check") {
      var ok = false;
      if (it.kind === "mc") { x.checked = true; ok = MV.ok(it.options[x.choice]); }
      else {
        var v = parseVal(x.val);
        if (v == null) { msgs[it.id] = "Enter a number, such as 25 or 800."; paintItem(it); return; }
        ok = near(v, MV.ans(it));
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return near(v, w.match); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general) + " Try again."; }
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

// ---------- Performance task: Design a fair respiration test (chips; live preview of both tubes after 20 min) ----------
var task = (function(){
  var api = null, T = null;
  function read(){ var s = api ? api.S : {}; return { a:s.a || null, at:s.at == null ? null : +s.at, b:s.b || null, bt:s.bt == null ? null : +s.bt, ind:s.ind || null }; }
  function full(d){ return d.a && d.at != null && d.b && d.bt != null && d.ind; }
  function level(c, temp){ if (!c || temp == null) return null; if (c === "germ") return temp === 25 ? "high" : "low"; if (c === "dry") return "trace"; return "none"; }
  var LIME = { high:["lime-milky", "turns milky"], low:["lime-cloudy", "turns slightly cloudy"], trace:["lime-clear", "stays clear"], none:["lime-clear", "stays clear"] };
  var BTB = { high:["btb-yellow", "turns yellow"], low:["btb-green", "turns green"], trace:["btb-blue", "stays blue"], none:["btb-blue", "stays blue"] };
  function result(ind, lv){ if (!ind || !lv) return null; if (ind === "iodine") return ["iodine", "stays orange-brown (no change)"]; return (ind === "lime" ? LIME : BTB)[lv]; }
  function nm(list, id){ var x = byId(list, id); return x ? x.t : "?"; }
  function draw(){
    var d = read(), pv = $("#cr-tk-pv"); if (!pv) return;
    var A = result(d.ind, level(d.a, d.at)), B = result(d.ind, level(d.b, d.bt)), indName = d.ind ? nm(T.inds, d.ind) : "indicator not chosen";
    function one(k, c, t, r){
      var peas = c === "germ" || c === "dry" || c === "boiled" ? c : c === "beads" ? "beads" : null;
      return '<div class="cr-tkt">' + tubeSVG("tk" + k, !!r, { peas:peas, light:null, liquid:r ? r[0] : null }) + '<p class="cr-tkl"><strong>Tube ' + k + ":</strong> " + (c ? (k === "A" ? nm(T.aList, c) : nm(T.bList, c)) : "contents not chosen") + ", " + (t != null ? t + " °C" : "temperature not chosen") + "<br>" + (r ? MV.plain(indName).charAt(0).toUpperCase() + MV.plain(indName).slice(1) + " " + r[1] + "." : '<span class="muted">Choose everything to see the result.</span>') + "</p></div>";
    }
    pv.innerHTML = '<div class="cr-tkts">' + one("A", d.a, d.at, A) + one("B", d.b, d.bt, B) + "</div>";
  }
  function lab(k){ var p = k.split("|"); return "B = " + nm(T.bList, p[0]) + ", " + nm(T.inds, p[1]); }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      inp.innerHTML = '<div class="cr-tkin"><div id="cr-tk-a"></div><div id="cr-tk-at"></div><div id="cr-tk-b"></div><div id="cr-tk-bt"></div><div id="cr-tk-i"></div></div>';
      function g(id, label, list, key, num){ radios($(id, inp), { label:label, cls:"chips", options:list.map(function(v){ return num ? { id:v, t:v + " °C" } : { id:v.id, t:v.t }; }), value:a.S[key] == null ? "" : a.S[key], onChange:function(v){ a.S[key] = num ? +v : v; a.save(); draw(); a.update(); } }); }
      g("#cr-tk-a", "Tube A contents", T.aList, "a"); g("#cr-tk-at", "Tube A temperature", T.temps, "at", true);
      g("#cr-tk-b", "Tube B contents", T.bList, "b"); g("#cr-tk-bt", "Tube B temperature", T.temps, "bt", true);
      g("#cr-tk-i", "Indicator", T.inds, "ind");
      pv.innerHTML = '<h4 class="cr-tkh">Live preview: after 20 min</h4><div id="cr-tk-pv"></div><p class="tiny muted"><span class="bio-model">Model</span> ' + T.previewNote + "</p>";
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var st = MV.taskState(), g2 = $("#task-fb .fb.good"); if (!g2 || st.found.length < 4) return;
        $$("p", g2).forEach(function(q){ if (q.innerHTML.indexOf(T.more) >= 0) q.innerHTML = q.innerHTML.replace(T.more, T.allFound); });
        if (g2.innerHTML.indexOf(T.afterAll) < 0) g2.insertAdjacentHTML("beforeend", "<p>" + T.afterAll + "</p>");
      }, 0); });
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Choose both tubes’ contents and temperatures and an indicator first."; },
    checks:function(d){ return [d.a === "germ" && d.at === 25, d.b === "boiled" || d.b === "beads", d.at != null && d.at === d.bt, d.ind === "lime" || d.ind === "btb"]; },
    key:function(d){ return d.b + "|" + d.ind; },
    label:lab,
    text:function(k){ var p = k.split("|"); return "A germinating peas 25 °C, B " + nm(T.bList, p[0]) + " 25 °C, " + nm(T.inds, p[1]); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ lab:lab },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); if (P3F) P3F.show(v === "cycle"); }
});
})();
