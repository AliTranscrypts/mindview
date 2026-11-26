// SCH4U 19 Chemical Bonding and Polarity: hero (CO₂'s dipoles cancel, H₂O's add, water bends toward a rod), Polarity meter
// (Explore: C11 electronegativity table + bond meter, C1 VSEPR molecule viewer with δ labels, bond dipoles and tip-to-tail
// addition, swap-an-atom frames), Does it bend? Does it dissolve? (Part 3 inquiry bench: charged rod, test tubes, particle
// zooms, oil-spill scene), "Polar or not?" chips and the "Polar bonds, nonpolar molecule" designer task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, CF = MV.chem.f, M = "−", UID = 0;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function r2(v){ return Math.round(v * 100) / 100; }
function esc(s){ return MV.esc(s); }
function lerp(a, b, t){ return a + (b - a) * t; }
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function rnd(i){ var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
function plainF(s){ return MV.plain(CF(s)); }

// ---------- electronegativity (course table, MV.chem.data.EN) ----------
// VERIFY: Pauling electronegativity of Xe (2.60) is not in the course table; course table addition (XeF₄, square-planar frame).
var XE_EN = 2.60;
function en(el){ return el === "Xe" ? XE_EN : MV.chem.data.EN[el]; }
function dEN(a, b){ return r2(Math.abs(en(a) - en(b))); }
function f2(v){ return v === 0 ? "0" : v.toFixed(2); }
function btype(d){ return d < 0.5 ? "nonpolar covalent" : d <= 1.7 ? "polar covalent" : "mostly ionic"; }
var METAL = { Li:1, Na:1, K:1, Mg:1, Ca:1, Al:1 };
var NAME = { H:"hydrogen", Li:"lithium", B:"boron", C:"carbon", N:"nitrogen", O:"oxygen", F:"fluorine", Na:"sodium", Mg:"magnesium", Al:"aluminium",
  Si:"silicon", P:"phosphorus", S:"sulfur", Cl:"chlorine", K:"potassium", Ca:"calcium", Br:"bromine", I:"iodine", Xe:"xenon" };
function miscVal(q){ var r = MV.chem.data.misc.filter(function(x){ return x[0] === q; })[0]; return r ? r[1] : ""; }

// ---------- vectors ----------
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function len(a){ return Math.hypot(a[0], a[1], a[2]); }
function nrm(a){ var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function lerp3(a, b, t){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }

// @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group (arrow keys,
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

// ---------- SVG helpers (from SCH4U 11) ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function T(x, y, s, o){ o = o || {}; var fs = o.fs || 14; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + r1(fs) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + (o.halo ? ' stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" paint-order="stroke"' : "") + opA(o.op) + ">" + s + "</text>"; }
function Ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + r1(o.w || 2.4) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
// dipole arrow (crossed tail at δ+, head at δ−), with a sheet-coloured halo so it reads over atoms
function dArrow(x1, y1, x2, y2, o){
  o = o || {};
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 3) return "";
  var ux = dx / L, uy = dy / L, hs = Math.min(o.hs || 9, L * 0.6), w = o.w || 2.2, k = o.k || 6, cx = x1 + ux * Math.min(8, L * 0.2), cy = y1 + uy * Math.min(8, L * 0.2);
  function one(c, ww, halo){
    return Ln(x1, y1, x2 - ux * hs * 0.6, y2 - uy * hs * 0.6, { c:c, w:ww }) + (o.cross === false ? "" : Ln(cx - uy * k, cy + ux * k, cx + uy * k, cy - ux * k, { c:c, w:ww })) +
      '<path d="M' + r1(x2) + " " + r1(y2) + " L" + r1(x2 - ux * hs - uy * hs * 0.55) + " " + r1(y2 - uy * hs + ux * hs * 0.55) + " L" + r1(x2 - ux * hs + uy * hs * 0.55) + " " + r1(y2 - uy * hs - ux * hs * 0.55) + 'Z" fill="' + c + '"' + (halo ? ' stroke="' + c + '" stroke-width="' + r1(ww) + '" stroke-linejoin="round"' : "") + "/>";
  }
  return "<g" + opA(o.op) + ">" + (o.halo === false ? "" : one("var(--sheet)", w + 3.5, true)) + one(o.c || "var(--ink)", w) + "</g>";
}
function atomCol(el){ return el === "Xe" ? { fill:"var(--ink-2)", line:"none", ink:"var(--sheet)" } : MV.chem.atom(el); }

// ---------- @component C1 vseprModel — one-centre VSEPR molecules (AXₘEₙ) as 3D scenes: atoms, bonds (orders), lone pairs ----------
// star(centre, geo, outerElements, orders) -> {atoms:[{el, p}], bonds:[{a, b, o}], lps:[{at, d}], anchor, shape, view}
var Q3 = 1 / 3, E9 = 0.94281, T8 = 0.81650, S6 = 0.86603;
var GEO = {
  lin:{ n:"linear", x:"AX<sub>2</sub>", v:"front", a:[[-1, 0, 0], [1, 0, 0]] },
  bent:{ n:"bent", x:"AX<sub>2</sub>E<sub>2</sub>", v:"front", a:[[-T8, -0.57735, 0], [T8, -0.57735, 0]], lp:[[0, 0.57735, T8], [0, 0.57735, -T8]] },
  tp:{ n:"trigonal planar", x:"AX<sub>3</sub>", v:"front", a:[[0, 1, 0], [-S6, -0.5, 0], [S6, -0.5, 0]] },
  pyr:{ n:"trigonal pyramidal", x:"AX<sub>3</sub>E", v:"tilt", a:[[0, -Q3, E9], [T8, -Q3, -0.4714], [-T8, -Q3, -0.4714]], lp:[[0, 1, 0]] },
  tet:{ n:"tetrahedral", x:"AX<sub>4</sub>", v:"tilt", a:[[-1, 1, -1], [1, 1, 1], [1, -1, -1], [-1, -1, 1]].map(nrm) },
  tbp:{ n:"trigonal bipyramidal", x:"AX<sub>5</sub>", v:"tilt", a:[[0, 1, 0], [0, -1, 0], [1, 0, 0], [-0.5, 0, S6], [-0.5, 0, -S6]] },
  see:{ n:"seesaw", x:"AX<sub>4</sub>E", v:"tilt", a:[[0, 1, 0], [0, -1, 0], [-0.5, 0, S6], [-0.5, 0, -S6]], lp:[[1, 0, 0]] },
  T:{ n:"T-shaped", x:"AX<sub>3</sub>E<sub>2</sub>", v:"tilt", a:[[0, 1, 0], [0, -1, 0], [1, 0, 0]], lp:[[-0.5, 0, S6], [-0.5, 0, -S6]] },
  sq:{ n:"square planar", x:"AX<sub>4</sub>E<sub>2</sub>", v:"tilt", a:[[0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]], lp:[[0, 0, 1], [0, 0, -1]] },
  oct:{ n:"octahedral", x:"AX<sub>6</sub>", v:"tilt", a:[[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]] }
};
function blen(el){ return el === "H" ? 0.92 : 1.18; }
function star(c, g, outs, ord){
  var G = GEO[g], at = [{ el:c, p:[0, 0, 0] }], bonds = [];
  G.a.forEach(function(d, i){ var el = outs[i]; at.push({ el:el, p:mul(d, blen(el)) }); bonds.push({ a:0, b:i + 1, o:Array.isArray(ord) ? ord[i] : (ord || 1) }); });
  return { atoms:at, bonds:bonds, lps:(G.lp || []).map(function(d){ return { at:0, d:d }; }), anchor:[0, 0, 0], shape:cap1(G.n) + " (" + G.x + ")", view:G.v };
}
function ch3oh(){
  var C = [-0.62, 0, 0], O = [0.62, 0, 0], at = [{ el:"C", p:C }, { el:"O", p:O }], bonds = [{ a:0, b:1, o:1 }];
  [[-Q3, E9, 0], [-Q3, -0.4714, T8], [-Q3, -0.4714, -T8]].forEach(function(d){ at.push({ el:"H", p:add(C, mul(d, 0.92)) }); bonds.push({ a:0, b:at.length - 1, o:1 }); });
  at.push({ el:"H", p:add(O, mul([Q3, -E9, 0], 0.88)) }); bonds.push({ a:1, b:at.length - 1, o:1 });
  return { atoms:at, bonds:bonds, lps:[{ at:1, d:[Q3, 0.4714, T8] }, { at:1, d:[Q3, 0.4714, -T8] }], anchor:[0, 0, 0], shape:"Tetrahedral around C; bent around O", view:"front" };
}
var MOLS = { co2:["CO2", "C", "lin", ["O", "O"], 2], h2o:["H2O", "O", "bent", ["H", "H"]], nh3:["NH3", "N", "pyr", ["H", "H", "H"]],
  ch4:["CH4", "C", "tet", ["H", "H", "H", "H"]], ccl4:["CCl4", "C", "tet", ["Cl", "Cl", "Cl", "Cl"]], chcl3:["CHCl3", "C", "tet", ["Cl", "H", "Cl", "Cl"]],
  ch2cl2:["CH2Cl2", "C", "tet", ["Cl", "Cl", "H", "H"]], ch3cl:["CH3Cl", "C", "tet", ["H", "Cl", "H", "H"]], bf3:["BF3", "B", "tp", ["F", "F", "F"]],
  so3:["SO3", "S", "tp", ["O", "O", "O"], 2], pcl5:["PCl5", "P", "tbp", ["Cl", "Cl", "Cl", "Cl", "Cl"]], sf4:["SF4", "S", "see", ["F", "F", "F", "F"]],
  xef4:["XeF4", "Xe", "sq", ["F", "F", "F", "F"]], clf3:["ClF3", "Cl", "T", ["F", "F", "F"]], sf6:["SF6", "S", "oct", ["F", "F", "F", "F", "F", "F"]],
  ch2o:["CH2O", "C", "tp", ["O", "H", "H"], [2, 1, 1]], ch3oh:["CH3OH"], hcn:["HCN", "C", "lin", ["H", "N"], [1, 3]] };
function molScene(id){
  var m = MOLS[id], sc = id === "ch3oh" ? ch3oh() : star(m[1], m[2], m[3], m[4]);
  sc.id = id; sc.form = m[0]; return sc;
}
function bondScene(a, b){
  return { atoms:[{ el:a, p:[-0.78, 0, 0] }, { el:b, p:[0.78, 0, 0] }], bonds:[{ a:0, b:1, o:1 }], lps:[], anchor:[0, 0, 0], shape:null, view:"front", bond:true, form:a + "–" + b };
}
function formOf(c, outs){
  var n = { H:0, F:0, Cl:0 }; outs.forEach(function(x){ n[x]++; });
  function p(el){ return n[el] ? el + (n[el] > 1 ? n[el] : "") : ""; }
  if (c === "O" && n.H) return p("H") + "O" + p("F") + p("Cl");
  return c + p("H") + p("F") + p("Cl");
}

// bond dipoles: each bond's vector points from δ+ to δ− with length ΔEN; δ labels come from polar bonds only (ΔEN ≥ 0.5)
function dips(sc){
  var list = sc.bonds.map(function(b){
    var A = sc.atoms[b.a], B = sc.atoms[b.b], d = dEN(A.el, B.el);
    if (!d) return { b:b, d:0, v:[0, 0, 0] };
    var ng = en(A.el) > en(B.el) ? b.a : b.b, ps = ng === b.a ? b.b : b.a;
    return { b:b, d:d, ng:ng, ps:ps, v:mul(nrm(sub(sc.atoms[ng].p, sc.atoms[ps].p)), d) };
  });
  var net = [0, 0, 0], q = sc.atoms.map(function(){ return 0; });
  list.forEach(function(x){ net = add(net, x.v); if (x.d >= 0.5) { q[x.ng] -= x.d; q[x.ps] += x.d; } });
  var m = len(net);
  return { list:list, net:m < 0.05 ? [0, 0, 0] : net, mag:m < 0.05 ? 0 : r2(m), q:q };
}
function sideOf(sc, net){ var best = -1e9, el = ""; sc.atoms.forEach(function(a){ var v = dot(sub(a.p, sc.anchor), net); if (v > best + 1e-6) { best = v; el = a.el; } }); return el; }
function kinds(sc, dp){
  var out = [], map = {};
  dp.list.forEach(function(x){ var A = sc.atoms[x.b.a].el, B = sc.atoms[x.b.b].el, k = A + "|" + B + "|" + x.b.o;
    if (!map[k]) { map[k] = { a:A, b:B, o:x.b.o, d:x.d, n:0 }; out.push(map[k]); } map[k].n++; });
  return out;
}
function bname(k){ return k.a + (k.o === 3 ? "≡" : k.o === 2 ? "=" : "–") + k.b; }
function subLine(k){ var hi = en(k.a) >= en(k.b) ? k.a : k.b, lo = hi === k.a ? k.b : k.a; return bname(k) + ": " + en(hi).toFixed(2) + " " + M + " " + en(lo).toFixed(2) + " = " + f2(k.d); }

// ---------- 3D drawing ----------
var RAD = { H:0.25, B:0.33, C:0.33, N:0.33, O:0.33, F:0.31, Si:0.38, P:0.38, S:0.38, Cl:0.38, Br:0.41, I:0.45, Xe:0.43, Li:0.42, Na:0.45, K:0.49, Mg:0.42, Ca:0.47, Al:0.41 };
var KD = 0.5;   // model units per unit of ΔEN for dipole arrows
var VIEWS = { front:{ x:0.16, y:0.3 }, tilt:{ x:0.3, y:-0.3 }, top:{ x:1.45, y:0 } };
function proj(p, rot){
  var cy = Math.cos(rot.y), sy = Math.sin(rot.y), cx = Math.cos(rot.x), sx = Math.sin(rot.x);
  var x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy, y = p[1];
  return [x, -(y * cx - z * sx), y * sx + z * cx];
}
// sceneSVG(sc, rot, box{ox, oy, s}, o{dip, t (0 bond dipoles … 1 added tip to tail), ion, hl, gid}) -> {h, pos}
function sceneSVG(sc, rot, bx, o){
  o = o || {};
  var s = bx.s, P = sc.atoms.map(function(a){ return proj(a.p, rot); }), out = "", items = [], dp = o.dip, t = o.t || 0, Rm = 0.1;
  function X(p){ return bx.ox + p[0] * s; } function Y(p){ return bx.oy + p[1] * s; }
  function S2(p3){ var q = proj(p3, rot); return [X(q), Y(q)]; }
  P.forEach(function(p){ Rm = Math.max(Rm, Math.abs(p[2])); });
  function rad(k){ return (RAD[sc.atoms[k].el] || 0.35) * s * (1 + 0.07 * P[k][2] / Rm); }
  sc.bonds.forEach(function(b){ items.push({ z:(P[b.a][2] + P[b.b][2]) / 2 - 0.03, b:b }); });
  sc.atoms.forEach(function(a, k){ items.push({ z:P[k][2], k:k }); });
  (sc.lps || []).forEach(function(l){ var q = proj(add(sc.atoms[l.at].p, mul(l.d, 0.6)), rot); items.push({ z:q[2] - 0.02, lp:l, q:q }); });
  items.sort(function(a, b){ return a.z - b.z; });
  items.forEach(function(it){
    if (it.b) {
      var pa = P[it.b.a], pb = P[it.b.b], dx = (pb[0] - pa[0]) * s, dy = (pb[1] - pa[1]) * s, L = Math.hypot(dx, dy) || 1, ra = rad(it.b.a) * 0.85, rb = rad(it.b.b) * 0.85;
      if (L <= ra + rb) return;
      var ox = -dy / L, oy = dx / L, n = it.b.o, sp = s * 0.085, wd = s * (n > 1 ? 0.055 : 0.09);
      for (var q = 0; q < n; q++) { var d = (q - (n - 1) / 2) * sp * 2; out += Ln(X(pa) + dx / L * ra + ox * d, Y(pa) + dy / L * ra + oy * d, X(pb) - dx / L * rb + ox * d, Y(pb) - dy / L * rb + oy * d, { c:"var(--ink-2)", w:Math.max(2, wd) }); }
      return;
    }
    if (it.lp) {
      var c = P[it.lp.at], cx2 = X(it.q), cy2 = Y(it.q), ddx = cx2 - X(c), ddy = cy2 - Y(c), Ll = Math.hypot(ddx, ddy), ang = Ll > 0.08 * s ? Math.atan2(ddy, ddx) : 0;
      var rx = Math.max(0.13 * s, 0.55 * Ll), ry = 0.15 * s, px = -Math.sin(ang), py = Math.cos(ang);
      out += '<ellipse cx="' + r1(cx2) + '" cy="' + r1(cy2) + '" rx="' + r1(rx) + '" ry="' + r1(ry) + '" transform="rotate(' + r1(ang * 180 / Math.PI) + " " + r1(cx2) + " " + r1(cy2) + ')" fill="var(--e-pair)" fill-opacity=".16" stroke="var(--e-pair)" stroke-width="1.4"/>' +
        '<circle cx="' + r1(cx2 + px * 4) + '" cy="' + r1(cy2 + py * 4) + '" r="2.6" fill="var(--e-pair)"/><circle cx="' + r1(cx2 - px * 4) + '" cy="' + r1(cy2 - py * 4) + '" r="2.6" fill="var(--e-pair)"/>';
      return;
    }
    var a = sc.atoms[it.k], p = P[it.k], r = rad(it.k), col = atomCol(a.el), x = r1(X(p)), y = r1(Y(p));
    if (o.hl === it.k) out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r + 7) + '" fill="var(--hi-soft)" stroke="var(--hi-ink)" stroke-width="2"/>';
    out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r) + '" fill="' + col.fill + '"' + (a.el === "H" ? ' stroke="' + col.line + '" stroke-width="1.5"' : "") + '/><circle cx="' + x + '" cy="' + y + '" r="' + r1(r) + '" fill="url(#' + o.gid + ')"/>';
    if (r > 6) out += T(x, y, a.el, { fs:r * (a.el.length > 1 ? 0.8 : 1.02), w:700, c:col.ink });
  });
  if (!dp) return { h:out, pos:P.map(function(p){ return [X(p), Y(p)]; }) };
  // δ labels
  var A0 = S2(sc.anchor);
  dp.q.forEach(function(q, k){
    if (Math.abs(q) < 1e-9) return;
    var pk = [X(P[k]), Y(P[k])], r = rad(k), ux = pk[0] - A0[0], uy = pk[1] - A0[1], L = Math.hypot(ux, uy), lx, ly;
    if (L < 4) { lx = pk[0] - r - 11; ly = pk[1] - r - 1; } else { lx = pk[0] + ux / L * (r + 13); ly = pk[1] + uy / L * (r + 13); }
    var txt = o.ion ? (q < 0 ? M : "+") : (q < 0 ? "δ" + M : "δ+");
    out += T(lx, ly, txt, { fs:15, w:700, c:q < 0 ? "var(--dl-neg)" : "var(--dl-pos)", halo:true });
  });
  // bond dipoles: beside their bonds (t = 0), slid tip to tail into the sum spot (t = 1); the net arrow always shows there
  var vecs = [], acc = [0, 0], pts = [[0, 0]];
  dp.list.forEach(function(x){
    if (!x.d) return;
    var q = proj(mul(x.v, KD), rot), v2 = [q[0] * s, q[1] * s];
    vecs.push({ x:x, v:v2, at:acc.slice() }); acc = [acc[0] + v2[0], acc[1] + v2[1]]; pts.push(acc.slice());
  });
  var mnx = 0, mxx = 0, mny = 0, mxy = 0;
  pts.forEach(function(p){ mnx = Math.min(mnx, p[0]); mxx = Math.max(mxx, p[0]); mny = Math.min(mny, p[1]); mxy = Math.max(mxy, p[1]); });
  var sm = o.sum, k = sm ? Math.min(1.5, sm.max / Math.max(mxx - mnx, mxy - mny, 1)) : 1, O2 = sm ? [sm.x - (mnx + mxx) / 2 * k, sm.y - (mny + mxy) / 2 * k] : A0;
  var E2 = [O2[0] + acc[0] * k, O2[1] + acc[1] * k], netOp = sm ? 1 : clamp((t - 0.8) / 0.2, 0, 1);
  if (netOp > 0) {
    if (dp.mag > 0 && Math.hypot(acc[0], acc[1]) * k >= 5) out += dArrow(O2[0], O2[1], E2[0], E2[1], { w:4.2, hs:14, k:8, op:netOp });
    else out += '<circle cx="' + r1(E2[0]) + '" cy="' + r1(E2[1]) + '" r="5.5" fill="var(--ink)" stroke="var(--sheet)" stroke-width="2"' + opA(netOp) + "/>";
  }
  vecs.forEach(function(it){
    var x = it.x, vk = mul(x.v, KD), mid = mul(add(sc.atoms[x.b.a].p, sc.atoms[x.b.b].p), 0.5), b1 = S2(sub(mid, mul(vk, 0.5)));
    var a1 = S2(sc.atoms[x.ps].p), a2 = S2(sc.atoms[x.ng].p), bx2 = a2[0] - a1[0], by2 = a2[1] - a1[1], bl = Math.hypot(bx2, by2), px = bl > 4 ? by2 / bl : 0, py = bl > 4 ? -bx2 / bl : -1;
    b1 = [b1[0] + px * 17, b1[1] + py * 17];
    var c1 = [O2[0] + it.at[0] * k, O2[1] + it.at[1] * k], kk = lerp(1, k, t), p1 = [lerp(b1[0], c1[0], t), lerp(b1[1], c1[1], t)], weak = x.d < 0.5;
    out += dArrow(p1[0], p1[1], p1[0] + it.v[0] * kk, p1[1] + it.v[1] * kk, { w:weak ? 1.6 : 2.3, hs:weak ? 7 : 9, k:weak ? 4 : 6, c:weak ? "var(--ink-2)" : "var(--ink)" });
  });
  return { h:out, pos:P.map(function(p){ return [X(p), Y(p)]; }), flat:Math.hypot(acc[0], acc[1]) * k < 5 };
}
function fitBox(sc, w, h, cx, cy){
  var R = 0.5; sc.atoms.forEach(function(a){ R = Math.max(R, len(sub(a.p, sc.anchor)) + (RAD[a.el] || 0.35)); }); if ((sc.lps || []).length) R = Math.max(R, 1.05);
  return { ox:cx, oy:cy, s:Math.min(Math.min(w, h) * 0.45 / R, sc.bond ? 96 : 118) };
}
// "dipole sum" panel: where the bond dipoles add tip to tail; the net arrow, or a dot for net dipole 0
function panelSVG(x0, y0, w, h, title, foot){
  return '<rect x="' + r1(x0) + '" y="' + r1(y0) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="8" fill="var(--paper)" stroke="var(--rule)" stroke-width="1.5"/>' + T(x0 + w / 2, y0 + 14, title, { fs:12, w:700, c:"var(--ink-2)" }) + T(x0 + w / 2, y0 + h - 15, foot, { fs:13, w:700 });
}
function footOf(sc, dp, flat){
  if (sc.bond) return dp.mag > 0 ? "toward " + sideOf(sc, dp.net) : "0";
  return dp.mag > 0 ? (flat ? "net dipole (toward you)" : "net dipole") : "net dipole: 0";
}
// @component C1 dipoleViewer — rotatable 3D model (drag, arrow keys, Front / Tilted / Top) for one or two scenes side by side, with
// δ labels, bond dipoles that slide tip to tail (st.t) into a "dipole sum" panel that always shows the net arrow, and tappable outer atoms (overlay buttons) for swaps.
// viewer(host) -> {show(scenes, o{dips, aria, hits:[atom idx], hitLabel(i), onHit(i), locked, hl, ion}, resetView), render(), setT(t), t(), setRot(id)}
function viewer(host){
  var uid = ++UID, W = 460, H = 330, st = { scs:[], o:{}, rot:{ x:0, y:0 }, t:0 };
  host.innerHTML = '<div class="bp-stage"><svg class="bp-svg" tabindex="0" viewBox="0 0 460 330" role="img" aria-label=""></svg><div class="bp-hits"></div></div>' +
    '<div class="bp-pre" role="group" aria-label="3D view"><span class="rg-lab">View</span><button type="button" class="btn ghost sm" data-pre="front" data-k="pre' + uid + 'f">Front</button><button type="button" class="btn ghost sm" data-pre="tilt" data-k="pre' + uid + 't">Tilted</button><button type="button" class="btn ghost sm" data-pre="top" data-k="pre' + uid + 'p">Top</button></div>';
  var svg = $(".bp-svg", host), hitsEl = $(".bp-hits", host);
  function size(){ var cw = Math.round(svg.getBoundingClientRect().width); if (cw > 60) { var nh = Math.round(cw * (cw < 420 ? 0.82 : 0.68)); if (cw !== W || nh !== H) { W = cw; H = nh; svg.setAttribute("viewBox", "0 0 " + W + " " + H); } } }
  if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = W; size(); if (W !== w0) render(); }).observe(svg);
  function render(){
    size();
    var n = st.scs.length, o = st.o, h = '<defs><radialGradient id="bpg' + uid + '" cx=".32" cy=".28" r=".45"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>', pos = [];
    if (!n) { svg.innerHTML = ""; placeHits(null); return; }
    var pan = !!o.dips, cw = W / n;
    if (n === 1) {
      var pw = pan ? (W < 420 ? 98 : 150) : 0, mw = W - pw - (pan ? 14 : 0), sc0 = st.scs[0], bx = fitBox(sc0, mw, H, mw / 2 + 4, H / 2);
      var sum = pan ? { x:W - pw / 2 - 8, y:H / 2 + 2, max:Math.min(pw - 26, H - 92) } : null;
      if (pan) h += panelSVG(W - pw - 8, 8, pw, H - 16, sc0.bond ? "bond dipole" : "dipole sum", "");
      var r = sceneSVG(sc0, st.rot, bx, { dip:pan ? o.dips[0] : null, t:st.t, ion:o.ion, hl:o.hl, gid:"bpg" + uid, sum:sum });
      h += r.h; pos.push(r.pos);
      if (pan) h += T(W - pw / 2 - 8, H - 23, footOf(sc0, o.dips[0], r.flat), { fs:13, w:700, halo:true });
    } else {
      st.scs.forEach(function(sc, i){
        var cx = cw * i + cw / 2, bx = fitBox(sc, cw, H * 0.52, cx, H * 0.42);
        var r = sceneSVG(sc, st.rot, bx, { dip:pan ? o.dips[i] : null, t:st.t, ion:o.ion, hl:o.hl, gid:"bpg" + uid, sum:pan ? { x:cx, y:H * 0.8, max:Math.min(cw * 0.5, H * 0.2) } : null });
        h += r.h; pos.push(r.pos);
        h += T(cx, 16, plainF(sc.form), { fs:15, w:700 });
        if (pan) h += T(cx, H - 11, footOf(sc, o.dips[i], r.flat), { fs:13, w:700, halo:true });
      });
      h += Ln(W / 2, 14, W / 2, H - 14, { c:"var(--rule)", w:1.5, d:"5 5" });
    }
    svg.innerHTML = h;
    svg.setAttribute("aria-label", (o.aria || "3D model") + " Drag it or use the arrow keys to turn it.");
    placeHits(pos[0]);
  }
  function placeHits(pos){
    var want = (pos && st.o.hits) || [], sig = want.join(",");
    if (hitsEl.dataset.sig !== sig) { hitsEl.innerHTML = want.map(function(i){ return '<button type="button" class="bp-hit" data-hit="' + i + '" data-k="hit' + uid + "_" + i + '"></button>'; }).join(""); hitsEl.dataset.sig = sig; }
    want.forEach(function(i, j){ var b = hitsEl.children[j], p = pos[i]; b.style.left = r2(p[0] / W * 100) + "%"; b.style.top = r2(p[1] / H * 100) + "%"; b.setAttribute("aria-label", st.o.hitLabel ? st.o.hitLabel(i) : "Atom " + i); b.disabled = !!st.o.locked; });
  }
  hitsEl.addEventListener("click", function(e){ var b = e.target.closest("[data-hit]"); if (b && !b.disabled && st.o.onHit) st.o.onHit(+b.dataset.hit); });
  var drag = null;
  svg.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY }; try { svg.setPointerCapture(e.pointerId); } catch (er) {} });
  svg.addEventListener("pointermove", function(e){ if (!drag) return; st.rot.y += (e.clientX - drag.x) * 0.012; st.rot.x = clamp(st.rot.x + (e.clientY - drag.y) * 0.012, -1.55, 1.55); drag = { x:e.clientX, y:e.clientY }; render(); });
  svg.addEventListener("pointerup", function(){ drag = null; }); svg.addEventListener("pointercancel", function(){ drag = null; });
  svg.addEventListener("keydown", function(e){
    var k = e.key, d = Math.PI / 12;
    if (k === "ArrowLeft") st.rot.y -= d; else if (k === "ArrowRight") st.rot.y += d; else if (k === "ArrowUp") st.rot.x = clamp(st.rot.x - d, -1.55, 1.55); else if (k === "ArrowDown") st.rot.x = clamp(st.rot.x + d, -1.55, 1.55); else return;
    e.preventDefault(); render();
  });
  function setRot(id){ var v = VIEWS[id] || VIEWS.tilt; st.rot.x = v.x; st.rot.y = v.y; render(); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pre]"); if (b) setRot(b.dataset.pre); });
  return {
    show:function(scs, o, reset){ st.scs = scs; st.o = o || {}; if (reset) { var v = VIEWS[(scs[0] && scs[0].view) || "tilt"]; st.rot.x = v.x; st.rot.y = v.y; } render(); },
    render:render, setT:function(t){ st.t = t; render(); }, t:function(){ return st.t; }, setRot:setRot
  };
}

