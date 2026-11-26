// MDM4U 22 The Geometric Distribution: hero (a die rolls 3, 1, 5, 6 so X = 3; three more runs drop blocks into a histogram;
// hundreds of runs fill a falling staircase), Waiting room (Explore: p chips + slider; One run / Many runs / Theory / Memory
// test views; range selector X = a, X ≥ a, X ≤ a; a failures/trials convention toggle), Waiting-time problems (Part 3: four
// station cards with chips, a unit-bar algebra panel and the trials convention), Prize within k tries task.
// Probabilities are exact fractions when p comes from a chip; every simulation is seeded (MV.mdm.seededRandom), so the same
// settings repeat exactly on any device.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;
function M(s){ return MV.m(s); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function dec(v, dp){ var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/0+$/, "").replace(/\.$/, ""); if (s === "-0") s = "0"; return s.replace("-", MV.MINUS); }
function d4(v){ return dec(v, 4); }
function d2(v){ return dec(v, 2); }
function exact4(v){ return Math.abs(Math.round(v * 1e4) / 1e4 - v) < 1e-12; }
function apx(v){ return (exact4(v) ? "= " : "≈ ") + d4(v); }
function isDark(){ var c = css("--sheet"), m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c); if (!m) return false; return (parseInt(m[1], 16) + parseInt(m[2], 16) + parseInt(m[3], 16)) / 3 < 110; }
function big(v){ return MV.mdm.fmt(v); }

// @component radioGroup (copied from MDM4U 21 / 18) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t, aria}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh, setOptions}
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

// @component D6 simulator (copied from MDM4U 19 / 18 / 16 makeSim) — seeded trials with numeric results and a running sum; to(n)
// grows the run on a geometric schedule (instant with reduced motion; a smaller n refills instantly). Here one "trial" is a
// whole waiting-time run: trial(rng) returns X, the failures before the first success.
// sim = makeSim({trial(rng) -> number, seed}); sim.reset(seed); sim.fill(n); sim.to(n, {frames, step(sim), done(sim)}); sim.seq; sim.sum; sim.stop(); sim.busy()
function makeSim(o){
  var s = { seq:[], sum:0, seed:o.seed, rng:null, raf:null };
  function stop(){ if (s.raf) cancelAnimationFrame(s.raf); s.raf = null; }
  function one(){ var v = o.trial(s.rng); s.seq.push(v); s.sum += v; }
  s.reset = function(seed){ stop(); if (seed != null) s.seed = seed; s.seq = []; s.sum = 0; s.rng = MV.mdm.seededRandom(s.seed); };
  s.fill = function(n){ s.reset(); for (var i = 0; i < n; i++) one(); };
  s.to = function(n, cb){
    cb = cb || {}; stop();
    if (n < s.seq.length) s.fill(n);
    var start = s.seq.length;
    if (MV.reduceMotion || cb.instant || n - start <= 1) { while (s.seq.length < n) one(); if (cb.step) cb.step(s); if (cb.done) cb.done(s); return; }
    var FR = cb.frames || 48, lo = Math.log10(Math.max(1, start)), hi = Math.log10(n), k = 0;
    (function tick(){
      k++; var target = k >= FR ? n : Math.max(s.seq.length + 1, Math.round(Math.pow(10, lo + (hi - lo) * k / FR)));
      while (s.seq.length < Math.min(n, target)) one();
      if (cb.step) cb.step(s);
      if (s.seq.length < n) s.raf = requestAnimationFrame(tick); else { s.raf = null; if (cb.done) cb.done(s); }
    })();
  };
  s.stop = stop; s.busy = function(){ return !!s.raf; };
  s.reset();
  return s;
}

// @component D7 distChart — geometric version (adapted from MDM4U 21's distChart, itself extended from 18's): bars of width 1
// centred on 0, 1, … (solid --pen); an optional combined tail bar in the last slot (lighter, with a break mark on the axis and
// its own label, e.g. "≥16"); outlined simulated bars over lighter theoretical bars; a --hi-soft range band; the E(X) line in
// --ink (pinned to the right edge with "→" when E is off the axis); labels over bars; bars that grow in one at a time.
// gChart(plot, { x1, tail, ymax, yStep, yFmt(v), bars:[{x, p}], sim:[{x, p}], simGrow (0–1), range:{lo, hi}, mean:{x, label},
//   marks:{x:text}, hi:[x], grow (bars shown, fractional), xFmt(x), xLabel, yLabel, describe }) -> geometry {xa, xb, y0, yt}
function gChart(plot, o){
  var c = plot.c, r = c.getBoundingClientRect(), W = Math.max(160, r.width), H = Math.max(120, r.height);
  var L = 46, R = 12, T = o.mean ? 34 : 24, B = 30, n = o.x1 + 1, bw = (W - L - R) / n, ys = (H - T - B) / o.ymax, geo = {};
  var view = { xmin:-0.5 - L / bw, xmax:o.x1 + 0.5 + R / bw, ymin:-B / ys, ymax:o.ymax + T / ys };
  plot.draw({ view:view, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var X = function(x){ return p.X(x); }, Y = function(y){ return p.Y(y); }, xa = X(-0.5), xb = X(o.x1 + 0.5), y0 = Y(0), yt = Y(o.ymax);
    var pen = css("--pen"), sheet = css("--sheet"), ink = css("--ink"), ink2 = css("--ink-2"), fUI = p.fontUI, fM = p.fontM, k;
    geo.xa = xa; geo.xb = xb; geo.y0 = y0; geo.yt = yt;
    if (o.range) { ctx.fillStyle = css("--hi-soft"); ctx.fillRect(X(o.range.lo - 0.5), yt - 2, X(o.range.hi + 0.5) - X(o.range.lo - 0.5), y0 - yt + 2); }
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    var step = o.yStep, fmt = o.yFmt || function(v){ return MV.num(v, step < 0.1 ? 2 : 1); };
    for (var v = step; v <= o.ymax + 1e-9; v += step) { var py = Math.round(Y(v)) + 0.5; ctx.moveTo(xa, py); ctx.lineTo(xb, py); }
    ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = "12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = 0; v <= o.ymax + 1e-9; v += step) ctx.fillText(fmt(Math.round(v * 1e6) / 1e6), xa - 6, Y(v));
    var simOn = !!(o.sim && o.sim.length);
    function hOf(b){ var h = b.p; if (o.grow != null) { if (b.x >= o.grow) return 0; if (b.x + 1 > o.grow) h *= o.grow - b.x; } return h; }
    (o.bars || []).forEach(function(b){
      var h = hOf(b); if (!(h > 0) || b.x < 0 || b.x > o.x1) return;
      var top = Math.max(yt - 4, Y(Math.min(h, o.ymax * 1.03))), x1 = X(b.x - 0.5), x2 = X(b.x + 0.5), tl = o.tail && b.x === o.x1;
      ctx.globalAlpha = (simOn ? 0.45 : 1) * (tl ? 0.55 : 1); ctx.fillStyle = pen; ctx.fillRect(x1, top, x2 - x1, y0 - top); ctx.globalAlpha = 1;
      if (x2 - x1 > 4) { ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.strokeRect(x1 + 0.5, top + 0.5, x2 - x1 - 1, y0 - top - 1); }
      if (tl) { ctx.strokeStyle = pen; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.strokeRect(x1 + 1.5, top + 0.75, x2 - x1 - 3, y0 - top - 0.75); ctx.setLineDash([]); }
    });
    if (simOn) {
      var g = o.simGrow == null ? 1 : o.simGrow;
      ctx.strokeStyle = isDark() ? ink2 : ink; ctx.lineWidth = 2;
      o.sim.forEach(function(s){ var h = s.p * g; if (!(h > 0) || s.x < 0 || s.x > o.x1) return; var top = Math.max(yt - 4, Y(Math.min(h, o.ymax * 1.03))), w = X(s.x + 0.5) - X(s.x - 0.5), ins = Math.min(2, w / 6); ctx.strokeRect(X(s.x - 0.5) + ins, top + 1, w - 2 * ins, y0 - top - 1); });
    }
    (o.hi || []).forEach(function(x){ var b = (o.bars || []).filter(function(q){ return q.x === x; })[0], h = b ? hOf(b) : 0; if (!(h > 0)) return; var top = Math.max(yt - 4, Y(Math.min(h, o.ymax * 1.03))); ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.strokeRect(X(x - 0.5) + 1.25, top - 1.25, X(x + 0.5) - X(x - 0.5) - 2.5, y0 - top + 1.25); });
    if (o.mean) {
      var off = o.mean.x > o.x1 + 0.45, mx = off ? xb - 2 : Math.max(xa, X(o.mean.x));
      ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, y0); ctx.lineTo(mx, yt - 4); ctx.stroke();
      ctx.font = "600 13px " + fUI; ctx.textBaseline = "bottom"; ctx.textAlign = "center";
      var lab = o.mean.label + (off ? " →" : ""), tw = ctx.measureText(lab).width, lx = Math.max(xa + tw / 2 + 2, Math.min(xb - tw / 2 - 2, mx));
      ctx.fillStyle = sheet; ctx.globalAlpha = 0.9; ctx.fillRect(lx - tw / 2 - 3, yt - 22, tw + 6, 17); ctx.globalAlpha = 1;
      ctx.fillStyle = ink; ctx.fillText(lab, lx, yt - 6);
    }
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xa, yt - 6); ctx.lineTo(xa, y0); ctx.lineTo(xb, y0); ctx.stroke();
    if (o.tail) {   // a break mark between the last single value and the combined bar
      var bx = X(o.x1 - 0.5); ctx.fillStyle = sheet; ctx.fillRect(bx - 4, y0 - 5, 8, 10);
      ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx - 6, y0 + 5); ctx.lineTo(bx - 2, y0 - 5); ctx.moveTo(bx + 2, y0 + 5); ctx.lineTo(bx + 6, y0 - 5); ctx.stroke();
    }
    ctx.fillStyle = ink; ctx.font = "14px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var xf = o.xFmt || String, every = [1, 2, 5].filter(function(q){ return bw * q >= 22; })[0] || 5, used = [];
    if (o.tail) { var tt = xf(o.x1), tw2 = ctx.measureText(tt).width, tx = Math.min(X(o.x1), xb - tw2 / 2); ctx.fillText(tt, tx, y0 + 6); used.push([tx - tw2 / 2 - 3, tx + tw2 / 2 + 3]); }
    for (k = 0; k <= o.x1 - (o.tail ? 1 : 0); k++) {
      if (k % every) continue;
      var t = xf(k), w = ctx.measureText(t).width, lx2 = X(k);
      if (used.some(function(u){ return lx2 + w / 2 > u[0] && lx2 - w / 2 < u[1]; })) continue;
      ctx.fillText(t, lx2, y0 + 6);
    }
    if (o.marks) {
      ctx.font = "600 12px " + fUI; ctx.textBaseline = "bottom"; ctx.fillStyle = ink;
      Object.keys(o.marks).forEach(function(q){ var x = +q, b = (o.bars || []).filter(function(z){ return z.x === x; })[0], h = b ? Math.min(hOf(b), o.ymax) : 0; ctx.fillText(o.marks[q], X(x), Y(h) - 4); });
    }
    if (o.yLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yLabel, 4, 3); }
    if (o.xLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(o.xLabel, xa - 6, y0 + 6); }
  } });
  return geo.xa != null ? geo : null;
}
var SCALES = [[0.05, 0.01], [0.1, 0.02], [0.15, 0.05], [0.2, 0.05], [0.25, 0.05], [0.3, 0.1], [0.4, 0.1], [0.5, 0.1], [0.6, 0.2], [0.8, 0.2], [1, 0.2]];
function scaleOf(m){ var s = SCALES.filter(function(q){ return q[0] >= Math.min(1, m * 1.08); })[0] || SCALES[SCALES.length - 1]; return { ymax:s[0], step:s[1] }; }

