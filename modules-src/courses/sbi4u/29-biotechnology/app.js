// SBI4U 29 Biotechnology: hero (insulin mRNA → cDNA → cut → ligase → recombinant plasmid → bacteria → insulin),
// Biotech toolkit map (S1-style tool gallery with three-frame mini-animations; a route builder on the S9 procedure-lab pattern:
// ordered stations, tile tray, Run with per-station ✓/✗, product panel and readout), "Biotech and society" (tap-to-sort regulator
// boxes, a fictional field-trial table with chip questions, an S12 claim–evidence–reasoning builder), standard practice
// (N6 matching, 4-chip troubleshooting, Spot the Error), "Pick your production line" task (five dropdowns, a live line diagram).
// Colours (plan build notes): plasmid DNA --ink; inserted gene / cDNA --pen; mRNA and guide RNA teal (--bio-nadh);
// insulin brown (--bio-carbon); plant tissue --leaf; GFP glow drawn as --leaf-fill with an --ink outline, always labelled.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (SVG helpers from SBI4U 20 / 14) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "bt-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function op(a, g){ return a == null || a >= 0.98 ? g : a <= 0.02 ? "" : '<g opacity="' + Math.round(a * 100) / 100 + '">' + g + "</g>"; }
function line(x1, y1, x2, y2, cls){ return sv("path", { d:"M" + f1(x1) + " " + f1(y1) + " L" + f1(x2) + " " + f1(y2), "class":cls }); }
function pol(cx, cy, r, a){ var t = a * Math.PI / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; }
function arcD(cx, cy, r, a0, a1){ var p0 = pol(cx, cy, r, a0), p1 = pol(cx, cy, r, a1), sw = ((a1 - a0) % 360 + 360) % 360; return "M" + f1(p0[0]) + " " + f1(p0[1]) + " A" + r + " " + r + " 0 " + (sw > 180 ? 1 : 0) + " 1 " + f1(p1[0]) + " " + f1(p1[1]); }
function arrowR(x1, y, x2, cls){ return line(x1, y, x2, y, cls || "bt-ar") + sv("path", { d:"M" + f1(x2 - 6) + " " + f1(y - 4) + " L" + f1(x2) + " " + f1(y) + " L" + f1(x2 - 6) + " " + f1(y + 4), "class":cls || "bt-ar" }); }
function plain(s){ return MV.plain(String(s == null ? "" : s)); }

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

// ---------- shared drawings ----------
// plasmid ring (--ink) with an optional gap (cut), inserted gene arc (--pen) and marker gene block
function plasmid(cx, cy, r, o){
  o = o || {}; var h = "";
  if (o.gap) h += sv("path", { d:arcD(cx, cy, r, -20, 300), "class":"bt-pl" });
  else h += sv("circle", { cx:cx, cy:cy, r:r, "class":"bt-pl" });
  if (o.gene) h += sv("path", { d:arcD(cx, cy, r, -60, -20), "class":"bt-gene" });
  if (o.marker) h += sv("path", { d:arcD(cx, cy, r, 110, 140), "class":"bt-mkr" });
  return h;
}
function rod(x, y, w, hh, cls){ return sv("rect", { x:x - w / 2, y:y - hh / 2, width:w, height:hh, rx:hh / 2, "class":cls || "bt-bact" }); }
function insulin(x, y, a){ return op(a, sv("rect", { x:x - 8, y:y - 6, width:13, height:5, rx:2.5, "class":"bt-ins" }) + sv("rect", { x:x - 6, y:y + 1, width:17, height:5, rx:2.5, "class":"bt-ins" }) + line(x - 3, y - 1, x - 3, y + 1, "bt-insl") + line(x + 3, y - 1, x + 3, y + 1, "bt-insl")); }
function riceLeaf(x, y, s){ return sv("path", { d:"M" + x + " " + y + " q" + f1(-14 * s) + " " + f1(-30 * s) + " " + f1(-30 * s) + " " + f1(-46 * s), "class":"bt-leafl" }); }
function ricePlant(x, base, k, grain){
  // k 0..1 growth; grain: draw grain heads
  var h = "", ht = lerp(10, 120, k);
  h += line(x, base, x, base - ht, "bt-stem");
  if (k > 0.3) h += riceLeaf(x, base - ht * 0.3, k) + sv("path", { d:"M" + x + " " + f1(base - ht * 0.45) + " q14 -30 30 -46", "class":"bt-leafl" });
  if (grain && k > 0.7) for (var i = 0; i < 7; i++) { var gy = base - ht + 4 + i * 9, gx = x + (i % 2 ? 8 : -8); h += op(seg(k, 0.7, 1), sv("ellipse", { cx:gx, cy:gy, rx:5, ry:3.4, "class":"bt-grain" })); }
  return h;
}
function plateSVG(cx, cy, r){ return sv("ellipse", { cx:cx, cy:cy, rx:r, ry:r * 0.62, "class":"bt-plate" }); }

