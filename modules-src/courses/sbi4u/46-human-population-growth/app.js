// SBI4U 46 Human Population Growth: hero (world population J-curve, 1700–2025, with milestone dots and shrinking gaps between
// billions), Demographic transition explorer (S10 population model, demographic mode: World timeline · Transition with a linked
// age pyramid and a momentum run · Projection with the rule of 70), "Footprints and food" (footprint builder, energy pyramid on a
// hectare, S12 claim–evidence–reasoning builder), Population and food calculations (custom N4, multi-box), "Feed the family" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (SVG helpers from SBI4U 18 / 10) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "hp-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function op(a, g){ return a >= 0.98 ? g : a <= 0.02 ? "" : '<g opacity="' + Math.round(a * 100) / 100 + '">' + g + "</g>"; }
function d1(v){ var r = Math.round(v * 10) / 10; return (r < 0 ? "−" : "") + Math.abs(r).toFixed(1); }
function nice(v){ return Math.abs(v - Math.round(v)) < 0.05 ? String(Math.round(v)) : MV.num(v, 1); }
function poly(pts){ return pts.map(function(p, i){ return (i ? "L" : "M") + f1(p[0]) + " " + f1(p[1]); }).join(" "); }
function interp(pts, x, k){ k = k || 1; if (x <= pts[0][0]) return pts[0][k]; for (var i = 1; i < pts.length; i++) if (x <= pts[i][0]) { var a = pts[i - 1], b = pts[i]; return lerp(a[k], b[k], (x - a[0]) / (b[0] - a[0])); } return pts[pts.length - 1][k]; }
// axes(o): o = {W, H, L, R, T, B, x0, x1, y0, y1, xt:[…], yt:[…], xf(v), yf(v), xl, yl} -> {X, Y, g}
function axes(o){
  var X = function(x){ return o.L + (x - o.x0) / (o.x1 - o.x0) * (o.W - o.L - o.R); }, Y = function(y){ return o.H - o.B - (y - o.y0) / (o.y1 - o.y0) * (o.H - o.T - o.B); };
  var g = "";
  (o.yt || []).forEach(function(v){ g += sv("line", { x1:o.L, y1:Y(v), x2:o.W - o.R, y2:Y(v), "class":"hp-grid" }) + txt(o.L - 6, Y(v) + 4, o.yf ? o.yf(v) : String(v), "hp-tl", "end"); });
  (o.xt || []).forEach(function(v){ g += sv("line", { x1:X(v), y1:o.H - o.B, x2:X(v), y2:o.H - o.B + 4, "class":"hp-ax" }) + txt(X(v), o.H - o.B + 17, o.xf ? o.xf(v) : String(v), "hp-tl", "middle"); });
  g += sv("line", { x1:o.L, y1:o.H - o.B, x2:o.W - o.R, y2:o.H - o.B, "class":"hp-ax" }) + sv("line", { x1:o.L, y1:o.T - 4, x2:o.L, y2:o.H - o.B, "class":"hp-ax" });
  if (o.xl) g += txt((o.L + o.W - o.R) / 2, o.H - 4, o.xl, "hp-at", "middle");
  if (o.yl) g += txt(o.L - 4, o.T - 10, o.yl, "hp-at");
  return { X:X, Y:Y, g:g };
}

