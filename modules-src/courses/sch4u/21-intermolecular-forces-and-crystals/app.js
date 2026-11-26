// SCH4U 21 Intermolecular Forces and Crystals: hero (water boiling: hydrogen bonds snap, molecules stay whole), Force strength
// lab (Explore: particle views with force lines, boiling-point bars, trend graphs with a prediction dot, solid lattices with
// heat / scratch / conductivity tests), Identify the solid (Part 3: token test bench, Check it with data, materials),
// "Which boils higher?" set and the "Boiling-point staircase" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f, MI = "−";
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function esc(s){ return MV.esc(s); }
function rnd(i){ var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
function degC(v){ return MV.chem.fx(v, 0) + " °C"; }
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + r1(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + (o.halo ? ' stroke="var(--sheet)" stroke-width="3.5" paint-order="stroke" stroke-linejoin="round"' : "") + (o.cls ? ' class="' + o.cls + '"' : "") + opA(o.op) + ">" + s + "</text>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink-2)") + '" stroke-width="' + r1(o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + (o.cls ? ' class="' + o.cls + '"' : "") + (o.data || "") + opA(o.op) + "/>"; }
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + fill + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.4) + '"' : "") + opA(o.op) + "/>"; }
function ball(el, x, y, r, o){
  o = o || {}; var c = MV.chem.atom(el), lab = o.lab || el, fs = o.fs || Math.max(7, r * (lab.length > 2 ? 0.78 : lab.length > 1 ? 0.95 : 1.15));
  return '<g' + opA(o.op) + ">" + circ(x, y, r, o.fill || c.fill, { s:el === "H" ? c.line : o.s, sw:1.3 }) + tx(x, y + 0.5, lab, { fs:r1(fs), w:700, c:o.ink || c.ink }) + "</g>";
}

// @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set, get, lock, paint}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id); return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (val === "" && x === o.options[0]) ? 0 : -1) + '" data-rg="' + x.id + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val);
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- substance data ----------
var ZN = { H:1, He:2, C:6, N:7, O:8, F:9, Ne:10, Si:14, P:15, S:16, Cl:17, Ar:18, Ge:32, As:33, Se:34, Br:35, Kr:36, Sn:50, Sb:51, Te:52, I:53, Xe:54 };
function countAtoms(f){ var o = {}, order = [], re = /([A-Z][a-z]?)(\d*)/g, m; while ((m = re.exec(f))) { if (!o[m[1]]) { o[m[1]] = 0; order.push(m[1]); } o[m[1]] += m[2] ? +m[2] : 1; } return { n:o, order:order }; }
function electrons(f){ var c = countAtoms(f), n = 0; c.order.forEach(function(k){ n += ZN[k] * c.n[k]; }); return n; }
function eSum(f){ var c = countAtoms(f); return c.order.map(function(k){ return (c.n[k] > 1 ? c.n[k] + " × " : "") + k + " " + ZN[k]; }).join(" + "); }
// Boiling points (°C): course table additions listed in this plan's §6 item 1. Alkanes come from MV.chem.data.bp.
var BPX = { He:-269, Ne:-246, Ar:-186, Kr:-153, Xe:-108, F2:-188, Cl2:-34, Br2:59, I2:184, NH3:-33, PH3:-88, AsH3:-62, SbH3:-17,
  H2O:100, H2S:-60, H2Se:-41, H2Te:-2, HF:20, HCl:-85, HBr:-67, HI:-35, SiH4:-112, GeH4:-88, SnH4:-52, CH3OH:65, CH3OCH3:-24, C2H5OH:78 };
var ALK = { CH4:"methane", C2H6:"ethane", C3H8:"propane", C4H10:"butane", C5H12:"pentane", C6H14:"hexane", C7H16:"heptane", C8H18:"octane",
  pentane:"pentane", "2-methylbutane":"2-methylbutane", "2,2-dimethylpropane":"2,2-dimethylpropane" };
function bpOf(id){ if (ALK[id]) return MV.chem.bpOf(ALK[id]); return BPX[id] != null ? BPX[id] : null; }
// Glyphs: heavy atoms [el, x, y] in Å with the δ+ (or donor H) end on the left and the δ− end on the right; h: explicit H
// [x, y, parent]; auto: H on carbon added automatically (left out of the drawing, kept in the surface outline).
var SUB = {
  Ne:{ f:"Ne", nm:"neon", atoms:true, g:{ a:[["Ne", 0, 0]] } },
  CH4:{ f:"CH4", nm:"methane", g:{ a:[["C", 0, 0]], auto:true } },
  NH3:{ f:"NH3", nm:"ammonia", polar:true, hb:true, g:{ a:[["N", 0, 0]], h:[[-0.58, -0.83, 0], [-0.58, 0.83, 0], [-1.0, 0, 0]], dn:0, dp:[1, 2, 3] } },
  HF:{ f:"HF", nm:"hydrogen fluoride", polar:true, hb:true, g:{ a:[["F", 0, 0]], h:[[-0.92, 0, 0]], dn:0, dp:[1] } },
  H2O:{ f:"H2O", nm:"water", polar:true, hb:true, g:{ a:[["O", 0, 0]], h:[[-0.59, -0.76, 0], [-0.59, 0.76, 0]], dn:0, dp:[1, 2] } },
  Ar:{ f:"Ar", nm:"argon", atoms:true, g:{ a:[["Ar", 0, 0]] } },
  F2:{ f:"F2", nm:"fluorine", g:{ a:[["F", -0.71, 0], ["F", 0.71, 0]], b:[[0, 1]] } },
  SiH4:{ f:"SiH4", nm:"silane", g:{ a:[["Si", 0, 0]], h:[[-1.05, -1.05, 0], [1.05, -1.05, 0], [-1.05, 1.05, 0], [1.05, 1.05, 0]] } },
  C2H6:{ f:"C2H6", nm:"ethane", g:{ a:[["C", -0.77, 0], ["C", 0.77, 0]], b:[[0, 1]], auto:true } },
  PH3:{ f:"PH3", nm:"phosphine", polar:true, weak:true, dip:0.4, g:{ a:[["P", 0, 0]], h:[[-0.82, -1.16, 0], [-0.82, 1.16, 0], [-1.42, 0, 0]], dn:0, dp:[1, 2, 3] } },
  HCl:{ f:"HCl", nm:"hydrogen chloride", polar:true, dip:0.85, g:{ a:[["Cl", 0, 0]], h:[[-1.27, 0, 0]], dn:0, dp:[1] } },
  H2S:{ f:"H2S", nm:"hydrogen sulfide", polar:true, dip:0.7, g:{ a:[["S", 0, 0]], h:[[-0.93, -0.96, 0], [-0.93, 0.96, 0]], dn:0, dp:[1, 2] } },
  CH3OH:{ f:"CH3OH", nm:"methanol", polar:true, hb:true, g:{ a:[["O", 0, 0], ["C", 0.49, 1.34]], b:[[0, 1]], h:[[-0.96, 0, 0]], auto:true, dn:0, dp:[2] } },
  C3H8:{ f:"C3H8", nm:"propane", g:{ a:[["C", -1.26, 0.36], ["C", 0, -0.36], ["C", 1.26, 0.36]], b:[[0, 1], [1, 2]], auto:true } },
  CH3OCH3:{ f:"CH3OCH3", nm:"methoxymethane", polar:true, dip:0.8, g:{ a:[["O", 0, 0], ["C", -0.82, -1.17], ["C", -0.82, 1.17]], b:[[0, 1], [0, 2]], auto:true, dn:0, dp:[1, 2] } },
  C2H5OH:{ f:"C2H5OH", nm:"ethanol", polar:true, hb:true, g:{ a:[["O", 0, 0], ["C", 0.49, 1.34], ["C", 0.2, 2.8]], b:[[0, 1], [1, 2]], h:[[-0.96, 0, 0]], auto:true, dn:0, dp:[3] } },
  pentane:{ f:"C5H12", nm:"pentane", lab:"pentane", shape:3, g:{ a:[["C", -2.52, 0.36], ["C", -1.26, -0.36], ["C", 0, 0.36], ["C", 1.26, -0.36], ["C", 2.52, 0.36]], b:[[0, 1], [1, 2], [2, 3], [3, 4]], auto:true } },
  "2-methylbutane":{ f:"C5H12", nm:"2-methylbutane", lab:"2-methylbutane", shape:2, g:{ a:[["C", -1.89, 0.36], ["C", -0.63, -0.36], ["C", 0.63, 0.36], ["C", 1.89, -0.36], ["C", -0.63, -1.81]], b:[[0, 1], [1, 2], [2, 3], [1, 4]], auto:true } },
  "2,2-dimethylpropane":{ f:"C5H12", nm:"2,2-dimethylpropane", lab:"2,2-dimethylpropane", shape:1, g:{ a:[["C", 0, 0], ["C", -1.03, -1.03], ["C", 1.03, -1.03], ["C", -1.03, 1.03], ["C", 1.03, 1.03]], b:[[0, 1], [0, 2], [0, 3], [0, 4]], auto:true } },
  Cl2:{ f:"Cl2", nm:"chlorine", g:{ a:[["Cl", -0.99, 0], ["Cl", 0.99, 0]], b:[[0, 1]] } },
  Br2:{ f:"Br2", nm:"bromine", g:{ a:[["Br", -1.14, 0], ["Br", 1.14, 0]], b:[[0, 1]] } },
  I2:{ f:"I2", nm:"iodine", g:{ a:[["I", -1.33, 0], ["I", 1.33, 0]], b:[[0, 1]] } }
};
var MPX = { I2:114 };   // melting point (°C) from the plan's solid data; every other substance here melts below 25 °C
var ELEMENTS = { Ne:1, Ar:1, F2:1, Cl2:1, Br2:1, I2:1 };
function E(id){ return electrons(SUB[id] ? SUB[id].f : id); }
function st(id){ var s = SUB[id]; return s.hb ? "hb" : s.polar ? "dip" : "disp"; }
var RK = { disp:0, dip:1, hb:2 };
var FN = { disp:"dispersion forces", dip:"dipole–dipole forces", hb:"hydrogen bonds" };
var FS = { disp:"Dispersion", dip:"Dipole–dipole", hb:"Hydrogen bonding" };
function chipLab(id){ var s = SUB[id]; return s.lab || F(s.f); }
function nameF(id){ var s = SUB[id]; return s.lab || F(s.f); }
function stateAt25(id){ var b = bpOf(id), m = MPX[id]; return m != null && m > 25 ? "Solid" : b >= 25 ? "Liquid" : "Gas"; }

