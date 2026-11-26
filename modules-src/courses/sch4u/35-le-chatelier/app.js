// SCH4U 35 Le Chatelier's Principle: hero (a cobalt chloride tube beside a balance scale and a K dial: chloride tips the
// scale and turns it blue, ice turns it pink and turns K down), Stress tester (Explore: C8 equilibrium simulator with three
// systems, stress buttons, a concentration–time graph, a Q/K meter, the S2 colour swatch, a readout and a stress log; One
// stress / Sequence / Predict first modes), Industry and the body (Part 3: ammonia trade-off sliders with a "Check it with
// data" table, oxygen at altitude, a soda bottle), Predict the shift (custom chips), Graph detective (custom: C8 mini graphs,
// chips, number entry) and "Run the ammonia plant" (task with a live points preview).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function esc(s){ return MV.esc(s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
var KI = "<em>K</em>", QI = "<em>Q</em>";

// ---------- @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock while animating). radios(host, {label, aria, cls, options:[{id, t, aria}], value, disabled(id), onChange}) -> {set, get, lock, paint}
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

// ---------- @component C8 equilibrium model — three systems at equilibrium; stresses replayed deterministically from a log.
// Each stress: concentrations jump (addition, removal, volume), K follows the van ’t Hoff form for temperature changes, and the
// new equilibrium is found by bisection on the reaction extent (Q = K). Model values throughout (labelled on the page).
var RGAS = MV.chem.data["const"].R;                          // 8.314 J/(mol·K), course table
function dHf(sp){ var r = MV.chem.data.dHf.filter(function(x){ return x[0] === sp; })[0]; return r ? r[1] : 0; }
var T0 = 25, TMIN = 5, TMAX = 65, LOGMAX = 10;
var CL_STEP = 0.60;                                            // model: Cl⁻ added (as NaCl) or removed (by Ag⁺) per press, mol/L
var SYS = {
  s1:{ id:"s1", label:"S1: ammonia", eq:"N₂(g) + 3H₂(g) ⇌ 2NH₃(g)", short:"N₂ + 3H₂ ⇌ 2NH₃", kind:"exothermic",
    dH:2 * dHf("NH3(g)"),                                      // −91.8 kJ from the course table (2 × −45.9)
    gas:true, temp:true, panels:[[0, 1, 2]],
    sp:[{ f:"N₂", nu:-1, c:0.50, add:0.50, dash:"" }, { f:"H₂", nu:-3, c:1.50, add:0.50, dash:"7 5" }, { f:"NH₃", nu:2, c:1.00, add:0.50, dash:"" }] },
  s2:{ id:"s2", label:"S2: cobalt chloride", eq:"[Co(H₂O)₆]²⁺(aq) + 4Cl⁻(aq) ⇌ [CoCl₄]²⁻(aq) + 6H₂O(l)", short:"[Co(H₂O)₆]²⁺ + 4Cl⁻ ⇌ [CoCl₄]²⁻ + 6H₂O", kind:"endothermic",
    dH:80,                                                     // model value only (the plan gives the sign, ΔH > 0); never shown to students
    gas:false, temp:true, panels:[[0, 2], [1]], panelNames:["cobalt complexes", "chloride"],
    sp:[{ f:"[Co(H₂O)₆]²⁺", nu:-1, c:0.070, dash:"" }, { f:"Cl⁻", nu:-4, c:1.50, dash:"7 5" }, { f:"[CoCl₄]²⁻", nu:1, c:0.030, dash:"" }] },
  s3:{ id:"s3", label:"S3: hydrogen iodide", eq:"H₂(g) + I₂(g) ⇌ 2HI(g)", short:"H₂ + I₂ ⇌ 2HI", kind:"equal gas moles",
    dH:0, gas:true, temp:false, panels:[[0, 1, 2]],
    sp:[{ f:"H₂", nu:-1, c:0.50, add:0.50, dash:"" }, { f:"I₂", nu:-1, c:0.50, add:0.50, dash:"7 5" }, { f:"HI", nu:2, c:1.50, add:0.50, dash:"" }] }
};
var SYS_IDS = ["s1", "s2", "s3"];
function lnQ(s, c){ var t = 0; s.sp.forEach(function(x, i){ t += x.nu * Math.log(c[i]); }); return t; }
function lnKof(s, T, lnK0){ return lnK0 - s.dH * 1000 / RGAS * (1 / (T + 273.15) - 1 / (T0 + 273.15)); }
function solve(s, c, lnK){
  var lo = -1e9, hi = 1e9;
  s.sp.forEach(function(x, i){ if (x.nu > 0) lo = Math.max(lo, -c[i] / x.nu); else hi = Math.min(hi, c[i] / -x.nu); });
  var span = hi - lo, a = lo + span * 1e-12, b = hi - span * 1e-12;
  function at(x){ return c.map(function(v, i){ return v + s.sp[i].nu * x; }); }
  if (Math.abs(lnQ(s, c) - lnK) < 1e-12) return c.slice();
  for (var k = 0; k < 200; k++) { var m = (a + b) / 2; if (lnQ(s, at(m)) < lnK) a = m; else b = m; }
  return at((a + b) / 2);
}
// time to reach equilibrium (model minutes): faster when hotter (× 1.4 per 10 °C) and with a catalyst (× 0.4)
function teqOf(T, cat){ return clamp(6 / Math.pow(1.4, (T - T0) / 10) * (cat ? 0.4 : 1), 1, 9.5); }
function replay(sysId, log){
  var s = SYS[sysId], c = s.sp.map(function(x){ return x.c; }), c0 = c.slice(), lnK0 = lnQ(s, c), T = T0, cat = false, segs = [];
  log.forEach(function(ev){
    var jump = c.slice(), T1 = T, cat1 = cat;
    if (ev.t === "add") jump[ev.i] += s.sp[ev.i].add;
    else if (ev.t === "rem") jump[ev.i] *= 0.5;
    else if (ev.t === "vol") jump = jump.map(function(v){ return v / ev.f; });
    else if (ev.t === "T") T1 = T + ev.d;
    else if (ev.t === "cat") cat1 = true;
    else if (ev.t === "cl") jump[1] += CL_STEP;
    else if (ev.t === "ag") jump[1] -= Math.min(CL_STEP, 0.8 * jump[1]);
    var lnKb = lnKof(s, T, lnK0), lnKa = lnKof(s, T1, lnK0), lnQj = lnQ(s, jump), after = solve(s, jump, lnKa);
    segs.push({ ev:ev, before:c.slice(), jump:jump, after:after, lnKb:lnKb, lnKa:lnKa, lnQj:lnQj, Tb:T, Ta:T1, tb:teqOf(T, cat), ta:teqOf(T1, cat1), cat:cat1 });
    c = after; T = T1; cat = cat1;
  });
  return { s:s, c0:c0, c:c, T:T, cat:cat, lnK0:lnK0, lnK:lnKof(s, T, lnK0), segs:segs };
}
function shiftOf(seg){ var d = seg.lnQj - seg.lnKa; return Math.abs(d) < 1e-9 ? "none" : d < 0 ? "right" : "left"; }
function kChange(seg){ var d = seg.lnKa - seg.lnKb; return Math.abs(d) < 1e-9 ? "same" : d > 0 ? "up" : "down"; }
function curveG(u){ return u >= 1 ? 1 : (1 - Math.exp(-4 * u)) / (1 - Math.exp(-4)); }
function concAt(seg, tau){ var g = curveG(clamp(tau / seg.ta, 0, 1)); return seg.jump.map(function(v, i){ return v + (seg.after[i] - v) * g; }); }
// S2 colour from the fraction of cobalt present as blue [CoCl₄]²⁻
function blueFrac(c){ return c[2] / (c[0] + c[2]); }
function colourOf(c){ var f = blueFrac(c); return f < 0.40 ? "pink" : f < 0.55 ? "violet" : "blue"; }
function evText(s, ev){
  if (ev.t === "add") return s.sp[ev.i].f + " added";
  if (ev.t === "rem") return "Half the " + s.sp[ev.i].f + " removed";
  if (ev.t === "vol") return ev.f < 1 ? "Volume halved" : "Volume doubled";
  if (ev.t === "ar") return "Argon added (constant volume)";
  if (ev.t === "T") return (ev.d > 0 ? "Heated by " : "Cooled by ") + Math.abs(ev.d) + " °C";
  if (ev.t === "cat") return "Catalyst added";
  if (ev.t === "cl") return "Cl⁻ added (as NaCl)";
  if (ev.t === "ag") return "Ag⁺ added (removes Cl⁻ as solid AgCl)";
  return "";
}
function fmtC(v){ return MV.num(v, v < 0.1 ? 3 : 2); }

