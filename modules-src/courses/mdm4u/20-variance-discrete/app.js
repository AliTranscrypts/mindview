// MDM4U 20 Variance & Standard Deviation: hero (tight vs wide histograms on fulcrums, ±σ brackets grow), Spread meter
// (Explore: Build / Compare / Transform on a D7 histogram with mean marker and ±σ brackets; the Build table fills in one
// column at a time and its Σ row checks Var(X) and σ), Risk vs return (Part 3: three stations), N4 number entry with
// choice parts (practice), Same mean, different risk (prize-wheel task). Exact arithmetic (MV.mdm.frac); seeded simulations.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;
function M(s){ return MV.m(s); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function clamp01(t){ return Math.max(0, Math.min(1, t)); }
function mn(s){ return String(s).replace(/-/g, MV.MINUS); }
function d4(v){ var s = (Math.round(v * 1e4) / 1e4).toFixed(4).replace(/0+$/, "").replace(/\.$/, ""); return s === "-0" ? "0" : s; }
function d2(v){ var s = (Math.round(v * 100) / 100).toFixed(2).replace(/0+$/, "").replace(/\.$/, ""); return mn(s === "-0" ? "0" : s); }
function ex2(v){ return Math.abs(v * 100 - Math.round(v * 100)) < 1e-7; }
function fval(f){ return f.n / f.d; }
function fx(f){ return F.exactDec(f, 4) ? F.dec(f, 4) : F.txt(f); }                         // exact: decimal if it ends, else a fraction
function fxa(f){ return F.exactDec(f, 4) ? F.dec(f, 4) : F.txt(f) + " ≈ " + F.dec(f, 2); }   // exact, plus a 2-place value
function isSq(n){ var r = Math.round(Math.sqrt(n)); return r * r === n; }
function sqrtF(V){ return isSq(V.n) && isSq(V.d) ? F.of(Math.round(Math.sqrt(V.n)), Math.round(Math.sqrt(V.d))) : null; }
function sdShort(V){ var r = sqrtF(V); return r ? fx(r) : d2(Math.sqrt(fval(V))); }
function sqrtSrc(V){
  if (!V.n) return "√0 = 0";
  var inner = F.exactDec(V, 4) ? F.dec(V, 4) : "{" + F.txt(V) + "}", r = sqrtF(V);
  return "√" + inner + (r ? " = " + fx(r) : " ≈ " + d2(Math.sqrt(fval(V))));
}
function shortP(p){ var t = Math.round(p * 1000) / 1000; return Math.abs(t - p) < 1e-9 ? String(t) : MV.frac(p, 24); }
var Q = '<span class="vd-q">?</span>';
function warn(t){ return '<span class="vd-warn">⚠ ' + t + "</span>"; }

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

// @component D7 spreadChart — probability histograms with a mean marker and ±σ brackets (course plan D7 and §3: bars --pen,
// mean --ink line on a fulcrum, ±σ bracket --ink-2). One or more panels on a shared x-axis (stacked, or side by side with
// cols:true); each panel has its own name line, bars (optional outlined simulated bars), probability labels over wide bars,
// a bracket that can grow (bk 0…1) or hide ("±?"), and an optional ghost mean with an arrow to the new mean (μ shift).
// spreadChart(plot, { x0, x1, step, ymax, yStep, barW, cols, money, plabs, describe,
//   panels:[{name, sub, bars:[{x, p}], sim:[{x, p}], mu, sd, bk, bkLab, hideBk, ghostMu}] })
function spreadChart(plot, o){
  plot.draw({ grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var n = o.panels.length, W = p.W, H = p.H, gap = o.cols ? 16 : 10;
    o.panels.forEach(function(pn, i){
      var r = o.cols ? { x:i * (W + gap) / n, y:0, w:(W + gap) / n - gap, h:H } : { x:0, y:i * (H + gap) / n, w:W, h:(H + gap) / n - gap };
      drawPanel(ctx, p, r, o, pn);
    });
  } });
}
function drawPanel(ctx, p, r, o, pn){
  var L = o.cols ? 8 : 40, R = 10, by = r.y + 36, top = r.y + 60, bot = r.y + r.h - 25, left = r.x + L, right = r.x + r.w - R;
  var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), sheet = css("--sheet"), fUI = p.fontUI, fM = p.fontM;
  function sx(x){ return left + (x - o.x0) / (o.x1 - o.x0) * (right - left); }
  function sy(v){ return bot - Math.min(v, o.ymax * 1.04) / o.ymax * (bot - top); }
  ctx.save();
  // grid and y labels
  ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
  var v, gstep = o.yStep, every = (sy(0) - sy(gstep)) >= 15;
  for (v = gstep; v <= o.ymax + 1e-9; v += gstep) { var py = Math.round(sy(v)) + 0.5; ctx.moveTo(left, py); ctx.lineTo(right, py); }
  ctx.stroke();
  if (!o.cols) {
    ctx.fillStyle = ink2; ctx.font = "11px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = 0; v <= o.ymax + 1e-9; v += gstep) { var vv = Math.round(v * 1e6) / 1e6; if (every || vv === 0 || Math.abs(vv - o.ymax) < 1e-9) ctx.fillText(d2(vv), left - 5, sy(vv)); }
  }
  // bars
  var bw = Math.max(5, sx(o.x0 + o.barW) - sx(o.x0)), slot = bw;
  (pn.bars || []).forEach(function(b){
    if (!(b.p > 0)) return;
    var cx = sx(b.x), t = sy(b.p);
    ctx.fillStyle = pen; ctx.fillRect(cx - bw / 2, t, bw, bot - t);
    ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.strokeRect(cx - bw / 2 + 0.5, t + 0.5, bw - 1, bot - t - 1);
  });
  if (pn.sim && pn.sim.length) {
    ctx.strokeStyle = ink; ctx.lineWidth = 2;
    pn.sim.forEach(function(s){ if (!(s.p > 0)) return; var cx = sx(s.x), t = sy(s.p); ctx.strokeRect(cx - bw / 2 - 3, t, bw + 6, bot - t); });
  }
  // axis and x labels
  ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(left, bot); ctx.lineTo(right, bot); ctx.stroke();
  ctx.fillStyle = ink; ctx.font = "13px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
  var st = o.step, x0 = Math.ceil(o.x0 / st - 1e-9) * st, lastR = -1e9;
  for (var x = x0; x <= o.x1 + 1e-9; x += st) {
    var lab = o.money ? "$" + Math.round(x) : d2(x), w = ctx.measureText(lab).width, cx2 = sx(x);
    if (cx2 - w / 2 < lastR + 4 || (o.labMin != null && x < o.labMin - 1e-9) || (o.labMax != null && x > o.labMax + 1e-9)) continue;
    ctx.fillText(lab, cx2, bot + 11); lastR = cx2 + w / 2;
  }
  // ghost mean and shift arrow (transform)
  if (pn.ghostMu != null && pn.mu != null) {
    var gx = sx(pn.ghostMu);
    ctx.strokeStyle = ink2; ctx.lineWidth = 1.4; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(gx, bot); ctx.lineTo(gx, by - 8); ctx.stroke(); ctx.setLineDash([]);
    var mx = sx(pn.mu), ay = by + 15;
    if (Math.abs(mx - gx) > 10) {
      ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(gx, ay); ctx.lineTo(mx, ay); ctx.stroke();
      var dir = mx > gx ? 1 : -1; ctx.beginPath(); ctx.moveTo(mx, ay); ctx.lineTo(mx - dir * 8, ay - 4.5); ctx.lineTo(mx - dir * 8, ay + 4.5); ctx.closePath(); ctx.fill();
    }
  }
  // mean marker on a fulcrum, and the ±σ bracket
  if (pn.mu != null) {
    var mux = sx(pn.mu);
    ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mux, bot); ctx.lineTo(mux, by); ctx.stroke();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(mux, bot + 1); ctx.lineTo(mux - 7, bot + 10); ctx.lineTo(mux + 7, bot + 10); ctx.closePath(); ctx.fill();
    ctx.font = "600 12px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    var bk = pn.bk == null ? 1 : pn.bk;
    if (pn.hideBk) { ctx.fillStyle = ink2; ctx.fillText("±?", mux, by - 6); }
    else if (pn.sd != null && pn.sd > 1e-9 && bk > 0) {
      var a = sx(pn.mu - pn.sd * bk), b = sx(pn.mu + pn.sd * bk);
      ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a, by); ctx.lineTo(b, by); ctx.moveTo(a, by - 6); ctx.lineTo(a, by + 6); ctx.moveTo(b, by - 6); ctx.lineTo(b, by + 6); ctx.stroke();
      if (bk > 0.97 && pn.bkLab) { ctx.fillStyle = ink2; ctx.fillText(pn.bkLab, mux, by - 6); }
    } else if (pn.sd != null && pn.sd <= 1e-9 && bk > 0) { ctx.fillStyle = ink2; ctx.fillText("σ = 0", mux, by - 6); }
  }
  // probability labels over wide bars (on a sheet-coloured backing so the mean line never runs through them)
  if (o.plabs !== false && slot >= 30) {
    ctx.font = "600 11px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    (pn.bars || []).forEach(function(b){ if (!(b.p > 0)) return; var tx = shortP(b.p), tw = ctx.measureText(tx).width, ty = sy(b.p) - 2;
      ctx.fillStyle = sheet; ctx.fillRect(sx(b.x) - tw / 2 - 2, ty - 12, tw + 4, 12); ctx.fillStyle = ink; ctx.fillText(tx, sx(b.x), ty); });
  }
  // name line
  ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = "700 13px " + fUI; ctx.fillStyle = ink;
  ctx.fillText(pn.name || "", r.x + (o.cols ? 4 : 2), r.y + 2);
  if (pn.sub) { var nw = ctx.measureText(pn.name || "").width; ctx.font = "12px " + fUI; ctx.fillStyle = ink2; ctx.fillText(pn.sub, r.x + (o.cols ? 4 : 2) + nw + 10, r.y + 3); }
  ctx.restore();
}
function niceStep(span){ var c = [1, 2, 5, 10, 20, 25, 50]; for (var i = 0; i < c.length; i++) if (span / c[i] <= 12) return c[i]; return 100; }
function rangeOf(vals){
  vals = vals.filter(function(v){ return isFinite(v); });
  var lo = vals.length ? Math.min.apply(null, vals) : 0, hi = vals.length ? Math.max.apply(null, vals) : 10;
  var a = Math.floor(lo - 0.8), b = Math.ceil(hi + 0.8);
  if (b - a < 10) { var e = 10 - (b - a); a -= Math.floor(e / 2); b += Math.ceil(e / 2); }
  return { x0:a, x1:b, step:niceStep(b - a) };
}
function yScale(m){ return m <= 0.2 + 1e-9 ? { ymax:0.2, yStep:0.1 } : m <= 0.3 + 1e-9 ? { ymax:0.3, yStep:0.1 } : m <= 0.5 + 1e-9 ? { ymax:0.5, yStep:0.1 } : m <= 0.75 + 1e-9 ? { ymax:0.75, yStep:0.25 } : { ymax:1, yStep:0.25 }; }
function barWOf(panels){
  var g = 1;
  panels.forEach(function(pn){ var xs = pn.bars.filter(function(b){ return b.p > 0; }).map(function(b){ return b.x; }).sort(function(a, b){ return a - b; }); for (var i = 1; i < xs.length; i++) if (xs[i] - xs[i - 1] > 1e-9) g = Math.min(g, xs[i] - xs[i - 1]); });
  return g * 0.86;
}

