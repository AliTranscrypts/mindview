// MDM4U 23 The Hypergeometric Distribution: hero (an urn of 4 blue and 6 grey balls; 3 drawn one at a time; the card
// C(4, 2) × C(6, 1) = 36 out of 120; the histogram 20, 60, 36, 4 out of 120), Draw without replacement (Explore: urn + D7
// histogram in hypergeometric mode with binomial overlay, Big population ×1/×10/×100, Draw / Draw 100 seeded), Quality
// control (Part 3: three acceptance-sampling stations), Count it (N4 entry with a fill-in-the-combination item) and the
// Inspection plan task. Probabilities are exact fractions of combinations when the group is small; Big population readouts
// multiply the factors directly. Every draw is seeded (MV.mdm.seededRandom), so the same settings give the same results.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;
function M(s){ return MV.m(s); }
function C(n, r){ return MV.mdm.nCr(n, r); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function dec(v, dp){ var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/0+$/, "").replace(/\.$/, ""); if (s === "-0") s = "0"; return s.replace("-", MV.MINUS); }
function d4(v){ return dec(v, 4); }
function d3(v){ return dec(v, 3); }
function exact4(v){ return Math.abs(Math.round(v * 1e4) / 1e4 - v) < 1e-12; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function isDark(){ var c = css("--sheet"), m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c); if (!m) return false; return (parseInt(m[1], 16) + parseInt(m[2], 16) + parseInt(m[3], 16)) / 3 < 110; }
function fmt(v){ return MV.mdm.fmt(v); }

// @component radioGroup (copied from MDM4U 21 / 18) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh, setOptions}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) || ids.indexOf(val) < 0 ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector('[tabindex="0"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint,
    setOptions:function(list){ o.options = list; paint(); } };
}

// @component D7 distChart — hypergeometric version (adapted from MDM4U 21's distChart) on the toolkit's Plot engine with its
// own axes: solid bars (--pen) of width 1 on each value; outlined comparison bars (over, the binomial overlay, --ink);
// simulated relative frequencies as short --ev-c marks with a dot (sim); a --hi-soft selection band (sel:{a, b}, no knobs);
// the E(X) line (mean:{x, label}); grow (0–1) scales the solid bars for reveals; hide drops them; mute:[x] greys impossible x.
// hgChart(plot, { x0, x1, ymax, yStep, bars, over, sim, sel, mean, grow, hide, mute, labels:{x:text}, xLabel, yLabel, describe })
function hgChart(plot, o){
  var c = plot.c, r = c.getBoundingClientRect(), W = Math.max(160, r.width), H = Math.max(120, r.height);
  var L = 46, R = 14, T = o.mean ? 34 : 24, B = 30, n = o.x1 - o.x0 + 1, bw = (W - L - R) / n, ys = (H - T - B) / o.ymax, geo = {};
  var view = { xmin:o.x0 - 0.5 - L / bw, xmax:o.x1 + 0.5 + R / bw, ymin:-B / ys, ymax:o.ymax + T / ys };
  plot.draw({ view:view, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var X = function(x){ return p.X(x); }, Y = function(y){ return p.Y(y); }, xa = X(o.x0 - 0.5), xb = X(o.x1 + 0.5), y0 = Y(0), yt = Y(o.ymax);
    var pen = css("--pen"), sheet = css("--sheet"), ink = css("--ink"), ink2 = css("--ink-2"), fUI = p.fontUI, fM = p.fontM, g = o.grow == null ? 1 : o.grow;
    geo.xa = xa; geo.xb = xb; geo.y0 = y0; geo.yt = yt;
    if (o.sel) { ctx.fillStyle = css("--hi-soft"); ctx.fillRect(X(o.sel.a - 0.5), yt, X(o.sel.b + 0.5) - X(o.sel.a - 0.5), y0 - yt); }
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    var step = o.yStep, fmtY = function(v){ return MV.num(v, step < 0.1 ? 2 : 1); };
    for (var v = step; v <= o.ymax + 1e-9; v += step) { var py = Math.round(Y(v)) + 0.5; ctx.moveTo(xa, py); ctx.lineTo(xb, py); }
    ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = "12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = 0; v <= o.ymax + 1e-9; v += step) ctx.fillText(fmtY(Math.round(v * 1e6) / 1e6), xa - 6, Y(v));
    if (!o.hide) (o.bars || []).forEach(function(b){
      if (!(b.p > 0) || b.x < o.x0 || b.x > o.x1) return;
      var top = Math.max(yt - 4, Y(Math.min(b.p * g, o.ymax * 1.03))), x1 = X(b.x - 0.5), x2 = X(b.x + 0.5);
      ctx.fillStyle = pen; ctx.fillRect(x1, top, x2 - x1, y0 - top);
      if (x2 - x1 > 4) { ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.strokeRect(x1 + 0.5, top + 0.5, x2 - x1 - 1, y0 - top - 1); }
    });
    if (o.over) {
      ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.setLineDash([6, 3]);
      o.over.forEach(function(s){ if (!(s.p > 0) || s.x < o.x0 || s.x > o.x1) return; var top = Math.max(yt - 4, Y(Math.min(s.p, o.ymax * 1.03))), w = X(s.x + 0.5) - X(s.x - 0.5), in2 = Math.min(5, w / 5); ctx.strokeRect(X(s.x - 0.5) + in2, top + 1, w - 2 * in2, y0 - top - 1); });
      ctx.setLineDash([]);
    }
    if (o.sim && o.sim.length) {
      var oc = css("--ev-c");
      o.sim.forEach(function(s){ if (s.x < o.x0 || s.x > o.x1) return; var yy = Y(Math.min(s.p, o.ymax)), w = X(s.x + 0.5) - X(s.x - 0.5);
        ctx.strokeStyle = sheet; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(X(s.x) - w * 0.32, yy); ctx.lineTo(X(s.x) + w * 0.32, yy); ctx.stroke();
        ctx.strokeStyle = oc; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(X(s.x) - w * 0.3, yy); ctx.lineTo(X(s.x) + w * 0.3, yy); ctx.stroke();
        ctx.fillStyle = oc; ctx.beginPath(); ctx.arc(X(s.x), yy, 4.5, 0, Math.PI * 2); ctx.fill(); });
    }
    if (o.mean) {
      var mx = X(o.mean.x);
      ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, y0); ctx.lineTo(mx, yt - 4); ctx.stroke();
      ctx.font = "600 13px " + fUI; ctx.textBaseline = "bottom"; ctx.textAlign = "center";
      var tw = ctx.measureText(o.mean.label).width, lx = Math.max(xa + tw / 2 + 2, Math.min(xb - tw / 2 - 2, mx));
      ctx.fillStyle = sheet; ctx.globalAlpha = 0.9; ctx.fillRect(lx - tw / 2 - 3, yt - 22, tw + 6, 17); ctx.globalAlpha = 1;
      ctx.fillStyle = ink; ctx.fillText(o.mean.label, lx, yt - 6);
    }
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xa, yt - 6); ctx.lineTo(xa, y0); ctx.lineTo(xb, y0); ctx.stroke();
    ctx.font = "14px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (var x = o.x0; x <= o.x1; x++) { ctx.fillStyle = o.mute && o.mute.indexOf(x) >= 0 ? ink2 : ink; ctx.fillText(String(x), X(x), y0 + 6); }
    if (o.labels && !o.hide) {
      ctx.font = "600 12px " + fUI; ctx.textBaseline = "bottom"; ctx.fillStyle = ink;
      Object.keys(o.labels).forEach(function(k){ var xx = +k, b = (o.bars || []).filter(function(q){ return q.x === xx; })[0], h = b ? Math.min(b.p * g, o.ymax) : 0; ctx.fillText(o.labels[k], X(xx), Y(h) - 3); });
    }
    if (o.yLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yLabel, 4, 3); }
    if (o.xLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(o.xLabel, xa - 6, y0 + 6); }
  } });
  return geo.xa != null ? geo : null;
}
var SCALES = [[0.1, 0.02], [0.15, 0.05], [0.2, 0.05], [0.25, 0.05], [0.3, 0.1], [0.4, 0.1], [0.5, 0.1], [0.6, 0.2], [0.8, 0.2], [1, 0.2]];
function scaleOf(m){ var s = SCALES.filter(function(q){ return q[0] >= Math.min(1, m * 1.08); })[0] || SCALES[SCALES.length - 1]; return { ymax:s[0], step:s[1] }; }

