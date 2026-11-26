// MDM4U 21 The Binomial Distribution: hero (a 4-row Galton board: one ball, the 6 paths to bin 2, then 50 balls fill the bins
// 1 : 4 : 6 : 4 : 1), Binomial board (Explore: n and p sliders + chips; Histogram / Galton board / Simulate views; range
// selector; E and σ markers), Is it binomial? (Part 3: BINS check, fix it, tree → formula), Calculate it (N4 probEntry),
// Design a binomial distribution task. Probabilities are exact (whole-number counts over d^n) when p comes from a chip;
// every simulation and every ball drop is seeded (MV.mdm.seededRandom), so the same settings give the same results.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac, NS = "http://www.w3.org/2000/svg";
function M(s){ return MV.m(s); }
function C(n, r){ return MV.mdm.nCr(n, r); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function dec(v, dp){ var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/0+$/, "").replace(/\.$/, ""); if (s === "-0") s = "0"; return s.replace("-", MV.MINUS); }
function d4(v){ return dec(v, 4); }
function d2(v){ return dec(v, 2); }
function exact4(v){ return Math.abs(Math.round(v * 1e4) / 1e4 - v) < 1e-12; }
function apx(v){ return (exact4(v) ? "= " : "≈ ") + d4(v); }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function isDark(){ var c = css("--sheet"), m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c); if (!m) return false; return (parseInt(m[1], 16) + parseInt(m[2], 16) + parseInt(m[3], 16)) / 3 < 110; }
function ease(t){ return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function narrow(){ return (document.documentElement.clientWidth || window.innerWidth) < 560; }

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

// @component D7 distChart — probability histogram (course plan D7; copied from MDM4U 18 and extended) on the toolkit's Plot
// engine with its own axes: bars of width 1 centred on each value (solid --pen); outlined simulated bars over lighter
// theoretical bars; a --hi-soft range band with edge knobs (for MV.drag handles); labels over bars; NEW: mean:{x, label} draws
// the E(X) line in --ink, sigma:{lo, hi} the ±σ bracket in --ink-2, x labels thin out to every 2, 5 or 10 on wide axes.
// distChart(plot, { x0, x1, ymax, yStep, yFmt(v), bars:[{x, p}], sim:[{x, p}], labels:{x:text}, range:{a, b}, mean, sigma,
//   xLabel, yLabel, describe }) -> geometry {xa, xb, y0, yt} (pixels) for overlays
function distChart(plot, o){
  var c = plot.c, r = c.getBoundingClientRect(), W = Math.max(160, r.width), H = Math.max(120, r.height);
  var L = 46, R = 14, T = o.mean ? 34 : 24, B = 30, n = o.x1 - o.x0 + 1, bw = (W - L - R) / n, ys = (H - T - B) / o.ymax, geo = {};
  var view = { xmin:o.x0 - 0.5 - L / bw, xmax:o.x1 + 0.5 + R / bw, ymin:-B / ys, ymax:o.ymax + T / ys };
  plot.draw({ view:view, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var X = function(x){ return p.X(x); }, Y = function(y){ return p.Y(y); }, xa = X(o.x0 - 0.5), xb = X(o.x1 + 0.5), y0 = Y(0), yt = Y(o.ymax);
    var pen = css("--pen"), sheet = css("--sheet"), ink = css("--ink"), ink2 = css("--ink-2"), fUI = p.fontUI, fM = p.fontM;
    geo.xa = xa; geo.xb = xb; geo.y0 = y0; geo.yt = yt;
    if (o.range) { ctx.fillStyle = css("--hi-soft"); ctx.fillRect(X(o.range.a), yt, X(o.range.b) - X(o.range.a), y0 - yt); }
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    var step = o.yStep, fmt = o.yFmt || function(v){ return MV.num(v, step < 0.1 ? 2 : 1); };
    for (var v = step; v <= o.ymax + 1e-9; v += step) { var py = Math.round(Y(v)) + 0.5; ctx.moveTo(xa, py); ctx.lineTo(xb, py); }
    ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = "12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = 0; v <= o.ymax + 1e-9; v += step) ctx.fillText(fmt(Math.round(v * 1e6) / 1e6), xa - 6, Y(v));
    var simOn = !!(o.sim && o.sim.length);
    (o.bars || []).forEach(function(b){
      if (!(b.p > 0) || b.x < o.x0 || b.x > o.x1) return;
      var top = Math.max(yt - 4, Y(Math.min(b.p, o.ymax * 1.03))), x1 = X(b.x - 0.5), x2 = X(b.x + 0.5);
      ctx.globalAlpha = simOn ? 0.45 : 1; ctx.fillStyle = pen; ctx.fillRect(x1, top, x2 - x1, y0 - top); ctx.globalAlpha = 1;
      if (x2 - x1 > 4) { ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.strokeRect(x1 + 0.5, top + 0.5, x2 - x1 - 1, y0 - top - 1); }
    });
    if (simOn) {
      ctx.strokeStyle = isDark() ? ink2 : ink; ctx.lineWidth = 2;
      o.sim.forEach(function(s){ if (!(s.p > 0) || s.x < o.x0 || s.x > o.x1) return; var top = Math.max(yt - 4, Y(Math.min(s.p, o.ymax * 1.03))), w = X(s.x + 0.5) - X(s.x - 0.5); ctx.strokeRect(X(s.x - 0.5) + Math.min(2, w / 6), top + 1, w - 2 * Math.min(2, w / 6), y0 - top - 1); });
    }
    if (o.sigma) {
      var sl = Math.max(xa, X(o.sigma.lo)), sr = Math.min(xb, X(o.sigma.hi)), sy = yt + 6;
      ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sl, sy + 9); ctx.lineTo(sl, sy); ctx.lineTo(sr, sy); ctx.lineTo(sr, sy + 9); ctx.stroke();
      ctx.fillStyle = ink2; ctx.font = "600 12px " + fUI; ctx.textBaseline = "middle";
      ctx.textAlign = "right"; ctx.fillText("−σ", sl - 3, sy + 5); ctx.textAlign = "left"; ctx.fillText("+σ", sr + 3, sy + 5);
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
    if (o.range) {
      [o.range.a, o.range.b].forEach(function(e){ ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(e), yt); ctx.lineTo(X(e), y0); ctx.stroke(); ctx.beginPath(); ctx.arc(X(e), y0, 7, 0, Math.PI * 2); ctx.fillStyle = ink; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = sheet; ctx.stroke(); });
    }
    ctx.fillStyle = ink; ctx.font = "14px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var every = [1, 2, 5, 10].filter(function(k){ return bw * k >= 22; })[0] || 10;
    for (var x = o.x0; x <= o.x1; x++) if ((x - o.x0) % every === 0) ctx.fillText(String(x), X(x), y0 + (o.range ? 10 : 6));
    if (o.labels) {
      ctx.font = "600 12px " + fUI; ctx.textBaseline = "bottom"; ctx.fillStyle = ink;
      Object.keys(o.labels).forEach(function(k){ var x = +k, b = (o.bars || []).filter(function(q){ return q.x === x; })[0], h = b ? Math.min(b.p, o.ymax) : 0; ctx.fillText(o.labels[k], X(x), Y(h) - 3); });
    }
    if (o.yLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yLabel, 4, 3); }
    if (o.xLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(o.xLabel, xa - 6, y0 + (o.range ? 10 : 6)); }
  } });
  return geo.xa != null ? geo : null;
}
var SCALES = [[0.1, 0.02], [0.15, 0.05], [0.2, 0.05], [0.25, 0.05], [0.3, 0.1], [0.4, 0.1], [0.5, 0.1], [0.6, 0.2], [0.8, 0.2], [1, 0.2]];
function scaleOf(m){ var s = SCALES.filter(function(q){ return q[0] >= Math.min(1, m * 1.08); })[0] || SCALES[SCALES.length - 1]; return { ymax:s[0], step:s[1] }; }

// ---------- the binomial model ----------
var CHIPS = ["1/6", "1/4", "1/3", "1/2", "2/3", "3/4", "5/6"];
// p from a chip ("1/3"), the slider (k/20) or an animation (float f). a/d: p as a fraction in lowest terms (null for f).
function pOf(chip, k, f){
  if (f != null) return { v:f, a:null, d:null, txt:d2(f), qtxt:d2(1 - f), chip:false };
  if (chip) { var q = chip.split("/"), a = +q[0], d = +q[1]; return { v:a / d, a:a, d:d, txt:chip, qtxt:(d - a) + "/" + d, chip:true }; }
  var fr = F.of(k, 20); return { v:k / 20, a:fr.n, d:fr.d, txt:d4(k / 20), qtxt:d4(1 - k / 20), chip:false };
}
// rows {x, c (whole-number count over den = d^n when exact), p}
function binom(n, P){
  var ex = P.d != null && Math.pow(P.d, n) <= 9e15, den = ex ? Math.pow(P.d, n) : null, rows = [];
  for (var x = 0; x <= n; x++) {
    var c = ex ? C(n, x) * Math.pow(P.a, x) * Math.pow(P.d - P.a, n - x) : null;
    rows.push({ x:x, c:c, p:ex ? c / den : C(n, x) * Math.pow(P.v, x) * Math.pow(1 - P.v, n - x) });
  }
  return { n:n, P:P, rows:rows, den:den };
}
function modesOf(D){
  var mx = -1; D.rows.forEach(function(r){ mx = Math.max(mx, D.den ? r.c : r.p); });
  return D.rows.filter(function(r){ return D.den ? r.c === mx : Math.abs(r.p - mx) <= 1e-12 * mx; }).map(function(r){ return r.x; });
}
function isSq(v){ var s = Math.round(Math.sqrt(v)); return s * s === v; }
// E, variance and σ with exact text: chips give fractions, the slider gives decimals
function statsOf(n, P){
  var E = n * P.v, V = n * P.v * (1 - P.v), sd = Math.sqrt(V), o = { E:E, V:V, sd:sd };
  if (P.a != null) {
    var Ef = F.of(n * P.a, P.d), Vf = F.of(n * P.a * (P.d - P.a), P.d * P.d);
    o.Etxt = P.chip ? F.txt(Ef) : d4(E); o.Eapx = Ef.d !== 1 && P.chip ? " ≈ " + d2(E) : "";
    var Vt = P.chip ? F.txt(Vf) : d4(V);
    o.Vtxt = Vt;
    o.sdTxt = isSq(Vf.n) && isSq(Vf.d) ? "√{" + Vt + "} = " + F.txt(F.of(Math.round(Math.sqrt(Vf.n)), Math.round(Math.sqrt(Vf.d)))) : "√{" + Vt + "} ≈ " + sd.toFixed(2);
    o.sdShort = isSq(Vf.n) && isSq(Vf.d) ? F.txt(F.of(Math.round(Math.sqrt(Vf.n)), Math.round(Math.sqrt(Vf.d)))) : "√{" + Vt + "}";
    o.cmp = 2 * P.a - P.d;
  } else { o.Etxt = d2(E); o.Eapx = ""; o.Vtxt = d2(V); o.sdTxt = "√{" + d2(V) + "} ≈ " + sd.toFixed(2); o.sdShort = sd.toFixed(2); o.cmp = Math.abs(P.v - 0.5) < 1e-9 ? 0 : P.v - 0.5; }
  o.shape = o.cmp === 0 ? "Symmetric" : o.cmp < 0 ? "Skewed right (tail to the right)" : "Skewed left (tail to the left)";
  o.shapeShort = o.cmp === 0 ? "symmetric" : o.cmp < 0 ? "skewed right" : "skewed left";
  return o;
}
function eventTxt(a, b, n){ return a === b ? "X = " + a : a === 0 && b === n ? "0 <= X <= " + n : a === 0 ? "X <= " + b : b === n ? "X >= " + a : a + " <= X <= " + b; }
function words(n, k){ var out = []; for (var m = 0; m < (1 << n); m++) { var w = "", r = 0; for (var i = n - 1; i >= 0; i--) { var R = (m >> i) & 1; w += R ? "R" : "L"; r += R; } if (r === k) out.push(w); } return out.reverse(); }