// ---------- distributions: tables of strings -> exact rows and statistics ----------
var PRE = {
  die:{ t:"Die", rows:[["1", "1/6"], ["2", "1/6"], ["3", "1/6"], ["4", "1/6"], ["5", "1/6"], ["6", "1/6"]] },
  tight:{ t:"Tight (4, 5, 6)", rows:[["4", "0.25"], ["5", "0.5"], ["6", "0.25"]] },
  wide:{ t:"Wide (1, 5, 9)", rows:[["1", "0.25"], ["5", "0.5"], ["9", "0.25"]] },
  two:{ t:"Two-point (0, 10)", rows:[["0", "0.9"], ["10", "0.1"]] },
  sev:{ t:"1 or 7", rows:[["1", "0.5"], ["7", "0.5"]] },
  custom:{ t:"Custom", rows:[["1", "0.2"], ["2", "0.5"], ["3", "0.3"]] }
};
var LIST = ["die", "tight", "wide", "two", "custom"], LIST_T = ["die", "tight", "wide", "two", "sev", "custom"];
function rowsOf(pre){ return PRE[pre].rows.map(function(r){ return { x:r[0], p:r[1] }; }); }
function cloneRows(rows){ return rows.map(function(r){ return { x:r.x, p:r.p }; }); }
function defTab(pre){ return { pre:pre, rows:rowsOf(pre), cust:null }; }
function tabOk(t, pre){
  if (!t || typeof t !== "object" || !Array.isArray(t.rows) || !t.rows.length) return defTab(pre);
  t.rows = t.rows.slice(0, 6).map(function(r){ return { x:String(r && r.x != null ? r.x : ""), p:String(r && r.p != null ? r.p : "") }; });
  if (!PRE[t.pre]) t.pre = "custom";
  if (t.cust && !Array.isArray(t.cust)) t.cust = null;
  return t;
}
function readTab(rows){
  var out = [], errs = [], seen = {};
  rows.forEach(function(r, i){
    var xf = F.parse(r.x), pf = F.parse(r.p);
    if (!xf || Math.abs(fval(xf)) > 10 + 1e-9) { errs.push("Row " + (i + 1) + ": give a value of " + M("x") + " from −10 to 10."); return; }
    var k = F.txt(xf); if (seen[k]) { errs.push("Each value of " + M("x") + " appears once: " + k + " is listed twice."); return; } seen[k] = 1;
    if (!pf || pf.n < 0 || pf.n > pf.d) { errs.push("Row " + (i + 1) + ": enter a probability from 0 to 1, such as 0.25 or 1/8."); return; }
    out.push({ xf:xf, pf:pf, x:fval(xf), p:fval(pf) });
  });
  out.sort(function(a, b){ return a.x - b.x; });
  var s = F.of(0, 1); out.forEach(function(r){ s = F.add(s, r.pf); });
  var valid = !errs.length && out.length > 0 && F.eq(s, F.of(1, 1));
  if (!errs.length && out.length && !valid) errs.push("The probabilities add to " + fx(s) + ", not 1.");
  return { rows:out, errs:errs, sum:s, valid:valid };
}
function stats(rows){
  var mu = F.of(0, 1), e2 = F.of(0, 1), V = F.of(0, 1), terms = [];
  rows.forEach(function(r){ mu = F.add(mu, F.mul(r.xf, r.pf)); e2 = F.add(e2, F.mul(F.mul(r.xf, r.xf), r.pf)); });
  rows.forEach(function(r){ var dv = F.sub(r.xf, mu), sq = F.mul(dv, dv), t = F.mul(sq, r.pf); V = F.add(V, t); terms.push({ dv:dv, sq:sq, t:t }); });
  return { mu:mu, e2:e2, V:V, sd:Math.sqrt(fval(V)), terms:terms };
}
function distOf(tab){ var d = readTab(tab.rows); if (d.valid) d.st = stats(d.rows); return d; }
function fromRows(rows){ rows.sort(function(a, b){ return a.x - b.x; }); return { rows:rows, errs:[], valid:true, sum:F.of(1, 1), st:stats(rows) }; }
function sigOf(tab){ var d = readTab(tab.rows); return d.valid ? d.rows.map(function(r){ return F.txt(r.xf) + ":" + F.txt(r.pf); }).join(",") : ""; }
function sameTable(d, want){ return d.valid && d.rows.length === want.length && want.every(function(w, i){ return Math.abs(d.rows[i].x - w[0]) < 1e-9 && Math.abs(d.rows[i].p - w[1]) < 1e-9; }); }
function termsTxt(d){ return d.st.terms.map(function(t, i){ return t.sq.n === 0 && d.rows.length > 1 ? "0" : fx(t.sq) + "(" + fx(d.rows[i].pf) + ")"; }).join(" + "); }
function withinTxt(d){
  var mu = fval(d.st.mu), sd = d.st.sd, lo = mu - sd, hi = mu + sd, s = F.of(0, 1);
  d.rows.forEach(function(r){ if (r.x >= lo - 1e-9 && r.x <= hi + 1e-9) s = F.add(s, r.pf); });
  if (sd < 1e-12) return M("P(X = " + fx(d.st.mu) + ") = " + fx(s));
  return M("P(" + d2(lo) + " <= X <= " + d2(hi) + ") = " + fx(s));
}
function num(raw){ var s = String(raw == null ? "" : raw).replace(/[$\s,]/g, ""); if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : null; }
function aTxt(a){ return a === 1 ? "" : a === -1 ? "-" : String(a); }
function yName(a, b){ return "Y = " + aTxt(a) + "X" + (b > 0 ? " + " + b : b < 0 ? " - " + (-b) : ""); }

