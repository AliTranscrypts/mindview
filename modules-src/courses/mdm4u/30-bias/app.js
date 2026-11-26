// MDM4U 30 Sources of Bias in Surveys: hero (a true-support bar beside an estimate bar: a landline list pulls the estimate
// to 40%, a leading question pushes it to 55%, a ×10 sample shrinks only the error whisker), Bias switchboard (Explore: D12
// sampling lab in switchboard form: four bias switches, a sample-size slider, Switchboard / Repeated polls / Question lab
// modes), Media watch (Part 3: five made-up news items, Check it with data), Fair survey task. Expected estimates come from
// the stated model formula (exact); only the Repeated polls dots use seeded random draws, for display.
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? clamp(v, lo, hi) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
// a number with up to dp decimals (zeros trimmed), true minus
function dN(v, dp){ dp = dp == null ? 2 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
// a proportion as a percent with exactly 1 decimal, rounding halves up (0.6175 -> "61.8")
function r1(v){ return Math.round(v * 1000 + 1e-7) / 10; }
function pc1(v){ return r1(v).toFixed(1); }
function sgn1(x){ var s = Math.abs(x).toFixed(1); return (x < -1e-9 ? MV.MINUS : x > 1e-9 ? "+" : "") + s; }

// @component radioGroup (copied from MDM4U 19 / 18) — segmented control or chip row as a real radio group
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

// ---------- the model town (plan D12; "model data") ----------
// expected estimate = Σ (residents × frame share × response rate × yes rate) ÷ Σ (residents × frame share × response rate);
// leading wording adds 0.15 to each yes rate; the response-bias switch then applies estimate + 0.10 × (1 − estimate).
var GR = [{ t:"Youth (15–24)", s:"Youth", N:100, p:0.8 }, { t:"Adults (25–64)", s:"Adults", N:200, p:0.45 }, { t:"Seniors (65+)", s:"Seniors", N:100, p:0.3 }];
var ONE = [1, 1, 1], LAND = [0.1, 0.5, 0.9], NORESP = [0.2, 0.5, 0.8];
// VERIFY: the task's extra frames and "whoever answers first" factors are not in the plan; invented to drive the task gauge.
var SHOP = [0.3, 0.05, 0.01], WEB = [0.25, 0.1, 0.05], FIRST = [0.4, 0.7, 1];
function model(o){
  var num = 0, den = 0, reach = [], who = [];
  GR.forEach(function(g, i){
    var r = g.N * o.frame[i] * (o.sel ? o.sel[i] : 1), w = r * o.resp[i], p = clamp(g.p + (o.shift || 0), 0, 1);
    reach.push(r); who.push(w); num += w * p; den += w;
  });
  var e = num / den; if (o.rb) e = e + 0.1 * (1 - e);
  return { E:e, reach:reach, who:who };
}
var KEYS = ["s", "nr", "m", "r"];
var SWN = { s:"Sampling bias", nr:"Non-response bias", m:"Measurement bias", r:"Response bias" };
var SWD = { s:"Sample from the landline phone list.", nr:"No follow-up calls.", m:"Ask ‘Don’t you agree the town needs a safe place for teens to skate?’", r:"Interviews are done face to face by members of the skate park committee." };
var SWWHY = { s:"the frame under-covers young residents, who support the park most", nr:"without follow-ups, young residents rarely respond",
  m:"the leading question pushes everyone toward yes", r:"some opponents say yes to please the committee interviewers" };
var SWIC = {
  s:'<svg viewBox="0 0 24 24"><path d="M6 3h4l1.5 4.5-2.3 1.6a12 12 0 0 0 5.7 5.7l1.6-2.3L21 14v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/></svg>',
  nr:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3 7l9 6 9-6"/><path d="M15 2l6 6M21 2l-6 6"/></svg>',
  m:'<svg viewBox="0 0 24 24"><path d="M4 5h16v10H9l-5 4z"/><path d="M10 8.5a2 2 0 1 1 2.6 1.9c-.5.2-.6.6-.6 1.1M12 13.3v.2"/></svg>',
  r:'<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0M13.5 19a4 4 0 0 1 8 0"/></svg>' };
function swModel(sw){ return model({ frame:sw.s ? LAND : ONE, resp:sw.nr ? NORESP : ONE, shift:sw.m ? 0.15 : 0, rb:!!sw.r }); }
var WORDS = [
  { id:"n1", t:"“Do you support or oppose building a skate park?”", lead:false },
  { id:"n2", t:"“Should the town build a skate park? (Yes / No / Unsure)”", lead:false },
  { id:"l1", t:"“Don’t you agree the town needs a safe place for teens to skate?”", lead:true },
  { id:"l2", t:"“Wouldn’t a skate park give our teens a healthy place to go?”", lead:true }];
function isLead(id){ var w = WORDS.filter(function(x){ return x.id === id; })[0]; return !!(w && w.lead); }
function combos(){ var L = []; for (var b = 0; b < 16; b++) { var sw = {}; KEYS.forEach(function(k, i){ sw[k] = !!(b & (1 << i)); }); L.push(sw); } return L.sort(function(a, b){ return cnt(a) - cnt(b); }); }
function cnt(sw){ return KEYS.filter(function(k){ return sw[k]; }).length; }
function onList(sw){ return KEYS.filter(function(k){ return sw[k]; }); }
function comboName(sw){ var on = onList(sw); return on.length ? on.map(function(k){ return SWN[k].replace(" bias", ""); }).join(" + ").toLowerCase().replace(/^./, function(c){ return c.toUpperCase(); }) : "None"; }
function verdict(sw, E){
  var on = onList(sw), b = r1(E) - 50;
  if (!on.length) return "Unbiased by design: random selection from a full frame, follow-ups and a neutral question.";
  var why = on.map(function(k){ return SWWHY[k]; }).join("; ");
  if (Math.abs(b) < 2) return "Close to the truth, but only by luck: " + why + ". The pushes happen to cancel.";
  return (b < 0 ? "Biased low: " : "Biased high: ") + why + ".";
}

// ---------- drawing: the estimate gauge (Switchboard, Question lab, task) and the repeated-polls dot cloud ----------
// drawBoard(plot, {E (proportion or null), marg (percentage points or null), polls:[percent] or null, lo, hi, describe, note})
function drawBoard(plot, o){
  var rc = plot.c.getBoundingClientRect(), W0 = Math.max(200, rc.width), H0 = Math.max(120, rc.height);
  plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, L = 24, R = 24, lo = o.lo || 10, hi = o.hi || 90;
    var X = function(v){ return L + (v - lo) / (hi - lo) * (W - L - R); };
    var ink = css("--ink"), ink2 = css("--ink-2"), teal = css("--f3"), pen = css("--pen"), hl = css("--hi"), sheet = css("--sheet"), rule = css("--rule"), paper = css("--paper");
    var fUI = p.fontUI, small = W < 420;
    var yA = H - 28, v;
    ctx.save();
    // axis with ticks every 5 (labels every 10)
    ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(lo), yA + 0.5); ctx.lineTo(X(hi), yA + 0.5); ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = (small ? "11px " : "12px ") + fUI; ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (v = lo; v <= hi; v += 5) {
      var big = v % 10 === 0; ctx.beginPath(); ctx.moveTo(X(v), yA - (big ? 5 : 3)); ctx.lineTo(X(v), yA + (big ? 5 : 3)); ctx.stroke();
      if (big && (!small || v % 20 === 10)) ctx.fillText(v + "%", X(v), yA + 7);
    }
    // the truth: dashed teal
    ctx.strokeStyle = teal; ctx.lineWidth = 2.2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(X(50), 22); ctx.lineTo(X(50), yA); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = teal; ctx.font = "700 13px " + fUI; ctx.textBaseline = "top";
    if (o.polls) { ctx.textAlign = "right"; ctx.fillText("truth 50%", X(50) - 4, 4); } else { ctx.textAlign = "center"; ctx.fillText("truth 50%", X(50), 4); }
    if (o.polls) {
      // dot plot: one dot per poll, stacked in 1-point bins
      var bw = (W - L - R) / (hi - lo), rr = clamp(bw * 0.42, 2, 5), bins = {};
      ctx.fillStyle = pen; ctx.strokeStyle = sheet; ctx.lineWidth = 1;
      o.polls.forEach(function(q){
        var b = Math.round(clamp(q, lo, hi)), k = bins[b] = (bins[b] || 0) + 1, y = yA - rr - 3 - (k - 1) * (2 * rr + 1);
        if (y < 30) return;
        ctx.beginPath(); ctx.arc(X(b), y, rr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      if (o.E != null) {
        var xe = X(r1(o.E));
        ctx.strokeStyle = ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(xe, 22); ctx.lineTo(xe, yA); ctx.stroke();
        ctx.fillStyle = ink; ctx.font = "700 13px " + fUI; ctx.textAlign = "left"; ctx.textBaseline = "top";
        var lab = "expected " + pc1(o.E) + "%", lw = ctx.measureText(lab).width, lx = clamp(xe + 4, 4, W - lw - 4);
        ctx.fillStyle = sheet; ctx.globalAlpha = 0.85; ctx.fillRect(lx - 2, 20, lw + 4, 17); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.fillText(lab, lx, 22);
      }
    } else {
      var y0 = Math.max(26, (H - 190) / 2 + 8), yBias = y0 + 40, yWh = yBias + 32, yT = yWh + 28, yE = yT + 22;
      // track
      ctx.fillStyle = paper; ctx.strokeStyle = rule; ctx.lineWidth = 1.5;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(X(lo), yT - 7, X(hi) - X(lo), 14, 7); else ctx.rect(X(lo), yT - 7, X(hi) - X(lo), 14); ctx.fill(); ctx.stroke();
      if (o.E == null) {
        ctx.fillStyle = ink; ctx.font = "700 14px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(o.note || "estimate: can’t tell", W / 2, yE);
      } else {
        var e = r1(o.E), x = X(clamp(e, lo, hi)), bias = e - 50;
        // bias arrow (highlighter), from the truth to the estimate
        if (Math.abs(bias) >= 0.05) {
          var dir = bias > 0 ? 1 : -1, x0 = X(50), x1 = x;
          ctx.strokeStyle = hl; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0, yBias); ctx.lineTo(x1 - dir * 8, yBias); ctx.stroke(); ctx.lineCap = "butt";
          ctx.fillStyle = hl; ctx.beginPath(); ctx.moveTo(x1, yBias); ctx.lineTo(x1 - dir * 13, yBias - 9); ctx.lineTo(x1 - dir * 13, yBias + 9); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.fillStyle = ink; ctx.font = "600 12px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        var bl = "bias " + sgn1(bias) + " points", bx = clamp((X(50) + x) / 2, ctx.measureText(bl).width / 2 + 4, W - ctx.measureText(bl).width / 2 - 4);
        ctx.fillText(bl, bx, yBias - 10);
        // random margin whisker
        if (o.marg != null) {
          var a = X(clamp(e - o.marg, lo, hi)), b2 = X(clamp(e + o.marg, lo, hi));
          ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a, yWh); ctx.lineTo(b2, yWh); ctx.moveTo(a, yWh - 6); ctx.lineTo(a, yWh + 6); ctx.moveTo(b2, yWh - 6); ctx.lineTo(b2, yWh + 6); ctx.stroke();
          ctx.fillStyle = ink2; ctx.font = "12px " + fUI; ctx.textBaseline = "middle";
          var ml = "±" + dN(o.marg, 1) + "% random margin", mw = ctx.measureText(ml).width;
          if (b2 + 6 + mw < W - 2) { ctx.textAlign = "left"; ctx.fillText(ml, b2 + 6, yWh); } else { ctx.textAlign = "right"; ctx.fillText(ml, a - 6, yWh); }
        }
        // needle
        ctx.strokeStyle = ink; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(x, yWh - 12); ctx.lineTo(x, yT + 12); ctx.stroke();
        ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(x, yT, 6, 0, Math.PI * 2); ctx.fill();
        ctx.font = "700 14px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "top";
        var el = "estimate " + pc1(o.E) + "%", ew = ctx.measureText(el).width;
        ctx.fillText(el, clamp(x, ew / 2 + 4, W - ew / 2 - 4), yE);
      }
    }
    ctx.restore();
  } });
}

