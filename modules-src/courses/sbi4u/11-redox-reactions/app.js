// SBI4U 11 Redox Reactions: hero (glucose's H and electrons flow to O₂), Electron tug-of-war (Mode A: bond tug and molecule
// carbon scores with a score ladder; Mode B: reaction tagging with an S2-style electron-flow animation and an S3-style energy
// drop panel), Four reaction types (four N13 step-through stations with molecule zooms), carbon-score practice, "Electron drop" task.
(function(){
"use strict";
var $ = MV.$;

// ---------- small SVG helpers (from SBI4U 05 / 03) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function sm(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function txt(x, y, s, cls, anchor, extra){ var a = { x:x, y:y, "class":cls || "rx-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }; if (extra) for (var k in extra) a[k] = extra[k]; return sv("text", a, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function op(a){ return a < 0.995 ? ' opacity="' + f1(clamp(a, 0, 1) * 100) / 100 + '"' : ""; }
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function arrow(x1, y1, x2, y2, cls, s){
  var L = Math.hypot(x2 - x1, y2 - y1) || 1;
  return sv("path", { d:"M" + f1(x1) + " " + f1(y1) + " L" + f1(x2) + " " + f1(y2), "class":cls }) + sv("path", { d:head(x2, y2, (x2 - x1) / L, (y2 - y1) / L, s || 6), "class":cls + " rx-ah" });
}
function qpt(p0, c, p2, u){ var a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, d = u * u; return [a * p0[0] + b * c[0] + d * p2[0], a * p0[1] + b * c[1] + d * p2[1]]; }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!segs.length) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
// the first part (fraction p) of a polyline, as a list of points
function polyPart(pts, p){
  var tot = 0, i, out = [pts[0]];
  for (i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  var d = clamp(p, 0, 1) * tot;
  for (i = 1; i < pts.length; i++) {
    var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d >= l) { out.push(pts[i]); d -= l; } else { if (l) out.push([lerp(pts[i - 1][0], pts[i][0], d / l), lerp(pts[i - 1][1], pts[i][1], d / l)]); break; }
  }
  return out;
}
function ptsAttr(pts){ return pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "); }
function sc(v){ var r = Math.round(v * 100) / 100; return (r > 0 ? "+" : "") + MV.num(r); }
// a pill token in a role colour (course plan §3), text in --sheet
function pill(x, y, label, token, w, h, a, cls){
  h = h || 26; w = w || Math.max(30, MV.plain(label).length * (h >= 30 ? 9.2 : 8.2) + 20);
  return "<g" + op(a == null ? 1 : a) + ">" + sv("rect", { x:x - w / 2, y:y - h / 2, width:w, height:h, rx:h / 2, style:"fill:var(" + token + ")", "class":"rx-pill" + (cls ? " " + cls : "") }) +
    txt(x, y + (h >= 30 ? 5.2 : h * 0.17), label, h >= 30 ? "rx-pt rx-pt-l" : h >= 26 ? "rx-pt" : "rx-pt rx-pt-s", "middle") + "</g>";
}
function eDot(x, y, r, a){ return sv("circle", { cx:x, cy:y, r:r || 4.6, "class":"rx-e", opacity:a != null && a < 0.995 ? f1(a * 100) / 100 : null }); }
function hDot(x, y, r, a){ r = r || 8; return "<g" + op(a == null ? 1 : a) + ">" + sv("circle", { cx:x, cy:y, r:r, "class":"rx-hp" }) + txt(x, y + r * 0.42, "+", "rx-hpt", "middle", { style:"font-size:" + f1(r * 1.35) + "px" }) + "</g>"; }
function atomSVG(x, y, el, r, a, fs){
  r = r || 12;
  return "<g" + op(a == null ? 1 : a) + ">" + sv("circle", { cx:x, cy:y, r:r, "class":"rx-a rx-a" + el }) + txt(x, y + r * 0.36, el, "rx-at rx-at" + el, "middle", { style:"font-size:" + f1(fs || r * 1.05) + "px" }) + "</g>";
}

// ---------- @component radioGroup (copied from SBI4U 05 / 03 / MHF4U 25: options may be disabled with dis:true) ----------
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

// ---------- @component bondTug — Mode A tug-of-war: two atoms, a violet electron pair placed by electronegativity (model
// positions), δ⁺/δ⁻ in --ink, a Pauling scale beside it. Also molView (structures with a carbon score in a circle on every carbon)
// and scoreLadder (−4 … +4, with brackets for the electrons each carbon can still give to O₂). ----------
var EN = { H:2.2, C:2.6, N:3.0, O:3.4 };
var ENAME = { H:"hydrogen", C:"carbon", N:"nitrogen", O:"oxygen" };
// p: where the shared pair sits, as a fraction of the way from the left atom to the right one (course plan model positions)
var BONDS = { hh:{ a:"H", b:"H", p:0.5 }, ch:{ a:"C", b:"H", p:0.42, slight:true }, cc:{ a:"C", b:"C", p:0.5 }, co:{ a:"C", b:"O", p:0.7 }, oh:{ a:"O", b:"H", p:0.3 }, oo:{ a:"O", b:"O", p:0.5, dbl:true } };
var BR = { H:19, C:24, O:26 };
function bondSVG(id, name){
  var B = BONDS[id], ax = 66, bx = 246, y = 142, ra = BR[B.a], rb = BR[B.b], h = "";
  var px = lerp(ax, bx, B.p), eq = B.p === 0.5, left = B.p < 0.5;
  h += txt(156, 30, name + " bond", "rx-lab rx-lab-l", "middle");
  // bond line(s)
  if (B.dbl) h += sv("line", { x1:ax + ra - 2, y1:y - 5, x2:bx - rb + 2, y2:y - 5, "class":"rx-bond" }) + sv("line", { x1:ax + ra - 2, y1:y + 5, x2:bx - rb + 2, y2:y + 5, "class":"rx-bond" });
  else h += sv("line", { x1:ax + ra - 2, y1:y, x2:bx - rb + 2, y2:y, "class":"rx-bond" });
  // the middle of the bond
  h += sv("line", { x1:156, y1:y - 30, x2:156, y2:y + 30, "class":"rx-mid" }) + txt(156, y + 44, "middle", "rx-sub", "middle");
  h += atomSVG(ax, y, B.a, ra, 1, 22) + atomSVG(bx, y, B.b, rb, 1, 22);
  // the electron pair (two violet dots across the bond)
  h += eDot(px, y - 11, 5.2) + eDot(px, y + 11, 5.2);
  // partial charges
  if (!eq) {
    var dA = left ? "δ⁻" : "δ⁺", dB = left ? "δ⁺" : "δ⁻", cls = "rx-delta" + (B.slight ? " rx-delta-s" : "");
    h += txt(ax, y - ra - 12, dA, cls, "middle") + txt(bx, y - rb - 12, dB, cls, "middle");
  }
  // electronegativity under each atom
  h += txt(ax, y + ra + 22, MV.num(EN[B.a], 1), "rx-lab", "middle") + txt(ax, y + ra + 37, ENAME[B.a], "rx-sub", "middle");
  h += txt(bx, y + rb + 22, MV.num(EN[B.b], 1), "rx-lab", "middle") + txt(bx, y + rb + 37, ENAME[B.b], "rx-sub", "middle");
  // tug arrow
  var ay = 246;
  if (eq) h += txt(156, ay + 4, "equal pull: shared equally", "rx-lab", "middle");
  else { var tx = left ? ax + ra + 6 : bx - rb - 6; h += arrow(156, ay, tx, ay, "rx-tug", 7) + txt(156, ay + 20, (B.slight ? "pulled a little toward " : "pulled toward ") + ENAME[left ? B.a : B.b], "rx-lab", "middle"); }
  // Pauling scale panel
  h += enScale([B.a, B.b]);
  return h;
}
function enScale(on){
  var X = 404, y = function(v){ return 252 - (v - 2.0) / 1.6 * 196; }, h = "";
  h += sv("line", { x1:324, y1:14, x2:324, y2:286, "class":"rx-divide" });
  h += txt(404, 22, "Electronegativity", "rx-lab", "middle") + txt(404, 37, "higher pulls harder", "rx-sub", "middle");
  h += arrow(X, 258, X, 50, "rx-axis", 6);
  ["H", "C", "N", "O"].forEach(function(el){
    var yy = y(EN[el]), hit = on.indexOf(el) >= 0;
    h += sv("line", { x1:X - 6, y1:yy, x2:X + 6, y2:yy, "class":"rx-tick" });
    if (hit) h += sv("circle", { cx:X, cy:yy, r:6.5, "class":"rx-mark" });
    h += txt(X + 14, yy + 4.5, el + " " + MV.num(EN[el], 1), hit ? "rx-lab" : "rx-sub", "start");
  });
  return h;
}

// Molecules for Mode A. atoms [el, x, y]; bonds [i, j, order]; bub: where each carbon's score circle sits ([atom index, x, y]).
var MOLS = {
  ch4:{ atoms:[["C", 150, 150], ["H", 150, 86], ["H", 214, 150], ["H", 150, 214], ["H", 86, 150]], bonds:[[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], bub:[[0, 198, 104]] },
  ch3oh:{ atoms:[["C", 122, 150], ["H", 122, 86], ["H", 58, 150], ["H", 122, 214], ["O", 190, 150], ["H", 250, 150]], bonds:[[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [4, 5, 1]], bub:[[0, 168, 104]] },
  hcho:{ atoms:[["C", 130, 150], ["H", 96, 93], ["H", 96, 207], ["O", 200, 150]], bonds:[[0, 1, 1], [0, 2, 1], [0, 3, 2]], bub:[[0, 178, 104]] },
  hcooh:{ atoms:[["C", 132, 150], ["H", 66, 150], ["O", 166, 92], ["O", 166, 208], ["H", 226, 208]], bonds:[[0, 1, 1], [0, 2, 2], [0, 3, 1], [3, 4, 1]], bub:[[0, 84, 104]] },
  co2:{ atoms:[["O", 82, 150], ["C", 150, 150], ["O", 218, 150]], bonds:[[0, 1, 2], [1, 2, 2]], bub:[[1, 150, 98]] }
};
(function(){
  // glucose, open-chain (Fischer) form: C1 aldehyde at the top, C6 CH₂OH at the bottom; OH on the right at C2, C4, C5, left at C3
  var a = [], b = [], bub = [], X = 116, Y0 = 30, dy = 42;
  var side = [null, "R", "L", "R", "R"];
  for (var i = 0; i < 6; i++) { a.push(["C", X, Y0 + i * dy]); if (i) b.push([i - 1, i, 1]); }
  function add(el, x, y, to, ord){ a.push([el, x, y]); b.push([to, a.length - 1, ord || 1]); return a.length - 1; }
  add("H", X - 36, Y0, 0); add("O", X + 38, Y0, 0, 2);
  for (i = 1; i <= 4; i++) {
    var y = Y0 + i * dy, r = side[i] === "R";
    add("H", r ? X - 36 : X + 36, y, i);
    var o = add("O", r ? X + 38 : X - 38, y, i); add("H", r ? X + 66 : X - 66, y, o);
  }
  var y6 = Y0 + 5 * dy; add("H", X - 36, y6, 5); add("H", X + 36, y6, 5); var o6 = add("O", X, y6 + 34, 5); add("H", X + 28, y6 + 34, o6);
  for (i = 0; i < 6; i++) bub.push([i, 232, Y0 + i * dy]);
  MOLS.glu = { atoms:a, bonds:b, bub:bub, big:true, r:{ C:12, O:10, H:8 } };
  // palmitic acid, skeletal zigzag: k = 0 is C16 (CH₃, left end) … k = 15 is C1 (COOH, right end); H atoms not drawn
  var pa = [], pb = [], pbub = [];
  for (var k = 0; k < 16; k++) { pa.push(["C", 18 + k * 17, k % 2 ? 122 : 138]); if (k) pb.push([k - 1, k, 1]); pbub.push(k === 15 ? [k, 262, 88] : [k, 18 + k * 17, k % 2 ? 94 : 166]); }
  pa.push(["O", 292, 102]); pb.push([15, 16, 2]); pa.push(["O", 294, 136]); pb.push([15, 17, 1]); pa.push(["H", 312, 146]); pb.push([17, 18, 1]);
  MOLS.palm = { atoms:pa, bonds:pb, bub:pbub, big:true, skeletal:true, Hcount:{ 0:3, 15:0 }, Hdef:2, r:{ C:5, O:9, H:7.5 } };
})();
// carbon score per carbon: C–H −1, C–O +1 per bond order (C=O +2), C–C 0; skeletal carbons count their hidden H atoms
function scores(m){
  var out = {};
  m.atoms.forEach(function(at, i){
    if (at[0] !== "C") return;
    var s = 0;
    m.bonds.forEach(function(bd){ var j = bd[0] === i ? bd[1] : bd[1] === i ? bd[0] : -1; if (j < 0) return; var e = m.atoms[j][0]; if (e === "H") s -= bd[2]; else if (e === "O") s += bd[2]; });
    if (m.skeletal) s -= (m.Hcount[i] != null ? m.Hcount[i] : m.Hdef);
    out[i] = s;
  });
  return out;
}
function molInfo(id){
  var m = MOLS[id], s = scores(m), keys = Object.keys(s), tot = 0;
  keys.forEach(function(k){ tot += s[k]; });
  var nC = keys.length, avg = tot / nC;
  var cnt = { ch:0, co:0, cdo:0 };
  if (!m.big) m.bonds.forEach(function(bd){ var e1 = m.atoms[bd[0]][0], e2 = m.atoms[bd[1]][0], pair = [e1, e2].sort().join(""); if (pair === "CH") cnt.ch++; else if (pair === "CO") { if (bd[2] === 2) cnt.cdo++; else cnt.co++; } });
  return { s:s, nC:nC, tot:tot, avg:avg, cnt:cnt, give:(4 - avg) * nC };
}
function molSVG(id, label){
  var m = MOLS[id], s = scores(m), rr = m.r || { C:15, O:14, H:11 }, h = "";
  // bonds (with a violet pair on each one-carbon bond, nearer the atom that pulls harder)
  m.bonds.forEach(function(bd){
    var A = m.atoms[bd[0]], B = m.atoms[bd[1]], dx = B[1] - A[1], dy = B[2] - A[2], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    var x1 = A[1] + ux * (m.skeletal && A[0] === "C" ? 0 : rr[A[0]] - 2), y1 = A[2] + uy * (m.skeletal && A[0] === "C" ? 0 : rr[A[0]] - 2);
    var x2 = B[1] - ux * (m.skeletal && B[0] === "C" ? 0 : rr[B[0]] - 2), y2 = B[2] - uy * (m.skeletal && B[0] === "C" ? 0 : rr[B[0]] - 2);
    if (bd[2] === 2) h += sv("line", { x1:x1 + nx * 3.6, y1:y1 + ny * 3.6, x2:x2 + nx * 3.6, y2:y2 + ny * 3.6, "class":"rx-bond rx-bond-m" }) + sv("line", { x1:x1 - nx * 3.6, y1:y1 - ny * 3.6, x2:x2 - nx * 3.6, y2:y2 - ny * 3.6, "class":"rx-bond rx-bond-m" });
    else h += sv("line", { x1:x1, y1:y1, x2:x2, y2:y2, "class":"rx-bond rx-bond-m" });
    if (!m.big) {
      var ea = EN[A[0]], eb = EN[B[0]], f = ea === eb ? 0.5 : (A[0] === "O" || B[0] === "O") ? (ea > eb ? 0.3 : 0.7) : (ea > eb ? 0.42 : 0.58);
      var offs = bd[2] === 2 ? [-0.07, 0.07] : [0];
      offs.forEach(function(o){ var px = lerp(A[1], B[1], f + o), py = lerp(A[2], B[2], f + o); h += eDot(px + nx * 3.4, py + ny * 3.4, 2.7) + eDot(px - nx * 3.4, py - ny * 3.4, 2.7); });
    }
  });
  m.bub.forEach(function(bb){ var c = m.atoms[bb[0]], x0 = id === "glu" ? c[1] + 78 : c[1]; h += sv("line", { x1:x0, y1:c[2], x2:bb[1], y2:bb[2], "class":"rx-lead" }); });
  m.atoms.forEach(function(at){
    if (m.skeletal && at[0] === "C") h += sv("circle", { cx:at[1], cy:at[2], r:5, "class":"rx-a rx-aC" });
    else h += atomSVG(at[1], at[2], at[0], rr[at[0]], 1, m.big ? rr[at[0]] * 1.15 : null);
  });
  // carbon-score circles
  m.bub.forEach(function(bb){
    var c = m.atoms[bb[0]], r = m.skeletal ? 8.5 : 12;
    h += sv("circle", { cx:bb[1], cy:bb[2], r:r, "class":"rx-bub" }) + txt(bb[1], bb[2] + (m.skeletal ? 3.3 : 4.2), sc(s[bb[0]]), m.skeletal ? "rx-bubt rx-bubt-s" : "rx-bubt", "middle");
  });
  if (id === "palm") { h += txt(16, 214, "Each corner is a carbon; its H atoms aren’t drawn.", "rx-sub", "start") + txt(16, 60, "CH₃ end", "rx-sub", "start") + txt(316, 60, "COOH end", "rx-sub", "end"); }
  if (id === "glu") h += txt(8, 292, "open-chain form", "rx-sub", "start");
  if (!m.big) h += txt(150, 30, label, "rx-lab rx-lab-l", "middle");
  return h;
}
// ladder: list [{lab, v, a (0–1), hl}], brackets [{v, n, a}] drawn from v up to +4
function ladderSVG(list, brackets){
  var X = 404, y = function(v){ return 256 - (v + 4) / 8 * 212; }, h = "";
  h += sv("line", { x1:324, y1:14, x2:324, y2:286, "class":"rx-divide" });
  h += txt(404, 18, "Carbon score", "rx-lab", "middle") + txt(404, 33, "more oxidized", "rx-sub", "middle") + txt(404, 284, "more reduced", "rx-sub", "middle");
  h += sv("line", { x1:X, y1:y(-4), x2:X, y2:y(4), "class":"rx-axis" });
  for (var v = -4; v <= 4; v++) { h += sv("line", { x1:X - (v % 2 ? 3 : 6), y1:y(v), x2:X + (v % 2 ? 3 : 6), y2:y(v), "class":"rx-tick" }); if (!(v % 2)) h += txt(X + 11, y(v) + 4, sc(v), "rx-sub", "start"); }
  (brackets || []).forEach(function(bk, i){
    if (bk.a <= 0.01) return;
    var bx = 446 + i * 17, y1 = y(bk.v), y2 = y(4);
    h += "<g" + op(bk.a) + ">" + sv("path", { d:"M" + (bx - 4) + " " + f1(y1) + " H" + bx + " V" + f1(y2) + " H" + (bx - 4), "class":"rx-brk" }) +
      txt(bx + 8, (y1 + y2) / 2, bk.n, "rx-brkt", "middle", { transform:"rotate(-90 " + f1(bx + 8) + " " + f1((y1 + y2) / 2) + ")", dy:"0.35em" }) + "</g>";
  });
  list.forEach(function(it){
    if (it.a <= 0.01) return;
    var yy = y(it.v) + (1 - it.a) * 30;
    h += "<g" + op(it.a) + ">" + sv("path", { d:"M" + (X - 4) + " " + f1(yy) + " l-9 -6 v12 z", "class":it.hl ? "rx-mark" : "rx-mark2" }) + txt(X - 17, yy + 4, it.lab, it.hl ? "rx-lab" : "rx-sub", "end") + "</g>";
  });
  return h;
}

// ---------- @component S2 electronFlow — Mode B scene: reactant tokens; violet electron tokens (and magenta H⁺ where H atoms move)
// run along an arc from the reducing agent to the oxidizing agent; the tokens then turn into their products. ----------
var RXA = {
  B1:{ L:["Na", "--ink", "Na⁺", "--ink"], R:["Cl", "--ink", "Cl⁻", "--ink"], ra:"L", e:1, h:0 },
  B2:{ L:["2H₂", "--ink", "", "--ink"], R:["O₂", "--bio-o2", "2H₂O", "--bio-o2"], ra:"L", e:4, h:4 },
  B3:{ L:["CH₄", "--bio-carbon", "CO₂", "--bio-carbon"], R:["2O₂", "--bio-o2", "2H₂O", "--bio-o2"], ra:"L", e:8, h:4 },
  B4:{ L:["C₆H₁₂O₆", "--bio-carbon", "6CO₂", "--bio-carbon"], R:["6O₂", "--bio-o2", "6H₂O", "--bio-o2"], ra:"L", e:24, h:12 },
  B5:{ L:["6CO₂", "--bio-carbon", "C₆H₁₂O₆", "--bio-carbon"], R:["6H₂O", "--bio-o2", "6O₂", "--bio-o2"], ra:"R", e:24, h:12, uphill:true },
  B6:{ L:["malate", "--bio-carbon", "oxaloacetate", "--bio-carbon"], R:["NAD⁺", "--ink-2", "NADH", "--ink"], ra:"L", e:2, h:2, hOut:1 },
  B7:{ L:["e⁻", "--bio-e", "", "--bio-e"], R:["cytochrome Fe³⁺", "--ink", "cytochrome Fe²⁺", "--ink"], ra:"L", e:1, h:0, half:true }
};
var LX = 112, RX_ = 368, TY = 128;
function flowSVG(rid, t, o){
  var A = RXA[rid], h = "", ra = A.ra === "L" ? LX : RX_, oa = A.ra === "L" ? RX_ : LX, done = t >= 0.999;
  var m = clamp((t - 0.82) / 0.16, 0, 1);
  var p0 = [ra, TY - 18], p2 = [oa, TY - 18], c = [240, -8], c2 = [240, 44];
  if (A.uphill) h += txt(240, 18, "uphill: light energy pushes the electrons", "rx-sub", "middle");
  if (A.half) h += txt(LX, TY - 34, "from the carrier before it", "rx-sub", "middle");
  // guide arc after the flow
  if (done && o.shown) {
    var pts = []; for (var i = 0; i <= 24; i++) pts.push(qpt(p0, c, p2, i / 24));
    h += sv("polyline", { points:ptsAttr(pts.slice(0, 23)), "class":"rx-guide" });
    var a1 = pts[22], a2 = pts[24]; h += arrow(a1[0], a1[1], a2[0], a2[1], "rx-guide", 7);
    var top = qpt(p0, c, p2, 0.5); h += txt(top[0], top[1] - 8, A.e + " e⁻" + (A.h ? " (with H⁺)" : ""), "rx-lab rx-lab-e", "middle");
  }
  // tokens: reactant → product
  ["L", "R"].forEach(function(side){
    var d = A[side], x = side === "L" ? LX : RX_;
    if (d[0] === "e⁻") { if (m < 1) h += "<g" + op(1 - m) + ">" + sv("circle", { cx:x, cy:TY, r:14, "class":"rx-e" }) + txt(x, TY + 5, "e⁻", "rx-pt", "middle") + "</g>"; }
    else {
      if (m < 1) h += pill(x, TY, d[0], d[1], null, 30, 1 - m);
      if (m > 0 && d[2]) h += pill(x, TY, d[2], d[3], null, 30, m);
      else if (m > 0 && !d[2] && side === "L" && rid === "B2") h += txt(x, TY + 5, "(its H is now in water)", "rx-sub", "middle", { opacity:f1(m * 100) / 100 });
    }
  });
  // free H⁺ product (B6)
  if (A.hOut && m > 0) h += "<g" + op(m) + ">" + hDot(oa + 64, TY + 30, 9) + txt(oa + 78, TY + 34, "H⁺", "rx-sub", "start") + "</g>";
  // moving electrons and H⁺
  if (t > 0 && t < 0.999) {
    var n = A.e, k;
    for (k = 0; k < A.h; k++) { var u2 = clamp((t - 0.08 - 0.42 * k / Math.max(1, A.h)) / 0.38, 0, 1); if (u2 > 0 && u2 < 1) { var q2 = qpt(p0, c2, p2, sm(u2)); h += hDot(q2[0], q2[1], 6.5); } }
    for (k = 0; k < n; k++) { var u = clamp((t - 0.04 - 0.44 * k / Math.max(1, n)) / 0.36, 0, 1); if (u > 0 && u < 1) { var q = qpt(p0, c, p2, sm(u)); h += eDot(q[0] + (k % 3 - 1) * 2.4, q[1], 4.6); } }
  }
  // tags shown after a reveal
  if (o.shown && done) {
    var lr = A.ra === "L";
    if (A.half) h += txt(LX, TY + 34, "its donor is oxidized", "rx-sub", "middle");
    else h += txt(LX, TY + 34, lr ? "oxidized" : "reduced", "rx-lab", "middle") + txt(LX, TY + 50, lr ? "reducing agent" : "oxidizing agent", "rx-sub", "middle");
    h += txt(RX_, TY + 34, lr ? "reduced" : "oxidized", "rx-lab", "middle") + txt(RX_, TY + 50, lr ? "oxidizing agent" : "reducing agent", "rx-sub", "middle");
  }
  return h;
}
// @component S3 energyDrop — B4 release panel: one big drop with a flame (fire) or a staircase of six drops with ATP (cell)
var STAIRS = (function(){ var p = [[30, 36], [116, 36]], x = 116, y = 36, d = 118 / 6; for (var i = 0; i < 6; i++) { y += d; p.push([x, y]); x += 46; if (i < 5) p.push([x, y]); } p.push([458, y]); return p; })();
var FIRE = [[30, 36], [190, 36], [190, 154], [458, 154]];
function flameSVG(x, y, s){ return sv("path", { d:"M" + x + " " + (y + 22 * s) + " C" + (x - 16 * s) + " " + (y + 18 * s) + " " + (x - 14 * s) + " " + y + " " + (x - 4 * s) + " " + (y - 14 * s) + " C" + (x - 2 * s) + " " + (y - 4 * s) + " " + (x + 6 * s) + " " + (y - 6 * s) + " " + (x + 4 * s) + " " + (y - 20 * s) + " C" + (x + 18 * s) + " " + (y - 6 * s) + " " + (x + 16 * s) + " " + (y + 16 * s) + " " + x + " " + (y + 22 * s) + " Z", "class":"rx-flame" }); }
function energySVG(mode, t, dg){
  var h = "", fire = mode === "fire", pts = fire ? FIRE : STAIRS;
  h += txt(30, 24, "glucose + 6O₂", "rx-lab", "start") + txt(458, 174, "6CO₂ + 6H₂O", "rx-lab", "end") + txt(458, 24, dg, "rx-sub", "end");
  h += txt(14, 100, "free energy", "rx-sub", "middle", { transform:"rotate(-90 14 100)" });
  h += sv("polyline", { points:ptsAttr(pts), "class":"rx-ghost" });
  var part = polyPart(pts, t);
  h += sv("polyline", { points:ptsAttr(part), "class":"rx-drop" });
  var ball = polyAt(pts, t); h += sv("circle", { cx:ball[0], cy:ball[1], r:5.5, "class":"rx-ball" });
  if (fire) {
    var a = clamp((t - 0.45) / 0.3, 0, 1);
    if (a > 0) h += "<g" + op(a) + ">" + flameSVG(236, 96, 1.25) + txt(262, 92, "heat and light", "rx-lab", "start") + txt(262, 108, "all released at once", "rx-sub", "start") + "</g>";
  } else {
    for (var i = 0; i < 6; i++) {
      var x = 116 + i * 46, yTop = 36 + i * 118 / 6, yMid = yTop + 118 / 12, need = (i + 0.7) / 6.6;
      if (i % 2 === 0 && t >= need) h += pill(x + 22, yMid - 4, "ATP", "--bio-atp", 38, 18);
    }
    if (t > 0.9) h += txt(300, 74, "some energy captured", "rx-lab", "start") + txt(300, 90, "as ATP; the rest is heat", "rx-sub", "start");
  }
  return h;
}

// ---------- Explore: Electron tug-of-war ----------
var EXP = null;
var CHIP_B = { B1:"B1 · Na + Cl", B2:"B2 · H₂ + O₂", B3:"B3 · CH₄ + O₂", B4:"B4 · glucose + O₂", B5:"B5 · photosynthesis", B6:"B6 · malate + NAD⁺", B7:"B7 · cytochrome" };
function explore(host, api){
  var C = api.content, S = api.S;
  var D = { mode:"A", aSel:{ k:"bond", id:"co" }, rx:"B4", tags:{}, rev:{}, rel:"fire", order:C.orderStart.slice(), moved:false, tc3:{ ge:"", go:"", pe:"", po:"", pick:"" } };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  var busy = false, shown = false, anim = null, flowT = 1, flowOn = false, ladT = 1, ladAll = false, relT = 1, relAnim = null, ordSel = null, tagMsg = null, readSig = "";
  var RXS = C.reactions, MOLN = {}; C.mols.forEach(function(m){ MOLN[m[0]] = m; });
  var BN = {}; C.bonds.forEach(function(b){ BN[b[0]] = b[1]; });
  host.innerHTML = '<div class="pg rx-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="rx-ga"><div class="rx-stage"><svg id="rx-sa" viewBox="0 0 480 300" role="img" focusable="false"></svg></div>' +
      '<p class="rx-legend tiny"><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5" class="rx-e"/></svg>electron</span><span><i class="bio-sw" style="background:var(--bio-carbon)"></i>carbon</span><span><i class="bio-sw" style="background:var(--bio-o2)"></i>oxygen</span><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" class="rx-bub"/></svg>carbon score</span></p></div>' +
    '<div id="rx-gb" hidden><p class="rx-eqline bio-chem" id="rx-eq"></p><div class="rx-stage"><svg id="rx-sb" viewBox="0 0 480 196" role="img" focusable="false"></svg></div>' +
      '<p class="rx-legend tiny"><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5" class="rx-e"/></svg>electron (e⁻)</span><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="6" class="rx-hp"/></svg>H⁺</span><span><i class="bio-sw" style="background:var(--bio-carbon)"></i>carbon compound</span><span><i class="bio-sw" style="background:var(--bio-o2)"></i>O₂ and H₂O</span></p>' +
      '<div id="rx-en" hidden><div class="rx-stage"><svg id="rx-se" viewBox="0 0 480 182" role="img" focusable="false"></svg></div></div></div>' +
    '<p class="rx-cap" id="rx-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><fieldset class="rx-fs" id="rx-fs"><legend class="vh">Tug-of-war controls</legend><div class="rx-row" id="rx-mode"></div>' +
      '<div id="rx-ca"><div class="rx-row"><span class="rg-lab">Bond</span><div class="rx-chips" id="rx-bonds" role="group" aria-label="Bonds"></div></div>' +
        '<div class="rx-row"><span class="rg-lab">Molecule</span><div class="rx-chips" id="rx-mols" role="group" aria-label="Molecules"></div></div>' +
        '<p class="tiny muted rx-rule">' + C.scoreRule + "</p></div>" +
      '<div id="rx-cb" hidden><div class="rx-row" id="rx-rxs"></div><div class="rx-row" id="rx-rel"></div><p class="tiny muted">' + C.tagHow + '</p><div class="rx-cards" id="rx-cards"></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="rx-check" data-k="rxchk">Check tags</button><button type="button" class="btn ghost sm" id="rx-flow" data-k="rxflow">Show electron flow</button><button type="button" class="btn ghost sm" id="rx-clear" data-k="rxclr">Clear tags</button></div>' +
        '<div id="rx-tfb" aria-live="polite"></div></div>' +
    '</fieldset></div><div class="pg-read"><dl class="read rx-read" id="rx-read" aria-live="polite"></dl></div></div>' +
    '<div class="rx-extra" id="rx-extra"><div class="rx-box"><h4>' + C.orderTitle + '</h4><p class="tiny muted">Tap a molecule, then use Move up and Move down.</p><ol class="olist" id="rx-ord"></ol></div>' +
      '<div class="rx-box"><h4>' + C.fuelTitle + '</h4><p class="rx-frule">' + C.fuelRule + '</p><div class="tbl-wrap"><table class="rx-ft"><thead><tr><th scope="col">Fuel</th><th scope="col">Electrons to O₂</th><th scope="col">O₂ needed</th></tr></thead><tbody>' +
        C.fuelRows.map(function(r){ var k = r[0] === "glu" ? "g" : "p"; return '<tr><th scope="row">' + r[1] + '</th><td><input class="numin rx-fin" type="text" inputmode="decimal" autocomplete="off" data-fu="' + k + 'e" aria-label="' + MV.esc(MV.plain(r[1])) + ': electrons given to O₂"></td><td><input class="numin rx-fin" type="text" inputmode="decimal" autocomplete="off" data-fu="' + k + 'o" aria-label="' + MV.esc(MV.plain(r[1])) + ': O₂ molecules needed"></td></tr>'; }).join("") +
        '</tbody></table></div><div class="rx-row" id="rx-pick"></div></div></div>' +
    '<details class="alg rx-model"><summary>' + C.modelTitle + '</summary><ul class="rx-rules">' + C.modelRules.map(function(r){ return "<li>" + r + "</li>"; }).join("") + '</ul><p class="tiny muted"><span class="bio-model">Model</span> ' + C.modelNote + "</p></details>";
  var modeR = radios($("#rx-mode"), { label:"Mode", options:C.modes.map(function(m){ return { id:m[0], t:m[0] + " · " + m[1] }; }), value:S.mode, onChange:function(v){ S.mode = v; stopAnims(); api.save(); syncMode(); paintAll(); } });
  var rxR = radios($("#rx-rxs"), { label:"Reaction", cls:"chips", options:RXS.map(function(r){ return { id:r.id, t:CHIP_B[r.id] }; }), value:S.rx, onChange:function(v){ setRx(v); } });
  var relR = radios($("#rx-rel"), { label:C.release.label, options:[{ id:"fire", t:C.release.fire }, { id:"steps", t:C.release.steps }], value:S.rel, onChange:function(v){ S.rel = v; api.save(); playRel(); } });
  var pickR = radios($("#rx-pick"), { label:C.fuelPick, cls:"chips", aria:"More electrons per carbon", options:C.fuelChoices.map(function(c){ return { id:c[0], t:c[1] }; }), value:S.tc3.pick, onChange:function(v){ S.tc3.pick = v; api.save(); MV.changed(); } });
  // Mode A chips (one shown item across both rows)
  function paintChips(){
    MV.keepFocus($("#rx-bonds"), function(){ $("#rx-bonds").innerHTML = C.bonds.map(function(b){ var on = S.aSel.k === "bond" && S.aSel.id === b[0]; return '<button type="button" class="rx-chip" aria-pressed="' + on + '" data-bd="' + b[0] + '" data-k="bd' + b[0] + '">' + b[1] + "</button>"; }).join(""); });
    MV.keepFocus($("#rx-mols"), function(){ $("#rx-mols").innerHTML = C.mols.map(function(m){ var on = S.aSel.k === "mol" && S.aSel.id === m[0]; return '<button type="button" class="rx-chip" aria-pressed="' + on + '" data-ml="' + m[0] + '" data-k="ml' + m[0] + '">' + m[1] + "</button>"; }).join(""); });
  }
  $("#rx-ca").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.bd) S.aSel = { k:"bond", id:b.dataset.bd }; else if (b.dataset.ml) S.aSel = { k:"mol", id:b.dataset.ml }; else return;
    ladAll = false; ladT = 1; api.save(); paintChips(); paintAll(); MV.changed();
  });
  // Mode B tagging
  function rxObj(){ return byId(RXS, S.rx); }
  function tagsOf(rid){ return S.tags[rid] || (S.tags[rid] = {}); }
  function paintCards(){
    var R = rxObj(), T = tagsOf(R.id), key = MV.ans(R).key;
    var host2 = $("#rx-cards"), f = host2.contains(document.activeElement);
    host2.innerHTML = R.parts.map(function(p){
      var tagged = !!key[p[0]];
      return '<div class="rx-card" data-rc="' + p[0] + '"><p class="rx-card-h"><strong class="bio-chem">' + p[1] + '</strong> <span class="muted tiny">' + p[2] + "</span></p>" +
        (tagged ? '<div class="rx-tg" data-tg="ch"></div><div class="rx-tg" data-tg="ag"></div>' : '<p class="tiny muted">An electron, not a substance: nothing to tag.</p>') + "</div>";
    }).join("");
    R.parts.forEach(function(p){
      if (!key[p[0]]) return;
      var card = host2.querySelector('[data-rc="' + p[0] + '"]'), t = T[p[0]] || (T[p[0]] = { ch:"", ag:"" });
      radios(card.querySelector('[data-tg="ch"]'), { label:"Change", aria:p[1] + ": oxidized, reduced or neither", cls:"chips", options:[{ id:"ox", t:"oxidized" }, { id:"red", t:"reduced" }, { id:"none", t:"neither" }], value:t.ch, onChange:function(v){ t.ch = v; tagMsg = null; api.save(); paintTagFb(); MV.changed(); } });
      radios(card.querySelector('[data-tg="ag"]'), { label:"Agent", aria:p[1] + ": agent role", cls:"chips", options:[{ id:"ra", t:"reducing agent" }, { id:"oa", t:"oxidizing agent" }], value:t.ag, onChange:function(v){ t.ag = v; tagMsg = null; api.save(); paintTagFb(); MV.changed(); } });
    });
    if (f) { var b0 = host2.querySelector("button"); if (b0) b0.focus({ preventScroll:true }); }
  }
  function judgeTags(rid){
    var R = byId(RXS, rid), key = MV.ans(R).key, T = tagsOf(rid), ids = Object.keys(key), name = {};
    R.parts.forEach(function(p){ name[p[0]] = p[1]; });
    var miss = ids.filter(function(k){ return !T[k] || !T[k].ch || (T[k].ch !== "none" && !T[k].ag); });
    if (miss.some(function(k){ return !T[k] || !T[k].ch; })) return { ok:false, msg:"Tag every reactant first: oxidized, reduced or neither, then its agent role." };
    var chOk = ids.every(function(k){ return T[k].ch === key[k][0]; }), agOk = ids.every(function(k){ return T[k].ag === key[k][1]; });
    if (chOk && agOk) return { ok:true };
    var o2 = T.o2 && key.o2 && key.o2[0] === "red";
    if (o2 && T.o2.ch === "ox") return { ok:false, msg:"O₂ gains electrons (and H) to become H₂O: it is reduced." };
    if (ids.length > 1 && ids.every(function(k){ return T[k].ch === "ox"; })) return { ok:false, msg:"Electrons don’t vanish. Every electron lost by one substance is gained by another." };
    if (ids.some(function(k){ return T[k].ch === "none" && key[k][0] === "ox"; })) return { ok:false, msg:"Oxidation is losing electrons. In biology that is often losing H atoms: lactate → pyruvate is an oxidation, with no oxygen involved." };
    if (chOk && ids.length > 1 && ids.every(function(k){ return T[k].ag && T[k].ag !== key[k][1]; })) {
      var ra = ids.filter(function(k){ return key[k][1] === "ra"; })[0];
      return { ok:false, msg:"The reducing agent <em>gives</em> electrons, so it’s the one that’s oxidized: " + name[ra] + "." };
    }
    if (chOk && ids.some(function(k){ return !T[k].ag; })) return { ok:false, msg:"The changes are right. Now choose each reactant’s agent role." };
    if (chOk) return { ok:false, msg:"The changes are right. Check the agents: the reducing agent <em>gives</em> electrons (so it is oxidized); the oxidizing agent <em>takes</em> them (so it is reduced)." };
    return { ok:false, msg:"Not yet. Follow the electrons (or the H atoms): which reactant loses them, and which gains them?" };
  }
  function paintTagFb(){ $("#rx-tfb").innerHTML = tagMsg ? MV.fbHTML(tagMsg.good ? "good" : "bad", tagMsg.html) : ""; }
  $("#rx-cb").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.id === "rx-check") {
      var r = judgeTags(S.rx);
      if (r.ok) { S.rev[S.rx] = true; tagMsg = { good:true, html:"<strong>✓ All tags correct.</strong> The readout now shows what moved. Press Show electron flow to watch it." }; }
      else tagMsg = { good:false, html:"<strong>✗ Not quite.</strong> " + r.msg };
      api.save(); paintTagFb(); paintRead(); drawB(); MV.focusFb($("#rx-cb"));
    } else if (b.id === "rx-flow") { S.rev[S.rx] = true; api.save(); playFlow(2600, null); }
    else if (b.id === "rx-clear") { S.tags[S.rx] = {}; tagMsg = null; api.save(); paintCards(); paintTagFb(); MV.changed(); }
  });
  function setRx(v){ S.rx = v; stopAnims(); flowOn = !!S.rev[v]; flowT = 1; tagMsg = null; api.save(); rxR.set(v); paintCards(); paintTagFb(); syncMode(); paintAll(); MV.changed(); }
  // animations
  function stopAnims(){ if (anim) { anim(); anim = null; } if (relAnim) { relAnim(); relAnim = null; } flowT = 1; ladT = 1; relT = 1; }
  function playFlow(dur, done){
    if (anim) { anim(); anim = null; }
    flowOn = true; flowT = 0; setBusy(true); paintRead();
    anim = MV.tween({ dur:dur, ease:lin, step:function(t){ flowT = t; drawB(); }, done:function(){ anim = null; flowT = 1; setBusy(false); drawB(); paintRead(); paintCap(); if (done) done(); } });
  }
  function playRel(){
    if (relAnim) { relAnim(); relAnim = null; }
    relT = 0;
    relAnim = MV.tween({ dur:2200, ease:lin, step:function(t){ relT = t; drawE(); }, done:function(){ relAnim = null; relT = 1; drawE(); } });
    paintCap();
  }
  function setBusy(b){ busy = b; $("#rx-fs").disabled = b; }
  // drawing
  function syncMode(){
    modeR.set(S.mode);
    var a = S.mode === "A";
    $("#rx-ga").hidden = !a; $("#rx-gb").hidden = a; $("#rx-ca").hidden = !a; $("#rx-cb").hidden = a; $("#rx-extra").hidden = !a;
    $("#rx-rel").hidden = a || S.rx !== "B4"; $("#rx-en").hidden = a || S.rx !== "B4";
  }
  function drawA(){
    var svg = $("#rx-sa"), sel = S.aSel, h, aria;
    if (sel.k === "bond") {
      var B = BONDS[sel.id];
      h = bondSVG(sel.id, BN[sel.id]);
      aria = BN[sel.id] + " bond. " + (B.p === 0.5 ? "Identical pull, so the electron pair sits in the middle and there are no partial charges." : "The electron pair sits closer to " + ENAME[B.p < 0.5 ? B.a : B.b] + ", which is partly negative (δ⁻); " + ENAME[B.p < 0.5 ? B.b : B.a] + " is partly positive (δ⁺).") + " Electronegativity: " + B.a + " " + MV.num(EN[B.a], 1) + ", " + B.b + " " + MV.num(EN[B.b], 1) + ".";
    } else {
      var id = sel.id, I = molInfo(id), mn = MOLN[id];
      var list, brk;
      if (ladAll) {
        var ONE = [["ch4", -4], ["ch3oh", -2], ["hcho", 0], ["hcooh", 2], ["co2", 4]];
        list = ONE.map(function(o, i){ return { lab:MOLN[o[0]][1], v:o[1], a:sm(ladT * 1.6 - i * 0.15), hl:o[0] === "ch4" || o[0] === "ch3oh" }; });
        brk = [{ v:-4, n:"8 e⁻", a:sm(ladT * 2 - 1.1) }, { v:-2, n:"6 e⁻", a:sm(ladT * 2 - 1.2) }];
      } else {
        list = [{ lab:"CO₂", v:4, a:1, hl:id === "co2" }];
        if (id !== "co2") list.push({ lab:mn[1], v:I.avg, a:1, hl:true });
        brk = id === "co2" ? [] : [{ v:I.avg, n:sc(4 - I.avg).replace("+", "") + " e⁻" + (I.nC > 1 ? " per C" : ""), a:1 }];
      }
      h = molSVG(id, mn[1] + " (" + mn[2] + ")") + ladderSVG(list, brk);
      aria = mn[1] + ", " + mn[2] + ". " + (I.nC === 1 ? "Carbon score " + sc(I.avg) + "." : "Carbon scores " + Object.keys(I.s).map(function(k){ return sc(I.s[k]); }).join(", ") + "; average " + sc(I.avg) + " per carbon.") + (ladAll ? " The ladder shows CH₄ at −4, CH₃OH at −2, HCHO at 0, HCOOH at +2 and CO₂ at +4: CH₄ has 8 electrons to give on the way to CO₂, CH₃OH 6." : " On the carbon-score ladder it sits " + (id === "co2" ? "at the top, +4: fully oxidized." : MV.num(Math.round((4 - I.avg) * 100) / 100) + " below CO₂ (+4)."));
    }
    svg.innerHTML = h; svg.setAttribute("aria-label", aria);
  }
  function drawB(){
    var R = rxObj(), svg = $("#rx-sb"), A = RXA[R.id], sh = !!S.rev[R.id];
    var eq = MV.plain(R.eq).split(" → ");
    $("#rx-eq").innerHTML = '<span class="rx-eqa">' + eq[0] + '</span> <span class="rx-eqb">→ ' + eq.slice(1).join(" → ") + "</span>";
    svg.innerHTML = flowSVG(R.id, flowOn ? flowT : 0, { shown:sh && flowOn });
    var rd = MV.ans(R);
    svg.setAttribute("aria-label", "Reaction " + R.id + ": " + MV.plain(R.eq) + ". " + (flowOn && flowT >= 0.999 ? A.e + " electron" + (A.e > 1 ? "s" : "") + " moved from the reducing agent, " + rd.ra + ", to the oxidizing agent, " + rd.oa + "." : "Press Show electron flow to watch the electrons move."));
    if (R.id === "B4") drawE();
  }
  function drawE(){
    var svg = $("#rx-se"); if (!svg) return;
    svg.innerHTML = energySVG(S.rel, relT, C.release.dg);
    svg.setAttribute("aria-label", S.rel === "fire" ? "Energy diagram: glucose and O₂ drop to CO₂ and H₂O in one big step; a flame shows the energy leaving as heat and light. " + C.release.dg + "." : "Energy diagram: a staircase of six small drops from glucose and O₂ to CO₂ and H₂O, with ATP captured beside three of the drops. " + C.release.dg + ".");
  }
  function paintCap(){
    var c = "";
    if (S.mode === "A") {
      if (S.aSel.k === "bond") { var B = BONDS[S.aSel.id]; c = B.p === 0.5 ? "Identical atoms pull equally, so the pair stays in the middle." : "The atom with higher electronegativity wins the tug: the pair sits nearer to it."; }
      else c = ladAll ? "CH₄ is 8 steps from CO₂; CH₃OH is only 6." : "Each carbon’s score is in a circle. The lower the score, the more electrons it can still give to O₂ on the way to CO₂ (+4).";
    } else {
      c = S.rx === "B4" ? (S.rel === "fire" ? C.release.fireNote : C.release.stepNote) : (flowOn && flowT >= 0.999 ? "Follow the violet electrons: they leave the reducing agent and end on the oxidizing agent." : "Tag the reactants, then check, or press Show electron flow.");
      if (S.rx === "B4" && flowOn && flowT >= 0.999) c = "Glucose’s electrons end on O₂. " + c;
    }
    $("#rx-cap").textContent = c;
  }
  function row(l, v, cls){ return '<div' + (cls ? ' class="' + cls + '"' : "") + "><dt>" + l + "</dt><dd>" + v + "</dd></div>"; }
  function paintRead(){
    var h = "";
    if (S.mode === "A") {
      if (S.aSel.k === "bond") {
        var B = BONDS[S.aSel.id], d = Math.abs(EN[B.a] - EN[B.b]);
        h = row("Bond", BN[S.aSel.id]) + row("Electronegativity", B.a + " " + MV.num(EN[B.a], 1) + " · " + B.b + " " + MV.num(EN[B.b], 1) + " (difference " + MV.num(Math.round(d * 10) / 10, 1) + ")") +
          row("Shared pair", B.p === 0.5 ? "in the middle: shared equally" : B.slight ? "a little toward " + ENAME[B.p < 0.5 ? B.a : B.b] + " (model)" : "70% of the way toward oxygen (model)") +
          row("Partial charges", B.p === 0.5 ? "none" : "δ⁻ on " + (B.p < 0.5 ? B.a : B.b) + ", δ⁺ on " + (B.p < 0.5 ? B.b : B.a) + (B.slight ? " (slight)" : ""));
      } else {
        var id = S.aSel.id, I = molInfo(id), mn = MOLN[id], c = I.cnt, parts = [];
        if (c.ch) parts.push(c.ch + " C–H (−1" + (c.ch > 1 ? " each" : "") + ")"); if (c.co) parts.push(c.co + " C–O (+1" + (c.co > 1 ? " each" : "") + ")"); if (c.cdo) parts.push(c.cdo + " C=O (+2" + (c.cdo > 1 ? " each" : "") + ")");
        var sline = I.nC === 1 ? "<strong>" + sc(I.avg) + "</strong>" : "per carbon: " + Object.keys(I.s).map(function(k){ return sc(I.s[k]); }).join(", ") + "; average <strong>" + sc(I.avg) + "</strong> (total " + sc(I.tot) + " over " + I.nC + " carbons)";
        var giveC = Math.round((4 - I.avg) * 100) / 100;
        h = row("Molecule", mn[1] + " (" + mn[2] + ")") + row("Carbon score", sline) +
          (I.nC === 1 ? row("Bonds counted", parts.join(", ") || "none") : "") +
          row("Carbon score change", id === "co2" ? "CO₂ is already at +4: fully oxidized, 0 electrons left to give" : mn[1] + " " + sc(I.avg) + (I.nC > 1 ? " (average)" : "") + " → CO₂ +4: " + MV.num(giveC) + " electron" + (giveC === 1 ? "" : "s") + " lost per carbon" + (I.nC > 1 ? " (" + MV.num(Math.round(I.give)) + " in all)" : ""));
      }
    } else {
      var R = rxObj(), sh = !!S.rev[R.id] && !(flowOn && flowT < 0.999), rd = MV.ans(R), q = '<span class="muted">?</span>';
      h = row("Reaction", '<span class="bio-chem-w">' + R.eq + "</span>") +
        row("Oxidized", sh ? rd.ox + '<span class="rx-narrow"> · reducing agent</span>' : q) +
        row("Reduced", sh ? rd.red + '<span class="rx-narrow"> · oxidizing agent</span>' : q) +
        row("Reducing agent", sh ? rd.ra : q, "rx-wide") + row("Oxidizing agent", sh ? rd.oa : q, "rx-wide") +
        row("Electrons moved (per reaction as written)", sh ? rd.e : q);
      if (!sh) h += '<p class="tiny muted rx-rnote">Shown after a correct check or Show electron flow.</p>';
    }
    if (h !== readSig) { readSig = h; $("#rx-read").innerHTML = h; }
  }
  function paintAll(){ if (S.mode === "A") drawA(); else drawB(); paintRead(); paintCap(); }
  // challenge 2: ordering (N5 Move up / Move down)
  var NAMES = {}; C.mols.forEach(function(m){ NAMES[m[0]] = m[1] + ' <span class="muted">(' + m[2] + ")</span>"; });
  function paintOrd(){
    var host3 = $("#rx-ord");
    MV.keepFocus(host3, function(){
      host3.innerHTML = S.order.map(function(id, pos){
        var isSel = ordSel === pos;
        return '<li><button type="button" class="ostep" aria-pressed="' + isSel + '" data-k="od' + id + '" data-pos="' + pos + '"><span class="sn">' + (pos + 1) + ".</span><span>" + NAMES[id] + "</span></button>" +
          (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="odup"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="oddn"' + (pos === S.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
      }).join("");
    });
  }
  $("#rx-ord").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pos != null) { var p = +b.dataset.pos; ordSel = ordSel === p ? null : p; paintOrd(); return; }
    if (b.dataset.mv) {
      var i = ordSel, j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= S.order.length) return;
      var t = S.order[i]; S.order[i] = S.order[j]; S.order[j] = t; ordSel = j; S.moved = true; api.save(); paintOrd(); MV.changed();
      var nb = $('#rx-ord [data-mv="' + b.dataset.mv + '"]'); if (nb && !nb.disabled) nb.focus(); else { var sb = $('#rx-ord [data-pos="' + j + '"]'); if (sb) sb.focus(); }
    }
  });
  // challenge 3: fuel calculator boxes
  var FMAP = { ge:"ge", go:"go", pe:"pe", po:"po" };
  $("#rx-extra").addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.fu; if (!FMAP[k]) return; S.tc3[k] = e.target.value; api.save(); MV.changed(); });
  Object.keys(FMAP).forEach(function(k){ var el = $('[data-fu="' + k + '"]', host); if (el) el.value = S.tc3[k] || ""; });

  syncMode(); paintChips(); paintCards(); paintOrd(); flowOn = !!S.rev[S.rx]; paintAll();
  if (S.rx === "B4") drawE();

  function num1(raw){ var s = String(raw == null ? "" : raw).trim(); if (!s) return null; var v = MV.parseNum(s); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  var WANT = ["ch4", "ch3oh", "hcho", "hcooh", "co2"];
  function chal(id, opt){
    var live = opt && opt.live;
    if (id === "tc1") {
      var T = S.tags.B3 || {}, a = T.ch4 || {}, o = T.o2 || {};
      var ok = a.ch === "ox" && a.ag === "ra" && o.ch === "red" && o.ag === "oa";
      if (ok || live) return { ok:ok };
      if (!a.ch && !o.ch) return { ok:false, msg:"Choose reaction B3 in Mode B (Who loses, who gains?), then tag both reactants." };
      if (o.ch === "ox") return { ok:false, msg:"O₂ gains electrons (and H) to become H₂O: it is reduced." };
      if (a.ag === "oa" && o.ag === "ra") return { ok:false, msg:"The reducing agent <em>gives</em> electrons, so it’s the one that’s oxidized: CH₄." };
      if (a.ch === "ox" && o.ch === "red" && (!a.ag || !o.ag)) return { ok:false, msg:"The changes are right. Now give both reactants their agent role." };
      if (a.ch === "ox" && o.ch === "red") return { ok:false, msg:"The changes are right. The reducing agent <em>gives</em> electrons (it is oxidized); the oxidizing agent <em>takes</em> them (it is reduced)." };
      return { ok:false, msg:"Not yet. Follow CH₄’s hydrogens: which reactant loses them, with their electrons, and which gains them?" };
    }
    if (id === "tc2") {
      var ord = S.order, good = WANT.every(function(k, i){ return ord[i] === k; });
      if (good || live) return { ok:good };
      if (!S.moved) return { ok:false, msg:"Use the list under Mode A: tap a molecule, then Move up or Move down." };
      if (ord[0] === "co2") return { ok:false, msg:"CO₂ has no C–H bonds at all: it’s fully oxidized." };
      if (ord.indexOf("hcooh") < ord.indexOf("hcho")) return { ok:false, msg:"Count bonds to O: HCOOH has three (C=O counts two), HCHO only two." };
      return { ok:false, msg:"Not this order yet. Tap each molecule chip to see its carbon score, then order them from −4 to +4." };
    }
    if (id === "tc3") {
      var v = { ge:num1(S.tc3.ge), go:num1(S.tc3.go), pe:num1(S.tc3.pe), po:num1(S.tc3.po) }, pick = S.tc3.pick;
      var near = function(x, y){ return x != null && Math.abs(x - y) < 1e-6; };
      var nums = near(v.ge, 24) && near(v.go, 6) && near(v.pe, 92) && near(v.po, 23);
      if (nums && pick === "fat") return { ok:true };
      if (live) return { ok:false };
      if (v.ge == null || v.go == null || v.pe == null || v.po == null || !pick) return { ok:false, msg:"Fill in all four boxes in the fuel calculator (under Mode A) and choose which gives more electrons per carbon." };
      if (near(v.go, 6) && near(v.po, 16)) return { ok:false, msg:"That’s one O₂ per carbon. Use 4<i>a</i> + <i>b</i> − 2<i>c</i> = 64 + 32 − 4." };
      if (pick === "sugar") return { ok:false, msg:"92 ÷ 16 = 5.75 per carbon, more than glucose’s 24 ÷ 6 = 4." };
      var bad = [];
      if (!near(v.ge, 24)) bad.push("glucose’s electrons"); if (!near(v.go, 6)) bad.push("glucose’s O₂");
      if (!near(v.pe, 92)) bad.push("palmitic acid’s electrons"); if (!near(v.po, 23)) bad.push("palmitic acid’s O₂");
      return { ok:false, msg:"Check " + bad.join(", ") + ". Electrons = 4<i>a</i> + <i>b</i> − 2<i>c</i>; O₂ = electrons ÷ 4." };
    }
    return { ok:false };
  }
  EXP = { show:function(on){ shown = on; } };   // animations run to the end even when hidden, so prediction callbacks always fire
  return {
    predict:{
      start:function(p){
        var st = p.start; stopAnims(); setBusy(true);
        if (st.mode === "A") { S.mode = "A"; S.aSel = { k:"mol", id:st.mol }; ladAll = false; ladT = 1; paintChips(); }
        else {
          S.mode = "B"; S.rx = st.rx; rxR.set(st.rx); flowOn = false; flowT = 0; tagMsg = null;
          if (st.tagNa) { var T = tagsOf("B1"); T.na = { ch:"ox", ag:(T.na && T.na.ag) || "" }; }
          paintCards(); paintTagFb();
        }
        api.save(); syncMode(); paintAll(); $("#rx-fs").disabled = true; MV.changed();
      },
      run:function(p, done){
        var st = p.start;
        var fin = function(){ setBusy(false); paintAll(); MV.changed(); done(); };
        if (st.mode === "A") {
          ladAll = true; ladT = 0;
          anim = MV.tween({ dur:2600, ease:lin, step:function(t){ ladT = t; drawA(); }, done:function(){ anim = null; ladT = 1; drawA(); paintCap(); fin(); } });
          return;
        }
        S.rev[st.rx] = true; api.save();
        playFlow(st.rx === "B4" ? 3600 : 2800, fin);
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Four reaction types (N13 step-through stations; a tiny keyframe stage) ----------
// Each object: k (pill | hp | e | atom | ring6 | ring5 | text), per-step frames f:[[x, y, opacity] × 4], optional label l (or per-step labels).
// Lines join two objects: {k:"line", a, b, o:[opacity × 4]}.
function F(a, b, c, d){ return [a, b, c, d]; }
var STN = {
  redox:[
    { id:"sub", k:"pill", l:"malate", tok:"--bio-carbon", w:100, f:F([112, 140, 1], [112, 140, 1], [112, 140, 1], [112, 140, 1]) },
    { id:"ha", k:"atom", el:"H", f:F([94, 104, 1], [170, 82, 0], [170, 82, 0], [170, 82, 0]) },
    { id:"hb", k:"atom", el:"H", f:F([130, 104, 1], [204, 82, 0], [204, 82, 0], [204, 82, 0]) },
    { id:"l1", k:"line", a:"sub", b:"ha", o:[1, 0, 0, 0] }, { id:"l2", k:"line", a:"sub", b:"hb", o:[1, 0, 0, 0] },
    { id:"p1", k:"hp", f:F([94, 106, 0], [196, 70, 1], [356, 124, 0], [356, 124, 0]) },
    { id:"p2", k:"hp", f:F([130, 106, 0], [232, 70, 1], [300, 190, 1], [300, 190, 1]) },
    { id:"e1", k:"e", f:F([94, 106, 0], [204, 100, 1], [350, 140, 0], [350, 140, 0]) },
    { id:"e2", k:"e", f:F([130, 106, 0], [226, 100, 1], [370, 140, 0], [370, 140, 0]) },
    { id:"nad", k:"pill", l:"NAD⁺", tok:"--ink-2", w:80, f:F([360, 140, 1], [360, 140, 1], [360, 140, 0], [360, 140, 0]) },
    { id:"nadh", k:"pill", l:"NADH", tok:"--bio-nadh", w:80, f:F([360, 140, 0], [360, 140, 0], [360, 140, 1], [360, 140, 1]) },
    { id:"tf", k:"text", l:"H⁺ released", cls:"rx-sub", anchor:"start", f:F([316, 195, 0], [316, 195, 0], [316, 195, 1], [316, 195, 1]) },
    { id:"to", k:"text", l:"oxidized", f:F([112, 176, 0], [112, 176, 0], [112, 176, 0], [112, 176, 1]), mid:true },
    { id:"tr", k:"text", l:"reduced", f:F([360, 176, 0], [360, 176, 0], [360, 176, 0], [360, 176, 1]), mid:true },
    { id:"t2h", k:"text", l:"2 H → 2 H⁺ + 2 e⁻", cls:"rx-sub", f:F([214, 40, 0], [214, 40, 1], [214, 40, 0], [214, 40, 0]), mid:true }
  ],
  hydro:[
    { id:"g", k:"ring6", f:F([186, 140, 1], [186, 140, 1], [128, 150, 1], [128, 150, 1]) },
    { id:"fr", k:"ring5", f:F([310, 140, 1], [310, 140, 1], [372, 150, 1], [372, 150, 1]) },
    { id:"ob", k:"atom", el:"O", f:F([248, 140, 1], [248, 140, 1], [320, 150, 1], [320, 150, 1]) },
    { id:"lg", k:"line", a:"g", b:"ob", o:[1, 1, 0, 0], ra:30 }, { id:"lf", k:"line", a:"ob", b:"fr", o:[1, 1, 1, 1], rb:26 },
    { id:"w", k:"pill", l:"H₂O", tok:"--bio-o2", w:60, f:F([248, 54, 1], [248, 70, 0], [248, 70, 0], [248, 70, 0]) },
    { id:"lh", k:"line", a:"wh", b:"ob", o:[0, 0, 1, 1], ra:13, rb:13 },
    { id:"wh", k:"atom", el:"H", cls:"rx-aW", f:F([248, 54, 0], [220, 80, 1], [320, 116, 1], [320, 116, 1]) },
    { id:"woh", k:"pill", l:"OH", tok:"--bio-o2", w:46, h:26, f:F([248, 54, 0], [280, 80, 1], [172, 110, 1], [172, 110, 1]) },
    { id:"ts", k:"text", l:"sucrose", f:F([248, 200, 1], [248, 200, 1], [248, 200, 0], [248, 200, 0]), mid:true },
    { id:"tg", k:"text", l:"glucose", f:F([128, 204, 0], [128, 204, 0], [128, 204, 0], [128, 204, 1]), mid:true },
    { id:"tfr", k:"text", l:"fructose", f:F([372, 204, 0], [372, 204, 0], [372, 204, 0], [372, 204, 1]), mid:true },
    { id:"tin", k:"text", l:"water in", cls:"rx-sub", f:F([248, 26, 1], [248, 26, 1], [248, 26, 0], [248, 26, 0]), mid:true }
  ],
  cond:[
    { id:"ga", k:"ring6", f:F([120, 140, 1], [120, 140, 1], [186, 140, 1], [186, 140, 1]) },
    { id:"gb", k:"ring6", f:F([360, 140, 1], [360, 140, 1], [302, 140, 1], [302, 140, 1]) },
    { id:"oh", k:"pill", l:"OH", tok:"--bio-o2", w:46, h:26, f:F([180, 140, 1], [400, 64, 0], [400, 64, 0], [400, 64, 0]) },
    { id:"hh", k:"atom", el:"H", cls:"rx-aW", f:F([312, 140, 1], [410, 64, 0], [410, 64, 0], [410, 64, 0]) },
    { id:"w", k:"pill", l:"H₂O", tok:"--bio-o2", w:60, f:F([404, 64, 0], [404, 64, 1], [404, 64, 1], [404, 64, 1]) },
    { id:"ob", k:"atom", el:"O", f:F([244, 140, 0], [244, 140, 0], [244, 140, 1], [244, 140, 1]) },
    { id:"la", k:"line", a:"ga", b:"ob", o:[0, 0, 1, 1], ra:28 }, { id:"lb", k:"line", a:"ob", b:"gb", o:[0, 0, 1, 1], rb:28 },
    { id:"tga", k:"text", l:"glucose", f:F([120, 196, 1], [120, 196, 1], [186, 196, 0], [186, 196, 0]), mid:true },
    { id:"tgb", k:"text", l:"glucose", f:F([360, 196, 1], [360, 196, 1], [302, 196, 0], [302, 196, 0]), mid:true },
    { id:"tm", k:"text", l:"maltose", f:F([244, 196, 0], [244, 196, 0], [244, 196, 1], [244, 196, 1]), mid:true },
    { id:"tw", k:"text", l:"water out", cls:"rx-sub", f:F([404, 36, 0], [404, 36, 1], [404, 36, 1], [404, 36, 1]), mid:true }
  ],
  neut:[
    { id:"tb", k:"text", l:"blood", cls:"rx-sub", anchor:"start", f:F([20, 34, 1], [20, 34, 1], [20, 34, 0.4], [20, 34, 0.4]) },
    { id:"hp", k:"hp", r:12, f:F([116, 70, 1], [214, 70, 0], [214, 70, 0], [214, 70, 0]) },
    { id:"thp", k:"text", l:"H⁺", f:F([116, 101, 1], [214, 101, 0], [214, 101, 0], [214, 101, 0]), mid:true },
    { id:"bi", k:"pill", l:"HCO₃⁻", tok:"--ink", w:84, f:F([274, 70, 1], [274, 70, 0], [274, 70, 0], [274, 70, 0]) },
    { id:"hc", k:"pill", l:"H₂CO₃", tok:"--ink", w:84, f:F([274, 70, 0], [274, 70, 1], [274, 70, 0.4], [274, 70, 0.4]) },
    { id:"tf", k:"text", l:"flask", cls:"rx-sub", anchor:"start", f:F([20, 126, 0], [20, 126, 0], [20, 126, 1], [20, 126, 1]) },
    { id:"hp2", k:"hp", r:12, f:F([102, 164, 0], [102, 164, 0], [102, 164, 1], [228, 164, 0]) },
    { id:"cl", k:"pill", l:"Cl⁻", tok:"--ink", w:50, f:F([150, 164, 0], [150, 164, 0], [150, 164, 1], [412, 164, 1]) },
    { id:"na", k:"pill", l:"Na⁺", tok:"--ink", w:50, f:F([314, 164, 0], [314, 164, 0], [314, 164, 1], [358, 164, 1]) },
    { id:"oh", k:"pill", l:"OH⁻", tok:"--ink", w:56, f:F([372, 164, 0], [372, 164, 0], [372, 164, 1], [252, 164, 0]) },
    { id:"w", k:"pill", l:"H₂O", tok:"--bio-o2", w:60, f:F([240, 164, 0], [240, 164, 0], [240, 164, 0], [240, 164, 1]) },
    { id:"thcl", k:"text", l:"HCl", f:F([126, 202, 0], [126, 202, 0], [126, 202, 1], [126, 202, 0]), mid:true },
    { id:"tnaoh", k:"text", l:"NaOH", f:F([343, 202, 0], [343, 202, 0], [343, 202, 1], [343, 202, 0]), mid:true },
    { id:"tsalt", k:"text", l:"NaCl (a salt)", f:F([385, 202, 0], [385, 202, 0], [385, 202, 0], [385, 202, 1]), mid:true }
  ]
};
function ringPath(x, y, r, n){ var d = ""; for (var i = 0; i < n; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; d += (i ? "L" : "M") + f1(x + r * Math.cos(a)) + " " + f1(y + r * Math.sin(a)); } return d + "Z"; }
function stState(o, s, t){
  var A = o.f[Math.max(0, s - 1)], B = o.f[s], u = s === 0 ? 1 : sm(t);
  return [lerp(A[0], B[0], u), lerp(A[1], B[1], u), lerp(A[2], B[2], u)];
}
function stationSVG(id, s, t){
  var objs = STN[id], pos = {}, h = "", lines = "";
  objs.forEach(function(o){ if (o.k !== "line") pos[o.id] = stState(o, s, t); });
  objs.forEach(function(o){
    if (o.k === "line") {
      var a = o.o[Math.max(0, s - 1)], b = o.o[s], al = s === 0 ? b : lerp(a, b, sm(t)); if (al <= 0.01) return;
      var P = pos[o.a], Q = pos[o.b], dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy) || 1, ra = o.ra || 14, rb = o.rb || 14;
      lines += sv("line", { x1:P[0] + dx / L * ra, y1:P[1] + dy / L * ra, x2:Q[0] - dx / L * rb, y2:Q[1] - dy / L * rb, "class":"rx-bond", opacity:al < 0.99 ? f1(al * 100) / 100 : null });
      return;
    }
    var p = pos[o.id]; if (p[2] <= 0.01) return;
    if (o.k === "pill") h += pill(p[0], p[1], o.l, o.tok, o.w, o.h || 30, p[2]);
    else if (o.k === "hp") h += hDot(p[0], p[1], o.r || 10, p[2]);
    else if (o.k === "e") h += eDot(p[0], p[1], 6, p[2]);
    else if (o.k === "atom") h += "<g" + (o.cls ? ' class="' + o.cls + '"' : "") + ">" + atomSVG(p[0], p[1], o.el, 13, p[2], 14) + "</g>";
    else if (o.k === "ring6" || o.k === "ring5") h += "<g" + op(p[2]) + ">" + sv("path", { d:ringPath(p[0], p[1], o.k === "ring6" ? 30 : 27, o.k === "ring6" ? 6 : 5), "class":"rx-ring" }) + "</g>";
    else if (o.k === "text") h += "<g" + op(p[2]) + ">" + txt(p[0], p[1], o.l, o.cls || "rx-lab", o.anchor || "middle") + "</g>";
  });
  return lines + h;
}
var P3 = null;
function part3(host, api){
  var C = api.content, S = api.S;
  S.seen = S.seen || {}; if (!S.st) S.st = "redox";
  var anim = null, cur = 0, stepIx = 0;
  host.innerHTML = '<p class="how">' + C.how + '</p><div class="rx-row" id="rx-stp"></div>' +
    '<div class="rx-st"><p class="rx-st-eq bio-chem" id="rx-st-eq"></p><div class="rx-stage"><svg id="rx-st-svg" viewBox="0 0 480 220" role="img" focusable="false"></svg></div>' +
    '<p class="rx-cap" id="rx-st-cap" aria-live="polite"></p><div id="rx-st-pl"></div>' +
    '<details class="alg rx-zoom"><summary>Zoom to the molecules</summary><p id="rx-zoom"></p></details></div>' +
    '<div class="rx-key" id="rx-key"></div>';
  function stOpts(){ return C.stations.map(function(s){ return { id:s.id, t:(S.seen[s.id] ? "✓ " : "") + s.name }; }); }
  var pick = radios($("#rx-stp"), { label:"Station", cls:"chips", options:stOpts(), value:S.st, onChange:function(v){ S.st = v; api.save(); build(); } });
  function stn(){ return byId(C.stations, S.st); }
  function draw(s, t){
    var st = stn(), svg = $("#rx-st-svg");
    svg.innerHTML = stationSVG(st.id, s, t);
    svg.setAttribute("aria-label", st.name + " station, step " + (s + 1) + " of 4: " + MV.plain(st.steps[s]));
  }
  function build(){
    if (anim) { anim(); anim = null; }
    var st = stn(), old = $("#rx-st-pl"), fresh = document.createElement("div");
    fresh.id = "rx-st-pl"; old.parentNode.replaceChild(fresh, old);
    $("#rx-st-eq").textContent = MV.plain(st.eq);
    $("#rx-zoom").innerHTML = st.zoom;
    cur = 0;
    MV.player(fresh, { count:4, interval:2600, label:function(i){ return "Step " + (i + 1) + " of 4"; }, render:function(i){
      if (anim) { anim(); anim = null; }
      var from = cur; cur = i; stepIx = i;
      $("#rx-st-cap").innerHTML = st.steps[i];
      if (i === from + 1) anim = MV.tween({ dur:1300, ease:lin, step:function(t){ draw(i, t); }, done:function(){ anim = null; draw(i, 1); } });
      else draw(i, 1);
      if (i === 3 && !S.seen[st.id]) { S.seen[st.id] = true; api.save(); pick.setOptions(stOpts()); paintKey(); }
    } });
  }
  function paintKey(){
    var n = C.stations.filter(function(s){ return S.seen[s.id]; }).length, k = $("#rx-key");
    if (n < 4) { k.innerHTML = '<h4>' + C.keyTitle + '</h4><p class="tiny muted">' + C.keyLocked + " (" + n + " of 4 done)</p>"; return; }
    k.innerHTML = "<h4>" + C.keyTitle + "</h4>" + MV.tableHTML({ head:C.keyHead, rows:C.keyRows, caption:C.keyTitle });
  }
  build(); paintKey();
  P3 = { show:function(on){ if (!on && anim) { anim(); anim = null; draw(stepIx, 1); } } };
  return {};
}

// ---------- Practice 2: carbon scores and fuel value (N4 number entry, N7 choices, R7 boxes + basis chip; from SBI4U 05 accounting) ----------
function fuel(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", vals:{}, basis:"1", choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); }
  host.innerHTML = '<p class="rx-arule">' + a.rule + "</p>" + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function parseVal(raw){ var s = String(raw == null ? "" : raw).trim().replace(/\s/g, ""); var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function headHTML(it, i){ return '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>"; }
  function helpHTML(it, x){ return it.hints ? MV.hintBtn(it.id + "hint", x.hint) : ""; }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
    else if (it.kind === "r7") {
      h = headHTML(it, i) + '<div class="rx-row" data-basis="1"></div><div class="rx-r7">' + it.boxes.map(function(b){
        return '<div class="numrow"><label for="li-' + it.id + b[0] + '">' + b[1] + ':</label><input class="numin short" id="li-' + it.id + b[0] + '" data-lin="' + it.id + '" data-bx="' + b[0] + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.vals[b[0]] || "") + '"' + (x.solved ? " disabled" : "") + "></div>";
      }).join("") + "</div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + helpHTML(it, x) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    } else {
      h = headHTML(it, i) + '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin short" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="' + (it.keypad || "decimal") + '" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? '<span class="rx-unit">' + it.unit + "</span>" : "") + "</div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + helpHTML(it, x) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    if (it.kind === "r7") {
      var bh = $("[data-basis]", box);
      radios(bh, { label:"Count", cls:"chips", aria:"Count per 1 or per 2 glycerol", options:it.basis.map(function(b){ return { id:b[0], t:b[1], dis:x.solved }; }), value:x.basis, onChange:function(v){ x.basis = v; msgs[it.id] = null; api.save(); } });
    }
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; var x = ist(id); if (e.target.dataset.bx) x.vals[e.target.dataset.bx] = e.target.value; else x.val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = byId(a.items, box.dataset.li), x = ist(it.id);
    if (b.dataset.rg) return;
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (it.kind === "mc" && b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.act === "check") {
      var ok = false;
      if (it.kind === "mc") { if (x.choice == null) return; x.checked = true; ok = MV.ok(it.options[x.choice]); }
      else if (it.kind === "r7") {
        var want = MV.ans(it)[x.basis], got = {}, blank = false;
        it.boxes.forEach(function(bx){ var v = parseVal(x.vals[bx[0]]); if (v == null) blank = true; got[bx[0]] = v; });
        if (blank) { msgs[it.id] = "Fill in all three boxes with numbers, such as 3.5."; paintItem(it); return; }
        ok = it.boxes.every(function(bx){ return Math.abs(got[bx[0]] - want[bx[0]]) < 1e-6; });
        msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + it.fb + " Try again.";
      } else {
        var v = parseVal(x.val), an = MV.ans(it);
        if (v == null) { msgs[it.id] = "Enter a number, such as 12 or −3."; paintItem(it); return; }
        ok = Math.abs(v - an) < 1e-9;
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return Math.abs(v - w.match) < 1e-9; })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general || "Check your work.") + " Try again."; }
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

// ---------- Performance task: Electron drop (donor and acceptor chips; a live pull-score staircase with the drop labelled) ----------
var task = (function(){
  var api = null, T = null;
  function find(list, id){ return list.filter(function(x){ return x[0] === id; })[0]; }
  function get(){ var s = api ? api.S : {}; return { d:s.d || "", a:s.a || "" }; }
  function info(d){ var D = find(T.donors, d.d), A = find(T.acceptors, d.a); return { D:D, A:A, drop:D && A ? A[2] - D[2] : null }; }
  function draw(){
    if (!api) return;
    var d = get(), I = info(d), svg = $("#rx-tsv"), Y = function(v){ return 46 + v * 23; }, h = "";
    h += txt(180, 18, "Electron pull score (model units)", "rx-lab", "middle") + txt(180, 33, "stronger pull is drawn lower: electrons fall downhill", "rx-sub", "middle");
    T.levels.forEach(function(L){
      var on = (I.D && I.D[2] === L[0]) || (I.A && I.A[2] === L[0]), y = Y(L[0]);
      h += sv("line", { x1:150, y1:y, x2:300, y2:y, "class":on ? "rx-lvl on" : "rx-lvl" }) + txt(142, y + 4.5, MV.plain(L[1]), on ? "rx-lab" : "rx-sub", "end") + txt(308, y + 4.5, String(L[0]), on ? "rx-lab" : "rx-sub", "start");
    });
    if (I.D) h += eDot(176, Y(I.D[2]) - 8, 6) + txt(186, Y(I.D[2]) - 5, "donor", "rx-sub", "start");
    if (I.A) h += txt(262, Y(I.A[2]) - 8, "acceptor", "rx-sub", "middle");
    if (I.D && I.A) {
      var y1 = Y(I.D[2]), y2 = Y(I.A[2]);
      if (I.drop > 0) h += arrow(226, y1 + 4, 226, y2 - 4, "rx-dropa", 7) + txt(234, (y1 + y2) / 2 + 4, "drop " + I.drop, "rx-lab", "start");
      else if (I.drop === 0) h += txt(226, y1 + 18, "no drop", "rx-lab", "middle");
      else h += arrow(226, y1 - 4, 226, y2 + 4, "rx-upa", 7) + txt(234, (y1 + y2) / 2 + 4, "uphill " + (-I.drop), "rx-lab", "start");
    }
    svg.innerHTML = h;
    var say = I.D && I.A ? MV.plain(I.D[1]) + " (" + I.D[2] + ") → " + MV.plain(I.A[1]) + " (" + I.A[2] + "): " + (I.drop > 0 ? "drop " + I.drop + " units." : I.drop === 0 ? "no drop." : "uphill by " + (-I.drop) + " units.") : "Choose a donor and an acceptor.";
    svg.setAttribute("aria-label", "Pull-score staircase from glucose at 0 to O₂ at 10. " + say);
    $("#rx-tsay").textContent = say;
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      inp.innerHTML = '<div class="rx-tin"><div class="rx-row" id="rx-td"></div><div class="rx-row" id="rx-ta"></div></div>';
      pv.innerHTML = '<div class="rx-stage"><svg id="rx-tsv" viewBox="0 0 360 290" role="img" focusable="false"></svg></div><p class="rx-cap" id="rx-tsay" aria-live="polite"></p>';
      radios($("#rx-td"), { label:"Donor", cls:"chips", aria:"Electron donor", options:T.donors.map(function(x){ return { id:x[0], t:x[1] }; }), value:get().d, onChange:function(v){ api.S.d = v; api.save(); draw(); api.update(); } });
      radios($("#rx-ta"), { label:"Acceptor", cls:"chips", aria:"Electron acceptor", options:T.acceptors.map(function(x){ return { id:x[0], t:x[1] }; }), value:get().a, onChange:function(v){ api.S.a = v; api.save(); draw(); api.update(); } });
      draw();
    },
    read:function(){ return get(); },
    valid:function(d){ return d.d && d.a ? true : "Choose a donor and an acceptor first."; },
    checks:function(d){ var I = info(d); if (!I.D || !I.A) return [false, false, false, false]; return [I.drop > 0, I.drop >= 3, d.a !== "o2", d.d !== "glu"]; },
    key:function(d){ return d.d + ">" + d.a; },
    label:function(k){ var p = k.split(">"), D = find(T.donors, p[0]), A = find(T.acceptors, p[1]); return D && A ? D[1] + " → " + A[1] + " (drop " + (A[2] - D[2]) + ")" : k; },
    text:function(k){ var p = k.split(">"), D = find(T.donors, p[0]), A = find(T.acceptors, p[1]); return D && A ? MV.plain(D[1]) + " → " + MV.plain(A[1]) + " (drop " + (A[2] - D[2]) + ")" : k; }
  };
})();

// ---------- hero: glucose's 12 H atoms leave in pairs (2 H⁺ + 2 e⁻ each); 24 electrons stream to six O₂, which become six H₂O;
// the carbons, bonded only to oxygen, become six CO₂; a label rises. Also the reaction's "oxidized" and "reduced" arcs. ----------
var HG = (function(){
  var cx = 108, cy = 128, R = 44, C = [], i;
  for (i = 0; i < 6; i++) { var a = -Math.PI / 2 + i * Math.PI / 3, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux;
    C.push({ x:cx + R * ux, y:cy + R * uy, ox:cx + (R + 30) * ux, oy:cy + (R + 30) * uy, h:[[cx + (R + 22) * ux + px * 21, cy + (R + 22) * uy + py * 21], [cx + (R + 22) * ux - px * 21, cy + (R + 22) * uy - py * 21]], ux:ux, uy:uy }); }
  var O2 = []; for (i = 0; i < 6; i++) O2.push([294 + (i % 2) * 62, 70 + Math.floor(i / 2) * 64]);
  return { cx:cx, cy:cy, C:C, O2:O2 };
})();
function heroSVG(t, final){
  var h = "", G = HG, i, k;
  var glow = clamp(t / 0.08, 0, 1) * (1 - clamp((t - 0.16) / 0.06, 0, 1));          // H atoms glow
  var det = clamp((t - 0.14) / 0.14, 0, 1);                                         // H pairs detach and split
  var co2 = clamp((t - 0.66) / 0.14, 0, 1);                                         // carbons → CO₂
  var w = clamp((t - 0.6) / 0.14, 0, 1);                                            // O₂ → H₂O
  var lab = clamp((t - 0.84) / 0.12, 0, 1);
  if (final) { det = 1; co2 = 1; w = 1; lab = 1; glow = 0; }
  // glucose ring (fades as CO₂ appears)
  if (co2 < 1) {
    var gA = 1 - co2, ga = f1(gA * 100) / 100;
    for (i = 0; i < 6; i++) { var A = G.C[i], B = G.C[(i + 1) % 6]; h += sv("line", { x1:A.x, y1:A.y, x2:B.x, y2:B.y, "class":"rx-bond", opacity:ga }); }
    for (i = 0; i < 6; i++) {
      var c = G.C[i];
      h += sv("line", { x1:c.x, y1:c.y, x2:c.ox, y2:c.oy, "class":"rx-bond", opacity:ga });
      if (det < 1) c.h.forEach(function(p){ h += sv("line", { x1:c.x, y1:c.y, x2:p[0], y2:p[1], "class":"rx-bond", opacity:f1((1 - det) * gA * 100) / 100 }); });
      h += atomSVG(c.ox, c.oy, "O", 10, gA, 11) + atomSVG(c.x, c.y, "C", 12, gA, 13);
    }
    if (det < 1) for (i = 0; i < 6; i++) G.C[i].h.forEach(function(p){ if (glow > 0) h += sv("circle", { cx:p[0], cy:p[1], r:14, "class":"rx-glow", opacity:f1(glow * 100) / 100 }); h += atomSVG(p[0], p[1], "H", 9, 1 - det, 11); });
    h += txt(G.cx, 236, "glucose", "rx-lab rx-lab-l", "middle", { opacity:ga });
  }
  // CO₂: carbons now bonded only to oxygen (brown C, blue O)
  if (co2 > 0) for (i = 0; i < 6; i++) {
    var cc = G.C[i], x = lerp(cc.x, G.cx + (cc.x - G.cx) * 1.4, co2), y = lerp(cc.y, G.cy + (cc.y - G.cy) * 1.4, co2);
    h += "<g" + op(co2) + ">" + sv("line", { x1:x - 19, y1:y, x2:x + 19, y2:y, "class":"rx-bond" }) + atomSVG(x - 19, y, "O", 9, 1, 10) + atomSVG(x + 19, y, "O", 9, 1, 10) + atomSVG(x, y, "C", 11, 1, 12) + "</g>";
  }
  if (co2 > 0.5) h += txt(G.cx, 236, "6CO₂", "rx-lab rx-lab-l", "middle", { opacity:f1((co2 - 0.5) * 200) / 100 });
  // six O₂ → six H₂O
  G.O2.forEach(function(p){ if (w < 1) h += pill(p[0], p[1], "O₂", "--bio-o2", 48, 30, 1 - w); if (w > 0) h += pill(p[0], p[1], "H₂O", "--bio-o2", 58, 30, w); });
  h += txt(325, 34, w > 0.5 ? "6H₂O" : "6O₂", "rx-lab rx-lab-l", "middle");
  // H⁺ and e⁻ leaving each H, then streaming to O₂
  if (!final && t > 0.14 && t < 0.8) {
    var tok = 0;
    for (i = 0; i < 6; i++) G.C[i].h.forEach(function(p, j){
      var tgt = G.O2[i], s = tok++ / 12, sp = det, U = G.C[i];
      // split: H⁺ and e⁻ separate a little around where the H atom was
      var hx = p[0] + U.ux * 8 * sp, hy = p[1] + U.uy * 8 * sp - 5 * sp, ex = p[0] - U.ux * 2 * sp, ey = p[1] + 6 * sp;
      var u = clamp((t - 0.3 - s * 0.22) / 0.24, 0, 1), uu = sm(u);
      var hx2 = lerp(hx, tgt[0] - 12 + j * 8, uu), hy2 = lerp(hy, tgt[1] + 14, uu) - Math.sin(uu * Math.PI) * 26;
      if (u < 1) h += hDot(hx2, hy2, 6.5, det);
      // each H brings its own electron; the carbon chain gives a second one (24 electrons in all)
      for (k = 0; k < 2; k++) {
        var u2 = clamp((t - 0.28 - s * 0.22 - k * 0.04) / 0.24, 0, 1), v2 = sm(u2);
        var sx = k ? U.x : ex, sy = k ? U.y : ey;
        var x2 = lerp(sx, tgt[0] - 10 + j * 8 + k * 4, v2), y2 = lerp(sy, tgt[1] - 2, v2) - Math.sin(v2 * Math.PI) * 44;
        if (u2 < 1 && (k ? u2 > 0 : true)) h += eDot(x2, y2, 4.6, k ? 1 : det);
      }
    });
  }
  if (lab > 0) h += "<g" + op(lab) + ">" + txt(200, 274 - lab * 12, "Glucose: oxidized (lost H). O₂: reduced (gained H).", "rx-lab rx-hlab", "middle") + "</g>";
  return h;
}
function heroArcs(){
  var box = $("#rx-heq"); if (!box) return;
  var row = $(".rx-heq-row", box), svg = $(".rx-heq-arcs", box); if (!row || !svg) return;
  var R = box.getBoundingClientRect(); if (!R.width) return;
  var mid = function(k){ var e = $('[data-sp="' + k + '"]', row), r = e.getBoundingClientRect(); return [r.left + r.width / 2 - R.left, r.bottom - R.top]; };
  var g = mid("glu"), o = mid("o2"), c = mid("co2"), w = mid("h2o"), y0 = g[1] + 2, W = R.width, H = 58 * Math.min(1, W / 420) + 14;
  svg.setAttribute("viewBox", "0 0 " + f1(W) + " " + f1(H)); svg.style.height = f1(H) + "px";
  function arc(p, q, depth, cls, label){
    var y = 4, cx = (p[0] + q[0]) / 2, cy = y + depth * 2, pts = []; for (var i = 0; i <= 20; i++) pts.push(qpt([p[0], y], [cx, cy], [q[0], y], i / 20));
    var a1 = pts[18], a2 = pts[20], L = Math.hypot(a2[0] - a1[0], a2[1] - a1[1]) || 1, m = qpt([p[0], y], [cx, cy], [q[0], y], 0.5);
    return sv("polyline", { points:ptsAttr(pts), "class":cls }) + sv("path", { d:head(a2[0], a2[1], (a2[0] - a1[0]) / L, (a2[1] - a1[1]) / L, 6), "class":cls + " rx-ah" }) + txt(m[0], m[1] + 14, label, "rx-heqt", "middle");
  }
  var s = Math.min(1, W / 420);
  svg.innerHTML = arc(g, c, 14 * s, "rx-arc rx-arc-c", "oxidized") + arc(o, w, 24 * s + 8, "rx-arc rx-arc-o", "reduced");
  void y0;
}
function hero(f){
  heroArcs();
  window.addEventListener("resize", heroArcs);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(heroArcs);
  var box = $("#rx-hero"); if (!box) return;
  var cap = f && f.cap;
  box.innerHTML = '<svg viewBox="0 0 400 270" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var FINAL = "Glucose loses its H (and electrons) and ends as CO₂; O₂ gains them and becomes H₂O.";
  function setCap(s){ if (cap) cap.textContent = s; }
  if (MV.reduceMotion) { svg.innerHTML = heroSVG(1, true); setCap(FINAL); return; }
  svg.innerHTML = heroSVG(0);
  var caps = [[0, "Glucose’s 12 H atoms glow."], [0.14, "They come off in pairs: each pair travels as 2 H⁺ and 2 e⁻."], [0.3, "24 electrons stream to six O₂, with the H⁺ close behind."], [0.6, "Each O₂ gains electrons and H: the O₂ become H₂O."], [0.7, "Glucose’s carbons, now bonded only to oxygen, become six CO₂."], [0.86, FINAL]], ci = -1;
  MV.wait(600, function(){
    MV.tween({ dur:11000, ease:lin, step:function(t){ svg.innerHTML = heroSVG(t); for (var i = caps.length - 1; i >= 0; i--) if (t >= caps[i][0]) { if (i !== ci) { ci = i; setCap(caps[i][1]); } break; } }, done:function(){ svg.innerHTML = heroSVG(1, true); setCap(FINAL); } });
  });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ fuel:fuel },
  task:task,
  onShow:function(v){ if (EXP) EXP.show(v === "explore"); if (P3) P3.show(v === "reaction-types"); if (v === "start") heroArcs(); }
});
})();
