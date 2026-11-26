// MCV4U 28 Optimization Problems with Exponential Functions: hero (a line y = t and a decay curve multiply into the dose
// curve; a tangent flattens at the peak), Dose curve (Explore: V10 shape stage for C(t) = A t e^(−kt) with Dose curve /
// Factor view (V5-style factor panels and a C′ sign strip) / Window modes), Revenue with exponential demand (Part 3: three
// stations, each an N29 chip model builder, then a V10 shape stage with bars and a V11 sign chart), Find the critical numbers
// and Optimize the model (Practice 1 and 2: V8 boxes with e and ln) and the "Dose design" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol) * Math.max(1, Math.abs(b)); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function r2(v){ v = Math.round(v * 100) / 100; return Object.is(v, -0) ? 0 : v; }
function tpl(s, a){ return String(s).replace(/#(\d)/g, function(_, k){ return a[k - 1] != null ? a[k - 1] : "#" + k; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
function lin(t){ return t; }
function pressed(b, on){ b.setAttribute("aria-pressed", on ? "true" : "false"); if (b.classList.contains("chip")) b.classList.toggle("on", !!on); }
// value to dp decimals, "≈ " in front when rounding changed it
function dec(v, dp){ var p = Math.pow(10, dp), r = Math.round(v * p) / p; return (Math.abs(v - r) > 1e-9 ? "≈ " : "") + num(v, dp); }
// money: $4415, −$3000; whole dollars with "≈" when rounded
function money(v){ var r = Math.round(v); if (Object.is(r, -0)) r = 0; return (r < 0 ? MINUS : "") + "$" + num(Math.abs(r), 0); }
function moneyA(v){ return (Math.abs(v - Math.round(v)) > 1e-6 ? "≈ " : "") + money(v); }
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
// view whose y-axis (x = 0) sits padPx pixels in from the left edge, so tick labels never clip
// (padB: the x-axis y = 0 sits padB pixels above the bottom edge, leaving room for tick labels when the data start at 0)
function padView(plot, xmax, ymin, ymax, padPx, padB){
  var r = plot.c ? plot.c.getBoundingClientRect() : { width:400, height:300 }, W = r.width || 400, H = r.height || 300; padPx = padPx || 40;
  if (padB) ymin = -padB * ymax / Math.max(H - padB, 1);
  return { xmin:-padPx * xmax / Math.max(W - padPx, 1), xmax:xmax, ymin:ymin, ymax:ymax };
}
function noNeg(f){ return function(t){ return t < -1e-9 ? "" : f ? f(t) : num(t); }; }
// axis name at the right end of the x-axis: under the tick labels when there is room, otherwise just above the axis
function axisName(ctx, pl, text){
  var y0 = pl.Y(0), below = y0 + 36 < pl.H;
  ctx.save(); ctx.font = ui(12, 400); ctx.fillStyle = css("--ink-2"); ctx.textAlign = "right"; ctx.textBaseline = below ? "top" : "bottom";
  ctx.fillText(text, pl.W - 6, below ? y0 + 20 : y0 - 4); ctx.restore();
}
// a short tangent of fixed pixel length through (t, y) with slope s
function tangentPx(ctx, pl, t, y, s, half, color){
  var X0 = pl.X(t), Y0 = pl.Y(y), dx = pl.X(t + 1) - X0, dy = pl.Y(y + s) - Y0, L = Math.hypot(dx, dy) || 1, ux = dx / L * (half || 60), uy = dy / L * (half || 60);
  ctx.save(); ctx.strokeStyle = color || css("--ink"); ctx.lineWidth = 2.2; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(X0 - ux, Y0 - uy); ctx.lineTo(X0 + ux, Y0 + uy); ctx.stroke(); ctx.restore();
}

// =====================================================================================================================
// @component V8 eNumber (copied from MCV4U 25; extended: ln, a leading $) — exact numbers typed with e and ln for V8 boxes:
// 3, −2/3, 0.5, e, 2e, e/2, 1/e, e^-1, e^(−2), 4e^-2, 4/e², ln 3, 4 ln 2, 2ln(4), ln 16, $40. Returns {v, dec (a decimal point
// was typed), e (e or ln was used)} or null. No variables, no free algebra.
var SUPD = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "⁻":"-" };
function eNum(raw){
  var s = String(raw == null ? "" : raw).trim().replace(/[−–]/g, "-").replace(/\s+/g, "").replace(/[·×]/g, "*").replace(/^\$/, "").replace(/^(-)\$/, "$1")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function(t){ return "^(" + t.split("").map(function(c){ return SUPD[c]; }).join("") + ")"; });
  if (!s) return null;
  var i = 0, decUsed = false, eUsed = false;
  function pk(){ return s[i]; }
  function isLn(){ return s.substr(i, 2) === "ln"; }
  function expr(){ var v = term(); while (pk() === "+" || pk() === "-") { var o = s[i++], w = term(); v = o === "+" ? v + w : v - w; } return v; }
  function term(){ var v = un(); while (pk() === "*" || pk() === "/" || pk() === "(" || pk() === "e" || isLn()) { var o = s[i]; if (o === "*" || o === "/") i++; else o = "*"; var w = un(); v = o === "/" ? v / w : v * w; } return v; }
  function un(){ if (pk() === "-") { i++; return -un(); } if (pk() === "+") { i++; return un(); } return pw(); }
  function pw(){ var v = at(); if (pk() === "^") { i++; v = Math.pow(v, un()); } return v; }
  function at(){
    var c = pk();
    if (isLn()) { i += 2; eUsed = true; var a = pw(); if (!(a > 0)) throw 0; return Math.log(a); }
    if (c === "(" || c === "{") { i++; var v = expr(); if (pk() !== ")" && pk() !== "}") throw 0; i++; return v; }
    if (c === "e") { i++; eUsed = true; return Math.E; }
    var mm = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)); if (!mm) throw 0;
    if (mm[0].indexOf(".") >= 0) decUsed = true;
    i += mm[0].length; return parseFloat(mm[0]);
  }
  try { var v = expr(); if (i !== s.length || !isFinite(v)) return null; return { v:v, dec:decUsed, e:eUsed }; } catch (err) { return null; }
}
function eList(raw){
  var parts = String(raw || "").split(/[;]|,(?!\d{3}\b)|\bor\b|\band\b/).map(function(t){ return t.replace(/^\s*[a-z]\s*=\s*/i, "").trim(); }).filter(Boolean);
  if (!parts.length) return null;
  var out = [];
  for (var k = 0; k < parts.length; k++) { var r = eNum(parts[k]); if (!r) return null; if (!out.some(function(u){ return near(u.v, r.v); })) out.push(r); }
  return out;
}
// ------------------------------------------------- end of V8 eNumber -------------------------------------------------------

// ---------- the dose model C(t) = A t e^(−kt) ----------
function Cf(A, k){ return function(t){ return A * t * Math.exp(-k * t); }; }
function dCf(A, k){ return function(t){ return A * Math.exp(-k * t) * (1 - k * t); }; }
function kSrc(k){ k = r2(k); return k === 1 ? "" : String(k); }
function aSrc(A){ return "@a{" + A + "}"; }
function modelSrc(A, k){ return "C(t) = " + aSrc(A) + "t e^{-" + kSrc(k) + "t}"; }
function derivSrc(A, k){ return "C′(t) = " + aSrc(A) + "e^{-" + kSrc(k) + "t}(1 - " + kSrc(k) + "t)"; }
function terminating(d){ while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }
// peak time 1/k for k a multiple of 0.05 (k = n/20): exact when it terminates, else a fraction "20/3 ≈ 6.7"
function peakT(k){
  var n = Math.round(r2(k) * 20), q = Q.of(20, n), v = 20 / n;
  if (q.d === 1 || terminating(q.d)) return { v:v, html:m(String(+v.toFixed(4))), txt:num(+v.toFixed(4)) };
  return { v:v, html:m("{" + q.n + "}/{" + q.d + "}") + " ≈ " + num(v, 1), txt:"about " + num(v, 1) };
}
// peak value A/(ke) = (20A/n)/e, exact then 1 decimal
function peakV(A, k){
  var n = Math.round(r2(k) * 20), q = Q.of(20 * A, n), v = 20 * A / n / Math.E;
  var src = q.d === 1 ? "{" + q.n + "}/{e}" : "{" + q.n + "}/{" + q.d + "e}";
  return { v:v, html:m(src) + " ≈ " + num(v, 1), txt:(q.d === 1 ? q.n + "/e" : q.n + "/(" + q.d + "e)") + " ≈ " + num(v, 1) };
}
var LAD = [1, 2, 3, 5, 8, 10, 15, 20, 30, 40, 50, 60, 80, 100, 120, 160, 200];
function niceUp(v){ for (var i = 0; i < LAD.length; i++) if (LAD[i] >= v) return LAD[i]; return Math.ceil(v / 50) * 50; }

