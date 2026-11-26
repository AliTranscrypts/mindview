// SCH4U 18 VSEPR Theory and Molecular Geometry: hero (four balloons push apart into a tetrahedron, become NH₃'s electron
// clouds, the lone pair squeezes 109.5° to 107°), Shape predictor (Explore: C1 3D viewer with Build a shape / Real species /
// Angle lab, ghost polyhedra, ideal vs real angles, a compare panel), From formula to shape (Part 3: a pipeline of stage
// cards with a simplified Lewis builder and a wedge-and-dash drawing), Shapes and angles (custom practice) and
// "Lone pairs in charge" (task with a live 3D model).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f;
var MI = "−", D2R = Math.PI / 180, S3 = Math.sqrt(3) / 2;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function sum(a){ var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }
function n360(a){ return ((a % 360) + 360) % 360; }
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function fill(t, o){ return String(t).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function pl(n, w, ws){ return n + " " + (n === 1 ? w : (ws || w + "s")); }

// ---------- @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ id = id == null ? "" : String(id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- VSEPR table: the 13 standard AXE combinations ----------
var ARR = { 2:"linear", 3:"trigonal planar", 4:"tetrahedral", 5:"trigonal bipyramidal", 6:"octahedral" };
var SHP = { "2|0":"linear", "3|0":"trigonal planar", "2|1":"bent", "4|0":"tetrahedral", "3|1":"trigonal pyramidal", "2|2":"bent", "5|0":"trigonal bipyramidal",
  "4|1":"seesaw", "3|2":"T-shaped", "2|3":"linear", "6|0":"octahedral", "5|1":"square pyramidal", "4|2":"square planar" };
var SHAPES = ["linear", "trigonal planar", "bent", "tetrahedral", "trigonal pyramidal", "trigonal bipyramidal", "seesaw", "T-shaped", "octahedral", "square pyramidal", "square planar"];
var IDEAL = { 2:"180°", 3:"120°", 4:"109.5°", 5:"90° (axial–equatorial) and 120° (equatorial)", 6:"90°" };
function ok13(x, e){ return SHP[x + "|" + e] != null; }
function axeH(x, e){ return '<span class="chem">AX<sub>' + x + "</sub>" + (e ? "E<sub>" + e + "</sub>" : "") + "</span>"; }

// ---------- species ----------
// Valence electrons, atomic numbers and periods are standard group values, not physical data, so they aren't in
// MV.chem.data (course plan §3 has no such table); kept here as in SCH4U 17.
var VAL = { H:1, B:3, C:4, N:5, O:6, F:7, P:5, S:6, Cl:7, Br:7, I:7, Xe:8 };
var ZN = { H:1, B:5, C:6, N:7, O:8, F:9, P:15, S:16, Cl:17, Br:35, I:53, Xe:54 };
var PER = { H:1, B:2, C:2, N:2, O:2, F:2, P:3, S:3, Cl:3, Br:4, I:5, Xe:5 };
// outer atoms in 3D-slot order ("O2" = O with a double bond); lp = lone pairs on the central atom
var SP = {
  ch4:{ f:"CH4", c:"C", o:"H H H H", lp:0 }, nh3:{ f:"NH3", c:"N", o:"H H H", lp:1 }, h2o:{ f:"H2O", c:"O", o:"H H", lp:2 },
  bf3:{ f:"BF3", c:"B", o:"F F F", lp:0 }, co2:{ f:"CO2", c:"C", o:"O2 O2", lp:0 }, so3:{ f:"SO3", c:"S", o:"O2 O O", lp:0 },
  ch2o:{ f:"CH2O", c:"C", o:"O2 H H", lp:0 }, hcn:{ f:"HCN", c:"C", o:"H N3", lp:0 }, o3:{ f:"O3", c:"O", o:"O2 O", lp:1 },
  no2:{ f:"NO2-", c:"N", o:"O2 O", lp:1, q:-1 }, nh4:{ f:"NH4+", c:"N", o:"H H H H", lp:0, q:1 }, h3o:{ f:"H3O+", c:"O", o:"H H H", lp:1, q:1 },
  co3:{ f:"CO3^2-", c:"C", o:"O2 O O", lp:0, q:-2 }, pcl5:{ f:"PCl5", c:"P", o:"Cl Cl Cl Cl Cl", lp:0 }, sf4:{ f:"SF4", c:"S", o:"F F F F", lp:1 },
  clf3:{ f:"ClF3", c:"Cl", o:"F F F", lp:2 }, xef2:{ f:"XeF2", c:"Xe", o:"F F", lp:3 }, sf6:{ f:"SF6", c:"S", o:"F F F F F F", lp:0 },
  brf5:{ f:"BrF5", c:"Br", o:"F F F F F", lp:1 }, xef4:{ f:"XeF4", c:"Xe", o:"F F F F", lp:2 },
  o2:{ f:"O2", c:"O", o:"O2", lp:2 }, no3:{ f:"NO3-", c:"N", o:"O2 O O", lp:0, q:-1 }
};
function outLP(el, bo){ return el === "H" ? 0 : (8 - 2 * bo) / 2; }
Object.keys(SP).forEach(function(k){
  var s = SP[k]; s.id = k; s.q = s.q || 0; s.fh = F(s.f);
  s.out = s.o.split(" ").map(function(t){ var m = /^([A-Z][a-z]?)(\d?)$/.exec(t); return { el:m[1], bo:m[2] ? +m[2] : 1 }; });
  s.x = s.out.length; s.e = s.lp; s.at = [s.c].concat(s.out.map(function(a){ return a.el; }));
  s.st = { c:0, b:[0].concat(s.out.map(function(a){ return a.bo; })), lp:[s.lp].concat(s.out.map(function(a){ return outLP(a.el, a.bo); })) };
  s.T = sum(s.at.map(function(el){ return VAL[el]; })) - s.q;
});
function fp(sp){ return MV.plain(sp.fh); }
function qTxt(q){ return q === 0 ? "" : (Math.abs(q) > 1 ? Math.abs(q) : "") + (q > 0 ? "+" : MI); }
function shapeOf(sp){ return sp.id === "o2" ? "linear" : SHP[sp.x + "|" + sp.e]; }

// ---------- 3D vectors ----------
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function mul(a, k){ return [a[0] * k, a[1] * k, a[2] * k]; }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function crs(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function len3(a){ return Math.hypot(a[0], a[1], a[2]); }
function nrm(a){ var l = len3(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function angDeg(a, b){ return Math.acos(clamp(dot(nrm(a), nrm(b)), -1, 1)) / D2R; }
function slerp(a, b, t){
  a = nrm(a); b = nrm(b);
  var d = clamp(dot(a, b), -1, 1), th = Math.acos(d);
  if (th < 1e-4) return a.slice();
  if (Math.PI - th < 1e-3) { var p = nrm(crs(a, Math.abs(a[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])), m = nrm(crs(p, a)); return t < 0.5 ? slerp(a, m, t * 2) : slerp(m, b, (t - 0.5) * 2); }
  var s = Math.sin(th); return add(mul(a, Math.sin((1 - t) * th) / s), mul(b, Math.sin(t * th) / s));
}
function rotY(v, deg){ var c = Math.cos(deg * D2R), s = Math.sin(deg * D2R); return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c]; }
function inPlane(deg){ return [Math.cos(deg * D2R), Math.sin(deg * D2R), 0]; }

// ---------- @component C1 vseprFrame — electron-group directions for AXmEn (y up, z toward you). The front view is the
// textbook wedge-and-dash drawing. comp 0 = ideal angles, 1 = real (lone pairs squeeze: NH₃ 107°, H₂O 104.5°; other
// squeezes are drawn small and never labelled with a number). lpAx puts tbp lone pairs axial (the "try it" placement).
var UY = [0, 1, 0], DY = [0, -1, 0], LX = [-1, 0, 0], RX = [1, 0, 0], FZ = [0, 0, 1], BZ = [0, 0, -1];
var EQ = [[-1, 0, 0], [0.5, 0, S3], [0.5, 0, -S3]];
var TET = [[0, 1, 0], [-Math.sqrt(8 / 9), -1 / 3, 0], [Math.sqrt(2 / 9), -1 / 3, Math.sqrt(2 / 3)], [Math.sqrt(2 / 9), -1 / 3, -Math.sqrt(2 / 3)]];
var TETA = 109.47;
function pyr(th){ var c = Math.cos(th * D2R), ca = Math.sqrt(Math.max(0, (2 * c + 1) / 3)), sa = Math.sqrt(1 - ca * ca); return [180, 60, -60].map(function(p){ return [sa * Math.cos(p * D2R), -ca, sa * Math.sin(p * D2R)]; }); }
function frame(x, e, o){
  o = o || {};
  var c = o.comp == null ? 1 : o.comp, t, s, k;
  switch (x + "|" + e) {
    case "2|0": return { at:[LX, RX], lp:[] };
    case "3|0": return { at:[inPlane(90), inPlane(210), inPlane(330)], lp:[] };
    case "2|1": t = (120 - 3 * c) / 2; return { at:[inPlane(270 - t), inPlane(270 + t)], lp:[UY] };
    case "4|0": return { at:TET.slice(), lp:[] };
    case "3|1": return { at:pyr(o.theta != null ? o.theta : lerp(TETA, 107, c)), lp:[UY] };
    case "2|2": t = lerp(TETA, 104.5, c) / 2 * D2R; s = lerp(TETA, 114, c) / 2 * D2R;
      return { at:[[-Math.sin(t), -Math.cos(t), 0], [Math.sin(t), -Math.cos(t), 0]], lp:[[0, Math.cos(s), Math.sin(s)], [0, Math.cos(s), -Math.sin(s)]] };
    case "5|0": return { at:[UY, DY, EQ[0], EQ[1], EQ[2]], lp:[] };
    case "4|1":
      if (o.lpAx) return { at:[EQ[1], DY, EQ[0], EQ[2]], lp:[UY] };
      t = 3.5 * c * D2R; k = lerp(60, 52, c);
      return { at:[[-0.5 * Math.sin(t), Math.cos(t), -S3 * Math.sin(t)], [-0.5 * Math.sin(t), -Math.cos(t), -S3 * Math.sin(t)], rotY([-0.5, 0, -S3], k), rotY([-0.5, 0, -S3], -k)], lp:[EQ[1]] };
    case "3|2":
      if (o.lpAx) return { at:[EQ[0], EQ[1], EQ[2]], lp:[UY, DY] };
      t = 2.5 * c * D2R; return { at:[[-Math.sin(t), Math.cos(t), 0], [-Math.sin(t), -Math.cos(t), 0], EQ[0]], lp:[EQ[1], EQ[2]] };
    case "2|3": return { at:[UY, DY], lp:[EQ[0], EQ[1], EQ[2]] };
    case "6|0": return { at:[UY, LX, RX, DY, FZ, BZ], lp:[] };
    case "5|1": t = 5 * c * D2R; s = Math.sin(t); k = Math.cos(t); return { at:[UY, [-k, s, 0], [k, s, 0], [0, s, k], [0, s, -k]], lp:[DY] };
    case "4|2": return { at:[LX, FZ, RX, BZ], lp:[UY, DY] };
    case "1|2": return { at:[RX], lp:[inPlane(120), inPlane(240)] };
  }
  return { at:[], lp:[] };
}
// model(x, e, {sp, comp, lpAx, theta, len}) -> {x, e, sp, cen, atoms:[{el, bo, d, di, L, r}], lps:[{d, di}], lpAx}
function model(x, e, o){
  o = o || {};
  var sp = o.sp ? SP[o.sp] : null, R = frame(x, e, o), I = frame(x, e, { comp:0, lpAx:o.lpAx }), L = o.len == null ? 1 : o.len;
  return { x:x, e:e, sp:sp, lpAx:!!o.lpAx, cen:{ el:sp ? sp.c : "A", r:0.26 },
    atoms:R.at.map(function(d, i){ var a = sp ? sp.out[i] : { el:"X", bo:1 }; return { el:a.el, bo:a.bo, d:d, di:I.at[i], L:(a.el === "H" ? 0.85 : 1) * L, r:a.el === "H" ? 0.15 : 0.19 }; }),
    lps:R.lp.map(function(d, i){ return { d:d, di:I.lp[i] }; }) };
}
function mixModel(A, B, t){
  var m = { x:B.x, e:B.e, sp:B.sp, lpAx:B.lpAx, cen:B.cen, atoms:B.atoms.map(function(b, i){ var a = A.atoms[i] || b; return Object.assign({}, b, { d:slerp(a.d, b.d, t), L:lerp(a.L, b.L, t) }); }),
    lps:B.lps.map(function(b, i){ var a = A.lps[i] || b; return Object.assign({}, b, { d:slerp(a.d, b.d, t) }); }) };
  return m;
}
function niceAng(v){ var c = [90, 109.5, 120, 180], b = 90; c.forEach(function(x){ if (Math.abs(x - v) < Math.abs(b - v)) b = x; }); return b; }
function fmtA(v){ return (v === 109.5 ? "109.5" : String(Math.round(v))) + "°"; }
// the real angle between two bonded atoms, given its ideal value (only NH₃ and H₂O have measured numbers)
function realAng(m, idl){
  if (m.lpAx || !m.e || (m.x === 2 && m.e === 3) || (m.x === 4 && m.e === 2) || (m.x === 1)) return { s:fmtA(idl), w:fmtA(idl), exact:true };
  var id = m.sp && m.sp.id;
  if (id === "nh3") return { s:"≈ 107°", w:"≈ 107° (measured)" };
  if (id === "h2o") return { s:"≈ 104.5°", w:"≈ 104.5° (measured)" };
  return { s:"&lt; " + fmtA(idl), w:"less than " + fmtA(idl) };
}
// one arc per distinct ideal angle between bonded atoms (180° only when it's the only one, unless all180)
function defArcs(m, all180){
  var seen = {}, out = [], n = m.atoms.length, i, j;
  for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) { var v = niceAng(angDeg(m.atoms[i].di, m.atoms[j].di)); if (!seen[v]) { seen[v] = 1; out.push({ i:i, j:j, v:v }); } }
  if (!all180 && out.length > 1) out = out.filter(function(a){ return a.v !== 180; });
  return out;
}
function arcLab(m, a, ideal){
  var r = realAng(m, a.v);
  return ideal ? r.s + (r.exact ? "|= ideal" : "|ideal " + fmtA(a.v)) : r.s;
}

// ---------- @component C1 vseprView — SVG 3D renderer: depth-sorted atom balls (course colours, letters), bonds (1–3 lines),
// violet lone-pair clouds at 40% with two electron dots, a ghost polyhedron (--ink-2 at 30%), dashed ideal bonds, --ink angle
// arcs with values, selection rings (--hi) and orange "crowded neighbour" rings (always with text elsewhere).
function proj(p, R){
  var cy = Math.cos(R.y), sy = Math.sin(R.y), cx = Math.cos(R.x), sx = Math.sin(R.x);
  var x = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy, y = p[1];
  return [x, y * cx - z1 * sx, y * sx + z1 * cx];
}
function unproj(v, R){
  var cy = Math.cos(R.y), sy = Math.sin(R.y), cx = Math.cos(R.x), sx = Math.sin(R.x);
  var y = v[1] * cx + v[2] * sx, z1 = -v[1] * sx + v[2] * cx;
  return [v[0] * cy - z1 * sy, y, v[0] * sy + z1 * cy];
}
function ballCol(el){
  if (el === "A") return { fill:"var(--ink)", line:"none", ink:"var(--sheet)" };
  if (el === "X") return { fill:"var(--sheet)", line:"var(--ink)", ink:"var(--ink)" };
  if (el === "Xe") return { fill:"var(--ink-2)", line:"none", ink:"var(--sheet)" };   // a nonmetal, not cerulean
  return MV.chem.atom(el);
}
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + r1(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + (o.halo ? ' stroke="var(--sheet)" stroke-width="4" paint-order="stroke" stroke-linejoin="round"' : "") + opA(o.op) + ">" + s + "</text>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2.4) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + fill + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
// o: {lp (show), lpOp, poly, ideal, arcs:[{i, j, txt}], rings:{atomIdx:"sel"|"warn"}, lpWarn:[lp idx], lpSt:{len, wid, fill, fop, stroke, sop, dots}, atomOp, cenOp, extra:[lobes]}
function render3(m, V, o){
  o = o || {};
  var W = V.W, H = V.H, s = Math.min(W, H) / 2 / 1.35 * (V.zoom || 1), cx = W / 2, cy = H / 2 + (o.dy || 0), out = "", items = [], rg = o.rings || {};
  function P(p){ var q = proj(p, V.R); return [cx + q[0] * s, cy - q[1] * s, q[2]]; }
  var C = P([0, 0, 0]), rc = m.cen.r * s, pos = [[C[0], C[1], rc]];
  if (o.poly) {
    var tips = m.atoms.map(function(a){ return a.di; }).concat(m.lps.map(function(l){ return l.di; })), n = tips.length, TP = tips.map(function(t){ return P(t); });
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) { var g = angDeg(tips[i], tips[j]); if (n === 2 ? g > 179 : g < 150) out += ln(TP[i][0], TP[i][1], TP[j][0], TP[j][1], { c:"var(--ink-2)", w:1.6, d:"5 4", op:0.3 }); }
    TP.forEach(function(p){ out += circ(p[0], p[1], 3, "var(--ink-2)", { op:0.3 }); });
  }
  if (o.ideal) m.atoms.forEach(function(a){ var q = P(mul(a.di, a.L)); out += ln(C[0], C[1], q[0], q[1], { c:"var(--ink-2)", w:1.8, d:"6 5", op:0.75 }) + circ(q[0], q[1], a.r * s * 0.55, "none", { s:"var(--ink-2)", sw:1.4, d:"3 3", op:0.75 }); });
  m.atoms.forEach(function(a, i){
    if (a.L < 0.02) { pos.push([C[0], C[1], 0]); return; }
    var Q = P(mul(a.d, a.L)), r = a.r * s * (1 + 0.06 * Q[2]); pos.push([Q[0], Q[1], r]);
    items.push({ z:Q[2] / 2 - 0.01, k:"b", a:a, Q:Q, r:r });
    items.push({ z:Q[2], k:"a", a:a, Q:Q, r:r, i:i + 1 });
  });
  items.push({ z:0, k:"c" });
  var lpOp = o.lp === false ? 0 : (o.lpOp == null ? 1 : o.lpOp), warn = {};
  (o.lpWarn || []).forEach(function(k){ warn[k] = 1; });
  if (lpOp > 0.01) m.lps.forEach(function(l, k){ var st = Object.assign({ len:0.62, wid:0.22, fill:"var(--e-pair)", fop:0.4, stroke:"var(--e-pair)", sop:0.75, dots:true }, o.lpSt || {}, l.st || {}); items.push({ z:proj(mul(l.d, 0.2 + st.len * 0.5), V.R)[2], k:"l", d:l.d, st:st, op:lpOp, warn:warn[k] }); });
  (o.extra || []).forEach(function(l){ items.push({ z:proj(mul(l.d, l.st.len * 0.5), V.R)[2], k:"l", d:l.d, st:l.st, op:l.op == null ? 1 : l.op }); });
  items.sort(function(p, q){ return p.z - q.z; });
  var uid = V.uid || 0;
  items.forEach(function(it){
    if (it.k === "c") { var cc = ballCol(m.cen.el), cop = o.cenOp == null ? 1 : o.cenOp; if (cop > 0.01) out += ball(C[0], C[1], rc, m.cen.el, cc, cop, uid, false); return; }
    if (it.k === "l") { out += lobe(C, it.d, s, V, it.st, it.op, it.warn); return; }
    var aop = (o.atomOp == null ? 1 : o.atomOp) * (it.a.op == null ? 1 : it.a.op);
    if (aop < 0.01) return;
    if (it.k === "b") { out += bond3(C, it.Q, rc, it.r, it.a.bo, s, aop); return; }
    var ring = rg[it.i];
    out += ball(it.Q[0], it.Q[1], it.r, it.a.el, ballCol(it.a.el), aop, uid, ring);
  });
  if (rg[0]) out += circ(C[0], C[1], rc + 5, "none", { s:rg[0] === "warn" ? "var(--p-k)" : "var(--hi-ink)", sw:3.5 });
  (o.arcs || []).forEach(function(a){ var A = m.atoms[a.i], B = m.atoms[a.j]; if (A && B) out += arc3(C, A.d, B.d, s, V, a.txt, pos); });
  return { svg:out, pos:pos, s:s };
}
function ball(x, y, r, el, col, op, uid, ring){
  var h = "", lab = el, fs = r * (lab.length > 1 ? 0.95 : 1.15);
  if (ring) h += circ(x, y, r + 5, ring === "warn" ? "none" : "var(--hi)", { s:ring === "warn" ? "var(--p-k)" : "var(--hi-ink)", sw:3.5, op:ring === "warn" ? 1 : 0.9 });
  h += '<g' + opA(op) + ">" + circ(x, y, r, col.fill, { s:col.line !== "none" ? col.line : null, sw:1.6 }) + circ(x, y, r, "url(#vsgl" + uid + ")");
  if (r > 6) h += tx(x, y + 0.5, lab, { fs:r1(clamp(fs, 9, 22)), w:700, c:col.ink });
  return h + "</g>";
}
function bond3(C, Q, ra, rb, bo, s, op){
  var dx = Q[0] - C[0], dy = Q[1] - C[1], L = Math.hypot(dx, dy); if (L < (ra + rb) * 0.85) return "";
  var ux = dx / L, uy = dy / L, px = -uy, py = ux, x1 = C[0] + ux * ra * 0.8, y1 = C[1] + uy * ra * 0.8, x2 = Q[0] - ux * rb * 0.8, y2 = Q[1] - uy * rb * 0.8;
  var w = clamp(s * (bo > 1 ? 0.045 : 0.07), 2, 6), gap = clamp(s * 0.07, 3, 7), h = "";
  for (var q = 0; q < bo; q++) { var d = (q - (bo - 1) / 2) * gap; h += ln(x1 + px * d, y1 + py * d, x2 + px * d, y2 + py * d, { c:"var(--ink-2)", w:w, op:op }); }
  return h;
}
function lobe(C, d, s, V, st, op, warn){
  var r0 = st.r0 == null ? 0.2 : st.r0, p1 = proj(mul(d, r0), V.R), p2 = proj(mul(d, r0 + st.len), V.R), vx = (p2[0] - p1[0]) * s, vy = -(p2[1] - p1[1]) * s, L2 = Math.hypot(vx, vy), ang = Math.atan2(vy, vx) / D2R;
  var b = st.wid * s, a = Math.max(L2 / 2 + b * 0.12, b * 0.95), mx = C[0] + (p1[0] + p2[0]) / 2 * s, my = C[1] - (p1[1] + p2[1]) / 2 * s, h = "";
  h += '<ellipse cx="' + r1(mx) + '" cy="' + r1(my) + '" rx="' + r1(a) + '" ry="' + r1(b) + '" transform="rotate(' + r1(ang) + " " + r1(mx) + " " + r1(my) + ')" fill="' + st.fill + '" fill-opacity="' + r1(st.fop * op * 100) / 100 + '" stroke="' + (warn ? "var(--p-k)" : st.stroke) + '" stroke-width="' + (warn ? 3.5 : 1.4) + '" stroke-opacity="' + r1((warn ? 1 : st.sop) * op * 100) / 100 + '"/>';
  if (st.dots && op > 0.05) { var pxx = -Math.sin(ang * D2R) * b * 0.36, pyy = Math.cos(ang * D2R) * b * 0.36, rr = clamp(s * 0.035, 2, 4); h += circ(mx + pxx, my + pyy, rr, "var(--e-pair)", { op:op }) + circ(mx - pxx, my - pyy, rr, "var(--e-pair)", { op:op }); }
  return h;
}
function arc3(C, a, b, s, V, txt, balls){
  var ang = angDeg(a, b), rad = 0.5, pts = [], mid, k, N = 18;
  if (ang > 179) {
    var cam = unproj([0, 0, 1], V.R), m = crs(a, cam); if (len3(m) < 0.15) m = crs(a, [0, 1, 0]); m = nrm(m); mid = m;
    for (k = 0; k <= N; k++) { var t = k / N; pts.push(t < 0.5 ? slerp(a, m, t * 2) : slerp(m, b, (t - 0.5) * 2)); }
  } else { mid = slerp(a, b, 0.5); for (k = 0; k <= N; k++) pts.push(slerp(a, b, k / N)); }
  var d = pts.map(function(p, i){ var q = proj(mul(p, rad), V.R); return (i ? "L" : "M") + r1(C[0] + q[0] * s) + " " + r1(C[1] - q[1] * s); }).join(" ");
  var t2 = String(txt || "").split("|"), X, Y, best = null, bd = -1;
  // label beside the arc, clear of the balls: try points along the arc and two distances out from it
  [0.5, 0.36, 0.64, 0.22, 0.78].forEach(function(t){ [24, 40, 58].forEach(function(off){
    if (best && bd > 6) return;
    var q = proj(mul(ang > 179 ? (t < 0.5 ? slerp(a, mid, t * 2) : slerp(mid, b, (t - 0.5) * 2)) : slerp(a, b, t), rad), V.R), x = C[0] + q[0] * s, y = C[1] - q[1] * s, dx = x - C[0], dy = y - C[1], L = Math.hypot(dx, dy) || 1;
    x += dx / L * off; y += dy / L * off;
    var clear = 1e9; (balls || []).forEach(function(p){ clear = Math.min(clear, Math.hypot(p[0] - x, p[1] - y) - p[2] - 16); });
    if (clear > bd) { bd = clear; best = [x, y]; }
  }); });
  X = best[0]; Y = best[1];
  return '<path d="' + d + '" fill="none" stroke="var(--ink)" stroke-width="2.2"/>' + (t2[0] ? tx(X, Y - (t2[1] ? 7 : 0), t2[0], { fs:13, w:700, halo:true }) : "") + (t2[1] ? tx(X, Y + 9, t2[1], { fs:11.5, c:"var(--ink-2)", halo:true }) : "");
}
function describe3(m, o){
  o = o || {};
  var sp = m.sp, n = m.atoms.length, el = sp ? sp.out.map(function(a){ return a.el; }) : null, cnt = {};
  if (el) el.forEach(function(x){ cnt[x] = (cnt[x] || 0) + 1; });
  var who = el ? Object.keys(cnt).map(function(k){ return pl(cnt[k], k + " atom"); }).join(" and ") : pl(n, "X atom");
  var shape = m.x === 1 ? "linear" : (SHP[m.x + "|" + m.e] || "");
  return "3D model" + (sp ? " of " + fp(sp) : "") + ": " + (sp ? sp.c : "A") + " in the centre bonded to " + who + ", with " + pl(m.e, "lone pair") + (o.lp === false && m.e ? " (hidden)" : "") + "." +
    (m.lpAx ? " Lone pairs placed axial (a try, not the real shape)." : shape ? " Molecular shape: " + shape + "." : "") +
    ((o.arcs || []).length ? " Angles shown: " + o.arcs.map(function(a){ return MV.plain(String(a.txt || "").replace("|", ", ")); }).join("; ") + "." : "");
}

// the view that spreads the groups out best on screen (no group hidden behind the centre or another group)
function bestView(m){
  var pts = m.atoms.map(function(a){ return a.di; }).concat(m.lps.map(function(l){ return mul(l.di, 0.8); })), best = PRE.iso, bs = -1e9;
  for (var yi = 0; yi < 24; yi++) for (var pi = 0; pi < 3; pi++) {
    var R = { x:[0.15, 0.3, 0.45][pi], y:-Math.PI + yi * Math.PI / 12 }, P = pts.map(function(p){ return proj(p, R); }), sc = 1e9;
    for (var i = 0; i < P.length; i++) { sc = Math.min(sc, Math.hypot(P[i][0], P[i][1]) * 1.3); for (var j = i + 1; j < P.length; j++) sc = Math.min(sc, Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1])); }
    // a flat-looking view lines up two groups through the centre on screen when they aren't opposite in 3D
    for (i = 0; i < P.length; i++) for (j = i + 1; j < P.length; j++) { var a3 = angDeg(pts[i], pts[j]), a2 = Math.acos(clamp((P[i][0] * P[j][0] + P[i][1] * P[j][1]) / (Math.hypot(P[i][0], P[i][1]) * Math.hypot(P[j][0], P[j][1]) || 1), -1, 1)) / D2R; if (a3 < 170 && a2 > 160) sc -= 0.25; if (a3 < 170 && Math.abs(a2 - 90) < 6 && Math.abs(a3 - 90) > 10) sc -= 0.08; }
    sc -= Math.abs(R.x - 0.3) * 0.05 + Math.abs(R.y + 0.5) * 0.01;
    if (sc > bs + 1e-6) { bs = sc; best = R; }
  }
  return { x:best.x, y:best.y };
}
// 3D view widget: drag or arrow keys (Shift: 15° steps) to turn; + and − zoom; Front, Top, Side and 3D view presets.
var UID = 0, PRE = { iso:{ x:0.38, y:-0.55 }, front:{ x:0, y:0 }, top:{ x:1.5708, y:0 }, side:{ x:0, y:-1.5708 } };
function viewer(host, o){
  o = o || {};
  var uid = ++UID, V = { W:o.W || 440, H:o.H || 340, R:Object.assign({}, PRE[o.start || "iso"]), zoom:1, uid:uid }, last = null, lastO = {}, pos = [];
  host.innerHTML = '<div class="vs-stage"><svg class="vs-svg" tabindex="0" viewBox="0 0 ' + V.W + " " + V.H + '" role="img" aria-label=""></svg>' + (o.hits ? '<div class="vs-hits"></div>' : "") + "</div>" +
    (o.bar === false ? "" : '<div class="vs-vbar" role="group" aria-label="View"><span class="tiny muted">View:</span>' + [["iso", "3D"], ["front", "Front"], ["top", "Top"], ["side", "Side"]].map(function(b){ return '<button type="button" class="btn ghost sm" data-pre="' + b[0] + '" data-k="pre' + uid + b[0] + '">' + b[1] + "</button>"; }).join("") +
      '<span class="vs-zm"><button type="button" class="btn ghost sm" data-zm="-1" data-k="zm' + uid + 'o" aria-label="Zoom out">−</button><button type="button" class="btn ghost sm" data-zm="1" data-k="zm' + uid + 'i" aria-label="Zoom in">+</button></span></div>');
  var svg = $(".vs-svg", host), stage = $(".vs-stage", host);
  var defs = '<defs><radialGradient id="vsgl' + uid + '" cx=".32" cy=".28" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
  function paint(){
    if (!last) { svg.innerHTML = ""; return; }
    size(); var r = render3(last, V, lastO); pos = r.pos;
    svg.innerHTML = defs + r.svg + (lastO.note ? tx(V.W / 2, V.H - 14, lastO.note, { fs:14, w:700, halo:true, c:lastO.noteC }) : "");
    svg.setAttribute("aria-label", (lastO.aria || describe3(last, lastO)) + (o.static ? "" : " Drag it or use the arrow keys to turn it."));
    if (o.onPaint) o.onPaint(pos);
  }
  // keep the viewBox at the real pixel width, so labels stay readable on a phone
  var asp = V.H / V.W;
  function size(){ var cw = Math.round(svg.getBoundingClientRect().width); if (cw > 120 && cw !== V.W) { V.W = cw; V.H = Math.round(cw * (cw < 420 ? Math.max(asp, 0.86) : asp)); svg.setAttribute("viewBox", "0 0 " + V.W + " " + V.H); return true; } return false; }
  if (window.ResizeObserver) new ResizeObserver(function(){ if (size()) paint(); }).observe(svg);
  function turn(dy, dx){ V.R.y += dy; V.R.x = clamp(V.R.x + dx, -1.5708, 1.5708); paint(); }
  function zoom(d){ V.zoom = clamp(V.zoom * (d > 0 ? 1.15 : 1 / 1.15), 0.6, 1.8); paint(); }
  if (!o.static) {
    var drag = null;
    svg.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY }; try { svg.setPointerCapture(e.pointerId); } catch (er) {} });
    svg.addEventListener("pointermove", function(e){ if (!drag) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x:e.clientX, y:e.clientY }; turn(dx * 0.012, dy * 0.012); });
    ["pointerup", "pointercancel"].forEach(function(ev){ svg.addEventListener(ev, function(){ drag = null; }); });
    stage.addEventListener("keydown", function(e){
      var st = (e.shiftKey ? 15 : 5) * D2R, k = e.key;
      if (k === "ArrowLeft") turn(-st, 0); else if (k === "ArrowRight") turn(st, 0); else if (k === "ArrowUp") turn(0, -st); else if (k === "ArrowDown") turn(0, st);
      else if (k === "+" || k === "=") zoom(1); else if (k === "-" || k === "_") zoom(-1); else return;
      e.preventDefault();
    });
    host.addEventListener("click", function(e){
      var b = e.target.closest("[data-pre]"); if (b) { var p = b.dataset.pre === "iso" && V.best ? V.best : PRE[b.dataset.pre]; V.R.x = p.x; V.R.y = p.y; paint(); return; }
      var z = e.target.closest("[data-zm]"); if (z) zoom(+z.dataset.zm);
    });
  }
  return { draw:function(m, oo, fresh){ last = m; lastO = oo || {}; if (fresh) { V.best = bestView(m); V.R.x = V.best.x; V.R.y = V.best.y; } paint(); }, paint:paint, V:V, svg:svg, stage:stage, hits:$(".vs-hits", host), pos:function(){ return pos; },
    set:function(id){ var p = PRE[id]; V.R.x = p.x; V.R.y = p.y; paint(); } };
}