// ---------- Explore: Bias switchboard ----------
// @component D12 samplingLab — switchboard form (course plan D12): four bias switches (native checkboxes styled as toggles),
// sample-size slider, an exact expected-estimate gauge with a ±1/√n whisker, a seeded 50-poll dot cloud, and a Question lab
// whose wording choice drives the measurement switch. The estimates come from the formula, not from random draws.
var POLLS = 50, NMAX = 400, UNI = null;
function uniforms(){
  if (UNI) return UNI;
  var g = MV.mdm.seededRandom("mdm30-polls"); UNI = [];
  for (var i = 0; i < POLLS; i++) { var row = new Float64Array(NMAX); for (var j = 0; j < NMAX; j++) row[j] = g(); UNI.push(row); }
  return UNI;
}
function pollsFor(E, n){ var U = uniforms(); return U.map(function(row){ var y = 0; for (var j = 0; j < n; j++) if (row[j] < E) y++; return 100 * y / n; }); }

function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (["sw", "polls", "lab"].indexOf(S.mode) < 0) S.mode = "sw";
    S.sw = obj(S.sw); KEYS.forEach(function(k){ S.sw[k] = !!S.sw[k]; });
    S.n = Math.round(clampI(S.n, 40, 400, 100) / 20) * 20;
    if (!WORDS.some(function(w){ return w.id === S.word; })) S.word = "n1";
    if (S.sw.m !== isLead(S.word)) S.word = S.sw.m ? "l1" : "n1";
    S.tc3 = obj(S.tc3); if (["idle", "locked", "done"].indexOf(S.tc3.ph) < 0) S.tc3.ph = "idle";
    S.tc3.val = typeof S.tc3.val === "string" ? S.tc3.val : "";
    S.tc3.pred = typeof S.tc3.pred === "number" && isFinite(S.tc3.pred) ? S.tc3.pred : null;
    if (S.tc3.ph === "done" && S.tc3.pred == null) S.tc3.ph = "idle";
    if (S.tc3.ph === "locked") KEYS.forEach(function(k){ S.sw[k] = false; });
  }
  sanitize();
  var busy = false, disp = null, twStop = null, twTok = 0, timers = [], msg = "", t3msg = "", cap = "";
  host.innerHTML =
    '<div class="bs-top"><div id="bs-mode"></div></div>' +
    '<div class="pg bs-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap bs-cap" id="bs-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot bs-plot" id="bs-plot" role="img" aria-label="Estimate gauge"></canvas></div>' +
      '<div id="bs-lab" class="bs-lab" hidden></div>' +
      '<details class="alg"><summary>About this model</summary>' +
        '<p class="tiny"><span class="mdm-model">model data</span> A town of 400 residents aged 15 and over is asked “Do you support or oppose building a skate park?”</p>' +
        MV.tableHTML({ head:["Group", "Residents", "Truly support", "Landline frame reaches", "Respond with no follow-up"], caption:"The model town",
          rows:GR.map(function(g, i){ return [g.t, String(g.N), dN(100 * g.p, 0) + "%", dN(100 * LAND[i], 0) + "%", dN(100 * NORESP[i], 0) + "%"]; }).concat([["<strong>Town</strong>", "<strong>400</strong>", "<strong>50%</strong> (the parameter)", "", ""]]) }) +
        '<p class="tiny">Expected estimate = Σ (residents × frame share × response rate × yes rate) ÷ Σ (residents × frame share × response rate). The leading wording adds 0.15 to each yes rate. The response-bias switch then applies estimate + 0.10 × (1 − estimate). The random margin (95%) is about 1 ÷ √<i>n</i>.</p>' +
        '<p class="tiny">Some sources call leading questions response bias; here, because the question itself does the pushing, it’s measurement bias.</p></details>' +
      '<details class="alg bs-all"><summary>All combinations</summary><div id="bs-all"></div></details></div>' +
    '<div class="pg-ctrl"><div class="bs-sws" role="group" aria-label="Bias switches">' + KEYS.map(function(k){
        return '<label class="bs-sw" for="bs-sw-' + k + '"><input type="checkbox" role="switch" class="bs-cb" id="bs-sw-' + k + '" data-sw="' + k + '" data-k="bs' + k + '" aria-describedby="bs-swd-' + k + ' bs-lockmsg">' +
          '<span class="bs-track" aria-hidden="true"><span class="bs-knob"></span></span><span class="bs-ic" aria-hidden="true">' + SWIC[k] + '</span><span class="bs-swt"><strong>' + SWN[k] + '</strong><span class="bs-swd" id="bs-swd-' + k + '">' + SWD[k] + "</span></span></label>";
      }).join("") + '<p class="tiny bs-lockmsg" id="bs-lockmsg" aria-live="polite"></p></div>' +
      '<label class="slider bs-n"><span class="slider-top"><span>Sample size <i>n</i></span><output id="bs-n-out"></output></span><input type="range" id="bs-n" min="40" max="400" step="20" data-k="bsn"></label>' +
      '<div class="bs-tc3" id="bs-tc3"></div></div>' +
    '<div class="pg-read"><dl class="read" id="bs-read" aria-live="polite"></dl></div></div>';
  var plot = new MV.Plot($("#bs-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintPlot;
  var modeR = radios($("#bs-mode", host), { label:"Mode", options:[{ id:"sw", t:"Switchboard" }, { id:"polls", t:"Repeated polls" }, { id:"lab", t:"Question lab" }], value:S.mode, cls:"seg",
    onChange:function(v){ S.mode = v; save(); render(); } });
  var labR = null;

  function save(){ api.save(); }
  function cur(){ return swModel(S.sw); }
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }
  function stopTw(){ twTok++; if (twStop) { twStop(); twStop = null; } disp = null; }
  // change the switches, then ease the needle from the old estimate to the new one
  function change(fn, done){
    var from = disp != null ? disp : cur().E; stopTw(); fn(); var to = cur().E, tok = twTok;
    render();
    if (MV.reduceMotion || Math.abs(to - from) < 1e-9 || S.mode === "polls") { if (done) done(); return; }
    disp = from; paintPlot();
    twStop = MV.tween({ dur:850, step:function(t){ if (tok !== twTok) return; disp = from + (to - from) * t; paintPlot(); }, done:function(){ if (tok !== twTok) return; twStop = null; disp = null; paintPlot(); if (done) done(); } });
  }
  function setSw(k, on){ S.sw[k] = on; if (k === "m") S.word = on ? (isLead(S.word) ? S.word : "l1") : (isLead(S.word) ? "n1" : S.word); }

  function paintPlot(){
    var d = cur(), E = disp != null ? disp : d.E, marg = 100 / Math.sqrt(S.n);
    if (S.mode === "polls") {
      var pl = pollsFor(d.E, S.n), mn = Math.min.apply(null, pl), mx = Math.max.apply(null, pl);
      drawBoard(plot, { E:d.E, polls:pl, describe:"Dot plot of 50 repeated polls of " + S.n + " people. The dots spread from " + dN(mn, 1) + "% to " + dN(mx, 1) + "%, around the expected estimate " + pc1(d.E) + "%; the true support, 50%, is marked with a dashed line." });
    } else {
      drawBoard(plot, { E:E, marg:marg, describe:"Estimate gauge: expected estimate " + pc1(E) + "%, truth 50%, bias " + MV.plain(sgn1(r1(E) - 50)) + " percentage points, random margin plus or minus " + dN(marg, 1) + "% at n = " + S.n + "." });
    }
  }
  function readHTML(){
    var d = cur(), e = r1(d.E), b = e - 50, marg = 100 / Math.sqrt(S.n);
    var reach = S.sw.s ? GR.map(function(g, i){ return g.s + " " + dN(d.reach[i], 1); }).join(" · ") : "Everyone: " + GR.map(function(g){ return g.s + " " + g.N; }).join(" · ");
    var who = S.sw.nr ? GR.map(function(g, i){ return g.s + " " + dN(d.who[i], 1); }).join(" · ") : "All reached (follow-ups on)";
    return MV.readoutHTML([
      ["True support (parameter)", "50%"],
      ["Reached by the frame", reach + ' <span class="tiny muted">(out of 100, 200 and 100)</span>'],
      ["Who responds", who],
      ["Expected estimate", "<strong>" + pc1(d.E) + "%</strong>"],
      ["Bias", "<strong>" + sgn1(b) + "</strong> percentage points"],
      ["Random margin (95%)", "±" + dN(marg, 1) + "% at <i>n</i> = " + S.n + " (≈ 1/√<i>n</i>)"],
      ["Verdict", '<span class="bs-verdict">' + verdict(S.sw, d.E) + "</span>"]]);
  }
  function allHTML(){
    var C = combos(), key = onList(S.sw).join("+"), hi = -1;
    var rows = C.map(function(sw, i){ if (onList(sw).join("+") === key) hi = i; return [comboName(sw), pc1(swModel(sw).E) + "%"]; });
    return MV.tableHTML({ head:["Switches on", "Expected estimate"], caption:"Expected estimates for every combination of switches", rows:rows, hiRow:hi }) + '<p class="tiny muted">The highlighted row is your current setting.</p>';
  }
  function tc3HTML(){
    var t = S.tc3, dis = busy ? " disabled" : "";
    if (t.ph === "locked") return '<p class="bs-t3h"><strong>Challenge 3:</strong> predict the estimate with sampling bias and measurement bias both on.</p>' +
      '<div class="numrow"><label for="bs-t3in">Your prediction (%)</label><input class="numin" id="bs-t3in" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(t.val) + '"' + dis + '>' +
      '<button type="button" class="btn primary sm" id="bs-t3sub" data-k="bst3sub"' + dis + ">Submit prediction</button></div>" + (t3msg ? MV.fbHTML("bad", t3msg) : "");
    if (t.ph === "done") return '<p class="bs-t3h"><strong>Challenge 3:</strong> you predicted <strong>' + dN(t.pred, 1) + "%</strong>. The switches unlocked and the gauge shows the model with both switches on: <strong>55.0%</strong>. Press <strong>Check challenge</strong> on challenge 3.</p>" +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="bs-t3again" data-k="bst3again"' + dis + ">Predict again</button></div>";
    return '<p class="bs-t3h"><strong>Challenge 3 (stretch):</strong> predict before you flip. Starting it turns every switch off and locks them until you submit a prediction.</p>' +
      '<div class="q-actions"><button type="button" class="btn sm" id="bs-t3go" data-k="bst3go"' + dis + ">Start challenge 3</button></div>";
  }
  function labHTML(){
    return '<p class="bs-labq"><strong>Question lab.</strong> Rewrite the survey question by picking a version. A leading version turns the measurement-bias switch on; a neutral one turns it off.</p><div id="bs-wr"></div>' +
      '<p class="tiny bs-labst">Measurement-bias switch: <strong>' + (S.sw.m ? "on" : "off") + "</strong> (" + (S.sw.m ? "the wording pushes honest people toward yes" : "neutral wording") + ")</p>" +
      '<p class="tiny muted">Some sources call leading questions response bias; here, because the question itself does the pushing, it’s measurement bias.</p>';
  }
  function render(){
    var locked = S.tc3.ph === "locked";
    modeR.set(S.mode); modeR.lock(busy);
    KEYS.forEach(function(k){
      var cb = $("#bs-sw-" + k, host); cb.checked = !!S.sw[k]; cb.disabled = busy;
      if (locked) cb.setAttribute("aria-disabled", "true"); else cb.removeAttribute("aria-disabled");
      cb.closest(".bs-sw").classList.toggle("bs-locked", locked);
    });
    $("#bs-lockmsg", host).textContent = locked ? "Locked for challenge 3: submit your prediction first." + (msg ? " " + msg : "") : msg;
    var sl = $("#bs-n", host); sl.value = S.n; sl.disabled = busy; sl.setAttribute("aria-valuetext", "n = " + S.n);
    $("#bs-n-out", host).textContent = S.n;
    var t3 = $("#bs-tc3", host); MV.keepFocus(t3, function(){ t3.innerHTML = tc3HTML(); });
    var lab = $("#bs-lab", host);
    if (S.mode === "lab") {
      if (lab.hidden || !labR) { lab.hidden = false; lab.innerHTML = labHTML(); labR = radios($("#bs-wr", lab), { label:"Wording", options:WORDS.map(function(w){ return { id:w.id, t:w.t }; }), value:S.word, cls:"chips",
        onChange:function(v){ if (busy) { labR.set(S.word); return; } change(function(){ S.word = v; S.sw.m = isLead(v); msg = ""; }); save(); MV.changed(); } }); }
      else { var st = $(".bs-labst", lab); if (st) st.innerHTML = 'Measurement-bias switch: <strong>' + (S.sw.m ? "on" : "off") + "</strong> (" + (S.sw.m ? "the wording pushes honest people toward yes" : "neutral wording") + ")"; }
      labR.set(S.word); labR.lock(busy || locked);
    } else { lab.hidden = true; lab.innerHTML = ""; labR = null; }
    $("#bs-cap", host).textContent = cap || (S.mode === "polls" ? "50 repeated polls of n = " + S.n + " (seeded, so they repeat)" : "Expected estimate: " + pc1(disp != null ? cur().E : cur().E) + "%");
    $("#bs-read", host).innerHTML = readHTML();
    $("#bs-all", host).innerHTML = allHTML();
    paintPlot();
  }

  host.addEventListener("click", function(e){
    var cb = e.target.closest("input[data-sw]");
    if (cb && S.tc3.ph === "locked") { e.preventDefault(); msg = ""; $("#bs-lockmsg", host).textContent = "Locked for challenge 3: submit your prediction first."; return; }
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.id === "bs-t3go" || b.id === "bs-t3again") {
      cap = ""; msg = ""; t3msg = ""; S.tc3.ph = "locked"; S.tc3.pred = null;
      change(function(){ KEYS.forEach(function(k){ setSw(k, false); }); });
      save(); MV.changed(); var inp = $("#bs-t3in", host); if (inp) inp.focus(); return;
    }
    if (b.id === "bs-t3sub") submitT3();
  });
  function submitT3(){
    var raw = String(S.tc3.val || "").replace(/%/g, "").trim(), r = raw ? MV.parseNum(raw) : null, v = r && r.length === 1 && isFinite(r[0]) ? r[0] : null;
    if (v == null || v < 0 || v > 100) { t3msg = "Enter a percent from 0 to 100, such as 47.5."; render(); MV.focusFb($("#bs-tc3", host)); return; }
    t3msg = ""; S.tc3.pred = v; S.tc3.ph = "done"; cap = "";
    change(function(){ KEYS.forEach(function(k){ setSw(k, k === "s" || k === "m"); }); });
    save(); MV.changed();
    var again = $("#bs-t3again", host); if (again) again.focus();
  }
  host.addEventListener("change", function(e){
    var cb = e.target.closest("input[data-sw]"); if (!cb) return;
    if (S.tc3.ph === "locked" || busy) { cb.checked = !!S.sw[cb.dataset.sw]; return; }
    cap = ""; msg = "";
    change(function(){ setSw(cb.dataset.sw, cb.checked); });
    save(); MV.changed();
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "bs-n") { if (busy) return; S.n = clampI(t.value, 40, 400, 100); cap = ""; save(); render(); MV.changed(); return; }
    if (t.id === "bs-t3in") { S.tc3.val = t.value; save(); }
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.id === "bs-t3in") { e.preventDefault(); submitT3(); } });

  render();

  // --- predictions ---
  function clearAll(){ timers.forEach(clearTimeout); timers = []; stopTw(); busy = false; }
  function startPred(p){
    clearAll();
    var st = p.start || {};
    if (S.tc3.ph === "locked") S.tc3.ph = "idle";
    KEYS.forEach(function(k){ S.sw[k] = (st.sw || []).indexOf(k) >= 0; });
    S.word = S.sw.m ? "l1" : "n1"; S.n = st.n || 100; S.mode = st.mode || "sw"; msg = ""; cap = "";
    save(); render();
  }
  function runPred(p, done){
    busy = true; render();
    var fin = function(){ busy = false; cap = ""; save(); render(); MV.changed(); done(); };
    if (p.id === "p2") {
      if (MV.reduceMotion) { S.n = 400; fin(); return; }
      var n = S.n;
      (function next(){ if (n >= 400) { later(500, fin); return; } n += 20; S.n = n; cap = "Sample size n = " + n + ": the cloud narrows"; render(); later(150, next); })();
      return;
    }
    if (p.id === "p4") {
      var seq = ["s", "nr", "m"], i = 0;
      cap = "All three on: " + pc1(cur().E) + "%"; render();
      (function step(){
        if (i >= seq.length) { cap = "All three back on: " + pc1(cur().E) + "%, close by luck"; render(); later(MV.reduceMotion ? 0 : 900, fin); return; }
        var k = seq[i++];
        change(function(){ setSw(k, false); cap = "Without " + SWN[k].toLowerCase() + ": " + pc1(swModel(Object.assign({}, S.sw, (function(){ var o = {}; o[k] = false; return o; })())).E) + "%"; }, function(){
          later(MV.reduceMotion ? 0 : 700, function(){ change(function(){ setSw(k, true); cap = SWN[k] + " back on: " + pc1(cur().E) + "%"; }, function(){ later(MV.reduceMotion ? 0 : 600, step); }); });
        });
      })();
      return;
    }
    var k = (p.flip || [])[0];
    later(MV.reduceMotion ? 0 : 300, function(){
      change(function(){ if (k) setSw(k, true); cap = SWN[k] + " on: " + pc1(cur().E) + "%"; }, function(){ later(MV.reduceMotion ? 0 : 500, fin); });
    });
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    var on = onList(S.sw), key = on.join("+"), e = pc1(cur().E);
    if (id === "tc1") {
      if (S.tc3.ph === "locked") return R("Finish challenge 3’s prediction first: the switches are locked.");
      if (!on.length) return { ok:true };
      if (key === "s+nr+m") return R("Within about 2 points, but by luck: three biases are cancelling. Biases can cancel by luck. Judge the design, not one lucky result.");
      if (key === "nr+r") return R("Close, but two biases are still on.");
      return R("The estimate is " + e + "%, and " + on.map(function(k){ return SWN[k].toLowerCase(); }).join(", ") + (on.length > 1 ? " are" : " is") + " still on. Which settings cause bias?");
    }
    if (id === "tc2") {
      if (on.length !== 2) return R("Turn on exactly two switches. Right now " + on.length + (on.length === 1 ? " is" : " are") + " on.");
      if (key === "s+nr") return { ok:true };
      if (key === "s+r") return R("Response bias pushes the estimate <strong>up</strong>.");
      if (key === "nr+r") return R("Lower is possible: which two both remove supporters?");
      return R("Measurement bias pushes the estimate <strong>up</strong>: " + e + "%.");
    }
    if (id === "tc3") {
      var t = S.tc3;
      if (t.ph !== "done" || t.pred == null) return R("Press <strong>Start challenge 3</strong> under the switches, then enter your prediction before flipping any switches.");
      var v = t.pred, again = " Press <strong>Predict again</strong> to try once more.";
      if (v >= 54.5 && v <= 55.5) return { ok:true };
      if (Math.abs(v - 50) < 0.5) return R("The two pushes don’t simply cancel; work out the weighted average." + again);
      if (Math.abs(v - 65) < 0.5) return R("That’s measurement bias alone; the frame still changes who’s asked." + again);
      if (Math.abs(v - 40) < 0.5) return R("That’s sampling bias alone." + again);
      return R("You predicted " + dN(v, 1) + "%; the model gives 55.0%. Work out the weighted average of the yes rates for the people the frame reaches." + again);
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: true support 50% beside an estimate bar; landline list -> 40%; leading question -> 55%; ×10 sample shrinks the whisker ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "";
  var st = { est:0, marg:10, book:0, bub:0, badge:0 };
  plot.render = function(){
    var rc = cv.getBoundingClientRect(), W0 = Math.max(200, rc.width), H0 = Math.max(120, rc.height);
    plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false, describe:aria, after:function(ctx, p){
      var W = p.W, H = p.H, yB = H - 30, yTop = 26, sc = function(v){ return yB - v / 75 * (yB - yTop); };
      var ink = css("--ink"), ink2 = css("--ink-2"), teal = css("--f3"), pen = css("--pen"), sheet = css("--sheet"), paper = css("--paper"), rule = css("--rule"), hl = css("--hi"), hink = css("--hi-ink"), fUI = p.fontUI;
      var small = W < 420, bw = Math.min(70, W * 0.13), c1 = W * 0.17, c2 = W * 0.4;
      ctx.save();
      ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(8, yB + 0.5); ctx.lineTo(W - 8, yB + 0.5); ctx.stroke();
      // truth bar
      ctx.fillStyle = teal; ctx.fillRect(c1 - bw / 2, sc(50), bw, yB - sc(50));
      ctx.strokeStyle = teal; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(c1 - bw / 2, sc(50)); ctx.lineTo(c2 + bw / 2 + 12, sc(50)); ctx.stroke(); ctx.setLineDash([]);
      // estimate bar (outline when empty)
      ctx.strokeStyle = rule; ctx.lineWidth = 1.5; ctx.strokeRect(c2 - bw / 2 + 0.5, sc(75) + 0.5, bw - 1, yB - sc(75) - 1);
      if (st.est > 0) { ctx.fillStyle = pen; ctx.fillRect(c2 - bw / 2, sc(st.est), bw, yB - sc(st.est)); }
      if (st.est > 0.5) {
        var a = sc(st.est + st.marg), b = sc(st.est - st.marg);
        ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(c2 + bw / 2 + 10, a); ctx.lineTo(c2 + bw / 2 + 10, b); ctx.moveTo(c2 + bw / 2 + 4, a); ctx.lineTo(c2 + bw / 2 + 16, a); ctx.moveTo(c2 + bw / 2 + 4, b); ctx.lineTo(c2 + bw / 2 + 16, b); ctx.stroke();
      }
      ctx.font = "700 " + (small ? 12 : 14) + "px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillStyle = ink; ctx.fillText("50%", c1, sc(50) - 4);
      if (st.est > 0.5) ctx.fillText(Math.round(st.est) + "%", c2, sc(Math.max(st.est, 0)) - 4);
      ctx.font = (small ? "11px " : "13px ") + fUI; ctx.textBaseline = "top"; ctx.fillStyle = ink;
      ctx.fillText("true support", c1, yB + 6); ctx.fillText("estimate", c2, yB + 6);
      // landline list (slides in from the right)
      if (st.book > 0) {
        var bx = W * 0.6 + (1 - st.book) * W * 0.5, by = yB - (small ? 46 : 60), bwid = small ? 70 : 96, bht = small ? 40 : 52;
        ctx.fillStyle = paper; ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.fillRect(bx, by, bwid, bht); ctx.strokeRect(bx, by, bwid, bht);
        ctx.fillStyle = ink2; ctx.fillRect(bx, by, 7, bht);
        ctx.fillStyle = ink; ctx.font = "700 " + (small ? 10 : 12) + "px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("Landline", bx + bwid / 2 + 3, by + bht * 0.36); ctx.fillText("phone list", bx + bwid / 2 + 3, by + bht * 0.68);
      }
      // speech bubble with a leading question
      if (st.bub > 0) {
        var s = st.bub, qx = W * 0.6, qy = small ? 10 : 18, qw = (small ? 132 : 180) * s, qh = (small ? 40 : 50) * s;
        ctx.save(); ctx.globalAlpha = Math.min(1, s * 1.2);
        ctx.fillStyle = sheet; ctx.strokeStyle = ink; ctx.lineWidth = 2;
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(qx, qy, qw, qh, 10); else ctx.rect(qx, qy, qw, qh); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(qx + 16, qy + qh); ctx.lineTo(qx + 8, qy + qh + 12 * s); ctx.lineTo(qx + 30, qy + qh); ctx.closePath(); ctx.fill(); ctx.stroke();
        if (s > 0.9) { ctx.fillStyle = ink; ctx.font = "italic " + (small ? 11 : 13) + "px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("“Don’t you agree", qx + qw / 2, qy + qh * 0.34); ctx.fillText("teens need…?”", qx + qw / 2, qy + qh * 0.7); }
        ctx.restore();
      }
      // ×10 sample badge
      if (st.badge > 0) {
        var rr = (small ? 22 : 28) * st.badge, gx = W - (small ? 30 : 42), gy = H * 0.5;
        ctx.fillStyle = hl; ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(gx, gy, rr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (st.badge > 0.9) { ctx.fillStyle = hink; ctx.font = "800 " + (small ? 12 : 15) + "px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("×10", gx, gy - 6); ctx.font = "600 " + (small ? 9 : 11) + "px " + fUI; ctx.fillText("sample", gx, gy + 9); }
      }
      ctx.restore();
    } });
  };
  var capEl = f.cap, fin = "Size shrinks the whisker, not the push.";
  function last(){ st = { est:55, marg:3.2, book:1, bub:1, badge:1 }; plot.render(); capEl.textContent = fin; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); capEl.textContent = "True support is 50%. What will the survey say?";
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  MV.wait(900, function(){
    capEl.textContent = "The sample comes from a landline phone list…";
    tw(700, function(t){ st.book = t; plot.render(); }, function(){
      tw(900, function(t){ st.est = 40 * t; plot.render(); }, function(){
        capEl.textContent = "…which misses young supporters: the estimate is only 40%.";
        MV.wait(1300, function(){
          capEl.textContent = "A leading question pushes answers up…";
          tw(450, function(t){ st.bub = t; plot.render(); }, function(){
            tw(900, function(t){ st.est = 40 + 15 * t; plot.render(); }, function(){
              capEl.textContent = "…to 55%.";
              MV.wait(1200, function(){
                capEl.textContent = "Ten times the sample:";
                tw(450, function(t){ st.badge = t; plot.render(); }, function(){
                  tw(1100, function(t){ st.marg = 10 - 6.8 * t; plot.render(); }, function(){ MV.wait(300, last); });
                });
              });
            });
          });
        });
      });
    });
  });
}

// ---------- Part 3: Media watch (five made-up news items) ----------
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  S.items = obj(S.items); S.axis0 = !!S.axis0;
  var msgs = {}, gPlot = null, axis = S.axis0 ? 0 : 950, axStop = null;
  function ist(id){ var x = S.items[id] = obj(S.items[id]); if (!Array.isArray(x.sel)) x.sel = []; x.tries = x.tries || 0; return x; }
  function stepById(id){ var r = null; ST.forEach(function(s){ s.steps.forEach(function(q){ if (q.id === id) r = q; }); }); return r; }
  function stationDone(s){ return s.steps.every(function(q){ return ist(q.id).solved; }); }
  host.innerHTML = ST.map(function(s, i){
    return '<article class="bs-st" data-st="' + s.id + '"><div class="bs-sthead"><span class="bs-stlab">Item ' + (i + 1) + " · " + s.title + '</span><span class="mdm-model">made-up example</span></div>' +
      '<blockquote class="bs-news">' + s.news + "</blockquote>" + (s.src ? '<p class="tiny muted bs-src">' + s.src + "</p>" : "") +
      (s.graph ? '<div class="bs-graph"><canvas class="plot bs-gplot" id="bs-gplot" role="img" aria-label="Bar graph of monthly sales"></canvas>' +
        '<div class="q-actions"><button type="button" class="btn sm" id="bs-axis" data-k="bsaxis" aria-pressed="' + S.axis0 + '"></button></div><dl class="read" id="bs-gread" aria-live="polite"></dl></div>' : "") +
      (s.id === "m1" ? '<details class="alg"><summary>Check it with data</summary>' + MV.tableHTML({ head:["Votes", "Random margin, if the voters had been chosen at random", "These voters chose themselves"], caption:"Margins of error for random samples of each size",
        rows:[1000, 18000, 100000].map(function(n){ return [MV.mdm.fmt(n), "±" + dN(100 / Math.sqrt(n), 1) + "%", "no margin applies; the bias is unknown and doesn’t shrink"]; }) }) +
        '<p class="tiny">A margin of error (about 1 ÷ √<i>n</i>) describes random error in a random sample. 18 000 self-selected votes have a tiny “margin” on paper, but the push from who chose to vote stays the same however many vote.</p></details>' : "") +
      '<div class="bs-steps" data-steps="' + s.id + '"></div></article>';
  }).join("");

  function stepHTML(q){
    var x = ist(q.id), h = '<div class="bs-step" data-step="' + q.id + '"><p class="bs-sq">' + q.prompt + "</p>";
    if (q.kind === "multi") {
      h += '<div class="bs-chips" role="group" aria-label="' + MV.esc(MV.plain(q.prompt)) + '">' + q.options.map(function(o, i){
        var on = x.sel.indexOf(i) >= 0;
        return '<button type="button" class="chip bs-chip" data-ms="' + q.id + '" data-i="' + i + '" data-k="bs' + q.id + i + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>";
      }).join("") + "</div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-mchk="' + q.id + '" data-k="bs' + q.id + 'chk">Check</button></div>';
    } else {
      h += '<div class="opts">' + q.options.map(function(o, i){
        var c = "opt"; if (x.solved && MV.ok(o)) c += " right"; else if (!x.solved && x.last === i) c += " wrong";
        return '<button type="button" class="' + c + '" data-os="' + q.id + '" data-i="' + i + '" data-k="bs' + q.id + i + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + o.t + "</span></button>";
      }).join("") + "</div>";
    }
    if (x.solved) {
      var why = q.kind === "multi" ? q.why : (q.options.filter(function(o){ return MV.ok(o); })[0] || {}).why;
      h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgs[q.id]) h += MV.fbHTML("bad", msgs[q.id]);
    return h + "</div>";
  }
  function paintSt(s){
    var box = host.querySelector('[data-steps="' + s.id + '"]');
    MV.keepFocus(box, function(){ box.innerHTML = s.steps.map(stepHTML).join("") + (stationDone(s) && s.after ? '<p class="bs-after">' + s.after + "</p>" : ""); });
  }
  function judgeMulti(q){
    var x = ist(q.id), okI = [], wrongPicked = [];
    q.options.forEach(function(o, i){ if (MV.ok(o)) okI.push(i); else if (x.sel.indexOf(i) >= 0) wrongPicked.push(o); });
    var missed = okI.filter(function(i){ return x.sel.indexOf(i) < 0; }).length;
    if (!x.sel.length) return { bad:"Choose at least one answer first." };
    if (!missed && !wrongPicked.length) return { ok:true };
    var fb = wrongPicked.map(function(o){ return o.why || ""; });
    if (missed) fb.push(missed === 1 ? "One more answer belongs on your list." : "More answers belong on your list.");
    return { ok:false, fb:fb.join(" ") };
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var s, q, x;
    if (b.dataset.ms) {
      q = stepById(b.dataset.ms); x = ist(q.id); var i = +b.dataset.i, k = x.sel.indexOf(i);
      if (k >= 0) x.sel.splice(k, 1); else x.sel.push(i);
      msgs[q.id] = null; api.save(); s = ST.filter(function(z){ return z.steps.indexOf(q) >= 0; })[0]; paintSt(s); return;
    }
    if (b.dataset.mchk) {
      q = stepById(b.dataset.mchk); x = ist(q.id); s = ST.filter(function(z){ return z.steps.indexOf(q) >= 0; })[0];
      var r = judgeMulti(q);
      if (r.bad) msgs[q.id] = r.bad;
      else if (r.ok) { x.solved = true; x.first = x.tries === 0; msgs[q.id] = null; }
      else { x.tries++; msgs[q.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
      api.save(); paintSt(s); MV.focusFb(host.querySelector('[data-step="' + q.id + '"]')); return;
    }
    if (b.dataset.os) {
      q = stepById(b.dataset.os); x = ist(q.id); s = ST.filter(function(z){ return z.steps.indexOf(q) >= 0; })[0];
      var o = q.options[+b.dataset.i]; x.last = +b.dataset.i;
      if (MV.ok(o)) { x.solved = true; x.first = x.tries === 0; msgs[q.id] = null; }
      else { x.tries++; msgs[q.id] = "<strong>✗ Not quite.</strong> " + (o.why || "") + " Try again."; }
      api.save(); paintSt(s); MV.focusFb(host.querySelector('[data-step="' + q.id + '"]')); return;
    }
    if (b.id === "bs-axis") {
      S.axis0 = !S.axis0; api.save();
      var from = axis, to = S.axis0 ? 0 : 950;
      if (axStop) axStop();
      axStop = MV.tween({ dur:900, step:function(t){ axis = from + (to - from) * t; paintGraph(); }, done:function(){ axStop = null; axis = to; paintGraph(); } });
      paintGraphText();
    }
  });
  // @component graphRedraw — a two-bar graph whose vertical axis start eases between a cut-off value and 0 (Part 3, Item 2)
  function niceStep(r){ var p = Math.pow(10, Math.floor(Math.log10(r))), m = r / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }
  function paintGraph(){
    if (!gPlot) return;
    var base = axis, vals = [["May", 960], ["June", 990]], top = 1000;
    gPlot.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false,
      describe:"Bar graph of monthly sales, vertical axis from " + Math.round(base) + " to 1000: May 960, June 990." + (base > 900 ? " June’s bar looks four times as tall as May’s." : " The two bars are almost the same height."),
      after:function(ctx, p){
        var W = p.W, H = p.H, L = 52, R = 16, T = 16, B = 30, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), grid = css("--plot-grid"), sheet = css("--sheet"), fUI = p.fontUI;
        var Y = function(v){ return H - B - (v - base) / (top - base) * (H - B - T); }, st = niceStep((top - base) / 5);
        ctx.save(); ctx.font = "12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        for (var v = Math.ceil(base / st) * st; v <= top + 1e-9; v += st) { var y = Y(v); ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - R, y); ctx.stroke(); ctx.fillStyle = ink2; ctx.fillText(MV.mdm.fmt(Math.round(v)), L - 6, y); }
        ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, H - B); ctx.lineTo(W - R, H - B); ctx.stroke();
        var slot = (W - L - R) / 2, bwid = Math.min(90, slot * 0.5);
        vals.forEach(function(d, i){
          var cx = L + slot * (i + 0.5), y = Y(d[1]);
          ctx.fillStyle = pen; ctx.fillRect(cx - bwid / 2, y, bwid, H - B - y);
          ctx.fillStyle = ink; ctx.font = "700 13px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(String(d[1]), cx, y - 3);
          ctx.font = "13px " + fUI; ctx.textBaseline = "top"; ctx.fillText(d[0], cx, H - B + 6);
        });
        ctx.fillStyle = ink2; ctx.font = "italic 12px " + fUI; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("sales", L + 6, 2);
        ctx.restore();
      } });
  }
  function paintGraphText(){
    var b = $("#bs-axis", host), r = $("#bs-gread", host); if (!b) return;
    b.setAttribute("aria-pressed", String(S.axis0));
    b.textContent = S.axis0 ? "Show the ad’s version (axis from 950)" : "Check it with data: redraw from 0";
    r.innerHTML = S.axis0 ? MV.readoutHTML([["Bar heights", "960 and 990: June’s bar is only 990 ÷ 960 ≈ 1.03 times as tall"], ["Change", "990 − 960 = 30, and 30 ÷ 960 ≈ <strong>3.1%</strong>"]])
      : MV.readoutHTML([["Axis starts at", "950"], ["Bar heights above the axis", "10 and 40: June’s bar looks <strong>4 times</strong> as tall"]]);
  }
  ST.forEach(paintSt);
  var gc = $("#bs-gplot", host);
  if (gc) { gPlot = new MV.Plot(gc, { xmin:0, xmax:1, ymin:0, ymax:1 }); gPlot.render = paintGraph; paintGraph(); paintGraphText(); }
  return {};
}