// ---------- @component S1-style tool cards with three-frame mini-animations (plan Mode 1). mini(id, k 0..1, o) -> SVG (360 × 220) ----------
var W = 360, H = 220;
var MINI = {
  re:function(k){
    var TOP = "CGTGAATTCAT", BOT = "GCACTTAAGTA", x0 = 70, dx = 22, yT = 96, yB = 132;
    var f2 = seg(k, 0.3, 0.6), f3 = seg(k, 0.66, 1), sep = 16 * MV.ease(f3), h = "";
    if (f2 > 0) h += op(f2, sv("rect", { x:x0 + 3 * dx - 11, y:76, width:6 * dx, height:74, rx:6, "class":"bt-site" }));
    function X(i, top){ var left = top ? i <= 3 : i <= 7; return x0 + i * dx + (left ? -sep : sep); }
    // backbones
    h += line(X(0, 1) - 12, yT - 14, X(3, 1) + 8, yT - 14, "bt-dna") + line(X(4, 1) - 8, yT - 14, X(10, 1) + 12, yT - 14, "bt-dna");
    h += line(X(0, 0) - 12, yB + 8, X(7, 0) + 8, yB + 8, "bt-dna") + line(X(8, 0) - 8, yB + 8, X(10, 0) + 12, yB + 8, "bt-dna");
    for (var i = 0; i < 11; i++) {
      var paired = (i <= 3 || i >= 8) || f3 < 0.05;
      if (paired) h += line(X(i, 1), yT + 4, X(i, 1), yB - 12, "bt-bp");
      h += txt(X(i, 1), yT, TOP[i], "bt-base", "middle") + txt(X(i, 0), yB, BOT[i], "bt-base", "middle");
    }
    h += txt(X(0, 1) - 26, yT, "5′", "bt-sm", "middle") + txt(X(10, 1) + 26, yT, "3′", "bt-sm", "middle") + txt(X(0, 0) - 26, yB, "3′", "bt-sm", "middle") + txt(X(10, 0) + 26, yB, "5′", "bt-sm", "middle");
    var sx = lerp(14, x0 + 3.5 * dx, MV.ease(seg(k, 0, 0.33)));
    if (f3 < 0.5) h += txt(sx, 60, "✂", "bt-sc", "middle");
    if (f2 > 0 && f3 < 0.98) h += op(f2 * (1 - f3), sv("path", { d:"M" + f1(x0 + 3.5 * dx) + " 70 L" + f1(x0 + 3.5 * dx) + " 114 L" + f1(x0 + 7.5 * dx) + " 114 L" + f1(x0 + 7.5 * dx) + " 156", "class":"bt-cut" }));
    h += op(f2 * (1 - f3), txt(W / 2, 180, "5′-GAATTC-3′: the recognition site", "bt-sm", "middle"));
    h += op(f3, txt(W / 2, 180, "Staggered cut: sticky ends (unpaired AATT)", "bt-lab", "middle"));
    return h;
  },
  lig:function(k){
    var p = MV.ease(seg(k, 0, 0.4)), pr = seg(k, 0.4, 0.7), lg = seg(k, 0.7, 1), off = 60 * (1 - p), yT = 90, yB = 130, h = "";
    // left piece
    h += line(30, yT, 148, yT, "bt-dna") + line(30, yB, 198, yB, "bt-dna");
    for (var x = 40; x <= 140; x += 14) h += line(x, yT + 4, x, yB - 4, "bt-bp");
    for (x = 156; x <= 192; x += 12) h += line(x, yB - 4, x, yB - (pr > 0.5 ? 20 : 14), "bt-bp");
    // right piece
    h += line(152 + off, yT, 330 + off, yT, "bt-gl") + line(202 + off, yB, 330 + off, yB, "bt-gl");
    for (x = 210; x <= 322; x += 14) h += line(x + off, yT + 4, x + off, yB - 4, "bt-bpg");
    for (x = 156; x <= 192; x += 12) h += line(x + off, yT + 4, x + off, yT + (pr > 0.5 ? 20 : 14), "bt-bpg");
    if (lg > 0.5) h += line(146, yT, 154, yT, "bt-dna") + line(196, yB, 204, yB, "bt-dna");
    if (lg > 0) h += op(lg, sv("rect", { x:124, y:54, width:52, height:20, rx:10, "class":"bt-tag" }) + txt(150, 68, "ligase", "bt-tagt", "middle") + sv("rect", { x:174, y:146, width:52, height:20, rx:10, "class":"bt-tag" }) + txt(200, 160, "ligase", "bt-tagt", "middle"));
    h += txt(80, 70, "plasmid DNA", "bt-sm", "middle") + txt(270 + off * 0.5, 70, "gene", "bt-sm", "middle");
    h += op(pr * (1 - lg), txt(W / 2, 196, "Matching sticky ends pair", "bt-lab", "middle"));
    h += op(lg, txt(W / 2, 196, "Ligase seals both backbone gaps: one molecule", "bt-lab", "middle"));
    return h;
  },
  vec:function(k){
    var b = MV.ease(seg(k, 0.1, 0.55)), c = seg(k, 0.66, 1), h = "";
    if (c < 0.5) {
      h += rod(240, 110, 170, 80) + (c > 0 ? op(c * 2, line(240, 72, 240, 148, "bt-pinch")) : "");
      h += plasmid(lerp(60, 228, b), 110, 24, { gene:true });
    } else {
      h += rod(185, 110, 120, 72) + rod(300, 110, 104, 72);
      h += plasmid(185, 110, 20, { gene:true }) + plasmid(300, 110, 20, { gene:true });
    }
    h += op(1 - b, txt(60, 158, "plasmid + gene", "bt-sm", "middle"));
    h += txt(W / 2, 196, c > 0.5 ? "The plasmid is copied as the cell divides" : b > 0.9 ? "The plasmid is inside the cell" : "The vector carries the gene", "bt-lab", "middle");
    return h;
  },
  rt:function(k){
    var R = "AUGGCCCUGUGG", D = "TACCGGGACACC", x0 = 50, dx = 24, n = Math.round(12 * seg(k, 0.25, 0.9)), h = "";
    h += line(x0 - 10, 70, x0 + 11 * dx + 10, 70, "bt-rna");
    for (var i = 0; i < 12; i++) { h += txt(x0 + i * dx, 90, R[i], "bt-baseR", "middle"); if (i < n) h += line(x0 + i * dx, 96, x0 + i * dx, 110, "bt-bp") + txt(x0 + i * dx, 126, D[i], "bt-baseD", "middle"); }
    if (n > 0) h += line(x0 - 10, 136, x0 + (n - 1) * dx + 10, 136, "bt-gl");
    var ex = x0 + Math.max(0, n - 0.5) * dx;
    if (k > 0.2 && k < 0.95) h += sv("ellipse", { cx:f1(ex), cy:110, rx:22, ry:30, "class":"bt-enz" }) + txt(ex, 164, "reverse transcriptase", "bt-sm", "middle");
    h += txt(x0 - 14, 56, "mRNA (exons only)", "bt-tl");
    if (k >= 0.95) h += txt(W / 2, 170, "cDNA", "bt-tg", "middle");
    h += txt(W / 2, 200, k >= 0.95 ? "A DNA copy of the mRNA, with no introns" : "DNA is written on an RNA template", "bt-lab", "middle");
    return h;
  },
  pcr:function(k, o){
    var c = o && o.c != null ? o.c : Math.min(3, Math.floor(k * 3.999)), n = Math.pow(2, c), h = "";
    h += txt(W / 2, 54, MV.num(n) + (n === 1 ? " copy" : " copies"), "bt-big", "middle") + txt(W / 2, 78, "after " + c + (c === 1 ? " cycle" : " cycles"), "bt-sm", "middle");
    var show = Math.min(n, 32);
    for (var i = 0; i < show; i++) { var col = i % 8, row = Math.floor(i / 8); h += line(48 + col * 34, 104 + row * 18, 76 + col * 34, 104 + row * 18, "bt-gl"); }
    if (n > 32) h += txt(W / 2, 186, "… only 32 of " + MV.num(n) + " drawn", "bt-sm", "middle");
    h += txt(W / 2, 208, "Each cycle doubles the copies", "bt-lab", "middle");
    return h;
  },
  gel:function(k){
    var h = sv("rect", { x:90, y:36, width:180, height:150, rx:6, "class":"bt-gelbg" }), e = MV.ease(k);
    var lanes = [[130, [0.85, 0.45]], [180, [0.65]], [230, [0.9, 0.55, 0.25]]];
    lanes.forEach(function(L){ h += sv("rect", { x:L[0] - 14, y:44, width:28, height:7, rx:1, "class":"bt-well" }); L[1].forEach(function(s){ var y = 52 + e * (1 - s) * 124; h += sv("rect", { x:L[0] - 13, y:f1(y), width:26, height:5, rx:1.5, "class":"bt-band" }); }); });
    h += txt(80, 50, "−", "bt-lab", "end") + txt(80, 184, "+", "bt-lab", "end") + txt(280, 58, "large", "bt-sm") + txt(280, 178, "small", "bt-sm");
    h += txt(W / 2, 208, k > 0.66 ? "Fragments sorted by size: small ones move farthest" : "DNA moves toward +", "bt-lab", "middle");
    return h;
  },
  seq:function(k){
    var S = "ATGGCCCTGTGGATG", n = Math.round(15 * k), h = "";
    for (var i = 0; i < 15; i++) { var x = 30 + i * 20; h += sv("rect", { x:x - 9, y:84, width:18, height:26, rx:3, "class":"bt-box" + (i < n ? " on" : "") }); if (i < n) h += txt(x, 102, S[i], "bt-base", "middle"); }
    h += arrowR(30, 132, Math.max(40, 30 + n * 20), "bt-ar");
    h += txt(30, 70, "read-out", "bt-sm");
    h += txt(W / 2, 200, "The exact order of bases, one by one", "bt-lab", "middle");
    return h;
  },
  cr:function(k){
    var a = MV.ease(seg(k, 0, 0.4)), b = seg(k, 0.4, 0.7), c = MV.ease(seg(k, 0.7, 1)), g = 8 * c, h = "";
    if (b > 0) h += op(b, sv("rect", { x:186, y:108, width:64, height:36, rx:4, "class":"bt-site" }));
    h += line(30, 120, 218 - g, 120, "bt-dna") + line(222 + g, 120, 330, 120, "bt-dna") + line(30, 136, 218 - g, 136, "bt-dna") + line(222 + g, 136, 330, 136, "bt-dna");
    var cx = lerp(80, 218, a), cy = lerp(56, 92, a);
    h += sv("ellipse", { cx:f1(cx), cy:f1(cy), rx:36, ry:24, "class":"bt-enz" }) + txt(cx, cy + 4, "Cas9", "bt-sm", "middle");
    h += line(cx - 28, cy + 18 + b * 6, cx + 28, cy + 18 + b * 6, "bt-rna");
    h += txt(cx + 42, cy - 10, "guide RNA", "bt-tl");
    h += txt(W / 2, 196, c > 0 ? "Cut at the chosen site, inside the cell" : b > 0 ? "The guide RNA lines up with its target" : "The guide RNA leads Cas9 to a target", "bt-lab", "middle");
    return h;
  },
  tf:function(k){
    var a = seg(k, 0, 0.33), b = seg(k, 0.33, 0.66), c = seg(k, 0.66, 1), h = "", T = [2, 9];
    if (c > 0) h += op(c, plateSVG(W / 2, 112, 160));
    for (var i = 0; i < 12; i++) {
      var x = 75 + (i % 4) * 70, y = 64 + Math.floor(i / 4) * 46, tr = T.indexOf(i) >= 0;
      if (tr) { h += sv("circle", { cx:x, cy:y, r:f1(12 + 8 * c), "class":"bt-cellc" + (c > 0.5 ? " col" : "") }); if (b > 0) h += op(b, plasmid(x, y, 5, { gene:true })); else h += plasmid(x + lerp(26, 12, a), y - 14, 5, { gene:true }); }
      else h += op(1 - 0.8 * c, sv("circle", { cx:x, cy:y, r:12, "class":"bt-cellc" }));
    }
    h += txt(W / 2, 204, c > 0 ? "Selection plate: only transformed cells grow" : b > 0 ? "A few cells took up the plasmid" : "Plasmids are added to the cells", "bt-lab", "middle");
    return h;
  },
  clone:function(k){
    var b = MV.ease(seg(k, 0.33, 0.66)), c = seg(k, 0.66, 1), h = "";
    h += op(1 - c, sv("circle", { cx:80, cy:104, r:34, "class":"bt-cellc" }) + txt(80, 158, "body cell", "bt-sm", "middle"));
    h += sv("circle", { cx:250, cy:104, r:46, "class":"bt-cellc" }) + txt(250, 168, c > 0.5 ? "embryo" : "egg cell, nucleus removed", "bt-sm", "middle");
    if (b < 1) h += sv("circle", { cx:250, cy:104, r:13, "class":"bt-nucE" });
    var nx = lerp(80, 250, b); if (c < 0.5) h += sv("circle", { cx:f1(nx), cy:104, r:12, "class":"bt-nuc" });
    if (c > 0) for (var i = 0; i < 8; i++) { var p = pol(250, 104, 20, i * 45); h += op(c, sv("circle", { cx:f1(p[0]), cy:f1(p[1]), r:12, "class":"bt-emb" })); }
    h += txt(W / 2, 204, c > 0 ? "A whole organism with the donor’s nuclear DNA" : "The body-cell nucleus moves into the egg", "bt-lab", "middle");
    return h;
  },
  gun:function(k){
    var a = seg(k, 0, 0.6), c = seg(k, 0.66, 1), h = "";
    h += sv("rect", { x:20, y:96, width:62, height:26, rx:5, "class":"bt-box" }) + txt(51, 140, "gene gun", "bt-sm", "middle");
    for (var i = 0; i < 12; i++) { var x = 180 + (i % 4) * 40, y = 70 + Math.floor(i / 4) * 40; h += sv("rect", { x:x - 17, y:y - 17, width:34, height:34, rx:4, "class":"bt-leaf" }); if ((i === 5 || i === 10) && c > 0) h += op(c, line(x - 8, y, x + 8, y, "bt-gl")); }
    for (var j = 0; j < 5; j++) { var px = lerp(84, 186 + j * 26, a), py = lerp(109, 72 + j * 18, a); if (a < 1) h += sv("circle", { cx:f1(px), cy:f1(py), r:3, "class":"bt-dot" }); }
    h += txt(W / 2, 204, c > 0 ? "The DNA enters a few plant cells" : "DNA-coated particles are shot into plant cells", "bt-lab", "middle");
    return h;
  },
  plant:function(k){
    var h = sv("ellipse", { cx:W / 2, cy:176, rx:90, ry:14, "class":"bt-plate" });
    h += op(1 - seg(k, 0.3, 0.5), sv("circle", { cx:W / 2, cy:168, r:12, "class":"bt-leaf" }));
    h += ricePlant(W / 2, 172, seg(k, 0.3, 1), false);
    h += txt(W / 2, 206, k > 0.6 ? "A whole plant grown from transformed cells" : "Transformed cells grow into a plant", "bt-lab", "middle");
    return h;
  },
  tank:function(k){
    var h = sv("path", { d:"M110 30 L110 170 Q110 190 130 190 L230 190 Q250 190 250 170 L250 30", "class":"bt-tank" }) + sv("rect", { x:112, y:60, width:136, height:128, rx:8, "class":"bt-broth" });
    var n = Math.round(lerp(4, 40, k)), r = MV.bio.rng("bt-tank");
    for (var i = 0; i < 40; i++) { var x = r.range(124, 236), y = r.range(72, 178); if (i < n) h += rod(x, y, 12, 5); }
    h += txt(W / 2, 208, "A fermentation tank grows billions of cells", "bt-lab", "middle");
    return h;
  },
  pure:function(k){
    var a = seg(k, 0, 0.5), b = seg(k, 0.5, 1), h = "", r = MV.bio.rng("bt-pure");
    h += sv("rect", { x:30, y:60, width:110, height:100, rx:8, "class":"bt-box" }) + txt(85, 176, "mixture", "bt-sm", "middle");
    for (var i = 0; i < 14; i++) { var x = r.range(42, 128), y = r.range(72, 148); if (i % 2) h += insulin(x, y, 1 - b * 0.4); else h += op(1 - b, sv("circle", { cx:f1(x), cy:f1(y), r:4, "class":"bt-dot2" })); }
    h += arrowR(150, 110, 200) + sv("rect", { x:220, y:60, width:70, height:100, rx:10, "class":"bt-box" }) + txt(255, 176, "pure protein", "bt-sm", "middle");
    for (i = 0; i < 6; i++) h += insulin(240 + (i % 2) * 26, 80 + Math.floor(i / 2) * 26, a);
    h += txt(W / 2, 206, "Only the wanted protein is kept", "bt-lab", "middle");
    return h;
  }
};
function mini(id, k, o){ return (MINI[id] || MINI.re)(clamp(k, 0, 1), o); }
// P2 / T4 failure: unmatched ends approach, fail to pair, drift apart; the plasmid closes on itself
function endsSVG(k){
  var a = MV.ease(seg(k, 0, 0.35)), b = seg(k, 0.35, 0.55), c = MV.ease(seg(k, 0.55, 1)), h = "";
  h += plasmid(120, 108, 52, { gap:c < 0.6 });
  if (c >= 0.6) h += op(seg(c, 0.6, 1), sv("path", { d:arcD(120, 108, 52, -60, -20), "class":"bt-pl" }));
  var gx = lerp(300, 196, a) + lerp(0, 120, c), wig = b > 0 && b < 1 ? Math.sin(b * 18) * 3 : 0;
  h += line(gx - 30 + wig, 70, gx + 30 + wig, 70, "bt-gl");
  h += txt(gx + wig, 60, "gene: AGCT ends", "bt-tg", "middle") + txt(178, 154, "plasmid: AATT ends", "bt-sm", "middle");
  if (b > 0 && c < 0.6) h += op(b, txt(176, 40, "✗ the ends don’t pair", "bt-lab", "middle"));
  h += op(c, txt(W / 2, 204, "Plasmid closed on itself: no recombinant plasmid", "bt-lab", "middle"));
  return h;
}
// P3: 40 cells, 2 of which took up the plasmid, spread on a selection plate
var PLATE = (function(){ var r = MV.bio.rng("bt-plate"), a = []; for (var i = 0; i < 40; i++) { var t = r.range(0, Math.PI * 2), d = Math.sqrt(r()) ; a.push({ x:W / 2 + Math.cos(t) * d * 138, y:110 + Math.sin(t) * d * 76, cx:W / 2 + Math.cos(t) * d * 34, cy:110 + Math.sin(t) * d * 26, tr:i === 7 || i === 23 }); } return a; })();
function plateScene(k){
  var a = MV.ease(seg(k, 0, 0.4)), b = seg(k, 0.4, 0.7), c = seg(k, 0.7, 1), h = plateSVG(W / 2, 110, 160);
  PLATE.forEach(function(p){
    var x = lerp(p.cx, p.x, a), y = lerp(p.cy, p.y, a);
    if (p.tr) { h += sv("circle", { cx:f1(x), cy:f1(y), r:f1(5 + 11 * c), "class":"bt-cellc" + (c > 0.5 ? " col" : "") }) + plasmid(x, y, 3, { gene:true }); }
    else h += op(1 - 0.85 * b, sv("circle", { cx:f1(x), cy:f1(y), r:5, "class":"bt-cellc" }));
  });
  h += txt(W / 2, 208, c > 0 ? "2 colonies grow: one from each transformed cell" : a > 0.5 ? "Spread on the selection plate" : "40 cells; 2 took up the plasmid", "bt-lab", "middle");
  return h;
}
// product panel scenes
function productSVG(res, goal){
  var kind = res.kind, h = "", i, r = MV.bio.rng("bt-prod");
  if (kind === "closed") return endsSVG(1);
  if (kind === "none" || kind === "noPlants" || kind === "noCells") {
    h += sv("rect", { x:80, y:50, width:200, height:110, rx:10, "class":"bt-empty" }) + txt(W / 2, 112, "No product", "bt-big", "middle");
    return h;
  }
  if (goal === "rice") {
    var dim = kind === "noCheck" || kind === "mixed";
    h += sv("ellipse", { cx:W / 2, cy:184, rx:110, ry:12, "class":"bt-soil" });
    h += op(dim ? 0.5 : 1, ricePlant(140, 182, 1, true) + ricePlant(220, 182, 1, true));
    if (dim) h += txt(W / 2, 40, "?", "bt-big", "middle");
    return h;
  }
  if (kind === "faulty") {
    var pts = [];
    for (i = 0; i < 18; i++) pts.push([60 + i * 14, 112 + Math.sin(i * 1.3) * 20 + (i % 5 === 0 ? 14 : 0)]);
    [[4, 7], [11, 14]].forEach(function(s){ h += sv("rect", { x:pts[s[0]][0] - 9, y:76, width:(s[1] - s[0]) * 14 + 18, height:76, rx:6, "class":"bt-site" }); });
    h += sv("path", { d:pts.map(function(p, j){ return (j ? "L" : "M") + f1(p[0]) + " " + f1(p[1]); }).join(" "), "class":"bt-chain" });
    pts.forEach(function(p, j){ var intr = (j >= 4 && j <= 7) || (j >= 11 && j <= 14); h += sv("circle", { cx:f1(p[0]), cy:f1(p[1]), r:6, "class":intr ? "bt-beadX" : "bt-bead" }); });
    h += txt(130, 66, "intron-coded segments", "bt-sm", "middle");
    return h;
  }
  if (goal === "gfp") {
    h += plateSVG(W / 2, 110, 150);
    for (i = 0; i < (kind === "mixed" ? 3 : 9); i++) { var x = r.range(110, 250), y = r.range(80, 140); h += sv("circle", { cx:f1(x), cy:f1(y), r:9, "class":"bt-glow" }); }
    if (kind === "mixed") for (i = 0; i < 30; i++) h += sv("circle", { cx:f1(r.range(96, 264)), cy:f1(r.range(74, 148)), r:4, "class":"bt-cellc" });
    h += txt(W / 2, 182, "glows green under blue light", "bt-sm", "middle");
    return h;
  }
  // insulin
  if (kind === "mixed") {
    h += plateSVG(W / 2, 110, 150);
    for (i = 0; i < 34; i++) h += sv("circle", { cx:f1(r.range(96, 264)), cy:f1(r.range(74, 148)), r:4, "class":"bt-cellc" });
    for (i = 0; i < 3; i++) h += insulin(r.range(130, 230), r.range(90, 130), 1);
    return h;
  }
  if (kind === "noTank") { h += plateSVG(W / 2, 110, 150); for (i = 0; i < 4; i++) h += sv("circle", { cx:120 + i * 40, cy:110, r:10, "class":"bt-cellc col" }); return h; }
  for (i = 0; i < 8; i++) h += rod(46 + (i % 2) * 40, 52 + Math.floor(i / 2) * 34, 30, 13);
  for (i = 0; i < 16; i++) h += insulin(150 + (i % 4) * 46, 56 + Math.floor(i / 4) * 34, kind === "noCheck" ? 0.5 : 1);
  if (kind === "noPure") for (i = 0; i < 14; i++) h += sv("circle", { cx:f1(r.range(140, 330)), cy:f1(r.range(48, 170)), r:4, "class":"bt-dot2" });
  if (kind === "noCheck") h += txt(255, 40, "?", "bt-big", "middle");
  return h;
}

