// MDM4U 26 Properties of the Normal Distribution: hero (500 model heights build into a histogram, a bell curve settles,
// mean line, 68–95–99.7 bands), Bell shaper (Explore: D8 normal curve with μ / σ sliders and Shape / Compare / Rule / Data
// modes, Rule-mode pieces and snapping interval handles), Is it normal? (Part 3: five model-data stations with D10
// histograms, a Check it with data panel and verdict / reason chips), N4 percent entry (practice), A fair test (task).
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function M(s){ return MV.m(s); }
function mn(s){ return String(s).replace(/-/g, MV.MINUS); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function r2(v){ return Math.round(v * 100) / 100; }
function money(v){ return "$" + MV.mdm.fmt(v); }

// ---------- normal model ----------
function erf(x){ var s = x < 0 ? -1 : 1; x = Math.abs(x); if (x === Infinity) return s; var t = 1 / (1 + 0.3275911 * x);
  var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
function Phi(z){ return 0.5 * (1 + erf(z / Math.SQRT2)); }
function pdf(x, mu, sd){ var z = (x - mu) / sd; return Math.exp(-z * z / 2) / (sd * Math.sqrt(2 * Math.PI)); }
// Rule pieces: index i = 0…7 covers z from i − 4 to i − 3 (i = 0 is the left tail below −3, i = 7 the right tail above 3).
var RULE = [0.15, 2.35, 13.5, 34, 34, 13.5, 2.35, 0.15];
function pieceZ(i){ return [i === 0 ? -Infinity : i - 4, i === 7 ? Infinity : i - 3]; }
function level(i){ var k = i - 4; return k >= 0 ? k : -k - 1; }
function kTxt(k){ return k === 0 ? "μ" : "μ " + (k > 0 ? "+" : "-") + " " + (Math.abs(k) === 1 ? "" : Math.abs(k)) + "σ"; }
function kPlain(k){ return k === 0 ? "the mean" : (Math.abs(k) === 1 ? "one" : Math.abs(k) === 2 ? "two" : "three") + " standard deviation" + (Math.abs(k) === 1 ? "" : "s") + (k > 0 ? " above" : " below"); }
function rangeSel(a, b){ var s = []; for (var i = 0; i < 8; i++) { var k = i - 4; s.push(k >= a && k < b); } return s; }
function ruleSum(sel){ var t = 0; sel.forEach(function(on, i){ if (on) t += RULE[i]; }); return r2(t); }
function exactSum(sel){ var t = 0; sel.forEach(function(on, i){ if (on) { var z = pieceZ(i); t += Phi(z[1]) - Phi(z[0]); } }); return t; }
function runs(sel){ var out = [], i = 0; while (i < 8) { if (!sel[i]) { i++; continue; } var j = i; while (j + 1 < 8 && sel[j + 1]) j++; out.push([i, j]); i = j + 1; } return out; }
function runText(r, mu, sd, plain){
  var lo = r[0] === 0 ? null : r[0] - 4, hi = r[1] === 7 ? null : r[1] - 3;
  function v(k){ return mn(String(mu + k * sd)); }
  if (lo == null && hi == null) return plain ? "everything" : "the whole curve";
  if (plain) return lo == null ? "below " + v(hi) : hi == null ? "above " + v(lo) : "from " + v(lo) + " to " + v(hi);
  if (lo == null) return "below " + v(hi) + " (below " + M(kTxt(hi)) + ")";
  if (hi == null) return "above " + v(lo) + " (above " + M(kTxt(lo)) + ")";
  return v(lo) + " to " + v(hi) + " (" + M(kTxt(lo)) + " to " + M(kTxt(hi)) + ")";
}

// ---------- model data: 500 Grade 12 heights (seeded; rescaled to mean 170 cm, SD 8 cm exactly) ----------
var HEIGHTS = null;
function heights(){
  if (HEIGHTS) return HEIGHTS;
  var r = MV.mdm.seededRandom("mdm26-heights"), z = [], i;
  for (i = 0; i < 500; i += 2) { var u = Math.max(1e-12, r()), v = r(), R = Math.sqrt(-2 * Math.log(u)); z.push(R * Math.cos(2 * Math.PI * v), R * Math.sin(2 * Math.PI * v)); }
  var m = 0; z.forEach(function(t){ m += t; }); m /= z.length;
  var s = 0; z.forEach(function(t){ s += (t - m) * (t - m); }); s = Math.sqrt(s / z.length);
  HEIGHTS = z.map(function(t){ return 170 + 8 * (t - m) / s; });
  return HEIGHTS;
}
function binCounts(vals, x0, w, k, n){ var c = []; for (var j = 0; j < k; j++) c.push(0); for (var i = 0; i < n; i++) { var b = Math.floor((vals[i] - x0) / w); if (b >= 0 && b < k) c[b]++; } return c; }

// @component radioGroup (copied from MDM4U 20 / 18) — segmented control or chip row as a real radio group
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

// @component D8 normalCurve — normal density curve on a Plot canvas (course plan D8): main curve --pen 3 px; mean line teal
// (--p-d, the shift role) with a label; inflection points as open dots at μ ± σ; an orange (--p-k, the stretch role) σ bar;
// a dashed --ink-2 ghost; Rule bands μ ± kσ in three --hi-soft tints with the 34 / 13.5 / 2.35 / 0.15% pieces labelled
// (never colour alone) and selected pieces in --hi; snapping interval handles on the axis; an optional D10 histogram on a
// density scale underneath; vertical marks; shaded x-ranges. Returns the pixel map {L, R, W, bot, x0, x1} for pointer use.
// normalCurve(plot, { x0, x1, ymax, yStep, xStep, mu, sd, curveA, ghost:{mu, sd}, meanLab, infl, sigBar, noY, kLabels,
//   rule:{ upTo, sel:[8 bools], labels }, handles:[a, b], hist:{ x0, w, counts, n }, marks:[{ x, label }], shade:[[a, b]], describe })
function normalCurve(plot, o){
  var map = {};
  plot.draw({ grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, L = o.noY ? 12 : 46, R = 12, T = 26, B = 36, bot = H - B;
    var x0 = o.x0, x1 = o.x1, ymax = o.ymax, mu = o.mu, sd = o.sd;
    function sx(x){ return L + (x - x0) / (x1 - x0) * (W - L - R); }
    function sy(y){ return bot - Math.min(y, ymax * 1.12) / ymax * (bot - T); }
    map.L = L; map.R = R; map.W = W; map.bot = bot; map.x0 = x0; map.x1 = x1;
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), sheet = css("--sheet"), teal = css("--p-d"), orange = css("--p-k"), fUI = p.fontUI, fM = p.fontM;
    function backed(txt, x, y, col, font, align){
      ctx.font = font; var w = ctx.measureText(txt).width, ax = align === "left" ? x : align === "right" ? x - w : x - w / 2;
      ctx.fillStyle = sheet; ctx.fillRect(ax - 3, y - 14, w + 6, 16); ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(txt, ax, y);
    }
    ctx.save();
    // grid and y labels
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    var v;
    for (v = o.yStep; v <= ymax + 1e-9; v += o.yStep) { var py = Math.round(sy(v)) + 0.5; ctx.moveTo(L, py); ctx.lineTo(W - R, py); }
    ctx.stroke();
    if (!o.noY) {
      ctx.fillStyle = ink2; ctx.font = "11px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (v = 0; v <= ymax + 1e-9; v += o.yStep) ctx.fillText(v < 1e-9 ? "0" : v.toFixed(2), L - 5, sy(v));
    }
    // plotting area (clipped)
    ctx.save(); ctx.beginPath(); ctx.rect(L, 0, W - L - R, bot + 0.5); ctx.clip();
    if (o.hist) {
      var hs = o.hist;
      ctx.lineWidth = 1;
      hs.counts.forEach(function(c, j){
        if (!c) return;
        var a = sx(hs.x0 + j * hs.w), b = sx(hs.x0 + (j + 1) * hs.w), t = sy(c / (hs.n * hs.w));
        ctx.globalAlpha = 0.22; ctx.fillStyle = pen; ctx.fillRect(a, t, b - a, bot - t);
        ctx.globalAlpha = 0.75; ctx.strokeStyle = pen; ctx.strokeRect(a + 0.5, t + 0.5, b - a - 1, bot - t - 1); ctx.globalAlpha = 1;
      });
    }
    function trace(m, s, a, b){ var n = Math.max(60, Math.round((sx(b) - sx(a)) / 1.5)); for (var i = 0; i <= n; i++) { var x = a + (b - a) * i / n; ctx.lineTo(sx(x), sy(pdf(x, m, s))); } }
    function under(a, b, col, alpha){
      a = Math.max(a, x0); b = Math.min(b, x1); if (b <= a) return;
      ctx.beginPath(); ctx.moveTo(sx(a), bot); trace(mu, sd, a, b); ctx.lineTo(sx(b), bot); ctx.closePath();
      ctx.globalAlpha = alpha; ctx.fillStyle = col; ctx.fill(); ctx.globalAlpha = 1;
    }
    (o.shade || []).forEach(function(r){ under(r[0], r[1], css("--hi-soft"), 1); });
    var rl = o.rule, upTo = rl ? (rl.upTo == null ? 3 : rl.upTo) : 0;
    if (rl) {
      var hiSoft = css("--hi-soft"), hi = css("--hi"), tint = [1, 0.62, 0.34];
      for (var i = 0; i < 8; i++) {
        var z = pieceZ(i), a = z[0] === -Infinity ? x0 : mu + z[0] * sd, b = z[1] === Infinity ? x1 : mu + z[1] * sd;
        if (rl.sel && rl.sel[i]) under(a, b, hi, 0.9);
        else if (level(i) < 3 && level(i) < upTo) under(a, b, hiSoft, tint[level(i)]);
      }
      ctx.strokeStyle = ink2; ctx.lineWidth = 1;
      for (var k = -3; k <= 3; k++) { if (Math.abs(k) >= upTo + 1 && k !== 0) continue; var bx = Math.round(sx(mu + k * sd)) + 0.5; ctx.beginPath(); ctx.moveTo(bx, bot); ctx.lineTo(bx, sy(pdf(mu + k * sd, mu, sd))); ctx.stroke(); }
    }
    if (o.ghost) { ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(sx(x0), sy(pdf(x0, o.ghost.mu, o.ghost.sd))); trace(o.ghost.mu, o.ghost.sd, x0, x1); ctx.stroke(); ctx.setLineDash([]); }
    var cA = o.curveA == null ? 1 : o.curveA;
    if (cA > 0) {
      ctx.globalAlpha = cA; ctx.strokeStyle = pen; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(sx(x0), sy(pdf(x0, mu, sd))); trace(mu, sd, x0, x1); ctx.stroke(); ctx.globalAlpha = 1;
    }
    if (o.sigBar && cA > 0) {
      var yi = sy(pdf(mu + sd, mu, sd));
      ctx.strokeStyle = orange; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(sx(mu), yi); ctx.lineTo(sx(mu + sd), yi); ctx.moveTo(sx(mu + sd), yi - 5); ctx.lineTo(sx(mu + sd), yi + 5); ctx.stroke();
      ctx.fillStyle = orange; ctx.font = "italic 700 15px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("σ", (sx(mu) + sx(mu + sd)) / 2, yi - 3);
    }
    if (o.meanLab != null && cA > 0) {
      var mx = Math.round(sx(mu)) + 0.5, top = Math.max(T - 6, sy(pdf(mu, mu, sd)) - 8);
      ctx.strokeStyle = teal; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(mx, bot); ctx.lineTo(mx, top); ctx.stroke();
    }
    if (o.infl && cA > 0) {
      [-1, 1].forEach(function(s){ var x = mu + s * sd, y = pdf(x, mu, sd); ctx.beginPath(); ctx.arc(sx(x), sy(y), 4.5, 0, 2 * Math.PI); ctx.fillStyle = sheet; ctx.fill(); ctx.strokeStyle = pen; ctx.lineWidth = 2; ctx.stroke(); });
    }
    ctx.restore();
    // axis
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, bot + 0.5); ctx.lineTo(W - R, bot + 0.5); ctx.stroke();
    // marks (task): dashed verticals with labels on top
    (o.marks || []).forEach(function(m){
      if (m.x < x0 || m.x > x1) return; var X = Math.round(sx(m.x)) + 0.5;
      ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(X, bot); ctx.lineTo(X, T); ctx.stroke(); ctx.setLineDash([]);
      backed(m.label, X, T - 2, ink, "700 12px " + fUI, "center");
    });
    // rule labels
    if (rl && rl.labels !== false) {
      for (var j = 0; j < 8; j++) {
        if (!(rl.sel && rl.sel[j]) && level(j) >= upTo) continue;
        var zc = j === 0 ? -3.5 : j === 7 ? 3.5 : j - 3.5, cx = sx(mu + zc * sd), txt = RULE[j] + "%";
        ctx.font = "600 11px " + fUI;
        var tw = ctx.measureText(txt).width, pw = sx(mu + sd) - sx(mu);
        if (tw + 4 > pw || cx < L + tw / 2 || cx > W - R - tw / 2) continue;
        backed(txt, cx, bot - 4, ink, "600 11px " + fUI, "center");
      }
    }
    // mean label
    if (o.meanLab && cA > 0) { var my = Math.max(T + 12, sy(pdf(mu, mu, sd)) - 10); if (sx(mu) > L && sx(mu) < W - R) backed(o.meanLab, Math.min(W - R - 60, Math.max(L + 60, sx(mu))), my, teal, "700 12px " + fUI, "center"); }
    // x labels
    ctx.fillStyle = ink; ctx.font = "13px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var xs = [];
    if (o.kLabels) { for (var kk = -3; kk <= 3; kk++) xs.push(mu + kk * sd); }
    else { for (var xv = Math.ceil(x0 / o.xStep) * o.xStep; xv <= x1 + 1e-9; xv += o.xStep) xs.push(xv); }
    var lastR = -1e9;
    xs.forEach(function(x){ if (x < x0 || x > x1) return; var lab = mn(String(r2(x))), w = ctx.measureText(lab).width, cx = sx(x); if (cx - w / 2 < lastR + 6 || cx - w / 2 < 0 || cx + w / 2 > W) return; ctx.fillText(lab, cx, bot + 16); lastR = cx + w / 2; });
    // handles
    if (o.handles) {
      ctx.fillStyle = ink;
      o.handles.forEach(function(k){ var hx = sx(mu + k * sd); if (hx < L - 1 || hx > W - R + 1) return; ctx.beginPath(); ctx.moveTo(hx, bot + 1); ctx.lineTo(hx - 7, bot + 14); ctx.lineTo(hx + 7, bot + 14); ctx.closePath(); ctx.fill(); });
    }
    ctx.restore();
  } });
  return map;
}
function yScale(sdMin){ return sdMin >= 10 ? { ymax:0.045, yStep:0.01 } : sdMin >= 5 ? { ymax:0.09, yStep:0.02 } : { ymax:0.21, yStep:0.05 }; }