// ---------- the hypergeometric model ----------
// hyp(N, A, r, exact): rows {x, c (count of selections, exact only), p} for x = 0 … r; lo/hi = possible range.
function hyp(N, A, r, exact){
  var lo = Math.max(0, r - (N - A)), hi = Math.min(r, A), rows = [], den = exact ? C(N, r) : null;
  for (var x = 0; x <= r; x++) {
    var ok = x >= lo && x <= hi, c = null, p = 0;
    if (exact) { c = ok ? C(A, x) * C(N - A, r - x) : 0; p = c / den; }
    else if (ok) { p = C(r, x); for (var i = 0; i < x; i++) p *= (A - i); for (var j = 0; j < r - x; j++) p *= (N - A - j); for (var k = 0; k < r; k++) p /= (N - k); }
    rows.push({ x:x, c:c, p:p });
  }
  return { N:N, A:A, r:r, lo:lo, hi:hi, den:den, rows:rows, exact:exact };
}
function binom(r, p){ var rows = []; for (var x = 0; x <= r; x++) rows.push({ x:x, p:C(r, x) * Math.pow(p, x) * Math.pow(1 - p, r - x) }); return rows; }
function evTxt(mode, k){ return mode === "le" ? "X <= " + k : mode === "ge" ? "X >= " + k : "X = " + k; }

// ---------- hero: draw 3 from 4 blue + 6 grey, the counting card, then the histogram 20 : 60 : 36 : 4 ----------
function urnSlots(n){ var out = [], cols = 6; for (var i = 0; i < n; i++) { var row = Math.floor(i / cols), col = i % cols; out.push([30 + col * 28, 146 - row * 26]); } return out; }
function urnJar(){ return '<path class="hg-jar" d="M10 16 L10 152 Q10 166 24 166 L180 166 Q194 166 194 152 L194 16"/>'; }
function ballSVG(x, y, s, rad, letter, cls){ return '<g class="hg-ball' + (cls ? " " + cls : "") + '"><circle class="' + (s ? "hg-s" : "hg-f") + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + rad + '"/>' + (letter ? '<text class="hg-lt" x="' + x.toFixed(1) + '" y="' + (y + 0.5).toFixed(1) + '">' + letter + "</text>" : "") + "</g>"; }
function hero(f){
  var box = f.fig && f.fig.querySelector("#hg-hfig"); if (!box) return;
  var cap = f.cap, SL = urnSlots(10), TYPES = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0], DRAW = [3, 5, 4], CNT = [20, 60, 36, 4];
  var aria = "An urn holds 4 blue and 6 grey balls. Three balls are drawn one at a time and set aside: blue, blue, grey. The urn count reads 3 blue of 9 left, then 2 blue of 8 left. A card shows C(4, 2) × C(6, 1) = 36 out of C(10, 3) = 120. Then the histogram for X = 0 to 3 rises: 20, 60, 36 and 4 out of 120.";
  var st = { a:0, gone:0, mv:null, cnt:"4 blue of 10", card:0, grow:0 };
  function svg(){
    var h = urnJar(), i;
    SL.forEach(function(p, k){ var g = DRAW.indexOf(k); if (g >= 0 && g < st.gone) { h += '<circle class="hg-gone" cx="' + p[0] + '" cy="' + p[1] + '" r="11"/>'; return; } if (st.mv && st.mv.k === k) return; h += ballSVG(p[0], p[1], TYPES[k], 11, TYPES[k] ? "B" : "G"); });
    h += '<text class="hg-hcnt" x="102" y="12">' + st.cnt + "</text>";
    h += '<text class="hg-htray" x="300" y="12">Drawn</text>';
    for (i = 0; i < st.gone; i++) h += ballSVG(254 + i * 46, 36, TYPES[DRAW[i]], 13, TYPES[DRAW[i]] ? "B" : "G");
    if (st.mv) h += ballSVG(st.mv.x, st.mv.y, TYPES[st.mv.k], 12, TYPES[st.mv.k] ? "B" : "G");
    if (st.card > 0) h += '<g opacity="' + st.card.toFixed(2) + '"><rect class="hg-hcard" x="214" y="60" width="176" height="44" rx="6"/><text class="hg-hct" x="302" y="77">C(4, 2) × C(6, 1) = 36</text><text class="hg-hct" x="302" y="95">out of C(10, 3) = 120</text></g>';
    if (st.grow > 0) {
      var base = 208, sc = 90 / 60;
      h += '<line class="hg-hax" x1="216" y1="' + base + '" x2="388" y2="' + base + '"/>';
      for (i = 0; i < 4; i++) { var bh = CNT[i] * sc * st.grow, x = 224 + i * 42; h += '<rect class="hg-hbar" x="' + x + '" y="' + (base - bh).toFixed(1) + '" width="34" height="' + bh.toFixed(1) + '"/><text class="hg-hxl" x="' + (x + 17) + '" y="' + (base + 14) + '">' + i + "</text>";
        if (st.grow > 0.98) h += '<text class="hg-hbl" x="' + (x + 17) + '" y="' + (base - bh - 4).toFixed(1) + '">' + CNT[i] + "</text>"; }
    }
    box.innerHTML = '<svg class="hg-hsvg" viewBox="0 0 400 226" role="img" aria-label="' + MV.esc(aria) + '" style="opacity:' + st.a.toFixed(2) + '">' + h + "</svg>";
  }
  function last(){ st = { a:1, gone:3, mv:null, cnt:"2 blue of 7 left", card:1, grow:1 }; svg(); cap.textContent = "P(X = x) for x = 0 to 3: 20, 60, 36 and 4 out of 120."; }
  if (MV.reduceMotion) { last(); return; }
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  svg(); cap.textContent = "An urn of 4 blue and 6 grey balls";
  tw(500, function(t){ st.a = t; svg(); }, function(){
    var i = 0, CN = ["3 blue of 9 left", "2 blue of 8 left", "2 blue of 7 left"];
    (function next(){
      if (i === 3) { cap.textContent = "Two blue and one grey: count the selections"; tw(600, function(t){ st.card = t; svg(); }, function(){ MV.wait(1300, grow); }); return; }
      var k = DRAW[i], p = SL[k], to = [254 + i * 46, 36];
      cap.textContent = "Draw " + (i + 1) + ": the ball is set aside, not put back";
      st.mv = { k:k, x:p[0], y:p[1] };
      tw(800, function(t){ var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; st.mv.x = p[0] + (to[0] - p[0]) * e; st.mv.y = p[1] + (to[1] - p[1]) * e - Math.sin(Math.PI * e) * 30; svg(); }, function(){
        st.mv = null; st.gone = i + 1; st.cnt = CN[i]; svg(); i++; MV.wait(500, next); });
    })();
  });
  function grow(){ cap.textContent = "The whole distribution, out of C(10, 3) = 120"; tw(1200, function(t){ st.grow = t; svg(); }, function(){ MV.wait(1200, last); }); }
}