// ---------- @component C8 eqGraph — concentration–time graph (SVG): one line per species (reactants --eq-r, products --eq-p;
// a second reactant dashed), vertical jumps for concentration or volume stresses, smooth curves for the shift, numbered stress
// markers, labels at the line ends; S2 splits into two panels (complexes, chloride). o = {k: animating segment, p: 0..1, mark}
function axisFor(maxv){
  var raw = Math.max(maxv, 1e-6) * 1.1 / 4, e = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), f = raw / e;
  var st = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * e;
  return { max:Math.ceil(maxv * 1.1 / st - 1e-9) * st, step:st, dp:st >= 1 ? 0 : st >= 0.1 ? (Math.abs(st * 10 - Math.round(st * 10)) > 1e-9 ? 2 : 1) : (Math.abs(st * 100 - Math.round(st * 100)) > 1e-9 ? 3 : 2) };
}
function graphSVG(R, o){
  o = o || {};
  var s = R.s, n = R.segs.length, kA = o.k == null ? -1 : o.k, tMax = Math.max(20, 10 * (n + 1));
  var W = 480, L = 46, RT = 372, top = 16, gap = 30, PH = s.panels.length > 1 ? [148, 74] : [196];
  var H = top + PH.reduce(function(a, b){ return a + b; }, 0) + gap * (PH.length - 1) + 40;
  function X(t){ return L + (RT - L) * t / tMax; }
  var ser = s.sp.map(function(x, i){ return [[0, R.c0[i]], [10, R.c0[i]]]; });
  R.segs.forEach(function(seg, k){
    if (kA >= 0 && k > kA) return;
    var t0 = 10 * (k + 1), lim = k === kA ? 10 * (o.p == null ? 1 : o.p) : 10;
    s.sp.forEach(function(x, i){
      ser[i].push([t0, seg.jump[i]]);
      for (var m = 1; m <= 30; m++) { var tau = Math.min(10 * m / 30, lim); ser[i].push([t0 + tau, concAt(seg, tau)[i]]); if (tau >= lim) break; }
    });
  });
  var h = "", y0 = top, lab = [];
  s.panels.forEach(function(idx, pi){
    var mx = 0;
    idx.forEach(function(i){ mx = Math.max(mx, R.c0[i]); R.segs.forEach(function(seg){ mx = Math.max(mx, seg.before[i], seg.jump[i], seg.after[i]); }); });
    var ax = axisFor(mx), ph = PH[pi];
    function Y(v){ return y0 + ph - ph * v / ax.max; }
    for (var v = 0; v <= ax.max + 1e-9; v += ax.step) {
      var yy = r1(Y(v));
      h += '<line x1="' + L + '" y1="' + yy + '" x2="' + RT + '" y2="' + yy + '" stroke="var(--plot-grid)" stroke-width="1"/>';
      h += '<text x="' + (L - 6) + '" y="' + yy + '" text-anchor="end" dominant-baseline="central" font-size="12" fill="var(--ink-2)">' + MV.num(v, ax.dp) + "</text>";
    }
    h += '<line x1="' + L + '" y1="' + y0 + '" x2="' + L + '" y2="' + (y0 + ph) + '" stroke="var(--plot-axis)" stroke-width="1.4"/><line x1="' + L + '" y1="' + (y0 + ph) + '" x2="' + RT + '" y2="' + (y0 + ph) + '" stroke="var(--plot-axis)" stroke-width="1.4"/>';
    if (s.panelNames) h += '<text x="' + (L + 6) + '" y="' + (y0 + 2) + '" dominant-baseline="hanging" font-size="12" fill="var(--ink-2)">' + s.panelNames[pi] + "</text>";
    if (pi === 0) h += '<text x="' + (L - 6) + '" y="' + (y0 - 10) + '" text-anchor="end" font-size="11" fill="var(--ink-2)">mol/L</text>';
    idx.forEach(function(i){
      var sp = s.sp[i], col = sp.nu > 0 ? "var(--eq-p)" : "var(--eq-r)", pts = ser[i].map(function(p){ return r1(X(p[0])) + "," + r1(Y(p[1])); }).join(" ");
      h += '<polyline points="' + pts + '" fill="none" stroke="' + col + '" stroke-width="2.8" stroke-linejoin="round"' + (sp.dash ? ' stroke-dasharray="' + sp.dash + '"' : "") + "/>";
      var last = ser[i][ser[i].length - 1];
      lab.push({ x:X(last[0]), y:Y(last[1]), t:sp.f, col:col, lo:y0 + 6, hi:y0 + ph });
    });
    y0 += ph + gap;
  });
  // stress markers
  var yb = y0 - gap;
  R.segs.forEach(function(seg, k){
    if (kA >= 0 && k > kA) return;
    var x = r1(X(10 * (k + 1)));
    h += '<line x1="' + x + '" y1="' + (top - 4) + '" x2="' + x + '" y2="' + yb + '" stroke="var(--ink-2)" stroke-width="1.2" stroke-dasharray="3 4"/>';
    h += o.mark ? '<text x="' + (x + 4) + '" y="' + (top - 6) + '" font-size="11" fill="var(--ink-2)">' + o.mark + "</text>" : '<text x="' + x + '" y="' + (top - 6) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink-2)">' + (k + 1) + "</text>";
  });
  // labels at the line ends, nudged apart
  lab.sort(function(a, b){ return a.y - b.y; });
  for (var q = 1; q < lab.length; q++) if (lab[q].y - lab[q - 1].y < 15) lab[q].y = lab[q - 1].y + 15;
  lab.forEach(function(l){ h += '<text x="' + r1(Math.min(l.x, RT) + 6) + '" y="' + r1(l.y) + '" dominant-baseline="central" font-size="13" font-weight="700" fill="' + l.col + '">' + l.t + "</text>"; });
  // time axis
  var st = tMax <= 60 ? 10 : 20;
  for (var t = 0; t <= tMax; t += st) h += '<text x="' + r1(X(t)) + '" y="' + (yb + 16) + '" text-anchor="middle" font-size="12" fill="var(--ink-2)">' + t + "</text>";
  h += '<text x="' + ((L + RT) / 2) + '" y="' + (yb + 33) + '" text-anchor="middle" font-size="12" fill="var(--ink-2)">time (min)</text>';
  return { svg:h, vb:"0 0 " + W + " " + H };
}
function graphDescribe(R, k){
  var s = R.s, segs = R.segs, n = k == null ? segs.length : k + 1, c = n ? segs[n - 1].after : R.c0;
  return "Concentration–time graph for " + s.short + (n ? ". " + n + " stress" + (n > 1 ? "es" : "") + "; the latest, at " + (10 * n) + " min: " + evText(s, segs[n - 1].ev) : ", at equilibrium, no stress yet") + ". Equilibrium concentrations now: " +
    s.sp.map(function(x, i){ return "[" + x.f + "] " + fmtC(c[i]); }).join(", ") + " mol/L.";
}

