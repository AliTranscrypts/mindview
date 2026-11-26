// SCH4U 50 Faraday's First Law: hero (CuSO₄ cell, copper strip anode +, key cathode −; electrons, ions, a growing coat
// and a charge → moles → mass counter), Electrolysis cell (Explore: C10 electrolytic cell with current and time sliders,
// cathode/anode bars and a mass–charge graph; Plate it / Graph lab / What forms? modes), Electroplating (Part 3: wire
// it right, how long?, efficiency with a "Check it with data" table, the plating shop and the environment) and Plating
// plan (task: solution × current × time with a live mass gauge). Practice uses the toolkit sorter, numeric and spot types.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function LIN(t){ return t; }
var f = MV.chem.f, fx = MV.chem.fx, MIN = "−", NB = " ";

// ---------- chemistry model (values from MV.chem.data) ----------
var D = MV.chem.data, FC = D["const"].F, MR = D.Mr;
function e0(hr){ var r = D.E0.filter(function(x){ return x[0] === hr; })[0]; return r ? r[1] : null; }
var EW = e0("2H2O + 2e- -> H2 + 2OH-");
var WATER_RED = "2H2O(l) + 2e- -> H2(g) + 2OH-(aq)";
var SOL = {
  cu:{ metal:"Cu", name:"copper", z:2, M:MR.Cu, E:e0("Cu^2+ + 2e- -> Cu"), salt:"CuSO4(aq)", cat:"Cu^2+", an:"SO4^2-", anode:"Cu", red:"Cu^2+(aq) + 2e- -> Cu(s)", ox:"Cu(s) -> Cu^2+(aq) + 2e-" },
  ag:{ metal:"Ag", name:"silver", z:1, M:MR.Ag, E:e0("Ag+ + e- -> Ag"), salt:"AgNO3(aq)", cat:"Ag+", an:"NO3-", anode:"Ag", red:"Ag+(aq) + e- -> Ag(s)", ox:"Ag(s) -> Ag+(aq) + e-" },
  zn:{ metal:"Zn", name:"zinc", z:2, M:MR.Zn, E:e0("Zn^2+ + 2e- -> Zn"), salt:"ZnSO4(aq)", cat:"Zn^2+", an:"SO4^2-", anode:"Zn", red:"Zn^2+(aq) + 2e- -> Zn(s)", ox:"Zn(s) -> Zn^2+(aq) + 2e-" },
  al:{ metal:"Al", name:"aluminium", z:3, M:MR.Al, E:e0("Al^3+ + 3e- -> Al"), salt:"Al2(SO4)3(aq)", cat:"Al^3+", an:"SO4^2-", anode:"C", gas:"O2" },
  na:{ metal:"Na", name:"sodium", z:1, M:D.M.Na, E:e0("Na+ + e- -> Na"), salt:"NaCl(aq)", cat:"Na+", an:"Cl-", anode:"C", gas:"Cl2" }
};
Object.keys(SOL).forEach(function(k){ SOL[k].id = k; SOL[k].plates = SOL[k].E > EW; });
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function calc(sid, I, t){
  var s = SOL[sid], Q = I * t, ne = Q / FC;
  return s.plates ? { s:s, Q:Q, ne:ne, np:ne / s.z, m:ne / s.z * s.M } : { s:s, Q:Q, ne:ne, np:ne / 2, m:0 };
}
function grp(str){ var p = str.split("."); if (p[0].length > 4) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, NB); return p.join("."); }
function sig(v, k){
  k = k || 3; if (!isFinite(v)) return "—"; if (Math.abs(v) < 1e-12) return "0";
  var a = Math.abs(v), e = Math.floor(Math.log10(a) + 1e-12), d = k - 1 - e, s;
  if (d > 0) { var p = Math.pow(10, d); s = (Math.round(a * p + 1e-7) / p).toFixed(d); }
  else { var q = Math.pow(10, -d); s = String(Math.round(Math.round(a / q + 1e-7) * q)); }
  return (v < 0 ? MIN : "") + grp(s);
}
function volts(v){ return (v > 0 ? "+" : "") + fx(v, 2) + " V"; }
function amps(I){ return fx(I, 2) + " A"; }
function secs(t){ return grp(String(t)) + " s"; }
function clock(t){ var h = Math.floor(t / 3600), mi = Math.floor((t % 3600) / 60), s = t % 60; return (h ? h + " h " : "") + (h || mi ? mi + " min " : "") + s + " s"; }
var USE_HTML = " <i>F</i> = " + grp(String(FC)) + " C/mol; Cu " + fx(MR.Cu, 1) + ", Ag " + fx(MR.Ag, 0) + ", Zn " + fx(MR.Zn, 1) + " g/mol.";

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 12) + '"' + (o.w ? ' font-weight="' + o.w + '"' : "") +
    ' fill="' + (o.c || "var(--ink)") + '"' + (o.rot ? ' transform="rotate(' + o.rot + " " + r1(x) + " " + r1(y) + ')"' : "") + opA(o.op) + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function tri(x, y, dir, c){ // small arrowhead pointing "u", "d", "r"
  var p = dir === "u" ? [[x, y - 5], [x - 4.5, y + 3], [x + 4.5, y + 3]] : dir === "d" ? [[x, y + 5], [x - 4.5, y - 3], [x + 4.5, y - 3]] : [[x + 5, y], [x - 3, y - 4.5], [x - 3, y + 4.5]];
  return '<polygon points="' + p.map(function(q){ return r1(q[0]) + "," + r1(q[1]); }).join(" ") + '" fill="' + c + '"/>';
}
function niceUp(v, list){ for (var i = 0; i < list.length; i++) if (v <= list[i] + 1e-9) return list[i]; return list[list.length - 1]; }