// ---------- Performance task: Fair survey ----------
var task = (function(){
  var api = null;
  var IN = [
    { k:"f", label:"Frame", opts:[{ id:"res", t:"Town resident list (everyone 15+)", s:"resident list" }, { id:"land", t:"Landline phone list", s:"landline list" }, { id:"shop", t:"Skate shop customers", s:"skate shop customers" }, { id:"web", t:"Online poll link", s:"online poll link" }], def:"web" },
    { k:"s", label:"Selection", opts:[{ id:"rand", t:"Random from the frame", s:"random" }, { id:"first", t:"Whoever answers first", s:"whoever answers first" }], def:"first" },
    { k:"u", label:"Follow up non-responders", opts:[{ id:"yes", t:"Yes", s:"follow-ups" }, { id:"no", t:"No", s:"no follow-ups" }], def:"no" },
    { k:"w", label:"Wording", opts:[{ id:"n1", t:"N1 “Do you support or oppose building a skate park?”", s:"N1" }, { id:"n2", t:"N2 “Should the town build a skate park? (Yes / No / Unsure)”", s:"N2" },
      { id:"l", t:"L “Don’t you agree the town needs a safe skate park for teens?”", s:"L" }, { id:"lo", t:"Lo “Should the town waste money on a noisy skate park?”", s:"Lo" }, { id:"d", t:"D “Should the town build a skate park and a new library?”", s:"D" }], def:"l" },
    { k:"p", label:"Privacy", opts:[{ id:"anon", t:"Anonymous", s:"anonymous" }, { id:"conf", t:"Confidential (names kept private)", s:"confidential" }, { id:"pub", t:"Names published with answers", s:"names published" }], def:"pub" }];
  function st(){ var s = api ? api.S : {}; IN.forEach(function(g){ if (!g.opts.some(function(o){ return o.id === s[g.k]; })) s[g.k] = g.def; }); return s; }
  function read(){ var s = st(), d = {}; IN.forEach(function(g){ d[g.k] = s[g.k]; }); return d; }
  function designModel(d){
    // VERIFY: names published uses the switchboard's response-bias rule; Lo uses −0.15 (mirror of the leading +0.15).
    var fr = { res:ONE, land:LAND, shop:SHOP, web:WEB }[d.f];
    return model({ frame:fr, sel:d.s === "first" ? FIRST : null, resp:d.u === "no" ? NORESP : ONE, shift:d.w === "l" ? 0.15 : d.w === "lo" ? -0.15 : 0, rb:d.p === "pub" });
  }
  function key(d){ return [d.f, d.s, d.u, d.w, d.p].join("|"); }
  function lab(k){ var q = k.split("|"); return IN.map(function(g, i){ return (g.opts.filter(function(o){ return o.id === q[i]; })[0] || {}).s || q[i]; }).join(", "); }
  var pv = null, mPlot = null;
  function paint(){
    if (!pv) return;
    var d = read(), m = designModel(d), dbl = d.w === "d";
    var adds = [];
    if (d.f !== "res") adds.push("Frame (" + lab(key(d)).split(", ")[0] + "): sampling bias");
    if (d.s !== "rand") adds.push("Whoever answers first: sampling bias (a convenience sample)");
    if (d.u !== "yes") adds.push("No follow-ups: non-response bias");
    if (d.w === "l") adds.push("Leading wording: measurement bias (pushes up)");
    if (d.w === "lo") adds.push("Loaded wording: measurement bias (pushes down)");
    if (dbl) adds.push("Two questions in one: measurement bias (the answer can’t be read)");
    if (d.p === "pub") adds.push("Names published: response bias");
    var r = $("#fs-read"); if (!r) return;
    r.innerHTML = MV.readoutHTML([
      ["Model estimate", dbl ? "can’t tell: the answer mixes the skate park with the library" : "<strong>" + pc1(m.E) + "%</strong> (truth 50%)"],
      ["Bias", dbl ? "unknown" : "<strong>" + sgn1(r1(m.E) - 50) + "</strong> percentage points"],
      ["Sources of bias in this design", adds.length ? adds.join("<br>") : "none: fair by design"]]);
    if (mPlot) mPlot.render();
  }
  return {
    render:function(inp, pvw, a){
      api = a; st();
      inp.innerHTML = '<div class="fs-in">' + IN.map(function(g){ return '<div id="fs-' + g.k + '"></div>'; }).join("") + "</div>";
      pvw.innerHTML = '<div class="fs-pv"><p class="tiny muted">Switchboard gauge for your design <span class="mdm-model">model data</span></p><canvas class="plot bs-tplot" id="fs-plot" role="img" aria-label="Estimate gauge for your design"></canvas><dl class="read" id="fs-read" aria-live="polite"></dl></div>';
      pv = pvw;
      IN.forEach(function(g){
        radios($("#fs-" + g.k), { label:g.label, options:g.opts.map(function(o){ return { id:o.id, t:o.t }; }), value:api.S[g.k], cls:"chips",
          onChange:function(v){ api.S[g.k] = v; api.save(); paint(); api.update(); } });
      });
      mPlot = new MV.Plot($("#fs-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 });
      mPlot.render = function(){ var d = read(), m = designModel(d), dbl = d.w === "d";
        drawBoard(mPlot, { E:dbl ? null : m.E, marg:null, note:"estimate: can’t tell (two questions in one)",
          describe:dbl ? "Estimate gauge: the double-barrelled question gives no readable estimate; truth 50%." : "Estimate gauge for your design: expected estimate " + pc1(m.E) + "%, truth 50%." }); };
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.f === "res", d.s === "rand", d.u === "yes", d.w === "n1" || d.w === "n2", d.p !== "pub"]; },
    key:key,
    label:function(k){ return lab(k); },
    text:function(k){ return lab(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
