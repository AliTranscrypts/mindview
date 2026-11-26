// SBI4U 27 Regulation of gene expression: hero (control ladder storyboard: chromatin opens, the DNA loops, splicing two ways,
// a microRNA destroys one mRNA, the other becomes an active protein), Eukaryotic control panel (one gene, five levels of control,
// protein meter; Cell types mode with a six-gene genome panel), "Same genome, different cells" (S12 claim builder on the
// nuclear-transfer data, X inactivation with calico patches, cancer hits on a cell lineage), Predict the output (number entry and
// chips), "Program a cell" task (the same panel and meter).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (SVG helpers from SBI4U 20 / 14) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "gx-sm", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function op(a, g){ return a == null || a >= 0.98 ? g : a <= 0.02 ? "" : '<g opacity="' + Math.round(a * 100) / 100 + '">' + g + "</g>"; }
function pill(x, y, lab, cls){ var w = 10 + lab.length * 6.4; return sv("rect", { x:x - w / 2, y:y - 7, width:w, height:14, rx:7, "class":cls }) + txt(x, y + 3.5, lab, cls + "t", "middle"); }

// ---------- @component radioGroup (copied from SBI4U 20 / 14 / MHF4U 25: options may be disabled with dis:true) ----------
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
// ---------- @component switchBtn (from SBI4U 12 / 09 / HFA4U 09) — role="switch" button with a visible On/Off word ----------
function switchHTML(k, label, on, dis, pre){
  return '<button type="button" class="gx-swb" role="switch" aria-checked="' + !!on + '" data-sw="' + k + '" data-k="' + (pre || "gxsw") + k + '"' + (dis ? " disabled" : "") + '><span class="gx-swk" aria-hidden="true"></span><span>' + label + '</span><span class="gx-swst" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// ---------- model (plan: Explore model, deterministic; Activity 2, TC1–TC3 and the task all use it) ----------
// rate (pre-mRNA per hour) = 0 if closed, else 10 × (4 if activator) × (¼ if repressor); proteins per mRNA = 20, or 2 with the
// microRNA; proteins per hour = rate × proteins per mRNA. The enhancer distance never changes the output.
var DIST = [100, 10000, 20000, 30000, 40000, 50000];
var LEVELS = ["Chromatin", "Transcription", "RNA processing", "mRNA lifetime and translation", "Protein changes"];
function model(s){
  var open = s.c === "open", act = !!+s.act, rep = !!+s.rep, mir = !!+s.mir, phos = !!+s.phos, B = s.iso === "B";
  var rate = open ? 10 * (act ? 4 : 1) * (rep ? 0.25 : 1) : 0, ppm = mir ? 2 : 20;
  return { open:open, act:act, rep:rep, mir:mir, phos:phos, B:B, rate:rate, ppm:ppm, out:rate * ppm };
}
function rateMult(m){ var p = ["10"]; if (m.act) p.push("4"); if (m.rep) p.push("¼"); return p.join(" × "); }
function isoText(B){ return B ? "Isoform B (exons 1-3-4)" : "Isoform A (exons 1-2-4)"; }
// "Levels in use" lists every switch not in its default state (defaults: closed, no factors, isoform A, no microRNA, no phosphate).
function levels(s){
  var m = model(s), L = [];
  if (m.open) L.push(LEVELS[0]); if (m.act || m.rep) L.push(LEVELS[1]); if (m.B) L.push(LEVELS[2]); if (m.mir) L.push(LEVELS[3]); if (m.phos) L.push(LEVELS[4]);
  return L.length ? L.join(", ") : "None (every switch at its default)";
}
function readRows(s){
  var m = model(s);
  return [
    ["Chromatin", m.open ? "Open (acetylated)" : "Closed (methylated): no transcription"],
    ["Transcription", MV.num(m.rate) + " pre-mRNA per hour" + (m.open && (m.act || m.rep) ? " (" + rateMult(m) + ")" : "")],
    ["mRNA made", m.rate ? isoText(m.B) : "None"],
    ["Proteins per mRNA", m.mir ? "2 (mRNA destroyed sooner)" : "20"],
    ["Proteins made per hour", "<strong>" + MV.num(m.out) + "</strong>"],
    ["Protein form", m.out ? (m.B ? "Isoform B" : "Isoform A") + ", " + (m.phos ? "active" : "inactive") : "None made"],
    ["Levels in use", levels(s)]
  ];
}
function describe(s){
  var m = model(s);
  return "Gene X control ladder. Chromatin " + (m.open ? "open: histones acetylated" : "closed: DNA methylated and tightly packed") + ". Activator " + (m.act ? "on" + (m.open ? ", bound to the enhancer " + MV.num(DIST[+s.dist || 0]) + " base pairs away; the DNA loops so it touches the promoter" : ", but it can’t reach the packed DNA") : "off") +
    ". Repressor " + (m.rep ? "on the silencer" : "off") + ". Transcription: " + MV.num(m.rate) + " pre-mRNA per hour. Splicing: " + isoText(m.B).toLowerCase() + ". MicroRNA " + (m.mir ? "present: 2 proteins per mRNA" : "absent: 20 proteins per mRNA") +
    ". Phosphorylation " + (m.phos ? "on" : "off") + ". Protein gauge: " + MV.num(m.out) + " per hour" + (m.out ? ", isoform " + (m.B ? "B" : "A") + ", " + (m.phos ? "active" : "inactive") : "") + ".";
}

// ---------- the control ladder drawing (viewBox 520 × 480): rungs Chromatin → Transcription → RNA processing →
// mRNA lifetime and translation → Protein changes, ending in the protein gauge. DNA --ink, histones --ink-2, RNA teal
// (--bio-nadh; the microRNA thinner), protein brown (--bio-carbon); exons told apart by labels and hatching. ----------
var LW = 520, LH = 480, RY = [48, 150, 250, 337, 428], SEP = [98, 205, 296, 380], BY = 177;
var RL = [["Chromatin"], ["Transcription"], ["RNA", "processing"], ["mRNA lifetime", "and translation"], ["Protein", "changes"]];
function defs(px){
  return "<defs>" + sv("pattern", { id:px + "-h2", width:6, height:6, patternUnits:"userSpaceOnUse", patternTransform:"rotate(45)" }, sv("rect", { width:6, height:6, "class":"gx-pbg" }) + sv("line", { x1:0, y1:0, x2:0, y2:6, "class":"gx-pl" })) +
    sv("pattern", { id:px + "-h3", width:6, height:6, patternUnits:"userSpaceOnUse" }, sv("rect", { width:6, height:6, "class":"gx-pbg" }) + sv("circle", { cx:3, cy:3, r:1.4, "class":"gx-pd" })) + "</defs>";
}
function frameSVG(){
  var h = "";
  SEP.forEach(function(y){ h += sv("line", { x1:8, y1:y, x2:LW - 8, y2:y, "class":"gx-sep" }); });
  h += sv("line", { x1:18, y1:RY[0], x2:18, y2:RY[4], "class":"gx-lad" });
  RY.forEach(function(y, i){
    h += sv("circle", { cx:18, cy:y, r:10, "class":"gx-rung" }) + txt(18, y + 4, String(i + 1), "gx-rn", "middle");
    RL[i].forEach(function(l, j){ h += txt(34, y + 4 + (j - (RL[i].length - 1) / 2) * 15, l, "gx-rl"); });
  });
  return h;
}
function exon(x, y, n, px, a){
  var fill = n === 2 ? "url(#" + px + "-h2)" : n === 3 ? "url(#" + px + "-h3)" : null;
  return op(a, sv("rect", { x:x, y:y - 7, width:34, height:14, rx:2, "class":"gx-ex" + (fill ? " gx-exh" : ""), fill:fill }) + txt(x + 17, y + 4, String(n), "gx-exl", "middle"));
}
function chromRow(o){
  var y = RY[0] + 4, h = "", xs = [], ys = [];
  for (var i = 0; i < 6; i++) { xs.push(lerp(258 + i * 20, 170 + i * 62, o)); ys.push(y + (1 - o) * (i % 2 ? 5 : -5)); }
  xs.forEach(function(x, i){ h += sv("circle", { cx:x, cy:ys[i], r:13, "class":"gx-bead" }); });
  var d = "M140 " + f1(y);
  xs.forEach(function(x, i){ d += " L" + f1(x - 13) + " " + f1(ys[i]) + " A13 13 0 0 1 " + f1(x + 13) + " " + f1(ys[i]); });
  h += sv("path", { d:d + " L505 " + f1(y), "class":"gx-dna" });
  if (o > 0.02) h += op(o, xs.map(function(x, i){ return sv("line", { x1:x + 6, y1:ys[i] - 11, x2:x + 11, y2:ys[i] - 21, "class":"gx-stk" }) + pill(x + 12, ys[i] - 27, "Ac", "gx-ac"); }).join(""));
  if (o < 0.98) h += op(1 - o, [0, 2, 4].map(function(i){ return sv("line", { x1:xs[i], y1:ys[i] + 13, x2:xs[i], y2:ys[i] + 22, "class":"gx-stk" }) + pill(xs[i], ys[i] + 29, "CH₃", "gx-me"); }).join(""));
  return h;
}
function strands(rate){ return rate <= 0.01 ? 0 : rate < 5 ? 1 : rate < 20 ? 2 : 4; }
function wave(x, y, n){ var d = "M" + x + " " + y; for (var i = 0; i < n; i++) d += " q4 -4 8 0 q4 4 8 0"; return d; }
function txRow(V, o){
  o = o || {};
  var h = "", lh = lerp(22, 60, V.loop), lw = lerp(10, 70, V.loop), flow = clamp(V.rate / 2.5, 0, 1);
  h += sv("path", { d:"M140 " + BY + " L292 " + BY + " C" + f1(292 - lw) + " " + f1(BY - lh * 1.33) + " " + f1(318 + lw * 0.3) + " " + f1(BY - lh * 1.33) + " 318 " + BY + " L505 " + BY, "class":"gx-dna" });
  h += sv("rect", { x:150, y:BY - 6, width:30, height:12, rx:2, "class":"gx-site" }) + txt(165, BY + 22, "silencer", "gx-sm", "middle");
  h += sv("rect", { x:262, y:BY - 6, width:30, height:12, rx:2, "class":"gx-site" }) + txt(274, BY + 22, "enhancer", "gx-sm", "middle");
  h += sv("rect", { x:318, y:BY - 6, width:34, height:12, rx:2, "class":"gx-prom" }) + txt(338, BY + 22, "promoter", "gx-sm", "middle");
  h += sv("rect", { x:384, y:BY - 5, width:121, height:10, rx:2, "class":"gx-gene" }) + txt(444, BY + 22, "Gene X", "gx-sm", "middle");
  // packed chromatin hides the promoter and gene
  if (V.open < 0.98) { var b = ""; for (var i = 0; i < 9; i++) b += sv("circle", { cx:300 + i * 24, cy:BY + (i % 2 ? 3 : -3), r:12, "class":"gx-bead" }); h += op(1 - V.open, b + txt(404, BY - 20, "packed shut", "gx-sm", "middle")); }
  // repressor on the silencer
  if (V.rep > 0.02) h += op(V.rep, sv("ellipse", { cx:165, cy:BY - 15, rx:18, ry:9, "class":"gx-rep" }) + txt(165, BY - 11, "R", "gx-pt", "middle"));
  // activator on the enhancer, reaching the promoter across the loop (hovers when the chromatin is closed)
  if (V.act > 0.02) {
    var ay = BY - 15 - 46 * (V.land != null ? 1 - V.land : 1 - V.open);
    h += op(V.act, sv("ellipse", { cx:298, cy:ay, rx:22, ry:9, "class":"gx-actv" }) + txt(298, ay + 4, "A", "gx-pt", "middle") +
      (V.open < 0.98 ? op(1 - V.open, txt(326, ay - 4, "can’t reach the DNA", "gx-sm")) : ""));
  }
  // RNA polymerase and pre-mRNA strands
  if (flow > 0.02) {
    var n = strands(V.rate), s = "";
    for (var k = 0; k < n; k++) s += sv("path", { d:wave(386, BY - 17 - 9 * k, 3), "class":"gx-rna" });
    h += op(flow, sv("ellipse", { cx:368, cy:BY - 6, rx:15, ry:11, "class":"gx-pol" }) + txt(368, BY - 3, "pol", "gx-pt2", "middle") + s);
  }
  if (!o.hero) h += txt(505, BY - 18, MV.num(Math.round(V.rate * 10) / 10) + " per hour", "gx-v", "end") + txt(505, 116, "enhancer to promoter: " + MV.num(V.dist) + " bp", "gx-sm", "end");
  return h;
}
function spliceRow(V, px){
  var y0 = 222, y1 = 268, h = "";
  h += sv("line", { x1:184, y1:y0, x2:288, y2:y0, "class":"gx-intr" });
  [1, 2, 3, 4].forEach(function(n, i){ h += exon(150 + i * 46, y0, n, px); });
  h += txt(332, y0 + 4, "pre-mRNA", "gx-sm");
  h += exon(170, y1, 1, px) + exon(204, y1, 2, px, 1 - V.iso) + exon(204, y1, 3, px, V.iso) + exon(238, y1, 4, px);
  h += op(1 - V.iso, txt(282, y1 + 4, "mRNA: isoform A (exons 1-2-4)", "gx-sm")) + op(V.iso, txt(282, y1 + 4, "mRNA: isoform B (exons 1-3-4)", "gx-sm"));
  return h;
}
function ribosome(x, y){ return sv("ellipse", { cx:x, cy:y - 10, rx:22, ry:12, "class":"gx-rib" }) + sv("ellipse", { cx:x, cy:y + 9, rx:17, ry:7, "class":"gx-rib" }); }
function chain(x, y, n){ var h = ""; for (var i = 0; i < n; i++) h += sv("circle", { cx:x + 16 + i * 9, cy:y - 21 - i * 3 + i * i * 0.3, r:4, "class":"gx-aa" }); return h; }
function transRow(V){
  var y = 343, h = "";
  h += op(1 - 0.55 * V.mir, sv("path", { d:"M150 " + y + " L400 " + y, "class":"gx-mrna" + (V.mir > 0.5 ? " gx-dying" : "") }) + sv("circle", { cx:150, cy:y, r:5, "class":"gx-c5" }) + txt(406, y + 4, "AAAA", "gx-sm"));
  h += ribosome(230, y) + chain(230, y, 5);
  if (V.mir > 0.02) {
    var t = ""; for (var x = 324; x <= 364; x += 8) t += sv("line", { x1:x, y1:y - 7, x2:x, y2:y - 3, "class":"gx-bp" });
    h += op(V.mir, sv("path", { d:"M318 " + (y - 9) + " L370 " + (y - 9), "class":"gx-mir" }) + t + txt(344, y - 16, "microRNA", "gx-sm", "middle"));
  }
  h += op(1 - V.mir, txt(150, 372, "each mRNA → 20 proteins", "gx-sm")) + op(V.mir, txt(150, 372, "each mRNA → 2 proteins (destroyed sooner)", "gx-sm"));
  return h;
}
function protein(x, y, phos, a){
  return op(a, op(phos, sv("ellipse", { cx:x, cy:y + 1, rx:36, ry:29, "class":"gx-on" })) +
    sv("path", { d:"M" + (x - 24) + " " + y + " C" + (x - 24) + " " + (y - 18) + " " + (x - 4) + " " + (y - 22) + " " + (x + 6) + " " + (y - 16) + " C" + (x + 18) + " " + (y - 24) + " " + (x + 30) + " " + (y - 10) + " " + (x + 24) + " " + (y + 2) + " C" + (x + 30) + " " + (y + 16) + " " + (x + 10) + " " + (y + 24) + " " + (x - 2) + " " + (y + 18) + " C" + (x - 16) + " " + (y + 24) + " " + (x - 28) + " " + (y + 14) + " " + (x - 24) + " " + y + " Z", "class":"gx-prot" }) +
    op(phos, sv("circle", { cx:x + 25, cy:y - 18, r:9, "class":"gx-ph" }) + txt(x + 25, y - 14.5, "P", "gx-pht", "middle")));
}
function meter(x, y, out, form, val){
  var W = 260, h = txt(x, y - 8, "Proteins made per hour: " + (val == null ? MV.num(Math.round(out)) : val), "gx-mtl");
  h += sv("rect", { x:x, y:y, width:W, height:18, rx:4, "class":"gx-mt" });
  if (out > 0.05) h += sv("rect", { x:x, y:y, width:f1(Math.max(2, W * Math.min(out, 800) / 800)), height:18, rx:4, "class":"gx-mf" });
  [0, 200, 400, 600, 800].forEach(function(v){ var tx = x + W * v / 800; h += sv("line", { x1:tx, y1:y + 18, x2:tx, y2:y + 23, "class":"gx-tick" }) + txt(tx, y + 34, String(v), "gx-sm", "middle"); });
  return h + txt(x, y + 52, form, "gx-st");
}
function protRow(V){
  var h = protein(180, 428, V.phos, 1);
  h += op(1 - V.phos, txt(180, 470, "inactive", "gx-st", "middle")) + op(V.phos, txt(180, 470, "active", "gx-st", "middle"));
  var form = V.out > 0.05 ? "isoform " + (V.iso > 0.5 ? "B" : "A") + ", " + (V.phos > 0.5 ? "active" : "inactive") : "no protein made";
  return h + meter(240, 418, V.out, form);
}
function vOf(s){
  var m = model(s), d = clamp(+s.dist || 0, 0, 5);
  return { open:m.open ? 1 : 0, act:m.act ? 1 : 0, rep:m.rep ? 1 : 0, iso:m.B ? 1 : 0, mir:m.mir ? 1 : 0, phos:m.phos ? 1 : 0, loop:d / 5, rate:m.rate, out:m.out, dist:DIST[d] };
}
function vMix(a, b, k){ var o = {}; for (var key in b) o[key] = key !== "dist" && typeof b[key] === "number" ? lerp(a[key], b[key], k) : b[key]; return o; }
function ladderSVG(V, px){
  var flow = clamp(V.rate / 2.5, 0, 1);
  return defs(px) + frameSVG() + chromRow(V.open) + txRow(V) + op(lerp(0.28, 1, flow), spliceRow(V, px) + transRow(V) + protRow(V));
}

// ---------- hero: storyboard (plan) — the gene loosens as acetyl tags appear; an activator lands on a distant enhancer and the DNA
// loops; RNA polymerase makes pre-mRNA; two splicings give two mRNAs; a microRNA clips onto one, which fades; the other is translated
// into a protein that gets a phosphate tag and lights up "active". Reduced motion: the final frame, labelled. ----------
function hero(f){
  var box = $("#gx-hero"); if (!box) return;
  var cap = f && f.cap, last = -1;
  var CAPS = ["A gene wound tightly on histones: silent.", "Acetyl tags loosen the chromatin.", "An activator lands on a distant enhancer; the DNA loops to touch the promoter.",
    "RNA polymerase makes pre-mRNA.", "Splicing keeps different exons: two mRNAs from one gene.", "A microRNA clips onto one mRNA, which is destroyed.",
    "The other mRNA is translated into protein.", "A phosphate tag switches the protein on: active."];
  box.innerHTML = '<svg viewBox="0 0 ' + LW + " " + LH + '" class="gx-hsvg" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  function scene(T){
    var o = MV.ease(seg(T, 0.6, 2)), act = seg(T, 2.1, 2.6), loop = MV.ease(seg(T, 2.5, 3.6)), land = MV.ease(seg(T, 2.4, 3.2));
    var V = { open:o, land:land, act:act, rep:0, loop:loop, rate:T >= 3.8 ? 10 : 0, dist:50000, iso:0, mir:0, phos:0, out:0 };
    var h = defs("gxh") + frameSVG() + chromRow(o) + txRow(V, { hero:true });
    // RNA processing: pre-mRNA, then two mRNAs
    var pre = seg(T, 4, 4.6), sp = seg(T, 5, 6), y0 = 222;
    h += op(pre, sv("line", { x1:184, y1:y0, x2:288, y2:y0, "class":"gx-intr" }) + [1, 2, 3, 4].map(function(n, i){ return exon(150 + i * 46, y0, n, "gxh"); }).join("") + txt(332, y0 + 4, "pre-mRNA", "gx-sm"));
    var fade = 1 - 0.85 * seg(T, 7.6, 8.6);
    h += op(sp, op(fade, exon(170, 254, 1, "gxh") + exon(204, 254, 2, "gxh") + exon(238, 254, 4, "gxh") + txt(282, 258, "mRNA: isoform A", "gx-sm")) +
      exon(170, 280, 1, "gxh") + exon(204, 280, 3, "gxh") + exon(238, 280, 4, "gxh") + txt(282, 284, "mRNA: isoform B", "gx-sm"));
    // mRNA lifetime: the microRNA clips onto isoform A, which fades; isoform B is translated
    var clip = seg(T, 6.5, 7.2), tr = seg(T, 8.6, 9.8), y = 343;
    h += op(sp * fade, sv("path", { d:"M150 " + (y - 18) + " L250 " + (y - 18), "class":"gx-mrna" + (T > 7.6 ? " gx-dying" : "") }) + txt(150, y - 28, "isoform A mRNA", "gx-sm"));
    if (clip > 0) h += op(clip * fade, sv("path", { d:"M" + f1(lerp(270, 196, clip)) + " " + (y - 27) + " L" + f1(lerp(310, 236, clip)) + " " + (y - 27), "class":"gx-mir" }) + txt(lerp(290, 216, clip), y - 34, "microRNA", "gx-sm", "middle"));
    h += op(sp, sv("path", { d:"M290 " + (y + 8) + " L460 " + (y + 8), "class":"gx-mrna" }) + txt(464, y + 12, "B", "gx-sm"));
    if (tr > 0) h += op(tr, ribosome(lerp(300, 350, tr), y + 8) + chain(lerp(300, 350, tr), y + 8, Math.round(tr * 5)));
    // protein changes: the protein appears, gets a phosphate tag and lights up
    var pa = seg(T, 9.6, 10.2), ph = seg(T, 10.4, 11), mv = 200 * MV.ease(seg(T, 9.6, 10.8));
    h += protein(180, 428, ph, pa) + op(pa, op(1 - ph, txt(180, 470, "inactive", "gx-st", "middle")) + op(ph, txt(180, 470, "active", "gx-st", "middle")));
    h += meter(240, 418, mv, T >= 10.4 ? "isoform B, " + (ph > 0.5 ? "active" : "inactive") : "isoform B");
    setCap(T < 0.6 ? 0 : T < 2.1 ? 1 : T < 3.8 ? 2 : T < 5 ? 3 : T < 6.5 ? 4 : T < 8.6 ? 5 : T < 10.4 ? 6 : 7);
    return h;
  }
  function draw(T){ svg.innerHTML = scene(T); }
  if (MV.reduceMotion) { draw(12); return; }
  draw(0);
  MV.tween({ dur:12000, ease:lin, step:function(k){ draw(k * 12); }, done:function(){ draw(12); } });
}