// ---------- Explore: Bell shaper ----------
var MODES = [{ id:"shape", t:"Shape" }, { id:"compare", t:"Compare" }, { id:"rule", t:"Rule" }, { id:"data", t:"Data" }];
var VX0 = 0, VX1 = 200, HX0 = 138, HW = 2, HK = 32;
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (!MODES.some(function(m){ return m.id === S.mode; })) S.mode = "shape";
    S.mu = clampI(S.mu == null ? 100 : S.mu, 40, 180, 100); S.sd = clampI(S.sd == null ? 15 : S.sd, 2, 30, 15);
    if (!S.ghost || typeof S.ghost !== "object") S.ghost = null; else { S.ghost = { mu:clampI(S.ghost.mu, 40, 180, 100), sd:clampI(S.ghost.sd, 2, 30, 15) }; }
    S.a = clampI(S.a == null ? -2 : S.a, -3, 2, -2); S.b = clampI(S.b == null ? 2 : S.b, S.a + 1, 3, 2);
    if (!Array.isArray(S.sel) || S.sel.length !== 8) S.sel = rangeSel(S.a, S.b); else S.sel = S.sel.map(function(x){ return !!x; });
  }
  sanitize();
  var pv = {}, anim = null, map = {}, drag = null, msg = "";
  host.innerHTML = '<div id="np-mode" class="np-mode"></div>' +
    '<div class="pg np-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap np-cap" id="np-cap"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot wide np-plot" id="np-plot" role="img" aria-label="Normal curve"></canvas></div><p class="np-aha" id="np-aha"></p></div>' +
    '<div class="pg-ctrl"><div id="np-sl"></div><div id="np-extra"></div><p class="tiny np-msg" id="np-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="np-read" aria-live="polite"></dl></div></div>';
  var cv = $("#np-plot", host), plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintChart;
  var modeR = radios($("#np-mode", host), { label:"Mode", options:MODES, value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; msg = ""; save(); renderExtra(); paint(); MV.changed(); } });
  var sl = MV.sliders($("#np-sl", host), [
    { id:"npmu", label:"Mean " + M("@d{μ}"), param:"d", min:40, max:180, step:1, value:S.mu, note:"Shift + arrow keys: steps of 10." },
    { id:"npsd", label:"Standard deviation " + M("@k{σ}"), param:"k", min:2, max:30, step:1, value:S.sd }
  ], function(id, v){ user(); if (id === "npmu") S.mu = v; else S.sd = v; save(); paint(); MV.changed(); });
  $("#np-sl", host).addEventListener("keydown", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.sl || !e.shiftKey) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 10 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -10 : 0; if (!d) return;
    e.preventDefault(); t.value = Math.max(+t.min, Math.min(+t.max, +t.value + d)); t.dispatchEvent(new Event("input", { bubbles:true }));
  });

  function save(){ api.save(); }
  function user(){ cancelAnim(); MV.banner("", ""); }
  function newAnim(fin){ cancelAnim(); anim = { stop:null, timer:null, fin:fin }; return anim; }
  function cancelAnim(){ if (!anim) return; var a = anim; anim = null; if (a.stop) a.stop(); if (a.timer) clearTimeout(a.timer); if (a.fin) a.fin(); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) a.fin(); }
  function mu(){ return pv.mu != null ? pv.mu : S.mu; }
  function sd(){ return pv.sd != null ? pv.sd : S.sd; }
  function syncSliders(){ sl.set("npmu", Math.round(mu())); sl.set("npsd", Math.round(sd())); }
  function syncHandles(){ var rr = runs(S.sel); if (rr.length === 1 && rr[0][0] > 0 && rr[0][1] < 7) { S.a = rr[0][0] - 4; S.b = rr[0][1] - 3; } }

  function describe(){
    var m = r2(mu()), s = r2(sd()), t = "Normal curve, mean " + m + ", standard deviation " + s;
    if (S.mode === "rule") { var rr = runs(S.sel); t += rr.length ? "; shaded " + rr.map(function(r){ return runText(r, m, s, true); }).join(" and ") + ", " + ruleSum(S.sel) + "% of the area" : "; nothing shaded"; }
    if (S.ghost && S.mode === "compare") t += "; dashed ghost curve with mean " + S.ghost.mu + " and standard deviation " + S.ghost.sd;
    if (S.mode === "data") t += "; histogram of 500 model heights with mean 170 cm and standard deviation 8 cm";
    return t + ".";
  }
  function paintChart(){
    var m = mu(), s = sd(), g = S.mode === "compare" ? S.ghost : null, sc = yScale(Math.min(s, g ? g.sd : 99));
    var o = { x0:VX0, x1:VX1, ymax:sc.ymax, yStep:sc.yStep, xStep:20, mu:m, sd:s, ghost:g, meanLab:"μ = " + r2(m), infl:true, sigBar:true, describe:describe() };
    if (S.mode === "rule") { o.rule = { sel:S.sel, upTo:4 }; o.handles = [S.a, S.b]; o.kLabels = true; o.sigBar = false; }
    if (S.mode === "data") o.hist = { x0:HX0, w:HW, counts:binCounts(heights(), HX0, HW, HK, 500), n:500 };
    map = normalCurve(plot, o);
  }
  function paintCap(){ $("#np-cap", host).innerHTML = M("X ∼ N(@d{" + r2(mu()) + "}, @k{" + r2(sd()) + "}^2)"); }
  function paintRead(){
    var m = r2(mu()), s = r2(sd()), rows = [];
    rows.push(["Distribution", M("X ∼ N(" + m + ", " + s + "^2)")]);
    rows.push(["Mean = median = mode", '<span class="np-teal">' + mn(m) + "</span>"]);
    rows.push(["Standard deviation", '<span class="np-orange">' + s + "</span>"]);
    rows.push(["Inflection points", mn(r2(m - s)) + " and " + mn(r2(m + s)) + " (" + M("μ ± σ") + ")"]);
    rows.push(["Peak height", (Math.round(0.39894228 / s * 1e4) / 1e4).toFixed(4) + " (≈ 0.399 ÷ " + M("σ") + ")"]);
    if (S.mode === "rule") {
      var rr = runs(S.sel);
      rows.push(["Shaded interval", rr.length ? rr.map(function(r){ return runText(r, m, s, false); }).join(" and ") : '<span class="muted">none yet: tap a piece or move an edge</span>']);
      rows.push(["Shaded area", rr.length ? "<strong>" + ruleSum(S.sel) + "%</strong> by the rule " + '<span class="muted tiny">(the tool’s exact value: ' + exactSum(S.sel).toFixed(4) + ")</span>" : "0%"]);
    }
    if (S.mode === "compare") rows.push(["Ghost", S.ghost ? M("N(" + S.ghost.mu + ", " + S.ghost.sd + "^2)") + ", peak " + (Math.round(0.39894228 / S.ghost.sd * 1e4) / 1e4).toFixed(4) : '<span class="muted">none: press Freeze</span>']);
    if (S.mode === "data") rows.push(["Model data", "500 heights: mean 170 cm, SD 8 cm"]);
    rows.push(["Total area", "1"]);
    $("#np-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintAha(){
    var t = S.mode === "shape" ? "Move " + M("@k{σ}") + ": the curve trades height for width while the area stays 1. Move " + M("@d{μ}") + ": it only slides." :
      S.mode === "compare" ? "Press <strong>Freeze</strong>, then change " + M("@d{μ}") + " or " + M("@k{σ}") + " and compare with the dashed ghost." :
      S.mode === "rule" ? "The pieces keep the same percentages for every " + M("μ") + " and " + M("σ") + ": only the number of " + M("σ") + " from the mean matters. Tap a piece to shade it, or move the edges." :
      "500 Grade 12 heights " + '<span class="mdm-model">model data</span>. Press <strong>Fit</strong>, or match the curve to the bars with the sliders.';
    $("#np-aha", host).innerHTML = t;
  }
  function renderExtra(){
    var ex = $("#np-extra", host), h = "";
    if (S.mode === "compare") h = '<div class="q-actions"><button type="button" class="btn primary sm" data-act="freeze" data-k="npfreeze">Freeze this curve</button><button type="button" class="btn ghost sm" data-act="clear" data-k="npclear">Clear the ghost</button></div>';
    else if (S.mode === "rule") {
      h = '<div class="np-edges">' + ["a", "b"].map(function(w){ return '<label class="slider"><span class="slider-top"><span>' + (w === "a" ? "Left edge" : "Right edge") + '</span><output id="np-' + w + 'o"></output></span><input type="range" id="np-' + w + '" data-edge="' + w + '" min="-3" max="3" step="1" value="' + S[w] + '"></label>'; }).join("") + "</div>" +
        '<p class="tiny muted np-pl">Pieces (tap to shade or unshade):</p><div class="np-pcs" role="group" aria-label="Pieces of the curve">' + RULE.map(function(p, i){
          var z = pieceZ(i), lab = i === 0 ? "below " + M(kTxt(-3)) : i === 7 ? "above " + M(kTxt(3)) : M(kTxt(z[0])) + " to " + M(kTxt(z[1]));
          return '<button type="button" class="np-pc" data-pc="' + i + '" data-k="nppc' + i + '" aria-pressed="false">' + lab + ' <span class="np-pp">' + p + "%</span></button>"; }).join("") + "</div>" +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="unshade" data-k="npunshade">Clear the shading</button></div>';
    } else if (S.mode === "data") h = '<div class="q-actions"><button type="button" class="btn primary sm" data-act="fit" data-k="npfit">Fit</button></div><p class="tiny muted">Fit sets ' + M("μ = 170") + " and " + M("σ = 8") + ", the data’s mean and standard deviation.</p>";
    MV.keepFocus(ex, function(){ ex.innerHTML = h; });
  }
  function paintExtra(){
    if (S.mode !== "rule") return;
    var m = r2(mu()), s = r2(sd());
    ["a", "b"].forEach(function(w){
      var inp = $("#np-" + w, host), out = $("#np-" + w + "o", host); if (!inp) return;
      if (+inp.value !== S[w]) inp.value = S[w];
      out.innerHTML = M(kTxt(S[w])) + " = " + mn(r2(m + S[w] * s));
      inp.setAttribute("aria-valuetext", kPlain(S[w]) + ", " + r2(m + S[w] * s));
    });
    host.querySelectorAll("[data-pc]").forEach(function(b){ b.setAttribute("aria-pressed", String(!!S.sel[+b.dataset.pc])); });
  }
  function paint(){ paintChart(); paintCap(); paintRead(); paintAha(); paintExtra(); $("#np-msg", host).innerHTML = msg; }
  function renderAll(){ sanitize(); modeR.set(S.mode); syncSliders(); renderExtra(); paint(); }

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg")) return;
    var act = b.dataset.act;
    if (b.dataset.pc != null) { user(); var i = +b.dataset.pc; S.sel[i] = !S.sel[i]; syncHandles(); save(); paint(); MV.changed(); return; }
    if (act === "freeze") { user(); S.ghost = { mu:S.mu, sd:S.sd }; msg = "Frozen: the dashed ghost is " + M("N(" + S.mu + ", " + S.sd + "^2)") + ". Now change " + M("μ") + " or " + M("σ") + "."; save(); paint(); MV.changed(); return; }
    if (act === "clear") { user(); S.ghost = null; msg = ""; save(); paint(); MV.changed(); return; }
    if (act === "unshade") { user(); S.sel = [false, false, false, false, false, false, false, false]; save(); paint(); MV.changed(); return; }
    if (act === "fit") { user(); S.mu = 170; S.sd = 8; syncSliders(); msg = "Fitted: " + M("μ = 170") + " and " + M("σ = 8") + ". The curve follows the bars closely."; save(); paint(); MV.changed(); return; }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.edge) return;
    user();
    var w = t.dataset.edge, v = clampI(t.value, -3, 3, 0);
    if (w === "a") { if (v > 2) v = 2; S.a = v; if (S.b <= v) S.b = v + 1; }
    else { if (v < -2) v = -2; S.b = v; if (S.a >= v) S.a = v - 1; }
    S.sel = rangeSel(S.a, S.b); save(); paint(); MV.changed();
  });
  // canvas: tap a piece to toggle it; drag a handle along the axis (snaps to μ + kσ)
  function zAt(e){ var r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top; if (!map.W) return null; var x = map.x0 + (px - map.L) / (map.W - map.L - map.R) * (map.x1 - map.x0); return { px:px, py:py, z:(x - mu()) / sd() }; }
  function hPx(k){ return map.L + (mu() + k * sd() - map.x0) / (map.x1 - map.x0) * (map.W - map.L - map.R); }
  cv.addEventListener("pointerdown", function(e){
    if (S.mode !== "rule" || anim) return;
    var q = zAt(e); if (!q) return;
    if (q.py > map.bot - 10) { var da = Math.abs(q.px - hPx(S.a)), db = Math.abs(q.px - hPx(S.b)); if (Math.min(da, db) < 16) { drag = da <= db ? "a" : "b"; cv.setPointerCapture(e.pointerId); e.preventDefault(); return; } }
    if (q.py > map.bot) return;
    user(); var i = Math.max(0, Math.min(7, Math.floor(q.z) + 4)); S.sel[i] = !S.sel[i]; syncHandles(); save(); paint(); MV.changed();
  });
  cv.addEventListener("pointermove", function(e){
    if (!drag) return; var q = zAt(e); if (!q) return;
    var k = clampI(q.z, -3, 3, 0);
    if (drag === "a") { k = Math.min(k, S.b - 1); if (k === S.a) return; S.a = k; } else { k = Math.max(k, S.a + 1); if (k === S.b) return; S.b = k; }
    S.sel = rangeSel(S.a, S.b); save(); paint(); MV.changed();
  });
  function endDrag(){ drag = null; }
  cv.addEventListener("pointerup", endDrag); cv.addEventListener("pointercancel", endDrag);

  renderAll();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); msg = ""; pv = {};
    var s = p.start || {};
    S.mode = s.mode; S.mu = s.mu; S.sd = s.sd; S.ghost = null;
    if (s.mode === "rule") { S.sel = [false, false, false, false, false, false, false, false]; S.a = -2; S.b = 2; }
    save(); renderAll();
  }
  function runPred(p, done){
    var s = p.start || {}, to = p.to || {};
    var a = newAnim(function(){
      if (to.sd != null) S.sd = to.sd; if (to.mu != null) S.mu = to.mu;
      if (p.shade) { p.shade.forEach(function(k){ S.sel[k + 4] = true; }); syncHandles(); }
      pv = {}; save(); syncSliders(); paint(); MV.changed(); done();
    });
    if (s.mode === "compare") {
      S.ghost = { mu:s.mu, sd:s.sd }; save(); paint();
      a.stop = MV.tween({ dur:1800, step:function(t){ if (to.sd != null) pv.sd = s.sd + (to.sd - s.sd) * t; if (to.mu != null) pv.mu = s.mu + (to.mu - s.mu) * t; paintChart(); paintCap(); paintRead(); },
        done:function(){ a.timer = MV.wait(400, endAnim); } });
    } else {
      var list = (p.shade || []).slice(), step = function(){
        if (!anim || anim !== a) return;
        if (!list.length) { a.timer = MV.wait(400, endAnim); return; }
        S.sel[list.shift() + 4] = true; paint(); a.timer = MV.wait(MV.reduceMotion ? 0 : 650, step);
      };
      a.timer = MV.wait(MV.reduceMotion ? 0 : 300, step);
    }
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; }, m = S.mu, s = S.sd;
    if (id === "tc1") {
      if (m === 80 && s === 10) return { ok:true };
      if (m === 80 && s === 20) return R("That puts <strong>68%</strong> between 60 and 100: they’re only one SD from 80.");
      if (m === 80 && s === 5) return R("`±2σ` would be 70 to 90.");
      if (s === 10) return R("The band must be centred at the mean.");
      return R("Now `μ ± 2σ` runs from " + mn(m - 2 * s) + " to " + mn(m + 2 * s) + ". You need 60 to 100.");
    }
    if (id === "tc2") {
      if (m !== 115) return R("Keep the mean at 115.");
      if (s === 15) return { ok:true };
      if (s === 7 || s === 8) return R("Above `μ + 2σ` is only 2.5%; 16% is above `μ + σ`.");
      if (s === 30) return R("130 would be only half a SD above 115.");
      return R("Now 16% lies above `μ + σ` = " + mn(m + s) + ". You need 130.");
    }
    if (id === "tc3") {
      if (m === 72 && s === 10) return { ok:true };
      if (m === 67 && s === 15) return R("52 and 82 aren’t equally far from the mean: 52 is `2σ` below, 82 is `1σ` above.");
      if (m === 67 && (s === 7 || s === 8)) return R("16% above means 82 is only `1σ` above.");
      if (m === 72) return R("Check: `72 - 2σ` must equal 52.");
      return R("Now 2.5% lies below `μ - 2σ` = " + mn(m - 2 * s) + " and 16% lies above `μ + σ` = " + mn(m + s) + ". You need 52 and 82.");
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: model heights build a histogram, the bars narrow, a bell curve settles, the bands shade outward ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "", H = heights();
  var st = { n:0, w:4, curve:0, mean:false, up:0 };
  plot.render = function(){
    var k = Math.round(64 / st.w);
    normalCurve(plot, { x0:138, x1:202, ymax:0.065, yStep:0.01, xStep:8, mu:170, sd:8, noY:true, kLabels:st.up > 0, curveA:st.curve, meanLab:st.mean ? "mean = median = mode" : null,
      infl:st.curve > 0.99, rule:st.up > 0 ? { upTo:st.up, sel:null } : null, hist:{ x0:138, w:st.w, counts:binCounts(H, 138, st.w, k, Math.round(st.n)), n:500 }, describe:aria });
  };
  var cap = f.cap;
  function last(){ st = { n:500, w:2, curve:1, mean:true, up:3 }; plot.render(); cap.textContent = "34% · 34% · 13.5% · 13.5% · 2.35% · 2.35%"; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "500 model heights (cm)";
  MV.tween({ dur:1600, step:function(t){ st.n = 500 * t; plot.render(); }, done:function(){
    MV.wait(500, function(){
      st.w = 2; plot.render(); cap.textContent = "Narrower bars, the same bell shape";
      MV.wait(800, function(){
        cap.textContent = "A smooth curve settles over the bars";
        MV.tween({ dur:900, step:function(t){ st.curve = t; plot.render(); }, done:function(){
          st.mean = true; plot.render(); cap.textContent = "The peak: mean = median = mode";
          var labs = ["68% within 1σ", "95% within 2σ", "99.7% within 3σ"], i = 0;
          (function band(){ MV.wait(900, function(){ if (i >= 3) { last(); return; } st.up = i + 1; cap.textContent = labs[i]; i++; plot.render(); band(); }); })();
        } });
      });
    });
  } });
}

// ---------- Part 3: Is it normal? (five model-data stations) ----------
// @component D10 dataHistogram — frequency histogram of model data (bars --pen at low alpha, outlined) with a teal mean
// line and a dashed --ink-2 median line, both labelled, and an optional normal overlay (--ink) using the set's own mean and
// SD, scaled to counts (n × bin width × density). histChart(plot, { s, overlay, describe })
function histChart(plot, s, overlay, describe){
  var k = s.bins.length, bx1 = s.x0 + k * s.w, lo = Math.min(s.x0, s.mean - 3 * s.sd) - s.w / 2, hi = Math.max(bx1, s.mean + 3 * s.sd) + s.w / 2;
  var cmax = Math.max.apply(null, s.bins), peak = s.n * s.w / (s.sd * Math.sqrt(2 * Math.PI)), ymax = Math.max(cmax, overlay ? peak : 0) * 1.18;
  var stepY = [5, 10, 20, 25, 50, 100, 200].filter(function(t){ return ymax / t <= 6; })[0] || 500;
  plot.draw({ grid:false, axes:false, ticks:false, describe:describe, after:function(ctx, p){
    var W = p.W, H = p.H, L = 40, R = 12, T = 34, B = 30, bot = H - B;
    function sx(x){ return L + (x - lo) / (hi - lo) * (W - L - R); }
    function sy(y){ return bot - y / ymax * (bot - T); }
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), sheet = css("--sheet"), teal = css("--p-d"), fUI = p.fontUI, fM = p.fontM;
    ctx.save();
    ctx.strokeStyle = css("--plot-grid"); ctx.lineWidth = 1; ctx.beginPath();
    for (var v = stepY; v <= ymax; v += stepY) { var py = Math.round(sy(v)) + 0.5; ctx.moveTo(L, py); ctx.lineTo(W - R, py); } ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = "11px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = 0; v <= ymax; v += stepY) ctx.fillText(String(v), L - 5, sy(v));
    s.bins.forEach(function(c, j){
      var a = sx(s.x0 + j * s.w), b = sx(s.x0 + (j + 1) * s.w), t = sy(c);
      ctx.globalAlpha = 0.25; ctx.fillStyle = pen; ctx.fillRect(a, t, b - a, bot - t);
      ctx.globalAlpha = 0.85; ctx.strokeStyle = pen; ctx.lineWidth = 1; ctx.strokeRect(a + 0.5, t + 0.5, b - a - 1, bot - t - 1); ctx.globalAlpha = 1;
    });
    if (overlay) {
      ctx.save(); ctx.beginPath(); ctx.rect(L, 0, W - L - R, bot); ctx.clip();
      ctx.strokeStyle = ink; ctx.lineWidth = 2.6; ctx.beginPath();
      for (var i = 0; i <= 240; i++) { var x = lo + (hi - lo) * i / 240, y = s.n * s.w * pdf(x, s.mean, s.sd); if (i) ctx.lineTo(sx(x), sy(y)); else ctx.moveTo(sx(x), sy(y)); }
      ctx.stroke(); ctx.restore();
    }
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, bot + 0.5); ctx.lineTo(W - R, bot + 0.5); ctx.stroke();
    // mean (teal, solid) and median (ink-2, dashed)
    var mx = Math.round(sx(s.mean)) + 0.5, dx = Math.round(sx(s.median)) + 0.5;
    ctx.strokeStyle = teal; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(mx, bot); ctx.lineTo(mx, T - 2); ctx.stroke();
    ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(dx, bot); ctx.lineTo(dx, T + 12); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = "700 12px " + fUI; ctx.textBaseline = "bottom";
    var right = mx >= dx;
    ctx.textAlign = right ? "left" : "right"; ctx.fillStyle = teal; ctx.fillText("mean", mx + (right ? 4 : -4), T - 4);
    ctx.textAlign = right ? "right" : "left"; ctx.fillStyle = ink2; ctx.fillText("median", dx + (right ? -4 : 4), T + 12);
    // x labels: bin centres for the die, otherwise bin edges (skipping any that would overlap)
    ctx.fillStyle = ink; ctx.font = "12px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var xs = [], j2;
    if (s.w === 1) for (j2 = 0; j2 < k; j2++) xs.push(s.x0 + (j2 + 0.5) * s.w); else for (j2 = 0; j2 <= k; j2++) xs.push(s.x0 + j2 * s.w);
    var lastR = -1e9;
    xs.forEach(function(x){ var lab = s.money ? money(x) : mn(String(x)), w = ctx.measureText(lab).width, cx = sx(x); if (cx - w / 2 < lastR + 8 || cx + w / 2 > W) return; ctx.fillText(lab, cx, bot + 8); lastR = cx + w / 2; });
    ctx.restore();
  } });
}
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [], VD = P3.verdicts || [], RS = P3.reasons || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.st = S.st && typeof S.st === "object" ? S.st : {};
  ST.forEach(function(s){ var x = S.st[s.id]; if (!x || typeof x !== "object") x = S.st[s.id] = {}; x.v = x.v || ""; x.r = x.r || ""; x.ok = !!x.ok; x.ov = !!x.ov; });
  var plot = null, tabsR, vR, rR;
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + s.id + ": " + s.title + (S.st[s.id].ok ? ' <span class="np-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="np3-tabs"></div><div id="np3-body"></div>';
  tabText();
  tabsR = radios($("#np3-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function fmtV(s, v){ return s.money ? money(v) : mn(String(v)); }
  function judge(s, x){
    var ans = MV.ans(s) || {};
    if (!x.v || !x.r) return { bad:"Choose a verdict and one reason first." };
    if (x.v !== ans.v) return { bad:(s.vfb && s.vfb[x.v]) || "Look again at the shape and at mean vs median." };
    if ((ans.r || []).indexOf(x.r) < 0) return { bad:"The verdict is right, but that reason doesn’t fit. " + ((s.rfb && s.rfb[x.r]) || "") };
    return { ok:true };
  }
  function draw(){ var s = st(S.cur), x = S.st[s.id]; if (!plot) return;
    histChart(plot, s, x.ov, "Histogram of " + s.data + ", " + s.n + " values (model data). Mean " + fmtV(s, s.mean) + ", median " + fmtV(s, s.median) + "." + (x.ov ? " A normal curve with the same mean and standard deviation is drawn over the bars." : "")); }
  function paintFb(){
    var s = st(S.cur), x = S.st[s.id], el = $("#np3-fb", host); if (!el) return;
    if (x.ok) el.innerHTML = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s.right);
    else if (x.chk && x.chk === x.v + "|" + x.r) { var j = judge(s, x); el.innerHTML = j.bad ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + j.bad) : ""; }
    else el.innerHTML = "";
    var c = $("#np3-chk", host); if (c) c.disabled = x.ok;
  }
  function paint(){
    tabText(); tabsR.refresh();
    var s = st(S.cur), x = S.st[s.id], body = $("#np3-body", host);
    body.innerHTML = '<div class="np3-card"><span class="np3-lab">Station ' + s.id + " · " + s.title + '</span><p class="np3-text">' + s.data + ", " + MV.mdm.fmt(s.n) + ' values <span class="mdm-model">model data</span></p>' +
      '<div class="np3-grid"><div class="np3-fig"><canvas class="plot np3-plot" id="np3-plot" role="img" aria-label="Histogram"></canvas>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="np3-ov" data-k="np3ov" aria-pressed="' + x.ov + '">Overlay normal curve: ' + (x.ov ? "on" : "off") + "</button></div></div>" +
      '<div class="np3-panel"><h4 class="np3-h">Check it with data</h4><dl class="read np3-read">' + MV.readoutHTML([
        ["Mean", '<span class="np-teal">' + fmtV(s, s.mean) + "</span>"], ["Median", fmtV(s, s.median)], ["Standard deviation", fmtV(s, s.sd)],
        ["Within 1 SD", s.w1 + '% <span class="muted tiny">(rule: 68%)</span>'], ["Within 2 SD", s.w2 + '% <span class="muted tiny">(rule: 95%)</span>']]) + "</dl></div></div>" +
      '<div id="np3-v" class="np3-ch"></div><div id="np3-r" class="np3-ch"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="np3-chk" data-k="np3chk">Check</button></div><div id="np3-fb" aria-live="polite"></div></div>';
    plot = new MV.Plot($("#np3-plot", body), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw; draw();
    vR = radios($("#np3-v", body), { label:"Verdict:", aria:"Verdict for station " + s.id, options:VD, value:x.v, cls:"chips", onChange:function(v){ x.v = v; api.save(); paintFb(); } });
    rR = radios($("#np3-r", body), { label:"Reason:", aria:"Reason for station " + s.id, options:RS, value:x.r, cls:"chips", onChange:function(v){ x.r = v; api.save(); paintFb(); } });
    if (x.ok) { vR.lock(true); rR.lock(true); }
    paintFb();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    var s = st(S.cur), x = S.st[s.id];
    if (b.id === "np3-ov") { x.ov = !x.ov; api.save(); b.setAttribute("aria-pressed", String(x.ov)); b.textContent = "Overlay normal curve: " + (x.ov ? "on" : "off"); draw(); return; }
    if (b.id === "np3-chk") {
      var j = judge(s, x); x.chk = x.v + "|" + x.r;
      if (j.ok) { x.ok = true; vR.lock(true); rR.lock(true); tabText(); tabsR.refresh(); }
      api.save(); paintFb(); MV.focusFb($("#np3-fb", host)); return;
    }
  });
  paint();
  return {};
}

