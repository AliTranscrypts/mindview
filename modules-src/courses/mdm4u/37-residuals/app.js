// MDM4U 37 Residuals & Goodness of Fit: hero (braking data, residual segments, the plot folds into a U-shaped residual plot),
// Residual inspector (Explore: D11 scatter plot with a linked residual panel on a shared x-axis; Inspect / Add a point / Compare
// models; Lock the line), Is linear right? (Part 3: three stations), N4 number entry with a choice row (practice), Hidden curve task.
// Fits are least squares, computed in code; displays round to 3 decimal places. All data sets are model data.
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? clamp(v, lo, hi) : def; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
// a number with up to dp decimals (zeros trimmed), true minus
function dN(v, dp){ dp = dp == null ? 3 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp); if (dp > 0) s = s.replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
function sg(v, dp){ var s = dN(v, dp); return s !== "0" && s.charAt(0) !== MV.MINUS ? "+" + s : s; }
var I = function(s){ return "<i>" + s + "</i>"; }, R2 = I("r") + "²", XB = I("x̄"), YH = I("ŷ");
function swHTML(id, lab, on){ return '<button type="button" class="cc-switch rs-sw" role="switch" id="' + id + '" data-k="' + id + '" aria-checked="' + !!on + '"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>' + lab + "</button>"; }

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

// ---------- D11 fitting helpers ----------
// lsq(P) -> least-squares line of points [[x, y], …]: {m, b, r, r2, res, ssr, syy, sum, mx, my}
function lsq(P){
  var n = P.length, sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0;
  P.forEach(function(p){ sx += p[0]; sy += p[1]; });
  var mx = sx / n, my = sy / n;
  P.forEach(function(p){ sxx += (p[0] - mx) * (p[0] - mx); sxy += (p[0] - mx) * (p[1] - my); syy += (p[1] - my) * (p[1] - my); });
  var m = sxx > 0 ? sxy / sxx : 0, b = my - m * mx;
  var o = withLine(P, m, b, syy); o.r = sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0; o.mx = mx; o.my = my; return o;
}
function withLine(P, m, b, syy){
  var res = P.map(function(p){ return p[1] - (m * p[0] + b); }), ssr = 0, sum = 0;
  res.forEach(function(e){ ssr += e * e; sum += e; });
  if (syy == null) { var my = 0; P.forEach(function(p){ my += p[1]; }); my /= P.length; syy = 0; P.forEach(function(p){ syy += (p[1] - my) * (p[1] - my); }); }
  return { m:m, b:b, res:res, ssr:ssr, sum:sum, syy:syy, r2:syy > 0 ? 1 - ssr / syy : 0 };
}
// "curve opening up": least squares on y = ax² + bx + c with a ≥ 0 (when the best a is negative, the best curve opening up is the line)
function quadUp(P){
  var S = [0, 0, 0, 0, 0], T = [0, 0, 0];
  P.forEach(function(p){ var xk = 1; for (var k = 0; k <= 4; k++) { S[k] += xk; if (k <= 2) T[k] += xk * p[1]; xk *= p[0]; } });
  // unknowns [c, b, a]; normal equations M·v = T
  var M = [[S[0], S[1], S[2], T[0]], [S[1], S[2], S[3], T[1]], [S[2], S[3], S[4], T[2]]], i, j, k;
  for (i = 0; i < 3; i++) {
    var piv = i; for (j = i + 1; j < 3; j++) if (Math.abs(M[j][i]) > Math.abs(M[piv][i])) piv = j;
    var t = M[i]; M[i] = M[piv]; M[piv] = t;
    if (Math.abs(M[i][i]) < 1e-12) return null;
    for (j = 0; j < 3; j++) if (j !== i) { var f = M[j][i] / M[i][i]; for (k = i; k < 4; k++) M[j][k] -= f * M[i][k]; }
  }
  var c = M[0][3] / M[0][0], bb = M[1][3] / M[1][1], a = M[2][3] / M[2][2];
  if (!(a > 1e-12)) { var L = lsq(P); return { a:0, b:L.m, c:L.b, res:L.res, ssr:L.ssr, sum:L.sum, r2:L.r2, flat:true }; }
  var res = P.map(function(p){ return p[1] - (a * p[0] * p[0] + bb * p[0] + c); }), ssr = 0, sum = 0, my = 0, syy = 0;
  res.forEach(function(e){ ssr += e * e; sum += e; });
  P.forEach(function(p){ my += p[1]; }); my /= P.length; P.forEach(function(p){ syy += (p[1] - my) * (p[1] - my); });
  if (ssr < 1e-9) { ssr = 0; res = res.map(function(){ return 0; }); sum = 0; }
  return { a:a, b:bb, c:c, res:res, ssr:ssr, sum:sum, r2:syy > 0 ? 1 - ssr / syy : 0 };
}
function corr(u, v){
  var n = u.length, mu = 0, mv = 0, a = 0, b = 0, c = 0, i;
  for (i = 0; i < n; i++) { mu += u[i]; mv += v[i]; } mu /= n; mv /= n;
  for (i = 0; i < n; i++) { a += (u[i] - mu) * (v[i] - mv); b += (u[i] - mu) * (u[i] - mu); c += (v[i] - mv) * (v[i] - mv); }
  return b > 0 && c > 0 ? a / Math.sqrt(b * c) : 0;
}
// residual pattern (plan readout): no clear pattern · U-shape · ∩-shape · fan (spread grows) · one unusual point
function pattern(P, res){
  var n = res.length, ss = 0, k = 0, i;
  for (i = 0; i < n; i++) { ss += res[i] * res[i]; if (Math.abs(res[i]) > Math.abs(res[k])) k = i; }
  if (Math.sqrt(ss / n) < 1e-6) return "All residuals 0: the model fits every point";
  var rest = ss - res[k] * res[k], rmsO = Math.sqrt(rest / Math.max(1, n - 1));
  if (n >= 5 && Math.abs(res[k]) > 3 * Math.max(rmsO, 1e-9)) return "One unusual point: (" + P[k][0] + ", " + P[k][1] + ") stands out";
  var xs = P.map(function(p){ return p[0]; }), mx = xs.reduce(function(a, b){ return a + b; }, 0) / n;
  var c = corr(res, xs.map(function(x){ return (x - mx) * (x - mx); }));
  if (c > 0.75) return "U-shape: the data curve upward";
  if (c < -0.75) return "∩-shape: the data curve downward";
  if (corr(res.map(Math.abs), xs) > 0.75) return "Fan: the spread grows";
  return "No clear pattern";
}
function lineEq(m, b){ return YH + " = " + (Math.abs(m) < 5e-4 ? "" : dN(m) + I("x")) + (Math.abs(b) < 5e-4 ? (Math.abs(m) < 5e-4 ? "0" : "") : (Math.abs(m) < 5e-4 ? dN(b) : (b < 0 ? " − " : " + ") + dN(Math.abs(b)))); }
function quadEq(q){
  var s = YH + " = " + dN(q.a, 4) + I("x") + "²";
  if (Math.abs(q.b) >= 5e-4) s += (q.b < 0 ? " − " : " + ") + dN(Math.abs(q.b)) + I("x");
  if (Math.abs(q.c) >= 5e-4) s += (q.c < 0 ? " − " : " + ") + dN(Math.abs(q.c));
  return s;
}

