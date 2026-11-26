// MCV4U 30 Derivatives of Tangent and Cotangent: hero (a tangent slides along y = tan x while its slope draws the U of
// sec²x above the line y = 1), Steep tangent (Explore: V5 two-panel slope tool for tan x, cot x and tan x − 4x with asymptote
// clipping, a π/24 point slider, special-angle chips, N8 tap-to-mark with max/min labels, candidate overlays and an N13
// "Derive it" step-through), Using the trig derivatives (Part 3: V8 tangent-line frame, V10 drone in time mode, shadow),
// Exact slopes and tangent lines (Practice 2, V8 frames) and the "Two flat spots" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
var PI = Math.PI, G = PI / 24, G48 = PI / 48, R3 = Math.sqrt(3);
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol) * Math.max(1, Math.abs(b)); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
// fixed decimals with a true minus ("4.000", "−2.667")
function fx(v, dp){ var s = (Math.abs(v) < 0.5 * Math.pow(10, -dp) ? 0 : v).toFixed(dp); return s.replace("-", MINUS); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + MV.md(o.t) + "</button>"; }).join("") + "</span>";
}
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
function vline(ctx, p, x){
  var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
}
// the part of the line through (x0, y0) with slope s that lies inside the view box (asymptote clipping, plan build notes)
function clipSeg(x0, y0, s, v){
  var lo = v.xmin, hi = v.xmax;
  if (Math.abs(s) > 1e-12) { var xa = x0 + (v.ymin - y0) / s, xb = x0 + (v.ymax - y0) / s; lo = Math.max(lo, Math.min(xa, xb)); hi = Math.min(hi, Math.max(xa, xb)); }
  else if (y0 < v.ymin || y0 > v.ymax) return null;
  return hi > lo ? { x1:lo, y1:y0 + s * (lo - x0), x2:hi, y2:y0 + s * (hi - x0) } : null;
}
function boxHTML(k, val, label, cls, dis){
  return '<input class="numin short' + (cls ? " " + cls : "") + '" data-bx="' + k + '" data-k="bx' + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(val || "") + '"' + (dis ? " disabled" : "") + ">";
}
function piTxt(x, den){ return MV.piLabel(x, den || 24); }

// =====================================================================================================================
// @component N3 specialTrig — exact values at the special angles kπ/12 (k = 0, ±2, ±3, ±4, 6, 8, 9, 10) as m() source,
// for exact readouts. spk(x) -> k or null; tables keyed by k in 0..10 (negative k by symmetry: tan and cot odd, the rest even).
var SP = [0, 2, 3, 4, 6, 8, 9, 10];
var T_TAN = { 0:"0", 2:"√3/3", 3:"1", 4:"√3", 8:"-√3", 9:"-1", 10:"-√3/3" };
var T_COT = { 2:"√3", 3:"1", 4:"√3/3", 6:"0", 8:"-√3/3", 9:"-1", 10:"-√3" };
var T_TAN2 = { 0:"0", 2:"1/3", 3:"1", 4:"3", 8:"3", 9:"1", 10:"1/3" };
var T_COT2 = { 2:"3", 3:"1", 4:"1/3", 6:"0", 8:"1/3", 9:"1", 10:"3" };
var T_SEC2 = { 0:"1", 2:"4/3", 3:"2", 4:"4", 8:"4", 9:"2", 10:"4/3" };
var T_SEC = { 0:"1", 2:"2√3/3", 3:"√2", 4:"2", 8:"-2", 9:"-√2", 10:"-2√3/3" };
var T_CSC2 = { 2:"4", 3:"2", 4:"4/3", 6:"1", 8:"4/3", 9:"2", 10:"4" };
function spk(x){ var k = Math.round(x / (PI / 12)); if (Math.abs(x - k * PI / 12) > 1e-7) return null; return SP.indexOf(Math.abs(k)) >= 0 ? k : null; }
function negS(s){ return s === "0" ? "0" : s.charAt(0) === "-" ? s.slice(1) : "-" + s; }
function tv(tbl, k, odd){ var v = tbl[Math.abs(k)]; if (v == null) return null; return k < 0 && odd ? negS(v) : v; }
function onGrid(x){ return Math.abs(x / G - Math.round(x / G)) < 1e-7; }
function xLabel(x){ return onGrid(x) ? piTxt(Math.round(x / G) * G) : "≈ " + num(x, 3); }
// --------------------------------------------------- end of N3 specialTrig -----------------------------------------------

// ---------- the three functions of the slope tool ----------
function sec2(x){ var c = Math.cos(x); return 1 / (c * c); }
function csc2(x){ var s = Math.sin(x); return 1 / (s * s); }
var FN = {
  tan:{ f:Math.tan, d:sec2, lo:-PI / 2, hi:PI / 2, kLo:-11, kHi:11, asym:[-PI / 2, PI / 2], asymL:["x = " + MINUS + "π/2", "x = π/2"],
    view:{ xmin:-1.86, xmax:1.86, ymin:-6, ymax:6 }, dv:{ ymin:-1, ymax:8.5 }, ref:1, chips:[-8, -6, -4, 0, 4, 6, 8], src:"y = tan x", plain:"y = tan x", match:["sec2", "tan2"] },
  cot:{ f:function(x){ return Math.cos(x) / Math.sin(x); }, d:function(x){ return -csc2(x); }, lo:0, hi:PI, kLo:1, kHi:23, asym:[0, PI], asymL:["x = 0", "x = π"],
    view:{ xmin:-0.3, xmax:PI + 0.3, ymin:-6, ymax:6 }, dv:{ ymin:-8.5, ymax:1 }, ref:-1, chips:[4, 6, 8, 12, 16, 18, 20], src:"y = cot x", plain:"y = cot x", match:["csc2"] },
  tm4:{ f:function(x){ return Math.tan(x) - 4 * x; }, d:function(x){ return sec2(x) - 4; }, lo:-PI / 2, hi:PI / 2, kLo:-11, kHi:11, asym:[-PI / 2, PI / 2], asymL:["x = " + MINUS + "π/2", "x = π/2"],
    view:{ xmin:-1.86, xmax:1.86, ymin:-6, ymax:6 }, dv:{ ymin:-4.5, ymax:4.5 }, ref:null, chips:[-8, -6, -4, 0, 4, 6, 8], src:"y = tan x - 4x", plain:"y = tan x − 4x", match:[] }
};
var CAND = { sec2:sec2, sec:function(x){ return 1 / Math.cos(x); }, tan2:function(x){ var t = Math.tan(x); return 1 + t * t; }, csc2:function(x){ return -csc2(x); } };
function measured(F, x){ var h = 1e-6; return (F.f(x + h) - F.f(x - h)) / (2 * h); }
function slopeTxt(v){ return v > 50 ? "> 50" : v < -50 ? "< " + MINUS + "50" : fx(v, 3); }