// ---------- ΔEN scale bar (HTML so its text stays readable on phones) ----------
function barHTML(marks, t){
  t = t == null ? 1 : t;
  var ms = marks.slice().sort(function(a, b){ return a.d - b.d; }), prev = null;
  ms.forEach(function(m){ m.row = prev && prev.row === 0 && m.d - prev.d < 0.75 ? 1 : 0; prev = m; });
  var h = '<div class="bp-mks">' + ms.map(function(m){ var x = clamp(m.d * t / 3.3 * 100, 0, 100), al = x < 9 ? " al" : x > 91 ? " ar" : ""; return '<span class="bp-mk r' + m.row + al + '" style="left:' + r1(x) + '%"><span class="bp-mkl">' + m.lab + "</span></span>"; }).join("") + "</div>";
  h += '<div class="bp-band" aria-hidden="true"><span class="bp-b1">nonpolar</span><span class="bp-b2">polar covalent</span><span class="bp-b3">mostly ionic</span></div>';
  h += '<div class="bp-ticks" aria-hidden="true"><span style="left:0%">0</span><span style="left:15.15%">0.5</span><span style="left:51.52%">1.7</span><span style="left:100%">3.3</span></div>';
  return h;
}

// ---------- @component C11 enTable — the course electronegativity values in periodic-table positions (groups 1, 2, 13–17),
// each square a button with its value and a bar ∝ EN; slot badges 1 and 2; roving tabindex with arrow keys.
// enTable(host, {sel() -> {1:el, 2:el}, slot() -> 1|2, pick(el), locked()}) -> {paint()}
var PTR = [["H", 0, 0, 0, 0, 0, 0], ["Li", 0, "B", "C", "N", "O", "F"], ["Na", "Mg", "Al", "Si", "P", "S", "Cl"], ["K", "Ca", 0, 0, 0, 0, "Br"], [0, 0, 0, 0, 0, 0, "I"]];
function enTable(host, o){
  var foc = null;
  function paint(){
    var f = host.contains(document.activeElement), sel = o.sel(), lock = o.locked && o.locked();
    if (!foc) foc = sel[o.slot()] || "H";
    var h = '<div class="bp-pt" role="group" aria-label="Electronegativity table (course values): tap an atom"><div class="bp-pt-row bp-pt-hd" aria-hidden="true">' + [1, 2, 13, 14, 15, 16, 17].map(function(g){ return "<span>" + g + "</span>"; }).join("") + "</div>";
    PTR.forEach(function(row){
      h += '<div class="bp-pt-row">' + row.map(function(el){
        if (!el) return '<span class="bp-pt-gap" aria-hidden="true"></span>';
        var s1 = sel[1] === el, s2 = sel[2] === el, v = en(el);
        return '<button type="button" class="bp-pt-el' + (s1 || s2 ? " on" : "") + (METAL[el] ? " met" : "") + '" data-el="' + el + '" tabindex="' + (el === foc ? 0 : -1) + '" aria-label="' + esc(cap1(NAME[el]) + ", " + v.toFixed(2) + (s1 ? ", atom 1" : "") + (s2 ? ", atom 2" : "")) + '"' + (lock ? " disabled" : "") + '><span class="bp-pt-s">' + el + '</span><span class="bp-pt-v">' + v.toFixed(2) + '</span><span class="bp-pt-bar" style="width:' + r1(v / 4 * 100) + '%"></span>' + (s1 ? '<span class="bp-pt-bd">1</span>' : "") + (s2 ? '<span class="bp-pt-bd b2">2</span>' : "") + "</button>";
      }).join("") + "</div>";
    });
    host.innerHTML = h + "</div>";
    if (f) focusEl(foc);
  }
  function focusEl(el){ var b = host.querySelector('[data-el="' + el + '"]'); if (b && !b.disabled) { $$("[data-el]", host).forEach(function(x){ x.tabIndex = -1; }); b.tabIndex = 0; b.focus({ preventScroll:true }); foc = el; } }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-el]"); if (!b || b.disabled) return; foc = b.dataset.el; o.pick(foc); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-el]"); if (!b) return;
    var r = -1, c = -1, t = null;
    PTR.forEach(function(row, i){ var j = row.indexOf(b.dataset.el); if (j >= 0) { r = i; c = j; } });
    var flat = []; PTR.forEach(function(row){ row.forEach(function(x){ if (x) flat.push(x); }); });
    var k = flat.indexOf(b.dataset.el);
    if (e.key === "ArrowRight") t = flat[Math.min(flat.length - 1, k + 1)];
    else if (e.key === "ArrowLeft") t = flat[Math.max(0, k - 1)];
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") { var d = e.key === "ArrowUp" ? -1 : 1; for (var i = r + d; i >= 0 && i < PTR.length; i += d) if (PTR[i][c]) { t = PTR[i][c]; break; } }
    else return;
    e.preventDefault(); if (t) focusEl(t);
  });
  paint();
  return { paint:paint };
}

