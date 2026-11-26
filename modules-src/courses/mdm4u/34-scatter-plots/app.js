// MDM4U 34 Scatter Plots & Correlation: hero (a table of eight (hours, mark) pairs flies onto a scatter plot; a strength
// meter swings to strong), Pattern spotter (Explore: D11 scatter tool with data sets D1–D4 and a Custom grid, swap axes,
// draggable points, y-stretch, strength meter with r, form check, outlier flags, Describe it), Match the story (Part 3:
// six stories to six plots, sentence builder, the lurking question), Read the plot (practice, N8 tap a point) and the
// "Practice makes fewer mistakes" task. All data are model data; nothing is random.
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function M(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
function dN(v, dp){ dp = dp == null ? 2 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
function rTxt(r){ var s = (Math.round(r * 100) / 100).toFixed(2); if (s === "-0.00") s = "0.00"; return mi(s); }
function ptTxt(p){ return "(" + dN(p[0], 2) + ", " + dN(p[1], 2) + ")"; }
function niceStep(r){ var p = Math.pow(10, Math.floor(Math.log10(r))), m = r / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
function rnd(v, st){ var k = Math.round(v / st) * st; return Math.round(k * 1000) / 1000; }

// @component radioGroup (copied from MDM4U 19 / 18) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t, aria}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh, setOptions}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) || ids.indexOf(val) < 0 ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + MV.esc(id) + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[aria-checked="true"]') || host.querySelector('[tabindex="0"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
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

// ---------- statistics: r, least-squares line, quadratic R² (form check), outliers ----------
// fit(P) -> {n, r (null when undefined), a, b (line y = a + bx), quad (quadratic R²), qc:[c0, c1, c2] in u = x − mx, mx}
function fit(P){
  var n = P.length, o = { n:n, r:null, a:0, b:0, quad:0, qc:null, mx:0 };
  if (n < 2) return o;
  var mx = 0, my = 0; P.forEach(function(p){ mx += p[0]; my += p[1]; }); mx /= n; my /= n; o.mx = mx;
  var sxx = 0, syy = 0, sxy = 0; P.forEach(function(p){ sxx += (p[0] - mx) * (p[0] - mx); syy += (p[1] - my) * (p[1] - my); sxy += (p[0] - mx) * (p[1] - my); });
  if (sxx > 1e-12) { o.b = sxy / sxx; o.a = my - o.b * mx; } else o.a = my;
  if (sxx > 1e-12 && syy > 1e-12) o.r = clamp(sxy / Math.sqrt(sxx * syy), -1, 1);
  if (o.r == null) return o;
  o.quad = o.r * o.r;
  if (n >= 3) {
    var S = [0, 0, 0, 0, 0], T = [0, 0, 0];
    P.forEach(function(p){ var u = p[0] - mx, uk = 1; for (var k = 0; k < 5; k++) { S[k] += uk; if (k < 3) T[k] += uk * p[1]; uk *= u; } });
    var A = [[S[0], S[1], S[2], T[0]], [S[1], S[2], S[3], T[1]], [S[2], S[3], S[4], T[2]]], ok = true;
    for (var i = 0; i < 3 && ok; i++) {
      var pv = i; for (var j = i + 1; j < 3; j++) if (Math.abs(A[j][i]) > Math.abs(A[pv][i])) pv = j;
      var tmp = A[i]; A[i] = A[pv]; A[pv] = tmp;
      if (Math.abs(A[i][i]) < 1e-9 * Math.max(1, Math.abs(S[4]))) { ok = false; break; }
      for (j = 0; j < 3; j++) { if (j === i) continue; var f = A[j][i] / A[i][i]; for (var k2 = i; k2 < 4; k2++) A[j][k2] -= f * A[i][k2]; }
    }
    if (ok) {
      var c = [A[0][3] / A[0][0], A[1][3] / A[1][1], A[2][3] / A[2][2]], sse = 0;
      P.forEach(function(p){ var u = p[0] - mx, e = p[1] - (c[0] + c[1] * u + c[2] * u * u); sse += e * e; });
      o.quad = Math.max(o.quad, 1 - sse / syy); o.qc = c;
    }
  }
  return o;
}
function qAt(f, x){ var u = x - f.mx; return f.qc[0] + f.qc[1] * u + f.qc[2] * u * u; }
function r2d(v){ return Math.round(Math.abs(v) * 100) / 100; }
function strengthOf(a){ return a >= 0.67 ? "strong" : a >= 0.33 ? "moderate" : "weak"; }
// a point is a possible outlier when it sits more than 4 residual SDs (and 10% of the vertical range) from the line
// through the other points (leave-one-out); skipped for curved data and fewer than 5 points
function outliers(P, ySpan){
  var out = []; if (P.length < 5) return out;
  P.forEach(function(p, i){
    var O = P.filter(function(_, j){ return j !== i; }), f = fit(O), sse = 0;
    O.forEach(function(q){ var e = q[1] - f.a - f.b * q[0]; sse += e * e; });
    var sd = Math.sqrt(sse / (O.length - 2)), res = p[1] - f.a - f.b * p[0];
    if (Math.abs(res) > 4 * sd && Math.abs(res) > 0.1 * ySpan) out.push(i);
  });
  return out;
}
// the tool's reading of a scatter plot (course plan §2 thresholds: strong |r| ≥ 0.67, moderate 0.33–0.67, weak < 0.33)
function reading(P, ySpan){
  var f = fit(P);
  if (f.n < 3 || f.r == null) return { f:f, none:true, out:[] };
  var a = r2d(f.r), curved = f.n >= 5 && f.quad >= 0.8 && f.quad - f.r * f.r >= 0.3;
  return { f:f, r:f.r, a:a, meter:strengthOf(a), curved:curved,
    dir:f.r >= 0 && a >= 0.33 ? "positive" : f.r < 0 && a >= 0.33 ? "negative" : "none",
    form:curved ? "curved" : a >= 0.33 ? "linear" : "none",
    str:curved ? strengthOf(r2d(Math.sqrt(f.quad))) : strengthOf(a),
    out:curved ? [] : outliers(P, ySpan || 1) };
}
function formText(R){
  if (R.none) return "—";
  if (R.form === "curved") return "a curve fits much better than a line";
  if (R.form === "none") return "neither a line nor a curve fits well";
  return R.a >= 0.67 ? "a straight line fits well" : "a line fits, but loosely";
}

// @component D11 scatterPlot — a scatter plot drawn on a pixel-view Plot (so the axes and tick labels sit on the frame,
// not at x = 0): grid --plot-grid, frame --plot-axis, dots --pen with a --sheet edge, outlier rings --hi, selection ring
// --ink, optional fitted line / curve (--ink) and a sweep arrow. drawScatter(plot, {pts, view:{x0, x1, y0, y1}, xLab, yLab,
// flags:[i], sel, curve:{f(x), t}, arrow:{a, b, t}, title, small, describe}); geometry in plot._sc = {X, Y, xOf, yOf, W, H, L, R, T, B}
function drawScatter(plot, o){
  var rc = plot.c.getBoundingClientRect(), W0 = Math.max(160, rc.width), H0 = Math.max(120, rc.height);
  plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, sm = o.small || W < 380, L = sm ? 40 : 50, R = 14, T = o.yLab || o.title ? 24 : 12, B = sm ? 36 : 42, v = o.view;
    var X = function(x){ return L + (x - v.x0) / (v.x1 - v.x0) * (W - L - R); }, Y = function(y){ return H - B - (y - v.y0) / (v.y1 - v.y0) * (H - B - T); };
    var grid = css("--plot-grid"), axis = css("--plot-axis"), ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), sheet = css("--sheet"), hi = css("--hi");
    var xs = niceStep((v.x1 - v.x0) / (sm ? 4 : 6)), ys = niceStep((v.y1 - v.y0) / (sm ? 4 : 5)), g;
    ctx.save();
    ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath();
    for (g = Math.ceil(v.x0 / xs - 1e-9) * xs; g <= v.x1 + 1e-9; g += xs) { var gx = Math.round(X(g)) + 0.5; ctx.moveTo(gx, T); ctx.lineTo(gx, H - B); }
    for (g = Math.ceil(v.y0 / ys - 1e-9) * ys; g <= v.y1 + 1e-9; g += ys) { var gy = Math.round(Y(g)) + 0.5; ctx.moveTo(L, gy); ctx.lineTo(W - R, gy); }
    ctx.stroke();
    ctx.strokeStyle = axis; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(L, T - 4); ctx.lineTo(L, H - B); ctx.lineTo(W - R + 4, H - B); ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = (sm ? 11 : 12) + "px " + p.fontUI;
    var dpx = xs >= 1 ? 0 : xs >= 0.1 ? 1 : 2, dpy = ys >= 1 ? 0 : ys >= 0.1 ? 1 : 2, lastR = -1e9;
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (g = Math.ceil(v.x0 / xs - 1e-9) * xs; g <= v.x1 + 1e-9; g += xs) { var lx = X(g), lt = mi((Math.round(g * 1e6) / 1e6).toFixed(dpx)), lw = ctx.measureText(lt).width; if (lx - lw / 2 < lastR + 4) continue; ctx.fillText(lt, lx, H - B + 4); lastR = lx + lw / 2; }
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (g = Math.ceil(v.y0 / ys - 1e-9) * ys; g <= v.y1 + 1e-9; g += ys) { var ly = Y(g); if (ly < T - 2) continue; ctx.fillText(mi((Math.round(g * 1e6) / 1e6).toFixed(dpy)), L - 5, ly); }
    ctx.font = "italic " + (sm ? 12 : 13) + "px " + p.fontUI;
    if (o.xLab) { ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(o.xLab, W - R, H - 2); }
    if (o.yLab) { ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yLab, 4, 4); }
    if (o.title) { ctx.font = "700 " + (sm ? 12 : 13) + "px " + p.fontUI; ctx.fillStyle = ink; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(o.title, W - R, 4); }
    ctx.save(); ctx.beginPath(); ctx.rect(L + 1, T - 10, W - L - R + 10, H - B - T + 10); ctx.clip();
    if (o.curve && o.curve.t > 0) {
      ctx.strokeStyle = ink; ctx.lineWidth = 2.6; ctx.beginPath();
      var xe = v.x0 + (v.x1 - v.x0) * o.curve.t;
      for (var k = 0; k <= 120; k++) { var cx = v.x0 + (xe - v.x0) * k / 120, cy = Y(o.curve.f(cx)); if (k) ctx.lineTo(X(cx), cy); else ctx.moveTo(X(cx), cy); }
      ctx.stroke();
    }
    if (o.arrow && o.arrow.t > 0) {
      var a0 = v.x0 + 0.12 * (v.x1 - v.x0), a1 = a0 + (v.x1 - v.x0) * 0.76 * o.arrow.t, p0 = [X(a0), Y(o.arrow.a + o.arrow.b * a0)], p1 = [X(a1), Y(o.arrow.a + o.arrow.b * a1)];
      ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
      var ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]); ctx.beginPath(); ctx.moveTo(p1[0] + 4 * Math.cos(ang), p1[1] + 4 * Math.sin(ang));
      ctx.lineTo(p1[0] - 13 * Math.cos(ang - 0.42), p1[1] - 13 * Math.sin(ang - 0.42)); ctx.lineTo(p1[0] - 13 * Math.cos(ang + 0.42), p1[1] - 13 * Math.sin(ang + 0.42)); ctx.closePath(); ctx.fill();
    }
    var rad = sm ? 4.6 : 5.6;
    (o.pts || []).forEach(function(q, i){
      var px = X(q[0]), py = Y(q[1]);
      if ((o.flags || []).indexOf(i) >= 0) { ctx.strokeStyle = hi; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.arc(px, py, rad + 6, 0, Math.PI * 2); ctx.stroke(); }
      if (o.sel === i) { ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, rad + 3, 0, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = pen; ctx.strokeStyle = sheet; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    ctx.restore(); ctx.restore();
    plot._sc = { X:X, Y:Y, W:W, H:H, L:L, R:R, T:T, B:B, xOf:function(px){ return v.x0 + (px - L) / (W - L - R) * (v.x1 - v.x0); }, yOf:function(py){ return v.y0 + (H - B - py) / (H - B - T) * (v.y1 - v.y0); } };
  } });
}

