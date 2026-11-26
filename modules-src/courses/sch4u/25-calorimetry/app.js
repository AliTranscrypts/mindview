// SCH4U 25 Calorimetry: hero (two solutions pour into nested cups, the thermometer climbs 20.0 → 26.0 °C, heat arrows,
// the calculation types itself), Calorimeter (Explore: C5 coffee-cup / bomb / temperature–time calorimeter with a
// heat-loss toggle, metal mode and a live K21 temperature–time trace), Why the measured value is off (Part 3: can
// calorimeter data, error-source sorter, extrapolation ruler on a temperature–time graph, design fixes), Calorimetry
// problems (custom number entry with a sign check, plus a fuel choice) and Design the run (task: live gauges).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function LIN(t){ return t; }
var fx = MV.chem.fx, F = MV.chem.f, css = MV.css;
function sig(v, n){ if (!v) return "0"; var e = Math.floor(Math.log10(Math.abs(Number(v.toPrecision(n))))); return fx(Number(v.toPrecision(n)), Math.max(0, n - 1 - e)); }
function sgn(s, v){ return (v > 0 ? "+" : "") + s; }                       // s already formatted (true minus from fx)
var Q = "<i>q</i>", QR = "<i>q</i><sub>rxn</sub>", QW = "<i>q</i><sub>water</sub>", DH = "Δ<i>H</i>", DT = "Δ<i>T</i>", CCAL = "<i>C</i><sub>cal</sub>";

// ---------- course data (C13) ----------
var D = MV.chem.data, CW = D.const.cWater, CMET = D.const.c;
function dhf(sp){ var r = D.dHf.filter(function(x){ return x[0] === sp; })[0]; return r ? r[1] : 0; }
function rd(v){ return Math.round(v * 10) / 10; }
// Accepted values, all derived from the course tables: H⁺ + OH⁻ → H₂O (H⁺(aq) = 0), combustions to CO₂(g) + H₂O(l).
var DH_NEUT = rd(dhf("H2O(l)") - dhf("OH-(aq)"));                                          // −55.8 kJ/mol
var DH_SALT = parseFloat((D.misc.filter(function(x){ return /NH4NO3 dissolving, ΔH/.test(x[0]); })[0] || [0, "+25.7"])[1]); // +25.7
var FUEL = {
  CH4:{ name:"methane", f:"CH4", dh:rd(dhf("CO2(g)") + 2 * dhf("H2O(l)") - dhf("CH4(g)")) },               // −890.5
  C2H5OH:{ name:"ethanol", f:"C2H5OH", dh:rd(2 * dhf("CO2(g)") + 3 * dhf("H2O(l)") - dhf("C2H5OH(l)")) },  // −1366.8
  C6H12O6:{ name:"glucose", f:"C6H12O6", dh:rd(6 * dhf("CO2(g)") + 6 * dhf("H2O(l)") - dhf("C6H12O6(s)")) } // −2802.5
};
var DH_PROP = rd(3 * dhf("CO2(g)") + 4 * dhf("H2O(l)") - dhf("C3H8(g)"));                   // −2219.9 ≈ −2220
// VERIFY: "Use these values" molar mass of NH₄NO₃ = 80.0 g/mol (plan §6 risk 1); not in MV.chem.data.Mr.
var M_SALT = 80.0;
var METALS = { Al:"aluminium", Fe:"iron", Cu:"copper" };
var VOLS = [25, 50, 75, 100], CONCS = [0.5, 1, 2];
var TI = 20.0, TMETAL = 100.0, MWATER = 100.0, LOSS = 0.9, DRIFT = 0.05;

// ---------- the model ----------
// set: {app, proc, va, vb, conc, salt, metal, mm, fuel, nf, cc, loss}
function compute(s){
  var f = s.loss === "real" ? LOSS : 1, r = { set:s, app:s.app, proc:s.app === "bomb" ? "bomb" : s.proc, ti:TI, real:s.loss === "real" };
  if (r.proc === "bomb") {
    var fu = FUEL[s.fuel]; r.fu = fu; r.n = s.nf; r.cc = s.cc;
    r.dT = f * s.nf * -fu.dh / s.cc; r.qcal = s.cc * r.dT; r.qr = -r.qcal; r.dH = r.qr / r.n; r.acc = fu.dh; r.heat = r.qcal;
  } else if (r.proc === "neut") {
    var na = s.conc * s.va / 1000, nb = s.conc * s.vb / 1000; r.na = na; r.nb = nb; r.n = Math.min(na, nb); r.m = s.va + s.vb;
    r.lim = Math.abs(na - nb) < 1e-9 ? "HCl and NaOH equal" : na < nb ? "HCl (limiting)" : "NaOH (limiting)";
    r.dT = f * r.n * -DH_NEUT * 1000 / (r.m * CW); r.qw = r.m * CW * r.dT; r.qr = -r.qw / 1000; r.dH = r.qr / r.n; r.acc = DH_NEUT; r.heat = r.qw / 1000;
  } else if (r.proc === "salt") {
    r.n = s.salt / M_SALT; r.m = MWATER; r.mass = s.salt;
    r.dT = -f * r.n * DH_SALT * 1000 / (r.m * CW); r.qw = r.m * CW * r.dT; r.qr = -r.qw / 1000; r.dH = r.qr / r.n; r.acc = DH_SALT; r.heat = -r.qw / 1000;
  } else {
    var mc = s.mm * CMET[s.metal], tfi = (mc * TMETAL + MWATER * CW * TI) / (mc + MWATER * CW);
    r.metal = s.metal; r.mm = s.mm; r.m = MWATER; r.dT = f * (tfi - TI); r.qw = MWATER * CW * r.dT; r.qm = -r.qw;
    r.dTm = TI + r.dT - TMETAL; r.cMeas = r.qm / (s.mm * r.dTm); r.acc = CMET[s.metal]; r.heat = r.qw / 1000;
  }
  r.tf = r.ti + r.dT;
  r.pct = r.proc === "metal" ? Math.abs(r.cMeas - r.acc) / r.acc * 100 : Math.abs(r.dH - r.acc) / Math.abs(r.acc) * 100;
  r.exo = r.dT > 0;
  return r;
}
function setKey(s){
  if (s.app === "bomb") return ["bomb", s.fuel, s.nf, s.cc, s.loss].join("|");
  if (s.proc === "neut") return ["cup", "neut", s.va, s.vb, s.conc, s.loss].join("|");
  if (s.proc === "salt") return ["cup", "salt", s.salt, s.loss].join("|");
  return ["cup", "metal", s.metal, s.mm, s.loss].join("|");
}
// temperature–time trace: readings from −1 min, mixing at 0, maximum at 2 min, then flat (ideal) or a slow drift back (real)
function traceT(r, t){
  if (t <= 0) return r.ti;
  if (t <= 2) { var s = t / 2; return r.ti + r.dT * (1 - (1 - s) * (1 - s)); }
  return r.ti + r.dT - (r.real ? DRIFT * r.dT * (t - 2) : 0);
}
function nArrows(r){ return r.proc === "bomb" ? clamp(Math.round(r.qcal / 6), 2, 12) : clamp(Math.round(Math.abs(r.heat) * 1.4), 2, 12); }
function tC(v){ return fx(v, 2) + " °C"; }
function volT(v){ return fx(v, 1) + " mL"; }
function concT(c){ return fx(c, 2) + " mol/L"; }

