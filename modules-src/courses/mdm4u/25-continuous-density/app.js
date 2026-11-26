// MDM4U 25 Continuous Random Variables & Density: hero (a 10-cm density histogram of 200 heights splits into 5-cm and 2-cm
// classes, a smooth curve traces the tops, 160–170 cm is shaded), From bars to curves (Explore: D10 histogram builder with
// frequency / relative-frequency / density axes, frequency polygon and smooth curve; D8 model densities with exact areas),
// Measurement challenges (Part 3: four stations), Areas and densities practice (N4 probEntry), Design a waiting-time density task.
// Model data are deterministic (built from fixed quantiles, no randomness), so every device shows the same 200 values.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;
function M(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function d4(v){ var s = (Math.round(v * 1e4) / 1e4).toFixed(4).replace(/0+$/, "").replace(/\.$/, ""); if (s === "-0") s = "0"; return s.replace("-", MV.MINUS); }
function d2(v){ return MV.num(Math.round(v * 100) / 100, 2); }
function nx(v){ return String(Math.round(v * 100) / 100).replace("-", MV.MINUS); }   // handle positions: 7, 7.5, 160
function isDark(){ var c = css("--sheet"), m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c); if (!m) return false; return (parseInt(m[1], 16) + parseInt(m[2], 16) + parseInt(m[3], 16)) / 3 < 110; }
function fTxt(f){ var t = F.txt(f), d = F.dec(f, 4); return t === d ? t : t + " = " + d; }

// ---------- normal-curve helpers (used only to build the model data) ----------
function erf(x){ var s = x < 0 ? -1 : 1; x = Math.abs(x); var t = 1 / (1 + 0.3275911 * x); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)); }
function Phi(z){ return 0.5 * (1 + erf(z / Math.SQRT2)); }
function PhiInv(p){
  var a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.3577518672690, -30.66479806614716, 2.506628277459239],
      b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572],
      c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783],
      d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416], q, r;
  if (p < 0.02425) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - 0.02425) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

// ---------- model data: 200 heights (10-cm class counts 6, 34, 70, 62, 24, 4 as the plan requires) and 200 reaction times ----------
var DATA = (function(){
  var H = [], CNT = [6, 34, 70, 62, 24, 4], mu = 168.5, sd = 10.5;
  CNT.forEach(function(n, k){
    var L = 140 + 10 * k, U = L + 10, pL = Phi((L - mu) / sd), pU = Phi((U - mu) / sd);
    for (var i = 0; i < n; i++) { var v = mu + sd * PhiInv(pL + (pU - pL) * (i + 0.5) / n); H.push(clamp(Math.round(v * 10) / 10, L, U - 0.1)); }
  });
  H[40] = 160; H[110] = 170;   // the smallest values of the 160–170 and 170–180 classes sit exactly on a boundary (Station 2)
  var R = [];
  for (var i = 0; i < 200; i++) R.push(Math.round(150 + Math.exp(Math.log(120) + 0.45 * PhiInv((i + 0.5) / 200))));   // skewed right
  return {
    h:{ vals:H, lo:140, hi:200, widths:[20, 10, 5, 2], unit:"cm", per:"per cm", v:"h", tick:10, bw:2.5, def:[160, 170],
        name:"Heights of 200 Grade 12 students (cm, model data)", short:"heights" },
    r:{ vals:R, lo:150, hi:650, widths:[100, 50, 25, 10], unit:"ms", per:"per ms", v:"t", tick:50, bw:18, def:[250, 350],
        name:"Reaction times of 200 students (ms, model data)", short:"reaction times" }
  };
})();
function hist(ds, w){
  var D = DATA[ds], n = Math.round((D.hi - D.lo) / w), c = [], k;
  for (k = 0; k < n; k++) c.push(0);
  D.vals.forEach(function(x){ k = Math.floor((x - D.lo) / w + 1e-9); if (k >= 0 && k < n) c[k]++; });
  return c;
}
var KDE = {};
function kde(ds){
  if (KDE[ds]) return KDE[ds];
  var D = DATA[ds], h = D.bw, pts = [], N = D.vals.length, steps = 240;
  for (var i = 0; i <= steps; i++) {
    var x = D.lo + (D.hi - D.lo) * i / steps, s = 0;
    D.vals.forEach(function(v){ var z = (x - v) / h; s += Math.exp(-0.5 * z * z); });
    pts.push([x, s / (N * h * Math.sqrt(2 * Math.PI))]);
  }
  return (KDE[ds] = pts);
}
function kdeArea(ds, a, b){
  var P = kde(ds), A = 0;
  for (var i = 1; i < P.length; i++) { var x0 = Math.max(a, P[i - 1][0]), x1 = Math.min(b, P[i][0]); if (x1 > x0) A += (x1 - x0) * (P[i - 1][1] + P[i][1]) / 2; }
  return A;
}
function niceScale(m){
  if (!(m > 0)) m = 1;
  var raw = m / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p, s = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  return { ymax:Math.ceil(m / s - 1e-9) * s, step:s };
}
function dpOf(step){ var dp = 0; while (dp < 6 && Math.abs(step * Math.pow(10, dp) - Math.round(step * Math.pow(10, dp))) > 1e-9) dp++; return dp; }

