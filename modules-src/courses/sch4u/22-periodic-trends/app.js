// SCH4U 22 Periodic Trends: hero (table outline with the two trend arrows; a Bohr-style atom steps across period 3,
// then down group 1), Trend heat map (Explore: C11 table coloured by radius / IE₁ / EN / electron affinity with Heat map,
// Explain an element, Compare two and Ion sizes modes, a C12 shell diagram, an IE₁ bar graph for periods 2 and 3, and a
// C13 "Atomic data" table), Successive IE (Part 3: magnesium's electrons stripped one at a time, four mystery elements,
// a K21-style bar chart with gap buttons) and "Ionic pair poster" (task with live readouts).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function esc(s){ return MV.esc(s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
var MINUS = "−", NBSP = " ";
var NARROW = window.matchMedia ? window.matchMedia("(max-width: 600px)") : { matches:false };
var ZE = "<em>Z</em><sub>eff</sub>";
function big(v){ var s = String(v); return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP) : s; }   // 11 577
function sup(n){ return "<sup>" + n + "</sup>"; }

// ---------- element list (Z 1–54): symbols, names and positions only (copied from SCH4U 16) ----------
var SYM = ("|H|He|Li|Be|B|C|N|O|F|Ne|Na|Mg|Al|Si|P|S|Cl|Ar|K|Ca|Sc|Ti|V|Cr|Mn|Fe|Co|Ni|Cu|Zn|Ga|Ge|As|Se|Br|Kr|" +
  "Rb|Sr|Y|Zr|Nb|Mo|Tc|Ru|Rh|Pd|Ag|Cd|In|Sn|Sb|Te|I|Xe").split("|");
var NAME = ("|hydrogen|helium|lithium|beryllium|boron|carbon|nitrogen|oxygen|fluorine|neon|sodium|magnesium|aluminium|silicon|" +
  "phosphorus|sulfur|chlorine|argon|potassium|calcium|scandium|titanium|vanadium|chromium|manganese|iron|cobalt|nickel|copper|" +
  "zinc|gallium|germanium|arsenic|selenium|bromine|krypton|rubidium|strontium|yttrium|zirconium|niobium|molybdenum|technetium|" +
  "ruthenium|rhodium|palladium|silver|cadmium|indium|tin|antimony|tellurium|iodine|xenon").split("|");
var ZOF = {}; SYM.forEach(function(s, z){ if (s) ZOF[s] = z; });
var PSTART = [0, 1, 3, 11, 19, 37, 55];
function period(z){ for (var p = 1; p < 5; p++) if (z < PSTART[p + 1]) return p; return 5; }
function group(z){
  var p = period(z), i = z - PSTART[p];
  if (p === 1) return z === 1 ? 1 : 18;
  if (p <= 3) return i < 2 ? i + 1 : i + 11;
  return i + 1;
}
function zAt(p, g){ for (var z = PSTART[p]; z < PSTART[p + 1]; z++) if (group(z) === g) return z; return 0; }
function isMain(z){ var g = group(z); return g <= 2 || g >= 13; }
var MAING = [1, 2, 13, 14, 15, 16, 17, 18];
function mainOf(p){ return MAING.map(function(g){ return zAt(p, g); }).filter(Boolean); }

// ---------- data ----------
// Course table additions (plan §6), kept local to this module; module 23 should reuse this set. Radii mix metallic (metals)
// and covalent (nonmetals) values from one consistent set, as the plan states.
var RAD = { Li:152, Be:112, B:87, C:77, N:75, O:73, F:72, Na:186, Mg:160, Al:143, Si:118, P:110, S:103, Cl:100, K:227, Rb:248,
  Ca:197 };   // VERIFY: Ca 197 pm is not in the plan; added so Ion sizes mode can draw calcium beside Ca²⁺.
var IE1 = { Li:520, Be:900, B:801, C:1086, N:1402, O:1314, F:1681, Ne:2081, Na:496, Mg:738, Al:578, Si:787, P:1012, S:1000, Cl:1251,
  Ar:1521, K:419, Rb:403, Ca:590 };
var EN = {}; Object.keys(MV.chem.data.EN).forEach(function(k){ EN[k] = MV.chem.data.EN[k]; });
EN.Be = 1.57;   // plan §6: Be electronegativity (course table addition; MV.chem.data.EN has no Be)
var IONS = { N:{ q:-3, r:146 }, O:{ q:-2, r:140 }, F:{ q:-1, r:133 }, Na:{ q:1, r:102 }, Mg:{ q:2, r:72 }, Al:{ q:3, r:54 },
  S:{ q:-2, r:184 }, Cl:{ q:-1, r:181 }, K:{ q:1, r:138 }, Ca:{ q:2, r:100 } };
var SUCC = { Na:[496, 4562], Mg:[738, 1451, 7733], Al:[578, 1817, 2745, 11577], Si:[787, 1577, 3232, 4356, 16091], Ca:[590, 1145, 4912], B:[801, 2427, 3660, 25026] };
var ISO_NE = ["N", "O", "F", "Na", "Mg", "Al"], ISO_AR = ["S", "Cl", "K", "Ca"];

// C13 "Atomic data" tabs, added to the course table registry at run time (this module's additions only)
(function(){
  var T = MV.chem.tables, rows = [];
  for (var z = 1; z <= 54; z++) { var s = SYM[z]; if (RAD[s] == null && IE1[s] == null && EN[s] == null) continue; rows.push([s + " (" + NAME[z] + ")", RAD[s] != null ? String(RAD[s]) : "—", IE1[s] != null ? big(IE1[s]) : "—", EN[s] != null ? EN[s].toFixed(2) : "—"]); }
  T.tr22atoms = { title:"Atomic data", head:["Element", "Atomic radius (pm)", "IE₁ (kJ/mol)", "Electronegativity"], rows:rows,
    note:"Radii and IE₁ are this module’s course table additions; electronegativities are the course table’s (Pauling), plus Be 1.57." };
  T.tr22ions = { title:"Ionic radii", head:["Ion", "Electrons", "Protons", "Radius (pm)"], rows:ISO_NE.concat(ISO_AR).map(function(s){ var I = IONS[s]; return [ionHTML(s, I.q), String(ZOF[s] - I.q), String(ZOF[s]), String(I.r)]; }) };
  T.tr22succ = { title:"Successive ionization energies (kJ/mol)", head:["Element", "IE₁, IE₂, …"], rows:Object.keys(SUCC).map(function(s){ return [s + " (" + NAME[ZOF[s]] + ")", SUCC[s].map(big).join(", ")]; }) };
})();

// ---------- configurations ----------
var SUBS = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p"].map(function(id){ var l = "spd".indexOf(id.charAt(1)); return { id:id, n:+id.charAt(0), cap:4 * l + 2 }; });
var CORES = [[2, "He", 1], [10, "Ne", 3], [18, "Ar", 5], [36, "Kr", 8]];
function occ(z){ var o = SUBS.map(function(){ return 0; }), left = z; for (var i = 0; i < SUBS.length && left > 0; i++) { o[i] = Math.min(SUBS[i].cap, left); left -= o[i]; } return o; }
function shells(z){ var o = occ(z), c = []; SUBS.forEach(function(s, i){ if (o[i]) c[s.n - 1] = (c[s.n - 1] || 0) + o[i]; }); return c; }   // electrons per shell, n = 1, 2, …
function nShells(z){ return shells(z).length; }
function valence(z){ var c = shells(z); return c[c.length - 1]; }
function coreE(z){ return z - valence(z); }
function zeff(z){ return z - coreE(z); }
function cfgHTML(z){
  var o = occ(z), core = null;
  CORES.forEach(function(c){ if (c[0] < z) core = c; });
  var h = core ? "[" + core[1] + "]" : "", from = core ? core[2] : 0;
  for (var i = from; i < SUBS.length; i++) if (o[i]) h += (h ? " " : "") + SUBS[i].id + sup(o[i]);
  return h;
}
function ionHTML(s, q){ if (!q) return s; var a = Math.abs(q); return s + sup((a > 1 ? a : "") + (q > 0 ? "+" : MINUS)); }
function ionTxt(s, q){ var a = Math.abs(q), S = { 1:"¹", 2:"²", 3:"³" }; return s + (a > 1 ? S[a] : "") + (q > 0 ? "⁺" : "⁻"); }

