// SBI4U 02 Light and Photosynthetic Pigments: hero (prism → rainbow → leaf), S7 spectrum lab (Explore: absorption, action
// and Engelmann modes), S9 chromatography lab (Part 3), spectrum reading and light experiments (Practice), grow-light task.
// This is the one module where light is drawn in spectral colours (course plan §3), always with the wavelength labelled.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lin(t){ return t; }
// MV.tween finishes synchronously with reduced motion; return null then, so "busy" handles don't stay set.
function tween(o){ var fin = false, d = o.done; o.done = function(){ fin = true; if (d) d(); }; var c = MV.tween(o); return fin ? null : c; }

// ---------- model (plan: sums of bell-shaped peaks, highest point 100; readouts rounded, tests unrounded) ----------
function G(l, m, s){ return Math.exp(-(l - m) * (l - m) / (2 * s * s)); }
var PIG = {
  a:{ f:function(l){ return 100 * G(l, 430, 15) + 75 * G(l, 662, 12); }, name:"chlorophyll a", html:"chlorophyll <i>a</i>", tok:"--ink", dash:null },
  b:{ f:function(l){ return 100 * G(l, 453, 15) + 60 * G(l, 642, 12); }, name:"chlorophyll b", html:"chlorophyll <i>b</i>", tok:"--ink-2", dash:[7, 5] },
  c:{ f:function(l){ return 85 * G(l, 450, 18) + 70 * G(l, 480, 14); }, name:"carotenoids", html:"carotenoids", tok:"--lp-car", dash:null }
};
var PK = ["a", "b", "c"];
function A(k, l){ return PIG[k].f(l); }
function R(v){ return Math.round(v); }
// colour names (plan: violet < 450 ≤ blue < 495 ≤ green < 570 ≤ yellow < 590 ≤ orange < 620 ≤ red < 700 ≤ far red)
function cname(l){ return l < 450 ? "violet" : l < 495 ? "blue" : l < 570 ? "green" : l < 590 ? "yellow" : l < 620 ? "orange" : l < 700 ? "red" : "far red"; }
// Spectral colour of a wavelength (module 02 only). Screens can't show 730 nm, so far red fades to a dark red.
function specRGB(l, alpha){
  var r = 0, g = 0, b = 0;
  if (l < 440) { r = (440 - l) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; } else if (l < 510) { g = 1; b = (510 - l) / 20; }
  else if (l < 580) { r = (l - 510) / 70; g = 1; } else if (l < 645) { r = 1; g = (645 - l) / 65; } else r = 1;
  var f = l < 420 ? 0.35 + 0.65 * (l - 380) / 40 : l > 700 ? 0.35 + 0.65 * (750 - l) / 50 : 1;
  function c(v){ return Math.round(255 * Math.pow(clamp(v * f, 0, 1), 0.8)); }
  return "rgba(" + c(r) + "," + c(g) + "," + c(b) + "," + (alpha == null ? 1 : alpha) + ")";
}
// Engelmann: a continuous model action curve through the seven filter values (exact at the filters; model shape between)
var ACT = [[380, 6], [400, 14], [420, 20], [450, 24], [470, 21], [490, 15], [510, 8], [530, 6], [560, 6], [580, 8], [610, 14], [640, 19], [660, 22], [680, 17], [700, 7], [715, 3], [730, 2], [750, 1]];
function actAt(l){ l = clamp(l, 380, 750); for (var i = 1; i < ACT.length; i++) if (l <= ACT[i][0]) { var p = ACT[i - 1], q = ACT[i]; return lerp(p[1], q[1], (l - p[0]) / (q[0] - p[0])); } return 1; }
function density(v){ return v >= 18 ? "High" : v >= 11 ? "Medium" : v >= 5 ? "Low" : "Almost none"; }
function bubOf(nm){ var f = MV.C.explore.filters.filter(function(x){ return x.nm === nm; })[0]; return f ? f.bubbles : 0; }