// ---------- @component galtonBoard — n-row version (adapted from MDM4U 13's 6-row preview; D7's Galton view) ----------
// gGeo(n, top) geometry in a 400-wide viewBox; gPath(g, word, br) the polyline a ball follows ("RLRL" = right, left, …);
// gSVG(g, o) the board: o = {pv (tilt of the pegs), probs, sel:{a, b}, counts, mean:{E, sd}, hide, paths:[words], cur, ballsG}.
// Pegs are --ink-2 with a small plate that tilts toward the likelier side (angle ∝ p − 1/2); bins hold solid --pen bars
// (theoretical P(X = x)) and outlined bars (balls collected); the selected bins sit on --hi-soft.
function gGeo(n, top){
  var W = 400, DX = Math.min(44, 360 / (n + 1)), DY = Math.max(12, DX * 0.8), X0 = W / 2, Y0 = (top || 14) + DY * 0.95;
  var BT = Y0 + (n - 1) * DY + DY * 0.85, BH = n > 12 ? 96 : 112, BB = BT + BH;
  return { n:n, W:W, H:BB + 22, DX:DX, DY:DY, X0:X0, Y0:Y0, BT:BT, BH:BH, BB:BB, pr:Math.max(2, Math.min(4.5, DX * 0.11)),
    px:function(i, j){ return X0 + (j - i / 2) * DX; }, py:function(i){ return Y0 + i * DY; }, bx:function(k){ return X0 + (k - n / 2) * DX; } };
}
function gPath(g, w, br, top){
  var p = [[g.X0, g.Y0 - g.DY * 0.9]], j = 0;
  for (var i = 0; i < g.n; i++) { p.push([g.px(i, j), g.py(i) - g.pr - br]); if (w[i] === "R") j++; }
  p.push([g.bx(j), top ? g.BT + 8 : g.BB - br - 1]);
  return p;
}
function gAt(p, t){ var segs = p.length - 1, u = Math.min(segs - 1e-9, Math.max(0, t * segs)), i = Math.floor(u), f = u - i; return [p[i][0] + (p[i + 1][0] - p[i][0]) * f, p[i][1] + (p[i + 1][1] - p[i][1]) * f]; }
function gBars(g, o){
  var h = "", mx = 0, tot = 0, k, bw = g.DX * 0.7, sc;
  (o.probs || []).forEach(function(p){ mx = Math.max(mx, p); });
  if (o.counts) { o.counts.forEach(function(c){ tot += c; }); if (tot) o.counts.forEach(function(c){ mx = Math.max(mx, c / tot); }); }
  sc = (g.BH - 20) / Math.max(mx, 1e-9);
  for (k = 0; k <= g.n; k++) {
    if (!o.hide && o.probs) { var hp = o.probs[k] * sc; if (hp > 0.2) h += '<rect class="bn-gbar" x="' + (g.bx(k) - bw / 2).toFixed(1) + '" y="' + (g.BB - hp).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hp.toFixed(1) + '"/>'; }
    if (tot && o.counts[k]) { var hc = o.counts[k] / tot * sc; h += '<rect class="bn-gcnt" x="' + (g.bx(k) - bw / 2 - 1.5).toFixed(1) + '" y="' + (g.BB - hc).toFixed(1) + '" width="' + (bw + 3).toFixed(1) + '" height="' + hc.toFixed(1) + '"/>'; }
  }
  if (o.mean && !o.hide) {
    var ex = g.bx(o.mean.E), sl = g.bx(o.mean.E - o.mean.sd), sr = g.bx(o.mean.E + o.mean.sd), sy = g.BT + 8;
    h += '<line class="bn-gmean" x1="' + ex.toFixed(1) + '" y1="' + (g.BT - 2).toFixed(1) + '" x2="' + ex.toFixed(1) + '" y2="' + g.BB.toFixed(1) + '"/>' +
      '<path class="bn-gsd" d="M' + sl.toFixed(1) + " " + (sy + 7) + "V" + sy + "H" + sr.toFixed(1) + "V" + (sy + 7) + '"/>';
  }
  return h;
}
function gSVG(g, o){
  var h = "", n = g.n, i, j, k, L = g.DX * 0.36, th = (o.pv - 0.5) * 1.1, cs = Math.cos(th), sn = Math.sin(th), fs = Math.max(8, Math.min(13, g.DX * 0.55));
  if (o.sel) h += '<rect class="bn-gsel" x="' + (g.bx(o.sel.a) - g.DX / 2).toFixed(1) + '" y="' + g.BT.toFixed(1) + '" width="' + ((o.sel.b - o.sel.a + 1) * g.DX).toFixed(1) + '" height="' + g.BH.toFixed(1) + '"/>';
  var pegs = "", plates = "";
  for (i = 0; i < n; i++) for (j = 0; j <= i; j++) {
    var cx = g.px(i, j), cy = g.py(i), py = cy - g.pr - 1.5;
    pegs += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + g.pr.toFixed(1) + '"/>';
    plates += "M" + (cx - L * cs).toFixed(1) + " " + (py - L * sn).toFixed(1) + "L" + (cx + L * cs).toFixed(1) + " " + (py + L * sn).toFixed(1);
  }
  h += '<path class="bn-plate" d="' + plates + '"/><g class="bn-peg">' + pegs + "</g>";
  var dv = "";
  for (k = 0; k <= n + 1; k++) dv += "M" + (g.bx(k) - g.DX / 2).toFixed(1) + " " + (g.BT - 4).toFixed(1) + "V" + g.BB.toFixed(1);
  dv += "M" + (g.bx(0) - g.DX / 2).toFixed(1) + " " + g.BB.toFixed(1) + "H" + (g.bx(n) + g.DX / 2).toFixed(1);
  h += '<path class="bn-gdiv" d="' + dv + '"/><g class="bn-gbars">' + gBars(g, o) + "</g>";
  var step = g.DX * 1 >= fs * 1.25 ? 1 : 2;
  for (k = 0; k <= n; k++) if (k % step === 0 || k === n) h += '<text class="bn-glab" x="' + g.bx(k).toFixed(1) + '" y="' + (g.BB + fs + 3).toFixed(1) + '" font-size="' + fs.toFixed(1) + '">' + k + "</text>";
  h += '<g class="bn-gpaths">' + pathsSVG(g, o.paths || [], o.cur) + '</g><g class="bn-gballs"></g>';
  return h;
}
function pathsSVG(g, list, cur){
  return list.map(function(w, i){ var pts = gPath(g, w, 0, true).map(function(q){ return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" ");
    return '<polyline class="bn-gpath" points="' + pts + '"/>' + (i === cur ? '<polyline class="bn-gpath cur" points="' + pts + '"/>' : ""); }).join("");
}

// ---------- hero: one ball, its 5 sister paths into bin 2, then 50 balls fill 1 : 4 : 6 : 4 : 1 ----------
function hero(f){
  var box = f.fig && f.fig.querySelector("#bn-hfig"); if (!box) return;
  var g = gGeo(4, 30), VX = 62, BALL = 6, cap = f.cap, PATHS = ["RLRL"].concat(words(4, 2).filter(function(w){ return w !== "RLRL"; }));
  var aria = "A Galton board with 4 rows of pegs. One ball bounces right, left, right, left into bin 2. The 6 paths that end in bin 2 light up, with a counter: 6 paths = C(4, 2). Then 50 balls fill the bins into a histogram with heights 1, 4, 6, 4, 1 out of 16.";
  var FINAL = [3, 13, 18, 13, 3], pour = [], rnd = MV.mdm.seededRandom("mdm21-hero");
  FINAL.forEach(function(c, k){ var ws = words(4, k); for (var i = 0; i < c; i++) pour.push(ws[Math.floor(rnd() * ws.length)]); });
  pour = MV.shuffle(pour, "mdm21-hero-pour");
  var st = { a:0, ball:null, paths:0, cur:-1, land:[0, 0, 0, 0, 0], balls:[], labels:0, count:"" };
  function svg(){
    var h = "", sc = (g.BH - 30) / 6, k;
    h += gSVG(g, { pv:0.5, probs:null, paths:PATHS.slice(0, st.paths), cur:st.cur });
    var bars = "";
    for (k = 0; k <= 4; k++) { var hh = FINAL[k] ? st.land[k] / FINAL[k] * C(4, k) * sc : 0; if (hh > 0.2) bars += '<rect class="bn-gbar" x="' + (g.bx(k) - 15) + '" y="' + (g.BB - hh).toFixed(1) + '" width="30" height="' + hh.toFixed(1) + '"/>'; }
    h = h.replace('<g class="bn-gbars"></g>', '<g class="bn-gbars">' + bars + "</g>");
    if (st.labels) for (k = 0; k <= 4; k++) h += '<text class="bn-hlab" opacity="' + st.labels.toFixed(2) + '" x="' + g.bx(k) + '" y="' + (g.BB - C(4, k) * sc - 6).toFixed(1) + '">' + C(4, k) + "/16</text>";
    var bl = "";
    if (st.ball) bl += '<circle class="bn-ball" cx="' + st.ball[0].toFixed(1) + '" cy="' + st.ball[1].toFixed(1) + '" r="' + BALL + '"/>';
    st.balls.forEach(function(q){ if (q) bl += '<circle class="bn-ball" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="4.5"/>'; });
    h = h.replace('<g class="bn-gballs"></g>', '<g class="bn-gballs">' + bl + "</g>");
    if (st.count) h += '<text class="bn-hcnt" x="' + (g.W - VX - 4) + '" y="20">' + st.count + "</text>";
    if (st.word) h += '<text class="bn-hword" x="' + (VX + 4) + '" y="20">' + st.word + "</text>";
    box.innerHTML = '<svg class="bn-hsvg" viewBox="' + VX + " 0 " + (g.W - 2 * VX) + " " + g.H.toFixed(0) + '" role="img" aria-label="' + MV.esc(aria) + '" style="opacity:' + st.a.toFixed(2) + '">' + h + "</svg>";
  }
  function last(){ st = { a:1, ball:null, paths:6, cur:-1, land:FINAL.slice(), balls:[], labels:1, count:"6 paths = C(4, 2)", word:"R L R L" }; svg(); cap.textContent = "C(4, x) paths lead to bin x, so P(X = x) = C(4, x)/16: 1, 4, 6, 4, 1 out of 16."; }
  if (MV.reduceMotion) { last(); return; }
  function tw(dur, fn, done){ MV.tween({ dur:dur, ease:function(t){ return t; }, step:fn, done:done }); }
  svg(); cap.textContent = "A Galton board: each peg is a trial";
  tw(500, function(t){ st.a = t; svg(); }, function(){
    var p = gPath(g, "RLRL", BALL);
    cap.textContent = "Right (success) or left (failure) at each peg";
    MV.wait(300, function(){ tw(1700, function(t){ st.ball = gAt(p, t); svg(); }, function(){
      st.ball = null; st.land[2] = 0; st.paths = 1; st.cur = 0; st.word = "R L R L"; st.count = "1 path"; svg();
      cap.textContent = "R L R L: 2 rights, so the ball lands in bin 2";
      var i = 1;
      (function more(){
        MV.wait(i === 1 ? 1300 : 650, function(){
          st.paths = i + 1; st.cur = i; st.count = (i + 1) + " paths" + (i === 5 ? " = C(4, 2)" : ""); svg();
          if (i === 5) { cap.textContent = "6 paths lead to bin 2: C(4, 2) = 6"; MV.wait(1500, flow); return; }
          cap.textContent = "Another path with 2 rights: " + PATHS[i].split("").join(" "); i++; more();
        });
      })();
    }); });
  });
  function flow(){
    st.cur = -1; cap.textContent = "50 balls pour through…";
    var paths = pour.map(function(w){ return gPath(g, w, 4.5); }), per = 46, fall = 950, dur = per * (pour.length - 1) + fall, done = pour.map(function(){ return false; });
    tw(dur, function(t){
      var ms = t * dur; st.balls = [];
      for (var b = 0; b < pour.length; b++) {
        var u = (ms - b * per) / fall;
        if (u < 0) { st.balls.push(null); continue; }
        if (u >= 1) { if (!done[b]) { done[b] = true; st.land[(pour[b].match(/R/g) || []).length]++; } st.balls.push(null); continue; }
        st.balls.push(gAt(paths[b], u));
      }
      svg();
    }, function(){
      st.balls = []; st.land = FINAL.slice(); cap.textContent = "The bins fill in the ratio 1 : 4 : 6 : 4 : 1 (out of 16)";
      tw(600, function(t){ st.labels = t; svg(); }, function(){ MV.wait(1400, last); });
    });
  }
}

// ---------- Explore: the binomial board ----------
var DEF = { n:10, pk:6, pc:null, view:"hist", a:3, b:3, k:3, es:false, simN:1000, simKey:"" };
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (S.n == null) Object.keys(DEF).forEach(function(k){ S[k] = DEF[k]; });
    S.n = clampI(S.n, 1, 40, DEF.n); if (S.n > 20 && S.n !== 40) S.n = 20;
    S.pk = clampI(S.pk, 1, 19, DEF.pk);
    if (CHIPS.indexOf(S.pc) < 0) S.pc = null;
    if (["hist", "galton", "sim"].indexOf(S.view) < 0) S.view = "hist";
    S.a = clampI(S.a, 0, S.n, 0); S.b = clampI(S.b, 0, S.n, S.n); if (S.b < S.a) S.b = S.a;
    S.k = clampI(S.k, 0, S.n, S.a); S.es = !!S.es;
    S.simN = [10, 100, 1000, 10000].indexOf(+S.simN) >= 0 ? +S.simN : 1000;
    if (typeof S.simKey !== "string") S.simKey = "";
    S.balls = obj(S.balls); if (!Array.isArray(S.balls.c)) S.balls = { key:"", c:[], drops:0 };
  }
  sanitize();
  var pv = {}, anim = null, sim = null, drop = null, plot, geoC = null, msg = "";

  host.innerHTML =
    '<div id="bn-view" class="bn-view"></div>' +
    '<div class="bn-pg"><div class="bn-main" data-mv="graph"><div class="eq-cap bn-cap" id="bn-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="bn-sls"><label class="slider"><span class="slider-top"><span>Trials ' + M("n") + '</span><output id="bn-n-out"></output></span><input type="range" id="bn-n" min="1" max="20" step="1"></label>' +
        '<label class="slider"><span class="slider-top"><span>Probability of success ' + M("p") + '</span><output id="bn-p-out"></output></span><input type="range" id="bn-p" min="1" max="19" step="1"></label>' +
        '<div id="bn-chips"></div><p class="tiny muted bn-n40" id="bn-n40" hidden></p></div>' +
      '<div class="plot-wrap bn-pw" id="bn-pw"><canvas class="plot bn-plot" id="bn-plot" role="img" aria-label="Binomial probability histogram"></canvas><div class="bn-bars" id="bn-bars" role="group" aria-label="Bars of the histogram: arrow keys move, Enter selects"></div></div>' +
      '<p class="tiny muted bn-hint" id="bn-hint">Tap a bar to select it, or drag the two dark knobs on the axis to select a range (Tab to a knob, then use the arrow keys).</p>' +
      '<div id="bn-gal" class="bn-gal" hidden></div>' +
      '<div id="bn-simbox" class="bn-simbox" hidden><div class="bn-simrow"><div id="bn-simn"></div><button type="button" class="btn primary sm" id="bn-run" data-k="bnrun">Run</button></div><p class="tiny muted" id="bn-simtxt" aria-live="polite"></p></div>' +
      '<div class="bn-rng"><span class="rg-lab">Select</span><span id="bn-quick" class="bn-quick"></span>' +
      '<button type="button" class="cc-switch bn-sw" role="switch" id="bn-es" aria-checked="false" data-k="bnes"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>Show ' + M("E") + " and " + M("σ") + "</button></div>" +
      '<p class="tiny bn-msg" id="bn-msg" aria-live="polite"></p></div>' +
    '<div class="bn-read"><dl class="read" id="bn-read" aria-live="polite"></dl></div></div>';

  plot = new MV.Plot($("#bn-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintChart;
  var viewR = radios($("#bn-view", host), { label:"View", options:[{ id:"hist", t:"Histogram" }, { id:"galton", t:"Galton board" }, { id:"sim", t:"Simulate" }], value:S.view, cls:"seg",
    onChange:function(v){ user(); S.view = v; save(); render(); MV.changed(); } });
  var chipR = radios($("#bn-chips", host), { label:"Exact " + M("p") + ":", aria:"Exact probability chips", options:CHIPS.map(function(c){ return { id:c, t:M(c), aria:"p = " + c }; }), value:S.pc || "", cls:"chips",
    onChange:function(v){ user(); S.pc = v; S.pk = clampI(Math.round(pOf(v).v * 20), 1, 19, 10); changedNP(); } });
  var simR = radios($("#bn-simn", host), { label:"Experiments", options:[10, 100, 1000, 10000].map(function(v){ return { id:v, t:MV.mdm.fmt(v) }; }), value:S.simN, cls:"chips",
    onChange:function(v){ user(); S.simN = +v; save(); render(); } });

  var drag = MV.drag(plot, { axis:"x", step:{ x:1, y:1 },
    handles:function(){ return S.view === "galton" && !galFallback() ? [] : [{ id:"a", x:S.a - 0.5, y:0, label:"Left edge of the selection, before x = " + S.a }, { id:"b", x:S.b + 0.5, y:0, label:"Right edge of the selection, after x = " + S.b }]; },
    snap:function(x){ return [Math.max(-0.5, Math.min(S.n + 0.5, Math.round(x - 0.5) + 0.5)), 0]; },
    move:function(id, x, y, how){
      if (how === "drag") dragged = true;
      var a = S.a, b = S.b;
      if (id === "a") a = Math.min(Math.round(x + 0.5), S.b); else b = Math.max(Math.round(x - 0.5), S.a);
      a = Math.max(0, Math.min(S.n, a)); b = Math.max(0, Math.min(S.n, b));
      if (a === S.a && b === S.b) return;
      if (anim) cancelAnim();
      S.a = a; S.b = b; S.k = id === "a" ? a : b; save(); paintSel(); } });
  var dragged = false, downNear = false; void drag;
  plot.c.addEventListener("pointerdown", function(e){
    dragged = false; downNear = false; if (!geoC) return;
    var r = plot.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    [S.a - 0.5, S.b + 0.5].forEach(function(x){ if (Math.hypot(plot.X(x) - px, geoC.y0 - py) < 22) downNear = true; });
  });
  plot.c.addEventListener("click", function(e){
    if (dragged || downNear || !geoC || pv.hide) return;
    var r = plot.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    if (px < geoC.xa || px > geoC.xb || py > geoC.y0 + 4) return;
    var x = Math.round(plot.xOf(px)); if (x < 0 || x > S.n) return;
    pickBar(x);
  });
  function pickBar(x){ if (anim) cancelAnim(); S.a = S.b = S.k = x; msg = ""; save(); paintSel(); }

  function save(){ api.save(); }
  function P(){ return pOf(S.pc, S.pk, pv.pf); }
  function D(){ return binom(S.n, P()); }
  function user(){ cancelAnim(); stopDrop(); pv = {}; MV.banner("", ""); }
  function changedNP(){
    stopSim(); var d = S.n;
    if (S.b === S.n0 && S.n0 != null) S.b = d;
    S.a = Math.min(S.a, d); S.b = Math.min(Math.max(S.b, S.a), d); S.k = Math.min(S.k, d); S.n0 = d;
    msg = ""; save(); render(); MV.changed();
  }
  S.n0 = S.n;

  // --- animation bookkeeping: any user action cancels the running animation and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv.pf = null; pv.grow = null; pv.hide = false; pv.trace = null;
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } render(); MV.changed(); }

  // --- simulation (Simulate view): N experiments of n trials, seeded by the settings ---
  function simKey(){ return S.n + "|" + (S.pc || "k" + S.pk) + "|" + S.simN; }
  function newSim(){
    var Pp = P(), n = S.n, g = MV.mdm.seededRandom("mdm21|" + simKey()), cnt = [];
    for (var i = 0; i <= n; i++) cnt.push(0);
    return { key:simKey(), N:S.simN, n:n, done:0, cnt:cnt, sum:0, sq:0,
      add:function(m){ for (var e = 0; e < m && this.done < this.N; e++) { var x = 0; for (var t = 0; t < n; t++) if (g() < Pp.v) x++; this.cnt[x]++; this.sum += x; this.sq += x * x; this.done++; } } };
  }
  function simCur(){
    if (S.view !== "sim" || pv.pf != null) return null;
    if (sim && sim.key === simKey()) return sim;
    if (S.simKey === simKey()) { sim = newSim(); sim.add(sim.N); return sim; }
    return null;
  }
  function stopSim(){ if (sim && sim.stop) { sim.stop(); sim.stop = null; } if (sim && sim.done < sim.N) sim = null; }
  function runSim(){
    stopSim(); sim = newSim(); var s = sim; S.simKey = ""; save();
    paintSimBox();
    s.stop = MV.tween({ dur:s.N <= 10 ? 600 : 1600, ease:function(t){ return t; }, step:function(t){ if (sim !== s) return; s.add(Math.round(t * s.N) - s.done); paintChart(); paintRead(); paintSimTxt(); },
      done:function(){ if (sim !== s) return; s.add(s.N); s.stop = null; S.simKey = s.key; save(); render(); } });
  }
  function simStats(s){ var m = s.sum / s.done; return { m:m, sd:Math.sqrt(Math.max(0, s.sq / s.done - m * m)) }; }

  // --- Galton balls ---
  function ballKey(){ return S.n + "|" + (S.pc || "k" + S.pk); }
  function balls(){ if (S.balls.key !== ballKey()) S.balls = { key:ballKey(), c:[], drops:S.balls.drops || 0 }; while (S.balls.c.length < S.n + 1) S.balls.c.push(0); return S.balls; }
  function stopDrop(){
    if (!drop) return; var d = drop; drop = null;
    if (d.cancel) d.cancel();
    d.list.forEach(function(w, i){ if (!d.inBin[i]) d.B.c[(w.match(/R/g) || []).length]++; });
    save(); paintGal(); paintCtlBusy();
  }
  function dropBalls(m){
    stopDrop(); if (anim) cancelAnim();
    var B = balls(), Pp = P(), rnd = MV.mdm.seededRandom("mdm21-galton|" + ballKey() + "|" + B.drops), list = [];
    B.drops++;
    for (var i = 0; i < m; i++) { var w = ""; for (var t = 0; t < S.n; t++) w += rnd() < Pp.v ? "R" : "L"; list.push(w); }
    paintGal();
    drop = { list:list, inBin:list.map(function(){ return false; }), B:B, cancel:null };
    paintCtlBusy();
    var d = drop, g = gGeo(S.n), br = Math.max(2.5, Math.min(6, g.DX * 0.16)), layer = $(".bn-gballs", host), bars = $(".bn-gbars", host), els = [], paths = list.map(function(w){ return gPath(g, w, br); });
    var per = m === 1 ? 0 : 45, fall = m === 1 ? 1500 : 1000, dur = per * (m - 1) + fall;
    list.forEach(function(){ var c = document.createElementNS(NS, "circle"); c.setAttribute("r", br.toFixed(1)); c.setAttribute("class", "bn-ball"); c.style.display = "none"; if (layer) layer.appendChild(c); els.push(c); });
    d.cancel = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){
      if (drop !== d) return;
      var ms = t * dur, ch = false;
      for (var b = 0; b < m; b++) {
        var u = (ms - b * per) / fall; if (u < 0) continue;
        if (u >= 1) { if (!d.inBin[b]) { d.inBin[b] = true; els[b].style.display = "none"; B.c[(list[b].match(/R/g) || []).length]++; ch = true; } continue; }
        var q = gAt(paths[b], u); els[b].style.display = ""; els[b].setAttribute("cx", q[0].toFixed(1)); els[b].setAttribute("cy", q[1].toFixed(1));
      }
      if (ch && bars) bars.innerHTML = gBars(g, galOpts(g));
    }, done:function(){ if (drop !== d) return; drop = null; save(); paintGal(); paintCtlBusy(); } });
  }

  // --- painting ---
  function render(){
    sanitize();
    viewR.set(S.view); chipR.set(S.pc || ""); simR.set(S.simN);
    var nIn = $("#bn-n", host), pIn = $("#bn-p", host), Pp = P();
    nIn.value = Math.min(20, S.n); $("#bn-n-out", host).textContent = String(S.n); nIn.setAttribute("aria-valuetext", "n = " + S.n);
    pIn.value = pv.pf != null ? Math.round(pv.pf * 20) : S.pk; $("#bn-p-out", host).innerHTML = M(Pp.txt); pIn.setAttribute("aria-valuetext", "p = " + Pp.txt);
    var n40 = $("#bn-n40", host); n40.hidden = S.n <= 20; n40.textContent = S.n > 20 ? "n = " + S.n + " was set by the prediction; the slider goes up to 20." : "";
    $("#bn-es", host).setAttribute("aria-checked", String(S.es));
    var fb = galFallback();
    $("#bn-pw", host).hidden = S.view === "galton" && !fb;
    $("#bn-hint", host).hidden = S.view === "galton" && !fb;
    $("#bn-gal", host).hidden = S.view !== "galton";
    $("#bn-simbox", host).hidden = S.view !== "sim";
    paintChart(); paintGal(); paintSimBox(); paintQuick(); paintRead(); paintCap(); paintCtlBusy();
    $("#bn-msg", host).innerHTML = msg;
  }
  function paintSel(){ paintChart(); paintGal(); paintQuick(); paintRead(); paintCap(); MV.changed(); }
  function galFallback(){ return S.view === "galton" && (S.n > 20 || (S.n > 12 && narrow())); }
  function paintCtlBusy(){
    var busy = !!(anim && (pv.hide || pv.trace || pv.pf != null || pv.grow != null)), sb = $("#bn-run", host);
    if (sb) sb.disabled = busy || !!(sim && sim.stop);
    host.querySelectorAll("[data-gal]").forEach(function(b){ b.disabled = busy || !!drop || (b.dataset.gal === "clear" && !balls().c.some(Boolean)); });
  }
  function barLabel(d, r){ return d.P.chip && d.den && d.den <= 10000 ? r.c + "/" + d.den : r.p < 0.005 ? "<0.01" : d2(r.p); }
  function paintChart(){
    var d = D(), n = d.n, x1 = Math.max(n, pv.x1 || 0), mx = 0, st = statsOf(n, d.P), g = pv.grow == null ? 1 : pv.grow;
    d.rows.forEach(function(r){ mx = Math.max(mx, r.p); });
    var s = simCur(), simBars = null;
    if (s && s.done) { simBars = s.cnt.map(function(c, x){ return { x:x, p:c / s.done }; }); simBars.forEach(function(q){ mx = Math.max(mx, q.p); }); }
    var sc = scaleOf(pv.ymax || mx), bars = pv.hide ? [] : d.rows.map(function(r){ return { x:r.x, p:r.p * g }; });
    var labels = null, bw = (plot.c.getBoundingClientRect().width - 60) / (x1 + 1);
    if (!pv.hide && g >= 1 && bw >= 42) { labels = {}; d.rows.forEach(function(r){ labels[r.x] = barLabel(d, r); }); }
    var showE = S.es && !pv.hide;
    geoC = distChart(plot, { x0:0, x1:x1, ymax:sc.ymax, yStep:sc.step, bars:bars, sim:simBars, labels:labels, range:{ a:S.a - 0.5, b:S.b + 0.5 },
      mean:showE ? { x:st.E, label:"E(X) = " + MV.plain(M(st.Etxt)) } : null, sigma:showE ? { lo:st.E - st.sd, hi:st.E + st.sd } : null,
      yLabel:"P(X = x)", xLabel:"x", describe:describe(d, st, s) });
    paintBarBtns(d, x1);
  }
  function describe(d, st, s){
    var t = "Binomial, n = " + d.n + ", p = " + d.P.txt + ", " + st.shapeShort + ", mean " + MV.plain(M(st.Etxt));
    if (pv.hide) return t + ". The bars are hidden until the reveal.";
    var sp = selProb(d); t += "; " + MV.plain(M("P(" + eventTxt(S.a, S.b, d.n) + ")")) + " ≈ " + d2(sp.v) + ".";
    if (S.es) t += " The E(X) line and the ±σ bracket are shown.";
    if (s && s.done) { var ss = simStats(s); t += " Outlined simulated bars from " + s.done + " experiments: mean " + d2(ss.m) + "."; }
    return t;
  }
  // keyboard path to the bars: one button per bar over the canvas (pointer events pass through to the canvas)
  var barFk = null;
  function paintBarBtns(d, x1){
    var box = $("#bn-bars", host); if (!geoC || $("#bn-pw", host).hidden) { box.innerHTML = ""; return; }
    var had = box.contains(document.activeElement) ? +document.activeElement.dataset.bar : null, h = "";
    if (barFk == null || barFk > d.n) barFk = S.k;
    var top = plot.c.offsetTop + geoC.yt, ht = geoC.y0 - geoC.yt, left = plot.c.offsetLeft;
    for (var x = 0; x <= d.n; x++) {
      var l = left + plot.X(x - 0.5), w = plot.X(x + 0.5) - plot.X(x - 0.5), r = d.rows[x];
      h += '<button type="button" class="bn-bar" data-bar="' + x + '" tabindex="' + (x === barFk ? 0 : -1) + '" style="left:' + l.toFixed(1) + "px;top:" + top.toFixed(1) + "px;width:" + w.toFixed(1) + "px;height:" + ht.toFixed(1) + 'px" aria-pressed="' + (x >= S.a && x <= S.b) + '" aria-label="' + MV.esc("X = " + x + (pv.hide ? "" : ", probability " + apx(r.p))) + '"></button>';
    }
    box.innerHTML = h;
    if (had != null) { var b = box.querySelector('[data-bar="' + Math.min(had, d.n) + '"]'); if (b) b.focus({ preventScroll:true }); }
    void x1;
  }
  $("#bn-bars", host).addEventListener("click", function(e){ var b = e.target.closest("[data-bar]"); if (!b || pv.hide) return; barFk = +b.dataset.bar; pickBar(+b.dataset.bar); });
  $("#bn-bars", host).addEventListener("keydown", function(e){
    var b = e.target.closest("[data-bar]"); if (!b) return;
    var x = +b.dataset.bar, nx = e.key === "ArrowRight" || e.key === "ArrowUp" ? x + 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? x - 1 : e.key === "Home" ? 0 : e.key === "End" ? S.n : null;
    if (nx == null) return; e.preventDefault(); nx = Math.max(0, Math.min(S.n, nx)); barFk = nx;
    var all = host.querySelectorAll("[data-bar]"); all.forEach(function(q){ q.tabIndex = +q.dataset.bar === nx ? 0 : -1; });
    var nb = host.querySelector('[data-bar="' + nx + '"]'); if (nb) nb.focus();
  });

  function selProb(d){
    var c = 0, v = 0, k = 0;
    d.rows.forEach(function(r){ if (r.x >= S.a && r.x <= S.b) { k++; v += r.p; if (d.den) c += r.c; } });
    if (d.den) v = c / d.den;
    return { c:c, v:v, k:k };
  }
  function probTxt(d, c, v){ return d.P.chip && d.den && d.den <= 1e5 ? "= " + F.prob(c, d.den) : apx(v); }
  function selTxt(d){
    var sp = selProb(d), ev = "P(" + eventTxt(S.a, S.b, d.n) + ")";
    if (pv.hide) return M(ev) + ' = <span class="bn-q">?</span>';
    if (S.a === S.b) { var x = S.a; return M(ev + " = C(" + d.n + ", " + x + ")(" + d.P.txt + ")^" + x + "(" + d.P.qtxt + ")^" + (d.n - x)) + " " + M(probTxt(d, sp.c, sp.v)); }
    if (S.a === 0 && S.b === d.n) return M(ev + " = 1") + " (every bar)";
    return M(ev) + " " + M(probTxt(d, sp.c, sp.v)) + " (sum of " + sp.k + " bars)";
  }
  function paintRead(){
    var d = D(), st = statsOf(d.n, d.P), rows = [], Q = '<span class="bn-q">?</span>', hide = !!pv.hide, modes = modesOf(d);
    rows.push(["Parameters", M("n = " + d.n) + ", " + M("p = " + d.P.txt) + ", " + M("q = " + d.P.qtxt)]);
    rows.push(["Selected probability", selTxt(d)]);
    rows.push(["Expected value", M("E(X) = np = " + st.Etxt) + st.Eapx]);
    rows.push(["Standard deviation", M("σ = √{npq} = " + st.sdTxt)]);
    rows.push(["Shape", hide ? Q : st.shape]);
    rows.push(["Most likely value", hide ? Q : modes.length > 1 ? modes.join(" and ") + " (equally likely)" : String(modes[0])]);
    if (S.view === "sim") {
      var s = simCur();
      rows.push(["Simulation", s && s.done ? MV.mdm.fmt(s.done) + " experiments: mean " + d2(simStats(s).m) + ", standard deviation " + d2(simStats(s).sd) : '<span class="muted">Press Run.</span>']);
    }
    $("#bn-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var c = $("#bn-cap", host), d = D();
    c.innerHTML = pv.cap != null ? MV.md(pv.cap) : M("P(X = x) = C(" + d.n + ", x)(" + d.P.txt + ")^x(" + d.P.qtxt + ")^{" + d.n + " - x}");
    c.classList.toggle("long", MV.plain(c.innerHTML).length > 24);
  }
  function paintQuick(){
    var k = S.k, n = S.n, q = $("#bn-quick", host), cur = S.a === S.b && S.a === k ? "eq" : S.a === 0 && S.b === k ? "le" : S.a === k && S.b === n ? "ge" : "";
    var h = [["eq", "X = " + k], ["le", "X <= " + k], ["ge", "X >= " + k]].map(function(o){ return '<button type="button" class="chip' + (cur === o[0] ? " on" : "") + '" data-q="' + o[0] + '" data-k="bnq' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + M(o[1]) + "</button>"; }).join("");
    MV.keepFocus(q, function(){ q.innerHTML = h; });
  }
  function galOpts(g){
    var d = D(), B = balls(), st = statsOf(d.n, d.P);
    return { pv:d.P.v, probs:d.rows.map(function(r){ return r.p; }), sel:{ a:S.a, b:S.b }, counts:B.c.slice(0, d.n + 1), hide:!!pv.hide, mean:S.es ? { E:st.E, sd:st.sd } : null,
      paths:pv.trace ? pv.trace.words.slice(0, pv.trace.m) : [], cur:pv.trace ? pv.trace.m - 1 : -1 };
  }
  var binFocus = null;
  function paintGal(){
    var box = $("#bn-gal", host); if (S.view !== "galton") { box.innerHTML = ""; return; }
    if (galFallback()) { box.innerHTML = '<p class="bn-note">' + (S.n > 20 ? "The Galton board shows up to 20 rows." : "On a phone, the Galton board shows up to 12 rows.") + " For " + M("n = " + S.n) + ", use the histogram above.</p>"; paintChart(); return; }
    if (drop) return;
    var g = gGeo(S.n), o = galOpts(g), d = D(), B = balls(), tot = B.c.reduce(function(a, b){ return a + b; }, 0), bins = "", k;
    if (binFocus == null || binFocus > S.n) binFocus = S.k;
    for (k = 0; k <= S.n; k++) {
      bins += '<button type="button" class="bn-bin" data-bin="' + k + '" data-k="bnbin' + k + '" tabindex="' + (k === binFocus ? 0 : -1) + '" aria-pressed="' + (k >= S.a && k <= S.b) + '" style="left:' + ((g.bx(k) - g.DX / 2) / g.W * 100).toFixed(3) + "%;top:" + (g.BT / g.H * 100).toFixed(3) + "%;width:" + (g.DX / g.W * 100).toFixed(3) + "%;height:" + ((g.BH + 18) / g.H * 100).toFixed(3) + '%" aria-label="' + MV.esc("Bin " + k + (pv.hide ? "" : ": C(" + S.n + ", " + k + ") = " + MV.mdm.fmt(C(S.n, k)) + " paths lead here")) + '"></button>';
    }
    var aria = "Galton board with " + S.n + " rows of pegs and " + (S.n + 1) + " bins. " + (Math.abs(d.P.v - 0.5) < 1e-9 ? "The pegs are level: p = 1/2." : "The pegs tilt to the " + (d.P.v > 0.5 ? "right" : "left") + ": p = " + d.P.txt + ".") + (pv.hide ? "" : " Bars in the bins show P(X = x).") + (tot ? " " + tot + " balls dropped: " + B.c.join(", ") + "." : "");
    var info = pv.trace ? pv.trace.cnt : !pv.hide && (hoverBin != null || (document.activeElement && box.contains(document.activeElement) && document.activeElement.dataset.bin != null)) ? binInfo(hoverBin != null ? hoverBin : binFocus) : "";
    var canTrace = S.a === S.b && C(S.n, S.a) <= 20 && C(S.n, S.a) > 1;
    var h = '<div class="bn-gbox" style="max-width:' + Math.round(470 * g.W / g.H) + 'px"><svg class="bn-gsvg" viewBox="0 0 ' + g.W + " " + g.H.toFixed(0) + '" role="img" aria-label="' + MV.esc(aria) + '">' + gSVG(g, o) + '</svg><div class="bn-bins" role="group" aria-label="Bins: arrow keys move, Enter selects">' + bins + "</div></div>" +
      '<p class="bn-ginfo" id="bn-ginfo" aria-live="polite">' + (info || '<span class="muted">Hover over or focus a bin to see how many paths lead to it.</span>') + "</p>" +
      '<p class="tiny muted bn-gcap">Solid bars: ' + M("P(X = x)") + ". " + (tot ? "Outlined bars: the " + tot + " balls dropped (" + B.c.join(", ") + ")." : "Drop balls to collect them in the bins.") + " Each ball goes right with probability " + M("p = " + d.P.txt) + ".</p>" +
      '<div class="q-actions"><button type="button" class="btn sm" data-gal="1" data-k="bng1">Drop 1 ball</button><button type="button" class="btn sm" data-gal="50" data-k="bng50">Drop 50 balls</button><button type="button" class="btn ghost sm" data-gal="clear" data-k="bngclr">Empty the bins</button>' +
      (canTrace ? '<button type="button" class="btn ghost sm" data-gal="trace" data-k="bngtr">Show the ' + C(S.n, S.a) + " paths to bin " + S.a + "</button>" : "") + "</div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    paintCtlBusy();
  }
  var hoverBin = null;
  function binInfo(k){
    if (k == null || k > S.n) return "";
    var d = D(), c = C(S.n, k);
    return M("C(" + S.n + ", " + k + ") = " + MV.mdm.fmt(c)) + " path" + (c === 1 ? "" : "s") + " lead" + (c === 1 ? "s" : "") + " here. Each has probability " + M("(" + d.P.txt + ")^" + k + "(" + d.P.qtxt + ")^" + (S.n - k)) + ", so " + M("P(X = " + k + ")") + " " + M(probTxt(d, d.rows[k].c, d.rows[k].p)) + ".";
  }
  function setInfo(k){ var el = $("#bn-ginfo", host); if (el && !pv.trace && !pv.hide) el.innerHTML = binInfo(k) || ""; }
  host.addEventListener("mouseover", function(e){ var b = e.target.closest("[data-bin]"); if (!b) return; hoverBin = +b.dataset.bin; setInfo(hoverBin); });
  host.addEventListener("mouseout", function(e){ var b = e.target.closest("[data-bin]"); if (!b) return; hoverBin = null; });
  host.addEventListener("focusin", function(e){ var b = e.target.closest("[data-bin]"); if (!b) return; binFocus = +b.dataset.bin; host.querySelectorAll("[data-bin]").forEach(function(q){ q.tabIndex = q === b ? 0 : -1; }); setInfo(binFocus); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-bin]"); if (!b) return;
    var x = +b.dataset.bin, nx = e.key === "ArrowRight" ? x + 1 : e.key === "ArrowLeft" ? x - 1 : e.key === "Home" ? 0 : e.key === "End" ? S.n : null;
    if (nx == null) return; e.preventDefault(); nx = Math.max(0, Math.min(S.n, nx));
    var nb = host.querySelector('[data-bin="' + nx + '"]'); if (nb) nb.focus();
  });
  function paintSimBox(){
    if (S.view !== "sim") return;
    paintSimTxt();
  }
  function paintSimTxt(){
    var s = simCur(), t = $("#bn-simtxt", host);
    t.innerHTML = sim && sim.stop ? MV.mdm.fmt(sim.done) + " of " + MV.mdm.fmt(sim.N) + " experiments…" :
      (s && s.done ? MV.mdm.fmt(s.done) + " experiments of " + M("n = " + S.n) + " trials. " : "Choose how many experiments, then press Run. ") + "Solid bars: theoretical. Outlined bars: simulated. The runs are seeded, so the same settings give the same results every time.";
  }

  // --- events ---
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "bn-n") { user(); S.n0 = S.n; S.n = clampI(t.value, 1, 20, 10); changedNP(); return; }
    if (t.id === "bn-p") { user(); S.pc = null; S.pk = clampI(t.value, 1, 19, 10); changedNP(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg") || b.dataset.bar != null) return;
    if (b.id === "bn-es") { if (anim) cancelAnim(); S.es = !S.es; save(); render(); return; }
    if (b.id === "bn-run") { user(); runSim(); paintCtlBusy(); return; }
    if (b.dataset.q) { user(); var k = S.k; if (b.dataset.q === "eq") { S.a = S.b = k; } else if (b.dataset.q === "le") { S.a = 0; S.b = k; } else { S.a = k; S.b = S.n; } save(); render(); MV.changed(); return; }
    if (b.dataset.bin != null) { if (pv.hide) return; binFocus = +b.dataset.bin; pickBar(+b.dataset.bin); return; }
    if (b.dataset.gal) {
      var a = b.dataset.gal;
      if (a === "1" || a === "50") { pv = {}; dropBalls(+a); return; }
      if (a === "clear") { user(); S.balls = { key:ballKey(), c:[], drops:S.balls.drops || 0 }; save(); render(); return; }
      if (a === "trace") { user(); traceStart(S.a, null); }
    }
  });

  // --- path tracing: the C(n, k) paths to bin k glow one at a time ---
  function traceStart(k, fin){
    var list = words(S.n, k);
    newAnim(fin);
    pv.trace = { words:list, m:0, cnt:"" };
    paintGal();
    var i = 0;
    (function next(){
      later(i === 0 ? 250 : 560, function(){
        i++; pv.trace.m = i;
        pv.trace.cnt = "<strong>" + i + " path" + (i === 1 ? "" : "s") + (i === list.length ? " = " + M("C(" + S.n + ", " + k + ")") : "") + "</strong>: " + list[i - 1].split("").join(" ") + " (" + k + " right" + (k === 1 ? "" : "s") + ")";
        pv.cap = i === list.length ? "`" + i + "` paths = `C(" + S.n + ", " + k + ")`" : "`" + i + "` path" + (i === 1 ? "" : "s");
        paintGal(); paintCap();
        if (i < list.length) next(); else later(900, function(){ var c = pv.cap; pv.trace = null; pv.keepCap = c; endAnim(); pv.cap = c; paintCap(); });
      });
    })();
  }

  render();

  // --- predictions ---
  function setState(o){ Object.keys(o).forEach(function(k){ S[k] = o[k]; }); S.n0 = S.n; }
  function startPred(p){
    user(); stopSim();
    if (p.id === "p1") { setState({ view:"galton", n:4, pc:"1/2", pk:10, a:2, b:2, k:2, es:false }); pv = { hide:true }; }
    else if (p.id === "p2") { setState({ view:"hist", n:10, pc:null, pk:10, a:5, b:5, k:5, es:false }); pv = { ymax:0.31 }; }
    else if (p.id === "p3") { setState({ view:"hist", n:10, pc:null, pk:6, a:3, b:3, k:3, es:true }); pv = { x1:40, ymax:0.27 }; }
    else { setState({ view:"hist", n:5, pc:"1/2", pk:10, a:2, b:2, k:2, es:false }); pv = { hide:true }; }
    msg = ""; save(); render();
  }
  function runPred(p, done){
    if (p.id === "p1") {
      pv.hide = true; traceStart(2, function(){ pv.hide = false; done(); });
      return;
    }
    newAnim(done);
    if (p.id === "p2") {
      var keep = { ymax:0.31 };
      pv.cap = "`p`: 0.5 → 0.2";
      anim.stops.push(MV.tween({ dur:1900, step:function(t){ pv.pf = 0.5 - 0.3 * t; pv.ymax = keep.ymax; render(); }, done:function(){
        pv.pf = null; S.pk = 4; S.a = S.b = S.k = 2; save(); render(); later(700, function(){ pv = { cap:"Skewed right: peak at 2, tail to the right" }; endAnim(); }); } }));
      return;
    }
    if (p.id === "p3") {
      pv.cap = "`σ`: 1.45 → …";
      anim.stops.push(MV.tween({ dur:2200, ease:function(t){ return t; }, step:function(t){ var n = Math.round(10 + 30 * t); if (n !== S.n) { S.n = n; S.n0 = n; S.a = S.b = S.k = Math.round(n * 0.3); render(); } }, done:function(){
        S.n = 40; S.n0 = 40; S.a = S.b = S.k = 12; save(); pv.cap = "`σ`: 1.45 → 2.90 (doubled)"; render(); later(700, function(){ pv = { x1:40, ymax:0.27, cap:pv.cap }; endAnim(); }); } }));
      return;
    }
    pv.cap = "Watch the bars…";
    later(200, function(){
      pv.hide = false; pv.grow = 0;
      anim.stops.push(MV.tween({ dur:1100, step:function(t){ pv.grow = t; paintChart(); }, done:function(){
        pv.grow = null; S.es = true; S.a = 2; S.b = 3; S.k = 2; save(); pv.cap = "`P(X = 2) = P(X = 3) = 10/32`; `E(X) = 2.5`"; render();
        later(900, function(){ pv = { cap:pv.cap }; endAnim(); }); } }));
      render();
    });
  }

  // --- challenges ---
  function pIs(v){ return Math.abs(P().v - v) < 1e-9; }
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (pv.pf != null || pv.hide) return R("Wait for the animation to finish.");
    var d = D(), st = statsOf(d.n, d.P);
    if (id === "tc1") {
      if (S.n === 18 && S.pc === "1/3") return { ok:true };
      if (S.n === 12 && pIs(0.5)) return R("`E` is right, but `σ = √{12 × 0.5 × 0.5} = √3`.");
      if (S.n === 20 && pIs(0.3)) return R("`E = 6`, but `σ = √{4.2}`.");
      return R("Right now `E(X) = " + st.Etxt + "` and `σ = " + st.sdShort + "`. You need `E(X) = 6` and `σ = 2`" + (Math.abs(st.E - 6) < 1e-9 && Math.abs(st.sd - 2) < 0.05 ? ", exactly: use a chip for `p`." : "."));
    }
    if (id === "tc2") {
      if (S.n !== 6) return R("Set `n = 6` first.");
      var md = modesOf(d);
      if (md.length === 1 && md[0] === 4) return { ok:true };
      if (pIs(0.75)) return R("The peak is now at 5: `E = 4.5`.");
      if (pIs(0.5)) return R("The peak is at 3.");
      if (pIs(0.55)) return R("The peak is still at 3.");
      if (md.length > 1) return R("Bars " + md.join(" and ") + " tie. You need one tallest bar, at 4.");
      return R("The peak is at " + md[0] + ": `E = np = " + st.Etxt + "`. Move `p` so that `np` is near 4.");
    }
    if (id === "tc3") {
      var miss = pIs(0.25), make = pIs(0.75), n = S.n;
      if (!miss && !make) return R("She makes `3/4` of her free throws. Set `p = 1/4` (success = a miss) or `p = 3/4` (success = a make).");
      var atLeast = miss ? S.a === 1 && S.b === n : S.a === 0 && S.b === n - 1;
      if (!atLeast) {
        if (miss ? S.a === 1 && S.b === 1 : S.a === n - 1 && S.b === n - 1) return R("That’s exactly one miss. ‘At least one’ also includes 2, 3, … misses.");
        return R(miss ? "With success = a miss, select ‘at least one miss’: `X ≥ 1`." : "With success = a make, ‘at least one miss’ means `X <= n - 1`, here `X <= " + (n - 1) + "`.");
      }
      if (n === 9) return { ok:true };
      if (n === 8) return R("`P ≈ 0.8999`, just under 0.9.");
      if (n < 8) return R("`P ≈ " + d4(1 - Math.pow(0.75, n)) + "`, below 0.9. Try more shots.");
      return R("That works, but it isn’t the smallest.");
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Is it binomial? (three stations) ----------
function part3(host, api){
  var S = api.S, P3 = api.content || {}, CARDS = P3.cards || [], BINS = P3.bins || [], FIX = P3.fixes || [];
  var ST = [{ id:"s1", t:"BINS check" }, { id:"s2", t:"Fix it" }, { id:"s3", t:"Check it with algebra" }];
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = "s1";
  S.s1 = obj(S.s1); S.s2 = obj(S.s2); S.s3 = obj(S.s3); S.s3.m = obj(S.s3.m);
  var msg1 = {}, msg3 = "", tree = null;
  function c1(id){ var x = S.s1[id] = obj(S.s1[id]); x.pick = obj(x.pick); return x; }
  function done(id){
    if (id === "s1") return CARDS.every(function(c){ return c1(c.id).ok; });
    if (id === "s2") return FIX.every(function(f){ return obj(S.s2[f.id]).ok; });
    return ["S,S,F", "S,F,S", "F,S,S"].every(function(k){ return S.s3.m[k]; });
  }
  host.innerHTML = '<div id="bi-tabs" class="bi-tabs"></div><div id="bi-body" class="bi-body"></div>';
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.t + (done(s.id) ? ' <span class="bi-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#bi-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function retab(){ tabText(); tabs.refresh(); }

  // Station 1: tap every condition that fails
  function s1(){
    var n = CARDS.filter(function(c){ return c1(c.id).ok; }).length;
    return '<p class="bi-task">For each scenario, tap every condition that <strong>fails</strong>, then press Check. If every condition holds, tap nothing and press Check.</p><p class="tiny"><strong>' + n + "</strong> of " + CARDS.length + " cards right.</p>" +
      CARDS.map(function(c, i){
        var x = c1(c.id), h = '<div class="bi-card' + (x.ok ? " ok" : "") + '" data-card="' + c.id + '"><p class="bi-ct"><span class="bi-cn">Card ' + (i + 1) + "</span> " + c.t + "</p>";
        h += '<div class="bi-bins" role="group" aria-label="Conditions that fail for card ' + (i + 1) + '">' + BINS.map(function(b){ return '<button type="button" class="chip bi-chip' + (x.pick[b.id] ? " on" : "") + '" data-bin="' + b.id + '" data-k="bi' + c.id + b.id + '" aria-pressed="' + !!x.pick[b.id] + '"' + (x.ok ? " disabled" : "") + ">" + b.t + "</button>"; }).join("") + "</div>";
        if (!x.ok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="s1chk" data-k="bi' + c.id + 'chk">Check</button></div>';
        if (x.ok) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + c.right);
        else if (msg1[c.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg1[c.id] + " Try again.");
        return h + "</div>";
      }).join("");
  }
  function judge1(c){
    var x = c1(c.id), want = MV.ans(c) || [], got = BINS.map(function(b){ return b.id; }).filter(function(k){ return x.pick[k]; });
    var miss = want.filter(function(k){ return got.indexOf(k) < 0; }), extra = got.filter(function(k){ return want.indexOf(k) < 0; });
    if (!miss.length && !extra.length) { x.ok = true; msg1[c.id] = null; return; }
    x.tries = (x.tries || 0) + 1;
    if (!got.length && c.none) msg1[c.id] = c.none;
    else if (miss.length) msg1[c.id] = (c.miss || {})[miss[0]] || "Another condition fails too.";
    else msg1[c.id] = ((c.extraBy || {})[extra[0]]) || c.extra || "That condition holds here.";
  }
  // Station 2: make it binomial
  function s2(){
    return '<p class="bi-task">Three scenarios failed the BINS check. Choose the change that makes each one binomial.</p>' + FIX.map(function(f, i){
      var x = obj(S.s2[f.id]), opts = MV.shuffle(f.options.map(function(o, k){ return k; }), "mdm21-fix-" + f.id), h = '<div class="bi-card' + (x.ok ? " ok" : "") + '" data-fix="' + f.id + '"><p class="bi-ct"><span class="bi-cn">Card ' + (CARDS.map(function(c){ return c.id; }).indexOf(f.id) + 1) + "</span> " + f.t + "</p>";
      h += '<div class="opts bi-fopts">' + opts.map(function(k){ var o = f.options[k], c = "opt"; if (x.pick === k) c += MV.ok(o) ? " right" : " wrong";
        return '<button type="button" class="' + c + '" data-opt="' + k + '" data-k="bif' + f.id + k + '"' + (x.ok ? " disabled" : "") + "><span>" + o.t + "</span></button>"; }).join("") + "</div>";
      if (x.pick != null) { var o = f.options[x.pick]; h += MV.ok(o) ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + o.why) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + o.why + " Try the other change."); }
      void i; return h + "</div>";
    }).join("");
  }
  // Station 3: the tree for n = 3, then the formula
  function s3(){
    var marked = ["S,S,F", "S,F,S", "F,S,S"].filter(function(k){ return S.s3.m[k]; }), all = marked.length === 3;
    var h = '<p class="bi-task">Here is the tree for 3 trials: each branch is a success ' + M("S") + " (probability " + M("p") + ") or a failure " + M("F") + " (probability " + M("q") + "). Tap every path with <strong>exactly 2 successes</strong>.</p>";
    h += '<div class="bi-two"><div id="bi-tree" class="bi-tree"></div><div class="bi-alg"><details class="alg" open><summary>Check it with algebra</summary><div class="alg-lines">';
    if (!marked.length) h += '<span class="muted">Tap the paths with exactly 2 successes; each one appears here.</span>';
    marked.forEach(function(k){ var w = k.split(","); h += "<span>" + w.join("") + ": " + M(w.map(function(c){ return c === "S" ? "p" : "q"; }).join(" · ") + " = p^2 q") + "</span>"; });
    if (all) {
      h += "<span><strong>3 paths</strong> × " + M("p^2 q") + " = " + M("C(3, 2) p^2 q^1") + "</span>";
      h += '<span class="bi-gen">In general, ' + M("P(X = x) =") + '</span><span class="bi-form"><span class="bi-fp"><span class="bi-fm">' + M("C(n, x)") + '</span><span class="bi-fl">how many orders (paths)</span></span><span class="bi-fx">·</span>' +
        '<span class="bi-fp"><span class="bi-fm">' + M("p^x") + '</span><span class="bi-fl">' + M("x") + ' successes</span></span><span class="bi-fx">·</span><span class="bi-fp"><span class="bi-fm">' + M("q^{n - x}") + '</span><span class="bi-fl">' + M("n - x") + " failures</span></span></span>";
    }
    h += "</div></details>" + (msg3 ? MV.fbHTML(msg3.k, msg3.t) : "") + "</div></div>";
    return h;
  }
  function paint(){
    retab();
    var body = $("#bi-body", host), id = S.cur, h = id === "s1" ? s1() : id === "s2" ? s2() : s3();
    if (done(id)) h += '<p class="bi-done"><strong>✓ Station ' + (ST.map(function(s){ return s.id; }).indexOf(id) + 1) + " complete.</strong> " + (ST.every(function(s){ return done(s.id); }) ? "All three stations done. Try the quick check below." : "Choose another station above.") + "</p>";
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="bi-wrap">' + h + "</div>"; });
    if (id === "s3") {
      var keys = Object.keys(S.s3.m).filter(function(k){ return S.s3.m[k]; });
      tree = treeDiagram($("#bi-tree", body), { stages:[1, 2, 3].map(function(i){ return { name:"Trial " + i, branches:[{ id:"S", t:"S", p:M("p") }, { id:"F", t:"F", p:M("q") }] }; }),
        showP:true, label:"Tree for 3 trials: tap the paths with exactly 2 successes", leafText:function(p){ return p.join(""); },
        leafNote:function(p){ var s = p.filter(function(c){ return c === "S"; }).length; return M((s ? "p" + (s > 1 ? "^" + s : "") : "") + (3 - s ? "q" + (3 - s > 1 ? "^" + (3 - s) : "") : "")); },
        leafAria:function(p){ return p.map(function(c){ return c === "S" ? "success" : "failure"; }).join(", "); },
        onTap:tap3, minLeaf:58, levelH:56, rowH:38, colW:84, leafW:96 });
      tree.mark(keys); tree.render();
    }
  }
  function tap3(key, path){
    var s = path.filter(function(c){ return c === "S"; }).length;
    if (s !== 2) { msg3 = { k:"bad", t:"<strong>✗ " + path.join("") + "</strong> has " + s + " success" + (s === 1 ? "" : "es") + ", not 2." }; }
    else { S.s3.m[key] = !S.s3.m[key]; msg3 = S.s3.m[key] ? { k:"good", t:"<strong>✓ " + path.join("") + "</strong>: 2 successes and 1 failure, probability " + M("p^2 q") + "." } : ""; api.save(); }
    paint();
    var b = host.querySelector('[data-key="' + key + '"]'); if (b) b.focus({ preventScroll:true });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg") || b.closest(".d1")) return;
    var card = b.closest("[data-card]"), fix = b.closest("[data-fix]");
    if (card && b.dataset.bin) { var x = c1(card.dataset.card); x.pick[b.dataset.bin] = !x.pick[b.dataset.bin]; msg1[card.dataset.card] = null; api.save(); paint(); return; }
    if (card && b.dataset.act === "s1chk") { var c = CARDS.filter(function(q){ return q.id === card.dataset.card; })[0]; judge1(c); api.save(); paint(); retab(); MV.focusFb(host.querySelector('[data-card="' + c.id + '"]')); return; }
    if (fix && b.dataset.opt != null) {
      var f = FIX.filter(function(q){ return q.id === fix.dataset.fix; })[0], y = S.s2[f.id] = obj(S.s2[f.id]); y.pick = +b.dataset.opt; if (MV.ok(f.options[y.pick])) y.ok = true; else y.tries = (y.tries || 0) + 1;
      api.save(); paint(); MV.focusFb(host.querySelector('[data-fix="' + f.id + '"]'));
    }
  });
  paint();
  return {};
}

