// MHF4U 47 Products and Quotients of Functions: hero (wave times a decay fence), Envelope explorer (Multiply / Divide /
// Spring, Overlay / Stacked, probe, Trace, scale bars), Part 3 sign-and-shape chart builder, Practice 3 work-backwards
// builds, the "Design a combination" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, PI = Math.PI;
function M(s){ return MV.m(s); }
function md(s){ return MV.md(s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }

// ---------- exact values: rationals {n, d}, the value rule, fraction text ----------
function Q(n, d){ d = d == null ? 1 : d; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n:n / g, d:d / g }; }
function qmul(a, b){ return Q(a.n * b.n, a.d * b.d); }
function qdiv(a, b){ return Q(a.n * b.d, a.d * b.n); }
function qv(a){ return a.n / a.d; }
function qeq(a, b){ return a.n === b.n && a.d === b.d; }
function V(q, v){ return { q:q || null, v:q ? q.n / q.d : v }; }
function isZero(x){ return !!(x && x.q && x.q.n === 0); }
function isOne(x, s){ return !!(x && x.q && x.q.d === 1 && x.q.n === s); }
function finDec(q){ var d = q.d, a = 0, b = 0; while (d % 2 === 0) { d /= 2; a++; } while (d % 5 === 0) { d /= 5; b++; } return d === 1 && Math.max(a, b) <= 4; }
// 3 significant figures, keeping trailing zeros (3.80), true minus
function sig3(v){
  if (v === 0) return "0";
  var a = Math.abs(v), s = a >= 1000 ? num(Math.round(a)) : a < 1e-4 ? num(a, 7) : a.toPrecision(3);
  return (v < 0 ? MINUS : "") + s;
}
// value rule: exact decimal if it ends within 4 places, else ≈ 3 s.f.
function vt(x){ return x.q && finDec(x.q) ? num(qv(x.q), 4) : sig3(x.v); }
function vx(x){ return !!(x.q && finDec(x.q)); }
function qSrc(q){ return q.d === 1 ? num(q.n) : (q.n < 0 ? MINUS : "") + Math.abs(q.n) + "/" + q.d; }
function fr(v){ return MV.frac(v, 12); }
function par(t){ return t.charAt(0) === MINUS ? "(" + t + ")" : t; }
// "x = ±1/2, ±3/2, 2" style list
function pmList(xs){
  var seen = {}, out = [];
  xs.slice().sort(function(a, b){ return Math.abs(a) - Math.abs(b) || a - b; }).forEach(function(x){
    var k = Math.abs(x); if (seen[k]) return; seen[k] = 1;
    if (x !== 0 && xs.indexOf(-x) >= 0 && xs.indexOf(x) >= 0) out.push("±" + fr(k)); else out.push(fr(x));
  });
  return out.join(", ");
}
function bgText(ctx, txt, x, y, color, font, align){
  ctx.save(); ctx.font = font || "600 12px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = align || "center"; ctx.textBaseline = "middle";
  var w = ctx.measureText(txt).width, bx = ctx.textAlign === "right" ? x - w : ctx.textAlign === "center" ? x - w / 2 : x, cw = ctx.canvas.clientWidth || 9999;
  var nb = Math.max(3, Math.min(cw - w - 3, bx)); x += nb - bx; bx = nb;
  ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(bx - 3, y - 9, w + 6, 18); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(txt, x, y); ctx.restore();
}
function ring(ctx, p, x, y, r){
  var X = p.X(x), Y = p.Y(y); if (!isFinite(Y) || Y < -12 || Y > p.H + 12) return;
  ctx.save(); ctx.beginPath(); ctx.arc(X, Y, (r || 7) + 3, 0, 2 * PI); ctx.lineWidth = 3; ctx.strokeStyle = css("--hi"); ctx.stroke();
  ctx.beginPath(); ctx.arc(X, Y, r || 7, 0, 2 * PI); ctx.lineWidth = 2; ctx.strokeStyle = css("--ink"); ctx.stroke(); ctx.restore();
}
// @component G1+G16 breakPieces — draws y = fn(x) on [lo, hi] as separate pieces between break points (asymptotes),
// sampled densely (geometrically) next to each break so branches run off the window and are never joined.
function piecePts(fn, a, b, brA, brB){
  var xs = [], N = 360, i, span = b - a;
  for (i = 0; i <= N; i++) xs.push(a + span * i / N);
  for (i = 0; i < 70; i++) { var e = 1e-6 * Math.pow(1.22, i); if (e > span / 2) break; if (brA) xs.push(a + e); if (brB) xs.push(b - e); }
  xs.sort(function(p, q){ return p - q; });
  if (brA) xs = xs.filter(function(x){ return x > a; }); if (brB) xs = xs.filter(function(x){ return x < b; });
  return xs.map(function(x){ return [x, fn(x)]; });
}
// polyline in data units; clamps only Y (Plot.curve also clamps X to 6 × height, which cuts wide, short canvases)
function strokePts(p, pts, o){
  var ctx = p.ctx, lim = p.H * 4;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, p.W, p.H); ctx.clip();
  ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.strokeStyle = o.color || css("--ink"); ctx.lineWidth = o.width || 3; ctx.lineJoin = "round"; ctx.lineCap = "round";
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); var pen = false;
  for (var i = 0; i < pts.length; i++) {
    var q = pts[i]; if (!isFinite(q[0]) || !isFinite(q[1])) { pen = false; continue; }
    var X = p.X(q[0]), Y = Math.max(-lim, Math.min(p.H + lim, p.Y(q[1])));
    if (!pen) { ctx.moveTo(X, Y); pen = true; } else ctx.lineTo(X, Y);
  }
  ctx.stroke(); ctx.restore();
}
function strokeFn(p, fn, a, b, o){ var pts = [], N = Math.max(300, Math.round(p.W * 1.2)); for (var i = 0; i <= N; i++) { var x = a + (b - a) * i / N; pts.push([x, fn(x)]); } strokePts(p, pts, o); }
function drawPieces(p, fn, lo, hi, breaks, o){
  var bs = (breaks || []).filter(function(x){ return x > lo - 1e-9 && x < hi + 1e-9; }).sort(function(a, b){ return a - b; });
  var cuts = [lo].concat(bs, [hi]);
  for (var k = 0; k + 1 < cuts.length; k++) {
    var a = cuts[k], b = cuts[k + 1]; if (b - a < 1e-9) continue;
    var brA = bs.indexOf(a) >= 0, brB = bs.indexOf(b) >= 0;
    strokePts(p, piecePts(fn, a, b, brA, brB), { color:o.color, width:o.width || 3.4, dash:o.dash, alpha:o.alpha });
  }
}
function vline(ctx, p, x, color, dash, width, y0, y1){
  var X = p.X(x); if (X < -2 || X > p.W + 2) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width || 1.5; ctx.setLineDash(dash || [8, 6]);
  ctx.beginPath(); ctx.moveTo(X, y0 == null ? 0 : y0); ctx.lineTo(X, y1 == null ? p.H : y1); ctx.stroke(); ctx.restore();
}

// @component radioGroup (from MHF4U 25/35, with per-option disabling) — segmented control or chip row as a real radio
//   group (arrow keys, roving tabindex). radios(host, {label, aria, options:[{id, t}], value, cls, onChange}) -> {set, get, lock, off(ids)}
function radios(host, o){
  var val = String(o.value), locked = false, offs = {};
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, dis = locked || offs[x.id]; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.style ? ' style="' + x.style + '"' : "") + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || offs[id]) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }).filter(function(x){ return !offs[x] && !locked; }); if (!ids.length) return;
    var i = (ids.indexOf(val) + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    lock:function(b){ if (b !== locked) { locked = b; paint(); } }, off:function(ids){ var n = {}; (ids || []).forEach(function(x){ n[x] = 1; }); if (JSON.stringify(n) !== JSON.stringify(offs)) { offs = n; paint(); } } };
}

// =====================================================================================================
// HERO: f(x) = 16(1/2)^x, its mirror, g(x) = cos(πx) in a strip, and f · g drawn behind a probe
// =====================================================================================================
function hero(f){
  var cg = $("#pq-hero-g"), cp = $("#pq-hero-p"); if (!cg || !cp) return;
  var pg = new MV.Plot(cg, { xmin:-0.15, xmax:5.15, ymin:-1.3, ymax:1.3 }), pp = new MV.Plot(cp, { xmin:-0.15, xmax:5.15, ymin:-18, ymax:18 });
  var F = function(x){ return 16 * Math.pow(0.5, x); }, G = function(x){ return Math.cos(PI * x); };
  var st = { ax:0, fT:0, mT:0, gT:0, px:-1, done:false };
  var CAPS = ["`x = 0`: 16 × 1 = 16", "`x = 1`: 8 × (−1) = −8", "`x = 2`: 4 × 1 = 4", "`x = 3`: 2 × (−1) = −2", "`x = 4`: 1 × 1 = 1", "`x = 5`: 1/2 × (−1) = −1/2"];
  function cap(s){ f.cap.innerHTML = md(s); }
  pg.render = function(){
    pg.draw({ view:pg.view, xTicks:{ step:1, fmt:function(){ return ""; } }, yTicks:{ step:1 }, axes:st.ax > 0,
      curves:st.gT > 0 ? [{ f:G, color:css("--f3"), width:2.6, domain:[0, 5 * st.gT] }] : [],
      labels:st.gT >= 1 ? [{ x:5.1, y:1.05, text:"g", color:css("--f3"), align:"right", font:"italic 600 14px " + (css("--font-math") || "serif") }] : [],
      describe:"Strip graph of g(x) = cos(πx) for x from 0 to 5; it stays between −1 and 1." });
  };
  pp.render = function(){
    var pen = css("--pen"), ink = css("--ink"), curves = [];
    if (st.fT > 0) curves.push({ f:F, color:pen, width:2.6, domain:[0, 5 * st.fT] });
    if (st.mT > 0) curves.push({ f:function(x){ return F(x) * (1 - 2 * st.mT); }, color:pen, width:2, dash:[6, 4] });
    pp.draw({ view:pp.view, axes:st.ax > 0, xTicks:{ step:1 }, yTicks:{ step:4 }, curves:curves,
      after:function(ctx, p){
        if (st.px >= 0) {
          var hi = Math.min(5, st.px);
          if (hi > 0) p.curve({ f:function(x){ return F(x) * G(x); }, color:ink, width:3.4, domain:[0, hi] });
          for (var k = 0; k <= 5; k++) if (k <= st.px + 1e-9) ring(ctx, p, k, F(k) * G(k), 6);
          for (var h = 0.5; h < 5; h += 1) if (h <= st.px + 1e-9) p.point({ x:h, y:0, r:4, color:ink });
          if (st.px < 5 && !st.done) vline(ctx, p, st.px, css("--ink-2"), [2, 4], 1.5);
        }
        if (st.mT >= 1) { bgText(ctx, "y = f(x)", p.X(0.45), p.Y(F(0.45)) - 14, pen, "italic 600 13px " + (p.fontM || "serif"), "left"); bgText(ctx, "y = " + MINUS + "f(x)", p.X(0.45), p.Y(-F(0.45)) + 14, pen, "italic 600 13px " + (p.fontM || "serif"), "left"); }
      },
      describe:"Graph for x from 0 to 5: the fence y = 16(1/2)^x and its mirror y = −16(1/2)^x, with f · g = 16(1/2)^x cos(πx) between them, touching the fence at every whole number and crossing the axis at x = 1/2, 3/2, 5/2, 7/2 and 9/2." });
  };
  function all(){ pg.render(); pp.render(); }
  function fin(){ st = { ax:1, fT:1, mT:1, gT:1, px:5, done:true }; all(); cap("Inside the fence, touching it wherever `cos(πx) = ±1`."); }
  if (MV.reduceMotion) { fin(); return; }
  all();
  cap("`f(x) = 16(1/2)^x`");
  var seq = [
    function(n){ MV.tween({ dur:400, step:function(t){ st.ax = t; all(); }, done:function(){ MV.wait(300, n); } }); },
    function(n){ MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ st.fT = t; pp.render(); }, done:n }); },
    function(n){ cap("the fence: `y = f(x)` and `y = -f(x)`"); MV.tween({ dur:500, step:function(t){ st.mT = t; pp.render(); }, done:function(){ MV.wait(900, n); } }); },
    function(n){ cap("`g(x) = cos(πx)`, always between −1 and 1"); MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ st.gT = t; pg.render(); }, done:function(){ MV.wait(1100, n); } }); },
    function(n){
      var k = 0;
      function at(){ st.px = k; pp.render(); cap(CAPS[k]); MV.wait(600 + 300, function(){ if (k >= 5) { n(); return; } MV.tween({ dur:1000, ease:function(t){ return t; }, step:function(t){ st.px = k + t; pp.render(); }, done:function(){ k++; at(); } }); }); }
      at();
    },
    function(){ MV.wait(500, fin); }
  ];
  (function run(i){ if (i < seq.length) seq[i](function(){ run(i + 1); }); })(0);
}

// =====================================================================================================
// EXPLORE: Envelope explorer
// =====================================================================================================
function pw2(k){ return Math.pow(2, k); }
var FM = {
  x:{ src:"x", t:"odd", zeros:[0], Y:4, f:function(x){ return x; }, q:function(i){ return Q(i, 20); } },
  xm2:{ src:"x - 2", multi:true, t:"neither", zeros:[2], Y:6, f:function(x){ return x - 2; }, q:function(i){ return Q(i - 40, 20); } },
  "4mx2":{ src:"4 - x^2", multi:true, t:"even", zeros:[-2, 2], Y:6, f:function(x){ return 4 - x * x; }, q:function(i){ return Q(1600 - i * i, 400); } },
  half:{ src:"(1/2)^x", t:"neither", zeros:[], Y:12, f:function(x){ return Math.pow(0.5, x); }, q:function(i){ if (i % 20) return null; var k = i / 20; return k >= 0 ? Q(1, pw2(k)) : Q(pw2(-k), 1); } }
};
var GM = {
  cos:{ src:"cos(πx)", fn:"cos", wave:true, t:"even", zeros:[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5], one:[-2, 0, 2], mone:[-3, -1, 1, 3], Y:2, f:function(x){ return Math.cos(PI * x); },
    q:function(i){ return i % 10 ? null : Q([1, 0, -1, 0][(((i / 10) % 4) + 4) % 4], 1); } },
  sin:{ src:"sin(πx)", fn:"sin", wave:true, t:"odd", zeros:[-3, -2, -1, 0, 1, 2, 3], one:[-1.5, 0.5, 2.5], mone:[-2.5, -0.5, 1.5], Y:2, f:function(x){ return Math.sin(PI * x); },
    q:function(i){ return i % 10 ? null : Q([0, 1, 0, -1][(((i / 10) % 4) + 4) % 4], 1); } },
  xp1:{ src:"x + 1", multi:true, t:"neither", zeros:[-1], one:[0], mone:[-2], Y:6, f:function(x){ return x + 1; }, q:function(i){ return Q(i + 20, 20); } },
  x2m4:{ src:"x^2 - 4", multi:true, t:"even", zeros:[-2, 2], one:[], mone:[], Y:6, f:function(x){ return x * x - 4; }, q:function(i){ return Q(i * i - 1600, 400); } }
};
var FIDS = ["x", "xm2", "4mx2", "half"], GIDS = ["cos", "sin", "xp1", "x2m4"];
var YMUL = { x:{ cos:4, sin:4, xp1:16, x2m4:24 }, xm2:{ cos:6, sin:6, xp1:12, x2m4:32 }, "4mx2":{ cos:6, sin:6, xp1:24, x2m4:32 }, half:{ cos:12, sin:12, xp1:24, x2m4:48 } };
var HOLES = { "xm2|x2m4":{ 2:Q(1, 4) }, "4mx2|x2m4":{ "-2":Q(-1, 1), 2:Q(-1, 1) } };
var BASES = [[1, 2], [2, 3], [3, 4], [9, 10], [1, 1]];
function fVal(id, i){ var F = FM[id]; return V(F.q(i), F.f(i / 20)); }
function gVal(id, i){ var G = GM[id]; return V(G.q(i), G.f(i / 20)); }
function combo(mode, fv, gv){
  if (mode === "mul") { if (isZero(fv) || isZero(gv)) return V(Q(0)); if (fv.q && gv.q) return V(qmul(fv.q, gv.q)); return V(null, fv.v * gv.v); }
  if (isZero(gv)) return null;
  if (isZero(fv)) return V(Q(0));
  if (fv.q && gv.q) return V(qdiv(fv.q, gv.q));
  return V(null, fv.v / gv.v);
}
function prodSrc(fid, gid){ var F = FM[fid], G = GM[gid], fp = F.multi ? "(" + F.src + ")" : F.src; return G.wave ? fp + " " + G.src : fp + "(" + G.src + ")"; }
function comboSrc(mode, fid, gid){ return mode === "mul" ? "(f · g)(x) = " + prodSrc(fid, gid) : "(f/g)(x) = {" + FM[fid].src + "}/{" + GM[gid].src + "}"; }
// angle-first text for a wave at x = m/2: "cos π", "sin(3π/2)", "cos(−π)"
function angSrc(fn, i){
  if (i % 10 === 0) {
    var m = i / 10, neg = m < 0, a = Math.abs(m), s;
    if (a === 0) return fn + " 0";
    if (a % 2 === 0) s = (a / 2 === 1 ? "" : a / 2) + "π"; else s = (a === 1 ? "" : a) + "π/2";
    return neg || a % 2 ? fn + "(" + (neg ? MINUS : "") + s + ")" : fn + " " + s;
  }
  return fn + "(" + num(i / 20, 2) + "π)";
}

