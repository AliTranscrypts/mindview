// SCH4U 34 Dynamic Equilibrium: hero (two rooms joined by a door; the flows meet at 15 per minute and the head counts freeze
// at 25 and 75), Two-way traffic (Explore: C6 particle box with C8 concentration–time and rate–time graphs on one time axis;
// chemical A ⇌ B, a sealed jar of water or a saturated solution; closed or open; tracer), Reach equilibrium from either side
// (Part 3: three runs on one graph, H₂ + I₂ ⇌ 2HI model data with a particle zoom, the silver chloride tracer proof),
// Graph detective (custom number and choice items under a C8 graph pair) and Same destination (task: live run per setup).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
var fx = MV.chem.fx;                                        // fixed decimals with a true minus
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function LIN(t){ return t; }
var KF = "<i>k</i><sub>f</sub>", KR = "<i>k</i><sub>r</sub>", RU = "mol/(L·s)", SM1 = "s<sup>−1</sup>";
function h2(v){ return fx(v / 100, 2); }                     // hundredths → "0.30"
function r3(v){ var s = fx(v, 3).replace(/0$/, ""); return s === "0.00" ? "0" : s; }   // 0.150 → 0.15, 0.075 → 0.075
function ratioT(a, b){ return String(Math.round(a / b * 100) / 100); }

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" font-size="' + (o.fs || 12) + '"' + (o.w ? ' font-weight="' + o.w + '"' : "") + ' text-anchor="' + (o.a || "middle") +
    '" dominant-baseline="central" fill="' + (o.c || "var(--ink)") + '"' + opA(o.op) + (o.tr ? ' transform="' + o.tr + '"' : "") + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function poly(pts, o){ o = o || {}; if (pts.length < 2) return ""; return '<polyline points="' + pts.map(function(p){ return r1(p[0]) + "," + r1(p[1]); }).join(" ") + '" fill="none" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function arrowH(x1, x2, y, col, w){       // horizontal arrow with a filled head at x2
  var d = x2 > x1 ? 1 : -1;
  return ln(x1, y, x2 - d * 8, y, { c:col, w:w || 3 }) + '<path d="M' + r1(x2) + " " + r1(y) + " L" + r1(x2 - d * 11) + " " + r1(y - 6) + " L" + r1(x2 - d * 11) + " " + r1(y + 6) + 'Z" fill="' + col + '"/>';
}
function swatch(col, o){ o = o || {}; return '<svg class="de-sw" viewBox="0 0 26 12" aria-hidden="true">' + (o.dot ? circ(13, 6, 5, col, o.tag ? { s:"var(--ink)", sw:2 } : {}) + (o.tag ? circ(13, 6, 1.8, "var(--sheet)") : "") : ln(2, 6, 24, 6, { c:col, w:3, d:o.d })) + "</svg>"; }

// @component radioGroup (from MHF4U 25, via SCH4U 01–13) — segmented control or chip row as a real radio group (arrow keys,
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

// Range slider (native arrow keys) with a live value: slider(host, {id, label, min, max, step, value, fmt(v), onChange(v)}) -> {set, lock}
function slider(host, o){
  host.innerHTML = '<label class="de-sl" for="' + o.id + '"><span class="de-sll">' + o.label + ' = <strong class="de-slv"></strong></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = host.querySelector("input"), out = host.querySelector(".de-slv");
  function show(){ out.innerHTML = o.fmt(+inp.value); inp.setAttribute("aria-valuetext", MV.plain(o.fmt(+inp.value))); }
  inp.addEventListener("input", function(){ show(); o.onChange(+inp.value); });
  show();
  return { set:function(v){ inp.value = v; show(); }, lock:function(b){ inp.disabled = !!b; } };
}

// ---------- Model: A ⇌ B, first-order steps both ways (plan "Model (deterministic)") ----------
// rate forward = kf[A]; rate reverse = kr[B]. Closed: [A](t) = [A]eq + ([A]₀ − [A]eq)e^(−(kf + kr)t). Open: B also leaves at KL[B].
var NT = 300, DT = 0.1, PPM = 20, KL = 0.5, EPS = 0.0005;   // ticks of 0.1 s to 30 s; 20 particles per 1.00 mol/L
function P(kf, kr, a0, b0, open){ return { kf:kf / 100, kr:kr / 100, a0:a0 / 100, b0:b0 / 100, open:!!open, k:[kf, kr, a0, b0, open ? 1 : 0].join(",") }; }
var SER = {};
function series(p){
  if (SER[p.k]) return SER[p.k];
  var A = [], B = [], i;
  if (!p.open) {
    var K = p.kf + p.kr, T = p.a0 + p.b0, ae = p.kr * T / K;
    for (i = 0; i <= NT; i++) { A[i] = ae + (p.a0 - ae) * Math.exp(-K * i * DT); B[i] = T - A[i]; }
  } else {
    var a = p.a0, b = p.b0, h = DT / 10;
    function f(x, y){ return [-p.kf * x + p.kr * y, p.kf * x - p.kr * y - KL * y]; }
    A[0] = a; B[0] = b;
    for (i = 1; i <= NT; i++) {
      for (var s = 0; s < 10; s++) {
        var k1 = f(a, b), k2 = f(a + h / 2 * k1[0], b + h / 2 * k1[1]), k3 = f(a + h / 2 * k2[0], b + h / 2 * k2[1]), k4 = f(a + h * k3[0], b + h * k3[1]);
        a += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); b += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      }
      A[i] = a; B[i] = b;
    }
  }
  return (SER[p.k] = { A:A, B:B });
}
function stateAt(p, n){
  var s = series(p), A = s.A[n], B = s.B[n], rf = p.kf * A, rr = p.kr * B, d = rf - rr;
  return { A:A, B:B, rf:rf, rr:rr, net:Math.abs(d) < EPS ? 0 : d > 0 ? 1 : -1, eq:!p.open && Math.abs(d) < EPS && A + B > 0 };
}
function meetTick(p){ if (p.open) return -1; for (var i = 0; i <= NT; i++) if (stateAt(p, i).eq) return i; return -1; }
function ratioOf(st){ return st.A < EPS ? "—" : fx(st.B / st.A, st.B / st.A >= 1 ? 1 : 2); }

