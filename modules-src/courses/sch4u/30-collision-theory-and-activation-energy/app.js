// SCH4U 30 Collision Theory and Activation Energy: hero (particle box with bounces, one effective end-on hit riding a
// small energy hill, then the full hill with Ea and ΔH arrows), Particle box (Explore: C6 box with counters, the
// Maxwell–Boltzmann curve with a 300 K ghost and an Ea line, the C4 diagram builder), Catalysts at work (Part 3: catalytic
// converter, enzyme model data, ammonia conditions, homogeneous vs heterogeneous), Read the energy diagram (N8 taps on
// points, arrows and bands) and Design a reaction profile (task: three chip rows and a live C4 profile).
(function(){
"use strict";
var $ = MV.$;
var R = MV.chem.data["const"].R;      // 8.314 J/(mol·K), course table
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function fx(v, dp){ return MV.num(v, dp); }
function sg(v){ return v > 0 ? "+" + fx(v, 0) : fx(v, 0); }
function LIN(t){ return t; }
var EA = "<i>E</i><sub>a</sub>", DH = "Δ<i>H</i>";
function eaT(suf){ return '<tspan font-style="italic">E</tspan><tspan dy="3" font-size="0.75em">a</tspan><tspan dy="-3">' + (suf || "") + "</tspan>"; }
var DHT = 'Δ<tspan font-style="italic">H</tspan>';
function rng(seed){ var s = seed >>> 0; return function(){ s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function numIn(s){ var t = String(s == null ? "" : s).replace(/[×x*\s]|kJ/gi, "").replace(/−/g, "-"); if (!/^[+\-]?\d*\.?\d+$/.test(t)) return null; return parseFloat(t); }

// @component radioGroup (from MHF4U 25, via SCH4U 01–14) — segmented control or chip row as a real radio group (arrow keys,
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
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="middle" font-size="' + (o.fs || 12) + '"' + (o.w ? ' font-weight="' + o.w + '"' : "") +
    ' fill="' + (o.c || "var(--ink)") + '"' + (o.halo ? ' stroke="var(--sheet)" stroke-width="3.5" paint-order="stroke" stroke-linejoin="round"' : "") + opA(o.op) + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
// vertical arrow from y1 to y2 (head at y2)
function varrow(x, y1, y2, c, o){
  o = o || {}; var w = o.w || 2.4, L = Math.abs(y2 - y1), dir = y2 < y1 ? -1 : 1, hl = Math.min(9, L * 0.45);
  if (L < 2) return "";
  return ln(x, y1, x, y2 - dir * hl * 0.8, { c:c, w:w, op:o.op, d:o.d }) + '<polygon points="' + r1(x) + "," + r1(y2) + " " + r1(x - hl * 0.6) + "," + r1(y2 - dir * hl) + " " + r1(x + hl * 0.6) + "," + r1(y2 - dir * hl) + '" fill="' + c + '"' + opA(o.op) + "/>";
}

// ---------- model (plan: Explore model) ----------
var CONC = { h:0.5, "1":1, "2":2, "3":3 }, EAC = { none:50, X:45, Y:40 }, ORIENT = 0.25;
// scaled fraction with E ≥ Ea: 1.0% at 300 K and 50 kJ/mol; ratios from exp[(Ea/R)(1/300 − 1/T)] and exp(ΔEa/RT); display capped at 100%
function fracOf(T, ea){ return Math.min(1, 0.01 * Math.exp(50000 / (R * 300) - ea * 1000 / (R * T))); }
function modelOf(s){ var ea = EAC[s.cat] || 50, coll = 2000 * CONC[s.a] * CONC[s.b] * Math.sqrt(s.T / 300), fr = fracOf(s.T, ea), eff = coll * fr * ORIENT; return { ea:ea, coll:coll, fr:fr, eff:eff, ratio:eff / 5 }; }
function pct(fr){ var v = fr * 100; if (v >= 99.95) return "100%"; if (v >= 10) return Math.round(v) + "%"; return v.toPrecision(2) + "%"; }
// Maxwell–Boltzmann picture: the energy spread θ(T) is chosen so the tail beyond the 50 kJ/mol line equals the model fraction
function erfc(x){ var t = 1 / (1 + 0.3275911 * x), y = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))); return y * Math.exp(-x * x); }
function tailY(y){ return erfc(Math.sqrt(y)) + 2 * Math.sqrt(y / Math.PI) * Math.exp(-y); }
function yFor(f){ var lo = 1e-4, hi = 40; for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (tailY(m) > f) lo = m; else hi = m; } return (lo + hi) / 2; }
var XE = 50, XMAX = 62;
function thetaOf(T){ return XE / yFor(fracOf(T, 50)); }
function xLine(ea){ return ea >= 50 ? XE : thetaOf(300) * yFor(fracOf(300, ea)); }
function mb(E, th){ return E <= 0 ? 0 : 1.1283792 * Math.pow(th, -1.5) * Math.sqrt(E) * Math.exp(-E / th); }

// ---------- C6 particle simulation (shared by the hero and the Explore box) ----------
function Sim(o){
  var rnd = rng(o.seed), P = [], n = o.nA + o.nB;
  for (var i = 0; i < n; i++) { var a = rnd() * 6.2832, s = 0.55 + 0.9 * rnd(); P.push({ k:i < o.nA ? "A" : "B", x:o.r + rnd() * (o.W - 2 * o.r), y:o.r + rnd() * (o.H - 2 * o.r), vx:Math.cos(a) * s, vy:Math.sin(a) * s, o:rnd() * 6.2832, vo:(rnd() - 0.5) * 3 }); }
  function step(dt, on, vs){
    var ev = [], r = o.r, i, j, p, q;
    for (i = 0; i < n; i++) {
      if (!on(i)) continue; p = P[i];
      p.x += p.vx * vs * dt; p.y += p.vy * vs * dt; p.o += p.vo * dt;
      if (p.x < r) { p.x = r; p.vx = Math.abs(p.vx); } if (p.x > o.W - r) { p.x = o.W - r; p.vx = -Math.abs(p.vx); }
      if (p.y < r) { p.y = r; p.vy = Math.abs(p.vy); } if (p.y > o.H - r) { p.y = o.H - r; p.vy = -Math.abs(p.vy); }
    }
    for (i = 0; i < n; i++) {
      if (!on(i)) continue; p = P[i];
      for (j = i + 1; j < n; j++) {
        if (!on(j)) continue; q = P[j];
        var dx = q.x - p.x, dy = q.y - p.y, d2 = dx * dx + dy * dy;
        if (d2 < 4 * r * r && d2 > 1e-6) {
          var d = Math.sqrt(d2), nx = dx / d, ny = dy / d, rel = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny;
          if (rel < 0) { p.vx += rel * nx; p.vy += rel * ny; q.vx -= rel * nx; q.vy -= rel * ny; ev.push({ x:(p.x + q.x) / 2, y:(p.y + q.y) / 2, i:i, j:j }); }
          var ov = (2 * r - d) / 2; p.x -= nx * ov; p.y -= ny * ov; q.x += nx * ov; q.y += ny * ov;
        }
      }
    }
    return ev;
  }
  return { P:P, step:step };
}
// A: filled circle (--pen); B: rounded square (--f3); the reactive end is a small open dot on the rim
function partSVG(p, r, op){
  var c = p.k === "A" ? "var(--pen)" : "var(--f3)", ex = p.x + Math.cos(p.o) * r * 0.78, ey = p.y + Math.sin(p.o) * r * 0.78;
  var body = p.k === "A" ? circ(p.x, p.y, r, c, { op:op }) : rect(p.x - r * 0.9, p.y - r * 0.9, r * 1.8, r * 1.8, c, { rx:3, op:op });
  return body + circ(ex, ey, r * 0.34, "var(--sheet)", { s:"var(--ink)", sw:1.1, op:op });
}
function abSVG(x, y, r, op){ return circ(x - r * 0.85, y, r * 0.95, "var(--ink)", { op:op }) + rect(x, y - r * 0.85, r * 1.7, r * 1.7, "var(--ink)", { rx:3, op:op }); }
function tickSVG(x, y, age){ var f = 1 - age / 0.2, h = ""; for (var k = 0; k < 4; k++) { var a = k * 1.5708 + 0.785, r0 = 4 + 6 * (1 - f), r2 = r0 + 4; h += ln(x + Math.cos(a) * r0, y + Math.sin(a) * r0, x + Math.cos(a) * r2, y + Math.sin(a) * r2, { c:"var(--ink-2)", w:1.4, op:f }); } return h; }
function flashSVG(x, y, age){ var f = clamp(1 - age / 0.9, 0, 1); return circ(x, y, 12 + 12 * (1 - f), "var(--hi)", { op:0.55 * f }) + abSVG(x, y, 6.5, Math.min(1, f * 1.6)); }