// @component D1 treeDiagram — copied from MDM4U 17 (01's tree + grow onLevel + dim); trimmed: no grow/dim here.
// Sample-space tree (HTML labels and leaf buttons over SVG branches): stages of branches with labels and optional branch
// probabilities; leaves are buttons (tap to toggle; arrow keys, Home/End; roving tabindex); "down" or "right" layout ("auto"
// picks "down" when every leaf gets minLeaf px); marked leaves and their paths in highlighter yellow; leafNote for products.
// t = treeDiagram(host, { stages:[{ name, branches:[{ id, t, p }] }], leafText(path), leafAria(path), leafNote(path), showP,
//   onTap(key, path), orient, minLeaf, levelH, rowH, colW, leafW, label }) ; t.mark(keys); t.render()
function treeDiagram(host, o){
  var marked = {}, fk = null, lastW = 0;
  host.classList.add("d1");
  host.innerHTML = '<div class="d1-scroll"><div class="d1-box"><svg class="d1-svg" aria-hidden="true" focusable="false"></svg><div class="d1-in" role="group"></div></div></div>';
  var scroll = host.querySelector(".d1-scroll"), box = host.querySelector(".d1-box"), svg = host.querySelector(".d1-svg"), inner = host.querySelector(".d1-in");
  function key(p){ return p.join(","); }
  function build(){
    var leaves = [], all = [], root = { path:[], depth:0 };
    (function rec(n){ all.push(n); var s = o.stages[n.path.length], bs = s ? s.branches : []; if (!bs.length) { n.leaf = true; leaves.push(n); return; }
      n.kids = bs.map(function(b){ return { path:n.path.concat([b.id]), b:b, depth:n.depth + 1, parent:n }; }); n.kids.forEach(rec); })(root);
    return { root:root, leaves:leaves, all:all, D:o.stages.length };
  }
  function centre(n, prop){ if (n.leaf) return [n[prop], n[prop]]; var lo = Infinity, hi = -Infinity; n.kids.forEach(function(c){ var r = centre(c, prop); lo = Math.min(lo, r[0]); hi = Math.max(hi, r[1]); }); n[prop] = (lo + hi) / 2; return [lo, hi]; }
  function render(){
    var T = build(), W = Math.max(220, Math.floor(scroll.clientWidth || host.clientWidth || 320)), nL = T.leaves.length, D = T.D, g = {}; lastW = W;
    g.orient = o.orient && o.orient !== "auto" ? o.orient : nL * (o.minLeaf || 58) <= W ? "down" : "right";
    if (g.orient === "down") {
      var lw = W / nL, lh = o.levelH || 58;
      T.leaves.forEach(function(l, i){ l.x = lw * (i + 0.5); }); centre(T.root, "x"); T.all.forEach(function(n){ n.y = 16 + n.depth * lh; });
      g.leafY = 16 + D * lh + 40; g.H = g.leafY + 24; g.W = W;
    } else {
      var rowH = o.rowH || 36, top2 = 30, left = 14, leafW = o.leafW || 92, colW = Math.max(40, Math.min(o.colW || 96, (W - left - leafW - 30) / D));
      T.leaves.forEach(function(l, i){ l.y = top2 + rowH * (i + 0.5); }); centre(T.root, "y"); T.all.forEach(function(n){ n.x = left + n.depth * colW; });
      g.leafX = left + D * colW + 24; g.H = top2 + nL * rowH + 8; g.W = Math.max(W, g.leafX + leafW + 8); g.colW = colW; g.left = left;
    }
    var on = {}, onLeaf = {};
    Object.keys(marked).forEach(function(k){ if (!marked[k]) return; onLeaf[k] = 1; var p = k.split(","); for (var i = 1; i <= p.length; i++) on[p.slice(0, i).join(",")] = 1; });
    host.classList.toggle("right", g.orient === "right"); host.classList.toggle("down", g.orient === "down");
    box.style.height = g.H + "px"; box.style.width = g.W + "px";
    svg.setAttribute("width", g.W); svg.setAttribute("height", g.H); svg.setAttribute("viewBox", "0 0 " + g.W + " " + g.H);
    var e = "", hi = "", h = "", fx = function(v){ return Math.round(v * 10) / 10; };
    T.all.forEach(function(n){
      if (!n.parent) return;
      var x0 = n.parent.x, y0 = n.parent.y, seg = "M" + fx(x0) + " " + fx(y0) + "L" + fx(n.x) + " " + fx(n.y);
      e += seg; if (on[key(n.path)]) hi += seg;
      if (o.showP && n.b.p != null) h += '<span class="d1-p" style="left:' + fx((x0 + n.x) / 2 + (g.orient === "down" ? (n.b.id === "S" ? -9 : 9) : 0)) + "px;top:" + fx((y0 + n.y) / 2 - (g.orient === "down" ? 0 : 10)) + 'px">' + n.b.p + "</span>";
      h += '<span class="d1-lab' + (on[key(n.path)] ? " on" : "") + '" style="left:' + fx(n.x) + "px;top:" + fx(n.y) + 'px">' + n.b.t + "</span>";
    });
    T.leaves.forEach(function(l){
      var k = key(l.path), x = g.orient === "down" ? l.x : g.leafX, y = g.orient === "down" ? g.leafY : l.y;
      var con = g.orient === "right" ? "M" + fx(l.x + 14) + " " + fx(l.y) + "L" + fx(x - 4) + " " + fx(l.y) : "M" + fx(l.x) + " " + fx(l.y + 13) + "L" + fx(l.x) + " " + fx(y - 17);
      e += con; if (onLeaf[k]) hi += con;
      var txt = o.leafText(l.path), note = o.leafNote ? o.leafNote(l.path) : "", aria = (o.leafAria ? o.leafAria(l.path) : MV.plain(txt)) + (note ? ", " + MV.plain(note) : "");
      h += '<button type="button" class="d1-leaf' + (onLeaf[k] ? " on" : "") + '" data-key="' + k + '" aria-pressed="' + !!onLeaf[k] + '" aria-label="' + MV.esc(aria) + '" tabindex="' + (k === fk ? 0 : -1) + '" style="left:' + fx(x) + "px;top:" + fx(y) + 'px">' + txt + (note ? " <small>" + note + "</small>" : "") + "</button>";
    });
    h = '<span class="d1-root" style="left:' + fx(T.root.x) + "px;top:" + fx(T.root.y) + 'px"></span>' + h;
    if (g.orient === "right") o.stages.forEach(function(s, i){ h += '<span class="d1-stage" style="left:' + fx(g.left + (i + 1) * g.colW) + 'px;top:4px">' + s.name + "</span>"; });
    svg.innerHTML = (hi ? '<path class="d1-hi" d="' + hi + '"/>' : "") + '<path class="d1-e" d="' + e + '"/>';
    var had = inner.contains(document.activeElement) ? document.activeElement.dataset.key : null;
    inner.setAttribute("aria-label", o.label || "Tree diagram");
    inner.innerHTML = h;
    var lb = inner.querySelectorAll("button.d1-leaf");
    if (lb.length && !inner.querySelector('button[tabindex="0"]')) { lb[0].tabIndex = 0; fk = lb[0].dataset.key; }
    if (had) { var b = inner.querySelector('[data-key="' + had + '"]'); if (b) b.focus({ preventScroll:true }); }
  }
  inner.addEventListener("click", function(ev){ var b = ev.target.closest("button.d1-leaf"); if (!b) return; fk = b.dataset.key; if (o.onTap) o.onTap(b.dataset.key, b.dataset.key.split(",")); });
  inner.addEventListener("focusin", function(ev){ var b = ev.target.closest("button.d1-leaf"); if (!b) return; fk = b.dataset.key; inner.querySelectorAll("button.d1-leaf").forEach(function(x){ x.tabIndex = x === b ? 0 : -1; }); });
  inner.addEventListener("keydown", function(ev){
    var b = ev.target.closest("button.d1-leaf"); if (!b) return;
    var list = Array.prototype.slice.call(inner.querySelectorAll("button.d1-leaf")), i = list.indexOf(b), j = i;
    if (ev.key === "ArrowDown" || ev.key === "ArrowRight") j = Math.min(list.length - 1, i + 1); else if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") j = Math.max(0, i - 1);
    else if (ev.key === "Home") j = 0; else if (ev.key === "End") j = list.length - 1; else return;
    ev.preventDefault(); list[j].focus();
  });
  if (window.ResizeObserver) new ResizeObserver(function(){ var w = Math.floor(scroll.clientWidth); if (w && Math.abs(w - lastW) > 2) render(); }).observe(scroll);
  return { mark:function(keys){ marked = {}; (keys || []).forEach(function(k){ marked[k] = 1; }); }, render:render };
}