// ---------- hero: y = t and y = e^(−t/2) multiply into C(t) = 20t e^(−t/2); a tangent flattens at the peak ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var c1 = $("#ox-hf1"), c2 = $("#ox-hf2");
  var pM = new MV.Plot(cv, { xmin:0, xmax:10.4, ymin:0, ymax:19 }), p1 = c1 ? new MV.Plot(c1, { xmin:0, xmax:10.4, ymin:0, ymax:11 }) : null, p2 = c2 ? new MV.Plot(c2, { xmin:0, xmax:10.4, ymin:0, ymax:1.15 }) : null;
  var F1 = function(t){ return t; }, F2 = function(t){ return Math.exp(-t / 2); }, C = Cf(20, 0.5), D = dCf(20, 0.5);
  var st = { e1:0, e2:0, e3:0, scan:null, tan:null, label:false };
  function small(p, fn, end, name){
    if (!p) return;
    var ink2 = css("--ink-2"), v = padView(p, 10.4, 0, name === "e" ? 1.15 : 11, 24, 18);
    var sc = { view:v, xTicks:{ step:2, fmt:noNeg() }, yTicks:{ step:name === "e" ? 0.5 : 5, fmt:noNeg() }, curves:[], points:[], segments:[] };
    if (name === "e" && end > 0) sc.regions = [{ f:fn, x0:0, x1:end, color:ink2, alpha:0.15 }];
    if (end > 0) sc.curves.push({ f:fn, color:name === "e" ? css("--ink") : ink2, width:2.4, dash:name === "e" ? [14, 6] : [6, 6], domain:[0, end] });
    if (st.scan != null) { sc.segments.push({ x1:st.scan, y1:0, x2:st.scan, y2:v.ymax, color:ink2, width:1.2, dash:[3, 4] }); sc.points.push({ x:st.scan, y:fn(st.scan), r:4.5, color:css("--ink") }); }
    p.draw(sc);
  }
  function main(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), v = padView(pM, 10.4, 0, 19, 30, 22);
    var sc = { view:v, xTicks:{ step:2, fmt:noNeg() }, yTicks:{ step:5, fmt:noNeg() }, curves:[], points:[], segments:[] };
    if (st.e3 > 0) sc.curves.push({ f:C, color:pen, width:3, domain:[0, st.e3] });
    if (st.scan != null) { sc.segments.push({ x1:st.scan, y1:0, x2:st.scan, y2:v.ymax, color:ink2, width:1.2, dash:[3, 4] }); sc.points.push({ x:st.scan, y:C(st.scan), r:5, color:pen }); }
    if (st.label) sc.segments.push({ x1:2, y1:0, x2:2, y2:C(2), color:ink2, width:1.5, dash:[5, 5] });
    if (st.tan != null) sc.points.push({ x:st.tan, y:C(st.tan), r:6, color:ink, ring:true });
    sc.after = function(ctx, pl){
      axisName(ctx, pl, "t, hours");
      if (st.tan != null) tangentPx(ctx, pl, st.tan, C(st.tan), D(st.tan), 62, ink);
      if (st.label) bgText(ctx, "peak at t = 2 h, C = 40/e ≈ 14.7 mg/L", Math.min(pl.X(2) - 10, pl.W - 290), pl.Y(17.4), "left", ink, ui(13, 700));
      if (st.e3 > 9.9 && !st.label) bgText(ctx, "C(t) = 20t e^(−t/2)", pl.X(5.2), pl.Y(15.6), "left", pen, mfont(15));
    };
    sc.describe = "Graph of the dose curve C(t) = 20t e^(−t/2) for 0 to 10 hours" + (st.label ? ". The tangent is horizontal at the peak: t = 2 h, C = 40/e, about 14.7 mg/L." : ".");
    pM.draw(sc);
  }
  function draw(){ small(p1, F1, st.e1, "t"); small(p2, F2, st.e2, "e"); main(); }
  pM.render = draw; if (p1) p1.render = draw; if (p2) p2.render = draw;
  function cap(s){ if (f.cap) f.cap.innerHTML = MV.md(s); }
  function finalFrame(){ st.e1 = 10.4; st.e2 = 10.4; st.e3 = 10.4; st.scan = null; st.tan = 2; st.label = true; cap("The tangent flattens at the top: the peak is at `t = 2` h, `C = 40/e` ≈ 14.7 mg/L."); draw(); }
  if (MV.reduceMotion) { finalFrame(); return; }
  cap("A rising factor, `y = t` …"); draw();
  MV.wait(400, function(){
    MV.tween({ dur:1100, ease:lin, step:function(t){ st.e1 = 10.4 * t; draw(); }, done:function(){
      cap("… and a decaying factor, `y = e^{-t/2}`, which stays above 0.");
      MV.tween({ dur:1100, ease:lin, step:function(t){ st.e2 = 10.4 * t; draw(); }, done:function(){
        cap("Multiply point by point, times 20: `C(t) = 20t e^{-t/2}` rises, peaks and fades.");
        MV.tween({ dur:2200, ease:lin, step:function(t){ st.e3 = 10.4 * t; st.scan = Math.min(10.2, st.e3); draw(); }, done:function(){
          st.scan = null; draw();
          MV.wait(500, function(){
            cap("A tangent slides along the curve …");
            MV.tween({ dur:1800, step:function(t){ st.tan = 0.3 + 1.7 * t; draw(); }, done:function(){ MV.wait(300, finalFrame); } });
          });
        } });
      } });
    } });
  });
}