// ---------- @component radioGroup (copied from SBI4U 18 / 14 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="' + (o.key || "rg") + x.id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || off) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); e.stopPropagation();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}
// @component stepper — − / + buttons around a live value (from SBI4U 18 / 14): stepper(host, {id, label, min, max, value, unit(v), onChange(v)}) -> {set(v), disable(b)}
function stepper(host, o){
  var v = o.value, off = false, nm = MV.plain(o.label);
  host.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="' + o.id + '-l">' + o.label + '</span><span class="hp-stp" role="group" aria-labelledby="' + o.id + '-l">' +
    '<button type="button" class="hp-stb" data-d="-1" data-k="' + o.id + 'm" aria-label="' + MV.esc("Decrease " + nm) + '">−</button><output id="' + o.id + '" aria-live="polite"></output>' +
    '<button type="button" class="hp-stb" data-d="1" data-k="' + o.id + 'p" aria-label="' + MV.esc("Increase " + nm) + '">+</button></span></span>';
  var out = $("#" + o.id, host);
  function paint(){ out.textContent = o.unit ? o.unit(v) : v; $$("[data-d]", host).forEach(function(b){ b.disabled = off || (+b.dataset.d < 0 ? v <= o.min : v >= o.max); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (!b || b.disabled) return; v = clamp(v + (+b.dataset.d), o.min, o.max); paint(); o.onChange(v); });
  paint();
  return { set:function(x){ v = x; paint(); }, disable:function(b){ off = b; paint(); } };
}
// range slider with output (from SBI4U 18): slider(host, {id, label, min, max, step, value, unit(v), short(v), onChange(v)}) -> {set(v), disable(b)}
function slider(host, o){
  host.innerHTML = '<label class="slider hp-sl"><span class="slider-top"><span>' + o.label + '</span><output id="' + o.id + '-out" for="' + o.id + '"></output></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host);
  function show(v){ out.textContent = o.short ? o.short(v) : o.unit(v); inp.setAttribute("aria-valuetext", o.unit(v)); }
  inp.addEventListener("input", function(){ show(+inp.value); o.onChange(+inp.value); });
  show(o.value);
  return { set:function(v){ inp.value = v; show(v); }, disable:function(b){ inp.disabled = b; } };
}

// ---------- @component S10 populationModel — demographic mode (course plan S10): world timeline, transition table with birth- and
// death-rate curves (gap shaded --hi-soft), linked age pyramid (model shapes per stage; --ink-2 bars, a followed cohort in --hi),
// momentum run (5-year cohort steps at replacement fertility) and an exact rule-of-70 projection. Deterministic. ----------
var SHAPES = {
  1:[100, 80, 64, 51, 41, 33, 26, 21, 17, 13, 11, 9, 7, 5, 4, 3, 2],
  2:[100, 84, 71, 59, 50, 42, 35, 30, 25, 21, 18, 15, 12, 10, 8, 6, 5],
  3:[88, 94, 96, 92, 86, 79, 71, 63, 55, 47, 40, 33, 26, 19, 13, 8, 6],
  4:[70, 71, 72, 72, 73, 73, 72, 72, 71, 70, 68, 65, 60, 52, 42, 30, 24],
  5:[50, 53, 57, 61, 65, 69, 72, 75, 76, 76, 74, 71, 66, 57, 46, 33, 30]
};
var PYRLAB = { 1:"Expanding: wide base", 2:"Expanding: wide base", 3:"Expanding: wide base", 4:"Stable: straight sides", 5:"Contracting: narrow base" };
// survival from one 5-year band to the next (model values); the 80+ band keeps 45% of itself each step
var SURV = [0.995, 0.995, 0.995, 0.995, 0.995, 0.995, 0.995, 0.995, 0.995, 0.995, 0.98, 0.97, 0.95, 0.92, 0.87, 0.78];
function momentumRun(start){
  var cur = start.slice(), steps = [cur];
  for (var k = 1; k <= 12; k++) {
    var n = new Array(17);
    n[0] = (cur[4] + cur[5] + cur[6]) / 3;   // replacement: each parent band (ages 20–34) replaces itself
    for (var i = 1; i < 16; i++) n[i] = cur[i - 1] * SURV[i - 1];
    n[16] = cur[15] * SURV[15] + cur[16] * 0.45;
    steps.push(n); cur = n;
  }
  return steps;
}
function total(a){ return a.reduce(function(s, v){ return s + v; }, 0); }
function mixArr(a, b, t){ return a.map(function(v, i){ return lerp(v, b[i], t); }); }
// pyramid SVG: L / R arrays (17 bands, 0–4 … 80+); o = {max, hi:[i0, i1], W, H, ages, sexes}
function pyrSVG(L, R, o){
  o = o || {}; R = R || L;
  var W = o.W || 260, H = o.H || 214, top = 8, bot = o.sexes ? 22 : 6, n = 17, bh = (H - top - bot) / n, cx = W / 2 + (o.ages ? 12 : 0), half = (W / 2 - (o.ages ? 26 : 6)), mx = o.max || 100, h = "";
  for (var i = 0; i < n; i++) {
    var y = top + (n - 1 - i) * bh, l = L[i] / mx * half, r = R[i] / mx * half, hi = o.hi && i >= o.hi[0] && i <= o.hi[1];
    h += sv("rect", { x:cx - 1 - l, y:y, width:Math.max(l, 0.5), height:bh - 1, "class":hi ? "hp-pbh" : "hp-pb" }) + sv("rect", { x:cx + 1, y:y, width:Math.max(r, 0.5), height:bh - 1, "class":hi ? "hp-pbh" : "hp-pb" });
  }
  h += sv("line", { x1:cx, y1:top, x2:cx, y2:top + n * bh, "class":"hp-pax" });
  if (o.ages) [0, 4, 8, 12, 16].forEach(function(i){ h += txt(4, top + (n - 1 - i) * bh + bh - 1, i === 16 ? "80+" : String(i * 5), "hp-tl"); });
  if (o.sexes) h += txt(cx - half / 2, H - 6, "males", "hp-tl", "middle") + txt(cx + half / 2, H - 6, "females", "hp-tl", "middle");
  return '<svg viewBox="0 0 ' + W + " " + H + '" aria-hidden="true" focusable="false">' + h + "</svg>";
}

// world timeline graph
function worldSVG(Wd, year, o){
  o = o || {};
  var A = axes({ W:560, H:300, L:44, R:16, T:30, B:40, x0:1700, x1:2100, y0:0, y1:13, xt:[1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100], yt:[0, 2, 4, 6, 8, 10, 12], xl:"year", yl:"world population (billions)" });
  var h = A.g, pts = Wd.pts, pj = Wd.proj;
  h += sv("path", { d:poly(pj.map(function(p){ return [A.X(p[0]), A.Y(p[3])]; }).concat(pj.slice().reverse().map(function(p){ return [A.X(p[0]), A.Y(p[2])]; }))) + " Z", "class":"hp-band" });
  h += sv("line", { x1:A.X(2025), y1:A.Y(13), x2:A.X(2025), y2:A.Y(0), "class":"hp-now" }) + txt(A.X(2025) + 4, A.Y(12.4), "2025", "hp-tl");
  h += sv("path", { d:poly(pts.map(function(p){ return [A.X(p[0]), A.Y(p[1])]; })), "class":"hp-pop" });
  h += sv("path", { d:poly(pj.map(function(p){ return [A.X(p[0]), A.Y(p[1])]; })), "class":"hp-pop hp-dash" });
  Wd.miles.forEach(function(m){ h += sv("circle", { cx:A.X(m[1]), cy:A.Y(m[0]), r:4, "class":"hp-mile" }); if (m[0] === 1 || m[0] === 2 || m[0] === 4 || m[0] === 8) h += txt(A.X(m[1]) - 7, A.Y(m[0]) - 2, m[0] + " bn", "hp-ml", "end"); });
  var p = popAt(Wd, year);
  h += sv("line", { x1:A.X(year), y1:A.Y(13), x2:A.X(year), y2:A.Y(0), "class":"hp-cur" }) + sv("circle", { cx:A.X(year), cy:A.Y(p), r:6, "class":"hp-curdot" });
  h += txt(clamp(A.X(year), 90, 470), A.Y(13) - 6, year + ": ≈ " + MV.num(p, 1) + " bn" + (year > 2025 ? " (projection)" : ""), "hp-cl", "middle");
  return '<svg viewBox="0 0 560 300" class="hp-gsvg" aria-hidden="true" focusable="false">' + h + "</svg>";
}
function popAt(Wd, y){ return y <= 2025 ? interp(Wd.pts, y) : interp(Wd.proj, y); }

// transition graph: o = {year, drawTo, gapTo, wide}
function transSVG(T, o){
  var A = axes({ W:560, H:290, L:40, R:14, T:44, B:40, x0:0, x1:180, y0:0, y1:45, xt:[0, 20, 40, 60, 80, 100, 120, 140, 160, 180], yt:[0, 10, 20, 30, 40], xl:"years into the transition", yl:"rate per 1000 per year" });
  var h = "", bnds = [0, 15, 65, 135, 165, 180];
  for (var s = 1; s <= 5; s++) { var x0 = A.X(bnds[s - 1]), x1 = A.X(bnds[s]); h += sv("rect", { x:x0, y:4, width:x1 - x0 - 1, height:18, rx:3, "class":"hp-stg" + (stageOf(T, o.year) === s ? " on" : "") }) + txt((x0 + x1) / 2, 17, (x1 - x0 > 60 ? "stage " : "") + s, "hp-stl", "middle"); }
  h += A.g;
  var dt = o.drawTo == null ? 180 : o.drawTo, gt = o.gapTo == null ? 180 : o.gapTo;
  // gap shading from 0 to gapTo
  if (gt > 0) {
    var up = [], dn = [];
    for (var x = 0; x <= gt + 1e-9; x += 2.5) { up.push([A.X(x), A.Y(interp(T, x, 1))]); dn.push([A.X(x), A.Y(interp(T, x, 2))]); }
    h += sv("path", { d:poly(up.concat(dn.reverse())) + " Z", "class":"hp-gap" });
  }
  function curve(k, cls){
    var all = T.map(function(r){ return [A.X(r[0]), A.Y(r[k])]; }), solid = [], x;
    for (x = 0; x <= dt + 1e-9; x += 2.5) solid.push([A.X(x), A.Y(interp(T, x, k))]);
    return sv("path", { d:poly(all), "class":cls + " hp-ghost" }) + (solid.length > 1 ? sv("path", { d:poly(solid), "class":cls }) : "");
  }
  h += curve(1, "hp-br") + curve(2, "hp-dr");
  // curve names
  h += txt(A.X(4), A.Y(40) - 8, "birth rate", "hp-cn hp-cnb") + txt(A.X(dt < 60 ? 4 : 64), A.Y(dt < 60 ? 33 : 18) + (dt < 60 ? 22 : 18), "death rate", "hp-cn hp-cnd");
  if (o.wide) {
    var xw = A.X(60);
    h += sv("line", { x1:xw, y1:A.Y(38) + 4, x2:xw, y2:A.Y(18) - 4, "class":"hp-wd" }) + sv("path", { d:"M" + (xw - 5) + " " + f1(A.Y(38) + 10) + " L" + xw + " " + f1(A.Y(38) + 3) + " L" + (xw + 5) + " " + f1(A.Y(38) + 10) + " M" + (xw - 5) + " " + f1(A.Y(18) - 10) + " L" + xw + " " + f1(A.Y(18) - 3) + " L" + (xw + 5) + " " + f1(A.Y(18) - 10), "class":"hp-wd" });
    h += txt(xw + 8, A.Y(28), "widest gap: 2.0%", "hp-cl");
  }
  var y = o.year, b = interp(T, y, 1), d = interp(T, y, 2), X = A.X(y);
  h += sv("line", { x1:X, y1:A.Y(45), x2:X, y2:A.Y(0), "class":"hp-cur" }) + sv("circle", { cx:X, cy:A.Y(b), r:5.5, "class":"hp-dotb" }) + sv("circle", { cx:X, cy:A.Y(d), r:5.5, "class":"hp-dotd" });
  return '<svg viewBox="0 0 560 290" class="hp-gsvg" aria-hidden="true" focusable="false">' + h + "</svg>";
}
function rowAt(T, y){ for (var i = 0; i < T.length; i++) if (T[i][0] === y) return T[i]; var j = clamp(Math.round(y / 10), 0, T.length - 1); return T[j]; }
function stageOf(T, y){ return rowAt(T, Math.round(y / 10) * 10)[3]; }
function niOf(r){ return (r[1] - r[2]) / 10; }
function dblText(r){ return r > 1e-9 ? "≈ " + Math.round(70 / r) + " years" : Math.abs(r) < 1e-9 ? "Not growing" : "Shrinking"; }

// projection graph: P = 20 × 2^(years × rate ÷ 70) million
function projP(rate, yrs){ return 20 * Math.pow(2, yrs * rate / 70); }
function projSVG(rate, yrs){
  var top = projP(rate, 100), ym = [100, 200, 400, 700].filter(function(v){ return v >= top * 1.02; })[0] || 700, st = ym / 5;
  var A = axes({ W:560, H:300, L:48, R:16, T:30, B:40, x0:0, x1:100, y0:0, y1:ym, xt:[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], yt:[0, st, 2 * st, 3 * st, 4 * st, 5 * st], xl:"years", yl:"population (millions)" });
  var h = A.g, dt = 70 / rate;
  [40, 80, 160, 320, 640].forEach(function(v, i){ if (v <= ym) h += sv("line", { x1:A.L || 48, y1:A.Y(v), x2:544, y2:A.Y(v), "class":"hp-dbl" }) + txt(540, A.Y(v) - 4, "×" + Math.pow(2, i + 1) + " = " + v, "hp-tl", "end"); });
  for (var k = 1; k * dt <= 100 + 1e-9; k++) h += sv("path", { d:"M" + f1(A.X(k * dt) - 5) + " " + f1(A.Y(0) - 1) + " L" + f1(A.X(k * dt)) + " " + f1(A.Y(0) - 9) + " L" + f1(A.X(k * dt) + 5) + " " + f1(A.Y(0) - 1) + " Z", "class":"hp-dtk" });
  var all = [], sol = [], x;
  for (x = 0; x <= 100; x += 1) { var pt = [A.X(x), A.Y(Math.min(projP(rate, x), ym * 1.05))]; all.push(pt); if (x <= yrs) sol.push(pt); }
  h += '<clipPath id="hp-pclip"><rect x="48" y="20" width="500" height="245"/></clipPath><g clip-path="url(#hp-pclip)">' + sv("path", { d:poly(all), "class":"hp-pop hp-ghost" }) + (sol.length > 1 ? sv("path", { d:poly(sol), "class":"hp-pop" }) : "") + "</g>";
  var p = projP(rate, yrs);
  h += sv("circle", { cx:A.X(yrs), cy:A.Y(p), r:6, "class":"hp-curdot" }) + txt(clamp(A.X(yrs), 110, 470), Math.max(A.Y(p) - 12, 18), nice(p) + " million", "hp-cl", "middle");
  h += txt(60, A.Y(ym) + 14, "▲ marks each doubling time (70 ÷ " + d1(rate) + " ≈ " + nice(dt) + " years)", "hp-tl");
  return '<svg viewBox="0 0 560 300" class="hp-gsvg" aria-hidden="true" focusable="false">' + h + "</svg>";
}

// ---------- Explore: Demographic transition explorer ----------
var EXF = null;
function explore(host, api){
  var C = api.content, S = api.S, T = C.table, Wd = C.world;
  var D = { mode:"world", wy:1950, year:0, fert:false, rate:2, yrs:40 };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  if (["world", "trans", "proj"].indexOf(S.mode) < 0) S.mode = "world";
  S.wy = clamp(Math.round(+S.wy / 10) * 10, 1700, 2100); S.year = clamp(Math.round(+S.year / 10) * 10, 0, 180);
  S.rate = clamp(Math.round(+S.rate * 2) / 2, 0.5, 3.5); S.yrs = clamp(Math.round(+S.yrs / 5) * 5, 0, 100); S.fert = !!S.fert;
  var dy = S.year, drawTo = null, gapTo = null, wide = false, trio = false, mom = null, momT = 0, momRan = false;
  var pd = SHAPES[stageOf(T, S.year)].slice(), pTarget = pd.slice(), pAnim = null, anim = null, pend = null, what = "", readSig = "";
  host.innerHTML = '<div class="pg hp-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="hp-gw" class="hp-gbox" role="img" aria-label="World population"></div>' +
    '<div id="hp-gt" class="hp-gbox" role="img" aria-label="Transition graph" hidden></div>' +
    '<div id="hp-pyrw" hidden><div class="hp-pyrrow"><figure class="hp-pyrfig"><div id="hp-pyr" role="img" aria-label="Age pyramid"></div><figcaption id="hp-pyrc" class="hp-pyrc"></figcaption></figure><div id="hp-side" class="hp-side"></div></div></div>' +
    '<div id="hp-gp" class="hp-gbox" role="img" aria-label="Projection" hidden></div>' +
    '<p class="hp-cap" id="hp-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="hp-mode"></div>' +
      '<div class="hp-panel" id="hp-cw"><div id="hp-wy"></div></div>' +
      '<div class="hp-panel" id="hp-ct"><div id="hp-yr"></div><button type="button" class="hp-switch" id="hp-fert" role="switch" aria-checked="false" data-k="hpfert"><span class="hp-swk" aria-hidden="true"></span><span>Fertility drops to replacement now</span><b class="hp-swv"></b></button>' +
        '<div class="q-actions hp-runrow" id="hp-runrow"><button type="button" class="btn primary sm" id="hp-run" data-k="hprun">Run 60 years</button></div></div>' +
      '<div class="hp-panel" id="hp-cp"><p class="tiny hp-fixed">Starting population: <b>20 million</b> (fixed)</p><div id="hp-rate"></div><div id="hp-yrs"></div></div></div>' +
    '<div class="pg-read"><dl class="read hp-read" id="hp-read" aria-live="polite"></dl><p class="tiny muted hp-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var runBtn = $("#hp-run", host), fertBtn = $("#hp-fert", host);
  var modeR = radios($("#hp-mode", host), { label:"Mode", key:"hpm", options:[{ id:"world", t:"World timeline" }, { id:"trans", t:"Transition" }, { id:"proj", t:"Projection" }], value:S.mode, onChange:function(v){ change({ mode:v }); } });
  var wyS = slider($("#hp-wy", host), { id:"hp-wys", label:"Year", min:1700, max:2100, step:10, value:S.wy, unit:function(v){ return String(v); }, onChange:function(v){ change({ wy:v }); } });
  var yrS = slider($("#hp-yr", host), { id:"hp-yrs", label:"Years into the transition", min:0, max:180, step:10, value:S.year, unit:function(v){ return v + " years"; }, short:function(v){ return String(v); }, onChange:function(v){ change({ year:v }); } });
  var rateS = slider($("#hp-rate", host), { id:"hp-rts", label:"Growth rate", min:0.5, max:3.5, step:0.5, value:S.rate, unit:function(v){ return d1(v) + "% per year"; }, short:function(v){ return d1(v) + "%"; }, onChange:function(v){ change({ rate:v }); } });
  var yrsS = slider($("#hp-yrs", host), { id:"hp-ys", label:"Years", min:0, max:100, step:5, value:S.yrs, unit:function(v){ return v + " years"; }, short:function(v){ return String(v); }, onChange:function(v){ change({ yrs:v }); } });

  function row(){ return rowAt(T, S.year); }
  // ---- pyramid (morphs to the stage's model shape) ----
  function setPyrTarget(){
    var tg = SHAPES[stageOf(T, dy)];
    if (tg.join() === pTarget.join()) return;
    var from = pd.slice(); pTarget = tg.slice();
    if (pAnim) pAnim();
    pAnim = MV.tween({ dur:350, ease:MV.ease, step:function(t){ pd = mixArr(from, pTarget, t); paintPyr(); }, done:function(){ pAnim = null; pd = pTarget.slice(); paintPyr(); } });
  }
  function momHi(t){ var k = Math.floor(t + 1e-9); return [Math.min(k, 16), Math.min(k + 2, 16)]; }
  function momAt(t){ var k = Math.floor(t), fr = t - k; return k >= 12 ? mom[12] : mixArr(mom[k], mom[k + 1], fr); }
  function momMax(){ var m = 0; mom.forEach(function(a){ a.forEach(function(v){ m = Math.max(m, v); }); }); return m; }
  function idx(t){ return Math.round(total(momAt(t)) / total(mom[0]) * 100); }
  function paintPyr(){
    if (S.mode !== "trans") return;
    var box = $("#hp-pyr", host), cap = $("#hp-pyrc", host), side = $("#hp-side", host);
    if (S.fert) {
      if (!mom) mom = momentumRun(SHAPES[stageOf(T, S.year)]);
      var a = momAt(momT);
      box.innerHTML = pyrSVG(a, a, { max:momMax(), hi:momHi(momT), ages:true, sexes:true });
      box.setAttribute("aria-label", "Age pyramid " + Math.round(momT * 5) + " years after fertility drops to replacement. The children alive at the drop are highlighted at ages " + momHi(momT)[0] * 5 + " to " + (momHi(momT)[1] * 5 + 4) + ". Population index " + idx(momT) + " (now = 100).");
      cap.innerHTML = "<b>" + Math.round(momT * 5) + " years after the drop</b> · population " + idx(momT) + " (now = 100)<br><span class=\"hp-key\"><i class=\"hp-swh\"></i> children alive at the drop</span>";
      side.innerHTML = momRan ? stillsHTML() : '<p class="tiny muted">Press <b>Run 60 years</b> to follow the population after fertility drops to replacement.</p>';
    } else if (trio) {
      box.innerHTML = pyrSVG(pd, pd, { ages:true, sexes:true });
      box.setAttribute("aria-label", "Age pyramid at year " + Math.round(dy) + ": " + PYRLAB[stageOf(T, dy)] + ".");
      cap.innerHTML = "Year " + Math.round(dy) + ": " + PYRLAB[stageOf(T, dy)];
      side.innerHTML = '<div class="hp-trio" role="img" aria-label="Three model pyramids: wide base with a narrow top; straight sides; narrow base.">' + [[SHAPES[2], "Wide base, narrow top"], [SHAPES[4], "Straight sides"], [SHAPES[5], "Narrow base"]].map(function(q){ return '<figure>' + pyrSVG(q[0], q[0], { W:120, H:96 }) + "<figcaption>" + q[1] + "</figcaption></figure>"; }).join("") + "</div>";
    } else {
      box.innerHTML = pyrSVG(pd, pd, { ages:true, sexes:true, hi:null });
      box.setAttribute("aria-label", "Age pyramid at year " + Math.round(dy) + ": " + PYRLAB[stageOf(T, dy)] + ". Males on the left, females on the right, ages 0 to 80 and over.");
      cap.innerHTML = "Year " + Math.round(dy) + ": " + PYRLAB[stageOf(T, dy)];
      side.innerHTML = '<p class="tiny muted">Model shape for stage ' + stageOf(T, dy) + ". Turn on <b>Fertility drops to replacement now</b> to see what happens next.</p>";
    }
  }
  function stillsHTML(){
    var mx = momMax();
    return '<div class="hp-trio hp-stills" role="img" aria-label="' + MV.esc("Three still pyramids: now, index 100; in 20 years, index " + idx(4) + "; in 40 years, index " + idx(8) + ". The wide base moves up and the total keeps rising.") + '">' + [[0, "now"], [4, "in 20 years"], [8, "in 40 years"]].map(function(q){ var a = momAt(q[0]); return "<figure>" + pyrSVG(a, a, { W:120, H:96, max:mx, hi:momHi(q[0]) }) + "<figcaption>" + q[1] + ": " + idx(q[0]) + "</figcaption></figure>"; }).join("") + "</div>";
  }
  // ---- painting ----
  function paintGraph(){
    var m = S.mode;
    if (m === "world") {
      var g = $("#hp-gw", host); g.innerHTML = worldSVG(Wd, S.wy);
      g.setAttribute("aria-label", "World population from 1700 to 2100: almost flat, then rising steeply after 1800, levelling off in the projection after 2025. Cursor at " + S.wy + ": about " + MV.num(popAt(Wd, S.wy), 1) + " billion.");
    } else if (m === "trans") {
      var t = $("#hp-gt", host), r = rowAt(T, Math.round(dy / 10) * 10);
      t.innerHTML = transSVG(T, { year:dy, drawTo:drawTo, gapTo:gapTo, wide:wide });
      t.setAttribute("aria-label", "Birth rate (blue) and death rate (orange) per 1000 over 180 years, with the gap between them shaded. At year " + Math.round(dy) + ": birth rate " + r[1] + ", death rate " + r[2] + ", stage " + r[3] + ".");
      paintPyr();
    } else {
      var p = $("#hp-gp", host); p.innerHTML = projSVG(S.rate, S.yrs);
      p.setAttribute("aria-label", "Projection from 20 million at " + d1(S.rate) + "% per year: " + nice(projP(S.rate, S.yrs)) + " million after " + S.yrs + " years.");
    }
  }
  function rows(){
    var R = [];
    if (S.mode === "world") {
      var y = S.wy, p = popAt(Wd, y), last = null, next = null;
      Wd.miles.forEach(function(m){ if (m[1] <= y) last = m; else if (!next) next = m; });
      R.push(["Year", String(y)]);
      R.push(["World population", "≈ " + MV.num(p, 1) + " billion" + (y > 2025 ? " (projection; likely range " + MV.num(interp(Wd.proj, y, 2), 1) + "–" + MV.num(interp(Wd.proj, y, 3), 1) + ")" : "")]);
      if (last) { var prev = last[0] > 1 ? Wd.miles[last[0] - 2] : null; R.push(["Latest billion", last[0] + " billion, about " + last[1] + (prev ? " (" + (last[1] - prev[1]) + " years after " + prev[0] + " billion)" : "")]); }
      else R.push(["Latest billion", "under 1 billion until about 1804"]);
      R.push(["Next billion", next ? next[0] + " billion, about " + next[1] : y > 2025 ? "projected to level off near 10 billion" : "9 billion is projected in the 2030s"]);
    } else if (S.mode === "trans") {
      var r = row(), ni = niOf(r);
      R.push(["Stage", r[3] + ": " + C.stages[r[3]]]);
      R.push(["Birth rate", r[1] + " per 1000"]);
      R.push(["Death rate", r[2] + " per 1000"]);
      R.push(["Natural increase", "(" + r[1] + " − " + r[2] + ") ÷ 10 = " + d1(ni) + "% per year"]);
      R.push(["Doubling time", ni > 0 ? "70 ÷ " + d1(ni) + " " + dblText(ni) : dblText(ni)]);
      R.push(["Age pyramid", S.fert ? "Replacement fertility: population " + idx(momT) + " after " + Math.round(momT * 5) + " years (now = 100)" : PYRLAB[r[3]]]);
    } else {
      var dt = 70 / S.rate, pp = projP(S.rate, S.yrs);
      R.push(["Growth rate", d1(S.rate) + "% per year"]);
      R.push(["Doubling time", "70 ÷ " + d1(S.rate) + " = " + nice(dt) + " years"]);
      R.push(["Doublings", S.yrs + " ÷ " + nice(dt) + " = " + nice(S.yrs / dt)]);
      R.push(["Projection", "20 million → " + (Math.abs(pp - Math.round(pp)) < 0.05 ? "" : "≈ ") + nice(pp) + " million after " + S.yrs + " years"]);
    }
    return R;
  }
  function paintRead(){ var h = MV.readoutHTML(rows()); if (h !== readSig) { readSig = h; $("#hp-read", host).innerHTML = h; } }
  function capDefault(){
    if (S.mode === "world") return "Slow growth for most of history, then a J-curve after 1800. The gaps between billions shrank from more than a century to about 12 years.";
    if (S.mode === "trans") return S.fert ? "Fertility is now at replacement. Watch the wide base move up the pyramid." : "Growth depends on the shaded gap between the birth rate and the death rate.";
    return "Population = 20 × 2<sup>years ÷ doubling time</sup> million, using the rule of 70 exactly.";
  }
  function paintCap(){ $("#hp-cap", host).innerHTML = what || capDefault(); }
  function sync(){
    modeR.set(S.mode); wyS.set(S.wy); yrS.set(S.year); rateS.set(S.rate); yrsS.set(S.yrs);
    fertBtn.setAttribute("aria-checked", String(!!S.fert)); $(".hp-swv", fertBtn).textContent = S.fert ? "On" : "Off";
    var m = S.mode;
    $("#hp-gw", host).hidden = m !== "world"; $("#hp-gt", host).hidden = m !== "trans"; $("#hp-pyrw", host).hidden = m !== "trans"; $("#hp-gp", host).hidden = m !== "proj";
    $("#hp-cw", host).hidden = m !== "world"; $("#hp-ct", host).hidden = m !== "trans"; $("#hp-cp", host).hidden = m !== "proj";
    $("#hp-runrow", host).hidden = !S.fert;
  }
  function paintAll(){ sync(); setPyrTarget(); paintGraph(); paintRead(); paintCap(); }
  function stop(){
    if (anim) { anim(); anim = null; }
    runBtn.disabled = false; yrS.disable(false);
    if (pend) { var d = pend; pend = null; d(); }
  }
  function change(patch){
    stop();
    Object.keys(patch).forEach(function(k){ S[k] = patch[k]; });
    if (patch.year !== undefined || patch.fert !== undefined) { mom = null; momT = 0; momRan = false; }
    dy = S.year; drawTo = null; gapTo = null; wide = false; trio = false; what = ""; api.banner("", "");
    api.save(); paintAll(); MV.changed();
  }
  fertBtn.addEventListener("click", function(){ change({ fert:!S.fert }); });
  function runMomentum(done){
    stop();
    if (!mom) mom = momentumRun(SHAPES[stageOf(T, S.year)]);
    runBtn.disabled = true; yrS.disable(true); momT = 0; momRan = false; what = "Running…"; paintCap();
    anim = MV.tween({ dur:4800, ease:lin, step:function(k){ momT = 12 * k; paintPyr(); paintRead(); },
      done:function(){ anim = null; momT = 12; momRan = true; runBtn.disabled = false; yrS.disable(false); what = "The total kept rising: 100 → " + idx(4) + " after 20 years → " + idx(8) + " after 40 years → " + idx(12) + " after 60 years, then it levels off. Today’s many children became the next generation’s parents."; paintPyr(); paintRead(); paintCap(); if (done) done(); } });
  }
  runBtn.addEventListener("click", function(){ if (!runBtn.disabled) runMomentum(null); });
  // sweep the transition cursor from a to b (years) over dur ms; per-frame hook
  function sweep(a, b, dur, each, done){
    anim = MV.tween({ dur:dur, ease:MV.ease, step:function(t){ dy = lerp(a, b, t); if (each) each(dy); setPyrTarget(); paintGraph(); }, done:function(){ anim = null; dy = b; if (each) each(b); setPyrTarget(); paintGraph(); if (done) done(); } });
  }
  paintAll();
  EXF = { show:function(on){ if (on) paintGraph(); } };

  function chal(id){
    var c = byId(C.challenges, id), N = c.named || {};
    if (id === "tc1") {
      if (S.mode !== "trans") return { ok:false, msg:N.mode };
      if (S.year === 60) return { ok:true };
      if (S.year === 50) return { ok:false, msg:N.y50 };
      if (S.year === 70) return { ok:false, msg:N.y70 };
      if (S.year === 0) return { ok:false, msg:N.y0 };
      return { ok:false, msg:N.other.replace("{r}", d1(niOf(row()))) };
    }
    if (id === "tc2") {
      if (S.mode !== "trans") return { ok:false, msg:N.mode };
      if (S.year === 130) return { ok:true };
      if (S.year === 120) return { ok:false, msg:N.y120 };
      if (S.year >= 140) return { ok:false, msg:N.late };
      var r = niOf(row());
      return { ok:false, msg:N.early.replace("{y}", S.year).replace(/\{r\}/g, d1(r)).replace("{d}", Math.round(70 / r)) };
    }
    if (id === "tc3") {
      if (S.mode !== "proj") return { ok:false, msg:N.mode };
      var dbl = S.yrs * S.rate / 70;
      if (Math.abs(dbl - 2) < 1e-9) return { ok:true };
      if (Math.abs(dbl - 1) < 1e-9) return { ok:false, msg:N.one };
      if (Math.abs(dbl - 4) < 1e-9) return { ok:false, msg:N.four };
      return { ok:false, msg:N.other.replace("{p}", nice(projP(S.rate, S.yrs))) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop(); var s = p.start;
        S.mode = s.mode; S.year = s.year; S.fert = !!s.fert; mom = null; momT = 0; momRan = false;
        dy = S.year; wide = false; what = ""; trio = !!s.trio;
        drawTo = p.act === "p1" ? 0 : null; gapTo = p.act === "p1" || p.act === "p2" ? 0 : null;
        pd = SHAPES[stageOf(T, dy)].slice(); pTarget = pd.slice();
        api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = null;
        function fin(){ var d = pend; pend = null; if (d) MV.wait(400, d); }
        if (p.act === "p3") { runMomentum(function(){ fin(); }); pend = done; return; }
        pend = done;
        if (p.act === "p1") {
          yrS.disable(true);
          sweep(0, 60, 2600, function(y){ drawTo = y; gapTo = y; yrS.set(Math.round(y / 10) * 10); }, function(){
            S.year = 60; api.save(); yrS.disable(false); paintRead(); MV.changed();
            what = "The death rate fell from 38 to 18 per 1000 while the birth rate stayed near 40: the gap opened."; paintCap(); fin(); });
          return;
        }
        if (p.act === "p2") {
          yrS.disable(true);
          sweep(0, 180, 3200, function(y){ gapTo = y; yrS.set(Math.round(y / 10) * 10); }, function(){
            sweep(180, 60, 1200, function(y){ yrS.set(Math.round(y / 10) * 10); }, function(){
              S.year = 60; wide = true; api.save(); yrS.disable(false); paintGraph(); paintRead(); MV.changed();
              what = "The gap peaks at year 60: 38 − 18 = 20 per 1000, or 2.0% per year."; paintCap(); fin(); });
          });
          return;
        }
        if (p.act === "p4") {
          trio = false; yrS.disable(true); paintPyr();
          sweep(0, 180, 4200, function(y){ yrS.set(Math.round(y / 10) * 10); }, function(){
            sweep(180, 60, 1200, function(y){ yrS.set(Math.round(y / 10) * 10); }, function(){
              S.year = 60; api.save(); yrS.disable(false); paintRead(); MV.changed();
              what = "Stage 2, year 60: the wide-based pyramid sits where growth is fastest (2.0% per year). Straight sides belong to stage 4; a narrow base to stage 5."; paintCap(); fin(); });
          });
          return;
        }
        fin();
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Footprints and food ----------
// Station 1: @component footprintBuilder — three segmented controls, a stacked gha bar against Earth's biocapacity, Earths needed.
// Station 2: @component hectarePyramid — share of crops fed to livestock (0–100%) → people fed, with people icons.
// Station 3: @component S12 cerBuilder — claim chips (radio) + evidence chips (toggle) + Check; reasoning shown when valid.
function personIcon(x, y, fill, id){
  var body = sv("circle", { cx:x, cy:y + 6, r:5.5 }) + sv("path", { d:"M" + (x - 8) + " " + (y + 34) + " C" + (x - 8) + " " + (y + 15) + " " + (x + 8) + " " + (y + 15) + " " + (x + 8) + " " + (y + 34) + " Z" });
  var h = '<g class="hp-pe">' + body + "</g>";
  if (fill > 0) h += '<clipPath id="' + id + '"><rect x="' + f1(x - 9) + '" y="' + f1(y + 34 - 34 * fill) + '" width="18" height="' + f1(34 * fill) + '"/></clipPath><g class="hp-pf" clip-path="url(#' + id + ')">' + body + "</g>";
  return h;
}
function part3(host, api){
  var P = api.content, S = api.S;
  S.fp = S.fp || { diet:"mixed", travel:"some", home:"avg" }; if (S.share == null) S.share = 0; S.card = S.card || "canola"; S.cer = S.cer || {};
  var s1 = P.st1, s2 = P.st2, s3 = P.st3;
  host.innerHTML = '<div class="hp-p3">' +
    '<section class="hp-st" aria-labelledby="hp-h1"><h3 id="hp-h1">' + s1.title + "</h3><p>" + s1.text + '</p><div class="hp-fpgrid"><div class="hp-fpc">' + s1.groups.map(function(g){ return '<div id="hp-fp-' + g.id + '"></div>'; }).join("") + '</div><div class="hp-fpout" id="hp-fpout" aria-live="polite"></div></div>' +
      '<details class="alg hp-data"><summary>Check it with data</summary><div id="hp-fpdata"></div></details></section>' +
    '<section class="hp-st" aria-labelledby="hp-h2"><h3 id="hp-h2">' + s2.title + "</h3><p>" + s2.text + '</p><div class="hp-hagrid"><div><div id="hp-share"></div></div><div class="hp-haout" id="hp-haout" aria-live="polite"></div></div>' +
      '<details class="alg hp-data"><summary>Check it with data</summary><p>' + s2.data + '</p><div id="hp-hatbl"></div></details></section>' +
    '<section class="hp-st" aria-labelledby="hp-h3"><h3 id="hp-h3">' + s3.title + '</h3><p class="how">' + s3.how + '</p><div id="hp-cards"></div><details class="alg hp-data" open><summary>Check it with data</summary><p id="hp-blurb"></p></details><div class="hp-cer" id="hp-cer"></div></section></div>';
  function save(){ api.save(); }
  // ---- Station 1 ----
  s1.groups.forEach(function(g){
    radios($("#hp-fp-" + g.id, host), { label:g.label, aria:g.label, key:"fp" + g.id, cls:"chips", options:g.opts.map(function(o){ return { id:o.id, t:o.t + " <small>(" + d1(o.v) + ")</small>", aria:o.t + ", " + d1(o.v) + " global hectares" }; }), value:S.fp[g.id], onChange:function(v){ S.fp[g.id] = v; save(); paintFp(); } });
  });
  function fpParts(){ return [["Shared services", s1.base, "hp-fs0"]].concat(s1.groups.map(function(g, i){ var o = byId(g.opts, S.fp[g.id]) || g.opts[0]; return [g.label + ": " + o.t.toLowerCase(), o.v, "hp-fs" + (i + 1)]; })); }
  function paintFp(){
    var parts = fpParts(), tot = Math.round(parts.reduce(function(s, p){ return s + p[1]; }, 0) * 10) / 10, earths = tot / s1.bio, MX = 8.5;
    var bar = '<div class="hp-fpbar" role="img" aria-label="' + MV.esc("Footprint " + d1(tot) + " global hectares against a biocapacity of 1.6 per person: " + nice(earths) + " Earths.") + '"><div class="hp-fpt">' + parts.map(function(p){ return '<i class="' + p[2] + '" style="width:' + f1(p[1] / MX * 100) + '%"></i>'; }).join("") +
      '<b class="hp-fpm" style="left:' + f1(s1.bio / MX * 100) + '%"></b></div><div class="hp-fpsc"><span>0</span><span class="hp-fpbl" style="left:' + f1(s1.bio / MX * 100) + '%">biocapacity 1.6</span><span>8.5 gha</span></div></div>';
    var full = Math.floor(earths + 1e-9), fr = earths - full, eh = "";
    for (var i = 0; i < Math.ceil(earths - 1e-9); i++) { var k = i < full ? 1 : fr; eh += '<svg viewBox="0 0 30 30" aria-hidden="true" focusable="false"><circle cx="15" cy="15" r="13" class="hp-eo"/>' + (k > 0 ? '<clipPath id="hp-ec' + i + '"><rect x="0" y="0" width="' + f1(30 * k) + '" height="30"/></clipPath><circle cx="15" cy="15" r="13" class="hp-ef" clip-path="url(#hp-ec' + i + ')"/>' : "") + "</svg>"; }
    $("#hp-fpout", host).innerHTML = bar + '<p class="hp-big">Footprint <b>' + d1(tot) + ' gha</b></p><div class="hp-earths">' + eh + '</div><p class="hp-big">Earths needed if everyone lived like this: <b>' + (Math.abs(earths * 10 - Math.round(earths * 10)) < 1e-6 ? "" : "≈ ") + nice(earths) + "</b></p>" +
      '<ul class="hp-leg">' + parts.map(function(p){ return '<li><i class="hp-sw ' + p[2] + '"></i>' + p[0] + ": " + d1(p[1]) + "</li>"; }).join("") + "</ul>";
    $("#hp-fpdata", host).innerHTML = "<p>" + parts.map(function(p){ return d1(p[1]); }).join(" + ") + " = " + d1(tot) + " gha; " + d1(tot) + " ÷ 1.6 " + (Math.abs(earths * 10 - Math.round(earths * 10)) < 1e-6 ? "= " : "≈ ") + nice(earths) + " Earths.</p><p>" + s1.data + '</p><p class="tiny"><span class="bio-model">Model</span> Footprint parts and the biocapacity of 1.6 gha per person are model values. ' + s1.note + "</p>";
  }
  paintFp();
  // ---- Station 2 ----
  var shareR = radios($("#hp-share", host), { label:"Share of crops fed to livestock", aria:"Share of crops fed to livestock", key:"sh", cls:"seg", options:s2.shares.map(function(v){ return { id:v, t:v + "%" }; }), value:S.share, onChange:function(v){ S.share = +v; save(); paintHa(); } });
  void shareR;
  function people(sh){ return 10 * (1 - sh / 100) + 1 * sh / 100; }
  function paintHa(){
    var sh = S.share / 100, n = people(S.share), direct = 10 * (1 - sh), meat = sh, ic = "";
    for (var i = 0; i < 10; i++) ic += personIcon(16 + i * 26, 8, clamp(n - i, 0, 1), "hp-pc" + i);
    var bar = '<div class="hp-habar"><span class="hp-hal">crop energy on 1 hectare</span><div class="hp-hat"><i class="hp-hd" style="width:' + f1((1 - sh) * 100) + '%"></i><i class="hp-hl" style="width:' + f1(sh * 100) + '%"></i></div>' +
      '<div class="hp-haleg"><span><i class="hp-sw hp-hd"></i> eaten directly: ' + MV.num(40 * (1 - sh), 0) + " million kJ</span><span><i class=\"hp-sw hp-hl\"></i> fed to livestock: " + MV.num(40 * sh, 0) + " million kJ → ≈ " + MV.num(4 * sh, 1) + " million kJ of meat (10%)</span></div></div>";
    $("#hp-haout", host).innerHTML = bar + '<div class="hp-people" role="img" aria-label="' + MV.esc(nice(n) + " people fed out of a possible 10") + '"><svg viewBox="0 0 268 46" aria-hidden="true" focusable="false">' + ic + "</svg></div>" +
      '<p class="hp-big">People fed: <b>' + MV.num(n, 2) + "</b></p><p class=\"tiny\">" + (S.share === 0 ? "All eaten directly: 10 people." : S.share === 100 ? "All through livestock: about 90% of the energy is lost at the livestock step, so only 1 person is fed." : "10 × " + MV.num(1 - sh, 2) + " + 1 × " + MV.num(sh, 2) + " = " + MV.num(direct, 2) + " + " + MV.num(meat, 2) + " = " + MV.num(n, 2) + " people.") + "</p>";
    $("#hp-hatbl", host).innerHTML = MV.tableHTML({ head:["Share to livestock", "People fed"], rows:s2.shares.map(function(v){ return [v + "%", MV.num(people(v), 2)]; }), hiRow:s2.shares.indexOf(S.share), caption:"Model values" });
  }
  paintHa();
  // ---- Station 3: claim–evidence–reasoning ----
  var cardR = radios($("#hp-cards", host), { label:"Card", aria:"Technology card", key:"cd", cls:"chips", options:s3.cards.map(function(c){ return { id:c.id, t:c.t }; }), value:S.card, onChange:function(v){ S.card = v; save(); paintCer(); } });
  void cardR;
  var msgs = {};
  function cst(cid, side){ var a = S.cer[cid] || (S.cer[cid] = {}); return a[side] || (a[side] = { claim:null, ev:[], done:false, tries:0 }); }
  function sideHTML(card, side, title){
    var x = cst(card.id, side), list = side === "ben" ? card.ben : card.risk, key = card.id + side, h = '<div class="hp-cerside"><h4>' + title + "</h4>";
    if (x.done) {
      var cl = byId(list, x.claim);
      h += MV.fbHTML("good", "<strong>✓ Supported.</strong>") + '<dl class="hp-cerdl"><dt>Claim</dt><dd>' + cl.t + "</dd><dt>Evidence</dt><dd>" + x.ev.map(function(e){ return byId(card.ev, e).t; }).join(" ") + "</dd><dt>Reasoning</dt><dd>" + cl.why + '</dd></dl><button type="button" class="btn ghost sm" data-cer="again" data-side="' + side + '" data-k="' + key + 'again">Build another</button>';
      return h + "</div>";
    }
    h += '<p class="tiny rg-lab">Claim</p><div class="chips" role="radiogroup" aria-label="' + MV.esc(title + " claim") + '">' + list.map(function(c){ var on = x.claim === c.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-cer="claim" data-side="' + side + '" data-id="' + c.id + '" data-k="' + key + "c" + c.id + '">' + c.t + "</button>"; }).join("") + "</div>";
    h += '<p class="tiny rg-lab">Evidence (choose one or more)</p><div class="chips" role="group" aria-label="' + MV.esc(title + " evidence") + '">' + card.ev.map(function(e){ var on = x.ev.indexOf(e.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-cer="ev" data-side="' + side + '" data-id="' + e.id + '" data-k="' + key + "e" + e.id + '">' + e.t + "</button>"; }).join("") + "</div>";
    h += '<div class="q-actions"><button type="button" class="btn primary sm" data-cer="check" data-side="' + side + '" data-k="' + key + 'chk">Check</button></div>';
    if (msgs[key]) h += MV.fbHTML("bad", msgs[key]);
    return h + "</div>";
  }
  function paintCer(){
    var card = byId(s3.cards, S.card) || s3.cards[0], el = $("#hp-cer", host);
    $("#hp-blurb", host).innerHTML = card.blurb;
    var both = cst(card.id, "ben").done && cst(card.id, "risk").done;
    MV.keepFocus(el, function(){ el.innerHTML = '<div class="hp-cergrid">' + sideHTML(card, "ben", "Benefit claim") + sideHTML(card, "risk", "Risk claim") + "</div>" + (both ? MV.fbHTML("good", "<strong>✓ You weighed a benefit against a risk for " + card.t.toLowerCase() + ",</strong> each backed by evidence. That’s how to judge a technology: neither cheerleading nor blanket rejection.") : ""); });
  }
  $("#hp-cer", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-cer]"); if (!b) return;
    var card = byId(s3.cards, S.card), side = b.dataset.side, x = cst(card.id, side), key = card.id + side, list = side === "ben" ? card.ben : card.risk, act = b.dataset.cer;
    if (act === "claim") { x.claim = b.dataset.id; msgs[key] = null; }
    else if (act === "ev") { var i = x.ev.indexOf(b.dataset.id); if (i >= 0) x.ev.splice(i, 1); else x.ev.push(b.dataset.id); msgs[key] = null; }
    else if (act === "again") { x.done = false; x.claim = null; x.ev = []; }
    else if (act === "check") {
      var cl = x.claim && byId(list, x.claim);
      if (!cl) msgs[key] = "Choose a claim first.";
      else if (cl.bad) { msgs[key] = "<strong>✗ Not quite.</strong> " + cl.bad + " Choose another claim."; x.tries++; }
      else if (!x.ev.length) msgs[key] = s3.evNone;
      else if (x.ev.some(function(id){ return cl.ev.indexOf(id) < 0; })) { msgs[key] = "<strong>✗ Not quite.</strong> " + s3.evBad; x.tries++; }
      else { x.done = true; x.ev = cl.ev.filter(function(id){ return x.ev.indexOf(id) >= 0; }); msgs[key] = null; }
    }
    save(); paintCer();
    if (act === "check") MV.focusFb($("#hp-cer", host));
  });
  paintCer();
  return {};
}

// ---------- Practice 2: Population and food calculations (custom N4 with one or two boxes per item; adapted from SBI4U 18's arith) ----------
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/(\d)[\s  ](?=\d{3}\b)/g, "$1").replace(/,(?=\d{3}\b)/g, "").replace(/,/g, ".").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function calc(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.val)) x.val = []; return x; }
  host.innerHTML = '<p class="how">Type your answer in each box, then press Check.</p>' + MV.usesHTML(a.use) + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function near(v, t){ return Math.abs(v - t) <= 1e-6 * Math.max(1, Math.abs(t)); }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), el = host.querySelector('[data-li="' + it.id + '"]');
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    it.boxes.forEach(function(bx, j){ var id = "hp-li-" + it.id + "-" + j; h += '<div class="numrow"><label for="' + id + '">' + bx.label + ':</label><input class="numin" id="' + id + '" data-lin="' + it.id + '" data-j="' + j + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val[j] || "") + '"' + (x.solved ? " disabled" : "") + '><span class="hp-unit">' + bx.unit + "</span></div>"; });
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val[+e.target.dataset.j] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-li]"); if (!el) return;
    var it = byId(a.items, el.dataset.li), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    var vals = it.boxes.map(function(bx, j){ return parseVal(x.val[j]); });
    var empty = vals.map(function(v, j){ return v == null ? j : -1; }).filter(function(j){ return j >= 0; });
    if (empty.length) { msgs[it.id] = "Enter a number in " + (it.boxes.length > 1 ? "each box (" + it.boxes[empty[0]].label.toLowerCase() + ")" : "the box") + ", such as 35 or 2.5."; paintItem(it); return; }
    var bad = [];
    it.boxes.forEach(function(bx, j){
      if (near(vals[j], MV.ans(bx))) return;
      var w = (bx.wrong || []).filter(function(q){ return near(vals[j], q.match); })[0];
      bad.push((it.boxes.length > 1 ? "<em>" + bx.label + ":</em> " : "") + (w ? w.fb : it.general));
    });
    if (bad.length) { msgs[it.id] = "<strong>✗ Not quite.</strong> " + bad.join(" ") + " Try again."; x.tries++; }
    else { msgs[it.id] = null; x.solved = true; x.first = x.tries === 0 && x.hint < 3; }
    api.save(); paintItem(it); MV.focusFb(el);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Feed the family ----------
var task = (function(){
  var api = null, T = null;
  function st(){ var s = api.S; if (s.b == null) s.b = 14; if (s.c == null) s.c = 0; if (s.f == null) s.f = 0; return s; }
  function read(){ if (!api) return { b:14, c:0, f:0 }; var s = st(); return { b:+s.b, c:+s.c, f:+s.f }; }
  function parse(k){ var m = /b(\d+)-c(\d+)-f(\d+)/.exec(k) || [0, 0, 0, 0]; return { b:+m[1], c:+m[2], f:+m[3] }; }
  function land(d){ return d.b * T.land.b + d.c * T.land.c + d.f * T.land.f; }
  function text(d){ return "(" + d.b + ", " + d.c + ", " + d.f + "): beans " + d.b + ", chicken " + d.c + ", beef " + d.f + "; land " + land(d); }
  function preview(){
    var d = read(), el = $("#hp-tg"); if (!el) return;
    var n = d.b + d.c + d.f, L = land(d), MXL = 60, MXS = 20;
    function bar(lab, parts, max, mark, markLab, val){
      return '<div class="hp-grow"><span class="hp-gl">' + lab + '</span><span class="hp-gt2">' + parts.map(function(p){ return '<i class="' + p[1] + '" style="width:' + f1(Math.min(p[0], max) / max * 100) + '%"></i>'; }).join("") +
        '<b class="hp-gm" style="left:' + f1(mark / max * 100) + '%"></b></span><b class="hp-gv">' + val + '</b><span class="hp-gml">' + markLab + "</span></div>";
    }
    el.innerHTML = '<div class="hp-tbars" role="img" aria-label="' + MV.esc("Servings " + n + " (need exactly 14); land used " + L + " units (budget 40).") + '">' +
      bar("Servings", [[d.b, "hp-tb"], [d.c, "hp-tc"], [d.f, "hp-tf"]], MXS, 14, "need 14", n) +
      bar("Land used", [[d.b * T.land.b, "hp-tb"], [d.c * T.land.c, "hp-tc"], [d.f * T.land.f, "hp-tf"]], MXL, 40, "budget 40", L) +
      '<p class="tiny hp-glg"><span><span class="hp-sw hp-tb"></span> beans and lentils</span><span><span class="hp-sw hp-tc"></span> chicken</span><span><span class="hp-sw hp-tf"></span> beef</span></p></div>' +
      '<dl class="read hp-tread">' + MV.readoutHTML([["Total servings", d.b + " + " + d.c + " + " + d.f + " = " + n], ["Total land", d.b + " × 1 + " + d.c + " × 3 + " + d.f + " × 10 = " + L + " land units"], ["Animal servings", d.c + " + " + d.f + " = " + (d.c + d.f)]]) + "</dl>";
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = st();
      inp.innerHTML = '<div class="hp-tin"><div id="hp-tsb"></div><div id="hp-tsc"></div><div id="hp-tsf"></div></div>';
      function upd(){ a.save(); preview(); a.update(); }
      stepper($("#hp-tsb"), { id:"hp-tb", label:T.inputs.b + " <small>(1 land unit each)</small>", min:0, max:14, value:s.b, unit:function(v){ return String(v); }, onChange:function(v){ s.b = v; upd(); } });
      stepper($("#hp-tsc"), { id:"hp-tc", label:T.inputs.c + " <small>(3 land units each)</small>", min:0, max:14, value:s.c, unit:function(v){ return String(v); }, onChange:function(v){ s.c = v; upd(); } });
      stepper($("#hp-tsf"), { id:"hp-tf", label:T.inputs.f + " <small>(10 land units each)</small>", min:0, max:14, value:s.f, unit:function(v){ return String(v); }, onChange:function(v){ s.f = v; upd(); } });
      pv.innerHTML = '<div class="hp-tpv"><h4>Your week of protein</h4><div id="hp-tg" aria-live="polite"></div><p class="tiny muted"><span class="bio-model">Model</span> ' + T.previewNote + "</p></div>";
      preview();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.b + d.c + d.f === 14, land(d) <= 40, d.c + d.f >= 4, d.f >= 1]; },
    key:function(d){ return "b" + d.b + "-c" + d.c + "-f" + d.f; },
    label:function(k){ return MV.esc(text(parse(k))); },
    text:function(k){ return text(parse(k)); }
  };
})();