// ---------- hero: a tangent slides along tan x; the lower panel traces the U of sec²x above the dashed line y = 1 ----------
function hero(f){
  var top = f.canvas, low = $("#hero-d"); if (!top || !low) return;
  var V = { xmin:-1.75, xmax:1.75, ymin:-5, ymax:5 }, DV = { xmin:-1.75, xmax:1.75, ymin:-0.7, ymax:5.4 };
  var pt = new MV.Plot(top, V), pl = new MV.Plot(low, DV), st = { x:0, lo:0, hi:0, done:false };
  var STOP = [[0, "1"], [PI / 4, "2"], [PI / 3, "4"], [-PI / 3, "4"], [-PI / 4, "2"]];
  function slab(x){ for (var i = 0; i < STOP.length; i++) if (Math.abs(x - STOP[i][0]) < 1e-6) return "slope " + STOP[i][1]; return "slope ≈ " + fx(sec2(x), 2); }
  function draw(){
    var x = st.x, y = Math.tan(x), s = sec2(x), ink = css("--ink"), ink2 = css("--ink-2"), f3 = css("--f3"), seg = clipSeg(x, y, s, V);
    pt.draw({ view:V, xTicks:{ step:PI / 4, pi:true, den:4 }, yLabel:"y",
      asymptotes:[{ x:-PI / 2, label:"" }, { x:PI / 2, label:"" }],
      curves:[{ f:Math.tan, color:css("--pen"), width:3, domain:[-PI / 2 + 0.01, PI / 2 - 0.01] }],
      segments:seg ? [{ x1:seg.x1, y1:seg.y1, x2:seg.x2, y2:seg.y2, color:ink, width:2.2 }] : [],
      points:[{ x:x, y:y, r:6, color:ink }],
      after:function(ctx, p){
        vline(ctx, p, x);
        var right = x > 0.2; bgText(ctx, slab(x), p.X(x) + (right ? -14 : 14), p.Y(y) + (right ? -26 : 26), right ? "right" : "left", ink, ui(14, 700));
        bgText(ctx, "y = tan x", p.X(-1.45), p.Y(4.2), "left", css("--pen"), mfont(15));
      },
      describe:"Graph of y = tan x between dashed asymptotes at x = ±π/2, with the tangent at x = " + piTxt(x, 12) + ", " + slab(x) + "." });
    pl.draw({ view:DV, xTicks:{ step:PI / 4, pi:true, den:4 }, yLabel:"slope",
      asymptotes:[{ y:1, label:"y = 1", color:ink2 }],
      curves:st.hi > st.lo + 1e-6 ? [{ f:sec2, color:f3, width:3, domain:[st.lo, st.hi] }] : [],
      points:[{ x:x, y:s, r:5.5, color:f3 }],
      after:function(ctx, p){ vline(ctx, p, x); if (st.done) bgText(ctx, "y = sec² x", p.X(1.12), p.Y(4.6), "left", f3, mfont(15)); },
      describe:"Slopes of the tangent from x = " + piTxt(st.lo, 12) + " to x = " + piTxt(st.hi, 12) + ": a U-shaped curve, y = sec² x, that touches the dashed line y = 1 only at x = 0." });
    if (f.cap) {
      var sx = Math.abs(x) < 1e-9 ? "0" : piTxt(x, 12).replace(MINUS, "-"), ex = /π|^0$/.test(sx);
      f.cap.innerHTML = st.done ? "The slopes trace " + m("y = sec^2 x") + ", which touches " + m("y = 1") + " only at " + m("x = 0") + "." :
        "Tangent at " + (ex ? m("x = " + sx) : m("x") + " ≈ " + fx(x, 2)) + ": " + slab(x);
    }
  }
  pt.render = draw; pl.render = draw;
  function fin(){ st.x = PI / 3; st.lo = -PI / 3; st.hi = PI / 3; st.done = true; draw(); }
  if (MV.reduceMotion) { fin(); return; }
  draw();
  var lin = function(t){ return t; };
  function go(a, b, dur, cb){ MV.tween({ dur:dur, ease:lin, step:function(t){ st.x = a + (b - a) * t; st.lo = Math.min(st.lo, st.x); st.hi = Math.max(st.hi, st.x); draw(); }, done:function(){ st.x = b; draw(); cb(); } }); }
  MV.wait(800, function(){ go(0, PI / 4, 1700, function(){ MV.wait(900, function(){ go(PI / 4, PI / 3, 900, function(){ MV.wait(1000, function(){
    go(PI / 3, -PI / 3, 2800, function(){ MV.wait(900, function(){ go(-PI / 3, PI / 3, 1800, fin); }); });
  }); }); }); }); });
}

