// MDM4U 36 Linear Regression & Line of Best Fit: hero (a rough line drops in and tilts over the kiosk data while a
// sum-of-squares counter falls to 16), Fit duel (Explore: D11 scatter plot and regression with Duel / Predict / Edit points
// modes, draggable line handles and points, squares of the residuals), Predictions with care (Part 3: three judgement
// stations with a trust gauge and "Check it with data"), Compute and predict (N4 line entry), Hit the target line task.
// Regression is exact (MV.mdm.frac), so slope 2.4 and SSR 16 display exactly.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? clamp(v, lo, hi) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
var XI = "<i>x</i>", YH = "<i>ŷ</i>", XB = "<i>x̄</i>", YB = "<i>ȳ</i>", RI = "<i>r</i>";
// a plain number: up to dp decimals, zeros trimmed, true minus
function dN(v, dp){ dp = dp == null ? 2 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
// a fraction: exact when it ends within dp places, otherwise 2 places (callers add ≈ with inexact())
function fq(f, dp){ dp = dp || 3; return F.exactDec(f, dp) ? F.dec(f, dp) : F.dec(f, 2); }
function inexact(f, dp){ return !F.exactDec(f, dp || 3); }
function swHTML(id, lab, on){ return '<button type="button" class="cc-switch lr-sw" role="switch" id="' + id + '" data-k="' + id + '" aria-checked="' + !!on + '"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>' + lab + "</button>"; }
function niceStep(r){ var p = Math.pow(10, Math.floor(Math.log10(r))), m = r / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }

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

// ---------- exact regression ----------
// reg(pts [[x, y]]) -> {n, xb, yb, Sxx, Sxy, Syy, m, b (fractions), ssr (fraction), r, mv, bv} or null when every x is equal
function reg(pts){
  var n = pts.length, tx = 0, ty = 0; if (n < 2) return null;
  pts.forEach(function(p){ tx += p[0]; ty += p[1]; });
  var xb = F.of(tx, n), yb = F.of(ty, n), Sxx = F.of(0, 1), Sxy = F.of(0, 1), Syy = F.of(0, 1);
  pts.forEach(function(p){ var dx = F.sub(F.of(p[0], 1), xb), dy = F.sub(F.of(p[1], 1), yb); Sxx = F.add(Sxx, F.mul(dx, dx)); Sxy = F.add(Sxy, F.mul(dx, dy)); Syy = F.add(Syy, F.mul(dy, dy)); });
  if (Sxx.n === 0) return null;
  var m = F.div(Sxy, Sxx), b = F.sub(yb, F.mul(m, xb)), ssr = F.sub(Syy, F.mul(m, Sxy));
  var r = Syy.n === 0 ? 0 : F.val(Sxy) / Math.sqrt(F.val(Sxx) * F.val(Syy));
  return { n:n, xb:xb, yb:yb, Sxx:Sxx, Sxy:Sxy, Syy:Syy, m:m, b:b, ssr:ssr, r:r, mv:F.val(m), bv:F.val(b) };
}
function ssrOf(pts, m, b){ var s = F.of(0, 1); pts.forEach(function(p){ var e = F.sub(F.of(p[1], 1), F.add(F.mul(m, F.of(p[0], 1)), b)); s = F.add(s, F.mul(e, e)); }); return s; }
// "ŷ = 2.1x + 6.5" (≈ when a coefficient is rounded); dp = most decimal places shown exactly
function lineHTML(m, b, dp){
  dp = dp || 3;
  var ap = inexact(m, dp) || inexact(b, dp), mt = fq(m, dp), bt = fq(F.of(Math.abs(b.n), b.d), dp), s = YH + (ap ? " ≈ " : " = ");
  if (m.n === 0) return s + fq(b, dp);
  s += (mt === "1" ? "" : mt === MV.MINUS + "1" ? MV.MINUS : mt) + XI;
  if (b.n !== 0) s += (b.n < 0 ? " − " : " + ") + bt;
  return s;
}
function ptTxt(fx, fy){ return "(" + (inexact(fx) ? "≈ " : "") + fq(fx) + ", " + (inexact(fy) ? "≈ " : "") + fq(fy) + ")"; }

// @component D11 scatterRegression — scatter plot and regression view (course plan D11), self-contained: points (--pen), the
// least-squares line (--ink), the student's line (--ink-2 dashed) with knob handles, vertical residual segments and their
// squares (orange --ev-c for the student's line, --ink outline for the least-squares line; squares sweep out with sqT), the
// point of means ring, a prediction probe, the data's x-range shaded (--hi-soft) with the outside hatched (--ink-2).
// drawScatter(plot, {box:[x0, x1, y0, y1], xl, yl, pts, pending:[x, y], ls:{m, b}, user:{m, b, hx, hy}, resLS, resU, sqLS, sqU,
// sqT, sqLab, means:{x, y, t}, band:[lo, hi], probe:{x, y, lab}, target:{m, b, lab}, lsCol, userCol, knobs, ptRing, counter, describe})
function drawScatter(plot, o){
  if (!plot || !plot.c || !plot.c.isConnected) return;
  var r0 = plot.c.getBoundingClientRect(), W0 = Math.max(160, r0.width), H0 = Math.max(120, r0.height);
  var L = 46, R = 14, T = 16, B = 30, bx = o.box, x0 = bx[0], x1 = bx[1], y0 = bx[2], y1 = bx[3];
  var ux = (x1 - x0) / Math.max(10, W0 - L - R), uy = (y1 - y0) / Math.max(10, H0 - T - B);
  plot.draw({ view:{ xmin:x0 - L * ux, xmax:x1 + R * ux, ymin:y0 - B * uy, ymax:y1 + T * uy }, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var X = function(v){ return p.X(v); }, Y = function(v){ return p.Y(v); }, W = p.W, fUI = p.fontUI, fM = p.fontM;
    var rl = X(x0), rr = X(x1), rt = Y(y1), rb = Y(y0), ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), org = css("--ev-c"), sheet = css("--sheet");
    // band and hatching (Predict)
    if (o.band) {
      var bl = clamp(X(o.band[0]), rl, rr), br = clamp(X(o.band[1]), rl, rr);
      ctx.fillStyle = css("--hi-soft"); ctx.fillRect(bl, rt, br - bl, rb - rt);
      ctx.save(); ctx.beginPath(); ctx.rect(rl, rt, bl - rl, rb - rt); ctx.rect(br, rt, rr - br, rb - rt); ctx.clip();
      ctx.strokeStyle = ink2; ctx.globalAlpha = 0.28; ctx.lineWidth = 1; ctx.beginPath();
      for (var hx = rl - (rb - rt); hx < rr; hx += 9) { ctx.moveTo(hx, rb); ctx.lineTo(hx + (rb - rt), rt); }
      ctx.stroke(); ctx.restore();
    }
    // grid, ticks, axes
    var sx = niceStep((x1 - x0) / (W < 420 ? 5 : 8)), sy = niceStep((y1 - y0) / (p.H < 260 ? 4 : 6)), v;
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    for (v = Math.ceil(x0 / sx - 1e-9) * sx; v <= x1 + 1e-9; v += sx) { var gx = Math.round(X(v)) + 0.5; ctx.moveTo(gx, rt); ctx.lineTo(gx, rb); }
    for (v = Math.ceil(y0 / sy - 1e-9) * sy; v <= y1 + 1e-9; v += sy) { var gy = Math.round(Y(v)) + 0.5; ctx.moveTo(rl, gy); ctx.lineTo(rr, gy); }
    ctx.stroke();
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rl, rt); ctx.lineTo(rl, rb); ctx.lineTo(rr, rb); ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = "12px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var lastR = -1e9;
    for (v = Math.ceil(x0 / sx - 1e-9) * sx; v <= x1 + 1e-9; v += sx) { var lab = dN(v, 2), lw = ctx.measureText(lab).width, cx = X(v); if (cx - lw / 2 < lastR + 6) continue; ctx.fillText(lab, cx, rb + 5); lastR = cx + lw / 2; }
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = Math.ceil(y0 / sy - 1e-9) * sy; v <= y1 + 1e-9; v += sy) ctx.fillText(dN(v, 2), rl - 5, Y(v));
    ctx.font = "italic 12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(o.xl || "", rr - 2, rb - 3);
    ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yl || "", rl + 5, rt + 3);
    ctx.save(); ctx.beginPath(); ctx.rect(rl, rt, rr - rl, rb - rt); ctx.clip();
    var pts = o.pts || [], both = !!(o.resU && o.resLS);
    function res(line, col, wid, off, sq, left, lab){
      pts.forEach(function(q){
        var yh = line.m * q[0] + line.b, px = X(q[0]) + off, pa = Y(q[1]), pb = Y(yh), h = Math.abs(pa - pb);
        if (sq && h > 0.5) {
          var w = h * (o.sqT == null ? 1 : o.sqT), top = Math.min(pa, pb), lx = left ? px - w : px;
          ctx.fillStyle = col; ctx.globalAlpha = left ? 0.16 : 0.08; ctx.fillRect(lx, top, w, h); ctx.globalAlpha = 1;
          ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.strokeRect(lx + 0.5, top + 0.5, Math.max(0, w - 1), Math.max(0, h - 1));
          if (lab && w >= 16 && W >= 360 && (o.sqT == null || o.sqT >= 1)) {
            var e = q[1] - yh; ctx.fillStyle = col; ctx.font = "600 11px " + fUI; ctx.textAlign = left ? "right" : "left"; ctx.textBaseline = "bottom";
            ctx.fillText(dN(e * e, 2), left ? lx + w - 2 : lx + 2, top - 2);
          }
        }
        if (h > 0.5) { ctx.strokeStyle = col; ctx.lineWidth = wid; ctx.beginPath(); ctx.moveTo(px, pa); ctx.lineTo(px, pb); ctx.stroke(); }
      });
    }
    if (o.user && (o.resU || o.sqU)) res(o.user, org, 2.4, both ? -2 : 0, o.sqU, true, o.sqLab);
    if (o.ls && (o.resLS || o.sqLS)) res(o.ls, ink, 1.6, both ? 2 : 0, o.sqLS, false, false);
    if (o.target) {
      ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.setLineDash([7, 6]); ctx.beginPath(); ctx.moveTo(rl, Y(o.target.m * x0 + o.target.b)); ctx.lineTo(rr, Y(o.target.m * x1 + o.target.b)); ctx.stroke(); ctx.setLineDash([]);
    }
    if (o.ls) { ctx.strokeStyle = o.lsCol || ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(rl, Y(o.ls.m * x0 + o.ls.b)); ctx.lineTo(rr, Y(o.ls.m * x1 + o.ls.b)); ctx.stroke(); }
    if (o.user) { ctx.strokeStyle = o.userCol || ink2; ctx.lineWidth = 2.5; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(rl, Y(o.user.m * x0 + o.user.b)); ctx.lineTo(rr, Y(o.user.m * x1 + o.user.b)); ctx.stroke(); ctx.setLineDash([]); }
    if (o.probe) {
      var prx = X(o.probe.x); ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(prx, rt); ctx.lineTo(prx, rb); ctx.stroke(); ctx.setLineDash([]);
    }
    pts.forEach(function(q){
      if (o.ptRing) { ctx.strokeStyle = pen; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(X(q[0]), Y(q[1]), 9, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; }
      ctx.fillStyle = pen; ctx.beginPath(); ctx.arc(X(q[0]), Y(q[1]), 5.5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = sheet; ctx.lineWidth = 1.2; ctx.stroke();
    });
    if (o.pending) {
      var qx = X(o.pending[0]), qy = Y(o.pending[1]); ctx.strokeStyle = pen; ctx.lineWidth = 2.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(qx, qy, 7, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = pen; ctx.font = "600 12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText("new point (" + dN(o.pending[0]) + ", " + dN(o.pending[1]) + ")", qx - 9, qy - 7);
    }
    if (o.means) {
      var mx = X(o.means.x), my = Y(o.means.y), t = o.means.t == null ? 1 : o.means.t;
      if (t > 0) {
        ctx.strokeStyle = ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(mx, my, 3 + 8 * t, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = ink; ctx.font = "600 12px " + fUI; ctx.textAlign = "left"; ctx.textBaseline = "top";
        var lt = o.means.lab || "point of means", tw = ctx.measureText(lt).width, lx2 = mx + 12 + tw > rr - 4 ? mx - 12 - tw : mx + 12;
        ctx.globalAlpha = 0.85; ctx.fillStyle = sheet; ctx.fillRect(lx2 - 2, my + 6, tw + 4, 15); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.fillText(lt, lx2, my + 7);
      }
    }
    if (o.probe) {
      var px2 = X(o.probe.x), py2 = Y(o.probe.y);
      ctx.fillStyle = css("--hi"); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px2, py2, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (o.probe.lab) {
        ctx.font = "700 13px " + fUI; var pw = ctx.measureText(o.probe.lab).width, plx = px2 + 10 + pw > rr - 4 ? px2 - 10 - pw : px2 + 10, ply = clamp(py2 - 22, rt + 2, rb - 18);
        ctx.globalAlpha = 0.9; ctx.fillStyle = sheet; ctx.fillRect(plx - 3, ply - 1, pw + 6, 18); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.probe.lab, plx, ply + 1);
      }
    }
    if (o.user && o.knobs) for (var k = 0; k < 2; k++) {
      var kx = X(o.user.hx[k]), ky = Y(o.user.hy[k]);
      ctx.fillStyle = sheet; ctx.strokeStyle = ink2; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(kx, ky, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = ink2; ctx.beginPath(); ctx.arc(kx, ky, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    if (o.counter) {
      ctx.font = "700 15px " + fUI; var cw = ctx.measureText(o.counter).width;
      ctx.globalAlpha = 0.9; ctx.fillStyle = sheet; ctx.fillRect(W - R - cw - 14, rt + 4, cw + 10, 22); ctx.globalAlpha = 1;
      ctx.fillStyle = ink; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(o.counter, W - R - 9, rt + 8);
    }
    plot._box = { rl:rl, rr:rr, rt:rt, rb:rb };
    void fM;
  } });
}

// ---------- data sets (all model data) ----------
var DS = {
  A:{ chip:"A: Kiosk", ctx:"Daily high (°C) vs iced drinks sold at a park kiosk", xl:"daily high (°C)", yl:"iced drinks sold", xu:" °C", yu:" drinks",
    pts:[[15, 38], [20, 52], [25, 62], [30, 68], [35, 80]], view:[10, 40, 20, 100], yc:[0, 150], probe:[0, 50, 1, 28] },
  B:{ chip:"B: Sleep", ctx:"Hours of sleep vs reaction time (ms)", xl:"sleep (h)", yl:"reaction time (ms)", xu:" h", yu:" ms",
    pts:[[4, 330], [5, 310], [6, 300], [7, 280], [8, 280]], view:[3, 9, 250, 350], yc:[150, 450], probe:[0, 12, 0.5, 6.5] },
  C:{ chip:"C: Taxi", ctx:"Taxi trip length (km) vs fare ($)", xl:"trip length (km)", yl:"fare ($)", xu:" km", yu:"",
    pts:[[2, 9], [4, 12], [6, 16], [8, 19], [10, 24]], view:[0, 12, 0, 30], yc:[0, 60], probe:[0, 30, 1, 7] }
};
function ends(k){ var p = DS[k].pts; return [p[0][0], p[p.length - 1][0]]; }

// ---------- Explore: Fit duel ----------
function explore(host, api){
  var S = api.S;
  function origPts(k){ return DS[k].pts.map(function(q){ return q.slice(); }); }
  function sanitize(){
    if (!DS[S.ds]) S.ds = "A";
    if (["duel", "predict", "edit"].indexOf(S.mode) < 0) S.mode = "duel";
    S.h = obj(S.h); S.pts = obj(S.pts); S.probe = obj(S.probe);
    Object.keys(DS).forEach(function(k){
      var d = DS[k], h = S.h[k], e = d.pts.length - 1;
      if (!Array.isArray(h) || h.length !== 2) h = [d.pts[0][1], d.pts[e][1]];
      S.h[k] = h.map(function(v, i){ v = Math.round(+v * 2) / 2; return isFinite(v) ? clamp(v, d.yc[0], d.yc[1]) : d.pts[i ? e : 0][1]; });
      var p = S.pts[k];
      if (!Array.isArray(p) || p.length < 5 || p.length > 9) p = origPts(k);
      S.pts[k] = p.map(function(q, i){ q = Array.isArray(q) ? q : []; return [i < 5 ? d.pts[i][0] : clampI(q[0], d.probe[0], d.probe[1], d.pts[0][0]), clampI(q[1], d.yc[0], d.yc[1], d.pts[Math.min(i, 4)][1])]; });
      var pr = +S.probe[k]; S.probe[k] = isFinite(pr) ? clamp(Math.round(pr / d.probe[2]) * d.probe[2], d.probe[0], d.probe[1]) : d.probe[3];
    });
    S.ls = !!S.ls; S.sq = !!S.sq;
  }
  sanitize();

  var pv = {}, anim = null, msg = "", built = "";
  host.innerHTML =
    '<div class="lr-top"><div id="lr-ds"></div><div id="lr-mode"></div></div>' +
    '<div class="pg lr-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap lr-cap" id="lr-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot lr-plot" id="lr-plot" role="img" aria-label="Scatter plot"></canvas></div>' +
      '<p class="tiny lr-ctx" id="lr-ctx"></p><p class="lr-aha" id="lr-aha"></p></div>' +
    '<div class="pg-ctrl"><div class="lr-sws" role="group" aria-label="Show on the plot">' + swHTML("lr-sls", "Show least-squares line", S.ls) + swHTML("lr-ssq", "Show squares", S.sq) + '</div><div id="lr-ctrl"></div><p class="tiny lr-msg" id="lr-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="lr-read" aria-live="polite"></dl>' +
      '<details class="alg" id="lr-work"><summary>The formulas</summary><div id="lr-workb"></div></details></div></div>';
  var plot = new MV.Plot($("#lr-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintPlot;
  var dsR = radios($("#lr-ds", host), { label:"Data", options:Object.keys(DS).map(function(k){ return { id:k, t:DS[k].chip }; }), value:S.ds, cls:"chips",
    onChange:function(v){ user(); S.ds = v; msg = ""; save(); render(); MV.changed(); } });
  var modeR = radios($("#lr-mode", host), { label:"Mode", options:[{ id:"duel", t:"Duel" }, { id:"predict", t:"Predict" }, { id:"edit", t:"Edit points" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; msg = ""; save(); render(); MV.changed(); } });

  function save(){ api.save(); }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }
  // --- animation bookkeeping: any user action finishes the running animation ---
  function newAnim(done){ cancelAnim(); anim = { timers:[], stops:[], done:done || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function tw(dur, step, fin){ var a = anim; if (!a) return; a.stops.push(MV.tween({ dur:dur, step:function(t){ if (anim === a) step(t); }, done:function(){ if (anim === a) fin(); } })); }
  function endAnim(){ var a = anim; anim = null; pv = {}; render(); MV.changed(); if (a && a.done) { var f = a.done; a.done = null; f(); } }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {}; render(); MV.changed();
    if (a.done) { var f = a.done; a.done = null; f(); }
  }

  // --- the model ---
  function lsOn(){ return S.mode !== "duel" || S.ls; }
  function curPts(){
    var p = S.pts[S.ds].map(function(q){ return q.slice(); });
    if (pv.ov) p[pv.ov.i][1] = pv.ov.y;
    return p;
  }
  function userLine(k){
    k = k || S.ds; var e = ends(k), h = S.h[k], m = F.of(Math.round(2 * h[1]) - Math.round(2 * h[0]), 2 * (e[1] - e[0]));
    return { m:m, b:F.sub(F.of(Math.round(2 * h[0]), 2), F.mul(m, F.of(e[0], 1))), hx:e, hy:h.slice() };
  }
  function box(){
    var d = DS[S.ds], v = d.view.slice(), p = curPts(), R = reg(p);
    if (S.mode === "predict") { v[0] = d.probe[0]; v[1] = d.probe[1]; if (R) [v[0], v[1]].forEach(function(xx){ var yy = R.mv * xx + R.bv; v[2] = Math.min(v[2], yy); v[3] = Math.max(v[3], yy); }); }
    p.concat(pv.pending ? [pv.pending] : []).forEach(function(q){ v[0] = Math.min(v[0], q[0]); v[1] = Math.max(v[1], q[0]); v[2] = Math.min(v[2], q[1]); v[3] = Math.max(v[3], q[1]); });
    if (S.mode === "duel") S.h[S.ds].forEach(function(hy){ v[2] = Math.min(v[2], hy); v[3] = Math.max(v[3], hy); });
    var py = (v[3] - v[2]) * 0.06, px = S.mode === "predict" ? 0 : (v[1] - v[0]) * 0.03;
    var lo = v[2] - py; if (v[2] >= 0 && lo < 0) lo = 0;
    return [v[0] - px, v[1] + px, lo, v[3] + py];
  }

  // --- painting ---
  function render(){
    sanitize();
    dsR.set(S.ds); modeR.set(S.mode);
    paintCtrl(); paintPlot(); paintRead(); paintCap(); paintAha();
    $("#lr-ctx", host).innerHTML = '<span class="mdm-model">model data</span> ' + DS[S.ds].ctx + ".";
    var sl = $("#lr-sls", host); sl.setAttribute("aria-checked", String(lsOn())); sl.disabled = S.mode !== "duel";
    $("#lr-ssq", host).setAttribute("aria-checked", String(S.sq));
    $("#lr-msg", host).innerHTML = msg;
  }
  function paintCtrl(){
    var c = $("#lr-ctrl", host), d = DS[S.ds], want = S.mode + ":" + S.ds;
    if (built !== want) {
      built = want;
      if (S.mode === "duel") c.innerHTML = '<div class="lr-panel"><p class="lr-sh">Your line</p><p class="tiny">Drag the two round handles at the ends of your dashed line. Keyboard: select a handle, then the arrow keys move it by 0.5; Shift + arrow by 5.</p>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="lr-reset-line" data-k="lrresl">Through the end points</button></div></div>';
      else if (S.mode === "predict") c.innerHTML = '<div class="lr-panel"><p class="lr-sh">Prediction probe</p><label class="slider lr-sl"><span class="slider-top"><span>Probe ' + XI + "</span><output id=\"lr-pout\"></output></span>" +
        '<input type="range" id="lr-probe" data-k="lrprobe" min="' + d.probe[0] + '" max="' + d.probe[1] + '" step="' + d.probe[2] + '"></label>' +
        '<p class="tiny muted">The shaded band is the data’s ' + XI + "-range; outside it (hatched) a prediction is extrapolation.</p></div>";
      else c.innerHTML = '<div class="lr-panel"><p class="lr-sh">Edit points</p><p class="tiny">Drag any point up or down. Keyboard: select a point, then the arrow keys move it by 1; Shift + arrow by 5.</p>' +
        '<div class="lr-add" role="group" aria-label="Add a point"><label>' + XI + ' <input class="numin lr-in" id="lr-ax" data-k="lrax" type="text" inputmode="numeric" autocomplete="off" spellcheck="false"></label>' +
        '<label>' + "<i>y</i>" + ' <input class="numin lr-in" id="lr-ay" data-k="lray" type="text" inputmode="numeric" autocomplete="off" spellcheck="false"></label>' +
        '<button type="button" class="btn sm" id="lr-addb" data-k="lradd">Add a point</button></div>' +
        '<p class="tiny muted">' + XI + " from " + d.probe[0] + " to " + d.probe[1] + ", whole numbers; up to 4 new points.</p>" +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="lr-reset-pts" data-k="lrresp">Reset the points</button></div></div>';
    }
    if (S.mode === "predict") {
      var pr = $("#lr-probe", host); if (document.activeElement !== pr) pr.value = S.probe[S.ds];
      $("#lr-pout", host).textContent = mi(dN(S.probe[S.ds], 1)) + d.xu; pr.setAttribute("aria-valuetext", MV.plain(dN(S.probe[S.ds], 1) + d.xu));
    }
    if (S.mode === "edit") { var ab = $("#lr-addb", host); ab.disabled = S.pts[S.ds].length >= 9; }
  }
  function predTxt(R){
    var d = DS[S.ds], xx = S.probe[S.ds], xf = F.of(Math.round(xx * 2), 2), yf = F.add(F.mul(R.m, xf), R.b), e = ends(S.ds), p = curPts();
    var lo = Math.min.apply(null, p.map(function(q){ return q[0]; })), hi = Math.max.apply(null, p.map(function(q){ return q[0]; }));
    var inside = xx >= lo && xx <= hi; void e;
    return { x:xx, y:F.val(yf), html:"At " + XI + " = " + mi(dN(xx, 1)) + ": " + YH + (inexact(yf, 2) ? " ≈ " : " = ") + F.dec(yf, 2) + " " + (inside ? "(interpolation)" : "(extrapolation: outside " + mi(dN(lo)) + "–" + mi(dN(hi)) + ")"), inside:inside, lo:lo, hi:hi, d:d };
  }
  function paintPlot(){
    var p = curPts(), R = reg(p), u = S.mode === "duel" ? userLine() : null, d = DS[S.ds], ls = lsOn() && !pv.hideLS && R;
    var means = null;
    if (R && !pv.hideMeans && (ls || pv.ringT != null)) {
      var mx = F.val(R.xb), my = F.val(R.yb);
      if (pv.meansFrom && pv.meansT != null) { mx = pv.meansFrom[0] + (mx - pv.meansFrom[0]) * pv.meansT; my = pv.meansFrom[1] + (my - pv.meansFrom[1]) * pv.meansT; }
      means = { x:mx, y:my, t:pv.ringT == null ? 1 : pv.ringT, lab:"(" + XB.replace(/<[^>]+>/g, "") + ", " + YB.replace(/<[^>]+>/g, "") + ")" };
    }
    var pr = S.mode === "predict" && R ? predTxt(R) : null;
    var desc = "Scatter plot, data " + S.ds + " (model data): " + d.ctx + ", " + p.length + " points: " + p.map(function(q){ return "(" + q[0] + ", " + q[1] + ")"; }).join(", ") + ". " +
      (u ? "Your dashed line: " + MV.plain(lineHTML(u.m, u.b, 2)) + ", sum of squared residuals " + MV.plain(fq(ssrOf(p, u.m, u.b), 2)) + ". " : "") +
      (ls ? "Least-squares line: " + MV.plain(lineHTML(R.m, R.b)) + ", sum of squared residuals " + MV.plain(fq(R.ssr)) + (means ? ", through the point of means " + MV.plain(ptTxt(R.xb, R.yb)) : "") + ". " : "The least-squares line is hidden. ") +
      (S.sq ? "Squares are drawn on the residuals. " : "") + (pr ? MV.plain(pr.html) + "." : "");
    drawScatter(plot, { box:box(), xl:d.xl, yl:d.yl, pts:p, pending:pv.pending || null,
      ls:ls ? { m:R.mv, b:R.bv } : null, user:u ? { m:F.val(u.m), b:F.val(u.b), hx:u.hx, hy:u.hy } : null,
      resU:!!u && S.sq, sqU:!!u && S.sq, resLS:!!ls && S.sq, sqLS:!!ls && S.sq, sqT:pv.sqT, sqLab:true, knobs:!!u && !anim,
      means:means, band:pr ? [pr.lo, pr.hi] : null, probe:pr ? { x:pr.x, y:pr.y, lab:"ŷ " + (Math.abs(pr.y * 100 - Math.round(pr.y * 100)) > 1e-6 ? "≈ " : "= ") + dN(pr.y, 2) } : null,
      ptRing:S.mode === "edit", describe:desc });
  }
  function paintRead(){
    var p = curPts(), R = reg(p), rows = [], Q = '<span class="lr-q">?</span>';
    if (S.mode === "duel") { var u = userLine(); rows.push(["Your line", lineHTML(u.m, u.b, 2)]); var su = ssrOf(p, u.m, u.b); rows.push(["Your sum of squared residuals", "<strong>" + (inexact(su, 2) ? "≈ " : "") + fq(su, 2) + "</strong>"]); }
    var ls = lsOn() && !pv.hideLS && R;
    rows.push(["Least-squares line", ls ? lineHTML(R.m, R.b) : pv.hideLS ? Q : '<span class="muted">Hidden. Switch on <strong>Show least-squares line</strong>.</span>']);
    rows.push(["Least-squares SSR", ls ? "<strong>" + (inexact(R.ssr) ? "≈ " : "") + fq(R.ssr) + "</strong>" : Q]);
    rows.push(["Point of means", R ? (pv.hideMeans ? Q : ptTxt(R.xb, R.yb) + (ls ? ', <span class="lr-ok">on the least-squares line ✓</span>' : "")) : "—"]);
    rows.push([RI + " and " + RI + "²", R ? RI + " = " + dN(R.r, 3) + ", " + RI + "² = " + dN(R.r * R.r, 3) : "—"]);
    if (S.mode === "predict" && R) rows.push(["Prediction", predTxt(R).html]);
    var rd = $("#lr-read", host); MV.keepFocus(rd, function(){ rd.innerHTML = MV.readoutHTML(rows); });
    // the formulas, with this data's numbers
    var wb = $("#lr-workb", host);
    if (R) wb.innerHTML = '<p class="tiny">' + "<i>m</i> = Σ(" + XI + " − " + XB + ")(<i>y</i> − " + YB + ") ÷ Σ(" + XI + " − " + XB + ")² = " + fq(R.Sxy) + " ÷ " + fq(R.Sxx) + (pv.hideLS ? "" : " = " + (inexact(R.m) ? "≈ " : "") + fq(R.m)) + "</p>" +
      '<p class="tiny"><i>b</i> = ' + YB + " − <i>m</i>" + XB + " = " + fq(R.yb) + " − <i>m</i>(" + fq(R.xb) + ")" + (pv.hideLS ? "" : " " + (inexact(R.b) ? "≈ " : "= ") + fq(R.b)) + "</p>" +
      '<p class="tiny">From summaries: <i>m</i> = ' + RI + " × <i>s</i><sub><i>y</i></sub> ÷ <i>s</i><sub><i>x</i></sub>. Use the same divisor (" + "<i>n</i> or <i>n</i> − 1) for both standard deviations.</p>" +
      '<p class="tiny muted">SSR = sum of squared residuals = Σ(<i>y</i> − ' + YH + ")². Each residual is a vertical distance: observed <i>y</i> − predicted <i>y</i>.</p>";
  }
  function paintCap(){
    var p = curPts(), R = reg(p), c = $("#lr-cap", host), ls = lsOn() && !pv.hideLS && R;
    if (S.mode === "duel") { var u = userLine(), su = ssrOf(p, u.m, u.b); c.innerHTML = "Your SSR " + (inexact(su, 2) ? "≈ " : "") + fq(su, 2) + " · least squares " + (ls ? fq(R.ssr) : "?"); }
    else if (S.mode === "predict" && R) c.innerHTML = predTxt(R).html.replace(/ \(.*$/, "");
    else c.innerHTML = ls ? lineHTML(R.m, R.b) : "";
  }
  function paintAha(){
    var a = $("#lr-aha", host), p = curPts(), R = reg(p), t = "";
    if (R && !pv.hideLS && !pv.hideMeans && !anim) {
      if (S.mode === "duel" && S.ls) {
        var u = userLine(), su = ssrOf(p, u.m, u.b), c = F.cmp(su, R.ssr);
        t = c === 0 ? "Your line is the least-squares line: no line can beat " + fq(R.ssr) + "." : "Least squares wins: " + fq(R.ssr) + " < " + (inexact(su, 2) ? "≈ " : "") + fq(su, 2) + ". No line has a smaller sum of squared residuals, and it runs through the point of means.";
      } else if (S.mode === "edit") t = "Points far from " + XB + " = " + fq(R.xb) + " pull hardest on the slope. The line always runs through the point of means.";
      else if (S.mode === "predict") { var pr = predTxt(R); t = pr.inside ? "Inside the data’s " + XI + "-range: interpolation is usually reasonable." : "Outside the data’s " + XI + "-range: the pattern may change, so treat this prediction with caution."; }
    }
    a.innerHTML = t; a.hidden = !t;
  }

  // --- drag: line handles (Duel) or points (Edit points) ---
  function handleList(){
    if (anim) return [];
    var d = DS[S.ds];
    if (S.mode === "duel") { var e = ends(S.ds), h = S.h[S.ds]; return [0, 1].map(function(i){ return { id:"h" + i, x:e[i], y:h[i], label:(i ? "Right" : "Left") + " handle of your line at " + MV.plain(XI) + " = " + e[i] + ", " + MV.plain("<i>y</i>") + " = " + dN(h[i], 1) + ". Arrow keys move it by 0.5; Shift + arrow by 5." }; }); }
    if (S.mode === "edit") return S.pts[S.ds].map(function(q, i){ return { id:"p" + i, x:q[0], y:q[1], label:"Point (" + q[0] + ", " + q[1] + ") of " + S.pts[S.ds].length + ". Arrow keys move it by 1; Shift + arrow by 5." }; });
    void d; return [];
  }
  function setH(i, yv){ var d = DS[S.ds]; S.h[S.ds][i] = clamp(Math.round(yv * 2) / 2, d.yc[0], d.yc[1]); }
  function setP(i, yv){ var d = DS[S.ds]; S.pts[S.ds][i][1] = clamp(Math.round(yv), d.yc[0], d.yc[1]); }
  function after(){ save(); paintPlot(); paintRead(); paintCap(); paintAha(); MV.changed(); }
  MV.drag(plot, { axis:"y", step:{ x:1, y:1 },
    handles:handleList,
    key:function(id, e){
      var dir = (e.key === "ArrowUp" || e.key === "ArrowRight") ? 1 : (e.key === "ArrowDown" || e.key === "ArrowLeft") ? -1 : 0; if (!dir) return false;
      user(); var i = +id.slice(1);
      if (id[0] === "h") setH(i, S.h[S.ds][i] + dir * (e.shiftKey ? 5 : 0.5)); else setP(i, S.pts[S.ds][i][1] + dir * (e.shiftKey ? 5 : 1));
      after(); return true;
    },
    move:function(id, xx, yy, how){
      if (how !== "drag") return;
      if (anim) cancelAnim();
      var i = +id.slice(1);
      if (id[0] === "h") { var o1 = S.h[S.ds][i]; setH(i, yy); if (o1 === S.h[S.ds][i]) return; }
      else { var o2 = S.pts[S.ds][i][1]; setP(i, yy); if (o2 === S.pts[S.ds][i][1]) return; }
      pv = {}; after();
    } });

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg") || b.classList.contains("drag-h")) return;
    if (b.id === "lr-sls") { user(); S.ls = !S.ls; save(); render(); MV.changed(); return; }
    if (b.id === "lr-ssq") { user(); S.sq = !S.sq; save(); render(); MV.changed(); return; }
    if (b.id === "lr-reset-line") { user(); var p0 = DS[S.ds].pts; S.h[S.ds] = [p0[0][1], p0[p0.length - 1][1]]; msg = ""; save(); render(); MV.changed(); return; }
    if (b.id === "lr-reset-pts") { user(); S.pts[S.ds] = origPts(S.ds); msg = "The original points are back."; save(); render(); MV.changed(); return; }
    if (b.id === "lr-addb") {
      user(); var d = DS[S.ds], xs = $("#lr-ax", host).value.trim().replace(/−/g, "-"), ys = $("#lr-ay", host).value.trim().replace(/−/g, "-");
      var xv = /^-?\d+$/.test(xs) ? +xs : NaN, yv = /^-?\d+$/.test(ys) ? +ys : NaN;
      if (!isFinite(xv) || !isFinite(yv)) msg = "Enter whole numbers for both " + XI + " and <i>y</i>.";
      else if (xv < d.probe[0] || xv > d.probe[1]) msg = XI + " must be from " + d.probe[0] + " to " + d.probe[1] + ".";
      else if (yv < d.yc[0] || yv > d.yc[1]) msg = "<i>y</i> must be from " + d.yc[0] + " to " + d.yc[1] + ".";
      else if (S.pts[S.ds].length >= 9) msg = "That’s the most points this view allows. Reset the points to start again.";
      else { S.pts[S.ds].push([xv, yv]); msg = "Added (" + xv + ", " + mi(String(yv)) + ")."; $("#lr-ax", host).value = ""; $("#lr-ay", host).value = ""; }
      save(); render(); MV.changed(); return;
    }
  });
  host.addEventListener("input", function(e){
    if (e.target.id === "lr-probe") { if (anim) cancelAnim(); S.probe[S.ds] = +e.target.value; sanitize(); save(); paintCtrl(); paintPlot(); paintRead(); paintCap(); paintAha(); MV.changed(); }
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && (e.target.id === "lr-ax" || e.target.id === "lr-ay")) { e.preventDefault(); $("#lr-addb", host).click(); } });

  render();

  // --- predictions ---
  function resetA(){ S.ds = "A"; S.pts.A = origPts("A"); }
  function startPred(p){
    cancelAnim(); msg = ""; resetA();
    if (p.id === "p1") { S.mode = "duel"; S.h.A = [38, 80]; S.ls = false; S.sq = false; pv = { hideLS:true }; }
    else if (p.id === "p2") { S.mode = "duel"; S.ls = true; S.sq = false; pv = { hideMeans:true }; }
    else if (p.id === "p3") { S.mode = "edit"; S.sq = false; pv = {}; }
    else { S.mode = "edit"; S.sq = false; pv = { pending:[40, 90] }; }
    save(); render();
  }
  function runPred(p, done){
    newAnim(done);
    if (p.id === "p1") {
      S.ls = true; S.sq = true; save(); pv = { sqT:0 }; render();
      later(200, function(){ tw(1500, function(t){ pv.sqT = t; paintPlot(); }, function(){ later(300, endAnim); }); });
    } else if (p.id === "p2") {
      pv = { ringT:0 }; render();
      later(200, function(){ tw(1000, function(t){ pv.ringT = t; paintPlot(); }, function(){ later(300, endAnim); }); });
    } else if (p.id === "p3") {
      S.pts.A[4][1] = 90; save(); pv = { ov:{ i:4, y:80 } }; render();
      later(400, function(){ tw(1600, function(t){ var yv = 80 + Math.round(10 * t); if (yv !== pv.ov.y) { pv.ov.y = yv; paintPlot(); paintRead(); paintCap(); } }, function(){ later(300, endAnim); }); });
    } else {
      S.pts.A.push([40, 90]); save(); pv = { meansFrom:[25, 60], meansT:0 }; render();
      later(500, function(){ tw(1300, function(t){ pv.meansT = t; paintPlot(); }, function(){ later(300, endAnim); }); });
    }
  }

  // --- challenges ---
  function chal(id){
    var R0 = function(m){ return { ok:false, msg:m }; }, pA = S.pts.A, orig = DS.A.pts;
    function origSame(n){ for (var i = 0; i < n; i++) if (pA[i][1] !== orig[i][1]) return false; return true; }
    if (id === "tc1") {
      if (S.ds !== "A") return R0("Choose data <strong>A</strong>.");
      if (pA.length !== 5 || !origSame(5)) return R0("This challenge uses the original data A. Use <strong>Edit points</strong>, then <strong>Reset the points</strong>.");
      var u = userLine("A"), su = ssrOf(pA, u.m, u.b), h = S.h.A;
      if (F.cmp(su, F.of(20, 1)) < 0) return { ok:true };
      if (h[0] === 38 && h[1] === 80) return R0("Close, but the three middle points all sit above it.");
      if (F.eq(u.m, F.of(2, 1)) && F.eq(u.b, F.of(12, 1))) return R0("Right slope, but the line is too high. Every residual is 2 too negative, so lower it until the residuals balance.");
      return R0("Your sum of squared residuals is " + (inexact(su, 2) ? "≈ " : "") + fq(su, 2) + ", not below 20.");
    }
    if (id === "tc2") {
      if (pA.length !== 5) return R0("Use only the five original points: <strong>Reset the points</strong> removes added ones.");
      if (!origSame(4)) return R0("Only the 35 °C point may move.");
      var y5 = pA[4][1], m2 = reg(pA).m;
      if (y5 === 90) return { ok:true };
      if (y5 === 92) return R0("Slope 2.48: a little too high.");
      if (y5 === 85) return R0("Slope 2.2.");
      return R0("Slope " + (inexact(m2) ? "≈ " : "") + fq(m2) + ", not 2.4.");
    }
    if (id === "tc3") {
      if (pA.length < 5 || !origSame(5)) return R0("Start from the original data A: <strong>Reset the points</strong>, then add one point.");
      if (pA.length === 5) return R0("Add one point first (<strong>Edit points</strong> mode, <strong>Add a point</strong>).");
      if (pA.length > 6) return R0("Add exactly one point. <strong>Reset the points</strong> to start again.");
      var q = pA[5];
      if (q[1] === 2 * q[0] + 10) return { ok:true };
      if (q[0] === 40 && q[1] === 95) return R0("It sits above the line, so it pulls the line up: slope about 2.14.");
      if (q[0] === 25 && q[1] === 65) return R0("Right " + XI + ", wrong <i>y</i>: the slope stays 2, but the line shifts up by about 0.83.");
      var R3 = reg(pA);
      return R0("The line changed to " + lineHTML(R3.m, R3.b) + ". (" + q[0] + ", " + mi(String(q[1])) + ") has residual " + mi(String(q[1] - (2 * q[0] + 10))) + " from " + YH + " = 2" + XI + " + 10.");
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: a rough line drops in and tilts; the sum of squares falls to 16; the point of means rings ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "", P = DS.A.pts;
  var st = { n:5, s:2, o:0, line:true, fin:true, ring:1 };
  function ssr(){ var t = 0; P.forEach(function(q){ var e = q[1] - (60 + st.s * (q[0] - 25) + st.o); t += e * e; }); return t; }
  plot.render = function(){
    var b = 60 - 25 * st.s + st.o, v = ssr();
    drawScatter(plot, { box:[10, 40, 20, 100], xl:"daily high (°C)", yl:"iced drinks sold", pts:P.slice(0, st.n),
      ls:st.line ? { m:st.s, b:b } : null, lsCol:st.fin ? css("--ink") : css("--ink-2"), resLS:st.line, sqLS:st.line,
      means:st.fin ? { x:25, y:60, t:st.ring, lab:"(25, 60)" } : null,
      counter:st.line ? "Sum of squares " + (st.fin ? "= 16" : "≈ " + dN(v, 0)) : "", describe:aria });
  };
  var cap = f.cap;
  function last(){ st = { n:5, s:2, o:0, line:true, fin:true, ring:1 }; plot.render(); cap.textContent = "The least-squares line: the sum of squares is as small as it can be (16), and the line passes through the point of means (25, 60)."; }
  if (MV.reduceMotion) { last(); return; }
  st = { n:0, s:0.9, o:38, line:false, fin:false, ring:0 }; plot.render(); cap.textContent = "Kiosk data (model data): temperature vs iced drinks sold";
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  var k = 0;
  (function addPt(){ if (k >= 5) { go(); return; } k++; st.n = k; plot.render(); MV.wait(260, addPt); })();
  function go(){
    MV.wait(400, function(){
      cap.textContent = "A rough line drops in: every point misses it by a residual";
      st.line = true;
      tw(900, function(t){ st.o = 38 - 32 * t; plot.render(); }, function(){
        MV.wait(500, function(){
          cap.textContent = "Square each miss and add: the counter tracks the sum as the line tilts";
          tw(1400, function(t){ st.s = 0.9 + 1.8 * t; st.o = 6 * (1 - t); plot.render(); }, function(){
            tw(1000, function(t){ st.s = 2.7 - 0.7 * t; plot.render(); }, function(){
              st.fin = true; st.ring = 0;
              tw(700, function(t){ st.ring = t; plot.render(); }, function(){ MV.wait(300, last); });
            });
          });
        });
      });
    });
  }
}

// ---------- Part 3: Predictions with care (three judgement stations with a trust gauge) ----------
// @component trustGauge — a three-zone gauge (Trust · Risky · Don't trust) with a sliding needle, an icon and words (red stays
// reserved for "wrong"): gaugeHTML(level 0–2, html text) -> HTML string.
function gaugeHTML(level, text){
  var lab = ["✓ Trust", "⚠ Risky", "⊘ Don’t trust"];
  return '<div class="lr-gauge" role="img" aria-label="Trust m&#101;ter: ' + MV.esc(MV.plain(text)) + '"><div class="lr-mtrack" aria-hidden="true">' +
    lab.map(function(t, i){ return '<span class="lr-mz lr-mz' + i + (i === level ? " on" : "") + '">' + t + "</span>"; }).join("") +
    '<span class="lr-needle" style="left:' + [16.7, 50, 83.3][level] + '%"></span></div><p class="lr-mtext">' + text + "</p></div>";
}
var KIDS = [[2, 93], [4, 102], [6, 118], [8, 126], [10, 141]];   // model data: least-squares line exactly ŷ = 6x + 80
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.t1 = clampI(S.t1, -10, 50, 28); S.t2 = clampI(S.t2, 0, 40, 7); S.items = obj(S.items);
  var msgs = {}, plot = null;
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  var tabOpts = ST.map(function(s, i){ return { id:s.id, t:"Station " + (i + 1) + ": " + s.title }; });
  host.innerHTML = '<div id="pc-tabs"></div><div id="pc-body" class="pc-body"></div>';
  radios($("#pc-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });

  function judge1(t){
    var yv = 2 * t + 10, txt, lv, note = "";
    if (t >= 15 && t <= 35) { lv = 0; txt = "<strong>✓ Trustworthy</strong> (interpolation)"; }
    else if (t >= 10) { lv = 1; txt = "<strong>⚠ Risky</strong> (extrapolation: outside 15–35 °C)"; if (yv > 90) note = "The kiosk only has 90 cups."; }
    else { lv = 2; txt = "<strong>⊘ Meaningless</strong>: the kiosk is closed below 10 °C"; }
    return { y:yv, lv:lv, txt:txt, note:note, read:"At " + mi(String(t)) + " °C: " + YH + " = 2(" + mi(String(t)) + ") + 10 = " + mi(String(yv)) + " drinks" };
  }
  function judge2(a){
    var yv = 6 * a + 80, txt, lv, note = "";
    if (a >= 2 && a <= 10) { lv = 0; txt = "<strong>✓ Trustworthy</strong> (interpolation): " + yv + " cm is sensible"; }
    else if (a < 2 || a <= 14) { lv = 1; txt = "<strong>⚠ Risky</strong> (extrapolation: outside ages 2–10)"; }
    else { lv = 2; txt = "<strong>⊘ Don’t trust</strong>: growth stops; the linear pattern ends"; note = yv + " cm is taller than any adult: absurd."; }
    return { y:yv, lv:lv, txt:txt, note:note, read:"At age " + a + ": " + YH + " = 6(" + a + ") + 80 = " + yv + " cm" };
  }
  function probeHTML(s){
    var one = s.id === "s1", v = one ? S.t1 : S.t2, quick = one ? [28, 45, -5] : [7, 30];
    return '<p class="pc-text">' + s.text + ' <span class="mdm-model">model data</span></p>' +
      '<div class="plot-wrap"><canvas class="plot wide pc-plot" id="pc-plot" role="img" aria-label="Scatter plot with a prediction probe"></canvas></div>' +
      '<label class="slider pc-sl"><span class="slider-top"><span>' + (one ? "Temperature (°C)" : "Age (years)") + '</span><output id="pc-out">' + mi(String(v)) + (one ? " °C" : "") + "</output></span>" +
      '<input type="range" id="pc-rng" data-k="pcrng" min="' + (one ? -10 : 0) + '" max="' + (one ? 50 : 40) + '" step="1" value="' + v + '"></label>' +
      '<div class="q-actions pc-quick">' + quick.map(function(q){ return '<button type="button" class="btn ghost sm" data-q="' + q + '" data-k="pcq' + q + '">' + (one ? mi(String(q)) + " °C" : "Age " + q) + "</button>"; }).join("") + "</div>" +
      '<div id="pc-dyn" aria-live="polite"></div>' +
      '<details class="alg"><summary>Check it with data</summary>' + (one ?
        MV.tableHTML({ head:["Temperature", "Predicted " + YH, "Drinks sold"], caption:"Kiosk check (model data; the 42 °C day is fictional)", rows:[["25 °C", "60", "62"], ["30 °C", "70", "68"], ["42 °C", "94", "71"]] }) +
          '<p class="tiny">Inside 15–35 °C the line misses by about 2 drinks. On a 42 °C day (a fictional model-data day) the kiosk sold 71 drinks, far below the predicted 94: on the hottest days people stayed home.</p>' :
        MV.tableHTML({ head:["Age", "Predicted " + YH, "Typical height"], caption:"Height check (model data)", rows:[["6", "116 cm", "118 cm"], ["7", "122 cm", "121 cm"], ["30", "260 cm", "about 170 cm"]] }) +
          '<p class="tiny">At age 7 the prediction is close. By age 30 growth stopped long ago, so the line overshoots by about 90 cm.</p>') + "</details>";
  }
  function dyn(){
    var s = st(S.cur), box = $("#pc-dyn", host); if (!box) return;
    var one = s.id === "s1", j = one ? judge1(S.t1) : judge2(S.t2);
    box.innerHTML = '<dl class="read">' + MV.readoutHTML([["Prediction", j.read]]) + "</dl>" + gaugeHTML(j.lv, j.txt) + (j.note ? '<p class="pc-note">' + j.note + "</p>" : "");
    var o = $("#pc-out", host); o.textContent = mi(String(one ? S.t1 : S.t2)) + (one ? " °C" : "");
    var r = $("#pc-rng", host); r.setAttribute("aria-valuetext", one ? mi(String(S.t1)) + " degrees" : "age " + S.t2);
    if (plot) plot.render();
  }
  function drawP(){
    if (!plot || this !== plot) return;
    var s = st(S.cur), one = s.id === "s1", v = one ? S.t1 : S.t2, j = one ? judge1(v) : judge2(v);
    drawScatter(plot, { box:one ? [-10, 50, 0, 115] : [0, 40, 60, 330], xl:one ? "daily high (°C)" : "age (years)", yl:one ? "iced drinks sold" : "height (cm)",
      pts:one ? DS.A.pts : KIDS, ls:one ? { m:2, b:10 } : { m:6, b:80 }, band:one ? [15, 35] : [2, 10], probe:{ x:v, y:j.y, lab:"ŷ = " + mi(String(j.y)) },
      describe:(one ? "Kiosk data (model data), 15 to 35 °C, with the line ŷ = 2x + 10 extended from −10 to 50 °C. " : "Children’s heights (model data), ages 2 to 10, with the line ŷ = 6x + 80 extended to age 40. ") + MV.plain(j.read) + ". " + MV.plain(j.txt) + "." });
  }
  function s3HTML(s){
    return '<p class="pc-text">' + s.text + "</p>" + s.cards.map(function(c){
      var x = S.items[c.id] = obj(S.items[c.id]), fb = x.solved ? MV.fbHTML("good", "<strong>✓ " + (MV.ans(c) === "mean" ? "Meaningful" : "Just positions the line") + ".</strong> " + c.why) : msgs[c.id] ? MV.fbHTML("bad", msgs[c.id]) : "";
      return '<div class="pc-card" data-pcc="' + c.id + '"><p>' + c.t + '</p><div class="q-actions" role="group" aria-label="Is the intercept meaningful?">' +
        [["mean", "Meaningful"], ["pos", "Just positions the line"]].map(function(o){ return '<button type="button" class="btn ghost sm" data-bin="' + o[0] + '" data-k="pc' + c.id + o[0] + '"' + (x.solved ? " disabled" : "") + (x.solved && MV.ans(c) === o[0] ? ' aria-pressed="true"' : "") + ">" + o[1] + "</button>"; }).join("") + "</div>" + fb + "</div>";
    }).join("") + (s.cards.every(function(c){ return obj(S.items[c.id]).solved; }) ? '<p class="pc-after">An intercept is a prediction at ' + XI + " = 0. It means something only when " + XI + " = 0 makes sense and is near the data; otherwise it just positions the line.</p>" : "");
  }
  function paint(){
    var s = st(S.cur), body = $("#pc-body", host);
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="pc-card0"><span class="pc-lab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + "</span>" + (s.id === "s3" ? s3HTML(s) : probeHTML(s)) + "</div>"; });
    plot = null;
    var cv = $("#pc-plot", host); if (cv) { plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = drawP; }
    dyn();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.q != null) { if (S.cur === "s1") S.t1 = +b.dataset.q; else S.t2 = +b.dataset.q; var r = $("#pc-rng", host); if (r) r.value = b.dataset.q; api.save(); dyn(); return; }
    if (b.dataset.bin) {
      var cid = b.closest("[data-pcc]").dataset.pcc, c = st("s3").cards.filter(function(z){ return z.id === cid; })[0], x = S.items[cid] = obj(S.items[cid]);
      if (MV.ans(c) === b.dataset.bin) { x.solved = true; msgs[cid] = null; } else { x.tries = (x.tries || 0) + 1; msgs[cid] = "<strong>✗ Not quite.</strong> " + c.wrong + " Try the other choice."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-pcc="' + cid + '"]'));
    }
  });
  host.addEventListener("input", function(e){
    if (e.target.id !== "pc-rng") return;
    if (S.cur === "s1") S.t1 = +e.target.value; else S.t2 = +e.target.value; api.save(); dyn();
  });
  paint();
  return {};
}

// ---------- Practice: Compute and predict ----------
// @component N4 lineEntry — number entry for regression answers (adapted from MDM4U 19's N4 moneyEntry): form "num" (one box
// with a label), "mb" (boxes m = and b =) or "line" (ŷ = [ ]x + [ ]); answer is a number or [m, b]; fractions and decimals
// accepted; named wrong answers: wrong:[{match:number | [m, b], fb}], wrongM:[{match:m, fb}] (slope only); first try = right on
// the first check without the worked solution.
function leParse(raw){
  var s = String(raw == null ? "" : raw).replace(/\$/g, "").replace(/[\s  ]/g, "").replace(/^\+/, "");
  if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null;
}
function lineEntry(host, api, a){
  var st = api.S; st.items = obj(st.items);
  var msgs = {};
  function ist(id){ var x = st.items[id] = obj(st.items[id]); x.v = Array.isArray(x.v) ? x.v.map(String) : ["", ""]; x.tries = x.tries || 0; x.hint = x.hint || 0; return x; }
  function box(it, k, lab, x){ return '<input class="numin le-in" id="le-' + it.id + k + '" data-lein="' + it.id + '|' + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(lab) + '" value="' + MV.esc(x.v[k]) + '"' + (x.solved ? " disabled" : "") + ">"; }
  function inputs(it, x){
    if (it.form === "line") return '<div class="numrow le-line"><span class="le-eq">' + YH + " =</span>" + box(it, 0, "slope m", x) + '<span class="le-eq">' + XI + " +</span>" + box(it, 1, "intercept b", x) + "</div>";
    if (it.form === "mb") return '<div class="numrow le-line"><span class="le-eq"><i>m</i> =</span>' + box(it, 0, "m", x) + '<span class="le-eq"><i>b</i> =</span>' + box(it, 1, "b", x) + "</div>";
    return '<div class="numrow le-line"><label class="le-eq" for="le-' + it.id + '0">' + (it.label || "Your answer:") + "</label>" + box(it, 0, MV.plain(it.label || "answer"), x) + "</div>";
  }
  function judge(it, x){
    var ans = MV.ans(it), pair = Array.isArray(ans), tol = it.tol || 1e-6;
    if (!pair) {
      var v = leParse(x.v[0]); if (v == null) return { bad:"Enter a number, such as 17, −2.5 or 3/4." };
      if (Math.abs(v - ans) <= tol) return { ok:true };
      var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) <= Math.max(tol, 1e-6); })[0];
      return { fb:w ? w.fb : it.general || "Check your work." };
    }
    var m = leParse(x.v[0]), b = leParse(x.v[1]);
    if (m == null || b == null) return { bad:"Enter a number in both boxes, such as 1.5 or −13. Type a negative intercept with a minus sign." };
    var mOk = Math.abs(m - ans[0]) <= tol, bOk = Math.abs(b - ans[1]) <= tol;
    if (mOk && bOk) return { ok:true };
    var wf = (it.wrong || []).filter(function(q){ return Math.abs(m - q.match[0]) <= 1e-6 && Math.abs(b - q.match[1]) <= 1e-6; })[0];
    if (wf) return { fb:wf.fb };
    if (!mOk) { var wm = (it.wrongM || []).filter(function(q){ return Math.abs(m - q.match) <= 1e-6; })[0]; return { fb:wm ? wm.fb : "Check the slope first." }; }
    return { fb:"Your slope is right. Now find the intercept: <i>b</i> = " + YB + " − <i>m</i>" + XB + "." };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-le="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += inputs(it, x);
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.lein; if (!k) return; var q = k.split("|"); ist(q[0]).v[+q[1]] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lein) { var b = host.querySelector('[data-k="' + e.target.dataset.lein.split("|")[0] + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box2 = b.closest("[data-le]"); if (!box2) return;
    var it = a.items.filter(function(z){ return z.id === box2.dataset.le; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-le="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-le="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Hit the target line ----------
var task = (function(){
  var api = null, plot = null;
  function st(){ var s = api ? api.S : {}; if (!Array.isArray(s.y) || s.y.length !== 5) s.y = [2, 4, 6, 8, 10]; s.y = s.y.map(function(v){ return clampI(v, 0, 12, 0); }); return s; }
  function read(){ return { y:st().y.slice() }; }
  function pts(d){ return d.y.map(function(v, i){ return [i + 1, v]; }); }
  function lab(k){ return "(" + k.split(",").join(", ") + ")"; }
  function paint(){
    var d = read(), R = reg(pts(d)), rd = $("#ht-read"); if (!rd) return;
    var res = pts(d).map(function(q){ return F.sub(F.of(q[1], 1), F.add(F.mul(R.m, F.of(q[0], 1)), R.b)); });
    rd.innerHTML = MV.readoutHTML([["Least-squares line", lineHTML(R.m, R.b)], ["Slope", (inexact(R.m) ? "≈ " : "") + fq(R.m)], ["Intercept", (inexact(R.b) ? "≈ " : "") + fq(R.b)],
      ["Residuals (from the least-squares line)", res.map(function(f){ return (inexact(f) ? "≈ " : "") + fq(f); }).join(", ")],
      ["Distance from " + YH + " = 2" + XI + " + 1", d.y.map(function(v, i){ return mi(String(v - (2 * (i + 1) + 1))); }).join(", ")]]);
    if (plot) plot.render();
  }
  function drawT(){
    var d = read(), R = reg(pts(d));
    drawScatter(plot, { box:[0, 6, 0, 14], xl:"x", yl:"y", pts:pts(d), ls:{ m:R.mv, b:R.bv }, resLS:true, target:{ m:2, b:1 },
      describe:"Your points " + d.y.map(function(v, i){ return "(" + (i + 1) + ", " + v + ")"; }).join(", ") + ". Least-squares line " + MV.plain(lineHTML(R.m, R.b)) + ", with residual segments; the dashed target line is y = 2x + 1." });
  }
  return {
    render:function(inp, pvw, a){
      api = a; st();
      inp.innerHTML = '<div class="ht-in" role="group" aria-label="y-values">' + [0, 1, 2, 3, 4].map(function(i){
        return '<div class="ht-row"><label for="ht-y' + i + '"><i>y</i><sub>' + (i + 1) + "</sub> (" + XI + " = " + (i + 1) + ')</label><button type="button" class="btn ghost sm ht-st" data-st="' + i + '|-1" data-k="htm' + i + '" aria-label="y ' + (i + 1) + ' down 1">−</button>' +
          '<input class="numin ht-num" id="ht-y' + i + '" data-hty="' + i + '" type="text" inputmode="numeric" autocomplete="off" spellcheck="false"><button type="button" class="btn ghost sm ht-st" data-st="' + i + '|1" data-k="htp' + i + '" aria-label="y ' + (i + 1) + ' up 1">+</button></div>';
      }).join("") + '<p class="tiny muted">Whole numbers from 0 to 12.</p></div>';
      pvw.innerHTML = '<div class="plot-wrap"><canvas class="plot ht-plot" id="ht-plot" role="img" aria-label="Your points and their least-squares line"></canvas></div><p class="tiny muted ht-key">Solid line: the least-squares line for your points. Dashed: the target ' + YH + " = 2" + XI + " + 1.</p>" + '<dl class="read" id="ht-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#ht-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = drawT;
      function sync(){ st().y.forEach(function(v, i){ var el = $("#ht-y" + i); if (document.activeElement !== el) el.value = v; inp.querySelector('[data-st="' + i + '|-1"]').disabled = v <= 0; inp.querySelector('[data-st="' + i + '|1"]').disabled = v >= 12; }); }
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-st]"); if (!b || b.disabled) return;
        var q = b.dataset.st.split("|"), s = st(); s.y[+q[0]] = clamp(s.y[+q[0]] + +q[1], 0, 12); api.save(); sync(); paint(); api.update();
        if (b.disabled) { var o = inp.querySelector('[data-st="' + q[0] + "|" + (-q[1]) + '"]'); if (o) o.focus(); }
      });
      inp.addEventListener("input", function(e){
        var t = e.target; if (t.dataset.hty == null) return;
        if (!/^\d{1,2}$/.test(t.value.trim())) return;
        st().y[+t.dataset.hty] = clamp(+t.value.trim(), 0, 12); api.save(); paint(); api.update();
      });
      inp.addEventListener("change", function(e){ if (e.target.dataset.hty != null) sync(); });
      sync(); paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var R = reg(pts(d));
      return [F.eq(R.m, F.of(2, 1)), F.eq(R.b, F.of(1, 1)), d.y.every(function(v, i){ return Math.abs(v - (2 * (i + 1) + 1)) <= 1; }), R.ssr.n !== 0];
    },
    key:function(d){ return d.y.join(","); },
    label:function(k){ return lab(k); },
    text:function(k){ return lab(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ compute:lineEntry },
  task:task
});
})();
