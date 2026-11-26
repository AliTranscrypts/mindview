// SBI4U 07 Stomata Opening and Closing: hero (open-then-close storyboard), Guard cell simulator (S4 membrane simulator in a
// guard-cell layout, with a "Leaf over a day" mode), The transpiration trade-off (day graphs with running totals, the
// petroleum-jelly bench, an ABA close-up and a Prairie reading), ordering and data practice, "A leaf for a dry hillside" (task).
(function(){
"use strict";
var $ = MV.$;

// ---------- small helpers ----------
function f1(v){ return Math.round(v * 10) / 10; }
function f2(v){ return String(Math.round(v * 100) / 100); }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "sto-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function P(p){ return f1(p[0]) + " " + f1(p[1]); }
function mix(p, q, t){ return [lerp(p[0], q[0], t), lerp(p[1], q[1], t)]; }
// straight arrow with a filled head; w = stroke width; halo = a sheet-coloured underlay for legibility
function arrow(x1, y1, x2, y2, cls, w, op, halo){
  var L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, s = 4 + w * 1.2, bx = x2 - ux * s, by = y2 - uy * s;
  var hd = "M" + f1(x2) + " " + f1(y2) + " L" + f1(bx - uy * s * 0.75) + " " + f1(by + ux * s * 0.75) + " L" + f1(bx + uy * s * 0.75) + " " + f1(by - ux * s * 0.75) + " Z";
  var g = (halo ? sv("line", { x1:x1, y1:y1, x2:bx, y2:by, "class":"sto-halo", "stroke-width":w + 3 }) + sv("path", { d:hd, "class":"sto-haloh" }) : "") +
    sv("line", { x1:x1, y1:y1, x2:bx, y2:by, "stroke-width":w }) + sv("path", { d:hd });
  return '<g class="' + cls + '"' + (op != null && op < 0.99 ? ' opacity="' + f2(op) + '"' : "") + ">" + g + "</g>";
}

// ---------- @component radioGroup (copied from SBI4U 06 / 03 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list)}
function radios(host, o){
  var val = String(o.value);
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (x.dis ? -1 : tab) + '" data-rg="' + x.id + '"' + (x.dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, setOptions:function(list){ o.options = list; paint(); } };
}

// ---------- @component S4 membraneSim — guard-cell layout (course plan S4): a leaf-surface view of one stoma between two
// bean-shaped guard cells. H⁺ pumps (magenta) and K⁺ channels sit in the outer walls; K⁺ dots (ink) fill the cells as the
// pore widens; blue water arrows show net osmosis during a change; ABA dots (ink-2) arrive in dry soil; blue CO₂-in and
// water-vapour-out arrows grow with the rates. Deterministic step model (plan rules 1–10). sceneSVG(st) draws one frame;
// transF(A, B, k) blends two views, stillF(v) is a resting view. viewBox 360 × 240. ----------
var LIGHTS = [["dark", "Dark"], ["dim", "Dim"], ["bright", "Bright"]], CO2S = [["low", "Low"], ["normal", "Normal"], ["high", "High"]],
  SOILS = [["wet", "Wet"], ["mod", "Moderate"], ["dry", "Dry"]], AIRS = [["humid", "Humid"], ["normal", "Normal"], ["hot", "Hot and dry"]];
var AIRF = { humid:1, normal:2, hot:3 }, ABAW = { wet:"none", mod:"low", dry:"high" }, ABAN = { wet:0, mod:3, dry:7 }, LV = { dark:0, dim:0.5, bright:1 };
function nameOf(list, id){ for (var i = 0; i < list.length; i++) if (list[i][0] === id) return list[i][1]; return id; }
function pore(s){
  if (s.soil === "dry") return 0;
  var w = { dark:0, dim:4, bright:8 }[s.light];
  if (s.light !== "dark") { if (s.co2 === "high") w = Math.max(0, w - 4); else if (s.co2 === "low") w += 2; }
  return s.soil === "mod" ? w / 2 : w;
}
function stats(w, f, aba){ return { w:w, k:100 + 40 * w, up:w, loss:w * f, f:f, turgor:w >= 6 ? "turgid" : w >= 1 ? "partly turgid" : "limp (flaccid)", pumps:w > 0, aba:aba }; }
function model(s){ return stats(pore(s), AIRF[s.air], ABAW[s.soil]); }
function nd(w){ return Math.round((100 + 40 * w) / 60); }
var GC = { cx:180, cy:120, L:80 };
function geo(w){ var a = w * 2.3 / 0.75, T = 20 + 1.1 * w; return { a:a, b:a + T / 0.75 }; }
function bz(Q, t){ var u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t; return [a * Q[0][0] + b * Q[1][0] + c * Q[2][0] + d * Q[3][0], a * Q[0][1] + b * Q[1][1] + c * Q[2][1] + d * Q[3][1]]; }
function cellG(w, s, o){
  o = o || GC; var g = geo(w), c = o.cx, y = o.cy, L = o.L;
  return { s:s, inn:[[c, y - L], [c + s * g.a, y - 0.55 * L], [c + s * g.a, y + 0.55 * L], [c, y + L]], out:[[c, y + L], [c + s * g.b, y + L], [c + s * g.b, y - L], [c, y - L]] };
}
function seg(Q){ return " C" + P(Q[1]) + " " + P(Q[2]) + " " + P(Q[3]); }
function inPt(C, t, u){ return mix(bz(C.inn, t), bz(C.out, 1 - t), u); }
var SLOT = [0.457, 0.543, 0.286, 0.714, 0.371, 0.629, 0.2, 0.8];
// static leaf-surface background: brick-like epidermal cells, skipping the stoma
var BG = (function(){
  var h = sv("rect", { x:0, y:0, width:360, height:240, "class":"sto-epi" }), d = "";
  for (var r = 0; r < 7; r++) for (var x = -40 + (r % 2) * 38; x < 380; x += 76) {
    var y = -14 + r * 40, cx = x + 36, cy = y + 19;
    if (Math.pow((cx - GC.cx) / 112, 2) + Math.pow((cy - GC.cy) / 120, 2) < 1) continue;
    d += "M" + (x + 8) + " " + y + "h56q8 0 8 8v22q0 8-8 8h-56q-8 0-8-8v-22q0-8 8-8z";
  }
  h += sv("path", { d:d, "class":"sto-ecell" }) + sv("ellipse", { cx:GC.cx, cy:GC.cy, rx:84, ry:106, "class":"sto-ecell" });
  return h;
})();
var ABAP = [[72, 92], [298, 98], [50, 126], [320, 130], [94, 66], [292, 152], [318, 176]];
function sunSVG(l, x, y, lab){
  var h = "";
  if (l < 0.05) h += sv("path", { d:"M" + (x + 4) + " " + (y - 12) + "a12 12 0 1 0 8 19a10 10 0 1 1-8-19z", "class":"sto-moon" });
  else {
    var r = 6 + 5 * l, ray = 3 + 7 * l;
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; h += sv("line", { x1:x + Math.cos(a) * (r + 3), y1:y + Math.sin(a) * (r + 3), x2:x + Math.cos(a) * (r + 3 + ray), y2:y + Math.sin(a) * (r + 3 + ray), "class":"sto-ray" }); }
    h += sv("circle", { cx:x, cy:y, r:r, "class":"sto-sun" });
  }
  return h + (lab ? txt(x, y + 30, lab, "sto-t sto-ts", "middle") : "");
}
function lightName(l){ return l < 0.05 ? "Dark" : l < 0.75 ? "Dim light" : "Bright light"; }
function sceneSVG(st, o){
  o = o || {};
  var h = BG, cells = [cellG(st.w, -1), cellG(st.w, 1)], L = cells[0], R = cells[1], i;
  // ABA dots (drought signal)
  var na = Math.max(st.abaA, st.abaB), abaH = "";
  for (i = 0; i < na; i++) {
    var p = ABAP[i], a = 1, q = p;
    if (i >= st.abaA) { q = mix([p[0] - 70, p[1] + 90], p, MV.ease(st.ap)); a = clamp(st.ap * 3, 0, 1); }
    else if (i >= st.abaB) a = 1 - st.ap;
    if (a > 0.02) abaH += sv("circle", { cx:q[0], cy:q[1], r:4.4, "class":"sto-aba", opacity:a < 0.99 ? f2(a) : null });
  }
  if (na && st.ap > 0.3 && st.abaB) abaH += txt(30, 98, "ABA", "sto-t sto-tab", "middle");
  // guard cells, chloroplasts, pore, thick inner walls
  cells.forEach(function(C){ h += sv("path", { d:"M" + P(C.inn[0]) + seg(C.inn) + seg(C.out) + "Z", "class":"sto-gc" }); });
  cells.forEach(function(C){ [0.3, 0.42, 0.58, 0.7].forEach(function(t){ var q = inPt(C, t, 0.8); h += sv("ellipse", { cx:q[0], cy:q[1], rx:3.4, ry:2.2, "class":"sto-chl" }); }); });
  h += sv("path", { d:"M" + P(L.inn[0]) + seg(L.inn) + " C" + P(R.inn[2]) + " " + P(R.inn[1]) + " " + P(R.inn[0]) + "Z", "class":"sto-pore" });
  cells.forEach(function(C){ h += sv("path", { d:"M" + P(C.inn[0]) + seg(C.inn), "class":"sto-iw" }); });
  // pumps (outer wall, middle) and K⁺ channels (outer wall, lower half)
  var pumps = cells.map(function(C){ return bz(C.out, 0.5); }), chans = cells.map(function(C){ return bz(C.out, 0.36); });
  cells.forEach(function(C, ci){
    var c = chans[ci];
    h += sv("rect", { x:c[0] - 5, y:c[1] - 4.5, width:3, height:9, rx:1, "class":"sto-ch" }) + sv("rect", { x:c[0] + 2, y:c[1] - 4.5, width:3, height:9, rx:1, "class":"sto-ch" });
    h += sv("circle", { cx:pumps[ci][0], cy:pumps[ci][1], r:5.2, "class":"sto-pump" + (st.pumps ? " on" : "") });
  });
  // K⁺ dots: resting ones in their slots; moving ones travel through the channel
  var n0 = Math.min(st.nA, st.nB), n1 = Math.max(st.nA, st.nB), kin = st.nB > st.nA;
  cells.forEach(function(C, ci){
    var src = [chans[ci][0] + C.s * 36, chans[ci][1] + 18];
    for (var j = 0; j < n1; j++) {
      var slot = inPt(C, SLOT[j], j % 2 ? 0.52 : 0.38), pos = slot, a = 1;
      if (j >= n0) {
        var m = clamp(st.kk * 1.5 - (j - n0) * 0.18, 0, 1), u = kin ? m : 1 - m;
        pos = u < 0.5 ? mix(src, chans[ci], u * 2) : mix(chans[ci], slot, (u - 0.5) * 2);
        if (!kin) a = clamp(u * 4, 0, 1);
        else a = clamp(u * 5, 0, 1);
      }
      if (a > 0.02) h += sv("circle", { cx:pos[0], cy:pos[1], r:3.6, "class":"sto-k", opacity:a < 0.99 ? f2(a) : null });
    }
    h += txt(chans[ci][0] + C.s * 15, chans[ci][1] + 17, "K⁺", "sto-t sto-tk", "middle");
  });
  // H⁺ dots leave through the pumps
  if (st.pumps && st.hf > 0.02) cells.forEach(function(C, ci){
    var pm = pumps[ci], offs = [[14, -7], [24, 5], [34, -3]];
    offs.forEach(function(d, j){ var u = clamp(st.hp * 1.4 - j * 0.2, 0, 1); if (u <= 0) return; var q = [pm[0] + C.s * d[0] * u, pm[1] + d[1] * u]; h += sv("circle", { cx:q[0], cy:q[1], r:3, "class":"sto-h", opacity:st.hf < 0.99 ? f2(st.hf) : null }); });
    if (st.hp > 0.6) h += txt(pm[0] + C.s * 30, pm[1] - 12, "H⁺", "sto-t sto-th", "middle");
  });
  // water: net osmosis arrows during a change
  if (st.water && st.water.a > 0.02) cells.forEach(function(C){
    [0.22, 0.78].forEach(function(t, j){
      var p = bz(C.out, t), o2 = [p[0] + C.s * 26, p[1]], ii = [p[0] - C.s * 3, p[1]], s = st.water.dir > 0 ? o2 : ii, e = st.water.dir > 0 ? ii : o2;
      h += arrow(s[0], s[1], e[0], e[1], "sto-wat", 2.6, st.water.a);
      if (j === 0) h += '<g opacity="' + f2(st.water.a) + '">' + txt(o2[0] + C.s * 6, p[1] + 16, "H₂O", "sto-t sto-tw", "middle") + "</g>";
    });
  });
  h += abaH;
  // gas exchange through the pore
  if (st.w > 0.15) {
    var up = st.w, loss = st.w * st.f;
    h += arrow(100, 22, GC.cx - 3, GC.cy - 16, "sto-gas", 1.2 + 0.45 * up, 0.92, true) + txt(96, 26, "CO₂ in", "sto-t sto-tw", "end");
    h += arrow(GC.cx + 3, GC.cy + 16, 252, 212, "sto-gas", 1.2 + 0.2 * loss, 0.92, true) + txt(256, 226, "H₂O vapour out", "sto-t sto-tw");
  }
  h += sunSVG(st.light, 330, 24, o.noSunLab ? "" : st.lab);
  if (st.soil === "dry" || st.soil === "mod") h += sv("rect", { x:8, y:196, width:st.soil === "dry" ? 70 : 104, height:26, rx:6, "class":"sto-card" }) + txt(16, 214, st.soil === "dry" ? "Dry soil" : "Soil drying", "sto-t sto-tc");
  if (st.net) h += txt(GC.cx, 234, "Water: net " + st.net, "sto-t sto-tw", "middle");
  return h;
}
function viewOf(s){ var m = model(s); return { w:m.w, light:LV[s.light], aba:ABAN[s.soil], f:m.f, soil:s.soil }; }
function stillF(v, net){ return { lab:lightName(v.light), w:v.w, nA:nd(v.w), nB:nd(v.w), kk:1, pumps:v.w > 0, hp:1, hf:1, water:null, abaA:v.aba, abaB:v.aba, ap:1, light:v.light, f:v.f, soil:v.soil, net:net || null }; }
function transF(A, B, k){
  var open = B.w > A.w, close = B.w < A.w, kw = MV.ease(clamp((k - 0.45) / 0.55, 0, 1));
  return { lab:lightName(B.light), w:lerp(A.w, B.w, kw), nA:nd(A.w), nB:nd(B.w), kk:clamp((k - 0.15) / 0.45, 0, 1), pumps:B.w > 0 || A.w > 0, hp:open && A.w === 0 ? clamp(k / 0.45, 0, 1) : 1,
    hf:B.w > 0 ? 1 : 1 - clamp(k / 0.4, 0, 1), water:open || close ? { dir:open ? 1 : -1, a:clamp(Math.min((k - 0.3) / 0.08, (1 - k) / 0.08), 0, 1) } : null,
    abaA:A.aba, abaB:B.aba, ap:clamp(k / 0.3, 0, 1), light:lerp(A.light, B.light, clamp(k / 0.25, 0, 1)), f:lerp(A.f, B.f, clamp(k / 0.5, 0, 1)), soil:B.soil };
}
var LEGEND = [["--ink", "K⁺"], ["--bio-h", "H⁺ (pumped out)"], ["--ink-2", "ABA"]].map(function(x){ return '<span><svg viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="var(' + x[0] + ')"/></svg>' + x[1] + "</span>"; }).join("") +
  '<span><svg viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="3.6" fill="none" stroke="var(--bio-h)" stroke-width="1.6"/></svg>H⁺ pump</span>' +
  '<span><svg viewBox="0 0 22 10" aria-hidden="true"><path d="M1 5H16" stroke="var(--bio-o2)" stroke-width="2"/><path d="M21 5L15 1.5V8.5Z" fill="var(--bio-o2)"/></svg>water, CO₂, water vapour (labelled)</span>' +
  '<span><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M3 1Q8 5 3 9" fill="none" stroke="var(--leaf)" stroke-width="2.4"/></svg>thick inner wall</span>';

// ---------- @component dayGraph — pore width over a day (Plot): hourly points, running-total shading, an hour cursor ----------
// dayDraw(plot, {days:[{w, solid, label}], hour, shade, describe})
function dayDraw(plot, o){
  var css = MV.css, curves = [], points = [], labels = [], segs = [], bands = [];
  o.days.forEach(function(d){
    var col = d.solid ? css("--pen") : css("--ink-2");
    curves.push({ pts:d.w.map(function(v, h){ return [h, v]; }), color:col, width:d.solid ? 3 : 2.4, dash:d.solid ? null : [7, 5] });
    d.w.forEach(function(v, h){ points.push({ x:h, y:v, r:d.solid ? 3.4 : 2.8, color:col }); });
    if (d.label) labels.push({ x:d.lx, y:d.ly, text:d.label, color:css("--ink"), align:"left", font:"600 12px " + css("--font-ui"), bg:true });
  });
  if (o.shade != null) { var hs = css("--hi-soft"), mm = hs.match(/^rgba\((.+),\s*([\d.]+)\)$/); bands.push({ x0:-0.5, x1:o.shade + 0.5, color:mm ? "rgba(" + mm[1] + "," + f2(+mm[2] * 0.6) + ")" : hs }); }
  if (o.hour != null) {
    segs.push({ x1:o.hour, y1:0, x2:o.hour, y2:10.2, color:css("--ink"), width:1.5, dash:[4, 4] });
    o.days.forEach(function(d){ if (d.cursor) points.push({ x:o.hour, y:d.w[o.hour], r:6.5, color:css("--ink"), ring:true }); });
  }
  plot.draw({ view:{ xmin:-2.8, xmax:24.9, ymin:-1.7, ymax:12 }, bands:bands, curves:curves, points:points, segments:segs, labels:labels,
    xTicks:{ step:3 }, yTicks:{ step:2 }, xLabel:"hour", yLabel:"pore width (μm)", describe:o.describe });
}
function dayDescribe(days){ return days.map(function(d){ return d.t + ": pore width by hour " + d.w.map(function(v, h){ return h + " h " + v; }).filter(function(x, h){ return d.w[h] || (h && d.w[h - 1]) || (h < 24 && d.w[h + 1]); }).join(", ") + "; 0 at every other hour."; }).join(" "); }

// ---------- Explore: Guard cell simulator ----------
function explore(host, api){
  var C = api.content, S = api.S, DAYS = C.days;
  var D = { mode:"cells", light:"dark", co2:"normal", soil:"wet", air:"normal", day:"ww", hour:12 };
  Object.keys(D).forEach(function(k){ if (S[k] == null) S[k] = D[k]; });
  var anim = null, pend = null, what = "", net = null, plot = null, holdRead = false;
  host.innerHTML = '<div class="pg sto-pg">' +
    '<div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="sto-stage"><svg id="sto-svg" viewBox="0 0 360 240" role="img" focusable="false"></svg></div>' +
      '<p class="sto-legend tiny">' + LEGEND + '</p><p class="sto-cap" id="sto-cap" aria-live="polite"></p>' +
      '<div class="sto-dayg" id="sto-dayg"><canvas class="plot wide" id="sto-dplot" role="img" aria-label="Pore width over the day"></canvas><p class="sto-key tiny"><span class="sto-k1"></span>this scenario <span class="sto-k2"></span>the other scenario</p></div></div>' +
    '<div class="pg-ctrl"><div id="sto-mode"></div>' +
      '<div class="sto-panel" id="sto-cells"><div id="sto-light"></div><div id="sto-co2"></div><div id="sto-soil"></div><div id="sto-air"></div></div>' +
      '<div class="sto-panel" id="sto-daypan"><div id="sto-scen"></div><label class="slider sto-sl"><span class="slider-top"><span>Hour of the day</span><output id="sto-hout" for="sto-hour"></output></span>' +
        '<input type="range" id="sto-hour" min="0" max="24" step="1" value="' + S.hour + '"></label><p class="tiny muted sto-pnote"><span class="bio-model">Model data</span> ' + C.dayNote + "</p></div></div>" +
    '<div class="pg-read"><dl class="read" id="sto-read" aria-live="polite"></dl><div id="sto-meter"></div><p class="tiny muted sto-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var svg = $("#sto-svg"), hourIn = $("#sto-hour");
  function opts(list){ return list.map(function(x){ return { id:x[0], t:x[1] }; }); }
  var R = {
    mode:radios($("#sto-mode"), { label:"Mode", options:[{ id:"cells", t:"Guard cells" }, { id:"day", t:"Leaf over a day" }], value:S.mode, onChange:function(v){ change({ mode:v }, "Mode: " + (v === "cells" ? "Guard cells" : "Leaf over a day")); } }),
    light:radios($("#sto-light"), { label:"Light", options:opts(LIGHTS), value:S.light, onChange:function(v){ change({ light:v }, "Light: " + nameOf(LIGHTS, v)); } }),
    co2:radios($("#sto-co2"), { label:"CO₂ inside the leaf", options:opts(CO2S), value:S.co2, onChange:function(v){ change({ co2:v }, "CO₂ inside the leaf: " + nameOf(CO2S, v)); } }),
    soil:radios($("#sto-soil"), { label:"Soil water", options:opts(SOILS), value:S.soil, onChange:function(v){ change({ soil:v }, "Soil water: " + nameOf(SOILS, v)); } }),
    air:radios($("#sto-air"), { label:"Air", options:opts(AIRS), value:S.air, onChange:function(v){ change({ air:v }, "Air: " + nameOf(AIRS, v)); } }),
    day:radios($("#sto-scen"), { label:"Scenario", cls:"chips", options:DAYS.map(function(d){ return { id:d.id, t:d.t }; }), value:S.day, onChange:function(v){ change({ day:v }, byId(DAYS, v).t); } })
  };
  hourIn.addEventListener("input", function(){ change({ hour:+hourIn.value }, "Hour of the day: " + hourIn.value + " h"); });
  function day(){ return byId(DAYS, S.day); }
  function hourLight(h){ return h < 6 || h >= 20 ? 0 : h < 8 || h >= 18 ? 0.5 : 1; }
  function dayAba(h){ return S.day === "dry" ? (h >= 9 && h <= 16 ? "high" : "low") : "none"; }
  function cur(){ if (S.mode === "cells") return model(S); var w = day().w[S.hour]; return stats(w, 2, dayAba(S.hour)); }
  function curView(){ if (S.mode === "cells") return viewOf(S); var h = S.hour, w = day().w[h], a = dayAba(h); return { w:w, light:hourLight(h), aba:a === "high" ? 7 : a === "low" ? 3 : 0, f:2, soil:a === "high" ? "dry" : a === "low" ? "mod" : "wet" }; }
  function setText(){ return S.mode === "cells" ? { dark:"Darkness", dim:"Dim light", bright:"Bright light" }[S.light] + ", " + nameOf(CO2S, S.co2).toLowerCase() + " CO₂, " + nameOf(SOILS, S.soil).toLowerCase() + " soil, " + nameOf(AIRS, S.air).toLowerCase() + " air" : day().t + ", " + S.hour + " h, normal air"; }
  function aria(m){ return setText() + ". Pore " + m.w + " micrometres. K⁺ " + m.k + " millimoles per litre. Guard cells " + m.turgor + ". CO₂ uptake " + m.up + ", water loss " + m.loss + " per hour."; }
  function draw(st){ svg.innerHTML = sceneSVG(st); }
  function drawStill(){ draw(stillF(curView(), MV.reduceMotion ? net : null)); }
  function rowsOf(m){
    return [["Pore width", m.w + " μm"], ["K⁺ in guard cells", m.k + " mmol/L"], ["Guard cells", m.turgor], ["H⁺ pumps", m.pumps ? "on" : "off"], ["ABA", m.aba],
      ["CO₂ uptake", m.up + " units per hour"], ["Water loss", m.loss + " units per hour"], ["CO₂ gained per unit of water lost", m.w ? "1 per " + m.f : "none: the pore is closed"]];
  }
  function paintRead(){
    var m = cur();
    $("#sto-read").innerHTML = MV.readoutHTML(rowsOf(m));
    var cw = f1(m.up / 30 * 100), ww = f1(m.loss / 30 * 100);
    $("#sto-meter").innerHTML = '<div class="sto-meter" role="img" aria-label="' + MV.esc("Trade-off meter: CO₂ in " + m.up + " units per hour, water out " + m.loss + " units per hour") + '"><p class="sto-mt">Trade-off meter <span class="tiny muted">(units per hour, same scale)</span></p>' +
      '<div class="sto-br"><span>CO₂ in</span><span class="sto-bt"><i style="width:' + cw + '%"></i></span><b>' + m.up + "</b></div>" +
      '<div class="sto-br"><span>Water out</span><span class="sto-bt sto-bw"><i style="width:' + ww + '%"></i></span><b>' + m.loss + "</b></div></div>";
    svg.setAttribute("aria-label", aria(m));
  }
  function paintDay(){
    var on = S.mode === "day";
    $("#sto-dayg").hidden = !on;
    if (!on) return;
    if (!plot) { plot = new MV.Plot($("#sto-dplot"), { xmin:-2.8, xmax:24.9, ymin:-1.7, ymax:12 }); plot.render = renderDay; }
    renderDay();
  }
  function renderDay(){
    if (!plot || S.mode !== "day") return;
    var me = day(), other = byId(DAYS, S.day === "ww" ? "dry" : "ww");
    dayDraw(plot, { days:[{ w:other.w, solid:false }, { w:me.w, solid:true, cursor:true }], hour:S.hour,
      describe:"Pore width over the day. Solid: " + me.t + ". Dashed: " + other.t + ". Cursor at " + S.hour + " h: " + me.w[S.hour] + " μm. " + dayDescribe([me]) });
  }
  function sync(){
    R.mode.set(S.mode); R.light.set(S.light); R.co2.set(S.co2); R.soil.set(S.soil); R.air.set(S.air); R.day.set(S.day);
    hourIn.value = S.hour; var o = $("#sto-hout"); o.textContent = S.hour + " h"; hourIn.setAttribute("aria-valuetext", S.hour + " h");
    $("#sto-cells").hidden = S.mode !== "cells"; $("#sto-daypan").hidden = S.mode !== "day";
  }
  function paintCap(){ $("#sto-cap").textContent = what || (setText() + "."); }
  function paint(still){ sync(); if (!holdRead) paintRead(); paintDay(); paintCap(); if (still) drawStill(); }
  function stop(){
    if (anim) { anim(); anim = null; }
    holdRead = false;
    if (pend) { var d = pend; pend = null; d(); }
  }
  function describe(label, a, b){
    var parts = [];
    if (a.w !== b.w) parts.push("pore " + a.w + " → " + b.w + " μm", "K⁺ " + a.k + " → " + b.k + " mmol/L");
    if (a.loss !== b.loss) parts.push("water loss " + a.loss + " → " + b.loss + " per hour");
    return label + ". " + (parts.length ? parts.join("; ").replace(/^./, function(c){ return c.toUpperCase(); }) + "." : "No change to the pore or the gas exchange.");
  }
  function animate(A, B, dur, done){
    anim = MV.tween({ dur:dur, ease:lin, step:function(k){ draw(transF(A, B, k)); }, done:function(){ anim = null; drawStill(); if (done) done(); } });
  }
  function change(patch, label){
    stop();
    var A = curView(), a = cur(), modeSw = patch.mode && patch.mode !== S.mode;
    Object.keys(patch).forEach(function(k){ S[k] = patch[k]; });
    var B = curView(), b = cur();
    what = modeSw ? "" : describe(label, a, b);
    net = B.w > A.w ? "in" : B.w < A.w ? "out" : null;
    api.save(); paint(false); MV.changed();
    animate(A, B, S.mode === "day" && !modeSw ? 800 : 1700, null);
  }
  paint(true);

  function chal(id){
    if (S.mode !== "cells") return { ok:false, msg:"Switch to Guard cells mode first: the challenges use its four controls." };
    var m = model(S), s = S;
    if (id === "tc1") {
      if (m.w === 8) return { ok:true };
      if (s.light === "bright" && s.co2 === "low" && s.soil === "wet") return { ok:false, msg:"Low CO₂ opens them even wider." };
      if (s.light === "bright" && s.co2 === "normal" && s.soil === "mod") return { ok:false, msg:"Some ABA halves the opening." };
      return { ok:false, msg:"The pore is " + m.w + " μm. You need exactly 8 μm." };
    }
    if (id === "tc2") {
      if (m.k === 260) return { ok:true };
      if (m.w === 8) return { ok:false, msg:"That’s 100 + 40 × 8." };
      if (m.w === 2) return { ok:false, msg:"That’s 100 + 40 × 2." };
      return { ok:false, msg:"K⁺ is " + m.k + " mmol/L: 100 + 40 × " + m.w + ". You need 260 mmol/L." };
    }
    if (id === "tc3") {
      if (s.air !== "normal") return { ok:false, msg:"The greenhouse keeps the air Normal. Set Air to Normal first." };
      if (m.w === 5) return { ok:true };
      if (m.loss === 12) return { ok:false, msg:"12 isn’t below 12." };
      if (m.loss > 12) return { ok:false, msg:"Too much water lost: " + m.loss + " units per hour." };
      if (m.w === 0) return { ok:false, msg:"The pore is closed, so no CO₂ gets in at all." };
      return { ok:false, msg:"That works, but you can do better: 5 μm is possible." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop();
        S.mode = "cells"; Object.keys(p.start).forEach(function(k){ S[k] = p.start[k]; });
        net = null; what = "Start: " + setText() + ".";
        api.save(); paint(true); MV.changed();
      },
      run:function(p, done){
        var A = curView(), a = cur(), lab = [];
        Object.keys(p.to).forEach(function(k){ S[k] = p.to[k]; lab.push({ light:"Light", co2:"CO₂", soil:"Soil", air:"Air" }[k] + " → " + nameOf({ light:LIGHTS, co2:CO2S, soil:SOILS, air:AIRS }[k], p.to[k])); });
        var B = curView(), b = cur();
        what = describe(lab.join(", "), a, b);
        net = B.w > A.w ? "in" : B.w < A.w ? "out" : null;
        holdRead = true; api.save(); paint(false); MV.changed();
        pend = done;
        animate(A, B, 2800, function(){ holdRead = false; paintRead(); var d = pend; pend = null; if (d) MV.wait(250, d); });
      }
    },
    challenge:chal
  };
}

// ---------- hero: closed → light opens the stoma (pumps, K⁺, water, swelling, gases) → dry soil and ABA close it ----------
function hero(f){
  var box = $("#sto-hero"); if (!box) return;
  var cap = f && f.cap;
  var S0 = { w:0, light:0, aba:0, f:2, soil:"wet" }, S1 = { w:8, light:1, aba:0, f:2, soil:"wet" }, S2 = { w:0, light:1, aba:7, f:2, soil:"dry" };
  function setCap(t){ if (cap && cap.textContent !== t) cap.textContent = t; }
  if (MV.reduceMotion) {
    box.classList.add("sto-hero2");
    box.innerHTML = '<figure><svg viewBox="0 0 360 240" aria-hidden="true" focusable="false">' + sceneSVG(stillF(S1), { noSunLab:true }) + "</svg><figcaption>Open: bright light, wet soil</figcaption></figure>" +
      '<figure><svg viewBox="0 0 360 240" aria-hidden="true" focusable="false">' + sceneSVG(stillF(S2), { noSunLab:true }) + "</svg><figcaption>Closed: dry soil, ABA</figcaption></figure>";
    setCap("K⁺ in → water in → pore opens. In a drought, ABA sends K⁺ and water out, and the pore closes.");
    return;
  }
  box.innerHTML = '<svg viewBox="0 0 360 240" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var steps = [
    { dur:900, cap:"Night: the guard cells are limp and the stoma is closed.", f:function(){ return stillF(S0); } },
    { dur:3400, cap:"Light: H⁺ is pumped out, K⁺ flows in, water follows, and the guard cells swell and bow apart.", f:function(k){ return transF(S0, S1, k); } },
    { dur:2400, cap:"Open: CO₂ diffuses in, and water vapour escapes.", f:function(){ return stillF(S1); } },
    { dur:3400, cap:"Dry soil: ABA arrives, K⁺ and water leave, and the pore closes, even in bright light.", f:function(k){ return transF(S1, S2, k); } },
    { dur:10, cap:"Dry soil: ABA arrives, K⁺ and water leave, and the pore closes, even in bright light.", f:function(){ return stillF(S2); } }
  ];
  var i = 0;
  (function next(){
    if (i >= steps.length) return;
    var s = steps[i++]; setCap(s.cap);
    MV.tween({ dur:s.dur, ease:lin, step:function(k){ svg.innerHTML = sceneSVG(s.f(k)); }, done:next });
  })();
}

