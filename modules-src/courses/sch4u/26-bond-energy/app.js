// SCH4U 26 Bond Energy: hero (H₂ + Cl₂ → 2HCl: energy in to break, energy out to form), Break and make (Explore: C1 molecule
// pictures, tappable reactant bonds, C4 three-level energy diagram, tally table with a mystery bond, Compare with ΔH°f, C13
// bond table), Why fuels release energy (Part 3 stations) and the "Between −100 and −200" task (live C4 diagram + tally).
// Every bond energy comes from MV.chem.data.bond; every ΔH°f from MV.chem.data.dHf; molar masses from MV.chem.data.M.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, CF = MV.chem.f, D = MV.chem.data, M = "−", UID = 0;
function r1(v){ return Math.round(v * 10) / 10; }
function esc(s){ return MV.esc(s); }
function lerp(a, b, t){ return a + (b - a) * t; }
function fx(v){ var r = Math.round(v * 10) / 10; return MV.chem.fx(r, Math.abs(r % 1) > 1e-9 ? 1 : 0); }
function sg(v){ return (v > 0 ? "+" : "") + fx(v); }
function cnt(n){ var w = Math.floor(n + 1e-9), h = n - w > 0.01; return h ? (w ? w : "") + "½" : String(w); }
function pn(s){
  s = String(s == null ? "" : s).trim().replace(/[−–]/g, "-").replace(/\s+/g, "");
  if (!s) return null;
  var m = /^(-?)(\d*)½$/.exec(s); if (m) return (m[1] ? -1 : 1) * ((+m[2] || 0) + 0.5);
  m = /^(-?\d+)\/(\d+)$/.exec(s); if (m && +m[2]) return +m[1] / +m[2];
  return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : null;
}

// ---------- SVG helpers (from SCH4U 19) ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function T(x, y, s, o){ o = o || {}; var fs = o.fs || 14; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + r1(fs) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + (o.halo ? ' stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" paint-order="stroke"' : "") + opA(o.op) + ">" + s + "</text>"; }
function Ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + r1(o.w || 2.4) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }

// @component radioGroup (from MHF4U 25, via SCH4U 01–19) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock). radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id)}) -> {set, get, lock}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, tab = on || (!any && first && !locked); first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ id = id == null ? "" : String(id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } } };
}

// ---------- bond energies (C13 course table) ----------
var BE = {}; D.bond.forEach(function(r){ BE[r[0]] = r[1]; });
// VERIFY: the course table gives C=O in CO₂ (799 kJ/mol) only in its note; the value is read from MV.chem.data.bondNote.
var CO2K = "C=O*"; BE[CO2K] = +((/(\d{3})/.exec(D.bondNote || "") || [0, 799])[1]);
function bLab(k){ return k === CO2K ? "C=O (in CO₂)" : k; }
var HF = {}; D.dHf.forEach(function(r){ HF[r[0]] = r[1]; });
function bkey(a, b, o){ var s = o === 1 ? "–" : o === 2 ? "=" : "≡"; return BE[a + s + b] != null ? a + s + b : b + s + a; }
function isMulti(k){ return /[=≡]/.test(k); }

