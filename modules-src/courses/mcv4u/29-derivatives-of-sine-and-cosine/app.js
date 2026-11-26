// MCV4U 29 Derivatives of Sine and Cosine: hero (tangent rides y = sin x, its slopes trail out cos x on a second panel),
// Slope of a wave (Explore: V4 tangent + V5 linked panels with a slope trail, guess overlays and f″; N24 unit circle twin with
// the velocity arrow; Degrees trap; N8 point marks for the challenges), Chain rule on waves (Part 3: chip-built derivatives
// with an N23 overlay gauge, four stations), Exact slopes and tangents (Practice 2, V8 π/√ boxes) and the "Wave design" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, STEP = PI / 12;
function m(s){ return MV.m(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol) * Math.max(1, Math.abs(b)); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function tpl(s, a){ return String(s).replace(/#(\d)/g, function(_, k){ return a[k - 1] != null ? a[k - 1] : "#" + k; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
// fixed decimals with a true minus ("0.500", "−0.866")
function fx(v, dp){ var s = (Math.abs(v) < 0.5 * Math.pow(10, -dp) ? 0 : v).toFixed(dp); return s.replace("-", MINUS); }
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
function arrowHead(ctx, x1, y1, x2, y2, col, s){
  var a = Math.atan2(y2 - y1, x2 - x1); s = s || 11;
  ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - s * Math.cos(a - 0.42), y2 - s * Math.sin(a - 0.42)); ctx.lineTo(x2 - s * Math.cos(a + 0.42), y2 - s * Math.sin(a + 0.42));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function seg(ctx, x1, y1, x2, y2, col, w, dash){
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.lineCap = "round"; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}
function chipRow(name, opts, val, label, dis){
  return '<div class="chips sw-chips" role="group" aria-label="' + MV.esc(MV.plain(label)) + '">' + opts.map(function(o){
    var on = String(val) === String(o.id), d = dis && dis(o);
    return '<button type="button" class="chip' + (on ? " on" : "") + '" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + on + '"' + (d ? " disabled" : "") + ">" + MV.md(o.t) + "</button>"; }).join("") + "</div>";
}
// numerical slope: symmetric difference quotient, h = 0.0001 (plan §6.3)
var H = 1e-4;
function slopeAt(f, x){ return (f(x + H) - f(x - H)) / (2 * H); }

// =====================================================================================================================
// @component N12 exactTrig (trimmed from MHF4U 26 / 31 unitCircle) — exact sin and cos at multiples of π/6 and π/4 as surd
// term lists [n, d, r] (n/d · √r), sums of terms, and inline m() sources ("√3/2", "1/2 + √3/2", "−3√2"). xLabel(x) gives "2π/3".
var TR = (function(){
  var SIN = { 0:[], 2:[[1, 2, 1]], 3:[[1, 2, 2]], 4:[[1, 2, 3]], 6:[[1, 1, 1]] }, COS = { 0:[[1, 1, 1]], 2:[[1, 2, 3]], 3:[[1, 2, 2]], 4:[[1, 2, 1]], 6:[] };
  function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function twelfths(t){ var q = t / STEP, n = Math.round(q); return Math.abs(q - n) < 1e-7 ? n : null; }
  function special(t){
    var n = twelfths(t); if (n == null) return null;
    var a = ((n % 24) + 24) % 24; if (a % 2 && a % 3) return null;
    var mm = a % 12, ref = mm <= 6 ? mm : 12 - mm, ss = Math.sign(Math.round(Math.sin(a * STEP) * 1e9)), cs = Math.sign(Math.round(Math.cos(a * STEP) * 1e9));
    function sg(list, s){ return list.map(function(q){ return [q[0] * s, q[1], q[2]]; }); }
    return { sin:sg(SIN[ref], ss), cos:sg(COS[ref], cs) };
  }
  function norm(list){
    var out = [];
    list.forEach(function(q){
      var o = out.filter(function(z){ return z[2] === q[2]; })[0];
      if (o) { o[0] = o[0] * q[1] + q[0] * o[1]; o[1] = o[1] * q[1]; } else out.push([q[0], q[1], q[2]]);
    });
    return out.map(function(q){ var g = gcd(q[0], q[1]); return [q[0] / g, q[1] / g, q[2]]; }).filter(function(q){ return q[0] !== 0; });
  }
  function scale(list, n, d){ return norm(list.map(function(q){ return [q[0] * n, q[1] * (d || 1), q[2]]; })); }
  function val(list){ return list.reduce(function(s, q){ return s + q[0] / q[1] * Math.sqrt(q[2]); }, 0); }
  function src(list){
    list = norm(list); if (!list.length) return "0";
    return list.map(function(q, i){
      var n = Math.abs(q[0]), d = q[1], body;
      if (q[2] === 1) body = d === 1 ? String(n) : n + "/" + d;
      else body = (n === 1 ? "" : n) + "√" + q[2] + (d === 1 ? "" : "/" + d);
      return (i === 0 ? (q[0] < 0 ? "-" : "") : (q[0] < 0 ? " - " : " + ")) + body;
    }).join("");
  }
  function rad(list){ return norm(list).some(function(q){ return q[2] !== 1; }); }
  function xLabel(x){ return twelfths(x) != null ? MV.piLabel(twelfths(x) * STEP, 12) : num(x, 2); }
  return { special:special, norm:norm, scale:scale, val:val, src:src, rad:rad, twelfths:twelfths, xLabel:xLabel };
})();
// ------------------------------------------------- end of N12 exactTrig -------------------------------------------------------

// =====================================================================================================================
// @component V8 piExact (adapted from MCV4U 25 eNumber / 26 lnExact) — exact numbers typed with fractions, √ and π (no
// variables): "−1/2", "√3/2 − π/6", "5π/6", "2√3", "π√3/2", "1/√3", "sqrt3", "pi/6". √ binds to the next factor ("√3/2" = (√3)/2).
//   piParse(str) -> { v, dec (a decimal point was typed) } or null;  piList(str) -> [{v, dec}] (commas, "and", "or") or null
function piParse(raw){
  var s = String(raw == null ? "" : raw).toLowerCase().replace(/[−–—]/g, "-").replace(/[·×]/g, "*").replace(/sqrt/g, "√").replace(/pi/g, "π").replace(/\s+/g, "");
  if (!s) return null;
  var i = 0, dec = false;
  function pk(){ return s[i]; }
  function starts(c){ return c != null && (/[0-9.(π√]/.test(c)); }
  function expr(){ var v = term(); while (pk() === "+" || pk() === "-") { var o = s[i++], w = term(); v = o === "+" ? v + w : v - w; } return v; }
  function term(){
    var v = un();
    for (;;) {
      var c = pk();
      if (c === "*" || c === "/") { i++; var w = un(); v = c === "*" ? v * w : v / w; }
      else if (starts(c)) v = v * pw();
      else break;
    }
    return v;
  }
  function un(){ if (pk() === "-") { i++; return -un(); } if (pk() === "+") { i++; return un(); } return pw(); }
  function pw(){ var b = at(); if (pk() === "^") { i++; return Math.pow(b, un()); } return b; }
  function at(){
    var c = pk();
    if (c === "(") { i++; var v = expr(); if (pk() !== ")") throw 0; i++; return v; }
    if (c === "π") { i++; return PI; }
    if (c === "√") { i++; var a = pw(); if (!(a >= 0)) throw 0; return Math.sqrt(a); }
    var mm = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)); if (!mm) throw 0;
    if (mm[0].indexOf(".") >= 0) dec = true;
    i += mm[0].length; return parseFloat(mm[0]);
  }
  try { var v = expr(); if (i !== s.length || !isFinite(v)) return null; return { v:v, dec:dec }; } catch (e) { return null; }
}
function piList(raw){
  var parts = String(raw || "").split(/[,;]|\bor\b|\band\b/).map(function(t){ return t.replace(/^\s*[a-z]\s*=\s*/i, "").trim(); }).filter(Boolean);
  if (!parts.length) return null;
  var out = [];
  for (var k = 0; k < parts.length; k++) { var r = piParse(parts[k]); if (!r) return null; if (!out.some(function(u){ return near(u.v, r.v); })) out.push(r); }
  return out;
}
// ------------------------------------------------- end of V8 piExact ----------------------------------------------------------

function boxHTML(k, val, label, cls, dis){
  return '<input class="numin short' + (cls ? " " + cls : "") + '" data-bx="' + k + '" data-k="bx' + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(val || "") + '"' + (dis ? " disabled" : "") + ">";
}

// ---------- hero: sin x draws, a tangent slides along it, its slopes trail out below, then cos x fades in on the trail ----------
function slopeWord(s){ var r = Math.round(s); return Math.abs(s - r) < 0.004 ? "slope " + num(r) : "slope ≈ " + fx(s, 2); }
function hero(f){
  var cv = f.canvas, cv2 = f.fig && f.fig.querySelector("#hero-d"); if (!cv || !cv2) return;
  var V = { xmin:-0.3, xmax:TAU + 0.3, ymin:-1.45, ymax:1.45 }, HC = (MV.C.hero || {}).cap || {};
  var p1 = new MV.Plot(cv, V), p2 = new MV.Plot(cv2, V), st = { end:0, x:null, trail:0, cos:0 };
  function draw(){
    var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink");
    var sc1 = { view:V, xTicks:{ step:PI / 2, pi:true }, yTicks:{ step:1 }, xLabel:"x", curves:[], lines:[], points:[] };
    if (st.end > 0) sc1.curves.push({ f:Math.sin, color:pen, width:3, domain:[0, st.end] });
    if (st.x != null) { var x = st.x, y = Math.sin(x); sc1.lines.push({ p:[x, y], q:[x + 1, y + Math.cos(x)], color:ink, width:2 }); sc1.points.push({ x:x, y:y, r:5.5, color:ink, ring:true }); }
    sc1.after = function(ctx, p){
      if (st.end > 0.5) bgText(ctx, "y = sin x", p.X(4.3), p.Y(1.15), "left", pen, mfont(15));
      if (st.x != null) { var right = st.x > 4.2; bgText(ctx, slopeWord(Math.cos(st.x)), p.X(st.x) + (right ? -14 : 14), p.Y(Math.sin(st.x)) + (Math.sin(st.x) > 0.3 ? 22 : -22), right ? "right" : "left", ink, ui(13, 700)); }
    };
    sc1.describe = "Graph of y = sin x from 0 to 2π" + (st.x != null ? ", with a tangent line at x = " + MV.piLabel(st.x, 12) + ", " + slopeWord(Math.cos(st.x)) + "." : ".");
    p1.draw(sc1);
    var sc2 = { view:V, xTicks:{ step:PI / 2, pi:true }, yTicks:{ step:1 }, xLabel:"x", curves:[], points:[] };
    if (st.trail > 0) sc2.curves.push({ f:Math.cos, color:f3, width:st.cos > 0 ? 5 : 2.8, domain:[0, st.trail] });
    if (st.x != null) sc2.points.push({ x:st.x, y:Math.cos(st.x), r:5.5, color:f3 });
    if (st.cos > 0) sc2.curves.push({ f:Math.cos, color:ink, width:2.2, dash:[10, 6], alpha:st.cos });
    sc2.after = function(ctx, p){
      bgText(ctx, "slopes", p.X(-0.2), p.Y(1.22), "left", f3, ui(13, 700));
      if (st.cos > 0) { ctx.save(); ctx.globalAlpha = st.cos; bgText(ctx, "f′(x) = cos x", p.X(4.3), p.Y(1.15), "left", ink, mfont(15)); ctx.restore(); }
    };
    sc2.describe = st.cos > 0 ? "The slopes of y = sin x form a teal trail, and a dashed graph of y = cos x lies exactly on it: f′(x) = cos x." : "The tangent’s slopes are recorded as a teal trail from 0 to " + MV.piLabel(Math.max(st.trail, 0), 12) + ".";
    p2.draw(sc2);
    if (f.cap) f.cap.innerHTML = MV.md(st.cos > 0 ? HC.end : HC.start);
  }
  p1.render = draw; p2.render = draw;
  function finalFrame(){ st = { end:TAU, x:TAU, trail:TAU, cos:1 }; draw(); }
  if (MV.reduceMotion) { finalFrame(); return; }
  draw();
  var lin = function(t){ return t; };
  function slide(a, b, dur, n){ MV.tween({ dur:dur, ease:lin, step:function(t){ st.x = a + (b - a) * t; st.trail = st.x; draw(); }, done:function(){ MV.wait(700, n); } }); }
  MV.wait(300, function(){
    MV.tween({ dur:1200, ease:lin, step:function(t){ st.end = TAU * t; draw(); }, done:function(){
      st.x = 0; st.trail = 0.0001; draw();
      MV.wait(800, function(){ slide(0, PI / 2, 1300, function(){ slide(PI / 2, PI, 1300, function(){ slide(PI, TAU, 2600, function(){
        MV.tween({ dur:900, step:function(t){ st.cos = Math.max(0.01, t); draw(); }, done:finalFrame });
      }); }); }); });
    } });
  });
}

// =====================================================================================================================
// ---------- Explore: Slope of a wave ----------
// @component V5 derivativePanels (adapted from MCV4U 07 / 23 / 25: linked f, f′-trail and f″ panels on one x-axis) — the
// top panel draws f in --pen with the V4 tangent in --ink and "slope ≈ …"; the lower panel collects the measured slopes as a
// teal trail (visited keys x·100 joined into runs), the guess curve in --ink long dashes; the optional third panel draws f″ in
// --f4. Degrees mode relabels the x-axis 0° to 360° and plots slopes per degree against the radian slopes (grey dashes).
function fnDef(id, k){
  if (id === "cos") return { f:Math.cos, d1:function(x){ return -Math.sin(x); }, d2:function(x){ return -Math.cos(x); }, src:"cos x", yA:1.45, dA:1.45, d2A:1.45 };
  if (id === "sum") return { f:function(x){ return Math.sin(x) + Math.cos(x); }, d1:function(x){ return Math.cos(x) - Math.sin(x); }, d2:function(x){ return -Math.sin(x) - Math.cos(x); }, src:"sin x + cos x", yA:1.85, dA:1.85, d2A:1.85 };
  if (id === "sink") return { f:function(x){ return Math.sin(k * x); }, d1:function(x){ return k * Math.cos(k * x); }, d2:function(x){ return -k * k * Math.sin(k * x); },
    src:"sin(@k{" + num(k, 1) + "}x)", yA:1.45, dA:Math.max(1.45, 1.2 * k + 0.25), d2A:Math.max(1.45, 1.2 * k * k + 0.25) };
  return { f:Math.sin, d1:Math.cos, d2:function(x){ return -Math.sin(x); }, src:"sin x", yA:1.45, dA:1.45, d2A:1.45 };
}
var GUESS = { sin:{ f:Math.sin, src:"sin x", fn:"sin", sg:1 }, cos:{ f:Math.cos, src:"cos x", fn:"cos", sg:1 },
  nsin:{ f:function(x){ return -Math.sin(x); }, src:"-sin x", fn:"sin", sg:-1 }, ncos:{ f:function(x){ return -Math.cos(x); }, src:"-cos x", fn:"cos", sg:-1 } };
var ANGS = [0, 2, 3, 4, 6, 8, 12, 18, 24];
function runs(keys){
  var s = keys.slice().sort(function(a, b){ return a - b; }), out = [];
  s.forEach(function(k){ var r = out[out.length - 1]; if (r && k === r[1] + 1) r[1] = k; else if (!r || k !== r[1]) out.push([k, k]); });
  return out;
}
// exact value of the current function at x (m() source) or null
function exactF(id, x, k){
  if (id === "sink") { var s = TR.special(k * x); return s ? s.sin : null; }
  var sp = TR.special(x); if (!sp) return null;
  return id === "sin" ? sp.sin : id === "cos" ? sp.cos : TR.norm(sp.sin.concat(sp.cos));
}
function valHTML(list, v){
  if (list) return m(TR.src(list)) + (TR.rad(list) ? " ≈ " + fx(v, 3) : "");
  return "≈ " + fx(v, 3);
}

function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["sin", "cos", "sum", "sink"].indexOf(S.fn) < 0) S.fn = "sin";
  if (typeof S.k !== "number" || !(S.k >= 0.5 && S.k <= 4)) S.k = 2;
  if (typeof S.x !== "number" || !(S.x >= 0 && S.x <= TAU + 1e-9)) S.x = PI / 3;
  if (["trail", "circle", "deg"].indexOf(S.mode) < 0) S.mode = "trail";
  if (S.guess && !GUESS[S.guess]) S.guess = null;
  if (!Array.isArray(S.marks)) S.marks = [];
  if (!Array.isArray(S.trail)) S.trail = [];
  S.f2 = !!S.f2;
  var busy = false, hl = null, anim = null, stop = null;

  function pan(id, cap){ return '<div class="sw-pan" id="sw-p' + id + '">' + (cap ? '<p class="sw-pcap" id="sw-cap' + id + '"></p>' : "") + '<div class="plot-wrap"><canvas class="plot sw-pc" id="sw-c' + id + '" role="img" aria-label="Graph"></canvas></div></div>'; }
  host.innerHTML = '<div class="sw-ex"><div class="sw-main" data-mv="graph"><p class="eq-cap sw-eq" id="sw-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="sw-pans">' + pan("f", false) + pan("d", true) + pan("2", true) +
    '<div class="sw-pan" id="sw-pu"><canvas class="sw-uc" id="sw-cu" role="img" aria-label="Unit circle and graph"></canvas></div></div>' +
    '<p class="tiny muted sw-key" id="sw-key"></p></div>' +
    '<div class="sw-side"><div id="sw-fns"></div><div id="sw-mode"></div><p class="tiny muted sw-how" id="sw-how"></p>' +
    '<label class="slider sw-sl"><span class="slider-top"><span>' + MV.md(T.point) + '</span><output id="sw-xout"></output></span>' +
    '<input type="range" id="sw-x" min="0" max="' + TAU + '" step="any" style="accent-color:var(--ink)" aria-label="Point x"></label>' +
    '<p class="tiny muted sw-note">' + MV.md(T.pointNote) + '</p><div id="sw-angs"></div><div id="sw-marks" class="sw-marks"></div>' +
    '<div id="sw-kbox" class="sw-kbox"><label class="slider sw-sl"><span class="slider-top"><span>' + MV.md(T.k) + '</span><output id="sw-kout" class="sw-kout"></output></span>' +
    '<input type="range" id="sw-k" min="0.5" max="4" step="0.5" style="accent-color:var(--p-k)" aria-label="k"></label><p class="tiny muted sw-note">' + MV.md(T.kNote) + "</p></div>" +
    '<div id="sw-gbox"></div><dl class="read sw-read" id="sw-read" aria-live="polite"></dl></div></div>';
  var pF = new MV.Plot($("#sw-cf", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), pD = new MV.Plot($("#sw-cd", host), { xmin:0, xmax:1, ymin:0, ymax:1 }),
    p2 = new MV.Plot($("#sw-c2", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), pU = new MV.Plot($("#sw-cu", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  var slX = $("#sw-x", host), slK = $("#sw-k", host);

  function F(){ return fnDef(S.fn, S.k); }
  function deg(){ return S.mode === "deg"; }
  function xTxt(x){ return deg() ? num(x / D2R, 1) + "°" : TR.xLabel(x); }
  function addKeys(a, b){ var lo = Math.round(Math.min(a, b) * 100), hi = Math.round(Math.max(a, b) * 100); for (var q = lo; q <= hi; q++) if (S.trail.indexOf(q) < 0) S.trail.push(q); }
  function hasMark(t){ return S.marks.some(function(v){ return Math.abs(v - t) < 0.011; }); }
  function markIdx(){ for (var i = 0; i < S.marks.length; i++) if (Math.abs(S.marks[i] - S.x) < 0.005) return i; return -1; }
  function snapX(v, tol){ v = clamp(v, 0, TAU); var n = Math.round(v / STEP); if (Math.abs(v - n * STEP) < (tol || 1e-6)) return r9(n * STEP) === r9(TAU) ? TAU : n * STEP; return r9(Math.round(v * 100) / 100); }
  function moveTo(v, how){ var prev = S.x; S.x = snapX(v, how === "tap" ? 0.04 : how === "drag" ? 0.03 : 1e-6); if (S.mode !== "circle") addKeys(how === "set" ? S.x : prev, S.x); }
  function guessMatches(){ return (S.fn === "sin" && S.guess === "cos") || (S.fn === "cos" && S.guess === "nsin") || (S.fn === "sink" && S.k === 1 && S.guess === "cos"); }
  function resetFn(){ S.trail = []; S.marks = []; S.guess = null; hl = null; }

  // ---------- drawing ----------
  function xView(){ return deg() ? { xmin:-15, xmax:375 } : { xmin:-0.25, xmax:TAU + 0.25 }; }
  function xTicks(){ return deg() ? { step:30, fmt:function(v){ return num(v) + "°"; } } : { step:PI / 2, pi:true }; }
  function describeF(){
    var D = F(), x = S.x, s = slopeAt(D.f, x), dir = Math.abs(s) < 0.0005 ? "horizontal tangent" : s > 0 ? "rising" : "falling";
    var t = "Graph of y = " + MV.plain(m(D.src)) + (deg() ? " with x in degrees" : "") + ". Tangent at x = " + MV.plain(m(xTxt(x))) + ", slope " + (deg() ? fx(s * D2R, 4) + " per degree" : num(s, 3)) + ", " + dir + ".";
    if (S.marks.length) t += " Marked points: " + S.marks.map(function(v){ return MV.plain(m(xTxt(v))); }).join(", ") + ".";
    return t;
  }
  function drawF(){
    var D = F(), pen = css("--pen"), ink = css("--ink"), x = S.x, sc;
    if (anim) {
      var sA = anim.s, fA = function(X){ return Math.sin(X / sA); }, VA = { xmin:anim.xmin, xmax:anim.xmax, ymin:-D.yA, ymax:D.yA };
      sc = { view:VA, xTicks:{ step:MV.niceStep((anim.xmax - anim.xmin) / 7), fmt:function(v){ return num(v) + (anim.phase === 2 ? "°" : ""); } }, yTicks:{ step:1 }, xLabel:"x",
        curves:[{ f:fA, color:pen, width:3 }], lines:[{ p:[0, 0], q:[1, 1 / sA], color:ink, width:2 }], points:[{ x:0, y:0, r:5.5, color:ink, ring:true }] };
      sc.after = function(ctx, p){ bgText(ctx, "slope ≈ " + fx(1 / sA, 4), p.X(0) + 14, p.Y(0) - 24, "left", ink, ui(13, 700)); if (hl && hl.panel === "f") drawHl(ctx, p); };
      sc.describe = "y = sin x stretched so that the x-axis is in degrees. The tangent at 0 flattens: slope about " + fx(1 / sA, 4) + ".";
      pF.draw(sc); return;
    }
    var V = Object.assign({ ymin:-D.yA, ymax:D.yA }, xView()), X = deg() ? x / D2R : x, fP = deg() ? function(t){ return D.f(t * D2R); } : D.f;
    var y = D.f(x), s = slopeAt(fP, X);
    sc = { view:V, xTicks:xTicks(), yTicks:{ step:1 }, xLabel:"x", curves:[{ f:fP, color:pen, width:3, domain:deg() ? [0, 360] : [0, TAU] }],
      lines:[{ p:[X, y], q:[X + 1, y + s], color:ink, width:2 }], points:[] };
    S.marks.forEach(function(v){ sc.points.push({ x:deg() ? v / D2R : v, y:D.f(v), r:7, color:css("--hi-ink") || ink, open:true }); });
    sc.points.push({ x:X, y:y, r:5.5, color:ink, ring:true });
    sc.after = function(ctx, p){
      var right = p.X(X) > p.W * 0.62, Y = p.Y(y);
      bgText(ctx, (deg() ? "slope ≈ " + fx(s, 4) + " per degree" : "slope ≈ " + fx(s, 3)), p.X(X) + (right ? -14 : 14), clamp(Y + (y > 0.25 ? 26 : -26), 14, p.H - 14), right ? "right" : "left", ink, ui(13, 700));
      S.marks.forEach(function(v){ var MX = p.X(deg() ? v / D2R : v); seg(ctx, MX, p.Y(0) - 6, MX, p.Y(0) + 6, ink, 2); });
      if (hl && hl.panel === "f") drawHl(ctx, p);
    };
    sc.describe = describeF();
    pF.draw(sc);
  }
  function drawHl(ctx, p){
    (hl.pts || []).forEach(function(q){ ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p.X(q[0]), p.Y(q[1]), 13, 0, TAU); ctx.stroke(); ctx.restore(); });
    if (hl.text) bgText(ctx, hl.text, clamp(p.X(hl.at[0]), 8, p.W - 8), clamp(p.Y(hl.at[1]), 14, p.H - 14), hl.align || "center", css("--ink"), ui(14, 700));
  }
  function drawD(){
    var D = F(), f3 = css("--f3"), ink = css("--ink"), x = S.x, sc;
    if (anim) {
      var sl = 1 / anim.s;
      sc = { view:{ xmin:anim.xmin, xmax:anim.xmax, ymin:-D.dA, ymax:D.dA }, xTicks:{ step:MV.niceStep((anim.xmax - anim.xmin) / 7), fmt:function(v){ return num(v) + (anim.phase === 2 ? "°" : ""); } }, yTicks:{ step:1 },
        xLabel:"x", points:[{ x:0, y:sl, r:5.5, color:f3 }], segments:[{ x1:0, y1:0, x2:0, y2:sl, color:f3, width:3 }] };
      sc.after = function(ctx, p){ if (hl && hl.panel === "d") drawHl(ctx, p); };
      sc.describe = "The slope at 0 shrinks to about " + fx(sl, 4) + ".";
      pD.draw(sc); return;
    }
    var V = Object.assign({ ymin:-D.dA, ymax:D.dA }, xView());
    sc = { view:V, xTicks:xTicks(), yTicks:{ step:D.dA > 3 ? 2 : 1 }, xLabel:"x", curves:[], points:[], segments:[] };
    var sF = deg() ? function(t){ return slopeAt(function(u){ return D.f(u * D2R); }, t); } : function(t){ return slopeAt(D.f, t); }, cX = deg() ? 1 / D2R : 1;
    if (deg()) sc.curves.push({ f:function(t){ return slopeAt(D.f, t * D2R); }, color:css("--ink-2"), width:2, dash:[6, 6], domain:[0, 360] });
    var G = S.mode === "trail" && S.guess ? GUESS[S.guess] : null;
    runs(S.trail).forEach(function(r){
      if (r[0] === r[1]) sc.points.push({ x:r[0] / 100 * cX, y:sF(r[0] / 100 * cX), r:3, color:f3 });
      else sc.curves.push({ f:sF, color:f3, width:G ? 6 : 3, domain:[r[0] / 100 * cX, r[1] / 100 * cX] });
    });
    if (G) sc.curves.push({ f:G.f, color:ink, width:2.2, dash:[12, 7], domain:[0, TAU] });
    var X = x * cX, s = sF(X);
    sc.segments.push({ x1:X, y1:-D.dA, x2:X, y2:D.dA, color:css("--ink-2"), width:1, dash:[3, 4] });
    sc.points.push({ x:X, y:s, r:5.5, color:f3 });
    sc.after = function(ctx, p){
      if (G) bgText(ctx, "guess: " + MV.plain(m(G.src)), p.W - 8, 14, "right", ink, ui(13, 700));
      if (deg()) bgText(ctx, MV.plain(MV.md(T.radGhost)), 8, 14, "left", css("--ink-2"), ui(12, 600));
      S.marks.forEach(function(v){ var MX = p.X(v * cX); seg(ctx, MX, p.Y(0) - 6, MX, p.Y(0) + 6, ink, 2); });
      if (hl && hl.panel === "d") drawHl(ctx, p);
    };
    var tr = S.trail.length ? " The trail runs over " + runs(S.trail).length + " stretch(es) of x." : " No trail yet.";
    sc.describe = (deg() ? "Measured slopes per degree, all close to 0 (within ±0.0175), with the radian slopes dashed for comparison." : "Measured slopes of y = " + MV.plain(m(D.src)) + " as a teal trail.") + tr +
      (G ? " Guess y = " + MV.plain(m(G.src)) + " drawn dashed" + (guessMatches() ? ": the slope trail matches it." : ": it does not match the trail.") : "") + " Slope at the point: " + (deg() ? fx(s, 4) : fx(s, 3)) + ".";
    pD.draw(sc);
  }
  function drawF2(){
    var D = F(), f4 = css("--f4"), x = S.x;
    var sc = { view:Object.assign({ ymin:-D.d2A, ymax:D.d2A }, xView()), xTicks:xTicks(), yTicks:{ step:D.d2A > 6 ? 5 : D.d2A > 3 ? 2 : 1 }, xLabel:"x",
      curves:[{ f:D.d2, color:f4, width:2.4, domain:[0, TAU] }], points:[{ x:x, y:D.d2(x), r:5, color:f4 }], segments:[{ x1:x, y1:-D.d2A, x2:x, y2:D.d2A, color:css("--ink-2"), width:1, dash:[3, 4] }] };
    sc.after = function(ctx, p){ bgText(ctx, "f″", p.X(0.15), 14, "left", f4, mfont(16)); };
    sc.describe = "Graph of the second derivative of y = " + MV.plain(m(D.src)) + " in magenta.";
    p2.draw(sc);
  }
  // ---- @component N24 circleGraphLink (adapted from MHF4U 31): unit circle twin with the velocity arrow (V4 tangent idea) ----
  function ucLayout(W){
    if (W >= 520) {
      var padL = 12, padR = 16, gap = 22, u = Math.min((W - padL - padR - gap) / (2.8 + TAU + 0.5), 92), H = Math.round(3.1 * u + 14);
      return { wide:true, H:H, cx:padL + 1.4 * u, cy:H / 2, R:u, gx0:padL + 2.8 * u + gap + 0.25 * u, ux:u, gy:H / 2, uy:u };
    }
    var R = Math.min(W * 0.27, 84), top = 1.5 * R + 12, ux = (W - 34) / (TAU + 0.5), gy = top + 1.5 * R + 26 + 1.45 * ux;
    return { wide:false, H:Math.round(gy + 1.45 * ux + 12), cx:W / 2, cy:top, R:R, gx0:16 + 0.25 * ux, ux:ux, gy:gy, uy:ux };
  }
  function drawU(){
    var c = pU.c, W = c.getBoundingClientRect().width; if (W < 40) return;
    var L = ucLayout(W); if (Math.abs(parseFloat(c.style.height || 0) - L.H) > 0.5) c.style.height = L.H + "px";
    var D = F(), x = S.x, th = x, isSin = S.fn !== "cos";
    pU.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false,
      describe:"Unit circle with the point at angle θ = " + MV.plain(m(TR.xLabel(x))) + ". Its velocity arrow (−sin θ, cos θ) = (" + fx(-Math.sin(th), 3) + ", " + fx(Math.cos(th), 3) + "): the height sin θ changes at rate cos θ and the run cos θ changes at rate −sin θ. Beside it, the graph of y = " + MV.plain(m(D.src)) + " with the point at x = " + MV.plain(m(TR.xLabel(x))) + ".",
      after:function(ctx){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), ax = css("--plot-axis"), grid = css("--plot-grid"), R = L.R;
        function GX(t){ return L.gx0 + t * L.ux; } function GY(v){ return L.gy - v * L.uy; }
        // graph frame
        ctx.save(); ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.beginPath();
        for (var q = 0; q <= 4; q++) { var gx = Math.round(GX(q * PI / 2)) + 0.5; ctx.moveTo(gx, GY(1.4)); ctx.lineTo(gx, GY(-1.4)); }
        [-1, 1].forEach(function(v){ var gy = Math.round(GY(v)) + 0.5; ctx.moveTo(GX(-0.2), gy); ctx.lineTo(GX(TAU + 0.2), gy); }); ctx.stroke(); ctx.restore();
        seg(ctx, GX(-0.2), GY(0), GX(TAU + 0.25), GY(0), ax, 1.5); seg(ctx, GX(0), GY(1.42), GX(0), GY(-1.42), ax, 1.5);
        ctx.save(); ctx.fillStyle = ink2; ctx.font = ui(12, 400); ctx.textAlign = "center"; ctx.textBaseline = "top";
        for (q = 1; q <= 4; q++) ctx.fillText(MV.piLabel(q * PI / 2), GX(q * PI / 2), GY(0) + 4);
        ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText("1", GX(0) - 5, GY(1)); ctx.fillText(MINUS + "1", GX(0) - 5, GY(-1)); ctx.restore();
        ctx.save(); ctx.strokeStyle = pen; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.beginPath();
        for (var i = 0; i <= 240; i++) { var t = TAU * i / 240, Y = GY(D.f(t)); if (i) ctx.lineTo(GX(t), Y); else ctx.moveTo(GX(t), Y); } ctx.stroke(); ctx.restore();
        var gpx = GX(x), gpy = GY(D.f(x)), s = D.d1(x), dl = 0.55 / Math.sqrt(1 + s * s);
        seg(ctx, GX(x - dl), GY(D.f(x) - s * dl), GX(x + dl), GY(D.f(x) + s * dl), ink, 2);
        // circle
        seg(ctx, L.cx - 1.3 * R, L.cy, L.cx + 1.3 * R, L.cy, ax, 1); seg(ctx, L.cx, L.cy - 1.3 * R, L.cx, L.cy + 1.3 * R, ax, 1);
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(L.cx, L.cy, R, 0, TAU); ctx.stroke();
        if (th > 0.01) { ctx.strokeStyle = css("--p-t"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(L.cx, L.cy, R * 0.28, 0, -th, true); ctx.stroke(); }
        ctx.restore();
        var Px = L.cx + R * Math.cos(th), Py = L.cy - R * Math.sin(th);
        seg(ctx, L.cx, L.cy, Px, Py, ink2, 1.5);
        // leader line to the graph's point
        seg(ctx, Px, Py, gpx, gpy, ink2, 1.6, [2, 5]);
        // velocity (−sin θ, cos θ) and its components
        var vx = -Math.sin(th) * R, vy = -Math.cos(th) * R, cs = Math.cos(th), sn = Math.sin(th);
        if (Math.abs(cs) > 0.04) { seg(ctx, Px, Py, Px, Py + vy, ink, isSin ? 2.6 : 1.8, [6, 4]); arrowHead(ctx, Px, Py, Px, Py + vy, ink, 9); }
        if (Math.abs(sn) > 0.04) { seg(ctx, Px, Py, Px + vx, Py, ink, isSin ? 1.8 : 2.6, [6, 4]); arrowHead(ctx, Px, Py, Px + vx, Py, ink, 9); }
        seg(ctx, Px, Py, Px + vx, Py + vy, ink, 3.2); arrowHead(ctx, Px, Py, Px + vx, Py + vy, ink, 12);
        ctx.beginPath(); ctx.arc(Px, Py, 10.5, 0, TAU); ctx.fillStyle = css("--hi"); ctx.fill();
        ctx.beginPath(); ctx.arc(Px, Py, 5.5, 0, TAU); ctx.fillStyle = ink; ctx.fill();
        ctx.beginPath(); ctx.arc(gpx, gpy, 10, 0, TAU); ctx.fillStyle = css("--hi"); ctx.fill();
        ctx.beginPath(); ctx.arc(gpx, gpy, 5.5, 0, TAU); ctx.fillStyle = ink; ctx.fill();
        if (Math.abs(cs) > 0.12) bgText(ctx, "cos θ", Px + (cs >= 0 ? 10 : -10), Py + vy / 2, cs >= 0 ? "left" : "right", ink, mfont(14));
        if (Math.abs(sn) > 0.12) bgText(ctx, MINUS + "sin θ", Px + vx / 2, Py + (cs >= 0 ? 16 : -16), "center", ink, mfont(14));
        bgText(ctx, "θ = " + MV.plain(m(TR.xLabel(x))), L.cx - 1.35 * R, L.cy - 1.3 * R + 4, "left", css("--p-t"), ui(12, 700));
        bgText(ctx, "y = " + MV.plain(m(D.src)), GX(TAU - 1.6), GY(1.28), "left", pen, mfont(14));
      } });
  }
  function drawAll(){ if (S.mode === "circle") drawU(); else { drawF(); drawD(); if (S.mode === "trail" && S.f2) drawF2(); } }
  pF.render = drawAll; pD.render = drawAll; p2.render = drawAll; pU.render = drawAll;

  // ---------- panels and controls ----------
  function layout(){
    $(".sw-ex", host).classList.toggle("sw-full", S.mode === "circle");
    $("#sw-pf", host).hidden = S.mode === "circle"; $("#sw-pd", host).hidden = S.mode === "circle";
    $("#sw-p2", host).hidden = !(S.mode === "trail" && S.f2); $("#sw-pu", host).hidden = S.mode !== "circle";
    $("#sw-capd", host).innerHTML = MV.md(deg() ? T.slopeDeg : T.slopePanel);
    $("#sw-cap2", host).innerHTML = MV.md("`f″` (second derivative)");
    $("#sw-kbox", host).hidden = S.fn !== "sink";
  }
  function paintTop(){
    $("#sw-eq", host).innerHTML = m("y = " + F().src) + (deg() ? ' <span class="tiny muted">(' + m("x") + " in degrees)</span>" : "");
    $("#sw-how", host).innerHTML = MV.md(C.modeHow[S.mode]);
    var key = S.mode === "circle" ? T.keyCircle : S.mode === "deg" ? T.keyDeg : T.keyTrail + (S.guess ? " " + T.keyGuess : "") + (S.f2 ? " " + T.keyF2 : "");
    $("#sw-key", host).innerHTML = MV.md(key);
  }
  function paintCtl(){
    MV.keepFocus($("#sw-fns", host), function(){
      $("#sw-fns", host).innerHTML = '<p class="sw-lab">' + T.fn + "</p>" + chipRow("fn", C.fns, S.fn, T.fn, function(o){ return S.mode === "circle" && (o.id === "sum" || o.id === "sink"); }) +
        (S.mode === "circle" ? '<p class="tiny muted sw-note">' + MV.md(T.circleOnly) + "</p>" : "");
    });
    MV.keepFocus($("#sw-mode", host), function(){
      $("#sw-mode", host).innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">' + T.mode + '</span><span class="seg" role="group" aria-label="Mode">' + C.modes.map(function(o){
        return '<button type="button" data-mode="' + o.id + '" data-k="md' + o.id + '" aria-pressed="' + (S.mode === o.id) + '">' + o.t + "</button>"; }).join("") + "</span></div>";
    });
    MV.keepFocus($("#sw-angs", host), function(){
      $("#sw-angs", host).innerHTML = '<div class="chips sw-chips sw-angc" role="group" aria-label="Special angles">' + ANGS.map(function(n){
        var a = n * STEP, on = Math.abs(S.x - a) < 1e-9; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-ang="' + n + '" data-k="ang' + n + '" aria-pressed="' + on + '">' + (deg() ? num(n * 15) + "°" : m(MV.piLabel(a, 12))) + "</button>"; }).join("") + "</div>";
    });
    MV.keepFocus($("#sw-marks", host), function(){
      var on = markIdx() >= 0;
      $("#sw-marks", host).innerHTML = '<div class="q-actions sw-mact"><button type="button" class="btn sm" data-act="mark" data-k="swmark">' + (on ? T.unmark : T.mark) + '</button><button type="button" class="btn ghost sm" data-act="clearmarks" data-k="swclm"' + (S.marks.length ? "" : " disabled") + ">" + T.clearMarks + "</button></div>" +
        '<p class="sw-mlist"><span class="tiny" style="font-weight:700">' + T.marks + "</span> " + (S.marks.length ? S.marks.slice().sort(function(a, b){ return a - b; }).map(function(v){
          var i = S.marks.indexOf(v); return '<button type="button" class="chip sw-mchip" data-unmark="' + i + '" data-k="um' + Math.round(v * 1000) + '" aria-label="Remove the mark at x = ' + MV.esc(MV.plain(m(xTxt(v)))) + '">' + m(xTxt(v)) + ' <span aria-hidden="true">✕</span></button>'; }).join(" ") : '<span class="tiny muted">' + T.noMarks + "</span>") + "</p>";
    });
    var g = "";
    if (S.mode === "trail") g = '<p class="sw-lab">' + T.guess + "</p>" + chipRow("guess", C.guesses, S.guess, T.guess) +
      '<div class="q-actions sw-tact"><button type="button" class="chip' + (S.f2 ? " on" : "") + '" data-act="f2" data-k="swf2" aria-pressed="' + S.f2 + '">' + MV.md(T.f2) + "</button>" +
      '<button type="button" class="btn ghost sm" data-act="all" data-k="swall">' + T.showAll + '</button><button type="button" class="btn ghost sm" data-act="clear" data-k="swclr"' + (S.trail.length > 1 ? "" : " disabled") + ">" + T.clearTrail + "</button></div>";
    MV.keepFocus($("#sw-gbox", host), function(){ $("#sw-gbox", host).innerHTML = g; });
  }
  function syncSl(){
    slX.value = S.x; $("#sw-xout", host).innerHTML = m(xTxt(S.x));
    slX.setAttribute("aria-valuetext", "x = " + MV.plain(m(xTxt(S.x))));
    slK.value = S.k; $("#sw-kout", host).textContent = num(S.k, 1);
  }
  function paintRead(){
    var D = F(), x = S.x, y = D.f(x), s = slopeAt(D.f, x), ex = exactF(S.fn, x, S.k), rows = [];
    rows.push([T.rows.fn, m("y = " + D.src)]);
    var xs = TR.twelfths(x) != null ? m("x = " + TR.xLabel(x)) : m("x") + " ≈ " + num(x, 2);
    if (deg()) xs += " (" + num(x / D2R, 1) + "°)";
    rows.push([T.rows.point, xs + ", " + m("y") + " " + (ex ? "= " : "") + valHTML(ex, y)]);
    rows.push([T.rows.slope, deg() ? "≈ " + fx(s * D2R, 4) + " per degree" : fx(s, 3)]);
    if (S.mode === "trail") {
      var G = S.guess ? GUESS[S.guess] : null;
      if (!G) rows.push([T.rows.guess, '<span class="tiny muted">' + T.pickGuess + "</span>"]);
      else {
        var sp = TR.special(x), gl = sp ? TR.scale(sp[G.fn], G.sg) : null, arg = TR.twelfths(x) != null ? TR.xLabel(x) : num(x, 2);
        rows.push([MV.md("`" + G.src + "` here"), m((G.sg < 0 ? "-" : "") + G.fn + "(" + arg + ")") + " " + (gl ? "= " : "") + valHTML(gl, G.f(x))]);
      }
    }
    rows.push([T.rows.dir, Math.abs(s) < 0.0005 ? T.flat : s > 0 ? T.rising : T.falling]);
    if (S.mode === "circle") rows.push([T.rows.vel, "Velocity " + m("(-sin θ, cos θ)") + " = (" + fx(-Math.sin(x), 3) + ", " + fx(Math.cos(x), 3) + ")"]);
    if (deg()) rows.push([T.rows.deg, "Slope at " + num(x / D2R, 1) + "°: ≈ " + fx(s * D2R, 4) + " per degree = " + m("(π/180) × " + num(s, 3).replace(MINUS, "-"))]);
    $("#sw-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintAll(){ layout(); paintTop(); paintCtl(); syncSl(); paintRead(); drawAll(); }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }
  function toggleMark(){
    var i = markIdx();
    if (i >= 0) S.marks.splice(i, 1); else if (S.marks.length < 8) S.marks.push(S.x);
    hl = null; changed();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b)) return;
    if (b.dataset.fn) { if (b.dataset.fn !== S.fn) { S.fn = b.dataset.fn; resetFn(); addKeys(S.x, S.x); } changed(); return; }
    if (b.dataset.mode) {
      S.mode = b.dataset.mode; hl = null;
      if (S.mode === "circle" && (S.fn === "sum" || S.fn === "sink")) { S.fn = "sin"; resetFn(); }
      if (S.mode !== "circle") addKeys(S.x, S.x);
      changed(); return;
    }
    if (b.dataset.ang != null) { moveTo(+b.dataset.ang * STEP, "set"); hl = null; changed(); return; }
    if (b.dataset.guess) { S.guess = S.guess === b.dataset.guess ? null : b.dataset.guess; hl = null; changed(); return; }
    if (b.dataset.unmark != null) { S.marks.splice(+b.dataset.unmark, 1); hl = null; changed(); return; }
    var a = b.dataset.act;
    if (a === "mark") { toggleMark(); return; }
    if (a === "clearmarks") { S.marks = []; changed(); return; }
    if (a === "f2") { S.f2 = !S.f2; changed(); return; }
    if (a === "all") { addKeys(0, TAU); changed(); return; }
    if (a === "clear") { S.trail = []; addKeys(S.x, S.x); changed(); }
  });
  slX.addEventListener("keydown", function(e){
    if (busy) return;
    var k = e.key, d = 0;
    if (k === "Enter") { e.preventDefault(); toggleMark(); return; }
    if (k === "Home" || k === "End") { e.preventDefault(); moveTo(k === "Home" ? 0 : TAU, "key"); hl = null; changed(); return; }
    if (k === "PageUp" || k === "PageDown") { e.preventDefault(); var n0 = S.x / (PI / 2); moveTo((k === "PageUp" ? Math.floor(n0 + 1e-7) + 1 : Math.ceil(n0 - 1e-7) - 1) * PI / 2, "key"); hl = null; changed(); return; }
    if (k === "ArrowRight" || k === "ArrowUp") d = 1; else if (k === "ArrowLeft" || k === "ArrowDown") d = -1; else return;
    e.preventDefault();
    if (e.shiftKey) moveTo(S.x + d * 0.01, "key");
    else { var n = S.x / STEP; moveTo((d > 0 ? Math.floor(n + 1e-7) + 1 : Math.ceil(n - 1e-7) - 1) * STEP, "key"); }
    hl = null; changed();
  });
  slX.addEventListener("input", function(){ if (busy) return; moveTo(+slX.value, "drag"); hl = null; changed(); });
  slK.addEventListener("input", function(){ if (busy) return; var v = clamp(Math.round(+slK.value * 2) / 2, 0.5, 4); if (v !== S.k) { S.k = v; S.trail = []; S.marks = []; S.guess = null; addKeys(S.x, S.x); } hl = null; changed(); });
  [pF, pD, p2].forEach(function(p){
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(), v = p.xOf(e.clientX - r.left); return deg() ? v * D2R : v; }
    p.c.addEventListener("pointerdown", function(e){ if (busy || !p.v) return; active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {} moveTo(at(e), "tap"); hl = null; changed(); });
    p.c.addEventListener("pointermove", function(e){ if (!active || busy) return; moveTo(at(e), "drag"); changed(); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  });
  (function(){
    var active = false;
    function at(e){
      var r = pU.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, L = ucLayout(r.width);
      if (Math.hypot(px - L.cx, py - L.cy) < 1.45 * L.R) { var a = Math.atan2(L.cy - py, px - L.cx); return a < 0 ? a + TAU : a; }
      return (px - L.gx0) / L.ux;
    }
    pU.c.style.touchAction = "none";
    pU.c.addEventListener("pointerdown", function(e){ if (busy) return; active = true; try { pU.c.setPointerCapture(e.pointerId); } catch (err) {} moveTo(at(e), "tap"); changed(); });
    pU.c.addEventListener("pointermove", function(e){ if (!active || busy) return; moveTo(at(e), "drag"); changed(); });
    pU.c.addEventListener("pointerup", function(){ active = false; }); pU.c.addEventListener("pointercancel", function(){ active = false; });
  })();
  if (S.mode !== "circle") addKeys(S.x, S.x);
  paintAll();

  // ---------- challenges ----------
  function chal(id){
    var M = MS[id], a, b, extra;
    if (id === "tc1") {
      if (S.fn !== "cos") return { ok:false, msg:M.fn };
      if (!S.marks.length) return { ok:false, msg:M.none };
      if (hasMark(PI / 6)) return { ok:false, msg:M.pi6 };
      if (hasMark(4 * PI / 3) || hasMark(5 * PI / 3)) return { ok:false, msg:M.q34 };
      a = hasMark(PI / 3); b = hasMark(2 * PI / 3);
      extra = S.marks.filter(function(v){ return Math.abs(v - PI / 3) >= 0.011 && Math.abs(v - 2 * PI / 3) >= 0.011; }).length;
      if (a && b && !extra) return { ok:true };
      if ((a || b) && !extra) return { ok:false, msg:M.one };
      return { ok:false, msg:(a || b) ? M.extra : M.general };
    }
    if (id === "tc2") {
      if (S.fn !== "sink") return { ok:false, msg:M.fn };
      if (S.k === 3) return { ok:true };
      if (S.k === 1) return { ok:false, msg:M.k1 };
      if (S.k === 1.5) return { ok:false, msg:M.k15 };
      if (S.k === 2) return { ok:false, msg:M.k2 };
      return { ok:false, msg:tpl(M.general, [fx(S.k * Math.cos(S.k * PI / 6), 3)]) };
    }
    if (id === "tc3") {
      if (S.fn !== "sum") return { ok:false, msg:M.fn };
      if (!S.marks.length) return { ok:false, msg:M.none };
      if (hasMark(3 * PI / 4) || hasMark(7 * PI / 4)) return { ok:false, msg:M.pair };
      a = hasMark(PI / 4); b = hasMark(5 * PI / 4);
      extra = S.marks.filter(function(v){ return Math.abs(v - PI / 4) >= 0.011 && Math.abs(v - 5 * PI / 4) >= 0.011; }).length;
      if (a && b && !extra) return { ok:true };
      if ((a || b) && !extra) return { ok:false, msg:M.one };
      return { ok:false, msg:(a || b) ? M.extra : M.general };
    }
    return { ok:false };
  }

  // ---------- predictions ----------
  var lin = function(t){ return t; };
  function sweep(a, b, dur, cb){ stop = MV.tween({ dur:dur, ease:lin, step:function(t){ moveTo(a + (b - a) * t, "anim"); syncSl(); paintRead(); drawAll(); }, done:function(){ stop = null; if (cb) cb(); } }); }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; hl = null; anim = null;
        function useFn(id){ if (S.fn !== id) { S.fn = id; S.marks = []; } S.guess = null; S.trail = []; }
        if (p.id === "p1") { useFn("sin"); S.mode = "trail"; S.f2 = false; S.x = 0; addKeys(0, 0); }
        else if (p.id === "p2") { useFn("sin"); S.mode = "trail"; S.f2 = false; S.x = PI / 2; addKeys(S.x, S.x); }
        else if (p.id === "p3") { useFn("cos"); S.mode = "trail"; S.f2 = false; S.x = 0; addKeys(0, 0); }
        else { useFn("sin"); S.mode = "deg"; S.x = 0; anim = { s:1, xmin:-0.5, xmax:7.5, phase:1 }; }
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; anim = null; lock(false); api.save(); paintAll(); MV.changed(); done(); }
        function show(h, cb){ hl = h; drawAll(); MV.wait(1200, cb); }
        if (p.id === "p1") sweep(0, TAU, 3200, function(){ show({ panel:"d", pts:[[0, 1], [TAU, 1]], text:"steepest rise: slope 1 at x = 0 and 2π", at:[PI, 1.2] }, fin); });
        else if (p.id === "p2") sweep(PI / 2, PI, 1600, function(){ show({ panel:"f", pts:[[PI, 0]], text:"slope −1 at (π, 0)", at:[PI + 0.25, 0.9], align:"left" }, fin); });
        else if (p.id === "p3") sweep(0, TAU, 3200, function(){ S.guess = "nsin"; show({ panel:"d", pts:[[PI / 2, -1]], text:"the trail is −sin x: −1 at π/2", at:[PI, 1.2] }, fin); });
        else {
          var s1 = 180 / PI;
          stop = MV.tween({ dur:2600, step:function(t){ anim.s = 1 + (s1 - 1) * t; anim.phase = t > 0.98 ? 2 : 1; drawAll(); }, done:function(){
            anim.s = s1; anim.phase = 2;
            MV.wait(700, function(){
              stop = MV.tween({ dur:1800, step:function(t){ anim.xmin = -0.5 - 14.5 * t; anim.xmax = 7.5 * Math.pow(375 / 7.5, t); drawAll(); }, done:function(){
                stop = null; anim = null; S.x = 0; addKeys(0, 0); paintAll(); lock(true);
                show({ panel:"d", pts:[[0, 0.0175]], text:"1° of run gives only 0.0175 of rise", at:[60, 1.1], align:"left" }, fin);
              } });
            });
          } });
        }
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Chain rule on waves ----------
// @component N13 stationStepper (MCV4U 13 / 25 pattern: numbered stations with Previous / Next) holding a chip-built
// derivative (V7 style: one chip per row; forms cfa = c·fn(arg), cef = c·factor·fn(x), cefa = c·factor·fn(arg), terms = sum of
// two term chips) and @component N23 overlayGauge (adapted from MHF4U 27 / MCV4U 25 Match gauge): the candidate in --ink long
// dashes over the measured slope trail in --f3, the largest gap on [view] and "exact match" below 0.002 (plan §6.3).
var P3F = {
  s3:function(x){ return Math.sin(3 * x); }, sq:function(x){ var s = Math.sin(x); return s * s; },
  cx2:function(x){ return Math.cos(x * x); }, xs:function(x){ return x * Math.sin(x); }
};
var P3SRC = { s3:"sin(3x)", sq:"sin^2 x", cx2:"cos(x^2)", xs:"x sin x" };
var ARG = { x:function(x){ return x; }, "3x":function(x){ return 3 * x; }, "2x":function(x){ return 2 * x; }, x2:function(x){ return x * x; } };
var ARGS = { x:"x", "3x":"3x", "2x":"2x", x2:"x^2" };
var TRIG = { sin:Math.sin, cos:Math.cos };
var EXF = { "1":function(){ return 1; }, x:function(x){ return x; }, sin:Math.sin, cos:Math.cos };
var TERM = { sinx:[function(x){ return Math.sin(x); }, "sin x"], cosx:[function(x){ return Math.cos(x); }, "cos x"], xsinx:[function(x){ return x * Math.sin(x); }, "x sin x"],
  xcosx:[function(x){ return x * Math.cos(x); }, "x cos x"], "-xcosx":[function(x){ return -x * Math.cos(x); }, "-x cos x"], "0":[function(){ return 0; }, ""] };
function coefSrc(c, more){
  if (c === 1) return more ? "" : "1";
  if (c === -1) return more ? "-" : "-1";
  if (Number.isInteger(c)) return String(c) + (more ? " " : "");
  var q = MV.mcv.Q.of(c); return (q.n < 0 ? "-" : "") + Math.abs(q.n) + "/" + q.d + (more ? " " : "");
}
function trigSrc(fn, arg){ return fn + (arg === "x" ? " x" : "(" + ARGS[arg] + ")"); }
function candidate(st, picks){
  var v = st.rows.map(function(r, i){ return picks[i] == null ? null : r.chips[picks[i]].v; });
  if (v.some(function(z){ return z == null; })) return null;
  var key = v.map(String).join("|"), f, src;
  if (st.form === "cfa") { f = function(x){ return v[0] * TRIG[v[1]](ARG[v[2]](x)); }; src = coefSrc(v[0], true) + trigSrc(v[1], v[2]); }
  else if (st.form === "cef") {
    f = function(x){ return v[0] * EXF[v[1]](x) * TRIG[v[2]](x); };
    src = v[1] === v[2] ? coefSrc(v[0], true) + v[2] + "^2 x" : coefSrc(v[0], true) + (v[1] === "1" ? "" : v[1] + " x ") + v[2] + " x";
  } else if (st.form === "cefa") {
    f = function(x){ return v[0] * EXF[v[1]](x) * TRIG[v[2]](ARG[v[3]](x)); };
    var cs = v[1] === "x" ? (v[0] === 1 ? "x" : v[0] === -1 ? "-x" : v[0] + "x") + " " : coefSrc(v[0], true);
    src = cs + trigSrc(v[2], v[3]);
  } else {
    var A = TERM[v[0]], B = TERM[v[1]];
    f = function(x){ return A[0](x) + B[0](x); };
    src = !A[1] && !B[1] ? "0" : !A[1] ? B[1] : !B[1] ? A[1] : A[1] + (B[1][0] === "-" ? " - " + B[1].slice(1) : " + " + B[1]);
  }
  return { f:f, src:src.replace(/\s+/g, " ").trim(), key:key };
}
function part3(host, api){
  var S = api.S, C = api.content, T = C.txt, SS = C.stations;
  S.st = S.st || {}; if (typeof S.cur !== "number" || S.cur < 0 || S.cur >= SS.length) S.cur = 0;
  function sst(id){ return S.st[id] || (S.st[id] = { p:[], checked:false, solved:false }); }
  var msg = {};
  host.innerHTML = '<div class="sw-stn" id="sw-stn"></div><div class="sw-stbody"><div class="sw-stl"><h3 id="sw-sth" class="sw-sth"></h3><p id="sw-stt"></p><div id="sw-rows"></div>' +
    '<p class="sw-cand" id="sw-cand" aria-live="polite"></p><div id="sw-stc"></div></div>' +
    '<div class="sw-str"><p class="sw-pcap" id="sw-sfc"></p><div class="plot-wrap"><canvas class="plot sw-sc1" id="sw-sf" role="img" aria-label="Graph of the function"></canvas></div>' +
    '<p class="sw-pcap" id="sw-sdc"></p><div class="plot-wrap"><canvas class="plot sw-sc2" id="sw-sd" role="img" aria-label="Measured slopes"></canvas></div><div id="sw-gauge"></div></div></div>';
  var pf = new MV.Plot($("#sw-sf", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), pd = new MV.Plot($("#sw-sd", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  function cur(){ return SS[S.cur]; }
  function gapOf(st, cand){
    var f = P3F[st.fn], a = st.view.xmin, b = st.view.xmax, g = 0;
    for (var i = 0; i <= 260; i++) { var x = a + (b - a) * i / 260; g = Math.max(g, Math.abs(cand.f(x) - slopeAt(f, x))); }
    return g;
  }
  function draw(){
    var st = cur(), x = sst(st.id), f = P3F[st.fn], pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), V = st.view;
    var tk = st.piTicks ? { step:PI / 2, pi:true } : { step:1 };
    pf.draw({ view:{ xmin:V.xmin, xmax:V.xmax, ymin:V.f[0], ymax:V.f[1] }, xTicks:tk, yTicks:{ step:V.f[1] - V.f[0] > 5 ? 2 : 1 }, xLabel:"x", curves:[{ f:f, color:pen, width:3 }],
      describe:"Graph of y = " + MV.plain(m(P3SRC[st.fn])) + "." });
    var cand = x.checked ? candidate(st, x.p) : null, sc = { view:{ xmin:V.xmin, xmax:V.xmax, ymin:V.d[0], ymax:V.d[1] }, xTicks:tk, yTicks:{ step:V.d[1] - V.d[0] > 8 ? 2 : 1 }, xLabel:"x",
      curves:[{ f:function(t){ return slopeAt(f, t); }, color:f3, width:cand && x.solved ? 7 : 3.2 }] };
    if (cand) sc.curves.push({ f:cand.f, color:ink, width:2.2, dash:[12, 7] });
    sc.describe = "Measured slopes of y = " + MV.plain(m(P3SRC[st.fn])) + " in teal" + (cand ? ", with your derivative " + MV.plain(m(cand.src)) + " dashed" + (x.solved ? ", lying exactly on them." : ", not matching them.") : ".");
    pd.draw(sc);
  }
  pf.render = draw; pd.render = draw;
  function paintNav(){
    var h = '<div class="sw-stbar" role="group" aria-label="Stations">' + SS.map(function(st, i){ var on = i === S.cur, ok = sst(st.id).solved;
      return '<button type="button" class="chip' + (on ? " on" : "") + '" data-st="' + i + '" data-k="sti' + i + '" aria-pressed="' + on + '">' + T.station + " " + (i + 1) + (ok ? ' <span aria-hidden="true">✓</span><span class="vh"> (' + T.solved + ")</span>" : "") + "</button>"; }).join("") + "</div>";
    MV.keepFocus($("#sw-stn", host), function(){ $("#sw-stn", host).innerHTML = h; });
  }
  function paint(){
    var st = cur(), x = sst(st.id);
    paintNav();
    $("#sw-sth", host).innerHTML = MV.md(st.title); $("#sw-stt", host).innerHTML = MV.md(st.text);
    $("#sw-sfc", host).innerHTML = MV.md(T.fLab + ": `y = " + P3SRC[st.fn] + "`"); $("#sw-sdc", host).innerHTML = MV.md(T.trail + " (teal)" + (x.checked ? " and " + T.yours + " (black dashes)" : ""));
    MV.keepFocus($("#sw-rows", host), function(){
      $("#sw-rows", host).innerHTML = '<p class="sw-lab">' + T.build + "</p>" + st.rows.map(function(r, ri){
        return '<div class="sw-brow"><span class="sw-blab">' + r.label + '</span><div class="chips sw-chips" role="group" aria-label="' + MV.esc(r.label) + '">' + r.chips.map(function(c, ci){
          var on = x.p[ri] === ci; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-r="' + ri + '" data-c="' + ci + '" data-k="b' + st.id + ri + "_" + ci + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + MV.md(c.t) + "</button>"; }).join("") + "</div></div>"; }).join("");
    });
    var cand = candidate(st, x.p);
    $("#sw-cand", host).innerHTML = T.cand + " " + (cand ? m("f′(x) = " + cand.src) : '<span class="muted">…</span>');
    var h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="gcheck" data-k="gchk">' + T.check + "</button>" +
      (S.cur > 0 ? '<button type="button" class="btn ghost sm" data-act="prev" data-k="stprev">' + T.prev + "</button>" : "") + (S.cur < SS.length - 1 ? '<button type="button" class="btn ghost sm" data-act="next" data-k="stnext">' + T.next + "</button>" : "") + "</div>";
    if (x.solved) h += MV.fbHTML("good", "<strong>" + T.match + "</strong>") + '<details class="alg" open><summary>' + T.alg + '</summary><div class="alg-lines">' + st.alg.map(function(l){ return "<div>" + MV.md(l) + "</div>"; }).join("") + "</div></details>" +
      '<div class="q-actions">' + (S.cur > 0 ? '<button type="button" class="btn ghost sm" data-act="prev" data-k="stprev">' + T.prev + "</button>" : "") + (S.cur < SS.length - 1 ? '<button type="button" class="btn primary sm" data-act="next" data-k="stnext">' + T.next + "</button>" : "") + "</div>";
    else if (msg[st.id]) h += MV.fbHTML(msg[st.id].bad ? "bad" : "", MV.md(msg[st.id].html));
    MV.keepFocus($("#sw-stc", host), function(){ $("#sw-stc", host).innerHTML = h; });
    var gh = "";
    if (x.checked && cand) {
      var g = x.gap != null ? x.gap : gapOf(st, cand), ok = g < 0.002;
      gh = '<div class="sw-gauge"><p class="sw-gh">' + T.gauge + '</p><div class="sw-bar' + (ok ? " ok" : "") + '" role="img" aria-label="Largest gap ' + fx(g, 3) + ' on a scale from 0 to 2"><span style="width:' + (clamp(g / 2, 0, 1) * 100).toFixed(1) + '%"></span></div>' +
        '<p class="sw-gv">' + tpl(T.gap, [fx(g, 3)]) + (ok ? ' <strong class="sw-ok">✓</strong>' : "") + "</p></div>";
    }
    $("#sw-gauge", host).innerHTML = gh;
    draw();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var st = cur(), x = sst(st.id);
    if (b.dataset.st != null) { S.cur = +b.dataset.st; api.save(); paint(); return; }
    if (b.dataset.r != null) { x.p[+b.dataset.r] = +b.dataset.c; x.checked = false; x.gap = null; msg[st.id] = null; api.save(); paint(); return; }
    var a = b.dataset.act;
    if (a === "prev" || a === "next") { S.cur = clamp(S.cur + (a === "next" ? 1 : -1), 0, SS.length - 1); api.save(); paint(); var hd = $("#sw-sth", host); if (hd && hd.scrollIntoView) hd.scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" }); return; }
    if (a === "gcheck") {
      var cand = candidate(st, x.p);
      if (!cand) { msg[st.id] = { bad:false, html:T.pick }; paint(); MV.focusFb($("#sw-stc", host)); return; }
      x.checked = true; x.gap = gapOf(st, cand);
      if (x.gap < 0.002) { x.solved = true; msg[st.id] = null; }
      else msg[st.id] = { bad:true, html:"<strong>✗ " + T.noMatch + "</strong> " + ((st.msgs || {})[cand.key] || st.general) + " " + T.tryAgain };
      api.save(); paint(); MV.focusFb($("#sw-stc", host));
    }
  });
  paint();
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Exact slopes and tangents ----------
// @component V8 designBoxes (adapted from MCV4U 21 / 25: values with π and √ through V8 piExact) — labelled answer boxes per
// item: single values and lists ("π/6, 5π/6"; order-free); named wrong states ({k, eq}), a "give the exact value" message for
// decimals close to the answer, first-try scoring and three-level help.
function exactAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + MV.md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q sw-dq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="sw-din"></div><div class="sw-dcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .sw-din', host);
    var h = '<div class="sw-dt">' + it.boxes.map(function(b){
      return '<div class="sw-dr"><span class="sw-dl">' + MV.md(b.pre) + "</span>" + boxHTML(b.k, x.v[b.k], MV.plain(MV.md(b.pre)), b.list ? "sw-long" : "", x.solved) + "</div>";
    }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .sw-dcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.md(MV.hintsHTML(it.hints, x.hint)) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + MV.md(it.display) + ".</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", MV.md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, decs = false, i, b;
    for (i = 0; i < it.boxes.length; i++) {
      b = it.boxes[i]; var raw = String(x.v[b.k] || "").trim();
      if (!raw) return { err:TX.fill };
      if (b.list) { var l = piList(raw); if (!l) return { err:TX.err }; if (l.some(function(q){ return q.dec; })) decs = true; vals[b.k] = l.map(function(q){ return q.v; }); }
      else { var p = piParse(raw); if (!p) return { err:TX.err }; if (p.dec) decs = true; vals[b.k] = p.v; }
    }
    function same(k, A, tol){
      var V = vals[k];
      if (Array.isArray(A)) return Array.isArray(V) && V.length === A.length && MV.sameNums(V, A, tol);
      return typeof V === "number" && near(V, A, tol);
    }
    var keys = Object.keys(ans);
    if (!decs && keys.every(function(k){ return same(k, ans[k], 1e-9); })) return { ok:true };
    var W = it.wrong || [];
    for (i = 0; i < W.length; i++) if (same(W[i].k, W[i].eq, 1e-9)) return { msg:W[i].fb };
    if (decs && keys.every(function(k){ return same(k, ans[k], 0.01); })) return { exact:true };
    return { msg:it.general || TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
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

// =====================================================================================================================
// ---------- Performance task: Wave design, y = a sin(kx) ----------
var KS = [{ id:"1/2", v:0.5 }, { id:"1", v:1 }, { id:"3/2", v:1.5 }, { id:"2", v:2 }, { id:"3", v:3 }, { id:"4", v:4 }, { id:"6", v:6 }];
function kOf(id){ var o = KS.filter(function(q){ return q.id === id; })[0]; return o ? o.v : null; }
function kxSrc(id){ return id === "1" ? "x" : id === "1/2" ? "x/2" : id === "3/2" ? "3x/2" : id + "x"; }
function ratSrc(v){ var q = MV.mcv.Q.of(v); return q.d === 1 ? String(q.n) : q.n + "/" + q.d; }
var task = (function(){
  var api, plot;
  function read(){ var a = api && api.S.a, k = api && kOf(api.S.k); return { a:a, k:k, kid:api && api.S.k, valid:Number.isInteger(a) && a >= 1 && a <= 8 && k != null }; }
  function checks(D){
    if (!D.valid) return [false, false, false];
    return [near(D.a * D.k, 6), D.a >= 2, D.a * D.k * Math.cos(D.k * PI / 4) >= -1e-9];
  }
  function preview(){
    var D = read(), L = api.content.labels, rd = $("#wd-read"); if (!D.valid) return;
    var a = D.a, k = D.k, ak = a * k, s4 = ak * Math.cos(k * PI / 4), f = function(x){ return a * Math.sin(k * x); };
    var sp = TR.special(k * PI / 4), s4src = sp ? TR.src(TR.scale(sp.cos, Math.round(ak * 2), 2)) : null;
    var pen = css("--pen"), ink = css("--ink");
    var kc = D.kid === "1" ? "x" : D.kid.indexOf("/") >= 0 ? "@k{(" + D.kid + ")}x" : "@k{" + D.kid + "}x";
    var rows = [[L.fRow, m("y = @a{" + a + "} sin(" + kc + ")")],
      [L.dRow, m("y′ = " + ratSrc(ak) + " cos(" + kxSrc(D.kid) + ")")],
      [L.s0, m(ratSrc(ak))],
      [L.s4, (s4src ? m(s4src) + (TR.rad(TR.scale(sp.cos, 1)) ? " ≈ " + fx(s4, 2) : "") : "≈ " + fx(s4, 2)) + (Math.abs(s4) < 1e-9 ? " (" + L.flat + ")" : "")],
      [L.max, m(String(a))]];
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
    var ym = a + 1, V = { xmin:-0.45, xmax:3.4, ymin:-ym, ymax:ym }, x4 = PI / 4, y4 = f(x4);
    plot.draw({ view:V, xTicks:{ step:PI / 4, pi:true }, yTicks:{ step:a > 4 ? 2 : 1 }, xLabel:"x", curves:[{ f:f, color:pen, width:3 }],
      lines:[{ p:[0, 0], q:[1, ak], color:ink, width:2 }, { p:[x4, y4], q:[x4 + 1, y4 + s4], color:ink, width:2 }],
      points:[{ x:0, y:0, r:5.5, color:ink, ring:true }, { x:x4, y:y4, r:5.5, color:ink, ring:true }],
      after:function(ctx, p){
        bgText(ctx, "slope " + MV.plain(m(ratSrc(ak))), p.X(0) + 12, clamp(p.Y(0) + 22, 14, p.H - 14), "left", ink, ui(13, 700));
        bgText(ctx, Math.abs(s4) < 1e-9 ? "slope 0" : "slope ≈ " + fx(s4, 2), p.X(x4) + 12, clamp(p.Y(y4) + (y4 > 0 ? 24 : -24), 14, p.H - 14), "left", ink, ui(13, 700));
      },
      describe:"Graph of y = " + a + " sin(" + MV.plain(m(kxSrc(D.kid))) + ") with tangent lines at x = 0 (slope " + MV.plain(m(ratSrc(ak))) + ") and at x = π/4 (slope about " + fx(s4, 2) + "). Maximum value " + a + "." });
  }
  function chips(name, opts, val, label, pc){
    return '<div class="wd-row"><span class="wd-lab">' + label + '</span><div class="chips sw-chips wd-' + pc + '" role="group" aria-label="' + MV.esc(name) + '">' + opts.map(function(o){
      var on = String(val) === String(o.id); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-wd="' + name + '" data-v="' + o.id + '" data-k="wd' + name + o.id + '" aria-pressed="' + on + '">' + m(o.t) + "</button>"; }).join("") + "</div></div>";
  }
  function paintIn(inp){
    var L = api.content.labels;
    MV.keepFocus(inp, function(){
      inp.innerHTML = '<div class="wd-in">' + chips("a", [1, 2, 3, 4, 5, 6, 7, 8].map(function(v){ return { id:v, t:String(v) }; }), api.S.a, MV.md(L.a), "a") +
        chips("k", KS.map(function(q){ return { id:q.id, t:q.id }; }), api.S.k, MV.md(L.k), "k") + "</div>";
    });
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (!Number.isInteger(a.S.a)) a.S.a = 1; if (kOf(a.S.k) == null) a.S.k = "1";
      paintIn(inp);
      pv.innerHTML = '<div id="wd-read" aria-live="polite"></div><p class="tiny wd-gh">' + MV.md(L.graph) + '</p><div class="plot-wrap"><canvas class="plot" id="wd-plot" role="img" aria-label="Graph of the wave"></canvas></div>';
      plot = new MV.Plot($("#wd-plot"), { xmin:-0.45, xmax:3.4, ymin:-2, ymax:2 }); plot.render = preview;
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button[data-wd]"); if (!b) return;
        if (b.dataset.wd === "a") a.S.a = +b.dataset.v; else a.S.k = b.dataset.v;
        a.save(); paintIn(inp); preview(); a.update();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : "Choose a and k."; },
    checks:checks,
    key:function(D){ return D.a + "|" + D.kid; },
    label:function(k){ var s = k.split("|"); return m("(@a{a}, @k{k}) = (" + s[0] + ", " + s[1] + ")"); },
    text:function(k){ var s = k.split("|"); return "(a, k) = (" + s[0] + ", " + s[1] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ exact:exactAct },
  task:task
});
})();