// ---------- data sets (all model data) ----------
var DS = {
  A7:{ t:"A7", ctx:"Distance from school (km) vs commute time (min)", xl:"distance (km)", yl:"time (min)", pts:[[1, 8], [2, 16], [3, 17], [4, 24], [5, 25], [6, 32], [7, 32]], ax:20, dx0:10, dy0:46 },
  B:{ t:"B", ctx:"Car speed (km/h) vs braking distance (m)", xl:"speed (km/h)", yl:"distance (m)", pts:[[10, 2], [20, 5], [30, 10], [40, 17], [50, 26]], ax:60, dx0:60, dy0:30 },
  K:{ t:"K", ctx:"Kiosk: daily high (°C) vs iced drinks sold (module 36)", xl:"daily high (°C)", yl:"drinks", pts:[[15, 38], [20, 52], [25, 62], [30, 68], [35, 80]], ax:50, dx0:40, dy0:90 }
};
var DS_ORDER = ["A7", "B", "K"];

// ---------- Explore: Residual inspector ----------
// @component D11 scatterResidual — scatter plot with its least-squares line (or a locked line, or a "curve opening up" fitted by
// the tool) over a linked residual plot that shares its x-axis. Points --pen, line --ink, residual segments and dots --ev-c (orange),
// dashed zero line --ink-2, added point ringed in --hi. Inspect (tap/Tab to a point; drag or arrows move it up and down), Add a point
// (one draggable handle, arrows 1, Shift + arrows 5), Compare models (line vs curve, with SSR and r²).
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (!DS[S.ds]) S.ds = "A7";
    if (["ins", "add", "cmp"].indexOf(S.mode) < 0) S.mode = "ins";
    S.mods = obj(S.mods); S.adds = obj(S.adds);
    DS_ORDER.forEach(function(k){
      var D = DS[k], m = S.mods[k], n = D.pts.length;
      S.mods[k] = Array.isArray(m) && m.length === n ? m.map(function(v, i){ return clampI(v, 0, 150, D.pts[i][1]); }) : null;
      if (S.mods[k] && S.mods[k].every(function(v, i){ return v === D.pts[i][1]; })) S.mods[k] = null;
      var a = obj(S.adds[k]); S.adds[k] = { x:clampI(a.x, 0, D.ax, D.dx0), y:clampI(a.y, 0, 150, D.dy0) };
    });
    S.sel = clampI(S.sel, 0, 9, 0); S.lock = !!S.lock;
    S.lk = S.lk && DS[S.lk.ds] && isFinite(S.lk.m) && isFinite(S.lk.b) ? S.lk : null;
    S.model = S.model === "curve" ? "curve" : "line";
  }
  sanitize();
  var pv = {}, anim = null, cur = null, dragging = false, held = null;
  function save(){ api.save(); }

  host.innerHTML =
    '<div class="rs-top"><div id="rs-ds"></div><div id="rs-mode"></div></div>' +
    '<p class="tiny rs-ctx" id="rs-ctx"></p>' +
    '<div class="pg rs-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap rs-scw"><canvas class="plot rs-sc" id="rs-sc" role="img" aria-label="Scatter plot with the model"></canvas></div>' +
      '<p class="rs-plab" aria-hidden="true">Residual plot</p>' +
      '<div class="plot-wrap"><canvas class="plot rs-rplot" id="rs-rp" role="img" aria-label="Residual plot"></canvas></div></div>' +
    '<div class="pg-ctrl"><div id="rs-ctrl"></div><p class="tiny rs-msg" id="rs-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="rs-read" aria-live="polite"></dl><div id="rs-cmp"></div></div></div>';
  var sc = new MV.Plot($("#rs-sc", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), rp = new MV.Plot($("#rs-rp", host), { xmin:0, xmax:1, ymin:-1, ymax:1 });
  sc.render = function(){ paintSc(); }; rp.render = function(){ paintRp(); };
  var dsR = radios($("#rs-ds", host), { label:"Data set", options:DS_ORDER.map(function(k){ return { id:k, t:DS[k].t, aria:"Data " + DS[k].t + ": " + DS[k].ctx }; }), value:S.ds, cls:"chips",
    onChange:function(v){ user(); S.ds = v; S.sel = 0; save(); build(); render(); MV.changed(); } });
  var modeR = radios($("#rs-mode", host), { label:"Mode", options:[{ id:"ins", t:"Inspect" }, { id:"add", t:"Add a point" }, { id:"cmp", t:"Compare models" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; save(); build(); render(); MV.changed(); } });

  // --- animation bookkeeping: any user action finishes a running prediction reveal ---
  function user(){ if (anim) { var a = anim; anim = null; if (a.stop) a.stop(); pv = {}; a.done(); } }

  // --- the current state ---
  function base(){ var D = DS[S.ds], m = S.mods[S.ds]; return D.pts.map(function(p, i){ return [p[0], m ? m[i] : p[1]]; }); }
  function hasAdd(){ return S.mode === "add" && !pv.noAdd; }
  function calc(){
    var P = base(), a = S.adds[S.ds]; if (hasAdd()) P.push([a.x, a.y]);
    var fit = lsq(P), md;
    if (pv.line) { md = withLine(P, pv.line.m, pv.line.b); md.kind = "line"; md.f = lf(pv.line.m, pv.line.b); md.r = fit.r; }
    else if (S.mode === "cmp" && S.model === "curve") {
      var q = quadUp(P) || { a:0, b:fit.m, c:fit.b, res:fit.res, ssr:fit.ssr, sum:fit.sum, r2:fit.r2, flat:true };
      md = q; md.kind = "curve"; md.f = function(x){ return q.a * x * x + q.b * x + q.c; };
    }
    else if (S.mode === "ins" && S.lock && S.lk && S.lk.ds === S.ds) { md = withLine(P, S.lk.m, S.lk.b); md.kind = "locked"; md.f = lf(S.lk.m, S.lk.b); }
    else { md = fit; md.kind = "line"; md.f = lf(fit.m, fit.b); }
    var res = pv.resT != null ? md.res.map(function(e){ return e * pv.resT; }) : md.res;
    return { P:P, fit:fit, md:md, res:res, nb:base().length, view:viewOf(P) };
  }
  function lf(m, b){ return function(x){ return m * x + b; }; }
  function viewOf(P){
    var D = DS[S.ds], x1 = 0, y1 = 0;
    P.forEach(function(p){ x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    if (S.mode === "add") {
      x1 = D.ax; y1 = Math.max(y1 * 1.1, 60);
      if (dragging && held) y1 = Math.max(y1, held.ymax);
      y1 = Math.ceil(y1 / 30) * 30;
    } else { x1 *= 1.1; y1 *= 1.15; }
    var v = { xmin:-x1 * 0.07, xmax:x1 * 1.04, ymin:-y1 * 0.09, ymax:y1 };
    held = { ymax:y1 };
    return v;
  }

  // --- painting ---
  function paintSc(){
    var c = cur || (cur = calc()), D = DS[S.ds], v = c.view, ink = css("--ink"), pen = css("--pen"), org = css("--ev-c"), hide = pv.hideRes || pv.hideRead;
    var segs = [], pts = [];
    if (!pv.hideRes) c.P.forEach(function(p, i){ var e = c.res[i], yh = p[1] - c.md.res[i]; segs.push({ x1:p[0], y1:yh, x2:p[0], y2:yh + e, color:org, width:2 }); });
    c.P.forEach(function(p, i){ var added = i >= c.nb; pts.push({ x:p[0], y:p[1], r:added ? 6 : 5, color:pen, ring:S.mode === "ins" && i === S.sel && !hide }); });
    var lines = [], labels = [];
    if (S.mode === "add") {
      var mx = c.fit.mx != null ? lsq(base()).mx : 0;
      lines.push({ x1:mx, y1:v.ymin, x2:mx, y2:v.ymax, color:css("--ink-2"), width:1, dash:[4, 5] });
      labels.push({ x:mx, y:v.ymax, text:"x̄ = " + dN(mx, 2), color:css("--ink-2"), dx:6, dy:10, align:"left" });
    }
    var desc = "Scatter plot of " + D.ctx + ", " + c.P.length + " points, with " + (c.md.kind === "curve" ? "the fitted curve " + MV.plain(quadEq(c.md)) : "the line " + MV.plain(lineEq(c.md.m, c.md.b))) + (hasAdd() ? ". Added point at (" + c.P[c.P.length - 1].join(", ") + ")" : "") + ".";
    sc.draw({ view:v, xLabel:D.xl, yLabel:D.yl, describe:desc,
      curves:[{ f:c.md.f, color:ink, width:2.6, domain:[v.xmin, v.xmax] }],
      segments:lines.concat(segs), points:pts, labels:labels,
      after:function(ctx, p){
        if (!hasAdd()) return;
        var q = c.P[c.P.length - 1];
        ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.X(q[0]), p.Y(q[1]), 10, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
      } });
  }
  function paintRp(){
    var c = cur || (cur = calc()), v = c.view, org = css("--ev-c"), mxr = 3;
    c.md.res.forEach(function(e){ mxr = Math.max(mxr, Math.abs(e)); });
    mxr = MV.niceStep(mxr * 1.25 / 2) * 2; if (mxr < Math.max.apply(null, c.md.res.map(Math.abs)) * 1.1) mxr *= 1.5;
    var segs = [], pts = [];
    if (!pv.hideRes) c.P.forEach(function(p, i){ segs.push({ x1:p[0], y1:0, x2:p[0], y2:c.res[i], color:org, width:1.6 }); pts.push({ x:p[0], y:c.res[i], r:4.5, color:org }); });
    rp.draw({ view:{ xmin:v.xmin, xmax:v.xmax, ymin:-mxr, ymax:mxr }, grid:true, yLabel:"residual", segments:segs, points:pts,
      describe:pv.hideRes ? "Residual plot, waiting for your prediction." : "Residual plot: residuals " + c.P.map(function(p, i){ return MV.plain(dN(c.res[i])); }).join(", ") + " against " + DS[S.ds].xl + ". " + pattern(c.P, c.md.res) + ".",
      after:function(ctx, p){
        var y0 = p.Y(0); ctx.save(); ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(p.W, y0); ctx.stroke();
        ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.6; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(p.W, y0); ctx.stroke(); ctx.setLineDash([]);
        if (!pv.hideRes) c.P.forEach(function(q, i){ ctx.fillStyle = org; ctx.beginPath(); ctx.arc(p.X(q[0]), p.Y(c.res[i]), 4.5, 0, 2 * Math.PI); ctx.fill(); });
        ctx.restore();
      } });
  }
  function pointText(c, i){
    var p = c.P[i], e = c.md.res[i], yh = p[1] - e, where = Math.abs(e) < 5e-4 ? "on the line" : e > 0 ? "above the line" : "below the line";
    if (c.md.kind === "curve") where = where.replace("line", "curve");
    return "(" + p[0] + ", " + p[1] + "): predicted " + dN(yh) + ", residual " + sg(e) + " (" + where + ")";
  }
  function paintRead(){
    var c = cur || (cur = calc()), md = c.md, rows = [], hideR = pv.hideRead, hideP = pv.hideRes || pv.hideRead;
    var lab = md.kind === "curve" ? "Curve opening up (fitted by the tool)" : md.kind === "locked" ? "Locked line" : "Least-squares line";
    rows.push([lab, md.kind === "curve" ? quadEq(md) + (md.flat ? ' <span class="muted">(no upward curve beats the line here)</span>' : "") : lineEq(md.m, md.b)]);
    if (S.mode === "ins" && c.P[S.sel]) rows.push(["Selected point", hideP ? "?" : pointText(c, S.sel)]);
    if (hasAdd()) rows.push(["Added point", hideR ? "?" : pointText(c, c.P.length - 1)]);
    rows.push(["Sum of residuals", hideP ? "?" : dN(md.sum) + (md.kind === "locked" && Math.abs(md.sum) >= 5e-4 ? ' <span class="muted">(not 0: the locked line isn’t the least-squares line now)</span>' : "")]);
    rows.push(["SSR", hideR ? "?" : dN(md.ssr)]);
    if (md.kind === "locked") rows.push([I("r") + " and " + R2, '<span class="muted">Turn off the lock to refit the line.</span>']);
    else if (md.kind === "curve") rows.push([R2, hideR ? "?" : dN(md.r2) + ": " + dN(md.r2 * 100, 1) + "% of the variation in " + I("y") + " is explained by the curve"]);
    else rows.push([I("r") + " and " + R2, hideR ? "?" : I("r") + " = " + dN(c.fit.r) + ", " + R2 + " = " + dN(c.fit.r2) + '<br><span class="tiny">' + dN(c.fit.r2 * 100, 1) + "% of the variation in " + I("y") + " is explained by the line</span>"]);
    rows.push(["Residual pattern", hideP ? "?" : pattern(c.P, md.res)]);
    if (hasAdd()) { var o = lsq(base()); rows.push(["Change from the original", hideR ? "?" : "Slope " + dN(o.m) + " → " + mi(md.m.toFixed(2)) + "; " + R2 + " " + dN(o.r2) + " → " + dN(c.fit.r2)]); }
    $("#rs-read", host).innerHTML = MV.readoutHTML(rows);
    var cm = $("#rs-cmp", host);
    if (S.mode === "cmp") {
      var P = c.P, L = lsq(P), q = quadUp(P) || { ssr:L.ssr, r2:L.r2 };
      cm.innerHTML = MV.tableHTML({ head:["Model", "SSR", R2], caption:"Compare models", rows:[["Line", dN(L.ssr), dN(L.r2)], ["Curve opening up", dN(q.ssr), dN(q.r2)]], hiRow:S.model === "curve" ? 1 : 0 });
    } else cm.innerHTML = "";
    $("#rs-ctx", host).innerHTML = "Data " + DS[S.ds].t + ": " + DS[S.ds].ctx + ' <span class="mdm-model">Model data</span>';
  }
  function render(){ cur = calc(); paintSc(); paintRp(); paintRead(); syncCtrl(); }

  // --- controls ---
  function build(){
    var h = "";
    if (S.mode === "ins") h = '<p class="tiny">Tap a point, or Tab to it, to see its prediction and residual. Drag it up or down (or use the arrow keys) to move it.</p>' +
      '<div class="rs-sws">' + swHTML("rs-lock", "Lock the line", S.lock && S.lk && S.lk.ds === S.ds) + "</div>";
    else if (S.mode === "add") {
      var D = DS[S.ds], a = S.adds[S.ds];
      h = '<p class="tiny">Drag the ringed point, use the arrow keys (Shift for 5), or set it here.</p>' +
        '<label class="slider"><span class="slider-top"><span>Added point ' + I("x") + '</span><output id="rs-axo">' + a.x + '</output></span><input type="range" id="rs-ax" min="0" max="' + D.ax + '" step="1" value="' + a.x + '"></label>' +
        '<label class="slider"><span class="slider-top"><span>Added point ' + I("y") + '</span><output id="rs-ayo">' + a.y + '</output></span><input type="range" id="rs-ay" min="0" max="150" step="1" value="' + a.y + '"></label>';
    } else h = '<div id="rs-model"></div><p class="tiny">The curve is fitted by the tool (least squares on ' + I("y") + " = " + I("a") + I("x") + "² + " + I("b") + I("x") + " + " + I("c") + ", with " + I("a") + " ≥ 0).</p>";
    h += '<div class="q-actions"><button type="button" class="btn sm ghost" id="rs-reset" data-k="rsreset" hidden>Reset data</button></div>';
    var box = $("#rs-ctrl", host);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    if (S.mode === "cmp") radios($("#rs-model", host), { label:"Model", options:[{ id:"line", t:"Line" }, { id:"curve", t:"Curve opening up" }], value:S.model, cls:"seg",
      onChange:function(v){ user(); S.model = v; save(); render(); MV.changed(); } });
  }
  function syncCtrl(){
    var rb = $("#rs-reset", host); if (rb) rb.hidden = !S.mods[S.ds] || S.mode === "cmp";
    var a = S.adds[S.ds], ax = $("#rs-ax", host), ay = $("#rs-ay", host);
    if (ax && +ax.value !== a.x) ax.value = a.x; if (ay && +ay.value !== a.y) ay.value = a.y;
    var xo = $("#rs-axo", host), yo = $("#rs-ayo", host); if (xo) xo.textContent = a.x; if (yo) yo.textContent = a.y;
    if (ax) ax.setAttribute("aria-valuetext", "x = " + a.x); if (ay) ay.setAttribute("aria-valuetext", "y = " + a.y);
    var lk = $("#rs-lock", host); if (lk) lk.setAttribute("aria-checked", String(!!(S.lock && S.lk && S.lk.ds === S.ds)));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "rs-lock") {
      user(); var on = !(S.lock && S.lk && S.lk.ds === S.ds);
      if (on) { var f = lsq(base()); S.lk = { ds:S.ds, m:f.m, b:f.b }; S.lock = true; } else { S.lock = false; S.lk = null; }
      save(); render(); MV.changed();
      $("#rs-msg", host).textContent = on ? "Line locked. Drag a point: the line stays put and only the residuals change." : "Line unlocked: it refits to the data.";
    }
    if (b.id === "rs-reset") { user(); S.mods[S.ds] = null; if (S.lk && S.lk.ds === S.ds) { S.lock = false; S.lk = null; } save(); render(); MV.changed(); $("#rs-msg", host).textContent = "Data reset to the original model data."; }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (t.id !== "rs-ax" && t.id !== "rs-ay") return;
    user(); var a = S.adds[S.ds]; if (t.id === "rs-ax") a.x = +t.value; else a.y = +t.value;
    save(); render(); MV.changed();
  });
  // handles: data points in Inspect mode (up/down only), the added point in Add mode
  MV.drag(sc, {
    handles:function(){
      var c = cur || (cur = calc());
      if (S.mode === "ins" && !pv.hideRes) return c.P.map(function(p, i){ return { id:"p" + i, x:p[0], y:p[1], label:"Point " + pointText(c, i) + ". Up and down arrows move it." }; });
      if (hasAdd() && !pv.hideRead) { var q = c.P[c.P.length - 1]; return [{ id:"add", x:q[0], y:q[1], label:"Added point " + pointText(c, c.P.length - 1) + ". Arrow keys move it 1, Shift + arrows 5." }]; }
      return [];
    },
    step:{ x:1, y:1 }, big:5, axis:"xy",
    key:function(id, e){ return id !== "add" && (e.key === "ArrowLeft" || e.key === "ArrowRight"); },
    move:function(id, x, y, how){
      user();
      if (how === "drag") dragging = true;
      if (id === "add") { var D = DS[S.ds], a = S.adds[S.ds]; a.x = clampI(x, 0, D.ax, a.x); a.y = clampI(y, 0, 150, a.y); if (dragging && a.y > held.ymax * 0.95) held.ymax = a.y + 30; }
      else {
        var i = +id.slice(1), m = S.mods[S.ds] || DS[S.ds].pts.map(function(p){ return p[1]; });
        m = m.slice(); m[i] = clampI(y, 0, 150, m[i]); S.mods[S.ds] = m; S.sel = i;
        if (m.every(function(v, k){ return v === DS[S.ds].pts[k][1]; })) S.mods[S.ds] = null;
      }
      save(); render(); MV.changed();
    },
    end:function(){ dragging = false; render(); }
  });
  $(".rs-scw", host).addEventListener("focusin", function(e){
    var b = e.target.closest(".drag-h"); if (!b || S.mode !== "ins" || b.dataset.h === "add") return;
    var i = +b.dataset.h.slice(1); if (i !== S.sel) { S.sel = i; save(); render(); }
  });
  build(); render();

  // --- predictions ---
  function startPred(p){
    user();
    var st = p.start || {};
    S.ds = st.ds; S.mode = st.mode; S.mods[S.ds] = null; S.lock = false; S.lk = null; S.sel = 0;
    if (st.mode === "add") { S.adds[S.ds] = { x:st.x, y:st.y }; var o = lsq(base()); pv = { line:{ m:o.m, b:o.b }, hideRead:true }; }
    else pv = { hideRes:true };
    dsR.set(S.ds); modeR.set(S.mode); save(); build(); render();
  }
  function runPred(p, done){
    anim = { done:done, stop:null };
    var me = anim;
    function fin(){ if (anim !== me) return; anim = null; pv = {}; render(); MV.changed(); done(); }
    if (S.mode === "add") {
      var o = pv.line, a = S.adds[S.ds], n = lsq(base().concat([[a.x, a.y]]));
      me.stop = MV.tween({ dur:1500, step:function(t){ if (anim !== me) return; pv.line = { m:o.m + (n.m - o.m) * t, b:o.b + (n.b - o.b) * t }; render(); }, done:function(){ MV.wait(250, fin); } });
    } else {
      pv = { resT:0, hideRead:false }; render();
      me.stop = MV.tween({ dur:1300, step:function(t){ if (anim !== me) return; pv.resT = t; render(); }, done:function(){ MV.wait(250, fin); } });
    }
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:m }; };
    if (id === "tc1") {
      if (S.ds !== "B") return R("Choose data <strong>B</strong> (braking).");
      if (S.mode !== "cmp") return R("Switch to <strong>Compare models</strong>.");
      if (S.mods.B) return R("Reset the data first: the challenge uses the original data B.");
      if (S.model !== "curve") return R("The residuals still smile.");
      var q = quadUp(base());
      return q && q.res.every(function(e){ return Math.abs(e) < 1e-6; }) ? { ok:true } : R("The residuals still smile.");
    }
    if (id === "tc2" || id === "tc3") {
      if (S.ds !== "A7") return R("Choose data <strong>A7</strong>.");
      if (S.mode !== "add") return R("Switch to <strong>Add a point</strong>.");
      if (S.mods.A7) return R("Reset the data first: the challenge uses the original data A7.");
      var a = S.adds.A7, f = lsq(base().concat([[a.x, a.y]])), dm = Math.abs(f.m - 4);
      if (id === "tc2") {
        if (a.x > 10 || a.y > 60) return R("Keep the added point’s " + I("x") + " from 0 to 10 and " + I("y") + " from 0 to 60.");
        if (dm <= 0.1 + 1e-9 && f.r2 < 0.8) return { ok:true };
        if (a.x === 8 && a.y === 60) return R("The slope jumped to about 5.8. A point away from " + XB + " tilts the line.");
        if (a.x === 4 && a.y === 20) return R("Slope unchanged, but " + R2 + " is still above 0.8: move it further from the line.");
        if (dm > 0.1 + 1e-9) return R("The slope changed to about " + dN(f.m, 2) + ". A point away from " + XB + " tilts the line.");
        return R("Slope unchanged, but " + R2 + " = " + dN(f.r2) + " is still 0.8 or more: move it further from the line.");
      }
      if (a.x !== 20) return R("Put the added point at " + I("x") + " = 20.");
      var e = a.y - (f.m * 20 + f.b);
      if (dm > 1 && Math.abs(e) < 5) return { ok:true };
      if (a.y === 86) return R("On the old line: the slope doesn’t change.");
      if (dm <= 1) return R("The slope changes by only about " + dN(dm, 1) + ": go further from 86.");
      return R("The slope changes a lot, but the point is so far out that even the dragged line can’t reach it: residual 5 or more.");
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: braking data, residual segments, the fold into a U-shaped residual plot ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:-5, xmax:58, ymin:-17, ymax:31 }), aria = cv.getAttribute("aria-label") || "";
  var P = [[10, 2], [20, 5], [30, 10], [40, 17], [50, 26]], M = 0.6, B = -6, BASE = -10.5, K = 2.3, st = { seg:0, fold:0, cap:false };
  function L(a, b, t){ return a + (b - a) * t; }
  plot.render = function(){
    plot.draw({ view:{ xmin:-5, xmax:58, ymin:-17, ymax:31 }, grid:false, axes:false, describe:aria, after:function(ctx, p){
      var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), org = css("--ev-c"), ax = css("--plot-axis");
      ctx.save(); ctx.lineCap = "round";
      ctx.strokeStyle = ax; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.X(0), p.Y(30)); ctx.lineTo(p.X(0), p.Y(0)); ctx.lineTo(p.X(56), p.Y(0)); ctx.stroke();
      ctx.fillStyle = ink2; ctx.font = "12px " + p.fontUI; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText("speed (km/h)", p.X(56), p.Y(0) - 3);
      ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("braking distance (m)", p.X(0) + 6, p.Y(30));
      ctx.strokeStyle = ink; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(p.X(8), p.Y(M * 8 + B)); ctx.lineTo(p.X(54), p.Y(M * 54 + B)); ctx.stroke();
      if (st.seg > 0) { ctx.globalAlpha = st.seg; ctx.strokeStyle = org; ctx.lineWidth = 2.4; P.forEach(function(q){ ctx.beginPath(); ctx.moveTo(p.X(q[0]), p.Y(q[1])); ctx.lineTo(p.X(q[0]), p.Y(M * q[0] + B)); ctx.stroke(); }); ctx.globalAlpha = 1; }
      ctx.fillStyle = pen; P.forEach(function(q){ ctx.beginPath(); ctx.arc(p.X(q[0]), p.Y(q[1]), 5.5, 0, 2 * Math.PI); ctx.fill(); });
      if (st.fold > 0) {
        var t = st.fold, ly = function(x){ return L(M * x + B, BASE, t); };
        ctx.strokeStyle = t >= 1 ? ink2 : ink; ctx.lineWidth = t >= 1 ? 1.6 : 2.2; ctx.setLineDash(t >= 1 ? [7, 5] : []);
        ctx.beginPath(); ctx.moveTo(p.X(8), p.Y(ly(8))); ctx.lineTo(p.X(54), p.Y(ly(54))); ctx.stroke(); ctx.setLineDash([]);
        P.forEach(function(q, i){
          var e = q[1] - (M * q[0] + B), y0 = ly(q[0]), yd = L(q[1], BASE + K * e, t);
          ctx.strokeStyle = org; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(p.X(q[0]), p.Y(y0)); ctx.lineTo(p.X(q[0]), p.Y(yd)); ctx.stroke();
          ctx.fillStyle = org; ctx.beginPath(); ctx.arc(p.X(q[0]), p.Y(yd), 5, 0, 2 * Math.PI); ctx.fill();
          if (t >= 1) { ctx.fillStyle = ink2; ctx.font = "12px " + p.fontUI; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(mi(sg(e, 0)), p.X(q[0]) + 8, p.Y(yd)); }
        });
        if (t >= 1) { ctx.fillStyle = ink2; ctx.font = "12px " + p.fontUI; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("residual plot", p.X(0), p.Y(BASE + 6)); }
      }
      if (st.cap) { ctx.fillStyle = ink; ctx.font = "700 16px " + p.fontUI; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText("r² = 0.96, but the residuals smile.", p.W - 10, 8); }
      ctx.restore();
    } });
  };
  var cap = f.cap;
  function last(){ st = { seg:1, fold:1, cap:true }; plot.render(); cap.textContent = "r² = 0.96, but the residuals smile: +2, −1, −2, −1, +2 trace a U."; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "Braking data with its least-squares line";
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  MV.wait(700, function(){
    cap.textContent = "Residual segments drop from each point to the line";
    tw(900, function(t){ st.seg = t; plot.render(); }, function(){
      MV.wait(800, function(){
        cap.textContent = "The plot folds: the line flattens into the zero line of a residual plot";
        tw(1600, function(t){ st.fold = t; plot.render(); }, function(){ MV.wait(400, last); });
      });
    });
  });
}

