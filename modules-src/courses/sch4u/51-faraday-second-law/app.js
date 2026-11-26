// SCH4U 51 Faraday's Second Law of Electrolysis: hero (three cells in series, one electron stream, coats and bars in the
// ratio 12 : 3.5 : 1), Cells in series (Explore: C10 cell builder in series layout with a mass bar chart; Series lab,
// Mystery ion and Ratio view), Find the charge on the ion (Part 3: silver coulom&#101;ter, two oxidation states, a data table
// with a "Check it with data" panel) and Series designer (task: three cells and a charge; live bars and checklist).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function LIN(t){ return t; }

// ---------- data (course table, MV.chem.data) ----------
var D = MV.chem.data, F = D["const"].F, MR = D.Mr;
// Na 23.0 g/mol: the course table's Na (22.99) rounded as in the plan's "Use these values" (not in MV.chem.data.Mr; local).
var NA = 23.0;
// Mystery metal X: M = 58.7 g/mol (course table addition Ni, MV.chem.data.M.Ni). Its true charge is content.explore.mystery.
var XM = D.M.Ni;
var CELLS = {
  ag:{ id:"ag", ion:"Ag⁺(aq)", sol:"AgNO₃(aq)", el:"Ag", z:1, M:MR.Ag, metal:true },
  cu:{ id:"cu", ion:"Cu²⁺(aq)", sol:"CuSO₄(aq)", el:"Cu", z:2, M:MR.Cu, metal:true },
  zn:{ id:"zn", ion:"Zn²⁺(aq)", sol:"ZnSO₄(aq)", el:"Zn", z:2, M:MR.Zn, metal:true },
  alm:{ id:"alm", ion:"Al³⁺ (molten)", sol:"molten aluminium salt", el:"Al", z:3, M:MR.Al, metal:true, molten:true },
  alaq:{ id:"alaq", ion:"Al³⁺(aq)", sol:"Al₂(SO₄)₃(aq)", el:"Al", z:3, M:MR.Al, metal:false },
  na:{ id:"na", ion:"Na⁺(aq)", sol:"NaCl(aq)", el:"Na", z:1, M:NA, metal:false },
  x:{ id:"x", ion:"X (mystery)", sol:"a salt of metal X", el:"X", z:0, M:XM, metal:true, mys:true }
};
var ORDER = ["ag", "cu", "zn", "alm", "alaq", "na"];
function sortCells(a){ return a.slice().sort(function(p, q){ return ORDER.indexOf(p) - ORDER.indexOf(q); }); }

