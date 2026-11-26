// SCH4U 14 Bohr Model: hero (hydrogen tube → prism → four lines; the ladder drops 3, 4, 5, 6 → 2 with photons), Energy
// level ladder (Explore: C12 ladder with a vertical spectrum strip in Emission, Absorption and Gas and light modes),
// Spectra as fingerprints (Part 3: tag unknown spectra to reference elements with a "Check it with data" overlay; helium
// in the Sun; Bohr's predictions against hydrogen and helium), Energy ladder calculations (custom number, choice and
// select-all items) and Light a sign (task: choose three falls; live ladder and spectrum).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function LIN(t){ return t; }
var fx = MV.chem.fx;                                       // fixed decimals with a true minus
function eV(v){ return fx(v, 2) + " eV"; }
function nI(n){ return '<span class="m"><i>n</i> = ' + n + "</span>"; }           // HTML
function nT(n){ return '<tspan font-style="italic">n</tspan> = ' + n; }           // SVG text
function nP(n){ return "n = " + n; }                                                // plain (aria)

// ---------- hydrogen data ----------
// Levels from the course table (MV.chem.data.hLevel, Eₙ = −13.6/n² eV), rounded to 2 dp as in the plan's "Use these
// values" box: −13.60, −3.40, −1.51, −0.85, −0.54, −0.38.
var D = MV.chem.data;
var LV = [0, 1, 2, 3, 4, 5, 6].map(function(n){ return n ? Math.round(D.hLevel(n) * 100) / 100 : 0; });
function gap(u, l){ return Math.round((LV[u] - LV[l]) * 100) / 100; }
// Hydrogen's line table, wavelengths in nm: course table addition from the plan's line table (§4, §6 risk 1); it isn't
// in MV.chem.data yet. Energies come from the levels above.
var WL = { "2-1":122, "3-1":103, "4-1":97, "5-1":95, "6-1":94, "3-2":656, "4-2":486, "5-2":434, "6-2":410,
  "4-3":1875, "5-3":1282, "6-3":1094, "5-4":4051, "6-4":2625, "6-5":7460 };
var CN = { 410:"violet", 434:"violet-blue", 486:"blue-green", 656:"red" };
// hc = 1240 eV·nm. Local display constant (not in MV.chem.data): it only places photons that match no line (2.00, 11.00,
// 13.60, 14.00 eV) on the spectrum strip. No wavelength computed with it is shown to students.
var HC = 1240;
function wlOf(u, l){ return WL[u + "-" + l]; }
function reg(wl){ return wl < 380 ? "UV" : wl > 720 ? "IR" : "vis"; }
function regT(wl){ var r = reg(wl); return r === "vis" ? "Visible: " + CN[wl] : r; }
function lineT(wl){ return wl + " nm, " + (reg(wl) === "vis" ? CN[wl] : reg(wl) === "UV" ? "ultraviolet" : "infrared"); }
var TR = []; (function(){ for (var l = 1; l <= 5; l++) for (var u = l + 1; u <= 6; u++) TR.push({ u:u, l:l, k:u + "-" + l }); })();
function nLines(n){ return n * (n - 1) / 2; }
function trT(u, l){ return u + " → " + l; }

// True spectral colour for a wavelength in nm (course plan §4 exception: always shown with the wavelength and colour name).
function specRGB(wl){
  var r = 0, g = 0, b = 0;
  if (wl < 440) { r = (440 - wl) / 60; b = 1; }
  else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
  else if (wl < 510) { g = 1; b = (510 - wl) / 20; }
  else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
  else if (wl < 645) { r = 1; g = (645 - wl) / 65; }
  else r = 1;
  var f = wl < 420 ? 0.3 + 0.7 * (wl - 380) / 40 : wl > 700 ? 0.3 + 0.7 * (780 - wl) / 80 : 1;
  function c(x){ return Math.round(255 * Math.pow(clamp(x * f, 0, 1), 0.8)); }
  return "rgb(" + c(r) + "," + c(g) + "," + c(b) + ")";
}

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

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '"' + (o.i ? ' font-style="italic"' : "") + ' fill="' + (o.c || "var(--ink)") + '"' +
    (o.halo ? ' paint-order="stroke" stroke="var(--sheet)" stroke-width="3.2" stroke-linejoin="round"' : "") + (o.rot ? ' transform="rotate(' + o.rot + " " + r1(x) + " " + r1(y) + ')"' : "") + opA(o.op) + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function poly(pts, o){ o = o || {}; if (pts.length < 2) return ""; return '<polyline points="' + pts.map(function(p){ return r1(p[0]) + "," + r1(p[1]); }).join(" ") + '" fill="none" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function head(x, y, ang, len, fill, op){
  var a1 = ang + Math.PI - 0.42, a2 = ang + Math.PI + 0.42;
  return '<path d="M' + r1(x) + " " + r1(y) + " L" + r1(x + len * Math.cos(a1)) + " " + r1(y + len * Math.sin(a1)) + " L" + r1(x + len * Math.cos(a2)) + " " + r1(y + len * Math.sin(a2)) + ' Z" fill="' + fill + '"' + opA(op) + "/>";
}
// Spread labels along one axis so they don't overlap: items [{y}] -> each gets y (new) and y0 (wanted).
function spread(items, lo, hi, g){
  items.forEach(function(i){ i.y0 = i.y; });
  items.sort(function(a, b){ return a.y - b.y; });
  var i, n = items.length;
  for (i = 0; i < n; i++) items[i].y = Math.max(items[i].y, i ? items[i - 1].y + g : lo);
  if (n && items[n - 1].y > hi) { items[n - 1].y = hi; for (i = n - 2; i >= 0; i--) items[i].y = Math.min(items[i].y, items[i + 1].y - g); }
  return items;
}
// A photon: a wavy arrow from (x1, y1) to (x2, y2), drawn for the fraction f0..f1 of its length. The wiggle is tighter for
// shorter wavelengths. Visible photons use their spectral colour (with an ink underlay); UV and IR are ink.
function wavePts(p, f0, f1){
  var L = Math.hypot(p.x2 - p.x1, p.y2 - p.y1) || 1, ux = (p.x2 - p.x1) / L, uy = (p.y2 - p.y1) / L, per = reg(p.wl) === "UV" ? 6 : reg(p.wl) === "IR" ? 20 : 8 + (p.wl - 400) / 30, amp = 4, pts = [];
  for (var s = f0 * L; ; s += 1.5) {
    var ss = Math.min(s, f1 * L), tp = Math.min(1, ss / 8, (L - ss) / 12), off = amp * tp * Math.sin(2 * Math.PI * ss / per);
    pts.push([p.x1 + ux * ss - uy * off, p.y1 + uy * ss + ux * off]);
    if (ss >= f1 * L) break;
  }
  return pts;
}
function photonSVG(p){
  var f0 = p.f0 || 0, f1 = p.f1 == null ? 1 : p.f1; if (f1 <= f0) return "";
  var vis = reg(p.wl) === "vis", c = vis ? specRGB(p.wl) : "var(--ink)", pts = wavePts(p, f0, f1), op = p.op == null ? 1 : p.op, h = "";
  if (vis) h += poly(pts, { c:"var(--ink)", w:4.4, op:0.3 * op });
  h += poly(pts, { c:c, w:2.3, op:op });
  if (p.head && f1 >= 0.999) { var a = Math.atan2(p.y2 - p.y1, p.x2 - p.x1); if (vis) h += head(p.x2 + Math.cos(a), p.y2 + Math.sin(a), a, 11, "var(--ink)", 0.3 * op); h += head(p.x2, p.y2, a, 9, c, op); }
  if (p.lab) {
    var mx = lerp(p.x1, p.x2, p.lt == null ? 0.5 : p.lt), my = lerp(p.y1, p.y2, p.lt == null ? 0.5 : p.lt), L = Math.hypot(p.x2 - p.x1, p.y2 - p.y1) || 1, nx = -(p.y2 - p.y1) / L, ny = (p.x2 - p.x1) / L;
    if (ny > 0) { nx = -nx; ny = -ny; }
    h += tx(mx + nx * 15, my + ny * 15, p.lab, { fs:11.5, w:700, halo:true, op:Math.min(1, op + 0.3) });
  }
  return h;
}