// ---------- Explore: Spread meter ----------
var KS = ["0.5", "1", "1.5", "2", "3", "4"];
function explore(host, api){
  var S = api.S;
  function obj(o){ return o && typeof o === "object" ? o : {}; }
  function aOk(a){ a = Math.round(+a * 2) / 2; return isFinite(a) && a !== 0 && a >= -4 && a <= 4 ? a : 2; }
  function sanitize(){
    if (["build", "compare", "transform"].indexOf(S.mode) < 0) S.mode = "build";
    S.b = obj(S.b); S.b.t = tabOk(S.b.t, "wide"); S.b.view = S.b.view === "short" ? "short" : "def"; S.b.col = clampI(S.b.col, 0, 3, 0);
    S.b.v = String(S.b.v || ""); S.b.s = String(S.b.s || ""); S.b.shown = String(S.b.shown || "");
    S.c = obj(S.c); S.c.a = tabOk(S.c.a, "tight"); S.c.b = tabOk(S.c.b, "wide"); S.c.lock = S.c.lock == null ? true : !!S.c.lock; if (KS.indexOf(String(S.c.k)) < 0) S.c.k = "4";
    S.t = obj(S.t); S.t.x = tabOk(S.t.x, "wide"); S.t.a = aOk(S.t.a == null ? 2 : S.t.a); S.t.b = clampI(S.t.b == null ? 3 : S.t.b, -10, 50, 3);
  }
  sanitize();
  var pv = {}, anim = null, bmsg = "", preRs = {}, plot;

  host.innerHTML = '<div id="vd-mode" class="vd-mode"></div>' +
    '<div class="pg vd-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap vd-cap" id="vd-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<canvas class="plot vd-plot" id="vd-plot" role="img" aria-label="Probability histogram with its mean and standard deviation"></canvas><p class="vd-aha" id="vd-aha"></p></div>' +
    '<div class="pg-ctrl"><div id="vd-ctrl"></div><p class="tiny vd-msg" id="vd-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="vd-read" aria-live="polite"></dl></div></div>';
  plot = new MV.Plot($("#vd-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintChart;
  var modeR = radios($("#vd-mode", host), { label:"Mode", options:[{ id:"build", t:"Build" }, { id:"compare", t:"Compare" }, { id:"transform", t:"Transform" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; bmsg = ""; save(); renderAll(); MV.changed(); } });

  function save(){ api.save(); }
  function tabOf(k){ return k === "b" ? S.b.t : k === "ca" ? S.c.a : k === "cb" ? S.c.b : S.t.x; }
  function user(){ cancelAnim(); MV.banner("", ""); }
  function newAnim(fin){ cancelAnim(); anim = { stop:null, timer:null, fin:fin }; return anim; }
  function cancelAnim(){ if (!anim) return; var a = anim; anim = null; if (a.stop) a.stop(); if (a.timer) clearTimeout(a.timer); if (a.fin) a.fin(); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) a.fin(); }
  function curA(){ return pv.ta != null ? pv.ta : S.t.a; }
  function curB(){ return pv.tb != null ? pv.tb : S.t.b; }

  // --- the distributions on show ---
  function distB(){
    if (!S.c.lock) return distOf(S.c.b);
    var A = distOf(S.c.a); if (!A.valid) return { rows:[], errs:["B follows A: make A valid first."], valid:false };
    var k = F.parse(S.c.k), mu = A.st.mu;
    return fromRows(A.rows.map(function(r){ var xf = F.add(mu, F.mul(k, F.sub(r.xf, mu))); return { xf:xf, pf:r.pf, x:fval(xf), p:r.p }; }));
  }
  function distY(X, a, b){
    if (!X.valid) return { rows:[], errs:["Make " + M("X") + " valid first."], valid:false };
    var af = F.of(Math.round(a * 1000), 1000), bf = F.of(Math.round(b * 1000), 1000);   // animated a, b are rounded so the arithmetic stays exact
    return fromRows(X.rows.map(function(r){ var xf = F.add(F.mul(af, r.xf), bf); return { xf:xf, pf:r.pf, x:fval(xf), p:r.p }; }));
  }
  function bOpen(){ if (pv.hide || pv.hideRead) return false; if (S.mode !== "build") return true; var s = sigOf(S.b.t); return !!s && S.b.shown === s; }
  function pan(name, d, o){
    o = o || {};
    var p = { name:name, d:d, bars:d.rows.map(function(r){ return { x:r.x, p:r.p }; }), mu:d.valid ? fval(d.st.mu) : null, sd:d.valid ? d.st.sd : null, bk:pv.bk == null ? 1 : pv.bk };
    p.hideBk = !!o.hide; p.bkLab = d.valid ? (o.closed ? "±σ" : "±" + sdShort(d.st.V)) : "";
    p.sub = d.valid ? "μ = " + mn(fx(d.st.mu)) : d.rows.length ? "not a valid distribution yet" : "";
    return p;
  }
  function panels(){
    var P = [];
    if (S.mode === "build") P.push(pan("X", distOf(S.b.t), { hide:!!pv.hide, closed:!bOpen() }));
    else if (S.mode === "compare") { P.push(pan("A", distOf(S.c.a), { hide:!!pv.hide })); P.push(pan("B", distB(), { hide:!!pv.hide })); }
    else {
      var X = distOf(S.t.x), a = curA(), b = curB(), Y = distY(X, a, b), py = pan(mn(yName(Math.round(a * 100) / 100, Math.round(b * 100) / 100)), Y, { hide:!!pv.hide });
      P.push(pan("X", X)); if (X.valid) py.ghostMu = fval(X.st.mu); P.push(py);
    }
    return P;
  }
  function vals(P){ var v = []; P.forEach(function(pn){ pn.bars.forEach(function(b){ v.push(b.x); }); if (pn.mu != null) { v.push(pn.mu - pn.sd, pn.mu + pn.sd); } }); return v; }
  function describe(P){
    return P.map(function(pn, i){
      var d = pn.d, t = (S.mode === "build" ? "Probability histogram of X" : "Distribution " + pn.name) + ": ";
      if (!d.valid) return t + (d.rows.length ? "bars at " + d.rows.map(function(r){ return d2(r.x); }).join(", ") + ", not yet a valid distribution." : "no bars.");
      t += "bars at " + d.rows.map(function(r){ return d2(r.x); }).join(", ") + " with heights " + d.rows.map(function(r){ return shortP(r.p); }).join(", ") + "; mean " + mn(fx(d.st.mu));
      t += pn.hideBk || (S.mode === "build" && !bOpen()) ? ", standard deviation hidden" : ", standard deviation " + sdShort(d.st.V);
      if (i === 1 && P[0].d.valid && !pn.hideBk && P[0].sd > 1e-9) { var r = d.st.sd / P[0].sd; t += Math.abs(r - 1) < 1e-9 ? "; the same spread as " + P[0].name : r > 1 ? "; wider than " + P[0].name : "; narrower than " + P[0].name; }
      return t + ".";
    }).join(" ");
  }
  function paintChart(){
    var P = panels(), rg = pv.range || rangeOf(vals(P)), m = 0;
    P.forEach(function(pn){ pn.bars.forEach(function(b){ m = Math.max(m, b.p); }); });
    var sc = yScale(m);
    spreadChart(plot, { x0:rg.x0, x1:rg.x1, step:rg.step, ymax:sc.ymax, yStep:sc.yStep, barW:barWOf(P), panels:P, describe:describe(P) });
  }

  // --- readouts ---
  function readRows(){
    var rows = [], hide = !!pv.hide || !!pv.hideRead;
    if (S.mode === "build") {
      var d = distOf(S.b.t), open = bOpen();
      if (!d.valid) { rows.push(["Table", warn(d.errs[0] || "Add a value.")]); return rows; }
      var st = d.st, ask = '<span class="tiny muted"> Enter it in the Σ row, or press Show me.</span>';
      rows.push([M("μ"), M(fx(st.mu))]);
      rows.push([M("Var(X)"), open ? M(termsTxt(d) + " = " + fxa(st.V)) : Q + (hide ? "" : ask)]);
      rows.push([M("σ"), open ? M(sqrtSrc(st.V)) : Q]);
      rows.push(["Shortcut check", open ? M("E(X^2) - μ^2 = " + fx(st.e2) + " - " + fx(F.mul(st.mu, st.mu)) + " = " + fx(st.V)) : Q]);
      rows.push(["Within one " + M("σ") + " of " + M("μ"), open ? withinTxt(d) : Q]);
    } else if (S.mode === "compare") {
      var A = distOf(S.c.a), B = distB(), ok = A.valid && B.valid;
      if (!A.valid) rows.push(["Distribution A", warn(A.errs[0] || "Add a value.")]);
      if (!B.valid) rows.push(["Distribution B", warn(B.errs[0] || "Add a value.")]);
      function both(f, h){ return "A: " + (A.valid ? (h ? Q : f(A)) : "—") + '<br>B: ' + (B.valid ? (h ? Q : f(B)) : "—"); }
      rows.push([M("μ"), both(function(d){ return M(fx(d.st.mu)); }) + (ok ? (F.eq(A.st.mu, B.st.mu) ? ' <span class="tiny">(equal)</span>' : ' <span class="tiny">(different)</span>') : "")]);
      rows.push([M("Var(X)"), both(function(d){ return M(fxa(d.st.V)); }, hide)]);
      rows.push([M("σ"), both(function(d){ return M(sqrtSrc(d.st.V)); }, hide)]);
      if (ok) {
        var rt = "";
        if (A.st.V.n) { var r = F.div(B.st.V, A.st.V), q = sqrtF(r); rt = " (" + (q ? "×" + fx(q) : "× ≈ " + d2(Math.sqrt(fval(r)))) + ")"; }
        rows.push(["Compare", hide ? Q : M("σ") + ": " + sdShort(A.st.V) + " vs " + sdShort(B.st.V) + rt]);
      }
      rows.push(["Within one " + M("σ") + " of " + M("μ"), both(withinTxt, hide)]);
    } else {
      var X = distOf(S.t.x), a = S.t.a, b = S.t.b;
      if (!X.valid) { rows.push(["Distribution " + M("X"), warn(X.errs[0] || "Add a value.")]); return rows; }
      var Y = distY(X, a, b), sx = X.st, sy = Y.st, aa = Math.abs(a), sdE = sqrtF(sx.V);
      rows.push([M("X"), M("μ = " + fx(sx.mu)) + ", " + M("σ = " + sqrtSrc(sx.V))]);
      rows.push(["Transform", M(yName(a, b)) + ": " + M("μ") + " " + mn(fx(sy.mu)) + ", " + M("σ") + " " + (hide ? Q : sdShort(sy.V))]);
      rows.push([M("μ_Y"), M("aμ + b = " + (a < 0 ? "(" + a + ")" : a) + "(" + fx(sx.mu) + ") " + (b < 0 ? "- " + (-b) : "+ " + b) + " = " + fx(sy.mu))]);
      rows.push([M("σ_Y"), hide ? Q : M("|a|σ = " + aa + " × " + sdShort(sx.V) + (sdE && ex2(aa * fval(sdE)) ? " = " : " ≈ ") + d2(aa * sx.sd))]);
      rows.push([M("Var(Y)"), hide ? Q : M("a^2 Var(X) = " + fx(F.of(a * a)) + " × " + fx(sx.V) + " = " + fxa(sy.V))]);
    }
    return rows;
  }
  function paintRead(){ $("#vd-read", host).innerHTML = MV.readoutHTML(readRows()); }
  function paintCap(){
    var c = $("#vd-cap", host), h;
    if (S.mode === "build") h = M("Var(X) = Σ (x - μ)^2 P(x)");
    else if (S.mode === "compare") h = M("σ_A") + " vs " + M("σ_B");
    else h = M(yName(Math.round(curA() * 100) / 100, Math.round(curB())));
    c.innerHTML = h;
  }
  function paintAha(){
    var a = $("#vd-aha", host), t = "";
    if (pv.hide || pv.hideRead) t = "";
    else if (S.mode === "build") { var d = distOf(S.b.t); if (d.valid && bOpen() && d.rows.length > 1) t = "Each squared deviation is weighted by its probability, so rare values count less."; }
    else if (S.mode === "compare") {
      var A = distOf(S.c.a), B = distB();
      if (A.valid && B.valid) {
        if (!F.eq(A.st.mu, B.st.mu)) t = "The means differ (" + mn(fx(A.st.mu)) + " vs " + mn(fx(B.st.mu)) + "): turn on Lock means equal to compare spreads fairly.";
        else if (A.st.V.n && !F.eq(A.st.V, B.st.V)) { var q = sqrtF(F.div(B.st.V, A.st.V)), r = q ? fx(q) : "≈ " + d2(B.st.sd / A.st.sd); t = "Equal means (" + M("μ = " + fx(A.st.mu)) + ") hide a ×" + r + " difference in spread."; }
      }
    } else t = "Adding " + M("b") + " moves the brackets without widening them; multiplying by " + M("a") + " widens them by " + M("|a|") + ".";
    a.innerHTML = t; a.hidden = !t;
  }

  // --- controls ---
  function xIn(key, i, v, who){ return '<input type="number" step="any" class="numin vd-x" data-ed="' + key + "|" + i + '|x" data-k="' + key + "x" + i + '" value="' + MV.esc(v) + '" aria-label="' + who + " value " + (i + 1) + '">'; }
  function pIn(key, i, v, who){ return '<input type="text" autocomplete="off" spellcheck="false" class="numin vd-p" data-ed="' + key + "|" + i + '|p" data-k="' + key + "p" + i + '" value="' + MV.esc(v) + '" aria-label="' + who + " probability " + (i + 1) + ' (arrow keys step by 0.05)">'; }
  function rowBtns(key, t){ return '<button type="button" class="btn ghost sm" data-ar="' + key + '|1" data-k="' + key + 'add"' + (t.rows.length >= 6 ? " disabled" : "") + '>Add a value</button><button type="button" class="btn ghost sm" data-ar="' + key + '|-1" data-k="' + key + 'del"' + (t.rows.length <= 1 ? " disabled" : "") + ">Remove the last value</button>"; }
  function edHTML(key, t, who){
    return '<div class="vd-ed">' + t.rows.map(function(r, i){
      return '<div class="vd-row"><label><span>' + M("x") + "</span>" + xIn(key, i, r.x, who) + "</label><label><span>" + M("P") + "</span>" + pIn(key, i, r.p, who) + "</label>" +
        '<span class="vd-stp"><button type="button" class="btn ghost sm" data-st="' + key + "|" + i + '|-1" data-k="' + key + "m" + i + '" aria-label="' + who + " probability " + (i + 1) + ' minus 0.05">−</button><button type="button" class="btn ghost sm" data-st="' + key + "|" + i + '|1" data-k="' + key + "q" + i + '" aria-label="' + who + " probability " + (i + 1) + ' plus 0.05">+</button></span></div>';
    }).join("") + '</div><div class="q-actions vd-ra">' + rowBtns(key, t) + "</div>";
  }
  function sw(id, on, label){ return '<button type="button" class="cc-switch vd-sw" role="switch" id="' + id + '" data-k="' + id + '" aria-checked="' + on + '"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>' + label + "</button>"; }
  function buildHTML(){
    var t = S.b.t, def = S.b.view === "def", col = S.b.col, c;
    var head = [M("x"), M("P(x)")];
    if (def) { if (col >= 1) head.push(M("x - μ")); if (col >= 2) head.push(M("(x - μ)^2")); if (col >= 3) head.push(M("(x - μ)^2 P(x)")); }
    else head.push(M("x^2"), M("x^2 P(x)"));
    var vin = '<input type="text" autocomplete="off" spellcheck="false" class="numin vd-vin" id="vd-v" data-k="vdv" value="' + MV.esc(S.b.v) + '" aria-label="Var of X">';
    var h = '<div id="vd-view"></div><div data-pk="b"></div><div class="tbl-wrap vd-tw"><table class="vt vd-bt"><caption class="vh">Distribution table' + (def ? ", built one column at a time" : ", shortcut columns") + "</caption><thead><tr>" +
      head.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + "</tr></thead><tbody>";
    t.rows.forEach(function(r, i){
      h += "<tr><td>" + xIn("b", i, r.x, "Table") + "</td><td>" + pIn("b", i, r.p, "Table") + "</td>";
      for (c = 0; c < (def ? col : 2); c++) h += '<td data-dc="' + i + "|" + c + '"></td>';
      h += "</tr>";
    });
    h += '<tr class="vd-sum"><th scope="row">Σ</th><td data-sc="p"></td>';
    if (def) { for (c = 0; c < col; c++) h += c === 2 ? '<td class="vd-vcell"><label>' + M("Var(X)") + " = " + vin + "</label></td>" : "<td></td>"; }
    else h += '<td></td><td data-sc="e2"></td>';
    h += "</tr></tbody></table></div>";
    h += '<p class="vd-line" id="vd-mu"></p>';
    if (!def) h += '<p class="vd-line"><label>' + M("Var(X) = E(X^2) - μ^2") + ' = <span id="vd-scl"></span> ' + vin + "</label></p>";
    if (!def || col >= 3) h += '<p class="vd-line"><label>' + M("σ = √{Var(X)}") + ' = <input type="text" autocomplete="off" spellcheck="false" class="numin vd-vin" id="vd-s" data-k="vds" value="' + MV.esc(S.b.s) + '" aria-label="sigma"></label></p>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-act="sig" data-k="vdsig">Check Σ row</button><button type="button" class="btn ghost sm" data-act="show" data-k="vdshow">Show me</button></div>';
    h += '<div id="vd-sfb" aria-live="polite"></div><div class="q-actions">' + (def && col < 3 ? '<button type="button" class="btn primary sm" data-act="next" data-k="vdnext">Next column</button>' : "") +
      (def && col > 0 ? '<button type="button" class="btn ghost sm" data-act="hide" data-k="vdhide">Hide the columns</button>' : "") + rowBtns("b", t) + "</div>" +
      '<p class="tiny muted">Probabilities: decimals or fractions (eighths such as 3/8 work); ↑ and ↓ in a probability box step by 0.05.</p>';
    return h;
  }
  function compareHTML(){
    var h = sw("vd-lock", S.c.lock, "Lock means equal") + '<p class="tiny muted vd-locknote">' + (S.c.lock ? "B follows A: the same probabilities, with every value spread out from A’s mean by the factor you choose." : "B is its own table. Turn the lock on to keep the means equal.") + "</p>";
    h += '<div class="sym vd-ab"><div class="vd-panel"><p class="vd-sh">Distribution A</p><div data-pk="ca"></div>' + edHTML("ca", S.c.a, "A") + '</div><div class="vd-panel"><p class="vd-sh">Distribution B</p>';
    h += S.c.lock ? '<div id="vd-k"></div><p class="tiny">' + M("x_B = μ_A + k(x_A - μ_A)") + '</p><div id="vd-btab"></div>' : '<div data-pk="cb"></div>' + edHTML("cb", S.c.b, "B");
    return h + "</div></div>";
  }
  function transformHTML(){
    return '<div class="vd-panel"><p class="vd-sh">Distribution ' + M("X") + '</p><div data-pk="tx"></div>' + edHTML("tx", S.t.x, "X") + "</div>" +
      '<div class="vd-panel"><p class="vd-sh">' + M("Y = aX + b") + "</p>" +
      '<label class="slider vd-sl"><span class="slider-top"><span>' + M("a") + ' (multiplies)</span><output id="vd-ao"></output></span><input type="range" id="vd-a" data-k="vda" min="-4" max="4" step="0.5" value="' + S.t.a + '"></label>' +
      '<label class="slider vd-sl"><span class="slider-top"><span>' + M("b") + ' (adds)</span><output id="vd-bo"></output></span><input type="range" id="vd-b" data-k="vdb" min="-10" max="50" step="1" value="' + S.t.b + '"></label>' +
      '<p class="tiny muted">' + M("a") + " from −4 to 4 in steps of 0.5 (never 0); " + M("b") + " from −10 to 50.</p></div>";
  }
  function presets(key, list){
    var el = host.querySelector('[data-pk="' + key + '"]'); if (!el) return;
    var t = tabOf(key);
    preRs[key] = radios(el, { label:"Preset", options:list.map(function(id){ return { id:id, t:PRE[id].t }; }), value:t.pre, cls:"chips",
      onChange:function(v){
        user();
        if (v === "custom") t.rows = cloneRows(t.cust || PRE.custom.rows.map(function(r){ return { x:r[0], p:r[1] }; }));
        else t.rows = rowsOf(v);
        t.pre = v; if (key === "b") bmsg = "";
        structural(); refocus('[data-pk="' + key + '"] [data-rg="' + v + '"]');
      } });
  }
  function refocus(sel){ var b = host.querySelector(sel); if (b) b.focus({ preventScroll:true }); }
  function renderCtrl(){
    var box = $("#vd-ctrl", host);
    preRs = {};
    MV.keepFocus(box, function(){ box.innerHTML = S.mode === "build" ? buildHTML() : S.mode === "compare" ? compareHTML() : transformHTML(); });
    if (S.mode === "build") {
      presets("b", LIST);
      radios($("#vd-view", box), { label:"Table", options:[{ id:"def", t:"Definition" }, { id:"short", t:"Shortcut" }], value:S.b.view, cls:"seg",
        onChange:function(v){ user(); S.b.view = v; structural(); refocus('#vd-view [data-rg="' + v + '"]'); } });
    } else if (S.mode === "compare") {
      presets("ca", LIST); if (!S.c.lock) presets("cb", LIST);
      else radios($("#vd-k", box), { label:"Spread from the mean: " + M("k") + " =", aria:"Spread factor k", options:KS.map(function(k){ return { id:k, t:"×" + k }; }), value:S.c.k, cls:"chips",
        onChange:function(v){ user(); S.c.k = v; save(); paint(); MV.changed(); } });
    } else presets("tx", LIST_T);
    $("#vd-plot", host).classList.toggle("vd-two", S.mode !== "build");
  }
  function fillDerived(){
    if (S.mode !== "build" || !$("#vd-mu", host)) return;
    var t = S.b.t, d = distOf(t), def = S.b.view === "def", st = d.valid ? d.st : null;
    t.rows.forEach(function(r, i){
      var xf = F.parse(r.x), pf = F.parse(r.p);
      for (var c = 0; c < (def ? S.b.col : 2); c++) {
        var cell = host.querySelector('[data-dc="' + i + "|" + c + '"]'); if (!cell) continue;
        var v = null;
        if (def) { if (st && xf && pf) { var dv = F.sub(xf, st.mu), sq = F.mul(dv, dv); v = c === 0 ? dv : c === 1 ? sq : F.mul(sq, pf); } }
        else if (xf) { var x2 = F.mul(xf, xf); v = c === 0 ? x2 : pf ? F.mul(x2, pf) : null; }
        cell.innerHTML = v ? M(fx(v)) : '<span class="muted">—</span>';
      }
    });
    var sp = host.querySelector('[data-sc="p"]');
    if (sp) sp.innerHTML = d.rows.length ? M(fx(d.sum)) + (d.valid ? " ✓" : ' <span class="vd-warn" title="should be 1">⚠</span>') : "—";
    var se = host.querySelector('[data-sc="e2"]'); if (se) se.innerHTML = st ? M("E(X^2) = " + fx(st.e2)) : '<span class="muted">—</span>';
    var mu = $("#vd-mu", host), showMu = !def || S.b.col >= 1;
    mu.hidden = !showMu;
    if (showMu) mu.innerHTML = st ? M("μ = Σ x P(x) = " + fx(st.mu)) : warn(d.errs[0] || "Add a value.");
    var scl = $("#vd-scl", host); if (scl) scl.innerHTML = st ? M(fx(st.e2) + " - " + fx(F.mul(st.mu, st.mu))) + " =" : "…";
  }
  function paintSig(){ var el = $("#vd-sfb", host); if (el) el.innerHTML = bmsg; }
  function paintSliders(){
    var a = $("#vd-a", host), b = $("#vd-b", host); if (!a) return;
    var av = curA(), bv = curB();
    a.value = av; b.value = Math.round(bv);
    $("#vd-ao", host).textContent = mn(d2(av)); $("#vd-bo", host).textContent = mn(String(Math.round(bv)));
    a.setAttribute("aria-valuetext", "a = " + d2(av)); b.setAttribute("aria-valuetext", "b = " + Math.round(bv));
  }
  function paintBtab(){
    var el = $("#vd-btab", host); if (!el) return;
    var B = distB();
    el.innerHTML = B.valid ? MV.tableHTML({ head:[M("x_B"), M("P(x)")], caption:"Distribution B", rows:B.rows.map(function(r){ return [M(fx(r.xf)), M(fx(r.pf))]; }) }) : '<p class="tiny">' + warn(B.errs[0]) + "</p>";
  }
  function paint(){ paintChart(); paintRead(); paintCap(); paintAha(); fillDerived(); paintSig(); paintSliders(); paintBtab(); }
  function structural(){ save(); renderCtrl(); paint(); MV.changed(); }
  function renderAll(){ sanitize(); modeR.set(S.mode); renderCtrl(); paint(); }
  function edited(key){ var t = tabOf(key); t.pre = "custom"; t.cust = cloneRows(t.rows); if (key === "b") bmsg = ""; if (preRs[key]) preRs[key].set("custom"); }

  // --- the Σ row (Build): checks Var(X) and σ with mistake-specific feedback (M1, M2, M3, M5) ---
  function close(v, w){ return v != null && Math.abs(v - w) <= 0.01 + 1e-9; }
  function sigCheck(){
    var d = distOf(S.b.t);
    if (!d.valid) { bmsg = MV.fbHTML("bad", "Make the probabilities add to 1 first."); return; }
    var st = d.st, V = fval(st.V), sd = st.sd, v = num(S.b.v), s = num(S.b.s);
    if (v == null) { bmsg = MV.fbHTML("bad", "Enter " + M("Var(X)") + " in the Σ row first."); return; }
    var okV = close(v, V), okS = close(s, sd);
    if (okV && okS) { S.b.shown = sigOf(S.b.t); bmsg = MV.fbHTML("good", "<strong>✓ Correct:</strong> " + M("Var(X) = " + fxa(st.V)) + " and " + M("σ = " + sqrtSrc(st.V)) + ". The readout now shows every term."); return; }
    var n = d.rows.length, sumSq = 0; st.terms.forEach(function(t){ sumSq += fval(t.sq); });
    var m;
    if (!okV) {
      if (Math.abs(v) < 1e-9 && V > 1e-9) m = MV.md("`Σ(x - μ)P(x)` is always 0. Square first.");
      else if (n > 1 && close(v, sumSq / n)) m = MV.md("You averaged the squared deviations equally. Rare values should count less. Multiply each `(x - μ)^2` by `P(x)`.");
      else if (n > 1 && close(v, sumSq)) m = MV.md("That adds the squares without their probabilities. Multiply each `(x - μ)^2` by `P(x)`.");
      else if (Math.abs(fval(st.mu)) > 1e-9 && close(v, fval(st.e2))) m = MV.md("That’s `E(X^2)`. `E(X^2) - μ^2`: square each `x`, weight and add, <em>then</em> subtract the mean squared.");
      else m = MV.md("Not yet. Add the last column: `Var(X) = Σ (x - μ)^2 P(x)`.");
    } else if (s == null) m = MV.md("`Var(X)` is right. Now enter `σ`.");
    else if (close(s, V) && Math.abs(V - 1) > 1e-9 && V > 1e-9) m = MV.md("`Var(X)` is right, but `σ = √{Var(X)}`. Variance 9 means `σ = 3`.");
    else m = MV.md("`Var(X)` is right. `σ = √{Var(X)}`: take the square root and round to 2 decimals.");
    bmsg = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + m);
  }

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg")) return;
    var act = b.dataset.act;
    if (b.dataset.st) {
      user(); var q = b.dataset.st.split("|"), t = tabOf(q[0]), r = t.rows[+q[1]], f = F.parse(r.p), v = f ? fval(f) : 0;
      r.p = d4(clamp01((Math.round(v * 20) + (+q[2])) / 20)); edited(q[0]); structural(); return;
    }
    if (b.dataset.ar) {
      user(); var q2 = b.dataset.ar.split("|"), t2 = tabOf(q2[0]);
      if (q2[1] === "1" && t2.rows.length < 6) { var mx = -11; t2.rows.forEach(function(rr){ var xv = num(rr.x); if (xv != null) mx = Math.max(mx, xv); }); t2.rows.push({ x:String(Math.min(10, Math.floor(mx) + 1)), p:"0" }); }
      else if (q2[1] === "-1" && t2.rows.length > 1) t2.rows.pop();
      edited(q2[0]); structural(); return;
    }
    if (b.id === "vd-lock") {
      user();
      if (S.c.lock) { var B = distB(); if (B.valid) { S.c.b = { pre:"custom", rows:B.rows.map(function(r2){ return { x:d4(r2.x), p:fx(r2.pf) }; }), cust:null }; S.c.b.cust = cloneRows(S.c.b.rows); } }
      S.c.lock = !S.c.lock; structural(); return;
    }
    if (act === "next") { user(); S.b.col = Math.min(3, S.b.col + 1); structural(); refocus(S.b.col < 3 ? '[data-k="vdnext"]' : '[data-k="vdv"]'); return; }
    if (act === "hide") { user(); S.b.col = 0; structural(); return; }
    if (act === "sig") { user(); sigCheck(); save(); paint(); MV.changed(); MV.focusFb($("#vd-sfb", host)); return; }
    if (act === "show") {
      user(); var d = distOf(S.b.t);
      if (!d.valid) { bmsg = MV.fbHTML("bad", "Make the probabilities add to 1 first."); paintSig(); return; }
      S.b.shown = sigOf(S.b.t); S.b.col = 3; bmsg = MV.fbHTML("", "The readout now shows " + M("Var(X)") + " and " + M("σ") + ". Next time, try the Σ row yourself first.");
      structural(); return;
    }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset && t.dataset.ed) {
      var q = t.dataset.ed.split("|"), tab = tabOf(q[0]); if (!tab.rows[+q[1]]) return;
      tab.rows[+q[1]][q[2]] = t.value; edited(q[0]); save();
      if (anim) cancelAnim();
      paint(); MV.changed(); return;
    }
    if (t.id === "vd-v" || t.id === "vd-s") { if (t.id === "vd-v") S.b.v = t.value; else S.b.s = t.value; bmsg = ""; save(); paintSig(); MV.changed(); return; }
    if (t.id === "vd-a") {
      var a = Math.round(+t.value * 2) / 2;
      if (a === 0) { a = S.t.a > 0 ? -0.5 : 0.5; t.value = a; }
      S.t.a = a; save(); if (anim) cancelAnim(); else MV.banner("", ""); paint(); MV.changed(); return;
    }
    if (t.id === "vd-b") { S.t.b = clampI(t.value, -10, 50, 0); save(); if (anim) cancelAnim(); else MV.banner("", ""); paint(); MV.changed(); return; }
  });
  host.addEventListener("keydown", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.ed || !/\|p$/.test(t.dataset.ed)) return;
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    var f = F.parse(t.value), v = f ? fval(f) : 0;
    t.value = d4(clamp01((Math.round(v * 20) + (e.key === "ArrowUp" ? 1 : -1)) / 20));
    t.dispatchEvent(new Event("input", { bubbles:true }));
  });

  renderAll();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); bmsg = "";
    var s = p.start || {};
    if (s.mode === "compare") { S.mode = "compare"; S.c.a = defTab(s.a); S.c.lock = false; S.c.b = defTab(s.b); pv = { hide:true, bk:0 }; }
    else if (s.mode === "transform") {
      S.mode = "transform"; S.t.x = defTab(s.x); S.t.a = s.a; S.t.b = s.b; pv = { hide:true };
      var X = distOf(S.t.x), to = s.to || {}, v1 = vals([pan("", X), pan("", distY(X, s.a, s.b)), pan("", distY(X, to.a != null ? to.a : s.a, to.b != null ? to.b : s.b))]);
      pv.range = rangeOf(v1);
    } else { S.mode = "build"; S.b.t = { pre:"custom", rows:cloneRows(s.rows), cust:cloneRows(s.rows) }; S.b.col = 3; S.b.view = "def"; pv = { hide:true }; }
    save(); renderAll();
  }
  function runPred(p, done){
    var s = p.start || {}, range = pv.range;
    var a = newAnim(function(){
      if (p.id === "p2") S.t.b = s.to.b; else if (p.id === "p3") S.t.a = s.to.a; else if (p.id === "p4") S.b.shown = sigOf(S.b.t);
      pv = {}; save(); renderAll(); MV.changed(); done();
    });
    if (p.id === "p1") {
      pv = { hideRead:true, bk:0 };
      a.stop = MV.tween({ dur:1600, step:function(t){ pv.bk = t; paintChart(); }, done:function(){ a.timer = MV.wait(500, endAnim); } });
    } else if (p.id === "p2" || p.id === "p3") {
      pv = { hideRead:true, range:range };
      a.stop = MV.tween({ dur:1800, step:function(t){ if (p.id === "p2") pv.tb = s.b + (s.to.b - s.b) * t; else pv.ta = s.a + (s.to.a - s.a) * t; paintChart(); paintCap(); }, done:function(){ a.timer = MV.wait(400, endAnim); } });
    } else { pv = { hideRead:true }; paint(); a.timer = MV.wait(700, endAnim); }
    paintRead(); paintAha();
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (id === "tc1") {
      if (S.mode !== "build") return R("Use <strong>Build</strong> mode.");
      if (!sameTable(distOf(S.b.t), [[0, 0.25], [2, 0.5], [4, 0.25]])) return R("Set the table to `X` = 0, 2, 4 with `P` = 0.25, 0.5, 0.25 (choose Custom and type it).");
      if (S.b.col < 3) return R("Show every column with <strong>Next column</strong> first.");
      var v = num(S.b.v), s = num(S.b.s);
      if (v == null) return R("Enter `Var(X)` in the Σ row.");
      if (Math.abs(v - 8 / 3) <= 0.01) return R("You averaged the three squared deviations equally. Weight each by its probability.");
      if (Math.abs(v) < 1e-9) return R("Without squaring, the deviations cancel.");
      if (Math.abs(v - 2) > 1e-6) return R("`Var(X)` isn’t " + mn(d4(v)) + ". Add the last column: `Σ (x - μ)^2 P(x)`.");
      if (s == null) return R("Now enter `σ`.");
      if (Math.abs(s - 2) < 1e-9) return R("That’s the variance; `σ = √2 ≈ 1.41`.");
      if (Math.abs(s - 1.41) > 0.01 + 1e-9) return R("`σ = √{Var(X)}`; round it to 2 decimals.");
      return { ok:true };
    }
    if (id === "tc2") {
      if (S.mode !== "compare") return R("Use <strong>Compare</strong> mode.");
      if (!sameTable(distOf(S.c.a), [[4, 0.25], [5, 0.5], [6, 0.25]])) return R("Set A to Tight (4, 5, 6).");
      var B = distB(); if (!B.valid) return R(B.errs[0] || "Make B a valid distribution first.");
      var mu = fval(B.st.mu), V = fval(B.st.V);
      if (Math.abs(mu - 5) > 1e-9) return R("Keep the centre at 5.");
      if (Math.abs(V - 2) < 1e-9) return { ok:true };
      if (Math.abs(V - 1) < 1e-9) return R("That’s √2 times A’s `σ`, not twice. Twice `σ` means 4 times the variance.");
      return R("`σ_B` " + (ex2(B.st.sd) ? "= " : "≈ ") + d2(B.st.sd) + " is " + (V < 1e-12 ? "0" : "about " + d2(B.st.sd / Math.SQRT1_2) + " times") + " `σ_A`, not exactly 2 times.");
    }
    if (id === "tc3") {
      if (S.mode !== "transform") return R("Use <strong>Transform</strong> mode.");
      var X = distOf(S.t.x);
      if (!X.valid || Math.abs(fval(X.st.mu) - 4) > 1e-9 || Math.abs(fval(X.st.V) - 9) > 1e-9) return R("Give `X` a mean of 4 and a standard deviation of 3: the preset 1 or 7 does that.");
      var a = S.t.a, b = S.t.b;
      if (a === 2 && b === 42) return { ok:true };
      if (a === 2 && b === 50) return R("That puts `μ_Y` at 58.");
      if (a === 4) return R("`σ` scales by `a`, not `a^2`: 6 ÷ 3 = 2.");
      if (b === 46) return R("`μ_Y = aμ + b = 2(4) + b`, so `b = 42`.");
      if (a < 0) return R("Set `a` > 0.");
      return R("Now `μ_Y = " + d2(a * 4 + b) + "` and `σ_Y = " + d2(Math.abs(a) * 3) + "`. You need `μ_Y = 50` and `σ_Y = 6`.");
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: tight vs wide on fulcrums at 5; ±σ brackets grow ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "", st = { bars:0, bk:0 };
  var T = [[4, 0.25], [5, 0.5], [6, 0.25]], Wd = [[1, 0.25], [5, 0.5], [9, 0.25]];
  function pn(name, rows, sd, lab){ return { name:name, sub:st.bars > 0.99 ? "μ = 5" : "", bars:rows.map(function(q){ return { x:q[0], p:q[1] * st.bars }; }), mu:5, sd:sd, bk:st.bk, bkLab:lab }; }
  plot.render = function(){ spreadChart(plot, { cols:true, x0:0, x1:10, step:1, ymax:0.5, yStep:0.25, barW:0.8, plabs:false, describe:aria,
    panels:[pn("Tight", T, Math.SQRT1_2, "±0.71"), pn("Wide", Wd, 2 * Math.SQRT2, "±2.83")] }); };
  var cap = f.cap;
  function last(){ st = { bars:1, bk:1 }; plot.render(); cap.textContent = "Same μ = 5. σ: 0.71 vs 2.83"; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "Two distributions, each balanced on a fulcrum at 5";
  MV.wait(700, function(){
    cap.textContent = "Left: tight (4, 5, 6). Right: wide (1, 5, 9)";
    MV.tween({ dur:900, step:function(t){ st.bars = t; plot.render(); }, done:function(){
      MV.wait(900, function(){
        cap.textContent = "±σ brackets grow from each mean";
        MV.tween({ dur:1600, step:function(t){ st.bk = t; plot.render(); }, done:function(){ MV.wait(500, last); } });
      });
    } });
  });
}

// ---------- Part 3: Risk vs return (three stations) ----------
function weeksChart(plot, o){
  plot.draw({ grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, n = o.rows.length, gap = 8, L = 44, R = 10, foot = 30, ph = (H - foot - gap * (n - 1)) / n;
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), fUI = p.fontUI;
    function sx(k){ return L + k / 1000 * (W - L - R); }
    ctx.save();
    o.rows.forEach(function(row, i){
      var y0 = i * (ph + gap), top = y0 + 18, bot = y0 + ph - 4;
      function sy(v){ return bot - (v + 20) / 240 * (bot - top); }
      ctx.strokeStyle = css("--plot-grid"); ctx.lineWidth = 1; ctx.beginPath(); [0, 200].forEach(function(v){ ctx.moveTo(L, Math.round(sy(v)) + 0.5); ctx.lineTo(W - R, Math.round(sy(v)) + 0.5); }); ctx.stroke();
      ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, top - 4); ctx.lineTo(L, bot); ctx.lineTo(W - R, bot); ctx.stroke();
      ctx.fillStyle = ink2; ctx.font = "11px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      [0, 100, 200].forEach(function(v){ ctx.fillText("$" + v, L - 5, sy(v)); });
      ctx.strokeStyle = ink2; ctx.lineWidth = 1.4; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(L, sy(100)); ctx.lineTo(W - R, sy(100)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = pen; ctx.globalAlpha = 0.55;
      for (var k = 0; k < o.n; k++) ctx.fillRect(sx(k + 1) - 1.2, sy(row.v[k] + row.jit[k] * 14) - 1.2, 2.4, 2.4);
      ctx.globalAlpha = 1;
      if (o.n > 1) { ctx.strokeStyle = ink; ctx.lineWidth = 2.4; ctx.beginPath(); for (k = 0; k < o.n; k++) { var X = sx(k + 1), Y = sy(row.avg[k]); if (k) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); } ctx.stroke(); }
      ctx.fillStyle = ink; ctx.font = "700 13px " + fUI; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(row.name, L + 4, y0);
      if (o.n) { var nw = ctx.measureText(row.name).width; ctx.font = "12px " + fUI; ctx.fillStyle = ink2; ctx.fillText("average $" + row.avg[o.n - 1].toFixed(2), L + 14 + nw, y0 + 1); }
    });
    var yb = H - foot + 6; ctx.fillStyle = ink2; ctx.font = "11px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "top";
    [0, 250, 500, 750, 1000].forEach(function(k){ ctx.textAlign = k === 1000 ? "right" : "center"; ctx.fillText(MV.mdm.fmt(k), k === 1000 ? W - R : sx(k), yb); });
    ctx.textAlign = "right"; ctx.fillText("weeks", W - R, yb + 13);
    ctx.restore();
  } });
}
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.r1 = S.r1 && typeof S.r1 === "object" ? S.r1 : {}; S.r1.order = Array.isArray(S.r1.order) ? S.r1.order.filter(function(x){ return ["A", "B", "C"].indexOf(x) >= 0; }).slice(0, 3) : []; S.r1.ok = !!S.r1.ok;
  S.r2 = S.r2 && typeof S.r2 === "object" ? S.r2 : {};
  S.r3 = S.r3 && typeof S.r3 === "object" ? S.r3 : {}; S.r3.n = S.r3.n === 1000 ? 1000 : 0;
  var plots = {}, tabsR, msg1 = "", stopSim = null, simN = S.r3.n;
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function done(id){ if (id === "s1") return S.r1.ok; if (id === "s2") return st("s2").profiles.every(function(q){ return q.ok.indexOf(S.r2[q.id]) >= 0; }); return S.r3.n === 1000; }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.title + (done(s.id) ? ' <span class="rv-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="rv-tabs"></div><div id="rv-body"></div>';
  tabText();
  tabsR = radios($("#rv-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ if (stopSim) { stopSim(); stopSim = null; simN = S.r3.n; } S.cur = v; api.save(); paint(); } });
  function ticks(){ tabText(); tabsR.refresh(); }
  function offerDist(o){ return { rows:o.vals.map(function(v, i){ return { x:v, p:o.ps[i] }; }), mu:100, sd:Math.sqrt(o.vals.reduce(function(s, v, i){ return s + (v - 100) * (v - 100) * o.ps[i]; }, 0)) }; }

  // Station 1: rank by σ
  function s1(body, s){
    body.innerHTML = '<p class="rv-text">' + s.text + ' <span class="mdm-model">model data</span></p><canvas class="plot rv-plot3" id="rv1-plot" role="img" aria-label="Three offers"></canvas>' +
      '<p class="tiny muted">Tap the offers in order, from the smallest ' + M("σ") + " to the largest. Tap an offer again to take it out.</p>" +
      '<div class="rv-rank" id="rv1-rank" role="group" aria-label="Your ranking"></div><p class="rv-order" id="rv1-order" aria-live="polite"></p>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="rv1-check" data-k="rv1chk">Check my ranking</button><button type="button" class="btn ghost sm" id="rv1-clear" data-k="rv1clr">Start again</button></div><div id="rv1-fb" aria-live="polite"></div>' +
      '<details class="alg"><summary>Check it with numbers</summary><div id="rv1-tbl"></div></details>';
    plots.s1 = new MV.Plot($("#rv1-plot", body), { xmin:0, xmax:1, ymin:0, ymax:1 }); plots.s1.render = s1Chart;
    s1Paint();
  }
  function s1Chart(){
    var s = st("s1"), ok = S.r1.ok;
    spreadChart(plots.s1, { x0:-25, x1:225, step:50, money:true, ymax:1, yStep:0.5, barW:16,
      panels:s.offers.map(function(o){ var d = offerDist(o); return { name:"Offer " + o.id, sub:o.t, bars:d.rows, mu:100, sd:d.sd, hideBk:!ok, bkLab:"±$" + Math.round(d.sd) }; }),
      describe:"Three probability histograms on one dollar axis, each balanced at $100. Offer A: one bar at $100. Offer B: bars at $0 and $200. Offer C: bars at $50 and $150." + (ok ? " Brackets: plus or minus $0, $100 and $50." : "") });
  }
  function s1Paint(){
    var body = $("#rv-body", host); if (!$("#rv1-rank", body)) return;
    var s = st("s1"), ord = S.r1.order;
    MV.keepFocus($("#rv1-rank", body), function(){
      $("#rv1-rank", body).innerHTML = s.offers.map(function(o){ var k = ord.indexOf(o.id); return '<button type="button" class="rv-off' + (k >= 0 ? " on" : "") + '" data-off="' + o.id + '" data-k="rv1' + o.id + '" aria-pressed="' + (k >= 0) + '"' + (S.r1.ok ? " disabled" : "") + '><span class="rv-rn" aria-hidden="true">' + (k >= 0 ? k + 1 : "") + '</span><span><strong>Offer ' + o.id + "</strong> " + o.t + (k >= 0 ? '<span class="vh">, ranked ' + (k + 1) + "</span>" : "") + "</span></button>"; }).join("");
    });
    $("#rv1-order", body).innerHTML = ord.length ? "Your ranking (smallest " + M("σ") + " first): " + ord.map(function(x){ return "Offer " + x; }).join(", ") : "";
    $("#rv1-check", body).disabled = S.r1.ok; $("#rv1-clear", body).disabled = S.r1.ok;
    $("#rv1-fb", body).innerHTML = S.r1.ok ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s.right) : msg1;
    $("#rv1-tbl", body).innerHTML = S.r1.ok ? MV.tableHTML({ head:["Offer", "Outcomes", M("μ"), M("Var(X)"), M("σ")], caption:"Each offer’s mean, variance and standard deviation",
      rows:s.offers.map(function(o){ var d = offerDist(o); return ["Offer " + o.id, o.t, "$100", M(o.vals.map(function(v){ return "(" + (v - 100) + ")^2(" + d2(o.ps[o.vals.indexOf(v)]) + ")"; }).join(" + ") + " = " + MV.mdm.fmt(Math.round(d.sd * d.sd))), "$" + Math.round(d.sd)]; }) }) :
      '<p class="muted">Rank the offers first: then this table shows each one’s variance and standard deviation.</p>';
    s1Chart();
  }
  // Station 2: who should choose what?
  function s2(body, s){
    body.innerHTML = '<p class="rv-text">' + s.text + "</p>" + s.profiles.map(function(q){ return '<div class="rv-prof"><p class="rv-who">“' + q.t + '”</p><div data-prof="' + q.id + '"></div><div class="rv-pfb" id="rv2-' + q.id + '" aria-live="polite"></div></div>'; }).join("") +
      '<p class="rv-after" id="rv2-done"></p>';
    s.profiles.forEach(function(q){
      radios(body.querySelector('[data-prof="' + q.id + '"]'), { label:"Best offer:", aria:"Best offer for: " + q.t, options:["A", "B", "C"].map(function(x){ return { id:x, t:"Offer " + x }; }), value:S.r2[q.id] || "", cls:"chips",
        onChange:function(v){ S.r2[q.id] = v; api.save(); s2Paint(); ticks(); MV.focusFb($("#rv2-" + q.id, host)); } });
    });
    s2Paint();
  }
  function s2Paint(){
    var s = st("s2");
    s.profiles.forEach(function(q){ var el = $("#rv2-" + q.id, host), v = S.r2[q.id]; if (!el) return; el.innerHTML = !v ? "" : q.ok.indexOf(v) >= 0 ? MV.fbHTML("good", "<strong>✓ Good choice.</strong> " + q.fb[v]) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + q.fb[v]); });
    var dn = $("#rv2-done", host); if (dn) dn.innerHTML = done("s2") ? "<strong>✓ " + s.done + "</strong>" : "";
  }
  // Station 3: check it with data
  var SIM = null;
  function sims(){
    if (SIM) return SIM;
    var f = { A:function(){ return 100; }, B:function(r){ return r() < 0.5 ? 0 : 200; }, C:function(r){ return r() < 0.5 ? 50 : 150; } };
    SIM = ["A", "B", "C"].map(function(id){
      var r = MV.mdm.seededRandom("mdm20-weeks-" + id + "-8"), j = MV.mdm.seededRandom("mdm20-jitter-" + id), v = [], jit = [], avg = [], tot = 0;
      for (var i = 0; i < 1000; i++) { var x = f[id](r); v.push(x); tot += x; avg.push(tot / (i + 1)); jit.push(j() - 0.5); }
      return { id:id, name:"Offer " + id, v:v, jit:jit, avg:avg };
    });
    return SIM;
  }
  function sdOf(row, n){ var m = row.avg[n - 1], s = 0; for (var i = 0; i < n; i++) s += (row.v[i] - m) * (row.v[i] - m); return Math.sqrt(s / n); }
  function s3(body, s){
    body.innerHTML = '<p class="rv-text">' + s.text + '</p><div class="q-actions"><button type="button" class="btn primary sm" id="rv3-run" data-k="rv3run">Simulate 1000 weeks</button></div>' +
      '<canvas class="plot rv-plot3" id="rv3-plot" role="img" aria-label="Weekly results"></canvas><dl class="read rv-read" id="rv3-read" aria-live="polite"></dl><p class="rv-after" id="rv3-after"></p>' +
      '<details class="alg"><summary>Check it with data</summary><div id="rv3-tbl"></div></details>';
    plots.s3 = new MV.Plot($("#rv3-plot", body), { xmin:0, xmax:1, ymin:0, ymax:1 }); plots.s3.render = s3Chart;
    s3Paint();
  }
  function s3Chart(){
    var R = sims(), n = simN;
    weeksChart(plots.s3, { n:n, rows:R, describe:n ? "Weekly results for " + n + " simulated weeks. Offer A: every dot at $100. Offer B: dots at $0 and $200. Offer C: dots at $50 and $150. The running averages settle near $100: A $" + R[0].avg[n - 1].toFixed(2) + ", B $" + R[1].avg[n - 1].toFixed(2) + ", C $" + R[2].avg[n - 1].toFixed(2) + "." : "No weeks simulated yet." });
  }
  function s3Paint(){
    var body = $("#rv-body", host); if (!$("#rv3-read", body)) return;
    var R = sims(), n = simN, th = { A:0, B:100, C:50 };
    s3Chart();
    $("#rv3-run", body).textContent = S.r3.n ? "Replay the 1000 weeks" : "Simulate 1000 weeks";
    $("#rv3-run", body).disabled = !!stopSim;
    $("#rv3-read", body).innerHTML = MV.readoutHTML([["Weeks simulated", n ? String(n) : '<span class="muted">none yet</span>'],
      ["Average weekly result", n ? R.map(function(r){ return r.id + ": $" + r.avg[n - 1].toFixed(2); }).join(" · ") : "—"]]);
    $("#rv3-after", body).innerHTML = S.r3.n === 1000 && n === 1000 ? "<strong>✓ " + st("s3").after + "</strong>" : "";
    $("#rv3-tbl", body).innerHTML = n ? MV.tableHTML({ head:["Offer", "Average of " + n + " weeks", "Simulated standard deviation", "Theoretical " + M("σ")], caption:"Simulated and theoretical spread",
      rows:R.map(function(r){ return ["Offer " + r.id, "$" + r.avg[n - 1].toFixed(2), "$" + sdOf(r, n).toFixed(2), "$" + th[r.id]]; }) }) + '<p class="tiny muted">The simulated standard deviation uses every simulated week, dividing by the number of weeks.</p>' :
      '<p class="muted">Simulate first: the table pairs each offer’s simulated standard deviation with its theoretical ' + M("σ") + ".</p>";
  }
  function s3Run(){
    if (stopSim) return;
    simN = 0; s3Paint();
    stopSim = MV.tween({ dur:1800, ease:function(t){ return t; }, step:function(t){ simN = Math.max(1, Math.round(1000 * t)); s3Chart(); var rd = $("#rv3-read", host); if (rd) rd.firstChild.querySelector("dd").textContent = String(simN); },
      done:function(){ stopSim = null; simN = 1000; S.r3.n = 1000; api.save(); s3Paint(); ticks(); } });
    var b = $("#rv3-run", host); if (b) b.disabled = true;
  }
  function paint(){
    ticks();
    var s = st(S.cur), body = $("#rv-body", host);
    body.innerHTML = '<div class="rv-card"><span class="rv-lab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + '</span><div id="rv-in"></div></div>';
    var inner = $("#rv-in", body);
    if (s.id === "s1") s1(inner, s); else if (s.id === "s2") s2(inner, s); else s3(inner, s);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    var s = st("s1");
    if (b.dataset.off) { var o = S.r1.order, k = o.indexOf(b.dataset.off); if (k >= 0) o.splice(k, 1); else if (o.length < 3) o.push(b.dataset.off); msg1 = ""; api.save(); s1Paint(); return; }
    if (b.id === "rv1-clear") { S.r1.order = []; msg1 = ""; api.save(); s1Paint(); return; }
    if (b.id === "rv1-check") {
      var ord = S.r1.order;
      if (ord.length < 3) msg1 = MV.fbHTML("bad", "Tap all three offers first, from the smallest " + M("σ") + " to the largest.");
      else if (ord.join("") === "ACB") { S.r1.ok = true; msg1 = ""; ticks(); }
      else msg1 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (ord[0] !== "A" ? s.notFirst : s.swap));
      api.save(); s1Paint(); MV.focusFb($("#rv1-fb", host)); return;
    }
    if (b.id === "rv3-run") { s3Run(); return; }
  });
  paint();
  return {};
}