// ---------- properties ----------
var PROPS = {
  rad:{ t:"Atomic radius", lab:"atomic radius", unit:" pm", get:function(z){ return RAD[SYM[z]]; }, txt:function(v){ return String(v); } },
  ie:{ t:"First ionization energy", lab:"IE₁", unit:" kJ/mol", get:function(z){ return IE1[SYM[z]]; }, txt:function(v){ return String(v); } },
  en:{ t:"Electronegativity", lab:"electronegativity", unit:"", get:function(z){ return EN[SYM[z]]; }, txt:function(v){ return v.toFixed(2); } },
  ea:{ t:"Electron affinity", lab:"electron affinity", unit:"", get:function(z){ var g = group(z); return g === 18 ? null : EAQ[g]; }, txt:function(){ return ""; } }
};
// Electron affinity is qualitative only (plan §6.3): shading follows the general trend across a period (more energy released
// toward group 17), with no numbers and no exceptions; noble gases show no value.
var EAQ = { 1:0, 2:0, 13:1, 14:2, 15:2, 16:3, 17:4 };
var RANGE = {};
["rad", "ie", "en"].forEach(function(p){ var lo = 1e9, hi = -1e9; for (var z = 1; z <= 54; z++) { if (!isMain(z)) continue; var v = PROPS[p].get(z); if (v == null) continue; lo = Math.min(lo, v); hi = Math.max(hi, v); } RANGE[p] = [lo, hi]; });
function level(p, v){ if (p === "ea") return v; var r = RANGE[p]; return clamp(Math.floor((v - r[0]) / (r[1] - r[0]) * 5), 0, 4); }
function val(p, z){ return isMain(z) ? PROPS[p].get(z) : null; }
function fmtV(p, v){ return PROPS[p].txt(v) + PROPS[p].unit; }

// ---------- radio groups ----------
// @component radioGroup (from MHF4U 25, via SCH4U 01–16) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock). radios(host, {label, aria, options:[{id, t, aria}], value, cls:"seg"|"chips", onChange(id)}) -> {set, get, lock, paint}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, tab = on || (!any && first); first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (x.aria ? ' aria-label="' + esc(x.aria) + '"' : "") + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- C12 shell diagram ----------
// @component C12 shellDiagram — Bohr-style shell picture as an SVG string: nucleus with its "+Z" label, the core shells as one
// grey band (--ink-2) with faint rings, valence electrons as violet dots (--e-pair) on the outer ring. Options give an ion look:
// outline in --ec-cat (cation) or --ec-an (anion), extra electrons in the anion colour, an outer ring that fades (fade 0–1).
// shellG(cx, cy, {lab, n (occupied shells), dots, rOut, s (scale), dotCol, extra (dots in --ec-an), ring:"cat"|"an", fade, ghost})
function shellG(cx, cy, o){
  var s = o.s || 1, rN = 10 * s, n = o.n, rOut = Math.max(o.rOut, rN + 6 * s * n), h = "", k;
  var rr = function(i){ return rN + (rOut - rN) * i / n; };   // ring i = 1 … n
  if (o.ring) h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r1(rOut + 4 * s) + '" fill="var(' + (o.ring === "cat" ? "--ec-cat" : "--ec-an") + ')" fill-opacity=".16" stroke="var(' + (o.ring === "cat" ? "--ec-cat" : "--ec-an") + ')" stroke-width="' + r1(2 * s) + '"/>';
  if (n > 1) {
    var b0 = rN + 2 * s, b1 = rr(n - 1) + 3 * s;
    h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r1((b0 + b1) / 2) + '" fill="none" stroke="var(--ink-2)" stroke-opacity=".26" stroke-width="' + r1(b1 - b0) + '"/>';
    for (k = 1; k < n; k++) h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r1(rr(k)) + '" fill="none" stroke="var(--ink-2)" stroke-opacity=".7" stroke-width="' + r1(0.8 * s) + '"/>';
  }
  var op = o.fade == null ? 1 : o.fade;
  h += '<g opacity="' + r1(op * 100) / 100 + '"><circle cx="' + cx + '" cy="' + cy + '" r="' + r1(rOut) + '" fill="none" stroke="var(--ink-2)" stroke-width="' + r1(1.3 * s) + '"' + (o.ghost ? ' stroke-dasharray="3 3"' : "") + "/>";
  var tot = (o.dots || 0) + (o.extra || 0);
  for (k = 0; k < tot; k++) {
    var a = -Math.PI / 2 + 2 * Math.PI * k / Math.max(tot, 1);
    h += '<circle cx="' + r1(cx + rOut * Math.cos(a)) + '" cy="' + r1(cy + rOut * Math.sin(a)) + '" r="' + r1(3.4 * s) + '" fill="var(' + (k >= o.dots ? "--ec-an" : (o.dotCol || "--e-pair")) + ')"/>';
  }
  h += "</g>";
  h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r1(rN) + '" fill="var(--ink)"/><text x="' + cx + '" y="' + r1(cy + 0.5) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(8.5 * s) + '" font-weight="700" fill="var(--sheet)">' + o.lab + "</text>";
  return h;
}
// an atom (q = 0) or its common ion, drawn at k px per pm; returns the SVG string
function atomG(cx, cy, z, q, rPm, k, s, fade){
  var c = shells(z), n = c.length, v = c[n - 1];
  if (!q) return shellG(cx, cy, { lab:"+" + z, n:n, dots:v, rOut:rPm * k, s:s });
  if (q > 0) {   // main-group cations here lose the whole valence shell
    if (fade != null && fade < 1) return shellG(cx, cy, { lab:"+" + z, n:n, dots:v, rOut:rPm * k, s:s, fade:1 - fade, ring:"cat" });
    return shellG(cx, cy, { lab:"+" + z, n:n - 1, dots:c[n - 2], dotCol:"--ink-2", rOut:rPm * k, s:s, ring:"cat" });
  }
  return shellG(cx, cy, { lab:"+" + z, n:n, dots:v, extra:-q, rOut:rPm * k, s:s, ring:"an" });
}