// ---------- @component C10 electrolysisCell (electrolytic mode) — beaker, supply, wires, electrodes with signs, electrons
// (--ec-e) along the wires, cations (--ec-cat) drifting to the cathode, anions (--ec-an) to the anode, a coat on the
// cathode (ink-2, labelled with the metal) and a thinning metal anode; gas bubbles for water reduction / carbon anodes.
// cellSVG({sol, fr (0–1 share of the bar scale), on (has run), ph (animation phase or null), key (hero: cathode is a key)}) -> svg html
var CAT_Y = [168, 204, 240, 186, 222], AN_Y = [180, 216, 252, 160];
function wirePos(s){ // s in [0, 240): anode top → + terminal, then − terminal → cathode top
  if (s < 64) return [120, 96 - s]; if (s < 120) return [120 + (s - 64), 32];
  s -= 120; if (s < 56) return [264 + s, 32]; return [320, 32 + (s - 56)];
}
function cellSVG(o){
  var s = SOL[o.sol], fr = clamp(o.fr || 0, 0, 1), ph = o.ph == null ? 0 : o.ph, moving = o.ph != null, h = "";
  var solFill = o.sol === "cu" ? "var(--fl-sol)" : "var(--fl-sol0)";
  // solution and beaker
  h += rect(60, 134, 320, 160, solFill, { rx:10 }) + ln(62, 134, 378, 134, { c:"var(--ink-2)", w:1, op:0.6 });
  h += '<path d="M58 104 V284 Q58 296 70 296 H370 Q382 296 382 284 V104" fill="none" stroke="var(--ink-2)" stroke-width="2.5"/>';
  h += tx(220, 280, f(s.salt), { fs:13, w:700 });
  // ions (drawn before the electrodes)
  CAT_Y.forEach(function(y, i){ var x = 152 + (((i / 5 + ph * 0.45) % 1 + 1) % 1) * 146; h += circ(x, y, 8, "var(--ec-cat)") + tx(x, y + 0.5, "+", { fs:12, w:700, c:"var(--sheet)" }); });
  AN_Y.forEach(function(y, i){ var x = 298 - (((i / 4 + 0.12 + ph * 0.45) % 1 + 1) % 1) * 146; h += circ(x, y, 8, "var(--ec-an)") + tx(x, y + 0.5, MIN, { fs:12, w:700, c:"var(--sheet)" }); });
  // supply and wires
  h += '<path d="M176 32 H120 V96" fill="none" stroke="var(--ink-2)" stroke-width="2.5"/><path d="M264 32 H320 V96" fill="none" stroke="var(--ink-2)" stroke-width="2.5"/>';
  for (var k = 0; k < 8; k++) { var p = wirePos(((k * 30 + ph * 70) % 240 + 240) % 240); h += circ(p[0], p[1], 4, "var(--ec-e)"); }
  h += tri(120, 70, "u", "var(--ec-e)") + tri(150, 32, "r", "var(--ec-e)") + tri(292, 32, "r", "var(--ec-e)") + tri(320, 70, "d", "var(--ec-e)");
  h += tx(104, 62, "e⁻", { fs:12, w:700, c:"var(--ec-e)", a:"end" }) + tx(336, 62, "e⁻", { fs:12, w:700, c:"var(--ec-e)", a:"start" });
  h += rect(176, 12, 88, 40, "var(--sheet)", { rx:6, s:"var(--ink)", sw:1.8 }) + tx(220, 32, "supply", { fs:11, c:"var(--ink-2)" }) + tx(188, 32, "+", { fs:16, w:700 }) + tx(252, 32, MIN, { fs:16, w:700 });
  // anode
  var metalA = s.anode !== "C", aw = metalA ? 24 - 14 * fr : 14;
  h += metalA ? rect(120 - aw / 2, 96, aw, 172, "var(--fl-metal)", { s:"var(--ink)", sw:1.5 }) : rect(113, 96, 14, 172, "var(--ink-2)", { s:"var(--ink)", sw:1.5 });
  h += tx(120, 112, s.anode, { fs:10.5, w:700, c:metalA ? "var(--ink)" : "var(--sheet)" });
  h += tx(110, 86, 'anode <tspan font-weight="700">+</tspan>', { fs:12.5, a:"end" });
  // cathode: coat (behind) then the object
  var c = 7 * fr;
  if (s.plates && c > 0.05) { h += rect(314 - c, 136, 12 + 2 * c, 132 + c, "var(--ink-2)", { rx:2 }); h += tx(334 + c, 206, s.metal, { fs:11.5, w:700, c:"var(--ink-2)", a:"start" }); }
  if (o.key) h += circ(320, 104, 10, "var(--sheet)", { s:"var(--ink)", sw:2 }) + circ(320, 104, 3.5, "var(--fl-sol0)", { s:"var(--ink)", sw:1.2 });
  h += rect(314, o.key ? 113 : 96, 12, o.key ? 155 : 172, "var(--sheet)", { s:"var(--ink)", sw:1.5 });
  h += tx(330, 86, '<tspan font-weight="700">' + MIN + "</tspan> cathode" + (o.key ? " (key)" : ""), { fs:12.5, a:"start" });
  // gas bubbles
  function bubbles(x0, side, lab){
    var b = "";
    for (var i = 0; i < 6; i++) { var t = ((i / 6 + ph * 0.6) % 1 + 1) % 1, y = 262 - t * 120, x = x0 + side * (4 + (i % 3) * 4); b += circ(x, y, 3 + (i % 2), "none", { s:"var(--ink-2)", sw:1.3 }); }
    return b + tx(x0 + side * 24, 150, f(lab), { fs:12, w:700, a:side > 0 ? "start" : "end" });
  }
  if (o.on && !s.plates) h += bubbles(326, 1, "H2");
  if (o.on && !metalA) h += bubbles(114, -1, s.gas);
  void moving;
  return h;
}
function legendHTML(sid){
  var s = SOL[sid];
  return '<ul class="fl-key" aria-hidden="true"><li><span class="fl-dot fl-de"></span>electron (e⁻)</li><li><span class="fl-dot fl-dc"></span>cation (' + f(s.cat) + ')</li><li><span class="fl-dot fl-da"></span>anion (' + f(s.an) + ")</li></ul>";
}
function cellAria(o, r){
  var s = SOL[o.sol];
  return "Electrolytic cell with " + MV.plain(f(s.salt)) + ". Anode, positive: " + (s.anode === "C" ? "carbon" : s.name) + ". Cathode, negative. Electrons flow from the anode through the supply to the cathode; cations drift to the cathode and anions to the anode. " +
    (s.plates ? (r.m > 0 ? "A " + sig(r.m) + " g coat of " + s.name + " covers the cathode" + (s.anode !== "C" ? " and the anode has lost the same mass." : ".") : "No metal deposited yet.") : (o.on ? "Hydrogen bubbles form at the cathode; no " + s.name + " plates out." : "No current has passed yet."));
}

// ---------- @component radioGroup (from MHF4U 25, via SCH4U 01–14) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function paint(){
    var fo = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked, tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (fo) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
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

// ---------- hero ----------
function hero(){
  var svg = $("#fl-hx-svg"), ctr = $("#fl-hx-ctr"), rep = $("#fl-hx-replay"), run = 0;
  if (!svg) return;
  var I = 2, T = 965;
  function frame(e, ph){
    var r = calc("cu", I, e);
    svg.innerHTML = cellSVG({ sol:"cu", fr:r.m / 1, on:e > 0, ph:ph, key:true });
    ctr.innerHTML = "Charge: " + sig(r.Q) + " C → " + sig(r.ne) + " mol e⁻ → " + sig(r.np) + " mol Cu → " + sig(r.m) + " g.";
  }
  function play(){
    var my = ++run, t0 = performance.now(); rep.hidden = true;
    frame(0, 0);
    MV.wait(500, function(){
      if (my !== run) return;
      MV.tween({ dur:6500, ease:LIN, step:function(k){ if (my === run) frame(T * k, (performance.now() - t0) / 1800); }, done:function(){ if (my !== run) return; frame(T, null); rep.hidden = false; } });
    });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) { frame(T, null); rep.hidden = false; } else play();
}