// @component D11 strengthMeter — horizontal gauge "weak · moderate · strong" (0–0.33–0.67–1 of |r|) with an --ink needle
// and "r = …" in small print; the needle eases by CSS (jumps with reduced motion). m = makeMeter(host); m.set(r | null, hide)
function makeMeter(host){
  host.innerHTML = '<div class="sp-meter" role="img" aria-label="Strength meter"><div class="sp-mbar" aria-hidden="true"><span class="sp-ms sp-ms1">weak</span><span class="sp-ms sp-ms2">moderate</span><span class="sp-ms sp-ms3">strong</span><i class="sp-needle"></i></div><p class="sp-mread"></p></div>';
  var root = host.firstChild, nd = $(".sp-needle", host), rd = $(".sp-mread", host);
  if (MV.reduceMotion) root.classList.add("sp-rm");
  return { set:function(r, hide){
    if (r == null) { nd.hidden = true; rd.innerHTML = '<span class="muted">No reading yet: the meter needs at least 3 points that aren’t all in a vertical or horizontal line.</span>'; root.setAttribute("aria-label", "Strength meter: no reading"); return; }
    var a = r2d(r), lab = strengthOf(a);
    nd.hidden = !!hide; nd.style.left = (a * 100).toFixed(1) + "%";
    rd.innerHTML = hide ? "Strength meter: <strong>?</strong>" : "Strength meter: <strong>" + lab + '</strong> <span class="tiny muted">(' + M("r") + " = " + rTxt(r) + ")</span>";
    root.setAttribute("aria-label", hide ? "Strength meter: hidden until the reveal" : "Strength meter reads " + lab + ", r = " + rTxt(r));
  } };
}

// ---------- model data sets (plan: D1–D4, Custom) ----------
var DS = {
  d1:{ t:"D1 Study time", aria:"D1: hours studied vs test mark", x:"hours studied", xu:"hours studied (h)", y:"test mark", yu:"test mark (%)",
    pts:[[0.5, 50], [1, 58], [1.5, 55], [2, 64], [2.5, 66], [3, 72], [3.5, 70], [4, 80]], v:{ x0:0, x1:4.5, y0:40, y1:90 }, st:{ x:0.5, y:1 } },
  d2:{ t:"D2 Hot chocolate", aria:"D2: outdoor temperature vs cups of hot chocolate sold", x:"outdoor temperature", xu:"temperature (°C)", y:"cups of hot chocolate sold", yu:"cups sold",
    pts:[[-10, 48], [-5, 44], [0, 40], [5, 30], [10, 26], [15, 18], [20, 12], [25, 10]], v:{ x0:-15, x1:30, y0:0, y1:55 }, st:{ x:1, y:1 } },
  d3:{ t:"D3 Shoe size", aria:"D3: shoe size vs math mark", x:"shoe size", xu:"shoe size", y:"math mark", yu:"math mark (%)",
    pts:[[6, 72], [7, 60], [7.5, 85], [8, 66], [9, 78], [9.5, 58], [10, 74], [11, 64]], v:{ x0:5, x1:12, y0:50, y1:95 }, st:{ x:0.5, y:1 } },
  d4:{ t:"D4 Fuel use", aria:"D4: driving speed vs fuel use", x:"driving speed", xu:"speed (km/h)", y:"fuel use", yu:"fuel use (L/100 km)",
    pts:[[40, 8.0], [50, 6.8], [60, 6.1], [70, 5.8], [80, 6.1], [90, 6.8], [100, 8.0]], v:{ x0:30, x1:110, y0:5, y1:9 }, st:{ x:5, y:0.1 } },
  custom:{ t:"Custom", aria:"Custom: an empty 0 to 10 grid", x:"x", xu:"x", y:"y", yu:"y", pts:[], v:{ x0:0, x1:10, y0:0, y1:10 }, st:{ x:0.5, y:0.5 } }
};
var DS_ORDER = ["d1", "d2", "d3", "d4", "custom"], MAXC = 10;
function copyPts(P){ return P.map(function(p){ return [p[0], p[1]]; }); }