// @component N4 probEntry — number entry for probabilities (copied from MDM4U 18; adds per-part tol:[…], √ answers through
// MV.parseNum ("2√2", "√8"), wrong answers that name every part ({all:[…], fb}) and item labels B1, B2, …): fractions,
// decimals and percents; two-part items (parts:[label, label], answer:[a, b]) get a box per part. First-try scoring.
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
    var named = (it.wrong || []).filter(function(w){ return w.all ? w.all.every(function(m, k){ return close(nums[k], m, 5e-5); }) : close(nums[w.part || 0], w.match, 5e-5); })[0];
    var fb = named ? named.fb : null;
    if (!fb && A.length > 1) { var k1 = oks.indexOf(true), k2 = oks.indexOf(false); if (k1 >= 0) fb = MV.md(it.parts[k1].replace(/\s*=\s*$/, "")) + " is right. Check " + MV.md(it.parts[k2].replace(/\s*=\s*$/, "")) + "."; }
    return { ok:false, fb:fb };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), parts = it.parts || [it.label || "Your answer:"];
        var h = '<div class="q" data-pe="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">B' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
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
      if (r.bad) { msgs[it.id] = (it.parts ? "Fill in both boxes. " : "") + "Enter a fraction such as 3/8 or a decimal such as 0.375."; paint(); MV.focusFb(host.querySelector('[data-pe="' + it.id + '"]')); return; }
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