// ---------- readout rows ----------
function rowsOf(sc, dp, C){
  var L = C.rows, K = kinds(sc, dp), xe = sc.atoms.some(function(a){ return a.el === "Xe"; }), R = [];
  var r0 = K.map(subLine).join("<br>") + (xe ? '<br><span class="tiny muted">' + C.xeNote + "</span>" : "");
  if (sc.bond) {
    var A = sc.atoms[0].el, B = sc.atoms[1].el, d = K[0].d, ng = d ? (en(A) > en(B) ? A : B) : "", met = METAL[A] && METAL[B], ionic = d > 1.7 && (METAL[A] || METAL[B]);
    R.push([L[0], r0], [L[1], cap1(btype(d))], [L[2], !d ? "None: identical atoms share equally" : d < 0.5 ? "None by the course model (" + ng + " pulls very slightly harder)" : ng]);
    R.push([L[3], "One bond (two atoms)"], [L[4], d ? "1" + (d < 0.5 ? " (weak)" : "") : "0"], [L[5], d ? "Points toward " + ng + (d < 0.5 ? " (very small)" : "") : "0"]);
    R.push([L[6], met ? "Not a molecule: metallic bonding" : ionic ? "Not a molecule: an ionic lattice of " + (METAL[A] ? A : B) + " ions and " + (METAL[A] ? B : A) + " ions" : "<strong>" + (d < 0.5 ? "Nonpolar" : "Polar") + "</strong>"]);
    var note = met ? "Both are metals. Metals bond to each other by metallic bonding, which this model doesn’t describe."
      : d > 1.7 && !ionic ? "The model says mostly ionic, but " + A + " and " + B + " are both nonmetals" + ((A + B === "HF" || A + B === "FH") ? ": HF is a molecular substance (bp " + miscVal("HF boiling point") + ")" : ", so their compounds are molecular") + ". The cut-offs are guides."
      : (METAL[A] || METAL[B]) && d <= 1.7 ? "Metal plus nonmetal isn’t automatically ionic: ΔEN is only " + f2(d) + "." : "";
    if (note) R.push(["Model check", note]);
    return R;
  }
  var negs = {}, nOrder = [];
  dp.q.forEach(function(q, k){ if (q < -1e-9) { var el = sc.atoms[k].el; if (!negs[el]) { negs[el] = 0; nOrder.push(el); } negs[el]++; } });
  var nb = 0; K.forEach(function(k){ if (k.d) nb += k.n; });
  var dipTxt = !nb ? "0" : K.filter(function(k){ return k.d; }).length === 1 ? String(nb) + (K[0].d < 0.5 ? " (weak: " + bname(K[0]) + " is only " + f2(K[0].d) + ")" : "") :
    nb + ": " + K.filter(function(k){ return k.d; }).map(function(k){ return k.n + " × " + bname(k) + (k.d < 0.5 ? " (weak)" : ""); }).join(", ");
  R.push([L[0], r0], [L[1], K.length === 1 ? cap1(btype(K[0].d)) : K.map(function(k){ return bname(k) + ": " + btype(k.d); }).join("<br>")]);
  R.push([L[2], nOrder.length ? nOrder.map(function(el){ return (negs[el] > 1 ? "each " : "") + el; }).join(" and ") : "None: every bond is below 0.5 (course model)"]);
  R.push([L[3], sc.shape], [L[4], dipTxt], [L[5], dp.mag > 0 ? "Yes, pointing toward the " + sideOf(sc, dp.net) + " side" : "0: the dipoles cancel"], [L[6], "<strong>" + (dp.mag > 0 ? "Polar" : "Nonpolar") + "</strong>"]);
  var big = K.filter(function(k){ return k.d > 1.7; })[0];
  if (big) R.push(["Model check", bname(big) + " (" + f2(big.d) + ") is past 1.7, yet " + CF(sc.form) + " is a molecular substance: the cut-offs are guides."]);
  else if (!nOrder.length && dp.mag > 0) R.push(["Model check", "Every bond is just under 0.5, yet the small dipoles add up: the cut-offs are guides."]);
  return R;
}

