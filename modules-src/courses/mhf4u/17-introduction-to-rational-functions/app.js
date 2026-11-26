// MHF4U 17 Introduction to Rational Functions: hero (y = 1/x near and far), approach-ladder explorer (Explore),
// "Read the equation" case cards with the leading-term race (Part 3), match thumbnails, work-backwards builds and
// the "Design a rational function" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function M(s){ return MV.m(s); }
function mi(s){ return MV.m(s).replace(/^<span class="m">/, "").replace(/<\/span>$/, ""); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function pv(c, x){ var r = 0; for (var i = c.length - 1; i >= 0; i--) r = r * x + c[i]; return r; }
function degOf(c){ var k = c.length - 1; while (k > 0 && !c[k]) k--; return k; }
// polynomial (coefficients low -> high) as MV.m source: [0, -8, 2] -> "2x^2 - 8x"
function polyM(c){
  var s = "";
  for (var k = c.length - 1; k >= 0; k--) {
    var v = c[k]; if (!v) continue;
    var a = Math.abs(v), t = ((a === 1 && k > 0) ? "" : String(a)) + (k === 0 ? "" : k === 1 ? "x" : "x^" + k);
    s += s ? (v < 0 ? " - " : " + ") + t : (v < 0 ? "-" : "") + t;
  }
  return s || "0";
}
function grp(s){ var p = s.split("."); if (p[0].length > 4) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); return p.join("."); }
// four significant figures, fixed notation, trailing zeros kept (≈ 2.000, ≈ 0.0006002, ≈ 15 000)
function sig4(v){
  if (!v) return "0";
  var neg = v < 0, a = Math.abs(v), e = Math.floor(Math.log10(a)), r = Math.round(a / Math.pow(10, e - 3));
  while (r >= 10000) { r = Math.round(r / 10); e++; }
  while (r < 1000) { r = r * 10; e--; }
  var ds = String(r), s;
  if (e >= 3) s = ds + new Array(e - 2).join("0");
  else if (e >= 0) s = ds.slice(0, e + 1) + "." + ds.slice(e + 1);
  else s = "0." + new Array(-e).join("0") + ds;
  return (neg ? MINUS : "") + grp(s);
}
// a simple exact value: integer, small fraction, √k, else ≈ 2 dp.  Returns {s, apx}
function valT(v){
  if (Math.abs(v - Math.round(v)) < 1e-9) return { s:num(Math.round(v), 0), apx:false };
  for (var d = 2; d <= 12; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return { s:(n < 0 ? "-" : "") + Math.abs(n) + "/" + d, apx:false }; }
  var s2 = v * v; if (Math.abs(s2 - Math.round(s2)) < 1e-9) return { s:(v < 0 ? "-" : "") + "√" + Math.round(s2), apx:false };
  return { s:num(v, 2), apx:true };
}
function eqV(name, v){ var t = valT(v); return M(name + (t.apx ? " ≈ " : " = ") + t.s); }
var SUPD = "⁰¹²³⁴⁵⁶⁷⁸⁹";
// tick labels: spaced thousands; from 1 000 000 up, "2 × 10⁷" so they fit at 390 px
function tickFmt(t){
  var a = Math.abs(t);
  if (a >= 999999.5) {
    var e = Math.floor(Math.log10(a) + 1e-9), m = Math.round(a / Math.pow(10, e) * 100) / 100;
    return (t < 0 ? MINUS : "") + String(m) + " × 10" + String(e).split("").map(function(d){ return SUPD[+d]; }).join("");
  }
  return num(t, 4);
}

// y tick labels: short ones are drawn by the engine (under the curves); long ones (|y| ≥ 1000) are redrawn on top
// with a halo so huge values stay legible beside a branch at 390 px
function NOFMT(t){ return Math.abs(t) >= 999.5 ? "" : tickFmt(t); }
function yLabels(ctx, p){
  var v = p.v, H = p.H, W = p.W, sy = MV.niceStep((v.ymax - v.ymin) / (H < 320 ? 6 : 9)), lx = Math.min(Math.max(p.X(0) - 5, 26), W - 4);
  ctx.save(); ctx.font = "12px " + (p.fontUI || "sans-serif"); ctx.textAlign = "right"; ctx.textBaseline = "middle";
  for (var y = Math.ceil(v.ymin / sy - 1e-9) * sy; y <= v.ymax + 1e-9; y += sy) {
    if (Math.abs(y) < 999.5) continue;
    var Y = p.Y(y); if (Y < 8 || Y > H - 8) continue;
    var s = tickFmt(y);
    ctx.lineJoin = "round"; ctx.lineWidth = 4; ctx.strokeStyle = css("--sheet"); ctx.strokeText(s, lx, Y);
    ctx.fillStyle = css("--ink-2"); ctx.fillText(s, lx, Y);
  }
  ctx.restore();
}

// ---------- exact values (BigInt) ----------
// @component exactQ — exact values of integer-coefficient polynomials and their quotients at x = k/10 000, printed by the
// readout rule: exact when the decimal has at most 6 significant digits, otherwise ≈ and 4 significant digits.
var XQ = (function(){
  var B = window.BigInt, Z = B(0), ONE = B(1), TWO = B(2), FIVE = B(5), TEN = B(10), UB = B(10000);
  function abs(a){ return a < Z ? -a : a; }
  function gcd(a, b){ a = abs(a); b = abs(b); while (b !== Z) { var t = a % b; a = b; b = t; } return a; }
  function q(n, d){ if (d < Z) { n = -n; d = -d; } var g = gcd(n, d); if (g > ONE) { n = n / g; d = d / g; } return { n:n, d:d }; }
  function pw(b, e){ var r = ONE; while (e-- > 0) r = r * b; return r; }
  function at(c, k){ var dg = c.length - 1, kb = B(k), s = Z; for (var i = 0; i <= dg; i++) s = s + B(c[i]) * pw(kb, i) * pw(UB, dg - i); return q(s, pw(UB, dg)); }
  function div(a, b){ return b.n === Z ? null : q(a.n * b.d, a.d * b.n); }
  function sub(a, b){ return q(a.n * b.d - b.n * a.d, a.d * b.d); }
  function int(v){ return q(B(v), ONE); }
  function terminating(d){ while (d % TWO === Z) d = d / TWO; while (d % FIVE === Z) d = d / FIVE; return d === ONE; }
  function decStr(a){ var d = a.d, p = ONE, k = 0; while (p % d !== Z) { p = p * TEN; k++; } var s = (abs(a.n) * (p / d)).toString(); if (k > 0) { while (s.length <= k) s = "0" + s; s = s.slice(0, s.length - k) + "." + s.slice(s.length - k); } return s; }
  function fmt(a){
    if (a.n === Z) return "0";
    var neg = a.n < Z;
    if (terminating(a.d)) { var s = decStr(a), t = s.replace(".", "").replace(/^0+/, ""); if (s.indexOf(".") < 0) t = t.replace(/0+$/, ""); if (t.length <= 6) return (neg ? MINUS : "") + grp(s); }
    return "≈ " + sig4(Number(a.n) / Number(a.d));
  }
  return { at:at, div:div, sub:sub, int:int, fmt:fmt,
    sign:function(a){ return a.n < Z ? -1 : a.n > Z ? 1 : 0; }, abs:function(a){ return { n:abs(a.n), d:a.d }; },
    num:function(a){ return Number(a.n) / Number(a.d); }, zero:function(a){ return a.n === Z; } };
})();

// ---------- graph helpers ----------
// pieces of a rational function between its restrictions (G1: never joined across a vertical asymptote)
function curvePieces(f, restr, color, extra){
  var out = [], lo = -Infinity, eps = 1e-9;
  restr.slice().sort(function(a, b){ return a - b; }).forEach(function(a){ out.push([lo, a - eps]); lo = a + eps; });
  out.push([lo, Infinity]);
  return out.map(function(d){ return Object.assign({ f:f, color:color || css("--pen"), width:3, domain:d }, extra || {}); });
}
// 6 px --hi-soft underlay beneath an axis that is also an asymptote (a G6 region, so it is drawn before the axes);
// prog draws it in (vertical: top to bottom, horizontal: left to right). Extents are getters: the plot's view and
// size are only known while it draws.
function underlay(plot, a, prog){
  prog = prog == null ? 1 : prog;
  var r = { color:css("--hi-soft") }, wx = function(){ return 3 * (plot.v.xmax - plot.v.xmin) / plot.W; }, wy = function(){ return 3 * (plot.v.ymax - plot.v.ymin) / plot.H; };
  if (a.x != null) {
    Object.defineProperty(r, "x0", { enumerable:true, get:function(){ return a.x - wx(); } });
    Object.defineProperty(r, "x1", { enumerable:true, get:function(){ return a.x + wx(); } });
    r.f = function(){ return plot.v.ymax; }; r.g = function(){ return plot.v.ymax - (plot.v.ymax - plot.v.ymin) * prog; };
  } else {
    r.x0 = null;
    Object.defineProperty(r, "x1", { enumerable:true, get:function(){ return plot.v.xmin + (plot.v.xmax - plot.v.xmin) * prog; } });
    r.f = function(){ return a.y + wy(); }; r.g = function(){ return a.y - wy(); };
  }
  return r;
}
function regionsFor(plot, list){ return list; }
// dashed asymptote (G1) drawn in with progress, label faded in with alpha
function asymDraw(ctx, p, a, prog, alpha, label){
  var col = css("--ink-2");
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]); ctx.beginPath();
  if (a.x != null) { var X = Math.round(p.X(a.x)) + 0.5; ctx.moveTo(X, 0); ctx.lineTo(X, p.H * prog); }
  else { var Y = Math.round(p.Y(a.y)) + 0.5; ctx.moveTo(0, Y); ctx.lineTo(p.W * prog, Y); }
  if (!a.onAxis) ctx.stroke();
  ctx.restore();
  if (label && alpha > 0) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.font = "italic 13px " + (p.fontM || "serif"); ctx.fillStyle = col; ctx.textBaseline = "middle";
    if (a.x != null) { var lx = p.X(a.x) + 6; ctx.textAlign = "left"; if (lx > p.W - 70) { lx -= 12; ctx.textAlign = "right"; } ctx.fillText(label, lx, 14); }
    else { ctx.textAlign = "right"; var ly = p.Y(a.y) - 11; if (ly < 12) ly = p.Y(a.y) + 12; ctx.fillText(label, p.W - 8, ly); }
    ctx.restore();
  }
}
// regions for the asymptote list: [{x|y, prog}] -> underlays for those on an axis
function axisUnderlays(plot, list){
  var r = [];
  list.forEach(function(a){ if ((a.x === 0) || (a.y === 0)) r.push(underlay(plot, a.x === 0 ? { x:0 } : { y:0 }, a.prog)); });
  return regionsFor(plot, r);
}
function asymLabel(a){ return (a.x != null ? "x = " : "y = ") + num(a.x != null ? a.x : a.y); }