// ---------- Explore: Draw without replacement ----------
var DEF = { n:10, a:4, r:3, mult:1, ov:false, k:2, mode:"eq" };
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (S.n == null) Object.keys(DEF).forEach(function(k){ S[k] = DEF[k]; });
    S.n = clampI(S.n, 5, 30, 10); S.a = clampI(S.a, 0, S.n, 4); S.r = clampI(S.r, 1, Math.min(S.n, 10), 3);
    S.mult = [1, 10, 100].indexOf(+S.mult) >= 0 ? +S.mult : 1; S.ov = !!S.ov;
    S.k = clampI(S.k, 0, S.r, 0); if (["eq", "le", "ge"].indexOf(S.mode) < 0) S.mode = "eq";
    S.sim = obj(S.sim); if (!Array.isArray(S.sim.c)) S.sim = { key:"", c:[], N:0 };
  }
  sanitize();
  var pv = {}, anim = null, drawSt = null, plot, geoC = null;

  host.innerHTML =
    '<div class="hg-pg"><div class="hg-main"><div class="eq-cap hg-cap" id="hg-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="hg-sls">' +
        '<label class="slider"><span class="slider-top"><span>Group size ' + M("n") + '</span><output id="hg-n-out"></output></span><input type="range" id="hg-n" min="5" max="30" step="1"></label>' +
        '<label class="slider"><span class="slider-top"><span>Successes in the group ' + M("a") + '</span><output id="hg-a-out"></output></span><input type="range" id="hg-a" min="0" max="30" step="1"></label>' +
        '<label class="slider"><span class="slider-top"><span>Draws ' + M("r") + '</span><output id="hg-r-out"></output></span><input type="range" id="hg-r" min="1" max="10" step="1"></label>' +
        '<div class="hg-opts"><div id="hg-mult"></div><button type="button" class="cc-switch hg-sw" role="switch" id="hg-ov" aria-checked="false" data-k="hgov"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>Binomial overlay</button></div></div>' +
      '<div class="hg-urnbox"><div id="hg-urn" class="hg-urn"></div><p class="tiny hg-ucount" id="hg-ucount" aria-live="polite"></p>' +
        '<div class="hg-btns"><button type="button" class="btn primary sm" id="hg-draw" data-k="hgdraw">Draw</button><button type="button" class="btn sm" id="hg-d100" data-k="hgd100">Draw 100</button><button type="button" class="btn ghost sm" id="hg-clr" data-k="hgclr">Clear draws</button></div></div>' +
      '<div class="plot-wrap hg-pw"><canvas class="plot hg-plot" id="hg-plot" role="img" aria-label="Hypergeometric probability histogram"></canvas></div>' +
      '<p class="tiny hg-legend" id="hg-legend"></p>' +
      '<div id="hg-bar"></div><div id="hg-mode"></div></div>' +
    '<div class="hg-read"><dl class="read" id="hg-read" aria-live="polite"></dl><div id="hg-tbl" class="hg-tbl"></div></div></div>';

  plot = new MV.Plot($("#hg-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintChart;
  var multR = radios($("#hg-mult", host), { label:"Big population", options:[{ id:1, t:"×1" }, { id:10, t:"×10" }, { id:100, t:"×100" }], value:S.mult, cls:"seg",
    onChange:function(v){ user(); S.mult = +v; changed(); } });
  var barR = radios($("#hg-bar", host), { label:"Bar", aria:"Selected bar", options:[], value:S.k, cls:"chips", onChange:function(v){ user(); S.k = +v; save(); render(); MV.changed(); } });
  var modeR = radios($("#hg-mode", host), { label:"Select", aria:"Selection", options:[{ id:"eq", t:"Exactly" }, { id:"le", t:"At most" }, { id:"ge", t:"At least" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; save(); render(); MV.changed(); } });

  function save(){ api.save(); }
  function N(){ return S.n * S.mult; }
  function A(){ return S.a * S.mult; }
  function D(){ return hyp(N(), A(), S.r, S.mult === 1); }
  function simKey(){ return S.n + "|" + S.a + "|" + S.r + "|" + S.mult; }
  function sim(){ if (S.sim.key !== simKey()) S.sim = { key:simKey(), c:[], N:0 }; while (S.sim.c.length < S.r + 1) S.sim.c.push(0); return S.sim; }
  function user(){ cancelAnim(); stopDraw(); if (pv.hide || pv.cap) { pv = {}; MV.banner("", ""); } }
  function changed(){ S.k = Math.min(S.k, S.r); save(); render(); MV.changed(); }

  // sliders
  [["n", 5, 30], ["a", 0, 30], ["r", 1, 10]].forEach(function(d){
    $("#hg-" + d[0], host).addEventListener("input", function(e){
      user(); S[d[0]] = +e.target.value;
      S.n = clampI(S.n, 5, 30, 10); S.a = Math.min(S.a, S.n); S.r = Math.max(1, Math.min(S.r, S.n, 10));
      changed();
    });
  });
  $("#hg-ov", host).addEventListener("click", function(){ user(); S.ov = !S.ov; save(); render(); MV.changed(); });
  $("#hg-draw", host).addEventListener("click", function(){ drawOne(); });
  $("#hg-d100", host).addEventListener("click", function(){ stopDraw(); var s = sim(), g = MV.mdm.seededRandom("mdm23|" + simKey() + "|" + s.N); for (var i = 0; i < 100; i++) s.c[sampleX(g).x]++; s.N += 100; drawSt = null; save(); render(); MV.changed(); });
  $("#hg-clr", host).addEventListener("click", function(){ stopDraw(); S.sim = { key:simKey(), c:[], N:0 }; drawSt = null; save(); render(); MV.changed(); });
  plot.c.addEventListener("click", function(e){
    if (!geoC || pv.hide) return;
    var r = plot.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    if (px < geoC.xa || px > geoC.xb || py > geoC.y0 + 4) return;
    var x = Math.round(plot.xOf(px)); if (x < 0 || x > S.r) return;
    user(); S.k = x; save(); render(); MV.changed();
  });

  // one sample of r without replacement: slots (×1) or a sequence of types (big population)
  function sampleX(g){
    var n = N(), a = A(), out = [], x = 0;
    if (S.mult === 1) {
      var types = urnTypes(), left = []; for (var i = 0; i < n; i++) left.push(i);
      for (var d = 0; d < S.r; d++) { var j = g.int(left.length), slot = left.splice(j, 1)[0]; out.push({ slot:slot, s:types[slot] }); if (types[slot]) x++; }
    } else {
      var sa = a, sn = n;
      for (var e = 0; e < S.r; e++) { var s = g() < sa / sn; out.push({ slot:-1, s:s }); if (s) { x++; sa--; } sn--; }
    }
    return { x:x, list:out };
  }
  function urnTypes(){ var perm = MV.shuffle(Array.apply(null, Array(S.n)).map(function(_, i){ return i; }), "mdm23-urn|" + S.n); return perm.map(function(v){ return v < S.a; }); }

  // --- single draw animation ---
  function stopDraw(){ if (drawSt && drawSt.stop) { drawSt.stop(); drawSt.stop = null; } if (drawSt && !drawSt.done) drawSt = null; paintBtns(); }
  function drawOne(){
    cancelAnim(); stopDraw();
    var s = sim(), g = MV.mdm.seededRandom("mdm23|" + simKey() + "|" + s.N), smp = sampleX(g), key = simKey();
    drawSt = { list:smp.list, x:smp.x, shown:0, mv:null, done:false, stop:null, key:key };
    var d = drawSt, slots = urnSlots(S.n), r = S.r, per = 520;
    paintBtns();
    d.stop = MV.tween({ dur:per * r, ease:function(t){ return t; }, step:function(t){
      if (drawSt !== d) return;
      var u = t * r, i = Math.min(r - 1, Math.floor(u)), fr = u - i;
      d.shown = i; var it = d.list[i], from = it.slot >= 0 ? slots[it.slot] : [102, 20], to = trayPos(i), e = fr < 0.5 ? 2 * fr * fr : 1 - Math.pow(-2 * fr + 2, 2) / 2;
      d.mv = { s:it.s, x:from[0] + (to[0] - from[0]) * e, y:from[1] + (to[1] - from[1]) * e - Math.sin(Math.PI * e) * 24 };
      paintUrn();
    }, done:function(){
      if (drawSt !== d) return;
      d.mv = null; d.shown = r; d.done = true; d.stop = null;
      if (S.sim.key === key) { S.sim.c[d.x]++; S.sim.N++; }
      save(); render(); MV.changed();
    } });
  }
  function trayPos(i){ return [226 + (i % 5) * 22, 44 + Math.floor(i / 5) * 24]; }
  function urnCount(){
    var n = N(), a = A(), d = drawSt, taken = d ? d.list.slice(0, d.shown) : [], ts = taken.filter(function(q){ return q.s; }).length;
    var left = n - taken.length, sl = a - ts;
    return M(fmt(sl)) + " success" + (sl === 1 ? "" : "es") + " of " + M(fmt(left)) + " left" + (d && d.done ? "; this sample has " + M("X = " + d.x) : "");
  }
  function paintUrn(){
    var el = $("#hg-urn", host); if (!el) return;
    var slots = urnSlots(S.n), types = urnTypes(), d = drawSt, gone = {}, h = urnJar();
    if (d && S.mult === 1) d.list.slice(0, d.shown).forEach(function(q){ gone[q.slot] = true; });
    if (d && d.mv && S.mult === 1) gone[d.list[d.shown].slot] = true;
    slots.forEach(function(p, k){ h += gone[k] ? '<circle class="hg-gone" cx="' + p[0] + '" cy="' + p[1] + '" r="10"/>' : ballSVG(p[0], p[1], types[k], 10.5, types[k] ? "S" : "F"); });
    if (S.mult > 1) h += '<text class="hg-umult" x="102" y="12">each ball stands for ' + S.mult + "</text>";
    h += '<text class="hg-htray" x="270" y="20">Drawn</text><rect class="hg-tray" x="210" y="28" width="120" height="' + (S.r > 5 ? 56 : 32) + '" rx="6"/>';
    if (d) d.list.slice(0, d.shown).forEach(function(q, i){ var p = trayPos(i); h += ballSVG(p[0], p[1], q.s, 9.5, q.s ? "S" : "F"); });
    if (d && d.mv) h += ballSVG(d.mv.x, d.mv.y, d.mv.s, 10, d.mv.s ? "S" : "F");
    var lab = "Urn: " + fmt(N()) + " balls, " + fmt(A()) + " successes; drawing " + S.r + (d && d.done ? ". Last sample: X = " + d.x : "");
    el.innerHTML = '<svg class="hg-usvg" viewBox="0 0 340 172" role="img" aria-label="' + MV.esc(lab) + '">' + h + "</svg>";
    $("#hg-ucount", host).innerHTML = urnCount();
  }
  function paintBtns(){
    var busy = !!(drawSt && !drawSt.done) || !!anim || !!pv.hide;
    ["#hg-draw", "#hg-d100"].forEach(function(id){ var b = $(id, host); if (b) b.disabled = busy; });
    var c = $("#hg-clr", host); if (c) c.disabled = busy || !(S.sim.key === simKey() && S.sim.N > 0);
  }

  // --- painting ---
  function range(){ var k = Math.min(S.k, S.r); return S.mode === "le" ? { a:0, b:k } : S.mode === "ge" ? { a:k, b:S.r } : { a:k, b:k }; }
  function paintChart(){
    var d = D(), p = A() / N(), bin = S.ov ? binom(S.r, p) : null, s = S.sim.key === simKey() && S.sim.N > 0 ? S.sim : null, mx = 0;
    d.rows.forEach(function(q){ mx = Math.max(mx, q.p); }); if (bin) bin.forEach(function(q){ mx = Math.max(mx, q.p); });
    if (s) s.c.forEach(function(c){ mx = Math.max(mx, c / s.N); });
    var sc = scaleOf(mx), E = S.r * p, rg = range(), mute = [];
    for (var x = 0; x <= S.r; x++) if (x < d.lo || x > d.hi) mute.push(x);
    var desc = pv.hide ? "Histogram hidden until you predict. n = " + fmt(N()) + ", a = " + fmt(A()) + ", r = " + S.r + "." :
      "Hypergeometric histogram: n = " + fmt(N()) + ", a = " + fmt(A()) + ", r = " + S.r + "; X goes from " + d.lo + " to " + d.hi + "; mean E(X) = " + d4(E) + "." + (bin ? " Binomial overlay with p = " + d4(p) + " shown as dashed outlines." : "") + (s ? " Simulated frequencies from " + s.N + " draws shown as marks." : "");
    geoC = hgChart(plot, { x0:0, x1:S.r, ymax:sc.ymax, yStep:sc.step, bars:d.rows, over:bin, sim:s ? s.c.map(function(c, i){ return { x:i, p:c / s.N }; }) : null,
      sel:pv.hide ? null : rg, mean:pv.hide ? null : { x:E, label:"E(X) = " + d4(E) }, grow:pv.grow, hide:pv.hide && pv.grow == null, mute:pv.hide ? null : mute,
      yLabel:"P(X = x)", xLabel:"x", describe:desc });
    var lg = '<span class="hg-key"><i class="mdm-sw" style="background:var(--pen)"></i> hypergeometric</span>' + (bin ? '<span class="hg-key"><i class="hg-swo"></i> binomial, ' + M("p = " + d4(p)) + "</span>" : "") +
      (s ? '<span class="hg-key"><i class="hg-swm"></i> simulated (' + s.N + " draw" + (s.N === 1 ? "" : "s") + ")</span>" : "");
    $("#hg-legend", host).innerHTML = lg;
  }
  function selProb(d){ var rg = range(), c = 0, p = 0; d.rows.forEach(function(q){ if (q.x >= rg.a && q.x <= rg.b) { p += q.p; if (d.exact) c += q.c; } }); return { c:c, p:p }; }
  function paintRead(){
    var d = D(), n = N(), a = A(), r = S.r, E = r * a / n, ev = evTxt(S.mode, Math.min(S.k, r)), sp = selProb(d), rows = [];
    rows.push(["Parameters", M("n = " + fmt(n) + ", a = " + fmt(a) + ", r = " + r) + (S.mult > 1 ? " (×" + S.mult + ")" : "")]);
    if (pv.hide) { rows.push(["Possible values", '<span class="muted">Hidden until you predict</span>']); rows.push(["Selected probability", '<span class="muted">Hidden until you predict</span>']); }
    else {
      rows.push(["Possible values", M("x = " + d.lo) + " to " + M(String(d.hi))]);
      var sel;
      if (S.mode === "eq" && (S.k < d.lo || S.k > d.hi)) sel = M("P(" + ev + ") = 0") + " (impossible)";
      else if (d.exact) sel = M("P(" + ev + ")") + (S.mode === "eq" ? " = " + M("C(" + a + ", " + S.k + ") C(" + (n - a) + ", " + (r - S.k) + ") ÷ C(" + n + ", " + r + ")") : "") + " = " + M(F.prob(sp.c, d.den));
      else sel = M("P(" + ev + ")") + (S.mode === "eq" ? " = " + M("C(" + fmt(a) + ", " + S.k + ") C(" + fmt(n - a) + ", " + (r - S.k) + ") ÷ C(" + fmt(n) + ", " + r + ")") : "") + " ≈ " + d4(sp.p);
      rows.push(["Selected probability", sel]);
    }
    rows.push(["Expected value", M("E(X) = ra ÷ n = " + r + " × " + fmt(a) + " ÷ " + fmt(n)) + (exact4(E) ? " = " : " ≈ ") + d4(E)]);
    if (S.ov) {
      var p = a / n, bp = 0; binom(r, p).forEach(function(q){ var rg = range(); if (q.x >= rg.a && q.x <= rg.b) bp += q.p; });
      rows.push(["Binomial comparison", pv.hide ? "Binomial (" + M("p = " + d4(p)) + "): " + M("P(" + ev + ") ≈ " + d4(bp)) : "Binomial (" + M("p = " + d4(p)) + "): " + M("P(" + ev + ")") + (exact4(bp) ? " = " : " ≈ ") + d4(bp) + "; difference " + d4(Math.abs(sp.p - bp))]);
    }
    rows.push(["Total", "Probabilities add to 1"]);
    $("#hg-read", host).innerHTML = MV.readoutHTML(rows);
    var tb = $("#hg-tbl", host);
    if (pv.hide) { tb.innerHTML = ""; return; }
    var bin = S.ov ? binom(r, a / n) : null;
    tb.innerHTML = MV.tableHTML({ caption:"Table of the distribution", head:[M("x"), M("P(X = x)")].concat(bin ? ["Binomial"] : []),
      rows:d.rows.map(function(q, i){ return [String(q.x), d.exact ? (q.c ? M(fmt(q.c) + "/" + fmt(d.den)) : "0") : d4(q.p)].concat(bin ? [d4(bin[i].p)] : []); }),
      hiRow:S.mode === "eq" ? Math.min(S.k, r) : null });
  }
  function paintCap(){
    var el = $("#hg-cap", host); if (!el) return;
    el.innerHTML = pv.cap ? MV.md(pv.cap) : M("n = " + fmt(N()) + ",  a = " + fmt(A()) + ",  r = " + S.r);
  }
  function render(){
    sanitize();
    var nI = $("#hg-n", host), aI = $("#hg-a", host), rI = $("#hg-r", host);
    nI.value = S.n; aI.max = S.n; aI.value = S.a; rI.max = Math.min(S.n, 10); rI.value = S.r;
    $("#hg-n-out", host).textContent = S.mult > 1 ? S.n + " (×" + S.mult + " = " + fmt(N()) + ")" : String(S.n);
    $("#hg-a-out", host).textContent = S.mult > 1 ? S.a + " (×" + S.mult + " = " + fmt(A()) + ")" : String(S.a);
    $("#hg-r-out", host).textContent = String(S.r);
    nI.setAttribute("aria-valuetext", "n = " + fmt(N())); aI.setAttribute("aria-valuetext", "a = " + fmt(A())); rI.setAttribute("aria-valuetext", "r = " + S.r);
    var ov = $("#hg-ov", host); ov.setAttribute("aria-checked", String(S.ov));
    multR.set(S.mult);
    barR.setOptions(Array.apply(null, Array(S.r + 1)).map(function(_, i){ return { id:i, t:String(i), aria:"x = " + i }; })); barR.set(Math.min(S.k, S.r));
    modeR.set(S.mode);
    if (drawSt && drawSt.done && drawSt.key && drawSt.key !== simKey()) drawSt = null;
    paintUrn(); paintChart(); paintRead(); paintCap(); paintBtns();
  }

  // --- animation bookkeeping ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv.grow = null; pv.hide = false;
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } render(); MV.changed(); }

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); stopDraw(); drawSt = null;
    var s = obj(p.start);
    S.n = s.n || 10; S.a = s.a != null ? s.a : 4; S.r = s.r || 3; S.ov = !!s.overlay; S.mult = 1; S.k = s.k != null ? s.k : 0; S.mode = "eq";
    pv = { hide:true }; save(); render();
  }
  function runPred(p, done){
    newAnim(done);
    if (p.id === "p4") {
      pv = { cap:"`n = 10`: ×1" };
      render();
      later(900, function(){ S.mult = 10; pv.cap = "`n = 100`, `a = 40`: ×10"; save(); render();
        later(1100, function(){ S.mult = 100; pv.cap = "`n = 1000`, `a = 400`: the bars line up"; save(); render(); later(900, function(){ endAnim(); }); }); });
      return;
    }
    pv = { hide:true, grow:0, cap:"Watch the bars…" };
    var an = anim;
    render();
    an.stops.push(MV.tween({ dur:1100, step:function(t){ pv.grow = t; paintChart(); }, done:function(){
      if (p.id === "p1") { S.k = 2; pv = { cap:"Without replacement `36/120 = 0.3`; binomial 0.288" }; }
      else if (p.id === "p2") { S.k = 3; pv = { cap:"The histogram stops at 3" }; }
      else { S.k = 1; pv = { cap:"The histogram starts at 1" }; }
      save(); render(); later(700, function(){ endAnim(); });
    } }));
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (anim || pv.hide) return R("Wait for the animation to finish.");
    var n = N(), a = A(), r = S.r, d = D();
    if (id === "tc1") {
      if (r !== 4) return R("Set `r = 4` first.");
      if (2 * S.a === S.n) return { ok:true };
      if (S.a === 2 && S.n === 10) return R("`E = 4 × 2 ÷ 10 = 0.8`. `E` depends on `a ÷ n`.");
      if (S.a === 5 && S.n === 20) return R("`E = 1`.");
      var E = 4 * a / n;
      return R("Right now `E(X) = 4 × " + fmt(a) + " ÷ " + fmt(n) + (exact4(E) ? " = " : " ≈ ") + d4(E) + "`. You need `E(X) = 2`.");
    }
    if (id === "tc2") {
      if (S.mult !== 1) return R("Set Big population back to ×1: the group has 10 items.");
      if (S.n !== 10 || r !== 3) return R("Set `n = 10` and `r = 3` first.");
      if (S.a === 4) return { ok:true };
      if (S.a === 6) return R("`C(4, 3) ÷ 120 = 1/30`.");
      if (S.a === 3) return R("`C(7, 3) ÷ 120 = 35/120`.");
      return R("Now `P(X = 0) = C(" + (10 - S.a) + ", 3) ÷ 120 = " + C(10 - S.a, 3) + "/120`. You need `20/120`.");
    }
    if (id === "tc3") {
      if (S.mult !== 1 || S.n !== 12 || r !== 3) return R("Model the box: set `n = 12` (Big population ×1) and `r = 3`.");
      if (S.mode === "eq" && S.k === 1) return R("‘At least one’ includes 2 and 3.");
      if (!(S.mode === "ge" && S.k === 1)) return R("Select ‘at least one defective’: choose bar 1, then At least.");
      if (S.a === 5) return { ok:true };
      if (S.a === 4) return R("`1 - 56/220 = 164/220 ≈ 0.745`, just under `3/4`.");
      if (S.a === 6) return R("That works, but it isn’t the smallest.");
      var sp = selProb(d);
      if (S.a < 4) return R("`P(X >= 1) ≈ " + d4(sp.p) + "`, below `3/4`. Try more defective bulbs.");
      return R("That works, but it isn’t the smallest.");
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Quality control (three stations) ----------
function part3(host, api){
  var S = api.S, P3 = api.content || {}, Q1 = P3.s1 || {}, Q2 = P3.s2 || {}, Q3 = P3.s3 || {};
  var ST = [{ id:"s1", t:"Accept or reject?" }, { id:"s2", t:"Loosen the rule" }, { id:"s3", t:"Check it with algebra" }];
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = "s1";
  S.s1 = obj(S.s1); S.s2 = obj(S.s2); S.s3 = obj(S.s3);
  if (!Array.isArray(S.s1.v)) S.s1.v = ["", "", "", ""];
  if (!Array.isArray(S.s2.v)) S.s2.v = ["", "", "", ""];
  var msg = {};
  function done(id){ return id === "s1" ? !!(S.s1.ok && S.s1.fairOk) : id === "s2" ? !!S.s2.ok : !!S.s3.ok; }
  host.innerHTML = '<div id="qc-tabs" class="qc-tabs"></div><div id="qc-body" class="qc-body"></div>';
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.t + (done(s.id) ? ' <span class="qc-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#qc-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function retab(){ tabText(); tabs.refresh(); }
  function inp(st, k, lab, dis){ return '<input class="numin qc-in" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" data-st="' + st + '" data-ix="' + k + '" aria-label="' + lab + '" value="' + MV.esc(S[st].v[k] || "") + '"' + (dis ? " disabled" : "") + ">"; }
  function combo(st, i, dis){ return '<span class="qc-c">' + M("C") + "(" + inp(st, i, "Combination " + (i / 2 + 1) + ": group size", dis) + ", " + inp(st, i + 1, "Combination " + (i / 2 + 1) + ": number chosen", dis) + ")</span>"; }
  function vals(st){ return S[st].v.map(function(s){ var t = String(s || "").replace(/[\s ]/g, ""); return /^\d+$/.test(t) ? +t : null; }); }
  function fb(id){ return msg[id] ? MV.fbHTML(msg[id].k, msg[id].t) : ""; }

  function s1(){
    var x = S.s1, h = '<p class="qc-task">' + Q1.scenario + "</p>" + MV.usesHTML(Q1.use);
    h += '<p class="qc-task">Build <i>P</i>(accept): which combinations count the samples that are accepted, and all possible samples?</p>';
    h += '<div class="qc-build">' + M("P(accept) =") + " " + combo("s1", 0, x.ok) + ' <span class="qc-op">÷</span> ' + combo("s1", 2, x.ok) + "</div>";
    if (!x.ok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="c1" data-k="qcc1">Check</button></div>';
    h += fb("s1");
    if (x.ok) {
      h += '<p class="qc-res">' + M("P(accept) = C(17, 4) ÷ C(20, 4) = 2380/4845 = 28/57 ≈ 0.491") + "</p>";
      var fq = Q1.fair || { choices:[] };
      h += '<div class="qc-fair"><p class="qc-task"><strong>' + fq.prompt + '</strong></p><div class="chips" role="group" aria-label="' + MV.esc(MV.plain(fq.prompt || "")) + '">' + fq.choices.map(function(c, i){
        var cls = "chip" + (x.fair === i ? (MV.ok(c) ? " right" : " wrong") : "");
        return '<button type="button" class="' + cls + '" data-fair="' + i + '" data-k="qcf' + i + '"' + (x.fairOk ? " disabled" : "") + ' aria-pressed="' + (x.fair === i) + '">' + c.t + "</button>"; }).join("") + "</div>";
      if (x.fair != null) { var c = fq.choices[x.fair]; h += MV.fbHTML(MV.ok(c) ? "good" : "bad", (MV.ok(c) ? "" : "<strong>✗ Not quite.</strong> ") + c.fb); }
      h += "</div>";
    }
    return h;
  }
  function judge1(){
    var v = vals("s1"), x = S.s1;
    if (v.some(function(q){ return q == null; })) { msg.s1 = { k:"bad", t:"Fill in all four boxes with whole numbers." }; return; }
    var num = v[1] > v[0] ? 0 : C(v[0], v[1]), den = v[3] > v[2] ? 0 : C(v[2], v[3]);
    if (num === 2380 && den === 4845) { x.ok = true; msg.s1 = { k:"good", t:"<strong>✓ Correct.</strong> All 4 tested tablets must be good: choose them from the 17 good ones, out of every sample of 4 from 20." }; return; }
    x.tries = (x.tries || 0) + 1;
    if (num !== 2380) msg.s1 = { k:"bad", t:"<strong>✗ Not quite.</strong> Accepting means none of the 4 tested is defective: choose all 4 from the 17 good tablets. Try again." };
    else msg.s1 = { k:"bad", t:"<strong>✗ Not quite.</strong> Divide by every possible sample of 4 from the 20 tablets. Try again." };
  }
  function s2(){
    var x = S.s2, h = '<p class="qc-task">' + Q2.scenario + "</p>" + MV.usesHTML(Q2.use);
    h += '<p class="qc-task">No defective: 2380 samples (Station 1). Now count the samples with <strong>exactly 1</strong> defective tablet.</p>';
    h += '<div class="qc-build">Exactly 1 defective: ' + combo("s2", 0, x.ok) + ' <span class="qc-op">×</span> ' + combo("s2", 2, x.ok) + "</div>";
    if (!x.ok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="c2" data-k="qcc2">Check</button></div>';
    h += fb("s2");
    if (x.ok) {
      h += '<p class="qc-res">' + M("P(X <= 1) = [2380 + 3 × C(17, 3)] ÷ 4845 = (2380 + 2040) ÷ 4845 ≈ 0.912") + "</p>";
      h += MV.tableHTML({ caption:"Comparing the two plans", head:["Plan", "Accept if", M("P(accept)")], rows:[["Strict", "no defective tablets", "≈ 0.491"], ["Loose", "at most 1 defective tablet", "≈ 0.912"]], hiRow:1 });
      h += '<p class="qc-note">The looser rule accepts this shipment (3 bad tablets of 20) about 91% of the time instead of about 49%.</p>';
    }
    return h;
  }
  function judge2(){
    var v = vals("s2"), x = S.s2;
    if (v.some(function(q){ return q == null; })) { msg.s2 = { k:"bad", t:"Fill in all four boxes with whole numbers." }; return; }
    var c1 = v[1] > v[0] ? 0 : C(v[0], v[1]), c2 = v[3] > v[2] ? 0 : C(v[2], v[3]), pr = c1 * c2;
    if (pr === 2040 && (c1 === 3 || c2 === 3)) { x.ok = true; msg.s2 = { k:"good", t:"<strong>✓ Correct.</strong> " + M("C(3, 1) × C(17, 3) = 3 × 680 = 2040") + ": choose the defective tablet, then 3 good ones." }; return; }
    x.tries = (x.tries || 0) + 1;
    if (pr === 680) msg.s2 = { k:"bad", t:"<strong>✗ Not quite.</strong> Choose which defective tablet too: " + M("C(3, 1) = 3") + " ways. Try again." };
    else if (c1 === 3 || c2 === 3) msg.s2 = { k:"bad", t:"<strong>✗ Not quite.</strong> The other 3 tested tablets must be good: choose them from the 17 good ones. Try again." };
    else msg.s2 = { k:"bad", t:"<strong>✗ Not quite.</strong> Choose 1 of the 3 defective tablets and 3 of the 17 good ones. Try again." };
  }
  function s3(){
    var x = S.s3, h = '<p class="qc-task">' + Q3.scenario + "</p>";
    h += '<details class="alg" open><summary>Check it with algebra</summary><div class="alg-lines">';
    h += "<span>Hypergeometric: " + M("P(X = 0) = C(1700, 4) ÷ C(2000, 4)") + "</span>";
    h += "<span>" + M("= {1700 × 1699 × 1698 × 1697}/{2000 × 1999 × 1998 × 1997}") + (x.ok ? " ≈ <strong>0.5217</strong>" : "") + "</span>";
    h += "<span>Binomial, " + M("p = 1700 ÷ 2000 = 0.85") + ": " + M("P(X = 0) = (0.85)^4") + (x.ok ? " ≈ <strong>0.5220</strong>" : "") + "</span>";
    if (x.ok) h += "<span>Difference ≈ 0.0003</span>";
    h += "</div></details>";
    if (!x.ok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="c3" data-k="qcc3">Evaluate both</button></div>';
    else h += MV.fbHTML("good", "<strong>Takeaway.</strong> " + Q3.takeaway);
    return h;
  }
  function paint(){
    retab();
    var body = $("#qc-body", host), id = S.cur, h = id === "s1" ? s1() : id === "s2" ? s2() : s3();
    if (done(id)) h += '<p class="qc-done"><strong>✓ Station ' + (ST.map(function(s){ return s.id; }).indexOf(id) + 1) + " complete.</strong> " + (ST.every(function(s){ return done(s.id); }) ? "All three stations done. Try the quick check below." : "Choose another station above.") + "</p>";
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="qc-wrap">' + h + "</div>"; });
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.st) return; S[t.dataset.st].v[+t.dataset.ix] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ var t = e.target; if (e.key === "Enter" && t.dataset && t.dataset.st) { var b = host.querySelector('[data-act="' + (t.dataset.st === "s1" ? "c1" : "c2") + '"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.act === "c1") { judge1(); api.save(); paint(); MV.focusFb($("#qc-body", host)); return; }
    if (b.dataset.act === "c2") { judge2(); api.save(); paint(); MV.focusFb($("#qc-body", host)); return; }
    if (b.dataset.act === "c3") { S.s3.ok = true; api.save(); paint(); MV.focusFb($("#qc-body", host)); return; }
    if (b.dataset.fair != null) { var i = +b.dataset.fair, c = (Q1.fair || { choices:[] }).choices[i]; S.s1.fair = i; if (MV.ok(c)) S.s1.fairOk = true; api.save(); paint(); var f = host.querySelector(".qc-fair"); if (f) MV.focusFb(f); }
  });
  paint();
  return {};
}

// @component N4 probEntry — number entry for probabilities (copied from MDM4U 21; adds item labels H1, H2, …, a "Use these
// values" box (it.use) and kind:"fill": six boxes C(□, □) × C(□, □) ÷ C(□, □), then a chip choice for the value): fractions,
// decimals and whole numbers. First-try scoring (right on the first check and no worked solution shown).
function probEntry(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ var x = st.items[id] || (st.items[id] = { val:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.val)) x.val = [String(x.val || "")]; return x; }
  function pv(raw){ var f = F.parse(raw); if (f) return f.n / f.d; var r = MV.parseNum(raw); return r && r.length === 1 ? r[0] : null; }
  function close(v, w, tol){ return v != null && Math.abs(v - w) <= tol * Math.max(1, Math.abs(w)); }
  function judge(it, vals){
    var ans = MV.ans(it), num = pv(vals[0]);
    if (num == null) return { bad:true };
    if (close(num, ans, it.tol || 5e-5)) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ return close(num, w.match, 5e-5); })[0];
    return { ok:false, fb:named ? named.fb : null };
  }
  function judgeFill(it, vals){
    var v = vals.slice(0, 6).map(function(s){ var t = String(s || "").replace(/[\s ]/g, ""); return /^\d+$/.test(t) ? +t : null; });
    if (v.some(function(q){ return q == null; })) return { bad:true };
    var ans = MV.ans(it), p1 = v[0] + "," + v[1], p2 = v[2] + "," + v[3], A1 = ans[0] + "," + ans[1], A2 = ans[2] + "," + ans[3];
    var numOk = (p1 === A1 && p2 === A2) || (p1 === A2 && p2 === A1), denOk = v[4] === ans[4] && v[5] === ans[5];
    if (numOk && denOk) return { ok:true };
    if (!denOk) return { ok:false, fb:"Divide by every possible 5-card hand: " + M("C(52, 5)") + "." };
    if (p1 !== A1 && p2 !== A1) return { ok:false, fb:"Choose 2 of the 4 aces: " + M("C(4, 2)") + "." };
    return { ok:false, fb:"The other 3 cards must be non-aces. Count those choices too: choose them from the 48 non-aces." };
  }
  function fillRow(it, x){
    var dis = x.boxOk || x.solved, b = function(k, lab){ return '<input class="numin pe-sm" id="pe-' + it.id + k + '" data-pin="' + it.id + '" data-pk="' + k + '" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="' + lab + '" value="' + MV.esc(x.val[k] || "") + '"' + (dis ? " disabled" : "") + ">"; };
    var c = function(k, w){ return '<span class="qc-c">' + M("C") + "(" + b(k, w + ": group size") + ", " + b(k + 1, w + ": number chosen") + ")</span>"; };
    return '<div class="qc-build pe-fill">' + c(0, "First combination") + ' <span class="qc-op">×</span> ' + c(2, "Second combination") + ' <span class="qc-op">÷</span> ' + c(4, "All hands") + "</div>";
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), fill = it.kind === "fill";
        var h = '<div class="q" data-pe="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">H' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        if (it.use) h += MV.usesHTML(it.use);
        if (fill) {
          h += fillRow(it, x);
          if (x.boxOk && !x.solved) h += '<p class="qc-task">Now choose the value of ' + M("C(4, 2) C(48, 3) ÷ C(52, 5)") + ':</p><div class="chips pe-chips" role="group" aria-label="Value">' + it.options.map(function(o, k){
            return '<button type="button" class="chip' + (x.pick === k ? " wrong" : "") + '" data-opt="' + k + '" data-k="' + it.id + "o" + k + '">' + o.t + "</button>"; }).join("") + "</div>";
        } else h += '<div class="numrow pe-row"><label class="pe-lab" for="pe-' + it.id + '0"><span>Your answer:</span><input class="numin" id="pe-' + it.id + '0" data-pin="' + it.id + '" data-pk="0" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val[0] || "") + '"' + (x.solved ? " disabled" : "") + "></label></div>";
        if (!x.solved) h += '<div class="q-actions">' + (fill && x.boxOk ? "" : '<button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>') + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb ' + (msgs[it.id].good ? "good" : "bad") + '" role="status"><p>' + msgs[it.id].t + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.pin; if (!id) return; ist(id).val[+e.target.dataset.pk] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.pin) { var b = host.querySelector('[data-k="' + e.target.dataset.pin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-pe]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.pe; })[0], x = ist(it.id), foc = function(){ MV.focusFb(host.querySelector('[data-pe="' + it.id + '"]')); };
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.opt != null) {
      var o = it.options[+b.dataset.opt];
      if (MV.ok(o)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; x.pick = +b.dataset.opt; msgs[it.id] = { t:"<strong>✗ Not quite.</strong> " + o.why + " Try again." }; }
      api.save(); paint(); foc(); return;
    }
    if (b.dataset.act === "check") {
      var r = it.kind === "fill" ? judgeFill(it, x.val) : judge(it, x.val);
      if (r.bad) { msgs[it.id] = { t:it.kind === "fill" ? "Fill in all six boxes with whole numbers." : "Enter a fraction such as 7/15, a decimal such as 0.4667 or a whole number." }; paint(); foc(); return; }
      if (r.ok && it.kind === "fill") { x.boxOk = true; msgs[it.id] = { good:true, t:"<strong>✓ Right combinations.</strong> " + M("C(4, 2) C(48, 3) ÷ C(52, 5)") + ": 2 of the 4 aces, 3 of the 48 non-aces, out of every hand." }; }
      else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = { t:"<strong>✗ Not quite.</strong> " + (r.fb ? r.fb + " " : "") + "Try again." }; }
      api.save(); paint(); foc();
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Inspection plan ----------
var task = (function(){
  var api = null, plots = [], cR = null;
  function read(){ var s = api ? api.S : {}, r = clampI(s.r, 1, 6, 3), c = clampI(s.c, 0, 2, 0); if (c >= r) c = r - 1; return { r:r, c:c }; }
  function acc(a, d){ var cnt = 0; for (var x = 0; x <= d.c; x++) cnt += C(a, x) * C(12 - a, d.r - x); return { cnt:cnt, den:C(12, d.r) }; }
  function draw(){
    var d = read();
    [2, 4].forEach(function(a, i){
      var pl = plots[i]; if (!pl) return;
      var H = hyp(12, a, d.r, true), mx = 0; H.rows.forEach(function(q){ mx = Math.max(mx, q.p); });
      var sc = scaleOf(mx), ac = acc(a, d);
      hgChart(pl, { x0:0, x1:d.r, ymax:sc.ymax, yStep:sc.step, bars:H.rows, sel:{ a:0, b:d.c }, yLabel:"P(X = x)", xLabel:"x",
        describe:(a === 2 ? "Good box" : "Bad box") + " (" + a + " defective of 12), testing " + d.r + ": acceptance region X ≤ " + d.c + " shaded; P(accept) ≈ " + d4(ac.cnt / ac.den) + "." });
    });
  }
  function paint(){
    var d = read(), el = $("#ip-read"); if (!el) return;
    $("#ip-r-out").textContent = String(d.r); $("#ip-r").value = d.r; $("#ip-r").setAttribute("aria-valuetext", "r = " + d.r);
    var g = acc(2, d), b = acc(4, d), pg = F.of(g.cnt, g.den), pb = F.of(b.cnt, b.den);
    el.innerHTML = MV.readoutHTML([["Plan", "Test " + M("r = " + d.r) + "; accept if at most " + M("c = " + d.c) + " defective"],
      ["Good box accepted", M("P(X <= " + d.c + ") = " + F.txt(pg)) + (pg.d === 1 ? "" : " ≈ " + d3(F.val(pg)))],
      ["Bad box accepted", M("P(X <= " + d.c + ") = " + F.txt(pb)) + (pb.d === 1 ? "" : " ≈ " + d3(F.val(pb)))]]);
    draw();
  }
  return {
    render:function(inp, pvw, a){
      api = a; var d = read(); a.S.r = d.r; a.S.c = d.c;
      inp.innerHTML = '<label class="slider"><span class="slider-top"><span>Cases tested ' + M("r") + '</span><output id="ip-r-out"></output></span><input type="range" id="ip-r" min="1" max="6" step="1" value="' + d.r + '"></label><div id="ip-c"></div>';
      cR = radios($("#ip-c", inp), { label:"Accept if defective at most " + M("c") + " =", aria:"Accept if at most c defective", options:[0, 1, 2].map(function(c){ return { id:c, t:String(c), aria:"c = " + c }; }), value:d.c, cls:"chips",
        disabled:function(id){ return +id >= read().r; }, onChange:function(v){ a.S.c = +v; a.save(); paint(); a.update(); } });
      pvw.innerHTML = '<div class="ip-two"><figure class="ip-fig"><figcaption class="ip-cap">Good box: 2 defective of 12</figcaption><canvas class="plot ip-plot" id="ip-g" role="img" aria-label="Good box histogram"></canvas></figure>' +
        '<figure class="ip-fig"><figcaption class="ip-cap">Bad box: 4 defective of 12</figcaption><canvas class="plot ip-plot" id="ip-b" role="img" aria-label="Bad box histogram"></canvas></figure></div><dl class="read ip-read" id="ip-read" aria-live="polite"></dl>';
      plots = [new MV.Plot($("#ip-g"), { xmin:0, xmax:1, ymin:0, ymax:1 }), new MV.Plot($("#ip-b"), { xmin:0, xmax:1, ymin:0, ymax:1 })];
      plots.forEach(function(p){ p.render = draw; });
      $("#ip-r").addEventListener("input", function(e){ a.S.r = clampI(e.target.value, 1, 6, 3); if (a.S.c >= a.S.r) a.S.c = a.S.r - 1; a.save(); cR.set(read().c); cR.refresh(); paint(); a.update(); });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var g = acc(2, d), b = acc(4, d); return [100 * g.cnt >= 65 * g.den, 100 * b.cnt <= 60 * b.den, d.r <= 5]; },
    key:function(d){ return d.r + "|" + d.c; },
    label:function(k){ var q = k.split("|"); return M("r = " + q[0] + ", c = " + q[1]); },
    text:function(k){ var q = k.split("|"); return "r = " + q[0] + ", c = " + q[1]; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ count:probEntry },
  task:task
});
})();