// ---------- @component C1 forceBox — particle view for intermolecular forces: 2D glyphs (H on carbon left out of the drawing
// but kept in the shaded surface outline), placed in rows with δ+ ends facing δ− ends; dispersion contact lines (faint
// --ink-2, width grows with electrons, flicker), dipole–dipole lines (--ink-2 dashed), hydrogen bonds (--e-pair dotted),
// permanent δ labels (--dl-pos / --dl-neg) and flickering temporary δ± on nonpolar particles (static with reduced motion).
// glyphOf(spec) -> glyph; boxScene(id, W, H, cols, rows, U?) -> scene; boxSVG(scene, {hb, disp}) -> svg string
var RA = { H:0.36, C:0.5, N:0.5, O:0.5, F:0.48, Ne:0.56, Si:0.64, P:0.64, S:0.64, Cl:0.64, Ar:0.64, Br:0.72, I:0.82 };
var RV = { H:0.9, C:1.25, N:1.2, O:1.18, F:1.15, Ne:1.25, Si:1.5, P:1.45, S:1.45, Cl:1.42, Ar:1.5, Br:1.52, I:1.62 };
function hAngles(nb){
  var P = Math.PI, n = nb.length;
  if (n === 0) return [P / 4, 3 * P / 4, 5 * P / 4, 7 * P / 4];
  if (n === 1) { var b = nb[0] + P; return [b - 1.1, b, b + 1.1]; }
  if (n === 2) { var sx = Math.cos(nb[0]) + Math.cos(nb[1]), sy = Math.sin(nb[0]) + Math.sin(nb[1]), bis = Math.hypot(sx, sy) < 1e-6 ? nb[0] + P / 2 : Math.atan2(-sy, -sx); return [bis - 0.62, bis + 0.62]; }
  if (n === 3) { var s = nb.slice().sort(function(a, c){ return a - c; }), best = -1, at = 0; for (var i = 0; i < 3; i++) { var a0 = s[i], a1 = i < 2 ? s[i + 1] : s[0] + 2 * P; if (a1 - a0 > best) { best = a1 - a0; at = (a0 + a1) / 2; } } return [at]; }
  return [];
}
var GC = {};
function glyphOf(id){
  if (GC[id]) return GC[id];
  var sp = SUB[id].g, at = sp.a.map(function(a){ return { el:a[0], x:a[1], y:a[2] }; }), bonds = (sp.b || []).map(function(b){ return b.slice(); }), nH = at.length;
  (sp.h || []).forEach(function(h){ at.push({ el:"H", x:h[0], y:h[1] }); bonds.push([h[2], at.length - 1]); });
  if (sp.auto) for (var i = 0; i < nH; i++) if (at[i].el === "C") {
    var nb = bonds.filter(function(b){ return b[0] === i || b[1] === i; }).map(function(b){ var j = b[0] === i ? b[1] : b[0]; return Math.atan2(at[j].y - at[i].y, at[j].x - at[i].x); });
    hAngles(nb).forEach(function(t){ at.push({ el:"H", x:at[i].x + Math.cos(t), y:at[i].y + Math.sin(t), hid:true }); bonds.push([i, at.length - 1]); });
  }
  var don = [], acc = [];
  at.forEach(function(a, k){ if (a.el === "N" || a.el === "O" || a.el === "F") acc.push(k); });
  bonds.forEach(function(b){ [0, 1].forEach(function(s){ var h = b[s], o = b[1 - s]; if (at[h].el === "H" && acc.indexOf(o) >= 0) don.push(h); }); });
  var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  at.forEach(function(a){ x0 = Math.min(x0, a.x); x1 = Math.max(x1, a.x); y0 = Math.min(y0, a.y); y1 = Math.max(y1, a.y); });
  return (GC[id] = { at:at, bonds:bonds, don:don, acc:acc, dn:sp.dn, dp:sp.dp || [], ext:[x0, x1, y0, y1] });
}
// spacing between particle origins (Å): surfaces just touch (0.92 × the outer atoms' surface radii); hydrogen-bonded rows
// put the donor H 1.95 Å from the acceptor of the next particle
function stepsOf(g, hb){
  var lo = null, hi = null, top = null, bot = null;
  g.at.forEach(function(a){ if (!lo || a.x < lo.x) lo = a; if (!hi || a.x > hi.x) hi = a; if (!top || a.y < top.y) top = a; if (!bot || a.y > bot.y) bot = a; });
  var sx = g.ext[1] - g.ext[0] + 0.92 * (RV[lo.el] + RV[hi.el]), sy = g.ext[3] - g.ext[2] + 0.92 * (RV[top.el] + RV[bot.el]);
  if (hb && g.don.length) sx = g.at[g.dn].x - Math.min.apply(null, g.don.map(function(k){ return g.at[k].x; })) + 1.95;
  return [sx, sy];
}
function fitU(id, W, H, cols, rows){ var s = stepsOf(glyphOf(id), SUB[id].hb); return Math.min(30, (W - 16) / (cols * s[0]), (H - 16) / (rows * s[1])); }
// best grid for a box: the layout with the largest scale (ties go to more particles)
function bestGrid(id, W, H, two){ var L = two ? [[2, 2], [3, 1], [1, 3]] : [[3, 2], [2, 3]], best = null; L.forEach(function(g){ var u = fitU(id, W, H, g[0], g[1]); if (!best || u > best.u * 1.08) best = { c:g[0], r:g[1], u:u }; }); return best; }
function boxScene(id, W, H, cols, rows, U){
  var g = glyphOf(id), s = stepsOf(g, SUB[id].hb), mols = [], c, r;
  U = U || fitU(id, W, H, cols, rows);
  var gw = cols * s[0], gh = rows * s[1], cx = (g.ext[0] + g.ext[1]) / 2, cy = (g.ext[2] + g.ext[3]) / 2;
  for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) mols.push({ c:c, r:r, ox:(c + 0.5) * s[0] - gw / 2 - cx, oy:(r + 0.5) * s[1] - gh / 2 - cy });
  function P(m, k){ return { x:m.ox + g.at[k].x, y:m.oy + g.at[k].y }; }
  var hbl = [], dpl = [], dsl = [], sub = SUB[id], e = E(id), hbc = [], pairHB = {};
  if (sub.hb) {
    mols.forEach(function(mi, i){ mols.forEach(function(mj, j){ if (i === j) return; g.don.forEach(function(h){ g.acc.forEach(function(a){ var ph = P(mj, h), pa = P(mi, a), d = Math.hypot(pa.x - ph.x, pa.y - ph.y); if (d < 2.75) hbc.push({ d:d, ph:ph, pa:pa, dk:j + ":" + h, ak:i + ":" + a, cap:g.at[a].el === "N" ? 1 : 2, pk:Math.min(i, j) + "|" + Math.max(i, j) }); }); }); }); });
    hbc.sort(function(p, q){ return p.d - q.d; });
    var dUsed = {}, aLoad = {};
    hbc.forEach(function(c){ if (dUsed[c.dk] || (aLoad[c.ak] || 0) >= c.cap) return; dUsed[c.dk] = 1; aLoad[c.ak] = (aLoad[c.ak] || 0) + 1; hbl.push([c.ph, c.pa]); pairHB[c.pk] = 1; });
  }
  mols.forEach(function(mi, i){ mols.forEach(function(mj, j){
    if (j <= i || Math.abs(mi.c - mj.c) + Math.abs(mi.r - mj.r) !== 1) return;
    var row = mi.r === mj.r && sub.polar;
    if (row && !sub.hb) { var L = mi.c < mj.c ? mi : mj, R = L === mi ? mj : mi, pn = P(L, g.dn), bestP = null; g.dp.forEach(function(k){ var pp = P(R, k), d = Math.hypot(pp.x - pn.x, pp.y - pn.y); if (!bestP || d < bestP.d) bestP = { d:d, pp:pp }; }); if (bestP) dpl.push([pn, bestP.pp]); }
    if (row || pairHB[i + "|" + j]) return;
    // dispersion: short marks where the surfaces touch (closest atom pairs, H on carbon included), one per atom, at most 6
    var cand = [];
    g.at.forEach(function(a, ka){ g.at.forEach(function(b, kb){ var pa = P(mi, ka), pb = P(mj, kb), d = Math.hypot(pa.x - pb.x, pa.y - pb.y) - 0.92 * (RV[a.el] + RV[b.el]); cand.push({ ka:ka, kb:kb, d:d, pa:pa, pb:pb, ra:RV[a.el], rb:RV[b.el] }); }); });
    cand.sort(function(p, q){ return p.d - q.d; });
    var dmin = cand.length ? cand[0].d : 0, ua = {}, ub = {}, n = 0;
    cand.forEach(function(p){
      if (n >= 6 || p.d > dmin + 0.35 || ua[p.ka] || ub[p.kb]) return; ua[p.ka] = ub[p.kb] = 1; n++;
      var dx = p.pb.x - p.pa.x, dy = p.pb.y - p.pa.y, L2 = Math.hypot(dx, dy) || 1, f = p.ra / (p.ra + p.rb), ea = g.at[p.ka], eb = g.at[p.kb];
      dsl.push({ x:p.pa.x + dx * f, y:p.pa.y + dy * f, ux:dx / L2, uy:dy / L2, ph:i * 7 + n, free:L2 - (ea.hid ? 0 : RA[ea.el]) - (eb.hid ? 0 : RA[eb.el]) });
    });
  }); });
  return { id:id, g:g, U:U, W:W, H:H, mols:mols, hbl:hbl, dpl:dpl, dsl:dsl, e:e, sub:sub };
}
function boxSVG(sc, o){
  o = o || {}; var U = sc.U, W = sc.W, H = sc.H, g = sc.g, sub = sc.sub, ox = W / 2, oy = H / 2, s = "", hbK = o.hb == null ? 1 : o.hb, dK = o.disp == null ? 1 : o.disp;
  function X(p){ return ox + p.x * U; } function Y(p){ return oy + p.y * U; }
  s += '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10" fill="var(--sheet)" stroke="var(--rule)" stroke-width="1.5"/>';
  // surface outlines (union per molecule)
  s += '<g opacity=".55">';
  sc.mols.forEach(function(m){ s += "<g>" + g.at.map(function(a){ return circ(ox + (m.ox + a.x) * U, oy + (m.oy + a.y) * U, RV[a.el] * U, "var(--hi-soft)"); }).join("") + "</g>"; });
  s += "</g>";
  var wD = clamp(1 + sc.e / 22, 1.4, 6), hl = clamp(U * 0.55, 6, 11);
  if (dK > 0.01) sc.dsl.forEach(function(d){ var h = Math.min(hl, Math.max(2.5, d.free * U * 0.28)) * dK; s += ln(X(d) - d.ux * h, Y(d) - d.uy * h, X(d) + d.ux * h, Y(d) + d.uy * h, { w:wD, c:"var(--ink-2)", op:0.75 * dK, cls:"imf-fl", data:' data-ph="' + d.ph + '"' }); });
  var wP = 1 + 2 * (sub.dip || 0.8);
  sc.dpl.forEach(function(L){ s += ln(X(L[0]), Y(L[0]), X(L[1]), Y(L[1]), { w:wP, c:"var(--ink-2)", d:"5 4", op:0.9 }); });
  if (hbK > 0.01) sc.hbl.forEach(function(L){ s += ln(X(L[0]), Y(L[0]), X(L[1]), Y(L[1]), { w:3.4, c:"var(--e-pair)", d:"0.5 5", op:hbK }); });
  var r = function(el){ return Math.max(el === "H" ? 5.5 : 7, RA[el] * U); }, fs = clamp(U * 0.6, 10, 14);
  sc.mols.forEach(function(m, mi){
    g.bonds.forEach(function(b){ var a = g.at[b[0]], c = g.at[b[1]]; if (a.hid || c.hid) return; s += ln(ox + (m.ox + a.x) * U, oy + (m.oy + a.y) * U, ox + (m.ox + c.x) * U, oy + (m.oy + c.y) * U, { w:2.2, c:"var(--ink)" }); });
    g.at.forEach(function(a){ if (!a.hid) s += ball(a.el, ox + (m.ox + a.x) * U, oy + (m.oy + a.y) * U, r(a.el)); });
    if (sub.polar) {
      var dn = g.at[g.dn], tp = g.dp.map(function(k){ return g.at[k]; }).sort(function(a, b){ return a.y - b.y || a.x - b.x; })[0];
      s += tx(ox + (m.ox + dn.x) * U + r(dn.el) * 0.6, oy + (m.oy + dn.y) * U - r(dn.el) - 7, "δ" + MI, { fs:fs, w:700, c:"var(--dl-neg)", halo:true, a:"start" });
      s += tx(ox + (m.ox + tp.x) * U - r(tp.el) * 0.6, oy + (m.oy + tp.y) * U - r(tp.el) - 7, "δ+", { fs:fs, w:700, c:"var(--dl-pos)", halo:true, a:"end" });
    } else {
      // temporary dipoles: the two end atoms flicker δ+ / δ− (static on the first particle with reduced motion)
      var vis = g.at.filter(function(a){ return !a.hid; }), L0 = vis.reduce(function(p, a){ return a.x < p.x ? a : p; }), R0 = vis.reduce(function(p, a){ return a.x > p.x ? a : p; }), show = MV.reduceMotion ? (mi === 0 ? 1 : 0) : 0, flip = mi % 2, one = L0 === R0;
      [[L0, flip ? "δ+" : "δ" + MI, one ? -1 : 0], [R0, flip ? "δ" + MI : "δ+", one ? 1 : 0]].forEach(function(q, k){
        var a = q[0], x = ox + (m.ox + a.x) * U + (one ? q[2] * (r(a.el) + 2) : 0), y = oy + (m.oy + a.y) * U - (one ? 0 : r(a.el) + 6);
        s += tx(x, y, q[1], { fs:fs * 0.9, w:700, c:"var(--ink-2)", a:one ? (k ? "start" : "end") : "middle", op:show, cls:"imf-tf", halo:true }).replace("<text ", '<text data-ph="' + (mi * 3 + 1) + '" ');
      });
    }
  });
  if (MV.reduceMotion && sc.dsl.length && dK > 0.5) { var d0 = sc.dsl[0]; s += tx(X(d0), Y(d0) - hl - 8, "dispersion", { fs:11, c:"var(--ink-2)", halo:true }); }
  return s;
}
function boxAria(sc, o){
  o = o || {}; var s = sc.sub, n = sc.mols.length, t = n + " " + MV.plain(nameF(sc.id)) + (s.atoms ? " atoms" : " molecules") + ".";
  if (sc.hbl.length && (o.hb == null || o.hb > 0.5)) t += " Violet dotted hydrogen bonds join an H on one molecule to the " + (s.f === "HF" ? "F" : s.f === "NH3" ? "N" : "O") + " of the next.";
  if (sc.dpl.length) t += " The δ+ end of each molecule faces the δ− end of its neighbour: dipole–dipole attractions.";
  if (!s.polar) t += " Only faint dispersion lines" + (s.atoms ? " between the atoms" : "") + ", from temporary dipoles.";
  if (s.shape) t += s.shape === 3 ? " The zig-zag chains lie alongside each other and touch along their length." : s.shape === 1 ? " The ball-shaped molecules touch each other at only a few points." : " The branched molecules touch along part of their length.";
  return t;
}

// ---------- boiling-point column chart (adapted from SCH4U 03 bpBars): −260 to 200 °C with 0 °C and 25 °C reference lines ----------
// @component bpBars (from SCH4U 03, fixed −260 to 200 °C scale with 0 °C and 25 °C reference lines)
function bpSVG(ids, vals, hide){
  var W = ids.length > 1 ? 300 : 240, H = 250, top = 26, bot = 214, lo = -260, hi = 200, L = 44, RM = 70;
  function Y(v){ return bot - (clamp(v, lo, hi) - lo) / (hi - lo) * (bot - top); }
  var s = "";
  [-200, -100, 0, 100, 200].forEach(function(v){ var y = r1(Y(v)); s += ln(L, y, W - RM, y, { w:1, c:"var(--plot-grid)" }) + tx(L - 5, y, MV.chem.fx(v, 0), { fs:11, a:"end", c:"var(--ink-2)" }); });
  s += ln(L, Y(0), W - RM + 4, Y(0), { w:1.6, c:"var(--ink-2)", d:"5 4" }) + ln(L, Y(25), W - RM + 4, Y(25), { w:1.6, c:"var(--ink)", d:"2 3" });
  s += tx(W - RM + 8, Y(25) - 6, "25 °C (room)", { fs:10.5, a:"start", c:"var(--ink)" }) + tx(W - RM + 8, Y(0) + 7, "0 °C", { fs:10.5, a:"start", c:"var(--ink-2)" });
  s += tx(4, 10, "Boiling point (°C)", { fs:11, a:"start", w:700, c:"var(--ink-2)" });
  var cw = (W - L - RM) / ids.length;
  ids.forEach(function(id, i){
    var v = vals ? vals[i] : bpOf(id), cx = L + cw * (i + 0.5), bw = Math.min(46, cw * 0.5);
    if (hide) s += tx(cx, (top + bot) / 2, "?", { fs:26, w:700, c:"var(--ink-2)" });
    else { var y = Y(v); s += '<rect x="' + r1(cx - bw / 2) + '" y="' + r1(y) + '" width="' + r1(bw) + '" height="' + r1(Math.max(2, bot - y)) + '" rx="4" fill="var(--pen)"' + (i ? ' fill-opacity=".45" stroke="var(--pen)" stroke-width="1.5"' : "") + "/>" + tx(cx, y - 9, degC(Math.round(v)), { fs:13, w:700, halo:true }); }
    var lab = MV.plain(nameF(id)); s += tx(cx, bot + 16, lab, { fs:lab.length > 15 ? 9.5 : lab.length > 10 ? 10.5 : 12, w:700 });
  });
  var aria = "Boiling points: " + ids.map(function(id, i){ return MV.plain(nameF(id)) + " " + (hide ? "hidden until the reveal" : MV.plain(degC(Math.round(vals ? vals[i] : bpOf(id))))); }).join("; ") + ". Reference lines at 0 °C and 25 °C.";
  return '<svg class="imf-bsvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(aria) + '">' + s + "</svg>";
}