// ---------- hero: y = 1/x, near and far (storyboard in the plan) ----------
function hero(f){
  var cv = f.canvas, cap = f.cap; if (!cv) return;
  var p = new MV.Plot(cv, { xmin:-6, xmax:6, ymin:-6, ymax:6 }), inv1 = function(x){ return 1 / x; };
  var VA = "vertical asymptote x = 0", HA = "horizontal asymptote y = 0", FINAL = "Near 0 it explodes. Far away it fades. It never touches either line.";
  var st = { v:{ xmin:-6, xmax:6, ymin:-6, ymax:6 }, r0:6, l1:-6, showR:false, showL:false, dot:null, va:0, vaL:0, ha:0, haL:0 };
  p.render = function(){
    var curves = [];
    if (st.showR) curves.push({ f:inv1, color:css("--pen"), width:3, domain:[st.r0, 1e9] });
    if (st.showL) curves.push({ f:inv1, color:css("--pen"), width:3, domain:[-1e9, st.l1] });
    var regs = [];
    if (st.va > 0) regs.push(underlay(p, { x:0 }, st.va));
    if (st.ha > 0) regs.push(underlay(p, { y:0 }, st.ha));
    p.draw({ view:st.v, yTicks:{ fmt:NOFMT }, xTicks:{ fmt:tickFmt }, regions:regs, curves:curves,
      points:st.dot ? [{ x:st.dot[0], y:st.dot[1], r:6, color:css("--ink") }] : [],
      after:function(ctx){
        yLabels(ctx, p);
        ctx.save(); ctx.font = "600 13px " + (p.fontUI || "sans-serif"); ctx.fillStyle = css("--ink-2"); ctx.textBaseline = "middle";
        if (st.vaL > 0) { ctx.globalAlpha = st.vaL; ctx.textAlign = "right"; ctx.fillText(VA, p.X(0) - 8, 16); }
        if (st.haL > 0) { ctx.globalAlpha = st.haL; ctx.textAlign = "right"; ctx.fillText(HA, p.W - 8, p.Y(0) + 32); }
        ctx.restore();
      },
      describe:"Graph of y = 1/x: one branch in quadrant 1 and one in quadrant 3. Vertical asymptote x = 0 and horizontal asymptote y = 0. Near 0 the graph shoots up or down; far away it flattens toward the x-axis." });
  };
  function capT(h){ cap.innerHTML = h; }
  if (MV.reduceMotion) { st = { v:{ xmin:-6, xmax:6, ymin:-6, ymax:6 }, r0:1e-6, l1:-1e-6, showR:true, showL:true, dot:null, va:1, vaL:1, ha:1, haL:1 }; capT(FINAL); p.render(); return; }
  capT(M("y = 1/x")); p.render();
  var lin = function(t){ return t; };
  function geo(a, b, t){ return (a > 0 && b > 0) || (a < 0 && b < 0) ? a * Math.pow(b / a, t) : a + (b - a) * t; }
  function tw(dur, step, done){ MV.tween({ dur:dur, ease:lin, step:step, done:done }); }
  function vto(v1, dur, cb){ var v0 = Object.assign({}, st.v); MV.tween({ dur:dur, step:function(t){ st.v = { xmin:geo(v0.xmin, v1.xmin, t), xmax:geo(v0.xmax, v1.xmax, t), ymin:geo(v0.ymin, v1.ymin, t), ymax:geo(v0.ymax, v1.ymax, t) }; p.render(); }, done:cb }); }
  // the dot walks along 1/x from x0 to x1 (geometric in x), tracing its branch; the caption changes as it passes each mark
  function walk(x0, x1, dur, side, marks, follow, cb){
    var up = x1 > x0, fired = {};
    tw(dur, function(t){
      var x = x0 * Math.pow(x1 / x0, t), y = 1 / x;
      if (side > 0) st.r0 = Math.min(st.r0, x); else st.l1 = Math.max(st.l1, x);
      st.dot = [x, y];
      if (follow) { if (y > 4.8) st.v.ymax = Math.max(6, y / 0.8); if (y < -4.8) st.v.ymin = Math.min(-6, y / 0.8); }
      marks.forEach(function(m, i){ if (fired[i]) return; var tol = 1e-9 * Math.abs(m[0]); if (t >= 1 || (up ? x >= m[0] - tol : x <= m[0] + tol)) { fired[i] = 1; capT(M(m[1])); } });
      p.render();
    }, cb);
  }
  var seq = [
    function(n){ MV.wait(900, n); },
    function(n){ st.showR = true; walk(6, 0.25, 2600, 1, [[1, "x = 1 → y = 1"], [0.5, "x = 0.5 → y = 2"], [0.25, "x = 0.25 → y = 4"]], false, function(){ MV.wait(400, n); }); },
    function(n){ walk(0.25, 0.01, 1800, 1, [[0.01, "x = 0.01 → y = 100"]], true, n); },
    function(n){ tw(700, function(t){ st.va = t; p.render(); }, function(){ tw(400, function(t){ st.vaL = t; p.render(); }, function(){ MV.wait(900, n); }); }); },
    function(n){ st.showL = true; st.dot = [-6, -1 / 6]; walk(-6, -0.01, 3000, -1, [[-0.01, "x = −0.01 → y = −100"]], true, function(){ MV.wait(900, n); }); },
    function(n){ st.dot = null; vto({ xmin:-6, xmax:6, ymin:-6, ymax:6 }, 700, function(){ st.r0 = 1e-6; st.l1 = -1e-6; p.render(); MV.wait(300, n); }); },
    function(n){ vto({ xmin:-60, xmax:60, ymin:-6, ymax:6 }, 900, function(){ MV.wait(250, function(){ vto({ xmin:-600, xmax:600, ymin:-6, ymax:6 }, 900, function(){ MV.wait(250, n); }); }); }); },
    function(n){ tw(800, function(t){ st.ha = t; p.render(); }, function(){ tw(400, function(t){ st.haL = t; p.render(); }, n); }); },
    function(n){ walk(6, 100, 1600, 1, [[100, "x = 100 → y = 0.01"]], false, function(){ MV.wait(1500, n); }); },
    function(n){ st.dot = null; vto({ xmin:-6, xmax:6, ymin:-6, ymax:6 }, 1000, function(){ capT(FINAL); p.render(); n(); }); }
  ], i = 0;
  (function next(){ if (i < seq.length) seq[i++](next); })();
}

// ---------- Explore: the function library ----------
var U = 10000;   // walker positions are whole multiples of 0.0001 (x = n / U)
var LIB = {
  F1:{ num:[1], den:[0, 1], eq:"{1}/{x}", txt:"1/x", restr:[0], ha:0, view:{ xmin:-6, xmax:6, ymin:-6, ymax:6 }, range:"`{y ∈ ℝ | y ≠ 0}`", x0:1 },
  F2:{ num:[1], den:[0, 0, 1], eq:"{1}/{x^2}", txt:"1/x²", restr:[0], ha:0, view:{ xmin:-6, xmax:6, ymin:-2, ymax:10 }, range:"`(0, ∞)`", x0:1 },
  F3:{ num:[-2, 0, 2], den:[-4, 0, 1], eq:"{2x^2 - 2}/{x^2 - 4}", txt:"(2x² − 2)/(x² − 4)", restr:[-2, 2], ha:2, view:{ xmin:-8, xmax:8, ymin:-8, ymax:10 }, range:"`(-∞, 1/2] ∪ (2, ∞)`", x0:3 },
  F4:{ num:[0, 2, 1], den:[4, 0, 1], eq:"{x^2 + 2x}/{x^2 + 4}", txt:"(x² + 2x)/(x² + 4)", restr:[], ha:1, view:{ xmin:-10, xmax:10, ymin:-2, ymax:3 }, range:"`[(1 - √2)/2, (1 + √2)/2]`, about `[-0.21, 1.21]`", x0:-6 },
  F5:{ num:[0, 0, 1], den:[-1, 1], eq:"{x^2}/{x - 1}", txt:"x²/(x − 1)", restr:[1], ha:null, view:{ xmin:-6, xmax:8, ymin:-12, ymax:16 }, range:"`(-∞, 0] ∪ [4, ∞)`", x0:3 }
};
var FIDS = ["F1", "F2", "F3", "F4", "F5"];
function fOf(F){ return function(x){ var d = pv(F.den, x); return d === 0 ? NaN : pv(F.num, x) / d; }; }
var inv = function(x){ return 1 / x; };
function domainHTML(F){
  if (!F.restr.length) return M("{x ∈ ℝ}") + ", that is, " + M("(-∞, ∞)");
  var set = "{x ∈ ℝ | " + F.restr.map(function(a){ return "x ≠ " + a; }).join(", ") + "}";
  var pcs = [], lo = "-∞"; F.restr.forEach(function(a){ pcs.push("(" + lo + ", " + a + ")"); lo = String(a); }); pcs.push("(" + lo + ", ∞)");
  return M(set) + ", that is, " + M(pcs.join(" ∪ "));
}