// ---------- @component radioGroup (copied from SBI4U 01 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list)}
function radios(host, o){
  var val = String(o.value);
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (x.dis ? -1 : tab) + '" data-rg="' + x.id + '"' + (x.dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
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

// ---------- @component S7 spectrumGraph — wavelength axis 380–750 nm with a spectral strip, pigment absorption curves,
// an optional action-spectrum overlay (right-hand bubbles/min scale), spectral marker with a wavelength tag, highlight band,
// lamp bars, and an Engelmann slide (filament + bacteria). Margins are in px; specView() turns them into a Plot view so
// plot.X(λ) and plot.Y(absorbance) work for drawing and hit-testing. ----------
function specMargins(o){ return { l:o.eng ? 12 : 40, r:o.action || o.lamps ? 40 : 14, t:34, b:44 }; }
function specView(canvas, m){
  var r = canvas.getBoundingClientRect(), W = r.width || 320, H = r.height || 240;
  var pw = Math.max(40, W - m.l - m.r), ph = Math.max(40, H - m.t - m.b), kx = 370 / pw, ky = 112 / ph;
  return { xmin:380 - m.l * kx, xmax:750 + m.r * kx, ymin:-m.b * ky, ymax:112 + m.t * ky };
}
function specRender(plot, o){ plot.draw({ view:specView(plot.c, specMargins(o)), grid:false, axes:false, describe:o.describe, after:function(ctx){ drawSpec(ctx, plot, o); } }); }
function lamFromEvent(plot, e){ var r = plot.c.getBoundingClientRect(); return clamp(Math.round(plot.xOf(e.clientX - r.left)), 380, 750); }
function fontUI(px, w){ return (w || "") + " " + px + "px " + (css("--font-ui") || "sans-serif"); }
function pigLabel(ctx, k, x, y, align, small, col, alpha){
  var parts = k === "c" ? [["carotenoids", 0]] : [[small ? "chl " : "chlorophyll ", 0], [k, 1]], w = 0;
  var fU = fontUI(12, "600"), fI = "italic 600 13px " + (css("--font-math") || "serif");
  parts.forEach(function(p){ ctx.font = p[1] ? fI : fU; p.w = ctx.measureText(p[0]).width; w += p.w; });
  var x0 = align === "right" ? x - w : x;
  ctx.save(); ctx.globalAlpha = 0.85 * (alpha == null ? 1 : alpha); ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 2, y - 8, w + 4, 16);
  ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = col; ctx.textBaseline = "middle"; ctx.textAlign = "left";
  parts.forEach(function(p){ ctx.font = p[1] ? fI : fU; ctx.fillText(p[0], x0, y); x0 += p.w; });
  ctx.restore();
}
function pigLabelText(ctx, text, x, y, col){
  ctx.save(); ctx.font = fontUI(12, "700"); var w = ctx.measureText(text).width;
  ctx.globalAlpha = 0.85; ctx.fillStyle = css("--sheet"); ctx.fillRect(x - 2, y - 8, w + 4, 16); ctx.globalAlpha = 1;
  ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(text, x, y); ctx.restore();
}
function tagAt(ctx, plot, x, text, sw){
  ctx.save(); ctx.font = fontUI(12, "700");
  var w = ctx.measureText(text).width + (sw ? 26 : 12), h = 19, x0 = clamp(x - w / 2, 2, plot.W - w - 2), y0 = 3;
  ctx.fillStyle = css("--sheet"); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.5;
  ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x0, y0, w, h, 9); else ctx.rect(x0, y0, w, h); ctx.fill(); ctx.stroke();
  if (sw) { ctx.fillStyle = sw; ctx.fillRect(x0 + 6, y0 + 5, 9, 9); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1; ctx.strokeRect(x0 + 6.5, y0 + 5.5, 8, 8); }
  ctx.fillStyle = css("--ink"); ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillText(text, x0 + (sw ? 19 : 5), y0 + h / 2 + 0.5);
  ctx.restore();
}
function drawSpec(ctx, p, o){
  var K = { ink:css("--ink"), ink2:css("--ink-2"), grid:css("--plot-grid"), pen:css("--pen"), sheet:css("--sheet"), hi:css("--hi-soft"), paper:css("--paper") };
  var X0 = p.X(380), X1 = p.X(750), Y0 = p.Y(0), Yt = p.Y(108), small = (X1 - X0) < 400, on = o.pig || { a:true, b:true, c:true }, x, l;
  if (o.band) { ctx.fillStyle = K.hi; ctx.fillRect(p.X(o.band[0]), Yt, p.X(o.band[1]) - p.X(o.band[0]), Y0 - Yt); }
  if (o.eng) drawEng(ctx, p, o.eng);
  else {
    ctx.lineWidth = 1; ctx.strokeStyle = K.grid; ctx.beginPath();
    for (var g = 25; g <= 100; g += 25) { var gy = Math.round(p.Y(g)) + 0.5; ctx.moveTo(X0, gy); ctx.lineTo(X1, gy); }
    for (l = 400; l <= 750; l += 50) { x = Math.round(p.X(l)) + 0.5; ctx.moveTo(x, Yt); ctx.lineTo(x, Y0); }
    ctx.stroke();
    ctx.strokeStyle = K.ink2; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X0, Yt); ctx.lineTo(X0, Y0); ctx.lineTo(X1, Y0); ctx.stroke();
    ctx.font = fontUI(12); ctx.fillStyle = K.ink2; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    [0, 50, 100].forEach(function(v){ ctx.fillText(String(v), X0 - 5, p.Y(v)); });
    ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yTitle || "absorbance", X0 + 4, p.Y(112) - 4);
  }
  // spectral strip and wavelength ticks (thin ink-2 frame keeps it readable on a dark sheet)
  var sy = Y0 + 6, sh = 13;
  for (var px = Math.floor(X0); px < X1; px++) { ctx.fillStyle = specRGB(p.xOf(px + 0.5)); ctx.fillRect(px, sy, 1.5, sh); }
  ctx.strokeStyle = K.ink2; ctx.lineWidth = 1; ctx.strokeRect(X0 + 0.5, sy + 0.5, X1 - X0 - 1, sh);
  ctx.fillStyle = K.ink2; ctx.font = fontUI(12); ctx.textBaseline = "top"; ctx.textAlign = "center";
  [400, 500, 600, 700].forEach(function(v){ ctx.fillText(String(v), p.X(v), sy + sh + 4); });
  ctx.textAlign = "right"; ctx.fillText("nm", X1, sy + sh + 4);
  // absorption curves
  if (!o.eng) PK.forEach(function(k){
    if (!on[k]) return;
    ctx.save(); ctx.globalAlpha = o.faint ? 0.42 : 1; ctx.strokeStyle = css(PIG[k].tok); ctx.lineWidth = o.faint ? 2 : 3; ctx.setLineDash(PIG[k].dash || []); ctx.lineJoin = "round";
    ctx.beginPath(); for (var q = 380; q <= 750; q++) { var cx = p.X(q), cy = p.Y(A(k, q)); if (q === 380) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy); } ctx.stroke(); ctx.restore();
  });
  // right-hand bubbles/min scale (0–25 drawn on the 0–100 absorbance scale)
  if (o.action || o.lamps) {
    ctx.fillStyle = K.pen; ctx.font = fontUI(12); ctx.textAlign = "left"; ctx.textBaseline = "middle";
    [0, 10, 20].forEach(function(v){ ctx.fillText(String(v), X1 + 5, p.Y(v * 4)); });
    ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText("bubbles/min", X1 + 36, p.Y(112) - 4);
  }
  if (o.lamps) o.lamps.forEach(function(L){
    var lx = p.X(L.nm), top = p.Y(L.b * 4), w = 12;
    ctx.fillStyle = specRGB(L.nm); ctx.fillRect(lx - w / 2, top, w, Y0 - top);
    ctx.strokeStyle = K.ink; ctx.lineWidth = 1.5; ctx.strokeRect(lx - w / 2, top, w, Y0 - top);
    ctx.fillStyle = K.ink; ctx.font = fontUI(11, "700"); ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(String(L.b), lx, top - 2);
  });
  if (o.action) {
    var pts = o.action.pts;
    ctx.save(); ctx.strokeStyle = K.pen; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.beginPath();
    pts.forEach(function(q, i){ var ax = p.X(q.nm), ay = p.Y(q.b * 4); if (i) ctx.lineTo(ax, ay); else ctx.moveTo(ax, ay); }); ctx.stroke();
    pts.forEach(function(q){ ctx.beginPath(); ctx.arc(p.X(q.nm), p.Y(q.b * 4), 5, 0, 2 * Math.PI); ctx.fillStyle = K.pen; ctx.fill(); ctx.strokeStyle = K.sheet; ctx.lineWidth = 1.5; ctx.stroke(); });
    pigLabelText(ctx, "action spectrum", p.X(528), p.Y(37), K.pen);
    if (o.action.cur != null) { ctx.beginPath(); ctx.arc(p.X(o.action.cur), p.Y(o.action.curB * 4), 9, 0, 2 * Math.PI); ctx.strokeStyle = K.ink; ctx.lineWidth = 2.2; ctx.stroke(); }
    ctx.restore();
  }
  // marker: spectral line with ink edges, dots on the curves, wavelength tag
  var mk = o.marker;
  if (mk) {
    var mx = p.X(mk.l), top2 = p.Y(110);
    ctx.save(); ctx.lineCap = "butt";
    ctx.strokeStyle = K.ink; ctx.lineWidth = 5.5; ctx.beginPath(); ctx.moveTo(mx, top2); ctx.lineTo(mx, sy + sh); ctx.stroke();
    ctx.strokeStyle = specRGB(mk.l); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  }
  if (!o.eng && o.labels !== false) {
    var la = o.faint ? 0.75 : 1;
    if (on.c) pigLabel(ctx, "c", p.X(484), p.Y(104), "left", small, K.ink, la);
    if (on.b) pigLabel(ctx, "b", p.X(634), p.Y(67), "right", small, K.ink, la);
    if (on.a) pigLabel(ctx, "a", p.X(671), p.Y(81), "left", small, K.ink, la);
  }
  if (mk) {
    if (!o.eng && mk.dots !== false) PK.forEach(function(k){
      if (!on[k]) return;
      ctx.beginPath(); ctx.arc(mx, p.Y(A(k, mk.l)), 4.5, 0, 2 * Math.PI); ctx.fillStyle = css(PIG[k].tok); ctx.fill(); ctx.strokeStyle = K.sheet; ctx.lineWidth = 1.5; ctx.stroke();
    });
    tagAt(ctx, p, mx, mk.tag || (mk.l + " nm · " + cname(mk.l)), specRGB(mk.l));
  }
}
// Engelmann slide: spread spectrum (or white light), a filament of cells, bacteria as dots
function drawEng(ctx, p, e){
  var X0 = p.X(380), X1 = p.X(750), yt = p.Y(108), yb = p.Y(0), fy = p.Y(56), K = { ink:css("--ink"), ink2:css("--ink-2"), sheet:css("--sheet"), paper:css("--paper"), lf:css("--leaf-fill"), le:css("--leaf-edge"), leaf:css("--leaf") };
  if (e.spread) for (var px = Math.floor(X0); px < X1; px++) { ctx.fillStyle = specRGB(p.xOf(px + 0.5), 0.55); ctx.fillRect(px, yt, 1.5, yb - yt); }
  else { ctx.fillStyle = K.paper; ctx.fillRect(X0, yt, X1 - X0, yb - yt); ctx.fillStyle = K.ink2; ctx.font = fontUI(12, "700"); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("white light (spectrum not spread)", X0 + 6, yt + 5); }
  ctx.strokeStyle = K.ink2; ctx.lineWidth = 1; ctx.strokeRect(X0 + 0.5, yt + 0.5, X1 - X0 - 1, yb - yt - 1);
  var cw = 15;
  for (var x = X0 + 3; x + cw <= X1 - 2; x += cw) {
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x + 0.5, fy - 6, cw - 1, 12, 4); else ctx.rect(x + 0.5, fy - 6, cw - 1, 12);
    ctx.fillStyle = K.sheet; ctx.fill(); ctx.fillStyle = K.lf; ctx.fill(); ctx.strokeStyle = K.le; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.strokeStyle = K.leaf; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x + 3, fy + 2); ctx.quadraticCurveTo(x + cw / 2, fy - 5, x + cw - 3, fy + 2); ctx.stroke();
  }
  ctx.fillStyle = K.ink; ctx.strokeStyle = K.sheet; ctx.lineWidth = 1;
  (e.pts || []).forEach(function(q){ ctx.beginPath(); ctx.ellipse(p.X(q.l), p.Y(q.y), 3, 1.9, q.r || 0, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); });
}