// ---------- C4 potential energy profile (SVG) ----------
// g = {xa, w, yt, yb, lo, hi, fs, axis, step}; o = {r, pk, p, cpk, ea, rev, dh, cea, levels, vals, hlArrows, op}
function geom(g, o){
  var k = (g.yb - g.yt) / (g.hi - g.lo);
  function Y(v){ return g.yt + (g.hi - v) * k; }
  var xa = g.xa, w = g.w;
  return { Y:Y, vOf:function(py){ return g.hi - (py - g.yt) / k; }, xa:xa, w:w, rx1:xa + 0.24 * w, px:xa + 0.5 * w, qx0:xa + 0.74 * w, qx1:xa + w,
    xEa:xa + 0.15 * w, xCea:xa + 0.31 * w, xRev:xa + 0.81 * w, xDh:xa + 0.95 * w, xR:xa + 0.1 * w, xP:xa + 0.88 * w,
    Yr:Y(o.r), Ypk:Y(o.pk), Yp:Y(o.p), Yc:o.cpk == null ? null : Y(o.cpk) };
}
function pathD(G, yk, catOnly){
  var w = G.w, s = "";
  if (!catOnly) s += "M" + r1(G.xa) + "," + r1(G.Yr) + " L" + r1(G.rx1) + "," + r1(G.Yr) + " ";
  else s += "M" + r1(G.rx1) + "," + r1(G.Yr) + " ";
  s += "C" + r1(G.rx1 + 0.12 * w) + "," + r1(G.Yr) + " " + r1(G.px - 0.09 * w) + "," + r1(yk) + " " + r1(G.px) + "," + r1(yk) + " C" + r1(G.px + 0.09 * w) + "," + r1(yk) + " " + r1(G.qx0 - 0.12 * w) + "," + r1(G.Yp) + " " + r1(G.qx0) + "," + r1(G.Yp);
  if (!catOnly) s += " L" + r1(G.qx1) + "," + r1(G.Yp);
  return s;
}
function profSVG(g, o){
  var G = geom(g, o), fs = g.fs || 12, h = "", Y = G.Y, op = o.op == null ? 1 : o.op;
  if (g.axis) {
    var ax = G.xa - 12, st = g.step || 20;
    h += ln(ax, g.yt - 4, ax, g.yb + 2, { c:"var(--ink-2)", w:1.4 });
    for (var v = Math.ceil(g.lo / st) * st; v <= g.hi + 1e-9; v += st) { var yy = Y(v); h += ln(ax - 4, yy, ax, yy, { c:"var(--ink-2)", w:1.2 }) + tx(ax - 7, yy, fx(v, 0), { a:"end", fs:fs - 1, c:"var(--ink-2)" }); }
    h += '<text transform="translate(' + r1(g.titleX || 12) + "," + r1((g.yt + g.yb) / 2) + ') rotate(-90)" text-anchor="middle" dominant-baseline="middle" font-size="' + (fs - 1) + '" fill="var(--ink-2)">Potential energy (kJ)</text>';
  }
  var gc = "var(--ink-2)", gd = "2 4";
  // guide lines (dotted) so every arrow starts and ends on a level
  var gu = !!o.guides;
  if (o.ea || o.rev || o.cea || gu) h += ln((o.ea || gu ? G.xEa : G.px) - 8, G.Ypk, (o.rev || gu ? G.xRev + 8 : G.px), G.Ypk, { c:gc, w:1.2, d:gd, op:op });
  if (o.dh || o.cea || gu) h += ln(G.rx1, G.Yr, o.dh || gu ? G.xDh + 8 : G.xCea + 8, G.Yr, { c:gc, w:1.2, d:gd, op:op });
  if ((o.cea || gu) && G.Yc != null) h += ln(G.xCea - 8, G.Yc, G.px, G.Yc, { c:gc, w:1.2, d:gd, op:op });
  // paths
  h += '<path d="' + pathD(G, G.Ypk) + '" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"' + opA(o.pathOp) + "/>";
  if (G.Yc != null) h += '<path d="' + pathD(G, G.Yc, true) + '" fill="none" stroke="var(--en-cat)" stroke-width="2.8" stroke-dasharray="8 6" stroke-linecap="round"' + opA(o.catOp) + "/>";
  // arrows
  var A = o.neutral ? "var(--ink-2)" : null;
  if (o.ea) h += varrow(G.xEa, G.Yr, G.Ypk, A || "var(--en-ea)", { op:op });
  if (o.cea && G.Yc != null) h += varrow(G.xCea, G.Yr, G.Yc, A || "var(--en-cat)", { op:op });
  if (o.rev) h += varrow(G.xRev, G.Yp, lerp(G.Yp, G.Ypk, o.revT == null ? 1 : o.revT), A || "var(--en-ea)", { op:op });
  if (o.dh && Math.abs(G.Yp - G.Yr) > 1) h += varrow(G.xDh, G.Yr, G.Yp, A || "var(--en-dh)", { op:op });
  // labels
  if (o.labels) {
    if (o.ea) h += tx(G.xEa - 5, (G.Yr + G.Ypk) / 2, eaT(), { a:"end", fs:fs, c:"var(--en-ea)", w:700, halo:true, op:op });
    if (o.cea && G.Yc != null) h += tx(G.xCea + 5, (G.Yr + G.Yc) / 2 + 12, eaT(" (cat.)"), { a:"start", fs:fs - 1, c:"var(--en-cat)", w:700, halo:true, op:op });
    if (o.rev && (o.revT == null || o.revT >= 1)) h += tx(G.xRev - 5, (G.Yp + G.Ypk) / 2, eaT("(rev)"), { a:"end", fs:fs, c:"var(--en-ea)", w:700, halo:true, op:op });
    if (o.dh && Math.abs(G.Yp - G.Yr) > 1) h += tx(G.xDh - 5, (G.Yr + G.Yp) / 2, DHT, { a:"end", fs:fs, c:"var(--en-dh)", w:700, halo:true, op:op });
  }
  if (o.levels) {
    var below = function(yv){ return yv + fs + 2 > g.yb + 6 ? yv - fs + 2 : yv + fs; };
    h += tx(G.xR + 0.02 * G.w, below(G.Yr), "Reactants" + (o.vals ? " " + fx(o.r, 0) + " kJ" : ""), { fs:fs - 1, c:"var(--ink-2)", halo:true, op:op });
    h += tx(G.xP - 0.04 * G.w, below(G.Yp), "Products" + (o.vals ? " " + fx(o.p, 0) + " kJ" : ""), { fs:fs - 1, c:"var(--ink-2)", halo:true, op:op });
    if (o.pkLab) h += tx(G.px, G.Ypk - fs, o.pkLab, { fs:fs - 1, c:"var(--ink-2)", halo:true, op:op });
  }
  return h;
}