// ---------- readout rows and the generated "Why" line ----------
function whyOf(a, b){
  var A = SUB[a], ea = E(a), ba = bpOf(a), sa = st(a);
  if (!b) {
    return (sa === "hb" ? "Hydrogen bonds (H on N, O or F, attracted to a lone pair) hold its molecules together, on top of dispersion forces."
      : sa === "dip" ? "Its polar molecules attract δ+ to δ" + MI + ", on top of dispersion forces."
      : A.atoms ? "Only dispersion forces between its atoms; they grow with the number of electrons (" + ea + ")."
      : "Only dispersion forces; they grow with the number of electrons (" + ea + ") and with surface contact.") + " Pick a second substance to compare.";
  }
  var B = SUB[b], eb = E(b), bb = bpOf(b), sb = st(b), nB = nameF(b), nmB = nB + " (" + degC(bb) + ")";
  if (ea === eb) {
    if (RK[sa] > RK[sb]) return "Same electrons as " + nmB + ", but " + (sa === "hb" ? "hydrogen bonds hold it together." : "dipole–dipole forces add to its dispersion forces.");
    if (RK[sa] < RK[sb]) return "Same electrons as " + nmB + ", but only " + nB + " has " + FN[sb] + ", so " + nB + " boils higher.";
    if (A.shape && B.shape && A.shape !== B.shape) return "Same electrons as " + nmB + ", but " + (A.shape > B.shape ? "its longer, straighter shape touches its neighbours along more of its length: stronger dispersion." : "its more compact shape touches its neighbours less: weaker dispersion.");
    return "Same electrons and the same strongest force as " + nmB + ", so the difference comes from " + (sa === "dip" ? "how polar each molecule is." : "the size and shape of the particles.");
  }
  var more = ea > eb, hi = ba > bb, cnt = " (" + ea + " vs " + eb + ")";
  if (hi && more) return "More electrons than " + nB + cnt + ", so stronger dispersion forces" + (RK[sa] > RK[sb] ? ", plus " + FN[sa] : RK[sa] < RK[sb] ? ": they outweigh " + nB + "’s " + FN[sb] : "") + ".";
  if (hi) return "Fewer electrons than " + nB + cnt + ", but " + FN[sa] + " hold it together.";
  if (!more) return "Fewer electrons than " + nB + cnt + ", so weaker dispersion forces" + (RK[sa] < RK[sb] ? ", and no " + FN[sb] : RK[sa] > RK[sb] ? ": its " + FN[sa] + " can’t make up the difference" : "") + ".";
  if (sa === "hb" && sb === "hb") return "More electrons than " + nB + cnt + ", but each " + nB + " molecule forms more hydrogen bonds.";
  return "More electrons than " + nB + cnt + ", but " + nB + "’s " + FN[sb] + " hold it together more strongly.";
}
function rowsOf(id, other, hide){
  var s = SUB[id], sa = st(id), imfs = ["Dispersion"].concat(s.polar ? ["dipole–dipole"] : []).concat(s.hb ? ["hydrogen bonding"] : []);
  return [
    nameF(id) + (s.lab ? "" : '<span class="tiny muted"> ' + s.nm + "</span>"),
    nameF(id) + (s.atoms ? " atoms" : " molecules"),
    E(id) + ' <span class="tiny muted">(' + eSum(s.f) + ")</span>",
    s.atoms ? "No (single atoms)" : s.polar ? (s.weak ? 'Yes, slightly <span class="tiny muted">(PH₃’s dipole is small: the P–H bonds are almost nonpolar, but the lone pair makes the molecule slightly polar)</span>' : "Yes") : "No",
    imfs.join(", "), FS[sa],
    hide ? "?" : degC(bpOf(id)) + ' <span class="tiny muted">(data)</span>',
    hide ? "?" : stateAt25(id),
    hide ? "?" : whyOf(id, other)
  ];
}
var ROWL = ["Substance", "Particles", "Electrons per particle", "Polar?", "IMFs present", "Strongest IMF", "Boiling point", "State at 25 °C", "Why"];
function readTable(ids, hide){
  var cols = ids.map(function(id, i){ return rowsOf(id, ids[1 - i], hide); });
  return '<table class="imf-rt' + (ids.length > 1 ? " two" : "") + '"><caption class="vh">Readout</caption><tbody>' + ROWL.map(function(l, k){
    return "<tr><th scope=\"row\">" + l + "</th>" + cols.map(function(c){ return "<td>" + c[k] + "</td>"; }).join("") + "</tr>";
  }).join("") + "</tbody></table>";
}

// ---------- trend data (plan §4 Trend data) ----------
var TS = {
  g14:{ pts:[["CH4", 2], ["SiH4", 3], ["GeH4", 4], ["SnH4", 5]], y:[-200, 150] },
  g15:{ pts:[["NH3", 2], ["PH3", 3], ["AsH3", 4], ["SbH3", 5]], y:[-200, 150] },
  g16:{ pts:[["H2O", 2], ["H2S", 3], ["H2Se", 4], ["H2Te", 5]], y:[-200, 150] },
  g17:{ pts:[["HF", 2], ["HCl", 3], ["HBr", 4], ["HI", 5]], y:[-200, 150] },
  noble:{ pts:[["He", 1], ["Ne", 2], ["Ar", 3], ["Kr", 4], ["Xe", 5]], y:[-300, 0] },
  hal:{ pts:[["F2", 2], ["Cl2", 3], ["Br2", 4], ["I2", 5]], y:[-200, 200] },
  alk:{ pts:[["CH4", 1], ["C2H6", 2], ["C3H8", 3], ["C4H10", 4], ["C5H12", 5], ["C6H14", 6], ["C7H16", 7], ["C8H18", 8]], y:[-200, 150], x:"Carbons in the chain", all:true }
};
function plainF(f){ return MV.plain(F(f)); }

// ---------- solids (plan §4 Solid data; every value is a course table addition) ----------
// mp in °C (null with hot:true = doesn't melt below 3500 °C); cs/cm/cw: conducts as solid / molten / in water (1, 0, or a note);
// sw/sh: dissolves in water / hexane. MgO: the plan gives 2852 °C (the course table lists ≈ 2850 °C from module 19).
var SOL = {
  NaCl:{ t:"NaCl", type:"ionic", parts:"Na⁺ and Cl⁻ ions", held:"attractions between oppositely charged ions", mp:801, hard:"brittle", cs:0, cm:1, cw:1, sw:"yes", sh:"no", lat:["ion", "Na⁺", "Cl⁻"] },
  MgO:{ t:"MgO", type:"ionic", parts:"Mg²⁺ and O²⁻ ions", held:"attractions between oppositely charged ions", mp:2852, hard:"brittle", cs:0, cm:1, cw:"n/a (insoluble)", sw:"no", sh:"no", lat:["ion", "Mg²⁺", "O²⁻"] },
  ice:{ t:"ice", type:"molecular", parts:"H₂O molecules", held:"hydrogen bonds and dispersion forces", mp:0, t0:-10, hard:"soft", cs:0, cm:0, cw:"n/a (it is water)", sw:"(is water)", sh:"no", lat:["ice"] },
  I2:{ t:"I₂", type:"molecular", parts:"I₂ molecules", held:"dispersion forces", mp:114, hard:"soft", cs:0, cm:0, cw:"n/a (it barely dissolves)", sw:"barely", sh:"yes", lat:["i2"] },
  diamond:{ t:"diamond", type:"network", parts:"C atoms", held:"covalent bonds throughout", mp:null, hot:true, hard:"hardest", cs:0, cm:"n/a", cw:"n/a", sw:"no", sh:"no", lat:["dia"] },
  SiO2:{ t:"SiO₂ (quartz)", type:"network", parts:"Si and O atoms", held:"covalent bonds throughout", mp:1713, hard:"very hard", cs:0, cm:0, cw:"n/a", sw:"no", sh:"no", lat:["sio2"] },
  graphite:{ t:"graphite", type:"network", parts:"C atoms in layers", held:"covalent bonds within layers; weak forces between layers", mp:null, hot:true, hard:"soft, slippery", cs:"yes (along layers)", cm:"n/a", cw:"n/a", sw:"no", sh:"no", lat:["gra"] },
  copper:{ t:"copper", type:"metallic", parts:"Cu⁺ cations in a sea of delocalized electrons", held:"metallic bonding", mp:1085, hard:"malleable", cs:1, cm:1, cw:"n/a", sw:"no", sh:"no", lat:["metal", "Cu⁺"] },
  sodium:{ t:"sodium", type:"metallic", parts:"Na⁺ cations in a sea of delocalized electrons", held:"metallic bonding", mp:98, hard:"soft, malleable", cs:1, cm:1, cw:"reacts", sw:"—", sh:"—", react:true, lat:["metal", "Na⁺"] },
  // mystery solids (TC2): same data as quartz, sodium chloride and iodine, shown as sealed samples
  M1:{ t:"M1", mys:true, mp:1713, hard:"very hard", cs:0, cm:0, cw:"n/a", sw:"no", sh:"no", lat:["mys"] },
  M2:{ t:"M2", mys:true, mp:801, hard:"brittle", cs:0, cm:1, cw:1, sw:"yes", sh:"no", lat:["mys"] },
  M3:{ t:"M3", mys:true, mp:114, hard:"soft", cs:0, cm:0, cw:"n/a (it barely dissolves)", sw:"barely", sh:"yes", lat:["mys"] }
};
var TYPEN = { ionic:"Ionic", molecular:"Molecular", network:"Covalent network", metallic:"Metallic" };
function yesNo(v){ return v === 1 ? "yes" : v === 0 ? "no" : v; }