// ---------- Engelmann bacteria (deterministic: same settings, same picture) ----------
var ENG_N = 260;
function gauss(r){ var u = Math.max(1e-6, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function engStart(){ var r = MV.bio.rng("lp-eng-start"), out = []; for (var i = 0; i < ENG_N; i++) out.push({ l:r.range(383, 747), y:r.range(10, 103), r:r.range(-1.2, 1.2) }); return out; }
function engTargets(spread){
  var r = MV.bio.rng("lp-eng-" + (spread ? "spread" : "white")), cdf = [], tot = 0, out = [], l;
  for (l = 380; l <= 750; l++) { tot += spread ? Math.pow(actAt(l), 1.5) : 1; cdf.push(tot); }
  for (var i = 0; i < ENG_N; i++) {
    var u = (i + r()) / ENG_N * tot, k = 0; while (k < cdf.length - 1 && cdf[k] < u) k++;
    var side = r() < 0.5 ? -1 : 1, off = 3 + Math.abs(gauss(r)) * 4;
    out.push({ l:clamp(380 + k + r() - 0.5, 382, 748), y:clamp(56 + side * off, 8, 105), r:r.range(-1.2, 1.2), d:r() * 0.45 });
  }
  return out;
}

// ---------- Explore: S7 spectrum lab ----------
var EXP = null;
function explore(host, api){
  var C = api.content, S = api.S, F = C.filters;
  if (!S.mode) S.mode = "abs"; if (S.wl == null) S.wl = 500; if (!S.pig) S.pig = { a:true, b:true, c:true }; if (S.filter == null) S.filter = 450;
  if (S.spread == null) S.spread = true; if (S.most === undefined) S.most = null; if (S.fewest === undefined) S.fewest = null; S.settled = !!S.settled;
  var anim = null, engAnim = null, engT = 1, shownB = null, START = engStart(), TG = engTargets(S.spread), visible = false;
  host.innerHTML = '<div class="pg lp-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot" id="lp-plot" role="img"></canvas></div>' +
    '<p class="tiny muted lp-mnote"><span class="bio-model">Model data</span> ' + C.modelNote + "</p></div>" +
    '<div class="pg-ctrl"><div class="lp-row" id="lp-mode"></div>' +
    '<label class="slider lp-sl" id="lp-slw"><span class="slider-top"><span>Wavelength</span><output id="lp-wl-out" for="lp-wl"></output></span><input type="range" id="lp-wl" min="380" max="750" step="1"><span class="tiny muted">Arrow keys: 1 nm. Shift + arrow: 10 nm. You can also drag on the graph.</span></label>' +
    '<div class="lp-panel" id="lp-p-abs"><span class="rg-lab">Pigments</span><div class="lp-tgs" role="group" aria-label="Pigments to show">' +
      PK.map(function(k){ return '<button type="button" class="lp-tg" data-pg="' + k + '" data-k="lppg' + k + '" aria-pressed="true"><svg viewBox="0 0 28 8" aria-hidden="true" focusable="false"><line x1="1" y1="4" x2="27" y2="4" class="lp-ln-' + k + '"/></svg><span>' + MV.cap(PIG[k].html) + "</span></button>"; }).join("") + "</div></div>" +
    '<div class="lp-panel" id="lp-p-act"><div class="lp-row" id="lp-filters"></div>' +
      '<div class="lp-rec"><span class="rg-lab">Record this filter as:</span><button type="button" class="btn ghost sm" data-rec="most" data-k="lprecm">Most bubbles</button><button type="button" class="btn ghost sm" data-rec="fewest" data-k="lprecf">Fewest bubbles</button></div>' +
      '<p class="lp-picks" id="lp-picks" aria-live="polite"></p><p class="tiny muted lp-note">' + C.actionNote + "</p></div>" +
    '<div class="lp-panel" id="lp-p-eng"><p class="tiny lp-note">' + C.engNote + '</p><div class="q-actions lp-engbtns"><button type="button" class="btn primary sm" id="lp-run" data-k="lprun">Run</button>' +
      '<button type="button" class="lp-tg" id="lp-spread" data-k="lpspread" aria-pressed="true"><span class="lp-tick" aria-hidden="true"></span><span>Spread the spectrum along the filament</span></button></div></div>' +
    '</div><div class="pg-read"><div id="lp-tank"></div><dl class="read" id="lp-read" aria-live="polite"></dl></div></div>';
  var cv = $("#lp-plot"), plot = new MV.Plot(cv, { xmin:360, xmax:760, ymin:-30, ymax:130 }), wl = $("#lp-wl");
  var modeR = radios($("#lp-mode"), { label:"Mode", options:[{ id:"abs", t:"Absorption" }, { id:"act", t:"Action" }, { id:"eng", t:"Engelmann" }], value:S.mode, onChange:function(m){ stop(); S.mode = m; changed(); } });
  var filtR = radios($("#lp-filters"), { label:"Filter", cls:"chips", aria:"Filter colour (same lamp brightness every time)", value:S.filter,
    options:F.map(function(f){ return { id:f.nm, t:'<i class="lp-sw" style="background:' + specRGB(f.nm) + '"></i>' + f.nm + " " + f.name + (f.note ? " (" + f.note + ")" : "") }; }),
    onChange:function(v){ stop(); S.filter = +v; changed(); } });
  wl.addEventListener("input", function(){ stop(); S.wl = +wl.value; changed(); });
  wl.addEventListener("keydown", function(e){
    if (!e.shiftKey) return; var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 10 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -10 : 0; if (!d) return;
    e.preventDefault(); stop(); S.wl = clamp(S.wl + d, 380, 750); changed();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pg) { stop(); S.pig[b.dataset.pg] = !S.pig[b.dataset.pg]; changed(); }
    else if (b.dataset.rec) { S[b.dataset.rec] = S.filter; changed(); }
    else if (b.id === "lp-run") runEng(null);
    else if (b.id === "lp-spread") { stop(); S.spread = !S.spread; TG = engTargets(S.spread); S.settled = false; engT = 0; changed(); }
  });
  // drag on the graph: set the wavelength (absorption, Engelmann) or pick the nearest filter (action)
  var dragging = false;
  function fromPointer(e){
    var l = lamFromEvent(plot, e);
    if (S.mode === "act") { var best = F[0]; F.forEach(function(f){ if (Math.abs(f.nm - l) < Math.abs(best.nm - l)) best = f; }); if (best.nm !== S.filter) { stop(); S.filter = best.nm; changed(); } }
    else if (l !== S.wl) { stop(); S.wl = l; changed(); }
  }
  cv.addEventListener("pointerdown", function(e){ dragging = true; try { cv.setPointerCapture(e.pointerId); } catch (err) {} fromPointer(e); });
  cv.addEventListener("pointermove", function(e){ if (dragging && S.mode !== "act") fromPointer(e); });
  cv.addEventListener("pointerup", function(){ dragging = false; }); cv.addEventListener("pointercancel", function(){ dragging = false; });

  function lam(){ return S.mode === "act" ? S.filter : S.wl; }
  function shownPig(){ return S.mode === "abs" ? S.pig : { a:true, b:true, c:true }; }
  function bubNow(){ return shownB != null ? shownB : bubOf(S.filter); }
  function engPts(){
    if (S.settled && !engAnim) return TG;
    if (!engAnim) return START;
    return START.map(function(s, i){
      var t = TG[i], u = MV.ease(clamp((engT - t.d) / 0.55, 0, 1)), wob = Math.sin(u * Math.PI) * 6 * Math.sin(i * 1.7);
      return { l:lerp(s.l, t.l, u), y:lerp(s.y, t.y, u) + wob, r:lerp(s.r, t.r, u) };
    });
  }
  function stop(){ if (anim) { anim(); anim = null; } shownB = null; if (engAnim) { engAnim(); engAnim = null; engT = 1; S.settled = true; } }
  function runEng(done){
    stop(); S.settled = false; engT = 0; TG = engTargets(S.spread); api.save(); paint();
    engAnim = tween({ dur:2800, ease:lin, step:function(t){ engT = t; render(); }, done:function(){ engAnim = null; engT = 1; S.settled = true; api.save(); paint(); MV.changed(); if (done) done(); } });
  }
  function changed(){ api.save(); paint(); MV.changed(); }
  function sync(){
    modeR.set(S.mode); filtR.set(S.filter); wl.value = S.wl;
    $("#lp-wl-out").textContent = S.wl + " nm"; wl.setAttribute("aria-valuetext", S.wl + " nm, " + cname(S.wl));
    $("#lp-slw").hidden = S.mode === "act";
    $("#lp-p-abs").hidden = S.mode !== "abs"; $("#lp-p-act").hidden = S.mode !== "act"; $("#lp-p-eng").hidden = S.mode !== "eng";
    PK.forEach(function(k){ var b = $('[data-pg="' + k + '"]', host); b.setAttribute("aria-pressed", String(!!S.pig[k])); });
    $("#lp-spread").setAttribute("aria-pressed", String(!!S.spread));
    $("#lp-run").textContent = S.settled ? "Run again" : "Run"; $("#lp-run").disabled = !!engAnim;
    $("#lp-picks").innerHTML = "Your picks: most bubbles <strong>" + (S.most ? S.most + " nm" : "—") + "</strong> · fewest bubbles <strong>" + (S.fewest ? S.fewest + " nm" : "—") + "</strong>";
  }
  function pigRow(){
    var on = shownPig(), l = lam(), ks = PK.filter(function(k){ return on[k]; });
    if (!ks.length) return ["Pigments", '<span class="muted">none switched on</span>'];
    var lab = ks.map(function(k, i){ return k === "c" ? "carotenoids" : (i && ks[i - 1] !== "c" && k === "b" && on.a ? "<i>b</i>" : PIG[k].html); }).join(" / ");
    return [MV.cap(lab), ks.map(function(k){ return R(A(k, l)); }).join(" / ")];
  }
  function mostAbs(){
    var on = shownPig(), l = lam(), best = null, bv = -1;
    PK.forEach(function(k){ if (on[k] && A(k, l) > bv) { bv = A(k, l); best = k; } });
    return best == null || R(bv) < 5 ? "none" : PIG[best].html;
  }
  function rows(){
    var l = lam(), out = [];
    out.push(["Wavelength", '<i class="lp-sw" style="background:' + specRGB(l) + '"></i>' + l + " nm (" + cname(l) + ")"]);
    out.push(["Photon energy", (675 / l).toFixed(2) + " × that of a 675 nm photon"]);
    out.push(pigRow());
    out.push(["Most-absorbing pigment here", mostAbs()]);
    if (S.mode === "act") out.push(["Bubbles per minute", '<strong class="lp-big">' + R(bubNow()) + "</strong>"]);
    if (S.mode === "eng") out.push(["Bacteria density (under the marker)", engAnim ? "Settling…" : !S.settled ? '<span class="muted">Press Run to let the bacteria settle.</span>' : !S.spread ? "Even all along: white light reaches every cell" : density(actAt(l))]);
    return out;
  }
  function describe(){
    var l = lam(), on = shownPig(), vals = PK.filter(function(k){ return on[k]; }).map(function(k){ return MV.cap(PIG[k].name) + " " + R(A(k, l)); }).join(", ");
    var head = l + " nm, " + cname(l) + ". ";
    if (S.mode === "abs") return "Absorption spectra. " + head + (vals ? vals + "." : "No pigments switched on.");
    if (S.mode === "act") return "Action spectrum of Elodea (bubbles per minute at seven filters: " + F.map(function(f){ return f.nm + " nm " + f.bubbles; }).join(", ") + ") over faint absorption curves. Filter " + head + R(bubNow()) + " bubbles per minute. " + vals + ".";
    var st = engAnim ? "The bacteria are moving." : !S.settled ? "The bacteria are scattered through the water; press Run." : !S.spread ? "The bacteria are spread evenly along the filament." : "The bacteria have crowded under violet-blue (about 420–460 nm) and red (about 640–680 nm), with few under green and almost none past 710 nm.";
    return "Engelmann’s experiment: a green algal filament across " + (S.spread ? "a spread spectrum from 380 to 750 nm" : "white light") + ". " + st + " Marker at " + head;
  }
  function render(){
    var l = lam(), o = { pig:shownPig(), describe:describe(), marker:{ l:l } };
    if (S.mode === "act") { o.faint = true; o.action = { pts:F.map(function(f){ return { nm:f.nm, b:f.bubbles }; }), cur:S.filter, curB:bubNow() }; o.marker.dots = false; }
    if (S.mode === "eng") { o.eng = { spread:S.spread, pts:engPts() }; o.marker.tag = l + " nm · " + cname(l); }
    specRender(plot, o);
  }
  plot.render = render;
  var readSig = "";
  function paint(){
    sync();
    var sig = JSON.stringify(rows()); if (sig !== readSig) { readSig = sig; $("#lp-read").innerHTML = MV.readoutHTML(rows()); }
    tankPaint(); render();
  }

  // ---- Elodea tank (Action mode): lamp → filter → beaker with a sprig; bubbles rise at the model rate (sped up 6×) ----
  var tk = { bub:[], acc:0, raf:0, last:0, sig:"" };
  function tankPaint(){
    var box = $("#lp-tank");
    if (S.mode !== "act") { if (box.innerHTML) { box.innerHTML = ""; tk.sig = ""; } return; }
    var nm = S.filter, sig = nm + "|" + (MV.reduceMotion ? R(bubNow()) : "");
    if (sig !== tk.sig) {
      tk.sig = sig; tk.bub = [];
      var col = specRGB(nm), leaves = "";
      for (var i = 0; i < 7; i++) { var y = 122 - i * 9, s = i % 2 ? 1 : -1; leaves += sv("ellipse", { cx:150 + s * 7, cy:y, rx:7.5, ry:2.6, transform:"rotate(" + (s * -28) + " " + (150 + s * 7) + " " + y + ")", "class":"lp-elleaf" }); }
      box.innerHTML = '<figure class="lp-tank"><svg viewBox="0 0 220 150" role="img" aria-label="' + MV.esc("Elodea sprig in a beaker of water, lit by a lamp through the " + nm + " nm (" + cname(nm) + ") filter. Bubbles of O₂ rise from the cut stem.") + '">' +
        sv("circle", { cx:22, cy:70, r:12, "class":"lp-lamp" }) + sv("path", { d:"M14 86 H30 M16 91 H28", "class":"lp-lamp-b" }) + sv("text", { x:22, y:108, "class":"lp-tx", "text-anchor":"middle" }, "lamp") +
        sv("path", { d:"M36 70 q 3 -4 6 0 t 6 0", "class":"lp-wave" }) +
        sv("rect", { x:52, y:46, width:9, height:48, rx:2, style:"fill:" + col, "class":"lp-filt" }) + sv("text", { x:56, y:108, "class":"lp-tx", "text-anchor":"middle" }, nm + " nm") +
        '<polygon points="61,52 102,44 102,96 61,88" style="fill:' + specRGB(nm, 0.28) + '"/>' +
        sv("rect", { x:101, y:26, width:98, height:108, "class":"lp-water" }) +
        sv("path", { d:"M150 132 C148 112 153 92 150 72", "class":"lp-stem" }) + leaves +
        '<g id="lp-bub"></g>' + sv("path", { d:"M100 12 V135 H200 V12", "class":"lp-glass" }) + "</svg>" +
        '<figcaption class="tiny muted">' + C.plantNote + " " + (MV.reduceMotion ? "Still picture: each bubble drawn stands for about 3 bubbles per minute." : "Bubbles sped up 6 times.") + "</figcaption></figure>";
      if (MV.reduceMotion) { var n = Math.max(0, Math.round(bubNow() / 3)), g = ""; for (var j = 0; j < n; j++) g += sv("circle", { cx:150 + (j % 2 ? 2 : -2), cy:66 - j * 5, r:2.6, "class":"lp-bubble" }); $("#lp-bub").innerHTML = g; }
    }
    kick();
  }
  function tankLoop(ts){
    tk.raf = 0; var dt = tk.last ? Math.min(0.05, (ts - tk.last) / 1000) : 0; tk.last = ts;
    var rate = bubNow() * 6 / 60; tk.acc += dt * rate;
    while (tk.acc >= 1) { tk.acc -= 1; tk.bub.push({ y:68, x:150, ph:Math.random() * 6 }); }
    tk.bub.forEach(function(b){ b.y -= dt * 34; });
    tk.bub = tk.bub.filter(function(b){ return b.y > 28; });
    var g = $("#lp-bub"); if (g) g.innerHTML = tk.bub.map(function(b){ return sv("circle", { cx:b.x + 2 * Math.sin(b.y / 6 + b.ph), cy:b.y, r:2.6, "class":"lp-bubble" }); }).join("");
    if (running()) tk.raf = requestAnimationFrame(tankLoop); else tk.last = 0;
  }
  function running(){ return visible && S.mode === "act" && !MV.reduceMotion; }
  function kick(){ if (!tk.raf && running()) { tk.last = 0; tk.raf = requestAnimationFrame(tankLoop); } }

  paint();
  EXP = { show:function(v){ visible = v; if (v) kick(); } };

  function chal(id){
    var l = S.wl, a = A("a", l), b = A("b", l), c = A("c", l);
    if (id === "tc1") {
      if (b >= 10 && b > a) return { ok:true };
      if (a < 10 && b < 10) return { ok:false, msg:"Neither chlorophyll absorbs here." };
      if (l < 442) return { ok:false, msg:"That’s chlorophyll <i>a</i>’s peak." };
      return { ok:false, msg:"Chlorophyll <i>a</i>’s red peak lies to the right of <i>b</i>’s." };
    }
    if (id === "tc2") {
      if (S.most === 450 && S.fewest === 730) return { ok:true };
      if (S.most == null || S.fewest == null) return { ok:false, msg:"In Action mode, choose a filter and press <strong>Most bubbles</strong> or <strong>Fewest bubbles</strong> to record it. Record one of each." };
      if (S.fewest === 530) return { ok:false, msg:"Green is low (6), but far red is lower: chlorophyll absorbs almost nothing past 700 nm." };
      if (S.most === 660) return { ok:false, msg:"Red is close (22), but blue gives 24 here." };
      if (S.most !== 450) return { ok:false, msg:"Your “most” filter gives " + bubOf(S.most) + " bubbles per minute. Another filter gives more." };
      return { ok:false, msg:"Your “fewest” filter gives " + bubOf(S.fewest) + " bubbles per minute. Another filter gives fewer." };
    }
    if (id === "tc3") {
      if (a >= 50 && b <= 10 && c <= 10) return { ok:true };
      if (a >= 50 && l < 550) return { ok:false, msg:"Chlorophyll <i>a</i> is high, but carotenoids absorb " + R(c) + " and chlorophyll <i>b</i> " + R(b) + "." };
      if (a >= 50) return { ok:false, msg:"Chlorophyll <i>b</i> still absorbs " + R(b) + " here." };
      if (l > 662) return { ok:false, msg:"Chlorophyll <i>a</i> has dropped to " + R(a) + "." };
      return { ok:false, msg:"Chlorophyll <i>a</i> absorbs only " + R(a) + " here; it needs at least 50." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop(); var s = p.start; S.mode = s.mode;
        if (s.mode === "abs") { S.pig = { a:!!s.pig.a, b:!!s.pig.b, c:!!s.pig.c }; S.wl = s.wl; }
        else if (s.mode === "act") S.filter = s.filter;
        else { S.spread = s.spread; TG = engTargets(S.spread); S.settled = false; engT = 0; }
        changed();
      },
      run:function(p, done){
        if (p.start.mode === "abs") {
          var from = S.wl, to = p.to;
          anim = tween({ dur:1800, step:function(t){ S.wl = Math.round(lerp(from, to, t)); paint(); }, done:function(){ anim = null; S.wl = to; changed(); MV.wait(400, done); } });
        } else if (p.start.mode === "act") {
          var b0 = bubOf(S.filter), b1 = bubOf(p.to); S.filter = p.to; shownB = b0; changed();
          anim = tween({ dur:1600, step:function(t){ shownB = lerp(b0, b1, t); paint(); }, done:function(){ anim = null; shownB = null; changed(); MV.wait(500, done); } });
        } else runEng(function(){ MV.wait(300, done); });
      }
    },
    challenge:chal
  };
}

// ---------- @component S9 procedureLab (chromatography) — strip-in-beaker drawing for Part 3 ----------
// Strip 0–13 cm, 15 px per cm, bottom at y = 235; start line at 2 cm; pool surface at 1 cm; front ends at 12 cm (10.0 cm from the line).
var SPIN = [{ rf:0.95, tok:"--lp-carotene" }, { rf:0.70, tok:"--lp-xan" }, { rf:0.55, tok:"--lp-chla" }, { rf:0.40, tok:"--lp-chlb" }];
function cgY(cm){ return 235 - cm * 15; }
function stripSVG(o){
  var h = "", lift = o.lifted ? 2.5 : 0, x0 = o.x0 || 44, x1 = x0 + 36, xc = x0 + 18, pool = o.pool == null ? 1 : o.pool, fr = o.front;
  function yy(cm){ return cgY(cm + lift); }
  if (o.beaker !== false) h += sv("rect", { x:x0 - 26, y:cgY(pool), width:88, height:244 - cgY(pool), "class":"cg-pool" + (o.tint ? " tint" : "") });
  h += sv("line", { x1:x0 - 8, y1:yy(13) - 3, x2:x1 + 8, y2:yy(13) - 3, "class":"cg-rod" });
  h += sv("rect", { x:x0, y:yy(13), width:36, height:yy(0) - yy(13), "class":"cg-paper" });
  if (fr != null) h += sv("rect", { x:x0, y:yy(fr), width:36, height:yy(0) - yy(fr), "class":"cg-wet" });
  if (o.line) h += sv("line", { x1:x0 + 3, y1:yy(2), x2:x1 - 3, y2:yy(2), "class":"cg-line" + (o.line === "pen" ? " pen" : "") });
  if (o.dot) {
    var bands = o.bands || SPIN, moving = fr != null && fr > 2 && !o.tint;
    if (!moving) h += sv("ellipse", { cx:xc, cy:yy(2), rx:4.5, ry:3, style:"fill:var(--lp-chla)" });
    else bands.forEach(function(bd){
      var k = clamp((fr - 2) / 2.5, 0, 1), y = yy(2 + bd.rf * (fr - 2));
      h += sv("ellipse", { cx:xc, cy:y, rx:4 + 10 * k, ry:3.2, style:"fill:var(" + bd.tok + ");fill-opacity:" + f1((bd.a == null ? 1 : bd.a) * (0.35 + 0.65 * k) * 100) / 100 });
      if (o.rfLabels && fr >= 11.99) h += sv("text", { x:x1 + 3, y:y + 3.5, "class":"cg-tx" }, bd.rf.toFixed(2));
    });
    if (o.ink && moving) [0.3, 0.62].forEach(function(rf){ var iy = yy(2 + rf * (fr - 2)); h += sv("ellipse", { cx:xc, cy:iy, rx:13, ry:2.6, "class":"cg-ink" }) + sv("text", { x:x1 + 3, y:iy + 3.5, "class":"cg-tx" }, "ink"); });
  }
  if (o.mark) { h += sv("line", { x1:x0 + 2, y1:yy(12), x2:x1 - 2, y2:yy(12), "class":"cg-line" }); if (!o.rfLabels && o.frontText !== false) h += sv("text", { x:x1 + 3, y:yy(12) + 3.5, "class":"cg-tx" }, "front"); }
  if (o.lost) { h += sv("line", { x1:x0 + 2, y1:yy(12), x2:x1 - 2, y2:yy(12), "class":"cg-lost" }); h += sv("text", { x:x1 + 3, y:yy(12) + 4, "class":"cg-tx b" }, "?"); }
  if (o.beaker !== false) h += sv("path", { d:"M" + (x0 - 26) + " 128 V244 H" + (x0 + 62) + " V128", "class":"cg-glass" });
  return h;
}
function extractSVG(on){
  return sv("path", { d:"M114 196 Q134 226 154 196 Z", "class":"cg-bowl", style:on ? "fill:var(--lp-chla);fill-opacity:.55" : null }) + sv("line", { x1:146, y1:178, x2:136, y2:204, "class":"cg-pestle" }) +
    sv("text", { x:134, y:222, "class":"cg-tx", "text-anchor":"middle" }, on ? "extract" : "spinach");
}

// ---------- Part 3: paper chromatography (S9 procedure lab, Rf calculator with a data panel, autumn leaves) ----------
function part3(host, api){
  var C = api.content, S = api.S;
  S.done = S.done || []; S.mis = S.mis || 0; S.rf = S.rf || {}; S.rfOk = S.rfOk || {}; S.idOk = S.idOk || {}; S.autumn = !!S.autumn;
  var preview = null, msg1 = null, front = null, frontAnim = null, msg2 = {}, idMsg = {}, aFront = S.autumn ? 12 : null, aAnim = null;
  var menu = MV.shuffle(C.steps.map(function(s){ return { id:s.id, t:s.t }; }).concat(C.mistakes.map(function(m){ return { id:m.id, t:m.t, mis:true }; })), "cg-menu-02");
  function step(id){ return C.steps.filter(function(s){ return s.id === id; })[0]; }
  function mis(id){ return C.mistakes.filter(function(s){ return s.id === id; })[0]; }
  function done(id){ return S.done.indexOf(id) >= 0; }
  function ready(id){ return { grind:true, pencil:true, dot:done("grind") && done("pencil"), stand:done("dot"), rise:done("stand"), mark:done("rise") }[id]; }
  var pigName = {}; C.pigments.forEach(function(p){ pigName[p.id] = p.t; });
  var tok = { car:"--lp-carotene", xan:"--lp-xan", chla:"--lp-chla", chlb:"--lp-chlb" };
  host.innerHTML =
    '<div class="cg-st"><h3>Station 1: run the chromatogram</h3><p>Choose the next step from the list. Mistakes have visible consequences.</p><div class="cg-s1">' +
      '<figure class="cg-fig"><svg viewBox="0 0 160 250" id="cg-svg1" role="img"></svg><figcaption class="tiny muted" id="cg-cap1" aria-live="polite"></figcaption></figure>' +
      '<div><ol class="cg-log" id="cg-log"></ol><div class="cg-menu" id="cg-menu" role="group" aria-label="Choose the next step"></div><div id="cg-fb1" aria-live="polite"></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="cg-reset" data-k="cgreset">Start the lab again</button></div></div></div></div>' +
    '<div class="part cg-st"><h3>Station 2: calculate Rf</h3><p>Rf = distance moved by the pigment ÷ distance moved by the solvent, both measured from the start line. Give each answer to 2 decimal places.</p><div class="cg-s2">' +
      '<figure class="cg-fig"><svg viewBox="0 0 220 250" id="cg-svg2" role="img"></svg></figure><div><div class="cg-cards" id="cg-cards"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="cg-check" data-k="cgchk">Check Rf values</button></div><div id="cg-fb2" aria-live="polite"></div>' +
      '<details class="alg" id="cg-data"><summary>Check it with data</summary><div id="cg-datab"></div></details></div></div></div>' +
    '<div class="part cg-st"><h3>Station 3: the autumn leaf</h3><p>Chromatograms of a summer sugar maple leaf, an autumn (yellow) sugar maple leaf and an autumn red maple leaf, run side by side in the same solvent.</p>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="cg-arun" data-k="cgarun">Run the three chromatograms</button></div><div class="cg-s3" id="cg-s3"></div><div id="cg-anote" aria-live="polite"></div></div>';
  // ---- Station 1 ----
  function s1state(){
    var o = { extract:done("grind"), line:done("pencil") ? "pencil" : null, dot:done("dot"), lifted:!done("stand"), front:null, mark:done("mark") };
    if (done("stand")) o.front = done("rise") ? 12 : 1;
    if (front != null) o.front = front;
    if (done("mark")) o.lifted = true;
    if (preview === "pen") o = { extract:true, line:"pen", dot:true, lifted:false, front:12, ink:true };
    if (preview === "below") o = { extract:true, line:"pencil", dot:true, lifted:false, front:12, pool:3, tint:true };
    if (preview === "nomark") o = { extract:true, line:"pencil", dot:true, lifted:true, front:12, lost:true };
    return o;
  }
  function paint1(){
    var o = s1state();
    $("#cg-svg1").innerHTML = stripSVG(o) + extractSVG(o.extract);
    var cap = preview ? "What would happen: " + mis(preview).fb : S.done.length === 6 ? "Finished chromatogram: four bands, front marked." : frontAnim ? "The solvent is rising…" : "Your strip so far.";
    $("#cg-cap1").textContent = cap;
    $("#cg-svg1").setAttribute("aria-label", preview ? "Mistake shown: " + MV.plain(mis(preview).fb) : "Chromatography strip. Steps done: " + (S.done.length ? S.done.map(function(id){ return MV.plain(step(id).done); }).join(" ") : "none yet."));
    $("#cg-log").innerHTML = S.done.map(function(id){ return "<li>" + step(id).t + "</li>"; }).join("");
    MV.keepFocus($("#cg-menu"), function(){
      $("#cg-menu").innerHTML = menu.map(function(m){
        var d = m.mis ? done(mis(m.id).at) : done(m.id);
        return '<button type="button" class="cg-opt' + (d && !m.mis ? " done" : "") + '" data-st="' + m.id + '" data-k="cg' + m.id + '"' + (d || frontAnim ? " disabled" : "") + ">" + (d && !m.mis ? '<span class="cg-ck" aria-hidden="true">✓</span>' : "") + "<span>" + m.t + (d && !m.mis ? '<span class="vh"> (done)</span>' : "") + "</span></button>";
      }).join("");
    });
    $("#cg-fb1").innerHTML = msg1 ? MV.fbHTML(msg1.k, msg1.h) : "";
  }
  function choose(id){
    var st = step(id), m = mis(id);
    if (st) {
      if (!ready(id)) { preview = null; msg1 = { k:"bad", h:"<strong>✗ " + st.need + "</strong>" }; return; }
      preview = null; S.done.push(id); msg1 = { k:"good", h:"<strong>✓ " + st.done + "</strong>" };
      if (id === "rise") {
        front = 1; msg1 = { k:"", h:"The solvent is rising…" };
        frontAnim = tween({ dur:2600, ease:lin, step:function(t){ front = 1 + 11 * t; paint1(); }, done:function(){ frontAnim = null; front = null; msg1 = { k:"good", h:"<strong>✓ " + st.done + "</strong>" }; paint1(); } });
      }
      if (S.done.length === 6) msg1.h += " Chromatogram finished: four bands separated. Measure them in Station 2.";
    } else if (m) {
      if (!ready(m.at)) { preview = null; msg1 = { k:"bad", h:"<strong>✗ " + step(m.at).need + "</strong>" }; return; }
      preview = m.id; S.mis++; msg1 = { k:"bad", h:"<strong>✗ " + m.fb + "</strong> The picture shows what would happen. Choose another step." };
    }
  }
  // ---- Station 2 ----
  function svg2(){
    var h = stripSVG({ x0:90, beaker:false, line:"pencil", dot:true, front:12, mark:true, frontText:false }), x = 62, yl = cgY(2);
    h += sv("rect", { x:x - 7, y:cgY(12.3), width:14, height:yl - cgY(12.3) + 6, "class":"cg-ruler" });
    for (var cm = 0; cm <= 10; cm++) { var y = cgY(2 + cm); h += sv("line", { x1:x + 7, y1:y, x2:x + (cm % 2 ? 2 : -1), y2:y, "class":"cg-tick" }); if (cm % 2 === 0) h += sv("text", { x:x - 10, y:y + 3.5, "class":"cg-tx", "text-anchor":"end" }, String(cm)); }
    h += sv("text", { x:x - 10, y:cgY(12.3) - 4, "class":"cg-tx", "text-anchor":"end" }, "cm");
    var labs = [[12, "front: 10.0 cm", cgY(12) - 9]].concat(C.bands.map(function(b, i){ return [2 + b.d, (i + 1) + ": " + b.d.toFixed(1) + " cm", cgY(2 + b.d) + (i === 0 ? 3 : 0)]; }));
    labs.forEach(function(L){ h += sv("path", { d:"M128 " + f1(cgY(L[0])) + " L138 " + f1(L[2]) + " H142", "class":"cg-lead" }) + sv("text", { x:144, y:L[2] + 3.5, "class":"cg-tx" }, L[1]); });
    $("#cg-svg2").innerHTML = h;
    $("#cg-svg2").setAttribute("aria-label", "Finished chromatogram beside a ruler that starts at the pencil line. Solvent front 10.0 cm from the line. Band 1, yellow-orange, 9.5 cm; band 2, yellow, 7.0 cm; band 3, blue-green, 5.5 cm; band 4, yellow-green, 4.0 cm.");
  }
  function allRf(){ return C.bands.every(function(b){ return S.rfOk[b.id]; }); }
  function paint2(){
    MV.keepFocus($("#cg-cards"), function(){
      $("#cg-cards").innerHTML = C.bands.map(function(b, i){
        var ok = S.rfOk[b.id], h = '<div class="cg-card"><p class="cg-bh"><i class="cg-sw" style="background:var(' + tok[b.pig] + ')"></i><strong>Band ' + (i + 1) + "</strong> · " + b.col + " · " + b.d.toFixed(1) + " cm</p>" +
          '<div class="cg-in"><label for="cg-rf-' + b.id + '">Rf =</label><input class="numin" id="cg-rf-' + b.id + '" data-rf="' + b.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(S.rf[b.id] || "") + '"' + (ok ? " disabled" : "") + ">" + (ok ? ' <span class="cg-okm">✓</span>' : "") + "</div>";
        if (msg2[b.id] && !ok) h += '<p class="cg-msg">' + msg2[b.id] + "</p>";
        if (allRf()) {
          var got = S.idOk[b.id];
          h += '<div class="cg-id" role="group" aria-label="Which pigment is band ' + (i + 1) + '?"><span class="rg-lab">Which pigment?</span>' + C.pigments.map(function(p){
            return '<button type="button" class="chip' + (got === p.id ? " on" : "") + '" data-id="' + b.id + '" data-p="' + p.id + '" data-k="cgid' + b.id + p.id + '" aria-pressed="' + (got === p.id) + '"' + (got ? " disabled" : "") + ">" + p.t + "</button>";
          }).join("") + "</div>";
          if (got) h += '<p class="cg-msg good">✓ ' + pigName[got] + ": Rf " + MV.ans(b).toFixed(2) + ", " + b.col + ".</p>";
          else if (idMsg[b.id]) h += '<p class="cg-msg">' + idMsg[b.id] + "</p>";
        }
        return h + "</div>";
      }).join("");
    });
    $("#cg-check").disabled = allRf();
    $("#cg-datab").innerHTML = allRf() ? '<p class="tiny"><span class="bio-model">Model data</span> ' + C.rfNote + "</p>" + MV.tableHTML({ head:["Pigment", "Colour", "Rf"], rows:C.pigments.map(function(p){ return ['<i class="cg-sw" style="background:var(' + tok[p.id] + ')"></i>' + p.t, p.col, p.rf]; }), caption:"Leaf pigments and their Rf values in this set-up" }) +
      "<p><strong>Why they separate:</strong> " + C.whySep + "</p>" : "<p>Calculate all four Rf values first. Then compare them with the pigment data here.</p>";
  }
  function parse(v){ var s = String(v == null ? "" : v).trim().replace(/,/g, "."); var r = s ? MV.parseNum(s) : null; return r && r.length === 1 ? r[0] : null; }
  function check2(){
    C.bands.forEach(function(b){
      if (S.rfOk[b.id]) return;
      var v = parse(S.rf[b.id]), ans = MV.ans(b);
      if (v == null) { msg2[b.id] = "✗ Enter a decimal such as 0.50."; return; }
      if (Math.abs(v - ans) < 0.0051) { S.rfOk[b.id] = true; msg2[b.id] = null; return; }
      if (v > 1) msg2[b.id] = "✗ " + C.m5;
      else msg2[b.id] = "✗ Divide this band’s distance by the solvent front’s: " + b.d.toFixed(1) + " ÷ 10.0.";
      if (Math.abs(v - b.d) < 0.01) msg2[b.id] = "✗ That’s the distance. Divide it by the solvent front’s distance (10.0 cm).";
    });
    var fb = allRf() ? MV.fbHTML("good", "<strong>✓ All four Rf values are right.</strong> Now open <strong>Check it with data</strong> and identify each band.") : MV.fbHTML("bad", "<strong>✗ Not yet.</strong> Read the note under each band, then try again.");
    $("#cg-fb2").innerHTML = fb; if (allRf()) $("#cg-data").open = true;
  }
  // ---- Station 3 ----
  var AUT = [
    { id:"sum", name:"Summer sugar maple", bands:[{ rf:0.95, tok:"--lp-carotene", a:0.9 }, { rf:0.70, tok:"--lp-xan", a:0.75 }, { rf:0.55, tok:"--lp-chla", a:1 }, { rf:0.40, tok:"--lp-chlb", a:0.95 }], cap:"Strong chlorophyll bands, with the carotenoid bands above them." },
    { id:"yel", name:"Autumn sugar maple (yellow)", bands:[{ rf:0.95, tok:"--lp-carotene", a:1 }, { rf:0.70, tok:"--lp-xan", a:1 }, { rf:0.55, tok:"--lp-chla", a:0.16 }, { rf:0.40, tok:"--lp-chlb", a:0.14 }], cap:"Strong 0.95 and 0.70 bands; faint chlorophyll bands." },
    { id:"red", name:"Autumn red maple", bands:[{ rf:0.95, tok:"--lp-carotene", a:1 }, { rf:0.70, tok:"--lp-xan", a:1 }, { rf:0.55, tok:"--lp-chla", a:0.16 }, { rf:0.40, tok:"--lp-chlb", a:0.14 }, { rf:0, tok:"--lp-antho", a:1 }], cap:"The same, plus a red band that stays at the start line." }
  ];
  function paint3(){
    var fr = aFront, ranDone = fr != null && fr >= 12;
    $("#cg-s3").innerHTML = AUT.map(function(s){
      var aria = s.name + ". " + (ranDone ? s.cap : fr != null ? "Running." : "Not run yet: one spot of extract on the start line.");
      return '<figure class="cg-fig3"><svg viewBox="0 0 110 250" role="img" aria-label="' + MV.esc(aria) + '">' + stripSVG({ x0:34, line:"pencil", dot:true, front:fr == null ? 1 : fr, mark:ranDone, bands:s.bands, rfLabels:true, beaker:!ranDone }) + "</svg><figcaption><strong>" + s.name + "</strong>" + (ranDone ? '<span class="tiny">' + s.cap + "</span>" : "") + "</figcaption></figure>";
    }).join("");
    $("#cg-anote").innerHTML = ranDone ? '<div class="refresh"><p><i class="cg-sw" style="background:var(--lp-antho)"></i><strong>The red band (Rf 0.00):</strong> ' + C.autumnNote + "</p><p class=\"tiny\">" + C.notPhoto + "</p></div>" : "";
    $("#cg-arun").disabled = !!aAnim;
  }
  function runAutumn(){
    if (aAnim) return; aFront = 1; paint3();
    aAnim = tween({ dur:2600, ease:lin, step:function(t){ aFront = 1 + 11 * t; paint3(); }, done:function(){ aAnim = null; aFront = 12; S.autumn = true; api.save(); paint3(); } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.st) { choose(b.dataset.st); api.save(); paint1(); MV.focusFb($("#cg-fb1").parentNode); }
    else if (b.id === "cg-reset") { if (frontAnim) { frontAnim(); frontAnim = null; } front = null; preview = null; S.done = []; msg1 = null; api.save(); paint1(); }
    else if (b.id === "cg-check") { check2(); api.save(); paint2(); MV.focusFb($("#cg-fb2").parentNode); }
    else if (b.dataset.id) {
      var band = C.bands.filter(function(x){ return x.id === b.dataset.id; })[0];
      if (b.dataset.p === band.pig) { S.idOk[band.id] = band.pig; idMsg[band.id] = null; }
      else idMsg[band.id] = "✗ Not quite. Compare this band’s colour and Rf (" + MV.ans(band).toFixed(2) + ") with the data panel.";
      api.save(); paint2();
    } else if (b.id === "cg-arun") runAutumn();
  });
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.rf; if (!id) return; S.rf[id] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.rf) { e.preventDefault(); $("#cg-check").click(); } });
  paint1(); svg2(); paint2(); paint3();
}