// @component N4 numEntry — number entry (adapted from MDM4U 18's N4 probEntry): one box per part, or a chip choice for a
// part given as {t, choices:[…]}; numbers accept decimals, fractions, √ and $ (MV.parseNum) within tol (default 0.01, the
// 2-decimal rounding); named wrong answers ({part, match, fb}, match a number or a choice); an item-level fb for any other
// wrong answer; three-level hints when the item has them; first-try scoring as the toolkit's N4.
// activity a: {id, title, summary, how, use, items:[{id, goal, star, prompt, label | parts, answer, tol, display, why, fb, wrong, hints}]}
function numEntry(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ var x = st.items[id] || (st.items[id] = { val:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.val)) x.val = []; return x; }
  function partsOf(it){ return it.parts || [it.label || "Your answer:"]; }
  function isCh(p){ return p && typeof p === "object"; }
  function judge(it, vals){
    var ans = MV.ans(it), A = Array.isArray(ans) ? ans : [ans], P = partsOf(it), tol = it.tol || 0.01;
    var got = A.map(function(_, k){ return isCh(P[k]) ? (vals[k] || null) : num(vals[k]); });
    if (got.some(function(v){ return v == null; })) return { bad:true };
    var oks = got.map(function(g, k){ return typeof A[k] === "string" ? g === A[k] : Math.abs(g - A[k]) <= tol + 1e-9; });
    if (oks.every(Boolean)) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ var k = w.part || 0, g = got[k]; return !oks[k] && (typeof w.match === "string" ? g === w.match : typeof g === "number" && Math.abs(g - w.match) <= tol + 1e-9); })[0];
    var fb = named ? named.fb : it.fb || null;
    if (!fb && A.length > 1) {
      var lab = function(k){ var p = P[k]; return (isCh(p) ? p.t : p).replace(/\s*[=:]\s*$/, ""); };
      var right = oks.map(function(o, k){ return o ? lab(k) : null; }).filter(Boolean), wrong = oks.map(function(o, k){ return o ? null : lab(k); }).filter(Boolean);
      if (right.length) fb = right.join(" and ") + (right.length > 1 ? " are" : " is") + " right. Check " + wrong.join(" and ") + ".";
    }
    return { ok:false, fb:fb };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + (a.use ? MV.usesHTML(MV.md(a.use)) : "") + a.items.map(function(it, i){
        var x = ist(it.id), P = partsOf(it);
        var h = '<div class="q" data-ne="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="ne-row">' + P.map(function(p, k){
          if (isCh(p)) return '<span class="ne-ch"><span class="ne-l">' + p.t + '</span><span class="ne-chips" role="group" aria-label="' + MV.esc(MV.plain(p.t)) + '">' + p.choices.map(function(c, j){
            return '<button type="button" class="ne-c" data-nc="' + it.id + "|" + k + "|" + j + '" data-k="' + it.id + "c" + k + j + '" aria-pressed="' + (x.val[k] === c) + '"' + (x.solved ? " disabled" : "") + ">" + c + "</button>"; }).join("") + "</span></span>";
          return '<label class="ne-lab" for="ne-' + it.id + k + '"><span>' + p + '</span><input class="numin ne-in" id="ne-' + it.id + k + '" data-nin="' + it.id + '" data-nk="' + k + '" type="text" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val[k] || "") + '"' + (x.solved ? " disabled" : "") + "></label>";
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
    if (b.dataset.nc) { var q = b.dataset.nc.split("|"), part = partsOf(it)[+q[1]]; x.val[+q[1]] = part.choices[+q[2]]; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = (partsOf(it).length > 1 ? "Fill in every part. " : "") + "Enter a number such as 1.71, a fraction such as 35/12, or tap a choice."; paint(); MV.focusFb(host.querySelector('[data-ne="' + it.id + '"]')); return; }
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

// ---------- Performance task: Same mean, different risk (prize wheel) ----------
var task = (function(){
  var api = null, plot = null, sim = null, simKey = "";
  function read(){
    var s = api ? api.S : {}, k = s.k === 3 ? 3 : 2;
    var am = Array.isArray(s.a) && s.a.length === 3 ? s.a.map(function(v){ return clampI(v, 0, 10, 0); }) : [2, 8, 6];
    var p = Array.isArray(s.p) && s.p.length === 3 ? s.p.map(function(v){ return clampI(v, 1, 9, 1); }) : [5, 5, 2];
    return { k:k, a:am.slice(0, k), p:p.slice(0, k), all:{ a:am, p:p } };
  }
  function nums(d){ var m = 0, e2 = 0, hi = 0, tot = 0; d.a.forEach(function(x, i){ var p = d.p[i]; m += x * p; e2 += x * x * p; hi += x > 5 ? p : 0; tot += p; }); return { m10:m, e210:e2, hi:hi, tot:tot, v100:10 * e2 - m * m }; }
  function t1(v){ return v === 10 ? "1" : "0." + v; }
  function key(d){ return d.a.map(function(x, i){ return [x, d.p[i]]; }).sort(function(p, q){ return p[0] - q[0]; }).map(function(q){ return q[0] + ":" + q[1]; }).join(","); }
  function lab(k){ var q = k.split(",").map(function(s){ return s.split(":"); }); return q.map(function(r){ return "$" + r[0]; }).join("/") + " (" + q.map(function(r){ return t1(+r[1]); }).join("/") + ")"; }
  function getSim(d){
    var k = key(d) + "|" + d.p.join(",");
    if (simKey !== k) { sim = null; simKey = k; }
    return sim;
  }
  function runSim(d){
    var r = MV.mdm.seededRandom("mdm20-wheel|" + key(d)), c = {}, tot = 0, sq = 0, hi = 0, n = 1000;
    for (var i = 0; i < n; i++) { var x = d.a[r.pick(d.p)]; c[x] = (c[x] || 0) + 1; tot += x; sq += x * x; if (x > 5) hi++; }
    var m = tot / n; sim = { counts:c, avg:m, sd:Math.sqrt(Math.max(0, sq / n - m * m)), hi:hi / n }; simKey = key(d) + "|" + d.p.join(",");
  }
  function draw(){
    if (!plot) return;
    var d = read(), N = nums(d), ok = N.tot === 10, mu = N.m10 / 10, sd = ok ? Math.sqrt(Math.max(0, N.v100) / 100) : null, sm = getSim(d);
    spreadChart(plot, { x0:-1, x1:11, step:1, money:true, labMin:0, labMax:10, ymax:1, yStep:0.25, barW:0.8,
      panels:[{ name:"Your wheel", sub:ok ? "μ = $" + d2(mu) : "probabilities must add to 1", bars:d.a.map(function(x, i){ return { x:x, p:d.p[i] / 10 }; }), sim:sm ? Object.keys(sm.counts).map(function(x){ return { x:+x, p:sm.counts[x] / 1000 }; }) : null,
        mu:ok ? mu : null, sd:sd, bkLab:ok ? "±$" + d2(sd) : "" }],
      describe:"Your prize wheel: " + d.a.map(function(x, i){ return "$" + x + " with probability " + t1(d.p[i]); }).join(", ") + (ok ? ". Mean $" + d2(mu) + ", standard deviation $" + d2(sd) + "." : ". The probabilities don’t add to 1 yet.") + (sm ? " Outlined bars: 1000 simulated spins." : "") });
  }
  function paint(){
    var d = read(), el = $("#pw-read"); if (!el) return;
    var all = d.all;
    [0, 1, 2].forEach(function(i){
      var row = $("#pw-r" + i); if (!row) return; row.hidden = i >= d.k;
      $("#pw-a" + i).textContent = "$" + all.a[i]; $("#pw-p" + i).textContent = t1(all.p[i]);
      $('[data-tw="a|' + i + '|-1"]').disabled = all.a[i] <= 0; $('[data-tw="a|' + i + '|1"]').disabled = all.a[i] >= 10;
      $('[data-tw="p|' + i + '|-1"]').disabled = all.p[i] <= 1; $('[data-tw="p|' + i + '|1"]').disabled = all.p[i] >= 9;
    });
    var N = nums(d), ok = N.tot === 10, sm = getSim(d), rows = [];
    rows.push(["Total probability", M(d.p.map(t1).join(" + ") + " = " + (N.tot === 10 ? "1" : d4(N.tot / 10))) + (ok ? " ✓" : " " + warn("must be 1"))]);
    if (ok) {
      rows.push(["Expected prize", M("μ = Σ x P(x)") + " = $" + d2(N.m10 / 10)]);
      rows.push(["Variance", M("Σ (x - μ)^2 P(x)") + " = " + d2(N.v100 / 100)]);
      rows.push(["Standard deviation", M("σ") + " = $" + d2(Math.sqrt(Math.max(0, N.v100) / 100))]);
      rows.push(["More than $5", M("P(X > 5)") + " = " + d2(N.hi / 10)]);
    }
    rows.push(["1000 spins (seeded)", sm ? "average $" + sm.avg.toFixed(2) + ", standard deviation $" + sm.sd.toFixed(2) + ", more than $5: " + (sm.hi * 100).toFixed(1) + "%" : '<span class="muted">Press Spin 1000 times.</span>']);
    el.innerHTML = MV.readoutHTML(rows);
    $("#pw-spin").disabled = !ok;
    draw();
  }
  return {
    render:function(inp, pvw, a){
      api = a; var d = read(); a.S.k = d.k; a.S.a = d.all.a; a.S.p = d.all.p;
      inp.innerHTML = '<div class="pw-in"><div id="pw-k"></div>' + [0, 1, 2].map(function(i){
        return '<div class="pw-row" id="pw-r' + i + '" role="group" aria-label="Prize ' + (i + 1) + '"><span class="pw-l">Prize ' + (i + 1) + "</span>" +
          '<span class="pw-st"><button type="button" class="btn ghost sm" data-tw="a|' + i + '|-1" data-k="pwa' + i + 'm" aria-label="Prize ' + (i + 1) + ' amount minus $1">−</button><output class="pw-v" id="pw-a' + i + '" aria-live="polite"></output><button type="button" class="btn ghost sm" data-tw="a|' + i + '|1" data-k="pwa' + i + 'p" aria-label="Prize ' + (i + 1) + ' amount plus $1">+</button></span>' +
          '<span class="pw-st"><span class="pw-pl">' + M("P") + '</span><button type="button" class="btn ghost sm" data-tw="p|' + i + '|-1" data-k="pwp' + i + 'm" aria-label="Prize ' + (i + 1) + ' probability minus 0.1">−</button><output class="pw-v" id="pw-p' + i + '" aria-live="polite"></output><button type="button" class="btn ghost sm" data-tw="p|' + i + '|1" data-k="pwp' + i + 'p" aria-label="Prize ' + (i + 1) + ' probability plus 0.1">+</button></span></div>';
      }).join("") + '<p class="tiny muted">Whole dollars from $0 to $10, all different. Probabilities in steps of 0.1 (at least 0.1), adding to 1.</p></div>';
      pvw.innerHTML = '<canvas class="plot pw-plot" id="pw-plot" role="img" aria-label="Your prize wheel’s probability histogram"></canvas><div class="q-actions"><button type="button" class="btn ghost sm" id="pw-spin" data-k="pwspin">Spin 1000 times</button></div><dl class="read pw-read" id="pw-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#pw-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      radios($("#pw-k"), { label:"Prize amounts:", aria:"Number of prize amounts", options:[{ id:2, t:"2" }, { id:3, t:"3" }], value:d.k, cls:"seg",
        onChange:function(v){ a.S.k = +v; a.save(); paint(); a.update(); } });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-tw]"); if (!b || b.disabled) return;
        var q = b.dataset.tw.split("|"), all = read().all, i = +q[1];
        if (q[0] === "a") all.a[i] = clampI(all.a[i] + (+q[2]), 0, 10, 0); else all.p[i] = clampI(all.p[i] + (+q[2]), 1, 9, 1);
        a.S.a = all.a; a.S.p = all.p; a.save(); paint(); a.update();
      });
      pvw.addEventListener("click", function(e){ if (e.target.closest("#pw-spin")) { var dd = read(); if (nums(dd).tot === 10) { runSim(dd); paint(); } } });
      paint();
    },
    read:read,
    valid:function(d){
      var seen = {}; for (var i = 0; i < d.a.length; i++) { if (seen[d.a[i]]) return "Each prize amount must be different: $" + d.a[i] + " appears twice."; seen[d.a[i]] = 1; }
      var t = nums(d).tot; return t === 10 ? true : "The probabilities must add to 1 (now " + d4(t / 10) + ").";
    },
    checks:function(d){ var N = nums(d); return [N.m10 === 50, N.tot === 10 && N.v100 === 400, N.hi >= 5]; },
    key:key,
    label:function(k){ return lab(k); },
    text:function(k){ return lab(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ find:numEntry, compare:numEntry },
  task:task
});
})();