// ---------- the geometric model ----------
var CHIPS = ["1/6", "1/5", "1/4", "1/3", "2/5", "1/2", "2/3", "3/4"], NB = 16, MEMN = 20000;
// p from a chip ("1/3"), the slider (k/20) or an animation (float f): {v, a, d, txt, qtxt, chip}; a/d only when exact (chip)
function pOf(chip, k, f){
  if (f != null) return { v:f, a:null, d:null, txt:d2(f), qtxt:d2(1 - f), chip:false };
  if (chip) { var q = chip.split("/"), a = +q[0], d = +q[1]; return { v:a / d, a:a, d:d, txt:chip, qtxt:(d - a) + "/" + d, chip:true }; }
  return { v:k / 20, a:null, d:null, txt:d2(k / 20), qtxt:d2(1 - k / 20), chip:false };
}
function pmfV(P, x){ return Math.pow(1 - P.v, x) * P.v; }
function tailV(P, k){ return Math.pow(1 - P.v, k); }
function qPow(P, k){ return P.chip ? F.of(Math.pow(P.d - P.a, k), Math.pow(P.d, k)) : null; }
// P(X = a), P(X ≥ a) or P(X ≤ a): {v, f (exact fraction for chips)}
function probOf(P, kind, a){
  if (kind === "eq") return { v:pmfV(P, a), f:P.chip ? F.of(Math.pow(P.d - P.a, a) * P.a, Math.pow(P.d, a + 1)) : null };
  if (kind === "ge") return { v:tailV(P, a), f:qPow(P, a) };
  return { v:1 - tailV(P, a + 1), f:P.chip ? F.comp(qPow(P, a + 1)) : null };
}
// "= 27/64 ≈ 0.4219", "= 1/4 = 0.25", "≈ 0.2746" (fractions only while the denominator stays readable)
function valTxt(r){
  if (r.f && r.f.d === 1) return "= " + r.f.n;
  if (r.f && r.f.d <= 99999) return "= " + M(F.txt(r.f)) + " " + apx(r.v);
  return apx(r.v);
}
function qp(k){ return k === 0 ? "1" : k === 1 ? "q" : "q^{" + k + "}"; }
var OP = { eq:"=", ge:"≥", le:"≤" };
function formOf(kind, a){ return kind === "eq" ? (a === 0 ? "p" : qp(a) + "p") : kind === "ge" ? qp(a) : "1 - " + qp(a + 1); }
function evOf(kind, a, conv){ return conv === "trial" ? "P(Y " + OP[kind] + " " + (a + 1) + ")" : "P(X " + OP[kind] + " " + a + ")"; }
function eFail(P){ return { v:(1 - P.v) / P.v, f:P.chip ? F.of(P.d - P.a, P.a) : null }; }
function eTrial(P){ return { v:1 / P.v, f:P.chip ? F.of(P.d, P.a) : null }; }
function eShort(r){ return r.f ? F.txt(r.f) : (exact4(r.v) ? d4(r.v) : d2(r.v)); }
function pmfTxt(P, conv){ return conv === "trial" ? "P(Y = y) = (" + P.qtxt + ")^{y - 1}(" + P.txt + ")" : "P(X = x) = (" + P.qtxt + ")^x(" + P.txt + ")"; }
function runX(g, v){ var x = 0; while (g() >= v && x < 4000) x++; return x; }
// a histogram of X values as relative frequencies over slots 0 … NB − 1 plus the combined slot NB (X ≥ NB)
function histOf(xs, shift){
  var cnt = [], i, n = 0; shift = shift || 0;
  for (i = 0; i <= NB; i++) cnt.push(0);
  xs.forEach(function(x){ if (x < shift) return; var y = x - shift; cnt[Math.min(NB, y)]++; n++; });
  return { n:n, bars:n ? cnt.map(function(c, x){ return { x:x, p:c / n }; }) : [], cnt:cnt };
}
// one-run devices: a coin for p = 1/2, a die for 1/6, 1/3 and 2/3, a spinner for anything else
function devOf(P){
  if (Math.abs(P.v - 0.5) < 1e-9) return "coin";
  if (P.chip && (P.d === 6 || P.d === 3)) return "die";
  return "spin";
}
function genRun(P, seed){
  var g = MV.mdm.seededRandom(seed), dev = devOf(P), m = Math.round(P.v * 6), out = [];
  for (var i = 0; i < 400; i++) {
    var t;
    if (dev === "coin") { var hd = g() < 0.5; t = { f:hd ? "H" : "T", s:hd }; }
    else if (dev === "die") { var fc = 1 + g.int(6); t = { f:String(fc), s:fc > 6 - m }; }
    else { var ang = g() * 360; t = { f:ang, s:ang < 360 * P.v }; }
    out.push(t); if (t.s) break;
  }
  return out;
}
function succWord(P){ var dev = devOf(P); if (dev === "coin") return "head"; if (dev === "die") { var m = Math.round(P.v * 6); return m === 1 ? "6" : m === 2 ? "5 or 6" : "3, 4, 5 or 6"; } return "success"; }