// =====================================================================================================================
// ---------- Explore: Dose curve ----------
// @component V10 shapeStage (dose mode; adapted from MCV4U 16 / 18) — the objective C(t) = A t e^(−kt) in --pen on a fixed time
// axis with a probe (slider or drag handle), its tangent in --ink, the peak line at 1/k, a shaded window [t₁, t₂] with its
// candidates and the absolute maximum ringed. Factor view stacks two small V5-style factor panels (A t and e^(−kt) with its
// positive band) above C′(t) in --f3 with a V11 sign strip. The y-range changes only when the peak leaves 30–92 % of it,
// so a change in A shows as a vertical stretch.
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (!(S.A >= 1 && S.A <= 40)) S.A = 20; S.A = Math.round(S.A);
  if (!(S.k >= 0.1 && S.k <= 2)) S.k = 0.5; S.k = r2(Math.round(S.k * 20) / 20);
  if (!(S.t >= 0 && S.t <= 12)) S.t = 1.5;
  if (["dose", "factor", "window"].indexOf(S.mode) < 0) S.mode = "dose";
  if (!(S.t1 >= 0 && S.t1 <= 11.5)) S.t1 = 3;
  if (!(S.t2 >= 0.5 && S.t2 <= 12) || S.t2 <= S.t1) S.t2 = Math.min(12, Math.max(8, S.t1 + 0.5));
  var busy = false, pv = null, yTop = null, lockY = null, anim = null;
  function sl(id, label, min, max, step, col, aria, unit){
    return '<label class="slider ox-sl"><span class="slider-top"><span>' + label + (unit ? ' <span class="tiny muted ox-unit">' + unit + "</span>" : "") + '</span><output id="ox-' + id + 'o" style="color:' + col + '"></output></span>' +
      '<input type="range" id="ox-' + id + '" data-sl="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:' + col + '" aria-label="' + MV.esc(aria) + '"></label>';
  }
  host.innerHTML = '<div class="ox-ex"><div class="ox-main" data-mv="graph"><p class="eq-cap ox-eq" id="ox-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ox-fac" id="ox-fac"><div class="ox-fp"><p class="ox-fcap">' + T.fac1 + '</p><canvas class="plot ox-small" id="ox-f1" role="img" aria-label="Rising factor"></canvas></div>' +
      '<div class="ox-fp"><p class="ox-fcap">' + T.fac2 + '</p><canvas class="plot ox-small" id="ox-f2" role="img" aria-label="Decaying factor"></canvas></div></div>' +
    '<p class="ox-gcap" id="ox-gcap"></p><div class="plot-wrap"><canvas class="plot ox-plot" id="ox-plot" role="img" aria-label="Dose curve"></canvas></div>' +
    '<p class="tiny muted ox-key" id="ox-key"></p>' +
    '<div class="ox-win" id="ox-win">' + sl("t1", T.t1, 0, 12, 0.5, "var(--ink)", "Window start in hours") + sl("t2", T.t2, 0, 12, 0.5, "var(--ink)", "Window end in hours") + '<p class="tiny muted">' + T.winNote + "</p></div></div>" +
    '<div class="ox-side" id="ox-side"><div class="seg-wrap"><span class="tiny" style="font-weight:700">' + T.modeLabel + '</span><span class="seg" role="group" aria-label="View">' + T.modes.map(function(o){
      return '<button type="button" data-mode="' + o.id + '" data-k="oxm' + o.id + '" aria-pressed="false">' + o.t + "</button>"; }).join("") + "</span></div>" +
    sl("A", T.A, 1, 40, 1, "var(--acol)", "Dose factor A", T.Aunit) + sl("k", T.k, 0.1, 2, 0.05, "var(--ink)", "Elimination rate k per hour", T.kunit) + sl("t", T.probe, 0, 12, 0.1, "var(--ink)", "Probe time t in hours", "h") +
    '<dl class="read ox-read" id="ox-read" aria-live="polite"></dl></div></div>';
  var ex = $(".ox-ex", host), plot = new MV.Plot($("#ox-plot", host), { xmin:0, xmax:12.4, ymin:0, ymax:20 });
  var pf1 = new MV.Plot($("#ox-f1", host), { xmin:0, xmax:12.4, ymin:0, ymax:1 }), pf2 = new MV.Plot($("#ox-f2", host), { xmin:0, xmax:12.4, ymin:0, ymax:1 });
  plot.render = drawMain; pf1.render = drawF1; pf2.render = drawF2;

  function yScale(){
    if (lockY) return lockY;
    var pk = peakV(S.A, S.k).v;
    if (!yTop || pk > yTop * 0.92 || pk < yTop * 0.3) yTop = niceUp(pk * 1.3);
    return yTop;
  }
  function win(){
    var A = S.A, k = S.k, f = Cf(A, k), pt = 1 / k, a = S.t1, b = S.t2, c = [{ t:a, end:true }, { t:b, end:true }];
    if (pt > a + 1e-9 && pt < b - 1e-9) c.splice(1, 0, { t:pt, end:false });
    c.forEach(function(q){ q.v = f(q.t); });
    var best = c[0]; c.forEach(function(q){ if (q.v > best.v + 1e-12) best = q; });
    return { cands:c, best:best };
  }
  function probeState(){
    var d = dCf(S.A, S.k)(S.t), pt = 1 / S.k, pk = Math.abs(d) < 0.05 && Math.abs(S.t - pt) < 0.15;
    return { d:d, word:pk ? T.peak : d > 0 ? T.rising : T.falling, peak:pk };
  }
  function describe(){
    var pt = peakT(S.k), pv2 = peakV(S.A, S.k), ps = probeState(), y = Cf(S.A, S.k)(S.t);
    var s = "Graph of " + MV.plain(m(S.mode === "factor" ? derivSrc(S.A, S.k) : modelSrc(S.A, S.k))) + ". Peak at t = " + pt.txt + " h, about " + num(pv2.v, 1) + " mg/L. Probe at t = " + num(S.t, 1) + " h";
    if (S.mode === "factor") return s + ", where C′ is about " + num(ps.d, 1) + ". The sign strip shows + before the peak time and − after it. The factor panels show A t rising and e^(−kt) staying above 0.";
    s += ", C about " + num(y, 1) + ", " + ps.word + ".";
    if (S.mode === "window") { var w = win(); s += " Window from t = " + num(S.t1, 1) + " to " + num(S.t2, 1) + "; absolute maximum at t = " + num(w.best.t, 2) + ", about " + num(w.best.v, 1) + " mg/L."; }
    return s;
  }
  function xfmt(t){ return t < -1e-9 ? "" : num(t); }
  function drawMain(){
    var A = S.A, k = S.k, f = Cf(A, k), d = dCf(A, k), pt = 1 / k, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), f3 = css("--f3");
    var sc, v;
    if (S.mode === "factor") {
      v = padView(plot, 12.4, -0.36 * A, 1.12 * A, 36);
      sc = { view:v, xTicks:{ step:2, fmt:xfmt }, curves:[], segments:[], points:[], labels:[] };
      sc.segments.push({ x1:pt, y1:v.ymin, x2:pt, y2:v.ymax, color:ink2, width:1.6, dash:[6, 5] });
      sc.curves.push({ f:d, color:f3, width:2.6, domain:[0, 12] });
      sc.points.push({ x:S.t, y:d(S.t), r:6, color:f3, ring:true });
      sc.after = function(ctx, pl){
        var y0 = pl.H - 26, y1 = pl.H - 5, xa = pl.X(0), xm = pl.X(pt), xb = pl.X(12);
        ctx.save(); ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.strokeRect(xa + 0.5, y0 + 0.5, xb - xa, y1 - y0);
        [[xa, xm, 1], [xm, xb, -1]].forEach(function(s){
          ctx.globalAlpha = 0.22; ctx.fillStyle = css(s[2] > 0 ? "--pen" : "--ink-2"); ctx.fillRect(s[0], y0 + 1, s[1] - s[0], y1 - y0 - 1); ctx.globalAlpha = 1;
          if (s[1] - s[0] > 16) { ctx.fillStyle = ink; ctx.font = ui(18, 700); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s[2] > 0 ? "+" : MINUS, (s[0] + s[1]) / 2, (y0 + y1) / 2 + 1); }
        });
        ctx.restore();
        bgText(ctx, T.peakLabel + ": t = 1/k", Math.min(xm + 6, pl.W - 96), 14, "left", ink2, ui(12, 700));
        bgText(ctx, "C′", pl.X(0.25) + 6, pl.Y(d(0.25)) - 4, "left", f3, mfont(16));
        axisName(ctx, pl, "t, hours");
      };
    } else {
      var top = yScale(); v = padView(plot, 12.4, 0, top, 36, 38);
      sc = { view:v, xTicks:{ step:2, fmt:xfmt }, yTicks:{ fmt:xfmt }, bands:[], curves:[], segments:[], points:[], labels:[] };
      if (S.mode === "window") sc.bands.push({ x0:S.t1, x1:S.t2, color:css("--hi-soft") });
      if (pv && pv.ghost) sc.curves.push({ f:Cf(pv.ghost.A, pv.ghost.k), color:ink2, width:2, dash:[6, 6], domain:[0, 12] });
      sc.segments.push({ x1:pt, y1:0, x2:pt, y2:v.ymax, color:ink2, width:1.6, dash:[6, 5] });
      sc.curves.push({ f:f, color:pen, width:3, domain:[0, 12] });
      var W = S.mode === "window" ? win() : null;
      if (W) W.cands.forEach(function(q){ if (q !== W.best) sc.points.push({ x:q.t, y:q.v, r:5.5, open:true, color:ink }); });
      if (W) sc.points.push({ x:W.best.t, y:W.best.v, r:7, color:ink, ring:true });
      sc.points.push({ x:S.t, y:f(S.t), r:5.5, color:pen });
      sc.after = function(ctx, pl){
        tangentPx(ctx, pl, S.t, f(S.t), d(S.t), 58, ink);
        bgText(ctx, T.peakLabel, Math.min(pl.X(pt) + 6, pl.W - 40), 14, "left", ink2, ui(12, 700));
        if (W) bgText(ctx, T.maxLabel, clamp(pl.X(W.best.t), 60, pl.W - 60), pl.Y(W.best.v) - 22, "center", ink, ui(12, 700));
        if (pv && pv.text) bgText(ctx, pv.text, clamp(pl.X(pv.x), 90, pl.W - 90), pl.Y(pv.y) - (W ? 46 : 26), "center", ink, ui(13, 700));
        axisName(ctx, pl, "t, hours");
      };
    }
    sc.describe = describe();
    plot.draw(sc);
  }
  function drawF1(){
    if (S.mode !== "factor") return;
    var A = S.A, v = padView(pf1, 12.4, 0, 12 * A * 1.08, 30, 18), ink2 = css("--ink-2");
    pf1.draw({ view:v, xTicks:{ step:4, fmt:xfmt }, yTicks:{ step:MV.niceStep(12 * A / 2.5), fmt:xfmt },
      curves:[{ f:function(t){ return A * t; }, color:ink2, width:2.4, dash:[6, 6], domain:[0, 12] }],
      segments:[{ x1:S.t, y1:0, x2:S.t, y2:v.ymax, color:ink2, width:1.2, dash:[3, 4] }],
      points:[{ x:S.t, y:A * S.t, r:4.5, color:css("--ink") }],
      describe:"Rising factor " + A + "t: a straight line through the origin." });
  }
  function drawF2(){
    if (S.mode !== "factor") return;
    var k = S.k, g = function(t){ return Math.exp(-k * t); }, v = padView(pf2, 12.4, 0, 1.15, 30, 18), ink = css("--ink"), ink2 = css("--ink-2"), gv = g(S.t);
    pf2.draw({ view:v, xTicks:{ step:4, fmt:xfmt }, yTicks:{ step:0.5, fmt:xfmt },
      regions:[{ f:g, x0:0, x1:12, color:ink2, alpha:0.15 }],
      curves:[{ f:g, color:ink, width:2.4, dash:[14, 6], domain:[0, 12] }],
      segments:[{ x1:S.t, y1:0, x2:S.t, y2:v.ymax, color:ink2, width:1.2, dash:[3, 4] }],
      points:[{ x:S.t, y:gv, r:4.5, color:ink }],
      after:function(ctx, pl){
        var txt = pv && pv.never ? C.pv.never : (gv >= 0.001 ? "≈ " + num(gv, gv < 0.1 ? 3 : 2) : "tiny") + " > 0";
        bgText(ctx, txt, clamp(pl.X(S.t) + (S.t > 6 ? -8 : 8), 8, pl.W - 8), pl.Y(Math.max(gv, 0)) - 18, S.t > 6 ? "right" : "left", ink, ui(12, 700));
      },
      describe:"Decaying factor e^(−" + kSrc(k) + "t): it falls toward 0 but stays above 0; the shaded band under it never closes. At the probe it is about " + (gv >= 0.001 ? num(gv, 3) : "0.000") + ", still positive." });
  }
  function readout(){
    var A = S.A, k = S.k, f = Cf(A, k), y = f(S.t), ps = probeState(), R = T.rows, pt = peakT(k), pvv = peakV(A, k);
    var dTxt = (Math.abs(ps.d) < 0.05 ? "≈ 0" : "≈ " + (ps.d > 0 ? "+" : MINUS) + num(Math.abs(ps.d), 1)) + " (mg/L)/h, " + ps.word;
    var rows = [[R.model, m(modelSrc(A, k))], [R.probe, m("t = " + num(S.t, 1)) + " h, " + m("C") + " " + (y === 0 ? "= 0" : "≈ " + num(y, 1)) + " mg/L"],
      [R.d, dTxt], [R.ptime, m("t = 1/k") + " = " + pt.html + " h"], [R.pval, m("@a{A}/(ke)") + " = " + pvv.html + " mg/L"]];
    if (S.mode === "window") {
      var w = win(), iv = m("[" + num(S.t1, 1) + ", " + num(S.t2, 1) + "]");
      rows.push([R.win, tpl(T.winMax, [iv, m("t = " + num(w.best.t, 2)) + " (" + (w.best.end ? T.endWord : T.peakWord) + ")", (w.best.v === 0 ? "= 0" : "≈ " + num(w.best.v, 1))])]);
    }
    $("#ox-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function controls(){
    ex.setAttribute("data-mode", S.mode);
    $$("[data-mode]", ex).forEach(function(b){ if (b.tagName === "BUTTON") pressed(b, b.dataset.mode === S.mode); });
    $("#ox-fac", host).hidden = S.mode !== "factor"; $("#ox-win", host).hidden = S.mode !== "window";
    [["A", S.A, function(v){ return num(v); }], ["k", S.k, function(v){ return num(v, 2); }], ["t", S.t, function(v){ return num(v, 1); }], ["t1", S.t1, function(v){ return num(v, 1); }], ["t2", S.t2, function(v){ return num(v, 1); }]].forEach(function(r){
      var inp = $("#ox-" + r[0], host); if (+inp.value !== r[1]) inp.value = r[1]; $("#ox-" + r[0] + "o", host).textContent = r[2](r[1]);
    });
    $("#ox-eq", host).innerHTML = m(S.mode === "factor" ? derivSrc(S.A, S.k) : modelSrc(S.A, S.k));
    $("#ox-gcap", host).innerHTML = T.gcap[S.mode]; $("#ox-key", host).innerHTML = T.key[S.mode];
  }
  function paint(){ controls(); readout(); drawMain(); drawF1(); drawF2(); }
  function update(){ pv = null; lockY = null; api.save(); paint(); MV.changed(); }
  function setBusy(b){ busy = b; $$("#ox-side button, #ox-side input, #ox-win input", host).forEach(function(el){ el.disabled = b; }); }
  ex.addEventListener("input", function(e){
    var t = e.target, id = t.dataset && t.dataset.sl; if (!id || busy) return;
    var v = +t.value;
    if (id === "A") S.A = Math.round(v);
    else if (id === "k") S.k = r2(Math.round(v * 20) / 20);
    else if (id === "t") S.t = r2(v);
    else if (id === "t1") { S.t1 = Math.min(v, 11.5); if (S.t2 < S.t1 + 0.5) S.t2 = S.t1 + 0.5; }
    else if (id === "t2") { S.t2 = Math.max(v, 0.5); if (S.t1 > S.t2 - 0.5) S.t1 = S.t2 - 0.5; }
    update();
  });
  ex.addEventListener("click", function(e){
    var b = e.target.closest("button[data-mode]"); if (!b || b.disabled || busy) return;
    S.mode = b.dataset.mode; update();
  });
  // drag the probe along the curve (arrow keys step 0.1 h; Shift for 1 h)
  MV.drag(plot, { axis:"x", step:{ x:0.1, y:1 }, big:10,
    handles:function(){ var y = S.mode === "factor" ? dCf(S.A, S.k)(S.t) : Cf(S.A, S.k)(S.t); return [{ id:"probe", x:S.t, y:y, label:"Probe at t = " + num(S.t, 1) + " hours. Arrow keys move it." }]; },
    move:function(id, x){ if (busy) return; S.t = r2(clamp(Math.round(x * 10) / 10, 0, 12)); update(); } });
  paint();

  // ---------- challenges (plan: exact tests and named wrong states) ----------
  function state(){ var pt = peakT(S.k), pvv = peakV(S.A, S.k); return { A:S.A, k:r2(S.k), pt:pt, pv:pvv }; }
  function challenge(id){
    var M = MS[id], s = state(), gen = tpl(M.general, [MV.plain(s.pt.html), MV.plain(s.pv.html)]);
    if (id === "tc1") {
      if (near(s.k, 0.25)) return { ok:true };
      if (near(s.k, 4)) return { ok:false, msg:M.k4 };
      if (near(s.k, 0.5)) return { ok:false, msg:M.k05 };
      return { ok:false, msg:gen };
    }
    if (id === "tc2") {
      if (near(s.k, 0.5) && s.A === 20) return { ok:true };
      if (near(s.k, 0.5) && s.A === 40) return { ok:false, msg:M.a40 };
      if (near(s.k, 2)) return { ok:false, msg:M.k2 };
      return { ok:false, msg:gen };
    }
    if (id === "tc3") {
      if (near(s.k, 0.4) && s.A === 12) return { ok:true };
      if (near(s.k, 0.4) && s.A === 30) return { ok:false, msg:M.a30 };
      if (near(s.k, 2.5)) return { ok:false, msg:M.k25 };
      return { ok:false, msg:gen };
    }
    return { ok:false };
  }

  // ---------- predictions: start states from content; reveals animate A, k or the probe ----------
  function fin(done){ anim = null; setBusy(false); api.save(); paint(); MV.changed(); done(); }
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        var s = p.start || {};
        pv = null; lockY = null;
        S.mode = s.mode || "dose"; S.A = s.A; S.k = s.k; S.t = s.t != null ? s.t : 1.5;
        if (s.t1 != null) { S.t1 = s.t1; S.t2 = s.t2; }
        setBusy(true); api.save(); paint();
      },
      run:function(p, done){
        var P = C.pv;
        if (p.id === "p1") {
          lockY = niceUp(peakV(40, 0.5).v * 1.15); pv = { ghost:{ A:20, k:0.5 } }; paint();
          anim = MV.tween({ dur:1700, step:function(t){ S.A = Math.round(20 + 20 * t); controls(); readout(); drawMain(); }, done:function(){ S.A = 40; pv.text = P.still; pv.x = 2; pv.y = Cf(40, 0.5)(2); fin(done); } });
        } else if (p.id === "p2") {
          lockY = niceUp(peakV(20, 0.5).v * 1.3); pv = { ghost:{ A:20, k:0.5 } }; paint();
          anim = MV.tween({ dur:1700, step:function(t){ S.k = r2(Math.round((0.5 + 0.5 * t) * 20) / 20); controls(); readout(); drawMain(); }, done:function(){ S.k = 1; pv.text = P.slid; pv.x = 1; pv.y = Cf(20, 1)(1); fin(done); } });
        } else if (p.id === "p3") {
          anim = MV.tween({ dur:2400, ease:lin, step:function(t){ S.t = r2(12 * t); controls(); readout(); drawMain(); drawF1(); drawF2(); }, done:function(){ S.t = 12; pv = { never:true }; fin(done); } });
        } else if (p.id === "p4") {
          anim = MV.tween({ dur:1800, ease:lin, step:function(t){ S.t = r2(3 + 5 * t); controls(); readout(); drawMain(); }, done:function(){ S.t = 8; pv = { text:P.left, x:3, y:Cf(20, 0.5)(3) }; fin(done); } });
        } else fin(done);
      }
    },
    challenge:function(id){ return challenge(id); }
  };
}