// ---------- @component C8 qkMeter — Q needle against a K marker (--hi) on a log scale (three powers of ten each way of the
// starting K); off-scale values sit at the end with an arrow.
function meterSVG(lq, lk, lk0){
  function X(l){ return r1(40 + (clamp((l - lk0) / Math.LN10, -3, 3) + 3) / 6 * 400); }
  var xk = X(lk), xq = X(lq), off = Math.abs((lq - lk0) / Math.LN10) > 3;
  var h = '<text x="40" y="12" font-size="11" fill="var(--ink-2)">← smaller</text><text x="440" y="12" text-anchor="end" font-size="11" fill="var(--ink-2)">larger →</text>';
  h += '<line x1="40" y1="34" x2="440" y2="34" stroke="var(--rule)" stroke-width="8" stroke-linecap="round"/>';
  h += '<polygon points="' + xk + ',30 ' + (xk - 8) + ',18 ' + (xk + 8) + ',18" fill="var(--hi)" stroke="var(--ink)" stroke-width="1"/><text x="' + xk + '" y="12" text-anchor="middle" font-size="13" font-weight="700" font-style="italic" fill="var(--ink)">K</text>';
  h += '<line x1="' + xq + '" y1="24" x2="' + xq + '" y2="46" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><text x="' + xq + '" y="60" text-anchor="middle" font-size="13" font-weight="700" font-style="italic" fill="var(--ink)">Q' + (off ? (lq < lk0 ? " ◀" : " ▶") : "") + "</text>";
  return h;
}
function qkText(lq, lk){
  var d = lq - lk;
  if (Math.abs(d) < 0.005) return QI + " = " + KI + ": at equilibrium.";
  return d < 0 ? QI + " &lt; " + KI + ": the system shifts right (toward products)." : QI + " &gt; " + KI + ": the system shifts left (toward reactants).";
}

