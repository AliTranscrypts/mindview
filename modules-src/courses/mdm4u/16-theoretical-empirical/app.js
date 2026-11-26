// MDM4U 16 Theoretical & Empirical Probability: hero (a coin flipped 1000 times; the relative-frequency line settles at 0.5),
// Law of large numbers lab (Explore: D6 simulator with a coin, a die, two dice, a 12/15/18-sector spinner editor and a mystery
// spinner; single run on a log axis with a ±0.05 band, a differences view, a many-runs dot plot, seeded runs), Design a
// simulation (Part 3: three stations), Odds and evidence (custom number and ratio entry), Spinner designer task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;
function M(s){ return MV.m(s); }
function Pw(w){ return "<i>P</i>(" + w + ")"; }   // as content.mjs writes it: italic P, upright words
function clampInt(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function big(v){ return MV.mdm.fmt(v); }
function fix(v, dp){ var s = Math.abs(v).toFixed(dp); return (v < 0 && +s !== 0 ? MV.MINUS : "") + s; }
function signed(v, dp){ var s = fix(v, dp); return (v > 0 && +Math.abs(v).toFixed(dp) !== 0 ? "+" : "") + s; }
function ratioTxt(a, b){ var g = gcd(a, b) || 1; return (a / g) + " : " + (b / g); }
// a typed number: 0.3, .3, 3/10, 30%, +12, −0.04 (no expressions beyond what MV.parseNum reads)
function parseVal(raw){
  var s = String(raw == null ? "" : raw).trim().replace(/[\s  ]/g, ""), pct = /%$/.test(s);
  if (pct) s = s.slice(0, -1);
  if (!s) return null;
  var r = MV.parseNum(s); if (!r || r.length !== 1 || !isFinite(r[0])) return null;
  return pct ? r[0] / 100 : r[0];
}
var repaint = {};

// @component radioGroup (copied from MDM4U 13; setOptions(list) for option sets that change with other controls)
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)})
//   -> {set, get, lock, refresh, setOptions}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 && !off(val) ? val : ids.filter(function(id){ return !off(id); })[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + tab + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
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

// @component D6 simulator — copied from MDM4U 01 (makeSim + drawRelFreq) and extended for the law of large numbers lab.
// Every run is seeded (MV.mdm.seededRandom): sim.reset(seed) starts a run (a fixed seed for repeatable runs, a fresh one
// otherwise), so a run is restored exactly from {seed, n} with sim.fill(n). sim.run(n, {frames, step(sim), done(sim)}) adds n
// trials over ≤ 40 frames (instant with reduced motion); sim.add(n) adds n at once; sim.seq holds the outcomes; sim.stop(); sim.busy().
// lfStats(seq, hit, p) -> {n, h (successes), best (longest streak), rf / pd / cd: sampled [log10 n, value] points of the
//   relative frequency, the proportion difference and the count difference}.
// drawRelFreq(plot, {st, p, showTheory, pLabel, dec, describe}) running relative frequency (--pen) against trials on a log axis
//   (1 to 10^dec), the theoretical value as a dashed --ink line with a ±0.05 band (--hi-soft).
// drawDiff(plot, pts, {R, band, color, yTicks, describe}) a difference series on the same log axis around a dashed zero line.
function makeSim(o){
  var s = { seq:[], seed:o.seed, rng:null, raf:null };
  function stop(){ if (s.raf) cancelAnimationFrame(s.raf); s.raf = null; }
  function one(){ s.seq.push(o.trial(s.rng)); }
  s.reset = function(seed){ stop(); if (seed != null) s.seed = seed; s.seq = []; s.rng = MV.mdm.seededRandom(s.seed); };
  s.fill = function(n){ s.reset(); for (var i = 0; i < n; i++) one(); };
  s.add = function(n){ for (var i = 0; i < n; i++) one(); };
  s.run = function(n, cb){
    stop(); cb = cb || {};
    if (MV.reduceMotion || n <= 1) { for (var i = 0; i < n; i++) one(); if (cb.step) cb.step(s); if (cb.done) cb.done(s); return; }
    var left = n, frames = cb.frames || Math.min(40, Math.max(5, Math.ceil(n / 12))), per = Math.ceil(n / frames);
    (function tick(){ var m = Math.min(per, left); for (var j = 0; j < m; j++) one(); left -= m; if (cb.step) cb.step(s);
      if (left > 0) s.raf = requestAnimationFrame(tick); else { s.raf = null; if (cb.done) cb.done(s); } })();
  };
  s.stop = stop; s.busy = function(){ return !!s.raf; };
  s.reset();
  return s;
}
function lfStats(seq, hit, p){
  var n = seq.length, h = 0, run = 0, best = 0, rf = [], pd = [], cd = [];
  for (var i = 0; i < n; i++) {
    if (hit(seq[i])) { h++; run++; if (run > best) best = run; } else run = 0;
    var k = i + 1;
    if (k <= 100 || (k <= 1000 && k % 5 === 0) || k % 25 === 0 || k === n) {
      var x = Math.log10(k); rf.push([x, h / k]);
      if (p != null) { pd.push([x, h / k - p]); cd.push([x, h - k * p]); }
    }
  }
  return { n:n, h:h, best:best, rf:rf, pd:pd, cd:cd };
}
function logTicks(ctx, pl, dec, yTick, yLab){
  ctx.save(); ctx.fillStyle = css("--ink-2"); ctx.strokeStyle = css("--plot-axis"); ctx.font = "12px " + pl.fontUI; ctx.textBaseline = "top";
  var y = Math.min(yLab + 4, pl.H - 15);
  ctx.lineWidth = 1; ctx.beginPath();
  for (var k = 0; k < dec; k++) for (var m = 2; m <= 9; m++) { var x = pl.X(k + Math.log10(m)); ctx.moveTo(x, yTick - 3); ctx.lineTo(x, yTick + 3); }
  ctx.stroke();
  for (k = 0; k <= dec; k++) {
    var lab = big(Math.pow(10, k)), w = ctx.measureText(lab).width, cx = pl.X(k) + (k === 0 ? 5 : 0);
    if (cx + w / 2 > pl.W - 3) { ctx.textAlign = "right"; ctx.fillText(lab, pl.W - 3, y); } else { ctx.textAlign = "center"; ctx.fillText(lab, cx, y); }
  }
  ctx.restore();
}
function drawRelFreq(plot, o){
  var dec = o.dec || 4, p = o.p, xmin = -0.105 * dec, xmax = dec + 0.06, pen = css("--pen"), ink = css("--ink"), rf = o.st.rf;
  plot.draw({ view:{ xmin:xmin, xmax:xmax, ymin:-0.14, ymax:1.07 }, grid:true,
    xTicks:{ step:1, fmt:function(){ return ""; } }, yTicks:{ step:0.25, fmt:function(v){ return MV.num(v, 2); } },
    regions:o.showTheory ? [{ f:function(){ return Math.min(1, p + 0.05); }, g:function(){ return Math.max(0, p - 0.05); }, x0:0, x1:xmax }] : [],
    segments:o.showTheory ? [{ x1:0, y1:p, x2:xmax, y2:p, color:ink, width:1.6, dash:[7, 6] }] : [],
    curves:rf.length > 1 ? [{ pts:rf, color:pen, width:2.6 }] : [],
    points:rf.length === 1 ? [{ x:rf[0][0], y:rf[0][1], color:pen, r:4 }] : [],
    labels:o.showTheory ? [{ x:xmax, y:p, text:o.pLabel, color:ink, align:"right", dy:p > 0.85 ? 14 : -12 }] : [],
    xLabel:"trials (log scale)", yLabel:"relative frequency",
    after:function(ctx, pl){ logTicks(ctx, pl, dec, pl.Y(0), pl.Y(0)); }, describe:o.describe });
}
function drawDiff(plot, pts, o){
  var dec = 4, xmax = dec + 0.06, ink = css("--ink");
  plot.draw({ view:{ xmin:-0.5, xmax:xmax, ymin:-o.R, ymax:o.R }, grid:true,
    xTicks:{ step:1, fmt:function(){ return ""; } }, yTicks:o.yTicks || {},
    regions:o.band ? [{ f:function(){ return 0.05; }, g:function(){ return -0.05; }, x0:0, x1:xmax }] : [],
    segments:[{ x1:0, y1:0, x2:xmax, y2:0, color:ink, width:1.4, dash:[7, 6] }],
    curves:pts.length > 1 ? [{ pts:pts, color:o.color, width:2.4 }] : [],
    points:pts.length === 1 ? [{ x:pts[0][0], y:pts[0][1], color:o.color, r:4 }] : [],
    after:function(ctx, pl){ logTicks(ctx, pl, dec, pl.Y(0), pl.H); }, describe:o.describe });
}