// ---------- Practice 1: read the spectra (@component N8 spectrumTap — tap a wavelength or move the probe slider; chips) ----------
function spectraAct(host, api, a){
  var S = api.S; S.i = Math.min(S.i || 0, a.items.length - 1); S.items = S.items || {};
  var msg = {}, F = MV.C.explore.filters;
  host.innerHTML = '<div class="pred-top"><span class="tiny muted" id="rs-n"></span><span class="dots" id="rs-dots" aria-hidden="true"></span></div><p class="pred-q" id="rs-q"></p>' +
    '<div class="lp-rs"><div><div class="plot-wrap"><canvas class="plot" id="rs-plot" role="img"></canvas></div>' +
    '<label class="slider lp-sl" id="rs-slw"><span class="slider-top"><span>Your point</span><output id="rs-out" for="rs-x"></output></span><input type="range" id="rs-x" min="380" max="750" step="1"><span class="tiny muted">Tap or drag on the graph, or use the arrow keys (Shift + arrow: 10 nm).</span></label></div>' +
    '<div><div id="rs-chips"></div><div class="q-actions" id="rs-act"></div><div id="rs-hints"></div><div id="rs-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="rs-prev" data-k="rsprev">Previous</button><button type="button" class="btn ghost sm" id="rs-next" data-k="rsnext">Next question</button></div></div></div>';
  var cv = $("#rs-plot", host), plot = new MV.Plot(cv, { xmin:360, xmax:760, ymin:-30, ymax:130 }), slider = $("#rs-x", host);
  function it(){ return a.items[S.i]; }
  function ist(){ var q = it(); return S.items[q.id] || (S.items[q.id] = { x:560, moved:false, pick:null, tries:0, hint:0, solved:false, first:null }); }
  function render(){
    var q = it(), x = ist(), o = { pig:{ a:true, b:true, c:true } };
    if (q.kind === "tap") { o.marker = { l:x.x, dots:false, tag:x.x + " nm" }; o.describe = "Absorption spectra of chlorophyll a (solid), chlorophyll b (dashed) and carotenoids, 380 to 750 nm. Your point: " + x.x + " nm."; }
    else {
      if (q.mark) o.marker = { l:q.mark, dots:false, tag:q.mark + " nm" };
      if (q.band) o.band = q.band;
      if (q.action) { o.faint = true; o.action = { pts:F.map(function(f){ return { nm:f.nm, b:f.bubbles }; }) }; }
      o.describe = "Absorption spectra of chlorophyll a (solid), chlorophyll b (dashed) and carotenoids, 380 to 750 nm" + (q.mark ? ", with a line at " + q.mark + " nm" : "") + (q.action ? ", with the Elodea action spectrum (bubbles per minute: " + F.map(function(f){ return f.nm + " nm " + f.bubbles; }).join(", ") + ")" : "") + (q.band ? "; 610 to 660 nm is shaded" : "") + ".";
    }
    specRender(plot, o);
  }
  plot.render = render;
  function setX(v){ var x = ist(); if (x.solved) return; x.x = clamp(v, 380, 750); x.moved = true; msg[it().id] = null; api.save(); paint(); }
  var drag = false;
  cv.addEventListener("pointerdown", function(e){ if (it().kind !== "tap") return; drag = true; try { cv.setPointerCapture(e.pointerId); } catch (err) {} setX(lamFromEvent(plot, e)); });
  cv.addEventListener("pointermove", function(e){ if (drag) setX(lamFromEvent(plot, e)); });
  cv.addEventListener("pointerup", function(){ drag = false; }); cv.addEventListener("pointercancel", function(){ drag = false; });
  slider.addEventListener("input", function(){ setX(+slider.value); });
  slider.addEventListener("keydown", function(e){ if (!e.shiftKey) return; var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 10 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -10 : 0; if (!d) return; e.preventDefault(); setX(ist().x + d); });
  function judge(){
    var q = it(), x = ist().x, r = MV.ans(q);
    if (x >= r[0] && x <= r[1]) return { ok:true };
    var nm = (q.near || []).filter(function(n){ return Math.abs(x - n.at) <= n.tol; })[0];
    if (nm) return { ok:false, msg:nm.fb };
    if (q.values) {
      if (x < 480 || x > 680) return { ok:false, msg:"Choose a wavelength between 480 and 680 nm." };
      var best = PK.reduce(function(m, k){ return A(k, x) > A(m, x) ? k : m; }, "a");
      return { ok:false, msg:MV.cap(PIG[best].html) + (best === "c" ? " absorb " : " absorbs ") + R(A(best, x)) + " there." };
    }
    return { ok:false, msg:q.miss || "That point isn’t on the peak named in the question." };
  }
  function paint(){
    var q = it(), x = ist(), tap = q.kind === "tap";
    $("#rs-n", host).textContent = "Question " + (S.i + 1) + " of " + a.items.length;
    $("#rs-dots", host).innerHTML = a.items.map(function(z, i){ var y = S.items[z.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#rs-q", host).innerHTML = q.prompt;
    $("#rs-slw", host).hidden = !tap; slider.value = x.x; slider.disabled = x.solved; $("#rs-out", host).textContent = x.x + " nm"; slider.setAttribute("aria-valuetext", x.x + " nm, " + cname(x.x));
    MV.keepFocus($("#rs-chips", host), function(){
      $("#rs-chips", host).innerHTML = tap ? "" : '<div class="chips lp-rschips" role="group" aria-label="Choices">' + q.choices.map(function(c, i){
        var cls = "chip" + (x.pick === i ? " on" : ""); return '<button type="button" class="' + cls + '" data-ci="' + i + '" data-k="rs' + q.id + i + '" aria-pressed="' + (x.pick === i) + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>";
      }).join("") + "</div>";
    });
    MV.keepFocus($("#rs-act", host), function(){ $("#rs-act", host).innerHTML = (tap && !x.solved ? '<button type="button" class="btn primary sm" id="rs-check" data-k="rschk"' + (x.moved ? "" : " disabled") + ">Check</button>" : "") + (x.solved ? "" : MV.hintBtn("rsh" + q.id, x.hint)); });
    $("#rs-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(q.hints, x.hint);
    $("#rs-fb", host).innerHTML = x.solved ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + q.why + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : (msg[q.id] ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg[q.id] + " Try again.") : "");
    $("#rs-prev", host).disabled = S.i === 0; $("#rs-next", host).disabled = S.i === a.items.length - 1;
    render();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = it(), x = ist(), r;
    if (b.id === "rs-prev" || b.id === "rs-next") { S.i += b.id === "rs-prev" ? -1 : 1; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id === "rs-check") r = judge();
    else if (b.dataset.ci != null) { x.pick = +b.dataset.ci; r = MV.ok(q.choices[x.pick]) ? { ok:true } : { ok:false, msg:q.fb }; }
    else return;
    if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[q.id] = null; } else { x.tries++; msg[q.id] = r.msg; }
    api.save(); paint(); MV.focusFb(host);
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(q){ var y = S.items[q.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(q){ var y = S.items[q.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(q.goal)); }); return g; }
  };
}

// ---------- Practice 2: light experiments (N4 number entry, N7 select all, choice; adapted from SBI4U 01 investigations) ----------
function experiments(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", pick:{}, choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function parseVal(raw){
    var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Z].*$/, "").replace(/\s/g, "");
    var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
  }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
    else {
      h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
      if (it.kind === "num") {
        h += '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="lp-unit">' + it.unit + "</span></div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
      } else {
        h += '<div class="opts" role="group" aria-label="Options (select all that apply)">' + it.options.map(function(o, oi){
          var on = !!x.pick[oi], c = "opt sa-opt", good = MV.ok(o);
          if (x.checked) { if (on && good) c += " right"; else if (on && !good) c += " wrong"; else if (!on && good && x.solved) c += " right"; }
          return '<button type="button" class="' + c + '" role="checkbox" aria-checked="' + on + '" data-k="' + it.id + "o" + oi + '" data-oi="' + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>";
        }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.checked) {
          var lines = it.options.map(function(o, oi){ var on = !!x.pick[oi], good = MV.ok(o); if (on && !good) return "<p>✗ " + o.t + ": " + o.why + "</p>"; if (!on && good && !x.solved) return "<p>○ One more option belongs in your selection.</p>"; return ""; }).filter(Boolean);
          lines = lines.filter(function(l, k){ return lines.indexOf(l) === k; });
          h += x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + it.why + "</p></div>" : '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> Your selection isn’t right yet.</p>' + lines.join("") + "</div>";
        }
      }
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = item(box.dataset.li), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (it.kind === "mc" && b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (it.kind === "sel" && b.dataset.oi != null) { var oi = +b.dataset.oi; x.pick[oi] = !x.pick[oi]; x.checked = false; }
    else if (b.dataset.act === "check") {
      var ok = false;
      if (it.kind === "mc") { x.checked = true; ok = MV.ok(it.options[x.choice]); }
      else if (it.kind === "sel") { x.checked = true; ok = it.options.every(function(o, k){ return !!x.pick[k] === MV.ok(o); }); }
      else {
        var v = parseVal(x.val), ans = MV.ans(it), tol = it.tol || 1e-6;
        if (v == null) { msgs[it.id] = "Enter a number, such as 12, 0.5 or 3/4."; paintItem(it); return; }
        ok = Math.abs(v - ans) <= tol * Math.max(1, Math.abs(ans));
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return Math.abs(v - w.match) <= (w.tol || 1e-6) * Math.max(1, Math.abs(w.match)); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : "Check your working.") + " Try again."; }
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

// ---------- Performance task: design a grow-light ----------
var task = (function(){
  var api = null, T = null, plot = null;
  function lamps(){ var s = api ? api.S : {}; return (T ? T.lamps : []).filter(function(nm){ return !!s["l" + nm]; }); }
  function read(){ var L = lamps(); return { lamps:L, total:L.reduce(function(t, nm){ return t + bubOf(nm); }, 0), watts:L.length * T.watts }; }
  function name(nm){ var f = MV.C.explore.filters.filter(function(x){ return x.nm === nm; })[0]; return f ? f.name : ""; }
  function draw(){
    var d = read();
    specRender(plot, { pig:{ a:true, b:true, c:true }, faint:true, labels:false, lamps:d.lamps.map(function(nm){ return { nm:nm, b:bubOf(nm) }; }),
      describe:"Your grow-light: " + (d.lamps.length ? d.lamps.map(function(nm){ return nm + " nm (" + bubOf(nm) + " bubbles per minute)"; }).join(", ") : "no lamps on") + ", over faint absorption curves of the three pigments. Total " + d.total + " bubbles per minute; " + d.watts + " W." });
    var tw = Math.min(100, d.total / 100 * 100), pw = Math.min(100, d.watts / 175 * 100);
    $("#gl-m").innerHTML = '<div class="lp-meter"><span class="lp-meter-l">Total: <strong>' + d.total + ' bubbles/min</strong> <span class="muted">(at least ' + T.target + ")</span></span><span class=\"lp-meter-t\"><i style=\"width:" + f1(tw) + '%"></i><b class="lp-aim" style="left:' + T.target + '%"></b></span></div>' +
      '<div class="lp-meter"><span class="lp-meter-l">Power: <strong>' + d.watts + " W</strong> <span class=\"muted\">(at most " + T.budget + " W)</span></span><span class=\"lp-meter-t\"><i style=\"width:" + f1(pw) + '%"></i><b class="lp-aim" style="left:' + f1(T.budget / 175 * 100) + '%"></b></span></div>';
  }
  function key(d){ return d.lamps.join("+"); }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      inp.innerHTML = '<div class="gl-in"><span class="rg-lab">Lamps (25 W each)</span><div class="lp-tgs" role="group" aria-label="Lamps">' + T.lamps.map(function(nm){
        return '<button type="button" class="lp-tg" data-lamp="' + nm + '" data-k="gl' + nm + '" aria-pressed="' + !!a.S["l" + nm] + '"><i class="lp-sw" style="background:' + specRGB(nm) + '"></i><span>' + nm + " nm " + name(nm) + "</span></button>";
      }).join("") + "</div></div>";
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="gl-plot" role="img"></canvas></div><p class="tiny muted lp-legend">' + T.legend + '</p><div id="gl-m"></div>';
      plot = new MV.Plot($("#gl-plot"), { xmin:360, xmax:760, ymin:-30, ymax:130 }); plot.render = draw;
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-lamp]"); if (!b) return; var k = "l" + b.dataset.lamp; a.S[k] = !a.S[k]; b.setAttribute("aria-pressed", String(!!a.S[k])); a.save(); draw(); a.update(); });
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var st = MV.taskState(), g = $("#task-fb .fb.good"); if (!g || st.found.length < 3) return;
        $$("p", g).forEach(function(q){ if (q.innerHTML.indexOf(T.more) >= 0) q.innerHTML = q.innerHTML.replace(T.more, T.allFound); });
      }, 0); });
    },
    read:read,
    valid:function(d){ return d.lamps.length ? true : "Turn on at least one lamp."; },
    checks:function(d){ return [d.lamps.indexOf(660) >= 0, d.total >= T.target, d.watts <= T.budget]; },
    key:key,
    label:function(k){ return k.split("+").join(" + ") + " nm"; },
    text:function(k){ var t = k.split("+").reduce(function(s, nm){ return s + bubOf(+nm); }, 0); return k.split("+").join(" + ") + " nm, " + t + " bubbles/min"; }
  };
})();

