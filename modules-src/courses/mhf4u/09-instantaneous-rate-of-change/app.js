// MHF4U 09 Instantaneous Rate of Change: hero, secant-to-tangent zoom (Explore), sign of the rate with linked panels
// (Part 3), tap the point (Practice 1), "Design the ramp" task, and the small question graphs.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function fx(v, dp){ return num(v, dp == null ? 4 : dp); }
function par(s){ return String(s).charAt(0) === MINUS ? "(" + s + ")" : s; }
function snapTo(v, step, lo, hi){ v = Math.round(v / step) * step; if (lo != null) v = Math.max(lo, v); if (hi != null) v = Math.min(hi, v); return Math.round(v * 1e6) / 1e6; }
function M(s){ return MV.m(s); }

// @component exactDec — exact rational arithmetic (BigInt) for polynomial values and secant slopes, printed as exact decimals (no 6.000000001)
var XQ = (function(){
  var B = window.BigInt, Z = B(0), ONE = B(1), TWO = B(2), FIVE = B(5), TEN = B(10);
  function abs(a){ return a < Z ? -a : a; }
  function gcd(a, b){ a = abs(a); b = abs(b); while (b !== Z) { var t = a % b; a = b; b = t; } return a; }
  function mk(n, d){ if (d < Z) { n = -n; d = -d; } var g = gcd(n, d); if (g > ONE) { n = n / g; d = d / g; } return { n:n, d:d }; }
  function of(v){ return (v && typeof v === "object") ? v : mk(B(Math.round(v * 1e6)), B(1000000)); }
  function add(a, b){ a = of(a); b = of(b); return mk(a.n * b.d + b.n * a.d, a.d * b.d); }
  function sub(a, b){ a = of(a); b = of(b); return mk(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mul(a, b){ a = of(a); b = of(b); return mk(a.n * b.n, a.d * b.d); }
  function div(a, b){ a = of(a); b = of(b); return mk(a.n * b.d, a.d * b.n); }
  function toNum(a){ a = of(a); return Number(a.n) / Number(a.d); }
  function pow10(k){ var p = ONE; while (k-- > 0) p = p * TEN; return p; }
  // exact decimal text when the denominator is 2^i·5^j and short enough; otherwise rounded to maxDp places
  function dec(a, maxDp){
    a = of(a); maxDp = maxDp == null ? 12 : maxDp;
    var d = a.d, i = 0, j = 0;
    while (d % TWO === Z) { d = d / TWO; i++; }
    while (d % FIVE === Z) { d = d / FIVE; j++; }
    var k = Math.max(i, j), exact = d === ONE && k <= maxDp;
    if (!exact) k = maxDp;
    var neg = a.n < Z, n = abs(a.n), s = pow10(k), q = exact ? n * s / a.d : (n * s * TWO + a.d) / (TWO * a.d), str = q.toString();
    if (k > 0) { while (str.length <= k) str = "0" + str; str = (str.slice(0, str.length - k) + "." + str.slice(str.length - k)).replace(/0+$/, "").replace(/\.$/, ""); }
    var parts = str.split(".");
    if (parts[0].length > 4) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    str = parts.join(".");
    return (neg && str !== "0" ? MINUS : "") + str;
  }
  function poly(c){ var cq = c.map(of); return function(x){ x = of(x); var r = of(0); for (var i = cq.length - 1; i >= 0; i--) r = add(mul(r, x), cq[i]); return r; }; }
  function deriv(c){ return c.slice(1).map(function(v, i){ return v * (i + 1); }); }
  return { of:of, add:add, sub:sub, mul:mul, div:div, toNum:toNum, dec:dec, poly:poly, deriv:deriv };
})();

// A curve: polynomial coefficients c (low to high) give fast float f/d for drawing and exact Pq/Dq for readouts.
function mkF(o){
  if (o.c) {
    var c = o.c, dc = XQ.deriv(c);
    o.f = function(x){ var r = 0; for (var i = c.length - 1; i >= 0; i--) r = r * x + c[i]; return r; };
    o.d = function(x){ var r = 0; for (var i = dc.length - 1; i >= 0; i--) r = r * x + dc[i]; return r; };
    o.Pq = XQ.poly(c); o.Dq = XQ.poly(dc);
  }
  return o;
}
function apx(v){ var r = Math.round(v * 100) / 100; return (Math.abs(v - r) < 1e-9 ? "" : "≈ ") + num(v, 2); }
function valS(F, x){ return F.c ? XQ.dec(F.Pq(x)) : apx(F.f(x)); }
function rateS(F, x){ return F.c ? XQ.dec(F.Dq(x)) : num(F.d(x), 1); }

// @component N14 secantTable — secant slopes from P (one-sided Q = a + h, or centred a − h to a + h) with the arithmetic, exact for polynomials
function secant(F, a, h, cen){
  var r = { h:h, cen:!!cen, ok:h !== 0, approx:!F.c };
  if (F.c) {
    var A = XQ.of(a), H = XQ.of(h), X2 = XQ.add(A, H), X1 = cen ? XQ.sub(A, H) : A, Y2 = F.Pq(X2), Y1 = F.Pq(X1), RUN = XQ.sub(X2, X1);
    r.x1 = XQ.dec(X1); r.x2 = XQ.dec(X2); r.y1 = XQ.dec(Y1); r.y2 = XQ.dec(Y2); r.run = XQ.dec(RUN);
    if (r.ok) { var m = XQ.div(XQ.sub(Y2, Y1), RUN); r.m = XQ.toNum(m); r.ms = XQ.dec(m); }
  } else {
    var x1 = cen ? a - h : a, x2 = a + h, y1 = F.f(x1), y2 = F.f(x2);
    r.x1 = fx(x1); r.x2 = fx(x2); r.y1 = apx(y1); r.y2 = apx(y2); r.run = fx(x2 - x1);
    if (r.ok) { r.m = (y2 - y1) / (x2 - x1); r.ms = num(r.m, 2); }
  }
  r.arith = "(" + r.y2 + " − " + par(r.y1) + ") ÷ " + par(r.run) + (r.ok ? (r.approx ? " ≈ " : " = ") + r.ms : " = 0 ÷ 0: no value");
  return r;
}
function secPts(s){
  if (!s.ok) return M("Q = P");
  return s.cen ? "(" + s.x1 + ", " + s.y1 + ") and (" + s.x2 + ", " + s.y2 + ")" : "(" + s.x2 + ", " + s.y2 + ")";
}
function secSlope(s){ return s.ok ? (s.approx ? "≈ " : "") + s.ms : "0 ÷ 0: no value"; }
function secTable(F, a, list, hi, caption){
  return MV.tableHTML({ head:[M("h"), M("Q"), "secant slope"], hiRow:hi, caption:caption || "Secant slopes",
    rows:list.map(function(r){ var s = secant(F, a, r.h, r.cen); return [(r.cen && r.h ? "±" : "") + fx(r.h), secPts(s), secSlope(s)]; }) });
}

// ---------- hero: Q slides to P on y = x², slopes settle, zoom, tangent fades in ----------
function hero(f){
  var p = new MV.Plot(f.canvas, { xmin:-0.6, xmax:5, ymin:-1.5, ymax:20 }), sq = function(x){ return x * x; };
  var stops = [4, 3.5, 3.1, 3.01], slopes = ["7", "6.5", "6.1", "6.01"];
  var V0 = { xmin:-0.6, xmax:5, ymin:-1.5, ymax:20 }, ZF = 18, st = { q:4, n:1, z:0, tan:0 };
  function view(){
    var t = st.z, k = Math.pow(1 / ZF, t), s = (1 - k) / (1 - 1 / ZF);
    var w = (V0.xmax - V0.xmin) * k, h = (V0.ymax - V0.ymin) * k;
    var cx = (V0.xmin + V0.xmax) / 2 + (3 - (V0.xmin + V0.xmax) / 2) * s, cy = (V0.ymin + V0.ymax) / 2 + (9 - (V0.ymin + V0.ymax) / 2) * s;
    return { xmin:cx - w / 2, xmax:cx + w / 2, ymin:cy - h / 2, ymax:cy + h / 2 };
  }
  function table(){
    $("#hero-tbl").innerHTML = MV.tableHTML({ head:[M("Q") + " at " + M("x ="), "secant slope"], caption:"Secant slopes from P(3, 9)",
      rows:stops.slice(0, st.n).map(function(x, i){ return [num(x), slopes[i]]; }) });
  }
  p.render = function(){
    var v = view(), sc = { view:v, lines:[{ p:[3, 9], q:[st.q, sq(st.q)], color:css("--ink-2"), width:2 }], curves:[{ f:sq, color:css("--pen"), width:3.2 }],
      segments:[], points:[{ x:3, y:9, color:css("--ink"), label:"P" }], labels:[],
      describe:"The parabola y = x squared with P at (3, 9) and Q at (" + num(st.q) + ", " + num(sq(st.q), 4) + "). Secant slopes so far: " + slopes.slice(0, st.n).join(", ") + "." + (st.tan > 0.5 ? " The tangent at P, slope 6, lies along the curve." : "") };
    if (st.tan > 0) sc.segments.push({ x1:v.xmin, y1:9 + 6 * (v.xmin - 3), x2:v.xmax, y2:9 + 6 * (v.xmax - 3), color:css("--ink"), width:2, alpha:st.tan });
    if (Math.abs(st.q - 3) / (v.xmax - v.xmin) > 0.06) sc.points.push({ x:st.q, y:sq(st.q), color:css("--ink-2"), label:"Q" });
    if (st.tan > 0.5) sc.labels.push({ x:3, y:9, text:"tangent: slope 6", dx:-14, dy:-22, align:"right", bg:true });
    p.draw(sc);
  };
  function finish(){ st.q = 3.01; st.n = 4; st.z = 1; st.tan = 1; table(); p.render(); f.cap.textContent = "The slopes settle on 6."; }
  table(); p.render();
  if (MV.reduceMotion) { finish(); return; }
  var i = 1;
  function nextStop(){
    if (i >= stops.length) { MV.wait(700, zoom); return; }
    var from = st.q, to = stops[i];
    MV.tween({ dur:900, step:function(t){ st.q = from + (to - from) * t; p.render(); }, done:function(){ st.n = i + 1; table(); i++; MV.wait(650, nextStop); } });
  }
  function zoom(){ MV.tween({ dur:2000, step:function(t){ st.z = t; p.render(); }, done:function(){ MV.tween({ dur:900, step:function(t){ st.tan = t; p.render(); }, done:finish }); } }); }
  MV.wait(900, nextStop);
}

// ---------- Explore: secant-to-tangent zoom ----------
var FX = {
  sq:mkF({ chip:"`y = x^2`", eq:"y = x^2", v:"x", c:[0, 0, 1], dom:[-3, 3], P:3, ab:[-2, 1], abDom:[-4, 4], view:{ xmin:-4.6, xmax:4.6, ymin:-2.5, ymax:18 } }),
  ball:mkF({ chip:"Ball: `h(t) = -5t^2 + 20t + 1`", eq:"h(t) = -5t^2 + 20t + 1", v:"t", c:[1, 20, -5], dom:[1, 3], P:1, ab:[0, 3.5], abDom:[0, 4], cdom:[0, 4.05], ctx:"ball", view:{ xmin:-0.5, xmax:4.6, ymin:-3, ymax:25 } }),
  cube:mkF({ chip:"`y = x^3`", eq:"y = x^3", v:"x", c:[0, 0, 0, 1], dom:[-2, 2], P:2, ab:[-1, 2.5], abDom:[-3, 3], view:{ xmin:-3.4, xmax:3.4, ymin:-29, ymax:29 } }),
  bact:mkF({ chip:"Bacteria: `N(t) = 200 · 2^t`", eq:"N(t) = 200 · 2^t", v:"t", f:function(t){ return 200 * Math.pow(2, t); }, d:function(t){ return 200 * Math.pow(2, t) * Math.LN2; },
    dom:[1, 3], P:2, ab:[0.5, 3.5], abDom:[0, 4], cdom:[0, 5], ctx:"bact", view:{ xmin:-0.5, xmax:4.6, ymin:-250, ymax:3500 } }),
  vtx:mkF({ chip:"`y = x^2 - 4x`", eq:"y = x^2 - 4x", v:"x", c:[0, -4, 1], dom:[-1, 5], P:0, ab:[-1, 4], abDom:[-2, 6], view:{ xmin:-2.7, xmax:6.7, ymin:-6, ymax:13.5 } })
};
var FXO = ["sq", "ball", "cube", "bact", "vtx"], MAGS = ["1", "0.5", "0.1", "0.01", "0.001", "0"], ZL = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1000];

function explore(host, api){
  var S = api.S;
  S.fn = FX[S.fn] ? S.fn : "sq"; S.P = S.P || {}; S.mag = MAGS.indexOf(S.mag) >= 0 ? S.mag : "1"; S.side = S.side === -1 ? -1 : 1; S.cen = !!S.cen;
  S.mode = ["sec", "zoom", "ab"].indexOf(S.mode) >= 0 ? S.mode : "sec"; S.zoom = ZL.indexOf(S.zoom) >= 0 ? S.zoom : 1;
  S.rows = S.rows || {}; S.pins = S.pins || {}; S.ab = S.ab || {}; S.abm = S.abm || {};
  var A = { h:null, zoom:null }, anim = null, locked = false;
  var L = MV.pgLayout(host, { aria:"Secant-to-tangent zoom graph" });
  // desktop: the secant table heads the right column; phone: it sits right under the graph (app.css, display:contents)
  var tbl = document.createElement("div"); tbl.className = "sx-tbl"; L.read.parentNode.insertBefore(tbl, L.read); L.graph.parentNode.classList.add("sx");
  L.ctrl.innerHTML = '<div class="chips" id="sx-fn" role="group" aria-label="Choose a function"></div><div id="sx-mode"></div>' +
    '<label class="slider sx-pl" for="sx-p"><span class="slider-top"><span id="sx-plab"></span><output id="sx-pout"></output></span><input type="range" id="sx-p" step="1" style="accent-color:var(--ink)"></label>' +
    '<div id="sx-sec"><div id="sx-gap"></div><div id="sx-side"></div><div id="sx-cen"></div><div class="q-actions" id="sx-pins"></div></div>' +
    '<div id="sx-zoom"><div class="q-actions"><button type="button" class="btn ghost sm" data-z="in" data-k="zin">Zoom in ×2</button><button type="button" class="btn ghost sm" data-z="out" data-k="zout">Zoom out</button><button type="button" class="btn ghost sm" data-z="max" data-k="zmax">Jump to ×1000</button><button type="button" class="btn ghost sm" data-z="reset" data-k="zreset">Back to ×1</button></div></div>' +
    '<p class="tiny muted" id="sx-abnote">Drag <i>A</i> and <i>B</i> along the curve (they snap to the 0.5 grid), or focus one and use the arrow keys.</p>';
  var plot = new MV.Plot(L.canvas, FX.sq.view);
  function F(){ return FX[S.fn]; }
  function Pv(){ var v = S.P[S.fn]; return v == null ? F().P : v; }
  function hv(){ return S.mag === "0" ? 0 : parseFloat(S.mag) * (S.cen ? 1 : S.side); }
  function key(){ return S.fn + "|" + Pv(); }
  function rows(){ return S.rows[key()] || (S.rows[key()] = []); }
  function norm(r){ return r.m === "0" ? { m:"0", s:1, c:false } : { m:r.m, s:r.c ? 1 : r.s, c:!!r.c }; }
  function cur(){ return norm({ m:S.mag, s:S.side, c:S.cen }); }
  function same(p, q){ return p.m === q.m && p.s === q.s && p.c === q.c; }
  function addRow(){ var r = cur(), Lr = rows(); if (!Lr.some(function(x){ return same(x, r); })) Lr.push(r); }
  function grp(r){ return r.m === "0" ? 3 : r.c ? 2 : r.s > 0 ? 0 : 1; }
  function sorted(){ return rows().slice().sort(function(p, q){ return grp(p) - grp(q) || parseFloat(q.m) - parseFloat(p.m); }); }
  function rowH(r){ return r.m === "0" ? 0 : parseFloat(r.m) * (r.c ? 1 : r.s); }
  function nonzero(){ return rows().filter(function(r){ return r.m !== "0"; }); }
  function tanOn(){ return rows().filter(function(r){ return r.m === "0.01" || r.m === "0.001"; }).length >= 3; }
  function estOn(){ var nz = nonzero(); return nz.length >= 3 && nz.some(function(r){ return parseFloat(r.m) <= 0.01; }); }
  function ab(){ var v = S.ab[S.fn]; return v || F().ab.slice(); }
  function pins(){ return S.pins[S.fn] || []; }
  function vname(){ return F().v; }
  function save(){ api.save(); MV.changed(); }
  function stop(){ if (anim) anim(); anim = null; A.h = null; A.zoom = null; }

  // ---- controls ----
  var segMode = MV.seg($("#sx-mode", host), { label:"Mode:", value:S.mode, options:[{ id:"sec", t:"Secants" }, { id:"zoom", t:"Zoom" }, { id:"ab", t:"A and B" }],
    onChange:function(v){ if (locked) { segMode.set(S.mode); return; } stop(); S.mode = v; save(); paint(); } });
  var segGap = MV.seg($("#sx-gap", host), { label:"Gap " + M("h") + ":", value:S.mag, options:MAGS.map(function(m){ return { id:m, t:m }; }),
    onChange:function(v){ if (locked) { segGap.set(S.mag); return; } stop(); slideTo(v, 520); } });
  var segSide = MV.seg($("#sx-side", host), { label:M("Q") + " is:", value:String(S.side), options:[{ id:"1", t:"Right of " + M("P") }, { id:"-1", t:"Left of " + M("P") }],
    onChange:function(v){ if (locked) { segSide.set(String(S.side)); return; } stop(); S.side = +v; addRow(); save(); paint(); } });
  var segCen = MV.seg($("#sx-cen", host), { label:"Centred:", value:S.cen ? "on" : "off", options:[{ id:"off", t:"Off" }, { id:"on", t:"On" }],
    onChange:function(v){ if (locked) { segCen.set(S.cen ? "on" : "off"); return; } stop(); S.cen = v === "on"; addRow(); save(); paint(); } });
  $("#sx-fn", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-fn]"); if (!b || locked) return;
    stop(); S.fn = b.dataset.fn; S.zoom = 1; addRow(); save(); paint();
  });
  $("#sx-p", host).addEventListener("input", function(e){ if (locked) { e.target.value = Pv(); return; } setP(+e.target.value); });
  $("#sx-zoom", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-z]"); if (!b || locked) return;
    var i = ZL.indexOf(S.zoom), to = b.dataset.z === "in" ? ZL[Math.min(ZL.length - 1, i + 1)] : b.dataset.z === "out" ? ZL[Math.max(0, i - 1)] : b.dataset.z === "max" ? 1000 : 1;
    stop(); zoomTo(to, b.dataset.z === "max" || b.dataset.z === "reset" ? 1400 : 450);
  });
  $("#sx-pins", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-pin]"); if (!b || locked) return;
    var list = pins().slice(), a = Pv(), k = list.indexOf(a);
    if (b.dataset.pin === "clear") list = []; else if (k >= 0) list.splice(k, 1); else list.push(a);
    S.pins[S.fn] = list.sort(function(p, q){ return p - q; }); save(); paint();
  });
  function setP(v){ var d = F().dom; v = Math.max(d[0], Math.min(d[1], Math.round(v))); if (v === Pv()) { paintCtl(); return; } stop(); S.P[S.fn] = v; addRow(); save(); paint(); }

  // ---- animation ----
  function slideTo(m, dur, cb){
    var from = hv(); S.mag = m; var to = hv();
    var geo = from !== 0 && to !== 0 && (from > 0) === (to > 0);
    anim = MV.tween({ dur:dur, step:function(t){ A.h = geo ? from * Math.pow(to / from, t) : from + (to - from) * t; draw(); },
      done:function(){ anim = null; A.h = null; addRow(); save(); paint(); if (cb) cb(); } });
  }
  function zoomTo(z, dur, cb){
    var from = A.zoom != null ? A.zoom : S.zoom; S.zoom = z;
    anim = MV.tween({ dur:dur, step:function(t){ A.zoom = from * Math.pow(z / from, t); draw(); paintRead(); },
      done:function(){ anim = null; A.zoom = null; save(); paint(); if (cb) cb(); } });
  }

  // ---- geometry ----
  function zoomNow(){ return A.zoom != null ? A.zoom : S.zoom; }
  function viewNow(){
    var Fn = F(), v0 = Fn.view; if (S.mode !== "zoom") return v0;
    var z = zoomNow(), a = Pv(), ya = Fn.f(a), hw = (v0.xmax - v0.xmin) / 2 / z, hh = (v0.ymax - v0.ymin) / 2 / z;
    return { xmin:a - hw, xmax:a + hw, ymin:ya - hh, ymax:ya + hh };
  }
  function ticks(lo, hi, n){ var s = MV.niceStep((hi - lo) / n), dp = Math.max(0, Math.ceil(-Math.log10(s) - 1e-9)); return { step:s, fmt:function(t){ return num(t, dp); } }; }
  function draw(){
    var Fn = F(), a = Pv(), ya = Fn.f(a), v = viewNow(), W = L.canvas.getBoundingClientRect().width || 600, pxu = W / (v.xmax - v.xmin);
    var sc = { view:v, lines:[], curves:[{ f:Fn.f, color:css("--pen"), width:3, domain:Fn.cdom }], points:[], labels:[] }, desc = "Graph of " + MV.plain(M(Fn.eq)) + ". ";
    var showTan = S.mode === "zoom" || tanOn(), est = Fn.d(a);
    if (S.mode === "zoom") {
      // the axes are off-screen when zoomed, so the y labels are drawn left-aligned inside the window instead of clipped at the edge
      var narrow = W < 420, yt = ticks(v.ymin, v.ymax, narrow ? 5 : 7);
      sc.xTicks = ticks(v.xmin, v.xmax, narrow ? 4 : 7); sc.yTicks = { step:yt.step, fmt:function(){ return ""; } };
      sc.after = function(ctx, pl){
        ctx.save(); ctx.font = "12px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
        for (var yy = Math.ceil(v.ymin / yt.step - 1e-9) * yt.step; yy <= v.ymax + 1e-9; yy += yt.step) {
          var Y = pl.Y(yy), s = yt.fmt(yy); if (Y < 10 || Y > pl.H - 24) continue;
          var w = ctx.measureText(s).width; ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(3, Y - 8, w + 6, 16); ctx.globalAlpha = 1;
          ctx.fillStyle = css("--ink-2"); ctx.fillText(s, 6, Y);
        }
        ctx.restore();
      };
    }
    if (showTan) {
      sc.lines.push({ p:[a, ya], q:[a + 1, ya + est], color:css("--ink"), width:2 });
      var left = (a - v.xmin) * pxu > 150;
      sc.labels.push({ x:a, y:ya, text:"slope ≈ " + MV.plain(rateS(Fn, a)), dx:left ? -16 : 16, dy:-22, align:left ? "right" : "left", bg:true });
    }
    if (S.mode === "sec") {
      var h = A.h != null ? A.h : hv(), q = a + h, q1 = S.cen ? a - h : a;
      if (Math.abs(h) > 1e-12) sc.lines.push({ p:[q1, Fn.f(q1)], q:[q, Fn.f(q)], color:css("--ink-2"), width:2 });
      pins().forEach(function(x){ sc.points.push({ x:x, y:Fn.f(x), r:5, color:css("--ink"), ring:true }); });
      sc.points.push({ x:a, y:ya, color:css("--ink"), r:5.5, label:"P" });
      var far = Math.abs(h) * pxu > 20;
      if (Math.abs(h) > 1e-12) {
        sc.points.push({ x:q, y:Fn.f(q), color:css("--ink-2"), r:5, label:far ? "Q" : "" });
        if (S.cen) sc.points.push({ x:q1, y:Fn.f(q1), color:css("--ink-2"), r:5, label:far ? "Q′" : "" });
      }
      desc += "P(" + fx(a) + ", " + MV.plain(valS(Fn, a)) + ")" + (A.h == null ? (h === 0 ? ". Q sits on P, so there is no secant." : (S.cen ? ", with Q′ and Q at " + fx(q1) + " and " + fx(q) : " and Q at " + fx(q)) + "; the secant slope is " + MV.plain(secSlope(secant(Fn, a, h, S.cen))) + ".") : ". Q is moving.");
    } else if (S.mode === "zoom") {
      sc.points.push({ x:a, y:ya, color:css("--ink"), r:5.5, label:"P" });
      desc += "Zoomed in ×" + Math.round(zoomNow()) + " around P(" + fx(a) + ", " + MV.plain(valS(Fn, a)) + "). " + (zoomNow() >= 16 ? "The curve looks almost straight and lies along its tangent." : "The curve still bends away from its tangent.");
    } else {
      var p2 = ab(), xa = p2[0], xb = p2[1];
      if (xa !== xb) sc.lines.push({ p:[xa, Fn.f(xa)], q:[xb, Fn.f(xb)], color:css("--ink-2"), width:2 });
      sc.points.push({ x:a, y:ya, color:css("--ink"), r:5, label:"P" });
      sc.points.push({ x:xa, y:Fn.f(xa), color:css("--ink-2"), r:6, ring:true, label:"A", below:true }, { x:xb, y:Fn.f(xb), color:css("--ink-2"), r:6, ring:true, label:"B", below:true });
      desc += "A at x = " + fx(xa) + " and B at x = " + fx(xb) + "; P at x = " + fx(a) + ".";
    }
    if (showTan) desc += " Tangent at P, slope about " + MV.plain(rateS(Fn, a)) + ".";
    sc.describe = desc;
    plot.draw(sc);
  }
  plot.render = draw;
  var drag = MV.drag(plot, {
    axis:"x", step:{ x:1, y:1 },
    handles:function(){
      var Fn = F();
      if (S.mode === "sec") return [{ id:"P", x:Pv(), y:Fn.f(Pv()), label:"Point P at " + Fn.v + " = " + fx(Pv()) + ". Arrow keys move it." }];
      if (S.mode === "ab") { var p2 = ab(); return [{ id:"A", x:p2[0], y:Fn.f(p2[0]), label:"Point A at " + Fn.v + " = " + fx(p2[0]) + ". Arrow keys move it by 0.5." }, { id:"B", x:p2[1], y:Fn.f(p2[1]), label:"Point B at " + Fn.v + " = " + fx(p2[1]) + ". Arrow keys move it by 0.5." }]; }
      return [];
    },
    key:function(id, e){
      var d = e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : 0; if (!d) return false;
      if (id === "P") setP(Pv() + d); else moveAB(id, ab()[id === "A" ? 0 : 1] + d * 0.5);
      var b = drag.buttons[id]; if (b) b.focus(); return true;
    },
    move:function(id, x){ if (locked) return; if (id === "P") setP(x); else moveAB(id, x); }
  });
  function moveAB(id, x){
    if (locked) return;
    var d = F().abDom, p2 = ab(); x = snapTo(x, 0.5, d[0], d[1]); var i = id === "A" ? 0 : 1; if (p2[i] === x) return;
    p2[i] = x; S.ab[S.fn] = p2; S.abm[S.fn] = true; save(); paint();
  }

  // ---- readout ----
  function pq(Fn, x){ return "(" + fx(x) + ", " + MV.plain(valS(Fn, x)) + ")"; }
  function paintRead(){
    var Fn = F(), a = Pv(), v = Fn.v, rowsR = [];
    if (S.mode === "sec") {
      var h = hv(), s = secant(Fn, a, h, S.cen);
      rowsR.push([M("P") + " and " + M("Q"), !s.ok ? M("P") + pq(Fn, a) + ": " + M("Q") + " sits on " + M("P") : S.cen ? M("Q′") + "(" + s.x1 + ", " + s.y1 + "), " + M("P") + pq(Fn, a) + ", " + M("Q") + "(" + s.x2 + ", " + s.y2 + ")" : M("P") + pq(Fn, a) + ", " + M("Q") + "(" + s.x2 + ", " + s.y2 + ")"]);
      rowsR.push(["Secant slope", s.arith]);
      var type = cur(), tr = nonzero().filter(function(r){ return r.c === type.c && (r.c || r.s === type.s); }).sort(function(p, q){ return parseFloat(q.m) - parseFloat(p.m); });
      if (tr.length >= 3) {
        var vals = tr.map(function(r){ return secSlope(secant(Fn, a, rowH(r), r.c)); }), small = parseFloat(tr[tr.length - 1].m) <= 0.01;
        rowsR.push(["Trend", "As " + M("h") + " shrinks: " + vals.join(", ") + " … " + (small ? "settling toward " + (Fn.c ? "" : "≈ ") + rateS(Fn, a) + "." : "keep shrinking " + M("h") + " to see where they settle.")]);
      }
    } else if (S.mode === "zoom") {
      var z = zoomNow(), vw = viewNow(), hw = (vw.xmax - vw.xmin) / 2, dp = Math.max(2, Math.ceil(-Math.log10(hw)) + 2);
      rowsR.push(["Zoom", "×" + Math.round(z) + ' <span class="muted">(window ' + M(v) + " from " + num(vw.xmin, dp) + " to " + num(vw.xmax, dp) + ")</span>"]);
      var w = secant(Fn, a, Math.round(hw * 1e6) / 1e6, true);
      rowsR.push(["Slope across the window", w.arith]);
      rowsR.push(["What you see", z >= 100 ? "The curve and its tangent are indistinguishable: the curve looks straight." : z >= 16 ? "The curve is almost straight now." : "The curve still bends away from its tangent. Keep zooming."]);
    } else {
      var p2 = ab(), sa = valS(Fn, p2[0]), sb = valS(Fn, p2[1]);
      rowsR.push([M("A") + " and " + M("B"), M("A") + "(" + fx(p2[0]) + ", " + sa + "), " + M("B") + "(" + fx(p2[1]) + ", " + sb + ")"]);
      if (p2[0] === p2[1]) rowsR.push(["Secant " + M("AB"), M("A") + " and " + M("B") + " are the same point: 0 ÷ 0 has no value."]);
      else {
        var mAB = Fn.c ? XQ.dec(XQ.div(XQ.sub(Fn.Pq(p2[1]), Fn.Pq(p2[0])), XQ.sub(p2[1], p2[0]))) : num((Fn.f(p2[1]) - Fn.f(p2[0])) / (p2[1] - p2[0]), 2);
        rowsR.push(["Secant " + M("AB") + " slope", "(" + sb + " − " + par(sa) + ") ÷ " + par(fx(p2[1] - p2[0])) + (Fn.c ? " = " : " ≈ ") + mAB]);
      }
      rowsR.push([M("P"), M("P") + pq(Fn, a)]);
    }
    if (S.mode !== "zoom") {
      if (estOn()) rowsR.push(["Estimate", "Instantaneous rate at " + M(v + " = " + fx(a)) + " ≈ " + rateS(Fn, a)]);
      else rowsR.push(["Estimate", '<span class="muted">Build the table: three rows, with ' + M("h") + " down to 0.01 or less.</span>"]);
      if (estOn() && Fn.ctx) rowsR.push(["Meaning", meaning(Fn, a)]);
    }
    if (pins().length) rowsR.push(["Pinned", M(v) + " = " + pins().map(function(x){ return fx(x); }).join(", ")]);
    L.read.innerHTML = MV.readoutHTML(rowsR);
  }
  function meaning(Fn, a){
    var r = Fn.d(a);
    if (Fn.ctx === "ball") {
      if (Math.abs(r) < 1e-9) return "At " + M("t") + " = " + fx(a) + " s the ball is at its peak: for an instant its height isn’t changing (about 0 m/s).";
      return "At " + M("t") + " = " + fx(a) + " s the ball is " + (r > 0 ? "rising" : "falling") + " at about " + fx(Math.abs(r)) + " m/s.";
    }
    return "At " + M("t") + " = " + fx(a) + " h the population is growing at about " + num(r, 1) + " bacteria per hour.";
  }
  function paintCtl(){
    var Fn = F(), d = Fn.dom, inp = $("#sx-p", host);
    MV.keepFocus($("#sx-fn", host), function(){ $("#sx-fn", host).innerHTML = FXO.map(function(k){ return '<button type="button" class="fchip" data-fn="' + k + '" data-k="fn' + k + '" aria-pressed="' + (S.fn === k) + '">' + MV.md(FX[k].chip) + "</button>"; }).join(""); });
    inp.min = d[0]; inp.max = d[1]; inp.value = Pv();
    $("#sx-plab", host).innerHTML = M("P") + " at " + M(Fn.v + " =");
    $("#sx-pout", host).textContent = fx(Pv());
    $("#sx-sec", host).hidden = S.mode !== "sec"; $("#sx-zoom", host).hidden = S.mode !== "zoom"; $("#sx-abnote", host).hidden = S.mode !== "ab";
    $("#sx-side", host).hidden = S.cen;
    segMode.set(S.mode); segGap.set(S.mag); segSide.set(String(S.side)); segCen.set(S.cen ? "on" : "off");
    var on = pins().indexOf(Pv()) >= 0;
    MV.keepFocus($("#sx-pins", host), function(){ $("#sx-pins", host).innerHTML = '<button type="button" class="btn ghost sm" data-pin="toggle" data-k="pint">' + (on ? "Unpin " : "Pin ") + M("P") + "</button>" + '<button type="button" class="btn ghost sm" data-pin="clear" data-k="pinc"' + (pins().length ? "" : " disabled") + ">Clear pins</button>"; });
    var zi = ZL.indexOf(S.zoom);
    $('[data-z="in"]', host).disabled = zi >= ZL.length - 1; $('[data-z="out"]', host).disabled = zi <= 0; $('[data-z="max"]', host).disabled = S.zoom === 1000; $('[data-z="reset"]', host).disabled = S.zoom === 1;
  }
  function paintTable(){
    var Fn = F(), list = sorted(), c = cur(), hi = -1;
    list.forEach(function(r, i){ if (same(r, c)) hi = i; });
    tbl.hidden = S.mode !== "sec";
    tbl.innerHTML = '<p class="tiny muted sx-tcap">Secant table at ' + M("P") + pq(Fn, Pv()) + "</p>" + secTable(Fn, Pv(), list.map(function(r){ return { h:rowH(r), cen:r.c }; }), hi, "Secant slopes from P");
  }
  function paint(){ L.cap.innerHTML = M(F().eq); paintCtl(); paintTable(); paintRead(); draw(); MV.changed(); }
  addRow(); paint();

  // ---- challenges ----
  function chal(id){
    if (id === "tc1") {
      if (S.fn !== "ball") return { ok:false, msg:"Choose the ball, " + M("h(t) = -5t^2 + 20t + 1") + ", first." };
      if (Pv() !== 1) return { ok:false, msg:MV.md("Put `P` at `t = 1`.") };
      if (S.cen) return { ok:false, msg:MV.md("Turn Centred off: this challenge is about the secant from `t = 1` to 1 + `h`.") };
      var h = hv(); if (h === 0) return { ok:false, msg:MV.md("With `h` = 0 there’s only one point: 0 ÷ 0 has no value. Choose a small gap instead.") };
      var d = Math.abs(5 * h);
      if (d <= 0.1 + 1e-9) return { ok:true };
      if (Math.abs(h) === 1) return { ok:false, msg:"That’s an average over a whole second." };
      return { ok:false, msg:num(d) + " away. Shrink " + M("h") + "." };
    }
    if (id === "tc2") {
      var p = (S.pins.cube || []).slice().sort(function(x, y){ return x - y; }), j = p.join(",");
      if (j === "-2,2") return { ok:true };
      if (!p.length) return { ok:false, msg:MV.md("Choose `y = x^3`, move `P` to each whole number from −2 to 2, and press <strong>Pin P</strong> where the slopes settle on 12.") };
      if (p.indexOf(0) >= 0) return { ok:false, msg:"At 0 the curve is level: rate 0." };
      if (p.indexOf(1) >= 0 || p.indexOf(-1) >= 0) return { ok:false, msg:MV.md("At `x = 1` and `x = -1` the slopes settle on 3, not 12.") };
      if (j === "2" || j === "-2") return { ok:false, msg:MV.md("`y = x^3` is odd: its graph has half-turn symmetry, so the slope at −2 matches the slope at 2.") };
      return { ok:false, msg:"Check each pin with the secant table: only the whole numbers where the slopes settle on 12 count." };
    }
    if (id === "tc3") {
      if (S.fn !== "vtx") return { ok:false, msg:MV.md("Choose `y = x^2 - 4x` first.") };
      if (Pv() !== 2) return { ok:false, msg:"Find where the tangent is horizontal: the vertex." };
      var p2 = ab();
      if (!S.abm.vtx) return { ok:false, msg:MV.md("`P` is in place. Now switch to <strong>A and B</strong> mode and place `A` and `B`.") };
      if (p2[0] === 2 || p2[1] === 2) return { ok:false, msg:MV.md("Neither `A` nor `B` may sit at `P`.") };
      if (p2[0] + p2[1] === 4 && p2[0] !== p2[1]) return { ok:true };
      return { ok:false, msg:"Equal heights need equal distances from the vertex." };
    }
    return { ok:false };
  }

  // ---- predictions ----
  function applyStart(st){
    stop(); S.fn = st.fn; S.P[st.fn] = st.P; S.mag = st.mag; S.side = st.side || 1; S.cen = !!st.cen; S.mode = st.mode || "sec"; S.zoom = st.zoom || 1;
    if (st.rows) S.rows[key()] = st.rows.map(function(m){ return norm({ m:m, s:S.side, c:S.cen }); });
    addRow(); save(); paint();
  }
  return {
    predict:{
      start:function(p){ locked = false; applyStart(p.start); locked = true; },
      run:function(p, done){
        var fin = function(){ locked = false; paint(); done(); };
        if (p.id === "p1") slideTo("0.1", 1100, function(){ MV.wait(500, function(){ slideTo("0.01", 1100, function(){ MV.wait(400, fin); }); }); });
        else if (p.id === "p2") slideTo("0", 1300, function(){ MV.wait(400, fin); });
        else if (p.id === "p3") zoomTo(1000, 2800, function(){ MV.wait(300, fin); });
        else if (p.id === "p4") slideTo("0.1", 1200, function(){ MV.wait(400, fin); });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// @component N27 linkedPanels — two or three graphs stacked on one shared x-axis with a probe line through all of them
// var lp = linkedPanels(host, { xmin, xmax, lo, hi, step:0.1, x,           // shared x-window, probe range and keyboard step
//   panels:[{ cls:"plot", aria:"…", scene:function(plot, x){ return scene; } }],  // panel 0 carries the draggable probe point
//   probeY:function(x){ return y on panel 0 }, label:function(x){ return aria text },
//   onMove:function(x, how){} })                                               // how: "drag" | "key" | "tap" | "set"
//   -> { get(), set(x, how), render(), plots }
function linkedPanels(host, o){
  host.innerHTML = o.panels.map(function(p){ return '<div class="plot-wrap lp-panel"><canvas class="' + (p.cls || "plot") + '" role="img" aria-label="' + MV.esc(p.aria || "") + '"></canvas></div>'; }).join("");
  var cv = $$("canvas", host), x = o.x, plots = cv.map(function(c){ return new MV.Plot(c, { xmin:o.xmin, xmax:o.xmax, ymin:-1, ymax:1 }); });
  function snap(v){ return snapTo(v, o.step, o.lo, o.hi); }
  function probe(ctx, p){
    var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
  }
  var busy = false;
  function render(){
    if (busy) return; busy = true;
    try { plots.forEach(function(p, i){ var sc = o.panels[i].scene(p, x), after = sc.after; sc.after = function(ctx, pl){ probe(ctx, pl); if (after) after(ctx, pl); }; p.draw(sc); }); }
    finally { busy = false; }
  }
  plots.forEach(function(p){ p.render = render; });
  function set(v, how){ v = snap(v); if (v === x && how !== "set") return; x = v; render(); if (o.onMove) o.onMove(x, how); }
  var dr = MV.drag(plots[0], { axis:"x", step:{ x:o.step, y:o.step }, big:5,
    handles:function(){ return [{ id:"probe", x:x, y:o.probeY(x), label:o.label(x) }]; },
    move:function(id, nx, ny, how){ set(nx, how === "key" ? "key" : "drag"); } });
  plots.forEach(function(p){
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
    p.c.addEventListener("pointerdown", function(e){ if (e.defaultPrevented) return; active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {} set(at(e), "tap"); });
    p.c.addEventListener("pointermove", function(e){ if (active) set(at(e), "drag"); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  });
  return { get:function(){ return x; }, set:set, render:render, plots:plots, focus:function(){ dr.focus("probe"); } };
}

// ---------- Part 3: sign of the rate ----------
var R3 = [
  mkF({ c:[0, -3, 0, 1], v:"x", fn:"f", lo:-2.5, hi:2.5, x0:-2, view:{ xmin:-2.7, xmax:2.7, ymin:-5.2, ymax:5.2 }, tv:{ ymin:-6, ymax:19 },
    keys:[{ x:-Math.sqrt(3), l:"−√3" }, { x:-1, l:"−1" }, { x:0, l:"0" }, { x:1, l:"1" }, { x:Math.sqrt(3), l:"√3" }] }),
  mkF({ c:[0, 0, 0, -4, 1], v:"x", fn:"g", lo:-1.5, hi:4.5, x0:-1, view:{ xmin:-1.7, xmax:4.7, ymin:-32, ymax:22 }, tv:{ ymin:-45, ymax:45 },
    keys:[{ x:0, l:"0" }, { x:3, l:"3" }, { x:4, l:"4" }] }),
  mkF({ c:[0, 0, 30, -2], v:"t", fn:"s", lo:0, hi:10, x0:2, ends:true, cdom:[0, 10], view:{ xmin:-1.7, xmax:10.7, ymin:-90, ymax:1130 }, tv:{ ymin:-25, ymax:170 },
    keys:[{ x:0, l:"0" }, { x:5, l:"5" }, { x:10, l:"10" }], xLabel:"t (min)", yLabel:"s (m)" })
];
function sgn(v){ return Math.abs(v) < 1e-9 ? 0 : v > 0 ? 1 : -1; }
function stretchesOf(R){
  var ks = R.keys, out = [];
  var b = R.ends ? ks : [{ x:-Infinity, l:MINUS + "∞" }].concat(ks, [{ x:Infinity, l:"∞" }]);
  for (var i = 0; i + 1 < b.length; i++) {
    var lo = b[i], hi = b[i + 1], mid = !isFinite(lo.x) ? hi.x - 1 : !isFinite(hi.x) ? lo.x + 1 : (lo.x + hi.x) / 2;
    out.push({ a:lo, b:hi, ai:R.ends ? i : i - 1, bi:R.ends ? i + 1 : i, rate:sgn(R.d(mid)), val:sgn(R.f(mid)) });
  }
  return out;
}
function part3(host, api){
  var S = api.S, C = api.content; S.r = S.r || 0; S.x = S.x || {}; S.vis = S.vis || {}; S.mk = S.mk || {}; S.ok = S.ok || {}; S.tries = S.tries || {};
  host.innerHTML = '<div class="chips" id="sg-r" role="group" aria-label="Choose a round"></div><p class="eq-cap" id="sg-eq"></p><p class="tiny muted" id="sg-note" style="margin-top:-2px"></p>' +
    '<div class="sym"><div><div id="sg-panels"></div><p class="tiny muted" style="margin:6px 0 0">Top: the graph and its tangent. Bottom: the slope tracker (tangent slope at each point you’ve visited) with its 0 line.</p></div>' +
    '<div><dl class="read" id="sg-read" aria-live="polite"></dl><div class="q-actions"><button type="button" class="btn ghost sm" id="sg-sweep">Sweep the whole curve</button><button type="button" class="btn ghost sm" id="sg-clr">Clear the tracker</button></div>' +
    '<details class="alg" id="sg-alg"><summary>Check it with algebra</summary><div id="sg-algb"></div></details></div></div>' +
    '<div class="part sg-mark"><h3>Mark the rate</h3><p class="tiny muted">Tap a stretch of the axis to cycle its mark: <strong>+</strong> (rate positive), <strong>−</strong> (rate negative), blank. Tap a split point to mark it <strong>0</strong> (rate zero).</p>' +
    '<div class="sg-strip" id="sg-strip" role="group" aria-label="Axis strip"></div><div class="sg-lines" id="sg-lines" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="sg-check">Check</button><button type="button" class="btn ghost sm" id="sg-reset">Clear marks</button></div><div id="sg-fb" aria-live="polite"></div></div>';
  var lp = null, sweepStop = null, fbMsg = null;
  function R(){ return R3[S.r]; }
  function rid(){ return "r" + (S.r + 1); }
  function px(){ var v = S.x[rid()]; return v == null ? R().x0 : v; }
  function vis(){ return S.vis[rid()] || (S.vis[rid()] = []); }
  function marks(){ var m = S.mk[rid()]; if (!m) { m = S.mk[rid()] = { st:stretchesOf(R()).map(function(){ return 0; }), z:{} }; } return m; }
  function visit(x){ var k = Math.round(x * 10), V = vis(); if (V.indexOf(k) < 0) V.push(k); }
  function build(){
    var Rr = R(), t = Rr.tv;
    if (sweepStop) { sweepStop(); sweepStop = null; }
    lp = linkedPanels($("#sg-panels", host), { xmin:Rr.view.xmin, xmax:Rr.view.xmax, lo:Rr.lo, hi:Rr.hi, step:0.1, x:px(),
      panels:[
        { cls:"plot", aria:"Graph with a tangent you can slide", scene:function(p, x){
          var y = Rr.f(x), m = Rr.d(x), left = (x - Rr.view.xmin) / (Rr.view.xmax - Rr.view.xmin) > 0.45;
          return { view:Rr.view, xLabel:Rr.xLabel, yLabel:Rr.yLabel, curves:[{ f:Rr.f, color:css("--pen"), width:3, domain:Rr.cdom, arrows:!Rr.ends }],
            lines:[{ p:[x, y], q:[x + 1, y + m], color:css("--ink"), width:2 }], points:[{ x:x, y:y, r:6.5, color:css("--ink"), ring:true }],
            labels:[{ x:x, y:y, text:"slope ≈ " + num(m, 2), dx:left ? -14 : 14, dy:-22, align:left ? "right" : "left", bg:true }],
            describe:"Graph of " + plainEq() + " with the tangent at (" + num(x, 2) + ", " + num(y, 3) + "), slope about " + num(m, 2) + ": " + word(m) + "." }; } },
        { cls:"plot half", aria:"Slope tracker", scene:function(p, x){
          var pts = vis().map(function(k){ var xx = k / 10; return { x:xx, y:Rr.d(xx), r:3.2, color:css("--pen") }; });
          pts.push({ x:x, y:Rr.d(x), r:5.5, color:css("--pen"), ring:true });
          return { view:{ xmin:Rr.view.xmin, xmax:Rr.view.xmax, ymin:t.ymin, ymax:t.ymax }, yLabel:"slope", points:pts,
            labels:[{ x:Rr.view.xmax, y:0, text:"0 line", dx:-6, dy:-10, align:"right", font:"600 12px " + (css("--font-ui") || "sans-serif"), color:css("--ink-2") }],
            describe:"Slope tracker with " + vis().length + " dots. At " + Rr.v + " = " + num(x, 2) + " the slope is about " + num(Rr.d(x), 2) + ", " + (sgn(Rr.d(x)) > 0 ? "above" : sgn(Rr.d(x)) < 0 ? "below" : "on") + " the 0 line." }; } }
      ],
      probeY:function(x){ return Rr.f(x); }, label:function(x){ return "Tangent point at " + Rr.v + " = " + num(x, 2) + ", slope about " + num(Rr.d(x), 2) + ". Arrow keys move it by 0.1."; },
      onMove:function(x){ S.x[rid()] = x; visit(x); api.save(); paintRead(); }
    });
    visit(px()); lp.render();
  }
  function plainEq(){ return S.r === 2 ? "the walker’s distance" : MV.plain(C.rounds[S.r].eq); }
  function word(m){ return sgn(m) > 0 ? "rising" : sgn(m) < 0 ? "falling" : "level"; }
  function paintRead(){
    var Rr = R(), x = lp ? lp.get() : px(), y = XQ.dec(Rr.Pq(x)), m = Rr.d(x), v = Rr.v, fn = Rr.fn;
    $("#sg-read", host).innerHTML = MV.readoutHTML([
      ["Tangent at", M(v + " = " + num(x, 2))],
      ["Value", M(fn + "(" + num(x, 2) + ")") + " = " + y + ' <span class="muted">(' + (sgn(Rr.f(x)) > 0 ? "positive: above the axis" : sgn(Rr.f(x)) < 0 ? "negative: below the axis" : "zero: on the axis") + ")</span>"],
      ["Rate", "slope ≈ " + XQ.dec(Rr.Dq(x)) + ' <span class="muted">(' + (sgn(m) > 0 ? "positive: rising" : sgn(m) < 0 ? "negative: falling" : "zero: level") + ")</span>"]
    ]);
    var list = [{ h:0.1, cen:false }, { h:0.01, cen:false }, { h:0.1, cen:true }, { h:0.01, cen:true }], d = XQ.dec(Rr.Dq(x)), s = sgn(m);
    $("#sg-algb", host).innerHTML = '<p style="margin:10px 0 6px">Secant slopes from ' + M(v + " = " + num(x, 2)) + ":</p>" + secTable(Rr, x, list, -1, "Secant slopes at the tangent point") +
      '<p style="margin:8px 0 0">Settling toward ' + d + (s > 0 ? ", positive: rising." : s < 0 ? ", negative: falling." : ": level.") + "</p>";
  }
  function stLabel(st){ return st.a.l + " to " + st.b.l; }
  function lines(){
    var Rr = R(), sts = stretchesOf(Rr), mk = marks(), out = {};
    [1, -1].forEach(function(s){
      var ps = [], curP = null;
      sts.forEach(function(st, i){
        if (mk.st[i] !== s) { curP = null; return; }
        if (curP && curP.bi === st.ai && !mk.z[st.ai]) { curP.b = st.b; curP.bi = st.bi; }
        else { curP = { a:st.a, b:st.b, ai:st.ai, bi:st.bi }; ps.push(curP); }
      });
      out[s] = ps.length ? M(ps.map(function(p){ return "(" + p.a.l + ", " + p.b.l + ")"; }).join(" ∪ ")) : '<span class="muted">nothing marked</span>';
    });
    var zs = Rr.keys.filter(function(k, i){ return mk.z[i]; }).map(function(k){ return k.l; });
    out[0] = zs.length ? M(Rr.v + " = " + zs.join(", ")) : '<span class="muted">nothing marked</span>';
    return out;
  }
  function paintStrip(){
    var Rr = R(), sts = stretchesOf(Rr), mk = marks(), solved = !!S.ok[rid()], h = "";
    function pt(i){ var k = Rr.keys[i], on = !!mk.z[i]; return '<button type="button" class="sg-pt' + (on ? " on" : "") + '" data-pt="' + i + '" data-k="sgp' + i + '" aria-label="' + Rr.v + " = " + MV.esc(k.l) + ": " + (on ? "marked rate 0" : "not marked") + '"' + (solved ? " disabled" : "") + "><span>" + k.l + "</span><b aria-hidden=\"true\">" + (on ? "0" : "·") + "</b></button>"; }
    sts.forEach(function(st, i){
      if (i === 0 && Rr.ends) h += pt(st.ai);
      var m = mk.st[i], g = m > 0 ? "+" : m < 0 ? MINUS : "";
      h += '<button type="button" class="sg-st' + (m ? " on" : "") + '" data-st="' + i + '" data-k="sgs' + i + '" aria-label="' + Rr.v + " from " + MV.esc(stLabel(st)) + ": " + (m > 0 ? "marked rate positive" : m < 0 ? "marked rate negative" : "not marked") + '"' + (solved ? " disabled" : "") + '><span class="sg-l">' + stLabel(st) + '</span><b aria-hidden="true">' + (g || "&nbsp;") + "</b></button>";
      if (st.bi < Rr.keys.length) h += pt(st.bi);
    });
    MV.keepFocus($("#sg-strip", host), function(){ $("#sg-strip", host).innerHTML = h; });
    var L = lines();
    $("#sg-lines", host).innerHTML = "<p>Rate positive: " + L[1] + "</p><p>Rate negative: " + L[-1] + "</p><p>Rate zero: " + L[0] + "</p>";
    $("#sg-check", host).disabled = solved; $("#sg-reset", host).disabled = solved;
    var fb = $("#sg-fb", host), rd = C.rounds[S.r];
    if (solved) fb.innerHTML = '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + rd.why + "</p></div>";
    else fb.innerHTML = fbMsg ? '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + fbMsg.join(" ") + " Try again.</p></div>" : "";
  }
  function judge(){
    var Rr = R(), rd = C.rounds[S.r], sts = stretchesOf(Rr), mk = marks(), msg = [];
    function add(m){ if (msg.indexOf(m) < 0) msg.push(m); }
    var sw = { "1":"positive", "-1":"negative", "0":"0" };
    if (S.r === 1 && (mk.st[0] === 1 || mk.st[1] === 1)) add(rd.special);
    if (S.r === 2 && mk.st.some(function(m){ return m === -1; })) add(rd.special);
    sts.forEach(function(st, i){ var m = mk.st[i]; if (m && m !== st.rate && st.val === m) add(rd.value.replace("{sign}", sw[m])); });
    Rr.keys.forEach(function(k, i){ if (mk.z[i] && Math.abs(Rr.d(k.x)) > 1e-9 && Math.abs(Rr.f(k.x)) < 1e-9) add(rd.value.replace("{sign}", "0")); });
    sts.forEach(function(st, i){
      var m = mk.st[i]; if (m === st.rate) return;
      if (!m) add("Mark every stretch: " + M(Rr.v) + " from " + stLabel(st) + " has no mark yet.");
      else add("Look again from " + stLabel(st) + ": is the tangent rising or falling there?");
    });
    var crit = Rr.keys.map(function(k){ return Math.abs(Rr.d(k.x)) < 1e-9; });
    if (crit.some(function(c, i){ return c && !mk.z[i]; })) add("Look for every point where the tangent is horizontal: the tracker touches its 0 line there. You’ve missed at least one.");
    Rr.keys.forEach(function(k, i){ if (mk.z[i] && !crit[i] && Math.abs(Rr.f(k.x)) > 1e-9) add("At " + M(Rr.v + " = " + k.l) + " the tangent isn’t horizontal, so the rate isn’t 0."); });
    return msg.slice(0, 3);
  }
  function paintRounds(){
    MV.keepFocus($("#sg-r", host), function(){ $("#sg-r", host).innerHTML = C.rounds.map(function(r, i){ return '<button type="button" class="chip' + (i === S.r ? " on" : "") + '" data-r="' + i + '" data-k="sgr' + i + '" aria-pressed="' + (i === S.r) + '">' + (S.ok["r" + (i + 1)] ? "✓ " : "") + r.name + "</button>"; }).join(""); });
    $("#sg-eq", host).innerHTML = C.rounds[S.r].eq; $("#sg-note", host).innerHTML = C.rounds[S.r].note;
  }
  function all(){ paintRounds(); paintStrip(); paintRead(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var mk = marks();
    if (b.dataset.r != null) { S.r = +b.dataset.r; fbMsg = null; api.save(); build(); all(); return; }
    if (b.dataset.st != null) { var i = +b.dataset.st; mk.st[i] = mk.st[i] === 0 ? 1 : mk.st[i] === 1 ? -1 : 0; fbMsg = null; }
    else if (b.dataset.pt != null) { var k = b.dataset.pt; if (mk.z[k]) delete mk.z[k]; else mk.z[k] = true; fbMsg = null; }
    else if (b.id === "sg-reset") { delete S.mk[rid()]; fbMsg = null; }
    else if (b.id === "sg-check") {
      var m = judge();
      if (!m.length) { S.ok[rid()] = true; fbMsg = null; } else { S.tries[rid()] = (S.tries[rid()] || 0) + 1; fbMsg = m; }
      api.save(); paintRounds(); paintStrip(); MV.focusFb($(".sg-mark", host)); return;
    } else if (b.id === "sg-sweep") { sweep(); return; }
    else if (b.id === "sg-clr") { S.vis[rid()] = []; visit(lp.get()); api.save(); lp.render(); return; }
    else return;
    api.save(); paintStrip();
  });
  function sweep(){
    var Rr = R();
    if (sweepStop) { sweepStop(); sweepStop = null; }
    if (MV.reduceMotion) { for (var x = Rr.lo; x <= Rr.hi + 1e-9; x += 0.1) visit(x); api.save(); lp.render(); return; }
    sweepStop = MV.tween({ dur:3200, ease:function(t){ return t; }, step:function(t){ lp.set(Rr.lo + (Rr.hi - Rr.lo) * t, "drag"); }, done:function(){ sweepStop = null; } });
  }
  build(); all();
  return {};
}

// ---------- Practice 1: tap the point ----------
var TG = {
  cubic:mkF({ c:[0, -3, 0, 1], v:"x", lo:-2.5, hi:2.5, x0:0, view:{ xmin:-2.7, xmax:2.7, ymin:-5, ymax:5 } }),
  ball:mkF({ c:[1, 20, -5], v:"t", lo:0, hi:4, x0:0.5, cdom:[0, 4.05], view:{ xmin:-0.4, xmax:4.5, ymin:-2, ymax:25 }, xLabel:"t (s)", yLabel:"h (m)" }),
  square:mkF({ c:[0, 0, 1], v:"x", lo:0, hi:4, x0:0.5, cdom:[0, 4], sec:[0, 4], view:{ xmin:-0.5, xmax:4.5, ymin:-1.5, ymax:17.5 } }),
  walker:mkF({ c:[0, 0, 30, -2], v:"t", lo:0, hi:10, x0:1, cdom:[0, 10], view:{ xmin:-1.6, xmax:10.6, ymin:-70, ymax:1100 }, xLabel:"t (min)", yLabel:"s (m)" }),
  hill:mkF({ c:[0, 6, -1], v:"x", lo:-0.5, hi:6.5, x0:1, view:{ xmin:-0.8, xmax:6.8, ymin:-2.5, ymax:11 } }),
  cube:mkF({ c:[0, 0, 0, 1], v:"x", lo:-2.2, hi:2.2, x0:0, view:{ xmin:-2.4, xmax:2.4, ymin:-10, ymax:10 } })
};
// @component N8 tapPoint — tap a point on a graph (or move a probe with the arrow keys); answers accepted within a set distance of x; tangent tool at the tap
function tapAct(host, api, a){
  var S = api.S; S.i = Math.min(S.i || 0, a.items.length - 1); S.items = S.items || {};
  var TOL = 0.15, msg = {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="tp-n"></span><span class="dots" id="tp-dots" aria-hidden="true"></span></div>' +
    '<p class="pred-q" id="tp-q"></p><div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="tp-plot" role="img" aria-label="Graph for this question"></canvas></div></div>' +
    '<div><dl class="read" id="tp-read" aria-live="polite"></dl><div class="q-actions" id="tp-mk"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="tp-check" data-k="tpchk">Check</button><span id="tp-hint"></span></div><div id="tp-hints"></div><div id="tp-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="tp-prev" data-k="tpprev">Previous</button><button type="button" class="btn ghost sm" id="tp-next" data-k="tpnext">Next graph</button></div></div></div>';
  var plot = new MV.Plot($("#tp-plot", host), TG.cubic.view);
  function it(){ return a.items[S.i]; }
  function G(){ return TG[it().g]; }
  function ist(){ var q = it(); return S.items[q.id] || (S.items[q.id] = { x:G().x0, marks:[], moved:false, tries:0, hint:0, solved:false, first:null }); }
  function draw(){
    var g = G(), x = ist(), y = g.f(x.x), m = g.d(x.x), left = (x.x - g.view.xmin) / (g.view.xmax - g.view.xmin) > 0.45;
    var sc = { view:g.view, xLabel:g.xLabel, yLabel:g.yLabel, curves:[{ f:g.f, color:css("--pen"), width:3, domain:g.cdom, arrows:!g.cdom }], lines:[], points:[], labels:[], segments:[] };
    if (g.sec) sc.segments.push({ x1:g.sec[0], y1:g.f(g.sec[0]), x2:g.sec[1], y2:g.f(g.sec[1]), color:css("--ink-2"), width:2 });
    sc.lines.push({ p:[x.x, y], q:[x.x + 1, y + m], color:css("--ink"), width:2 });
    (it().multi ? x.marks : []).forEach(function(v){ sc.points.push({ x:v, y:g.f(v), r:7, open:true, color:css("--ink") }); });
    sc.points.push({ x:x.x, y:y, r:6, color:css("--ink"), ring:true });
    sc.labels.push({ x:x.x, y:y, text:"slope ≈ " + num(m, 2), dx:left ? -14 : 14, dy:-22, align:left ? "right" : "left", bg:true });
    sc.describe = MV.plain(it().prompt) + " Tangent tool at " + g.v + " = " + num(x.x, 2) + ", slope about " + num(m, 2) + "." + (it().multi && x.marks.length ? " Marked: " + x.marks.map(function(v){ return num(v, 2); }).join(", ") + "." : "");
    plot.draw(sc);
  }
  plot.render = draw;
  var drag = MV.drag(plot, { axis:"x", step:{ x:0.1, y:0.1 }, big:5,
    handles:function(){ var g = G(), x = ist(); return [{ id:"tp", x:x.x, y:g.f(x.x), label:"Tangent tool at " + g.v + " = " + num(x.x, 2) + ". Arrow keys move it by 0.1" + (it().multi ? "; press M to mark this point." : ".") }]; },
    key:function(id, e){ if ((e.key === "m" || e.key === "M") && it().multi) { toggleMark(ist().x); return true; } return false; },
    move:function(id, nx, ny, how){ setX(nx, how === "key" ? 0.1 : 0.05); } });
  plot.c.addEventListener("pointerdown", function(e){
    if (e.defaultPrevented || ist().solved) return;
    var r = plot.c.getBoundingClientRect(), g = G(), v = snapTo(plot.xOf(e.clientX - r.left), 0.05, g.lo, g.hi);
    setX(v, 0.05); if (it().multi) toggleMark(v);
  });
  function setX(v, step){ var g = G(), x = ist(); if (x.solved) return; v = snapTo(v, step || 0.05, g.lo, g.hi); x.x = v; x.moved = true; api.save(); draw(); paintRead(); paintBtns(); }
  function toggleMark(v){
    var x = ist(); if (x.solved) return;
    var k = -1; x.marks.forEach(function(m, i){ if (Math.abs(m - v) <= TOL) k = i; });
    if (k >= 0) x.marks.splice(k, 1); else if (x.marks.length < 4) x.marks.push(v);
    x.marks.sort(function(p, q){ return p - q; }); msg[it().id] = null; api.save(); draw(); paintRead(); paintBtns(); paintFb();
  }
  function paintRead(){
    var g = G(), x = ist(), rows = [["Tangent tool", "At " + M(g.v + " = " + num(x.x, 2)) + ": slope ≈ " + num(g.d(x.x), 2)]];
    if (it().multi) rows.push(["Your points", x.marks.length ? M(g.v + " = " + x.marks.map(function(v){ return num(v, 2); }).join(", ")) : '<span class="muted">none yet: tap the graph</span>']);
    $("#tp-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintBtns(){
    var q = it(), x = ist();
    MV.keepFocus($("#tp-mk", host), function(){ $("#tp-mk", host).innerHTML = q.multi && !x.solved ? '<button type="button" class="btn ghost sm" data-mk="add" data-k="tpmk">' + (x.marks.some(function(m){ return Math.abs(m - x.x) <= TOL; }) ? "Unmark this point" : "Mark this point") + '</button><button type="button" class="btn ghost sm" data-mk="clear" data-k="tpclr"' + (x.marks.length ? "" : " disabled") + ">Clear marks</button>" : ""; });
    $("#tp-check", host).disabled = x.solved || (q.multi ? !x.marks.length : !x.moved);
  }
  function paintFb(){
    var q = it(), x = ist();
    $("#tp-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("tph" + q.id, x.hint);
    $("#tp-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(q.hints, x.hint);
    $("#tp-fb", host).innerHTML = x.solved ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + q.why + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : (msg[q.id] ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg[q.id] + " Try again.") : "");
  }
  function paint(){
    var q = it();
    $("#tp-n", host).textContent = "Graph " + (S.i + 1) + " of " + a.items.length;
    $("#tp-dots", host).innerHTML = a.items.map(function(z, i){ var y = S.items[z.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#tp-q", host).innerHTML = q.prompt;
    $("#tp-prev", host).disabled = S.i === 0; $("#tp-next", host).disabled = S.i === a.items.length - 1;
    draw(); paintRead(); paintBtns(); paintFb();
  }
  function judge(){
    var q = it(), g = G(), x = ist(), ans = MV.ans(q), pts = q.multi ? x.marks : [x.x];
    var near = function(v){ return ans.some(function(t){ return Math.abs(v - t) <= TOL + 1e-9; }); };
    var wrong = pts.filter(function(v){ return !near(v); });
    if (q.high && pts.some(function(v){ return v >= g.hi - TOL; })) return { ok:false, msg:q.high };
    if (wrong.length) return { ok:false, msg:a.wrongTap.replace("{v}", M(g.v)).replace("{x}", num(wrong[0], 2)).replace("{m}", num(g.d(wrong[0]), 2)) };
    var all = ans.every(function(t){ return pts.some(function(v){ return Math.abs(v - t) <= TOL + 1e-9; }); });
    if (!all) return { ok:false, msg:a.missing };
    return { ok:true };
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = it(), x = ist();
    if (b.id === "tp-prev" || b.id === "tp-next") { S.i += b.id === "tp-prev" ? -1 : 1; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintFb(); return; }
    if (b.dataset.mk === "add") { toggleMark(x.x); return; }
    if (b.dataset.mk === "clear") { x.marks = []; msg[q.id] = null; api.save(); draw(); paintRead(); paintBtns(); paintFb(); return; }
    if (b.id === "tp-check") {
      var r = judge();
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[q.id] = null; }
      else { x.tries++; msg[q.id] = r.msg; }
      api.save(); paint(); MV.focusFb(host);
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(q){ var y = S.items[q.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(q){ var y = S.items[q.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(q.goal)); }); return g; }
  };
}

// ---------- Performance task: design the ramp ----------
function rampEq(a, b, c){
  var s = "y = " + (a === 1 ? "" : a === -1 ? "-" : String(a)) + "x^2";
  if (b) s += (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x";
  if (c) s += (c < 0 ? " - " : " + ") + Math.abs(c);
  return s;
}
var task = (function(){
  var api, plot, drag, T;
  function read(){ var s = api ? api.S : {}; return { a:s.a == null ? 1 : s.a, b:s.b == null ? 1 : s.b, c:s.c == null ? 0 : s.c, x:s.x == null ? 3 : s.x }; }
  function f(d, x){ return d.a * x * x + d.b * x + d.c; }
  function rate(d, x){ return XQ.dec(XQ.add(XQ.mul(XQ.mul(2, d.a), x), d.b)); }
  function draw(){
    var d = read(), lo = Infinity, hi = -Infinity;
    for (var i = 0; i <= 80; i++) { var y = f(d, i / 20); lo = Math.min(lo, y); hi = Math.max(hi, y); }
    var span = Math.max(4, hi - lo), pad = span * 0.18, v = { xmin:-0.45, xmax:4.45, ymin:lo - pad, ymax:hi + pad }, m = 2 * d.a * d.x + d.b, y0 = f(d, d.x);
    var left = d.x > 2;
    plot.draw({ view:v, curves:[{ f:function(x){ return f(d, x); }, color:css("--pen"), width:3.2, domain:[0, 4] }],
      segments:[{ x1:0, y1:f(d, 0), x2:4, y2:f(d, 4), color:css("--ink-2"), width:2 }], lines:[{ p:[d.x, y0], q:[d.x + 1, y0 + m], color:css("--ink"), width:2 }],
      points:[{ x:0, y:f(d, 0), r:4.5, color:css("--ink-2") }, { x:4, y:f(d, 4), r:4.5, color:css("--ink-2") }, { x:d.x, y:y0, r:6, color:css("--ink"), ring:true }],
      labels:[{ x:d.x, y:y0, text:"slope = " + MV.plain(rate(d, d.x)), dx:left ? -14 : 14, dy:-22, align:left ? "right" : "left", bg:true }],
      describe:"Ramp " + MV.plain(M(rampEq(d.a, d.b, d.c))) + " for x from 0 to 4, with the secant from x = 0 to x = 4 and the tangent at x = " + num(d.x) + ", slope " + MV.plain(rate(d, d.x)) + "." });
  }
  function paintRead(){
    var d = read(), f0 = XQ.add(XQ.of(d.c), 0), f4 = XQ.add(XQ.add(XQ.mul(16, d.a), XQ.mul(4, d.b)), d.c), avg = XQ.div(XQ.sub(f4, f0), 4);
    $("#rp-eq").innerHTML = M(rampEq(d.a, d.b, d.c));
    $("#rp-read").innerHTML = MV.readoutHTML([
      ["Tangent tool", "At " + M("x = " + num(d.x)) + " the rate is " + rate(d, d.x) + '<br><span class="tiny muted">Drag the point or tap the graph; arrow keys move it by 0.1.</span>'],
      ["Average rate on [0, 4]", "(" + XQ.dec(f4) + " − " + par(XQ.dec(f0)) + ") ÷ 4 = " + XQ.dec(avg)]
    ]);
  }
  function upd(){ draw(); paintRead(); if (api) api.update(); }
  return {
    render:function(inp, pv, A){
      api = A; T = A.content; var d = read();
      inp.innerHTML = '<div id="rp-sl" class="rp-sl"></div><p class="eq-cap" id="rp-eq" aria-live="polite"></p>';
      MV.sliders($("#rp-sl"), [
        { id:"a", label:M("a") + ' <span class="tiny muted">(steps of 0.25, not 0)</span>', min:-3, max:3, step:0.25, value:d.a, skip:[0], fmt:function(v){ return num(v); } },
        { id:"b", label:M("b"), min:-10, max:10, step:1, value:d.b, fmt:function(v){ return num(v); } },
        { id:"c", label:M("c"), min:-10, max:10, step:1, value:d.c, fmt:function(v){ return num(v); } }
      ], function(id, v){ A.S[id] = v; A.save(); upd(); });
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot square" id="rp-plot" role="img" aria-label="Your ramp"></canvas></div><dl class="read" id="rp-read" aria-live="polite" style="margin-top:12px"></dl>';
      plot = new MV.Plot($("#rp-plot"), { xmin:-0.45, xmax:4.45, ymin:-5, ymax:5 }); plot.render = draw;
      function setX(v, step){ A.S.x = snapTo(v, step, 0, 4); A.save(); draw(); paintRead(); }
      drag = MV.drag(plot, { axis:"x", step:{ x:0.1, y:0.1 }, big:5,
        handles:function(){ var dd = read(); return [{ id:"tt", x:dd.x, y:f(dd, dd.x), label:"Tangent tool at x = " + num(dd.x) + ", rate " + MV.plain(rate(dd, dd.x)) + ". Arrow keys move it by 0.1." }]; },
        move:function(id, nx){ setX(nx, 0.1); } });
      plot.c.addEventListener("pointerdown", function(e){ if (e.defaultPrevented) return; var r = plot.c.getBoundingClientRect(); setX(plot.xOf(e.clientX - r.left), 0.1); });
      upd();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [4 * d.a + d.b === 2, d.b < 0, 6 * d.a + d.b >= 4, d.c === 1]; },
    tips:function(d, res){
      var t = T.tips, out = [];
      if (!res[0]) out.push(t[0].replace("{v}", num(4 * d.a + d.b)));
      if (!res[1]) out.push(t[1]);
      if (!res[2]) out.push(t[2].replace("{v}", num(6 * d.a + d.b)));
      if (!res[3]) out.push(t[3]);
      return out;
    },
    key:function(d){ return [d.a, d.b, d.c].join("|"); },
    label:function(k){ var p = k.split("|").map(Number); return M(rampEq(p[0], p[1], p[2])); },
    text:function(k){ var p = k.split("|").map(Number); return MV.plain(M(rampEq(p[0], p[1], p[2]))); }
  };
})();

// ---------- small question graphs ----------
function cubicFig(p, f, view, pts, desc){
  p.draw({ view:view, curves:[{ f:f, color:css("--pen"), width:3, arrows:true }], points:pts.map(function(q){ return { x:q[0], y:q[1], label:q[2], below:!!q[3], color:css("--ink") }; }), describe:desc });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ tap:tapAct },
  task:task,
  figures:{
    t3a:function(p){ cubicFig(p, function(x){ return x * x * x - 3 * x; }, { xmin:-2.6, xmax:2.6, ymin:-4.5, ymax:4.5 }, [[-1, 2, "(−1, 2)"], [1, -2, "(1, −2)", true]], "Graph of f of x equals x cubed minus 3x, with local maximum (−1, 2) and local minimum (1, −2)."); },
    t3b:function(p){ cubicFig(p, function(x){ return -x * x * x + 12 * x; }, { xmin:-4.4, xmax:4.4, ymin:-26, ymax:26 }, [[-2, -16, "(−2, −16)", true], [2, 16, "(2, 16)"]], "Graph of g of x equals negative x cubed plus 12x, with local minimum (−2, −16) and local maximum (2, 16)."); }
  }
});
})();
