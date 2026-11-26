// SCH4U 24 Energy Changes and Enthalpy: hero (hand warmer and cold pack, then their enthalpy diagrams), Enthalpy diagram
// builder (Explore: C4 energy diagram in Diagram / Build it / Linked panels, an Energy scales log ruler and a Bonds
// staircase), Write it two ways (Part 3: heat tiles, transformations, a ΔH°f data check), Energy calculations (custom number
// and choice items with a sign check) and Self-heating meal pack (task: card + amount; energy and mass gauges).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function rd(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function LIN(t){ return t; }
var fx = MV.chem.fx, CF = MV.chem.f;
function pl(s){ return MV.plain(CF(s)); }                         // Unicode formula (SVG text, aria)
function sg(v, dp){ return (v > 0 ? "+" : "") + fx(v, dp == null ? 1 : dp); }
function kJ(v){ return sg(v) + " kJ"; }
var DH = "Δ<i>H</i>", DHS = 'Δ<tspan font-style="italic">H</tspan>';

// ---------- data (every value from MV.chem.data) ----------
var D = MV.chem.data;
function hf(sp){ for (var i = 0; i < D.dHf.length; i++) if (D.dHf[i][0] === sp) return D.dHf[i][1]; return 0; }   // elements: 0
function inTable(sp){ return D.dHf.some(function(r){ return r[0] === sp; }); }
function miscVal(key){ var r = D.misc.filter(function(x){ return x[0] === key; })[0]; return r ? parseFloat(String(r[1]).replace(/−/g, "-")) : 0; }
function rxn(r, p){ var s = 0; p.forEach(function(x){ s += x[0] * hf(x[1]); }); r.forEach(function(x){ s -= x[0] * hf(x[1]); }); return rd(s); }
var FUS = miscVal("ΔHfus of water");                   // 6.01 kJ/mol
var COLD = miscVal("NH4NO3 dissolving, ΔH");            // +25.7 kJ/mol
var VAP = rd(hf("H2O(g)") - hf("H2O(l)"));              // 44.0 kJ/mol
// VERIFY: U-235 fission ≈ 2 × 10¹⁰ kJ/mol (order of magnitude) is a course table addition (plan §6 risk 1); it isn't in
// MV.chem.data, so it is defined here.
var FISSION = 2e10;
var BOND = {}; D.bond.forEach(function(b){ BOND[b[0]] = b[1]; });
var CO_CO2 = parseFloat((String(D.bondNote).match(/(\d+(?:\.\d+)?)/) || [])[1]) || BOND["C=O"];   // C=O in CO₂

var CARDS = [
  { id:"ch4", name:"Methane burns", r:[[1, "CH4(g)"], [2, "O2(g)"]], p:[[1, "CO2(g)"], [2, "H2O(l)"]] },
  { id:"c3h8", name:"Propane burns", r:[[1, "C3H8(g)"], [5, "O2(g)"]], p:[[3, "CO2(g)"], [4, "H2O(l)"]] },
  { id:"fe", name:"Hand warmer", r:[[4, "Fe(s)"], [3, "O2(g)"]], p:[[2, "Fe2O3(s)"]] },
  { id:"caco3", name:"Limestone decomposes", r:[[1, "CaCO3(s)"]], p:[[1, "CaO(s)"], [1, "CO2(g)"]] },
  { id:"no", name:"Nitrogen monoxide forms", r:[[1, "N2(g)"], [1, "O2(g)"]], p:[[2, "NO(g)"]] },
  { id:"cold", name:"Cold pack", r:[[1, "NH4NO3(s)"]], p:[[1, "NH4+(aq)"], [1, "NO3-(aq)"]], dh:COLD, misc:true }
];
CARDS.forEach(function(c){ if (c.dh == null) c.dh = rxn(c.r, c.p); });
function card(id){ return CARDS.filter(function(c){ return c.id === id; })[0] || CARDS[0]; }
function coef(c){
  c = Math.round(c * 100) / 100;
  if (Math.abs(c - Math.round(c)) < 1e-9) return c === 1 ? "" : String(Math.round(c));
  if (c === 0.5) return "½";
  var n = Math.round(c * 2); return Math.abs(n / 2 - c) < 1e-9 ? n + "/2 " : c + " ";
}
function side(list, k, noState){ return list.map(function(x){ return coef(x[0] * k) + (noState ? x[1].replace(/\((g|l|s|aq)\)$/, "") : x[1]); }).join(" + "); }
function eqSides(cd, k, rev, noState){ var L = side(cd.r, k, noState), R = side(cd.p, k, noState); return rev ? { L:R, R:L } : { L:L, R:R }; }
function dHof(cd, k, rev){ return rd(cd.dh * k * (rev ? -1 : 1)); }
function eqHTML(s){ return CF(s.L + " -> " + s.R); }
function heatHTML(s, dh){ var q = fx(Math.abs(dh), 1) + " kJ"; return dh < 0 ? CF(s.L + " -> " + s.R) + " + " + q : CF(s.L) + " + " + q + " → " + CF(s.R); }
function kT(k){ return fx(k, 1); }

// @component radioGroup (from MHF4U 25, via SCH4U 01–21) — segmented control or chip row as a real radio group (arrow keys,
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

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '"' + (o.i ? ' font-style="italic"' : "") + ' fill="' + (o.c || "var(--ink)") + '"' +
    (o.halo ? ' paint-order="stroke" stroke="var(--sheet)" stroke-width="3.6" stroke-linejoin="round"' : "") + (o.rot ? ' transform="rotate(' + o.rot + " " + r1(x) + " " + r1(y) + ')"' : "") + opA(o.op) + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function head(x, y, ang, len, fill, op){
  var a1 = ang + Math.PI - 0.42, a2 = ang + Math.PI + 0.42;
  return '<path d="M' + r1(x) + " " + r1(y) + " L" + r1(x + len * Math.cos(a1)) + " " + r1(y + len * Math.sin(a1)) + " L" + r1(x + len * Math.cos(a2)) + " " + r1(y + len * Math.sin(a2)) + ' Z" fill="' + fill + '"' + opA(op) + "/>";
}
function arrowH(x1, x2, y, c, w, op){ var dir = x2 > x1 ? 1 : -1; return ln(x1, y, x2 - dir * 6, y, { c:c, w:w || 2.4, op:op }) + head(x2, y, dir > 0 ? 0 : Math.PI, 8, c, op); }

// ===== @component C4 energyDiagram — enthalpy diagram pieces as SVG strings in the course colours: an "Enthalpy, H" axis,
// reactant / product levels in --ink with formula labels (Unicode via MV.plain(MV.chem.f)) and grey captions, dashed guides,
// the ΔH arrow in --en-dh with its signed label, bond "in" (--en-ea, brown) / "out" (--en-dh) bars, and an --ink
// thermometer with a numeric label. ehAxis(x, yTop, yBot) · ehLevel(x1, x2, y, lab, cap, o) · ehArrow(x, y1, y2, lab, o)
// · ehThermo(x, yTop, yBot, frac (−1…1, 0 = start), lines[], o) · ehDiagram({axis, levels:[…], guides:[[x1, y, x2]], arrow, thermo}).
function ehAxis(x, yTop, yBot, o){
  o = o || {};
  return ln(x, yBot, x, yTop + 6, { c:"var(--ink-2)", w:1.6 }) + head(x, yTop, -Math.PI / 2, 9, "var(--ink-2)") +
    tx(x - 13, (yTop + yBot) / 2, "Enthalpy, " + '<tspan font-style="italic">H</tspan>', { fs:o.fs || 12, c:"var(--ink-2)", rot:-90 });
}
function ehLevel(x1, x2, y, lab, cap, o){
  o = o || {}; var op = o.op == null ? 1 : o.op;
  return ln(x1, y, x2, y, { c:"var(--ink)", w:o.w || 3, op:op }) + (lab ? tx((x1 + x2) / 2, y - 10, lab, { fs:o.fs || 12.5, w:600, halo:true, op:op }) : "") +
    (cap ? tx((x1 + x2) / 2, y + 12, cap, { fs:o.cfs || 10.5, c:"var(--ink-2)", halo:true, op:op }) : "");
}
function ehArrow(x, y1, y2, lab, o){
  o = o || {}; var c = o.c || "var(--en-dh)", d = y2 - y1, dir = d > 0 ? 1 : -1, hd = o.hd || 10, h = "";
  if (Math.abs(d) < 1.5) return "";
  if (Math.abs(d) > hd) h += ln(x, y1, x, y2 - dir * hd * 0.8, { c:c, w:o.w || 3.2, op:o.op });
  h += head(x, y2, dir > 0 ? Math.PI / 2 : -Math.PI / 2, Math.min(hd, Math.abs(d)), c, o.op);
  if (lab) h += tx(x + (o.a === "end" ? -9 : 9), (y1 + y2) / 2, lab, { a:o.a || "start", fs:o.fs || 13, w:700, c:o.lc || c, halo:true, op:o.op });
  return h;
}
function ehThermo(x, yTop, yBot, frac, lines, o){
  o = o || {}; var h = "", yb = yBot - 11, top = yTop, mid = (top + yb) / 2, span = (yb - top) / 2 - 8, lvl = mid - clamp(frac, -1, 1) * span;
  h += rect(x - 6, top, 12, yb - top + 4, "var(--sheet)", { rx:6, s:"var(--ink)", sw:1.6 }) + circ(x, yBot, 11, "var(--sheet)", { s:"var(--ink)", sw:1.6 });
  for (var i = -2; i <= 2; i++) h += ln(x + 6, mid - i * span / 2, x + 11, mid - i * span / 2, { c:"var(--ink-2)", w:1.2 });
  h += ln(x + 4, mid, x + 14, mid, { c:"var(--ink-2)", w:1.2, d:"2 2" });
  h += rect(x - 2.6, lvl, 5.2, yBot - lvl, "var(--ink)", { rx:2.6 }) + circ(x, yBot, 7.5, "var(--ink)");
  (lines || []).forEach(function(t, k){ h += tx(x, top - 12 - (lines.length - 1 - k) * 14, t, { fs:k === lines.length - 1 && lines.length > 1 ? 12 : 11, w:k === lines.length - 1 && lines.length > 1 ? 700 : 400, c:k === lines.length - 1 && lines.length > 1 ? "var(--ink)" : "var(--ink-2)" }); });
  return h;
}
function ehDiagram(o){
  var h = "";
  if (o.axis) h += ehAxis(o.axis.x, o.axis.y1, o.axis.y2, o.axis);
  (o.guides || []).forEach(function(g){ h += ln(g[0], g[1], g[2], g[1], { c:"var(--ink-2)", w:1.2, d:"4 4" }); });
  (o.levels || []).forEach(function(L){ h += ehLevel(L.x1, L.x2, L.y, L.lab, L.cap, L); });
  if (o.arrow) h += ehArrow(o.arrow.x, o.arrow.y1, o.arrow.y2, o.arrow.lab, o.arrow);
  if (o.thermo) h += ehThermo(o.thermo.x, o.thermo.y1, o.thermo.y2, o.thermo.frac, o.thermo.lines);
  return h;
}