// =====================================================================================================================
// @component V11 signChart (copied from MCV4U 18, adapted for optimization) — one row per factor of the derivative, the
// derivative's sign, and a behaviour row for the objective (↗ increasing / ↘ decreasing, and the word for the critical
// number: "least" or "greatest"). The domain runs from lo to hi; the table scrolls inside its box on phones.
//   signChartHTML({ v:"p", lo, hi, crit:[c], top:[{s, f}], d:function(x), dLabel, fLabel, critWord })
function signChartHTML(o){
  var edges = [o.lo].concat(o.crit, [o.hi]), cols = [], i;
  for (i = 0; i + 1 < edges.length; i++) {
    var a = edges[i], b = edges[i + 1];
    cols.push({ iv:true, a:a, b:b, mid:(a + b) / 2 });
    if (i < o.crit.length) cols.push({ iv:false, x:o.crit[i] });
  }
  function sg(v){ return v > 1e-12 ? "+" : v < -1e-12 ? MINUS : "0"; }
  var h = '<div class="tbl-wrap ox-sc-wrap"><table class="vt ox-sct"><caption class="vh">Sign chart of ' + MV.plain(o.dLabel) + "</caption><thead><tr><th scope=\"col\">" + m(o.v) + "</th>" +
    cols.map(function(c){ return '<th scope="col">' + (c.iv ? "(" + num(c.a) + ", " + num(c.b) + ")" : num(c.x)) + "</th>"; }).join("") + "</tr></thead><tbody>";
  h += o.top.map(function(F){ return '<tr><th scope="row">' + m(F.s) + "</th>" + cols.map(function(c){ return "<td>" + sg(F.f(c.iv ? c.mid : c.x)) + "</td>"; }).join("") + "</tr>"; }).join("");
  h += '<tr class="ox-sc-d"><th scope="row">' + o.dLabel + "</th>" + cols.map(function(c){ return "<td>" + (c.iv ? sg(o.d(c.mid)) : "0") + "</td>"; }).join("") + "</tr>";
  h += '<tr><th scope="row">' + o.fLabel + "</th>" + cols.map(function(c){
    if (!c.iv) return '<td class="ox-sc-u">' + o.critWord + "</td>";
    var up = o.d(c.mid) > 0;
    return '<td class="ox-sc-ar"><span aria-hidden="true">' + (up ? "↗" : "↘") + '</span><span class="vh">' + (up ? "increasing" : "decreasing") + "</span></td>";
  }).join("") + "</tr></tbody></table></div>";
  return h;
}
// ------------------------------------------------- end of V11 signChart ---------------------------------------------------------