// @component approachLadder — Walk / Near / Far explorer: steps a walker toward x = a from a chosen side or out toward ±∞ by
// factors of 10, one N14 table row per rung, with G10 window zooms, size bars, a gap gauge and asymptote discovery.
function explore(host, api){
  var S = api.S, C = api.content;
  if (!LIB[S.f]) S.f = "F1";
  if (["walk", "near", "far"].indexOf(S.mode) < 0) S.mode = "walk";
  if (!S.stepU) S.stepU = 1000;
  if (S.n == null) S.n = U;
  if (S.showFound == null) S.showFound = true;
  S.near = S.near || { ai:0, side:"R" }; S.far = S.far || { dir:1 }; S.found = S.found || {};
  if (S.lad && S.lad.kind !== S.mode) S.lad = null;
  var L = MV.pgLayout(host, { aria:"Graph of the chosen rational function with the walker" });
  var menu = document.createElement("div"); menu.className = "ex-menu"; menu.setAttribute("role", "group"); menu.setAttribute("aria-label", "Function");
  L.graph.insertBefore(menu, L.graph.firstChild);
  L.ctrl.innerHTML = '<div class="ex-modes" id="ex-modes"></div><div class="ex-mctl" id="ex-mctl"></div><div class="ex-tog" id="ex-tog"></div><div id="ex-bars"></div><div id="ex-tbl"></div>';
  var plot = new MV.Plot(L.canvas, LIB[S.f].view);
  var view = Object.assign({}, LIB[S.f].view), disp = S.n / U;
  var anim = { view:null, walk:null }, revealing = false, tempHA = null, tc3 = null, drawProg = {}, epoch = 0;
  function F(){ return LIB[S.f]; }
  function fx(){ return fOf(F()); }
  function found(){ var k = S.f, o = S.found[k] || (S.found[k] = { va:{}, ha:{} }); return o; }
  function vaState(a){ var o = found().va[a] || {}; return o; }
  function vaFound(a){ var o = vaState(a); return !!(o.L && o.R); }
  function haFound(){ var o = found().ha; return !!(o.p && o.n); }
  function onRestr(n){ return F().restr.some(function(a){ return a * U === n; }); }
  function yQ(n){ var F0 = F(); return XQ.div(XQ.at(F0.num, n), XQ.at(F0.den, n)); }
  function stopAnims(){ if (anim.view) anim.view(); if (anim.walk) anim.walk(); anim.view = anim.walk = null; }
  function say(kind, html){ L.banner.className = "banner" + (kind ? " " + kind : ""); L.banner.innerHTML = html || ""; }

  // ----- views -----
  function targetView(){
    var v = Object.assign({}, F().view), lad = S.lad;
    if (lad && lad.rung && S.mode === "near") {
      var y = fx()(S.n / U);
      if (isFinite(y) && y !== 0) { var ext = y > 0 ? v.ymax : -v.ymin, s = Math.max(1, Math.abs(y) / 0.8 / ext); v.ymin *= s; v.ymax *= s; }
    }
    if (lad && lad.rung && S.mode === "far") { var k = Math.pow(10, lad.rung); v.xmin *= k; v.xmax *= k; }
    return v;
  }
  function geo(a, b, t){ return (a > 0 && b > 0) || (a < 0 && b < 0) ? a * Math.pow(b / a, t) : a + (b - a) * t; }
  function viewTo(v1, dur, cb){
    if (anim.view) anim.view();
    var v0 = Object.assign({}, view);
    anim.view = MV.tween({ dur:dur, step:function(t){ view = { xmin:geo(v0.xmin, v1.xmin, t), xmax:geo(v0.xmax, v1.xmax, t), ymin:geo(v0.ymin, v1.ymin, t), ymax:geo(v0.ymax, v1.ymax, t) }; render(); },
      done:function(){ anim.view = null; view = Object.assign({}, v1); render(); if (cb) cb(); } });
  }

  // ----- walker moves -----
  function crosses(x0, x1){ return F().restr.some(function(a){ return (x0 - a) * (x1 - a) <= 0; }); }
  function moveTo(n1, how, cb){
    var x0 = disp, x1 = n1 / U; S.n = n1; api.save();
    if (anim.walk) anim.walk();
    var dur = how === "walk" ? 250 : how === "ladder" ? 600 : 0;
    if (x0 === x1 || crosses(x0, x1) && how !== "ladder") dur = 0;
    var ctr = null;
    if (how === "ladder" && S.lad && S.lad.kind === "near") { ctr = S.lad.a; if ((x0 - ctr) * (x1 - ctr) <= 0) dur = 0; }
    else if (how === "ladder") { ctr = 0; if (x0 * x1 <= 0 || crosses(x0, x1)) dur = 0; }
    anim.walk = MV.tween({ dur:dur, step:function(t){
        disp = ctr != null && dur ? ctr + geo(x0 - ctr, x1 - ctr, t) : x0 + (x1 - x0) * t; render();
      }, done:function(){ anim.walk = null; disp = x1; render(); afterMove(); if (cb) cb(); } });
  }
  function afterMove(){ if (!revealing) discover(); paintRead(); paintBars(); paintSlider(); MV.changed(); }
  function discover(){
    var n = S.n, fo = found(), msgs = [];
    F().restr.forEach(function(a){
      var d = n - a * U; if (!d || Math.abs(d) > 100) return;
      var o = fo.va[a] || (fo.va[a] = {}), was = o.L && o.R;
      if (d < 0) o.L = true; else o.R = true;
      if (!was && o.L && o.R) { msgs.push("Found: vertical asymptote " + M("x = " + a)); drawIn("va" + a); }
    });
    if (Math.abs(n) >= 1000 * U) {
      var h = fo.ha, wasH = h.p && h.n;
      if (n > 0) h.p = true; else h.n = true;
      if (!wasH && h.p && h.n) { msgs.push(F().ha == null ? "Found: no horizontal asymptote. " + M("y") + " keeps growing as " + M("x → ±∞") + "." : "Found: horizontal asymptote " + M("y = " + F().ha)); drawIn("ha"); }
    }
    if (msgs.length) { api.save(); say("", msgs.join(" ")); }
  }
  function drawIn(key){
    var k = S.f + key; drawProg[k] = 0;
    MV.tween({ dur:700, ease:function(t){ return t; }, step:function(t){ drawProg[k] = t; render(); }, done:function(){ drawProg[k] = 1; render(); } });
  }
  function progOf(key){ var k = S.f + key; return drawProg[k] == null ? 1 : drawProg[k]; }

  // ----- ladders -----
  function ladderRows(){
    var lad = S.lad, rows = []; if (!lad) return rows;
    for (var r = 1; r <= lad.rung; r++) rows.push(lad.kind === "near" ? lad.a * U + (lad.side === "L" ? -1 : 1) * Math.pow(10, 5 - r) : lad.dir * Math.pow(10, 4 + r));
    return rows;
  }
  function ladderStep(cb){
    var lad = S.lad; if (!lad) { if (cb) cb(); return; }
    var max = lad.kind === "near" ? 5 : 4; if (lad.rung >= max) { if (cb) cb(); return; }
    lad.rung++; var rows = ladderRows(), n1 = rows[rows.length - 1];
    paintTable(true); paintCtl();
    var done = 0, fin = function(){ if (++done === 2) { paintTable(false); if (cb) cb(); } };
    var tv = function(){ var v = targetView(); viewTo(v, 500, fin); };
    if (lad.kind === "near") { moveTo(n1, "ladder", fin); tv(); }
    else { tv(); moveTo(n1, "ladder", fin); }
  }
  function newLadder(){
    if (S.mode === "near") { var R = F().restr; if (!R.length) { S.lad = null; return; } var ai = Math.min(S.near.ai, R.length - 1); S.lad = { kind:"near", a:R[ai], side:S.near.side, rung:0 }; }
    else if (S.mode === "far") S.lad = { kind:"far", dir:S.far.dir, rung:0 };
    else S.lad = null;
  }

  // ----- user actions -----
  function userAct(){ epoch++; if (tempHA != null) { tempHA = null; } }
  function setF(id){
    stopAnims(); leaveTC3(true); S.f = id; var v = F().view;
    S.n = clamp(S.n, v.xmin * U, v.xmax * U);
    newLadder(); view = Object.assign({}, v); disp = S.n / U; say("", ""); api.save(); paintAll();
  }
  function setMode(m){
    if (tc3 && m !== "walk") return;
    stopAnims(); S.mode = m; var v = F().view;
    S.n = clamp(S.n, v.xmin * U, v.xmax * U);
    disp = S.n / U; newLadder(); view = Object.assign({}, v); api.save(); paintAll();
  }
  function stepWalk(k){
    if (S.mode !== "walk") return; var v = F().view;
    var n1 = clamp(S.n + k * S.stepU, v.xmin * U, v.xmax * U); if (n1 === S.n) return;
    moveTo(n1, "walk");
  }
  function jump(n1){ if (n1 === S.n) return; moveTo(n1, "jump"); }

  // ----- TC3 (curve and y-values hidden) -----
  function leaveTC3(quiet){ if (!tc3) return; tc3 = null; if (!quiet) { say("", ""); paintAll(); } }

  // ----- rendering -----
  function asymList(){
    var out = [], Fc = F(), show = S.showFound && !tc3;
    Fc.restr.forEach(function(a){ if (show && vaFound(a)) out.push({ x:a, prog:progOf("va" + a), onAxis:a === 0 }); });
    var haShow = (show && haFound() && Fc.ha != null) || (tempHA != null && !tc3);
    if (haShow) out.push({ y:tempHA != null ? tempHA : Fc.ha, prog:tempHA != null ? 1 : progOf("ha"), onAxis:(tempHA != null ? tempHA : Fc.ha) === 0 });
    if (tc3 === "solved") out.push({ y:1, prog:1 });
    return out;
  }
  function render(){
    var Fc = F(), f = fx(), as = asymList(), curves = [], pts = [], hidden = tc3 === "open";
    if (S.compare && S.f !== "F1" && !tc3) curves = curves.concat(curvePieces(inv, [0], css("--ink-2"), { width:2, dash:[6, 6], alpha:0.6 }));
    if (!hidden) curves = curves.concat(curvePieces(f, Fc.restr, css("--pen")));
    var x = disp, y = f(x), atR = Fc.restr.some(function(a){ return Math.abs(a - x) < 1e-12; });
    var walkerVis = true;
    if (hidden) pts.push({ x:x, y:0, r:7, color:css("--ink"), ring:true, label:"x = " + num(x, 4) });
    else if (atR) pts.push({ x:x, y:0, open:true, r:6, color:css("--pen") });
    else if (isFinite(y)) pts.push({ x:x, y:y, r:7, color:css("--ink"), ring:S.mode === "walk" });
    if (tc3 === "solved") pts.push({ x:2, y:1, r:5.5, color:css("--pen"), label:"(2, 1)" });
    plot.draw({ view:view, yTicks:{ fmt:NOFMT }, xTicks:{ fmt:tickFmt }, regions:axisUnderlays(plot, as), curves:curves, points:pts,
      after:function(ctx, p){
        yLabels(ctx, p);
        as.forEach(function(a){ var pr = a.prog, lab = asymLabel(a); asymDraw(ctx, p, a, Math.min(1, pr / 0.6), Math.max(0, (pr - 0.6) / 0.4), lab); });
        // walker off the top or bottom: edge marker with its height
        if (!hidden && !atR && isFinite(y) && walkerVis && (y > view.ymax || y < view.ymin)) {
          var X = p.X(x), up = y > view.ymax, Y = up ? 4 : p.H - 4;
          ctx.save(); ctx.fillStyle = css("--ink"); ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X - 7, Y + (up ? 12 : -12)); ctx.lineTo(X + 7, Y + (up ? 12 : -12)); ctx.closePath(); ctx.fill();
          ctx.font = "600 13px " + (p.fontUI || "sans-serif"); ctx.textAlign = X > p.W - 120 ? "right" : "left"; ctx.textBaseline = "middle";
          ctx.fillText("y " + (XQ.fmt(yQ(S.n)).charAt(0) === "≈" ? "" : "= ") + XQ.fmt(yQ(S.n)), X + (X > p.W - 120 ? -12 : 12), up ? 14 : p.H - 14); ctx.restore();
        }
      },
      describe:describe() });
  }
  plot.render = render;
  function describe(){
    var Fc = F(), s = "Graph of y = " + Fc.txt + ". ";
    if (tc3 === "open") return "Axes only: the curve and the y-values are hidden for this challenge. Walker marker on the x-axis at x = " + num(disp, 4) + ".";
    var as = asymList(); if (as.length) s += "Shown asymptotes: " + as.map(asymLabel).join(", ") + ". ";
    var n = S.n, yq = onRestr(n) ? null : yQ(n);
    s += yq ? "Walker at (" + MV.plain(XQ.fmt(XQ.div(XQ.int(n), XQ.int(U)))) + ", " + XQ.fmt(yq).replace("≈ ", "about ") + ")" : "No point at x = " + num(n / U, 4) + ": it is a restriction";
    var near = Fc.restr.filter(function(a){ return Math.abs(n - a * U) <= 1000 && n !== a * U; })[0];
    if (near != null) s += ", just " + (n > near * U ? "right" : "left") + " of x = " + near;
    return s + ".";
  }

  // ----- controls -----
  function paintMenu(){
    MV.keepFocus(menu, function(){
      menu.innerHTML = FIDS.map(function(id){ return '<button type="button" class="fchip ex-fchip" data-fn="' + id + '" data-k="exf' + id + '" aria-pressed="' + (S.f === id) + '" aria-label="' + MV.esc("y = " + MV.plain(M(LIB[id].eq))) + '">' + M(LIB[id].eq) + "</button>"; }).join("");
    });
  }
  function seg(label, name, opts, val, dis){
    return '<div class="seg-wrap"><span class="tiny" style="font-weight:700">' + label + '</span><span class="seg" role="group" aria-label="' + MV.esc(label) + '">' +
      opts.map(function(o){ return '<button type="button" data-' + name + '="' + o[0] + '" data-k="ex' + name + o[0] + '" aria-pressed="' + (String(val) === String(o[0])) + '"' + (dis && dis(o[0]) ? " disabled" : "") + ">" + o[1] + "</button>"; }).join("") + "</span></div>";
  }
  function paintCtl(){
    var Fc = F(), m = S.mode, h = "";
    MV.keepFocus($("#ex-modes", host), function(){
      $("#ex-modes", host).innerHTML = seg("Mode", "mode", [["walk", "Walk"], ["near", "Near"], ["far", "Far"]], m, function(id){ return tc3 && id !== "walk"; }) +
        (tc3 ? '<button type="button" class="btn ghost sm ex-leave" data-act="leave" data-k="exleave">Leave challenge</button>' : "");
    });
    if (m === "walk") {
      var v = Fc.view, st = S.stepU / U;
      h += '<div class="ex-walk"><button type="button" class="btn sm ex-arrow" data-walk="-1" data-k="exwl" aria-label="Move the walker one step left">◀</button>' +
        '<label class="ex-xs"><span class="vh">Walker x</span><input type="range" id="ex-xs" min="' + v.xmin + '" max="' + v.xmax + '" step="' + st + '" value="' + (S.n / U) + '"></label>' +
        '<button type="button" class="btn sm ex-arrow" data-walk="1" data-k="exwr" aria-label="Move the walker one step right">▶</button></div>' +
        seg("Step size", "step", [[10000, "1"], [1000, "0.1"], [100, "0.01"], [10, "0.001"]], S.stepU);
    } else if (m === "near") {
      if (!Fc.restr.length) h += '<p class="ex-note">No restrictions: ' + M("x^2 + 4") + " is at least 4, so it’s never 0. There’s nowhere to walk “near”.</p>";
      else {
        h += seg("Restriction", "ra", Fc.restr.map(function(a, i){ return [i, M("x = " + a)]; }), Math.min(S.near.ai, Fc.restr.length - 1));
        var a0 = Fc.restr[Math.min(S.near.ai, Fc.restr.length - 1)];
        h += seg("Side", "side", [["L", "From the left (" + M("x → " + a0 + "^{-}") + ")"], ["R", "From the right (" + M("x → " + a0 + "^{+}") + ")"]], S.near.side);
      }
      var full = S.lad && S.lad.rung >= 5;
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="closer" data-k="excl"' + (!Fc.restr.length || full ? " disabled" : "") + ">Closer ×10</button>" +
        '<button type="button" class="btn ghost sm" data-act="reset" data-k="exrs"' + (!Fc.restr.length ? " disabled" : "") + ">Reset ladder</button>" + (full ? '<span class="tiny muted">Closest rung reached.</span>' : "") + "</div>";
    } else {
      h += seg("Direction", "dir", [[1, M("x → ∞")], [-1, M("x → -∞")]], S.far.dir);
      var fullF = S.lad && S.lad.rung >= 4;
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="farther" data-k="exfa"' + (fullF ? " disabled" : "") + ">Farther ×10</button>" +
        '<button type="button" class="btn ghost sm" data-act="reset" data-k="exrs">Reset ladder</button>' + (fullF ? '<span class="tiny muted">Farthest rung reached.</span>' : "") + "</div>";
    }
    MV.keepFocus($("#ex-mctl", host), function(){ $("#ex-mctl", host).innerHTML = h; });
    MV.keepFocus($("#ex-tog", host), function(){
      $("#ex-tog", host).innerHTML = '<button type="button" class="chip" data-act="cmp" data-k="excmp" aria-pressed="' + !!(S.compare && S.f !== "F1") + '"' + (S.f === "F1" || tc3 ? " disabled" : "") + ">" + (S.compare && S.f !== "F1" ? "✓ " : "") + "Show " + M("y = 1/x") + " for comparison</button>" +
        '<button type="button" class="chip" data-act="fnd" data-k="exfnd" aria-pressed="' + !!S.showFound + '"' + (tc3 ? " disabled" : "") + ">" + (S.showFound ? "✓ " : "") + "Show found asymptotes</button>";
    });
  }
  function paintSlider(){ var el = $("#ex-xs", host); if (el && document.activeElement !== el) el.value = S.n / U; }

  // ----- size bars (Walk, Near) and gap gauge (Far) -----
  function barRow(lab, v, txt, lo, hi){
    var w = 0;
    if (v != null && v > 0) w = clamp((Math.log10(v) - lo) / (hi - lo), 0, 1) * 100;
    return '<div class="sb-row"><span class="sb-lab">' + lab + '</span><span class="sb-track' + (hi - lo === 8 ? " g8" : "") + '"><i style="width:' + w.toFixed(2) + '%"></i></span><span class="sb-val">' + txt + "</span></div>";
  }
  function paintBars(){
    var host2 = $("#ex-bars", host), Fc = F(), n = S.n, h = "";
    if (tc3) { host2.innerHTML = ""; return; }
    if (S.mode !== "far") {
      var nq = XQ.at(Fc.num, n), dq = XQ.at(Fc.den, n), yq = XQ.div(nq, dq);
      h = '<div class="sb" role="group" aria-label="Size bars"><p class="sb-h">Sizes here <span class="tiny muted">(log scale from 10⁻⁸ to 10⁸)</span></p>' +
        barRow("|numerator|", XQ.num(XQ.abs(nq)), XQ.zero(nq) ? "0" : XQ.fmt(XQ.abs(nq)), -8, 8) +
        barRow("|denominator|", XQ.num(XQ.abs(dq)), XQ.zero(dq) ? "0" : XQ.fmt(XQ.abs(dq)), -8, 8) +
        barRow("|" + mi("y") + "|", yq ? XQ.num(XQ.abs(yq)) : null, yq ? (XQ.zero(yq) ? "0" : XQ.fmt(XQ.abs(yq))) : "undefined", -8, 8) + "</div>";
    } else {
      var b = tempHA != null ? tempHA : (haFound() ? Fc.ha : undefined);
      if (b === null && haFound()) h = '<p class="ex-note">No horizontal asymptote, so no gap to measure.</p>';
      else if (b != null) {
        var gq = XQ.sub(yQ(n), XQ.int(b)), sg = XQ.sign(gq);
        h = '<div class="sb" role="group" aria-label="Gap gauge"><p class="sb-h">Gap gauge: distance from ' + M("y = " + b) + ' <span class="tiny muted">(log scale from 1 down to 0.00000001)</span></p>' +
          barRow(sg > 0 ? "above" : sg < 0 ? "below" : "on the line", XQ.num(XQ.abs(gq)), sg ? XQ.fmt(XQ.abs(gq)) : "0", -8, 0) + "</div>";
      } else h = '<p class="ex-note tiny muted">The gap gauge appears once the horizontal asymptote is found: reach ' + M("|x| ≥ 1000") + " in both directions.</p>";
    }
    host2.innerHTML = h;
  }
  function paintTable(adding){
    var host2 = $("#ex-tbl", host), lad = S.lad, Fc = F();
    if (!lad || S.mode === "walk" || tc3) { host2.innerHTML = ""; return; }
    var rows = ladderRows(), b = tempHA != null ? tempHA : (haFound() ? Fc.ha : undefined), hdr, body;
    if (lad.kind === "near") {
      hdr = ["rung", mi("x"), "distance from " + mi(String(lad.a)), "numerator", "denominator", mi("y")];
      body = rows.map(function(n, i){ var nq = XQ.at(Fc.num, n), dq = XQ.at(Fc.den, n); return [i + 1, XQ.fmt(XQ.div(XQ.int(n), XQ.int(U))), XQ.fmt(XQ.div(XQ.int(Math.abs(n - lad.a * U)), XQ.int(U))), XQ.fmt(nq), XQ.fmt(dq), XQ.fmt(XQ.div(nq, dq))]; });
    } else {
      hdr = ["rung", mi("x"), mi("y"), "gap to the horizontal asymptote"];
      body = rows.map(function(n, i){ var yq = yQ(n), g = ""; if (b != null) { var gq = XQ.sub(yq, XQ.int(b)), sg = XQ.sign(gq); g = sg ? XQ.fmt(XQ.abs(gq)) + (sg > 0 ? " above" : " below") : "on the line"; } else if (b === null) g = "none"; return [i + 1, XQ.fmt(XQ.div(XQ.int(n), XQ.int(U))), XQ.fmt(yq), g]; });
    }
    var cap = lad.kind === "near" ? "Near ladder toward " + M("x = " + lad.a) + (lad.side === "L" ? " from the left" : " from the right") : "Far ladder, " + M(lad.dir > 0 ? "x → ∞" : "x → -∞");
    host2.innerHTML = '<p class="sb-h">' + cap + "</p>" + (rows.length ? '<div class="tbl-wrap"><table class="vt ex-lt"><thead><tr>' + hdr.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      body.map(function(r, i){ return "<tr" + (adding && i === body.length - 1 ? ' class="new"' : "") + ">" + r.map(function(c){ return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>" :
      '<p class="tiny muted">Press <strong>' + (lad.kind === "near" ? "Closer ×10" : "Farther ×10") + "</strong> to add the first rung.</p>");
  }

  // ----- readout -----
  function paintRead(){
    var Fc = F(), n = S.n, x = n / U, rows = [], xs = XQ.fmt(XQ.div(XQ.int(n), XQ.int(U))), atR = onRestr(n);
    var nq = XQ.at(Fc.num, n), dq = XQ.at(Fc.den, n), yq = atR ? null : XQ.div(nq, dq);
    rows.push(["Function", M("y = " + Fc.eq)]);
    if (tc3) rows.push(["Walker", M("x") + " = " + xs + " (" + M("y") + " hidden for this challenge)"]);
    else if (atR) rows.push(["Walker", "No point: " + M("x = " + Math.round(x)) + " is a restriction (the denominator is 0 there)"]);
    else rows.push(["Walker", M("P") + " = (" + xs + ", " + XQ.fmt(yq) + ")"]);
    if (!tc3) rows.push(["Top and bottom here", "numerator = " + XQ.fmt(nq) + ", denominator = " + (atR ? "0" : XQ.fmt(dq) + (Math.abs(XQ.num(dq)) < 0.1 ? " (tiny)" : ""))]);
    rows.push(["Domain", domainHTML(Fc)]);
    rows.push(["Range (read from the graph)", MV.md(Fc.range)]);
    if (!Fc.restr.length) rows.push(["Nearest restriction", "None: " + M("x^2 + 4") + " is never 0"]);
    else {
      var best = null; Fc.restr.forEach(function(a){ if (best === null || Math.abs(n - a * U) < Math.abs(n - best * U)) best = a; });
      var dd = Math.abs(n - best * U);
      rows.push(["Nearest restriction", dd === 0 ? M("x = " + best) + ": the walker is on it" : M("x = " + best) + ", distance " + XQ.fmt(XQ.div(XQ.int(dd), XQ.int(U))) + ", on its " + (n > best * U ? "right" : "left")]);
    }
    if (!Fc.restr.length) rows.push(["Vertical asymptotes", "None: the denominator is never 0, so nothing is excluded"]);
    else rows.push(["Vertical asymptotes", Fc.restr.slice().sort(function(a, b){ var sa = vaState(a), sb = vaState(b); return ((sb.L || sb.R) ? 1 : 0) - ((sa.L || sa.R) ? 1 : 0) || a - b; }).map(function(a){
      var o = vaState(a), t = o.L && o.R ? "found" : o.L ? "approached from the left; try the right too" : o.R ? "approached from the right; try the left too" : "not found yet";
      return M("x = " + a) + ": " + t;
    }).join(". ")]);
    rows.push(["Horizontal asymptote", haFound() ? (Fc.ha == null ? "None: " + M("y") + " keeps growing as " + M("x → ±∞") : M("y = " + Fc.ha)) : "Not found yet: use the Far ladder in both directions"]);
    var b = tempHA != null ? tempHA : (haFound() ? Fc.ha : undefined);
    if (tc3 === "solved") rows.push(["Gap to the horizontal asymptote", "on the line"]);
    else if (!tc3) {
      var gap = "";
      if (b === null) gap = "No horizontal asymptote, so no gap to measure";
      else if (b != null && yq) { var gq = XQ.sub(yq, XQ.int(b)), sg = XQ.sign(gq); gap = sg ? XQ.fmt(XQ.abs(gq)) + (sg > 0 ? " above " : " below ") + M("y = " + b) : "on the line"; }
      rows.push(["Gap to the horizontal asymptote", gap]);
    }
    if (!tc3) {
      var beh = "Walk close to a restriction, or far out, to see a trend.";
      var nr = Fc.restr.filter(function(a){ var d = Math.abs(n - a * U); return d > 0 && d <= 1000; })[0];
      if (nr != null && yq) beh = "As " + M("x → " + nr + (n > nr * U ? "^{+}" : "^{-}")) + ", " + M("y → " + (XQ.sign(yq) > 0 ? "∞" : "-∞"));
      else if (Math.abs(n) >= 10 * U && yq) {
        if (haFound()) {
          if (Fc.ha == null) beh = "As " + M(n > 0 ? "x → ∞" : "x → -∞") + ", " + M("y → " + (XQ.sign(yq) > 0 ? "∞" : "-∞"));
          else { var g2 = XQ.sign(XQ.sub(yq, XQ.int(Fc.ha))); beh = "As " + M(n > 0 ? "x → ∞" : "x → -∞") + ", " + M("y → " + Fc.ha) + (g2 ? ", from " + (g2 > 0 ? "above" : "below") : ""); }
        } else beh = "Far out: " + M("y") + " is about " + XQ.fmt(yq).replace("≈ ", "") + ". Keep going.";
      }
      rows.push(["Behaviour here", beh]);
    }
    L.read.innerHTML = MV.readoutHTML(rows);
  }
  function paintAll(){ L.cap.innerHTML = M("y = " + F().eq); paintMenu(); paintCtl(); paintRead(); paintBars(); paintTable(false); render(); MV.changed(); }

  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || revealing) return;
    var d = b.dataset;
    if (d.fn) { userAct(); if (d.fn !== S.f) setF(d.fn); return; }
    if (d.mode) { userAct(); if (d.mode !== S.mode) setMode(d.mode); return; }
    if (d.step) { userAct(); S.stepU = +d.step; api.save(); paintCtl(); return; }
    if (d.walk) { userAct(); stepWalk(+d.walk); return; }
    if (d.ra != null) { userAct(); S.near.ai = +d.ra; stopAnims(); newLadder(); view = Object.assign({}, F().view); api.save(); paintAll(); return; }
    if (d.side) { userAct(); S.near.side = d.side; stopAnims(); newLadder(); view = Object.assign({}, F().view); api.save(); paintAll(); return; }
    if (d.dir) { userAct(); S.far.dir = +d.dir; stopAnims(); newLadder(); view = Object.assign({}, F().view); api.save(); paintAll(); return; }
    var act = d.act;
    if (act === "closer" || act === "farther") { userAct(); if (!S.lad) newLadder(); stopAnims(); ladderStep(); return; }
    if (act === "reset") { userAct(); stopAnims(); newLadder(); viewTo(F().view, 400); api.save(); paintCtl(); paintTable(false); return; }
    if (act === "cmp") { S.compare = !S.compare; api.save(); paintCtl(); render(); return; }
    if (act === "fnd") { S.showFound = !S.showFound; api.save(); paintCtl(); render(); return; }
    if (act === "leave") { leaveTC3(); return; }
  });
  host.addEventListener("input", function(e){
    if (e.target.id !== "ex-xs" || revealing) return;
    userAct(); var n1 = Math.round(+e.target.value * U / S.stepU) * S.stepU, v = F().view;
    jump(clamp(n1, v.xmin * U, v.xmax * U));
  });
  MV.drag(plot, {
    axis:"x",
    handles:function(){
      if (S.mode !== "walk" || revealing) return [];
      var y = fx()(disp); if (!isFinite(y) || tc3) y = 0;
      return [{ id:"w", x:disp, y:clamp(y, view.ymin, view.ymax), label:"Walker at x = " + num(disp, 4) + ". Arrow keys move one step, Shift + arrow ten steps, Home and End jump to the edges." }];
    },
    move:function(id, x){ if (S.mode !== "walk" || revealing) return; userAct(); var v = F().view, n1 = clamp(Math.round(x * U / S.stepU) * S.stepU, v.xmin * U, v.xmax * U); jump(n1); },
    key:function(id, e){
      if (S.mode !== "walk" || revealing) return false;
      var k = e.key, m = e.shiftKey ? 10 : 1, v = F().view;
      if (k === "ArrowLeft" || k === "ArrowDown") { userAct(); stepWalk(-m); return true; }
      if (k === "ArrowRight" || k === "ArrowUp") { userAct(); stepWalk(m); return true; }
      if (k === "Home") { userAct(); jump(v.xmin * U); return true; }
      if (k === "End") { userAct(); jump(v.xmax * U); return true; }
      return false;
    }
  });

  // ----- challenge set-up buttons (injected into the toolkit's challenge cards) -----
  function setup(id){
    var c = (C.challenges || []).filter(function(x){ return x.id === id; })[0]; if (!c) return;
    userAct(); stopAnims(); tc3 = null;
    S.f = c.start.f; S.mode = "walk"; S.stepU = Math.round(c.start.step * U); S.n = Math.round(c.start.x * U); S.lad = null;
    view = Object.assign({}, F().view); disp = S.n / U;
    if (id === "tc3") { tc3 = "open"; say("", "Challenge 3: the curve and every " + M("y") + "-value are hidden. Work from the equation."); }
    else say("", "Challenge " + id.slice(2) + " is set up.");
    api.save(); paintAll();
    var g = L.graph, r = g.getBoundingClientRect();
    if (r.top < 60 || r.top > window.innerHeight * 0.5) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  }
  var chalHost = $("#chal");
  function inject(){
    if (!chalHost) return;
    $$(".chal[data-c]", chalHost).forEach(function(box){
      var qa = box.querySelector(".q-actions"); if (!qa || qa.querySelector("[data-setup]")) return;
      var b = document.createElement("button"); b.type = "button"; b.className = "btn ghost sm"; b.dataset.setup = box.dataset.c; b.dataset.k = box.dataset.c + "setup"; b.textContent = "Set up this challenge";
      qa.insertBefore(b, qa.firstChild);
    });
  }
  if (chalHost) {
    new MutationObserver(inject).observe(chalHost, { childList:true, subtree:true });
    chalHost.addEventListener("click", function(e){ var b = e.target.closest("[data-setup]"); if (b && !revealing) setup(b.dataset.setup); });
    setTimeout(inject, 0);
  }

  // ----- challenge tests -----
  function fbOf(id){ return ((C.challenges || []).filter(function(x){ return x.id === id; })[0] || {}).fb || {}; }
  function yNow(){ return onRestr(S.n) ? "undefined" : XQ.fmt(yQ(S.n)); }
  function challenge(id, opt){
    var n = S.n, fb = fbOf(id);
    if (id === "tc1") {
      if (S.f !== "F1") return { ok:false, msg:fb.fn };
      if (n === -10) return { ok:true };
      if (n === 10) return { ok:false, msg:fb.pos };
      if (n === -100) return { ok:false, msg:fb.ten };
      if (n === -1000 * U) return { ok:false, msg:fb.far };
      return { ok:false, msg:fb.other.replace("{y}", yNow()) };
    }
    if (id === "tc2") {
      if (S.f !== "F3") return { ok:false, msg:fb.fn };
      var a = Math.abs(n);
      if (a === 2 * U) return { ok:false, msg:fb.restr };
      if (XQ.num(yQ(n)) > 1000) return { ok:true };
      if (a === 19990) return { ok:false, msg:fb.wrongSide };
      if (a === 20100) return { ok:false, msg:fb.close };
      if (a >= 10 * U) return { ok:false, msg:fb.far };
      return { ok:false, msg:fb.other.replace("{y}", yNow()) };
    }
    if (id === "tc3") {
      if (opt && opt.live) return { ok:false };
      if (S.f !== "F4" || !tc3) return { ok:false, msg:fb.setup };
      if (n === 2 * U) { tc3 = "solved"; say("good", "✓ The graph crosses " + M("y = 1") + " at (2, 1)."); paintAll(); return { ok:true }; }
      if (n === 0 || n === -2 * U) return { ok:false, msg:fb.zero };
      if (Math.abs(n) === 10 * U) return { ok:false, msg:fb.edge };
      if (n >= 47000 && n <= 49000) return { ok:false, msg:fb.hump };
      return { ok:false, msg:fb.other };
    }
    return { ok:false };
  }

  // ----- predictions -----
  function predStart(p){
    stopAnims(); epoch++; tc3 = null; tempHA = null; revealing = false;
    S.f = p.start.f; S.mode = "walk"; S.stepU = 1000; S.n = Math.round(p.start.x * U); S.compare = !!p.start.compare; S.lad = null;
    view = Object.assign({}, F().view); disp = S.n / U; say("", ""); api.save(); paintAll();
  }
  function predRun(p, done){
    var my = ++epoch; revealing = true;
    var rungs = 3;
    if (p.id === "p1") { S.mode = "near"; S.near = { ai:0, side:"R" }; S.lad = { kind:"near", a:0, side:"R", rung:1 }; }
    else if (p.id === "p3") { S.mode = "near"; S.near = { ai:0, side:"L" }; S.lad = { kind:"near", a:0, side:"L", rung:1 }; }
    else if (p.id === "p2") { S.mode = "far"; S.far = { dir:1 }; S.lad = { kind:"far", dir:1, rung:0 }; rungs = 4; }
    else if (p.id === "p4") { S.mode = "far"; S.far = { dir:1 }; S.lad = { kind:"far", dir:1, rung:0 }; tempHA = 2; }
    paintAll();
    var k = 0;
    function step(){
      if (my !== epoch) { revealing = false; done(); return; }
      if (k++ >= rungs) { revealing = false; api.save(); paintAll(); done(); return; }
      ladderStep(function(){ MV.wait(200, step); });
    }
    MV.wait(300, step);
  }

  paintAll();
  return { predict:{ start:predStart, run:predRun }, challenge:challenge };
}

