// MDM4U 19 Expected Value: hero (a die's histogram on a seesaw; the fulcrum slides to 3.5, the 6 bar grows, the fulcrum
// slides to 4), Balance point (Explore: D7 seesaw with Balance, Game designer and Long run modes; D6 seeded simulator with a
// running-average graph on a log axis), Is it worth it? (Part 3: three decision stations, Check it with data), money entry
// practice (N4 moneyEntry), Design a fair game task. Probabilities are exact (MV.mdm.frac); simulations are seeded.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;
function M(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? clamp(v, lo, hi) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
// a number with up to dp decimals (zeros trimmed), true minus
function dN(v, dp){ dp = dp == null ? 2 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
// money: "$8", "−$0.33", "$1.60" (force2: always cents), "+$5" (plus)
function money(v, force2, plus){
  var c = Math.round(Math.abs(v) * 100), neg = v < 0 && c > 0, w = Math.floor(c / 100), ct = c % 100;
  return (neg ? MV.MINUS : plus && c > 0 ? "+" : "") + "$" + MV.mdm.fmt(w) + (ct || force2 ? "." + (ct < 10 ? "0" : "") + ct : "");
}
function hashStr(s){ var h = 2166136261 >>> 0; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
function isDark(){ var c = css("--sheet"), m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c); if (!m) return false; return (parseInt(m[1], 16) + parseInt(m[2], 16) + parseInt(m[3], 16)) / 3 < 110; }
function swHTML(id, lab, on){ return '<button type="button" class="cc-switch xv-sw" role="switch" id="' + id + '" data-k="' + id + '" aria-checked="' + !!on + '"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>' + lab + "</button>"; }
// exact or 4-place text for a fraction (decimal when it ends within 4 places)
function fTxt(f){ return F.exactDec(f, 4) ? F.dec(f, 4) : F.txt(f); }
var SEEDK = 19;

// @component radioGroup (copied from MDM4U 18 / 15) — segmented control or chip row as a real radio group
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

// @component D6 simulator (copied from MDM4U 18 / 16 makeSim) — seeded trials with numeric results and a running sum; to(n)
// grows the run on a geometric schedule (counts 10^(k·d/F), so a log-axis graph fills evenly; instant with reduced motion; a
// smaller n refills instantly). sim = makeSim({trial(rng) -> number, seed}); sim.reset(seed); sim.fill(n);
// sim.to(n, {frames, step(sim), done(sim)}); sim.seq; sim.sum; sim.stop(); sim.busy(). avgPts(seq) -> [[log10 k, mean of first k]].
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
function avgPts(seq){
  var out = [], t = 0, n = seq.length;
  for (var i = 0; i < n; i++) { t += seq[i]; var k = i + 1; if (k <= 100 || (k <= 1000 && k % 5 === 0) || k % 25 === 0 || k === n) out.push([Math.log10(k), t / k]); }
  return out;
}
// running average against plays on a log axis (1 to 10^dec), adapted from MDM4U 16's drawRelFreq: the line in --pen, E as a
// dashed --ink line with its label. drawRunAvg(plot, {pts, E | null, eLab, lo, hi, fmt(v), dec, yLabel, describe})
function niceStep(r){ var p = Math.pow(10, Math.floor(Math.log10(r))), m = r / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
function drawRunAvg(plot, o){
  var dec = o.dec || 4, span = Math.max(1e-9, o.hi - o.lo), xmin = -(plot.c.getBoundingClientRect().width < 420 ? 0.19 : 0.12) * dec, xmax = dec + 0.06, pen = css("--pen"), ink = css("--ink"), pts = o.pts;
  var ymin = o.lo - 0.16 * span, ymax = o.hi + 0.1 * span, st = niceStep(span / 4);
  plot.draw({ view:{ xmin:xmin, xmax:xmax, ymin:ymin, ymax:ymax }, grid:true, ticks:false,
    xTicks:{ step:1 }, yTicks:{ step:st },
    segments:o.E != null ? [{ x1:0, y1:o.E, x2:xmax, y2:o.E, color:ink, width:1.6, dash:[7, 6] }] : [],
    curves:pts.length > 1 ? [{ pts:pts, color:pen, width:2.6 }] : [],
    points:pts.length === 1 ? [{ x:pts[0][0], y:pts[0][1], color:pen, r:4 }] : [],
    labels:o.E != null && o.eLab ? [{ x:xmax, y:o.E, text:o.eLab, color:ink, align:"right", dy:o.E > o.lo + 0.8 * span ? 14 : -12, bg:true }] : [],
    describe:o.describe,
    after:function(ctx, pl){
      ctx.save(); ctx.fillStyle = css("--ink-2"); ctx.strokeStyle = css("--plot-axis"); ctx.font = "12px " + pl.fontUI;
      var yb = pl.Y(o.lo - 0.08 * span), k, m;
      ctx.lineWidth = 1; ctx.beginPath();
      for (k = 0; k < dec; k++) for (m = 2; m <= 9; m++) { var x = pl.X(k + Math.log10(m)); ctx.moveTo(x, yb - 3); ctx.lineTo(x, yb + 3); }
      ctx.stroke(); ctx.textBaseline = "top";
      for (k = 0; k <= dec; k++) { var lab = MV.mdm.fmt(Math.pow(10, k)), w = ctx.measureText(lab).width, cx = pl.X(k) + (k === 0 ? 5 : 0); if (cx + w / 2 > pl.W - 3) { ctx.textAlign = "right"; ctx.fillText(lab, pl.W - 3, yb + 5); } else { ctx.textAlign = "center"; ctx.fillText(lab, cx, yb + 5); } }
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var y = Math.ceil(ymin / st) * st; y <= ymax + 1e-9; y += st) { var py = pl.Y(y); if (py < 10 || py > yb - 8) continue; ctx.fillText((o.fmt || dN)(Math.round(y * 1e6) / 1e6), pl.X(0) - 5, py); }
      ctx.fillStyle = css("--ink-2"); ctx.font = "italic 13px " + pl.fontM; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yLabel || "running average", pl.X(0) + 6, 4);
      ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText("plays (log scale)", pl.W - 6, yb - 4);
      ctx.restore();
    } });
}

// @component D7 balanceSeesaw — a probability histogram on a seesaw (course plan D7's balance view): bars (--pen) stand on an
// --ink beam that pivots on an --ink triangle (the fulcrum) and tilts in proportion to the imbalance E − fulcrum (up to 12°,
// beam drawn level when E sits on the fulcrum); "E = …" under the fulcrum; the tilt as text; optional mode (▼) and median
// (dashed) markers in --ink-2, a running-average line (--pen) and drag knobs on the bar tops. With no fulcrum the beam rests
// level on two posts. drawSeesaw(plot, {bars:[{x, p, lab}], x0, x1, ymax, fx (null: no fulcrum), E, fLab, modes:[x],
// median, avg, ticks:[{x, t, w}], xLabel, knobs, tilt (0–1 scale), describe}) ; geometry in plot._ss = {W, H, X, base, hs, cx, cy, th, rot}
function drawSeesaw(plot, o){
  var r = plot.c.getBoundingClientRect(), W0 = Math.max(160, r.width), H0 = Math.max(120, r.height);
  plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, L = 36, R = 36, top = 34, yB = H - 66, bh = 6, triH = 30, span = o.x1 - o.x0;
    var X = function(x){ return L + (x - o.x0) / span * (W - L - R); };
    var base = yB - bh / 2, hs = (base - top) / o.ymax, unit = (W - L - R) / span, bw = clamp(unit * 0.72, 8, 46);
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), sheet = css("--sheet"), fUI = p.fontUI, fM = p.fontM;
    var hasF = o.fx != null, cx = hasF ? X(o.fx) : X(o.x0 + span / 2), cy = yB + bh / 2, th = 0;
    if (hasF && o.E != null) {
      th = clamp((o.E - o.fx) / (0.25 * span), -1, 1) * 12 * (o.tilt == null ? 1 : o.tilt) * Math.PI / 180;
      var reach = th > 0 ? X(o.x1) + 8 - cx : cx - X(o.x0) + 8, lim = Math.asin(Math.min(1, (triH - 5) / Math.max(1, reach)));   // the beam end stops above the ground
      th = clamp(th, -lim, lim);
    }
    var cs = Math.cos(th), sn = Math.sin(th);
    function rot(px, py){ var dx = px - cx, dy = py - cy; return [cx + cs * dx - sn * dy, cy + sn * dx + cs * dy]; }
    // ground, fulcrum or posts
    ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L - 14, cy + triH + 0.5); ctx.lineTo(W - R + 14, cy + triH + 0.5); ctx.stroke();
    if (hasF) { ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 16, cy + triH); ctx.lineTo(cx + 16, cy + triH); ctx.closePath(); ctx.fill(); }
    else { ctx.fillStyle = ink2; [X(o.x0) - 2, X(o.x1) - 4].forEach(function(px){ ctx.fillRect(px, cy, 6, triH); }); }
    // the tilting group
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(th); ctx.translate(-cx, -cy);
    if (o.median != null) {
      var mx = X(o.median); ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(mx, base); ctx.lineTo(mx, top - 12); ctx.stroke(); ctx.restore();
      ctx.fillStyle = ink2; ctx.font = "600 12px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("median", clamp(mx, 26, W - 26), top - 13);
    }
    if (o.avg != null) {
      var ax = X(o.avg); ctx.strokeStyle = pen; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(ax, base); ctx.lineTo(ax, top - 2); ctx.stroke();
      ctx.fillStyle = pen; ctx.font = "700 12px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("running avg", clamp(ax, 40, W - 40), top - 1);
    }
    (o.bars || []).forEach(function(b){
      if (!(b.p > 0)) return;
      var h = Math.min(b.p, o.ymax * 1.02) * hs, x1 = X(b.x) - bw / 2;
      ctx.fillStyle = pen; ctx.fillRect(x1, base - h, bw, h);
      ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.strokeRect(x1 + 0.5, base - h + 0.5, bw - 1, h - 1);
    });
    ctx.fillStyle = ink; ctx.fillRect(X(o.x0) - 8, yB - bh / 2, X(o.x1) - X(o.x0) + 16, bh);
    // probability labels over bars and mode markers (greedy, no overlaps)
    ctx.font = "600 12px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    var used = [];
    function free(a, b){ for (var i = 0; i < used.length; i++) if (a < used[i][1] && b > used[i][0]) return false; return true; }
    if (bw >= 26) (o.bars || []).slice().sort(function(a, b){ return b.p - a.p; }).forEach(function(b){
      if (!b.lab) return; var w = ctx.measureText(b.lab).width, x = X(b.x); if (!free(x - w / 2 - 3, x + w / 2 + 3)) return;
      used.push([x - w / 2 - 3, x + w / 2 + 3]); ctx.fillStyle = ink; ctx.fillText(b.lab, x, base - Math.min(b.p, o.ymax) * hs - (o.knobs ? 11 : 3));
    });
    (o.modes || []).forEach(function(mx2){
      var b = (o.bars || []).filter(function(q){ return q.x === mx2; })[0], y = base - (b ? Math.min(b.p, o.ymax) * hs : 0) - (bw >= 26 && b && b.lab ? 18 : 3) - (o.knobs ? 8 : 0);
      ctx.fillStyle = ink2; ctx.font = "700 12px " + fUI; ctx.fillText("▼ mode", X(mx2), y);
    });
    // x labels under the beam (on a sheet box so they read over the fulcrum)
    ctx.font = "13px " + fM; ctx.textBaseline = "top"; used = [];
    (o.ticks || []).slice().sort(function(a, b){ return (b.w || 0) - (a.w || 0); }).forEach(function(t){
      var w = ctx.measureText(t.t).width, x = X(t.x); if (!free(x - w / 2 - 4, x + w / 2 + 4)) return; used.push([x - w / 2 - 4, x + w / 2 + 4]);
      ctx.fillStyle = sheet; ctx.globalAlpha = 0.88; ctx.fillRect(x - w / 2 - 2, yB + bh / 2 + 2, w + 4, 16); ctx.globalAlpha = 1;
      ctx.fillStyle = ink; ctx.fillText(t.t, x, yB + bh / 2 + 3);
    });
    if (o.knobs) (o.bars || []).forEach(function(b){
      var y = base - Math.min(b.p, o.ymax) * hs; ctx.beginPath(); ctx.arc(X(b.x), y, 7, 0, Math.PI * 2); ctx.fillStyle = sheet; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = pen; ctx.stroke();
    });
    ctx.restore();
    // E label and tilt text (upright)
    if (hasF && o.fLab) {
      ctx.font = "700 14px " + fUI; var lw = ctx.measureText(o.fLab).width, lx = clamp(cx, lw / 2 + 4, W - lw / 2 - 4);
      ctx.fillStyle = sheet; ctx.fillRect(lx - lw / 2 - 3, cy + triH + 3, lw + 6, 18); ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(o.fLab, lx, cy + triH + 5);
    }
    if (o.xLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(o.xLabel, W - 6, H - 4); }
    if (hasF) {
      var deg = Math.round(Math.abs(th) * 180 / Math.PI);
      ctx.fillStyle = ink; ctx.font = "600 12px " + fUI; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(deg === 0 ? "Level: balanced" : "Tilt " + deg + "°, " + (th > 0 ? "right" : "left") + " side down", 8, 8);
    }
    plot._ss = { W:W, H:H, X:X, base:base, hs:hs, cx:cx, cy:cy, th:th, rot:rot };
  } });
}
function niceYmax(mx){ return mx <= 0.5 + 1e-9 ? 0.5 : 1; }

