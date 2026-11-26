// SCH4U 28 Standard Enthalpy of Formation: hero (C4 formation ladder for methane's combustion), Formation ladder (Explore:
// C4 ladder variant in Ladder, Build your own and Formation equation writer modes), Energy technologies (Part 3: fuel
// table and three rankings, power options, the lime kiln), ΔH°f calculations (custom number entry) and Fill the tank (task).
// Every ΔH°f value comes from MV.chem.data.dHf (elements in their standard states: 0).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function LIN(t){ return t; }
function obj(x){ return x && typeof x === "object" && !Array.isArray(x) ? x : {}; }
var D = MV.chem.data, CF = MV.chem.f, fx = MV.chem.fx;
var HFh = "Δ<i>H</i>°<sub>f</sub>", HRh = "Δ<i>H</i>°<sub>rxn</sub>", HCh = "Δ<i>H</i>°<sub>c</sub>";
var SPh = "Σ<i>n</i>" + HFh + "(products)", SRh = "Σ<i>n</i>" + HFh + "(reactants)";

// ---------- course data ----------
var HF = {}; D.dHf.forEach(function(r){ HF[r[0]] = r[1]; });
function hf(sp){ return HF[sp] != null ? HF[sp] : 0; }
function q2(v){ var x = Math.round(v * 100) / 100; return Math.abs(x) < 1e-9 ? 0 : x; }
function vf(v){ v = q2(v); return fx(v, Math.abs(v * 10 - Math.round(v * 10)) > 1e-6 ? 2 : 1); }   // −393.5 (true minus)
function sv(v){ v = q2(v); return (v > 0 ? "+" : "") + vf(v); }
var SUBS = "₀₁₂₃₄₅₆₇₈₉";
function uF(s){ return String(s).replace(/([A-Za-z)])(\d+)/g, function(_, a, d){ return a + d.replace(/\d/g, function(x){ return SUBS[+x]; }); }); }
function cT(n){ if (Math.abs(n - 1) < 1e-9) return ""; var w = Math.floor(n + 1e-9), h = n - w > 0.25; return (w ? String(w) : "") + (h ? "½" : ""); }
function nT(n){ return cT(n) || "1"; }
function sideT(list){ return list.map(function(t){ return cT(t[0]) + t[1]; }).join(" + "); }
function eqH(eq){ return CF(sideT(eq.r) + " -> " + sideT(eq.p)); }
function eqU(eq){ return uF(sideT(eq.r)) + " → " + uF(sideT(eq.p)); }
function bare(sp){ return sp.replace(/\((s|l|g|aq)\)$/, ""); }
// formula → atom counts ("Ca(OH)2(s)" → {Ca:1, O:2, H:2})
function atoms(sp){
  var s = bare(sp), st = [{}], i = 0;
  function put(o, e, k){ o[e] = (o[e] || 0) + k; }
  while (i < s.length) {
    var c = s[i];
    if (c === "(") { st.push({}); i++; }
    else if (c === ")") { i++; var n = ""; while (i < s.length && /\d/.test(s[i])) n += s[i++]; var g = st.pop(), k = n ? +n : 1; Object.keys(g).forEach(function(e){ put(st[st.length - 1], e, g[e] * k); }); }
    else if (/[A-Z]/.test(c)) { var el = c; i++; while (i < s.length && /[a-z]/.test(s[i])) el += s[i++]; var m = ""; while (i < s.length && /\d/.test(s[i])) m += s[i++]; put(st[st.length - 1], el, m ? +m : 1); }
    else i++;
  }
  return st[0];
}
var EORD = ["C", "H", "O", "N"];
function elSort(a, b){ var i = EORD.indexOf(a), j = EORD.indexOf(b); return (i < 0 ? 9 : i) - (j < 0 ? 9 : j) || (a < b ? -1 : 1); }
function addTo(acc, a, k){ Object.keys(a).forEach(function(e){ acc[e] = (acc[e] || 0) + a[e] * k; }); }
function balance(eq){
  var L = {}, R = {}; eq.r.forEach(function(t){ addTo(L, atoms(t[1]), t[0]); }); eq.p.forEach(function(t){ addTo(R, atoms(t[1]), t[0]); });
  var els = Object.keys(L); Object.keys(R).forEach(function(e){ if (els.indexOf(e) < 0) els.push(e); }); els.sort(elSort);
  var rows = els.map(function(e){ return [e, q2(L[e] || 0), q2(R[e] || 0)]; });
  return { ok:!!eq.r.length && !!eq.p.length && rows.every(function(r){ return Math.abs(r[1] - r[2]) < 1e-9; }), rows:rows };
}
function nS(n){ return Math.abs(n - Math.round(n)) < 1e-9 ? String(Math.round(n)) : nT(n); }
function sum(list){ return q2(list.reduce(function(s, t){ return s + t[0] * hf(t[1]); }, 0)); }
function dHrxn(eq){ return q2(sum(eq.p) - sum(eq.r)); }
function has(eq, sp){ return eq.r.concat(eq.p).some(function(t){ return t[1] === sp; }); }
function setOf(list){ return list.map(function(t){ return t[1]; }).sort().join("|"); }
function nOf(list, sp){ return list.filter(function(t){ return t[1] === sp; }).reduce(function(s, t){ return s + t[0]; }, 0); }
// combustion to CO₂(g) and H₂O(l) for a C/H/O fuel, 1 mol of fuel
function combEq(sp){ var a = atoms(sp), x = a.C || 0, y = a.H || 0, z = a.O || 0, o = x + y / 4 - z / 2, r = [[1, sp]], p = [];
  if (o > 0) r.push([o, "O2(g)"]); if (x) p.push([x, "CO2(g)"]); if (y) p.push([y / 2, "H2O(l)"]); return { r:r, p:p }; }
// fuel info: one C/H(/O) fuel + O₂ → CO₂ and/or water only
function fuelOf(eq){
  var rs = eq.r.filter(function(t){ return t[1] !== "O2(g)"; });
  if (rs.length !== 1 || !has({ r:eq.r, p:[] }, "O2(g)")) return null;
  var F = rs[0], a = atoms(F[1]); if (!a.C && !a.H) return null;
  if (Object.keys(a).some(function(e){ return EORD.slice(0, 3).indexOf(e) < 0; })) return null;
  if (!eq.p.length || eq.p.some(function(t){ return ["CO2(g)", "H2O(l)", "H2O(g)"].indexOf(t[1]) < 0; })) return null;
  return { sp:F[1], n:F[0], co2:nOf(eq.p, "CO2(g)") / F[0] };
}

// @component radioGroup (from MHF4U 25, via SCH4U 01–14) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (x.aria ? ' aria-label="' + esc(x.aria) + '"' : "") + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 12) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' +
    (o.halo ? ' paint-order="stroke" stroke="var(--sheet)" stroke-width="3.4" stroke-linejoin="round"' : "") + opA(o.op) + ">" + s + "</text>";
}
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function head(x, y, ang, len, fill, op){
  var a1 = ang + Math.PI - 0.42, a2 = ang + Math.PI + 0.42;
  return '<path d="M' + r1(x) + " " + r1(y) + " L" + r1(x + len * Math.cos(a1)) + " " + r1(y + len * Math.sin(a1)) + " L" + r1(x + len * Math.cos(a2)) + " " + r1(y + len * Math.sin(a2)) + ' Z" fill="' + fill + '"' + opA(op) + "/>";
}
// vertical ΔH arrow from y1 toward y2, drawn for the fraction t of its length
function vArrow(x, y1, y2, t, o){
  o = o || {}; if (t <= 0) return "";
  var ye = lerp(y1, y2, t), L = Math.abs(ye - y1); if (L < 1) return "";
  var dir = ye > y1 ? 1 : -1, c = o.c || "var(--en-dh)", hl = Math.min(10, L), ex = ye - dir * Math.min(L, hl * 0.75);
  return ln(x, y1, x, ex, { c:c, w:o.w || 2.6 }) + head(x, ye, dir > 0 ? Math.PI / 2 : -Math.PI / 2, hl, c);
}
var IH = 'Δ<tspan font-style="italic">H</tspan>°';
function subT(s){ return '<tspan font-size="78%" dy="3">' + s + '</tspan><tspan dy="-3"></tspan>'; }