// ---------- @component routeBuilder (S9 procedure-lab pattern: ordered stations, consequences shown on Run) ----------
// runModel(goal, slots, R) -> {steps:[{slot, tile, ok, msg}], stop, kind, product, problem, dna, cells, n, g}
function runModel(goal, slots, R){
  var plant = goal === "rice", steps = [], stop = null, n = 0, all = slots.filter(Boolean);
  var g = { gene:null, introns:false, intronSlot:-1, cut:null, dna:"none", cells:"none", sel:false, plants:false, checked:false, tank:false, pure:false };
  for (var i = 0; i < slots.length && !stop; i++) {
    var t = slots[i]; if (!t) continue; n++;
    var m = null, rest = slots.slice(i + 1);
    if (t === "T1" || t === "T2") { if (g.cut) m = R.geneLate; else { g.gene = g.gene || t; if (t === "T2") { g.introns = true; g.intronSlot = i; } g.dna = "gene"; } }
    else if (t === "T3" || t === "T4") { if (!g.gene) m = R.noGene; else if (g.cut) m = R.cutTwice; else if (t === "T4") { g.cut = "diff"; g.dna = "closed"; m = R.t4; } else { g.cut = "same"; g.dna = "cut"; } }
    else if (t === "T5") { if (!g.cut) m = R.t5; else if (g.dna === "recomb") m = R.sealTwice; else g.dna = "recomb"; }
    else if (t === "T6") { if (plant) m = R.t6rice; else if (g.dna !== "recomb") m = g.cut ? R.notJoined : R.notJoined; else if (g.cells !== "none") m = R.twice; else g.cells = "mixed"; }
    else if (t === "T7") { if (!plant) m = R.t7bact; else if (g.dna !== "recomb") m = R.notJoined; else if (g.cells !== "none") m = R.twice; else g.cells = "mixed"; }
    else if (t === "T8") { if (g.cells === "none") m = R.t8early; else { g.sel = true; g.cells = "sel"; } }
    else if (t === "T9") { if (!plant) m = R.t9bact; else if (g.cells === "none") m = R.t9early; else g.plants = true; }
    else if (t === "T10" || t === "T11") {
      if (g.cells === "none") m = R.checkEarly;
      else if (g.tank) m = R.checkLate;
      else if (!g.sel && rest.indexOf("T8") >= 0) m = R.checkSel;
      else if (plant && !g.plants && rest.indexOf("T9") >= 0) m = R.checkPlant;
      else g.checked = true;
    }
    else if (t === "T12") { if (plant) m = R.t12rice; else if (g.cells === "none") m = R.t12; else g.tank = true; }
    else if (t === "T13") { if (plant) m = R.t13rice; else if (!g.tank) m = R.t13early; else g.pure = true; }
    else if (t === "T14") m = plant ? R.t14rice : R.t14bact;
    else if (t === "T15") m = R.t15;
    steps.push({ slot:i, tile:t, ok:!m, msg:m });
    if (m) stop = { slot:i, msg:m };
  }
  var res = { steps:steps, stop:stop, n:n, g:g, kind:"working", problem:"", plant:plant };
  if (!n) { res.kind = "none"; res.problem = R.empty; }
  else if (stop) { res.kind = stop && slots[stop.slot] === "T4" ? "closed" : "none"; res.problem = "Station " + (stop.slot + 1) + ": " + stop.msg; }
  else if (g.cells === "none") { res.kind = "noCells"; res.problem = R.noCells; }
  else if (!plant && g.introns) { res.kind = "faulty"; res.problem = "Station " + (g.intronSlot + 1) + ": " + R.introns; }
  else if (!g.sel) { res.kind = "mixed"; res.problem = "No selection station: " + R.mixed; }
  else if (plant && !g.plants) { res.kind = "noPlants"; res.problem = R.noPlants; }
  else if (goal === "insulin" && !g.tank) { res.kind = "noTank"; res.problem = R.noTank; }
  else if (goal === "insulin" && !g.pure) { res.kind = "noPure"; res.problem = R.noPure; }
  else if (goal !== "gfp" && !g.checked) { res.kind = "noCheck"; res.problem = R.noCheck; }
  var GN = { insulin:"insulin", gfp:"GFP", rice:"beta-carotene" }[goal];
  res.product = {
    working:{ insulin:"Working human insulin", gfp:"Glowing colonies (GFP made)", rice:"Golden grain: beta-carotene in the grain" }[goal],
    faulty:"Faulty protein (introns not removed)", mixed:"Unreliable: you can’t tell which cells have the gene", noTank:"Not enough: only a few colonies",
    noPure:"Insulin mixed with bacterial proteins", noCheck:goal === "rice" ? "Golden grain, but the insert was never checked" : "Insulin, but the insert was never checked",
    noPlants:"None", noCells:"None", none:"None", closed:"None" }[res.kind];
  var gname = GN + (plant ? " gene" : g.introns ? " gene (with introns)" : " cDNA");
  res.dna = { none:"None yet", gene:g.introns && !plant ? "Gene copy with introns (from chromosome DNA)" : g.gene === "T1" ? "cDNA copy of the gene (no introns)" : "Gene copy (from chromosome DNA)",
    cut:"Plasmid and gene not joined", closed:"Plasmid closed on itself", recomb:"Recombinant plasmid: " + gname + " inside" }[g.dna];
  res.cells = g.cells === "none" ? "No cells yet" : g.cells === "mixed" ? "Mixed: most cells have no plasmid" :
    plant ? (g.plants ? "Whole rice plants grown from transformed cells" : "Transformed plant cells only (selected)") : (g.tank ? "Transformed cells only (selected), grown in a tank" : "Transformed cells only (selected)");
  return res;
}