// ---------- Explore: Pattern spotter ----------
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (!DS[S.ds]) S.ds = "d1";
    S.pts = obj(S.pts); S.swap = obj(S.swap); S.desc = obj(S.desc);
    DS_ORDER.forEach(function(k){
      var D = DS[k], a = S.pts[k], good = Array.isArray(a) && (k === "custom" ? a.length <= MAXC : a.length === D.pts.length) && a.every(function(p){
        return Array.isArray(p) && p.length === 2 && isFinite(p[0]) && isFinite(p[1]) && p[0] >= D.v.x0 - 1e-9 && p[0] <= D.v.x1 + 1e-9 && p[1] >= D.v.y0 - 1e-9 && p[1] <= D.v.y1 + 1e-9; });
      if (!good) S.pts[k] = copyPts(D.pts);
      S.swap[k] = !!S.swap[k];
    });
    S.zoom = clamp(Math.round((+S.zoom || 1) * 4) / 4, 0.5, 3);
    ["dir", "form", "str"].forEach(function(k){ if (typeof S.desc[k] !== "string") S.desc[k] = ""; });
  }
  sanitize();
  var pv = { hide:[] }, busy = false, msg = "", dfb = "", sel = null;
  var L = MV.pgLayout(host, { shape:"", aria:"Scatter plot" });
  L.canvas.classList.add("sp-plot");
  var mbox = document.createElement("div"); mbox.className = "sp-mbox"; L.graph.appendChild(mbox);
  var note = document.createElement("p"); note.className = "tiny muted sp-note";
  note.innerHTML = "The meter reads strong for |" + M("r") + "| ≥ 0.67, moderate for 0.33–0.67 and weak for < 0.33. Module 35 explains " + M("r") + ".";
  L.graph.appendChild(note);
  var meter = makeMeter(mbox);
  L.ctrl.innerHTML = '<div class="sp-panel"><div id="sp-ds"></div>' +
    '<div class="q-actions sp-acts"><button type="button" class="btn ghost sm" id="sp-swap" data-k="spswap">Swap axes</button><button type="button" class="btn ghost sm" id="sp-reset" data-k="spreset">Reset points</button>' +
    '<button type="button" class="btn ghost sm" id="sp-add" data-k="spadd">Add a point</button><button type="button" class="btn ghost sm" id="sp-del" data-k="spdel">Remove last point</button><button type="button" class="btn ghost sm" id="sp-clr" data-k="spclr">Clear</button></div>' +
    '<label class="slider sp-zoom"><span class="slider-top"><span>Stretch the <i>y</i>-axis</span><output id="sp-zo"></output></span><input type="range" id="sp-z" min="0.5" max="3" step="0.25" data-k="spz"></label>' +
    '<p class="tiny muted sp-how">Drag a point, or tab to it and use the arrow keys (Shift: bigger steps). On the Custom grid, tap an empty spot to add a point (up to 10); Delete removes the focused point.</p>' +
    '<p class="tiny sp-msg" id="sp-msg" aria-live="polite"></p></div>' +
    '<div class="sp-panel"><p class="sp-sh">Describe it</p><div id="sp-dd"></div><div id="sp-df"></div><div id="sp-dst"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="sp-chk" data-k="spchk">Check my description</button></div><div id="sp-dfb" aria-live="polite"></div></div>';
  var plot = new MV.Plot(L.canvas, { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintPlot;
  var dsR = radios($("#sp-ds", host), { label:"Data set", options:DS_ORDER.map(function(k){ return { id:k, t:DS[k].t, aria:DS[k].aria }; }), value:S.ds, cls:"chips",
    disabled:function(){ return busy; },
    onChange:function(v){ S.ds = v; sel = null; msg = ""; dfb = ""; pv.hide = []; save(); render(); MV.changed(); } });
  function descR(id, lab, opts, key){
    return radios($("#" + id, host), { label:lab, options:opts.map(function(q){ return { id:q[0], t:q[1] }; }), value:S.desc[key], cls:"chips",
      onChange:function(v){ S.desc[key] = v; dfb = ""; save(); paintDesc(); } });
  }
  var dirR = descR("sp-dd", "Direction", [["positive", "positive"], ["negative", "negative"], ["none", "none"]], "dir");
  var formR = descR("sp-df", "Form", [["linear", "linear"], ["curved", "curved"], ["none", "no pattern"]], "form");
  var strR = descR("sp-dst", "Strength", [["strong", "strong"], ["moderate", "moderate"], ["weak", "weak"]], "str");

  function save(){ api.save(); }
  function D(){ return DS[S.ds]; }
  function sw(){ return !!S.swap[S.ds]; }
  function disp(){ var P = S.pts[S.ds]; return sw() ? P.map(function(p){ return [p[1], p[0]]; }) : copyPts(P); }
  function baseView(){ var v = D().v; return sw() ? { x0:v.y0, x1:v.y1, y0:v.x0, y1:v.x1 } : { x0:v.x0, x1:v.x1, y0:v.y0, y1:v.y1 }; }
  function steps(){ var s = D().st; return sw() ? { x:s.y, y:s.x } : { x:s.x, y:s.y }; }
  function names(){ var d = D(); return sw() ? { x:d.y, xu:d.yu, y:d.x, yu:d.xu } : { x:d.x, xu:d.xu, y:d.y, yu:d.yu }; }
  // stretching the y-axis by z: above ×1 the x-axis widens instead (so every point stays on screen); below ×1 the y-axis widens
  function view(){
    var v = baseView(), z = pv.zoom != null ? pv.zoom : S.zoom, cx = (v.x0 + v.x1) / 2, cy = (v.y0 + v.y1) / 2, hx = (v.x1 - v.x0) / 2, hy = (v.y1 - v.y0) / 2;
    return z >= 1 ? { x0:cx - hx * z, x1:cx + hx * z, y0:v.y0, y1:v.y1 } : { x0:v.x0, x1:v.x1, y0:cy - hy / z, y1:cy + hy / z };
  }
  function hidden(k){ return pv.hide.indexOf(k) >= 0; }
  function cur(){ var bv = baseView(); return reading(disp(), bv.y1 - bv.y0); }
  // write a displayed (x, y) back into the data set, clamped to its grid and snapped to its steps
  function setPt(i, x, y){
    var bv = baseView(), st = steps(); x = rnd(clamp(x, bv.x0, bv.x1), st.x); y = rnd(clamp(y, bv.y0, bv.y1), st.y);
    S.pts[S.ds][i] = sw() ? [y, x] : [x, y];
  }

  function render(){
    sanitize();
    dsR.set(S.ds);
    var c = S.ds === "custom", n = S.pts[S.ds].length;
    $("#sp-add", host).hidden = $("#sp-del", host).hidden = $("#sp-clr", host).hidden = !c; $("#sp-reset", host).hidden = c;
    $("#sp-add", host).disabled = busy || n >= MAXC; $("#sp-del", host).disabled = $("#sp-clr", host).disabled = busy || !n;
    $("#sp-swap", host).disabled = $("#sp-reset", host).disabled = $("#sp-chk", host).disabled = busy;
    var z = pv.zoom != null ? pv.zoom : S.zoom, zi = $("#sp-z", host);
    if (document.activeElement !== zi || pv.zoom != null) zi.value = String(z);
    zi.disabled = busy; zi.setAttribute("aria-valuetext", "times " + dN(z, 2));
    $("#sp-zo", host).textContent = "×" + dN(z, 2);
    paintPlot(); paintRead(); paintDesc();
    $("#sp-msg", host).innerHTML = msg;
  }
  function paintPlot(){
    var R = cur(), nm = names(), P = disp(), hideAll = hidden("form");
    var desc = "Scatter plot of " + nm.y + " against " + nm.x + " with " + P.length + " point" + (P.length === 1 ? "" : "s") + (P.length ? ": " + P.map(ptTxt).join(", ") : "") + ". " +
      (R.none ? "" : (hidden("r") ? "" : "The strength meter reads " + R.meter + ", r = " + rTxt(R.r) + ". ") + (hideAll ? "" : "Form check: " + formText(R) + ". ") + (R.out.length && !hideAll ? "Possible outlier: " + R.out.map(function(i){ return ptTxt(P[i]); }).join(", ") + "." : ""));
    drawScatter(plot, { pts:P, view:view(), xLab:nm.xu, yLab:nm.yu, flags:hideAll ? [] : R.out, sel:sel,
      curve:pv.curve != null && R.f.qc ? { f:function(x){ return qAt(R.f, x); }, t:pv.curve } : null,
      arrow:pv.arrow != null ? { a:R.f.a, b:R.f.b, t:pv.arrow } : null, describe:desc });
    meter.set(R.none ? null : R.r, hidden("r"));
  }
  function paintRead(){
    var R = cur(), nm = names(), P = disp(), Q = '<span class="sp-q">?</span>';
    L.cap.innerHTML = (S.ds === "custom" ? "Custom grid" : D().t.split(" ")[0] + ": " + nm.x + " vs " + nm.y) + ' <span class="mdm-model">' + (S.ds === "custom" ? "your data" : "model data") + "</span>";
    var rows = [[M("n"), String(P.length)], [M("x") + ": / " + M("y") + ":", nm.x + " / " + nm.y]];
    if (R.none) rows.push(["Reading", '<span class="muted">Add at least 3 points (not all in one vertical or horizontal line).</span>']);
    else {
      rows.push(["Direction", hidden("dir") ? Q : R.dir === "none" ? "none" : "<strong>" + R.dir + "</strong>"]);
      rows.push(["Strength meter", hidden("r") ? Q : "<strong>" + R.meter + "</strong> (" + M("r") + " = " + rTxt(R.r) + ")"]);
      rows.push(["Form check", hidden("form") ? Q : "“" + formText(R) + "”"]);
      rows.push(["Possible outliers", hidden("form") ? Q : R.out.length ? R.out.map(function(i){ return ptTxt(P[i]); }).join(", ") : "none"]);
    }
    MV.keepFocus(L.read, function(){ L.read.innerHTML = MV.readoutHTML(rows); });
  }
  function paintDesc(){ dirR.set(S.desc.dir); formR.set(S.desc.form); strR.set(S.desc.str); $("#sp-dfb", host).innerHTML = dfb; }

  // --- Describe it: compare the chips with the tool's reading ---
  var DW = { positive:"positive", negative:"negative", none:"none", linear:"linear", curved:"curved", strong:"strong", moderate:"moderate", weak:"weak" };
  function checkDesc(){
    var R = cur(), d = S.desc;
    if (R.none) { dfb = MV.fbHTML("bad", "<strong>✗ Not yet.</strong> Add at least 3 points first."); paintDesc(); return; }
    if (!d.dir || !d.form || !d.str) { dfb = MV.fbHTML("bad", "<strong>✗ Not yet.</strong> Choose a direction, a form and a strength first."); paintDesc(); return; }
    var bad = [], rank = { weak:0, moderate:1, strong:2 };
    if (d.dir !== R.dir) bad.push("<strong>Direction:</strong> " + (R.dir === "none" ? (R.curved ? "this pattern rises and falls, so it has no single direction." : "|" + M("r") + "| is under 0.33, so there’s no clear direction.") :
      d.dir === "none" ? (R.dir === "negative" ? "Negative describes direction. It can be just as strong as positive." : "The points rise from left to right: positive.") :
      R.dir === "negative" ? "The points fall from left to right: negative." : "The points rise from left to right: positive."));
    if (d.form !== R.form) bad.push("<strong>Form:</strong> " + (R.form === "curved" ? (d.form === "none" ? "A tight curve is a strong relationship; it just isn’t linear." : "A curve fits much better than a line here.") :
      R.form === "linear" ? (d.form === "curved" ? "A straight line fits about as well as a curve here: linear." : "There’s a clear straight-line trend: linear.") : "Neither a line nor a curve fits well: no pattern."));
    if (d.str !== R.str) bad.push("<strong>Strength:</strong> " + (R.curved ? "The meter reads " + R.meter + " because it only measures straight-line patterns, but these points hug a curve: a tight curve is a strong relationship; it just isn’t linear." :
      rank[d.str] > rank[R.str] ? "The points are more spread out than that around the pattern. Strength is how closely the points hug the pattern, not how steep it is." :
      "The points hug the pattern more tightly than that." + (R.dir === "negative" ? " Negative describes direction. It can be just as strong as positive." : "")));
    dfb = bad.length ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + bad.join(" ")) :
      MV.fbHTML("good", "<strong>✓ Matches the tool’s reading:</strong> " + [R.dir === "none" ? "no direction" : R.dir, R.form === "none" ? "no pattern" : R.form, R.str].join(" · ") + "." + (R.curved && R.meter !== R.str ? " The meter reads " + R.meter + " only because it measures straight-line patterns." : ""));
    paintDesc(); MV.focusFb($("#sp-dfb", host).parentNode);
  }

  // --- dragging and keyboard ---
  var drag = MV.drag(plot, { axis:"xy", step:{ x:1, y:1 },
    handles:function(){
      var g = plot._sc; if (!g || busy) return [];
      var P = disp(), nm = names();
      return P.map(function(q, i){ return { id:"p" + i, x:g.X(q[0]), y:g.H - g.Y(q[1]), label:"Point " + (i + 1) + ": " + nm.x + " " + dN(q[0], 2) + ", " + nm.y + " " + dN(q[1], 2) + ". Arrow keys move it" + (S.ds === "custom" ? "; Delete removes it." : ".") }; });
    },
    key:function(id, e){
      var i = +id.slice(1), st = steps(), m = e.shiftKey ? 4 : 1, P = disp(); if (busy || !P[i]) return true;
      if ((e.key === "Delete" || e.key === "Backspace") && S.ds === "custom") { removePt(i); return true; }
      var dx = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0, dy = e.key === "ArrowDown" ? -1 : e.key === "ArrowUp" ? 1 : 0;
      if (!dx && !dy) return false;
      sel = i; setPt(i, P[i][0] + dx * st.x * m, P[i][1] + dy * st.y * m); after(); return true;
    },
    move:function(id, x, y, how){
      if (how !== "drag" || busy) return;
      var g = plot._sc; if (!g) return;
      var i = +id.slice(1); if (!S.pts[S.ds][i]) return;
      var before = JSON.stringify(S.pts[S.ds][i]); sel = i;
      setPt(i, g.xOf(x), g.yOf(g.H - y));
      if (JSON.stringify(S.pts[S.ds][i]) !== before) after();
    } });
  function after(){ dfb = ""; msg = ""; save(); render(); MV.changed(); }
  function removePt(i){ S.pts.custom.splice(i, 1); sel = null; after(); var n = S.pts.custom.length; if (n) drag.focus("p" + Math.min(i, n - 1)); else $("#sp-add", host).focus(); }
  function addPt(x, y){
    if (S.pts.custom.length >= MAXC) { msg = "The Custom grid holds up to 10 points."; render(); return -1; }
    S.pts.custom.push([0, 0]); var i = S.pts.custom.length - 1; setPt(i, x, y); sel = i; after(); return i;
  }
  // tap an empty spot on the Custom grid to add a point there
  plot.c.addEventListener("click", function(e){
    if (S.ds !== "custom" || busy) return;
    var g = plot._sc; if (!g) return;
    var r = plot.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    if (px < g.L - 4 || px > g.W - g.R + 4 || py < g.T - 4 || py > g.H - g.B + 4) return;
    if (disp().some(function(q){ return Math.hypot(g.X(q[0]) - px, g.Y(q[1]) - py) < 22; })) return;
    var bv = baseView(), x = g.xOf(px), y = g.yOf(py);
    if (x < bv.x0 - 1e-9 || x > bv.x1 + 1e-9 || y < bv.y0 - 1e-9 || y > bv.y1 + 1e-9) { msg = "Add points inside the 0–10 grid."; render(); return; }
    addPt(x, y);
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || b.closest(".rg") || b.classList.contains("drag-h")) return;
    if (b.id === "sp-swap") { S.swap[S.ds] = !S.swap[S.ds]; sel = null; after(); return; }
    if (b.id === "sp-reset") { S.pts[S.ds] = copyPts(D().pts); sel = null; after(); return; }
    if (b.id === "sp-chk") { checkDesc(); return; }
    if (b.id === "sp-clr") { S.pts.custom = []; sel = null; after(); return; }
    if (b.id === "sp-del") { S.pts.custom.pop(); sel = null; after(); return; }
    if (b.id === "sp-add") {
      var bv = baseView(), cx = (bv.x0 + bv.x1) / 2, cy = (bv.y0 + bv.y1) / 2, P = disp(), k = 0, x = cx, y = cy;
      while (k < 40 && P.some(function(q){ return Math.abs(q[0] - x) < 1e-9 && Math.abs(q[1] - y) < 1e-9; })) { k++; x = cx + ((k % 5) - 2) * 1; y = cy + (Math.floor(k / 5) % 5 - 2) * 1; }
      var i = addPt(x, y); if (i >= 0) { msg = "Point added at " + ptTxt(disp()[i]) + ". Use the arrow keys to move it."; $("#sp-msg", host).innerHTML = msg; drag.focus("p" + i); }
    }
  });
  host.addEventListener("input", function(e){
    if (e.target.id !== "sp-z" || busy) return;
    S.zoom = clamp(+e.target.value, 0.5, 3); save(); render(); MV.changed();
  });
  // challenge set-up buttons (in the challenge prompts)
  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest("[data-sp-setup]"); if (!b || busy) return;
    var k = b.dataset.spSetup; pv = { hide:[] }; sel = null; dfb = ""; S.zoom = 1;
    if (k === "tc1") { S.ds = "d2"; S.swap.d2 = true; msg = "Set up: D2 with the axes swapped."; }
    else if (k === "tc2") { S.ds = "d3"; S.swap.d3 = false; S.pts.d3 = copyPts(DS.d3.pts); msg = "Set up: D3 with its original points."; }
    else if (k === "tc3") { S.ds = "custom"; S.swap.custom = false; S.pts.custom = []; msg = "Set up: an empty Custom grid. Tap the grid (or press Add a point) to place points."; }
    save(); render(); MV.changed();
  });

  render();

  // --- predictions ---
  function setBusy(b){ busy = b; dsR.refresh(); render(); }
  function startPred(p){
    var st = p.start || {};
    S.ds = st.ds || "d1"; S.pts[S.ds] = copyPts(DS[S.ds].pts); S.swap[S.ds] = false; S.zoom = 1;
    pv = { hide:(st.hide || []).slice() }; sel = null; msg = ""; dfb = "";
    save(); render(); MV.changed();
  }
  function runPred(p, done){
    setBusy(true);
    var fin = function(){ pv.arrow = pv.curve = pv.zoom = null; pv.hide = []; setBusy(false); MV.changed(); done(); };
    if (p.id === "p1") {
      pv.arrow = 0;
      MV.tween({ dur:1300, step:function(t){ pv.arrow = t; paintPlot(); }, done:function(){ pv.hide = []; render(); MV.wait(900, fin); } });
    } else if (p.id === "p2") {
      var i = 7; sel = i;
      MV.wait(300, function(){
        MV.tween({ dur:1500, step:function(t){ S.pts.d1[i] = [4, Math.round(80 - 30 * t)]; render(); }, done:function(){ S.pts.d1[i] = [4, 50]; save(); render(); MV.wait(400, fin); } });
      });
    } else if (p.id === "p3") {
      MV.tween({ dur:1500, step:function(t){ pv.zoom = 1 + 2 * t; render(); }, done:function(){ S.zoom = 3; pv.zoom = null; save(); render(); MV.wait(400, fin); } });
    } else {
      pv.curve = 0;
      MV.tween({ dur:1500, step:function(t){ pv.curve = t; paintPlot(); }, done:function(){ pv.hide = []; render(); MV.wait(1200, fin); } });
    }
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:m }; };
    if (id === "tc1") {
      if (S.ds !== "d2") return R("Choose <strong>D2 Hot chocolate</strong> first.");
      if (S.swap.d2) return R("Sales respond to the temperature, not the other way round.");
      return { ok:true };
    }
    if (id === "tc2") {
      if (S.ds !== "d3") return R("Choose <strong>D3 Shoe size</strong> and drag its points.");
      var P = S.pts.d3, f = fit(P);
      if (f.r == null) return R("The points need some spread in both directions.");
      if (r2d(f.r) >= 0.67 && f.r < 0) return { ok:true };
      if (f.r > 0) return R("Make <i>y</i> fall as <i>x</i> rises. (" + M("r") + " = " + rTxt(f.r) + ")");
      for (var i = 0; i < P.length; i++) { var g = fit(P.filter(function(_, j){ return j !== i; })); if (g.r != null && g.r < 0 && r2d(g.r) >= 0.67) return R("One stray point is holding the strength down: " + ptTxt(P[i]) + ". (" + M("r") + " = " + rTxt(f.r) + ")"); }
      return R(M("r") + " = " + rTxt(f.r) + ": not strong yet. Line all 8 points up closer to one falling line.");
    }
    if (id === "tc3") {
      if (S.ds !== "custom") return R("Use the <strong>Custom</strong> grid.");
      var C = disp(), n = C.length;
      if (n !== 6) return R("Place exactly 6 points (you have " + n + ").");
      var q = fit(C);
      if (q.r == null) return R("Spread the points out: they can’t all sit in one vertical or horizontal line.");
      var small = r2d(q.r) < 0.33, curve = q.quad >= 0.9;
      if (small && curve) return { ok:true };
      if (small) return R("|" + M("r") + "| is small, but there’s no clear curve either.");
      if (curve) return R("Half a U still slopes one way, so " + M("r") + " is strong. Use both sides. (" + M("r") + " = " + rTxt(q.r) + ")");
      return R(M("r") + " = " + rTxt(q.r) + ": the points still slope one way, and they don’t hug a curve. Try a U shape.");
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: a table of eight (hours, mark) pairs flies onto a scatter plot; the meter swings to strong ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "", P = DS.d1.pts;
  var st = { rows:0, fly:0, needle:0, cap:"" };
  function ease(t){ return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  plot.render = function(){
    var r = plot.c.getBoundingClientRect(), W0 = Math.max(200, r.width), H0 = Math.max(120, r.height);
    plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false, describe:aria, after:function(ctx, p){
      var W = p.W, H = p.H, sm = W < 520, fs = sm ? 10 : 13, tw = W * (sm ? 0.27 : 0.25), rh = (H - 20) / 9.5;
      var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), sheet = css("--sheet"), rule = css("--rule"), grid = css("--plot-grid"), axis = css("--plot-axis"), hiS = css("--hi-soft");
      // the plot frame
      var L = tw + (sm ? 30 : 46), R = 12, T = 14, Bm = sm ? 58 : 74, B = H - Bm;
      var X = function(x){ return L + x / 4.5 * (W - L - R); }, Y = function(y){ return B - (y - 40) / 50 * (B - T); };
      ctx.save();
      ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath();
      for (var gx = 0; gx <= 4; gx++) { ctx.moveTo(X(gx), T); ctx.lineTo(X(gx), B); }
      for (var gy = 40; gy <= 90; gy += 10) { ctx.moveTo(L, Y(gy)); ctx.lineTo(W - R, Y(gy)); }
      ctx.stroke();
      ctx.strokeStyle = axis; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(W - R, B); ctx.stroke();
      ctx.fillStyle = ink2; ctx.font = fs + "px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (gx = 0; gx <= 4; gx++) ctx.fillText(String(gx), X(gx), B + 3);
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (gy = 40; gy <= 90; gy += 10) ctx.fillText(String(gy), L - 4, Y(gy));
      ctx.font = "italic " + fs + "px " + p.fontUI; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText("hours studied", W - R, B + fs + 6);
      ctx.textAlign = "left"; ctx.fillText("mark (%)", L + 4, T);
      // the table
      var dx = (1 - ease(st.rows)) * -tw; ctx.globalAlpha = clamp(st.rows * 1.4, 0, 1);
      ctx.fillStyle = ink; ctx.font = "700 " + fs + "px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      var c1 = 8 + tw * 0.28 + dx, c2 = 8 + tw * 0.72 + dx;
      ctx.fillText("hours", c1, 10 + rh / 2); ctx.fillText("mark", c2, 10 + rh / 2);
      ctx.strokeStyle = rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(8 + dx, 10 + rh); ctx.lineTo(8 + tw + dx, 10 + rh); ctx.stroke();
      ctx.font = fs + "px " + p.fontUI;
      P.forEach(function(q, i){
        var y = 10 + rh * (i + 1.5), done = st.fly >= i + 1;
        if (Math.floor(st.fly) === i || done) { ctx.fillStyle = hiS; ctx.fillRect(8 + dx, y - rh / 2 + 1, tw, rh - 2); }
        ctx.fillStyle = done ? ink2 : ink; ctx.fillText(dN(q[0], 1), c1, y); ctx.fillText(String(q[1]), c2, y);
      });
      ctx.globalAlpha = 1;
      // dots: arrived ones sit on the grid; the current one flies from its row
      P.forEach(function(q, i){
        var t = clamp(st.fly - i, 0, 1); if (t <= 0) return;
        var e = ease(t), sx = c2 + 18, sy = 10 + rh * (i + 1.5), x = sx + (X(q[0]) - sx) * e, y = sy + (Y(q[1]) - sy) * e - Math.sin(Math.PI * e) * 26;
        ctx.fillStyle = pen; ctx.strokeStyle = sheet; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, sm ? 4.5 : 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      // the strength meter under the plot
      var my = H - (sm ? 22 : 28), mh = sm ? 10 : 13, mx0 = L, mx1 = W - R, cuts = [0, 0.33, 0.67, 1], labs = ["weak", "moderate", "strong"];
      for (var k = 0; k < 3; k++) {
        var a = mx0 + cuts[k] * (mx1 - mx0), b = mx0 + cuts[k + 1] * (mx1 - mx0);
        ctx.fillStyle = k === 2 && st.needle >= 1 ? hiS : sheet; ctx.fillRect(a, my - mh, b - a, mh); ctx.strokeStyle = rule; ctx.lineWidth = 1.2; ctx.strokeRect(a + 0.5, my - mh + 0.5, b - a - 1, mh - 1);
        ctx.fillStyle = ink2; ctx.font = (sm ? 10 : 12) + "px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(labs[k], (a + b) / 2, my + 3);
      }
      var nx = mx0 + (mx1 - mx0) * 0.96 * ease(st.needle);
      ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(nx, my - mh - 6); ctx.lineTo(nx, my + 1); ctx.stroke();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(nx - 6, my - mh - 10); ctx.lineTo(nx + 6, my - mh - 10); ctx.lineTo(nx, my - mh - 3); ctx.closePath(); ctx.fill();
      if (st.cap) { ctx.font = "700 " + (sm ? 12 : 15) + "px " + p.fontUI; ctx.fillStyle = ink; ctx.textAlign = "right"; ctx.textBaseline = "top"; var cw = ctx.measureText(st.cap).width; ctx.fillStyle = sheet; ctx.fillRect(W - R - cw - 8, T + 2, cw + 8, (sm ? 12 : 15) + 8); ctx.fillStyle = ink; ctx.fillText(st.cap, W - R - 4, T + 6); }
      ctx.restore();
    } });
  };
  var cap = f.cap;
  function last(){ st = { rows:1, fly:8, needle:1, cap:"positive · linear · strong" }; plot.render(); cap.textContent = "Hours studied vs test mark: positive · linear · strong (model data)."; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "Eight students: hours studied and test mark";
  MV.tween({ dur:800, step:function(t){ st.rows = t; plot.render(); }, done:function(){
    cap.textContent = "Each pair becomes one point";
    MV.tween({ dur:3600, step:function(t){ st.fly = 8 * t; plot.render(); }, done:function(){
      MV.wait(400, function(){
        cap.textContent = "The strength meter reads the cloud";
        MV.tween({ dur:1000, step:function(t){ st.needle = t; plot.render(); }, done:function(){ MV.wait(300, last); } });
      });
    } });
  } });
}

// ---------- Part 3: Match the story ----------
var STORIES = [
  { id:"car", t:"Age of a used car vs its price", sx:"car age", sy:"price", xu:"car age (years)", yu:"price ($1000s)", f:{ dir:"negative", form:"linear", str:"strong" },
    pts:[[1, 31], [2, 27], [3, 25], [4, 21], [5, 19], [6, 15], [7, 14], [8, 10]], v:{ x0:0, x1:9, y0:0, y1:35 },
    why:{ dir:"older cars sell for less, so the points fall from left to right.", form:"price drops steadily with age: a straight-line trend.", str:"price follows age closely, so the points hug the line." }, decide:"Falling and tight: strong negative." },
  { id:"arm", t:"Height vs arm span", sx:"height", sy:"arm span", xu:"height (cm)", yu:"arm span (cm)", f:{ dir:"positive", form:"linear", str:"strong" },
    pts:[[152, 150], [158, 157], [163, 165], [167, 166], [171, 173], [176, 175], [181, 183], [186, 185]], v:{ x0:145, x1:190, y0:140, y1:195 },
    why:{ dir:"taller people tend to have longer arm spans, so the points rise.", form:"arm span grows steadily with height: a straight-line trend.", str:"arm span is close to height for most people, so the points hug the line." }, decide:"Rising and tight: strong positive." },
  { id:"bm", t:"Birth month vs height", sx:"birth month", sy:"height", xu:"birth month", yu:"height (cm)", f:{ dir:"none", form:"none", str:"none" },
    pts:[[1, 168], [2, 175], [3, 160], [4, 181], [5, 165], [6, 172], [7, 158], [8, 177], [9, 169], [10, 163], [11, 179], [12, 166]], v:{ x0:0, x1:13, y0:150, y1:190 },
    why:{ dir:"height doesn’t follow birth month, so there’s no direction.", form:"height doesn’t follow birth month, so there’s no pattern at all.", str:"there’s no reason height follows birth month: no correlation." }, decide:"A shapeless cloud: no correlation." },
  { id:"day", t:"Hours of daylight vs month of the year", sx:"month", sy:"daylight", xu:"month", yu:"daylight (h)", f:{ dir:"none", form:"curved", str:"strong" },
    pts:[[1, 8.9], [2, 10.2], [3, 11.9], [4, 13.5], [5, 14.9], [6, 15.6], [7, 15.2], [8, 13.9], [9, 12.4], [10, 10.8], [11, 9.4], [12, 8.6]], v:{ x0:0, x1:13, y0:6, y1:18 },
    why:{ dir:"daylight rises to midsummer, then falls, so there’s no single direction.", form:"daylight rises then falls: a curve.", str:"daylight follows the calendar closely, so the points hug the curve." }, decide:"Rises then falls, tightly: strong curved." },
  { id:"tv", t:"Hours of TV per week vs final mark", sx:"TV time", sy:"final mark", xu:"TV (h/week)", yu:"final mark (%)", f:{ dir:"negative", form:"linear", str:"weak" },
    pts:[[2, 74], [4, 85], [5, 66], [7, 80], [8, 64], [10, 78], [12, 70], [14, 62], [15, 79], [18, 68]], v:{ x0:0, x1:20, y0:55, y1:90 },
    why:{ dir:"more TV tends to go with lower marks, so the cloud drifts down.", form:"the cloud drifts down roughly along a line, not a curve.", str:"marks vary a lot at every amount of TV, so the pattern is loose." }, decide:"Drifting down, loosely: weak negative." },
  { id:"pia", t:"Time spent practising vs piano-exam score", sx:"practice time", sy:"exam score", xu:"practice (h/week)", yu:"exam score (%)", f:{ dir:"positive", form:"linear", str:"moderate" },
    pts:[[1, 62], [2, 72], [3, 58], [4, 75], [5, 66], [6, 82], [7, 64], [8, 85], [9, 70], [10, 76]], v:{ x0:0, x1:11, y0:50, y1:90 },
    why:{ dir:"more practice tends to go with higher scores, so the points rise.", form:"scores rise roughly along a line, not a curve.", str:"the points rise with a fair amount of spread: moderate." }, decide:"Rising with some spread: moderate positive." }
];
var PLOT_ORDER = ["day", "tv", "car", "pia", "bm", "arm"], LET = "ABCDEF";
function story(id){ return STORIES.filter(function(s){ return s.id === id; })[0]; }
var ICE = { pts:[[120, 3], [180, 5], [230, 6], [300, 9], [340, 8], [410, 12], [460, 13], [520, 15]], v:{ x0:80, x1:560, y0:0, y1:18 } };

// @component N29 sentenceBuilder (self-contained; radio-chip blanks in a sentence) — parts: strings and {k, opts:[{id, t}]}
function sentenceHTML(pre, parts, vals, locked){
  return '<p class="sp-sent">' + parts.map(function(q, i){
    var gap = i && !(typeof q === "string" && /^[;.,]/.test(q)) ? " " : "";
    if (typeof q === "string") return gap + "<span>" + q + "</span>";
    return gap + '<span class="sp-blank" id="' + pre + i + '" data-slot="' + q.k + '"></span>';
  }).join("") + "</p>";
}

function part3(host, api){
  var S = api.S, msgs = {}, plots = [];
  if (["s1", "s2", "s3"].indexOf(S.cur) < 0) S.cur = "s1";
  S.m = obj(S.m); S.sb = obj(S.sb); S.lq = obj(S.lq); S.data = !!S.data;
  function mst(id){ var x = S.m[id] = obj(S.m[id]); x.tries = x.tries || 0; return x; }
  function sbst(id){ var x = S.sb[id] = obj(S.sb[id]); x.tries = x.tries || 0; x.v = obj(x.v); return x; }
  var TITLES = { s1:"Six stories, six plots", s2:"Say it in words", s3:"The lurking question" };
  function done(k){ return k === "s1" ? STORIES.every(function(s){ return mst(s.id).solved; }) : k === "s2" ? ["car", "tv"].every(function(id){ return sbst(id).solved; }) : !!S.lq.solved; }
  var tabOpts = ["s1", "s2", "s3"].map(function(k){ return { id:k, t:"" }; });
  function tabText(){ tabOpts.forEach(function(o, i){ o.t = "Station " + (i + 1) + ": " + TITLES[o.id] + (done(o.id) ? ' <span class="sp-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="st-tabs"></div><div id="st-body" class="st-body"></div>';
  tabText();
  var tabsR = radios($("#st-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function retab(){ tabText(); tabsR.refresh(); }
  function mkPlot(cv, fn){ var p = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }); p.render = fn; plots.push(p); fn(); return p; }

  function s1HTML(){
    var h = '<p>Match each story to its scatter plot. Each plot shows model data. Choose a plot under each story; the feedback names the feature that decides the match.</p><div class="st-grid">' +
      PLOT_ORDER.map(function(id, k){ return '<figure class="st-fig"><canvas class="plot st-plot" id="st-p' + k + '" role="img" aria-label="Plot ' + LET[k] + '"></canvas><figcaption>Plot ' + LET[k] + "</figcaption></figure>"; }).join("") + "</div>";
    h += '<div class="st-cards">' + STORIES.map(function(s){
      var x = mst(s.id), fb = x.solved ? MV.fbHTML("good", "<strong>✓ Plot " + LET[PLOT_ORDER.indexOf(s.id)] + ".</strong> " + s.decide + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : msgs[s.id] ? MV.fbHTML("bad", msgs[s.id]) : "";
      return '<div class="st-card" data-st="' + s.id + '"><p class="st-story">' + s.t + '</p><div class="st-picks" role="group" aria-label="Plot for: ' + MV.esc(s.t) + '">' + PLOT_ORDER.map(function(pid, k){
        var on = x.solved && pid === s.id;
        return '<button type="button" class="btn ghost sm st-pk" data-pk="' + pid + '" data-k="st' + s.id + pid + '"' + (x.solved ? " disabled" : "") + (on ? ' aria-pressed="true"' : "") + ' aria-label="Plot ' + LET[k] + '">' + LET[k] + "</button>"; }).join("") + "</div>" + fb + "</div>";
    }).join("") + "</div>";
    var solved = STORIES.filter(function(s){ return mst(s.id).solved; });
    h += '<details class="alg" id="st-data"' + (S.data ? " open" : "") + '><summary>Check it with data</summary><p class="tiny">Each matched plot now shows its variables. Here are the model data and the strength meter’s reading for each matched story.</p>' +
      (solved.length ? solved.map(function(s){ var f = fit(s.pts); return '<p class="st-dt"><strong>' + s.t + "</strong>: " + M("r") + " = " + rTxt(f.r) + " (meter: " + strengthOf(r2d(f.r)) + ")" + (s.f.form === "curved" ? "; the meter misses the curve, but the points hug it." : "") + "</p>" +
        MV.tableHTML({ head:[s.xu, s.yu], rows:s.pts.map(function(q){ return [dN(q[0], 1), dN(q[1], 1)]; }), caption:s.t + " (model data)" }); }).join("") : '<p class="muted">Match a story first.</p>') + "</details>";
    return h;
  }
  function drawS1(k){
    var s = story(PLOT_ORDER[k]), x = mst(s.id), p = plots[k];
    drawScatter(p, { pts:s.pts, view:s.v, small:true, xLab:x.solved ? s.xu : "", yLab:x.solved ? s.yu : "",
      describe:"Plot " + LET[k] + ": a scatter plot of " + s.pts.length + " points" + (x.solved ? " of " + s.yu + " against " + s.xu : "") + ". " + (s.f.form === "curved" ? "The points rise, then fall, along a smooth curve." : s.f.dir === "none" ? "The points form a shapeless cloud." : "The points " + (s.f.dir === "positive" ? "rise" : "fall") + " from left to right, " + (s.f.str === "strong" ? "tightly." : s.f.str === "moderate" ? "with some spread." : "loosely.")) });
  }
  var SB = {
    car:{ parts:["As", { k:"a" }, "increases,", { k:"b" }, "tends to", { k:"c" }, "; the pattern is", { k:"d" }, "and", { k:"e" }, "."], cause:"decrease, because age causes it" },
    tv:{ parts:["As", { k:"a" }, "increases,", { k:"b" }, "tends to", { k:"c" }, "; the pattern is", { k:"d" }, "and", { k:"e" }, "."], cause:"decrease, because TV causes it" }
  };
  function slotOpts(id, k){
    var s = story(id);
    if (k === "a") return [{ id:"x", t:s.sx }, { id:"y", t:s.sy }];
    if (k === "b") return [{ id:"y", t:s.sy }, { id:"x", t:s.sx }];
    if (k === "c") return [{ id:"dec", t:"decrease" }, { id:"inc", t:"increase" }, { id:"same", t:"stay about the same" }, { id:"cause", t:SB[id].cause }];
    if (k === "d") return [{ id:"strong", t:"strong" }, { id:"moderate", t:"moderate" }, { id:"weak", t:"weak" }];
    return [{ id:"linear", t:"linear" }, { id:"curved", t:"curved" }];
  }
  function s2HTML(){
    return '<p>Build a sentence for each plot. Several sentences are accepted.</p>' + ["car", "tv"].map(function(id){
      var s = story(id), x = sbst(id), fb = x.solved ? MV.fbHTML("good", "<strong>✓ Accepted.</strong> “" + sentText(id) + "”" + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : msgs["sb" + id] ? MV.fbHTML("bad", msgs["sb" + id]) : "";
      return '<div class="st-sb" data-sb="' + id + '"><div class="st-sbrow"><div class="st-sbfig"><canvas class="plot st-plot" id="st-sbp' + id + '" role="img" aria-label="' + MV.esc(s.t) + '"></canvas></div><div class="st-sbtxt"><p class="st-story">' + s.t + ' <span class="mdm-model">model data</span></p>' +
        sentenceHTML("st-b" + id, SB[id].parts, x.v, x.solved) + (x.solved ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-sbchk="' + id + '" data-k="stsb' + id + '">Check my sentence</button></div>') + fb + "</div></div></div>";
    }).join("");
  }
  function sentText(id){
    var x = sbst(id), out = [];
    SB[id].parts.forEach(function(q){
      if (typeof q === "string") { out.push(q); return; }
      var o = slotOpts(id, q.k).filter(function(z){ return z.id === x.v[q.k]; })[0]; out.push(o ? o.t : "___");
    });
    return out.join(" ").replace(/ ([;.,])/g, "$1").replace(/^As (\w)/, "As $1");
  }
  function judgeSB(id){
    var x = sbst(id), v = x.v, s = story(id);
    if (["a", "b", "c", "d", "e"].some(function(k){ return !v[k]; })) return { bad:"Fill every blank first." };
    if (v.c === "cause") return { fb:"A scatter plot shows that two variables move together, not why. Use “tends to” without “causes”." };
    if (v.a === v.b) return { fb:"Use both variables: one in each of the first two blanks." };
    if (v.c !== "dec") return { fb:"Look again at the direction: as one goes up, the other tends to go down." };
    if (v.d !== s.f.str) return { fb:"Check the strength: how tightly do the points hug the line?" };
    if (v.e !== "linear") return { fb:"Check the form: the points follow a line, not a curve." };
    return { ok:true };
  }
  function s3HTML(){
    var x = S.lq, fb = x.solved ? MV.fbHTML("good", "<strong>✓ Right.</strong> Hot, sunny weather sends ice cream sales up and sunburn cases up. The two move together without one causing the other. Module 38 looks at how to tell causes apart." + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : msgs.lq ? MV.fbHTML("bad", msgs.lq) : "";
    return '<div class="st-sbrow"><div class="st-sbfig"><canvas class="plot st-plot" id="st-ice" role="img" aria-label="Ice cream sales vs sunburn cases"></canvas></div><div class="st-sbtxt"><p>Over a summer, ice cream sales and sunburn cases rise together (<span class="mdm-model">model data</span>). Which explanation fits?</p>' +
      '<div class="st-lq" role="group" aria-label="Choose an explanation">' + [["third", "A third variable (hot, sunny weather) affects both"], ["cause", "Ice cream causes sunburn"]].map(function(o){
        return '<button type="button" class="btn ghost sm st-lqb" data-lq="' + o[0] + '" data-k="stlq' + o[0] + '"' + (x.solved ? " disabled" : "") + (x.solved && o[0] === "third" ? ' aria-pressed="true"' : "") + ">" + o[1] + "</button>"; }).join("") + "</div>" + fb + "</div></div>";
  }
  function paint(){
    retab(); plots = [];
    var body = $("#st-body", host), k = S.cur;
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="st-card0"><p class="st-lab">Station ' + (k === "s1" ? 1 : k === "s2" ? 2 : 3) + " · " + TITLES[k] + "</p>" + (k === "s1" ? s1HTML() : k === "s2" ? s2HTML() : s3HTML()) + "</div>"; });
    if (k === "s1") PLOT_ORDER.forEach(function(id, i){ var p = new MV.Plot($("#st-p" + i, host), { xmin:0, xmax:1, ymin:0, ymax:1 }); plots[i] = p; p.render = function(){ drawS1(i); }; p.render(); });
    if (k === "s2") ["car", "tv"].forEach(function(id){
      var s = story(id), x = sbst(id);
      mkPlot($("#st-sbp" + id, host), function(){ drawScatter(this_(id), { pts:s.pts, view:s.v, small:true, xLab:s.xu, yLab:s.yu, describe:"Scatter plot of " + s.yu + " against " + s.xu + ": the points fall from left to right, " + (s.f.str === "strong" ? "tightly." : "loosely.") }); });
      SB[id].parts.forEach(function(q, i){
        if (typeof q === "string") return;
        radios($("#st-b" + id + i, host), { aria:"Blank: " + (q.k === "a" ? "first variable" : q.k === "b" ? "second variable" : q.k === "c" ? "tends to" : q.k === "d" ? "strength" : "form"), options:slotOpts(id, q.k), value:x.v[q.k] || "", cls:"chips",
          disabled:function(){ return !!x.solved; }, onChange:function(v){ x.v[q.k] = v; msgs["sb" + id] = null; api.save(); } });
      });
    });
    if (k === "s3") mkPlot($("#st-ice", host), function(){ drawScatter(plots[0], { pts:ICE.pts, view:ICE.v, small:true, xLab:"ice cream sales (cones/day)", yLab:"sunburn cases", describe:"Scatter plot of sunburn cases against ice cream sales: the points rise tightly from left to right." }); });
  }
  function this_(id){ return plots[id === "car" ? 0 : 1]; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.pk) {
      var sid = b.closest("[data-st]").dataset.st, s = story(sid), x = mst(sid), pid = b.dataset.pk;
      if (pid === sid) { x.solved = true; x.first = x.tries === 0; msgs[sid] = null; }
      else {
        x.tries++; var c = story(pid), L2 = "Plot " + LET[PLOT_ORDER.indexOf(pid)];
        var feat = s.f.dir !== c.f.dir ? "dir" : s.f.form !== c.f.form ? "form" : "str", nm = { dir:"direction", form:"form", str:"strength" }[feat];
        msgs[sid] = "<strong>✗ Not " + L2 + ".</strong> The <strong>" + nm + "</strong> decides it: " + s.why[feat] + " Try another plot.";
      }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-st="' + sid + '"]')); return;
    }
    if (b.dataset.sbchk) {
      var id = b.dataset.sbchk, xs = sbst(id), r = judgeSB(id);
      if (r.bad) msgs["sb" + id] = r.bad;
      else if (r.ok) { xs.solved = true; xs.first = xs.tries === 0; msgs["sb" + id] = null; }
      else { xs.tries++; msgs["sb" + id] = "<strong>✗ Not quite.</strong> " + r.fb; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-sb="' + id + '"]')); return;
    }
    if (b.dataset.lq) {
      var q = S.lq; q.tries = q.tries || 0;
      if (b.dataset.lq === "third") { q.solved = true; q.first = q.tries === 0; msgs.lq = null; }
      else { q.tries++; msgs.lq = "<strong>✗ Not quite.</strong> Ice cream can’t burn skin. A scatter plot shows that two variables move together, not why. What makes people buy ice cream <em>and</em> get sunburned?"; }
      api.save(); paint(); MV.focusFb($("#st-body", host)); return;
    }
  });
  host.addEventListener("toggle", function(e){ if (e.target.id === "st-data") { S.data = e.target.open; api.save(); } }, true);
  paint();
  return {};
}

// ---------- Practice: Read the plot (N8 tap a point + chip items) ----------
// @component N8 tapPoint — point buttons laid over a drawScatter plot (repositioned after every draw); tapPoints(plot, wrap, pts, label(i)) -> {btns, sync}
function tapPoints(plot, wrap, pts, label){
  var btns = pts.map(function(q, i){ var b = document.createElement("button"); b.type = "button"; b.className = "sp-pt"; b.dataset.pt = i; b.dataset.k = "sppt" + i; b.setAttribute("aria-label", label(i)); wrap.appendChild(b); return b; });
  function sync(){ var g = plot._sc; if (!g) return; btns.forEach(function(b, i){ b.style.left = (plot.c.offsetLeft + g.X(pts[i][0])) + "px"; b.style.top = (plot.c.offsetTop + g.Y(pts[i][1])) + "px"; }); }
  plot.onDrawn(sync);
  return { btns:btns, sync:sync };
}
function readPlot(host, api, a){
  var st = api.S; st.items = obj(st.items);
  var msgs = {}, P = a.data;
  function ist(id){ var x = st.items[id] = obj(st.items[id]); x.tries = x.tries || 0; x.hint = x.hint || 0; return x; }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="sp-rp"><div class="plot-wrap sp-rpw"><canvas class="plot" id="sp-rpc" role="img" aria-label="Scatter plot of height against arm span for 8 students"></canvas></div>' +
    '<p class="tiny muted">Arm span vs height for 8 students <span class="mdm-model">model data</span></p></div><div id="sp-rq"></div>';
  var plot = new MV.Plot($("#sp-rpc", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), r3 = a.items.filter(function(it){ return it.tap; })[0];
  plot.render = function(){
    var x3 = ist(r3.id);
    drawScatter(plot, { pts:P, view:{ x0:145, x1:185, y0:145, y1:190 }, xLab:"arm span (cm)", yLab:"height (cm)", flags:x3.solved ? [MV.ans(r3)] : [],
      describe:"Scatter plot of height against arm span for 8 students: " + P.map(ptTxt).join(", ") + "." + (x3.solved ? " The point (178, 158) is ringed as the outlier." : "") });
  };
  var tp = tapPoints(plot, $(".sp-rpw", host), P, function(i){ return "Point (" + P[i][0] + ", " + P[i][1] + ")"; });
  function paint(){
    var box = $("#sp-rq", host), x3 = ist(r3.id);
    tp.btns.forEach(function(b){ b.disabled = !!x3.solved; });
    MV.keepFocus(box, function(){
      box.innerHTML = a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-rq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        if (it.tap) h += '<p class="tiny muted">Tap a point on the plot above' + (x.solved ? "." : ", or tab to it and press Enter.") + "</p>";
        else h += '<div class="opts sp-chips" role="group" aria-label="Choices">' + it.choices.map(function(c, k){
          var on = x.solved && MV.ok(c);
          return '<button type="button" class="chip" data-ch="' + k + '" data-k="' + it.id + "c" + k + '"' + (x.solved ? " disabled" : "") + (on ? ' aria-pressed="true"' : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
        if (!x.solved && it.hints) h += '<div class="q-actions">' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
        else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
        return h + "</div>";
      }).join("");
    });
    plot.render();
  }
  function judge(it, ok, fb){
    var x = ist(it.id);
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + fb + " Try again."; }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-rq="' + it.id + '"]'));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pt != null) { var x3 = ist(r3.id); if (x3.solved) return; var i = +b.dataset.pt; judge(r3, i === MV.ans(r3), r3.wrongTap); return; }
    var box = b.closest("[data-rq]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.rq; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.ch != null) { var c = it.choices[+b.dataset.ch]; judge(it, MV.ok(c), c.why || (it.wrongBy && it.wrongBy[MV.plain(c.t)]) || "Look at the plot again."); }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Practice makes fewer mistakes ----------
var task = (function(){
  var api = null, rows = [], plot = null, meter = null, CARDS = [2, 4, 6, 8, 10];
  function st(){ var s = api ? api.S : {}; if (!Array.isArray(s.a) || s.a.slice().sort(function(x, y){ return x - y; }).join(",") !== "2,4,6,8,10") s.a = CARDS.slice(); return s; }
  function read(){ return { a:st().a.slice() }; }
  function rOf(a){ return fit(a.map(function(y, i){ return [i + 1, y]; })).r; }
  function paint(){
    var a = st().a, r = rOf(a);
    rows.forEach(function(g, i){ g.set(a[i]); });
    if (plot) plot.render();
    if (meter) meter.set(r, false);
    var rd = $("#sp-tr"); if (rd) rd.innerHTML = MV.readoutHTML([["Mistakes at 1–5 h", a.join(", ")], [M("r"), "<strong>" + rTxt(r) + "</strong> (" + strengthOf(r2d(r)) + (r < 0 ? ", negative" : ", positive") + ")"]]);
  }
  return {
    render:function(inp, pvw, A){
      api = A; st();
      inp.innerHTML = '<div class="sp-tin">' + [1, 2, 3, 4, 5].map(function(h){ return '<div id="sp-t' + h + '"></div>'; }).join("") + "</div>";
      pvw.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="sp-tc" role="img" aria-label="Scatter plot of mistakes against hours of practice"></canvas></div><div id="sp-tm"></div><dl class="read" id="sp-tr" aria-live="polite"></dl>';
      rows = [0, 1, 2, 3, 4].map(function(i){
        return radios($("#sp-t" + (i + 1)), { label:(i + 1) + (i ? " hours" : " hour"), aria:"Mistakes for the student who practised " + (i + 1) + (i ? " hours" : " hour"), options:CARDS.map(function(v){ return { id:v, t:String(v) }; }), value:api.S.a[i], cls:"chips",
          onChange:function(v){ v = +v; var a = api.S.a, j = a.indexOf(v); a[j] = a[i]; a[i] = v; api.save(); paint(); api.update(); } });
      });
      plot = new MV.Plot($("#sp-tc"), { xmin:0, xmax:1, ymin:0, ymax:1 });
      plot.render = function(){ var a = st().a, P = a.map(function(y, i){ return [i + 1, y]; }); drawScatter(plot, { pts:P, view:{ x0:0, x1:6, y0:0, y1:12 }, xLab:"practice (h)", yLab:"mistakes", describe:"Scatter plot of mistakes against hours of practice: " + P.map(ptTxt).join(", ") + ". r = " + rTxt(rOf(a)) + "." }); };
      meter = makeMeter($("#sp-tm"));
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var r = Math.round(rOf(d.a) * 100) / 100; return [r < 0, r <= -0.67, r > -1, d.a[4] === 2]; },
    key:function(d){ return d.a.join(","); },
    label:function(k){ return k.split(",").join(", "); },
    text:function(k){ return k.split(",").join(", "); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ read:readPlot },
  task:task
});
})();