// ---------- Mode 2: Cell types (genome panel of six genes; three cell tabs) ----------
var GENES = [{ id:"alb", t:"Albumin", sub:"a blood protein" }, { id:"mus", t:"Muscle fibre protein" }, { id:"nt", t:"Neurotransmitter-making enzyme" },
  { id:"ins", t:"Insulin" }, { id:"gly", t:"Glycolysis enzyme", sub:"needed by all cells" }, { id:"hb", t:"Hemoglobin" }];
var CELLS = {
  liver:{ t:"Liver cell", on:["alb", "gly"], acts:["albumin activator", "glycolysis activator"] },
  muscle:{ t:"Muscle cell", on:["mus", "gly"], acts:["muscle-fibre activator", "glycolysis activator"] },
  nerve:{ t:"Nerve cell", on:["nt", "gly"], acts:["neurotransmitter-enzyme activator", "glycolysis activator"] } };
var ICON = {
  liver:'<svg class="gx-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 9 C5 4 16 3 21 6 C22 11 17 17 10 18 C6 18 2 14 3 9 Z"/></svg>',
  muscle:'<svg class="gx-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2 12 C6 6 18 6 22 12 C18 18 6 18 2 12 Z"/><path d="M8 8 V16 M12 7 V17 M16 8 V16"/></svg>',
  nerve:'<svg class="gx-ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="8" cy="12" r="4"/><path d="M12 12 H22 M5 8 L2 4 M5 16 L2 20 M8 8 V3 M20 12 L22 9 M20 12 L22 15"/></svg>' };