// ---------- Explore: Biotech toolkit map ----------
var EXF = null;
function explore(host, api){
  var C = api.content, S = api.S, R = C.rules, NS = 9;
  var D = { mode:"gallery", card:"re", goal:"insulin", slots:[], sel:0, ran:null };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = Array.isArray(D[k]) ? D[k].slice() : D[k]; });
  if (!Array.isArray(S.slots)) S.slots = [];
  for (var i = 0; i < NS; i++) if (S.slots[i] === undefined) S.slots[i] = null;
  S.slots.length = NS; S.sel = clamp(+S.sel || 0, 0, NS - 1);
  var busy = false, anim = null, scene = null, cap = "", pend = null, runIdx = -1, runShow = null, focusProb = false;
  host.innerHTML = '<div class="bt-ex"><div class="pg bt-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="bt-stage"><p class="bt-ptitle" id="bt-ptitle" aria-hidden="true"></p><svg id="bt-svg" viewBox="0 0 ' + W + " " + H + '" role="img" focusable="false"></svg></div>' +
      '<p class="bt-cap" id="bt-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="bt-mode"></div>' +
      '<div class="bt-panel" id="bt-galp"><p class="how">Tap a tool card to watch what it does.</p><div class="bt-cards" id="bt-cards" role="group" aria-label="Tool cards"></div>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-ga="replay" data-k="btreplay">Replay animation</button></div></div>' +
      '<div class="bt-panel" id="bt-rtp"><div id="bt-goal"></div>' +
        '<h4 class="bt-h4">Station track</h4><ol class="bt-track" id="bt-track"></ol>' +
        '<div class="q-actions" id="bt-acts"></div><div id="bt-prob" class="bt-prob" tabindex="-1" aria-live="polite"></div>' +
        '<h4 class="bt-h4" id="bt-trayh"></h4><ul class="bt-tray" id="bt-tray" aria-labelledby="bt-trayh"></ul></div></div>' +
    '<div class="pg-read"><dl class="read" id="bt-read" aria-live="polite"></dl><div id="bt-note"></div></div></div></div>';
  var svg = $("#bt-svg", host);
  var modeR = radios($("#bt-mode", host), { label:"Mode", key:"m", options:[{ id:"gallery", t:"Gallery" }, { id:"route", t:"Route builder" }], value:S.mode, onChange:function(v){ stop(); S.mode = v; scene = null; cap = ""; api.save(); paintAll(); if (v === "gallery") playCard(); } });
  function unlocked(){ var c = MV.S && MV.S.chal && MV.S.chal.tc1; return !!(c && c.solved); }
  function goalOpts(){ return C.goalsList.map(function(g){ return { id:g.id, t:g.t + (g.id === "rice" && !unlocked() ? " (unlocks after challenge 1)" : ""), dis:g.id === "rice" && !unlocked() }; }); }
  if (S.goal === "rice" && !unlocked()) S.goal = "insulin";
  var goalR = radios($("#bt-goal", host), { label:"Goal", key:"g", cls:"chips", options:goalOpts(), value:S.goal, onChange:function(v){ stop(); S.goal = v; S.ran = null; scene = null; cap = ""; api.save(); paintAll(); MV.changed(); } });
  document.addEventListener("click", function(e){ if (e.target.closest && e.target.closest("#chal")) setTimeout(function(){ goalR.setOptions(goalOpts()); }, 0); });

  function sig(){ return S.goal + "|" + S.slots.map(function(t){ return t || "-"; }).join(","); }
  function tile(id){ return byId(C.tiles, id); }
  function model(){ return runModel(S.goal, S.slots, R); }
  function route(){ return S.slots.filter(Boolean); }
  function stop(){ if (anim) { anim(); anim = null; } }

  // ---- gallery ----
  function playCard(){
    stop(); scene = { kind:"card", id:S.card, k:0 }; paintStage();
    anim = MV.tween({ dur:2700, ease:lin, step:function(k){ scene.k = k; paintStage(); }, done:function(){ anim = null; scene.k = 1; paintStage(); } });
  }
  $("#bt-cards", host).addEventListener("click", function(e){ var b = e.target.closest("[data-card]"); if (!b || busy) return; S.card = b.dataset.card; api.save(); paintCards(); paintRead(); playCard(); });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-ga]"); if (!b || b.disabled || busy) return; playCard(); });

  // ---- route builder ----
  function place(t){
    if (busy) return;
    var cur = S.slots.indexOf(t);
    if (cur >= 0) S.slots[cur] = null;
    S.slots[S.sel] = t;
    var nx = -1; for (var j = 1; j <= NS; j++) { var q = (S.sel + j) % NS; if (!S.slots[q]) { nx = q; break; } }
    if (nx >= 0) S.sel = nx;
    routeChanged();
  }
  function routeChanged(){ S.ran = null; scene = null; cap = ""; runIdx = -1; api.save(); paintAll(); MV.changed(); }
  $("#bt-track", host).addEventListener("click", function(e){ var b = e.target.closest("[data-slot]"); if (!b || busy) return; S.sel = +b.dataset.slot; api.save(); paintTrack(); paintTray(); });
  $("#bt-tray", host).addEventListener("click", function(e){ var b = e.target.closest("[data-tile]"); if (!b || b.disabled || busy) return; place(b.dataset.tile); });
  $("#bt-acts", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-ra]"); if (!b || b.disabled || busy) return;
    var a = b.dataset.ra;
    if (a === "run") runRoute(null);
    else if (a === "clear") { S.slots = S.slots.map(function(){ return null; }); S.sel = 0; routeChanged(); }
    else if (a === "remove") { S.slots[S.sel] = null; routeChanged(); }
    else if (a === "tc2") { S.goal = "insulin"; goalR.set("insulin"); S.slots = C.tc2Route.slice(); S.sel = 0; routeChanged(); }
  });
  function runRoute(after){
    stop(); var res = model(); busy = true; runIdx = -1; runShow = res; scene = null; cap = ""; paintAll();
    var steps = res.steps, i = 0;
    function next(){
      if (i >= steps.length) { finishRun(res, after); return; }
      var st = steps[i], tl = tile(st.tile); runIdx = st.slot; paintTrack();
      cap = "Station " + (st.slot + 1) + ": " + plain(tl.t) + (st.ok ? "" : ". ✗ " + st.msg);
      var isT4 = !st.ok && st.tile === "T4";
      scene = isT4 ? { kind:"ends", k:0 } : { kind:"card", id:tl.card, k:0, bad:!st.ok, slot:st.slot };
      paintStage(); paintCap();
      anim = MV.tween({ dur:isT4 ? 2400 : 850, ease:lin, step:function(k){ scene.k = k; paintStage(); }, done:function(){ anim = null; scene.k = 1; paintStage(); i++; if (!st.ok) { finishRun(res, after); return; } MV.wait(150, next); } });
    }
    if (!steps.length) { finishRun(res, after); return; }
    next();
  }
  function finishRun(res, after){
    busy = false; runIdx = -1; runShow = null; S.ran = sig(); api.save();
    scene = res.kind === "closed" ? { kind:"ends", k:1 } : { kind:"product", res:res };
    cap = res.problem ? "Product: " + res.product + ". First problem: " + res.problem : "Product: " + res.product + ". Every link worked.";
    paintAll(); MV.changed();
    if (after) { after(); return; }
    var pb = $("#bt-prob", host); if (res.problem && pb) pb.focus({ preventScroll:true });
  }

  // ---- painting ----
  function paintCards(){
    var box = $("#bt-cards", host);
    MV.keepFocus(box, function(){ box.innerHTML = C.cards.map(function(c){ return '<button type="button" class="bt-card" data-card="' + c.id + '" data-k="btc' + c.id + '" aria-pressed="' + (S.card === c.id) + '"' + (busy ? " disabled" : "") + ">" + c.t + "</button>"; }).join(""); });
  }
  function paintTrack(){
    var tr = $("#bt-track", host), last = S.ran === sig() ? model() : runShow, stMap = {};
    if (last) last.steps.forEach(function(s){ stMap[s.slot] = s; });
    MV.keepFocus(tr, function(){
      tr.innerHTML = S.slots.map(function(t, j){
        var tl = t ? tile(t) : null, s = stMap[j], showMark = s && (runShow ? j < runIdx || (j === runIdx && scene && scene.k >= 1) : true);
        var mk = showMark ? (s.ok ? '<span class="bt-mk ok" aria-hidden="true">✓</span>' : '<span class="bt-mk no" aria-hidden="true">✗</span>') : "";
        var lab = "Station " + (j + 1) + ": " + (tl ? plain(tl.t) : "empty") + (showMark ? (s.ok ? ", passed" : ", stopped here") : "") + (S.sel === j ? ", selected" : "");
        return '<li><button type="button" class="bt-slot' + (t ? "" : " empty") + (runIdx === j ? " cur" : "") + '" data-slot="' + j + '" data-k="bts' + j + '" aria-pressed="' + (S.sel === j) + '" aria-label="' + MV.esc(lab) + '"' + (busy ? " disabled" : "") + '><span class="bt-num" aria-hidden="true">' + (j + 1) + '</span><span class="bt-sl" aria-hidden="true">' + (tl ? '<b>' + t + "</b> " + tl.t : "empty") + "</span>" + mk + (runIdx === j ? '<span class="bt-tok" aria-hidden="true"></span>' : "") + "</button></li>";
      }).join("");
    });
  }
  function paintTray(){
    $("#bt-trayh", host).textContent = "Choose a tile for station " + (S.sel + 1);
    var tr = $("#bt-tray", host);
    MV.keepFocus(tr, function(){
      tr.innerHTML = C.tiles.map(function(t){ var at = S.slots.indexOf(t.id); return '<li><button type="button" class="bt-tile' + (at >= 0 ? " used" : "") + '" data-tile="' + t.id + '" data-k="btt' + t.id + '"' + (busy ? " disabled" : "") + '><b>' + t.id + "</b> " + t.t + (at >= 0 ? ' <span class="bt-at">(at station ' + (at + 1) + ")</span>" : "") + "</button></li>"; }).join("");
    });
    var acts = $("#bt-acts", host);
    MV.keepFocus(acts, function(){
      acts.innerHTML = '<button type="button" class="btn primary sm" data-ra="run" data-k="btrun"' + (busy ? " disabled" : "") + ">Run route</button>" +
        '<button type="button" class="btn ghost sm" data-ra="clear" data-k="btclr"' + (busy ? " disabled" : "") + ">Clear</button>" +
        '<button type="button" class="btn ghost sm" data-ra="remove" data-k="btrem"' + (busy || !S.slots[S.sel] ? " disabled" : "") + ">Remove tile from station " + (S.sel + 1) + "</button>" +
        '<button type="button" class="btn ghost sm" data-ra="tc2" data-k="bttc2"' + (busy ? " disabled" : "") + ">Load challenge 2’s route</button>";
    });
  }
  function paintProb(){
    var pb = $("#bt-prob", host), res = S.ran === sig() ? model() : null;
    pb.innerHTML = res ? (res.problem ? MV.fbHTML("bad", "<strong>First problem.</strong> " + res.problem) : MV.fbHTML("good", "<strong>✓ The route works.</strong> " + res.product + ".")) : "";
  }
  function paintRead(){
    var rows, note = "";
    if (S.mode === "gallery") {
      var c = byId(C.cards, S.card) || C.cards[0], d = c.deeper ? C.deeper[c.deeper] : null;
      rows = [["Tool", c.t], ["Problem it solves", c.problem], ["Goes deeper in", d ? '<a href="' + d.file + '">Module ' + d.t + "</a>" : "This module"]];
      if (c.note) note = '<p class="tiny bt-fn">' + c.note + "</p>";
    } else {
      var res = S.ran === sig() ? model() : null, g = byId(C.goalsList, S.goal), wait = "Press Run route";
      rows = [["Goal", g.t], ["Stations placed", String(route().length)], ["DNA state", res ? res.dna : wait], ["Cells", res ? res.cells : wait], ["Product", res ? res.product : wait], ["First problem", res ? (res.problem || "—") : wait]];
    }
    $("#bt-read", host).innerHTML = MV.readoutHTML(rows); $("#bt-note", host).innerHTML = note;
  }
  function stageTitle(){
    if (!scene) return S.mode === "gallery" ? "" : "Product panel";
    if (scene.kind === "card") { if (scene.slot != null) return "Station " + (scene.slot + 1); var c = byId(C.cards, scene.id); return c ? c.t : ""; }
    if (scene.kind === "product") return "Product: " + plain(scene.res.product);
    if (scene.kind === "ends") return "Two different enzymes";
    if (scene.kind === "plate") return "Selection plate";
    if (scene.kind === "pcr") return "PCR";
    return "";
  }
  function stageSVG(){
    if (!scene) {
      if (S.mode === "gallery") return mini(S.card, 1);
      var res = S.ran === sig() ? model() : null;
      if (res) return res.kind === "closed" ? endsSVG(1) : productSVG(res, S.goal);
      return sv("rect", { x:60, y:50, width:240, height:110, rx:10, "class":"bt-empty" }) + txt(W / 2, 100, "Build a route, then", "bt-lab", "middle") + txt(W / 2, 122, "press Run route", "bt-lab", "middle");
    }
    if (scene.kind === "card") { var h = mini(scene.id, scene.k); if (scene.bad && scene.k >= 1) h = op(0.35, h) + txt(W / 2, 110, "✗ Stopped here", "bt-big", "middle"); return h; }
    if (scene.kind === "ends") return endsSVG(scene.k);
    if (scene.kind === "plate") return plateScene(scene.k);
    if (scene.kind === "pcr") return MINI.pcr(1, { c:scene.c });
    if (scene.kind === "product") return productSVG(scene.res, S.goal);
    return "";
  }
  function describe(){
    if (scene && scene.kind === "pcr") return "PCR copy counter: " + Math.pow(2, scene.c) + " copies after " + scene.c + " cycles.";
    if (scene && scene.kind === "plate") return "Selection plate with 40 cells, 2 of which carry the plasmid." + (scene.k >= 1 ? " Only those 2 grew into colonies." : "");
    if (scene && scene.kind === "ends") return "A plasmid and a gene with unmatched sticky ends." + (scene.k >= 1 ? " They didn’t pair; the plasmid closed on itself." : "");
    if (S.mode === "gallery") { var c = byId(C.cards, S.card); return "Mini-animation: " + c.t + ". " + plain(c.problem) + "."; }
    var res = S.ran === sig() ? model() : null;
    return "Product panel. " + (res ? "Product: " + plain(res.product) + "." + (res.problem ? " First problem: " + plain(res.problem) : "") : "The route hasn’t been run yet.");
  }
  function paintStage(){ svg.innerHTML = stageSVG(); svg.setAttribute("aria-label", describe()); $("#bt-ptitle", host).textContent = stageTitle(); }
  function paintCap(){
    var t = cap;
    if (!t) { if (S.mode === "gallery") { var c = byId(C.cards, S.card); t = c.t + ": " + plain(c.problem) + "."; } else t = "Select a station, then choose a tile for it. Press Run route to test the chain."; }
    $("#bt-cap", host).textContent = t;
  }
  function sync(){
    modeR.set(S.mode); goalR.setOptions(goalOpts()); goalR.set(S.goal); modeR.disable(busy); goalR.disable(busy);
    $("#bt-galp", host).hidden = S.mode !== "gallery"; $("#bt-rtp", host).hidden = S.mode !== "route";
    $$("[data-ga]", host).forEach(function(b){ b.disabled = busy; });
  }
  function paintAll(){ sync(); paintCards(); paintTrack(); paintTray(); paintProb(); paintRead(); paintStage(); paintCap(); }
  paintAll();

  // ---- target challenges (plan: exact tests and named wrong states) ----
  function no(m){ return { ok:false, msg:m }; }
  function chal(id){
    var c = byId(C.challenges, id), N = c.named || {}, r = route(), has = function(t){ return r.indexOf(t) >= 0; }, isChk = function(t){ return t === "T10" || t === "T11"; };
    if (id === "tc1") {
      if (S.goal !== "insulin") return no(N.goal);
      if (!r.length) return no(c.general);
      if (has("T14")) return no(N.t14);
      if (has("T15")) return no(N.t15);
      if (has("T2")) return no(N.t2);
      if (has("T4")) return no(N.t4);
      if (!has("T8")) return no(N.noT8);
      if (has("T12") && (!has("T6") || r.indexOf("T12") < r.indexOf("T6"))) return no(N.t12);
      var head = ["T1", "T3", "T5", "T6", "T8"].every(function(t, j){ return r[j] === t; });
      if (head && ((r.length === 8 && isChk(r[5]) && r[6] === "T12" && r[7] === "T13") || (r.length === 9 && isChk(r[5]) && isChk(r[6]) && r[5] !== r[6] && r[7] === "T12" && r[8] === "T13"))) return { ok:true };
      var m = model();
      if (m.problem) return no(m.problem);
      return no(c.general);
    }
    if (id === "tc2") {
      if (S.goal !== "insulin") return no(N.goal);
      var base = C.tc2Route, d = [];
      for (var j = 0; j < NS; j++) if ((S.slots[j] || null) !== (base[j] || null)) d.push(j);
      if (d.length === 2 && S.slots[0] === "T1" && S.slots[1] === "T3") return { ok:true };
      if (d.length > 2) return no(d.length >= 5 ? N.load : N.extra);
      if (d.length === 1 && d[0] === 1 && S.slots[1] === "T3") return no(N.only2);
      if (d.length === 1 && d[0] === 0 && S.slots[0] === "T1") return no(N.only1);
      var m2 = model();
      return no(d.length && m2.problem ? m2.problem : c.general);
    }
    if (id === "tc3") {
      if (!unlocked()) return no(N.locked);
      if (S.goal !== "rice") return no(N.goal);
      if (has("T13")) return no(N.t13);
      if (has("T12")) return no(N.t12);
      if (!has("T9")) return no(N.noT9);
      if (has("T6")) return no(N.t6);
      if (r.length === 7 && (r[0] === "T1" || r[0] === "T2") && r[1] === "T3" && r[2] === "T5" && r[3] === "T7" && r[4] === "T8" && r[5] === "T9" && isChk(r[6])) return { ok:true };
      var m3 = model();
      if (m3.kind === "working" && r.length >= 8) return no(N.long);
      if (m3.problem) return no(m3.problem);
      return no(c.general);
    }
    return { ok:false };
  }
  EXF = { show:function(v){ if (v) { goalR.setOptions(goalOpts()); paintAll(); } else { stop(); if (busy && !pend) { busy = false; runIdx = -1; runShow = null; scene = null; paintAll(); } } } };
  function finishPred(p){
    busy = false; cap = p.reveal; paintAll(); MV.changed();
    var d = pend; pend = null; if (d) MV.wait(250, d);
  }
  return {
    predict:{
      start:function(p){
        stop(); busy = true; var s = p.start;
        if (s.kind === "route") { S.mode = "route"; S.goal = "insulin"; S.slots = s.slots.slice(); S.sel = 0; S.ran = null; scene = null; }
        else if (s.kind === "plate") { S.mode = "route"; scene = { kind:"plate", k:0 }; }
        else if (s.kind === "pcr") { S.mode = "gallery"; S.card = "pcr"; scene = { kind:"pcr", c:0 }; }
        cap = s.kind === "plate" ? "Transformation: 40 cells, and 2 of them took up the plasmid." : s.kind === "pcr" ? "PCR counter: 1 copy." : "";
        api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = done; var s = p.start;
        if (s.kind === "route") { runRoute(function(){ finishPred(p); }); return; }
        if (s.kind === "plate") { anim = MV.tween({ dur:3200, ease:lin, step:function(k){ scene.k = k; paintStage(); }, done:function(){ anim = null; scene.k = 1; finishPred(p); } }); return; }
        anim = MV.tween({ dur:4000, ease:lin, step:function(k){ var c = Math.min(10, Math.floor(k * 10.999)); if (c !== scene.c) { scene.c = c; cap = "PCR counter: " + MV.num(Math.pow(2, c)) + (c === 0 ? " copy." : " copies after " + c + (c === 1 ? " cycle." : " cycles.")); paintStage(); paintCap(); } }, done:function(){ anim = null; scene.c = 10; finishPred(p); } });
      }
    },
    challenge:chal
  };
}