// ---------- hero: white light → prism → rainbow; a leaf slides in, absorbs violet-blue and red, reflects green; curve ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var p = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), st = { t:MV.reduceMotion ? 5 : 0 };
  var CAPS = ["White light is a mix of colours.", "A prism fans it into a rainbow, from violet (≈ 400 nm) to red (≈ 700 nm).", "A leaf slides into the rainbow…", "…and absorbs the violet-blue and red. The green bounces off to your eye.", "Chlorophyll " + "<i>a</i>" + "’s absorption: high over violet-blue and red, low over green."];
  p.render = function(){ p.draw({ grid:false, axes:false, after:function(ctx){ heroDraw(ctx, p.W, p.H, st.t); } }); };
  function cap(){ if (f.cap) f.cap.innerHTML = CAPS[clamp(Math.floor(st.t + 0.001), 0, 4)]; }
  cap(); p.render();
  if (MV.reduceMotion) return;
  var last = -1;
  MV.wait(300, function(){ MV.tween({ dur:7200, ease:lin, step:function(t){ st.t = 5 * t; p.render(); var k = Math.floor(st.t); if (k !== last) { last = k; cap(); } }, done:function(){ st.t = 5; p.render(); cap(); } }); });
}
function heroDraw(ctx, W, H, t){
  var K = { ink:css("--ink"), ink2:css("--ink-2"), sheet:css("--sheet"), leaf:css("--leaf"), lf:css("--leaf-fill"), le:css("--leaf-edge") };
  function ph(a){ return MV.ease(clamp(t - a, 0, 1)); }
  var small = W < 420, fs = small ? 11 : 13;
  var prism = [[0.20 * W, 0.04 * H], [0.08 * W, 0.40 * H], [0.32 * W, 0.40 * H]];
  var inP = [0.14 * W, 0.22 * H], ex = [0.255 * W, 0.235 * H], endX = 0.80 * W, yRed = 0.07 * H, yVio = 0.57 * H;
  var leafX = 0.62 * W, curLeaf = lerp(1.2 * W, leafX, ph(2)), leafShown = t > 2;
  // prism
  ctx.save(); ctx.beginPath(); ctx.moveTo(prism[0][0], prism[0][1]); ctx.lineTo(prism[1][0], prism[1][1]); ctx.lineTo(prism[2][0], prism[2][1]); ctx.closePath();
  ctx.fillStyle = K.sheet; ctx.fill(); ctx.strokeStyle = K.ink2; ctx.lineWidth = 1.8; ctx.stroke(); ctx.restore();
  // white beam (ink outline, light inside)
  var bk = ph(0), bx = lerp(0, inP[0], bk), by = lerp(0.17 * H, inP[1], bk);
  ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = K.ink; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0.17 * H); ctx.lineTo(bx, by); ctx.stroke();
  ctx.strokeStyle = K.sheet; ctx.lineWidth = 4; ctx.stroke();
  if (bk >= 1) { ctx.strokeStyle = K.ink; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(inP[0], inP[1]); ctx.lineTo(ex[0], ex[1]); ctx.stroke(); ctx.strokeStyle = K.sheet; ctx.lineWidth = 4; ctx.stroke(); }
  ctx.fillStyle = K.ink2; ctx.font = fontUI(fs, "700"); ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("white light", 4, 0.17 * H - 7);
  ctx.restore();
  // rainbow fan
  var fk = ph(1);
  function rayEnd(l){ return [endX, lerp(yVio, yRed, (l - 380) / 370)]; }
  function reflectAmt(l){ var m = Math.max(A("a", l), A("b", l), A("c", l)); return 1 - Math.min(1, m / 40); }
  var eye = [0.40 * W, 0.62 * H];
  if (fk > 0) for (var l = 385; l <= 745; l += 10) {
    var e = rayEnd(l), sMax = fk, sLeaf = (curLeaf - ex[0]) / (e[0] - ex[0]), s = Math.min(sMax, leafShown ? sLeaf : 1), r = reflectAmt(l);
    var alpha = 1 - (1 - r) * 0.88 * ph(3);
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = specRGB(l); ctx.lineWidth = small ? 2.6 : 3.4;
    ctx.beginPath(); ctx.moveTo(ex[0], ex[1]); ctx.lineTo(lerp(ex[0], e[0], s), lerp(ex[1], e[1], s)); ctx.stroke(); ctx.restore();
    if (t > 3 && r > 0.15) {   // reflected green toward the eye
      var hx = lerp(ex[0], e[0], sLeaf) - 4, hy = lerp(ex[1], e[1], sLeaf), rk = ph(3);
      ctx.save(); ctx.globalAlpha = r * 0.9; ctx.strokeStyle = specRGB(l); ctx.lineWidth = small ? 1.8 : 2.4;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(lerp(hx, eye[0] + 12, rk), lerp(hy, eye[1] - 4, rk)); ctx.stroke(); ctx.restore();
    }
  }
  // leaf
  if (leafShown) {
    var top = lerp(ex[1], yRed, (leafX - ex[0]) / (endX - ex[0])) - 0.03 * H, bot = lerp(ex[1], yVio, (leafX - ex[0]) / (endX - ex[0])) + 0.03 * H, cx = curLeaf + 0.03 * W, rx = 0.05 * W;
    ctx.save(); ctx.translate(cx, (top + bot) / 2); ctx.rotate(-0.12);
    var hh = (bot - top) / 2;
    ctx.beginPath(); ctx.moveTo(0, -hh); ctx.quadraticCurveTo(rx * 1.9, 0, 0, hh); ctx.quadraticCurveTo(-rx * 1.9, 0, 0, -hh); ctx.closePath();
    ctx.fillStyle = K.sheet; ctx.fill();
    ctx.shadowColor = K.leaf; ctx.shadowBlur = 22 * ph(3); ctx.globalAlpha = 0.35 + 0.6 * ph(3); ctx.fillStyle = K.leaf; ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1; ctx.strokeStyle = K.le; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = K.sheet; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, -hh + 6); ctx.lineTo(0, hh + 14); ctx.stroke();
    ctx.restore();
    if (t > 3) { ctx.save(); ctx.globalAlpha = ph(3); ctx.fillStyle = K.ink; ctx.font = fontUI(fs, "700"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText("absorbed:", cx + rx + 6, top + 0.06 * H); ctx.fillText("violet-blue, red", cx + rx + 6, top + 0.06 * H + fs + 3); ctx.restore(); }
  }
  // eye
  if (t > 3) {
    var ek = ph(3), ew = small ? 22 : 30, eh = ew * 0.45;
    ctx.save(); ctx.globalAlpha = ek; ctx.translate(eye[0], eye[1]); ctx.strokeStyle = K.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-ew / 2, 0); ctx.quadraticCurveTo(0, -eh, ew / 2, 0); ctx.quadraticCurveTo(0, eh, -ew / 2, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, eh * 0.45, 0, 2 * Math.PI); ctx.fillStyle = K.ink; ctx.fill();
    ctx.fillStyle = K.ink; ctx.font = fontUI(fs, "700"); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText("green reaches", -ew / 2 - 6, -fs * 0.6); ctx.fillText("your eye", -ew / 2 - 6, fs * 0.6);
    ctx.restore();
  }
  // spectrum band with chlorophyll a's absorption curve
  var bx0 = 0.06 * W, bx1 = 0.96 * W, b0 = 0.88 * H, bh = 0.055 * H, ca = 0.70 * H, bandK = ph(1);
  function BX(l){ return lerp(bx0, bx1, (l - 380) / 370); }
  ctx.save(); ctx.globalAlpha = bandK;
  for (var px = Math.floor(bx0); px < bx1; px++) { ctx.fillStyle = specRGB(lerp(380, 750, (px + 0.5 - bx0) / (bx1 - bx0))); ctx.fillRect(px, b0, 1.5, bh); }
  ctx.strokeStyle = K.ink2; ctx.lineWidth = 1; ctx.strokeRect(bx0 + 0.5, b0 + 0.5, bx1 - bx0 - 1, bh);
  ctx.fillStyle = K.ink2; ctx.font = fontUI(small ? 10 : 12); ctx.textAlign = "center"; ctx.textBaseline = "top";
  [400, 500, 600, 700].forEach(function(v){ ctx.fillText(v + (v === 700 ? " nm" : ""), BX(v), b0 + bh + 2); });
  ctx.restore();
  var ck = ph(4);
  if (ck > 0) {
    var top2 = ca - 0.0 * H, hgt = b0 - 4 - top2 + 0.0 * H, lEnd = lerp(380, 750, ck);
    ctx.save(); ctx.strokeStyle = K.ink; ctx.lineWidth = small ? 2.4 : 3; ctx.lineJoin = "round"; ctx.beginPath();
    for (var q = 380; q <= lEnd; q += 2) { var yy = b0 - 3 - A("a", q) / 100 * (b0 - 3 - ca); if (q === 380) ctx.moveTo(BX(q), yy); else ctx.lineTo(BX(q), yy); }
    ctx.stroke();
    ctx.globalAlpha = ck; pigLabel(ctx, "a", BX(470), ca + 6, "left", small, K.ink);
    ctx.font = fontUI(small ? 10 : 12, "700"); ctx.fillStyle = K.ink2; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("absorbs little green", BX(545), b0 - 6);
    ctx.restore();
    void hgt;
  }
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ spectra:spectraAct, experiments:experiments },
  task:task,
  onShow:function(v){ if (EXP) EXP.show(v === "explore"); }
});
})();