// ---------- hero: the world population curve draws from 1700 to 2025; milestone dots appear; "years between billions" bars shrink.
// Reduced motion: final frame. ----------
// VERIFY: milestone years and populations (UN estimates) before release; they come from content.explore.world.
var HW = null;
function heroSVG(Wd, yr, lab){
  var A = axes({ W:460, H:250, L:36, R:12, T:22, B:34, x0:1700, x1:2025, y0:0, y1:8.6, xt:[1700, 1800, 1900, 2000], yt:[0, 2, 4, 6, 8], yf:function(v){ return v ? v + " bn" : "0"; } });
  var h = A.g, pts = [], x;
  for (x = 1700; x <= yr; x += 2) pts.push([A.X(x), A.Y(interp(Wd.pts, x))]);
  pts.push([A.X(yr), A.Y(interp(Wd.pts, yr))]);
  if (pts.length > 1) h += sv("path", { d:poly(pts), "class":"hp-pop hp-popw" });
  var got = Wd.miles.filter(function(m){ return m[1] <= yr; });
  got.forEach(function(m){ h += sv("circle", { cx:A.X(m[1]), cy:A.Y(m[0]), r:4.5, "class":"hp-mile" }); });
  got.forEach(function(m){ if ([1, 2, 4, 8].indexOf(m[0]) >= 0) h += op(lab, txt(A.X(m[1]) - 8, A.Y(m[0]) + 4, m[0] + " bn ≈ " + (m[0] === 1 ? 1800 : m[1]), "hp-ml", "end")); });
  // gap bars
  var gb = "", bx = 40, by = 330, bw = 54;
  gb += txt(bx, 268, "years between billions", "hp-at");
  for (var i = 1; i < Wd.miles.length; i++) {
    var m0 = Wd.miles[i - 1], m1 = Wd.miles[i], gap = m1[1] - m0[1], hh = gap / 123 * 46, xx = bx + (i - 1) * bw;
    if (m1[1] > yr) break;
    gb += sv("rect", { x:xx, y:by - hh, width:bw - 12, height:hh, rx:2, "class":"hp-gbar" }) + txt(xx + (bw - 12) / 2, by - hh - 4, String(gap), "hp-gbv", "middle") + txt(xx + (bw - 12) / 2, by + 13, m0[0] + "→" + m1[0], "hp-tl", "middle");
  }
  return '<svg viewBox="0 0 460 350" class="hp-hsvg" aria-hidden="true" focusable="false">' + h + gb + "</svg>";
}
function hero(f){
  var box = $("#hp-hero"); HW = HW || (MV.C && MV.C.explore && MV.C.explore.world); if (!box || !HW) return;
  var cap = f && f.cap;
  var CAPS = ["For most of history the human population grew slowly.", "Around 1800 it reached 1 billion…", "…then death rates fell and the curve turned upward: a J-curve.", "8 billion in 2022. The gaps between billions shrank from 123 years to about 12."];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  if (MV.reduceMotion) { box.innerHTML = heroSVG(HW, 2025, 1); setCap(3); return; }
  MV.tween({ dur:6500, ease:lin, step:function(k){
    var yr = 1700 + 325 * Math.pow(k, 0.8);
    box.innerHTML = heroSVG(HW, yr, 1);
    setCap(yr < 1795 ? 0 : yr < 1880 ? 1 : yr < 2020 ? 2 : 3);
  }, done:function(){ box.innerHTML = heroSVG(HW, 2025, 1); setCap(3); } });
}

MV.module({
  hero:function(f){ hero(f); },
  explore:explore,
  part3:part3,
  activities:{ calc:calc },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