// ---------- hero ----------
function hexRGB(s){ var m = /^#?([0-9a-f]{6})$/i.exec(String(s || "").trim()); if (!m) return null; var n = parseInt(m[1], 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function mixCol(a, b, t){ var A = hexRGB(MV.css(a)), B = hexRGB(MV.css(b)); if (!A || !B) return "var(" + (t < 0.5 ? a : b) + ")"; return "rgb(" + A.map(function(v, i){ return Math.round(v + (B[i] - v) * t); }).join(",") + ")"; }
function hero(f){
  var svg = $("#lc-hx-svg"), ctr = $("#lc-hx-ctr"), rep = $("#lc-hx-replay"), cap = f.cap, run = 0;
  if (!svg) return;
  // st: from/to colour tokens and mix t, tilt (deg, − = reactant side down), drop 0..1, ice 0..1, dial (deg, − = K lower)
  function draw(st){
    var col = mixCol(st.c0, st.c1, st.ct), h = "";
    // ice bath
    if (st.ice > 0) {
      var ih = 70 * st.ice, iy = 262 - ih;
      h += '<rect x="34" y="' + r1(iy) + '" width="112" height="' + r1(ih) + '" rx="6" fill="var(--info-bg)" stroke="var(--ink-2)" stroke-width="1.4"/>';
      for (var q = 0; q < 5; q++) { var cy = iy + 10 + (q % 2) * 22; if (cy + 16 < 262) h += '<rect x="' + (42 + q * 20) + '" y="' + r1(cy) + '" width="15" height="15" rx="3" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.2" transform="rotate(' + (q * 17 - 20) + " " + (49 + q * 20) + " " + r1(cy + 7) + ')"/>'; }
      h += '<text x="90" y="280" text-anchor="middle" font-size="12" fill="var(--ink-2)" opacity="' + r1(st.ice) + '">ice bath</text>';
    }
    // tube
    h += '<path d="M68 60 V222 a22 22 0 0 0 44 0 V60" fill="none" stroke="var(--ink)" stroke-width="2.4"/>';
    h += '<path d="M70 118 V222 a20 20 0 0 0 40 0 V118 Z" fill="' + col + '" stroke="var(--ink)" stroke-width="1"/>';
    h += '<line x1="62" y1="60" x2="118" y2="60" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>';
    if (st.drop > 0 && st.drop < 1) for (var d = 0; d < 3; d++) { var dy = 14 + st.drop * 100 - d * 18; if (dy > 14 && dy < 116) h += '<text x="' + (82 + d * 8) + '" y="' + r1(dy) + '" font-size="12" font-weight="700" fill="var(--eq-r)">Cl⁻</text>'; }
    h += '<text x="90" y="' + (st.ice > 0 ? 40 : 40) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">' + st.name + "</text>";
    // balance scale
    var cx = 250, cy2 = 120, a = st.tilt * Math.PI / 180, dx = 70 * Math.cos(a), dyy = 70 * Math.sin(a);
    h += '<polygon points="250,236 226,262 274,262" fill="var(--ink-2)"/><line x1="250" y1="236" x2="250" y2="' + cy2 + '" stroke="var(--ink-2)" stroke-width="4"/>';
    var lx = cx - dx, ly = cy2 - dyy, rx = cx + dx, ry = cy2 + dyy;
    h += '<line x1="' + r1(lx) + '" y1="' + r1(ly) + '" x2="' + r1(rx) + '" y2="' + r1(ry) + '" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><circle cx="250" cy="120" r="5" fill="var(--ink)"/>';
    [[lx, ly, "reactants"], [rx, ry, "products"]].forEach(function(p){
      h += '<line x1="' + r1(p[0]) + '" y1="' + r1(p[1]) + '" x2="' + r1(p[0]) + '" y2="' + r1(p[1] + 36) + '" stroke="var(--ink-2)" stroke-width="1.4"/>';
      h += '<path d="M' + r1(p[0] - 28) + " " + r1(p[1] + 36) + " Q" + r1(p[0]) + " " + r1(p[1] + 56) + " " + r1(p[0] + 28) + " " + r1(p[1] + 36) + ' Z" fill="var(--hi-soft)" stroke="var(--ink-2)" stroke-width="1.4"/>';
      h += '<text x="' + r1(p[0]) + '" y="' + r1(p[1] + 70) + '" text-anchor="middle" font-size="12" fill="var(--ink-2)">' + p[2] + "</text>";
    });
    // K dial
    var kx = 380, ky = 200, ang = (st.dial - 90) * Math.PI / 180;
    h += '<path d="M340 200 A40 40 0 0 1 420 200" fill="none" stroke="var(--rule)" stroke-width="8" stroke-linecap="round"/>';
    h += '<line x1="' + kx + '" y1="' + ky + '" x2="' + r1(kx + 34 * Math.cos(ang)) + '" y2="' + r1(ky + 34 * Math.sin(ang)) + '" stroke="var(--hi)" stroke-width="4" stroke-linecap="round"/><circle cx="380" cy="200" r="5" fill="var(--ink)"/>';
    h += '<text x="380" y="224" text-anchor="middle" font-size="15" font-weight="700" font-style="italic" fill="var(--ink)">K</text><text x="336" y="218" text-anchor="middle" font-size="11" fill="var(--ink-2)">lower</text><text x="424" y="218" text-anchor="middle" font-size="11" fill="var(--ink-2)">higher</text>';
    svg.innerHTML = h;
  }
  var END = { c0:"--co-blue", c1:"--co-pink", ct:1, tilt:0, drop:0, ice:1, dial:-45, name:"pink" };
  function final(){ draw(END); ctr.textContent = "Cooling turned it pink and turned K down: only temperature changes K."; cap.textContent = "Chloride shifts it right (blue) without changing K; cooling shifts it left (pink) and lowers K."; rep.hidden = false; }
  function play(){
    var id = ++run, st = { c0:"--co-violet", c1:"--co-blue", ct:0, tilt:0, drop:0, ice:0, dial:0, name:"violet" };
    rep.hidden = true; cap.textContent = ""; ctr.textContent = "At equilibrium: violet, a mix of pink and blue."; draw(st);
    function ok(){ return id === run; }
    MV.wait(900, function(){ if (!ok()) return; ctr.textContent = "Chloride is added: the scale tips toward the reactants.";
      MV.tween({ dur:900, step:function(t){ if (!ok()) return; st.drop = t; st.tilt = -14 * t; draw(st); }, done:function(){ if (!ok()) return; st.drop = 0;
        ctr.textContent = "It shifts right: the solution turns blue and the scale levels again.";
        MV.tween({ dur:1500, step:function(t){ if (!ok()) return; st.ct = t; st.tilt = -14 * (1 - t); st.name = t < 0.5 ? "violet" : "blue"; draw(st); }, done:function(){ if (!ok()) return;
          MV.wait(500, function(){ if (!ok()) return; ctr.textContent = "Into an ice bath…";
            MV.tween({ dur:800, step:function(t){ if (!ok()) return; st.ice = t; draw(st); }, done:function(){ if (!ok()) return;
              st.c0 = "--co-blue"; st.c1 = "--co-pink"; st.ct = 0;
              MV.tween({ dur:1500, step:function(t){ if (!ok()) return; st.ct = t; st.dial = -45 * t; st.name = t < 0.5 ? "blue" : "pink"; draw(st); }, done:function(){ if (ok()) final(); } });
            } });
          });
        } });
      } });
    });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Stress tester ----------
function stressList(sysId){
  var s = SYS[sysId], L = [];
  if (sysId === "s2") {
    L.push({ id:"cl", t:"Add Cl⁻ (as NaCl)", ev:{ t:"cl" } }, { id:"ag", t:"Add Ag⁺ (removes Cl⁻)", ev:{ t:"ag" } });
  } else {
    s.sp.forEach(function(x, i){ L.push({ id:"a" + i, t:"Add " + x.f, ev:{ t:"add", i:i } }); });
    s.sp.forEach(function(x, i){ L.push({ id:"r" + i, t:"Remove " + x.f, ev:{ t:"rem", i:i } }); });
    L.push({ id:"vh", t:"Halve the volume", ev:{ t:"vol", f:0.5 } }, { id:"vd", t:"Double the volume", ev:{ t:"vol", f:2 } }, { id:"ar", t:"Add argon (constant volume)", ev:{ t:"ar" } });
  }
  L.push({ id:"th", t:"Heat by 10 °C", ev:{ t:"T", d:10 } }, { id:"tc", t:"Cool by 10 °C", ev:{ t:"T", d:-10 } }, { id:"cat", t:"Add catalyst", ev:{ t:"cat" } });
  return L;
}
function explore(host, api){
  var S = api.S, C = api.content;
  if (SYS_IDS.indexOf(S.sys) < 0) S.sys = "s1";
  if (["one", "seq", "pre"].indexOf(S.mode) < 0) S.mode = "one";
  if (!S.logs || typeof S.logs !== "object") S.logs = {};
  SYS_IDS.forEach(function(id){ if (!Array.isArray(S.logs[id])) S.logs[id] = []; S.logs[id] = S.logs[id].filter(function(e){ return e && typeof e.t === "string"; }).slice(0, LOGMAX); });
  S.pk = S.pk && typeof S.pk === "object" ? S.pk : { s:"", k:"" };
  var busy = false, run = 0, anim = null, preMsg = "", stopTw = null;

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="lc-top"><div class="lc-sys"></div><div class="lc-modes"></div></div>' +
    '<div class="lc-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><p class="lc-eqline"></p>' +
    '<div class="lc-grid"><div class="lc-left"><div class="lc-gwrap"><svg class="lc-graph" role="img" aria-label=""></svg></div>' +
    '<div class="lc-meter"><p class="lc-mhead"><strong>' + QI + "/" + KI + ' meter</strong> <span class="tiny muted">(log scale)</span></p><svg class="lc-msvg" viewBox="0 0 480 66" role="img" aria-label=""></svg><p class="lc-mtext" aria-live="polite"></p></div>' +
    '<div class="lc-swrow" hidden><span class="lc-swbig" aria-hidden="true"></span><p class="lc-swtx" aria-live="polite"></p></div></div>' +
    '<div class="lc-right"><div class="lc-pre"></div><div class="lc-stress" role="group" aria-label="Stresses"></div><p class="tiny muted lc-snote"></p>' +
    '<div class="lc-ur"></div><dl class="read lc-read" aria-live="polite"></dl><h4 class="lc-h4">Stress log</h4><ol class="lc-log"></ol></div></div></div>';
  var gEl = $(".lc-graph", host), mEl = $(".lc-msvg", host), mTx = $(".lc-mtext", host), swRow = $(".lc-swrow", host);

  var RG = {};
  RG.sys = radios($(".lc-sys", host), { label:"System", aria:"System at equilibrium", cls:"chips", options:SYS_IDS.map(function(id){ return { id:id, t:SYS[id].label }; }), value:S.sys,
    onChange:function(v){ cancel(); S.sys = v; preMsg = ""; api.save(); paint(); MV.changed(); } });
  RG.mode = radios($(".lc-modes", host), { label:"Mode", aria:"Stress tester mode", options:C.modes, value:S.mode,
    onChange:function(v){ cancel(); S.mode = v; preMsg = ""; S.pk = { s:"", k:"" }; api.save(); paint(); MV.changed(); } });
  var preBox = $(".lc-pre", host);
  preBox.innerHTML = '<p class="lc-preh"><strong>Predict first.</strong> Before each stress, choose a shift and what happens to ' + KI + '.</p><div class="lc-pks"></div><div class="lc-pkk"></div><div class="lc-premsg" aria-live="polite"></div>';
  RG.pks = radios($(".lc-pks", preBox), { label:"Shift", aria:"Predicted shift", cls:"chips", options:[{ id:"right", t:"right" }, { id:"left", t:"left" }, { id:"none", t:"none" }], value:S.pk.s, onChange:function(v){ S.pk.s = v; api.save(); paintStress(); } });
  RG.pkk = radios($(".lc-pkk", preBox), { label:KI, aria:"Predicted change in K", cls:"chips", options:[{ id:"up", t:KI + " up" }, { id:"down", t:KI + " down" }, { id:"same", t:KI + " same" }], value:S.pk.k, onChange:function(v){ S.pk.k = v; api.save(); paintStress(); } });

  function log(){ return S.logs[S.sys]; }
  function res(){ return replay(S.sys, log()); }

  function cancel(){ run++; if (stopTw) { stopTw(); stopTw = null; } anim = null; busy = false; }
  function paintGraph(R){
    var k = anim ? anim.k : null, g = graphSVG(R, anim ? { k:anim.k, p:anim.p } : {});
    gEl.setAttribute("viewBox", g.vb); gEl.innerHTML = g.svg; gEl.setAttribute("aria-label", graphDescribe(R, k));
    var lq, lk, c;
    if (anim) { var seg = R.segs[anim.k]; c = concAt(seg, 10 * anim.p); lq = lnQ(R.s, c); lk = seg.lnKa; }
    else { c = R.c; lq = lnQ(R.s, c); lk = R.lnK; }
    mEl.innerHTML = meterSVG(lq, lk, R.lnK0);
    mEl.setAttribute("aria-label", "Q/K meter: " + MV.plain(qkText(lq, lk)));
    mTx.innerHTML = qkText(lq, lk);
    swRow.hidden = S.sys !== "s2";
    if (S.sys === "s2") { var nm = colourOf(c); $(".lc-swbig", host).className = "lc-swbig lc-" + nm; $(".lc-swtx", host).innerHTML = "Colour: <strong>" + nm + "</strong>" + (nm === "violet" ? " (a mix of pink and blue)" : nm === "pink" ? " (mostly [Co(H₂O)₆]²⁺)" : " (mostly [CoCl₄]²⁻)"); }
  }
  function cmpW(a, b){ var r = (a - b) / Math.max(Math.abs(b), 1e-9); return r > 1e-4 ? "higher" : r < -1e-4 ? "lower" : "same"; }
  function sPhrase(seg, i){
    var vsB = cmpW(seg.after[i], seg.before[i]), jumped = Math.abs(seg.jump[i] - seg.before[i]) > 1e-9, vsJ = cmpW(seg.after[i], seg.jump[i]), ev = seg.ev;
    var t = vsB === "same" ? "unchanged" : vsB;
    if (jumped && vsJ !== "same") {
      var when = (ev.t === "add" || ev.t === "cl") ? "adding" : (ev.t === "rem" || ev.t === "ag") ? "removing" : ev.t === "vol" ? (ev.f < 1 ? "the squeeze" : "the expansion") : "the stress";
      t = (vsB === "same" ? "the same as" : vsB + " than") + " before, " + vsJ + " than just after " + when;
    }
    return t;
  }
  function paintRead(R){
    var s = R.s, segs = R.segs, rows = [["System", s.short + " (" + s.kind + ")"], ["Temperature", s.temp ? R.T + " °C" + (R.cat ? " · catalyst in" : "") : "not modelled" + (R.cat ? " · catalyst in" : "")]];
    if (!segs.length) { rows.push(["Stress", "none yet"], [QI, QI + " = " + KI + " (at equilibrium)"]); }
    else {
      var seg = segs[segs.length - 1], sh = shiftOf(seg), kc = kChange(seg), d = seg.lnQj - seg.lnKa;
      rows.push(["Stress", evText(s, seg.ev)]);
      rows.push([QI + " right after the stress", Math.abs(d) < 1e-9 ? QI + " = " + KI : d < 0 ? QI + " &lt; " + KI : QI + " &gt; " + KI]);
      if (anim) rows.push(["Shift", "watch the graph…"]);
      else {
        rows.push(["Shift", sh === "none" ? "none" : sh === "right" ? "toward products (right)" : "toward reactants (left)"]);
        rows.push([KI, kc === "same" ? "unchanged" : kc === "up" ? "increased" : "decreased"]);
        s.sp.forEach(function(x, i){ rows.push(["[" + x.f + "] compared with before the stress", sPhrase(seg, i)]); });
        if (seg.ev.t === "cat" || seg.ev.t === "T") {
          var ta = Math.round(seg.ta * 2) / 2, tb = Math.round(seg.tb * 2) / 2;
          rows.push(["Time to reach equilibrium", "about " + MV.num(ta) + " min (was about " + MV.num(tb) + "): " + (seg.ev.t === "cat" ? "shorter (catalyst)" : seg.ev.d > 0 ? "shorter (hotter: faster reactions)" : "longer (cooler: slower reactions)")]);
        }
        if (S.sys === "s2") { var c0 = colourOf(seg.before), c1 = colourOf(seg.after); rows.push(["Colour", c0 === c1 ? c1 + " (no change)" : c0 + " → " + c1]); }
      }
    }
    $(".lc-read", host).innerHTML = MV.readoutHTML(rows);
    var L = log();
    $(".lc-log", host).innerHTML = L.length ? L.map(function(e, i){ return "<li>" + evText(s, e) + (anim && i === L.length - 1 ? " <span class=\"muted\">(shifting…)</span>" : "") + "</li>"; }).join("") : '<li class="muted lc-none">No stresses yet.</li>';
  }
  function paintStress(){
    var R = res(), s = R.s, L = log(), full = L.length >= LOGMAX && S.mode !== "one", needPk = S.mode === "pre" && !(S.pk.s && S.pk.k);
    preBox.hidden = S.mode !== "pre";
    RG.sys.lock(busy); RG.mode.lock(busy); RG.pks.lock(busy); RG.pkk.lock(busy);
    var oneR = S.mode === "one" ? replay(S.sys, []) : R;      // One stress mode applies each stress to the starting equilibrium
    MV.keepFocus($(".lc-stress", host), function(){
      $(".lc-stress", host).innerHTML = stressList(S.sys).map(function(b){
        var dis = busy || full || needPk;
        if (b.ev.t === "T") dis = dis || !s.temp || (oneR.T + b.ev.d > TMAX) || (oneR.T + b.ev.d < TMIN);
        if (b.ev.t === "cat") dis = dis || oneR.cat;
        return '<button type="button" class="btn ghost sm lc-sb" data-st="' + b.id + '" data-k="st' + b.id + '"' + (dis ? " disabled" : "") + ">" + b.t + "</button>";
      }).join("");
    });
    var notes = [];
    if (!s.temp) notes.push("Temperature isn’t modelled for this system, so its temperature buttons are off.");
    if (!s.gas) notes.push("Volume and argon stresses apply only to gas systems.");
    if (s.temp && (R.T >= TMAX || R.T <= TMIN)) notes.push("The model runs from " + TMIN + " °C to " + TMAX + " °C.");
    if (R.cat) notes.push("The catalyst is already in.");
    if (full) notes.push("The log is full: Undo or Reset to keep going.");
    if (needPk && !busy) notes.push("Choose your prediction first.");
    $(".lc-snote", host).innerHTML = notes.join(" ");
    MV.keepFocus($(".lc-ur", host), function(){
      $(".lc-ur", host).innerHTML = '<button type="button" class="btn ghost sm" data-ur="undo" data-k="lcundo"' + (busy || !L.length ? " disabled" : "") + '>Undo</button><button type="button" class="btn ghost sm" data-ur="reset" data-k="lcreset"' + (busy || !L.length ? " disabled" : "") + ">Reset</button>";
    });
    $(".lc-premsg", preBox).innerHTML = preMsg;
  }
  function paint(){
    var R = res();
    $(".lc-eqline", host).innerHTML = "<strong>" + R.s.label.split(":")[0] + ":</strong> " + R.s.eq + (R.s.id === "s2" ? ", Δ<em>H</em> &gt; 0 (pink ⇌ blue)" : R.s.id === "s1" ? ", Δ<em>H</em> = " + MV.num(R.s.dH, 1) + " kJ" : "") + ' <span class="tiny muted">(model values)</span>';
    RG.sys.set(S.sys); RG.mode.set(S.mode);
    paintGraph(R); paintRead(R); paintStress();
  }
  // apply a stress with the shift animation; cb after the system settles
  function apply(ev, cb){
    cancel();
    if (S.mode === "one") S.logs[S.sys] = [];
    var L = log(); if (L.length >= LOGMAX) return;
    L.push(ev); api.save();
    var my = run, R = res(), k = R.segs.length - 1;
    busy = true; anim = { k:k, p:0 };
    paintStress(); paintRead(R); paintGraph(R);
    stopTw = MV.tween({ dur:1700, ease:function(t){ return t; }, step:function(t){ if (my !== run) return; anim.p = t; paintGraph(R); }, done:function(){
      if (my !== run) return; stopTw = null; anim = null; busy = false; paint(); MV.changed(); if (cb) cb(R.segs[k]);
    } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.st) {
      var def = stressList(S.sys).filter(function(x){ return x.id === b.dataset.st; })[0]; if (!def) return;
      if (S.mode === "pre" && !(S.pk.s && S.pk.k)) { paintStress(); return; }
      var pk = S.mode === "pre" ? { s:S.pk.s, k:S.pk.k } : null; preMsg = "";
      apply(JSON.parse(JSON.stringify(def.ev)), function(seg){
        if (!pk) return;
        var sh = shiftOf(seg), kc = kChange(seg), okS = sh === pk.s, okK = kc === pk.k;
        var nm = function(x){ return x === "none" ? "no shift" : "shift " + x; };
        preMsg = MV.fbHTML(okS && okK ? "good" : "bad", "<strong>" + (okS && okK ? "✓ Both right." : "✗ Not quite.") + "</strong> You predicted " + nm(pk.s) + ", " + KI + " " + pk.k + ". It was " + nm(sh) + ", " + KI + " " + kc + "." +
          (okS ? "" : " " + qkText(seg.lnQj, seg.lnKa)) + (okK ? "" : kc === "same" ? " Only a temperature change alters " + KI + "." : " A temperature change alters " + KI + "."));
        S.pk = { s:"", k:"" }; RG.pks.set(""); RG.pkk.set(""); api.save(); paintStress();
      });
      return;
    }
    if (b.dataset.ur) {
      cancel(); preMsg = "";
      if (b.dataset.ur === "undo") log().pop(); else S.logs[S.sys] = [];
      api.save(); paint(); MV.changed();
    }
  });

  // ----- predictions -----
  function setup(sys){ cancel(); S.sys = sys; S.mode = "seq"; S.logs[sys] = []; preMsg = ""; api.save(); paint(); busy = true; paintStress(); }
  var EVP = { p1:["s1", { t:"add", i:0 }], p2:["s1", { t:"vol", f:0.5 }], p3:["s3", { t:"vol", f:0.5 }], p4:["s2", { t:"T", d:20 }] };
  var hooks = {
    start:function(p){ setup(EVP[p.id][0]); },
    run:function(p, done){ busy = false; apply(JSON.parse(JSON.stringify(EVP[p.id][1])), function(){ MV.wait(150, done); }); }
  };

  // ----- challenges -----
  function chal(id){
    var L = log(), R = res(), segs = R.segs, last = segs.length ? segs[segs.length - 1] : null;
    if (id === "tc1") {
      if (S.sys !== "s1") return { ok:false, msg:"Choose S1 (the ammonia system) first." };
      if (!last) return { ok:false, msg:"Apply one stress first." };
      var ev = last.ev;
      if (ev.t === "T" && ev.d < 0) return { ok:false, msg:"That raises [NH₃], but it changes " + KI + "." };
      if (ev.t === "cat") return { ok:false, msg:"No shift: same equilibrium, sooner." };
      if (ev.t === "ar") return { ok:false, msg:"No shift at constant volume." };
      if (ev.t === "rem" && ev.i === 2) return { ok:false, msg:"It shifts right, but [NH₃] ends lower than before." };
      // VERIFY: adding NH₃ itself passes the plan's exact test but isn't in its accepted list; it is rejected as a named state.
      if (ev.t === "add" && ev.i === 2) return { ok:false, msg:"Adding NH₃ raises [NH₃] directly, but the system then shifts left, away from NH₃. Find a stress that makes the system itself make more NH₃." };
      if (Math.abs(R.lnK - R.lnK0) > 1e-9) return { ok:false, msg:KI + " has changed since the start: only temperature changes " + KI + ". Reset, then use one stress that leaves " + KI + " alone." };
      if (last.after[2] > last.before[2] * (1 + 1e-6)) return { ok:true };
      return { ok:false, msg:"[NH₃] ended " + (last.after[2] < last.before[2] ? "lower" : "no higher") + " than before that stress: it shifted " + (shiftOf(last) === "none" ? "nowhere" : shiftOf(last)) + "." };
    }
    if (id === "tc2") {
      if (S.sys !== "s2") return { ok:false, msg:"Choose S2 (the cobalt chloride system) first." };
      if (L.some(function(e){ return e.t === "cl"; })) return { ok:false, msg:"Chloride was added. Reset and turn it blue without adding Cl⁻." };
      var col = colourOf(R.c);
      if (col === "blue") return { ok:true };
      if (!last) return { ok:false, msg:"Apply a stress first." };
      if (last.ev.t === "ag") return { ok:false, msg:"That removes Cl⁻: it shifts left (pink)." };
      if (last.ev.t === "T" && last.ev.d < 0) return { ok:false, msg:"Cooling favours the exothermic reverse direction: pink." };
      return { ok:false, msg:"It’s " + col + " now, not blue yet." + (col === "violet" ? " It’s heading the right way: keep going." : "") };
    }
    if (id === "tc3") {
      if (S.sys !== "s2") return { ok:false, msg:"Choose S2 (the cobalt chloride system) first." };
      var blueAt = segs.some(function(sg){ return colourOf(sg.after) === "blue"; }), fin = colourOf(R.c);
      if (blueAt && fin === "pink" && R.T < T0) return { ok:true };
      var tail = S.mode === "one" ? " Switch to Sequence mode: this takes several stresses in a row." : "";
      if (!segs.length) return { ok:false, msg:"Make it blue first." + tail };
      if (fin === "blue") return { ok:false, msg:"Finish pink." };
      if (!blueAt) return { ok:false, msg:"It hasn’t been blue yet: make it blue first." + tail };
      if (fin === "violet") return { ok:false, msg:"Violet: not pink yet. Keep going." };
      if (R.T === T0) return { ok:false, msg:"Pink again, but " + KI + " hasn’t changed: only temperature changes " + KI + "." };
      return { ok:false, msg:"Pink again, but at " + R.T + " °C " + KI + " is larger than at the start. Only temperature changes " + KI + "." };
    }
    return { ok:false };
  }

  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Industry and the body ----------
// @component barMeter — labelled horizontal bars (model values) for the trade-off stations. bars([{label, v 0–100, word, col}]) -> html
function bars(list){
  return '<div class="lc-bars">' + list.map(function(b){ return '<div class="lc-bar"><span class="lc-bl">' + b.label + '</span><span class="lc-bt" role="img" aria-label="' + esc(MV.plain(b.label) + ": " + b.word) + '"><i style="width:' + clamp(b.v, 0, 100) + "%;background:var(" + (b.col || "--pen") + ')"></i></span><span class="lc-bw">' + b.word + "</span></div>"; }).join("") + "</div>";
}
function level(v){ return v >= 75 ? "high" : v >= 50 ? "fairly high" : v >= 25 ? "fairly low" : "low"; }
var TLV = ["low", "fairly low", "moderate", "fairly high", "high"], PLV = ["low", "fairly low", "medium", "fairly high", "high"];
function part3(host, api){
  var S = api.S;
  S.t = clamp(Math.round(+S.t || 3), 1, 5); S.p = clamp(Math.round(+S.p || 3), 1, 5); S.cat = S.cat === "yes" ? "yes" : "no"; S.rem = S.rem === "yes" ? "yes" : "no";
  S.alt = ["sea", "alt", "weeks"].indexOf(S.alt) >= 0 ? S.alt : "sea"; S.soda = ["sealed", "open", "warm"].indexOf(S.soda) >= 0 ? S.soda : "sealed";
  host.innerHTML = '<div class="lc-st"><h3>Station 1: the ammonia plant</h3><p class="lc-steq">N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + heat</p>' +
    '<p>Set the temperature and pressure, then switch the catalyst and NH₃ removal on and off. Watch the yield and rate bars (model values).</p>' +
    '<div class="lc-s1"><div class="lc-s1c"><div class="lc-sl"></div><div class="lc-tcat"></div><div class="lc-trem"></div></div><div class="lc-s1o" aria-live="polite"></div></div>' +
    '<details class="alg"><summary>Check it with data</summary><p class="tiny muted">Model comparison: directions of change only.</p><div class="tbl-wrap"><table class="vt lc-tab"><thead><tr><th scope="col">Condition</th><th scope="col">Effect on yield</th><th scope="col">Effect on rate</th></tr></thead><tbody>' +
    [["Low temperature", "Higher yield (exothermic)", "Very slow"], ["High temperature", "Lower yield", "Fast"], ["High pressure", "Higher yield (4 mol gas → 2)", "Faster (more collisions)"], ["Iron catalyst", "No change", "Faster"], ["Remove NH₃ by cooling it to a liquid", "Higher yield (removes product)", "—"]].map(function(r){ return "<tr><th scope=\"row\">" + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("") +
    "</tbody></table></div></details>" +
    // VERIFY: real operating conditions are described only in general terms (plan §6.2); check the wording before release.
    '<p>Typical real plants use a compromise: high pressure, a moderate temperature (several hundred degrees Celsius) and an iron catalyst.</p>' +
    // VERIFY: STSE figure ("about half the world’s food") is from the plan; check before release.
    '<p class="lc-stse"><strong>STSE:</strong> about half the world’s food relies on ammonia fertilizer, and making it uses a lot of energy.</p></div>' +
    '<div class="part lc-st"><h3>Station 2: oxygen at altitude</h3><p class="lc-steq">Simplified: Hb(aq) + 4O₂(g) ⇌ Hb(O₂)₄(aq)</p><div class="lc-alt"></div><div class="lc-alto" aria-live="polite"></div></div>' +
    '<div class="part lc-st"><h3>Station 3: a soda bottle</h3><p class="lc-steq">CO₂(g) ⇌ CO₂(aq)</p><div class="lc-soda"></div><div class="lc-sodao" aria-live="polite"></div></div>';
  var SL = MV.sliders($(".lc-sl", host), [
    { id:"lct", label:"Temperature", min:1, max:5, step:1, value:S.t, fmt:function(v){ return TLV[v - 1]; } },
    { id:"lcp", label:"Pressure", min:1, max:5, step:1, value:S.p, fmt:function(v){ return PLV[v - 1]; } }], function(id, v){ if (id === "lct") S.t = v; else S.p = v; api.save(); paint1(); });
  radios($(".lc-tcat", host), { label:"Iron catalyst", aria:"Iron catalyst", options:[{ id:"no", t:"off" }, { id:"yes", t:"on" }], value:S.cat, onChange:function(v){ S.cat = v; api.save(); paint1(); } });
  radios($(".lc-trem", host), { label:"Remove NH₃ (cool to a liquid)", aria:"Remove ammonia", options:[{ id:"no", t:"off" }, { id:"yes", t:"on" }], value:S.rem, onChange:function(v){ S.rem = v; api.save(); paint1(); } });
  function paint1(){
    var y = clamp(30 + 12 * (S.p - 3) - 14 * (S.t - 3) + (S.rem === "yes" ? 15 : 0), 3, 97), r = clamp(30 + 16 * (S.t - 3) + 5 * (S.p - 3) + (S.cat === "yes" ? 25 : 0), 2, 98);
    var notes = [];
    notes.push(S.t <= 2 ? "Low temperature: the exothermic forward direction is favoured (more NH₃), but the reaction is very slow." : S.t >= 4 ? "High temperature: fast, but heat shifts the equilibrium left, so the yield drops." : "Moderate temperature: a compromise between yield and rate.");
    notes.push(S.p >= 4 ? "High pressure favours the side with fewer gas moles (4 → 2) and speeds up collisions." : "Lower pressure gives a lower yield and slower collisions.");
    if (S.cat === "yes") notes.push("The catalyst speeds both directions: faster, same yield.");
    if (S.rem === "yes") notes.push("Removing NH₃ keeps " + QI + " &lt; " + KI + ", so it keeps shifting right.");
    $(".lc-s1o", host).innerHTML = bars([{ label:"Yield of NH₃ (model)", v:y, word:level(y), col:"--eq-p" }, { label:"Rate (model)", v:r, word:level(r), col:"--eq-f" }]) + '<p class="lc-note">' + notes.join(" ") + "</p>";
  }
  paint1();
  var ALT = { sea:{ o2:85, hb:85, hbTot:60, t:"Sea level: plenty of O₂, so most hemoglobin carries oxygen." },
    alt:{ o2:45, hb:55, hbTot:60, t:"High altitude, first days: the lower O₂ pressure shifts the equilibrium left. Less oxygenated hemoglobin means tiredness." },
    weeks:{ o2:45, hb:75, hbTot:85, t:"After weeks: the body makes more hemoglobin (adding a reactant), which shifts it back right. Athletes train at altitude for this reason." } };
  radios($(".lc-alt", host), { label:"Where", aria:"Altitude", cls:"chips", options:[{ id:"sea", t:"Sea level" }, { id:"alt", t:"High altitude: first days" }, { id:"weeks", t:"After weeks at altitude" }], value:S.alt, onChange:function(v){ S.alt = v; api.save(); paint2(); } });
  function paint2(){ var a = ALT[S.alt]; $(".lc-alto", host).innerHTML = bars([{ label:"O₂ pressure", v:a.o2, word:level(a.o2), col:"--eq-r" }, { label:"Total hemoglobin", v:a.hbTot, word:level(a.hbTot), col:"--eq-r" }, { label:"Oxygenated Hb(O₂)₄", v:a.hb, word:level(a.hb), col:"--eq-p" }]) + '<p class="lc-note">' + a.t + ' <span class="tiny muted">(model values; the equation is simplified.)</span></p>'; }
  paint2();
  var SODA = { sealed:{ p:90, d:85, t:"Sealed: high CO₂ pressure above the drink keeps lots of CO₂ dissolved. No bubbles." },
    open:{ p:10, d:55, t:"Opened: the CO₂ pressure above the drink drops, so the equilibrium shifts left and bubbles form." },
    warm:{ p:10, d:30, t:"Opened and warm: dissolving CO₂ is exothermic, so warming shifts it further left. A warm soda goes flat faster." } };
  radios($(".lc-soda", host), { label:"Bottle", aria:"Soda bottle", cls:"chips", options:[{ id:"sealed", t:"Sealed" }, { id:"open", t:"Opened" }, { id:"warm", t:"Opened and warm" }], value:S.soda, onChange:function(v){ S.soda = v; api.save(); paint3(); } });
  function paint3(){ var a = SODA[S.soda]; $(".lc-sodao", host).innerHTML = bars([{ label:"CO₂ pressure above the drink", v:a.p, word:level(a.p), col:"--eq-r" }, { label:"Dissolved CO₂", v:a.d, word:level(a.d), col:"--eq-p" }]) + '<p class="lc-note">' + a.t + ' <span class="tiny muted">(model values)</span></p>'; }
  paint3();
}

// ---------- shared custom-activity bookkeeping ----------
function itemStats(a, ist){ var f = 0, dn = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) dn++; if (x.first) f++; }); return { first:f, total:a.items.length, done:dn, line:a.summary + " (first try): " + f + "/" + a.items.length + (dn < a.items.length ? " (unfinished)" : "") }; }
function itemMissed(a, ist){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
function chipRow(name, opts, sel, key, dis, aria){
  return '<div class="lc-crow"><span class="lc-cl">' + name + '</span><span class="chips" role="radiogroup" aria-label="' + esc(aria) + '">' + opts.map(function(o){ var on = sel === o.id; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-' + key + '="' + o.id + '" data-k="' + aria + o.id + '"' + (dis ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</span></div>";
}

// ---------- Practice 1: Predict the shift ----------
var SHO = [{ id:"right", t:"right" }, { id:"left", t:"left" }, { id:"none", t:"no shift" }], KKO = [{ id:"up", t:KI + " up" }, { id:"down", t:KI + " down" }, { id:"same", t:KI + " same" }];
function shiftAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { s:"", k:"", tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), ans = MV.ans(it).split("|"), h = "";
    if (i === 0) h += '<p class="lc-sysline">' + a.sysA + "</p>";
    if (i === 6) h += '<p class="lc-sysline">' + a.sysB + "</p>";
    h += '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div></div>";
    h += chipRow("Shift", SHO, x.s, "sh", x.solved, "Row " + (i + 1) + " shift") + chipRow(KI, KKO, x.k, "kk", x.solved, "Row " + (i + 1) + " K");
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + (ans[0] === "none" ? "no shift" : "shifts " + ans[0]) + ", " + KI + " " + (ans[1] === "same" ? "unchanged" : ans[1] === "up" ? "increases" : "decreases") + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(z){ return z.id === id; })[0]; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ri]"); if (!bx) return;
    var it = item(bx.dataset.ri), x = ist(it.id), d = b.dataset;
    if (d.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (d.sh) { x.s = d.sh; msgs[it.id] = null; api.save(); paint(); return; }
    if (d.kk) { x.k = d.kk; msgs[it.id] = null; api.save(); paint(); return; }
    if (d.act === "check") {
      if (!x.s || !x.k) { msgs[it.id] = { t:"Choose a shift and a " + KI + " chip first.", soft:true }; paint(); return; }
      var ans = MV.ans(it).split("|"), okS = x.s === ans[0], okK = x.k === ans[1];
      if (okS && okK) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else {
        x.tries++;
        var m = it.main, t = [];
        if ((!okS && m.s && m.s === x.s) || (!okK && m.k && m.k === x.k)) t.push(m.fb);
        else {
          if (!okS) t.push("Check the direction: compare " + QI + " with " + KI + " right after the stress.");
          if (!okK) t.push(ans[1] === "same" ? "Concentration changes alter " + QI + ", not " + KI + ". Only temperature changes " + KI + "." : "A temperature change does change " + KI + " here.");
        }
        if (okS !== okK) t.unshift(okS ? "The shift is right; the " + KI + " choice isn’t." : "The " + KI + " choice is right; the shift isn’t.");
        msgs[it.id] = { t:t.join(" ") };
      }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]'));
    }
  });
  paint();
  return { stats:function(){ return itemStats(a, ist); }, missed:function(){ return itemMissed(a, ist); } };
}

// ---------- Practice 2: Graph detective ----------
var DGEV = { add:{ t:"add", i:0 }, vol:{ t:"vol", f:0.5 }, heat:{ t:"T", d:10 }, cat:{ t:"cat" } };
function miniGraph(kind){
  var R = replay("s1", [DGEV[kind]]), g = graphSVG(R, { mark:"stress" });
  // describe the shape only (the answer is the stress): jumps and slow changes
  var desc = { add:"At 10 min one line jumps up, then all three change slowly.", vol:"At 10 min all three lines jump up, then they change slowly.", heat:"No jumps at 10 min; the lines change slowly afterwards.", cat:"At 10 min nothing changes: all three lines stay flat." }[kind];
  return '<div class="lc-mini"><svg class="lc-graph" viewBox="' + g.vb + '" role="img" aria-label="' + esc("Concentration–time graph for N₂ + 3H₂ ⇌ 2NH₃ (model values). " + desc) + '">' + g.svg + "</svg></div>";
}
function detectAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:null, val:"", tries:0, hint:0, solved:false, first:null }); }
  function order(it, n){ return MV.shuffle(Array.apply(null, Array(n)).map(function(_, i){ return i; }), MV.meta.id + it.id); }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.graph) h += miniGraph(it.graph);
    if (it.inv) h += '<div class="lc-inv"><span class="lc-ivb"><span class="lc-swsm lc-blue" aria-hidden="true"></span>hot-water bath: <strong>blue</strong></span><span class="lc-ivb"><span class="lc-swsm lc-pink" aria-hidden="true"></span>ice bath: <strong>pink</strong></span></div>';
    if (it.kind === "q") h += '<div class="numrow lc-numrow"><label for="ri-' + it.id + '"><em>Q</em> =</label><input class="numin short" id="ri-' + it.id + '" data-rin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + "></div>";
    h += '<div class="chips lc-chiplist" role="radiogroup" aria-label="Choices">' + order(it, it.options.length).map(function(k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "op" + k + '"' + dis + ">" + it.options[k].t + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "q" ? QI + " = 2.0; " : "") + it.options[x.pick].t + ".</strong> " + (it.options[x.pick].why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(z){ return z.id === id; })[0]; }
  function judge(it, x){
    if (it.kind === "q") {
      var v = MV.parseNum(String(x.val || "").trim());
      if (!v || v.length !== 1 || !isFinite(v[0])) return { bad:"Enter " + QI + " as one number." };
      if (x.pick == null) return { bad:"Choose an answer too." };
      var out = [];
      if (Math.abs(v[0] - MV.ans(it)) > 0.01) out.push(it.qfb);
      if (!MV.ok(it.options[x.pick])) out.push(it.options[x.pick].why);
      return out.length ? { fb:out.join(" ") } : { ok:true };
    }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.rin) return; ist(d.rin).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.rin) { var b = host.querySelector('[data-k="' + e.target.dataset.rin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ri]"); if (!bx) return;
    var it = item(bx.dataset.ri), x = ist(it.id), d = b.dataset;
    if (d.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (d.op != null) { x.pick = +d.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (d.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]'));
    }
  });
  paint();
  return { stats:function(){ return itemStats(a, ist); }, missed:function(){ return itemMissed(a, ist); } };
}