// ---------- hero ----------
function hero(f){
  var svg = $("#tr-hx-svg"), ctr = $("#tr-hx-ctr"), rep = $("#tr-hx-replay"), cap = f.cap, run = 0;
  if (!svg) return;
  var TOP = (function(){
    var h = "", x0 = 152, y0 = 42, cw = 14.5, ch = 15;
    for (var p = 1; p <= 5; p++) for (var g = 1; g <= 18; g++) { var z = zAt(p, g); if (!z) continue; h += '<rect x="' + r1(x0 + (g - 1) * cw) + '" y="' + (y0 + (p - 1) * ch) + '" width="' + r1(cw - 1.5) + '" height="' + (ch - 1.5) + '" rx="1.5" fill="' + (isMain(z) ? "var(--hi-soft)" : "var(--sheet)") + '" stroke="var(--ink-2)" stroke-opacity=".55" stroke-width=".8"/>'; }
    var xr = x0 + 18 * cw;
    h += '<line x1="' + x0 + '" y1="32" x2="' + (xr - 8) + '" y2="32" stroke="var(--pen)" stroke-width="2.4"/><polygon points="' + xr + ',32 ' + (xr - 10) + ',27 ' + (xr - 10) + ',37" fill="var(--pen)"/>';
    h += '<text x="' + r1((x0 + xr) / 2) + '" y="17" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--pen)"><tspan font-style="italic">Z</tspan><tspan font-size="9" dy="3">eff</tspan><tspan dy="-3"> ↑: radius ↓, IE ↑, EN ↑</tspan></text>';
    h += '<line x1="140" y1="' + y0 + '" x2="140" y2="' + (y0 + 5 * ch - 8) + '" stroke="var(--p-k)" stroke-width="2.4"/><polygon points="140,' + (y0 + 5 * ch + 2) + " 135," + (y0 + 5 * ch - 8) + " 145," + (y0 + 5 * ch - 8) + '" fill="var(--p-k)"/>';
    h += '<text x="132" y="' + (y0 + 26) + '" text-anchor="end" font-size="12.5" font-weight="700" fill="var(--p-k)">shells ↑:</text><text x="132" y="' + (y0 + 44) + '" text-anchor="end" font-size="12.5" font-weight="700" fill="var(--p-k)">radius ↑, IE ↓, EN ↓</text>';
    return h + '<line x1="10" y1="132" x2="430" y2="132" stroke="var(--rule)" stroke-width="1"/>';
  })();
  var CY = 255, K = 0.4;
  function frame(st){
    var h = TOP;
    if (st.statics) {
      var k2 = 0.17, s2 = 0.62;
      [["Na", 52], ["Cl", 128]].forEach(function(a){ var z = ZOF[a[0]]; h += shellG(a[1], 238, { lab:"+" + z, n:3, dots:valence(z), rOut:RAD[a[0]] * k2, s:s2 }) + '<text x="' + a[1] + '" y="290" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">' + a[0] + "</text>"; });
      h += '<text x="90" y="160" text-anchor="middle" font-size="12" fill="var(--ink-2)">Across period 3</text><text x="90" y="312" text-anchor="middle" font-size="12" fill="var(--ink)"><tspan font-style="italic">Z</tspan><tspan font-size="9" dy="3">eff</tspan><tspan dy="-3">: 1 → 7</tspan></text>';
      [["Li", 236], ["Na", 304], ["K", 384]].forEach(function(a){ var z = ZOF[a[0]]; h += shellG(a[1], 238, { lab:"+" + z, n:nShells(z), dots:1, rOut:RAD[a[0]] * k2, s:s2 }) + '<text x="' + a[1] + '" y="' + (238 + RAD[a[0]] * k2 + 20) + '" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">' + a[0] + "</text>"; });
      h += '<text x="310" y="160" text-anchor="middle" font-size="12" fill="var(--ink-2)">Down group 1</text>';
      svg.innerHTML = h; return;
    }
    h += shellG(220, CY, { lab:"+" + st.z, n:st.n, dots:st.dots, rOut:st.r * K, s:1.1 });
    h += '<text x="220" y="' + (CY + st.r * K + 26) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">' + st.sym + "</text>";
    if (st.zl) h += '<text x="20" y="166" font-size="15" font-weight="700" fill="var(--ink)" opacity="' + r1(st.zl) + '"><tspan font-style="italic">Z</tspan><tspan font-size="11" dy="4">eff</tspan><tspan dy="-4">: 1 → 7</tspan></text>';
    if (st.lab) h += '<text x="420" y="166" text-anchor="end" font-size="13" fill="var(--ink-2)">' + st.lab + "</text>";
    svg.innerHTML = h;
  }
  var P3 = ["Na", "Mg", "Al", "Si", "P", "S", "Cl"], G1 = ["Li", "Na", "K"];
  function final(){ frame({ statics:true }); ctr.innerHTML = "Across: same shell, " + ZE + " 1 → 7, smaller. Down: one more shell each step, larger."; cap.textContent = "Two ideas: effective nuclear charge across, shells down."; rep.hidden = false; }
  function play(){
    var id = ++run; rep.hidden = true; cap.textContent = "";
    var i = 0;
    function across(){
      if (id !== run) return;
      if (i >= P3.length) { MV.tween({ dur:600, step:function(t){ if (id !== run) return; frame({ z:17, n:3, dots:7, r:100, sym:"Cl", zl:t, lab:"across period 3" }); }, done:function(){ if (id !== run) return; MV.wait(1100, function(){ i = 0; down(); }); } }); return; }
      var a = P3[i], b = P3[Math.max(0, i - 1)], za = ZOF[a], zb = ZOF[b];
      ctr.innerHTML = cap1(NAME[za]) + ": +" + za + " nucleus, " + ZE + " = " + za + " − 10 = " + zeff(za);
      MV.tween({ dur:i ? 520 : 1, step:function(t){ if (id !== run) return; frame({ z:za, n:3, dots:valence(za), r:RAD[b] + (RAD[a] - RAD[b]) * t, sym:a, lab:"across period 3" }); }, done:function(){ if (id !== run) return; i++; MV.wait(380, across); } });
    }
    function down(){
      if (id !== run) return;
      if (i >= G1.length) { MV.wait(900, function(){ if (id !== run) return; final(); }); return; }
      var a = G1[i], b = G1[Math.max(0, i - 1)], za = ZOF[a];
      ctr.innerHTML = cap1(NAME[za]) + ": " + nShells(za) + " shells, " + ZE + " = " + za + " − " + coreE(za) + " = 1";
      MV.tween({ dur:i ? 700 : 1, step:function(t){ if (id !== run) return; frame({ z:za, n:nShells(za), dots:1, r:RAD[b] + (RAD[a] - RAD[b]) * t, sym:a, lab:"down group 1" }); }, done:function(){ if (id !== run) return; i++; MV.wait(650, down); } });
    }
    across();
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Trend heat map ----------
// @component C11 trendTable — HTML periodic table, periods 1–5 (Z ≤ 54): main-group cells coloured on a 5-step sequential
// --pen scale with the value printed in the cell (colour never carries the value alone); d block greyed; "—" where the data
// set has no value; "?" cells under a prediction mask; selected element outlined, its period row and group column marked;
// roving-tabindex arrow keys (left/right by Z, up/down within a group); "Period view" shows one period's main groups as a strip.
var DIPS = { 5:"B: [He] 2s" + sup(2) + " 2p" + sup(1) + ". Its electron is in 2p, higher in energy than 2s, so IE₁ dips below Be’s (801 vs 900 kJ/mol).",
  8:"O: [He] 2s" + sup(2) + " 2p" + sup(4) + ". Its fourth 2p electron is paired, and repulsion makes it easier to remove (1314 vs N’s 1402 kJ/mol).",
  13:"Al: [Ne] 3s" + sup(2) + " 3p" + sup(1) + ". The same reason as B vs Be, one period down (578 vs Mg’s 738 kJ/mol).",
  16:"S: [Ne] 3s" + sup(2) + " 3p" + sup(4) + ". A paired 3p electron, the same reason as O vs N (1000 vs P’s 1012 kJ/mol)." };
function whyText(z){
  var p = period(z), g = group(z), e = zeff(z);
  if (z === 1) return "One electron in shell 1, with no core electrons shielding it.";
  if (z === 2) return "Two protons pull on two electrons in shell 1, with no shielding: the highest IE₁ of all.";
  if (g === 1) { var up = zAt(p - 1, 1); return "A new shell starts here: one valence electron (" + ZE + " = 1), " + (p > 2 ? "one shell farther out than " + SYM[up] + "’s" : "outside the 1s" + sup(2) + " core") + ": large radius, low IE."; }
  var a = SYM[zAt(p, 1)], d = e - 1;
  var t = "Same shell as " + a + ", but " + d + " more effective charge" + (d === 1 ? "" : "s") + " pulling: " + (g === 18 ? "the highest IE in its period." : d >= 4 ? "small radius, high IE." : "a smaller radius and higher IE than " + a + ".");
  if (DIPS[z]) t += " IE₁ still dips here: see the IE₁ graph.";
  return t;
}
function explore(host, api){
  var S = api.S, C = api.content;
  if (!PROPS[S.prop]) S.prop = "rad";
  if (["heat", "explain", "compare", "ion"].indexOf(S.mode) < 0) S.mode = "heat";
  S.a = +S.a >= 1 && +S.a <= 54 ? +S.a : 17;
  S.b = +S.b >= 1 && +S.b <= 54 ? +S.b : 0;
  S.slot = S.slot === "b" ? "b" : "a";
  S.tc3 = S.tc3 === "higher" || S.tc3 === "lower" ? S.tc3 : "";
  if (!Array.isArray(S.line)) S.line = [];
  S.pv = !!S.pv;
  var busy = false, run = 0, mask = null, shown = {}, note = "", gReveal = 99, gDip = true, gNote = 0, ionT = 1, fz = 0;

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="tr-top"><div class="tr-prop"></div><div class="tr-mode"></div></div>' +
    '<div class="tr-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="tr-tbox"><div class="tr-thead"><div class="tr-legend"></div><button type="button" class="btn ghost sm tr-pvb" data-k="trpv"></button></div>' +
    '<div class="tr-tscroll"><div class="tr-table"></div></div><p class="tiny muted tr-swipe">Swipe sideways to see the whole table, or use Period view.</p><div class="tr-trend" aria-live="polite"></div></div>' +
    '<div class="tr-note" aria-live="polite"></div><div class="tr-panel"></div><div class="tr-graph"></div></div><div class="tr-data"></div>';
  var tbl = $(".tr-table", host), panel = $(".tr-panel", host), gbox = $(".tr-graph", host);
  var RG = {
    prop:radios($(".tr-prop", host), { label:"Property", aria:"Property to colour the table by", options:C.props, value:S.prop, onChange:function(v){ S.prop = v; api.save(); paint(); } }),
    mode:radios($(".tr-mode", host), { label:"Mode", aria:"Mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; note = ""; api.save(); paint(); MV.changed(); } })
  };
  MV.chem.tablePanel($(".tr-data", host), "tr22atoms", { title:"Atomic data (radius, IE₁, electronegativity)" });
  MV.chem.tablePanel($(".tr-data", host), "tr22ions", { title:"Atomic data: ionic radii" });

  // ----- table -----
  function masked(z){ return mask && !shown[z] && isMain(z) && (mask.p ? period(z) === mask.p : group(z) === mask.g); }
  function cell(z){
    var p = S.prop, cls = "tr-el", v = null, txt = "", lab = cap1(NAME[z]) + ", " + SYM[z] + ", Z = " + z;
    if (!isMain(z)) { cls += " dblk"; lab += ", d block"; }
    else if (masked(z)) { cls += " mask"; txt = "?"; lab += ", hidden for the prediction"; }
    else {
      v = val(p, z);
      if (v == null) { cls += " nod"; txt = "—"; lab += ", no " + PROPS[p].lab + " in this data set"; }
      else { cls += " lv" + level(p, v); txt = PROPS[p].txt(v); lab += p === "ea" ? ", electron affinity shading " + (v + 1) + " of 5" : ", " + PROPS[p].lab + " " + fmtV(p, v); }
    }
    if (z === S.a) cls += " sel"; else if (S.mode === "compare" && z === S.b) cls += " selb";
    if (S.mode === "ion" && IONS[SYM[z]]) cls += " hasion";
    return '<button type="button" class="' + cls + '" data-z="' + z + '" tabindex="' + (z === fz ? 0 : -1) + '" aria-label="' + esc(lab) + '"' + (z === S.a ? ' aria-current="true"' : "") + (busy ? " disabled" : "") + '><span class="tr-sy">' + SYM[z] + '</span><span class="tr-v">' + txt + "</span></button>";
  }
  function paintTable(){
    var f = tbl.contains(document.activeElement), pv = S.pv, p0 = period(S.a), g0 = group(S.a), h;
    if (!fz || (!f)) fz = S.a;
    if (pv && !isMain(fz)) fz = mainOf(p0)[0];
    if (pv) {
      h = '<div class="tr-strip" role="group" aria-label="' + esc("Period " + p0 + ", main groups") + '">' + mainOf(p0).map(function(z){ return '<div class="tr-sc"><span class="tr-sg" aria-hidden="true">' + group(z) + "</span>" + cell(z) + "</div>"; }).join("") + "</div>";
      if (!mainOf(p0).some(function(z){ return z === fz; })) fz = mainOf(p0)[0];
    } else {
      h = '<div class="tr-pt" role="group" aria-label="Periodic table, periods 1 to 5"><div class="tr-row tr-hd" aria-hidden="true"><span></span>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(function(g){ return '<span class="' + (g === g0 ? "on" : "") + '">' + g + "</span>"; }).join("") + "</div>";
      for (var p = 1; p <= 5; p++) {
        h += '<div class="tr-row' + (p === p0 ? " prow" : "") + '"><span class="tr-pl" aria-hidden="true">' + p + "</span>";
        for (var g = 1; g <= 18; g++) { var z = zAt(p, g); h += z ? '<span class="tr-c' + (g === g0 ? " gcol" : "") + '">' + cell(z) + "</span>" : '<span class="tr-gap' + (g === g0 ? " gcol" : "") + '"></span>'; }
        h += "</div>";
      }
      h += "</div>";
    }
    tbl.innerHTML = h;
    var fb = tbl.querySelector('[data-z="' + fz + '"]'); if (fb) fb.tabIndex = 0;
    if (f && fb && !fb.disabled) fb.focus({ preventScroll:true });
    var pvb = $(".tr-pvb", host); pvb.textContent = pv ? "Whole table" : "Period view"; pvb.setAttribute("aria-pressed", String(pv));
    paintLegend(); paintTrend();
  }
  function paintLegend(){
    var p = S.prop, h = '<span class="rg-lab">' + PROPS[p].t + (PROPS[p].unit ? " (" + PROPS[p].unit.trim() + ")" : "") + "</span>";
    if (p === "ea") h += '<span class="tr-lg"><span class="tr-lgi">less energy released</span>' + [0, 1, 2, 3, 4].map(function(i){ return '<span class="tr-sw lv' + i + '"></span>'; }).join("") + '<span class="tr-lgi">more released (EA more negative)</span></span><span class="tr-lgi">General trend only; no numbers in this module.</span>';
    else {
      var r = RANGE[p], w = (r[1] - r[0]) / 5, dp = p === "en" ? 2 : 0;
      h += '<span class="tr-lg">' + [0, 1, 2, 3, 4].map(function(i){ return '<span class="tr-lgk"><span class="tr-sw lv' + i + '"></span>' + (r[0] + i * w).toFixed(dp) + "–" + (r[0] + (i + 1) * w).toFixed(dp) + "</span>"; }).join("") + "</span>";
    }
    h += '<span class="tr-lgi"><span class="tr-sw nod">—</span> no value in this data set</span>';
    $(".tr-legend", host).innerHTML = h;
  }
  function trendRun(list){
    var p = S.prop, v = list.map(function(z){ return [z, val(p, z)]; }).filter(function(x){ return x[1] != null && !masked(x[0]); });
    if (v.length < 2) return null;
    var a = v[0], b = v[v.length - 1];
    return { dir:b[1] > a[1] ? "increasing" : b[1] < a[1] ? "decreasing" : "level", from:a, to:b };
  }
  function paintTrend(){
    var p = S.prop, z = S.a, el = $(".tr-trend", host);
    if (!isMain(z)) { el.innerHTML = "<p>" + cap1(NAME[z]) + " is in the d block. This module’s trends cover the main groups only, and its data set has no values for the d block.</p>"; return; }
    var per = period(z), g = group(z), h = "";
    if (p === "ea") {
      h = '<p><strong>Period ' + per + ", across →:</strong> " + (g === 18 ? "noble gases don’t readily gain an electron." : "generally more energy released (more negative).") + "</p><p><strong>Group " + g + ", down ↓:</strong> no simple trend is shown in this module.</p>";
    } else {
      var a = trendRun(mainOf(per).filter(function(x){ return group(x) !== 18 || p === "ie"; })), d = trendRun([1, 2, 3, 4, 5].map(function(q){ return zAt(q, g); }).filter(Boolean));
      var u = PROPS[p].unit;
      h = '<p><strong>Period ' + per + ", across →:</strong> " + (a ? a.dir + " (" + SYM[a.from[0]] + " " + PROPS[p].txt(a.from[1]) + " → " + SYM[a.to[0]] + " " + PROPS[p].txt(a.to[1]) + u + ")" : "too few values in this data set.") + "</p>";
      h += '<p><strong>Group ' + g + ", down ↓:</strong> " + (d ? d.dir + " (" + SYM[d.from[0]] + " " + PROPS[p].txt(d.from[1]) + " → " + SYM[d.to[0]] + " " + PROPS[p].txt(d.to[1]) + u + ")" : "too few values in this data set.") + "</p>";
    }
    el.innerHTML = h;
  }
  tbl.addEventListener("click", function(e){ var b = e.target.closest("[data-z]"); if (!b || b.disabled || busy) return; fz = +b.dataset.z; pick(fz); });
  tbl.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-z]"); if (!b) return;
    var z = +b.dataset.z, t = 0, k;
    if (e.key === "ArrowRight") { for (k = z + 1; k <= 54; k++) if (tbl.querySelector('[data-z="' + k + '"]')) { t = k; break; } }
    else if (e.key === "ArrowLeft") { for (k = z - 1; k >= 1; k--) if (tbl.querySelector('[data-z="' + k + '"]')) { t = k; break; } }
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      var d = e.key === "ArrowUp" ? -1 : 1, g = group(z);
      for (var p = period(z) + d; p >= 1 && p <= 5; p += d) { var c = zAt(p, g); if (c && tbl.querySelector('[data-z="' + c + '"]')) { t = c; break; } }
    } else return;
    e.preventDefault();
    if (t) { $$("[data-z]", tbl).forEach(function(x){ x.tabIndex = -1; }); var n = tbl.querySelector('[data-z="' + t + '"]'); n.tabIndex = 0; n.focus(); fz = t; }
  });
  $(".tr-pvb", host).addEventListener("click", function(){ S.pv = !S.pv; api.save(); paintTable(); });
  function pick(z){
    note = "";
    if (S.mode === "compare") { if (S.slot === "a") { S.a = z; S.slot = "b"; } else { S.b = z; S.slot = "a"; } }
    else S.a = z;
    if (S.mode === "ion") ionT = 1;
    if (S.prop === "ie" && (period(z) === 2 || period(z) === 3)) gNote = isMain(z) ? z : 0;
    api.save(); paint(); MV.changed();
  }

  // ----- panels -----
  function valsRow(z){ var s = SYM[z]; return [RAD[s] != null ? RAD[s] + " pm" : "—", IE1[s] != null ? IE1[s] + " kJ/mol" : "—", EN[s] != null ? EN[s].toFixed(2) : "—"].join(" / "); }
  function explainHTML(){
    var z = S.a;
    if (!isMain(z)) return '<p class="muted">' + cap1(NAME[z]) + " is in the d block: Explain mode covers the main-group elements. Tap an element in groups 1, 2 or 13 to 18.</p>";
    var c = shells(z), n = c.length, ce = coreE(z), v = valence(z), s = SYM[z], rp = RAD[s], rOut = rp ? rp * 0.38 : 22 + 14 * n;
    var svg = '<svg class="tr-shsvg" viewBox="0 0 220 220" role="img" aria-label="' + esc(cap1(NAME[z]) + ": nucleus +" + z + ", " + ce + " core electrons in a grey band, " + v + " valence electrons on shell " + n + (rp ? ", radius " + rp + " pm" : "")) + '">' + shellG(110, 110, { lab:"+" + z, n:n, dots:v, rOut:Math.min(rOut, 100), s:1 }) + "</svg>";
    var coreTxt = ce ? ce + (s === "Ga" || s === "Ge" || s === "As" || s === "Se" || s === "Br" || s === "Kr" ? " ([Ar] + 3d" + sup(10) + ")" : z > 36 && z <= 54 && group(z) >= 13 ? " ([Kr] + 4d" + sup(10) + ")" : "") : "0";
    var rows = [["Element", NAME[z] + ", <em>Z</em> = " + z], ["Configuration", cfgHTML(z)], ["Core electrons", coreTxt], ["Valence electrons", String(v)],
      [ZE + " (simple model)", z + " − " + ce + " = " + (z - ce)], ["Occupied shells", String(n)], ["Radius / IE₁ / EN", valsRow(z)], ["Why", whyText(z)]];
    var tc = '<div class="tr-tc3"><p class="rg-lab">Prediction for challenge 3: IE₁ compared with the element directly above</p><div class="tr-tc3c"></div></div>';
    return '<div class="tr-exp"><figure class="tr-shfig">' + svg + '<figcaption class="tiny muted">Grey band: core electrons. Violet dots: valence electrons.' + (rp ? " Drawn to scale with the radius." : " No radius in the data set, so not to scale.") + "</figcaption></figure><div><dl class=\"read tr-read\">" + MV.readoutHTML(rows) + "</dl>" + tc + "</div></div>";
  }
  function compareHTML(){
    var a = S.a, b = S.b, nxt = '<p class="tr-slot">Next tap sets <strong>element ' + (S.slot === "a" ? 1 : 2) + "</strong>.</p>";
    function col(z, i){
      if (!z) return '<div class="tr-cc"><h4>Element ' + i + '</h4><p class="muted">Tap an element.</p></div>';
      var s = SYM[z];
      return '<div class="tr-cc' + (i === 1 ? " c1" : " c2") + '"><h4>Element ' + i + ": " + s + '</h4><dl class="read">' + MV.readoutHTML([["Name", NAME[z]], ["Period, group", period(z) + ", " + group(z)], ["Radius", RAD[s] != null ? RAD[s] + " pm" : "—"], ["IE₁", IE1[s] != null ? IE1[s] + " kJ/mol" : "—"], ["EN", EN[s] != null ? EN[s].toFixed(2) : "—"]]) + "</dl></div>";
    }
    var h = nxt + '<div class="tr-cmp">' + col(a, 1) + col(b, 2) + "</div>";
    if (a && b && a !== b) {
      var sa = SYM[a], sb = SYM[b], rows = [["Same group?", group(a) === group(b) ? "yes (group " + group(a) + ")" : "no"], ["Same period?", period(a) === period(b) ? "yes (period " + period(a) + ")" : "no"]];
      rows.push(["ΔEN", EN[sa] != null && EN[sb] != null ? "|" + EN[sa].toFixed(2) + " − " + EN[sb].toFixed(2) + "| = " + Math.abs(EN[sa] - EN[sb]).toFixed(2) : "— (no value for " + (EN[sa] == null ? sa : sb) + ")"]);
      h += '<dl class="read tr-cmpd" aria-live="polite">' + MV.readoutHTML(rows) + "</dl>";
    }
    return h;
  }
  var KI = 0.32, LINE_IONS = ["Na", "F", "Mg", "N", "O"];
  function ionPairSVG(z, t){
    var s = SYM[z], I = IONS[s], ra = RAD[s], rI = ra + (I.r - ra) * t;
    var h = '<svg class="tr-ionsvg" viewBox="0 0 340 190" role="img" aria-label="' + esc(cap1(NAME[z]) + " atom, " + ra + " pm, beside the " + ionTxt(s, I.q) + " ion, " + I.r + " pm, drawn to the same scale") + '">';
    h += atomG(90, 88, z, 0, ra, KI, 0.9);
    h += '<text x="90" y="182" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">' + s + " · " + ra + ' pm</text><text x="170" y="92" text-anchor="middle" font-size="20" fill="var(--ink-2)">→</text>';
    h += atomG(250, 88, z, I.q, rI, KI, 0.9, t);
    h += '<text x="250" y="182" text-anchor="middle" font-size="13" font-weight="700" fill="var(' + (I.q > 0 ? "--ec-cat" : "--ec-an") + ')">' + ionTxt(s, I.q) + " · " + Math.round(rI) + " pm</text></svg>";
    return h;
  }
  function isoSVG(list, label){
    var k = 0.21, x = 8, parts = [], H = 2 * 184 * k + 46;
    list.forEach(function(s){ var I = IONS[s], r = I.r * k; parts.push({ s:s, I:I, r:r, x:x + r }); x += 2 * r + 14; });
    var h = '<svg class="tr-isosvg" viewBox="0 0 ' + Math.round(x) + " " + Math.round(H) + '" role="img" aria-label="' + esc(label + ": " + list.map(function(s){ return ionTxt(s, IONS[s].q) + " " + IONS[s].r + " pm, " + ZOF[s] + " protons"; }).join("; ")) + '">';
    var cy = 184 * k + 4;
    parts.forEach(function(p){
      var col = p.I.q > 0 ? "--ec-cat" : "--ec-an";
      h += '<circle cx="' + r1(p.x) + '" cy="' + r1(cy) + '" r="' + r1(p.r) + '" fill="var(' + col + ')" fill-opacity=".18" stroke="var(' + col + ')" stroke-width="2"/>';
      h += '<text x="' + r1(p.x) + '" y="' + r1(cy) + '" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="var(--ink)">' + ionTxt(p.s, p.I.q) + "</text>";
      h += '<text x="' + r1(p.x) + '" y="' + r1(2 * cy + 12) + '" text-anchor="middle" font-size="10.5" fill="var(--ink)">' + p.I.r + ' pm</text><text x="' + r1(p.x) + '" y="' + r1(2 * cy + 26) + '" text-anchor="middle" font-size="10.5" fill="var(--ink-2)">' + ZOF[p.s] + " p⁺</text>";
    });
    return h + "</svg>";
  }
  function ionHTMLPanel(){
    var s = SYM[S.a], I = IONS[s], h = "";
    if (I) {
      var lost = I.q > 0;
      h += '<div class="tr-ionpair">' + ionPairSVG(S.a, ionT) + "</div><p class=\"tr-ionnote\">" + s + " " + RAD[s] + " pm → " + ionHTML(s, I.q) + " " + I.r + " pm: " +
        (lost ? "losing " + (I.q === 1 ? "its only " + nShells(S.a) + "s electron" : "its " + I.q + " valence electrons") + " removes the whole " + "<em>n</em> = " + nShells(S.a) + " shell." : "gaining " + (-I.q === 1 ? "an electron" : -I.q + " electrons") + " adds repulsion with the same " + S.a + " protons.") + "</p>";
    } else h += '<p class="muted">Choose N, O, F, Na, Mg, Al, S, Cl, K or Ca (marked with a dot): they have common ions in this data set.</p>';
    h += '<h4 class="tr-h4">Isoelectronic with Ne (10 electrons)</h4><div class="tr-iso">' + isoSVG(ISO_NE, "Isoelectronic with neon") + "</div>";
    h += '<h4 class="tr-h4">Isoelectronic with Ar (18 electrons)</h4><div class="tr-iso">' + isoSVG(ISO_AR, "Isoelectronic with argon") + "</div>";
    h += '<div class="tr-lineup"><h4 class="tr-h4">Line up, largest first</h4><p class="tiny muted">Tap the ions in order. Tap a placed ion to take it back.</p><div class="tr-lchips" role="group" aria-label="Ions to place">' +
      LINE_IONS.map(function(x){ var on = S.line.indexOf(x) >= 0; return '<button type="button" class="tr-chip' + (IONS[x].q > 0 ? " cat" : " an") + '" data-li="' + x + '" data-k="li' + x + '"' + (on || busy ? " disabled" : "") + ">" + ionHTML(x, IONS[x].q) + "</button>"; }).join("") + "</div>" +
      '<ol class="tr-line" aria-label="Your order, largest first">' + [0, 1, 2, 3, 4].map(function(i){ var x = S.line[i]; return "<li>" + (x ? '<button type="button" class="tr-chip' + (IONS[x].q > 0 ? " cat" : " an") + '" data-lo="' + i + '" data-k="lo' + i + '" aria-label="' + esc("Position " + (i + 1) + ": " + ionTxt(x, IONS[x].q) + ", tap to remove") + '">' + ionHTML(x, IONS[x].q) + "</button>" : '<span class="tr-slotx">' + (i + 1) + "</span>") + "</li>"; }).join("") + "</ol>" +
      '<button type="button" class="btn ghost sm" data-lclear="1" data-k="lclear"' + (S.line.length ? "" : " disabled") + ">Clear the line</button></div>";
    return h;
  }
  function heatHTML(){
    var z = S.a;
    if (!isMain(z)) return "<p>" + cap1(NAME[z]) + " (" + SYM[z] + ", <em>Z</em> = " + z + ") is a d-block element: no values in this module’s data set.</p>";
    return '<dl class="read tr-read1">' + MV.readoutHTML([["Selected", NAME[z] + " (" + SYM[z] + "), period " + period(z) + ", group " + group(z)], ["Radius / IE₁ / EN", valsRow(z)]]) + "</dl>";
  }
  var tc3RG = null;
  function paintPanel(){
    MV.keepFocus(panel, function(){
      tc3RG = null;
      panel.innerHTML = S.mode === "explain" ? explainHTML() : S.mode === "compare" ? compareHTML() : S.mode === "ion" ? ionHTMLPanel() : heatHTML();
      var t = $(".tr-tc3c", panel);
      if (t) tc3RG = radios(t, { aria:"IE₁ compared with the element directly above", cls:"chips", options:[{ id:"higher", t:"Higher" }, { id:"lower", t:"Lower" }], value:S.tc3, onChange:function(v){ S.tc3 = v; api.save(); MV.changed(); } });
      if (tc3RG && busy) tc3RG.lock(true);
    });
  }
  panel.addEventListener("click", function(e){
    if (busy) return;
    var b = e.target.closest("[data-li],[data-lo],[data-lclear]"); if (!b || b.disabled) return;
    if (b.dataset.li) { if (S.line.length < 5 && S.line.indexOf(b.dataset.li) < 0) S.line.push(b.dataset.li); }
    else if (b.dataset.lo != null) S.line.splice(+b.dataset.lo, 1);
    else S.line = [];
    api.save(); paintPanel(); MV.changed();
    var nx = panel.querySelector("[data-li]:not([disabled])") || panel.querySelector("[data-lo]"); if (nx && !panel.contains(document.activeElement)) nx.focus({ preventScroll:true });
  });

  // ----- IE₁ graph (periods 2 and 3) -----
  function paintGraph(){
    if (S.prop !== "ie" || S.mode === "ion" || S.mode === "compare") { gbox.innerHTML = ""; return; }
    var p = period(S.a); if (p !== 2 && p !== 3) p = 2;
    var zs = mainOf(p), max = 2200;
    var h = '<div class="tr-gwrap"><h4 class="tr-h4">IE₁ across period ' + p + ' (kJ/mol)</h4>' + (period(S.a) !== p ? '<p class="tiny muted">The graph is drawn for periods 2 and 3; select an element there to switch.</p>' : "") +
      '<div class="tr-bars" role="group" aria-label="' + esc("Bar graph of first ionization energy across period " + p + ". Tap a bar for the element’s configuration.") + '">';
    zs.forEach(function(z, i){
      var v = IE1[SYM[z]], on = i < gReveal, dip = on && gDip && DIPS[z];
      h += '<button type="button" class="tr-bar' + (dip ? " dip" : "") + (z === gNote ? " on" : "") + '" data-gz="' + z + '" data-k="gz' + z + '" aria-label="' + esc(cap1(NAME[z]) + ", IE₁ " + (on ? v + " kJ/mol" + (dip ? ", a dip" : "") : "not shown yet")) + '"' + (busy ? " disabled" : "") + ">" +
        '<span class="tr-bv">' + (on ? v : "") + "</span>" + (dip ? '<span class="tr-dip">dip</span>' : "") + '<span class="tr-bcol" style="height:' + (on ? r1(v / max * 100) : 0) + '%"></span><span class="tr-bs">' + SYM[z] + "</span></button>";
    });
    h += "</div>";
    var gz = gNote && zs.indexOf(gNote) >= 0 ? gNote : 0;
    if (gz && gReveal > 7) h += '<p class="tr-gnote">' + (DIPS[gz] || SYM[gz] + ": " + cfgHTML(gz) + ". IE₁ " + IE1[SYM[gz]] + " kJ/mol.") + "</p>";
    gbox.innerHTML = h + "</div>";
  }
  gbox.addEventListener("click", function(e){ var b = e.target.closest("[data-gz]"); if (!b || b.disabled || busy) return; gNote = +b.dataset.gz; paintGraph(); var nb = gbox.querySelector('[data-gz="' + gNote + '"]'); if (nb) nb.focus({ preventScroll:true }); });

  function paintNote(){ $(".tr-note", host).innerHTML = note ? '<p class="tr-notep">' + note + "</p>" : ""; }
  function paint(){ RG.prop.set(S.prop); RG.mode.set(S.mode); paintTable(); paintPanel(); paintGraph(); paintNote(); }
  if (NARROW.addEventListener) NARROW.addEventListener("change", paintTable);

  // ----- predictions -----
  function cancel(){ run++; busy = false; mask = null; shown = {}; gReveal = 99; gDip = true; ionT = 1; }
  function lock(b){ busy = b; RG.prop.lock(b); RG.mode.lock(b); paint(); }
  function setup(prop, mode, a){ cancel(); S.prop = prop; S.mode = mode; S.a = a; note = ""; api.save(); }
  function revealSeq(list, gap, cb){
    var my = run, i = 0;
    (function go(){ if (my !== run) return; if (i >= list.length) { cb(); return; } shown[list[i]] = true; i++; paintTable(); MV.wait(gap, go); })();
  }
  var hooks = {
    start:function(p){
      if (p.id === "p1") { setup("rad", "heat", 11); mask = { p:3 }; S.pv = false; }
      else if (p.id === "p2") { setup("ie", "heat", 11); mask = { g:1 }; S.pv = false; }
      else if (p.id === "p3") { setup("ie", "heat", 3); gReveal = 0; gDip = false; gNote = 0; }
      else { setup("rad", "ion", 11); ionT = 0; }
      lock(true);
    },
    run:function(p, done){
      var my = run;
      function fin(n){ if (my !== run) return; note = n; mask = null; shown = {}; busy = false; RG.prop.lock(false); RG.mode.lock(false); paint(); MV.changed(); MV.wait(150, done); }
      if (p.id === "p1") revealSeq(mainOf(3), 330, function(){ S.a = 11; fin("Period 3 shades steadily from Na, the largest (186 pm), to Cl (100 pm). Ar has no radius in this data set."); });
      else if (p.id === "p2") revealSeq([1, 3, 11, 19, 37], 420, function(){ S.a = 19; fin("K 419, Na 496 kJ/mol: IE₁ falls down group 1 (Li 520 → Rb 403)."); });
      else if (p.id === "p3") {
        (function grow(){ if (my !== run) return; if (gReveal >= 8) { MV.wait(300, function(){ if (my !== run) return; gDip = true; gNote = 5; paintGraph(); fin("Dips at B and O. Tap any bar to see that element’s configuration."); }); return; } gReveal++; paintGraph(); MV.wait(300, grow); })();
      } else {
        MV.tween({ dur:1500, step:function(t){ if (my !== run) return; ionT = t; var ip = $(".tr-ionpair", panel); if (ip) ip.innerHTML = ionPairSVG(11, t); }, done:function(){ if (my !== run) return; ionT = 1; fin("186 pm → 102 pm: the <em>n</em> = 3 ring vanishes with its only electron."); } });
      }
    }
  };

  // ----- challenges -----
  var NEAR = { "Cl|F":"Close, but not over 1.0.", "O|S":"Under 1.0.", "K|Li":"Group 1 values are close together." };
  function chal(id){
    if (id === "tc1") {
      var a = S.a, b = S.b;
      if (S.mode !== "compare") return { ok:false, msg:"Switch to Compare two and choose two elements." };
      if (!a || !b) return { ok:false, msg:"Choose two elements: the first tap sets element 1, the next sets element 2." };
      if (a === b) return { ok:false, msg:"Choose two different elements." };
      var sa = SYM[a], sb = SYM[b];
      if (EN[sa] == null || EN[sb] == null) return { ok:false, msg:(EN[sa] == null ? sa : sb) + " has no electronegativity in the course table." };
      if ((sa === "H" || sb === "H") && group(a) === group(b)) return { ok:false, msg:"Hydrogen sits above group 1 but isn’t an alkali metal. Choose two members of one family." };
      if (group(a) !== group(b)) return { ok:false, msg:"Same group only." };
      var d = Math.round(Math.abs(EN[sa] - EN[sb]) * 100) / 100, key = [sa, sb].sort().join("|");
      if (d > 1.0) return { ok:true };
      return { ok:false, msg:(NEAR[key] || "Under 1.0.") + " ΔEN = " + d.toFixed(2) + "." };
    }
    if (id === "tc2") {
      var L = S.line, want = ["N", "O", "F", "Na", "Mg"];
      if (L.length < 5) return { ok:false, msg:"Ion sizes mode: place all five ions in the line, largest first (" + L.length + " of 5 placed)." };
      if (L.every(function(x, i){ return x === want[i]; })) return { ok:true };
      if (L.every(function(x, i){ return x === want[4 - i]; })) return { ok:false, msg:"All five have 10 electrons. More protons pull them closer, so " + ionHTML("Mg", 2) + " (12 protons) is smallest." };
      if (IONS[L[0]].q > 0 && IONS[L[1]].q > 0) return { ok:false, msg:"Charge sign alone doesn’t decide; protons do." };
      return { ok:false, msg:"Count protons: 7, 8, 9, 11, 12. With the same 10 electrons, the fewer the protons, the larger the ion." };
    }
    if (id === "tc3") {
      var z = S.a;
      if (z === 16) { if (S.tc3 === "lower") return { ok:true }; if (S.tc3 === "higher") return { ok:false, msg:"Down a group the outer electrons are farther out, so IE₁ falls." }; return { ok:false, msg:"Sulfur is the element. Now predict in Explain an element: is its IE₁ higher or lower than oxygen’s?" }; }
      if (z === 8) return { ok:false, msg:"O has 2 shells." };
      if (z === 17) return { ok:false, msg:ZE + " for Cl is 7." };
      if (z === 6) return { ok:false, msg:ZE + " isn’t <em>Z</em>: subtract the core." };
      if (!isMain(z)) return { ok:false, msg:"Choose a main-group element." };
      return { ok:false, msg:cap1(NAME[z]) + ": " + ZE + " = " + z + " − " + coreE(z) + " = " + zeff(z) + ", with " + nShells(z) + " occupied shell" + (nShells(z) === 1 ? "" : "s") + "." };
    }
    return { ok:false };
  }

  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Successive IE ----------
// @component K21 ieBars — successive ionization energy bars (HTML) on a linear scale, with value labels and optional gap
// buttons between consecutive bars (tap where the jump is). ieBarsHTML(vals, {shown, gaps:bool, gapOn, idp, maxV, jumpAt})
function ieBarsHTML(v, o){
  var max = o.maxV || Math.max.apply(null, v), sh = o.shown == null ? v.length : o.shown, h = '<div class="tr-ieb">';
  v.forEach(function(x, i){
    if (i && o.gaps) h += '<button type="button" class="tr-gapb' + (o.gapOn === i ? " on" : "") + '" data-gap="' + i + '" data-k="' + o.idp + "g" + i + '" aria-label="' + esc("The jump is between IE" + i + " and IE" + (i + 1)) + '"' + (o.lock ? " disabled" : "") + '><span aria-hidden="true">⇕</span></button>';
    var on = i < sh;
    h += '<div class="tr-iec' + (o.jumpAt === i ? " core" : "") + '"><span class="tr-iev">' + (on ? big(x) : "") + '</span><span class="tr-iebar" style="height:' + (on ? Math.max(2, r1(x / max * 100)) : 0) + '%"></span><span class="tr-iel">IE' + "₁₂₃₄₅".charAt(i) + "</span></div>";
  });
  return h + "</div>";
}
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.k = clamp(Math.round(+S.k || 0), 0, 3);
  if (!S.m || typeof S.m !== "object") S.m = {};
  var busy = false, anim = null, msg = {};
  host.innerHTML = '<div class="tr-st1"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="tr-s1g"><svg class="tr-mgsvg" viewBox="0 0 200 200" role="img" aria-label=""></svg><div class="tr-s1b"></div></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-s1="go" data-k="s1go">Remove an electron</button><button type="button" class="btn ghost sm" data-s1="reset" data-k="s1rs">Start again</button></div><p class="tr-s1cap" aria-live="polite"></p>' +
    '<details class="alg"><summary>Check it with data</summary><p>' + s1.data + "</p></details></div>" +
    '<div class="part"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="tr-myst"></div></div>' +
    '<div class="part"><h3>' + s3.title + "</h3><p>" + s3.text + '</p><div class="tr-s3"></div></div><div class="tr-p3data"></div>';
  MV.chem.tablePanel($(".tr-p3data", host), "tr22succ", { title:"Atomic data: successive ionization energies" });
  // station 1: magnesium
  var MG = [738, 1451, 7733], svg = $(".tr-mgsvg", host);
  var CAPS = ["Magnesium: [Ne] 3s" + sup(2) + ". Press Remove an electron.", "IE₁ = 738 kJ/mol: the first 3s electron leaves.", "IE₂ = 1451 kJ/mol: the second 3s electron leaves. " + ionHTML("Mg", 2) + " has the neon core.", "IE₃ = 7733 kJ/mol: a core electron from <em>n</em> = 2, about 5 times IE₂. Its bar towers."];
  function mgSVG(k, t){   // k electrons gone; t = progress of electron k+1 leaving (0 = in place)
    var h = "", R = [30, 56, 84], cnt = [2, 8, 2], cx = 100, cy = 100;
    R.forEach(function(r){ h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--ink-2)" stroke-opacity=".6" stroke-width="1"/>'; });
    var order = [[2, 0], [2, 1], [1, 0]];
    for (var sh = 0; sh < 3; sh++) for (var i = 0; i < cnt[sh]; i++) {
      var gone = -1; order.forEach(function(o, j){ if (o[0] === sh && o[1] === i) gone = j; });
      if (gone >= 0 && gone < k) continue;
      var a = -Math.PI / 2 + 2 * Math.PI * i / cnt[sh], rr = R[sh], op = 1;
      if (gone === k && t > 0) { rr = R[sh] + t * 120; op = 1 - t; }
      h += '<circle cx="' + r1(cx + rr * Math.cos(a)) + '" cy="' + r1(cy + rr * Math.sin(a)) + '" r="5" fill="var(' + (sh === 2 ? "--e-pair" : "--ink-2") + ')" opacity="' + r1(op * 10) / 10 + '"/>';
    }
    h += '<circle cx="100" cy="100" r="13" fill="var(--ink)"/><text x="100" y="100.5" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="var(--sheet)">+12</text>';
    svg.innerHTML = h;
    svg.setAttribute("aria-label", "Magnesium shells: nucleus +12, 2 electrons in n = 1, " + (k >= 3 ? 7 : 8) + " in n = 2, " + Math.max(0, 2 - k) + " violet 3s electrons in n = 3.");
  }
  function paint1(){
    mgSVG(S.k, 0);
    $(".tr-s1b", host).innerHTML = ieBarsHTML(MG, { shown:S.k, maxV:8000, jumpAt:S.k >= 3 ? 2 : -1 });
    $(".tr-s1cap", host).innerHTML = CAPS[S.k];
    $('[data-s1="go"]', host).disabled = busy || S.k >= 3; $('[data-s1="reset"]', host).disabled = busy || S.k === 0;
  }
  $(".tr-st1", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-s1]"); if (!b || b.disabled || busy) return;
    if (b.dataset.s1 === "reset") { S.k = 0; api.save(); paint1(); return; }
    busy = true; paint1(); var k = S.k;
    var leave = function(){ anim = MV.tween({ dur:k === 2 ? 1100 : 650, step:function(t){ mgSVG(k, k === 2 ? Math.max(0, (t - 0.35) / 0.65) : t); }, done:function(){ anim = null; S.k = k + 1; busy = false; api.save(); paint1(); var g = $('[data-s1="go"]', host); if (g.disabled) $('[data-s1="reset"]', host).focus({ preventScroll:true }); } }); };
    if (k === 2 && !MV.reduceMotion) {   // the core electron resists: a short shake before it goes
      var t0 = 0; anim = MV.tween({ dur:420, step:function(t){ t0 = t; svg.style.transform = "translateX(" + r1(Math.sin(t * Math.PI * 6) * 2.5) + "px)"; }, done:function(){ svg.style.transform = ""; leave(); } });
    } else leave();
  });
  paint1();
  // station 2: mystery elements
  var myst = $(".tr-myst", host);
  function grpOf(nv){ return nv <= 2 ? nv : 10 + nv; }
  function paint2(){
    MV.keepFocus(myst, function(){
      myst.innerHTML = s2.items.map(function(it){
        var st = S.m[it.id] || {}, ans = MV.ans(it), h = '<div class="tr-mcard" data-my="' + it.id + '"><h4>Element ' + it.id + '</h4><p class="tiny muted">' + it.ies.map(big).join(", ") + " kJ/mol</p>";
        h += ieBarsHTML(it.ies, { gaps:!st.gap, gapOn:st.gap ? ans : st.pick, idp:"m" + it.id, jumpAt:st.gap ? ans : -1 });
        if (st.gap) h += '<div class="tr-mgrp"><p class="rg-lab">Which group?</p><div class="tr-mchips" role="group" aria-label="' + esc("Group of element " + it.id) + '">' + s2.groups.map(function(g){ return '<button type="button" class="tr-chip' + (st.grp && g === grpOf(ans) ? " ok" : "") + '" data-grp="' + g + '" data-k="m' + it.id + "r" + g + '"' + (st.grp ? " disabled" : "") + ">Group " + g + "</button>"; }).join("") + "</div></div>";
        if (msg[it.id]) h += msg[it.id];
        else if (st.grp) h += MV.fbHTML("good", "<strong>✓ Group " + grpOf(ans) + ".</strong> " + ans + " valence electron" + (ans === 1 ? "" : "s") + " before the jump: element " + it.id + " is " + NAME[ZOF[it.el]] + " (" + it.el + ").");
        return h + "</div>";
      }).join("");
    });
  }
  myst.addEventListener("click", function(e){
    var b = e.target.closest("[data-gap],[data-grp]"); if (!b || b.disabled) return;
    var card = b.closest("[data-my]"), it = s2.items.filter(function(x){ return x.id === card.dataset.my; })[0], st = S.m[it.id] || (S.m[it.id] = {}), ans = MV.ans(it);
    if (b.dataset.gap) {
      var g = +b.dataset.gap; st.pick = g;
      if (g === ans) { st.gap = true; msg[it.id] = MV.fbHTML("good", "<strong>✓ The jump comes after electron " + g + ".</strong> " + big(it.ies[g - 1]) + " → " + big(it.ies[g]) + " kJ/mol: the " + (g + 1) + (g + 1 === 2 ? "nd" : g + 1 === 3 ? "rd" : "th") + " electron comes from the core. Now pick the group."); }
      else msg[it.id] = MV.fbHTML("bad", "<strong>✗ Not the jump.</strong> That step is only ×" + (it.ies[g] / it.ies[g - 1]).toFixed(1) + ". Look for the biggest <em>jump</em> between consecutive values. The electrons before the jump are the valence electrons.");
    } else {
      var gr = +b.dataset.grp;
      if (gr === grpOf(ans)) { st.grp = true; msg[it.id] = ""; }
      else msg[it.id] = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + ans + " valence electron" + (ans === 1 ? "" : "s") + ": " + (ans <= 2 ? "in the s block, the group number equals the valence electrons." : "in the p block, the group is 10 + the valence electrons."));
    }
    api.save(); paint2(); MV.focusFb(myst.querySelector('[data-my="' + it.id + '"]'));
  });
  paint2();
  // station 3: aluminium's first three IEs (no jump, still rising)
  $(".tr-s3", host).innerHTML = '<div class="tr-s3row"><div>' + ieBarsHTML(SUCC.Al.slice(0, 3), { maxV:3000 }) + '</div><p class="tiny">Aluminium’s three valence electrons: 578 → 1817 → 2745 kJ/mol. Each removal leaves 13 protons pulling on fewer electrons.</p></div>';
}