// ---------- seeded randomness ----------
function hashStr(s){ var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed){ return function(){ seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// @component C6 particleBox — deterministic particle view of A ⇌ B (and of a jar of water or a saturated solution).
// psim(p, tracerTick).at(n) -> particles {id, s:"A"|"B"|"X" (escaped), tag, flip (tick of last swap), out (tick it left), slot, rx, ry, ph}.
// The counts follow the model (20 particles per 1.00 mol/L); swaps come from flux accumulators kf[A]Δt and kr[B]Δt, so
// particles keep swapping at equilibrium. tracerTick ≥ 0 tags up to 10 B particles at that tick. Same inputs → same picture.
// boxSVG(parts, n, {style:"chem"|"jar"|"sol", open}) -> inner SVG for viewBox 0 0 360 220 (A --eq-r, B --eq-p; tracer: dark
// ring + light centre dot; a fresh swap gets a --hi ring; escaped particles drift out of an open top).
var SIMC = {};
function psim(p, tr){ var k = p.k + "|" + tr; return SIMC[k] || (SIMC[k] = makeSim(p, tr)); }
function makeSim(p, tr){
  var S = series(p), seed = hashStr(p.k + "|" + tr), R, parts, cur, fAcc, rAcc, tagged;
  function pick(list, k){ var a = list.slice(), out = []; while (out.length < k && a.length) out.push(a.splice(Math.floor(R() * a.length), 1)[0]); return out; }
  function init(){
    R = rng(seed);
    var N = Math.round((p.a0 + p.b0) * PPM), nA = Math.round(p.a0 * PPM), sl = [], i;
    for (i = 0; i < N; i++) sl.push(i);
    sl = pick(sl, N);
    parts = [];
    for (i = 0; i < N; i++) parts.push({ id:i, s:i < nA ? "A" : "B", tag:false, flip:-99, out:-1, slot:sl[i], rx:R(), ry:R(), ph:R() * 6.283 });
    cur = 0; fAcc = 0; rAcc = 0; tagged = false; tagNow();
  }
  function tagNow(){ if (tagged || tr < 0 || cur !== tr) return; pick(parts.filter(function(q){ return q.s === "B"; }), 10).forEach(function(q){ q.tag = true; }); tagged = true; }
  function step(){
    var i = cur, As = parts.filter(function(q){ return q.s === "A"; }), Bs = parts.filter(function(q){ return q.s === "B"; });
    var cA = As.length, cB = Bs.length, cT = cA + cB;
    var tT = p.open ? Math.min(cT, Math.round((S.A[i + 1] + S.B[i + 1]) * PPM)) : cT, tA = Math.min(tT, Math.round(S.A[i + 1] * PPM));
    fAcc += p.kf * S.A[i] * DT * PPM; rAcc += p.kr * S.B[i] * DT * PPM;
    var dNet = tA - cA, nf = clamp(Math.floor(fAcc), Math.max(0, -dNet), Math.min(cA, cB - dNet)), nr = nf + dNet;
    fAcc = Math.max(-2, fAcc - nf); rAcc = Math.max(-2, rAcc - nr);
    var fw = pick(As, nf), rv = pick(Bs, nr);
    fw.forEach(function(q){ q.s = "B"; q.flip = i + 1; });
    rv.forEach(function(q){ q.s = "A"; q.flip = i + 1; });
    var nl = cT - tT;
    if (nl > 0) pick(parts.filter(function(q){ return q.s === "B"; }), nl).forEach(function(q){ q.s = "X"; q.out = i + 1; });
    cur++; tagNow();
  }
  init();
  return { at:function(n){ if (n < cur) init(); while (cur < n) step(); return parts; } };
}
var BX0 = 20, BX1 = 340, BY0 = 30, BY1 = 210;
function boxPos(parts, n, style){
  var A = parts.filter(function(q){ return q.s === "A"; }).sort(function(a, b){ return a.slot - b.slot; }), rank = {}, N = parts.length, pos = {};
  A.forEach(function(q, j){ rank[q.id] = j; });
  var jig = function(q, amp){ return [amp * Math.sin(n * 0.7 + q.ph), amp * Math.cos(n * 0.9 + q.ph * 1.3)]; };
  var W = BX1 - BX0, H = BY1 - BY0, surf = BY0;
  if (style === "chem") {
    var cols = Math.max(1, Math.ceil(Math.sqrt(N * 16 / 9))), rows = Math.max(1, Math.ceil(N / cols)), cw = W / cols, ch = H / rows;
    parts.forEach(function(q){ var c = q.slot % cols, r = Math.floor(q.slot / cols), j = jig(q, 2.5); pos[q.id] = [BX0 + (c + 0.5) * cw + (q.rx - 0.5) * cw * 0.45 + j[0], BY0 + (r + 0.5) * ch + (q.ry - 0.5) * ch * 0.45 + j[1]]; });
    return { pos:pos, surf:BY0 };
  }
  var LC = style === "jar" ? 12 : 10, d = W / LC, dy = style === "jar" ? d * 0.78 : 15, x0 = style === "jar" ? BX0 : BX0 + (W - LC * 16) / 2;
  surf = BY1 - Math.ceil(A.length / LC) * dy - (style === "jar" ? 4 : 0);
  if (style === "jar" && A.length) surf = Math.min(surf, BY1 - A.length / LC * dy - 6);
  parts.forEach(function(q){
    if (q.s === "A") {
      var j = rank[q.id], c = j % LC, r = Math.floor(j / LC), jj = jig(q, style === "jar" ? 1.6 : 0);
      pos[q.id] = style === "jar" ? [x0 + (c + 0.5) * d + (r % 2 ? d * 0.25 : -d * 0.1) + jj[0], BY1 - (r + 0.5) * dy + jj[1]] : [x0 + (c + 0.5) * 16, BY1 - (r + 0.5) * dy];
    } else {
      var top = BY0 + 10, bot = Math.max(top + 10, surf - 12), k = jig(q, 3);
      pos[q.id] = [BX0 + 12 + q.rx * (W - 24) + k[0], top + q.ry * (bot - top) + k[1]];
    }
  });
  return { pos:pos, surf:surf };
}
function boxSVG(parts, n, o){
  var st = o.style, L = boxPos(parts, n, st), h = "", R0 = 7;
  // container: closed = full outline with a lid; open = no top
  if (st === "jar") h += rect(BX0, L.surf, BX1 - BX0, BY1 - L.surf, "var(--eq-r)", { op:0.13 });
  if (st === "sol") h += rect(BX0, BY0, BX1 - BX0, BY1 - BY0, "var(--eq-p)", { op:0.08 });
  h += '<path d="M' + (BX0 - 4) + " " + (BY0 - 4) + " L" + (BX0 - 4) + " " + (BY1 + 4) + " L" + (BX1 + 4) + " " + (BY1 + 4) + " L" + (BX1 + 4) + " " + (BY0 - 4) + '" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>';
  if (!o.open) h += rect(BX0 - 10, BY0 - 10, BX1 - BX0 + 20, 6, "var(--ink-2)", { rx:2 });
  else h += tx((BX0 + BX1) / 2, BY0 - 20, "open top", { fs:11, c:"var(--ink-2)" });
  if (st === "jar") h += ln(BX0, L.surf, BX1, L.surf, { c:"var(--eq-r)", w:1.5, op:0.7 });
  parts.forEach(function(q){
    var col = q.s === "A" ? "var(--eq-r)" : "var(--eq-p)", p = L.pos[q.id];
    if (q.s === "X") {
      var age = n - q.out; if (age < 0 || age > 14) return;
      var xx = BX0 + 12 + q.rx * (BX1 - BX0 - 24); h += circ(xx, BY0 - age * 2.2, R0 - 1, "var(--eq-p)", { op:1 - age / 15 }); return;
    }
    if (n > 0 && n - q.flip <= 3 && n - q.flip >= 0) h += circ(p[0], p[1], R0 + 4, "none", { s:"var(--hi)", sw:2.5 });
    if (st === "sol" && q.s === "A") h += rect(p[0] - 7, p[1] - 7, 14, 14, col, { rx:2, s:q.tag ? "var(--ink)" : null, sw:2.2 });
    else h += circ(p[0], p[1], R0, col, q.tag ? { s:"var(--ink)", sw:2.2 } : {});
    if (q.tag) h += circ(p[0], p[1], 2.2, "var(--sheet)");
  });
  return h;
}
function countParts(parts){ var c = { A:0, B:0, X:0, tA:0, tB:0, tX:0, t:0 }; parts.forEach(function(q){ c[q.s]++; if (q.tag) { c.t++; c["t" + q.s]++; } }); return c; }

// @component C8 eqGraphs — concentration–time or rate–time graph (SVG, viewBox 0 0 360 222) on the shared 0–30 s axis.
// graphSVG({ymax, step, dp, ylab, series:[{v:[values per tick], color, dash, end:"label"}], n (draw ticks 0..n), now (tick of
// a dashed time marker), ring:{t, y} (the rates' meeting point, ringed in --hi)}) -> inner SVG
var GX0 = 52, GX1 = 318, GY0 = 12, GY1 = 184;
function gX(i){ return GX0 + i / NT * (GX1 - GX0); }
function graphSVG(o){
  var gY = function(v){ return GY1 - clamp(v, 0, o.ymax) / o.ymax * (GY1 - GY0); }, h = "", v, i;
  for (v = 0; v <= o.ymax + 1e-9; v += o.step) { h += ln(GX0, gY(v), GX1, gY(v), { c:"var(--plot-grid)", w:1 }); h += tx(GX0 - 6, gY(v), fx(v, o.dp), { fs:10.5, a:"end", c:"var(--ink-2)" }); }
  for (i = 0; i <= NT; i += 50) { h += ln(gX(i), GY0, gX(i), GY1, { c:"var(--plot-grid)", w:1 }); h += tx(gX(i), GY1 + 11, String(i / 10), { fs:10.5, c:"var(--ink-2)" }); }
  h += ln(GX0, GY1, GX1, GY1, { c:"var(--plot-axis)", w:1.5 }) + ln(GX0, GY0, GX0, GY1, { c:"var(--plot-axis)", w:1.5 });
  h += tx((GX0 + GX1) / 2, GY1 + 28, "time (s)", { fs:11, c:"var(--ink-2)" });
  h += tx(13, (GY0 + GY1) / 2, o.ylab, { fs:11, c:"var(--ink-2)", tr:"rotate(-90 13 " + r1((GY0 + GY1) / 2) + ")" });
  if (o.now != null && o.now > 0) h += ln(gX(o.now), GY0, gX(o.now), GY1, { c:"var(--ink-2)", w:1.2, d:"4 4" });
  var n = o.n == null ? NT : o.n, ends = [];
  o.series.forEach(function(s){
    var pts = [];
    for (i = 0; i <= n; i += 2) pts.push([gX(i), gY(s.v[i])]);
    if (n % 2) pts.push([gX(n), gY(s.v[n])]);
    if (pts.length === 1) h += circ(pts[0][0], pts[0][1], 2.5, s.color);
    h += poly(pts, { c:s.color, w:s.w || 2.8, d:s.dash });
    if (s.end) ends.push({ y:gY(s.v[n]), x:gX(n), t:s.end, c:s.color });
  });
  ends.sort(function(a, b){ return a.y - b.y; });
  for (i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 13) ends[i].y = ends[i - 1].y + 13;
  ends.forEach(function(e){ h += tx(e.x + 6, e.y, e.t, { fs:11, a:"start", w:700, c:e.c }); });
  if (o.ring && o.ring.t <= n) h += circ(gX(o.ring.t), gY(o.ring.y), 7, "none", { s:"var(--hi)", sw:3 });
  return h;
}
function concG(p, n, now, lab){
  var s = series(p), T = p.a0 + p.b0, big = T > 1.001;
  return graphSVG({ ymax:big ? 2 : 1, step:big ? 0.5 : 0.25, dp:2, ylab:"concentration (mol/L)", n:n, now:now,
    series:[{ v:s.A, color:"var(--eq-r)", end:lab ? lab.A : "[A]" }, { v:s.B, color:"var(--eq-p)", dash:"7 4", end:lab ? lab.B : "[B]" }] });
}
var RATEC = {};
function rateG(p, n, now){
  var s = series(p), R = RATEC[p.k];
  if (!R) { R = RATEC[p.k] = { f:s.A.map(function(a){ return p.kf * a; }), r:s.B.map(function(b){ return p.kr * b; }) }; }
  var m = meetTick(p);
  return graphSVG({ ymax:0.5, step:0.1, dp:2, ylab:"rate (" + RU + ")", n:n, now:now,
    series:[{ v:R.f, color:"var(--eq-f)", end:"forward" }, { v:R.r, color:"var(--eq-b)", dash:"7 4", end:"reverse" }],
    ring:m >= 0 ? { t:m, y:(R.f[m] + R.r[m]) / 2 } : null });
}
function graphDesc(p, n){
  var st = stateAt(p, n);
  return "Graph to " + fx(n / 10, 1) + " s: [A] = " + fx(st.A, 2) + " and [B] = " + fx(st.B, 2) + " mol/L; forward rate " + fx(st.rf, 3) + " and reverse rate " + fx(st.rr, 3) + " " + MV.plain(RU) + (st.eq ? "; the rates have met." : p.open ? "; B escapes, so there is no equilibrium." : ".");
}

// ---------- Hero: two rooms joined by a door ----------
function hero(f){
  var svg = $("#de-hx-svg"), ctr = $("#de-hx-ctr"), rep = $("#de-hx-replay"), cap = f.cap;
  if (!svg) return;
  // storyboard: flows A→B 30 → 15 and B→A 0 → 15 per minute; head counts 100/0 → 25/75 (frozen after SM minutes)
  var TAU = 2.5, SM = 6, SE = 10, MS = 850, run = 0;
  function fr(s){ return s >= SM ? 1 : (1 - Math.exp(-s / TAU)) / (1 - Math.exp(-SM / TAU)); }
  function ab(s){ return 30 - 15 * fr(s); }
  function ba(s){ return 15 * fr(s); }
  var W = [];                                                 // walkers: {s0, dir}; one dot = 5 people
  (function(){ var ca = 0, cb = 0, ds = 0.01; for (var s = 0; s < SE; s += ds) { ca += ab(s) * ds; cb += ba(s) * ds; if (ca >= 5) { ca -= 5; W.push({ s0:s, dir:1 }); } if (cb >= 5) { cb -= 5; W.push({ s0:s, dir:-1 }); } } })();
  var WALK = 0.55, DOOR = [240, 186];
  function slots(cx){ var out = []; for (var r = 0; r < 4; r++) for (var c = 0; c < 5; c++) out.push([cx - 72 + c * 36, 136 + r * 34]); return out; }
  var SA = slots(135), SB = slots(345);
  function draw(s, still){
    var nB = 75 * fr(s), nA = 100 - nB, h = "";
    // equation A ⇌ B
    h += tx(196, 26, "A", { fs:26, w:700, c:"var(--eq-r)" }) + tx(286, 26, "B", { fs:26, w:700, c:"var(--eq-p)" });
    h += arrowH(214, 268, 20, "var(--eq-f)", 3) + arrowH(268, 214, 33, "var(--eq-b)", 3);
    // flow counters
    h += tx(135, 64, "A → B: " + Math.round(ab(s)) + " per minute", { fs:14, w:700, c:"var(--eq-f)" });
    h += tx(345, 64, "B → A: " + Math.round(ba(s)) + " per minute", { fs:14, w:700, c:"var(--eq-b)" });
    // rooms
    h += rect(30, 82, 420, 206, "var(--paper)", { s:"var(--ink)", sw:2.5, rx:6 });
    h += ln(240, 82, 240, 166, { c:"var(--ink)", w:2.5 }) + ln(240, 206, 240, 288, { c:"var(--ink)", w:2.5 });
    h += tx(48, 100, "Room A", { fs:13, a:"start", w:700, c:"var(--ink-2)" }) + tx(258, 100, "Room B", { fs:13, a:"start", w:700, c:"var(--ink-2)" });
    h += tx(222, 100, Math.round(nA) + " people", { fs:14, a:"end", w:700, c:"var(--eq-r)" }) + tx(432, 100, Math.round(nB) + " people", { fs:14, a:"end", w:700, c:"var(--eq-p)" });
    var kA = Math.round(nA / 5), kB = Math.round(nB / 5), i;
    for (i = 0; i < kA; i++) h += circ(SA[i][0], SA[i][1], 7, "var(--eq-r)");
    for (i = 0; i < kB; i++) h += circ(SB[i][0], SB[i][1], 7, "var(--eq-p)");
    var act = still ? [{ u:0.42, dir:1 }, { u:0.62, dir:-1 }] : W.filter(function(w){ return s >= w.s0 && s < w.s0 + WALK; }).map(function(w){ return { u:(s - w.s0) / WALK, dir:w.dir }; });
    act.forEach(function(w){
      var a = w.dir > 0 ? [180, 200] : [300, 200], b = w.dir > 0 ? [300, 200] : [180, 200], u = w.u;
      var x = u < 0.5 ? lerp(a[0], DOOR[0], u * 2) : lerp(DOOR[0], b[0], u * 2 - 1), y = u < 0.5 ? lerp(a[1], DOOR[1], u * 2) : lerp(DOOR[1], b[1], u * 2 - 1);
      h += circ(x, y, 7, w.dir > 0 ? "var(--eq-f)" : "var(--eq-b)", { s:"var(--sheet)", sw:1.5 }) + tx(x, y - 14, w.dir > 0 ? "→" : "←", { fs:13, w:700, c:w.dir > 0 ? "var(--eq-f)" : "var(--eq-b)" });
    });
    svg.innerHTML = h;
  }
  function final(){ draw(SE, true); ctr.innerHTML = "Both flows read 15 per minute. The head counts stay at 25 and 75 while people keep walking."; cap.textContent = "Equal flows each way, constant head counts: dynamic equilibrium."; rep.hidden = false; }
  function play(){
    var id = ++run; rep.hidden = true; cap.textContent = "";
    ctr.textContent = "People start in room A and walk to room B, and some walk back.";
    MV.tween({ dur:SE * MS, ease:LIN, step:function(t){
      if (id !== run) return; var s = t * SE; draw(s, false);
      if (s > 1.5 && s < SM) ctr.textContent = "The two flows move toward each other.";
      if (s >= SM) ctr.textContent = "Both flows read 15 per minute. The head counts freeze at 25 and 75, but people keep walking.";
    }, done:function(){ if (id === run) final(); } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Two-way traffic ----------
function kv(v, d){ v = Math.round(+v); return v >= 10 && v <= 50 && v % 5 === 0 ? v : d; }
function cv(v, d){ v = Math.round(+v); return [0, 25, 50, 75, 100].indexOf(v) >= 0 ? v : d; }
var CONC = [0, 25, 50, 75, 100].map(function(v){ return { id:String(v), t:v ? h2(v) : "0" }; });
function explore(host, api){
  var S = api.S, C = api.content;
  S.mode = S.mode === "phys" ? "phys" : "chem"; S.sys = S.sys === "sol" ? "sol" : "jar"; S.cont = S.cont === "open" ? "open" : "closed";
  S.kf = kv(S.kf, 30); S.kr = kv(S.kr, 10); S.a0 = cv(S.a0, 100); S.b0 = cv(S.b0, 0);
  S.n = clamp(Math.round(+S.n || 0), 0, NT); S.tr = Math.round(+S.tr); if (!(S.tr >= 0 && S.tr <= S.n)) S.tr = -1;
  var tw = null, playing = false, locked = false;

  host.innerHTML = '<p class="how de-how">' + C.how + '</p><div class="de-top"><div class="de-modes"></div><div class="de-sys"></div></div>' +
    '<details class="de-set" open><summary>Settings</summary><div class="de-setg"><div class="de-kf"></div><div class="de-kr"></div><div class="de-a0"></div><div class="de-b0"></div><div class="de-cont"></div></div><p class="tiny muted de-setn" aria-live="polite"></p></details>' +
    '<div class="de-grid"><div class="de-view"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="de-box"><svg class="de-svg" id="de-pb" viewBox="0 0 360 220" role="img" aria-label=""></svg></div><p class="de-leg tiny"></p><p class="de-cap" aria-live="polite"></p></div>' +
    '<div class="de-side"><div class="de-btns"></div><dl class="read de-read"></dl></div></div>' +
    '<div class="de-graphs"><figure class="de-fig"><figcaption>Concentration–time</figcaption><svg class="de-g" id="de-gc" viewBox="0 0 360 222" role="img" aria-label=""></svg></figure>' +
    '<figure class="de-fig"><figcaption>Rate–time <span class="tiny muted">(○ marks where the rates meet)</span></figcaption><svg class="de-g" id="de-gr" viewBox="0 0 360 222" role="img" aria-label=""></svg></figure></div>' +
    '<p class="tiny muted de-note">' + C.unitNote + "</p>";
  var pb = $("#de-pb", host), gc = $("#de-gc", host), gr = $("#de-gr", host), btns = $(".de-btns", host), read = $(".de-read", host);

  function nm(){ return C.names[S.mode === "chem" ? "chem" : S.sys]; }
  function style(){ return S.mode === "chem" ? "chem" : S.sys; }
  function isOpen(){ return S.cont === "open" && !(S.mode === "phys" && S.sys === "sol"); }
  function cur(){ return P(S.kf, S.kr, S.a0, S.b0, isOpen()); }
  function fresh(){ stop(); S.n = 0; S.tr = -1; }

  // ----- controls -----
  var RG = {}, SL = {};
  RG.mode = radios($(".de-modes", host), { label:"System", aria:"System", options:C.modes, value:S.mode, onChange:function(v){ fresh(); S.mode = v; api.save(); paint(); } });
  RG.sys = radios($(".de-sys", host), { cls:"chips", aria:"Physical system", options:C.systems, value:S.sys, onChange:function(v){ fresh(); S.sys = v; api.save(); paint(); } });
  RG.cont = radios($(".de-cont", host), { label:"Container", aria:"Container", options:C.containers, value:S.cont, disabled:function(id){ return id === "open" && S.mode === "phys" && S.sys === "sol"; }, onChange:function(v){ fresh(); S.cont = v; api.save(); paint(); } });
  RG.a0 = radios($(".de-a0", host), { label:"Start [A]₀ (mol/L)", cls:"chips", aria:"Starting concentration of A", options:CONC, value:String(S.a0), onChange:function(v){ fresh(); S.a0 = +v; api.save(); paint(); } });
  RG.b0 = radios($(".de-b0", host), { label:"Start [B]₀ (mol/L)", cls:"chips", aria:"Starting concentration of B", options:CONC, value:String(S.b0), onChange:function(v){ fresh(); S.b0 = +v; api.save(); paint(); } });
  SL.kf = slider($(".de-kf", host), { id:"de-kfs", label:"Forward rate constant " + KF, min:10, max:50, step:5, value:S.kf, fmt:function(v){ return h2(v) + " " + SM1; }, onChange:function(v){ fresh(); S.kf = v; api.save(); paint(); } });
  SL.kr = slider($(".de-kr", host), { id:"de-krs", label:"Reverse rate constant " + KR, min:10, max:50, step:5, value:S.kr, fmt:function(v){ return h2(v) + " " + SM1; }, onChange:function(v){ fresh(); S.kr = v; api.save(); paint(); } });
  function syncCtl(){ RG.mode.set(S.mode); RG.sys.set(S.sys); RG.cont.set(S.cont); RG.cont.paint(); RG.a0.set(String(S.a0)); RG.b0.set(String(S.b0)); SL.kf.set(S.kf); SL.kr.set(S.kr); }
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); SL.kf.lock(b); SL.kr.lock(b); paintBtns(); }
  function paintBtns(){
    var c = countParts(psim(cur(), S.tr).at(S.n)), dis = locked ? " disabled" : "";
    MV.keepFocus(btns, function(){
      btns.innerHTML = '<button type="button" class="btn primary sm" data-de="play" data-k="deplay"' + dis + ">" + (playing ? "Pause" : S.n >= NT ? "Play again" : "Play") + "</button>" +
        '<button type="button" class="btn ghost sm" data-de="step" data-k="destep"' + (locked || playing || S.n >= NT ? " disabled" : "") + ">Step 1 s</button>" +
        '<button type="button" class="btn ghost sm" data-de="reset" data-k="dereset"' + (locked || playing ? " disabled" : "") + ">Reset</button>" +
        '<button type="button" class="btn ghost sm" data-de="tracer" data-k="detracer"' + (locked || playing || S.tr >= 0 || c.B === 0 ? " disabled" : "") + ">" + (S.tr >= 0 ? "Tracer added" : "Add tracer") + "</button>";
    });
  }
  function stop(){ if (tw) { tw(); tw = null; } if (playing) { playing = false; api.save(); } }
  function play(to, cb){
    if (tw) { tw(); tw = null; }
    if (S.n >= to) { S.n = 0; S.tr = -1; }
    var n0 = S.n; playing = true; paintBtns();
    tw = MV.tween({ dur:(to - n0) / 30 * 1000, ease:LIN, step:function(u){ S.n = Math.round(lerp(n0, to, u)); draw(); },
      done:function(){ tw = null; playing = false; api.save(); paint(); if (cb) cb(); } });
  }
  btns.addEventListener("click", function(e){
    var b = e.target.closest("[data-de]"); if (!b || b.disabled || locked) return;
    var a = b.dataset.de;
    if (a === "play") { if (playing) { stop(); paint(); } else play(NT); return; }
    if (a === "step") { stop(); S.n = Math.min(NT, S.n + 10); }
    if (a === "reset") { fresh(); }
    if (a === "tracer") { stop(); S.tr = S.n; }
    api.save(); paint();
  });

  // ----- drawing -----
  function draw(){
    var p = cur(), N = nm(), st = stateAt(p, S.n), parts = psim(p, S.tr).at(S.n), c = countParts(parts), op = isOpen();
    pb.innerHTML = boxSVG(parts, S.n, { style:style(), open:op });
    pb.setAttribute("aria-label", "Particle box at " + fx(S.n / 10, 1) + " s: " + c.A + " " + N.A + " particles (blue) and " + c.B + " " + N.B + " particles (teal)" + (c.X ? "; " + c.X + " have escaped" : "") + (S.tr >= 0 ? "; " + c.tA + " of " + c.t + " tracer particles are in " + N.A : "") + ".");
    gc.innerHTML = concG(p, S.n, null, S.mode === "chem" ? null : { A:"[A] " + N.A, B:"[B] " + N.B });
    gc.setAttribute("aria-label", "Concentration–time graph. " + graphDesc(p, S.n));
    gr.innerHTML = rateG(p, S.n);
    gr.setAttribute("aria-label", "Rate–time graph: forward rate blue, reverse rate orange. " + graphDesc(p, S.n));
    var rows = [
      ["Time", fx(S.n / 10, 1) + " s"],
      [S.mode === "chem" ? "[A], [B]" : "[A] " + N.A + ", [B] " + N.B, fx(st.A, 2) + ", " + fx(st.B, 2) + " mol/L"],
      ["Forward rate " + KF + "[A]" + (S.mode === "chem" ? "" : " (" + N.fwd + ")"), (st.eq ? fx((st.rf + st.rr) / 2, 3) : fx(st.rf, 3)) + " " + RU],
      ["Reverse rate " + KR + "[B]" + (S.mode === "chem" ? "" : " (" + N.rev + ")"), (st.eq ? fx((st.rf + st.rr) / 2, 3) : fx(st.rr, 3)) + " " + RU],
      ["Net change", st.A + st.B < EPS ? "none (empty)" : st.net === 0 ? "none" : st.net > 0 ? "toward B" + (S.mode === "chem" ? "" : " (" + N.B + ")") : "toward A" + (S.mode === "chem" ? "" : " (" + N.A + ")")],
      ["At equilibrium?", op ? "no: B escapes" : st.eq ? "yes ✓" : "not yet"],
      ["[B] ÷ [A]", ratioOf(st)],
      ["Tracer particles now in A", S.tr >= 0 ? c.tA + " of " + c.t + (c.tX ? " (" + c.tX + " escaped)" : "") : "no tracer yet"]
    ];
    read.innerHTML = MV.readoutHTML(rows);
    var capT;
    if (st.A + st.B < EPS && S.n === 0) capT = "The box is empty: choose a starting amount.";
    else if (op) capT = S.n ? "B escapes, so the reverse process can’t keep up: no equilibrium." : "Open container: B will escape.";
    else if (st.eq) capT = "<strong>The rates have met.</strong> The concentrations are constant but not equal" + (Math.abs(st.A - st.B) < 0.005 ? " (here they happen to match, because " + KF + " = " + KR + ")" : "") + ", and particles keep swapping.";
    else if (S.n === 0) capT = "Press Play or Step to start the clock.";
    else capT = "Net change " + (st.net > 0 ? "toward B: the forward rate is bigger." : "toward A: the reverse rate is bigger.");
    $(".de-cap", host).innerHTML = capT;
  }
  function paint(){
    $(".de-sys", host).hidden = S.mode !== "phys";
    RG.cont.paint();
    var N = nm();
    $(".de-leg", host).innerHTML = swatch("var(--eq-r)", { dot:true }) + " A" + (S.mode === "chem" ? "" : " (" + N.Al.toLowerCase() + ")") + " &nbsp; " + swatch("var(--eq-p)", { dot:true }) + " B" + (S.mode === "chem" ? "" : " (" + N.Bl.toLowerCase() + ")") + " &nbsp; " + swatch("var(--eq-p)", { dot:true, tag:true }) + " tracer (dark ring, light dot) &nbsp; " + swatch("var(--hi)", { dot:false }) + " a swap just happened";
    $(".de-setn", host).innerHTML = isOpen() ? C.openNote : (S.mode === "phys" && S.sys === "sol" ? C.solNote : "");
    draw(); paintBtns(); MV.changed();
  }

  // ----- predictions -----
  function setup(o){ S.mode = o.mode || "chem"; S.sys = o.sys || "jar"; S.cont = o.cont || "closed"; S.kf = o.kf; S.kr = o.kr; S.a0 = o.a0; S.b0 = o.b0; S.n = 0; S.tr = -1; }
  var hooks = {
    start:function(p){
      stop();
      if (p.id === "p3") setup({ kf:30, kr:10, a0:0, b0:100 });
      else if (p.id === "p4") setup({ mode:"phys", sys:"jar", cont:"open", kf:10, kr:30, a0:75, b0:25 });
      else setup({ kf:30, kr:10, a0:100, b0:0 });
      syncCtl(); api.save(); paint(); lock(true);
    },
    run:function(p, done){ play(NT, function(){ lock(false); MV.wait(150, done); }); }
  };

  // ----- challenges (state tests; Play is optional) -----
  var CLOSED = "Close the container: in an open one, B escapes and there’s no equilibrium.";
  function chal(id){
    var op = isOpen();
    if (id === "tc1") {
      if (S.a0 !== 100 || S.b0 !== 0) return { ok:false, msg:"Start from [A] = 1.00 and [B] = 0." };
      if (op) return { ok:false, msg:CLOSED };
      if (S.kf === 40 && S.kr === 10) return { ok:true };
      if (S.kf === 50 && S.kr === 10) return { ok:false, msg:"Ratio 5 gives [B] ≈ 0.83." };
      if (S.kf === 40 && S.kr === 20) return { ok:false, msg:"Ratio 2 gives [B] ≈ 0.67." };
      return { ok:false, msg:"Ratio " + ratioT(S.kf, S.kr) + " gives [B] ≈ " + fx(S.kf / (S.kf + S.kr), 2) + ". You need [B] = 0.80." };
    }
    if (id === "tc2") {
      if (S.kf !== 30 || S.kr !== 10) return { ok:false, msg:"Set " + KF + " = 0.30 and " + KR + " = 0.10 first." };
      if (op) return { ok:false, msg:CLOSED };
      if (S.a0 + S.b0 !== 100) return { ok:false, msg:"Choose a starting mixture with a total of 1.00 mol/L." };
      if (S.a0 === 25) return { ok:true };
      if (S.a0 === 50) return { ok:false, msg:"Forward 0.15 vs reverse 0.05: net change toward B. The <strong>rates</strong> are equal at equilibrium; the concentrations are constant but usually different." };
      if (S.a0 === 75) return { ok:false, msg:"Net change toward B." };
      var f = 0.3 * S.a0 / 100, r = 0.1 * S.b0 / 100;
      return { ok:false, msg:"Forward " + r3(f) + " vs reverse " + r3(r) + ": net change toward " + (f > r ? "B." : "A.") };
    }
    if (id === "tc3") {
      if (S.a0 !== 50 || S.b0 !== 50) return { ok:false, msg:"Start with [A] = [B] = 0.50." };
      if (op) return { ok:false, msg:CLOSED };
      if (S.kr === 3 * S.kf) return { ok:true };
      if (S.kf === 30 && S.kr === 10) return { ok:false, msg:"That’s the mirror image: forward wins and [A] ends at 0.25." };
      if (S.kf === 10 && S.kr === 20) return { ok:false, msg:"[A] ends near 0.67." };
      if (S.kr <= S.kf) return { ok:false, msg:"At the start " + KF + " × 0.50 ≥ " + KR + " × 0.50, so the net reaction doesn’t run backwards." };
      return { ok:false, msg:"It runs backwards, but [A] ends near " + fx(S.kr / (S.kf + S.kr), 2) + ". You need [A] = 0.75." };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Reach equilibrium from either side ----------
var DASH = ["", "8 5", "2 5"];
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.on = S.on && typeof S.on === "object" ? S.on : {}; s1.runs.forEach(function(r){ if (typeof S.on[r.id] !== "boolean") S.on[r.id] = true; });
  S.t1 = clamp(Math.round(S.t1 == null ? NT : +S.t1), 0, NT);
  S.m = S.m && typeof S.m === "object" ? S.m : {}; S.zoom = !!S.zoom;
  var s3s = S.s3 = S.s3 && typeof S.s3 === "object" ? S.s3 : {}; s3s.n = clamp(Math.round(+s3s.n || 0), 0, NT); s3s.tr = Math.round(+s3s.tr); if (!(s3s.tr >= 0 && s3s.tr <= s3s.n)) s3s.tr = -1;
  var msg2 = "", sel2 = "", tw3 = null, play3 = false;

  host.innerHTML =
    '<div class="part de-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="de-runs" role="group" aria-label="Runs to show"></div>' +
      '<div class="de-gbox"><svg class="de-g" id="de-p3g" viewBox="0 0 360 222" role="img" aria-label=""></svg></div>' +
      '<label class="de-sl" for="de-t1"><span class="de-sll">Time = <strong id="de-t1v"></strong></span><input type="range" id="de-t1" min="0" max="' + NT + '" step="10" value="' + S.t1 + '"></label>' +
      '<div class="tbl-wrap"><table class="vt de-rt"><caption class="vh">Concentrations and ratio for each run</caption><thead><tr><th scope="col">Run</th><th scope="col">[A] (mol/L)</th><th scope="col">[B] (mol/L)</th><th scope="col">[B] ÷ [A]</th></tr></thead><tbody id="de-rtb"></tbody></table></div><p class="de-s1c" aria-live="polite"></p></div>' +
    '<div class="part de-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><p class="tiny"><span class="tag">' + s2.label + '</span> H₂(g) + I₂(g) ⇌ 2HI(g), one fixed temperature</p><div class="tbl-wrap"><table class="vt de-hi"><caption class="vh">Model data for H₂ + I₂ ⇌ 2HI</caption><thead><tr><th scope="col">Experiment</th><th scope="col">Start (mol/L)</th><th scope="col">Equilibrium (mol/L)</th></tr></thead><tbody id="de-hib"></tbody></table></div>' +
      '<p class="de-msg2" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn ghost sm" id="de-zoom" aria-expanded="false">' + s2.zoom + '</button></div><div class="de-zv" hidden><svg class="de-g" id="de-zsvg" viewBox="0 0 360 190" role="img" aria-label=""></svg><p class="tiny">' + s2.zoomCap + '</p></div><div class="de-ratio" aria-live="polite"></div></div>' +
    '<div class="part de-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="de-grid"><div class="de-view"><div class="de-box"><svg class="de-svg" id="de-p3b" viewBox="0 0 360 220" role="img" aria-label=""></svg></div><p class="de-leg tiny">' +
      swatch("var(--eq-r)", { dot:true }) + " solid AgCl (squares) &nbsp; " + swatch("var(--eq-p)", { dot:true }) + " dissolved Ag⁺ and Cl⁻ &nbsp; " + swatch("var(--eq-p)", { dot:true, tag:true }) + ' radioactive Cl⁻ (dark ring, light dot)</p></div><div class="de-side"><div class="de-btns" id="de-p3btn"></div><dl class="read" id="de-p3r"></dl><p class="de-s3c" aria-live="polite"></p></div></div></div>';

  // ----- station 1 -----
  var runsHost = $(".de-runs", host);
  function runP(r){ return P(30, 10, Math.round(r.a0 * 100), Math.round((1 - r.a0) * 100), false); }
  function paintS1(){
    MV.keepFocus(runsHost, function(){
      runsHost.innerHTML = s1.runs.map(function(r, i){ var on = S.on[r.id]; return '<button type="button" class="de-run" data-run="' + r.id + '" data-k="run' + r.id + '" aria-pressed="' + on + '"><svg class="de-sw" viewBox="0 0 26 12" aria-hidden="true">' + ln(2, 6, 24, 6, { c:"var(--ink)", w:2.5, d:DASH[i] }) + "</svg>" + r.t + (on ? " ✓" : "") + "</button>"; }).join("");
    });
    var ser = [], rows = "", all3 = true, shown = 0;
    s1.runs.forEach(function(r, i){
      if (!S.on[r.id]) return; shown++;
      var p = runP(r), s = series(p), st = stateAt(p, S.t1);
      ser.push({ v:s.A, color:"var(--eq-r)", dash:DASH[i] || null, end:"" }, { v:s.B, color:"var(--eq-p)", dash:DASH[i] || null, end:"" });
      var rt = ratioOf(st); if (rt !== "3.0") all3 = false;
      rows += "<tr><th scope=\"row\">" + r.t + "</th><td>" + fx(st.A, 2) + "</td><td>" + fx(st.B, 2) + "</td><td>" + rt + "</td></tr>";
    });
    var g = $("#de-p3g"), body = graphSVG({ ymax:1, step:0.25, dp:2, ylab:"concentration (mol/L)", n:NT, now:S.t1, series:ser });
    body += tx(GX1 + 6, GY1 - 0.25 * (GY1 - GY0), "[A]", { fs:11, a:"start", w:700, c:"var(--eq-r)" }) + tx(GX1 + 6, GY1 - 0.75 * (GY1 - GY0), "[B]", { fs:11, a:"start", w:700, c:"var(--eq-p)" });
    g.innerHTML = body;
    g.setAttribute("aria-label", "Concentration–time graph with " + shown + " run" + (shown === 1 ? "" : "s") + " (solid: all A; dashed: all B; dotted: half-and-half). [A] curves blue, [B] curves teal. Every run levels off at [A] = 0.25 and [B] = 0.75 mol/L. Time marker at " + fx(S.t1 / 10, 0) + " s.");
    $("#de-t1v").textContent = fx(S.t1 / 10, 0) + " s";
    $("#de-rtb").innerHTML = rows || '<tr><td colspan="4">Turn on a run.</td></tr>';
    $(".de-s1c", host).innerHTML = shown && all3 ? "<strong>" + s1.cap + "</strong> The ratio [B] ÷ [A] is 3.0 for each run." : "Drag the time slider to the end and compare [B] ÷ [A] for each run.";
  }
  runsHost.addEventListener("click", function(e){ var b = e.target.closest("[data-run]"); if (!b) return; S.on[b.dataset.run] = !S.on[b.dataset.run]; api.save(); paintS1(); });
  $("#de-t1").addEventListener("input", function(e){ S.t1 = +e.target.value; api.save(); paintS1(); });
  paintS1();

  // ----- station 2 -----
  var SP = [{ id:"H2", t:"H₂", v:"0.22" }, { id:"I2", t:"I₂", v:"0.22" }, { id:"HI", t:"HI", v:"1.56" }];
  var START = ["H₂ 1.00, I₂ 1.00, HI 0", "H₂ 0, I₂ 0, HI 2.00"];
  var hib = $("#de-hib");
  function paintS2(){
    MV.keepFocus(hib, function(){
      hib.innerHTML = [1, 2].map(function(x){
        return "<tr><th scope=\"row\">" + x + "</th><td>" + START[x - 1] + '</td><td><span class="de-cells">' + SP.map(function(s){
          var on = sel2 === s.id, done = !!S.m[s.id];
          return '<button type="button" class="de-cell' + (on ? " on" : "") + (done ? " done" : "") + '" data-hc="' + s.id + '" data-k="hc' + x + s.id + '" aria-pressed="' + on + '" aria-label="Experiment ' + x + ", equilibrium " + MV.plain(s.t) + " " + s.v + ' mol/L">' + s.t + " " + s.v + (done ? " ✓" : "") + "</button>";
        }).join("") + "</span></td></tr>";
      }).join("");
    });
    $(".de-msg2", host).innerHTML = msg2;
    var all = SP.every(function(s){ return S.m[s.id]; });
    $(".de-ratio", host).innerHTML = all ? MV.fbHTML("good", "<strong>✓ All three match: the same equilibrium from either side.</strong> " + s2.ratio) : '<p class="tiny muted">Compare all three species (' + SP.filter(function(s){ return S.m[s.id]; }).length + " of 3 so far).</p>";
    var zb = $("#de-zoom"), zv = $(".de-zv", host); zb.setAttribute("aria-expanded", String(S.zoom)); zv.hidden = !S.zoom; zb.textContent = S.zoom ? "Hide the particles" : s2.zoom;
    if (S.zoom) paintZoom();
  }
  function mol(x, y, a, b){        // diatomic: two touching balls
    var A = MV.chem.atom(a), B = MV.chem.atom(b), ra = a === "H" ? 5 : 8, rb = b === "H" ? 5 : 8;
    return circ(x - ra * 0.8, y, ra, A.fill, { s:A.line, sw:1.2 }) + circ(x + rb * 0.8, y, rb, B.fill, { s:B.line, sw:1.2 });
  }
  function paintZoom(){
    var h = "", i;
    h += rect(6, 22, 168, 130, "var(--paper)", { s:"var(--rule)", sw:1.5, rx:6 }) + rect(186, 22, 168, 130, "var(--paper)", { s:"var(--rule)", sw:1.5, rx:6 });
    h += tx(90, 11, "Experiment 1 at the start", { fs:11.5, w:700 }) + tx(270, 11, "Experiment 2 at the start", { fs:11.5, w:700 });
    for (i = 0; i < 20; i++) { var c = i % 5, r = Math.floor(i / 5), x = 26 + c * 32, y = 40 + r * 30; h += i < 10 ? mol(x, y, "H", "H") : mol(x, y, "I", "I"); }
    for (i = 0; i < 20; i++) { var c2 = i % 5, r2 = Math.floor(i / 5); h += mol(206 + c2 * 32, 40 + r2 * 30, "H", "I"); }
    h += tx(90, 166, "10 H₂ + 10 I₂", { fs:11.5 }) + tx(270, 166, "20 HI", { fs:11.5 });
    h += tx(90, 182, "H atoms 20 · I atoms 20", { fs:11.5, w:700, c:"var(--ink-2)" }) + tx(270, 182, "H atoms 20 · I atoms 20", { fs:11.5, w:700, c:"var(--ink-2)" });
    var z = $("#de-zsvg"); z.innerHTML = h;
    z.setAttribute("aria-label", "Particle zoom. Experiment 1 starts with 10 H₂ and 10 I₂ molecules; experiment 2 starts with 20 HI molecules. Each flask has 20 H atoms and 20 I atoms (2.00 mol/L of each).");
  }
  hib.addEventListener("click", function(e){
    var b = e.target.closest("[data-hc]"); if (!b) return;
    var s = SP.filter(function(x){ return x.id === b.dataset.hc; })[0];
    sel2 = s.id; S.m[s.id] = true; api.save();
    msg2 = s.t + ": " + s.v + " mol/L in experiment 1 and " + s.v + " mol/L in experiment 2. They match.";
    paintS2();
  });
  $("#de-zoom").addEventListener("click", function(){ S.zoom = !S.zoom; api.save(); paintS2(); });
  paintS2();

  // ----- station 3: the tracer proof (C6 particle box, saturated solution at equilibrium) -----
  var P3 = P(10, 10, 75, 75, false), b3 = $("#de-p3btn");
  function paintS3(){
    var parts = psim(P3, s3s.tr).at(s3s.n), c = countParts(parts), sv = $("#de-p3b");
    sv.innerHTML = boxSVG(parts, s3s.n, { style:"sol", open:false });
    sv.setAttribute("aria-label", "Saturated silver chloride solution at " + fx(s3s.n / 10, 1) + " s: " + c.A + " units of solid and " + c.B + " dissolved." + (s3s.tr >= 0 ? " " + c.tA + " of " + c.t + " radioactive ions are now in the solid." : " No tracer yet."));
    $("#de-p3r").innerHTML = MV.readoutHTML([["Time", fx(s3s.n / 10, 1) + " s"], ["Solid AgCl", c.A + " units" + (s3s.n > 0 ? " (unchanged)" : "")], ["Radioactive ions in the solid", s3s.tr >= 0 ? c.tA + " of " + c.t : "no tracer yet"]]);
    MV.keepFocus(b3, function(){
      b3.innerHTML = '<button type="button" class="btn primary sm" data-s3="tr" data-k="s3tr"' + (s3s.tr >= 0 || play3 ? " disabled" : "") + ">Add radioactive Cl⁻</button>" +
        '<button type="button" class="btn ghost sm" data-s3="go" data-k="s3go"' + (s3s.tr < 0 || play3 || s3s.n >= NT ? " disabled" : "") + ">Let time pass</button>" +
        '<button type="button" class="btn ghost sm" data-s3="reset" data-k="s3reset"' + (play3 ? " disabled" : "") + ">Reset</button>";
    });
    $(".de-s3c", host).innerHTML = s3s.tr >= 0 && c.tA > 0 && !play3 ? MV.fbHTML("good", "<strong>The solid is radioactive now, but its amount hasn’t changed.</strong> " + s3.cap) : s3s.tr >= 0 ? "" : "Add the tracer first.";
  }
  b3.addEventListener("click", function(e){
    var b = e.target.closest("[data-s3]"); if (!b || b.disabled) return;
    var a = b.dataset.s3;
    if (a === "tr") { s3s.tr = s3s.n; }
    if (a === "reset") { if (tw3) { tw3(); tw3 = null; } s3s.n = 0; s3s.tr = -1; }
    if (a === "go") {
      var n0 = s3s.n; play3 = true; paintS3();
      tw3 = MV.tween({ dur:(NT - n0) / 30 * 1000, ease:LIN, step:function(u){ s3s.n = Math.round(lerp(n0, NT, u)); paintS3(); }, done:function(){ tw3 = null; play3 = false; api.save(); paintS3(); } });
      return;
    }
    api.save(); paintS3();
  });
  paintS3();
}

// ---------- Practice 2: Graph detective (number entry and choices under a C8 graph pair; adapted from SCH4U 14's calcAct) ----------
function graphAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {}, GP = P(30, 10, 100, 0, false);
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); if (typeof x.val !== "string") x.val = ""; if (x.pick === undefined) x.pick = null; x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function chipsHTML(it, x, dis){ return '<div class="chips de-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>"; }
  function numHTML(it, x, dis){ return '<div class="numrow"><label for="ci-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="ci-' + it.id + '" data-cin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span class="de-unit">' + (it.unit || "") + "</span></div>"; }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += numHTML(it, x, dis);
    else if (it.kind === "chips") h += chipsHTML(it, x, dis);
    else h += chipsHTML(it, x, dis) + numHTML(it, x, dis);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) {
      var why = it.kind === "chips" ? (it.options[x.pick] && it.options[x.pick].why) || "" : it.why || it.fb || "";
      h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  var graphs = '<p class="how">' + a.how + '</p><div class="de-graphs"><figure class="de-fig"><figcaption>Concentration–time</figcaption><svg class="de-g" viewBox="0 0 360 222" role="img" aria-label="Concentration–time graph: [A] falls from 1.00 and [B] rises from 0; both level off by about 15 s, at [A] = 0.25 and [B] = 0.75 mol/L.">' + concG(GP, NT) + "</svg></figure>" +
    '<figure class="de-fig"><figcaption>Rate–time</figcaption><svg class="de-g" viewBox="0 0 360 222" role="img" aria-label="Rate–time graph: the forward rate falls from 0.30 and the reverse rate rises from 0; they meet (ringed) and stay equal.">' + rateG(GP, NT) + '</svg></figure></div><p class="tiny muted de-gcap">' + a.graphCap + "</p>";
  var list = document.createElement("div");
  host.innerHTML = graphs; host.appendChild(list);
  function paint(){ MV.keepFocus(list, function(){ list.innerHTML = a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function one(s){ var v = MV.parseNum(String(s || "").replace(/[a-z()/·]+/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, w, tol){ return Math.abs(v - w) <= (tol || 0) + 1e-9; }
  function judge(it, x){
    if (it.kind === "chips") {
      if (x.pick == null) return { bad:"Choose an answer first." };
      return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
    }
    if (it.kind === "two") {
      if (x.pick == null) return { bad:"Choose the net direction first." };
      if (!MV.ok(it.options[x.pick])) return { fb:it.options[x.pick].why || it.fb };
    }
    var v = one(x.val);
    if (v == null) return { bad:"Enter one number, such as 0.25." };
    if (near(v, MV.ans(it), it.tol)) return { ok:true };
    var w = (it.wrong || []).filter(function(z){ return near(v, z.match, 0.0005); })[0];
    return { fb:w ? w.fb : it.fb };
  }
  list.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.cin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  list.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = list.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); } });
  list.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(list.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Same destination ----------
var task = (function(){
  var S = null, api = null, SLf = null, SLr = null, RGa = null;
  function read(){ return { kf:kv(S.kf, 30), kr:kv(S.kr, 10), a0:cv(S.a0, 100) }; }
  function paint(){
    var d = read(), p = P(d.kf, d.kr, d.a0, 100 - d.a0, false), st = stateAt(p, NT), f0 = p.kf * p.a0, r0 = p.kr * p.b0;
    $("#de-tb0").innerHTML = "[B]₀ = 1.00 − [A]₀ = <strong>" + fx(p.b0, 2) + " mol/L</strong>";
    var gc = $("#de-tgc"), gr = $("#de-tgr");
    gc.innerHTML = concG(p, NT); gc.setAttribute("aria-label", "Your run, concentration–time. " + graphDesc(p, NT));
    gr.innerHTML = rateG(p, NT); gr.setAttribute("aria-label", "Your run, rate–time. At the start the forward rate is " + r3(f0) + " and the reverse rate is " + r3(r0) + " " + MV.plain(RU) + ".");
    $("#de-tread").innerHTML = MV.readoutHTML([
      ["[B] at equilibrium", fx(st.B, 2) + " mol/L"],
      ["At the start: forward vs reverse", r3(f0) + " vs " + r3(r0) + " " + RU + " → " + (Math.abs(f0 - r0) < 1e-9 ? "no net change" : f0 > r0 ? "net forward (A → B)" : "net backwards (B → A)")],
      [KF + " + " + KR, h2(d.kf + d.kr) + " " + SM1]
    ]);
  }
  function label(d){ return KF + " = " + h2(d.kf) + ", " + KR + " = " + h2(d.kr) + ", [A]₀ = " + (d.a0 ? h2(d.a0) : "0"); }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; var d = read(); S.kf = d.kf; S.kr = d.kr; S.a0 = d.a0;
      inp.innerHTML = '<div class="de-tkf"></div><div class="de-tkr"></div><div class="de-ta0"></div><p class="tiny" id="de-tb0"></p>';
      pv.innerHTML = '<h4 class="de-h4">Your run (closed container, 0 to 30 s)</h4><div class="de-graphs de-tg"><figure class="de-fig"><figcaption>Concentration–time</figcaption><svg class="de-g" id="de-tgc" viewBox="0 0 360 222" role="img" aria-label=""></svg></figure><figure class="de-fig"><figcaption>Rate–time</figcaption><svg class="de-g" id="de-tgr" viewBox="0 0 360 222" role="img" aria-label=""></svg></figure></div><dl class="read" id="de-tread" aria-live="polite"></dl>';
      SLf = slider($(".de-tkf", inp), { id:"de-tkfs", label:"Forward rate constant " + KF, min:10, max:50, step:5, value:S.kf, fmt:function(v){ return h2(v) + " " + SM1; }, onChange:function(v){ S.kf = v; api.save(); paint(); api.update(); } });
      SLr = slider($(".de-tkr", inp), { id:"de-tkrs", label:"Reverse rate constant " + KR, min:10, max:50, step:5, value:S.kr, fmt:function(v){ return h2(v) + " " + SM1; }, onChange:function(v){ S.kr = v; api.save(); paint(); api.update(); } });
      RGa = radios($(".de-ta0", inp), { label:"Start [A]₀ (mol/L)", cls:"chips", aria:"Starting concentration of A", options:CONC, value:String(S.a0), onChange:function(v){ S.a0 = +v; api.save(); paint(); api.update(); } });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      // integer hundredths: kf ÷ (kf + kr) = 0.60 ⇔ 2kf = 3kr; backwards ⇔ kf[A]₀ < kr[B]₀; slow ⇔ kf + kr ≤ 0.50
      return [2 * d.kf === 3 * d.kr, d.kf * d.a0 < d.kr * (100 - d.a0), d.kf + d.kr <= 50];
    },
    key:function(d){ return d.kf + "|" + d.kr + "|" + d.a0; },
    label:function(k){ var p = k.split("|"); return label({ kf:+p[0], kr:+p[1], a0:+p[2] }); },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ graph:graphAct },
  task:task
});
})();