// ---------- hero: CO₂ cancels, H₂O adds, water bends toward a charged rod ----------
function ball(x, y, el, r, op){ var c = atomCol(el); return "<g" + opA(op) + '><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c.fill + '"' + (el === "H" ? ' stroke="' + c.line + '" stroke-width="1.5"' : "") + "/>" + T(x, y, el, { fs:r * 1.02, w:700, c:c.ink }) + "</g>"; }
function heroSVG(s){
  var h = "", DN = "δ" + M;
  // CO₂
  if (s.co > 0) {
    h += "<g" + opA(s.co) + ">" + Ln(66, 55, 94, 55, { c:"var(--ink-2)", w:3 }) + Ln(66, 62, 94, 62, { c:"var(--ink-2)", w:3 }) + Ln(126, 55, 154, 55, { c:"var(--ink-2)", w:3 }) + Ln(126, 62, 154, 62, { c:"var(--ink-2)", w:3 }) +
      ball(50, 58, "O", 16) + ball(110, 58, "C", 15) + ball(170, 58, "O", 16) +
      T(50, 88, DN, { fs:14, w:700, c:"var(--dl-neg)" }) + T(110, 88, "δ+", { fs:14, w:700, c:"var(--dl-pos)" }) + T(170, 88, DN, { fs:14, w:700, c:"var(--dl-neg)" }) + "</g>";
    var t = s.cot, a1 = [lerp(118, 110, t), lerp(30, 112, t)], a2 = [lerp(102, 150, t), lerp(30, 120, t)];
    h += dArrow(a1[0], a1[1], a1[0] + 40, a1[1], { op:s.co }) + dArrow(a2[0], a2[1], a2[0] - 40, a2[1], { op:s.co });
    if (s.cod > 0) h += '<circle cx="110" cy="116" r="5.5" fill="var(--ink)" stroke="var(--sheet)" stroke-width="2"' + opA(s.cod) + "/>" + T(110, 144, "net dipole 0", { fs:13, w:700, op:s.cod });
  }
  // H₂O
  if (s.wo > 0) {
    h += "<g" + opA(s.wo) + ">" + Ln(300, 48, 262, 96, { c:"var(--ink-2)", w:3 }) + Ln(300, 48, 338, 96, { c:"var(--ink-2)", w:3 }) + ball(262, 96, "H", 11) + ball(338, 96, "H", 11) + ball(300, 48, "O", 16) +
      T(300, 19, DN, { fs:14, w:700, c:"var(--dl-neg)" }) + T(262, 122, "δ+", { fs:14, w:700, c:"var(--dl-pos)" }) + T(338, 122, "δ+", { fs:14, w:700, c:"var(--dl-pos)" }) + "</g>";
    var u = s.wt, l0 = [lerp(257.6, 395, u), lerp(79, 140, u)], r0 = [lerp(342.4, 419.8, u), lerp(79, 108.6, u)];
    h += dArrow(l0[0], l0[1], l0[0] + 24.8, l0[1] - 31.4, { op:s.wo }) + dArrow(r0[0], r0[1], r0[0] - 24.8, r0[1] - 31.4, { op:s.wo });
    if (s.wn > 0) h += dArrow(395, 140, 395, 77.2, { w:4.2, hs:13, k:8, op:s.wn }) + T(395, 156, "net dipole", { fs:13, w:700, op:s.wn, a:"middle" });
  }
  // streams and rod
  if (s.so > 0) {
    h += "<g" + opA(s.so) + ">" + Ln(16, 170, 424, 170, { c:"var(--rule)", w:1.5 });
    [[150, "var(--pen)", "water (polar)", 22 * s.bend], [290, "var(--at-s)", "oil (nonpolar)", 0]].forEach(function(b){
      var x = b[0];
      h += '<rect x="' + (x - 9) + '" y="180" width="18" height="40" rx="3" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/><rect x="' + (x - 7) + '" y="190" width="14" height="28" rx="2" fill="' + b[1] + '" fill-opacity=".3"/>' +
        '<path d="M' + (x - 4) + " 220 L" + x + " 230 L" + (x + 4) + ' 220" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>' +
        '<path d="M' + x + " 231 C" + x + " 258 " + r1(x + b[3]) + " 268 " + r1(x + b[3]) + ' 298" fill="none" stroke="' + b[1] + '" stroke-width="3" stroke-linecap="round"/>' +
        '<rect x="' + (x - 24) + '" y="298" width="48" height="24" rx="3" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/><rect x="' + (x - 22) + '" y="312" width="44" height="8" fill="' + b[1] + '" fill-opacity=".3"/>' +
        T(x, 333, b[2], { fs:13 });
    });
    if (s.ro > 0) {
      var ry = lerp(345, 246, s.ro);
      h += '<rect x="214" y="' + r1(ry) + '" width="12" height="56" rx="4" fill="var(--ink-2)"/>' + [12, 28, 44].map(function(dy){ return T(220, ry + dy, M, { fs:13, w:700, c:"var(--sheet)" }); }).join("") + T(220, ry - 11, "charged rod", { fs:12, w:700, op:clamp(s.ro * 2 - 1, 0, 1) });
    }
    h += "</g>";
  }
  return h;
}
function hero(){
  var svg = $("#bp-hx-svg"), cap = $("#bp-hx-cap"), rep = $("#bp-hx-replay"); if (!svg) return;
  var s = null, run = 0, tw = null;
  function draw(){ svg.innerHTML = heroSVG(s); }
  function fin(){ s = { co:1, cot:1, cod:1, wo:1, wt:1, wn:1, so:1, ro:1, bend:1 }; draw(); cap.textContent = "Same polar bonds, different shapes: CO₂’s dipoles cancel, H₂O’s don’t, and polar water bends toward a charged rod."; rep.hidden = false; }
  function play(){
    var id = ++run; if (tw) { tw(); tw = null; } rep.hidden = true;
    s = { co:0, cot:0, cod:0, wo:0, wt:0, wn:0, so:0, ro:0, bend:0 }; draw();
    var L = [
      { cap:"CO₂: each C=O bond dipole points toward O.", k:"co", dur:700, pause:700 },
      { cap:"Tip to tail, the two dipoles cancel.", k:"cot", dur:1100, pause:150 },
      { k:"cod", dur:400, pause:900, cap:"Tip to tail, the two dipoles cancel: net dipole 0." },
      { cap:"H₂O: both O–H dipoles point up toward O.", k:"wo", dur:700, pause:700 },
      { cap:"Tip to tail, they add up to one longer arrow.", k:"wt", dur:1100, pause:150 },
      { k:"wn", dur:400, pause:900, cap:"Tip to tail, they add up to one longer arrow: the net dipole." },
      { cap:"A charged rod comes near two streams.", k:"so", dur:400, pause:100 },
      { k:"ro", dur:900, pause:100 },
      { cap:"Polar water bends toward the rod; nonpolar oil falls straight.", k:"bend", dur:900, pause:700 }
    ], i = 0;
    (function next(){
      if (id !== run) return;
      if (i >= L.length) { fin(); return; }
      var it = L[i++]; if (it.cap) cap.textContent = it.cap;
      tw = MV.tween({ dur:it.dur, step:function(t){ if (id !== run) return; s[it.k] = t; draw(); }, done:function(){ tw = null; if (id === run) MV.wait(it.pause, next); } });
    })();
  }
  rep.addEventListener("click", function(){ if (MV.reduceMotion) fin(); else play(); });
  if (MV.reduceMotion) fin(); else play();
}

// ---------- Explore: Polarity meter ----------
var COMBO = [["ch4", "CH4"], ["ch3cl", "CH3Cl"], ["ch2cl2", "CH2Cl2"], ["chcl3", "CHCl3"], ["ccl4", "CCl4"]];
var CYC = { H:"F", F:"Cl", Cl:"H" };
function okOuts(a, n){ return Array.isArray(a) && a.length === n && a.every(function(x){ return CYC[x]; }); }
function explore(host, api){
  var C = api.content, S = api.S, m = C.msgs;
  if (["bond", "mol", "swap"].indexOf(S.mode) < 0) S.mode = "mol";
  if (!en(S.a) || S.a === "Xe") S.a = "H"; if (!en(S.b) || S.b === "Xe") S.b = "Cl";
  S.slot = S.slot === 2 ? 2 : 1;
  if (!MOLS[S.mol]) S.mol = "h2o";
  S.frame = S.frame === "sq" ? "sq" : "tet";
  if (!okOuts(S.tet, 4)) S.tet = ["H", "H", "H", "H"];
  if (!okOuts(S.sq, 4)) S.sq = ["F", "F", "F", "F"];
  if (!S.marks || typeof S.marks !== "object") S.marks = {};
  if (!S.seen || typeof S.seen !== "object") S.seen = {};
  if (!S.found3 || typeof S.found3 !== "object") S.found3 = {};
  var busy = false, pair = null, barT = 1, hl = null, tw = null, lastKey = "";

  host.innerHTML = '<p class="how bp-how">' + C.how + '</p><div class="bp-modes"></div>' +
    '<div class="bp-pick"><div class="bp-pk" data-for="bond"><div class="bp-slot"></div><div class="bp-ptw"></div></div>' +
    '<div class="bp-pk" data-for="mol"><div class="bp-molc"></div></div>' +
    '<div class="bp-pk" data-for="swap"><div class="bp-frame"></div><p class="tiny muted bp-swhow">Tap an outer atom on the model (or Tab to it and press Enter) to cycle it H → F → Cl.</p></div></div>' +
    '<div class="bp-grid" data-mv="graph"><div class="bp-left"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="bp-bar" role="img"></div>' +
    '<p class="tiny muted bp-leg">Course model: nonpolar covalent below 0.5, polar covalent from 0.5 to 1.7, mostly ionic above 1.7.</p><div class="bp-view"></div>' +
    '<div class="bp-acts"><button type="button" class="btn primary sm bp-add" data-k="bpadd">Add the dipoles</button><button type="button" class="btn ghost sm bp-one" data-k="bpone" hidden>Back to one molecule</button></div>' +
    '<p class="bp-cap" aria-live="polite"></p></div><div class="bp-right"><h4 class="bp-h4">Readout</h4><dl class="read bp-read" aria-live="polite"></dl><div class="bp-side"></div></div></div>';
  var V = viewer($(".bp-view", host)), barEl = $(".bp-bar", host), readEl = $(".bp-read", host), capEl = $(".bp-cap", host), sideEl = $(".bp-side", host), addB = $(".bp-add", host), oneB = $(".bp-one", host);
  var RG = {};
  RG.mode = radios($(".bp-modes", host), { label:"Mode", aria:"Polarity meter mode", options:C.modes, value:S.mode, onChange:function(v){ if (busy) return; S.mode = v; pair = null; reset(); } });
  RG.slot = radios($(".bp-slot", host), { label:"Choosing", aria:"Which atom you are choosing", options:[{ id:"1", t:"Atom 1" }, { id:"2", t:"Atom 2" }], value:String(S.slot), onChange:function(v){ S.slot = +v; api.save(); PT.paint(); } });
  var PT = enTable($(".bp-ptw", host), { sel:function(){ return { 1:S.a, 2:S.b }; }, slot:function(){ return S.slot; }, locked:function(){ return busy; },
    pick:function(el){ if (busy) return; if (S.slot === 1) { S.a = el; S.slot = 2; } else { S.b = el; S.slot = 1; } RG.slot.set(String(S.slot)); reset(); } });
  RG.mol = radios($(".bp-molc", host), { label:"Molecule", aria:"Molecule", cls:"chips", options:C.mols.map(function(id){ return { id:id, t:CF(MOLS[id][0]) }; }), value:S.mol, onChange:function(v){ if (busy) return; S.mol = v; pair = null; reset(); } });
  RG.frame = radios($(".bp-frame", host), { label:"Frame", aria:"Swap frame", options:C.frames, value:S.frame, onChange:function(v){ if (busy) return; S.frame = v; reset(); } });

  function scenes(){
    if (pair) return pair.map(molScene);
    if (S.mode === "bond") return [bondScene(S.a, S.b)];
    if (S.mode === "mol") return [molScene(S.mol)];
    var sc = S.frame === "tet" ? star("C", "tet", S.tet) : star("Xe", "sq", S.sq);
    sc.form = formOf(sc.atoms[0].el, (S.frame === "tet" ? S.tet : S.sq)); return sc ? [sc] : [];
  }
  function record(){
    if (S.mode !== "swap" || pair) return;
    if (S.frame === "tet") { var n = S.tet.filter(function(x){ return x === "Cl"; }).length; if (S.tet.indexOf("F") < 0) S.seen[COMBO[n][0]] = true; }
    else {
      var f = [], c = 0; S.sq.forEach(function(x, i){ if (x === "F") f.push(i); if (x === "Cl") c++; });
      if (f.length === 2 && c === 2) S.found3[(f[1] - f[0]) % 2 ? "cis" : "trans"] = true;
    }
  }
  function capOf(scs, D){
    if (scs.length > 1) return scs.map(function(sc, i){ return plainF(sc.form) + ": " + (D[i].mag > 0 ? "a net dipole is left over, toward the " + sideOf(sc, D[i].net) + " side." : "the dipoles cancel."); }).join(" ");
    var dp = D[0], sc = scs[0];
    if (sc.bond) return "";
    return dp.mag > 0 ? "Tip to tail, the dipoles leave a net dipole pointing toward the " + sideOf(sc, dp.net) + " side: " + plainF(sc.form) + " is polar." : "Tip to tail, the dipoles end where they started: net dipole 0, so " + plainF(sc.form) + " is nonpolar.";
  }
  function hitLabel(i){ var o = S.frame === "tet" ? S.tet : S.sq, el = o[i - 1]; return "Position " + i + ": " + el + ". Press to change it to " + CYC[el] + "."; }
  function onHit(i){
    if (busy) return;
    var o = S.frame === "tet" ? S.tet : S.sq; o[i - 1] = CYC[o[i - 1]];
    V.setT(0); capEl.textContent = ""; record(); api.save(); paint(false); MV.changed();
  }
  function paint(resetView){
    var scs = scenes(), D = scs.map(dips), key = S.mode + "|" + (pair ? pair.join() : S.mode === "mol" ? S.mol : S.mode === "swap" ? S.frame : "bond");
    $$(".bp-pk", host).forEach(function(p){ p.hidden = p.dataset.for !== S.mode; });
    RG.mode.set(S.mode); RG.mol.set(pair ? "" : S.mol); RG.frame.set(S.frame);
    [RG.mode, RG.slot, RG.mol, RG.frame].forEach(function(r){ r.lock(busy); }); PT.paint();
    var swap = S.mode === "swap" && !pair, bond = S.mode === "bond" && !pair, sc0 = scs[0];
    var ion = bond && D[0].list[0].d > 1.7 && (METAL[S.a] || METAL[S.b]);
    V.show(scs, { dips:D, aria:ariaOf(scs, D), hits:swap ? [1, 2, 3, 4] : [], hitLabel:hitLabel, onHit:onHit, locked:busy, hl:hl, ion:ion, title:bond ? "bond dipole" : "net dipole" }, resetView || key !== lastKey);
    lastKey = key;
    // ΔEN bar
    var marks = []; scs.forEach(function(sc, i){ kinds(sc, D[i]).forEach(function(k){ if (!marks.some(function(x){ return x.lab === bname(k) + " " + f2(k.d); })) marks.push({ d:k.d, lab:bname(k) + " " + f2(k.d) }); }); });
    barEl.innerHTML = barHTML(marks, barT);
    barEl.setAttribute("aria-label", "ΔEN scale from 0 to 3.3, with marks at 0.5 and 1.7. " + marks.map(function(x){ return x.lab + " (" + btype(x.d) + ")"; }).join("; ") + ".");
    // readout
    var rows = scs.map(function(sc, i){ return rowsOf(sc, D[i], C); });
    if (scs.length > 1) {
      var labs = []; rows.forEach(function(rr){ rr.forEach(function(r){ if (labs.indexOf(r[0]) < 0) labs.push(r[0]); }); });
      readEl.innerHTML = MV.readoutHTML(labs.map(function(lb){ return [lb, rows.map(function(rr, i){ var r = rr.filter(function(x){ return x[0] === lb; })[0]; return r ? "<strong>" + CF(scs[i].form) + ":</strong> " + r[1] : ""; }).filter(Boolean).join("<br>")]; }));
    } else readEl.innerHTML = MV.readoutHTML(rows[0]);
    // side panel
    var h = "";
    if (swap && S.frame === "tet") h = '<div class="bp-box"><h4 class="bp-h4">' + m.marks + '</h4><p class="tiny muted">' + m.markHow + '</p><table class="bp-mt"><tbody>' + COMBO.map(function(c){
      var v = S.marks[c[0]], cur = sc0.form === c[1];
      return '<tr class="' + (cur ? "cur" : "") + '"><th scope="row">' + CF(c[1]) + (S.seen[c[0]] ? ' <span class="bp-seen">✓ built</span>' : "") + '</th><td><span class="bp-mkbs" role="group" aria-label="' + esc(plainF(c[1])) + '">' +
        '<button type="button" class="chip' + (v === "p" ? " on" : "") + '" aria-pressed="' + (v === "p") + '" data-mk="' + c[0] + '" data-v="p" data-k="mk' + c[0] + 'p"' + (busy ? " disabled" : "") + ">Polar</button>" +
        '<button type="button" class="chip' + (v === "n" ? " on" : "") + '" aria-pressed="' + (v === "n") + '" data-mk="' + c[0] + '" data-v="n" data-k="mk' + c[0] + 'n"' + (busy ? " disabled" : "") + ">Nonpolar</button></span></td></tr>";
    }).join("") + "</tbody></table></div>";
    else if (swap) h = '<div class="bp-box"><h4 class="bp-h4">' + m.found + '</h4><ul class="bp-found"><li>' + (S.found3.cis ? "✓" : "○") + " " + m.cis + "</li><li>" + (S.found3.trans ? "✓" : "○") + " " + m.trans + "</li></ul></div>";
    MV.keepFocus(sideEl, function(){ sideEl.innerHTML = h; });
    addB.disabled = busy || (bond && !D[0].list[0].d); oneB.hidden = !pair; oneB.disabled = busy;
    addB.textContent = V.t() > 0.5 ? "Show the bond dipoles" : "Add the dipoles";
  }
  function ariaOf(scs, D){
    return scs.map(function(sc, i){
      var dp = D[i], k = kinds(sc, dp).map(function(x){ return bname(x) + " ΔEN " + f2(x.d); }).join(", ");
      if (sc.bond) return "Bond meter: " + sc.form + ", " + k + ".";
      return plainF(sc.form) + ", " + MV.plain(sc.shape) + ": " + k + "; " + (dp.mag > 0 ? "net dipole toward the " + sideOf(sc, dp.net) + " side" : "net dipole 0") + ".";
    }).join(" ");
  }
  function reset(){ if (tw) { tw(); tw = null; } V.setT(0); hl = null; barT = 1; capEl.textContent = ""; record(); api.save(); paint(true); MV.changed(); }
  function animAdd(to, dur, done){
    if (tw) tw();
    var from = V.t();
    tw = MV.tween({ dur:dur || 1200, step:function(t){ V.setT(lerp(from, to, t)); }, done:function(){ tw = null; V.setT(to); if (done) done(); } });
  }
  function lock(b){ busy = b; paint(false); }
  addB.addEventListener("click", function(){
    if (busy) return;
    var to = V.t() > 0.5 ? 0 : 1, scs = scenes(), D = scs.map(dips);
    busy = true; addB.disabled = true;
    animAdd(to, 1100, function(){ busy = false; capEl.textContent = to ? capOf(scs, D) : ""; paint(false); var b = $(".bp-add", host); if (b) b.focus({ preventScroll:true }); });
  });
  oneB.addEventListener("click", function(){ if (busy) return; pair = null; reset(); });
  sideEl.addEventListener("click", function(e){
    var b = e.target.closest("[data-mk]"); if (!b || b.disabled || busy) return;
    S.marks[b.dataset.mk] = b.dataset.v; api.save(); paint(false); MV.changed();
  });

  var hooks = {
    start:function(p){
      if (tw) { tw(); tw = null; }
      pair = null; hl = null; barT = 1; capEl.textContent = C.predSetup[p.id] || "";
      if (p.id === "p1") { S.mode = "mol"; S.mol = "co2"; }
      else if (p.id === "p2") { S.mode = "swap"; S.frame = "tet"; S.tet = ["Cl", "Cl", "Cl", "Cl"]; }
      else if (p.id === "p3") { S.mode = "bond"; S.a = "Na"; S.b = "Cl"; S.slot = 1; RG.slot.set("1"); barT = 0; }
      else { S.mode = "mol"; pair = ["bf3", "nh3"]; }
      V.setT(0); record(); api.save(); busy = true; paint(true);
    },
    run:function(p, done){
      function end(msg){ busy = false; hl = null; capEl.textContent = msg; api.save(); paint(false); MV.changed(); done(); }
      if (p.id === "p1") { animAdd(1, 1300, function(){ end(capOf(scenes(), scenes().map(dips))); }); return; }
      if (p.id === "p2") {
        hl = 2; paint(false);
        MV.wait(600, function(){
          S.tet[1] = "H"; record(); capEl.textContent = "One Cl swapped for H: CHCl₃."; paint(false);
          MV.wait(800, function(){ animAdd(1, 1300, function(){ end(capOf(scenes(), scenes().map(dips))); }); });
        });
        return;
      }
      if (p.id === "p3") {
        if (tw) tw();
        tw = MV.tween({ dur:1300, step:function(t){ barT = t; barEl.innerHTML = barHTML([{ d:dEN(S.a, S.b), lab:S.a + "–" + S.b + " " + f2(dEN(S.a, S.b)) }], barT); }, done:function(){ tw = null; barT = 1; end("ΔEN 2.23 lands past 1.7: mostly ionic. Na and Cl form an ionic lattice of Na⁺ and Cl⁻ ions."); } });
        return;
      }
      animAdd(1, 1300, function(){ end(capOf(scenes(), scenes().map(dips))); });
    }
  };

  function chal(id){
    if (id === "tc1") {
      if (!S.a || !S.b) return { ok:false, msg:m.tc1.none };
      var d = dEN(S.a, S.b), b = S.a + "–" + S.b + ": ΔEN = " + f2(d) + ". ";
      if (d >= 0.5 && d <= 1.0) return { ok:true };
      return { ok:false, msg:b + (d < 0.5 ? m.tc1.low : m.tc1.high) };
    }
    if (id === "tc2") {
      var k = S.marks;
      if (k.ch2cl2 === "n") return { ok:false, msg:m.tc2.ch2cl2 };
      if (k.ccl4 === "p") return { ok:false, msg:m.tc2.ccl4 };
      if (COMBO.some(function(c){ return !k[c[0]]; })) return { ok:false, msg:m.tc2.unmarked };
      if (k.ch4 === "n" && k.ccl4 === "n" && k.ch3cl === "p" && k.ch2cl2 === "p" && k.chcl3 === "p") return { ok:true };
      return { ok:false, msg:m.tc2.other };
    }
    var f = S.found3;
    if (f.cis && f.trans) return { ok:true };
    if (f.cis) return { ok:false, msg:m.tc3.none };
    if (f.trans) return { ok:false, msg:m.tc3.needPolar };
    return { ok:false, msg:m.tc3.start };
  }
  record(); paint(true);
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Does it bend? Does it dissolve? ----------
var LQX = { water:90, ethanol:260, hexane:430 }, BEND = { water:30, ethanol:16, hexane:0 };
function benchSVG(st, L){
  var h = "";
  L.forEach(function(q){
    var x = LQX[q.id], dx = BEND[q.id] * (st.b[q.id] || 0);
    h += '<rect x="' + (x - 11) + '" y="8" width="22" height="64" rx="3" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/><rect x="' + (x - 9) + '" y="20" width="18" height="50" rx="2" fill="var(--pen)" fill-opacity=".18"/>' +
      [30, 42, 54].map(function(y){ return Ln(x - 11, y, x - 4, y, { c:"var(--ink-2)", w:1.2 }); }).join("") +
      '<rect x="' + (x - 7) + '" y="72" width="14" height="6" fill="var(--ink-2)"/><path d="M' + (x - 4) + " 78 L" + x + " 88 L" + (x + 4) + ' 78" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>' +
      '<path class="bp-flow" d="M' + x + " 89 C" + x + " 140 " + r1(x + dx) + " 160 " + r1(x + dx) + ' 240" fill="none" stroke="var(--pen)" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M' + (x - 34) + " 236 V270 Q" + (x - 34) + " 276 " + (x - 28) + " 276 H" + (x + 28) + " Q" + (x + 34) + " 276 " + (x + 34) + ' 270 V236" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/><rect x="' + (x - 32) + '" y="262" width="64" height="12" fill="var(--pen)" fill-opacity=".18"/>' +
      T(x, 291, q.t, { fs:14, w:700 });
  });
  if (st.rx < 520) {
    h += '<rect x="' + r1(st.rx - 7) + '" y="118" width="14" height="84" rx="4" fill="var(--ink-2)"/>' + [132, 150, 168, 186].map(function(y){ return T(st.rx, y, M, { fs:13, w:700, c:"var(--sheet)" }); }).join("") + T(st.rx, 106, "charged rod", { fs:12, w:700, halo:true });
  }
  return h;
}
function glyph(kind, x, y, th, lab){
  var h = "", c = Math.cos(th), s = Math.sin(th);
  function at(el, px, py, r){ var k = atomCol(el); return '<circle cx="' + r1(px) + '" cy="' + r1(py) + '" r="' + r + '" fill="' + k.fill + '"' + (el === "H" ? ' stroke="' + k.line + '" stroke-width="1.2"' : "") + "/>"; }
  if (kind === "water") {
    var h1 = [x + 15 * Math.cos(th - 0.92), y + 15 * Math.sin(th - 0.92)], h2 = [x + 15 * Math.cos(th + 0.92), y + 15 * Math.sin(th + 0.92)];
    h += Ln(x, y, h1[0], h1[1], { c:"var(--ink-2)", w:2 }) + Ln(x, y, h2[0], h2[1], { c:"var(--ink-2)", w:2 }) + at("H", h1[0], h1[1], 5.5) + at("H", h2[0], h2[1], 5.5) + at("O", x, y, 9);
    if (lab) h += T(x - 19 * c, y - 19 * s, "δ" + M, { fs:12, w:700, c:"var(--dl-neg)", halo:true }) + T(x + 27 * c, y + 27 * s, "δ+", { fs:12, w:700, c:"var(--dl-pos)", halo:true });
  } else if (kind === "ethanol") {
    var hh = [x + 13 * c, y + 13 * s], c1 = [x + 16 * Math.cos(th + Math.PI - 0.6), y + 16 * Math.sin(th + Math.PI - 0.6)], c2 = [c1[0] + 16 * Math.cos(th + Math.PI + 0.5), c1[1] + 16 * Math.sin(th + Math.PI + 0.5)];
    h += Ln(x, y, hh[0], hh[1], { c:"var(--ink-2)", w:2 }) + Ln(x, y, c1[0], c1[1], { c:"var(--ink-2)", w:2 }) + Ln(c1[0], c1[1], c2[0], c2[1], { c:"var(--ink-2)", w:2 }) + at("C", c2[0], c2[1], 7) + at("C", c1[0], c1[1], 7) + at("H", hh[0], hh[1], 5) + at("O", x, y, 8.5);
    if (lab) h += T(x - 2, y - 17, "δ" + M, { fs:12, w:700, c:"var(--dl-neg)", halo:true }) + T(x + 25 * c, y + 25 * s, "δ+", { fs:12, w:700, c:"var(--dl-pos)", halo:true });
  } else {
    var pts = []; for (var k = 0; k < 6; k++) { var a = (k - 2.5) * 11, b = k % 2 ? 4.5 : -4.5; pts.push([x + a * c - b * s, y + a * s + b * c]); }
    for (k = 1; k < 6; k++) h += Ln(pts[k - 1][0], pts[k - 1][1], pts[k][0], pts[k][1], { c:"var(--ink-2)", w:2 });
    pts.forEach(function(p){ h += at("C", p[0], p[1], 5.5); });
  }
  return h;
}
var ZP = [[60, 40], [150, 70], [80, 125], [230, 40], [250, 120], [330, 80], [170, 140], [340, 145]];
function zoomSVG(kind, ang, rodOn){
  var h = "";
  ZP.forEach(function(p, i){ h += glyph(kind, p[0], p[1], ang[i], i === 1 && kind !== "hexane" && rodOn); });
  if (rodOn) h += '<rect x="452" y="18" width="18" height="134" rx="5" fill="var(--ink-2)"/>' + [40, 66, 92, 118, 144].map(function(y){ return T(461, y - 6, M, { fs:14, w:700, c:"var(--sheet)" }); }).join("") + T(430, 160, "charged rod", { fs:12, w:700, a:"end" });
  return h;
}
function tubeSVG(sol, solv, res, t){
  // t: −1 untested; 0…1 animation (fall, shake, dissolve); 1 done
  var h = "", tested = t >= 0, d = res ? res.d : "no";
  var shake = t > 0.32 && t < 0.62 ? Math.sin((t - 0.32) / 0.3 * Math.PI * 6) * 7 * (1 - (t - 0.32) / 0.3) : 0;
  var dis = t > 0.62 ? (t - 0.62) / 0.38 : 0;
  var tint = sol === "i2" ? (solv === "hexane" ? "var(--e-pair)" : "var(--at-s)") : null, tOp = sol === "i2" ? (solv === "hexane" ? 0.6 : 0.3) * dis : 0;
  h += '<g transform="rotate(' + r1(shake) + ' 32 60)">';
  h += '<path d="M18 44 V100 A14 14 0 0 0 46 100 V44 Z" fill="var(--pen)" fill-opacity=".12"/>';
  if (tint && tOp > 0) h += '<path d="M18 44 V100 A14 14 0 0 0 46 100 V44 Z" fill="' + tint + '" fill-opacity="' + r2(tOp) + '"/>';
  if (tested) {
    var fall = clamp(t / 0.32, 0, 1), keep = d === "yes" ? 0 : d === "barely" ? 5 : 7;
    for (var i = 0; i < 7; i++) {
      var gx = 24 + rnd(i + (sol === "nacl" ? 9 : sol === "sugar" ? 21 : 3)) * 15, gy0 = 16 + i * 3, gy1 = 104 + (i % 3) * 3.5 - (i > 3 ? 4 : 0), gy = lerp(gy0, gy1, fall * fall);
      var op = i < keep ? 1 : 1 - dis;
      if (op <= 0.01) continue;
      if (sol === "i2") h += '<rect x="' + r1(gx) + '" y="' + r1(gy) + '" width="5" height="3" rx=".5" fill="var(--ink)"' + opA(op) + ' transform="rotate(' + (i * 37 % 60 - 30) + " " + r1(gx + 2.5) + " " + r1(gy + 1.5) + ')"/>';
      else h += '<rect x="' + r1(gx) + '" y="' + r1(gy) + '" width="4.5" height="4.5" rx="' + (sol === "sugar" ? 1.6 : 0.4) + '" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1"' + opA(op) + "/>";
    }
  }
  h += '<path d="M16 6 V100 A16 16 0 0 0 48 100 V6" fill="none" stroke="var(--ink-2)" stroke-width="2"/><path d="M12 6 H52" stroke="var(--ink-2)" stroke-width="2"/></g>';
  return h;
}
function ionZoomSVG(){
  var h = T(140, 14, "In water", { fs:13, w:700 }) + T(420, 14, "In hexane", { fs:13, w:700 }) + Ln(290, 24, 290, 186, { c:"var(--rule)", w:1.5, d:"5 5" });
  function ion(x, y, el, sgn, r){ var k = atomCol(el); return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + k.fill + '"/>' + T(x, y, el + (sgn > 0 ? "⁺" : "⁻"), { fs:r * 0.78, w:700, c:k.ink }); }
  [[80, 100, "Na", 1, 15], [210, 100, "Cl", -1, 17]].forEach(function(o){
    for (var i = 0; i < 6; i++) {
      var a = i * Math.PI / 3 + 0.3, dist = o[3] > 0 ? 38 : 44, wx = o[0] + dist * Math.cos(a), wy = o[1] + dist * Math.sin(a);
      h += glyph("water", wx, wy, o[3] > 0 ? a : a + Math.PI, false);
    }
    h += ion(o[0], o[1], o[2], o[3], o[4]);
  });
  for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) { var na = (r + c) % 2 === 0, x = 390 + c * 22, y = 78 + r * 22, k = atomCol(na ? "Na" : "Cl"); h += '<circle cx="' + x + '" cy="' + y + '" r="' + (na ? 7 : 9.5) + '" fill="' + k.fill + '" stroke="var(--sheet)" stroke-width="1"/>' + T(x, y, na ? "+" : M, { fs:10, w:700, c:k.ink }); }
  h += glyph("hexane", 340, 50, 0.4) + glyph("hexane", 495, 70, 1.3) + glyph("hexane", 350, 160, -0.3) + glyph("hexane", 480, 160, 0.2);
  return h;
}
function sceneWorldSVG(){
  var h = '<rect x="10" y="78" width="300" height="84" rx="6" fill="var(--pen)" fill-opacity=".16"/><path d="M40 78 Q120 70 200 78 T300 78 L300 86 Q200 92 120 86 T40 86 Z" fill="var(--at-s)" fill-opacity=".55"/>';
  for (var i = 0; i < 9; i++) h += '<circle cx="' + (34 + i * 9) + '" cy="76" r="4" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.4"/>';
  h += T(160, 30, "oil sheen: nonpolar, less dense", { fs:13, w:700 }) + Ln(160, 40, 180, 70, { c:"var(--ink-2)", w:1.4 }) + T(70, 58, "boom", { fs:12, c:"var(--ink-2)" }) + T(160, 130, "water: polar", { fs:13 });
  h += '<path d="M400 20 H430 V40 Q450 48 450 70 V158 Q450 164 444 164 H386 Q380 164 380 158 V70 Q380 48 400 40 Z" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
    '<path d="M382 112 H448 V158 Q448 162 444 162 H386 Q382 162 382 158 Z" fill="var(--pen)" fill-opacity=".18"/><path d="M382 84 H448 V112 H382 Z" fill="var(--at-s)" fill-opacity=".45"/>' +
    T(470, 98, "oil", { fs:13, a:"start" }) + T(470, 138, "vinegar", { fs:13, a:"start" }) + T(470, 154, "(mostly water)", { fs:11, a:"start", c:"var(--ink-2)" });
  return h;
}
function part3(host, api){
  var C = api.content, S = api.S, s1 = C.s1, s2 = C.s2, s3 = C.s3, LQ = s1.liquids;
  if (["water", "ethanol", "hexane", "away"].indexOf(S.rod) < 0) S.rod = "away";
  if (!S.obs || typeof S.obs !== "object") S.obs = {};
  if (!S.tubes || typeof S.tubes !== "object") S.tubes = {};
  if (!S.inv || typeof S.inv !== "object") S.inv = { sel:{} }; S.inv.sel = S.inv.sel || {};
  var bst = { rx:S.rod === "away" ? 560 : LQX[S.rod] + 50, b:{} }, ang = ZP.map(function(_, i){ return rnd(i + 3) * Math.PI * 2; }), btw = null, ztw = null, tubeT = {};
  LQ.forEach(function(q){ bst.b[q.id] = S.rod === q.id ? 1 : 0; });
  host.innerHTML =
    '<div class="bp-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="bp-rodc"></div><div class="bp-bench"><svg class="bp-bsvg" viewBox="0 0 520 300" role="img" aria-label=""></svg></div><p class="bp-bcap" aria-live="polite"></p>' +
    '<div class="bp-obs"></div><details class="alg bp-z1"><summary>' + s1.zoom + '</summary><svg class="bp-zsvg" viewBox="0 0 520 170" role="img" aria-label=""></svg><p class="bp-ztxt"></p></details><div class="q bp-inv"></div></div>' +
    '<div class="part bp-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="bp-tubes"></div><p class="bp-tcap" aria-live="polite"></p><h4 class="bp-h4">' + s2.table.title + '</h4><div class="bp-ttab"></div>' +
    '<details class="alg"><summary>' + s2.zoom + '</summary><svg class="bp-isvg" viewBox="0 0 560 196" role="img" aria-label="In water: a sodium ion surrounded by six water molecules with their O ends facing it, and a chloride ion surrounded by six water molecules with their H ends facing it. In hexane: sodium and chloride ions stay packed in a crystal, with hexane molecules around it.">' + ionZoomSVG() + "</svg><p>" + s2.zoomText + "</p></details></div>" +
    '<div class="part bp-st"><h3>' + s3.title + '</h3><svg class="bp-wsvg" viewBox="0 0 520 172" role="img" aria-label="' + esc(s3.aria) + '">' + sceneWorldSVG() + "</svg>" + s3.html + "</div>";
  var bsvg = $(".bp-bsvg", host), zsvg = $(".bp-zsvg", host);
  // Station 1
  var RR = radios($(".bp-rodc", host), { label:s1.rodLabel, aria:s1.rodLabel, cls:"chips", options:LQ.map(function(q){ return { id:q.id, t:q.t }; }).concat([{ id:"away", t:s1.away }]), value:S.rod, onChange:function(v){ S.rod = v; api.save(); moveRod(); } });
  function polarOf(id){ return id !== "hexane" && id !== "away"; }
  function paintBench(){
    bsvg.innerHTML = benchSVG(bst, LQ);
    bsvg.setAttribute("aria-label", "Three burettes release streams of water, ethanol and hexane. " + (S.rod === "away" ? "The charged rod is away, and all three streams fall straight." : "The charged rod is next to the " + S.rod + " stream. " + LQ.filter(function(q){ return q.id === S.rod; })[0].obs + "."));
  }
  function paintZoom(){
    var kind = S.rod === "away" ? "water" : S.rod, on = S.rod !== "away";
    zsvg.innerHTML = zoomSVG(kind, ang, on);
    $(".bp-ztxt", host).textContent = "";
    $(".bp-ztxt", host).innerHTML = "<strong>" + (on ? cap1(kind) : "Water") + ":</strong> " + (!on ? s1.zoomText.away : kind === "hexane" ? s1.zoomText.hexane : s1.zoomText.polar);
    zsvg.setAttribute("aria-label", on ? (kind === "hexane" ? "Hexane molecules near the charged rod stay pointing every which way." : cap1(kind) + " molecules near the charged rod have turned so their δ+ H ends face the rod.") : "Water molecules pointing every which way, with no rod nearby.");
  }
  function paintObs(){
    var T1 = s1.table;
    $(".bp-obs", host).innerHTML = MV.tableHTML({ head:T1.head, rows:LQ.map(function(q){ return [q.t, q.pol, S.obs[q.id] ? q.obs : '<span class="muted">' + T1.wait + "</span>"]; }), caption:s1.title });
  }
  function moveRod(){
    if (btw) btw(); if (ztw) ztw();
    var from = { rx:bst.rx, b:Object.assign({}, bst.b) }, toX = S.rod === "away" ? 560 : LQX[S.rod] + 50, cap = $(".bp-bcap", host);
    var kind = S.rod === "away" ? "water" : S.rod, a0 = ang.slice(), a1 = ZP.map(function(_, i){ var r0 = rnd(i + 3) * Math.PI * 2; return S.rod !== "away" && polarOf(kind) ? 0 : r0; });
    cap.textContent = "";
    btw = MV.tween({ dur:900, step:function(t){ bst.rx = lerp(from.rx, toX, t); LQ.forEach(function(q){ bst.b[q.id] = lerp(from.b[q.id], S.rod === q.id ? 1 : 0, t); }); paintBench(); }, done:function(){
      btw = null;
      if (S.rod !== "away") { var q = LQ.filter(function(x){ return x.id === S.rod; })[0]; S.obs[q.id] = true; api.save(); paintObs(); cap.textContent = q.t + ": " + q.obs + "."; }
      else cap.textContent = "Rod away: all three streams fall straight.";
    } });
    ztw = MV.tween({ dur:1000, step:function(t){ ang = a0.map(function(a, i){ var d = ((a1[i] - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI; return a + d * t; }); paintZoom(); }, done:function(){ ztw = null; ang = a1; paintZoom(); } });
  }
  // investigation item (not scored)
  var inv = $(".bp-inv", host), I = s1.inv;
  function paintInv(){
    var sel = S.inv.sel, h = '<div class="q-prompt">' + I.prompt + '</div><div class="chips bp-ichips" role="group" aria-label="Variables">' + I.chips.map(function(c){ var on = !!sel[c.id]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-iv="' + c.id + '" data-k="iv' + c.id + '">' + c.t + "</button>"; }).join("") + '</div><div class="q-actions"><button type="button" class="btn primary sm" data-act="ivchk" data-k="ivchk">Check</button></div>';
    if (S.inv.fb) h += MV.fbHTML(S.inv.fb === "right" ? "good" : "bad", (S.inv.fb === "right" ? "" : "<strong>✗ Not quite.</strong> ") + (S.inv.fb === "right" ? I.right : S.inv.fb === "colour" ? I.colour : I.missing));
    MV.keepFocus(inv, function(){ inv.innerHTML = h; });
  }
  inv.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.iv) { S.inv.sel[b.dataset.iv] = !S.inv.sel[b.dataset.iv]; S.inv.fb = null; api.save(); paintInv(); return; }
    if (b.dataset.act === "ivchk") {
      var sel = S.inv.sel, miss = I.chips.some(function(c){ return c.need && !sel[c.id]; });
      S.inv.fb = sel.colour ? "colour" : miss ? "missing" : "right"; api.save(); paintInv(); MV.focusFb(inv);
    }
  });
  // Station 2
  var tubes = $(".bp-tubes", host), tcap = $(".bp-tcap", host);
  function tkey(a, b){ return a + "|" + b; }
  function tubeBtn(sol, solv){
    var k = tkey(sol.id, solv.id), done = !!S.tubes[k], r = s2.res[k], t = tubeT[k] != null ? tubeT[k] : done ? 1 : -1;
    return '<button type="button" class="bp-tube' + (done ? " done" : "") + '" data-tube="' + k + '" data-k="tb' + k + '" aria-label="' + esc(done ? MV.plain(sol.t) + " in " + MV.plain(solv.t) + ": " + MV.plain(r.t) : "Add " + MV.plain(sol.t) + " to " + MV.plain(solv.t)) + '"' + (tubeT[k] != null ? " disabled" : "") + '><svg class="bp-tsvg" viewBox="0 0 64 124" aria-hidden="true">' + tubeSVG(sol.id, solv.id, r, t) + '</svg><span class="bp-tl">' + sol.t + '</span><span class="bp-tr">' + (done ? r.t : "Tap to test") + "</span></button>";
  }
  function paintTubes(){
    MV.keepFocus(tubes, function(){ tubes.innerHTML = s2.solvents.map(function(v){ return '<div class="bp-trow"><p class="bp-tsolv">' + v.t + '</p><div class="bp-tgrid">' + s2.solutes.map(function(u){ return tubeBtn(u, v); }).join("") + "</div></div>"; }).join(""); });
    var TT = s2.table;
    $(".bp-ttab", host).innerHTML = MV.tableHTML({ head:TT.head, rows:s2.solutes.map(function(u){ return [u.t].concat(s2.solvents.map(function(v){ var k = tkey(u.id, v.id); return S.tubes[k] ? TT.cells[k] : '<span class="muted">' + TT.wait + "</span>"; })); }), caption:TT.title });
  }
  tubes.addEventListener("click", function(e){
    var b = e.target.closest("[data-tube]"); if (!b || b.disabled) return;
    var k = b.dataset.tube, p = k.split("|"), sol = s2.solutes.filter(function(u){ return u.id === p[0]; })[0], solv = s2.solvents.filter(function(v){ return v.id === p[1]; })[0];
    tubeT[k] = 0; paintTubes();
    MV.tween({ dur:1600, ease:function(t){ return t; }, step:function(t){ tubeT[k] = t; var sv = tubes.querySelector('[data-tube="' + k + '"] svg'); if (sv) sv.innerHTML = tubeSVG(p[0], p[1], s2.res[k], t); }, done:function(){
      delete tubeT[k]; S.tubes[k] = true; api.save(); paintTubes(); tcap.innerHTML = MV.plain(sol.t) + " in " + MV.plain(solv.t).toLowerCase() + ": " + s2.res[k].t;
      var nb = tubes.querySelector('[data-tube="' + k + '"]'); if (nb) nb.focus({ preventScroll:true });
    } });
  });
  paintBench(); paintZoom(); paintObs(); paintInv(); paintTubes();
  return {};
}

// ---------- Practice 2: Polar or not? (chips; from SCH4U 17's bestAct) ----------
function polarAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:null, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-bi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="chips bp-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.options[x.pick].t + ".</strong> " + (it.options[x.pick].why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-bi]"); if (!bx) return;
    var it = a.items.filter(function(q){ return q.id === bx.dataset.bi; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      if (x.pick == null) { msgs[it.id] = { t:"Choose an answer first.", soft:true }; paint(); return; }
      if (MV.ok(it.options[x.pick])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:it.options[x.pick].why }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-bi="' + it.id + '"]'));
    }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-op]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = Array.prototype.slice.call(b.parentNode.querySelectorAll("[data-op]")), nx = all[(all.indexOf(b) + d + all.length) % all.length]; nx.click();
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Polar bonds, nonpolar molecule (centre + outer atoms, live 3D model) ----------
var task = (function(){
  var S = null, api = null, V = null, TK = null, R = {}, NPOS = { B:3, C:4, N:3, O:2 }, GT = { B:"tp", C:"tet", N:"pyr", O:"bent" }, lastC = "";
  function read(){ var c = S && NPOS[S.c] ? S.c : ""; return { c:c, o:c ? S.o.slice(0, NPOS[c]) : [] }; }
  function info(d){
    var sc = star(d.c, GT[d.c], d.o), dp = dips(sc), ds = dp.list.map(function(x){ return x.d; });
    sc.form = formOf(d.c, d.o);
    return { sc:sc, dp:dp, any:ds.some(function(v){ return v >= 0.5; }), cancel:d.o.every(function(x){ return x === d.o[0]; }) && (d.c === "B" || d.c === "C"), low:ds.every(function(v){ return v < 1.5; }) };
  }
  function paintPos(){
    var host = $(".bp-tk-pos"), d = read(); if (!host) return;
    host.innerHTML = d.c ? d.o.map(function(_, i){ return '<div class="bp-tk-row" data-pi="' + i + '"></div>'; }).join("") : '<p class="tiny muted">' + "Choose a central atom first." + "</p>";
    d.o.forEach(function(v, i){ radios($('[data-pi="' + i + '"]', host), { label:TK.inputs.pos + " " + (i + 1), aria:TK.inputs.pos + " " + (i + 1), cls:"chips", options:TK.inputs.outers.map(function(el){ return { id:el, t:el }; }), value:v, onChange:function(x){ S.o[i] = x; api.save(); paint(); api.update(); } }); });
  }
  function paint(){
    var d = read(), rd = $(".bp-tkr"); if (!V || !rd) return;
    if (!d.c) { V.show([], {}); rd.innerHTML = '<p class="tiny muted">Choose a central atom to see the model.</p>'; return; }
    var I = info(d), K = kinds(I.sc, I.dp), lp = (I.sc.lps || []).length;
    V.show([I.sc], { dips:[I.dp], aria:plainF(I.sc.form) + ": " + MV.plain(I.sc.shape) + ". " + (I.dp.mag > 0 ? "Net dipole toward the " + sideOf(I.sc, I.dp.net) + " side." : "Net dipole 0."), hits:[] }, d.c !== lastC);
    lastC = d.c;
    rd.innerHTML = "<p><strong>" + CF(I.sc.form) + "</strong>: " + I.sc.shape + "; " + (lp ? lp + " lone pair" + (lp > 1 ? "s" : "") : "no lone pairs") + " on " + d.c + ".</p><ul class=\"bp-tkl\">" + K.map(function(k){ return "<li>" + subLine(k) + " (" + btype(k.d) + ")</li>"; }).join("") + "<li>Net dipole: " + (I.dp.mag > 0 ? "yes, toward the " + sideOf(I.sc, I.dp.net) + " side" : "0") + "</li></ul>";
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; TK = MV.C.task;
      if (!NPOS[S.c]) S.c = "";
      if (!okOuts(S.o, 4)) S.o = ["H", "H", "H", "H"];
      inp.innerHTML = '<div class="bp-tk-c"></div><div class="bp-tk-pos"></div>';
      R.c = radios($(".bp-tk-c", inp), { label:TK.inputs.centre, aria:TK.inputs.centre, cls:"chips", options:TK.inputs.centres.map(function(c){ return { id:c.id, t:c.t + ' <span class="bp-sub">' + c.sub + "</span>" }; }), value:S.c, onChange:function(v){ S.c = v; api.save(); paintPos(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="bp-h4">Live 3D model</h4><div class="bp-tkv"></div><div class="bp-tkr" aria-live="polite"></div>';
      V = viewer($(".bp-tkv", pv));
      paintPos(); paint();
    },
    read:read,
    valid:function(d){ return d.c ? true : "Choose a central atom first."; },
    checks:function(d){ if (!d.c) return [false, false, false]; var I = info(d); return [I.any, I.cancel, I.low]; },
    key:function(d){ return formOf(d.c, d.o); },
    label:function(k){ return CF(k); },
    text:function(k){ return plainF(k); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ polar:polarAct },
  task:task
});
})();