// ---------- hero: storyboard (plan) — pancreas cell → mRNA → cDNA; plasmid cut, gene slips in; ligase seals;
// plasmid into a bacterium that divides to 8; insulin appears. Reduced motion: the final frame with all labels. ----------
function hero(f){
  var box = $("#bt-hero"); if (!box) return;
  var cap = f && f.cap, last = -1, HW = 400, HH = 260;
  var CAPS = ["Insulin mRNA from a pancreas cell is copied into cDNA by reverse transcriptase.", "A restriction enzyme cuts the plasmid open, and the cDNA gene slips into the gap.",
    "DNA ligase seals both joins: a recombinant plasmid.", "The plasmid enters a bacterium, which divides into 2, 4, then 8 cells.", "The bacteria make human insulin."];
  box.innerHTML = '<svg viewBox="0 0 ' + HW + " " + HH + '" class="bt-hsvg" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  function setCap(i){ if (cap && i !== last) { cap.textContent = CAPS[i]; last = i; } }
  var BAC = []; for (var i = 0; i < 8; i++) BAC.push([332 + (i % 2) * 46, 34 + Math.floor(i / 2) * 44]);
  function scene(T){
    var s1 = seg(T, 0.3, 1.6), s1b = seg(T, 1.6, 2.6), s2 = seg(T, 2.8, 3.6), s2b = MV.ease(seg(T, 3.6, 5)), s3 = seg(T, 5.2, 6.2), s4 = MV.ease(seg(T, 6.6, 7.8)), s4b = seg(T, 7.8, 10), s5 = seg(T, 10.2, 11.2);
    var h = "", glow = 0.4 + 0.25 * Math.sin(T * 3);
    // pancreas cell
    h += sv("rect", { x:14, y:24, width:110, height:96, rx:30, "class":"bt-pan" }) + op(T < 2.6 ? glow : 0.3, sv("rect", { x:20, y:30, width:98, height:84, rx:26, "class":"bt-glowc" }));
    h += sv("circle", { cx:69, cy:72, r:16, "class":"bt-nucE" }) + txt(69, 138, "pancreas cell", "bt-sm", "middle");
    // mRNA slides out and becomes cDNA
    var mx = lerp(-60, 0, MV.ease(s1));
    if (s1 > 0) h += op(1 - s1b, sv("path", { d:"M" + f1(24 + mx) + " 168 q12 -8 24 0 t24 0 t24 0 t24 0", "class":"bt-rna" }) + txt(70 + mx, 154, "insulin mRNA", "bt-tl", "middle"));
    if (s1b > 0) h += op(s1b, line(24, 168, 120, 168, "bt-gl") + txt(70, 188, "cDNA", "bt-tg", "middle"));
    h += op(seg(T, 1.6, 2.4), arrowR(124, 168, 132, "bt-ar"));
    // plasmid opens with ✂, gene slips into the gap
    var px = 208, py = 92, pr = 44, open = s2 > 0.5;
    h += plasmid(px, py, pr, { gap:open });
    if (s2 > 0) h += op(T < 5 ? 1 : 0.8, txt(pol(px, py, pr + 18, -40)[0], pol(px, py, pr + 18, -40)[1] + 5, "✂", "bt-sc", "middle"));
    var gp = pol(px, py, pr, -40);
    if (s1b > 0) {
      if (s2b < 1) { var gx = lerp(72, gp[0], s2b), gy = lerp(168, gp[1], s2b); if (s2b > 0) h += line(gx - 14, gy, gx + 14, gy, "bt-gl"); }
      else h += sv("path", { d:arcD(px, py, pr, -60, -20), "class":"bt-gene" });
    }
    if (s3 > 0) { var j1 = pol(px, py, pr + 4, -60), j2 = pol(px, py, pr + 4, -20); h += op(s3, sv("rect", { x:f1(j1[0] - 50), y:f1(j1[1] - 18), width:44, height:16, rx:8, "class":"bt-tag" }) + txt(j1[0] - 28, j1[1] - 6, "ligase", "bt-tagt", "middle") + sv("rect", { x:f1(j2[0] + 4), y:f1(j2[1] + 2), width:44, height:16, rx:8, "class":"bt-tag" }) + txt(j2[0] + 26, j2[1] + 14, "ligase", "bt-tagt", "middle")); }
    h += txt(px, py + pr + 22, s3 > 0.5 ? "recombinant plasmid" : "plasmid", "bt-sm", "middle");
    // plasmid drifts into a bacterium; divisions 1 → 2 → 4 → 8
    var nB = s4 < 1 ? (s4 > 0 ? 1 : 0) : s4b < 0.33 ? 2 : s4b < 0.66 ? 4 : 8;
    if (s4 > 0 && s4 < 1) { var bx = lerp(px, BAC[0][0], s4), by = lerp(py, BAC[0][1], s4); h += plasmid(bx, by, lerp(14, 6, s4), { gene:true }); }
    if (s4 > 0) h += arrowR(262, 110, 298, "bt-ar") + txt(280, 130, "trans-", "bt-sm", "middle") + txt(280, 142, "formation", "bt-sm", "middle");
    for (var b = 0; b < Math.max(nB, s4 > 0 ? 1 : 0); b++) { h += rod(BAC[b][0], BAC[b][1], 38, 18) + (s4 >= 1 || b > 0 ? plasmid(BAC[b][0], BAC[b][1], 5, { gene:true }) : ""); }
    if (s4 > 0) h += txt(355, 214, nB > 1 ? nB + " bacteria" : "bacterium", "bt-sm", "middle");
    // insulin
    if (s5 > 0) for (var q = 0; q < 8; q++) h += insulin(lerp(318, 384, (q % 4) / 3), 232 + Math.floor(q / 4) * 14 - 8, s5 * (q < 4 ? 1 : seg(s5, 0.4, 1)));
    if (s5 > 0) h += op(s5, txt(306, 236, "human insulin", "bt-sm", "end"));
    setCap(T < 2.7 ? 0 : T < 5.1 ? 1 : T < 6.5 ? 2 : T < 10.1 ? 3 : 4);
    return h;
  }
  function draw(T){ svg.innerHTML = scene(T); }
  if (MV.reduceMotion) { draw(12); return; }
  draw(0);
  MV.tween({ dur:12000, ease:lin, step:function(k){ draw(k * 12); }, done:function(){ draw(12); } });
}