// =====================================================================================================================
// ---------- Explore: Steep tangent ----------
// @component V5 derivativePanels (adapted from MCV4U 07 / 25: two linked panels for functions with vertical asymptotes) —
// top: f (--pen, 3 px) split at its asymptotes (dashed --ink-2), the tangent (--ink) clipped to the view box, "slope ≈ …"
// ("> 50" near an asymptote), marked points (N8) with max/min tags; lower: the slope trail (--f3, visited keys x·48/π joined
// into runs), a dashed reference line y = ±1, an optional candidate curve in --ink long dashes; one probe line through both.
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (!FN[S.fn]) S.fn = "tan";
  if (["trail", "derive"].indexOf(S.mode) < 0) S.mode = "trail";
  if (S.cand && !CAND[S.cand]) S.cand = null;
  S.xs = S.xs || {}; S.trail = S.trail || {}; S.marks = S.marks || {};
  Object.keys(FN).forEach(function(k){
    var F = FN[k], x = S.xs[k];
    if (typeof x !== "number" || !(x > F.lo + 0.005 && x < F.hi - 0.005)) S.xs[k] = k === "cot" ? PI / 2 : 0;
    if (!Array.isArray(S.trail[k])) S.trail[k] = [];
    if (!Array.isArray(S.marks[k])) S.marks[k] = [];
  });
  var busy = false, note = null, stop = null, dKey = null, dCur = 0, dChk = {}, markMsg = "";
  host.innerHTML = '<div class="tn-ex"><div class="tn-main" data-mv="graph"><p class="eq-cap tn-eq" id="tn-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot tn-top" id="tn-top" role="img" aria-label="Graph of the function with its tangent"></canvas></div>' +
    '<div class="plot-wrap"><canvas class="plot tn-low" id="tn-low" role="img" aria-label="Slope trail"></canvas></div>' +
    '<p class="tiny muted tn-key">' + MV.md(T.key) + '</p><div id="tn-panel"></div></div>' +
    '<div class="tn-side"><div class="tn-ctl" id="tn-fn"></div><div class="tn-ctl" id="tn-mode"></div>' +
    '<label class="slider tn-sl"><span class="slider-top"><span>' + MV.md(T.point) + '</span><output id="tn-xout"></output></span>' +
    '<input type="range" id="tn-x" step="any" style="accent-color:var(--ink)" aria-label="Point x"></label><p class="tiny muted tn-note">' + MV.md(T.pointNote) + "</p>" +
    '<p class="tiny tn-h">' + T.angles + '</p><div class="chips tn-ang" id="tn-ang" role="group" aria-label="' + MV.esc(T.angles) + '"></div>' +
    '<div class="q-actions tn-mk"><button type="button" class="btn sm" data-act="mark" data-k="tnmark">' + T.mark + '</button><button type="button" class="btn ghost sm" data-act="clearm" data-k="tnclrm">' + T.clearMarks + "</button></div>" +
    '<div id="tn-marks" class="tn-marks"></div>' +
    '<dl class="read tn-read" id="tn-read" aria-live="polite"></dl></div></div>';
  var top = new MV.Plot($("#tn-top", host), FN.tan.view), low = new MV.Plot($("#tn-low", host), FN.tan.view);
  top.render = draw; low.render = draw;
  var sl = $("#tn-x", host);

  function F(){ return FN[S.fn]; }
  function X(){ return S.xs[S.fn]; }
  function keyRange(){ var f = F(); return [Math.round(f.lo / G48) + 1, Math.round(f.hi / G48) - 1]; }
  function addKeys(a, b){
    var r = keyRange(), lo = Math.max(r[0], Math.round(Math.min(a, b) / G48)), hi = Math.min(r[1], Math.round(Math.max(a, b) / G48)), tr = S.trail[S.fn];
    for (var k = lo; k <= hi; k++) if (tr.indexOf(k) < 0) tr.push(k);
  }
  function setX(v, how){
    var f = F(), prev = X(), x;
    if (how === "grid") x = clamp(Math.round(v / G), f.kLo, f.kHi) * G;
    else x = clamp(v, f.lo + 0.01, f.hi - 0.01);
    if (Math.abs(x) < 1e-12) x = 0;
    S.xs[S.fn] = x;
    addKeys(how === "set" ? x : prev, x);
  }
  function runs(keys){
    var s = keys.slice().sort(function(a, b){ return a - b; }), out = [];
    s.forEach(function(k){ var r = out[out.length - 1]; if (r && k === r[1] + 1) r[1] = k; else if (!r || k !== r[1]) out.push([k, k]); });
    return out;
  }
  function candMatches(){ return S.cand && F().match.indexOf(S.cand) >= 0; }

  // ---- drawing ----
  function describeTop(){
    var f = F(), x = X(), s = measured(f, x), mk = S.marks[S.fn];
    return "Graph of " + f.plain + " between asymptotes at " + f.asymL.map(MV.plain).join(" and ") + ". Tangent at x = " + xLabel(x) + ", slope " + (Math.abs(s) > 50 ? (s > 0 ? "greater than 50" : "less than −50") : num(s, 3)) + "." +
      (mk.length ? " Marked points at x = " + mk.map(function(q){ return xLabel(q.x) + (q.lab ? " (" + q.lab + ")" : ""); }).join(", ") + "." : "");
  }
  function describeLow(){
    var f = F(), tr = S.trail[S.fn], s = "Slope trail of " + f.plain;
    if (tr.length) s += " from x = " + xLabel(Math.min.apply(null, tr) * G48) + " to x = " + xLabel(Math.max.apply(null, tr) * G48);
    s += "." + (f.ref != null ? " Dashed reference line y = " + (f.ref < 0 ? "−1" : "1") + "." : "");
    if (S.cand) s += " Candidate curve " + MV.plain(MV.md(C.cands.filter(function(c){ return c.id === S.cand; })[0].t)) + " in long dashes" + (candMatches() ? ", lying on the trail." : ", leaving the trail.");
    return s;
  }
  function draw(){
    var f = F(), x = X(), y = f.f(x), s = measured(f, x), V = f.view, DV = { xmin:V.xmin, xmax:V.xmax, ymin:f.dv.ymin, ymax:f.dv.ymax };
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), f3 = css("--f3");
    var seg = clipSeg(x, y, s, V), mk = S.marks[S.fn], xt = { step:S.fn === "cot" ? PI / 4 : PI / 6, pi:true, den:12 };
    var tsc = { view:V, xTicks:xt, yLabel:"y", asymptotes:f.asym.map(function(a, i){ return { x:a, label:a === 0 ? "" : f.asymL[i] }; }),
      curves:[{ f:f.f, color:pen, width:3, domain:[f.lo + 0.002, f.hi - 0.002] }],
      segments:seg ? [{ x1:seg.x1, y1:seg.y1, x2:seg.x2, y2:seg.y2, color:ink, width:2.2 }] : [], points:[] };
    mk.forEach(function(q){ tsc.points.push({ x:q.x, y:clamp(f.f(q.x), V.ymin + 0.2, V.ymax - 0.2), r:6, color:ink, open:true }); });
    tsc.points.push({ x:x, y:clamp(y, V.ymin - 1, V.ymax + 1), r:6.5, color:ink, ring:true });
    tsc.after = function(ctx, p){
      vline(ctx, p, x);
      var Y = clamp(p.Y(y), 18, p.H - 18), right = p.X(x) > p.W * 0.6, sdy = y > 2 ? 28 : -28;
      bgText(ctx, "slope " + (Math.abs(s) > 50 ? slopeTxt(s) : "≈ " + fx(s, 3)), p.X(x) + (right ? -14 : 14), clamp(Y + sdy, 16, p.H - 16), right ? "right" : "left", ink, ui(13, 700));
      mk.forEach(function(q){
        var qy = clamp(f.f(q.x), V.ymin + 0.2, V.ymax - 0.2), t = piTxtSafe(q.x) + (q.lab ? " " + q.lab : ""), at = Math.abs(q.x - x) < 1e-9;
        bgText(ctx, t, p.X(q.x), clamp(p.Y(qy) + (at ? -sdy : qy > 0 ? 24 : -24), 14, p.H - 14), "center", ink, ui(12, 700));
      });
      if (note && note.panel === "top") bgText(ctx, note.text, p.X(note.x), p.Y(note.y), note.align || "center", ink, ui(14, 700));
    };
    tsc.describe = describeTop();
    top.draw(tsc);
    var lsc = { view:DV, xTicks:xt, yLabel:T.lowLabel, asymptotes:f.asym.map(function(a){ return { x:a, label:"" }; }), curves:[], points:[] };
    if (f.ref != null) lsc.asymptotes.push({ y:f.ref, label:"", color:ink2 });
    if (S.cand) lsc.curves.push({ f:CAND[S.cand], color:ink, width:2.2, dash:[12, 7], domain:[f.lo + 0.002, f.hi - 0.002] });
    runs(S.trail[S.fn]).forEach(function(r){
      if (r[0] === r[1]) lsc.points.push({ x:r[0] * G48, y:f.d(r[0] * G48), r:3.2, color:f3 });
      else lsc.curves.push({ f:f.d, color:f3, width:3, domain:[r[0] * G48, r[1] * G48] });
    });
    var dy = f.d(x);
    if (dy <= DV.ymax && dy >= DV.ymin) lsc.points.push({ x:x, y:dy, r:5.5, color:f3 });
    lsc.after = function(ctx, p){
      vline(ctx, p, x);
      if (dy > DV.ymax || dy < DV.ymin) { var up = dy > DV.ymax, Xp = p.X(x), Yp = up ? 4 : p.H - 4; ctx.save(); ctx.fillStyle = f3; ctx.beginPath(); ctx.moveTo(Xp, Yp); ctx.lineTo(Xp - 7, Yp + (up ? 12 : -12)); ctx.lineTo(Xp + 7, Yp + (up ? 12 : -12)); ctx.closePath(); ctx.fill(); ctx.restore(); }
      if (f.ref != null) bgText(ctx, "y = " + (f.ref < 0 ? MINUS : "") + "1", p.X(S.fn === "cot" ? 0.42 : -1.25), p.Y(f.ref) + (f.ref > 0 ? -13 : 13), "left", ink2, mfont(13));
      if (note && note.panel === "low") bgText(ctx, note.text, p.X(note.x), p.Y(note.y), note.align || "center", ink, ui(14, 700));
    };
    lsc.describe = describeLow();
    low.draw(lsc);
  }
  function piTxtSafe(x){ return onGrid(x) ? piTxt(Math.round(x / G) * G) : num(x, 2); }

  // ---- readout (plan's readout panel) ----
  function readRows(){
    var f = F(), x = X(), k = spk(x), y = f.f(x), s = measured(f, x), xs = onGrid(x) ? piTxt(Math.round(x / G) * G).replace(MINUS, "-") : null;
    var arg = xs == null ? "" : (xs === "0" ? "0" : xs), argP = "(" + arg + ")";
    var ys = null;
    if (k != null) {
      if (S.fn === "tan") ys = tv(T_TAN, k, true);
      else if (S.fn === "cot") ys = tv(T_COT, k, true);
      else ys = k === 0 ? "0" : tv(T_TAN, k, true) + (k > 0 ? " - " : " + ") + piTxt(Math.abs(k) * PI / 3, 12);
    }
    function exactPlus(src, v){ return m(src) + (/^-?\d+$/.test(src.replace(/^.*= /, "")) ? "" : " ≈ " + fx(v, 3)); }
    var pointV = (xs != null ? m("x = " + xs) : m("x") + " ≈ " + fx(x, 3)) + ", " + (ys != null ? exactPlus("y = " + ys, y) : m("y") + " ≈ " + fx(y, 3));
    function approx(v){ return Math.abs(v) > 50 ? slopeTxt(v) : "≈ " + fx(v, 3); }
    // row 4: the candidate's value (or sec²x / −csc²x)
    var cid = S.cand || (S.fn === "cot" ? "csc2" : "sec2"), cv = CAND[cid](x), clab = cid === "sec2" ? "sec^2 x" : cid === "sec" ? "sec x" : cid === "tan2" ? "1 + tan^2 x" : "-csc^2 x", cval;
    if (k != null) {
      if (cid === "sec2") cval = tv(T_SEC2, k) != null ? m("1/cos^2" + argP + " = " + tv(T_SEC2, k)) : "undefined";
      else if (cid === "sec") cval = tv(T_SEC, k) != null ? m("1/cos" + argP + " = " + tv(T_SEC, k)) : "undefined";
      else if (cid === "tan2") cval = tv(T_TAN2, k) != null ? m("1 + " + tv(T_TAN2, k) + " = " + tv(T_SEC2, k)) : "undefined";
      else cval = tv(T_CSC2, k) != null ? m("-1/sin^2" + argP + " = " + negS(tv(T_CSC2, k))) : "undefined";
    } else cval = isFinite(cv) ? approx(cv) : "undefined";
    // row 5: 1 + tan²x (−(1 + cot²x) for cot)
    var r5lab, r5;
    if (S.fn === "cot") { r5lab = T.rows.cot2; r5 = k != null ? m("-(1 + " + tv(T_COT2, k) + ") = " + negS(tv(T_CSC2, k))) : approx(-1 - Math.pow(f.f(x), 2)); }
    else { r5lab = T.rows.tan2; r5 = k != null ? m("1 + " + tv(T_TAN2, k) + " = " + tv(T_SEC2, k)) : approx(1 + Math.pow(Math.tan(x), 2)); }
    // row 6: distance to the nearer asymptote
    var a0 = f.asym[0], a1 = f.asym[1], d0 = x - a0, d1 = a1 - x, dist;
    function dTxt(d){ return onGrid(d) ? m(piTxt(Math.round(d / G) * G)) : "≈ " + fx(d, 3); }
    if (Math.abs(d0 - d1) < 1e-9) dist = dTxt(d0) + " " + T.both;
    else if (d0 < d1) dist = dTxt(d0) + " " + T.from + " " + m(f.asymL[0].replace(MINUS, "-"));
    else dist = dTxt(d1) + " " + T.from + " " + m(f.asymL[1].replace(MINUS, "-"));
    return [
      [T.rows.fn, m(f.src)],
      [T.rows.point, pointV],
      [T.rows.slope, slopeTxt(s)],
      [m(clab), cval],
      [MV.md(r5lab), r5],
      [T.rows.dist, dist]
    ];
  }
  function paintRead(){ $("#tn-read", host).innerHTML = MV.readoutHTML(readRows()); }

  // ---- controls ----
  function paintTop(){
    MV.keepFocus($("#tn-fn", host), function(){ $("#tn-fn", host).innerHTML = '<span class="tiny tn-h">' + T.fn + "</span>" + segBtns("fn", C.fns, S.fn, T.fn); });
    MV.keepFocus($("#tn-mode", host), function(){ $("#tn-mode", host).innerHTML = '<span class="tiny tn-h">' + T.mode + "</span>" + segBtns("mode", C.modes, S.mode, T.mode); });
    $("#tn-eq", host).innerHTML = m(F().src);
  }
  function syncSl(){
    var f = F(), x = X();
    sl.min = f.lo + 0.01; sl.max = f.hi - 0.01; sl.value = x;
    var lab = onGrid(x) ? piTxt(Math.round(x / G) * G) : "≈ " + num(x, 3);
    $("#tn-xout", host).textContent = lab;
    sl.setAttribute("aria-valuetext", "x = " + lab);
  }
  function paintSide(){
    var f = F(), x = X();
    MV.keepFocus($("#tn-ang", host), function(){
      $("#tn-ang", host).innerHTML = f.chips.map(function(c){ var on = Math.abs(x - c * G) < 1e-9; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-ang="' + c + '" data-k="ang' + S.fn + c + '" aria-pressed="' + on + '">' + m(piTxt(c * G).replace(MINUS, "-")) + "</button>"; }).join("");
    });
    var mk = S.marks[S.fn], h = '<p class="tiny tn-h">' + T.marksH + "</p>";
    if (!mk.length) h += '<p class="tiny muted">' + T.noMarks + "</p>";
    else h += '<ul class="tn-ml">' + mk.map(function(q, i){
      var lbl = onGrid(q.x) ? m("x = " + piTxt(Math.round(q.x / G) * G).replace(MINUS, "-")) : m("x") + " ≈ " + fx(q.x, 3);
      var rad = S.fn === "tm4" ? '<span class="tn-rad" role="radiogroup" aria-label="Label for the point at x = ' + MV.esc(MV.plain(lbl)) + '">' + ["max", "min"].map(function(l){
        var on = q.lab === l; return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-lab="' + l + '" data-mi="' + i + '" data-k="lab' + i + l + '">' + T[l] + "</button>"; }).join("") + "</span>" : "";
      return '<li><span class="tn-mx">' + lbl + "</span>" + rad + '<button type="button" class="btn ghost sm tn-rm" data-rm="' + i + '" data-k="rm' + i + '" aria-label="' + T.remove + " the point at " + MV.esc(MV.plain(lbl)) + '">' + T.remove + "</button></li>"; }).join("") + "</ul>";
    if (markMsg) h += '<p class="tiny tn-mmsg">' + markMsg + "</p>";
    MV.keepFocus($("#tn-marks", host), function(){ $("#tn-marks", host).innerHTML = h; });
    var cb = $('[data-act="clearm"]', host); if (cb && !busy) cb.disabled = !mk.length;
    syncSl();
  }
  function deriveLines(){ var D = C.derive; return S.fn === "cot" ? D.cot : S.fn === "tm4" ? D.tan.concat([D.tm4]) : D.tan; }
  function paintDeriveList(){
    var L = deriveLines(), ol = $("#tn-dl", host); if (!ol) return;
    MV.keepFocus(ol, function(){
      ol.innerHTML = L.map(function(l, j){
        if (j > dCur) return "";
        return '<li class="' + (j === dCur ? "cur" : "") + '"><div class="tn-dline"><span class="tn-dn">' + (j + 1) + '.</span><span class="tn-dt">' + MV.md(l.t) + "</span>" +
          '<button type="button" class="btn ghost sm" data-dchk="' + j + '" data-k="dchk' + j + '">' + T.checkLine + "</button></div>" +
          (dChk[j] ? '<div class="tn-dres">' + MV.md(l.c) + ' <strong class="tn-ok">' + T.agree + "</strong></div>" : "") + "</li>";
      }).join("");
    });
  }
  function paintPanel(){
    var P = $("#tn-panel", host);
    if (S.mode === "derive") {
      if (dKey !== S.fn) {
        dKey = S.fn; dCur = 0; dChk = {};
        P.innerHTML = '<div class="tn-derive"><p class="tn-ph">' + T.deriveH + '</p><p class="tiny muted">' + MV.md(T.deriveHow) + '</p><ol class="tn-dl" id="tn-dl"></ol><div class="tn-dpl"></div></div>';
        var L = deriveLines();
        MV.player($(".tn-dpl", P), { count:L.length, interval:2200, label:function(i){ return "Line " + (i + 1) + " of " + L.length; },
          render:function(i){ dCur = i; paintDeriveList(); } });
      }
      paintDeriveList();
      return;
    }
    dKey = null;
    var tr = S.trail[S.fn], r = keyRange(), h = '<div class="tn-cand"><p class="tn-ph">' + T.candH + '</p><div class="chips" role="group" aria-label="' + MV.esc(T.candH) + '">' +
      C.cands.map(function(c){ var on = S.cand === c.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-cand="' + c.id + '" data-k="cand' + c.id + '" aria-pressed="' + on + '">' + MV.md(c.t) + "</button>"; }).join("") + "</div>" +
      '<p class="tiny tn-cst" aria-live="polite">' + (!S.cand ? '<span class="muted">' + T.candNone + "</span>" : candMatches() ? '<strong class="tn-ok">' + T.candYes + "</strong>" : "<strong>" + T.candNo + "</strong>") + "</p>" +
      '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="all" data-k="tnall"' + (tr.length >= r[1] - r[0] + 1 ? " disabled" : "") + ">" + T.showAll + '</button><button type="button" class="btn ghost sm" data-act="cleart" data-k="tnclrt"' + (tr.length > 1 ? "" : " disabled") + ">" + T.clearTrail + "</button></div></div>";
    MV.keepFocus(P, function(){ P.innerHTML = h; });
  }
  function paintAll(){ paintTop(); paintSide(); paintRead(); paintPanel(); draw(); }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }
  function addMark(){
    var mk = S.marks[S.fn], x = X();
    markMsg = "";
    if (mk.some(function(q){ return Math.abs(q.x - x) < 1e-9; })) return;
    if (mk.length >= 4) { markMsg = T.markFull; return; }
    mk.push({ x:x, lab:null }); mk.sort(function(a, b){ return a.x - b.x; });
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b)) return;
    if (b.closest(".tn-dpl")) return;                                  // the N13 player handles its own buttons
    note = null;
    if (b.dataset.fn) { S.fn = b.dataset.fn; markMsg = ""; if (S.mode === "derive") setX(4 * G, "grid"); addKeys(X(), X()); changed(); return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; if (S.mode === "derive") setX(4 * G, "grid"); changed(); return; }
    if (b.dataset.ang != null) { setX(+b.dataset.ang * G, "grid"); changed(); return; }
    if (b.dataset.cand) { S.cand = S.cand === b.dataset.cand ? null : b.dataset.cand; changed(); return; }
    if (b.dataset.rm != null) { S.marks[S.fn].splice(+b.dataset.rm, 1); markMsg = ""; changed(); MV.keepFocus($("#tn-marks", host), function(){}); return; }
    if (b.dataset.lab) { var q = S.marks[S.fn][+b.dataset.mi]; if (q) q.lab = b.dataset.lab; changed(); return; }
    if (b.dataset.dchk != null) { dChk[+b.dataset.dchk] = true; paintDeriveList(); return; }
    var a = b.dataset.act;
    if (a === "mark") { addMark(); changed(); return; }
    if (a === "clearm") { S.marks[S.fn] = []; markMsg = ""; changed(); return; }
    if (a === "all") { addKeys(F().lo, F().hi); changed(); return; }
    if (a === "cleart") { S.trail[S.fn] = []; addKeys(X(), X()); changed(); }
  });
  // radio keys for the max/min labels
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest('[role="radio"]'); if (!b || busy) return;
    if (!/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return;
    e.preventDefault(); var q = S.marks[S.fn][+b.dataset.mi]; if (!q) return;
    q.lab = b.dataset.lab === "max" ? "min" : "max"; changed();
    var nb = $('[data-mi="' + b.dataset.mi + '"][data-lab="' + q.lab + '"]', host); if (nb) nb.focus();
  });
  sl.addEventListener("input", function(){ if (busy) { syncSl(); return; } note = null; setX(+sl.value, "grid"); changed(); });
  sl.addEventListener("keydown", function(e){
    if (busy) return;
    var x = X(), f = F(), k = e.key, nx = null;
    if (k === "Enter") { e.preventDefault(); note = null; addMark(); changed(); return; }
    if (/^Arrow(Right|Up)$/.test(k)) nx = e.shiftKey ? x + 0.01 : (Math.floor(x / G + 1e-7) + 1) * G;
    else if (/^Arrow(Left|Down)$/.test(k)) nx = e.shiftKey ? x - 0.01 : (Math.ceil(x / G - 1e-7) - 1) * G;
    else if (k === "Home") nx = f.kLo * G; else if (k === "End") nx = f.kHi * G;
    else if (k === "PageUp") nx = x + 4 * G; else if (k === "PageDown") nx = x - 4 * G;
    if (nx == null) return;
    e.preventDefault(); note = null;
    var onG = !e.shiftKey || k === "Home" || k === "End";
    if (onG && (nx < f.kLo * G - 1e-9 || nx > f.kHi * G + 1e-9)) nx = clamp(nx, f.kLo * G, f.kHi * G);
    setX(nx, onG ? "grid" : "fine"); changed();
  });
  $("#tn-top", host).addEventListener("pointerdown", function(e){
    if (busy || !top.v) return;
    var r = e.target.getBoundingClientRect(); note = null; setX(top.xOf(e.clientX - r.left), "grid"); changed();
  });
  addKeys(X(), X());
  paintAll();

  // ---- challenges: tap-to-mark tests (plan's exact tests and named wrong states) ----
  function has(mk, v){ return mk.some(function(q){ return Math.abs(q.x - v) < 1e-6; }); }
  function chal(id){
    var M = MS[id], fnId = id === "tc1" ? "tan" : id === "tc2" ? "cot" : "tm4", mk = S.marks[fnId];
    if (!mk.length) return { ok:false, msg:S.fn !== fnId ? M.fn : M.none };
    if (id === "tc1") {
      var A = has(mk, PI / 3), B = has(mk, -PI / 3), h4 = Math.atan(4);
      if (has(mk, PI / 6) || has(mk, -PI / 6)) return { ok:false, msg:M.pi6 };
      if (mk.some(function(q){ return Math.abs(Math.abs(q.x) - h4) < 0.02; })) return { ok:false, msg:M.height };
      if (A && B) return mk.length === 2 ? { ok:true } : { ok:false, msg:M.extra };
      if ((A || B) && mk.length === 1) return { ok:false, msg:M.mirror };
      return { ok:false, msg:M.general };
    }
    if (id === "tc2") {
      var A2 = has(mk, PI / 4), B2 = has(mk, 3 * PI / 4);
      if (has(mk, PI / 6) || has(mk, 5 * PI / 6)) return { ok:false, msg:M.pi6 };
      if (A2 && B2) return mk.length === 2 ? { ok:true } : { ok:false, msg:M.extra };
      if ((A2 || B2) && mk.length === 1) return { ok:false, msg:M.one };
      return { ok:false, msg:M.general };
    }
    var L = mk.filter(function(q){ return Math.abs(q.x + PI / 3) < 1e-6; })[0], R = mk.filter(function(q){ return Math.abs(q.x - PI / 3) < 1e-6; })[0];
    if (has(mk, PI / 6) || has(mk, -PI / 6)) return { ok:false, msg:M.pi6 };
    if (L && R) {
      if (mk.length > 2) return { ok:false, msg:M.extra };
      if (!L.lab || !R.lab) return { ok:false, msg:M.label };
      if (L.lab !== "max") return { ok:false, msg:M.swapped };
      if (R.lab !== "min") return { ok:false, msg:M.swapped2 };
      return { ok:true };
    }
    if ((L || R) && mk.length === 1) return { ok:false, msg:M.one };
    return { ok:false, msg:M.general };
  }

  // ---- predictions ----
  function sweep(a, b, dur, ease, cb){
    stop = MV.tween({ dur:dur, ease:ease || function(t){ return t; }, step:function(t){ setX(a + (b - a) * t, "fine"); syncSl(); paintRead(); draw(); },
      done:function(){ stop = null; setX(b, onGrid(b) ? "grid" : "fine"); if (cb) cb(); } });
  }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; note = null; S.mode = "trail"; S.cand = null; markMsg = "";
        S.fn = p.id === "p3" ? "cot" : "tan";
        if (p.id === "p1") { S.trail.tan = []; S.xs.tan = -11 * G; }
        else if (p.id === "p2") S.xs.tan = 0;
        else if (p.id === "p3") { S.trail.cot = []; S.xs.cot = G; }
        else S.xs.tan = 6 * G;
        addKeys(X(), X());
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; lock(false); api.save(); paintAll(); MV.changed(); done(); }
        function show(nt, cb){ note = nt; draw(); MV.wait(1300, cb); }
        if (p.id === "p1") sweep(-11 * G, 11 * G, 3800, null, function(){ show({ panel:"low", x:0, y:2.6, text:"smallest slope: 1, at x = 0" }, fin); });
        else if (p.id === "p2") sweep(0, 6 * G, 1600, null, function(){ show({ panel:"top", x:-0.75, y:3.4, text:"slope 2 at (π/4, 1)" }, fin); });
        else if (p.id === "p3") sweep(G, 23 * G, 3800, null, function(){ show({ panel:"low", x:PI / 2, y:-3.2, text:"touches −1 at x = π/2" }, fin); });
        else sweep(6 * G, PI / 2 - 0.01, 2800, function(t){ return 1 - Math.pow(1 - t, 2); }, function(){ show({ panel:"top", x:-0.6, y:3.6, text:"slope > 50: still growing" }, fin); });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}