// ---------- @component C4 formationLadder — enthalpy ladder (C4 "ladder" variant): a dashed 0 kJ floor for the elements,
// a staircase of orange ΔH arrows (reactants taken up/down to the floor, +nΔH°f reversed; products built from it, nΔH°f),
// rungs at each level, totals labelled, and a net arrow with a ΔH tag. viewBox 460 × 400.
// ladderSVG({R:[[n, sp]], P:[[n, sp]], prog:[a, b, c], form, valid, hide:sp, given, hiZero, vo:{sp:value}}) -> {svg, Rt, Pt}
var LX = { AX:60, RX0:68, RX1:196, NX:226, PX0:258, PX1:452, YT:46, YB:350 };
function ladderSVG(o){
  var X = LX, vo = o.vo || {}, hide = o.hide || null;
  function v(sp){ return vo[sp] != null ? vo[sp] : hf(sp); }
  function tot(list){ return q2(list.reduce(function(s, t){ return s + t[0] * v(t[1]); }, 0)); }
  var Rt = tot(o.R), Pt = tot(o.P), lv = [0, Rt, Pt], rs = [], ps = [], Rz = [], Pz = [], L = Rt;
  o.R.forEach(function(t){ if (v(t[1]) === 0) { Rz.push(t); return; } var to = q2(L - t[0] * v(t[1])); rs.push({ t:t, from:L, to:to }); L = to; lv.push(to); });
  L = 0;
  o.P.forEach(function(t){ if (v(t[1]) === 0) { Pz.push(t); return; } var to = q2(L + t[0] * v(t[1])); ps.push({ t:t, from:L, to:to }); L = to; lv.push(to); });
  var lo = Math.min.apply(null, lv), hi = Math.max.apply(null, lv), span = Math.max(hi - lo, 120), mid = (hi + lo) / 2;
  lo = mid - span / 2; hi = mid + span / 2; var pad = span * 0.05; lo -= pad; hi += pad;
  function y(val){ return X.YT + (hi - val) / (hi - lo) * (X.YB - X.YT); }
  var st = [20, 50, 100, 200, 250, 500, 1000, 2000].filter(function(s){ return (hi - lo) / s <= 7; })[0] || 2000, h = "", y0 = y(0);
  for (var tv = Math.ceil(lo / st) * st; tv <= hi + 1e-9; tv += st) {
    var yy = y(tv); h += ln(X.AX, yy, X.PX1, yy, { c:"var(--rule)", w:1 }) + tx(X.AX - 6, yy, tv === 0 ? "0" : fx(tv, 0), { a:"end", fs:10.5, c:"var(--ink-2)" });
  }
  h += ln(X.AX, 20, X.AX, X.YB + 22, { c:"var(--ink-2)", w:1.4 }) + tx(6, 12, "Enthalpy (kJ)", { a:"start", fs:11, c:"var(--ink-2)" });
  h += tx(X.AX - 6, y0 + 12, "elements", { a:"end", fs:9.5, c:"var(--ink-2)" });
  h += ln(X.AX, y0, X.PX1, y0, { c:"var(--ink-2)", w:1.8, d:"7 5" });
  var pa = o.prog[0], pb = o.prog[1], pc = o.prog[2];
  function lab(x, yy, l1, l2, a){ return tx(x, yy - 7, l1, { a:a || "start", fs:11, halo:true }) + tx(x, yy + 7, l2, { a:a || "start", fs:11.5, w:700, halo:true }); }
  function hidV(n, neg){ return (neg ? "−" : "") + (Math.abs(n - 1) < 1e-9 ? "" : cT(n)) + '<tspan font-style="italic">x</tspan>'; }
  // reactant total rung
  if (!o.form && o.R.length) {
    var yr = y(Rt), dn = Rt < 0 || (Rt === 0 && Pt > 0), vt = hide && has({ r:o.R, p:[] }, hide) ? hidV(nOf(o.R, hide)) : vf(Rt) + " kJ";
    h += ln(X.RX0, yr, X.RX1, yr, { w:2.8 });
    h += tx(X.RX0, yr + (dn ? 13 : -25), uF(sideT(o.R)), { a:"start", fs:11, halo:true }) + tx(X.RX0, yr + (dn ? 27 : -11), vt, { a:"start", fs:11.5, w:700, halo:true });
  }
  // reactant arrows (to the floor)
  var kr = rs.length, dxr = kr > 1 ? Math.min(52, 100 / (kr - 1)) : 0;
  rs.forEach(function(s, i){
    var x = X.RX0 + 18 + i * dxr, t = clamp(pa * kr - i, 0, 1), y1 = y(s.from), y2 = y(s.to);
    h += vArrow(x, y1, y2, t);
    if (t >= 1) {
      if (i < kr - 1) h += ln(x - 6, y2, X.RX0 + 18 + (i + 1) * dxr + 6, y2, { c:"var(--ink)", w:1.3, d:"3 3" });
      var n = s.t[0], val = hide === s.t[1] ? hidV(n, true) : sv(-n * v(s.t[1]));
      h += lab(x + 8, (y1 + y2) / 2, uF(cT(n) + s.t[1]), val);
    }
  });
  // zero terms (elements on the floor)
  var zs = o.form ? o.R : Rz;
  if (zs.length) {
    var za = Rt < 0 ? true : Rt > 0 ? false : Pt <= 0, zy = y0 + (za ? -11 : 13), zt = uF(sideT(zs)) + ": 0";
    if (o.hiZero) h += rect(X.RX0 - 2, zy - 10, 8 + zt.length * 6.3, 20, "var(--hi-soft)", { s:"var(--hi)", sw:2, rx:4 });
    h += circ(X.RX0 + 3, y0, 3.6, "var(--en-dh)") + tx(X.RX0 + 10, zy, zt, { a:"start", fs:11, halo:!o.hiZero, w:o.hiZero ? 700 : 400 });
  }
  if (Pz.length) h += tx(X.PX1, y0 + (Pt < 0 ? -11 : 13), uF(sideT(Pz)) + ": 0", { a:"end", fs:11, halo:true });
  // product arrows (from the floor)
  var kp = ps.length, dxp = kp > 1 ? Math.min(66, 124 / (kp - 1)) : 0;
  if (!o.form || o.valid) ps.forEach(function(s, i){
    var x = X.PX0 + 18 + i * dxp, t = clamp(pb * kp - i, 0, 1), y1 = y(s.from), y2 = y(s.to);
    h += vArrow(x, y1, y2, t);
    if (t >= 1) {
      if (i < kp - 1) h += ln(x - 6, y2, X.PX0 + 18 + (i + 1) * dxp + 6, y2, { c:"var(--ink)", w:1.3, d:"3 3" });
      var n = s.t[0];
      h += lab(x + 8, (y1 + y2) / 2, uF(cT(n) + s.t[1]), o.form ? IH + subT("f") + " " + sv(n * v(s.t[1])) : sv(n * v(s.t[1])));
    }
  });
  // product total rung
  if (o.P.length && pb >= 1 && (!o.form || o.valid)) {
    var yp = y(Pt), pd = Pt < 0 || (Pt === 0 && Rt > 0);
    h += ln(X.PX0, yp, X.PX1, yp, { w:2.8 });
    h += tx(X.PX1, yp + (pd ? 13 : -25), uF(sideT(o.P)), { a:"end", fs:11, halo:true }) + tx(X.PX1, yp + (pd ? 27 : -11), vf(Pt) + (o.form ? " kJ/mol" : " kJ"), { a:"end", fs:11.5, w:700, halo:true });
  } else if (o.form && o.P.length) h += tx(X.PX0 + 12, y0 + (Pt < 0 ? 16 : -14), uF(sideT(o.P)) + ": not formed yet", { a:"start", fs:11, c:"var(--ink-2)", halo:true });
  // net arrow
  if (!o.form && pc > 0 && o.R.length && o.P.length) {
    var ya = y(Rt), yb = y(Pt), net = q2(Pt - Rt);
    h += ln(X.RX1, ya, X.NX, ya, { c:"var(--ink-2)", w:1.2, d:"3 3" }) + ln(X.NX, yb, X.PX0, yb, { c:"var(--ink-2)", w:1.2, d:"3 3" });
    h += vArrow(X.NX, ya, yb, pc, { w:3.4 });
    if (pc >= 1) {
      var ym = Math.abs(yb - ya) < 40 ? Math.min(ya, yb) - 22 : (ya + yb) / 2, nt = o.given != null ? vf(o.given) + " kJ" : sv(net) + " kJ";
      h += rect(X.NX - 36, ym - 16, 72, 32, "var(--sheet)", { s:"var(--en-dh)", sw:1.8, rx:5 }) + tx(X.NX, ym - 7, IH + subT("rxn") + (o.given != null ? " (given)" : ""), { fs:10 }) + tx(X.NX, ym + 8, nt, { fs:12, w:700 });
    }
  }
  return { svg:h, Rt:Rt, Pt:Pt };
}