// ---------- Part 3: the transpiration trade-off ----------
// @component S7 experimentBench (petroleum jelly) — four leaves hang from a rod; each shows its coated surfaces as a
// jelly layer on a leaf slice; a 24 h run grows each mass-lost bar. benchSVG(leaves, t) with t = 0…1 (fraction of 24 h).
function benchSVG(leaves, t){
  var h = sv("line", { x1:8, y1:12, x2:352, y2:12, "class":"sto-rod" });
  leaves.forEach(function(l, i){
    var x = 48 + i * 88, y0 = 48;
    h += sv("line", { x1:x, y1:12, x2:x, y2:y0 - 12, "class":"sto-str" }) + sv("rect", { x:x - 4, y:y0 - 14, width:8, height:6, rx:1, "class":"sto-clip" });
    if (l.up) h += sv("rect", { x:x - 36, y:y0 - 7, width:72, height:7, rx:3, "class":"sto-jelly" });
    if (l.low) h += sv("rect", { x:x - 36, y:y0 + 24, width:72, height:7, rx:3, "class":"sto-jelly" });
    h += sv("rect", { x:x - 34, y:y0, width:68, height:24, rx:4, "class":"sto-slice" }) + sv("line", { x1:x - 34, y1:y0 + 7, x2:x + 34, y2:y0 + 7, "class":"sto-sl1" }) + sv("line", { x1:x - 34, y1:y0 + 17, x2:x + 34, y2:y0 + 17, "class":"sto-sl1" });
    h += txt(x, y0 + 50, "Leaf " + l.id, "sto-t sto-tb", "middle") + txt(x, y0 + 64, l.coat === "none" ? "no jelly" : l.coat, "sto-t sto-ts", "middle");
    var bh = 48 * l.loss / 1.2 * t;
    h += sv("rect", { x:x - 13, y:f1(188 - bh), width:26, height:f1(bh), "class":"sto-bar" }) + sv("line", { x1:x - 22, y1:188, x2:x + 22, y2:188, "class":"sto-base" });
    h += txt(x, f1(182 - bh), t > 0 ? MV.num(Math.round(l.loss * t * 10) / 10, 1) + " g" : "? g", "sto-t sto-tb", "middle");
  });
  return h + txt(352, 202, "bars: mass lost", "sto-t sto-ts", "end") + sv("rect", { x:8, y:195, width:12, height:7, rx:2, "class":"sto-jelly" }) + txt(24, 202, "petroleum jelly", "sto-t sto-ts");
}
// @component guardCellZoom — "Zoom to the molecules": the guard-cell membrane with an ABA receptor, a K⁺ channel and a water
// channel; steps 0–4 (resting, ABA arrives, ABA binds, K⁺ leaves, water follows); a mini stoma closes in the corner.
var ZK = [[150, 152], [176, 142], [204, 160], [232, 146], [126, 172], [258, 164], [190, 176], [222, 180]];
var ZKO = [[176, 30], [206, 18], [232, 40], [154, 48], [262, 24], [204, 50], [130, 26], [240, 58]];
function zoomSVG(i, k){
  var h = sv("rect", { x:0, y:0, width:360, height:72, "class":"sto-zout" }) + sv("rect", { x:0, y:98, width:360, height:96, "class":"sto-zin" }) + sv("rect", { x:0, y:72, width:360, height:26, "class":"sto-zmem" });
  h += sv("line", { x1:0, y1:72, x2:360, y2:72, "class":"sto-zedge" }) + sv("line", { x1:0, y1:98, x2:360, y2:98, "class":"sto-zedge" });
  h += txt(8, 14, "Outside the guard cell", "sto-t sto-ts") + txt(8, 190, "Inside the guard cell", "sto-t sto-ts");
  // receptor (cup), K⁺ channel (two halves), water channel
  var bound = i >= 2 || (i === 1 && k >= 1);
  h += sv("path", { d:"M56 72 V92 H96 V72 H88 V84 H64 V72 Z", "class":"sto-rec" + (i >= 2 ? " on" : "") }) + txt(70, 120, "ABA receptor", "sto-t sto-ts", "middle");
  var open = i >= 3 ? (i === 3 ? clamp(k * 3, 0, 1) : 1) : 0, gap = 2 + 8 * open;
  h += sv("rect", { x:190 - gap - 10, y:70, width:10, height:30, rx:3, "class":"sto-kch" }) + sv("rect", { x:190 + gap, y:70, width:10, height:30, rx:3, "class":"sto-kch" }) + txt(190, 126, "K⁺ channel" + (open > 0.5 ? " (open)" : " (shut)"), "sto-t sto-ts", "middle");
  h += sv("rect", { x:288, y:70, width:8, height:30, rx:3, "class":"sto-wch" }) + sv("rect", { x:304, y:70, width:8, height:30, rx:3, "class":"sto-wch" }) + txt(292, 116, "water channel", "sto-t sto-ts", "middle");
  if (i >= 2) h += '<g opacity="' + (i === 2 ? f2(clamp(k * 2, 0, 1)) : 1) + '">' + sv("path", { d:"M98 96 Q140 110 176 100", "class":"sto-sig" }) + sv("path", { d:"M178 99 l-8 -3 l2 8 z", "class":"sto-sigh" }) + "</g>";
  // ABA
  if (i >= 1) { var q = i === 1 ? mix([12, 22], [76, 78], MV.ease(k)) : [76, 78]; h += sv("circle", { cx:q[0], cy:q[1], r:6, "class":"sto-aba" }) + txt(q[0] + (i === 1 && k < 0.7 ? 0 : 20), q[1] - (i === 1 && k < 0.7 ? 10 : 2), "ABA", "sto-t sto-tab", "middle"); }
  // K⁺: inside, then out through the channel
  ZK.forEach(function(p, j){
    var pos = p;
    if (i >= 4) pos = ZKO[j];
    else if (i === 3) { var u = clamp(k * 1.6 - j * 0.08, 0, 1); pos = u < 0.5 ? mix(p, [190, 100], u * 2) : mix([190, 70], ZKO[j], (u - 0.5) * 2); }
    h += sv("circle", { cx:pos[0], cy:pos[1], r:4.4, "class":"sto-k" });
  });
  h += txt(i >= 3 ? 112 : 106, i >= 3 ? 46 : 160, "K⁺", "sto-t sto-tk", "middle");
  // water follows
  if (i >= 4) { var wa = i === 4 ? clamp(k * 2, 0, 1) : 1; [-1, 0, 1].forEach(function(j){ h += arrow(300 + j * 9, 106, 300 + j * 9, 36, "sto-wat", 2.2, wa); }); h += '<g opacity="' + f2(wa) + '">' + txt(318, 30, "H₂O", "sto-t sto-tw") + "</g>"; }
  // mini stoma (top right corner): open until water leaves
  var mw = i < 4 ? 8 : lerp(8, 0, MV.ease(clamp((k - 0.3) / 0.7, 0, 1))), o = { cx:334, cy:156, L:24 }, g = geo(mw);
  var sc = 0.3, cL = cellG(mw, -1, o), cR = cellG(mw, 1, o);
  [cL, cR].forEach(function(C){ C.inn = C.inn.map(function(p){ return [o.cx + (p[0] - o.cx) * sc, p[1]]; }); C.out = C.out.map(function(p){ return [o.cx + (p[0] - o.cx) * sc, p[1]]; }); h += sv("path", { d:"M" + P(C.inn[0]) + seg(C.inn) + seg(C.out) + "Z", "class":"sto-gc" }); });
  h += sv("path", { d:"M" + P(cL.inn[0]) + seg(cL.inn) + " C" + P(cR.inn[2]) + " " + P(cR.inn[1]) + " " + P(cR.inn[0]) + "Z", "class":"sto-pore" });
  return h + txt(356, 192, g.a > 1 ? "stoma open" : "stoma closed", "sto-t sto-ts", "end");
}
function revealHTML(list, pre, S){
  return '<ul class="sto-qs">' + list.map(function(p, j){
    var id = pre + j, on = !!S.rev[id];
    return '<li><p class="sto-q">' + p.q + '</p><button type="button" class="btn ghost sm" data-rev="' + id + '" data-k="rev' + id + '" aria-expanded="' + on + '">' + (on ? "Hide the answer" : "Think, then show the answer") + "</button>" +
      '<p class="sto-a"' + (on ? "" : " hidden") + ">" + p.a + "</p></li>";
  }).join("") + "</ul>";
}
function part3(host, api){
  var C = api.content, S = api.S; S.rev = S.rev || {}; S.ran = !!S.ran;
  var DAYS = MV.C.explore.days, s1 = C.s1, s2 = C.s2, s3 = C.s3, hourNow = 0, bench = null, zi = 0, zanim = null;
  host.innerHTML = '<div class="sto-p3">' +
    '<div class="sto-st"><h3>' + s1.title + "</h3><p>" + s1.how + '</p><div class="sto-p3g"><canvas class="plot wide" id="sto-p3plot" role="img" aria-label="Pore width over two days"></canvas></div>' +
      '<p class="sto-key tiny"><span class="sto-k1"></span>Well-watered summer day <span class="sto-k2"></span>Dry spell day</p><div id="sto-p3pl"></div><div id="sto-tot" aria-live="polite"></div>' +
      '<details class="alg"><summary>' + C.panel + ": the day totals</summary>" + s1.sums.map(function(x){ return "<p>" + x + "</p>"; }).join("") + "</details>" +
      '<div id="sto-q1"></div></div>' +
    '<div class="sto-st"><h3>' + s2.title + "</h3><p>" + s2.how + '</p><div class="sto-stage sto-stage-b"><svg id="sto-bench" viewBox="0 0 360 206" role="img" focusable="false"></svg></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="sto-run" data-k="storun"></button><span class="tiny muted" id="sto-clock" aria-live="polite"></span></div>' +
      '<details class="alg" open><summary>' + C.panel + ': the results table</summary><div id="sto-btab"></div><p class="tiny muted">' + s2.m7 + '</p></details><div id="sto-q2"></div></div>' +
    '<div class="sto-st"><h3>' + s3.title + "</h3><p>" + s3.how + '</p><div class="sto-stage sto-stage-z"><svg id="sto-zoom" viewBox="0 0 360 194" role="img" focusable="false"></svg></div><p class="sto-cap" id="sto-zcap" aria-live="polite"></p><div id="sto-zpl"></div>' +
      '<div class="sto-farm"><h4>' + s3.farmTitle + "</h4>" + s3.farm + "</div></div></div>";
  // station 1: day graphs with running totals
  var plot = new MV.Plot($("#sto-p3plot", host), { xmin:-2.8, xmax:24.9, ymin:-1.7, ymax:12 });
  function sumTo(w, h){ var s = 0; for (var i = 0; i <= h; i++) s += w[i]; return s; }
  function render(){
    var ww = DAYS[0], dr = DAYS[1];
    dayDraw(plot, { days:[{ w:ww.w, solid:true, cursor:true }, { w:dr.w, solid:false, cursor:true }], hour:hourNow, shade:hourNow,
      describe:"Pore width over the day for both scenarios, counted up to " + hourNow + " h. " + dayDescribe(DAYS) });
  }
  plot.render = render;
  function paintTot(){
    var a = sumTo(DAYS[0].w, hourNow), b = sumTo(DAYS[1].w, hourNow);
    $("#sto-tot", host).innerHTML = MV.tableHTML({ caption:"Running totals", head:["Up to " + hourNow + " h", "CO₂ taken in", "Water lost"], rows:[["Well-watered day", a, 2 * a], ["Dry spell day", b, 2 * b]] });
  }
  var pl = MV.player($("#sto-p3pl", host), { count:25, interval:420, label:function(i){ return "Hour " + i + " of 24"; }, render:function(i){ hourNow = i; render(); paintTot(); } });
  $("#sto-p3pl", host).insertAdjacentHTML("afterend", '<div class="q-actions sto-jump"><button type="button" class="btn ghost sm" id="sto-end" data-k="stoend">Jump to the end of the day</button></div>');
  $("#sto-end", host).addEventListener("click", function(){ pl.go(24); });
  // station 2: the bench
  var bsvg = $("#sto-bench", host);
  function paintBench(t){
    bsvg.innerHTML = benchSVG(s2.leaves, t);
    bsvg.setAttribute("aria-label", "Four leaves hang from a rod. A: no jelly. B: jelly on the upper surface. C: jelly on the lower surface. D: jelly on both. " + (t > 0 ? "Mass lost after " + Math.round(24 * t) + " h: " + s2.leaves.map(function(l){ return l.id + " " + MV.num(Math.round(l.loss * t * 10) / 10, 1) + " g"; }).join(", ") + "." : "Not hung yet."));
    $("#sto-clock", host).textContent = t > 0 ? "Time: " + Math.round(24 * t) + " h" : "Time: 0 h";
  }
  function paintTable(){
    $("#sto-btab", host).innerHTML = MV.tableHTML({ caption:"Mass lost by each leaf in 24 h", head:["Leaf", "Coated surface", "Mass lost in 24 h"], rows:s2.leaves.map(function(l){ return [l.id, l.coat, S.ran ? MV.num(l.loss, 1) + " g" : "?"]; }) });
    $("#sto-run", host).textContent = S.ran ? "Hang them again" : "Hang the leaves for 24 h";
  }
  $("#sto-run", host).addEventListener("click", function(){
    var b = this; if (bench) { bench(); bench = null; }
    b.disabled = true;
    bench = MV.tween({ dur:2600, ease:lin, step:function(k){ paintBench(k); }, done:function(){ bench = null; S.ran = true; api.save(); paintTable(); paintBench(1); b.disabled = false; } });
  });
  paintBench(S.ran ? 1 : 0); paintTable();
  // reveal prompts
  $("#sto-q1", host).innerHTML = revealHTML(s1.prompts, "a", S); $("#sto-q2", host).innerHTML = revealHTML(s2.prompts, "b", S);
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-rev]"); if (!b) return;
    var id = b.dataset.rev; S.rev[id] = !S.rev[id]; api.save();
    b.setAttribute("aria-expanded", S.rev[id]); b.textContent = S.rev[id] ? "Hide the answer" : "Think, then show the answer";
    b.nextElementSibling.hidden = !S.rev[id];
  });
  // station 3: zoom
  var zsvg = $("#sto-zoom", host);
  function zdraw(i, k){ zsvg.innerHTML = zoomSVG(i, k); zsvg.setAttribute("aria-label", "Guard-cell membrane close-up, step " + (i + 1) + " of 5: " + MV.plain(s3.steps[i])); }
  MV.player($("#sto-zpl", host), { count:5, interval:2200, label:function(i){ return "Step " + (i + 1) + " of 5"; }, render:function(i){
    var back = i < zi; zi = i; if (zanim) { zanim(); zanim = null; }
    $("#sto-zcap", host).textContent = s3.steps[i];
    if (i === 0 || back) { zdraw(i, 1); return; }
    zanim = MV.tween({ dur:1600, ease:lin, step:function(k){ zdraw(i, k); }, done:function(){ zanim = null; zdraw(i, 1); } });
  } });
}