// ---------- Part 3: Read the equation ----------
function termsHTML(c){
  var out = "", lead = degOf(c);
  for (var k = c.length - 1; k >= 0; k--) {
    var v = c[k]; if (!v) continue;
    var a = Math.abs(v), t = ((a === 1 && k > 0) ? "" : String(a)) + (k === 0 ? "" : k === 1 ? "x" : "x^" + k);
    var sg = out ? (v < 0 ? " − " : " + ") : (v < 0 ? MINUS : "");
    out += sg + (k === lead ? '<span class="p3-lt">' + mi(t) + "</span>" : mi(t));
  }
  return out;
}
// @component leadRace — "leading-term race": stacked share bars for the numerator and denominator at x = 10 … 10 000,
// beside y and the leading terms' quotient (exact integers, shares to one decimal, ≈ 100% from 99.95%)
function raceRows(cs){
  var xs = [10, 100, 1000, 10000], dn = degOf(cs.num), dd = degOf(cs.den), ln = cs.num[dn], ld = cs.den[dd];
  return xs.map(function(x){
    function share(c){ var tot = 0, lead = 0; c.forEach(function(v, k){ var t = Math.abs(v * Math.pow(x, k)); tot += t; if (k === degOf(c)) lead = t; }); return lead / tot * 100; }
    var N = pv(cs.num, x), D = pv(cs.den, x), y = XQ.div(XQ.int(N), XQ.int(D));
    var qn = dn >= dd ? ln * Math.pow(x, dn - dd) : ln, qd = dn >= dd ? ld : ld * Math.pow(x, dd - dn);
    return { x:x, N:N, D:D, sN:share(cs.num), sD:share(cs.den), y:XQ.fmt(y), q:XQ.fmt(XQ.div(XQ.int(qn), XQ.int(qd))) };
  });
}
function shareT(s){ return s >= 99.95 ? "≈ 100%" : (Math.round(s * 10) / 10).toFixed(1) + "%"; }
function unM(h){ return String(h).replace(/^<span class="m">/, "").replace(/<\/span>$/, ""); }