// ---------- hero: methane on the formation ladder ----------
function hero(){
  var svg = $("#sf-hx-svg"), ctr = $("#sf-hx-ctr"), rep = $("#sf-hx-replay"); if (!svg) return;
  var V = { m:hf("CH4(g)"), c:hf("CO2(g)"), w:hf("H2O(l)") }, P1 = V.c, P2 = q2(V.c + V.w), P3 = q2(V.c + 2 * V.w), NET = q2(P3 - V.m);
  var Y0 = 58, K = 250 / Math.abs(P3); function Y(v){ return Y0 - v * K; }
  var st, run = 0;
  function reset(){ st = { fl:0, rg:0, up:0, d1:0, d2:0, net:0 }; }
  function draw(){
    var h = "", fl = st.fl, rg = st.rg;
    h += ln(30, Y0, 455, Y0, { c:"var(--ink-2)", w:1.8, d:"7 5", op:fl });
    h += tx(30, 40, "0 kJ/mol · elements: C(s), H₂(g), O₂(g)", { a:"start", fs:12.5, w:700, op:fl });
    if (rg > 0) {
      var ym = lerp(Y0, Y(V.m), rg), y1 = lerp(Y0, Y(P1), rg), y2 = lerp(Y0, Y(P2), rg), y3 = lerp(Y0, Y(P3), rg), lo = clamp((rg - 0.7) / 0.3, 0, 1);
      h += ln(40, ym, 178, ym, { w:2.8 }) + tx(40, ym + 14, "CH₄(g) + 2O₂(g): " + vf(V.m), { a:"start", fs:11.5, w:700, op:lo });
      h += ln(300, y1, 452, y1, { w:2.4 }) + tx(452, y1 - 10, "CO₂(g)  " + vf(V.c), { a:"end", fs:11.5, op:lo });
      h += ln(362, y2, 452, y2, { w:2 }) + tx(452, y2 - 10, "H₂O(l)  " + vf(V.w), { a:"end", fs:11, op:lo });
      h += ln(300, y3, 452, y3, { w:2.8 }) + tx(452, y3 - 10, "H₂O(l)  " + vf(V.w), { a:"end", fs:11, op:lo }) + tx(452, y3 + 15, "CO₂(g) + 2H₂O(l): " + vf(P3), { a:"end", fs:11.5, w:700, op:lo });
    }
    if (st.up > 0) { h += vArrow(70, Y(V.m), Y0, st.up); if (st.up >= 1) h += tx(80, (Y(V.m) + Y0) / 2 + 1, sv(-V.m), { a:"start", fs:11.5, w:700, c:"var(--en-dh)", halo:true }); }
    if (st.d1 > 0) { h += vArrow(322, Y0, Y(P1), st.d1); if (st.d1 >= 1) h += tx(330, (Y0 + Y(P1)) / 2, sv(V.c), { a:"start", fs:11.5, w:700, c:"var(--en-dh)", halo:true }); }
    if (st.d2 > 0) { h += vArrow(374, Y(P1), Y(P3), st.d2); if (st.d2 >= 1) h += tx(366, (Y(P1) + Y(P2)) / 2, "2H₂O(l)", { a:"end", fs:11, halo:true }) + tx(366, (Y(P1) + Y(P2)) / 2 + 15, sv(2 * V.w), { a:"end", fs:11.5, w:700, c:"var(--en-dh)", halo:true }); }
    if (st.net > 0) {
      h += ln(178, Y(V.m), 240, Y(V.m), { c:"var(--ink-2)", w:1.2, d:"3 3", op:st.net }) + ln(240, Y(P3), 300, Y(P3), { c:"var(--ink-2)", w:1.2, d:"3 3", op:st.net });
      h += vArrow(240, Y(V.m), Y(P3), st.net, { w:3.4 });
      if (st.net >= 1) { var yy = (Y(V.m) + Y(P3)) / 2; h += rect(202, yy - 17, 76, 34, "var(--sheet)", { s:"var(--en-dh)", sw:1.8, rx:5 }) + tx(240, yy - 7, IH + subT("c"), { fs:10.5 }) + tx(240, yy + 8, vf(NET) + " kJ", { fs:12.5, w:700 }); }
    }
    svg.innerHTML = h;
  }
  function final(){ st = { fl:1, rg:1, up:1, d1:1, d2:1, net:1 }; draw(); ctr.innerHTML = "Up to the elements, then down to the products: " + HCh + " = " + vf(NET) + " kJ."; rep.hidden = false; }
  function play(){
    var id = ++run; reset(); rep.hidden = true; draw();
    function ok(){ return id === run; }
    function tw(key, dur, msg, next){ if (!ok()) return; if (msg) ctr.innerHTML = msg; MV.tween({ dur:dur, step:function(t){ if (!ok()) return; st[key] = t; draw(); }, done:function(){ if (!ok()) return; st[key] = 1; draw(); MV.wait(500, function(){ if (ok()) next(); }); } }); }
    tw("fl", 500, "Elements in their standard states sit on the floor: 0 kJ/mol.", function(){
      tw("rg", 900, "Compounds sit below the floor, by their " + HFh + ".", function(){
        tw("up", 700, "Take methane apart: " + sv(-V.m) + " kJ up to the elements.", function(){
          tw("d1", 700, "Build the products: CO₂ " + vf(V.c) + " kJ…", function(){
            tw("d2", 800, "…and two waters, " + vf(2 * V.w) + " kJ.", function(){
              tw("net", 800, "The net arrow: products minus reactants.", function(){ MV.wait(400, function(){ if (ok()) final(); }); });
            });
          });
        });
      });
    });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Formation ladder ----------
function coef(v){ v = Math.round((+v || 1) * 2) / 2; return clamp(v, 0.5, 6); }
function cleanTerms(a, allowed, max){ var seen = {}; return (Array.isArray(a) ? a : []).filter(function(t){ var ok = Array.isArray(t) && allowed.indexOf(t[1]) >= 0 && !seen[t[1]]; if (ok) seen[t[1]] = 1; return ok; }).map(function(t){ return [coef(t[0]), t[1]]; }).slice(0, max); }
function explore(host, api){
  var S = api.S, C = api.content, RX = C.reactions, HIDE = C.hideSp, GIVEN = C.hideGiven, CHIPS = C.chips;
  var ATOMCH = CHIPS.filter(function(c){ return c.atom; }).map(function(c){ return c.id; });
  var ELCH = CHIPS.filter(function(c){ return !c.atom; }).map(function(c){ return c.id; });
  var PAL = D.dHf.map(function(r){ return r[0]; }).filter(function(sp){ return !/aq\)$/.test(sp); }).concat(C.elements);
  var CMPS = D.dHf.map(function(r){ return r[0]; }).filter(function(sp){ if (/aq\)$/.test(sp)) return false; return Object.keys(atoms(sp)).every(function(e){ return ELCH.some(function(c){ return atoms(c)[e]; }); }); });
  if (["lad", "build", "form"].indexOf(S.mode) < 0) S.mode = "lad";
  var L = S.lad = obj(S.lad); if (!RX.some(function(r){ return r.id === L.rx; })) L.rx = "R1"; L.w = L.w === "g" ? "g" : "l"; L.step = clamp(Math.round(+L.step || 0), 0, 3);
  var B = S.b = obj(S.b); B.r = cleanTerms(B.r, PAL, 4); B.p = cleanTerms(B.p, PAL, 4); B.side = B.side === "p" ? "p" : "r"; B.hide = !!B.hide; B.x = typeof B.x === "string" ? B.x : ""; B.step = clamp(Math.round(+B.step || 0), 0, 3);
  var F = S.f = obj(S.f); if (CMPS.indexOf(F.cmp) < 0) F.cmp = "C2H5OH(l)"; F.t = cleanTerms(F.t, CHIPS.map(function(c){ return c.id; }), 6); F.pn = +F.pn === 2 ? 2 : 1;
  var busy = false, locked = false, tw = null, ftw = null, seq = 0, note = "", A = null, hiZ = false, fwas = null;

  host.innerHTML = '<p class="how sf-how">' + C.how + '</p><div class="sf-modes"></div><div class="sf-grid">' +
    '<div class="sf-view"><p class="banner" data-mv="banner" aria-live="polite"></p><p class="sf-eq" aria-live="polite"></p><div class="sf-box"><svg class="sf-svg" id="sf-lad" viewBox="0 0 460 400" role="img" aria-label=""></svg></div><p class="sf-cap" aria-live="polite"></p></div>' +
    '<div class="sf-ctl">' +
      '<div class="sf-c" data-for="lad"><div class="sf-rx"></div><div class="sf-w"></div></div>' +
      '<div class="sf-c" data-for="build"><div class="sf-sd"></div><div class="sf-pal" role="group" aria-label="Species palette: tap to add"></div><div class="sf-terms"></div><div class="sf-hide"></div></div>' +
      '<div class="sf-c" data-for="form"><div class="sf-cmp"><label for="sf-sel" class="rg-lab">Compound</label> <select id="sf-sel" data-k="sel"></select></div><div class="sf-chips" role="group" aria-label="Element chips: tap to add"></div><div class="sf-fterms"></div><div class="sf-pn"></div></div>' +
      '<div class="sf-steps"></div><dl class="read sf-read" aria-live="polite"></dl></div></div>' +
    '<p class="tiny muted sf-note">' + C.tableNote + '</p><div class="sf-tabs"></div>';
  var svg = $("#sf-lad"), sel = $("#sf-sel");
  MV.chem.tablePanel($(".sf-tabs", host), "dhf", { title:"Course data table: standard enthalpies of formation" });
  sel.innerHTML = CMPS.map(function(sp){ return '<option value="' + esc(sp) + '">' + uF(sp) + "</option>"; }).join("");
  sel.value = F.cmp;

  // ----- radios -----
  var RG = {};
  RG.mode = radios($(".sf-modes", host), { label:"Mode", aria:"Ladder mode", options:C.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; note = ""; hiZ = false; api.save(); paint(); } });
  RG.rx = radios($(".sf-rx", host), { label:"Reaction", cls:"chips sf-rxl", aria:"Choose a reaction", value:L.rx,
    options:RX.map(function(r){ return { id:r.id, t:"<strong>" + r.id + "</strong> " + eqH(r), aria:r.id + ": " + eqU(r) }; }),
    onChange:function(v){ L.rx = v; L.w = "l"; L.step = 0; note = ""; hiZ = false; RG.w.set("l"); api.save(); paint(); } });
  RG.w = radios($(".sf-w", host), { label:"Water", aria:"State of the water", options:[{ id:"l", t:CF("H2O(l)") }, { id:"g", t:CF("H2O(g)") }], value:L.w,
    onChange:function(v){ L.w = v; note = ""; api.save(); paint(); } });
  RG.sd = radios($(".sf-sd", host), { label:"Add to", aria:"Side to add species to", options:[{ id:"r", t:"Reactants" }, { id:"p", t:"Products" }], value:B.side,
    onChange:function(v){ B.side = v; api.save(); } });
  RG.pn = radios($(".sf-pn", host), { label:"Product", aria:"Moles of product", options:[{ id:"1", t:"1 mol" }, { id:"2", t:"2 mol" }], value:String(F.pn),
    onChange:function(v){ F.pn = +v; note = ""; api.save(); paint(); } });
  function syncRG(){ RG.mode.set(S.mode); RG.rx.set(L.rx); RG.w.set(L.w); RG.sd.set(B.side); RG.pn.set(String(F.pn)); sel.value = F.cmp; }
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); sel.disabled = b; paintCtl(); }

  // ----- model -----
  function ladEq(){ var r = RX.filter(function(x){ return x.id === L.rx; })[0]; return { r:r.r, p:r.p.map(function(t){ return L.w === "g" && t[1] === "H2O(l)" ? [t[0], "H2O(g)"] : t; }) }; }
  function isMeth(eq, bal){ return bal.ok && setOf(eq.r) === ["CH3OH(l)", "O2(g)"].sort().join("|") && setOf(eq.p) === ["CO2(g)", "H2O(l)"].sort().join("|"); }
  function model(){
    if (S.mode === "lad") return { eq:ladEq(), bal:{ ok:true, rows:[] }, can:true };
    var eq = { r:B.r, p:B.p }, bal = balance(eq), hid = B.hide && has(eq, HIDE), meth = hid && isMeth(eq, bal), why = "";
    if (!eq.r.length || !eq.p.length) why = "Add at least one reactant and one product.";
    else if (!bal.ok) why = "Balance the equation first: the steps unlock when every atom balances.";
    else if (hid && !meth) why = "With " + CF(HIDE) + "’s value hidden, build its combustion to CO₂(g) and H₂O(l): the given " + vf(GIVEN) + " kJ is for that reaction.";
    return { eq:eq, bal:bal, hid:hid, meth:meth, given:meth ? q2(GIVEN * nOf(eq.r, HIDE)) : null, can:!why, why:why };
  }
  function curStep(){ return S.mode === "lad" ? L.step : S.mode === "build" ? B.step : 0; }
  function setStep(k){ if (S.mode === "lad") L.step = k; else if (S.mode === "build") B.step = k; }
  function progOf(k){ return [k >= 1 ? 1 : 0, k >= 2 ? 1 : 0, k >= 3 ? 1 : 0]; }
  function formSt(){
    var cmp = atoms(F.cmp), need = {}, got = {}; addTo(need, cmp, F.pn); F.t.forEach(function(t){ addTo(got, atoms(t[1]), t[0]); });
    var els = Object.keys(need); Object.keys(got).forEach(function(e){ if (els.indexOf(e) < 0) els.push(e); }); els.sort(elSort);
    var rows = els.map(function(e){ return [e, q2(got[e] || 0), q2(need[e] || 0)]; }), atomsOk = !!F.t.length && rows.every(function(r){ return Math.abs(r[1] - r[2]) < 1e-9; });
    var bad = F.t.filter(function(t){ return ATOMCH.indexOf(t[1]) >= 0; }).map(function(t){ return t[1]; });
    return { rows:rows, atomsOk:atomsOk, one:F.pn === 1, std:!bad.length, bad:bad, valid:atomsOk && F.pn === 1 && !bad.length };
  }

  // ----- drawing -----
  function draw(){
    var o, desc, eqLine;
    if (S.mode === "form") {
      var fs = formSt(), fp = A && A.fp != null ? A.fp : fs.valid ? 1 : 0;
      o = ladderSVG({ R:F.t, P:[[F.pn, F.cmp]], prog:[0, fp, 0], form:true, valid:fs.valid, hiZero:false });
      eqLine = (F.t.length ? CF(sideT(F.t)) : '<span class="muted">(tap element chips)</span>') + " → " + CF(cT(F.pn) + F.cmp);
      desc = "Formation ladder for " + uF(F.cmp) + ". Elements on the 0 kJ floor: " + (F.t.length ? uF(sideT(F.t)) : "none yet") + ". " + (fs.valid ? "Formation equation complete: the rung sits at " + MV.plain(vf(hf(F.cmp))) + " kJ/mol." : "Not a formation equation yet.");
    } else {
      var m = model(), prog = A && A.prog ? A.prog : progOf(curStep());
      if (!m.can) prog = [0, 0, 0];
      o = ladderSVG({ R:m.eq.r, P:m.eq.p, prog:prog, hide:m.hid ? HIDE : null, given:m.given, hiZero:hiZ, vo:A && A.vo });
      eqLine = m.eq.r.length && m.eq.p.length ? eqH(m.eq) : m.eq.r.length || m.eq.p.length ? (m.eq.r.length ? CF(sideT(m.eq.r)) : "…") + " → " + (m.eq.p.length ? CF(sideT(m.eq.p)) : "…") : '<span class="muted">Tap species in the palette to build an equation.</span>';
      var k = curStep(), net = q2(o.Pt - o.Rt);
      desc = "Enthalpy ladder with a 0 kJ floor for the elements. " + (m.eq.r.length ? "Equation: " + eqU(m.eq) + ". " : "") +
        (k >= 1 && m.can ? "Reactants at " + (m.hid ? "x" : MV.plain(vf(o.Rt))) + " kJ" : "") + (k >= 2 && m.can ? ", products at " + MV.plain(vf(o.Pt)) + " kJ" : "") + (k >= 3 && m.can ? ", ΔH " + MV.plain(m.given != null ? vf(m.given) : sv(net)) + " kJ." : k >= 1 && m.can ? "." : "");
    }
    svg.innerHTML = o.svg; svg.setAttribute("aria-label", desc);
    $(".sf-eq", host).innerHTML = eqLine;
  }
  function termLine(list, hid){
    var parts = list.map(function(t){ var n = t[0], v = hf(t[1]); if (hid && t[1] === HIDE) return (Math.abs(n - 1) < 1e-9 ? "" : cT(n)) + "<i>x</i>"; return (Math.abs(n - 1) < 1e-9 ? "" : cT(n)) + "(" + (v === 0 ? "0" : vf(v)) + ")"; });
    return parts.join(" + ");
  }
  function balRow(bal){ return bal.rows.map(function(r){ var ok = Math.abs(r[1] - r[2]) < 1e-9; return r[0] + " " + nS(r[1]) + (ok ? " = " : " ≠ ") + nS(r[2]) + (ok ? " ✓" : " ✗"); }).join(" · "); }
  function paintRead(){
    var rows = [];
    if (S.mode === "form") {
      var fs = formSt();
      rows.push(["Atoms (left = right?)", fs.rows.length && F.t.length ? fs.rows.map(function(r){ var ok = Math.abs(r[1] - r[2]) < 1e-9; return r[0] + " " + nS(r[1]) + (ok ? " = " : " ≠ ") + nS(r[2]) + (ok ? " ✓" : " ✗"); }).join(" · ") : muted("add element chips")],
        ["Product", fs.one ? "1 mol ✓" : "2 mol ✗: a formation equation makes exactly 1 mol"],
        ["Reactants", !F.t.length ? muted("none yet") : fs.std ? "elements in their standard states ✓" : fs.bad.map(CF).join(", ") + ": single atoms aren’t a standard state ✗"],
        ["Formation equation?", fs.valid ? "Yes ✓ " + HFh + "(" + CF(F.cmp) + ") = " + sv(hf(F.cmp)) + " kJ/mol" : muted("not yet")]);
    } else {
      var m = model(), k = curStep(), eq = m.eq, P = sum(eq.p), R = sum(eq.r), net = q2(P - R);
      if (S.mode === "build") rows.push(["Balanced?", !eq.r.length || !eq.p.length ? muted("add reactants and products") : (m.bal.ok ? "Yes ✓ " : "No ✗ ") + '<span class="tiny">' + balRow(m.bal) + "</span>"]);
      if (!m.can) rows.push([HRh, muted(m.why)]);
      else {
        var hid = m.hid, nH = hid ? nOf(eq.r, HIDE) : 0, xS = (Math.abs(nH - 1) < 1e-9 ? "" : cT(nH)) + "<i>x</i>";
        rows.push([SPh, k >= 2 ? termLine(eq.p) + " = " + vf(P) + " kJ" : muted("press Build products")]);
        rows.push([SRh, k >= 1 ? termLine(eq.r, hid) + " = " + (hid ? xS : vf(R) + " kJ") : muted("press Take reactants to elements")]);
        if (hid) {
          rows.push([HRh + " (given)", k >= 3 ? vf(P) + " − " + xS + " = " + vf(m.given) + " kJ" : muted("press Show net")]);
          var xv = MV.parseNum(B.x), x = xv && xv.length === 1 && isFinite(xv[0]) ? xv[0] : null;
          if (x != null) { var back = q2(P - nH * x - (R - nH * hf(HIDE))), okB = Math.abs(back - m.given) <= 0.1 * Math.max(1, nH) + 1e-9;
            rows.push(["Substitute back", vf(P) + " − " + (Math.abs(nH - 1) < 1e-9 ? "" : cT(nH)) + "(" + vf(x) + ") = " + vf(back) + " kJ " + (okB ? "✓ matches the given" : "✗ the given is " + vf(m.given) + " kJ")]); }
        } else {
          rows.push([HRh, k >= 3 ? vf(P) + " − (" + vf(R) + ") = " + sv(net) + " kJ: " + (net < 0 ? "exothermic" : net > 0 ? "endothermic" : "no change") : muted("press Show net")]);
          var fu = fuelOf(eq);
          if (fu && k >= 3) {
            var per = q2(net / fu.n);
            rows.push(["Per mole of fuel", vf(per) + " kJ/mol " + CF(bare(fu.sp))], ["CO₂ per mole of fuel", nS(q2(fu.co2)) + " mol"],
              ["Energy per mole of CO₂", fu.co2 > 0 ? vf(Math.abs(per) / fu.co2) + " kJ" : "none released (no CO₂)"]);
          }
        }
      }
    }
    $(".sf-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var t = "";
    if (S.mode === "form") { var fs = formSt(); t = fs.valid ? "Exactly 1 mol of " + CF(F.cmp) + ", from elements in their standard states: its rung sits at " + sv(hf(F.cmp)) + " kJ/mol." : "Make exactly 1 mol of " + CF(F.cmp) + " from element chips."; }
    else {
      var m = model(), k = curStep();
      if (!m.can) t = S.mode === "build" ? (B.r.length || B.p.length ? m.why : "Tap species to add them to the side you choose.") : "";
      else if (busy) t = "Stepping…";
      else if (k === 0) t = "Elements sit on the 0 kJ floor. Press <strong>Take reactants to elements</strong>.";
      else if (k === 1) t = "The reactants are taken apart into their elements: " + (m.hid ? "a change of −" + "<i>x</i>" : sv(-sum(m.eq.r)) + " kJ") + ".";
      else if (k === 2) t = "The products are built from the elements: " + vf(sum(m.eq.p)) + " kJ.";
      else { var net = m.given != null ? m.given : dHrxn(m.eq); t = "Net: products minus reactants, " + HRh + " = " + (m.given != null ? vf(net) : sv(net)) + " kJ" + (m.given != null ? " (given). Solve for <i>x</i>." : net < 0 ? ": exothermic." : net > 0 ? ": endothermic." : "."); }
    }
    $(".sf-cap", host).innerHTML = t + (note && !busy ? " <strong>" + note + "</strong>" : "");
  }
  function chipBalls(id){
    var a = atoms(id), el = Object.keys(a)[0], n = a[el], c = MV.chem.atom(el), h = "";
    for (var i = 0; i < n; i++) h += circ(9 + i * 11, 10, 7.5, c.fill, { s:c.line !== "none" ? c.line : null, sw:1.4 }) + tx(9 + i * 11, 10.5, el, { fs:el.length > 1 ? 7.5 : 9, w:700, c:c.ink });
    return '<svg class="sf-ball" viewBox="0 0 ' + (8 + n * 11 + 2) + ' 20" width="' + (8 + n * 11 + 2) + '" height="20" aria-hidden="true">' + h + "</svg>";
  }
  function termsHTML(list, side, title){
    var dis = locked || busy ? " disabled" : "";
    return '<div class="sf-tl"><span class="rg-lab">' + title + "</span>" + (list.length ? list.map(function(t, i){
      var nm = uF(t[1]);
      return '<div class="sf-trow"><input type="number" class="sf-co" min="0.5" max="6" step="0.5" value="' + t[0] + '" data-co="' + side + ":" + i + '" data-k="co' + side + esc(t[1]) + '" aria-label="Coefficient of ' + esc(nm) + '"' + dis + '><span class="sf-tf">' + CF(t[1]) + "</span>" +
        '<button type="button" class="sf-rm" data-rm="' + side + ":" + i + '" data-k="rm' + side + esc(t[1]) + '" aria-label="Remove ' + esc(nm) + '"' + dis + ">×</button></div>";
    }).join("") : '<p class="tiny muted sf-none">none yet</p>') + "</div>";
  }
  function paintCtl(){
    var dis = locked || busy ? " disabled" : "", m = S.mode === "form" ? null : model();
    var ladEqNow = ladEq(); $(".sf-w", host).hidden = !(has(ladEqNow, "H2O(l)") || has(ladEqNow, "H2O(g)"));
    MV.keepFocus($(".sf-pal", host), function(){
      $(".sf-pal", host).innerHTML = PAL.map(function(sp){ var v = hf(sp), hd = B.hide && sp === HIDE, on = has({ r:B.r, p:B.p }, sp);
        return '<button type="button" class="sf-sp' + (on ? " on" : "") + '" data-add="' + esc(sp) + '" data-k="add' + esc(sp) + '" aria-label="' + esc(uF(sp) + ", " + (hd ? "value hidden" : MV.plain(vf(v)) + " kilojoules per mole")) + '"' + dis + ">" + CF(sp) + ' <span class="sf-v">' + (hd ? "?" : v === 0 ? "0" : vf(v)) + "</span></button>"; }).join("");
    });
    MV.keepFocus($(".sf-terms", host), function(){ $(".sf-terms", host).innerHTML = termsHTML(B.r, "r", "Reactants") + termsHTML(B.p, "p", "Products"); });
    MV.keepFocus($(".sf-hide", host), function(){
      var h = '<button type="button" class="btn ghost sm sf-hb" data-act="hide" data-k="hide" aria-pressed="' + B.hide + '"' + dis + ">" + (B.hide ? "✓ " : "") + "Hide " + CF(HIDE) + "’s value</button>";
      if (B.hide) h += '<div class="sf-xrow"><label for="sf-x">Your ' + HFh + "(" + CF(bare(HIDE)) + ") = <i>x</i> =</label> <input id=\"sf-x\" class=\"numin\" type=\"number\" step=\"any\" data-k=\"xin\" value=\"" + esc(B.x) + '"' + dis + '> <span>kJ/mol</span></div><p class="tiny muted">Given: ' + HCh + " = " + vf(GIVEN) + " kJ per mol of " + CF(bare(HIDE)) + ", to liquid water.</p>";
      $(".sf-hide", host).innerHTML = h;
    });
    MV.keepFocus($(".sf-chips", host), function(){
      $(".sf-chips", host).innerHTML = '<span class="rg-lab">Element chips</span><div class="sf-chipr">' + CHIPS.map(function(c){ var on = F.t.some(function(t){ return t[1] === c.id; });
        return '<button type="button" class="sf-ch' + (c.atom ? " atom" : "") + (on ? " on" : "") + '" data-el="' + esc(c.id) + '" data-k="el' + esc(c.id) + '" aria-label="' + esc(uF(c.id) + (c.atom ? ", single atoms" : "")) + '"' + dis + ">" + chipBalls(c.id) + CF(c.id) + "</button>"; }).join("") + "</div>";
    });
    MV.keepFocus($(".sf-fterms", host), function(){ $(".sf-fterms", host).innerHTML = termsHTML(F.t, "f", "Reactants (elements)"); });
    var stp = $(".sf-steps", host);
    if (S.mode === "form") { stp.hidden = true; stp.innerHTML = ""; return; }
    stp.hidden = false;
    MV.keepFocus(stp, function(){
      var k = curStep(), d2 = locked || busy || !m.can;
      stp.innerHTML = '<div class="sf-stb">' + C.steps.map(function(t, i){ return '<button type="button" class="btn sm' + (i === k && !d2 ? " primary" : "") + '" data-step="' + (i + 1) + '" data-k="st' + i + '"' + (d2 || k > i ? " disabled" : "") + ">" + (i + 1) + ". " + t + "</button>"; }).join("") +
        '<button type="button" class="btn ghost sm" data-act="rs" data-k="rs"' + (locked || busy || k === 0 ? " disabled" : "") + ">Reset steps</button></div>";
    });
  }
  function paint(){
    $$(".sf-c", host).forEach(function(p){ p.hidden = p.dataset.for !== S.mode; });
    paintCtl(); draw(); paintRead(); paintCap();
    if (S.mode === "form") { var v = formSt().valid; if (v && fwas === false && !A) formReveal(); fwas = v; } else fwas = null;
    MV.changed();
  }

  // ----- edits -----
  function edited(){ B.step = 0; note = ""; hiZ = false; api.save(); paint(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked || busy || !host.contains(b) || b.dataset.rg != null) return;
    if (b.dataset.step) { note = ""; hiZ = false; playTo(+b.dataset.step); return; }
    if (b.dataset.act === "rs") { setStep(0); note = ""; hiZ = false; api.save(); paint(); return; }
    if (b.dataset.add) {
      var sp = b.dataset.add, list = B.side === "p" ? B.p : B.r, other = B.side === "p" ? B.r : B.p;
      if (list.some(function(t){ return t[1] === sp; })) { note = ""; paint(); return; }
      var oi = other.map(function(t){ return t[1]; }).indexOf(sp); if (oi >= 0) other.splice(oi, 1);
      if (list.length >= 4) { note = "Four species per side at most."; paint(); return; }
      list.push([1, sp]); edited(); return;
    }
    if (b.dataset.rm) { var p = b.dataset.rm.split(":"), arr = p[0] === "r" ? B.r : p[0] === "p" ? B.p : F.t; arr.splice(+p[1], 1); if (p[0] === "f") { note = ""; api.save(); paint(); } else edited(); return; }
    if (b.dataset.act === "hide") { B.hide = !B.hide; edited(); return; }
    if (b.dataset.el) { var id = b.dataset.el; if (!F.t.some(function(t){ return t[1] === id; }) && F.t.length < 6) F.t.push([1, id]); note = ""; api.save(); paint(); }
  });
  host.addEventListener("change", function(e){
    var t = e.target;
    if (t.dataset && t.dataset.co) { var p = t.dataset.co.split(":"), arr = p[0] === "r" ? B.r : p[0] === "p" ? B.p : F.t, it = arr[+p[1]]; if (!it) return; it[0] = coef(t.value); if (p[0] === "f") { note = ""; api.save(); paint(); } else edited(); return; }
    if (t === sel) { F.cmp = CMPS.indexOf(sel.value) >= 0 ? sel.value : F.cmp; F.t = []; F.pn = 1; RG.pn.set("1"); note = ""; api.save(); paint(); }
  });
  host.addEventListener("input", function(e){ if (e.target.id === "sf-x") { B.x = e.target.value; api.save(); paintRead(); MV.changed(); } });

  // ----- animation -----
  function cancelAnim(){ seq++; if (tw) { tw(); tw = null; } if (ftw) { ftw(); ftw = null; } A = null; busy = false; }
  function begin(){ cancelAnim(); busy = true; lock(true); return seq; }
  function playTo(k, cb, keep){
    var s0 = curStep(); if (k <= s0) { if (cb) cb(); return; }
    var my = begin(); A = { prog:progOf(s0) }; paintCap();
    (function stage(i){
      if (my !== seq) return;
      if (i >= k) { tw = null; A = null; busy = false; api.save(); if (!keep) lock(false); paint(); if (cb) cb(); return; }
      tw = MV.tween({ dur:i === 2 ? 800 : 900, ease:LIN, step:function(t){ if (my !== seq) return; A.prog[i] = t; draw(); }, done:function(){
        if (my !== seq) return; A.prog[i] = 1; setStep(i + 1); draw(); paintRead(); MV.wait(250, function(){ stage(i + 1); });
      } });
    })(s0);
  }
  function formReveal(cb){
    if (ftw) { ftw(); ftw = null; }
    A = { fp:0 }; draw();
    ftw = MV.tween({ dur:800, step:function(t){ if (!A) return; A.fp = t; draw(); }, done:function(){ ftw = null; A = null; draw(); if (cb) cb(); } });
  }
  function waterSwitch(cb){
    var my = begin(), a = hf("H2O(l)"), b = hf("H2O(g)"); A = { prog:[1, 1, 1], vo:{} };
    tw = MV.tween({ dur:1400, step:function(t){ if (my !== seq) return; A.vo["H2O(l)"] = lerp(a, b, t); draw(); }, done:function(){
      if (my !== seq) return; tw = null; A = null; busy = false; L.w = "g"; RG.w.set("g"); api.save(); paint(); if (cb) cb();
    } });
  }

  // ----- predictions -----
  var hooks = {
    start:function(p){
      cancelAnim(); note = ""; hiZ = false;
      if (p.id === "p2") { S.mode = "form"; F.cmp = "H2O(l)"; F.t = []; F.pn = 1; fwas = null; }
      else { S.mode = "lad"; L.rx = p.id === "p3" ? "R4" : "R1"; L.w = "l"; L.step = p.id === "p4" ? 3 : 0; }
      syncRG(); api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(n){ note = n || ""; busy = false; lock(false); paint(); MV.wait(150, done); }
      if (p.id === "p1") { hiZ = true; playTo(1, function(){ fin("O₂ sits on the floor: its arrow has length zero."); }, true); }
      else if (p.id === "p2") { F.t = [[1, "H2(g)"], [0.5, "O2(g)"]]; F.pn = 1; fwas = true; api.save(); paint(); formReveal(function(){ fin("The chips snap into place, and the rung shows " + vf(hf("H2O(l)")) + " kJ/mol."); }); }
      else if (p.id === "p3") {
        var e4 = ladEq();
        playTo(3, function(){ fin("The products’ total (" + vf(sum(e4.p)) + ") sits <strong>above</strong> CaCO₃ (" + vf(sum(e4.r)) + "), and the net arrow points up: " + sv(dHrxn(e4)) + " kJ."); }, true);
      } else {
        var rise = q2(2 * (hf("H2O(g)") - hf("H2O(l)")));
        waterSwitch(function(){ fin("The 2H₂O rung rises by " + vf(rise) + " kJ: " + HCh + " = " + vf(dHrxn(ladEq())) + " kJ."); });
      }
    }
  };

  // ----- challenges -----
  function chal(id){
    if (id === "tc1") {
      var eq = { r:B.r, p:B.p };
      if (!has({ r:B.r, p:[] }, "C3H8(g)")) return { ok:false };
      if (has(eq, "H2O(g)")) return { ok:false, msg:"The task says liquid water. Check the state. H₂O(l) −285.8; H₂O(g) −241.8." };
      if (setOf(B.r) !== ["C3H8(g)", "O2(g)"].sort().join("|") || setOf(B.p) !== ["CO2(g)", "H2O(l)"].sort().join("|")) return { ok:false, msg:"Use only C₃H₈(g) and O₂(g) as reactants, and CO₂(g) and H₂O(l) as products." };
      if (!balance(eq).ok) {
        if (eq.r.concat(eq.p).every(function(t){ return t[0] === 1; })) return { ok:false, msg:"With every coefficient 1 you’d get −575.5 kJ. Multiply each " + HFh + " by its coefficient: balance first (1, 5, 3, 4)." };
        return { ok:false, msg:"Balance first: 1, 5, 3, 4." };
      }
      return { ok:true };
    }
    if (id === "tc2") {
      if (F.cmp !== "C2H5OH(l)") return { ok:false, msg:"Pick ethanol, C₂H₅OH(l), in the compound list." };
      if (!F.t.length) return { ok:false };
      var fs = formSt();
      if (!fs.std) return { ok:false, msg:"Use H₂(g) and O₂(g), the standard states." };
      if (F.pn !== 1) return { ok:false, msg:"Exactly 1 mol of product. A formation equation makes exactly 1 mol of product, from elements only; fractions are fine." };
      if (fs.valid) return { ok:true };
      if (Math.abs(nOf(F.t, "O2(g)") - 1) < 1e-9) return { ok:false, msg:"Ethanol has one O atom: ½O₂." };
      return { ok:false, msg:"Count the atoms in one ethanol: 2 C, 6 H, 1 O." };
    }
    if (id === "tc3") {
      if (!B.hide) return { ok:false, msg:"Turn on <strong>Hide " + CF(HIDE) + "’s value</strong> first." };
      var xv = MV.parseNum(B.x), x = xv && xv.length === 1 && isFinite(xv[0]) ? xv[0] : null;
      if (x == null) return { ok:false, msg:"Enter your value for <i>x</i>, then check." };
      var tv = hf(HIDE);
      if (Math.abs(x - tv) <= 0.1 + 1e-9) return { ok:true };
      if (Math.abs(x + tv) <= 0.1 + 1e-9) return { ok:false, msg:"Solve carefully: −725.9 = −965.1 − <i>x</i>." };
      if (Math.abs(x - 46.6) <= 0.1 + 1e-9) return { ok:false, msg:"Two moles of water: 2(−285.8)." };
      return { ok:false, msg:"Write the full equation with <i>x</i>, then solve. Check that substituting back gives the given " + HRh + "." };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Energy technologies ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  var FU = s1.fuels.map(function(f){ var eq = { r:f.r, p:f.p }, dh = dHrxn(eq), co2 = nOf(f.p, "CO2(g)"); return { id:f.id, f:f.f, M:f.M, dh:dh, pg:Math.abs(dh) / f.M, co2:co2, pc:co2 ? Math.abs(dh) / co2 : 0 }; });
  function fu(id){ return FU.filter(function(x){ return x.id === id; })[0]; }
  function nm(id){ return CF(bare(fu(id).f)); }
  var KEY = { mol:function(x){ return Math.abs(x.dh); }, g:function(x){ return x.pg; }, co2:function(x){ return x.pc; } };
  function pool(rk){ return FU.filter(function(x){ return rk !== "co2" || x.co2 > 0; }).map(function(x){ return x.id; }); }
  function best(rk){ var k = KEY[rk]; return pool(rk).slice().sort(function(a, b){ return k(fu(b)) - k(fu(a)); }); }
  S.rk = obj(S.rk); S.rr = obj(S.rr); S.pw = obj(S.pw); S.k3 = obj(S.k3);
  s1.ranks.forEach(function(r){ S.rk[r.id] = (Array.isArray(S.rk[r.id]) ? S.rk[r.id] : []).filter(function(id){ return pool(r.id).indexOf(id) >= 0; }); if (S.rr[r.id] && typeof S.rr[r.id] !== "object") S.rr[r.id] = null; });

  host.innerHTML =
    '<div class="part sf-st"><h3>' + s1.title + "</h3><p>" + s1.intro + "</p>" +
      MV.tableHTML({ head:["Fuel", HCh + " (kJ/mol)", "Molar mass (use these values)", "Energy per gram", "Mol CO₂ per mol fuel", "Energy per mol CO₂"],
        rows:FU.map(function(x){ return [nm(x.id), vf(x.dh), fx(x.M, 1) + " g/mol", "≈ " + Math.round(x.pg) + " kJ/g", String(x.co2), x.co2 ? vf(x.pc) + " kJ" : "none released"]; }), caption:"Fuel comparison (liquid water)" }) +
      '<p class="tiny muted">' + s1.note + '</p><div class="sf-ranks"></div></div>' +
    '<div class="part sf-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="sf-cards"></div><p class="tiny muted sf-on">' + s2.note + "</p></div>" +
    '<div class="part sf-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><svg class="sf-kiln" viewBox="0 0 360 120" role="img" aria-label=""></svg><div class="sf-k" data-q="q1"></div><div class="sf-k" data-q="q2"></div><div class="sf-kdone" aria-live="polite"></div></div>';

  // ----- station 1: rankings -----
  var rks = $(".sf-ranks", host);
  function rkHTML(r){
    var list = S.rk[r.id], pl = pool(r.id), res = S.rr[r.id], done = res && res.ok;
    var h = '<div class="sf-rank" data-rk="' + r.id + '"><p class="sf-rkh"><strong>' + r.t + "</strong>: most energy → least</p>";
    h += '<div class="sf-rkp" role="group" aria-label="' + esc(MV.plain(r.t)) + ': fuels to place">' + FU.map(function(x){
      var out = pl.indexOf(x.id) < 0, used = list.indexOf(x.id) >= 0;
      return '<button type="button" class="chip" data-rka="' + x.id + '" data-k="rk' + r.id + x.id + '"' + (out || used || done ? " disabled" : "") + (out ? ' title="releases no CO₂"' : "") + ">" + nm(x.id) + (out ? ' <span class="tiny">(no CO₂)</span>' : "") + "</button>";
    }).join("") + "</div>";
    h += '<ol class="sf-rkl">' + list.map(function(id, i){ return '<li><button type="button" class="sf-rki" data-rkd="' + id + '" data-k="rkd' + r.id + id + '" aria-label="Remove ' + esc(MV.plain(nm(id))) + " from place " + (i + 1) + '"' + (done ? " disabled" : "") + ">" + nm(id) + (done ? ' <span class="tiny">' + vf(KEY[r.id](fu(id))) + (r.id === "g" ? " kJ/g" : " kJ") + "</span>" : ' <span aria-hidden="true">×</span>') + "</button></li>"; }).join("") +
      (list.length < pl.length && !done ? '<li class="muted sf-rkn">tap a fuel</li>' : "") + "</ol>";
    if (!done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-rkc="1" data-k="rkc' + r.id + '">Check</button><button type="button" class="btn ghost sm" data-rkx="1" data-k="rkx' + r.id + '">Clear</button></div>';
    if (res) h += res.ok ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s1.good) : res.soft ? MV.fbHTML("", res.msg) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + res.msg);
    return h + "</div>";
  }
  function paintS1(){ MV.keepFocus(rks, function(){ rks.innerHTML = s1.ranks.map(rkHTML).join(""); }); }
  rks.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-rk]"), rk = box.dataset.rk, list = S.rk[rk];
    if (b.dataset.rka) { if (list.indexOf(b.dataset.rka) < 0) list.push(b.dataset.rka); S.rr[rk] = null; }
    else if (b.dataset.rkd) { list.splice(list.indexOf(b.dataset.rkd), 1); S.rr[rk] = null; }
    else if (b.dataset.rkx) { S.rk[rk] = []; S.rr[rk] = null; }
    else if (b.dataset.rkc) {
      var want = best(rk), name = s1.ranks.filter(function(r){ return r.id === rk; })[0].t;
      if (list.length < want.length) S.rr[rk] = { soft:true, msg:"Place all " + want.length + " fuels first." };
      else if (list.join() === want.join()) S.rr[rk] = { ok:true };
      else {
        var right = list.filter(function(id, i){ return want[i] === id; }).length, other = s1.ranks.filter(function(r){ if (r.id === rk) return false; var o = best(r.id).filter(function(id){ return want.indexOf(id) >= 0; }); return o.join() === list.join(); })[0];
        S.rr[rk] = { ok:false, msg:(other ? "That’s the ranking " + other.t.toLowerCase().replace(" (carbon fuels)", "") + ", not " + name.toLowerCase().replace(" (carbon fuels)", "") + ". " : right + " of " + want.length + " are in the right place. ") + s1.bad };
      }
      api.save(); paintS1(); MV.focusFb(rks.querySelector('[data-rk="' + rk + '"]')); return;
    }
    api.save(); paintS1();
  });
  paintS1();

  // ----- station 2: power options -----
  var cards = $(".sf-cards", host);
  function tOf(list, id){ var x = list.filter(function(y){ return y.id === id; })[0]; return x ? x.t : ""; }
  cards.innerHTML = s2.cards.map(function(c){ return '<div class="sf-card" data-card="' + c.id + '"><h4>' + c.t + '</h4><div class="sf-cb"></div><div class="sf-cd"></div><div class="sf-cfb" aria-live="polite"></div></div>'; }).join("");
  function cardFb(c){
    var s = S.pw[c.id] || {}, el = $('[data-card="' + c.id + '"] .sf-cfb', cards), an = MV.ans(c) || { b:[], d:[] };
    if (!s.b || !s.d) { el.innerHTML = ""; return; }
    var okB = an.b.indexOf(s.b) >= 0, okD = an.d.indexOf(s.d) >= 0, msg = [];
    if (okB && okD) { el.innerHTML = MV.fbHTML("good", "<strong>✓</strong> " + c.t + ": " + tOf(s2.benefits, s.b) + ", but " + tOf(s2.drawbacks, s.d) + "."); return; }
    if (!okB) msg.push(s.b === "low" ? "A natural-gas plant burns fuel, so its CO₂ in operation isn’t low." : "Wind and sunlight come and go, so it can’t run whenever you want.");
    if (!okD) msg.push(s.d === "wx" ? "It doesn’t depend on the weather." : s.d === "flood" ? "Only a dam floods land." : s.d === "h2" ? "Only the fuel cell runs on hydrogen." : s.d === "burn" ? "It doesn’t burn fuel." : "It doesn’t turn heat into electricity, so heat loss isn’t its main limit.");
    el.innerHTML = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg.join(" ") + " Try another chip.");
  }
  s2.cards.forEach(function(c){
    var box = $('[data-card="' + c.id + '"]', cards), s = S.pw[c.id] = obj(S.pw[c.id]);
    radios($(".sf-cb", box), { label:"Benefit", cls:"chips", aria:c.t + ": benefit", options:s2.benefits, value:s.b || "", onChange:function(v){ s.b = v; api.save(); cardFb(c); } });
    radios($(".sf-cd", box), { label:"Drawback", cls:"chips", aria:c.t + ": drawback", options:s2.drawbacks, value:s.d || "", onChange:function(v){ s.d = v; api.save(); cardFb(c); } });
    cardFb(c);
  });

  // ----- station 3: the lime kiln -----
  var kiln = $(".sf-kiln", host), kdone = $(".sf-kdone", host), KN = sv(dHrxn({ r:[[1, "CaCO3(s)"]], p:[[1, "CaO(s)"], [1, "CO2(g)"]] })), MC = vf(dHrxn(combEq("CH4(g)")));
  function paintKiln(){
    var h = "", ok1 = S.k3.q1 != null && MV.ok(s3.q1.options[S.k3.q1]), ok2 = S.k3.q2 != null && MV.ok(s3.q2.options[S.k3.q2]);
    h += rect(20, 40, 120, 56, "var(--paper)", { s:"var(--ink)", sw:2, rx:8 }) + tx(80, 58, "kiln", { fs:12, w:700 }) + tx(80, 78, "CaCO₃ → CaO", { fs:11 });
    h += tx(80, 108, KN + " kJ needed", { fs:11, c:"var(--en-dh)", w:700 });
    h += vArrow(80, 30, 40, 1, { w:2 }) + tx(150, 22, (ok1 ? "burn ≈ 0.2 mol CH₄ (" : "burn CH₄ (") + MC + " kJ/mol)", { a:"start", fs:11 });
    h += ln(140, 68, 196, 68, { c:"var(--ink-2)", w:1.6 }) + head(204, 68, 0, 9, "var(--ink-2)");
    var c1 = "1 mol CO₂ from CaCO₃", c2 = ok1 ? "≈ 0.2 mol CO₂ from the fuel" : "? mol CO₂ from the fuel";
    h += rect(210, 44, 140, 22, "var(--sheet)", { s:"var(--ink-2)", sw:1.3, rx:11 }) + tx(280, 55, c1, { fs:10.5 });
    h += rect(210, 72, 140, 22, "var(--sheet)", { s:"var(--ink-2)", sw:1.3, rx:11, op:ok1 ? 1 : 0.6 }) + tx(280, 83, c2, { fs:10.5 });
    h += tx(280, 108, ok2 ? "total ≈ 1.2 mol CO₂" : "total ?", { fs:11.5, w:700 });
    kiln.innerHTML = h;
    kiln.setAttribute("aria-label", "A lime kiln: CaCO₃ → CaO needs " + MV.plain(KN) + " kJ per mol, supplied by burning methane at " + MV.plain(MC) + " kJ/mol. It gives off 1 mol CO₂ from the limestone" + (ok1 ? " plus about 0.2 mol from the fuel" : " plus CO₂ from the fuel") + (ok2 ? ": about 1.2 mol in total." : "."));
    kdone.innerHTML = ok1 && ok2 ? MV.fbHTML("good", "<strong>✓</strong> " + s3.done) : "";
  }
  ["q1", "q2"].forEach(function(q){
    var box = $('[data-q="' + q + '"]', host), it = s3[q], fb = document.createElement("div"); fb.setAttribute("aria-live", "polite");
    var rh = document.createElement("div"); box.appendChild(rh); box.appendChild(fb);
    function paintFb(){ var k = S.k3[q]; fb.innerHTML = k == null || !it.options[k] ? "" : MV.ok(it.options[k]) ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.options[k].why) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + it.options[k].why); }
    radios(rh, { label:it.prompt, cls:"chips", aria:it.prompt, options:it.options.map(function(o, i){ return { id:String(i), t:o.t }; }), value:S.k3[q] == null ? "" : String(S.k3[q]),
      onChange:function(v){ S.k3[q] = +v; api.save(); paintFb(); paintKiln(); } });
    paintFb();
  });
  paintKiln();
}