// ---------- @component massGraph — SVG mass vs charge (Plate it) or mass vs time (Graph lab); straight lines through the origin ----------
var GX0 = 60, GX1 = 420, GY0 = 196, GY1 = 18;
function axesSVG(xmax, ymax, xlab, ylab, xt){
  var h = "", i;
  for (i = 0; i <= 5; i++) { var y = GY0 - (GY0 - GY1) * i / 5; h += ln(GX0, y, GX1, y, { c:"var(--plot-grid)", w:1 }) + tx(GX0 - 6, y, sig(ymax * i / 5, 2).replace(/^0$/, "0"), { fs:10.5, a:"end", c:"var(--ink-2)" }); }
  for (i = 0; i <= xt; i++) { var x = GX0 + (GX1 - GX0) * i / xt; h += ln(x, GY0, x, GY1, { c:"var(--plot-grid)", w:1 }) + tx(x, GY0 + 12, grp(String(Math.round(xmax * i / xt))), { fs:10.5, c:"var(--ink-2)" }); }
  h += ln(GX0, GY0, GX1, GY0, { c:"var(--plot-axis)", w:1.6 }) + ln(GX0, GY0, GX0, GY1, { c:"var(--plot-axis)", w:1.6 });
  h += tx((GX0 + GX1) / 2, GY0 + 30, xlab, { fs:12 }) + tx(16, (GY0 + GY1) / 2, ylab, { fs:12, rot:-90 });
  return h;
}
function lineSVG(slope, xmax, ymax, o){
  var xe = slope * xmax > ymax ? ymax / slope : xmax, ye = slope * xe;
  var X = GX0 + (GX1 - GX0) * xe / xmax, Y = GY0 - (GY0 - GY1) * ye / ymax;
  return ln(GX0, GY0, X, Y, { c:o.c, w:o.w || 2.5, op:o.op, d:o.d }) + (o.lab ? tx(Math.min(X + 4, GX1 - 2), Math.max(Y - 9, GY1 + 4), o.lab, { fs:11, w:700, c:o.c, a:X + 4 > GX1 - 30 ? "end" : "start", op:o.op }) : "");
}
function ptSVG(x, y, xmax, ymax, c, lab, hollow){
  var X = GX0 + (GX1 - GX0) * clamp(x / xmax, 0, 1), Y = GY0 - (GY0 - GY1) * clamp(y / ymax, 0, 1);
  return circ(X, Y, 5.5, hollow ? "var(--sheet)" : c, { s:c, sw:2 }) + (lab ? tx(X - 9, Y - 10, lab, { fs:11.5, w:700, c:c, a:"end" }) : "");
}
function slopeOf(sid){ var s = SOL[sid]; return s.plates ? s.M / (s.z * FC) : 0; }