// ---------- hero ----------
function hero(f){
  var svg = $("#eh-hx-svg"), ctr = $("#eh-hx-ctr"), rep = $("#eh-hx-replay"), cap = f.cap, run = 0, st;
  if (!svg) return;
  var FE = card("fe"), CP = card("cold");
  function reset(){ st = { wa:-1, wt:0, ca:-1, ct:0, sq:0, sq2:0, d1:0, d2:0 }; }
  function flow(cx, out, ph, op){
    var h = "", gaps = [[cx - 66, cx - 32], [cx + 24, cx + 46]];
    gaps.forEach(function(g, gi){
      for (var i = 0; i < 3; i++) {
        var y = 72 + i * 18, p = ph < 0 ? 0.5 : (ph * 2.2 + i * 0.33 + gi * 0.15) % 1, inner = gi === 0 ? g[1] : g[0], outer = gi === 0 ? g[0] : g[1];
        var a = out ? inner : outer, b = out ? outer : inner, x = lerp(a, b, p), dir = b > a ? 1 : -1, fade = ph < 0 ? 1 : Math.min(1, p * 4, (1 - p) * 4);
        h += arrowH(x - dir * 8, x + dir * 6, y, "var(--en-dh)", 2.4, op * fade);
      }
    });
    return h;
  }
  function panel(cx, warm, a, t, sq, d){
    var h = tx(cx, 14, warm ? "Hand warmer" : "Cold pack", { fs:13.5, w:700 });
    // hand
    h += rect(cx - 104, 58, 36, 66, "var(--paper)", { rx:17, s:"var(--ink-2)", sw:1.5 }) + tx(cx - 86, 136, "hand", { fs:11, c:"var(--ink-2)" });
    // pouch (squeezed: narrower for a moment)
    var w = 54 - 10 * sq;
    h += rect(cx - 3 - w / 2, 56, w, 70, "var(--sheet)", { rx:10, s:"var(--ink)", sw:1.8 }) + tx(cx - 3, 91, warm ? "Fe + O₂" : "salt", { fs:11, c:"var(--ink-2)" }) + tx(cx - 3, 136, "pouch", { fs:11, c:"var(--ink-2)" });
    if (a !== -1) h += flow(cx, warm, a, 1);
    h += ehThermo(cx + 64, 46, 140, (warm ? 1 : -1) * 0.65 * t, ["air"]);
    // the enthalpy diagram beneath
    var yR = warm ? 196 : 292, yP = warm ? 292 : 216, cd = warm ? FE : CP, s = eqSides(cd, 1, false, true);
    if (d > 0) {
      h += ehAxis(cx - 104, 170, 312, { fs:10.5 });
      h += ehLevel(cx - 92, cx - 22, yR, pl(s.L), "", { op:Math.min(1, d * 3), fs:11.5 });
      if (d > 0.3) h += ehLevel(cx + 12, cx + 86, yP, pl(s.R), "", { op:Math.min(1, (d - 0.3) * 4), fs:11.5 });
      if (d > 0.5) {
        var t2 = clamp((d - 0.5) / 0.5, 0, 1), ye = lerp(yR, yP, t2);
        h += ln(cx - 22, yR, cx - 3, yR, { c:"var(--ink-2)", w:1.2, d:"4 4" }) + ehArrow(cx - 3, yR, ye, "", {});
        if (t2 >= 1) h += ln(cx - 3, yP, cx + 12, yP, { c:"var(--ink-2)", w:1.2, d:"4 4" }) + tx(cx, 330, DHS + " = " + kJ(cd.dh), { fs:12.5, w:700, c:"var(--en-dh)" });
      }
    }
    return h;
  }
  function draw(){ svg.innerHTML = ln(240, 6, 240, 334, { c:"var(--rule)", w:1.5 }) + panel(120, true, st.wa, st.wt, st.sq, st.d1) + panel(360, false, st.ca, st.ct, st.sq2, st.d2); }
  function final(){
    st = { wa:-2, wt:1, ca:-2, ct:1, sq:0, sq2:0, d1:1, d2:1 }; st.wa = -2; st.ca = -2;
    draw();
    ctr.innerHTML = "Energy out: the diagram steps down, " + DH + " &lt; 0. Energy in: it steps up, " + DH + " &gt; 0.";
    cap.textContent = "Exothermic warms the surroundings; endothermic cools them."; rep.hidden = false;
  }
  function play(){
    var id = ++run; reset(); rep.hidden = true; cap.textContent = ""; draw();
    function ok(){ return id === run; }
    ctr.textContent = "A hand warmer is squeezed: energy flows out into your hand, and the air warms.";
    MV.tween({ dur:2600, ease:LIN, step:function(t){ if (!ok()) return; st.sq = t < 0.15 ? Math.sin(t / 0.15 * Math.PI) : 0; st.wa = t; st.wt = clamp(t * 1.3, 0, 1); draw(); }, done:function(){
      if (!ok()) return; st.wa = -2; st.wt = 1;
      ctr.textContent = "A cold pack is squeezed: energy flows from your hand into the pack, and the air cools.";
      MV.tween({ dur:2600, ease:LIN, step:function(t){ if (!ok()) return; st.sq2 = t < 0.15 ? Math.sin(t / 0.15 * Math.PI) : 0; st.ca = t; st.ct = clamp(t * 1.3, 0, 1); draw(); }, done:function(){
        if (!ok()) return; st.ca = -2; st.ct = 1;
        ctr.textContent = "Now their enthalpy diagrams…";
        MV.tween({ dur:1300, ease:LIN, step:function(t){ if (!ok()) return; st.d1 = t; st.d2 = clamp(t * 1.1 - 0.1, 0, 1); draw(); }, done:function(){ if (ok()) MV.wait(300, function(){ if (ok()) final(); }); } });
      } });
    } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Enthalpy diagram builder ----------
var VB = { W:560, H:340, AX:34, YT:32, YB:312, LEFT:[64, 204], RIGHT:[300, 440], ARX:252, THX:510, YHI:62, YLO:290, YM:176 };
var MK = [
  { id:"ice", t:"melting ice", v:FUS, vt:fx(FUS, 2) + " kJ/mol" },
  { id:"boil", t:"boiling water", v:VAP, vt:fx(VAP, 1) + " kJ/mol" },
  { id:"ch4", t:"burning methane", v:-card("ch4").dh, vt:fx(-card("ch4").dh, 1) + " kJ/mol" },
  { id:"u", t:"fission of U-235", v:FISSION, vt:"≈ " + MV.chem.sci(FISSION) + " kJ/mol" }
];
var SC = { x0:40, x1:520, n:11, y:120 };
function scX(L){ return SC.x0 + L * (SC.x1 - SC.x0) / SC.n; }
var SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
function pow10(n){ n = Math.round(n * 4) / 4; if (n === 0) return "1"; if (n === 1) return "10"; return Number.isInteger(n) ? "10" + String(n).split("").map(function(d){ return SUP[+d]; }).join("") : null; }
function powT(L){ var p = pow10(L); return p || "10<sup>" + fx(L, 2) + "</sup>"; }
function sciPlain(v){ var e = Math.floor(Math.log10(v) + 1e-9), m = v / Math.pow(10, e); return e < 3 ? String(Math.round(v)) : fx(m, 1) + " × 10" + String(e).split("").map(function(d){ return SUP[+d]; }).join(""); }

function explore(host, api){
  var S = api.S, C = api.content;
  if (["diagram", "scales", "bonds"].indexOf(S.mode) < 0) S.mode = "diagram";
  if (["free", "build", "link"].indexOf(S.sub) < 0) S.sub = "free";
  if (!CARDS.some(function(c){ return c.id === S.card; })) S.card = "ch4";
  S.k = clamp(Math.round((+S.k || 1) * 2) / 2, 0.5, 5); if (S.dir !== "r") S.dir = "f";
  S.b = S.b && typeof S.b === "object" ? S.b : {}; S.b.off = clamp(Math.round(+S.b.off || 0), -110, 110); S.b.shown = !!S.b.shown;
  S.L = S.L && typeof S.L === "object" ? S.L : {}; if (S.L.mdir !== "r") S.L.mdir = "f"; S.L.k = clamp(Math.round((+S.L.k || 1) * 2) / 2, 0.5, 5);
  S.sc = S.sc && typeof S.sc === "object" ? S.sc : {}; S.sc.pos = S.sc.pos && typeof S.sc.pos === "object" ? S.sc.pos : {};
  MK.forEach(function(m){ var v = S.sc.pos[m.id]; S.sc.pos[m.id] = typeof v === "number" && isFinite(v) ? clamp(v, 0, 11) : null; });
  if (!MK.some(function(m){ return m.id === S.sc.sel; })) S.sc.sel = "ice"; S.sc.shown = !!S.sc.shown;
  S.bond = clamp(Math.round(+S.bond || 0), 0, 2);
  var busy = false, locked = false, tw = null, A = null, note = "", seq = 0, bondT = 1;

  host.innerHTML = '<p class="how eh-how">' + C.how + '</p><div class="eh-modes"></div><div class="eh-grid">' +
    '<div class="eh-view"><div class="eh-subs" data-for="diagram"></div><div class="eh-box" id="eh-box"><svg class="eh-svg" id="eh-svg" viewBox="0 0 560 340" role="img" aria-label=""></svg></div><p class="eh-cap" aria-live="polite"></p></div>' +
    '<div class="eh-side">' +
      '<div class="eh-c" data-for="one"><div class="eh-cards"></div>' +
        '<label class="slider eh-sl"><span class="slider-top"><span>Amount (multiplies the whole equation)</span><output id="eh-kout"></output></span><input type="range" id="eh-k" min="0.5" max="5" step="0.5" aria-label="Amount multiplier"></label>' +
        '<div class="eh-dir"></div><div class="eh-bld"></div></div>' +
      '<div class="eh-c" data-for="link"><div class="eh-ldir"></div>' +
        '<label class="slider eh-sl"><span class="slider-top"><span>Limestone amount</span><output id="eh-lkout"></output></span><input type="range" id="eh-lk" min="0.5" max="5" step="0.5" aria-label="Limestone multiplier"></label></div>' +
      '<div class="eh-c" data-for="scales"><div class="eh-mks"></div>' +
        '<label class="slider eh-sl"><span class="slider-top"><span id="eh-poslab">Position</span><output id="eh-posout"></output></span><input type="range" id="eh-pos" min="0" max="11" step="0.25" aria-label="Marker position, power of ten"></label>' +
        '<div class="eh-scb"></div><p class="tiny muted">' + C.scalesNote + "</p></div>" +
      '<div class="eh-c" data-for="bonds"><div class="eh-stage"></div><p class="tiny muted">' + C.bondsNote + "</p></div>" +
      '<dl class="read eh-read" aria-live="polite"></dl></div></div><div class="eh-tabs"></div>';
  var svg = $("#eh-svg"), box = $("#eh-box"), kIn = $("#eh-k"), lkIn = $("#eh-lk"), posIn = $("#eh-pos"), bld = $(".eh-bld", host), scb = $(".eh-scb", host);
  MV.chem.tablePanel($(".eh-tabs", host), "dhf", { title:"Course data table: enthalpies of formation, ΔH°f" });

  // ----- controls -----
  var RG = {};
  RG.mode = radios($(".eh-modes", host), { label:"Mode", aria:"Builder mode", options:[{ id:"diagram", t:"Diagram" }, { id:"scales", t:"Energy scales" }, { id:"bonds", t:"Bonds" }], value:S.mode,
    onChange:function(v){ cancelAnim(); S.mode = v; note = ""; if (v === "bonds") bondT = 1; api.save(); paint(); } });
  RG.sub = radios($(".eh-subs", host), { label:"View", cls:"chips", aria:"Diagram view", options:[{ id:"free", t:"One reaction" }, { id:"build", t:"Build it" }, { id:"link", t:"Linked panels" }], value:S.sub,
    onChange:function(v){ cancelAnim(); S.sub = v; note = ""; if (v === "build") { S.b.off = 0; S.b.shown = false; } api.save(); paint(); } });
  RG.card = radios($(".eh-cards", host), { label:"Reaction card", cls:"chips eh-cardrow", aria:"Reaction card", options:CARDS.map(function(c){ return { id:c.id, t:c.name }; }), value:S.card,
    onChange:function(v){ S.card = v; resetBuild(); note = ""; api.save(); paint(); } });
  RG.dir = radios($(".eh-dir", host), { label:"Direction", aria:"Direction", options:[{ id:"f", t:"forward" }, { id:"r", t:"reverse" }], value:S.dir,
    onChange:function(v){ S.dir = v; resetBuild(); note = ""; api.save(); paint(); } });
  RG.ldir = radios($(".eh-ldir", host), { label:"Methane (left panel), × 1", aria:"Methane direction", options:[{ id:"f", t:"forward" }, { id:"r", t:"reverse" }], value:S.L.mdir,
    onChange:function(v){ S.L.mdir = v; note = ""; api.save(); paint(); } });
  RG.mk = radios($(".eh-mks", host), { label:"Marker to place", cls:"chips", aria:"Marker to place", options:MK.map(function(m){ return { id:m.id, t:m.t }; }), value:S.sc.sel,
    onChange:function(v){ S.sc.sel = v; api.save(); paint(); } });
  RG.stage = radios($(".eh-stage", host), { label:"Methane burns, step by step", aria:"Bond step", options:[{ id:"0", t:"Reactants" }, { id:"1", t:"Break bonds" }, { id:"2", t:"Form bonds" }], value:String(S.bond),
    onChange:function(v){ var nb = +v, grow = nb > S.bond; S.bond = nb; api.save(); if (grow && !MV.reduceMotion) growBond(); else { bondT = 1; paint(); } } });
  function resetBuild(){ if (S.sub === "build") { S.b.off = 0; S.b.shown = false; } }
  function syncRG(){ RG.mode.set(S.mode); RG.sub.set(S.sub); RG.card.set(S.card); RG.dir.set(S.dir); RG.ldir.set(S.L.mdir); RG.mk.set(S.sc.sel); RG.stage.set(String(S.bond)); }
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); paintCtl(); }
  kIn.addEventListener("input", function(){ if (locked || busy) return; S.k = clamp(+kIn.value, 0.5, 5); resetBuild(); note = ""; api.save(); paint(); });
  lkIn.addEventListener("input", function(){ if (locked || busy) return; S.L.k = clamp(+lkIn.value, 0.5, 5); note = ""; api.save(); paint(); });
  posIn.addEventListener("input", function(){ if (locked || busy) return; S.sc.pos[S.sc.sel] = clamp(+posIn.value, 0, 11); api.save(); paint(); });
  function paintCtl(){
    var dis = locked || busy;
    kIn.value = String(S.k); kIn.disabled = dis; $("#eh-kout").textContent = "× " + kT(S.k);
    lkIn.value = String(S.L.k); lkIn.disabled = dis; $("#eh-lkout").textContent = "× " + kT(S.L.k);
    var p = S.sc.pos[S.sc.sel]; posIn.value = String(p == null ? 0 : p); posIn.disabled = dis;
    $("#eh-poslab").textContent = "Position of “" + MK.filter(function(m){ return m.id === S.sc.sel; })[0].t + "”";
    $("#eh-posout").innerHTML = p == null ? muted("not placed") : "≈ " + powT(p) + " kJ/mol";
    var d = dis ? " disabled" : "";
    MV.keepFocus(bld, function(){
      bld.innerHTML = S.sub !== "build" ? "" : '<div class="eh-bbtns"><button type="button" class="btn sm" data-act="up" data-k="up"' + (d || S.b.shown ? " disabled" : "") + '>▲ Raise products</button><button type="button" class="btn sm" data-act="down" data-k="down"' + (d || S.b.shown ? " disabled" : "") + '>▼ Lower products</button>' +
        '<button type="button" class="btn primary sm" data-act="reveal" data-k="reveal"' + (d || S.b.shown ? " disabled" : "") + ">Reveal " + DH + "</button>" + (S.b.shown ? '<button type="button" class="btn ghost sm" data-act="again" data-k="again"' + d + ">Build again</button>" : "") + "</div>";
    });
    MV.keepFocus(scb, function(){
      scb.innerHTML = '<div class="eh-bbtns"><button type="button" class="btn primary sm" data-act="show" data-k="show"' + d + ">" + (S.sc.shown ? "Hide the real values" : "Reveal the real values") + '</button><button type="button" class="btn ghost sm" data-act="clear" data-k="clear"' + d + ">Clear markers</button></div>";
    });
    var bmode = S.mode === "diagram" && S.sub === "build" && !S.b.shown && !dis;
    if (bmode) { box.setAttribute("tabindex", "0"); box.setAttribute("role", "slider"); box.setAttribute("aria-label", "Products’ level: use the up and down arrow keys"); box.setAttribute("aria-valuemin", "-110"); box.setAttribute("aria-valuemax", "110"); box.setAttribute("aria-valuenow", String(S.b.off)); box.setAttribute("aria-valuetext", offText(S.b.off)); }
    else { ["tabindex", "role", "aria-label", "aria-valuemin", "aria-valuemax", "aria-valuenow", "aria-valuetext"].forEach(function(a){ box.removeAttribute(a); }); }
    box.classList.toggle("drag", bmode);
  }
  function offText(o){ return o === 0 ? "level with the reactants" : (o > 0 ? "above" : "below") + " the reactants’ level"; }
  function nudge(d){ if (locked || busy || S.sub !== "build" || S.b.shown) return; S.b.off = clamp(S.b.off + d, -110, 110); note = ""; api.save(); paint(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked || busy || !host.contains(b)) return;
    var a = b.dataset.act;
    if (a === "up") nudge(10); else if (a === "down") nudge(-10);
    else if (a === "reveal") reveal();
    else if (a === "again") { S.b.off = 0; S.b.shown = false; note = ""; api.save(); paint(); }
    else if (a === "show") { S.sc.shown = !S.sc.shown; api.save(); paint(); }
    else if (a === "clear") { MK.forEach(function(m){ S.sc.pos[m.id] = null; }); S.sc.shown = false; S.sc.sel = "ice"; RG.mk.set("ice"); api.save(); paint(); }
  });
  box.addEventListener("keydown", function(e){
    if (!(S.mode === "diagram" && S.sub === "build" && !S.b.shown)) return;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); nudge(10); }
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); nudge(-10); }
  });
  // pointer: drag the products' level (Build it); tap the ruler (Energy scales)
  var drag = false;
  function svgPt(e){ var r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; return { x:(e.clientX - r.left) * vb.width / r.width, y:(e.clientY - r.top) * vb.height / r.height }; }
  svg.addEventListener("pointerdown", function(e){
    if (locked || busy) return;
    var p = svgPt(e);
    if (S.mode === "diagram" && S.sub === "build" && !S.b.shown) { drag = true; try { svg.setPointerCapture(e.pointerId); } catch (err) {} setOff(p.y); e.preventDefault(); }
    else if (S.mode === "scales") {
      if (p.y < 20 || p.y > 160) return;
      S.sc.pos[S.sc.sel] = clamp(Math.round((p.x - SC.x0) * SC.n / (SC.x1 - SC.x0) * 4) / 4, 0, 11);
      var nx = MK.filter(function(m){ return S.sc.pos[m.id] == null; })[0]; if (nx) { S.sc.sel = nx.id; RG.mk.set(nx.id); }
      api.save(); paint();
    }
  });
  svg.addEventListener("pointermove", function(e){ if (drag) setOff(svgPt(e).y); });
  function endDrag(){ drag = false; }
  svg.addEventListener("pointerup", endDrag); svg.addEventListener("pointercancel", endDrag);
  function setOff(y){ var o = clamp(Math.round((VB.YM - y) / 10) * 10, -110, 110); if (o !== S.b.off) { S.b.off = o; note = ""; api.save(); paint(); } }

  // ----- animations -----
  function cancelAnim(){ seq++; if (tw) { tw(); tw = null; } A = null; busy = false; }
  function begin(){ cancelAnim(); busy = true; lock(true); return seq; }
  function anim(key, from, to, dur, cb, keepLock){
    var my = begin(); A = {}; A[key] = from;
    tw = MV.tween({ dur:dur, step:function(t){ if (my !== seq) return; A[key] = lerp(from, to, t); draw(); }, done:function(){
      if (my !== seq) return; tw = null; A = null; busy = false; if (!keepLock) lock(false); if (cb) cb(); paint();
    } });
  }
  function growBond(){ bondT = 0; anim("bt", 0, 1, 900, function(){ bondT = 1; }); }
  function reveal(cb, keepLock){
    var cd = card(S.card), dh = dHof(cd, S.k, S.dir === "r"), target = dh > 0 ? 100 : -100, from = S.b.off;
    note = from === 0 ? "You left the levels together, but energy moved, so they can’t be level." : (from > 0) === (dh > 0) ? "Your level was on the right side." : (dh < 0 ? "The products sit lower: energy leaves the system, so " + DH + " is negative." : "The products sit higher: energy enters the system, so " + DH + " is positive.");
    if (cb) note = "";
    anim("off", from, target, 1100, function(){ S.b.off = target; S.b.shown = true; api.save(); if (cb) cb(); }, keepLock);
  }

  // ----- geometry -----
  function oneGeo(){
    var cd = card(S.card), k = A && A.k != null ? A.k : S.k, u = A && A.u != null ? A.u : (S.dir === "r" ? 1 : 0);
    var off = 44 * k, exo = cd.dh < 0, yA = exo ? VB.YHI : VB.YLO, yB = exo ? VB.YHI + off : VB.YLO - off;
    var kd = Math.round(k * 2) / 2, sA = side(cd.r, kd), sB = side(cd.p, kd);
    return { cd:cd, k:k, u:u, yA:yA, yB:yB, sA:sA, sB:sB, dh:rd(cd.dh * k * (1 - 2 * u)) };
  }
  function drawOne(){
    var g = oneGeo(), xa = [lerp(VB.LEFT[0], VB.RIGHT[0], g.u), lerp(VB.LEFT[1], VB.RIGHT[1], g.u)], xb = [lerp(VB.RIGHT[0], VB.LEFT[0], g.u), lerp(VB.RIGHT[1], VB.LEFT[1], g.u)];
    var capA = g.u < 0.5 ? "reactants" : "products", capB = g.u < 0.5 ? "products" : "reactants", yt = lerp(g.yA, g.yB, g.u), yh = lerp(g.yB, g.yA, g.u), still = g.u === 0 || g.u === 1;
    var o = { axis:{ x:VB.AX, y1:VB.YT, y2:VB.YB }, levels:[{ x1:xa[0], x2:xa[1], y:g.yA, lab:pl(g.sA), cap:capA }, { x1:xb[0], x2:xb[1], y:g.yB, lab:pl(g.sB), cap:capB }],
      guides:still ? [[VB.LEFT[1], yt, VB.ARX], [VB.ARX, yh, VB.RIGHT[0]]] : [], arrow:{ x:VB.ARX, y1:yt, y2:yh, lab:still ? DHS + " = " + kJ(g.dh) : "" },
      thermo:{ x:VB.THX, y1:72, y2:300, frac:-g.dh / (5 * Math.abs(g.cd.dh)), lines:["surroundings", (g.dh < 0 ? "gain " : "lose ") + fx(Math.abs(g.dh), 1) + " kJ"] } };
    var h = ehDiagram(o) + tx(VB.AX + 8, 330, "Each card has its own scale.", { a:"start", fs:10.5, c:"var(--ink-2)" });
    return { h:h, d:"Enthalpy diagram for " + g.cd.name.toLowerCase() + ": " + MV.plain(CF((g.u < 0.5 ? g.sA : g.sB) + " -> " + (g.u < 0.5 ? g.sB : g.sA))) + ". The products’ level is " + (g.dh < 0 ? "below" : "above") + " the reactants’; the orange arrow points " + (g.dh < 0 ? "down" : "up") + ", ΔH = " + MV.plain(kJ(g.dh)) + ". The surroundings thermometer " + (g.dh < 0 ? "rises" : "falls") + "." };
  }
  function drawBuild(){
    var cd = card(S.card), rev = S.dir === "r", s = eqSides(cd, S.k, rev), dh = dHof(cd, S.k, rev), off = A && A.off != null ? A.off : S.b.off, yP = VB.YM - off, shown = S.b.shown && !A;
    var o = { axis:{ x:VB.AX, y1:VB.YT, y2:VB.YB }, levels:[{ x1:VB.LEFT[0], x2:VB.LEFT[1], y:VB.YM, lab:pl(s.L), cap:"reactants" }, { x1:VB.RIGHT[0], x2:VB.RIGHT[1], y:yP, lab:pl(s.R), cap:"products" }],
      guides:[[VB.LEFT[1], VB.YM, VB.ARX], [VB.ARX, yP, VB.RIGHT[0]]],
      arrow:A || shown ? { x:VB.ARX, y1:VB.YM, y2:yP, lab:shown ? DHS + " = " + kJ(dh) : "" } : null,
      thermo:{ x:VB.THX, y1:72, y2:300, frac:shown ? -dh / (5 * Math.abs(cd.dh)) : 0, lines:["surroundings", shown ? (dh < 0 ? "gain " : "lose ") + fx(Math.abs(dh), 1) + " kJ" : "?"] } };
    var h = ehDiagram(o);
    if (!shown && !A) {
      h += tx(VB.ARX + 10, (VB.YM + yP) / 2 + (off === 0 ? -22 : 0), DHS + " = ?", { a:"start", fs:13, w:700, c:"var(--ink-2)", halo:true });
      h += circ(VB.RIGHT[1] + 16, yP, 11, "var(--sheet)", { s:"var(--ink)", sw:2 }) + head(VB.RIGHT[1] + 16, yP - 7, -Math.PI / 2, 6, "var(--ink)") + head(VB.RIGHT[1] + 16, yP + 7, Math.PI / 2, 6, "var(--ink)");
    }
    return { h:h, d:"Build it: " + MV.plain(eqHTML(s)) + ". Reactants’ level in the middle; products’ level " + offText(shown ? (dh > 0 ? 1 : -1) : off) + "." + (shown ? " Revealed: ΔH = " + MV.plain(kJ(dh)) + "." : " ΔH is hidden until you reveal it.") };
  }
  function drawLink(){
    var s = 220 / 900, mk = card("ch4"), ls = card("caco3"), k = S.L.k, u = S.L.mdir === "r" ? 1 : 0, h = "";
    function pan(x0, cd, kk, uu, title){
      var off = Math.abs(cd.dh) * kk * s, exo = cd.dh < 0, yA = exo ? 70 : 296, yB = exo ? 70 + off : 296 - off, L = [x0 + 18, x0 + 100], R = [x0 + 140, x0 + 222], ax = x0 + 120;
      var xa = uu ? R : L, xb = uu ? L : R, yt = uu ? yB : yA, yh = uu ? yA : yB, dh = dHof(cd, kk, !!uu), sd = eqSides(cd, kk, false, true);
      return tx(x0 + 120, 12, title, { fs:12.5, w:700 }) + tx(x0 + 120, 28, DHS + " = " + kJ(dh), { fs:12.5, w:700, c:"var(--en-dh)" }) +
        ehDiagram({ axis:{ x:x0 + 4, y1:44, y2:316, fs:10.5 }, levels:[{ x1:xa[0], x2:xa[1], y:yA, lab:pl(sd.L), cap:uu ? "products" : "reactants", fs:11.5 }, { x1:xb[0], x2:xb[1], y:yB, lab:pl(sd.R), cap:uu ? "reactants" : "products", fs:11.5 }],
          guides:[[L[1], yt, ax], [ax, yh, R[0]]], arrow:{ x:ax, y1:yt, y2:yh, lab:"" } });
    }
    h += pan(6, mk, 1, u, "Methane × 1 (" + (u ? "reverse" : "forward") + ")") + ln(280, 6, 280, 334, { c:"var(--rule)", w:1.5 }) + pan(298, ls, k, 0, "Limestone × " + kT(k));
    var need = rd(ls.dh * k), have = -mk.dh;
    return { h:h, d:"Linked panels. Left: methane × 1, " + (u ? "reversed: it absorbs " : "forward: it releases ") + fx(have, 1) + " kJ. Right: limestone × " + kT(k) + " absorbs " + fx(need, 1) + " kJ. Both diagrams use the same scale." };
  }
  function drawScales(){
    var h = "", t = A && A.rv != null ? A.rv : (S.sc.shown ? 1 : 0);
    h += tx(SC.x0, 18, "Energy per mole (kJ/mol), log scale", { a:"start", fs:12, w:700, c:"var(--ink-2)" });
    h += ln(SC.x0, SC.y, SC.x1, SC.y, { c:"var(--ink)", w:2.4 });
    for (var L = 0; L <= SC.n; L++) { var x = scX(L); h += ln(x, SC.y - 6, x, SC.y + 6, { c:"var(--ink)", w:1.6 }) + tx(x, SC.y + 18, pow10(L), { fs:11.5 }); }
    MK.forEach(function(m, i){
      var p = S.sc.pos[m.id], on = m.id === S.sc.sel, y = 36 + i * 17;
      if (p != null) { var x = scX(p); h += ln(x, y + 6, x, SC.y - 3, { c:"var(--ink-2)", w:1.3, d:"3 2" }) + head(x, SC.y - 2, Math.PI / 2, 7, "var(--ink-2)") + tx(x + (x > 400 ? -6 : 6), y, m.t + " (you)", { a:x > 400 ? "end" : "start", fs:11.5, w:on ? 700 : 400, halo:true }); }
      else if (on) h += tx(SC.x1, y, "tap the ruler to place “" + m.t + "”", { a:"end", fs:11, c:"var(--ink-2)" });
    });
    if (t > 0) MK.forEach(function(m, i){
      var tt = clamp(t * MK.length - i, 0, 1); if (tt <= 0) return;
      var x = scX(Math.log10(m.v)), y = 156 + i * 17;
      h += ln(x, SC.y + 4, x, lerp(SC.y + 4, y - 7, tt), { c:"var(--en-dh)", w:2.2, op:tt }) + circ(x, SC.y, 5, "var(--en-dh)", { op:tt }) + tx(x + (x > 380 ? -7 : 7), y, m.t + ": " + MV.plain(m.vt), { a:x > 380 ? "end" : "start", fs:11.5, w:700, halo:true, op:tt });
    });
    return { h:h, d:"Log-scale ruler from 1 to 10¹¹ kJ/mol. " + MK.map(function(m){ var p = S.sc.pos[m.id]; return m.t + ": " + (p == null ? "not placed" : "you placed it at about 10 to the " + fx(p, 2)); }).join("; ") + "." + (S.sc.shown ? " Real values: " + MK.map(function(m){ return m.t + " " + MV.plain(m.vt); }).join(", ") + "." : "") };
  }
  function drawBonds(){
    var sc = 248 / (2 * CO_CO2 + 4 * BOND["O–H"]), inCH = 4 * BOND["C–H"] * sc, inOO = 2 * BOND["O=O"] * sc, outCO = 2 * CO_CO2 * sc, outOH = 4 * BOND["O–H"] * sc;
    var yA = 50, yR = yA + inCH + inOO, yP = yA + outCO + outOH, st = S.bond, bt = A && A.bt != null ? A.bt : bondT, h = "";
    var tIn = st >= 1 ? (st === 1 ? bt : 1) : 0, tOut = st >= 2 ? bt : 0;
    h += ehAxis(VB.AX, VB.YT, VB.YB);
    h += ehLevel(50, 170, yR, pl("CH4(g) + 2O2(g)"), "reactants");
    if (st >= 1) h += ehLevel(186, 376, yA, "C + 4H + 4O (separate atoms)", "", { op:tIn, fs:12 });
    // energy in: bonds broken (brown, up)
    if (tIn > 0) {
      var x = 188, w = 24, hCH = inCH * Math.min(1, tIn * 2), hOO = inOO * clamp(tIn * 2 - 1, 0, 1);
      h += rect(x, yR - hCH, w, hCH, "var(--en-ea)") + (hOO > 0 ? rect(x, yR - inCH - hOO, w, hOO, "var(--en-ea)", { op:0.7 }) : "");
      h += tx(x - 6, yR - inCH / 2, "4 C–H", { a:"end", fs:12, w:700, op:Math.min(1, tIn * 2) }) + (hOO > 0 ? tx(x - 6, yR - inCH - inOO / 2, "2 O=O", { a:"end", fs:12, w:700 }) : "");
      if (tIn >= 1) h += head(x + w / 2, yA - 9, -Math.PI / 2, 9, "var(--en-ea)");
      h += tx(x + w / 2, yR + 14, "in", { fs:12, w:700, c:"var(--en-ea)" }) + tx(x + w / 2, yR + 28, "(absorbed)", { fs:10.5, c:"var(--en-ea)" });
    }
    // energy out: bonds formed (orange, down)
    if (tOut > 0) {
      var x2 = 350, hCO = outCO * Math.min(1, tOut * 2), hOH = outOH * clamp(tOut * 2 - 1, 0, 1);
      h += rect(x2, yA, 24, hCO, "var(--en-dh)", { op:0.75 }) + (hOH > 0 ? rect(x2, yA + outCO, 24, hOH, "var(--en-dh)") : "");
      h += tx(x2 + 30, yA + outCO / 2, "2 C=O", { a:"start", fs:12, w:700, op:Math.min(1, tOut * 2) }) + (hOH > 0 ? tx(x2 + 30, yA + outCO + outOH / 2, "4 O–H", { a:"start", fs:12, w:700 }) : "");
      if (tOut >= 1) {
        h += head(x2 + 12, yP + 9, Math.PI / 2, 9, "var(--en-dh)") + tx(x2 + 12, yP + 20, "out", { fs:12, w:700, c:"var(--en-dh)" }) + tx(x2 + 12, yP + 33, "(released)", { fs:10.5, c:"var(--en-dh)" });
        h += ehLevel(400, 520, yP, pl("CO2(g) + 2H2O(l)"), "products");
        h += ln(170, yR, 281, yR, { c:"var(--ink-2)", w:1.2, d:"4 4" }) + ln(281, yP, 400, yP, { c:"var(--ink-2)", w:1.2, d:"4 4" }) + ehArrow(281, yR, yP, DHS + " &lt; 0", { fs:12 });
      }
    }
    var d = "Bonds staircase for burning methane. " + (st === 0 ? "Reactants only." : st === 1 ? "Breaking 4 C–H and 2 O=O bonds: a brown 'in' bar rises to the separate-atoms level (energy absorbed)." : "Forming 2 C=O and 4 O–H bonds: an orange 'out' bar falls further than the 'in' bar rose, so the products sit below the reactants: ΔH < 0.");
    return { h:h, d:d };
  }
  function draw(){
    var r, m = S.mode;
    if (m === "scales") { svg.setAttribute("viewBox", "0 0 560 230"); r = drawScales(); }
    else { svg.setAttribute("viewBox", "0 0 560 340"); r = m === "bonds" ? drawBonds() : S.sub === "build" ? drawBuild() : S.sub === "link" ? drawLink() : drawOne(); }
    svg.innerHTML = r.h; svg.setAttribute("aria-label", r.d);
  }

  // ----- readout and caption -----
  function paintRead(){
    var rows = [], m = S.mode;
    if (m === "diagram" && S.sub !== "link") {
      var cd = card(S.card), rev = S.dir === "r", s = eqSides(cd, S.k, rev), dh = dHof(cd, S.k, rev), hide = S.sub === "build" && !S.b.shown;
      var first = (rev ? cd.p : cd.r)[0], per = rd(dh / (first[0] * S.k)), nm = first[1].replace(/\((g|l|s|aq)\)$/, "");
      rows.push(["Equation as written", eqHTML(s)], [DH, hide ? muted("? (reveal it)") : "<strong>" + kJ(dh) + "</strong>"], ["Type", hide ? muted("?") : dh < 0 ? "exothermic" : "endothermic"],
        ["Surroundings", hide ? muted("?") : dh < 0 ? "warm up" : "cool down"], ["Heat-term form", hide ? muted("?") : heatHTML(s, dh)],
        [DH + " per mole of the first reactant", hide ? muted("?") : sg(per, 1) + " kJ/mol " + CF(nm)]);
      if (cd.misc) rows.push(["Source", "measured dissolving value (course data table)"]);
    } else if (m === "diagram") {
      var mk = card("ch4"), ls = card("caco3"), u = S.L.mdir === "r", have = -mk.dh, need = rd(ls.dh * S.L.k), spare = rd(have - need);
      rows.push(["Methane (left)", eqHTML(eqSides(mk, 1, u)) + ", " + DH + " = " + kJ(dHof(mk, 1, u))], ["Limestone (right)", eqHTML(eqSides(ls, S.L.k, false)) + ", " + DH + " = " + kJ(need)],
        ["Heat from methane", u ? "none: reversed, it <em>absorbs</em> " + fx(have, 1) + " kJ" : fx(have, 1) + " kJ released"], ["Heat limestone needs", fx(need, 1) + " kJ"],
        ["Enough heat?", u ? "no: the methane must supply heat" : spare >= 0 ? "yes, with " + fx(spare, 1) + " kJ to spare" : "no: short by " + fx(-spare, 1) + " kJ"]);
    } else if (m === "scales") {
      MK.forEach(function(mm){ var p = S.sc.pos[mm.id], real = Math.log10(mm.v), d = p == null ? null : Math.abs(p - real);
        rows.push([mm.t, (p == null ? muted("not placed") : "you: ≈ " + powT(p) + " kJ/mol") + (S.sc.shown ? "; real: " + mm.vt + (d == null ? "" : d <= 0.5 ? " (close)" : " (off by about " + fx(d, 1) + " powers of ten)") : "")]); });
      if (S.sc.shown) rows.push(["Methane ÷ ice", "890.5 ÷ 6.01 ≈ " + Math.round(MK[2].v / MK[0].v)], ["Fission ÷ methane", "≈ " + MV.chem.sci(MK[3].v / MK[2].v)]);
    } else {
      rows.push(["Bonds broken", "4 C–H, 2 O=O: energy <strong>in</strong> (absorbed)"], ["Bonds formed", S.bond >= 2 ? "2 C=O, 4 O–H: energy <strong>out</strong> (released)" : muted("not yet")],
        ["Which is bigger?", S.bond >= 2 ? "out &gt; in" : muted("—")], [DH, S.bond >= 2 ? "negative: exothermic" : muted("—")]);
    }
    $(".eh-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var m = S.mode, t = "";
    if (busy) t = "Watch the diagram…";
    else if (m === "diagram" && S.sub === "free") { var dh = dHof(card(S.card), S.k, S.dir === "r"); t = dh < 0 ? "Energy leaves the system: the products sit lower and the surroundings warm." : "Energy enters the system: the products sit higher and the surroundings cool."; }
    else if (m === "diagram" && S.sub === "build") t = S.b.shown ? "Revealed. Change the card, amount or direction to build another." : "Drag the products’ level above or below the reactants’ (or use the arrow keys), then reveal " + DH + ".";
    else if (m === "diagram") t = "Both panels use the same energy scale: compare the arrows’ lengths.";
    else if (m === "scales") t = S.sc.shown ? "Each step is ten times bigger. Phase changes, chemical changes and nuclear changes sit far apart." : "Where does each change belong? Place all four markers, then reveal.";
    else t = S.bond === 0 ? "Choose <strong>Break bonds</strong> to pull the reactants apart into atoms." : S.bond === 1 ? "Breaking bonds always absorbs energy. Now choose <strong>Form bonds</strong>." : "Forming bonds releases energy. Here more comes out than went in, so " + DH + " is negative.";
    $(".eh-cap", host).innerHTML = t + (note && !busy ? " <strong>" + note + "</strong>" : "");
  }
  function paint(){
    var m = S.mode, one = m === "diagram" && S.sub !== "link";
    $$(".eh-c", host).forEach(function(p){ var f = p.dataset.for; p.hidden = !(f === "one" ? one : f === "link" ? m === "diagram" && S.sub === "link" : f === m); });
    $(".eh-subs", host).hidden = m !== "diagram";
    draw(); paintRead(); paintCap(); paintCtl();
    MV.changed();
  }

  // ----- predictions -----
  var hooks = {
    start:function(p){
      cancelAnim(); note = "";
      if (p.id === "p4") { S.mode = "scales"; S.sc.shown = false; }
      else {
        S.mode = "diagram"; S.sub = p.id === "p1" ? "build" : "free"; S.k = 1; S.dir = "f"; S.card = p.id === "p2" ? "caco3" : "ch4";
        if (p.id === "p1") { S.b.off = 0; S.b.shown = false; }
      }
      syncRG(); api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(n){ note = n || ""; busy = false; lock(false); syncRG(); paint(); MV.wait(150, done); }
      if (p.id === "p1") reveal(function(){ fin("The level drops: " + DH + " = " + kJ(card("ch4").dh) + "."); }, true);
      else if (p.id === "p2") anim("u", 0, 1, 1300, function(){ S.dir = "r"; api.save(); fin("Reversed: " + DH + " = " + kJ(-card("caco3").dh) + "."); }, true);
      else if (p.id === "p3") anim("k", 1, 2, 1100, function(){ S.k = 2; api.save(); fin("Doubled: " + DH + " = " + kJ(2 * card("ch4").dh) + "."); }, true);
      else anim("rv", 0, 1, 1600, function(){ S.sc.shown = true; api.save(); fin("890.5 ÷ 6.01 ≈ 148."); }, true);
    }
  };

  // ----- challenges -----
  function chal(id){
    if (id === "tc3") {
      if (S.mode !== "diagram" || S.sub !== "link") return { ok:false, msg:"Open <strong>Linked panels</strong> in Diagram mode." };
      if (S.L.mdir === "r") return { ok:false, msg:"The methane must <em>supply</em> heat." };
      var k = S.L.k, need = rd(card("caco3").dh * k);
      if (k === 4.5) return { ok:true };
      if (k === 5) return { ok:false, msg:"896.0 kJ is just more than 890.5 kJ." };
      return { ok:false, msg:fx(need, 1) + " kJ: there’s room for more." };
    }
    if (S.mode !== "diagram" || S.sub === "link") return { ok:false, msg:"Use Diagram mode with one reaction (One reaction or Build it)." };
    var c = S.card, kk = S.k, rev = S.dir === "r", dh = dHof(card(c), kk, rev);
    if (id === "tc1") {
      if (c === "fe" && kk === 0.5 && !rev) return { ok:true };
      if (c === "fe" && kk === 0.5 && rev) return { ok:false, msg:"That absorbs 824.2 kJ." };
      if (c === "ch4" && kk === 1 && !rev) return { ok:false, msg:"890.5 kJ: close, but not exact." };
      return { ok:false, msg:dh < 0 ? "That releases " + fx(-dh, 1) + " kJ, not 824.2 kJ." : "That absorbs " + fx(dh, 1) + " kJ; the system must <em>release</em> energy." };
    }
    if (id === "tc2") {
      if (c === "caco3" && kk === 2 && !rev) return { ok:true };
      if (c === "caco3" && kk === 2 && rev) return { ok:false, msg:"That releases 358.4 kJ." };
      if (c === "no" && kk === 2 && !rev) return { ok:false, msg:"+365.2 kJ: close, but not exact." };
      return { ok:false, msg:dh > 0 ? "That absorbs " + fx(dh, 1) + " kJ, not 358.4 kJ." : "That releases " + fx(-dh, 1) + " kJ; absorbing means " + DH + " &gt; 0." };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Write it two ways ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.s1 = S.s1 && typeof S.s1 === "object" ? S.s1 : {};
  s1.items.forEach(function(it){ var x = S.s1[it.id] = S.s1[it.id] && typeof S.s1[it.id] === "object" ? S.s1[it.id] : {}; if (["", "L", "R"].indexOf(x.side) < 0) x.side = ""; if (["", "+", "−"].indexOf(x.sign) < 0) x.sign = ""; x.val = typeof x.val === "string" ? x.val : ""; x.res = x.res && typeof x.res === "object" ? x.res : null; });
  var BASE = rd(2 * hf("H2O(l)")), GAS = rd(2 * hf("H2O(g)"));
  var TR = {
    half:{ t:"× ½", L:"H2(g) + ½O2(g)", R:"H2O(l)", dh:rd(BASE / 2), wrong:[[BASE, "Half the equation, half of " + DH + "."], [-BASE / 2, "Halving doesn’t change the sign."]] },
    rev:{ t:"reverse", L:"2H2O(l)", R:"2H2(g) + O2(g)", dh:-BASE, wrong:[[BASE, DH + " belongs to the equation as written: reverse it and change the sign."], [-BASE / 2, "Reverse only: the size stays " + fx(-BASE, 1) + " kJ."]] },
    o2:{ t:"per mole of O₂", L:"2H2(g) + O2(g)", R:"2H2O(l)", dh:BASE, wrong:[[rd(BASE / 2), "O₂’s coefficient is already 1, so the equation as written is per mole of O₂."], [-BASE, "Nothing was reversed, so the sign stays."]] },
    gas:{ t:"change H₂O(l) to H₂O(g)", L:"2H2(g) + O2(g)", R:"2H2O(g)", dh:GAS, show:true }
  };
  S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {}; if (!TR[S.s2.t]) S.s2.t = "half"; S.s2.v = S.s2.v && typeof S.s2.v === "object" ? S.s2.v : {}; S.s2.ok = S.s2.ok && typeof S.s2.ok === "object" ? S.s2.ok : {};
  var R3 = [{ id:"ch4" }, { id:"c3h8" }, { id:"fe" }, { id:"caco3" }, { id:"no" }, { id:"h2ol", name:"Water (liquid) forms", r:[[2, "H2(g)"], [1, "O2(g)"]], p:[[2, "H2O(l)"]] }, { id:"h2og", name:"Water (gas) forms", r:[[2, "H2(g)"], [1, "O2(g)"]], p:[[2, "H2O(g)"]] }];
  R3.forEach(function(x){ if (!x.r) { var c = card(x.id); x.name = c.name; x.r = c.r; x.p = c.p; } x.dh = rxn(x.r, x.p); });
  if (!R3.some(function(x){ return x.id === S.s3; })) S.s3 = "ch4";
  var sel = null, m2 = null;

  host.innerHTML = '<div class="part eh-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="eh-s1"></div></div>' +
    '<div class="part eh-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><p class="eh-base">' + CF(TR.o2.L + " -> " + TR.o2.R) + ", " + DH + " = " + kJ(BASE) + ' <span class="tiny muted">(from the course table: 2 × ' + fx(hf("H2O(l)"), 1) + ')</span></p><div class="eh-trs"></div><div class="eh-s2"></div></div>' +
    '<div class="part eh-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="eh-s3sel"></div><div class="eh-s3"></div><div class="eh-s3tab"></div></div>';
  var s1h = $(".eh-s1", host), s2h = $(".eh-s2", host), s3h = $(".eh-s3", host);

  // ----- station 1: heat tiles -----
  var SIGNR = {};
  function rowHTML(it){
    var cd = card(it.id), x = S.s1[it.id], q = fx(Math.abs(cd.dh), 1), done = x.res && x.res.ok, dis = done ? " disabled" : "";
    var tile = '<span class="eh-heat-t">heat: ' + q + " kJ</span>";
    function slot(sd){ var on = x.side === sd; return '<button type="button" class="eh-slot' + (on ? " on" : "") + (sel === it.id ? " ready" : "") + '" data-slot="' + sd + '" data-row="' + it.id + '" data-k="sl' + it.id + sd + '" aria-label="' + (sd === "L" ? "Left end, with the reactants" : "Right end, with the products") + (on ? ": heat tile placed (tap to take it back)" : "") + '"' + dis + ">" + (on ? (sd === "L" ? tile + " +" : "+ " + tile) : "＋") + "</button>"; }
    var tiles = function(list){ return list.map(function(s){ return '<span class="eh-tile">' + CF(coef(s[0]) + s[1]) + "</span>"; }).join('<span class="eh-op">+</span>'); };
    var h = '<div class="eh-s1row" data-row="' + it.id + '"><p class="eh-s1p"><strong>' + cd.name + ".</strong> " + q + " kJ of heat is " + (cd.dh < 0 ? "released" : "absorbed") + " for the equation as written.</p>" +
      '<div class="eh-eqt">' + slot("L") + tiles(cd.r) + '<span class="eh-op">→</span>' + tiles(cd.p) + slot("R") + "</div>";
    if (!x.side && !done) h += '<div class="eh-tray"><button type="button" class="eh-heat" data-heat="' + it.id + '" data-k="ht' + it.id + '" aria-pressed="' + (sel === it.id) + '">' + tile + "</button>" + (sel === it.id ? '<span class="tiny muted">Now tap an end of the equation.</span>' : "") + "</div>";
    h += '<div class="eh-dhrow"><span class="eh-dhl">' + DH + ' =</span><span class="eh-sgn" data-sgn="' + it.id + '"></span><input class="numin eh-num" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-s1v="' + it.id + '" aria-label="Size of ΔH for ' + esc(cd.name) + ', in kJ" value="' + esc(x.val) + '"' + dis + '><span>kJ</span></div>';
    if (!done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-s1chk="' + it.id + '" data-k="ck' + it.id + '">Check</button></div>';
    if (x.res) h += x.res.ok ? MV.fbHTML("good", "<strong>✓ Both forms agree.</strong> " + heatHTML(eqSides(cd, 1, false), cd.dh) + " and " + DH + " = " + kJ(cd.dh) + ".") : x.res.soft ? MV.fbHTML("", x.res.msg) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + x.res.msg);
    return h + "</div>";
  }
  function paintS1(){
    MV.keepFocus(s1h, function(){ s1h.innerHTML = s1.items.map(rowHTML).join(""); });
    s1.items.forEach(function(it){
      var x = S.s1[it.id], hostS = s1h.querySelector('[data-sgn="' + it.id + '"]');
      SIGNR[it.id] = radios(hostS, { cls:"chips", aria:"Sign of ΔH", options:[{ id:"+", t:"+" }, { id:"−", t:"−" }], value:x.sign, onChange:function(v){ x.sign = v; x.res = null; api.save(); } });
      if (x.res && x.res.ok) SIGNR[it.id].lock(true);
    });
  }
  function checkRow(id){
    var it = s1.items.filter(function(z){ return z.id === id; })[0], cd = card(id), x = S.s1[id], want = MV.ans(it), v = MV.parseNum(String(x.val).replace(/kJ/gi, "").replace(/\s+/g, "").trim());
    v = v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
    var sign = x.sign; if (v != null && v < 0) { sign = "−"; v = -v; }
    if (!x.side) x.res = { soft:true, msg:"Place the heat tile at one end of the equation first." };
    else if (!sign || v == null) x.res = { soft:true, msg:"Fill in the " + DH + " box: choose a sign and type the value." };
    else if (x.side !== want) x.res = { msg:(cd.dh < 0 ? "Heat is released, so it’s a product: right side. " : "Heat is absorbed, so it’s a reactant: left side. ") + "Exothermic: heat is a <em>product</em> (right side). Endothermic: heat is a <em>reactant</em> (left side)." };
    else if ((sign === "−") !== (cd.dh < 0)) x.res = { msg:cd.dh < 0 ? "Energy <em>leaving</em> the system makes " + DH + " negative." : "Energy <em>entering</em> the system makes " + DH + " positive." };
    else if (Math.abs(v - Math.abs(cd.dh)) > 0.05) x.res = { msg:"The size of " + DH + " is the heat in the tile: " + fx(Math.abs(cd.dh), 1) + " kJ." };
    else x.res = { ok:true };
    api.save(); paintS1(); MV.focusFb(s1h.querySelector('[data-row="' + id + '"].eh-s1row'));
  }
  s1h.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.heat) { sel = sel === b.dataset.heat ? null : b.dataset.heat; paintS1(); return; }
    if (b.dataset.slot) {
      var id = b.dataset.row, x = S.s1[id];
      if (x.side === b.dataset.slot) { x.side = ""; x.res = null; sel = null; }
      else if (sel === id || x.side) { x.side = b.dataset.slot; x.res = null; sel = null; }
      else { x.res = { soft:true, msg:"Tap the heat tile first, then tap an end of the equation." }; }
      api.save(); paintS1(); return;
    }
    if (b.dataset.s1chk) checkRow(b.dataset.s1chk);
  });
  s1h.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.s1v; if (!id) return; S.s1[id].val = e.target.value; S.s1[id].res = null; api.save(); });
  s1h.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.s1v) checkRow(e.target.dataset.s1v); });
  paintS1();

  // ----- station 2: transform -----
  var TOPTS = Object.keys(TR).map(function(k){ return { id:k, t:"" }; });
  function optT(){ TOPTS.forEach(function(o){ o.t = TR[o.id].t + (S.s2.ok[o.id] ? " ✓" : ""); }); }
  optT();
  var rgT = radios($(".eh-trs", host), { label:"Transformation", cls:"chips", aria:"Transformation", options:TOPTS, value:S.s2.t,
    onChange:function(v){ S.s2.t = v; m2 = null; if (TR[v].show) S.s2.ok[v] = true; api.save(); optT(); rgT.paint(); paintS2(); } });
  function paintS2(){
    var k = S.s2.t, T = TR[k], h = '<p class="eh-neweq"><strong>New equation:</strong> ' + CF(T.L + " -> " + T.R) + "</p>";
    if (T.show) {
      h += '<p class="eh-calc">' + DH + " = 2 × (" + fx(hf("H2O(g)"), 1) + ") = <strong>" + kJ(T.dh) + "</strong>, compared with " + kJ(BASE) + " for liquid water.</p><p><strong>" + s2.gasNote + "</strong></p>";
    } else if (S.s2.ok[k]) h += MV.fbHTML("good", "<strong>✓ " + DH + " = " + kJ(T.dh) + ".</strong> " + (k === "half" ? "Half the equation, half of " + DH + "." : k === "rev" ? "Reversing changes the sign." : "O₂’s coefficient is already 1, so " + DH + " is unchanged."));
    else {
      h += '<div class="numrow"><label for="eh-s2in">New ' + DH + ' =</label><input class="numin" id="eh-s2in" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(S.s2.v[k] || "") + '"><span>kJ</span></div><div class="q-actions"><button type="button" class="btn primary sm" data-s2="chk" data-k="s2chk">Check</button></div>';
      if (m2) h += m2.soft ? MV.fbHTML("", m2.t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + m2.t);
    }
    var done = Object.keys(TR).filter(function(t){ return S.s2.ok[t]; }).length;
    h += '<p class="tiny muted">Transformations done: ' + done + " of 4.</p>";
    MV.keepFocus(s2h, function(){ s2h.innerHTML = h; });
  }
  function check2(){
    var k = S.s2.t, T = TR[k], raw = MV.parseNum(String(S.s2.v[k] || "").replace(/kJ/gi, "").replace(/\s+/g, "")), v = raw && raw.length === 1 && isFinite(raw[0]) ? raw[0] : null;
    if (v == null) m2 = { soft:true, t:"Type one number with its sign, such as −100.0." };
    else if (Math.abs(v - T.dh) <= 0.05) { S.s2.ok[k] = true; m2 = null; }
    else { var w = (T.wrong || []).filter(function(z){ return Math.abs(v - z[0]) <= 0.05; })[0]; m2 = { t:w ? w[1] : "Apply the same change to " + DH + " as to the equation." }; }
    optT(); rgT.paint(); api.save(); paintS2(); MV.focusFb(s2h);
  }
  s2h.addEventListener("input", function(e){ if (e.target.id === "eh-s2in") { S.s2.v[S.s2.t] = e.target.value; api.save(); } });
  s2h.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.id === "eh-s2in") check2(); });
  s2h.addEventListener("click", function(e){ var b = e.target.closest("[data-s2]"); if (b && !b.disabled) check2(); });
  if (TR[S.s2.t].show) S.s2.ok[S.s2.t] = true;
  paintS2();

  // ----- station 3: check it with data -----
  radios($(".eh-s3sel", host), { label:"Reaction", cls:"chips", aria:"Reaction to check", options:R3.map(function(x){ return { id:x.id, t:x.name }; }), value:S.s3, onChange:function(v){ S.s3 = v; api.save(); paintS3(); } });
  function term(x){ var v = inTable(x[1]) ? hf(x[1]) : 0; return x[0] + "(" + fx(v, 1) + ")"; }
  function paintS3(){
    var x = R3.filter(function(z){ return z.id === S.s3; })[0], els = x.r.concat(x.p).filter(function(z){ return !inTable(z[1]); }).map(function(z){ return CF(z[1]); });
    var h = "<p>" + CF(side(x.r, 1) + " -> " + side(x.p, 1)) + "</p>" +
      '<p class="eh-calc">' + DH + " = [" + x.p.map(term).join(" + ") + "] − [" + x.r.map(term).join(" + ") + "] = <strong>" + kJ(x.dh) + "</strong></p>" +
      (els.length ? '<p class="tiny muted">Elements in their standard states (' + els.join(", ") + ") count as 0.</p>" : "") +
      '<p class="tiny">' + (x.id === "h2og" ? "That is the “change H₂O(l) to H₂O(g)” value from Station 2." : x.id === "h2ol" ? "That is Station 2’s starting value." : "It matches the " + x.name + " card in the builder.") + "</p>" +
      '<p class="tiny muted">The cold pack’s +' + fx(COLD, 1) + " kJ is a measured dissolving value: it’s in the course table’s list of other values, not worked out from formation enthalpies.</p>";
    s3h.innerHTML = h;
  }
  paintS3();
  MV.chem.tablePanel($(".eh-s3tab", host), "dhf", { title:"Course data table: enthalpies of formation, ΔH°f" });
  MV.chem.tablePanel($(".eh-s3tab", host), "misc", { title:"Course data table: other values" });
}

