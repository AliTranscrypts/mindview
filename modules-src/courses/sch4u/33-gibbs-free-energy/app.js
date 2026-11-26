// SCH4U 33 Gibbs Free Energy: hero (ΔG–T line for melting ice, a marker crossing zero at 273 K, an ice cube melting),
// Spontaneity map (Explore: ΔH / ΔS / T sliders with both-unit labels, ΔG–T graph, quadrant chart, real-process presets,
// rate-vs-spontaneity jar with a C4 Ea hump), Free energy and equilibrium (Part 3: ΔG° → K beaker, ΔG vs reaction
// progress, spontaneous-but-slow energy diagram), "Calculate with ΔG" (number entry + chips) and the "Tune the crossover" task.
// Course data (ΔH°f, S°, R, ΔHfus/ΔSfus of water, NH4Cl dissolving, diamond → graphite) come from MV.chem.data.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, CF = MV.chem.f, D = MV.chem.data, M = "−";
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function rr(v, dp){ var k = Math.pow(10, dp); return Math.round(v * k + (v >= 0 ? 1e-9 : -1e-9)) / k; }
function esc(s){ return MV.esc(s); }
function lerp(a, b, t){ return a + (b - a) * t; }
function ease(t){ return (1 - Math.cos(Math.PI * clamp(t, 0, 1))) / 2; }
// numbers: fx = magnitude, sg = always signed (+/−), nm = minus only
function fx(v, dp){ var p = (Math.abs(v) + 1e-9).toFixed(dp).split("."); if (p[0].length > 4) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); return p.join("."); }
function isZero(t){ return +t.replace(/ /g, "") === 0; }
function sg(v, dp){ var t = fx(v, dp); return isZero(t) ? t : (v < 0 ? M : "+") + t; }
function nm(v, dp){ var t = fx(v, dp); return (v < 0 && !isZero(t) ? M : "") + t; }
var IG = function(v){ return 'Δ<tspan font-style="italic">' + v + "</tspan>"; };

// ---------- course data (MV.chem.data) ----------
function look(list, k){ var r = (list || []).filter(function(x){ return x[0] === k; })[0]; return r ? r[1] : null; }
function miscNum(q){ var v = look(D.misc, q); return v == null ? NaN : parseFloat(String(v).replace(/−/g, "-")); }
function HF(s){ return look(D.dHf, s); }
function S0(s){ return look(D.S0, s); }
var RGAS = D["const"].R;   // 8.314 J/(mol·K)
var PRE = {
  ice:{ h:miscNum("ΔHfus of water"), sJ:miscNum("ΔSfus of water"), mol:true, hd:2, sd:1 },
  cold:{ h:Math.round(miscNum("NH4Cl dissolving, ΔH")), sJ:Math.round(miscNum("NH4Cl dissolving, ΔS")), mol:true, hd:0, sd:0 },
  lime:{ h:rr(HF("CaO(s)") + HF("CO2(g)") - HF("CaCO3(s)"), 1), sJ:rr(S0("CaO(s)") + S0("CO2(g)") - S0("CaCO3(s)"), 1), hd:1, sd:1 },
  nh3:{ h:rr(2 * HF("NH3(g)"), 1), sJ:rr(2 * S0("NH3(g)") - S0("N2(g)") - 3 * S0("H2(g)"), 1), hd:1, sd:1 },
  ch4:{ h:rr(HF("CO2(g)") + 2 * HF("H2O(l)") - HF("CH4(g)"), 1), sJ:rr(S0("CO2(g)") + 2 * S0("H2O(l)") - S0("CH4(g)") - 2 * S0("O2(g)"), 1), hd:1, sd:1 }
};
var DIAMOND = miscNum("diamond -> graphite, ΔG°");   // −2.9 kJ/mol
function units(v){ return v.mol ? { h:"kJ/mol", s:"J/(mol·K)", sk:"kJ/(mol·K)" } : { h:"kJ", s:"J/K", sk:"kJ/K" }; }
function gAt(v, T){ return (v.h * 1000 - T * v.sJ) / 1000; }
function quadOf(v){
  var h = v.h, s = v.sJ;
  if (h < 0 && s > 0) return "always"; if (h > 0 && s < 0) return "never";
  if (h > 0 && s > 0) return "high"; if (h < 0 && s < 0) return "low";
  if (s > 0 || (s === 0 && h < 0)) return "always0";
  if (s < 0 || (s === 0 && h > 0)) return "never0";
  return "zero";
}
function crossOf(v){ var q = quadOf(v); return q === "high" || q === "low" ? v.h * 1000 / v.sJ : null; }
var HS = "Δ<i>H</i>", SS = "Δ<i>S</i>", GS = "Δ<i>G</i>", TT = "<i>T</i>";
function quadText(v){
  var q = quadOf(v);
  return {
    always:HS + " < 0, " + SS + " > 0: spontaneous at every temperature",
    never:HS + " > 0, " + SS + " < 0: never spontaneous",
    high:HS + " > 0, " + SS + " > 0: spontaneous above the crossover",
    low:HS + " < 0, " + SS + " < 0: spontaneous below the crossover",
    always0:(v.h === 0 ? HS + " = 0, " + SS + " > 0" : SS + " = 0, " + HS + " < 0") + ": spontaneous at every temperature",
    never0:(v.h === 0 ? HS + " = 0, " + SS + " < 0" : SS + " = 0, " + HS + " > 0") + ": never spontaneous",
    zero:HS + " = 0, " + SS + " = 0: " + GS + " = 0 at every temperature"
  }[q];
}
function crossText(v){
  var c = crossOf(v), q = quadOf(v);
  if (c != null) return fx(c, 0) + " K";
  if (q === "always" || q === "always0") return "None: always spontaneous";
  if (q === "never" || q === "never0") return "None: never spontaneous";
  return "None: " + GS + " = 0 at every temperature";
}