// ---------- numbers ----------
function grp(s){ var p = s.split("."); if (p[0].length > 4) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); return p.join("."); }
function sf(v, n){
  n = n || 3; if (!isFinite(v)) return "—"; if (Math.abs(v) < 1e-12) return "0";
  var a = Math.abs(v), e = Math.floor(Math.log10(a) + 1e-12), dp = Math.max(0, n - 1 - e), p = Math.pow(10, dp), r = Math.round(a * p * (1 + 1e-10)) / p;
  if (Math.floor(Math.log10(r) + 1e-12) > e) dp = Math.max(0, dp - 1);
  return (v < 0 ? "−" : "") + grp(r.toFixed(dp));
}
function qT(Q){ var r = Math.round(Q * 10) / 10; return grp(r % 1 ? r.toFixed(1) : String(r)); }
function aT(I){ return I.toFixed(2) + " A"; }
function nE(Q){ return Q / F; }
function molOf(c, Q, z){ return c.metal ? Q / F / (z || c.z) : 0; }
function massOf(c, Q, z){ return c.metal ? Q / F / (z || c.z) * c.M : 0; }
function eqM(c, z){ return c.M / (z || c.z); }
function NI(){ return "<i>n</i>(e⁻)"; }
// Bars are drawn to a "nice" scale so a doubled mass looks doubled.
var NICE = [0.25, 0.5, 1, 2.5, 5, 10, 25, 50, 110];
function nice(v){ for (var i = 0; i < NICE.length; i++) if (v <= NICE[i] + 1e-9) return NICE[i]; return NICE[NICE.length - 1]; }

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 12) + '"' + (o.w ? ' font-weight="' + o.w + '"' : "") +
    ' fill="' + (o.c || "var(--ink)") + '"' + (o.it ? ' font-style="italic"' : "") + opA(o.op) + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function poly(pts, o){ o = o || {}; return '<polyline points="' + pts.map(function(p){ return r1(p[0]) + "," + r1(p[1]); }).join(" ") + '" fill="' + (o.f || "none") + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' + opA(o.op) + "/>"; }
function head(x, y, ang, len, fill){
  var a1 = ang + Math.PI - 0.45, a2 = ang + Math.PI + 0.45;
  return '<polygon points="' + r1(x) + "," + r1(y) + " " + r1(x + len * Math.cos(a1)) + "," + r1(y + len * Math.sin(a1)) + " " + r1(x + len * Math.cos(a2)) + "," + r1(y + len * Math.sin(a2)) + '" fill="' + fill + '"/>';
}

// @component C10 cellBuilder (series layout) — electrolytic cells wired in series: a power supply, 2–3 cells (beakers, or a
// crucible for a molten cell), cathode coats drawn to scale by mass, H₂ bubbles where water is reduced instead, cations
// (orange), and one electron stream (violet dots moving along the wires, or static arrows). Wide layout: cells in a row;
// narrow (phone): cells stacked with the wire down the sides. geo(n, narrow) -> {W, H, cells:[{x, w, y, cx, ax}], paths, sup}
// circuitSVG(g, items:[{c, m, lab, sub, h2, coat}], {flow:phase|null, scale}) -> svg string.
function geo(n, nar){
  var g = { nar:nar, cells:[], paths:[] }, i;
  if (!nar) {
    g.W = 480; g.H = 252;
    var bw = 130, gap = 30, x0 = (480 - (n * bw + (n - 1) * gap)) / 2;
    for (i = 0; i < n; i++) { var x = x0 + i * (bw + gap); g.cells.push({ x:x, w:bw, y:66, cx:x + 34, ax:x + bw - 34 }); }
    var sL = 195, sR = 285; g.sup = { x:sL, y:10, w:sR - sL, h:24, l:[sL, 22], r:[sR, 22] };
    var c0 = g.cells[0], cl = g.cells[n - 1];
    g.paths.push([[sL, 22], [c0.cx, 22], [c0.cx, c0.y]]);
    for (i = 0; i < n - 1; i++) { var a = g.cells[i], b = g.cells[i + 1]; g.paths.push([[a.ax, a.y + 6], [a.ax, 48], [b.cx, 48], [b.cx, b.y]]); }
    g.paths.push([[cl.ax, cl.y + 6], [cl.ax, 22], [sR, 22]]);
  } else {
    var pitch = 186; g.W = 320; g.H = 60 + n * pitch;
    for (i = 0; i < n; i++) g.cells.push({ x:70, w:150, y:70 + i * pitch, cx:104, ax:186 });
    g.sup = { x:30, y:8, w:90, h:24, l:[30, 20], r:[120, 20] };
    g.paths.push([[30, 20], [12, 20], [12, g.cells[0].y - 16], [104, g.cells[0].y - 16], [104, g.cells[0].y]]);
    for (i = 0; i < n - 1; i++) { var a2 = g.cells[i], b2 = g.cells[i + 1], sx = 270 + (i % 2) * 14; g.paths.push([[186, a2.y + 6], [sx, a2.y + 6], [sx, b2.y - 16], [104, b2.y - 16], [104, b2.y]]); }
    var l2 = g.cells[n - 1]; g.paths.push([[186, l2.y + 6], [306, l2.y + 6], [306, 20], [120, 20]]);
  }
  return g;
}
function pathLen(P){ var L = 0; for (var i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L; }
function pathAt(P, d){
  for (var i = 1; i < P.length; i++) {
    var l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
    if (d <= l || i === P.length - 1) { var t = l ? clamp(d / l, 0, 1) : 0; return [lerp(P[i - 1][0], P[i][0], t), lerp(P[i - 1][1], P[i][1], t), Math.atan2(P[i][1] - P[i - 1][1], P[i][0] - P[i - 1][0])]; }
    d -= l;
  }
  return [P[0][0], P[0][1], 0];
}
function flowSVG(paths, ph){
  var h = "";
  paths.forEach(function(P){
    var L = pathLen(P);
    if (ph == null) {
      // static: arrowheads along the wire show the electrons' direction (reduced motion and idle)
      for (var d = L * 0.3; d < L; d += Math.max(60, L * 0.4)) { var q = pathAt(P, d); h += head(q[0] + Math.cos(q[2]) * 5, q[1] + Math.sin(q[2]) * 5, q[2], 9, "var(--ec-e)"); }
    } else {
      for (var s = (ph * 22) % 22; s < L; s += 22) { var p = pathAt(P, s); h += circ(p[0], p[1], 3.4, "var(--ec-e)"); }
    }
  });
  return h;
}
function cellSVG(c, it, o){
  var x = c.x, w = c.w, y = c.y, cell = it.c, h = "", bot = y + 128;
  if (cell.molten) {
    h += '<polygon points="' + r1(x + 10) + "," + r1(y + 36) + " " + r1(x + w - 10) + "," + r1(y + 36) + " " + r1(x + w - 24) + "," + r1(bot) + " " + r1(x + 24) + "," + r1(bot) + '" fill="var(--fz-melt)"/>';
    h += poly([[x + 4, y + 18], [x + 24, bot], [x + w - 24, bot], [x + w - 4, y + 18]], { c:"var(--ink-2)", w:4 });
    h += tx(x + w / 2, bot - 9, "molten", { fs:11, c:"var(--ink-2)", w:700 });
  } else {
    h += rect(x + 2, y + 40, w - 4, bot - y - 40, "var(--fz-liq)");
    h += poly([[x, y + 18], [x, bot], [x + w, bot], [x + w, y + 18]], { c:"var(--ink-2)", w:2 });
  }
  // cations (orange) between the electrodes
  [[0.36, 0.55], [0.5, 0.78], [0.64, 0.6]].forEach(function(p){
    var cx = x + w * p[0] - (o.flow != null ? ((o.flow * 0.6) % 1) * 6 : 0), cy = y + 40 + (bot - y - 40) * p[1];
    h += circ(cx, cy, 5.5, "var(--ec-cat)") + tx(cx, cy + 0.5, "+", { fs:10, w:700, c:"var(--sheet)" });
  });
  // electrodes and coat
  var th = it.coat || 0;
  h += rect(c.cx - 5, y, 10, 112, "var(--fz-rod)", { rx:2 });
  if (th > 0.15) h += rect(c.cx - 5 - th, y + 46, 10 + 2 * th, 64, "var(--at-m)", { rx:2 });
  h += rect(c.ax - 5, y + 6, 10, 106, "var(--fz-rod)", { rx:2 });
  h += tx(c.cx - 15, y + 30, "−", { fs:14, w:700, c:"var(--ink-2)" }) + tx(c.ax + 15, y + 30, "+", { fs:14, w:700, c:"var(--ink-2)" });
  if (it.h2) {
    [[8, 96], [12, 80], [7, 64], [13, 50]].forEach(function(b, i){ var by = y + b[1] - (o.flow != null ? (o.flow * 18 + i * 9) % 30 : 0); if (by > y + 42) h += circ(c.cx + b[0], by, 3.2, "none", { s:"var(--ink-2)", sw:1.4 }); });
    h += tx(c.cx + 24, y + 58, "H₂", { fs:11, w:700, c:"var(--ink-2)" });
  }
  // labels under the cell
  h += tx(x + w / 2, bot + 16, it.lab, { fs:13, w:700 });
  if (it.sub) h += tx(x + w / 2, bot + 33, it.sub, { fs:12, c:"var(--ink-2)" });
  if (it.sub2) h += tx(x + w / 2, bot + 49, it.sub2, { fs:12, c:"var(--ink-2)" });
  return h;
}
function circuitSVG(g, items, o){
  var h = "";
  g.paths.forEach(function(P){ h += poly(P, { c:"var(--ink)", w:2 }); });
  var s = g.sup;
  h += rect(s.x, s.y, s.w, s.h, "var(--sheet)", { s:"var(--ink)", sw:1.8, rx:4 }) + tx(s.x + s.w / 2, s.y + s.h / 2, "power supply", { fs:10.5 });
  h += tx(s.x + 9, s.y + s.h / 2, "−", { fs:13, w:700 }) + tx(s.x + s.w - 9, s.y + s.h / 2, "+", { fs:13, w:700 });
  g.cells.forEach(function(c, i){ h += cellSVG(c, items[i], o); });
  h += flowSVG(g.paths, o.flow);
  var p0 = g.paths[0][1];
  h += tx(g.nar ? 24 : p0[0] + 22, g.nar ? 40 : 34, "e⁻", { fs:13, w:700, c:"var(--ec-e)" });
  return h;
}

// @component barChart (module-specific) — mass bars in --pen with metal symbols and a "ratio to the lightest" label on each
// bar; dashed bars for predictions. barsSVG(items:[{lab, sub, v, top, dash, ghost}], {W, H, scale, axis}) -> svg string.
function barsSVG(items, o){
  var W = o.W, H = o.H || 200, top = 34, bot = H - 44, x0 = 46, x1 = W - 10, n = Math.max(1, items.length), slot = (x1 - x0) / n, bw = Math.min(64, slot * 0.56), sc = o.scale, h = "";
  h += tx(8, 12, o.axis, { a:"start", fs:11, c:"var(--ink-2)" });
  [0, 0.5, 1].forEach(function(f){ var yy = bot - (bot - top) * f; h += ln(x0 - 4, yy, x0, yy, { c:"var(--ink-2)", w:1.2 }) + tx(x0 - 7, yy, String(Math.round(sc * f * 1000) / 1000), { a:"end", fs:10.5, c:"var(--ink-2)" }); if (f) h += ln(x0, yy, x1, yy, { c:"var(--rule)", w:1, d:"3 4" }); });
  h += ln(x0, top - 8, x0, bot, { c:"var(--ink-2)", w:1.5 }) + ln(x0, bot, x1, bot, { c:"var(--ink-2)", w:1.5 });
  items.forEach(function(it, i){
    var cx = x0 + slot * (i + 0.5), v = Math.max(0, it.v || 0), hh = (bot - top) * Math.min(1, v / sc);
    if (it.pv != null) { var ph = (bot - top) * Math.min(1, it.pv / sc); h += rect(cx - bw / 2, bot - ph, bw, ph, "none", { s:"var(--ink-2)", sw:1.8, d:"5 3" }); }
    if (it.dash) h += rect(cx - bw / 2, bot - hh, bw, hh, "none", { s:"var(--pen)", sw:2, d:"5 3" });
    else if (!it.ghost) h += rect(cx - (it.pv != null ? bw * 0.3 : bw / 2), bot - hh, it.pv != null ? bw * 0.6 : bw, hh, "var(--pen)", { rx:2 });
    var ty = bot - Math.max(hh, it.pv != null ? (bot - top) * Math.min(1, it.pv / sc) : 0) - 10;
    if (it.top) h += tx(cx, Math.max(top - 14, ty), it.top, { fs:11.5, w:700 });
    h += tx(cx, bot + 14, it.lab, { fs:12.5, w:700 }) + (it.sub ? tx(cx, bot + 30, it.sub, { fs:11, c:"var(--ink-2)" }) : "");
  });
  return h;
}

// ---------- hero ----------
function hero(f){
  var svg = $("#fz-hx-svg"), ctr = $("#fz-hx-ctr"), rep = $("#fz-hx-replay"), cap = f.cap;
  if (!svg) return;
  var ids = ["ag", "cu", "alm"], Q = 9650, g = geo(3, false), run = 0;
  var RAT = ["12", "3.5", "1"];
  function draw(k, ph){
    var items = ids.map(function(id){ var c = CELLS[id], m = massOf(c, Q) * k; return { c:c, coat:9 * m / 12, lab:c.ion, sub:k > 0 ? c.el + " " + sf(m) + " g" : c.el + " 0 g", sub2:"e⁻ passed: " + sf(nE(Q) * k) + " mol" }; });
    var h = circuitSVG(g, items, { flow:ph });
    var bars = ids.map(function(id, i){ var c = CELLS[id], m = massOf(c, Q) * k; return { lab:c.el, sub:sf(massOf(c, Q)) + " g", v:m, top:k > 0.98 ? RAT[i] : "" }; });
    h += '<g transform="translate(0,262)">' + barsSVG(bars, { W:480, H:150, scale:12, axis:"mass deposited (g); labels: ratio 12 : 3.5 : 1" }) + "</g>";
    svg.innerHTML = h;
  }
  function final(){
    draw(1, null);
    ctr.innerHTML = "The same 0.100 mol of electrons in every cell: 10.8 g Ag, 3.18 g Cu, 0.900 g Al.";
    cap.textContent = "Same electrons, different masses: the ratio is 12 : 3.5 : 1."; rep.hidden = false;
  }
  function play(){
    var id = ++run; rep.hidden = true; cap.textContent = ""; draw(0, 0);
    ctr.textContent = "One stream of electrons runs through all three cells…";
    MV.tween({ dur:4200, ease:LIN, step:function(t){ if (id !== run) return; draw(t, t * 9); if (t > 0.5) ctr.textContent = "Coats grow on the three cathodes at different rates."; }, done:function(){ if (id === run) final(); } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Cells in series ----------
function explore(host, api){
  var S = api.S, C = api.content, ZTRUE = MV.ans(C.mystery) || 2;
  if (["lab", "mys", "ratio"].indexOf(S.mode) < 0) S.mode = "lab";
  var L = S.lab = S.lab && typeof S.lab === "object" ? S.lab : {};
  L.cells = sortCells((Array.isArray(L.cells) ? L.cells : ["ag", "cu", "alm"]).filter(function(id, i, a){ return CELLS[id] && id !== "x" && a.indexOf(id) === i; }).slice(0, 3));
  if (L.cells.length < 2) L.cells = ["ag", "cu", "alm"];
  L.i = clamp(Math.round(+L.i || 2), 1, 10); L.k = clamp(Math.round(+L.k || 10), 1, 20);
  var Y = S.mys = S.mys && typeof S.mys === "object" ? S.mys : {};
  Y.i = clamp(Math.round(+Y.i || 2), 1, 10); Y.k = clamp(Math.round(+Y.k || 2), 1, 20); Y.z = [1, 2, 3, 4].indexOf(+Y.z) >= 0 ? +Y.z : 0;
  S.rp = S.rp && typeof S.rp === "object" ? S.rp : {}; S.rv = !!S.rv;
  var busy = false, locked = false, seq = 0, A = null, pend = null, note = "", msg = "";

  host.innerHTML = '<p class="how fz-how">' + C.how + '</p><div class="fz-modes"></div><div class="fz-grid">' +
    '<div class="fz-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="fz-box"><svg class="fz-svg" id="fz-circ" role="img" aria-label=""></svg></div>' +
      '<div class="fz-box fz-barbox"><svg class="fz-svg" id="fz-bars" role="img" aria-label=""></svg></div><p class="fz-cap" aria-live="polite"></p></div>' +
    '<div class="fz-side"><div class="fz-cellsbox"></div><p class="fz-msg" aria-live="polite"></p>' +
      '<div class="fz-sl"><label class="fz-slr"><span class="rg-lab">Current <i>I</i>: <output id="fz-iv"></output></span><input type="range" id="fz-i" min="1" max="10" step="1"></label>' +
      '<label class="fz-slr"><span class="rg-lab">Time <i>t</i>: <output id="fz-tv"></output></span><input type="range" id="fz-t" min="1" max="20" step="1"></label></div>' +
      '<div class="fz-rp"></div><div class="fz-btns"></div><dl class="read fz-read" aria-live="polite"></dl></div></div>' +
    '<p class="tiny muted fz-note">' + C.modelNote + '</p><div class="fz-tabs"></div>';
  var circ = $("#fz-circ", host), bars = $("#fz-bars", host), cellsBox = $(".fz-cellsbox", host), rpBox = $(".fz-rp", host), btns = $(".fz-btns", host), iIn = $("#fz-i", host), tIn = $("#fz-t", host);

  // C13 pop-up: this module's "Use these values"
  MV.chem.tables.fzVals = { title:"Use these values", head:["Quantity", "Value"],
    rows:[["Faraday constant, <i>F</i>", grp(String(F)) + " C/mol"]].concat([["Ag", MR.Ag], ["Cu", MR.Cu], ["Zn", MR.Zn], ["Al", MR.Al], ["Mg", 24.3], ["Na", NA], ["Fe", MR.Fe], ["Ni", D.M.Ni], ["Cr", D.M.Cr], ["Sn", D.M.Sn]].map(function(r){ return ["Molar mass of " + r[0], sf(r[1]) + " g/mol"]; })),
    note:"Mg 24.3 and Na 23.0 are the course table rounded; Ni, Cr and Sn are course table additions for the mystery metals." };
  MV.chem.tablePanel($(".fz-tabs", host), "fzVals", { title:"Use these values: F and molar masses" });

  // ----- state helpers -----
  function cur(){ return S.mode === "mys" ? Y : L; }
  function I(){ return A && A.I != null ? A.I : cur().i * 0.5; }
  function T(){ return cur().k * 965; }
  function Q(){ return I() * T(); }
  function list(){ return S.mode === "mys" ? ["ag", "x"] : L.cells; }
  function zOf(id){ return id === "x" ? ZTRUE : CELLS[id].z; }
  function narrow(){ var v = $(".fz-view", host); return (v && v.clientWidth ? v.clientWidth : 480) < 420; }

  // ----- controls -----
  var rgMode = radios($(".fz-modes", host), { label:"Mode", aria:"Explore mode", options:C.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; note = ""; msg = ""; api.save(); paint(); } });
  var rgZ = null;
  function paintCells(){
    var dis = locked || busy;
    MV.keepFocus(cellsBox, function(){
      if (S.mode === "mys") {
        cellsBox.innerHTML = '<p class="tiny fz-mysn">' + C.mysNote + '</p><p class="fz-mysc"><strong>Cells:</strong> Ag⁺(aq) (the coulom&#101;ter) and X, with <i>M</i> = ' + sf(XM) + ' g/mol.</p><div class="fz-z"></div>';
        rgZ = radios($(".fz-z", cellsBox), { label:"X’s charge chip", cls:"chips", aria:"Charge on X’s ion", options:[1, 2, 3, 4].map(function(z){ return { id:String(z), t:"+" + z }; }), value:Y.z ? String(Y.z) : "",
          onChange:function(v){ Y.z = +v; note = ""; api.save(); paint(); } });
        if (dis) rgZ.lock(true);
      } else {
        rgZ = null;
        cellsBox.innerHTML = '<span class="rg-lab" id="fz-cl">Cells in series (choose 2 or 3)</span><div class="fz-cells" role="group" aria-labelledby="fz-cl">' + ORDER.map(function(id){
          var on = L.cells.indexOf(id) >= 0;
          return '<button type="button" class="fz-cb' + (on ? " on" : "") + '" role="checkbox" aria-checked="' + on + '" data-cell="' + id + '" data-k="cell' + id + '"' + (dis ? " disabled" : "") + '><span class="fz-cbm" aria-hidden="true">' + (on ? "☑" : "☐") + "</span>" + CELLS[id].ion + "</button>";
        }).join("") + "</div>";
      }
    });
  }
  function paintSliders(){
    iIn.value = String(cur().i); tIn.value = String(cur().k); iIn.disabled = tIn.disabled = locked || busy;
    $("#fz-iv", host).textContent = aT(I()); $("#fz-tv", host).textContent = qT(T()) + " s";
    iIn.setAttribute("aria-valuetext", aT(I())); tIn.setAttribute("aria-valuetext", qT(T()) + " seconds");
  }
  function metalsOf(ids){ return ids.filter(function(id){ return CELLS[id].metal; }); }
  function paintRP(){
    if (S.mode !== "ratio") { rpBox.innerHTML = ""; rpBox.hidden = true; return; }
    rpBox.hidden = false;
    var dis = locked || busy ? " disabled" : "", ms = metalsOf(L.cells);
    MV.keepFocus(rpBox, function(){
      rpBox.innerHTML = '<p class="tiny">' + C.ratioNote + "</p>" + ms.map(function(id){
        var v = S.rp[id] || 1;
        return '<div class="fz-rpr"><span class="fz-rpl">' + CELLS[id].ion + '</span><button type="button" class="btn ghost sm" data-rp="' + id + '" data-d="-1" data-k="rp' + id + 'm" aria-label="Lower the predicted ratio for ' + esc(MV.plain(CELLS[id].ion)) + '"' + (dis || v <= 0.5 ? " disabled" : "") + '>−</button><output class="fz-rpv" aria-live="polite">' + v.toFixed(1) + '</output><button type="button" class="btn ghost sm" data-rp="' + id + '" data-d="1" data-k="rp' + id + 'p" aria-label="Raise the predicted ratio for ' + esc(MV.plain(CELLS[id].ion)) + '"' + (dis || v >= 15 ? " disabled" : "") + ">+</button></div>";
      }).join("") + (L.cells.length - ms.length ? '<p class="tiny muted">Cells that make H₂ have no metal bar.</p>' : "");
    });
  }
  function paintBtns(){
    var dis = locked || busy ? " disabled" : "";
    MV.keepFocus(btns, function(){
      btns.innerHTML = '<button type="button" class="btn primary sm" data-act="run" data-k="run"' + dis + ">Run</button>" +
        (S.mode === "ratio" ? '<button type="button" class="btn sm" data-act="reveal" data-k="reveal"' + dis + ">" + (S.rv ? "Hide masses" : "Reveal") + "</button>" : "") +
        '<button type="button" class="btn ghost sm" data-act="reset" data-k="reset"' + dis + ">Reset</button>";
    });
  }
  function lock(b){ locked = b; rgMode.lock(b); paintCells(); paintSliders(); paintRP(); paintBtns(); }
  function changed(){ if (S.mode === "ratio") S.rv = false; note = ""; api.save(); paint(); }
  iIn.addEventListener("input", function(){ if (locked || busy) return; cur().i = clamp(+iIn.value, 1, 10); changed(); });
  tIn.addEventListener("input", function(){ if (locked || busy) return; cur().k = clamp(+tIn.value, 1, 20); changed(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked || busy || !host.contains(b)) return;
    if (b.dataset.cell) {
      var id = b.dataset.cell, i = L.cells.indexOf(id);
      if (i >= 0) { if (L.cells.length <= 2) { msg = "Keep at least two cells in the circuit."; paintMsg(); return; } L.cells.splice(i, 1); }
      else { if (L.cells.length >= 3) { msg = "Three cells at most. Untick one first."; paintMsg(); return; } L.cells.push(id); L.cells = sortCells(L.cells); }
      msg = ""; changed(); return;
    }
    if (b.dataset.rp) { var r = S.rp[b.dataset.rp] || 1; S.rp[b.dataset.rp] = clamp(r + 0.5 * (+b.dataset.d), 0.5, 15); S.rv = false; api.save(); paint(); return; }
    var a = b.dataset.act;
    if (a === "run") runAnim();
    else if (a === "reveal") { S.rv = !S.rv; api.save(); paint(); }
    else if (a === "reset") {
      note = ""; msg = "";
      if (S.mode === "mys") { Y.i = 2; Y.k = 2; Y.z = 0; }
      else { L.cells = ["ag", "cu", "alm"]; L.i = 2; L.k = 10; S.rp = {}; S.rv = false; }
      api.save(); paint();
    }
  });

  // ----- animation -----
  function cancelAnim(){ seq++; A = null; busy = false; }
  function runAnim(cb, opt){
    opt = opt || {}; cancelAnim(); var my = seq; busy = true; A = { g:0, ph:0, grow:opt.grow || null, I:opt.I0 != null ? opt.I0 : null }; lock(locked);
    MV.tween({ dur:opt.dur || 1800, ease:LIN, step:function(t){
      if (my !== seq) return; A.ph = t * 6; A.g = t;
      if (opt.I0 != null) A.I = lerp(opt.I0, opt.I1, t);
      draw(); paintRead(); paintSliders();
    }, done:function(){
      if (my !== seq) return; A = null; busy = false;
      if (cb) cb(); else { lock(locked); paint(); }
    } });
  }

  // ----- model -----
  function items(){
    var q = Q(), ids = list(), grow = A ? (A.grow || ids) : [], gk = A ? A.g : 1;
    return ids.map(function(id){
      var c = CELLS[id], z = zOf(id), m = c.metal ? q / F / z * c.M : 0, hid = pend && pend.hide && pend.hide.indexOf(id) >= 0;
      var k = grow.indexOf(id) >= 0 ? gk : 1;
      return { id:id, c:c, z:z, m:hid ? 0 : m * k, mFull:m, n:c.metal ? q / F / z * k : 0, hid:hid, h2:!c.metal };
    });
  }
  function ratioOf(its){
    var ms = its.filter(function(x){ return !x.h2 && x.mFull > 0; }), lo = Math.min.apply(null, ms.map(function(x){ return x.mFull; }));
    return ms.length ? function(x){ return x.h2 ? null : x.mFull / lo; } : function(){ return null; };
  }
  function scaleOf(its){ return nice(Math.max.apply(null, its.map(function(x){ return x.mFull; }).concat([0.01]))); }

  // ----- drawing -----
  function draw(){
    var its = items(), nar = narrow(), g = geo(its.length, nar), sc = scaleOf(its), rat = ratioOf(its), hideM = S.mode === "ratio" && !S.rv;
    circ.setAttribute("viewBox", "0 0 " + g.W + " " + g.H);
    var ci = its.map(function(x){
      var sub = x.h2 ? "H₂ forms, 0 g metal" : x.hid || hideM ? x.c.el + ": ? g" : x.c.el + " " + sf(x.m) + " g" + (x.id === "x" ? " (measured)" : "");
      return { c:x.c, coat:x.h2 ? 0 : 9 * Math.min(1, x.m / sc), lab:x.c.ion, sub:sub, h2:x.h2 };
    });
    var flow = A && !MV.reduceMotion ? A.ph : null;
    circ.innerHTML = circuitSVG(g, ci, { flow:flow });
    var W = nar ? 320 : 480, b = [];
    if (S.mode === "ratio") {
      var ms = its.filter(function(x){ return !x.h2; }), top = Math.max(1, Math.max.apply(null, ms.map(function(x){ return Math.max(S.rp[x.id] || 1, rat(x) || 0); })));
      b = ms.map(function(x){ var r = rat(x); return { lab:x.c.el, sub:S.rv ? "real " + sf(r) : "you: " + (S.rp[x.id] || 1).toFixed(1), v:S.rv ? r : 0, ghost:!S.rv, pv:S.rp[x.id] || 1, top:S.rv ? sf(r) : "?" }; });
      bars.setAttribute("viewBox", "0 0 " + W + " 200");
      bars.innerHTML = barsSVG(b, { W:W, H:200, scale:nice(top) < 15 ? Math.max(nice(top), 2.5) : 15, axis:"ratio to the lightest (dashed: your prediction)" });
    } else {
      its.forEach(function(x){
        var r = rat(x), bi = { lab:x.c.el, sub:x.h2 ? "H₂, 0 g" : x.hid ? "? g" : sf(x.m) + " g", v:x.m, top:x.h2 ? "" : x.hid ? "?" : r != null ? "× " + sf(r) : "" };
        if (pend && pend.id === "p1") bi.top = "";
        b.push(bi);
        if (x.id === "x" && Y.z) { var pm = massOf(CELLS.x, Q(), Y.z) * (A ? A.g : 1); b.push({ lab:"X if +" + Y.z, sub:sf(pm) + " g", v:pm, dash:true, top:"predicted" }); }
      });
      bars.setAttribute("viewBox", "0 0 " + W + " 200");
      bars.innerHTML = barsSVG(b, { W:W, H:200, scale:S.mode === "mys" && Y.z ? nice(Math.max(scaleOf(its), massOf(CELLS.x, Q(), Y.z))) : sc, axis:"mass deposited (g); × = ratio to the lightest" });
    }
    circ.setAttribute("aria-label", describe(its));
    bars.setAttribute("aria-label", S.mode === "ratio" ? "Ratio bars: " + b.map(function(x){ return x.lab + " " + MV.plain(x.sub); }).join("; ") + "." : "Mass bars: " + b.map(function(x){ return x.lab + " " + MV.plain(x.sub) + (x.top && x.top !== "?" ? ", " + MV.plain(x.top) : ""); }).join("; ") + ".");
  }
  function describe(its){
    var t = "Series circuit: a power supply and " + its.length + " cells joined by one wire, so one stream of electrons passes through every cell. ";
    t += its.map(function(x, i){ return "Cell " + (i + 1) + ": " + MV.plain(x.c.ion) + (x.c.molten ? " in a crucible" : "") + ", " + (x.h2 ? "hydrogen bubbles at the cathode, no metal" : x.hid || (S.mode === "ratio" && !S.rv) ? "coat hidden" : MV.plain(sf(x.m)) + " g of " + x.c.el + " on the cathode"); }).join("; ") + ".";
    return t;
  }
  function paintRead(){
    var its = items(), q = Q(), rat = ratioOf(its), rows = [], hideM = S.mode === "ratio" && !S.rv;
    rows.push(["Charge <i>Q</i>", qT(q) + " C (the same for every cell)"], ["Moles of electrons", sf(nE(q)) + " mol (each cell)"]);
    its.forEach(function(x, i){
      var v;
      if (x.h2) v = "H₂ forms, 0 g metal";
      else if (x.hid || hideM) v = "? mol " + x.c.el + " · ? g";
      else v = sf(x.n) + " mol " + x.c.el + " · " + sf(x.m) + " g" + (x.id === "x" ? " (measured)" : "");
      rows.push(["Cell " + (i + 1) + ": " + x.c.ion, v]);
    });
    if (S.mode === "mys") {
      var z = Y.z;
      if (!z) rows.push(["If X is X<sup>z+</sup>", muted("set X’s charge chip")]);
      else {
        var pm = massOf(CELLS.x, q, z), mm = massOf(CELLS.x, q, ZTRUE), okz = Math.abs(pm - mm) < 1e-9;
        rows.push(["If X is X<sup>" + (z > 1 ? z : "") + "+</sup>", "<i>n</i>(X) = " + sf(nE(q)) + " ÷ " + z + " = " + sf(nE(q) / z) + " mol → " + sf(pm) + " g"],
          ["Predicted vs measured", sf(pm) + " g vs " + sf(mm) + " g " + (okz ? "<strong>✓ match</strong>" : "✗ no match")]);
      }
    } else {
      rows.push(["Equivalent masses <i>M</i> ÷ <i>z</i>", its.map(function(x){ return x.h2 ? "—" : sf(eqM(x.c)); }).join(" · ") + " g/mol e⁻"]);
      rows.push(["Ratio of masses", hideM || (pend && pend.hide && pend.hide.length) ? muted("hidden") : its.map(function(x){ var r = rat(x); return r == null ? "—" : r < 1.0005 ? "1" : sf(r); }).join(" : ") + muted(" (lightest = 1)")]);
    }
    $(".fz-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintMsg(){ $(".fz-msg", host).innerHTML = msg; }
  function paintCap(){
    var t, its = items();
    if (busy) t = "Electrons flow through every cell; the coats grow…";
    else if (S.mode === "mys") t = Y.z ? "The silver cell measured " + sf(nE(Q())) + " mol e⁻. If X is +" + Y.z + ", it would gain " + sf(massOf(CELLS.x, Q(), Y.z)) + " g; it really gained " + sf(massOf(CELLS.x, Q(), ZTRUE)) + " g." : "Set X’s charge chip and compare the predicted mass with the measured mass.";
    else if (S.mode === "ratio") t = S.rv ? "Real ratios (solid) beside your predictions (dashed). Change the current: the ratios don’t move." : "Set your predicted ratios, then press Reveal.";
    else {
      var h2 = its.filter(function(x){ return x.h2; });
      t = "Every cell gets " + sf(nE(Q())) + " mol e⁻. Divide by <i>z</i> for the atoms, then multiply by <i>M</i> for the mass." + (h2.length ? " In water, " + h2.map(function(x){ return x.c.ion; }).join(" and ") + " give H₂ instead of metal." : "");
    }
    $(".fz-cap", host).innerHTML = t + (note && !busy ? " <strong>" + note + "</strong>" : "");
  }
  function paint(){
    rgMode.set(S.mode);
    paintCells(); paintSliders(); paintRP(); paintBtns(); draw(); paintRead(); paintCap(); paintMsg();
    MV.changed();
  }
  var rt = null;
  window.addEventListener("resize", function(){ clearTimeout(rt); rt = setTimeout(draw, 150); });

  // ----- predictions -----
  var hooks = {
    start:function(p){
      cancelAnim(); note = ""; msg = "";
      var st = p.start || {};
      S.mode = "lab"; L.cells = sortCells(st.cells || ["ag", "cu"]); L.i = Math.round((st.I || 1) / 0.5); L.k = Math.round((st.t || 9650) / 965);
      pend = { id:p.id, hide:p.id === "p3" ? ["ag"] : p.id === "p4" ? [] : L.cells.slice() };
      api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(n){ pend = null; note = n || ""; busy = false; lock(false); paint(); MV.wait(150, done); }
      var grow = pend && pend.hide && pend.hide.length ? pend.hide.slice() : null;
      if (p.id === "p4") {
        runAnim(function(){ L.i = 4; api.save(); fin("Both bars doubled; the ratio label stayed at " + sf(MR.Ag / (MR.Cu / 2)) + "."); }, { I0:1.0, I1:2.0, grow:[], dur:2000 });
        return;
      }
      if (pend) pend.hide = [];
      runAnim(function(){ fin(p.id === "p2" ? "Mole counters: " + sf(0.1) + " mol Ag vs " + sf(0.05) + " mol Cu." : ""); }, { grow:grow });
    }
  };

  // ----- challenges -----
  function has(id){ return L.cells.indexOf(id) >= 0; }
  function near(a, b){ return Math.abs(a - b) < 0.01; }
  function chal(id){
    var q = L.i * 0.5 * L.k * 965;
    if (id === "tc1" || id === "tc2") {
      if (S.mode === "mys") return { ok:false, msg:"Switch to Series lab: this challenge uses your own series circuit." };
      if (id === "tc1") {
        if (!has("ag")) return { ok:false, msg:"Add a silver cell first." };
        if (near(q, 1930)) return { ok:true };
        if (near(q, 3860)) return { ok:false, msg:"That’s 0.0400 mol Ag. You need 0.0200 mol." };
        return { ok:false, msg:"Right now the silver cell gains " + sf(massOf(CELLS.ag, q)) + " g (" + qT(q) + " C). You need 2.16 g." };
      }
      if (!has("alm")) return { ok:false, msg:has("alaq") ? "In water, no aluminium forms." : "Add the Al³⁺ (molten) cell." };
      if (near(q, 9650)) return { ok:true };
      if (Math.abs(q - 3217) < 500) return { ok:false, msg:"Each Al takes 3 e⁻: 0.0333 mol Al needs 0.100 mol e⁻." };
      return { ok:false, msg:"Right now the molten cell gains " + sf(massOf(CELLS.alm, q)) + " g of aluminium. You need 0.900 g." };
    }
    if (id === "tc3") {
      if (S.mode !== "mys") return { ok:false, msg:"Switch to Mystery ion mode and set X’s charge chip." };
      if (!Y.z) return { ok:false, msg:"Set X’s charge chip first." };
      if (Y.z === ZTRUE) return { ok:true };
      var qm = Y.i * 0.5 * Y.k * 965;
      return { ok:false, msg:"Then X would have gained " + sf(massOf(CELLS.x, qm, Y.z)) + " g." };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group (arrow keys,
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
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) { e.stopPropagation(); choose(b.dataset.rg); } });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- Part 3: Find the charge on the ion ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  var P = S.p3 = S.p3 && typeof S.p3 === "object" ? S.p3 : {};
  P.s1 = P.s1 && typeof P.s1 === "object" ? P.s1 : { ne:"", q:"" };
  P.s2 = P.s2 && typeof P.s2 === "object" ? P.s2 : {};
  P.s3 = P.s3 && typeof P.s3 === "object" ? P.s3 : {};
  s3.runs.forEach(function(r){ P.s3[r.id] = Array.isArray(P.s3[r.id]) ? P.s3[r.id].slice(0, 3).map(function(v){ return typeof v === "string" ? v : ""; }) : ["", "", ""]; while (P.s3[r.id].length < 3) P.s3[r.id].push(""); });
  var fb = { s1:"", s2:"", s3:"" }, marks = {};

  function one(s){ var v = MV.parseNum(String(s || "").replace(/mol|[a-df-z]+/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function close(v, w){ return v != null && Math.abs(v - w) <= 0.01 * Math.abs(w) + 1e-9; }
  function numIn(id, val, lab, unit){ return '<label class="fz-ni"><span>' + lab + '</span><input class="numin" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-p3="' + id + '" value="' + esc(val) + '">' + (unit ? '<span class="fz-u">' + unit + "</span>" : "") + "</label>"; }

  host.innerHTML =
    '<div class="part fz-st"><h3>' + s1.title + "</h3>" + s1.html +
      '<div class="fz-coul"><svg class="fz-csvg" viewBox="0 0 220 120" aria-hidden="true">' + coulSVG() + '</svg><p class="fz-reading"><strong>Coulom&#101;ter reading:</strong> the silver cathode gained ' + sf(s1.reading) + " g.</p></div>" +
      '<div class="fz-s1in"></div><div class="q-actions"><button type="button" class="btn primary sm" data-p3a="s1" data-k="s1chk">Check</button></div><div class="fz-fb" data-fb="s1"></div></div>' +
    '<div class="part fz-st"><h3>' + s2.title + "</h3>" + s2.html + '<div class="fz-s2in"></div><div class="q-actions"><button type="button" class="btn primary sm" data-p3a="s2" data-k="s2chk">Check</button></div><div class="fz-fb" data-fb="s2"></div></div>' +
    '<div class="part fz-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="fz-runs"></div><div class="q-actions"><button type="button" class="btn primary sm" data-p3a="s3" data-k="s3chk">Check the table</button></div><div class="fz-fb" data-fb="s3"></div>' +
      '<details class="alg fz-data"><summary>Check it with data</summary><p class="tiny muted">Each run’s measured masses. Once you enter <i>z</i>, a dashed bar shows the mass of X your <i>z</i> predicts from the silver cell’s electrons.</p><div class="fz-dv"></div></details></div>';

  function coulSVG(){
    var h = poly([[20, 30], [20, 104], [200, 104], [200, 30]], { c:"var(--ink-2)", w:2 }) + rect(22, 50, 176, 52, "var(--fz-liq)");
    h += rect(60, 14, 10, 84, "var(--fz-rod)", { rx:2 }) + rect(56, 58, 18, 40, "var(--at-m)", { rx:2 }) + rect(150, 20, 10, 78, "var(--fz-rod)", { rx:2 });
    h += tx(110, 40, "AgNO₃(aq)", { fs:12, c:"var(--ink-2)" }) + tx(46, 30, "−", { fs:14, w:700, c:"var(--ink-2)" }) + tx(174, 30, "+", { fs:14, w:700, c:"var(--ink-2)" });
    h += tx(110, 114, "silver coulom&#101;ter", { fs:11, c:"var(--ink-2)" });
    return h;
  }
  function paintS1(){
    MV.keepFocus($(".fz-s1in", host), function(){
      $(".fz-s1in", host).innerHTML = '<div class="fz-nrow">' + numIn("s1ne", P.s1.ne, "Moles of electrons, <i>n</i>(e⁻) =", "mol") + numIn("s1q", P.s1.q, "Charge, <i>Q</i> =", "C") + "</div>";
    });
    $('[data-fb="s1"]', host).innerHTML = fb.s1;
  }
  function paintS2(){
    MV.keepFocus($(".fz-s2in", host), function(){
      $(".fz-s2in", host).innerHTML = s2.items.map(function(it){ return '<div class="fz-s2r"><span class="fz-s2l">' + it.t + '</span><span class="fz-s2c" data-s2="' + it.id + '"></span></div>'; }).join("");
      s2.items.forEach(function(it){
        radios($('[data-s2="' + it.id + '"]', host), { cls:"chips", aria:MV.plain(it.t) + ": which ion?", options:[{ id:"1", t:"Cu⁺" }, { id:"2", t:"Cu²⁺" }], value:P.s2[it.id] || "",
          onChange:function(v){ P.s2[it.id] = v; fb.s2 = ""; api.save(); $('[data-fb="s2"]', host).innerHTML = ""; } });
      });
    });
    $('[data-fb="s2"]', host).innerHTML = fb.s2;
  }
  var COLS = [["<i>n</i>(e⁻)", "mol"], ["<i>n</i>(X)", "mol"], ["<i>z</i>", ""]];
  function paintS3(){
    var box = $(".fz-runs", host);
    MV.keepFocus(box, function(){
      box.innerHTML = s3.runs.map(function(r, i){
        var v = P.s3[r.id];
        return '<div class="fz-run"><p class="fz-runh"><strong>Run ' + (i + 1) + ':</strong> silver gained ' + sf(r.ag) + " g · <i>M</i> of X = " + sf(r.M) + " g/mol" + (r.molten ? " (molten)" : "") + " · X gained " + sf(r.x) + ' g</p><div class="fz-nrow">' +
          COLS.map(function(c, j){ var mk = marks[r.id + j]; return '<span class="fz-cellin' + (mk === true ? " ok" : mk === false ? " no" : "") + '">' + numIn("s3:" + r.id + ":" + j, v[j], c[0] + " =", c[1]) + (mk === true ? '<span class="fz-mk" aria-label="correct">✓</span>' : mk === false ? '<span class="fz-mk" aria-label="not correct">✗</span>' : "") + "</span>"; }).join("") + "</div></div>";
      }).join("");
    });
    $('[data-fb="s3"]', host).innerHTML = fb.s3;
    paintData();
  }
  function paintData(){
    $(".fz-dv", host).innerHTML = s3.runs.map(function(r, i){
      var z = one(P.s3[r.id][2]), ne = r.ag / MR.Ag, pm = z && z > 0 ? ne / z * r.M : null, mx = Math.max(r.ag, r.x, pm || 0);
      function bar(lab, v, dash){ return '<div class="fz-hb"><span class="fz-hbl">' + lab + '</span><span class="fz-hbt"><span class="fz-hbf' + (dash ? " dash" : "") + '" style="width:' + r1(100 * v / mx) + '%"></span></span><span class="fz-hbv">' + sf(v) + " g</span></div>"; }
      return '<div class="fz-dr"><p class="fz-runh"><strong>Run ' + (i + 1) + "</strong></p>" + bar("Silver (measured)", r.ag) + bar("X (measured)", r.x) +
        (pm != null ? bar("X if <i>z</i> = " + sf(z, 3).replace(/\.0+$/, ""), pm, true) + '<p class="tiny">' + (Math.abs(pm - r.x) <= 0.01 * r.x ? "<strong>✓ Your <i>z</i> predicts the measured mass.</strong>" : "Your <i>z</i> predicts " + sf(pm) + " g, but X gained " + sf(r.x) + " g.") + "</p>" : '<p class="tiny muted">Enter <i>z</i> to compare.</p>') + "</div>";
    }).join("");
  }
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.p3; if (!k) return;
    if (k === "s1ne") P.s1.ne = e.target.value; else if (k === "s1q") P.s1.q = e.target.value;
    else { var p = k.split(":"); P.s3[p[1]][+p[2]] = e.target.value; delete marks[p[1] + p[2]]; if (+p[2] === 2) paintData(); }
    api.save();
  });
  host.addEventListener("keydown", function(e){
    var k = e.target.dataset && e.target.dataset.p3; if (!k || e.key !== "Enter") return;
    var b = host.querySelector('[data-p3a="' + (k.indexOf("s3") === 0 ? "s3" : "s1") + '"]'); if (b) b.click();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-p3a]"); if (!b) return;
    var a = b.dataset.p3a, box = $('[data-fb="' + a + '"]', host);
    if (a === "s1") {
      var A1 = MV.ans(s1), ne = one(P.s1.ne), q = one(P.s1.q);
      if (ne == null || q == null) fb.s1 = MV.fbHTML("", "Enter both numbers, such as 0.0100 and 965.");
      else if (close(ne, A1[0]) && close(q, A1[1])) fb.s1 = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s1.right);
      else if (!close(ne, A1[0])) fb.s1 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (close(ne, A1[0] / 2) || close(ne, A1[0] / 3) ? "Silver is Ag⁺: 1 e⁻ per atom, so moles of e⁻ = moles of Ag = 3.24 ÷ 108." : "Grams of silver ÷ 108 = moles of electrons."));
      else fb.s1 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + NI() + " is right. Now <i>Q</i> = " + NI() + " × <i>F</i> = " + sf(A1[0]) + " × 96 500.");
      paintS1(); MV.focusFb(box); return;
    }
    if (a === "s2") {
      var c1 = P.s2.c1, c2 = P.s2.c2, it = s2.items;
      if (!c1 || !c2) fb.s2 = MV.fbHTML("", "Choose an ion for both compounds.");
      else if (c1 === MV.ans(it[0]) && c2 === MV.ans(it[1])) fb.s2 = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s2.right);
      else if (c1 === c2) fb.s2 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> The same 0.100 mol e⁻ gave different masses, so the two compounds hold different ions.");
      else fb.s2 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> More mass for the same electrons means more atoms, so fewer electrons per atom: 6.35 g is 0.100 mol Cu, 1 e⁻ each.");
      paintS2(); MV.focusFb(box); return;
    }
    if (a === "s3") {
      var wrong = [], empty = false;
      s3.runs.forEach(function(r, i){
        var ans = MV.ans(r);
        [0, 1, 2].forEach(function(j){ var v = one(P.s3[r.id][j]); if (v == null) { empty = true; delete marks[r.id + j]; return; } var ok = close(v, ans[j]); marks[r.id + j] = ok; if (!ok) wrong.push({ i:i, j:j }); });
      });
      if (!wrong.length && !empty) fb.s3 = MV.fbHTML("good", "<strong>✓ All nine are right.</strong> Run 1 is X²⁺, run 2 is X³⁺ and run 3 is X⁴⁺: <i>z</i> = " + NI() + " ÷ <i>n</i>(X).");
      else if (!wrong.length) fb.s3 = MV.fbHTML("", "So far so good. Fill in the empty boxes.");
      else {
        var tips = { 0:"<i>n</i>(e⁻) = grams of silver ÷ 108.", 1:"<i>n</i>(X) = grams of X ÷ its <i>M</i>.", 2:"<i>z</i> = <i>n</i>(e⁻) ÷ <i>n</i>(X)." }, seen = {};
        fb.s3 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Check the boxes marked ✗. " + wrong.filter(function(w){ if (seen[w.j]) return false; seen[w.j] = 1; return true; }).map(function(w){ return tips[w.j]; }).join(" "));
      }
      paintS3(); MV.focusFb(box);
    }
  });
  paintS1(); paintS2(); paintS3();
}

// ---------- Performance task: Series designer ----------
var task = (function(){
  var S = null, api = null, note = "", Q4 = [];
  function sel(){ return sortCells((S && Array.isArray(S.cells) ? S.cells : []).filter(function(id, i, a){ return ORDER.indexOf(id) >= 0 && a.indexOf(id) === i; })).slice(0, 3); }
  function read(){ return { cells:sel(), q:S && Q4.indexOf(+S.q) >= 0 ? +S.q : 0 }; }
  function masses(d){ return d.cells.map(function(id){ return massOf(CELLS[id], d.q); }); }
  function paint(){
    var inp = $("#fz-tin"), d = read(); if (!inp) return;
    MV.keepFocus(inp, function(){
      inp.innerHTML = '<span class="rg-lab" id="fz-tcl">Cells (choose 3)</span><div class="fz-cells" role="group" aria-labelledby="fz-tcl">' + ORDER.map(function(id){
        var on = d.cells.indexOf(id) >= 0;
        return '<button type="button" class="fz-cb' + (on ? " on" : "") + '" role="checkbox" aria-checked="' + on + '" data-tc="' + id + '" data-k="tc' + id + '"><span class="fz-cbm" aria-hidden="true">' + (on ? "☑" : "☐") + "</span>" + CELLS[id].ion + "</button>";
      }).join("") + '</div><div class="fz-tq"></div>';
      radios($(".fz-tq", inp), { label:"Charge", cls:"chips", aria:"Total charge in coulombs", options:Q4.map(function(q){ return { id:String(q), t:qT(q) + " C" }; }), value:d.q ? String(d.q) : "",
        onChange:function(v){ S.q = +v; api.save(); paint(); api.update(); } });
    });
    $("#fz-tcount").textContent = d.cells.length + " of 3 cells chosen";
    $("#fz-tmsg").innerHTML = note;
    var sv = $("#fz-tsvg"), m = masses(d), pos = m.filter(function(v){ return v > 0; }), lo = pos.length ? Math.min.apply(null, pos) : 0;
    var b = d.cells.map(function(id, i){ var c = CELLS[id]; return { lab:c.el + (c.metal ? "" : " (aq)"), sub:c.metal ? (d.q ? sf(m[i]) + " g" : "—") : "H₂, 0 g", v:m[i], top:c.metal && d.q && lo ? "× " + sf(m[i] / lo) : "" }; });
    sv.innerHTML = barsSVG(b, { W:360, H:200, scale:nice(Math.max.apply(null, m.concat([0.01]))), axis:"mass deposited (g); × = ratio to the lightest" });
    sv.setAttribute("aria-label", d.cells.length ? "Your design" + (d.q ? " at " + qT(d.q) + " C" : "") + ": " + d.cells.map(function(id, i){ var c = CELLS[id]; return MV.plain(c.ion) + " " + (c.metal ? (d.q ? MV.plain(sf(m[i])) + " g of " + c.el : "no charge chosen") : "hydrogen, no metal"); }).join("; ") + "." : "No cells chosen yet.");
    $("#fz-tread").innerHTML = MV.readoutHTML([["Charge <i>Q</i>", d.q ? qT(d.q) + " C → " + sf(nE(d.q)) + " mol e⁻ in each cell" : muted("choose a charge")],
      ["Masses", d.cells.length && d.q ? d.cells.map(function(id, i){ var c = CELLS[id]; return c.metal ? sf(m[i]) + " g " + c.el : "H₂ (" + c.ion + ")"; }).join(" · ") : muted("—")],
      ["Heaviest ÷ lightest", pos.length === d.cells.length && pos.length > 1 && d.q ? sf(Math.max.apply(null, pos) / lo) : muted("—")]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; Q4 = (MV.C.task.charges || []).slice(); S.cells = sel(); if (Q4.indexOf(+S.q) < 0) S.q = 0;
      inp.innerHTML = '<p class="fz-tl"><strong>Choose three different cells and a charge.</strong> <span id="fz-tcount" aria-live="polite"></span></p><div id="fz-tin" class="fz-tin"></div><p class="fz-tmsg" id="fz-tmsg" aria-live="polite"></p>';
      pv.innerHTML = '<h4 class="fz-h4">Your design: masses</h4><div class="fz-box"><svg class="fz-svg fz-tsv" id="fz-tsvg" viewBox="0 0 360 200" role="img" aria-label=""></svg></div><dl class="read" id="fz-tread" aria-live="polite"></dl>';
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-tc]"); if (!b) return;
        var id = b.dataset.tc, s = sel(), i = s.indexOf(id);
        if (i >= 0) { s.splice(i, 1); note = ""; }
        else if (s.length >= 3) note = "Three cells at most. Untick one first.";
        else { s.push(id); note = ""; }
        S.cells = sortCells(s); api.save(); paint(); api.update();
      });
      paint();
    },
    read:read,
    valid:function(d){ if (d.cells.length !== 3) return "Choose exactly three different cells (you have " + d.cells.length + ")."; if (!d.q) return "Choose a charge."; return true; },
    checks:function(d){
      var m = masses(d), allMetal = d.cells.length > 0 && d.cells.every(function(id){ return CELLS[id].metal; });
      var r12 = allMetal && d.q > 0 && m.length > 1 && Math.abs(Math.max.apply(null, m) / Math.min.apply(null, m) - 12) < 1e-6;
      var al = d.cells.indexOf("alm") >= 0 && d.q > 0 && massOf(CELLS.alm, d.q) >= 0.300 - 1e-9;
      return [allMetal, r12, d.q > 0 && d.q <= 6000, al];
    },
    key:function(d){ return d.cells.join(",") + "@" + d.q; },
    label:function(k){ var p = k.split("@"); return p[0].split(",").map(function(id){ return CELLS[id] ? CELLS[id].ion : id; }).join(" + ") + " at " + qT(+p[1]) + " C"; },
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