// @component D6 manyRunsDots — dot plot of 20 runs' empirical probabilities, one row per run length (n = 10, 100, 1000; the
// chosen row's label in bold), dots stacked where they touch, the theoretical value as a dashed --ink line.
// drawDots(plot, {rows:[{n, vals | null, on}], p | null, describe})
function drawDots(plot, o){
  var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen");
  plot.draw({ view:{ xmin:-0.2, xmax:1.04, ymin:-0.45, ymax:3.02 }, grid:false, axes:false, describe:o.describe,
    after:function(ctx, pl){
      var d = Math.max(6, Math.min(10, pl.W / 62)), f = pl.fontUI, t;
      ctx.save();
      ctx.strokeStyle = css("--plot-grid"); ctx.lineWidth = 1; ctx.beginPath();
      for (t = 0; t <= 10; t++) { var gx = Math.round(pl.X(t / 10)) + 0.5; ctx.moveTo(gx, pl.Y(2.95)); ctx.lineTo(gx, pl.Y(0)); }
      ctx.stroke();
      o.rows.forEach(function(row, i){
        var yb = pl.Y(2 - i);
        ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(pl.X(0), yb); ctx.lineTo(pl.X(1), yb); ctx.stroke();
        ctx.fillStyle = row.on ? ink : ink2; ctx.font = (row.on ? "700 " : "400 ") + "13px " + f; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        ctx.fillText("n = " + big(+row.n), pl.X(-0.2) + 2, yb - 2);
        if (!row.vals) { ctx.fillStyle = ink2; ctx.font = "italic 12px " + f; ctx.textAlign = "center"; ctx.fillText("not run yet", pl.X(0.2), yb - 6); return; }
        var stacks = {}; ctx.fillStyle = pen;
        row.vals.forEach(function(v){ var bx = Math.round(pl.X(v) / d), k = stacks[bx] = (stacks[bx] || 0) + 1; ctx.beginPath(); ctx.arc(bx * d, yb - d / 2 - 1 - (k - 1) * d, d / 2 - 0.6, 0, Math.PI * 2); ctx.fill(); });
      });
      ctx.fillStyle = ink2; ctx.font = "12px " + f; ctx.textAlign = "center"; ctx.textBaseline = "top";
      [0, 0.25, 0.5, 0.75, 1].forEach(function(v){ ctx.fillText(MV.num(v, 2), pl.X(v), pl.Y(0) + 4); });
      if (o.p != null) {
        ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.setLineDash([7, 6]); ctx.beginPath(); ctx.moveTo(pl.X(o.p), pl.Y(2.97)); ctx.lineTo(pl.X(o.p), pl.Y(-0.02)); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.restore();
    } });
}

// @component spinnerSVG — a spinner as inline SVG (viewBox −6…206, centre (100, 100), radius 88): equal sectors clockwise from
// 12 o'clock, each coloured by its letter (R --red, B --ev-a, G --green, Y --hi) with the letter drawn on it (colour is never
// the only signal; red is a game colour here, not "wrong"), an optional needle (deg clockwise; rotates with a CSS transition),
// hidden mode (a grey disc with "?"). spinSVG(cols, {letters, needle, hidden, aria}) -> html
var CW = { R:"red", B:"blue", G:"green", Y:"yellow" }, CWS = { R:"reds", B:"blues", G:"greens", Y:"yellows" }, ORDER = ["R", "B", "G", "Y"];
function isCol(c){ return ORDER.indexOf(c) >= 0; }
function pol(r, deg){ var a = (deg - 90) * Math.PI / 180; return [100 + r * Math.cos(a), 100 + r * Math.sin(a)]; }
function f1(v){ return Math.round(v * 10) / 10; }
function secPath(i, N, R){ var a = pol(R, i * 360 / N), b = pol(R, (i + 1) * 360 / N); return "M100 100L" + f1(a[0]) + " " + f1(a[1]) + "A" + R + " " + R + " 0 0 1 " + f1(b[0]) + " " + f1(b[1]) + "Z"; }
function spinSVG(cols, o){
  o = o || {}; var N = cols.length, h = "", fs = N > 15 ? 13 : N > 12 ? 15 : 17;
  if (o.hidden) h += '<circle cx="100" cy="100" r="88" class="te-hid"/><text class="te-qm" x="100" y="100">?</text>';
  else cols.forEach(function(c, i){
    h += '<path d="' + secPath(i, N, 88) + '" class="te-f' + c + '"/>';
    if (o.letters) { var q = pol(66, (i + 0.5) * 360 / N); h += '<text class="te-t' + c + '" x="' + f1(q[0]) + '" y="' + f1(q[1]) + '" style="font-size:' + fs + 'px">' + c + "</text>"; }
  });
  h += '<circle cx="100" cy="100" r="88" class="te-rim"/>';
  if (o.needle != null) h += '<g class="te-needle" style="transform:rotate(' + o.needle + 'deg)"><line class="te-nh" x1="100" y1="100" x2="100" y2="30"/><line x1="100" y1="100" x2="100" y2="30"/><path d="M100 17L93 33H107Z"/></g>';
  if (!o.hidden) h += '<circle cx="100" cy="100" r="7" class="te-hub"/>';
  return '<svg class="te-svg" viewBox="-6 -6 212 212"' + (o.aria ? ' role="img" aria-label="' + MV.esc(o.aria) + '"' : ' aria-hidden="true" focusable="false"') + ">" + h + "</svg>";
}
// spinner editor: the SVG plus one native button per sector (tap or Enter recolours it)
function editorHTML(cols, needle){
  var N = cols.length;
  return '<div class="te-ed te-n' + N + '">' + spinSVG(cols, { needle:needle }) + cols.map(function(c, i){
    var q = pol(71, (i + 0.5) * 360 / N);
    return '<button type="button" class="te-sec te-b' + c + '" data-sec="' + i + '" data-k="sec' + i + '" style="left:' + f1((q[0] + 6) / 2.12) + "%;top:" + f1((q[1] + 6) / 2.12) + '%" aria-label="Sector ' + (i + 1) + " of " + N + ": " + CW[c] + '. Press to recolour.">' + c + "</button>";
  }).join("") + "</div>";
}
function colCounts(cols){ var c = { R:0, B:0, G:0, Y:0 }; cols.forEach(function(x){ c[x]++; }); return c; }
function countsLine(cols){
  var c = colCounts(cols);
  return ORDER.map(function(k){ return '<span class="te-cc"><i class="mdm-sw te-sw' + k + '"></i>' + MV.cap(CW[k]) + " " + c[k] + "</span>"; }).join(" ") + ' <span class="muted">(of ' + cols.length + " sectors; each sector is " + M("1/" + cols.length) + ")</span>";
}
function stepperHTML(id, lab, v, lo, hi, pre){
  pre = pre || "te";
  return '<div class="te-stp" role="group" aria-label="' + MV.esc(MV.plain(lab)) + '"><span class="te-stl">' + lab + '</span><button type="button" class="btn ghost sm te-stb" data-' + pre + '="' + id + '" data-d="-1" data-k="' + pre + id + 'm" aria-label="' + MV.esc(MV.plain(lab)) + ': less"' + (v <= lo ? " disabled" : "") + ">−</button>" +
    '<output class="te-sto">' + v + '</output><button type="button" class="btn ghost sm te-stb" data-' + pre + '="' + id + '" data-d="1" data-k="' + pre + id + 'p" aria-label="' + MV.esc(MV.plain(lab)) + ': more"' + (v >= hi ? " disabled" : "") + ">+</button></div>";
}

// ---------- hero: a coin flipped 1000 times; the relative frequency settles inside the band around 0.5 ----------
function hero(f){
  var cv = $("#te-hplot"), coin = $("#te-coin"), cnt = $("#te-hcount"), rb = $("#te-hreplay");
  if (!cv) return;
  var r = MV.mdm.seededRandom("mdm4u-16-hero-12"), seq = [];
  for (var i = 0; i < 1000; i++) seq.push(r() < 0.5 ? 1 : 0);
  var full = lfStats(seq, function(v){ return v === 1; }, null), shown = 1000, stop = null, plot = new MV.Plot(cv, { xmin:0, xmax:3, ymin:0, ymax:1 });
  plot.render = function(){
    var lx = Math.log10(shown) + 1e-9, pts = full.rf.filter(function(q){ return q[0] <= lx; }), last = pts.length ? pts[pts.length - 1][1] : 0;
    drawRelFreq(plot, { st:{ rf:pts }, p:0.5, showTheory:true, pLabel:"0.5", dec:3,
      describe:"After " + big(shown) + " flips, the proportion of heads is " + MV.num(last, 3) + ", " + (Math.abs(last - 0.5) <= 0.05 ? "inside" : "outside") + " the band around 0.5." });
  };
  function show(n){ shown = n; coin.textContent = seq[n - 1] ? "H" : "T"; cnt.textContent = "Trials: " + big(n); plot.render(); }
  function play(){
    if (stop) stop();
    if (MV.reduceMotion) { show(1000); return; }
    coin.classList.add("te-flip");
    stop = MV.tween({ dur:6500, ease:function(t){ return t; }, step:function(t){ show(Math.max(1, Math.round(Math.pow(10, 3 * t)))); },
      done:function(){ stop = null; coin.classList.remove("te-flip"); show(1000); } });
  }
  rb.addEventListener("click", play);
  show(1000); play();
}

// ---------- Explore: Law of large numbers lab ----------
var EXPS = ["coin", "die", "dice", "spin", "mystery"];
var EXT = { coin:"Coin", die:"Die", dice:"Two dice", spin:"Spinner", mystery:"Mystery spinner" };
var MYST = ["B", "B", "B", "R", "R", "R", "R", "Y", "Y", "Y"];   // the hidden mix: blue 3 of 10 sectors
var NS = ["10", "100", "1000"];
var PSEED = { p1:"mdm4u-16-p1-18", p1m:"mdm4u-16-p1c-7", p2:"mdm4u-16-p2-10", p3m:"mdm4u-16-p3-7", p4:"mdm4u-16-p4-5" };   // found offline: 7 heads in 10; count gap −31 at 10 000; etc.
var BRUSH = [{ id:"next", t:"Next colour" }].concat(ORDER.map(function(c){ return { id:c, t:'<i class="mdm-sw te-sw' + c + '"></i>' + MV.cap(CW[c]) }; }));
function defCols(N){ var a = []; for (var i = 0; i < N; i++) a.push(ORDER[i % 4]); return a; }
function tc2Solved(){ return !!(MV.S.chal && MV.S.chal.tc2 && MV.S.chal.tc2.solved); }

function explore(host, api){
  var S = api.S;
  S.exp = EXPS.indexOf(S.exp) >= 0 ? S.exp : "coin";
  S.view = S.view === "many" ? "many" : "single";
  S.gview = S.gview === "diff" ? "diff" : "rf";
  S.seeded = S.seeded !== false; S.seedK = clampInt(S.seedK, 1, 5, 1);
  S.spinN = [12, 15, 18].indexOf(+S.spinN) >= 0 ? +S.spinN : 12;
  if (!tc2Solved()) S.spinN = 12;
  if (!Array.isArray(S.cols) || S.cols.length !== S.spinN || !S.cols.every(isCol)) S.cols = defCols(S.spinN);
  S.evCol = isCol(S.evCol) ? S.evCol : "R"; S.brush = S.brush === "next" || isCol(S.brush) ? S.brush : "next";
  S.runs = obj(S.runs); S.many = obj(S.many); S.manyN = NS.indexOf(S.manyN) >= 0 ? S.manyN : "10";
  S.est = typeof S.est === "string" ? S.est : ""; S.revealed = !!S.revealed;
  var sims = {}, mcache = {}, stCache = { key:null, v:null }, pv = { show:{} }, anim = null, nd = {}, locked = false;
  function save(){ api.save(); }

  // --- runs (all seeded; restored from {seed, n}) ---
  function trialFor(e){
    if (e === "coin") return function(r){ return r() < 0.5 ? 1 : 0; };
    if (e === "die") return function(r){ return 1 + r.int(6); };
    if (e === "dice") return function(r){ return 2 + r.int(6) + r.int(6); };
    if (e === "spin") return function(r){ return r.int(S.spinN); };
    return function(r){ return r.int(10); };
  }
  function newSeed(e, kind){ return S.seeded ? "mdm4u-16-" + e + "-" + kind + S.seedK : "mdm4u-16-r" + Math.floor(Math.random() * 1e9); }
  function runInfo(e){ var r = S.runs[e] = obj(S.runs[e]); if (typeof r.seed !== "string") { r.seed = newSeed(e, "s"); r.n = 0; r.label = null; } r.n = clampInt(r.n, 0, 10000, 0); return r; }
  function sim(e){ e = e || S.exp; if (!sims[e]) { var r = runInfo(e); sims[e] = makeSim({ trial:trialFor(e), seed:r.seed }); sims[e].fill(r.n); } return sims[e]; }
  function resetRun(e, seed, label){ var r = runInfo(e); r.seed = seed || newSeed(e, "s"); r.label = label || null; r.n = 0; sim(e).reset(r.seed); nd[e] = null; }
  function syncN(e){ runInfo(e).n = sim(e).seq.length; }
  function runLabel(e){ var r = runInfo(e), m = /-s(\d)$/.exec(r.seed); return r.label || (m ? "Seeded run, seed " + m[1] + ": the same seed gives the same run on every device." : "Fresh random run (not seeded)."); }
  function manyInfo(e){ var m = S.many[e] = obj(S.many[e]); if (typeof m.base !== "string") { m.base = newSeed(e, "m"); m.label = null; m.ns = {}; } m.ns = obj(m.ns); m.over = obj(m.over); return m; }
  function resetMany(e, base, label){ S.many[e] = { base:base || newSeed(e, "m"), label:label || null, ns:{}, over:{} }; }
  function baseOf(e, n){ var m = manyInfo(e); return typeof m.over[n] === "string" ? m.over[n] : m.base; }
  function manyVals(e, n){
    var m = manyInfo(e), b = baseOf(e, n), key = e + "|" + b + "|" + n + "|" + (e === "spin" ? S.spinN + S.cols.join("") + S.evCol : "");
    if (mcache[key]) return mcache[key];
    var hit = hitFn(e), tr = trialFor(e), out = [];
    for (var j = 0; j < 20; j++) { var r = MV.mdm.seededRandom(b + "-" + n + "-" + j), h = 0; for (var i = 0; i < +n; i++) if (hit(tr(r))) h++; out.push(h / +n); }
    return (mcache[key] = out);
  }

  // --- the event and its theory ---
  function hitFn(e){
    e = e || S.exp;
    if (e === "coin") return function(v){ return v === 1; };
    if (e === "die") return function(v){ return v === 6; };
    if (e === "dice") return function(v){ return v === 7; };
    if (e === "spin") { var cols = S.cols, c = S.evCol; return function(v){ return cols[v] === c; }; }
    return function(v){ return v < 3; };
  }
  function spinCount(){ return colCounts(S.cols)[S.evCol]; }
  function theory(e){ e = e || S.exp; return e === "coin" ? F.of(1, 2) : e === "die" || e === "dice" ? F.of(1, 6) : e === "spin" ? F.of(spinCount(), S.spinN) : F.of(3, 10); }
  function hidden(){ return S.exp === "mystery" && !S.revealed; }
  function evWords(e){ e = e || S.exp; return e === "coin" ? "heads" : e === "die" ? "6" : e === "dice" ? "sum = 7" : e === "spin" ? CW[S.evCol] : "blue"; }
  function noun(e, k){ var one = k === 1; return e === "coin" ? "heads" : e === "die" ? (one ? "six" : "sixes") : e === "dice" ? (one ? "seven" : "sevens") : e === "spin" ? (one ? CW[S.evCol] : CWS[S.evCol]) : (one ? "blue" : "blues"); }
  function trialWord(e){ return e === "coin" ? "flips" : e === "die" || e === "dice" ? "rolls" : "spins"; }
  function theoTxt(e){
    e = e || S.exp;
    if (e === "coin") return "0.5";
    if (e === "die") return F.prob(1, 6);
    if (e === "dice") return F.prob(6, 36);
    if (e === "spin") return F.prob(spinCount(), S.spinN);
    return "0.3 (revealed)";
  }
  function oddsTxt(e){ e = e || S.exp; if (e === "coin") return "1 : 1"; if (e === "die" || e === "dice") return "1 : 5"; if (e === "spin") { var k = spinCount(); return ratioTxt(k, S.spinN - k); } return "3 : 7"; }
  function stats(){
    var e = S.exp, s = sim(), hid = hidden(), key = e + "|" + s.seed + "|" + s.seq.length + "|" + (e === "spin" ? S.cols.join("") + S.evCol : "") + "|" + hid;
    if (stCache.key !== key) { stCache.key = key; stCache.v = lfStats(s.seq, hitFn(e), hid ? null : F.val(theory(e))); }
    return stCache.v;
  }

  // --- layout ---
  host.innerHTML =
    '<div class="te-top"><div id="te-exp"></div><div id="te-view"></div></div>' +
    '<div class="pg te-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap te-cap" id="te-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="te-single"><div id="te-gview"></div>' +
        '<div id="te-rfbox"><div class="plot-wrap"><canvas class="plot" id="te-rf" role="img" aria-label="Relative frequency graph"></canvas></div></div>' +
        '<div id="te-dbox" hidden><p class="te-plab">Proportion difference (empirical − theoretical)</p><div class="plot-wrap"><canvas class="plot wide" id="te-pd" role="img" aria-label="Proportion difference graph"></canvas></div>' +
          '<p class="te-plab">Count difference (successes − trials × theoretical)</p><div class="plot-wrap"><canvas class="plot wide" id="te-cd" role="img" aria-label="Count difference graph"></canvas></div></div>' +
        '<p class="legend tiny te-leg" id="te-leg"></p>' +
        '<div class="te-run te-runs" role="group" aria-label="Run trials"><button type="button" class="btn sm" data-run="1" data-k="run1">+1</button><button type="button" class="btn sm" data-run="10" data-k="run10">+10</button><button type="button" class="btn sm" data-run="100" data-k="run100">+100</button><button type="button" class="btn sm" data-run="1000" data-k="run1000">+1000</button><button type="button" class="btn ghost sm" id="te-reset" data-k="runreset">Reset</button></div>' +
        '<p class="tiny muted te-note" id="te-note"></p><div id="te-last"></div><div id="te-tally"></div></div>' +
      '<div id="te-manybox" hidden><div class="plot-wrap"><canvas class="plot" id="te-dot" role="img" aria-label="Dot plot of 20 runs"></canvas></div><p class="legend tiny te-leg" id="te-mleg"></p>' +
        '<div class="te-run" role="group" aria-label="Many runs"><div id="te-mn"></div><button type="button" class="btn sm primary" id="te-m20" data-k="m20">Run 20 runs</button><button type="button" class="btn ghost sm" id="te-mclear" data-k="mclear">Clear</button></div><p class="tiny muted te-note" id="te-mnote"></p></div>' +
    "</div>" +
    '<div class="pg-ctrl"><div class="te-seedrow"><label class="te-check"><input type="checkbox" id="te-seeded"> Seeded (repeatable) runs</label><div id="te-seed"></div></div>' +
      '<div id="te-spinbox" hidden><div id="te-secn"></div><p class="tiny muted te-secnote" id="te-secnote"></p><div id="te-evc"></div><div id="te-brush"></div><div id="te-ed"></div><p class="te-counts" id="te-counts"></p></div>' +
      '<div id="te-mystbox" hidden><div id="te-myed" class="te-myed"></div><div class="te-estrow"><label for="te-est">Your estimate of ' + Pw("blue") + ', to 2 decimal places</label><input id="te-est" class="numin" type="text" inputmode="decimal" autocomplete="off"></div><p class="te-myinfo" id="te-myinfo" aria-live="polite"></p></div>' +
    "</div>" +
    '<div class="pg-read"><dl class="read te-read" id="te-read" aria-live="polite"></dl><button type="button" class="btn ghost sm te-more" id="te-more" aria-expanded="false" aria-controls="te-read">More</button></div></div>';

  var rfPlot = new MV.Plot($("#te-rf", host), { xmin:0, xmax:4, ymin:0, ymax:1 }), pdPlot = new MV.Plot($("#te-pd", host), { xmin:0, xmax:4, ymin:-1, ymax:1 }),
    cdPlot = new MV.Plot($("#te-cd", host), { xmin:0, xmax:4, ymin:-1, ymax:1 }), dotPlot = new MV.Plot($("#te-dot", host), { xmin:0, xmax:1, ymin:0, ymax:3 });
  rfPlot.render = drawRF; pdPlot.render = drawPD; cdPlot.render = drawCD; dotPlot.render = drawMany;

  var expR = radios($("#te-exp", host), { label:"Experiment", options:EXPS.map(function(e){ return { id:e, t:EXT[e] }; }), value:S.exp, cls:"chips",
    onChange:function(v){ user(); S.exp = v; save(); paintAll(); MV.changed(); } });
  var viewR = radios($("#te-view", host), { label:"View", options:[{ id:"single", t:"Single run" }, { id:"many", t:"Many runs" }], value:S.view, cls:"seg",
    onChange:function(v){ user(); S.view = v; save(); paintAll(); MV.changed(); } });
  var gR = radios($("#te-gview", host), { label:"Graph", options:[{ id:"rf", t:"Relative frequency" }, { id:"diff", t:"Differences" }], value:S.gview, cls:"seg",
    onChange:function(v){ user(); S.gview = v; save(); paintAll(); } });
  var seedR = radios($("#te-seed", host), { label:"Seed", options:[1, 2, 3, 4, 5].map(function(k){ return { id:String(k), t:String(k) }; }), value:String(S.seedK), cls:"seg",
    disabled:function(){ return !S.seeded; }, onChange:function(v){ user(); S.seedK = +v; resetRun(S.exp); resetMany(S.exp); save(); paintAll(); MV.changed(); } });
  var secR = radios($("#te-secn", host), { label:"Sectors", options:[{ id:"12", t:"12" }, { id:"15", t:"15" }, { id:"18", t:"18" }], value:String(S.spinN), cls:"seg",
    disabled:function(id){ return id !== "12" && !tc2Solved(); }, onChange:function(v){ user(); setN(+v); } });
  var evR = radios($("#te-evc", host), { label:"Event colour", options:ORDER.map(function(c){ return { id:c, t:'<i class="mdm-sw te-sw' + c + '"></i>' + MV.cap(CW[c]) }; }), value:S.evCol, cls:"chips",
    onChange:function(v){ user(); S.evCol = v; save(); paintAll(); MV.changed(); } });
  var brushR = radios($("#te-brush", host), { label:"Tapping a sector paints", options:BRUSH, value:S.brush, cls:"chips", onChange:function(v){ S.brush = v; save(); } });
  var mnR = radios($("#te-mn", host), { label:"Trials per run", options:NS.map(function(n){ return { id:n, t:big(+n) }; }), value:S.manyN, cls:"seg",
    onChange:function(v){ user(); S.manyN = v; save(); paintAll(); } });
  var seededBox = $("#te-seeded", host), est = $("#te-est", host);
  seededBox.checked = S.seeded;
  seededBox.addEventListener("change", function(){ user(); S.seeded = seededBox.checked; resetRun(S.exp); resetMany(S.exp); save(); paintAll(); MV.changed(); });
  est.value = S.est;
  est.addEventListener("input", function(){ S.est = est.value; save(); MV.changed(); });
  est.addEventListener("keydown", function(e){ if (e.key === "Enter") { var b = document.querySelector('#chal [data-c="tc1"] [data-act="check"]'); if (b) b.click(); } });

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.run) { runTrials(+b.dataset.run); return; }
    if (b.id === "te-reset") { user(); resetRun(S.exp); save(); paintAll(); MV.changed(); return; }
    if (b.dataset.sec != null) { tapSector(+b.dataset.sec); return; }
    if (b.id === "te-m20") { user(); var mi = manyInfo(S.exp); if (!S.seeded && mi.ns[S.manyN]) mi.over[S.manyN] = newSeed(S.exp, "m"); mi.label = null; runMany([S.manyN], null); return; }
    if (b.id === "te-mclear") { user(); resetMany(S.exp); save(); paintAll(); return; }
    if (b.id === "te-more") { var rd = $("#te-read", host), open = !rd.classList.contains("te-open"); rd.classList.toggle("te-open", open); b.setAttribute("aria-expanded", String(open)); b.textContent = open ? "Less" : "More"; }
  });

  // --- animation bookkeeping (predictions, many-runs dots); any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (err) {} });
    pv.show = {}; stopSims();
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    paintAll(); MV.changed();
  }
  function stopSims(){ Object.keys(sims).forEach(function(k){ if (sims[k].busy()) { sims[k].stop(); syncN(k); } }); lock(false); }
  function user(){ cancelAnim(); stopSims(); MV.banner("", ""); }
  function lock(b){ locked = b; Array.prototype.forEach.call(host.querySelectorAll("[data-run], #te-reset, #te-m20, #te-mclear"), function(x){ x.disabled = b || (x.dataset.run && sim().seq.length >= 10000); }); }

  function runTrials(k){
    if (locked) return;
    user();
    var s = sim(), n = Math.min(k, 10000 - s.seq.length);
    if (n <= 0) return;
    lock(true);
    s.run(n, { step:function(){ syncN(S.exp); paintLive(); }, done:function(){ syncN(S.exp); save(); lock(false); paintAll(); MV.changed(); } });
  }
  // dots appear one run at a time, for each run length in ns (in order)
  function runMany(ns, fin){
    var e = S.exp, m = manyInfo(e), a = newAnim(fin);
    ns.forEach(function(n){ m.ns[n] = true; pv.show[n] = 0; });
    save();
    if (MV.reduceMotion) { pv.show = {}; S.manyN = ns[ns.length - 1]; paintAll(); MV.changed(); if (anim === a) endAnim(); return; }
    var i = 0, k = 0;
    lock(true);
    (function step(){
      var n = ns[i]; S.manyN = n; pv.show[n] = ++k; paintAll();
      if (k < 20) { later(70, step); return; }
      delete pv.show[n]; i++; k = 0;
      if (i < ns.length) later(650, step); else { lock(false); paintAll(); MV.changed(); endAnim(); }
    })();
    a.stops.push(function(){ lock(false); });
  }

  // --- spinner editing ---
  function spinChanged(){
    var had = sim("spin").seq.length > 0 || Object.keys(manyInfo("spin").ns).length > 0;
    resetRun("spin"); resetMany("spin"); mcache = {};
    save(); paintAll(); MV.changed();
    if (had) MV.banner("", "The spinner changed, so its runs start again.");
  }
  function tapSector(i){
    user();
    var c = S.cols[i], nx = S.brush === "next" ? ORDER[(ORDER.indexOf(c) + 1) % 4] : S.brush;
    if (nx === c) return;
    S.cols[i] = nx; spinChanged();
  }
  function setN(N){
    var old = S.cols, a = [];
    for (var i = 0; i < N; i++) a.push(i < old.length ? old[i] : ORDER[i % 4]);
    S.spinN = N; S.cols = a; sims.spin = null; delete sims.spin; spinChanged();
  }

  // --- painting ---
  function paintAll(){
    var e = S.exp, single = S.view === "single";
    expR.set(e); viewR.set(S.view); gR.set(S.gview); seedR.set(String(S.seedK)); seedR.refresh(); seededBox.checked = S.seeded; mnR.set(S.manyN);
    $("#te-single", host).hidden = !single; $("#te-manybox", host).hidden = single;
    $("#te-rfbox", host).hidden = S.gview !== "rf"; $("#te-dbox", host).hidden = S.gview !== "diff";
    $("#te-spinbox", host).hidden = e !== "spin"; $("#te-mystbox", host).hidden = e !== "mystery";
    if (e === "spin") paintSpinCtl();
    if (e === "mystery") paintMyst();
    lock(locked);
    paintLive();
  }
  function paintLive(){
    var e = S.exp;
    paintCap(); paintRead();
    if (S.view === "single") {
      if (S.gview === "rf") rfPlot.render(); else { pdPlot.render(); cdPlot.render(); }
      paintLeg(); paintLast(); paintTally();
      $("#te-note", host).textContent = runLabel(e) + (sim().seq.length >= 10000 ? " This run has reached 10 000 trials: press Reset to start another." : "");
    } else {
      dotPlot.render();
      var m = manyInfo(e);
      $("#te-mleg", host).innerHTML = m.label ? m.label : "Each dot is one run’s empirical probability." + (hidden() ? "" : " Dashed line: the theoretical value.");
      var bm = /-m(\d)$/.exec(baseOf(e, S.manyN));
      $("#te-mnote", host).textContent = m.label ? "" : bm ? "Seeded runs, seed " + bm[1] + ": the same seed gives the same 20 runs on every device." : "Fresh random runs (not seeded).";
    }
    if (e === "spin" || e === "mystery") paintNeedle();
  }
  function paintCap(){
    var e = S.exp, p = theory(e);
    $("#te-cap", host).innerHTML = '<span class="m"><i>P</i>(' + evWords(e) + ")</span> " + (hidden() ? M("= ?") : e === "dice" ? M("= 6/36 = 1/6") : e === "spin" ? M("= " + spinCount() + "/" + S.spinN + (F.of(spinCount(), S.spinN).d !== S.spinN ? " = " + F.txt(p) : "")) : M("= " + F.txt(p)));
  }
  function readRows(rows){ return rows.map(function(r, i){ return "<div" + (i >= 4 ? ' class="te-xr"' : "") + "><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join(""); }
  function paintRead(){
    var e = S.exp, hid = hidden(), rows;
    if (S.view === "single") {
      var st = stats(), n = st.n, h = st.h, p = F.val(theory(e)), cd = h - n * p;
      rows = [
        ["Trials", big(n)],
        ["Successes", big(h) + ' <span class="muted">(' + noun(e, h) + ")</span>"],
        ["Empirical probability", n ? (h / n).toFixed(4) : "—"],
        ["Theoretical probability", hid ? "hidden" : theoTxt(e)],
        ["Proportion difference", hid ? "hidden" : n ? signed(h / n - p, 4) : "—"],
        ["Count difference", hid ? "hidden" : n ? (Math.abs(cd - Math.round(cd)) < 1e-9 ? signed(Math.round(cd), 0) : signed(cd, 1)) : "—"],
        ["Longest streak so far", st.best ? st.best + " " + noun(e, st.best) : "none yet"],
        ["Odds in favour (theoretical)", hid ? "hidden" : oddsTxt(e)]
      ];
    } else {
      var m = manyInfo(e), n2 = S.manyN, dp = n2.length - 1, vals = m.ns[n2] ? manyVals(e, n2).slice(0, pv.show[n2] != null ? pv.show[n2] : 20) : [], lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), pp = F.val(theory(e));
      rows = [
        ["Runs", vals.length ? vals.length + " runs of " + big(+n2) + " trials" : "none yet: press Run 20 runs"],
        ["Lowest estimate", vals.length ? lo.toFixed(dp) : "—"],
        ["Highest estimate", vals.length ? hi.toFixed(dp) : "—"],
        ["Spread (highest − lowest)", vals.length ? (hi - lo).toFixed(dp) : "—"],
        ["Runs within ±0.05 of the theoretical value", hid ? "hidden" : vals.length ? vals.filter(function(v){ return Math.abs(v - pp) <= 0.05 + 1e-9; }).length + " of " + vals.length : "—"],
        ["Theoretical probability", hid ? "hidden" : theoTxt(e)]
      ];
    }
    $("#te-read", host).innerHTML = readRows(rows);
  }
  function paintLeg(){
    var hid = hidden(), e = S.exp;
    $("#te-leg", host).innerHTML = S.gview === "rf" ? '<span><i class="sw" style="background:var(--pen)"></i>running relative frequency of ' + MV.esc(evWords(e) === "6" ? "a 6" : evWords(e)) + "</span>" + (hid ? "<span>The theoretical value is hidden in Mystery mode.</span>" : '<span><i class="sw te-dash"></i><span>theoretical <i>P</i>, with a shaded ±0.05 band</span></span>') :
      (hid ? "<span>The differences need the theoretical value, which is hidden in Mystery mode.</span>" : "<span>Same run, two ways to measure the gap. The dashed line is 0 (no gap).</span>");
  }
  function drawRF(){
    if (S.view !== "single" || S.gview !== "rf") return;
    var e = S.exp, st = stats(), hid = hidden(), p = F.val(theory(e)), last = st.n ? st.h / st.n : 0;
    drawRelFreq(rfPlot, { st:st, p:p, showTheory:!hid, pLabel:theoTxt(e).replace(" (revealed)", "").replace(/^.*= /, ""), dec:4,
      describe:!st.n ? "Relative frequency graph: no trials yet. Press a run button." :
        "After " + big(st.n) + " " + trialWord(e) + ", the proportion of " + noun(e, 2) + " is " + MV.num(last, 3) + (hid ? ". The theoretical value is hidden." : ", " + (Math.abs(last - p) <= 0.05 + 1e-9 ? "inside" : "outside") + " the band around " + MV.num(p, 3) + ".") });
  }
  function drawPD(){
    if (S.view !== "single" || S.gview !== "diff") return;
    var st = stats(), last = st.pd.length ? st.pd[st.pd.length - 1][1] : 0;
    drawDiff(pdPlot, st.pd, { R:0.5, band:true, color:css("--pen"), yTicks:{ step:0.25, fmt:function(v){ return MV.num(v, 2); } },
      describe:hidden() ? "Proportion difference graph: hidden in Mystery mode." : !st.n ? "Proportion difference graph: no trials yet." : "Proportion difference after " + big(st.n) + " trials: " + signed(last, 4) + ". It wanders a lot at first, then flattens toward 0." });
  }
  function drawCD(){
    if (S.view !== "single" || S.gview !== "diff") return;
    var st = stats(), mx = 0; st.cd.forEach(function(q){ mx = Math.max(mx, Math.abs(q[1])); });
    var R = Math.max(10, Math.ceil(mx * 1.2 / 5) * 5), last = st.cd.length ? st.cd[st.cd.length - 1][1] : 0;
    drawDiff(cdPlot, st.cd, { R:R, color:css("--ev-c"), yTicks:{ fmt:function(v){ return MV.num(v, 0); } },
      describe:hidden() ? "Count difference graph: hidden in Mystery mode." : !st.n ? "Count difference graph: no trials yet." : "Count difference after " + big(st.n) + " trials: " + signed(last, 1) + ". The largest gap so far is " + MV.num(mx, 1) + "." });
  }
  function drawMany(){
    if (S.view !== "many") return;
    var e = S.exp, m = manyInfo(e), hid = hidden(), p = F.val(theory(e));
    var rows = NS.map(function(n){ return { n:n, on:n === S.manyN, vals:m.ns[n] ? manyVals(e, n).slice(0, pv.show[n] != null ? pv.show[n] : 20) : null }; });
    var desc = rows.map(function(r){ if (!r.vals || !r.vals.length) return "n = " + r.n + ": not run yet"; var lo = Math.min.apply(null, r.vals), hi = Math.max.apply(null, r.vals); return "n = " + r.n + ": " + r.vals.length + " runs from " + MV.num(lo, 3) + " to " + MV.num(hi, 3); }).join("; ");
    drawDots(dotPlot, { rows:rows, p:hid ? null : p, describe:"Dot plot of the empirical probabilities of 20 runs for each run length. " + desc + "." + (hid ? "" : " Theoretical value " + MV.num(p, 4) + ".") });
  }
  function outTxt(e, v){ return e === "coin" ? (v ? "H" : "T") : e === "spin" ? S.cols[v] : e === "mystery" ? MYST[v] : String(v); }
  function paintLast(){
    var e = S.exp, seq = sim().seq, k = seq.length, from = Math.max(0, k - 20), hit = hitFn(e), box = $("#te-last", host);
    if (!k) { box.innerHTML = '<p class="te-lastlab tiny muted">No trials yet.</p>'; return; }
    var list = seq.slice(from), hits = list.filter(hit).length;
    box.innerHTML = '<p class="te-lastlab tiny muted">Last ' + list.length + " outcome" + (list.length > 1 ? "s" : "") + (e === "dice" ? " (sums)" : "") + ", oldest first; " + noun(e, 2) + " are marked:</p>" +
      '<p class="te-strip" aria-label="' + MV.esc("Last " + list.length + " outcomes: " + list.map(function(v){ return outTxt(e, v); }).join(", ") + ". " + hits + " of them " + (hits === 1 ? "is a success." : "are successes.")) + '">' +
      list.map(function(v){ var t = outTxt(e, v), col = e === "spin" || e === "mystery"; return '<span class="te-o' + (hit(v) ? " hit" : "") + (col ? " te-o" + t : "") + '" aria-hidden="true">' + t + "</span>"; }).join("") + "</p>";
  }
  function paintTally(){
    var box = $("#te-tally", host);
    if (S.exp !== "dice") { box.innerHTML = ""; return; }
    var c = {}, s, seq = sim().seq, mx = 1;
    for (s = 2; s <= 12; s++) c[s] = 0;
    seq.forEach(function(v){ c[v]++; });
    for (s = 2; s <= 12; s++) mx = Math.max(mx, c[s]);
    var h = '<div class="te-tally" role="img" aria-label="' + MV.esc("Tally by sum: " + Object.keys(c).map(function(k){ return k + ": " + c[k]; }).join(", ")) + '"><p class="te-tlab">Tally by sum <span class="muted">· sevens ' + big(c[7]) + " · twelves " + big(c[12]) + '</span></p><div class="te-tbars" aria-hidden="true">';
    for (s = 2; s <= 12; s++) h += '<div class="te-tcol' + (s === 7 ? " ev" : "") + '"><span class="te-tn">' + c[s] + '</span><span class="te-tb" style="height:' + (c[s] / mx * 100).toFixed(1) + '%"></span><span class="te-ts">' + s + "</span></div>";
    box.innerHTML = h + "</div></div>";
  }
  function needleFor(e){
    var s = sim(e), k = s.seq.length, st = nd[e] || (nd[e] = { deg:0, n:0 });
    if (k && st.n !== k) {
      var N = e === "spin" ? S.spinN : 10, frac = 0.25 + 0.5 * ((k * 0.6180339887) % 1), target = (s.seq[k - 1] + frac) * 360 / N;
      st.deg = st.deg + 360 + (((target - st.deg) % 360) + 360) % 360; st.n = k;
    }
    if (!k) { st.deg = 0; st.n = 0; }
    return st.deg;
  }
  function paintNeedle(){
    var e = S.exp, box = e === "spin" ? $("#te-ed", host) : $("#te-myed", host), g = box && box.querySelector(".te-needle");
    if (!g) return;
    g.style.transform = "rotate(" + needleFor(e) + "deg)";
  }
  function paintSpinCtl(){
    secR.set(String(S.spinN)); secR.refresh(); evR.set(S.evCol); brushR.set(S.brush);
    $("#te-secnote", host).textContent = tc2Solved() ? "" : "15 and 18 sectors unlock when you meet challenge 2.";
    var ed = $("#te-ed", host), sig = S.cols.join("");
    if (ed.dataset.sig !== sig) { MV.keepFocus(ed, function(){ ed.innerHTML = editorHTML(S.cols, needleFor("spin")); }); ed.dataset.sig = sig; }
    $("#te-counts", host).innerHTML = countsLine(S.cols);
  }
  function paintMyst(){
    var box = $("#te-myed", host), sig = S.revealed ? "rev" : "hid";
    if (box.dataset.sig !== sig) {
      box.innerHTML = spinSVG(MYST, { hidden:!S.revealed, letters:true, needle:S.revealed ? needleFor("mystery") : null,
        aria:S.revealed ? "Mystery spinner revealed: 10 equal sectors, 3 blue, 4 red and 3 yellow." : "Mystery spinner: the colour mix is hidden. The event is blue." });
      box.dataset.sig = sig;
    }
    if (document.activeElement !== est) est.value = S.est;
    var off = S.tc1est != null ? Math.abs(S.tc1est - 0.3) : null;
    $("#te-myinfo", host).innerHTML = S.revealed ? "<strong>Hidden mix revealed:</strong> 3 of the 10 sectors are blue, so " + Pw("blue") + " = 0.30 (4 sectors are red and 3 are yellow)." + (off != null ? " Your estimate, " + MV.num(S.tc1est, 3) + ", was off by " + offTxt(off) + "." : "") :
      "The colour mix is hidden; the event is blue. Spin, then use the Empirical probability row to estimate " + Pw("blue") + ".";
  }
  function offTxt(d){ return d < 0.0005 ? "0: exactly right" : fix(d, d < 0.01 ? 3 : 2); }
  function setTc1Why(){
    var c = ((MV.C.explore || {}).challenges || []).filter(function(x){ return x.id === "tc1"; })[0];
    if (!c || S.tc1est == null) return;
    if (c._base == null) c._base = c.why;
    c.why = c._base + " Your estimate was off by " + offTxt(Math.abs(S.tc1est - 0.3)) + ".";
  }
  setTc1Why();

  // --- predictions ---
  function startPred(p){
    user();
    if (p.id === "p1") { S.exp = "coin"; S.view = "single"; S.gview = "rf"; resetRun("coin", PSEED.p1, "Prediction 1’s seeded run: the first 10 flips gave 7 heads."); sim("coin").fill(10); syncN("coin"); }
    else if (p.id === "p2") { S.exp = "coin"; S.view = "single"; S.gview = "diff"; resetRun("coin", PSEED.p2, "Prediction 2’s seeded run."); sim("coin").fill(100); syncN("coin"); }
    else if (p.id === "p3") { S.exp = "coin"; S.view = "many"; S.manyN = "10"; resetMany("coin", PSEED.p3m, "Prediction 3: 20 runs of 10 flips, then 20 runs of 1000 flips."); }
    else if (p.id === "p4") { S.exp = "dice"; S.view = "single"; S.gview = "rf"; resetRun("dice", PSEED.p4, "Prediction 4’s seeded run: 3600 rolls of two dice."); }
    save(); paintAll(); MV.changed();
  }
  // a prediction run: the trial count grows geometrically, so the log axis fills at an even pace
  function runSim(n, dur, done){
    var a = newAnim(done), s = sim(), from = s.seq.length, to = from + n, base = Math.max(from, 1);
    lock(true);
    var stop = MV.tween({ dur:dur, ease:function(t){ return t; },
      step:function(t){ s.add(Math.max(0, Math.min(to, Math.round(base * Math.pow(to / base, t))) - s.seq.length)); syncN(S.exp); paintLive(); },
      done:function(){ s.add(to - s.seq.length); syncN(S.exp); save(); lock(false); paintAll(); MV.changed(); if (anim === a) endAnim(); } });
    a.stops.push(function(){ stop(); syncN(S.exp); save(); lock(false); });
  }
  function runPred(p, done){
    if (p.id === "p1") { S.view = "many"; S.manyN = "10"; resetMany("coin", PSEED.p1m, "Prediction 1: each dot is one repeat of 10 more flips (heads ÷ 10). The dots centre on 0.5, which is 5 heads of 10."); runMany(["10"], done); }
    else if (p.id === "p2") runSim(9900, 3200, done);
    else if (p.id === "p3") runMany(["10", "1000"], done);
    else if (p.id === "p4") runSim(3600, 3000, done);
    else done();
  }

  // --- challenges ---
  function chal(id, opt){
    var live = opt && opt.live, c = colCounts(S.cols), N = S.spinN;
    if (id === "tc1") {
      if (S.exp !== "mystery") return { ok:false, msg:"Choose the Mystery spinner, then spin it at least 500 times." };
      var st = stats();
      if (st.n < 500) return { ok:false, msg:"Keep spinning: a short run can be far off." };
      var v = parseVal(S.est);
      if (v == null) return { ok:false, msg:"Type your estimate in the box under the mystery spinner." };
      if (Math.abs(v - st.h / st.n) <= 0.005 + 1e-9) {
        if (!live) { S.revealed = true; S.tc1est = v; setTc1Why(); save(); MV.wait(0, function(){ paintAll(); }); }
        return { ok:true };
      }
      if (Math.abs(v - st.h) < 1e-9) return { ok:false, msg:"That’s a count. Divide by the number of trials." };
      if (st.n > st.h && Math.abs(v - st.h / (st.n - st.h)) <= 0.005 + 1e-9) return { ok:false, msg:"Divide by <strong>all</strong> trials, not by the failures." };
      return { ok:false, msg:"Your estimate should be the Empirical probability row rounded to 2 decimals." };
    }
    if (id === "tc2") {
      if (N !== 12) return { ok:false, msg:"Set the spinner to 12 sectors." };
      if (c.R === 4 && c.B === 3 && c.Y === 5 && c.G === 0) { if (!live) MV.wait(0, function(){ secR.refresh(); paintAll(); }); return { ok:true }; }
      if (c.R === 3 && c.B === 4) return { ok:false, msg:"Those are swapped: `1/3` of 12 is 4." };
      if (c.Y > 0 && c.G > 0) return { ok:false, msg:"The rest should be yellow only." };
      return { ok:false, msg:"Your spinner has red " + c.R + ", blue " + c.B + ", green " + c.G + " and yellow " + c.Y + ". " + Pw("red") + " = " + c.R + "/12 should be " + M("1/3") + ", and " + Pw("blue") + " = " + c.B + "/12 should be " + M("1/4") + "." };
    }
    if (id === "tc3") {
      if (N === 18 && c.Y === 3 && c.B === 5 && c.R === 10) return { ok:true };
      if (N === 15 && c.Y === 3) return { ok:false, msg:"That makes " + Pw("yellow") + " = " + M("1/5") + ". Odds of 1 : 5 mean 1 favourable for every 5 unfavourable, so " + M("P = 1/6") + "." };
      if (N === 12 && c.Y === 2 && c.R !== 2 * c.B) return { ok:false, msg:"Red + blue = 10 can’t be split so red is exactly twice blue. Try another sector count." };
      if (c.B > 0 && c.B === 2 * c.R) return { ok:false, msg:"Red should be the bigger one." };
      if (c.G > 0) return { ok:false, msg:"Use only red, blue and yellow." };
      return { ok:false, msg:"Yellow has " + c.Y + " of " + N + " sectors, so its odds in favour are " + ratioTxt(c.Y, N - c.Y) + "; red has " + c.R + " and blue has " + c.B + "." };
    }
    return { ok:false };
  }

  paintAll();
  return { predict:{ start:startPred, run:runPred }, challenge:function(id, opt){ var r = chal(id, opt); if (r.msg) r.msg = MV.md(r.msg); return r; } };
}

// ---------- Part 3: Design a simulation (three stations) ----------
var GOAL_SEED = "mdm4u-16-goalie", STAGES = [1, 10, 100, 1000];
function part3(host, api){
  var S = api.S, C = api.content || {}, ST = C.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.s1 = obj(S.s1); S.s1.tried = obj(S.s1.tried);
  S.s2 = obj(S.s2); S.s2.n = clampInt(S.s2.n, 0, 1000, 0);
  S.s3 = obj(S.s3); S.s3.k = clampInt(S.s3.k, 0, 8, 4); S.s3.shots = clampInt(S.s3.shots, 1, 10, 4); S.s3.trials = ["10", "100", "1000"].indexOf(S.s3.trials) >= 0 ? S.s3.trials : "100";
  S.s3.runs = Array.isArray(S.s3.runs) ? S.s3.runs.filter(function(r){ return r && r.N > 0; }).slice(-8) : [];
  var G = null, gStop = null, msg3 = null, last3 = null;
  // station 2: the goalie simulation, regenerated from its seed
  function gNew(){ return { rng:MV.mdm.seededRandom(GOAL_SEED), n:0, h:0, last:null, stages:{} }; }
  function gStep(g){ var d = [], sv = 0; for (var i = 0; i < 20; i++) { var x = g.rng.int(100); d.push(x); if (x < 75) sv++; } g.n++; if (sv >= 16) g.h++; g.last = { d:d, sv:sv }; if (STAGES.indexOf(g.n) >= 0) g.stages[g.n] = g.h; }
  function gTo(n){ if (!G || G.n > n) G = gNew(); while (G.n < n) gStep(G); }
  gTo(S.s2.n);
  function done(id){ return id === "s1" ? !!S.s1.done : id === "s2" ? S.s2.n >= 1000 : !!S.s3.big; }
  host.innerHTML = '<div id="sm-tabs" class="sm-tabs"></div><div id="sm-body" class="sm-body"></div>';
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "S" + (i + 1) + ": " + s.name + (done(s.id) ? ' <span class="sm-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#sm-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ stopG(); S.cur = v; api.save(); paint(); } });
  function cur(){ return ST.filter(function(s){ return s.id === S.cur; })[0]; }
  function stopG(){ if (gStop) { gStop(); gStop = null; } }

  function digits(list, test, okMark){
    return '<div class="sm-digs">' + list.map(function(x){ var good = test(x), t = x < 10 && okMark === 2 ? "0" + x : String(x); return '<span class="sm-dg' + (good ? " sm-ok" : "") + '">' + t + '<small aria-hidden="true">' + (good ? "✓" : "✗") + "</small></span>"; }).join("") + "</div>";
  }
  function s1HTML(s){
    var cards = MV.shuffle(s.cards.slice(), "mdm4u-16-s1"), x = S.s1, lastC = x.last ? s.cards.filter(function(c){ return c.id === x.last; })[0] : null;
    var h = '<div class="sm-cards" role="group" aria-label="Random devices">' + cards.map(function(c){
      var tried = !!x.tried[c.id], good = MV.ok(c), cls = "sm-dev" + (tried ? (good ? " sm-yes" : " sm-no") : "");
      return '<button type="button" class="' + cls + '" data-dev="' + c.id + '" data-k="dev' + c.id + '" aria-pressed="' + (x.last === c.id) + '"' + (x.done ? " disabled" : "") + "><span>" + c.t + "</span>" +
        (tried ? '<span class="sm-p">' + Pw("save") + " = " + c.p + " " + (good ? "✓" : "✗") + "</span>" : "") + "</button>";
    }).join("") + "</div>";
    if (lastC) h += MV.fbHTML(MV.ok(lastC) ? "good" : "bad", (MV.ok(lastC) ? "<strong>✓ That matches.</strong> " : "<strong>✗ Not a match.</strong> ") + lastC.fb + (MV.ok(lastC) ? "" : " Try another device."));
    return h;
  }
  function s2HTML(s){
    var n = G.n, h = '<div class="sm-runrow" role="group" aria-label="Run the goalie simulation">';
    STAGES.forEach(function(t, i){ var prev = i ? STAGES[i - 1] : 0; h += '<button type="button" class="btn sm' + (n === prev ? " primary" : "") + '" data-gl="' + t + '" data-k="g' + t + '"' + (n !== prev || gStop ? " disabled" : "") + ">" + (t === 1 ? "Run 1 trial" : "Run to " + big(t) + " trials") + "</button>"; });
    h += '<button type="button" class="btn ghost sm" data-gl="0" data-k="g0"' + (n === 0 || gStop ? " disabled" : "") + ">Start again</button></div>";
    if (G.last) h += '<p class="sm-lab">Trial ' + big(n) + ": 20 shots (✓ = 00–74, a save)</p>" + digits(G.last.d, function(x){ return x < 75; }, 2) +
      '<p class="sm-res">' + G.last.sv + " saves: " + (G.last.sv >= 16 ? "<strong>at least 16 ✓</strong>" : "fewer than 16") + "</p>";
    else h += '<p class="tiny muted">Press “Run 1 trial” to simulate the first 20 shots.</p>';
    var rows = STAGES.filter(function(t){ return G.stages[t] != null; }).map(function(t){ return [big(t), big(G.stages[t]), (G.stages[t] / t).toFixed(4)]; });
    if (n && STAGES.indexOf(n) < 0) rows.push([big(n) + " (running)", big(G.h), (G.h / n).toFixed(4)]);
    h += '<div class="tbl-wrap"><table class="sm-tbl"><caption class="vh">Empirical probability at each stage</caption><thead><tr><th scope="col">Trials</th><th scope="col">With at least 16 saves</th><th scope="col">Empirical probability</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function(r){ return "<tr><td>" + r.join("</td><td>") + "</td></tr>"; }).join("") : '<tr><td colspan="3" class="muted">No trials yet</td></tr>') + "</tbody></table></div>";
    h += '<details class="alg"' + (n >= 1000 ? " open" : "") + '><summary>Check it with data</summary><p class="tiny">' + s.exactNote + "</p>" +
      '<div class="tbl-wrap"><table class="sm-tbl"><thead><tr><th scope="col">Trials</th><th scope="col">Estimate</th><th scope="col">Exact</th><th scope="col">Off by</th></tr></thead><tbody>' +
      (STAGES.filter(function(t){ return G.stages[t] != null; }).map(function(t){ var e = G.stages[t] / t; return "<tr><td>" + big(t) + "</td><td>" + e.toFixed(4) + "</td><td>" + s.exact.toFixed(4) + "</td><td>" + Math.abs(e - s.exact).toFixed(4) + "</td></tr>"; }).join("") || '<tr><td colspan="4" class="muted">Run the stages to compare each estimate with 0.4148.</td></tr>') +
      "</tbody></table></div>" + (n >= 1000 ? "<p>The estimates settle near 0.41 as the trials grow: the law of large numbers at work.</p>" : "") + "</details>";
    return h;
  }
  function s3HTML(s){
    var x = S.s3, k = x.k, pct = (k + 1) * 10;
    var h = '<div class="sm-s3in">' + stepperHTML("k", "Make digits: 0 to", k, 0, 8, "sm") +
      '<p class="tiny muted sm-dev3">' + (k === 0 ? "Digit 0 = make" : "0–" + k + " = make") + ": " + (k + 1) + " of the 10 digits, so " + Pw("make") + " = " + MV.num(pct / 100, 1) + " (" + pct + "%).</p>" +
      stepperHTML("shots", "Shots per trial", x.shots, 1, 10, "sm") + '<div id="sm-trials"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-act3="run" data-k="s3run">Run the simulation</button></div></div>';
    if (msg3) h += MV.fbHTML(msg3.kind, msg3.html);
    if (last3) h += '<p class="sm-lab">Last trial of that run: 5 shots (✓ = a make)</p>' + digits(last3.d, function(v){ return v <= 5; }, 1) + '<p class="sm-res">' + last3.mk + " makes: " + (last3.mk >= 4 ? "<strong>at least 4 ✓</strong>" : "fewer than 4") + "</p>";
    if (x.runs.length) h += '<div class="tbl-wrap"><table class="sm-tbl"><caption class="vh">Your simulation runs</caption><thead><tr><th scope="col">Run</th><th scope="col">Trials</th><th scope="col">At least 4 makes</th><th scope="col">Estimate</th></tr></thead><tbody>' +
      x.runs.map(function(r, i){ return "<tr><td>" + (i + 1) + "</td><td>" + big(r.N) + "</td><td>" + big(r.h) + "</td><td>" + (r.h / r.N).toFixed(4) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    var bigRun = x.runs.filter(function(r){ return r.N >= 1000; }).slice(-1)[0];
    h += '<details class="alg"' + (bigRun ? " open" : "") + '><summary>Check it with data</summary>' + (bigRun ?
      "<p>Exact value: " + MV.md(s.exactWork) + ".</p><p>Your 1000-trial estimate, " + (bigRun.h / bigRun.N).toFixed(4) + ", is off by " + Math.abs(bigRun.h / bigRun.N - s.exact).toFixed(4) + ".</p>" :
      '<p class="tiny">Run 1000 trials with a matching device to compare your estimate with the exact value.</p>') + "</details>";
    return h;
  }
  var trialsR = null;
  function paint(){
    tabText(); tabs.refresh();
    var s = cur(), i = ST.indexOf(s), body = $("#sm-body", host);
    MV.keepFocus(body, function(){
      body.innerHTML = '<div class="sm-head"><span class="sm-num">Station ' + (i + 1) + '</span><span class="sm-name">' + s.name + '</span></div><p class="sm-task">' + s.task + "</p>" +
        '<div class="sm-panel" id="sm-panel">' + (s.id === "s1" ? s1HTML(s) : s.id === "s2" ? s2HTML(s) : s3HTML(s)) + "</div>" +
        (done(s.id) ? '<p class="sm-done"><strong>✓ Station ' + (i + 1) + " complete.</strong> " + (ST.every(function(q){ return done(q.id); }) ? "All three stations done. Try the quick check below." : "Choose another station above.") + "</p>" : "");
    });
    if (s.id === "s3") trialsR = radios($("#sm-trials", host), { label:"Trials", options:["10", "100", "1000"].map(function(t){ return { id:t, t:big(+t) }; }), value:S.s3.trials, cls:"seg", onChange:function(v){ S.s3.trials = v; api.save(); } });
  }
  function runG(to){
    stopG();
    var from = G.n;
    if (to === 0) { G = gNew(); S.s2.n = 0; api.save(); paint(); return; }
    var stop = MV.tween({ dur:to - from > 50 ? 1400 : 500, ease:function(t){ return t; }, step:function(t){ gTo(Math.round(from + (to - from) * t)); var p = $("#sm-panel", host); if (p) p.innerHTML = s2HTML(cur()); },
      done:function(){ gStop = null; gTo(to); S.s2.n = to; api.save(); paint(); MV.focusFb($("#sm-panel", host)); } });
    gStop = function(){ stop(); gTo(to); S.s2.n = to; api.save(); };
    if (MV.reduceMotion) { /* tween already jumped to the end; done runs next tick */ }
    var p0 = $("#sm-panel", host); if (p0) p0.innerHTML = s2HTML(cur());
  }
  function run3(){
    var x = S.s3, k = x.k, N = +x.trials;
    if (k !== 5) { msg3 = { kind:"bad", html:"<strong>✗ The device doesn’t match.</strong> " + (k === 0 ? "Digit 0 = make gives 10%." : "0–" + k + " = make gives " + (k + 1) * 10 + "%.") + " A make should be 60%: use digits 0–5 out of 0–9." }; last3 = null; paint(); MV.focusFb($("#sm-panel", host)); return; }
    if (x.shots !== 5) { msg3 = { kind:"bad", html:"<strong>✗ Check the shots per trial.</strong> The question is about 5 free throws, so one trial is 5 shots: use 5 digits per trial." }; last3 = null; paint(); MV.focusFb($("#sm-panel", host)); return; }
    var r = MV.mdm.seededRandom("mdm4u-16-ft-" + N + "-" + x.runs.length), h = 0, d = null, mk = 0;
    for (var t = 0; t < N; t++) { d = []; mk = 0; for (var i = 0; i < 5; i++) { var v = r.int(10); d.push(v); if (v <= 5) mk++; } if (mk >= 4) h++; }
    x.runs.push({ N:N, h:h }); x.runs = x.runs.slice(-8); if (N >= 1000) x.big = true;
    last3 = { d:d, mk:mk };
    msg3 = { kind:"good", html:"<strong>✓ Your device matches 60%.</strong> " + big(h) + " of " + big(N) + " trials had at least 4 makes: empirical " + Pw("at least 4 of 5") + " = " + (h / N).toFixed(4) + "." + (N < 1000 ? " Run 1000 trials for a steadier estimate." : "") };
    api.save(); paint(); MV.focusFb($("#sm-panel", host));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.dev) { var c = cur().cards.filter(function(q){ return q.id === b.dataset.dev; })[0]; S.s1.tried[c.id] = true; S.s1.last = c.id; if (MV.ok(c)) S.s1.done = true; api.save(); paint(); MV.focusFb($("#sm-panel", host)); return; }
    if (b.dataset.gl != null) { runG(+b.dataset.gl); return; }
    if (b.dataset.sm) { var id = b.dataset.sm, x = S.s3; if (id === "k") x.k = clampInt(x.k + +b.dataset.d, 0, 8, 4); else x.shots = clampInt(x.shots + +b.dataset.d, 1, 10, 4); msg3 = null; api.save(); paint(); return; }
    if (b.dataset.act3 === "run") run3();
  });
  paint();
  return {};
}

// ---------- Practice: Odds and evidence (N4 number entry with a ratio box) ----------
// @component N4 ratioEntry — number entry (adapted from the toolkit's N4 numeric activity and MDM4U 12's numEntryWords) with
// three item kinds: "num" (one box: 48, 0.25, 4/13, 30%), "pair" (two labelled boxes, answer [a, b], tol [ta, tb]) and "ratio"
// (two boxes a : b; decimals are scaled to whole numbers, the reduced ratio shows live, and unreduced equivalents are accepted;
// wrong:[{ratio:[p, q], fb}] matches any equivalent ratio). First try = right on the first check without the worked solution.
function reduceRatio(a, b){
  if (a == null || b == null || a < 0 || b < 0 || (a === 0 && b === 0)) return null;
  for (var d = 0; d <= 4; d++) { var p = Math.pow(10, d), x = Math.round(a * p), y = Math.round(b * p); if (Math.abs(x - a * p) < 1e-6 && Math.abs(y - b * p) < 1e-6) { var g = gcd(x, y) || 1; return [x / g, y / g]; } }
  return null;
}
function oddsAct(host, api, a){
  var st = api.S; st.items = obj(st.items);
  var msgs = {};
  function ist(id){ var x = st.items[id] = obj(st.items[id]); x.v = Array.isArray(x.v) ? x.v.map(String) : ["", ""]; x.tries = x.tries || 0; x.hint = x.hint || 0; return x; }
  function judge(it, x){
    var ans = MV.ans(it), w = null;
    if (it.kind === "ratio") {
      var r = reduceRatio(parseVal(x.v[0]), parseVal(x.v[1]));
      if (!r) return { bad:"Enter a number in each box of the ratio, such as 17 and 3." };
      var A = reduceRatio(ans[0], ans[1]);
      if (r[0] === A[0] && r[1] === A[1]) return { ok:true };
      w = (it.wrong || []).filter(function(q){ var z = reduceRatio(q.ratio[0], q.ratio[1]); return z[0] === r[0] && z[1] === r[1]; })[0];
      return { ok:false, fb:w ? w.fb : null };
    }
    if (it.kind === "pair") {
      var v0 = parseVal(x.v[0]), v1 = parseVal(x.v[1]), tol = it.tol || [1e-9, 1e-9];
      if (v0 == null || v1 == null) return { bad:"Enter a number in both boxes." };
      return Math.abs(v0 - ans[0]) <= tol[0] && Math.abs(v1 - ans[1]) <= tol[1] ? { ok:true } : { ok:false };
    }
    var v = parseVal(x.v[0]);
    if (v == null) return { bad:"Enter a number, such as 48, 0.25 or 4/13." };
    if (Math.abs(v - ans) <= (it.tol || 1e-9) * Math.max(1, Math.abs(ans))) return { ok:true };
    w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) < 1e-6; })[0];
    return { ok:false, fb:w ? w.fb : null };
  }
  function redTxt(it, x){
    if (it.kind !== "ratio") return "";
    var p0 = parseVal(x.v[0]), p1 = parseVal(x.v[1]), r = reduceRatio(p0, p1);
    if (!r) return "";
    return r[0] === p0 && r[1] === p1 ? "in lowest terms" : "= " + r[0] + " : " + r[1] + " in lowest terms";
  }
  function inputs(it, x){
    var dis = x.solved ? " disabled" : "";
    function box(i, lab, cls){ return '<input class="numin' + (cls ? " " + cls : "") + '" id="od-' + it.id + "-" + i + '" data-oin="' + it.id + '" data-p="' + i + '" data-k="od' + it.id + i + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.v[i] || "") + '"' + dis + (lab ? ' aria-label="' + MV.esc(lab) + '"' : "") + ">"; }
    if (it.kind === "ratio") return '<div class="numrow od-ratio"><span class="od-rl" id="od-l-' + it.id + '">Ratio:</span>' + box(0, "Ratio, first part", "od-rin") + '<span class="od-colon" aria-hidden="true">:</span>' + box(1, "Ratio, second part", "od-rin") + '<span class="od-red tiny muted" id="od-red-' + it.id + '" aria-live="polite">' + redTxt(it, x) + "</span></div>";
    if (it.kind === "pair") return it.labels.map(function(l, i){ return '<div class="numrow"><label for="od-' + it.id + "-" + i + '">' + l + ":</label>" + box(i) + "</div>"; }).join("");
    return '<div class="numrow"><label for="od-' + it.id + '-0">Your answer:</label>' + box(0) + "</div>";
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-odq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += inputs(it, x);
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.oin; if (!id) return;
    var it = a.items.filter(function(z){ return z.id === id; })[0], x = ist(id); x.v[+e.target.dataset.p] = e.target.value; api.save();
    var red = document.getElementById("od-red-" + id); if (red) red.textContent = redTxt(it, x);
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.oin) { var b = host.querySelector('[data-k="' + e.target.dataset.oin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-odq]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.odq; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-odq="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb || it.general || "Check your work and try again.") + " Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-odq="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Spinner designer ----------
var task = (function(){
  var api = null, tw = null;
  var KEYS = ["r", "b", "g", "y"], LET = { r:"R", b:"B", g:"G", y:"Y" };
  function st(){ var s = api ? api.S : {}; KEYS.forEach(function(k){ s[k] = clampInt(s[k], 1, 9, 3); }); return s; }
  function read(){ var s = st(); return { r:s.r, b:s.b, g:s.g, y:s.y }; }
  function tot(d){ return d.r + d.b + d.g + d.y; }
  function key(d){ return [d.r, d.b, d.g, d.y].join(","); }
  function cols(d){ var a = []; KEYS.forEach(function(k){ for (var i = 0; i < d[k]; i++) a.push(LET[k]); }); return a; }
  function paint(){
    var d = read(), s = st(), T = tot(d), inp = $("#sd-in"), pvh = $("#sd-pv"); if (!inp || !pvh) return;
    MV.keepFocus(inp, function(){
      inp.innerHTML = KEYS.map(function(k){ return stepperHTML(k, '<i class="mdm-sw te-sw' + LET[k] + '"></i>' + MV.cap(CW[LET[k]]) + " " + M(k), d[k], 1, 9, "sd"); }).join("") +
        '<p class="sd-tot' + (T === 12 ? " sd-ok" : "") + '" aria-live="polite">Total: ' + T + " of 12 sectors" + (T === 12 ? " ✓" : T > 12 ? " (too many)" : " (too few)") + "</p>";
    });
    var emp = s.emp && s.emp.key === key(d) ? s.emp : null, sim = tw ? tw : null;
    var counts = sim ? sim.c : emp ? emp.c : null, done = sim ? sim.n : emp ? 1000 : 0;
    var h = '<div class="sd-spin">' + (T === 12 ? spinSVG(cols(d), { letters:true, aria:"Spinner with 12 sectors: red " + d.r + ", blue " + d.b + ", green " + d.g + ", yellow " + d.y + "." }) : '<p class="tiny muted">The preview appears when the total is 12.</p>') + "</div>";
    h += '<div class="tbl-wrap"><table class="sd-tbl"><caption class="vh">Theoretical and simulated frequencies</caption><thead><tr><th scope="col">Colour</th><th scope="col">Sectors</th><th scope="col">Theoretical <i>P</i></th><th scope="col">Odds in favour</th><th scope="col">' + (done ? big(done) + " spins" : "1000 spins") + "</th></tr></thead><tbody>" +
      KEYS.map(function(k){ var c = LET[k]; return '<tr><th scope="row"><i class="mdm-sw te-sw' + c + '"></i>' + MV.cap(CW[c]) + "</th><td>" + d[k] + "</td><td>" + (T === 12 ? F.prob(d[k], 12) : "—") + "</td><td>" + (T === 12 ? ratioTxt(d[k], 12 - d[k]) : "—") + "</td><td>" + (counts ? big(counts[c]) + " (" + (counts[c] / Math.max(1, done)).toFixed(3) + ")" : "—") + "</td></tr>"; }).join("") +
      "</tbody></table></div>" +
      '<div class="q-actions"><button type="button" class="btn sm" id="sd-sim" data-k="sdsim"' + (T !== 12 || tw ? " disabled" : "") + ">Spin 1000 times</button></div>";
    pvh.innerHTML = h;
  }
  function spin1000(){
    var d = read(); if (tot(d) !== 12 || tw) return;
    var c0 = cols(d), r = MV.mdm.seededRandom("mdm4u-16-task-" + key(d)), out = [], i;
    for (i = 0; i < 1000; i++) out.push(c0[r.int(12)]);
    var fin = function(){ var c = { R:0, B:0, G:0, Y:0 }; out.forEach(function(x){ c[x]++; }); api.S.emp = { key:key(d), c:c }; tw = null; api.save(); paint(); };
    tw = { n:0, c:{ R:0, B:0, G:0, Y:0 } };
    MV.tween({ dur:1200, ease:function(t){ return t; }, step:function(t){ if (!tw) return; var to = Math.round(1000 * t); while (tw.n < to) { tw.c[out[tw.n]]++; tw.n++; } paint(); }, done:fin });
  }
  return {
    render:function(inp, pvh, a){
      api = a; st();
      inp.innerHTML = '<div id="sd-in" class="sd-in"></div>'; pvh.innerHTML = '<div id="sd-pv" class="sd-pv"></div>';
      $("#sd-in").addEventListener("click", function(e){
        var b = e.target.closest("button[data-sd]"); if (!b || b.disabled) return;
        var s = st(), id = b.dataset.sd; s[id] += +b.dataset.d; st(); api.save(); paint(); api.update();
      });
      $("#sd-pv").addEventListener("click", function(e){ var b = e.target.closest("#sd-sim"); if (b && !b.disabled) spin1000(); });
      paint();
      repaint["final-check"] = paint;
    },
    read:read,
    valid:function(d){ var T = tot(d); return T === 12 ? true : "Use exactly 12 sectors, with at least one of each colour. Your spinner has " + T + "."; },
    checks:function(d){ return [d.r === 4, d.b < d.r && d.b < d.g && d.b < d.y, 12 - d.y <= 3 * d.y, d.y <= Math.max(d.r, d.b, d.g)]; },
    key:key,
    label:function(k){ return M("(r, b, g, y) = (" + k.split(",").join(", ") + ")"); },
    text:function(k){ return "(r, b, g, y) = (" + k.split(",").join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ odds:oddsAct },
  task:task,
  onShow:function(v){ if (repaint[v]) MV.wait(30, repaint[v]); }
});
})();