// ---------- Performance task: Run the ammonia plant ----------
var task = (function(){
  var S = null, api = null, T = null;
  var OPT = { T:[{ id:"low", t:"Low" }, { id:"med", t:"Medium" }, { id:"high", t:"High" }], P:[{ id:"normal", t:"Normal" }, { id:"high", t:"High" }], C:[{ id:"no", t:"No" }, { id:"yes", t:"Yes" }], R:[{ id:"no", t:"No" }, { id:"yes", t:"Yes" }] };
  var TP = { low:[2, 0, 1], med:[1, 1, 0], high:[0, 2, 1] };
  function pts(d){ var p = TP[d.T].slice(); if (d.P === "high") { p[0]++; p[1]++; p[2]++; } if (d.C === "yes") p[1]++; if (d.R === "yes") { p[0]++; p[2]++; } return { y:p[0], r:p[1], c:p[2] }; }
  function read(){ return { T:S && TP[S.T] ? S.T : "", P:S && (S.P === "normal" || S.P === "high") ? S.P : "", C:S && (S.C === "no" || S.C === "yes") ? S.C : "", R:S && (S.R === "no" || S.R === "yes") ? S.R : "" }; }
  function full(d){ return d.T && d.P && d.C && d.R; }
  function dots(n, col){ var h = ""; for (var i = 0; i < n; i++) h += '<span class="lc-dot" style="background:var(' + col + ')"></span>'; return h || '<span class="muted">0</span>'; }
  function paint(){
    var pv = $("#lc-tkpv"); if (!pv) return;
    var d = read();
    if (!full(d)) { pv.innerHTML = '<p class="muted">Choose all four settings to see the plant’s points.</p>'; return; }
    var p = pts(d), rows = [["Temperature: " + d.T.replace("med", "medium"), TP[d.T]], ["Pressure: " + d.P, d.P === "high" ? [1, 1, 1] : [0, 0, 0]], ["Catalyst: " + d.C, d.C === "yes" ? [0, 1, 0] : [0, 0, 0]], ["Remove NH₃: " + d.R, d.R === "yes" ? [1, 0, 1] : [0, 0, 0]]];
    pv.innerHTML = '<div class="tbl-wrap"><table class="vt lc-tab"><thead><tr><th scope="col">Choice</th><th scope="col">Yield</th><th scope="col">Rate</th><th scope="col">Cost</th></tr></thead><tbody>' +
      rows.map(function(r){ return "<tr><th scope=\"row\">" + r[0] + "</th><td>" + r[1][0] + "</td><td>" + r[1][1] + "</td><td>" + r[1][2] + "</td></tr>"; }).join("") +
      '<tr class="lc-tot"><th scope="row">Total</th><td>' + p.y + "</td><td>" + p.r + "</td><td>" + p.c + "</td></tr></tbody></table></div>" +
      '<div class="lc-pts"><p><span class="lc-ptl">Yield</span>' + dots(p.y, "--eq-p") + '</p><p><span class="lc-ptl">Rate</span>' + dots(p.r, "--eq-f") + '</p><p><span class="lc-ptl">Cost</span>' + dots(p.c, "--eq-b") + "</p></div>";
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      ["T", "P", "C", "R"].forEach(function(k){ if (!OPT[k].some(function(o){ return o.id === S[k]; })) S[k] = ""; });
      inp.innerHTML = [["T", T.qT], ["P", T.qP], ["C", T.qC], ["R", T.qR]].map(function(q){ return '<div class="lc-tq" data-q="' + q[0] + '"></div>'; }).join("");
      [["T", T.qT], ["P", T.qP], ["C", T.qC], ["R", T.qR]].forEach(function(q){
        radios($('[data-q="' + q[0] + '"]', inp), { label:q[1], aria:q[1], cls:"chips", options:OPT[q[0]], value:S[q[0]], onChange:function(v){ S[q[0]] = v; api.save(); paint(); api.update(); } });
      });
      pv.innerHTML = '<h4 class="lc-h4">Plant points (model)</h4><div id="lc-tkpv" aria-live="polite"></div><p class="tiny lc-about">' + T.about + "</p>";
      paint();
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Choose a setting for all four inputs first."; },
    checks:function(d){ if (!full(d)) return [false, false, false]; var p = pts(d); return [p.y >= 3, p.r >= 2, p.c <= 2]; },
    key:function(d){ return [d.T, d.P, d.C, d.R].join("|"); },
    label:function(k){ var q = k.split("|"), d = { T:q[0], P:q[1], C:q[2], R:q[3] }, p = pts(d);
      return ({ low:"Low", med:"Medium", high:"High" })[d.T] + " temperature, " + d.P + " pressure, " + (d.C === "yes" ? "catalyst" : "no catalyst") + ", " + (d.R === "yes" ? "removal" : "no removal") + " (yield " + p.y + ", rate " + p.r + ", cost " + p.c + ")"; },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ shift:shiftAct, detect:detectAct },
  task:task
});
})();