// ---------- @component C1 lewisView (trimmed from SCH4U 17) — 2D Lewis diagram for one central atom: atom balls in the
// course colours, bond lines (1–3), violet lone-pair dots in the widest gaps, ion brackets with the charge.
var ANG = { 1:[0], 2:[180, 0], 3:[-90, 180, 0], 4:[-90, 0, 90, 180], 5:[-90, -18, 54, 126, 198], 6:[-90, -30, 30, 90, 150, 210] }, AR = 14;
function spread(occ, k){
  if (!k) return [];
  var out = [], i;
  if (!occ.length) { for (i = 0; i < k; i++) out.push(-90 + 360 * i / k); return out; }
  var s = occ.map(n360).sort(function(a, b){ return a - b; }), gaps = s.map(function(a, j){ return { a:a, z:(j < s.length - 1 ? s[j + 1] : s[0] + 360) - a, n:0 }; });
  for (i = 0; i < k; i++) { var g = gaps.slice().sort(function(p, q){ return q.z / (q.n + 1) - p.z / (p.n + 1) || q.z - p.z; })[0]; g.n++; }
  gaps.forEach(function(g){ for (var j = 1; j <= g.n; j++) out.push(g.a + g.z * j / (g.n + 1)); });
  return out;
}
function geo2(sp, st, o){
  var W = o.W, H = o.H, rb = o.rb, n = sp.at.length, cx = W / 2, cy = H / 2, P = [], outs = [], i;
  for (i = 1; i < n; i++) outs.push(i);
  var A = ANG[outs.length], sx = outs.length === 1 ? -rb / 2 : 0;
  P[0] = { x:cx + sx, y:cy, th:0 };
  outs.forEach(function(j, k){ var a = A[k] * D2R; P[j] = { x:cx + sx + rb * Math.cos(a), y:cy + rb * Math.sin(a), th:A[k] }; });
  var atoms = sp.at.map(function(el, j){ var p = P[j], occ = j === 0 ? outs.map(function(k){ return P[k].th; }) : [p.th + 180]; return { el:el, x:p.x, y:p.y, th:p.th, lp:spread(occ, st.lp[j]) }; });
  var bonds = outs.map(function(j){ var a = atoms[0], b = atoms[j], dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1; return { i:j, o:st.b[j], ax:a.x, ay:a.y, bx:b.x, by:b.y, ux:dx / L, uy:dy / L }; });
  return { W:W, H:H, atoms:atoms, bonds:bonds };
}
function dotPair(x, y, ux, uy){ var px = -uy * 4.2, py = ux * 4.2; return circ(x + px, y + py, 2.7, "var(--e-pair)") + circ(x - px, y - py, 2.7, "var(--e-pair)"); }
function lewisSVG(sp, st, G, o){
  o = o || {};
  var h = "", A = G.atoms;
  G.bonds.forEach(function(b){
    var t = AR + 3, x1 = b.ax + b.ux * t, y1 = b.ay + b.uy * t, x2 = b.bx - b.ux * t, y2 = b.by - b.uy * t, px = -b.uy, py = b.ux, offs = b.o === 1 ? [0] : b.o === 2 ? [-3.6, 3.6] : [-5.6, 0, 5.6];
    offs.forEach(function(k){ h += ln(x1 + px * k, y1 + py * k, x2 + px * k, y2 + py * k); });
  });
  A.forEach(function(a, i){
    var c = ballCol(a.el);
    if (o.hl === i) h += circ(a.x, a.y, AR + 5, "var(--hi)", { s:"var(--hi-ink)", sw:2.5 });
    h += circ(a.x, a.y, AR, c.fill, { s:c.line !== "none" ? c.line : null, sw:1.6 }) + tx(a.x, a.y + 0.5, a.el, { fs:a.el.length > 1 ? 12 : 14, w:700, c:c.ink });
    a.lp.forEach(function(d){ var u = Math.cos(d * D2R), v = Math.sin(d * D2R); h += dotPair(a.x + u * (AR + 8), a.y + v * (AR + 8), u, v); });
  });
  if (sp.q) {
    var x0 = 1e9, x1b = -1e9, y0 = 1e9, y1b = -1e9;
    A.forEach(function(a){ x0 = Math.min(x0, a.x - AR - 14); x1b = Math.max(x1b, a.x + AR + 14); y0 = Math.min(y0, a.y - AR - 14); y1b = Math.max(y1b, a.y + AR + 14); });
    x0 = Math.max(6, x0); x1b = Math.min(G.W - 26, x1b); y0 = Math.max(4, y0); y1b = Math.min(G.H - 4, y1b);
    h += '<path d="M' + r1(x0 + 8) + " " + r1(y0) + " H" + r1(x0) + " V" + r1(y1b) + " H" + r1(x0 + 8) + " M" + r1(x1b - 8) + " " + r1(y0) + " H" + r1(x1b) + " V" + r1(y1b) + " H" + r1(x1b - 8) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.8"/>';
    h += tx(x1b + 3, y0 + 6, qTxt(sp.q), { a:"start", fs:15, w:700 });
  }
  return h;
}
function lewisDesc(sp, st){
  var BN = ["", "single", "double", "triple"];
  return MV.plain(sp.fh) + " Lewis structure: central " + sp.c + " with " + pl(st.lp[0], "lone pair") + "; " + sp.out.map(function(a, k){ return BN[st.b[k + 1]] + " bond to " + a.el + (st.lp[k + 1] ? " (" + pl(st.lp[k + 1], "lone pair") + ")" : ""); }).join(", ") + ".";
}

