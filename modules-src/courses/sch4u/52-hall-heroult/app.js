// SCH4U 52 The Hall–Héroult Process: hero (cutaway pot: Al³⁺ down to the pool, O²⁻ up to the anodes, CO₂ bubbles),
// Aluminium smelter (Explore: C10-style industrial electrolytic cell with Inside the pot / Run the cell / Why not water?
// modes, a 24-hour timeline and a Faraday readout), The cost of aluminium (Part 3: CO₂-per-kg calculator, recycling
// energy, Canadian picture notes, rock-to-metal strip), Smelter calculations (N4 number entry with units, 1% tolerance),
// Smelter plan task (anode, power source, current, scrap; live dashboard).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, D = MV.chem.data;
function r1(v){ return Math.round(v * 10) / 10; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function LIN(t){ return t; }
var MINUS = "−";

// ---------- course values (MV.chem.data) and the plan's model values ----------
var FAR = D["const"].F;                       // 96 500 C/mol
var M_AL = D.Mr.Al, M_C = D.Mr.C;             // 27.0, 12.0 g/mol ("Use these values")
var M_O = D.M.O;                              // 16.00 g/mol (course table)
var M_CO2 = M_C + 2 * M_O, M_O2 = 2 * M_O;    // 44.0, 32.0 g/mol
var M_H2 = 2 * D.M.H;                         // 2.02 g/mol
// Model values (plan §1, §6 risk 1), labelled "model" on screen. Real smelters vary.
var T_CRY = 960, T_ALU = 2050;                // bath liquid from 960 °C with cryolite, 2050 °C alumina alone
var VOLT = { carbon:4.0, inert:5.0 };         // cell voltage, V
var CF = { hydro:0.02, gas:0.5, coal:1.0 };   // kg CO₂ per kWh of electricity
var PW_T = { hydro:"hydro", gas:"natural gas", coal:"coal" };
var KWH_KG = 12, ANODE_KG = 1.2;              // Part 3: kWh and anode CO₂ per kg of new aluminium
var RECYC = 0.05;                             // VERIFY: remelting at about 5% of the energy of new aluminium
var REMELT = RECYC * KWH_KG;                  // 0.6 kWh per kg of scrap (task model)
var E0_AL = D.E0.filter(function(r){ return /^Al/.test(r[0]); })[0][1];          // −1.66 V
var E0_W = D.E0.filter(function(r){ return /^2H2O/.test(r[0]); })[0][1];         // −0.83 V

// ---------- number formatting ----------
var SUP = { "0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻" };
function sup(n){ return String(n).replace(/[0-9-]/g, function(c){ return SUP[c]; }); }
function sci(v){
  if (!v) return "0";
  var e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), m = v / Math.pow(10, e);
  if (Math.abs(m) >= 9.995) { m /= 10; e++; }
  return m.toFixed(2) + " × 10" + sup(e);
}
// three significant figures, keeping trailing zeros (2.40 t, 0.806 t)
function s3(v){
  if (!v) return "0";
  var e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), dp = Math.max(0, 2 - e), s = Math.abs(v).toFixed(dp), p = s.split(".");
  if (p[0].length > 4) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (v < 0 ? MINUS : "") + p.join(".");
}
function tonnes(g){ return s3(g / 1e6) + " t"; }
function kwh(v){ return MV.num(Math.round(v), 0) + " kWh"; }
var CH = function(s){ return MV.chem.f(s); };

// ---------- the smelter model (plan Explore rules 1–5) ----------
function liquidOf(s){ return s.cry ? s.temp >= T_CRY : s.temp >= T_ALU; }
function model(s){
  var liq = liquidOf(s), water = s.mode === "water", flows = water || liq;
  var I = flows ? s.I : 0, Q = I * 1000 * s.t * 3600, ne = Q / FAR;
  var r = { liquid:liq, water:water, I:I, Q:Q, ne:ne, mAl:0, carbon:0, co2:0, o2:0, E:0, h2:0 };
  if (water) { r.h2 = ne / 2; return r; }
  r.mAl = (s.eff / 100) * ne / 3 * M_AL;
  if (s.anode === "carbon") { r.carbon = r.mAl * 3 * M_C / (4 * M_AL); r.co2 = r.mAl * 3 * M_CO2 / (4 * M_AL); }
  else r.o2 = r.mAl * 3 * M_O2 / (4 * M_AL);
  r.E = VOLT[s.anode] * Q / 3.6e6;
  return r;
}
var MAX_AL = 500 * 1000 * 24 * 3600 / FAR / 3 * M_AL;   // 500 kA for 24 h: the biggest pool the sliders can make