function explore(host, api){
  var S = api.S, C = api.content;
  var D = { mode:"mul", view:"overlay", f:"4mx2", g:"cos", i:20, fences:true, marks:true, traced:{}, whole:{}, a:12, bi:2, ti:0, sf:true, speed:1, setup:null };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  if (S.mode === "div" && S.g === "sin") S.g = "cos";
  var anim = 0, ext = {}, hideRes = false, forced = {}, guideT = 1, fenceT = S.fences ? 1 : 0, fadeT = 1, asyT = {}, fold = null, px = S.i / 20, playing = false, tf = S.ti / 20;
  var sfT = 1, zoom = null, zT = 0, springY = 1.25 * S.a, flash = "", busyPred = false, autoTimer = null, barAnim = null, sentT = 1, sentTxt = "";

  host.innerHTML = '<div class="pq-top"><div id="pq-mode"></div><div id="pq-view"></div></div>' +
    '<div class="pq-menus" id="pq-menus"><div id="pq-fm"></div><div id="pq-gm"></div><p class="tiny muted pq-note" id="pq-note"></p></div>' +
    '<div class="pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap pq-cap" id="pq-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="pq-gwrap" id="pq-gwrap"><div class="pq-gmain">' +
      '<div class="plot-wrap" id="pq-ov"><canvas class="plot" id="pq-ovc" role="img" aria-label="Explorer graph"></canvas></div>' +
      '<div id="pq-st" hidden><div class="plot-wrap"><canvas class="plot pq-panel" id="pq-st0" role="img" aria-label="Panel for f"></canvas></div><div class="plot-wrap"><canvas class="plot pq-panel" id="pq-st1" role="img" aria-label="Panel for g"></canvas></div><div class="plot-wrap"><canvas class="plot pq-panel" id="pq-st2" role="img" aria-label="Panel for the result"></canvas></div></div>' +
      '<div class="pq-spring" id="pq-sp" hidden><canvas class="plot pq-springc" id="pq-spc" role="img" aria-label="Spring drawing"></canvas><div class="plot-wrap"><canvas class="plot" id="pq-sgc" role="img" aria-label="Spring graph"></canvas></div></div>' +
    '</div><div class="pq-barbox" id="pq-bb"><canvas class="plot pq-bars" id="pq-bars" role="img" aria-label="Scale bars"></canvas></div></div>' +
    '<p class="pq-sent" id="pq-sent" aria-hidden="true"></p><p class="vh" id="pq-sent-sr" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl" id="pq-ctrl"><div id="pq-ctl-md"></div><div id="pq-ctl-sp" hidden></div></div>' +
    '<div class="pg-read"><dl class="read" id="pq-read" aria-live="polite"></dl><p class="pq-flash" id="pq-flash" aria-live="polite"></p><p class="pq-closer" id="pq-closer" aria-live="polite"></p></div></div>';

  // ----- controls: mode, view, menus -----
  var modeR = radios($("#pq-mode"), { label:"Mode", options:[{ id:"mul", t:"Multiply" }, { id:"div", t:"Divide" }, { id:"spring", t:"Spring" }], value:S.mode, onChange:function(v){ user(); setMode(v); } });
  var viewR = radios($("#pq-view"), { label:"View", options:[{ id:"overlay", t:"Overlay" }, { id:"stacked", t:"Stacked" }], value:S.view, onChange:function(v){ user(); S.view = v; save(); paintAll(); } });
  var fR = radios($("#pq-fm"), { label:'<span class="pq-fl">f</span>', aria:"Choose f", cls:"chips pq-fchips", options:FIDS.map(function(id){ return { id:id, t:M(FM[id].src) }; }), value:S.f, onChange:function(v){ user(); S.f = v; changedPair(); } });
  var gR = radios($("#pq-gm"), { label:'<span class="pq-gl">g</span>', aria:"Choose g", cls:"chips pq-gchips", options:GIDS.map(function(id){ return { id:id, t:M(GM[id].src) }; }), value:S.g, onChange:function(v){ user(); var was = GM[S.g].wave; S.g = v; if (GM[v].wave && !was && S.fences) flipFence(); changedPair(); } });

  var ctl = $("#pq-ctl-md");
  ctl.innerHTML = '<label class="slider pq-probe"><span class="slider-top"><span>Probe</span><output id="pq-pout"></output></span><input type="range" id="pq-pin" min="-60" max="60" step="1" aria-label="Probe x"></label>' +
    '<div class="pq-row"><button type="button" class="btn ghost sm" id="pq-lprev">◀ Landmark</button><button type="button" class="btn ghost sm" id="pq-lnext">Landmark ▶</button><button type="button" class="btn primary sm" id="pq-trace">Trace</button><button type="button" class="btn ghost sm" id="pq-whole" aria-pressed="false">Show whole graph</button></div>' +
    '<div class="pq-row"><button type="button" class="btn sm" id="pq-show">Show the multiplication</button><button type="button" class="chip" id="pq-tf" aria-pressed="true">Fences</button><button type="button" class="chip" id="pq-tl" aria-pressed="true">Landmarks</button></div>' +
    '<p class="tiny muted" style="margin:4px 0 0">Drag the probe on the graph or use its handle: ← → move 0.05 (Shift: 0.5), Home / End jump to the edges, Page Up / Page Down jump between landmarks, Enter plays the bars.</p>';
  var sp = $("#pq-ctl-sp");
  sp.innerHTML = '<div id="pq-asl"></div><div class="pq-row" id="pq-bwrap"></div><label class="slider"><span class="slider-top"><span>Time <i>t</i></span><output id="pq-tout"></output></span><input type="range" id="pq-tin" min="0" max="160" step="1" aria-label="Time t in seconds"></label>' +
    '<div class="pq-row"><button type="button" class="btn primary sm" id="pq-play"></button><span id="pq-spd"></span></div>' +
    '<div class="pq-row"><button type="button" class="chip" id="pq-stf" aria-pressed="true">Fences</button><button type="button" class="btn ghost sm" id="pq-zoom" aria-pressed="false">Look closer</button></div>' +
    '<p class="tiny muted" style="margin:4px 0 0">With the graph’s handle focused: Space plays or pauses, ← → move 0.05 s (Shift: 0.5 s).</p>';
  var aSl = MV.sliders($("#pq-asl"), [{ id:"pqa", label:'Starting stretch <span class="p-a"><i>a</i></span> (cm)', param:"a", min:2, max:20, step:2, value:S.a }], function(id, v){ user(); S.a = v; save(); rescaleSpring(); paintAll(); });
  var bR = radios($("#pq-bwrap"), { label:'Base <span class="p-b"><i>b</i></span>', aria:"Base b", cls:"chips pq-bchips", options:BASES.map(function(b, k){ return { id:k, t:b[1] === 1 ? "1" : b[0] + "/" + b[1] }; }), value:S.bi, onChange:function(v){ user(); S.bi = +v; save(); paintAll(); } });
  var spdR = radios($("#pq-spd"), { label:"Speed", aria:"Speed", cls:"chips", options:[{ id:"0.5", t:"×0.5" }, { id:"1", t:"×1" }], value:String(S.speed), onChange:function(v){ S.speed = +v; save(); } });

  function save(){ api.save(); }
  var pendingDone = null;
  function user(){ anim++; stopPlay(); if (busyPred) { busyPred = false; hideRes = false; fold = null; guideT = 1; sfT = 1; S.sf = S.sf || true; var d = pendingDone; pendingDone = null; if (d) d(); } }
  function key(){ return S.mode + "|" + S.f + "|" + S.g; }
  function pairKey(){ return S.f + "|" + S.g; }
  function whole(){ return !hideRes && S.traced[key()] && S.whole[key()] !== false; }
  function resY(){ return S.mode === "mul" ? YMUL[S.f][S.g] : 8; }
  function fenceOn(){ return S.fences && GM[S.g].wave; }
  function lockedF(){ return S.setup === "tc2" && S.mode === "div"; }

  // ----- landmarks -----
  function holeQ(x){ var h = HOLES[pairKey()]; return h ? h[String(x)] : null; }
  function landmarks(){
    var F = FM[S.f], G = GM[S.g], L = [];
    if (S.mode === "mul") {
      var zs = {};
      F.zeros.forEach(function(z){ zs[z] = (zs[z] || "") + "f"; }); G.zeros.forEach(function(z){ zs[z] = (zs[z] || "") + "g"; });
      Object.keys(zs).forEach(function(k){ L.push({ x:+k, kind:"zero", who:zs[k] === "fg" ? "both" : zs[k] }); });
    } else {
      G.zeros.forEach(function(z){ if (F.zeros.indexOf(z) >= 0) { var h = holeQ(z); L.push({ x:z, kind:"hole", q:h, y:qv(h) }); } else L.push({ x:z, kind:"asym" }); });
      F.zeros.forEach(function(z){ if (G.zeros.indexOf(z) < 0) L.push({ x:z, kind:"zero", who:"f" }); });
    }
    G.one.forEach(function(z){ if (F.zeros.indexOf(z) < 0) L.push({ x:z, kind:"one" }); });
    G.mone.forEach(function(z){ if (F.zeros.indexOf(z) < 0) L.push({ x:z, kind:"mone" }); });
    return L.filter(function(l){ return l.x >= -3 && l.x <= 3; }).sort(function(a, b){ return a.x - b.x; });
  }
  function inExt(x){ var e = ext[key()]; return !!e && x >= e.lo - 1e-9 && x <= e.hi + 1e-9; }
  function seen(l){ return forced[l.kind + l.x] || whole() || inExt(l.x); }
  function asymsSeen(){ return S.mode === "div" ? landmarks().filter(function(l){ return l.kind === "asym" && seen(l); }) : []; }
  function breaks(){ return S.mode === "div" ? landmarks().filter(function(l){ return l.kind === "asym"; }).map(function(l){ return l.x; }) : []; }
  function resFn(){ var F = FM[S.f], G = GM[S.g]; return S.mode === "mul" ? function(x){ return F.f(x) * G.f(x); } : function(x){ return F.f(x) / G.f(x); }; }

  // ----- drawing: overlay -----
  var ov = new MV.Plot($("#pq-ovc"), { xmin:-3.25, xmax:3.25, ymin:-6, ymax:6 });
  var stp = [0, 1, 2].map(function(k){ return new MV.Plot($("#pq-st" + k), { xmin:-3.25, xmax:3.25, ymin:-6, ymax:6 }); });
  var bars = new MV.Plot($("#pq-bars"), { xmin:0, xmax:1, ymin:-1, ymax:1 });
  var spc = new MV.Plot($("#pq-spc"), { xmin:0, xmax:1, ymin:-15, ymax:15 }), sg = new MV.Plot($("#pq-sgc"), { xmin:-0.25, xmax:8.25, ymin:-15, ymax:15 });
  function fenceTint(p, F, outside){
    var a = fadeT * fenceT;
    if (a <= 0) return [];
    var abs = function(x){ return Math.abs(F.f(x)); }, top = function(){ return p.v ? 1e6 : 1e6; };
    if (!outside) return [{ f:abs, g:function(x){ return -abs(x) * (2 * fenceT - 1); }, alpha:a }];
    return [{ f:top, g:abs, alpha:a }, { f:function(x){ return -abs(x); }, g:function(){ return -1e6; }, alpha:a }];
  }
  function drawResult(p){
    var e = ext[key()], lo, hi;
    if (whole()) { lo = -3.25; hi = 3.25; } else if (e) { lo = e.lo; hi = e.hi; } else return;
    if (hi - lo < 1e-6) return;
    var bs = breaks();
    drawPieces(p, resFn(), lo, hi, bs, { color:css("--ink"), width:3.4, alpha:fadeT });
  }
  function drawMarks(ctx, p, inResult){
    if (!S.marks && !Object.keys(forced).length) return;
    var F = FM[S.f], ink = css("--ink"), pen = css("--pen"), f3 = css("--f3"), ink2 = css("--ink-2"), fM = "italic 600 12px " + (p.fontM || "serif"), n = 0, placed = [];
    // place a label only where it doesn't overlap one already drawn (tries the other side first)
    function lab(txt, x, ys, col, font, align){
      ctx.save(); ctx.font = font; var w = ctx.measureText(txt).width + 6; ctx.restore();
      for (var k = 0; k < ys.length; k++) {
        var bx = align === "left" ? x : x - w / 2, by = ys[k] - 9, ok = by > 0 && by + 18 < p.H;
        for (var j = 0; j < placed.length && ok; j++) { var q = placed[j]; if (bx < q[0] + q[2] && q[0] < bx + w && by < q[1] + q[3] && q[1] < by + 18) ok = false; }
        if (ok) { placed.push([bx, by, w, 18]); bgText(ctx, txt, x, ys[k], col, font, align); return; }
      }
    }
    landmarks().forEach(function(l){
      if (!seen(l) || (!S.marks && !forced[l.kind + l.x])) return;
      if (l.kind === "asym") {
        var t = asyT[l.x] == null ? 1 : asyT[l.x];
        vline(ctx, p, l.x, ink2, [8, 6], 1.5, 0, p.H * t);
        if (t >= 1) bgText(ctx, "x = " + fr(l.x), p.X(l.x), 12 + (n++ % 2) * 18, ink2, fM);
      } else if (l.kind === "hole") {
        p.point({ x:l.x, y:l.y, open:true, r:5.5, color:pen });
        lab("(" + fr(l.x) + ", " + qSrc(l.q) + ")", p.X(l.x), [p.Y(l.y) - 16, p.Y(l.y) + 16], ink, fM);
      } else if (l.kind === "zero") {
        var col = l.who === "f" ? pen : l.who === "g" ? f3 : ink;
        p.point({ x:l.x, y:0, r:5, color:col });
        if (inResult) {
          var lb = S.mode === "div" ? "zero" : l.who === "f" ? "f = 0" : l.who === "g" ? "g = 0" : "both 0", up = (n++ % 2) === 0;
          lab(lb, p.X(l.x), up ? [p.Y(0) - 15, p.Y(0) + 15] : [p.Y(0) + 15, p.Y(0) - 15], col, "600 11px " + (p.fontUI || "sans-serif"));
        }
      } else {
        var y = (l.kind === "one" ? 1 : -1) * F.f(l.x);
        ring(ctx, p, l.x, y, 6);
        if (inResult) lab(l.kind === "one" ? "= f" : "= " + MINUS + "f", p.X(l.x) + 12, y >= 0 ? [p.Y(y) - 14, p.Y(y) + 14] : [p.Y(y) + 14, p.Y(y) - 14], ink, fM, "left");
      }
    });
  }
  function probeLine(ctx, p){ vline(ctx, p, px, css("--ink-2"), [2, 4], 1.5); }
  function probeDots(p, which){
    var x = px, F = FM[S.f], G = GM[S.g];
    if (which.f) p.point({ x:x, y:F.f(x), r:4, color:css("--pen") });
    if (which.g) p.point({ x:x, y:G.f(x), r:4, color:css("--f3") });
    if (which.r) { var r = resFn()(x); if (isFinite(r) && Math.abs(G.f(x)) > 1e-9) p.point({ x:x, y:r, r:5, color:css("--ink") }); }
  }
  function knob(p){ var y = p.v.ymin + (p.v.ymax - p.v.ymin) * 0.06; p.point({ x:px, y:y, r:6, color:css("--ink"), ring:true }); }
  function fenceLabels(ctx, p){
    if (!fenceOn() || fenceT < 1) return;
    var F = FM[S.f], x = 2.75, fM = "italic 600 13px " + (p.fontM || "serif"), y1 = F.f(x), pen = css("--pen");
    if (Math.abs(y1) < 1e-6) x = 2.95, y1 = F.f(x);
    bgText(ctx, "y = f(x)", p.X(x), clamp(p.Y(y1) + (y1 >= 0 ? -13 : 13), 10, p.H - 10), pen, fM, "right");
    bgText(ctx, "y = " + MINUS + "f(x)", p.X(x), clamp(p.Y(-y1) + (y1 >= 0 ? 13 : -13), 10, p.H - 10), pen, fM, "right");
  }
  function foldCopy(p){
    if (!fold) return;
    var R = resFn(), s = 1 - 2 * fold.t, pts = [];
    for (var k = 0; k <= 200; k++) { var x = fold.hi * k / 200; pts.push([x * s, R(x)]); }
    p.curve({ pts:pts, color:css("--hi"), width:6, alpha:0.85 });
  }
  function desc(){
    var F = FM[S.f], G = GM[S.g], i = S.i, fv = fVal(S.f, i), gv = gVal(S.g, i), rv = combo(S.mode, fv, gv), L = landmarks();
    var op = S.mode === "mul" ? "f · g" : "f/g";
    var s = "Graph of " + op + " = " + MV.plain(M(S.mode === "mul" ? prodSrc(S.f, S.g) : "(" + F.src + ")/(" + G.src + ")")) + " for x from −3 to 3" + (whole() ? "" : " (only the traced part is drawn)") + ". ";
    if (fenceOn()) s += S.mode === "mul" ? "It stays between y = " + MV.plain(M(F.src)) + " and its mirror. " : "It stays outside the fence y = ±" + MV.plain(M(F.src)) + ". ";
    var z = L.filter(function(l){ return l.kind === "zero"; }).map(function(l){ return l.x; });
    if (z.length) s += "Zeros at x = " + z.map(fr).join(", ") + ". ";
    var as = L.filter(function(l){ return l.kind === "asym"; }).map(function(l){ return fr(l.x); }); if (as.length) s += "Vertical asymptotes x = " + as.join(", ") + ". ";
    var hs = L.filter(function(l){ return l.kind === "hole"; }).map(function(l){ return "(" + fr(l.x) + ", " + qSrc(l.q) + ")"; }); if (hs.length) s += "Holes at " + hs.join(" and ") + ". ";
    s += "Probe at x = " + num(i / 20, 2) + ": f = " + vt(fv) + ", g = " + vt(gv) + ", " + (S.mode === "mul" ? "product " : "quotient ") + (rv ? vt(rv) : "undefined") + ".";
    return s;
  }
  ov.render = function(){
    var F = FM[S.f], G = GM[S.g], Y = resY(), pen = css("--pen");
    var curves = [{ f:F.f, color:pen, width:2.6, alpha:fadeT }, { f:G.f, color:css("--f3"), width:2.6, alpha:fadeT }];
    if (fenceOn() && fenceT > 0) curves.push({ f:function(x){ return F.f(x) * (1 - 2 * fenceT); }, color:pen, width:2, dash:[6, 4], alpha:fadeT });
    ov.draw({ view:{ xmin:-3.25, xmax:3.25, ymin:-Y, ymax:Y }, xTicks:{ step:1 }, regions:fenceOn() ? fenceTint(ov, F, S.mode === "div") : [], curves:curves,
      after:function(ctx, p){ drawResult(p); foldCopy(p); drawMarks(ctx, p, true); fenceLabels(ctx, p); probeLine(ctx, p); probeDots(p, { f:true, g:true, r:true }); knob(p); },
      describe:desc() });
  };
  // @component stackedPanels — three aligned panels (f, g, result) with their own y-windows, one shared x-axis, a probe line
  //   through all three and dotted guide lines from every zero of f and g (ending at a zero dot, hole or asymptote in the result)
  function stackScene(k){
    var F = FM[S.f], G = GM[S.g], pen = css("--pen"), f3 = css("--f3"), ink = css("--ink");
    var Y = k === 0 ? F.Y : k === 1 ? G.Y : resY(), none = { step:1, fmt:function(){ return ""; } };
    var sc = { view:{ xmin:-3.25, xmax:3.25, ymin:-Y, ymax:Y }, xTicks:k < 2 ? none : { step:1 }, yTicks:Y <= 2 ? { step:1 } : undefined, curves:[], regions:[] };
    if (k === 0) { sc.curves.push({ f:F.f, color:pen, width:2.6, alpha:fadeT }); sc.describe = "Panel 1: f(x) = " + MV.plain(M(F.src)) + ". Zeros: " + (F.zeros.length ? F.zeros.map(fr).join(", ") : "none") + "."; }
    if (k === 1) { sc.curves.push({ f:G.f, color:f3, width:2.6, alpha:fadeT }); sc.describe = "Panel 2: g(x) = " + MV.plain(M(G.src)) + ". Zeros: " + G.zeros.map(fr).join(", ") + "."; }
    if (k === 2) {
      if (fenceOn() && fenceT > 0) { sc.regions = fenceTint(stp[2], F, S.mode === "div"); sc.curves.push({ f:F.f, color:pen, width:2, alpha:0.9 * fadeT }, { f:function(x){ return F.f(x) * (1 - 2 * fenceT); }, color:pen, width:2, dash:[6, 4], alpha:fadeT }); }
      sc.describe = "Panel 3: " + desc();
    }
    sc.after = function(ctx, p){
      if (S.marks && guideT > 0) {
        var dropH = p.H * guideT;
        F.zeros.forEach(function(z){ guide(ctx, p, z, pen, k, dropH); });
        G.zeros.forEach(function(z){ guide(ctx, p, z, f3, k, dropH); });
      }
      if (k === 0) { if (S.marks) F.zeros.forEach(function(z){ p.point({ x:z, y:0, r:4.5, color:pen }); }); probeLine(ctx, p); probeDots(p, { f:true }); bgText(ctx, "f(x) = " + MV.plain(M(F.src)), 8, 12, pen, "italic 600 13px " + (p.fontM || "serif"), "left"); }
      if (k === 1) { if (S.marks) G.zeros.forEach(function(z){ p.point({ x:z, y:0, r:4.5, color:f3 }); }); probeLine(ctx, p); probeDots(p, { g:true }); bgText(ctx, "g(x) = " + MV.plain(M(G.src)), 8, 12, f3, "italic 600 13px " + (p.fontM || "serif"), "left"); }
      if (k === 2) { drawResult(p); foldCopy(p); drawMarks(ctx, p, false); probeLine(ctx, p); probeDots(p, { r:true }); knob(p); bgText(ctx, S.mode === "mul" ? "f · g" : "f/g", 8, 12, ink, "italic 600 13px " + (p.fontM || "serif"), "left"); }
    };
    return sc;
  }
  function guide(ctx, p, z, col, k, dropH){
    var y1 = p.H;
    if (k === 2) {
      var l = landmarks().filter(function(m){ return m.x === z; })[0];
      if (l && l.kind === "hole") y1 = p.Y(l.y); else if (l && l.kind === "asym") y1 = p.H; else y1 = p.Y(0);
    }
    var top = 0, bottom = Math.min(y1, k === 0 ? dropH : k === 1 ? Math.max(0, dropH) : dropH);
    ctx.save(); ctx.globalAlpha = 0.7; vline(ctx, p, z, col, [2, 4], 1.4, top, bottom); ctx.restore();
  }
  stp.forEach(function(p, k){ p.render = function(){ p.draw(stackScene(k)); }; });

  // @component G13 scaleBars — three bars (f, g, result) on one zero line, each with its own scale, "off the scale" caps;
  //   multiply/divide animation: a copy of the f bar lifts off, a "× g(x)" chip, stretches/flips into the result bar, typed sentence
  bars.render = function(){ bars.draw({ grid:false, axes:false, ticks:false, view:{ xmin:0, xmax:1, ymin:-1, ymax:1 }, after:drawBars, describe:barsDesc() }); };
  function barVals(){ var i = S.i, fv = fVal(S.f, i), gv = gVal(S.g, i); return { fv:fv, gv:gv, rv:combo(S.mode, fv, gv) }; }
  function barsDesc(){ var b = barVals(); return "Scale bars at x = " + num(S.i / 20, 2) + ": f bar " + vt(b.fv) + ", g bar " + vt(b.gv) + ", " + (S.mode === "mul" ? "product" : "quotient") + " bar " + (b.rv ? vt(b.rv) : "undefined") + ". Each bar has its own scale."; }
  function drawBars(ctx, p){
    var W = p.W, H = p.H, b = barVals(), F = FM[S.f], G = GM[S.g], ink = css("--ink"), pen = css("--pen"), f3 = css("--f3"), ui = p.fontUI || "sans-serif";
    var top = 16, bot = H - 18, z0 = (top + bot) / 2, h2 = (bot - top) / 2 - 8, bw = Math.max(10, Math.min(18, W * 0.09));
    var lanes = [W * 0.14, W * 0.38, W * 0.62, W * 0.86];
    ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(4, z0); ctx.lineTo(W - 4, z0); ctx.stroke();
    function bar(x, v, Y, col, lab, alpha, outline){
      if (v == null) return;
      var hh = v / Y * h2, off = Math.abs(hh) > h2, hc = clamp(hh, -h2, h2);
      ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = col;
      ctx.fillRect(x - bw / 2, Math.min(z0, z0 - hc), bw, Math.max(1.5, Math.abs(hc)));
      if (outline) { ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.strokeRect(x - bw / 2, Math.min(z0, z0 - hc), bw, Math.max(1.5, Math.abs(hc))); }
      if (off) { var ye = z0 - hc, d = hh > 0 ? -1 : 1; ctx.beginPath(); ctx.moveTo(x, ye + d * 9); ctx.lineTo(x - bw / 2 - 3, ye); ctx.lineTo(x + bw / 2 + 3, ye); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      if (lab != null) {
        var ty = hh >= 0 ? z0 - hc - (off ? 16 : 9) : z0 - hc + (off ? 16 : 9);
        bgText(ctx, lab + (off ? " (off the scale)" : ""), clamp(x, 30, W - 30), clamp(ty, 9, H - 9), col, "600 11px " + ui);
      }
    }
    bar(lanes[0], b.fv.v, F.Y, pen, vt(b.fv));
    bar(lanes[1], b.gv.v, G.Y, f3, vt(b.gv));
    if (b.rv) bar(lanes[3], b.rv.v, resY(), ink, vt(b.rv)); else bgText(ctx, "undefined", lanes[3], z0 - 12, ink, "600 11px " + ui);
    if (barAnim && b.rv) {
      var t = barAnim.t, lift = clamp(t / 0.2, 0, 1), st = clamp((t - 0.2) / 0.6, 0, 1), land = clamp((t - 0.8) / 0.2, 0, 1);
      var x = lane(lanes[0], lanes[2], lift), Ys = F.Y + (resY() - F.Y) * st, v = b.fv.v + (b.rv.v - b.fv.v) * st;
      if (land > 0) x = lane(lanes[2], lanes[3], land);
      bar(x, v, Ys, pen, null, 0.55, true);
      if (lift >= 1 && land < 1) {
        var chip = (S.mode === "mul" ? "× " : "÷ ") + par(vt(b.gv));
        ctx.save(); ctx.font = "700 11px " + ui; var w = ctx.measureText(chip).width + 10, cx = clamp(x - w / 2, 2, W - w - 2), cy = top - 4;
        ctx.fillStyle = css("--sheet"); ctx.strokeStyle = f3; ctx.lineWidth = 1.5; ctx.fillRect(cx, cy, w, 18); ctx.strokeRect(cx, cy, w, 18);
        ctx.fillStyle = f3; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(chip, cx + 5, cy + 9); ctx.restore();
      }
    }
    ctx.save(); ctx.font = "600 11px " + ui; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    [["f(x)", pen], ["g(x)", f3], ["", ink], [S.mode === "mul" ? "f · g" : "f/g", ink]].forEach(function(r, k){ if (r[0]) { ctx.fillStyle = r[1]; ctx.fillText(r[0], lanes[k], H - 2); } });
    ctx.restore();
  }
  function lane(a, b, t){ return a + (b - a) * t; }
  function sentence(){
    var b = barVals(), fv = b.fv, gv = b.gv, rv = b.rv, ft = vt(fv), gt = vt(gv), approx = !vx(fv) || !vx(gv);
    if (S.mode === "mul") {
      if (isZero(fv)) return "0 × " + par(gt) + " = 0: 0 times anything is 0.";
      var g = gv.v, end = isZero(gv) ? "squashes it to 0" : isOne(gv, 1) ? "leaves it unchanged" : isOne(gv, -1) ? "flips it" : g > 1 ? "stretches it" : g > 0 ? "shrinks it" : g > -1 ? "shrinks and flips it" : "stretches and flips it";
      return ft + " × " + par(gt) + (approx && !vx(rv) ? " ≈ " : " = ") + vt(rv) + ": times " + gt + " " + end + ".";
    }
    if (!rv) return "You can’t divide by 0: f/g is undefined here.";
    if (isZero(fv)) return "0 ÷ " + par(gt) + " = 0: 0 divided by any number that isn’t 0 is 0.";
    var gg = gv.v, e2 = isOne(gv, 1) ? "dividing by 1 leaves it unchanged" : isOne(gv, -1) ? "dividing by −1 flips it" : gg > 1 ? "dividing by a number bigger than 1 makes it smaller" : gg > 0 ? "dividing by a number smaller than 1 makes it bigger" : gg > -1 ? "dividing by a number smaller than 1 in size makes it bigger and flips it" : "dividing by a number bigger than 1 in size makes it smaller and flips it";
    return ft + " ÷ " + par(gt) + (approx && !vx(rv) ? " ≈ " : " = ") + vt(rv) + ": " + e2 + ".";
  }
  function playBars(){
    if (S.mode === "spring") return;
    var my = ++barTok, txt = sentence(), b = barVals();
    $("#pq-sent-sr").textContent = "";
    function typeIt(){ MV.tween({ dur:600, ease:function(t){ return t; }, step:function(t){ if (my !== barTok) return; $("#pq-sent").textContent = txt.slice(0, Math.ceil(txt.length * t)); }, done:function(){ if (my !== barTok) return; $("#pq-sent").textContent = txt; $("#pq-sent-sr").textContent = txt; } }); }
    if (!b.rv) { barAnim = null; bars.render(); typeIt(); return; }
    barAnim = { t:0 };
    MV.tween({ dur:1000, ease:function(t){ return t; }, step:function(t){ if (my !== barTok) return; barAnim.t = t; bars.render(); }, done:function(){ if (my !== barTok) return; barAnim = null; bars.render(); typeIt(); } });
  }
  var barTok = 0;
  function clearSentence(){ barTok++; barAnim = null; $("#pq-sent").textContent = ""; }

  // ----- probe -----
  var pin = $("#pq-pin");
  function setProbe(i, how){
    i = clamp(Math.round(i), -60, 60);
    var changed = i !== S.i; S.i = i; save();
    var from = px, to = i / 20;
    if (how === "drag" || how === "tap" || how === "anim" || MV.reduceMotion) { px = to; afterProbe(changed, how); }
    else { var my = ++glideTok; MV.tween({ dur:150, step:function(t){ if (my !== glideTok) return; px = from + (to - from) * t; drawGraphs(); }, done:function(){ if (my !== glideTok) return; px = to; afterProbe(changed, how); } }); }
  }
  var glideTok = 0;
  function afterProbe(changed, how){
    drawGraphs(); bars.render(); paintRead(); paintProbeOut(); MV.changed();
    if (changed && how !== "anim") { clearSentence(); clearTimeout(autoTimer); autoTimer = setTimeout(function(){ if (!busyPred) playBars(); }, 400); }
  }
  function paintProbeOut(){ pin.value = S.i; $("#pq-pout").innerHTML = M("x = " + num(S.i / 20, 2)); pin.setAttribute("aria-valuetext", "x = " + num(S.i / 20, 2)); }
  pin.addEventListener("input", function(){ user(); setProbe(+pin.value, "slider"); });
  function lmXs(){ var xs = []; landmarks().forEach(function(l){ var i = Math.round(l.x * 20); if (xs.indexOf(i) < 0) xs.push(i); }); return xs.sort(function(a, b){ return a - b; }); }
  function jumpLm(d){ var xs = lmXs(), i = S.i, t = null; if (d > 0) { for (var k = 0; k < xs.length; k++) if (xs[k] > i) { t = xs[k]; break; } } else { for (var j = xs.length - 1; j >= 0; j--) if (xs[j] < i) { t = xs[j]; break; } } if (t != null) setProbe(t, "key"); }
  $("#pq-lprev").addEventListener("click", function(){ user(); jumpLm(-1); });
  $("#pq-lnext").addEventListener("click", function(){ user(); jumpLm(1); });
  $("#pq-show").addEventListener("click", function(){ clearTimeout(autoTimer); playBars(); });
  function dragFor(p, handle){
    if (handle) MV.drag(p, { axis:"x", step:{ x:0.05, y:0.05 }, big:10,
      handles:function(){ return S.mode === "spring" ? [] : [{ id:"probe", x:px, y:p.v ? p.v.ymin + (p.v.ymax - p.v.ymin) * 0.06 : 0, label:"Probe at x = " + num(S.i / 20, 2) + ". Arrow keys move it." }]; },
      snap:function(x, y){ return [Math.round(clamp(x, -3, 3) * 20) / 20, y]; },
      move:function(id, x, y, how){ user(); setProbe(Math.round(x * 20), how === "key" ? "key" : "drag"); },
      key:function(id, e){
        if (e.key === "Home") { user(); setProbe(-60, "key"); return true; }
        if (e.key === "End") { user(); setProbe(60, "key"); return true; }
        if (e.key === "PageUp") { user(); jumpLm(-1); return true; }
        if (e.key === "PageDown") { user(); jumpLm(1); return true; }
        if (e.key === "Enter") { playBars(); return true; }
        return false;
      } });
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
    p.c.addEventListener("pointerdown", function(e){ if (e.defaultPrevented || S.mode === "spring") return; active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {} user(); setProbe(Math.round(clamp(at(e), -3, 3) * 20), "tap"); });
    p.c.addEventListener("pointermove", function(e){ if (active) setProbe(Math.round(clamp(at(e), -3, 3) * 20), "drag"); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  }
  dragFor(ov, true); stp.forEach(function(p, k){ dragFor(p, k === 2); });

  // ----- trace -----
  function trace(o, done){
    var my = o.tok != null ? o.tok : ++anim, k = key(), speed = o.speed || 1, pauseMs = o.pause == null ? 300 : o.pause;
    if (!o.keep) ext[k] = { lo:o.from, hi:o.from };
    var dir = o.to > o.from ? 1 : -1, x = o.from, lm = landmarks(), last = null, pauseLeft = 0;
    if (MV.reduceMotion) {
      var e = ext[k]; e.lo = Math.min(e.lo, o.to, o.from); e.hi = Math.max(e.hi, o.to, o.from);
      lm.forEach(function(l){ if (l.kind === "asym") asyT[l.x] = 1; });
      setProbe(Math.round(o.to * 20), "anim"); finish(); return;
    }
    function upd(){ var e = ext[k]; if (dir > 0) e.hi = Math.max(e.hi, x); else e.lo = Math.min(e.lo, x); }
    function frame(now){
      if (my !== anim) return;
      if (last == null) last = now; var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (pauseLeft > 0) { pauseLeft -= dt * 1000; requestAnimationFrame(frame); return; }
      var nx = x + dir * dt * speed;
      var hit = lm.filter(function(l){ return dir > 0 ? (l.x > x + 1e-9 && l.x <= nx) : (l.x < x - 1e-9 && l.x >= nx); });
      if (hit.length) {
        nx = hit[0].x; if (dir < 0) nx = hit[hit.length - 1].x;
        lm.filter(function(l){ return Math.abs(l.x - nx) < 1e-9 && l.kind === "asym"; }).forEach(function(l){ asyT[l.x] = 0; MV.tween({ dur:300, step:function(t){ asyT[l.x] = t; drawGraphs(); } }); });
        pauseLeft = pauseMs;
      }
      if (dir > 0 ? nx >= o.to : nx <= o.to) nx = o.to;
      x = nx; upd(); px = x; var ni = Math.round(x * 20);
      if (ni !== S.i) { S.i = ni; paintRead(); paintProbeOut(); bars.render(); }
      drawGraphs();
      if (x === o.to) { setProbe(Math.round(o.to * 20), "anim"); finish(); return; }
      requestAnimationFrame(frame);
    }
    function finish(){
      var e = ext[k];
      if (!o.noMark && e.lo <= -3 + 1e-9 && e.hi >= 3 - 1e-9) { S.traced[k] = true; S.whole[k] = true; save(); }
      drawGraphs(); paintCtl(); if (done) done();
    }
    requestAnimationFrame(frame);
  }
  $("#pq-trace").addEventListener("click", function(){ user(); clearSentence(); asyT = {}; var k = key(); S.whole[k] = false; trace({ from:-3, to:3 }); });
  $("#pq-whole").addEventListener("click", function(){ var k = key(); if (!S.traced[k]) return; S.whole[k] = S.whole[k] === false; save(); paintCtl(); drawGraphs(); paintRead(); });
  $("#pq-tf").addEventListener("click", function(){ user(); S.fences = !S.fences; save(); if (S.fences) flipFence(); else fenceT = 0; paintAll(); });
  $("#pq-tl").addEventListener("click", function(){ user(); S.marks = !S.marks; save(); paintAll(); });
  function flipFence(){ fenceT = 0; MV.tween({ dur:500, step:function(t){ fenceT = t; drawGraphs(); } }); }
  function fade(){ fadeT = 0; MV.tween({ dur:300, step:function(t){ fadeT = t; drawGraphs(); } }); }
  function changedPair(){ save(); clearSentence(); asyT = {}; if (!S.fences || !GM[S.g].wave) fenceT = S.fences ? 1 : 0; fade(); paintAll(); MV.changed(); }
  function setMode(v){
    S.mode = v; if (v === "div" && S.g === "sin") S.g = "cos";
    zoom = null; zT = 0; save(); clearSentence(); asyT = {}; fade(); paintAll(); MV.changed();
  }

  // ----- readout -----
  function paintRead(){
    var R = $("#pq-read");
    if (S.mode === "spring") { R.innerHTML = MV.readoutHTML(springRows()); paintCloser(); return; }
    $("#pq-closer").textContent = "";
    var F = FM[S.f], G = GM[S.g], i = S.i, x = num(i / 20, 2), fv = fVal(S.f, i), gv = gVal(S.g, i), rv = combo(S.mode, fv, gv), mul = S.mode === "mul", op = mul ? "f · g" : "f/g";
    var fz = isZero(fv), gz = isZero(gv), rows = [];
    rows.push(["Combination", M(comboSrc(S.mode, S.f, S.g))]);
    rows.push(["Probe", M("x = " + x)]);
    rows.push([M("f(x)"), M("f(" + x + ")" + (vx(fv) ? " = " : " ≈ ") + vt(fv))]);
    var gTxt = G.wave ? angSrc(G.fn, i) + (vx(gv) ? " = " : " ≈ ") + vt(gv) : vt(gv);
    rows.push([M("g(x)"), M("g(" + x + ")" + (G.wave || vx(gv) ? " = " : " ≈ ") + gTxt)]);
    var res;
    if (!rv) res = M("(f/g)(" + x + ")") + " is undefined: " + M("g(" + x + ") = 0");
    else { var ap = !vx(fv) || !vx(gv); res = M("(" + op + ")(" + x + ")" + (ap ? " ≈ " : " = ") + vt(fv) + (mul ? " × " : " ÷ ") + par(vt(gv)) + (ap && !vx(rv) ? " ≈ " : " = ") + vt(rv)); }
    rows.push(["Result", res]);
    var hideWhy = S.setup === "tc3" && mul;
    if (!hideWhy) {
      var sg;
      if (mul) sg = fz && gz ? "`f(x) = 0` and `g(x) = 0`, so `f · g = 0`" : fz ? "`f(x) = 0`, so `f · g = 0`" : gz ? "`g(x) = 0`, so `f · g = 0`" : signSent(fv.v, gv.v, true);
      else sg = gz ? "`g(x) = 0`, so `f/g` is undefined" : fz ? "`f(x) = 0`, so `f/g = 0`" : signSent(fv.v, gv.v, false);
      rows.push(["Signs", md(sg)]);
      rows.push(["What’s happening here", md(whatMsg(fv, gv))]);
    }
    rows.push(["Domain", M(mul ? "{x ∈ ℝ}" : S.g === "cos" ? "{x ∈ ℝ | x ≠ ±1/2, ±3/2, ±5/2, …}" : S.g === "xp1" ? "{x ∈ ℝ | x ≠ -1}" : "{x ∈ ℝ | x ≠ -2, x ≠ 2}")]);
    rows.push(["Zeros in the window", md(zerosTxt())]);
    if (!mul) rows.push(["Breaks", md(breaksTxt())]);
    rows.push(["Symmetry", md(symTxt())]);
    if (G.wave) rows.push(["Fence", md(mul ? "`|" + G.src + "| ≤ 1`, so `f · g` stays between `y = f(x)` and `y = -f(x)`." : "`|" + G.src + "| ≤ 1`, so `|f/g| ≥ |f|`: the graph stays outside the fence.")]);
    R.innerHTML = MV.readoutHTML(rows);
    $("#pq-cap").innerHTML = M(comboSrc(S.mode, S.f, S.g));
    $("#pq-flash").innerHTML = flash;
  }
  function signSent(f, g, mul){
    var w = function(v){ return v > 0 ? "positive" : "negative"; }, s = function(v){ return v > 0 ? "> 0" : "< 0"; };
    var r = f * g, op = mul ? "f · g" : "f/g";
    return "`f " + s(f) + "` and `g " + s(g) + "`, so `" + op + " " + s(r) + "` (" + w(f) + (mul ? " × " : " ÷ ") + w(g) + " = " + w(r) + ")";
  }
  function whatMsg(fv, gv){
    var G = GM[S.g], fz = isZero(fv), gz = isZero(gv), g1 = isOne(gv, 1), gm = isOne(gv, -1), small = Math.abs(gv.v) < 1;
    if (S.mode === "mul") {
      if (fz && gz) return "Both factors are 0 here, so `f · g = 0`. Both change sign here, and the two sign changes cancel: the graph touches the `x`-axis without crossing.";
      if (fz) return "`f(x) = 0`, so `f · g = 0`, whatever `g` is. Only `f` changes sign here, so the graph crosses the `x`-axis.";
      if (gz) return "`g(x) = 0`, so `f · g = 0`, whatever `f` is. Only `g` changes sign here, so the graph crosses the `x`-axis.";
      if (g1) return "`g(x) = 1`, so `f · g = f(x)`: the graph meets `y = f(x)`" + (G.wave ? ", touching the fence" : "") + ".";
      if (gm) return "`g(x) = -1`, so `f · g = -f(x)`: the graph meets `y = -f(x)`" + (G.wave ? ", touching the fence" : "") + ".";
      if (small) return "`|g(x)| < 1`, so `|f · g| < |f|`: the product is smaller in size than `f(x)`.";
      return "`|g(x)| > 1`, so `|f · g| > |f|`: the product is bigger in size than `f(x)`.";
    }
    if (gz && !fz) return "`g(x) = 0`, so `f/g` is undefined. Close by, `f(x)` is divided by a tiny number, so `f/g` is huge: vertical asymptote `x = " + fr(S.i / 20) + "`.";
    if (gz && fz) return S.f === "xm2" ? "`f` and `g` are both 0, and 0/0 is undefined. They share the factor `x - 2`, which cancels: `f/g = 1/(x + 2)` for `x ≠ 2`. The graph has a hole at (2, 1/4)."
      : "`f` and `g` are both 0, and 0/0 is undefined. `4 - x^2 = -(x^2 - 4)`, so `f/g = -1` for `x ≠ ±2`. The graph has holes at (−2, −1) and (2, −1).";
    if (fz) return "`f(x) = 0` and `g(x) ≠ 0`, so `f/g = 0`: a zero of the quotient.";
    if (g1) return "`g(x) = 1`, so `f/g = f(x)`.";
    if (gm) return "`g(x) = -1`, so `f/g = -f(x)`.";
    if (small) return "`|g(x)| < 1`, so `|f/g| > |f|`: dividing by a number smaller than 1 in size makes the result bigger.";
    return "`|g(x)| > 1`, so `|f/g| < |f|`: dividing by a number bigger than 1 in size makes the result smaller.";
  }
  function zerosTxt(){
    var F = FM[S.f], G = GM[S.g], zs = [];
    if (S.mode === "mul") { F.zeros.concat(G.zeros).forEach(function(z){ if (zs.indexOf(z) < 0) zs.push(z); }); }
    else F.zeros.forEach(function(z){ if (G.zeros.indexOf(z) < 0) zs.push(z); });
    if (zs.length) return "`x = " + pmList(zs) + "`";
    var hs = S.mode === "div" ? F.zeros.filter(function(z){ return G.zeros.indexOf(z) >= 0; }) : [];
    if (hs.length === 1) return "None (at `x = " + fr(hs[0]) + "` the quotient has a hole, not a zero)";
    if (hs.length > 1) return "None (at `x = " + pmList(hs) + "` the quotient has holes, not zeros)";
    return "None";
  }
  function breaksTxt(){
    var L = landmarks(), as = L.filter(function(l){ return l.kind === "asym"; }).map(function(l){ return l.x; }), hs = L.filter(function(l){ return l.kind === "hole"; }), out = [];
    if (as.length) out.push((as.length > 1 ? "Vertical asymptotes " : "Vertical asymptote ") + "`x = " + pmList(as) + "`");
    if (hs.length) out.push((as.length ? "h" : "H") + (hs.length > 1 ? "oles at " : "ole at ") + hs.map(function(h){ return "(" + fr(h.x) + ", " + qSrc(h.q) + ")"; }).join(" and "));
    return out.length ? out.join("; ") : "None";
  }
  function symTxt(){
    var F = FM[S.f], G = GM[S.g], op = S.mode === "mul" ? "f · g" : "f/g";
    if (F.t !== "neither" && G.t !== "neither") return "`f` is " + F.t + " and `g` is " + G.t + ", so `" + op + "` is " + (F.t === G.t ? "even" : "odd");
    var cs = [1, 0.5, 1.5, 2, 2.5];
    for (var k = 0; k < cs.length; k++) {
      var i = Math.round(cs[k] * 20), a = combo(S.mode, fVal(S.f, i), gVal(S.g, i)), b = combo(S.mode, fVal(S.f, -i), gVal(S.g, -i));
      if (!a || !b) continue;
      var eq = a.q && b.q ? qeq(a.q, b.q) : Math.abs(a.v - b.v) < 1e-9, opp = a.q && b.q ? qeq(a.q, Q(-b.q.n, b.q.d)) : Math.abs(a.v + b.v) < 1e-9;
      if (eq || opp) continue;
      var tx = function(v){ return v.q ? " = " + qSrc(v.q) : " ≈ " + sig3(v.v); };
      return "Neither: `(" + op + ")(" + fr(cs[k]) + ")" + tx(a) + "` but `(" + op + ")(" + fr(-cs[k]) + ")" + tx(b) + "`";
    }
    return "Neither";
  }

  // @component springAnim — damped spring y = a·b^t·cos(πt): ceiling, zigzag spring and block sharing the graph's y-scale
  //   (own 120 px strip on phones), leader to the traced curve, fences, rings at whole seconds, Play/Pause/speed, G10 Look closer
  function bq(){ return BASES[S.bi]; }
  function bval(){ var b = bq(); return b[0] / b[1]; }
  function yS(t){ return S.a * Math.pow(bval(), t) * Math.cos(PI * t); }
  function fenceS(t){ return S.a * Math.pow(bval(), t); }
  function bSrc(){ var b = bq(); return b[1] === 1 ? "1" : b[0] + "/" + b[1]; }
  function bPar(){ var b = bq(); return b[1] === 1 ? "@b{1}" : "(@b{" + b[0] + "/" + b[1] + "})"; }
  function fenceVal(ti){ var b = bq(); if (ti % 20 === 0) { var k = ti / 20; return V(Q(S.a * Math.pow(b[0], k), Math.pow(b[1], k))); } return V(null, fenceS(ti / 20)); }
  function waveVal(ti){ return ti % 10 === 0 ? V(Q([1, 0, -1, 0][(ti / 10) % 4], 1)) : V(null, Math.cos(PI * ti / 20)); }
  function springRows(){
    var ti = S.ti, t = num(ti / 20, 2), F = fenceVal(ti), W = waveVal(ti), b = bq(), rows = [];
    rows.push(["Model", M("y = @a{" + S.a + "}" + bPar() + "^t cos(πt)")]);
    rows.push(["Time", M("t = " + t) + " s"]);
    var pw = ti % 20 === 0 ? "^" + (ti / 20) : "^{" + t + "}";
    rows.push(["Fence", M("@a{a} · @b{b}^t = " + S.a + " × " + (b[1] === 1 ? "1" : "(" + b[0] + "/" + b[1] + ")") + pw + (vx(F) ? " = " : " ≈ ") + vt(F)) + " cm"]);
    rows.push(["Wave", M("cos(πt) = " + angSrc("cos", ti) + (vx(W) ? " = " : " ≈ ") + vt(W))]);
    var Y = isZero(W) ? V(Q(0)) : (F.q && W.q ? V(qmul(F.q, W.q)) : V(null, F.v * W.v)), where;
    var yt = vt(Y), abs = yt.replace(MINUS, "");
    where = isZero(Y) ? "at rest" : Y.v > 0 ? abs + " cm above rest" : abs + " cm below rest";
    var hTxt = isZero(W) ? M("y = 0") + " cm" : (vx(F) && W.q ? M("y = " + vt(F) + " × " + par(vt(W)) + (vx(Y) ? " = " : " ≈ ") + yt) + " cm" : M("y ≈ " + yt) + " cm");
    rows.push(["Height", hTxt + ": " + where]);
    var what = isOne(W, 1) ? "`cos(πt) = 1`: the mass is at the top of a swing, touching the upper fence." : isOne(W, -1) ? "`cos(πt) = -1`: the mass is at the bottom of a swing, touching the lower fence." : isZero(W) ? "`cos(πt) = 0`: the mass is passing through rest. The fence doesn’t matter here: anything times 0 is 0." : "The mass is between rest and the fence, because `cos(πt)` is between −1 and 1.";
    rows.push(["What’s happening", md(what)]);
    rows.push(["Damping", md(b[1] === 1 ? "`b = 1`: the fence never shrinks. No damping, so the spring swings forever." : "Each second, the fence is multiplied by `b = " + bSrc() + "`.")]);
    rows.push(["Passes through rest", md("`t = 0.5`, 1.5, 2.5, … s")]);
    $("#pq-cap").innerHTML = M("y = @a{" + S.a + "}" + bPar() + "^t cos(πt)");
    return rows;
  }
  function paintCloser(){
    var el = $("#pq-closer");
    if (!zoom || zT < 1 || S.bi === 4) { el.textContent = ""; return; }
    var t = S.ti / 20, n = Math.round(t); if (n < 1 || Math.abs(t - n) > 0.5) { el.textContent = ""; return; }
    var b = bval(), ts = n + Math.atan(Math.log(b) / PI) / PI, ys = yS(ts), top = n % 2 === 0, Ft = fenceVal(n * 20);
    el.innerHTML = md(top ? "The top of this swing comes a little <strong>before</strong> the touch point: the fence is falling, so the swing peaks early. With `a = " + S.a + "` and `b = " + bSrc() + "`, the top is at `t ≈ " + sig3(ts) + "` s, about " + sig3(ys) + " cm, and the touch is at `t = " + n + "` s, at " + vt(Ft) + " cm."
      : "The bottom of this swing comes a little <strong>before</strong> the touch point: the fence is falling, so the swing turns early. With `a = " + S.a + "` and `b = " + bSrc() + "`, the bottom is at `t ≈ " + sig3(ts) + "` s, about " + sig3(-ys) + " cm below rest, and the touch is at `t = " + n + "` s, " + vt(Ft) + " cm below rest.");
  }
  function sView(){
    var full = { xmin:-0.25, xmax:8.25, ymin:-springY, ymax:springY };
    if (!zoom || zT <= 0) return full;
    var zv = zoom, e = zT;
    return { xmin:full.xmin + (zv.xmin - full.xmin) * e, xmax:full.xmax + (zv.xmax - full.xmax) * e, ymin:full.ymin + (zv.ymin - full.ymin) * e, ymax:full.ymax + (zv.ymax - full.ymax) * e };
  }
  sg.render = function(){
    var t = tf, ink = css("--ink"), pen = css("--pen"), v = sView(), curves = [];
    if (S.sf && sfT > 0) {
      curves.push({ f:fenceS, color:pen, width:2.2, domain:[0, 8 * sfT] }, { f:function(x){ return -fenceS(x); }, color:pen, width:2, dash:[6, 4], domain:[0, 8 * sfT] });
    }
    sg.draw({ view:v, xTicks:{ step:zoom && zT > 0.5 ? 0.25 : 1 }, xLabel:"t (s)", yLabel:"y (cm)",
      regions:S.sf && sfT >= 1 ? [{ f:fenceS, g:function(x){ return -fenceS(x); }, x0:0, x1:8 }] : [], curves:curves,
      after:function(ctx, p){
        if (t > 0) p.curve({ f:yS, color:ink, width:3.4, domain:[0, t] });
        var fM = "600 12px " + (p.fontUI || "sans-serif");
        for (var n = 0; n <= Math.floor(t + 1e-9); n++) ring(ctx, p, n, yS(n), 6);
        for (var h = 0.5; h <= t + 1e-9; h += 1) p.point({ x:h, y:0, r:4, color:ink });
        var nl = Math.floor(t + 1e-9);
        if (nl >= 1 || t > 0.2) { var F = fenceVal(nl * 20), Wv = waveVal(nl * 20), Yv = F.q ? V(qmul(F.q, Wv.q)) : V(null, F.v * Wv.v), cap = "t = " + nl + ": " + vt(F) + " × " + par(vt(Wv)) + (vx(Yv) ? " = " : " ≈ ") + vt(Yv) + " cm";
          bgText(ctx, cap, clamp(p.X(nl), 70, p.W - 70), clamp(p.Y(yS(nl)) + (yS(nl) >= 0 ? -18 : 18), 10, p.H - 10), ink, fM); }
        var Y = p.Y(yS(t));
        ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.setLineDash([2, 4]); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(p.X(t), Y); ctx.stroke(); ctx.restore();
        p.point({ x:t, y:yS(t), r:6, color:ink, ring:true });
        if (S.sf && sfT >= 1) { var x0 = Math.min(1.2, 7); bgText(ctx, "y = " + S.a + "(" + bSrc() + ")ᵗ", p.X(x0), p.Y(fenceS(x0)) - 13, pen, "italic 600 12px " + (p.fontM || "serif"), "left"); }
      },
      describe:"Spring graph: y = " + S.a + "(" + bSrc() + ")^t cos(πt) for t from 0 to 8 s, traced up to t = " + num(t, 2) + " s, where y ≈ " + sig3(yS(t)) + " cm." + (S.sf ? " Fences y = ±" + S.a + "(" + bSrc() + ")^t are drawn." : "") });
  };
  spc.render = function(){
    spc.draw({ grid:false, axes:false, ticks:false, view:{ xmin:0, xmax:1, ymin:-springY, ymax:springY },
      after:function(ctx, p){
        var ink = css("--ink"), W = p.W, H = p.H, cx = W / 2, y = yS(tf), Yb = p.Y(y), bs = Math.min(30, W * 0.35, H * 0.18), ceil = 8;
        ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(4, p.Y(0)); ctx.lineTo(W - 4, p.Y(0)); ctx.stroke(); ctx.restore();
        bgText(ctx, "rest", 6, p.Y(0) - 9, css("--ink-2"), "600 11px " + (p.fontUI || "sans-serif"), "left");
        ctx.fillStyle = ink; ctx.fillRect(cx - bs, 2, 2 * bs, ceil - 2);
        ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); var y0 = ceil, y1 = Yb - bs / 2, n = 10, amp = Math.min(12, W * 0.18);
        ctx.moveTo(cx, y0); for (var k = 1; k < n; k++) ctx.lineTo(cx + (k % 2 ? amp : -amp), y0 + (y1 - y0) * k / n); ctx.lineTo(cx, y1); ctx.stroke();
        ctx.fillStyle = ink; ctx.fillRect(cx - bs / 2, Yb - bs / 2, bs, bs);
      },
      describe:"Spring drawing: a block hanging from a ceiling on a zigzag spring, " + (Math.abs(yS(tf)) < 1e-9 ? "at rest" : sig3(Math.abs(yS(tf))) + " cm " + (yS(tf) > 0 ? "above" : "below") + " rest") + "." });
  };
  function rescaleSpring(){ var from = springY, to = 1.25 * S.a; zoom = null; zT = 0; $("#pq-zoom").setAttribute("aria-pressed", "false"); MV.tween({ dur:400, step:function(t){ springY = from + (to - from) * t; drawGraphs(); } }); }
  var tin = $("#pq-tin");
  function setT(ti, keepF){ S.ti = clamp(Math.round(ti), 0, 160); if (!keepF) tf = S.ti / 20; save(); tin.value = S.ti; $("#pq-tout").innerHTML = M("t = " + num(S.ti / 20, 2)) + " s"; tin.setAttribute("aria-valuetext", num(S.ti / 20, 2) + " seconds"); drawGraphs(); paintRead(); MV.changed(); }
  tin.addEventListener("input", function(){ user(); setT(+tin.value); });
  var playTok = 0;
  function stopPlay(){ if (playing) { playing = false; playTok++; paintPlay(); } }
  function paintPlay(){ $("#pq-play").textContent = MV.reduceMotion ? "Step +0.5 s" : playing ? "Pause" : "Play"; }
  function play(to, cb, speed){
    if (MV.reduceMotion) { setT(Math.min(160, S.ti + 10)); if (cb) cb(); return; }
    if (tf >= 8 - 1e-9 && to == null) { tf = 0; }
    playing = true; paintPlay(); var my = ++playTok, last = null, lastR = 0, end = to == null ? 8 : to;
    function frame(now){
      if (my !== playTok) return;
      if (last == null) last = now; var dt = Math.min(0.05, (now - last) / 1000); last = now;
      tf = Math.min(end, tf + dt * (speed || S.speed)); S.ti = Math.round(tf * 20);
      if (now - lastR > 110 || tf >= end) { lastR = now; tin.value = S.ti; $("#pq-tout").innerHTML = M("t = " + num(S.ti / 20, 2)) + " s"; paintRead(); }
      drawGraphs();
      if (tf >= end) { playing = false; paintPlay(); setT(S.ti, true); if (cb) cb(); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  $("#pq-play").addEventListener("click", function(){ if (playing) { stopPlay(); setT(S.ti, true); return; } anim++; play(); });
  $("#pq-stf").addEventListener("click", function(){ user(); S.sf = !S.sf; sfT = 1; save(); paintAll(); });
  $("#pq-zoom").addEventListener("click", function(){
    user();
    if (zoom) { MV.tween({ dur:400, step:function(t){ zT = 1 - t; drawGraphs(); }, done:function(){ zoom = null; zT = 0; paintAll(); } }); $("#pq-zoom").setAttribute("aria-pressed", "false"); return; }
    var t = S.ti / 20, y = yS(t), hw = 8.5 / 8, hh = springY / 4, cxx = clamp(t, -0.25 + hw, 8.25 - hw);
    zoom = { xmin:cxx - hw, xmax:cxx + hw, ymin:y - hh, ymax:y + hh };
    $("#pq-zoom").setAttribute("aria-pressed", "true");
    MV.tween({ dur:400, step:function(t2){ zT = t2; drawGraphs(); }, done:function(){ zT = 1; paintRead(); } });
  });
  MV.drag(sg, { axis:"x", step:{ x:0.05, y:0.05 }, big:10,
    handles:function(){ return S.mode === "spring" ? [{ id:"t", x:tf, y:yS(tf), label:"Time t = " + num(S.ti / 20, 2) + " s. Arrow keys move it; Space plays or pauses." }] : []; },
    snap:function(x, y){ return [Math.round(clamp(x, 0, 8) * 20) / 20, y]; },
    move:function(id, x){ user(); setT(Math.round(x * 20)); },
    key:function(id, e){ if (e.key === " " || e.key === "Spacebar") { if (playing) { stopPlay(); setT(S.ti, true); } else { anim++; play(); } return true; } return false; } });

  // ----- paint everything -----
  function drawGraphs(){
    if (S.mode === "spring") { sg.render(); spc.render(); return; }
    if (S.view === "overlay") ov.render(); else stp.forEach(function(p){ p.render(); });
  }
  function paintCtl(){
    var k = key(), tr = !!S.traced[k];
    var wb = $("#pq-whole"); wb.disabled = !tr; wb.setAttribute("aria-pressed", String(tr && S.whole[k] !== false));
    wb.textContent = tr ? "Show whole graph" : "Show whole graph (after a full trace)";
    $("#pq-show").textContent = S.mode === "div" ? "Show the division" : "Show the multiplication";
    var tfb = $("#pq-tf"); tfb.hidden = !GM[S.g].wave; tfb.setAttribute("aria-pressed", String(!!S.fences));
    $("#pq-tl").setAttribute("aria-pressed", String(!!S.marks));
    $("#pq-stf").setAttribute("aria-pressed", String(!!S.sf));
  }
  function paintAll(){
    var spr = S.mode === "spring";
    modeR.set(S.mode); viewR.set(S.view); fR.set(S.f); gR.set(S.g); bR.set(String(S.bi)); spdR.set(String(S.speed));
    $("#pq-view").hidden = spr; $("#pq-menus").hidden = spr;
    $("#pq-ov").hidden = spr || S.view !== "overlay"; $("#pq-st").hidden = spr || S.view !== "stacked"; $("#pq-sp").hidden = !spr;
    $("#pq-bb").hidden = spr; $("#pq-sent").hidden = spr;
    $("#pq-ctl-md").hidden = spr; $("#pq-ctl-sp").hidden = !spr;
    gR.off(S.mode === "div" ? ["sin"] : []);
    fR.lock(lockedF());
    var note = "";
    if (S.mode === "div") note += "Dividing by " + M("sin(πx)") + " makes holes whose heights need ideas from calculus, so it’s switched off here. ";
    if (lockedF()) note += '<strong>Challenge 2:</strong> ' + M("f") + " is locked at " + M("4 - x^2") + '. <button type="button" class="linkbtn" id="pq-unlock">Unlock</button>';
    $("#pq-note").innerHTML = note;
    aSl.set("pqa", S.a);
    paintPlay(); paintCtl(); paintProbeOut(); setT(S.ti, true);
    drawGraphs(); bars.render(); paintRead();
  }
  $("#pq-note").addEventListener("click", function(e){ if (e.target.id === "pq-unlock") { S.setup = null; save(); paintAll(); } });

  // ----- challenges -----
  var chalHost = $("#chal");
  function solved(id){ return MV.S.chal && MV.S.chal[id] && MV.S.chal[id].solved; }
  function setup(id){
    anim++; stopPlay(); hideRes = false; forced = {}; guideT = 1; fold = null; flash = ""; clearSentence();
    S.setup = id;
    if (id === "tc1") { S.mode = "spring"; S.a = 12; S.bi = 2; S.ti = 0; tf = 0; springY = 1.25 * S.a; zoom = null; zT = 0; }
    if (id === "tc2") { S.mode = "div"; S.f = "4mx2"; S.g = "xp1"; S.i = 0; px = 0; }
    if (id === "tc3") { S.mode = "mul"; S.f = "x"; S.g = "cos"; S.i = 0; px = 0; }
    save(); fenceT = S.fences ? 1 : 0; paintAll(); MV.changed();
    MV.banner("", "Challenge " + id.slice(2) + " is set up.");
    var g = $("#ex-app [data-mv=graph]"), r = g.getBoundingClientRect();
    if (r.top < 60 || r.top > window.innerHeight * 0.5) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  }
  function inject(){
    if (!chalHost) return;
    $$(".chal[data-c]", chalHost).forEach(function(box){
      var qa = box.querySelector(".q-actions"); if (!qa || qa.querySelector("[data-setup]")) return;
      var b = document.createElement("button"); b.type = "button"; b.className = "btn ghost sm"; b.dataset.setup = box.dataset.c; b.dataset.k = box.dataset.c + "setup"; b.textContent = "Set up this challenge";
      qa.insertBefore(b, qa.firstChild);
    });
    if (S.setup && solved(S.setup)) { S.setup = null; save(); paintAll(); }
  }
  if (chalHost) {
    new MutationObserver(inject).observe(chalHost, { childList:true, subtree:true });
    chalHost.addEventListener("click", function(e){ var b = e.target.closest("[data-setup]"); if (b && !busyPred) setup(b.dataset.setup); });
    setTimeout(inject, 0);
  }
  function challenge(id){
    if (id === "tc1") {
      var a = S.a, b = bq();
      if (a === 16 && b[0] === 1 && b[1] === 2) return { ok:true };
      if (b[1] === 1) return { ok:false, msg:md("With `b = 1` the fence never shrinks, so `y(4) = a`, and the smallest `a` is 2.") };
      if (b[0] === 1 && b[1] === 2 && a === 8) return { ok:false, msg:md("`y(4) = 8 × 1/16 = 1/2` cm. `8 × (1/2)^3 = 1` is the size of the swing at `t = 3`, but there the mass is below rest, and by `t = 4` the fence has halved again.") };
      if (b[0] === 1 && b[1] === 2 && a === 4) return { ok:false, msg:md("`y(4) = 4 × 1/16 = 1/4` cm. (`4 × (1/2)^2 = 1` is the height at `t = 2`.)") };
      var y4 = Q(a * Math.pow(b[0], 4), Math.pow(b[1], 4)), txt = finDec(y4) ? num(qv(y4), 4) : qSrc(y4) + " ≈ " + sig3(qv(y4));
      return { ok:false, msg:md("Right now `y(4) = a × b^4 =` " + txt + " cm. You need exactly 1.") };
    }
    if (id === "tc2") {
      if (S.mode !== "div") return { ok:false, msg:md("This challenge is about the quotient `f/g`. Switch to Divide.") };
      if (S.f !== "4mx2") return { ok:false, msg:md("This challenge uses `f(x) = 4 - x^2`. Press Set up this challenge to lock it in.") };
      if (S.g === "x2m4") return Math.abs(S.i) === 40 ? { ok:true } : { ok:false, msg:md("This `g` works. Now find the hole: where are `f` and `g` both 0?") };
      if (S.g === "xp1") return { ok:false, msg:md("`x + 1` is 0 only at `x = -1`, and `f(-1) = 3`, not 0. So `f/g` has a vertical asymptote there, not a hole.") };
      return { ok:false, msg:md("`cos(πx)` is 0 at ±1/2, ±3/2 and ±5/2, and `f` isn’t 0 at any of them: those are asymptotes. At `x = ±2`, `f = 0` but `cos 2π = 1`, so `f/g = 0` there: zeros, not holes.") };
    }
    if (id === "tc3") {
      if (S.mode !== "mul") return { ok:false, msg:md("This challenge is about the product `f · g`.") };
      var fz = FM[S.f].zeros.indexOf(2) >= 0, gz = GM[S.g].zeros.indexOf(2) >= 0;
      if (fz && gz) return S.i === 40 ? { ok:true } : { ok:false, msg:"Your functions work. Now put the probe at " + M("x = 2") + "." };
      if (fz) return { ok:false, msg:md("`f(2) = 0`, so `f · g` is 0 at `x = 2`. But `g(2)` isn’t 0, so only `f` changes sign there, and the graph crosses. Compare the sign of `f · g` just left and just right of 2.") };
      if (gz) return { ok:false, msg:md("`g(2) = 0`, so the graph does pass through (2, 0). But `f(2)` isn’t 0, so only `g` changes sign: the graph crosses.") };
      var v = combo("mul", fVal(S.f, 40), gVal(S.g, 40));
      return { ok:false, msg:md("Neither factor is 0 at `x = 2`: `(f · g)(2) = " + qSrc(v.q) + "`.") };
    }
    return { ok:false };
  }

  // ----- predictions -----
  function step(list, k, cb){ if (k >= list.length) { cb(); return; } list[k](function(){ step(list, k + 1, cb); }); }
  function W(ms, my, fn){ MV.wait(ms, function(){ if (my === anim) fn(); }); }
  var predict = {
    start:function(p){
      anim++; stopPlay(); busyPred = true; S.setup = null; forced = {}; fold = null; flash = ""; clearSentence(); asyT = {};
      var s = p.start;
      S.mode = s.mode;
      if (s.mode === "spring") { S.a = s.a; S.bi = 0; S.ti = 0; tf = 0; S.sf = true; sfT = 0; springY = 1.25 * S.a; zoom = null; zT = 0; }
      else {
        S.view = s.view; S.f = s.f; S.g = s.g; S.i = Math.round((s.x || 0) * 20); px = S.i / 20; if (s.fences) S.fences = true;
        hideRes = true; ext[key()] = null; guideT = p.id === "p1" ? 0 : 1; fenceT = S.fences ? 1 : 0;
      }
      save(); paintAll();
    },
    run:function(p, done){
      var my = anim; pendingDone = done;
      function end(){ if (!pendingDone) return; pendingDone = null; busyPred = false; hideRes = false; paintAll(); MV.changed(); done(); }
      if (p.id === "p1") {
        step([
          function(n){ MV.tween({ dur:700, step:function(t){ if (my === anim) { guideT = t; drawGraphs(); } }, done:function(){ if (my === anim) n(); } }); },
          function(n){ W(300, my, n); },
          function(n){ trace({ from:-3, to:3, speed:2.2, pause:220, tok:my }, function(){ if (my === anim) n(); }); }
        ], 0, end);
      } else if (p.id === "p2") {
        step([
          function(n){ MV.tween({ dur:700, ease:function(t){ return t; }, step:function(t){ if (my === anim) { sfT = t; drawGraphs(); } }, done:function(){ if (my === anim) { sfT = 1; n(); } } }); },
          function(n){ W(300, my, n); },
          function(n){ if (MV.reduceMotion) { tf = 4; setT(80); n(); return; } play(4, function(){ if (my === anim) n(); }, 1); }
        ], 0, function(){ S.sf = true; end(); });
      } else if (p.id === "p3") {
        var pts = [30, 38, 39], pts2 = [-30, -38, -39];
        var seq = [];
        pts.forEach(function(i){ seq.push(function(n){ setProbe(i, "anim"); playBars(); W(MV.reduceMotion ? 50 : 1150, my, n); }); });
        seq.push(function(n){ forced["hole2"] = true; drawGraphs(); W(700, my, n); });
        pts2.forEach(function(i){ seq.push(function(n){ setProbe(i, "anim"); playBars(); W(MV.reduceMotion ? 50 : 1150, my, n); }); });
        seq.push(function(n){ forced["asym-2"] = true; asyT[-2] = 0; MV.tween({ dur:300, step:function(t){ if (my === anim) { asyT[-2] = t; drawGraphs(); } }, done:function(){ if (my === anim) W(400, my, n); } }); });
        step(seq, 0, end);
      } else if (p.id === "p4") {
        step([
          function(n){ trace({ from:0, to:3, speed:2.2, pause:150, noMark:true, tok:my }, function(){ if (my === anim) n(); }); },
          function(n){ fold = { t:0, hi:3 }; MV.tween({ dur:800, step:function(t){ if (my === anim) { fold.t = t; drawGraphs(); } }, done:function(){ if (my === anim) W(300, my, n); } }); },
          function(n){ trace({ from:0, to:-3, speed:2.2, pause:150, keep:true, tok:my }, function(){ if (my === anim) n(); }); },
          function(n){ fold = null; flash = md("`(f · g)(1.5) = 1.5 × (-1) = -1.5`<br>`(f · g)(-1.5) = (-1.5) × 1 = -1.5`"); setProbe(30, "anim"); W(900, my, function(){ setProbe(-30, "anim"); W(900, my, n); }); }
        ], 0, end);
      } else end();
    }
  };

  // ----- prediction tally (AS) under the prediction dots -----
  var predHost = $("#pred");
  function tally(){
    if (!predHost) return; var top = predHost.querySelector(".pred-top"); if (!top || predHost.querySelector(".pq-tally")) return;
    var P = C.predictions || [], made = P.filter(function(q){ return MV.S.preds && MV.S.preds[q.id]; }), ok = made.filter(function(q){ return MV.S.preds[q.id].correct; }).length;
    if (!made.length) return;
    var el = document.createElement("p"); el.className = "tiny muted pq-tally"; el.textContent = "Your predictions so far: " + ok + " of " + made.length + " matched";
    top.parentNode.insertBefore(el, top.nextSibling);
  }
  if (predHost) { new MutationObserver(tally).observe(predHost, { childList:true }); setTimeout(tally, 0); }

  paintAll();
  return { predict:predict, challenge:function(id){ return challenge(id); } };
}

// =====================================================================================================
// PART 3: Sign and shape
// @component N11 signChart.factorRows — chart builder whose rows are whole functions read from their graphs: tap critical values
//   on a half-unit number line, +/− chip pairs per interval for f, g and the result, a marker chip per critical value
//   (crosses/touches/asymptote/hole), confidence chips, per-cell feedback; graphs and chart share one x-scale and scroll together
// =====================================================================================================
var P3 = [
  { id:"A", op:"mul", xmin:-2.5, xmax:2.5, f:function(x){ return x * x - 1; }, g:function(x){ return Math.sin(PI * x); }, crit:[-2, -1, 0, 1, 2], zf:[-1, 1], zg:[-2, -1, 0, 1, 2], fy:[-2, 6], gy:[-1.5, 1.5], ry:[-6, 6], inf:false },
  { id:"B", op:"div", xmin:-4, xmax:6, f:function(x){ return x * x + x - 2; }, g:function(x){ return x * x - 4 * x + 3; }, crit:[-2, 1, 3], zf:[-2, 1], zg:[1, 3], fy:[-4, 12], gy:[-4, 12], ry:[-6, 6], inf:true, hole:{ x:1, y:-1.5, lab:"(1, " + MINUS + "3/2)" }, fAt:{ 3:"`f(3) = 10`" } },
  { id:"C", op:"div", xmin:0, xmax:2, f:function(x){ return Math.sin(PI * x); }, g:function(x){ return Math.cos(PI * x); }, crit:[0.5, 1, 1.5], zf:[1], zg:[0.5, 1.5], fy:[-1.5, 1.5], gy:[-1.5, 1.5], ry:[-4, 4], inf:false, ends:[0, 2], fAt:{ 0.5:"`sin(π/2) = 1`", 1.5:"`sin(3π/2) = -1`" } }
];
var MK = [["crosses", "crosses"], ["touches", "touches"], ["asym", "asymptote"], ["hole", "hole"]];
function caseInfo(cs){
  var b = (cs.inf ? [-Infinity] : [cs.xmin]).concat(cs.crit, cs.inf ? [Infinity] : [cs.xmax]), ints = [];
  for (var k = 0; k + 1 < b.length; k++) {
    var a = b[k], c = b[k + 1], va = isFinite(a) ? a : cs.xmin, vc = isFinite(c) ? c : cs.xmax, mid = (va + vc) / 2;
    var fs = Math.sign(cs.f(mid)), gs = Math.sign(cs.g(mid));
    ints.push({ a:a, b:c, mid:mid, lab:"", f:fs, g:gs, r:fs * gs });
  }
  ints.forEach(function(I){ I.lab = "(" + (I.a === -Infinity ? MINUS + "∞" : fr(I.a)) + ", " + (I.b === Infinity ? "∞" : fr(I.b)) + ")"; });
  var marks = cs.crit.map(function(c){ var fz = cs.zf.indexOf(c) >= 0, gz = cs.zg.indexOf(c) >= 0; return { x:c, fz:fz, gz:gz, ans:cs.op === "mul" ? (fz && gz ? "touches" : "crosses") : gz ? (fz ? "hole" : "asym") : "crosses" }; });
  var ticks = []; for (var t = Math.ceil(cs.xmin * 2) / 2; t <= cs.xmax + 1e-9; t += 0.5) ticks.push(Math.round(t * 2) / 2);
  return { ints:ints, marks:marks, ticks:ticks };
}
function part3(host, api){
  var S = api.S, CC = api.content.cases; S.c = S.c || 0; S.cs = S.cs || {};
  var cur = null, plots = {}, revealT = 1, msgs = null, conf = null;
  host.innerHTML = '<div class="chips" id="p3-cases" role="group" aria-label="Choose a case"></div><p class="eq-cap pq3-eq" id="p3-eq"></p><p class="pq3-step" id="p3-step"></p>' +
    '<div class="pq3-scroll"><div class="pq3-board" id="p3-board">' +
      '<div class="pq3-lab pq-fl">f</div><div class="pq3-cv"><canvas class="plot pq3-c" id="p3-f" role="img" aria-label="Graph of f"></canvas></div>' +
      '<div class="pq3-lab pq-gl">g</div><div class="pq3-cv"><canvas class="plot pq3-c" id="p3-g" role="img" aria-label="Graph of g"></canvas></div>' +
      '<div class="pq3-lab">x</div><div class="pq3-row pq3-ticks" id="p3-ticks" role="group" aria-label="Number line: tap where f or g is 0"></div>' +
      '<div class="pq3-lab pq3-hide" id="p3-hl"></div><div class="pq3-row pq3-head" id="p3-head"></div>' +
      '<div class="pq3-lab pq-fl pq3-hide">f</div><div class="pq3-row pq3-signs" id="p3-rf" role="group" aria-label="Signs of f"></div>' +
      '<div class="pq3-lab pq-gl pq3-hide">g</div><div class="pq3-row pq3-signs" id="p3-rg" role="group" aria-label="Signs of g"></div>' +
      '<div class="pq3-lab pq3-hide" id="p3-rl"></div><div class="pq3-row pq3-signs" id="p3-rr" role="group" aria-label="Signs of the result"></div>' +
      '<div class="pq3-lab pq3-hide pq3-small">marker</div><div class="pq3-row pq3-marks" id="p3-mk" role="group" aria-label="Markers at the critical values"></div>' +
      '<div class="pq3-lab" id="p3-gl"></div><div class="pq3-cv"><canvas class="plot pq3-c pq3-res" id="p3-r" role="img" aria-label="Graph of the result"></canvas></div>' +
    '</div></div>' +
    '<div id="p3-ctl"></div><div id="p3-fb" aria-live="polite"></div><details class="alg" id="p3-alg"><summary>Check it with algebra</summary><p id="p3-algt" style="margin:10px 0 0"></p></details>';
  ["f", "g", "r"].forEach(function(k){ plots[k] = new MV.Plot($("#p3-" + k), { xmin:-3, xmax:3, ymin:-2, ymax:2 }); });
  function cs(){ return P3[S.c]; }
  function st(){ var id = cs().id; return S.cs[id] || (S.cs[id] = { ticks:[], marked:false, help:false, f:{}, g:{}, r:{}, mk:{}, conf:null, tries:0, solved:false, first:null }); }
  function span(c){ var m = (c.xmax - c.xmin) * 0.045; return { lo:c.xmin - m, hi:c.xmax + m }; }
  function pct(x){ var c = cs(), s = span(c); return ((x - s.lo) / (s.hi - s.lo) * 100).toFixed(3) + "%"; }
  function view(c, y){ var s = span(c); return { xmin:s.lo, xmax:s.hi, ymin:y[0], ymax:y[1] }; }
  function tickStep(c){ return c.xmax - c.xmin > 6 ? 1 : 0.5; }
  plots.f.render = function(){ var c = cs(); plots.f.draw({ view:view(c, c.fy), xTicks:{ step:tickStep(c), fmt:function(t){ return fr(t); } }, after:function(ctx, p){ strokeFn(p, c.f, p.v.xmin, p.v.xmax, { color:css("--pen"), width:2.6 }); c.zf.forEach(function(z){ p.point({ x:z, y:0, r:4, color:css("--pen") }); }); }, points:[].map(function(z){ return { x:z, y:0, r:4, color:css("--pen") }; }), describe:"Graph of " + MV.plain(md(CC[S.c].f)) + " from x = " + fr(c.xmin) + " to " + fr(c.xmax) + "." }); };
  plots.g.render = function(){ var c = cs(); plots.g.draw({ view:view(c, c.gy), xTicks:{ step:tickStep(c), fmt:function(t){ return fr(t); } }, after:function(ctx, p){ strokeFn(p, c.g, p.v.xmin, p.v.xmax, { color:css("--f3"), width:2.6 }); c.zg.forEach(function(z){ p.point({ x:z, y:0, r:4, color:css("--f3") }); }); }, points:[].map(function(z){ return { x:z, y:0, r:4, color:css("--f3") }; }), describe:"Graph of " + MV.plain(md(CC[S.c].g)) + " from x = " + fr(c.xmin) + " to " + fr(c.xmax) + "." }); };
  plots.r.render = function(){
    var c = cs(), s = st(), I = caseInfo(c), v = view(c, c.ry), ink = css("--ink");
    var end = c.xmin + (c.xmax - c.xmin) * (s.solved ? revealT : 0), bands = [];
    plots.r.draw({ view:v, xTicks:{ step:tickStep(c), fmt:function(t){ return fr(t); } },
      after:function(ctx, p){
        if (!s.solved) { bgText(ctx, "The graph of " + MV.plain(md(CC[S.c].res)) + " draws here when your chart is right.", 12, p.H / 2 - 18, css("--ink-2"), "600 13px " + (p.fontUI || "sans-serif"), "left"); return; }
        I.ints.forEach(function(it){
          var a = Math.max(isFinite(it.a) ? it.a : v.xmin, v.xmin), b = Math.min(isFinite(it.b) ? it.b : v.xmax, end); if (b <= a) return;
          ctx.save(); ctx.fillStyle = css("--hi-soft"); var Y0 = p.Y(0); if (it.r > 0) ctx.fillRect(p.X(a), 0, p.X(b) - p.X(a), Y0); else ctx.fillRect(p.X(a), Y0, p.X(b) - p.X(a), p.H - Y0); ctx.restore();
        });
        var R = function(x){ return c.op === "mul" ? c.f(x) * c.g(x) : c.f(x) / c.g(x); };
        var brk = I.marks.filter(function(m){ return m.ans === "asym"; }).map(function(m){ return m.x; });
        if (end > v.xmin) drawPieces(p, R, c.inf ? v.xmin : c.xmin, Math.min(end, c.inf ? v.xmax : c.xmax), brk, { color:ink, width:3.4 });
        I.marks.forEach(function(m){
          if (m.x > end + 1e-9) return;
          if (m.ans === "asym") { vline(ctx, p, m.x, css("--ink-2"), [8, 6], 1.5); bgText(ctx, "x = " + fr(m.x), p.X(m.x), 12, css("--ink-2"), "italic 600 12px " + (p.fontM || "serif")); }
          else if (m.ans === "hole") { p.point({ x:m.x, y:c.hole.y, open:true, r:5.5, color:css("--pen") }); bgText(ctx, c.hole.lab, p.X(m.x) + 8, p.Y(c.hole.y) + 16, ink, "600 12px " + (p.fontM || "serif"), "left"); }
          else p.point({ x:m.x, y:0, r:5, color:ink });
        });
      },
      describe:s.solved ? "Graph of " + MV.plain(md(CC[S.c].res)) + ": positive on " + I.ints.filter(function(i){ return i.r > 0; }).map(function(i){ return i.lab; }).join(", ") + "; negative on " + I.ints.filter(function(i){ return i.r < 0; }).map(function(i){ return i.lab; }).join(", ") + "." : "Empty result graph: it draws when the chart is right." });
  };
  function signName(v){ return v > 0 ? "positive" : "negative"; }
  function sym(v){ return v > 0 ? "+" : MINUS; }
  function paint(){
    var c = cs(), s = st(), I = caseInfo(c), CCc = CC[S.c], res = MV.plain(md(CCc.res));
    $("#p3-cases").innerHTML = P3.map(function(x, k){ var lock = k > 0 && !(S.cs[P3[k - 1].id] && S.cs[P3[k - 1].id].solved), done = S.cs[x.id] && S.cs[x.id].solved; return '<button type="button" class="fchip" data-case="' + k + '" data-k="p3c' + k + '" aria-pressed="' + (k === S.c) + '"' + (lock ? " disabled" : "") + ">" + (done ? "✓ " : "") + "Case " + x.id + (lock ? " (after case " + P3[k - 1].id + ")" : "") + "</button>"; }).join("");
    $("#p3-eq").innerHTML = CCc.f + ", " + CCc.g + "; result " + CCc.res + (c.ends ? ' <span class="tiny muted">on ' + M("0 < x < 2") + "</span>" : "");
    $("#p3-rl").innerHTML = CCc.res; $("#p3-gl").innerHTML = CCc.res;
    $("#p3-step").innerHTML = !s.marked ? "<strong>Step 1.</strong> Tap every " + M("x") + " where " + M("f") + " or " + M("g") + " is 0." : s.solved ? "<strong>Done.</strong> Your chart is right, and the graph of " + CCc.res + " has drawn itself across it." : "<strong>Steps 2–4.</strong> Sign " + M("f") + " and " + M("g") + " on each interval, then sign the result and choose a marker at each critical value. Say how sure you are, then press <strong>Check chart</strong>.";
    // tick row
    var th = '<span class="pq3-axis" aria-hidden="true"></span>';
    I.ticks.forEach(function(t){ var on = s.ticks.indexOf(t) >= 0, whole = Math.abs(t - Math.round(t)) < 1e-9; th += '<button type="button" class="pq3-tick' + (on ? " on" : "") + (whole ? "" : " half") + '" style="left:' + pct(t) + '" data-tick="' + t + '" data-k="p3t' + t + '" aria-pressed="' + on + '" aria-label="x = ' + fr(t) + (on ? ", marked" : "") + '"' + (s.marked ? " disabled" : "") + "><span>" + (whole ? fr(t) : "") + "</span></button>"; });
    MV.keepFocus($("#p3-ticks"), function(){ $("#p3-ticks").innerHTML = th; });
    $$(".pq3-hide", host).forEach(function(el){ el.hidden = !s.marked; });
    ["p3-head", "p3-rf", "p3-rg", "p3-rr", "p3-mk"].forEach(function(id){ $("#" + id).hidden = !s.marked; });
    if (s.marked) {
      $("#p3-head").innerHTML = c.crit.map(function(x){ return '<span class="pq3-cv-lab" style="left:' + pct(x) + '">' + M("x = " + fr(x)) + "</span>"; }).join("");
      [["f", "p3-rf"], ["g", "p3-rg"], ["r", "p3-rr"]].forEach(function(row){
        var h = c.crit.map(function(x){ return '<span class="pq3-vl" style="left:' + pct(x) + '" aria-hidden="true"></span>'; }).join("");
        I.ints.forEach(function(it, k){
          var v = s[row[0]][k], bad = msgs && msgs.bad && msgs.bad[row[0] + k], nm = row[0] === "r" ? res : row[0];
          h += '<span class="pq3-pair' + (bad ? " bad" : "") + '" style="left:' + pct(it.mid) + '">' + [1, -1].map(function(sg){ return '<button type="button" data-cell="' + row[0] + "|" + k + "|" + sg + '" data-k="p3' + row[0] + k + sg + '" aria-pressed="' + (v === sg) + '" aria-label="' + nm + " on " + it.lab + ": " + signName(sg) + '"' + (s.solved ? " disabled" : "") + ">" + sym(sg) + "</button>"; }).join("") + "</span>";
        });
        MV.keepFocus($("#" + row[1]), function(){ $("#" + row[1]).innerHTML = h; });
      });
      var mh = "";
      I.marks.forEach(function(m, k){
        var v = s.mk[k], bad = msgs && msgs.bad && msgs.bad["m" + k];
        mh += '<span class="pq3-mk' + (bad ? " bad" : "") + '" style="left:' + pct(m.x) + '">' + MK.map(function(o){ return '<button type="button" data-mk="' + k + "|" + o[0] + '" data-k="p3m' + k + o[0] + '" aria-pressed="' + (v === o[0]) + '" aria-label="At x = ' + fr(m.x) + ": " + o[1] + '"' + (s.solved ? " disabled" : "") + ">" + o[1] + "</button>"; }).join("") + "</span>";
      });
      MV.keepFocus($("#p3-mk"), function(){ $("#p3-mk").innerHTML = mh; });
    }
    // controls
    var ch = "";
    if (!s.marked) ch = '<div class="q-actions"><button type="button" class="btn primary sm" id="p3-chkm" data-k="p3chkm">Check the marks</button><button type="button" class="btn ghost sm" id="p3-show" data-k="p3show">Show me</button></div>';
    else if (!s.solved) ch = '<div class="conf" role="group" aria-label="How sure are you?"><span class="conf-lab">How sure are you?</span>' + MV.CONF.map(function(o){ return '<button type="button" class="chip' + (s.conf === o.id ? " on" : "") + '" aria-pressed="' + (s.conf === o.id) + '" data-conf="' + o.id + '" data-k="p3cf' + o.id + '">' + o.t + "</button>"; }).join("") + "</div>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="p3-chk" data-k="p3chk">Check chart</button></div>';
    MV.keepFocus($("#p3-ctl"), function(){ $("#p3-ctl").innerHTML = ch; });
    var fb = "";
    if (s.solved) {
      var cf = (MV.CONF.filter(function(o){ return o.id === s.conf; })[0] || {}).t || "";
      fb = '<div class="fb good" role="status"><p><strong>✓ Your chart is right.</strong> ' + (s.first ? "First try." : '<span class="muted">(not first try)</span>') + "</p>" + (s.confMsg ? "<p>" + s.confMsg + "</p>" : cf ? "<p>You said " + cf + ".</p>" : "") + "</div>";
    } else if (msgs) fb = '<div class="fb ' + (msgs.good ? "good" : "bad") + '" role="status">' + (msgs.head ? "<p><strong>" + msgs.head + "</strong></p>" : "") + (msgs.list.length ? "<ul class=\"pq3-msgs\">" + msgs.list.map(function(m){ return "<li>" + m + "</li>"; }).join("") + "</ul>" : "") + (msgs.tail ? "<p>" + msgs.tail + "</p>" : "") + "</div>";
    $("#p3-fb").innerHTML = fb;
    var alg = $("#p3-alg"); $("#p3-algt").innerHTML = CCc.alg;
    void alg;
    plots.f.render(); plots.g.render(); plots.r.render();
  }
  function checkMarks(){
    var c = cs(), s = st(), I = caseInfo(c), out = [];
    var zs = c.zf.concat(c.zg).filter(function(z, k, a){ return a.indexOf(z) === k; }).sort(function(a, b){ return a - b; });
    zs.forEach(function(z){ if (s.ticks.indexOf(z) < 0) { var both = c.zf.indexOf(z) >= 0 && c.zg.indexOf(z) >= 0; out.push(both ? md("`f` and `g` are both 0 at `x = " + fr(z) + "` too. Look where their graphs meet the axis.") : md("`" + (c.zf.indexOf(z) >= 0 ? "f" : "g") + "` is 0 at `x = " + fr(z) + "` too. Look where its graph meets the axis.")); } });
    s.ticks.slice().sort(function(a, b){ return a - b; }).forEach(function(t){ if (zs.indexOf(t) < 0) out.push(c.ends && c.ends.indexOf(t) >= 0 ? md("`x = " + fr(t) + "` is an end of the chart’s interval, `0 < x < 2`, so leave it off.") : md("Neither `f` nor `g` is 0 at `x = " + fr(t) + "`.")); });
    void I;
    if (!out.length) { s.marked = true; msgs = { good:true, head:"✓ Those are the critical values.", list:[], tail:"" }; }
    else { s.tries++; msgs = { good:false, head:"✗ Not quite.", list:out, tail:"" }; }
    api.save(); paint(); MV.focusFb(host);
  }
  function checkChart(){
    var c = cs(), s = st(), I = caseInfo(c), bad = {}, list = [], nCell = 0, nMark = 0;
    var full = I.ints.every(function(_, k){ return s.f[k] && s.g[k] && s.r[k]; }) && I.marks.every(function(_, k){ return s.mk[k]; });
    if (!full || !s.conf) { msgs = { good:false, head:"", list:[], tail:"Choose a sign in every cell, a marker at every critical value, and how sure you are. Then press Check chart." }; paint(); MV.focusFb(host); return; }
    I.ints.forEach(function(it, k){
      ["f", "g"].forEach(function(r){ if (s[r][k] !== it[r]) { bad[r + k] = 1; nCell++; list.push(md("On " + it.lab + ", the graph of `" + r + "` is " + (it[r] > 0 ? "above" : "below") + " the `x`-axis, so it’s " + signName(it[r]) + " there.")); } });
      if (s.r[k] !== it.r) { bad["r" + k] = 1; nCell++; list.push(c.op === "mul" ? md("On " + it.lab + ": here `f` is " + signName(it.f) + " and `g` is " + signName(it.g) + ": " + signName(it.f) + " × " + signName(it.g) + " = " + signName(it.r) + ".") : md("On " + it.lab + ": division follows the same sign rules: " + signName(it.f) + " ÷ " + signName(it.g) + " = " + signName(it.r) + ".")); }
    });
    I.marks.forEach(function(m, k){ var ch = s.mk[k]; if (ch !== m.ans) { bad["m" + k] = 1; nMark++; list.push("<strong>At " + M("x = " + fr(m.x)) + ":</strong> " + markMsg(c, m, ch)); } });
    var cf = (MV.CONF.filter(function(o){ return o.id === s.conf; })[0] || {}).t;
    if (!list.length) {
      s.solved = true; s.first = s.tries === 0 && !s.help;
      s.confMsg = "You said " + cf + (s.tries === 0 ? ", and it was all right." + (s.conf === "guess" ? " Trust that reasoning." : "") : ", and now it’s all right.");
      msgs = null; api.save(); revealT = 0;
      MV.tween({ dur:1400, ease:function(t){ return t; }, step:function(t){ revealT = t; plots.r.render(); } });
      paint(); MV.focusFb(host); return;
    }
    s.tries++;
    var off = (nCell ? nCell + (nCell === 1 ? " cell" : " cells") : "") + (nCell && nMark ? " and " : "") + (nMark ? nMark + (nMark === 1 ? " marker" : " markers") : "");
    msgs = { good:false, bad:bad, head:"✗ Not quite. You said " + cf + ". " + off + ((nCell + nMark) === 1 ? " was" : " were") + " off.", list:list, tail:"Fix the red ones and check again." };
    api.save(); paint(); MV.focusFb(host);
  }
  function markMsg(c, m, ch){
    var v = fr(m.x);
    if (c.op === "mul") {
      if (ch === "asym" || ch === "hole") return md("`f · g` is a product of two functions defined everywhere, so it has no breaks. 0 times a number is 0.");
      if (ch === "crosses") return md("Both `f` and `g` are 0 at `x = " + v + "`, and <strong>both</strong> change sign there. The two changes cancel, so `f · g` has the same sign on both sides: it touches.");
      return md("Only `" + (m.fz ? "f" : "g") + "` is 0 here, so only one sign changes. The graph crosses.");
    }
    if (m.gz && (ch === "crosses" || ch === "touches")) return md("`g(" + v + ") = 0`, so `f/g` has no value there. It can’t be a zero of `f/g`.");
    if (m.gz && m.fz && ch === "asym") return md("`f(1) = 0` too. `f` and `g` share the factor `x - 1`, which cancels, so the graph has a hole there, not an asymptote.");
    if (m.gz && !m.fz && ch === "hole") return md("`f` isn’t 0 here (" + c.fAt[m.x] + "), so `f/g` is a non-zero number divided by a tiny one: a vertical asymptote.");
    if (!m.gz && (ch === "asym" || ch === "hole")) return md("`g` isn’t 0 here, so `f/g` is defined: it equals 0. That’s a zero of the quotient.");
    return md("Only `f` is 0 here, so only one sign changes. The graph crosses.");
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var s = st();
    if (b.dataset.case != null) { S.c = +b.dataset.case; msgs = null; revealT = 1; api.save(); paint(); return; }
    if (b.dataset.tick != null) { var t = +b.dataset.tick, k = s.ticks.indexOf(t); if (k < 0) s.ticks.push(t); else s.ticks.splice(k, 1); msgs = null; api.save(); paint(); return; }
    if (b.id === "p3-chkm") { checkMarks(); return; }
    if (b.id === "p3-show") { var c = cs(); s.ticks = c.zf.concat(c.zg).filter(function(z, i, a){ return a.indexOf(z) === i; }); s.help = true; s.marked = true; msgs = { good:true, head:"Here are the critical values: every zero of " + M("f") + " and of " + M("g") + ".", list:[], tail:"" }; api.save(); paint(); return; }
    if (b.dataset.cell) { var p = b.dataset.cell.split("|"); s[p[0]][p[1]] = +p[2]; if (msgs && msgs.bad) delete msgs.bad[p[0] + p[1]]; api.save(); paint(); return; }
    if (b.dataset.mk) { var q = b.dataset.mk.split("|"); s.mk[q[0]] = q[1]; if (msgs && msgs.bad) delete msgs.bad["m" + q[0]]; api.save(); paint(); return; }
    if (b.dataset.conf) { s.conf = b.dataset.conf; api.save(); paint(); return; }
    if (b.id === "p3-chk") { checkChart(); return; }
  });
  paint();
  void conf; void cur;
  return {};
}

// =====================================================================================================
// PRACTICE 3: Work backwards (N4 fill in the coefficients) with a graph of the student's own combination
// =====================================================================================================
// polynomials as coefficient arrays, low to high
function pev(c, x){ var v = 0; for (var k = c.length - 1; k >= 0; k--) v = v * x + c[k]; return v; }
function pder(c){ return c.slice(1).map(function(a, k){ return a * (k + 1); }); }
function roots(c){
  var a = c[2] || 0, b = c[1] || 0, cc = c[0] || 0;
  if (!a) return b ? [-cc / b] : [];
  var D = b * b - 4 * a * cc; if (D < -1e-12) return []; if (Math.abs(D) < 1e-12) return [-b / (2 * a)];
  var s = Math.sqrt(D); return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort(function(p, q){ return p - q; });
}
function mult(c, r){ var m = 0, d = c.slice(); while (d.length && Math.abs(pev(d, r)) < 1e-9 && m < 3) { m++; d = pder(d); } return m; }
function rootTxt(r){ var q = MV.frac(r, 12); return Math.abs(MV.parseNum(q.replace(MINUS, "-"))[0] - r) < 1e-9 ? q : "≈ " + sig3(r); }
// breaks of num/den: asymptotes and holes (height from the m-th derivatives)
function ratBreaks(nc, dc){
  var A = [], H = [];
  roots(dc).forEach(function(r){
    var md2 = mult(dc, r), mn = mult(nc, r);
    if (mn >= md2) { var n = nc.slice(), d = dc.slice(); for (var k = 0; k < md2; k++) { n = pder(n); d = pder(d); } H.push({ x:r, y:mn > md2 ? 0 : pev(n, r) / pev(d, r) }); }
    else A.push(r);
  });
  return { asym:A, holes:H };
}
function polyMul(a, b){ var o = []; for (var i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++) o[i + j] = (o[i + j] || 0) + a[i] * b[j]; return o; }
function builds(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="wb-n"></span><span class="dots" id="wb-dots" aria-hidden="true"></span></div>' +
    '<p class="pred-q" id="wb-feat"></p><div class="pq-tpl" id="wb-tpl"></div><p class="tiny muted" id="wb-note"></p>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="wb-check">Check</button><span id="wb-hint"></span></div><div id="wb-hints"></div><div id="wb-fb" aria-live="polite"></div>' +
    '<div class="pq-wbg" id="wb-gw" hidden><canvas class="plot" id="wb-plot" role="img" aria-label="Graph of your combination"></canvas><p class="tiny muted" id="wb-leg"></p></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="wb-prev">Previous</button><button type="button" class="btn ghost sm" id="wb-next">Next build</button></div>';
  var plot = new MV.Plot($("#wb-plot", host), { xmin:-5, xmax:5, ymin:-5, ymax:5 }), msg = {};
  function ist(){ var it = a.items[S.i]; return S.items[it.id] || (S.items[it.id] = { vals:{}, tries:0, hint:0, solved:false, first:null, shown:null }); }
  function boxes(it){ return it.tpl.filter(function(t){ return typeof t !== "string"; }); }
  function tplHTML(it, x){
    return it.tpl.map(function(t){
      if (typeof t === "string") return M(t);
      var mn = t.min != null ? t.min : -20, mx = t.max != null ? t.max : 20;
      return '<label class="pq-boxl"><span class="vh">' + t.box + (t.frac ? " (" + t.frac + " of the fraction)" : "") + "</span>" + '<input type="number" class="numin pq-box" data-box="' + t.box + '" data-k="wb' + t.box + '" min="' + mn + '" max="' + mx + '" step="1" autocomplete="off" value="' + MV.esc(x.vals[t.box] == null ? "" : x.vals[t.box]) + '"' + (x.solved ? " disabled" : "") + "></label>";
    }).join("");
  }
  function read(it, x){
    var out = {}, bad = null;
    boxes(it).forEach(function(t){
      var mn = t.min != null ? t.min : -20, mx = t.max != null ? t.max : 20, r = MV.parseNum(x.vals[t.box]);
      var v = r && r.length === 1 ? r[0] : NaN;
      if (!Number.isInteger(v) || v < mn || v > mx) bad = bad || t; else out[t.box] = v;
    });
    return bad ? { bad:bad } : { v:out };
  }
  function matches(spec, v){
    return Object.keys(spec).every(function(k){
      if (k === "cnz") return v.c !== 0;
      if (k === "b" && Array.isArray(spec.b)) return v.p * spec.b[1] === v.q * spec.b[0];
      return v[k] === spec[k];
    });
  }
  function isRight(it, v){ var ans = MV.ans(it); return Object.keys(ans).every(function(k){ return Array.isArray(ans[k]) ? v.p * ans[k][1] === v.q * ans[k][0] : v[k] === ans[k]; }); }
  function fracT(q){ return qSrc(q); }
  function generic(it, v){
    var k = it.kind;
    if (k === "b1") {
      var B = ratBreaks([-1, 1], [v.c, v.b, 1]), parts = [];
      if (B.asym.length) parts.push((B.asym.length > 1 ? "vertical asymptotes at `x = " : "a vertical asymptote at `x = ") + B.asym.map(rootTxt).join("` and `x = ") + "`");
      if (B.holes.length) parts.push("a hole at `x = " + rootTxt(B.holes[0].x) + "`");
      return md("Your `f/g` has " + (parts.length ? parts.join(" and ") : "no breaks") + ". You need a hole at `x = 1` and a vertical asymptote `x = -4`.");
    }
    if (k === "b2") {
      var ty = v.a === 0 && v.c === 0 ? "the zero function" : v.c === 0 ? "odd" : v.a === 0 ? "even" : "neither even nor odd";
      return md("Your `f · g` is " + ty + ", and `(f · g)(1) = " + num(-3 * (v.a + v.c)) + "`. You need an odd product with `(f · g)(1) = 6`.");
    }
    if (k === "b3") { var y1 = Q(-v.a * v.p, v.q), y3 = Q(-v.a * Math.pow(v.p, 3), Math.pow(v.q, 3)); return md("Right now `y(1) = " + fracT(y1) + "` and `y(3) = " + fracT(y3) + "`. You need −6 and −2/3."); }
    if (k === "b4") return it.other.replace("{h2}", num(2 * v.p + v.q)).replace("{h1}", num(-(v.p + v.q)));
    if (k === "b5") {
      var B5 = ratBreaks([v.p, 1], [-v.q, 0, 1]), as = B5.asym.map(rootTxt), g1 = 1 - v.q, val;
      var h1 = B5.holes.filter(function(h){ return Math.abs(h.x - 1) < 1e-9; })[0];
      if (g1 === 0) val = "`f/g` has no value at `x = 1`"; else val = "`(f/g)(1) = " + fracT(Q(1 + v.p, g1)) + "`";
      void h1;
      return md("Your `f/g` has " + (as.length ? (as.length > 1 ? "vertical asymptotes `x = " : "one vertical asymptote, `x = ") + as.join("` and `x = ") + "`" : "no vertical asymptote") + ", and " + val + ". You need exactly one asymptote, `x = 3`, and the point (1, −1/2) on the graph.");
    }
    if (k === "b6") { var fs = v.c === 0 ? "x" : "(x " + (v.c > 0 ? "+ " : "- ") + Math.abs(v.c) + ")"; return md("Your `f · g = " + fs + "(x - 3)` turns at `x = " + fr((3 - v.c) / 2) + "`. You need it to turn at `x = 1`."); }
    if (k === "b7") {
      var fc = [v.c, v.b, 1], zs = roots(fc).concat([v.r]).filter(function(z, i, arr){ return arr.findIndex(function(w){ return Math.abs(w - z) < 1e-9; }) === i; }).sort(function(p, q){ return p - q; });
      var hole = Math.abs(pev(fc, v.r)) < 1e-9;
      return md("Your `f · g` is 0 at `x = " + zs.map(rootTxt).join("`, `") + "`, and `f/g` has " + (hole ? "a hole at `x = " + num(v.r) + "`" : "no hole") + ". You need zeros at exactly −1 and 3, and a hole at `x = 3`.");
    }
    return "";
  }
  function graph(it, v){
    var ink = css("--ink"), pen = css("--pen"), sc = { curves:[], points:[], asymptotes:[] }, leg = "", desc = "", k = it.kind, after = null;
    function rat(nc, dc, view, col){
      var B = ratBreaks(nc, dc), fn = function(x){ return pev(nc, x) / pev(dc, x); };
      after = function(ctx, p){
        drawPieces(p, fn, view.xmin, view.xmax, B.asym, { color:col || ink, width:3.4 });
        B.asym.forEach(function(x){ vline(ctx, p, x, css("--ink-2"), [8, 6], 1.5); bgText(ctx, "x = " + rootTxt(x), p.X(x), 12, css("--ink-2"), "italic 600 12px " + (p.fontM || "serif")); });
        B.holes.forEach(function(h){ p.point({ x:h.x, y:h.y, open:true, r:5.5, color:pen }); });
      };
      return B;
    }
    if (k === "b1") { sc.view = { xmin:-7, xmax:5, ymin:-4, ymax:4 }; var B1 = rat([-1, 1], [v.c, v.b, 1], sc.view); desc = "Graph of your f/g = (x − 1)/(x² + " + v.b + "x + " + v.c + "): asymptotes " + (B1.asym.map(rootTxt).join(", ") || "none") + "; holes " + (B1.holes.map(function(h){ return rootTxt(h.x); }).join(", ") || "none") + "."; leg = "Your " + M("f/g") + ", with its asymptotes (dashed) and holes (open circles)."; }
    if (k === "b5") { sc.view = { xmin:-6, xmax:6, ymin:-4, ymax:4 }; var B5 = rat([v.p, 1], [-v.q, 0, 1], sc.view); var y1 = 1 - v.q !== 0 ? (1 + v.p) / (1 - v.q) : null; if (y1 != null && Math.abs(y1) < 4) sc.points.push({ x:1, y:y1, r:4.5, color:ink, label:"(1, " + fr(y1) + ")" }); desc = "Graph of your f/g: asymptotes " + (B5.asym.map(rootTxt).join(", ") || "none") + "."; leg = "Your " + M("f/g") + ", with its asymptotes (dashed) and holes (open circles)."; }
    if (k === "b2") { var fg = function(x){ return (x * x - 4) * (v.a * x + v.c); }; sc.view = { xmin:-3, xmax:3, ymin:-15, ymax:15 }; sc.curves.push({ f:fg, color:ink, width:3.4 }); [1, -1].forEach(function(x){ sc.points.push({ x:x, y:fg(x), r:4.5, color:ink, label:"(" + num(x) + ", " + num(fg(x)) + ")" }); }); desc = "Graph of your f · g = (x² − 4)(" + v.a + "x + " + v.c + ")."; leg = "Your " + M("f · g") + ", with its values at " + M("x = ±1") + "."; }
    if (k === "b6") { var f6 = function(x){ return (x + v.c) * (x - 3); }, vx6 = (3 - v.c) / 2, vy = f6(vx6), Y6 = Math.max(10, Math.abs(vy) * 1.25); sc.view = { xmin:-8, xmax:8, ymin:-Y6, ymax:Y6 }; sc.curves.push({ f:f6, color:ink, width:3.4, arrows:true }); sc.points.push({ x:vx6, y:vy, r:5, color:ink, label:"vertex (" + fr(vx6) + ", " + fr(vy) + ")" }); desc = "Graph of your f · g = (x + " + v.c + ")(x − 3), vertex at x = " + fr(vx6) + "."; leg = "Your " + M("f · g") + ", turning at its vertex."; }
    if (k === "b3") {
      var b = v.p / v.q, fence = function(t){ return v.a * Math.pow(b, t); }, y = function(t){ return fence(t) * Math.cos(PI * t); }, Y3 = 1.15 * Math.max(Math.abs(v.a), Math.abs(fence(4)), 1);
      sc.view = { xmin:-0.2, xmax:4.2, ymin:-Y3, ymax:Y3 }; sc.curves.push({ f:fence, color:pen, width:2, domain:[0, 4] }, { f:function(t){ return -fence(t); }, color:pen, width:2, dash:[6, 4], domain:[0, 4] }, { f:y, color:ink, width:3.4, domain:[0, 4] });
      [1, 3].forEach(function(t){ sc.points.push({ x:t, y:y(t), r:4.5, color:ink, label:"(" + t + ", " + fr(y(t)) + ")" }); }); sc.xLabel = "t"; desc = "Graph of your y(t) = " + v.a + "(" + v.p + "/" + v.q + ")^t cos(πt) with its fences, for t from 0 to 4."; leg = "Your " + M("y(t)") + " (ink) with its fences " + M("y = ±a · b^t") + " (blue).";
    }
    if (k === "b4") {
      var f4 = function(x){ return v.p * x + v.q; }, h = function(x){ return f4(x) * Math.cos(PI * x); }, Y4 = 1.15 * Math.max(Math.abs(f4(-1)), Math.abs(f4(3)), 1);
      sc.view = { xmin:-1, xmax:3, ymin:-Y4, ymax:Y4 }; sc.curves.push({ f:f4, color:pen, width:2 }, { f:function(x){ return -f4(x); }, color:pen, width:2, dash:[6, 4] }, { f:h, color:ink, width:3.4 });
      [1, 2].forEach(function(x){ sc.points.push({ x:x, y:h(x), r:4.5, color:ink, label:"(" + x + ", " + fr(h(x)) + ")" }); }); desc = "Graph of your h(x) = (" + v.p + "x + " + v.q + ")cos(πx) with the fences y = ±f(x)."; leg = "Your " + M("h") + " (ink) with the fences " + M("y = ±f(x)") + " (blue).";
    }
    if (k === "b7") {
      var fc = [v.c, v.b, 1], prod = polyMul(fc, [-v.r, 1]); sc.view = { xmin:-6, xmax:6, ymin:-12, ymax:12 };
      var B7 = ratBreaks(fc, [-v.r, 1]), qf = function(x){ return pev(fc, x) / (x - v.r); };
      sc.curves.push({ f:function(x){ return pev(prod, x); }, color:ink, width:3.4 });
      roots(prod.length > 3 ? fc : fc).concat([v.r]).forEach(function(z){ sc.points.push({ x:z, y:0, r:4.5, color:ink }); });
      after = function(ctx, p){ drawPieces(p, qf, -6, 6, B7.asym, { color:pen, width:2.4, dash:[7, 4] }); B7.asym.forEach(function(x){ vline(ctx, p, x, css("--ink-2"), [8, 6], 1.5); }); B7.holes.forEach(function(hh){ p.point({ x:hh.x, y:hh.y, open:true, r:5.5, color:pen }); }); };
      desc = "Graph of your f · g (solid) and f/g (dashed)."; leg = "Solid ink: your " + M("f · g") + " with its zeros. Dashed blue: your " + M("f/g") + ", with its hole or asymptote.";
    }
    sc.after = after; sc.describe = desc;
    plot.render = function(){ plot.draw(sc); };
    $("#wb-gw", host).hidden = false; $("#wb-leg", host).innerHTML = leg; plot.render();
  }
  function paint(load){
    var it = a.items[S.i], x = ist();
    $("#wb-n", host).textContent = "Build " + it.id.toUpperCase() + " (" + (S.i + 1) + " of " + a.items.length + ")" + (it.star ? " ★ Stretch" : "");
    $("#wb-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#wb-feat", host).innerHTML = "<strong>Features:</strong> " + it.features;
    if (load) MV.keepFocus($("#wb-tpl", host), function(){ $("#wb-tpl", host).innerHTML = tplHTML(it, x); });
    $("#wb-note", host).innerHTML = it.note || "Whole numbers from −20 to 20" + (it.kind === "b7" ? " (" + M("r") + " from −10 to 10)" : "") + ".";
    $("#wb-check", host).disabled = x.solved;
    MV.keepFocus($("#wb-hint", host), function(){ $("#wb-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("wbh" + it.id, x.hint); });
    $("#wb-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    $("#wb-fb", host).innerHTML = x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : (msg[it.id] ? '<div class="fb ' + (msg[it.id].bad ? "bad" : "") + '" role="status"><p>' + (msg[it.id].bad ? "<strong>✗ Not quite.</strong> " : "") + msg[it.id].t + "</p></div>" : "");
    $("#wb-prev", host).disabled = S.i === 0; $("#wb-next", host).disabled = S.i === a.items.length - 1;
    var r = x.shown ? x.shown : null;
    if (r) graph(it, r); else $("#wb-gw", host).hidden = true;
  }
  host.addEventListener("input", function(e){ var b = e.target.dataset && e.target.dataset.box; if (!b) return; var x = ist(); if (x.solved) return; x.vals[b] = e.target.value; api.save(); });
  host.addEventListener("click", function(e){
    var btn = e.target.closest("button"); if (!btn || btn.disabled) return;
    var it = a.items[S.i], x = ist();
    if (btn.id === "wb-prev" || btn.id === "wb-next") { S.i += btn.id === "wb-prev" ? -1 : 1; api.save(); paint(true); return; }
    if (btn.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (btn.id === "wb-check") {
      var r = read(it, x);
      if (r.bad) { var t = r.bad, mn = t.min != null ? t.min : -20, mx = t.max != null ? t.max : 20; msg[it.id] = { bad:false, t:"Type a whole number from " + num(mn) + " to " + num(mx) + " in each box." }; paint(); MV.focusFb(host); return; }
      var v = r.v; if (it.kind === "b3") v.b = [v.p, v.q];
      x.shown = v;
      if (isRight(it, v)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
      else {
        x.tries++;
        var w = (it.wrong || []).filter(function(wr){ return matches(wr.v, v); })[0];
        msg[it.id] = { bad:true, t:(w ? w.fb : generic(it, v)) + " Try again." };
      }
      api.save(); paint(x.solved); MV.focusFb(host);
    }
  });
  paint(true);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// =====================================================================================================
// PERFORMANCE TASK: Design a combination
// =====================================================================================================
var CARDS = {
  x:{ src:"x", t:"odd", v2:Q(2), vm2:Q(-2), s01:1, f:function(x){ return x; }, z:[0], zt:"`x = 0`" },
  xm1:{ src:"x - 1", multi:true, t:"neither", v2:Q(1), vm2:Q(-3), s01:-1, f:function(x){ return x - 1; }, z:[1], zt:"`x = 1`" },
  xp2:{ src:"x + 2", multi:true, t:"neither", v2:Q(4), vm2:Q(0), s01:1, f:function(x){ return x + 2; }, z:[-2], zt:"`x = -2`" },
  x2m4:{ src:"x^2 - 4", multi:true, t:"even", v2:Q(0), vm2:Q(0), s01:-1, f:function(x){ return x * x - 4; }, z:[-2, 2], zt:"`x = ±2`" },
  x2p1:{ src:"x^2 + 1", multi:true, t:"even", v2:Q(5), vm2:Q(5), s01:1, f:function(x){ return x * x + 1; }, z:[], never:true },
  sin:{ src:"sin(πx)", t:"odd", v2:Q(0), vm2:Q(0), s01:1, f:function(x){ return Math.sin(PI * x); }, z:[-3, -2, -1, 0, 1, 2, 3], zt:"every whole number" },
  cos:{ src:"cos(πx)", t:"even", v2:Q(1), vm2:Q(1), s01:0, f:function(x){ return Math.cos(PI * x); }, z:[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5], zt:"`x = ±1/2`, `±3/2`, `±5/2`, …" },
  half:{ src:"(1/2)^x", t:"neither", v2:Q(1, 4), vm2:Q(4), s01:1, f:function(x){ return Math.pow(0.5, x); }, z:[], never:true }
};
var CIDS = ["x", "xm1", "xp2", "x2m4", "x2p1", "sin", "cos", "half"];
var task = (function(){
  var api, plot, kR, fR, gR, oR;
  function read(){ var s = api ? api.S : {}; return { k:s.k == null ? 1 : s.k, f:s.f || "x", g:s.g || "x2m4", op:s.op || "mul" }; }
  function fac(id){ var c = CARDS[id]; return c.multi ? "(" + c.src + ")" : c.src; }
  function capSrc(d){ return "h(x) = " + d.k + " · " + (d.op === "mul" ? fac(d.f) + " · " + fac(d.g) : "{" + CARDS[d.f].src + "}/{" + CARDS[d.g].src + "}"); }
  function hAt(d, w){ var F = CARDS[d.f][w], G = CARDS[d.g][w]; if (d.op === "div") { if (G.n === 0) return null; return qmul(Q(d.k), qdiv(F, G)); } return qmul(Q(d.k), qmul(F, G)); }
  function hType(d){
    var a = CARDS[d.f].t, b = CARDS[d.g].t;
    if (a !== "neither" && b !== "neither") return a === b ? "even" : "odd";
    if (d.op === "div" && d.f === d.g && CARDS[d.f].never) return "even";
    return "neither";
  }
  function checks(d){
    var F = CARDS[d.f], G = CARDS[d.g], h2 = hAt(d, "v2"), hm2 = hAt(d, "vm2");
    return [(F.t === "odd" && G.t === "even") || (F.t === "even" && G.t === "odd"),
      !!(h2 && hm2 && h2.n === 0 && hm2.n === 0),
      d.f !== "cos" && d.g !== "cos" && Math.sign(d.k) * F.s01 * G.s01 > 0,
      d.op === "mul" || d.g === "x2p1" || d.g === "half"];
  }
  function sn(v){ return v > 0 ? "positive" : "negative"; }
  function tips(d, c){
    var out = [], F = CARDS[d.f], G = CARDS[d.g];
    if (!c[0]) out.push(md("Right now `f` is " + F.t + " and `g` is " + G.t + ", so `h` is " + hType(d) + ". An odd function times (or divided by) an even one is odd. Two odd ones make an even function."));
    if (!c[1]) { var h2 = hAt(d, "v2"), hm2 = hAt(d, "vm2"); out.push(md("`h(2) =` " + (h2 ? "`" + qSrc(h2) + "`" : "undefined") + " and `h(-2) =` " + (hm2 ? "`" + qSrc(hm2) + "`" : "undefined") + ". For `h(±2) = 0`, one card must be 0 at both 2 and −2, and you can’t divide by that card.")); }
    if (!c[2]) out.push(d.f === "cos" || d.g === "cos" ? md("`cos(πx)` changes sign at `x = 1/2`, so `h` can’t stay positive on all of `0 < x < 1`.") : md("On `0 < x < 1`, `f` is " + sn(F.s01) + " and `g` is " + sn(G.s01) + ", and `k` is " + sn(d.k) + ", so `h` is " + sn(d.k * F.s01 * G.s01) + " there. Change the sign of `k` or swap a card."));
    if (!c[3]) out.push(md("You’re dividing by `" + G.src + "`, which is 0 at " + G.zt + ". Divide only by a card that is never 0, or multiply instead."));
    return out;
  }
  function draw(){
    var d = read(), F = CARDS[d.f], G = CARDS[d.g], ink = css("--ink"), pen = css("--pen"), f3 = css("--f3");
    var h = d.op === "mul" ? function(x){ return d.k * F.f(x) * G.f(x); } : function(x){ return d.k * F.f(x) / G.f(x); };
    var asym = [], holes = [];
    if (d.op === "div") G.z.forEach(function(z){ if (F.z.indexOf(z) >= 0) { var y = (h(z + 1e-6) + h(z - 1e-6)) / 2; holes.push({ x:z, y:y }); } else asym.push(z); });
    plot.draw({ view:{ xmin:-3.2, xmax:3.2, ymin:-12, ymax:12 }, xTicks:{ step:1 }, bands:[{ x0:0, x1:1 }],
      curves:[{ f:F.f, color:pen, width:2, alpha:0.4 }, { f:G.f, color:f3, width:2, alpha:0.4 }],
      after:function(ctx, p){
        [-2, 2].forEach(function(x){ ctx.save(); ctx.beginPath(); ctx.arc(p.X(x), p.Y(0), 8, 0, 2 * PI); ctx.lineWidth = 1.8; ctx.strokeStyle = css("--ink-2"); ctx.stroke(); ctx.restore(); });
        asym.forEach(function(x){ vline(ctx, p, x, css("--ink-2"), [8, 6], 1.5); });
        drawPieces(p, h, -3.2, 3.2, asym, { color:ink, width:3.4 });
        holes.forEach(function(o){ p.point({ x:o.x, y:o.y, open:true, r:5.5, color:pen }); });
      },
      describe:"Preview of " + MV.plain(M(capSrc(d))) + " for x from −3 to 3, with the cards faint behind it. " + (asym.length ? "Vertical asymptotes at x = " + asym.map(fr).join(", ") + ". " : "") + (holes.length ? "Holes at x = " + holes.map(function(o){ return fr(o.x); }).join(", ") + ". " : "") + "The strip 0 < x < 1 is shaded and x = ±2 are ringed." });
  }
  function caption(){ var d = read(); $("#tk-cap").innerHTML = M(capSrc(d)); }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S; if (s.k == null) s.k = 1; s.f = s.f || "x"; s.g = s.g || "x2m4"; s.op = s.op || "mul"; s.designs = s.designs || {};
      inp.innerHTML = '<p class="eq-cap pq-tkcap" id="tk-cap" aria-live="polite"></p>' +
        '<div class="pq-step"><span class="rg-lab">Whole number <i>k</i></span><button type="button" class="btn ghost sm" id="tk-km" aria-label="Decrease k">−</button><output id="tk-k" class="pq-kout" aria-live="polite"></output><button type="button" class="btn ghost sm" id="tk-kp" aria-label="Increase k">+</button></div>' +
        '<div id="tk-f" class="pq-tkrow"></div><div id="tk-op" class="pq-tkrow"></div><div id="tk-g" class="pq-tkrow"></div>';
      pv.innerHTML = '<canvas class="plot" id="tk-plot" role="img" aria-label="Preview graph"></canvas><p class="tiny muted">' + M("h") + " in ink; the cards " + M("f") + " (blue) and " + M("g") + " (teal) faint behind it. The strip " + M("0 < x < 1") + " is shaded and " + M("x = ±2") + " are ringed.</p>";
      plot = new MV.Plot($("#tk-plot"), { xmin:-3.2, xmax:3.2, ymin:-12, ymax:12 }); plot.render = draw;
      function upd(){ $("#tk-k").textContent = num(s.k); caption(); a.save(); draw(); a.update(); }
      var opts = CIDS.map(function(id){ return { id:id, t:M(CARDS[id].src) }; });
      fR = radios($("#tk-f"), { label:"First card " + M("f"), aria:"First card f", cls:"chips", options:opts, value:s.f, onChange:function(v){ s.f = v; upd(); } });
      oR = radios($("#tk-op"), { label:"Operation", aria:"Operation", options:[{ id:"mul", t:"×" }, { id:"div", t:"÷" }], value:s.op, onChange:function(v){ s.op = v; upd(); } });
      gR = radios($("#tk-g"), { label:"Second card " + M("g"), aria:"Second card g", cls:"chips", options:opts, value:s.g, onChange:function(v){ s.g = v; upd(); } });
      $("#tk-km").addEventListener("click", function(){ s.k = s.k === 1 ? -1 : Math.max(-3, s.k - 1); upd(); });
      $("#tk-kp").addEventListener("click", function(){ s.k = s.k === -1 ? 1 : Math.min(3, s.k + 1); upd(); });
      void kR;
      $("#tk-k").textContent = num(s.k); caption(); draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    tips:tips,
    key:function(d){ var k = [d.f, d.g].sort().join("+"); var s = api.S; s.designs = s.designs || {}; if (!s.designs[k]) { s.designs[k] = capSrc(d); api.save(); } return k; },
    label:function(k){ var s = api.S.designs || {}; return s[k] ? M(s[k]) : k; },
    text:function(k){ var s = api.S.designs || {}; return s[k] ? MV.plain(M(s[k])) : k; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ builds:builds },
  task:task
});
})();