// ---------- hero ----------
function hero(f){
  var svg = $("#ct-hx-svg"), ctr = $("#ct-hx-ctr"), rep = $("#ct-hx-replay"), cap = f.cap;
  if (!svg) return;
  var BX = 12, BY = 14, BW = 226, BH = 200, RP = 8, run = 0, sim, st, ticks, raf = 0;
  var HG = { xa:268, w:200, yt:46, yb:190, lo:-40, hi:60, fs:11 }, HO = { r:0, pk:50, p:-30 };
  var HGm = geom(HG, HO);
  function reset(){ sim = Sim({ seed:30, nA:6, nB:6, W:BW, H:BH, r:RP, v:1 }); ticks = []; st = { coll:0, eff:0, hill:0.35, dot:-1, glow:0, full:0, ab:null, pair:null }; }
  function on(i){ return !st.pair || (i !== st.pair[0] && i !== st.pair[1]) || !st.ab; }
  function hillPt(t){   // a point riding the profile, t 0..1 from the reactant plateau to the product plateau
    var G = HGm, x = lerp(G.rx1 - 0.1 * G.w, G.qx0 + 0.1 * G.w, t), y;
    var bx = [G.rx1, G.rx1 + 0.12 * G.w, G.px - 0.09 * G.w, G.px], by = [G.Yr, G.Yr, G.Ypk, G.Ypk], cx = [G.px, G.px + 0.09 * G.w, G.qx0 - 0.12 * G.w, G.qx0], cy = [G.Ypk, G.Ypk, G.Yp, G.Yp];
    function bz(a, u){ var v = 1 - u; return v * v * v * a[0] + 3 * v * v * u * a[1] + 3 * v * u * u * a[2] + u * u * u * a[3]; }
    if (x <= G.rx1) return [x, G.Yr]; if (x >= G.qx0) return [x, G.Yp];
    var arr = x <= G.px ? [bx, by] : [cx, cy], lo = 0, hi = 1;
    for (var i = 0; i < 30; i++) { var m = (lo + hi) / 2; if (bz(arr[0], m) < x) lo = m; else hi = m; }
    y = bz(arr[1], (lo + hi) / 2); return [x, y];
  }
  function draw(){
    var h = rect(BX, BY, BW, BH, "none", { s:"var(--ink-2)", sw:1.6, rx:6 }) + '<g transform="translate(' + BX + "," + BY + ')">';
    sim.P.forEach(function(p, i){ if (st.ab && st.pair && (i === st.pair[0] || i === st.pair[1])) return; h += partSVG(p, RP); });
    ticks.forEach(function(t){ h += tickSVG(t.x, t.y, t.age); });
    if (st.ab) h += circ(st.ab.x, st.ab.y, 14, "var(--hi)", { op:0.45 * st.glow }) + abSVG(st.ab.x, st.ab.y, 7);
    h += "</g>";
    h += profSVG(HG, { r:0, pk:50, p:-30, ea:st.full > 0, dh:st.full > 0, labels:st.full > 0, levels:st.full > 0, pkLab:"activated complex", op:st.full, pathOp:st.hill });
    if (st.dot >= 0) { var q = hillPt(st.dot); h += circ(q[0], q[1], 9, "var(--hi)", { op:0.5 * st.glow }) + circ(q[0], q[1], 5, "var(--ink)"); }
    svg.innerHTML = h;
  }
  function counter(){ ctr.innerHTML = "Collisions: " + fx(Math.round(st.coll), 0) + " · effective: " + st.eff; }
  function final(){
    cancelAnimationFrame(raf); raf = 0; reset();
    var p = sim.P[0], q = sim.P[6]; st.pair = [0, 6]; st.ab = { x:(p.x + q.x) / 2, y:(p.y + q.y) / 2 }; st.glow = 0; st.hill = 1; st.full = 1; st.dot = -1;
    draw(); ctr.innerHTML = "<strong>1 effective out of 400 collisions.</strong>";
    cap.innerHTML = "Most collisions bounce; only an energetic, end-on hit gets over the hill."; rep.hidden = false;
  }
  function play(){
    var id = ++run; reset(); rep.hidden = true; cap.textContent = ""; draw(); counter();
    function ok(){ return id === run; }
    var T0 = null, phase = 0;
    function frame(ts){
      raf = 0; if (!ok()) return;
      if (T0 == null) T0 = ts; var el = (ts - T0) / 1000, dt = 1 / 60;
      if (phase === 0) {
        var ev = sim.step(dt, on, 70); ev.forEach(function(e){ if (ticks.length < 10) ticks.push({ x:e.x, y:e.y, age:0 }); });
        ticks.forEach(function(t){ t.age += dt; }); ticks = ticks.filter(function(t){ return t.age < 0.2; });
        st.coll = Math.min(399, el / 3.4 * 399); counter(); draw();
        if (el >= 3.4) { phase = 1; startHit(); return; }
      }
      raf = requestAnimationFrame(frame);
    }
    function startHit(){
      // the fastest A and the nearest B meet end-on in the middle of the box
      var a = sim.P[0], b = sim.P[6], ax0 = a.x, ay0 = a.y, bx0 = b.x, by0 = b.y, mx = BW / 2, my = BH / 2;
      st.pair = [0, 6]; ctr.innerHTML = "A fast pair hits end-on…";
      MV.tween({ dur:700, step:function(t){ if (!ok()) return; a.x = lerp(ax0, mx - RP, t); a.y = lerp(ay0, my, t); b.x = lerp(bx0, mx + RP, t); b.y = lerp(by0, my, t); a.o = 0; b.o = Math.PI; draw(); }, done:function(){
        if (!ok()) return;
        st.dot = 0; st.glow = 1;
        MV.tween({ dur:1300, ease:LIN, step:function(t){ if (!ok()) return; st.dot = t; st.glow = 1 - Math.abs(t - 0.5) * 1.2; st.hill = 0.35 + 0.65 * Math.min(1, t * 2); draw(); }, done:function(){
          if (!ok()) return;
          st.ab = { x:mx, y:my }; st.glow = 1; st.coll = 400; st.eff = 1; st.dot = -1;
          ctr.innerHTML = "<strong>1 effective out of 400 collisions.</strong>"; draw();
          MV.wait(700, function(){
            if (!ok()) return;
            MV.tween({ dur:900, step:function(t){ if (!ok()) return; st.full = t; st.glow = 1 - t; draw(); }, done:function(){ if (ok()) final(); } });
          });
        } });
      } });
    }
    raf = requestAnimationFrame(frame);
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Particle box ----------
var BOX = { W:400, H:250, r:8 };
var DG = { xa:70, w:380, yt:22, yb:272, lo:-100, hi:120, fs:12, axis:true, step:20 };
function catPk(d){ return Math.max(d.pk - 20, Math.max(d.r, d.p) + 5); }
function explore(host, api){
  var S = api.S, C = api.content;
  if (["box", "curve", "dia"].indexOf(S.mode) < 0) S.mode = "box";
  if (!(S.a in CONC)) S.a = "1"; if (!(S.b in CONC)) S.b = "1";
  if (C.temps.indexOf(+S.T) < 0) S.T = 300; S.T = +S.T;
  if (!(S.cat in EAC)) S.cat = "none";
  var D = S.dia = S.dia && typeof S.dia === "object" ? S.dia : {};
  function nz(v, d){ v = Math.round(+v / 5) * 5; return isFinite(v) ? v : d; }
  D.r = clamp(nz(D.r, 0), -80, 60); D.p = clamp(nz(D.p, -30), -80, 100); D.pk = clamp(nz(D.pk, 50), -60, 120); if (D.pk < Math.max(D.r, D.p) + 5) D.pk = Math.max(D.r, D.p) + 5;
  D.cat = !!D.cat; D.rev = !!D.rev;
  if (typeof S.rev !== "string") S.rev = "";
  var T3 = S.tc3 = S.tc3 && typeof S.tc3 === "object" ? S.tc3 : {};
  if (["conc", "cat"].indexOf(T3.pred) < 0) T3.pred = ""; if (["conc", "cat"].indexOf(T3.fin) < 0) T3.fin = "";
  T3.tc = !!T3.tc; T3.tk = !!T3.tk; if (typeof T3.eC !== "string") T3.eC = ""; if (typeof T3.eK !== "string") T3.eK = "";

  var busy = false, note = "", paused = false, t = 0, speed = 1, stopAt = null, stopCb = null, raf = 0, last = 0, inView = true;
  var sim = Sim({ seed:3030, nA:24, nB:24, W:BOX.W, H:BOX.H, r:BOX.r }), flashes = [], ticks = [], effShown = 0, curT = null, catT = null, revT = null;
  var concOpts = C.concs.map(function(c){ return { id:c.id, t:c.t }; });

  host.innerHTML = '<p class="how ct-how">' + C.how + '</p><div class="ct-modes"></div><div class="ct-grid">' +
    '<div class="ct-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="ct-pane" data-pane="box"><div class="ct-frame"><svg class="ct-svg" id="ct-box" viewBox="0 0 ' + BOX.W + " " + BOX.H + '" role="img" aria-label=""></svg></div>' +
        '<p class="ct-ctr" id="ct-ctr"></p><p class="tiny muted ct-leg"><span class="ct-key ct-ka" aria-hidden="true"></span> A &nbsp; <span class="ct-key ct-kb" aria-hidden="true"></span> B &nbsp; <span class="ct-key ct-ke" aria-hidden="true"></span> reactive end &nbsp; <span class="ct-key ct-kab" aria-hidden="true"></span> product AB</p>' +
        '<div class="ct-boxbtns"></div></div>' +
      '<div class="ct-pane" data-pane="curve"><div class="ct-frame"><canvas class="plot" id="ct-curve" role="img" aria-label=""></canvas></div><p class="tiny muted ct-leg">Solid: now. Dashed grey: 300 K for comparison. Shaded: particles with <i>E</i> ≥ ' + EA + ".</p></div>" +
      '<div class="ct-pane" data-pane="dia"><div class="ct-frame"><svg class="ct-svg ct-dsvg" id="ct-dia" viewBox="0 0 460 300" role="group" aria-label="Diagram builder"></svg></div></div>' +
      '<p class="ct-cap" aria-live="polite"></p></div>' +
    '<div class="ct-side"><div class="ct-c" data-for="bc"><div class="ct-ra"></div><div class="ct-rb"></div><div class="ct-rt"></div><p class="tiny ct-fixed">Activation energy (no catalyst): <strong>50 kJ/mol</strong> (fixed)</p><div class="ct-rc"></div></div>' +
      '<div class="ct-c" data-for="dia"><div class="ct-levels"></div><div class="ct-dbtns"></div><div class="numrow ct-revrow"><label for="ct-rev">' + EA + '(reverse) from your diagram:</label><input class="numin" id="ct-rev" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"><span>kJ</span></div></div>' +
      '<dl class="read ct-read" aria-live="polite"></dl>' +
      '<div class="ct-c ct-tc3" data-for="bc"><h4 class="ct-h4">Challenge 3 workspace</h4><div class="ct-t3pred"></div><p class="tiny ct-t3tested" aria-live="polite"></p>' +
        '<div class="numrow"><label for="ct-ec">' + C.tc3.eConc + '</label><input class="numin ct-sm" id="ct-ec" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"></div>' +
        '<div class="numrow"><label for="ct-ek">' + C.tc3.eCat + '</label><input class="numin ct-sm" id="ct-ek" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"></div><div class="ct-t3fin"></div></div>' +
    "</div></div>" +
    '<details class="alg ct-model"><summary>About this model</summary>' + C.model + "</details>";
  var boxSvg = $("#ct-box"), ctrEl = $("#ct-ctr"), diaSvg = $("#ct-dia"), capEl = $(".ct-cap", host), readEl = $(".ct-read", host);
  var revIn = $("#ct-rev"), ecIn = $("#ct-ec"), ekIn = $("#ct-ek");
  revIn.value = S.rev; ecIn.value = T3.eC; ekIn.value = T3.eK;

  // ----- controls -----
  var RG = {};
  function setCond(k, v){ S[k] = v; t = 0; effShown = 0; flashes = []; note = ""; track(); api.save(); paint(); MV.changed(); kick(); }
  RG.mode = radios($(".ct-modes", host), { label:"Mode", aria:"Particle box mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; note = ""; api.save(); paint(); kick(); } });
  RG.a = radios($(".ct-ra", host), { label:"Concentration of A", cls:"chips", aria:"Concentration of A relative to standard", options:concOpts, value:S.a, onChange:function(v){ setCond("a", v); } });
  RG.b = radios($(".ct-rb", host), { label:"Concentration of B", cls:"chips", aria:"Concentration of B relative to standard", options:concOpts, value:S.b, onChange:function(v){ setCond("b", v); } });
  RG.T = radios($(".ct-rt", host), { label:"Temperature", cls:"chips", aria:"Temperature in kelvins", options:C.temps.map(function(T){ return { id:String(T), t:T + " K" }; }), value:String(S.T), onChange:function(v){ setCond("T", +v); } });
  RG.cat = radios($(".ct-rc", host), { label:"Catalyst", cls:"chips", aria:"Catalyst", options:C.cats.map(function(c){ return { id:c.id, t:c.t }; }), value:S.cat, onChange:function(v){ setCond("cat", v); } });
  RG.pred = radios($(".ct-t3pred", host), { label:C.tc3.pred, cls:"chips", aria:"Challenge 3 prediction", options:C.tc3.opts, value:T3.pred, onChange:function(v){ T3.pred = v; track(); api.save(); paintT3(); MV.changed(); } });
  RG.fin = radios($(".ct-t3fin", host), { label:C.tc3.final, cls:"chips", aria:"Challenge 3 answer", options:C.tc3.opts, value:T3.fin, onChange:function(v){ T3.fin = v; api.save(); MV.changed(); } });
  function syncRG(){ RG.mode.set(S.mode); RG.a.set(S.a); RG.b.set(S.b); RG.T.set(String(S.T)); RG.cat.set(S.cat); RG.pred.set(T3.pred); RG.fin.set(T3.fin); }
  function lock(b){ Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); [revIn, ecIn, ekIn].forEach(function(el){ el.disabled = b; }); paintDiaCtl(); paintBoxBtns(); }

  // tested states for challenge 3 (counted only after a prediction)
  function track(){
    if (!T3.pred || S.T !== 300) return;
    if (S.cat === "none" && ((S.a === "2" && S.b === "1") || (S.a === "1" && S.b === "2"))) T3.tc = true;
    if (S.cat === "X" && S.a === "1" && S.b === "1") T3.tk = true;
  }
  function paintT3(){ $(".ct-t3tested", host).innerHTML = "Tested from the standard settings: doubling [A] " + (T3.tc ? "✓" : "–") + " · catalyst X " + (T3.tk ? "✓" : "–") + (T3.pred ? "" : " (predict first)"); }

  [[revIn, function(v){ S.rev = v; }], [ecIn, function(v){ T3.eC = v; }], [ekIn, function(v){ T3.eK = v; }]].forEach(function(p){
    p[0].addEventListener("input", function(){ p[1](p[0].value); api.save(); MV.changed(); });
  });

  // ----- box buttons -----
  var bb = $(".ct-boxbtns", host);
  function paintBoxBtns(){
    MV.keepFocus(bb, function(){
      bb.innerHTML = '<button type="button" class="btn ghost sm" data-k="ctpause" data-b="pause"' + (busy ? " disabled" : "") + ">" + (paused ? "Play" : "Pause") + '</button><button type="button" class="btn ghost sm" data-k="ctreset" data-b="reset"' + (busy ? " disabled" : "") + ">Reset counters</button>";
    });
  }
  bb.addEventListener("click", function(e){
    var b = e.target.closest("[data-b]"); if (!b || b.disabled) return;
    if (b.dataset.b === "pause") { paused = !paused; paintBoxBtns(); kick(); }
    else { t = 0; effShown = 0; flashes = []; drawBox(); }
  });

  // ----- diagram builder controls -----
  var lv = $(".ct-levels", host), db = $(".ct-dbtns", host);
  var LV = [{ k:"r", t:"Reactants" }, { k:"pk", t:"Peak (activated complex)" }, { k:"p", t:"Products" }];
  lv.innerHTML = LV.map(function(L){ return '<div class="numrow"><label for="ct-l' + L.k + '">' + L.t + ':</label><input class="numin ct-sm" id="ct-l' + L.k + '" data-lv="' + L.k + '" type="number" step="5" inputmode="numeric"><span>kJ</span></div>'; }).join("");
  function paintLv(){ LV.forEach(function(L){ var el = $("#ct-l" + L.k); if (document.activeElement !== el) el.value = D[L.k]; el.disabled = busy; }); }
  function setLevel(k, v){
    v = Math.round(v / 5) * 5; if (!isFinite(v)) return;
    if (k === "r") v = clamp(v, -80, Math.min(60, D.pk - 5));
    else if (k === "p") v = clamp(v, -80, Math.min(100, D.pk - 5));
    else v = clamp(v, Math.max(D.r, D.p) + 5, 120);
    if (v === D[k]) return false;
    D[k] = v; note = ""; api.save(); paintDia(); paintRead(); MV.changed(); return true;
  }
  lv.addEventListener("change", function(e){ var k = e.target.dataset.lv; if (!k) return; var v = parseFloat(String(e.target.value).replace("−", "-")); if (isFinite(v)) setLevel(k, v); e.target.value = D[k]; });
  function paintDiaCtl(){
    MV.keepFocus(db, function(){
      db.innerHTML = '<button type="button" class="btn ghost sm" data-k="ctcat" data-d="cat" aria-pressed="' + D.cat + '"' + (busy ? " disabled" : "") + ">Catalysed path: " + (D.cat ? "on" : "off") + '</button><button type="button" class="btn ghost sm" data-k="ctrv" data-d="rev" aria-pressed="' + D.rev + '"' + (busy ? " disabled" : "") + ">" + EA + "(reverse) arrow: " + (D.rev ? "on" : "off") + "</button>";
    });
    paintLv();
  }
  db.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (!b || b.disabled) return; D[b.dataset.d] = !D[b.dataset.d]; note = ""; api.save(); paintDiaCtl(); paintDia(); paintRead(); });

  // drag + keys on the diagram handles
  var drag = null;
  function svgY(e){ var pt = diaSvg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; var m = diaSvg.getScreenCTM(); return m ? pt.matrixTransform(m.inverse()).y : 0; }
  diaSvg.addEventListener("pointerdown", function(e){ var hd = e.target.closest("[data-h]"); if (!hd || busy) return; e.preventDefault(); drag = hd.dataset.h; try { diaSvg.setPointerCapture(e.pointerId); } catch (er) {} hd.focus({ preventScroll:true }); });
  diaSvg.addEventListener("pointermove", function(e){ if (!drag) return; var G = geom(DG, { r:D.r, pk:D.pk, p:D.p }); if (setLevel(drag, G.vOf(svgY(e)))) { paintLv(); refocus(drag); } });
  function endDrag(){ drag = null; }
  diaSvg.addEventListener("pointerup", endDrag); diaSvg.addEventListener("pointercancel", endDrag);
  diaSvg.addEventListener("keydown", function(e){
    var hd = e.target.closest("[data-h]"); if (!hd || busy) return;
    var d = e.key === "ArrowUp" || e.key === "ArrowRight" ? 5 : e.key === "ArrowDown" || e.key === "ArrowLeft" ? -5 : e.key === "PageUp" ? 20 : e.key === "PageDown" ? -20 : 0; if (!d) return;
    e.preventDefault(); var k = hd.dataset.h; if (setLevel(k, D[k] + d)) { paintLv(); refocus(k); }
  });
  function refocus(k){ var el = diaSvg.querySelector('[data-h="' + k + '"]'); if (el) el.focus({ preventScroll:true }); }

  // ----- drawing -----
  function nA(){ return Math.round(8 * CONC[S.a]); } function nB(){ return Math.round(8 * CONC[S.b]); }
  function onP(i){ return i < 24 ? i < nA() : i - 24 < nB(); }
  function drawBox(){
    var h = rect(1, 1, BOX.W - 2, BOX.H - 2, "none", { s:"var(--ink-2)", sw:1.6, rx:6 });
    sim.P.forEach(function(p, i){ if (onP(i)) h += partSVG(p, BOX.r); });
    ticks.forEach(function(k){ h += tickSVG(k.x, k.y, k.age); });
    flashes.forEach(function(f){ h += flashSVG(f.x, f.y, f.age); });
    boxSvg.innerHTML = h;
    var M = modelOf(S), effN = Math.floor(M.eff * t + 1e-9);
    ctrEl.innerHTML = "Collisions: <strong>" + fx(Math.round(M.coll * t), 0) + "</strong> · Effective: <strong>" + fx(effN, 0) + "</strong> · Model time: " + fx(t, 1) + " s";
  }
  function boxAria(){ var M = modelOf(S); boxSvg.setAttribute("aria-label", "Particle box: " + nA() + " A particles and " + nB() + " B particles at " + S.T + " K" + (S.cat === "none" ? "" : " with catalyst " + S.cat) + ". " + fx(Math.round(M.coll), 0) + " collisions per second; " + fx(M.eff, 1) + " effective collisions per second."); }
  var plot = new MV.Plot($("#ct-curve"), { xmin:-1.5, xmax:XMAX, ymin:-0.004, ymax:0.078 });
  plot.render = function(){
    var T = curT == null ? S.T : curT, th = thetaOf(T), th0 = thetaOf(300), ea = EAC[S.cat], xl = xLine(ea), fr = fracOf(T, ea);
    var pen = MV.css("--pen"), ink2 = MV.css("--ink-2"), eac = MV.css("--en-ea");
    plot.draw({ view:{ xmin:-1.5, xmax:XMAX, ymin:-0.004, ymax:0.078 }, grid:false, ticks:false, xLabel:"Energy (not to scale)", yLabel:"Number of particles",
      regions:[{ f:function(E){ return mb(E, th); }, x0:xl, x1:XMAX, color:MV.css("--hi-soft") }],
      curves:[{ f:function(E){ return mb(E, th0); }, color:ink2, width:2, dash:[6, 6], domain:[0, XMAX] }, { f:function(E){ return mb(E, th); }, color:pen, width:3.2, domain:[0, XMAX] }],
      segments:[{ x1:xl, y1:0, x2:xl, y2:0.07, color:eac, width:2.6 }],
      labels:[{ x:xl, y:0.072, text:"Eₐ = " + ea + " kJ/mol", color:eac, align:"center" },
        { x:Math.max(xl, 20) + 1.5, y:0.012 + mb(Math.max(xl, 20), th) , text:"shaded: " + pct(fr), color:MV.css("--ink"), align:"left", bg:true },
        { x:th * 0.5 + 2.2, y:mb(th * 0.5, th) + 0.003, text:fx(r1(T), 0) + " K", color:pen, align:"left" }],
      describe:"Maxwell–Boltzmann energy curve at " + fx(Math.round(T), 0) + " K, with the 300 K curve dashed for comparison. A vertical line marks Ea = " + ea + " kJ/mol; the shaded tail beyond it is " + pct(fr) + " of the particles." });
  };
  function paintDia(){
    var o = { r:D.r, pk:D.pk, p:D.p, cpk:(D.cat || catT != null) ? (catT != null ? lerp(D.pk, catPk(D), catT) : catPk(D)) : null, ea:true, dh:true, rev:D.rev || revT != null, revT:revT, cea:false, labels:true, levels:true, vals:true };
    var G = geom(DG, o), h = profSVG(DG, o);
    LV.forEach(function(L){
      var x = L.k === "r" ? G.xR : L.k === "p" ? G.xP : G.px, y = L.k === "r" ? G.Yr : L.k === "p" ? G.Yp : G.Ypk;
      var lo = L.k === "pk" ? Math.max(D.r, D.p) + 5 : -80, hi = L.k === "r" ? Math.min(60, D.pk - 5) : L.k === "p" ? Math.min(100, D.pk - 5) : 120;
      h += '<g class="ct-hd" data-h="' + L.k + '" tabindex="' + (busy ? -1 : 0) + '" role="slider" aria-label="' + L.t + ' level" aria-valuemin="' + lo + '" aria-valuemax="' + hi + '" aria-valuenow="' + D[L.k] + '" aria-valuetext="' + MV.plain(fx(D[L.k], 0)) + ' kJ">' +
        circ(x, y, 18, "transparent") + circ(x, y, 8.5, "var(--sheet)", { s:"var(--ink)", sw:2.4 }) + ln(x, y - 4, x, y + 4, { c:"var(--ink)", w:1.6 }) + "</g>";
    });
    diaSvg.innerHTML = h;
  }
  function diaVals(){ var ef = D.pk - D.r, dh = D.p - D.r; return { ef:ef, dh:dh, er:ef - dh, cf:catPk(D) - D.r, cr:catPk(D) - D.p }; }
  function paintRead(){
    var rows;
    if (S.mode === "dia") {
      var v = diaVals();
      rows = [[EA + " forward / " + EA + " reverse / " + DH, fx(v.ef, 0) + " / " + fx(v.er, 0) + " / " + sg(v.dh) + " kJ"],
        ["Reaction", v.dh < 0 ? "exothermic (products lower)" : v.dh > 0 ? "endothermic (products higher)" : DH + " = 0"]];
      if (D.cat) rows.push(["Catalysed " + EA + " forward / reverse", fx(v.cf, 0) + " / " + fx(v.cr, 0) + " kJ"]);
    } else {
      var M = modelOf(S);
      rows = [["Collisions per second", fx(Math.round(M.coll), 0)], ["Fraction with <i>E</i> ≥ " + EA, pct(M.fr)], ["Right orientation", "25%"],
        ["Effective collisions per second", fx(M.eff, 1)], ["Compared with standard", "×" + fx(M.ratio, 1)]];
    }
    readEl.innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){ capEl.innerHTML = note; }
  function paint(){
    [].forEach.call(host.querySelectorAll("[data-pane]"), function(el){ el.hidden = el.dataset.pane !== S.mode; });
    [].forEach.call(host.querySelectorAll("[data-for]"), function(el){ el.hidden = el.dataset.for === "dia" ? S.mode !== "dia" : S.mode === "dia"; });
    syncRG(); paintBoxBtns(); paintDiaCtl(); paintT3(); paintRead(); paintCap(); boxAria();
    if (S.mode === "box") drawBox(); else if (S.mode === "curve") plot.render(); else paintDia();
  }

  // ----- animation loop (box) -----
  function loopOn(){ return S.mode === "box" && !paused && !MV.reduceMotion && inView; }
  function kick(){ if (!raf && loopOn()) { last = 0; raf = requestAnimationFrame(frame); } }
  function frame(ts){
    raf = 0; if (!loopOn()) return;
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
    advance(dt);
    drawBox(); raf = requestAnimationFrame(frame);
  }
  function advance(dt){
    var M = modelOf(S);
    t += dt * speed;
    if (stopAt != null && t >= stopAt) { t = stopAt; paused = true; var cb = stopCb; stopAt = null; stopCb = null; if (cb) MV.wait(10, cb); }
    var ev = sim.step(dt, onP, 60 * Math.sqrt(S.T / 300) * (speed > 1 ? 1.6 : 1));
    ev.forEach(function(e){ if (ticks.length < 14) ticks.push({ x:e.x, y:e.y, age:0 }); });
    ticks.forEach(function(k){ k.age += dt; }); ticks = ticks.filter(function(k){ return k.age < 0.2; });
    var effN = Math.floor(M.eff * t + 1e-9), spawn = 0;
    while (effShown < effN && spawn < 2) { effShown++; spawn++; if (flashes.length < 6) { var vis = []; sim.P.forEach(function(p, i){ if (i < 24 && onP(i)) vis.push(p); }); var p = vis[effShown % Math.max(1, vis.length)]; if (p) flashes.push({ x:p.x, y:p.y, age:0 }); } }
    if (effShown < effN - 3) effShown = effN;
    flashes.forEach(function(f){ f.age += dt; }); flashes = flashes.filter(function(f){ return f.age < 0.9; });
  }
  if (typeof IntersectionObserver === "function") new IntersectionObserver(function(en){ inView = en[0].isIntersecting; kick(); }).observe($(".ct-view", host));
  // reduced motion: a still frame; the counters step every second
  if (MV.reduceMotion) setInterval(function(){ if (S.mode === "box" && !paused && !busy && inView && !document.hidden) { t += 1; drawBox(); } }, 1000);

  // ----- predictions -----
  function standard(){ S.a = "1"; S.b = "1"; S.T = 300; S.cat = "none"; t = 0; effShown = 0; flashes = []; }
  var hooks = {
    start:function(p){
      busy = true; note = ""; curT = null; catT = null; revT = null; stopAt = null; stopCb = null;
      if (p.id === "p1") { S.mode = "box"; standard(); paused = true; }
      else if (p.id === "p2") { S.mode = "curve"; standard(); }
      else { S.mode = "dia"; D.r = 0; D.pk = 50; D.p = -30; D.cat = false; D.rev = false; }
      api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(n){ note = n || ""; busy = false; curT = null; catT = null; revT = null; lock(false); api.save(); paint(); MV.changed(); MV.wait(150, done); }
      if (p.id === "p1") {
        if (MV.reduceMotion || !inView) { t = 10; drawBox(); fin("After 10 s: 20 000 collisions, 50 effective (0.25%)."); return; }
        speed = 2.5; paused = false; stopAt = 10; stopCb = function(){ speed = 1; fin("After 10 s: 20 000 collisions, 50 effective (0.25%)."); }; paintBoxBtns(); kick();
      } else if (p.id === "p2") {
        MV.tween({ dur:1600, step:function(k){ curT = 300 + 10 * k; plot.render(); }, done:function(){ S.T = 310; fin("Collisions ×1.02; shaded tail ×1.9 (1.0% → 1.9%)."); } });
      } else if (p.id === "p3") {
        MV.tween({ dur:1400, step:function(k){ catT = k; paintDia(); }, done:function(){ D.cat = true; fin("The catalysed path peaks at 30 kJ; the reactant and product levels don’t move."); } });
      } else {
        MV.tween({ dur:1400, step:function(k){ revT = k; paintDia(); }, done:function(){ D.rev = true; fin(EA + "(reverse) = 50 − (−30) = 80 kJ, from the products up to the peak."); } });
      }
    }
  };

  // ----- challenges -----
  function chal(id, opt){
    var live = opt && opt.live;
    if (id === "tc1") {
      var M = modelOf(S), one = (S.a === "2" && S.b === "1") || (S.a === "1" && S.b === "2");
      if (S.T === 300 && S.cat === "none" && one) return { ok:true };
      if (live) return { ok:false };
      if (S.T !== 300) return { ok:false, msg:"Leave temperature at 300 K." };
      if (S.cat !== "none") return { ok:false, msg:"Take the catalyst out: this one is about concentration." };
      if (S.a === "2" && S.b === "2") return { ok:false, msg:"That’s four times as many (20.0 per second)." };
      return { ok:false, msg:"Effective collisions are " + fx(M.eff, 1) + " per second; you need 10.0." };
    }
    if (id === "tc2") {
      var v = diaVals(), rv = numIn(S.rev);
      if (v.ef === 40 && v.dh === 25 && rv === 15) return { ok:true };
      if (live) return { ok:false };
      if (v.dh < 0) return { ok:false, msg:"Endothermic means the products are higher." };
      if (v.ef !== 40 && D.pk - D.p === 40) return { ok:false, msg:"Your peak is 40 kJ above the products. " + EA + " is measured from the <strong>reactants</strong> up to the peak." };
      if (v.ef !== 40) return { ok:false, msg:EA + "(forward) is " + fx(v.ef, 0) + " kJ. The peak must be 40 kJ above the reactants." };
      if (v.dh !== 25) return { ok:false, msg:DH + " is " + sg(v.dh) + " kJ. The products must be 25 kJ above the reactants." };
      if (rv == null) return { ok:false, msg:"The diagram is right. Now read " + EA + "(reverse) off it and type it in the box." };
      if (rv === 65) return { ok:false, msg:EA + "(reverse) = " + EA + "(forward) − " + DH + ". The reverse climb starts from the products: 40 − 25." };
      return { ok:false, msg:EA + "(reverse) runs from the products up to the peak." };
    }
    if (id === "tc3") {
      var ec = numIn(T3.eC), ek = numIn(T3.eK);
      if (T3.pred && T3.tc && T3.tk && ec != null && ek != null && Math.abs(ec - 2) <= 0.1 + 1e-9 && Math.abs(ek - 7.4) <= 0.1 + 1e-9 && T3.fin === "cat") return { ok:true };
      if (live) return { ok:false };
      if (!T3.pred) return { ok:false, msg:"Predict first: choose a chip under “Your prediction” in the Challenge 3 workspace." };
      if (!T3.tc || !T3.tk) return { ok:false, msg:"Test both from the standard settings (300 K): set A to ×2 with no catalyst, then set A back to ×1 and add catalyst X." };
      if (ec == null || ek == null) return { ok:false, msg:"Enter both factors, read from “Compared with standard”." };
      if (Math.abs(ek - 5) < 0.05) return { ok:false, msg:"Read the readout: 37.1 ÷ 5.0 = 7.4." };
      if (Math.abs(ec - 2) > 0.1) return { ok:false, msg:"Read the readout for doubling [A]: 10.0 ÷ 5.0 = 2.0." };
      if (Math.abs(ek - 7.4) > 0.1) return { ok:false, msg:"Read the readout: 37.1 ÷ 5.0 = 7.4." };
      if (T3.fin === "conc") return { ok:false, msg:"A 5 kJ/mol drop in " + EA + " multiplies the fraction by 7.4; doubling the concentration only doubles collisions." };
      return { ok:false, msg:"Choose your answer: which gives more effective collisions?" };
    }
    return { ok:false };
  }
  paint(); kick();
  return { predict:hooks, challenge:chal };
}

// ---------- Part 3: Catalysts at work ----------
function atomBall(x, y, r, el, lab){ var a = MV.chem.atom(el); return circ(x, y, r, a.fill, { s:a.line, sw:1.2 }) + tx(x, y + 0.5, lab || el, { fs:Math.round(r * 0.95), w:700, c:a.ink }); }
var MG = { xa:46, w:238, yt:16, yb:150, lo:-60, hi:100, fs:11 };
function miniDia(o, aria){ return '<svg class="ct-mini" viewBox="0 0 300 170" role="img" aria-label="' + esc(aria) + '">' + profSVG(MG, o) + "</svg>"; }
function convSVG(){
  var h = "";
  h += rect(10, 62, 70, 36, "var(--plot-grid)", { rx:4 }) + tx(45, 50, "exhaust in", { fs:12, c:"var(--ink-2)" }) + tx(45, 80, "CO, NO, HC", { fs:11, w:700 });
  h += rect(80, 30, 160, 100, "var(--sheet)", { s:"var(--ink)", sw:2, rx:14 });
  for (var i = 0; i < 9; i++) h += ln(96 + i * 16, 40, 96 + i * 16, 120, { c:"var(--at-m)", w:2.2 });
  for (var j = 0; j < 5; j++) h += ln(90, 44 + j * 18, 230, 44 + j * 18, { c:"var(--at-m)", w:1.2, op:0.6 });
  h += tx(160, 146, "honeycomb coated with Pt, Pd and Rh", { fs:11, c:"var(--ink-2)" });
  h += rect(240, 62, 70, 36, "var(--plot-grid)", { rx:4 }) + tx(275, 50, "cleaner out", { fs:12, c:"var(--ink-2)" }) + tx(275, 80, "CO₂, N₂, H₂O", { fs:11, w:700 });
  return '<svg class="ct-p3svg" viewBox="0 0 320 156" role="img" aria-label="A catalytic converter: exhaust with CO, NO and unburned hydrocarbons enters a honeycomb coated with platinum, palladium and rhodium; CO₂, N₂ and H₂O leave.">' + h + "</svg>";
}
function adsorbSVG(){
  var h = "", y0 = 120;
  for (var i = 0; i < 9; i++) h += atomBall(26 + i * 34, y0, 15, "Pt", "Pt");
  // CO stuck end-on (C down) and an O atom on the surface, meeting to make CO₂
  h += atomBall(94, y0 - 30, 11, "C") + atomBall(94, y0 - 52, 11, "O");
  h += atomBall(128, y0 - 26, 11, "O");
  h += ln(108, y0 - 30, 118, y0 - 27, { c:"var(--ink-2)", w:1.6, d:"3 3" });
  h += atomBall(230, y0 - 60, 11, "O") + atomBall(252, y0 - 60, 11, "C") + atomBall(274, y0 - 60, 11, "O") + tx(252, y0 - 82, "CO₂ leaves", { fs:11, c:"var(--ink-2)" });
  h += tx(94, y0 - 76, "held end-on", { fs:11, c:"var(--ink-2)" });
  return '<svg class="ct-p3svg" viewBox="0 0 320 140" role="img" aria-label="Zoom to the particles: a CO molecule sticks to the platinum surface by its carbon end, next to an adsorbed oxygen atom; they join in the right orientation and CO₂ leaves the surface.">' + h + "</svg>";
}
// model enzyme data (labelled model data; plan §6 risk 3): rises to a peak at 37 °C, falls sharply above about 45 °C
function enzRate(T){ var m = 40.9, w = 2.5; function g(x){ return Math.pow(2, (x - 37) / 10) * (1 - 1 / (1 + Math.exp(-(x - m) / w))); } return 100 * g(T) / g(37); }
function part3(host, api){
  var S = api.S, P = api.content;
  S.s1 = S.s1 && typeof S.s1 === "object" ? S.s1 : {}; S.s1.pick = S.s1.pick && typeof S.s1.pick === "object" ? S.s1.pick : {}; S.s1.done = !!S.s1.done;
  S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {}; S.s3 = typeof S.s3 === "number" ? S.s3 : -1; S.srt = S.srt && typeof S.srt === "object" ? S.srt : {};
  var m1 = "";
  host.innerHTML =
    '<section class="ct-st"><h3>' + P.s1.title + "</h3>" + P.s1.html + '<ul class="ct-rx"><li>' + MV.chem.f("CO -> CO2") + "</li><li>" + MV.chem.f("NO -> N2") + "</li><li>unburned hydrocarbons → " + MV.chem.f("CO2") + " and " + MV.chem.f("H2O") + "</li></ul>" +
      '<div class="ct-fig">' + convSVG() + '</div><details class="ct-zoom"><summary>Zoom to the particles</summary><div class="ct-zg">' + adsorbSVG() +
      miniDia({ r:0, pk:70, p:-40, cpk:30, ea:true, cea:true, labels:true, levels:true }, "Energy diagram: the solid uncatalysed path peaks high; the teal dashed catalysed path on the metal surface peaks lower; reactants and products are unchanged.") + "</div><p>" + P.s1.zoom + "</p></details>" +
      '<p class="ct-ask">' + P.s1.ask + '</p><div class="ct-s1"></div></section>' +
    '<section class="ct-st"><h3>' + P.s2.title + "</h3>" + P.s2.html + '<div class="ct-fig"><canvas class="plot" id="ct-enz" role="img" aria-label=""></canvas><p class="tiny muted">' + P.s2.cap + "</p></div>" +
      '<details class="ct-zoom"><summary>Zoom to the particles</summary><div class="ct-zg">' +
      miniDia({ r:0, pk:75, p:-50, cpk:35, ea:true, cea:true, labels:true, levels:true }, "At 37 °C: the enzyme’s dashed path has a much lower peak than the solid uncatalysed path.") +
      miniDia({ r:0, pk:75, p:-50, cpk:35, ea:true, labels:true, levels:true, catOp:0.18 }, "At 60 °C: the enzyme has denatured; its dashed lower path is gone (faded), leaving only the high uncatalysed barrier.") +
      "</div><p>Left: at 37 °C the enzyme’s active site holds the reactant in the right orientation, opening the low dashed path. Right: above about 45 °C the enzyme’s shape changes (it <strong>denatures</strong>), the dashed path is lost, and only the high barrier is left.</p></details>" +
      '<div class="ct-s2"></div></section>' +
    '<section class="ct-st"><h3>' + P.s3.title + "</h3>" + P.s3.html + '<div class="ct-s3"></div><p class="tiny muted">' + P.s3.preview + "</p>" +
      '<details class="ct-zoom"><summary>Zoom to the particles</summary><div class="ct-zg">' + miniDia({ r:0, pk:85, p:-45, cpk:50, ea:true, cea:true, labels:true, levels:true }, "Energy diagram for ammonia: the iron catalyst’s dashed path is lower than the solid path but is still a sizable barrier.") +
      "</div><p>N₂ and H₂ adsorb on the iron surface, where the strong N≡N bond weakens. The catalysed barrier is lower, but it’s still high enough that only hot particles clear it often.</p></details></section>" +
    '<section class="ct-st"><h3>' + P.sort.title + "</h3><p>" + P.sort.intro + '</p><div class="ct-sort"></div></section>';

  // Station 1: choose the two things that don't change
  var s1 = $(".ct-s1", host);
  function paintS1(){
    MV.keepFocus(s1, function(){
      var h = '<div class="chips ct-chips" role="group" aria-label="Things the catalyst does not change (choose two)">' + P.s1.opts.map(function(o){ var on = !!S.s1.pick[o.id]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-s1="' + o.id + '" data-k="s1' + o.id + '"' + (S.s1.done ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
      if (!S.s1.done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-k="s1chk" data-s1c="1">Check</button></div>';
      if (S.s1.done) h += MV.fbHTML("good", P.s1.good); else if (m1) h += m1;
      s1.innerHTML = h;
    });
  }
  s1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.s1) { S.s1.pick[b.dataset.s1] = !S.s1.pick[b.dataset.s1]; m1 = ""; api.save(); paintS1(); return; }
    if (b.dataset.s1c) {
      var picks = P.s1.opts.filter(function(o){ return S.s1.pick[o.id]; });
      if (picks.length !== 2) m1 = MV.fbHTML("", P.s1.two);
      else if (picks.every(function(o){ return MV.ok(o); })) { S.s1.done = true; m1 = ""; }
      else m1 = MV.fbHTML("bad", P.s1.bad + " Try again.");
      api.save(); paintS1(); MV.focusFb(s1);
    }
  });
  paintS1();

  // Station 2: model data graph + two questions
  var ep = new MV.Plot($("#ct-enz"), { xmin:0, xmax:70, ymin:0, ymax:115 });
  ep.render = function(){
    var pts = []; for (var T = 5; T <= 65; T += 5) pts.push({ x:T, y:enzRate(T) });
    ep.draw({ view:{ xmin:-4, xmax:72, ymin:-8, ymax:118 }, xTicks:{ step:10 }, yTicks:{ step:20 }, xLabel:"Temperature (°C)", yLabel:"Rate (% of fastest), model data",
      curves:[{ f:enzRate, color:MV.css("--pen"), width:3, domain:[0, 70] }], data:pts,
      labels:[{ x:37, y:108, text:"peak near 37 °C", color:MV.css("--ink"), align:"center" }],
      describe:"Model data: the rate rises from about 19% of the fastest at 10 °C to 100% near 37 °C, then falls sharply: about 34% at 45 °C, 8% at 50 °C and almost zero by 60 °C." });
  };
  ep.render();
  var s2 = $(".ct-s2", host), m2 = {};
  function paintS2(){
    MV.keepFocus(s2, function(){
      s2.innerHTML = P.s2.qs.map(function(q){
        var pick = S.s2[q.id], o = pick != null ? q.opts[pick] : null;
        var h = '<div class="q"><p class="q-prompt">' + q.prompt + '</p><div class="chips ct-chips" role="radiogroup" aria-label="' + esc(MV.plain(q.prompt)) + '">' + q.opts.map(function(c, k){ var on = pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-s2="' + q.id + '" data-o="' + k + '" data-k="s2' + q.id + k + '">' + c.t + "</button>"; }).join("") + "</div>";
        if (o) h += MV.fbHTML(MV.ok(o) ? "good" : "bad", o.fb + (MV.ok(o) ? "" : " Try again."));
        return h + "</div>";
      }).join("");
    });
  }
  s2.addEventListener("click", function(e){ var b = e.target.closest("[data-s2]"); if (!b) return; S.s2[b.dataset.s2] = +b.dataset.o; api.save(); paintS2(); });
  paintS2();

  // Station 3
  var s3 = $(".ct-s3", host);
  function paintS3(){
    MV.keepFocus(s3, function(){
      var o = S.s3 >= 0 ? P.s3.opts[S.s3] : null;
      s3.innerHTML = '<div class="opts" role="radiogroup" aria-label="Why run the ammonia plant hot?">' + P.s3.opts.map(function(c, k){ var on = S.s3 === k, cl = "opt" + (on ? (MV.ok(c) ? " right" : " wrong") : ""); return '<button type="button" role="radio" class="' + cl + '" aria-checked="' + on + '" data-s3="' + k + '" data-k="s3' + k + '"><span>' + c.t + "</span></button>"; }).join("") + "</div>" +
        (o ? MV.fbHTML(MV.ok(o) ? "good" : "bad", o.fb + (MV.ok(o) ? "" : " Try again.")) : "");
    });
  }
  s3.addEventListener("click", function(e){ var b = e.target.closest("[data-s3]"); if (!b) return; S.s3 = +b.dataset.s3; api.save(); paintS3(); });
  paintS3();

  // Homogeneous vs heterogeneous
  var so = $(".ct-sort", host);
  function paintSort(){
    MV.keepFocus(so, function(){
      so.innerHTML = P.sort.cards.map(function(c){
        var pick = S.srt[c.id], ok = pick && pick === MV.ans(c);
        var h = '<div class="ct-card' + (ok ? " ok" : "") + '"><p>' + c.t + '</p><div class="ct-cb">' + P.sort.boxes.map(function(bx){ var on = pick === bx.id; return '<button type="button" class="btn sm ' + (on ? "primary" : "ghost") + '" aria-pressed="' + on + '" data-sc="' + c.id + '" data-sb="' + bx.id + '" data-k="sc' + c.id + bx.id + '"' + (ok ? " disabled" : "") + ">" + bx.t + "</button>"; }).join("") + "</div>";
        if (pick) h += ok ? '<p class="fb good">✓ ' + c.why + "</p>" : '<p class="fb bad">✗ Not quite. Is the catalyst in the same phase as the reactants? Try the other box.</p>';
        return h + "</div>";
      }).join("");
    });
  }
  so.addEventListener("click", function(e){ var b = e.target.closest("[data-sc]"); if (!b || b.disabled) return; S.srt[b.dataset.sc] = b.dataset.sb; api.save(); paintSort(); });
  paintSort();
}

// ---------- Practice 1: Read the energy diagram (@component N8 profileTap — tap points, lettered arrows or lettered bands on a C4 profile) ----------
var TG = { xa:70, w:370, yt:22, yb:262, fs:12, axis:true, step:20 };
function tapAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function diaOf(it){ var d = a.dias[it.dia]; return { d:d, g:{ xa:TG.xa, w:TG.w, yt:TG.yt, yb:TG.yb, fs:TG.fs, axis:true, step:20, lo:it.dia === "d1" ? -60 : -20, hi:it.dia === "d1" ? 80 : 110 } }; }
  function targets(it, G, d){
    var L = [];
    if (it.set === "pts") {
      L.push({ id:"r", kind:"pt", x:G.xR, y:G.Yr, lab:"Point on the reactant level, " + d.r + " kJ" });
      L.push({ id:"pk", kind:"pt", x:G.px, y:G.Ypk, lab:"Top of the solid path, " + d.pk + " kJ" });
      if (d.cat != null) L.push({ id:"cpk", kind:"pt", x:G.px, y:G.Yc, lab:"Top of the dashed path, " + d.cat + " kJ" });
      L.push({ id:"p", kind:"pt", x:G.xP, y:G.Yp, lab:"Point on the product level, " + d.p + " kJ" });
    } else if (it.set === "arrows") {
      var ar = [{ id:"ea", x:G.xEa, y1:G.Yr, y2:G.Ypk, t:"from " + d.r + " kJ up to " + d.pk + " kJ" }];
      if (d.cat != null) ar.push({ id:"cea", x:G.xCea, y1:G.Yr, y2:G.Yc, t:"from " + d.r + " kJ up to " + d.cat + " kJ" });
      ar.push({ id:"rev", x:G.xRev, y1:G.Yp, y2:G.Ypk, t:"from " + d.p + " kJ up to " + d.pk + " kJ" });
      ar.push({ id:"dh", x:G.xDh, y1:G.Yr, y2:G.Yp, t:"from " + d.r + " kJ " + (d.p < d.r ? "down" : "up") + " to " + d.p + " kJ" });
      ar.forEach(function(A, i){ A.kind = "ar"; A.letter = "abcd"[i]; A.lab = "Arrow " + A.letter + ", " + A.t; L.push(A); });
    } else {
      L.push({ id:"rpk", kind:"band", x:G.xa + 2, w:G.rx1 - G.xa - 4, y1:G.Ypk, y2:G.Yr, letter:"a", lab:"Band a: between the reactant level and the peak, on the left" });
      L.push({ id:"rp", kind:"band", x:G.qx0 + 4, w:G.qx1 - G.qx0 - 4, y1:G.Yp, y2:G.Yr, letter:"b", lab:"Band b: between the reactant level and the product level, on the right" });
      L.push({ id:"ppk", kind:"band", x:G.px + 30, w:G.qx1 - G.px - 30, y1:G.Ypk, y2:G.Yp, letter:"c", lab:"Band c: between the product level and the peak" });
    }
    return L;
  }
  function itemHTML(it, i){
    var x = ist(it.id), D0 = diaOf(it), d = D0.d, o = { r:d.r, pk:d.pk, p:d.p, cpk:d.cat == null ? null : d.cat, levels:true, neutral:true };
    if (it.set === "arrows") o.guides = true;
    var G = geom(D0.g, o), right = MV.ans(it), sv = "";
    if (it.set === "bands") sv += ln(G.rx1, G.Yr, G.qx1, G.Yr, { c:"var(--ink-2)", w:1.2, d:"2 4" }) + ln(G.px, G.Ypk, G.qx1, G.Ypk, { c:"var(--ink-2)", w:1.2, d:"2 4" });
    sv += profSVG(D0.g, o);
    targets(it, G, d).forEach(function(T){
      var st = x.solved && T.id === right ? "ok" : (!x.solved && x.last === T.id ? "bad" : ""), dis = x.solved ? ' aria-disabled="true"' : "";
      sv += '<g class="ct-tg' + (st ? " " + st : "") + '" role="button" tabindex="' + (x.solved ? -1 : 0) + '" data-tg="' + T.id + '" data-k="' + it.id + T.id + '" aria-label="' + esc(T.lab) + '"' + dis + ">";
      if (T.kind === "pt") sv += circ(T.x, T.y, 16, "transparent") + circ(T.x, T.y, 7, "var(--sheet)", { s:"var(--ink)", sw:2.4 }) + '<circle class="ct-ring" cx="' + r1(T.x) + '" cy="' + r1(T.y) + '" r="12" fill="none" stroke-width="3"/>';
      else if (T.kind === "ar") sv += rect(T.x - 13, Math.min(T.y1, T.y2) - 6, 26, Math.abs(T.y2 - T.y1) + 12, "transparent") + varrow(T.x, T.y1, T.y2, "var(--ink-2)", { w:2.6 }) + '<rect class="ct-ring" x="' + r1(T.x - 12) + '" y="' + r1(Math.min(T.y1, T.y2) - 5) + '" width="24" height="' + r1(Math.abs(T.y2 - T.y1) + 10) + '" rx="6" fill="none" stroke-width="3"/>' + circ(T.x + 14, (T.y1 + T.y2) / 2, 9, "var(--sheet)", { s:"var(--ink-2)", sw:1.4 }) + tx(T.x + 14, (T.y1 + T.y2) / 2 + 0.5, T.letter, { fs:12, w:700 });
      else sv += rect(T.x, T.y1, T.w, T.y2 - T.y1, "var(--hi-soft)", { s:"var(--ink-2)", sw:1.2, d:"5 4" }) + '<rect class="ct-ring" x="' + r1(T.x) + '" y="' + r1(T.y1) + '" width="' + r1(T.w) + '" height="' + r1(T.y2 - T.y1) + '" fill="none" stroke-width="3"/>' + circ(T.x + T.w / 2, (T.y1 + T.y2) / 2, 10, "var(--sheet)", { s:"var(--ink-2)", sw:1.4 }) + tx(T.x + T.w / 2, (T.y1 + T.y2) / 2 + 0.5, T.letter, { fs:12, w:700 });
      sv += "</g>";
    });
    var h = '<div class="q" data-ti="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + '</div></div><p class="tiny muted ct-dn">' + d.name + ": reactants " + fx(d.r, 0) + " kJ, products " + sg(d.p) + " kJ" + (d.cat != null ? "; the teal dashed path is catalysed" : "") + ".</p>" +
      '<div class="ct-frame ct-tapf"><svg class="ct-svg" viewBox="0 0 460 290" role="group" aria-label="' + esc(d.name + ": energy diagram with tappable targets") + '">' + sv + "</svg></div>";
    if (!x.solved) h += '<div class="q-actions">' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id] + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(z){ return z.id === id; })[0]; }
  function choose(el){
    var bx = el.closest("[data-ti]"); if (!bx) return;
    var it = item(bx.dataset.ti), x = ist(it.id); if (x.solved) return;
    var id = el.dataset.tg;
    if (id === MV.ans(it)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.last = null; msgs[it.id] = null; }
    else { x.tries++; x.last = id; msgs[it.id] = it.fb; }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-ti="' + it.id + '"]'));
  }
  host.addEventListener("click", function(e){
    var tg = e.target.closest("[data-tg]"); if (tg) { choose(tg); return; }
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ti]"); if (!bx) return;
    if (b.dataset.act === "hint") { var x = ist(bx.dataset.ti); x.hint = Math.min(3, x.hint + 1); api.save(); paint(); }
  });
  host.addEventListener("keydown", function(e){ var tg = e.target.closest && e.target.closest("[data-tg]"); if (tg && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); choose(tg); } });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a reaction profile ----------