// ---------- C12 energy ladder + vertical spectrum strip (viewBox 450 × 420) ----------
// @component C12 energyLadder — Bohr ladder for hydrogen (n = 1–6 on a broken energy scale, 0 eV = removed) with jump arrows,
// a violet electron, wavy photons and a vertical spectrum strip (UV band, visible, IR band; bright lines for emission, dark
// lines on a rainbow for absorption) with spread labels. ladderSVG(o, idPrefix) -> SVG string.
var G = { W:450, y0:34, y2:300, y1:392, xl:46, xr:204, lab:40, en:208, ex:58, sx:304, sw:36, lx:348 };
G.k = (G.y2 - G.y0) / (-LV[2]);
function ly(n){ return n === 1 ? G.y1 : n === 0 ? G.y0 : G.y2 - (LV[n] - LV[2]) * G.k; }
var BASE = { 1:72, 2:118, 3:154, 4:178, 5:196 };
function ax(u, l){ return BASE[l] + (u - l - 1) * 9; }
function sy(wl){
  if (wl < 380) return clamp(34 + (Math.min(wl, 200) - 90) * 60 / 36, 26, 96);
  if (wl <= 720) return 108 + (wl - 380) * 208 / 340;
  return clamp(330 + Math.log10(wl / 1000) * 81.9, 328, 406);
}
function stripDefs(pre){
  var st = "";
  for (var w = 380; w <= 720; w += 20) st += '<stop offset="' + r1((w - 380) / 340 * 100) + '%" stop-color="' + specRGB(w) + '"/>';
  return '<defs><linearGradient id="' + pre + 'rb" gradientUnits="userSpaceOnUse" x1="0" y1="' + sy(380) + '" x2="0" y2="' + sy(720) + '">' + st + "</linearGradient></defs>";
}
function jumpSVG(a){
  var t = a.t == null ? 1 : a.t; if (t <= 0) return "";
  var x = ax(a.u, a.l), y1 = a.up ? ly(a.l) : ly(a.u), y2 = a.up ? ly(a.u) : ly(a.l), ye = lerp(y1, y2, t), dir = y2 > y1 ? 1 : -1, w = a.w || 1.8, c = a.c || "var(--e-pair)", hd = 6 + w;
  var h = Math.abs(ye - y1) > hd ? ln(x, y1, x, ye - dir * hd * 0.7, { c:c, w:w, op:a.op }) : "";
  return h + head(x, ye, dir > 0 ? Math.PI / 2 : -Math.PI / 2, hd, c, a.op);
}
function electronSVG(x, y, op){ return circ(x, y, 7.5, "var(--e-pair)", { op:op }) + tx(x, y + 0.5, "−", { fs:13, w:700, c:"var(--sheet)", op:op }); }
function stripSVG(o, pre){
  var x = G.sx, w = G.sw, ab = o.strip === "ab", h = "", labs = [];
  h += tx(x + w / 2, 11, "Spectrum (nm)", { fs:11.5, w:700, c:"var(--ink-2)" });
  h += rect(x, 22, w, 78, "var(--bm-band)", { rx:3 }) + rect(x, 324, w, 88, "var(--bm-band)", { rx:3 });
  h += rect(x, 104, w, 216, ab ? "url(#" + pre + "rb)" : "var(--bm-night)", { rx:2 });
  h += tx(x - 8, 61, "ultraviolet", { fs:10.5, c:"var(--ink-2)", rot:-90 }) + tx(x - 8, 212, "visible", { fs:10.5, c:"var(--ink-2)", rot:-90 }) + tx(x - 8, 368, "infrared", { fs:10.5, c:"var(--ink-2)", rot:-90 });
  (o.lines || []).forEach(function(L){
    var y = sy(L.wl), r = reg(L.wl), op = L.op == null ? 1 : L.op;
    if (r === "vis") h += ab ? rect(x, y - 1.7, w, 3.4, "var(--bm-night)", { op:op }) : rect(x, y - 3.4, w, 6.8, specRGB(L.wl), { op:0.35 * op }) + rect(x, y - 1.4, w, 2.8, specRGB(L.wl), { op:op });
    else h += rect(x + 3, y - 1.2, w - 6, 2.4, "var(--ink)", { op:op });
    if (L.hl) h += rect(x - 3, y - 5.5, w + 6, 11, "none", { s:"var(--hi)", sw:2.2, rx:3 });
    if (L.lab !== false) labs.push({ y:y, t:L.wl + (r === "vis" ? " " + CN[L.wl] : ""), hl:L.hl, op:op });
  });
  spread(labs, 14, 412, 12.5).forEach(function(L){
    h += ln(x + w + 1, L.y0, G.lx - 3, L.y, { c:"var(--ink-2)", w:1, op:0.75 * L.op }) + tx(G.lx, L.y, L.t, { a:"start", fs:11, w:L.hl ? 700 : 400, op:L.op });
  });
  return h;
}
// o: {strip:"em"|"ab", lines:[{wl, hl, op}], arrows:[{u, l, up, t, w, op}], e:{y, x, op} | null, ion:{from, t}, photon:{…}, pop:{1:k, 2:k}, hiLv:{n:true}}
function ladderSVG(o, pre){
  var h = stripDefs(pre), n;
  h += tx(G.en, 12, '<tspan font-style="italic">E</tspan> (eV)', { a:"start", fs:11, c:"var(--ink-2)" });
  h += ln(G.xl, G.y0, G.xr, G.y0, { c:"var(--ink-2)", w:1.4, d:"5 4" }) + tx(G.lab, G.y0, "removed", { a:"end", fs:10.5, c:"var(--ink-2)" }) + tx(G.en, G.y0, "0", { a:"start", fs:12 });
  for (n = 1; n <= 6; n++) {
    var y = ly(n), on = o.hiLv && o.hiLv[n];
    h += ln(G.xl, y, G.xr, y, { c:on ? "var(--ink)" : "var(--ink-2)", w:on ? 2.8 : 2 });
    h += tx(G.lab, y, nT(n), { a:"end", fs:12, w:on ? 700 : 400 }) + tx(G.en, y, fx(LV[n], 2), { a:"start", fs:12, halo:true });
  }
  var yb = (G.y2 + G.y1) / 2;
  h += ln(G.xl - 6, yb - 3, G.xl + 6, yb - 8, { c:"var(--ink-2)", w:1.4 }) + ln(G.xl - 6, yb + 4, G.xl + 6, yb - 1, { c:"var(--ink-2)", w:1.4 }) + tx(126, yb, "gap not to scale", { a:"start", fs:10.5, c:"var(--ink-2)" });
  if (o.pop) Object.keys(o.pop).forEach(function(k){ for (var i = 0; i < o.pop[k]; i++) h += circ(50 + i * 6.5, ly(+k) - 6, 2.8, "var(--e-pair)"); });
  (o.arrows || []).forEach(function(a){ h += jumpSVG(a); });
  if (o.ion && o.ion.t > 0) {
    var iy = ly(o.ion.from) - 10, it = lerp(iy, 6, o.ion.t);
    h += ln(G.ex, iy, G.ex, it + 6, { c:"var(--e-pair)", w:2.4, d:"5 3" }) + head(G.ex, it, -Math.PI / 2, 8, "var(--e-pair)");
  }
  if (o.e) h += electronSVG(o.e.x || G.ex, o.e.y, o.e.op);
  if (o.photon) h += photonSVG(o.photon);
  h += stripSVG(o, pre);
  return h;
}
function linesSummary(rec){
  var vis = [], uv = 0, ir = 0, seen = {};
  rec.forEach(function(r){ var k = r.u + "-" + r.l, wl = WL[k]; if (seen[k] || !wl) return; seen[k] = 1; if (reg(wl) === "vis") vis.push(wl); else if (reg(wl) === "UV") uv++; else ir++; });
  return "Visible: " + (vis.length ? vis.join(" · ") + " nm" : "none") + "; UV: " + uv + "; IR: " + ir;
}
function uniqRec(rec){ var seen = {}, out = []; rec.forEach(function(r){ var k = r.u + "-" + r.l; if (!seen[k]) { seen[k] = 1; out.push(r); } }); return out; }
function cleanRec(a){ return Array.isArray(a) ? a.filter(function(r){ return r && WL[r.u + "-" + r.l]; }).map(function(r){ return { u:r.u, l:r.l, p:!!r.p }; }).slice(-40) : []; }