// ---------- Explore: Electrolysis cell ----------
var RUNC = ["var(--pen)", "var(--p-k)", "var(--p-d)"];
function explore(host, api){
  var S = api.S, C = api.content;
  if (["plate", "graph", "forms"].indexOf(S.mode) < 0) S.mode = "plate";
  if (!SOL[S.sol]) S.sol = "cu";
  S.I = clamp(Math.round((+S.I || 2) * 2) / 2, 0.5, 5);
  S.t = clamp(Math.round((S.t == null ? 965 : +S.t || 0) / 965) * 965, 0, 19300);
  S.hist = Array.isArray(S.hist) ? S.hist.filter(function(k){ return !!SOL[k]; }).slice(-5) : [];
  S.runs = Array.isArray(S.runs) ? S.runs.filter(function(x){ return isFinite(+x) && x >= 0.5 && x <= 5; }).map(Number).slice(-3) : [];
  if (!SOL[S.runSol]) S.runSol = S.sol;
  if (["metal", "h2", "o2"].indexOf(S.fPred) < 0) S.fPred = "";
  S.fShown = !!S.fShown;
  var busy = false, locked = false, seq = 0, cancelTw = null, anim = { e:null, ph:null }, pinS = null, pinX = null, marks = [], note = "", volt = false;

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="fl-modes"></div><div class="fl-sols"></div><div class="fl-grid">' +
    '<div class="fl-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="fl-box"><svg class="fl-svg" id="fl-cell" viewBox="0 0 440 318" role="img" aria-label=""></svg></div>' +
    '<div class="fl-legend"></div><div class="fl-bars"></div><p class="fl-cap" aria-live="polite"></p></div>' +
    '<div class="fl-side"><div class="fl-sl"></div><div class="fl-pred"></div><div class="fl-btns"></div><dl class="read fl-read" aria-live="polite"></dl></div></div>' +
    '<div class="fl-gbox"><h4 class="fl-h4"></h4><div class="fl-box"><svg class="fl-svg" id="fl-graph" viewBox="0 0 440 240" role="img" aria-label=""></svg></div><p class="tiny muted fl-gnote"></p></div>' +
    MV.usesHTML(USE_HTML) + '<div class="fl-tabs"></div>';
  var cellEl = $("#fl-cell"), graphEl = $("#fl-graph"), btns = $(".fl-btns", host), slHost = $(".fl-sl", host), predHost = $(".fl-pred", host);
  MV.chem.tablePanel($(".fl-tabs", host), "e0", { title:"Course data table: standard reduction potentials" });
  MV.chem.tablePanel($(".fl-tabs", host), "const", { title:"Course data table: constants" });

  // ----- controls -----
  var RG = {};
  RG.mode = radios($(".fl-modes", host), { label:"Mode", aria:"Cell mode", options:C.modes, value:S.mode, onChange:function(v){ cancel(); S.mode = v; note = ""; clearPins(); if (v === "graph" && S.runSol !== S.sol) { S.runs = []; S.runSol = S.sol; } api.save(); paint(); } });
  RG.sol = radios($(".fl-sols", host), { label:"Solution", cls:"chips", aria:"Solution and anode", options:C.sols.map(function(x){ return { id:x.id, t:x.t }; }), value:S.sol,
    onChange:function(v){ cancel(); S.sol = v; S.fShown = false; S.fPred = ""; note = ""; clearPins(); if (S.runSol !== v) { S.runs = []; S.runSol = v; } api.save(); buildPred(); paint(); } });
  var SL = MV.sliders(slHost, [
    { id:"I", label:"Current <i>I</i>", min:0.5, max:5, step:0.5, value:S.I, fmt:function(v){ return amps(v); } },
    { id:"t", label:"Time <i>t</i>", min:0, max:19300, step:965, value:S.t, fmt:function(v){ return secs(v) + " (" + clock(v) + ")"; }, note:"Arrow keys step 965 s; Shift + arrow steps 5 × 965 s." }
  ], onSl);
  function onSl(id, v){
    if (busy || locked) { SL.set(id, S[id]); return; }
    S[id] = id === "I" ? clamp(Math.round(v * 2) / 2, 0.5, 5) : clamp(Math.round(v / 965) * 965, 0, 19300);
    clearPins(); note = ""; api.save(); paint();
  }
  slHost.addEventListener("keydown", function(e){
    if (!e.shiftKey || !e.target.dataset || e.target.dataset.sl !== "t") return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return;
    e.preventDefault(); var v = clamp(S.t + d * 5 * 965, 0, 19300); SL.set("t", v); onSl("t", v);
  });
  function buildPred(){
    var s = SOL[S.sol];
    predHost.innerHTML = '<div class="fl-predrg"></div>';
    RG.pred = radios(predHost.firstChild, { label:"I predict the cathode makes:", cls:"chips", aria:"Predicted cathode product", value:S.fPred,
      options:[{ id:"metal", t:s.name + " metal" }, { id:"h2", t:"hydrogen gas" }, { id:"o2", t:"oxygen gas" }],
      onChange:function(v){ S.fPred = v; S.fShown = false; note = ""; api.save(); paint(); } });
    if (locked) RG.pred.lock(true);
  }
  buildPred();
  function clearPins(){ pinS = null; pinX = null; marks = []; volt = false; }
  function cancel(){ seq++; if (cancelTw) { cancelTw(); cancelTw = null; } anim.e = null; anim.ph = null; busy = false; }

  // ----- drawing -----
  function now(){ return calc(S.sol, S.I, anim.e != null ? anim.e : S.t); }
  function scaleFor(m){ return pinS || niceUp(Math.max(m, 0.001), [1, 2, 5, 10, 20, 50, 120]); }
  function drawCell(){
    var r = now(), sc = scaleFor(calc(S.sol, S.I, S.t).m), fr = r.m / sc, on = (anim.e != null ? anim.e : S.t) > 0 && (S.mode !== "forms" || S.fShown || anim.e != null);
    var o = { sol:S.sol, fr:S.mode === "forms" && !S.fShown && anim.e == null ? 0 : fr, on:on, ph:anim.ph };
    cellEl.innerHTML = cellSVG(o); cellEl.setAttribute("aria-label", cellAria(o, S.mode === "forms" && !S.fShown && anim.e == null ? { m:0 } : r));
    $(".fl-legend", host).innerHTML = legendHTML(S.sol);
    var s = r.s, hide = S.mode === "forms" && !S.fShown && anim.e == null;
    var gain = s.plates ? "+" + sig(r.m) + " g" : "0 g (" + f("H2") + " forms)", lose = s.anode === "C" ? "no change (" + f(s.gas) + " forms)" : (r.m > 0 ? MIN + sig(r.m) + " g" : "0 g");
    $(".fl-bars", host).innerHTML = hide ? "" :
      '<div class="fl-bar"><span class="fl-bl">Cathode coat</span><span class="fl-bt"><span class="fl-bf fl-bfc" style="width:' + r1(clamp(fr, 0, 1) * 100) + '%"></span></span><span class="fl-bv">' + gain + "</span></div>" +
      '<div class="fl-bar"><span class="fl-bl">Anode strip</span><span class="fl-bt"><span class="fl-bf fl-bfa" style="width:' + r1((s.anode === "C" ? 1 : 1 - clamp(fr, 0, 1)) * 100) + '%"></span></span><span class="fl-bv">' + lose + "</span></div>" +
      '<p class="tiny muted fl-bnote">Bar scale: 0 to ' + sc + " g. The anode bar starts full and shrinks as the anode dissolves.</p>";
  }
  function drawGraph(){
    var h = "", aria;
    if (S.mode === "graph") {
      $(".fl-h4", host).textContent = "Mass at the cathode vs time";
      var sl = slopeOf(S.sol), all = S.runs.concat([S.I]), ymax = niceUp(Math.max.apply(null, all.map(function(I){ return sl * I * 19300; })) || 0.5, [0.5, 1, 2, 5, 10, 20, 50, 100, 200]);
      h = axesSVG(19300, ymax, "Time <tspan font-style=\"italic\">t</tspan> (s)", "Mass at cathode (g)", 5);
      S.runs.forEach(function(I, i){ h += lineSVG(sl * I, 19300, ymax, { c:RUNC[i], lab:amps(I) }); });
      h += ptSVG(S.t, sl * S.I * S.t, 19300, ymax, "var(--ink-2)", "", true);
      aria = "Mass at the cathode against time for " + MV.plain(f(SOL[S.sol].salt)) + ". " + (S.runs.length ? "Lines for " + S.runs.map(amps).join(", ") + (sl ? "; steeper lines for bigger currents." : "; all flat at 0 g because no metal forms.") : "No runs yet.");
      $(".fl-gnote", host).innerHTML = C.graphNote;
    } else {
      $(".fl-h4", host).textContent = "Mass at the cathode vs charge";
      var Qn = S.I * S.t, xmax = pinX || niceUp(Math.max(Qn, 1000), [1000, 2000, 4000, 5000, 10000, 20000, 40000, 50000, 100000]);
      var shown = S.hist.filter(function(k){ return k !== S.sol; }), hide = S.mode === "forms" && !S.fShown && anim.e == null;
      var ymax = niceUp(Math.max(slopeOf(S.sol) * xmax, 0.4), [0.5, 1, 2, 5, 10, 20, 50, 100, 200]);
      h = axesSVG(xmax, ymax, "Charge <tspan font-style=\"italic\">Q</tspan> (C)", "Mass at cathode (g)", 5);
      shown.forEach(function(k){ h += lineSVG(slopeOf(k), xmax, ymax, { c:"var(--ink-2)", w:1.6, op:0.5, lab:SOL[k].metal }); });
      if (!hide) {
        h += lineSVG(slopeOf(S.sol), xmax, ymax, { c:"var(--pen)", lab:SOL[S.sol].plates ? SOL[S.sol].metal : "no metal" });
        marks.forEach(function(p){ h += ptSVG(p.Q, p.m, xmax, ymax, "var(--p-k)", p.lab, true); });
        var r = now(); h += ptSVG(r.Q, r.m, xmax, ymax, "var(--pen)", "");
      }
      aria = "Mass at the cathode against charge: a straight line through the origin for " + MV.plain(f(SOL[S.sol].salt)) + (hide ? " (hidden until you run)." : ". Point at " + sig(now().Q) + " C, " + sig(now().m) + " g.") + (shown.length ? " Faint lines for earlier solutions: " + shown.map(function(k){ return SOL[k].name; }).join(", ") + "." : "");
      $(".fl-gnote", host).innerHTML = "Faint lines are earlier solutions you ran. Each line’s slope is " + "<i>M</i> ÷ (<i>z</i><i>F</i>)" + ".";
    }
    graphEl.innerHTML = h; graphEl.setAttribute("aria-label", aria);
  }
  function paintRead(){
    var r = now(), s = r.s, rows;
    if (S.mode === "graph") {
      rows = [["Solution", f(s.salt)], ["This setting", amps(S.I) + " × " + secs(S.t) + " = " + sig(r.Q) + " C → " + (s.plates ? sig(r.m) + " g " + s.metal : "no metal")]];
      if (S.runs.length) {
        var sl = slopeOf(S.sol);
        S.runs.forEach(function(I, i){ rows.push(["Run " + (i + 1) + ": " + amps(I), s.plates ? "slope " + sig(sl * I * 1000) + " g per 1000 s" : "slope 0 (no metal)"]); });
        if (S.runs.length > 1 && s.plates) {
          var lo = Math.min.apply(null, S.runs), rat = S.runs.map(function(I){ return String(Math.round(I / lo * 100) / 100); }).join(" : ");
          rows.push(["Slope ratio", rat + ", the same as the current ratio"]);
        }
      } else rows.push(["Runs", muted("press Run to add a line")]);
    } else {
      var hide = S.mode === "forms" && !S.fShown && anim.e == null, P = muted("predict, then run");
      rows = [
        ["Charge <i>Q</i> = <i>It</i>", sig(r.Q) + " C"],
        ["Moles of electrons <i>Q</i> ÷ <i>F</i>", sig(r.ne) + " mol"],
        ["Cathode reaction", hide ? P : f(s.plates ? s.red : WATER_RED)],
        ["Moles of product at the cathode", hide ? P : sig(r.np) + " mol " + (s.plates ? s.metal : f("H2"))],
        ["Mass of metal deposited", hide ? P : s.plates ? sig(r.m) + " g" : "0 g: no metal forms (water is reduced)"],
        ["Anode change", hide ? P : s.anode === "C" ? f(s.gas) + " forms" : cap1(s.name) + " anode " + (r.m > 0 ? MIN + sig(r.m) + " g" : "0 g")],
        ["Cell type", "Electrolytic: anode +, cathode " + MIN]
      ];
    }
    $(".fl-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var r = calc(S.sol, S.I, S.t), s = r.s, t;
    if (busy) t = volt ? "Run B: the supply voltage is raised, but the current is 1.00 A for 1930 s…" : "Electrons flow from the anode, through the supply, onto the cathode…";
    else if (S.mode === "forms") {
      if (!S.fShown) t = C.formsNote;
      else {
        var right = S.fPred ? ((S.fPred === "metal") === s.plates && S.fPred !== "o2") : null;
        t = (S.fPred ? "You predicted " + (S.fPred === "metal" ? s.name + " metal" : S.fPred === "h2" ? "hydrogen gas" : "oxygen gas") + ": " + (right ? "✓ right. " : "✗ not this time. ") : "") +
          (s.plates ? f(s.cat) + " (" + volts(s.E) + ") is easier to reduce than water (" + volts(EW) + "), so " + s.name + " plates out." :
            "Water (" + volts(EW) + ") is easier to reduce than " + f(s.cat) + " (" + volts(s.E) + "), so H₂ bubbles form and no " + s.name + " plates out.") + (S.fPred === "o2" ? " Oxygen can only form at an anode." : "");
      }
    } else if (S.mode === "graph") t = S.runs.length ? "Each line is straight through the origin. Twice the current, twice the slope." : "Set a current and press Run to add a line.";
    else if (S.t === 0) t = "Set a time, then press Run.";
    else t = amps(S.I) + " × " + secs(S.t) + " = " + sig(r.Q) + " C → " + sig(r.ne) + " mol e⁻ → " + (s.plates ? sig(r.np) + " mol " + s.metal + " → " + sig(r.m) + " g on the cathode." : sig(r.np) + " mol H₂ at the cathode; no " + s.name + " plates out of water.");
    $(".fl-cap", host).innerHTML = t + (note && !busy ? " <strong>" + note + "</strong>" : "");
  }
  function paintCtl(){
    var d = busy || locked ? " disabled" : "", m = S.mode;
    MV.keepFocus(btns, function(){
      btns.innerHTML = '<button type="button" class="btn primary sm" data-act="run" data-k="flrun"' + (d || (m === "forms" && !S.fPred) || S.t === 0 ? " disabled" : "") + ">Run</button>" +
        (m === "plate" ? '<button type="button" class="btn ghost sm" data-act="step" data-k="flstep"' + (d || S.t >= 19300 ? " disabled" : "") + ">Step +965 s</button>" : "") +
        '<button type="button" class="btn ghost sm" data-act="reset" data-k="flreset"' + d + ">Reset</button>" +
        (m === "graph" ? '<button type="button" class="btn ghost sm" data-act="clear" data-k="flclear"' + (d || !S.runs.length ? " disabled" : "") + ">Clear runs</button>" : "");
    });
    $$("input[type=range]", slHost).forEach(function(el){ el.disabled = busy || locked; });
    predHost.hidden = m !== "forms";
  }
  function draw(){ drawCell(); drawGraph(); }
  function paint(){ draw(); paintRead(); paintCap(); paintCtl(); MV.changed(); }

  // ----- running -----
  function animate(eFrom, eTo, dur, done){
    var my = ++seq, t0 = performance.now(); busy = true; paintCtl(); paintCap();
    anim.e = eFrom; anim.ph = 0;
    cancelTw = MV.tween({ dur:dur, ease:LIN, step:function(k){ if (my !== seq) return; anim.e = eFrom + (eTo - eFrom) * k; anim.ph = (performance.now() - t0) / 1700; draw(); paintRead(); },
      done:function(){ if (my !== seq) return; cancelTw = null; anim.e = null; anim.ph = null; busy = false; if (done) done(); else paint(); } });
  }
  function addHist(){ S.hist = S.hist.filter(function(k){ return k !== S.sol; }).concat([S.sol]).slice(-5); }
  btns.addEventListener("click", function(e){
    var b = e.target.closest("[data-act]"); if (!b || b.disabled || busy || locked) return;
    var a = b.dataset.act; note = ""; marks = [];
    if (a === "reset") { cancel(); S.t = 0; SL.set("t", 0); S.fShown = false; clearPins(); api.save(); paint(); return; }
    if (a === "clear") { S.runs = []; api.save(); paint(); return; }
    if (a === "step") { var from = S.t; S.t = Math.min(19300, S.t + 965); SL.set("t", S.t); addHist(); api.save(); animate(from, S.t, 1200); return; }
    if (a === "run") {
      addHist();
      if (S.mode === "graph") { if (S.runSol !== S.sol) { S.runs = []; S.runSol = S.sol; } }
      api.save();
      animate(0, S.t, 2600, function(){
        if (S.mode === "graph") { S.runs = S.runs.filter(function(I){ return I !== S.I; }).concat([S.I]).slice(-3); }
        if (S.mode === "forms") S.fShown = true;
        api.save(); paint();
      });
    }
  });

  // ----- predictions -----
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); paintCtl(); }
  function setAll(mode, sol, I, t){
    S.mode = mode; S.sol = sol; S.I = I; S.t = t; RG.mode.set(mode); RG.sol.set(sol); SL.set("I", I); SL.set("t", t);
    if (S.runSol !== sol) { S.runs = []; S.runSol = sol; }
  }
  var hooks = {
    start:function(p){
      cancel(); note = ""; clearPins(); S.fShown = false; S.fPred = "";
      if (p.id === "p1") { setAll("plate", "cu", 1, 1930); pinS = 2; pinX = 4000; }
      else if (p.id === "p2") { setAll("plate", "cu", 2, 0); pinS = 1; pinX = 2000; }
      else if (p.id === "p3") { setAll("plate", "cu", 2, 0); pinS = 1; pinX = 2000; }
      else { setAll("forms", "al", 2, 1930); }
      buildPred(); api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(n){ note = n || ""; busy = false; lock(false); api.save(); paint(); MV.wait(150, done); }
      if (p.id === "p1") {
        animate(0, 1930, 1800, function(){
          marks = [{ Q:1930, m:calc("cu", 1, 1930).m, lab:"1.00 A" }]; S.I = 2; SL.set("I", 2); draw(); paintRead();
          MV.wait(500, function(){ animate(0, 1930, 1800, function(){ fin("Same time, twice the current: 3860 C and 1.27 g, twice the copper."); }); });
        });
      } else if (p.id === "p2") {
        S.t = 965; SL.set("t", 965);
        animate(0, 965, 1500, function(){
          marks = [{ Q:1930, m:calc("cu", 2, 965).m, lab:"A" }]; S.I = 1; S.t = 1930; SL.set("I", 1); SL.set("t", 1930); volt = true; draw(); paintRead();
          MV.wait(500, function(){ animate(0, 1930, 2200, function(){ volt = false; marks = [{ Q:1930, m:calc("cu", 2, 965).m, lab:"A and B" }]; fin("Both runs land on the same point: 1930 C, 0.635 g."); }); });
        });
      } else if (p.id === "p3") {
        S.t = 965; SL.set("t", 965);
        animate(0, 965, 2400, function(){ fin("The anode bar shrank by exactly what the cathode bar grew: 0.635 g."); });
      } else {
        animate(0, 1930, 2400, function(){ S.fShown = true; fin("Bubbles at the cathode, and the mass stays 0 g."); });
      }
    }
  };

  // ----- challenges -----
  function chal(id){
    var Qn = S.I * S.t, r = calc(S.sol, S.I, S.t), s = SOL[S.sol];
    function eq(a, b){ return Math.abs(a - b) < 1e-6; }
    if (id === "tc1") {
      if (S.sol !== "cu") return { ok:false, msg:"Use CuSO₄(aq): this challenge is about copper." };
      if (eq(Qn, 1930)) return { ok:true };
      if (eq(Qn, 965)) return { ok:false, msg:"Half the charge. You need 0.0200 mol e⁻ for 0.0100 mol Cu." };
      if (eq(Qn, 3860)) return { ok:false, msg:"Twice the charge: you counted one electron per Cu²⁺, not two." };
      if (Qn === 0) return { ok:false };
      return { ok:false, msg:"That passes " + sig(Qn) + " C and deposits " + sig(r.m) + " g. You need 0.635 g." };
    }
    if (id === "tc2") {
      if (S.sol !== "ag") return { ok:false, msg:"Switch to AgNO₃(aq) first." };
      if (eq(Qn, 965)) return { ok:true };
      if (eq(Qn, 1930)) return { ok:false, msg:"Silver ions take <strong>one</strong> electron each." };
      if (Qn === 0) return { ok:false };
      return { ok:false, msg:"That passes " + sig(Qn) + " C and deposits " + sig(r.m) + " g of silver. You need 1.08 g." };
    }
    if (id === "tc3") {
      if (S.sol === "al") return { ok:false, msg:"In water, no aluminium forms; H₂ does." };
      if (S.sol === "na") return { ok:false, msg:"Sodium can’t be plated from water." };
      if (S.t !== 9650) return { ok:false, msg:"Set the time to exactly 9650 s." };
      if (eq(r.np, 0.1)) return { ok:true };
      if (S.sol === "cu" && S.I === 1) return { ok:false, msg:"That gives 0.0500 mol Cu. Each Cu²⁺ needs 2 e⁻." };
      return { ok:false, msg:"That gives " + sig(r.np) + " mol of " + s.name + ". You need 0.100 mol." };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- shared: number boxes with a Check button (N4; within 1%) ----------
function one(s){ var v = MV.parseNum(String(s || "").replace(/[a-z%]+/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
function near(v, w){ return Math.abs(v - w) <= 0.01 * Math.abs(w) + 1e-9; }
function numBoxes(host, st, boxes, o){
  // boxes: [{id, label, unit, v, wrong:[[value, fb]]}]; st = persisted {vals:{}, ok:bool, tries}; o = {key, done(html), save()}
  st.vals = st.vals && typeof st.vals === "object" ? st.vals : {}; st.tries = st.tries || 0; st.ok = !!st.ok;
  var msg = "", marks = {};
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<div class="fl-chain">' + boxes.map(function(b, i){
        var mk = st.ok ? "✓" : marks[b.id] || "";
        return (i ? '<span class="fl-arr" aria-hidden="true">→</span>' : "") + '<div class="fl-cbox"><label for="fl-' + o.key + b.id + '">' + b.label + '</label><span class="fl-crow"><input class="numin" id="fl-' + o.key + b.id + '" data-nb="' + b.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(st.vals[b.id] || "") + '"' + (st.ok ? " disabled" : "") + '><span class="fl-unit">' + b.unit + '</span><span class="fl-mk" aria-hidden="true">' + mk + "</span></span></div>";
      }).join("") + "</div>" +
        (st.ok ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + o.done) : '<div class="q-actions"><button type="button" class="btn primary sm" data-nbchk="1" data-k="' + o.key + 'chk">Check</button></div>' + (msg ? MV.fbHTML(msg.soft ? "" : "bad", msg.t) : ""));
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nb; if (!id) return; st.vals[id] = e.target.value; o.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nb) { var b = host.querySelector("[data-nbchk]"); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-nbchk]"); if (!b) return;
    var first = null; marks = {};
    for (var i = 0; i < boxes.length; i++) {
      var bx = boxes[i], v = one(st.vals[bx.id]);
      if (v == null) { msg = { t:"Fill in every box with one number.", soft:true }; paint(); return; }
      if (near(v, bx.v)) marks[bx.id] = "✓";
      else { marks[bx.id] = "✗"; if (!first) { var w = (bx.wrong || []).filter(function(x){ return near(v, x[0]); })[0]; first = { b:bx, fb:w ? w[1] : bx.fb }; } }
    }
    if (!first) { st.ok = true; msg = ""; }
    else { st.tries++; msg = { t:"<strong>✗ Not quite.</strong> Check <strong>" + first.b.label + "</strong>. " + first.fb + " Try again." }; }
    o.save(); paint(); MV.focusFb(host);
  });
  paint();
}

