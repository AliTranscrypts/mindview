// SCH4U 32 Entropy: hero (three state boxes; four particles spread when a partition lifts; a drop of dye spreads through a
// beaker), Microstate shuffler (Explore: C6 particle box with fixed-seed shuffles, N14 arrangement table + bar chart of
// ways; "Changes and reactions" mode with atom-conserving before/after animations, the C13 S° panel, a ΔS° entry and a
// reason chip row), Predict ΔS (Part 3: gas-rule sorter + "Check it with data", other-clue animations, second-law bars),
// the S° panel added to "Calculate ΔS°", and the "Gas used, entropy up" task (card, direction, water state).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f, D = MV.chem.data;
var MIN = "−";
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function zeros(n){ var a = []; for (var i = 0; i < n; i++) a.push(0); return a; }
function sgn1(v){ var x = r1(v); return (x > 0 ? "+" : x < 0 ? MIN : "") + Math.abs(x).toFixed(1); }
function LIN(t){ return t; }
function rng(seed){ var s = (seed >>> 0) || 1; return function(){ s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
function hash(str){ var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function shuffleR(a, R){ a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function nCk(n, k){ if (k < 0 || k > n) return 0; var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); }
function DSi(){ return "Δ<i>S</i>"; }

// ---------- course data (MV.chem.data; never retyped) ----------
var S0 = {}; D.S0.forEach(function(r){ S0[r[0]] = r[1]; });
function sumS(list){ return list.reduce(function(a, t){ return a + t[0] * S0[t[1]]; }, 0); }
function dS(r, p){ return r1(sumS(p) - sumS(r)); }
function miscNum(name){ var r = D.misc.filter(function(m){ return m[0] === name; })[0]; return r ? parseFloat(String(r[1]).replace(/−/g, "-").replace(/^\+/, "")) : null; }
// Second-law bars for water freezing at −10 °C. VERIFY: uses the course table's ΔHfus (+6.01 kJ/mol) and ΔSfus (+22.0 J/(mol·K))
// measured at 0 °C as approximations at −10 °C (263 K); the real values there give the same picture (total ≈ +0.8 J/K).
var T_FRZ = 263.15;
var LAW = (function(){ var h = miscNum("ΔHfus of water"), s = miscNum("ΔSfus of water"), sys = -s, sur = h * 1000 / T_FRZ; return { h:h, sys:sys, sur:sur, tot:sys + sur }; })();

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + r1(Math.max(0, op) * 100) / 100 + '"' : ""; }
function T(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 14) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + opA(o.op) + ">" + esc(s) + "</text>"; }
function Ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function circ(x, y, r, fill, extra){ return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '" fill="' + fill + '"' + (extra || "") + "/>"; }

// atom ball in the course colours (C ink, H white with outline, O magenta, N blue, metals cerulean, Cl teal), always lettered
function ball(x, y, el, op){
  if (el[0] === "*") return circ(x, y, 9.5, el === "*a" ? "var(--pen)" : "var(--p-c)", opA(op)) + T(x, y + 0.5, el === "*a" ? "A" : "B", { fs:10.5, w:700, c:"var(--sheet)", op:op });
  var A = MV.chem.atom(el), r = el === "H" ? 6.5 : 9.5, fs = el === "H" ? 8.5 : el.length > 1 ? 8.5 : 10.5;
  return circ(x, y, r, A.fill, (el === "H" ? ' stroke="' + A.line + '" stroke-width="1.4"' : "") + opA(op)) + T(x, y + 0.5, el, { fs:fs, w:700, c:A.ink, op:op });
}

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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- @component C6 particleScene — atom-conserving before/after particle view (SVG string). Molecules are
// placed as a lattice (s), a packed liquid (l), dissolved particles in a tinted water layer (aq) or a spread gas (g; gL/gR
// keep to one half). Every atom of the "before" picture is paired with an atom of the same element "after", so atoms move
// (never appear or vanish) while old bonds fade and new ones form. def: {id, b:["sp:st", …], a:[…], x (repeat), phys,
// water, lat (lattice columns), wall (mixing partition), heat (speed trails), same (after = before positions)}.
var GLY = {
  H2O:{ a:[["O", 0, 0], ["H", -11, 8], ["H", 11, 8]], b:[[0, 1], [0, 2]], w:36, h:28 },
  CO2:{ a:[["C", 0, 0], ["O", -17, 0], ["O", 17, 0]], b:[[0, 1], [0, 2]], w:56, h:22 },
  O2:{ a:[["O", -8.5, 0], ["O", 8.5, 0]], b:[[0, 1]], w:38, h:22 },
  N2:{ a:[["N", -8.5, 0], ["N", 8.5, 0]], b:[[0, 1]], w:38, h:22 },
  H2:{ a:[["H", -6, 0], ["H", 6, 0]], b:[[0, 1]], w:26, h:16 },
  NH3:{ a:[["N", 0, 0], ["H", -12, 7], ["H", 12, 7], ["H", 0, -13]], b:[[0, 1], [0, 2], [0, 3]], w:40, h:34 },
  C:{ a:[["C", 0, 0]], b:[], w:22, h:22 },
  CaCO3:{ a:[["Ca", -24, 2], ["C", 4, 0], ["O", 4, -16], ["O", 18, 8], ["O", -9, 9]], b:[[1, 2], [1, 3], [1, 4]], w:64, h:40 },
  CaO:{ a:[["Ca", -9.5, 0], ["O", 9.5, 0]], b:[], w:42, h:22 },
  Na:{ a:[["Na", 0, 0]], b:[], w:22, h:22 }, Cl:{ a:[["Cl", 0, 0]], b:[], w:22, h:22 }, Ag:{ a:[["Ag", 0, 0]], b:[], w:22, h:22 },
  A:{ a:[["*a", 0, 0]], b:[], w:22, h:22 }, B:{ a:[["*b", 0, 0]], b:[], w:22, h:22 }
};
var SW = 320, SH = 200, WTOP = 62;
function rot(dx, dy, a){ var c = Math.cos(a), s = Math.sin(a); return [dx * c - dy * s, dx * s + dy * c]; }
function expand(list, x){ var out = []; for (var i = 0; i < (x || 1); i++) list.forEach(function(s){ var p = s.split(":"); out.push({ sp:p[0], st:p[1] }); }); return out; }
function rad(m){ var g = GLY[m.sp]; return Math.max(g.w, g.h) / 2; }
function placeAll(mols, seed, def){
  var R = rng(seed), placed = [], sol = mols.filter(function(m){ return m.st === "s"; }), nl = mols.filter(function(m){ return m.st === "l"; }).length;
  if (sol.length) {
    var cw = Math.max.apply(null, sol.map(function(m){ return GLY[m.sp].w; })) + 2, ch = Math.max.apply(null, sol.map(function(m){ return GLY[m.sp].h; })) + 4;
    var cols = def.lat || Math.min(sol.length, Math.floor((SW - 30) / cw)), xc = def.latX || SW / 2;
    sol.forEach(function(m, i){ var r = Math.floor(i / cols), c = i % cols; m.x = xc + (c - (cols - 1) / 2) * cw; m.y = SH - 12 - ch / 2 - r * ch; m.a = 0; placed.push(m); });
  }
  var liqTop = SH - Math.min(120, 40 + 6.5 * nl);
  mols.forEach(function(m){
    if (m.st === "s") return;
    var rr = rad(m), x0 = 12 + rr, x1 = SW - 12 - rr, y0, y1, best = null, bd = -1e9;
    if (m.st === "l") { y0 = liqTop + rr; y1 = SH - 10 - rr; }
    else if (m.st === "aq") { y0 = WTOP + 6 + rr; y1 = SH - 10 - rr; }
    else { y0 = 10 + rr; y1 = SH - 10 - rr; if (m.st === "gL") x1 = SW / 2 - 8 - rr; if (m.st === "gR") x0 = SW / 2 + 8 + rr; }
    for (var k = 0; k < 80; k++) {
      var x = lerp(x0, x1, R()), y = lerp(y0, y1, R()), d = 1e9;
      placed.forEach(function(q){ d = Math.min(d, Math.hypot(q.x - x, q.y - y) - rad(q) - rr); });
      if (d > bd) { bd = d; best = [x, y]; }
      if (d > (m.st === "l" ? -2 : 10)) break;
    }
    m.x = best[0]; m.y = best[1]; m.a = R() * Math.PI * 2; placed.push(m);
  });
}
function atomsOf(mols){ var out = []; mols.forEach(function(m, mi){ m.i0 = out.length; GLY[m.sp].a.forEach(function(at){ var p = rot(at[1], at[2], m.a || 0); out.push({ el:at[0], x:m.x + p[0], y:m.y + p[1], m:mi }); }); }); return out; }
function makeScene(def){
  var bm = expand(def.b, def.x), am, seed = hash(def.id);
  placeAll(bm, seed, def);
  if (def.same) am = bm.map(function(m){ return { sp:m.sp, st:m.st, x:m.x, y:m.y, a:m.a }; });
  else { am = expand(def.a, def.x); placeAll(am, seed + 7, def); }
  var ba = atomsOf(bm), aa = atomsOf(am), idx = {}, cnt = {}, R = rng(seed + 3);
  aa.forEach(function(a, j){ (idx[a.el] = idx[a.el] || []).push(j); });
  ba.forEach(function(b, i){ var k = cnt[b.el] || 0; cnt[b.el] = k + 1; b.to = idx[b.el][k]; aa[b.to].from = i; });
  bm.forEach(function(m){ m.dir = R() * Math.PI * 2; });
  return { def:def, bm:bm, am:am, ba:ba, aa:aa };
}
function sceneSVG(sc, t){
  var def = sc.def, s = '<rect x="1" y="1" width="' + (SW - 2) + '" height="' + (SH - 2) + '" rx="10" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2"/>';
  if (def.water) s += '<rect x="3" y="' + WTOP + '" width="' + (SW - 6) + '" height="' + (SH - WTOP - 3) + '" rx="8" fill="var(--info-bg)"/>' + Ln(4, WTOP, SW - 4, WTOP, { c:"var(--ink-2)", w:1.5, d:"4 5" });
  if (def.wall && t < 0.6) s += '<rect x="' + (SW / 2 - 3) + '" y="' + r1(4 - t * 260) + '" width="6" height="' + (SH - 8) + '" rx="3" fill="var(--ink)"' + opA(1 - t / 0.6) + "/>";
  var P = sc.ba.map(function(b){ var a = sc.aa[b.to]; return [lerp(b.x, a.x, t), lerp(b.y, a.y, t)]; });
  if (def.heat) sc.bm.forEach(function(m, mi){
    var L = lerp(5, 22, t), c = P[m.i0], dx = Math.cos(m.dir), dy = Math.sin(m.dir);
    for (var j = 0; j < 3; j++) { var o = (j - 1) * 6; s += Ln(c[0] - dx * 16 - dy * o, c[1] - dy * 16 + dx * o, c[0] - dx * (16 + L) - dy * o, c[1] - dy * (16 + L) + dx * o, { c:"var(--ink-2)", w:1.6, op:0.7 }); }
  });
  var ob = def.phys ? 1 : 1 - clamp((t - 0.15) / 0.3, 0, 1), oa = def.phys ? 0 : clamp((t - 0.55) / 0.3, 0, 1);
  if (ob > 0.01) sc.bm.forEach(function(m){ GLY[m.sp].b.forEach(function(bd){ var p = P[m.i0 + bd[0]], q = P[m.i0 + bd[1]]; s += Ln(p[0], p[1], q[0], q[1], { w:3, op:ob }); }); });
  if (oa > 0.01) sc.am.forEach(function(m){ GLY[m.sp].b.forEach(function(bd){ var p = P[sc.aa[m.i0 + bd[0]].from], q = P[sc.aa[m.i0 + bd[1]].from]; s += Ln(p[0], p[1], q[0], q[1], { w:3, op:oa }); }); });
  sc.ba.forEach(function(b, i){ s += ball(P[i][0], P[i][1], b.el); });
  return s;
}
var SCN = {};
function scene(def){ return SCN[def.id] || (SCN[def.id] = makeScene(def)); }
var NACL_S = ["Na:s", "Cl:s", "Na:s", "Cl:s", "Cl:s", "Na:s", "Cl:s", "Na:s"], NACL_AQ = NACL_S.map(function(s){ return s.replace(":s", ":aq"); });
var AGCL_S = NACL_S.map(function(s){ return s.replace("Na", "Ag"); }), AGCL_AQ = AGCL_S.map(function(s){ return s.replace(":s", ":aq"); });
function rep(s, n){ var a = []; for (var i = 0; i < n; i++) a.push(s); return a; }
var KEY = "Atoms: O magenta · H white · C ink · N blue · Na, Ca and Ag cerulean · Cl teal.";

// ---------- Explore process cards (plan: 8 cards) ----------
var CARDS = [
  { id:"melt", t:"ice melting", eq:"H2O(s) -> H2O(l)", g:[0, 0], sign:"positive", clue:"Solid → liquid: the molecules can now slide past each other.", bf:"ice: molecules locked in a lattice", af:"liquid water: molecules slide past each other", b:["H2O:s"], a:["H2O:l"], x:12, phys:true },
  { id:"cond", t:"water vapour condensing", eq:"H2O(g) -> H2O(l)", g:[1, 0], sign:"negative", clue:"Gas → liquid: the molecules crowd together.", bf:"water vapour: molecules fly through the whole box", af:"liquid water: molecules crowd together", b:["H2O:g"], a:["H2O:l"], x:9, phys:true },
  { id:"subl", t:"dry ice subliming", eq:"CO2(s) -> CO2(g)", g:[0, 1], sign:"positive", clue:"Solid → gas: a big increase in arrangements.", bf:"dry ice: CO₂ molecules packed in a solid", af:"CO₂ gas: molecules move freely through the box", b:["CO2:s"], a:["CO2:g"], x:8, phys:true },
  { id:"diss", t:"salt dissolving", eq:"NaCl(s) -> Na+(aq) + Cl-(aq)", g:[0, 0], sign:"positive", clue:"Dissolving: the ions break free and spread through the water.", bf:"a salt crystal in water", af:"Na⁺ and Cl⁻ ions spread through the water", b:NACL_S, a:NACL_AQ, x:2, phys:true, water:true, lat:4 },
  { id:"caco3", eq:"CaCO3(s) -> CaO(s) + CO2(g)", g:[0, 1], sign:"positive", clue:"A gas forms from a solid.", bf:"solid calcium carbonate", af:"solid CaO, and CO₂ gas moving freely", b:["CaCO3:s"], a:["CaO:s", "CO2:g"], x:4 },
  { id:"nh3", eq:"N2(g) + 3H2(g) -> 2NH3(g)", g:[4, 2], sign:"negative", clue:"Four moles of gas become two.", bf:"N₂ and H₂ gas: 4 gas molecules for every 2 NH₃", af:"NH₃ gas: half as many gas molecules", b:["N2:g", "H2:g", "H2:g", "H2:g"], a:["NH3:g", "NH3:g"], x:2 },
  { id:"h2o", eq:"2H2(g) + O2(g) -> 2H2O(l)", g:[3, 0], sign:"negative", clue:"Three moles of gas become liquid.", bf:"H₂ and O₂ gas", af:"liquid water at the bottom: no gas left", b:["H2:g", "H2:g", "O2:g"], a:["H2O:l", "H2O:l"], x:2 },
  { id:"co2", eq:"C(s) + O2(g) -> CO2(g)", g:[1, 1], sign:"about zero", clue:"One mole of gas becomes one mole of gas.", bf:"solid carbon and O₂ gas", af:"CO₂ gas: the same number of gas molecules", b:["C:s", "O2:g"], a:["CO2:g"], x:3 }
];
CARDS.forEach(function(c){ c.lab = c.t || F(c.eq); });
function cardOf(id){ return CARDS.filter(function(c){ return c.id === id; })[0]; }
// challenge values, computed from the S° table
var CA = { ok:dS([[1, "CaCO3(s)"]], [[1, "CaO(s)"], [1, "CO2(g)"]]), add:r1(S0["CaCO3(s)"] + S0["CaO(s)"] + S0["CO2(g)"]), noCaO:r1(S0["CO2(g)"] - S0["CaCO3(s)"]) };
var NH = { ok:dS([[1, "N2(g)"], [3, "H2(g)"]], [[2, "NH3(g)"]]), noCoef:dS([[1, "N2(g)"], [1, "H2(g)"]], [[1, "NH3(g)"]]) };
function near(v, w){ return v != null && Math.abs(v - w) <= 0.5; }
function readNum(s){ s = String(s || "").replace(/J.*$/i, "").replace(/\s+/g, ""); if (!s) return null; var v = MV.parseNum(s); return v && v.length === 1 ? v[0] : NaN; }

// ---------- hero ----------
var HCAP = ["Four gas particles, all in the left half of the box.", "The partition lifts…", "They spread out. Split 2 and 2 is the likeliest: it has the most arrangements.", "A drop of food colouring spreads through water the same way."];
var HP0 = [[52, 62], [104, 104], [60, 158], [110, 188]], HP1 = [[62, 72], [206, 96], [118, 170], [226, 178]];
var HDYE = (function(){ var R = rng(77), a = []; for (var i = 0; i < 26; i++) a.push([lerp(352, 518, R()), lerp(92, 206, R()), (R() - 0.5) * 10, (R() - 0.5) * 8]); return a; })();
function heroSVG(lift, spread, dye){
  var s = '<rect x="18" y="20" width="244" height="196" rx="10" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2.5"/>' + Ln(140, 24, 140, 212, { c:"var(--rule)", w:2, d:"5 6" });
  if (lift < 1) s += '<rect x="136" y="' + r1(22 - lift * 210) + '" width="8" height="192" rx="3" fill="var(--ink)"' + opA(1 - lift) + "/>";
  HP0.forEach(function(p, i){ s += circ(lerp(p[0], HP1[i][0], spread), lerp(p[1], HP1[i][1], spread), 15, "var(--pen)"); });
  s += '<path d="M330 30 V206 Q330 218 342 218 H528 Q540 218 540 206 V30" fill="none" stroke="var(--ink-2)" stroke-width="2.5" stroke-linejoin="round"/>';
  s += '<rect x="333" y="78" width="204" height="137" rx="6" fill="var(--info-bg)"/>' + Ln(333, 78, 537, 78, { c:"var(--ink-2)", w:1.5 });
  if (dye > 0) HDYE.forEach(function(d){ var x = lerp(435 + d[2], d[0], dye), y = lerp(88 + d[3], d[1], dye); s += circ(x, y, 4.5, "var(--p-c)", opA(0.85)); });
  else s += circ(435, 52, 6, "var(--p-c)");
  return s;
}
function stateSVG(kind){
  var s = '<rect x="3" y="3" width="114" height="84" rx="8" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2"/>', R = rng(kind === "l" ? 11 : 23), i;
  if (kind === "s") for (i = 0; i < 12; i++) s += circ(33 + (i % 4) * 18, 76 - Math.floor(i / 4) * 18, 7.5, "var(--pen)");
  else if (kind === "l") { var L = [[20, 76], [37, 74], [54, 77], [71, 75], [88, 76], [102, 72], [28, 60], [46, 59], [63, 61], [80, 58], [96, 57], [55, 44]]; L.forEach(function(p){ s += circ(p[0], p[1], 7.5, "var(--pen)"); }); s += Ln(14, 40, 24, 36, { c:"var(--ink-2)", w:1.5 }); }
  else for (i = 0; i < 6; i++) { var x = [22, 70, 98, 40, 84, 26][i], y = [20, 26, 60, 50, 78, 78][i], a = R() * 6.28; s += Ln(x - Math.cos(a) * 11, y - Math.sin(a) * 11, x - Math.cos(a) * 24, y - Math.sin(a) * 24, { c:"var(--ink-2)", w:1.5 }) + circ(x, y, 7.5, "var(--pen)"); }
  return s;
}
function hero(){
  var svg = $("#en-hx-svg"), cap = $("#en-hx-cap"), ctr = $("#en-hx-ctr"), rp = $("#en-hx-replay"), stx = $("#en-hx-states");
  if (!svg) return;
  if (stx) stx.innerHTML = [["s", "solid"], ["l", "liquid"], ["g", "gas"]].map(function(k){ return '<figure class="en-hx-st"><svg viewBox="0 0 120 90" role="img" aria-label="' + (k[0] === "s" ? "A solid: particles packed in a grid, vibrating in place." : k[0] === "l" ? "A liquid: particles close together at the bottom, sliding past each other." : "A gas: particles spread through the whole box, moving freely.") + '">' + stateSVG(k[0]) + "</svg><figcaption>" + k[1] + "</figcaption></figure>"; }).join('<span class="en-hx-arr" aria-hidden="true">→</span>');
  var st = { lift:0, spread:0, dye:0 }, run = 0;
  function draw(){ svg.innerHTML = heroSVG(st.lift, st.spread, st.dye); }
  function counter(on){ ctr.innerHTML = on ? "Ways to be all on the left: <strong>1</strong> · ways to be split 2 and 2: <strong>6</strong> · total: <strong>16</strong>" : ""; }
  function play(){
    var id = ++run; rp.hidden = true; st = { lift:0, spread:0, dye:0 }; draw(); cap.textContent = HCAP[0]; counter(false);
    MV.wait(1000, function(){
      if (id !== run) return; cap.textContent = HCAP[1];
      MV.tween({ dur:900, step:function(t){ st.lift = t; draw(); }, done:function(){
        if (id !== run) return;
        MV.tween({ dur:1600, step:function(t){ st.spread = t; draw(); }, done:function(){
          if (id !== run) return; cap.textContent = HCAP[2]; counter(true);
          MV.wait(1600, function(){
            if (id !== run) return; cap.textContent = HCAP[3];
            MV.tween({ dur:2600, step:function(t){ st.dye = Math.max(0.02, t); draw(); }, done:function(){ if (id === run) rp.hidden = false; } });
          });
        } });
      } });
    });
  }
  if (MV.reduceMotion) { st = { lift:1, spread:1, dye:1 }; draw(); cap.textContent = HCAP[2] + " " + HCAP[3]; counter(true); }
  else { rp.addEventListener("click", play); play(); }
}

// ---------- Explore: Microstate shuffler ----------
var SLX = [[45, 105, 165], [235, 295, 355]], SLY = [40, 90, 140, 190];
function target(sides, seed){
  var R = rng(911 + seed * 131 + sides.length * 17), sl = [[], []], used = [0, 0];
  for (var h = 0; h < 2; h++) { for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) sl[h].push([SLX[h][c], SLY[r]]); sl[h] = shuffleR(sl[h], R); }
  return sides.map(function(sd){ var p = sl[sd][used[sd]++]; return [p[0] + (R() - 0.5) * 12, p[1] + (R() - 0.5) * 10]; });
}
function boxSVG(P, part){
  var s = '<rect x="10" y="10" width="380" height="210" rx="10" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2.5"/>' + Ln(200, 14, 200, 216, { c:"var(--rule)", w:2, d:"5 6" });
  if (part < 1) s += '<rect x="196" y="' + r1(12 - part * 220) + '" width="8" height="206" rx="3" fill="var(--ink)"' + opA(1 - part) + "/>";
  P.forEach(function(p, i){ s += circ(p[0], p[1], 15, "var(--pen)") + T(p[0], p[1] + 0.5, String(i + 1), { fs:14, w:700, c:"var(--sheet)" }); });
  return s;
}
function barsSVG(n, t, kNow, hiAll){
  var x0 = 34, w = 356, base = 168, top = 34, slot = w / (n + 1), bw = Math.min(40, slot * 0.66), mx = nCk(n, Math.floor(n / 2)), s = Ln(x0 - 6, base, x0 + w, base, { c:"var(--ink-2)", w:1.5 });
  for (var k = 0; k <= n; k++) {
    var v = nCk(n, k), h = (base - top) * v / mx * t, cx = x0 + slot * (k + 0.5), tall = v === mx;
    s += '<rect x="' + r1(cx - bw / 2) + '" y="' + r1(base - h) + '" width="' + r1(bw) + '" height="' + r1(Math.max(0, h)) + '" fill="' + (tall ? "var(--hi)" : "var(--ink-2)") + '"' + ((hiAll && k === n) || k === kNow ? ' stroke="var(--ink)" stroke-width="2.5"' : "") + "/>";
    if (t > 0.98) s += T(cx, base - h - 11, String(v), { fs:13, w:tall ? 700 : 400 });
    s += T(cx, base + 14, String(k), { fs:13 });
  }
  s += T(x0 + w / 2, base + 36, "Particles on the left", { fs:13, c:"var(--ink-2)" });
  return s;
}
function explore(host, api){
  var S = api.S, C = api.content;
  if (S.mode !== "rx") S.mode = "spread";
  S.n = clamp(Math.round(+S.n || 4), 2, 10); S.open = !!S.open;
  if (!Array.isArray(S.sides) || S.sides.length !== S.n || !S.open) S.sides = zeros(S.n);
  S.shot = Math.max(0, Math.round(+S.shot || 0));
  if (!Array.isArray(S.tally) || S.tally.length !== S.n + 1) S.tally = zeros(S.n + 1);
  S.counted = !!S.counted; if (!cardOf(S.card)) S.card = "melt"; S.ph = S.ph === 1 ? 1 : 0;
  S.vals = S.vals && typeof S.vals === "object" ? S.vals : {};
  if (!C.whys.some(function(w){ return w.id === S.why; })) S.why = "";
  var busy = false, tws = [], hide = {}, note = "", msg = "", part = S.open ? 1 : 0, barT = 1, ph = S.ph, hiAll = false;
  var cur = target(S.sides, S.open ? S.shot : 0);

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="en-modes"></div>' +
    '<div class="en-grid"><div class="en-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="en-box"><svg class="en-svg" role="img" aria-label=""></svg></div><p class="en-cap" aria-live="polite"></p>' +
    '<div class="q-actions en-b1"><button type="button" class="btn primary sm" data-x="shuffle" data-k="enshuf">Shuffle</button><button type="button" class="btn ghost sm" data-x="count" data-k="encount">Count all</button></div>' +
    '<div class="q-actions en-b2"><button type="button" class="btn primary sm" data-x="run" data-k="enrun">Run the change</button><button type="button" class="btn ghost sm" data-x="back" data-k="enback">Back to before</button></div>' +
    '<p class="tiny muted en-b2 en-key">' + KEY + "</p></div>" +
    '<div class="en-side"><div class="en-c1"><div class="en-n"></div><div class="en-part"></div></div><div class="en-c2 en-cards"></div>' +
    '<p class="en-msg" aria-live="polite"></p><dl class="read en-read" aria-live="polite"></dl>' +
    '<div class="en-work"><div class="numrow en-numrow"><label for="en-dsin">Your Δ<i>S</i>° for this card:</label><input class="numin" id="en-dsin" type="text" inputmode="text" autocomplete="off" spellcheck="false"><span class="en-unit">J/K</span></div>' +
    '<div class="en-why"></div><div class="en-tab"></div></div></div></div>' +
    '<div class="en-count"><figure class="en-barfig"><svg class="en-bars" viewBox="0 0 400 214" role="img" aria-label=""></svg><figcaption class="tiny muted">Ways for each split. The tallest bar is highlighted; the outlined bar is the arrangement in the box.</figcaption></figure><div class="en-tbl"></div></div>';
  var svg = $(".en-svg", host), bsvg = $(".en-bars", host), inp = $("#en-dsin"), cap = $(".en-cap", host);
  var modeRG = radios($(".en-modes", host), { label:"Mode", aria:"Shuffler mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; note = ""; msg = ""; api.save(); paint(); MV.changed(); } });
  var sl = MV.sliders($(".en-n", host), [{ id:"enn", label:"Particles, <i>N</i>", min:2, max:10, step:1, value:S.n, fmt:function(v){ return String(v); } }], function(id, v){ setN(v); });
  var partRG = radios($(".en-part", host), { label:"Partition", aria:"Partition", options:[{ id:"closed", t:"closed" }, { id:"open", t:"open" }], value:S.open ? "open" : "closed",
    onChange:function(v){ if (v === "open") openPart(); else closePart(); } });
  var cardRG = radios($(".en-cards", host), { label:"Process card", aria:"Process card", cls:"chips", options:CARDS.map(function(c){ return { id:c.id, t:c.lab }; }), value:S.card,
    onChange:function(v){ S.card = v; S.ph = 0; ph = 0; note = ""; msg = ""; api.save(); paint(); MV.changed(); } });
  var whyRG = radios($(".en-why", host), { label:"Why can it still happen at room temperature?", aria:"Why the reaction can still happen", cls:"chips en-whyg", options:C.whys, value:S.why,
    onChange:function(v){ S.why = v; api.save(); MV.changed(); } });
  MV.chem.tablePanel($(".en-tab", host), "s0", { title:"S° panel: standard entropies at 298 K" });

  function stopAll(){ tws.forEach(function(c){ if (c) c(); }); tws = []; busy = false; lock(false); }
  function lock(b){
    $$(".en-b1 button, .en-b2 button", host).forEach(function(x){ x.disabled = b; });
    $$(".en-n input", host).forEach(function(x){ x.disabled = b; });
    modeRG.lock(b); partRG.lock(b); cardRG.lock(b);
  }
  function tween(o){ var c = MV.tween(o); tws.push(c); return c; }
  function nLeft(){ return S.sides.filter(function(x){ return x === 0; }).length; }
  function setVis(){
    var m1 = S.mode === "spread";
    $$(".en-b1, .en-c1, .en-count", host).forEach(function(x){ x.hidden = !m1; });
    $$(".en-b2, .en-c2, .en-work", host).forEach(function(x){ x.hidden = m1; });
    var c = cardOf(S.card); $(".en-why", host).hidden = m1 || c.sign !== "negative";
  }
  function draw(){
    if (S.mode === "spread") {
      svg.setAttribute("viewBox", "0 0 400 230"); svg.innerHTML = boxSVG(cur, part);
      var k = nLeft();
      svg.setAttribute("aria-label", "Box with " + S.n + " numbered particles. Partition " + (S.open ? "open" : "closed") + ". " + (S.open ? k + " on the left and " + (S.n - k) + " on the right." : "All on the left."));
    } else {
      var c = cardOf(S.card), sc = scene(c);
      svg.setAttribute("viewBox", "0 0 " + SW + " " + SH); svg.innerHTML = sceneSVG(sc, ph);
      svg.setAttribute("aria-label", MV.plain(F(c.eq)) + ". " + (ph < 0.5 ? "Before: " + c.bf : "After: " + c.af) + ".");
    }
  }
  function paintCount(){
    var n = S.n, bf = $(".en-barfig", host), tb = $(".en-tbl", host);
    if (!S.counted) { bf.hidden = true; tb.innerHTML = '<p class="muted en-ph">Press <strong>Count all</strong> to fill the arrangement table and the chart.</p>'; return; }
    bf.hidden = false;
    bsvg.innerHTML = barsSVG(n, barT, S.open && !hiAll ? nLeft() : -1, hiAll);
    var rows = [], mx = nCk(n, Math.floor(n / 2));
    for (var k = 0; k <= n; k++) rows.push([String(k), String(n - k), (nCk(n, k) === mx ? "<strong>" + nCk(n, k) + "</strong>" : String(nCk(n, k)))]);
    rows.push(["Total", "", "<strong>" + Math.pow(2, n) + "</strong>"]);
    tb.innerHTML = MV.tableHTML({ head:["Number on the left", "Number on the right", "Ways"], rows:rows, hiRow:hiAll ? n : Math.floor(n / 2), caption:"Arrangements of " + n + " particles" });
    bsvg.setAttribute("aria-label", "Bar chart of ways for each number on the left, 0 to " + n + ": " + rows.slice(0, n + 1).map(function(r){ return MV.plain(r[2]); }).join(", ") + ".");
  }
  function paintRead(){
    var rows;
    if (S.mode === "spread") {
      var n = S.n, tot = Math.pow(2, n), h = Math.floor(n / 2), k = nLeft(), split = n % 2 ? (h + 1) + " | " + h + " or " + h + " | " + (h + 1) : h + " | " + h;
      var shots = S.tally.reduce(function(a, b){ return a + b; }, 0), best = 0; S.tally.forEach(function(v, i){ if (v > S.tally[best]) best = i; });
      rows = [["Particles", String(n)], ["Total arrangements", "2<sup>" + n + "</sup> = " + tot], ["Ways for the most likely split (" + split + ")", "<strong>" + nCk(n, h) + "</strong>"],
        ["Chance all on the left", hide.chance ? muted("?") : "1/" + tot],
        ["Entropy compared with start", S.open ? "<strong>higher</strong>: " + tot + " arrangements instead of 1" : "the start: 1 arrangement, all on the left"],
        ["This arrangement", S.open ? k + " | " + (n - k) + ": one of " + nCk(n, k) + " ways to get this split" : "all " + n + " on the left"],
        ["Your shuffles", shots ? shots + " so far; most often " + best + " | " + (n - best) + " (" + S.tally[best] + (S.tally[best] === 1 ? " time)" : " times)") : muted("none yet")]];
    } else {
      var c = cardOf(S.card);
      rows = [["Process", F(c.eq)], ["Moles of gas, before → after", hide.gas ? muted("?") : c.g[0] + " → " + c.g[1]],
        ["Predicted sign of " + DSi(), hide.sign ? muted("?") : "<strong>" + c.sign + "</strong>"], ["Clue", hide.sign ? muted("?") : c.clue]];
    }
    $(".en-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    if (S.mode === "spread") cap.innerHTML = note || (S.open ? "Partition open: each particle can be on either side." : "Partition closed: all " + S.n + " particles are on the left.");
    else { var c = cardOf(S.card); cap.innerHTML = note || (ph > 0.5 ? "<strong>After:</strong> " + c.af + "." : "<strong>Before:</strong> " + c.bf + "."); }
  }
  function paint(){
    setVis(); draw(); paintRead(); paintCap(); paintCount();
    $(".en-msg", host).innerHTML = msg;
    if (document.activeElement !== inp) inp.value = S.vals[S.card] || "";
  }
  function moveTo(T2, dur, cb){
    var from = cur.map(function(p){ return p.slice(); });
    busy = true; lock(true);
    tween({ dur:dur, step:function(t){ cur = from.map(function(p, i){ return [lerp(p[0], T2[i][0], t), lerp(p[1], T2[i][1], t)]; }); draw(); },
      done:function(){ cur = T2; busy = false; lock(false); paint(); if (cb) cb(); } });
  }
  function doShuffle(cb, dur){
    if (!S.open) { msg = "Open the partition first: with it closed, every particle stays on the left."; paint(); return; }
    S.shot++; var R = rng(4021 + S.n * 7919 + S.shot * 104729);
    S.sides = S.sides.map(function(){ return R() < 0.5 ? 0 : 1; });
    S.tally[nLeft()]++; hiAll = false; msg = ""; api.save(); MV.changed();
    if (dur === 0) { cur = target(S.sides, S.shot); paint(); if (cb) cb(); return; }
    moveTo(target(S.sides, S.shot), dur || 700, cb);
  }
  function openPart(cb){
    if (S.open && part >= 1) { if (cb) cb(); return; }
    S.open = true; partRG.set("open"); msg = ""; api.save(); busy = true; lock(true);
    tween({ dur:700, step:function(t){ part = t; draw(); }, done:function(){ part = 1; busy = false; lock(false); doShuffle(cb); } });
  }
  function closePart(){
    S.open = false; partRG.set("closed"); S.sides = zeros(S.n); hiAll = false; note = ""; msg = ""; api.save(); MV.changed();
    var T2 = target(S.sides, 0), from = cur.map(function(p){ return p.slice(); }), p0 = part; busy = true; lock(true);
    tween({ dur:800, step:function(t){ cur = from.map(function(p, i){ return [lerp(p[0], T2[i][0], t), lerp(p[1], T2[i][1], t)]; }); part = p0 * (1 - t); draw(); },
      done:function(){ cur = T2; part = 0; busy = false; lock(false); paint(); } });
  }
  function countAll(cb){
    if (!S.open) { openPart(function(){ countAll(cb); }); return; }
    S.counted = true; api.save(); busy = true; lock(true); barT = 0; paintCount();
    tween({ dur:1100, step:function(t){ barT = t; paintCount(); }, done:function(){ barT = 1; busy = false; lock(false); paint(); MV.changed(); if (cb) cb(); } });
  }
  function setN(v){
    stopAll(); S.n = v; S.shot = 0; S.tally = zeros(v + 1); S.counted = false; S.sides = zeros(v); hiAll = false; note = ""; msg = "";
    cur = target(S.sides, 0);
    if (S.open) doShuffle(null, 0); else { api.save(); paint(); }
    MV.changed();
  }
  function runChange(cb){
    stopAll(); ph = 0; S.ph = 0; note = ""; busy = true; lock(true); paintCap();
    tween({ dur:2400, step:function(t){ ph = t; draw(); }, done:function(){ ph = 1; S.ph = 1; busy = false; lock(false); api.save(); paint(); MV.changed(); if (cb) cb(); } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-x]"); if (!b || b.disabled || busy) return;
    var x = b.dataset.x; note = "";
    if (x === "shuffle") doShuffle();
    else if (x === "count") countAll();
    else if (x === "run") runChange();
    else if (x === "back") { ph = 0; S.ph = 0; api.save(); paint(); }
  });
  inp.addEventListener("input", function(){ S.vals[S.card] = inp.value; api.save(); MV.changed(); });

  var hooks = {
    start:function(p){
      stopAll(); hide = {}; note = ""; msg = ""; hiAll = false;
      if (p.id === "p1" || p.id === "p2") {
        S.mode = "spread"; S.n = p.id === "p1" ? 4 : 10; S.open = false; part = 0; S.sides = zeros(S.n); S.shot = 0; S.tally = zeros(S.n + 1); S.counted = false;
        cur = target(S.sides, 0); sl.set("enn", S.n); if (p.id === "p2") hide.chance = true;
      } else { S.mode = "rx"; S.card = p.id === "p3" ? "subl" : "h2o"; S.ph = 0; ph = 0; hide.sign = true; hide.gas = true; cardRG.set(S.card); }
      modeRG.set(S.mode); partRG.set(S.open ? "open" : "closed"); api.save(); paint();
    },
    run:function(p, done){
      if (p.id === "p1") { openPart(function(){ doShuffle(function(){ doShuffle(function(){ countAll(function(){ note = "2 | 2 has 6 of the 16 arrangements: more than any other split."; paint(); MV.wait(200, done); }); }); }); }); return; }
      if (p.id === "p2") { openPart(function(){ countAll(function(){ hide.chance = false; hiAll = true; note = "All 10 on the left: 1 way out of 1024."; paint(); MV.wait(200, done); }); }); return; }
      runChange(function(){ hide = {}; note = p.id === "p3" ? "A packed solid becomes freely moving gas: 0 → 1 mol of gas." : "Gas moles 3 → 0: three moles of gas become liquid."; paint(); MV.wait(200, done); });
    }
  };
  function chal(id){
    if (id === "tc1") {
      if (S.mode !== "spread") return { ok:false, msg:"Switch to Spreading out mode, then set <i>N</i>." };
      if (S.n === 6) return { ok:true };
      if (S.n === 5) return { ok:false, msg:"The most likely splits (3 | 2) have 10 ways each." };
      if (S.n > 6) return { ok:false, msg:S.n + " particles have far more ways: " + nCk(S.n, Math.floor(S.n / 2)) + " for the most likely split." };
      return { ok:false, msg:"With <i>N</i> = " + S.n + ", the most likely split has " + nCk(S.n, Math.floor(S.n / 2)) + " ways. Try a larger <i>N</i>." };
    }
    var c = id === "tc2" ? "caco3" : "nh3";
    if (S.mode !== "rx" || S.card !== c) return { ok:false, msg:"Switch to Changes and reactions mode and choose the " + F(cardOf(c).eq) + " card." };
    var v = readNum(S.vals[c]);
    if (v == null) return { ok:false, msg:"Enter your Δ<i>S</i>° in the box, in J/K." };
    if (isNaN(v)) return { ok:false, msg:"Enter one number, such as −12.3." };
    if (id === "tc2") {
      if (near(v, -CA.ok)) return { ok:false, msg:"Products minus reactants." };
      if (near(v, CA.add)) return { ok:false, msg:"Don’t add the reactant; subtract it." };
      if (near(v, CA.noCaO)) return { ok:false, msg:"Include CaO." };
      if (near(v, CA.ok)) return { ok:true };
      return { ok:false, msg:"Not yet. Add the products’ S° values, then subtract the reactant’s." };
    }
    if (near(v, NH.noCoef)) return { ok:false, msg:"Multiply by the coefficients: 2 × 192.8 and 3 × 130.7." };
    if (near(v, -NH.ok)) return { ok:false, msg:"Products minus reactants." };
    if (!near(v, NH.ok)) return { ok:false, msg:"Not yet. Multiply each S° by its coefficient, then take products minus reactants." };
    if (!S.why) return { ok:false, msg:"Right number. Now choose why the reaction can still happen." };
    if (S.why === "cant") return { ok:false, msg:"The second law is about the total entropy." };
    if (S.why !== "heat") return { ok:false, msg:"Your Δ<i>S</i>° is negative: the system’s entropy falls. Look at where the heat goes." };
    return { ok:true };
  }
  if (window.ResizeObserver) { var lw = 0; new ResizeObserver(function(){ var w = Math.round(host.getBoundingClientRect().width); if (w && Math.abs(w - lw) > 30) { lw = w; draw(); } }).observe(host); }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Predict ΔS ----------
var CLUES = {
  diss:{ id:"s2diss", b:NACL_S, a:NACL_AQ, x:2, phys:true, water:true, lat:4 },
  mix:{ id:"s2mix", b:rep("A:gL", 7).concat(rep("B:gR", 7)), a:rep("A:g", 7).concat(rep("B:g", 7)), x:1, phys:true, wall:true },
  heat:{ id:"s2heat", b:["N2:g"], a:["N2:g"], x:8, phys:true, same:true, heat:true },
  ppt:{ id:"s2ppt", b:AGCL_AQ, a:AGCL_S, x:2, phys:true, water:true, lat:4 }
};
var CLUECAP = { diss:"A salt crystal dissolving in water.", mix:"Two gases, A and B, mixing when the divider lifts.", heat:"N₂ gas warming from 25 °C to 80 °C. The trails show how fast each molecule moves.", ppt:"Ag⁺ and Cl⁻ ions meeting in water and forming solid AgCl." };
function lawSVG(cs, t){
  var y0 = 128, vals = cs === "freeze" ? [LAW.sys, LAW.sur, LAW.tot] : [-1, 1.55, 0.55], mx = Math.max.apply(null, vals.map(Math.abs)), sc = 78 / mx;
  var cols = ["var(--pen)", "var(--f3)", "var(--hi)"], names = ["System", "Surroundings", "Total"], txt = cs === "freeze" ? vals.map(function(v){ return sgn1(v) + " J/K"; }) : ["falls", "rises more", "rises"];
  var s = Ln(14, y0, 346, y0, { c:"var(--ink-2)", w:1.5 });
  vals.forEach(function(v, i){
    var cx = 66 + i * 114, h = v * sc * t;
    s += T(cx, 16, names[i], { fs:14, w:700 });
    s += '<rect x="' + (cx - 32) + '" y="' + r1(h >= 0 ? y0 - h : y0) + '" width="64" height="' + r1(Math.abs(h)) + '" fill="' + cols[i] + '"/>';
    if (t > 0.98) s += T(cx, h >= 0 ? y0 - h - 12 : y0 - h + 14, txt[i], { fs:14, w:i === 2 ? 700 : 400 });
  });
  return s;
}
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.sort = S.sort && typeof S.sort === "object" ? S.sort : {}; S.data = !!S.data; S.lawOn = !!S.lawOn;
  if (!s2.clues.some(function(c){ return c.id === S.clue; })) S.clue = "diss";
  if (!s3.cases.some(function(c){ return c.id === S.law; })) S.law = "freeze";
  var sel = null, smsg = null, ct = 1, lt = S.lawOn ? 1 : 0, cbusy = false, lbusy = false, cstop = null, lstop = null;
  host.innerHTML = '<div class="part en-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="en-sort"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" data-d="data" data-k="endata">Check it with data</button></div><div class="en-data" aria-live="polite"></div><div class="en-s1tab"></div></div>' +
    '<div class="part en-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="en-clues"></div><div class="en-sbox"><svg class="en-csvg" viewBox="0 0 ' + SW + " " + SH + '" role="img" aria-label=""></svg></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" data-c="play" data-k="enclplay">Play again</button></div><p class="en-ccap" aria-live="polite"></p></div>' +
    '<div class="part en-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="en-cases"></div><div class="q-actions"><button type="button" class="btn primary sm" data-l="show" data-k="enlaw">Show the entropy changes</button></div>' +
    '<div class="en-lbox"><svg class="en-lsvg" viewBox="0 0 360 230" role="img" aria-label=""></svg></div><dl class="read en-lread" aria-live="polite"></dl><p class="en-ltxt" aria-live="polite"></p></div>';
  MV.chem.tablePanel($(".en-s1tab", host), "s0", { title:"S° panel: standard entropies at 298 K" });

  // station 1: the gas rule (tap-to-sort) and "Check it with data"
  var sortBox = $(".en-sort", host);
  function item(id){ return s1.items.filter(function(x){ return x.id === id; })[0]; }
  function bin(id){ return s1.bins.filter(function(x){ return x.id === id; })[0]; }
  function gasTxt(g){ return g[0] + " mol of gas → " + g[1] + " mol of gas"; }
  function paintSort(){
    var left = s1.items.filter(function(it){ return !S.sort[it.id]; }), h = '<p class="how">Tap a reaction, then tap the box it belongs in.</p><div class="en-tray" role="group" aria-label="Reactions to sort">';
    h += left.length ? left.map(function(it){ return '<button type="button" class="en-tile" data-it="' + it.id + '" data-k="it' + it.id + '" aria-pressed="' + (sel === it.id) + '">' + F(it.eq) + "</button>"; }).join("")
      : '<p class="sort-done">All sorted. Now press <strong>Check it with data</strong> to see each Δ<i>S</i>°.</p>';
    h += "</div>";
    if (smsg) h += MV.fbHTML(smsg.k, smsg.h);
    h += '<div class="en-bins">' + s1.bins.map(function(b){
      var inside = s1.items.filter(function(it){ return S.sort[it.id] === b.id; });
      return '<button type="button" class="en-bin" data-bin="' + b.id + '" data-k="bin' + b.id + '"><strong>' + b.label + "</strong><small>" + b.sub + '</small><span class="en-in">' + inside.map(function(it){ return '<span class="en-chipin">' + F(it.eq) + "</span>"; }).join("") + "</span></button>";
    }).join("") + "</div>";
    MV.keepFocus(sortBox, function(){ sortBox.innerHTML = h; });
  }
  sortBox.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.it) { sel = sel === b.dataset.it ? null : b.dataset.it; smsg = null; paintSort(); return; }
    if (b.dataset.bin) {
      if (!sel) { smsg = { k:"", h:"Tap a reaction first, then tap the box it belongs in." }; paintSort(); return; }
      var it = item(sel), ans = MV.ans(it), g = it.g;
      if (b.dataset.bin === ans) { S.sort[it.id] = ans; smsg = { k:"good", h:"<strong>✓ " + F(it.eq) + "</strong>: " + gasTxt(g) + "." }; sel = null; api.save(); }
      else smsg = { k:"bad", h:"<strong>✗ Not that box.</strong> " + gasTxt(g) + (g[0] === g[1] ? ": the gas count doesn’t change, so Δ<i>S</i> is about zero." : g[1] > g[0] ? ": more gas, so Δ<i>S</i> &gt; 0." : ": less gas, so Δ<i>S</i> &lt; 0.") + " Try another box." };
      paintSort(); MV.focusFb(sortBox);
    }
  });
  function paintData(){
    var box = $(".en-data", host);
    if (!S.data) { box.innerHTML = ""; return; }
    var rows = s1.items.map(function(it){ var v = dS(it.r, it.p); return [F(it.eq), gasTxt(it.g), bin(MV.ans(it)).label, "<strong>" + sgn1(v) + " J/K</strong>"]; });
    var zs = s1.items.filter(function(it){ return MV.ans(it) === "zero"; }).map(function(it){ return F(it.eq) + " is " + sgn1(dS(it.r, it.p)) + " J/K, about zero: " + it.g[0] + " mol of gas " + (it.g[0] === 1 ? "becomes " : "become ") + it.g[1] + " mol of gas."; });
    box.innerHTML = "<p>" + s1.data + "</p>" + MV.tableHTML({ head:["Reaction", "Moles of gas", "Gas rule", "Δ<i>S</i>° from data"], rows:rows, caption:"The gas rule checked with standard entropies" }) +
      '<p class="en-zs">' + zs.join(" ") + "</p>";
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (!b) return; S.data = true; api.save(); paintData(); });

  // station 2: other clues
  var clueRG = radios($(".en-clues", host), { label:"Clue", aria:"Clue", cls:"chips", options:s2.clues.map(function(c){ return { id:c.id, t:c.t }; }), value:S.clue, onChange:function(v){ S.clue = v; api.save(); playClue(); } });
  function clue(){ return s2.clues.filter(function(c){ return c.id === S.clue; })[0]; }
  function drawClue(){
    var sv = $(".en-csvg", host), c = clue(); sv.innerHTML = sceneSVG(scene(CLUES[c.id]), ct);
    sv.setAttribute("aria-label", CLUECAP[c.id] + " " + (ct > 0.5 ? "After: the particles have spread out or locked in place as described." : "Before."));
  }
  function paintClue(){
    var c = clue();
    drawClue();
    $(".en-ccap", host).innerHTML = CLUECAP[c.id] + (c.eq ? " " + F(c.eq) + "." : "") + (ct > 0.98 ? " <strong>" + c.sign + ".</strong> " + c.text : "");
    $('[data-c="play"]', host).disabled = cbusy;
  }
  function playClue(){
    if (cstop) cstop(); cbusy = true; ct = 0; paintClue();
    cstop = MV.tween({ dur:2200, step:function(t){ ct = t; drawClue(); }, done:function(){ cstop = null; ct = 1; cbusy = false; paintClue(); } });
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-c]"); if (!b || cbusy) return; playClue(); });

  // station 3: the second law in one picture
  var caseRG = radios($(".en-cases", host), { label:"Case", aria:"Case", cls:"chips", options:s3.cases.map(function(c){ return { id:c.id, t:c.t }; }), value:S.law,
    onChange:function(v){ if (lstop) lstop(); lbusy = false; S.law = v; S.lawOn = false; lt = 0; api.save(); paintLaw(); } });
  function paintLaw(){
    var cs = s3.cases.filter(function(c){ return c.id === S.law; })[0], sv = $(".en-lsvg", host), on = S.lawOn && lt > 0.98;
    sv.innerHTML = lawSVG(S.law, lt);
    sv.setAttribute("aria-label", S.law === "freeze" ? "Bars for water freezing at −10 °C: the system bar falls by 22.0 J/K, the surroundings bar rises by 22.8 J/K and the total rises by 0.8 J/K." : "Bars for a cell making a protein (not to scale): the system bar falls, the surroundings bar rises more, so the total rises.");
    var rows = S.law === "freeze" ? [["Δ<i>S</i>(system)", on ? sgn1(LAW.sys) + " J/K: 1 mol of water locks into ice" : muted("?")],
      ["Δ<i>S</i>(surroundings)", on ? "+" + MV.num(LAW.h * 1000, 0) + " J ÷ " + Math.round(T_FRZ) + " K = " + sgn1(LAW.sur) + " J/K" : muted("?")], ["Δ<i>S</i>(total)", on ? "<strong>" + sgn1(LAW.tot) + " J/K</strong>: the total rises" : muted("?")]]
      : [["Δ<i>S</i>(system)", on ? "falls: amino acids lock into one ordered chain" : muted("?")], ["Δ<i>S</i>(surroundings)", on ? "rises more: heat and small molecules are released" : muted("?")], ["Δ<i>S</i>(total)", on ? "<strong>rises</strong> (bars not to scale)" : muted("?")]];
    $(".en-lread", host).innerHTML = MV.readoutHTML(rows);
    $(".en-ltxt", host).innerHTML = on ? cs.text + " " + s3.note : "";
    $('[data-l="show"]', host).disabled = lbusy;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-l]"); if (!b || lbusy) return;
    lbusy = true; S.lawOn = true; lt = 0; caseRG.lock(true); paintLaw();
    lstop = MV.tween({ dur:1600, step:function(t){ lt = t; $(".en-lsvg", host).innerHTML = lawSVG(S.law, t); }, done:function(){ lstop = null; lt = 1; lbusy = false; caseRG.lock(false); api.save(); paintLaw(); } });
  });
  paintSort(); paintData(); paintClue(); paintLaw();
}