// ---------- Practice 2: ΔH°f calculations (number entry with units; adapted from SCH4U 14's calcAct) ----------
function calcAct(host, api, a){
  var S = api.S; S.items = obj(S.items);
  var msgs = {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="sf-ctab"></div><div class="sf-citems"></div>';
  MV.chem.tablePanel($(".sf-ctab", host), "dhf", { open:true, title:"Course data table: standard enthalpies of formation" });
  var box = $(".sf-citems", host);
  function ist(id){ var x = S.items[id] = obj(S.items[id]); if (!Array.isArray(x.val)) x.val = ["", ""]; x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function numHTML(it, x, k, dis){ var lab = it.kind === "pair" ? it.labels[k] : "Your answer:"; return '<div class="numrow"><label for="ci-' + it.id + k + '">' + lab + '</label><input class="numin" id="ci-' + it.id + k + '" data-cin="' + it.id + '" data-ck="' + k + '" data-k="ci' + it.id + k + '" type="number" step="any" autocomplete="off" value="' + esc(x.val[k]) + '"' + dis + '><span class="sf-unit">' + (it.unit || "") + "</span></div>"; }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += numHTML(it, x, 0, dis) + (it.kind === "pair" ? numHTML(it, x, 1, dis) : "");
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(box, function(){ box.innerHTML = a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function one(s){ var v = MV.parseNum(String(s || "").replace(/[a-z/]+/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, w){ return Math.abs(v - w) <= 0.1 + 1e-9; }
  function judge(it, x){
    var ans = MV.ans(it);
    if (it.kind === "pair") {
      var v0 = one(x.val[0]), v1 = one(x.val[1]);
      if (v0 == null || v1 == null) return { bad:"Enter both values." };
      var a0 = Math.abs(v0), a1 = Math.abs(v1);
      if (near(a0, ans[0]) && near(a1, ans[1])) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return near(z.k ? a1 : a0, z.match); })[0];
      return { fb:w ? w.fb : it.fb };
    }
    var v = one(x.val[0]);
    if (v == null) return { bad:"Enter one number, such as −566.0." };
    if (near(v, ans)) return { ok:true };
    var w2 = (it.wrong || []).filter(function(z){ return near(v, z.match); })[0];
    return { fb:w2 ? w2.fb : it.fb };
  }
  box.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.cin; if (!id) return; ist(id).val[+e.target.dataset.ck] = e.target.value; api.save(); });
  box.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = box.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); } });
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(box.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Fill the tank ----------
var task = (function(){
  var S = null, api = null;
  var FUELS = ["H2(g)", "CH4(g)", "C3H8(g)", "CH3OH(l)", "C2H5OH(l)"];
  function dhc(sp){ return dHrxn(combEq(sp)); }
  function carb(sp){ return atoms(sp).C || 0; }
  function num(s){ var v = MV.parseNum(String(s == null ? "" : s).trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function read(){ return { fuel:FUELS.indexOf(S.fuel) >= 0 ? S.fuel : "", mol:clamp(Math.round(+S.mol || 1), 1, 8), dh:typeof S.dh === "string" ? S.dh : "", v:num(S.dh) }; }
  function paint(){
    var d = read(), pv = $("#sf-tpv"); if (!pv) return;
    var E = d.fuel ? d.mol * Math.abs(dhc(d.fuel)) : 0, co2 = d.fuel ? d.mol * carb(d.fuel) : 0, W = 300, EM = 4500, bx = 40;
    function ex(e){ return bx + Math.min(e, EM) / EM * W; }
    var h = tx(bx, 14, "Heat delivered (kJ)", { a:"start", fs:11.5, w:700 }) + rect(bx, 24, W, 22, "var(--paper)", { s:"var(--rule)", sw:1.3, rx:4 });
    if (E > 0) h += rect(bx, 24, ex(E) - bx, 22, "var(--en-dh)", { rx:4, op:0.85 });
    h += ln(ex(2000), 18, ex(2000), 52, { c:"var(--ink)", w:2, d:"4 3" }) + tx(ex(2000), 60, "2000 kJ", { fs:10.5 });
    h += tx(bx + W, 14, d.fuel ? r1(E).toFixed(1) + " kJ" : "—", { a:"end", fs:11.5, w:700 });
    h += tx(bx, 84, "CO₂ released", { a:"start", fs:11.5, w:700 });
    for (var i = 0; i < 8; i++) { var cx = bx + 18 + i * 36, on = i < co2; h += circ(cx, 106, 13, on ? "var(--ink-2)" : "none", { s:i < 3 ? "var(--ink-2)" : "var(--rule)", sw:1.3, op:on ? 0.85 : 1 }) + tx(cx, 106.5, on ? "CO₂" : "", { fs:8.5, w:700, c:"var(--sheet)" }); }
    h += ln(bx + 18 + 2.5 * 36, 90, bx + 18 + 2.5 * 36, 124, { c:"var(--ink)", w:2, d:"4 3" }) + tx(bx + 18 + 2.5 * 36, 132, "limit: 3 mol", { fs:10.5 });
    h += tx(bx + W, 84, d.fuel ? co2 + " mol" : "—", { a:"end", fs:11.5, w:700 });
    h += tx(bx, 158, "Tank (mol of fuel)", { a:"start", fs:11.5, w:700 });
    for (var j = 0; j < 8; j++) h += rect(bx + j * 37, 168, 33, 20, j < d.mol && d.fuel ? "var(--pen)" : "none", { s:j < 5 ? "var(--ink-2)" : "var(--rule)", sw:1.3, rx:3, op:j < d.mol && d.fuel ? 0.8 : 1 });
    h += ln(bx + 5 * 37 - 2, 162, bx + 5 * 37 - 2, 194, { c:"var(--ink)", w:2, d:"4 3" }) + tx(bx + 5 * 37 - 2, 202, "holds 5 mol", { fs:10.5 });
    pv.innerHTML = h;
    pv.setAttribute("aria-label", d.fuel ? "Heater: " + d.mol + " mol of " + uF(bare(d.fuel)) + " gives " + r1(E).toFixed(1) + " kJ of heat (target at least 2000 kJ) and " + co2 + " mol of CO₂ (limit 3 mol). The tank holds 5 mol." : "No fuel chosen yet.");
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; if (FUELS.indexOf(S.fuel) < 0) S.fuel = ""; S.mol = clamp(Math.round(+S.mol || 1), 1, 8); if (typeof S.dh !== "string") S.dh = "";
      inp.innerHTML = '<div class="sf-tfu"></div><div class="sf-tmo"></div><div class="numrow"><label for="sf-tdh">Your ' + HCh + ':</label><input class="numin" id="sf-tdh" type="number" step="any" autocomplete="off" value="' + esc(S.dh) + '"><span class="sf-unit">kJ/mol</span></div>' +
        '<p class="tiny muted">Use the course table: products minus reactants, with liquid water.</p>';
      MV.chem.tablePanel(inp, "dhf", { title:"Course data table: standard enthalpies of formation" });
      pv.innerHTML = '<h4 class="sf-h4">Your heater</h4><svg class="sf-tsvg" id="sf-tpv" viewBox="0 0 380 210" role="img" aria-label=""></svg>';
      radios($(".sf-tfu", inp), { label:"Fuel", cls:"chips", aria:"Fuel", options:FUELS.map(function(sp){ return { id:sp, t:CF(bare(sp)) }; }), value:S.fuel,
        onChange:function(v){ S.fuel = v; api.save(); paint(); api.update(); } });
      radios($(".sf-tmo", inp), { label:"Moles", cls:"chips", aria:"Moles of fuel", options:[1, 2, 3, 4, 5, 6, 7, 8].map(function(n){ return { id:String(n), t:String(n) }; }), value:String(S.mol),
        onChange:function(v){ S.mol = +v; api.save(); paint(); api.update(); } });
      $("#sf-tdh").addEventListener("input", function(e){ S.dh = e.target.value; api.save(); api.update(); });
      paint();
    },
    read:read,
    valid:function(d){ if (!d.fuel) return "Choose a fuel."; if (d.v == null) return "Type your " + HCh + " for " + CF(bare(d.fuel)) + " (kJ/mol)."; return true; },
    checks:function(d){ var t = dhc(d.fuel); return [Math.abs(d.v - t) <= 0.2 + 1e-9, d.mol * Math.abs(t) >= 2000 - 1e-9, d.mol * carb(d.fuel) <= 3, d.mol <= 5]; },
    key:function(d){ return d.fuel + "*" + d.mol; },
    label:function(k){ var p = k.split("*"); return CF(bare(p[0])) + " × " + p[1]; },
    text:function(k){ var p = k.split("*"); return uF(bare(p[0])) + " × " + p[1]; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ calc:calcAct },
  task:task
});
})();
