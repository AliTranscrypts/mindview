// SBI4U 24 tRNA: hero (cloverleaf → L → charging → pairing), tRNA anatomy and charging (S1 anatomy explorer, charging
// station, wobble reader on an mRNA strip, S6 codon table), Codon–anticodon matching (three stations + S12 claim–evidence–
// reasoning chips), Wobble puzzles (custom), "One tRNA, three codons" (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 21 / 15) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function lin(t){ return t; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function sqH(s){ return '<span class="tr-sq">' + s + "</span>"; }
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/,/g, "").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
// text that stays upright inside a rotated group
function T(x, y, s, cls, anchor, rot){
  return sv("text", { x:x, y:y, "class":cls || "tr-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null, transform:rot ? "rotate(" + (-rot) + " " + f1(x) + " " + f1(y) + ")" : null }, s);
}

// ---------- @component radioGroup (copied from SBI4U 21 / 15 / MHF4U 25: options may be disabled with dis:true) ----------
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

// ---------- @component S6 codonTable — the standard genetic code (codons 5′ → 3′) and wobble reading rules.
//   aaOf("GGA") -> "Gly" ("Stop" for stops); reads("GAA") -> [{c:"UUC", w:false}, {c:"UUU", w:true}] (anticodon written 5′ → 3′,
//   wobble rules G→C/U, U→A/G, I→U/C/A, C→G, A→U); pairs(ac, codon) -> [first, second, third] booleans; cognate(ac) -> the one
//   amino acid every codon it reads codes (or null); codonTableHTML(); ctDetails(key) wraps it in a <details> panel ----------
var B4 = "UCAG", CODE = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
var AA3 = { A:"Ala", R:"Arg", N:"Asn", D:"Asp", C:"Cys", Q:"Gln", E:"Glu", G:"Gly", H:"His", I:"Ile", L:"Leu", K:"Lys", M:"Met", F:"Phe", P:"Pro", S:"Ser", T:"Thr", W:"Trp", Y:"Tyr", V:"Val", "*":"Stop" };
var AAN = { Ala:"alanine", Arg:"arginine", Asn:"asparagine", Asp:"aspartic acid", Cys:"cysteine", Gln:"glutamine", Glu:"glutamic acid", Gly:"glycine", His:"histidine", Ile:"isoleucine",
  Leu:"leucine", Lys:"lysine", Met:"methionine", Phe:"phenylalanine", Pro:"proline", Ser:"serine", Thr:"threonine", Trp:"tryptophan", Tyr:"tyrosine", Val:"valine" };
var RC = { A:"U", U:"A", G:"C", C:"G" };
var WOB = { G:["C", "U"], U:["A", "G"], I:["U", "C", "A"], C:["G"], A:["U"] };
function aaOf(c){ var i = 16 * B4.indexOf(c[0]) + 4 * B4.indexOf(c[1]) + B4.indexOf(c[2]); return AA3[CODE[i]] || "?"; }
function rev(s){ return String(s).split("").reverse().join(""); }
function isWob(w, b3){ return w === "I" || (w === "G" && b3 === "U") || (w === "U" && b3 === "G"); }
function reads(ac){ if (!ac || ac.length !== 3 || !RC[ac[1]] || !RC[ac[2]] || !WOB[ac[0]]) return []; var f = RC[ac[2]] + RC[ac[1]]; return WOB[ac[0]].map(function(b){ return { c:f + b, w:isWob(ac[0], b) }; }); }
function pairs(ac, c){ return [RC[ac[2]] === c[0], RC[ac[1]] === c[1], (WOB[ac[0]] || []).indexOf(c[2]) >= 0]; }
function nPair(ac, c){ return pairs(ac, c).filter(Boolean).length; }
function cognate(ac){ var s = {}; reads(ac).forEach(function(r){ s[aaOf(r.c)] = 1; }); var k = Object.keys(s); return k.length === 1 && k[0] !== "Stop" ? k[0] : null; }
function readsText(ac){ var r = reads(ac); return r.length ? r.map(function(x){ return x.c + (x.w ? " (by wobble)" : ""); }).join(", ") : "none"; }
function codonTableHTML(){
  var h = '<div class="tbl-wrap"><table class="tr-ct"><caption>The genetic code: codons written 5′ → 3′</caption><thead><tr><th scope="col">1st base</th>' +
    B4.split("").map(function(b){ return '<th scope="col">2nd base ' + b + "</th>"; }).join("") + "</tr></thead><tbody>";
  for (var i = 0; i < 4; i++) {
    h += '<tr><th scope="row">' + B4[i] + "</th>";
    for (var j = 0; j < 4; j++) {
      h += "<td>";
      for (var k = 0; k < 4; k++) { var c = B4[i] + B4[j] + B4[k], a = aaOf(c); h += '<span class="tr-ctr"><span class="tr-sq">' + c + "</span> " + (a === "Stop" ? "<strong>Stop</strong>" : a) + "</span>"; }
      h += "</td>";
    }
    h += "</tr>";
  }
  return h + '</tbody></table></div><p class="tiny muted">AUG codes Met and is also the start codon. UAA, UAG and UGA are stop codons.</p>';
}
function ctDetails(k){ return '<details class="alg tr-ctd" data-k="' + k + '"><summary>Codon table</summary>' + codonTableHTML() + "</details>"; }

// ---------- @component trnaDraw — schematic tRNA as a cloverleaf (viewBox 400 × 310) or an L (same frame; rot turns it about
// (200, 155)). tRNA --bio-e, amino acid --bio-carbon; the anticodon is shown 5′ → 3′ in the cloverleaf and 3′ → 5′ (as it pairs
// with a codon below) in the L. o = { ac, aa, rot, hi:"acc"|"p5"|"ac"|"d"|"t", labels, ruler } ----------
var GLOW = {
  clover:{ acc:[204, 22, 62, 100], p5:[164, 46, 32, 30], d:[82, 120, 100, 40], t:[218, 120, 100, 40], ac:[170, 160, 60, 130] },
  L:{ acc:[208, 14, 196, 60], p5:[314, 70, 32, 26], t:[116, 22, 92, 58], d:[52, 80, 60, 78], ac:[66, 160, 68, 142] }
};
function stemSVG(a, b, n, w){
  var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), px = -dy / L * w, py = dx / L * w, h = "";
  h += sv("line", { x1:a[0] + px, y1:a[1] + py, x2:b[0] + px, y2:b[1] + py, "class":"tr-st" }) + sv("line", { x1:a[0] - px, y1:a[1] - py, x2:b[0] - px, y2:b[1] - py, "class":"tr-st" });
  for (var i = 1; i <= n; i++) { var t = i / (n + 1), x = a[0] + dx * t, y = a[1] + dy * t; h += sv("line", { x1:x + px * 0.8, y1:y + py * 0.8, x2:x - px * 0.8, y2:y - py * 0.8, "class":"tr-rung" }); }
  return h;
}
function loopSVG(cx, cy, r){ return sv("circle", { cx:cx, cy:cy, r:r, "class":"tr-st tr-loop" }); }
function tabSVG(x, y, h, letter, cls, rot, hi){
  return sv("rect", { x:x - 10, y:y, width:20, height:h, rx:4, "class":"tr-tab " + cls }) + (hi ? sv("rect", { x:x - 13, y:y - 3, width:26, height:h + 6, rx:6, "class":"tr-wobo" }) : "") +
    (letter ? T(x, y + h / 2 + 5, letter, "tr-bl", "middle", rot) : "");
}
function aaSVG(x, y, aa, rot, cls){ return sv("circle", { cx:x, cy:y, r:15, "class":"tr-aa" + (cls ? " " + cls : "") }) + T(x, y + 4, aa, "tr-aat", "middle", rot); }
function tailSVG(pts, rot){
  var h = "";
  pts.forEach(function(p, i){ if (i) h += sv("line", { x1:pts[i - 1][0], y1:pts[i - 1][1], x2:p[0], y2:p[1], "class":"tr-st" }); });
  pts.slice(1).forEach(function(p, i){ h += sv("circle", { cx:p[0], cy:p[1], r:7, "class":"tr-nt" }) + T(p[0], p[1] + 3.5, "CCA"[i], "tr-ntl", "middle", rot); });
  return h;
}
function glowSVG(r){ return r ? sv("rect", { x:r[0], y:r[1], width:r[2], height:r[3], rx:12, "class":"tr-glow" }) : ""; }
function cloverSVG(o){
  var h = glowSVG(o.hi && GLOW.clover[o.hi]), ac = o.ac || "";
  h += stemSVG([200, 118], [200, 60], 4, 11) + stemSVG([180, 140], [124, 140], 3, 11) + stemSVG([220, 140], [276, 140], 3, 11) + stemSVG([200, 162], [200, 220], 3, 11);
  h += sv("path", { d:"M189 118 L189 129 L178 129 M211 118 L211 129 L222 129 M178 151 L189 151 L189 162 M222 151 L211 151 L211 162", "class":"tr-st" });
  h += loopSVG(106, 140, 18) + loopSVG(294, 140, 18) + loopSVG(200, 240, 20);
  h += tailSVG([[211, 60], [218, 50], [226, 40], [234, 30]]);
  for (var j = 0; j < 3; j++) h += tabSVG(178 + 22 * j, 262, 22, ac[j] || "", "tr-t");
  h += T(164, 278, "5′", "tr-end", "end") + T(236, 278, "3′", "tr-end") + T(184, 66, "5′", "tr-end", "end") + T(240, 48, "3′", "tr-end");
  if (o.aa) h += sv("line", { x1:234, y1:30, x2:246, y2:24, "class":"tr-st" }) + aaSVG(258, 20, o.aa);
  if (o.labels !== false) h += T(178, 100, "acceptor stem", "tr-lab", "end") + T(106, 176, "D arm", "tr-lab", "middle") + T(294, 176, "T arm", "tr-lab", "middle") + T(226, 238, "anticodon loop", "tr-lab");
  return h;
}
function lSVG(o){
  var rot = o.rot || 0, h = glowSVG(o.hi && GLOW.L[o.hi]), ac = o.ac || "", sh = rev(ac);
  h += stemSVG([120, 66], [204, 66], 4, 11) + stemSVG([212, 66], [320, 66], 5, 11) + stemSVG([100, 86], [100, 150], 3, 11) + stemSVG([100, 160], [100, 232], 3, 11);
  h += sv("path", { d:"M120 55 Q89 55 89 86 M120 77 L111 77 L111 86 M204 55 L212 55 M204 77 L212 77 M89 150 L89 160 M111 150 L111 160", "class":"tr-st" });
  h += loopSVG(152, 41, 13) + loopSVG(74, 116, 13) + loopSVG(100, 252, 20);
  h += tailSVG([[320, 55], [334, 49], [348, 42], [362, 35]], rot);
  for (var j = 0; j < 3; j++) h += tabSVG(78 + 22 * j, 274, 22, sh[j] || "", "tr-t", rot);
  h += T(62, 290, "3′", "tr-end", "end", rot) + T(138, 290, "5′", "tr-end", "start", rot) + T(334, 84, "5′", "tr-end", "start", rot) + T(366, 56, "3′", "tr-end", "start", rot);
  if (o.aa) h += sv("line", { x1:362, y1:35, x2:372, y2:30, "class":"tr-st" }) + aaSVG(384, 24, o.aa, rot);
  if (o.labels !== false) h += T(266, 100, "acceptor stem", "tr-lab", "middle", rot) + T(152, 18, "T arm", "tr-lab", "middle", rot) + T(56, 116, "D arm", "tr-lab", "end", rot) + T(126, 252, "anticodon loop", "tr-lab", "start", rot);
  if (o.ruler) h += sv("line", { x1:124, y1:284, x2:376, y2:36, "class":"tr-ruler" }) + T(262, 172, "≈ 7 nm", "tr-rul", "start", rot);
  return h;
}

// ---------- @component S1 diagramExplorer (copied from SBI4U 21 / 17 / 03; o.min sets the smallest button size in px) ----------
// diagramExplorer(host, { levels:[{ id, name, vb:[w, h], draw() -> SVG markup, aria() -> text, hotspots:[{ id, label, zones:[[x, y, w, h]] }] }],
//   level:"id", min:44, onTap(id, levelId) }) -> { level(), setLevel(id), marks({id:"on"}), svg(), refresh() }
function diagramExplorer(host, o){
  var lvId = o.level || o.levels[0].id, marks = {}, mn = o.min || 44;
  host.innerHTML = '<div class="s1"><div class="s1-stage"><svg class="s1-svg" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg><div class="s1-hs" role="group"></div></div></div>';
  var stage = $(".s1-stage", host), svg = $(".s1-svg", host), hsBox = $(".s1-hs", host);
  function L(){ return o.levels.filter(function(x){ return x.id === lvId; })[0]; }
  function p2(v){ return Math.round(v * 100) / 100; }
  function render(){
    var lv = L(), w = lv.vb[0], h = lv.vb[1];
    stage.style.aspectRatio = w + " / " + h;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.innerHTML = lv.draw();
    svg.setAttribute("aria-label", lv.aria ? lv.aria() : lv.name);
    hsBox.setAttribute("aria-label", lv.name);
    var list = [];
    lv.hotspots.forEach(function(hs){ hs.zones.forEach(function(z, zi){ list.push({ hs:hs, z:z, zi:zi, area:z[2] * z[3] }); }); });
    list.slice().sort(function(a, b){ return b.area - a.area; }).forEach(function(it, i){ it.zx = 1 + i; });
    var foc = document.activeElement && hsBox.contains(document.activeElement) ? document.activeElement.dataset.hs : null;
    hsBox.innerHTML = list.map(function(it){
      var z = it.z, cx = (z[0] + z[2] / 2) / w * 100, cy = (z[1] + z[3] / 2) / h * 100, pw = z[2] / w * 100, ph = z[3] / h * 100;
      return '<button type="button" class="s1-b" data-hs="' + it.hs.id + '" data-k="s1' + lvId + it.hs.id + it.zi + '" aria-label="' + MV.esc(it.hs.label) + '" style="left:calc(' + p2(cx) + "% - max(" + mn / 2 + "px, " + p2(pw / 2) + "%));top:calc(" + p2(cy) + "% - max(" + mn / 2 + "px, " + p2(ph / 2) + "%));width:max(" + mn + "px, " + p2(pw) + "%);height:max(" + mn + "px, " + p2(ph) + "%);z-index:" + it.zx + '"></button>';
    }).join("");
    if (foc) { var fb = hsBox.querySelector('[data-hs="' + foc + '"]'); if (fb) fb.focus({ preventScroll:true }); }
    paint();
  }
  function paint(){ $$(".s1-b", hsBox).forEach(function(b){ b.className = "s1-b" + (marks[b.dataset.hs] ? " " + marks[b.dataset.hs] : ""); b.setAttribute("aria-pressed", marks[b.dataset.hs] ? "true" : "false"); }); }
  hsBox.addEventListener("click", function(e){ var b = e.target.closest(".s1-b"); if (b && o.onTap) o.onTap(b.dataset.hs, lvId); });
  hsBox.addEventListener("keydown", function(e){
    var b = e.target.closest(".s1-b"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$(".s1-b", hsBox), i = all.indexOf(b); all[(i + d + all.length) % all.length].focus();
  });
  render();
  return { level:function(){ return lvId; }, setLevel:function(id){ if (id !== lvId) { lvId = id; render(); } }, marks:function(m){ marks = m || {}; paint(); }, svg:function(){ return svg; }, refresh:render };
}

// ---------- hero: cloverleaf → L → synthetase + ATP + Met → pairs with AUG (reduced motion: final frame) ----------
function hero(f){
  var box = $("#tr-hero"); if (!box) return;
  var cap = f && f.cap;
  var CAPS = ["A tRNA is one RNA strand folded into a cloverleaf: an acceptor stem, a D arm, a T arm and an anticodon loop.",
    "The cloverleaf folds into an L. The anticodon and the 3′ end sit at opposite ends.",
    "A synthetase grips the L. An ATP splits, and methionine snaps onto the 3′ CCA end.",
    "The charged tRNA drifts down to the mRNA. Its anticodon 3′-UAC-5′ pairs with the codon 5′-AUG-3′."];
  box.innerHTML = '<svg viewBox="0 0 400 384" class="tr-hsvg" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  function draw(t){
    var h = "", cl = t < 1 ? clamp(t * 1.5, 0, 1) : 1 - clamp(t - 1, 0, 1), lo = clamp(t - 1, 0, 1);
    var syn = t < 2 ? 0 : t < 3 ? clamp((t - 2) * 4, 0, 1) : 1 - clamp((t - 3) * 4, 0, 1);
    var sp = clamp((t - 2.3) / 0.35, 0, 1), mp = MV.ease(clamp((t - 2.5) / 0.4, 0, 1)), dr = MV.ease(clamp(t - 3, 0, 1)), pl = clamp((t - 3.8) / 0.2, 0, 1);
    var dy = 34 * dr;
    // mRNA strip (teal), codon AUG under the anticodon
    h += sv("rect", { x:20, y:358, width:360, height:14, rx:4, "class":"tr-mrna" }) + T(14, 370, "5′", "tr-end", "end") + T(386, 370, "3′", "tr-end") + T(300, 352, "mRNA", "tr-lab", "middle");
    for (var j = 0; j < 3; j++) h += tabSVG(78 + 22 * j, 336, 22, "AUG"[j], "tr-m");
    h += T(150, 352, "codon", "tr-lab", "start");
    if (cl > 0.01) h += '<g opacity="' + f1(cl) + '">' + cloverSVG({ ac:"CAU" }) + "</g>";
    if (lo > 0.01) {
      var g = lSVG({ ac:"CAU", aa:mp >= 1 ? "Met" : null, labels:t < 3 });
      if (syn > 0.01) {
        g += '<g opacity="' + f1(syn) + '">' + sv("ellipse", { cx:330, cy:46, rx:76, ry:42, "class":"tr-enz" }) + T(330, 106, "synthetase", "tr-enzl", "middle");
        if (sp < 1) g += sv("rect", { x:216, y:120, width:44, height:22, rx:11, "class":"tr-atp" }) + T(238, 135, "ATP", "tr-atpl", "middle");
        else g += sv("rect", { x:206, y:118, width:20, height:22, rx:8, "class":"tr-atp", opacity:0.5 }) + sv("rect", { x:250, y:124, width:20, height:22, rx:8, "class":"tr-atp", opacity:0.5 });
        if (mp > 0 && mp < 1) g += aaSVG(lerp(300, 384, mp), lerp(170, 24, mp), "Met");
        else if (mp <= 0) g += aaSVG(300, 170, "Met");
        g += "</g>";
      }
      h += '<g opacity="' + f1(lo) + '" transform="translate(0 ' + f1(dy) + ')">' + g + "</g>";
      if (pl > 0) for (j = 0; j < 3; j++) h += sv("line", { x1:78 + 22 * j, y1:296 + 34, x2:78 + 22 * j, y2:336, "class":"tr-bp", opacity:pl < 1 ? f1(pl) : null });
      if (t >= 3.9) h += T(150, 318, "anticodon", "tr-lab", "start");
    }
    svg.innerHTML = h;
    setCap(t < 1 ? 0 : t < 2 ? 1 : t < 3 ? 2 : 3);
  }
  if (MV.reduceMotion) { draw(4); return; }
  var DUR = [1400, 1600, 2200, 2000], ph = 0;
  (function run(){
    if (ph > 3) { draw(4); return; }
    var p = ph;
    MV.tween({ dur:DUR[p], ease:lin, step:function(k){ draw(p + Math.min(k, 0.999)); }, done:function(){ ph++; setTimeout(run, ph > 3 ? 100 : 450); } });
  })();
}

// ---------- Explore: tRNA anatomy and charging ----------
var EXF = null;
function explore(host, api){
  var S = api.S, X = api.content, PARTS = X.parts, STR = X.strips;
  var AAS = ["Ala", "Arg", "Asn", "Asp", "Cys", "Gln", "Glu", "Gly", "His", "Ile", "Leu", "Lys", "Met", "Phe", "Pro", "Ser", "Thr", "Trp", "Tyr", "Val"];
  function defaults(){
    S.mode = S.mode || "anat"; S.view = S.view || "clover"; if (S.rot == null) S.rot = 0; if (S.part === undefined) S.part = null;
    S.ac = S.ac || "GAA"; if (S.aa === undefined) S.aa = null; S.pick = S.pick || "Phe"; if (S.atp == null) S.atp = 0;
    S.chk = S.chk || ""; if (S.rej === undefined) S.rej = null; if (S.strip == null) S.strip = 1; S.placed = S.placed || {}; if (S.at === undefined) S.at = null;
  }
  defaults();
  var busy = false, anim = null, ld = null, msg = "", pend = null;
  host.innerHTML = '<div class="pg tr-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="tr-v1"></div><div id="tr-v2" class="tr-fig"></div><div id="tr-v3" class="tr-scroll"></div>' +
      '<p class="tr-chain" id="tr-chain"></p><p class="tr-cap" id="tr-cap"></p></div>' +
    '<div class="pg-ctrl"><div id="tr-mode"></div>' +
      '<div class="tr-panel" id="tr-p1"><div id="tr-view"></div>' +
        '<div class="tr-rotw" id="tr-rotw"><label for="tr-rot" class="rg-lab">Rotate</label> <input type="range" id="tr-rot" min="0" max="360" step="15" aria-describedby="tr-rotn"> <output id="tr-roto" for="tr-rot"></output><p class="tiny muted" id="tr-rotn">Arrow keys turn it 15°; Shift + arrow turns it 45°.</p></div>' +
        '<div class="tr-parts" role="group" aria-label="Parts of the tRNA">' + PARTS.map(function(p){ return '<button type="button" class="chip" data-part="' + p.id + '" data-k="pt' + p.id + '" aria-pressed="false">' + p.name + "</button>"; }).join("") + "</div></div>" +
      '<div class="tr-panel" id="tr-p2"><div id="tr-aa"></div><div id="tr-tr"></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="tr-load" data-k="trload">Load</button><button type="button" class="btn ghost sm" id="tr-beak" data-k="trbeak">Beaker: change Cys to Ala</button></div></div>' +
      '<div class="tr-panel" id="tr-p3"><div id="tr-strips"></div><p class="tr-hand" id="tr-hand"></p><div id="tr-wb"></div>' +
        '<div class="tr-place" id="tr-place" role="group" aria-label="Tap a codon to place the tRNA in hand there"></div>' +
        '<p class="tr-card">' + X.wobbleCard + "</p>" +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="tr-clear" data-k="trclear">Clear strip</button></div></div>' +
      '<p class="tr-msg" id="tr-msg" role="status" aria-live="polite"></p>' +
      ctDetails("trct") + '<div class="q-actions"><button type="button" class="btn ghost sm" id="tr-reset" data-k="trreset">Reset model</button></div></div>' +
    '<div class="pg-read"><dl class="read" id="tr-read" aria-live="polite"></dl></div></div>';

  // ---- Mode 1: S1 anatomy explorer ----
  function partLabel(id){ var p = byId(PARTS, id); return p.name + (S.part === id ? " (selected)" : ""); }
  function rotZone(z){
    var a = S.rot * Math.PI / 180, cx = z[0] + z[2] / 2 - 200, cy = z[1] + z[3] / 2 - 155, rx = cx * Math.cos(a) - cy * Math.sin(a) + 230, ry = cx * Math.sin(a) + cy * Math.cos(a) + 230;
    var sw = Math.pow(Math.sin(a), 2) > 0.5, w = sw ? z[3] : z[2], h = sw ? z[2] : z[3];
    return [rx - w / 2, ry - h / 2, w, h];
  }
  var lvClover = { id:"clover", name:"Cloverleaf view: tap a part", vb:[400, 310],
    draw:function(){ return cloverSVG({ ac:S.ac, aa:S.aa, hi:S.part }); },
    aria:function(){ return "Cloverleaf tRNA: acceptor stem at the top with the 5′ end and the 3′ CCA end" + (S.aa ? " carrying " + S.aa : "") + ", D arm on the left, T arm on the right, anticodon loop at the bottom reading 5′-" + S.ac + "-3′."; },
    hotspots:PARTS.map(function(p){ return { id:p.id, label:p.name, zones:[GLOW.clover[p.id]] }; }) };
  var lvL = { id:"L", name:"L-shape view: tap a part", vb:[460, 460],
    draw:function(){ return '<g transform="translate(30 75) rotate(' + S.rot + ' 200 155)">' + lSVG({ ac:S.ac, aa:S.aa, hi:S.part, rot:S.rot, ruler:true }) + "</g>"; },
    aria:function(){ return "L-shaped tRNA turned " + S.rot + "°: the anticodon 3′-" + rev(S.ac) + "-5′ at the end of one arm and the 3′ CCA end" + (S.aa ? " carrying " + S.aa : "") + " at the end of the other, about 7 nm apart."; },
    hotspots:[] };
  function setLZones(){ lvL.hotspots = PARTS.map(function(p){ return { id:p.id, label:p.name, zones:[rotZone(GLOW.L[p.id])] }; }); }
  setLZones();
  var ex = diagramExplorer($("#tr-v1", host), { levels:[lvClover, lvL], level:S.view, min:24, onTap:function(id){ S.part = S.part === id ? null : id; changed(); } });
  var viewR = radios($("#tr-view", host), { label:"View", key:"v", options:[{ id:"clover", t:"Cloverleaf" }, { id:"L", t:"L-shape" }], value:S.view, onChange:function(v){ S.view = v; ex.setLevel(v); changed(); } });
  var rotI = $("#tr-rot", host); rotI.value = S.rot;
  rotI.addEventListener("input", function(){ S.rot = +rotI.value % 360; setLZones(); changed(); });
  rotI.addEventListener("keydown", function(e){
    if (!e.shiftKey) return; var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 45 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -45 : 0; if (!d) return;
    e.preventDefault(); S.rot = ((S.rot + d) % 360 + 360) % 360; rotI.value = S.rot; setLZones(); changed();
  });
  $(".tr-parts", host).addEventListener("click", function(e){ var b = e.target.closest("[data-part]"); if (!b) return; S.part = S.part === b.dataset.part ? null : b.dataset.part; changed(); });

  // ---- Mode 2: charging station ----
  var modeR = radios($("#tr-mode", host), { label:"Mode", key:"m", options:X.modes, value:S.mode, onChange:function(m){ S.mode = m; msg = ""; changed(); } });
  var aaR = radios($("#tr-aa", host), { label:"Amino acid", key:"a", cls:"chips", options:AAS.map(function(a){ return { id:a, t:a, aria:a + ", " + AAN[a] }; }), value:S.pick, onChange:function(v){ S.pick = v; S.chk = ""; msg = ""; changed(); } });
  var trR = radios($("#tr-tr", host), { label:"tRNA (anticodon 5′ → 3′)", key:"t", cls:"chips", options:X.trnas.map(function(t){ return { id:t, t:sqH(t), aria:"tRNA with anticodon 5′ " + t.split("").join(" ") + " 3′" }; }), value:S.ac,
    onChange:function(v){ S.ac = v; S.aa = null; S.treated = false; S.chk = ""; msg = ""; changed(); } });
  function charge(){
    if (busy) return;
    if (S.aa) { msg = "This tRNA already carries " + S.aa + ". Pick a fresh tRNA to load another."; changed(); return; }
    var own = cognate(S.ac), ok = own === S.pick;
    busy = true; ld = { kind:ok ? "load" : "rej", k:0, aa:S.pick }; sync();
    MV.tween({ dur:ok ? 1200 : 1100, ease:lin, step:function(k){ ld.k = k; drawV2(); }, done:function(){
      ld = null; busy = false;
      if (ok) { S.aa = S.pick; S.atp++; S.chk = "ok"; S.rej = null; msg = "Match: the " + AAN[own] + " synthetase used one ATP to attach " + AAN[own] + " to the 3′ end."; }
      else { S.chk = "rej"; S.rej = { aa:S.pick, ac:S.ac }; msg = own ? "The " + AAN[own] + " synthetase won’t load " + AAN[S.pick] + ". Its pocket fits only " + AAN[own] + "." : "No synthetase loads this tRNA: the codons it reads don’t all code one amino acid."; }
      changed();
    } });
  }
  $("#tr-load", host).addEventListener("click", charge);
  $("#tr-beak", host).addEventListener("click", function(){ if (S.aa !== "Cys" || busy) return; S.aa = "Ala"; S.treated = true; msg = "The cysteine on this tRNA is now alanine. The anticodon is untouched."; changed(); });

  // ---- Mode 3: wobble reader ----
  var stripR = radios($("#tr-strips", host), { label:"mRNA strip", key:"s", cls:"chips", options:STR.map(function(s, i){ return { id:i, t:sqH(s.join(" · ")) }; }), value:S.strip,
    onChange:function(v){ S.strip = +v; S.placed = {}; S.at = null; msg = ""; changed(); } });
  var wbR = radios($("#tr-wb", host), { label:"Wobble base (anticodon 5′ position)", key:"w", cls:"chips", options:["A", "C", "G", "U", "I"].map(function(b){ return { id:b, t:sqH(b), aria:b === "I" ? "I, inosine" : b }; }), value:S.ac[0],
    onChange:function(b){ S.ac = b + S.ac.slice(1); S.chk = ""; msg = "The tRNA in hand now has anticodon 5′-" + S.ac + "-3′."; changed(); } });
  function strip(){ return STR[S.strip] || STR[0]; }
  function placeAt(i, done, quiet){
    var c = strip()[i];
    if (aaOf(c) === "Stop") { S.placed[i] = { rf:true }; S.at = i; if (!quiet) msg = "No tRNA reads " + c + ": it’s a stop codon. A release factor (a protein) binds there instead."; changed(); if (done) MV.wait(500, done); return; }
    S.placed[i] = { ac:S.ac, aa:S.aa }; S.at = i;
    var n = nPair(S.ac, c);
    if (!quiet) msg = n === 3 ? "tRNA 5′-" + S.ac + "-3′ pairs with " + c + (pairs(S.ac, c)[2] && isWob(S.ac[0], c[2]) ? ", the third base by wobble." : ".") + (S.aa ? "" : " It carries no amino acid, though.") : "Only " + n + " of 3 bases pair: this tRNA can’t read " + c + ".";
    busy = true; anim = { i:i, k:0 }; sync();
    MV.tween({ dur:700, step:function(k){ anim.k = k; drawV3(); }, done:function(){ anim = null; busy = false; changed(); if (done) done(); } });
  }
  $("#tr-place", host).addEventListener("click", function(e){ var b = e.target.closest("[data-place]"); if (!b || b.disabled || busy) return; placeAt(+b.dataset.place); });
  $("#tr-clear", host).addEventListener("click", function(){ if (busy) return; S.placed = {}; S.at = null; msg = ""; changed(); });
  $("#tr-reset", host).addEventListener("click", function(){
    if (busy) return;
    ["view", "rot", "part", "ac", "aa", "pick", "atp", "chk", "rej", "strip", "placed", "at", "treated"].forEach(function(k){ delete S[k]; });
    defaults(); rotI.value = 0; setLZones(); ex.setLevel(S.view); msg = "Model reset."; changed();
  });

  // ---- drawings ----
  function drawV2(){
    var h = lSVG({ ac:S.ac, aa:ld ? null : S.aa, labels:false }), k = ld ? ld.k : 0, e = MV.ease(clamp(k / 0.7, 0, 1));
    h += sv("ellipse", { cx:330, cy:46, rx:76, ry:42, "class":"tr-enz" }) + T(330, 106, (cognate(S.ac) ? cognate(S.ac) + " " : "") + "synthetase", "tr-enzl", "middle");
    if (ld && ld.kind === "load" && k > 0.25) { var s = clamp((k - 0.25) / 0.4, 0, 1); h += sv("rect", { x:216 - 22 * s, y:120, width:22, height:22, rx:8, "class":"tr-atp", opacity:f1(1 - 0.6 * s) }) + sv("rect", { x:238 + 22 * s, y:120, width:22, height:22, rx:8, "class":"tr-atp", opacity:f1(1 - 0.6 * s) }); }
    else h += sv("rect", { x:216, y:120, width:44, height:22, rx:11, "class":"tr-atp" }) + T(238, 135, "ATP", "tr-atpl", "middle");
    if (ld && ld.kind === "load") h += aaSVG(lerp(300, 384, e), lerp(190, 24, e), ld.aa);
    else if (ld) { var r = k < 0.5 ? MV.ease(k * 2) : 1 - MV.ease((k - 0.5) * 2); h += aaSVG(lerp(300, 336, r), lerp(190, 78, r), ld.aa); if (k > 0.35) h += T(360, 82, "✗", "tr-x", "middle"); }
    else if (!S.aa) h += aaSVG(300, 190, S.pick) + T(300, 224, "to load", "tr-lab", "middle");
    if (S.treated && S.aa === "Ala" && !ld) h += T(384, 58, "was Cys", "tr-lab", "middle");
    var box = $("#tr-v2", host);
    box.innerHTML = '<svg viewBox="0 0 400 310" class="tr-svg" role="img" focusable="false" aria-label="' + MV.esc("Charging station: tRNA with anticodon 5′-" + S.ac + "-3′" + (S.aa ? ", carrying " + S.aa + " on its 3′ end" : ", uncharged") + ". A synthetase grips the acceptor end; an ATP sits beside it; " + (S.aa ? "" : S.pick + " waits to be loaded.")) + '">' + h + "</svg>";
  }
  function slotX(i, n){ return 220 + (i - (n - 1) / 2) * 104; }
  function drawV3(){
    var st = strip(), n = st.length, h = "";
    h += sv("rect", { x:16, y:206, width:408, height:14, rx:4, "class":"tr-mrna" }) + T(10, 218, "5′", "tr-end", "end") + T(430, 218, "3′", "tr-end") + T(220, 242, "mRNA (codons 5′ → 3′)", "tr-lab", "middle");
    st.forEach(function(c, i){
      var x0 = slotX(i, n), p = S.placed[i], j;
      for (j = 0; j < 3; j++) h += tabSVG(x0 + (j - 1) * 26, 184, 22, c[j], "tr-m" + (S.at === i ? " tr-cur" : ""), 0, j === 2);
      if (!p) return;
      if (p.rf) { h += sv("rect", { x:x0 - 40, y:104, width:80, height:70, rx:22, "class":"tr-enz" }) + T(x0, 136, "release", "tr-enzl", "middle") + T(x0, 152, "factor", "tr-enzl", "middle"); return; }
      var a = anim && anim.i === i ? anim.k : 1, dy = -(1 - MV.ease(a)) * 130, sh = rev(p.ac), pr = pairs(p.ac, c);
      var g = stemSVG([x0, 136], [x0, 66], 4, 8) + sv("line", { x1:x0 - 38, y1:137, x2:x0 + 38, y2:137, "class":"tr-st" });
      for (j = 0; j < 3; j++) g += tabSVG(x0 + (j - 1) * 26, 139, 22, sh[j], "tr-t", 0, j === 2);
      g += p.aa ? aaSVG(x0, 48, p.aa) : sv("circle", { cx:x0, cy:48, r:15, "class":"tr-aa0" }) + T(x0, 52, "none", "tr-sm", "middle");
      g += T(x0, 22, "5′-" + p.ac + "-3′", "tr-sm tr-mono", "middle");
      h += '<g transform="translate(0 ' + f1(dy) + ')"' + (a < 1 ? ' opacity="' + f1(0.3 + 0.7 * a) + '"' : "") + ">" + g + "</g>";
      if (a >= 1) for (j = 0; j < 3; j++) {
        var x = x0 + (j - 1) * 26;
        if (pr[j]) h += sv("line", { x1:x, y1:163, x2:x, y2:182, "class":"tr-bp" + (j === 2 && isWob(p.ac[0], c[2]) ? " tr-bpw" : "") });
        else h += T(x, 178, "✗", "tr-x", "middle");
      }
    });
    var box = $("#tr-v3", host);
    box.innerHTML = '<svg viewBox="0 0 440 250" class="tr-svg tr-ssvg" role="img" focusable="false" aria-label="' + MV.esc(stripAria()) + '">' + h + "</svg>";
  }
  function stripAria(){
    var st = strip();
    return "mRNA strip " + st.join(", ") + ". " + st.map(function(c, i){ var p = S.placed[i]; if (!p) return ""; if (p.rf) return "A release factor sits on " + c + ". "; return "tRNA 5′-" + p.ac + "-3′ (" + (p.aa || "uncharged") + ") on " + c + ": " + nPair(p.ac, c) + " of 3 bases pair. "; }).join("") + "The wobble position (codon base 3, anticodon 5′ base) is outlined.";
  }
  function chainText(){
    var st = strip(), any = false, out = st.map(function(c, i){ var p = S.placed[i]; if (!p) return "—"; any = true; if (p.rf) return "stop"; return nPair(p.ac, c) === 3 ? (p.aa || "nothing") : "—"; });
    return any ? "Delivered to the ribosome, left to right: " + out.join(" · ") : "";
  }
  function pairText(){
    if (S.at == null || !S.placed[S.at]) return "No tRNA placed yet";
    var c = strip()[S.at], p = S.placed[S.at]; if (p.rf) return "Stop codon " + c + ": no tRNA pairs; a release factor reads it";
    var n = nPair(p.ac, c), w = pairs(p.ac, c)[2] && isWob(p.ac[0], c[2]);
    return n === 3 ? "3 of 3 bases pair" + (w ? " (third by wobble)" : "") + " at " + c : n + " of 3 bases pair at " + c + ": no fit";
  }
  function paintRead(){
    var rows = [], pt = S.part && byId(PARTS, S.part);
    if (S.mode === "anat") rows.push(["Part selected", pt ? pt.read : "none (tap a part)"]);
    rows.push(["tRNA anticodon", sqH("5′-" + S.ac + "-3′") + " (" + sqH("3′-" + rev(S.ac) + "-5′") + " as it pairs)"]);
    rows.push(["Codons it can read", readsText(S.ac)]);
    rows.push(["Amino acid on board", S.aa ? S.aa + (S.treated && S.aa === "Ala" ? " (chemically changed from Cys)" : "") : "none (uncharged)"]);
    if (S.mode === "charge") rows.push(["Synthetase check", S.chk === "ok" ? "Match: loaded" : S.chk === "rej" ? "Rejected: wrong amino acid" : "not run yet"]);
    rows.push(["ATP used so far", String(S.atp)]);
    if (S.mode === "wob") rows.push(["Pairing at the codon shown", pairText()]);
    var h = MV.readoutHTML(rows), box = $("#tr-read", host); if (box.innerHTML !== h) box.innerHTML = h;
  }
  function sync(){
    modeR.set(S.mode); viewR.set(S.view); aaR.set(S.pick); trR.set(S.ac); stripR.set(S.strip); wbR.set(S.ac[0]);
    $("#tr-p1", host).hidden = S.mode !== "anat"; $("#tr-p2", host).hidden = S.mode !== "charge"; $("#tr-p3", host).hidden = S.mode !== "wob";
    $("#tr-v1", host).hidden = S.mode !== "anat"; $("#tr-v2", host).hidden = S.mode !== "charge"; $("#tr-v3", host).hidden = S.mode !== "wob";
    $("#tr-rotw", host).hidden = S.view !== "L"; $("#tr-roto", host).textContent = S.rot + "°";
    var lock = busy || !!pend;
    modeR.disable(lock); aaR.disable(lock); trR.disable(lock); stripR.disable(lock); wbR.disable(lock); viewR.disable(lock);
    $("#tr-load", host).disabled = lock; $("#tr-beak", host).disabled = lock || S.aa !== "Cys"; $("#tr-clear", host).disabled = lock; $("#tr-reset", host).disabled = lock; rotI.disabled = lock;
    $$("[data-part]", host).forEach(function(b){ var on = b.dataset.part === S.part; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    var pl = $("#tr-place", host), st = strip();
    MV.keepFocus(pl, function(){ pl.innerHTML = '<span class="rg-lab">Place on</span> ' + st.map(function(c, i){ return '<button type="button" class="chip tr-sq" data-place="' + i + '" data-k="pl' + S.strip + i + '" aria-label="Place the tRNA in hand on codon ' + (i + 1) + ", " + c + '"' + (lock ? " disabled" : "") + ">" + c + "</button>"; }).join(""); });
    $("#tr-hand", host).innerHTML = "In hand: tRNA " + sqH("5′-" + S.ac + "-3′") + ", " + (S.aa ? "carrying " + S.aa : "uncharged") + ". Tap a codon to place it.";
  }
  function paintCap(){
    var pt = S.part && byId(PARTS, S.part), c = "";
    if (S.mode === "anat") c = pt ? "<strong>" + pt.name + ".</strong> " + pt.job : "Tap a part of the tRNA, or choose one from the list." + (S.view === "L" ? " The dashed ruler shows the anticodon and the 3′ end, about 7 nm apart." : "");
    else if (S.mode === "charge") c = "Pick an amino acid and a tRNA, then press Load. A synthetase loads only its own amino acid, onto tRNAs whose anticodons read that amino acid’s codons.";
    else c = "Base-pair lines: solid for a standard pair, dashed for a wobble pair. The wobble position is outlined.";
    $("#tr-cap", host).innerHTML = c;
    $("#tr-msg", host).innerHTML = msg;
    $("#tr-chain", host).textContent = S.mode === "wob" ? chainText() : "";
  }
  function paintAll(){
    sync();
    if (S.mode === "anat") { ex.refresh(); ex.marks(S.part ? (function(){ var m = {}; m[S.part] = "on"; return m; })() : {}); }
    if (S.mode === "charge") drawV2();
    if (S.mode === "wob") drawV3();
    paintRead(); paintCap();
  }
  function changed(){ api.save(); paintAll(); MV.changed(); }

  // ---- challenges (plan: exact tests and named wrong states) ----
  function placedList(){ var st = strip(); return Object.keys(S.placed).map(function(i){ return { i:+i, p:S.placed[i], c:st[+i] }; }).filter(function(x){ return x.c && !x.p.rf; }); }
  function chal(id){
    var C = byId(X.challenges, id), M = C.msgs, pl = placedList();
    if (id === "tc1") {
      if (S.atp >= 1 && pl.some(function(x){ return x.c === "UGG" && x.p.ac === "CCA" && x.p.aa === "Trp" && nPair("CCA", "UGG") === 3; })) return { ok:true };
      if (S.ac === "ACC" || pl.some(function(x){ return x.p.ac === "ACC"; })) return { ok:false, msg:M.acc };
      if (S.ac === "CCA" && S.aa === "Trp") return { ok:false, msg:strip().indexOf("UGG") < 0 ? M.strip : M.place };
      if (S.rej && S.rej.aa === "Trp") return { ok:false, msg:M.wrongTrna };
      if (S.ac === "CCA") return { ok:false, msg:M.uncharged };
      return { ok:false, msg:C.general };
    }
    if (id === "tc2") {
      if (S.ac === "IAG" && S.aa === "Leu") return { ok:true };
      if (S.ac === "GAG") return { ok:false, msg:M.gag };
      if (S.ac === "UAG") return { ok:false, msg:M.uag };
      if (S.ac === "IAG") return { ok:false, msg:S.aa ? M.aa : M.uncharged };
      return { ok:false, msg:C.general };
    }
    if (id === "tc3") {
      if (S.strip !== 3) return { ok:false, msg:M.strip };
      var good = pl.filter(function(x){ return nPair(x.p.ac, x.c) === 3; });
      if (!good.length) return { ok:false, msg:M.none };
      if (good.some(function(x){ return x.p.aa !== "Gly"; })) return { ok:false, msg:M.gly };
      var set = [], cov = {};
      good.forEach(function(x){ if (set.indexOf(x.p.ac) < 0) set.push(x.p.ac); reads(x.p.ac).forEach(function(r){ cov[r.c] = 1; }); });
      var left = ["GGU", "GGC", "GGA", "GGG"].filter(function(c){ return !cov[c]; });
      if (!left.length) return set.length === 2 ? { ok:true } : { ok:false, msg:M.many };
      if (set.length === 1 && set[0] === "ICC") return { ok:false, msg:M.ione };
      if (set.indexOf("GCC") >= 0 && set.indexOf("CCC") >= 0 && left.join() === "GGA") return { ok:false, msg:M.gc };
      return { ok:false, msg:M.left + left.join(", ") + "." };
    }
    return { ok:false };
  }

  EXF = { show:function(v){ if (v) paintAll(); } };
  paintAll();
  function setPred(o){ Object.keys(o).forEach(function(k){ S[k] = o[k]; }); S.placed = {}; S.at = null; S.chk = ""; msg = ""; changed(); }
  return {
    predict:{
      start:function(p){
        if (p.id === "p1") setPred({ mode:"wob", strip:0, ac:"CAU", aa:"Met", treated:false });
        else if (p.id === "p2") { setPred({ mode:"wob", strip:6, ac:"GCA", aa:"Ala", treated:true }); msg = "The beaker changed this tRNA’s cysteine into alanine. Its anticodon, 5′-GCA-3′, still reads UGU."; paintCap(); }
        else if (p.id === "p3") setPred({ mode:"wob", strip:1, ac:"GAA", aa:"Phe", treated:false });
        else setPred({ mode:"wob", strip:7, ac:"CCA", aa:"Trp", treated:false });
      },
      run:function(p, done){
        pend = done; sync();
        function fin(){ var d = pend; pend = null; sync(); paintCap(); if (d) d(); }
        if (p.id === "p1") placeAt(0, function(){ msg = "Turned around, the anticodon reads 3′-UAC-5′: it pairs base by base with 5′-AUG-3′."; fin(); }, true);
        else if (p.id === "p2") placeAt(1, function(){ msg = "The ribosome accepted the pairing, and Ala joined the chain at a UGU (Cys) codon."; fin(); }, true);
        else if (p.id === "p3") placeAt(0, function(){ placeAt(1, function(){ placeAt(2, function(){ placeAt(3, function(){ msg = "It pairs with UUC (normal) and UUU (wobble G–U). UUA and UUG fail."; fin(); }, true); }, true); }, true); }, true);
        else placeAt(0, function(){ placeAt(1, function(){ msg = "No tRNA arrives at UAA. A release factor reads the stop codon instead."; fin(); }, true); }, true);
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Codon–anticodon matching ----------
function part3(host, api){
  var P = api.content, S = api.S, s1 = P.s1, s2 = P.s2, s3 = P.s3;
  S.s1 = S.s1 || { i:0, b:["", "", "", "", "", ""], sel:0, done:{}, ok:false };
  S.s2 = S.s2 || { seq:[], ok:false };
  S.s3 = S.s3 || { fam:"gly", wob:false };
  var m1 = null, m2 = null;
  host.innerHTML =
    '<section class="tr-sta" aria-labelledby="tr-s1h"><h3 id="tr-s1h">' + s1.title + "</h3><p>" + s1.text + '</p><div id="tr-s1"></div></section>' +
    '<section class="tr-sta" aria-labelledby="tr-s2h"><h3 id="tr-s2h">' + s2.title + '</h3><details class="alg" open><summary>Check it with data</summary><p>' + s2.text + "</p>" +
      '<div class="tbl-wrap"><table class="tr-dt"><caption class="vh">Adapter experiment results</caption><thead><tr>' + s2.head.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + "</tr></thead><tbody>" +
      s2.rows.map(function(r, i){ return '<tr><th scope="row">' + (i + 1) + ". " + r[0] + "</th><td>" + sqH(r[1]) + "</td><td>" + r[2] + "</td></tr>"; }).join("") + "</tbody></table></div></details>" +
      "<p>" + s2.ask + '</p><div id="tr-s2"></div></section>' +
    '<section class="tr-sta" aria-labelledby="tr-s3h"><h3 id="tr-s3h">' + s3.title + "</h3><p>" + s3.text + '</p><div id="tr-s3"></div>' +
      ctDetails("trct3") + "</section>";

  // Station 1: write it both ways
  function cod(){ return s1.codons[S.s1.i % s1.codons.length]; }
  function want(){ var c = cod(), comp = c.split("").map(function(b){ return RC[b]; }).join(""); return comp + rev(comp); }
  function paint1(){
    var x = S.s1, c = cod(), box = $("#tr-s1", host), solved = x.ok;
    function slot(k){ var v = x.b[k], on = !solved && x.sel === k; return '<button type="button" class="tr-slot' + (on ? " on" : "") + (v ? "" : " empty") + '" data-slot="' + k + '" data-k="sl' + k + '" aria-pressed="' + on + '" aria-label="' + (k < 3 ? "Top box" : "Bottom box") + ", slot " + (k % 3 + 1) + ": " + (v || "empty") + '"' + (solved ? " disabled" : "") + ">" + (v || "·") + "</button>"; }
    var h = '<div class="tr-wb2"><div class="tr-wrow"><span class="tr-wl">' + s1.box1 + '</span><span class="tr-we">3′-</span>' + slot(0) + slot(1) + slot(2) + '<span class="tr-we">-5′</span></div>' +
      '<div class="tr-wrow tr-lines" aria-hidden="true"><span class="tr-wl"></span><span class="tr-we"></span>' + [0, 1, 2].map(function(){ return '<span class="tr-pl' + (solved ? " on" : "") + '"></span>'; }).join("") + '<span class="tr-we"></span></div>' +
      '<div class="tr-wrow"><span class="tr-wl">Codon</span><span class="tr-we">5′-</span>' + c.split("").map(function(b){ return '<span class="tr-cb">' + b + "</span>"; }).join("") + '<span class="tr-we">-3′</span></div>' +
      '<div class="tr-wrow tr-gap"><span class="tr-wl">' + s1.box2 + '</span><span class="tr-we">5′-</span>' + slot(3) + slot(4) + slot(5) + '<span class="tr-we">-3′</span></div></div>';
    if (!solved) h += '<div class="tr-bases" role="group" aria-label="Bases">' + ["A", "C", "G", "U", "T"].map(function(b){ return '<button type="button" class="chip tr-sq" data-base="' + b + '" data-k="bs' + b + '">' + b + "</button>"; }).join("") + '<button type="button" class="chip" data-base="" data-k="bsx">Clear slot</button></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-s1="check" data-k="s1chk">Check</button></div>';
    else h += '<div class="q-actions"><button type="button" class="btn primary sm" data-s1="next" data-k="s1next">Next codon</button></div>';
    if (solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s1.good + " Codon " + sqH("5′-" + c + "-3′") + " pairs with " + sqH("3′-" + want().slice(0, 3) + "-5′") + ", written " + sqH("5′-" + want().slice(3) + "-3′") + ".");
    else if (m1) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + m1);
    var done = Object.keys(x.done).length;
    h += '<p class="tiny muted">Codons done: ' + done + "/" + s1.codons.length + "</p>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  $("#tr-s1", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return; var x = S.s1;
    if (b.dataset.slot != null) { x.sel = +b.dataset.slot; paint1(); return; }
    if (b.dataset.base != null) { x.b[x.sel] = b.dataset.base; m1 = null; if (b.dataset.base && x.sel < 5) x.sel++; api.save(); paint1(); return; }
    if (b.dataset.s1 === "next") { x.i = (x.i + 1) % s1.codons.length; x.b = ["", "", "", "", "", ""]; x.sel = 0; x.ok = false; m1 = null; api.save(); paint1(); return; }
    if (b.dataset.s1 !== "check") return;
    var w = want(), got = x.b.join("");
    if (x.b.some(function(v){ return !v; })) m1 = s1.msgs.empty;
    else if (got === w) { x.ok = true; x.done[cod()] = 1; m1 = null; }
    else if (got.indexOf("T") >= 0) m1 = s1.msgs.t;
    else if (got.slice(0, 3) !== w.slice(0, 3)) m1 = s1.msgs.box1;
    else if (got.slice(3) === got.slice(0, 3)) m1 = s1.msgs.same;
    else m1 = s1.msgs.box2;
    api.save(); paint1(); MV.focusFb($("#tr-s1", host));
  });

  // Station 2: @component S12 cerBuilder — claim, evidence and reasoning chips tapped into an ordered explanation;
  // accepted orders put the claim first or last (several valid orders)
  function paint2(){
    var x = S.s2, box = $("#tr-s2", host);
    var h = '<div class="tr-cer" role="group" aria-label="Chips: tap to add to your explanation">' + s2.chips.map(function(c){ var used = x.seq.indexOf(c.id) >= 0; return '<button type="button" class="chip tr-cchip' + (used ? " on" : "") + '" data-cer="' + c.id + '" data-k="cer' + c.id + '" aria-pressed="' + used + '"' + (x.ok ? " disabled" : "") + '><span class="tr-role">' + c.role + "</span> " + c.t + "</button>"; }).join("") + "</div>";
    h += '<div class="tr-expl"><span class="rg-lab">Your explanation</span><ol>' + (x.seq.length ? x.seq.map(function(id){ var c = byId(s2.chips, id); return "<li><strong>" + c.role + ":</strong> " + c.t + "</li>"; }).join("") : '<li class="muted">Tap chips to add them here, in order.</li>') + "</ol></div>";
    if (!x.ok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-s2="check" data-k="s2chk">Check</button><button type="button" class="btn ghost sm" data-s2="clear" data-k="s2clr">Start over</button></div>';
    if (x.ok) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s2.good);
    else if (m2) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + m2);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  $("#tr-s2", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return; var x = S.s2;
    if (b.dataset.cer) { var id = b.dataset.cer, k = x.seq.indexOf(id); if (k >= 0) x.seq.splice(k, 1); else x.seq.push(id); m2 = null; api.save(); paint2(); return; }
    if (b.dataset.s2 === "clear") { x.seq = []; m2 = null; api.save(); paint2(); return; }
    if (b.dataset.s2 !== "check") return;
    var bad = x.seq.map(function(id){ return byId(s2.chips, id); }).filter(function(c){ return !c.good; })[0];
    if (bad) m2 = bad.fb;
    else if (x.seq.length !== 3) m2 = s2.need;
    else if (x.seq[0] !== "c" && x.seq[2] !== "c") m2 = s2.order;
    else { x.ok = true; m2 = null; }
    api.save(); paint2(); MV.focusFb($("#tr-s2", host));
  });

  // Station 3: wobble counts
  var famR = null;
  function paint3(){
    var x = S.s3, f = byId(s3.families, x.fam), box = $("#tr-s3b", host);
    var h = '<div class="tr-fam">' + f.codons.map(function(c){
      var by = x.wob ? f.set.filter(function(ac){ return reads(ac).some(function(r){ return r.c === c; }); })[0] : null;
      return '<div class="tr-fc"><span class="tr-sq tr-fcod">' + c + "</span><span class=\"tr-fby\">" + (x.wob ? "read by " + sqH(by) : "its own tRNA") + "</span></div>";
    }).join("") + "</div>";
    h += '<p class="tr-big">' + f.aa + " family: <strong>" + (x.wob ? 2 : 4) + " tRNAs</strong> " + (x.wob ? "(" + f.set.map(function(a){ return sqH("5′-" + a + "-3′"); }).join(" and ") + ")" : "(one for each codon)") + "</p>";
    h += '<p class="tr-big">' + s3.all + ": <strong>" + (x.wob ? s3.allYes : s3.allNo) + "</strong></p><p class=\"tiny muted\">" + s3.note + "</p>";
    box.innerHTML = h;
  }
  $("#tr-s3", host).innerHTML = '<div id="tr-s3f"></div><div class="tr-swrow"><button type="button" class="btn ghost sm tr-sw" role="switch" id="tr-s3w" data-k="s3w"></button></div><div id="tr-s3b" aria-live="polite"></div>';
  famR = radios($("#tr-s3f", host), { label:"Four-codon family", key:"f", cls:"chips", options:s3.families.map(function(f){ return { id:f.id, t:f.aa + " " + sqH(f.codons[0].slice(0, 2) + "_") }; }), value:S.s3.fam, onChange:function(v){ S.s3.fam = v; api.save(); paint3(); } });
  function paintSw(){ var b = $("#tr-s3w", host); b.setAttribute("aria-checked", S.s3.wob); b.innerHTML = "Wobble: <strong>" + (S.s3.wob ? "On" : "Off") + "</strong>"; }
  $("#tr-s3w", host).addEventListener("click", function(){ S.s3.wob = !S.s3.wob; api.save(); paintSw(); paint3(); });
  paint1(); paint2(); paintSw(); paint3();
}

// ---------- Practice 2: Wobble puzzles (codon chips + number entry, N4; adapted from SBI4U 15's tagger) ----------
function wobblePuzzles(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:{}, also:null, v:"", tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="tr-card">' + a.card + '</p>' + ctDetails("trctp") + a.items.map(function(it){ return '<div class="q" data-wp="' + it.id + '"></div>'; }).join("");
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-wp="' + it.id + '"]', host);
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + (it.star ? '<span class="tag">★</span> ' : "") + it.prompt + "</div></div>";
    if (it.kind === "pick") {
      h += '<div class="tr-pick" role="group" aria-label="Codons: tap every one that applies">' + it.chips.map(function(c){ var on = !!x.pick[c]; return '<button type="button" class="chip tr-sq' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-pk="' + c + '" data-k="' + it.id + c + '"' + (x.solved ? " disabled" : "") + ">" + c + "</button>"; }).join("") + "</div>";
      if (it.also) h += '<div class="tr-also"><span class="rg-lab">' + it.also.q + '</span><div class="tr-pick" role="group" aria-label="' + MV.esc(MV.plain(it.also.q)) + '">' + it.also.options.map(function(o, k){ var on = x.also === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-al="' + k + '" data-k="' + it.id + "al" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div></div>";
    } else {
      h += '<div class="numrow"><label for="wp-' + it.id + '">Answer</label> <input class="numin" id="wp-' + it.id + '" data-wpv="' + it.id + '" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(x.v) + '"' + (x.solved ? " disabled" : "") + "> " + (it.unit || "") + "</div>";
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.wpv; if (!id) return; ist(id).v = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.wpv) { var b = host.querySelector('[data-k="' + e.target.dataset.wpv + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-wp]"); if (!box) return;
    var it = byId(a.items, box.dataset.wp), x = ist(it.id);
    if (b.dataset.pk) { x.pick[b.dataset.pk] = !x.pick[b.dataset.pk]; msgs[it.id] = null; api.save(); paintItem(it); return; }
    if (b.dataset.al != null) { x.also = +b.dataset.al; msgs[it.id] = null; api.save(); paintItem(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    var ans = MV.ans(it), ok = false, fb = null;
    if (it.kind === "pick") {
      var got = it.chips.filter(function(c){ return x.pick[c]; }).sort(), want = ans.slice().sort();
      if (!got.length) { msgs[it.id] = "Tap at least one codon first."; paintItem(it); return; }
      var chipsOk = got.join() === want.join();
      if (!chipsOk) { var w = (it.wrong || []).filter(function(r){ return r.match.slice().sort().join() === got.join(); })[0]; fb = w ? w.fb : (it.general || a.general); }
      else if (it.also) {
        if (x.also == null) { msgs[it.id] = "The codons are right. Now answer: " + it.also.q; paintItem(it); return; }
        if (MV.ok(it.also.options[x.also])) ok = true; else fb = it.also.fb;
      } else ok = true;
    } else {
      var v = parseVal(x.v);
      if (v == null) { msgs[it.id] = "Type a whole number first."; paintItem(it); return; }
      if (v === ans) ok = true;
      else { var w2 = (it.wrong || []).filter(function(r){ return r.match === v; })[0]; fb = w2 ? w2.fb : (it.general || a.general); }
    }
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + fb + " Try again."; }
    api.save(); paintItem(it); MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: One tRNA, three codons (live wobble reader) ----------
var task = (function(){
  var api = null, TK = null;
  function st(){ var s = api.S; ["aa", "s1", "s2", "s3"].forEach(function(k){ if (s[k] == null) s[k] = ""; }); return s; }
  function read(){ if (!api) return { aa:"", s1:"", s2:"", s3:"" }; var s = st(); return { aa:s.aa, s1:s.s1, s2:s.s2, s3:s.s3 }; }
  function acOf(d){ return d.s1 + d.s2 + d.s3; }
  function draw(){
    var d = read(), box = $("#tr-tpv"); if (!box) return;
    var full = d.s1 && d.s2 && d.s3, ac = acOf(d), r = full ? reads(ac) : [];
    var h = '<h4 class="tr-th">Your tRNA</h4><p>Anticodon ' + sqH("5′-" + (d.s1 || "·") + (d.s2 || "·") + (d.s3 || "·") + "-3′") + (full ? " (pairs as " + sqH("3′-" + rev(ac) + "-5′") + ")" : "") + " · carries " + (d.aa || "—") + "</p>";
    h += '<h4 class="tr-th">Live wobble reader</h4>';
    if (!full) h += '<p class="tiny muted">Fill all three anticodon slots to see the codons it reads.</p>';
    else h += '<ul class="tr-rl">' + r.map(function(x){ var a = aaOf(x.c), good = d.aa && a === d.aa; return '<li class="' + (good ? "ok" : "no") + '">' + sqH(x.c) + " → " + (a === "Stop" ? "<strong>Stop</strong>" : a) + (x.w ? " <span class=\"muted\">(by wobble)</span>" : "") + " " + (d.aa ? (good ? "✓" : "✗") : "") + "</li>"; }).join("") + "</ul><p class=\"tiny\">Reads " + r.length + " codon" + (r.length === 1 ? "" : "s") + ".</p>";
    box.innerHTML = h;
  }
  function lab(k){ var p = k.split(":"); return p[0] + " with " + sqH("5′-" + p[1] + "-3′"); }
  return {
    render:function(inp, pv, a){
      api = a; TK = a.content || {}; var s = st();
      var aas = TK.aas || ["Ala", "Arg", "Asn", "Asp", "Cys", "Gln", "Glu", "Gly", "His", "Ile", "Leu", "Lys", "Met", "Phe", "Pro", "Ser", "Thr", "Trp", "Tyr", "Val"];
      inp.innerHTML = '<div class="tr-tin"><div id="tr-taa"></div><div id="tr-ts1"></div><div id="tr-ts2"></div><div id="tr-ts3"></div><p class="tr-card">' +
        "<strong>Wobble rules (simplified)</strong>: anticodon 5′ base → codon 3′ base: G → C or U · U → A or G · I → U, C or A · C → G only · A → U only." +
        "</p>" + ctDetails("trctt") + "</div>";
      function upd(){ a.save(); draw(); a.update(); }
      radios($("#tr-taa", inp), { label:"Amino acid", key:"ta", cls:"chips", options:aas.map(function(x){ return { id:x, t:x, aria:x + ", " + AAN[x] }; }), value:s.aa, onChange:function(v){ s.aa = v; upd(); } });
      radios($("#tr-ts1", inp), { label:TK.slot1 || "Slot 1: the wobble (5′) base", key:"t1", cls:"chips", options:["A", "C", "G", "U", "I"].map(function(b){ return { id:b, t:sqH(b) }; }), value:s.s1, onChange:function(v){ s.s1 = v; upd(); } });
      radios($("#tr-ts2", inp), { label:TK.slot2 || "Slot 2: middle base", key:"t2", cls:"chips", options:["A", "C", "G", "U"].map(function(b){ return { id:b, t:sqH(b) }; }), value:s.s2, onChange:function(v){ s.s2 = v; upd(); } });
      radios($("#tr-ts3", inp), { label:TK.slot3 || "Slot 3: the 3′ base", key:"t3", cls:"chips", options:["A", "C", "G", "U"].map(function(b){ return { id:b, t:sqH(b) }; }), value:s.s3, onChange:function(v){ s.s3 = v; upd(); } });
      pv.innerHTML = '<div class="tr-tpv" id="tr-tpv" role="group" aria-label="Your tRNA design" aria-live="polite"></div>';
      draw();
    },
    read:read,
    valid:function(d){ return d.aa && d.s1 && d.s2 && d.s3 ? true : "Choose an amino acid and all three anticodon bases."; },
    checks:function(d){
      var r = reads(acOf(d));
      return [r.length > 0 && r.every(function(x){ return aaOf(x.c) === d.aa; }), r.length >= 3, d.s3 === "C"];
    },
    key:function(d){ return d.aa + ":" + acOf(d); },
    label:lab,
    text:function(k){ var p = k.split(":"); return p[0] + " with 5′-" + p[1] + "-3′"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ wobble:wobblePuzzles },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