// @component D6 deviceFaces — die (pips), coin (H/T, flips with scaleY) and spinner (success sector of angle 360p, needle) as
// inline SVG for one-trial animations; colours from tokens through classes (.gm-dface, .gm-dsucc, .gm-ssec …).
var PIPS = { 1:[[50, 50]], 2:[[30, 30], [70, 70]], 3:[[28, 28], [50, 50], [72, 72]], 4:[[30, 30], [70, 30], [30, 70], [70, 70]], 5:[[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6:[[30, 26], [70, 26], [30, 50], [70, 50], [30, 74], [70, 74]] };
function dieSVG(face, succ, rot){
  var h = '<rect x="8" y="8" width="84" height="84" rx="16" class="gm-dface' + (succ ? " gm-dsucc" : "") + '"/>';
  if (face) PIPS[face].forEach(function(q){ h += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="7.5" class="gm-pip"/>'; });
  return '<svg class="gm-die" viewBox="0 0 100 100" aria-hidden="true" focusable="false"' + (rot ? ' style="transform:rotate(' + rot.toFixed(1) + 'deg)"' : "") + ">" + h + "</svg>";
}
function coinSVG(face, sy, succ){
  return '<svg class="gm-coin" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g style="transform:scaleY(' + Math.max(0.04, sy).toFixed(3) + ');transform-origin:50px 50px"><circle cx="50" cy="50" r="42" class="gm-cface' + (succ ? " gm-dsucc" : "") + '"/>' +
    '<circle cx="50" cy="50" r="34" class="gm-crim"/><text x="50" y="52" class="gm-ctxt">' + (face || "") + "</text></g></svg>";
}
function spinSVG(v, ang, succ){
  var a1 = v * 360, big2 = a1 > 180 ? 1 : 0, pt = function(deg, r){ var t = (deg - 90) * Math.PI / 180; return [50 + r * Math.cos(t), 50 + r * Math.sin(t)]; }, e = pt(a1, 42), ls = pt(a1 / 2, 26), lf = pt(a1 + (360 - a1) / 2, 26);
  var sec = v >= 0.999 ? '<circle cx="50" cy="50" r="42" class="gm-ssec"/>' : '<path class="gm-ssec" d="M50 50L50 8A42 42 0 ' + big2 + " 1 " + e[0].toFixed(2) + " " + e[1].toFixed(2) + 'Z"/>';
  return '<svg class="gm-spin' + (succ ? " gm-spin-s" : "") + '" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="42" class="gm-sbg"/>' + sec +
    '<text x="' + ls[0].toFixed(1) + '" y="' + ls[1].toFixed(1) + '" class="gm-slab">S</text><text x="' + lf[0].toFixed(1) + '" y="' + lf[1].toFixed(1) + '" class="gm-slab">F</text>' +
    '<circle cx="50" cy="50" r="42" class="gm-srim"/><g style="transform:rotate(' + (ang || 0).toFixed(1) + 'deg);transform-origin:50px 50px"><line x1="50" y1="50" x2="50" y2="14" class="gm-needle"/><path d="M50 9L45.5 19H54.5Z" class="gm-ntip"/></g><circle cx="50" cy="50" r="4.5" class="gm-hub"/></svg>';
}

// ---------- Explore: the waiting room ----------
var DEF = { pc:"1/4", pk:5, view:"theory", kind:"ge", a:3, conv:"fail", simN:0, memK:5 };
var VIEWS = [{ id:"one", t:"One run" }, { id:"many", t:"Many runs" }, { id:"theory", t:"Theory" }, { id:"memory", t:"Memory test" }];
function explore(host, api){
  var S = api.S;
  function pKey(){ return S.pc ? "c" + S.pc : "k" + S.pk; }
  function sanitize(){
    if (S.view == null) Object.keys(DEF).forEach(function(k){ S[k] = DEF[k]; });
    if (CHIPS.indexOf(S.pc) < 0) S.pc = null;
    S.pk = clampI(S.pk, 1, 19, 5);
    if (!VIEWS.some(function(v){ return v.id === S.view; })) S.view = "theory";
    if (!OP[S.kind]) S.kind = "ge";
    S.a = clampI(S.a, 0, NB - 1, 3);
    if (S.conv !== "trial") S.conv = "fail";
    S.simN = [0, 10, 100, 1000, 10000].indexOf(+S.simN) >= 0 ? +S.simN : 0;
    S.memK = clampI(S.memK, 0, 10, 5);
    S.one = obj(S.one);
    if (S.one.key !== pKey()) S.one = { key:pKey(), idx:0, shown:0, done:[] };
    S.one.idx = clampI(S.one.idx, 0, 1e6, 0); S.one.shown = clampI(S.one.shown, 0, 400, 0);
    S.one.done = (Array.isArray(S.one.done) ? S.one.done : []).map(Number).filter(function(v){ return isFinite(v) && v >= 0; }).slice(-1000);
  }
  sanitize();
  var pv = {}, anim = null, msg = "", sims = {}, mems = {}, runC = null, oneAnim = null, plot, geoC = null, barFk = S.a;

  host.innerHTML =
    '<div class="gm-top"><div id="gm-view"></div></div>' +
    '<div class="pg gm-pg"><div class="pg-graph" data-mv="graph">' +
      '<div class="gm-pbox"><div id="gm-chips"></div><label class="slider gm-sl"><span class="slider-top"><span>Probability of success ' + M("p") + '</span><output id="gm-p-out"></output></span><input type="range" id="gm-p" min="1" max="19" step="1"></label></div>' +
      '<div class="eq-cap gm-cap" id="gm-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="gm-one" class="gm-one" hidden></div><div id="gm-path" class="gm-path" hidden></div>' +
      '<div class="plot-wrap gm-pw" id="gm-pw"><canvas class="plot gm-plot" id="gm-plot" role="img" aria-label="Geometric probability histogram"></canvas><div class="gm-bars" id="gm-bars" role="group" aria-label="Bars of the histogram: arrow keys choose the value a"></div></div>' +
      '<p class="tiny muted gm-key" id="gm-key"></p>' +
      '<div id="gm-many" class="gm-many" hidden><div id="gm-runs"></div><p class="tiny muted" id="gm-mtxt" aria-live="polite"></p></div>' +
      '<div id="gm-mem" class="gm-mem" hidden><label class="slider gm-sl"><span class="slider-top"><span>Already failed ' + M("k") + ' times</span><output id="gm-k-out"></output></span><input type="range" id="gm-k" min="0" max="10" step="1"></label><p class="tiny muted" id="gm-memtxt" aria-live="polite"></p></div>' +
      '<p class="gm-aha" id="gm-aha"></p></div>' +
    '<div class="pg-ctrl"><div class="gm-panel"><p class="gm-sh">Select an event</p><div id="gm-kind"></div>' +
      '<div class="gm-stp" role="group" aria-label="Value"><span class="rg-lab">Value</span><button type="button" class="btn ghost sm gm-stb" data-av="-1" data-k="gmam" aria-label="Value down">−</button><output class="gm-sto" id="gm-a-out"></output><button type="button" class="btn ghost sm gm-stb" data-av="1" data-k="gmap" aria-label="Value up">+</button></div>' +
      '<p class="tiny muted gm-how">Tap a bar to choose the value (or Tab to the bars and use the arrow keys).</p></div>' +
      '<div class="gm-panel"><p class="gm-sh">Convention</p><div id="gm-conv"></div></div><p class="tiny gm-msg" id="gm-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="gm-read" aria-live="polite"></dl></div></div>';

  plot = new MV.Plot($("#gm-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintChart;
  var viewR = radios($("#gm-view", host), { label:"View", options:VIEWS, value:S.view, cls:"seg",
    onChange:function(v){ user(); S.view = v; save(); render(); MV.changed(); } });
  var chipR = radios($("#gm-chips", host), { label:"Exact " + M("p") + ":", aria:"Exact probability chips", options:CHIPS.map(function(c){ return { id:c, t:M(c), aria:"p = " + c }; }), value:S.pc || "", cls:"chips",
    onChange:function(v){ user(); S.pc = v; S.pk = clampI(Math.round(pOf(v).v * 20), 1, 19, 5); changedP(); } });
  var kindR = radios($("#gm-kind", host), { label:"", aria:"Event", options:kindOpts(), value:S.kind, cls:"seg",
    onChange:function(v){ user(); S.kind = v; msg = ""; save(); render(); MV.changed(); } });
  var convR = radios($("#gm-conv", host), { label:"", aria:"Convention", options:[{ id:"fail", t:"Count failures (" + M("X") + ")" }, { id:"trial", t:"Count trials (" + M("X + 1") + ")" }], value:S.conv, cls:"seg",
    onChange:function(v){ user(); S.conv = v; save(); render(); MV.changed(); } });
  var runsR = radios($("#gm-runs", host), { label:"Runs", options:[10, 100, 1000, 10000].map(function(n){ return { id:n, t:big(n) }; }), value:S.simN || "", cls:"chips",
    onChange:function(v){ user(); runMany(+v); } });
  function kindOpts(){ return ["eq", "ge", "le"].map(function(k){ return { id:k, t:M(S.conv === "trial" ? "Y " + OP[k] + " " + (S.a + 1) : "X " + OP[k] + " " + S.a) }; }); }

  function save(){ api.save(); }
  function P(){ return pOf(S.pc, S.pk, pv.pf); }
  function user(){ cancelAnim(); stopOne(); pv = {}; MV.banner("", ""); }
  function changedP(){
    stopMany(); sanitize(); msg = ""; save(); render(); MV.changed();
  }

  // --- animation bookkeeping (from MDM4U 21): any user action cancels the running animation and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; lockUI(); return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {};
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } render(); MV.changed(); }
  function lockUI(){ var b = !!anim || !!oneAnim || !!(runC && runC.busy()); runsR.lock(b); var nx = $("#gm-next", host), fin = $("#gm-fin", host); if (nx) nx.disabled = b || runDone(); if (fin) fin.disabled = b || runDone(); }

  // --- Many runs: N seeded runs of the current p (the first 10 runs of 1000 are the same as the 10-run) ---
  function simFor(){
    var k = pKey(); if (pv.pf != null) return null;
    if (!sims[k]) { var v = P().v; sims[k] = makeSim({ seed:"mdm22-many|" + k, trial:function(g){ return runX(g, v); } }); }
    return sims[k];
  }
  function simReady(){ var s = simFor(); if (s && !s.busy() && s.seq.length !== S.simN) s.fill(S.simN); return s; }
  function stopMany(){ if (runC) { runC.stop(); runC = null; } }
  function runMany(n){
    var s = simFor(); if (!s) return; S.simN = n; save(); runC = s; lockUI();
    s.to(n, { frames:MV.reduceMotion ? 1 : 54, step:function(){ paintChart(); paintRead(); paintManyTxt(); }, done:function(){ runC = null; lockUI(); render(); MV.changed(); } });
  }
  // --- Memory test: 20 000 seeded runs; keep those that started with k failures; their remaining wait ---
  function memFor(){
    var k = pKey(); if (mems[k]) return mems[k];
    var g = MV.mdm.seededRandom("mdm22-mem|" + k), v = P().v, xs = [];
    for (var i = 0; i < MEMN; i++) xs.push(runX(g, v));
    return (mems[k] = xs);
  }
  function memStats(k){ var xs = memFor(), h = histOf(xs, k), next = h.cnt[0]; return { kept:h.n, next:next, bars:h.bars }; }

  // --- One run: each run is seeded by p and its number, then revealed one trial at a time ---
  function curRun(){ return genRun(P(), "mdm22-one|" + pKey() + "|" + S.one.idx); }
  function runDone(){ var r = curRun(); return S.one.shown > 0 && r[S.one.shown - 1] && r[S.one.shown - 1].s; }
  var devState = null;   // what the device shows: {f, s, rot, sy, ang}
  function stopOne(){ if (oneAnim) { var a = oneAnim; oneAnim = null; a(); } }
  function reveal(){
    var r = curRun(), t = r[S.one.shown], dev = devOf(P());
    S.one.shown++; devState = { f:t.f, s:t.s, ang:dev === "spin" ? t.f : 0 };
    if (t.s) { S.one.done.push(S.one.shown - 1); if (S.one.done.length > 1000) S.one.done.shift(); }
    return t;
  }
  // Next trial animates the device; Finish the run reveals the rest of the run one trial at a time (instantly with reduced motion)
  function nextTrial(fast){
    if (oneAnim || runDone()) return;
    if (fast) {
      if (MV.reduceMotion) { while (!runDone()) reveal(); save(); render(); MV.changed(); return; }
      var tm = MV.wait(130, function(){ oneAnim = null; reveal(); save(); render(); MV.changed(); if (!runDone()) nextTrial(true); });
      oneAnim = function(){ clearTimeout(tm); oneAnim = null; reveal(); save(); render(); MV.changed(); };
      lockUI(); return;
    }
    var r = curRun(), t = r[S.one.shown], dev = devOf(P()), fin = function(){ oneAnim = null; reveal(); save(); render(); MV.changed(); };
    if (MV.reduceMotion) { fin(); return; }
    var from = devState && dev === "spin" ? devState.ang || 0 : 0, to = dev === "spin" ? t.f + 720 : 0, faces = [3, 5, 2, 6, 1, 4], k0 = S.one.shown;
    var stop = MV.tween({ dur:dev === "spin" ? 900 : 620, step:function(u){
      if (dev === "die") devState = { f:u < 0.92 ? String(faces[Math.floor(u * 11 + k0) % 6]) : t.f, s:false, rot:(1 - u) * 300 };
      else if (dev === "coin") devState = { f:u < 0.5 ? (Math.floor(u * 6) % 2 ? "H" : "T") : t.f, s:false, sy:Math.abs(Math.cos(u * Math.PI * 3)) };
      else devState = { f:null, s:false, ang:from + (to - from) * u };
      paintDev();
    }, done:function(){ if (oneAnim) fin(); } });
    oneAnim = function(){ stop(); fin(); };
    lockUI();
  }

  // --- painting ---
  function render(){
    sanitize();
    viewR.set(S.view); chipR.set(S.pc || ""); convR.set(S.conv); kindR.setOptions(kindOpts()); kindR.set(S.kind); runsR.set(S.simN || "");
    var Pp = P(), pIn = $("#gm-p", host);
    pIn.value = pv.pf != null ? Math.round(pv.pf * 20) : S.pk; $("#gm-p-out", host).innerHTML = M(Pp.txt); pIn.setAttribute("aria-valuetext", "p = " + Pp.txt);
    $("#gm-a-out", host).textContent = String(S.conv === "trial" ? S.a + 1 : S.a);
    host.querySelector('[data-av="-1"]').disabled = S.a <= 0; host.querySelector('[data-av="1"]').disabled = S.a >= NB - 1;
    $("#gm-one", host).hidden = S.view !== "one"; $("#gm-many", host).hidden = S.view !== "many"; $("#gm-mem", host).hidden = S.view !== "memory";
    var kIn = $("#gm-k", host), kk = pv.memK != null ? pv.memK : S.memK; kIn.value = kk; $("#gm-k-out", host).textContent = String(kk); kIn.setAttribute("aria-valuetext", "already failed " + kk + " times");
    paintOne(); paintPath(); paintChart(); paintRead(); paintCap(); paintKey(); paintManyTxt(); paintMemTxt(); paintAha();
    $("#gm-msg", host).innerHTML = msg;
    lockUI();
  }
  function chartData(){
    var Pp = P(), bars = [], x, sim = null, label = "";
    for (x = 0; x < NB; x++) bars.push({ x:x, p:pmfV(Pp, x) });
    bars.push({ x:NB, p:tailV(Pp, NB) });
    if (S.view === "many") { var s = simReady(); if (s && s.seq.length) { var h = histOf(s.seq); sim = h.bars; label = big(s.seq.length) + " runs"; } }
    else if (S.view === "one" && S.one.done.length) { var h1 = histOf(S.one.done); sim = h1.bars; label = "your " + S.one.done.length + " run" + (S.one.done.length === 1 ? "" : "s"); }
    else if (S.view === "memory" && pv.pf == null) { var ms = memStats(pv.memK != null ? pv.memK : S.memK); if (ms.kept) { sim = ms.bars; label = "remaining wait in " + big(ms.kept) + " runs"; } }
    return { P:Pp, bars:bars, sim:sim, label:label };
  }
  function xFmt(x){ var sh = S.conv === "trial" ? 1 : 0; return x >= NB ? "≥" + (NB + sh) : String(x + sh); }
  function paintChart(){
    var d = chartData(), mx = 0, hide = !!pv.hide;
    d.bars.forEach(function(b){ mx = Math.max(mx, b.p); }); if (d.sim) d.sim.forEach(function(b){ mx = Math.max(mx, b.p); });
    var sc = scaleOf(pv.ymax || mx), E = eFail(d.P), lo = S.kind === "le" ? 0 : S.a, hi = S.kind === "ge" ? NB : S.a;
    var showE = !hide && !pv.hideE, eLab = S.conv === "trial" ? "E(Y) = " + MV.plain(M(eShort(eTrial(d.P)))) : "E(X) = " + MV.plain(M(eShort(E)));
    geoC = gChart(plot, { x1:NB, tail:true, ymax:sc.ymax, yStep:sc.step, bars:hide ? [] : d.bars, sim:pv.simHide ? null : d.sim, simGrow:pv.simGrow, grow:pv.grow,
      range:pv.noSel ? null : { lo:lo, hi:hi }, mean:showE ? { x:E.v, label:eLab } : null, marks:pv.marks, hi:pv.hiBars, xFmt:xFmt,
      xLabel:S.conv === "trial" ? "y" : "x", yLabel:S.conv === "trial" ? "P(Y = y)" : "P(X = x)", describe:describe(d) });
    paintBarBtns();
  }
  function describe(d){
    var t = "Geometric distribution with p = " + d.P.txt + (S.conv === "trial" ? ", counting trials Y = X + 1" : ", X = failures before the first success") + ".";
    if (pv.hide) return t + " The bars are hidden until the reveal.";
    t += " The bars fall from left to right, each " + d.P.qtxt + " of the one before; the last bar combines X ≥ 16.";
    if (!pv.hideE) t += " E(X) = " + MV.plain(M(eShort(eFail(d.P)))) + ".";
    if (!pv.noSel) t += " Selected: " + MV.plain(M(evOf(S.kind, S.a, S.conv))) + " " + MV.plain(valTxt(probOf(d.P, S.kind, S.a))) + ".";
    if (d.sim && !pv.simHide) t += " Outlined bars: " + d.label + ".";
    return t;
  }
  // keyboard and pointer path to the bars: one transparent button per bar 0–15 over the canvas
  function paintBarBtns(){
    var box = $("#gm-bars", host); if (!geoC) { box.innerHTML = ""; return; }
    var had = box.contains(document.activeElement) ? +document.activeElement.dataset.bar : null, h = "", d = P();
    var top = plot.c.offsetTop + geoC.yt, ht = geoC.y0 - geoC.yt + 22, left = plot.c.offsetLeft, lo = S.kind === "le" ? 0 : S.a, hi = S.kind === "ge" ? NB : S.a;
    for (var x = 0; x < NB; x++) {
      var l = left + plot.X(x - 0.5), w = plot.X(x + 0.5) - plot.X(x - 0.5);
      h += '<button type="button" class="gm-bar" data-bar="' + x + '" tabindex="' + (x === barFk ? 0 : -1) + '" style="left:' + l.toFixed(1) + "px;top:" + top.toFixed(1) + "px;width:" + w.toFixed(1) + "px;height:" + ht.toFixed(1) + 'px" aria-pressed="' + (x >= lo && x <= hi) + '" aria-label="' + MV.esc((S.conv === "trial" ? "Y = " + (x + 1) : "X = " + x) + (pv.hide ? "" : ", probability " + apx(pmfV(d, x)))) + '"></button>';
    }
    box.innerHTML = h;
    if (had != null) { var b = box.querySelector('[data-bar="' + had + '"]'); if (b) b.focus({ preventScroll:true }); }
  }
  $("#gm-bars", host).addEventListener("click", function(e){ var b = e.target.closest("[data-bar]"); if (!b || pv.hide || anim) return; barFk = +b.dataset.bar; setA(+b.dataset.bar); });
  $("#gm-bars", host).addEventListener("keydown", function(e){
    var b = e.target.closest("[data-bar]"); if (!b) return;
    var x = +b.dataset.bar, nx = e.key === "ArrowRight" || e.key === "ArrowUp" ? x + 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? x - 1 : e.key === "Home" ? 0 : e.key === "End" ? NB - 1 : null;
    if (nx == null) return; e.preventDefault(); nx = Math.max(0, Math.min(NB - 1, nx)); barFk = nx;
    if (!pv.hide && !anim) setA(nx);
    var nb = host.querySelector('[data-bar="' + nx + '"]'); if (nb) nb.focus();
  });
  function setA(a){ if (anim) cancelAnim(); a = clampI(a, 0, NB - 1, 0); if (a === S.a) return; S.a = a; barFk = a; msg = ""; save(); kindR.setOptions(kindOpts()); $("#gm-a-out", host).textContent = String(S.conv === "trial" ? a + 1 : a); host.querySelector('[data-av="-1"]').disabled = a <= 0; host.querySelector('[data-av="1"]').disabled = a >= NB - 1; paintChart(); paintRead(); MV.changed(); }

  function paintRead(){
    var d = P(), rows = [], Q = '<span class="gm-q">?</span>', tr = S.conv === "trial";
    rows.push(["Parameters", M("p = " + d.txt) + ", " + M("q = " + d.qtxt)]);
    var ev = evOf(S.kind, S.a, S.conv), fm = formOf(S.kind, S.a), r = probOf(d, S.kind, S.a);
    rows.push(["Selected probability", pv.hideSel ? M(ev) + " = " + Q : fm === "1" ? M(ev + " = 1") : M(ev + " = " + fm) + " " + valTxt(r)]);
    var Ef = eFail(d), Et = eTrial(d), hE = !!pv.hideE;
    var rF = ["Expected failures", hE ? Q : M((tr ? "" : "E(X) = ") + "q ÷ p") + " " + valTxt(Ef)], rT = ["Expected trial of first success", hE ? Q : M((tr ? "E(Y) = " : "") + "1 ÷ p") + " " + valTxt(Et)];
    if (tr) { rows.push(rT); rows.push(rF); } else { rows.push(rF); rows.push(rT); }
    rows.push(["Most likely value", pv.hide || pv.hideMode ? Q : tr ? "1 (success on the first trial)" : "0"]);
    if (S.view === "many") { var s = simReady(); rows.push(["Simulation", s && s.seq.length ? big(s.seq.length) + " runs: mean " + d2(s.sum / s.seq.length + (tr ? 1 : 0)) + (tr ? " trials" : " failures") : '<span class="muted">Choose a number of runs.</span>']); }
    if (S.view === "memory") {
      var kk = pv.memK != null ? pv.memK : S.memK;
      rows.push(["Memory test", pv.memHide ? Q : "After " + kk + " failure" + (kk === 1 ? "" : "s") + ": the remaining wait has the same distribution"]);
    }
    var rd = $("#gm-read", host); MV.keepFocus(rd, function(){ rd.innerHTML = MV.readoutHTML(rows); });
  }
  function paintCap(){
    var c = $("#gm-cap", host), d = P();
    c.innerHTML = pv.cap != null ? MV.md(pv.cap) : M(pmfTxt(d, S.conv));
  }
  function paintKey(){
    var d = chartData(), t = "Solid bars: theory, " + M(S.conv === "trial" ? "q^{y - 1}p" : "q^x p") + ". The last bar combines " + M(S.conv === "trial" ? "Y ≥ 17" : "X ≥ 16") + ".";
    if (d.sim && !pv.simHide) t += " Outlined bars: " + d.label + ".";
    $("#gm-key", host).innerHTML = t;
  }
  function paintManyTxt(){
    if (S.view !== "many") return;
    var s = simReady(), el = $("#gm-mtxt", host);
    el.innerHTML = runC && runC.busy() ? big(runC.seq.length) + " runs…" : (s && s.seq.length ? big(s.seq.length) + " runs, each repeated until the first success. " : "Choose how many runs. ") + "The runs are seeded: the same " + M("p") + " gives the same runs on any device.";
  }
  function paintMemTxt(){
    if (S.view !== "memory") return;
    var kk = pv.memK != null ? pv.memK : S.memK, el = $("#gm-memtxt", host);
    if (pv.pf != null) { el.innerHTML = ""; return; }
    var ms = memStats(kk), d = P();
    el.innerHTML = big(MEMN) + " seeded runs. " + (ms.kept ? big(ms.kept) + " of them started with " + kk + " failure" + (kk === 1 ? "" : "s") + "; the outlined bars show how much longer those runs waited." + (pv.memHide ? "" : " Their next trial was a success " + dec(100 * ms.next / ms.kept, 1) + "% of the time (" + M("p = " + d.txt) + ").") :
      "None of them started with " + kk + " failures: with " + M("p = " + d.txt) + " that’s too rare. Lower " + M("k") + " or " + M("p") + ".");
  }
  function paintAha(){
    var a = $("#gm-aha", host), d = P(), t = "";
    if (!pv.hide && !pv.hideE && pv.cap == null) {
      if (S.view === "memory") t = "Failing so far changes nothing: after " + M("k") + " failures, the remaining wait falls along the same staircase.";
      else t = "The staircase falls by a factor of " + M("q = " + d.qtxt) + " at every step, so " + (S.conv === "trial" ? "the first trial is always the most likely place for the first success" : "0 failures is always the most likely value") + ", even though the average wait is " + (S.conv === "trial" ? M("1 ÷ p") + " " + valTxt(eTrial(d)) + " trials." : M("q ÷ p") + " " + valTxt(eFail(d)) + " failures.");
    }
    a.innerHTML = t; a.hidden = !t;
  }
  function paintOne(){
    var box = $("#gm-one", host); if (S.view !== "one") return;
    if (!box.firstChild) box.innerHTML = '<div class="gm-dev"><div class="gm-devbox" id="gm-devbox" aria-hidden="true"></div><div class="gm-devtxt"><p class="gm-devname" id="gm-devname"></p><p class="gm-cnt" id="gm-cnt" aria-live="polite"></p>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="gm-next" data-k="gmnext">Next trial</button><button type="button" class="btn ghost sm" id="gm-fin" data-k="gmfin">Finish the run</button><button type="button" class="btn ghost sm" id="gm-new" data-k="gmnew">New run</button></div></div></div>' +
      '<ol class="gm-trials" id="gm-trials" aria-label="Trials in this run"></ol><p class="tiny muted gm-runs" id="gm-runtxt"></p>';
    var d = P(), dev = devOf(d), r = curRun(), n = S.one.shown, done = runDone(), sw = succWord(d), tr = S.conv === "trial";
    $("#gm-devname", host).innerHTML = (dev === "coin" ? "Coin: success = a head" : dev === "die" ? "Die: success = " + (sw === "6" ? "a 6" : "a " + sw) : "Spinner: success = the shaded sector " + M("S")) + " (" + M("p = " + d.txt) + ")";
    var fails = done ? n - 1 : n;
    $("#gm-cnt", host).innerHTML = done ? (tr ? "First success on trial " + n + ": " + M("Y = " + n) + " (" + M("X = " + (n - 1)) + ")" : M("X = " + fails) + " failure" + (fails === 1 ? "" : "s") + " before the first " + (sw === "success" ? "success" : sw === "head" ? "head" : sw === "6" ? "6" : "success")) :
      M("X = " + fails) + " failure" + (fails === 1 ? "" : "s") + " so far" + (n ? "" : ". Press Next trial.");
    var tl = $("#gm-trials", host);
    tl.innerHTML = r.slice(0, n).map(function(t, i){ var sp = dev === "spin", lab = sp ? (t.s ? "S" : "F") : t.f; return '<li class="gm-tr' + (t.s ? " s" : "") + '" aria-label="Trial ' + (i + 1) + ": " + (sp ? "" : lab + ", ") + (t.s ? "success" : "failure") + '"><span class="gm-trf">' + lab + "</span>" + (sp ? "" : '<span class="gm-trs" aria-hidden="true">' + (t.s ? "S" : "F") + "</span>") + "</li>"; }).join("");
    tl.hidden = !n;
    var dn = S.one.done;
    $("#gm-runtxt", host).innerHTML = (dn.length ? "Runs finished: " + dn.length + (dn.length <= 12 ? " (" + M("X") + " = " + dn.join(", ") + ")" : ", mean " + d2(dn.reduce(function(a, b){ return a + b; }, 0) / dn.length) + " failures") + ". " : "") + "Each run is seeded, so it repeats exactly.";
    $("#gm-new", host).disabled = !done || !!oneAnim;
    if (!oneAnim) { var last = n ? r[n - 1] : null; devState = last ? { f:last.f, s:last.s, ang:dev === "spin" ? last.f : 0 } : null; }
    paintDev(); lockUI();
  }
  function paintDev(){
    var b = $("#gm-devbox", host); if (!b) return;
    var d = P(), dev = devOf(d), st = devState || {};
    b.innerHTML = dev === "die" ? dieSVG(st.f ? +st.f : 0, st.s, st.rot) : dev === "coin" ? coinSVG(st.f || "", st.sy == null ? 1 : st.sy, st.s) : spinSVG(d.v, st.ang || 0, st.s);
  }
  function paintPath(){
    var box = $("#gm-path", host); box.hidden = !pv.path;
    if (!pv.path) { box.innerHTML = ""; return; }
    var seq = ["T", "T", "T", "H"];
    box.innerHTML = '<ol class="gm-trials gm-ptr" aria-label="The path T, T, T, H">' + seq.slice(0, pv.path.n).map(function(f, i){ return '<li class="gm-tr' + (i === 3 ? " s" : "") + '"><span class="gm-trf">' + f + '</span><span class="gm-trs">' + (i === 3 ? "S" : "F") + "</span></li>"; }).join("") + "</ol>" +
      (pv.path.f ? '<p class="gm-pf">' + M("(1/2)(1/2)(1/2) · (1/2) = (1/2)^3(1/2) = 1/16") + "</p>" : "");
  }

  // --- events ---
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "gm-p") { user(); S.pc = null; S.pk = clampI(t.value, 1, 19, 5); changedP(); return; }
    if (t.id === "gm-k") { user(); S.memK = clampI(t.value, 0, 10, 5); save(); render(); MV.changed(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg") || b.dataset.bar != null) return;
    if (b.dataset.av) { user(); setA(S.a + (+b.dataset.av)); render(); return; }
    if (b.id === "gm-next") { if (anim) cancelAnim(); pv = {}; nextTrial(false); return; }
    if (b.id === "gm-fin") { if (anim) cancelAnim(); pv = {}; nextTrial(true); return; }
    if (b.id === "gm-new") { user(); S.one.idx++; S.one.shown = 0; devState = null; save(); render(); var nb = $("#gm-next", host); if (nb) nb.focus(); }
  });

  render();

  // --- predictions ---
  function setState(o){ Object.keys(o).forEach(function(k){ S[k] = o[k]; }); sanitize(); }
  function startPred(p){
    user(); stopMany();
    if (p.id === "p1") { setState({ view:"theory", pc:"1/6", pk:3, conv:"fail", kind:"eq", a:0 }); pv = { hide:true, hideE:true, noSel:true, hideSel:true, hideMode:true }; }
    else if (p.id === "p2") { setState({ view:"theory", pc:"1/2", pk:10, conv:"fail", kind:"eq", a:3 }); pv = { hideSel:true }; }
    else if (p.id === "p3") { setState({ view:"memory", pc:"1/6", pk:3, conv:"fail", kind:"eq", a:0, memK:10 }); pv = { simHide:true, memHide:true, hideSel:true }; }
    else { setState({ view:"theory", pc:"1/4", pk:5, conv:"fail", kind:"ge", a:3 }); pv = { hideE:true }; }
    barFk = S.a; msg = ""; save(); render();
  }
  function runPred(p, done){
    newAnim(done);
    if (p.id === "p1") {
      pv = { grow:0, hideE:true, noSel:true, hideSel:true, hideMode:true, cap:"Each bar is `5/6` of the one before" };
      render();
      anim.stops.push(MV.tween({ dur:2400, ease:function(t){ return t; }, step:function(t){ pv.grow = t * (NB + 1); paintChart(); }, done:function(){
        pv.grow = null; pv.marks = { 0:"1/6" }; pv.hiBars = [0]; pv.hideMode = false; render();
        later(900, function(){ pv.hideE = false; pv.noSel = false; pv.hideSel = false; pv.cap = "Tallest bar: `X = 0`, at `1/6`. `E(X) = 5`"; render(); later(1100, function(){ var c = pv.cap; pv = { cap:c, marks:{ 0:"1/6" } }; endAnim(); }); });
      } }));
      return;
    }
    if (p.id === "p2") {
      pv = { hideSel:true, path:{ n:0 }, hiBars:[3], cap:"One path: T, T, T, H" };
      render();
      var i = 0;
      (function step(){ later(i ? 520 : 200, function(){ i++; pv.path.n = i; paintPath(); if (i < 4) step(); else later(600, function(){ pv.path.f = true; pv.hideSel = false; pv.cap = "`P(X = 3) = (1/2)^3(1/2) = 1/16`"; render(); later(1300, function(){ var c = pv.cap; pv = { cap:c, path:{ n:4, f:true }, hiBars:[3] }; endAnim(); }); }); }); })();
      return;
    }
    if (p.id === "p3") {
      pv = { simHide:false, simGrow:0, memHide:true, hideSel:true, cap:"Runs that started with 10 misses…" };
      render();
      later(250, function(){
        anim.stops.push(MV.tween({ dur:1400, step:function(t){ pv.simGrow = t; paintChart(); }, done:function(){
          pv.simGrow = null; pv.memHide = false; pv.hideSel = false; pv.hiBars = [0]; pv.cap = "Same staircase: " + "`P`(6 next) ≈ `1/6`"; render();
          later(1300, function(){ var c = pv.cap; pv = { cap:c }; endAnim(); });
        } }));
      });
      return;
    }
    pv = { hideE:false, cap:"`E(X) = 3`…" };
    render();
    later(900, function(){
      pv.cap = "`p`: `1/4` → `1/2`";
      anim.stops.push(MV.tween({ dur:1800, step:function(t){ pv.pf = 0.25 + 0.25 * t; render(); }, done:function(){
        pv.pf = null; S.pc = "1/2"; S.pk = 10; sanitize(); save(); pv.cap = "`E(X)`: 3 → 1"; render(); MV.changed();
        later(1200, function(){ var c = pv.cap; pv = { cap:c }; endAnim(); });
      } }));
    });
  }

  // --- challenges ---
  function pIs(v){ return pv.pf == null && Math.abs(P().v - v) < 1e-9; }
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (anim) return R("Wait for the animation to finish.");
    var d = P();
    if (id === "tc1") {
      if (pIs(0.2)) return { ok:true };
      if (pIs(0.25)) return R("`1 ÷ p = 4` is the average trial <strong>number</strong>. Failures average `q ÷ p = 3`.");
      if (pIs(1 / 6)) return R("`E = 5`.");
      return R("Right now `E(X) = q ÷ p` " + valTxt(eFail(d)) + ", not 4.");
    }
    if (id === "tc2") {
      if (S.pc !== "1/3") return R("Set `p = 1/3` first: use the chip.");
      if (S.kind === "ge" && S.a === 3) return { ok:true };
      if (S.kind === "ge" && S.a === 4) return R("That’s 4 or more.");
      if (S.kind === "eq" && S.a === 3) return R("That’s exactly 3.");
      if (S.kind === "le" && S.a === 3) return R("That’s at most 3.");
      return R("The readout shows " + MV.md("`" + evOf(S.kind, S.a, "fail") + "`") + ". ‘At least 3 failures’ is `X ≥ 3`.");
    }
    if (id === "tc3") {
      if (![1 / 6, 0.2, 0.25, 1 / 3, 0.4, 0.5].some(pIs)) return R("Choose `p` from the chips `1/6`, `1/5`, `1/4`, `1/3`, `2/5` and `1/2`.");
      if (pIs(0.2)) return R("`1 - (4/5)^3 = 61/125 = 0.488`, just under `1/2`.");
      if (pIs(1 / 6)) return R("`1 - (5/6)^3 = 91/216 ≈ 0.42`, below `1/2`.");
      if (pIs(0.25)) {
        if (S.kind === "le" && S.a === 2) return { ok:true };
        if (S.kind === "le" && S.a === 3) return R("That’s within the first 4 trials.");
        return R("Within the first 3 trials means at most 2 failures: select `X ≤ 2`.");
      }
      if (pIs(1 / 3) || pIs(0.4) || pIs(0.5)) return R("That works, but it isn’t the smallest.");
      return R("Choose `p` from the chips `1/6`, `1/5`, `1/4`, `1/3`, `2/5` and `1/2`.");
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: a die rolls 3, 1, 5, 6 (X = 3); runs X = 0, 7, 1 drop blocks; hundreds of runs fill a staircase ----------
function hero(f){
  var box = f.fig && f.fig.querySelector("#gm-hfig"); if (!box) return;
  var aria = "A die rolls 3, 1, 5, then 6: X = 3 failures before the first 6. Three more runs give X = 0, 7 and 1, and each result drops a block into a histogram. Then hundreds of runs fill in a staircase that falls from left to right: always decreasing.";
  box.innerHTML = '<div class="gm-hrow"><div class="gm-hdie" id="gm-hdie"></div><div class="gm-hside"><ol class="gm-trials gm-hrolls" id="gm-hrolls" aria-hidden="true"></ol><p class="gm-hcnt" id="gm-hcnt"></p></div></div>' +
    '<canvas class="plot gm-hplot" id="gm-hplot" role="img" aria-label="' + MV.esc(aria) + '"></canvas>';
  var plot = new MV.Plot($("#gm-hplot", box), { xmin:0, xmax:1, ymin:0, ymax:1 }), cap = f.cap, X1 = 15;
  var FINAL = [], cnt = [], i;
  for (i = 0; i <= X1; i++) { FINAL.push(Math.round(500 * Math.pow(5 / 6, i) / 6)); cnt.push(0); }
  var st = { cnt:cnt, ymax:4, drop:null, label:0, die:0, rot:0, succ:false, rolls:[], count:"" };
  plot.render = function(){
    var bars = st.cnt.map(function(c, x){ return { x:x, p:c }; });
    var geo = gChart(plot, { x1:X1, ymax:st.ymax, yStep:st.ymax <= 4 ? 1 : 20, yFmt:function(v){ return String(Math.round(v)); }, bars:bars, yLabel:"runs", xLabel:"x", describe:aria });
    var ctx = plot.ctx;
    if (st.drop && geo) {   // a block falling into column x
      var x = st.drop.x, yb = plot.Y(st.cnt[x] + 1), y = geo.yt - 20 + (yb - geo.yt + 20) * st.drop.t, w = plot.X(x + 0.5) - plot.X(x - 0.5);
      ctx.save(); ctx.fillStyle = css("--pen"); ctx.fillRect(plot.X(x - 0.5), y, w, plot.Y(0) - plot.Y(1)); ctx.restore();
    }
    if (st.label && geo) {
      ctx.save(); ctx.globalAlpha = st.label; ctx.strokeStyle = css("--ink-2"); ctx.fillStyle = css("--ink-2"); ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
      var x0 = plot.X(0.2), y0 = plot.Y(FINAL[0] + 7), x1 = plot.X(12.6), y1 = plot.Y(FINAL[12] + 9);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]);
      var ang = Math.atan2(y1 - y0, x1 - x0); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 11 * Math.cos(ang - 0.4), y1 - 11 * Math.sin(ang - 0.4)); ctx.lineTo(x1 - 11 * Math.cos(ang + 0.4), y1 - 11 * Math.sin(ang + 0.4)); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css("--ink"); ctx.font = "700 15px " + plot.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.save(); ctx.translate(x0 + (x1 - x0) * 0.5, y0 + (y1 - y0) * 0.5); ctx.rotate(ang); ctx.fillText("always decreasing", 0, -7); ctx.restore();
      ctx.restore();
    }
  };
  function paintSide(){
    $("#gm-hdie", box).innerHTML = dieSVG(st.die, st.succ, st.rot);
    $("#gm-hrolls", box).innerHTML = st.rolls.map(function(r){ return '<li class="gm-tr' + (r === "6" ? " s" : "") + '"><span class="gm-trf">' + r + '</span><span class="gm-trs">' + (r === "6" ? "S" : "F") + "</span></li>"; }).join("");
    $("#gm-hcnt", box).innerHTML = st.count;
  }
  function last(){
    st = { cnt:FINAL.slice(), ymax:90, drop:null, label:1, die:6, rot:0, succ:true, rolls:["3", "1", "5", "6"], count:M("X = 3") + " failures before the first 6" };
    paintSide(); plot.render(); cap.textContent = "Hundreds of runs: the staircase always decreases, so 0 failures is the most likely value.";
  }
  if (MV.reduceMotion) { last(); return; }
  paintSide(); plot.render(); cap.textContent = "Roll a die until the first 6";
  function tw(dur, fn, done){ MV.tween({ dur:dur, ease:function(t){ return t; }, step:fn, done:done }); }
  function roll(face, dur, done){
    var faces = [2, 5, 1, 4, 3, 6];
    tw(dur, function(t){ st.die = t < 0.9 ? faces[Math.floor(t * 9) % 6] : face; st.rot = (1 - t) * 280; st.succ = false; paintSide(); }, function(){ st.die = face; st.rot = 0; st.succ = face === 6; st.rolls.push(String(face)); var fl = st.rolls.length - (face === 6 ? 1 : 0);
      st.count = M("X = " + fl) + " failure" + (fl === 1 ? "" : "s") + (face === 6 ? " before the first 6" : " so far"); paintSide(); done(); });
  }
  function drop(x, done){ st.drop = { x:x, t:0 }; tw(420, function(t){ st.drop.t = t * t; plot.render(); }, function(){ st.drop = null; st.cnt[x]++; plot.render(); done(); }); }
  var seq = [3, 1, 5, 6], k = 0;
  MV.wait(500, function next(){
    roll(seq[k], 520, function(){
      k++;
      if (k < seq.length) { MV.wait(260, next); return; }
      cap.textContent = "X = 3 failures before the first 6";
      MV.wait(500, function(){ drop(3, function(){ MV.wait(700, more); }); });
    });
  });
  var RUNS = [[6], [2, 4, 1, 3, 5, 2, 4, 6], [5, 6]], ri = 0;
  function more(){
    if (ri >= RUNS.length) { MV.wait(500, fill); return; }
    var r = RUNS[ri++], x = r.length - 1;
    st.rolls = r.map(String); st.die = 6; st.succ = true; st.rot = 0; st.count = M("X = " + x) + " failure" + (x === 1 ? "" : "s") + " before the first 6"; paintSide();
    cap.textContent = "Another run: X = " + x;
    drop(x, function(){ MV.wait(450, more); });
  }
  function fill(){
    var from = st.cnt.slice();
    cap.textContent = "Hundreds of runs…";
    st.rolls = ["3", "1", "5", "6"]; st.count = M("X = 3") + " failures before the first 6"; paintSide();
    tw(2200, function(t){ var e = t * t * (3 - 2 * t); st.ymax = 4 + 86 * e; st.cnt = from.map(function(c, x){ return c + (FINAL[x] - c) * e; }); plot.render(); }, function(){
      st.cnt = FINAL.slice(); tw(600, function(t){ st.label = t; plot.render(); }, function(){ MV.wait(900, last); });
    });
  }
}

// ---------- Part 3: Waiting-time problems (four station cards) ----------
var U_CH = ["1/2", "1/3", "1/4", "1/6"];
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.ans = obj(S.ans); S.s4 = obj(S.s4); if (U_CH.indexOf(S.s4.p) < 0) S.s4.p = "1/4"; S.s4.k = clampI(S.s4.k, 0, 40, 1);
  function items(s){ return (s.rows || []).concat(s.cards || []); }
  function ast(id){ var x = S.ans[id] = obj(S.ans[id]); x.tries = x.tries || 0; return x; }
  function done(s){ return s.id === "s4" ? !!S.s4.seen : items(s).every(function(it){ return ast(it.id).solved; }); }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.title + (done(s) ? ' <span class="gm-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="gw-tabs" class="gw-tabs"></div><div id="gw-body" class="gw-body"></div>';
  tabText();
  var tabs = radios($("#gw-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; if (v === "s4") S.s4.seen = true; api.save(); paint(); } });
  var uR = null;

  function chipsHTML(it, lab){
    var x = ast(it.id), picked = x.pick != null ? it.chips[x.pick] : null;
    var h = '<div class="gw-chips" role="group" aria-label="' + MV.esc(MV.plain(lab)) + '">' + it.chips.map(function(c, k){
      var on = x.pick === k, cls = "chip gw-chip" + (on ? (MV.ok(c) ? " ok" : " no") : "");
      return '<button type="button" class="' + cls + '" data-it="' + it.id + '" data-ci="' + k + '" data-k="gw' + it.id + k + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    if (picked) h += MV.fbHTML(MV.ok(picked) ? "good" : "bad", (MV.ok(picked) ? "<strong>✓</strong> " : "<strong>✗ Not quite.</strong> ") + picked.fb + (MV.ok(picked) ? (x.first ? "" : ' <span class="muted">(not first try)</span>') : " Try again."));
    return h;
  }
  function rowsHTML(s){
    return '<p class="gw-text">' + s.text + "</p>" + s.rows.map(function(it){
      return '<div class="gw-row" data-row="' + it.id + '"><p class="gw-rl">' + it.label + "</p>" + (it.use ? MV.usesHTML(it.use) : "") + chipsHTML(it, it.label) + "</div>";
    }).join("");
  }
  function cardsHTML(s){
    return '<p class="gw-text">' + s.text + '</p><div class="gw-cards">' + s.cards.map(function(c){
      return '<div class="gw-card" data-row="' + c.id + '"><p class="gw-ct">' + c.t + '</p><p class="tiny muted">Its formula for ' + M("P(X = x)") + ":</p>" + chipsHTML(c, c.t) + "</div>";
    }).join("") + "</div>";
  }
  // Station 4: stacked bars p, qp, q²p, … fill a unit bar; the trials convention table
  function s4P(){ var q = S.s4.p.split("/"); return { a:+q[0], d:+q[1] }; }
  function unitHTML(){
    var p = s4P(), v = p.a / p.d, k = S.s4.k, segs = "", left = 0, i;
    for (i = 0; i < k; i++) {
      var w = Math.pow(1 - v, i) * v, lab = i === 0 ? "p" : i === 1 ? "qp" : "q^" + i + "p";
      segs += '<span class="gw-seg gw-seg' + (i % 2) + (i === k - 1 ? " gw-new" : "") + '" style="left:' + (left * 100).toFixed(3) + "%;width:" + (w * 100).toFixed(3) + '%">' + (w > 0.09 ? M(lab) : "") + "</span>";
      left += w;
    }
    var gap = Math.pow(1 - v, k), gapF = F.of(Math.pow(p.d - p.a, k), Math.pow(p.d, k)), small = gapF.d <= 99999;
    var sumTxt = k === 0 ? "0" : k === 1 ? "p" : k === 2 ? "p + qp" : k === 3 ? "p + qp + q^2p" : "p + qp + … + q^{" + (k - 1) + "}p";
    var h = '<div class="gw-unit" role="img" aria-label="' + MV.esc("A unit bar from 0 to 1 holding the first " + k + " bars; together they fill " + d4(1 - gap) + " of it, leaving a gap of " + d4(gap) + ".") + '">' + segs + '<span class="gw-gap" style="left:' + (left * 100).toFixed(3) + '%;right:0">' + (gap > 0.12 ? "gap" : "") + '</span></div><div class="gw-scale" aria-hidden="true"><span>0</span><span>1</span></div>';
    h += '<dl class="read gw-read" aria-live="polite">' + MV.readoutHTML([["Bars stacked", String(k)], ["Their sum", k ? M(sumTxt + " = 1 - " + qp(k)) + " " + (small ? "= " + M(F.txt(F.comp(gapF))) + " " : "") + apx(1 - gap) : "0"], ["Gap to 1", M(qp(k)) + " " + (small ? "= " + M(F.txt(gapF)) + " " : "") + apx(gap)]]) + "</dl>";
    return h;
  }
  function convHTML(){
    var p = s4P(), Pp = { v:p.a / p.d, a:p.a, d:p.d, chip:true }, rows = [];
    for (var x = 0; x <= 4; x++) { var f = F.of(Math.pow(p.d - p.a, x) * p.a, Math.pow(p.d, x + 1)); rows.push([String(x), M(F.txt(f)), String(x + 1), M(F.txt(f))]); }
    var Ef = eFail(Pp), Et = eTrial(Pp);
    return MV.tableHTML({ head:[M("x"), M("P(X = x) = q^x p"), M("y = x + 1"), M("P(Y = y) = q^{y - 1}p")], rows:rows, caption:"Failures X and trials Y = X + 1" }) +
      '<div class="alg-lines"><span>' + M("Y = X + 1") + " gives " + M("P(Y = y) = q^{y - 1}p") + ": the same bars, one place to the right.</span><span>" + M("E(X) = q ÷ p") + " " + valTxt(Ef) + "</span><span>" + M("E(Y) = 1 ÷ p") + " " + valTxt(Et) + " " + M("= E(X) + 1") + "</span></div>";
  }
  function s4HTML(s){
    return '<p class="gw-text">' + s.text + "</p>" +
      '<h4 class="gw-h">Probabilities add to 1</h4><div id="gw-up"></div><div id="gw-unitbox">' + unitHTML() + "</div>" +
      '<div class="q-actions"><button type="button" class="btn sm" data-u="1" data-k="gwu1"' + (S.s4.k >= 40 ? " disabled" : "") + '>Add the next bar</button><button type="button" class="btn ghost sm" data-u="5" data-k="gwu5"' + (S.s4.k >= 40 ? " disabled" : "") + '>Add 5 more</button><button type="button" class="btn ghost sm" data-u="0" data-k="gwu0">Start again</button></div>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><span>' + M("S = p + qp + q^2p + q^3p + …") + "</span><span>" + M("qS = qp + q^2p + q^3p + …") + "</span><span>Subtract: " + M("S - qS = p") + ", so " + M("S(1 - q) = p") + ".</span><span>" + M("S = p ÷ (1 - q) = p ÷ p = 1") + "</span><small>Each new bar fills " + M("p") + " of the gap that is left, so the gap " + M("q^k") + " shrinks toward 0.</small></div></details>" +
      '<details class="alg" open><summary>The trials convention</summary><div id="gw-conv">' + convHTML() + "</div></details>";
  }
  function paint(){
    tabText(); tabs.refresh();
    var s = ST.filter(function(z){ return z.id === S.cur; })[0], body = $("#gw-body", host);
    var inner = s.id === "s4" ? s4HTML(s) : s.cards ? cardsHTML(s) : rowsHTML(s);
    var fin = done(s) && s.id !== "s4" ? '<p class="gw-done"><strong>✓ Station ' + (ST.indexOf(s) + 1) + " complete.</strong> " + (ST.every(done) ? "All four stations done. Try the quick check below." : "Choose another station above.") + "</p>" : "";
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="gw-card0"><span class="gw-lab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + "</span>" + inner + fin + "</div>"; });
    if (s.id === "s4") uR = radios($("#gw-up", host), { label:"Probability of success " + M("p"), aria:"Probability of success p", options:U_CH.map(function(c){ return { id:c, t:M(c), aria:"p = " + c }; }), value:S.s4.p, cls:"chips",
      onChange:function(v){ S.s4.p = v; api.save(); $("#gw-unitbox", host).innerHTML = unitHTML(); $("#gw-conv", host).innerHTML = convHTML(); } });
  }
  function allItems(){ var L = []; ST.forEach(function(s){ L = L.concat(items(s)); }); return L; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.it) {
      var it = allItems().filter(function(z){ return z.id === b.dataset.it; })[0], x = ast(it.id), k = +b.dataset.ci;
      x.pick = k;
      if (MV.ok(it.chips[k])) { x.solved = true; x.first = x.tries === 0; } else x.tries++;
      api.save(); paint(); MV.focusFb(host.querySelector('[data-row="' + it.id + '"]')); return;
    }
    if (b.dataset.u != null) {
      var n = +b.dataset.u; S.s4.k = n ? Math.min(40, S.s4.k + n) : 0; S.s4.seen = true; api.save();
      $("#gw-unitbox", host).innerHTML = unitHTML();
      host.querySelectorAll("[data-u='1'],[data-u='5']").forEach(function(q){ q.disabled = S.s4.k >= 40; });
    }
  });
  if (S.cur === "s4") S.s4.seen = true;
  paint();
  return {};
}

// ---------- Performance task: Prize within k tries ----------
var task = (function(){
  var api = null, plot = null;
  function read(){ var s = api ? api.S : {}; return { p:CHIPS.indexOf(s.p) >= 0 ? s.p : "1/2", k:clampI(s.k, 1, 6, 1) }; }
  function pp(d){ var q = d.p.split("/"); return { a:+q[0], d:+q[1] }; }
  function draw(){
    var d = read(), P = pOf(d.p), bars = [], mx = 0, E = eFail(P);
    for (var x = 0; x < NB; x++) bars.push({ x:x, p:pmfV(P, x) });
    bars.push({ x:NB, p:tailV(P, NB) }); bars.forEach(function(b){ mx = Math.max(mx, b.p); });
    var sc = scaleOf(mx);
    gChart(plot, { x1:NB, tail:true, ymax:sc.ymax, yStep:sc.step, bars:bars, range:{ lo:0, hi:d.k - 1 }, mean:{ x:E.v, label:"E(X) = " + MV.plain(M(eShort(E))) },
      xFmt:function(x){ return x >= NB ? "≥" + NB : String(x); }, xLabel:"x", yLabel:"P(X = x)",
      describe:"Your game: p = " + d.p + ", k = " + d.k + ". The staircase of losses before the first win, with the prize region X ≤ " + (d.k - 1) + " shaded: P(prize) = 1 − q^" + d.k + " " + MV.plain(valTxt(probOf(P, "le", d.k - 1))) + ". E(X) = " + MV.plain(M(eShort(E))) + "." });
  }
  function paint(){
    var d = read(), P = pOf(d.p), el = $("#pk-read"); if (!el) return;
    var win = probOf(P, "le", d.k - 1), none = probOf(P, "ge", d.k);
    el.innerHTML = MV.readoutHTML([["Expected losses", M("E(X) = q ÷ p") + " " + valTxt(eFail(P))],
      ["Gets a prize", M("P(X ≤ " + (d.k - 1) + ") = 1 - " + qp(d.k)) + " " + valTxt(win)],
      ["No prize", M("P(X ≥ " + d.k + ") = " + qp(d.k)) + " " + valTxt(none)]]);
    draw();
  }
  return {
    render:function(inp, pvw, a){
      api = a; var d = read(); a.S.p = d.p; a.S.k = d.k;
      inp.innerHTML = '<div class="pk-in"><div id="pk-p"></div><div id="pk-k"></div></div>';
      radios($("#pk-p", inp), { label:"Win probability " + M("p"), aria:"Win probability p", options:CHIPS.map(function(c){ return { id:c, t:M(c), aria:"p = " + c }; }), value:d.p, cls:"chips",
        onChange:function(v){ a.S.p = v; a.save(); paint(); a.update(); } });
      radios($("#pk-k", inp), { label:"Prize limit " + M("k"), aria:"Prize limit k", options:[1, 2, 3, 4, 5, 6].map(function(k){ return { id:k, t:String(k), aria:"k = " + k }; }), value:d.k, cls:"chips",
        onChange:function(v){ a.S.k = +v; a.save(); paint(); a.update(); } });
      pvw.innerHTML = '<canvas class="plot pk-plot" id="pk-plot" role="img" aria-label="Your game’s staircase"></canvas><p class="tiny muted">Shaded: the prize region, a win within the first ' + M("k") + ' tries (at most ' + M("k - 1") + ' losses).</p><dl class="read pk-read" id="pk-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#pk-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var q = pp(d), f = q.d - q.a, qk = Math.pow(f, d.k), dk = Math.pow(q.d, d.k);
      return [f >= 2 * q.a, 2 * qk <= dk, 4 * qk >= dk, d.k <= 4];
    },
    key:function(d){ return d.p + "|" + d.k; },
    label:function(k){ var q = k.split("|"); return M("(p, k) = (" + q[0] + ", " + q[1] + ")"); },
    text:function(k){ var q = k.split("|"); return "(p, k) = (" + q[0] + ", " + q[1] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