// @component D10 densChart — histogram / density chart (course plan D10 + D8) on the toolkit's Plot engine, with its own axes so the
// y labels never clip. Bars (--pen) with optional dimming outside a selection, a --hi-soft selection band, a model density
// (outline --pen 3 px, light fill, --hi-soft shaded area), a frequency polygon (--ink-2 dashed with dots), a smooth curve
// (--ink 3 px, drawn up to a fraction t), a point stem, a cursor line, edge knobs for drag handles, labels and a title.
// densChart(plot, { x0, x1, ymax, yStep, xTicks:[…], xFmt, bars:[{a, b, h, dim}], barAlpha, band:{a, b}, dens:[[x, y]…],
//   shade:[[x, y]…], poly:[[x, y]…], curve:{pts, t}, point:{x, y}, cursor, knobs:[x…], labels:[{x, y, text}], title, yLabel, xLabel, describe })
function densChart(plot, o){
  var c = plot.c, r = c.getBoundingClientRect(), W = Math.max(200, r.width), H = Math.max(140, r.height);
  var L = 52, R = 16, T = o.title ? 30 : 22, B = 34, sx = (W - L - R) / (o.x1 - o.x0), sy = (H - T - B) / o.ymax;
  var view = { xmin:o.x0 - L / sx, xmax:o.x1 + R / sx, ymin:-B / sy, ymax:o.ymax + T / sy };
  plot.draw({ view:view, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var X = function(x){ return p.X(x); }, Y = function(y){ return p.Y(y); }, xa = X(o.x0), xb = X(o.x1), y0 = Y(0), yt = Y(o.ymax);
    var pen = css("--pen"), sheet = css("--sheet"), ink = css("--ink"), ink2 = css("--ink-2"), hs = css("--hi-soft"), fUI = p.fontUI, fM = p.fontM;
    function path(pts){ ctx.beginPath(); pts.forEach(function(q, i){ var px = X(q[0]), py = Y(Math.min(q[1], o.ymax * 1.06)); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }); }
    if (o.band) { ctx.fillStyle = hs; ctx.fillRect(X(o.band.a), yt, X(o.band.b) - X(o.band.a), y0 - yt); }
    // grid and y labels
    var step = o.yStep, dp = dpOf(step);
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    for (var v = step; v <= o.ymax + 1e-9; v += step) { var py = Math.round(Y(v)) + 0.5; ctx.moveTo(xa, py); ctx.lineTo(xb, py); }
    ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = "12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = 0; v <= o.ymax + 1e-9; v += step) ctx.fillText(MV.num(Math.round(v * 1e6) / 1e6, dp), xa - 6, Y(v));
    ctx.save(); ctx.beginPath(); ctx.rect(xa, Y(o.ymax * 1.08), xb - xa, y0 - Y(o.ymax * 1.08) + 1); ctx.clip();
    if (o.dens) { path(o.dens); ctx.closePath(); ctx.globalAlpha = 0.16; ctx.fillStyle = pen; ctx.fill(); ctx.globalAlpha = 1; }
    if (o.shade && o.shade.length > 1) { path(o.shade); ctx.closePath(); ctx.fillStyle = hs; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.stroke(); }
    (o.bars || []).forEach(function(b){
      if (!(b.h > 0)) return;
      var top = Y(Math.min(b.h, o.ymax * 1.06)), x1 = X(b.a), x2 = X(b.b);
      ctx.globalAlpha = (o.barAlpha == null ? 1 : o.barAlpha) * (b.dim ? 0.32 : 1);
      ctx.fillStyle = pen; ctx.fillRect(x1, top, x2 - x1, y0 - top);
      if (x2 - x1 >= 4) { ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.strokeRect(x1 + 0.5, top + 0.5, x2 - x1 - 1, y0 - top - 1); }
      ctx.globalAlpha = 1;
    });
    if (o.poly) {
      ctx.save(); ctx.strokeStyle = isDark() ? ink : ink2; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); path(o.poly); ctx.stroke(); ctx.restore();
      ctx.fillStyle = isDark() ? ink : ink2; o.poly.forEach(function(q){ ctx.beginPath(); ctx.arc(X(q[0]), Y(q[1]), 3.2, 0, Math.PI * 2); ctx.fill(); });
    }
    if (o.curve && o.curve.t > 0) {
      var cp = o.curve.pts, m = Math.max(2, Math.round(cp.length * Math.min(1, o.curve.t)));
      ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.lineJoin = "round"; path(cp.slice(0, m)); ctx.stroke();
    }
    if (o.dens) { ctx.strokeStyle = pen; ctx.lineWidth = 3; ctx.lineJoin = "round"; path(o.dens); ctx.stroke(); }
    ctx.restore();
    if (o.point) {
      ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(o.point.x), y0); ctx.lineTo(X(o.point.x), Y(o.point.y)); ctx.stroke();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(X(o.point.x), Y(o.point.y), 4, 0, Math.PI * 2); ctx.fill();
    }
    if (o.cursor != null && o.cursor >= o.x0 && o.cursor <= o.x1) {
      ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(X(o.cursor) + 0.5, yt); ctx.lineTo(X(o.cursor) + 0.5, y0); ctx.stroke(); ctx.restore();
    }
    // axes
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xa, yt - 6); ctx.lineTo(xa, y0); ctx.lineTo(xb, y0); ctx.stroke();
    (o.knobs || []).forEach(function(e){
      ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(e), yt); ctx.lineTo(X(e), y0); ctx.stroke();
      ctx.beginPath(); ctx.arc(X(e), y0, 7, 0, Math.PI * 2); ctx.fillStyle = ink; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = sheet; ctx.stroke();
    });
    // x labels
    ctx.fillStyle = ink; ctx.font = "13px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var ticks = o.xTicks || [], gap = ticks.length > 1 ? X(ticks[1]) - X(ticks[0]) : 99, every = gap >= 34 ? 1 : gap >= 17 ? 2 : 4;
    ticks.forEach(function(t, i){ if (i % every) return; ctx.fillText((o.xFmt || nx)(t), X(t), y0 + 10); });
    (o.labels || []).forEach(function(l){
      ctx.font = "700 13px " + fUI; ctx.textAlign = l.align || "center"; ctx.textBaseline = "bottom";
      var tw = ctx.measureText(l.text).width, lx = X(l.x), ly = Y(Math.min(l.y, o.ymax)) - 4, x0 = l.align === "left" ? lx : l.align === "right" ? lx - tw : lx - tw / 2;
      ctx.fillStyle = sheet; ctx.globalAlpha = 0.85; ctx.fillRect(x0 - 3, ly - 15, tw + 6, 16); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.fillText(l.text, lx, ly);
    });
    if (o.title) { ctx.fillStyle = ink; ctx.font = "700 14px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(o.title, xb, 4); }
    if (o.yLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yLabel, xa + 6, 4); }
    if (o.xLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(o.xLabel, xb, y0 - 4); }
  } });
}

// @component radioGroup (copied from MDM4U 18 / 15) — segmented control or chip row as a real radio group
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
function swHTML(id, on, label){ return '<button type="button" class="cc-switch cd-sw" role="switch" id="' + id + '" aria-checked="' + !!on + '" data-k="' + id + '"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>' + label + "</button>"; }

// ---------- data-view chart pieces ----------
var AXES = { f:{ t:"Frequency", y:"frequency" }, rf:{ t:"Relative frequency", y:"relative frequency" }, d:{ t:"Density", y:"density" } };
var YMAX = {};
function yScaleFor(ds, axis){
  var k = ds + axis; if (YMAX[k]) return YMAX[k];
  var D = DATA[ds], N = D.vals.length, m = 0;
  D.widths.forEach(function(w){ hist(ds, w).forEach(function(n){ m = Math.max(m, axis === "f" ? n : axis === "rf" ? n / N : n / N / w); }); });
  if (axis === "d") kde(ds).forEach(function(q){ m = Math.max(m, q[1]); });
  return (YMAX[k] = niceScale(m * 1.02));
}
function xTicksFor(D){ var t = []; for (var x = D.lo; x <= D.hi + 1e-9; x += D.tick) t.push(x); return t; }
// scene for a data histogram: o = {ds, w, axis, a, b, poly, smooth, curveT, barAlpha, sel, cursor, band, shadeCurve:[a, b]}
function dataScene(o){
  var D = DATA[o.ds], N = D.vals.length, c = hist(o.ds, o.w), sc = yScaleFor(o.ds, o.axis), k = o.axis === "f" ? N * o.w : o.axis === "rf" ? o.w : 1;
  var hOf = function(n){ return o.axis === "f" ? n : o.axis === "rf" ? n / N : n / N / o.w; };
  var bars = c.map(function(n, i){ var a = D.lo + i * o.w, b = a + o.w; return { a:a, b:b, h:hOf(n), dim:o.sel && (a < o.a - 1e-9 || b > o.b + 1e-9) }; });
  var s = { x0:D.lo, x1:D.hi, ymax:sc.ymax, yStep:sc.step, xTicks:xTicksFor(D), bars:bars, barAlpha:o.barAlpha, yLabel:AXES[o.axis].y, xLabel:D.v + " (" + D.unit + ")" };
  if (o.sel) { s.band = { a:o.a, b:o.b }; s.knobs = [o.a, o.b]; }
  if (o.poly) { s.poly = [[D.lo - o.w / 2, 0]].concat(c.map(function(n, i){ return [D.lo + (i + 0.5) * o.w, hOf(n)]; })).concat([[D.hi + o.w / 2, 0]]); }
  if (o.smooth || o.curveT) s.curve = { pts:kde(o.ds).map(function(q){ return [q[0], q[1] * k]; }), t:o.curveT == null ? 1 : o.curveT };
  if (o.shadeCurve) { var A = o.shadeCurve[0], B = o.shadeCurve[1]; s.shade = [[A, 0]].concat(kde(o.ds).filter(function(q){ return q[0] >= A - 1e-9 && q[0] <= B + 1e-9; }).map(function(q){ return [q[0], q[1] * k]; })).concat([[B, 0]]); }
  if (o.cursor != null) s.cursor = o.cursor;
  return s;
}