// ---------- Part 3: Electroplating ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, s4 = C.s4;
  S.w = S.w && typeof S.w === "object" ? S.w : {}; ["pos", "neg"].forEach(function(k){ if (["ring", "bar", ""].indexOf(S.w[k] || "") < 0) S.w[k] = ""; S.w[k] = S.w[k] || ""; });
  if (["ag", "cu", ""].indexOf(S.w.sol || "") < 0) S.w.sol = ""; S.w.sol = S.w.sol || ""; S.w.res = typeof S.w.res === "string" ? S.w.res : "";
  S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {}; S.s3 = S.s3 && typeof S.s3 === "object" ? S.s3 : {};
  S.c3 = S.c3 && typeof S.c3 === "object" ? S.c3 : {}; if (s4.opts.map(function(x){ return x.id; }).indexOf(S.s4) < 0) S.s4 = "";
  var sel = null;
  var OBJ = { ring:"Ring", bar:"Silver bar" };
  host.innerHTML =
    '<div class="part fl-st"><h3>' + s1.title + "</h3><p>" + s1.intro + "</p>" +
      '<div class="fl-w"><div class="fl-wcol"><p class="fl-wh">Objects</p><div class="fl-wobj" role="group" aria-label="Objects to connect"></div></div>' +
      '<div class="fl-wcol"><p class="fl-wh">Power supply terminals</p><div class="fl-wterm" role="group" aria-label="Power supply terminals"></div></div></div>' +
      '<div class="fl-wsol"></div><div class="fl-box fl-wbox"><svg class="fl-svg" id="fl-wsvg" viewBox="0 0 360 190" role="img" aria-label=""></svg></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-s1="check" data-k="s1chk">Check</button></div><div class="fl-s1fb"></div></div>' +
    '<div class="part fl-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="fl-s2"></div></div>' +
    '<div class="part fl-st"><h3>' + s3.title + "</h3><p>" + s3.intro + "</p>" +
      '<details class="alg fl-data"><summary>Check it with data</summary><div class="fl-dtab"></div></details><div class="fl-s3"></div>' +
      '<p class="fl-cq"><strong>' + s3.causesQ + '</strong></p><div class="fl-causes" role="group" aria-label="Likely causes"></div><div class="fl-cfb" aria-live="polite"></div></div>' +
    '<div class="part fl-st"><h3>' + s4.title + "</h3>" + s4.html + '<div class="fl-s4"></div><div class="fl-s4fb" aria-live="polite"></div></div>';

  // ----- station 1 -----
  var objH = $(".fl-wobj", host), termH = $(".fl-wterm", host), fbH = $(".fl-s1fb", host);
  function where(id){ return S.w.pos === id ? "pos" : S.w.neg === id ? "neg" : ""; }
  function termT(k){ return k === "pos" ? "+ terminal" : MIN + " terminal"; }
  function wireSVG(){
    var h = rect(40, 70, 280, 110, "var(--fl-sol0)", { rx:8 }) + '<path d="M36 50 V176 Q36 186 46 186 H314 Q324 186 324 176 V50" fill="none" stroke="var(--ink-2)" stroke-width="2.2"/>';
    h += rect(140, 6, 80, 30, "var(--sheet)", { rx:5, s:"var(--ink)", sw:1.6 }) + tx(152, 21, "+", { fs:15, w:700 }) + tx(208, 21, MIN, { fs:15, w:700 }) + tx(180, 21, "supply", { fs:10.5, c:"var(--ink-2)" });
    h += '<path d="M140 21 H100 V60" fill="none" stroke="var(--ink-2)" stroke-width="2.2"/><path d="M220 21 H260 V60" fill="none" stroke="var(--ink-2)" stroke-width="2.2"/>';
    function obj(id, x){
      if (id === "ring") return circ(x, 112, 22, "none", { s:"var(--ink)", sw:7 }) + circ(x, 112, 22, "none", { s:"var(--fl-metal)", sw:3.5 }) + ln(x, 60, x, 90, { c:"var(--ink-2)", w:2 }) + tx(x, 150, "ring", { fs:11 });
      if (id === "bar") return rect(x - 9, 60, 18, 104, "var(--fl-metal)", { s:"var(--ink)", sw:1.5 }) + tx(x, 76, "Ag", { fs:10.5, w:700 });
      return tx(x, 112, "empty", { fs:11, c:"var(--ink-2)" });
    }
    h += obj(S.w.pos, 100) + obj(S.w.neg, 260);
    h += tx(180, 174, S.w.sol ? f(S.w.sol === "ag" ? "AgNO3(aq)" : "CuSO4(aq)") : "no solution chosen", { fs:12, w:700, c:S.w.sol ? "var(--ink)" : "var(--ink-2)" });
    return h;
  }
  function paintS1(){
    MV.keepFocus(objH, function(){
      objH.innerHTML = ["ring", "bar"].map(function(id){ var w = where(id); return '<button type="button" class="fl-ob" data-ob="' + id + '" data-k="ob' + id + '" aria-pressed="' + (sel === id) + '">' + OBJ[id] + ' <span class="fl-obs">' + (w ? "on the " + termT(w) : "not connected") + "</span></button>"; }).join("");
    });
    MV.keepFocus(termH, function(){
      termH.innerHTML = ["pos", "neg"].map(function(k){ var o = S.w[k]; return '<button type="button" class="fl-tm" data-tm="' + k + '" data-k="tm' + k + '"><strong>' + termT(k) + '</strong> <span class="fl-obs">' + (o ? OBJ[o] : sel ? "tap to connect the " + OBJ[sel].toLowerCase() : "empty") + "</span></button>"; }).join("");
    });
    var sv = $("#fl-wsvg"); sv.innerHTML = wireSVG();
    sv.setAttribute("aria-label", "Your plating cell: + terminal " + (S.w.pos ? "connected to the " + OBJ[S.w.pos].toLowerCase() : "empty") + "; " + MIN + " terminal " + (S.w.neg ? "connected to the " + OBJ[S.w.neg].toLowerCase() : "empty") + "; solution " + (S.w.sol ? MV.plain(f(S.w.sol === "ag" ? "AgNO3(aq)" : "CuSO4(aq)")) : "not chosen") + ".");
    var r = S.w.res;
    fbH.innerHTML = r === "ok" ? MV.fbHTML("good", s1.fb.ok) : r === "rev" ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s1.fb.rev) : r === "sol" ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s1.fb.sol) : r === "empty" ? MV.fbHTML("", s1.fb.empty) : "";
  }
  objH.addEventListener("click", function(e){ var b = e.target.closest("[data-ob]"); if (!b) return; sel = sel === b.dataset.ob ? null : b.dataset.ob; paintS1(); });
  termH.addEventListener("click", function(e){
    var b = e.target.closest("[data-tm]"); if (!b) return; var k = b.dataset.tm, other = k === "pos" ? "neg" : "pos";
    if (sel) { var prev = S.w[k]; if (S.w[other] === sel) S.w[other] = prev && prev !== sel ? prev : ""; S.w[k] = sel; sel = null; }
    else if (S.w[k]) S.w[k] = "";
    S.w.res = ""; api.save(); paintS1();
  });
  radios($(".fl-wsol", host), { label:"Solution", cls:"chips", aria:"Plating solution", options:[{ id:"ag", t:f("AgNO3(aq)") }, { id:"cu", t:f("CuSO4(aq)") }], value:S.w.sol, onChange:function(v){ S.w.sol = v; S.w.res = ""; api.save(); paintS1(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest('[data-s1="check"]'); if (!b) return;
    var w = S.w;
    w.res = !w.pos || !w.neg || !w.sol ? "empty" : w.neg === "bar" && w.pos === "ring" ? "rev" : w.sol !== "ag" ? "sol" : "ok";
    api.save(); paintS1(); MV.focusFb(fbH);
  });
  paintS1();

  // ----- station 2: how long? -----
  var nAg = 2.16 / MR.Ag, Q2 = nAg * FC;
  numBoxes($(".fl-s2", host), S.s2, [
    { id:"n", label:"Moles of Ag, <i>n</i>(Ag)", unit:"mol", v:nAg, fb:"<i>n</i> = <i>m</i> ÷ <i>M</i>: 2.16 ÷ 108.", wrong:[[MR.Ag / 2.16, "Divided the wrong way: <i>n</i> = <i>m</i> ÷ <i>M</i>."]] },
    { id:"e", label:"Moles of electrons, <i>n</i>(e⁻)", unit:"mol", v:nAg, fb:"Ag⁺ + e⁻ → Ag: one electron per silver atom.", wrong:[[nAg / 2, "Silver ions take <strong>one</strong> electron each; don’t halve."], [nAg * 2, "Silver ions take <strong>one</strong> electron each."]] },
    { id:"q", label:"Charge <i>Q</i>", unit:"C", v:Q2, fb:"<i>Q</i> = <i>n</i>(e⁻) × <i>F</i>.", wrong:[[nAg / FC, "Multiply by <i>F</i>: <i>Q</i> = <i>n</i>(e⁻) × <i>F</i>."]] },
    { id:"t", label:"Time <i>t</i>", unit:"s", v:Q2 / 0.5, fb:"<i>t</i> = <i>Q</i> ÷ <i>I</i>.", wrong:[[Q2 * 0.5, "<i>t</i> = <i>Q</i> ÷ <i>I</i>. A bigger current means a shorter time; here the current is small."]] }
  ], { key:"s2", done:s2.done, save:api.save });

  // ----- station 3: efficiency -----
  var before = 12.000, after = 12.508, theo = calc("cu", 2, 965).m, act = after - before;
  $(".fl-dtab", host).innerHTML = MV.tableHTML({ head:["Measurement", "Value"], rows:[["Current", amps(2)], ["Time", secs(965)], ["Cathode mass before", fx(before, 3) + " g"], ["Cathode mass after", fx(after, 3) + " g"]], caption:"Measured data from the plating run" });
  numBoxes($(".fl-s3", host), S.s3, [
    { id:"th", label:"Theoretical mass of Cu", unit:"g", v:theo, fb:"1930 C → 0.0200 mol e⁻ → 0.0100 mol Cu → mass.", wrong:[[theo * 2, "Each Cu²⁺ needs <strong>2</strong> electrons. Moles of Cu = moles of e⁻ ÷ 2."]] },
    { id:"ac", label:"Actual mass of Cu", unit:"g", v:act, fb:"Actual = mass after − mass before.", wrong:[[after, "That’s the whole cathode. Actual = mass after − mass before."]] },
    { id:"ef", label:"Current efficiency", unit:"%", v:act / theo * 100, fb:"Efficiency = actual ÷ theoretical × 100%.", wrong:[[theo / act * 100, "Efficiency = actual ÷ theoretical × 100%. Side reactions waste charge, so it’s at most 100%."]] }
  ], { key:"s3", done:"0.508 ÷ 0.635 × 100% = 80%. Some of the charge did something other than plating copper.", save:api.save });
  var cH = $(".fl-causes", host), cfb = $(".fl-cfb", host);
  function paintC(){
    MV.keepFocus(cH, function(){
      cH.innerHTML = s3.causes.map(function(c){ var on = !!S.c3[c.id]; return '<button type="button" class="opt sa-opt fl-cause" role="checkbox" aria-checked="' + on + '" data-cz="' + c.id + '" data-k="cz' + c.id + '"><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + c.t + "</span></button>"; }).join("");
    });
    var on = s3.causes.filter(function(c){ return S.c3[c.id]; });
    cfb.innerHTML = on.length ? MV.fbHTML("good", "<strong>✓ Likely.</strong> " + on.map(function(c){ return c.why; }).join(" ") + (on.length === s3.causes.length ? " " + s3.causesFb : "")) : "";
  }
  cH.addEventListener("click", function(e){ var b = e.target.closest("[data-cz]"); if (!b) return; S.c3[b.dataset.cz] = !S.c3[b.dataset.cz]; api.save(); paintC(); });
  paintC();

  // ----- station 4: environment -----
  var s4fb = $(".fl-s4fb", host);
  function paintS4(){ var o = s4.opts.filter(function(x){ return x.id === S.s4; })[0]; s4fb.innerHTML = o ? MV.fbHTML("good", "<strong>✓ Good choice.</strong> " + o.why + " " + s4.fb) : ""; }
  radios($(".fl-s4", host), { label:s4.q, cls:"chips", aria:"A practice that reduces harm", options:s4.opts.map(function(x){ return { id:x.id, t:x.t }; }), value:S.s4, onChange:function(v){ S.s4 = v; api.save(); paintS4(); } });
  paintS4();
}

// ---------- Performance task: Plating plan ----------
var TSOL = ["ag", "cu", "zn", "al"], TI = [0.5, 1, 2, 4], TT = [965, 1930, 3860, 7720];
var task = (function(){
  var S = null, api = null;
  function read(){ return { sol:TSOL.indexOf(S && S.sol) >= 0 ? S.sol : "", I:TI.indexOf(+(S && S.I)) >= 0 ? +S.I : 0, t:TT.indexOf(+(S && S.t)) >= 0 ? +S.t : 0 }; }
  function massOf(d){ return d.sol && d.I && d.t ? calc(d.sol, d.I, d.t).m : 0; }
  function gauge(d){
    var m = massOf(d), x0 = 30, x1 = 330, mx = 6, h = "";
    function X(v){ return x0 + (x1 - x0) * clamp(v / mx, 0, 1); }
    h += tx(x0, 14, "Coat mass (g)", { fs:12, w:700, a:"start" });
    h += rect(X(2), 24, X(4) - X(2), 26, "var(--hi-soft)") + rect(x0, 24, x1 - x0, 26, "none", { s:"var(--ink-2)", sw:1.2 });
    for (var i = 0; i <= 6; i++) h += ln(X(i), 50, X(i), 55, { c:"var(--ink-2)", w:1 }) + tx(X(i), 64, String(i), { fs:10.5, c:"var(--ink-2)" });
    h += tx((X(2) + X(4)) / 2, 37, "target 2.00–4.00 g", { fs:10.5, c:"var(--ink-2)" });
    if (d.sol && d.I && d.t) h += rect(x0, 29, X(m) - x0, 16, "var(--pen)", { op:0.85 }) + (m > mx ? tx(x1 + 4, 37, "▶", { fs:12, c:"var(--pen)", a:"start" }) : "");
    var tx0 = 30, tx1 = 330, tm = 7720;
    function XT(v){ return tx0 + (tx1 - tx0) * clamp(v / tm, 0, 1); }
    h += tx(tx0, 88, "Time (s)", { fs:12, w:700, a:"start" }) + rect(tx0, 98, XT(3600) - tx0, 20, "var(--hi-soft)") + rect(tx0, 98, tx1 - tx0, 20, "none", { s:"var(--ink-2)", sw:1.2 });
    h += ln(XT(3600), 94, XT(3600), 122, { c:"var(--ink)", w:1.6, d:"4 3" }) + tx(XT(3600), 130, "1 hour", { fs:10.5, c:"var(--ink-2)" });
    TT.forEach(function(v){ h += tx(XT(v), 142, grp(String(v)), { fs:10, c:"var(--ink-2)" }); });
    if (d.t) h += rect(tx0, 102, XT(d.t) - tx0, 12, "var(--p-k)", { op:0.85 });
    // the plated part: a disc whose rim thickens with the coat
    var c = clamp(m / 6, 0, 1) * 10;
    h += circ(395, 70, 26 + c, d.sol && d.sol !== "al" && m > 0 ? "var(--ink-2)" : "none") + circ(395, 70, 26, "var(--fl-metal)", { s:"var(--ink)", sw:1.5 }) + tx(395, 70, "part", { fs:10.5 });
    if (d.sol === "al" && d.I && d.t) h += tx(395, 118, "H₂ bubbles", { fs:10.5, c:"var(--ink-2)" });
    else if (m > 0) h += tx(395, 118, SOL[d.sol].metal + " coat", { fs:10.5, c:"var(--ink-2)" });
    return h;
  }
  function paint(){
    var d = read(), sv = $("#fl-tsvg"); if (!sv) return;
    sv.innerHTML = gauge(d);
    var ok = d.sol && d.I && d.t, r = ok ? calc(d.sol, d.I, d.t) : null;
    sv.setAttribute("aria-label", ok ? MV.plain(f(SOL[d.sol].salt)) + ", " + amps(d.I) + ", " + secs(d.t) + ": " + (SOL[d.sol].plates ? sig(r.m) + " g of " + SOL[d.sol].name : "no metal; hydrogen forms") + "." : "Choose a solution, a current and a time.");
    $("#fl-tread").innerHTML = MV.readoutHTML(ok ? [["Charge", sig(r.Q) + " C"], ["Moles of e⁻", sig(r.ne) + " mol"], ["Coat mass", SOL[d.sol].plates ? sig(r.m) + " g" : "0 g (H₂ forms)"], ["Time", secs(d.t) + " (" + clock(d.t) + ")"]] : [["Plan", muted("choose all three inputs")]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S;
      inp.innerHTML = '<div class="fl-tsol"></div><div class="fl-tI"></div><div class="fl-tt"></div>';
      pv.innerHTML = '<h4 class="fl-h4">Your plating job</h4><div class="fl-box"><svg class="fl-svg" id="fl-tsvg" viewBox="0 0 440 150" role="img" aria-label=""></svg></div><dl class="read" id="fl-tread" aria-live="polite"></dl>';
      function ch(k, v){ S[k] = k === "sol" ? v : +v; api.save(); paint(); api.update(); }
      radios($(".fl-tsol", inp), { label:"Solution", cls:"chips", aria:"Plating solution", options:TSOL.map(function(k){ return { id:k, t:f(SOL[k].salt) }; }), value:read().sol, onChange:function(v){ ch("sol", v); } });
      radios($(".fl-tI", inp), { label:"Current", cls:"chips", aria:"Current", options:TI.map(function(v){ return { id:String(v), t:amps(v) }; }), value:read().I ? String(read().I) : "", onChange:function(v){ ch("I", v); } });
      radios($(".fl-tt", inp), { label:"Time", cls:"chips", aria:"Time", options:TT.map(function(v){ return { id:String(v), t:secs(v) }; }), value:read().t ? String(read().t) : "", onChange:function(v){ ch("t", v); } });
      paint();
    },
    read:read,
    valid:function(d){ return d.sol && d.I && d.t ? true : "Choose a solution, a current and a time."; },
    checks:function(d){ var m = massOf(d); return [!!d.sol && SOL[d.sol].plates, m >= 2 - 1e-9, m <= 4 + 1e-9, d.t > 0 && d.t <= 3600]; },
    key:function(d){ return d.sol + "|" + d.I + "|" + d.t; },
    label:function(k){ var p = k.split("|"), m = calc(p[0], +p[1], +p[2]).m; return f(SOL[p[0]].salt) + ", " + amps(+p[1]) + " for " + secs(+p[2]) + " (" + sig(m) + " g)"; },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  task:task
});
})();