// ------------------------------------------------- end of V5 derivativePanels -----------------------------------------------

// =====================================================================================================================
// @component V8 frameBoxes — structured exact entry (course plan V8): a frame of text pieces and boxes such as
// "□x + □ − □π/□", "□/□" or "□π/□ − □/□". Boxes take whole numbers, fractions or √ (no decimals, no free algebra); a blank
// box in front of π ({pi:true}) or a blank bottom box ({den:true}) means 1. frameHTML(parts, vals, prefix, disabled) renders;
// frameRead(parts, vals) -> {v:{k:number}} or {err:"fill"|"err"|"dec"|"piIn"}; FORMS[form](v) -> {v} | {m, b} | {set}.
function framePlain(parts){ return parts.map(function(p){ return typeof p === "string" ? MV.plain(MV.md(p)) : "□"; }).join(" "); }
function frameHTML(parts, vals, pre, dis){
  var nb = parts.filter(function(p){ return typeof p !== "string"; }).length, i = 0, fp = framePlain(parts);
  return parts.map(function(p){
    if (typeof p === "string") return '<span class="tn-fl">' + MV.md(p.indexOf("`") < 0 && !/[A-Za-z]/.test(p) ? "`" + p.replace(/−/g, "-") + "`" : p) + "</span>";
    i++; return boxHTML(pre + p.k, vals[p.k], "Box " + i + " of " + nb + " in " + fp, p.den ? "tn-den" : p.pi ? "tn-pib" : "", dis);
  }).join("");
}
function frameRead(parts, vals){
  var out = {};
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i]; if (typeof p === "string") continue;
    var raw = String(vals[p.k] == null ? "" : vals[p.k]).trim();
    if (!raw) { if (p.den || p.pi) { out[p.k] = 1; continue; } return { err:"fill" }; }
    if (p.pi && /π|pi/i.test(raw)) return { err:"piIn" };
    if (/\d\.|\.\d/.test(raw)) return { err:"dec" };
    var r = MV.parseNum(raw); if (!r || r.length !== 1) return { err:"err" };
    if (p.den && r[0] === 0) return { err:"err" };
    out[p.k] = r[0];
  }
  return { v:out };
}
var FORMS = {
  frac:function(v){ return { v:v.n / v.d }; },
  lineT3:function(v){ return { m:v.m, b:v.p * PI / v.q - v.c }; },
  lineC:function(v){ return { m:v.m, b:v.c - v.p * PI / v.q }; },
  pi1:function(v){ return { v:v.p * PI / v.q }; },
  pi2:function(v){ return { set:[v.p1 * PI / v.q1, v.p2 * PI / v.q2] }; },
  piMinusFrac:function(v){ return { v:v.p * PI / v.q - v.a / v.b }; }
};
function sameVal(got, ans, tol){
  if (ans.set) return !!got.set && MV.sameNums(got.set, ans.set, tol);
  if (ans.m != null) return got.m != null && near(got.m, ans.m, tol) && near(got.b, ans.b, tol);
  return got.v != null && near(got.v, ans.v, tol);
}
function wrongHit(got, w){
  if (w.v != null) return got.v != null && near(got.v, w.v);
  if (w.m != null) return got.m != null && near(got.m, w.m);
  if (w.has != null) return !!got.set && got.set.some(function(s){ return near(s, w.has); });
  return false;
}
// ---------------------------------------------------- end of V8 frameBoxes --------------------------------------------------