// ---------- Performance task: Ionic pair poster ----------
var CARDS = ["Li", "B", "C", "N", "O", "F", "Na", "Mg", "Al", "Si", "P", "S", "Cl"];
var task = (function(){
  var S = null, api = null, T = null;
  function read(){ return { x:S && CARDS.indexOf(S.x) >= 0 ? S.x : "", y:S && CARDS.indexOf(S.y) >= 0 ? S.y : "" }; }
  function dEN(d){ return Math.round(Math.abs(EN[d.x] - EN[d.y]) * 100) / 100; }
  function paint(){
    var d = read(), pv = $("#tr-tkpv"); if (!pv) return;
    function col(s, lab){
      if (!s) return '<div class="tr-tkc"><h4>' + lab + '</h4><p class="muted">Choose a card.</p></div>';
      return '<div class="tr-tkc"><h4>' + lab + ": " + s + '</h4><dl class="read">' + MV.readoutHTML([["Period", String(period(ZOF[s]))], ["Radius", RAD[s] + " pm"], ["IE₁", IE1[s] + " kJ/mol"], ["EN", EN[s].toFixed(2)]]) + "</dl></div>";
    }
    pv.innerHTML = '<div class="tr-tkcols">' + col(d.x, "X") + col(d.y, "Y") + "</div>" + (d.x && d.y ? '<p class="tr-tkd">ΔEN = |' + EN[d.x].toFixed(2) + " − " + EN[d.y].toFixed(2) + "| = <strong>" + dEN(d).toFixed(2) + "</strong></p>" : "");
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      if (CARDS.indexOf(S.x) < 0) S.x = ""; if (CARDS.indexOf(S.y) < 0) S.y = "";
      inp.innerHTML = '<div class="tr-tq"><p class="rg-lab">' + T.qX + '</p><div class="tr-tx"></div></div><div class="tr-tq"><p class="rg-lab">' + T.qY + '</p><div class="tr-ty"></div></div>';
      var opts = CARDS.map(function(s){ return { id:s, t:s, aria:cap1(NAME[ZOF[s]]) }; });
      radios($(".tr-tx", inp), { aria:"Element X", cls:"chips", options:opts, value:S.x, onChange:function(v){ S.x = v; api.save(); paint(); api.update(); } });
      radios($(".tr-ty", inp), { aria:"Element Y", cls:"chips", options:opts, value:S.y, onChange:function(v){ S.y = v; api.save(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="tr-h4">Live readouts</h4><div id="tr-tkpv" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ if (!d.x || !d.y) return "Choose X and Y first."; if (d.x === d.y) return "Choose two different elements."; return true; },
    checks:function(d){
      if (!d.x || !d.y || d.x === d.y) return [false, false, false, false];
      var zx = ZOF[d.x], zy = ZOF[d.y];
      return [period(zx) === period(zy), RAD[d.x] > RAD[d.y], IE1[d.y] > IE1[d.x], dEN(d) > 1.7];
    },
    key:function(d){ return d.x + "|" + d.y; },
    label:function(k){ var p = k.split("|"); return "(" + p[0] + ", " + p[1] + ")"; },
    text:function(k){ var p = k.split("|"); return "(" + p[0] + ", " + p[1] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  task:task
});
})();