// ---------- Part 3: Biotech and society ----------
// Station 1: @component tapSort — tap a card, then a box (each placement checked at once; placed cards stay).
// Station 2: static field-trial table + chip questions. Station 3: @component S12 cerBuilder — claim, evidence, reasoning chips.
function part3(host, api){
  var C = api.content, S = api.S, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  var D = { sort:{}, pick:null, d:{}, cer:{ claim:null, ev:[], reason:null, found:[] } };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined || S[k] === null && k !== "pick") S[k] = JSON.parse(JSON.stringify(D[k])); });
  if (!S.cer.ev) S.cer.ev = []; if (!S.cer.found) S.cer.found = [];
  var sortFb = "", cerFb = "";
  host.innerHTML = '<div class="bt-p3">' +
    '<section class="bt-st" aria-labelledby="bt-s1h"><h3 id="bt-s1h">' + S1.title + '</h3><p class="how">' + S1.how + '</p><div id="bt-sortc" class="bt-sortc" role="group" aria-label="Cards to sort"></div><div class="bt-boxes" id="bt-boxes"></div><div id="bt-sortfb" aria-live="polite"></div></section>' +
    '<section class="bt-st part" aria-labelledby="bt-s2h"><h3 id="bt-s2h">' + S2.title + "</h3><p>" + S2.text + '</p><details class="alg" open><summary>Check it with data</summary><div class="bt-tw"><table class="bt-tbl"><caption class="tiny muted"><span class="bio-model">Model data</span> Fictional trial: yields in tonnes per hectare (t/ha), mean of 4 plots.</caption><thead><tr>' + S2.cols.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      S2.rows.map(function(r){ return "<tr>" + r.map(function(c, j){ return j ? "<td>" + c + "</td>" : '<th scope="row">' + c + "</th>"; }).join("") + "</tr>"; }).join("") + '</tbody></table></div><div id="bt-dq"></div></details></section>' +
    '<section class="bt-st part" aria-labelledby="bt-s3h"><h3 id="bt-s3h">' + S3.title + '</h3><p><strong>Case:</strong> ' + S3.caseQ + '</p><p class="how">' + S3.how + '</p>' +
      '<div class="bt-cer"><div><h4>Claim</h4><div id="bt-claim"></div></div><div><h4>Evidence</h4><div class="bt-evs" id="bt-ev" role="group" aria-label="Evidence"></div></div><div><h4>Reasoning</h4><div id="bt-reason"></div></div></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="bt-cerchk" data-k="btcer">Check my argument</button></div><div id="bt-cerfb" aria-live="polite"></div></section></div>';

  // ---- station 1 ----
  function paintSort(){
    var cs = $("#bt-sortc", host), bx = $("#bt-boxes", host), left = S1.cards.filter(function(c){ return !S.sort[c.id]; });
    MV.keepFocus(cs, function(){ cs.innerHTML = left.length ? left.map(function(c){ return '<button type="button" class="bt-scard" data-sc="' + c.id + '" data-k="bsc' + c.id + '" aria-pressed="' + (S.pick === c.id) + '">' + c.t + "</button>"; }).join("") : '<p class="tiny muted">All cards are sorted.</p>'; });
    MV.keepFocus(bx, function(){
      bx.innerHTML = S1.boxes.map(function(b){
        var inBox = S1.cards.filter(function(c){ return S.sort[c.id] === b.id; });
        return '<div class="bt-box2"><button type="button" class="bt-boxb" data-bx="' + b.id + '" data-k="bbx' + b.id + '"' + (S.pick ? "" : ' aria-disabled="true"') + ">" + b.t + (S.pick ? '<span class="vh"> (place the selected card here)</span>' : "") + "</button>" +
          (inBox.length ? '<ul class="bt-inbox">' + inBox.map(function(c){ return "<li>✓ " + c.t + (c.after ? ' <span class="tiny muted">' + c.after + "</span>" : "") + "</li>"; }).join("") + "</ul>" : "") + "</div>";
      }).join("");
    });
    var all = S1.cards.every(function(c){ return S.sort[c.id]; });
    $("#bt-sortfb", host).innerHTML = all ? MV.fbHTML("good", S1.done) : sortFb;
  }
  $("#bt-sortc", host).addEventListener("click", function(e){ var b = e.target.closest("[data-sc]"); if (!b) return; S.pick = S.pick === b.dataset.sc ? null : b.dataset.sc; sortFb = ""; api.save(); paintSort(); });
  $("#bt-boxes", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-bx]"); if (!b) return;
    if (!S.pick) { sortFb = MV.fbHTML("", "Tap a card first, then a box."); paintSort(); return; }
    var c = byId(S1.cards, S.pick), to = b.dataset.bx;
    if (c.box === to) { S.sort[c.id] = to; S.pick = null; sortFb = MV.fbHTML("good", "<strong>✓ Right box.</strong> " + (c.after || "")); }
    else { var hcC = { hc:1, cfia:1 }; sortFb = MV.fbHTML("bad", "<strong>✗ Not that box.</strong> " + (hcC[c.box] && hcC[to] ? S1.wrong : S1.wrongOther)); }
    api.save(); paintSort(); MV.focusFb($("#bt-sortfb", host));
  });
  paintSort();

  // ---- station 2 ----
  function paintDq(){
    var bx = $("#bt-dq", host);
    MV.keepFocus(bx, function(){
      bx.innerHTML = S2.qs.map(function(q){
        var last = S.d[q.id], ri = -1; q.choices.forEach(function(c, j){ if (MV.ok(c)) ri = j; });
        var done = last === ri, fb = last != null ? MV.fbHTML(done ? "good" : "bad", (done ? "<strong>✓ Right.</strong> " : "<strong>✗ Not quite.</strong> ") + q.choices[last].fb) : "";
        return '<div class="sq"><div class="sq-p">' + q.prompt + '</div><div class="sq-c" role="group" aria-label="Choices">' + q.choices.map(function(c, j){ return '<button type="button" class="chip' + (last === j ? " on" : "") + '" aria-pressed="' + (last === j) + '" data-dq="' + q.id + '" data-dj="' + j + '" data-k="bdq' + q.id + j + '"' + (done ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>" + fb + "</div>";
      }).join("");
    });
  }
  $("#bt-dq", host).addEventListener("click", function(e){ var b = e.target.closest("[data-dq]"); if (!b || b.disabled) return; S.d[b.dataset.dq] = +b.dataset.dj; api.save(); paintDq(); MV.focusFb(b.closest(".sq")); });
  paintDq();

  // ---- station 3: CER builder ----
  var claimR = radios($("#bt-claim", host), { aria:"Claim", key:"cl", cls:"chips", options:S3.claims, value:S.cer.claim || "", onChange:function(v){ S.cer.claim = v; cerFb = ""; api.save(); paintCer(); } });
  var reasonR = radios($("#bt-reason", host), { aria:"Reasoning", key:"rs", cls:"chips bt-rs", options:S3.reasons, value:S.cer.reason || "", onChange:function(v){ S.cer.reason = v; cerFb = ""; api.save(); paintCer(); } });
  function paintCer(){
    var ev = $("#bt-ev", host);
    MV.keepFocus(ev, function(){ ev.innerHTML = S3.evidence.map(function(e){ var on = S.cer.ev.indexOf(e.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ev="' + e.id + '" data-k="bev' + e.id + '">' + e.t + "</button>"; }).join(""); });
    claimR.set(S.cer.claim || ""); reasonR.set(S.cer.reason || "");
    var found = S3.accept.filter(function(a){ return S.cer.found.indexOf(a.claim) >= 0; });
    $("#bt-cerfb", host).innerHTML = cerFb + (found.length ? '<p class="tiny">Sound arguments you’ve built: ' + found.map(function(a){ return a.t; }).join(" · ") + "</p>" : "");
  }
  $("#bt-ev", host).addEventListener("click", function(e){ var b = e.target.closest("[data-ev]"); if (!b) return; var id = b.dataset.ev, i = S.cer.ev.indexOf(id); if (i >= 0) S.cer.ev.splice(i, 1); else S.cer.ev.push(id); cerFb = ""; api.save(); paintCer(); });
  function judge(){
    var M = S3.msg, c = S.cer.claim, ev = S.cer.ev, r = S.cer.reason;
    if (!c) return no(M.claim);
    if (!ev.length) return no(M.ev);
    if (ev.length === 1 && ev[0] === "pref") return no(M.pref);
    if ((c === "ap" || c === "mon") && ev.indexOf("norm") >= 0) return no(M.norm);
    if (!r) return no(M.reason);
    if (r === "r4") return no(M.r4);
    var a = S3.accept.filter(function(x){ return x.claim === c; })[0];
    if (!a.need.every(function(n){ return ev.indexOf(n) >= 0; })) return no(M.need[c]);
    if (a.reason !== r) return no(M.link);
    return { ok:true };
    function no(m){ return { ok:false, msg:m }; }
  }
  $("#bt-cerchk", host).addEventListener("click", function(){
    var j = judge();
    if (j.ok) { if (S.cer.found.indexOf(S.cer.claim) < 0) S.cer.found.push(S.cer.claim); cerFb = MV.fbHTML("good", S3.msg.good + (S.cer.found.length < S3.accept.length ? " " + S3.msg.more : "")); }
    else cerFb = MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + j.msg);
    api.save(); paintCer(); MV.focusFb($("#bt-cerfb", host));
  });
  paintCer();
}

// ---------- Performance task: Pick your production line (five dropdowns; live line diagram) ----------
var task = (function(){
  var api = null, T = null;
  var OPTS = {
    host:[["ecoli", "<em>E. coli</em>"], ["yeast", "yeast"], ["rice", "rice plant"]],
    gene:[["chrom", "human chromosome DNA"], ["cdna", "cDNA made from insulin mRNA"]],
    cut:[["same", "same enzyme for gene and vector"], ["diff", "two different enzymes with unmatched ends"]],
    vec:[["marker", "plasmid with a marker gene"], ["nomark", "plasmid without a marker gene"]],
    chk:[["none", "none"], ["gel", "gel electrophoresis"], ["seq", "DNA sequencing"]]
  };
  var SHORT = { ecoli:"<em>E. coli</em>", yeast:"yeast", rice:"rice plant", chrom:"chromosome DNA", cdna:"cDNA", same:"same enzyme", diff:"two enzymes", marker:"marker", nomark:"no marker", none:"no check", gel:"gel", seq:"sequencing" };
  var KEYS = ["host", "gene", "cut", "vec", "chk"];
  function read(){ var s = api ? api.S : {}; var d = {}; KEYS.forEach(function(k){ d[k] = s[k] || OPTS[k][0][0]; }); return d; }
  function checks(d){ return [d.host !== "rice", d.gene === "cdna", d.cut === "same", d.vec === "marker", d.chk !== "none"]; }
  function parse(k){ var p = String(k).split("-"), d = {}; KEYS.forEach(function(x, i){ d[x] = p[i]; }); return d; }
  function lab(d){ return KEYS.map(function(k){ return SHORT[d[k]]; }).join(", "); }
  function lineSVG(d){
    var ok = checks(d), h = "", P = [[60, 58], [180, 58], [300, 58], [60, 178], [180, 178], [300, 178]];
    function mark(i, good){ return txt(P[i][0] + 46, P[i][1] - 36, good ? "✓" : "✗", good ? "bt-ok" : "bt-no", "middle"); }
    for (var i = 0; i < 5; i++) { if (i === 2) h += sv("path", { d:"M300 96 L300 112 L60 112 L60 134", "class":"bt-ar" }) + sv("path", { d:"M55 128 L60 134 L65 128", "class":"bt-ar" }); else if (i !== 5) h += arrowR(P[i][0] + 50, P[i][1], P[i + 1][0] - 50); }
    // 1 gene
    h += line(26, 58, 94, 58, "bt-gl"); if (d.gene === "chrom") [[38, 50], [66, 78]].forEach(function(s){ h += sv("rect", { x:s[0], y:52, width:s[1] - s[0], height:12, rx:2, "class":"bt-intr" }); });
    h += txt(60, 92, d.gene === "chrom" ? "gene with introns" : "cDNA: exons only", "bt-sm", "middle") + mark(0, ok[1]);
    // 2 cut
    var mis = d.cut === "diff";
    h += sv("path", { d:"M140 50 L170 50 L170 58 L176 58 L176 66 L140 66", "class":"bt-plf" }) + sv("path", { d:"M220 50 " + (mis ? "L194 50 L194 54 L186 54 L186 66 L220 66" : "L182 50 L182 58 L176 58 L176 66 L220 66"), "class":"bt-glf" });
    h += txt(180, 92, mis ? "ends don’t pair" : "ends pair", "bt-sm", "middle") + mark(1, ok[2]);
    // 3 vector
    h += plasmid(300, 58, 22, { gene:true, marker:d.vec === "marker" }) + txt(300, 92, d.vec === "marker" ? "marker gene" : "no marker", "bt-sm", "middle") + mark(2, ok[3]);
    // 4 host
    if (d.host === "ecoli") h += rod(60, 178, 60, 24) + plasmid(60, 178, 6, { gene:true });
    else if (d.host === "yeast") h += sv("ellipse", { cx:54, cy:178, rx:22, ry:18, "class":"bt-cellc" }) + sv("circle", { cx:80, cy:168, r:9, "class":"bt-cellc" });
    else h += ricePlant(60, 196, 0.55, false);
    h += txt(60, 214, plain(SHORT[d.host]), "bt-sm", "middle") + mark(3, ok[0]);
    // 5 check
    if (d.chk === "gel") { h += sv("rect", { x:156, y:156, width:48, height:44, rx:3, "class":"bt-gelbg" }); [166, 176, 186].forEach(function(y, j){ h += sv("rect", { x:j % 2 ? 182 : 162, y:y, width:16, height:4, "class":"bt-band" }); }); }
    else if (d.chk === "seq") h += txt(180, 184, "ATGGCC…", "bt-base", "middle");
    else h += sv("rect", { x:154, y:158, width:52, height:40, rx:4, "class":"bt-empty" });
    h += txt(180, 214, d.chk === "none" ? "not checked" : d.chk === "gel" ? "checked by size" : "checked base by base", "bt-sm", "middle") + mark(4, ok[4]);
    // 6 tank
    h += sv("path", { d:"M282 150 L282 196 Q282 204 290 204 L310 204 Q318 204 318 196 L318 150", "class":"bt-tank" }) + txt(300, 222, "scale-up", "bt-sm", "middle");
    if (ok.every(Boolean)) for (var q = 0; q < 4; q++) h += insulin(292 + (q % 2) * 14, 170 + Math.floor(q / 2) * 14, 1);
    return h;
  }
  function paintPv(){
    var d = read(), el = $("#bt-tpv"); if (!el) return;
    $("#bt-tsvg").innerHTML = lineSVG(d);
    $("#bt-tsvg").setAttribute("aria-label", "Production line: gene source " + plain(SHORT[d.gene]) + ", cutting plan " + plain(SHORT[d.cut]) + ", vector " + plain(SHORT[d.vec]) + ", host " + plain(SHORT[d.host]) + ", check " + plain(SHORT[d.chk]) + ", then scale-up in a tank.");
    var prot = d.host === "rice" ? "Grows in a field, not a tank" : d.gene === "chrom" ? (d.host === "yeast" ? "Unreliable: yeast don’t reliably remove human introns" : "Faulty protein: introns stay in") : "Correct insulin sequence";
    el.innerHTML = MV.readoutHTML([["Protein made", prot], ["Recombinant plasmids", d.cut === "same" ? "Yes: matching sticky ends" : "Few or none: the ends don’t pair"],
      ["Picking out transformed cells", d.vec === "marker" ? "Selection plate: only transformed cells grow" : "Can’t tell which cells took up the plasmid"],
      ["Insert check", d.chk === "none" ? "None" : d.chk === "gel" ? "Size only" : "Every base"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = a.S;
      KEYS.forEach(function(k){ if (!s[k]) s[k] = OPTS[k][0][0]; });
      inp.innerHTML = '<div class="bt-tin">' + KEYS.map(function(k){ return '<label class="bt-sel"><span>' + T.inputs[k] + '</span><select data-tk="' + k + '">' + OPTS[k].map(function(o){ return '<option value="' + o[0] + '"' + (s[k] === o[0] ? " selected" : "") + ">" + plain(o[1]) + "</option>"; }).join("") + "</select></label>"; }).join("") + "</div>";
      inp.addEventListener("change", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; s[k] = e.target.value; a.save(); paintPv(); a.update(); });
      pv.innerHTML = '<div class="bt-tpvw"><h4>Your production line</h4><div class="bt-fig"><svg id="bt-tsvg" viewBox="0 0 360 230" role="img" focusable="false"></svg></div><dl class="read" id="bt-tpv" aria-live="polite"></dl></div>';
      paintPv();
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    key:function(d){ return KEYS.map(function(k){ return d[k]; }).join("-"); },
    label:function(k){ return lab(parse(k)); },
    text:function(k){ return plain(lab(parse(k))); }
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