// @component radioGroup (from MHF4U 25, via SCH4U 01–07) — segmented control or chip row as a real radio group (arrow keys,
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
function T(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + (o.halo ? ' stroke="var(--sheet)" stroke-width="4" paint-order="stroke" stroke-linejoin="round"' : "") + ">" + s + "</text>"; }
function L(x1, y1, x2, y2, c, w, extra){ return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"' + (extra || "") + "/>"; }
function R(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + fill + '"' + (o.op != null ? ' fill-opacity="' + o.op + '"' : "") + (o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + "/>"; }
function ion(x, y, kind){
  var al = kind === "al", w = al ? 36 : 32, fill = al ? "var(--ec-cat)" : "var(--at-o)";
  return R(x - w / 2, y - 9, w, 18, fill, { rx:9 }) + T(x, y + 0.5, al ? "Al³⁺" : "O²⁻", { fs:11.5, w:700, c:"var(--sheet)" });
}
function arrowHead(x, y, dir, c){ var d = dir === "down" ? 1 : -1; return '<path d="M' + r1(x - 5) + " " + r1(y - 5 * d) + " L" + r1(x) + " " + r1(y) + " L" + r1(x + 5) + " " + r1(y - 5 * d) + '" fill="none" stroke="' + c + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'; }

// @component C10 cellBuilder (industrial electrolytic skin) — Hall–Héroult pot cutaway as an SVG string (viewBox 0 0 480 300).
// potSVG({liquid, temp, cry, pool 0–1, shrink 0–1, anode:"carbon"|"inert", phase 0–1 or null (no motion), flag, labels})
var AX = [170, 262, 354], AW = 74, A_TOP = 96, A_BOT = 196, BATH_TOP = 146, BATH_BOT = 262;
function potSVG(o){
  var h = "", inert = o.anode === "inert", aFill = inert ? "var(--at-m)" : "var(--at-c)", ph = o.pool > 0.002 ? 4 + 32 * clamp(o.pool, 0, 1) : 0, poolTop = BATH_BOT - ph, shr = 36 * clamp(o.shrink || 0, 0, 1);
  // supply and wires
  h += R(380, 6, 92, 34, "var(--sheet)", { rx:6, stroke:"var(--ink-2)", sw:1.8 }) + T(426, 23, "DC supply", { fs:12.5, w:700 });
  h += T(396, 49, "+", { fs:14, w:700 }) + T(466, 49, MINUS, { fs:14, w:700 });
  h += L(396, 40, 396, 58, "var(--ink-2)", 4) + L(AX[0], 58, 396, 58, "var(--ink-2)", 5);
  h += L(456, 40, 456, 214, "var(--ink-2)", 4) + L(456, 214, 436, 214, "var(--ink-2)", 4);
  // electrons in the external circuit (violet)
  h += T(318, 46, "e⁻ →", { fs:13, w:700, c:"var(--ec-e)" }) + T(468, 128, "e⁻", { fs:13, w:700, c:"var(--ec-e)", a:"start" }) + arrowHead(456, 150, "down", "var(--ec-e)");
  // shell (steel) and carbon lining (cathode)
  h += R(28, 124, 412, 152, "var(--sheet)", { rx:10, stroke:"var(--ink-2)", sw:3 });
  // bath
  if (o.liquid) h += R(46, BATH_TOP, 376, BATH_BOT - BATH_TOP, "var(--hi-soft)");
  else {
    h += R(46, BATH_TOP, 376, BATH_BOT - BATH_TOP, "var(--paper)");
    for (var gy = BATH_TOP + 12; gy < BATH_BOT - 4; gy += 16) for (var gx = 56 + ((gy / 16) % 2) * 8; gx < 416; gx += 16) h += R(gx - 2.5, gy - 2.5, 5, 5, "var(--ink-2)", { op:0.35 });
  }
  if (ph) h += R(46, poolTop, 376, ph, "var(--ink-2)", { op:0.5 });
  h += '<path d="M40 130 V262 Q40 270 48 270 H420 Q428 270 428 262 V130" fill="none" stroke="var(--at-c)" stroke-width="8" stroke-linejoin="round"/>';
  // anodes: rods + blocks (bottom face burns away)
  AX.forEach(function(cx){
    h += L(cx, 58, cx, A_TOP, "var(--ink-2)", 4);
    h += R(cx - AW / 2, A_TOP, AW, A_BOT - shr - A_TOP, aFill, { rx:3 });
    h += T(cx, A_TOP + 18, "+", { fs:16, w:700, c:"var(--sheet)" });
  });
  // ions and bubbles
  if (o.liquid && o.phase != null) {
    var p = o.phase;
    [[110, 0], [216, 0.35], [308, 0.7], [398, 0.2]].forEach(function(a){ var f = (p + a[1]) % 1; h += ion(a[0], 212 + f * (poolTop - 222), "al"); });
    AX.forEach(function(cx, i){ var f = (p * 1.3 + i * 0.37) % 1, y0 = 252 - (ph ? 0 : 0); h += ion(cx + (i === 1 ? 22 : -20), y0 - f * (y0 - (A_BOT - shr) - 12), "o"); });
    AX.forEach(function(cx, i){
      [0, 0.5].forEach(function(k){ var f = (p * 2 + k + i * 0.21) % 1, x = cx + (k ? AW / 2 + 7 : -AW / 2 - 7), y = (A_BOT - shr) - f * ((A_BOT - shr) - BATH_TOP + 4); h += '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(3 + 2 * f) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>'; });
    });
    h += T(AX[2] + AW / 2 + 12, BATH_TOP - 10, inert ? "O₂" : "CO₂", { fs:13, w:700, a:"middle", halo:true });
  } else if (o.liquid && o.static) {
    h += ion(110, 226, "al") + arrowHead(110, 246, "down", "var(--ec-cat)") + ion(398, 226, "al") + arrowHead(398, 246, "down", "var(--ec-cat)");
    h += ion(AX[1] + 22, 236, "o") + arrowHead(AX[1] + 22, (A_BOT - shr) + 8, "up", "var(--at-o)") + ion(AX[0] - 20, 236, "o");
    h += '<circle cx="' + (AX[2] + AW / 2 + 8) + '" cy="168" r="4" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/><circle cx="' + (AX[2] + AW / 2 + 10) + '" cy="156" r="5" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>';
    h += T(AX[2] + AW / 2 + 12, BATH_TOP - 10, inert ? "O₂" : "CO₂", { fs:13, w:700, halo:true });
  }
  // labels
  h += T(160, 80, (inert ? "inert" : "carbon") + " anodes (+)", { fs:13, w:700, a:"end" });
  h += T(234, 290, "cathode (" + MINUS + "): carbon lining", { fs:13, w:700 });
  h += T(54, 160, o.liquid ? "molten" : "solid", { fs:12.5, w:700, a:"start", halo:true });
  h += T(54, 176, MV.num(o.temp, 0) + " °C", { fs:12, a:"start", halo:true });
  if (ph) h += T(56, poolTop + ph / 2 + (ph < 14 ? -14 : 0), "Al(l)", { fs:12.5, w:700, a:"start", halo:true });
  if (o.flag) h += R(AX[0] - 30, A_TOP - 32, 178, 22, "var(--sheet)", { rx:11, stroke:"var(--red)", sw:1.6 }) + T(AX[0] + 59, A_TOP - 21, "Replace anodes soon", { fs:12, w:700, c:"var(--red)" });
  return h;
}
function potAria(o){
  return "Cutaway of a Hall–Héroult pot. A steel shell with a carbon lining, the cathode (−), holds a " + (o.liquid ? "molten bath at " + o.temp + " °C" : "solid bath at " + o.temp + " °C: no current flows") +
    ". Three " + (o.anode === "inert" ? "inert" : "carbon") + " anode blocks (+) dip in from above" + (o.shrink > 0.05 ? ", their bottoms burned away by " + Math.round(o.shrink * 100) + "% of the way" : "") +
    ". " + (o.pool > 0.002 ? "A pool of liquid aluminium lies on the floor. " : "No aluminium yet. ") + (o.flag ? "A flag says: replace anodes soon." : "");
}
// beaker for "Why not water?" (viewBox 0 0 480 300)
function beakerSVG(o){
  var h = "", p = o.phase;
  h += R(380, 6, 92, 34, "var(--sheet)", { rx:6, stroke:"var(--ink-2)", sw:1.8 }) + T(426, 23, "DC supply", { fs:12.5, w:700 });
  h += L(396, 40, 396, 56, "var(--ink-2)", 3) + L(300, 56, 396, 56, "var(--ink-2)", 3) + L(300, 56, 300, 120, "var(--ink-2)", 3);
  h += L(456, 40, 456, 64, "var(--ink-2)", 3) + L(170, 64, 456, 64, "var(--ink-2)", 3) + L(170, 64, 170, 120, "var(--ink-2)", 3);
  h += R(110, 130, 250, 150, "var(--hi-soft)", { op:0.6 });
  h += '<path d="M104 110 V272 Q104 284 116 284 H354 Q366 284 366 272 V110" fill="none" stroke="var(--ink-2)" stroke-width="3"/>';
  h += R(160, 116, 20, 140, "var(--ink-2)", { rx:3 }) + R(290, 116, 20, 140, "var(--ink-2)", { rx:3 });
  h += T(170, 100, "cathode (" + MINUS + ")", { fs:12.5, w:700 }) + T(300, 100, "anode (+)", { fs:12.5, w:700 });
  h += T(235, 270, "Al₂(SO₄)₃(aq)", { fs:12.5, w:700, halo:true });
  var bub = function(x, lab, k){ var s = ""; for (var i = 0; i < 4; i++) { var f = p == null ? (i + 0.5) / 4 : (p * 2 + i / 4 + k) % 1, y = 240 - f * 104; s += '<circle cx="' + r1(x + (i % 2 ? 6 : -6)) + '" cy="' + r1(y) + '" r="' + r1(3 + 2 * f) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>'; } return s + T(x + (lab === "H₂" ? -36 : 36), 150, lab, { fs:13, w:700, halo:true }); };
  if (o.running || p == null) { h += bub(150, "H₂", 0) + bub(320, "O₂", 0.3); }
  // Al³⁺ wanders near the cathode but stays dissolved
  var jig = p == null ? 0 : Math.sin(p * Math.PI * 4) * 4;
  h += ion(214, 196 + jig, "al") + ion(240, 232 - jig, "al") + T(235, 168, "Al³⁺ stays dissolved", { fs:12, w:700, halo:true });
  h += T(40, 160, "2H₂O + 2e⁻", { fs:12, a:"start" }) + T(40, 176, "→ H₂ + 2OH⁻", { fs:12, a:"start" });
  return h;
}

// ---------- hero ----------
var HCAP = ["A carbon-lined steel pot (the cathode, −) holds the molten bath. Carbon blocks (the anodes, +) dip in from above.",
  "Al³⁺ ions drift down and become liquid aluminium. O²⁻ ions drift up to the blocks, which burn away as CO₂.",
  "About 300 000 A, day and night."];
function hero(){
  var svg = $("#hh-hx-svg"), cap = $("#hh-hx-cap"), rep = $("#hh-hx-replay"); if (!svg) return;
  var run = 0;
  function draw(st){ svg.innerHTML = potSVG({ liquid:true, temp:T_CRY, cry:true, pool:st.pool, shrink:st.shrink, anode:"carbon", phase:st.phase, static:st.phase == null }); }
  function play(){
    var id = ++run; rep.hidden = true; draw({ pool:0, shrink:0, phase:null }); cap.textContent = HCAP[0];
    MV.wait(1600, function(){
      if (id !== run) return; cap.textContent = HCAP[1];
      MV.tween({ dur:7000, ease:LIN, step:function(t){ if (id === run) draw({ pool:0.7 * t, shrink:0.55 * t, phase:(t * 5) % 1 }); }, done:function(){
        if (id !== run) return; draw({ pool:0.7, shrink:0.55, phase:null }); cap.textContent = HCAP[2]; rep.hidden = false;
      } });
    });
  }
  if (MV.reduceMotion) { draw({ pool:0.7, shrink:0.55, phase:null }); cap.textContent = HCAP[1] + " " + HCAP[2]; }
  else { rep.addEventListener("click", play); play(); }
}

// ---------- Explore: Aluminium smelter ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (["pot", "run", "water"].indexOf(S.mode) < 0) S.mode = "pot";
  S.cry = !!S.cry; S.temp = clamp(Math.round((+S.temp || 900) / 10) * 10, 900, 2100);
  S.I = clamp(Math.round((+S.I || 100) / 100) * 100, 100, 500); S.t = clamp(Math.round(+S.t || 24), 1, 24);
  S.eff = +S.eff === 90 ? 90 : 100; S.anode = S.anode === "inert" ? "inert" : "carbon";
  var clock = S.t, busy = false, tw = null, note = "", ban = { k:"", t:"" }, alShow = null, flagOn = false, loop = null;

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="hh-modes"></div><p class="banner hh-ban" aria-live="polite"></p>' +
    '<div class="hh-grid"><div class="hh-left"><div class="hh-box"><svg class="hh-svg" viewBox="0 0 480 300" role="img" aria-label=""></svg></div>' +
    '<p class="hh-cap" aria-live="polite"></p>' +
    '<div class="hh-tl"><button type="button" class="btn primary sm hh-go" data-k="hhgo">Run the day</button><label class="hh-scrub"><span class="hh-scrub-l">Timeline</span><input type="range" class="hh-clk" min="0" max="24" step="1" value="24" aria-label="Timeline: hours into the run"><output class="hh-clk-o"></output></label></div></div>' +
    '<div class="hh-right"><div class="hh-cpot"><div class="hh-cry"></div><div class="hh-temp"></div></div>' +
    '<div class="hh-crun"><div class="hh-sl"></div><div class="hh-eff"></div><div class="hh-an"></div></div>' +
    '<dl class="read hh-read" aria-live="polite"></dl><p class="tiny muted hh-model">' + C.model + "</p>" + MV.usesHTML(C.uses) + "</div></div>";
  var svg = $(".hh-svg", host), goBtn = $(".hh-go", host), clk = $(".hh-clk", host), clkO = $(".hh-clk-o", host);
  var modeRG = radios($(".hh-modes", host), { label:"Mode", aria:"Smelter mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; reset(); } });
  var cryRG = radios($(".hh-cry", host), { label:"Cryolite", aria:"Cryolite", options:[{ id:"on", t:"on" }, { id:"off", t:"off" }], value:S.cry ? "on" : "off", onChange:function(v){ S.cry = v === "on"; reset(); } });
  var tSl = MV.sliders($(".hh-temp", host), [{ id:"hhT", label:"Bath temperature", min:900, max:2100, step:10, value:S.temp, fmt:function(v){ return MV.num(v, 0) + " °C"; } }], function(id, v){ S.temp = v; reset(); });
  var sl = MV.sliders($(".hh-sl", host), [{ id:"hhI", label:"Current", min:100, max:500, step:100, value:S.I, fmt:function(v){ return v + " kA"; } },
    { id:"hhH", label:"Time", min:1, max:24, step:1, value:S.t, fmt:function(v){ return v + " h"; } }], function(id, v){ if (id === "hhI") S.I = v; else S.t = v; reset(); });
  var effRG = radios($(".hh-eff", host), { label:"Current efficiency", aria:"Current efficiency", options:[{ id:"100", t:"100%" }, { id:"90", t:"90%" }], value:String(S.eff), onChange:function(v){ S.eff = +v; reset(); } });
  var anRG = radios($(".hh-an", host), { label:"Anode", aria:"Anode type", options:[{ id:"carbon", t:"carbon" }, { id:"inert", t:"inert (research, gives off O₂)" }], value:S.anode, onChange:function(v){ S.anode = v; reset(); } });

  function lockAll(b){ [modeRG, cryRG, effRG, anRG].forEach(function(g){ g.lock(b); }); $$('input[type="range"]', host).forEach(function(x){ x.disabled = b; }); goBtn.disabled = b || S.mode === "pot"; }
  function frac(){ return S.t ? clamp(clock / S.t, 0, 1) : 1; }
  function shrinkOf(r, f){ return clamp((r.carbon * f) / 2.4e6, 0, 0.9); }
  function draw(phase){
    var r = model(S), f = frac();
    if (S.mode === "water") { svg.innerHTML = beakerSVG({ phase:MV.reduceMotion ? null : phase, running:phase != null }); svg.setAttribute("aria-label", "Schematic beaker of aqueous aluminium sulfate with two electrodes. Hydrogen bubbles form at the cathode (−) and oxygen at the anode (+). The Al³⁺ ions stay dissolved: no aluminium forms."); return; }
    var o = { liquid:r.liquid, temp:S.temp, cry:S.cry, pool:(r.mAl * f) / MAX_AL, shrink:shrinkOf(r, f), anode:S.anode, phase:(r.liquid && phase != null && !MV.reduceMotion) ? phase : null, static:r.liquid && r.I > 0 && phase == null && S.mode === "run", flag:flagOn || (S.anode === "carbon" && shrinkOf(r, f) >= 0.3) };
    if (alShow != null) o.pool = alShow / MAX_AL;
    svg.innerHTML = potSVG(o); svg.setAttribute("aria-label", potAria(o));
  }
  function bathTxt(){
    if (S.mode === "water") return "Aqueous Al₂(SO₄)₃ (schematic beaker)";
    var liq = liquidOf(S);
    if (S.cry) return liq ? "Liquid (" + MV.num(S.temp, 0) + " °C with cryolite)" : "<strong>Solid</strong> at " + MV.num(S.temp, 0) + " °C (with cryolite it melts at about " + T_CRY + " °C)";
    return liq ? "Liquid (" + MV.num(S.temp, 0) + " °C, alumina alone)" : "<strong>Solid</strong> at " + MV.num(S.temp, 0) + " °C (alumina alone melts at about " + MV.num(T_ALU, 0) + " °C)";
  }
  function paintRead(){
    var r = model(S), rows = [["Bath", bathTxt()], ["Current", r.I ? r.I + " kA" : "<strong>0</strong> (ions can’t move in a solid)"]];
    if (r.water) {
      rows.push(["Cathode reaction", CH("2H2O + 2e- -> H2 + 2OH-")], ["Anode reaction", CH("2H2O -> O2 + 4H+ + 4e-")], ["Charge", sci(r.Q) + " C"], ["Moles of electrons", sci(r.ne) + " mol"],
        ["Aluminium made", "<strong>0 t</strong> (H₂ forms)"], ["Hydrogen made", sci(r.h2) + " mol H₂"], ["Why", "Water (" + MV.num(E0_W, 2) + " V) is reduced before Al³⁺ (" + MV.num(E0_AL, 2) + " V)."]);
    } else {
      var al = alShow != null ? alShow : r.mAl;
      rows.push(["Cathode reaction", CH("Al^3+ + 3e- -> Al(l)")], ["Anode reaction", S.anode === "carbon" ? CH("C + 2O^2- -> CO2 + 4e-") : CH("2O^2- -> O2 + 4e-")],
        ["Charge", sci(r.Q) + " C"], ["Moles of electrons", sci(r.ne) + " mol"], ["Aluminium made", "<strong>" + tonnes(al) + "</strong>"],
        ["Carbon anode used", S.anode === "carbon" ? tonnes(r.carbon) : "0 t (inert anodes)"],
        ["Anode CO₂", S.anode === "carbon" ? tonnes(r.co2) : "0 t (O₂ released " + tonnes(r.o2) + ")"], ["Electrical energy", kwh(r.E) + " " + muted("(" + VOLT[S.anode].toFixed(1) + " V model)")]);
    }
    $(".hh-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var r = model(S), c;
    if (S.mode === "pot") c = r.liquid ? "The bath is liquid: ions can move, so current can flow." : "The bath is solid. " + (S.cry ? "Warm it to " + T_CRY + " °C." : "Alumina alone melts at about " + MV.num(T_ALU, 0) + " °C; cryolite lowers that.");
    else if (!r.liquid && S.mode === "run") c = "The bath is solid, so no current flows. Melt it in Inside the pot.";
    else c = "Clock: " + MV.num(clock, 0) + " h of " + S.t + " h";
    $(".hh-cap", host).innerHTML = c + (note ? " " + note : "");
    clkO.textContent = MV.num(Math.round(clock), 0) + " h of " + S.t + " h";
  }
  function paintBan(){ var b = $(".hh-ban", host); b.textContent = ban.t; b.className = "banner hh-ban" + (ban.k ? " " + ban.k : ""); }
  function setVis(){
    $(".hh-cpot", host).hidden = S.mode !== "pot";
    $(".hh-crun", host).hidden = S.mode === "pot";
    $(".hh-eff", host).hidden = $(".hh-an", host).hidden = S.mode === "water";
    $(".hh-tl", host).hidden = S.mode === "pot";
    clk.max = S.t; clk.value = Math.round(clock);
  }
  function paint(){ setVis(); draw(null); paintRead(); paintCap(); paintBan(); goBtn.disabled = busy || S.mode === "pot"; MV.changed(); }
  function stopLoop(){ if (tw) { tw(); tw = null; } if (loop) { cancelAnimationFrame(loop); loop = null; } }
  function reset(){ stopLoop(); busy = false; lockAll(false); clock = S.t; note = ""; ban = { k:"", t:"" }; alShow = null; flagOn = false; api.save(); paint(); }
  function runDay(cb, from){
    stopLoop();
    var r = model(S);
    if (S.mode === "run" && !r.liquid) { ban = { k:"bad", t:"Ions can’t move in a solid." }; paint(); if (cb) MV.wait(300, cb); return; }
    busy = true; lockAll(true); note = ""; clock = from || 0; paint();
    tw = MV.tween({ dur:3600, ease:LIN, step:function(t){ clock = (from || 0) + (S.t - (from || 0)) * t; clk.value = Math.round(clock); draw(t * 8 % 1); paintCap(); }, done:function(){
      tw = null; clock = S.t; busy = false; lockAll(false); paint(); if (cb) MV.wait(250, cb);
    } });
  }
  goBtn.addEventListener("click", function(){ if (!busy) { ban = { k:"", t:"" }; runDay(); } });
  clk.addEventListener("input", function(){ if (busy) return; clock = +clk.value; note = ""; draw(null); paintCap(); });

  // ---------- predictions ----------
  var hooks = {
    start:function(p){
      stopLoop(); busy = false; lockAll(false); note = ""; ban = { k:"", t:"" }; alShow = null; flagOn = false;
      if (p.id === "p4") { S.mode = "pot"; S.cry = false; S.temp = 960; }
      else { S.mode = "run"; S.cry = true; S.temp = Math.max(S.temp, T_CRY); if (!liquidOf(S)) S.temp = T_CRY; S.I = 300; S.t = 24; S.eff = 100; S.anode = "carbon"; }
      modeRG.set(S.mode); cryRG.set(S.cry ? "on" : "off"); tSl.set("hhT", S.temp); sl.set("hhI", S.I); sl.set("hhH", S.t); effRG.set(String(S.eff)); anRG.set(S.anode);
      clock = (p.id === "p1" || p.id === "p2") ? 0 : S.t; api.save(); paint();
    },
    run:function(p, done){
      if (p.id === "p1") { runDay(function(){ note = "The silver pool grows on the pot floor."; paintCap(); done(); }); return; }
      if (p.id === "p2") { runDay(function(){ flagOn = true; note = "The blocks burned away from the bottom: C + 2O²⁻ → CO₂ + 4e⁻."; paint(); done(); }); return; }
      if (p.id === "p3") {
        var a0 = model(S).mAl; S.I = 400; sl.set("hhI", 400); api.save(); var a1 = model(S).mAl;
        busy = true; lockAll(true); alShow = a0; paint();
        tw = MV.tween({ dur:1800, step:function(t){ alShow = a0 + (a1 - a0) * t; draw(t * 4 % 1); paintRead(); }, done:function(){
          tw = null; alShow = null; busy = false; lockAll(false); note = tonnes(a0) + " → " + tonnes(a1) + ": 400 ÷ 300 = 4/3."; paint(); MV.wait(200, done);
        } });
        return;
      }
      // p4: switch on a solid bath
      busy = true; lockAll(true); note = "Switching on…"; paintCap();
      tw = MV.tween({ dur:1400, step:function(){}, done:function(){
        tw = null; busy = false; lockAll(false); note = ""; ban = { k:"bad", t:"Ions can’t move in a solid." }; paint(); MV.wait(200, done);
      } });
    }
  };
  // ---------- challenges ----------
  function chal(id){
    var r = model(S);
    if (id === "tc2") {
      if (!S.cry) return { ok:false, msg:"Without cryolite you’d need about " + MV.num(T_ALU, 0) + " °C." };
      if (S.temp < T_CRY) return { ok:false, msg:"Still solid." };
      if (S.temp > T_CRY) return { ok:false, msg:"The pot runs at " + MV.num(S.temp, 0) + " °C, but that isn’t the lowest. Step down until it freezes." };
      return { ok:true };
    }
    if (S.mode === "water") return { ok:false, msg:"In water you get H₂, not aluminium. Switch to Run the cell." };
    if (!r.liquid) return { ok:false, msg:"The bath is solid, so no current flows. Melt it first in Inside the pot." };
    if (id === "tc1") {
      if (S.t !== 24) return { ok:false, msg:"One day is 24 h: set the time to 24 h." };
      if (S.eff !== 100) return { ok:false, msg:S.I === 300 ? tonnes(r.mAl) + " meets the target, but the challenge says 100%." : "The challenge says 100% efficiency." };
      if (S.I < 300) return { ok:false, msg:"That makes only " + tonnes(r.mAl) + "." };
      if (S.I > 300) return { ok:false, msg:"That works, but it isn’t the smallest current." };
      return { ok:true };
    }
    if (id === "tc3") {
      if (S.anode === "carbon") return { ok:false, msg:"Carbon anodes always release CO₂." };
      if (S.t !== 24) return { ok:false, msg:"Run a full day: set the time to 24 h." };
      if (r.E >= 40000) return { ok:false, msg:kwh(r.E) + ": over the limit." };
      if (r.mAl < 2e6) return { ok:false, msg:"Only " + tonnes(r.mAl) + "." };
      return { ok:true };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: The cost of aluminium ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, st3 = C.s3, s4 = C.s4;
  if (!CF[S.pw]) S.pw = "hydro"; S.rec = S.rec || { n:"", r:"", ok:false }; S.s3 = S.s3 || { b:"", c:"" };
  var rmsg = null;
  var dataRows = [["Electricity per kg of new aluminium", KWH_KG + " kWh"], ["Anode CO₂ per kg of aluminium (carbon anodes)", ANODE_KG.toFixed(1) + " kg"],
    ["CO₂ per kWh: hydro", CF.hydro + " kg"], ["CO₂ per kWh: natural gas", CF.gas + " kg"], ["CO₂ per kWh: coal", CF.coal.toFixed(1) + " kg"],
    ["Remelting scrap", Math.round(RECYC * 100) + "% of the energy of new aluminium (" + REMELT.toFixed(1) + " kWh/kg)"],
    ["Cell voltage", VOLT.carbon.toFixed(1) + " V (carbon anodes), " + VOLT.inert.toFixed(1) + " V (inert anodes)"],
    ["Bath melts at", "about " + T_CRY + " °C with cryolite; about " + MV.num(T_ALU, 0) + " °C alumina alone"]];
  host.innerHTML = '<div class="part hh-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="hh-pw"></div><div class="hh-bars" aria-live="polite"></div><dl class="read hh-p3read" aria-live="polite"></dl><p class="hh-pwfb" aria-live="polite"></p>' +
    '<details class="alg"><summary>Check it with data</summary>' + MV.tableHTML({ head:["Model factor", "Value"], rows:dataRows, caption:"Every model value used in this module (model values for learning; real smelters vary)" }) + "</details></div>" +
    '<div class="part hh-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="hh-rec"></div></div>' +
    '<div class="part hh-st"><h3>' + st3.title + '</h3><ul class="hh-facts">' + st3.facts.map(function(f){ return "<li>" + f + "</li>"; }).join("") + "</ul><p>" + st3.intro + "</p>" +
    '<div class="hh-notes"><div class="jq"><label for="hh-s3b">One benefit</label><textarea id="hh-s3b" data-s3="b"></textarea></div><div class="jq"><label for="hh-s3c">One challenge</label><textarea id="hh-s3c" data-s3="c"></textarea></div></div><p class="tiny muted hh-saved" aria-live="polite"></p></div>' +
    '<div class="part hh-st"><h3>' + s4.title + '</h3><ol class="hh-flow" aria-label="From bauxite to aluminium"><li><strong>Bauxite</strong><small>the ore, mined</small></li><li><strong>Alumina, Al₂O₃</strong><small>refined from bauxite; leaves alkaline “red mud”</small></li><li><strong>Hall–Héroult cell</strong><small>electrolysis in molten cryolite</small></li><li><strong>Aluminium</strong><small>tapped from the pot floor</small></li></ol><p>' + s4.text + "</p></div>";

  radios($(".hh-pw", host), { label:"Power source", aria:"Power source", cls:"chips", options:[{ id:"hydro", t:"hydro" }, { id:"gas", t:"natural gas" }, { id:"coal", t:"coal" }], value:S.pw, onChange:function(v){ S.pw = v; api.save(); paint1(); } });
  function paint1(){
    var max = KWH_KG * CF.coal + ANODE_KG;
    $(".hh-bars", host).innerHTML = '<p class="hh-leg"><span class="hh-sw hh-sw-e"></span> electricity <span class="hh-sw hh-sw-a"></span> anodes</p>' + ["hydro", "gas", "coal"].map(function(k){
      var e = KWH_KG * CF[k], tot = e + ANODE_KG, on = k === S.pw;
      return '<div class="hh-bar' + (on ? " on" : "") + '"><span class="hh-bl">' + PW_T[k] + '</span><span class="hh-bt"><span class="hh-be" style="width:' + r1(e / max * 100) + '%"></span><span class="hh-ba" style="width:' + r1(ANODE_KG / max * 100) + '%"></span></span><span class="hh-bv">' + s3(tot) + " kg</span></div>";
    }).join("");
    var e = KWH_KG * CF[S.pw], tot = e + ANODE_KG;
    $(".hh-p3read", host).innerHTML = MV.readoutHTML([["Electricity CO₂", KWH_KG + " × " + CF[S.pw] + " = " + s3(e) + " kg"], ["Anode CO₂", ANODE_KG.toFixed(1) + " kg"], ["Total per kg of aluminium", "<strong>" + s3(tot) + " kg CO₂</strong>"]]);
    $(".hh-pwfb", host).innerHTML = S.pw === "coal" ? "<strong>" + s1.coal + "</strong>" : S.pw === "gas" ? "On natural gas, the electricity still gives " + s3(e / ANODE_KG) + " times the anode CO₂." : "On hydro, the anodes are the bigger source: " + ANODE_KG.toFixed(1) + " kg vs " + s3(e) + " kg from electricity.";
  }
  // station 2
  var recBox = $(".hh-rec", host), NEW100 = KWH_KG * 100, REC100 = RECYC * KWH_KG * 100;
  function paint2(){
    var x = S.rec, h = '<div class="hh-recin"><div class="numrow"><label for="hh-rn">New aluminium, 100 kg:</label><input class="numin" id="hh-rn" data-rec="n" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.n) + '"' + (x.ok ? " disabled" : "") + '><span class="hh-unit">kWh</span></div>' +
      '<div class="numrow"><label for="hh-rr">Recycled, 100 kg:</label><input class="numin" id="hh-rr" data-rec="r" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.r) + '"' + (x.ok ? " disabled" : "") + '><span class="hh-unit">kWh</span></div></div>';
    if (!x.ok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-k="hhrec">Check</button></div>';
    if (x.ok) h += MV.fbHTML("good", "<strong>✓ Correct: " + MV.num(NEW100, 0) + " kWh new, " + MV.num(REC100, 0) + " kWh recycled.</strong> " + s2.why) +
      '<div class="hh-bar"><span class="hh-bl">new</span><span class="hh-bt"><span class="hh-be" style="width:100%"></span></span><span class="hh-bv">' + MV.num(NEW100, 0) + ' kWh</span></div><div class="hh-bar"><span class="hh-bl">recycled</span><span class="hh-bt"><span class="hh-be" style="width:' + (RECYC * 100) + '%"></span></span><span class="hh-bv">' + MV.num(REC100, 0) + " kWh</span></div>";
    else if (rmsg) h += MV.fbHTML(rmsg.k, rmsg.h);
    MV.keepFocus(recBox, function(){ recBox.innerHTML = h; });
  }
  recBox.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.rec; if (!k) return; S.rec[k] = e.target.value; api.save(); });
  recBox.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    var n = parseVal(S.rec.n), r = parseVal(S.rec.r), out = [];
    if (n == null || r == null) { rmsg = { k:"", h:"Enter a number in each box." }; paint2(); return; }
    if (!near(n, NEW100)) out.push(near(n, KWH_KG) ? "New: that’s for 1 kg; you need 100 kg." : "New: 12 kWh per kg × 100 kg.");
    if (!near(r, REC100)) out.push(near(r, NEW100 * 0.1) ? "Recycled: that’s 10%; use 5%." : near(r, KWH_KG * RECYC) ? "Recycled: that’s for 1 kg; you need 100 kg." : "Recycled: 5% of the energy for new aluminium.");
    if (out.length) rmsg = { k:"bad", h:"<strong>✗ Not quite.</strong> " + out.join(" ") + " Try again." }; else { S.rec.ok = true; rmsg = null; }
    api.save(); paint2(); MV.focusFb(recBox);
  });
  // station 3 notes
  $$("[data-s3]", host).forEach(function(ta){ ta.value = S.s3[ta.dataset.s3] || ""; ta.addEventListener("input", function(){ S.s3[ta.dataset.s3] = ta.value; api.save(); $(".hh-saved", host).textContent = "Saved in this browser."; }); });
  paint1(); paint2();
}

// ---------- number entry helpers (N4 with units) ----------
var SUPR = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "⁻":"-" };
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/[\s   ]+/g, "").replace(/−/g, "-").replace(/,(?=\d{3}\b)/g, "");
  s = s.replace(/[a-zA-Zµ]+$/, function(u){ return /^e$/i.test(u) ? u : ""; });
  if (!s) return null;
  if (/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(s)) return Number(s);
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function(m){ return "^" + m.split("").map(function(c){ return SUPR[c]; }).join(""); }).replace(/[xX*·]/g, "×");
  var v = MV.parseNum(s); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function near(v, w){ return Math.abs(v - w) <= Math.abs(w) * 0.01 + 1e-9; }

// ---------- Practice 2: Smelter calculations (custom; N4 number entry with units, 1% tolerance) ----------
function calcAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { vals:{}, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    it.parts.forEach(function(pt){
      var fid = "hc-" + it.id + "-" + pt.id;
      h += '<div class="numrow hh-numrow"><label for="' + fid + '">' + (pt.label ? pt.label + ":" : "Your answer:") + '</label><input class="numin" id="' + fid + '" data-cin="' + it.id + "|" + pt.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.vals[pt.id] || "") + '"' + (x.solved ? " disabled" : "") + '><span class="hh-unit">' + pt.unit + "</span></div>";
    });
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.parts.map(function(pt){ return pt.display; }).join("; ") + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].k, msgs[it.id].h);
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = MV.usesHTML(a.uses) + '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function judge(it, x){
    var fbs = [], allOk = true;
    for (var k = 0; k < it.parts.length; k++) {
      var pt = it.parts[k], v = parseVal(x.vals[pt.id]), ans = MV.ans(pt);
      if (v == null) return { bad:"Enter one number" + (it.parts.length > 1 ? " in each box" : "") + " (you can leave off the unit)." };
      if (near(v, ans)) continue;
      allOk = false;
      var w = (it.wrong || []).filter(function(z){ return (!z.part || z.part === pt.id) && near(v, z.match); })[0];
      if (w) fbs.push(w.fb);
      else if (near(v, ans * 1000) || near(v, ans / 1000)) fbs.push("Check the unit: give " + (pt.label ? "the " + pt.label.toLowerCase() : "your answer") + " in " + pt.unit + ".");
      else if (fbs.indexOf(it.fb) < 0) fbs.push((pt.label && it.parts.length > 1 ? pt.label + ": " : "") + it.fb);
    }
    return allOk ? { ok:true } : { fb:fbs.join(" ") };
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.cin; if (!k) return; var p = k.split("|"); ist(p[0]).vals[p[1]] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = host.querySelector('[data-k="' + e.target.dataset.cin.split("|")[0] + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { k:"", h:r.bad }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = { k:"bad", h:"<strong>✗ Not quite.</strong> " + r.fb + " Try again." }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Smelter plan ----------
var task = (function(){
  var S = null, api = null;
  var OPT = { anode:[["carbon", "carbon"], ["inert", "inert"]], pw:[["hydro", "hydro"], ["gas", "natural gas"], ["coal", "coal"]], I:[["200", "200 kA"], ["300", "300 kA"], ["400", "400 kA"]], scrap:[["0", "0 t"], ["0.5", "0.5 t"], ["1", "1.0 t"]] };
  var LAB = { anode:"Anode", pw:"Power source", I:"Current (24 h, 100% efficiency)", scrap:"Scrap remelted" };
  function read(){ var s = S || {}; return { anode:s.anode === "inert" ? "inert" : "carbon", pw:CF[s.pw] ? s.pw : "hydro", I:[200, 300, 400].indexOf(+s.I) >= 0 ? +s.I : 200, scrap:[0, 0.5, 1].indexOf(+s.scrap) >= 0 ? +s.scrap : 0 }; }
  // plan task model: 0.806 t per 100 kA per day; 96 or 120 kWh per kA; remelting 0.6 kWh/kg; anode CO₂ 1.22 × smelted (carbon)
  function calc(d){
    var sm = 0.806 * d.I / 100, cell = (d.anode === "carbon" ? 96 : 120) * d.I, rem = REMELT * d.scrap * 1000, E = cell + rem;
    var aCO2 = d.anode === "carbon" ? 1.22 * sm : 0, eCO2 = CF[d.pw] * E / 1000;
    return { sm:sm, al:sm + d.scrap, cell:cell, rem:rem, E:E, aCO2:aCO2, eCO2:eCO2, co2:aCO2 + eCO2 };
  }
  function gauge(label, v, lim, fmt, atLeast){
    var ok = atLeast ? v >= lim - 1e-9 : v <= lim + 1e-9, max = Math.max(lim * 1.6, v * 1.05), w = clamp(v / max * 100, 0, 100), lp = lim / max * 100;
    return '<div class="hh-g' + (ok ? " ok" : " no") + '"><div class="hh-gt"><span>' + label + "</span><strong>" + fmt(v) + " " + (ok ? "✓" : "✗") + '</strong></div><div class="hh-gb"><span class="hh-gf" style="width:' + r1(w) + '%"></span><span class="hh-gl" style="left:' + r1(lp) + '%"></span></div><p class="tiny muted">' + (atLeast ? "at least " : "at most ") + fmt(lim) + "</p></div>";
  }
  function paint(){
    var d = read(), c = calc(d);
    $("#hh-tkdash").innerHTML = gauge("Total aluminium", c.al, 2.00, function(v){ return v.toFixed(2) + " t"; }, true) +
      gauge("Total CO₂", c.co2, 3.00, function(v){ return v.toFixed(2) + " t"; }, false) +
      gauge("Total electricity", c.E, 40000, function(v){ return MV.num(Math.round(v), 0) + " kWh"; }, false);
    $("#hh-tkread").innerHTML = MV.readoutHTML([["Smelted", s3(c.sm) + " t + scrap " + d.scrap.toFixed(1) + " t"], ["Electricity", MV.num(c.cell, 0) + " kWh (cell) + " + MV.num(Math.round(c.rem), 0) + " kWh (remelting)"],
      ["CO₂", (d.anode === "carbon" ? s3(c.aCO2) + " t (anodes)" : "0 t (anodes)") + " + " + s3(c.eCO2) + " t (electricity, " + PW_T[d.pw] + ")"]]);
  }
  function keyOf(d){ return d.anode + "|" + d.pw + "|" + d.I + "|" + d.scrap; }
  function lab(k){ var p = k.split("|"); return (p[0] === "carbon" ? "Carbon" : "Inert") + " anodes, " + PW_T[p[1]] + ", " + p[2] + " kA, " + (+p[3]).toFixed(1) + " t scrap"; }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; var d = read(); S.anode = d.anode; S.pw = d.pw; S.I = d.I; S.scrap = d.scrap;
      inp.innerHTML = Object.keys(OPT).map(function(k){ return '<div class="hh-tkrow" data-tk="' + k + '"></div>'; }).join("");
      Object.keys(OPT).forEach(function(k){
        radios(inp.querySelector('[data-tk="' + k + '"]'), { label:LAB[k], aria:LAB[k], cls:"chips", options:OPT[k].map(function(o){ return { id:o[0], t:o[1] }; }), value:String(k === "scrap" && d.scrap === 1 ? "1" : d[k]),
          onChange:function(v){ S[k] = k === "anode" || k === "pw" ? v : +v; api.save(); paint(); api.update(); } });
      });
      pv.innerHTML = '<h4 class="hh-h4">Dashboard: one day</h4><div class="hh-dash" id="hh-tkdash" aria-live="polite"></div><dl class="read" id="hh-tkread"></dl><p class="tiny muted">Model values for learning; real smelters vary.</p>';
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var c = calc(d); return [c.al >= 2.00 - 1e-9, c.co2 <= 3.00 + 1e-9, c.E <= 40000 + 1e-9]; },
    tips:function(d, res){
      var Tp = MV.C.task.tips, out = [];
      function add(i){ if (out.indexOf(Tp[i]) < 0) out.push(Tp[i]); }
      if (!res[0]) add(0);
      if (!res[1]) { if (d.pw !== "hydro") add(1); if (d.anode === "carbon") add(2); if (!out.length) add(1); }
      if (!res[2]) add(3);
      return out;
    },
    key:keyOf, label:lab, text:lab
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