// ---------- hero: four balloons push apart, become NH₃'s electron clouds, the lone pair squeezes the angle ----------
function hero(){
  var svg = $("#vs-hx-svg"), cap = $("#vs-hx-cap"), rep = $("#vs-hx-replay"); if (!svg) return;
  var C = MV.C.hero, V = { W:440, H:320, R:{ x:0.3, y:-0.9 }, zoom:1.08, uid:"h" }, run = 0, tw = null;
  var defs = '<defs><radialGradient id="vsglh" cx=".32" cy=".28" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
  var s = {}, CL = nrm([0.25, 1, 0.35]);
  function reset(){ s = { spread:0, morph:0, h:0, sq:0, hide:0, lab:0, yaw:-0.9 }; }
  function draw(){
    var th = lerp(TETA, 107, s.sq), at = pyr(th), dirs = [UY].concat(at).map(function(d){ return slerp(CL, d, 0.25 + 0.75 * s.spread); });
    var m = { x:3, e:1, sp:SP.nh3, cen:{ el:"N", r:0.3 }, atoms:dirs.slice(1).map(function(d){ return { el:"H", bo:1, d:d, di:d, L:1.02, r:0.17, op:s.h }; }), lps:[] }, extra = [];
    V.R.y = s.yaw;
    if (s.morph < 1) dirs.forEach(function(d){ extra.push({ d:d, op:1 - s.morph, st:{ len:1.05, wid:0.3, fill:"var(--hi-soft)", fop:1, stroke:"var(--ink-2)", sop:1 } }); });
    if (s.morph > 0) dirs.forEach(function(d, k){
      if (k === 0) extra.push({ d:d, op:s.morph * (1 - s.hide), st:{ len:0.9, wid:lerp(0.3, 0.36, s.morph), fill:"var(--e-pair)", fop:0.4, stroke:"var(--e-pair)", sop:0.8, dots:true } });
      else extra.push({ d:d, op:s.morph * (1 - 0.6 * s.h) * (1 - s.hide), st:{ len:1.0, wid:0.2, fill:"var(--ink-2)", fop:0.22, stroke:"var(--ink-2)", sop:0.4 } });
    });
    var arcs = s.h > 0.99 && s.lab < 1 || s.sq > 0 ? [{ i:0, j:1, txt:s.sq >= 1 ? "≈ 107°" : MV.num(lerp(109.5, 107, s.sq), 1) + "°" }] : [];
    var r = render3(m, V, { lp:false, extra:extra, arcs:arcs, cenOp:s.morph, dy:8 });
    var knot = s.morph < 1 ? circ(V.W / 2, V.H / 2 + 8, 5, "var(--ink-2)", { op:1 - s.morph }) : "";
    svg.innerHTML = defs + r.svg + knot + (s.lab > 0 ? tx(V.W / 2, V.H - 16, "trigonal pyramidal", { fs:18, w:700, halo:true, op:s.lab }) : "");
  }
  function final(){ s = { spread:1, morph:1, h:1, sq:1, hide:1, lab:1, yaw:-0.45 }; draw(); cap.textContent = C.capEnd || "Lone pair hidden: the atoms make a trigonal pyramid, ≈ 107°."; rep.hidden = false; }
  function seq(list, id){
    var k = 0;
    (function next(){
      if (id !== run) return;
      if (k >= list.length) { rep.hidden = false; return; }
      var it = list[k++]; if (it.cap != null) cap.textContent = it.cap;
      tw = MV.tween({ dur:it.dur, step:function(t){ if (id !== run) return; it.step(t); s.yaw = lerp(-0.9, -0.45, Math.min(1, (k - 1 + t) / list.length)); draw(); }, done:function(){ tw = null; if (id !== run) return; MV.wait(it.pause == null ? 350 : it.pause, next); } });
    })();
  }
  function play(){
    var id = ++run; if (tw) { tw(); tw = null; } rep.hidden = true; reset(); draw();
    seq([
      { cap:"Four balloons tied at their knots push apart…", dur:1500, step:function(t){ s.spread = t; } },
      { cap:"…as far as they can: a tetrahedron, 109.5° apart.", dur:500, step:function(){}, pause:500 },
      { cap:"Each balloon becomes an electron cloud. Three get H atoms; the fourth, fatter and violet, stays a lone pair on N.", dur:1400, step:function(t){ s.morph = t; s.h = clamp(t * 1.6 - 0.4, 0, 1); }, pause:700 },
      { cap:"The lone pair spreads wider and squeezes the H–N–H angle: 109.5° → 107°.", dur:1600, step:function(t){ s.sq = t; }, pause:700 },
      { cap:"Hide the lone pair: the atoms make a trigonal pyramid, ≈ 107°.", dur:900, step:function(t){ s.hide = t; s.lab = t; }, pause:0 }
    ], id);
  }
  rep.addEventListener("click", function(){ if (MV.reduceMotion) final(); else play(); });
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Shape predictor ----------
function stepperHTML(key, label, val, dn, up, what){
  return '<span class="vs-stp"><span class="vs-sl">' + label + '</span><button type="button" class="btn ghost sm vs-sb" data-stp="' + key + '" data-d="-1" data-k="stp' + key + 'd" aria-label="' + esc("Fewer " + what) + '"' + (dn ? "" : " disabled") + '>−</button><output class="vs-sv">' + val + '</output><button type="button" class="btn ghost sm vs-sb" data-stp="' + key + '" data-d="1" data-k="stp' + key + 'u" aria-label="' + esc("More " + what) + '"' + (up ? "" : " disabled") + ">+</button></span>";
}
function readRows(C, m, flash){
  var x = m.x, e = m.e, n = x + e, sp = m.sp, mb = sp ? Math.max.apply(null, sp.out.map(function(a){ return a.bo; })) : 1, k = x + "|" + e, id = sp && sp.id, R = C.rows;
  var pred;
  if (m.lpAx) pred = "Not a VSEPR prediction: lone pairs go equatorial.";
  else if (!e) pred = id === "ch4" ? "109.5° (109.5° measured)" : IDEAL[n];
  else pred = { "2|1":"Less than 120°", "3|1":"Less than 109.5°" + (id === "nh3" ? " (≈ 107° measured)" : id ? "" : " (≈ 107° measured in NH₃)"),
    "2|2":"Less than 109.5°" + (id === "h2o" ? " (≈ 104.5° measured)" : id ? "" : " (≈ 104.5° measured in H₂O)"), "4|1":"Less than 90° (axial–equatorial) and less than 120° (equatorial)",
    "3|2":"Less than 90°", "2|3":"180°", "5|1":"Less than 90°", "4|2":"90°" }[k];
  var lpPos = n < 5 ? "—" : !e ? "No lone pairs" : n === 5 ? (m.lpAx ? "Axial (3 neighbours at 90°): not favoured" : e === 3 ? "All three equatorial" : e === 2 ? "Both equatorial" : "Equatorial") : e === 1 ? "Any one of the six positions (all equivalent)" : "Opposite each other";
  var rows = [[R.axe, axeH(x, e)], [R.groups, n + (mb > 1 ? ' <span class="vs-note">' + (mb === 3 ? "A triple bond counts as 1" : "A double bond counts as 1") + "</span>" : "")],
    [R.arr, cap1(ARR[n])], [R.shape, cap1(SHP[k]) + (m.lpAx ? ' <span class="vs-note">(a try: the real shape puts lone pairs equatorial)</span>' : "")], [R.ideal, IDEAL[n]], [R.pred, pred], [R.lpPos, lpPos]];
  return rows.map(function(r, i){ return '<div class="' + (flash === i ? "vs-flash" : "") + '"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
}
function explore(host, api){
  var C = api.content, S = api.S, M = C.msgs;
  if (["build", "species", "lab"].indexOf(S.mode) < 0) S.mode = "build";
  if (!ok13(S.bx, S.be)) { S.bx = 4; S.be = 0; }
  if (C.species.indexOf(S.sp) < 0) S.sp = "ch4";
  S.lpAx = !!S.lpAx; S.lp = S.lp !== false; S.poly = !!S.poly; S.ideal = !!S.ideal;
  S.sel = Array.isArray(S.sel) ? S.sel.filter(function(v){ return typeof v === "number"; }).slice(0, 3) : [];
  S.cmp = S.cmp && typeof S.cmp === "object" ? S.cmp : {};
  var lastKey = "", busy = false, ov = null, growK = 1, growT = null, flash = -1, capTxt = "";
  var CP = C.compare;
  host.innerHTML = '<p class="how vs-how">' + C.how + '</p><div class="vs-mode"></div>' +
    '<div class="vs-ctl"><div class="vs-bld"><div class="vs-steps"></div><div class="vs-spot"></div></div><div class="vs-spp"></div></div>' +
    '<div class="vs-togs">' + ["lp", "poly", "ideal"].map(function(k){ return '<button type="button" class="btn ghost sm vs-tog" data-tog="' + k + '" data-k="tog' + k + '" aria-pressed="false">' + C.toggles[k] + "</button>"; }).join("") + "</div>" +
    '<div class="vs-grid"><div class="vs-left" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="vs-v"></div><p class="vs-cap" aria-live="polite"></p>' +
    '<div class="vs-labbar"><p class="vs-labtxt">' + C.lab + '</p><button type="button" class="btn ghost sm" data-lab="clear" data-k="labclear">Clear the atoms</button></div></div>' +
    '<div class="vs-right"><div class="vs-lew"><h4 class="vs-h4">Lewis structure</h4><svg class="vs-lsvg" viewBox="0 0 300 220" role="img" aria-label=""></svg></div><dl class="read vs-read" aria-live="polite"></dl></div></div>' +
    '<div class="vs-cmp"><h4 class="vs-h4">' + CP.title + '</h4><p class="tiny muted">' + CP.intro + '</p><div class="vs-slots">' + [1, 2].map(function(k){
      return '<div class="vs-slot" data-slot="' + k + '"><label class="vs-sel"><span class="rg-lab">' + CP.slot + " " + k + '</span><select data-cs="' + k + '" data-k="cs' + k + '"><option value="">Choose…</option>' + C.species.map(function(id){ return '<option value="' + id + '">' + esc(fp(SP[id])) + "</option>"; }).join("") + '</select></label><div class="vs-ca"></div><button type="button" class="btn ghost sm" data-show="' + k + '" data-k="show' + k + '">Show it</button></div>';
    }).join("") + "</div></div>";
  var V = viewer($(".vs-v", host), { hits:true, onPaint:placeHits }), read = $(".vs-read", host), lsvg = $(".vs-lsvg", host), capE = $(".vs-cap", host), hits = V.hits;
  var RG = {};
  RG.mode = radios($(".vs-mode", host), { label:"Mode", aria:"Shape predictor mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; S.sel = []; capTxt = ""; grow(); changed(); } });
  RG.sp = radios($(".vs-spp", host), { label:"Species", aria:"Real species", cls:"chips vs-spc", options:C.species.map(function(id){ return { id:id, t:SP[id].fh }; }), value:S.sp, onChange:function(v){ S.sp = v; S.sel = []; capTxt = ""; grow(); changed(); } });
  RG.spot = radios($(".vs-spot", host), { label:C.lpSpot.label, aria:C.lpSpot.label, options:[{ id:"eq", t:C.lpSpot.eq }, { id:"ax", t:C.lpSpot.ax }], value:S.lpAx ? "ax" : "eq", onChange:function(v){ S.lpAx = v === "ax"; grow(); changed(); } });
  RG.ca = [1, 2].map(function(k){ return radios($('[data-slot="' + k + '"] .vs-ca', host), { label:CP.angle, aria:CP.angle + " for species " + k, cls:"chips", options:CP.angles, value:S.cmp["a" + k] || "", onChange:function(v){ S.cmp["a" + k] = v; api.save(); MV.changed(); } }); });
  [1, 2].forEach(function(k){ $('[data-cs="' + k + '"]', host).value = S.cmp["s" + k] || ""; });
  function spotOK(){ var n = S.bx + S.be; return n === 5 && (S.be === 1 || S.be === 2); }
  function cur(){ return S.mode === "build" ? model(S.bx, S.be, { lpAx:S.lpAx && spotOK(), len:growK }) : model(SP[S.sp].x, SP[S.sp].e, { sp:S.sp, len:growK }); }
  function grow(){
    if (growT) { growT(); growT = null; }
    if (MV.reduceMotion || ov) { growK = 1; return; }
    growK = 0.35;
    growT = MV.tween({ dur:320, step:function(t){ growK = 0.35 + 0.65 * t; if (!ov) drawModel(); }, done:function(){ growT = null; growK = 1; if (!ov) drawModel(); } });
  }
  function labArcs(m){
    var s = S.sel; if (s.length < 3 || s.indexOf(0) < 0) return [];
    var o = s.filter(function(i){ return i !== 0; }); if (o.length !== 2) return [];
    var v = niceAng(angDeg(m.atoms[o[0] - 1].di, m.atoms[o[1] - 1].di));
    return [{ i:o[0] - 1, j:o[1] - 1, txt:arcLab(m, { v:v }, S.ideal) }];
  }
  function opts(m){
    var arcs = S.mode === "lab" ? labArcs(m) : defArcs(m).map(function(a){ return { i:a.i, j:a.j, txt:arcLab(m, a, S.ideal) }; }), rings = {};
    if (S.mode === "lab") S.sel.forEach(function(i){ rings[i] = "sel"; });
    return { lp:S.lp, poly:S.poly, ideal:S.ideal, arcs:arcs, rings:rings };
  }
  function drawModel(){
    var m = ov ? ov.m : cur(), key = ov ? (ov.key || "ov") : S.mode === "build" ? "b" + S.bx + "|" + S.be + (S.lpAx && spotOK() ? "a" : "") : "s" + S.sp;
    V.draw(m, ov ? ov.o : opts(m), key !== lastKey); lastKey = key;
  }
  function labName(i){ var sp = SP[S.sp]; return i === 0 ? "central " + sp.c : sp.out[i - 1].el + " " + i; }
  function placeHits(pos){
    if (!hits) return;
    var lab = S.mode === "lab" && !ov;
    hits.hidden = !lab; if (!lab) return;
    var bs = $$("[data-hit]", hits);
    if (bs.length !== pos.length) {
      MV.keepFocus(hits, function(){ hits.innerHTML = pos.map(function(_, i){ return '<button type="button" class="vs-hit" data-hit="' + i + '" data-k="hit' + i + '"></button>'; }).join(""); });
      bs = $$("[data-hit]", hits);
    }
    bs.forEach(function(b, i){
      var p = pos[i]; b.style.left = r1(p[0] / V.V.W * 100) + "%"; b.style.top = r1(p[1] / V.V.H * 100) + "%";
      var on = S.sel.indexOf(i) >= 0; b.classList.toggle("on", on); b.disabled = busy;
      b.setAttribute("aria-label", labName(i) + (on ? ", chosen" : "") + ". Press to " + (on ? "unchoose" : "choose") + " it for the angle.");
    });
  }
  function paintCtl(){
    var md = S.mode, can = function(x, e){ return ok13(x, e); };
    $(".vs-bld", host).hidden = md !== "build"; $(".vs-spp", host).hidden = md === "build";
    $(".vs-labbar", host).hidden = md !== "lab"; $(".vs-lew", host).hidden = md === "build";
    var stH = $(".vs-steps", host);
    MV.keepFocus(stH, function(){ stH.innerHTML = stepperHTML("x", "Bonded atoms X", S.bx, !busy && can(S.bx - 1, S.be), !busy && can(S.bx + 1, S.be), "bonded atoms") + stepperHTML("e", "Lone pairs E", S.be, !busy && can(S.bx, S.be - 1), !busy && can(S.bx, S.be + 1), "lone pairs"); });
    $(".vs-spot", host).hidden = !spotOK(); RG.spot.set(S.lpAx ? "ax" : "eq");
    RG.mode.set(md); RG.sp.set(S.sp);
    $$("[data-tog]", host).forEach(function(b){ b.setAttribute("aria-pressed", String(!!S[b.dataset.tog])); b.disabled = busy; });
    [RG.mode, RG.sp, RG.spot].concat(RG.ca).forEach(function(r){ r.lock(busy); });
    $$(".vs-cmp select, .vs-cmp [data-show], [data-lab]", host).forEach(function(b){ b.disabled = busy; });
  }
  function paintLab(){
    if (S.mode !== "lab" || ov) return;
    var m = cur(), s = S.sel, t = "";
    if (s.length === 3) {
      if (s.indexOf(0) < 0) t = "Include the central atom: a bond angle is measured at the central atom.";
      else { var o = s.filter(function(i){ return i !== 0; }), sp = SP[S.sp], v = niceAng(angDeg(m.atoms[o[0] - 1].di, m.atoms[o[1] - 1].di)), r = realAng(m, v);
        t = sp.out[o[0] - 1].el + "–" + sp.c + "–" + sp.out[o[1] - 1].el + " angle: " + r.w + (r.exact ? "" : "; ideal " + fmtA(v)) + "."; }
    } else t = s.length ? "Chosen: " + s.map(labName).join(", ") + ". Choose " + (3 - s.length) + " more." : "";
    capTxt = t;
  }
  function paint(){
    paintCtl(); paintLab();
    var m = cur(), sp = SP[S.sp];
    read.innerHTML = readRows(C, ov && ov.rm ? ov.rm : m, flash);
    if (S.mode !== "build") { var G = geo2(sp, sp.st, { W:300, H:220, rb:74 }); lsvg.innerHTML = lewisSVG(sp, sp.st, G); lsvg.setAttribute("aria-label", lewisDesc(sp, sp.st)); }
    capE.textContent = capTxt;
    drawModel();
  }
  function changed(){ api.save(); paint(); MV.changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.stp) { var d = +b.dataset.d; if (b.dataset.stp === "x") S.bx += d; else S.be += d; if (!ok13(S.bx, S.be)) { if (b.dataset.stp === "x") S.bx -= d; else S.be -= d; return; } capTxt = ""; grow(); changed(); return; }
    if (b.dataset.tog) { S[b.dataset.tog] = !S[b.dataset.tog]; changed(); return; }
    if (b.dataset.hit != null) { var i = +b.dataset.hit, k = S.sel.indexOf(i); if (k >= 0) S.sel.splice(k, 1); else { if (S.sel.length >= 3) S.sel = []; S.sel.push(i); } api.save(); paint(); return; }
    if (b.dataset.lab === "clear") { S.sel = []; api.save(); paint(); return; }
    if (b.dataset.show) { var id = S.cmp["s" + b.dataset.show]; if (id) { if (S.mode === "build") S.mode = "species"; S.sp = id; S.sel = []; capTxt = ""; grow(); changed(); V.svg.focus({ preventScroll:true }); } }
  });
  host.addEventListener("change", function(e){ var k = e.target.dataset && e.target.dataset.cs; if (!k) return; S.cmp["s" + k] = e.target.value; api.save(); MV.changed(); });
  paint();

  // ----- predictions -----
  function lock(b){ busy = b; paint(); }
  function anim(dur, step, done){ MV.tween({ dur:dur, step:step, done:done }); }
  function setCap(t){ capTxt = t; capE.textContent = t; }
  var K = C.caps;
  var hooks = {
    start:function(p){
      if (growT) { growT(); growT = null; } growK = 1; flash = -1;
      if (p.id === "p1") { S.mode = "species"; S.sp = "nh3"; S.sel = []; ov = { m:model(3, 1, { sp:"nh3", theta:120 }), o:{ lp:false, poly:false } }; ov.o.aria = describe3(ov.m, ov.o); setCap(K.p1a); }
      else if (p.id === "p2") { S.mode = "lab"; S.sp = "h2o"; S.sel = [1, 0, 2]; ov = { m:model(2, 2, { sp:"h2o", comp:0 }), o:{ lp:S.lp, arcs:[{ i:0, j:1, txt:"109.5°" }], rings:{ 0:"sel", 1:"sel", 2:"sel" } } }; setCap(K.p2a); }
      else if (p.id === "p3") { S.mode = "build"; S.bx = 4; S.be = 1; S.lpAx = false; ov = { key:"p3", m:model(4, 1, { lpAx:true }), o:{ lp:true, lpOp:0 } }; lastKey = "p3"; var bv = bestView(model(4, 1, {})); V.V.best = bv; V.V.R.x = bv.x; V.V.R.y = bv.y; setCap(""); }
      else { S.mode = "species"; S.sp = "co2"; S.sel = []; ov = { m:model(2, 0, { sp:"co2", len:0.001 }), o:{} }; setCap(K.p4a); }
      api.save(); lock(true); setCap(capTxt);
    },
    run:function(p, done){
      function end(t){ ov = null; flash = -1; lock(false); setCap(t || ""); api.save(); MV.changed(); done(); }
      if (p.id === "p1") {
        setCap(K.p1b);
        anim(1600, function(t){ ov.m = model(3, 1, { sp:"nh3", theta:lerp(120, 107, t) }); ov.o = { lp:true, lpOp:t, arcs:t > 0.5 ? [{ i:0, j:1, txt:"≈ 107°" }] : [] }; drawModel(); }, function(){ S.lp = true; MV.wait(600, function(){ end(K.p1c); }); });
        return;
      }
      if (p.id === "p2") {
        anim(1800, function(t){ ov.m = model(2, 2, { sp:"h2o", comp:t }); ov.o = { lp:S.lp, ideal:true, arcs:[{ i:0, j:1, txt:(t >= 1 ? "≈ 104.5" : MV.num(lerp(109.5, 104.5, t), 1)) + "°" }], rings:{ 0:"sel", 1:"sel", 2:"sel" } }; drawModel(); },
          function(){ S.ideal = true; MV.wait(500, function(){ end(K.p2b); }); });
        return;
      }
      if (p.id === "p3") {
        var Ax = model(4, 1, { lpAx:true }), Eq = model(4, 1, {});
        function warnRings(m){ var r = {}; m.atoms.forEach(function(a, i){ if (Math.abs(angDeg(a.d, m.lps[0].d) - 90) < 6) r[i + 1] = "warn"; }); return r; }
        setCap(K.p3a);
        anim(700, function(t){ ov.m = Ax; ov.o = { lp:true, lpOp:t, lpWarn:t > 0.5 ? [0] : [], rings:t > 0.5 ? warnRings(Ax) : {}, note:"Axial: 3 neighbours at 90°", noteC:"var(--p-k)" }; ov.rm = Ax; paint(); }, function(){
          MV.wait(1500, function(){
            anim(1300, function(t){ var m = mixModel(Ax, Eq, t); ov.m = m; ov.o = { lp:true, rings:{} }; ov.rm = t > 0.5 ? Eq : Ax; drawModel(); }, function(){
              ov.m = Eq; ov.o = { lp:true, lpWarn:[0], rings:warnRings(Eq), note:"Equatorial: 2 neighbours at 90° · seesaw", noteC:"var(--ink)" }; ov.rm = Eq; setCap(K.p3b); paint();
              MV.wait(1400, function(){ end(K.p3b); });
            });
          });
        });
        return;
      }
      anim(1100, function(t){ ov.m = model(2, 0, { sp:"co2", len:Math.max(0.001, t) }); ov.o = {}; drawModel(); }, function(){ flash = 1; ov.m = model(2, 0, { sp:"co2" }); ov.o = { arcs:[{ i:0, j:1, txt:"180°" }] }; setCap(K.p4b); paint(); MV.wait(1200, function(){ end(K.p4b); }); });
    }
  };
  // ----- challenges -----
  function shapeTxt(x, e){ return fill(M.build, { axe:axeH(x, e), shape:SHP[x + "|" + e] }); }
  function chal(id){
    var x = S.bx, e = S.be, k = x + "|" + e, m;
    if (id === "tc1") {
      if (k === "2|2") return { ok:true };
      m = M.tc1[{ "2|1":"x2e1", "2|3":"x2e3", "3|1":"x3e1" }[k]];
      return { ok:false, msg:m || shapeTxt(x, e) + " " + M.tc1.other };
    }
    if (id === "tc2") {
      if (k === "4|2") return { ok:true };
      m = M.tc2[{ "4|1":"x4e1", "4|0":"x4e0", "6|0":"x6e0" }[k]];
      return { ok:false, msg:m || shapeTxt(x, e) + " " + M.tc2.other };
    }
    var c = S.cmp, a = c.s1, b = c.s2, T = M.tc3;
    if (!a || !b || !c.a1 || !c.a2) return { ok:false, msg:T.empty };
    if (a === b) return { ok:false, msg:T.same };
    var pair = [a, b].sort().join("+");
    if (pair === "h2o+nh3") return { ok:false, msg:T.h2oNh3 };
    if (pair === "co2+hcn") return { ok:false, msg:T.co2Hcn };
    var A = SP[a], B = SP[b];
    if (a === "xef2" || b === "xef2") { var xa = a === "xef2" ? c.a1 : c.a2, other = a === "xef2" ? B : A; if (xa === "lt120" || xa === "lt109" || shapeOf(other) === "bent") return { ok:false, msg:T.xef2 }; }
    if (shapeOf(A) !== shapeOf(B)) return { ok:false, msg:T.diffShape };
    if (A.x + A.e === B.x + B.e) return { ok:false, msg:T.sameArr };
    function need(sp){ return shapeOf(sp) === "linear" ? "180" : sp.e === 1 ? "lt120" : "lt109"; }
    var bad = [[A, c.a1], [B, c.a2]].filter(function(p){ return p[1] !== need(p[0]); })[0];
    if (bad) return { ok:false, msg:fill(T.angle, { sp:bad[0].fh }) };
    return { ok:true };
  }
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: From formula to shape (a pipeline of stage cards) ----------
// wedge-and-dash templates: bond directions on paper (degrees, 90 = up) and group (0 = in the plane, 1 = the wedge/dash
// pair); lp = where the central lone pairs are drawn
var WD = {
  "4|0":{ b:[[90, 0], [210, 0], [300, 1], [340, 1]] }, "3|1":{ lp:[90], b:[[210, 0], [290, 1], [330, 1]] }, "2|2":{ lp:[60, 120], b:[[232, 0], [308, 0]] },
  "3|0":{ b:[[90, 0], [210, 0], [330, 0]] }, "1|2":{ lp:[120, 240], b:[[0, 0]] }, "5|0":{ b:[[90, 0], [270, 0], [180, 0], [335, 1], [25, 1]] },
  "3|2":{ lp:[335, 25], b:[[90, 0], [270, 0], [180, 0]] }, "5|1":{ lp:[270], b:[[90, 0], [185, 0], [355, 0], [235, 1], [305, 1]] }, "4|2":{ lp:[90, 270], b:[[180, 0], [0, 0], [235, 1], [55, 1]] }
};
var AIDS = { "4|0":["109"], "3|0":["120"], "5|0":["90-120"], "3|2":["lt90"], "5|1":["lt90"], "4|2":["90"] };
function angKeys(sp){ if (sp.id === "o2") return ["none"]; if (sp.id === "h2o") return ["104", "lt109"]; if (sp.id === "h3o") return ["lt109"]; return AIDS[sp.x + "|" + sp.e]; }
function idealKey(sp){ var n = sp.x + sp.e; return n === 4 ? "109" : n === 3 ? "120" : n === 5 ? "90-120" : n === 6 ? "90" : ""; }
function dirName(th){ return ["right", "lower right", "bottom", "lower left", "left", "upper left", "top", "upper right"][Math.round(n360(th) / 45) % 8]; }
function wdSVG(sp, st, sty, o){
  o = o || {};
  var T = WD[sp.x + "|" + sp.e], W = 300, H = 230, cx = 150 + (sp.x === 1 ? -40 : 0), cy = 118, L = 80, h = "";
  (T.lp || []).forEach(function(a){ var u = Math.cos(a * D2R), v = -Math.sin(a * D2R); h += dotPair(cx + u * 27, cy + v * 27, u, v); });
  var ends = T.b.map(function(b, k){
    var a = b[0] * D2R, ux = Math.cos(a), uy = -Math.sin(a), ex = cx + ux * L, ey = cy + uy * L, s = sty[k] || "p", x1 = cx + ux * 16, y1 = cy + uy * 16, x2 = ex - ux * 13, y2 = ey - uy * 13, px = -uy, py = ux;
    if (s === "w") h += '<polygon points="' + [x1 + px, y1 + py, x2 + px * 6, y2 + py * 6, x2 - px * 6, y2 - py * 6, x1 - px, y1 - py].map(r1).join(" ") + '" fill="var(--ink)"/>';
    else if (s === "d") { for (var q = 0; q < 7; q++) { var t = (q + 0.7) / 7, mx = x1 + (x2 - x1) * t, my = y1 + (y2 - y1) * t, hw = 1.2 + 4.8 * t; h += ln(mx + px * hw, my + py * hw, mx - px * hw, my - py * hw, { w:2 }); } }
    else { var bo = st.b[k + 1] || 1, offs = bo === 1 ? [0] : bo === 2 ? [-3.2, 3.2] : [-5, 0, 5]; offs.forEach(function(d){ h += ln(x1 + px * d, y1 + py * d, x2 + px * d, y2 + py * d); }); }
    return { x:ex, y:ey, mx:(x1 + x2) / 2, my:(y1 + y2) / 2 };
  });
  ends.forEach(function(p, k){ var el = sp.out[k].el, c = ballCol(el); h += circ(p.x, p.y, 13, c.fill, { s:c.line !== "none" ? c.line : null, sw:1.5 }) + tx(p.x, p.y + 0.5, el, { fs:el.length > 1 ? 11 : 13, w:700, c:c.ink }); });
  var cc = ballCol(sp.c); h += circ(cx, cy, 15, cc.fill, { s:cc.line !== "none" ? cc.line : null, sw:1.5 }) + tx(cx, cy + 0.5, sp.c, { fs:sp.c.length > 1 ? 12 : 14, w:700, c:cc.ink });
  return { svg:h, ends:ends, W:W, H:H };
}
function part3(host, api){
  var S = api.S, C = api.content, MS = C.msgs, ST = C.stages, all = [];
  C.sets.forEach(function(s){ all = all.concat(s.list); });
  if (all.indexOf(S.sp) < 0) S.sp = all[0];
  S.w = S.w && typeof S.w === "object" ? S.w : {};
  var fb = {}, fv = null, fvSp = null;
  host.innerHTML = '<div class="vs-p3sp">' + C.sets.map(function(s, i){ return '<div class="vs-set" data-set="' + i + '"></div>'; }).join("") + "</div>" +
    '<ol class="vs-track" aria-label="Pipeline stages"></ol><div class="vs-cards"></div><div class="vs-final" hidden><div class="vs-fin"></div><div class="vs-fv"></div><p class="tiny muted vs-fcap"></p></div>' +
    '<details class="alg vs-zoom"><summary>' + C.zoom.title + "</summary><p>" + C.zoom.text + '</p><svg class="vs-zsvg" viewBox="0 0 420 230" role="img" aria-label="' + esc(C.zoom.aria) + '"></svg>' + MV.tableHTML({ head:C.zoom.head, rows:C.zoom.rows, caption:"Measured angles" }) + "</details>";
  var RS = [];
  function W(id){ var sp = SP[id], w = S.w[id]; if (!w || typeof w !== "object") w = S.w[id] = { k:0 }; if (!Array.isArray(w.b) || w.b.length !== sp.x) w.b = sp.out.map(function(){ return 1; }); if (typeof w.lp !== "number") w.lp = 0; if (!Array.isArray(w.wd) || w.wd.length !== sp.x) w.wd = sp.out.map(function(){ return "p"; }); return w; }
  function paintSets(){ C.sets.forEach(function(s, i){ if (RS[i]) RS[i].set(s.list.indexOf(S.sp) >= 0 ? S.sp : ""); }); }
  function st(sp, w){ return { c:0, b:[0].concat(w.b), lp:[w.lp].concat(sp.out.map(function(a, k){ return outLP(a.el, w.b[k]); })) }; }
  function placed(s){ return 2 * sum(s.b) + 2 * sum(s.lp); }
  function chipRow(key, label, opts, val, dis){ return '<div class="vs-crow"><span class="rg-lab">' + label + '</span><span class="rg chips" role="radiogroup" aria-label="' + esc(MV.plain(label)) + '">' + opts.map(function(o, i){ var on = String(o.id) === String(val); return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (val == null && i === 0) ? 0 : -1) + '" data-ch="' + key + '" data-v="' + esc(o.id) + '" data-k="ch' + key + esc(o.id) + '"' + (dis ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</span></div>"; }
  function summary(sp, w, i){
    var s = st(sp, w);
    if (i === 0) return "✓ " + sp.T + " valence electrons";
    if (i === 1) return "✓ Lewis structure: " + sp.T + " electrons placed; " + pl(w.lp, "lone pair") + " on " + sp.c + ".";
    if (i === 2) return "✓ " + axeH(sp.x, sp.e);
    if (i === 3) return "✓ " + cap1(ARR[sp.x + sp.e]) + " arrangement";
    if (i === 4) return "✓ " + cap1(shapeOf(sp)) + " shape";
    if (i === 5) return "✓ " + C.angles.filter(function(a){ return a.id === w.ang; })[0].t;
    return "✓ Wedge-and-dash drawing";
  }
  function cardBody(sp, w, i){
    var s = st(sp, w), h = "";
    if (i === 0) return '<label class="vs-num">Valence electrons <input class="numin" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" data-ve="1" data-k="p3ve" value="' + esc(w.ve || "") + '"></label>';
    if (i === 1) {
      var G = geo2(sp, s, { W:300, H:220, rb:74 }), P = placed(s), ce = 2 * sum(w.b) + 2 * w.lp;
      h += '<div class="vs-lb"><svg class="vs-lsvg" viewBox="0 0 300 220" role="img" aria-label="' + esc(lewisDesc(sp, s)) + '">' + lewisSVG(sp, s, G) + '</svg><div class="vs-lbc">';
      sp.out.forEach(function(a, k){
        var nm = "Bond to " + a.el + (sp.x > 1 ? " (" + dirName(G.atoms[k + 1].th) + ")" : "");
        if (a.el === "O" || a.el === "N" || a.el === "C") h += chipRow("b" + k, nm, [{ id:1, t:"single" }, { id:2, t:"double" }, { id:3, t:"triple" }], w.b[k]);
        else if (k === sp.out.map(function(z){ return z.el; }).indexOf(a.el)) h += '<p class="vs-fix">Bonds to ' + a.el + ": single (" + a.el + " forms one bond).</p>";
      });
      h += '<div class="vs-crow">' + stepperHTML("lp", "Lone pairs on " + sp.c, w.lp, w.lp > 0, w.lp < 3, "lone pairs on the central atom") + "</div>";
      h += '<p class="vs-cnt" aria-live="polite">Electrons placed: <strong>' + P + "</strong> of " + sp.T + " · around " + sp.c + ": <strong>" + ce + "</strong></p></div></div>";
      return h;
    }
    if (i === 2) return chipRow("x", "X (bonded atoms)", [1, 2, 3, 4, 5, 6].map(function(v){ return { id:v, t:String(v) }; }), w.x) + chipRow("e", "E (lone pairs)", [0, 1, 2, 3].map(function(v){ return { id:v, t:String(v) }; }), w.e);
    if (i === 3) return chipRow("arr", "Arrangement", [2, 3, 4, 5, 6].map(function(n){ return { id:ARR[n], t:cap1(ARR[n]) }; }), w.arr);
    if (i === 4) return chipRow("shp", "Shape", SHAPES.map(function(x){ return { id:x, t:cap1(x) }; }), w.shp);
    if (i === 5) return chipRow("ang", "Bond angle", C.angles, w.ang);
    var D = wdSVG(sp, s, w.wd);
    h += '<div class="vs-wd"><div class="vs-wds"><svg class="vs-wdsvg" viewBox="0 0 ' + D.W + " " + D.H + '" role="img" aria-label="' + esc("Wedge-and-dash drawing of " + fp(sp) + ": " + sp.out.map(function(a, k){ return a.el + " " + C.styles[w.wd[k]].toLowerCase(); }).join(", ") + ".") + '">' + D.svg + "</svg>" +
      D.ends.map(function(p, k){ return '<button type="button" class="vs-bh" data-wd="' + k + '" data-k="wd' + k + '" style="left:' + r1(p.mx / D.W * 100) + "%;top:" + r1(p.my / D.H * 100) + '%" aria-label="' + esc("Bond " + (k + 1) + " to " + sp.out[k].el + ": " + C.styles[w.wd[k]] + ". Press to change.") + '"></button>'; }).join("") + "</div>" +
      '<ul class="vs-wdl">' + sp.out.map(function(a, k){ return "<li>Bond " + (k + 1) + " (" + a.el + "): <strong>" + C.styles[w.wd[k]] + "</strong></li>"; }).join("") + "</ul></div>";
    return h;
  }
  function track(sp, w){
    var names = ["Formula"].concat(ST.map(function(s){ return s.t; }));
    $(".vs-track", host).innerHTML = names.map(function(t, i){ var d = i === 0 || i - 1 < w.k, c = i - 1 === w.k; return '<li class="' + (d ? "done" : c ? "cur" : "") + '"' + (c ? ' aria-current="step"' : "") + '><span class="mk" aria-hidden="true">' + (d ? "✓" : i + 1) + "</span>" + (i === 0 ? sp.fh : t) + (d && i ? '<span class="vh"> (done)</span>' : "") + "</li>"; }).join("");
  }
  function paint(){
    var sp = SP[S.sp], w = W(S.sp), cards = $(".vs-cards", host), h = '<div class="vs-card done"><h4 class="vs-h4">Formula: ' + sp.fh + "</h4></div>";
    track(sp, w);
    for (var i = 0; i < Math.min(w.k + 1, ST.length); i++) {
      var on = i === w.k;
      h += '<div class="vs-card' + (on ? " cur" : " done") + '" data-stage="' + i + '"><h4 class="vs-h4">' + (i + 1) + ". " + ST[i].t + "</h4>";
      if (on) h += "<p>" + fill(ST[i].q, { sp:sp.fh }) + "</p>" + cardBody(sp, w, i) + '<div class="q-actions"><button type="button" class="btn primary sm" data-p3="check" data-k="p3chk' + i + '">Check</button></div>' + (fb[i] ? (fb[i].ok ? MV.fbHTML("good", fb[i].t) : fb[i].soft ? MV.fbHTML("", fb[i].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + fb[i].t + " Try again.")) : "");
      else h += '<p class="vs-sum">' + summary(sp, w, i) + (fb[i] && fb[i].ok && fb[i].note ? " " + fb[i].note : "") + "</p>" + (i === 1 ? '<svg class="vs-mini" viewBox="0 0 300 220" aria-hidden="true">' + lewisSVG(sp, st(sp, w), geo2(sp, st(sp, w), { W:300, H:220, rb:74 })) + "</svg>" : "") +
        (i === 6 ? '<svg class="vs-mini" viewBox="0 0 300 230" aria-hidden="true">' + wdSVG(sp, st(sp, w), w.wd).svg + "</svg>" : "");
      h += "</div>";
    }
    MV.keepFocus(cards, function(){ cards.innerHTML = h; });
    var fin = $(".vs-final", host);
    fin.hidden = w.k < ST.length;
    if (w.k >= ST.length) {
      $(".vs-fin", host).innerHTML = MV.fbHTML("good", "<strong>✓ " + sp.fh + ":</strong> " + axeH(sp.x, sp.e) + " → " + ARR[sp.x + sp.e] + " arrangement → " + shapeOf(sp) + " → " + C.angles.filter(function(a){ return a.id === w.ang; })[0].t + ". " + MS.done);
      if (!fv) fv = viewer($(".vs-fv", host), {});
      var m = model(sp.x, sp.e, { sp:sp.id });
      fv.draw(m, { lp:true, arcs:defArcs(m).map(function(a){ return { i:a.i, j:a.j, txt:arcLab(m, a, false) }; }) }, fvSp !== sp.id); fvSp = sp.id;
      $(".vs-fcap", host).textContent = "Turn the model (drag or arrow keys) and compare it with your wedge-and-dash drawing: use the Front view.";
    }
  }
  function check(){
    var sp = SP[S.sp], w = W(S.sp), i = w.k, r = null, s = st(sp, w), L = MS;
    if (i === 0) {
      var v = MV.parseNum(String(w.ve || "").trim()), sv = sum(sp.at.map(function(el){ return VAL[el]; })), sz = sum(sp.at.map(function(el){ return ZN[el]; }));
      if (!v || v.length !== 1 || Math.round(v[0]) !== v[0]) r = { soft:true, t:L.ve.num };
      else if (v[0] === sp.T) r = { ok:true };
      else if (sp.q && v[0] === sv) r = { t:L.ve.charge };
      else if (sp.q && v[0] === sv + sp.q) r = { t:L.ve.sign };
      else if (v[0] === sz || v[0] === sz - sp.q) r = { t:L.ve.atomic };
      else r = { t:L.ve.general };
    } else if (i === 1) {
      var P = placed(s), ce = 2 * sum(w.b) + 2 * w.lp;
      if (P > sp.T) r = { t:fill(L.lewis.over, { n:P, t:sp.T }) };
      else if (P < sp.T) r = { t:fill(L.lewis.under, { n:P, t:sp.T }) };
      else if (PER[sp.c] === 2 && ce > 8) r = { t:fill(L.lewis.p2, { el:sp.c }) };
      else if (sp.c !== "B" && ce < 8) r = { t:fill(L.lewis.short, { n:ce }) };
      else r = { ok:true };
    } else if (i === 2) {
      if (w.x == null || w.e == null) r = { soft:true, t:L.axe.pick };
      else if (+w.x === sp.x && +w.e === sp.e) r = { ok:true };
      else { var t = []; if (+w.x !== sp.x) t.push(+w.x === sum(w.b) && sum(w.b) !== sp.x ? L.axe.m1 : L.axe.x); if (+w.e !== sp.e) t.push(L.axe.e); r = { t:t.join(" ") }; }
    } else if (i === 3) {
      var n = sp.x + sp.e;
      if (!w.arr) r = { soft:true, t:L.pick };
      else if (w.arr === ARR[n]) r = { ok:true };
      else r = { t:sp.e && w.arr === ARR[sp.x] ? L.arr.m3 : L.arr.general };
    } else if (i === 4) {
      var good = shapeOf(sp), ax = sp.x + sp.e === 5 && sp.e ? "trigonal pyramidal" : "";
      if (!w.shp) r = { soft:true, t:L.pick };
      else if (w.shp === good) r = { ok:true };
      else if (sp.id === "o2") r = { t:L.shape.two };
      else if (sp.e && w.shp === ARR[sp.x + sp.e]) r = { t:fill(L.shape.m2, { arr:ARR[sp.x + sp.e] }) };
      else if (ax && w.shp === ax) r = { t:L.shape.m5 };
      else if (sp.e && w.shp === SHP[sp.x + "|0"]) r = { t:L.shape.m3 };
      else r = { t:L.shape.general };
    } else if (i === 5) {
      var ks = angKeys(sp);
      if (!w.ang) r = { soft:true, t:L.pick };
      else if (ks.indexOf(w.ang) >= 0) r = { ok:true, note:sp.id === "h2o" && w.ang === "lt109" ? L.angle.h2o : "" };
      else if (sp.id === "o2") r = { t:L.angle.none };
      else if (w.ang === "none") r = { t:L.angle.notNone };
      else if (sp.id === "h3o" && w.ang === "107") r = { t:L.angle.h3o };
      else if (sp.e && (w.ang === idealKey(sp) || (sp.x + sp.e >= 5 && /^90/.test(w.ang)))) r = { t:L.angle.m4 };
      else if (!sp.e && /^lt/.test(w.ang)) r = { t:L.angle.eq };
      else r = { t:L.angle.general };
    } else {
      var T = WD[sp.x + "|" + sp.e], nw = 0, nd = 0, pairOk = true, flatOk = true, hasPair = T.b.some(function(b){ return b[1]; });
      T.b.forEach(function(b, k){ var y = w.wd[k]; if (y === "w") nw++; if (y === "d") nd++; if (b[1] === 0 && y !== "p") flatOk = false; });
      var pv = T.b.map(function(b, k){ return b[1] ? w.wd[k] : null; }).filter(function(y){ return y; }).sort().join("");
      pairOk = !hasPair || pv === "dw";
      if (flatOk && pairOk) r = { ok:true };
      else if (!hasPair) r = { t:L.wedge.flat };
      else if (!nw && !nd) r = { t:sp.id === "ch4" ? L.wedge.m7 : L.wedge.depth };
      else if (nw > 1 || nd > 1) r = { t:L.wedge.crowd };
      else if (nw !== nd) r = { t:L.wedge.partner };
      else r = { t:L.wedge.which };
    }
    if (r.ok) { r.t = "<strong>✓ Correct.</strong>" + (r.note ? " " + r.note : ""); fb[i] = r; w.k = i + 1; if (w.k >= ST.length) rebuildSets(); }
    else fb[i] = r;
    api.save(); paint();
    var card = $('[data-stage="' + Math.min(w.k, ST.length - 1) + '"]', host);
    if (r.ok) { var nx = w.k >= ST.length ? $(".vs-final", host) : card; if (nx) { var f = nx.querySelector("input, [data-ch], button:not([disabled])"); if (f && w.k < ST.length) f.focus({ preventScroll:true }); nx.scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" }); } }
    else MV.focusFb($('[data-stage="' + i + '"]', host));
  }
  function rebuildSets(){
    C.sets.forEach(function(s, i){
      var old = $('[data-set="' + i + '"]', host), nw = old.cloneNode(false); old.parentNode.replaceChild(nw, old);
      RS[i] = radios(nw, { label:s.t, aria:s.t, cls:"chips", options:s.list.map(function(id){ return { id:id, t:SP[id].fh + (W(id).k >= ST.length ? ' <span aria-label="done">✓</span>' : "") }; }), value:s.list.indexOf(S.sp) >= 0 ? S.sp : "", onChange:function(v){ S.sp = v; fb = {}; api.save(); paintSets(); paint(); } });
    });
  }
  var cardsH = $(".vs-cards", host);
  cardsH.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var sp = SP[S.sp], w = W(S.sp), i = w.k;
    if (b.dataset.ch) {
      var k = b.dataset.ch, v = b.dataset.v;
      if (k.charAt(0) === "b" && k !== "b") w.b[+k.slice(1)] = +v; else if (k === "x" || k === "e") w[k] = +v; else w[k] = v;
      fb[i] = null; api.save(); paint(); return;
    }
    if (b.dataset.stp === "lp") { w.lp = clamp(w.lp + (+b.dataset.d), 0, 3); fb[i] = null; api.save(); paint(); return; }
    if (b.dataset.wd != null) { var j = +b.dataset.wd, nx = { p:"w", w:"d", d:"p" }; w.wd[j] = nx[w.wd[j]] || "p"; fb[i] = null; api.save(); paint(); var f = cardsH.querySelector('[data-wd="' + j + '"]'); if (f) f.focus({ preventScroll:true }); return; }
    if (b.dataset.p3 === "check") check();
  });
  cardsH.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.ve) { e.preventDefault(); check(); return; }
    var b = e.target.closest("[data-ch]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$('[data-ch="' + b.dataset.ch + '"]', cardsH), nx = all[(all.indexOf(b) + d + all.length) % all.length]; nx.click(); var f = cardsH.querySelector('[data-ch="' + b.dataset.ch + '"][data-v="' + nx.dataset.v + '"]'); if (f) f.focus();
  });
  cardsH.addEventListener("input", function(e){ if (e.target.dataset && e.target.dataset.ve) { W(S.sp).ve = e.target.value; api.save(); } });
  // zoom panel: measured angle vs lone pairs
  (function(){
    var sv = $(".vs-zsvg", host), X0 = 70, X1 = 380, Y0 = 190, Y1 = 24, lo = 102, hi = 111, h = "";
    function px(n){ return X0 + 30 + n * (X1 - X0 - 60) / 2; } function py(v){ return Y0 - (v - lo) / (hi - lo) * (Y0 - Y1); }
    for (var v = 103; v <= 111; v += 2) h += ln(X0, py(v), X1, py(v), { c:"var(--plot-grid)", w:1 }) + tx(X0 - 8, py(v), v + "°", { a:"end", fs:12, c:"var(--ink-2)" });
    h += ln(X0, Y0, X1, Y0, { c:"var(--plot-axis)", w:1.6 }) + ln(X0, Y0, X0, Y1, { c:"var(--plot-axis)", w:1.6 });
    [0, 1, 2].forEach(function(n){ h += tx(px(n), Y0 + 14, String(n), { fs:12, c:"var(--ink-2)" }); });
    h += tx((X0 + X1) / 2, Y0 + 32, "Lone pairs on the central atom", { fs:12, w:700, c:"var(--ink-2)" }) + tx(X0 - 56, Y1 - 10, "Bond angle", { a:"start", fs:12, w:700, c:"var(--ink-2)" });
    var D = [[0, 109.5, "CH₄ 109.5°"], [1, 107, "NH₃ ≈ 107°"], [2, 104.5, "H₂O ≈ 104.5°"]];
    h += '<polyline points="' + D.map(function(d){ return r1(px(d[0])) + "," + r1(py(d[1])); }).join(" ") + '" fill="none" stroke="var(--pen)" stroke-width="2.4" stroke-dasharray="6 5"/>';
    D.forEach(function(d){ h += circ(px(d[0]), py(d[1]), 6, "var(--pen)") + tx(px(d[0]) + (d[0] === 2 ? -10 : 10), py(d[1]) - 14, d[2], { a:d[0] === 2 ? "end" : "start", fs:13, w:700, halo:true }); });
    sv.innerHTML = h;
  })();
  rebuildSets(); paint();
}

// ---------- Practice 2: Shapes and angles (number entry, chips and a two-part investigation item) ----------
function anglesAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { v:"", pick:null, pa:null, pb:null, tries:0, hint:0, solved:false, first:null }); }
  function chips(it, key, opts, val, dis, label){ return (label ? '<p class="vs-plab">' + label + "</p>" : "") + '<div class="chips vs-chiplist" role="radiogroup" aria-label="' + esc(label || "Choices") + '">' + opts.map(function(o, k){ var on = val === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" tabindex="' + (on || (val == null && k === 0) ? 0 : -1) + '" data-op="' + key + '" data-i="' + k + '" data-k="' + it.id + key + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>"; }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ai="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += '<label class="numrow vs-numrow"><span>' + it.label + '</span><input class="numin" data-av="' + it.id + '" data-k="' + it.id + 'in" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.v) + '"' + dis + ">" + (it.unit ? "<span>" + it.unit + "</span>" : "") + "</label>";
    else if (it.kind === "chips") h += chips(it, "pick", it.options, x.pick, dis);
    else h += it.parts.map(function(p, k){ return chips(it, k ? "pb" : "pa", p.options, k ? x.pb : x.pa, dis, p.label); }).join("");
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) {
      var why = it.kind === "num" ? "<strong>✓ Correct: " + MV.ans(it) + (it.unit || "") + ".</strong>" : it.kind === "chips" ? "<strong>✓ Correct: " + it.options[x.pick].t + ".</strong> " + (it.options[x.pick].why || "") : "<strong>✓ Correct.</strong> " + it.why;
      h += MV.fbHTML("good", why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(q){ return q.id === id; })[0]; }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.av; if (id) { ist(id).v = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.av) { var c = host.querySelector('[data-k="' + e.target.dataset.av + 'chk"]'); if (c) c.click(); return; }
    var b = e.target.closest("[data-op]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = Array.prototype.slice.call(b.parentNode.querySelectorAll("[data-op]")), nx = all[(all.indexOf(b) + d + all.length) % all.length]; nx.click(); var f = host.querySelector('[data-k="' + nx.dataset.k + '"]'); if (f) f.focus();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ai]"); if (!bx) return;
    var it = item(bx.dataset.ai), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op) { x[b.dataset.op] = +b.dataset.i; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act !== "check") return;
    var ok = false, t = "";
    if (it.kind === "num") {
      var v = MV.parseNum(String(x.v || "").replace(/°/g, "").trim());
      if (!v || v.length !== 1) { msgs[it.id] = { soft:true, t:"Enter a number." }; paint(); return; }
      ok = Math.abs(v[0] - MV.ans(it)) < 1e-6;
      if (!ok) { var w = (it.wrong || []).filter(function(z){ return Math.abs(z.v - v[0]) < 1e-6; })[0]; t = w ? w.fb : it.general; }
    } else if (it.kind === "chips") {
      if (x.pick == null) { msgs[it.id] = { soft:true, t:"Choose an answer first." }; paint(); return; }
      ok = MV.ok(it.options[x.pick]); t = it.options[x.pick].why;
    } else {
      if (x.pa == null || x.pb == null) { msgs[it.id] = { soft:true, t:"Choose an answer in both rows." }; paint(); return; }
      var A = MV.ok(it.parts[0].options[x.pa]), B = MV.ok(it.parts[1].options[x.pb]); ok = A && B;
      t = (A ? it.parts[0].label + " ✓. " : "") + (B ? it.parts[1].label + " ✓. " : "") + it.fb;
    }
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:t }; }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-ai="' + it.id + '"]'));
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Lone pairs in charge (X and E steppers, live 3D model with ideal-angle arcs) ----------
var task = (function(){
  var S = null, api = null, T = null, V = null, lastTK = "";
  function read(){ return { x:S ? +S.x : 0, e:S ? +S.e : 0 }; }
  function pairs(d){ var m = model(d.x, d.e, { comp:0 }), has = {}; defArcs(m, true).forEach(function(a){ has[a.v] = 1; }); return has; }
  function paint(inp){
    var d = read(), m = model(d.x, d.e, { comp:0 }), arcs = defArcs(m, true).map(function(a){ return { i:a.i, j:a.j, txt:fmtA(a.v) }; });
    MV.keepFocus(inp, function(){ $(".vs-tst", inp).innerHTML = stepperHTML("x", T.inputs.x, d.x, ok13(d.x - 1, d.e), ok13(d.x + 1, d.e), "bonded atoms") + stepperHTML("e", T.inputs.e, d.e, ok13(d.x, d.e - 1), ok13(d.x, d.e + 1), "lone pairs"); });
    $(".vs-tax", inp).innerHTML = axeH(d.x, d.e) + ": " + ARR[d.x + d.e] + " arrangement, " + SHP[d.x + "|" + d.e] + ".";
    if (V) { var key = d.x + "|" + d.e; V.draw(m, { lp:true, arcs:arcs, ideal:false }, key !== lastTK); lastTK = key; }
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      if (!ok13(+S.x, +S.e)) { S.x = 2; S.e = 0; }
      inp.innerHTML = '<div class="vs-tst"></div><p class="tiny muted">' + T.inputs.note + '</p><p class="vs-tax" aria-live="polite"></p>';
      pv.innerHTML = '<h4 class="vs-h4">' + T.inputs.model + '</h4><div class="vs-tv"></div><p class="tiny muted">' + T.inputs.arcs + "</p>";
      V = viewer($(".vs-tv", pv), { W:400, H:320 });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-stp]"); if (!b || b.disabled) return;
        var k = b.dataset.stp, dd = +b.dataset.d, nx = +S[k] + dd, x = k === "x" ? nx : +S.x, ee = k === "e" ? nx : +S.e;
        if (!ok13(x, ee)) return; S[k] = nx; api.save(); paint(inp); api.update();
      });
      paint(inp);
    },
    read:read,
    valid:function(d){ return ok13(d.x, d.e) ? true : "Choose one of the 13 standard combinations."; },
    checks:function(d){ if (!ok13(d.x, d.e)) return [false, false, false, false]; var h = pairs(d); return [d.e >= 1, !!h[180], !!h[90], d.x <= 4]; },
    key:function(d){ return d.x + "|" + d.e; },
    label:function(k){ var p = k.split("|"); return axeH(+p[0], +p[1]) + " (" + SHP[k] + ")"; },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ angles:anglesAct },
  task:task
});
})();