var TKG = { xa:70, w:370, yt:20, yb:262, lo:-80, hi:120, fs:12, axis:true, step:20 };
var task = (function(){
  var S = null, api = null, RG = {};
  var EAS = [20, 40, 60, 80, 100], DHS = [-60, -40, -20, 20, 40, 60], DROPS = [0, 20, 40];
  function read(){ return { ea:EAS.indexOf(S.ea) >= 0 ? S.ea : null, dh:DHS.indexOf(S.dh) >= 0 ? S.dh : null, drop:DROPS.indexOf(S.drop) >= 0 ? S.drop : null }; }
  function paint(){
    var d = read(), sv = $("#ct-tsvg"), rd = $("#ct-tread"), nt = $("#ct-tnote"); if (!sv) return;
    if (d.ea == null || d.dh == null || d.drop == null) {
      sv.innerHTML = tx(230, 140, "Choose all three values to see your profile.", { fs:14, c:"var(--ink-2)" });
      sv.setAttribute("aria-label", "No profile yet: choose all three values."); rd.innerHTML = ""; nt.textContent = ""; return;
    }
    var top = Math.max(0, d.dh), pk = Math.max(d.ea, top), cf = d.ea - d.drop, cpk = d.drop > 0 ? Math.max(cf, top) : null, notes = [];
    if (d.ea < d.dh) notes.push("A peak can’t sit below the products: with " + DH + " = " + sg(d.dh) + " kJ, " + EA + "(forward) must be at least " + d.dh + " kJ. The peak is drawn at the products.");
    if (d.drop > 0 && cf < top) notes.push("The catalysed barrier would be " + fx(cf, 0) + " kJ, below the " + (top > 0 ? "products" : "reactants") + "; it’s drawn flat there. Real catalysed barriers stay above both.");
    sv.innerHTML = profSVG(TKG, { r:0, pk:pk, p:d.dh, cpk:cpk, ea:true, rev:true, dh:true, cea:d.drop > 0, labels:true, levels:true, vals:true });
    var er = d.ea - d.dh;
    rd.innerHTML = MV.readoutHTML([[EA + "(forward)", fx(d.ea, 0) + " kJ" + (d.drop > 0 ? "; catalysed " + fx(cf, 0) + " kJ" : "")], [EA + "(reverse)", fx(er, 0) + " kJ" + (d.drop > 0 ? "; catalysed " + fx(er - d.drop, 0) + " kJ" : "")], [DH, sg(d.dh) + " kJ"]]);
    nt.innerHTML = notes.join(" ");
    sv.setAttribute("aria-label", MV.plain("Your profile: reactants 0 kJ, peak " + pk + " kJ, products " + sg(d.dh) + " kJ" + (d.drop > 0 ? "; catalysed peak " + cf + " kJ" : "; no catalyst") + ". Ea(forward) " + d.ea + " kJ, Ea(reverse) " + er + " kJ, ΔH " + sg(d.dh) + " kJ."));
  }
  function row(host, key, label, vals, fmt){
    RG[key] = radios(host, { label:label, cls:"chips", aria:MV.plain(label), options:vals.map(function(v){ return { id:String(v), t:fmt(v) }; }), value:S[key] == null ? "" : String(S[key]),
      onChange:function(v){ S[key] = +v; api.save(); paint(); api.update(); } });
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S;
      inp.innerHTML = '<div class="ct-trow" id="ct-tea"></div><div class="ct-trow" id="ct-tdh"></div><div class="ct-trow" id="ct-tdrop"></div>';
      row($("#ct-tea"), "ea", EA + "(forward) without a catalyst (kJ)", EAS, function(v){ return fx(v, 0); });
      row($("#ct-tdh"), "dh", DH + " (kJ)", DHS, sg);
      row($("#ct-tdrop"), "drop", "The catalyst lowers " + EA + " by (kJ)", DROPS, function(v){ return fx(v, 0); });
      pv.innerHTML = '<h4 class="ct-h4">Your reaction profile</h4><div class="ct-frame"><svg class="ct-svg" id="ct-tsvg" viewBox="0 0 460 285" role="img" aria-label=""></svg></div><dl class="read" id="ct-tread"></dl><p class="tiny muted" id="ct-tnote" aria-live="polite"></p>';
      paint();
    },
    read:read,
    valid:function(d){ return d.ea != null && d.dh != null && d.drop != null ? true : "Choose a value in each of the three rows."; },
    checks:function(d){ var er = d.ea - d.dh, cf = d.ea - d.drop; return [d.dh < 0, er >= 120, cf >= 20 && cf <= 40, d.drop > 0]; },
    key:function(d){ return d.ea + "|" + d.dh + "|" + d.drop; },
    label:function(k){ var p = k.split("|"); return EA + " " + p[0] + " kJ, " + DH + " " + sg(+p[1]) + " kJ, drop " + p[2] + " kJ"; },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ tap:tapAct },
  task:task
});
})();