// =====================================================================================================================
// @component V10 shapeStage (copied from MCV4U 18) — a figure driven by one variable beside its objective graph: the objective
// in --pen, an optional feasible-domain band (the curve is dashed outside it), and the current point with a drag handle
// (arrow keys step it; Shift for big steps). A slider under the stage drives the same value.
//   var st = shapeStage(host, { fig:"html", cap, sl, aria, min, max, step, big, value, fmt(v), view(plot), f, plot:[a, b], band:[a, b],
//     xTicks, yTicks, xName, extra(v) -> {curves, points, labels, segments}, describe(v), handle(v), onChange(v) });
function shapeStage(host, o){
  var v = o.value;
  host.innerHTML = '<div class="ox-ss"><div class="ox-ss-fig">' + o.fig + '</div><div class="ox-ss-g"><p class="ox-gcap">' + o.cap + '</p><div class="plot-wrap"><canvas class="plot" role="img" aria-label="Objective graph"></canvas></div></div></div>' +
    '<label class="slider ox-ss-sl"><span class="slider-top"><span>' + o.sl + "</span><output></output></span>" +
    '<input type="range" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" style="accent-color:var(--ink)" aria-label="' + MV.esc(o.aria) + '"></label>';
  var cv = $("canvas", host), out = $(".ox-ss-sl output", host), inp = $(".ox-ss-sl input", host);
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 });
  function snap(x){ var s = Math.round((x - o.min) / o.step) * o.step + o.min; return clamp(Math.round(s * 1e6) / 1e6, o.min, o.max); }
  plot.render = function(){
    var pen = css("--pen"), ink2 = css("--ink-2"), view = o.view(plot), y = o.f(v);
    var sc = { view:view, xTicks:o.xTicks, yTicks:o.yTicks, bands:[], curves:[], segments:[], points:[], labels:[] };
    if (o.band) { sc.bands.push({ x0:o.band[0], x1:o.band[1], color:css("--hi-soft") });
      sc.curves.push({ f:o.f, color:pen, width:2, dash:[6, 6], domain:o.plot }); sc.curves.push({ f:o.f, color:pen, width:3, domain:o.band }); }
    else sc.curves.push({ f:o.f, color:pen, width:3, domain:o.plot });
    var ex = o.extra ? o.extra(v) : {};
    ["curves", "segments", "points", "labels"].forEach(function(k){ if (ex[k]) sc[k] = sc[k].concat(ex[k]); });
    sc.segments.push({ x1:v, y1:Math.max(view.ymin, 0), x2:v, y2:y, color:ink2, width:1.5, dash:[4, 5] });
    sc.points.push({ x:v, y:y, r:6.5, color:css("--ink"), ring:true });
    sc.after = function(ctx, pl){ if (o.xName) axisName(ctx, pl, o.xName); };
    sc.describe = o.describe(v);
    plot.draw(sc);
  };
  MV.drag(plot, { axis:"x", step:{ x:o.step, y:1 }, big:o.big || 5,
    handles:function(){ return [{ id:"pt", x:v, y:o.f(v), label:o.handle(v) }]; },
    move:function(id, x){ set(snap(x), true); } });
  inp.addEventListener("input", function(){ set(+inp.value, true); });
  function set(x, user){ v = snap(x); inp.value = v; out.textContent = o.fmt(v); plot.render(); if (user && o.onChange) o.onChange(v); }
  set(v);
  return { get:function(){ return v; }, set:set, redraw:function(){ plot.render(); } };
}
// ------------------------------------------------- end of V10 shapeStage --------------------------------------------------------