// ---------- small SVG plots (Part 3) ----------
function resSVG(res, label){
  var W = 220, H = 96, pad = 14, mx = Math.max.apply(null, [4].concat(res.map(Math.abs))), n = res.length;
  function X(i){ return pad + (W - 2 * pad) * (n === 1 ? 0.5 : i / (n - 1)); } function Y(v){ return H / 2 - (H / 2 - 10) * v / mx; }
  return '<svg class="rs-mini" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + MV.esc(label) + '"><line class="rs-zero" x1="4" y1="' + H / 2 + '" x2="' + (W - 4) + '" y2="' + H / 2 + '"/>' +
    res.map(function(v, i){ return '<line class="rs-seg" x1="' + X(i).toFixed(1) + '" y1="' + H / 2 + '" x2="' + X(i).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/><circle class="rs-dot" cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="4.5"/>'; }).join("") + "</svg>";
}
function scatSVG(o){
  var W = 300, H = 170, pl = 30, pr = 8, pt = 8, pb = 22, xr = o.xr, yr = o.yr;
  function X(x){ return pl + (W - pl - pr) * (x - xr[0]) / (xr[1] - xr[0]); } function Y(y){ return H - pb - (H - pt - pb) * (y - yr[0]) / (yr[1] - yr[0]); }
  var h = '<line class="rs-ax" x1="' + pl + '" y1="' + Y(yr[0]) + '" x2="' + (W - pr) + '" y2="' + Y(yr[0]) + '"/><line class="rs-ax" x1="' + pl + '" y1="' + pt + '" x2="' + pl + '" y2="' + Y(yr[0]) + '"/>';
  (o.xt || []).forEach(function(t){ h += '<text class="rs-tk" x="' + X(t).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + t + "</text>"; });
  (o.yt || []).forEach(function(t){ h += '<text class="rs-tk" x="' + (pl - 4) + '" y="' + (Y(t) + 4).toFixed(1) + '" text-anchor="end">' + t + "</text>"; });
  (o.lines || []).forEach(function(l){ var a = l.x || xr; h += '<line class="' + (l.cls || "rs-ln") + '" x1="' + X(a[0]).toFixed(1) + '" y1="' + Y(l.m * a[0] + l.b).toFixed(1) + '" x2="' + X(a[1]).toFixed(1) + '" y2="' + Y(l.m * a[1] + l.b).toFixed(1) + '"/>'; });
  if (o.curve) { var d = ""; for (var k = 0; k <= 40; k++) { var x = xr[0] + (xr[1] - xr[0]) * k / 40; d += (k ? "L" : "M") + X(x).toFixed(1) + " " + Y(o.curve(x)).toFixed(1); } h += '<path class="rs-cv" d="' + d + '"/>'; }
  o.pts.forEach(function(p, i){ h += '<circle class="' + (o.hi === i ? "rs-pt rs-pthi" : "rs-pt") + '" cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="' + (o.hi === i ? 5.5 : 4.5) + '"/>'; });
  return '<svg class="rs-scat" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + MV.esc(o.aria) + '">' + h + "</svg>";
}

// ---------- N4 number entry (with an optional choice row) ----------
// @component N4 numEntry (adapted from MDM4U 19's N4 moneyEntry): accepts signs, $, %, fractions and decimals; tol is absolute
// (default 1e-6); named wrong answers {match, fb}; optional choice row (pick:[{t, ok, why}], read with MV.ok) that must also be right;
// optional unit after the box; first try = right on the first check without the worked solution.
function neParse(raw){
  var s = String(raw == null ? "" : raw).replace(/[$%]/g, "").replace(/[\s  ]/g, "").replace(/,(?=\d{3}\b)/g, "").replace(/^\+/, "");
  if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null;
}
function neJudge(it, raw, pick){
  var v = neParse(raw), ans = MV.ans(it), tol = it.tol || 1e-6 * Math.max(1, Math.abs(ans));
  if (it.pick && pick == null) return { bad:"Choose an answer for “" + MV.plain(it.pickLabel || "the choice") + "” as well." };
  if (v == null) return { bad:"Enter a number, such as 30, −1.5 or 0.91." };
  var numOk = Math.abs(v - ans) <= tol, pickOk = !it.pick || MV.ok(it.pick[pick]);
  if (numOk && pickOk) return { ok:true };
  var fb = [];
  if (!pickOk) fb.push(it.pick[pick].why || "Check your choice.");
  if (!numOk) { var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) <= Math.max(1e-6, Math.min(tol, 1e-3)); })[0]; fb.push(w ? w.fb : it.general || "Check your work."); }
  return { ok:false, fb:fb.join(" ") };
}
function numEntry(host, api, a){
  var st = api.S; st.items = obj(st.items);
  var msgs = {};
  function ist(id){ var x = st.items[id] = obj(st.items[id]); x.val = typeof x.val === "string" ? x.val : ""; x.tries = x.tries || 0; x.hint = x.hint || 0; return x; }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-ne="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="numrow"><label for="ne-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="ne-' + it.id + '" data-nein="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? "<span>" + it.unit + "</span>" : "") + "</div>";
        if (it.pick) h += '<div class="rs-pick" role="radiogroup" aria-label="' + MV.esc(MV.plain(it.pickLabel || "Choose")) + '"><span class="rg-lab">' + (it.pickLabel || "Choose:") + "</span>" + it.pick.map(function(o, k){
          return '<button type="button" role="radio" class="rs-pk" aria-checked="' + (x.pick === k) + '" data-pk="' + k + '" data-k="' + it.id + "pk" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nein; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nein) { var b = host.querySelector('[data-k="' + e.target.dataset.nein + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ne]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.ne; })[0], x = ist(it.id);
    if (b.dataset.pk != null) { x.pick = +b.dataset.pk; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = neJudge(it, x.val, x.pick);
      if (r.bad) { msgs[it.id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-ne="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ne="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Part 3: Is linear right? (three stations) ----------
var SAV = (function(){ var p = []; for (var t = 0; t <= 10; t++) p.push([t, Math.round(1000 * Math.pow(1.13, t))]); return p; })();   // model data: $1000 at 13% a year
var KIOSK = [[15, 38], [20, 52], [25, 62], [30, 68], [35, 80]], HOT = [45, 60];
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.items = obj(S.items);
  var msgs = {};
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function ist(id){ var x = S.items[id] = obj(S.items[id]); x.val = typeof x.val === "string" ? x.val : ""; x.tries = x.tries || 0; return x; }
  function done(s){ return s.items.every(function(it){ return ist(it.id).solved; }); }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.title + (done(s) ? ' <span class="rs-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="lr-tabs" class="rs-tabs"></div><div id="lr-body"></div>';
  tabText();
  var tabsR = radios($("#lr-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });

  var savFit = lsq(SAV), kNo = lsq(KIOSK), kYes = lsq(KIOSK.concat([HOT]));
  function itemHTML(it){
    var x = ist(it.id), h = '<div class="rs-item" data-lr="' + it.id + '">';
    if (it.choices) {
      h += '<p class="rs-ilab">' + it.label + '</p><div class="rs-bins" role="group" aria-label="' + MV.esc(MV.plain(it.label)) + '">' + it.choices.map(function(c){
        return '<button type="button" class="btn ghost sm" data-ch="' + c.id + '" data-k="lr' + it.id + c.id + '"' + (x.solved ? " disabled" : "") + (x.solved && MV.ans(it) === c.id ? ' aria-pressed="true"' : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    } else {
      h += '<div class="numrow"><label for="lr-' + it.id + '">' + it.label + '</label><input class="numin" id="lr-' + it.id + '" data-lrin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" +
        (x.solved ? "" : '<button type="button" class="btn primary sm" data-lrchk="' + it.id + '" data-k="lr' + it.id + 'chk">Check</button>') + "</div>";
    }
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    return h + "</div>";
  }
  function dataHTML(s){ return done(s) ? '<details class="alg"><summary>Check it with data</summary><p>' + s.data + "</p></details>" : ""; }
  function s1HTML(s){
    var q = quadUp(DS.B.pts), L = lsq(DS.B.pts);
    return '<p class="rs-text">' + s.text + ' <span class="mdm-model">model data</span></p>' +
      '<div class="rs-two"><figure class="rs-fig"><figcaption>Line ' + lineEq(L.m, L.b) + "</figcaption>" + resSVG(L.res, "Residual plot for the line: +2, −1, −2, −1, +2, a U-shape") + "</figure>" +
      '<figure class="rs-fig"><figcaption>Curve ' + quadEq(q) + "</figcaption>" + resSVG(q.res, "Residual plot for the curve: all residuals 0") + "</figure></div>" +
      MV.tableHTML({ head:["Model", "SSR", R2, "Residuals"], caption:"Braking: line vs curve", rows:[["Line", dN(L.ssr), dN(L.r2), "U-shaped"], ["Curve " + I("y") + " = 0.01" + I("x") + "² + 1", "0", "1", "all 0"]] }) +
      s.items.map(itemHTML).join("") + dataHTML(s);
  }
  function s2HTML(s){
    var x = ist("s2a"), h = '<p class="rs-text">' + s.text + ' <span class="mdm-model">model data</span></p>' +
      MV.tableHTML({ head:["Year"].concat(SAV.map(function(p){ return String(p[0]); })), rows:[["Balance ($)"].concat(SAV.map(function(p){ return MV.mdm.fmt(p[1]); }))], caption:"Account balance at the end of each year" }) +
      '<div class="rs-two"><figure class="rs-fig"><figcaption>Line ' + lineEq(+savFit.m.toFixed(1), +savFit.b.toFixed(1)) + ", " + R2 + " = " + dN(savFit.r2, 2) + "</figcaption>" +
        scatSVG({ pts:SAV, xr:[0, 10], yr:[0, 3600], xt:[0, 5, 10], yt:[0, 1000, 2000, 3000], lines:[{ m:savFit.m, b:savFit.b }], aria:"Balance against year: the points curve upward away from the straight line." }) + "</figure>" +
      '<figure class="rs-fig"><figcaption>Residuals of the line</figcaption>' + resSVG(savFit.res.map(function(e){ return Math.round(e); }), "Residual plot for the savings line: positive at both ends, negative in the middle, a U-shape") + "</figure></div>";
    h += s.items.map(itemHTML).join("");
    if (x.solved) h += '<p class="rs-after">The growth model gives 1000 × 1.13<sup>15</sup> ≈ $' + MV.mdm.fmt(Math.round(1000 * Math.pow(1.13, 15))) + ". The line’s prediction is about $" + MV.mdm.fmt(Math.round(1000 * Math.pow(1.13, 15) - (savFit.m * 15 + savFit.b))) + " too low: it under-predicts late years, as the U in its residuals warned.</p>";
    return h + dataHTML(s);
  }
  function s3HTML(s){
    var P = KIOSK.concat([HOT]);
    return '<p class="rs-text">' + s.text + ' <span class="mdm-model">model data</span></p>' +
      '<div class="rs-one">' + scatSVG({ pts:P, hi:5, xr:[10, 50], yr:[0, 100], xt:[10, 20, 30, 40, 50], yt:[0, 50, 100], lines:[{ m:kNo.m, b:kNo.b, cls:"rs-ln2" }, { m:kYes.m, b:kYes.b }],
        aria:"Kiosk data with the 45 degree day at (45, 60), far right and low. The dashed line without that day is steeper than the solid line with it." }) +
      '<p class="tiny"><span class="rs-key rs-key2"></span> without the 45 °C day · <span class="rs-key"></span> with it</p></div>' +
      MV.tableHTML({ head:["Fit", "Slope", I("r"), R2], caption:"Kiosk fit with and without the 45 °C day", rows:[["Without the 45 °C day", dN(kNo.m, 1), dN(kNo.r, 2), dN(kNo.r2, 2)], ["With it", dN(kYes.m, 2), dN(kYes.r, 2), dN(kYes.r2, 2)]] }) +
      s.items.map(itemHTML).join("") + dataHTML(s);
  }
  function paint(){
    tabText(); tabsR.refresh();
    var s = st(S.cur), body = $("#lr-body", host), inner = s.id === "s1" ? s1HTML(s) : s.id === "s2" ? s2HTML(s) : s3HTML(s);
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="rs-card0"><span class="rs-lab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + "</span>" + inner + "</div>"; });
  }
  function item(id){ var L = []; ST.forEach(function(s){ L = L.concat(s.items); }); return L.filter(function(z){ return z.id === id; })[0]; }
  function checkNum(id){
    var it = item(id), x = ist(id), r = neJudge(it, x.val);
    if (r.bad) { msgs[id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-lr="' + id + '"]')); return; }
    if (r.ok) { x.solved = true; x.first = x.tries === 0; msgs[id] = null; } else { x.tries++; msgs[id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-lr="' + id + '"]'));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.lrchk) { checkNum(b.dataset.lrchk); return; }
    if (b.dataset.ch) {
      var id = b.closest("[data-lr]").dataset.lr, it = item(id), x = ist(id);
      if (MV.ans(it) === b.dataset.ch) { x.solved = true; x.first = x.tries === 0; msgs[id] = null; }
      else { x.tries++; msgs[id] = "<strong>✗ Not quite.</strong> " + ((it.wrongs && it.wrongs[b.dataset.ch]) || it.wrong || "Try again."); }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-lr="' + id + '"]'));
    }
  });
  host.addEventListener("input", function(e){ var t = e.target; if (t.dataset.lrin) { ist(t.dataset.lrin).val = t.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lrin) { e.preventDefault(); checkNum(e.target.dataset.lrin); } });
  paint();
  return {};
}

// ---------- Performance task: Hidden curve ----------
var task = (function(){
  var api = null, sc = null, rp = null, XS = [1, 2, 3, 4, 5];
  function st(){ var s = api ? api.S : {}; if (!Array.isArray(s.y) || s.y.length !== 5) s.y = [0, 6, 12, 18, 24]; s.y = s.y.map(function(v){ return clampI(v, 0, 30, 0); }); return s; }
  function read(){ return { y:st().y.slice() }; }
  function key(d){ return d.y.join(","); }
  function lab(k){ return "(" + k.split(",").join(", ") + ")"; }
  function pts(d){ return XS.map(function(x, i){ return [x, d.y[i]]; }); }
  function paint(){
    var d = read(), P = pts(d), f = lsq(P), el = $("#hc-read"); if (!el) return;
    el.innerHTML = MV.readoutHTML([["Least-squares line", lineEq(f.m, f.b)], ["Residuals", f.res.map(function(e){ return sg(e, 2); }).join(", ")], [R2, dN(f.r2)], ["Residual pattern", pattern(P, f.res)]]);
    if (sc) sc.render(); if (rp) rp.render();
  }
  function drawSc(){
    var d = read(), P = pts(d), f = lsq(P);
    sc.draw({ view:{ xmin:-0.4, xmax:5.6, ymin:-3, ymax:32 }, xLabel:"speed (tens of km/h)", yLabel:"distance (m)", yTicks:{ step:6 },
      curves:[{ f:function(x){ return 6 * x - 6; }, color:css("--ink-2"), width:1.6, dash:[6, 6], domain:[0.5, 5.5] }, { f:function(x){ return f.m * x + f.b; }, color:css("--ink"), width:2.6, domain:[0.5, 5.5] }],
      segments:P.map(function(p, i){ return { x1:p[0], y1:p[1] - f.res[i], x2:p[0], y2:p[1], color:css("--ev-c"), width:2 }; }),
      points:P.map(function(p){ return { x:p[0], y:p[1], r:5, color:css("--pen") }; }),
      describe:"Your five points with their least-squares line " + MV.plain(lineEq(f.m, f.b)) + " and the target line y = 6x − 6, dashed." });
  }
  function drawRp(){
    var d = read(), P = pts(d), f = lsq(P), mx = 4; f.res.forEach(function(e){ mx = Math.max(mx, Math.ceil(Math.abs(e) + 1)); });
    rp.draw({ view:{ xmin:-0.4, xmax:5.6, ymin:-mx, ymax:mx }, yLabel:"residual",
      segments:P.map(function(p, i){ return { x1:p[0], y1:0, x2:p[0], y2:f.res[i], color:css("--ev-c"), width:1.6 }; }),
      points:P.map(function(p, i){ return { x:p[0], y:f.res[i], r:4.5, color:css("--ev-c") }; }),
      describe:"Residual plot: " + f.res.map(function(e){ return MV.plain(sg(e, 2)); }).join(", ") + ". " + pattern(P, f.res) + ".",
      after:function(ctx, p){ var y0 = p.Y(0); ctx.save(); ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(p.W, y0); ctx.stroke(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.6; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(p.W, y0); ctx.stroke(); ctx.restore(); } });
  }
  function setY(i, v){ var s = st(); s.y[i] = clampI(v, 0, 30, s.y[i]); api.save(); var inp = $("#hc-y" + i); if (inp && +inp.value !== s.y[i]) inp.value = s.y[i]; paint(); api.update(); }
  return {
    render:function(inp, pvw, a){
      api = a; var s = st();
      inp.innerHTML = '<div class="rs-hc-in">' + XS.map(function(x, i){
        return '<div class="numrow rs-hc-row"><label for="hc-y' + i + '">' + I("y") + " at " + I("x") + " = " + x + '</label><button type="button" class="btn sm ghost" data-hc="' + i + '" data-d="-1" data-k="hcm' + i + '" aria-label="Decrease y at x = ' + x + '">−</button>' +
          '<input class="numin" id="hc-y' + i + '" data-hci="' + i + '" type="number" min="0" max="30" step="1" inputmode="numeric" value="' + s.y[i] + '">' +
          '<button type="button" class="btn sm ghost" data-hc="' + i + '" data-d="1" data-k="hcp' + i + '" aria-label="Increase y at x = ' + x + '">+</button></div>'; }).join("") + "</div>";
      pvw.innerHTML = '<div class="rs-hc-pv"><div class="plot-wrap"><canvas class="plot" id="hc-sc" role="img" aria-label="Your data"></canvas></div><p class="rs-plab" aria-hidden="true">Residual plot</p>' +
        '<div class="plot-wrap"><canvas class="plot rs-rplot" id="hc-rp" role="img" aria-label="Residual plot"></canvas></div><dl class="read" id="hc-read" aria-live="polite"></dl></div>';
      sc = new MV.Plot($("#hc-sc"), { xmin:0, xmax:1, ymin:0, ymax:1 }); sc.render = drawSc;
      rp = new MV.Plot($("#hc-rp"), { xmin:0, xmax:1, ymin:-1, ymax:1 }); rp.render = drawRp;
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-hc]"); if (!b) return; var i = +b.dataset.hc; setY(i, st().y[i] + +b.dataset.d); });
      inp.addEventListener("input", function(e){ var t = e.target; if (t.dataset.hci == null || t.value === "") return; setY(+t.dataset.hci, +t.value); });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var y = d.y, sum = 0, w = 0; y.forEach(function(v, i){ sum += v; w += (XS[i] - 3) * v; });
      var e = y.map(function(v, i){ return v - (6 * XS[i] - 6); }), f = lsq(pts(d));
      return [sum === 60 && w === 60, e[0] > 0 && e[4] > 0 && e[1] < 0 && e[2] < 0 && e[3] < 0, e.every(function(v){ return Math.abs(v) <= 3; }), f.r2 >= 0.9 - 1e-12];
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
  activities:{ reason:numEntry },
  task:task
});
})();
