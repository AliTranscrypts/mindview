// SBI4U 21 Structure and Replication: hero (ladder → helix → two daughter helices), Build it, then copy it (S5 sequence
// slots on a dnaDraw ladder or helix with S1 zoom levels; replication fork with an order builder and a deterministic knockout
// model), The experiments that found it (six evidence stations), Label the molecule, Base-pairing puzzles, "Cut here" (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 15 / 08) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "dn-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/,/g, "").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function seqTxt(a){ return a.map(function(b){ return b || "·"; }).join(""); }
function sqH(s){ return '<span class="dn-sq">' + s + "</span>"; }

// ---------- @component radioGroup (copied from SBI4U 15 / 08 / MHF4U 25: options may be disabled with dis:true) ----------
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
    e.preventDefault(); e.stopPropagation();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}

// ---------- @component S1 diagramExplorer (merged from SBI4U 17 / 13 (arrow keys) and 03 (marks, name tags); o.min sets the
// smallest button size in px: 44 by default, 24 where parts sit close together) ----------
// diagramExplorer(host, { levels:[{ id, name, vb:[w, h], draw() -> SVG markup, aria() -> text, hotspots:[{ id, label, zones:[[x, y, w, h]],
//   tag:[x, y, "l"|"r"|"c"] }] }], level:"id", min:44, onTap(id, levelId) })
//   -> { level(), levelDef(id), setLevel(id), marks({id:"good"|"bad"|"on"}), names({id:html}), svg(), setAria(text), labels(fn), refresh() }
function diagramExplorer(host, o){
  var lvId = o.level || o.levels[0].id, marks = {}, names = {}, mn = o.min || 44;
  host.innerHTML = '<div class="s1"><div class="s1-stage"><svg class="s1-svg" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg><div class="s1-tags" aria-hidden="true"></div><div class="s1-hs" role="group"></div></div></div>';
  var stage = $(".s1-stage", host), svg = $(".s1-svg", host), hsBox = $(".s1-hs", host), tagBox = $(".s1-tags", host);
  function L(){ return o.levels.filter(function(x){ return x.id === lvId; })[0]; }
  function p2(v){ return Math.round(v * 100) / 100; }
  function render(){
    var lv = L(), w = lv.vb[0], h = lv.vb[1];
    stage.style.aspectRatio = w + " / " + h;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.innerHTML = lv.draw();
    svg.setAttribute("aria-label", lv.aria ? lv.aria() : lv.name);
    hsBox.setAttribute("aria-label", lv.name);
    hsBox.hidden = !lv.hotspots.length;
    var list = [];
    lv.hotspots.forEach(function(hs){ hs.zones.forEach(function(z, zi){ list.push({ hs:hs, z:z, zi:zi, area:z[2] * z[3] }); }); });
    list.slice().sort(function(a, b){ return b.area - a.area; }).forEach(function(it, i){ it.zx = 1 + i; });
    list.sort(function(a, b){ return (a.z[1] - b.z[1]) || (a.z[0] - b.z[0]); });
    hsBox.innerHTML = list.map(function(it){
      var z = it.z, cx = (z[0] + z[2] / 2) / w * 100, cy = (z[1] + z[3] / 2) / h * 100, pw = z[2] / w * 100, ph = z[3] / h * 100;
      return '<button type="button" class="s1-b" data-hs="' + it.hs.id + '" data-k="s1' + lvId + it.hs.id + it.zi + '" aria-label="' + MV.esc(it.hs.label) + '" style="left:calc(' + p2(cx) + "% - max(" + mn / 2 + "px, " + p2(pw / 2) + "%));top:calc(" + p2(cy) + "% - max(" + mn / 2 + "px, " + p2(ph / 2) + "%));width:max(" + mn + "px, " + p2(pw) + "%);height:max(" + mn + "px, " + p2(ph) + "%);z-index:" + it.zx + '"></button>';
    }).join("");
    paint();
  }
  function paint(){
    $$(".s1-b", hsBox).forEach(function(b){ b.className = "s1-b" + (marks[b.dataset.hs] ? " " + marks[b.dataset.hs] : ""); });
    var lv = L(), w = lv.vb[0], h = lv.vb[1];
    tagBox.innerHTML = lv.hotspots.filter(function(hs){ return names[hs.id]; }).map(function(hs){
      var t = hs.tag || [hs.zones[0][0] + hs.zones[0][2] / 2, hs.zones[0][1] + hs.zones[0][3] / 2, "c"];
      return '<span class="s1-tag ' + (t[2] || "c") + ' s1-name" style="left:' + p2(t[0] / w * 100) + "%;top:" + p2(t[1] / h * 100) + '%">' + names[hs.id] + "</span>";
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
    levelDef:function(id){ return o.levels.filter(function(x){ return x.id === id; })[0]; },
    setLevel:function(id){ if (id !== lvId) { lvId = id; render(); } },
    marks:function(m){ marks = m || {}; paint(); },
    names:function(m){ names = m || {}; paint(); },
    svg:function(){ return svg; },
    setAria:function(t){ svg.setAttribute("aria-label", t); },
    labels:function(fn){ $$(".s1-b", hsBox).forEach(function(b){ b.setAttribute("aria-label", fn(b.dataset.hs)); }); },
    refresh:render
  };
}

// ---------- @component S5 dnaDraw — DNA (and RNA) strands as SVG, as a ladder or a helix. Modules 22–33 copy this block
// (with its .dn-* rules in app.css). Colour roles (course plan §3) by class dn-r-<role>: tpl --ink (template / parent),
// cod --ink-2 (coding / second parent), new --pen (new DNA), pri --bio-h (RNA primer), rna --bio-nadh (mRNA).
//   comp(b) partner base (A↔T, G↔C; U → A); isPair(a, b) true only for A–T and G–C; hb(a, b) 2 (A–T), 3 (G–C) or 0;
//   revComp("GATTACA") -> "TGTAATC" (the partner of a 5′ → 3′ string, written 5′ → 3′).
//   strandSVG({ pts:[[x, y]…] backbone point per nucleotide (left → right), tips:[[x, y]…] where each base tab ends,
//     seq:["A", "", …] ("" = empty slot, drawn dashed), role, path:"M…" (smooth backbone; default polyline), ends:["5′", "3′"]
//     (left, right) or null, w:24 (tab width), letters:true, marks:{ i:"sel"|"bad" }, op:[opacity per nucleotide], phos:true })
//   bondsSVG(tipsA, tipsB, seqA, seqB, { show(i), op:[…] }) — hydrogen-bond dashes (2 for A–T, 3 for G–C), red ✗ for a mismatch
//   duplexSVG({ top:[…], bot:[…], x0, dx, y (axis), h (half the backbone gap), fill:0.36 (tab length share of the gap),
//     twist:0 (ladder) … 1 (helix), step:π/5 (radians per bp: 10 bp per turn), phase:0, roles:["tpl", "cod"],
//     ends:[["5′", "3′"], ["3′", "5′"]], marks:[{…}, {…}], n (draw only the first n pairs), bond(i) -> show the bonds of pair i })
//     -> { svg, top:{pts, tips}, bot:{pts, tips} } ----------
var PAIR = { A:"T", T:"A", G:"C", C:"G", U:"A" };
function comp(b){ return PAIR[b] || ""; }
function isPair(a, b){ return !!a && !!b && a !== "U" && b !== "U" && PAIR[a] === b; }
function hb(a, b){ return isPair(a, b) ? (a === "G" || a === "C" ? 3 : 2) : 0; }
function revComp(s){ return s.split("").reverse().map(comp).join(""); }
function strandSVG(o){
  var pts = o.pts, n = pts.length, role = o.role || "tpl", w = o.w || 24, h = "", i;
  if (!n) return "";
  var d = o.path || ("M" + pts.map(function(p){ return f1(p[0]) + " " + f1(p[1]); }).join(" L"));
  h += sv("path", { d:d, "class":"dn-bb dn-r-" + role });
  if (o.phos !== false) for (i = 0; i < n - 1; i++) h += sv("circle", { cx:(pts[i][0] + pts[i + 1][0]) / 2, cy:(pts[i][1] + pts[i + 1][1]) / 2, r:3.3, "class":"dn-ph dn-r-" + role });
  for (i = 0; i < n; i++) {
    var p = pts[i], t = o.tips[i], b = o.seq[i] || "", y0 = Math.min(p[1], t[1]), len = Math.abs(t[1] - p[1]), op = o.op ? o.op[i] : 1, mk = o.marks && o.marks[i];
    if (len < 3 || op <= 0.04) continue;
    var oa = op < 1 ? Math.round(op * 100) / 100 : null;
    h += sv("rect", { x:p[0] - w / 2, y:y0, width:w, height:len, rx:5, "class":"dn-tab dn-r-" + role + (b ? "" : " dn-empty") + (mk ? " dn-" + mk : ""), opacity:oa });
    if (b && o.letters !== false && len >= 14) h += sv("text", { x:p[0], y:y0 + len / 2 + 5, "class":"dn-bl" + (mk === "bad" ? " dn-blbad" : ""), "text-anchor":"middle", opacity:oa }, b);
  }
  if (o.ends) {
    var ed = o.endDx || 17;
    if (o.ends[0]) h += txt(pts[0][0] - ed, pts[0][1] + 5, o.ends[0], "dn-end", "end");
    if (o.ends[1]) h += txt(pts[n - 1][0] + ed, pts[n - 1][1] + 5, o.ends[1], "dn-end");
  }
  return h;
}
function bondsSVG(A, B, sa, sb, o){
  o = o || {}; var h = "";
  for (var i = 0; i < Math.min(A.length, B.length); i++) {
    if (o.show && !o.show(i)) continue;
    var a = sa[i], b = sb[i]; if (!a || !b) continue;
    var y1 = A[i][1], y2 = B[i][1], x = A[i][0]; if (Math.abs(y2 - y1) < 5) continue;
    var lo = Math.min(y1, y2) + 1.5, hi = Math.max(y1, y2) - 1.5, op = o.op ? Math.round(o.op[i] * 100) / 100 : null;
    if (isPair(a, b)) { var k = hb(a, b); for (var j = 0; j < k; j++) { var xx = x + (j - (k - 1) / 2) * 5.5; h += sv("line", { x1:xx, y1:lo, x2:xx, y2:hi, "class":"dn-hb", opacity:op === 1 ? null : op }); } }
    else h += txt(x, (y1 + y2) / 2 + 5, "✗", "dn-x", "middle");
  }
  return h;
}
function duplexSVG(o){
  var n = o.top.length, nn = o.n == null ? n : Math.min(n, o.n), step = o.step == null ? Math.PI / 5 : o.step, tw = o.twist || 0, ph = o.phase || 0, fill = o.fill || 0.36;
  function th(u){ return ph + u * step * tw; }
  function yT(u){ return o.y - o.h * Math.cos(th(u)); }
  function yB(u){ return o.y + o.h * Math.cos(th(u)); }
  var T = { pts:[], tips:[] }, B = { pts:[], tips:[] }, op = [], i;
  for (i = 0; i < nn; i++) {
    var x = o.x0 + i * o.dx, a = yT(i), b = yB(i);
    T.pts.push([x, a]); B.pts.push([x, b]); T.tips.push([x, a + (b - a) * fill]); B.tips.push([x, b + (a - b) * fill]);
    op.push(tw ? clamp(Math.abs(Math.cos(th(i))) * 1.7, 0.3, 1) : 1);
  }
  function curve(f){ var d = ""; for (var u = 0; u <= nn - 1 + 1e-9; u += 0.125) d += (d ? " L" : "M") + f1(o.x0 + u * o.dx) + " " + f1(f(u)); return d; }
  var R = o.roles || ["tpl", "cod"], E = o.ends || [null, null], M = o.marks || [{}, {}];
  var svg = bondsSVG(T.tips, B.tips, o.top, o.bot, { show:o.bond, op:op }) +
    strandSVG({ pts:B.pts, tips:B.tips, seq:o.bot, role:R[1], path:tw ? curve(yB) : null, ends:E[1], marks:M[1], op:op, letters:o.letters }) +
    strandSVG({ pts:T.pts, tips:T.tips, seq:o.top, role:R[0], path:tw ? curve(yT) : null, ends:E[0], marks:M[0], op:op, letters:o.letters });
  return { svg:svg, top:T, bot:B };
}

// ---------- @component nucleotideSVG / basePairSVG — S1 zoom drawings of one nucleotide (phosphate, deoxyribose with carbons
// 1′–5′, base) and one base pair (purine = two fused rings, pyrimidine = one ring, hydrogen-bond dashes). Both 400 × 240. ----------
function poly(pts, cls, extra){ return sv("polygon", Object.assign({ points:pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":cls }, extra || {})); }
function hexPts(cx, cy, r){ var p = []; for (var k = 0; k < 6; k++) { var a = (30 + 60 * k) * Math.PI / 180; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return p; }
// a base glyph centred on (cx, cy): pyrimidine = hexagon; purine = hexagon + fused pentagon on its right
function baseGlyph(cx, cy, b, r){
  r = r || 20;
  var pur = b === "A" || b === "G", hx = pur ? cx - r * 0.45 : cx, h = poly(hexPts(hx, cy, r), "dn-ring");
  if (pur) {
    var ex = hx + r * 0.866, a = r * 0.688, R = r * 0.8507, pc = ex + a, p5 = [];
    [144, 72, 0, -72, -144].forEach(function(dg){ var q = dg * Math.PI / 180; p5.push([pc + R * Math.cos(q), cy + R * Math.sin(q)]); });
    h += poly(p5, "dn-ring");
  }
  return h + txt(hx, cy + 5.5, b, "dn-rl", "middle");
}
function nucleotideSVG(b){
  var h = "", S = [[190, 92], [228, 118], [214, 162], [166, 162], [152, 118]];
  h += sv("line", { x1:94, y1:76, x2:128, y2:78, "class":"dn-bond" }) + sv("line", { x1:128, y1:78, x2:152, y2:118, "class":"dn-bond" });
  h += sv("circle", { cx:70, cy:76, r:24, "class":"dn-phz" }) + txt(70, 82, "P", "dn-rl", "middle");
  h += poly(S, "dn-sug") + txt(190, 108, "O", "dn-sm", "middle");
  h += sv("line", { x1:228, y1:118, x2:262, y2:112, "class":"dn-bond" }) + baseGlyph(300, 112, b || "A", 24);
  h += sv("line", { x1:166, y1:162, x2:158, y2:194, "class":"dn-bond" }) + txt(158, 212, "OH", "dn-sm", "middle");
  h += sv("line", { x1:214, y1:162, x2:222, y2:192, "class":"dn-bond" }) + txt(224, 208, "H", "dn-sm", "middle");
  h += txt(128, 66, "5′", "dn-cn", "middle") + txt(236, 136, "1′", "dn-cn") + txt(224, 176, "2′", "dn-cn") + txt(152, 180, "3′", "dn-cn", "end") + txt(140, 122, "4′", "dn-cn", "end");
  h += txt(70, 120, "phosphate", "dn-sm", "middle") + txt(190, 232, "deoxyribose", "dn-sm", "middle") + txt(300, 160, "base", "dn-sm", "middle");
  return h;
}
function basePairSVG(a, b){
  var h = "", A = a || "A", B = b || comp(A);
  [30, 210].forEach(function(y, s){
    h += sv("line", { x1:40, y1:y, x2:360, y2:y, "class":"dn-bb dn-r-" + (s ? "cod" : "tpl") });
    [90, 310].forEach(function(x){ h += sv("circle", { cx:x, cy:y, r:6, "class":"dn-ph dn-r-" + (s ? "cod" : "tpl") }); });
    h += sv("rect", { x:189, y:y - 11, width:22, height:22, rx:4, "class":"dn-sugbox dn-r-" + (s ? "cod" : "tpl") });
  });
  h += sv("line", { x1:200, y1:41, x2:200, y2:54, "class":"dn-bond" }) + sv("line", { x1:200, y1:186, x2:200, y2:199, "class":"dn-bond" });
  h += baseGlyph(200, 78, A, 22) + baseGlyph(200, 162, B, 22);
  var k = hb(A, B);
  for (var j = 0; j < k; j++) { var x = 200 + (j - (k - 1) / 2) * 12; h += sv("line", { x1:x, y1:102, x2:x, y2:138, "class":"dn-hb dn-hbz" }); }
  if (!k) h += txt(200, 126, "✗", "dn-x", "middle");
  h += txt(360, 18, "strand 1", "dn-sm", "end") + txt(360, 234, "strand 2", "dn-sm", "end");
  return h;
}
function chromoSVG(){
  var h = "";
  [["M168 34 Q194 120 168 206", 0], ["M232 34 Q206 120 232 206", 1]].forEach(function(c){
    h += sv("path", { d:c[0], "class":"dn-chr-o" }) + sv("path", { d:c[0], "class":"dn-chr-i" });
  });
  for (var i = 0; i < 9; i++) { var y = 48 + i * 18; if (Math.abs(y - 120) < 14) continue; var dx = 13 * Math.sin((y - 34) / 172 * Math.PI) ; h += sv("line", { x1:f1(168 + dx * 0.6 - 9), y1:y, x2:f1(168 + dx * 0.6 + 9), y2:y + 6, "class":"dn-coilh" }) + sv("line", { x1:f1(232 - dx * 0.6 - 9), y1:y + 6, x2:f1(232 - dx * 0.6 + 9), y2:y, "class":"dn-coilh" }); }
  h += sv("ellipse", { cx:200, cy:120, rx:10, ry:8, "class":"dn-cen" });
  h += sv("rect", { x:214, y:52, width:24, height:24, rx:3, "class":"dn-zbox" }) + sv("path", { d:"M238 52 L300 20 M238 76 L300 112", "class":"dn-zline" });
  h += sv("rect", { x:300, y:20, width:92, height:92, rx:8, "class":"dn-inset" });
  var d = ""; for (var u = 0; u <= 1.0001; u += 0.02) d += (d ? " L" : "M") + f1(310 + 72 * u) + " " + f1(66 + 22 * Math.sin(u * 6 * Math.PI));
  h += sv("path", { d:d, "class":"dn-coil" });
  [0.17, 0.5, 0.83].forEach(function(u){ h += sv("circle", { cx:f1(310 + 72 * u), cy:66, r:9, "class":"dn-histone" }); });
  h += txt(346, 128, "coiled DNA", "dn-sm", "middle") + txt(120, 120, "centromere", "dn-sm", "end") + sv("path", { d:"M124 117 L188 120", "class":"dn-zline" }) + txt(200, 230, "two sister chromatids", "dn-sm", "middle");
  return h;
}

// ---------- @component forkView — replication fork, 40-bp model segment (viewBox 440 × 250). Parent strands --ink (top)
// and --ink-2 (bottom), new DNA --pen, RNA primers --bio-h. f = { pos (bp copied), v (fork vertex, bp opened), hel (helicase
// position), primed, built, p1 (primers replaced), sealed, sep (daughters), coil (0–3), stall, act ("p1"|"lig"), rnaFrom } ----------
var FK = { x0:24, dx:9.4, yT:119, yB:133, aT:46, nT:61, nB:191, aB:206 };
function fX(i){ return FK.x0 + i * FK.dx; }
function glyph(kind, x, y, on){
  var c = "dn-enz" + (on ? " on" : "");
  if (kind === "hel") return poly(hexPts(x, y, 11), c);
  if (kind === "gyr") return sv("rect", { x:x - 12, y:y - 18, width:24, height:36, rx:10, "class":c });
  if (kind === "pri") return sv("circle", { cx:x, cy:y, r:8, "class":c });
  if (kind === "p3") return sv("path", { d:"M" + f1(x + 6) + " " + f1(y - 10) + " A12 11 0 1 0 " + f1(x + 6) + " " + f1(y + 10), "class":c + " dn-mitt" });
  if (kind === "p1") return sv("ellipse", { cx:x, cy:y, rx:10, ry:8, "class":c });
  if (kind === "lig") return poly([[x, y - 10], [x + 9, y], [x, y + 10], [x - 9, y]], c);
  if (kind === "ssb") return sv("ellipse", { cx:x, cy:y, rx:4.2, ry:3.2, "class":"dn-ssb" });
  return "";
}
function forkSVG(f, o){
  o = o || {};
  var ko = o.ko || {}, has = function(id){ return !ko[id]; }, lab = o.labels !== false, h = "", i, D = 3, v = f.v, pos = f.pos, done = v >= 40;
  function armY(u, top){ var a = top ? FK.aT : FK.aB, c = top ? FK.yT : FK.yB; if (done || u <= v - D) return a; return lerp(a, c, clamp((u - (v - D)) / D, 0, 1)); }
  function seg(a, b, y, cls){ return b - a > 0.01 ? sv("line", { x1:fX(a), y1:y, x2:fX(b), y2:y, "class":cls }) : ""; }
  // closed duplex ahead of the fork
  if (v < 40) {
    h += seg(v, 40, FK.yT, "dn-fs dn-r-tpl") + seg(v, 40, FK.yB, "dn-fs dn-r-cod");
    for (i = Math.ceil(v); i < 40; i++) h += sv("line", { x1:fX(i + 0.5), y1:FK.yT + 2, x2:fX(i + 0.5), y2:FK.yB - 2, "class":"dn-rung" });
  }
  // arms (opened part)
  if (v > 0) {
    [true, false].forEach(function(top){
      var d = "", u, end = done ? 40 : v;
      for (u = 0; u <= end + 1e-9; u += 0.5) d += (d ? " L" : "M") + f1(fX(u)) + " " + f1(armY(u, top));
      h += sv("path", { d:d, "class":"dn-fs dn-r-" + (top ? "tpl" : "cod") });
      for (i = 0; i < Math.floor(end); i++) {
        var y = armY(i + 0.5, top), cp = f.built && i < pos, ny = top ? FK.nT : FK.nB;
        if (cp) h += sv("line", { x1:fX(i + 0.5), y1:y + (top ? 2 : -2), x2:fX(i + 0.5), y2:ny + (top ? -2 : 2), "class":"dn-rung" });
        else h += sv("line", { x1:fX(i + 0.5), y1:y + (top ? 1.5 : -1.5), x2:fX(i + 0.5), y2:y + (top ? 6.5 : -6.5), "class":"dn-rung" });
      }
    });
  }
  // new strands: leading (bottom arm, one piece, primer at its left end) and lagging (top arm, 10-bp pieces, primer at each right end)
  var priCls = function(start){ return (f.p1 || (f.rnaFrom != null && start < f.rnaFrom)) ? "dn-fs dn-r-new" : "dn-fs dn-r-pri dn-prim"; };
  var nP = Math.ceil(pos / 10 - 1e-9), gap = f.sealed ? 0 : 0.18;
  if (f.built && pos > 0) {
    h += seg(0, pos, FK.nB, "dn-fs dn-r-new") + seg(0, Math.min(2, pos), FK.nB, priCls(0));
    for (i = 0; i < nP; i++) {
      var a = 10 * i, b = Math.min(10 * i + 10, pos);
      h += seg(a + (i ? gap : 0), b - gap, FK.nT, "dn-fs dn-r-new") + seg(Math.max(a, b - 2) , b - gap, FK.nT, priCls(Math.max(a, b - 2)));
      if (i && !f.sealed) h += sv("path", { d:"M" + f1(fX(a) - 3) + " " + f1(FK.nT + 9) + " L" + f1(fX(a)) + " " + f1(FK.nT + 4) + " L" + f1(fX(a) + 3) + " " + f1(FK.nT + 9), "class":"dn-nick" });
    }
  } else if (f.primed && v > 0) {
    var reach = done ? 40 : Math.max(0, v - D);
    if (reach >= 2) h += seg(0, 2, FK.nB, priCls(0));
    for (i = 0; 10 * i + 10 <= reach + 1e-9; i++) h += seg(10 * i + 8, 10 * i + 10, FK.nT, priCls(10 * i + 8));
  }
  // twisting ahead
  if (f.coil > 0 && v < 40) {
    for (i = 0; i < Math.round(f.coil); i++) { var cx = fX(Math.min(37, v + 5 + i * 4)); h += sv("path", { d:"M" + f1(cx - 8) + " " + (FK.yT - 3) + " C" + f1(cx - 8) + " " + (FK.yT - 22) + " " + f1(cx + 8) + " " + (FK.yT - 22) + " " + f1(cx + 8) + " " + (FK.yT - 3), "class":"dn-twist" }); }
    if (lab) h += txt(fX(Math.min(30, v + 4)), FK.yT - 28, f.stall ? "supercoiling: high" : "twisting builds up", "dn-gl dn-glw");
  }
  if (o.glyphs !== false) {
    var moving = v > 0 && v < 40 && !f.sep;
    if (has("gyr") && v < 36 && !(f.coil > 0)) { var gx = fX(Math.min(37, v + 7)); h += glyph("gyr", gx, (FK.yT + FK.yB) / 2); if (lab) h += txt(gx, FK.yT - 26, "gyrase", "dn-gl", "middle"); }
    if (has("ssb") && v > 0 && !done) {
      var ssbAt = f.built ? [v - 1.2, v - 2.4] : [];
      if (!f.built) for (var u2 = 1.5; u2 < v - 0.5; u2 += 5) ssbAt.push(u2);
      ssbAt.forEach(function(u){ if (u > 0) { h += glyph("ssb", fX(u), armY(u, true) + 3.5) + glyph("ssb", fX(u), armY(u, false) - 3.5); } });
    }
    if (f.hel > 0 && f.hel < 40 && has("hel")) { var hx = fX(f.hel); h += glyph("hel", hx, (FK.yT + FK.yB) / 2, false); if (lab) h += txt(hx + 8, FK.yB + 24, "helicase", "dn-gl"); }
    if (moving && f.primed && has("pri")) { var px = fX(Math.max(1, v - 2.2)); h += glyph("pri", px, FK.nT + 2); if (lab) h += txt(px + 12, FK.nT + 22, "primase", "dn-gl"); }
    if (moving && f.built) {
      h += glyph("p3", fX(pos), FK.nB); h += glyph("p3", fX(10 * Math.floor((pos - 0.01) / 10)), FK.nT);
      if (lab) h += txt(fX(pos) - 6, FK.aB + 20, "pol III", "dn-gl", "end");
    }
    if (f.act === "p1") { h += glyph("p1", fX(19), FK.nT, true) + glyph("p1", fX(1), FK.nB, true); if (lab) h += txt(fX(19), FK.nT - 14, "pol I", "dn-gl", "middle"); }
    if (f.act === "lig" || o.lig != null) { var lx = fX(o.lig != null ? o.lig : 20); h += glyph("lig", lx, FK.nT + 1, f.act === "lig"); if (lab) h += txt(lx, FK.nT - 14, "ligase", "dn-gl", "middle"); }
  }
  if (f.sep && lab) h += txt(fX(0), FK.aT - 12, "Daughter 1: old strand + new strand", "dn-gl dn-glb") + txt(fX(0), FK.aB + 22, "Daughter 2: new strand + old strand", "dn-gl dn-glb");
  if (lab) {
    var lt = v > 0 ? FK.aT : FK.yT, lb = v > 0 ? FK.aB : FK.yB;
    h += txt(fX(0) - 6, lt + 4, "5′", "dn-gl", "end") + txt(fX(0) - 6, lb + 4, "3′", "dn-gl", "end");
    if (!done) h += txt(fX(40) + 6, FK.yT + 4, "3′", "dn-gl") + txt(fX(40) + 6, FK.yB + 4, "5′", "dn-gl");
  }
  return h;
}
// deterministic knockout model (plan table): the frames a run steps through, for a set of knocked-out enzymes
function forkFrames(ko){
  var has = function(id){ return !ko[id]; }, F = [], cur = { pos:0, v:0, hel:0, primed:false, built:false, p1:false, sealed:false, sep:false, coil:0, stall:false, snap:false, act:"", cap:"" };
  function push(ch){ cur = Object.assign({}, cur, ch); F.push(cur); }
  push({ cap:"Ready: 40 bp of parent DNA. Press Step or Run fork." });
  if (!has("hel")) push({ cap:"No helicase: nothing unwinds, so nothing is copied.", end:true });
  else if (!has("ssb")) {
    push({ v:10, hel:10, cap:"Helicase starts to unwind the helix, but nothing holds the separated strands apart…" });
    push({ v:0, hel:10, snap:true, cap:"…so the strands snap back together behind helicase. Nothing is copied." });
  } else {
    var pri = has("pri"), p3 = has("p3");
    for (var k = 1; k <= 4; k++) {
      var pos = 10 * k;
      if (!has("gyr") && pos > 20) { push({ stall:true, coil:3, cap:"Twisting builds up ahead of the fork (supercoiling: high), and the fork stalls at 20 bp." }); break; }
      var c = k === 1 ? "Helicase unwinds the helix and SSBs hold the strands apart. " : "The fork moves on. ";
      if (!pri) c += "With no primase there are no primers, so polymerase III has no 3′ end to add to.";
      else if (!p3) c += "Primase lays down RNA primers, but no DNA is added to them.";
      else c += "Primase lays down RNA primers, and polymerase III builds new DNA from them.";
      push({ pos:pos, v:pos >= 40 ? 40 : pos + 3, hel:pos >= 40 ? 40 : pos + 3, primed:pri, built:pri && p3, coil:has("gyr") ? 0 : k, cap:c });
    }
    if (cur.built) {
      push(has("p1") ? { p1:true, act:"p1", cap:"Polymerase I replaces the RNA primers with DNA." } : { act:"", cap:"No polymerase I: the RNA primers stay in the new strands." });
      push(has("p1") && has("lig") ? { sealed:true, act:"lig", cap:"Ligase seals the nicks between the pieces." } :
        !has("lig") ? { act:"", cap:"No ligase: one new strand stays in separate pieces, with nicks between them." } :
        { act:"", cap:"Ligase can’t join DNA to a primer that hasn’t been replaced, so the RNA stays." });
      if (cur.pos >= 40) push({ sep:true, act:"", cap:"Two daughter molecules, each with 1 old strand and 1 new strand." + (cur.p1 ? (cur.sealed ? "" : " One new strand is still in pieces.") : " The new strands still contain RNA.") });
    } else if (cur.pos > 0 || cur.stall) push({ cap:!pri ? "The strands are separated, but no new DNA was made." : "Primers sit on both templates, but no DNA was added to them." });
  }
  return F;
}
function forkCounts(f){
  var primers = f.primed ? 1 + Math.floor((f.v >= 40 ? 40 : Math.max(0, f.v - 3)) / 10 + 1e-9) : 0;
  if (f.built) primers = 1 + Math.ceil(f.pos / 10 - 1e-9);
  return { copied:f.built ? f.pos : 0, primers:f.p1 ? 0 : primers, nicks:f.built && !f.sealed ? Math.max(0, Math.ceil(f.pos / 10 - 1e-9) - 1) : 0 };
}

// ---------- hero: a ladder draws in rung by rung, twists into a helix, then unzips into two daughter helices (storyboard);
// reduced motion: the final frame (two daughter helices, colour-coded) ----------
function hero(f){
  var box = $("#dn-hero"); if (!box) return;
  var cap = f && f.cap, TOP = "ATGC".split(""), BOT = "TACG".split(""), X0 = 110, DX = 60, STEP = Math.PI / 3;
  var CAPS = ["The ladder draws in rung by rung: 2 hydrogen bonds for each A–T pair, 3 for each G–C pair.",
    "The ladder twists into a double helix.",
    "The helix unzips from one end, and a new strand (blue) grows along each old strand.",
    "One old strand + one new strand in each copy."];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  function daughters(tw){
    return duplexSVG({ top:TOP, bot:BOT, x0:X0, dx:DX, y:72, h:28, twist:tw, step:STEP, roles:["tpl", "new"], ends:[["5′", "3′"], ["3′", "5′"]] }).svg +
      duplexSVG({ top:TOP, bot:BOT, x0:X0, dx:DX, y:208, h:28, twist:tw, step:STEP, roles:["new", "cod"], ends:[["5′", "3′"], ["3′", "5′"]] }).svg +
      txt(390, 76, "copy 1", "dn-sm", "end") + txt(390, 212, "copy 2", "dn-sm", "end");
  }
  function draw(t){
    var h = "";
    if (t >= 4) h = daughters(1);
    else if (t < 2.25) {
      var tw = t < 1 ? 0 : t < 2 ? MV.ease(t - 1) : 1 - MV.ease((t - 2) / 0.25), n = t < 1 ? Math.min(4, Math.floor(t * 4 * 1.2) + 1) : 4, full = n === 4;
      h = duplexSVG({ top:TOP, bot:BOT, x0:X0, dx:DX, y:140, h:32, twist:tw, step:STEP, n:n, bond:function(i){ return t >= 1 || t * 4 * 1.2 >= i + 0.55; },
        ends:[["5′", full ? "3′" : ""], ["3′", full ? "5′" : ""]] }).svg;
    } else if (t < 3) {
      var u = (t - 2.25) / 0.75, s = TOP.map(function(_, i){ return MV.ease(clamp((u * 5.5 - i) / 1.5, 0, 1)); });
      var oT = { pts:[], tips:[] }, oB = { pts:[], tips:[] }, nT = { pts:[], tips:[], seq:[] }, nB = { pts:[], tips:[], seq:[] }, opN = [];
      TOP.forEach(function(_, i){
        var x = X0 + i * DX, yt = lerp(108, 44, s[i]), yb = lerp(172, 236, s[i]), L = lerp(23, 20, s[i]);
        oT.pts.push([x, yt]); oT.tips.push([x, yt + L]); oB.pts.push([x, yb]); oB.tips.push([x, yb - L]);
        if (s[i] > 0.55) { nT.pts.push([x, 100]); nT.tips.push([x, 80]); nT.seq.push(BOT[i]); nB.pts.push([x, 180]); nB.tips.push([x, 200]); nB.seq.push(TOP[i]); opN.push(clamp((s[i] - 0.55) / 0.45, 0, 1)); }
      });
      h += bondsSVG(oT.tips, oB.tips, TOP, BOT, { show:function(i){ return s[i] === 0; } });
      h += bondsSVG(oT.tips, nT.tips, TOP, nT.seq, { show:function(i){ return s[i] >= 0.999; } }) + bondsSVG(nB.tips, oB.tips, nB.seq, BOT, { show:function(i){ return s[i] >= 0.999; } });
      h += strandSVG({ pts:nT.pts, tips:nT.tips, seq:nT.seq, role:"new", op:opN, ends:nT.pts.length === 4 ? ["3′", "5′"] : null });
      h += strandSVG({ pts:nB.pts, tips:nB.tips, seq:nB.seq, role:"new", op:opN, ends:nB.pts.length === 4 ? ["5′", "3′"] : null });
      h += strandSVG({ pts:oT.pts, tips:oT.tips, seq:TOP, role:"tpl", ends:["5′", "3′"] }) + strandSVG({ pts:oB.pts, tips:oB.tips, seq:BOT, role:"cod", ends:["3′", "5′"] });
    } else {
      var k = MV.ease(t - 3);
      h = daughters(k);
    }
    box.innerHTML = '<svg viewBox="0 0 400 280" class="dn-svg" aria-hidden="true" focusable="false">' + h + "</svg>";
  }
  if (MV.reduceMotion) { draw(4); setCap(3); return; }
  var DUR = [2400, 1500, 3400, 1500], ph = 0;
  draw(0.01); setCap(0);
  function run(){
    if (ph > 3) { draw(4); setCap(3); return; }
    setCap(ph === 3 ? 3 : ph);
    var p = ph;
    MV.tween({ dur:DUR[p], ease:lin, step:function(k){ draw(p + Math.min(k, 0.999)); }, done:function(){ ph++; setTimeout(run, ph > 3 ? 150 : 450); } });
  }
  setTimeout(run, 800);
}

// ---------- Explore: Build it, then copy it ----------
var EXF = null;
var P1SEQ = "ATGACTAGTC"; // P1 reveal: 6 A–T and 4 G–C pairs, so A 30%, T 30%, G 20%, C 20%
var ORDER = ["hel", "ssb", "gyr", "pri", "p3", "p1", "lig"], PALETTE = ["p1", "gyr", "lig", "hel", "p3", "ssb", "pri"];
var PRE = { hel:[], ssb:["hel"], gyr:["hel"], pri:["hel", "ssb", "gyr"], p3:["pri"], p1:["p3"], lig:["p1"] };
var LX0 = 62, LDX = 46, LY = 100, LH = 54;
function explore(host, api){
  var S = api.S, X = api.content, EN = X.enzymes, GIV = X.given.split(""), NF = X.freeLen;
  function blank(n){ var a = []; for (var i = 0; i < n; i++) a.push(""); return a; }
  if (!S.mode) S.mode = "build";
  if (!S.strand) S.strand = "given";
  if (!S.view) S.view = "ladder";
  if (!S.zoom) S.zoom = "helix";
  if (!S.g) S.g = { bot:blank(GIV.length), ends:["", ""] };
  if (!S.f) S.f = { top:blank(NF), bot:blank(NF), ends:["", ""] };
  if (!S.ko) S.ko = {};
  if (!S.order) S.order = [];
  if (S.fk == null) S.fk = 0;
  var sel = { s:"bot", i:0 }, zsel = null, omsg = null, frames = forkFrames(S.ko), disp = null, anim = null, pend = null, playing = false, busy = false, liveSig = "";
  S.fk = clamp(S.fk, 0, frames.length - 1);
  host.innerHTML = '<div class="pg dn-pg"><div class="pg-graph" data-mv="graph"><div class="dn-modebar" id="dn-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="dn-build"><div class="dn-scroll" id="dn-scroll"><div class="dn-stage" id="dn-stage"><svg class="dn-svg" id="dn-bsvg" role="img" focusable="false"></svg><div class="dn-ov" id="dn-ov" role="group" aria-label="DNA slots"></div></div></div>' +
        '<div id="dn-s1" hidden></div><p class="dn-cap" id="dn-bcap"></p></div>' +
      '<div id="dn-fork" hidden><div class="dn-fstage"><svg class="dn-svg" id="dn-fsvg" viewBox="0 0 440 250" role="img" focusable="false"></svg></div><p class="dn-cap" id="dn-fcap"></p>' +
        '<ul class="dn-key" aria-label="Colour key"><li><i class="dn-sw dn-r-tpl"></i>parent strand</li><li><i class="dn-sw dn-r-cod"></i>parent strand</li><li><i class="dn-sw dn-r-new"></i>new DNA</li><li><i class="dn-sw dn-r-pri"></i>RNA primer</li><li><span class="dn-nk" aria-hidden="true">^</span>nick</li></ul></div>' +
      '<p class="vh" id="dn-live" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="dn-bctl">' +
        '<div class="dn-row" id="dn-strand"></div>' +
        '<div class="dn-row" id="dn-zoom"></div>' +
        '<div id="dn-edit"><p class="how dn-how">' + X.buildHow + '</p><div class="dn-pad" role="group" aria-label="Bases (or press A, T, G, C or U)">' +
          ["A", "T", "G", "C", "U"].map(function(b){ return '<button type="button" class="dn-base" data-base="' + b + '" data-k="bp' + b + '" aria-keyshortcuts="' + b + '">' + b + "</button>"; }).join("") +
          '<button type="button" class="btn ghost sm" data-act="erase" data-k="bperase">Erase</button><button type="button" class="btn ghost sm" data-act="clear" data-k="bpclear">Clear</button></div>' +
          '<div class="dn-row" id="dn-view"></div></div>' +
        '<div id="dn-info" class="dn-info" aria-live="polite" hidden></div></div>' +
      '<div id="dn-fctl" hidden><h4 class="dn-h">Add the next enzyme</h4><div class="dn-pal" id="dn-pal" role="group" aria-label="Enzyme palette"></div>' +
        '<ol class="dn-chain" id="dn-chain" aria-label="Your assembly line"></ol><div id="dn-omsg" aria-live="polite"></div>' +
        '<fieldset class="dn-ko"><legend>Knockout panel: tick the enzymes to remove</legend>' + EN.map(function(e){ return '<label class="dn-chk"><input type="checkbox" data-ko="' + e.id + '"> <span>' + e.t + "</span></label>"; }).join("") + "</fieldset>" +
        '<div class="player dn-player" id="dn-player" role="group" aria-label="Run the fork (← and → keys work here)"><button type="button" class="btn ghost sm" id="dn-back" data-k="fkback">Back</button><button type="button" class="btn primary sm" id="dn-step" data-k="fkstep">Step</button><button type="button" class="btn ghost sm" id="dn-run" data-k="fkrun">Run fork</button><button type="button" class="btn ghost sm" id="dn-reset" data-k="fkreset">Reset</button></div>' +
        '<p class="tiny muted dn-note"><span class="bio-model">Model</span> ' + X.model + "</p></div></div>" +
    '<div class="pg-read"><dl class="read" id="dn-read"></dl></div></div>';
  var bsvg = $("#dn-bsvg", host), ov = $("#dn-ov", host), fsvg = $("#dn-fsvg", host);
  var modeR = radios($("#dn-mode", host), { label:"Mode", options:[{ id:"build", t:"Build" }, { id:"fork", t:"Replication fork" }], value:S.mode, onChange:function(m){ stop(); S.mode = m; changed(); } });
  var strandR = radios($("#dn-strand", host), { label:"Given strand", cls:"chips", options:[{ id:"given", t:"8 bases: " + sqH("5′-" + X.given + "-3′") }, { id:"free", t:"Free build (" + NF + " bases)" }], value:S.strand,
    onChange:function(v){ S.strand = v; sel = { s:v === "free" ? "top" : "bot", i:0 }; changed(); } });
  var zoomR = radios($("#dn-zoom", host), { label:"Zoom", cls:"chips", options:[{ id:"chromo", t:"Chromosome" }, { id:"helix", t:"Helix" }, { id:"pair", t:"Base pair" }, { id:"nt", t:"Nucleotide" }], value:S.zoom,
    onChange:function(v){ S.zoom = v; zsel = null; changed(); } });
  var viewR = radios($("#dn-view", host), { label:"View", options:[{ id:"ladder", t:"Ladder" }, { id:"helix", t:"Helix" }], value:S.view, onChange:function(v){ S.view = v; changed(); } });
  var zx = X.zoom;
  var dx = diagramExplorer($("#dn-s1", host), { level:"chromo", levels:[
    { id:"chromo", name:"Chromosome view", vb:[400, 240], draw:chromoSVG, aria:function(){ return "A copied chromosome: two sister chromatids joined at the centromere, with an inset of DNA coiled around proteins."; },
      hotspots:[{ id:"chromatid", label:"Sister chromatid", zones:[[146, 30, 44, 180]] }, { id:"centromere", label:"Centromere", zones:[[186, 108, 28, 24]] }, { id:"coil", label:"Coiled DNA (inset)", zones:[[300, 20, 92, 92]] }] },
    { id:"pair", name:"Base pair view", vb:[400, 240], draw:function(){ var p = pairNow(); return basePairSVG(p[0], p[1]); }, aria:function(){ var p = pairNow(); return "One base pair: " + p[0] + " on strand 1 and " + p[1] + " on strand 2, joined by " + hb(p[0], p[1]) + " hydrogen bonds, between two sugar–phosphate backbones."; },
      hotspots:[{ id:"purine", label:"Purine", zones:[[160, 50, 90, 56]] }, { id:"pyrimidine", label:"Pyrimidine", zones:[[170, 134, 60, 56]] }, { id:"hbonds", label:"Hydrogen bonds", zones:[[176, 104, 48, 32]] }, { id:"backbone", label:"Sugar–phosphate backbone", zones:[[40, 14, 120, 32], [240, 194, 120, 32]] }] },
    { id:"nt", name:"Nucleotide view", vb:[400, 240], draw:function(){ return nucleotideSVG(pairNow()[0]); }, aria:function(){ return "One nucleotide: a phosphate joined to the 5′ carbon of deoxyribose; the base on carbon 1′; an OH group on carbon 3′."; },
      hotspots:[{ id:"phosphate", label:"Phosphate", zones:[[44, 50, 52, 52]] }, { id:"sugar", label:"Deoxyribose", zones:[[150, 90, 82, 76]] }, { id:"base", label:"Nitrogenous base", zones:[[262, 82, 80, 62]] }, { id:"c5", label:"5′ carbon", zones:[[114, 56, 30, 30]] }, { id:"c3", label:"3′ carbon", zones:[[140, 160, 34, 60]] }] }
  ], onTap:function(id){ zsel = id; paintInfo(); } });

  function pairZones(){ // the purine (two rings) is on top or at the bottom, depending on the pair shown
    var lv = dx.levelDef("pair"), topPur = /[AG]/.test(pairNow()[0]);
    lv.hotspots[0].zones = [[160, topPur ? 50 : 134, 90, 56]]; lv.hotspots[1].zones = [[170, topPur ? 134 : 50, 60, 56]];
  }
  // ---- build model ----
  function cur(){ var free = S.strand === "free"; return free ? { top:S.f.top, bot:S.f.bot, ends:S.f.ends, n:NF, edTop:true } : { top:GIV, bot:S.g.bot, ends:S.g.ends, n:GIV.length, edTop:false }; }
  function stats(){
    var c = cur(), ok = 0, bonds = 0, gc = 0, bad = [], cnt = { A:0, T:0, G:0, C:0, U:0 }, tot = 0, full = true, hasU = false;
    for (var i = 0; i < c.n; i++) {
      var a = c.top[i], b = c.bot[i];
      [a, b].forEach(function(x){ if (x) { cnt[x]++; tot++; if (x === "U") hasU = true; } });
      if (!a || !b) { full = false; continue; }
      if (isPair(a, b)) { ok++; bonds += hb(a, b); if (a === "G" || a === "C") gc++; } else bad.push(i);
    }
    return { ok:ok, bonds:bonds, gc:gc, bad:bad, cnt:cnt, tot:tot, full:full, hasU:hasU, n:c.n };
  }
  function pairNow(){
    var c = cur(), i = sel.i, ok = function(k){ return isPair(c.top[k], c.bot[k]); };
    if (!(ok(i))) { i = -1; for (var k = 0; k < c.n; k++) if (ok(k)) { i = k; break; } }
    return i < 0 ? ["A", "T", -1] : [c.top[i], c.bot[i], i];
  }
  function pct(n, tot){ return MV.num(n / tot * 100, n / tot * 100 % 1 ? 1 : 0) + "%"; }
  function pctText(st){
    if (!st.tot) return "—";
    var p = ["A", "T", "G", "C"].map(function(b){ return b + " " + pct(st.cnt[b], st.tot); });
    if (st.cnt.U) p.push("U " + pct(st.cnt.U, st.tot));
    return p.join(", ");
  }
  function botText(c){ return (c.ends[0] || "?") + "-" + seqTxt(c.bot) + "-" + (c.ends[1] || "?"); }
  function place(b){
    var c = cur();
    if (S.mode !== "build" || S.zoom !== "helix" || S.view !== "ladder" || lock()) return;
    if (sel.s === "top" && !c.edTop) sel = { s:"bot", i:sel.i };
    (sel.s === "top" ? c.top : c.bot)[sel.i] = b;
    var msg = (sel.s === "top" ? "Top" : "Bottom") + " strand, position " + (sel.i + 1) + ": " + b + ".";
    var o = sel.s === "top" ? c.bot[sel.i] : c.top[sel.i];
    if (o) msg += isPair(b, o) ? " Pairs with " + o + " (" + hb(b, o) + " hydrogen bonds)." : b === "U" || o === "U" ? " ✗ U is RNA’s base." : " ✗ " + b + " doesn’t pair with " + o + ".";
    if (sel.i < c.n - 1) sel = { s:sel.s, i:sel.i + 1 };
    var had = ov.contains(document.activeElement);
    say(msg); changed(true);
    if (had) { var nb = $('[data-slot="' + sel.s + sel.i + '"]', ov); if (nb) nb.focus({ preventScroll:true }); }
  }
  function erase(){ var c = cur(); if (lock()) return; (sel.s === "top" ? c.top : c.bot)[sel.i] = ""; say("Erased."); changed(true); }
  function clearAll(){ var c = cur(); if (lock()) return; for (var i = 0; i < c.n; i++) { c.bot[i] = ""; if (c.edTop) c.top[i] = ""; } c.ends[0] = c.ends[1] = ""; sel = { s:c.edTop ? "top" : "bot", i:0 }; say("Cleared."); changed(true); }
  function cycleEnd(k){ var c = cur(); if (lock()) return; c.ends[k] = c.ends[k] === "5′" ? "3′" : "5′"; say((k ? "Right" : "Left") + " end of the bottom strand: " + c.ends[k] + "."); changed(true); }

  // ---- build painting ----
  function buildSVG(){
    var c = cur(), st = stats(), n = c.n, W = 2 * LX0 + (n - 1) * LDX, mT = {}, mB = {}, lad = S.view === "ladder";
    st.bad.forEach(function(i){ mT[i] = "bad"; mB[i] = "bad"; });
    if (lad) (sel.s === "top" ? mT : mB)[sel.i] = (sel.s === "top" ? mT : mB)[sel.i] === "bad" ? "bad sel" : "sel";
    var d = duplexSVG({ top:c.top, bot:c.bot, x0:LX0, dx:LDX, y:LY, h:LH, twist:lad ? 0 : 1, step:Math.PI / 5, roles:["tpl", "cod"],
      ends:[["5′", "3′"], lad ? null : [c.ends[0] || "?", c.ends[1] || "?"]], marks:[mT, mB] });
    return { w:W, svg:d.svg };
  }
  function slotLabel(s, i){
    var c = cur(), b = (s === "top" ? c.top : c.bot)[i], o = (s === "top" ? c.bot : c.top)[i];
    return (s === "top" ? "Top" : "Bottom") + " strand, position " + (i + 1) + ": " + (b ? b + (o ? (isPair(b, o) ? ", pairs with " + o : ", ✗ mismatch with " + o) : "") : "empty");
  }
  function paintBuild(){
    var c = cur(), B = buildSVG(), lad = S.view === "ladder", st = $("#dn-stage", host), p2 = function(v){ return Math.round(v * 100) / 100; };
    st.style.aspectRatio = B.w + " / 200"; st.style.minWidth = Math.round(B.w * 0.86) + "px";
    bsvg.setAttribute("viewBox", "0 0 " + B.w + " 200"); bsvg.innerHTML = B.svg;
    bsvg.setAttribute("aria-label", (lad ? "Ladder" : "Helix") + " view. Top strand 5′-" + seqTxt(c.top) + "-3′. Bottom strand " + botText(c) + ".");
    var h = "";
    if (lad) {
      var zone = function(x, y, w, hh){ return "left:" + p2(x / B.w * 100) + "%;top:" + p2(y / 200 * 100) + "%;width:" + p2(w / B.w * 100) + "%;height:" + p2(hh / 200 * 100) + "%"; };
      ["top", "bot"].forEach(function(s){
        if (s === "top" && !c.edTop) return;
        for (var i = 0; i < c.n; i++) { var x = LX0 + i * LDX; h += '<button type="button" class="dn-slot" data-slot="' + s + i + '" data-k="sl' + s + i + '" aria-pressed="' + (sel.s === s && sel.i === i) + '" aria-label="' + MV.esc(slotLabel(s, i)) + '" style="' + zone(x - 22, s === "top" ? 30 : 101, 44, 69) + '"></button>'; }
      });
      [0, 1].forEach(function(k){ var x = k ? LX0 + (c.n - 1) * LDX + 36 : LX0 - 36; h += '<button type="button" class="dn-endb' + (c.ends[k] ? "" : " unset") + '" data-end="' + k + '" data-k="end' + k + '" aria-label="' + MV.esc((k ? "Right" : "Left") + " end of the bottom strand: " + (c.ends[k] || "not labelled") + ". Tap to change.") + '" style="' + zone(x - 20, 140, 40, 30) + '">' + (c.ends[k] || "?") + "</button>"; });
    }
    MV.keepFocus(ov, function(){ ov.innerHTML = h; });
    $("#dn-bcap", host).textContent = S.zoom !== "helix" ? zx[S.zoom].note : lad ? "Ladder view. Selected: " + slotLabel(sel.s, sel.i) + "." : "Helix view: about 10 base pairs make one full turn. Switch to Ladder to fill slots.";
  }
  function paintInfo(){
    var box = $("#dn-info", host); box.hidden = S.mode !== "build" || S.zoom === "helix";
    if (box.hidden) return;
    var Z = zx[S.zoom], it = zsel && byId(Z.spots, zsel);
    box.innerHTML = it ? '<p class="dn-in"><strong>' + it.name + "</strong>: " + it.job + '</p><p class="tiny"><strong>Connects to:</strong> ' + it.to + "</p>" : '<p class="tiny muted">Tap a part of the ' + Z.name.toLowerCase() + " to see its name and job.</p>";
    dx.marks(zsel ? (function(){ var m = {}; m[zsel] = "on"; return m; })() : {});
  }

  // ---- fork ----
  function lock(){ return busy || !!pend || playing; }
  function curFrame(){ return frames[S.fk]; }
  function enzName(id){ return byId(EN, id).s; }
  function present(){ var p = ORDER.filter(function(id){ return !S.ko[id]; }); return p.length === 7 ? "All 7: helicase, SSBs, gyrase, primase, pol III, pol I, ligase" : p.length ? p.map(function(id, i){ var s = enzName(id); return i ? s : s.charAt(0).toUpperCase() + s.slice(1); }).join(", ") : "None"; }
  function daughterText(){
    var f = curFrame(), last = S.fk === frames.length - 1, c = forkCounts(f);
    if (f.sep) return "1 old strand + 1 new strand" + (c.primers ? " (RNA primers still in the new strands)" : c.nicks ? " (one new strand in pieces)" : "");
    if (!last) return S.fk === 0 ? "Run the fork to find out" : "Copying…";
    return c.copied ? "Unfinished: only " + c.copied + " of 40 bp copied" : "No copies made";
  }
  function paintFork(){
    var f = disp || curFrame(), cap = curFrame().cap;
    fsvg.innerHTML = forkSVG(f, { ko:S.ko });
    var c = forkCounts(curFrame());
    fsvg.setAttribute("aria-label", "Replication fork, step " + S.fk + " of " + (frames.length - 1) + ". " + MV.plain(cap) + " Base pairs copied " + c.copied + " of 40; RNA primers left " + c.primers + "; unsealed nicks " + c.nicks + ".");
    $("#dn-fcap", host).textContent = cap;
  }
  function paintOrder(){
    var done = S.order.length === 7;
    MV.keepFocus($("#dn-pal", host), function(){ $("#dn-pal", host).innerHTML = PALETTE.map(function(id){ var e = byId(EN, id), on = S.order.indexOf(id) >= 0; return '<button type="button" class="dn-ez' + (on ? " done" : "") + '" data-ez="' + id + '" data-k="ez' + id + '"' + (on || lock() ? " disabled" : "") + ">" + (on ? "✓ " : "") + e.t + "</button>"; }).join(""); });
    $("#dn-chain", host).innerHTML = S.order.length ? S.order.map(function(id){ return "<li>" + byId(EN, id).t + "</li>"; }).join("") : '<li class="dn-empty-li">Tap the enzyme that acts first.</li>';
    var m = done ? { k:"good", h:"<strong>✓ " + X.orderDone + "</strong>" } : omsg;
    $("#dn-omsg", host).innerHTML = (m ? MV.fbHTML(m.k, m.h) : "") + (S.order.length ? '<button type="button" class="btn ghost sm dn-ordre" data-act="ordreset" data-k="ordreset">Start the order again</button>' : "");
  }
  function addEnz(id){
    if (lock() || S.order.indexOf(id) >= 0) return;
    var e = byId(EN, id), miss = PRE[id].filter(function(p){ return S.order.indexOf(p) < 0; });
    if (miss.length) omsg = { k:"bad", h:"<strong>✗ Not yet.</strong> " + X.early[id] };
    else { S.order.push(id); omsg = { k:"good", h:"<strong>✓ " + e.t + ":</strong> " + e.job }; }
    api.save(); paintOrder(); MV.focusFb($("#dn-omsg", host));
  }
  function setFrames(){ frames = forkFrames(S.ko); S.fk = 0; disp = null; }
  function animTo(k, dur, done){
    var a = curFrame(), b = frames[k]; busy = true; sync();
    anim = MV.tween({ dur:dur, ease:MV.ease, step:function(t){
      disp = Object.assign({}, t < 1 ? a : b);
      ["pos", "v", "hel", "coil"].forEach(function(p){ disp[p] = lerp(a[p], b[p], t); });
      if (t > 0.02) { disp.primed = b.primed; disp.built = b.built; disp.act = b.act; disp.stall = b.stall; }
      fsvg.innerHTML = forkSVG(disp, { ko:S.ko });
    }, done:function(){ anim = null; busy = false; disp = null; S.fk = k; api.save(); paintAll(); announce(); MV.changed(); if (done) done(); } });
  }
  function stepF(){ if (lock() || S.fk >= frames.length - 1) return; animTo(S.fk + 1, 900, null); }
  function backF(){ if (lock() || S.fk <= 0) return; S.fk--; changed(); announce(); }
  function runF(done){
    if (busy) return;
    if (S.fk >= frames.length - 1) S.fk = 0;
    playing = true; sync();
    (function next(){
      if (!playing) return;
      if (S.fk >= frames.length - 1) { playing = false; sync(); if (done) done(); return; }
      animTo(S.fk + 1, 900, function(){ MV.wait(350, next); });
    })();
  }
  function stop(){ if (anim) { anim(); anim = null; } busy = false; playing = false; disp = null; if (pend) { var d = pend; pend = null; d(); } }

  // ---- events ----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.slot) { if (lock()) return; sel = { s:b.dataset.slot.slice(0, 3), i:+b.dataset.slot.slice(3) }; paintBuild(); paintRead(); return; }
    if (b.dataset.end != null) { cycleEnd(+b.dataset.end); return; }
    if (b.dataset.base) { place(b.dataset.base); return; }
    if (b.dataset.act === "erase") { erase(); return; }
    if (b.dataset.act === "clear") { clearAll(); return; }
    if (b.dataset.ez) { addEnz(b.dataset.ez); return; }
    if (b.dataset.act === "ordreset") { if (lock()) return; S.order = []; omsg = null; api.save(); paintOrder(); var f0 = $("#dn-pal button", host); if (f0) f0.focus(); return; }
    if (b.id === "dn-step") stepF(); else if (b.id === "dn-back") backF(); else if (b.id === "dn-run") runF(null);
    else if (b.id === "dn-reset") { if (lock()) return; S.fk = 0; changed(); announce(); }
  });
  host.addEventListener("change", function(e){
    var k = e.target.dataset && e.target.dataset.ko; if (!k) return;
    stop(); S.ko[k] = e.target.checked; if (!S.ko[k]) delete S.ko[k]; setFrames(); changed(); announce();
  });
  host.addEventListener("keydown", function(e){
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target, tag = (t.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (S.mode === "fork" && t.closest && t.closest("#dn-player")) {
      if (e.key === "ArrowRight") { e.preventDefault(); stepF(); } else if (e.key === "ArrowLeft") { e.preventDefault(); backF(); }
      return;
    }
    if (S.mode !== "build") return;
    if (/^[atgcu]$/i.test(e.key) && t.closest && t.closest("#dn-build, #dn-bctl")) { e.preventDefault(); place(e.key.toUpperCase()); return; }
    var sl = t.closest && t.closest("[data-slot]"), d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (sl && d) { e.preventDefault(); var all = $$("[data-slot]", ov), i = all.indexOf(sl), nb = all[clamp(i + d, 0, all.length - 1)]; nb.focus(); nb.click(); }
    if (sl && (e.key === "Backspace" || e.key === "Delete")) { e.preventDefault(); erase(); }
  });

  // ---- readouts and sync ----
  var readSig = "";
  function paintRead(){
    var rows;
    if (S.mode === "build") {
      var c = cur(), st = stats();
      rows = [["Top strand", sqH("5′-" + seqTxt(c.top) + "-3′")], ["Bottom strand", sqH(botText(c))],
        ["Pairs correct", st.ok + " / " + c.n + (st.bad.length ? ' <span class="dn-bad">✗ ' + st.bad.length + (st.bad.length > 1 ? " mismatches" : " mismatch") + "</span>" : "")],
        ["Hydrogen bonds", String(st.bonds)], ["Base percentages (double strand)", pctText(st)]];
    } else {
      var fc = forkCounts(curFrame());
      rows = [["Fork: enzymes present", present()], ["Fork: base pairs copied", fc.copied + " / 40"], ["Fork: RNA primers left", String(fc.primers)],
        ["Fork: unsealed nicks", String(fc.nicks)], ["Each daughter molecule", daughterText()]];
    }
    var sig = JSON.stringify(rows); if (sig === readSig) return; readSig = sig;
    $("#dn-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function sync(){
    modeR.set(S.mode); strandR.set(S.strand); zoomR.set(S.zoom); viewR.set(S.view);
    var L = lock(), bm = S.mode === "build";
    $(".dn-pg", host).dataset.busy = L ? "1" : "0";
    $("#dn-build", host).hidden = !bm; $("#dn-fork", host).hidden = bm; $("#dn-bctl", host).hidden = !bm; $("#dn-fctl", host).hidden = bm;
    $("#dn-scroll", host).hidden = S.zoom !== "helix"; $("#dn-s1", host).hidden = S.zoom === "helix";
    $("#dn-edit", host).hidden = S.zoom !== "helix";
    $$(".dn-pad button", host).forEach(function(x){ x.disabled = L || S.view !== "ladder"; });
    modeR.disable(L); strandR.disable(L); zoomR.disable(L); viewR.disable(L);
    $$("[data-ko]", host).forEach(function(x){ x.checked = !!S.ko[x.dataset.ko]; x.disabled = L; });
    $("#dn-step", host).disabled = L || S.fk >= frames.length - 1; $("#dn-back", host).disabled = L || S.fk <= 0; $("#dn-reset", host).disabled = L;
    $("#dn-run", host).disabled = L;
    $$("[data-ez]", host).forEach(function(x){ x.disabled = L || S.order.indexOf(x.dataset.ez) >= 0; });
  }
  function paintAll(){
    sync();
    if (S.mode === "build") { if (S.zoom === "helix") paintBuild(); else { pairZones(); dx.setLevel(S.zoom); dx.refresh(); $("#dn-bcap", host).textContent = zx[S.zoom].note; } paintInfo(); }
    else { paintFork(); paintOrder(); }
    paintRead();
  }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function say(t){ var L = $("#dn-live", host); L.textContent = ""; setTimeout(function(){ L.textContent = t; }, 30); }
  function announce(){ var t = S.mode === "fork" ? curFrame().cap : ""; if (t && t !== liveSig) { liveSig = t; say(t); } }

  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var c = cur(), st = stats(), C = byId(X.challenges, id), m = C.msgs;
    if (id === "tc1") {
      if (S.strand !== "given") return { ok:false, msg:m.mode };
      if (c.bot.join("") === "TACGGCAT" && c.ends[0] === "3′" && c.ends[1] === "5′") return { ok:true };
      if (st.hasU) return { ok:false, msg:m.u };
      if (c.bot.some(function(b){ return !b; })) return { ok:false, msg:m.empty };
      if (c.bot.some(function(b, i){ return b === c.top[i]; })) return { ok:false, msg:m.copy };
      if (st.bad.length) return { ok:false, msg:m.mismatch };
      if (!c.ends[0] || !c.ends[1]) return { ok:false, msg:m.unlabelled };
      return { ok:false, msg:m.ends };
    }
    if (id === "tc2") {
      if (S.strand !== "free") return { ok:false, msg:m.mode };
      if (st.hasU) return { ok:false, msg:m.u };
      if (!st.full) return { ok:false, msg:m.empty };
      if (st.bad.length) return { ok:false, msg:m.mismatch };
      if (st.gc === 5) return { ok:true };
      if (st.gc === 4) return { ok:false, msg:m.four };
      if (st.gc === 6) return { ok:false, msg:m.six };
      return { ok:false, msg:"That makes " + st.bonds + " hydrogen bonds; you need 25." };
    }
    if (id === "tc3") {
      var k = ORDER.filter(function(e){ return S.ko[e]; }), key = k.join("+");
      if (key === "gyr+p1") return { ok:true };
      if (key === "gyr+lig") return { ok:false, msg:m.gyrLig };
      if (key === "pri+p1") return { ok:false, msg:m.priP1 };
      if (key === "ssb+p1") return { ok:false, msg:m.ssbP1 };
      if (!k.length) return { ok:false, msg:m.none };
      if (k.length === 1) return { ok:false, msg:m.one };
      if (k.length > 2) return { ok:false, msg:m.many };
      var F = forkFrames(S.ko), L = F[F.length - 1], fc = forkCounts(L);
      return { ok:false, msg:"Without " + enzName(k[0]) + " and " + enzName(k[1]) + ", the fork copies " + fc.copied + " of 40 bp" + (fc.primers && fc.copied ? " and RNA stays in it" : "") + ". " + C.general };
    }
    return { ok:false };
  }

  EXF = { show:function(v){ if (!v) stop(); else paintAll(); } };
  paintAll();
  return {
    predict:{
      start:function(p){
        stop();
        if (p.id === "p1") { S.mode = "build"; S.strand = "free"; S.view = "ladder"; S.zoom = "helix"; S.f = { top:blank(NF), bot:blank(NF), ends:["", ""] }; sel = { s:"top", i:0 }; }
        else { S.mode = "fork"; S.ko = p.id === "p2" ? { pri:true } : p.id === "p3" ? { lig:true } : {}; setFrames(); }
        changed();
      },
      run:function(p, done){
        pend = done; sync();
        function fin(){ var d = pend; pend = null; playing = false; sync(); paintAll(); MV.changed(); if (d) d(); }
        if (p.id === "p1") {
          var i = 0;
          (function next(){
            if (!pend) return;
            if (i >= NF) { S.f.ends[0] = "3′"; S.f.ends[1] = "5′"; api.save(); fin(); return; }
            S.f.top[i] = P1SEQ[i]; S.f.bot[i] = comp(P1SEQ[i]); sel = { s:"top", i:Math.min(NF - 1, i + 1) }; i++; api.save(); paintBuild(); paintRead();
            MV.wait(260, next);
          })();
        } else { runF(fin); }
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: The experiments that found it (six evidence stations, one at a time) ----------
// @component densityTube — Meselson–Stahl density tube: bands sit lower for heavier DNA (light ¹⁴N, intermediate, heavy ¹⁵N);
// tubeSVG(x, bands:[{at:"light"|"mid"|"int"|"heavy", amt:0–1}], title) inside a 320 × 220 viewBox; MS[model][gen] = bands.
var BANDY = { light:66, mid:90, int:112, heavy:154 };
var MS = {
  semi:[[{ at:"heavy", amt:1 }], [{ at:"int", amt:1 }], [{ at:"int", amt:0.5 }, { at:"light", amt:0.5 }]],
  cons:[[{ at:"heavy", amt:1 }], [{ at:"heavy", amt:0.5 }, { at:"light", amt:0.5 }], [{ at:"heavy", amt:0.25 }, { at:"light", amt:0.75 }]],
  disp:[[{ at:"heavy", amt:1 }], [{ at:"int", amt:1 }], [{ at:"mid", amt:1 }]]
};
// strands per molecule: O old (heavy), N new (light), H half old (patchwork), Q quarter old (patchwork)
var MSMOL = {
  semi:[["OO"], ["ON", "NO"], ["ON", "NN", "NO", "NN"]],
  cons:[["OO"], ["OO", "NN"], ["OO", "NN", "NN", "NN"]],
  disp:[["OO"], ["HH", "HH"], ["QQ", "QQ", "QQ", "QQ"]]
};
function tubeSVG(x, bands, title){
  var h = sv("path", { d:"M" + x + " 30 L" + x + " 180 Q" + x + " 200 " + (x + 22) + " 200 Q" + (x + 44) + " 200 " + (x + 44) + " 180 L" + (x + 44) + " 30", "class":"dn-tube" });
  h += sv("rect", { x:x + 2, y:44, width:40, height:150, rx:4, "class":"dn-grad" });
  bands.forEach(function(b){ var th = 3 + 7 * b.amt; h += sv("rect", { x:x + 5, y:BANDY[b.at] - th / 2, width:34, height:th, rx:th / 2, "class":"dn-band" }); });
  return h + txt(x + 22, 20, title, "dn-sm dn-b", "middle");
}
function molRow(mols, x0, y0){
  var h = "";
  mols.forEach(function(m, k){
    var x = x0 + (k % 2) * 70, y = y0 + Math.floor(k / 2) * 30;
    [0, 1].forEach(function(s){
      var c = m[s], yy = y + s * 9;
      if (c === "O" || c === "N") h += sv("line", { x1:x, y1:yy, x2:x + 56, y2:yy, "class":"dn-ms dn-r-" + (c === "O" ? "tpl" : "new") });
      else for (var j = 0; j < 8; j++) { var old = c === "H" ? j % 2 === 0 : j % 4 === 0; h += sv("line", { x1:x + j * 7, y1:yy, x2:x + j * 7 + 7, y2:yy, "class":"dn-ms dn-r-" + (old ? "tpl" : "new") }); }
    });
  });
  return h;
}
function xPatternSVG(){
  var h = sv("rect", { x:0, y:0, width:200, height:200, rx:10, "class":"dn-xray" }), k;
  for (k = -5; k <= 5; k++) {
    if (!k) continue;
    var y = 100 + k * 15, dx = Math.abs(k) * 11;
    [-1, 1].forEach(function(s){ h += sv("ellipse", { cx:100 + s * dx, cy:y, rx:5, ry:3, "class":"dn-spot" }); });
  }
  h += sv("ellipse", { cx:100, cy:14, rx:16, ry:5, "class":"dn-spot" }) + sv("ellipse", { cx:100, cy:186, rx:16, ry:5, "class":"dn-spot" });
  return h + sv("circle", { cx:100, cy:100, r:7, "class":"dn-spot" });
}
function phageSVG(x, y, lab, dna){ // head (hexagon) with DNA inside, tail, legs
  var h = poly(hexPts(x, y, 11), "dn-coat" + (lab === "s" ? " dn-hot" : "")) + sv("line", { x1:x, y1:y + 11, x2:x, y2:y + 30, "class":"dn-tail" + (lab === "s" ? " dn-hotl" : "") });
  h += sv("path", { d:"M" + (x - 8) + " " + (y + 38) + " L" + x + " " + (y + 30) + " L" + (x + 8) + " " + (y + 38), "class":"dn-tail" });
  if (dna) h += sv("path", { d:"M" + (x - 5) + " " + (y - 3) + " q5 -6 10 0 q-5 6 -10 0", "class":"dn-pdna" + (lab === "p" ? " dn-hotd" : "") });
  return h;
}
function hcScene(lab, t){ // t 0–1: attach, inject, blend, spin
  var h = sv("rect", { x:120, y:118, width:160, height:56, rx:28, "class":"dn-cell" }) + txt(288, 150, "bacterium", "dn-sm");
  h += txt(6, 16, lab === "s" ? "Highlighted: the ³⁵S label (protein coats)" : "Highlighted: the ³²P label (DNA)", "dn-sm");
  var inj = clamp((t - 0.3) / 0.25, 0, 1), bl = clamp((t - 0.6) / 0.25, 0, 1), sp = clamp((t - 0.85) / 0.15, 0, 1);
  [150, 200, 250].forEach(function(x, i){
    var y = lerp(30, 68, clamp(t / 0.3, 0, 1)) - bl * (30 + i * 4), xx = x + bl * (i - 1) * 70;
    h += phageSVG(xx, y, lab, inj < 0.5);
    if (inj > 0) { var d = 128 + 12 * inj; h += sv("path", { d:"M" + (x - 10) + " " + f1(d) + " q5 -6 10 0 q5 6 10 0", "class":"dn-pdna" + (lab === "p" ? " dn-hotd" : ""), opacity:f1(inj) }); }
  });
  if (bl > 0 && bl < 1) h += txt(200, 200, "blending…", "dn-sm dn-b", "middle");
  if (sp > 0) h += txt(200, 200, "Spun: the cells form a pellet; the empty coats stay in the liquid.", "dn-sm dn-b", "middle");
  return h;
}

function part3(host, api){
  var S = api.S, P = MV.C.part3, ST = P.stations;
  if (!S.cur) S.cur = "s1";
  S.st = S.st || {};
  function st(id){ return S.st[id] || (S.st[id] = { seen:{}, pick:null, done:false }); }
  host.innerHTML = '<div class="dn-p3"><div class="dn-row" id="dn-nav"></div><div id="dn-stn" class="dn-stn"></div></div>';
  var nav = radios($("#dn-nav", host), { label:"Station", cls:"chips", options:navOpts(), value:S.cur, onChange:function(v){ S.cur = v; api.save(); paint(true); } });
  function navOpts(){ return ST.map(function(s){ return { id:s.id, t:(st(s.id).done ? "✓ " : "") + s.n + " " + s.t.replace(/ \(.*\)$/, "").replace(/, Wilkins, Watson and Crick/, " and others").replace(/, MacLeod and McCarty/, " et al.") }; }); }
  function choicesHTML(s, x){
    var ri = MV.right(s.choices), h = '<p class="dn-ask"><strong>' + s.ask + '</strong></p><div class="opts dn-cho">' + s.choices.map(function(c, i){
      var cl = "opt" + (x.done && i === ri ? " right" : x.pick === i && i !== ri ? " wrong" : "");
      return '<button type="button" class="' + cl + '" data-ch="' + i + '" data-k="ch' + s.id + i + '"' + (x.done ? " disabled" : "") + "><span>" + c.t + "</span></button>"; }).join("") + "</div>";
    if (x.pick != null) { var c = s.choices[x.pick], good = x.pick === ri; h += MV.fbHTML(good ? "good" : "bad", (good ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + c.fb + (good ? "" : " Try again.")); }
    return h;
  }
  function rowsHTML(s, x, head){
    return '<div class="tbl-wrap"><table class="dn-tbl"><thead><tr><th scope="col">' + head[0] + '</th><th scope="col">' + head[1] + "</th></tr></thead><tbody>" + s.rows.map(function(r){
      var on = x.seen[r.id]; return '<tr><th scope="row"><button type="button" class="btn ghost sm dn-run" data-row="' + r.id + '" data-k="rw' + s.id + r.id + '"' + (on ? " disabled" : "") + ">" + (on ? "✓ " : "Run: ") + r.t + "</button></th><td" + (on && r.bad ? ' class="dn-hl"' : "") + ">" + (on ? r.res : '<span class="muted">?</span>') + "</td></tr>"; }).join("") + "</tbody></table></div>";
  }
  function allSeen(s, x){ return s.rows.every(function(r){ return x.seen[r.id]; }); }
  var hcAnim = null;
  function body(s){
    var x = st(s.id), h = "", ready = true;
    if (s.id === "s1" || s.id === "s2") {
      h += rowsHTML(s, x, s.id === "s1" ? ["Mouse injected with", "Result"] : ["Extract treated with", "Result when mixed with live R"]);
      ready = allSeen(s, x);
      if (!ready) h += '<p class="tiny muted">Run every experiment to unlock the question.</p>';
    } else if (s.id === "s3") {
      x.batch = x.batch || "s"; x.runs = x.runs || {};
      h += '<div class="dn-row" id="dn-hcb"></div><div class="dn-hcfig"><svg class="dn-svg" id="dn-hcsvg" viewBox="0 0 400 210" role="img" focusable="false" aria-label="' + MV.esc(hcAria(x)) + '">' + hcScene(x.batch, x.runs[x.batch] ? 1 : 0) + '</svg></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" data-act="infect" data-k="hcinf">Infect and blend</button></div>' +
        '<div class="tbl-wrap"><table class="dn-tbl"><caption class="tiny">Where the radioactivity ended up <span class="bio-model">Model data</span></caption><thead><tr><th scope="col">Batch</th><th scope="col">Outside the cells (liquid)</th><th scope="col">Inside the cells (pellet)</th></tr></thead><tbody>' +
        [["s", "³⁵S (protein coats)", 80, 20], ["p", "³²P (DNA)", 15, 85]].map(function(r){ var on = x.runs[r[0]]; return '<tr><th scope="row">' + r[1] + "</th><td>" + (on ? bar(r[2], r[2] > 50 ? "most" : "little") : '<span class="muted">?</span>') + "</td><td>" + (on ? bar(r[3], r[3] > 50 ? "most" : "little") : '<span class="muted">?</span>') + "</td></tr>"; }).join("") + "</tbody></table></div>" +
        '<details class="alg"><summary>Zoom to the molecules</summary><p>' + s.zoom + "</p></details>";
      ready = x.runs.s && x.runs.p;
      if (!ready) h += '<p class="tiny muted">Run both batches to unlock the question.</p>';
    } else if (s.id === "s4") {
      x.sel = x.sel || {};
      h += '<div class="tbl-wrap"><table class="dn-tbl dn-num"><caption class="tiny">Percentage of each base <span class="bio-model">Model data</span></caption><thead><tr>' + s.head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
        s.data.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th>" + r.slice(1).map(function(v){ return "<td>" + v + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>" +
        '<div class="chips dn-pats" role="group" aria-label="Patterns">' + s.patterns.map(function(p){ var on = !!x.sel[p.id]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-pat="' + p.id + '" data-k="pt' + p.id + '"' + (x.done ? " disabled" : "") + ">" + p.t + "</button>"; }).join("") + "</div>" +
        (x.done ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="pcheck" data-k="pcheck">Check</button></div>') + (x.msg ? MV.fbHTML(x.done ? "good" : "bad", x.msg) : "");
      return h;
    } else if (s.id === "s5") {
      x.m = x.m || {};
      var A = MV.ans(s), done = s.ev.every(function(e){ return x.m[e.id]; });
      h += '<div class="dn-xfig"><figure><svg class="dn-svg dn-xsvg" viewBox="0 0 200 200" role="img" aria-label="' + MV.esc(s.fig) + '">' + xPatternSVG() + '</svg><figcaption class="tiny muted">' + s.fig + "</figcaption></figure><div>" +
        '<p class="tiny"><strong>Evidence</strong></p><div class="dn-evs" role="group" aria-label="Evidence">' + s.ev.map(function(e){ var m = x.m[e.id]; return '<button type="button" class="dn-ev' + (m ? " done" : "") + '" data-ev="' + e.id + '" data-k="ev' + e.id + '" aria-pressed="' + (x.cur === e.id) + '"' + (m ? " disabled" : "") + ">" + (m ? "✓ " : "") + e.t + (m ? " → " + byId(s.inf, A[e.id]).t : "") + "</button>"; }).join("") + "</div>" +
        '<p class="tiny"><strong>What it tells you</strong></p><div class="dn-evs" role="group" aria-label="What it tells you">' + s.inf.map(function(f){ return '<button type="button" class="dn-inf" data-inf="' + f.id + '" data-k="in' + f.id + '"' + (done ? " disabled" : "") + ">" + f.t + "</button>"; }).join("") + "</div></div></div>" +
        (x.msg ? MV.fbHTML(x.msgK, x.msg) : "") + (done ? MV.fbHTML("good", "<strong>✓ All matched.</strong> " + s.good) : "") + '<p class="dn-note2">' + s.note + "</p>";
      return h;
    } else if (s.id === "s6") {
      x.gen = x.gen == null ? 1 : x.gen; x.model = x.model || "cons";
      var mdl = byId(s.models, x.model), match = JSON.stringify(MS[x.model][x.gen]) === JSON.stringify(MS.semi[x.gen]);
      h += '<div class="dn-msfig"><svg class="dn-svg" viewBox="0 0 330 290" role="img" aria-label="' + MV.esc(msAria(x, mdl)) + '">' +
        txt(84, BANDY.light + 4, "light (¹⁴N)", "dn-sm", "end") + txt(84, BANDY.int + 4, "intermediate", "dn-sm", "end") + txt(84, BANDY.heavy + 4, "heavy (¹⁵N)", "dn-sm", "end") +
        tubeSVG(110, MS.semi[x.gen], "Data") + tubeSVG(214, MS[x.model][x.gen], mdl.t) +
        txt(236, 222, "predicted molecules", "dn-sm", "middle") + molRow(MSMOL[x.model][x.gen], 172, 236) + "</svg>" +
        '<p class="dn-match ' + (match ? "yes" : "no") + '">' + (match ? "✓ The " + mdl.t.toLowerCase() + " prediction matches the data at generation " + x.gen + "." : "✗ The " + mdl.t.toLowerCase() + " prediction does not match the data at generation " + x.gen + ".") + "</p></div>" +
        '<div class="dn-row" id="dn-gen"></div><div class="dn-row" id="dn-model"></div><p class="tiny">' + mdl.d + ' <span class="dn-key2"><i class="dn-sw dn-r-tpl"></i> old (¹⁵N) strand <i class="dn-sw dn-r-new"></i> new (¹⁴N) strand</span></p>';
    }
    if (ready && s.choices) h += choicesHTML(s, x);
    if (s.note && s.id !== "s5") h += '<p class="dn-note2">' + s.note + "</p>";
    return h;
  }
  function bar(v, w){ return '<span class="dn-bar"><i style="width:' + v + '%"></i></span> ' + w; }
  function hcAria(x){ return "Phages labelled with " + (x.batch === "s" ? "³⁵S in their protein coats" : "³²P in their DNA") + " and a bacterium. " + (x.runs[x.batch] ? "After infection and blending, the labelled " + (x.batch === "s" ? "coats are outside the cells, in the liquid." : "DNA is inside the cells, in the pellet.") : "Press Infect and blend."); }
  function msAria(x, mdl){ return "Density tubes at generation " + x.gen + ". Data: " + MS.semi[x.gen].map(function(b){ return b.at + " band"; }).join(" and ") + ". " + mdl.t + " prediction: " + MS[x.model][x.gen].map(function(b){ return b.at === "mid" ? "one band between intermediate and light" : b.at + " band"; }).join(" and ") + "."; }
  function paint(focusTop){
    var s = byId(ST, S.cur), x = st(s.id), box = $("#dn-stn", host);
    if (hcAnim) { hcAnim(); hcAnim = null; }
    MV.keepFocus(box, function(){
      box.innerHTML = '<h3 class="dn-sth">Station ' + s.n + ": " + s.t + '</h3><p class="dn-q"><strong>Question:</strong> ' + s.q + "</p><p>" + s.text + '</p><div class="dn-data"><h4 class="dn-h">' + P.panel + "</h4>" + body(s) + "</div>" +
        '<div class="q-actions dn-snav"><button type="button" class="btn ghost sm" data-act="sprev" data-k="sprev"' + (s.n === 1 ? " disabled" : "") + '>Previous station</button><button type="button" class="btn ' + (x.done ? "primary" : "ghost") + ' sm" data-act="snext" data-k="snext"' + (s.n === ST.length ? " disabled" : "") + ">Next station</button></div>";
    });
    if (s.id === "s3") radios($("#dn-hcb", box), { label:"Batch", options:[{ id:"s", t:"³⁵S in protein coats" }, { id:"p", t:"³²P in DNA" }], value:x.batch, onChange:function(v){ x.batch = v; api.save(); paint(); } });
    if (s.id === "s6") {
      radios($("#dn-gen", box), { label:"Generation", cls:"chips", options:[0, 1, 2].map(function(g){ return { id:g, t:String(g) }; }), value:x.gen, onChange:function(v){ x.gen = +v; api.save(); paint(); } });
      radios($("#dn-model", box), { label:"Model prediction", options:s.models.map(function(m){ return { id:m.id, t:m.t }; }), value:x.model, onChange:function(v){ x.model = v; api.save(); paint(); } });
    }
    nav.setOptions(navOpts()); nav.set(S.cur);
    if (focusTop === true) { var hh = $(".dn-sth", box); hh.setAttribute("tabindex", "-1"); hh.focus({ preventScroll:true }); }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest("#dn-nav")) return;
    var s = byId(ST, S.cur), x = st(s.id);
    if (b.dataset.row) { x.seen[b.dataset.row] = true; api.save(); paint(); return; }
    if (b.dataset.ch != null) { x.pick = +b.dataset.ch; if (MV.ok(s.choices[x.pick])) x.done = true; api.save(); paint(); MV.focusFb($("#dn-stn", host)); return; }
    if (b.dataset.act === "sprev" || b.dataset.act === "snext") { var i = ST.indexOf(s) + (b.dataset.act === "snext" ? 1 : -1); if (ST[i]) { S.cur = ST[i].id; api.save(); paint(true); } return; }
    if (b.dataset.act === "infect") {
      var svg = $("#dn-hcsvg", host), lab = x.batch; b.disabled = true; host.dataset.busy = "1";
      hcAnim = MV.tween({ dur:3200, ease:lin, step:function(t){ svg.innerHTML = hcScene(lab, t); }, done:function(){ hcAnim = null; host.dataset.busy = "0"; x.runs[lab] = true; api.save(); paint(); } });
      return;
    }
    if (b.dataset.pat) { x.sel[b.dataset.pat] = !x.sel[b.dataset.pat]; x.msg = null; api.save(); paint(); return; }
    if (b.dataset.act === "pcheck") {
      var bad = s.patterns.filter(function(p){ return x.sel[p.id] && !MV.ok(p); }), miss = s.patterns.filter(function(p){ return !x.sel[p.id] && MV.ok(p); });
      if (bad.length) x.msg = "<strong>✗ Not quite.</strong> " + bad[0].fb + " Try again.";
      else if (miss.length) x.msg = "<strong>✗ Not quite.</strong> " + s.missing;
      else { x.done = true; x.msg = "<strong>✓ Correct.</strong> " + s.good; }
      api.save(); paint(); MV.focusFb($("#dn-stn", host)); return;
    }
    if (b.dataset.ev) { x.cur = b.dataset.ev; x.msg = null; api.save(); paint(); return; }
    if (b.dataset.inf) {
      if (!x.cur) { x.msg = "Tap a piece of evidence first."; x.msgK = ""; }
      else if (MV.ans(s)[x.cur] === b.dataset.inf) { x.m[x.cur] = true; x.cur = null; x.msg = null; if (s.ev.every(function(q){ return x.m[q.id]; })) x.done = true; }
      else { x.msg = "<strong>✗ Not quite.</strong> " + s.wrong; x.msgK = "bad"; }
      api.save(); paint(); MV.focusFb($("#dn-stn", host)); return;
    }
  });
  host.dataset.busy = "0";
  paint();
}

// ---------- Practice 1: Label the molecule (S1 label-quiz mode, adapted from SBI4U 03): a 3-base-pair ladder at nucleotide
// zoom (7 labels) and a replication fork (3 labels) ----------
function ladderQuizSVG(){
  var h = "", B = [["A", "T"], ["G", "C"], ["T", "A"]], Y = [62, 152, 242];
  function sugar(x, y, up){ var r = 15, p = []; for (var k = 0; k < 5; k++) { var a = (up ? -90 : 90) + k * 72; a = a * Math.PI / 180; p.push([x + r * Math.cos(a), y + r * Math.sin(a)]); } return poly(p, "dn-sug"); }
  function phos(x, y){ return sv("circle", { cx:x, cy:y, r:12, "class":"dn-phz" }) + txt(x, y + 5, "P", "dn-rls", "middle"); }
  // left strand: 5′ phosphate on top, 3′ OH at the bottom; right strand runs the other way
  [[100, true], [300, false]].forEach(function(s){
    var x = s[0], up = s[1], top5 = up;
    h += sv("line", { x1:x, y1:16, x2:x, y2:286, "class":"dn-bond" });
    Y.forEach(function(y){ h += sugar(x, y, up); });
    (top5 ? [16, 107, 197] : [107, 197, 286]).forEach(function(y){ h += phos(x, y); });
    h += top5 ? txt(x, 282, "OH", "dn-sm dn-b", "middle") : txt(x, 22, "OH", "dn-sm dn-b", "middle");
  });
  Y.forEach(function(y, i){
    h += sv("rect", { x:118, y:y - 11, width:66, height:22, rx:5, "class":"dn-tab dn-r-tpl" }) + txt(151, y + 5, B[i][0], "dn-bl", "middle");
    h += sv("rect", { x:216, y:y - 11, width:66, height:22, rx:5, "class":"dn-tab dn-r-cod" }) + txt(249, y + 5, B[i][1], "dn-bl", "middle");
    var k = hb(B[i][0], B[i][1]); for (var j = 0; j < k; j++) { var yy = y + (j - (k - 1) / 2) * 6; h += sv("line", { x1:186, y1:yy, x2:214, y2:yy, "class":"dn-hb" }); }
  });
  return h;
}
var LQZ = { lad:{ phos:[[88, 185, 24, 24]], sugar:[[84, 136, 32, 32]], base:[[118, 141, 66, 22]], hb:[[186, 140, 28, 24]], pde:[[90, 77, 20, 18]], e5:[[86, 0, 28, 30], [286, 272, 28, 28]], e3:[[84, 268, 32, 22], [284, 8, 32, 22]] },
  fork:{ hel:[[0, 0, 0, 0]], pri:[[0, 0, 0, 0]], lig:[[0, 0, 0, 0]] } };
(function(){ // fork-quiz zones from the fork geometry
  var vx = fX(27); LQZ.fork.hel = [[vx - 14, 112, 28, 28]]; LQZ.fork.pri = [[fX(22), FK.nT - 9, fX(24) - fX(22), 18]]; LQZ.fork.lig = [[fX(10) - 11, FK.nT - 10, 22, 22]];
})();
var QFORK = { pos:24, v:27, hel:27, primed:true, built:true, p1:false, sealed:false, sep:false, coil:0, act:"", rnaFrom:20 };
function labelQuiz(host, api, a){
  var S = api.S; S.done = S.done || {}; S.tries = S.tries || {}; S.hints = S.hints || {};
  var cur = null, msg = null, LAD = ["phos", "sugar", "base", "hb", "pde", "e5", "e3"];
  host.innerHTML = '<div class="lq-labs" id="lq-labs"></div><div id="lq-help"></div><div id="lq-fb" aria-live="polite"></div><div class="dn-lq"><div class="dn-lq1"><p class="tiny muted">3 base pairs, nucleotide zoom</p><div id="lq-a"></div></div><div class="dn-lq2"><p class="tiny muted">Replication fork</p><div id="lq-b"></div></div></div><div id="lq-done"></div>';
  var labs = radios($("#lq-labs", host), { label:"Labels", cls:"chips", options:opts(), value:"", onChange:function(id){ cur = id; msg = null; paint(); } });
  function zonesFor(id){ return (LQZ.lad[id] || LQZ.fork[id]); }
  var TAG = { e5:[132, 16, "l"], pde:[116, 86, "l"], sugar:[78, 152, "r"], base:[151, 124, "c"], hb:[200, 180, "c"], phos:[78, 197, "r"], e3:[132, 282, "l"],
    hel:[fX(27) + 16, 152, "l"], pri:[fX(23), 32, "c"], lig:[fX(10), 86, "c"] };
  function spots(ids){ return ids.map(function(id){ return { id:id, label:aria(id), zones:zonesFor(id), tag:TAG[id] }; }); }
  var dA = diagramExplorer($("#lq-a", host), { min:24, levels:[{ id:"lad", name:"Ladder diagram", vb:[400, 300], draw:ladderQuizSVG, aria:function(){ return "Unlabelled DNA ladder with 3 base pairs at nucleotide detail: two backbones of sugars and phosphates, bases joined by dashes."; }, hotspots:spots(LAD) }], onTap:onTap });
  var dB = diagramExplorer($("#lq-b", host), { min:24, levels:[{ id:"fork", name:"Fork diagram", vb:[440, 250], draw:function(){ return forkSVG(QFORK, { labels:false, lig:10 }); }, aria:function(){ return "Unlabelled replication fork with an enzyme at the fork’s point, a short magenta piece on a template, and an enzyme at a gap between two new pieces."; }, hotspots:spots(["hel", "pri", "lig"]) }], onTap:onTap });
  function L(id){ return byId(a.labels, id); }
  function aria(id){ return S.done[id] ? L(id).t + " (labelled)" : L(id).where; }
  function opts(){ return a.labels.map(function(l){ return { id:l.id, t:(S.done[l.id] ? "✓ " : "") + l.t, dis:!!S.done[l.id] }; }); }
  function onTap(id){
    if (!cur) { msg = { k:"", h:"Tap a label first, then tap the part it names." }; paint(); return; }
    var l = L(cur);
    if (id === cur) { S.done[cur] = true; msg = { k:"good", h:"<strong>✓ That’s the " + l.t + ".</strong> " + l.job }; cur = null; labs.setOptions(opts()); labs.set(""); }
    else { S.tries[cur] = (S.tries[cur] || 0) + 1; var key = [cur, id].sort().join("|"); msg = { k:"bad", h:"<strong>✗ That’s not the " + l.t + ".</strong> " + (a.pairs[key] || a.wrongDefault) }; }
    api.save(); paint(); MV.focusFb($("#lq-fb", host));
  }
  function paint(){
    var m = {}, n = {};
    Object.keys(S.done).forEach(function(id){ m[id] = "good"; n[id] = L(id).t; });
    [dA, dB].forEach(function(d){ d.marks(m); d.names(n); d.labels(aria); });
    var l = cur && L(cur), lvl = cur ? (S.hints[cur] || 0) : 0;
    MV.keepFocus($("#lq-help", host), function(){ $("#lq-help", host).innerHTML = l ? '<div class="sel-bar"><span>Selected label: <strong>' + l.t + "</strong></span>" + (l.hints ? MV.hintBtn("lqh", lvl) : "") + "</div>" + (l.hints ? MV.hintsHTML(l.hints, lvl) : "") : ""; });
    $("#lq-fb", host).innerHTML = msg ? '<div class="fb' + (msg.k ? " " + msg.k : "") + '" role="status"><p>' + msg.h + "</p></div>" : "";
    var s = stats(); $("#lq-done", host).innerHTML = s.done === s.total ? '<p class="sort-done">All labelled! You got ' + s.first + " of " + s.total + " right on the first try, without the worked solution.</p>" : "";
  }
  $("#lq-help", host).addEventListener("click", function(e){ var b = e.target.closest('[data-act="hint"]'); if (!b || !cur) return; S.hints[cur] = Math.min(3, (S.hints[cur] || 0) + 1); api.save(); paint(); });
  function stats(){ var f = 0, d = 0; a.labels.forEach(function(l){ if (S.done[l.id]) { d++; if (!(S.tries[l.id] > 0) && (S.hints[l.id] || 0) < 3) f++; } }); return { first:f, done:d, total:a.labels.length }; }
  paint();
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:a.summary + " (first try): " + s.first + "/" + s.total + (s.done < s.total ? " (unfinished)" : "") }; },
    missed:function(){ return a.labels.some(function(l){ return S.tries[l.id] > 0 || (S.hints[l.id] || 0) >= 3; }) ? MV.goalIdx(a.goal) : []; }
  };
}

// ---------- Practice 2: Base-pairing puzzles (S5 sequence entry for B1, N4 number entry for B2–B6) ----------
function puzzles(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">Type your answer, then press Check. For the strand, type the bases or tap the base buttons.</p>' + a.items.map(function(it){ return '<div class="q" data-pz="' + it.id + '"></div>'; }).join("");
  function clean(s){ return String(s || "").toUpperCase().replace(/[^ATGCU]/g, ""); }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-pz="' + it.id + '"]', host), seq = it.kind === "seq";
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="numrow"><label for="pz-' + it.id + '">' + (seq ? "Partner strand:" : "Your answer:") + "</label>" + (seq ? '<span class="dn-sq">5′-</span>' : "") +
      '<input class="numin' + (seq ? " dn-seqin" : "") + '" id="pz-' + it.id + '" data-pzi="' + it.id + '" type="text" ' + (seq ? 'autocapitalize="characters" spellcheck="false"' : 'inputmode="decimal"') + ' autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" + (seq ? '<span class="dn-sq">-3′</span>' : '<span class="dn-unit">' + (it.unit || "") + "</span>") + "</div>";
    if (seq && !x.solved) h += '<div class="dn-pad dn-pad-s" role="group" aria-label="Type a base">' + ["A", "T", "G", "C"].map(function(b){ return '<button type="button" class="dn-base" data-pb="' + b + '" data-k="' + it.id + "pb" + b + '">' + b + "</button>"; }).join("") + '<button type="button" class="btn ghost sm" data-pb="del" data-k="' + it.id + 'pbdel">⌫ Delete</button></div>';
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.pzi; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.pzi) { var b = host.querySelector('[data-k="' + e.target.dataset.pzi + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-pz]"); if (!box) return;
    var it = byId(a.items, box.dataset.pz), x = ist(it.id);
    if (b.dataset.pb) { x.val = b.dataset.pb === "del" ? clean(x.val).slice(0, -1) : clean(x.val) + b.dataset.pb; api.save(); paintItem(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    var ans = MV.ans(it), ok = false, named = null;
    if (it.kind === "seq") {
      var v = clean(String(x.val).replace(/[35]\s*['′’]/g, ""));
      if (!v) { msgs[it.id] = "Type the partner’s bases, such as TGCA."; paintItem(it); return; }
      ok = v === ans;
      if (!ok) named = (it.wrong || []).filter(function(w){ return w.match === v; })[0] || (/U/.test(v) ? { fb:"DNA uses T; U is RNA’s base." } : null);
    } else {
      var n = parseVal(x.val);
      if (n == null) { msgs[it.id] = "Enter a number, such as 25 or 1/2."; paintItem(it); return; }
      if (ans < 1 && /%/.test(x.val)) n = n / 100;
      ok = Math.abs(n - ans) < 1e-6;
      if (!ok) named = (it.wrong || []).filter(function(w){ return Math.abs(n - w.match) < 1e-6; })[0];
    }
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general) + " Try again."; }
    api.save(); paintItem(it); MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Cut here (six top-strand slots, a base pad, the S5 ladder preview with the partner filled in) ----------
var task = (function(){
  var api = null, sel = 0;
  function st(){ var s = api.S; if (!s.top) s.top = ["", "", "", "", "", ""]; return s; }
  function read(){ if (!api) return { top:["", "", "", "", "", ""] }; return { top:st().top.slice() }; }
  function calc(d){
    var t = d.top, full = t.every(function(b){ return !!b; }), bot = t.map(comp), seq = t.join(""), bonds = 0;
    t.forEach(function(b){ if (b) bonds += hb(b, comp(b)); });
    return { full:full, bot:bot, seq:seq, bonds:bonds, bot53:full ? revComp(seq) : "", pal:full && revComp(seq) === seq };
  }
  function draw(){
    var d = read(), c = calc(d), box = $("#dn-tpv"); if (!box) return;
    var D = duplexSVG({ top:d.top, bot:d.top.map(function(b){ return b ? comp(b) : ""; }), x0:46, dx:40, y:70, h:44, roles:["tpl", "cod"], ends:[["5′", "3′"], ["3′", "5′"]], marks:[(function(){ var m = {}; m[sel] = "sel"; return m; })(), {}] });
    box.innerHTML = '<h4 class="dn-h">Your segment</h4><div class="dn-tstage"><svg class="dn-svg" viewBox="0 0 292 140" aria-hidden="true" focusable="false">' + D.svg + "</svg>" +
      '<div class="dn-ov">' + d.top.map(function(b, i){ var x = 46 + i * 40; return '<button type="button" class="dn-slot" data-ts="' + i + '" data-k="ts' + i + '" aria-pressed="' + (sel === i) + '" aria-label="' + MV.esc("Top strand, position " + (i + 1) + ": " + (b || "empty")) + '" style="left:' + f1((x - 19) / 292 * 100) + "%;top:" + f1(14 / 140 * 100) + "%;width:" + f1(38 / 292 * 100) + "%;height:" + f1(56 / 140 * 100) + '%"></button>'; }).join("") + "</div></div>" +
      '<dl class="read dn-tread">' + MV.readoutHTML([["Hydrogen bonds", String(c.bonds)], ["Bottom strand read 5′ → 3′", c.full ? sqH("5′-" + c.bot53 + "-3′") : '<span class="muted">fill all six positions</span>'], ["Palindrome", c.full ? (c.pal ? "yes" : "no") : "—"]]) + "</dl>";
  }
  function lab(k){ return sqH("5′-" + k + "-3′"); }
  return {
    render:function(inp, pv, a){
      api = a; st();
      inp.innerHTML = '<p class="how dn-how">Tap a position in the top strand (5′ → 3′), then a base (or press A, T, G or C). The bottom strand fills in for you.</p><div class="dn-pad" role="group" aria-label="Bases">' + ["A", "T", "G", "C"].map(function(b){ return '<button type="button" class="dn-base" data-tb="' + b + '" data-k="tb' + b + '">' + b + "</button>"; }).join("") + '<button type="button" class="btn ghost sm" data-tb="" data-k="tbclr">Erase</button></div>';
      pv.innerHTML = '<div class="dn-tpv" id="dn-tpv"></div>';
      function put(b){ var had = pv.contains(document.activeElement), s = st(); s.top[sel] = b; if (b && sel < 5) sel++; a.save(); draw(); a.update(); if (had) { var nb = $('[data-ts="' + sel + '"]', pv); if (nb) nb.focus(); } }
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-tb]"); if (b) put(b.dataset.tb); });
      pv.addEventListener("click", function(e){ var b = e.target.closest("[data-ts]"); if (!b) return; sel = +b.dataset.ts; draw(); var nb = $('[data-ts="' + sel + '"]', pv); if (nb) nb.focus(); });
      [inp, pv].forEach(function(el){ el.addEventListener("keydown", function(e){
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (/^[atgc]$/i.test(e.key)) { e.preventDefault(); put(e.key.toUpperCase()); return; }
        var t = e.target.closest && e.target.closest("[data-ts]"), d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (t && d) { e.preventDefault(); sel = clamp(sel + d, 0, 5); draw(); var nb = $('[data-ts="' + sel + '"]', pv); if (nb) nb.focus(); }
      }); });
      draw();
    },
    read:read,
    valid:function(d){ return d.top.every(function(b){ return !!b; }) ? true : "Choose a base for all six positions first."; },
    checks:function(d){ var c = calc(d); return [c.full && c.bonds === 16, c.pal, d.top[0] === "G", /^[AT]$/.test(d.top[2]) && /^[AT]$/.test(d.top[3])]; },
    key:function(d){ return d.top.join(""); },
    label:lab,
    text:function(k){ return "5′-" + k + "-3′"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ label:labelQuiz, puzzles:puzzles },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