// =====================================================================================================================
// @component N29 modelSlots (copied from MCV4U 17) — chip-slot model builder: labelled slots and one tray of chips. Tap a chip,
// then a slot (or a slot, then a chip; Enter works on every button). Chips carry answer = their slot id, or "no" for traps
// with their own feedback; a right chip locks into its slot, a wrong one stays in the tray with feedback.
//   modelSlots(host, { key, slots:[{id, label}], roles:{id:"the …"}, chips:[{t, answer, fb}], st:{placed, tries}, save(), done, onDone() })
function modelSlots(host, o){
  var st = o.st, sel = null, act = null, msg = null;
  st.placed = st.placed || {}; st.tries = st.tries || 0;
  function placedIdx(){ var u = {}; Object.keys(st.placed).forEach(function(k){ u[st.placed[k]] = 1; }); return u; }
  function full(){ return o.slots.every(function(s){ return st.placed[s.id] != null; }); }
  function paint(){
    var used = placedIdx(), done = full();
    MV.keepFocus(host, function(){
      var h = '<div class="ox-slots">' + o.slots.map(function(s){
        var ci = st.placed[s.id], c = ci != null ? o.chips[ci] : null;
        return '<button type="button" class="ox-slot' + (c ? " full" : "") + (act === s.id ? " on" : "") + '" data-slot="' + s.id + '" data-k="' + o.key + "s" + s.id + '" aria-pressed="' + (act === s.id) + '"' + (c ? " disabled" : "") +
          ' aria-label="' + MV.esc(s.label + ": " + (c ? MV.plain(c.t) : "empty")) + '"><span class="ox-sll">' + s.label + '</span><span class="ox-slv">' + (c ? "✓ " + c.t : "empty") + "</span></button>";
      }).join("") + "</div>";
      if (!done) h += '<div class="ox-tray" role="group" aria-label="Chips">' + o.chips.map(function(c, i){
        if (used[i]) return "";
        return '<button type="button" class="chip ox-mchip" data-chip="' + i + '" data-k="' + o.key + "c" + i + '" aria-pressed="' + (sel === i) + '">' + c.t + "</button>";
      }).join("") + "</div>";
      if (done) h += MV.fbHTML("good", "<strong>✓ " + o.done + "</strong>");
      else if (msg) h += MV.fbHTML(msg.good ? "good" : "bad", msg.html);
      else h += '<p class="tiny muted ox-mtip">' + (sel != null ? "Now tap the slot for this chip." : act ? "Now tap the chip for this slot." : "Tap a chip, then its slot.") + "</p>";
      host.innerHTML = h;
    });
  }
  function place(ci, sid){
    var c = o.chips[ci], ans = MV.ans(c), sl = o.slots.filter(function(s){ return s.id === sid; })[0];
    sel = null; act = null;
    if (ans === sid) { st.placed[sid] = ci; msg = full() ? null : { good:true, html:"<strong>✓ " + sl.label + ":</strong> " + c.t + "." }; o.save(); paint(); if (full() && o.onDone) o.onDone(); MV.focusFb(host); return; }
    st.tries++;
    msg = { good:false, html:"<strong>✗ Not quite.</strong> " + (ans === "no" ? c.fb : c.t + " is " + o.roles[ans] + ", not " + o.roles[sid] + ".") + " Try again." };
    o.save(); paint(); MV.focusFb(host);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    e.stopPropagation();
    if (b.dataset.chip != null) { var ci = +b.dataset.chip; msg = null; if (act) place(ci, act); else if (o.slots.length === 1) place(ci, o.slots[0].id); else { sel = sel === ci ? null : ci; paint(); } return; }
    if (b.dataset.slot) { msg = null; if (sel != null) place(sel, b.dataset.slot); else { act = act === b.dataset.slot ? null : b.dataset.slot; paint(); } }
  });
  paint();
  return { full:full };
}
// ------------------------------------------------- end of N29 modelSlots --------------------------------------------------------