// ---------- model densities (D8) ----------
var SHAPES = { unif:{ t:"Uniform on [0, " + "`c`" + "]" }, tri:{ t:"Triangle `f(x) = x ÷ 50`" }, two:{ t:"Two-piece" }, bus:{ t:"Bus wait" } };
function modelOf(S){
  var sh = S.shape, c = S.c, h1 = F.of(S.h1, 40), h2 = F.of(S.h2, 40);
  if (sh === "unif" || sh === "bus") {
    var cc = sh === "bus" ? 20 : c, h = F.div(F.of(1), F.of(cc)), xmax = sh === "bus" ? 20 : cc <= 6 ? 6 : cc <= 10 ? 10 : 20;
    return { sh:sh, xmax:xmax, c:cc, h:h, maxH:1 / cc, unit:sh === "bus" ? "minute" : "unit",
      f:function(x){ return x >= 0 && x <= cc ? 1 / cc : 0; }, fTxt:function(x){ return x >= 0 && x <= cc ? F.txt(h) : "0"; },
      pts:[[0, 0], [0, 1 / cc], [cc, 1 / cc], [cc, 0]], brk:[0, cc],
      def:M("f(x) = " + F.txt(h)) + " on [0, " + nx(cc) + "]" + (sh === "bus" ? " minutes" : ""),
      area:function(a, b){ var w = Math.max(0, Math.min(b, cc) - Math.max(a, 0)); var A = F.mul(F.of(w), h); return { A:A, txt:(w === 0 ? "0" : nx(w) + " × " + F.txt(h) + " = " + fTxt(A)) + (b > cc + 1e-9 && a < cc ? " (only " + nx(Math.max(a, 0)) + " to " + nx(cc) + " lies under the density)" : "") }; },
      total:function(){ return { A:F.of(1), txt:nx(cc) + " × " + F.txt(h) + " = 1" }; } };
  }
  if (sh === "tri") {
    return { sh:sh, xmax:10, maxH:0.2, unit:"unit",
      f:function(x){ return x >= 0 && x <= 10 ? x / 50 : 0; }, fTxt:function(x){ return x >= 0 && x <= 10 ? d4(x / 50) : "0"; },
      pts:[[0, 0], [10, 0.2], [10, 0]], brk:[0, 10], def:M("f(x) = x ÷ 50") + " on [0, 10]",
      area:function(a, b){ var A2 = clamp(a, 0, 10), B2 = clamp(b, 0, 10), A = F.of(Math.round((B2 * B2 - A2 * A2) * 4), 400);
        return { A:A, txt:(A2 === 0 ? "½ × " + nx(B2) + " × " + d4(B2 / 50) : "(" + nx(B2) + "² − " + nx(A2) + "²) ÷ 100") + " = " + F.dec(A, 4) }; },
      total:function(){ return { A:F.of(1), txt:"½ × 10 × 0.2 = 1" }; } };
  }
  var tot = F.add(F.mul(F.of(4), h1), F.mul(F.of(6), h2));
  return { sh:"two", xmax:10, maxH:Math.max(S.h1, S.h2) / 40, unit:"unit",
    f:function(x){ return x >= 0 && x < 4 ? S.h1 / 40 : x >= 4 && x <= 10 ? S.h2 / 40 : 0; }, fTxt:function(x){ return x >= 0 && x < 4 ? F.dec(h1, 4) : x >= 4 && x <= 10 ? F.dec(h2, 4) : "0"; },
    pts:[[0, 0], [0, S.h1 / 40], [4, S.h1 / 40], [4, S.h2 / 40], [10, S.h2 / 40], [10, 0]], brk:[0, 4, 10],
    def:M("h_1") + " = " + F.dec(h1, 4) + " on [0, 4), " + M("h_2") + " = " + F.dec(h2, 4) + " on [4, 10]",
    area:function(a, b){
      var w1 = Math.max(0, Math.min(b, 4) - Math.max(a, 0)), w2 = Math.max(0, Math.min(b, 10) - Math.max(a, 4)), A = F.add(F.mul(F.of(w1), h1), F.mul(F.of(w2), h2)), parts = [];
      if (w1 > 0) parts.push(nx(w1) + " × " + F.dec(h1, 4)); if (w2 > 0) parts.push(nx(w2) + " × " + F.dec(h2, 4));
      return { A:A, txt:(parts.length ? parts.join(" + ") + " = " : "") + F.dec(A, 4) }; },
    total:function(){ return { A:tot, txt:"4 × " + F.dec(h1, 4) + " + 6 × " + F.dec(h2, 4) + " = " + F.dec(tot, 4) }; } };
}
function shadePts(m, a, b){
  var xs = [a, b]; m.brk.forEach(function(x){ if (x > a && x < b) { xs.push(x - 1e-6); xs.push(x + 1e-6); } });
  for (var i = 1; i < 60; i++) xs.push(a + (b - a) * i / 60);
  xs.sort(function(p, q){ return p - q; });
  return [[a, 0]].concat(xs.map(function(x){ return [x, m.f(x)]; })).concat([[b, 0]]);
}