// @component N4 pctEntry — number entry (adapted from MDM4U 20's N4 numEntry): one box per part with an optional unit after it
// (percent answers accept "16" or "16%"), a context line, named wrong answers ({part, match, fb}), three-level hints when
// the item has them, first-try scoring as the toolkit's N4.
// activity a: {id, title, summary, how, context, items:[{id, goal, star, prompt, label | parts, unit, answer, tol, display, why, wrong, hints}]}
function pnum(raw){ var s = String(raw == null ? "" : raw).replace(/[$\s,%  ]/g, ""); if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : null; }
function numEntry(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ var x = st.items[id] || (st.items[id] = { val:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.val)) x.val = []; return x; }
  function partsOf(it){ return it.parts || [it.label || "Your answer:"]; }
  function judge(it, vals){
    var ans = MV.ans(it), A = Array.isArray(ans) ? ans : [ans], P = partsOf(it), tol = it.tol || 0.001;
    var got = A.map(function(_, k){ return pnum(vals[k]); });
    if (got.some(function(v){ return v == null; })) return { bad:true };
    var oks = got.map(function(g, k){ return Math.abs(g - A[k]) <= tol + 1e-9; });
    if (oks.every(Boolean)) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ var k = w.part || 0; return !oks[k] && Math.abs(got[k] - w.match) <= tol + 1e-9; })[0];
    var fb = named ? named.fb : null;
    if (!fb && A.length > 1) {
      var lab = function(k){ return P[k].replace(/\s*[=:]\s*$/, ""); };
      var right = oks.map(function(o, k){ return o ? lab(k) : null; }).filter(Boolean), wrong = oks.map(function(o, k){ return o ? null : lab(k); }).filter(Boolean);
      if (right.length) fb = right.join(" and ") + (right.length > 1 ? " are" : " is") + " right. Check " + wrong.join(" and ") + ".";
    }
    return { ok:false, fb:fb };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.context ? '<p class="np-ctx">' + a.context + "</p>" : "") + (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), P = partsOf(it);
        var h = '<div class="q" data-ne="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="ne-row">' + P.map(function(p, k){
          return '<label class="ne-lab" for="ne-' + it.id + k + '"><span>' + p + '</span><input class="numin ne-in" id="ne-' + it.id + k + '" data-nin="' + it.id + '" data-nk="' + k + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val[k] || "") + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? '<span class="ne-u">' + it.unit + "</span>" : "") + "</label>";
        }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nin; if (!id) return; ist(id).val[+e.target.dataset.nk] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var b = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ne]"); if (!box) return;
    var it = a.items.filter(function(y){ return y.id === box.dataset.ne; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = (partsOf(it).length > 1 ? "Fill in every part. " : "") + "Enter a number such as 16, 16% or 2.5."; paint(); MV.focusFb(host.querySelector('[data-ne="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb ? r.fb + " " : "") + "Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ne="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: A fair test (μ chips 50…90, σ chips 5…20; 36 designs, exactly 5 valid) ----------
var MUS = [50, 55, 60, 65, 70, 75, 80, 85, 90], SDS = [5, 10, 15, 20];
var task = (function(){
  var api = null, plot = null;
  function read(){ var s = api ? api.S : {}; return { mu:MUS.indexOf(+s.mu) >= 0 ? +s.mu : 60, sd:SDS.indexOf(+s.sd) >= 0 ? +s.sd : 15 }; }
  function draw(){
    if (!plot) return;
    var d = read(), sc = yScale(d.sd);
    normalCurve(plot, { x0:0, x1:150, ymax:sc.ymax, yStep:sc.yStep, xStep:10, mu:d.mu, sd:d.sd, meanLab:"μ = " + d.mu, infl:false, sigBar:true,
      marks:[{ x:50, label:"50" }, { x:80, label:"80" }, { x:100, label:"100" }], shade:[[0, 50], [100, 150]],
      describe:"Exam marks N(" + d.mu + ", " + d.sd + " squared). Dashed lines at 50, 80 and 100; the tails below 50 and above 100 are shaded. μ − σ = " + (d.mu - d.sd) + ", μ + σ = " + (d.mu + d.sd) + ", μ + 2σ = " + (d.mu + 2 * d.sd) + "." });
  }
  function paint(){
    var d = read(), el = $("#ft-read"); if (!el) return;
    function ok(b){ return b ? ' <span class="np-ok">✓</span>' : ' <span class="np-no">✗</span>'; }
    el.innerHTML = MV.readoutHTML([
      ["Distribution", M("N(@d{" + d.mu + "}, @k{" + d.sd + "}^2)")],
      [M("μ + 2σ") + " (2.5% above)", (d.mu + 2 * d.sd) + " vs 100" + ok(d.mu + 2 * d.sd <= 100)],
      [M("μ - σ") + " (84% above)", (d.mu - d.sd) + " vs 50" + ok(d.mu - d.sd >= 50)],
      [M("μ + σ") + " (16% above)", (d.mu + d.sd) + " vs 80" + ok(d.mu + d.sd >= 80)]]);
    draw();
  }
  return {
    render:function(inp, pvw, a){
      api = a; var d = read(); a.S.mu = d.mu; a.S.sd = d.sd;
      inp.innerHTML = '<div class="ft-in"><div id="ft-mu"></div><div id="ft-sd"></div><p class="tiny muted">Pick a mean and a standard deviation; the curve and the checklist update as you go.</p></div>';
      pvw.innerHTML = '<canvas class="plot wide ft-plot" id="ft-plot" role="img" aria-label="Exam marks curve"></canvas><dl class="read ft-read" id="ft-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#ft-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      radios($("#ft-mu"), { label:"Mean " + M("@d{μ}") + ":", aria:"Mean", options:MUS.map(function(v){ return { id:v, t:String(v) }; }), value:d.mu, cls:"chips",
        onChange:function(v){ a.S.mu = +v; a.save(); paint(); a.update(); } });
      radios($("#ft-sd"), { label:"Standard deviation " + M("@k{σ}") + ":", aria:"Standard deviation", options:SDS.map(function(v){ return { id:v, t:String(v) }; }), value:d.sd, cls:"chips",
        onChange:function(v){ a.S.sd = +v; a.save(); paint(); a.update(); } });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.mu + 2 * d.sd <= 100, d.mu - d.sd >= 50, d.mu + d.sd >= 80, d.sd >= 10]; },
    key:function(d){ return d.mu + "," + d.sd; },
    label:function(k){ var q = k.split(","); return M("(μ, σ) = (" + q[0] + ", " + q[1] + ")"); },
    text:function(k){ var q = k.split(","); return "(μ, σ) = (" + q[0] + ", " + q[1] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ rule:numEntry, back:numEntry },
  task:task
});
})();