// @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked, tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled && host.contains(b)) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '"' + (o.i ? ' font-style="italic"' : "") + ' fill="' + (o.c || "var(--ink)") + '"' +
    (o.halo ? ' paint-order="stroke" stroke="var(--sheet)" stroke-width="3.2" stroke-linejoin="round"' : "") + opA(o.op) + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function path(d, o){ o = o || {}; return '<path d="' + d + '" fill="' + (o.f || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '" stroke-linejoin="round" stroke-linecap="round"' : "") + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function head(x, y, ang, len, fill, op){
  var a1 = ang + Math.PI - 0.45, a2 = ang + Math.PI + 0.45;
  return '<path d="M' + r1(x) + " " + r1(y) + " L" + r1(x + len * Math.cos(a1)) + " " + r1(y + len * Math.sin(a1)) + " L" + r1(x + len * Math.cos(a2)) + " " + r1(y + len * Math.sin(a2)) + ' Z" fill="' + fill + '"' + opA(op) + "/>";
}
// heat arrow (orange) from (x1, y1) to (x2, y2), drawn for fraction t of its length
function heatArrow(x1, y1, x2, y2, t, o){
  o = o || {}; if (t <= 0) return "";
  var xe = lerp(x1, x2, t), ye = lerp(y1, y2, t), a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(xe - x1, ye - y1), c = "var(--en-dh)";
  return (L > 7 ? ln(x1, y1, xe - 5 * Math.cos(a), ye - 5 * Math.sin(a), { c:c, w:o.w || 2.4, d:o.d, op:o.op }) : "") + head(xe, ye, a, 8, c, o.op);
}
function water(x, y, op){ var o = MV.chem.atom("O"), h = MV.chem.atom("H"); return circ(x - 5, y + 4, 2.9, h.fill, { s:h.line, sw:1, op:op }) + circ(x + 5, y + 4, 2.9, h.fill, { s:h.line, sw:1, op:op }) + circ(x, y, 4.4, o.fill, { op:op }); }
function thermo(x, yTop, yBot, T, lo, hi, lab){
  var yb = yBot + 8, yl = lerp(yBot, yTop + 6, clamp((T - lo) / (hi - lo), 0, 1)), h = "";
  h += rect(x - 4.5, yTop, 9, yBot - yTop + 4, "var(--sheet)", { rx:4.5, s:"var(--ink-2)", sw:1.4 }) + circ(x, yb, 7.5, "var(--ink)");
  h += rect(x - 2, yl, 4, yb - yl, "var(--ink)");
  if (lab) h += tx(x + 12, yTop + 8, lab, { a:"start", fs:13, w:700, halo:true });
  return h;
}

// ---------- hero ----------
function hero(f){
  var svg = $("#cal-hx-svg"), ctr = $("#cal-hx-ctr"), calc = $("#cal-hx-calc"), rep = $("#cal-hx-replay"), cap = f.cap;
  if (!svg) return;
  var CALC = Q + " = 100.0 g × 4.18 × 6.0 = 2508 J → " + DH + " = −2.508 kJ ÷ 0.0500 mol = −50.2 kJ/mol", run = 0, st;
  var PLAIN = MV.plain(CALC);
  var AR = [[112, 214], [150, 238], [118, 186], [162, 202], [130, 160], [176, 172]];
  function reset(){ st = { pour:0, lid:0, T:20.0, arr:0, typ:0 }; }
  function draw(){
    var h = "", lvl = lerp(250, 150, st.pour), lidY = lerp(-34, 0, st.lid);
    // pouring beakers
    if (st.pour < 1) {
      var op = 1 - st.pour * 0.9;
      h += path("M58 40 L58 92 L92 92 L92 40", { s:"var(--ink-2)", sw:1.6, op:op }) + path("M206 40 L206 92 L240 92 L240 40", { s:"var(--ink-2)", sw:1.6, op:op });
      h += tx(75, 104, "HCl(aq)", { fs:11, c:"var(--ink-2)", op:op }) + tx(223, 104, "NaOH(aq)", { fs:11, c:"var(--ink-2)", op:op });
      if (st.pour > 0) h += ln(92, 92, 118, lvl, { c:"var(--rule)", w:4, op:op }) + ln(206, 92, 180, lvl, { c:"var(--rule)", w:4, op:op });
    }
    // nested cups
    h += path("M86 120 L100 262 L198 262 L212 120 Z", { s:"var(--ink-2)", sw:2 });
    h += path("M95 124 L108 256 L190 256 L203 124", { s:"var(--ink-2)", sw:1.6 });
    if (st.pour > 0) h += path("M" + r1(lerp(108, 95, (256 - lvl) / 132)) + " " + r1(lvl) + " L108 256 L190 256 L" + r1(lerp(190, 203, (256 - lvl) / 132)) + " " + r1(lvl) + " Z", { f:"var(--info-bg)" });
    [[120, 228], [170, 222], [140, 190], [182, 186], [112, 168], [156, 162]].forEach(function(p, i){ if (p[1] > lvl + 6) h += water(p[0] + 14, p[1], 0.9); void i; });
    AR.forEach(function(p, i){
      if (p[1] <= lvl + 6) return;
      h += circ(p[0], p[1], 3, "var(--ink-2)") + circ(p[0] + 5, p[1] + 3, 2.4, "var(--ink-2)");
      var t = clamp(st.arr * 1.6 - i * 0.12, 0, 1); h += heatArrow(p[0] + 4, p[1], p[0] + 28, p[1] - 6, t);
    });
    // lid, stirrer, thermometer
    h += '<g transform="translate(0 ' + r1(lidY) + ')"' + opA(lerp(0.35, 1, st.lid)) + ">" + rect(80, 110, 138, 10, "var(--sheet)", { rx:3, s:"var(--ink-2)", sw:1.8 }) + "</g>";
    h += ln(124, 72, 124, 246, { c:"var(--ink-2)", w:2 }) + path("M112 246 Q124 252 136 246", { s:"var(--ink-2)", sw:2 });
    h += thermo(176, 30, 232, st.T, 15, 30, fx(st.T, 1) + " °C");
    // equation with labels
    h += tx(360, 70, '<tspan font-style="italic">q</tspan> = <tspan font-style="italic">m c</tspan> Δ<tspan font-style="italic">T</tspan>', { fs:34, w:600 });
    h += ln(310, 92, 310, 118, { c:"var(--ink-2)", w:1.2 }) + tx(310, 128, "heat (J)", { fs:11.5 });
    h += ln(347, 92, 342, 150, { c:"var(--ink-2)", w:1.2 }) + tx(342, 160, "mass (g)", { fs:11.5 });
    h += ln(372, 92, 388, 186, { c:"var(--ink-2)", w:1.2 }) + tx(388, 196, "specific heat capacity", { fs:11.5 }) + tx(388, 210, "J/(g·°C)", { fs:11.5, c:"var(--ink-2)" });
    h += ln(408, 92, 436, 124, { c:"var(--ink-2)", w:1.2 }) + tx(440, 134, "temperature", { fs:11.5 }) + tx(440, 148, "change (°C)", { fs:11.5 });
    svg.innerHTML = h;
    var n = Math.round(st.typ * PLAIN.length);
    calc.innerHTML = st.typ >= 1 ? CALC : esc(PLAIN.slice(0, n));
  }
  function final(){ st = { pour:1, lid:1, T:26.0, arr:1, typ:1 }; draw(); ctr.textContent = "The water gained 2508 J, so the reaction lost 2508 J."; cap.textContent = "Measure the water, and you’ve measured the reaction."; rep.hidden = false; }
  function play(){
    var id = ++run; reset(); rep.hidden = true; cap.textContent = ""; draw();
    function ok(){ return id === run; }
    ctr.textContent = "Two clear solutions pour into the cup…";
    MV.tween({ dur:1300, ease:LIN, step:function(t){ if (!ok()) return; st.pour = t; draw(); }, done:function(){
      if (!ok()) return;
      MV.tween({ dur:500, step:function(t){ if (!ok()) return; st.lid = t; draw(); }, done:function(){
        if (!ok()) return; ctr.textContent = "The reaction releases heat into the water: the thermometer climbs.";
        MV.tween({ dur:2200, step:function(t){ if (!ok()) return; st.T = lerp(20.0, 26.0, t); st.arr = t; draw(); }, done:function(){
          if (!ok()) return; ctr.textContent = "Now the calculation…";
          MV.tween({ dur:2600, ease:LIN, step:function(t){ if (!ok()) return; st.typ = t; draw(); }, done:function(){ if (!ok()) return; MV.wait(500, function(){ if (ok()) final(); }); } });
        } });
      } });
    } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: C5 calorimeter ----------
// @component C5 calorimeter — coffee-cup (neutralization, NH₄NO₃ dissolving, hot metal), bomb and temperature–time modes;
// Ideal / Real heat-loss toggle (Real: ΔT is 90% of ideal, then a slow drift back); SVG apparatus with a numeric thermometer,
// orange heat arrows (count ∝ heat; direction follows exo/endo; faint leaks through the wall in Real), a live MV.Plot trace,
// readout and worked strip. calApparatus(r, a, set) -> SVG string; compute(set) -> result.
function cupLevel(V){ return 262 - V * 0.8; }
function cupX(y, side){ var t = (y - 124) / 132; return side < 0 ? lerp(95, 108, t) : lerp(203, 190, t); }
function calApparatus(set, r, a){
  // a: {t (sim minutes, −1..10), pour 0..1} ; r: result or null (setup)
  var h = "", bomb = set.app === "bomb", t = a ? a.t : r ? 10 : -1, T = r ? traceT(r, t) : TI, ar = r ? clamp(t / 2, 0, 1) : 0;
  if (!bomb) {
    var V = set.proc === "neut" ? set.va + set.vb : MWATER, lvF = cupLevel(V), pour = set.proc === "neut" && a ? clamp(a.t + 1, 0, 1) : 1;
    var lv = lerp(256, lvF, pour), lidUp = a && a.t < 0 ? 1 - clamp((a.t + 0.25) / 0.25, 0, 1) : 0;
    h += tx(8, 14, "Coffee-cup calorimeter", { a:"start", fs:12, w:700, c:"var(--ink-2)" });
    h += path("M86 120 L100 262 L198 262 L212 120 Z", { s:"var(--ink-2)", sw:2 }) + path("M95 124 L108 256 L190 256 L203 124", { s:"var(--ink-2)", sw:1.6 });
    if (pour > 0) h += path("M" + r1(cupX(lv, -1)) + " " + r1(lv) + " L108 256 L190 256 L" + r1(cupX(lv, 1)) + " " + r1(lv) + " Z", { f:"var(--info-bg)" });
    if (set.proc === "neut" && a && a.t < 0) h += ln(150, 64, 150, lv, { c:"var(--rule)", w:5 });
    // particles and arrows
    var N = r ? nArrows(r) : 0, cols = [112, 140, 168], rows = [], y;
    for (y = 246; y > lv + 12; y -= 22) rows.push(y);
    var slots = []; rows.forEach(function(yy, i){ cols.forEach(function(xx, j){ slots.push([xx + (i % 2) * 8, yy - j * 3]); }); });
    if (set.proc === "metal") {
      var bw = set.mm >= 100 ? 52 : 38, by = a && a.t < 0 ? lerp(60, 226, clamp((a.t + 1) / 0.8, 0, 1)) : 226, bx = 150 - bw / 2;
      h += rect(bx, by, bw, 24, "var(--at-m)", { rx:3 }) + tx(150, by + 12, set.metal, { fs:12, w:700, c:"var(--sheet)" });
      [[100, 214], [124, 188], [176, 188], [196, 214], [150, 176], [112, 236], [188, 236], [136, 160], [166, 160], [150, 150], [118, 168], [182, 168]].forEach(function(p, i){
        if (p[1] > lv + 8) h += water(p[0], p[1], 0.85);
        if (i < N && by >= 226) { var sx = clamp(p[0], bx, bx + bw), sy = clamp(p[1], by, by + 24); h += heatArrow(sx, sy, lerp(sx, p[0], 0.72), lerp(sy, p[1], 0.72), ar, { w:2.2 }); }
      });
    } else {
      slots.forEach(function(p, i){
        h += water(p[0] + 26, p[1] - 4, 0.85);
        var pt = set.proc === "salt" ? rect(p[0] - 3, p[1] - 3, 6, 6, "var(--sheet)", { s:"var(--ink-2)", sw:1.2 }) : circ(p[0], p[1], 3, "var(--ink-2)") + circ(p[0] + 5, p[1] + 3, 2.4, "var(--ink-2)");
        if (i < N || !r) h += pt;
        if (r && i < N) h += r.exo ? heatArrow(p[0] + 6, p[1], p[0] + 20, p[1] - 4, ar) : heatArrow(p[0] + 20, p[1] - 4, p[0] + 6, p[1], ar);
      });
      if (set.proc === "salt" && a && a.t < 0) for (var k = 0; k < 5; k++) h += rect(132 + k * 9, lerp(60, lv - 4, clamp(a.t + 1 - k * 0.05, 0, 1)), 6, 6, "var(--sheet)", { s:"var(--ink-2)", sw:1.2 });
    }
    if (r && r.real && ar > 0) [[lv + 30, -1], [lv + 70, 1], [244, -1]].forEach(function(L){ if (L[0] > 250) return; var x0 = cupX(L[0], L[1]) - L[1] * 10; h += heatArrow(x0, L[0], x0 + L[1] * 34, L[0] - 6, ar, { op:0.45, d:"4 3", w:2 }); });
    h += '<g transform="translate(0 ' + r1(-34 * lidUp) + ')">' + rect(80, 110, 138, 10, "var(--sheet)", { rx:3, s:"var(--ink-2)", sw:1.8 }) + "</g>";
    h += ln(124, 70, 124, 246, { c:"var(--ink-2)", w:2 }) + path("M112 246 Q124 252 136 246", { s:"var(--ink-2)", sw:2 });
    h += thermo(184, 30, 236, T, Math.floor(Math.min(TI, r ? r.tf : TI) - 2), Math.ceil(Math.max(TI, r ? r.tf : TI) + 2), "<tspan font-style=\"italic\">T</tspan> = " + fx(T, 2) + " °C");
    if (r && r.real && ar > 0) h += tx(236, 278, "Real: some heat escapes", { fs:11, c:"var(--ink-2)" });
  } else {
    var fu = FUEL[set.fuel], N2 = r ? nArrows(r) : 0, fl = a && a.t >= 0 && a.t < 0.6 ? 1 - a.t / 0.6 : 0;
    h += tx(8, 14, "Bomb calorimeter", { a:"start", fs:12, w:700, c:"var(--ink-2)" });
    h += rect(36, 64, 248, 208, "none", { rx:6, s:"var(--ink-2)", sw:2 }) + rect(46, 74, 228, 190, "none", { rx:4, s:"var(--ink-2)", sw:1.4 });
    h += rect(47, 96, 226, 167, "var(--info-bg)");
    h += rect(122, 150, 76, 96, "var(--sheet)", { rx:10, s:"var(--ink-2)", sw:2.4 }) + tx(160, 236, "bomb", { fs:11, c:"var(--ink-2)" });
    h += ln(146, 40, 146, 186, { c:"var(--ink-2)", w:1.4 }) + ln(174, 40, 174, 186, { c:"var(--ink-2)", w:1.4 }) + path("M146 186 Q160 196 174 186", { s:"var(--ink-2)", sw:1.4 });
    h += rect(144, 202, 32, 12, "var(--rule)", { rx:2 }) + tx(160, 222, F(fu.f), { fs:10.5 });
    if (fl > 0) h += path("M160 182 L166 196 L178 194 L168 204 L174 216 L160 208 L146 216 L152 204 L142 194 L154 196 Z", { f:"var(--en-dh)", op:fl });
    var PTS = [[112, 160, 82, 150], [112, 198, 80, 198], [112, 236, 82, 246], [208, 160, 238, 150], [208, 198, 240, 198], [208, 236, 238, 246], [134, 142, 120, 114], [186, 142, 200, 114], [100, 180, 70, 176], [220, 180, 250, 176], [100, 220, 70, 224], [220, 220, 250, 224]];
    [[80, 130], [240, 130], [66, 196], [252, 196], [70, 250], [248, 250], [118, 108], [202, 108]].forEach(function(p){ h += water(p[0], p[1], 0.85); });
    if (r) PTS.slice(0, N2).forEach(function(p){ var x0 = p[0] < 160 ? 122 : p[0] > 160 ? 198 : p[0]; h += heatArrow(x0 + (p[0] < 160 ? -2 : 2), p[1], p[2], p[3], ar, { w:2.2 }); });
    if (r && r.real && ar > 0) [[90, -1], [180, 1], [240, -1]].forEach(function(L){ var x0 = L[1] < 0 ? 52 : 268; h += heatArrow(x0, L[0], x0 + L[1] * 30, L[0] - 6, ar, { op:0.45, d:"4 3", w:2 }); });
    h += ln(70, 50, 70, 248, { c:"var(--ink-2)", w:2 }) + path("M60 248 Q70 254 80 248", { s:"var(--ink-2)", sw:2 });
    h += thermo(250, 28, 236, T, Math.floor(TI - 2), Math.ceil((r ? r.tf : TI) + 2), "<tspan font-style=\"italic\">T</tspan> = " + fx(T, 2) + " °C");
  }
  return h;
}

function explore(host, api){
  var S = api.S, C = api.content, CH = C.challenges, TC3 = CH[2];
  if (["cup", "bomb", "tt"].indexOf(S.mode) < 0) S.mode = "cup";
  if (["cup", "bomb"].indexOf(S.app) < 0) S.app = "cup";
  if (["neut", "salt", "metal"].indexOf(S.proc) < 0) S.proc = "neut";
  S.va = VOLS.indexOf(+S.va) >= 0 ? +S.va : 50; S.vb = VOLS.indexOf(+S.vb) >= 0 ? +S.vb : 50; S.conc = CONCS.indexOf(+S.conc) >= 0 ? +S.conc : 1;
  S.salt = clamp(Math.round((+S.salt || 2) / 2) * 2, 2, 20); if (!METALS[S.metal]) S.metal = "Cu"; S.mm = +S.mm === 50 ? 50 : 100;
  if (!FUEL[S.fuel]) S.fuel = "CH4"; S.nfk = clamp(Math.round(+S.nfk || 5), 1, 10); S.cck = clamp(Math.round(+S.cck || 20), 10, 30);
  S.loss = S.loss === "real" ? "real" : "ideal";
  S.tc3 = S.tc3 && typeof S.tc3 === "object" ? S.tc3 : {}; if (["A", "B", "C"].indexOf(S.tc3.s) < 0) S.tc3.s = ""; if (["r1", "r2", "r3"].indexOf(S.tc3.r) < 0) S.tc3.r = "";
  if (!S.last || typeof S.last !== "object" || !S.last.set || typeof S.last.set !== "object") S.last = null;
  var busy = false, locked = false, tw = null, A = null, note = "", seq = 0;
  function cur(){ if (S.mode === "tt" && S.last) return JSON.parse(JSON.stringify(S.last.set)); var app = S.mode === "tt" ? S.app : S.mode; return { app:app, proc:S.proc, va:S.va, vb:S.vb, conc:S.conc, salt:S.salt, metal:S.metal, mm:S.mm, fuel:S.fuel, nf:S.nfk / 100, cc:S.cck / 2, loss:S.loss }; }
  function lastR(){ if (!S.last) return null; try { return compute(S.last.set); } catch (e) { return null; } }
  function matches(){ return S.last && setKey(S.last.set) === setKey(cur()); }

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="cal-modes"></div><div class="cal-grid">' +
    '<div class="cal-view"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="cal-box"><svg class="cal-svg" id="cal-svg" viewBox="0 0 320 290" role="img" aria-label=""></svg></div>' +
      '<div class="plot-wrap cal-pw"><canvas class="plot wide" id="cal-plot" role="img" aria-label="Temperature–time trace"></canvas></div>' +
      '<p class="cal-cap" aria-live="polite"></p></div>' +
    '<div class="cal-side">' +
      '<details class="cal-acc" open data-for="cup"><summary>Solutions</summary><div class="cal-proc"></div>' +
        '<div class="cal-c" data-p="neut"><div class="cal-va"></div><div class="cal-vb"></div><div class="cal-conc"></div></div>' +
        '<div class="cal-c" data-p="salt"><label class="cal-sl" for="cal-salt">Salt mass: <output id="cal-salt-o"></output></label><input type="range" id="cal-salt" min="2" max="20" step="2"><p class="tiny muted">Into 100.0 g of water. Use these values: <i>M</i>(NH₄NO₃) = 80.0 g/mol.</p></div>' +
        '<div class="cal-c" data-p="metal"><div class="cal-met"></div><div class="cal-mm"></div><p class="tiny muted">The metal starts at 100.0 °C; it goes into 100.0 g of water at 20.0 °C.</p></div></details>' +
      '<details class="cal-acc" open data-for="bomb"><summary>Fuel</summary><div class="cal-fuel"></div>' +
        '<label class="cal-sl" for="cal-nf">Amount burned: <output id="cal-nf-o"></output></label><input type="range" id="cal-nf" min="1" max="10" step="1">' +
        '<label class="cal-sl" for="cal-cc">Heat capacity, ' + CCAL + ': <output id="cal-cc-o"></output></label><input type="range" id="cal-cc" min="10" max="30" step="1"></details>' +
      '<details class="cal-acc" open data-for="opt"><summary>Options</summary><div class="cal-loss"></div></details><p class="tiny muted cal-ttnote">Temperature–time mode shows the trace of the last run in full. <span class="cal-ttapp"></span></p>' +
      '<div class="cal-btns"></div><dl class="read cal-read" aria-live="polite"></dl></div></div>' +
    '<div class="cal-work" aria-live="polite"></div>' +
    '<div class="part cal-tc3" hidden><h4 class="cal-h4">Mystery samples (Challenge 3)</h4><p class="tiny">Each 100.0 g sample starts at 100.0 °C and goes into 100.0 g of water at 20.0 °C. Final temperatures: ' + TC3.samples.map(function(s){ return "<strong>" + s.id + "</strong> " + s.tf + " °C"; }).join(" · ") + '.</p><div class="cal-smp"></div><div class="cal-rsn"></div></div>' +
    '<details class="alg cal-about"><summary>About this model</summary>' + C.modelNote + '</details><div class="cal-tabs"></div>';
  var svg = $("#cal-svg"), canvas = $("#cal-plot"), btns = $(".cal-btns", host);
  var inSalt = $("#cal-salt"), inNf = $("#cal-nf"), inCc = $("#cal-cc");
  inSalt.value = S.salt; inNf.value = S.nfk; inCc.value = S.cck;

  // C13 panels: accepted values used here (derived from the course tables), ΔH°f and specific heat capacities
  MV.chem.tables.calAcc = { title:"Accepted values used in this module", head:["Process", "Δ<i>H</i> (kJ/mol)", "Source"], rows:[
    ["HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)", fx(DH_NEUT, 1), "H₂O(l) −285.8 and OH⁻(aq) −230.0"],
    ["NH₄NO₃(s) dissolving", "+" + fx(DH_SALT, 1), "course table"],
    ["methane combustion", fx(FUEL.CH4.dh, 1), "Δ<i>H</i>°f table"], ["ethanol combustion", fx(FUEL.C2H5OH.dh, 1), "Δ<i>H</i>°f table"],
    ["glucose combustion", fx(FUEL.C6H12O6.dh, 1), "Δ<i>H</i>°f table"], ["propane combustion", fx(DH_PROP, 1) + " (≈ −2220)", "Δ<i>H</i>°f table"]],
    note:"Combustion values assume H₂O(l) as a product." };
  MV.chem.tablePanel($(".cal-tabs", host), "calAcc", { title:"Course data: accepted values" });
  MV.chem.tablePanel($(".cal-tabs", host), "const", { title:"Course data: constants and specific heat capacities" });
  MV.chem.tablePanel($(".cal-tabs", host), "dhf", { title:"Course data: standard enthalpies of formation" });

  // ----- plot -----
  var plot = new MV.Plot(canvas, { xmin:-1, xmax:10, ymin:15, ymax:30 });
  plot.render = function(){ plot.draw(plotScene()); };
  function plotScene(){
    var r = A ? A.r : matches() ? lastR() : (S.mode === "tt" ? lastR() : null), tEnd = A ? A.t : 10;
    var lo = r ? Math.min(TI, r.tf) : TI, hi = r ? Math.max(TI, r.tf) : TI, pad = Math.max(1, (hi - lo) * 0.18);
    var v = { xmin:-1, xmax:10, ymin:Math.floor(lo - pad), ymax:Math.ceil(hi + pad) };
    if (v.ymax - v.ymin < 6) { var mid = (v.ymax + v.ymin) / 2; v.ymin = Math.floor(mid - 3); v.ymax = v.ymin + 6; }
    var sc = { view:v, xTicks:{ step:1 }, xLabel:"time (min)", yLabel:"T (°C)", curves:[], points:[], segments:[], labels:[] };
    if (r) {
      var pts = []; for (var t = -1; t <= tEnd + 1e-9; t += 0.05) pts.push([t, traceT(r, t)]);
      if (tEnd > -1) pts.push([tEnd, traceT(r, tEnd)]);
      sc.curves.push({ pts:pts, color:css("--pen"), width:3 });
      sc.points.push({ x:Math.max(-1, tEnd), y:traceT(r, Math.max(-1, tEnd)), r:5, color:css("--pen") });
      if (S.mode === "tt" && !A) {
        sc.segments.push({ x1:-1, y1:r.ti, x2:10, y2:r.ti, color:css("--ink-2"), width:1.4, dash:[6, 6] }, { x1:-1, y1:r.tf, x2:10, y2:r.tf, color:css("--ink-2"), width:1.4, dash:[6, 6] });
        sc.segments.push({ x1:2, y1:r.ti, x2:2, y2:r.tf, color:css("--ink"), width:2, arrow:"both" });
        sc.labels.push({ x:2.3, y:(r.ti + r.tf) / 2, text:"ΔT = " + MV.plain(sgn(fx(r.dT, 2), r.dT)) + " °C", bg:true });
        sc.labels.push({ x:6, y:r.tf, text:"maximum " + fx(r.tf, 2) + " °C", dy:r.dT > 0 ? -12 : 12, bg:true });
      }
    }
    sc.describe = r ? "Temperature–time trace: " + fx(r.ti, 2) + " °C before mixing at 0 min, " + (r.dT > 0 ? "rising" : "falling") + " to " + fx(r.tf, 2) + " °C at 2 min" + (r.real ? ", then drifting slowly back toward room temperature." : ", then level.") : "Temperature–time axes. No run yet: press Mix or Ignite.";
    return sc;
  }

  // ----- controls -----
  var RG = {};
  RG.mode = radios($(".cal-modes", host), { label:"Mode", aria:"Calorimeter mode", options:C.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; if (v !== "tt") S.app = v; note = ""; api.save(); paint(); } });
  RG.proc = radios($(".cal-proc", host), { label:"Process", aria:"Coffee-cup process", cls:"chips", options:C.procs, value:S.proc, onChange:function(v){ S.proc = v; note = ""; api.save(); paint(); } });
  RG.va = radios($(".cal-va", host), { label:"HCl volume", cls:"chips", aria:"Acid volume", options:VOLS.map(function(v){ return { id:String(v), t:volT(v) }; }), value:String(S.va), onChange:function(v){ S.va = +v; note = ""; api.save(); paint(); } });
  RG.vb = radios($(".cal-vb", host), { label:"NaOH volume", cls:"chips", aria:"Base volume", options:VOLS.map(function(v){ return { id:String(v), t:volT(v) }; }), value:String(S.vb), onChange:function(v){ S.vb = +v; note = ""; api.save(); paint(); } });
  RG.conc = radios($(".cal-conc", host), { label:"Concentration (both)", cls:"chips", aria:"Concentration of both solutions", options:CONCS.map(function(c){ return { id:String(c), t:concT(c) }; }), value:String(S.conc), onChange:function(v){ S.conc = +v; note = ""; api.save(); paint(); } });
  RG.met = radios($(".cal-met", host), { label:"Metal", cls:"chips", aria:"Metal", options:Object.keys(METALS).map(function(k){ return { id:k, t:METALS[k] + " (" + fx(CMET[k], 3) + ")" }; }), value:S.metal, onChange:function(v){ S.metal = v; note = ""; api.save(); paint(); } });
  RG.mm = radios($(".cal-mm", host), { label:"Metal mass", cls:"chips", aria:"Metal mass", options:[{ id:"50", t:"50.0 g" }, { id:"100", t:"100.0 g" }], value:String(S.mm), onChange:function(v){ S.mm = +v; note = ""; api.save(); paint(); } });
  RG.fuel = radios($(".cal-fuel", host), { label:"Fuel", cls:"chips", aria:"Fuel", options:C.fuels.map(function(x){ return { id:x.id, t:x.t + " (" + fx(FUEL[x.id].dh, 1) + ")" }; }), value:S.fuel, onChange:function(v){ S.fuel = v; note = ""; api.save(); paint(); } });
  RG.loss = radios($(".cal-loss", host), { label:"Heat loss", aria:"Heat loss", options:C.losses, value:S.loss, onChange:function(v){ S.loss = v; note = ""; api.save(); paint(); } });
  RG.smp = radios($(".cal-smp", host), { label:"Which sample is aluminium?", cls:"chips", aria:"Mystery sample", options:TC3.samples.map(function(s){ return { id:s.id, t:"Sample " + s.id + " (" + s.tf + " °C)" }; }), value:S.tc3.s, onChange:function(v){ S.tc3.s = v; api.save(); MV.changed(); } });
  RG.rsn = radios($(".cal-rsn", host), { label:"Reason", cls:"chips cal-rchips", aria:"Reason", options:TC3.reasons.map(function(x){ return { id:x.id, t:x.t }; }), value:S.tc3.r, onChange:function(v){ S.tc3.r = v; api.save(); MV.changed(); } });
  function syncRG(){ RG.mode.set(S.mode); RG.proc.set(S.proc); RG.va.set(String(S.va)); RG.vb.set(String(S.vb)); RG.conc.set(String(S.conc)); RG.met.set(S.metal); RG.mm.set(String(S.mm)); RG.fuel.set(S.fuel); RG.loss.set(S.loss); inSalt.value = S.salt; inNf.value = S.nfk; inCc.value = S.cck; }
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); [inSalt, inNf, inCc].forEach(function(i){ i.disabled = b; }); paintBtns(); }
  inSalt.addEventListener("input", function(){ S.salt = clamp(Math.round(+inSalt.value / 2) * 2, 2, 20); note = ""; api.save(); paint(); });
  inNf.addEventListener("input", function(){ S.nfk = clamp(Math.round(+inNf.value), 1, 10); note = ""; api.save(); paint(); });
  inCc.addEventListener("input", function(){ S.cck = clamp(Math.round(+inCc.value), 10, 30); note = ""; api.save(); paint(); });
  function paintBtns(){
    var dis = locked || busy ? " disabled" : "", app = cur().app;
    MV.keepFocus(btns, function(){
      btns.innerHTML = '<button type="button" class="btn primary sm" data-act="run" data-k="run"' + dis + ">" + (app === "bomb" ? "Ignite" : "Mix") + "</button>" +
        '<button type="button" class="btn ghost sm" data-act="reset" data-k="reset"' + dis + ">Reset</button>";
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button[data-act]"); if (!b || b.disabled || locked || busy || !btns.contains(b)) return;
    if (b.dataset.act === "run") run(false);
    else { note = ""; S.last = null; api.save(); paint(); }
  });

  // ----- animation -----
  function cancelAnim(){ seq++; if (tw) { tw(); tw = null; } A = null; busy = false; }
  function run(pred, cb){
    cancelAnim(); var my = seq, set = cur(), r = compute(set); busy = true; lock(true);
    A = { r:r, set:set, t:-1 }; paintCap();
    tw = MV.tween({ dur:3400, ease:LIN, step:function(s){ if (my !== seq) return; A.t = lerp(-1, 10, s); draw(); }, done:function(){
      if (my !== seq) return; tw = null; A = null; busy = false;
      S.last = { set:set, p:!!pred }; S.app = set.app; api.save();
      if (!pred) lock(false); paint(); if (cb) cb();
    } });
  }

  // ----- drawing -----
  function draw(){
    var set = A ? A.set : cur(), r = A ? A.r : matches() ? lastR() : null;
    if (S.mode === "tt" && !A && S.last) { set = S.last.set; r = lastR(); }
    svg.innerHTML = calApparatus(set, r, A ? { t:A.t } : null);
    var T = r ? traceT(r, A ? A.t : 10) : TI;
    svg.setAttribute("aria-label", (set.app === "bomb" ? "Bomb calorimeter: a steel bomb holding " + FUEL[set.fuel].name + " sits in an insulated water bath with a stirrer and a thermometer." : "Coffee-cup calorimeter: two nested polystyrene cups with a lid, a stirrer and a thermometer, holding " + (set.proc === "neut" ? fx(set.va + set.vb, 1) + " mL of solution." : "100.0 g of water" + (set.proc === "metal" ? " and a " + fx(set.mm, 1) + " g block of " + METALS[set.metal] + "." : " and dissolving NH₄NO₃."))) +
      " The thermometer reads " + MV.plain(fx(T, 2)) + " °C." + (r && !A ? (r.exo ? " Orange heat arrows point from the " + (r.proc === "metal" ? "metal" : r.proc === "bomb" ? "bomb" : "reacting particles") + " into the water." : " Orange heat arrows point from the water into the dissolving particles.") + (r.real ? " Faint arrows leak out through the wall." : "") : ""));
    plot.render();
  }
  function rowsFor(r){
    var acc, rows = [];
    rows.push(["<i>T</i><sub>initial</sub> / <i>T</i><sub>final</sub>", tC(r.ti) + " / " + tC(r.tf)], [DT, sgn(fx(r.dT, 2), r.dT) + " °C"]);
    if (r.proc === "bomb") {
      rows.push(["Heat capacity, " + CCAL, fx(r.cc, 1) + " kJ/°C"], [Q + " = " + CCAL + DT, "+" + sig(r.qcal, 3) + " kJ"], [QR, sig(r.qr, 3) + " kJ"],
        ["Moles burned", sig(r.n, 3) + " mol " + F(r.fu.f)], [DH + "<sub>c</sub> (measured)", fx(r.dH, 1) + " kJ/mol"]);
      acc = fx(r.acc, 1) + " kJ/mol";
    } else if (r.proc === "metal") {
      rows.push(["Mass heated", "100.0 g (water)"], [QW + " = <i>mc</i>" + DT, sgn(sig(r.qw, 3), r.qw) + " J"], [Q + "<sub>metal</sub> = −" + QW, sig(r.qm / 1000, 3) + " kJ"],
        ["Metal", fx(r.mm, 1) + " g " + METALS[r.metal] + ", 100.0 → " + tC(r.tf) + " (" + DT + " = " + fx(r.dTm, 2) + " °C)"], ["<i>c</i> (measured)", fx(r.cMeas, 3) + " J/(g·°C)"]);
      acc = fx(r.acc, 3) + " J/(g·°C)";
    } else {
      rows.push(["Mass heated", fx(r.m, 1) + " g" + (r.proc === "neut" ? " (total solution)" : " (water)")], [QW + " = <i>mc</i>" + DT, sgn(sig(r.qw, 3), r.qw) + " J"], [QR, sgn(sig(r.qr, 3), r.qr) + " kJ"],
        ["Moles reacted (limiting)", sig(r.n, 3) + " mol" + (r.proc === "neut" ? " (" + r.lim + ")" : " NH₄NO₃")], [DH + " (measured)", sgn(fx(r.dH, 1), r.dH) + " kJ/mol"]);
      acc = sgn(fx(r.acc, 1), r.acc) + " kJ/mol";
    }
    rows.push(["Accepted / % difference", acc + " / " + fx(r.pct, 1) + "%"]);
    return rows;
  }
  function paintRead(){
    var r = S.mode === "tt" ? lastR() : matches() ? lastR() : null, el = $(".cal-read", host), wk = $(".cal-work", host);
    if (A) { el.innerHTML = MV.readoutHTML([["Temperature", tC(traceT(A.r, A.t))], ["Time", fx(Math.max(0, A.t), 1) + " min after mixing"], ["Readout", muted("when the run ends")]]); wk.innerHTML = ""; return; }
    if (!r) { el.innerHTML = MV.readoutHTML([["<i>T</i><sub>initial</sub>", tC(TI)], ["Readout", muted("press " + (cur().app === "bomb" ? "Ignite" : "Mix") + " to run")]]); wk.innerHTML = ""; return; }
    el.innerHTML = MV.readoutHTML(rowsFor(r));
    var w;
    if (r.proc === "bomb") w = Q + " = " + CCAL + DT + " = " + fx(r.cc, 1) + " kJ/°C × " + fx(r.dT, 2) + " °C ≈ " + sig(r.qcal, 4) + " kJ → " + QR + " ≈ " + sig(r.qr, 4) + " kJ → " + DH + "<sub>c</sub> = " + QR + " ÷ <i>n</i> = " + sig(r.qr, 4) + " kJ ÷ " + sig(r.n, 3) + " mol ≈ " + fx(r.dH, 1) + " kJ/mol";
    else if (r.proc === "metal") w = QW + " = 100.0 g × 4.18 J/(g·°C) × " + fx(r.dT, 2) + " °C ≈ " + sig(r.qw, 3) + " J → " + Q + "<sub>metal</sub> ≈ " + sig(r.qm, 3) + " J → <i>c</i> = " + Q + "<sub>metal</sub> ÷ (<i>m</i>" + DT + ") = " + sig(r.qm, 3) + " J ÷ (" + fx(r.mm, 1) + " g × " + fx(r.dTm, 2) + " °C) ≈ " + fx(r.cMeas, 3) + " J/(g·°C)";
    else w = QW + " = " + fx(r.m, 1) + " g × 4.18 J/(g·°C) × " + (r.dT < 0 ? "(" + fx(r.dT, 2) + " °C)" : fx(r.dT, 2) + " °C") + " ≈ " + sig(r.qw, 3) + " J → " + QR + " = −" + QW + " ≈ " + sgn(sig(r.qr, 3), r.qr) + " kJ → " + DH + " = " + QR + " ÷ <i>n</i> = " + sgn(sig(r.qr, 3), r.qr) + " kJ ÷ " + sig(r.n, 3) + " mol ≈ " + sgn(fx(r.dH, 1), r.dH) + " kJ/mol";
    wk.innerHTML = '<p class="cal-wl"><strong>Worked strip.</strong> ' + w + "</p>";
  }
  function paintCap(){
    var t, set = cur(), r = matches() ? lastR() : null;
    if (A) t = A.set.app === "bomb" ? "Ignited: the bomb’s heat flows into the water bath…" : A.set.proc === "metal" ? "The hot metal goes in, and heat flows into the water…" : "Mixed: watch the thermometer and the trace…";
    else if (S.mode === "tt") t = S.last ? "The full trace of the last run: " + DT + " is measured from the starting temperature to the maximum (or minimum)." + (lastR().real ? " In Real mode the temperature drifts back after the maximum." : "") : "No run yet. Run an experiment in Coffee cup or Bomb mode, then come back here.";
    else if (!r) t = S.last ? "Settings changed: press <strong>" + (set.app === "bomb" ? "Ignite" : "Mix") + "</strong> to run with these settings." : "Set up the run, then press <strong>" + (set.app === "bomb" ? "Ignite" : "Mix") + "</strong>.";
    else t = r.proc === "bomb" ? "The " + r.fu.name + " burned and the water bath warmed by " + fx(r.dT, 2) + " °C." : r.proc === "salt" ? "The dissolving took heat from the water: it cooled by " + fx(-r.dT, 2) + " °C, so " + DH + " &gt; 0." : r.proc === "metal" ? "The " + METALS[r.metal] + " cooled and the water warmed by " + fx(r.dT, 2) + " °C." : "The neutralization warmed the solution by " + fx(r.dT, 2) + " °C, so " + DH + " &lt; 0.";
    if (r && r.real && !A && S.mode !== "tt") t += " Real mode: 10% of the heat escaped, so " + DT + " is smaller.";
    $(".cal-cap", host).innerHTML = t + (note && !busy ? " <strong>" + note + "</strong>" : "");
  }
  function paint(){
    var m = S.mode, app = cur().app;
    $$(".cal-acc", host).forEach(function(p){ var f = p.dataset.for; p.hidden = m === "tt" ? true : f === "opt" ? false : f !== app; });
    $$(".cal-c", host).forEach(function(p){ p.hidden = p.dataset.p !== S.proc; });
    $(".cal-ttnote", host).hidden = m !== "tt";
    $(".cal-ttapp", host).textContent = m === "tt" ? (S.last ? "Mix / Ignite repeats the last run (" + (S.last.set.app === "bomb" ? "bomb" : "coffee cup") + ")." : "") : "";
    host.classList.toggle("cal-tt", m === "tt");
    $(".cal-tc3", host).hidden = !(m === "cup" && S.proc === "metal");
    $("#cal-salt-o").textContent = fx(S.salt, 2) + " g (" + sig(S.salt / M_SALT, 3) + " mol)";
    $("#cal-nf-o").textContent = fx(S.nfk / 100, 4) + " mol";
    $("#cal-cc-o").textContent = fx(S.cck / 2, 1) + " kJ/°C";
    draw(); paintRead(); paintCap(); paintBtns();
    MV.changed();
  }

  // ----- predictions -----
  function setup(o){ cancelAnim(); S.mode = "cup"; S.app = "cup"; S.proc = o.proc; S.va = o.va || 50; S.vb = o.vb || 50; S.conc = o.conc || 1; S.salt = o.salt || S.salt; S.loss = "ideal"; note = ""; syncRG(); }
  var hooks = {
    start:function(p){
      if (p.id === "p4") { setup({ proc:"salt", salt:8 }); S.last = null; }
      else { setup({ proc:"neut" }); S.last = { set:cur(), p:true }; }
      api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(n){ note = n || ""; busy = false; lock(false); paint(); MV.wait(150, done); }
      if (p.id === "p1") { S.va = 100; S.vb = 100; }
      else if (p.id === "p2") S.conc = 2;
      else if (p.id === "p3") S.loss = "real";
      syncRG(); api.save();
      run(true, function(){
        var r = lastR();
        fin(p.id === "p1" ? "Twice the arrows, but twice the water: " + DT + " = " + fx(r.dT, 2) + " °C." : p.id === "p2" ? "The trace climbs twice as high: " + DT + " = " + fx(r.dT, 2) + " °C." : p.id === "p3" ? "Faint arrows leak through the cup wall; " + DT + " reads " + fx(r.dT, 2) + " °C, so " + DH + " = " + fx(r.dH, 1) + " kJ/mol." : "The arrows point <em>into</em> the dissolving particles.");
      });
    }
  };

  // ----- challenges -----
  function chal(id){
    var L = S.last && !S.last.p ? S.last.set : null;
    if (id === "tc1") {
      if (!L || L.app !== "cup" || L.proc !== "salt") return { ok:false };
      if (L.loss === "real") return { ok:false, msg:"Use ideal mode for this target." };
      var r = compute(L);
      if (Math.abs(-r.dT - 6.15) <= 0.05) return { ok:true };
      return { ok:false, msg:fx(L.salt, 2) + " g cools the water by " + fx(-r.dT, 2) + " °C. Use <i>n</i> = <i>m</i><sub>water</sub><i>c</i>" + DT + " ÷ " + DH + "." };
    }
    if (id === "tc2") {
      if (!L || L.app !== "bomb") return { ok:false };
      if (L.fuel !== "CH4" || Math.abs(L.nf - 0.05) > 1e-9) return { ok:false, msg:"Burn 0.0500 mol of methane." };
      if (L.loss === "real") return { ok:false, msg:"Use ideal mode for this target." };
      var b = compute(L);
      if (Math.abs(b.dT - 8.9) <= 0.05) return { ok:true };
      if (L.cc > 5) return { ok:false, msg:"With " + fx(L.cc, 1) + " kJ/°C, " + DT + " = " + fx(b.dT, 2) + " °C. A larger heat capacity gives a <em>smaller</em> " + DT + "." };
      return { ok:false, msg:DT + " = " + fx(b.dT, 2) + " °C: too big." };
    }
    if (id === "tc3") {
      if (!S.tc3.s) return { ok:false, msg:"Choose a sample under <strong>Mystery samples</strong>." };
      var smp = TC3.samples.filter(function(s){ return s.id === S.tc3.s; })[0];
      if (S.tc3.s !== MV.ans(TC3)) return { ok:false, msg:smp.fb };
      if (!S.tc3.r) return { ok:false, msg:"Now choose the reason." };
      var rs = TC3.reasons.filter(function(x){ return x.id === S.tc3.r; })[0];
      return MV.ok(rs) ? { ok:true } : { ok:false, msg:rs.fb };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Why the measured value is off ----------
// @component C5 canCalorimeter — schematic spirit lamp under a metal can of water (SVG string)
function canSVG(){
  var h = "";
  h += ln(30, 20, 30, 196, { c:"var(--ink-2)", w:3 }) + rect(14, 194, 210, 6, "var(--ink-2)", { rx:2 }) + ln(30, 50, 118, 50, { c:"var(--ink-2)", w:2.4 });
  h += rect(96, 40, 84, 92, "var(--sheet)", { rx:4, s:"var(--ink-2)", sw:2.2 }) + rect(98, 62, 80, 68, "var(--info-bg)", { rx:2 });
  h += thermo(158, 8, 110, 30, 15, 35, "") + ln(118, 30, 118, 120, { c:"var(--ink-2)", w:1.6 });
  h += rect(118, 166, 40, 28, "var(--sheet)", { rx:5, s:"var(--ink-2)", sw:1.8 }) + ln(138, 166, 138, 156, { c:"var(--ink-2)", w:2 });
  h += path("M138 154 C128 146 132 136 138 128 C144 136 148 146 138 154 Z", { f:"var(--en-dh)" });
  h += tx(196, 84, "can", { a:"start", fs:11.5 }) + tx(196, 98, "200.0 g water", { a:"start", fs:11.5 }) + tx(166, 180, "ethanol lamp", { a:"start", fs:11.5 });
  [[110, 140, 92, 120], [166, 140, 196, 124], [126, 146, 112, 132]].forEach(function(a){ h += heatArrow(a[0], a[1], a[2], a[3], 1, { op:0.55, d:"4 3", w:2 }); });
  h += tx(214, 130, "heat lost", { a:"start", fs:11, c:"var(--ink-2)" });
  return h;
}
var EXT = { b:26.6, m:-0.3 };                                     // the cooling line in Station 3: T = 26.6 − 0.3t (t ≥ 2 min)
function s3T(t){ return t <= 0 ? 20.0 : t <= 2 ? 20.0 + 6.0 * (1 - (1 - t / 2) * (1 - t / 2)) : EXT.b + EXT.m * t; }
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, s4 = C.s4;
  S.s1 = S.s1 && typeof S.s1 === "object" ? S.s1 : {}; S.s1.v = S.s1.v && typeof S.s1.v === "object" ? S.s1.v : {}; S.s1.ok = !!S.s1.ok;
  S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {};
  S.s3 = S.s3 && typeof S.s3 === "object" ? S.s3 : {}; if (!Array.isArray(S.s3.h) || S.s3.h.length !== 2) S.s3.h = [[3, 23.0], [8, 23.0]]; S.s3.ok = !!S.s3.ok;
  S.s4 = Array.isArray(S.s4) ? S.s4.filter(function(id){ return s4.fixes.some(function(f){ return f.id === id; }); }).slice(0, 3) : [];
  var fb1 = null, fb3 = null;
  host.innerHTML =
    '<div class="part cal-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="cal-s1g"><svg class="cal-can" viewBox="0 0 280 205" role="img" aria-label="A metal can of 200.0 g of water hangs from a clamp on a stand above a small ethanol spirit lamp. A thermometer stands in the water. Faint dashed orange arrows show heat escaping into the air around the can."></svg><div class="cal-s1in">' + MV.usesHTML(s1.use) + '<div class="cal-s1rows"></div><div class="q-actions"><button type="button" class="btn primary sm" data-s1="check" data-k="s1chk">Check</button></div><div class="cal-s1fb" aria-live="polite"></div></div></div></div>' +
    '<div class="part cal-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="cal-cards"></div><div class="cal-s2fb" aria-live="polite"></div></div>' +
    '<div class="part cal-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="plot-wrap"><canvas class="plot wide" id="cal-ext" role="img" aria-label="Temperature–time graph"></canvas></div><dl class="read cal-s3read" aria-live="polite"></dl><div class="q-actions"><button type="button" class="btn primary sm" data-s3="check" data-k="s3chk">Check the ruler</button></div><div class="cal-s3fb" aria-live="polite"></div></div>' +
    '<div class="part cal-st"><h3>' + s4.title + "</h3><p>" + s4.intro + '</p><div class="cal-fixes" role="group" aria-label="Improvements"></div><div class="cal-s4fb" aria-live="polite"></div></div>';
  $(".cal-can", host).innerHTML = canSVG();

  // ----- station 1 -----
  var rows1 = $(".cal-s1rows", host);
  function one(s){ var v = MV.parseNum(String(s || "").replace(/[a-zA-Z°%\/·()]+/g, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function paintS1(){
    MV.keepFocus(rows1, function(){
      rows1.innerHTML = s1.items.map(function(it){ var dis = S.s1.ok ? " disabled" : ""; return '<div class="numrow"><label for="cal-s1-' + it.id + '">' + it.label + '</label><input class="numin" id="cal-s1-' + it.id + '" data-s1in="' + it.id + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + esc(S.s1.v[it.id] || "") + '"' + dis + '><span class="cal-unit">' + it.unit + "</span></div>"; }).join("");
    });
    var f = $(".cal-s1fb", host);
    if (S.s1.ok) f.innerHTML = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s1.items.map(function(it){ return it.why; }).join(" ") + " " + s1.done);
    else f.innerHTML = fb1 ? MV.fbHTML(fb1.soft ? "" : "bad", fb1.t) : "";
    $('[data-s1="check"]', host).hidden = S.s1.ok;
  }
  rows1.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.s1in; if (!id) return; S.s1.v[id] = e.target.value; api.save(); });
  rows1.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.s1in) $('[data-s1="check"]', host).click(); });

  // ----- station 2 -----
  var cards = $(".cal-cards", host);
  function paintS2(){
    MV.keepFocus(cards, function(){
      cards.innerHTML = s2.cards.map(function(c){
        var pick = S.s2[c.id], right = pick && pick === MV.ans(c);
        return '<div class="cal-card' + (pick ? right ? " good" : " bad" : "") + '"><p class="cal-ct">' + c.t + '</p><div class="cal-bins" role="group" aria-label="' + esc(MV.plain(c.t)) + '">' + s2.bins.map(function(b){ var on = pick === b.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-card="' + c.id + '" data-bin="' + b.id + '" data-k="' + c.id + b.id + '">' + b.t + "</button>"; }).join("") + "</div>" +
          (pick ? '<p class="cal-cfb">' + (right ? "✓ " : "✗ Not quite. ") + c.why + "</p>" : "") + "</div>";
      }).join("");
    });
    var all = s2.cards.every(function(c){ return S.s2[c.id] === MV.ans(c); }), n = s2.cards.filter(function(c){ return S.s2[c.id] === MV.ans(c); }).length;
    $(".cal-s2fb", host).innerHTML = all ? MV.fbHTML("good", "<strong>✓ All six sorted.</strong> " + s2.all) : '<p class="tiny muted">' + n + " of " + s2.cards.length + " sorted correctly.</p>";
  }

  // ----- station 3 -----
  var ext = $("#cal-ext"), plot = new MV.Plot(ext, { xmin:-1, xmax:10, ymin:19, ymax:28 });
  function line(){ var h = S.s3.h, dx = h[1][0] - h[0][0]; if (Math.abs(dx) < 1e-6) return null; var m = (h[1][1] - h[0][1]) / dx; return { m:m, b:h[0][1] - m * h[0][0] }; }
  plot.render = function(){
    var pts = [], data = [], L = line(), t;
    for (t = -1; t <= 10.001; t += 0.05) pts.push([t, s3T(t)]);
    for (t = -1; t <= 10.001; t += 0.5) data.push({ x:t, y:Math.round(s3T(t) * 100) / 100, r:3.2, color:css("--pen") });
    var sc = { view:{ xmin:-1, xmax:10, ymin:19, ymax:28 }, xTicks:{ step:1 }, yTicks:{ step:1 }, xLabel:"time (min)", yLabel:"T (°C)", curves:[{ pts:pts, color:css("--pen"), width:2, alpha:0.5 }], data:data, segments:[], points:[], labels:[] };
    sc.segments.push({ x1:-1, y1:20.0, x2:10, y2:20.0, color:css("--ink-2"), width:1, dash:[3, 5] });
    if (L) {
      sc.segments.push({ x1:0, y1:L.b, x2:10, y2:L.b + L.m * 10, color:css("--ink-2"), width:2.4, dash:[8, 6] });
      sc.points.push({ x:0, y:L.b, r:5, color:css("--ink") });
      sc.labels.push({ x:0.25, y:L.b, text:"at mixing: " + fx(L.b, 1) + " °C", dy:L.b > 27 ? 14 : -14, bg:true });
    }
    S.s3.h.forEach(function(p){ sc.points.push({ x:p[0], y:p[1], r:6.5, color:css("--ink"), ring:true }); });
    sc.describe = "Temperature–time graph: 20.0 °C before mixing at 0 min, rising to a maximum of 26.0 °C at 2 min, then cooling in a straight line to about 23.6 °C at 10 min." + (L ? " Your ruler line crosses the mixing time at " + fx(L.b, 1) + " °C with a slope of " + fx(L.m, 2) + " °C per minute." : "");
    plot.draw(sc);
  };
  MV.drag(plot, { axis:"xy", step:{ x:0.1, y:0.1 }, big:10,
    handles:function(){ return S.s3.h.map(function(p, i){ return { id:"h" + i, x:p[0], y:p[1], label:"Ruler handle " + (i + 1) + " at " + fx(p[0], 1) + " min, " + fx(p[1], 1) + " °C. Use the arrow keys to move it." }; }); },
    snap:function(x, y){ return [clamp(Math.round(x * 10) / 10, -0.5, 9.9), clamp(Math.round(y * 10) / 10, 19.2, 27.8)]; },
    move:function(id, x, y){ var i = +id.slice(1), o = S.s3.h[1 - i]; if (Math.abs(x - o[0]) < 0.5) return; S.s3.h[i] = [x, y]; if (!S.s3.ok) fb3 = null; api.save(); plot.render(); paintS3(); } });
  function paintS3(){
    var L = line(), rows = [["Ruler at the mixing time (0 min)", L ? fx(L.b, 1) + " °C" : muted("—")], ["Ruler slope", L ? fx(L.m, 2) + " °C/min" : muted("—")]];
    if (S.s3.ok) {
      var dTx = Math.round((S.s3.b - 20.0) * 10) / 10, hx = -100.0 * CW * dTx / 1000 / 0.05;
      rows.push(["Uncorrected (maximum reading)", DT + " = 6.0 °C → " + DH + " = −50.2 kJ/mol"], ["Extrapolated", DT + " = " + fx(dTx, 1) + " °C → " + DH + " = " + fx(hx, 1) + " kJ/mol"], ["Accepted", fx(DH_NEUT, 1) + " kJ/mol"]);
    }
    $(".cal-s3read", host).innerHTML = MV.readoutHTML(rows);
    $(".cal-s3fb", host).innerHTML = S.s3.ok ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s3.fbOk + " The extrapolated value is much closer to the accepted −55.8 kJ/mol.") : fb3 ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + fb3) : "";
  }

  // ----- station 4 -----
  var fixes = $(".cal-fixes", host);
  function paintS4(){
    MV.keepFocus(fixes, function(){
      fixes.innerHTML = s4.fixes.map(function(f){ var on = S.s4.indexOf(f.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-fix="' + f.id + '" data-k="fx' + f.id + '">' + f.t + "</button>"; }).join("");
    });
    var ch = s4.fixes.filter(function(f){ return S.s4.indexOf(f.id) >= 0; });
    $(".cal-s4fb", host).innerHTML = (ch.length ? "<ul class=\"cal-fixl\">" + ch.map(function(f){ return "<li><strong>" + f.t + ":</strong> " + f.note + "</li>"; }).join("") + "</ul>" : "") +
      (ch.length === 3 ? MV.fbHTML("good", "<strong>✓ Three improvements chosen.</strong> " + s4.done) : '<p class="tiny muted">' + ch.length + " of 3 chosen. Tap a chosen improvement again to remove it.</p>");
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.s1 === "check") {
      var bad = null, soft = false;
      s1.items.some(function(it){
        var v = one(S.s1.v[it.id]);
        if (v == null) { bad = "Enter a number for each line, such as " + (it.id === "dh" ? "−500" : "120") + "."; soft = true; return true; }
        var ans = MV.ans(it);
        if (Math.abs(v - ans) <= it.tol * Math.max(1, Math.abs(ans))) return false;
        var w = (it.wrong || []).filter(function(z){ return Math.abs(v - z.match) <= 0.02 * Math.max(1, Math.abs(z.match)); })[0];
        bad = "<strong>✗ Not quite.</strong> " + MV.plain(it.label).replace(/:$/, "") + ": " + (w ? w.fb : it.fb) + " Try again."; return true;
      });
      if (!bad) { S.s1.ok = true; fb1 = null; } else fb1 = { t:bad, soft:soft };
      api.save(); paintS1(); MV.focusFb($(".cal-s1fb", host).parentNode); return;
    }
    if (b.dataset.card) { S.s2[b.dataset.card] = b.dataset.bin; api.save(); paintS2(); return; }
    if (b.dataset.s3 === "check") {
      var L = line(), h = S.s3.h;
      if (!L) fb3 = s3.fbSlope;
      else if (Math.abs(L.b - EXT.b) <= 0.15 && Math.abs(L.m - EXT.m) <= 0.06 && h[0][0] >= 2 && h[1][0] >= 2) { S.s3.ok = true; S.s3.b = L.b; fb3 = null; }
      else if (h.some(function(p){ return Math.abs(p[0] - 2) < 0.3 && Math.abs(p[1] - 26.0) < 0.2; })) fb3 = s3.fbPeak;
      else fb3 = s3.fbSlope;
      api.save(); paintS3(); MV.focusFb($(".cal-s3fb", host).parentNode); return;
    }
    if (b.dataset.fix) {
      var id = b.dataset.fix, i = S.s4.indexOf(id);
      if (i >= 0) S.s4.splice(i, 1); else if (S.s4.length < 3) S.s4.push(id);
      api.save(); paintS4();
    }
  });
  paintS1(); paintS2(); plot.render(); paintS3(); paintS4();
}

// ---------- Practice 2: Calorimetry problems (number entry with a sign check, plus a choice; adapted from SCH4U 14's calcAct) ----------
function calcAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); if (typeof x.val !== "string") x.val = ""; if (x.pick === undefined) x.pick = null; x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function chipsHTML(it, x, dis){ return '<div class="chips cal-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>"; }
  function numHTML(it, x, dis){ return '<div class="numrow"><label for="ci-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="ci-' + it.id + '" data-cin="' + it.id + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span class="cal-unit">' + (it.unit || "") + "</span></div>"; }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += it.kind === "chips" ? chipsHTML(it, x, dis) : numHTML(it, x, dis);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) {
      var why = it.kind === "chips" ? (it.options[x.pick] && it.options[x.pick].why) || "" : it.why || "";
      h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + MV.usesHTML(a.use) + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function one(s){ var v = MV.parseNum(String(s || "").replace(/[a-zA-Z°%\/·()]+/g, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, w, tol){ return Math.abs(v - w) <= tol * Math.max(1, Math.abs(w)) + 1e-9; }
  function judge(it, x){
    if (it.kind === "chips") {
      if (x.pick == null) return { bad:"Choose an answer first." };
      return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
    }
    var v = one(x.val), ans = MV.ans(it);
    if (v == null) return { bad:"Enter one number, with its sign, such as −42.5." };
    if (near(v, ans, it.tol)) return { ok:true };
    var w = (it.wrong || []).filter(function(z){ return near(v, z.match, 0.01); })[0];
    if (w) return { fb:w.fb };
    if (ans < 0 && near(-v, ans, it.tol)) return { fb:"Check the sign. The water gained what the reaction lost: <i>q</i><sub>rxn</sub> = −<i>q</i><sub>water</sub>." };
    return { fb:it.fb };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.cin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = host.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Design the run ----------
var task = (function(){
  var S = null, api = null, RGT = {};
  function read(){ return { va:VOLS.indexOf(+S.va) >= 0 ? +S.va : 50, vb:VOLS.indexOf(+S.vb) >= 0 ? +S.vb : 75, c:CONCS.indexOf(+S.c) >= 0 ? +S.c : 0.5 }; }
  function calc(d){ var na = d.c * d.va / 1000, nb = d.c * d.vb / 1000, n = Math.min(na, nb), V = d.va + d.vb; return { na:na, nb:nb, n:n, V:V, dT:n * -DH_NEUT * 1000 / (V * CW) }; }
  function gauge(y, label, val, max, mark, txt, ok){
    var W = 300, x0 = 8, w = W - 16, xv = x0 + w * clamp(val / max, 0, 1), xm = x0 + w * mark / max;
    return tx(x0, y, label, { a:"start", fs:12, w:700 }) + rect(x0, y + 10, w, 14, "var(--rule)", { rx:4, op:0.6 }) + rect(x0, y + 10, xv - x0, 14, "var(--pen)", { rx:4 }) +
      ln(xm, y + 5, xm, y + 29, { c:"var(--ink)", w:2, d:"4 3" }) + tx(xm, y + 37, txt, { fs:10.5, c:"var(--ink-2)" }) + tx(W - 8, y, ok ? "✓" : "✗", { a:"end", fs:13, w:700 });
  }
  function paint(){
    var d = read(), k = calc(d), sv = $("#cal-tsvg"); if (!sv) return;
    var h = gauge(14, "Ideal " + "ΔT: " + fx(k.dT, 2) + " °C", k.dT, 15, 5, "5.0 °C", k.dT >= 5) + gauge(64, "Total volume: " + fx(k.V, 1) + " mL", k.V, 200, 150, "150 mL", k.V <= 150) + gauge(114, "HCl used: " + sig(k.na, 3) + " mol", k.na, 0.2, 0.075, "0.0750 mol", k.na <= 0.075);
    sv.innerHTML = h;
    sv.setAttribute("aria-label", "Preview gauges. Ideal temperature rise " + MV.plain(fx(k.dT, 2)) + " °C (target at least 5.0). Total volume " + MV.plain(fx(k.V, 1)) + " mL (limit 150). HCl used " + MV.plain(sig(k.na, 3)) + " mol (budget 0.0750).");
    $("#cal-tread").innerHTML = MV.readoutHTML([["HCl", sig(k.na, 3) + " mol (" + fx(d.va, 1) + " mL × " + concT(d.c) + ")"], ["NaOH", sig(k.nb, 3) + " mol (" + fx(d.vb, 1) + " mL × " + concT(d.c) + ")"],
      ["Left over", Math.abs(k.na - k.nb) < 1e-9 ? "nothing" : sig(Math.abs(k.na - k.nb), 3) + " mol " + (k.na > k.nb ? "HCl" : "NaOH")], ["Ideal " + DT, fx(k.dT, 2) + " °C"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; var d = read(); S.va = d.va; S.vb = d.vb; S.c = d.c;
      inp.innerHTML = '<div class="cal-tva"></div><div class="cal-tvb"></div><div class="cal-tc"></div>';
      pv.innerHTML = '<h4 class="cal-h4">Live preview</h4><svg class="cal-tsvg" id="cal-tsvg" viewBox="0 0 300 160" role="img" aria-label=""></svg><dl class="read" id="cal-tread" aria-live="polite"></dl>';
      function ch(k){ return function(v){ S[k] = +v; api.save(); paint(); api.update(); }; }
      RGT.va = radios($(".cal-tva", inp), { label:"HCl volume", cls:"chips", aria:"Acid volume", options:VOLS.map(function(v){ return { id:String(v), t:volT(v) }; }), value:String(S.va), onChange:ch("va") });
      RGT.vb = radios($(".cal-tvb", inp), { label:"NaOH volume", cls:"chips", aria:"Base volume", options:VOLS.map(function(v){ return { id:String(v), t:volT(v) }; }), value:String(S.vb), onChange:ch("vb") });
      RGT.c = radios($(".cal-tc", inp), { label:"Concentration of both", cls:"chips", aria:"Concentration of both solutions", options:CONCS.map(function(c){ return { id:String(c), t:concT(c) }; }), value:String(S.c), onChange:ch("c") });
      paint();
    },
    read:function(){ return read(); },
    valid:function(){ return true; },
    checks:function(d){ var k = calc(d); return [d.va === d.vb, k.V <= 150, k.dT >= 5.0, k.na <= 0.075 + 1e-9]; },
    key:function(d){ return [d.c, d.va, d.vb].join("|"); },
    label:function(key){ var p = key.split("|").map(Number), k = calc({ c:p[0], va:p[1], vb:p[2] }); return concT(p[0]) + ": " + fx(p[1], 1) + " + " + fx(p[2], 1) + " mL (" + DT + " " + fx(k.dT, 2) + " °C)"; },
    text:function(key){ return MV.plain(this.label(key)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ prob:calcAct },
  task:task
});
})();