// ---------- Part 3: Revenue with exponential demand (three stations) ----------
var DEM = function(p){ return 600 * Math.exp(-p / 20); };
var BAR = { price:{ max:80, t:"price" }, qty:{ max:600, t:"tickets" }, rev:{ max:5000, t:"revenue" }, prof:{ max:5000, t:"profit" } };
function barsSVG(keys, obj){
  var w = 44, gap = 16, x0 = 14, W = x0 * 2 + keys.length * w + (keys.length - 1) * gap;
  return '<svg class="ox-bars" viewBox="0 0 ' + W + ' 220" aria-hidden="true"><line class="ox-bar-ax" x1="6" y1="180" x2="' + (W - 6) + '" y2="180"/>' + keys.map(function(k, i){
    var x = x0 + i * (w + gap);
    return '<rect class="ox-bar ' + (k === obj ? "ox-bar-obj" : "ox-bar-oth") + '" data-bar="' + k + '" x="' + x + '" width="' + w + '" y="180" height="0"/>' +
      '<text class="ox-bar-v" data-bv="' + k + '" x="' + (x + w / 2) + '" y="172" text-anchor="middle"></text><text class="ox-bar-l" x="' + (x + w / 2) + '" y="200" text-anchor="middle">' + BAR[k].t + "</text>";
  }).join("") + "</svg>";
}
function setBars(box, vals){
  Object.keys(vals).forEach(function(k){
    var r = box.querySelector('[data-bar="' + k + '"]'), t = box.querySelector('[data-bv="' + k + '"]'); if (!r) return;
    var v = vals[k], hgt = clamp(Math.max(0, v[0]) / BAR[k].max, 0, 1) * 150;
    r.setAttribute("y", 180 - hgt); r.setAttribute("height", hgt); t.setAttribute("y", 180 - hgt - 6); t.textContent = v[1];
  });
}
function part3(host, api){
  var S = api.S, P3 = api.content, ST = P3.stations, B = P3.build;
  if (["s1", "s2", "s3"].indexOf(S.st) < 0) S.st = "s1";
  S.ms = S.ms || {};
  if (!(S.p1 >= 0 && S.p1 <= 80)) S.p1 = 10;
  if (!(S.p2 >= 0 && S.p2 <= 15)) S.p2 = 5;
  if (!(S.p3 >= 5 && S.p3 <= 80)) S.p3 = 10;
  host.innerHTML = '<div class="chips ox-stns" role="group" aria-label="Choose a station">' + ST.map(function(s, i){
    return '<button type="button" class="fchip ox-stchip" data-st="' + s.id + '" data-k="oxst' + s.id + '" aria-pressed="false">' + (i + 1) + ". " + s.chip + "</button>"; }).join("") + '</div><div id="ox-stn"></div>';
  var box = $("#ox-stn", host);
  function stn(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function algHTML(s, chart){
    return '<details class="alg ox-alg"><summary>' + B.algSummary + '</summary><ol class="ox-alg-steps">' + s.alg.map(function(t){ return "<li>" + t + "</li>"; }).join("") + "</ol>" +
      MV.usesHTML(" " + s.use) + '<p class="ox-sch">' + B.signTitle + "</p>" + chart + "</details>";
  }
  function trendRow(d, best, s){ return best ? '<span class="ox-best">✓ ' + s.best + "</span>" : d > 0 ? B.trend.up : B.trend.down; }
  function render(){
    $$("[data-st]", host).forEach(function(b){ pressed(b, b.dataset.st === S.st); });
    var s = stn(S.st), mst = S.ms[s.id] = S.ms[s.id] || {};
    box.innerHTML = '<div class="ox-stp"><h3>' + s.title + "</h3><p>" + s.text + '</p><div class="ox-build"><p class="ox-frame" id="ox-frame"></p><p class="how">' + B.how + '</p><div id="ox-slots"></div></div>' +
      '<p class="tiny muted ox-first" id="ox-first">' + B.first + '</p><div class="ox-stage" id="ox-stage" hidden><p class="banner" id="ox-sbn" aria-live="polite"></p><div id="ox-ssh"></div>' +
      '<dl class="read ox-sread" id="ox-sread" aria-live="polite"></dl>' + (s.note ? '<div class="refresh ox-note"><p>' + s.note + "</p></div>" : "") + '<div id="ox-algh"></div></div></div>';
    var sh = $("#ox-ssh", box), read = $("#ox-sread", box), bn = $("#ox-sbn", box), stage = $("#ox-stage", box);
    var ms = modelSlots($("#ox-slots", box), { key:"oxms" + s.id, slots:s.slots, roles:s.roles, chips:s.chips, st:mst, save:api.save, done:B.done, onDone:showStage });
    function frame(){ $("#ox-frame", box).innerHTML = ms.full() ? '<strong>' + s.model + "</strong>" : s.frame; }
    frame();
    var built = false;
    function showStage(){
      frame(); $("#ox-first", box).hidden = true; stage.hidden = false;
      if (built) return; built = true;
      if (s.id === "s1") {
        var R = function(p){ return p * DEM(p); };
        shapeStage(sh, { fig:barsSVG(["price", "qty", "rev"], "rev"), cap:s.graph, sl:B.slider, aria:"Ticket price in dollars", min:0, max:80, step:1, big:5, value:S.p1,
          fmt:function(p){ return "$" + num(p); }, f:R, plot:[0, 80], xName:"price, dollars",
          view:function(pl){ return padView(pl, 82, 0, 5000, 44, 26); }, xTicks:{ step:10, fmt:noNeg(function(t){ return "$" + num(t); }) }, yTicks:{ step:1000, fmt:noNeg(function(t){ return "$" + num(t); }) },
          extra:function(){ return { segments:[{ x1:20, y1:0, x2:20, y2:R(20), color:css("--ink-2"), width:1.4, dash:[6, 5] }] }; },
          handle:function(p){ return "$" + num(p) + ": revenue " + moneyA(R(p)); },
          describe:function(p){ return "Revenue R(p) = p · 600e^(−p/20) for prices from $0 to $80; highest point at $20, about $4415. Current point: $" + num(p) + ", revenue " + moneyA(R(p)) + "."; },
          onChange:function(p){ S.p1 = p; api.save(); upd(p); } });
        var upd = function(p){
          var q = DEM(p), d = 600 * Math.exp(-p / 20) * (1 - p / 20), best = near(p, 20);
          setBars(sh, { price:[p, "$" + num(p)], qty:[q, num(Math.round(q))], rev:[R(p), money(R(p))] });
          read.innerHTML = MV.readoutHTML([[s.rows.p, "$" + num(p)], [s.rows.q, (Math.abs(q - Math.round(q)) > 1e-9 ? "≈ " : "") + num(Math.round(q))], [s.rows.R, moneyA(R(p))], [s.rows.trend, trendRow(d, best, s)]]);
          bn.className = "banner" + (best ? " good" : ""); bn.textContent = "";
        };
        upd(S.p1);
        $("#ox-algh", box).innerHTML = algHTML(s, signChartHTML({ v:"p", lo:0, hi:80, crit:[20], dLabel:m("R′(p)"), fLabel:m("R(p)"), critWord:"greatest",
          top:[{ s:"600e^{-p/20}", f:function(){ return 1; } }, { s:"1 - p/20", f:function(p){ return 1 - p / 20; } }], d:function(p){ return 1 - p / 20; } }));
      } else if (s.id === "s2") {
        var R2 = function(p){ return p * DEM(p); };
        shapeStage(sh, { fig:barsSVG(["price", "qty", "rev"], "rev"), cap:s.graph, sl:B.slider, aria:"Ticket price in dollars, capped at 15", min:0, max:15, step:1, big:5, value:S.p2,
          fmt:function(p){ return "$" + num(p); }, f:R2, plot:[0, 40], band:[0, 15], xName:"price, dollars",
          view:function(pl){ return padView(pl, 41, 0, 5000, 44, 26); }, xTicks:{ step:5, fmt:noNeg(function(t){ return "$" + num(t); }) }, yTicks:{ step:1000, fmt:noNeg(function(t){ return "$" + num(t); }) },
          extra:function(){ return { labels:[{ x:7.5, y:4700, text:"prices allowed", align:"center", color:css("--ink-2"), font:ui(12) }, { x:20, y:R2(20), text:"peak at $20: not allowed", dy:-16, align:"left", dx:4, bg:true, color:css("--ink-2"), font:ui(12) }] }; },
          handle:function(p){ return "$" + num(p) + ": revenue " + moneyA(R2(p)); },
          describe:function(p){ return "Revenue R(p) = p · 600e^(−p/20); the prices allowed, $0 to $15, are shaded. R is increasing on the whole band; its peak at $20 is outside it. Current point: $" + num(p) + ", revenue " + moneyA(R2(p)) + "."; },
          onChange:function(p){ S.p2 = p; api.save(); upd2(p); } });
        var upd2 = function(p){
          var q = DEM(p), best = near(p, 15);
          setBars(sh, { price:[p, "$" + num(p)], qty:[q, num(Math.round(q))], rev:[R2(p), money(R2(p))] });
          read.innerHTML = MV.readoutHTML([[s.rows.p, "$" + num(p)], [s.rows.q, (Math.abs(q - Math.round(q)) > 1e-9 ? "≈ " : "") + num(Math.round(q))], [s.rows.R, moneyA(R2(p))], [s.rows.trend, trendRow(1, best, s)]]);
          bn.className = "banner" + (best ? " good" : ""); bn.textContent = "";
        };
        upd2(S.p2);
        $("#ox-algh", box).innerHTML = algHTML(s, signChartHTML({ v:"p", lo:0, hi:15, crit:[], dLabel:m("R′(p)"), fLabel:m("R(p)"), critWord:"",
          top:[{ s:"600e^{-p/20}", f:function(){ return 1; } }, { s:"1 - p/20", f:function(p){ return 1 - p / 20; } }], d:function(p){ return 1 - p / 20; } }));
      } else {
        var Rv = function(p){ return p * DEM(p); }, Pf = function(p){ return (p - 5) * DEM(p); };
        shapeStage(sh, { fig:barsSVG(["price", "qty", "rev", "prof"], "prof"), cap:s.graph, sl:B.slider, aria:"Ticket price in dollars", min:5, max:80, step:1, big:5, value:S.p3,
          fmt:function(p){ return "$" + num(p); }, f:Pf, plot:[5, 80], xName:"price, dollars",
          view:function(pl){ return padView(pl, 82, 0, 4000, 44, 26); }, xTicks:{ step:10, fmt:noNeg(function(t){ return "$" + num(t); }) }, yTicks:{ step:1000, fmt:noNeg(function(t){ return "$" + num(t); }) },
          extra:function(){ return { curves:[{ f:Rv, color:css("--ink-2"), width:2, dash:[6, 6], domain:[5, 80] }], segments:[{ x1:25, y1:0, x2:25, y2:Pf(25), color:css("--ink-2"), width:1.4, dash:[6, 5] }],
            labels:[{ x:44, y:Rv(44), text:"revenue", dx:6, dy:-12, align:"left", color:css("--ink-2"), font:ui(12) }, { x:60, y:Pf(60), text:"profit", dx:6, dy:-12, align:"left", color:css("--pen"), font:ui(12, 700) }] }; },
          handle:function(p){ return "$" + num(p) + ": profit " + moneyA(Pf(p)); },
          describe:function(p){ return "Profit P(p) = (p − 5) · 600e^(−p/20) for prices from $5 to $80, with revenue dashed above it; profit is highest at $25, about $3438. Current point: $" + num(p) + ", profit " + moneyA(Pf(p)) + "."; },
          onChange:function(p){ S.p3 = p; api.save(); upd3(p); } });
        var upd3 = function(p){
          var q = DEM(p), d = 1 - (p - 5) / 20, best = near(p, 25);
          setBars(sh, { price:[p, "$" + num(p)], qty:[q, num(Math.round(q))], rev:[Rv(p), money(Rv(p))], prof:[Pf(p), money(Pf(p))] });
          read.innerHTML = MV.readoutHTML([[s.rows.p, "$" + num(p)], [s.rows.q, (Math.abs(q - Math.round(q)) > 1e-9 ? "≈ " : "") + num(Math.round(q))], [s.rows.R, moneyA(Rv(p))], [s.rows.c, moneyA(5 * q)], [s.rows.P, moneyA(Pf(p))], [s.rows.trend, trendRow(d, best, s)]]);
          bn.className = "banner" + (best ? " good" : ""); bn.textContent = "";
        };
        upd3(S.p3);
        $("#ox-algh", box).innerHTML = algHTML(s, signChartHTML({ v:"p", lo:5, hi:80, crit:[25], dLabel:m("P′(p)"), fLabel:m("P(p)"), critWord:"greatest",
          top:[{ s:"600e^{-p/20}", f:function(){ return 1; } }, { s:"1 - (p - 5)/20", f:function(p){ return 1 - (p - 5) / 20; } }], d:function(p){ return 1 - (p - 5) / 20; } }));
      }
    }
    if (ms.full()) showStage();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-st]"); if (!b) return;
    S.st = b.dataset.st; api.save(); render();
  });
  render();
}