// ---------- @component C1 moleculePics — 2D structural pictures (letters on every atom, course atom colours), bond orders 1–3 ----------
var LAY = {
  H2:{ a:[["H", -15, 0], ["H", 15, 0]], b:[[0, 1, 1]] },
  Cl2:{ a:[["Cl", -18, 0], ["Cl", 18, 0]], b:[[0, 1, 1]] },
  O2:{ a:[["O", -17, 0], ["O", 17, 0]], b:[[0, 1, 2]] },
  N2:{ a:[["N", -17, 0], ["N", 17, 0]], b:[[0, 1, 3]] },
  HCl:{ a:[["H", -16, 0], ["Cl", 18, 0]], b:[[0, 1, 1]] },
  H2O:{ a:[["O", 0, -8], ["H", -22, 12], ["H", 22, 12]], b:[[0, 1, 1], [0, 2, 1]] },
  CO2:{ a:[["O", -34, 0], ["C", 0, 0], ["O", 34, 0]], b:[[1, 0, 2], [1, 2, 2]], co2:true },
  CH4:{ a:[["C", 0, 0], ["H", 0, -28], ["H", 28, 0], ["H", 0, 28], ["H", -28, 0]], b:[[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]] },
  NH3:{ a:[["N", 0, 4], ["H", 0, -24], ["H", -25, 18], ["H", 25, 18]], b:[[0, 1, 1], [0, 2, 1], [0, 3, 1]] },
  CH3Cl:{ a:[["C", -6, 0], ["H", -6, -28], ["H", -34, 0], ["H", -6, 28], ["Cl", 30, 0]], b:[[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]] },
  C2H6:{ a:[["C", -16, 0], ["C", 16, 0], ["H", -16, -28], ["H", -44, 0], ["H", -16, 28], ["H", 16, -28], ["H", 44, 0], ["H", 16, 28]], b:[[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1], [1, 6, 1], [1, 7, 1]] }
};
var NAMEF = { H2:"H2", Cl2:"Cl2", O2:"O2", N2:"N2", HCl:"HCl", H2O:"H2O", CO2:"CO2", CH4:"CH4", NH3:"NH3", CH3Cl:"CH3Cl", C2H6:"C2H6" };
function rad(el){ return el === "H" ? 8 : el === "Cl" ? 12 : 11; }
function ext(f){ var mn = 1e9, mx = -1e9; LAY[f].a.forEach(function(a){ var r = rad(a[0]); mn = Math.min(mn, a[1] - r); mx = Math.max(mx, a[1] + r); }); return { mn:mn, w:mx - mn }; }
function bondLines(x1, y1, x2, y2, o, st){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, h = "", offs = o === 1 ? [0] : o === 2 ? [-3.4, 3.4] : [-5, 0, 5];
  offs.forEach(function(d){ h += Ln(x1 + nx * d, y1 + ny * d, x2 + nx * d, y2 + ny * d, { c:"var(--ink-2)", w:2.2, d:st.dash, op:st.op }); });
  return h;
}
function ballSVG(el, x, y, op){ var c = MV.chem.atom(el), r = rad(el); return "<g" + opA(op) + '><circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '" fill="' + c.fill + '"' + (el === "H" ? ' stroke="' + c.line + '" stroke-width="1.5"' : "") + "/>" + T(x, y + 0.5, el, { fs:el.length > 1 ? 10 : 11.5, w:700, c:c.ink }) + "</g>"; }
function molSVG(f, ox, oy, look, aop){
  var L = LAY[f], h = "";
  L.b.forEach(function(b, j){ var A = L.a[b[0]], B = L.a[b[1]], st = look(j); h += bondLines(ox + A[1], oy + A[2], ox + B[1], oy + B[2], b[2], st); });
  L.a.forEach(function(a){ h += ballSVG(a[0], ox + a[1], oy + a[2], aop); });
  return h;
}
// a row of molecule instances [{f, w}] centred at (cx, cy) in a box of width maxW; look(i, j) -> {dash, op}; aop(i) -> opacity
function rowSVG(ms, cx, cy, maxW, look, aop){
  var x = 0, items = [], h = "";
  ms.forEach(function(m, i){
    if (i > 0) { if (ms[i - 1].f !== m.f) { items.push({ plus:x + 11 }); x += 22; } else x += 14; }
    var e = ext(m.f); items.push({ i:i, ox:x - e.mn, mid:x + e.w / 2 }); x += e.w;
  });
  var s = Math.min(1, maxW / x), x0 = cx - x * s / 2;
  h += '<g transform="translate(' + r1(x0) + " " + cy + ") scale(" + Math.round(s * 1000) / 1000 + ')">';
  items.forEach(function(it){
    if (it.plus != null) { h += T(it.plus, 0, "+", { fs:18, w:700, c:"var(--ink-2)" }); return; }
    var m = ms[it.i];
    h += molSVG(m.f, it.ox, 0, function(j){ return look(it.i, j); }, aop(it.i));
    if (m.w < 1) h += T(it.mid, -34, "½ ×", { fs:12, w:700, c:"var(--ink-2)" });
  });
  return h + "</g>";
}

// ---------- reactions (Explore R1–R6) ----------
var RX = {
  r1:{ L:[["H2", 1], ["Cl2", 1]], R:[["HCl", 2]], tbl:[["HCl(g)", 2]] },
  r2:{ L:[["H2", 2], ["O2", 1]], R:[["H2O", 2]], tbl:[["H2O(g)", 2]] },
  r3:{ L:[["CH4", 1], ["O2", 2]], R:[["CO2", 1], ["H2O", 2]], tbl:[["CO2(g)", 1], ["H2O(g)", 2], ["CH4(g)", -1]] },
  r4:{ L:[["N2", 1], ["H2", 3]], R:[["NH3", 2]], tbl:[["NH3(g)", 2]] },
  r5:{ L:[["CH4", 1], ["Cl2", 1]], R:[["CH3Cl", 1], ["HCl", 1]], tbl:null },
  r6:{ L:[["C2H6", 1], ["O2", 3.5]], R:[["CO2", 2], ["H2O", 3]], tbl:[["CO2(g)", 2], ["H2O(g)", 3], ["C2H6(g)", -1]] }
};
function expand(side){ var out = []; side.forEach(function(m){ var w = Math.floor(m[1]); for (var i = 0; i < w; i++) out.push({ f:m[0], w:1 }); if (m[1] - w > 0.01) out.push({ f:m[0], w:m[1] - w }); }); return out; }
function bondsOf(ms){ var out = []; ms.forEach(function(m, i){ var L = LAY[m.f]; L.b.forEach(function(b, j){ out.push({ id:i + "-" + j, mi:i, bi:j, k:L.co2 ? CO2K : bkey(L.a[b[0]][0], L.a[b[1]][0], b[2]), w:m.w }); }); }); return out; }
function sum(bs){ return bs.reduce(function(s, b){ return s + BE[b.k] * b.w; }, 0); }
function groups(bs){ var g = [], ix = {}; bs.forEach(function(b){ if (ix[b.k] == null) { ix[b.k] = g.length; g.push({ k:b.k, n:0 }); } g[ix[b.k]].n += b.w; }); return g; }
function rx(id){
  var R = RX[id]; if (R.ms) return R;
  R.ms = expand(R.L); R.ps = expand(R.R); R.bb = bondsOf(R.ms); R.fb = bondsOf(R.ps); R.sb = sum(R.bb); R.sf = sum(R.fb); R.est = Math.round(R.sb - R.sf);
  R.tv = R.tbl ? r1(R.tbl.reduce(function(s, t){ return s + t[1] * HF[t[0]]; }, 0)) : null;
  R.types = []; R.bb.concat(R.fb).forEach(function(b){ var k = b.k === CO2K ? CO2K : b.k; if (R.types.indexOf(k) < 0) R.types.push(k); });
  return R;
}
function listTxt(g){ return g.length ? g.map(function(x){ return cnt(x.n) + " " + bLab(x.k); }).join(", ") : "none yet"; }
function sumTxt(g, tot){
  if (!g.length) return "0 kJ";
  var terms = g.map(function(x){ return x.n === 1 ? String(BE[x.k]) : cnt(x.n) + "(" + BE[x.k] + ")"; });
  return (terms.length === 1 && g[0].n === 1 ? "" : terms.join(" + ") + " = ") + fx(tot) + " kJ";
}

// ---------- @component C4 energyLevels — three levels (separate atoms, reactants, products), energy-in bar (--ink-2 hatched)
// rising from the reactants, energy-out bar (--ink) dropping from the atoms, orange ΔH arrow (--en-dh) ----------
// diagSVG({sb, sf, inNow, outNow, arrow, hid}) -> svg inner html (viewBox 0 0 320 272)
function diagSVG(o){
  if (!(o.sb > 0) || !(o.sf > 0)) return T(160, 136, "Fill in the tally to draw the diagram.", { fs:14, c:"var(--ink-2)" });
  var top = 42, span = 186, k = span / Math.max(o.sb, o.sf), yA = top, yR = top + o.sb * k, yP = top + o.sf * k, h = "";
  h += '<defs><pattern id="' + o.hid + '" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)"><rect width="7" height="7" fill="var(--sheet)"/><line x1="0" y1="0" x2="0" y2="7" stroke="var(--ink-2)" stroke-width="2.4"/></pattern></defs>';
  h += Ln(12, yA, 308, yA, { w:2 }) + T(12, yA - 15, "Separate atoms", { fs:13, w:700, a:"start" });
  var hi = Math.max(0, o.inNow) * k, ho = Math.max(0, o.outNow) * k;
  if (hi > 0.5) h += '<rect x="44" y="' + r1(yR - hi) + '" width="40" height="' + r1(hi) + '" fill="url(#' + o.hid + ')" stroke="var(--ink-2)" stroke-width="1.6"/>' + T(90, yR - hi / 2, "+" + fx(o.inNow), { fs:13, w:700, a:"start", halo:true });
  if (ho > 0.5) h += '<rect x="214" y="' + r1(yA) + '" width="40" height="' + r1(ho) + '" fill="var(--ink)"/>' + T(208, yA + ho / 2, M + fx(o.outNow), { fs:13, w:700, a:"end", halo:true });
  h += Ln(12, yR, 150, yR, { w:2.8 }) + T(12, yR + 14, "Reactants", { fs:13, w:700, a:"start", halo:true });
  h += Ln(170, yP, 308, yP, { w:2.8 }) + T(308, yP + 14, "Products", { fs:13, w:700, a:"end", halo:true });
  if (o.arrow) {
    var dh = o.sb - o.sf, d = yP > yR ? 1 : -1, x = 160;
    if (Math.abs(yP - yR) > 9) h += Ln(x, yR, x, yP - d * 8, { c:"var(--en-dh)", w:3.2 });
    h += '<path d="M' + (x - 6) + " " + r1(yP - d * 10) + " L" + x + " " + r1(yP) + " L" + (x + 6) + " " + r1(yP - d * 10) + ' Z" fill="var(--en-dh)"/>';
    h += T(x, Math.max(yR, yP) + 30, "Δ<tspan font-style=\"italic\">H</tspan> ≈ " + sg(dh) + " kJ", { fs:14, w:700, c:"var(--en-dh)", halo:true });
  }
  return h;
}
function diagAria(name, sb, sf, arrow){ return "Energy diagram for " + name + ": " + fx(sb) + " kJ in, " + fx(sf) + " kJ out" + (arrow ? ", ΔH " + sg(sb - sf) + " kJ." : "."); }

// ---------- hero: H₂ + Cl₂ → 2HCl ----------
function heroSVG(s){
  var h = "", k = 196 / 864, yA = 40, yR = yA + 679 * k, yP = yA + 864 * k;
  function P(a, b, t){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
  var dx = lerp(-150, 0, s.fl), hA = P(P([62, 78], [36, 66], s.b1), [120, 92], s.mv), hB = P(P([92, 78], [118, 66], s.b1), [120, 178], s.mv),
    cA = P(P([58, 168], [26, 182], s.b2), [154, 92], s.mv), cB = P(P([94, 168], [126, 182], s.b2), [154, 178], s.mv);
  hA[0] += dx; hB[0] += dx; cA[0] += dx; cB[0] += dx;
  var lk = function(op, d){ return { op:op, dash:d }; };
  if (s.b1 < 1) h += bondLines(hA[0], hA[1], hB[0], hB[1], 1, lk(1 - s.b1));
  if (s.b2 < 1) h += bondLines(cA[0], cA[1], cB[0], cB[1], 1, lk(1 - s.b2));
  if (s.f1 > 0) h += bondLines(hA[0], hA[1], cA[0], cA[1], 1, lk(s.f1));
  if (s.f2 > 0) h += bondLines(hB[0], hB[1], cB[0], cB[1], 1, lk(s.f2));
  h += ballSVG("H", hA[0], hA[1]) + ballSVG("H", hB[0], hB[1]) + ballSVG("Cl", cA[0], cA[1]) + ballSVG("Cl", cB[0], cB[1]);
  if (s.fl > 0.5 && s.mv < 0.5) h += T(77 + dx, 46, "H₂", { fs:13, w:700, op:1 - s.mv * 2 }) + T(76 + dx, 212, "Cl₂", { fs:13, w:700, op:1 - s.mv * 2 });
  if (s.f2 > 0.5) h += T(137, 212, "2HCl", { fs:13, w:700, op:s.f2 });
  // energy diagram
  var hid = "be-hh";
  h += '<defs><pattern id="' + hid + '" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)"><rect width="7" height="7" fill="var(--sheet)"/><line x1="0" y1="0" x2="0" y2="7" stroke="var(--ink-2)" stroke-width="2.4"/></pattern></defs>';
  h += Ln(224, yA, 432, yA, { w:1.8 }) + T(224, yA - 14, "atoms", { fs:12, w:700, a:"start" }) + Ln(224, yR, 330, yR, { w:2.6 }) + T(224, yR + 14, "H₂ + Cl₂", { fs:12, w:700, a:"start" }) + Ln(340, yP, 432, yP, { w:2.6 }) + T(432, yP + 14, "2HCl", { fs:12, w:700, a:"end" });
  var inV = 436 * s.b1 + 243 * s.b2, outV = 432 * s.f1 + 432 * s.f2;
  if (inV > 2) h += '<rect x="244" y="' + r1(yR - inV * k) + '" width="34" height="' + r1(inV * k) + '" fill="url(#' + hid + ')" stroke="var(--ink-2)" stroke-width="1.5"/>' + T(284, yR - inV * k / 2, "+" + fx(inV), { fs:12, w:700, a:"start", halo:true });
  if (outV > 2) h += '<rect x="380" y="' + yA + '" width="34" height="' + r1(outV * k) + '" fill="var(--ink)"/>' + T(374, yA + outV * k / 2, M + fx(outV), { fs:12, w:700, a:"end", halo:true });
  if (s.dh > 0) {
    h += "<g" + opA(s.dh) + ">" + Ln(335, yR, 335, yP - 8, { c:"var(--en-dh)", w:3 }) + '<path d="M329 ' + r1(yP - 10) + " L335 " + r1(yP) + " L341 " + r1(yP - 10) + ' Z" fill="var(--en-dh)"/>' +
      T(335, yP + 34, M + "185 kJ: more out than in", { fs:13, w:700, c:"var(--en-dh)", halo:true }) + "</g>";
  }
  return h;
}
function hero(){
  var svg = $("#be-hx-svg"), cap = $("#be-hx-cap"), rep = $("#be-hx-replay"); if (!svg) return;
  var s = null, run = 0, tw = null;
  function draw(){ svg.innerHTML = heroSVG(s); }
  function fin(){ s = { fl:1, b1:1, b2:1, mv:1, f1:1, f2:1, dh:1 }; draw(); cap.textContent = "679 kJ in to break H–H and Cl–Cl; 864 kJ out to form two H–Cl. ΔH ≈ −185 kJ: more out than in."; rep.hidden = false; }
  function play(){
    var id = ++run; if (tw) { tw(); tw = null; } rep.hidden = true;
    s = { fl:0, b1:0, b2:0, mv:0, f1:0, f2:0, dh:0 }; draw();
    var L = [
      { cap:"H₂ and Cl₂ molecules float in.", k:"fl", dur:900, pause:400 },
      { cap:"Breaking H–H takes energy in: +436 kJ.", k:"b1", dur:800, pause:300 },
      { cap:"Breaking Cl–Cl takes more in: +243 kJ (679 kJ in all).", k:"b2", dur:800, pause:500 },
      { cap:"The four atoms drift and pair up.", k:"mv", dur:1100, pause:100 },
      { cap:"Forming H–Cl gives energy out: −432 kJ.", k:"f1", dur:700, pause:250 },
      { cap:"A second H–Cl: −432 kJ more (864 kJ out in all).", k:"f2", dur:700, pause:400 },
      { cap:"ΔH ≈ 679 − 864 = −185 kJ: more out than in.", k:"dh", dur:500, pause:600 }
    ], i = 0;
    (function next(){
      if (id !== run) return;
      if (i >= L.length) { fin(); return; }
      var it = L[i++]; cap.textContent = it.cap;
      tw = MV.tween({ dur:it.dur, step:function(t){ if (id !== run) return; s[it.k] = t; draw(); }, done:function(){ tw = null; if (id === run) MV.wait(it.pause, next); } });
    })();
  }
  rep.addEventListener("click", function(){ if (MV.reduceMotion) fin(); else play(); });
  if (MV.reduceMotion) fin(); else play();
}

// ---------- C13 bond-energy table pop-up (course table + the CO₂ row) ----------
function bondRows(){ var rows = []; D.bond.forEach(function(r){ rows.push([r[0], String(r[1])]); if (r[0] === "C=O") rows.push(["C=O in CO₂", String(BE[CO2K])]); }); return rows; }
function bondTableHTML(hl){ var rows = bondRows(), hi = -1; rows.forEach(function(r, i){ if (hl && r[0] === "C=O in CO₂") hi = i; }); return MV.tableHTML({ head:["Bond", "Energy (kJ/mol)"], rows:rows, hiRow:hi, caption:"Average bond energies (kJ/mol)" }); }

// ---------- Explore: Break and make ----------
function explore(host, api){
  var C = api.content, S = api.S, m = C.msgs, busy = false, tw = null, disp = { i:0, o:0 }, hid = "be-hat" + (++UID);
  if (["guided", "tally", "compare"].indexOf(S.mode) < 0) S.mode = "guided";
  if (!RX[S.rx]) S.rx = "r1";
  if (!S.g || typeof S.g !== "object") S.g = {};
  if (!S.t || typeof S.t !== "object") S.t = {};
  if (!S.fu || typeof S.fu !== "object") S.fu = { h2:"", ch4:"", pick:"" };
  var RXN = {}; C.rxns.forEach(function(r){ RXN[r.id] = r; });
  function gst(id){ var g = S.g[id]; if (!g || typeof g !== "object") g = S.g[id] = {}; if (!g.brk || typeof g.brk !== "object") g.brk = {}; g.nf = Math.max(0, Math.min(rx(id).fb.length, g.nf | 0)); return g; }
  function tal(id){ var t = S.t[id]; if (!t || typeof t !== "object") t = S.t[id] = {}; t.b = t.b || {}; t.f = t.f || {}; ["my", "x", "dh"].forEach(function(k){ if (typeof t[k] !== "string") t[k] = ""; }); return t; }

  host.innerHTML = '<p class="how be-how">' + C.how + '</p><div class="be-modes"></div><div class="be-rxc"></div>' +
    '<p class="be-eq" aria-live="polite"></p><div class="be-picw"><svg class="be-pic" viewBox="0 0 560 196" role="img" aria-label=""></svg></div>' +
    '<div class="be-grid" data-mv="graph"><div class="be-left"><p class="banner" data-mv="banner" aria-live="polite"></p><svg class="be-dg" viewBox="0 0 320 272" role="img" aria-label=""></svg>' +
    '<p class="be-leg tiny"><span class="be-sw be-sw-in" aria-hidden="true"></span>Energy in (breaking bonds) <span class="be-sw be-sw-out" aria-hidden="true"></span>Energy out (forming bonds) <span class="be-sw be-sw-dh" aria-hidden="true"></span>Δ<i>H</i></p>' +
    '<p class="be-cap" aria-live="polite"></p><p class="be-note" aria-live="polite"></p></div>' +
    '<div class="be-right"><div class="be-panel"></div><h4 class="be-h4">Readout</h4><dl class="read be-read" aria-live="polite"></dl></div></div>' +
    '<div class="be-fuel"></div><div class="be-tabw"></div>';
  var pic = $(".be-pic", host), dg = $(".be-dg", host), panel = $(".be-panel", host), readEl = $(".be-read", host), capEl = $(".be-cap", host), noteEl = $(".be-note", host), eqEl = $(".be-eq", host);
  var RG = {};
  RG.mode = radios($(".be-modes", host), { label:"Mode", aria:"Break and make mode", options:C.modes, value:S.mode, onChange:function(v){ if (busy) return; S.mode = v; changed(true); } });
  RG.rx = radios($(".be-rxc", host), { label:"Reaction", aria:"Reaction", cls:"chips", options:C.rxns.map(function(r){ return { id:r.id, t:r.id.toUpperCase() }; }), value:S.rx, onChange:function(v){ if (busy) return; S.rx = v; S.note = false; changed(true); } });
  // bond table pop-up
  var tabW = $(".be-tabw", host);
  tabW.innerHTML = '<details class="chem-tab be-tab"><summary>Course data table: average bond energies (kJ/mol)</summary><div class="be-tabin"></div></details>';
  var tabD = $(".be-tab", tabW);
  function paintTab(){ $(".be-tabin", tabW).innerHTML = bondTableHTML(!!S.hl) + '<p class="tiny muted be-tabn">' + D.bondNote + " Bond energies are averages for gases.</p>"; }

  function targets(){
    var R = rx(S.rx);
    if (S.mode === "guided") { var g = gst(S.rx); return { i:sum(R.bb.filter(function(b){ return g.brk[b.id]; })), o:sum(R.fb.slice(0, g.nf)) }; }
    if (S.mode === "compare") return { i:R.sb, o:R.sf };
    var ts = tallySums(); return { i:ts.sb || 0, o:ts.sf || 0 };
  }
  function tallySums(){
    var R = rx(S.rx), t = tal(S.rx), x = pn(t.x), sb = 0, sf = 0, gb = [], gf = [], miss = false;
    R.types.forEach(function(k){
      var e = t.my === k ? x : BE[k], nb = pn(t.b[k]) || 0, nf = pn(t.f[k]) || 0;
      if (t.my === k && e == null && (nb || nf)) miss = true;
      if (nb) { gb.push({ k:k, n:nb, e:e }); sb += nb * (e || 0); }
      if (nf) { gf.push({ k:k, n:nf, e:e }); sf += nf * (e || 0); }
    });
    return { sb:miss ? null : r1(sb), sf:miss ? null : r1(sf), gb:gb, gf:gf, miss:miss };
  }
  function tTxt(g){ return g.length ? g.map(function(x){ return cnt(x.n) + " " + bLab(x.k); }).join(", ") : "none yet"; }
  function tSum(g, tot){
    if (!g.length) return "0 kJ";
    var terms = g.map(function(x){ var e = x.e == null ? "<i>x</i>" : fx(x.e); return x.n === 1 ? e : cnt(x.n) + "(" + e + ")"; });
    return (terms.length === 1 && g[0].n === 1 && tot != null ? "" : terms.join(" + ") + (tot != null ? " = " : "")) + (tot != null ? fx(tot) + " kJ" : "");
  }

  function paintPic(){
    var R = rx(S.rx), g = gst(S.rx), guided = S.mode === "guided";
    var formedMol = {}; R.fb.slice(0, g.nf).forEach(function(b){ formedMol[b.mi] = true; });
    var fIdx = {}; R.fb.forEach(function(b, i){ fIdx[b.mi + "-" + b.bi] = i; });
    var h = T(10, 13, "Reactants", { fs:12, w:700, a:"start", c:"var(--ink-2)" }) + T(10, 109, "Products", { fs:12, w:700, a:"start", c:"var(--ink-2)" });
    h += rowSVG(R.ms, 290, 58, 500, function(i, j){ return guided && g.brk[i + "-" + j] ? { dash:"3 5", op:0.35 } : { op:1 }; }, function(){ return 1; });
    h += rowSVG(R.ps, 290, 152, 500, function(i, j){ return !guided || fIdx[i + "-" + j] < g.nf ? { op:1 } : { dash:"2 5", op:0.3 }; }, function(i){ return !guided || formedMol[i] ? 1 : 0.35; });
    pic.innerHTML = h;
    var nb = R.bb.filter(function(b){ return g.brk[b.id]; }).length;
    pic.setAttribute("aria-label", "Structures for " + RXN[S.rx].id.toUpperCase() + ". Reactants: " + listTxt(groups(R.bb)) + ". Products: " + listTxt(groups(R.fb)) + "." + (guided ? " " + nb + " of " + R.bb.length + " reactant bonds broken; " + g.nf + " of " + R.fb.length + " product bonds formed." : ""));
    eqEl.innerHTML = CF(RXN[S.rx].t.replace(/^R\d: /, "")) + (RXN[S.rx].note ? ' <span class="tiny muted">(' + RXN[S.rx].note + ")</span>" : "");
  }
  function paintDiag(){
    var R = rx(S.rx), name = S.rx.toUpperCase(), o;
    if (S.mode === "tally") { var ts = tallySums(); o = { sb:ts.sb, sf:ts.sf, inNow:disp.i, outNow:disp.o, arrow:ts.sb > 0 && ts.sf > 0, hid:hid }; }
    else { var g = gst(S.rx), done = S.mode === "compare" || (R.bb.every(function(b){ return g.brk[b.id]; }) && g.nf === R.fb.length); o = { sb:R.sb, sf:R.sf, inNow:disp.i, outNow:disp.o, arrow:done && Math.abs(disp.o - R.sf) < 1, hid:hid }; }
    dg.innerHTML = diagSVG(o);
    dg.setAttribute("aria-label", o.sb > 0 && o.sf > 0 ? diagAria(name, o.arrow ? o.sb : disp.i, o.arrow ? o.sf : disp.o, o.arrow) : "Energy diagram: fill in the tally to draw it.");
  }
  function paintRead(){
    var R = rx(S.rx), L = C.rows, rows = [];
    if (S.mode === "tally") {
      var ts = tallySums(), t = tal(S.rx), dh = pn(t.dh);
      rows.push([L[0], tTxt(ts.gb)], [L[1], tSum(ts.gb, ts.sb)], [L[2], tTxt(ts.gf)], [L[3], tSum(ts.gf, ts.sf)]);
      rows.push([L[4], dh == null ? '<span class="muted">Enter Σ(broken) − Σ(formed) below.</span>' : "Your entry: " + sg(dh) + " kJ (" + (dh < 0 ? "exothermic" : dh > 0 ? "endothermic" : "no change") + ")"]);
    } else {
      var g = gst(S.rx), guided = S.mode === "guided", bb = guided ? R.bb.filter(function(b){ return g.brk[b.id]; }) : R.bb, fb = guided ? R.fb.slice(0, g.nf) : R.fb;
      var gb = groups(bb), gf = groups(fb), sb = sum(bb), sf = sum(fb), done = bb.length === R.bb.length && fb.length === R.fb.length;
      rows.push([L[0], listTxt(gb)], [L[1], sumTxt(gb, sb)], [L[2], listTxt(gf)], [L[3], sumTxt(gf, sf)]);
      rows.push([L[4], done ? fx(sb) + " − " + fx(sf) + " = <strong>" + sg(R.est) + " kJ</strong> (" + (R.est < 0 ? "exothermic" : "endothermic") + ")" : '<span class="muted">Break every reactant bond and form every product bond to see it.</span>']);
      if (S.mode === "compare") {
        rows.push([L[5], R.tv == null ? C.noTable : sg(R.tv) + " kJ (from Δ<i>H</i>°<sub>f</sub>)"]);
        rows.push([L[6], R.tv == null ? "—" : fx(Math.abs(r1(R.est - R.tv))) + " kJ"]);
      }
    }
    readEl.innerHTML = MV.readoutHTML(rows);
  }
  function paintPanel(){
    var R = rx(S.rx), h = "";
    if (S.mode === "guided") {
      var g = gst(S.rx), allB = R.bb.every(function(b){ return g.brk[b.id]; }), next = R.fb[g.nf];
      h += '<p class="tiny muted be-ph">Tap each reactant bond to break it.</p><div class="be-bonds" role="group" aria-label="Reactant bonds">';
      R.ms.forEach(function(mo, i){
        h += '<span class="be-bg"><span class="be-bgl">' + (mo.w < 1 ? "½ " : "") + CF(NAMEF[mo.f]) + "</span>";
        R.bb.filter(function(b){ return b.mi === i; }).forEach(function(b){
          var on = !!g.brk[b.id], e = BE[b.k] * b.w;
          h += '<button type="button" class="be-bd' + (on ? " done" : "") + '" data-bd="' + b.id + '" data-k="bd' + b.id + '"' + (on || busy ? " disabled" : "") + ' aria-label="' + esc(on ? b.k + " bond broken: " + fx(e) + " kJ in" : "Break a" + (b.w < 1 ? " half" : "n") + " " + b.k + " bond, " + fx(e) + " kJ") + '">' + b.k + ' <span class="be-bv">' + (on ? "+" : "") + fx(e) + "</span></button>";
        });
        h += "</span>";
      });
      h += '</div><div class="be-frow"><button type="button" class="btn primary sm be-form" data-k="beform"' + (!allB || !next || busy ? " disabled" : "") + ">" + (next ? m.formNext + ": " + bLab(next.k) + " (" + M + fx(BE[next.k]) + ")" : m.allDone) + '</button><button type="button" class="btn ghost sm be-reset" data-k="bereset"' + (busy ? " disabled" : "") + ">" + m.reset + "</button></div>" +
        (!allB ? '<p class="tiny muted be-ph">' + m.breakFirst + "</p>" : "");
    } else if (S.mode === "tally") {
      var t = tal(S.rx), T2 = m.tally;
      h += '<p class="tiny muted be-ph">' + T2.hint + '</p><div class="tbl-wrap be-tw"><table class="vt be-tt"><caption class="vh">Bond tally for ' + S.rx.toUpperCase() + "</caption><thead><tr>" + T2.head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
        R.types.map(function(k){
          return '<tr><th scope="row">' + bLab(k) + "</th><td>" + (t.my === k ? "<i>x</i>" : BE[k]) + "</td>" + ["b", "f"].map(function(sd){
            return '<td><input class="numin be-tin" type="text" inputmode="decimal" autocomplete="off" data-tk="' + esc(k) + '" data-sd="' + sd + '" data-k="t' + sd + esc(k) + '" aria-label="' + esc(bLab(k) + " bonds " + (sd === "b" ? "broken" : "formed")) + '" value="' + esc(t[sd][k] || "") + '"' + (busy ? " disabled" : "") + "></td>";
          }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>" +
        '<div class="be-my"></div><div class="be-inrow"><label for="be-x' + hid + '">' + T2.x + '</label><input class="numin be-x" id="be-x' + hid + '" type="text" inputmode="decimal" autocomplete="off" data-k="bex" value="' + esc(t.x) + '"' + (busy ? " disabled" : "") + '><span class="m">kJ/mol</span></div>' +
        '<div class="be-inrow"><label for="be-dh' + hid + '">' + T2.dh + '</label><input class="numin be-dhin" id="be-dh' + hid + '" type="text" autocomplete="off" data-k="bedh" value="' + esc(t.dh) + '"' + (busy ? " disabled" : "") + '><span class="m">kJ</span></div>';
    } else {
      h += '<p class="tiny muted be-ph">The estimate uses the course bond energies; the table value uses Δ<i>H</i>°<sub>f</sub> values from the course table (module 28).</p>';
    }
    MV.keepFocus(panel, function(){ panel.innerHTML = h; });
    if (S.mode === "tally") {
      var t3 = tal(S.rx);
      radios($(".be-my", panel), { label:m.tally.mystery, aria:m.tally.mystery, cls:"chips", options:[{ id:"", t:m.tally.none }].concat(R.types.map(function(k){ return { id:k, t:bLab(k) }; })), value:t3.my,
        onChange:function(v){ if (busy) return; t3.my = v; api.save(); paintPanelKeep(); live(); MV.changed(); } });
    }
  }
  function paintPanelKeep(){ var a = document.activeElement, k = a && a.dataset ? a.dataset.k : null; paintPanel(); if (k) { var b = panel.querySelector('[data-k="' + k + '"]'); if (b) b.focus({ preventScroll:true }); } }
  function paintFuel(){
    var F = m.fuel, fu = S.fu, el = $(".be-fuel", host);
    if (!el.dataset.built) {
      el.dataset.built = "1";
      el.innerHTML = '<h4 class="be-h4">' + F.title + '</h4><div class="be-inrow"><label for="be-fh' + hid + '">' + F.h2 + '</label><input class="numin" id="be-fh' + hid + '" data-fu="h2" type="text" autocomplete="off" data-k="fuh2"><span class="m">' + F.unit + "</span></div>" +
        '<div class="be-inrow"><label for="be-fc' + hid + '">' + F.ch4 + '</label><input class="numin" id="be-fc' + hid + '" data-fu="ch4" type="text" autocomplete="off" data-k="fuch4"><span class="m">' + F.unit + '</span></div><div class="be-fpick"></div>';
      $("#be-fh" + hid, el).value = fu.h2; $("#be-fc" + hid, el).value = fu.ch4;
      RG.fuel = radios($(".be-fpick", el), { label:F.pick, aria:F.pick, cls:"chips", options:F.opts, value:fu.pick, onChange:function(v){ fu.pick = v; api.save(); MV.changed(); } });
    }
    $$("input", el).forEach(function(i){ i.disabled = busy; }); if (RG.fuel) RG.fuel.lock(busy);
  }
  function live(){ paintPic(); paintDiag(); paintRead(); }
  function paintAll(){
    RG.mode.set(S.mode); RG.rx.set(S.rx); RG.mode.lock(busy); RG.rx.lock(busy);
    noteEl.textContent = S.note && S.rx === "r6" && S.mode === "compare" ? C.p4note : ""; noteEl.classList.toggle("on", !!noteEl.textContent);
    paintPanel(); live(); paintFuel(); paintTab();
  }
  function snap(){ if (tw) { tw(); tw = null; } var t = targets(); disp.i = t.i; disp.o = t.o; }
  function changed(resetCap){ snap(); if (resetCap) capEl.textContent = ""; api.save(); paintAll(); MV.changed(); }
  function animTo(dur, cb){
    if (tw) tw();
    var t = targets(), fi = disp.i, fo = disp.o;
    tw = MV.tween({ dur:dur || 650, step:function(k){ disp.i = lerp(fi, t.i, k); disp.o = lerp(fo, t.o, k); paintDiag(); }, done:function(){ tw = null; disp.i = t.i; disp.o = t.o; paintDiag(); paintRead(); if (cb) cb(); } });
  }
  function doneCap(){ var R = rx(S.rx); return "Δ<i>H</i> ≈ " + fx(R.sb) + " − " + fx(R.sf) + " = " + sg(R.est) + " kJ: " + (R.est < 0 ? "more out than in, so exothermic." : "more in than out, so endothermic."); }
  function breakBond(id){
    var R = rx(S.rx), g = gst(S.rx), b = R.bb.filter(function(x){ return x.id === id; })[0]; if (!b || g.brk[id]) return;
    g.brk[id] = 1; api.save();
    capEl.textContent = "Breaking " + (b.w < 1 ? "half an " : "") + b.k + " takes " + fx(BE[b.k] * b.w) + " kJ in.";
    paintPanel(); paintPic(); paintRead(); animTo(); MV.changed();
    var nx = panel.querySelector(".be-bd:not([disabled])") || panel.querySelector(".be-form:not([disabled])"); if (nx) nx.focus({ preventScroll:true });
  }
  function formBond(){
    var R = rx(S.rx), g = gst(S.rx), b = R.fb[g.nf]; if (!b) return;
    g.nf++; api.save();
    paintPanel(); paintPic(); paintRead();
    capEl.innerHTML = g.nf === R.fb.length ? doneCap() : "Forming " + bLab(b.k) + " gives " + fx(BE[b.k]) + " kJ out.";
    animTo(); MV.changed();
    var f = panel.querySelector(".be-form:not([disabled])") || panel.querySelector(".be-reset"); if (f) f.focus({ preventScroll:true });
  }
  panel.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.bd) breakBond(b.dataset.bd);
    else if (b.classList.contains("be-form")) formBond();
    else if (b.classList.contains("be-reset")) { S.g[S.rx] = { brk:{}, nf:0 }; changed(true); var f = panel.querySelector(".be-bd"); if (f) f.focus({ preventScroll:true }); }
  });
  panel.addEventListener("input", function(e){
    var el = e.target, t = tal(S.rx);
    if (el.dataset.tk) t[el.dataset.sd][el.dataset.tk] = el.value;
    else if (el.classList.contains("be-x")) t.x = el.value;
    else if (el.classList.contains("be-dhin")) t.dh = el.value;
    else return;
    api.save(); snap(); live(); MV.changed();
  });
  $(".be-fuel", host).addEventListener("input", function(e){ var k = e.target.dataset.fu; if (!k) return; S.fu[k] = e.target.value; api.save(); MV.changed(); });

  var hooks = {
    start:function(p){
      if (tw) { tw(); tw = null; }
      S.hl = false; S.note = false; tabD.open = false;
      if (p.id === "p1") { S.rx = "r1"; S.mode = "guided"; S.g.r1 = { brk:{}, nf:0 }; }
      else if (p.id === "p2") { S.rx = "r1"; S.mode = "guided"; S.g.r1 = { brk:{ "0-0":1, "1-0":1 }, nf:0 }; }
      else if (p.id === "p3") { S.rx = "r3"; S.mode = "guided"; var br = {}; rx("r3").bb.forEach(function(b){ br[b.id] = 1; }); S.g.r3 = { brk:br, nf:0 }; }
      else { S.rx = "r6"; S.mode = "compare"; }
      busy = true; snap(); capEl.textContent = C.predSetup[p.id] || ""; api.save(); paintAll();
    },
    run:function(p, done){
      function end(msg){ busy = false; capEl.innerHTML = msg; api.save(); paintAll(); MV.changed(); done(); }
      var g;
      if (p.id === "p1") { g = gst("r1"); g.brk["0-0"] = 1; paintPanel(); paintPic(); paintRead(); capEl.textContent = "Breaking H–H…"; animTo(1100, function(){ end("Breaking H–H takes 436 kJ in: the energy-in bar rises by 436."); }); return; }
      if (p.id === "p2") {
        g = gst("r1"); g.nf = 1; paintPic(); paintRead(); capEl.textContent = "Forming the first H–Cl: 432 kJ out.";
        animTo(900, function(){ MV.wait(250, function(){ g.nf = 2; paintPic(); paintRead(); capEl.textContent = "Forming the second H–Cl: 432 kJ more out."; animTo(900, function(){ end("864 kJ out vs 679 kJ in: the energy-out bar drops below the reactant level, and Δ<i>H</i> ≈ −185 kJ."); }); }); });
        return;
      }
      if (p.id === "p3") {
        S.hl = true; paintTab(); tabD.open = true;
        g = gst("r3"); g.nf = 2; paintPic(); paintRead(); capEl.textContent = "Forming the two C=O bonds in CO₂…";
        animTo(1100, function(){ end("C=O in CO₂: 799 kJ/mol each, the largest bond energy in this reaction (highlighted in the bond table below)."); });
        return;
      }
      S.note = true; noteEl.textContent = C.p4note;
      MV.wait(MV.reduceMotion ? 0 : 60, function(){ noteEl.classList.add("on"); MV.wait(MV.reduceMotion ? 0 : 900, function(){ end("Estimate −1406 kJ vs table −1428.4 kJ: close, not exact."); }); });
    }
  };

  function chal(id){
    var mm = m[id];
    if (id === "tc1") {
      var t = tal("r5"), K = ["C–H", "Cl–Cl", "C–Cl", "H–Cl"], b = {}, f = {}, any = false;
      K.forEach(function(k){ b[k] = pn(t.b[k]) || 0; f[k] = pn(t.f[k]) || 0; if (b[k] || f[k]) any = true; });
      var dh = pn(t.dh);
      if (!any && dh == null) return { ok:false, msg:mm.rx };
      function eq(x, y){ return K.every(function(k){ return Math.abs(x[k] - (y[k] || 0)) < 1e-9; }); }
      var A = eq(b, { "C–H":1, "Cl–Cl":1 }) && eq(f, { "C–Cl":1, "H–Cl":1 }), B = eq(b, { "C–H":4, "Cl–Cl":1 }) && eq(f, { "C–H":3, "C–Cl":1, "H–Cl":1 });
      if (b["C–H"] === 1 && f["C–H"] === 3) return { ok:false, msg:mm.m7 };
      if (dh != null && Math.abs(dh - 115) < 0.6) return { ok:false, msg:mm.m2 };
      var dOk = dh != null && Math.abs(dh + 115) < 0.6;
      if ((A || B) && dOk) return { ok:true };
      if (A || B) return { ok:false, msg:mm.tallyOnly };
      if (dOk) return { ok:false, msg:mm.dhOnly };
      return { ok:false, msg:mm.other };
    }
    if (id === "tc2") {
      var t2 = tal("r1"), x = pn(t2.x);
      if (t2.my !== "H–Cl" || x == null) return { ok:false, msg:mm.set };
      if (x >= 431 && x <= 433) return { ok:true };
      if (Math.abs(x - 863.6) <= 1) return { ok:false, msg:mm.two };
      if (Math.abs(x - 247.2) <= 1) return { ok:false, msg:mm.signs };
      return { ok:false, msg:mm.other };
    }
    var fu = S.fu, h = pn(fu.h2), c = pn(fu.ch4);
    if (fu.pick === "ch4") return { ok:false, msg:mm.ch4 };
    if (h != null && Math.abs(h + 241) <= 1) return { ok:false, msg:mm.h2mol };
    if ((h != null && h > 0) || (c != null && c > 0)) return { ok:false, msg:mm.sign };
    if (h == null || c == null || !fu.pick) return { ok:false, msg:mm.empty };
    if (Math.abs(h + 482) <= 1 && Math.abs(c + 401) <= 1 && fu.pick === "h2") return { ok:true };
    return { ok:false, msg:mm.other };
  }
  snap(); paintAll();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Why fuels release energy ----------
function fuelData(){
  var ethB = 5 * BE["C–H"] + BE["C–C"] + BE["C–O"] + BE["O–H"] + 3 * BE["O=O"], ethF = 4 * BE[CO2K] + 6 * BE["O–H"];
  var mm = D.M, mH2 = 2 * mm.H, mCH4 = mm.C + 4 * mm.H, mEt = 2 * mm.C + 6 * mm.H + mm.O;
  var F = [
    { id:"h2", f:"H2", dh:rx("r2").est / 2, mr:Math.round(mH2 * 10) / 10, mrT:MV.chem.fx(mH2, 1) },
    { id:"ch4", f:"CH4", dh:rx("r3").est, mr:Math.round(mCH4), mrT:MV.chem.fx(mCH4, 0) },
    { id:"eth", f:"C2H5OH", dh:ethB - ethF, mr:Math.round(mEt), mrT:MV.chem.fx(mEt, 0) }
  ];
  F.forEach(function(x){ x.pg = Number((Math.abs(x.dh) / x.mr).toPrecision(2)); });
  return F;
}
function s1SVG(inV, outV){
  var k = 150 / Math.max(inV, outV), base = 176, hid = "be-hs1", h = '<defs><pattern id="' + hid + '" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)"><rect width="7" height="7" fill="var(--sheet)"/><line x1="0" y1="0" x2="0" y2="7" stroke="var(--ink-2)" stroke-width="2.4"/></pattern></defs>';
  h += Ln(40, base, 480, base, { w:1.8 });
  h += '<rect x="120" y="' + r1(base - inV * k) + '" width="80" height="' + r1(inV * k) + '" fill="url(#' + hid + ')" stroke="var(--ink-2)" stroke-width="1.6"/>' + T(160, base - inV * k - 12, fx(inV) + " kJ in", { fs:14, w:700 });
  h += '<rect x="320" y="' + r1(base - outV * k) + '" width="80" height="' + r1(outV * k) + '" fill="var(--ink)"/>' + T(360, base - outV * k - 12, fx(outV) + " kJ out", { fs:14, w:700 });
  h += T(160, base + 16, "Breaking 4 C–H and 2 O=O", { fs:12.5 }) + T(360, base + 16, "Forming 2 C=O and 4 O–H", { fs:12.5 });
  return h;
}
function part3(host, api){
  var C = api.content, S = api.S, s1 = C.s1, s2 = C.s2, s3 = C.s3, R3 = rx("r3"), FU = fuelData();
  if (!S.rk || typeof S.rk !== "object") S.rk = { mol:[], g:[] };
  ["mol", "g"].forEach(function(k){ if (!Array.isArray(S.rk[k])) S.rk[k] = []; });
  if (!S.p3 || typeof S.p3 !== "object") S.p3 = {};
  var FN = { h2:"H2", ch4:"CH4", eth:"C2H5OH" };
  host.innerHTML =
    '<div class="be-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><svg class="be-s1" viewBox="0 0 520 200" role="img" aria-label="' + esc("Bar chart for burning methane: breaking 4 C–H and 2 O=O takes in " + fx(R3.sb) + " kJ; forming 2 C=O and 4 O–H gives out " + fx(R3.sf) + " kJ. The energy-out bar is taller.") + '">' + s1SVG(R3.sb, R3.sf) + '</svg><div class="be-s1c"></div></div>' +
    '<div class="part be-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="be-s2t"></div><div class="be-rk" data-rk="mol"></div><div class="be-rk" data-rk="g"></div><div class="be-rkn" aria-live="polite"></div></div>' +
    '<div class="part be-st"><h3>' + s3.title + '</h3><p>' + s3.text + '</p><div class="be-s3" data-g="benefit"></div><div class="be-s3" data-g="drawback"></div><details class="alg"><summary>' + s3.data + "</summary><p>" + s3.dataText + "</p></details></div>";
  // Station 1
  var s1c = $(".be-s1c", host);
  function paintS1(){
    var pick = S.p3.s1, h = '<div class="chips be-stm" role="group" aria-label="Statements">' + s1.stmts.map(function(x){ var on = pick === x.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-s1="' + x.id + '" data-k="s1' + x.id + '">' + x.t + "</button>"; }).join("") + "</div>";
    if (pick) {
      var inT = fx(R3.sb), outT = fx(R3.sf);
      var fb = pick === "a" ? "<strong>✓ Right.</strong> Breaking 4 C–H and 2 O=O takes in " + inT + " kJ; forming 2 C=O and 4 O–H gives out " + outT + " kJ. The products’ bonds are stronger, so more comes out than goes in."
        : pick === "b" ? "<strong>✗ Not quite.</strong> The bars show that breaking methane’s bonds takes in " + inT + " kJ. Breaking a bond always takes energy in. The energy a fuel gives out comes from the stronger bonds that <strong>form</strong> (" + outT + " kJ out)."
        : "<strong>✗ Not quite.</strong> Breaking oxygen’s O=O bonds also takes energy in (" + fx(2 * BE["O=O"]) + " kJ for two). The " + outT + " kJ comes out when the products’ bonds form.";
      h += MV.fbHTML(pick === "a" ? "good" : "bad", fb);
    }
    MV.keepFocus(s1c, function(){ s1c.innerHTML = h; });
  }
  s1c.addEventListener("click", function(e){ var b = e.target.closest("[data-s1]"); if (!b) return; S.p3.s1 = b.dataset.s1; api.save(); paintS1(); });
  // Station 2
  $(".be-s2t", host).innerHTML = MV.tableHTML({ head:s2.head, rows:FU.map(function(x){ return [CF(x.f), M + fx(Math.abs(x.dh)), x.mrT + " g/mol", "≈ " + x.pg + " kJ/g"]; }), caption:s2.title });
  var ORD = { mol:FU.slice().sort(function(a, b){ return Math.abs(b.dh) - Math.abs(a.dh); }).map(function(x){ return x.id; }), g:FU.slice().sort(function(a, b){ return b.pg - a.pg; }).map(function(x){ return x.id; }) };
  function rkOk(k){ var r = S.rk[k]; return r.length === 3 && r.every(function(id, i){ return id === ORD[k][i]; }); }
  function paintRk(k){
    var el = $('[data-rk="' + k + '"]', host), r = S.rk[k], full = r.length === 3, ok = rkOk(k);
    var h = '<p class="be-rkl"><strong>' + (k === "mol" ? s2.perMol : s2.perG) + '</strong></p><div class="chips" role="group" aria-label="' + esc(k === "mol" ? s2.perMol : s2.perG) + '">' +
      FU.map(function(x){ var i = r.indexOf(x.id); return '<button type="button" class="chip' + (i >= 0 ? " on" : "") + '" data-rf="' + x.id + '" data-k="rk' + k + x.id + '"' + (i >= 0 ? ' aria-pressed="true"' : ' aria-pressed="false"') + ">" + (i >= 0 ? (i + 1) + ". " : "") + CF(x.f) + "</button>"; }).join("") +
      '<button type="button" class="btn ghost sm" data-rc="1" data-k="rk' + k + 'c">' + s2.reset + "</button></div>";
    if (full) {
      var names = r.map(function(id){ return MV.plain(CF(FN[id])); }).join(", then ");
      h += ok ? MV.fbHTML("good", "<strong>✓ Right.</strong> " + (k === "mol" ? "Per mole: ethanol 1247, methane 802, hydrogen 241 kJ." : "Per gram: hydrogen ≈ 120, methane ≈ 50, ethanol ≈ 27 kJ/g."))
        : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> You ranked " + names + ". " + (k === "mol" ? "Compare the Δ<i>H</i> column (kJ per mol fuel)." : "Compare the energy-per-gram column. Per gram, divide by the molar mass.") + " Clear it and try again.");
    }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintNote(){ $(".be-rkn", host).innerHTML = rkOk("mol") && rkOk("g") ? '<p class="be-rev"><strong>The order reverses.</strong> Per gram, divide by the molar mass. Hydrogen releases less per mole than methane but far more per gram.</p>' : ""; }
  $$(".be-rk", host).forEach(function(el){
    el.addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b) return; var k = el.dataset.rk, r = S.rk[k];
      if (b.dataset.rc) S.rk[k] = [];
      else if (b.dataset.rf && r.indexOf(b.dataset.rf) < 0 && r.length < 3) r.push(b.dataset.rf);
      else return;
      api.save(); paintRk(k); paintNote();
    });
  });
  // Station 3
  function paintS3(g){
    var el = $('[data-g="' + g + '"]', host), G = s3[g], pick = S.p3[g], o = G.opts.filter(function(x){ return x.id === pick; })[0];
    var h = '<p class="be-rkl"><strong>' + G.label + '</strong></p><div class="chips" role="group" aria-label="' + esc(G.label) + '">' + G.opts.map(function(x){ var on = pick === x.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-s3="' + x.id + '" data-k="s3' + x.id + '">' + x.t + "</button>"; }).join("") + "</div>";
    if (o) h += MV.fbHTML(o.ok ? "good" : "bad", o.fb);
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  $$(".be-s3", host).forEach(function(el){ el.addEventListener("click", function(e){ var b = e.target.closest("[data-s3]"); if (!b) return; S.p3[el.dataset.g] = b.dataset.s3; api.save(); paintS3(el.dataset.g); }); });
  paintS1(); paintRk("mol"); paintRk("g"); paintNote(); paintS3("benefit"); paintS3("drawback");
  return {};
}

// ---------- Performance task: Between −100 and −200 (reaction tile × scale, live C4 diagram and bond tally) ----------
var TL = {
  hcl:{ b:[["H–H", 1], ["Cl–Cl", 1]], f:[["H–Cl", 2]] },
  nh3:{ b:[["N≡N", 1], ["H–H", 3]], f:[["N–H", 6]] },
  mcl:{ b:[["C–H", 1], ["Cl–Cl", 1]], f:[["C–Cl", 1], ["H–Cl", 1]] },
  c2h4:{ b:[["C=C", 1], ["H–H", 1]], f:[["C–C", 1], ["C–H", 2]] },
  c2h2:{ b:[["C≡C", 1], ["H–H", 2]], f:[["C–C", 1], ["C–H", 4]] },
  h2o:{ b:[["H–H", 2], ["O=O", 1]], f:[["O–H", 4]] }
};
function tsum(l, s){ return l.reduce(function(a, x){ return a + BE[x[0]] * x[1]; }, 0) * s; }
function tDH(id, s){ var t = TL[id]; return Math.round((tsum(t.b, 1) - tsum(t.f, 1)) * s * 10) / 10; }
var task = (function(){
  var S = null, api = null, TK = null, hid = "be-hat-task";
  function read(){ return { t:S && TL[S.t] ? S.t : "", s:S && ["0.5", "1", "2"].indexOf(S.s) >= 0 ? S.s : "" }; }
  function tile(id){ return TK.inputs.tiles.filter(function(x){ return x.id === id; })[0]; }
  function sLab(s){ return TK.inputs.scales.filter(function(x){ return x.id === s; })[0].t; }
  function paint(){
    var pv = $(".be-tkp"), d = read(); if (!pv) return;
    if (!d.t || !d.s) { pv.innerHTML = '<p class="tiny muted">Choose a reaction and a scale to see the diagram.</p>'; return; }
    var t = TL[d.t], s = +d.s, sb = tsum(t.b, s), sf = tsum(t.f, s), dh = tDH(d.t, s);
    var lst = function(l){ return l.map(function(x){ return cnt(x[1] * s) + " " + x[0]; }).join(", "); };
    pv.innerHTML = '<svg class="be-dg be-tkd" viewBox="0 0 320 272" role="img" aria-label="' + esc(diagAria(MV.plain(CF(tile(d.t).t)) + " at " + sLab(d.s), sb, sf, true)) + '">' + diagSVG({ sb:sb, sf:sf, inNow:sb, outNow:sf, arrow:true, hid:hid }) + "</svg>" +
      '<ul class="be-tkl"><li><strong>Bonds broken:</strong> ' + lst(t.b) + " = " + fx(sb) + " kJ</li><li><strong>Bonds formed:</strong> " + lst(t.f) + " = " + fx(sf) + " kJ</li><li><strong>Δ<i>H</i> ≈</strong> " + fx(sb) + " − " + fx(sf) + " = <strong>" + sg(dh) + " kJ</strong></li></ul>";
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; TK = MV.C.task;
      if (!TL[S.t]) S.t = ""; if (["0.5", "1", "2"].indexOf(S.s) < 0) S.s = "1";
      inp.innerHTML = '<div class="be-tk-t"></div><div class="be-tk-s"></div>';
      radios($(".be-tk-t", inp), { label:TK.inputs.tile, aria:TK.inputs.tile, cls:"chips", options:TK.inputs.tiles.map(function(x){ return { id:x.id, t:CF(x.t) }; }), value:S.t, onChange:function(v){ S.t = v; api.save(); paint(); api.update(); } });
      radios($(".be-tk-s", inp), { label:TK.inputs.scale, aria:TK.inputs.scale, options:TK.inputs.scales, value:S.s, onChange:function(v){ S.s = v; api.save(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="be-h4">Live energy diagram</h4><div class="be-tkp" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ return d.t && d.s ? true : "Choose a reaction and a scale."; },
    checks:function(d){
      if (!d.t || !d.s) return [false, false, false];
      var dh = tDH(d.t, +d.s), t = TL[d.t];
      return [dh >= -200 && dh <= -100, t.b.some(function(x){ return isMulti(x[0]); }), t.b.some(function(x){ return x[0] === "H–H"; })];
    },
    key:function(d){ return d.t + "|" + d.s; },
    label:function(k){ var p = k.split("|"); return CF(tile(p[0]).t) + " at " + sLab(p[1]) + " (" + sg(tDH(p[0], +p[1])) + " kJ)"; },
    text:function(k){ var p = k.split("|"); return MV.plain(CF(tile(p[0]).t)) + " at " + sLab(p[1]) + " (" + sg(tDH(p[0], +p[1])) + " kJ)"; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  task:task
});
})();