// ---------- Explore: From bars to curves ----------
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (S.view !== "model") S.view = "data";
    if (!DATA[S.ds]) S.ds = "h";
    S.w = S.w && typeof S.w === "object" ? S.w : {};
    Object.keys(DATA).forEach(function(k){ if (DATA[k].widths.indexOf(+S.w[k]) < 0) S.w[k] = DATA[k].widths[1]; });
    if (!AXES[S.axis]) S.axis = "d";
    S.poly = !!S.poly; S.smooth = !!S.smooth;
    S.da = S.da && typeof S.da === "object" ? S.da : {};
    Object.keys(DATA).forEach(function(k){ var iv = S.da[k]; if (!Array.isArray(iv) || iv.length !== 2 || !(+iv[0] < +iv[1])) S.da[k] = DATA[k].def.slice(); snapData(k); });
    if (!SHAPES[S.shape]) S.shape = "bus";
    S.c = clamp(Math.round((+S.c || 10) * 2) / 2, 0.5, 20);
    S.h1 = clampI(S.h1, 1, 10, 4); S.h2 = clampI(S.h2, 1, 10, 4);
    S.point = !!S.point; S.pt = +S.pt; if (!isFinite(S.pt)) S.pt = 7;
    S.ma = +S.ma; S.mb = +S.mb; if (!isFinite(S.ma) || !isFinite(S.mb) || S.mb <= S.ma) { S.ma = 5; S.mb = 10; }
    S.tc3 = S.tc3 && typeof S.tc3 === "object" ? S.tc3 : {};
    fixModel();
  }
  function snapData(k){
    var D = DATA[k], w = S.w[k], iv = S.da[k], sn = function(x){ return clamp(D.lo + Math.round((x - D.lo) / w) * w, D.lo, D.hi); };
    var a = sn(+iv[0]), b = sn(+iv[1]); if (b <= a) b = a + w; if (b > D.hi) { b = D.hi; a = Math.min(a, b - w); }
    S.da[k] = [a, b];
  }
  function fixModel(){
    var xm = modelOf(S).xmax, h = function(x){ return clamp(Math.round(x * 2) / 2, 0, xm); };
    S.ma = h(S.ma); S.mb = h(S.mb); S.pt = h(S.pt);
    if (S.mb <= S.ma) { if (S.ma >= xm) S.ma = xm - 0.5; S.mb = S.ma + 0.5; }
  }
  sanitize();
  var pv = {}, cursor = null, anim = { id:0, done:null }, plot, drag, R = {};

  host.innerHTML =
    '<div class="cd-top"><div id="cd-view"></div></div>' +
    '<div class="pg cd-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap cd-cap" id="cd-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot cd-plot" id="cd-plot" role="img" aria-label="Density histogram"></canvas></div>' +
      '<p class="tiny muted cd-tip">Drag the dark knobs on the axis, or focus one (Tab) and use the arrow keys' + ' (Shift: bigger steps). Point at the graph to read the density there.</p></div>' +
    '<div class="pg-ctrl cd-ctrl">' +
      '<div id="cd-dctl"><div id="cd-ds"></div><div id="cd-w"></div><div id="cd-ax"></div><div class="cd-sws">' + swHTML("cd-poly", S.poly, "Frequency polygon") + swHTML("cd-smooth", S.smooth, "Smooth curve") + "</div></div>" +
      '<div id="cd-mctl"><div id="cd-shape"></div>' +
        '<label class="slider" id="cd-cbox"><span class="slider-top"><span>' + M("c") + ' (uniform on [0, ' + M("c") + '])</span><output id="cd-c-out"></output></span><input type="range" id="cd-c" min="0.5" max="20" step="0.5"></label>' +
        '<div id="cd-hbox"><label class="slider"><span class="slider-top"><span>' + M("h_1") + ' on [0, 4)</span><output id="cd-h1-out"></output></span><input type="range" id="cd-h1" min="1" max="10" step="1"></label>' +
        '<label class="slider"><span class="slider-top"><span>' + M("h_2") + ' on [4, 10]</span><output id="cd-h2-out"></output></span><input type="range" id="cd-h2" min="1" max="10" step="1"></label></div>' +
        '<div class="cd-sws">' + swHTML("cd-point", S.point, "Single point (width 0)") + "</div></div>" +
    '</div><div class="pg-read"><dl class="read cd-read" id="cd-read" aria-live="polite"></dl></div></div>';

  function save(){ api.save(); }
  function W(){ return S.w[S.ds]; }
  function cancelAnim(){ anim.id++; var d = anim.done; anim.done = null; pv = {}; if (d) d(); }
  function later(ms, fn){ var my = anim.id; MV.wait(MV.reduceMotion ? 20 : ms, function(){ if (my === anim.id) fn(); }); }
  function user(){ if (anim.done) cancelAnim(); }

  R.view = radios($("#cd-view", host), { label:"View", options:[{ id:"data", t:"Data" }, { id:"model", t:"Model densities" }], value:S.view, cls:"seg",
    onChange:function(v){ user(); S.view = v; cursor = null; save(); render(); } });
  R.ds = radios($("#cd-ds", host), { label:"Data set", options:Object.keys(DATA).map(function(k){ return { id:k, t:DATA[k].name }; }), value:S.ds, cls:"chips",
    onChange:function(v){ user(); S.ds = v; cursor = null; R.w.setOptions(wOpts()); R.w.set(String(W())); save(); render(); } });
  function wOpts(){ var D = DATA[S.ds]; return D.widths.map(function(w){ return { id:String(w), t:w + " " + D.unit }; }); }
  R.w = radios($("#cd-w", host), { label:"Class width", options:wOpts(), value:String(W()), cls:"chips",
    onChange:function(v){ user(); S.w[S.ds] = +v; snapData(S.ds); save(); render(); } });
  R.ax = radios($("#cd-ax", host), { label:"Vertical axis", options:Object.keys(AXES).map(function(k){ return { id:k, t:AXES[k].t + (k === "d" ? " (relative frequency ÷ width)" : "") }; }), value:S.axis, cls:"chips",
    onChange:function(v){ user(); S.axis = v; save(); render(); } });
  R.shape = radios($("#cd-shape", host), { label:"Shape", options:Object.keys(SHAPES).map(function(k){ return { id:k, t:MV.md(SHAPES[k].t) }; }), value:S.shape, cls:"chips",
    onChange:function(v){ user(); S.shape = v; fixModel(); cursor = null; save(); render(); } });

  host.addEventListener("click", function(e){
    var b = e.target.closest("button.cd-sw"); if (!b) return;
    user();
    if (b.id === "cd-poly") S.poly = !S.poly;
    else if (b.id === "cd-smooth") S.smooth = !S.smooth;
    else if (b.id === "cd-point") { S.point = !S.point; if (S.point) S.pt = clamp(Math.round((S.ma + S.mb)), 0, 2 * modelOf(S).xmax) / 2; }
    save(); render();
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.id) return;
    if (t.id === "cd-c") { user(); S.c = clamp(Math.round(+t.value * 2) / 2, 0.5, 20); fixModel(); }
    else if (t.id === "cd-h1") { user(); S.h1 = clampI(t.value, 1, 10, 4); }
    else if (t.id === "cd-h2") { user(); S.h2 = clampI(t.value, 1, 10, 4); }
    else return;
    save(); render();
  });

  plot = new MV.Plot($("#cd-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = draw;
  function moveH(id, x){
    if (S.view === "data") {
      var D = DATA[S.ds], w = W(), iv = S.da[S.ds]; x = clamp(D.lo + Math.round((x - D.lo) / w) * w, D.lo, D.hi);
      if (id === "a") iv[0] = Math.min(x, iv[1] - w); else iv[1] = Math.max(x, iv[0] + w);
    } else {
      var xm = modelOf(S).xmax; x = clamp(Math.round(x * 2) / 2, 0, xm);
      if (id === "p") S.pt = x; else if (id === "a") S.ma = Math.min(x, S.mb - 0.5); else S.mb = Math.max(x, S.ma + 0.5);
    }
    save(); render();
  }
  function hval(id){ return S.view === "data" ? S.da[S.ds][id === "a" ? 0 : 1] : id === "p" ? S.pt : id === "a" ? S.ma : S.mb; }
  drag = MV.drag(plot, { axis:"x",
    handles:function(){
      if (S.view === "data") { var D = DATA[S.ds], iv = S.da[S.ds]; return [{ id:"a", x:iv[0], y:0, label:"Left end of the interval, " + D.v + " = " + iv[0] + " " + D.unit }, { id:"b", x:iv[1], y:0, label:"Right end of the interval, " + D.v + " = " + iv[1] + " " + D.unit }]; }
      if (S.point) return [{ id:"p", x:S.pt, y:0, label:"Point at x = " + nx(S.pt) }];
      return [{ id:"a", x:S.ma, y:0, label:"Interval start a = " + nx(S.ma) }, { id:"b", x:S.mb, y:0, label:"Interval end b = " + nx(S.mb) }];
    },
    snap:function(x){ return [x, 0]; },
    key:function(id, e){
      var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return false;
      user(); var st = S.view === "data" ? W() : e.shiftKey ? 1 : 0.5; moveH(id, hval(id) + d * st); return true;
    },
    move:function(id, x){ user(); moveH(id, x); } });
  var raf = 0;
  plot.c.addEventListener("pointermove", function(e){
    if (e.buttons) return;
    var r = plot.c.getBoundingClientRect(), x = plot.xOf(e.clientX - r.left);
    cursor = x; if (!raf) raf = requestAnimationFrame(function(){ raf = 0; draw(); paintRead(); });
  });
  plot.c.addEventListener("pointerleave", function(){ cursor = null; draw(); paintRead(); });

  function curX(){
    if (S.view === "data") { var D = DATA[S.ds], iv = S.da[S.ds]; return cursor != null && cursor >= D.lo && cursor < D.hi ? cursor : (iv[0] + iv[1]) / 2; }
    var m = modelOf(S); if (cursor != null && cursor >= 0 && cursor <= m.xmax) return cursor; return S.point ? S.pt : (S.ma + S.mb) / 2;
  }
  function dataInfo(){
    var D = DATA[S.ds], w = W(), c = hist(S.ds, w), iv = S.da[S.ds], N = D.vals.length, n = 0, k = 0, first = -1;
    c.forEach(function(v, i){ var a = D.lo + i * w; if (a >= iv[0] - 1e-9 && a + w <= iv[1] + 1e-9) { n += v; k++; if (first < 0) first = i; } });
    return { D:D, w:w, c:c, a:iv[0], b:iv[1], N:N, n:n, k:k, first:first, classes:c.length };
  }
  function draw(){
    if (S.view === "data") {
      var I = dataInfo(), s = dataScene({ ds:S.ds, w:I.w, axis:S.axis, a:I.a, b:I.b, poly:S.poly, smooth:S.smooth, sel:true, cursor:cursor != null ? curX() : null });
      s.describe = AXES[S.axis].t + " histogram of 200 " + I.D.short + ", width " + I.w + " " + I.D.unit + "; selected " + I.a + " to " + I.b + (S.axis === "d" ? ", area " + d4(I.n / I.N) : ", proportion " + d4(I.n / I.N)) + "." +
        (S.poly ? " Frequency polygon on." : "") + (S.smooth ? " Smooth curve on." : "");
      densChart(plot, s);
      return;
    }
    var m = modelOf(S), sc = niceScale(m.maxH * 1.0001), xt = [], stp = m.xmax <= 10 ? 1 : 2;
    for (var x = 0; x <= m.xmax + 1e-9; x += stp) xt.push(x);
    var o = { x0:0, x1:m.xmax, ymax:sc.ymax, yStep:sc.step, xTicks:xt, dens:m.pts, yLabel:"density", xLabel:m.sh === "bus" ? "minutes" : "x", cursor:cursor != null ? curX() : null };
    if (S.point) { o.point = { x:S.pt, y:m.f(S.pt) }; o.knobs = [S.pt]; }
    else { o.shade = shadePts(m, S.ma, S.mb); o.knobs = [S.ma, S.mb]; }
    if (pv.title) o.title = pv.title;
    var A = S.point ? null : m.area(S.ma, S.mb);
    o.describe = "Model density: " + MV.plain(m.def) + ". " + (S.point ? "Single point at " + nx(S.pt) + ", probability 0." : "Shaded from " + nx(S.ma) + " to " + nx(S.mb) + (pv.hide ? "." : ", area " + F.dec(A.A, 4) + "."));
    densChart(plot, o);
  }
  function paintRead(){
    var rows = [];
    if (S.view === "data") {
      var I = dataInfo(), D = I.D, v = D.v, x = curX(), ci = clamp(Math.floor((x - D.lo) / I.w + 1e-9), 0, I.classes - 1), dens = I.c[ci] / I.N / I.w;
      rows.push(["Class width", I.w + " " + D.unit + " (" + I.classes + " classes)"]);
      rows.push(["Selected interval", M(I.a + " ≤ " + v + " < " + I.b)]);
      rows.push(["Proportion of data", I.n + " ÷ " + I.N + " = " + d4(I.n / I.N)]);
      if (S.axis === "d") {
        var area = I.k === 1 ? d4(I.c[I.first] / I.N / I.w) + " " + D.per + " × " + I.w + " " + D.unit + " = " + d4(I.n / I.N) : "the " + I.k + " bar areas (density × " + I.w + " " + D.unit + ") add to " + d4(I.n / I.N);
        if (S.smooth) area += "; under the curve ≈ " + d2(kdeArea(S.ds, I.a, I.b));
        rows.push(["Area under the bars" + (S.smooth ? " or curve" : ""), area]);
      } else rows.push(["Bar heights in the interval", "add to " + (S.axis === "f" ? I.n + " (counts)" : d4(I.n / I.N) + " (relative frequency)") + "; switch to Density to read area"]);
      rows.push(["Density at the cursor", "at " + M(v + " = " + nx(Math.round(x * 10) / 10)) + ": " + d4(dens) + " " + D.per + " (a density, not a probability)"]);
      rows.push(["Total area", S.axis === "d" ? "1" : S.axis === "f" ? "total = " + I.N : "the heights add to 1"]);
    } else {
      var m = modelOf(S), cx = curX(), per = "per " + m.unit;
      rows.push(["Density", m.def]);
      if (S.point) {
        rows.push(["Selected interval", M("X = " + nx(S.pt)) + " (a single point)"]);
        rows.push(["Point probability", pv.hide ? "?" : M("P(X = " + nx(S.pt) + ") = 0") + " (width 0)"]);
      } else {
        rows.push(["Selected interval", M(nx(S.ma) + " ≤ X ≤ " + nx(S.mb))]);
        rows.push(["Area = probability", pv.hide ? "?" : M("P(" + nx(S.ma) + " ≤ X ≤ " + nx(S.mb) + ")") + " = " + m.area(S.ma, S.mb).txt]);
      }
      rows.push(["Density at the cursor", "at " + M("x = " + nx(Math.round(cx * 100) / 100)) + ": " + m.fTxt(cx) + " " + per + " (a density, not a probability)"]);
      var T = m.total(), ok = F.eq(T.A, F.of(1));
      rows.push(["Total area", pv.hide ? "?" : T.txt + (ok ? " ✓" : ": not a valid density (the total must be 1)")]);
    }
    $("#cd-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCtl(){
    $("#cd-dctl", host).hidden = S.view !== "data"; $("#cd-mctl", host).hidden = S.view !== "model";
    $("#cd-poly", host).setAttribute("aria-checked", String(S.poly)); $("#cd-smooth", host).setAttribute("aria-checked", String(S.smooth)); $("#cd-point", host).setAttribute("aria-checked", String(S.point));
    R.view.set(S.view); R.ds.set(S.ds); R.w.setOptions(wOpts()); R.w.set(String(W())); R.ax.set(S.axis); R.shape.set(S.shape);
    $("#cd-cbox", host).hidden = S.shape !== "unif"; $("#cd-hbox", host).hidden = S.shape !== "two";
    var c = $("#cd-c", host); c.value = S.c; c.setAttribute("aria-valuetext", "c = " + nx(S.c)); $("#cd-c-out", host).textContent = nx(S.c);
    [1, 2].forEach(function(i){ var el = $("#cd-h" + i, host), v = S["h" + i]; el.value = v; el.setAttribute("aria-valuetext", "h" + i + " = " + d4(v / 40)); $("#cd-h" + i + "-out", host).textContent = d4(v / 40); });
    var cap = $("#cd-cap", host);
    if (pv.cap) cap.innerHTML = pv.cap;
    else if (S.view === "data") cap.innerHTML = AXES[S.axis].t + " histogram · " + W() + "-" + DATA[S.ds].unit + " classes";
    else cap.innerHTML = modelOf(S).def;
    $("#cd-plot", host).setAttribute("aria-label", S.view === "data" ? AXES[S.axis].t + " histogram" : "Model density curve");
  }
  function render(){ paintCtl(); draw(); paintRead(); MV.changed(); }
  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim();
    var s = p.start || {};
    S.view = s.view;
    if (s.view === "data") { S.ds = s.ds; S.axis = s.axis; S.w[s.ds] = s.w; S.poly = false; S.smooth = false; S.da[s.ds] = DATA[s.ds].def.slice(); snapData(s.ds); }
    else {
      S.shape = s.shape; S.point = false;
      if (s.shape === "bus") { S.ma = s.pt - 2; S.mb = s.pt + 2; }
      if (s.shape === "unif") { S.c = s.c; S.ma = 0; S.mb = s.c; }
      fixModel(); pv = { hide:true };
    }
    cursor = null; save(); render();
  }
  function runPred(p, done){
    anim.done = done;
    var my = anim.id;
    function finish(){ if (my !== anim.id) return; var d = anim.done; anim.done = null; pv = {}; render(); if (d) d(); }
    if (p.id === "p1" || p.id === "p2") {
      var unit = DATA.h.unit;
      later(500, function(){ S.w.h = 5; snapData("h"); pv = { cap:"5-" + unit + " classes" }; save(); render();
        later(1100, function(){ S.w.h = 2; snapData("h"); pv = { cap:"2-" + unit + " classes: 5 times narrower than 10 cm" }; save(); render();
          if (p.id === "p1") later(900, finish);
          else later(900, function(){ S.smooth = true; pv = { cap:"Density: the outline holds, and a smooth curve appears" }; save(); render(); later(700, finish); });
        });
      });
      return;
    }
    if (p.id === "p3") {
      var k = 0;
      (function step(){
        if (my !== anim.id) return;
        if (k < 4) { k++; S.ma += 0.5; S.mb -= 0.5; pv = { title:"Width " + nx(S.mb - S.ma) + ": area " + F.dec(modelOf(S).area(S.ma, S.mb).A, 4) }; save(); render(); later(450, step); return; }
        S.point = true; S.pt = 7; S.ma = 6; S.mb = 8; pv = { title:"Width 0: area 0" }; save(); render(); later(900, finish);
      })();
      return;
    }
    // p4
    later(400, function(){ pv = { title:"Total area = 2 × 0.5 = 1" }; render(); later(1000, finish); });
  }

  // --- challenges ---
  function chal(id, opt){
    var live = opt && opt.live, R2 = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (S.view !== "model") return R2("Switch the view to <strong>Model densities</strong>.");
    var m = modelOf(S);
    if (id === "tc1") {
      if (S.shape === "unif" && S.c === 4) return R2("The height is `1/20` everywhere; probability is area.");
      if (S.shape !== "bus") return R2("Choose the <strong>Bus wait</strong> shape.");
      if (S.point) return R2("A single point has probability 0. Turn the point off and select an interval.");
      var L = S.mb - S.ma;
      if (L === 5) return { ok:true };
      if (L === 4) return R2("Area = 4 × `1/20 = 1/5`.");
      return R2("Area = " + nx(L) + " × `1/20` = `" + F.txt(m.area(S.ma, S.mb).A) + "`, not `1/4`.");
    }
    if (id === "tc2") {
      if (S.shape !== "tri") return R2("Choose the <strong>Triangle</strong> shape.");
      if (S.point) return R2("A single point has probability 0. Turn the point off and select an interval.");
      if (S.ma !== 0) return R2("Start the interval at 0: select [0, `b`].");
      var b = S.mb;
      if (b === 6) return { ok:true };
      if (b === 3.5 || b === 4) return R2("Area = ½ × " + nx(b) + " × " + d4(b / 50) + " ≈ " + d2(b * b / 100) + ". Area grows like `b^2`, not `b`.");
      if (b === 9) return R2("0.81.");
      return R2("Area = `b^2` ÷ 100 = " + d4(b * b / 100) + ", not 0.36.");
    }
    if (id === "tc3") {
      if (S.shape !== "unif") return R2("Choose the <strong>Uniform</strong> shape and move the `c` slider.");
      var c = S.c, P = c <= 2 ? F.of(0) : F.div(F.of(Math.min(c, 5) - 2), F.of(c)), good = c === 4 || c === 6, found = S.tc3;
      if (live) return { ok:good && (found[4] || c === 4) && (found[6] || c === 6) };
      if (good) {
        var fresh = !found[c]; found[c] = true; save();
        if (found[4] && found[6]) return { ok:true };
        // A first correct answer isn't a miss: undo the try the toolkit is about to count.
        var cs = MV.S && MV.S.chal && MV.S.chal.tc3; if (fresh && cs) cs.tries = (cs.tries || 0) - 1;
        return R2("✓ `c = " + c + "` works: `P(2 <= X <= 5)` = " + (c === 6 ? "3 ÷ 6" : "(4 − 2) ÷ 4") + " = `1/2`. There are two answers: find the other one and check again.");
      }
      if (c === 10) return R2("`3/10`.");
      if (c === 3) return R2("Only 2 to 3 counts: `1/3`.");
      if (c <= 2) return R2("The density stops at `c = " + nx(c) + "`, before 2, so `P(2 <= X <= 5) = 0`.");
      return R2("With `c = " + nx(c) + "`, `P(2 <= X <= 5)` = " + (c >= 5 ? "3 ÷ " + nx(c) : "(" + nx(c) + " − 2) ÷ " + nx(c)) + " ≈ " + d4(F.val ? F.val(P) : P.n / P.d) + ", not `1/2`." +
        (found[4] || found[6] ? " You’ve found `c = " + (found[4] ? 4 : 6) + "`; look for the other answer." : ""));
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id, opt){ return chal(id, opt); } };
}

// ---------- hero: 10-cm → 5-cm → 2-cm density histogram, smooth curve, 160–170 shaded ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "";
  var st = { w:10, alpha:0, curve:0, fade:1, shade:0, total:0 };
  plot.render = function(){
    var s = dataScene({ ds:"h", w:st.w, axis:"d", barAlpha:st.alpha * st.fade, curveT:st.curve });
    s.xLabel = "height (cm)"; s.describe = aria;
    if (st.shade) { s.shadeCurve = [160, 170]; s.labels = [{ x:165, y:0.046, text:"area ≈ 0.35 = 35% of students" }]; }
    if (st.total) s.title = "total area = 1";
    if (!st.curve) delete s.curve;
    densChart(plot, s);
  };
  var cap = f.cap;
  function last(){ st = { w:2, alpha:1, curve:1, fade:0.2, shade:1, total:1 }; plot.render(); cap.textContent = "P(160 ≤ X ≤ 170) = area under the density curve ≈ 0.35. Total area = 1."; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "200 heights (model data): density histogram, 10-cm classes";
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  MV.wait(300, function(){
    tw(600, function(t){ st.alpha = t; plot.render(); }, function(){
      MV.wait(1100, function(){
        st.w = 5; plot.render(); cap.textContent = "5-cm classes: the outline keeps its shape";
        MV.wait(1200, function(){
          st.w = 2; plot.render(); cap.textContent = "2-cm classes: more bars, same outline";
          MV.wait(1200, function(){
            cap.textContent = "A smooth density curve traces the tops";
            tw(1500, function(t){ st.curve = t; plot.render(); }, function(){
              tw(600, function(t){ st.fade = 1 - 0.8 * t; plot.render(); }, function(){
                MV.wait(500, function(){
                  cap.textContent = "Probability = area: 160 to 170 cm";
                  st.shade = 1; plot.render();
                  MV.wait(1300, function(){ last(); });
                });
              });
            });
          });
        });
      });
    });
  });
}

// ---------- Part 3: Measurement challenges (four stations) ----------
var S1REC = [{ id:"r1", t:"12.3 s (to the nearest 0.1 s)", ans:"i1", step:"0.1 s" }, { id:"r2", t:"54 kg", ans:"i2", step:"1 kg" }, { id:"r3", t:"8 min", ans:"i3", step:"1 min" }];
var S1INT = { i1:"12.25 ≤ `t` < 12.35", i2:"53.5 ≤ `m` < 54.5", i3:"7.5 ≤ `t` < 8.5" }, S1ORDER = ["i3", "i1", "i2"];
var S2VAL = [{ id:"v160", t:"160.0 cm", ans:"c160" }, { id:"v170", t:"170.0 cm", ans:"c170" }];
var S2CLS = [{ id:"c150", t:"[150, 160)" }, { id:"c160", t:"[160, 170)" }, { id:"c170", t:"[170, 180)" }];
// VERIFY: Ontario Grade 12 enrolment of about 160 000 is the plan's approximate figure ("verify before release").
var POP = 160000;
var S3CH = [{ id:"time", t:"time" }, { id:"cost", t:"cost" }, { id:"destroy", t:"some measurements destroy the item (e.g. testing a light bulb’s life)" }, { id:"all", t:"all of these" }];
var S4A = [12, 15, 16, 17, 18, 19, 22, 23, 24, 26], S4B = [12, 14, 15, 17, 19, 20, 21, 23, 25, 26];
var S4CH = [{ id:"same", t:"They’re identical" }, { id:"little", t:"They differ a little" }, { id:"diff", t:"They’re completely different" }];
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  ["s1", "s2"].forEach(function(k){ S[k] = S[k] && typeof S[k] === "object" ? S[k] : {}; });
  var tabsR, sub = [], plots = {};
  host.innerHTML = '<div id="cm-tabs" class="cm-tabs"></div><div id="cm-body" class="cm-body"></div>';
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function done(id){
    if (id === "s1") return S1REC.every(function(r){ return S.s1[r.id] === r.ans; });
    if (id === "s2") return S2VAL.every(function(r){ return S.s2[r.id] === r.ans; });
    if (id === "s3") return S.s3 === "all";
    return S.s4 === "little";
  }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.title + (done(s.id) ? ' <span class="cm-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  tabsR = radios($("#cm-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function refreshTabs(){ tabText(); tabsR.refresh(); }
  function fbRow(ok, good, bad){ return ok == null ? "" : ok ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + good) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + bad); }

  function ruler(){
    var x = function(v){ return 20 + (v - 171) * 140; }, h = '<svg class="cm-ruler" viewBox="0 0 320 96" role="img" aria-label="A ruler from 171 to 173 cm. The band from 171.5 to 172.5 cm is shaded: every height in it rounds to 172 cm.">';
    h += '<rect class="cm-band" x="' + x(171.5) + '" y="8" width="140" height="56"></rect>';
    h += '<line class="cm-edge" x1="20" y1="64" x2="300" y2="64"></line>';
    for (var i = 0; i <= 20; i++) { var v = 171 + i / 10, len = i % 10 === 0 ? 22 : i % 5 === 0 ? 15 : 9; h += '<line class="cm-tk" x1="' + x(v) + '" y1="64" x2="' + x(v) + '" y2="' + (64 - len) + '"></line>'; }
    [171, 172, 173].forEach(function(v){ h += '<text class="cm-num" x="' + x(v) + '" y="84" text-anchor="middle">' + v + "</text>"; });
    h += '<line class="cm-mark" x1="' + x(172) + '" y1="6" x2="' + x(172) + '" y2="64"></line>';
    h += '<text class="cm-rl" x="' + x(171.5) + '" y="20" dx="4">171.5</text><text class="cm-rl" x="' + x(172.5) + '" y="20" dx="-4" text-anchor="end">172.5</text>';
    return h + "</svg>";
  }
  function s1(body, s){
    body.innerHTML = '<p class="cm-text">' + s.text + "</p>" + ruler() + '<p class="cm-eq">' + MV.md("Recorded 172 cm stands for 171.5 ≤ `h` < 172.5") + '</p><p class="cm-sub">' + s.match + "</p>" +
      S1REC.map(function(r){ return '<div class="cm-row"><div class="cm-rq">' + r.t + '</div><div id="cm1-' + r.id + '"></div><div id="cm1fb-' + r.id + '" aria-live="polite"></div></div>'; }).join("") +
      '<details class="alg"><summary>Check it with data</summary>' + MV.tableHTML({ head:["Recording", "Rounded to the nearest", "True interval", "Width"], caption:"Each recording stands for an interval",
        rows:[["172 cm", "1 cm", MV.md("171.5 ≤ `h` < 172.5"), "1 cm"]].concat(S1REC.map(function(r){ return [r.t.replace(/ \(.*\)$/, ""), r.step, MV.md(S1INT[r.ans]), r.step]; })) }) +
      '<p class="tiny">Every interval is one rounding step wide and centred on the recording. A recorded value is never exact.</p></details>';
    S1REC.forEach(function(r){
      sub.push(radios($("#cm1-" + r.id, body), { aria:"True interval for " + r.t, options:S1ORDER.map(function(k){ return { id:k, t:MV.md(S1INT[k]) }; }), value:S.s1[r.id] || "", cls:"chips",
        onChange:function(v){ S.s1[r.id] = v; api.save(); s1fb(r); refreshTabs(); } }));
      s1fb(r);
    });
    function s1fb(r){ var v = S.s1[r.id]; $("#cm1fb-" + r.id, body).innerHTML = v ? fbRow(v === r.ans, "Half a rounding step on each side.", s.fb) : ""; }
  }
  function s2(body, s){
    var w10 = hist("h", 10), onB = DATA.h.vals.filter(function(v){ return Math.abs(v / 10 - Math.round(v / 10)) < 1e-9; });
    body.innerHTML = '<p class="cm-text">' + s.text + '</p><p class="cm-sub">Where does each boundary value go?</p>' +
      S2VAL.map(function(r){ return '<div class="cm-row"><div class="cm-rq">' + r.t + '</div><div id="cm2-' + r.id + '"></div><div id="cm2fb-' + r.id + '" aria-live="polite"></div></div>'; }).join("") +
      '<details class="alg"><summary>Check it with data</summary>' + MV.tableHTML({ head:["Class (cm)", "Count"], caption:"200 heights (model data), left endpoint included",
        rows:w10.map(function(n, i){ return ["[" + (140 + 10 * i) + ", " + (150 + 10 * i) + ")", String(n)]; }).concat([["Total", String(w10.reduce(function(a, b){ return a + b; }, 0))]]) }) +
      '<p class="tiny">' + onB.length + " of the 200 values sit exactly on a boundary (" + onB.map(function(v){ return v.toFixed(1); }).join(", ") + "). With the rule, each is counted once and the total stays 200. Counting them in both classes would give " + (200 + onB.length) + ".</p></details>";
    S2VAL.forEach(function(r){
      sub.push(radios($("#cm2-" + r.id, body), { aria:"Class for " + r.t, options:S2CLS, value:S.s2[r.id] || "", cls:"chips",
        onChange:function(v){ S.s2[r.id] = v; api.save(); s2fb(r); refreshTabs(); } }));
      s2fb(r);
    });
    function s2fb(r){ var v = S.s2[r.id]; $("#cm2fb-" + r.id, body).innerHTML = v ? fbRow(v === r.ans, "The left endpoint is included, so " + r.t + " starts the class " + S2CLS.filter(function(c){ return c.id === r.ans; })[0].t + ".", s.fb) : ""; }
  }
  function s3(body, s){
    var pct = 200 / POP * 100;
    body.innerHTML = '<p class="cm-text">' + s.text + '</p><div class="cm-pop" role="img" aria-label="A long bar for about 160 000 students next to a sliver for the sample of 200: the sample is 0.125% of the population.">' +
      '<div class="cm-pbar"><span>All Grade 12 students in Ontario: about ' + MV.mdm.fmt(POP) + ' (approximate)</span></div><div class="cm-sbar"><i style="width:' + Math.max(0.6, pct) + '%"></i><span>Sample: 200</span></div></div>' +
      '<p class="cm-sub">' + s.q + '</p><div id="cm3"></div><div id="cm3fb" aria-live="polite"></div>' +
      '<details class="alg"><summary>Check it with data</summary>' + MV.tableHTML({ head:["Group", "Students", "Time at 2 min each"], caption:"Measuring everyone vs a sample",
        rows:[["Everyone (approximate)", MV.mdm.fmt(POP), MV.mdm.fmt(POP * 2) + " min ≈ " + MV.mdm.fmt(Math.round(POP * 2 / 60)) + " h"], ["Sample", "200", "400 min ≈ 7 h"]] }) +
      '<p class="tiny">The sample is 200 ÷ ' + MV.mdm.fmt(POP) + " = " + MV.num(pct, 3) + "% of the population.</p></details>";
    sub.push(radios($("#cm3", body), { aria:s.q, options:S3CH, value:S.s3 || "", cls:"chips", onChange:function(v){ S.s3 = v; api.save(); fb(); refreshTabs(); } }));
    function fb(){ $("#cm3fb", body).innerHTML = S.s3 ? fbRow(S.s3 === "all", s.right, s.wrong) : ""; }
    fb();
  }
  function s4(body, s){
    body.innerHTML = '<p class="cm-text">' + s.text + '</p><div class="cm-two"><figure><figcaption>Student A</figcaption><div class="plot-wrap"><canvas class="plot cm-small" id="cm4a" role="img" aria-label="Student A histogram: 1, 5, 3, 1 objects in the classes 10–15, 15–20, 20–25, 25–30 cm."></canvas></div></figure>' +
      '<figure><figcaption>Student B</figcaption><div class="plot-wrap"><canvas class="plot cm-small" id="cm4b" role="img" aria-label="Student B histogram: 2, 3, 3, 2 objects in the classes 10–15, 15–20, 20–25, 25–30 cm."></canvas></div></figure></div>' +
      '<p class="cm-sub">How do the two histograms compare?</p><div id="cm4"></div><div id="cm4fb" aria-live="polite"></div>' +
      '<details class="alg"><summary>Check it with data</summary>' + MV.tableHTML({ head:["Object", "Student A (cm)", "Student B (cm)", "Difference"], caption:"The same 10 objects, measured twice",
        rows:S4A.map(function(a, i){ var d = S4B[i] - a; return [String(i + 1), String(a), String(S4B[i]), d === 0 ? "0" : (d > 0 ? "+" : MV.MINUS) + Math.abs(d)]; }) }) + "</details>";
    function hb(L){ return [10, 15, 20, 25].map(function(a){ return { a:a, b:a + 5, h:L.filter(function(v){ return v >= a && v < a + 5; }).length }; }); }
    ["a", "b"].forEach(function(k){
      var p = plots[k] = new MV.Plot($("#cm4" + k, body), { xmin:0, xmax:1, ymin:0, ymax:1 });
      p.render = function(){ densChart(p, { x0:10, x1:30, ymax:6, yStep:2, xTicks:[10, 15, 20, 25, 30], bars:hb(k === "a" ? S4A : S4B), yLabel:"objects", describe:p.c.getAttribute("aria-label") }); };
      p.render();
    });
    sub.push(radios($("#cm4", body), { aria:"How do the two histograms compare?", options:S4CH, value:S.s4 || "", cls:"chips", onChange:function(v){ S.s4 = v; api.save(); fb(); refreshTabs(); } }));
    function fb(){ $("#cm4fb", body).innerHTML = S.s4 ? fbRow(S.s4 === "little", s.after, "Compare the bars class by class: most counts change by 1 or 2. " + s.after) : ""; }
    fb();
  }
  function paint(){
    refreshTabs(); sub = [];
    var s = st(S.cur), body = $("#cm-body", host);
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="cm-card"><span class="cm-clab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + '</span><div id="cm-in"></div></div>'; });
    var inner = $("#cm-in", body);
    if (s.id === "s1") s1(inner, s); else if (s.id === "s2") s2(inner, s); else if (s.id === "s3") s3(inner, s); else s4(inner, s);
  }
  paint();
  return {};
}