// ---------- models: Balance distributions (units of 1/240, so 1/6 and 0.05 are both whole) and Game designer devices ----------
var U = 240, G = 12;
var PRESETS = { die:[[1, 40], [2, 40], [3, 40], [4, 40], [5, 40], [6, 40]], zeroTen:[[0, 216], [10, 24]], four:[[1, 60], [2, 60], [3, 60], [4, 60]] };
var PRE_T = { die:"Fair die", zeroTen:"0 or 10", four:"Values 1–4" };
var DEV = {
  die:{ t:"Die", outs:[1, 2, 3, 4, 5, 6].map(function(k){ return { lab:"Face " + k, w:1 }; }), N:6 },
  coins:{ t:"2 coins", outs:[{ lab:"2 heads", w:1 }, { lab:"1 head, 1 tail", w:2 }, { lab:"2 tails", w:1 }], N:4 },
  spin4:{ t:"Spinner, 4 sectors", outs:[1, 2, 3, 4].map(function(k){ return { lab:"Sector " + k, w:1 }; }), N:4 },
  spin12:{ t:"Spinner, 12 sectors", outs:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function(k){ return { lab:"Sector " + k, w:1 }; }), N:12 },
  raffle:{ t:"Charity raffle", outs:[{ lab:"$500 prize", w:1, prize:50000 }, { lab:"$100 prize", w:2, prize:10000 }, { lab:"$20 prize", w:5, prize:2000 }, { lab:"No prize", w:492, prize:0 }], N:500, fixed:true }
};
var DEV_ORDER = ["die", "coins", "spin4", "spin12", "raffle"];
function costStep(dev){ return dev === "raffle" ? 10 : 50; }
// a distribution: rows sorted by x, each {x, f, p}; E (number) and Ef (exact)
function finish(rows){
  rows.sort(function(a, b){ return a.x - b.x; });
  var Ef = F.of(0, 1); rows.forEach(function(r){ Ef = F.add(Ef, F.mul(r.xf, r.f)); });
  return { rows:rows, Ef:Ef, E:Ef.n / Ef.d };
}
function balDist(bal){ return finish(bal.rows.map(function(r, i){ return { x:r.x, xf:F.of(r.x, 1), f:F.of(r.u, U), p:r.u / U, i:i }; })); }
function gameDist(g){
  var D = DEV[g.dev], cost = g.cost[g.dev], pz = g.dev === "raffle" ? D.outs.map(function(o){ return o.prize; }) : g.prizes[g.dev], by = {}, ep = 0;
  D.outs.forEach(function(o, k){ var net = pz[k] - cost; by[net] = (by[net] || 0) + o.w; ep += pz[k] * o.w; });
  var d = finish(Object.keys(by).map(function(c){ c = +c; return { x:c / 100, xf:F.of(c, 100), f:F.of(by[c], D.N), p:by[c] / D.N, cents:c }; }));
  d.money = true; d.prizeF = F.of(ep, 100 * D.N); d.prize = ep / 100 / D.N; d.cost = cost / 100;
  return d;
}
function modesOf(rows){ var mx = null; rows.forEach(function(r){ if (r.f.n > 0 && (!mx || F.cmp(r.f, mx) > 0)) mx = r.f; }); return mx ? rows.filter(function(r){ return F.eq(r.f, mx); }).map(function(r){ return r.x; }) : []; }
function medianOf(rows){
  var cum = F.of(0, 1), half = F.of(1, 2), live = rows.filter(function(r){ return r.f.n > 0; });
  for (var i = 0; i < live.length; i++) { cum = F.add(cum, live[i].f); var c = F.cmp(cum, half); if (c > 0) return live[i].x; if (c === 0) return i + 1 < live.length ? (live[i].x + live[i + 1].x) / 2 : live[i].x; }
  return null;
}