// ---------- Practice 2: Energy calculations (number entry with units and a sign check, choices; adapted from SCH4U 14) ----------
var CALC = null;
function calcAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {}, ALL = [a.inv].concat(a.items);
  CALC = { S:S, a:a, ist:ist };
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); if (typeof x.val !== "string") x.val = ""; if (x.pick === undefined) x.pick = null; x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function chipsHTML(it, x, dis){ return '<div class="chips eh-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>"; }
  function numHTML(it, x, dis){ return '<div class="numrow"><label for="ci-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="ci-' + it.id + '" data-cin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span class="eh-unit">' + (it.unit || "") + "</span></div>"; }
  function itemHTML(it, n){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + n + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += it.kind === "num" ? numHTML(it, x, dis) : chipsHTML(it, x, dis);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) {
      var why = it.kind === "chips" ? (it.options[x.pick] && it.options[x.pick].why) || "" : it.why || "";
      h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + '</p><h4 class="eh-h4">Investigation</h4>' + itemHTML(a.inv, "?") + '<h4 class="eh-h4">Calculations</h4>' + MV.usesHTML(a.use) + a.items.map(function(it, i){ return itemHTML(it, i + 1); }).join(""); }); }
  function item(id){ return ALL.filter(function(x){ return x.id === id; })[0]; }
  function one(s){ var t = String(s || "").replace(/k?J|mol|kj/gi, "").replace(/(\d),(\d{3})/g, "$1$2").replace(/\s+/g, "").trim(); var v = MV.parseNum(t); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, w, tol){ return Math.abs(v - w) <= (tol || 0) + 1e-9; }
  function judge(it, x){
    if (it.kind === "num") {
      var v = one(x.val), ans = MV.ans(it);
      if (v == null) return { bad:"Enter one number, such as " + (it.signed ? "−100.0" : "100") + "." };
      if (near(v, ans, it.tol)) return { ok:true };
      if (!it.signed && v < 0 && near(-v, ans, it.tol)) return { bad:"An amount of energy released is a positive number (" + DH + " itself would be negative)." };
      var w = (it.wrong || []).filter(function(z){ return near(v, z.match, Math.max(0.05, Math.abs(z.match) * 0.002)); })[0];
      if (!w && it.signed && near(-v, ans, it.tol)) return { fb:"Check the sign of " + DH + "." };
      return { fb:w ? w.fb : it.fb };
    }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
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
    missed:function(){ var g = []; ALL.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Self-heating meal pack ----------
var task = (function(){
  var M = D.M;
  var TC = [
    { id:"fe", name:"Iron oxidation", eq:"4Fe + 3O2 -> 2Fe2O3", main:"Fe", dh:rd(card("fe").dh / 4), mm:M.Fe },
    { id:"cao", name:"Quicklime + water", eq:"CaO(s) + H2O(l) -> Ca(OH)2(s)", main:"CaO", dh:rxn([[1, "CaO(s)"], [1, "H2O(l)"]], [[1, "Ca(OH)2(s)"]]), mm:Math.round((M.Ca + M.O) * 100) / 100 },
    { id:"ch4", name:"Methane combustion", eq:"CH4 + 2O2 -> CO2 + 2H2O", main:"CH4", dh:card("ch4").dh, mm:Math.round((M.C + 4 * M.H) * 100) / 100, comb:true },
    { id:"etoh", name:"Ethanol combustion", eq:"C2H5OH + 3O2 -> 2CO2 + 3H2O", main:"C2H5OH", dh:rxn([[1, "C2H5OH(l)"], [3, "O2(g)"]], [[2, "CO2(g)"], [3, "H2O(l)"]]), mm:Math.round((2 * M.C + 6 * M.H + M.O) * 100) / 100, comb:true },
    { id:"cold", name:"Cold-pack dissolving", eq:"NH4NO3(s) -> NH4+(aq) + NO3-(aq)", main:"NH4NO3", dh:COLD, mm:Math.round((2 * M.N + 4 * M.H + 3 * M.O) * 100) / 100 }
  ];
  function tc(id){ return TC.filter(function(c){ return c.id === id; })[0]; }
  var S = null, api = null;
  function read(){ var c = S && tc(S.card) ? S.card : "", n = S ? clamp(Math.round((+S.n || 1) * 2) / 2, 0.5, 8) : 1; return { card:c, n:n }; }
  function calc(d){ var c = tc(d.card); if (!c) return null; return { c:c, E:rd(-c.dh * d.n), m:Math.round(c.mm * d.n * 10) / 10 }; }
  function gauge(y, lab, val, max, lo, hi, unit, txt){
    var x0 = 150, x1 = 520, X = function(v){ return x0 + clamp(v, 0, max) / max * (x1 - x0); }, h = tx(10, y, lab, { a:"start", fs:12.5, w:700 });
    h += rect(x0, y - 9, x1 - x0, 18, "var(--paper)", { rx:4, s:"var(--rule)", sw:1.2 });
    if (lo != null) h += rect(X(lo), y - 9, X(hi) - X(lo), 18, "var(--hi-soft)") + ln(X(lo), y - 12, X(lo), y + 12, { c:"var(--ink-2)", w:1.4, d:"3 2" }) + ln(X(hi), y - 12, X(hi), y + 12, { c:"var(--ink-2)", w:1.4, d:"3 2" });
    if (val != null) h += rect(x0, y - 6, Math.max(0, X(val) - x0), 12, "var(--ink)", { rx:3 });
    for (var v = 0; v <= max; v += max / 4) h += tx(X(v), y + 20, String(v), { fs:10.5, c:"var(--ink-2)" });
    h += tx(x1, y - 20, txt, { a:"end", fs:12, w:700 });
    return h;
  }
  function paint(){
    var d = read(), r = calc(d), pv = $("#eh-tsvg"); if (!pv) return;
    $("#eh-tnout").textContent = fx(d.n, 1) + " mol";
    var h = gauge(40, "Energy released", r ? Math.max(0, r.E) : null, 800, 400, 500, "kJ", r ? (r.E >= 0 ? fx(r.E, 1) + " kJ released" : fx(-r.E, 1) + " kJ absorbed") : "choose a card") +
      gauge(112, "Main reactant mass", r ? r.m : null, 800, 0, 400, "g", r ? fx(r.m, 1) + " g" : "");
    pv.innerHTML = h;
    pv.setAttribute("aria-label", r ? "Energy released: " + (r.E >= 0 ? fx(r.E, 1) + " kJ" : "none; it absorbs " + fx(-r.E, 1) + " kJ") + " (target band 400 to 500 kJ). Mass of " + r.c.main + ": " + fx(r.m, 1) + " g (limit 400 g)." : "No reaction card chosen yet.");
    $("#eh-tread").innerHTML = MV.readoutHTML(r ? [["Reaction", CF(r.c.eq)], [DH + " per mole of " + CF(r.c.main), kJ(r.c.dh) + "/mol"], ["Flame needed?", r.c.comb ? "yes: it’s a combustion" : "no"],
      ["Energy", fx(d.n, 1) + " mol × " + fx(Math.abs(r.c.dh), 1) + " kJ/mol = " + fx(Math.abs(r.E), 1) + " kJ " + (r.E >= 0 ? "released" : "absorbed")], ["Mass", fx(d.n, 1) + " mol × " + fx(r.c.mm, 2) + " g/mol = " + fx(r.m, 1) + " g"]] : [["Reaction", muted("choose a card")]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; if (!tc(S.card)) S.card = ""; S.n = read().n;
      inp.innerHTML = '<div class="eh-tcard"></div><label class="slider eh-sl"><span class="slider-top"><span>Amount of main reactant</span><output id="eh-tnout"></output></span><input type="range" id="eh-tn" min="0.5" max="8" step="0.5" aria-label="Amount of main reactant in moles"></label>' +
        MV.usesHTML("M(Fe) = " + fx(tc("fe").mm, 2) + ", M(CaO) = " + fx(tc("cao").mm, 2) + ", M(CH₄) = " + fx(tc("ch4").mm, 2) + ", M(C₂H₅OH) = " + fx(tc("etoh").mm, 2) + ", M(NH₄NO₃) = " + fx(tc("cold").mm, 2) + " g/mol.");
      pv.innerHTML = '<h4 class="eh-h4">Your heater</h4><div class="eh-box"><svg class="eh-svg" id="eh-tsvg" viewBox="0 0 560 150" role="img" aria-label=""></svg></div><dl class="read" id="eh-tread" aria-live="polite"></dl>';
      radios($(".eh-tcard", inp), { label:"Reaction card", cls:"chips", aria:"Reaction card", options:TC.map(function(c){ return { id:c.id, t:c.name }; }), value:S.card, onChange:function(v){ S.card = v; api.save(); paint(); api.update(); } });
      var rng = $("#eh-tn", inp); rng.value = String(S.n);
      rng.addEventListener("input", function(){ S.n = clamp(+rng.value, 0.5, 8); api.save(); paint(); api.update(); });
      paint();
    },
    read:read,
    valid:function(d){ return d.card ? true : "Choose a reaction card."; },
    checks:function(d){ var r = calc(d); if (!r) return [false, false, false, false]; return [r.c.dh < 0, !r.c.comb, r.E >= 400 && r.E <= 500, r.m <= 400]; },
    key:function(d){ return d.card + "|" + fx(d.n, 1); },
    label:function(k){ var p = k.split("|"), c = tc(p[0]); return (c ? c.name : p[0]) + ", " + p[1] + " mol"; },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ calc:calcAct },
  task:task,
  summaryLines:function(){
    if (!CALC) return [];
    var x = CALC.ist(CALC.a.inv.id);
    return ["System and surroundings investigation (first try): " + (x.first ? 1 : 0) + "/1" + (x.solved ? "" : " (unfinished)")];
  }
});
})();