// ---------- S° panel for "Calculate ΔS°" (the built-in N4 activity) ----------
function addPanels(){
  var sh = $('[data-act-id="calc"]');
  if (!sh || sh.querySelector(".en-acttab")) return;
  var d = document.createElement("div"); d.className = "en-acttab";
  var p = sh.querySelector("p"); if (p && p.nextSibling) sh.insertBefore(d, p.nextSibling); else sh.appendChild(d);
  MV.chem.tablePanel(d, "s0", { title:"S° panel: standard entropies at 298 K" });
}

// ---------- Performance task: Gas used, entropy up ----------
var TK = {
  R1:{ r:[[1, "CaCO3(s)"]], p:[[1, "CaO(s)"], [1, "CO2(g)"]] },
  R2:{ r:[[1, "N2(g)"], [3, "H2(g)"]], p:[[2, "NH3(g)"]] },
  R3:{ r:[[2, "H2(g)"], [1, "O2(g)"]], p:[[2, "H2O(W)"]], w:true },
  R4:{ r:[[1, "CH4(g)"], [2, "O2(g)"]], p:[[1, "CO2(g)"], [2, "H2O(W)"]], w:true },
  R5:{ r:[[1, "C(graphite)"], [1, "O2(g)"]], p:[[1, "CO2(g)"]] },
  R6:{ r:[[1, "H2O(l)"]], p:[[1, "H2O(g)"]] }
};
var TKIDS = ["R1", "R2", "R3", "R4", "R5", "R6"];
function tkSp(sp, w){ return sp.replace("(W)", w === "g" ? "(g)" : "(l)"); }
function tkShow(sp, w){ return sp === "C(graphite)" ? "C(s)" : sp === "H2O(W)" && !w ? "H2O" : tkSp(sp, w); }
function tkSide(list, w){ return list.map(function(t){ return (t[0] > 1 ? t[0] : "") + tkShow(t[1], w); }).join(" + "); }
function tkCalc(d){
  var R = TK[d.card], w = R.w ? d.water : null, fix = function(l){ return l.map(function(t){ return [t[0], tkSp(t[1], w)]; }); };
  var L = d.dir === "rev" ? R.p : R.r, Rt = d.dir === "rev" ? R.r : R.p, Lf = fix(L), Rf = fix(Rt);
  var gas = function(l){ return l.reduce(function(a, t){ return a + (/\(g\)$/.test(t[1]) ? t[0] : 0); }, 0); };
  return { eq:tkSide(L, w || "x") + " -> " + tkSide(Rt, w || "x"), v:dS(Lf, Rf), sR:r1(sumS(Rf)), sL:r1(sumS(Lf)), gL:gas(Lf), gR:gas(Rf), w:w };
}
var task = (function(){
  var S = null, api = null, cardRG, dirRG, wRG;
  function read(){
    var c = S && TK[S.card] ? S.card : "R1";
    return { card:c, dir:S && S.dir === "rev" ? "rev" : "fwd", water:S && S.water === "g" ? "g" : "l" };
  }
  function paint(){
    var d = read(), k = tkCalc(d);
    $("#en-tkw").hidden = !TK[d.card].w;
    $("#en-tkeq").innerHTML = F(k.eq);
    $("#en-tkread").innerHTML = MV.readoutHTML([["Reaction as written", F(k.eq)], ["Moles of gas, left → right", k.gL + " → " + k.gR],
      ["Δ<i>S</i>°", "Σ<i>n S</i>°(right) − Σ<i>n S</i>°(left) = " + k.sR.toFixed(1) + " − " + k.sL.toFixed(1) + " = <strong>" + sgn1(k.v) + " J/K</strong>"]]);
  }
  function upd(){ api.save(); paint(); api.update(); }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; if (!TK[S.card]) S.card = "R1"; if (S.dir !== "rev") S.dir = "fwd"; if (S.water !== "g") S.water = "l";
      inp.innerHTML = '<div id="en-tkcard"></div><div id="en-tkdir"></div><div id="en-tkw"></div>';
      pv.innerHTML = '<h4 class="en-h4">Your process</h4><p class="en-tkeq" id="en-tkeq" aria-live="polite"></p><dl class="read" id="en-tkread" aria-live="polite"></dl><div id="en-tktab"></div>';
      cardRG = radios($("#en-tkcard"), { label:"Reaction card", aria:"Reaction card", cls:"chips en-tkcards", options:TKIDS.map(function(id){ return { id:id, t:"<strong>" + id + "</strong> " + F(tkSide(TK[id].r, null) + " -> " + tkSide(TK[id].p, null)) }; }), value:S.card, onChange:function(v){ S.card = v; upd(); } });
      dirRG = radios($("#en-tkdir"), { label:"Direction", aria:"Direction", options:[{ id:"fwd", t:"forward" }, { id:"rev", t:"reverse" }], value:S.dir, onChange:function(v){ S.dir = v; upd(); } });
      wRG = radios($("#en-tkw"), { label:"Water", aria:"State of the water", options:[{ id:"l", t:"liquid, H₂O(l)" }, { id:"g", t:"gas, H₂O(g)" }], value:S.water, onChange:function(v){ S.water = v; upd(); } });
      MV.chem.tablePanel($("#en-tktab"), "s0", { title:"S° panel: standard entropies at 298 K" });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var k = tkCalc(d); return [k.v > 0, k.gL > 0, k.v < 150]; },
    key:function(d){ return d.card + "-" + d.dir + (TK[d.card].w ? "-" + d.water : ""); },
    label:function(key){ var p = key.split("-"), k = tkCalc({ card:p[0], dir:p[1], water:p[2] || "l" }); return F(k.eq) + ", " + sgn1(k.v) + " J/K"; },
    text:function(key){ var p = key.split("-"), k = tkCalc({ card:p[0], dir:p[1], water:p[2] || "l" }); return MV.plain(F(k.eq)) + ", " + sgn1(k.v) + " J/K"; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  task:task,
  onShow:function(){ addPanels(); }
});
})();