// ---------- Performance task: Design a binomial distribution ----------
var task = (function(){
  var api = null, plot = null, pR = null, PCH = ["1/6", "1/5", "1/4", "1/3", "1/2", "2/3", "3/4", "4/5", "5/6"];
  function read(){ var s = api ? api.S : {}; return { n:clampI(s.n, 1, 20, 10), p:PCH.indexOf(s.p) >= 0 ? s.p : "1/4" }; }
  function info(d){ var P = pOf(d.p), B = binom(d.n, P); return { P:P, B:B, st:statsOf(d.n, P), p0:B.rows[0].p }; }
  function draw(){
    var d = read(), I = info(d), mx = 0; I.B.rows.forEach(function(r){ mx = Math.max(mx, r.p); });
    var sc = scaleOf(mx);
    distChart(plot, { x0:0, x1:d.n, ymax:sc.ymax, yStep:sc.step, bars:I.B.rows.map(function(r){ return { x:r.x, p:r.p }; }), mean:{ x:I.st.E, label:"E(X) = " + MV.plain(M(I.st.Etxt)) }, sigma:{ lo:I.st.E - I.st.sd, hi:I.st.E + I.st.sd },
      yLabel:"P(X = x)", xLabel:"x", describe:"Your binomial distribution: n = " + d.n + ", p = " + d.p + ", " + I.st.shapeShort + ", E(X) = " + MV.plain(M(I.st.Etxt)) + ", σ ≈ " + d2(I.st.sd) + ", P(X = 0) ≈ " + d4(I.p0) + "." });
  }
  function paint(){
    var d = read(), I = info(d), el = $("#bt-read"); if (!el) return;
    $("#bt-n-out").textContent = String(d.n); $("#bt-n").value = d.n; $("#bt-n").setAttribute("aria-valuetext", "n = " + d.n);
    el.innerHTML = MV.readoutHTML([["Expected value", M("E(X) = np = " + I.st.Etxt) + I.st.Eapx], ["Standard deviation", M("σ = √{npq} = " + I.st.sdTxt)],
      ["Zero successes", M("P(X = 0) = q^{" + d.n + "} = (" + I.P.qtxt + ")^{" + d.n + "}") + " " + M(apx(I.p0))], ["Shape", I.st.shape]]);
    draw();
  }
  return {
    render:function(inp, pvw, a){
      api = a; var d = read(); a.S.n = d.n; a.S.p = d.p;
      inp.innerHTML = '<label class="slider"><span class="slider-top"><span>Trials ' + M("n") + '</span><output id="bt-n-out"></output></span><input type="range" id="bt-n" min="1" max="20" step="1" value="' + d.n + '"></label><div id="bt-p"></div>';
      pR = radios($("#bt-p", inp), { label:"Probability of success " + M("p"), aria:"Probability of success p", options:PCH.map(function(c){ return { id:c, t:M(c), aria:"p = " + c }; }), value:d.p, cls:"chips",
        onChange:function(v){ a.S.p = v; a.save(); paint(); a.update(); } });
      pvw.innerHTML = '<canvas class="plot bt-plot" id="bt-plot" role="img" aria-label="Your binomial histogram"></canvas><dl class="read bt-read" id="bt-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#bt-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      $("#bt-n").addEventListener("input", function(e){ a.S.n = clampI(e.target.value, 1, 20, 10); a.save(); paint(); a.update(); });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var q = d.p.split("/"), pa = +q[0], pd = +q[1], pb = pd - pa, E = F.of(d.n * pa, pd);
      return [E.d === 1 && E.n >= 3 && E.n <= 6, d.n * pa * pb < 4 * pd * pd, 2 * pa < pd, Math.pow(pb / pd, d.n) < 0.03]; },
    key:function(d){ return d.n + "|" + d.p; },
    label:function(k){ var q = k.split("|"); return M("(n, p) = (" + q[0] + ", " + q[1] + ")"); },
    text:function(k){ var q = k.split("|"); return "(n, p) = (" + q[0] + ", " + q[1] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ calc:probEntry },
  task:task
});
})();