// ---------- Explore: Balance point ----------
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (["bal", "game", "long"].indexOf(S.mode) < 0) S.mode = "bal";
    S.bal = obj(S.bal);
    if (!Array.isArray(S.bal.rows) || !S.bal.rows.length || S.bal.rows.length > 6) applyPreset("die");
    var seen = {}, tot = 0;
    S.bal.rows = S.bal.rows.map(function(r){ r = obj(r); var x = clampI(r.x, -20, 20, 0); while (seen[x]) x = x < 20 ? x + 1 : -20; seen[x] = 1; var u = clampI(r.u, 0, U, 0); tot += u; return { x:x, u:u, lock:!!r.lock }; });
    if (tot !== U) applyPreset("die");
    S.game = obj(S.game);
    if (!DEV[S.game.dev]) S.game.dev = "die";
    S.game.cost = obj(S.game.cost); S.game.prizes = obj(S.game.prizes);
    DEV_ORDER.forEach(function(k){
      var st = costStep(k), c = Math.round(clampI(S.game.cost[k], 0, 1000, k === "raffle" ? 500 : 200) / (k === "raffle" ? 1 : st)) * (k === "raffle" ? 1 : st);
      S.game.cost[k] = c;
      if (k === "raffle") return;
      var n = DEV[k].outs.length, a = Array.isArray(S.game.prizes[k]) && S.game.prizes[k].length === n ? S.game.prizes[k] : DEV[k].outs.map(function(_, i){ return k === "die" && i === 5 ? 1000 : 0; });
      S.game.prizes[k] = a.map(function(v){ return Math.round(clampI(v, 0, 50000, 0) / 50) * 50; });
    });
    S.lr = obj(S.lr); if (S.lr.src !== "game") S.lr.src = "bal";
    S.lr.n = [0, 10, 100, 1000, 10000].indexOf(+S.lr.n) >= 0 ? +S.lr.n : 0; S.lr.rep = S.lr.rep == null ? true : !!S.lr.rep; S.lr.runs = clampI(S.lr.runs, 0, 1e6, 0);
    S.show = obj(S.show); S.show.f = S.show.f == null ? true : !!S.show.f; S.show.mode = !!S.show.mode; S.show.med = !!S.show.med;
    S.exact = !!S.exact;
  }
  function applyPreset(k){ S.bal = S.bal || {}; S.bal.rows = PRESETS[k].map(function(q){ return { x:q[0], u:q[1], lock:false }; }); S.bal.preset = k; }
  sanitize();

  var pv = {}, anim = null, msg = "", sims = {}, fxCur = null, fxStop = null, built = "";
  host.innerHTML =
    '<div class="xv-top"><div id="xv-mode"></div></div>' +
    '<div class="pg xv-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap xv-cap" id="xv-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot xv-plot" id="xv-plot" role="img" aria-label="Probability histogram on a seesaw"></canvas></div>' +
      '<div class="xv-show" role="group" aria-label="Show on the seesaw">' + swHTML("xv-sf", "Fulcrum", S.show.f) + swHTML("xv-sm", "Mode marker", S.show.mode) + swHTML("xv-sd", "Median marker", S.show.med) + "</div>" +
      '<div id="xv-lrbox" class="xv-lrbox" hidden><canvas class="plot xv-lrplot" id="xv-lr" role="img" aria-label="Running average"></canvas></div>' +
      '<div id="xv-tbl2" class="xv-tbl xv-tbl-m"></div><p class="xv-aha" id="xv-aha"></p></div>' +
    '<div class="pg-ctrl"><div id="xv-ctrl"></div><p class="tiny xv-msg" id="xv-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="xv-read" aria-live="polite"></dl><div id="xv-tbl" class="xv-tbl xv-tbl-d"></div></div></div>';
  var plot = new MV.Plot($("#xv-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), lrPlot = new MV.Plot($("#xv-lr", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintChart; lrPlot.render = paintLR;
  var modeR = radios($("#xv-mode", host), { label:"Mode", options:[{ id:"bal", t:"Balance" }, { id:"game", t:"Game designer" }, { id:"long", t:"Long run" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); if (v === "long") S.lr.src = S.mode === "game" ? "game" : "bal"; S.mode = v; msg = ""; fxCur = null; save(); render(); MV.changed(); } });
  var preR = null, devR = null, srcR = null, playsR = null;

  function save(){ api.save(); }
  function kind(){ return S.mode === "long" ? S.lr.src : S.mode; }
  function distOf(k){ return k === "game" ? gameDist(S.game) : balDist(S.bal); }
  function cur(){ return distOf(kind()); }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }

  // --- animation bookkeeping: any user action finishes the running animation ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; lockUI(true); return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {}; fxCur = null; lockUI(false);
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }
  function endAnim(){ var a = anim; anim = null; lockUI(false); if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function lockUI(b){ if (playsR) playsR.lock(b); }

  // --- the fulcrum follows E: the beam tips at once, holds, then the fulcrum slides under the new balance point ---
  function stopF(){ if (fxStop) { fxStop(); fxStop = null; } }
  function followF(instant){
    if (pv.manualF) return;
    var E = cur().E;
    if (instant || MV.reduceMotion || fxCur == null || pv.hide) { stopF(); fxCur = E; return; }
    if (Math.abs(E - fxCur) < 1e-9) return;
    stopF(); var from = fxCur, hold = MV.wait(260, function(){
      fxStop = MV.tween({ dur:620, step:function(t){ fxCur = from + (E - from) * t; paintChart(); }, done:function(){ fxStop = null; fxCur = E; paintChart(); } });
    });
    fxStop = function(){ clearTimeout(hold); };
  }

  // --- Balance mode: set one probability, the unlocked others share what's left in proportion ---
  function setU(i, uNew){
    var rows = S.bal.rows, lockedSum = 0, freeI = [];
    rows.forEach(function(r, j){ if (j === i) return; if (r.lock) lockedSum += r.u; else freeI.push(j); });
    if (!freeI.length) { msg = "Unlock another value so the total can stay 1."; return false; }
    uNew = clamp(uNew, 0, U - lockedSum);
    var R = U - lockedSum - uNew, old = freeI.map(function(j){ return rows[j].u; }), So = old.reduce(function(a, b){ return a + b; }, 0);
    var g = R % G === 0 ? G : R % 4 === 0 ? 4 : 1, chunks = R / g;
    var w = So > 0 ? old : old.map(function(){ return 1; }), Sw = w.reduce(function(a, b){ return a + b; }, 0);
    var share = w.map(function(v){ return chunks * v / Sw; }), base = share.map(Math.floor), left = chunks - base.reduce(function(a, b){ return a + b; }, 0);
    var order = share.map(function(v, k){ return k; }).sort(function(a, b){ return (share[b] - base[b]) - (share[a] - base[a]) || old[b] - old[a] || a - b; });
    for (var k = 0; k < left; k++) base[order[k]]++;
    rows[i].u = uNew; freeI.forEach(function(j, k2){ rows[j].u = base[k2] * g; });
    S.bal.preset = ""; msg = "";
    return true;
  }
  // one press: the next 0.05 step; Shift: 0.1 more (two steps)
  function stepU(u, dir, big){ var v = dir > 0 ? Math.floor(u / G + 1e-9) * G + G : Math.ceil(u / G - 1e-9) * G - G; return big ? v + dir * G : v; }
  function nudge(i, dir, big){ user(); var r = S.bal.rows[i]; if (r.lock) { msg = "That value is locked. Unlock it to change its probability."; paintMsg(); return; } setU(i, stepU(r.u, dir, big)); after(); }
  function after(){ save(); followF(false); render(); MV.changed(); }
  function stepX(i, dir){
    var rows = S.bal.rows, used = {}; rows.forEach(function(r, j){ if (j !== i) used[r.x] = 1; });
    var x = rows[i].x + dir; while (x >= -20 && x <= 20 && used[x]) x += dir;
    if (x < -20 || x > 20) return;
    user(); rows[i].x = x; S.bal.preset = ""; after();
  }
  function canStepX(i, dir){ var rows = S.bal.rows, used = {}; rows.forEach(function(r, j){ if (j !== i) used[r.x] = 1; }); var x = rows[i].x + dir; while (x >= -20 && x <= 20 && used[x]) x += dir; return x >= -20 && x <= 20; }

  // --- the long-run simulator for the current source ---
  function lrKey(){ var d = distOf(S.lr.src); return S.lr.src + "|" + d.rows.map(function(r){ return r.x + ":" + r.f.n + "/" + r.f.d; }).join(","); }
  function lrSeed(k){ return (SEEDK + hashStr(k) + (S.lr.rep ? 0 : 7919 * (S.lr.runs + 1))) >>> 0; }
  function sim(){
    var k = lrKey(), sd = lrSeed(k), id = k + "#" + sd;
    if (!sims[id]) { var d = distOf(S.lr.src), xs = d.rows.map(function(r){ return r.x; }), ws = d.rows.map(function(r){ return r.p; }); sims[id] = makeSim({ seed:sd, trial:function(g){ return xs[g.pick(ws)]; } }); }
    return sims[id];
  }
  function simReady(){ var s = sim(); if (!s.busy() && s.seq.length !== S.lr.n) s.fill(S.lr.n); return s; }
  function runTo(n, frames, fin){
    var s = sim(); S.lr.n = n; save(); lockUI(true);
    s.to(n, { frames:frames, step:function(){ paintLR(); paintChart(); paintRead(); }, done:function(){ if (!anim) lockUI(false); render(); MV.changed(); if (fin) fin(); } });
    if (anim) anim.stops.push(function(){ s.stop(); });
  }

  // --- painting ---
  function render(){
    sanitize();
    modeR.set(S.mode);
    var d = cur(), lrKeyNow = lrKey();
    if (S.lr.key !== lrKeyNow) { S.lr.key = lrKeyNow; S.lr.n = 0; save(); }
    if (fxCur == null && !pv.manualF) fxCur = d.E;
    paintCtrl(); paintChart(); paintRead(); paintCap(); paintAha(); paintMsg();
    $("#xv-lrbox", host).hidden = S.mode !== "long";
    if (S.mode === "long") paintLR();
    ["xv-sf", "xv-sm", "xv-sd"].forEach(function(id, k){ $("#" + id, host).setAttribute("aria-checked", String([S.show.f, S.show.mode, S.show.med][k])); });
    plot.c.style.touchAction = S.mode === "bal" ? "none" : "pan-y";
  }
  function paintMsg(){ $("#xv-msg", host).innerHTML = msg ? MV.md(msg) : ""; }
  function paintCtrl(){
    var box = $("#xv-ctrl", host), want = S.mode === "game" ? "game:" + S.game.dev : S.mode;
    if (built !== want) {
      var hadDev = box.contains(document.activeElement) && !!document.activeElement.closest("#xv-dev");
      built = want; preR = devR = srcR = playsR = null;
      if (S.mode === "bal") {
        box.innerHTML = '<div class="xv-panel"><p class="xv-sh">Distribution</p><div id="xv-pre"></div><div id="xv-brows" class="xv-brows" role="group" aria-label="Values and probabilities"></div>' +
          '<p class="tiny muted xv-how">Drag a bar’s top, or use its − and + (steps of 0.05; Shift + arrow keys on a bar: 0.1). The unlocked values share what’s left so the total stays 1; a locked value stays put.</p></div>';
        preR = radios($("#xv-pre", box), { label:"Start from", options:Object.keys(PRESETS).map(function(k){ return { id:k, t:PRE_T[k] }; }).concat([{ id:"", t:"Your own", aria:"Your own (edit below)" }]), value:S.bal.preset || "", cls:"chips",
          disabled:function(id){ return id === ""; },
          onChange:function(v){ if (!v) return; user(); applyPreset(v); msg = ""; save(); followF(true); render(); MV.changed(); } });
      } else if (S.mode === "game") {
        var D = DEV[S.game.dev], st = costStep(S.game.dev);
        box.innerHTML = '<div class="xv-panel"><p class="xv-sh">Game designer <span class="mdm-model">model game</span></p><div id="xv-dev"></div>' +
          '<div class="xv-cost" role="group" aria-label="Cost to play"><label for="xv-cost-in" class="xv-cl">' + (S.game.dev === "raffle" ? "Ticket price" : "Cost to play") + '</label><button type="button" class="btn ghost sm xv-stb" data-cost="-1" data-k="xvcm" aria-label="Cost down ' + money(st / 100, true) + '">−</button>' +
          '<span class="xv-dol" aria-hidden="true">$</span><input id="xv-cost-in" class="numin xv-in" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-k="xvcost"><button type="button" class="btn ghost sm xv-stb" data-cost="1" data-k="xvcp" aria-label="Cost up ' + money(st / 100, true) + '">+</button><span class="tiny muted">steps of ' + money(st / 100, true) + "</span></div>" +
          (D.fixed ? '<p class="xv-sh xv-sh2">Prizes (500 tickets sold)</p>' + MV.tableHTML({ head:["Prize", "Tickets", "Probability"], caption:"Raffle prizes", rows:D.outs.map(function(o){ return [o.lab.replace(" prize", ""), String(o.w), M(F.txt(F.of(o.w, D.N)))]; }) }) +
            '<p class="tiny muted">The raffle raises money for a charity: the actual ticket price is $5.</p>' :
            '<p class="xv-sh xv-sh2">Prize for each outcome</p><div class="xv-prizes">' + D.outs.map(function(o, k){
              return '<div class="xv-prize"><label for="xv-pz' + k + '"><span class="xv-pl">' + o.lab + ' <span class="tiny muted">(' + M(F.txt(F.of(o.w, D.N))) + ')</span></span><span class="xv-pin"><span class="xv-dol" aria-hidden="true">$</span><input id="xv-pz' + k + '" class="numin xv-in" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-pz="' + k + '" data-k="xvpz' + k + '"></span></label>' +
                '<span class="xv-pbtn"><button type="button" class="btn ghost sm xv-stb" data-pzs="' + k + '|-1" data-k="xvpz' + k + 'm" aria-label="' + o.lab + ' prize down $0.50">−</button><button type="button" class="btn ghost sm xv-stb" data-pzs="' + k + '|1" data-k="xvpz' + k + 'p" aria-label="' + o.lab + ' prize up $0.50">+</button></span></div>';
            }).join("") + '</div><p class="tiny muted">Prizes $0–$500 in steps of $0.50; the net gain is the prize minus the cost to play.</p>') + "</div>";
        devR = radios($("#xv-dev", box), { label:"Device", options:DEV_ORDER.map(function(k){ return { id:k, t:DEV[k].t }; }), value:S.game.dev, cls:"chips",
          onChange:function(v){ user(); S.game.dev = v; msg = ""; save(); followF(true); render(); MV.changed(); } });
        if (hadDev) { var cb = box.querySelector('#xv-dev [aria-checked="true"]'); if (cb) cb.focus({ preventScroll:true }); }
      } else {
        box.innerHTML = '<div class="xv-panel"><p class="xv-sh">Long run</p><div id="xv-src"></div><div id="xv-plays"></div>' + swHTML("xv-rep", "Repeatable run (seeded)", S.lr.rep) +
          '<button type="button" class="btn ghost sm" id="xv-new" data-k="xvnew">New run</button><p class="tiny muted" id="xv-lrt"></p></div>';
        srcR = radios($("#xv-src", box), { label:"Simulate", options:[{ id:"bal", t:"Balance distribution" }, { id:"game", t:"Game: net gain" }], value:S.lr.src, cls:"chips",
          onChange:function(v){ user(); S.lr.src = v; fxCur = null; save(); render(); MV.changed(); } });
        playsR = radios($("#xv-plays", box), { label:"Plays", options:[10, 100, 1000, 10000].map(function(n){ return { id:n, t:MV.mdm.fmt(n) }; }), value:S.lr.n, cls:"chips",
          onChange:function(v){ user(); runTo(+v); } });
      }
    }
    if (S.mode === "bal") {
      preR.set(S.bal.preset || "");
      var rows = S.bal.rows, bb = $("#xv-brows", box);
      MV.keepFocus(bb, function(){
        bb.innerHTML = rows.map(function(r, i){
          var pt = fTxt(F.of(r.u, U)), xs = mi(r.x);
          return '<div class="xv-row"><span class="xv-rl">Value</span><button type="button" class="btn ghost sm xv-stb" data-bx="' + i + '|-1" data-k="xvbx' + i + 'm" aria-label="Value ' + (i + 1) + ' down"' + (canStepX(i, -1) ? "" : " disabled") + '>−</button><output class="xv-ov">' + xs + '</output><button type="button" class="btn ghost sm xv-stb" data-bx="' + i + '|1" data-k="xvbx' + i + 'p" aria-label="Value ' + (i + 1) + ' up"' + (canStepX(i, 1) ? "" : " disabled") + ">+</button>" +
            '<span class="xv-rl">' + M("P") + '</span><button type="button" class="btn ghost sm xv-stb" data-bp="' + i + '|-1" data-k="xvbp' + i + 'm" aria-label="Probability of ' + xs + ' down 0.05"' + (r.lock || r.u <= 0 ? " disabled" : "") + '>−</button><output class="xv-ov xv-op">' + mi(pt) + '</output><button type="button" class="btn ghost sm xv-stb" data-bp="' + i + '|1" data-k="xvbp' + i + 'p" aria-label="Probability of ' + xs + ' up 0.05"' + (r.lock || r.u >= U ? " disabled" : "") + ">+</button>" +
            '<button type="button" class="btn ghost sm xv-lock" data-bl="' + i + '" data-k="xvbl' + i + '" aria-pressed="' + r.lock + '" aria-label="Lock the probability of ' + xs + '">' + (r.lock ? "Locked" : "Lock") + "</button></div>";
        }).join("") + '<div class="q-actions"><button type="button" class="btn ghost sm" data-brow="1" data-k="xvadd"' + (rows.length >= 6 ? " disabled" : "") + '>Add a value</button><button type="button" class="btn ghost sm" data-brow="-1" data-k="xvdel"' + (rows.length <= 1 ? " disabled" : "") + ">Remove the last value</button></div>";
      });
    } else if (S.mode === "game") {
      devR.set(S.game.dev);
      var ci = $("#xv-cost-in", box); if (document.activeElement !== ci) ci.value = (S.game.cost[S.game.dev] / 100).toFixed(2);
      box.querySelector('[data-cost="-1"]').disabled = S.game.cost[S.game.dev] <= 0; box.querySelector('[data-cost="1"]').disabled = S.game.cost[S.game.dev] >= 1000;
      if (!DEV[S.game.dev].fixed) S.game.prizes[S.game.dev].forEach(function(c, k){
        var inp = $("#xv-pz" + k, box); if (document.activeElement !== inp) inp.value = (c / 100).toFixed(2);
        box.querySelector('[data-pzs="' + k + '|-1"]').disabled = c <= 0; box.querySelector('[data-pzs="' + k + '|1"]').disabled = c >= 50000;
      });
    } else {
      srcR.set(S.lr.src); playsR.set(S.lr.n); playsR.lock(!!anim || sim().busy());
      $("#xv-rep", box).setAttribute("aria-checked", String(S.lr.rep)); $("#xv-new", box).hidden = S.lr.rep;
      var s = simReady();
      $("#xv-lrt", box).innerHTML = (s.seq.length ? MV.mdm.fmt(s.seq.length) + " plays simulated. " : "Choose a number of plays to start. ") + (S.lr.rep ? "Repeatable: the same settings give the same run on any device." : "Each new run uses a new (recorded) seed.");
    }
  }
  function ticksOf(d){
    var t = d.rows.map(function(r){ return { x:r.x, t:d.money ? dN(r.x, 2) : mi(r.x), w:1 + r.p }; });
    if (d.money && !d.rows.some(function(r){ return r.x === 0; })) t.push({ x:0, t:"0", w:0.5 });
    return t;
  }
  function rangeOf(d){
    var xs = d.rows.map(function(r){ return r.x; }), lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs);
    if (d.money) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); var pad = Math.max(1, (hi - lo) * 0.08); return [lo - pad, hi + pad]; }
    lo -= 1; hi += 1; if (hi - lo < 6) { var c = (hi + lo) / 2; lo = c - 3; hi = c + 3; }
    return [lo, hi];
  }
  function eTxt(d, plain){ return d.money ? money(d.E, true) : dN(d.E, 2); }
  function nw(h){ return '<span class="xv-nw">' + h + "</span>"; }
  function eApprox(d){ return !F.exactDec(d.Ef, 2); }
  function paintChart(){
    var d = cur(), rg = rangeOf(d), mx = 0, hide = !!pv.hide, s = S.mode === "long" ? simReady() : null;
    d.rows.forEach(function(r){ mx = Math.max(mx, r.p); });
    var showF = S.show.f && !hide && fxCur != null, Etxt = (eApprox(d) ? "E ≈ " : "E = ") + eTxt(d);
    var bars = d.rows.map(function(r){ return { x:r.x, p:r.p, lab:fTxt(r.f), i:r.i }; });
    var avg = s && s.seq.length ? s.sum / s.seq.length : null;
    var desc = "Probability histogram " + (d.money ? "of the net gain " : "") + "on a seesaw: " + d.rows.filter(function(r){ return r.p > 0; }).map(function(r){ return (d.money ? money(r.x) : mi(r.x)) + " with probability " + MV.plain(fTxt(r.f)); }).join(", ") + ". " +
      (hide ? "The balance point is hidden until the reveal." : showF ? (Math.abs(d.E - fxCur) < 1e-6 ? "The histogram balances at " + eTxt(d) + "." : "The fulcrum is at " + (d.money ? money(fxCur, true) : dN(fxCur, 2)) + "; the beam tips toward " + (d.E > fxCur ? "the right." : "the left.")) : "The fulcrum is hidden.") +
      (avg != null ? " Running average after " + s.seq.length + " plays: " + (d.money ? money(avg, true) : dN(avg, 2)) + "." : "");
    drawSeesaw(plot, { bars:bars, x0:rg[0], x1:rg[1], ymax:niceYmax(mx), fx:showF ? fxCur : null, E:d.E, fLab:showF ? Etxt : "",
      modes:S.show.mode && !hide ? modesOf(d.rows) : null, median:S.show.med && !hide ? medianOf(d.rows) : null, avg:avg,
      ticks:ticksOf(d), xLabel:d.money ? "net gain ($)" : "x", knobs:S.mode === "bal", describe:desc });
  }
  function paintLR(){
    if (S.mode !== "long") return;
    var d = cur(), s = simReady(), xs = d.rows.map(function(r){ return r.x; }), lo = Math.min.apply(null, xs.concat([d.E])), hi = Math.max.apply(null, xs.concat([d.E]));
    if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
    var pts = avgPts(s.seq), hide = !!pv.hide;
    drawRunAvg(lrPlot, { pts:pts, E:hide ? null : d.E, eLab:(eApprox(d) ? "E ≈ " : "E = ") + eTxt(d), lo:lo, hi:hi, fmt:d.money ? function(v){ return money(v); } : dN, yLabel:d.money ? "running average net gain ($)" : "running average of X",
      describe:"Running average against the number of plays on a log scale" + (s.seq.length ? ": after " + s.seq.length + " plays it is " + (d.money ? money(s.sum / s.seq.length, true) : dN(s.sum / s.seq.length, 2)) : ": no plays yet") + (hide ? "." : "; the dashed line marks E = " + eTxt(d) + ".") });
  }
  function paintRead(){
    var d = cur(), hide = !!pv.hide || !!pv.hideRead, Q = '<span class="xv-q">?</span>', rows = [], s = S.mode === "long" ? simReady() : null;
    var terms = d.rows.filter(function(r){ return r.f.n !== 0 && r.xf.n !== 0; }).map(function(r){ return F.mul(r.xf, r.f); });
    var sumTxt = terms.length && terms.length <= 6 ? terms.map(function(t, k){ var tx = F.txt(t); return k === 0 ? tx : (t.n < 0 ? " − " + tx.replace(MV.MINUS, "") : " + " + tx); }).join("") + " = " : "";
    var exactBtn = '<button type="button" class="btn ghost sm xv-ex" data-k="xvexact" aria-pressed="' + S.exact + '">' + (S.exact ? "Hide exact" : "Exact") + "</button>";
    var eVal = hide ? Q : (S.exact ? M(sumTxt + F.txt(d.Ef)) + (eApprox(d) ? " ≈ " + eTxt(d) : d.money ? " = " + eTxt(d) : "") : (eApprox(d) ? "≈ " : "") + "<strong>" + eTxt(d) + "</strong>") + " " + exactBtn;
    if (!d.money) {
      rows.push([M("E(X) = Σ xP(x)"), eVal]);
      var md = modesOf(d.rows), live = d.rows.filter(function(r){ return r.p > 0; });
      rows.push(["Most likely value", hide ? Q : md.length === live.length && md.length > 1 ? "none: all " + md.length + " values are equally likely" : md.map(mi).join(" and ") + (md.length > 1 ? " (a tie)" : "")]);
      var me = medianOf(d.rows); rows.push(["Median", hide ? Q : me == null ? "—" : dN(me, 2)]);
      rows.push(["Sum of probabilities", "1 ✓"]);
    } else {
      rows.push([M("E") + "(net gain)", eVal]);
      var v = F.cmp(d.Ef, F.of(0, 1)), vt = v === 0 ? "Fair" : v < 0 ? "Favours the host" : "Favours the player";
      rows.push(["Verdict", hide ? Q : '<span class="xv-verdict xv-v' + (v === 0 ? "0" : v < 0 ? "h" : "p") + '">' + (v === 0 ? "✓ " : "") + vt + "</span>"]);
      var md2 = modesOf(d.rows); rows.push(["Most likely value", hide ? Q : md2.map(function(x){ return money(x); }).join(" and ")]);
      rows.push([S.game.dev === "raffle" ? "Fair ticket price" : "Fair price", hide ? Q : money(d.prize, true) + ' <span class="tiny muted">(the expected prize' + (F.exactDec(d.prizeF, 2) ? "" : " ≈ " + M(F.txt(d.prizeF))) + ")</span>"]);
      if (kind() === "game" && S.game.dev === "raffle") rows.push(["At the actual price of $5", hide ? Q : M("E") + "(net) = " + money(d.prize - 5, true) + " per ticket" + (d.prize < 5 ? ' <span class="tiny muted">(the charity’s share)</span>' : "")]);
    }
    if (s) rows.push(["Running average", s.seq.length ? "<strong>" + (d.money ? money(s.sum / s.seq.length, true) : dN(s.sum / s.seq.length, 2)) + "</strong> after " + MV.mdm.fmt(s.seq.length) + " plays" : '<span class="muted">Simulate first.</span>']);
    var rd = $("#xv-read", host); MV.keepFocus(rd, function(){ rd.innerHTML = MV.readoutHTML(rows); });
    // the table: x, P(x), x P(x) with a Σ row
    var head = [d.money ? "Net gain " + M("x") + " ($)" : M("x"), M("P(x)"), M("xP(x)")];
    var trs = d.rows.map(function(r){ return [d.money ? dN(r.x, 2) : mi(r.x), M(fTxt(r.f)), hide ? "?" : M(fTxt(F.mul(r.xf, r.f)))]; });
    trs.push(["<strong>Σ</strong>", "1", hide ? "?" : "<strong>" + M(fTxt(d.Ef)) + "</strong>"]);
    var th = MV.tableHTML({ head:head, rows:trs, caption:d.money ? "Net-gain distribution" : "Distribution table" });
    $("#xv-tbl", host).innerHTML = th; $("#xv-tbl2", host).innerHTML = th;
  }
  function paintCap(){
    var d = cur(), c = $("#xv-cap", host), hide = !!pv.hide || !!pv.hideRead;
    c.innerHTML = (d.money ? M("E") + "(net gain)" : M("E(X)")) + (hide ? " = ?" : (eApprox(d) ? " ≈ " : " = ") + eTxt(d));
  }
  function paintAha(){
    var a = $("#xv-aha", host), d = cur(), t = "";
    if (!pv.hide && !pv.hideRead) {
      if (S.mode === "long") { var s = simReady(); t = s.seq.length >= 1000 ? "The running average homes in on " + M("E") + ": it wobbles early, then settles near " + nw(eTxt(d)) + "." : "Simulate more plays: the running average wobbles early, then settles near " + M("E") + "."; }
      else if (d.money) { var v = F.cmp(d.Ef, F.of(0, 1)); t = v === 0 ? "Fair: " + M("E") + "(net) = 0, so the histogram balances at 0." : "Fair means " + M("E") + "(net) = 0. This game balances at " + nw(eTxt(d)) + ", so it favours the " + (v < 0 ? "host." : "player."); }
      else {
        var live = d.rows.filter(function(r){ return r.p > 0; }), possible = live.some(function(r){ return Math.abs(r.x - d.E) < 1e-9; });
        var mid = live.length ? (live[0].x + live[live.length - 1].x) / 2 : 0;
        t = !possible ? M("E(X)") + " = " + eTxt(d) + " isn’t a possible value: it’s the balance point and the long-run average." :
          Math.abs(mid - d.E) > 1e-9 ? "The fulcrum sits at the weighted average (" + eTxt(d) + "), not the middle of the values (" + dN(mid, 2) + ")." : "The fulcrum sits at the weighted average of the values.";
      }
    }
    a.innerHTML = t; a.hidden = !t;
  }

  // --- drag knobs on the bar tops (Balance mode) ---
  var drag = MV.drag(plot, { axis:"y", step:{ x:1, y:0.05 },
    handles:function(){
      var g = plot._ss; if (S.mode !== "bal" || !g || anim) return [];
      var d = balDist(S.bal), mx = 0; d.rows.forEach(function(r){ mx = Math.max(mx, r.p); });
      return d.rows.map(function(r){ var q = g.rot(g.X(r.x), g.base - Math.min(r.p, niceYmax(mx)) * g.hs); return { id:"h" + r.i, x:q[0], y:g.H - q[1], label:"Probability of X = " + r.x + ": " + MV.plain(fTxt(r.f)) + (S.bal.rows[r.i].lock ? " (locked)" : "") + ". Arrow keys change it by 0.05; Shift + arrow by 0.1." }; });
    },
    key:function(id, e){
      var i = +id.slice(1), dir = (e.key === "ArrowUp" || e.key === "ArrowRight") ? 1 : (e.key === "ArrowDown" || e.key === "ArrowLeft") ? -1 : 0;
      if (!dir) return false; nudge(i, dir, e.shiftKey); return true;
    },
    move:function(id, x, y, how){
      if (how !== "drag") return;
      var g = plot._ss; if (!g) return;
      var i = +id.slice(1), r = S.bal.rows[i]; if (!r) return;
      if (r.lock) { msg = "That value is locked. Unlock it to change its probability."; paintMsg(); return; }
      var px = x, py = g.H - y, dx = px - g.cx, dy = py - g.cy, cs = Math.cos(-g.th), sn = Math.sin(-g.th), ly = g.cy + sn * dx + cs * dy;
      var mx = 0; S.bal.rows.forEach(function(q){ mx = Math.max(mx, q.u / U); });
      var p = (g.base - ly) / g.hs, u = clamp(Math.round(p * U / G) * G, 0, U);
      if (u === r.u) return;
      if (anim) cancelAnim();
      pv = {};
      if (setU(i, u)) after(); else paintMsg();
    } });

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg")) return;
    if (b.id === "xv-sf" || b.id === "xv-sm" || b.id === "xv-sd") { var k = { "xv-sf":"f", "xv-sm":"mode", "xv-sd":"med" }[b.id]; S.show[k] = !S.show[k]; if (k === "f") fxCur = cur().E; save(); render(); return; }
    if (b.dataset.k === "xvexact") { S.exact = !S.exact; save(); paintRead(); return; }
    if (b.id === "xv-rep") { user(); S.lr.rep = !S.lr.rep; S.lr.n = 0; save(); render(); return; }
    if (b.id === "xv-new") { user(); S.lr.runs++; var n = S.lr.n || 1000; S.lr.n = 0; save(); render(); runTo(n); return; }
    if (b.dataset.bp) { var q = b.dataset.bp.split("|"); nudge(+q[0], +q[1], false); return; }
    if (b.dataset.bx) { var q2 = b.dataset.bx.split("|"); stepX(+q2[0], +q2[1]); return; }
    if (b.dataset.bl) { user(); var r = S.bal.rows[+b.dataset.bl]; r.lock = !r.lock; msg = ""; save(); render(); return; }
    if (b.dataset.brow) {
      user(); var rows = S.bal.rows;
      if (b.dataset.brow === "1" && rows.length < 6) {
        var used = {}; rows.forEach(function(q3){ used[q3.x] = 1; }); var mxx = Math.max.apply(null, rows.map(function(q3){ return q3.x; })), nx = mxx + 1;
        if (nx > 20) { nx = Math.min.apply(null, rows.map(function(q3){ return q3.x; })) - 1; } if (nx < -20 || used[nx]) return;
        rows.push({ x:nx, u:0, lock:false }); msg = "The new value starts with probability 0. Raise it to give it weight.";
      } else if (b.dataset.brow === "-1" && rows.length > 1) {
        var gone = rows.pop(), fr = rows.filter(function(q3){ return !q3.lock; }), tgt = fr.length ? fr : rows, tot = tgt.reduce(function(a, q3){ return a + q3.u; }, 0);
        if (gone.u) { var give = gone.u, k2; if (tot > 0) { var parts = tgt.map(function(q3){ return Math.floor(give * q3.u / tot); }), left = give - parts.reduce(function(a, c){ return a + c; }, 0); for (k2 = 0; k2 < tgt.length; k2++) tgt[k2].u += parts[k2] + (k2 < left ? 1 : 0); } else tgt[0].u += give; }
        msg = "";
      }
      S.bal.preset = ""; after(); return;
    }
    if (b.dataset.cost) { user(); var dv = S.game.dev, st = costStep(dv); S.game.cost[dv] = clamp(Math.round((S.game.cost[dv] + st * (+b.dataset.cost)) / st) * st, 0, 1000); after(); return; }
    if (b.dataset.pzs) { user(); var q4 = b.dataset.pzs.split("|"), a = S.game.prizes[S.game.dev]; a[+q4[0]] = clamp(Math.round((a[+q4[0]] + 50 * (+q4[1])) / 50) * 50, 0, 50000); after(); return; }
  });
  function readMoney(raw, step, max){ var s = String(raw).replace(/\$/g, "").replace(/\s+/g, ""); if (!/^\d*\.?\d*$/.test(s) || s === "" || s === ".") return null; var c = Math.round(parseFloat(s) * 100 / step) * step; return clamp(c, 0, max); }
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "xv-cost-in") { var dv = S.game.dev, c = readMoney(t.value, S.game.dev === "raffle" ? 1 : 50, 1000); if (c == null) return; if (anim) cancelAnim(); S.game.cost[dv] = c; save(); followF(false); paintChart(); paintRead(); paintCap(); paintAha(); MV.changed(); return; }
    if (t.dataset.pz != null) { var c2 = readMoney(t.value, 50, 50000); if (c2 == null) return; if (anim) cancelAnim(); S.game.prizes[S.game.dev][+t.dataset.pz] = c2; save(); followF(false); paintChart(); paintRead(); paintCap(); paintAha(); MV.changed(); }
  });
  host.addEventListener("change", function(e){
    var t = e.target;
    if (t.id === "xv-cost-in") t.value = (S.game.cost[S.game.dev] / 100).toFixed(2);
    else if (t.dataset.pz != null) t.value = (S.game.prizes[S.game.dev][+t.dataset.pz] / 100).toFixed(2);
    else return;
    render();
  });

  render();

  // --- predictions ---
  function setGameP3(){ S.game.dev = "die"; S.game.cost.die = 200; S.game.prizes.die = [0, 0, 0, 0, 0, 1000]; }
  function startPred(p){
    cancelAnim(); stopF(); msg = "";
    var st = p.start || {};
    if (st.mode === "bal") { S.mode = "bal"; applyPreset(st.preset); }
    else { setGameP3(); if (st.mode === "long") { S.mode = "long"; S.lr.src = "game"; S.lr.rep = true; } else S.mode = "game"; }
    S.show.f = true; pv = { hide:true }; fxCur = null;
    save(); render();
    if (S.mode === "long") { S.lr.n = 0; sim().reset(); save(); render(); }
  }
  function runPred(p, done){
    var d = cur();
    if (p.id === "p4") {
      newAnim(done);
      later(150, function(){ runTo(10000, MV.reduceMotion ? 1 : 110, function(){ later(500, function(){ pv = {}; fxCur = null; render(); MV.changed(); later(200, endAnim); }); }); });
      return;
    }
    newAnim(done);
    var live = d.rows.filter(function(r){ return r.p > 0; }), from = p.id === "p1" ? live[0].x : p.id === "p2" ? (live[0].x + live[live.length - 1].x) / 2 : 0;
    pv = { manualF:true, hideRead:true }; fxCur = from; render();
    later(MV.reduceMotion ? 0 : 900, function(){
      var stop = MV.tween({ dur:1300, step:function(t){ fxCur = from + (d.E - from) * t; paintChart(); }, done:function(){
        fxCur = d.E; pv = {}; render(); MV.changed(); later(300, endAnim);
      } });
      anim.stops.push(stop);
    });
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (id === "tc1") {
      if (S.mode !== "game") return R("Use <strong>Game designer</strong> mode.");
      if (S.game.dev !== "die") return R("Choose the <strong>Die</strong>.");
      if (S.game.cost.die !== 200) return R("Keep the cost to play at $2.");
      var pz = S.game.prizes.die;
      if (pz.slice(0, 5).some(function(v){ return v !== 0; })) return R("Other faces pay $0: set faces 1 to 5 to $0.");
      var p6 = pz[5];
      if (p6 === 1200) return { ok:true };
      if (p6 === 1000) return R("`E`(net) = −$0.33. The prize must cover the $2 cost <strong>six</strong> times over: 6 × 2.");
      if (p6 === 200) return R("That only refunds the cost on a 6.");
      if (p6 === 800) return R("That’s the net gain you want, not the prize. With an $8 prize, `E = 8/6 - 2 < 0`.");
      var E1 = gameDist(S.game).E;
      return R("`E`(net) = " + money(E1, true) + ", not 0: " + (E1 < 0 ? "the game favours the host." : "the game favours the player."));
    }
    if (id === "tc2") {
      if (S.mode !== "bal") return R("Use <strong>Balance</strong> mode.");
      var d = balDist(S.bal), xs = d.rows.map(function(r){ return r.x; }).join(",");
      if (xs !== "1,2,3,4") return R("Use the values 1, 2, 3 and 4, one each. (<strong>Values 1–4</strong> sets them up.)");
      var us = d.rows.map(function(r){ return S.bal.rows[r.i].u; });
      if (us.some(function(u){ return u % 24; })) return R("Use probabilities in steps of 0.1.");
      if (us.some(function(u){ return u === 0; })) return R("None of the probabilities can be 0.");
      if (us[3] !== 96) return R("`P(X = 4)` = " + dN(us[3] / U, 2) + ", not 0.4.");
      var key = us.join(",");
      if (key === "24,48,72,96") return { ok:true };
      if (key === "48,48,48,96") return R("`E` = 2.8. Shift weight toward 3.");
      if (key === "24,24,96,96") return R("`E` = 3.1.");
      return R("`E(X)` = " + dN(d.E, 2) + ", not 3.");
    }
    if (id === "tc3") {
      if (S.mode !== "game" || S.game.dev !== "raffle") return R("Use <strong>Game designer</strong> with the <strong>Charity raffle</strong>.");
      var c = S.game.cost.raffle;
      if (c === 160) return { ok:true };
      if (c === 100) return R("That counts only the $500 prize.");
      if (c >= 120 && c <= 130) return R("(500 + 100 + 20) ÷ 500 counts each prize once. Count each as many times as it’s offered: 500 + 2 × 100 + 5 × 20 = 800.");
      if (c === 500) return R("At $5, `E`(net) = 1.60 − 5 < 0.");
      return R("At " + money(c / 100, true) + ", `E`(net) = " + money(1.6 - c / 100, true) + ", not 0.");
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: a fair die on a seesaw; the fulcrum slides to 3.5; the 6 bar grows; the fulcrum slides to 4 ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "";
  var st = { g:0, fx:1, cap:"" };
  function ps(){ var six = 1 / 6 + (1 / 3 - 1 / 6) * st.g, o = (1 - six) / 5; return [o, o, o, o, o, six]; }
  function E(){ var p = ps(), e = 0; p.forEach(function(v, i){ e += (i + 1) * v; }); return e; }
  plot.render = function(){
    var p = ps(), e = E(), lab = Math.abs(st.fx - e) < 1e-6 ? "E = " + dN(e, 2) : "";
    drawSeesaw(plot, { bars:p.map(function(v, i){ return { x:i + 1, p:v, lab:st.g === 0 ? "1/6" : st.g === 1 ? (i === 5 ? "1/3" : "2/15") : "" }; }), x0:0, x1:7, ymax:0.4, fx:st.fx, E:e, fLab:lab || "fulcrum",
      ticks:[1, 2, 3, 4, 5, 6].map(function(x){ return { x:x, t:String(x), w:1 }; }), xLabel:"x", describe:aria });
    if (st.cap) { var ctx = plot.ctx; ctx.save(); ctx.font = "700 16px " + plot.fontUI; ctx.fillStyle = css("--ink"); ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(st.cap, plot.W - 10, 8); ctx.restore(); }
  };
  var cap = f.cap;
  function last(){ st = { g:1, fx:4, cap:"Balance point = expected value" }; plot.render(); cap.textContent = "Balance point = expected value: E(X) = 4 once the 6 is more likely (it was 3.5 for a fair die)."; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "A fair die’s probability histogram on a seesaw";
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  MV.wait(700, function(){
    cap.textContent = "The fulcrum slides to 3.5 and the seesaw levels";
    tw(1500, function(t){ st.fx = 1 + 2.5 * t; plot.render(); }, function(){
      MV.wait(1000, function(){
        cap.textContent = "6 becomes more likely: the seesaw tips";
        tw(900, function(t){ st.g = t; plot.render(); }, function(){
          MV.wait(700, function(){
            cap.textContent = "The fulcrum slides right to restore balance";
            tw(1100, function(t){ st.fx = 3.5 + 0.5 * t; plot.render(); }, function(){ MV.wait(500, last); });
          });
        });
      });
    });
  });
}

// ---------- Part 3: Is it worth it? (three decision stations) ----------
// @component N4 moneyEntry — number entry for amounts and expected values (adapted from MDM4U 18's N4 probEntry / 02's
// countEntry): accepts $, signs, fractions and decimals ("−$0.33", "-1/3", "+5", "2.50"); tol is absolute (default 1e-6);
// named wrong answers {match, fb}; an optional choice row (pick:[{t, ok, why}], read with MV.ok) that must also be right;
// first try = right on the first check without the worked solution. moneyEntry(host, api, a) is the practice activity;
// meJudge / meParse serve Part 3 too.
function meParse(raw){
  var s = String(raw == null ? "" : raw).replace(/\$/g, "").replace(/[\s  ]/g, "").replace(/,(?=\d{3}\b)/g, "").replace(/^\+/, "");
  if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null;
}
function meJudge(it, raw, pick){
  var v = meParse(raw), ans = MV.ans(it), tol = it.tol || 1e-6 * Math.max(1, Math.abs(ans));
  if (it.pick && pick == null) return { bad:"Choose an answer for “" + MV.plain(it.pickLabel || "the choice") + "” as well." };
  if (v == null) return { bad:"Enter a number, such as 2.5, 7/2 or −$0.33." };
  var numOk = Math.abs(v - ans) <= tol, pickOk = !it.pick || MV.ok(it.pick[pick]);
  if (numOk && pickOk) return { ok:true };
  var fb = [];
  if (!pickOk) fb.push(it.pick[pick].why || "Check your choice.");
  if (!numOk) { var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) <= Math.max(tol, 1e-6); })[0]; fb.push(w ? w.fb : it.general || "Check your work."); }
  return { ok:false, fb:fb.join(" ") };
}
function moneyEntry(host, api, a){
  var st = api.S; st.items = obj(st.items);
  var msgs = {};
  function ist(id){ var x = st.items[id] = obj(st.items[id]); x.val = typeof x.val === "string" ? x.val : ""; x.tries = x.tries || 0; x.hint = x.hint || 0; return x; }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-me="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        if (it.pick) h += '<div class="xv-pick" role="radiogroup" aria-label="' + MV.esc(MV.plain(it.pickLabel || "Choose")) + '"><span class="rg-lab">' + (it.pickLabel || "Choose:") + "</span>" + it.pick.map(function(o, k){
          return '<button type="button" role="radio" class="xv-pk" aria-checked="' + (x.pick === k) + '" data-pk="' + k + '" data-k="' + it.id + "pk" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
        h += '<div class="numrow"><label for="me-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="me-' + it.id + '" data-mein="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.mein; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.mein) { var b = host.querySelector('[data-k="' + e.target.dataset.mein + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-me]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.me; })[0], x = ist(it.id);
    if (b.dataset.pk != null) { x.pick = +b.dataset.pk; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = meJudge(it, x.val, x.pick);
      if (r.bad) { msgs[it.id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-me="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-me="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.items = obj(S.items); S.s1 = obj(S.s1); S.s1.rc = clampI(S.s1.rc, 0, 30, 10); S.s2 = obj(S.s2); S.s2.n = S.s2.n === 1000 ? 1000 : 0;
  var msgs = {}, tabsR = null, insPlot = null, ins = makeSim({ seed:SEED2, trial:function(g){ return g() < 0.08 ? 90 - 800 : 90; } });
  ins.fill(S.s2.n);
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function allItems(){ var L = []; ST.forEach(function(s){ (s.items || []).forEach(function(it){ L.push(it); }); (s.cards || []).forEach(function(c){ L.push(c); }); }); return L; }
  function ist(id){ var x = S.items[id] = obj(S.items[id]); x.val = typeof x.val === "string" ? x.val : ""; x.tries = x.tries || 0; return x; }
  function done(s){ return (s.items || []).concat(s.cards || []).every(function(it){ return ist(it.id).solved; }); }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.title + (done(s) ? ' <span class="xv-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="wi-tabs" class="wi-tabs"></div><div id="wi-body" class="wi-body"></div>';
  tabText();
  tabsR = radios($("#wi-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function retab(){ tabText(); tabsR.refresh(); }

  function itemHTML(it){
    var x = ist(it.id), h = '<div class="wi-item" data-wi="' + it.id + '"><div class="numrow"><label for="wi-' + it.id + '">' + it.label + '</label><input class="numin" id="wi-' + it.id + '" data-wiin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" +
      (x.solved ? "" : '<button type="button" class="btn primary sm" data-wichk="' + it.id + '" data-k="wi' + it.id + 'chk">Check</button>') + "</div>";
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    return h + "</div>";
  }
  function s1Dyn(){
    var p = S.s1.rc / 100, E = 300 * p + 25, gap = E - 60;
    return { read:MV.readoutHTML([["Expected cost without the warranty", M(dN(p, 2) + " × 300 + 0.05 × 500") + " = <strong>" + money(E, true) + "</strong>"],
        ["Verdict (on expected cost alone)", '<span class="xv-verdict xv-v' + (Math.abs(gap) < 1e-9 ? "0" : gap < 0 ? "h" : "p") + '">' + (Math.abs(gap) < 1e-9 ? "Break even" : gap < 0 ? "Skip the warranty: it costs " + money(-gap, true) + " more on average" : "Buy the warranty: it saves " + money(gap, true) + " on average") + "</span>"]]),
      tbl:MV.tableHTML({ head:["Outcome", "Cost", "Probability", "Cost × probability"], caption:"Expected cost without the warranty",
        rows:[["No repair", "$0", dN(0.95 - p, 2), "$0"], ["Repair", "$300", dN(p, 2), money(300 * p, true)], ["Replacement", "$500", "0.05", "$25.00"], ["<strong>Total</strong>", "", "1", "<strong>" + money(E, true) + "</strong>"]] }) };
  }
  function s1Upd(){
    var r = $("#wi-s1r", host), t = $("#wi-s1t", host), o = $("#wi-rc-out", host), sl = $("#wi-rc", host); if (!r) return;
    var dy = s1Dyn(); r.innerHTML = dy.read; t.innerHTML = dy.tbl; o.textContent = S.s1.rc + "%"; sl.setAttribute("aria-valuetext", S.s1.rc + " percent");
  }
  function s1HTML(s){
    var h = '<p class="wi-text">' + s.text + ' <span class="mdm-model">model numbers</span></p>' + s.items.map(itemHTML).join("");
    if (done(s)) {
      var dy = s1Dyn();
      h += '<p class="wi-after">' + s.after + "</p>" +
        '<label class="slider wi-sl"><span class="slider-top"><span>Chance of a $300 repair</span><output id="wi-rc-out">' + S.s1.rc + '%</output></span><input type="range" id="wi-rc" min="0" max="30" step="1" value="' + S.s1.rc + '" aria-valuetext="' + S.s1.rc + ' percent"></label>' +
        '<dl class="read" id="wi-s1r" aria-live="polite">' + dy.read + "</dl>" +
        '<details class="alg"><summary>Check it with data</summary><div id="wi-s1t">' + dy.tbl + "</div>" +
        '<p class="tiny muted">Compare the total with the $60 warranty. The verdict ignores risk: one $500 bill may matter more to you than the average.</p></details>';
    }
    return h;
  }
  function s2HTML(s){
    var h = '<p class="wi-text">' + s.text + ' <span class="mdm-model">model</span></p>' + s.items.map(itemHTML).join("");
    if (done(s)) {
      var n = ins.seq.length;
      h += '<p class="wi-after">' + s.after + "</p>" +
        '<details class="alg" id="wi-s2d"' + (S.s2.open ? " open" : "") + '><summary>Check it with data</summary><p class="tiny">1000 model policies, each with an 8% chance of an $800 claim. The run is seeded, so it repeats exactly.</p>' +
        '<div class="q-actions"><button type="button" class="btn sm" id="wi-sim" data-k="wisim"' + (ins.busy() || n >= 1000 ? " disabled" : "") + ">Simulate 1000 policies</button></div>" +
        '<canvas class="plot wi-plot" id="wi-plot" role="img" aria-label="Average profit per policy"></canvas>' +
        '<dl class="read" id="wi-s2r" aria-live="polite"></dl></details>';
    }
    return h;
  }
  function s2Read(){
    var el = $("#wi-s2r", host); if (!el) return;
    var n = ins.seq.length, claims = 0; ins.seq.forEach(function(v){ if (v < 0) claims++; });
    el.innerHTML = MV.readoutHTML([["Policies", n ? MV.mdm.fmt(n) : '<span class="muted">none yet</span>'], ["Claims", n ? MV.mdm.fmt(claims) + " (" + dN(100 * claims / n, 1) + "%)" : "—"],
      ["Premiums − payouts", n ? money(90 * n) + " − " + money(800 * claims) + " = <strong>" + money(ins.sum) + "</strong>" : "—"],
      ["Average profit per policy", n ? "<strong>" + money(ins.sum / n, true) + "</strong> (expected $26)" : "—"]]);
    if (insPlot) drawRunAvg(insPlot, { pts:avgPts(ins.seq), E:26, eLab:"E = $26", lo:-710, hi:90, fmt:function(v){ return money(v); }, dec:3, yLabel:"average profit per policy ($)",
      describe:"Average profit per policy against the number of policies on a log scale" + (n ? ": after " + n + " policies it is " + money(ins.sum / n, true) : "") + "; the dashed line marks the expected $26." });
  }
  function s3HTML(s){
    var h = '<p class="wi-text">' + s.text + "</p>";
    h += s.cards.map(function(c){
      var x = ist(c.id), fb = x.solved ? MV.fbHTML("good", "<strong>✓ " + MV.esc(s.bins.filter(function(b){ return b.id === MV.ans(c); })[0].t) + ".</strong> " + c.why + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : msgs[c.id] ? MV.fbHTML("bad", msgs[c.id]) : "";
      return '<div class="wi-card" data-wic="' + c.id + '"><p class="wi-quote">' + c.t + '</p><div class="wi-bins" role="group" aria-label="Who is making the call?">' + s.bins.map(function(b){
        return '<button type="button" class="btn ghost sm wi-bin" data-bin="' + b.id + '" data-k="wi' + c.id + b.id + '"' + (x.solved ? " disabled" : "") + (x.solved && MV.ans(c) === b.id ? ' aria-pressed="true"' : "") + ">" + b.t + "</button>"; }).join("") + "</div>" + fb + "</div>";
    }).join("");
    if (done(s)) h += '<p class="wi-after">' + s.after + "</p>";
    return h;
  }
  function paint(){
    retab();
    var s = st(S.cur), body = $("#wi-body", host), inner = s.id === "s1" ? s1HTML(s) : s.id === "s2" ? s2HTML(s) : s3HTML(s);
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="wi-card0"><span class="wi-lab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + "</span>" + inner + "</div>"; });
    insPlot = null;
    var cv = $("#wi-plot", host); if (cv) { insPlot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }); insPlot.render = s2Read; }
    s2Read();
  }
  function check(id){
    var it = allItems().filter(function(z){ return z.id === id; })[0], x = ist(id), r = meJudge(it, x.val);
    if (r.bad) { msgs[id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-wi="' + id + '"]')); return; }
    if (r.ok) { x.solved = true; x.first = x.tries === 0; msgs[id] = null; } else { x.tries++; msgs[id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-wi="' + id + '"]'));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.wichk) { check(b.dataset.wichk); return; }
    if (b.dataset.bin) {
      var cid = b.closest("[data-wic]").dataset.wic, c = st("s3").cards.filter(function(z){ return z.id === cid; })[0], x = ist(cid);
      if (MV.ans(c) === b.dataset.bin) { x.solved = true; x.first = x.tries === 0; msgs[cid] = null; } else { x.tries++; msgs[cid] = "<strong>✗ Not quite.</strong> " + c.wrong; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-wic="' + cid + '"]')); return;
    }
    if (b.id === "wi-sim") {
      S.s2.open = true; b.disabled = true;
      ins.to(1000, { frames:70, step:function(){ s2Read(); }, done:function(){ S.s2.n = 1000; api.save(); paint(); } });
    }
  });
  host.addEventListener("toggle", function(e){ if (e.target.id === "wi-s2d") { S.s2.open = e.target.open; api.save(); if (e.target.open) s2Read(); } }, true);
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.wiin) { ist(t.dataset.wiin).val = t.value; api.save(); return; }
    if (t.id === "wi-rc") { S.s1.rc = +t.value; api.save(); s1Upd(); }
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.wiin) { e.preventDefault(); check(e.target.dataset.wiin); } });
  paint();
  // the stations' first-try record joins the results summary (G4, and G6 through station 2's long-run check)
  MV.ACTS["worth-it"] = { a:{ id:"worth-it" },
    stats:function(){ var L = allItems(), f = 0, d = 0; L.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:L.length, done:d, line:"Is it worth it? stations (first try): " + f + "/" + L.length + (d < L.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; allItems().forEach(function(it){ var x = ist(it.id); if (x.tries > 0) g = g.concat(MV.goalIdx(it.goal)); }); return g; } };
  return {};
}
var SEED2 = 2003;   // 79 claims in 1000 model policies: a total profit of $26 800, close to the expected $26 000

// ---------- Performance task: Design a fair game ----------
var task = (function(){
  var api = null, PZ = [0, 2, 4, 6, 8, 10, 12], costR = null, secR = [], tw = null;
  function st(){ var s = api ? api.S : {}; s.c = clampI(s.c, 1, 5, 1); if (!Array.isArray(s.p) || s.p.length !== 4) s.p = [0, 0, 0, 0]; s.p = s.p.map(function(v){ return PZ.indexOf(+v) >= 0 ? +v : 0; }); return s; }
  function read(){ var s = st(); return { c:s.c, p:s.p.slice() }; }
  function key(d){ return d.c + "|" + d.p.slice().sort(function(a, b){ return b - a; }).join(","); }
  function lab(k){ var q = k.split("|"); return "$" + q[0] + ": {" + q[1].split(",").map(function(v){ return "$" + v; }).join(", ") + "}"; }
  function spinSVG(p){
    var h = "", pol = function(r, deg){ var a = (deg - 90) * Math.PI / 180; return [100 + r * Math.cos(a), 100 + r * Math.sin(a)]; };
    p.forEach(function(v, i){
      var a = pol(88, i * 90), b = pol(88, (i + 1) * 90), q = pol(56, i * 90 + 45);
      h += '<path class="xv-sec xv-sec' + i + '" d="M100 100L' + a[0].toFixed(1) + " " + a[1].toFixed(1) + "A88 88 0 0 1 " + b[0].toFixed(1) + " " + b[1].toFixed(1) + 'Z"/><text class="xv-st" x="' + q[0].toFixed(1) + '" y="' + q[1].toFixed(1) + '">$' + v + "</text>";
    });
    return '<svg class="xv-spin" viewBox="0 0 200 200" role="img" aria-label="Spinner with 4 equal sectors paying ' + p.map(function(v){ return "$" + v; }).join(", ") + '">' + h + '<circle cx="100" cy="100" r="88" class="xv-rim"/><circle cx="100" cy="100" r="6" class="xv-hub"/></svg>';
  }
  function paint(){
    var d = read(), pv = $("#fg-pv"); if (!pv) return;
    var nets = d.p.map(function(v){ return v - d.c; }), E = nets.reduce(function(a, b){ return a + b; }, 0) / 4, Ef = F.of(nets.reduce(function(a, b){ return a + b; }, 0), 4);
    var sim = api.S.sim && api.S.sim.key === key(d) + "|" + d.p.join(",") ? api.S.sim : null;
    var h = '<div class="fg-row"><div class="fg-spin">' + spinSVG(d.p) + "</div>" +
      '<div class="fg-tbl">' + MV.tableHTML({ head:["Sector", "Prize", "Net gain", M("P"), "Net × " + M("P")], caption:"Net-gain table",
        rows:d.p.map(function(v, i){ return [String(i + 1), "$" + v, money(nets[i], false, true), M("1/4"), M(F.txt(F.of(nets[i], 4)))]; }).concat([["<strong>Σ</strong>", "", "", "1", "<strong>" + M(F.txt(Ef)) + "</strong>"]]) }) + "</div></div>" +
      '<dl class="read" aria-live="polite">' + MV.readoutHTML([[M("E") + "(net gain)", "<strong>" + money(E, true) + "</strong> " + (E === 0 ? '<span class="xv-verdict xv-v0">✓ Fair</span>' : '<span class="xv-verdict xv-v' + (E < 0 ? "h" : "p") + '">' + (E < 0 ? "Favours the host" : "Favours the player") + "</span>")]]) + "</dl>" +
      '<div class="q-actions"><button type="button" class="btn sm" id="fg-sim" data-k="fgsim"' + (tw ? " disabled" : "") + ">Play 1000 times</button></div>" +
      '<p class="tiny" id="fg-simr" aria-live="polite">' + (tw ? "Playing… " + tw.n + " plays" : sim ? "1000 plays (seeded): average net gain " + money(sim.sum / 1000, true) + " per play; the player lost money on " + MV.mdm.fmt(sim.lose) + " of the 1000 spins." : "Simulate 1000 plays of your game (seeded, so it repeats).") + "</p>";
    MV.keepFocus(pv, function(){ pv.innerHTML = h; });
  }
  function play(){
    var d = read(); if (tw) return;
    var g = MV.mdm.seededRandom("mdm19-task-" + key(d) + "|" + d.p.join(",")), out = [], i;
    for (i = 0; i < 1000; i++) out.push(d.p[g.int(4)] - d.c);
    var fin = function(){ var sum = 0, lose = 0; out.forEach(function(v){ sum += v; if (v < 0) lose++; }); api.S.sim = { key:key(d) + "|" + d.p.join(","), sum:sum, lose:lose }; tw = null; api.save(); paint(); };
    if (MV.reduceMotion) { fin(); return; }
    tw = { n:0 }; paint();
    MV.tween({ dur:900, step:function(t){ if (!tw) return; tw.n = Math.round(1000 * t); var r = $("#fg-simr"); if (r) r.textContent = "Playing… " + tw.n + " plays"; }, done:fin });
  }
  return {
    render:function(inp, pvw, a){
      api = a; st();
      inp.innerHTML = '<div class="fg-in"><div id="fg-cost"></div>' + [0, 1, 2, 3].map(function(i){ return '<div id="fg-s' + i + '"></div>'; }).join("") + "</div>";
      pvw.innerHTML = '<div id="fg-pv" class="fg-pv"></div>';
      costR = radios($("#fg-cost"), { label:"Cost to play", options:[1, 2, 3, 4, 5].map(function(c){ return { id:c, t:"$" + c }; }), value:api.S.c, cls:"chips",
        onChange:function(v){ api.S.c = +v; api.save(); paint(); api.update(); } });
      secR = [0, 1, 2, 3].map(function(i){ return radios($("#fg-s" + i), { label:"Sector " + (i + 1) + " prize", options:PZ.map(function(v){ return { id:v, t:"$" + v }; }), value:api.S.p[i], cls:"chips",
        onChange:function(v){ api.S.p[i] = +v; api.save(); paint(); api.update(); } }); });
      $("#fg-pv").addEventListener("click", function(e){ var b = e.target.closest("#fg-sim"); if (b && !b.disabled) play(); });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var sum = d.p.reduce(function(x, y){ return x + y; }, 0), zeros = d.p.filter(function(v){ return v === 0; }).length, win = d.p.filter(function(v){ return v > d.c; }).length;
      return [sum === 4 * d.c, zeros >= 2, Math.max.apply(null, d.p) <= 12, win === 1];
    },
    key:key,
    label:function(k){ return lab(k); },
    text:function(k){ return lab(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ find:moneyEntry, decide:moneyEntry },
  task:task
});
})();