// @component radioGroup (from MHF4U 25, via SCH4U 01–19) — segmented control or chip row as a real radio group (arrow keys,
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
  return { set:function(id){ id = id == null ? "" : String(id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function Tx(x, y, s, o){ o = o || {}; var fs = o.fs || 14; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + r1(fs) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + (o.halo ? ' stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" paint-order="stroke"' : "") + (o.rot ? ' transform="rotate(' + o.rot + " " + r1(x) + " " + r1(y) + ')"' : "") + opA(o.op) + ">" + s + "</text>"; }
function Ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + r1(o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function arrowV(x, y1, y2, c, lab, side){
  var dir = y2 > y1 ? 1 : -1, h = "";
  h += Ln(x, y1, x, y2 - dir * 7, { c:c, w:2.4 }) + '<path d="M' + r1(x) + " " + r1(y2) + " L" + r1(x - 5) + " " + r1(y2 - dir * 9) + " L" + r1(x + 5) + " " + r1(y2 - dir * 9) + 'Z" fill="' + c + '"/>';
  if (lab) h += Tx(x + (side || 1) * 8, (y1 + y2) / 2, lab, { fs:13, w:700, c:c, a:(side || 1) > 0 ? "start" : "end", halo:true });
  return h;
}
function niceUp(m){ var e = Math.pow(10, Math.floor(Math.log10(m))), k = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]; for (var i = 0; i < k.length; i++) if (k[i] * e >= m - 1e-9) return k[i] * e; return 10 * e; }
function tickLab(v){ var s = String(rr(v, 2)); return (v < 0 ? M : "") + s.replace("-", ""); }

// @component K21 gtGraph — ΔG (kJ) against T (K) as an SVG string: straight line with intercept ΔH and slope −ΔS (--pen), the
// ΔG < 0 region shaded (--hi-soft) and labelled "spontaneous", the crossover as a dashed --ink-2 line, the current T as a dot,
// optional reference temperatures. o = {h, sJ, T (dot; null for none), xmax, xstep, unit, marks:[K], lp (0…1 line drawn), op}
function gtGraph(o){
  var W = 560, L = 66, R = 540, TP = 18, B = 258, xmax = o.xmax || 1500, xs = o.xstep || 250, s = o.sJ / 1000;
  var m = Math.max(Math.abs(o.h), Math.abs(o.h - xmax * s), 1), ym = o.ymax || niceUp(m * 1.08), mid = (TP + B) / 2;
  function X(t){ return L + t / xmax * (R - L); }
  function Y(g){ return mid - g / ym * (B - TP) / 2; }
  var h = '<rect x="' + L + '" y="' + r1(mid) + '" width="' + (R - L) + '" height="' + r1(B - mid) + '" fill="var(--hi-soft)"' + opA(o.shade == null ? 1 : o.shade) + "/>";
  [-1, -0.5, 0.5, 1].forEach(function(f){ h += Ln(L, Y(f * ym), R, Y(f * ym), { c:"var(--plot-grid)", w:1 }); });
  for (var t = xs; t <= xmax + 1e-6; t += xs) h += Ln(X(t), TP, X(t), B, { c:"var(--plot-grid)", w:1 });
  h += Tx(R - 8, B - 14, "spontaneous (" + IG("G") + " < 0)", { fs:13, w:700, a:"end", c:"var(--ink-2)", op:o.shade == null ? 1 : o.shade });
  h += Ln(L, mid, R, mid, { c:"var(--plot-axis)", w:1.6 }) + Ln(L, TP, L, B, { c:"var(--plot-axis)", w:1.6 });
  [-1, -0.5, 0, 0.5, 1].forEach(function(f){ h += Tx(L - 7, Y(f * ym), tickLab(f * ym), { fs:12, a:"end", c:"var(--ink-2)" }); });
  for (t = 0; t <= xmax + 1e-6; t += xs) h += Tx(X(t), B + 13, String(t), { fs:12, c:"var(--ink-2)" });
  h += Tx((L + R) / 2, B + 32, '<tspan font-style="italic">T</tspan> (K)', { fs:13, w:700 }) + Tx(16, mid, IG("G") + " (" + (o.unit || "kJ") + ")", { fs:13, w:700, rot:-90 });
  (o.marks || []).forEach(function(k){ h += Ln(X(k), TP, X(k), B, { c:"var(--ink-2)", w:1.4, d:"2 4" }) + Tx(X(k), TP + 8, k + " K", { fs:12, c:"var(--ink-2)", halo:true }); });
  var c = crossOf({ h:o.h, sJ:o.sJ });
  if (c != null && c > 0 && c <= xmax && (o.lp == null || o.lp >= 1) && o.cross !== false) {
    var cx = X(c), right = cx > R - 110;
    h += Ln(cx, TP, cx, B, { c:"var(--ink-2)", w:1.8, d:"6 5" }) + Tx(cx + (right ? -6 : 6), TP + 26, "crossover " + fx(c, 0) + " K", { fs:12.5, w:700, a:right ? "end" : "start", c:"var(--ink-2)", halo:true });
  }
  if (o.empty) return '<g font-family="var(--font-ui)">' + h + "</g>";
  var lp = o.lp == null ? 1 : o.lp, x2 = xmax * lp;
  h += '<line x1="' + L + '" y1="' + r1(Y(o.h)) + '" x2="' + r1(X(x2)) + '" y2="' + r1(Y(o.h - x2 * s)) + '" stroke="var(--pen)" stroke-width="3.2" stroke-linecap="round"/>';
  h += '<circle cx="' + L + '" cy="' + r1(Y(o.h)) + '" r="5" fill="var(--en-dh)"/>' + Tx(L + 10, Y(o.h) + (o.h - xmax * s > o.h ? 14 : -14), IG("H"), { fs:13, w:700, a:"start", c:"var(--en-dh)", halo:true });
  if (o.T != null) {
    var g = o.h - o.T * s;
    h += '<circle cx="' + r1(X(o.T)) + '" cy="' + r1(Y(g)) + '" r="7.5" fill="var(--pen)" stroke="var(--sheet)" stroke-width="2.5"/>';
  }
  return '<g font-family="var(--font-ui)">' + h + "</g>";
}
function graphAria(v, T, u){
  var c = crossOf(v), g = T != null ? gAt(v, T) : null;
  return "Graph of ΔG against T: a straight line starting at ΔH = " + MV.plain(sg(v.h, v.hd || 0)) + " " + u + (c != null ? ", crossing zero at the crossover, " + fx(c, 0) + " K" : ", never crossing zero") + "." +
    (g != null ? " The dot at " + fx(T, 0) + " K shows ΔG = " + MV.plain(Math.abs(g) < 0.05 ? "0.0" : sg(g, 1)) + " " + u + (Math.abs(g) < 0.05 ? " (at equilibrium)." : g < 0 ? " (spontaneous)." : " (not spontaneous).") : "");
}

// ---------- hero: ΔG–T for melting ice ----------
function heroSVG(s){
  var v = { h:PRE.ice.h, sJ:PRE.ice.sJ }, T = s.mk * 500, cross = T >= 273 || s.fin, h = gtGraph({ h:v.h, sJ:v.sJ, T:s.mk > 0 ? T : null, xmax:500, xstep:100, ymax:8, unit:"kJ/mol", lp:s.ln, shade:s.sh, cross:cross });
  h = '<g transform="scale(0.56) translate(0 18)">' + h + "</g>";
  var melt = clamp((T - 273) / 160, 0, 1), cx = 375, base = 232, side = 52 * (1 - melt), pw = 30 + 50 * melt;
  h += Ln(318, base, 436, base, { c:"var(--ink-2)", w:2 });
  if (melt > 0) h += '<ellipse cx="' + cx + '" cy="' + r1(base - 3) + '" rx="' + r1(pw) + '" ry="' + r1(3 + 4 * melt) + '" fill="var(--pen)" fill-opacity="' + r1(0.2 + 0.25 * melt) + '"/>';
  if (side > 1) h += '<rect x="' + r1(cx - side / 2) + '" y="' + r1(base - side - 2 * melt) + '" width="' + r1(side) + '" height="' + r1(side) + '" rx="' + r1(4 + 6 * melt) + '" fill="var(--sheet)" stroke="var(--pen)" stroke-width="2.4"/>' +
    '<path d="M' + r1(cx - side / 2 + 8) + " " + r1(base - side + 10) + " l" + r1(side * 0.3) + ' 0" stroke="var(--pen)" stroke-width="2" stroke-linecap="round" opacity=".6"/>';
  h += Tx(cx, 120, (melt >= 1 ? "liquid water" : melt > 0 ? "melting…" : "ice"), { fs:14, w:700 }) + Tx(cx, 140, fx(T, 0) + " K", { fs:13, c:"var(--ink-2)" });
  h += Tx(cx, 162, T >= 273.5 ? IG("G") + " < 0" : T > 272.5 ? IG("G") + " = 0" : IG("G") + " > 0", { fs:13, w:700, c:"var(--ink-2)" });
  return h;
}
function hero(){
  var svg = $("#gf-hx-svg"), cap = $("#gf-hx-cap"), rep = $("#gf-hx-replay"); if (!svg) return;
  var s = null, run = 0, tw = null;
  function draw(){ svg.innerHTML = heroSVG(s); }
  function fin(){ s = { ln:1, sh:1, mk:1, fin:true }; draw(); cap.textContent = "Above the crossover temperature, 273 K, ΔG < 0 for melting: ice melts on its own. Below it, ΔG > 0."; rep.hidden = false; }
  function play(){
    var id = ++run; if (tw) { tw(); tw = null; } rep.hidden = true;
    s = { ln:0, sh:0, mk:0 }; draw();
    var L = [
      { cap:"For melting ice, ΔG starts at ΔH = +6.01 kJ/mol and falls with slope −ΔS.", k:"ln", dur:1400, pause:500 },
      { cap:"Below zero, melting is spontaneous.", k:"sh", dur:500, pause:500 },
      { cap:"As T rises, the marker slides along the line…", k:"mk", dur:3000, pause:500, at:function(t){ if (t * 500 >= 273 && cap.dataset.x !== "1") { cap.dataset.x = "1"; cap.textContent = "…crossing zero at 273 K, the crossover. Above it, the ice melts."; } } }
    ], i = 0;
    cap.dataset.x = "";
    (function next(){
      if (id !== run) return;
      if (i >= L.length) { fin(); return; }
      var it = L[i++]; if (it.cap) cap.textContent = it.cap;
      tw = MV.tween({ dur:it.dur, step:function(t){ if (id !== run) return; s[it.k] = t; if (it.at) it.at(t); draw(); }, done:function(){ tw = null; if (id === run) MV.wait(it.pause, next); } });
    })();
  }
  rep.addEventListener("click", function(){ if (MV.reduceMotion) fin(); else play(); });
  if (MV.reduceMotion) fin(); else play();
}

// @component C4 eaJar — methane-and-air jar beside a reaction-energy profile with the Ea hump (--en-ea) and ΔH (--en-dh).
// st = {g: gas let in 0…1, sp: spark flash 0…1, b: burn progress 0…1}; returns an SVG string for viewBox 0 0 520 230.
var JP = [[52, 70], [96, 58], [142, 74], [60, 118], [110, 110], [150, 128], [70, 168], [118, 160], [158, 176]];
function mol(kind, x, y, op){
  function at(el, px, py, r){ var k = MV.chem.atom(el); return '<circle cx="' + r1(px) + '" cy="' + r1(py) + '" r="' + r + '" fill="' + k.fill + '"' + (el === "H" ? ' stroke="' + k.line + '" stroke-width="1.2"' : "") + "/>"; }
  var h = "";
  if (kind === "ch4") h = at("H", x - 9, y - 6, 4) + at("H", x + 9, y - 6, 4) + at("H", x - 6, y + 9, 4) + at("H", x + 8, y + 8, 4) + at("C", x, y, 7);
  else if (kind === "o2") h = at("O", x - 6, y, 6.5) + at("O", x + 6, y, 6.5);
  else if (kind === "co2") h = at("O", x - 12, y, 6) + at("O", x + 12, y, 6) + at("C", x, y, 6.5);
  else h = at("H", x - 8, y + 7, 4) + at("H", x + 8, y + 7, 4) + at("O", x, y, 7);
  return "<g" + opA(op) + ">" + h + "</g>";
}
function prof(x){ if (x <= 318) return 92; if (x <= 368) return 92 - 70 * ease((x - 318) / 50); if (x <= 430) return 22 + 176 * ease((x - 368) / 62); return 198; }
function jarSVG(st){
  var h = "", g = st.g, b = st.b;
  // jar
  h += '<path d="M24 34 V196 Q24 210 38 210 H170 Q184 210 184 196 V34" fill="var(--pen)" fill-opacity=".06" stroke="var(--ink-2)" stroke-width="2.2"/><path d="M18 34 H190" stroke="var(--ink-2)" stroke-width="3"/>';
  h += '<path d="M104 210 V222 M96 222 H112" stroke="var(--ink-2)" stroke-width="2.4"/>' + Tx(104, 30 - 14, "methane + air", { fs:12.5, w:700 });
  if (b > 0 && b < 1) h += '<circle cx="104" cy="122" r="' + r1(40 + 50 * b) + '" fill="var(--en-dh)" opacity="' + r1(0.35 * Math.sin(Math.PI * b)) + '"/>';
  JP.forEach(function(p, i){
    var before = i % 3 === 1 ? "ch4" : "o2", after = i % 3 === 1 ? "co2" : "h2o", jit = Math.sin(i * 2.3 + b * 9) * 3 * (b > 0 && b < 1 ? 1 : 0);
    var vis = clamp(g * 1.6 - i * 0.07, 0, 1);
    if (vis <= 0) return;
    var x = p[0] + jit, y = lerp(200, p[1], vis) + jit;
    if (b < 0.5) h += mol(before, x, y, vis * (1 - b * 2 * 0.9));
    else h += mol(after, x, y, (b - 0.5) * 2);
  });
  if (st.sp > 0) {
    var o = Math.sin(Math.PI * st.sp);
    h += '<path d="M104 206 L96 192 L110 186 L100 172 L114 166" fill="none" stroke="var(--en-ea)" stroke-width="3" stroke-linejoin="round"' + opA(o) + "/>" + '<circle cx="114" cy="166" r="' + r1(6 + 8 * st.sp) + '" fill="var(--en-dh)"' + opA(o * 0.8) + "/>";
  }
  // energy profile (C4)
  var pts = []; for (var x = 260; x <= 500; x += 4) pts.push(r1(x) + " " + r1(prof(x)));
  h += Ln(252, 14, 252, 214, { c:"var(--plot-axis)", w:1.6 }) + Tx(240, 114, "energy", { fs:12, rot:-90, c:"var(--ink-2)" });
  h += '<path d="M' + pts.join(" L") + '" fill="none" stroke="var(--ink)" stroke-width="2.6"/>';
  h += Ln(260, 92, 340, 92, { c:"var(--ink-2)", w:1.2, d:"3 4" });
  h += arrowV(300, 92, 24, "var(--en-ea)", '<tspan font-style="italic">E</tspan><tspan font-size="9" dy="3">a</tspan>', -1);
  h += arrowV(476, 92, 196, "var(--en-dh)", IG("H"), -1) + Ln(440, 92, 500, 92, { c:"var(--ink-2)", w:1.2, d:"3 4" });
  h += Tx(288, 106, "reactants", { fs:11.5, c:"var(--ink-2)" }) + Tx(468, 212, "products", { fs:11.5, c:"var(--ink-2)" });
  var bx = lerp(288, 470, ease(b)), by = prof(bx) - 9;
  h += '<circle cx="' + r1(bx) + '" cy="' + r1(by) + '" r="8" fill="var(--pen)" stroke="var(--sheet)" stroke-width="2"/>';
  return '<g font-family="var(--font-ui)">' + h + "</g>";
}

// ---------- Explore: Spontaneity map ----------
function explore(host, api){
  var C = api.content, S = api.S, m = C.msgs;
  if (["map", "real", "rate"].indexOf(S.mode) < 0) S.mode = "map";
  if (!PRE[S.pre]) S.pre = "lime";
  S.h = isFinite(S.h) ? clamp(Math.round(S.h / 5) * 5, -200, 200) : 90;
  S.sJ = isFinite(S.sJ) ? clamp(Math.round(S.sJ / 5) * 5, -400, 400) : 200;
  S.t = isFinite(S.t) ? clamp(S.t, 100, 1500) : 300;
  if (!S.jar || typeof S.jar !== "object") S.jar = { g:1, b:0 };
  var busy = false, tw = null, jt = { sp:0 };

  host.innerHTML = '<p class="how gf-how">' + C.how + '</p><div class="gf-modes"></div><div class="gf-pre"></div><p class="tiny muted gf-prenote"></p>' +
    '<div class="gf-grid" data-mv="graph"><div class="gf-left"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<svg class="gf-graph" viewBox="0 0 560 300" role="img" aria-label=""></svg><p class="tiny muted gf-gnote">' + C.graphNote + "</p>" +
    '<div class="gf-sliders">' + slider("h", HS, -200, 200, 5, "--en-dh") + slider("s", SS, -400, 400, 5, "--en-cat") + slider("t", TT, 100, 1500, 25, "--ink") + "</div>" +
    '<p class="gf-cap" aria-live="polite"></p></div>' +
    '<div class="gf-right"><h4 class="gf-h4">Readout</h4><dl class="read gf-read" aria-live="polite"></dl>' +
    '<div class="gf-quadw"><h4 class="gf-h4">Quadrant chart</h4><div class="gf-quad"></div></div>' +
    '<div class="gf-jarw" hidden><h4 class="gf-h4">' + C.jar.title + '</h4><svg class="gf-jar" viewBox="0 0 520 230" role="img" aria-label=""></svg><p class="gf-jcap" aria-live="polite"></p>' +
    '<div class="gf-acts"><button type="button" class="btn primary sm" data-k="gfspark">' + C.jar.spark + '</button><button type="button" class="btn ghost sm" data-k="gfreset">' + C.jar.reset + "</button></div></div></div></div>";
  function slider(id, lab, min, max, step, col){
    return '<div class="gf-sl"><label for="gf-sl-' + id + '" class="gf-sl-top"><span class="gf-sl-lab" style="color:var(' + col + ')">' + lab + '</span><output class="gf-sl-out" id="gf-sl-' + id + '-o"></output></label>' +
      '<input type="range" id="gf-sl-' + id + '" data-sl="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:var(' + col + ')"></div>';
  }
  var gsvg = $(".gf-graph", host), readEl = $(".gf-read", host), capEl = $(".gf-cap", host), quadEl = $(".gf-quad", host), jarW = $(".gf-jarw", host), jsvg = $(".gf-jar", host), jcap = $(".gf-jcap", host), preNote = $(".gf-prenote", host);
  var sparkB = $('[data-k="gfspark"]', host), resetB = $('[data-k="gfreset"]', host);
  var RG = {};
  RG.mode = radios($(".gf-modes", host), { label:"Mode", aria:"Spontaneity map mode", options:C.modes, value:S.mode, onChange:function(v){ if (busy) return; S.mode = v; if (v === "rate") { S.jar = { g:1, b:0 }; } capEl.textContent = ""; api.save(); paint(); MV.changed(); } });
  RG.pre = radios($(".gf-pre", host), { label:"Process", aria:"Real process", cls:"chips", options:C.presets.map(function(p){ return { id:p.id, t:p.t }; }), value:S.pre, onChange:function(v){ if (busy) return; S.pre = v; capEl.textContent = ""; api.save(); paint(); MV.changed(); } });

  function cur(){ if (S.mode === "map") return { h:S.h, sJ:S.sJ, hd:0, sd:0 }; var p = S.mode === "rate" ? PRE.ch4 : PRE[S.pre]; return p; }
  function setSlider(id, val, txt, dis){
    var inp = $("#gf-sl-" + id, host), out = $("#gf-sl-" + id + "-o", host);
    inp.value = val; inp.disabled = !!dis; out.innerHTML = txt; inp.setAttribute("aria-valuetext", MV.plain(txt));
  }
  function paint(){
    var v = cur(), u = units(v), T = S.t, g = gAt(v, T), lockHS = S.mode !== "map";
    RG.mode.set(S.mode); RG.pre.set(S.pre); RG.mode.lock(busy); RG.pre.lock(busy);
    $(".gf-pre", host).hidden = S.mode !== "real";
    var pp = S.mode === "real" ? C.presets.filter(function(p){ return p.id === S.pre; })[0] : S.mode === "rate" ? C.presets.filter(function(p){ return p.id === "ch4"; })[0] : null;
    preNote.hidden = !pp; if (pp) preNote.innerHTML = CF(pp.eq) + (pp.note ? " (" + pp.note + ")" : "") + ". " + HS + " and " + SS + " are locked; " + TT + " stays free.";
    setSlider("h", clamp(Math.round(v.h / 5) * 5, -200, 200), sg(v.h, v.hd) + " " + u.h, busy || lockHS);
    setSlider("s", clamp(Math.round(v.sJ / 5) * 5, -400, 400), sg(v.sJ / 1000, v.sd + 3) + " " + u.sk + " (" + sg(v.sJ, v.sd) + " " + u.s + ")", busy || lockHS);
    setSlider("t", clamp(Math.round(T / 25) * 25, 100, 1500), fx(T, 0) + " K (" + nm(T - 273, 0) + " °C)", busy);
    gsvg.innerHTML = gtGraph({ h:v.h, sJ:v.sJ, T:T, xmax:1500, xstep:250, unit:u.h });
    gsvg.setAttribute("aria-label", graphAria(v, T, u.h));
    var eq = Math.abs(g) < 0.05;
    var rows = [
      ['<span class="gf-dh">' + HS + "</span>", sg(v.h, v.hd) + " " + u.h],
      ['<span class="gf-ds">' + SS + "</span>", sg(v.sJ, v.sd) + " " + u.s + " = " + sg(v.sJ / 1000, v.sd + 3) + " " + u.sk],
      [TT, fx(T, 0) + " K (" + nm(T - 273, 0) + " °C)"],
      [TT + '<span class="gf-ds">' + SS + "</span>", nm(T * v.sJ / 1000, 1) + " " + u.h],
      [GS, (eq ? "0.0" : sg(g, 1)) + " " + u.h],
      ["Spontaneous?", eq ? "At equilibrium" : g < 0 ? "Yes" : "No"],
      ["Crossover " + TT, crossText(v)],
      ["Quadrant", quadText(v)]
    ];
    readEl.innerHTML = rows.map(function(r){ return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    // quadrant chart
    var q = quadOf(v).replace("0", "");
    var cells = [["never", "Never spontaneous"], ["high", "Spontaneous above the crossover"], ["low", "Spontaneous below the crossover"], ["always", "Always spontaneous"]];
    quadEl.innerHTML = '<div class="gf-q" role="img" aria-label="' + esc("Quadrant chart. Current reaction: " + MV.plain(quadText(v)) + ".") + '"><span></span><span class="gf-qh">' + SS + ' < 0</span><span class="gf-qh">' + SS + " > 0</span>" +
      '<span class="gf-qv">' + HS + " > 0</span>" + cellH(cells[0]) + cellH(cells[1]) + '<span class="gf-qv">' + HS + " < 0</span>" + cellH(cells[2]) + cellH(cells[3]) + "</div>";
    function cellH(c){ var on = q === c[0] && (v.h !== 0 && v.sJ !== 0); return '<span class="gf-qc' + (on ? " on" : "") + '">' + c[1] + (on ? '<b class="gf-qm">current</b>' : "") + "</span>"; }
    $(".gf-quadw", host).hidden = S.mode === "rate";
    jarW.hidden = S.mode !== "rate";
    if (S.mode === "rate") paintJar();
    if (S.mode === "map" && S.h === 0 && S.sJ > 0 && !busy) capEl.innerHTML = C.rareNote;
    else if (capEl.dataset.rare) capEl.innerHTML = "";
    capEl.dataset.rare = S.mode === "map" && S.h === 0 && S.sJ > 0 ? "1" : "";
  }
  function paintJar(){
    var st = { g:S.jar.g, sp:jt.sp, b:S.jar.b }, g = gAt(PRE.ch4, S.t);
    jsvg.innerHTML = jarSVG(st);
    jsvg.setAttribute("aria-label", st.b >= 1 ? "The jar now holds carbon dioxide and water; on the energy profile the ball has gone over the activation-energy hump and down to the products." : st.g > 0 ? "A jar of methane and oxygen molecules. On the energy profile beside it, a ball sits at the reactants, below a tall activation-energy hump." : "An empty jar beside an energy profile with a tall activation-energy hump.");
    if (!busy) jcap.innerHTML = st.b >= 1 ? C.jar.after : st.g > 0 ? C.jar.before.replace("very negative", "very negative (" + sg(g, 0) + " kJ at " + fx(S.t, 0) + " K)") : "";
    sparkB.disabled = busy || st.b >= 1 || st.g < 1; resetB.disabled = busy;
  }
  function burn(done){
    if (tw) tw();
    tw = MV.tween({ dur:450, step:function(t){ jt.sp = t; paintJar(); }, done:function(){
      jt.sp = 0;
      tw = MV.tween({ dur:1700, step:function(t){ S.jar.b = t; paintJar(); }, done:function(){ tw = null; S.jar.b = 1; api.save(); if (done) done(); } });
    } });
  }
  sparkB.addEventListener("click", function(){
    if (busy || S.jar.b >= 1) return;
    busy = true; paint(); jcap.innerHTML = "Spark!";
    burn(function(){ busy = false; paint(); var b = $('[data-k="gfreset"]', host); if (b) b.focus({ preventScroll:true }); });
  });
  resetB.addEventListener("click", function(){ if (busy) return; S.jar = { g:1, b:0 }; api.save(); paint(); });
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id || busy) return;
    var v = +e.target.value;
    if (id === "h") S.h = v; else if (id === "s") S.sJ = v; else S.t = v;
    api.save(); paint(); MV.changed();
  });
  host.addEventListener("keydown", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id || !e.shiftKey || busy) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var inp = e.target, st = +inp.step, nv = clamp(+inp.value + d * 5 * st, +inp.min, +inp.max);
    inp.value = nv; inp.dispatchEvent(new Event("input", { bubbles:true }));
  });

  function slideT(to, dur, done){
    if (tw) tw();
    var from = S.t;
    tw = MV.tween({ dur:dur, step:function(t){ S.t = lerp(from, to, ease(t)); paint(); }, done:function(){ tw = null; S.t = to; paint(); if (done) done(); } });
  }
  var hooks = {
    start:function(p){
      if (tw) { tw(); tw = null; }
      capEl.innerHTML = C.predSetup[p.id] || "";
      if (p.id === "p1") { S.mode = "map"; S.h = -80; S.sJ = -200; S.t = 300; }
      else if (p.id === "p2") { S.mode = "real"; S.pre = "ice"; S.t = 300; }
      else if (p.id === "p3") { S.mode = "rate"; S.t = 300; S.jar = { g:0, b:0 }; }
      else { S.mode = "real"; S.pre = "cold"; S.t = 100; }
      busy = true; api.save(); paint();
    },
    run:function(p, done){
      function end(msg){ busy = false; capEl.innerHTML = msg; api.save(); paint(); capEl.innerHTML = msg; MV.changed(); done(); }
      if (p.id === "p1") { slideT(600, 1500, function(){ end("At 600 K the dot sits above zero: " + GS + " = −80 + 120 = +40 kJ. Not spontaneous."); }); return; }
      if (p.id === "p2") {
        slideT(273, 1300, function(){
          capEl.innerHTML = "273 K: " + GS + " = 0 for melting, the melting point.";
          MV.wait(900, function(){ slideT(263, 900, function(){ end("263 K (−10 °C): " + GS + " = 6.01 − 263 × 0.0220 = +0.22 kJ/mol. Ice doesn’t melt on its own."); }); });
        });
        return;
      }
      if (p.id === "p3") {
        capEl.innerHTML = "The gas valve opens…";
        if (tw) tw();
        tw = MV.tween({ dur:1100, step:function(t){ S.jar.g = t; paintJar(); }, done:function(){
          tw = null; S.jar.g = 1; paintJar();
          capEl.innerHTML = GS + " ≈ " + sg(gAt(PRE.ch4, 300), 0) + " kJ, yet nothing happens.";
          MV.wait(1500, function(){ capEl.innerHTML = "Now add a spark…"; burn(function(){ end(C.jar.after); }); });
        } });
        return;
      }
      slideT(300, 1500, function(){ end("At 300 K: " + GS + " = 15 − 300 × 0.075 = −7.5 kJ/mol. Spontaneous, although it’s endothermic."); });
    }
  };

  function chal(id){
    if (id === "tc2") {
      if (S.mode !== "real" || S.pre !== "lime") return { ok:false, msg:m.needLime };
      var T = S.t;
      if (T === 1150) return { ok:true };
      if (T === 1125) return { ok:false, msg:m.tc2.t1125 };
      if (T < 1100) return { ok:false, msg:m.tc2.low };
      if (T === 1100) return { ok:false, msg:m.tc2.t1100 };
      return { ok:false, msg:m.tc2.high };
    }
    if (S.mode !== "map") return { ok:false, msg:m.needMap };
    var h = S.h, s = S.sJ;
    if (id === "tc1") {
      if (s === 0) return { ok:false, msg:m.tc1.zeroS };
      if (h <= 0 && s > 0) return { ok:true };
      if (h < 0 && s < 0) return { ok:false, msg:m.tc1.bothNeg };
      if (h > 0 && s > 0) return { ok:false, msg:m.tc1.bothPos };
      if (s < 0) return { ok:false, msg:m.tc1.never };
      return { ok:false, msg:m.tc1.other };
    }
    if (h !== 90) return { ok:false, msg:m.tc3.needH };
    if (s === 150) return { ok:true };
    if (s === 200) return { ok:false, msg:m.tc3.s200 };
    if (s === 15) return { ok:false, msg:m.tc3.s015 };
    if (s === 0) return { ok:false, msg:m.tc3.zero };
    if (s < 0) return { ok:false, msg:m.tc3.neg };
    return { ok:false, msg:"The crossover is " + fx(90000 / s, 0) + " K. " + m.tc3.other };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Free energy and equilibrium ----------
function kOf(g0){ return Math.exp(-g0 * 1000 / (RGAS * 298)); }
function sci1(v){ var e = Math.floor(Math.log10(v) + 1e-9), mm = Math.round(v / Math.pow(10, e)); if (mm >= 10) { mm = 1; e++; } return mm + " × 10<sup>" + (e < 0 ? M + (-e) : e) + "</sup>"; }
function kTxt(g0){ if (g0 === 0) return "1"; var k = kOf(g0); if (k >= 1000 || k < 0.01) return "≈ " + sci1(k); if (k >= 1) return "≈ " + Math.round(k); return "≈ " + Number(k.toPrecision(1)); }
function pct(p){ if (p >= 1) return String(Math.round(p)); var t = Number(p.toPrecision(1)); return t >= 0.001 ? String(t) : t.toFixed(Math.ceil(-Math.log10(t))); }
var BK = []; (function(){ for (var i = 0; i < 40; i++) { var r = Math.floor(i / 8), c = i % 8; BK.push([46 + c * 26 + Math.sin(i * 3.1) * 5 + (r % 2) * 8, 76 + r * 26 + Math.cos(i * 1.7) * 5]); } })();
function beakerSVG(nP){
  var h = '<path d="M30 40 V198 Q30 212 44 212 H244 Q258 212 258 198 V40" fill="var(--pen)" fill-opacity=".06" stroke="var(--ink-2)" stroke-width="2.2"/><path d="M24 40 H264" stroke="var(--ink-2)" stroke-width="3"/>';
  // products chosen by a fixed scatter order so the change reads as A turning into B
  var order = BK.map(function(_, i){ return i; }).sort(function(a, b){ return Math.sin(a * 7.7) - Math.sin(b * 7.7); });
  var isP = {}; for (var k = 0; k < nP; k++) isP[order[k]] = true;
  BK.forEach(function(p, i){
    if (isP[i]) h += '<rect x="' + r1(p[0] - 7) + '" y="' + r1(p[1] - 7) + '" width="14" height="14" rx="2" transform="rotate(45 ' + r1(p[0]) + " " + r1(p[1]) + ')" fill="var(--eq-p)"/>';
    else h += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="7.5" fill="var(--eq-r)"/>';
  });
  h += '<circle cx="292" cy="80" r="7.5" fill="var(--eq-r)"/>' + Tx(306, 80, "A (reactant)", { fs:13, a:"start" }) + '<rect x="285" y="105" width="14" height="14" rx="2" transform="rotate(45 292 112)" fill="var(--eq-p)"/>' + Tx(306, 112, "B (product)", { fs:13, a:"start" });
  return '<g font-family="var(--font-ui)">' + h + "</g>";
}
var G0S2 = -5;   // Station 2 model reaction (model data)
function gProg(x){ return G0S2 + RGAS * 298 / 1000 * Math.log(x / (1 - x)); }
function progSVG(x){
  var L = 60, R = 500, TP = 16, B = 196, y0 = -18, y1 = 8;
  function X(p){ return L + p * (R - L); } function Y(g){ return TP + (y1 - g) / (y1 - y0) * (B - TP); }
  var h = '<rect x="' + L + '" y="' + r1(Y(0)) + '" width="' + (R - L) + '" height="' + r1(B - Y(0)) + '" fill="var(--hi-soft)" opacity=".6"/>';
  [-15, -10, -5, 5].forEach(function(g){ h += Ln(L, Y(g), R, Y(g), { c:"var(--plot-grid)", w:1 }) + Tx(L - 6, Y(g), tickLab(g), { fs:12, a:"end", c:"var(--ink-2)" }); });
  h += Tx(L - 6, Y(0), "0", { fs:12, a:"end", c:"var(--ink-2)" }) + Ln(L, Y(0), R, Y(0), { c:"var(--plot-axis)", w:1.6 }) + Ln(L, TP, L, B, { c:"var(--plot-axis)", w:1.6 });
  [0, 0.25, 0.5, 0.75, 1].forEach(function(p){ h += Tx(X(p), B + 13, Math.round(p * 100) + "%", { fs:12, c:"var(--ink-2)" }); });
  h += Tx((L + R) / 2, B + 31, "reaction progress (share of B)", { fs:13, w:700 }) + Tx(14, (TP + B) / 2, IG("G") + " (kJ)", { fs:13, w:700, rot:-90 });
  var pts = []; for (var p = 0.006; p <= 0.9941; p += 0.004) { var g = gProg(p); if (g >= y0 && g <= y1) pts.push(r1(X(p)) + " " + r1(Y(g))); }
  var xe = 1 / (1 + Math.exp(G0S2 * 1000 / (RGAS * 298)));
  h += Ln(X(0.5), Y(G0S2), X(0.5), Y(0), { c:"var(--ink-2)", w:1.2, d:"2 4" }) + '<circle cx="' + r1(X(0.5)) + '" cy="' + r1(Y(G0S2)) + '" r="4" fill="var(--ink-2)"/>' + Tx(X(0.5) - 8, Y(G0S2) + 14, IG("G") + "° = −5 kJ (Q = 1)", { fs:12, a:"end", c:"var(--ink-2)", halo:true });
  h += Ln(X(xe), TP, X(xe), B, { c:"var(--ink-2)", w:1.8, d:"6 5" }) + Tx(X(xe) - 6, TP + 10, "equilibrium", { fs:12.5, w:700, a:"end", c:"var(--ink-2)", halo:true });
  h += '<path d="M' + pts.join(" L") + '" fill="none" stroke="var(--pen)" stroke-width="3"/>';
  var gx = clamp(gProg(x), y0, y1);
  h += '<circle cx="' + r1(X(x)) + '" cy="' + r1(Y(gx)) + '" r="7.5" fill="var(--pen)" stroke="var(--sheet)" stroke-width="2.5"/>';
  return '<g font-family="var(--font-ui)">' + h + "</g>";
}
function diamondSVG(){
  var h = Ln(40, 16, 40, 196, { c:"var(--plot-axis)", w:1.6 }) + Tx(26, 106, "energy", { fs:12, rot:-90, c:"var(--ink-2)" });
  var pts = []; for (var x = 60; x <= 480; x += 4) { var y = x <= 150 ? 160 : x <= 270 ? 160 - 140 * ease((x - 150) / 120) : x <= 390 ? 20 + 148 * ease((x - 270) / 120) : 168; pts.push(x + " " + r1(y)); }
  h += '<path d="M' + pts.join(" L") + '" fill="none" stroke="var(--ink)" stroke-width="2.6"/>';
  h += arrowV(120, 160, 22, "var(--en-ea)", '<tspan font-style="italic">E</tspan><tspan font-size="9" dy="3">a</tspan> (enormous)', 1) + Ln(100, 20, 280, 20, { c:"var(--ink-2)", w:1.2, d:"3 4" });
  h += Tx(100, 176, "diamond", { fs:13, w:700 }) + Tx(440, 184, "graphite", { fs:13, w:700 }) + Tx(440, 148, IG("G") + "° = " + nm(DIAMOND, 1) + " kJ/mol", { fs:12.5, c:"var(--ink-2)" });
  return '<g font-family="var(--font-ui)">' + h + "</g>";
}
function part3(host, api){
  var C = api.content, S = api.S, s1 = C.s1, s2 = C.s2, s3 = C.s3, TV = [-40, -20, -10, 0, 10, 20, 40];
  S.g0 = isFinite(S.g0) ? clamp(Math.round(S.g0 / 10) * 10, -40, 40) : -10;
  S.x = isFinite(S.x) ? clamp(Math.round(S.x), 1, 99) : 20;
  var GO = "Δ<i>G</i>°";
  host.innerHTML =
    '<div class="gf-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="gf-st1"><div><div class="gf-sl"><label for="gf-g0" class="gf-sl-top"><span class="gf-sl-lab">' + s1.label + '</span><output class="gf-sl-out" id="gf-g0-o"></output></label><input type="range" id="gf-g0" min="-40" max="40" step="10" style="accent-color:var(--pen)"></div>' +
    '<dl class="read gf-kread" aria-live="polite"></dl></div><svg class="gf-beaker" viewBox="0 0 420 230" role="img" aria-label=""></svg></div><p class="tiny muted">' + s1.scaleNote + '</p><p class="gf-rule"><strong>The rule:</strong> ' + s1.rule + '</p><h4 class="gf-h4">' + s1.tableTitle + '</h4><div class="gf-ktab"></div><p class="tiny muted">' + s1.note + "</p></div>" +
    '<div class="part gf-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><p class="tiny muted">' + s2.model + '</p><svg class="gf-prog" viewBox="0 0 520 236" role="img" aria-label=""></svg>' +
    '<div class="gf-sl"><label for="gf-x" class="gf-sl-top"><span class="gf-sl-lab">' + s2.progress + '</span><output class="gf-sl-out" id="gf-x-o"></output></label><input type="range" id="gf-x" min="1" max="99" step="1" style="accent-color:var(--pen)"></div>' +
    '<div class="gf-st2"><dl class="read gf-xread" aria-live="polite"></dl><div class="gf-rates"></div></div><p class="tiny muted">' + s2.std + "</p></div>" +
    '<div class="part gf-st"><h3>' + s3.title + '</h3><svg class="gf-dia" viewBox="0 0 500 200" role="img" aria-label="' + esc(s3.aria) + '">' + diamondSVG() + "</svg>" + s3.html + "</div>";
  var g0In = $("#gf-g0", host), xIn = $("#gf-x", host);
  function paint1(){
    var g0 = S.g0, k = kOf(g0), f = g0 === 0 ? 0.5 : k / (1 + k), nP = Math.round(40 * f);
    if (f > 0 && nP < 1) nP = 1; if (f < 1 && nP > 39) nP = 39;
    g0In.value = g0; var gt = (g0 > 0 ? "+" : g0 < 0 ? M : "") + Math.abs(g0) + " kJ"; $("#gf-g0-o", host).textContent = gt; g0In.setAttribute("aria-valuetext", gt);
    var pp = f * 100, rp = 100 - pp, pT = pp > 99 ? "almost 100%" : pct(pp) + "%", rT = rp > 99 ? "almost 100%" : pct(rp) + "%";
    if (g0 === 0) { pT = "50%"; rT = "50%"; }
    var fav = g0 < 0 ? "Products favoured (" + "<i>K</i> > 1)" : g0 > 0 ? "Reactants favoured (<i>K</i> < 1), but some product still forms" : "Neither favoured (<i>K</i> = 1)";
    $(".gf-kread", host).innerHTML = [[s1.kLabel, kTxt(g0)], ["Which side?", fav], [s1.share, "Products " + pT + " · reactants " + rT]].map(function(r){ return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    var bk = $(".gf-beaker", host); bk.innerHTML = beakerSVG(nP);
    bk.setAttribute("aria-label", "Beaker of 40 particles: " + nP + " product particles (B) and " + (40 - nP) + " reactant particles (A). At equilibrium, products are " + MV.plain(pT) + " of the mixture.");
    $(".gf-ktab", host).innerHTML = '<div class="gf-tscroll"><table class="gf-tab"><caption class="sr-only">' + GO + " and K at 298 K</caption><tbody><tr><th scope=\"row\">" + GO + " (kJ)</th>" +
      TV.map(function(t){ return '<td class="' + (t === g0 ? "on" : "") + '">' + (t > 0 ? "+" : t < 0 ? M : "") + Math.abs(t) + "</td>"; }).join("") + "</tr><tr><th scope=\"row\"><i>K</i> at 298 K</th>" +
      TV.map(function(t){ return '<td class="' + (t === g0 ? "on" : "") + '">' + kTxt(t) + "</td>"; }).join("") + "</tr></tbody></table></div>";
  }
  function paint2(){
    var x = S.x / 100, g = gProg(x), Q = x / (1 - x), eq = Math.abs(g) < 0.1, K = kOf(G0S2);
    xIn.value = S.x; $("#gf-x-o", host).textContent = S.x + "%"; xIn.setAttribute("aria-valuetext", S.x + "% B");
    var ps = $(".gf-prog", host); ps.innerHTML = progSVG(x);
    ps.setAttribute("aria-label", "Graph of ΔG against reaction progress: ΔG rises from very negative to 0 at the equilibrium mixture (88% B), then becomes positive. The marker is at " + S.x + "% B, where ΔG = " + MV.plain(eq ? "0.0" : sg(g, 1)) + " kJ.");
    var Qt = Q >= 10 ? fx(Q, 0) : Q >= 1 ? fx(Q, 1) : Number(Q.toPrecision(2));
    $(".gf-xread", host).innerHTML = [["Q = [B] ÷ [A]", String(Qt)], [GS, (eq ? "0.0" : sg(g, 1)) + " kJ"], ["What happens", eq ? s2.eq : g < 0 ? s2.fwd : s2.rev]].map(function(r){ return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    var fw = K * (1 - x), rv = x, mx = K * 0.99;
    $(".gf-rates", host).innerHTML = '<p class="gf-rl">Forward rate (A → B)</p><div class="gf-bar"><span style="width:' + r1(fw / mx * 100) + '%;background:var(--eq-f)"></span></div><p class="gf-rl">Reverse rate (B → A)</p><div class="gf-bar"><span style="width:' + r1(rv / mx * 100) + '%;background:var(--eq-b)"></span></div>' +
      '<p class="tiny muted">' + (eq ? "Equal rates: dynamic equilibrium." : fw > rv ? "Forward is faster: net change toward B." : "Reverse is faster: net change toward A.") + "</p>";
  }
  g0In.addEventListener("input", function(){ S.g0 = +g0In.value; api.save(); paint1(); });
  xIn.addEventListener("input", function(){ S.x = +xIn.value; api.save(); paint2(); });
  paint1(); paint2();
}

// ---------- Practice 2: Calculate with ΔG (number entry + chips) ----------
function stripUnit(raw){ return String(raw || "").replace(/\s*(kJ\/\(mol·K\)|kJ\/K|J\/K|kJ\/mol|kJ|K|°C)\s*$/i, ""); }
function calcAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", pick:null, side:null, tries:0, hint:0, solved:false, first:null }); }
  function chipsHTML(it, opts, key, sel, dis, lab){
    return '<div class="chips gf-chiplist" role="radiogroup" aria-label="' + esc(lab || "Choices") + '">' + opts.map(function(o, k){ var on = sel === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-' + key + '="' + k + '" data-k="' + it.id + key + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>";
  }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.options) h += chipsHTML(it, it.options, "op", x.pick, dis);
    else {
      h += '<div class="numrow"><label for="gf-ci-' + it.id + '">Your answer:</label><input class="numin" id="gf-ci-' + it.id + '" data-cin="' + it.id + '" type="text" inputmode="text" autocomplete="off" value="' + esc(x.val) + '"' + dis + '><span class="m">' + it.unit + "</span></div>";
      if (it.side) h += '<p class="gf-side">' + it.side.label + "</p>" + chipsHTML(it, it.side.options, "sd", x.side, dis, MV.plain(it.side.label));
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.options ? it.options[x.pick].t : it.display) + ".</strong> " + (it.options ? it.options[x.pick].why || "" : it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function judge(it, x){
    if (it.options) {
      if (x.pick == null) return { soft:"Choose an answer first." };
      return MV.ok(it.options[x.pick]) ? { ok:true } : { t:it.options[x.pick].why };
    }
    var vals = MV.parseNum(stripUnit(x.val));
    if (!vals || vals.length !== 1 || !isFinite(vals[0])) return { soft:"Enter a number, such as 12, −3.5 or 0.150." };
    if (it.side && x.side == null) return { soft:"Choose below or above as well." };
    var v = vals[0], ans = MV.ans(it), list = Array.isArray(ans) ? ans : [ans];
    var good = list.some(function(t){ return Math.abs(v - t) <= 1e-6 * Math.max(1, Math.abs(t)); });
    var named = (it.wrong || []).filter(function(w){ return Math.abs(v - w.match) <= 1e-6 * Math.max(1, Math.abs(w.match)); })[0];
    var sideOk = !it.side || MV.ok(it.side.options[x.side]);
    if (good && sideOk) return { ok:true };
    if (good && !sideOk) return { t:it.sideWrong };
    if (named) return { t:named.fb };
    return { t:it.general || "Check your units and the sign, then try again." };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.cin; if (!id) return; ist(id).val = e.target.value; msgs[id] = null; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = host.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); return; }
    var c = e.target.closest("[data-op],[data-sd]"); if (!c) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = Array.prototype.slice.call(c.parentNode.querySelectorAll("button")), nx = all[(all.indexOf(c) + d + all.length) % all.length]; nx.click();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = a.items.filter(function(q){ return q.id === bx.dataset.ci; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.sd != null) { x.side = +b.dataset.sd; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var inp = bx.querySelector("[data-cin]"); if (inp) x.val = inp.value;
      var r = judge(it, x);
      if (r.soft) { msgs[it.id] = { t:r.soft, soft:true }; paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.t }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Tune the crossover ----------
var task = (function(){
  var S = null, api = null, TK = null, R = {};
  function sJof(s){ return Math.round(s * 1000); }
  function read(){ return { h:S && S.h != null && S.h !== "" ? +S.h : null, s:S && S.s != null && S.s !== "" ? +S.s : null }; }
  function res(d){ var sJ = sJof(d.s); return [d.h * 1000 - 300 * sJ < 0, d.h * 1000 - 700 * sJ >= 0, d.h >= -100]; }
  function hLab(h){ return sg(h, 0) + " kJ"; }
  function keyLabel(k){ var p = String(k).split("|"), h = +p[0], s = +p[1] / 1000; return HS + " = " + hLab(h) + ", " + SS + " = " + sLab(s) + " (crossover " + fx(h / s, 0) + " K)"; }
  function sLab(s){ return sg(s, 3) + " kJ/K"; }
  function paint(){
    var pv = $(".gf-tk-g"), rd = $(".gf-tk-r"), d = read(); if (!pv || !rd) return;
    if (d.h == null || d.s == null) { pv.innerHTML = gtGraph({ h:0, sJ:0, T:null, xmax:1000, xstep:100, ymax:300, marks:[300, 700], cross:false, empty:true }); $(".gf-tk-svg").setAttribute("aria-label", "Empty ΔG–T graph from 0 to 1000 K with reference lines at 300 K and 700 K. Choose ΔH and ΔS to draw the line."); rd.innerHTML = '<p class="tiny muted">Choose ' + HS + " and " + SS + " to draw the line.</p>"; return; }
    var v = { h:d.h, sJ:sJof(d.s) }, c = crossOf(v), g3 = gAt(v, 300), g7 = gAt(v, 700);
    pv.innerHTML = gtGraph({ h:v.h, sJ:v.sJ, T:null, xmax:1000, xstep:100, ymax:niceUp(Math.max(Math.abs(v.h), Math.abs(v.h - 1000 * v.sJ / 1000)) * 1.08), marks:[300, 700] });
    $(".gf-tk-svg").setAttribute("aria-label", graphAria(v, null, "kJ") + " " + "At 300 K, ΔG = " + MV.plain(sg(g3, 0)) + " kJ; at 700 K, ΔG = " + MV.plain(sg(g7, 0)) + " kJ.");
    rd.innerHTML = '<ul class="gf-tkl"><li>Crossover: ' + crossText(v) + "</li><li>" + GS + " at 300 K: " + (Math.abs(g3) < 0.05 ? "0 kJ (at equilibrium)" : sg(g3, 0) + " kJ") + "</li><li>" + GS + " at 700 K: " + (Math.abs(g7) < 0.05 ? "0 kJ (at equilibrium)" : sg(g7, 0) + " kJ") + "</li></ul>";
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; TK = MV.C.task;
      if (TK.inputs.dH.vals.indexOf(+S.h) < 0) S.h = null;
      if (TK.inputs.dS.vals.indexOf(+S.s) < 0) S.s = null;
      inp.innerHTML = '<div class="gf-tk-h"></div><div class="gf-tk-s"></div>';
      R.h = radios($(".gf-tk-h", inp), { label:TK.inputs.dH.label, aria:TK.inputs.dH.label, cls:"chips", options:TK.inputs.dH.vals.map(function(x){ return { id:String(x), t:sg(x, 0) }; }), value:S.h == null ? "" : String(S.h), onChange:function(x){ S.h = +x; api.save(); paint(); api.update(); } });
      R.s = radios($(".gf-tk-s", inp), { label:TK.inputs.dS.label, aria:TK.inputs.dS.label, cls:"chips", options:TK.inputs.dS.vals.map(function(x){ return { id:String(x), t:sg(x, 3) }; }), value:S.s == null ? "" : String(S.s), onChange:function(x){ S.s = +x; api.save(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="gf-h4">Live ' + GS + "–" + TT + ' graph</h4><svg class="gf-tk-svg" viewBox="0 0 560 300" role="img" aria-label=""><g class="gf-tk-g"></g></svg><div class="gf-tk-r" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ return d.h != null && d.s != null ? true : "Choose a value for both " + HS + " and " + SS + " first."; },
    checks:function(d){ if (d.h == null || d.s == null) return [false, false, false]; return res(d); },
    tips:function(d, r){
      var out = [];
      if (!(d.h < 0 && d.s < 0)) out.push(TK.tips[0]);
      else { var c = d.h / d.s; if (c <= 300) out.push(TK.tips[2]); else if (c > 700) out.push(TK.tips[1]); }
      if (!r[2]) out.push(TK.tipHeat);
      if (!out.length) out.push(TK.tips[1]);
      return out;
    },
    key:function(d){ return d.h + "|" + sJof(d.s); },
    label:keyLabel,
    text:function(k){ return MV.plain(keyLabel(k)); }
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