// ---------- @component latticeView — zoomed solid lattices in SVG (360 × 250): ionic (cations --ec-cat, anions --ec-an),
// molecular (ice honeycomb with violet dotted hydrogen bonds; I₂ herringbone; sucrose blobs; wax chains), covalent networks
// (diamond grid, SiO₂, graphite layers with delocalized electrons), metals (cerulean cations in a violet electron sea) and a
// sealed mystery sample. latModel(kind, a, b) -> model; latSVG(model, state) with state {melt, dis, T, bulb, probe, shift, t, mini}
function latModel(L){
  var k = L[0], it = [], bonds = [], hb = [], dots = [], i, j;
  function add(o){ it.push(o); return it.length - 1; }
  if (k === "ion") {
    for (j = 0; j < 5; j++) for (i = 0; i < 8; i++) { var an = (i + j) % 2 === 0; add({ x:40 + i * 40, y:62 + j * 37, r:an ? 16 : 12, fill:an ? "var(--ec-an)" : "var(--ec-cat)", lab:an ? L[2] : L[1], g:it.length, row:j }); }
  } else if (k === "metal") {
    for (j = 0; j < 4; j++) for (i = 0; i < 7; i++) add({ x:48 + i * 44 + (j % 2) * 10, y:66 + j * 44, r:14, fill:"var(--at-m)", lab:L[1], g:it.length, row:j });
    for (i = 0; i < 44; i++) dots.push({ x:30 + rnd(i * 3 + 1) * 300, y:46 + rnd(i * 7 + 2) * 176, ph:i });
  } else if (k === "dia") {
    for (j = 0; j < 5; j++) for (i = 0; i < 8; i++) add({ x:40 + i * 40, y:62 + j * 37, r:10, fill:"var(--at-c)", lab:"C", g:0, row:j });
    for (j = 0; j < 5; j++) for (i = 0; i < 8; i++) { if (i < 7) bonds.push([j * 8 + i, j * 8 + i + 1]); if (j < 4) bonds.push([j * 8 + i, (j + 1) * 8 + i]); }
  } else if (k === "sio2") {
    var si = [];
    for (j = 0; j < 4; j++) for (i = 0; i < 6; i++) si.push(add({ x:46 + i * 54, y:62 + j * 50, r:12, fill:"var(--ink-2)", lab:"Si", g:0, row:j }));
    for (j = 0; j < 4; j++) for (i = 0; i < 6; i++) {
      var a = si[j * 6 + i];
      if (i < 5) { var o1 = add({ x:73 + i * 54, y:62 + j * 50, r:8, fill:"var(--at-o)", lab:"O", g:0, row:j }); bonds.push([a, o1], [o1, si[j * 6 + i + 1]]); }
      if (j < 3) { var o2 = add({ x:46 + i * 54, y:87 + j * 50, r:8, fill:"var(--at-o)", lab:"O", g:0, row:j }); bonds.push([a, o2], [o2, si[(j + 1) * 6 + i]]); }
    }
  } else if (k === "gra") {
    for (j = 0; j < 3; j++) { for (i = 0; i < 12; i++) { add({ x:28 + i * 27.5, y:74 + j * 62 + (i % 2 ? -7 : 7), r:8.5, fill:"var(--at-c)", lab:"C", g:j, row:j }); if (i) bonds.push([j * 12 + i - 1, j * 12 + i]); }
      for (i = 0; i < 9; i++) dots.push({ x:40 + i * 34, y:74 + j * 62 + (i % 2 ? 13 : -13), ph:j * 9 + i, lay:j }); }
  } else if (k === "ice") {
    var V = [], id = {};
    for (j = 0; j < 4; j++) for (i = 0; i < 8; i++) { id[i + "," + j] = add({ x:40 + i * 40, y:66 + j * 50 + ((i + j) % 2 ? -9 : 9), r:9.5, fill:"var(--at-o)", lab:"O", g:j * 10 + i, row:j }); V.push([i, j]); }
    function hOn(o, tgt){ var A = it[o], B = it[tgt], h = add({ x:A.x + (B.x - A.x) * 0.3, y:A.y + (B.y - A.y) * 0.3, r:5.5, el:"H", g:A.g, row:A.row }); bonds.push([o, h]); hb.push([h, tgt]); }
    V.forEach(function(v){
      var i0 = v[0], j0 = v[1], o = id[i0 + "," + j0], even = (i0 + j0) % 2 === 0;
      if (even) { if (id[(i0 + 1) + "," + j0] != null) hOn(o, id[(i0 + 1) + "," + j0]); if (id[(i0 - 1) + "," + j0] != null) hOn(o, id[(i0 - 1) + "," + j0]); }
      else if (id[i0 + "," + (j0 - 1)] != null) hOn(o, id[i0 + "," + (j0 - 1)]);
      else { var A = it[o], h2 = add({ x:A.x, y:A.y - 13, r:5.5, el:"H", g:A.g, row:A.row }); bonds.push([o, h2]); }
      if (!even) { var A2 = it[o], h3 = add({ x:A2.x, y:A2.y + 13, r:5.5, el:"H", g:A2.g, row:A2.row }); bonds.push([o, h3]); }
    });
  } else if (k === "i2") {
    for (j = 0; j < 4; j++) for (i = 0; i < 5; i++) { var th = (i + j) % 2 ? 0.6 : -0.6, cx = 52 + i * 64, cy = 66 + j * 46, gg = j * 5 + i, p = add({ x:cx - 13 * Math.cos(th), y:cy - 13 * Math.sin(th), r:11, el:"I", g:gg, row:j }), q = add({ x:cx + 13 * Math.cos(th), y:cy + 13 * Math.sin(th), r:11, el:"I", g:gg, row:j }); bonds.push([p, q]); }
  } else if (k === "sugar") {
    for (j = 0; j < 3; j++) for (i = 0; i < 4; i++) add({ x:62 + i * 78 + (j % 2) * 18, y:72 + j * 58, blob:true, g:j * 4 + i, row:j });
    for (j = 0; j < 3; j++) for (i = 0; i < 4; i++) { if (i < 3) hb.push([j * 4 + i, j * 4 + i + 1]); if (j < 2) hb.push([j * 4 + i, (j + 1) * 4 + i]); }
  } else if (k === "wax") {
    for (j = 0; j < 5; j++) for (i = 0; i < 11; i++) { add({ x:34 + i * 29, y:58 + j * 38 + (i % 2 ? -6 : 6), r:7.5, fill:"var(--at-c)", lab:"C", g:j, row:j }); if (i) bonds.push([j * 11 + i - 1, j * 11 + i]); }
  }
  return { k:k, it:it, bonds:bonds, hb:hb, dots:dots };
}
function latPos(M, s){
  var melt = s.melt || 0, dis = s.dis || 0, t = s.t || 0, sh = s.shift || 0, net = M.k === "sio2";
  return M.it.map(function(p){
    var g = p.g, amp = MV.reduceMotion ? 0 : (0.6 + 2.6 * melt), jx = amp * Math.sin(t * 2.1 + g * 1.7), jy = amp * Math.cos(t * 1.7 + g * 2.3);
    var mx = (rnd(g * 5 + 1) - 0.5) * (net ? 14 : M.k === "ion" ? 34 : 30), my = (rnd(g * 5 + 2) - 0.5) * (net ? 12 : 26);
    var dx = (p.x - 180) * 0.12 * dis + (rnd(g * 7 + 3) - 0.5) * 34 * dis, dy = (p.y - 140) * 0.1 * dis + (rnd(g * 7 + 4) - 0.5) * 26 * dis;
    return { x:clamp(p.x + mx * melt + dx + jx + (p.row === 0 ? sh : 0), 18, 342), y:clamp(p.y + my * melt + dy + jy, 52, 226) };
  });
}
function latSVG(M, s){
  s = s || {}; var out = "", P = latPos(M, s), melt = s.melt || 0, t = s.t || 0;
  if (s.dis) out += '<rect x="6" y="40" width="348" height="196" rx="10" fill="var(--info-bg)"' + opA(Math.min(1, s.dis * 2)) + "/>";
  if (M.k === "mys") {
    var dis = s.dis && s.sol ? s.dis : 0;
    if (melt < 0.5) out += '<rect x="' + r1(118 - 20 * melt) + '" y="' + r1(96 + 60 * melt) + '" width="' + r1(124 + 40 * melt) + '" height="' + r1(96 - 70 * melt) + '" rx="' + r1(8 + 20 * melt) + '" fill="var(--rule)" stroke="var(--ink-2)" stroke-width="2"' + opA(1 - dis) + "/>";
    else out += '<ellipse cx="180" cy="186" rx="' + r1(70 + 30 * melt) + '" ry="' + r1(22 - 6 * melt) + '" fill="var(--rule)" stroke="var(--ink-2)" stroke-width="2"' + opA(1 - dis) + "/>";
    out += tx(180, melt < 0.5 ? 146 : 186, "?", { fs:34, w:700, c:"var(--ink)", op:1 - dis });
    if (dis > 0.5) out += tx(180, 140, "dissolved", { fs:16, c:"var(--ink-2)" });
  } else {
    // electron sea / delocalized electrons
    M.dots.forEach(function(d){ var dx = MV.reduceMotion ? 0 : 6 * Math.sin(t * 1.3 + d.ph * 2.1), dy = MV.reduceMotion ? 0 : 5 * Math.cos(t * 1.1 + d.ph * 1.3); if (d.lay != null) { dx = MV.reduceMotion ? 0 : ((t * 22 + d.ph * 37) % 300) - d.x + 40 + 0 * dy; dy = 0; } out += circ(d.x + dx, d.y + dy, 3, "var(--e-pair)"); });
    if (M.k === "gra" && !s.mini) [0, 1].forEach(function(j){ out += ln(20, 105 + j * 62, 340, 105 + j * 62, { w:1, c:"var(--ink-2)", d:"3 5", op:0.7 }); });
    M.bonds.forEach(function(b, q){ if (M.k === "sio2" && melt > 0 && rnd(q * 3 + 1) < 0.45 * melt) return; var a = P[b[0]], c = P[b[1]]; out += ln(a.x, a.y, c.x, c.y, { w:M.k === "dia" || M.k === "sio2" ? 3 : 2.2, c:"var(--ink-2)" }); });
    var hbOp = M.k === "ice" ? 1 - 0.55 * melt : 1;
    M.hb.forEach(function(h){ var a = P[h[0]], c = P[h[1]]; if (Math.hypot(a.x - c.x, a.y - c.y) > (M.k === "sugar" ? 95 : 36)) return; out += ln(a.x, a.y, c.x, c.y, { w:2.6, c:"var(--e-pair)", d:"0.5 4.5", op:hbOp }); });
    M.it.forEach(function(p, q){
      var x = P[q].x, y = P[q].y;
      if (p.blob) out += '<ellipse cx="' + r1(x) + '" cy="' + r1(y) + '" rx="26" ry="15" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.6"/>' + tx(x, y, "C₁₂H₂₂O₁₁", { fs:9.5, w:700 });
      else if (p.el) out += ball(p.el, x, y, p.r);
      else out += circ(x, y, p.r, p.fill) + tx(x, y + 0.5, p.lab, { fs:p.lab.length > 2 ? 8.5 : p.lab.length > 1 ? 9.5 : 10.5, w:700, c:"var(--sheet)" });
    });
  }
  if (!s.mini) {
    var Tv = s.T == null ? (s.T0 == null ? 25 : s.T0) : s.T;
    out += '<rect x="6" y="6" width="124" height="28" rx="6" fill="var(--sheet)" stroke="var(--rule)" stroke-width="1.2"/>' + tx(14, 20, "T = " + (Tv > 3499 ? "3500+" : MV.chem.fx(Math.round(Tv), 0)) + " °C", { fs:14, w:700, a:"start" });
    if (s.probe) out += ln(130, 46, 130, 200, { w:3.5, c:"var(--ink)" }) + ln(230, 46, 230, 200, { w:3.5, c:"var(--ink)" }) + '<path d="M130 46 V40 H309 V30 M230 46 V52 H322 V37" fill="none" stroke="var(--ink)" stroke-width="1.6"/>';
    if (s.bulb != null) {
      var on = !!s.bulb;
      if (on) for (var k = 0; k < 8; k++) { var an = k * Math.PI / 4; out += ln(322 + 17 * Math.cos(an), 24 + 17 * Math.sin(an), 322 + 24 * Math.cos(an), 24 + 24 * Math.sin(an), { w:2.4, c:"var(--hi-ink)" }); }
      out += circ(322, 24, 13, on ? "var(--hi)" : "var(--sheet)", { s:"var(--ink)", sw:2 }) + '<path d="M316 26 q3 -8 6 0 q3 8 6 0" fill="none" stroke="var(--ink)" stroke-width="1.6"/>' + tx(300, 24, on ? "bulb lit" : "bulb dark", { fs:12.5, w:700, a:"end", halo:true });
    }
  }
  return out;
}

// ---------- hero: boiling water — hydrogen bonds stretch and snap, every molecule stays whole ----------
function waterSVG(x, y, th, op, o){
  o = o || {}; var d = 17, a1 = th + 0.912, a2 = th - 0.912, h1 = { x:x + d * Math.cos(a1), y:y + d * Math.sin(a1) }, h2 = { x:x + d * Math.cos(a2), y:y + d * Math.sin(a2) };
  return '<g' + opA(op) + ">" + ln(x, y, h1.x, h1.y, { w:2.6, c:"var(--ink)" }) + ln(x, y, h2.x, h2.y, { w:2.6, c:"var(--ink)" }) + ball("O", x, y, 11) + ball("H", h1.x, h1.y, 7) + ball("H", h2.x, h2.y, 7) + "</g>";
}
function hero(){
  var svg = $("#imf-hx-svg"), cap = $("#imf-hx-cap"), rep = $("#imf-hx-replay"); if (!svg) return;
  var C0 = { x:160, y:218 };
  var MOL = [[118, 192, 1], [172, 176, 2], [216, 204, 3], [192, 250, 4], [138, 248, 0], [86, 230, 4], [240, 252, 2]];
  function th(i){ var m = MOL[i], tg = MOL[m[2]]; return Math.atan2(tg[1] - m[1], tg[0] - m[0]) - 0.912; }
  var STAY = { 3:1, 4:1 }, STEAM = { 0:[96, 72], 1:[160, 46], 2:[226, 74], 5:[56, 108], 6:[262, 110] };
  function h1(i, x, y, t){ return { x:x + 17 * Math.cos(t + 0.912), y:y + 17 * Math.sin(t + 0.912) }; }
  function draw(s){
    var o = "";
    // beaker and liquid
    o += '<path d="M40 150 H280" stroke="var(--pen)" stroke-width="1.6" stroke-dasharray="6 5" opacity=".6"/>';
    o += '<rect x="42" y="152" width="236" height="130" fill="var(--info-bg)"/><path d="M36 130 V282 Q36 288 42 288 H278 Q284 288 284 282 V130" fill="none" stroke="var(--ink-2)" stroke-width="3" stroke-linejoin="round"/>';
    if (s.flame > 0) { var fy = 318; o += '<g' + opA(s.flame) + '><path d="M146 ' + (fy + 6) + " q-14 -10 -4 -24 q2 10 9 8 q-4 -12 7 -18 q-2 14 8 18 q8 -6 4 -14 q14 14 0 30 z\" fill=\"var(--en-dh)\"/></g>"; }
    var P = MOL.map(function(m, i){ var spread = 1 + 0.22 * s.spread, x = C0.x + (m[0] - C0.x) * spread, y = C0.y + (m[1] - C0.y) * spread, t = th(i), up = STEAM[i] && s.rise > 0 ? s.rise : 0;
      if (up) { var tg = STEAM[i]; x += (tg[0] - x) * up; y += (tg[1] - y) * up; t += up * (i % 2 ? 1.2 : -1.2); }
      return { x:x, y:y, t:t }; });
    MOL.forEach(function(m, i){
      var k = s.snap[i]; if (k >= 1) return;
      var a = P[i], h = h1(i, a.x, a.y, a.t), b = P[m[2]];
      o += ln(h.x, h.y, b.x, b.y, { w:3, c:"var(--e-pair)", d:"0.5 5", op:1 - k });
    });
    P.forEach(function(p, i){ o += waterSVG(p.x, p.y, p.t, 1); });
    if (s.lab > 0) {
      var a = P[3], h = h1(3, a.x, a.y, a.t), b = P[4], mx = (h.x + b.x) / 2, my = (h.y + b.y) / 2;
      o += ln(mx, my + 3, 292, 262, { w:1.2, c:"var(--ink)", op:s.lab }) + tx(296, 256, "hydrogen bond", { fs:12.5, w:700, a:"start", c:"var(--e-pair)", op:s.lab }) + tx(296, 271, "(between molecules)", { fs:11.5, a:"start", c:"var(--e-pair)", op:s.lab });
      var oh = { x:(a.x + h.x) / 2, y:(a.y + h.y) / 2 };
      o += ln(oh.x + 3, oh.y - 2, 292, 206, { w:1.2, c:"var(--ink)", op:s.lab }) + tx(296, 200, "O–H bond", { fs:12.5, w:700, a:"start", op:s.lab }) + tx(296, 215, "(inside a molecule)", { fs:11.5, a:"start", op:s.lab });
    }
    if (s.rise > 0.6) o += tx(160, 18, "steam: whole H₂O molecules", { fs:13, w:700, c:"var(--ink-2)", op:(s.rise - 0.6) / 0.4, halo:true });
    svg.innerHTML = o;
  }
  var base = function(){ return { flame:0, spread:0, snap:[0, 0, 0, 0, 0, 0, 0], rise:0, lab:1 }; };
  function final(){ var s = base(); s.flame = 1; s.spread = 1; s.snap = [1, 1, 1, 0, 1, 1, 1]; s.rise = 1; draw(s); cap.textContent = "Every H₂O is still H₂O."; rep.hidden = false; }
  var run = 0;
  function play(){
    var id = ++run, s = base(); rep.hidden = true; draw(s);
    cap.textContent = "Liquid water: dotted violet hydrogen bonds join neighbouring H₂O molecules.";
    var order = [0, 5, 1, 6, 2, 4];
    MV.wait(1600, function(){ if (id !== run) return;
      cap.textContent = "Heat: the hydrogen bonds stretch and snap, one by one.";
      MV.tween({ dur:600, step:function(u){ if (id !== run) return; s.flame = u; s.lab = 1 - u; draw(s); }, done:function(){
        MV.tween({ dur:2600, ease:function(x){ return x; }, step:function(u){ if (id !== run) return; s.spread = u; order.forEach(function(i, k){ s.snap[i] = clamp(u * 7 - k - 0.6, 0, 1); }); draw(s); }, done:function(){
          if (id !== run) return; cap.textContent = "Single molecules drift upward as steam.";
          MV.tween({ dur:2200, step:function(u){ if (id !== run) return; s.rise = u; draw(s); }, done:function(){
            if (id !== run) return; MV.tween({ dur:500, step:function(u){ s.lab = u; draw(s); }, done:function(){ if (id === run) { cap.textContent = "Every H₂O is still H₂O."; rep.hidden = false; } } });
          } });
        } });
      } });
    });
  }
  rep.addEventListener("click", function(){ if (MV.reduceMotion) final(); else play(); });
  if (MV.reduceMotion) final(); else play();
}