// ---------- Practice 1: put the steps in order (N5 ordering, copied from SBI4U 05: rule-based named wrong orders) ----------
function orderAct(host, api, a){
  var st = api.S; st.seq = st.seq || {};
  var sel = {}, msgs = {};
  function sq(s){ var x = st.seq[s.id]; if (!x) x = st.seq[s.id] = { order:(s.start || MV.shuffle(s.steps.map(function(_, i){ return i; }), MV.meta.id + s.id)).slice(), tries:0, hint:0, solved:false, first:null }; return x; }
  function isRight(ord){ return ord.every(function(v, i){ return v === i; }); }
  function ruleHit(s, ord){ var pos = {}; ord.forEach(function(v, i){ pos[v] = i; }); return (s.rules || []).filter(function(r){ return r.then.some(function(j){ return r.first.some(function(i){ return pos[j] < pos[i]; }); }); })[0]; }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.sequences.map(function(s, si){
        var x = sq(s), h = '<div class="q' + (si ? " part" : "") + '" data-seq="' + s.id + '" style="border-bottom:0"><p class="task">Sequence ' + (si + 1) + ": " + s.prompt + "</p>";
        h += '<ol class="olist">' + x.order.map(function(stepI, pos){
          var isSel = sel[s.id] === pos && !x.solved, cls = "ostep" + (x.solved ? " good" : (msgs[s.id] && msgs[s.id].pos === pos ? " bad" : ""));
          return '<li><button type="button" class="' + cls + '" aria-pressed="' + isSel + '" data-k="' + s.id + "p" + stepI + '" data-pos="' + pos + '"' + (x.solved ? " disabled" : "") + '><span class="sn">' + (pos + 1) + ".</span><span>" + s.steps[stepI] + "</span></button>" +
            (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + s.id + 'up"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="' + s.id + 'down"' + (pos === x.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
        }).join("") + "</ol>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + s.id + 'chk">Check the order</button>' + MV.hintBtn(s.id + "hint", x.hint) + "</div>" + MV.hintsHTML(s.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ That order works.</strong> ' + (s.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[s.id]) h += '<div class="fb bad" role="status"><p><strong>✗ Not yet.</strong> ' + msgs[s.id].html + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-seq]"); if (!box) return;
    var s = byId(a.sequences, box.dataset.seq), x = sq(s);
    if (b.dataset.pos != null) { var p = +b.dataset.pos; sel[s.id] = sel[s.id] === p ? null : p; paint(); return; }
    if (b.dataset.mv) {
      var i = sel[s.id], j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= x.order.length) return;
      var t = x.order[i]; x.order[i] = x.order[j]; x.order[j] = t; sel[s.id] = j; msgs[s.id] = null; api.save(); paint();
      var nb = host.querySelector('[data-seq="' + s.id + '"] [data-mv="' + b.dataset.mv + '"]'); if (nb && !nb.disabled) nb.focus(); else { var sb = host.querySelector('[data-seq="' + s.id + '"] [data-pos="' + j + '"]'); if (sb) sb.focus(); }
      return;
    }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      if (isRight(x.order)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[s.id] = null; sel[s.id] = null; }
      else {
        x.tries++;
        var rule = ruleHit(s, x.order), pos = 0; while (pos < x.order.length && x.order[pos] === pos) pos++;
        msgs[s.id] = { pos:pos, html:rule ? rule.fb + " Step " + (pos + 1) + " is out of place." : "Step " + (pos + 1) + " is out of place. Ask what has to happen before it can be done." };
      }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-seq="' + s.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.sequences.forEach(function(s){ var x = sq(s); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.sequences.length, done:d, line:a.summary + " (first try): " + f + "/" + a.sequences.length + (d < a.sequences.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.sequences.forEach(function(s){ var x = sq(s); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(s.goal != null ? s.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: data and design (N4 number entry and chips; adapted from SBI4U 05 accounting / 04 puzzles) ----------
function dataAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function parseVal(raw){ var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Zμ²].*$/, "").replace(/\s/g, "").replace(/,/g, "."); var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, t){ return Math.abs(v - t) <= 1e-6 * Math.max(1, Math.abs(t)); }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
    else {
      h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
      h += '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? '<span class="sto-unit">' + it.unit + "</span>" : "") + "</div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = byId(a.items, box.dataset.li), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (it.kind === "mc" && b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.act === "check") {
      var ok;
      if (it.kind === "mc") { if (x.choice == null) return; x.checked = true; ok = MV.ok(it.options[x.choice]); }
      else {
        var v = parseVal(x.val);
        if (v == null) { msgs[it.id] = "Enter a number, such as 12 or 0.5."; paintItem(it); return; }
        ok = near(v, MV.ans(it));
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return near(v, w.match); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general) + " Try again."; }
        else msgs[it.id] = null;
      }
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else return;
    api.save(); paintItem(it); if (b.dataset.act === "check") MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: A leaf for a dry hillside (chips; live leaf cross-section and score meters) ----------