// @component N4 probEntry — number entry for probabilities (copied from MDM4U 21; per-part tol:[…], √ answers through
// MV.parseNum ("5√2", "√50"), wrong answers by value or part; item labels D1, D2, …): fractions, decimals and percents;
// two-part items (parts:[label, label], answer:[a, b]) get a box per part. First-try scoring.
function probEntry(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ var x = st.items[id] || (st.items[id] = { val:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.val)) x.val = [String(x.val || "")]; return x; }
  function pv(raw){ var f = F.parse(raw); if (f) return f.n / f.d; var r = MV.parseNum(raw); return r && r.length === 1 ? r[0] : null; }
  function close(v, w, tol){ return v != null && Math.abs(v - w) <= tol * Math.max(1, Math.abs(w)); }
  function judge(it, vals){
    var ans = MV.ans(it), A = Array.isArray(ans) ? ans : [ans], T = A.map(function(_, k){ return Array.isArray(it.tol) ? it.tol[k] : it.tol || 5e-5; }), nums = A.map(function(_, k){ return pv(vals[k]); });
    if (nums.some(function(v){ return v == null; })) return { bad:true };
    var oks = nums.map(function(v, k){ return close(v, A[k], T[k]); });
    if (oks.every(Boolean)) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ return close(nums[w.part || 0], w.match, 5e-5); })[0];
    var fb = named ? named.fb : null;
    if (!fb && A.length > 1) { var k1 = oks.indexOf(true), k2 = oks.indexOf(false); if (k1 >= 0) fb = MV.md(it.parts[k1].replace(/\s*=\s*$/, "")) + " is right. Check " + MV.md(it.parts[k2].replace(/\s*=\s*$/, "")) + "."; }
    return { ok:false, fb:fb };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), parts = it.parts || [it.label || "Your answer:"];
        var h = '<div class="q" data-pe="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">D' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="numrow pe-row">' + parts.map(function(lab, k){ return '<label class="pe-lab" for="pe-' + it.id + k + '"><span>' + lab + '</span><input class="numin" id="pe-' + it.id + k + '" data-pin="' + it.id + '" data-pk="' + k + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val[k] || "") + '"' + (x.solved ? " disabled" : "") + "></label>"; }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.pin; if (!id) return; ist(id).val[+e.target.dataset.pk] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.pin) { var b = host.querySelector('[data-k="' + e.target.dataset.pin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-pe]"); if (!box) return;
    var it = a.items.filter(function(x){ return x.id === box.dataset.pe; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = (it.parts ? "Fill in both boxes. " : "") + "Enter a fraction such as 3/8, a decimal such as 0.375 or a root such as 5√2."; paint(); MV.focusFb(host.querySelector('[data-pe="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb ? r.fb + " " : "") + "Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-pe="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a waiting-time density ----------
var task = (function(){
  var api = null, plot = null, WID = [2, 4, 4], EDGE = [0, 2, 6, 10];
  function hs(u){ var s = (u * 0.025).toFixed(3).replace(/0+$/, ""); if (/\.\d$/.test(s)) s += "0"; return s; }   // 4 -> "0.10", 5 -> "0.125"
  function read(){ var s = api ? api.S : {}, h = Array.isArray(s.h) && s.h.length === 3 ? s.h.map(function(v){ return clampI(v, 1, 10, 4); }) : [4, 4, 4]; return { h:h }; }
  function areas(h){ return h.map(function(u, i){ return u * WID[i] / 40; }); }
  function draw(){
    var d = read(), A = areas(d.h);
    densChart(plot, { x0:0, x1:10, ymax:0.25, yStep:0.05, xTicks:[0, 2, 4, 6, 8, 10], yLabel:"density", xLabel:"minutes",
      bars:d.h.map(function(u, i){ return { a:EDGE[i], b:EDGE[i + 1], h:u / 40 }; }),
      labels:d.h.map(function(u, i){ return { x:(EDGE[i] + EDGE[i + 1]) / 2, y:u / 40, text:"area " + d4(A[i]) }; }),
      describe:"Your waiting-time density: heights " + d.h.map(hs).join(", ") + " on [0, 2), [2, 6) and [6, 10]; piece areas " + A.map(d4).join(", ") + "; total area " + d4(A[0] + A[1] + A[2]) + "." });
  }
  function paint(){
    var d = read(), A = areas(d.h), el = $("#wt-read"); if (!el) return;
    d.h.forEach(function(u, i){ $("#wt-v" + i).textContent = hs(u); $('[data-wt="' + i + '|-1"]').disabled = u <= 1; $('[data-wt="' + i + '|1"]').disabled = u >= 10; });
    var tot = A[0] + A[1] + A[2];
    el.innerHTML = MV.readoutHTML([
      ["Piece areas", A.map(function(x, i){ return hs(d.h[i]) + " × " + WID[i] + " = " + d4(x); }).join("; ")],
      ["Total area", d4(A[0]) + " + " + d4(A[1]) + " + " + d4(A[2]) + " = " + d4(tot) + (Math.abs(tot - 1) < 1e-9 ? " ✓" : "")],
      [M("P(X < 2)") + " and " + M("P(X >= 6)"), d4(A[0]) + " and " + d4(A[2])]]);
    draw();
  }
  return {
    render:function(inp, pvw, a){
      api = a; a.S.h = read().h;
      inp.innerHTML = '<div class="wt-in" role="group" aria-label="Your heights">' + [0, 1, 2].map(function(i){
        return '<div class="wt-step"><span class="wt-stl">' + M("h_" + (i + 1)) + ' <span class="tiny muted">on [' + EDGE[i] + ", " + EDGE[i + 1] + (i === 2 ? "]" : ")") + '</span></span><button type="button" class="btn ghost sm" data-wt="' + i + '|-1" data-k="wt' + i + 'm" aria-label="h' + (i + 1) + ' minus 0.025">−</button><output class="wt-sv" id="wt-v' + i + '" aria-live="polite"></output><button type="button" class="btn ghost sm" data-wt="' + i + '|1" data-k="wt' + i + 'p" aria-label="h' + (i + 1) + ' plus 0.025">+</button></div>';
      }).join("") + '<p class="tiny muted">Steps of 0.025, from 0.025 to 0.25.</p></div>';
      pvw.innerHTML = '<canvas class="plot wt-plot" id="wt-plot" role="img" aria-label="Your waiting-time density"></canvas><dl class="read wt-read" id="wt-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#wt-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-wt]"); if (!b || b.disabled) return;
        var q = b.dataset.wt.split("|"), h = read().h; h[+q[0]] = clampI(h[+q[0]] + (+q[1]), 1, 10, 4); a.S.h = h; a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    // in units of 0.025: area×40 = 2a + 4b + 4c, so total 1 ⇔ 2a + 4b + 4c = 40
    checks:function(d){ var a = d.h[0], b = d.h[1], c = d.h[2]; return [2 * a + 4 * b + 4 * c === 40, 2 * a >= 8, 4 * b > 2 * a && 4 * b > 4 * c, 4 * c >= 8]; },
    key:function(d){ return d.h.join(","); },
    label:function(k){ return "(" + k.split(",").map(function(v){ return hs(+v); }).join(", ") + ")"; },
    text:function(k){ return "(" + k.split(",").map(function(v){ return hs(+v); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ areas:probEntry },
  task:task
});
})();