// =====================================================================================================================
// ---------- Practice 1 and 2: Find the critical numbers, Optimize the model ----------
// @component V8 designBoxes (adapted from MCV4U 25: values with e and ln through V8 eNumber; chip choices; units; $) — labelled
// answer boxes per item: single values, lists ("0, 2"; order-free) and two-way chip choices; named wrong states ({k, eq} a value,
// list or choice id), a "give the exact value" message (not counted as a try) for decimals within 0.6 % of an e/ln answer,
// first-try scoring and three-level help where the item has hints.
function designBoxes(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q ox-dq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="ox-din"></div><div class="ox-dcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .ox-din', host);
    var h = '<div class="ox-dt">' + it.boxes.map(function(b){
      var lab = MV.plain(b.pre || "");
      if (b.choice) return '<div class="ox-dr"><span class="ox-dl">' + b.pre + '</span><span class="chips ox-dch" role="group" aria-label="' + MV.esc(lab) + '">' + b.choice.map(function(c){
        var on = x.v[b.k] === c.id;
        return '<button type="button" class="chip' + (on ? " on" : "") + '" data-pick="' + b.k + '" data-id="' + c.id + '" data-k="' + it.id + b.k + c.id + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</span></div>";
      return '<div class="ox-dr"><span class="ox-dl">' + b.pre + "</span>" + (b.money ? '<span class="ox-pre" aria-hidden="true">$</span>' : "") +
        '<input class="numin ox-box" data-bx="' + b.k + '" data-k="' + it.id + "bx" + b.k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(lab + (b.unit ? " (" + b.unit + ")" : "")) + '" value="' + MV.esc(x.v[b.k] || "") + '"' + (x.solved ? " disabled" : "") + ">" +
        (b.unit ? '<span class="ox-u">' + b.unit + "</span>" : "") + "</div>";
    }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .ox-dcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, i, b;
    for (i = 0; i < it.boxes.length; i++) {
      b = it.boxes[i];
      var raw = String(x.v[b.k] || "").trim();
      if (!raw) return { err:TX.fill };
      if (b.choice) { vals[b.k] = raw; continue; }
      if (b.list) { var l = eList(raw); if (!l) return { err:TX.err }; vals[b.k] = l.map(function(q){ return q.v; }); continue; }
      var p = eNum(raw); if (!p) return { err:TX.err }; vals[b.k] = p.v;
    }
    function isList(k){ return it.boxes.some(function(q){ return q.k === k && q.list; }); }
    function same(k, A, tol){
      var V = vals[k];
      if (typeof A === "string") return V === A;
      if (Array.isArray(A)) { if (!Array.isArray(V) || V.length !== A.length) return false; return isList(k) ? MV.sameNums(V, A, tol) : V.every(function(v, j){ return near(v, A[j], tol); }); }
      return typeof V === "number" && near(V, A, tol);
    }
    var keys = Object.keys(ans);
    if (keys.every(function(k){ return same(k, ans[k], 1e-9); })) return { ok:true };
    var W = it.wrong || [];
    for (i = 0; i < W.length; i++) if (same(W[i].k, W[i].eq, 1e-9)) return { msg:W[i].fb };
    if (keys.every(function(k){ return same(k, ans[k], 0.006); })) return { exact:true };
    return { msg:it.general || TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.pick) { x.v[b.dataset.pick] = b.dataset.id; msgs[it.id] = null; api.save(); paintIn(it); paintCl(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.exact) msgs[it.id] = { bad:false, html:TX.exact };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}
// ------------------------------------------------- end of V8 designBoxes --------------------------------------------------------

// =====================================================================================================================
// ---------- Performance task: Dose design, C(t) = A t e^(−kt) with A = 5 … 60 and k = 1/2 … 1/6 ----------
var KS = [2, 3, 4, 5, 6];
var task = (function(){
  var api, plot, T;
  function read(){ var s = api ? api.S : {}; return { A:+s.A || 20, n:KS.indexOf(+s.n) >= 0 ? +s.n : null }; }
  function checks(D){ if (!D.n) return [false, false, false]; return [D.n >= 2 && D.n <= 5, D.A * D.n >= 40 && D.A * D.n <= 60, D.n > 3]; }
  function draw(){
    var D = read(), pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2");
    if (!D.n) { plot.draw({ view:{ xmin:0, xmax:12.4, ymin:0, ymax:30 }, describe:"Empty graph: choose k." }); return; }
    var k = 1 / D.n, f = Cf(D.A, k), d = dCf(D.A, k), pk = D.A * D.n / Math.E, top = Math.max(26, niceUp(pk * 1.25)), v = padView(plot, 12.4, 0, top, 34, 24);
    var lo = 40 / Math.E, hi = 60 / Math.E, d3 = d(3);
    plot.draw({ view:v, xTicks:{ step:2, fmt:noNeg() }, yTicks:{ fmt:noNeg() },
      regions:[{ f:function(){ return hi; }, g:function(){ return lo; }, x0:0, x1:12.4, color:css("--hi-soft") }],
      curves:[{ f:f, color:pen, width:3, domain:[0, 12] }],
      segments:[{ x1:D.n, y1:0, x2:D.n, y2:pk, color:ink2, width:1.5, dash:[5, 5] }],
      points:[{ x:D.n, y:pk, r:6, color:pen }, { x:3, y:f(3), r:5, color:ink, ring:true }],
      after:function(ctx, pl){
        tangentPx(ctx, pl, 3, f(3), d3, 52, ink);
        ctx.save(); ctx.font = ui(12); ctx.fillStyle = ink2; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(MV.plain(T.read.band), pl.W - 6, pl.Y(hi) - 2); ctx.restore();
        bgText(ctx, "peak (" + num(D.n) + " h, " + num(pk, 1) + ")", clamp(pl.X(D.n) + 10, 8, pl.W - 150), Math.max(14, pl.Y(pk) - 18), "left", pen, ui(12, 700));
        bgText(ctx, "C′(3) " + (Math.abs(d3) < 1e-9 ? "= 0" : d3 > 0 ? "> 0: rising" : "< 0: falling"), clamp(pl.X(3) + 10, 8, pl.W - 130), Math.min(pl.H - 40, pl.Y(f(3)) + 28), "left", ink, ui(12, 700));
        axisName(ctx, pl, "t, hours");
      },
      describe:"Your dose curve C(t) = " + D.A + "t e^(−t/" + D.n + "). It peaks at t = " + D.n + " h with about " + num(pk, 1) + " mg/L. The band from 40/e to 60/e (about 14.7 to 22.1 mg/L) is shaded. At t = 3 h the tangent is " + (Math.abs(d3) < 1e-9 ? "horizontal" : d3 > 0 ? "rising" : "falling") + "." });
  }
  function readout(){
    var D = read(), el = $("#ox-tread"); if (!el) return;
    $("#ox-tAo").textContent = num(D.A);
    if (!D.n) { el.innerHTML = ""; return; }
    var q = Q.of(D.A * D.n, 1), d3 = 1 - 3 / D.n;
    el.innerHTML = MV.readoutHTML([[T.read.ptime, num(D.n) + " h"], [T.read.pval, m("{" + q.n + "}/{e}") + " ≈ " + num(D.A * D.n / Math.E, 1) + " mg/L"],
      [T.read.d3, Math.abs(d3) < 1e-9 ? m("= 0") + " (peak at 3 h, not rising)" : d3 > 0 ? "> 0: still rising" : "< 0: already falling"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; if (a.S.A == null) { a.S.A = 20; a.S.n = 2; }
      inp.innerHTML = '<label class="slider ox-tsl"><span class="slider-top"><span>' + T.inputs.A + ' <span class="tiny muted">' + T.inputs.Anote + '</span></span><output id="ox-tAo" style="color:var(--acol)"></output></span>' +
        '<input type="range" data-tl="A" min="5" max="60" step="5" value="' + a.S.A + '" style="accent-color:var(--acol)" aria-label="Dose factor A"></label>' +
        '<p class="ox-tkl">' + T.inputs.k + '</p><div class="chips ox-tk" role="group" aria-label="Elimination rate k">' + KS.map(function(n){
          return '<button type="button" class="fchip" data-tk="' + n + '" data-k="oxtk' + n + '" aria-pressed="' + (+a.S.n === n) + '" aria-label="k = 1/' + n + '">' + m("{1}/{" + n + "}") + "</button>"; }).join("") + "</div>";
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="ox-tplot" role="img" aria-label="Your dose curve"></canvas></div><dl class="read" id="ox-tread" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#ox-tplot"), { xmin:0, xmax:12.4, ymin:0, ymax:30 }); plot.render = draw;
      function upd(){ a.save(); draw(); readout(); a.update(); }
      inp.addEventListener("input", function(e){ if (e.target.dataset.tl !== "A") return; a.S.A = +e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-tk]"); if (!b) return;
        a.S.n = +b.dataset.tk; $$("[data-tk]", inp).forEach(function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); upd();
      });
      draw(); readout();
    },
    read:read,
    valid:function(D){ return D.n ? true : "Choose a value of k."; },
    checks:checks,
    key:function(D){ return D.A + "|" + D.n; },
    label:function(k){ var p = k.split("|"); return m("@a{A} = " + p[0] + ", k = 1/" + p[1]); },
    text:function(k){ var p = k.split("|"); return "A = " + p[0] + ", k = 1/" + p[1] + " (peak at " + p[1] + " h, " + (+p[0] * +p[1]) + "/e mg/L)"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ crit:designBoxes, opt:designBoxes },
  task:task
});
})();