// leaf slice adapted from SBI4U 01 miniLeafSVG: stomata on the chosen surfaces, cuticle thickness, sunken crypts with hairs
function hillLeafSVG(d){
  var h = "", X0 = 8, X1 = 212, y0 = 30, y1 = 86, ep = 6, cw = d.cut === "thick" ? 5 : 1.4, x, i;
  h += sv("rect", { x:X0, y:y0, width:X1 - X0, height:y1 - y0, "class":"sto-lair" });
  for (x = X0; x < X1 - 1; x += 7) h += sv("rect", { x:x + .5, y:y0 + ep + .5, width:6, height:20, rx:2.4, "class":"sto-ltis" });
  for (i = 0; i < 2; i++) for (x = X0 + 6 + i * 6; x < X1 - 4; x += 12) { if (Math.abs(x - 110) < 13) continue; h += sv("ellipse", { cx:x, cy:y0 + ep + 28 + i * 9, rx:5, ry:4, "class":"sto-ltis" }); }
  h += sv("circle", { cx:110, cy:y0 + ep + 32, r:9, "class":"sto-lvein" });
  for (x = X0; x < X1 - 1; x += 9) h += sv("rect", { x:x + .4, y:y0 + .4, width:8.2, height:ep - .8, rx:1.5, "class":"sto-lepi" }) + sv("rect", { x:x + .4, y:y1 - ep + .4, width:8.2, height:ep - .8, rx:1.5, "class":"sto-lepi" });
  h += sv("rect", { x:X0, y:y0 - cw, width:X1 - X0, height:cw, "class":"sto-lcut" }) + sv("rect", { x:X0, y:y1, width:X1 - X0, height:cw, "class":"sto-lcut" });
  var n = { low:2, med:3, high:5 }[d.dens], pits = d.pits === "yes";
  function stomata(top){
    var s = "";
    for (var k = 0; k < n; k++) {
      var sx = X0 + (k + 0.5) * (X1 - X0) / n + (n === 2 ? 0 : 7), dir = top ? -1 : 1, sy = top ? y0 : y1, pit = pits ? 9 : 0;
      if (Math.abs(sx - 110) < 14) sx += 18;
      var edge = sy + dir * (cw + 0.5), gy = sy - dir * (ep / 2 + pit), inner = gy - dir * 3.5;
      if (pit) s += sv("rect", { x:sx - 6, y:Math.min(edge, inner), width:12, height:Math.abs(edge - inner), "class":"sto-lpit" });
      s += sv("rect", { x:sx - 1.5, y:Math.min(edge, gy) - 1, width:3, height:Math.abs(edge - gy) + 2, "class":"sto-lpit" });
      s += sv("ellipse", { cx:sx - 3.6, cy:gy, rx:2.6, ry:2.3, "class":"sto-lgc" }) + sv("ellipse", { cx:sx + 3.6, cy:gy, rx:2.6, ry:2.3, "class":"sto-lgc" });
      if (pits) for (var q = -1; q <= 1; q += 2) s += sv("path", { d:"M" + f1(sx + q * 6) + " " + f1(edge) + " q " + (-q * 1) + " " + (dir * 4) + " " + (-q * 5) + " " + (dir * 6), "class":"sto-lhair" }) + sv("path", { d:"M" + f1(sx + q * 6) + " " + f1(edge - dir * 4) + " l " + (-q * 4) + " " + (dir * 1), "class":"sto-lhair" });
    }
    return s;
  }
  if (d.place !== "lower") h += stomata(true);
  if (d.place !== "upper") h += stomata(false);
  return h + txt(X0, 16, "upper surface", "sto-t sto-ts") + txt(X0, 108, "lower surface", "sto-t sto-ts");
}
var task = (function(){
  var api = null, T = null, DEF = { dens:"med", place:"both", cut:"thin", pits:"no", time:"day" };
  function read(){ var s = api ? api.S : {}, d = {}; Object.keys(DEF).forEach(function(k){ d[k] = s[k] || DEF[k]; }); return d; }
  function sc(d){ var F = T.factors; return { loss:F.dens[d.dens] * F.place[d.place] * F.cut[d.cut] * F.pits[d.pits] * F.time[d.time], up:F.dens[d.dens] * F.uptake[d.place] }; }
  function word(id, v){ var inp = byId(T.inputs, id); for (var i = 0; i < inp.options.length; i++) if (inp.options[i][0] === v) return inp.options[i][1]; return v; }
  function desc(d){ return word("dens", d.dens) + " density, stomata on " + ({ upper:"the upper surface only", lower:"the lower surface only", both:"both surfaces" })[d.place] + ", " + d.cut + " cuticle, " + (d.pits === "yes" ? "sunken stomata with hairs" : "no sunken stomata") + ", open by " + (d.time === "day" ? "day" : "night"); }
  function meter(lab, v, max, mark, aim){ return '<div class="sto-tm"><span class="sto-tml">' + lab + " <strong>" + v + '</strong> <span class="muted">(' + aim + ')</span></span><span class="sto-tmt"><i style="width:' + f1(clamp(v / max, 0, 1) * 100) + '%"></i><b style="left:' + f1(mark / max * 100) + '%"></b></span></div>'; }
  function draw(){
    var d = read(), s = sc(d), pv = $("#sto-tpv"); if (!pv) return;
    pv.innerHTML = '<svg viewBox="0 0 290 116" role="img" aria-label="' + MV.esc("Your leaf: " + desc(d) + ". Water-loss score " + s.loss + ", CO₂-uptake score " + s.up + ".") + '">' + hillLeafSVG(d) +
      '<g transform="translate(252 46)">' + (d.time === "day" ? sunSVG(1, 0, 0, "") : sunSVG(0, 0, 0, "")) + "</g>" + txt(252, 96, d.time === "day" ? "opens by day" : "opens at night", "sto-t sto-ts", "middle") + "</svg>";
    $("#sto-tm").innerHTML = meter("Water-loss score:", s.loss, 36, 6, "aim: 6 or less") + meter("CO₂-uptake score:", s.up, 6, 2, "aim: 2 or more");
  }
  function key(d){ return [d.dens, d.place, d.cut, d.pits, d.time].join("|"); }
  function unkey(k){ var p = k.split("|"); return { dens:p[0], place:p[1], cut:p[2], pits:p[3], time:p[4] }; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      Object.keys(DEF).forEach(function(k){ if (!a.S[k]) a.S[k] = DEF[k]; });
      inp.innerHTML = '<div class="sto-tin">' + T.inputs.map(function(x){ return '<div id="sto-ti-' + x.id + '"></div>'; }).join("") + "</div>";
      T.inputs.forEach(function(x){ radios($("#sto-ti-" + x.id, inp), { label:x.label, cls:"chips", options:x.options.map(function(o){ return { id:o[0], t:o[1] }; }), value:a.S[x.id], onChange:function(v){ a.S[x.id] = v; a.save(); draw(); a.update(); } }); });
      pv.innerHTML = '<div class="sto-tpv" id="sto-tpv"></div><div id="sto-tm"></div><details class="alg"><summary>' + T.modelTitle + "</summary>" + T.model + "</details>";
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var s = sc(d); return [s.loss <= 6, s.up >= 2, d.time === "day"]; },
    key:key,
    label:function(k){ var d = unkey(k); return word("dens", d.dens) + ", " + word("place", d.place).toLowerCase() + ", " + d.cut + ", " + (d.pits === "yes" ? "sunken" : "not sunken") + ", " + d.time; },
    text:function(k){ var d = unkey(k), s = sc(d); return desc(d) + "; water loss " + s.loss + ", uptake " + s.up; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ steps:orderAct, data:dataAct },
  task:task
});
})();