function miniBeads(open){
  var h = "", i;
  for (i = 0; i < 4; i++) h += sv("circle", { cx:open ? 10 + i * 20 : 32 + i * 9, cy:open ? 14 : 14 + (i % 2 ? 3 : -3), r:7, "class":"gx-bead" });
  h += sv("path", { d:"M2 14 L88 14", "class":"gx-dna gx-dna-sm" });
  return '<svg class="gx-mini" viewBox="0 0 90 28" aria-hidden="true" focusable="false">' + h + "</svg>";
}
function cellsHTML(cell){
  var c = CELLS[cell];
  return GENES.map(function(g){
    var on = c.on.indexOf(g.id) >= 0;
    return '<div class="gx-gcard' + (on ? " on" : "") + '" role="listitem"><b>' + g.t + "</b>" + (g.sub ? "<small>" + g.sub + "</small>" : "") + miniBeads(on) +
      "<span>Chromatin: " + (on ? "open" : "closed") + "</span><span>Activator: " + (on ? "present" : "absent") + '</span><span class="gx-gst">' + (on ? "ON: mRNA made" : "Off") + "</span></div>";
  }).join("");
}

// ---------- Explore: Eukaryotic control panel ----------
function explore(host, api){
  var C = api.content, S = api.S;
  var D = { mode:"panel", c:"open", act:0, rep:0, iso:"A", mir:0, phos:0, dist:0, cell:"liver" };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  S.dist = clamp(Math.round(+S.dist || 0), 0, 5);
  var Vcur = vOf(S), anim = null, busy = false, cap = "", readSig = "";
  host.innerHTML = '<div class="gx-ex"><div class="pg gx-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="gx-pv"><div class="gx-fig"><svg id="gx-svg" viewBox="0 0 ' + LW + " " + LH + '" role="img" focusable="false"></svg></div>' +
        '<p class="tiny gx-key" aria-hidden="true"><span class="gx-kk gx-kk-a">A</span> activator <span class="gx-kk gx-kk-r">R</span> repressor <span class="gx-kk gx-kk-ac">Ac</span> acetyl tag <span class="gx-kk gx-kk-me">CH₃</span> methyl tag <span class="gx-kk gx-kk-rna"></span> RNA <span class="gx-kk gx-kk-p"></span> protein</p>' +
        '<p class="gx-cap" id="gx-cap" aria-live="polite"></p></div>' +
      '<div id="gx-cv"><p class="gx-banner"><strong>' + C.cellBanner + '</strong></p><h4 id="gx-cvh"></h4><div class="gx-gscroll"><div class="gx-genes" id="gx-genes" role="list" aria-label="Genome panel: the same six genes"></div></div></div></div>' +
    '<div class="pg-ctrl"><div id="gx-mode"></div>' +
      '<div class="gx-panel" id="gx-pc"><div id="gx-chrom"></div><div class="gx-sws" id="gx-sw1"></div>' +
        '<label class="slider gx-sl"><span class="slider-top"><span>Enhancer distance from the promoter</span><output id="gx-dist-out" for="gx-dist"></output></span><input type="range" id="gx-dist" min="0" max="5" step="1"></label>' +
        '<div class="gx-sws" id="gx-sw2"></div><div id="gx-iso"></div><div class="gx-sws" id="gx-sw3"></div></div>' +
      '<div class="gx-panel" id="gx-cc"><div id="gx-cell"></div></div></div>' +
    '<div class="pg-read"><dl class="read gx-read" id="gx-read" aria-live="polite"></dl>' +
      '<details class="alg gx-drawer"><summary>How the numbers work</summary><p><span class="bio-model">Model numbers</span> ' + C.modelNote + "</p></details></div></div></div>";
  var svg = $("#gx-svg", host), dIn = $("#gx-dist", host);
  var modeR = radios($("#gx-mode", host), { label:"Mode", key:"m", options:[{ id:"panel", t:"Control panel" }, { id:"cells", t:"Cell types" }], value:S.mode, onChange:function(v){ set({ mode:v }); } });
  var chromR = radios($("#gx-chrom", host), { label:"Chromatin", key:"c", options:[{ id:"open", t:"Open (histones acetylated)" }, { id:"closed", t:"Closed (DNA methylated)" }], value:S.c, onChange:function(v){ set({ c:v }); } });
  var isoR = radios($("#gx-iso", host), { label:"Splicing", key:"i", options:[{ id:"A", t:"Isoform A (exons 1-2-4)" }, { id:"B", t:"Isoform B (exons 1-3-4)" }], value:S.iso, onChange:function(v){ set({ iso:v }); } });
  var cellR = radios($("#gx-cell", host), { label:"Cell", key:"t", cls:"chips", options:["liver", "muscle", "nerve"].map(function(k){ return { id:k, t:ICON[k] + "<span>" + CELLS[k].t + "</span>" }; }), value:S.cell, onChange:function(v){ set({ cell:v }); } });
  var SW = { sw1:[["act", "Activator on the enhancer"]], sw2:[["rep", "Repressor on the silencer"]], sw3:[["mir", "MicroRNA for Gene X"], ["phos", "Phosphorylation of the protein"]] };
  function paintSw(){ Object.keys(SW).forEach(function(k){ var el = $("#gx-" + k, host); MV.keepFocus(el, function(){ el.innerHTML = SW[k].map(function(x){ return switchHTML(x[0], x[1], +S[x[0]], busy); }).join(""); }); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-sw]"); if (!b || b.disabled || !host.querySelector("#gx-pc").contains(b)) return; var p = {}; p[b.dataset.sw] = +S[b.dataset.sw] ? 0 : 1; set(p); });
  function distOut(){ var v = DIST[S.dist]; $("#gx-dist-out", host).textContent = MV.num(v) + " bp"; dIn.setAttribute("aria-valuetext", MV.num(v) + " base pairs"); }
  dIn.value = S.dist;
  dIn.addEventListener("input", function(){ set({ dist:+dIn.value }); });
  dIn.addEventListener("keydown", function(e){ if (!e.shiftKey) return; var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return; e.preventDefault(); dIn.value = d > 0 ? 5 : 0; set({ dist:+dIn.value }); });

  function capFor(p, m){
    if (p.c) return p.c === "open" ? "Chromatin open: acetyl tags loosen the histones, so the promoter can be reached." : "Chromatin closed: methyl tags and tight packing hide the gene, so nothing is transcribed" + (m.act ? ", even with the activator in the cell." : ".");
    if (p.act != null) return p.act ? (m.open ? "Activator on: it lands on the enhancer, the DNA loops, and transcription rises × 4." : "Activator on, but the chromatin is closed: it can’t land.") : "Activator off: transcription loses its × 4 boost.";
    if (p.dist != null) return "The enhancer is now " + MV.num(DIST[p.dist]) + " base pairs from the promoter. The loop changes size; the output doesn’t change.";
    if (p.rep != null) return p.rep ? (m.open ? "Repressor on: it binds the silencer and cuts transcription to ¼." : "Repressor on (the chromatin is closed anyway).") : "Repressor off.";
    if (p.iso) return p.iso === "B" ? "Splicing set to isoform B: exon 3 is kept and exon 2 is skipped. Same amount, a different protein." : "Splicing set to isoform A: exons 1-2-4.";
    if (p.mir != null) return p.mir ? "MicroRNA present: it pairs with the mRNA, which is blocked or destroyed sooner: 2 proteins per mRNA instead of 20. Transcription doesn’t change." : "MicroRNA absent: each mRNA makes 20 proteins.";
    if (p.phos != null) return p.phos ? "Phosphorylation on: a phosphate group switches the protein on (active)." : "Phosphorylation off: the protein is made, but it’s inactive.";
    if (p.mode) return p.mode === "cells" ? "" : "Set the switches. The gauge shows how many proteins the cell makes per hour, and which kind.";
    return "";
  }
  function drawV(V){ svg.innerHTML = ladderSVG(V, "gxe"); }
  function animateTo(dur, done){
    if (anim) { anim(); anim = null; }
    var from = Vcur, to = vOf(S);
    anim = MV.tween({ dur:dur, step:function(k){ Vcur = vMix(from, to, k); drawV(Vcur); }, done:function(){ anim = null; Vcur = to; drawV(Vcur); if (done) done(); } });
  }
  function set(p){
    if (busy) return;
    Object.keys(p).forEach(function(k){ S[k] = p[k]; });
    cap = capFor(p, model(S));
    api.save(); paintAll(true); MV.changed();
  }
  function sync(){
    modeR.set(S.mode); chromR.set(S.c); isoR.set(S.iso); cellR.set(S.cell); dIn.value = S.dist; distOut(); paintSw();
    [modeR, chromR, isoR, cellR].forEach(function(r){ r.disable(busy); }); dIn.disabled = busy;
    $("#gx-pc", host).hidden = S.mode !== "panel"; $("#gx-pv", host).hidden = S.mode !== "panel";
    $("#gx-cc", host).hidden = S.mode !== "cells"; $("#gx-cv", host).hidden = S.mode !== "cells";
  }
  function paintRead(){
    var rows;
    if (S.mode === "cells") {
      var c = CELLS[S.cell];
      rows = [["Cell", c.t], ["Genes switched on", c.on.map(function(id){ return byId(GENES, id).t; }).join(", ")], ["Activators in this cell", c.acts.join(", ")],
        ["Genes with open chromatin", c.on.map(function(id){ return byId(GENES, id).t; }).join(", ")], ["Genome", "The same six genes as every other cell"]];
    } else rows = readRows(S);
    var h = MV.readoutHTML(rows); if (h !== readSig) { readSig = h; $("#gx-read", host).innerHTML = h; }
  }
  function paintCells(){ $("#gx-cvh", host).textContent = CELLS[S.cell].t + " nucleus"; $("#gx-genes", host).innerHTML = cellsHTML(S.cell); }
  function paintAll(animate){
    sync(); paintRead(); paintCells();
    $("#gx-cap", host).textContent = cap || capFor({ mode:"panel" });
    svg.setAttribute("aria-label", describe(S));
    if (animate) animateTo(450); else { if (anim) { anim(); anim = null; } Vcur = vOf(S); drawV(Vcur); }
  }
  paintAll(false);

  // ---- target challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var c = byId(C.challenges, id), N = c.named || {}, m = model(S);
    if (S.mode !== "panel") return { ok:false, msg:N.mode };
    if (id === "tc1") {
      if (m.open && m.act && !m.rep && !m.mir && !m.B) return { ok:true };
      if (m.open && m.act && !m.rep && !m.mir && m.B) return { ok:false, msg:N.isoB };
      if (m.open && m.act && m.rep && !m.mir) return { ok:false, msg:N.rep };
      return { ok:false, msg:c.general };
    }
    if (id === "tc2") {
      if (m.open && m.rate === 10 && m.mir && m.B) return { ok:true };
      if (!m.open) return { ok:false, msg:N.closed };
      if (m.rep && !m.act) return { ok:false, msg:N.rep };
      return { ok:false, msg:c.general };
    }
    if (id === "tc3") {
      if (m.open && !m.act && m.rep && !m.mir && m.B && m.phos) return { ok:true };
      if (m.open && m.act && !m.rep && m.mir) return { ok:false, msg:N.am };
      if (m.open && !m.act && m.rep && !m.mir && m.B && !m.phos) return { ok:false, msg:N.phos };
      if (m.open && !m.act && m.rep && !m.mir && !m.B) return { ok:false, msg:N.isoA };
      return { ok:false, msg:c.general };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        busy = false;
        Object.keys(p.start).forEach(function(k){ S[k] = p.start[k]; }); S.mode = "panel";
        cap = ""; api.save(); paintAll(false); MV.changed();
      },
      run:function(p, done){
        busy = true;
        Object.keys(p.change).forEach(function(k){ S[k] = p.change[k]; });
        sync(); paintRead(); svg.setAttribute("aria-label", describe(S));
        animateTo(1600, function(){ busy = false; cap = p.reveal; api.save(); paintAll(false); MV.changed(); MV.wait(200, done); });
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Same genome, different cells ----------
// Station 1: @component S12 claimBuilder — claim chips, evidence chips (tap the data rows) and reasoning chips; one Check.
// Station 2: @component calicoPatches — a seeded skin grid where each starting cell's clone grows with the divisions slider.
// Station 3: @component hitLineage — a cell lineage that collects cancer "hits" (proto-oncogene, two tumour suppressor copies).
function part3(host, api){
  var C = api.content, S = api.S, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  var D = { cl:null, ev:{}, re:null, cer:false, rare:null, d:0, hit:0 };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k] && typeof D[k] === "object" ? {} : D[k]; });
  S.d = clamp(Math.round(+S.d || 0), 0, 6); S.hit = clamp(Math.round(+S.hit || 0), 0, 3);
  var cerMsg = null;
  host.innerHTML = '<div class="gx-p3">' +
    '<section class="gx-st" aria-labelledby="gx-s1h"><h3 id="gx-s1h">' + S1.title + "</h3><p>" + S1.panel + "</p>" +
      MV.tableHTML({ head:S1.head, rows:S1.rows, caption:"Nuclear-transfer results (described qualitatively)" }) +
      '<h4>Build the claim</h4><p class="how">Choose a claim, tap the rows of the table that support it, and choose the reasoning. Then press <strong>Check my claim</strong>.</p><div id="gx-cer"></div><div id="gx-rare"></div></section>' +
    '<section class="gx-st part" aria-labelledby="gx-s2h"><h3 id="gx-s2h">' + S2.title + "</h3><p>" + S2.text + "</p><p>" + S2.cat + '</p>' +
      '<div class="gx-fig gx-catfig"><svg id="gx-cat" viewBox="0 0 470 220" role="img" focusable="false"></svg></div>' +
      '<p class="tiny gx-key" aria-hidden="true"><i class="bio-sw gx-sw-or"></i> X with the orange allele active <i class="bio-sw gx-sw-bk"></i> X with the black allele active <i class="bio-sw gx-sw-no"></i> not yet grown</p>' +
      '<label class="slider gx-sl"><span class="slider-top"><span>' + S2.slider + '</span><output id="gx-d-out" for="gx-d"></output></span><input type="range" id="gx-d" min="0" max="6" step="1"></label><p class="gx-cap" id="gx-dcap" aria-live="polite"></p></section>' +
    '<section class="gx-st part" aria-labelledby="gx-s3h"><h3 id="gx-s3h">' + S3.title + '</h3><div class="gx-cards">' +
      '<div class="refresh gx-card"><h4>' + S3.acc.t + "</h4><p>" + S3.acc.text + '</p></div><div class="refresh gx-card"><h4>' + S3.brake.t + "</h4><p>" + S3.brake.text + "</p></div></div>" +
      '<div class="gx-fig"><svg id="gx-lin" viewBox="0 0 470 210" role="img" focusable="false"></svg></div>' +
      '<p class="tiny gx-key" aria-hidden="true"><span class="gx-kk gx-kk-acc">G</span> proto-oncogene copy (filled: mutated, stuck on) <span class="gx-kk gx-kk-brk">T</span> tumour suppressor copy (crossed out: lost)</p>' +
      '<p class="gx-hitban" id="gx-ban" aria-live="polite"></p><div class="q-actions" id="gx-hitb"></div><dl class="read gx-read" id="gx-hitr" aria-live="polite"></dl><p class="gx-cap" id="gx-hcap" aria-live="polite"></p></section></div>';

  // ---- station 1: claim–evidence–reasoning ----
  function chipRow(lab, attr, list, isOn){
    return '<div class="gx-cerrow"><span class="gx-cerl">' + lab + '</span><div class="gx-chips" role="group" aria-label="' + lab + '">' + list.map(function(x){
      var on = isOn(x.id); return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-' + attr + '="' + x.id + '" data-k="gx' + attr + x.id + '"' + (S.cer ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</div></div>";
  }
  var EV = S1.rows.map(function(r, i){ return { id:String(i + 1), t:"Row " + (i + 1) + ": " + r[0] }; });
  function paintCer(){
    var el = $("#gx-cer", host), h = "";
    h += chipRow("Claim", "cl", S1.claims, function(id){ return S.cl === id; });
    h += chipRow("Evidence", "ev", EV, function(id){ return !!S.ev[id]; });
    h += chipRow("Reasoning", "re", S1.reasons, function(id){ return S.re === id; });
    if (!S.cer) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-cerck="1" data-k="gxcerck">Check my claim</button></div>';
    if (S.cer) h += MV.fbHTML("good", S1.done); else if (cerMsg) h += MV.fbHTML("bad", cerMsg);
    MV.keepFocus(el, function(){ el.innerHTML = h; });
    paintRare();
  }
  function checkCer(){
    var cl = byId(S1.claims, S.cl), re = byId(S1.reasons, S.re), ev = Object.keys(S.ev).filter(function(k){ return S.ev[k]; });
    if (!cl) cerMsg = "<strong>✗ Not yet.</strong> Choose a claim first.";
    else if (!MV.ok(cl)) cerMsg = "<strong>✗ Not quite.</strong> " + cl.why;
    else if (!ev.length) cerMsg = "<strong>✗ Not yet.</strong> " + S1.evNone;
    else if (ev.indexOf("1") >= 0) cerMsg = "<strong>✗ Not quite.</strong> " + S1.evCtrl;
    else if (!re) cerMsg = "<strong>✗ Not yet.</strong> Choose the reasoning that links your evidence to the claim.";
    else if (!MV.ok(re)) cerMsg = "<strong>✗ Not quite.</strong> " + re.why;
    else { S.cer = true; cerMsg = null; }
    api.save(); paintCer(); MV.focusFb($("#gx-cer", host));
  }
  function paintRare(){
    var el = $("#gx-rare", host), R = S1.rare;
    if (!S.cer) { el.innerHTML = ""; return; }
    var pick = S.rare ? byId(R.options, S.rare) : null, good = pick && MV.ok(pick);
    var h = "<h4>" + R.prompt + '</h4><div class="gx-chips" role="group" aria-label="' + MV.esc(R.prompt) + '">' + R.options.map(function(o){ var on = S.rare === o.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-rr="' + o.id + '" data-k="gxrr' + o.id + '"' + (good ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (pick) h += MV.fbHTML(good ? "good" : "bad", (good ? "<strong>✓ Yes.</strong> " : "<strong>✗ Not quite.</strong> ") + pick.why + (good ? "" : " Try another."));
    if (good) h += '<div class="refresh gx-ips"><h4>Resetting cells on purpose</h4><p>' + S1.ips + "</p></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !b.closest("#gx-cer, #gx-rare")) return;
    if (b.dataset.cl) { S.cl = b.dataset.cl; cerMsg = null; }
    else if (b.dataset.ev) { S.ev[b.dataset.ev] = !S.ev[b.dataset.ev]; cerMsg = null; }
    else if (b.dataset.re) { S.re = b.dataset.re; cerMsg = null; }
    else if (b.dataset.cerck) { checkCer(); return; }
    else if (b.dataset.rr) { S.rare = b.dataset.rr; api.save(); paintRare(); MV.focusFb($("#gx-rare", host)); return; }
    else return;
    api.save(); paintCer();
  });
  paintCer();

  // ---- station 2: calico patches (seeded; same pattern on every device) ----
  var GC = 14, GR = 9, CS = 20, GX0 = 176, GY0 = 20, rng = MV.bio.rng("gx-calico"), grid = [], i;
  for (i = 0; i < GC * GR; i++) grid.push(-1);
  var SP = [[1, 1], [6, 0], [11, 2], [2, 6], [7, 5], [12, 7]], COL = ["or", "bk", "or", "bk", "bk", "or"];
  if (rng() < 0.5) COL = COL.map(function(c){ return c === "or" ? "bk" : "or"; });
  var queue = [], rank = [], cnt = [0, 0, 0, 0, 0, 0];
  SP.forEach(function(p, k){ var ix = p[1] * GC + p[0]; grid[ix] = k; rank[ix] = 0; cnt[k] = 1; queue.push(ix); });
  while (queue.length) {
    var qi = rng.int(Math.min(queue.length, 6)), cur = queue.splice(qi, 1)[0], cx = cur % GC, cy = Math.floor(cur / GC), k2 = grid[cur];
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function(dv){
      var nx = cx + dv[0], ny = cy + dv[1]; if (nx < 0 || ny < 0 || nx >= GC || ny >= GR) return;
      var ni = ny * GC + nx; if (grid[ni] >= 0) return;
      grid[ni] = k2; rank[ni] = cnt[k2]++; queue.push(ni);
    });
  }
  function catSVG(d){
    var lim = Math.pow(2, d), h = "";
    // one cell with an active X and a Barr body
    h += sv("circle", { cx:78, cy:96, r:62, "class":"gx-cell" }) + sv("circle", { cx:78, cy:96, r:34, "class":"gx-nuc" });
    h += sv("path", { d:"M58 84 q6 -10 12 0 t12 0 t12 0", "class":"gx-xact" }) + sv("circle", { cx:74, cy:112, r:8, "class":"gx-barr" });
    h += txt(78, 22, "one cell", "gx-st", "middle") + txt(78, 176, "active X: read", "gx-sm", "middle") + txt(78, 192, "Barr body: packed X", "gx-sm", "middle");
    for (var y = 0; y < GR; y++) for (var x = 0; x < GC; x++) {
      var ix = y * GC + x, k = grid[ix], grown = rank[ix] < lim;
      h += sv("rect", { x:GX0 + x * CS + 1, y:GY0 + y * CS + 1, width:CS - 2, height:CS - 2, rx:3, "class":grown ? "gx-fur-" + COL[k] : "gx-fur-no" });
    }
    SP.forEach(function(p){ h += sv("circle", { cx:GX0 + p[0] * CS + CS / 2, cy:GY0 + p[1] * CS + CS / 2, r:3, "class":"gx-founder" }); });
    return h + txt(GX0 + GC * CS / 2, 214, "a patch of skin (each square is a group of cells)", "gx-sm", "middle");
  }
  var dIn = $("#gx-d", host);
  function paintCat(){
    var d = S.d, n = Math.pow(2, d), svg2 = $("#gx-cat", host);
    svg2.innerHTML = catSVG(d); dIn.value = d;
    $("#gx-d-out", host).textContent = String(d); dIn.setAttribute("aria-valuetext", d + " divisions");
    svg2.setAttribute("aria-label", "Left: one cell whose nucleus has one active X and one Barr body. Right: a patch of skin grown from 6 starting cells, each with one X silenced at random. After " + d + " divisions each starting cell has become up to " + n + " cells, forming " + (d >= 4 ? "large orange and black patches." : d >= 2 ? "small orange and black patches." : "scattered single cells."));
    $("#gx-dcap", host).textContent = d === 0 ? "Right after inactivation: 6 starting cells, each with one X silenced at random." :
      "After " + d + " division" + (d > 1 ? "s" : "") + ", each starting cell has become up to " + n + " cells, all with the same X silenced. " + (d >= 4 ? "The clones form orange and black patches: a calico. A male, with one X, would be all one colour." : "");
  }
  dIn.addEventListener("input", function(){ S.d = +dIn.value; api.save(); paintCat(); });
  paintCat();

  // ---- station 3: a cell lineage collecting hits ----
  var hAnim = null;
  function geneMarks(x, y, st){
    var h = "";
    [0, 1].forEach(function(c){ var mut = st >= 2 && c === 0; h += sv("rect", { x:x - 15 + c * 16, y:y - 13, width:12, height:10, rx:2, "class":mut ? "gx-gm-mut" : "gx-gm" }) + txt(x - 9 + c * 16, y - 5, "G", mut ? "gx-gmt-on" : "gx-gmt", "middle"); });
    [0, 1].forEach(function(c){ var lost = (c === 0 && st >= 1) || (c === 1 && st >= 3); h += sv("rect", { x:x - 15 + c * 16, y:y + 3, width:12, height:10, rx:2, "class":lost ? "gx-bm-lost" : "gx-bm" }) + txt(x - 9 + c * 16, y + 11, "T", "gx-gmt", "middle") + (lost ? sv("path", { d:"M" + (x - 16 + c * 16) + " " + (y + 2) + " l14 12 M" + (x - 2 + c * 16) + " " + (y + 2) + " l-14 12", "class":"gx-x" }) : ""); });
    return h;
  }
  function linSVG(st, k){
    var h = "", X = [52, 162, 272, 382], Y = 96;
    for (var s = 0; s <= st; s++) {
      var a = s === st ? k : 1, x = X[s];
      if (s > 0) h += op(a, sv("path", { d:"M" + (X[s - 1] + 28) + " " + Y + " L" + (x - 28) + " " + Y, "class":"gx-lin" }) + sv("path", { d:"M" + (X[s - 1] + 20) + " " + (Y + 18) + " L" + (X[s - 1] + 52) + " " + (Y + 52), "class":"gx-lin" }) + sv("circle", { cx:X[s - 1] + 60, cy:Y + 62, r:12, "class":"gx-sib" }) + txt(X[s - 1] + 60, Y + 88, "sister cell", "gx-sm", "middle"));
      h += op(a, sv("circle", { cx:x, cy:Y, r:28, "class":"gx-lcell" + (s === 3 ? " gx-lbad" : "") }) + geneMarks(x, Y, s) + txt(x, Y - 38, s === 0 ? "start" : "hit " + s, "gx-st", "middle"));
    }
    if (st === 3) { var cl = ""; [[430, 62], [446, 96], [430, 130], [458, 66], [462, 124], [416, 160], [444, 162], [452, 40]].forEach(function(p){ cl += sv("circle", { cx:p[0], cy:p[1], r:9, "class":"gx-lcell gx-lbad" }); }); h += op(seg(k, 0.4, 1), cl); }
    return h;
  }
  function paintLin(k){
    var st = S.hit, svg3 = $("#gx-lin", host);
    svg3.innerHTML = linSVG(st, k == null ? 1 : k);
    svg3.setAttribute("aria-label", "A cell lineage after " + st + " hit" + (st === 1 ? "" : "s") + ". " + S3.steps[st]);
    $("#gx-hcap", host).textContent = S3.steps[st];
    $("#gx-ban", host).innerHTML = st === 3 ? "<strong>" + S3.banner + "</strong>" : ""; $("#gx-ban", host).hidden = st !== 3;
    $("#gx-hitr", host).innerHTML = MV.readoutHTML([["Accelerator", st >= 2 ? "Stuck on (1 mutated copy)" : "Normal"], ["Brake copies working", (st >= 3 ? 0 : st >= 1 ? 1 : 2) + " of 2"], ["Division", st === 3 ? "Out of control" : "Controlled"]]);
    var bb = $("#gx-hitb", host);
    MV.keepFocus(bb, function(){ bb.innerHTML = st < 3 ? '<button type="button" class="btn primary sm" data-hit="1" data-k="gxhit"' + (hAnim ? " disabled" : "") + ">Next hit</button>" : '<button type="button" class="btn ghost sm" data-hit="0" data-k="gxhit">Start again</button>'; });
  }
  $("#gx-hitb", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-hit]"); if (!b || b.disabled) return;
    if (b.dataset.hit === "0") { S.hit = 0; api.save(); paintLin(); return; }
    S.hit = Math.min(3, S.hit + 1); api.save();
    if (hAnim) hAnim();
    hAnim = MV.tween({ dur:900, step:function(k){ $("#gx-lin", host).innerHTML = linSVG(S.hit, k); }, done:function(){ hAnim = null; paintLin(); } });
    paintLin(0);
  });
  paintLin();
}

// ---------- Practice 2: Predict the output (number entry and chips, in the plan's order) ----------
// Each item runs as a one-item toolkit activity (numeric or mc) in its own box; the stats add up to "x/6".
function outputAct(host, api, a){
  host.innerHTML = '<div class="gx-out">' + (a.how ? '<p class="how gx-how">' + a.how + "</p>" : "") + a.items.map(function(it){ return '<div class="gx-oi" id="gx-oi-' + it.id + '"></div>'; }).join("") + "</div>";
  var subs = a.items.map(function(it){
    var num = it.kind === "num", item = it;
    if (!num && it.star) { item = {}; Object.keys(it).forEach(function(k){ item[k] = it[k]; }); item.prompt = it.prompt + ' <span class="tag">★</span>'; }
    var sub = { id:a.id + "-" + it.id, type:num ? "numeric" : "mc", title:a.title, summary:a.summary, goal:a.goal, how:num ? "Type a number, then press Check." : "", items:[item] };
    return MV.activityTypes[num ? "numeric" : "mc"]($("#gx-oi-" + it.id, host), sub);
  });
  return {
    stats:function(){
      var f = 0, d = 0, t = 0; subs.forEach(function(s){ var x = s.stats(); f += x.first; d += x.done; t += x.total; });
      return { first:f, total:t, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + t + (d < t ? " (unfinished)" : "") };
    },
    missed:function(){ var g = []; subs.forEach(function(s){ g = g.concat(s.missed()); }); return g; }
  };
}

// ---------- Performance task: Program a cell (the Explore panel switches and the live meter) ----------
var task = (function(){
  var api = null, T = null, Vt = null, tAnim = null;
  var KEYS = ["c", "act", "rep", "iso", "mir", "phos"];
  function read(){ var s = api ? api.S : {}; return { c:s.c || "open", act:+s.act || 0, rep:+s.rep || 0, iso:s.iso || "A", mir:+s.mir || 0, phos:+s.phos || 0, dist:0 }; }
  function key(d){ return KEYS.map(function(k){ return d[k]; }).join("-"); }
  function parse(k){ var p = String(k).split("-"), d = { dist:0 }; KEYS.forEach(function(x, i){ d[x] = x === "c" || x === "iso" ? p[i] : +p[i]; }); return d; }
  function text(d){
    var m = model(d);
    return [d.c + " chromatin", m.act ? "activator" : "no activator", m.rep ? "repressor" : "no repressor", m.mir ? "microRNA" : "no microRNA", "isoform " + (m.B ? "B" : "A"), m.phos ? "phosphorylated" : "not phosphorylated"].join(", ") + " (" + MV.num(m.out) + " per hour)";
  }
  function paintPv(){
    var el = $("#gx-tsvg"); if (!el) return;
    el.innerHTML = ladderSVG(Vt, "gxt"); el.setAttribute("aria-label", describe(read()));
    $("#gx-tpv").innerHTML = MV.readoutHTML(readRows(read()).slice(0, 6));
  }
  function update(){
    var from = Vt, to = vOf(read());
    if (tAnim) tAnim();
    tAnim = MV.tween({ dur:400, step:function(k){ Vt = vMix(from, to, k); paintPv(); }, done:function(){ tAnim = null; Vt = to; paintPv(); } });
  }
  function paintSw(){
    var el = $("#gx-tsw"); if (!el) return;
    MV.keepFocus(el, function(){ el.innerHTML = [["act", "Activator on the enhancer"], ["rep", "Repressor on the silencer"], ["mir", "MicroRNA for Gene X"], ["phos", "Phosphorylation of the protein"]].map(function(x){ return switchHTML(x[0], x[1], +api.S[x[0]], false, "gxtsw"); }).join(""); });
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = a.S;
      if (!s.c) s.c = "open"; if (!s.iso) s.iso = "A"; ["act", "rep", "mir", "phos"].forEach(function(k){ if (s[k] == null) s[k] = 0; });
      inp.innerHTML = '<div class="gx-tin"><div id="gx-tc"></div><div class="gx-sws" id="gx-tsw"></div><div id="gx-ti"></div></div>';
      function upd(){ a.save(); update(); a.update(); }
      radios($("#gx-tc"), { label:"Chromatin", key:"tc", options:[{ id:"open", t:"Open (histones acetylated)" }, { id:"closed", t:"Closed (DNA methylated)" }], value:s.c, onChange:function(v){ s.c = v; upd(); } });
      radios($("#gx-ti"), { label:"Splicing", key:"ti", options:[{ id:"A", t:"Isoform A (exons 1-2-4)" }, { id:"B", t:"Isoform B (exons 1-3-4)" }], value:s.iso, onChange:function(v){ s.iso = v; upd(); } });
      paintSw();
      $("#gx-tsw").addEventListener("click", function(e){ var b = e.target.closest("[data-sw]"); if (!b || b.disabled) return; s[b.dataset.sw] = +s[b.dataset.sw] ? 0 : 1; paintSw(); upd(); });
      pv.innerHTML = '<div class="gx-tpvw"><h4>Gene X in your cell</h4><div class="gx-fig"><svg id="gx-tsvg" viewBox="0 0 ' + LW + " " + LH + '" role="img" focusable="false"></svg></div><dl class="read gx-read" id="gx-tpv" aria-live="polite"></dl></div>';
      Vt = vOf(read()); paintPv();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var m = model(d); return [m.out >= 50 && m.out <= 300, m.B, m.phos]; },
    tips:function(d, r){ var t = T.tips, out = []; if (!r[0]) out.push(t[0], t[1]); if (!r[1] || !r[2]) out.push(t[2]); return out; },
    key:key,
    label:function(k){ return MV.esc(text(parse(k))); },
    text:function(k){ return text(parse(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ output:outputAct },
  task:task
});
})();