// ---------- animation loop (flicker, electron sea, jiggle) while Explore is on screen ----------
var LOOP = { fns:[], on:false, vis:false, raf:0, last:0 };
function loopTick(ts){
  if (!LOOP.on) return;
  if (ts - LOOP.last > 70) { LOOP.last = ts; if (LOOP.vis) LOOP.fns.forEach(function(f){ try { f(ts / 1000); } catch (e) {} }); }
  LOOP.raf = requestAnimationFrame(loopTick);
}
function loopStart(){ if (LOOP.on || MV.reduceMotion) return; LOOP.on = true; LOOP.raf = requestAnimationFrame(loopTick); }

// ---------- Explore: Force strength lab ----------
function explore(host, api){
  var S = api.S, C = api.content, M = C.msgs;
  var IDS = []; C.rows.forEach(function(r){ IDS = IDS.concat(r.ids); });
  if (!Array.isArray(S.sel) || !S.sel.length || S.sel.some(function(id){ return !SUB[id]; })) S.sel = ["CH3OH", "C2H6"];
  if (["between", "trend", "solid"].indexOf(S.mode) < 0) S.mode = "between";
  if (!TS[S.set]) S.set = "g16";
  if (C.solids.indexOf(S.solid) < 0 && !SOL[S.solid]) S.solid = "NaCl";
  S.trend = S.trend !== false; S.bins = S.bins || {}; S.res = S.res || {};
  var V = { busy:false, hideBP:false, hbK:1, dK:1, hideP:false, revealK:1, solid:{ melt:0, dis:0, T:null, bulb:null, probe:false, shift:0, sol:false }, cap:"" };
  host.innerHTML = '<p class="how">' + C.how + '</p><div class="imf-modes"></div><p class="banner imf-banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="imf-panes" data-mv="graph">' +
      '<div class="imf-pane" data-pane="between"><div class="imf-rows"></div><div class="imf-grid"><div class="imf-left"><div class="imf-boxes"></div>' +
        '<p class="tiny muted imf-leg"><span class="imf-k imf-kd" aria-hidden="true"></span> faint grey: dispersion (temporary dipoles) · <span class="imf-k imf-kp" aria-hidden="true"></span> grey dashed: dipole–dipole · <span class="imf-k imf-kh" aria-hidden="true"></span> violet dotted: hydrogen bond. Thicker lines are stronger forces. H atoms bonded to carbon are left out; the shaded outline is each particle’s surface.</p>' +
        '<div class="imf-gap"></div></div><div class="imf-right"><div class="imf-bars"></div><div class="imf-read" aria-live="polite"></div></div></div></div>' +
      '<div class="imf-pane" data-pane="trend" hidden><div class="imf-sets"></div><label class="imf-tog"><input type="checkbox" class="imf-trin"> ' + C.trendLabel + '</label><div class="imf-grid"><div class="imf-left"><div class="plot-wrap"><canvas class="plot" id="imf-tplot" role="img" aria-label="Trend graph"></canvas></div><p class="imf-tcap" aria-live="polite"></p><div class="imf-why16"></div></div><div class="imf-right"><div class="imf-tread"></div></div></div></div>' +
      '<div class="imf-pane" data-pane="solid" hidden><div class="imf-srow"></div><div class="imf-mrow"></div><div class="imf-acts" role="group" aria-label="Tests"></div><div class="imf-grid"><div class="imf-left"><div class="imf-lbox"><svg class="imf-lsvg" viewBox="0 0 360 250" role="img" aria-label=""></svg></div><p class="imf-lcap" aria-live="polite"></p></div><div class="imf-right"><div class="imf-sread" aria-live="polite"></div></div></div><div class="imf-bins"></div></div>' +
    '</div><div class="imf-tabs"></div>';
  function q(s){ return $(s, host); }
  // data panels: this module's physical data (C13 "Physical data" tab, local) and the course electronegativity table
  (function(){
    var rows = IDS.map(function(id){ return [nameF(id) + (SUB[id].lab ? "" : " (" + SUB[id].nm + ")"), String(E(id)), FS[st(id)], MV.chem.fx(bpOf(id), 0)]; });
    ["He", "Kr", "Xe", "GeH4", "SnH4", "AsH3", "SbH3", "H2Se", "H2Te", "HBr", "HI"].forEach(function(f){ rows.push([F(f), String(electrons(f)), "", MV.chem.fx(BPX[f], 0)]); });
    ["C4H10", "C6H14", "C7H16", "C8H18"].forEach(function(f){ rows.push([F(f) + " (" + ALK[f] + ")", String(electrons(f)), "Dispersion", MV.chem.fx(bpOf(f), 0)]); });
    var srows = C.solids.map(function(id){ var d = SOL[id]; return [d.t, TYPEN[d.type], d.hot ? "&gt; 3500" : MV.chem.fx(d.mp, 0), d.hard, yesNo(d.cs), yesNo(d.cm), yesNo(d.cw), d.sw, d.sh]; });
    var el = document.createElement("details"); el.className = "chem-tab";
    el.innerHTML = "<summary>Course data table: physical data (boiling and melting points)</summary>" + MV.tableHTML({ head:["Substance", "Electrons", "Strongest IMF", "Boiling point (°C)"], rows:rows, caption:"Boiling points" }) +
      MV.tableHTML({ head:["Solid", "Type", "Melting point (°C)", "Hardness", "Conducts (solid)", "Conducts (molten)", "Conducts (in water)", "Dissolves in water", "Dissolves in hexane"], rows:srows, caption:"Solid data" }) +
      '<p class="tiny muted" style="margin:8px 0 0">Course table additions from this module. Alkane boiling points are from the course table.</p>';
    q(".imf-tabs").appendChild(el);
    MV.chem.tablePanel(q(".imf-tabs"), "en");
  })();

  var modeRG = radios(q(".imf-modes"), { label:"Mode", aria:"Lab mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; api.save(); MV.banner("", ""); paint(); MV.changed(); } });
  // substance chips (toggle buttons; one or two selected)
  function paintRows(){
    q(".imf-rows").innerHTML = C.rows.map(function(r){ return '<div class="imf-crow"><span class="imf-clab">' + r.lab + '</span><span class="imf-chips" role="group" aria-label="' + esc(MV.plain(r.lab)) + '">' + r.ids.map(function(id){ var on = S.sel.indexOf(id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-sub="' + id + '" data-k="sub' + id + '"' + (V.busy ? " disabled" : "") + ">" + chipLab(id) + "</button>"; }).join("") + "</span></div>"; }).join("");
  }
  q(".imf-rows").addEventListener("click", function(e){
    var b = e.target.closest("[data-sub]"); if (!b || b.disabled || V.busy) return;
    var id = b.dataset.sub, i = S.sel.indexOf(id);
    if (i >= 0) { if (S.sel.length > 1) S.sel.splice(i, 1); }
    else { S.sel.push(id); if (S.sel.length > 2) S.sel.shift(); }
    api.save(); MV.keepFocus(q(".imf-rows"), paintRows); paintBetween(); MV.changed();
  });
  var gapRG = radios(q(".imf-gap"), { label:"Force that explains the gap (challenge 1):", aria:"Force that explains the gap", cls:"chips", options:C.gapChips, value:S.gap || "", onChange:function(v){ S.gap = v; api.save(); MV.changed(); } });
  function paintBetween(){
    var ids = S.sel.slice(0, 2), two = ids.length > 1, W = two ? 300 : 480, H = two ? 250 : 290, G = ids.map(function(id){ return bestGrid(id, W, H, two); });
    var U = Math.min.apply(null, G.map(function(x){ return x.u; }));
    q(".imf-boxes").className = "imf-boxes" + (two ? " two" : "");
    q(".imf-boxes").innerHTML = ids.map(function(id, k){
      var sc = boxScene(id, W, H, G[k].c, G[k].r, U), o = { hb:V.hbK, disp:V.dK };
      return '<figure class="imf-box"><figcaption><strong>' + nameF(id) + "</strong>" + (SUB[id].lab ? "" : " " + SUB[id].nm) + '</figcaption><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(boxAria(sc, o)) + '">' + boxSVG(sc, o) + "</svg></figure>";
    }).join("");
    paintBars();
    q(".imf-read").innerHTML = readTable(ids, V.hideBP);
  }
  function paintBars(vals){ var ids = S.sel.slice(0, 2); q(".imf-bars").innerHTML = bpSVG(ids, vals, V.hideBP && !vals); }
  LOOP.fns.push(function(t){
    if (S.mode !== "between" || V.busy) return;
    $$(".imf-fl", host).forEach(function(el){ var ph = +el.getAttribute("data-ph"); el.setAttribute("opacity", r1((0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.3 + ph * 1.7))) * V.dK * 100) / 100); });
    $$(".imf-tf", host).forEach(function(el){ var ph = +el.getAttribute("data-ph"); el.setAttribute("opacity", r1(Math.max(0, Math.sin(t * 1.6 + ph * 2.4)) * 100) / 100); });
  });

  // ----- trend graphs (K21 plot with a draggable prediction dot) -----
  var setRG = radios(q(".imf-sets"), { label:"Data set", aria:"Data set", cls:"chips", options:C.sets, value:S.set, onChange:function(v){ S.set = v; api.save(); paintTrend(); MV.changed(); } });
  var trin = q(".imf-trin"); trin.checked = S.trend;
  trin.addEventListener("change", function(){ S.trend = trin.checked; api.save(); plot.render(); });
  var whyRG = radios(q(".imf-why16"), { label:"Reason for the real gap (challenge 3):", aria:"Reason for water’s real gap", cls:"chips", options:C.whyChips, value:S.why16 || "", onChange:function(v){ S.why16 = v; api.save(); MV.changed(); } });
  var plot = new MV.Plot(q("#imf-tplot"), { xmin:0, xmax:6, ymin:-200, ymax:150 });
  function tview(){
    var T = TS[S.set], xs = T.pts.map(function(p){ return p[1]; }), xl = Math.min.apply(null, xs) - 0.45, xh = Math.max.apply(null, xs) + 0.45;
    if (S.set === "g16") xl = Math.min(xl, 1.55);
    var W = plot.c.getBoundingClientRect().width || 600, Hh = plot.c.getBoundingClientRect().height || 450, Lp = 48, Rp = 12, Bp = 34, Tp = 14;
    var tw = (xh - xl) / (1 - (Lp + Rp) / W), th = (T.y[1] - T.y[0]) / (1 - (Bp + Tp) / Hh);
    return { xmin:xl - Lp / W * tw, xmax:xh + Rp / W * tw, ymin:T.y[0] - Bp / Hh * th, ymax:T.y[1] + Tp / Hh * th, xl:xl, xh:xh };
  }
  function dotVal(){ return S.dot16 == null ? 0 : S.dot16; }
  function drawTrend(){
    var T = TS[S.set], v = tview(), ink = MV.css("--ink"), pen = MV.css("--pen"), ink2 = MV.css("--ink-2"), pts = T.pts.map(function(p){ return { f:p[0], x:p[1], y:bpOf(p[0]) }; });
    var shown = V.hideP ? Math.floor(V.revealK * pts.length + 1e-6) : pts.length;
    var sc = { view:v, xTicks:{ step:1 }, yTicks:{ step:50 }, axes:false, ticks:false, segments:[], points:[] };
    if (S.trend && !V.hideP) { var tp = pts.filter(function(p){ return T.all || p.x >= 3; }); for (var i = 1; i < tp.length; i++) sc.segments.push({ x1:tp[i - 1].x, y1:tp[i - 1].y, x2:tp[i].x, y2:tp[i].y, color:ink2, width:2, dash:[7, 5] }); }
    var dot = S.set === "g16" && !V.hideP;
    sc.after = function(ctx, pl){
      var bg = MV.css("--sheet"), font = MV.css("--font-ui") || "sans-serif", X0 = pl.X(v.xl), Yb = pl.Y(T.y[0]);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, X0 - 1, pl.H); ctx.fillRect(0, Yb + 1, pl.W, pl.H - Yb);
      ctx.strokeStyle = MV.css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X0, pl.Y(T.y[1])); ctx.lineTo(X0, Yb); ctx.lineTo(pl.X(v.xh), Yb); ctx.stroke();
      ctx.fillStyle = ink2; ctx.font = "12px " + font; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var y = T.y[0]; y <= T.y[1]; y += 50) ctx.fillText(MV.chem.fx(y, 0), X0 - 5, pl.Y(y));
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var x = Math.ceil(v.xl); x <= v.xh; x++) ctx.fillText(String(x), pl.X(x), Yb + 4);
      ctx.font = "600 12px " + font; ctx.textAlign = "right"; ctx.fillText(T.x || "Period", pl.X(v.xh), Yb + 18);
      ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("Boiling point (°C)", X0 + 6, 2);
      // zero line
      if (T.y[1] > 0) { ctx.strokeStyle = ink2; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X0, pl.Y(0)); ctx.lineTo(pl.X(v.xh), pl.Y(0)); ctx.stroke(); ctx.setLineDash([]); }
      pts.forEach(function(p, k){
        if (k >= shown) return;
        var a = V.hideP && k === shown - 1 ? clamp(V.revealK * pts.length - k, 0, 1) : 1;
        ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(pl.X(p.x), pl.Y(p.y), 6, 0, Math.PI * 2); ctx.fillStyle = pen; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = bg; ctx.stroke();
        var nx = pts[k + 1], below = !!(nx && nx.y > p.y && S.trend), lab = plainF(p.f) + "  " + MV.chem.fx(p.y, 0) + " °C", right = pl.X(p.x) > pl.W - 110;
        ctx.font = "700 13px " + font; ctx.textBaseline = below ? "top" : "bottom"; ctx.textAlign = right ? "right" : "left";
        var two = pl.W < 560; if (two) { below = k % 2 === 1; ctx.textBaseline = below ? "top" : "bottom"; }
        var lx = pl.X(p.x) + (right ? -9 : 9), ly = pl.Y(p.y) + (below ? 6 : -6), rows = two ? [plainF(p.f), MV.chem.fx(p.y, 0) + " °C"] : [lab];
        if (two) { ctx.font = "700 12px " + font; if (!below) rows.reverse(); }
        ctx.lineWidth = 3.5; ctx.strokeStyle = bg; ctx.lineJoin = "round"; ctx.fillStyle = ink;
        rows.forEach(function(tl, ri){ var yy = ly + (below ? ri * 14 : -ri * 14); ctx.strokeText(tl, lx, yy); ctx.fillText(tl, lx, yy); });
        ctx.globalAlpha = 1;
      });
      if (dot) {
        var dy = dotVal(); ctx.beginPath(); ctx.arc(pl.X(2), pl.Y(dy), 13, 0, Math.PI * 2); ctx.fillStyle = MV.css("--hi"); ctx.fill();
        ctx.beginPath(); ctx.arc(pl.X(2), pl.Y(dy), 7, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = ink; ctx.stroke();
        ctx.font = "700 12.5px " + font; ctx.fillStyle = ink; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText("prediction: " + MV.chem.fx(dy, 0) + " °C", pl.X(2) + 17, pl.Y(dy) + (Math.abs(dy - 100) < 30 ? 18 : 0));
      }
    };
    var d = (TS[S.set] === TS.alk ? "Boiling point against the number of carbons for straight-chain alkanes: " : "Boiling point against period for " + MV.plain(C.sets.filter(function(x){ return x.id === S.set; })[0].t).toLowerCase() + ": ") +
      (V.hideP ? (shown ? pts.slice(0, shown).map(function(p){ return plainF(p.f) + " " + MV.chem.fx(p.y, 0) + " °C"; }).join(", ") : "points hidden until the reveal") : pts.map(function(p){ return plainF(p.f) + " " + MV.chem.fx(p.y, 0) + " °C"; }).join(", ")) + "." +
      (S.trend && !V.hideP ? (T.all ? " Dashed trend line through all the points." : " Dashed trend line through periods 3 to 5.") : "") + (dot ? " Prediction dot at period 2: " + MV.chem.fx(dotVal(), 0) + " °C." : "");
    sc.describe = d;
    plot.draw(sc);
  }
  plot.render = drawTrend;
  MV.drag(plot, { axis:"y", step:{ x:0, y:5 }, big:4,
    handles:function(){ return S.mode === "trend" && S.set === "g16" && !V.hideP && !V.busy ? [{ id:"dot", x:2, y:dotVal(), label:"Prediction dot for H₂O without hydrogen bonds: " + MV.chem.fx(dotVal(), 0) + " °C. Use the up and down arrow keys; Shift moves 20 °C." }] : []; },
    snap:function(x, y){ return [2, clamp(Math.round(y / 5) * 5, -200, 150)]; },
    move:function(id, x, y){ if (y === S.dot16) return; S.dot16 = y; api.save(); drawTrend(); paintTread(); MV.changed(); } });
  function paintTread(){
    var T = TS[S.set];
    q(".imf-tread").innerHTML = MV.tableHTML({ head:[T.x ? "Alkane" : "Substance", T.x ? "Carbons" : "Period", "Electrons", "Boiling point"], rows:T.pts.map(function(p){ return [F(p[0]), String(p[1]), String(electrons(p[0])), V.hideP ? "?" : degC(bpOf(p[0]))]; }), caption:"Trend data" }) +
      (S.set === "g16" ? '<p class="imf-dotr">Your prediction for H₂O without hydrogen bonds: <strong>' + MV.chem.fx(dotVal(), 0) + " °C</strong></p>" : "");
    q(".imf-tcap").innerHTML = S.set === "g16" ? "Drag the ringed prediction dot at period 2 (or focus it and use ↑ ↓; Shift moves 20 °C)." : "";
    q(".imf-why16").hidden = S.set !== "g16";
  }
  function paintTrend(){ if (S.set === "g16" && S.dot16 == null) { S.dot16 = 0; api.save(); } drawTrend(); paintTread(); }

  // ----- solid lattice mode -----
  var solRG = radios(q(".imf-srow"), { label:"Solid", aria:"Solid", cls:"chips", options:C.solids.map(function(id){ return { id:id, t:SOL[id].t }; }), value:SOL[S.solid] && !SOL[S.solid].mys ? S.solid : "", onChange:function(v){ pickSolid(v); } });
  var mysRG = radios(q(".imf-mrow"), { label:"Mystery solids (challenge 2)", aria:"Mystery solids", cls:"chips", options:C.mystery.map(function(m){ return { id:m.id, t:m.id }; }), value:SOL[S.solid] && SOL[S.solid].mys ? S.solid : "", onChange:function(v){ pickSolid(v); } });
  var ACTS = [{ id:"heat", t:"Heat" }, { id:"scratch", t:"Scratch" }, { id:"cs", t:"Conductivity: solid" }, { id:"cm", t:"Conductivity: molten" }, { id:"cw", t:"Conductivity: dissolved" }];
  function paintActs(){ q(".imf-acts").innerHTML = ACTS.map(function(a){ return '<button type="button" class="btn ghost sm" data-act2="' + a.id + '" data-k="act' + a.id + '"' + (V.busy ? " disabled" : "") + ">" + a.t + "</button>"; }).join(""); }
  function pickSolid(v){ if (V.busy) return; S.solid = v; api.save(); V.solid = { melt:0, dis:0, T:null, bulb:null, probe:false, shift:0, sol:false }; V.cap = ""; solRG.set(SOL[v].mys ? "" : v); mysRG.set(SOL[v].mys ? v : ""); paintSolid(); }
  var lsvg = q(".imf-lsvg"), LM = {};
  function model(){ var d = SOL[S.solid], k = d.lat.join("|"); return LM[k] || (LM[k] = latModel(d.lat)); }
  function drawLat(t){ var s = V.solid; s.t = t || s.t || 0; s.T0 = SOL[S.solid].t0; lsvg.innerHTML = latSVG(model(), s); }
  function solAria(){
    var d = SOL[S.solid], s = V.solid, ph = s.dis > 0.5 ? (d.sw === "yes" ? "dissolved in water" : "in water") : s.melt > 0.5 ? "molten" : "solid";
    return (d.mys ? "Sealed mystery sample " + d.t : "Zoomed lattice of " + MV.plain(d.t) + ": " + MV.plain(d.parts) + ", held by " + d.held) + ". State: " + ph + ". Temperature " + (s.T == null ? 25 : Math.round(s.T)) + " °C." + (s.bulb == null ? "" : s.bulb ? " The bulb is lit." : " The bulb is dark.");
  }
  function paintSolid(){
    drawLat(); lsvg.setAttribute("aria-label", solAria());
    q(".imf-lcap").innerHTML = V.cap || (SOL[S.solid].mys ? "A sealed sample: run the tests to find out what it is." : "Run a test: heat it, scratch it, or test its conductivity.");
    var d = SOL[S.solid], r = S.res[S.solid] || {}, dash = '<span class="muted">not tested yet</span>';
    var rows = d.mys ? [["Sample", "mystery solid " + d.t]] : [["Type", TYPEN[d.type]], ["Particles", d.parts], ["Held together by", d.held]];
    rows = rows.concat([["Melting point", r.mp ? (d.hot ? "doesn’t melt below 3500 °C" : degC(d.mp)) : dash], ["Hardness", r.scratch ? d.hard : dash], ["Conducts as a solid", r.cs ? yesNo(d.cs) : dash],
      ["Conducts when molten", r.cm ? (d.hot ? "n/a (doesn’t melt)" : yesNo(d.cm)) : dash], ["Conducts in water", r.cw ? yesNo(d.cw) : dash], ["Dissolves in water", r.cw ? d.sw : dash], ["Dissolves in hexane", r.cw ? d.sh : dash]]);
    q(".imf-sread").innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
    paintBins();
  }
  function paintBins(){
    var h = '<p class="imf-binh"><strong>Bins for challenge 2.</strong> Place each mystery solid:</p>' + C.mystery.map(function(m){ return '<div class="imf-bin" data-bin="' + m.id + '"></div>'; }).join("");
    if (!q(".imf-bins").dataset.ok) { q(".imf-bins").innerHTML = h; q(".imf-bins").dataset.ok = "1";
      C.mystery.forEach(function(m){ radios($('[data-bin="' + m.id + '"]', host), { label:m.id + ":", aria:"Bin for " + m.id, cls:"chips", options:C.classes, value:S.bins[m.id] || "", onChange:function(v){ S.bins[m.id] = v; api.save(); MV.changed(); } }); }); }
  }
  function mark(keys){ var r = S.res[S.solid] || (S.res[S.solid] = {}); keys.forEach(function(k){ r[k] = 1; }); api.save(); }
  function busy(b){ V.busy = b; paintActs(); modeRG.lock(b); solRG.lock(b); mysRG.lock(b); setRG.lock(b); gapRG.lock(b); whyRG.lock(b); MV.keepFocus(q(".imf-rows"), paintRows); }
  var tw = null;
  function anim(dur, step, done){ tw = MV.tween({ dur:dur, step:function(u){ step(u); drawLat(); }, done:function(){ tw = null; done(); } }); }
  function heatTo(done){
    var d = SOL[S.solid], s = V.solid, T0 = d.t0 != null ? d.t0 : 25;
    if (s.melt >= 1) { done(); return; }
    s.T = T0; s.bulb = null; s.probe = false; s.dis = 0;
    if (d.hot) { V.cap = "Heating…"; paintSolid(); anim(1800, function(u){ s.T = T0 + (3500 - T0) * u; }, function(){ s.T = 3500; V.cap = "Still solid at 3500 °C: every atom is covalently bonded to its neighbours."; mark(["mp"]); done(); }); return; }
    V.cap = "Heating…"; paintSolid();
    anim(1500, function(u){ s.T = T0 + (d.mp - T0) * u; }, function(){
      V.cap = d.mys ? "It melts at " + degC(d.mp) + "." : d.type === "molecular" ? "At " + degC(d.mp) + " the molecules separate, but each one stays whole." : d.type === "network" ? "At " + degC(d.mp) + " covalent bonds break: melting a network solid means breaking bonds." : d.type === "ionic" ? "At " + degC(d.mp) + " the lattice breaks up: the ions are free to move." : "At " + degC(d.mp) + " the cations move past each other; the electron sea stays.";
      anim(900, function(u){ s.melt = u; s.T = d.mp + 20 * u; }, function(){ mark(["mp"]); done(); });
    });
  }
  function cool(done){ var s = V.solid; if (s.melt <= 0 && s.dis <= 0) { s.T = null; done(); return; } var m0 = s.melt, d0 = s.dis; anim(700, function(u){ s.melt = m0 * (1 - u); s.dis = d0 * (1 - u); }, function(){ s.T = null; done(); }); }
  function bulbTest(on, msg, keys, done){ var s = V.solid; s.probe = true; s.bulb = null; drawLat(); MV.wait(500, function(){ s.bulb = !!on; V.cap = msg; mark(keys); paintSolid(); done(); }); }
  function act(a, cb){
    var d = SOL[S.solid], s = V.solid;
    function fin(){ paintSolid(); busy(false); MV.changed(); if (cb) cb(); }
    busy(true); s.probe = false; s.bulb = null;
    if (a === "heat") { heatTo(fin); return; }
    if (a === "scratch") { cool(function(){ var hard = /hardest|very hard/.test(d.hard), brit = /brittle/.test(d.hard), amt = hard ? 0 : 20; V.cap = "Scratching…"; paintSolid(); anim(700, function(u){ s.shift = brit ? amt * Math.sin(Math.PI * u) : amt * u; }, function(){ V.cap = "Scratch test: " + d.hard + "." + (d.mys ? "" : d.type === "ionic" ? " Shifting a layer lines up like charges, which repel: it cracks." : d.type === "metallic" ? " Layers of cations slide in the electron sea without breaking." : /slippery/.test(d.hard) ? " The layers slide over each other." : d.type === "network" ? " Bonds in every direction resist: nothing moves." : " Weak forces between molecules let them shift."); if (brit) s.shift = 0; mark(["scratch"]); fin(); }); }); return; }
    if (a === "cs") { cool(function(){ var on = d.cs !== 0; bulbTest(on, d.mys ? (on ? "The bulb lights." : "The bulb stays dark.") : on ? (d.type === "network" ? "The bulb lights: graphite’s delocalized electrons move along its layers." : "The bulb lights: delocalized electrons move through the solid.") : d.type === "ionic" ? "Solid: the ions are fixed, and the bulb stays dark." : "The bulb stays dark: nothing in the solid can carry charge.", ["cs"], fin); }); return; }
    if (a === "cm") {
      if (d.hot) { cool(function(){ V.cap = "It doesn’t melt below 3500 °C, so there’s no liquid to test."; mark(["cm", "mp"]); fin(); }); return; }
      s.dis = 0; heatTo(function(){ var on = d.cm === 1; bulbTest(on, d.mys ? (on ? "Molten: the bulb lights." : "Molten, but the bulb stays dark.") : on ? (d.type === "metallic" ? "Molten metal: the electron sea still carries charge, and the bulb lights." : "Molten: the ions move, and the bulb lights.") : "Molten, but the bulb stays dark: " + (d.type === "network" ? "there are still no ions or free electrons." : "whole, neutral molecules carry no charge."), ["cm"], fin); });
      return;
    }
    if (a === "cw") {
      cool(function(){
        if (d.react) { V.cap = "Not tested: sodium reacts with water."; mark(["cw"]); fin(); return; }
        var sol = d.sw === "yes"; s.sol = sol; V.cap = "Adding water…"; paintSolid();
        anim(1100, function(u){ s.dis = sol ? u : 0.5 * u; }, function(){
          var on = d.cw === 1;
          bulbTest(on, d.mys ? (sol ? "It dissolves in water" : d.sw === "barely" ? "It barely dissolves in water" : "It doesn’t dissolve in water") + (on ? ", and the bulb lights." : ", and the bulb stays dark.") + (d.sh === "yes" ? " It dissolves in hexane." : sol ? " It doesn’t dissolve in hexane." : " It doesn’t dissolve in hexane either.") : d.sw === "(is water)" ? "Ice is water: melted, it’s still neutral H₂O molecules, and the bulb stays dark." : on ? "Dissolved: water pulls the ions apart (ion–dipole forces), they move, and the bulb lights." : sol ? "It dissolves, but the bulb stays dark." : d.sw === "barely" ? "It barely dissolves in water, and the bulb stays dark. It dissolves in hexane." : "It doesn’t dissolve, so nothing carries charge: the bulb stays dark.", ["cw"], fin);
        });
      });
    }
  }
  q(".imf-acts").addEventListener("click", function(e){ var b = e.target.closest("[data-act2]"); if (!b || b.disabled || V.busy) return; act(b.dataset.act2); });
  LOOP.fns.push(function(t){ if (S.mode === "solid" && !V.busy && (SOL[S.solid].lat[0] === "metal" || SOL[S.solid].lat[0] === "gra" || V.solid.melt > 0)) drawLat(t); });

  function paint(){
    $$(".imf-pane", host).forEach(function(p){ p.hidden = p.dataset.pane !== S.mode; });
    modeRG.set(S.mode);
    if (S.mode === "between") { paintRows(); paintBetween(); }
    else if (S.mode === "trend") paintTrend();
    else { paintActs(); paintSolid(); }
  }
  paint();
  LOOP.vis = true; loopStart();
  MV.APP.onShow = (function(prev){ return function(v){ if (prev) prev(v); LOOP.vis = v === "explore"; if (v === "explore" && S.mode === "trend") drawTrend(); }; })(MV.APP.onShow);

  // ----- predictions -----
  function setMode(m){ S.mode = m; api.save(); paint(); }
  var hooks = {
    start:function(p){
      if (tw) { tw(); tw = null; }
      V.hideBP = false; V.hbK = 1; V.dK = 1; V.hideP = false; V.revealK = 1;
      if (p.id === "p1") { S.set = "g14"; setRG.set("g14"); V.hideP = true; V.revealK = 0; setMode("trend"); }
      else if (p.id === "p2") { S.sel = ["H2O", "H2S"]; V.hideBP = true; V.hbK = 0; setMode("between"); }
      else if (p.id === "p3") { S.sel = ["pentane", "2,2-dimethylpropane"]; V.hideBP = true; V.dK = 0; setMode("between"); }
      else { S.solid = "NaCl"; solRG.set("NaCl"); mysRG.set(""); V.solid = { melt:0, dis:0, T:null, bulb:null, probe:false, shift:0, sol:false }; V.cap = "Solid NaCl, ready for a conductivity test."; setMode("solid"); }
      busy(true);
    },
    run:function(p, done){
      function end(){ busy(false); paint(); MV.changed(); done(); }
      if (p.id === "p1") { tw = MV.tween({ dur:1800, ease:function(x){ return x; }, step:function(u){ V.revealK = u; drawTrend(); }, done:function(){ tw = null; V.hideP = false; V.revealK = 1; paintTrend(); end(); } }); return; }
      if (p.id === "p2" || p.id === "p3") {
        var ids = S.sel.slice(0, 2), lo = -260, target = ids.map(bpOf);
        V.hideBP = false;
        tw = MV.tween({ dur:1600, step:function(u){ if (p.id === "p2") V.hbK = u; else V.dK = u; paintBetween(); paintBars(target.map(function(v){ return lo + (v - lo) * u; })); }, done:function(){ tw = null; V.hbK = 1; V.dK = 1; paintBetween(); end(); } });
        return;
      }
      // p4: solid test, then heat past 801 °C and test again
      V.solid.probe = true; drawLat();
      MV.wait(600, function(){ V.solid.bulb = false; V.cap = "Solid: the ions are fixed, and the bulb stays dark."; mark(["cs"]); paintSolid();
        MV.wait(1200, function(){ V.solid.probe = false; V.solid.bulb = null; heatTo(function(){ bulbTest(true, "Heated past 801 °C, the ions move, and the bulb lights.", ["cm"], end); }); }); });
    }
  };

  // ----- challenges -----
  var TEN = ["Ne", "CH4", "NH3", "HF", "H2O"];
  function chal(id, opt){
    if (id === "tc1") {
      var m = M.tc1, sel = S.sel.slice(0, 2);
      if (sel.length < 2) return { ok:false, msg:m.two };
      if (sel.some(function(x){ return TEN.indexOf(x) < 0; })) return { ok:false, msg:m.ten };
      var k = sel.slice().sort().join("|"), gap = Math.abs(bpOf(sel[0]) - bpOf(sel[1]));
      if (k === "CH4|Ne") return { ok:false, msg:m.neCh4 };
      if (k === "H2O|HF" || k === "HF|NH3") return { ok:false, msg:m.bothHb };
      if (gap < 100) return { ok:false, msg:m.small };
      if (!S.gap) return { ok:false, msg:m.chip };
      if (S.gap === "disp") return { ok:false, msg:m.disp };
      if (S.gap === "dip") return { ok:false, msg:m.dip };
      return { ok:true };
    }
    if (id === "tc2") {
      var b = S.bins, t = M.tc2;
      if (!b.M1 || !b.M2 || !b.M3) return { ok:false, msg:t.place };
      if (b.M1 === "ionic") return { ok:false, msg:t.m1ionic };
      if (b.M3 === "network") return { ok:false, msg:t.m3net };
      if (b.M2 === "metallic") return { ok:false, msg:t.m2met };
      var all = C.mystery.every(function(x){ return S.bins[x.id] === MV.ans(x); });
      return all ? { ok:true } : { ok:false, msg:t.other };
    }
    var w = M.tc3;
    if (S.dot16 == null) return { ok:false, msg:w.group };
    var v = S.dot16;
    if (v >= 80) return { ok:false, msg:w.real };
    if (v > -2) return { ok:false, msg:w.high };
    if (v > -60) return { ok:false, msg:w.notLow };
    if (v < -100) return { ok:false, msg:w.tooLow };
    if (!S.why16) return { ok:false, msg:w.chip };
    if (S.why16 === "oh") return { ok:false, msg:w.oh };
    if (S.why16 === "few") return { ok:false, msg:w.few };
    if (opt && !opt.live) MV.wait(30, function(){ MV.banner("good", w.banner); });
    return { ok:true };
  }
  return { predict:hooks, challenge:chal };
}

// ---------- Part 3: Identify the solid ----------
var PICS = { sugar:["sugar"], MgO:["ion", "Mg²⁺", "O²⁻"], sodium:["metal", "Na⁺"], SiO2:["sio2"], wax:["wax"], graphite:["gra"] };
function part3(host, api){
  var S = api.S, P = MV.C.part3, A = P.s1, B = P.s2, Cc = P.s3;
  S.used = S.used || {}; S.cls = S.cls || {}; S.ok = S.ok || {}; S.cur = S.cur || "U1"; S.inv = S.inv || []; S.mat = S.mat || {}; S.view = S.view || "";
  var msg = { bench:"", cls:"", inv:null, mat:{} };
  host.innerHTML = '<div class="part imf-p3"><h3>' + A.title + "</h3><p>" + A.intro + '</p><div class="imf-tok" aria-live="polite"></div><div class="imf-ucards" role="group" aria-label="Unknown solids"></div><div class="imf-tests" role="group" aria-label="Tests"></div><p class="imf-tmsg" aria-live="polite"></p><div class="imf-rtab"></div><div class="imf-cls"></div><div class="imf-done" aria-live="polite"></div>' +
    '<div class="imf-inv"><h4>' + A.invest.title + "</h4><p>" + A.invest.q + '</p><div class="chips imf-invc" role="group" aria-label="Choose two tests"></div><div class="q-actions"><button type="button" class="btn primary sm" data-inv="check" data-k="invchk">Check</button></div><div class="imf-invfb"></div></div></div>' +
    '<div class="part"><h3>' + B.title + '</h3><details class="alg imf-cwd"><summary>' + B.summary + '</summary><div class="imf-cwdb"></div></details></div>' +
    '<div class="part"><h3>' + Cc.title + "</h3><p>" + Cc.intro + '</p><div class="imf-mats"></div></div>';
  function q(s){ return $(s, host); }
  function U(id){ return A.unknowns.filter(function(u){ return u.id === id; })[0]; }
  function used(){ var n = 0; Object.keys(S.used).forEach(function(k){ n += Object.keys(S.used[k]).length; }); return n; }
  function left(){ return A.tokens - used(); }
  function paintBench(){
    q(".imf-tok").innerHTML = "Test tokens left: <strong>" + left() + " of " + A.tokens + '</strong> <button type="button" class="btn ghost sm" data-reset="1" data-k="reset">' + A.reset + "</button>";
    q(".imf-ucards").innerHTML = A.unknowns.map(function(u){ var on = S.cur === u.id; return '<button type="button" class="imf-ucard' + (on ? " on" : "") + (S.ok[u.id] ? " done" : "") + '" aria-pressed="' + on + '" data-u="' + u.id + '" data-k="u' + u.id + '"><strong>' + u.id + "</strong><span>" + (S.ok[u.id] ? "✓ " + MV.C.part3.s1.classes.filter(function(c){ return c.id === MV.ans(u); })[0].t : "unknown") + "</span></button>"; }).join("");
    var ur = S.used[S.cur] || {};
    q(".imf-tests").innerHTML = '<span class="imf-tl">Tests for ' + S.cur + ":</span>" + A.tests.map(function(t){ var done = !!ur[t.id]; return '<button type="button" class="btn ghost sm' + (done ? " done" : "") + '" data-test="' + t.id + '" data-k="t' + t.id + '"' + (done || (!left() && !done) ? " disabled" : "") + ">" + (done ? "✓ " : "") + t.t + "</button>"; }).join("");
    q(".imf-tmsg").textContent = msg.bench;
    var rows = A.unknowns.map(function(u){ var r = S.used[u.id] || {}; return ['<strong>' + u.id + "</strong>"].concat(A.tests.map(function(t){ return r[t.id] ? u.r[t.id] : '<span class="muted">—</span>'; })); });
    q(".imf-rtab").innerHTML = MV.tableHTML({ head:["Unknown"].concat(A.tests.map(function(t){ return t.head; })), rows:rows, caption:"Test results", hiRow:A.unknowns.indexOf(U(S.cur)) });
    var u = U(S.cur);
    q(".imf-cls").innerHTML = '<div class="imf-clsr"></div><div class="q-actions"><button type="button" class="btn primary sm" data-cchk="1" data-k="cchk"' + (S.ok[S.cur] ? " disabled" : "") + ">Check " + S.cur + "</button></div>" + (msg.cls ? msg.cls : "");
    radios(q(".imf-clsr"), { label:"Classify " + S.cur + ":", aria:"Classify " + S.cur, cls:"chips", options:A.classes, value:S.cls[S.cur] || "", onChange:function(v){ S.cls[S.cur] = v; msg.cls = ""; api.save(); var f = q(".imf-cls .fb"); if (f) f.remove(); } }).lock(!!S.ok[S.cur]);
    if (S.ok[S.cur] && !msg.cls) q(".imf-cls").insertAdjacentHTML("beforeend", MV.fbHTML("good", "<strong>✓ " + u.id + " is " + u.name + ".</strong> " + A.typeWhy[u.pic === "graphite" ? "graphite" : MV.ans(u)]));
    var nOk = A.unknowns.filter(function(x){ return S.ok[x.id]; }).length;
    q(".imf-done").innerHTML = nOk === A.unknowns.length ? MV.fbHTML("good", "<strong>" + A.done.replace("{n}", used()) + "</strong> " + (used() <= A.tokens ? A.efficient : A.wasteful)) : "";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.u) { S.cur = b.dataset.u; msg.bench = ""; msg.cls = ""; api.save(); MV.keepFocus(q(".imf-p3"), paintBench); return; }
    if (b.dataset.reset) { S.used = {}; S.resets = (S.resets || 0) + 1; msg.bench = "The bench is reset: 12 tokens and an empty results table."; api.save(); MV.keepFocus(q(".imf-p3"), paintBench); return; }
    if (b.dataset.test) {
      var r = S.used[S.cur] || (S.used[S.cur] = {});
      if (!left()) { msg.bench = A.noTokens; MV.keepFocus(q(".imf-p3"), paintBench); return; }
      r[b.dataset.test] = 1; var u0 = U(S.cur), t0 = A.tests.filter(function(t){ return t.id === b.dataset.test; })[0];
      msg.bench = S.cur + ", " + MV.plain(t0.t).replace(/\?$/, "") + ": " + MV.plain(u0.r[t0.id]) + "." + (left() ? "" : " " + MV.plain(A.noTokens));
      api.save(); MV.keepFocus(q(".imf-p3"), paintBench); paintCwd(); return;
    }
    if (b.dataset.cchk) {
      var u = U(S.cur), pick = S.cls[S.cur];
      if (!pick) { msg.cls = MV.fbHTML("", "Choose a bin first."); paintBench(); return; }
      if (pick === MV.ans(u)) { S.ok[u.id] = 1; msg.cls = ""; S.view = u.id; q(".imf-cwd").open = true; api.save(); paintBench(); paintCwd(); MV.focusFb(q(".imf-cls")); return; }
      msg.cls = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (A.wrong[u.id + "|" + pick] || A.wrong[pick]));
      paintBench(); MV.focusFb(q(".imf-cls")); return;
    }
    if (b.dataset.invt) { var i = S.inv.indexOf(b.dataset.invt); if (i >= 0) S.inv.splice(i, 1); else { S.inv.push(b.dataset.invt); if (S.inv.length > 2) S.inv.shift(); } msg.inv = null; api.save(); MV.keepFocus(q(".imf-inv"), paintInv); return; }
    if (b.dataset.inv) {
      var I = A.invest, ans = MV.ans(I);
      if (S.inv.length !== 2) msg.inv = MV.fbHTML("", I.two);
      else if (ans.some(function(p){ return p.every(function(x){ return S.inv.indexOf(x) >= 0; }); })) { msg.inv = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + I.right); S.invOk = 1; }
      else msg.inv = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (S.inv.indexOf("cm") >= 0 ? I.withCm : I.noCm));
      api.save(); paintInv(); MV.focusFb(q(".imf-inv")); return;
    }
    if (b.dataset.cv) { S.view = b.dataset.cv; api.save(); MV.keepFocus(q(".imf-cwdb"), paintCwd); return; }
    if (b.dataset.mat) { var c = b.dataset.mat, kind = b.dataset.kind, v = b.dataset.v, st0 = S.mat[c] || (S.mat[c] = {});
      if (kind === "s") { st0.s = v; msg.mat[c] = null; }
      else if (kind === "chk") { var card = Cc.cards.filter(function(x){ return x.id === c; })[0]; if (!st0.s) msg.mat[c] = MV.fbHTML("", "Choose a structure first."); else if (st0.s === MV.ans(card)) { st0.ok = 1; msg.mat[c] = null; } else msg.mat[c] = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + Cc.wrong); }
      else if (kind === "b") st0.b = v; else if (kind === "e") st0.e = v;
      api.save(); MV.keepFocus(q(".imf-mats"), paintMats); if (kind === "chk") MV.focusFb(q('[data-card="' + c + '"]')); return; }
  });
  function paintInv(){
    q(".imf-invc").innerHTML = A.tests.map(function(t){ var on = S.inv.indexOf(t.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-invt="' + t.id + '" data-k="inv' + t.id + '">' + t.t + "</button>"; }).join("");
    q(".imf-invfb").innerHTML = msg.inv || (S.invOk ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + A.invest.right) : "");
  }
  function paintCwd(){
    var done = A.unknowns.filter(function(u){ return S.ok[u.id]; }), box = q(".imf-cwdb");
    if (!done.length) { box.innerHTML = '<p class="muted">' + B.none + "</p>"; return; }
    if (!S.ok[S.view]) S.view = done[0].id;
    var u = U(S.view), r = S.used[u.id] || {}, M = latModel(PICS[u.pic]);
    var lines = A.tests.map(function(t){ return '<li><strong>' + t.head + ":</strong> " + (r[t.id] ? u.r[t.id] + " → " + u.why[t.id] : '<span class="muted">not tested.</span> ' + u.why[t.id]) + "</li>"; }).join("");
    box.innerHTML = "<p>" + B.intro + '</p><div class="chips imf-cvs" role="group" aria-label="Classified solids">' + done.map(function(x){ var on = x.id === S.view; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-cv="' + x.id + '" data-k="cv' + x.id + '">' + x.id + ": " + x.name + "</button>"; }).join("") + "</div>" +
      '<div class="imf-cwg"><svg class="imf-msvg" viewBox="0 0 360 250" role="img" aria-label="' + esc("Particle picture of " + MV.plain(u.name) + ": " + MV.plain(u.type).toLowerCase() + " solid.") + '">' + latSVG(M, { mini:true }) + '</svg><div><p>' + A.typeWhy[u.pic === "graphite" ? "graphite" : MV.ans(u)].replace(/^([^:]+):/, "<strong>$1:</strong>") + '</p><ul class="imf-cwl">' + lines + "</ul></div></div>";
  }
  function paintMats(){
    q(".imf-mats").innerHTML = Cc.cards.map(function(c){
      var s0 = S.mat[c.id] || {}, h = '<div class="imf-mat" data-card="' + c.id + '"><h4>' + c.name + '</h4><p class="imf-prop">' + c.prop + "</p>";
      h += '<p class="tiny imf-ml"><strong>Structure and particles:</strong></p><div class="chips" role="group" aria-label="Structure for ' + esc(c.name) + '">' + Cc.structures.map(function(x){ var on = s0.s === x.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-mat="' + c.id + '" data-kind="s" data-v="' + x.id + '" data-k="m' + c.id + x.id + '"' + (s0.ok ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</div>";
      if (!s0.ok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-mat="' + c.id + '" data-kind="chk" data-k="mchk' + c.id + '">Check</button></div>' + (msg.mat[c.id] || "");
      else {
        h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + c.right);
        h += '<p class="tiny imf-ml"><strong>One benefit:</strong></p><div class="chips" role="group" aria-label="Benefit">' + c.benefits.map(function(x, i){ var on = s0.b === String(i); return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-mat="' + c.id + '" data-kind="b" data-v="' + i + '" data-k="mb' + c.id + i + '">' + x + "</button>"; }).join("") + "</div>";
        h += '<p class="tiny imf-ml"><strong>One environmental consideration:</strong></p><div class="chips" role="group" aria-label="Environmental consideration">' + Cc.envs.map(function(x){ var on = s0.e === x.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-mat="' + c.id + '" data-kind="e" data-v="' + x.id + '" data-k="me' + c.id + x.id + '">' + x.t + "</button>"; }).join("") + "</div>";
        if (s0.b != null && s0.e) h += '<p class="imf-mnote">' + c.name + ": " + c.benefits[+s0.b] + "; but " + Cc.envs.filter(function(x){ return x.id === s0.e; })[0].t + ". " + c.env[s0.e] + "</p>";
      }
      return h + "</div>";
    }).join("");
  }
  paintBench(); paintInv(); paintCwd(); paintMats();
}

// ---------- Practice 2: Which boils higher, and why? (chips, from SCH4U 17's bestAct) ----------
function higherAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:null, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-bi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★ Non-routine</span>' : "") + "</div>";
    h += '<div class="chips imf-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.options[x.pick].t + "</strong> " + (it.options[x.pick].why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
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

// ---------- Performance task: Boiling-point staircase (tap a card, then tap a step) ----------
var task = (function(){
  var S = null, api = null, T = null, inp = null, pv = null;
  function read(){ return { s:(S && S.slots ? S.slots : [null, null, null]).slice(0, 3) }; }
  function full(d){ return d.s.every(function(x){ return !!x; }); }
  function paint(){
    var d = read();
    inp.querySelector(".imf-cards").innerHTML = T.cards.map(function(id){ var on = S.pick === id, used = d.s.indexOf(id) >= 0; return '<button type="button" class="chip imf-card' + (on ? " on" : "") + (used ? " used" : "") + '" aria-pressed="' + on + '" data-card="' + id + '" data-k="card' + id + '">' + F(SUB[id].f) + "</button>"; }).join("");
    inp.querySelector(".imf-slots").innerHTML = [0, 1, 2].map(function(i){ var id = d.s[i]; return '<button type="button" class="imf-slot' + (id ? " full" : "") + '" data-slot="' + i + '" data-k="slot' + i + '" aria-label="Step ' + (i + 1) + ": " + (id ? esc(MV.plain(F(SUB[id].f))) + ", " + E(id) + " electrons, " + FS[st(id)].toLowerCase() + ", boils at " + MV.plain(degC(bpOf(id))) + ". Tap to clear." : "empty" + (S.pick ? ". Tap to place " + esc(MV.plain(F(SUB[S.pick].f))) : "")) + '"><span class="imf-sn">Step ' + (i + 1) + "</span>" + (id ? "<strong>" + F(SUB[id].f) + '</strong><span class="tiny">' + E(id) + " electrons · " + FS[st(id)] + " · " + degC(bpOf(id)) + "</span>" : '<span class="muted">' + (S.pick ? "tap to place" : "empty") + "</span>") + "</button>"; }).join("");
    // staircase preview
    var w = 420, h = 230, base = 200, lo = -200, hi = 120, sv = "";
    function Y(v){ return base - (clamp(v, lo, hi) - lo) / (hi - lo) * 170; }
    sv += ln(20, base, w - 10, base, { w:1.6, c:"var(--ink-2)" });
    d.s.forEach(function(id, i){ var x = 30 + i * 128; if (!id) { sv += '<rect x="' + x + '" y="' + (base - 30) + '" width="118" height="30" rx="4" fill="none" stroke="var(--rule)" stroke-width="1.5" stroke-dasharray="5 4"/>' + tx(x + 59, base - 15, "step " + (i + 1), { fs:12, c:"var(--ink-2)" }); return; }
      var y = Y(bpOf(id)); sv += '<rect x="' + x + '" y="' + r1(y) + '" width="118" height="' + r1(base - y) + '" rx="4" fill="var(--hi-soft)" stroke="var(--pen)" stroke-width="2"/>' + tx(x + 59, y + 14, MV.plain(F(SUB[id].f)), { fs:14, w:700 }) + tx(x + 59, y - 10, degC(bpOf(id)), { fs:12.5, w:700, halo:true }); });
    pv.querySelector(".imf-stair").innerHTML = sv;
    pv.querySelector(".imf-stair").setAttribute("aria-label", "Staircase: " + d.s.map(function(id, i){ return "step " + (i + 1) + " " + (id ? MV.plain(F(SUB[id].f)) + " at " + MV.plain(degC(bpOf(id))) : "empty"); }).join("; ") + ".");
  }
  function onClick(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.card) { S.pick = S.pick === b.dataset.card ? null : b.dataset.card; }
    else if (b.dataset.slot != null) { var i = +b.dataset.slot; S.slots = S.slots || [null, null, null]; if (S.pick) { var j = S.slots.indexOf(S.pick); if (j >= 0) S.slots[j] = null; S.slots[i] = S.pick; S.pick = null; } else S.slots[i] = null; }
    else return;
    api.save(); MV.keepFocus(inp, paint); api.update();
  }
  return {
    render:function(i0, p0, a){
      api = a; S = a.S; T = MV.C.task; inp = i0; pv = p0;
      if (!Array.isArray(S.slots)) S.slots = [null, null, null];
      S.slots = S.slots.map(function(x){ return T.cards.indexOf(x) >= 0 ? x : null; });
      inp.innerHTML = '<p class="how">' + T.how + '</p><div class="chips imf-cards" role="group" aria-label="Substance cards"></div><div class="imf-slots" role="group" aria-label="Staircase steps"></div>';
      pv.innerHTML = '<h4 class="imf-h4">Your staircase</h4><svg class="imf-stair" viewBox="0 0 420 230" role="img" aria-label=""></svg>';
      inp.addEventListener("click", onClick);
      paint();
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Fill all three steps first."; },
    checks:function(d){
      if (!full(d)) return [false, false, false, false];
      var s = d.s, e = s.map(E), f = s.map(st), b = s.map(bpOf);
      return [e[0] === e[1] && e[1] === e[2], f[0] === "disp" && f[1] === "dip" && f[2] === "hb", b[0] < b[1] && b[1] < b[2], s.every(function(x){ return !ELEMENTS[x]; })];
    },
    key:function(d){ return d.s.join("|"); },
    label:function(k){ return k.split("|").map(function(id){ return F(SUB[id].f); }).join(" → "); },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ higher:higherAct },
  task:task
});
})();