// =====================================================================================================================
// ---------- Part 3: Using the trig derivatives (three stations) ----------
var ST1 = ["`y =`", { k:"m" }, "`x +`", { k:"c" }, "−", { k:"p", pi:true }, "π /", { k:"q", den:true }];
function dec1(v, dp){ var p = Math.pow(10, dp || 1), r = Math.round(v * p) / p; return (Math.abs(v - r) > 1e-9 ? "≈ " : "") + num(v, dp || 1); }
function eqv(v, dp){ var d = dec1(v, dp); return d.indexOf("≈") === 0 ? d : "= " + d; }
function thTxt(th){
  var k = Math.round(th / (PI / 12));
  if (Math.abs(th - k * PI / 12) < 1e-9 && [2, 3, 4, 5].indexOf(k) >= 0) return m(piTxt(th, 12)) + " ≈ " + num(th, 3) + " rad";
  return "≈ " + num(th, 3) + " rad";
}
// @component V10 shapeStage (time mode, trimmed from MCV4U 19 for this module) — an SVG side view driven by one angle θ,
// with Play / Pause (θ grows at a steady model rate; reduced motion jumps to the end), Reset, a θ slider and live readouts.
function droneSVG(th){
  var gy = 246, ox = 36, sc = 3.1, dx = ox + 40 * sc, h = 40 * Math.tan(th), yd = gy - h * sc, r = 38;
  var ax = ox + r * Math.cos(th), ay = gy - 6 - r * Math.sin(th), lx = ox + 54 * Math.cos(th / 2), ly = gy - 6 - 54 * Math.sin(th / 2);
  return '<line class="tn-sg" x1="8" y1="' + gy + '" x2="312" y2="' + gy + '"/>' +
    '<circle class="tn-so" cx="' + ox + '" cy="' + (gy - 6) + '" r="5"/>' +
    '<line class="tn-ssight" x1="' + ox + '" y1="' + (gy - 6) + '" x2="' + dx + '" y2="' + (yd + 2) + '"/>' +
    '<path class="tn-sarc" d="M ' + (ox + r) + " " + (gy - 6) + " A " + r + " " + r + " 0 0 0 " + ax.toFixed(1) + " " + ay.toFixed(1) + '"/>' +
    '<text class="tn-stx tn-sth" x="' + lx.toFixed(1) + '" y="' + (ly + 5).toFixed(1) + '">θ</text>' +
    '<line class="tn-sh" x1="' + dx + '" y1="' + gy + '" x2="' + dx + '" y2="' + (yd + 4).toFixed(1) + '"/>' +
    '<path class="tn-sra" d="M ' + (dx - 10) + " " + gy + " v -10 h 10" + '"/>' +
    '<text class="tn-stx" x="' + (dx + 10) + '" y="' + ((gy + yd) / 2 + 5).toFixed(1) + '">h ' + eqv(h, 1) + ' m</text>' +
    '<text class="tn-stx" x="' + ((ox + dx) / 2) + '" y="' + (gy + 18) + '" text-anchor="middle">40 m</text>' +
    '<g transform="translate(' + dx + " " + yd.toFixed(1) + ')"><rect class="tn-sdr" x="-14" y="-5" width="28" height="9" rx="3"/>' +
    '<line class="tn-srot" x1="-22" y1="-10" x2="-6" y2="-10"/><line class="tn-srot" x1="6" y1="-10" x2="22" y2="-10"/>' +
    '<line class="tn-srot" x1="-14" y1="-10" x2="-14" y2="-5"/><line class="tn-srot" x1="14" y1="-10" x2="14" y2="-5"/></g>' +
    '<text class="tn-stx" x="' + ox + '" y="' + (gy + 18) + '" text-anchor="middle">you</text>';
}
function shadowSVG(th){
  var gy = 200, px = 300, sc = 24, top = gy - 6 * sc, s = 6 / Math.tan(th), tx = px - s * sc, r = 30;
  var sx = px + 44 * Math.cos(th), sy = top - 44 * Math.sin(th), ax = tx + r * Math.cos(th), ay = gy - r * Math.sin(th);
  return '<line class="tn-sg" x1="8" y1="' + gy + '" x2="352" y2="' + gy + '"/>' +
    '<line class="tn-sray" x1="' + tx.toFixed(1) + '" y1="' + gy + '" x2="' + sx.toFixed(1) + '" y2="' + sy.toFixed(1) + '"/>' +
    '<circle class="tn-sun" cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="10"/>' +
    '<line class="tn-sshadow" x1="' + tx.toFixed(1) + '" y1="' + gy + '" x2="' + px + '" y2="' + gy + '"/>' +
    '<line class="tn-spole" x1="' + px + '" y1="' + gy + '" x2="' + px + '" y2="' + top + '"/>' +
    '<path class="tn-sarc" d="M ' + (tx + r).toFixed(1) + " " + gy + " A " + r + " " + r + " 0 0 0 " + ax.toFixed(1) + " " + ay.toFixed(1) + '"/>' +
    '<text class="tn-stx tn-sth" x="' + (tx + 40 * Math.cos(th / 2)).toFixed(1) + '" y="' + (gy - 40 * Math.sin(th / 2) + 5).toFixed(1) + '">θ</text>' +
    '<text class="tn-stx" x="' + (px - 10) + '" y="' + ((gy + top) / 2) + '" text-anchor="end">6 m</text>' +
    '<text class="tn-stx" x="' + ((tx + px) / 2).toFixed(1) + '" y="' + (gy + 18) + '" text-anchor="middle">s ' + eqv(s, 1) + ' m</text>';
}
function part3(host, api){
  var S = api.S, C = api.content, L = C.labels, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  S.f1 = S.f1 || { v:{}, solved:false, last:null };
  S.q = S.q || {};
  if (typeof S.th2 !== "number" || !(S.th2 >= PI / 6 - 1e-9 && S.th2 <= PI / 3 + 1e-9)) S.th2 = PI / 6;
  if (typeof S.th3 !== "number" || !(S.th3 >= PI / 6 - 1e-9 && S.th3 <= 5 * PI / 12 + 1e-9)) S.th3 = PI / 6;
  var f1msg = null, qmsg = {}, stop2 = null;
  function qHTML(q){
    return '<div class="tn-q" data-tq="' + q.id + '"><p class="tn-qq">' + MV.md(q.q) + '</p><div class="tn-qrow"></div><div class="tn-qfb"></div></div>';
  }
  function algHTML(lines){ return '<details class="alg"><summary>' + L.working + '</summary><div class="alg-lines">' + lines.map(function(l){ return "<div>" + MV.md(l) + "</div>"; }).join("") + "</div></details>"; }
  host.innerHTML =
    '<div class="part tn-st" id="tn-s1"><h3>' + S1.title + "</h3><p>" + MV.md(S1.text) + '</p><div class="sym tn-stg"><div><div class="plot-wrap"><canvas class="plot square" id="tn-p1" role="img" aria-label="' + MV.esc(S1.graph) + '"></canvas></div></div>' +
      '<div><div class="tn-frame" id="tn-f1"></div><div id="tn-f1c"></div></div></div></div>' +
    '<div class="part tn-st" id="tn-s2"><h3>' + S2.title + "</h3><p>" + MV.md(S2.text) + '</p><div class="sym tn-stg"><div><svg class="tn-svg" id="tn-dr" viewBox="0 0 320 272" role="img" aria-label="' + MV.esc(S2.fig) + '" focusable="false"></svg>' +
      '<div class="tn-play"><button type="button" class="btn primary sm" data-p2="play" data-k="p2play">' + L.play + '</button><button type="button" class="btn ghost sm" data-p2="reset" data-k="p2reset">' + L.reset + "</button></div>" +
      '<label class="slider tn-sl"><span class="slider-top"><span>' + S2.theta + '</span><output id="tn-th2o"></output></span><input type="range" id="tn-th2" min="' + (PI / 6) + '" max="' + (PI / 3) + '" step="' + (PI / 120) + '" style="accent-color:var(--ink)" aria-label="' + MV.esc(S2.theta) + '"></label></div>' +
      '<div><dl class="read" id="tn-r2" aria-live="polite"></dl>' + S2.qs.map(qHTML).join("") + "</div></div>" + algHTML(S2.alg) + "</div>" +
    '<div class="part tn-st" id="tn-s3"><h3>' + S3.title + "</h3><p>" + MV.md(S3.text) + '</p><div class="sym tn-stg"><div><svg class="tn-svg" id="tn-sh" viewBox="0 0 360 222" role="img" aria-label="' + MV.esc(S3.fig) + '" focusable="false"></svg>' +
      '<label class="slider tn-sl"><span class="slider-top"><span>' + S3.theta + '</span><output id="tn-th3o"></output></span><input type="range" id="tn-th3" min="' + (PI / 6) + '" max="' + (5 * PI / 12) + '" step="' + (PI / 120) + '" style="accent-color:var(--ink)" aria-label="' + MV.esc(S3.theta) + '"></label></div>' +
      '<div><dl class="read" id="tn-r3" aria-live="polite"></dl>' + qHTML(S3.q) + "</div></div>" + algHTML(S3.alg) + "</div>";

  // ---- Station 1: tangent line at π/4 (V8 frame "y = □x + □ − □π/□") ----
  var V1 = { xmin:-1.75, xmax:1.75, ymin:-4, ymax:4 }, p1 = new MV.Plot($("#tn-p1", host), V1);
  function draw1(){
    var ink = css("--ink"), ink2 = css("--ink-2"), ln = S.f1.solved ? { m:2, b:1 - PI / 2 } : S.f1.last, segs = [];
    if (ln) { var sg = clipSeg(0, ln.b, ln.m, V1); if (sg) segs.push({ x1:sg.x1, y1:sg.y1, x2:sg.x2, y2:sg.y2, color:S.f1.solved ? ink : ink2, width:2.2, dash:S.f1.solved ? null : [7, 5] }); }
    p1.draw({ view:V1, xTicks:{ step:PI / 4, pi:true, den:4 }, yLabel:"y", asymptotes:[{ x:-PI / 2, label:"" }, { x:PI / 2, label:"" }],
      curves:[{ f:Math.tan, color:css("--pen"), width:3, domain:[-PI / 2 + 0.01, PI / 2 - 0.01] }], segments:segs,
      points:[{ x:PI / 4, y:1, r:6, color:ink }],
      after:function(ctx, p){ bgText(ctx, "(π/4, 1)", p.X(PI / 4) + 12, p.Y(1) + 18, "left", ink, ui(13, 700)); if (ln && !S.f1.solved) bgText(ctx, "your line", p.X(-1.6), p.Y(-3.4), "left", ink2, ui(12, 700)); },
      describe:"Graph of y = tan x with the point (π/4, 1)" + (S.f1.solved ? " and its tangent y = 2x + 1 − π/2." : ln ? " and your line, slope " + num(ln.m, 3) + ", which is not the tangent." : ".") });
  }
  p1.render = draw1;
  function paint1(){
    var x = S.f1, fr = $("#tn-f1", host), c = $("#tn-f1c", host);
    MV.keepFocus(fr, function(){ fr.innerHTML = frameHTML(ST1, x.v, "f1", x.solved); });
    var h = x.solved ? MV.fbHTML("good", MV.md(S1.good)) : '<div class="q-actions"><button type="button" class="btn primary sm" data-f1="chk" data-k="f1chk">' + L.check + "</button></div>" + (f1msg ? MV.fbHTML(f1msg.bad ? "bad" : "", MV.md(f1msg.html)) : "");
    MV.keepFocus(c, function(){ c.innerHTML = h; });
    draw1();
  }
  function check1(){
    var r = frameRead(ST1, S.f1.v);
    if (r.err) { f1msg = { bad:false, html:L[r.err] }; return; }
    var got = FORMS.lineC(r.v); S.f1.last = got;
    if (sameVal(got, { m:2, b:1 - PI / 2 }, 1e-9)) { S.f1.solved = true; f1msg = null; return; }
    f1msg = { bad:true, html:"<strong>✗ Not quite.</strong> " + (near(got.m, 1) ? S1.w1 : near(got.m, Math.SQRT2) ? S1.wr2 : S1.general) + " Try again." };
  }
  paint1();

  // ---- number boxes with units (stations 2 and 3) ----
  var QS = S2.qs.concat([S3.q]);
  function qst(id){ return S.q[id] || (S.q[id] = { v:"", solved:false }); }
  function paintQ(q){
    var el = $('[data-tq="' + q.id + '"]', host), x = qst(q.id), row = $(".tn-qrow", el), fb = $(".tn-qfb", el);
    MV.keepFocus(row, function(){ row.innerHTML = '<input class="numin short tn-qin" data-qb="' + q.id + '" data-k="qb' + q.id + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(MV.plain(MV.md(q.q)) + " in " + q.unit) + '" value="' + MV.esc(x.v) + '"' + (x.solved ? " disabled" : "") + '><span class="tn-unit">' + q.unit + "</span>" +
      (x.solved ? "" : '<button type="button" class="btn primary sm" data-qc="' + q.id + '" data-k="qc' + q.id + '">' + L.check + "</button>"); });
    var h = x.solved ? MV.fbHTML("good", "<strong>✓ Right:</strong> " + MV.md(q.good)) : qmsg[q.id] ? MV.fbHTML(qmsg[q.id].bad ? "bad" : "", MV.md(qmsg[q.id].html)) : "";
    MV.keepFocus(fb, function(){ fb.innerHTML = h; });
  }
  function checkQ(q){
    var x = qst(q.id), r = MV.parseNum(x.v), ans = MV.ans(q);
    if (!String(x.v).trim()) { qmsg[q.id] = { bad:false, html:L.fill }; return; }
    if (!r || r.length !== 1) { qmsg[q.id] = { bad:false, html:L.err }; return; }
    if (near(r[0], ans, 1e-9)) { x.solved = true; qmsg[q.id] = null; return; }
    var w = (q.wrong || []).filter(function(z){ return near(r[0], z.v, 1e-6); })[0];
    qmsg[q.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + (w ? w.fb : L.qGeneral) + " Try again." };
  }
  QS.forEach(paintQ);

  // ---- Station 2: the rising drone (V10 time mode) ----
  var sl2 = $("#tn-th2", host), sl3 = $("#tn-th3", host);
  function paint2(){
    var th = S.th2, h = 40 * Math.tan(th), r = 40 * sec2(th), t = (th - PI / 6) / 0.05, R = S2.rows;
    $("#tn-dr", host).innerHTML = droneSVG(th);
    $("#tn-dr", host).setAttribute("aria-label", S2.fig + " Now θ " + MV.plain(thTxt(th)) + ", height " + dec1(h, 1) + " m.");
    sl2.value = th; $("#tn-th2o", host).innerHTML = thTxt(th); sl2.setAttribute("aria-valuetext", MV.plain(thTxt(th)));
    $("#tn-r2", host).innerHTML = MV.readoutHTML([[MV.md(R.t), dec1(t, 1) + " s"], [R.th, thTxt(th)], [MV.md(R.h), dec1(h, 1) + " m"],
      [MV.md(R.dhdth), m("40 sec^2 θ") + " " + eqv(r, 1) + " m per radian"], [MV.md(R.dhdt), m("40 sec^2 θ · 0.05") + " " + eqv(r * 0.05, 2) + " m/s"]]);
    var pb = $('[data-p2="play"]', host); if (pb) pb.textContent = stop2 ? L.pause : L.play;
  }
  function play2(){
    if (stop2) { stop2(); stop2 = null; paint2(); api.save(); return; }
    var a = S.th2 >= PI / 3 - 1e-9 ? PI / 6 : S.th2, b = PI / 3, dur = (b - a) / 0.05 / 2 * 1000;
    S.th2 = a;
    stop2 = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ S.th2 = a + (b - a) * t; paint2(); }, done:function(){ stop2 = null; S.th2 = b; api.save(); paint2(); } });
    paint2();
  }
  sl2.addEventListener("input", function(){ if (stop2) { stop2(); stop2 = null; } S.th2 = clamp(Math.round(+sl2.value / (PI / 120)) * PI / 120, PI / 6, PI / 3); api.save(); paint2(); });
  paint2();

  // ---- Station 3: the shrinking shadow ----
  function paint3(){
    var th = S.th3, s = 6 / Math.tan(th), r = -6 * csc2(th), R = S3.rows;
    $("#tn-sh", host).innerHTML = shadowSVG(th);
    $("#tn-sh", host).setAttribute("aria-label", S3.fig + " Now θ " + MV.plain(thTxt(th)) + ", shadow " + dec1(s, 1) + " m.");
    sl3.value = th; $("#tn-th3o", host).innerHTML = thTxt(th); sl3.setAttribute("aria-valuetext", MV.plain(thTxt(th)));
    $("#tn-r3", host).innerHTML = MV.readoutHTML([[R.th, thTxt(th)], [MV.md(R.s), dec1(s, 1) + " m"], [MV.md(R.dsdth), m("-6 csc^2 θ") + " " + eqv(r, 1) + " m per radian"]]);
  }
  sl3.addEventListener("input", function(){ S.th3 = clamp(Math.round(+sl3.value / (PI / 120)) * PI / 120, PI / 6, 5 * PI / 12); api.save(); paint3(); });
  paint3();

  host.addEventListener("input", function(e){
    var t = e.target, d = t.dataset || {};
    if (d.bx && d.bx.indexOf("f1") === 0) { S.f1.v[d.bx.slice(2)] = t.value; api.save(); return; }
    if (d.qb) { qst(d.qb).v = t.value; api.save(); }
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter") return;
    var d = e.target.dataset || {};
    if (d.bx && d.bx.indexOf("f1") === 0) { e.preventDefault(); var b = $('[data-f1="chk"]', host); if (b) b.click(); }
    if (d.qb) { e.preventDefault(); var b2 = $('[data-qc="' + d.qb + '"]', host); if (b2) b2.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.f1) { check1(); api.save(); paint1(); MV.focusFb($("#tn-s1", host)); return; }
    if (b.dataset.qc) { var q = QS.filter(function(z){ return z.id === b.dataset.qc; })[0]; checkQ(q); api.save(); paintQ(q); MV.focusFb($('[data-tq="' + q.id + '"]', host)); return; }
    if (b.dataset.p2 === "play") { play2(); return; }
    if (b.dataset.p2 === "reset") { if (stop2) { stop2(); stop2 = null; } S.th2 = PI / 6; api.save(); paint2(); }
  });
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Exact slopes and tangent lines (V8 frameBoxes, first-try scoring, three-level help) ----------
function slopesAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + MV.md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q tn-dq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="tn-frame tn-din"></div><div class="tn-dcl"></div></div>';
  }).join("");
  function paintIn(it){ var x = ist(it.id), el = $('[data-q="' + it.id + '"] .tn-din', host); MV.keepFocus(el, function(){ el.innerHTML = frameHTML(it.parts, x.v, it.id + "_", x.solved); }); }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .tn-dcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints.map(MV.md), x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + MV.md(it.display) + ".</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", MV.md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), r = frameRead(it.parts, x.v);
    if (r.err) return { err:TX[r.err] };
    var got = FORMS[it.form](r.v), ans = MV.ans(it);
    if (sameVal(got, ans, 1e-9)) return { ok:true };
    var W = it.wrong || [];
    for (var i = 0; i < W.length; i++) if (wrongHit(got, W[i])) return { msg:W[i].fb };
    return { msg:it.general || TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx.slice(q.dataset.q.length + 1)] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// =====================================================================================================================