function part3(host, api){
  var S = api.S, P = api.content, CS = P.cases;
  S.ci = S.ci || 0; S.cs = S.cs || {};
  host.innerHTML = '<div class="chips p3-cases" id="p3-cases" role="group" aria-label="Case cards"></div>' +
    '<div class="sym p3-top"><div class="p3-card"><p class="tiny muted" id="p3-n"></p><p class="p3-eq" id="p3-eq"></p>' +
    '<div class="q-actions"><button type="button" class="chip" data-hl="den" data-k="p3hld">Highlight the denominator</button><button type="button" class="chip" data-hl="lead" data-k="p3hll">Highlight the leading terms</button></div>' +
    '<details class="alg" id="p3-alg"></details></div>' +
    '<div class="p3-g"><canvas class="plot" id="p3-plot" role="img" aria-label="Graph of the case function"></canvas><p class="p3-gcap" id="p3-gcap" aria-live="polite"></p></div></div>' +
    '<div class="p3-st" id="p3-A"><h3>Station A: “Where is the denominator 0?”</h3><p class="tiny muted">Tap each restriction on the number line (tap again to remove it), or press <strong>No restrictions</strong>. Then press <strong>Check restrictions</strong>.</p>' +
    '<div class="plot-wrap p3-nl"><canvas class="plot nl" id="p3-nlc" role="img" aria-label="Number line"></canvas><div class="p3-ticks" id="p3-ticks" role="group" aria-label="Number-line ticks from −6 to 6"></div></div><div id="p3-Ab"></div></div>' +
    '<div class="p3-st" id="p3-B"></div><div id="p3-next"></div>';
  var plot = new MV.Plot($("#p3-plot", host), CS[0].view), gv = null, gs = { ha:0, cross:false, arrows:false, vaOn:false }, race = { tok:0 }, gtok = { tok:0 }, msgA = null, msgB = null;
  function cs(){ return CS[S.ci]; }
  function st(c){ c = c || cs(); var o = S.cs[c.id] || (S.cs[c.id] = { taps:[], none:false, factor:false, hl:{}, A:{ tries:0, solved:false, first:null }, chip:null, B:{ tries:0, solved:false, first:null } }); return o; }
  function doneCase(c){ var o = S.cs[c.id]; return !!(o && o.A.solved && o.B.solved); }
  function unlocked(i){ return i === 0 || doneCase(CS[i - 1]); }
  function f(c){ return fOf({ num:c.num, den:c.den }); }
  function ans(c){ return (MV.ans(c) || []).slice().sort(function(a, b){ return a - b; }); }
  function sideSigns(c, a){ var g = f(c); return [g(a - 1e-6) > 0 ? 1 : -1, g(a + 1e-6) > 0 ? 1 : -1]; }

  plot.render = function(){
    var c = cs(), o = st(c), v = gv || c.view, as = [], curves = [], pts = [], labels = [];
    var R = ans(c);
    if (o.A.solved) {
      curves = curvePieces(f(c), R, css("--pen"));
      R.forEach(function(a){ as.push({ x:a, prog:1, onAxis:a === 0 }); });
      if (gs.arrows) R.forEach(function(a){
        var sg = sideSigns(c, a), dx = (v.xmax - v.xmin) * 0.03, yT = v.ymax - (v.ymax - v.ymin) * 0.2, yB = v.ymin + (v.ymax - v.ymin) * 0.2;
        labels.push({ x:a - dx, y:sg[0] > 0 ? yT : yB, text:sg[0] > 0 ? "→ ∞" : "→ −∞", align:"right", bg:true, color:css("--ink") });
        labels.push({ x:a + dx, y:sg[1] > 0 ? yT : yB, text:sg[1] > 0 ? "→ ∞" : "→ −∞", align:"left", bg:true, color:css("--ink") });
      });
    }
    if (o.B.solved && c.hz != null && gs.ha > 0) as.push({ y:c.hz, prog:gs.ha, onAxis:c.hz === 0 });
    if (gs.cross && c.cross != null) pts.push({ x:c.cross, y:c.hz, r:5.5, color:css("--ink"), label:"(" + c.crossText + ", " + c.hz + ")" });
    plot.draw({ view:v, yTicks:{ fmt:NOFMT }, xTicks:{ fmt:tickFmt }, regions:axisUnderlays(plot, as), curves:curves, points:pts, labels:labels,
      after:function(ctx, p){ yLabels(ctx, p); as.forEach(function(a){ asymDraw(ctx, p, a, Math.min(1, a.prog / 0.6), Math.max(0, (a.prog - 0.6) / 0.4), asymLabel(a)); }); },
      describe:o.A.solved ? "Graph of y = " + MV.plain(c.eq) + ", with vertical asymptotes " + (R.length ? R.map(function(a){ return "x = " + num(a); }).join(" and ") : "none") + (o.B.solved && c.hz != null ? " and horizontal asymptote y = " + c.hz : "") + "." : "Empty axes. The graph appears when your restrictions are right." });
  };
  function geo(a, b, t){ return (a > 0 && b > 0) || (a < 0 && b < 0) ? a * Math.pow(b / a, t) : a + (b - a) * t; }
  function vTo(v1, dur, cb){ var v0 = Object.assign({}, gv || cs().view); MV.tween({ dur:dur, step:function(t){ gv = { xmin:geo(v0.xmin, v1.xmin, t), xmax:geo(v0.xmax, v1.xmax, t), ymin:geo(v0.ymin, v1.ymin, t), ymax:geo(v0.ymax, v1.ymax, t) }; plot.render(); }, done:function(){ gv = Object.assign({}, v1); plot.render(); if (cb) cb(); } }); }
  function scaled(v, k){ return { xmin:v.xmin * k, xmax:v.xmax * k, ymin:v.ymin * k, ymax:v.ymax * k }; }
  function gcap(h){ $("#p3-gcap", host).innerHTML = h || ""; }

  // the graph after correct restrictions: short zoom toward each vertical asymptote, then "→ ∞" labels
  function showVAs(){
    var c = cs(), R = ans(c), base = c.view, my = ++gtok.tok; gs.arrows = false; gv = null; plot.render();
    if (MV.reduceMotion || !R.length) { gs.arrows = true; plot.render(); return; }
    var i = 0;
    (function nextVA(){
      if (my !== gtok.tok) return;
      if (i >= R.length) { gs.arrows = true; vTo(base, 400); return; }
      var a = R[i++], w = (base.xmax - base.xmin) / 8;
      vTo({ xmin:a - w, xmax:a + w, ymin:base.ymin * 6, ymax:base.ymax * 6 }, 550, function(){ MV.wait(450, function(){ vTo(base, 450, nextVA); }); });
    })();
  }
  // graph confirms: zoom out ×10 twice, the horizontal asymptote draws in, back to the case window, crossing marked
  function confirmHA(){
    var c = cs(), base = c.view, my = ++gtok.tok;
    function fin(){ gs.ha = 1; gv = null; gs.cross = c.cross != null; plot.render(); if (c.cross != null) gcap(MV.md(P.crossNote.replace("{x}", c.crossText))); }
    if (MV.reduceMotion) { fin(); return; }
    gs.ha = 0; gs.cross = false;
    vTo(scaled(base, 10), 600, function(){ MV.wait(250, function(){ vTo(scaled(base, 100), 600, function(){
      if (my !== gtok.tok) return;
      MV.tween({ dur:600, ease:function(t){ return t; }, step:function(t){ gs.ha = t; plot.render(); }, done:function(){ MV.wait(700, function(){ if (my !== gtok.tok) return; vTo(base, 700, fin); }); } });
    }); }); });
  }

  function paintCases(){
    MV.keepFocus($("#p3-cases", host), function(){
      $("#p3-cases", host).innerHTML = CS.map(function(c, i){ var ok = unlocked(i), d = doneCase(c); return '<button type="button" class="fchip" data-case="' + i + '" data-k="p3c' + i + '" aria-pressed="' + (i === S.ci) + '"' + (ok ? "" : " disabled") + ">" + (d ? "✓ " : "") + "Case " + (i + 1) + (ok ? "" : '<span class="vh"> (locked: finish the case before it)</span>') + "</button>"; }).join("");
    });
  }
  function paintCard(){
    var c = cs(), o = st(c);
    $("#p3-n", host).textContent = "Case " + (S.ci + 1) + " of " + CS.length;
    var eq = $("#p3-eq", host);
    eq.innerHTML = '<span class="m"><i>y</i> = <span class="frac"><span class="fn">' + termsHTML(c.num) + '</span><span class="fd"><span class="p3-dn">' + termsHTML(c.den) + "</span></span></span></span>";
    eq.classList.toggle("hl-den", !!o.hl.den); eq.classList.toggle("hl-lead", !!o.hl.lead);
    MV.keepFocus($(".p3-card .q-actions", host), function(){
      $$("[data-hl]", host).forEach(function(b){ var on = !!o.hl[b.dataset.hl]; b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); });
    });
    var alg = $("#p3-alg", host), open = alg.open;
    alg.innerHTML = "<summary>Check it with algebra</summary><p><strong>Vertical:</strong> " + P.algV + "</p><p><strong>Horizontal:</strong> " + P.algH + '</p><p class="p3-algl">' + c.alg + "</p>";
    alg.open = open;
  }
  function nlRender(){
    var c = cs(), o = st(c), p = nlPlot;
    p.draw({ numberLine:{ min:-6, max:6, step:1, every:1, dots:o.taps.map(function(x){ return { x:x, closed:false, color:o.A.solved ? css("--green") : css("--pen") }; }) },
      describe:"Number line from −6 to 6. " + (o.taps.length ? "Marked: " + o.taps.map(function(x){ return num(x); }).join(", ") + "." : "Nothing marked.") });
  }
  var nlPlot = new MV.Plot($("#p3-nlc", host), { xmin:-6, xmax:6, ymin:-1, ymax:1 }); nlPlot.render = nlRender;
  function paintA(){
    var c = cs(), o = st(c), h = "", tk = "";
    for (var t = -6; t <= 6; t++) { var on = o.taps.indexOf(t) >= 0; tk += '<button type="button" class="p3-tick" data-tick="' + t + '" data-k="p3t' + t + '" style="left:calc(22px + ' + ((t + 6) / 12 * 100).toFixed(4) + '% - ' + ((t + 6) / 12 * 44).toFixed(3) + 'px)" aria-pressed="' + on + '" aria-label="x = ' + num(t) + (on ? ", marked" : "") + '"' + (o.A.solved ? " disabled" : "") + "></button>"; }
    MV.keepFocus($("#p3-ticks", host), function(){ $("#p3-ticks", host).innerHTML = tk; });
    h += '<div class="q-actions"><button type="button" class="chip" data-act="none" data-k="p3none" aria-pressed="' + o.none + '"' + (o.A.solved ? " disabled" : "") + ">" + (o.none ? "✓ " : "") + "No restrictions</button>" +
      '<button type="button" class="btn ghost sm" data-act="factor" data-k="p3fac"' + (o.factor ? " disabled" : "") + ">Show the factoring</button>" +
      (o.A.solved ? "" : '<button type="button" class="btn primary sm" data-act="checkA" data-k="p3chkA">Check restrictions</button>') + "</div>";
    if (o.factor) h += '<p class="p3-fac">' + c.factored + "</p>";
    if (o.A.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> Domain: " + c.domain + (o.A.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgA) h += '<div class="fb bad" role="status">' + msgA.map(function(m, i){ return "<p>" + (i || /^Tap each/.test(m) ? "" : "<strong>✗ Not quite.</strong> ") + m + "</p>"; }).join("") + "</div>";
    MV.keepFocus($("#p3-Ab", host), function(){ $("#p3-Ab", host).innerHTML = h; });
    nlRender();
  }
  function paintB(){
    var c = cs(), o = st(c), B = $("#p3-B", host), h = "";
    if (!o.A.solved) { B.innerHTML = '<p class="tiny muted p3-lock">Station B (“What happens far away?”) opens when your restrictions are right.</p>'; return; }
    h += '<h3>Station B: “What happens far away?”</h3>';
    h += '<p class="p3-lead">Leading terms: <span class="p3-box">' + c.lead[0] + '</span> over <span class="p3-box">' + c.lead[1] + "</span>: degree " + c.deg[0] + " over degree " + c.deg[1] + ".</p>";
    h += '<div class="chips" role="group" aria-label="Horizontal asymptote">' + c.chips.map(function(ch, i){ var on = o.chip === i; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-chip="' + i + '" data-k="p3ch' + i + '" aria-pressed="' + on + '"' + (o.B.solved ? " disabled" : "") + ">" + ch.t + "</button>"; }).join("") + "</div>";
    if (!o.B.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="checkB" data-k="p3chkB"' + (o.chip == null ? " disabled" : "") + ">Check asymptote</button></div>";
    if (o.B.solved) {
      var ld = c.deg[0] < c.deg[1] ? P.rightLower : c.deg[0] === c.deg[1] ? P.rightEqual : P.rightHigher;
      h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + ld + (o.B.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgB) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgB);
    h += '<div id="p3-race"></div>';
    MV.keepFocus(B, function(){ B.innerHTML = h; });
    if (o.raced) paintRace(false);
  }
  function paintRace(animate){
    var c = cs(), rows = raceRows(c), box = $("#p3-race", host); if (!box) return;
    var qh = '<span class="frac"><span class="fn">' + unM(c.lead[0]) + '</span><span class="fd">' + unM(c.lead[1]) + "</span></span>";
    var head = '<h4>The leading-term race</h4><p class="tiny muted">Each bar is split into the leading term’s share (ink) and the rest (yellow). A term’s share is its size divided by the total size of all the terms.</p>' +
      '<div class="tbl-wrap"><table class="vt p3-race"><thead><tr><th scope="col">' + mi("x") + '</th><th scope="col">numerator ' + mi(polyM(c.num)) + '</th><th scope="col">denominator ' + mi(polyM(c.den)) + '</th><th scope="col">leading term’s share (top / bottom)</th><th scope="col">leading terms’ quotient <span class="m">' + qh + '</span></th><th scope="col">' + mi("y") + "</th></tr></thead><tbody></tbody></table></div>";
    box.innerHTML = head + '<p class="p3-teaser" id="p3-teaser"></p>';
    var tb = box.querySelector("tbody"), my = ++race.tok;
    function bar(s){ return '<span class="rbar" aria-hidden="true"><i style="width:' + Math.min(100, s).toFixed(2) + '%"></i></span>'; }
    function row(r){ return '<tr class="' + (animate ? "new" : "") + '"><td>' + num(r.x, 0) + "</td><td>" + num(r.N, 0) + bar(r.sN) + "</td><td>" + num(r.D, 0) + bar(r.sD) + "</td><td>" + shareT(r.sN) + " / " + shareT(r.sD) + "</td><td>" + r.q + "</td><td>" + r.y + "</td></tr>"; }
    function tail(){ if (c.hz == null) $("#p3-teaser", host).innerHTML = P.teaser; }
    if (!animate || MV.reduceMotion) { tb.innerHTML = rows.map(row).join(""); tail(); return; }
    var i = 0;
    (function nx(){ if (my !== race.tok) return; if (i >= rows.length) { tail(); return; } tb.insertAdjacentHTML("beforeend", row(rows[i++])); MV.wait(1000, nx); })();
  }
  function paintNext(){
    var c = cs(), h = "";
    if (doneCase(c)) h = S.ci < CS.length - 1 ? '<div class="q-actions"><button type="button" class="btn primary sm" data-case="' + (S.ci + 1) + '" data-k="p3nx">Next case</button></div>' : '<p class="sort-done">All five cases done. Read “What the rules say” below, then try the quick check.</p>';
    $("#p3-next", host).innerHTML = h;
  }
  function paintAll(){
    var o = st();
    gs = { ha:o.B.solved ? 1 : 0, cross:o.B.solved && cs().cross != null, arrows:o.A.solved, vaOn:o.A.solved }; gv = null;
    gcap(o.B.solved && cs().cross != null ? MV.md(P.crossNote.replace("{x}", cs().crossText)) : o.A.solved ? "" : "The graph appears when your restrictions are right.");
    paintCases(); paintCard(); paintA(); paintB(); paintNext(); plot.render();
  }
  function judgeA(c, o){
    var R = ans(c), T = o.taps.slice().sort(function(a, b){ return a - b; }), m = [];
    if (o.none) return R.length ? [P.noneWrong.replace("{a}", MV.m(String(R[0])))] : null;
    if (!T.length) return ["Tap each restriction on the number line, or press <strong>No restrictions</strong>."];
    if (T.join() === R.join()) return null;
    if (!R.length) return [c.anyTap];
    if (c.numZero != null && T.indexOf(c.numZero) >= 0) m.push(P.m1);
    if (c.slip && T.join() === c.slip.taps.join()) { m.push(c.slip.fb); return m; }
    if (c.cubeFb && T.indexOf(-2) >= 0) { m.push(c.cubeFb); return m; }
    T.forEach(function(t){ if (R.indexOf(t) < 0 && t !== c.numZero) m.push("At " + M("x = " + t) + " the denominator is " + num(pv(c.den, t)) + ", not 0."); });
    if (R.some(function(r){ return T.indexOf(r) < 0; })) m.push(c.missed || P.missedGeneric);
    return m.slice(0, 3);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var c = cs(), o = st(c), d = b.dataset;
    if (d.case != null) { race.tok++; gtok.tok++; S.ci = +d.case; msgA = msgB = null; api.save(); paintAll(); if (b.dataset.k === "p3nx") { var top = $("#p3-cases", host); if (top) top.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); } return; }
    if (d.hl) { o.hl[d.hl] = !o.hl[d.hl]; api.save(); paintCard(); return; }
    if (d.tick != null) { var t = +d.tick, k = o.taps.indexOf(t); if (k < 0) o.taps.push(t); else o.taps.splice(k, 1); o.none = false; msgA = null; api.save(); paintA(); return; }
    if (d.act === "none") { o.none = !o.none; if (o.none) o.taps = []; msgA = null; api.save(); paintA(); return; }
    if (d.act === "factor") { o.factor = true; api.save(); paintA(); return; }
    if (d.act === "checkA") {
      var m = judgeA(c, o);
      if (!m) { o.A.solved = true; o.A.first = o.A.tries === 0; msgA = null; api.save(); paintCases(); paintA(); paintB(); paintNext(); gcap(""); showVAs(); }
      else { if (!(m.length === 1 && /^Tap each/.test(m[0]))) o.A.tries++; msgA = m; api.save(); paintA(); }
      MV.focusFb($("#p3-A", host)); return;
    }
    if (d.chip != null) { o.chip = +d.chip; msgB = null; api.save(); paintB(); return; }
    if (d.act === "checkB") {
      var ch = c.chips[o.chip], right = MV.ok(ch);
      if (right) { o.B.solved = true; o.B.first = o.B.tries === 0; msgB = null; }
      else { o.B.tries++; msgB = ch.fb; }
      o.raced = true; api.save(); paintCases(); paintB(); paintNext(); paintRace(true);
      if (right) confirmHA();
      MV.focusFb($("#p3-B", host)); return;
    }
  });
  paintAll();
  return {};
}

// ---------- Practice 2: thumbnails (window −4 ≤ x ≤ 4, −4 ≤ y ≤ 4, asymptotes drawn but not labelled) ----------
var THUMBS = {
  gA:{ f:function(x){ return 2 * x * x / (x * x + 1); }, va:[], ha:2 },
  gB:{ f:function(x){ return 2 * x / (x * x - 1); }, va:[-1, 1], ha:0 },
  gC:{ f:function(x){ return 1 / (x * x); }, va:[0], ha:0 },
  gD:{ f:function(x){ return 2 / (x * x + 1); }, va:[], ha:0 },
  gE:{ f:function(x){ return 2 * x * x / (x * x - 1); }, va:[-1, 1], ha:2 },
  gF:{ f:function(x){ return -1 / x; }, va:[0], ha:0 }
};
var figures = {};
Object.keys(THUMBS).forEach(function(k){
  figures[k] = function(p){
    var d = THUMBS[k], as = d.va.map(function(a){ return { x:a, prog:1, onAxis:a === 0 }; }).concat([{ y:d.ha, prog:1, onAxis:d.ha === 0 }]);
    p.draw({ view:{ xmin:-4, xmax:4, ymin:-4, ymax:4 }, xTicks:{ step:1 }, yTicks:{ step:1 }, regions:axisUnderlays(p, as), curves:curvePieces(d.f, d.va, css("--pen"), { width:2.6 }),
      after:function(ctx, pl){ as.forEach(function(a){ asymDraw(ctx, pl, a, 1, 0, ""); }); } });
  };
});

// ---------- Practice 3: work backwards (fill in the coefficients, N4) ----------
// template "x^2 + [b]x + 9" -> terms [{box:"b"|null, k:number, c:number}]
function parseT(t){
  return t.replace(/\s+/g, "").replace(/-/g, "+-").split("+").filter(Boolean).map(function(term){
    var sg = 1; if (term.charAt(0) === "-") { sg = -1; term = term.slice(1); }
    var m = /^(\[(\w)\]|\d+)?(x(\^(\d))?)?$/.exec(term) || [];
    return { box:m[2] || null, c:m[1] && !m[2] ? +m[1] : 1, sg:sg, k:m[3] ? (m[5] ? +m[5] : 1) : 0 };
  });
}
function coeffs(t, vals){ var c = [0, 0, 0]; parseT(t).forEach(function(r){ c[r.k] += r.sg * (r.box ? vals[r.box] : r.c); }); return c; }
function tmplHTML(t, it, x, dis){
  return t.split(/(\[\w\])/).map(function(part){
    var m = /^\[(\w)\]$/.exec(part);
    if (!m) return part ? mi(part) : "";
    var v = x.vals[m[1]] == null ? "" : x.vals[m[1]];
    return '<label class="wb-box"><input type="number" step="1" min="-20" max="20" autocomplete="off" placeholder="' + m[1] + '" data-f="' + m[1] + '" aria-label="' + m[1] + '" value="' + MV.esc(v) + '"' + (dis ? " disabled" : "") + '><span class="wb-l" aria-hidden="true"><i>' + m[1] + "</i></span></label>";
  }).join("");
}
// features of y = num/den (den a monic quadratic, num degree ≤ 2)
function quadRoots(c){ // real roots of c0 + c1 x + c2 x^2 (degree may drop), with multiplicity
  var d = degOf(c);
  if (d === 0) return c[0] === 0 ? null : [];
  if (d === 1) return [-c[0] / c[1]];
  var D = c[1] * c[1] - 4 * c[2] * c[0];
  if (D < 0) return [];
  if (D === 0) return [-c[1] / (2 * c[2]), -c[1] / (2 * c[2])];
  var s = Math.sqrt(D); return [(-c[1] - s) / (2 * c[2]), (-c[1] + s) / (2 * c[2])].sort(function(a, b){ return a - b; });
}
function analyse(nm, dn){
  var dr = quadRoots(dn) || [], nr = quadRoots(nm), va = [], holes = [], seen = {};
  dr.forEach(function(r){
    var key = r.toFixed(9); if (seen[key]) return; seen[key] = 1;
    var md = dr.filter(function(s){ return Math.abs(s - r) < 1e-9; }).length, mn = nr === null ? 9 : nr.filter(function(s){ return Math.abs(s - r) < 1e-9; }).length;
    if (md > mn) va.push(r); else holes.push(r);
  });
  var rs = Object.keys(seen).map(Number), inDom = function(x){ return !rs.some(function(r){ return Math.abs(r - x) < 1e-9; }); };
  var dN = degOf(nm), L = dN < 2 ? 0 : nm[2] / dn[2];
  if (nr === null) L = 0;
  var xint = nr === null ? null : nr.filter(function(x, i){ return inDom(x) && nr.indexOf(x) === i; });
  var yint = inDom(0) ? pv(nm, 0) / pv(dn, 0) : null;
  var diff = [nm[0] - L * dn[0], nm[1] - L * dn[1], nm[2] - L * dn[2]], cr = quadRoots(diff);
  var cross = cr === null ? "same" : cr.filter(function(x, i){ return inDom(x) && cr.indexOf(x) === i; });
  return { va:va, holes:holes, rs:rs, ha:L, xint:xint, yint:yint, cross:cross, f:function(x){ return pv(nm, x) / pv(dn, x); } };
}
function featText(A, keys){
  var out = [];
  keys.forEach(function(k){
    if (k === "va") out.push(A.va.length ? "vertical asymptote" + (A.va.length > 1 ? "s " : " ") + A.va.map(function(r){ return eqV("x", r); }).join(" and ") : "no vertical asymptote");
    if (k === "ha") out.push("horizontal asymptote " + eqV("y", A.ha));
    if (k === "yint") out.push(A.yint == null ? "no " + M("y") + "-intercept (" + M("x = 0") + " is a restriction)" : M("y") + "-intercept " + M(valT(A.yint).s));
    if (k === "xint") out.push(A.xint === null ? "a graph that lies on the " + M("x") + "-axis" : A.xint.length ? M("x") + "-intercept" + (A.xint.length > 1 ? "s " : " ") + A.xint.map(function(r){ return M(valT(r).s); }).join(" and ") : "no " + M("x") + "-intercept");
    if (k === "dom") out.push(A.rs.length ? "domain " + M("{x ∈ ℝ | " + A.rs.map(function(r){ return "x ≠ " + valT(r).s; }).join(", ") + "}") : "domain ℝ");
    if (k === "cross") out.push(A.cross === "same" || !A.cross.length ? "a graph that never crosses its horizontal asymptote" : "a graph that crosses " + eqV("y", A.ha) + " at " + A.cross.map(function(r){ return eqV("x", r); }).join(" and "));
  });
  return out.join("; ");
}
function graphFn(p, nm, dn, view, extraPts){
  var A = analyse(nm, dn), as = A.va.map(function(r){ return { x:r, prog:1, onAxis:Math.abs(r) < 1e-12 }; });
  as.push({ y:A.ha, prog:1, onAxis:A.ha === 0 });
  var pts = A.holes.map(function(r){ var h = 1e-6; return { x:r, y:(A.f(r - h) + A.f(r + h)) / 2, open:true, color:css("--pen") }; }).concat(extraPts || []);
  p.draw({ view:view, regions:axisUnderlays(p, as), curves:curvePieces(A.f, A.rs, css("--pen")), points:pts,
    after:function(ctx, pl){ as.forEach(function(a){ asymDraw(ctx, pl, a, 1, 1, asymLabel({ x:a.x != null ? Math.round(a.x * 1000) / 1000 : null, y:a.y })); }); },
    describe:"Graph of your function, y = " + MV.plain(M("(" + polyM(nm) + ")/(" + polyM(dn) + ")")) + ". " + (A.va.length ? "Vertical asymptotes at " + A.va.map(function(r){ return "x = " + num(r, 2); }).join(" and ") + ". " : "No vertical asymptote. ") + "Horizontal asymptote y = " + num(A.ha, 3) + "." });
  return A;
}
function backwards(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="wb-n"></span><span class="dots" id="wb-dots" aria-hidden="true"></span></div>' +
    '<p class="wb-feat" id="wb-feat"></p><p class="wb-tmpl" id="wb-tmpl"></p>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="wb-check" data-k="wbchk">Check</button><span id="wb-hint"></span></div><div id="wb-hints"></div><div id="wb-fb" aria-live="polite"></div>' +
    '<div class="wb-g" id="wb-g" hidden><p class="tiny muted" id="wb-gcap"></p><canvas class="plot" id="wb-plot" role="img" aria-label="Graph of your function"></canvas></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="wb-prev" data-k="wbprev">Previous</button><button type="button" class="btn ghost sm" id="wb-next" data-k="wbnext">Next build</button></div>';
  var plot = new MV.Plot($("#wb-plot", host), { xmin:-8, xmax:8, ymin:-8, ymax:8 }), msg = {};
  var VIEW = { xmin:-8, xmax:8, ymin:-8, ymax:8 };
  function ist(){ var it = a.items[S.i]; return S.items[it.id] || (S.items[it.id] = { vals:{}, tries:0, hint:0, solved:false, first:null, last:null }); }
  plot.render = function(){
    var it = a.items[S.i], x = ist(); if (!x.last) return;
    graphFn(plot, coeffs(it.num, x.last), coeffs(it.den, x.last), VIEW);
  };
  function paint(){
    var it = a.items[S.i], x = ist();
    $("#wb-n", host).innerHTML = "Build " + (S.i + 1) + " of " + a.items.length + (it.stretch ? ' <span class="tag">Stretch</span>' : "");
    $("#wb-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#wb-feat", host).innerHTML = "<strong>Features:</strong> " + it.features + ".";
    $("#wb-tmpl", host).innerHTML = '<span class="m"><i>y</i> = <span class="frac"><span class="fn">' + tmplHTML(it.num, it, x, x.solved) + '</span><span class="fd">' + tmplHTML(it.den, it, x, x.solved) + "</span></span></span>";
    $("#wb-check", host).disabled = x.solved;
    $("#wb-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("wbh" + it.id, x.hint);
    $("#wb-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    $("#wb-fb", host).innerHTML = x.solved ? MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>')) :
      (msg[it.id] ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg[it.id] + " Try again.") : "");
    var g = $("#wb-g", host); g.hidden = !x.last;
    if (x.last) $("#wb-gcap", host).innerHTML = "The graph of " + (x.solved ? "your" : "<strong>your</strong>") + " function: " + M("y = {" + polyM(coeffs(it.num, x.last)) + "}/{" + polyM(coeffs(it.den, x.last)) + "}");
    $("#wb-prev", host).disabled = S.i === 0; $("#wb-next", host).disabled = S.i === a.items.length - 1;
    plot.render();
  }
  function readVals(it){
    var out = {}, ok = true;
    $$("input[data-f]", host).forEach(function(inp){ var s = String(inp.value).trim().replace(/−/g, "-"); if (!/^-?\d+$/.test(s) || Math.abs(+s) > 20) ok = false; out[inp.dataset.f] = +s; });
    return ok ? out : null;
  }
  function rules(it, v){
    var hits = [];
    (it.wrong || []).forEach(function(w){
      var c = w.when, ok = true;
      Object.keys(c).forEach(function(k){
        if (k === "bIn") ok = ok && v.b >= c.bIn[0] && v.b <= c.bIn[1];
        else if (k === "bOut") ok = ok && Math.abs(v.b) > c.bOut;
        else ok = ok && v[k] === c[k];
      });
      if (ok) hits.push(w.fb);
    });
    return hits;
  }
  host.addEventListener("input", function(e){ var f = e.target.dataset && e.target.dataset.f; if (!f) return; var x = ist(); x.vals[f] = e.target.value; api.save(); });
  host.addEventListener("click", function(e){
    var btn = e.target.closest("button"); if (!btn || btn.disabled) return;
    var it = a.items[S.i], x = ist();
    if (btn.id === "wb-prev" || btn.id === "wb-next") { S.i += btn.id === "wb-prev" ? -1 : 1; api.save(); paint(); return; }
    if (btn.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (btn.id === "wb-check") {
      var v = readVals(it);
      if (!v) { msg[it.id] = "Type a whole number from −20 to 20 in each box."; paint(); MV.focusFb(host); return; }
      x.last = v; var want = MV.ans(it), right = Object.keys(want).every(function(k){ return v[k] === want[k]; });
      if (right) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
      else {
        x.tries++;
        var hits = rules(it, v);
        if (!hits.length) { var A = analyse(coeffs(it.num, v), coeffs(it.den, v)); hits = [a.generic.replace("{feat}", featText(A, it.show))]; }
        msg[it.id] = hits.join(" ");
      }
      api.save(); paint(); MV.focusFb(host);
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: design a rational function ----------
var task = (function(){
  var api, plot, KEYS = ["a", "b", "c", "p", "q"];
  function read(){
    var s = api ? api.S : {}, raw = s.v || {}, d = { raw:raw, valid:true };
    KEYS.forEach(function(k){ var t = String(raw[k] == null ? "" : raw[k]).trim().replace(/−/g, "-"); if (!/^-?\d+$/.test(t) || Math.abs(+t) > 20) d.valid = false; d[k] = +t; });
    return d;
  }
  function eqSrc(d, stacked){ var nm = polyM([d.c, d.b, d.a]), dn = polyM([d.q, d.p, 1]); return stacked ? "f(x) = {" + nm + "}/{" + dn + "}" : "f(x) = (" + nm + ")/(" + dn + ")"; }
  function draw(){
    var d = read(), cap = $("#tk-eq");
    if (!d.valid) {
      if (cap) cap.innerHTML = M("f(x) = {ax^2 + bx + c}/{x^2 + px + q}");
      plot.draw({ view:{ xmin:-8, xmax:8, ymin:-8, ymax:8 }, describe:"Empty graph. Enter all five coefficients." }); return;
    }
    if (cap) cap.innerHTML = M(eqSrc(d, true));
    var nm = [d.c, d.b, d.a], dn = [d.q, d.p, 1], dv = pv(dn, 1), pts = [];
    if (dv !== 0) { var y1 = pv(nm, 1) / dv; pts.push({ x:1, y:y1, r:5.5, color:css("--ink"), label:"(1, " + valT(y1).s.replace("-", MINUS) + ")" }); }
    graphFn(plot, nm, dn, { xmin:-8, xmax:8, ymin:-8, ymax:8 }, pts);
  }
  function checks(d){
    if (!d.valid) return [false, false, false, false];
    var a = d.a, b = d.b, c = d.c, p = d.p, q = d.q, disc = p * p - 4 * q, l1 = false;
    if (disc > 0) { var s = Math.sqrt(disc), r1 = (-p - s) / 2, r2 = (-p + s) / 2; l1 = Math.abs(a * r1 * r1 + b * r1 + c) > 1e-9 && Math.abs(a * r2 * r2 + b * r2 + c) > 1e-9; }
    var Lh = a, l3 = (1 + p + q) !== 0 && (b - Lh * p) !== 0 && (b - Lh * p) + (c - Lh * q) === 0;
    return [l1, a === 2, l3, c === 0 && q !== 0];
  }
  return {
    render:function(inp, pv2, a){
      api = a; a.S.v = a.S.v || {};
      inp.innerHTML = '<div class="inrow tk-in">' + KEYS.map(function(k){ return '<label for="tk-' + k + '"><span>' + M(k) + '</span><input id="tk-' + k + '" data-v="' + k + '" type="number" step="1" min="-20" max="20" autocomplete="off" value="' + MV.esc(a.S.v[k] == null ? "" : a.S.v[k]) + '"></label>'; }).join("") + "</div>";
      pv2.innerHTML = '<p class="eq-cap tk-eq" id="tk-eq" aria-live="polite"></p><canvas class="plot square" id="tk-plot" role="img" aria-label="Graph of your design"></canvas>';
      plot = new MV.Plot($("#tk-plot"), { xmin:-8, xmax:8, ymin:-8, ymax:8 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.v; if (!k) return; a.S.v[k] = e.target.value; a.save(); draw(); a.update(); });
      draw();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Type a whole number from −20 to 20 in each of the five boxes."; },
    checks:checks,
    tips:function(d, c){
      var T = MV.C.task, ts = T.tipStates, out = [];
      if (!c[0]) {
        var disc = d.p * d.p - 4 * d.q, stt = disc < 0 ? ts.none : disc === 0 ? ts.one : ts.shared;
        out.push(T.tips[0].replace("{state}", stt) + (disc > 0 ? " " + ts.hole : ""));
      }
      if (!c[1]) out.push(T.tips[1]);
      if (!c[2]) {
        var Lh = d.a, now, A = d.b - Lh * d.p, Bc = d.c - Lh * d.q, Ly = M("y = " + Lh);
        if (1 + d.p + d.q === 0) now = ts.undef;
        else if (A === 0) now = ts.never.replace("{L}", Ly);
        else { var xs = -Bc / A; now = (pv([d.q, d.p, 1], xs) === 0 ? ts.never.replace("{L}", Ly) : ts.cross.replace("{L}", Ly).replace("{x}", eqV("x", xs))); }
        out.push(T.tips[2].replace("{now}", now));
      }
      if (!c[3]) out.push(T.tips[3]);
      return out;
    },
    key:function(d){ return KEYS.map(function(k){ return d[k]; }).join(","); },
    label:function(k){ var v = k.split(",").map(Number); return M(eqSrc({ a:v[0], b:v[1], c:v[2], p:v[3], q:v[4] }, false)); },
    text:function(k){ var v = k.split(",").map(Number); return MV.plain(M(eqSrc({ a:v[0], b:v[1], c:v[2], p:v[3], q:v[4] }, false))); }
  };
})();

// matching feedback: the plan's lines end "Try another graph." (the toolkit adds "Try another partner.")
function fixMatchText(){
  var h = document.getElementById("act-match"); if (!h || h._mvObs) return; h._mvObs = true;
  var fix = function(){ $$(".fb.bad p", h).forEach(function(p){ var last = p.lastChild; if (last && last.nodeType === 3 && /Try another partner\.$/.test(last.nodeValue)) last.nodeValue = last.nodeValue.replace(/Try another partner\.$/, "Try another graph."); }); };
  new MutationObserver(fix).observe(h, { childList:true, subtree:true }); fix();
}

MV.module({
  hero:function(f){ fixMatchText(); hero(f); },
  explore:explore,
  part3:part3,
  activities:{ backwards:backwards },
  task:task,
  figures:figures,
  onShow:function(){ fixMatchText(); }
});
})();