// ---------- hero ----------
function hero(f){
  var svg = $("#bm-hx-svg"), ctr = $("#bm-hx-ctr"), rep = $("#bm-hx-replay"), cap = f.cap;
  if (!svg) return;
  var U = [3, 4, 5, 6], W4 = U.map(function(u){ return wlOf(u, 2); }), Y1 = 330, Y2 = 262, K = (Y2 - 24) / (-LV[2]), SX = 316, SW = 26, run = 0, st;
  function hy(n){ return n === 1 ? Y1 : Y2 - (LV[n] - LV[2]) * K; }
  function hx(u){ return 94 + (u - 3) * 18; }
  function hs(wl){ return 44 + (wl - 400) * 266 / 280; }
  function reset(){ st = { glow:0, rays:0, lines:0, lab:0, fade:0, lad:0, arr:[0, 0, 0, 0], ph:[0, 0, 0, 0], ey:null, k:-1 }; }
  function draw(){
    var h = "", lo = lerp(0.5, 1, st.lad), tf = 1 - 0.78 * st.fade;
    for (var n = 1; n <= 6; n++) { var y = hy(n); h += ln(42, y, 190, y, { c:st.lad > 0.5 ? "var(--ink)" : "var(--ink-2)", w:2, op:lo }) + tx(36, y, nT(n), { a:"end", fs:12, op:lo }); }
    var yb = (Y1 + Y2) / 2; h += ln(36, yb - 3, 48, yb - 8, { c:"var(--ink-2)", w:1.4, op:lo }) + ln(36, yb + 4, 48, yb - 1, { c:"var(--ink-2)", w:1.4, op:lo });
    // tube, beam, prism and rays
    h += rect(200, 118, 14, 84, "var(--bm-tube)", { rx:7, op:0.15 + 0.85 * st.glow * tf }) + rect(200, 118, 14, 84, "none", { rx:7, s:"var(--ink-2)", sw:1.4, op:tf });
    h += tx(207, 214, "hydrogen", { fs:11, c:"var(--ink-2)", op:tf }) + tx(207, 227, "tube", { fs:11, c:"var(--ink-2)", op:tf });
    if (st.rays > 0) h += ln(215, 160, lerp(215, 246, Math.min(1, st.rays * 3)), 160, { c:"var(--bm-tube)", w:3, op:tf });
    h += '<polygon points="242,184 268,184 255,140" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.5"' + opA(tf) + "/>";
    if (st.rays > 0.33) { var rt = (st.rays - 0.33) / 0.67; W4.forEach(function(wl){ h += ln(261, 162, lerp(261, SX - 1, rt), lerp(162, hs(wl), rt), { c:specRGB(wl), w:1.8, op:0.85 * tf }); }); }
    // strip
    h += tx(SX + SW / 2, 30, "spectrum", { fs:11, c:"var(--ink-2)" }) + rect(SX, 40, SW, 276, "var(--bm-night)", { rx:3 });
    W4.forEach(function(wl, i){
      var y = hs(wl), op = st.lines;
      if (op > 0) h += rect(SX, y - 3.5, SW, 7, specRGB(wl), { op:0.35 * op }) + rect(SX, y - 1.4, SW, 2.8, specRGB(wl), { op:op });
      if (st.k === i) h += rect(SX - 3, y - 6, SW + 6, 12, "none", { s:"var(--hi)", sw:2.2, rx:3 });
      if (st.lab > 0) h += tx(SX + SW + 6, y, '<tspan font-weight="700">' + wl + " nm</tspan> " + CN[wl], { a:"start", fs:12, op:st.lab });
    });
    // jumps and photons
    U.forEach(function(u, i){
      if (st.arr[i] > 0) h += jumpAtHero(hx(u), hy(u), hy(2), st.arr[i], st.k === i);
      if (st.ph[i] > 0) {
        var p = { x1:hx(u) + 7, y1:(hy(u) + hy(2)) / 2, x2:SX - 2, y2:hs(W4[i]), wl:W4[i], f0:st.ph[i] < 1 ? Math.max(0, st.ph[i] - 0.4) : 0, f1:st.ph[i], head:true, op:st.k === i || st.k < 0 ? 1 : 0.7 };
        if (st.k === i && st.ph[i] >= 1) { p.lab = W4[i] + " nm, " + CN[W4[i]]; p.lt = 0.62; }
        h += photonSVG(p);
      }
    });
    if (st.ey != null) h += electronSVG(64, st.ey);
    svg.innerHTML = h;
  }
  function jumpAtHero(x, y1, y2, t, cur){
    var ye = lerp(y1, y2, t), w = cur ? 2.8 : 1.9;
    return (ye - y1 > 9 ? ln(x, y1, x, ye - 6, { c:"var(--e-pair)", w:w }) : "") + head(x, ye, Math.PI / 2, 9, "var(--e-pair)");
  }
  function final(){
    st = { glow:1, rays:1, lines:1, lab:1, fade:1, lad:1, arr:[1, 1, 1, 1], ph:[1, 1, 1, 1], ey:hy(2), k:-1 }; draw();
    ctr.innerHTML = "Four falls to " + nI(2) + ": four visible lines.";
    cap.textContent = "Each line is one jump."; rep.hidden = false;
  }
  function play(){
    var id = ++run; reset(); rep.hidden = true; cap.textContent = ""; draw();
    ctr.textContent = "Hydrogen’s light through a prism: a few sharp lines, not a rainbow.";
    function ok(){ return id === run; }
    MV.tween({ dur:500, step:function(t){ if (!ok()) return; st.glow = t; draw(); }, done:function(){
      if (!ok()) return;
      MV.tween({ dur:1400, ease:LIN, step:function(t){ if (!ok()) return; st.rays = t; st.lines = clamp((t - 0.8) / 0.2, 0, 1); draw(); }, done:function(){
        if (!ok()) return;
        MV.tween({ dur:400, step:function(t){ if (!ok()) return; st.lab = t; draw(); }, done:function(){
          if (!ok()) return;
          MV.wait(900, function(){
            if (!ok()) return;
            ctr.innerHTML = "Now the energy ladder: each line comes from one fall.";
            MV.tween({ dur:600, step:function(t){ if (!ok()) return; st.fade = t; st.lad = t; draw(); }, done:function(){ if (!ok()) return; fall(0); } });
          });
        } });
      } });
    } });
    function fall(i){
      if (!ok()) return;
      if (i >= 4) { MV.wait(400, function(){ if (ok()) final(); }); return; }
      var u = U[i]; st.k = i; st.ey = hy(u); draw();
      ctr.innerHTML = "The electron drops from " + nI(u) + " to " + nI(2) + ": one photon, " + W4[i] + " nm, " + CN[W4[i]] + ".";
      MV.tween({ dur:600, step:function(t){ if (!ok()) return; st.arr[i] = t; st.ey = lerp(hy(u), hy(2), t); draw(); }, done:function(){
        if (!ok()) return;
        MV.tween({ dur:800, ease:LIN, step:function(t){ if (!ok()) return; st.ph[i] = t; draw(); }, done:function(){ if (!ok()) return; MV.wait(900, function(){ fall(i + 1); }); } });
      } });
    }
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Energy level ladder ----------
var CHIPS = [];
function explore(host, api){
  var S = api.S, C = api.content;
  CHIPS = C.chips.slice();
  if (["em", "ab", "gas"].indexOf(S.mode) < 0) S.mode = "em";
  var em = S.em = S.em && typeof S.em === "object" ? S.em : {};
  em.cur = clamp(Math.round(+em.cur || 1), 1, 6); em.hi = clamp(Math.round(+em.hi || em.cur), em.cur, 6); em.rec = cleanRec(em.rec);
  em.last = em.last && WL[em.last.u + "-" + em.last.l] ? { u:em.last.u, l:em.last.l, p:!!em.last.p } : null; em.show = !!em.show && !!em.last;
  var ab = S.ab = S.ab && typeof S.ab === "object" ? S.ab : {};
  ab.start = ab.start === 2 ? 2 : 1; ab.cur = clamp(Math.round(ab.cur == null ? ab.start : +ab.cur), 0, 6); ab.hi = clamp(Math.round(+ab.hi || Math.max(1, ab.cur)), 1, 6);
  if (CHIPS.indexOf(+ab.E) < 0) ab.E = CHIPS[0]; ab.rec = cleanRec(ab.rec);
  if (!ab.last || typeof ab.last !== "object" || ["jump", "pass", "ion"].indexOf(ab.last.res) < 0) ab.last = null;
  var gs = S.gas = S.gas && typeof S.gas === "object" ? S.gas : {};
  gs.temp = gs.temp === "hot" ? "hot" : "cool"; if (["n1", "n2", "n3"].indexOf(gs.tag) < 0) gs.tag = "";
  var busy = false, locked = false, tw = null, A = null, note = "", seq = 0;

  host.innerHTML = '<p class="how bm-how">' + C.how + '</p><div class="bm-modes"></div><div class="bm-grid">' +
    '<div class="bm-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="bm-box"><svg class="bm-svg" id="bm-lad" viewBox="0 0 450 420" role="img" aria-label=""></svg></div><p class="bm-cap" aria-live="polite"></p></div>' +
    '<div class="bm-side"><div class="bm-c" data-for="em"><div class="bm-place"></div><div class="bm-fall"></div></div>' +
    '<div class="bm-c" data-for="ab"><div class="bm-start"></div><div class="bm-chips"></div><div class="bm-sendrow"></div></div>' +
    '<div class="bm-c" data-for="gas"><div class="bm-temp"></div><div class="bm-tagrow"></div><p class="tiny muted">' + C.gasNote + "</p></div>" +
    '<div class="bm-btns"></div><dl class="read bm-read" aria-live="polite"></dl></div></div>' +
    '<p class="tiny muted bm-note">' + C.evNote + '</p><div class="bm-tabs"></div>';
  var svg = $("#bm-lad"), fallBox = $(".bm-fall", host), sendRow = $(".bm-sendrow", host), btns = $(".bm-btns", host);

  // C13 panels: hydrogen's energy levels and line table (course table additions registered locally)
  MV.chem.tables.bmLev = { title:"Hydrogen’s energy levels", head:["Level", "Energy (eV)"], rows:[1, 2, 3, 4, 5, 6].map(function(n){ return [nI(n), fx(LV[n], 2)]; }), note:"Eₙ = −13.6/n² eV, rounded to 0.01 eV. 1 eV = 1.60 × 10<sup>−19</sup> J." };
  MV.chem.tables.bmLines = { title:"Hydrogen’s lines", head:["Transition", "Energy (eV)", "Wavelength (nm)", "Region and colour"],
    rows:TR.map(function(t){ var wl = WL[t.k]; return [trT(t.u, t.l), fx(gap(t.u, t.l), 2), String(wl), reg(wl) === "vis" ? CN[wl] : reg(wl)]; }), note:"Energies are the gaps between the levels; wavelengths are rounded to the nearest nanometre." };
  MV.chem.tablePanel($(".bm-tabs", host), "bmLev", { title:"Use these values: hydrogen’s energy levels" });
  MV.chem.tablePanel($(".bm-tabs", host), "bmLines", { title:"Course data table: hydrogen’s lines" });

  // ----- controls -----
  var RG = {};
  RG.mode = radios($(".bm-modes", host), { label:"Mode", aria:"Ladder mode", options:C.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; note = ""; api.save(); paint(); } });
  RG.place = radios($(".bm-place", host), { label:"Place electron on", cls:"chips", aria:"Place the electron on a level", options:[1, 2, 3, 4, 5, 6].map(function(n){ return { id:String(n), t:nI(n) }; }), value:String(em.cur),
    onChange:function(v){ em.cur = +v; em.hi = Math.max(em.hi, em.cur); em.show = false; note = ""; api.save(); paint(); } });
  RG.start = radios($(".bm-start", host), { label:"Electron starts at", aria:"Starting level for absorption", options:[{ id:"1", t:nI(1) }, { id:"2", t:nI(2) }], value:String(ab.start),
    onChange:function(v){ ab.start = +v; ab.cur = ab.start; ab.hi = ab.start; ab.last = null; note = ""; api.save(); paint(); } });
  RG.chip = radios($(".bm-chips", host), { label:"Photon energy (eV)", cls:"chips", aria:"Photon energy in electron volts", options:CHIPS.map(function(v){ return { id:fx(v, 2), t:fx(v, 2) }; }), value:fx(ab.E, 2),
    onChange:function(v){ ab.E = CHIPS.filter(function(c){ return fx(c, 2) === v; })[0]; api.save(); paintCap(); } });
  RG.temp = radios($(".bm-temp", host), { label:"Gas temperature", aria:"Gas temperature", options:C.temps, value:gs.temp, onChange:function(v){ gs.temp = v; note = ""; api.save(); paint(); } });
  RG.tag = radios($(".bm-tagrow", host), { label:"The atoms that make the visible dark lines:", cls:"chips", aria:"Tag the level the absorbing electrons start on", options:C.tags, value:gs.tag, onChange:function(v){ gs.tag = v; api.save(); paint(); } });
  function syncRG(){ RG.mode.set(S.mode); RG.place.set(String(em.cur)); RG.start.set(String(ab.start)); RG.chip.set(fx(ab.E, 2)); RG.temp.set(gs.temp); RG.tag.set(gs.tag); }
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); paintCtl(); }
  function paintCtl(){
    var dis = locked || busy ? " disabled" : "";
    MV.keepFocus(fallBox, function(){
      var h = '<span class="rg-lab">Fall to…</span><div class="bm-fallb">';
      if (em.cur <= 1) h += '<span class="tiny muted">The electron is in the ground state, ' + nI(1) + ": it can’t fall any lower.</span>";
      else for (var k = em.cur - 1; k >= 1; k--) h += '<button type="button" class="btn sm bm-fb" data-fall="' + k + '" data-k="fall' + k + '" aria-label="Fall from n = ' + em.cur + " to n = " + k + '"' + dis + ">" + nI(k) + "</button>";
      fallBox.innerHTML = h + '</div><p class="tiny muted bm-casc"><strong>Cascade:</strong> keep falling. The electron stays where it lands, so you pick each step down.</p>';
    });
    MV.keepFocus(sendRow, function(){
      sendRow.innerHTML = '<button type="button" class="btn primary sm" data-act="send" data-k="send"' + (dis || ab.cur === 0 ? " disabled" : "") + ">Send photon</button>" + (ab.cur === 0 ? ' <span class="tiny muted">The electron has been removed. Reset to the ground state or choose a start level.</span>' : "");
    });
    MV.keepFocus(btns, function(){
      btns.innerHTML = '<button type="button" class="btn ghost sm" data-act="reset" data-k="reset"' + dis + ">Reset to ground state</button>" +
        '<button type="button" class="btn ghost sm" data-act="clear" data-k="clear"' + (dis || S.mode === "gas" ? " disabled" : "") + ">Clear spectrum</button>";
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked || busy || !host.contains(b)) return;
    if (b.dataset.fall) { fall(em.cur, +b.dataset.fall, false); return; }
    var a = b.dataset.act;
    if (a === "send") absorb(ab.E, false);
    else if (a === "reset") {
      note = "";
      if (S.mode === "em") { em.cur = 1; em.hi = 1; em.show = false; }
      else if (S.mode === "ab") { ab.start = 1; ab.cur = 1; ab.hi = 1; ab.last = null; }
      else { gs.temp = "cool"; gs.tag = ""; }
      syncRG(); api.save(); paint();
    } else if (a === "clear") {
      note = "";
      if (S.mode === "em") { em.rec = []; em.last = null; em.show = false; em.hi = em.cur; }
      else if (S.mode === "ab") { ab.rec = []; ab.last = null; ab.hi = Math.max(1, ab.cur); }
      api.save(); paint();
    }
  });

  // ----- animations -----
  function cancelAnim(){ seq++; if (tw) { tw(); tw = null; } A = null; if (busy) { busy = false; } }
  function begin(){ cancelAnim(); busy = true; lock(true); return seq; }
  function fall(u, l, pred, cb, dur){
    var my = begin(); A = { kind:"fall", u:u, l:l, t:0, f:0 }; em.show = false; paintCap();
    tw = MV.tween({ dur:dur || 1500, ease:LIN, step:function(s){ if (my !== seq) return; A.t = Math.min(1, s / 0.38); A.f = clamp((s - 0.38) / 0.62, 0, 1); draw(); }, done:function(){
      if (my !== seq) return; tw = null; A = null; busy = false;
      em.rec.push({ u:u, l:l, p:!!pred }); em.rec = em.rec.slice(-40); em.last = { u:u, l:l, p:!!pred }; em.cur = l; em.show = true;
      RG.place.set(String(em.cur)); api.save(); if (!pred) lock(false); paint(); if (cb) cb();
    } });
  }
  function result(E, n){
    if (!n) return { res:"none" };
    var I = -LV[n];
    if (E >= I - 0.005) return { res:"ion", extra:Math.round((E - I) * 100) / 100 };
    for (var u = n + 1; u <= 6; u++) if (Math.abs(gap(u, n) - E) < 0.005) return { res:"jump", to:u };
    return { res:"pass" };
  }
  function absPhoton(E, from, r, f){
    var wl = r.res === "jump" ? wlOf(r.to, from) : HC / E, x1 = G.sx - 3, y1 = sy(wl), x2, y2;
    if (r.res === "jump") { x2 = ax(r.to, from) + 5; y2 = ly(from) - 3; }
    else if (r.res === "ion") { x2 = G.ex + 9; y2 = ly(from) - 4; }
    else { var tx0 = G.ex + 9, ty0 = ly(from) - 4, k = (x1 - 6) / (x1 - tx0); x2 = 6; y2 = clamp(y1 + (ty0 - y1) * k, 8, 412); }
    return { x1:x1, y1:y1, x2:x2, y2:y2, wl:wl, E:E, f0:f < 1 ? Math.max(0, f - 0.35) : 0, f1:f, head:r.res !== "pass" };
  }
  function absorb(E, pred, cb){
    var from = ab.cur, r = result(E, from); if (r.res === "none") return;
    var my = begin(); A = { kind:"abs", E:E, from:from, r:r, f:0, t:0 }; paintCap();
    tw = MV.tween({ dur:r.res === "pass" ? 1500 : 1800, ease:LIN, step:function(s){ if (my !== seq) return; var sp = r.res === "pass" ? 1 : 0.55; A.f = Math.min(1, s / sp); A.t = r.res === "pass" ? 0 : clamp((s - 0.55) / 0.45, 0, 1); draw(); }, done:function(){
      if (my !== seq) return; tw = null; A = null; busy = false;
      ab.last = { from:from, E:E, res:r.res, to:r.to || 0, extra:r.extra || 0, p:!!pred };
      if (r.res === "jump") { ab.rec.push({ u:r.to, l:from, p:!!pred }); ab.rec = ab.rec.slice(-40); ab.cur = r.to; ab.hi = Math.max(ab.hi, r.to); }
      else if (r.res === "ion") ab.cur = 0;
      api.save(); if (!pred) lock(false); paint(); if (cb) cb();
    } });
  }

  // ----- drawing -----
  function scene(){
    var o, m = S.mode;
    if (m === "em") {
      var cur = A && A.kind === "fall" ? A : null, lastK = em.show && em.last ? em.last.u + "-" + em.last.l : "";
      o = { strip:"em", arrows:[], lines:[], hiLv:{} };
      uniqRec(em.rec).forEach(function(r){ var k = r.u + "-" + r.l; if (cur && cur.u === r.u && cur.l === r.l) return; o.arrows.push({ u:r.u, l:r.l, w:k === lastK ? 2.8 : 1.6, op:k === lastK ? 1 : 0.5 }); o.lines.push({ wl:WL[k], hl:k === lastK }); });
      if (cur) {
        o.arrows.push({ u:cur.u, l:cur.l, t:cur.t, w:3 });
        o.e = { y:lerp(ly(cur.u), ly(cur.l), cur.t) }; o.hiLv[cur.u] = 1; o.hiLv[cur.l] = 1;
        if (cur.f > 0) {
          var wl = wlOf(cur.u, cur.l), x = ax(cur.u, cur.l);
          o.photon = { x1:x + 7, y1:(ly(cur.u) + ly(cur.l)) / 2, x2:G.sx - 3, y2:sy(wl), wl:wl, f0:Math.max(0, cur.f - 0.35), f1:cur.f, head:true };
          if (cur.f >= 1) { o.photon.f0 = 0; o.lines = o.lines.filter(function(L){ return L.wl !== wl; }); o.lines.push({ wl:wl, hl:true }); }
        }
      } else {
        o.e = { y:ly(em.cur) }; o.hiLv[em.cur] = 1;
        if (em.show && em.last) {
          var u = em.last.u, l = em.last.l, w2 = wlOf(u, l), x2 = ax(u, l);
          o.photon = { x1:x2 + 7, y1:(ly(u) + ly(l)) / 2, x2:G.sx - 3, y2:sy(w2), wl:w2, head:true, op:0.85, lab:reg(w2) === "vis" ? w2 + " nm, " + CN[w2] : reg(w2), lt:0.62 };
        }
      }
      return o;
    }
    if (m === "ab") {
      o = { strip:"ab", arrows:[], lines:[], hiLv:{} };
      var L = ab.last && !A ? ab.last : null, lk = L && L.res === "jump" ? L.to + "-" + L.from : "";
      uniqRec(ab.rec).forEach(function(r){ var k = r.u + "-" + r.l; o.arrows.push({ u:r.u, l:r.l, up:true, w:k === lk ? 2.8 : 1.6, op:k === lk ? 1 : 0.5 }); o.lines.push({ wl:WL[k], hl:k === lk }); });
      if (A && A.kind === "abs") {
        var r = A.r, from = A.from;
        o.photon = absPhoton(A.E, from, r, A.f); o.hiLv[from] = 1;
        if (r.res === "jump") {
          if (A.t > 0) { o.arrows.push({ u:r.to, l:from, up:true, t:A.t, w:3 }); o.hiLv[r.to] = 1; o.lines.push({ wl:wlOf(r.to, from), hl:true, op:A.t }); }
          o.e = { y:lerp(ly(from), ly(r.to), A.t) };
        } else if (r.res === "ion") { o.ion = { from:from, t:A.t }; o.e = { y:lerp(ly(from), 16, A.t) }; }
        else o.e = { y:ly(from) };
      } else {
        o.e = ab.cur ? { y:ly(ab.cur) } : { y:16 }; if (ab.cur) o.hiLv[ab.cur] = 1;
        if (L) {
          o.photon = absPhoton(L.E, L.from, { res:L.res, to:L.to }, 1); o.photon.op = 0.8;
          var lw = o.photon.wl;
          o.photon.lab = L.res === "jump" ? (reg(lw) === "vis" ? lw + " nm, " + CN[lw] : reg(lw)) : L.res === "pass" ? fx(L.E, 2) + " eV: passes" : fx(L.E, 2) + " eV";
          o.photon.lt = L.res === "pass" ? 0.3 : 0.5;
          if (L.res === "ion") o.ion = { from:L.from, t:1 };
        }
      }
      return o;
    }
    var hot = gs.temp === "hot";
    o = { strip:"ab", arrows:[], lines:[], pop:hot ? { 1:3, 2:2 } : { 1:4 }, hiLv:{ 1:1 } };
    for (var u2 = 2; u2 <= 6; u2++) { o.arrows.push({ u:u2, l:1, up:true, w:1.8, op:0.85 }); o.lines.push({ wl:wlOf(u2, 1) }); }
    if (hot) { o.hiLv[2] = 1; for (var u3 = 3; u3 <= 6; u3++) { o.arrows.push({ u:u3, l:2, up:true, w:2.4 }); o.lines.push({ wl:wlOf(u3, 2), hl:gs.tag === "n2" }); } }
    return o;
  }
  function describe(o){
    var m = S.mode, t = "Energy ladder for hydrogen, levels n = 1 to 6 (" + LV.slice(1).map(function(v){ return MV.plain(fx(v, 2)); }).join(", ") + " eV), beside a spectrum strip with ultraviolet at the top, visible light in the middle and infrared at the bottom. ";
    if (m === "em") {
      t += busy ? "The electron is falling. " : "Electron at " + nP(em.cur) + ". ";
      t += em.rec.length ? "Bright lines recorded: " + MV.plain(linesSummary(em.rec)) + "." : "No lines recorded yet.";
    } else if (m === "ab") {
      t += busy ? "A photon is on its way. " : (ab.cur ? "Electron at " + nP(ab.cur) + ". " : "The electron has been removed. ");
      t += ab.rec.length ? "Dark lines recorded: " + MV.plain(linesSummary(ab.rec)) + "." : "No dark lines yet.";
    } else t += "White light through " + (gs.temp === "hot" ? "very hot" : "cool") + " hydrogen gas: dark lines at " + o.lines.map(function(L){ return L.wl; }).join(", ") + " nm.";
    return t;
  }
  function draw(){ var o = scene(); svg.innerHTML = ladderSVG(o, "bmx"); svg.setAttribute("aria-label", describe(o)); }

  // ----- readout and caption -----
  function paintRead(){
    var rows = [], m = S.mode;
    if (m === "em") {
      var L = em.show && em.last ? em.last : null, w = L ? wlOf(L.u, L.l) : 0;
      rows.push(["Current level", nI(em.cur) + " (" + eV(LV[em.cur]) + ")"],
        ["Last photon", L ? "Emitted, " + eV(gap(L.u, L.l)) + " (" + trT(L.u, L.l) + ")" : muted("none yet")],
        ["Wavelength", L ? w + " nm" : muted("—")], ["Region", L ? regT(w) : muted("—")],
        ["Lines recorded", linesSummary(em.rec)], ["Possible lines from the highest level reached", nLines(em.hi) + " (from " + nI(em.hi) + ")"]);
    } else if (m === "ab") {
      var B = ab.last, bw = B && B.res === "jump" ? wlOf(B.to, B.from) : 0, lp;
      if (!B) lp = muted("none yet");
      else if (B.res === "jump") lp = "Absorbed, " + eV(B.E) + ": " + nI(B.from) + " → " + nI(B.to);
      else if (B.res === "pass") lp = "Passed through, " + eV(B.E) + ": no gap of " + eV(B.E) + " from " + nI(B.from);
      else lp = "Absorbed, " + eV(B.E) + ": electron removed" + (B.extra > 0 ? "; the extra " + eV(B.extra) + " becomes the electron’s motion" : "");
      rows.push(["Current level", ab.cur ? nI(ab.cur) + " (" + eV(LV[ab.cur]) + ")" : "electron removed (the atom is ionized)"], ["Last photon", lp],
        ["Wavelength", bw ? bw + " nm" : muted("—")], ["Region", bw ? regT(bw) : muted("—")],
        ["Lines recorded", linesSummary(ab.rec) + " (dark)"], ["Possible lines from the highest level reached", nLines(ab.hi) + " (from " + nI(ab.hi) + ")"]);
    } else {
      var hot = gs.temp === "hot", tg = C.tags.filter(function(x){ return x.id === gs.tag; })[0];
      rows.push(["Atoms start at", hot ? nI(1) + ", and some at " + nI(2) : nI(1) + " (almost every atom)"], ["Light", "White light: every wavelength shines in; matching photons are absorbed"],
        ["Dark lines (nm)", "122 · 103 · 97 · 95 · 94" + (hot ? " · 656 · 486 · 434 · 410" : "")], ["Region", hot ? "UV and visible" : "UV only"],
        ["Lines recorded", hot ? "Visible: 656 · 486 · 434 · 410 nm; UV: 5; IR: 0 (dark)" : "Visible: none; UV: 5; IR: 0 (dark)"], ["Your tag", tg ? tg.t : muted("not tagged yet")]);
    }
    $(".bm-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var m = S.mode, t = "";
    if (m === "em") {
      if (busy) t = "The electron falls, and a photon flies to the spectrum…";
      else if (em.show && em.last) { var u = em.last.u, l = em.last.l; t = "The electron fell " + trT(u, l) + " and gave out a " + eV(gap(u, l)) + " photon: " + lineT(wlOf(u, l)) + "."; }
      else t = "Place the electron on a level, then choose a level for it to fall to.";
    } else if (m === "ab") {
      var B = ab.last;
      if (busy) t = "A photon arrives from the light…";
      else if (!B) t = ab.cur ? "Choose a photon energy, then press <strong>Send photon</strong>." : "The electron has been removed.";
      else if (B.res === "jump") t = "The " + eV(B.E) + " photon matched the " + trT(B.from, B.to) + " gap exactly: absorbed. A dark line appears at " + wlOf(B.to, B.from) + " nm.";
      else if (B.res === "pass") t = "No gap of " + eV(B.E) + " from " + nI(B.from) + ": the photon passes straight through.";
      else t = eV(B.E) + (B.extra > 0 ? " is more than the " + eV(-LV[B.from]) + " needed to remove the electron from " + nI(B.from) + ": the atom ionizes. The extra " + eV(B.extra) + " becomes the electron’s motion." : " removes the electron from " + nI(B.from) + ": the atom ionizes.");
    } else t = gs.temp === "hot" ? "In very hot hydrogen, some atoms sit at " + nI(2) + ". Their gaps (1.89–3.02 eV) take out visible light: dark lines at 656, 486, 434 and 410 nm." : "White light shines through cool hydrogen. Almost every atom is at " + nI(1) + ", so every gap it absorbs is UV: no visible dark lines.";
    $(".bm-cap", host).innerHTML = t + (note && !busy ? " <strong>" + note + "</strong>" : "");
  }
  function paint(){
    var m = S.mode;
    $$(".bm-c", host).forEach(function(p){ p.hidden = p.dataset.for !== m; });
    draw(); paintRead(); paintCap(); paintCtl();
    MV.changed();
  }

  // ----- predictions -----
  function setMode(m){ S.mode = m; }
  var hooks = {
    start:function(p){
      cancelAnim(); note = "";
      if (p.id === "p2") { setMode("ab"); ab.start = 2; ab.cur = 2; ab.hi = 2; ab.E = 2.00; ab.last = null; ab.rec = []; }
      else { setMode("em"); em.rec = []; em.last = null; em.show = false; em.cur = p.id === "p1" ? 3 : p.id === "p3" ? 4 : 2; em.hi = em.cur; }
      syncRG(); api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(n){ note = n || ""; busy = false; lock(false); paint(); MV.wait(150, done); }
      if (p.id === "p1") fall(3, 2, true, function(){ fin(""); });
      else if (p.id === "p2") absorb(2.00, true, function(){ fin(""); });
      else if (p.id === "p4") fall(2, 1, true, function(){ fin("The line lands in the grey UV band: invisible to us."); });
      else {
        var L = [[4, 3], [4, 2], [4, 1], [3, 2], [3, 1], [2, 1]];
        (function next(i){
          if (i >= L.length) { em.cur = 1; em.hi = 4; em.show = false; RG.place.set("1"); api.save(); fin("All six arrows: 4 × 3 ÷ 2 = 6 different lines."); return; }
          fall(L[i][0], L[i][1], true, function(){ next(i + 1); }, 900);
        })(0);
      }
    }
  };

  // ----- challenges -----
  function chal(id){
    if (id === "tc1") {
      if (em.rec.some(function(r){ return !r.p && r.u === 4 && r.l === 2; })) return { ok:true };
      var L = em.last && !em.last.p ? em.last : null;
      if (L && L.u === 3 && L.l === 2) return { ok:false, msg:"That’s red, 656 nm." };
      if (L && L.u === 4 && L.l === 1) return { ok:false, msg:"Ending at " + nI(1) + " gives UV." };
      if (L && L.u === 5 && L.l === 2) return { ok:false, msg:"That’s violet-blue, 434 nm." };
      if (L) return { ok:false, msg:trT(L.u, L.l) + " gives " + lineT(wlOf(L.u, L.l)) + ", not blue-green." };
      return { ok:false };
    }
    if (id === "tc2") {
      var B = ab.last && !ab.last.p ? ab.last : null;
      if (!B) return { ok:false };
      if (B.from !== 1) return { ok:false, msg:"Start in the ground state, " + nI(1) + "." };
      var E = Math.round(B.E * 100) / 100;
      if (E === 12.09 && B.res === "jump" && B.to === 3) return { ok:true };
      if (E === 1.89) return { ok:false, msg:"From " + nI(1) + " no gap is 1.89 eV." };
      if (E === 10.20) return { ok:false, msg:"That reaches " + nI(2) + "; from there it can only fall to 1, giving no red." };
      if (E === 12.75) return { ok:false, msg:"That works (4 → 3 → 2), but it isn’t the lowest." };
      if (B.res === "ion") return { ok:false, msg:"That removes the electron completely, so this atom can’t emit the red line." };
      return { ok:false, msg:"From " + nI(1) + " no gap is " + eV(E) + ": the photon passes straight through." };
    }
    if (id === "tc3") {
      if (gs.temp !== "hot") return { ok:false, msg:"Almost every atom is at " + nI(1) + ". From there, every gap is UV." };
      if (gs.tag === "n1") return { ok:false, msg:"The visible gaps (1.89–3.02 eV) start at " + nI(2) + "." };
      if (gs.tag === "n3") return { ok:false, msg:"Gaps up from " + nI(3) + " are all IR. The visible gaps (1.89–3.02 eV) start at " + nI(2) + "." };
      if (gs.tag !== "n2") return { ok:false, msg:"The four visible dark lines are there. Now tag the level those absorbing electrons start on." };
      return { ok:true };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Spectra as fingerprints ----------
// Horizontal spectrum strips (viewBox 360 × 56): black, with lines in their spectral colours and wavelength labels below.
var HZ = { x0:10, x1:350, w0:400, w1:700 }, ZOOM = { x0:10, x1:350, w0:580, w1:596 };
function hpx(wl, z){ return z.x0 + (wl - z.w0) * (z.x1 - z.x0) / (z.w1 - z.w0); }
function hStrip(lines, o){
  o = o || {}; var z = o.z || HZ, T = 14, Hh = 22, h = rect(z.x0 - 4, T, z.x1 - z.x0 + 8, Hh, "var(--bm-night)", { rx:3 }), labs = [];
  if (o.z) for (var g = Math.ceil(z.w0); g <= z.w1; g += 2) h += ln(hpx(g, z), T + Hh, hpx(g, z), T + Hh + 3, { c:"var(--ink-2)", w:1 });
  lines.forEach(function(L){
    var xs = L.pair ? (o.z ? [hpx(589.0, z), hpx(589.6, z)] : [hpx(L.wl, z) - 1.6, hpx(L.wl, z) + 1.6]) : [hpx(L.wl, z)], c = specRGB(L.pair ? 589.3 : L.wl);
    xs.forEach(function(x){ h += rect(x - 2.8, T, 5.6, Hh, c, { op:0.35 }) + rect(x - 1, T, 2, Hh, c); });
    if (L.pair && o.z) labs.push({ y:xs[0], t:"589.0" }, { y:xs[1], t:"589.6" }); else labs.push({ y:hpx(L.wl, z), t:String(L.wl) });
  });
  (o.over || []).forEach(function(L){
    var xs = L.pair && o.z ? [hpx(589.0, z), hpx(589.6, z)] : [hpx(L.wl, z)];
    xs.forEach(function(x){ h += ln(x, T - 3, x, T + Hh + 2, { c:"var(--ink)", w:1.4, d:"3 2" }) + head(x, T - 2, Math.PI / 2, 7, "var(--ink)"); });
  });
  spread(labs, 12, 348, o.z ? 30 : 21).forEach(function(L){ h += ln(L.y0, T + Hh + 1, L.y, T + Hh + 5, { c:"var(--ink-2)", w:1 }) + tx(L.y, T + Hh + 12, L.t, { fs:10.5 }); });
  return h;
}
function lineList(lines){ var w = lines.map(function(L){ return L.pair ? "589 (a close pair)" : String(L.wl); }); return w.length > 1 ? w.slice(0, -1).join(", ") + " and " + w[w.length - 1] + " nm" : w[0] + " nm"; }
function part3(host, api){
  var S = api.S, C = api.content, REF = C.refs, UNK = C.unknowns, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  function ref(id){ return REF.filter(function(r){ return r.id === id; })[0]; }
  function linesOf(ids){ var out = []; REF.forEach(function(r){ if (ids.indexOf(r.id) >= 0) r.lines.forEach(function(wl){ out.push({ wl:wl, pair:!!r.pair }); }); }); return out.sort(function(a, b){ return a.wl - b.wl; }); }
  function uLines(u){ return linesOf(MV.ans(u) || []); }
  S.tags = S.tags && typeof S.tags === "object" ? S.tags : {};
  UNK.forEach(function(u){ S.tags[u.id] = (Array.isArray(S.tags[u.id]) ? S.tags[u.id] : []).filter(function(id){ return !!ref(id); }); });
  S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {}; if (["", "Na", "He"].indexOf(S.s2.cmp) < 0) S.s2.cmp = ""; S.s2.why = typeof S.s2.why === "string" ? S.s2.why : "";
  if (["H", "He"].indexOf(S.s3) < 0) S.s3 = "H";
  var sel = null, msg = "", drag = null, ghost = null, noClick = false;

  host.innerHTML =
    '<div class="part bm-st"><h3>' + s1.title + "</h3><p>" + s1.intro + "</p>" +
      '<h4 class="bm-h4">Unknown spectra</h4><div class="bm-unks" role="group" aria-label="Unknown spectra"></div><p class="bm-msg" aria-live="polite"></p>' +
      '<h4 class="bm-h4">Reference spectra: main visible lines (nm)</h4><div class="bm-refs"></div>' +
      '<details class="alg bm-data"><summary>Check it with data</summary><p class="tiny muted">Dashed ▼ marks show the reference lines of the elements you tagged, laid over each unknown.</p><div class="bm-ov"></div></details>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-s1="check" data-k="s1chk">Check</button><button type="button" class="btn ghost sm" data-s1="clear" data-k="s1clr">Clear tags</button></div><div class="bm-s1fb"></div></div>' +
    '<div class="part bm-st"><h3>' + s2.title + "</h3>" + s2.html +
      '<p class="bm-sl"><strong>Light from the Sun, 1868</strong> <span class="tiny muted">(zoomed in: 580 to 596 nm)</span></p><svg class="bm-hs" id="bm-sun" viewBox="0 0 360 56" role="img" aria-label=""></svg><div class="bm-cmp"></div><dl class="read bm-s2read" aria-live="polite"></dl>' +
      '<div class="jq"><label for="bm-why">' + s2.prompt + '</label><textarea id="bm-why" data-bmwhy="1" placeholder="Use the words energy gap, photon and line."></textarea><div class="saved" id="bm-why-saved" aria-live="polite"></div></div></div>' +
    '<div class="part bm-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="bm-s3el"></div>' +
      '<p class="bm-sl"><strong>Predicted by Bohr’s one-electron ladder</strong> <span class="tiny muted">(the same ladder as hydrogen: Eₙ = −13.6/n² eV)</span></p><svg class="bm-hs" id="bm-pred" viewBox="0 0 360 56" role="img" aria-label=""></svg>' +
      '<p class="bm-sl"><strong>Observed</strong> <span class="tiny muted">(▼ marks the predicted lines)</span></p><svg class="bm-hs" id="bm-obs" viewBox="0 0 360 56" role="img" aria-label=""></svg><dl class="read bm-s3read" aria-live="polite"></dl><p class="bm-s3cap"></p></div>';
  var unks = $(".bm-unks", host), refs = $(".bm-refs", host), ov = $(".bm-ov", host), fb = $(".bm-s1fb", host), msgEl = $(".bm-msg", host);

  // ----- station 1 -----
  function tagT(id){ var t = S.tags[id]; return t.length ? t.join(" + ") : ""; }
  function paintS1(){
    MV.keepFocus(unks, function(){
      unks.innerHTML = UNK.map(function(u){
        var L = uLines(u), tg = tagT(u.id);
        return '<button type="button" class="bm-uk" data-uk="' + u.id + '" data-k="uk' + u.id + '" aria-pressed="' + (sel === u.id) + '" aria-label="Unknown ' + u.id + ": lines at " + esc(lineList(L)) + ". " + (tg ? "Tagged " + tg : "Not tagged yet") + '.">' +
          '<span class="bm-ukh"><strong>Unknown ' + u.id + '</strong><span class="bm-ukt">' + (tg ? "→ " + tg : "not tagged") + '</span></span><svg class="bm-hs" viewBox="0 0 360 56" aria-hidden="true">' + hStrip(L) + "</svg></button>";
      }).join("");
    });
    MV.keepFocus(refs, function(){
      refs.innerHTML = REF.map(function(r){
        var placed = UNK.filter(function(u){ return S.tags[u.id].indexOf(r.id) >= 0; }).map(function(u){ return u.id; });
        return '<div class="bm-ref" data-el="' + r.id + '"><button type="button" class="bm-refb" data-el="' + r.id + '" data-k="el' + r.id + '"><span><strong>' + r.name + "</strong> (" + r.sym + ')</span><span class="bm-refp">' + (placed.length ? "tagged: " + placed.map(function(x){ return "Unknown " + x; }).join(", ") : sel ? "tap to tag Unknown " + sel : "") + "</span></button>" +
          '<svg class="bm-hs" viewBox="0 0 360 56" role="img" aria-label="' + esc(r.name + "’s main visible lines: " + lineList(r.lines.map(function(wl){ return { wl:wl, pair:!!r.pair }; }))) + '.">' + hStrip(r.lines.map(function(wl){ return { wl:wl, pair:!!r.pair }; })) + "</svg></div>";
      }).join("");
    });
    msgEl.innerHTML = msg;
    ov.innerHTML = UNK.map(function(u){
      var L = uLines(u), tg = S.tags[u.id], R = linesOf(tg), near = function(a, b){ return Math.abs(a - b) < 0.6; };
      var expl = L.filter(function(x){ return R.some(function(y){ return near(x.wl, y.wl); }); }).length, miss = R.filter(function(y){ return !L.some(function(x){ return near(x.wl, y.wl); }); });
      var txt = !tg.length ? "Not tagged yet." : "Tagged " + tg.join(" + ") + ". Lines explained: " + expl + " of " + L.length + ". Reference lines missing from the unknown: " + (miss.length ? miss.map(function(y){ return y.wl; }).join(", ") + " nm" : "none") + "." + (expl === L.length && !miss.length ? " <strong>Every line matches.</strong>" : "");
      return '<div class="bm-ovi"><p class="bm-sl"><strong>Unknown ' + u.id + "</strong></p>" + '<svg class="bm-hs" viewBox="0 0 360 56" role="img" aria-label="' + esc("Unknown " + u.id + ": lines at " + lineList(L) + (R.length ? "; reference lines laid over it at " + lineList(R) : "")) + '.">' + hStrip(L, { over:R }) + '</svg><p class="tiny">' + txt + "</p></div>";
    }).join("");
    var r = S.res;
    fb.innerHTML = !r ? "" : r.ok ? MV.fbHTML("good", "<strong>✓ All three match.</strong> " + s1.fb.ok) : MV.fbHTML(r.soft ? "" : "bad", (r.soft ? "" : "<strong>✗ Not quite.</strong> ") + r.msg);
  }
  function toggleTag(u, el, addOnly){
    var t = S.tags[u], i = t.indexOf(el);
    if (i >= 0 && !addOnly) { t.splice(i, 1); msg = "Removed " + ref(el).name + " from Unknown " + u + "."; }
    else if (i < 0) { t.push(el); t.sort(function(a, b){ return REF.indexOf(ref(a)) - REF.indexOf(ref(b)); }); msg = "Unknown " + u + " tagged: " + t.join(" + ") + ". Tap another element to add it, or the same one to remove it."; }
    S.res = null; api.save(); paintS1();
  }
  host.addEventListener("click", function(e){
    if (noClick) { noClick = false; return; }
    var b = e.target.closest("button"); if (!b || !host.contains(b)) return;
    if (b.dataset.uk) { sel = sel === b.dataset.uk ? null : b.dataset.uk; msg = sel ? "Unknown " + sel + " selected. Now tap the element it matches (two elements for a mixture)." : ""; paintS1(); return; }
    if (b.dataset.el && b.classList.contains("bm-refb")) {
      if (!sel) { msg = "Tap an unknown spectrum first, then tap an element."; paintS1(); return; }
      toggleTag(sel, b.dataset.el); return;
    }
    if (b.dataset.s1 === "clear") { UNK.forEach(function(u){ S.tags[u.id] = []; }); S.res = null; sel = null; msg = ""; api.save(); paintS1(); return; }
    if (b.dataset.s1 === "check") {
      var T = S.tags, same = function(a, b2){ return a.length === b2.length && a.every(function(x){ return b2.indexOf(x) >= 0; }); };
      if (UNK.some(function(u){ return !T[u.id].length; })) S.res = { ok:false, soft:true, msg:s1.fb.empty };
      else if (UNK.every(function(u){ return same(T[u.id], MV.ans(u)); })) S.res = { ok:true };
      else {
        var mix = UNK.filter(function(u){ return MV.ans(u).length > 1; })[0], he = UNK.filter(function(u){ return same(MV.ans(u), ["He"]); })[0], m = s1.fb.part;
        if (mix && same(T[mix.id], ["H"])) m = s1.fb.cH;
        else if (mix && same(T[mix.id], ["Na"])) m = s1.fb.cNa;
        else if (he && T[he.id].indexOf("Na") >= 0) m = s1.fb.aNa;
        S.res = { ok:false, msg:m };
      }
      api.save(); paintS1(); MV.focusFb(fb);
    }
  });
  // pointer drag (no HTML5 drag-and-drop): drag an unknown onto a reference card to tag it
  unks.addEventListener("pointerdown", function(e){ var b = e.target.closest(".bm-uk"); if (!b || e.button > 0) return; drag = { id:b.dataset.uk, x:e.clientX, y:e.clientY, on:false, pid:e.pointerId, el:b }; });
  function overRef(x, y){ var el = document.elementFromPoint(x, y), t = el && el.closest(".bm-ref"); return t && refs.contains(t) ? t : null; }
  document.addEventListener("pointermove", function(e){
    if (!drag || e.pointerId !== drag.pid) return;
    if (!drag.on && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 10) {
      drag.on = true; ghost = document.createElement("div"); ghost.className = "bm-ghost"; ghost.textContent = "Unknown " + drag.id; document.body.appendChild(ghost);
      try { drag.el.setPointerCapture(e.pointerId); } catch (err) {}
    }
    if (drag.on) { e.preventDefault(); ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px"; var t = overRef(e.clientX, e.clientY); $$(".bm-ref", refs).forEach(function(x){ x.classList.toggle("over", x === t); }); }
  });
  function endDrag(e, drop){
    if (!drag) return; var d = drag; drag = null;
    $$(".bm-ref.over", refs).forEach(function(t){ t.classList.remove("over"); });
    if (!d.on) return;
    if (ghost) { ghost.remove(); ghost = null; }
    noClick = true; setTimeout(function(){ noClick = false; }, 60);
    var t = drop && overRef(e.clientX, e.clientY);
    if (t) { sel = d.id; toggleTag(d.id, t.dataset.el, true); } else { msg = "Drop it on a reference spectrum."; paintS1(); }
  }
  document.addEventListener("pointerup", function(e){ if (drag && e.pointerId === drag.pid) endDrag(e, true); });
  document.addEventListener("pointercancel", function(e){ if (drag && e.pointerId === drag.pid) endDrag(e, false); });
  paintS1();

  // ----- station 2: the Sun's 588 nm line -----
  var SUN = [{ wl:588 }];
  var rgCmp = radios($(".bm-cmp", host), { label:"Compare with", cls:"chips", aria:"Compare the Sun’s line with a reference", options:[{ id:"", t:"nothing" }, { id:"Na", t:"sodium" }, { id:"He", t:"helium (found on Earth later)" }], value:S.s2.cmp,
    onChange:function(v){ S.s2.cmp = v; api.save(); paintS2(); } });
  void rgCmp;
  function paintS2(){
    var c = S.s2.cmp, over = c === "Na" ? [{ wl:589, pair:true }] : c === "He" ? [{ wl:588 }] : [];
    var sv = $("#bm-sun"); sv.innerHTML = hStrip(SUN, { z:ZOOM, over:over });
    sv.setAttribute("aria-label", "Light from the Sun, zoomed in from 580 to 596 nm: one yellow line at 588 nm." + (c === "Na" ? " Sodium’s pair at 589.0 and 589.6 nm is marked: both miss it." : c === "He" ? " Helium’s line at 588 nm is marked: it matches." : ""));
    $(".bm-s2read", host).innerHTML = MV.readoutHTML([["The Sun’s line", "588 nm, yellow"], ["Reference", c === "Na" ? "sodium: a close pair at 589.0 and 589.6 nm" : c === "He" ? "helium: 588 nm" : muted("choose one to compare")],
      ["Match?", c === "Na" ? "No: close, but not the same wavelengths. In 1868 no known element matched." : c === "He" ? "<strong>Yes</strong>: the same wavelength, so the same element" : muted("—")]]);
  }
  var why = $("#bm-why"), timer = null; why.value = S.s2.why;
  why.addEventListener("input", function(){ S.s2.why = why.value; clearTimeout(timer); timer = setTimeout(function(){ api.save(); $("#bm-why-saved").textContent = "Saved"; }, 400); });
  paintS2();

  // ----- station 3: where Bohr fails -----
  var PRED = [410, 434, 486, 656].map(function(wl){ return { wl:wl }; });
  radios($(".bm-s3el", host), { label:"Element", aria:"Element to compare", options:[{ id:"H", t:"Hydrogen (1 electron)" }, { id:"He", t:"Helium (2 electrons)" }], value:S.s3, onChange:function(v){ S.s3 = v; api.save(); paintS3(); } });
  function paintS3(){
    var e = S.s3, obs = ref(e).lines.map(function(wl){ return { wl:wl }; }), m = PRED.filter(function(p){ return obs.some(function(o){ return Math.abs(o.wl - p.wl) < 0.6; }); }).length;
    var a = $("#bm-pred"), b = $("#bm-obs");
    a.innerHTML = hStrip(PRED); a.setAttribute("aria-label", "Predicted lines: 410, 434, 486 and 656 nm.");
    b.innerHTML = hStrip(obs, { over:PRED }); b.setAttribute("aria-label", "Observed " + ref(e).name.toLowerCase() + " lines: " + lineList(obs) + ". " + m + " of 4 predicted lines match.");
    $(".bm-s3read", host).innerHTML = MV.readoutHTML([["Element", ref(e).name + (e === "H" ? " (one electron)" : " (two electrons)")], ["Observed lines", lineList(obs)], ["Predicted lines that match", m + " of 4" + (m === 4 ? " ✓" : " ✗")]]);
    $(".bm-s3cap", host).innerHTML = e === "H" ? "Bohr’s ladder predicts hydrogen’s lines exactly. Now try helium." : "<strong>" + s3.cap + "</strong>";
  }
  paintS3();
}

// ---------- Practice 2: Energy ladder calculations (number entry, choices, select-all; adapted from SCH4U 13's reasonAct) ----------
function calcAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); if (typeof x.val !== "string") x.val = ""; if (!x.picks || typeof x.picks !== "object") x.picks = {}; if (x.pick === undefined) x.pick = null; x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function chipsHTML(it, x, dis){ return '<div class="chips bm-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>"; }
  function numHTML(it, x, dis){ return '<div class="numrow"><label for="ci-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="ci-' + it.id + '" data-cin="' + it.id + '" type="text" inputmode="' + (it.keypad || "decimal") + '" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span class="bm-unit">' + (it.unit || "") + "</span></div>"; }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += numHTML(it, x, dis);
    else if (it.kind === "chips") h += chipsHTML(it, x, dis);
    else if (it.kind === "two") h += chipsHTML(it, x, dis) + numHTML(it, x, dis);
    else h += '<div class="opts" role="group" aria-label="Options (select all that apply)">' + it.options.map(function(o, k){
      var on = !!x.picks[k], c = "opt sa-opt"; if (x.solved && MV.ok(o)) c += " right";
      return '<button type="button" class="' + c + '" role="checkbox" aria-checked="' + on + '" data-pk="' + k + '" data-k="' + it.id + "p" + k + '"' + dis + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>";
    }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) {
      var why = it.kind === "chips" ? (it.options[x.pick] && it.options[x.pick].why) || "" : it.why || it.fb || "";
      h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.kind === "multi" ? it.options.filter(function(o){ return MV.ok(o); }).map(function(o){ return o.t; }).join(" and ") : it.display) + ".</strong> " + why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + MV.usesHTML(a.use) + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function one(s){ var v = MV.parseNum(String(s || "").replace(/[a-z]+/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, w, tol){ return Math.abs(v - w) <= (tol || 0) + 1e-9; }
  function judge(it, x){
    if (it.kind === "num" || it.kind === "two") {
      if (it.kind === "two") {
        if (x.pick == null) return { bad:"Choose what happens first." };
        if (!MV.ok(it.options[x.pick])) return { fb:it.options[x.pick].why || it.fb };
      }
      var v = one(x.val);
      if (v == null) return { bad:"Enter one number, such as 2.55." };
      if (near(v, MV.ans(it), it.tol)) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return near(v, z.match, 0.005); })[0];
      return { fb:w ? w.fb : it.fb };
    }
    if (it.kind === "chips") {
      if (x.pick == null) return { bad:"Choose an answer first." };
      return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
    }
    var any = Object.keys(x.picks).some(function(k){ return x.picks[k]; });
    if (!any) return { bad:"Select every photon that can be absorbed, then press Check." };
    var bad = it.options.filter(function(o, k){ return x.picks[k] && !MV.ok(o); });
    if (bad.length) return { fb:bad.map(function(o){ return o.t + ": " + o.why; }).join(" ") };
    if (it.options.some(function(o, k){ return MV.ok(o) && !x.picks[k]; })) return { fb:"Those are right, but another photon matches a gap too." };
    return { ok:true };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.cin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = host.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.pk != null) { var k = +b.dataset.pk; x.picks[k] = !x.picks[k]; msgs[it.id] = null; api.save(); paint(); return; }
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

// ---------- Performance task: Light a sign ----------
var task = (function(){
  var S = null, api = null, note = "";
  function sel(){ return (S && Array.isArray(S.sel) ? S.sel : []).filter(function(k){ return !!WL[k]; }); }
  function parse(k){ var p = k.split("-"); return { u:+p[0], l:+p[1] }; }
  function read(){ return { sel:sel().slice() }; }
  function order(list){ return list.slice().sort(function(a, b){ var A = parse(a), B = parse(b); return (B.l === 2) - (A.l === 2) || A.l - B.l || A.u - B.u; }); }
  function paint(){
    var inp = $("#bm-tin"), d = read(); if (!inp) return;
    MV.keepFocus(inp, function(){
      var h = "";
      for (var u = 2; u <= 6; u++) {
        h += '<div class="bm-trow"><span class="bm-trl">From ' + nI(u) + ':</span><span class="bm-trb">';
        for (var l = u - 1; l >= 1; l--) { var k = u + "-" + l, on = d.sel.indexOf(k) >= 0; h += '<button type="button" class="bm-tb' + (on ? " on" : "") + '" data-tk="' + k + '" data-k="tk' + k + '" aria-pressed="' + on + '" aria-label="Fall ' + u + " to " + l + '">' + trT(u, l) + "</button>"; }
        h += "</span></div>";
      }
      inp.innerHTML = h;
    });
    $("#bm-tcount").textContent = d.sel.length + " of 3 chosen";
    $("#bm-tmsg").innerHTML = note;
    var o = { strip:"em", arrows:d.sel.map(function(k){ var p = parse(k); return { u:p.u, l:p.l, w:2.6 }; }), lines:d.sel.map(function(k){ return { wl:WL[k] }; }), hiLv:{} };
    d.sel.forEach(function(k){ var p = parse(k); o.hiLv[p.u] = 1; });
    var sv = $("#bm-tsvg"); sv.innerHTML = ladderSVG(o, "bmt");
    sv.setAttribute("aria-label", "Your sign: " + (d.sel.length ? order(d.sel).map(function(k){ var p = parse(k); return trT(p.u, p.l) + " (" + lineT(WL[k]) + ")"; }).join("; ") : "no falls chosen yet") + ".");
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; S.sel = sel().slice(0, 3);
      inp.innerHTML = '<p class="bm-tl"><strong>Choose three falls.</strong> <span id="bm-tcount" aria-live="polite"></span></p><div id="bm-tin" class="bm-tin" role="group" aria-label="Electron falls"></div><p class="bm-tmsg" id="bm-tmsg" aria-live="polite"></p>';
      pv.innerHTML = '<h4 class="bm-h4">Your sign: ladder and spectrum</h4><div class="bm-box"><svg class="bm-svg" id="bm-tsvg" viewBox="0 0 450 420" role="img" aria-label=""></svg></div>';
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-tk]"); if (!b) return;
        var k = b.dataset.tk, s = sel(), i = s.indexOf(k);
        if (i >= 0) { s.splice(i, 1); note = ""; }
        else if (s.length >= 3) { note = "Three falls at most. Tap one of your falls to remove it first."; }
        else { s.push(k); note = ""; }
        S.sel = s; api.save(); paint(); api.update();
      });
      paint();
    },
    read:read,
    valid:function(d){ return d.sel.length === 3 ? true : "Choose exactly three electron falls (you have " + d.sel.length + ")."; },
    checks:function(d){
      var P = d.sel.map(parse), vis = P.filter(function(p){ return p.l === 2; }).length, uv = P.filter(function(p){ return p.l === 1; }).length;
      return [vis === 2, uv === 1, P.length > 0 && P.every(function(p){ return p.u <= 4; })];
    },
    key:function(d){ return order(d.sel).join("|"); },
    label:function(k){ return k.split("|").map(function(x){ var p = parse(x); return trT(p.u, p.l); }).join(", "); },
    text:function(k){ return MV.plain(this.label(k)); }
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