// ---------- Performance task: Two flat spots, f(x) = a tan x + bx ----------
function fSrc(a, b){
  var s = a === 1 ? "tan x" : a === -1 ? "-tan x" : a + " tan x";
  return b === 0 ? s : s + (b > 0 ? " + " : " - ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x";
}
function coefSrc(c, t, lead){ var a = Math.abs(c), s = (a === 1 ? "" : a) + t; return lead && c < 0 ? "-" + s : s; }
var task = (function(){
  var api, plot, RNG = { a:[-4, 4], b:[-16, 16] };
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= RNG[k][0] && v <= RNG[k][1] ? v : null; }
  function read(){ var a = gi("a"), b = gi("b"); return { a:a, b:b, valid:a !== null && b !== null && a !== 0 }; }
  function fm3(D){ return -D.a * R3 - D.b * PI / 3; }
  function checks(D){ if (!D.valid) return [false, false, false]; return [4 * D.a + D.b === 0, D.a > 0, fm3(D) < 8]; }
  function preview(){
    var D = read(), L = api.content.labels, rd = $("#fs-read"), pen = css("--pen"), ink = css("--ink"), V = { xmin:-1.75, xmax:1.75, ymin:-12, ymax:12 };
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + MV.md(L.invalid) + "</p>";
      plot.draw({ view:V, xTicks:{ step:PI / 6, pi:true, den:6 }, describe:"Empty graph: choose a and b." });
      return;
    }
    var a = D.a, b = D.b, f = function(x){ return a * Math.tan(x) + b * x; }, d1 = 4 * a + b, fv = fm3(D), flat = d1 === 0;
    var rows = [[L.fRow, m(fSrc(a, b))], [L.dRow, m((a === 1 ? "" : a === -1 ? "-" : a + " ") + "sec^2 x" + (b === 0 ? "" : (b > 0 ? " + " : " - ") + Math.abs(b)))],
      [L.d1, m("4(" + a + ") " + (b < 0 ? "- " + -b : "+ " + b) + " = " + d1) + (flat ? " (" + L.flat + ")" : "")],
      [L.d2, m("-8√3 · " + (a < 0 ? "(" + a + ")" : a) + " = " + (a === -1 ? "" : -8 * a) + "√3") + " ≈ " + fx(-8 * R3 * a, 2) + ": " + (a > 0 ? L.down : L.up)],
      [L.fv, m(coefSrc(-a, "√3", true) + (b === 0 ? "" : (b < 0 ? " + " : " - ") + piTxt(Math.abs(b) * PI / 3, 3))) + " ≈ " + fx(fv, 2)]];
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows.map(function(r){ return [MV.md(r[0]), r[1]]; })) + "</dl>";
    var segs = [-PI / 3, PI / 3].map(function(x0){ var y0 = f(x0), w = 0.42; return { x1:x0 - w, y1:y0 - d1 * w, x2:x0 + w, y2:y0 + d1 * w, color:ink, width:2.2 }; });
    plot.draw({ view:V, xTicks:{ step:PI / 6, pi:true, den:6 }, yTicks:{ step:4 }, yLabel:"y", asymptotes:[{ x:-PI / 2, label:"" }, { x:PI / 2, label:"" }],
      curves:[{ f:f, color:pen, width:3, domain:[-PI / 2 + 0.005, PI / 2 - 0.005] }], segments:segs,
      points:[{ x:-PI / 3, y:clamp(f(-PI / 3), -11.5, 11.5), r:6, color:ink, ring:true }, { x:PI / 3, y:clamp(f(PI / 3), -11.5, 11.5), r:6, color:ink }],
      after:function(ctx, p){ var y0 = f(-PI / 3); bgText(ctx, "f(−π/3) ≈ " + fx(fv, 2), p.X(-PI / 3) - 8, clamp(p.Y(y0) + (y0 > 0 ? -24 : 24), 16, p.H - 16), "right", ink, ui(13, 700)); },
      describe:"Graph of f(x) = " + MV.plain(m(fSrc(a, b))) + " between asymptotes at x = ±π/2, with tangents at x = ±π/3" + (flat ? ", both horizontal" : " of slope " + d1) + ". f(−π/3) is about " + num(fv, 2) + "." });
  }
  function stepper(k, range){
    var L = api.content.labels;
    return '<div class="fs-step"><label for="fs-' + k + '"><span class="m">' + MV.md(L[k]) + '</span> <span class="tiny muted">' + range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="fs' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="fs-' + k + '" data-tk="' + k + '" type="number" min="' + RNG[k][0] + '" max="' + RNG[k][1] + '" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="fs' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (a.S.a == null) { a.S.a = "1"; a.S.b = "0"; }
      inp.innerHTML = '<div class="fs-in"><p class="tiny" style="font-weight:700;margin:0">' + m("f(x) = a tan x + bx") + "</p>" + stepper("a", L.rangeA) + stepper("b", L.rangeB) + "</div>";
      pv.innerHTML = '<div id="fs-read" aria-live="polite"></div><p class="tiny fs-gh">' + MV.md(L.graph) + '</p><div class="plot-wrap"><canvas class="plot" id="fs-plot" role="img" aria-label="Graph of f"></canvas></div>';
      plot = new MV.Plot($("#fs-plot"), { xmin:-1.75, xmax:1.75, ymin:-12, ymax:12 }); plot.render = preview;
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        var nv = clamp(cur + +b.dataset.dir, RNG[k][0], RNG[k][1]); if (k === "a" && nv === 0) nv = clamp(nv + +b.dataset.dir, RNG[k][0], RNG[k][1]) || cur;
        a.S[k] = String(nv); $("#fs-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : MV.md(api.content.labels.invalid); },
    checks:checks,
    key:function(D){ return D.a + "|" + D.b; },
    label:function(k){ var s = k.split("|"); return m("(a, b) = (" + s.join(", ") + ")"); },
    text:function(k){ return "(a, b) = (" + k.split("|").map(function(v){ return v.replace("-", MINUS); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ slopes:slopesAct },
  task:task
});

})();
