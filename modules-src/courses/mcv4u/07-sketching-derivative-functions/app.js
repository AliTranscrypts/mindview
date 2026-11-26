// MCV4U 07 Sketching Derivative Functions: hero (slope trail), slope tracker (Explore: V5 derivative panels with Trail, Table and
// Sketch modes), Graph ↔ derivative stations (Part 3), "Sketch the derivative" builds (Practice 2), the "Steepest descent at x = 1"
// task, and the graph thumbnails for Practice 1 and 2.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function k10(x){ return Math.round(x * 10); }
function snapTo(v, st, lo, hi){ v = Math.round(v / st) * st; return r9(Math.max(lo, Math.min(hi, v))); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 0.15 : tol) + 1e-9; }
// at most dp decimals, with "≈ " in front when rounding changed the value
function dec(v, dp){ var r = r9(v), p = Math.pow(10, dp); return (Math.abs(r * p - Math.round(r * p)) > 1e-6 ? "≈ " : "") + num(r, dp); }
function ivTxt(a, b){ return "(" + (isFinite(a) ? num(a, 2) : MINUS + "∞") + ", " + (isFinite(b) ? num(b, 2) : "∞") + ")"; }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}

// =====================================================================================================================
// @component V5 derivativePanels — MHF4U N27 linked panels for f, f′ (and optionally f″) on one shared x-axis, with one probe
// line through every panel (MCV4U 07, 09, 14, 20, 21, 23, 24, 25, 29). Self-contained; started from MHF4U 09's N27 linkedPanels.
//   Top panel: f (--pen, 3 px), the tangent (--ink, 2 px) and a "slope = −1.50" label at the probe ("no single tangent" at a
//   corner, where the tangent vanishes); a probe point outside the window becomes an edge arrow. Lower panels (f′ in --f3, f″ in
//   --f4): Trail mode (visited grid keys joined into runs, never across a corner, open circles on each side of a corner),
//   Table mode (recorded dots and a Catmull–Rom "join the dots" curve split at corners), Sketch mode (zeros on the axis, + or −
//   on each interval, a peak-or-valley line with an optional value), the true derivative when shown, and the (x, f′(x)) dot.
//   var dp = derivativePanels(host, {
//     fn:function(){ return FN; },  x, step:0.1, big:10, panels:2|3, cls:["dp-top", "dp-low"], aria:[…], labels:["f(x)", "f′(x)"],
//     layers:function(i){ return { trail:[keys], dots:[x], join, show, dot:"fill"|"ring"|false, sketch:{zeros, signs, ext, val} }; },
//     extra:function(i, scene, plot, x){},        // add to panel i's scene (marks, labels)
//     describe:function(i, x){ return "…"; },     // G15 text for panel i
//     tapLow:function(x, i){ return true; },      // a tap on a lower panel (Sketch mode) — return true to keep the probe still
//     key:function(e){ return true; },            // extra keys on the probe handle (Enter places a zero)
//     locked:function(){ return bool; },          // ignore the student's moves (while a prediction plays)
//     onMove:function(x, how, prev){} })          // runs before the redraw; how: "drag" | "key" | "tap" | "slider" | "set" | "anim"
//   FN = { f, d (NaN at a corner), d2?, corners:[x], view:{xmin, xmax, ymin, ymax}, dv:{ymin, ymax}, d2v?, lo, hi, step? }
//   -> { get(), set(x, how), render(), plots, focus() }
//   Helpers: dpKeys(F, a, b) grid keys (x·10) from a to b that have a slope; dpPieces(F, a, b) domains split at corners;
//   dpSlopeLabel(v) "slope = −1.50" / "slope ≈ −0.40"; dpSketch.{intervals, remap, toggleZero, setExt, signsOK} edit a sketch
//   {zeros:[sorted x], signs:[−1 | 0 | 1 per interval], ext, val}.
function dpPieces(F, a, b){
  var cs = (F.corners || []).filter(function(c){ return c > a && c < b; }).sort(function(p, q){ return p - q; }), out = [], s = a;
  cs.forEach(function(c){ out.push([s, c - 1e-7]); s = c + 1e-7; });
  out.push([s, b]);
  return out;
}
function dpKeys(F, a, b){
  var lo = Math.min(k10(a), k10(b)), hi = Math.max(k10(a), k10(b)), out = [];
  for (var k = lo; k <= hi; k++) if (isFinite(F.d(k / 10))) out.push(k);
  return out;
}
function dpSlopeLabel(v){
  if (!isFinite(v)) return "no single tangent";
  var c = Math.round(r9(v) * 100), exact = Math.abs(r9(v) * 100 - c) < 1e-6;
  return "slope " + (exact ? "= " : "≈ ") + (c < 0 ? MINUS : "") + (Math.abs(c) / 100).toFixed(2);
}
function dpEdge(ctx, p, x, y, col){
  var v = p.v, X = p.X(x), up = y > v.ymax; if (y <= v.ymax && y >= v.ymin) return;
  var Y = up ? 4 : p.H - 4, s = 8;
  ctx.save(); ctx.fillStyle = col; ctx.beginPath();
  if (up) { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y + s * 1.4); ctx.lineTo(X + s, Y + s * 1.4); }
  else { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y - s * 1.4); ctx.lineTo(X + s, Y - s * 1.4); }
  ctx.closePath(); ctx.fill();
  ctx.font = "600 13px " + (p.fontUI || "sans-serif"); ctx.textAlign = X > p.W - 70 ? "right" : "left"; ctx.textBaseline = up ? "top" : "bottom";
  ctx.fillText(num(y, 2), X + (X > p.W - 70 ? -12 : 12), up ? 4 : p.H - 4);
  ctx.restore();
}
function dpTrail(ctx, p, F, keys, col, g){
  var ks = keys.slice().sort(function(a, b){ return a - b; }), cs = F.corners || [], H = p.H, prev = null, runs = [], cur = null;
  ks.forEach(function(k){
    var x = k / 10, y = g(x);
    if (!isFinite(y)) { prev = null; cur = null; return; }
    var join = prev != null && k - prev === 1 && !cs.some(function(c){ return c >= prev / 10 - 1e-9 && c <= x + 1e-9; });
    if (!join) { cur = []; runs.push(cur); }
    cur.push([p.X(x), Math.max(-5 * H, Math.min(6 * H, p.Y(y)))]); prev = k;
  });
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
  runs.forEach(function(r){
    if (r.length === 1) { ctx.beginPath(); ctx.arc(r[0][0], r[0][1], 3, 0, Math.PI * 2); ctx.fill(); return; }
    ctx.beginPath(); ctx.moveTo(r[0][0], r[0][1]); for (var i = 1; i < r.length; i++) ctx.lineTo(r[i][0], r[i][1]); ctx.stroke();
  });
  ctx.restore();
  cs.forEach(function(c){
    var L = ks.some(function(k){ return k / 10 < c && k / 10 >= c - 0.1 - 1e-9; }), R = ks.some(function(k){ return k / 10 > c && k / 10 <= c + 0.1 + 1e-9; });
    if (L) p.point({ x:c, y:g(c - 1e-7), r:5.5, open:true, color:col });
    if (R) p.point({ x:c, y:g(c + 1e-7), r:5.5, open:true, color:col });
  });
}
function dpJoin(ctx, p, F, xs, col, g){
  var pts = xs.slice().sort(function(a, b){ return a - b; }).map(function(x){ return [x, g(x)]; }).filter(function(q){ return isFinite(q[1]); });
  var cs = F.corners || [], runs = [], cur = [];
  pts.forEach(function(q, i){ if (i && cs.some(function(c){ return c > pts[i - 1][0] && c < q[0]; })) { runs.push(cur); cur = []; } cur.push(q); });
  runs.push(cur);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round";
  runs.forEach(function(r){
    if (r.length < 2) return;
    ctx.beginPath(); ctx.moveTo(p.X(r[0][0]), p.Y(r[0][1]));
    for (var i = 0; i < r.length - 1; i++) {
      var p0 = r[Math.max(0, i - 1)], p1 = r[i], p2 = r[i + 1], p3 = r[Math.min(r.length - 1, i + 2)];
      for (var s = 1; s <= 12; s++) {
        var t = s / 12, t2 = t * t, t3 = t2 * t;
        var cx = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
        var cy = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
        ctx.lineTo(p.X(cx), Math.max(-5 * p.H, Math.min(6 * p.H, p.Y(cy))));
      }
    }
    ctx.stroke();
  });
  ctx.restore();
}
var dpSketch = {
  intervals:function(zs){ var b = [-Infinity].concat(zs, [Infinity]), out = []; for (var i = 0; i + 1 < b.length; i++) out.push([b[i], b[i + 1]]); return out; },
  mid:function(iv){ return !isFinite(iv[0]) ? (isFinite(iv[1]) ? iv[1] - 0.5 : 0) : !isFinite(iv[1]) ? iv[0] + 0.5 : (iv[0] + iv[1]) / 2; },
  remap:function(oldZ, oldS, newZ){
    var oi = dpSketch.intervals(oldZ);
    return dpSketch.intervals(newZ).map(function(iv){ var md = dpSketch.mid(iv); for (var j = 0; j < oi.length; j++) if (md > oi[j][0] && md < oi[j][1]) return oldS[j] || 0; return 0; });
  },
  toggleZero:function(sk, x, tol){
    var old = sk.zeros.slice(), i = -1;
    sk.zeros.forEach(function(z, j){ if (near(z, x, tol)) i = j; });
    if (i >= 0) sk.zeros.splice(i, 1); else if (sk.zeros.length < 6) sk.zeros.push(x);
    sk.zeros.sort(function(a, b){ return a - b; });
    sk.signs = dpSketch.remap(old, sk.signs || [], sk.zeros);
  },
  setExt:function(sk, x, tol){ if (sk.ext != null && near(sk.ext, x, tol)) { sk.ext = null; sk.val = null; } else sk.ext = x; },
  fresh:function(){ return { zeros:[], signs:[0], ext:null, val:null, shape:null, reveal:false }; },
  zerosOK:function(zs, want, tol){ return zs.length === want.length && want.every(function(w){ return zs.some(function(z){ return near(z, w, tol); }); }); },
  same:function(a, b){ return a.length === b.length && a.every(function(v, i){ return v === b[i]; }); }
};
function dpSketchDraw(sc, v, sk, col){
  var yr = v.ymax - v.ymin, y0 = Math.max(v.ymin + yr * 0.08, Math.min(v.ymax - yr * 0.08, 0));
  dpSketch.intervals(sk.zeros).forEach(function(iv, i){
    var s = (sk.signs || [])[i]; if (!s) return;
    var a = Math.max(iv[0], v.xmin), b = Math.min(iv[1], v.xmax); if (b - a < 0.05) return;
    sc.labels.push({ x:(a + b) / 2, y:y0 + s * yr * 0.14, text:s > 0 ? "+" : MINUS, color:col, align:"center", font:"700 24px " + (css("--font-ui") || "sans-serif"), bg:true });
  });
  if (sk.ext != null) {
    sc.segments.push({ x1:sk.ext, y1:v.ymin, x2:sk.ext, y2:v.ymax, color:col, width:2, dash:[7, 5] });
    sc.labels.push({ x:sk.ext, y:v.ymax, text:"peak or valley", dy:12, dx:sk.ext > (v.xmin + v.xmax) / 2 ? -6 : 6, align:sk.ext > (v.xmin + v.xmax) / 2 ? "right" : "left", color:col, font:"600 13px " + (css("--font-ui") || "sans-serif"), bg:true });
    if (sk.val != null) {
      var val = parseFloat(String(sk.val).replace(MINUS, "-"));
      sc.points.push({ x:sk.ext, y:val, r:6, color:col });
      sc.labels.push({ x:sk.ext, y:val, text:"≈ " + sk.val, dx:10, dy:14, color:col, bg:true });
    }
  }
  sk.zeros.forEach(function(z){ sc.points.push({ x:z, y:0, r:6.5, color:col }); });
}
function derivativePanels(host, o){
  var n = o.panels || 2, cls = o.cls || ["dp-top", "dp-low", "dp-low"], aria = o.aria || [], labels = o.labels || ["f(x)", "f′(x)", "f″(x)"];
  host.classList.add("dp-panels");
  var h = ""; for (var i = 0; i < n; i++) h += '<div class="plot-wrap dp-panel"><canvas class="plot ' + cls[i] + '" role="img" aria-label="' + MV.esc(aria[i] || "") + '"></canvas></div>';
  host.innerHTML = h;
  var cv = $$("canvas", host), x = o.x, plots = cv.map(function(c){ return new MV.Plot(c, { xmin:-1, xmax:1, ymin:-1, ymax:1 }); });
  function F(){ return o.fn(); }
  function step(){ return F().step || o.step || 0.1; }
  function snap(v){ var Fn = F(); return snapTo(v, step(), Fn.lo, Fn.hi); }
  function cols(){ return [css("--pen"), css("--f3"), css("--f4")]; }
  function probeLine(ctx, p){
    var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
  }
  function scene(i, p){
    var Fn = F(), V = Fn.view, col = cols(), L = (o.layers && o.layers(i)) || {}, ink = css("--ink");
    if (i === 0) {
      var y = Fn.f(x), d = Fn.d(x), ok = isFinite(d), yc = Math.max(V.ymin, Math.min(V.ymax, y)), right = (x - V.xmin) / (V.xmax - V.xmin) > 0.55;
      var sc = { view:V, yLabel:labels[0], curves:[{ f:Fn.f, color:col[0], width:3 }], lines:[], points:[], labels:[], segments:[] };
      if (ok && L.tangent !== false) sc.lines.push({ p:[x, y], q:[x + 1, y + d], color:ink, width:2 });
      if (y === yc) sc.points.push({ x:x, y:y, r:6, color:ink, ring:true });
      if (L.slopeLabel !== false) sc.labels.push({ x:x, y:yc, text:dpSlopeLabel(d), dx:right ? -14 : 14, dy:yc > V.ymax - (V.ymax - V.ymin) * 0.15 ? 22 : -22, align:right ? "right" : "left", bg:true, font:"600 14px " + (css("--font-ui") || "sans-serif") });
      sc.after = function(ctx, pl){ probeLine(ctx, pl); dpEdge(ctx, pl, x, y, ink); };
      return sc;
    }
    var g = i === 1 ? Fn.d : Fn.d2, gv = i === 1 ? Fn.dv : Fn.d2v, c = col[i] || col[1];
    var v2 = { xmin:V.xmin, xmax:V.xmax, ymin:gv.ymin, ymax:gv.ymax }, gy = g(x);
    var s2 = { view:v2, yLabel:labels[i], curves:[], points:[], labels:[], segments:[] };
    if (L.show) {
      var any = (L.trail && L.trail.length) || (L.dots && L.dots.length);
      dpPieces(Fn, V.xmin - 0.2, V.xmax + 0.2).forEach(function(dm){ s2.curves.push({ f:g, color:c, width:2.6, alpha:any ? 0.5 : 1, domain:dm }); });
      (Fn.corners || []).forEach(function(cn){ s2.points.push({ x:cn, y:g(cn - 1e-7), r:5.5, open:true, color:c }, { x:cn, y:g(cn + 1e-7), r:5.5, open:true, color:c }); });
    }
    (L.dots || []).forEach(function(dx){ var dy = g(dx); if (isFinite(dy)) s2.points.push({ x:dx, y:dy, r:4.8, color:c }); });
    if (L.sketch) dpSketchDraw(s2, v2, L.sketch, c);
    if (L.dot && isFinite(gy) && gy >= v2.ymin && gy <= v2.ymax) s2.points.push(L.dot === "ring" ? { x:x, y:gy, r:5, open:true, color:c } : { x:x, y:gy, r:5.5, color:c, ring:true });
    s2.after = function(ctx, pl){
      if (L.trail && L.trail.length) dpTrail(ctx, pl, Fn, L.trail, c, g);
      if (L.join && L.dots && L.dots.length > 1) dpJoin(ctx, pl, Fn, L.dots, c, g);
      probeLine(ctx, pl);
      if (L.dot && isFinite(gy)) dpEdge(ctx, pl, x, gy, c);
    };
    return s2;
  }
  var busy = false;
  function render(){
    if (busy) return; busy = true;
    try {
      plots.forEach(function(p, i){
        var sc = scene(i, p);
        if (o.extra) o.extra(i, sc, p, x);
        if (o.describe) sc.describe = o.describe(i, x);
        p.draw(sc);
      });
    } finally { busy = false; }
  }
  plots.forEach(function(p){ p.render = render; });
  function set(v, how){
    if (o.locked && o.locked() && how !== "anim" && how !== "set") return;
    v = snap(v); if (v === x && how !== "set") return;
    var prev = x; x = v;
    if (o.onMove) o.onMove(x, how, prev);
    render();
  }
  var dr = MV.drag(plots[0], { axis:"x", step:{ x:step(), y:step() }, big:o.big || 10,
    handles:function(){ var Fn = F(), y = Fn.f(x), V = Fn.view; return [{ id:"probe", x:x, y:Math.max(V.ymin, Math.min(V.ymax, y)), label:o.handleLabel ? o.handleLabel(x) : "Point of tangency at x = " + num(x, 2) + ". Arrow keys move it; Shift moves it by 1." }]; },
    key:function(id, e){ return o.key ? !!o.key(e) : false; },
    move:function(id, nx, ny, how){ set(nx, how === "key" ? "key" : "drag"); } });
  plots.forEach(function(p, i){
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
    p.c.addEventListener("pointerdown", function(e){
      if (e.defaultPrevented) return;
      if (i > 0 && o.tapLow) { var tx = snapTo(at(e), step(), F().lo, F().hi); if (o.tapLow(tx, i)) { e.preventDefault(); return; } }
      active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {}
      set(at(e), "tap");
    });
    p.c.addEventListener("pointermove", function(e){ if (active) set(at(e), "drag"); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  });
  return { get:function(){ return x; }, set:set, render:render, plots:plots, focus:function(){ dr.focus("probe"); } };
}
// ------------------------------------------------- end of V5 derivativePanels ---------------------------------------------------

// ---------- Explore functions (F1–F6), exact slopes from each formula ----------
function FN(o){ o.corners = o.corners || []; o.lo = o.lo == null ? -4 : o.lo; o.hi = o.hi == null ? 4 : o.hi; o.view = Object.assign({ xmin:-4.4, xmax:4.4 }, o.view); return o; }
var XF = {
  F1:FN({ f:function(x){ return -x / 2 + 3; }, d:function(){ return -0.5; }, view:{ ymin:-2, ymax:7 }, dv:{ ymin:-3, ymax:3 }, plain:"f(x) = −x/2 + 3" }),
  F2:FN({ f:function(x){ return (x - 2) * (x - 2) - 3; }, d:function(x){ return 2 * x - 4; }, view:{ ymin:-5, ymax:15 }, dv:{ ymin:-13, ymax:6 }, plain:"f(x) = (x − 2)² − 3" }),
  F3:FN({ f:function(x){ return x * x * x - 3 * x; }, d:function(x){ return 3 * x * x - 3; }, view:{ ymin:-12, ymax:12 }, dv:{ ymin:-6, ymax:30 }, plain:"f(x) = x³ − 3x" }),
  F4:FN({ f:function(x){ return x * x * x * x / 4 - 2 * x * x; }, d:function(x){ return x * x * x - 4 * x; }, view:{ ymin:-6, ymax:10 }, dv:{ ymin:-12, ymax:12 }, plain:"f(x) = x⁴/4 − 2x²" }),
  F5:FN({ f:function(x){ return Math.abs(x - 1); }, d:function(x){ return x < 1 ? -1 : x > 1 ? 1 : NaN; }, corners:[1], view:{ ymin:-2, ymax:6 }, dv:{ ymin:-3, ymax:3 }, plain:"f(x) = |x − 1|" }),
  F6:FN({ f:function(x){ return x * x * x / 3 + x * x - 3 * x; }, d:function(x){ return x * x + 2 * x - 3; }, view:{ ymin:-7, ymax:14 }, dv:{ ymin:-6, ymax:12 }, plain:"the mystery curve", mystery:true })
};

// ---------- hero: the tangent rides along y = (x − 2)² − 3 and its slopes trace a line ----------
function hero(f){
  var top = f.canvas, low = $("#hero-d"); if (!top || !low) return;
  var Hf = function(x){ return (x - 2) * (x - 2) - 3; }, Hd = function(x){ return 2 * x - 4; };
  var V = { xmin:-1.3, xmax:5.3, ymin:-4.5, ymax:8 }, DV = { xmin:-1.3, xmax:5.3, ymin:-6.5, ymax:6.5 };
  var pt = new MV.Plot(top, V), pl = new MV.Plot(low, DV), st = { x:-0.5, done:false };
  function draw(){
    var x = st.x, y = Hf(x), d = Hd(x), ink = css("--ink"), f3 = css("--f3");
    pt.draw({ view:V, yLabel:"f(x)", curves:[{ f:Hf, color:css("--pen"), width:3 }], lines:[{ p:[x, y], q:[x + 1, y + d], color:ink, width:2 }],
      points:[{ x:x, y:y, r:6, color:ink }], labels:[{ x:x, y:y, text:dpSlopeLabel(d), dx:x > 2.6 ? -14 : 14, dy:-22, align:x > 2.6 ? "right" : "left", bg:true, font:"600 14px " + (css("--font-ui") || "sans-serif") }],
      describe:"Top panel: y = (x − 2)² − 3 with its tangent at x = " + num(x, 2) + ", slope " + num(d, 2) + ".",
      after:function(ctx, p){ var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore(); } });
    pl.draw({ view:DV, yLabel:"slope", curves:[{ f:Hd, color:f3, width:3, domain:[-0.5, x] }], points:[{ x:x, y:d, r:5.5, color:f3 }].concat(st.done ? [{ x:2, y:0, r:4, color:f3 }] : []),
      labels:st.done ? [{ x:4.5, y:5, text:"f′(x)", color:f3, align:"right", dx:-12, font:"italic 600 17px " + (css("--font-math") || "serif"), bg:true }, { x:2, y:0, text:"0 at x = 2", dy:16, dx:8, color:css("--ink"), bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif") }] : [],
      describe:"Bottom panel: the slopes of the tangent from x = −0.5 to x = " + num(x, 2) + ": low on the left, 0 at x = 2, rising on the right" + (st.done ? ". They form a straight line, labelled f′(x)." : "."),
      after:function(ctx, p){ var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore(); } });
    if (f.cap) f.cap.innerHTML = st.done ? "The slopes lie on a straight line: the derivative " + m("f′(x)") + "." : "Slope of the tangent at " + m("x = " + num(x, 1)) + ": " + num(d, 1);
  }
  pt.render = draw; pl.render = draw;
  if (MV.reduceMotion) { st.x = 4.5; st.done = true; draw(); return; }
  draw();
  MV.wait(700, function(){ MV.tween({ dur:5200, ease:function(t){ return t; }, step:function(t){ st.x = -0.5 + 5 * t; draw(); }, done:function(){ st.x = 4.5; st.done = true; draw(); } }); });
}

// ---------- Explore: slope tracker ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (!XF[S.fn]) S.fn = "F1";
  if (["trail", "table", "sketch"].indexOf(S.mode) < 0) S.mode = "trail";
  ["x", "trail", "rec", "join", "show", "sk"].forEach(function(k){ S[k] = S[k] || {}; });
  S.tool = S.tool === "ext" ? "ext" : "zero";
  var busy = false, mark = null, note = "", lastCan = null;
  host.innerHTML = '<div class="dp-ex"><div class="dp-main" data-mv="graph"><p class="eq-cap" id="dx-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p><div id="dx-panels"></div>' +
    '<p class="tiny muted dx-key">Top: <strong>' + m("f") + "</strong> with its tangent. Bottom: the slope at each " + m("x") + ", plotted as " + m("(x, f′(x))") + ".</p></div>" +
    '<div class="dp-side"><div class="chips dx-fns" id="dx-fn" role="group" aria-label="Choose a function"></div><div class="seg-wrap" id="dx-mode"></div><p class="tiny muted dx-how" id="dx-how"></p>' +
    '<label class="slider dx-sl"><span class="slider-top"><span>Point of tangency, ' + m("x") + '</span><output id="dx-xout"></output></span>' +
    '<input type="range" id="dx-x" min="-4" max="4" step="0.1" style="accent-color:var(--ink)" aria-label="x-value of the point of tangency (Shift + arrow moves by 1)"></label>' +
    '<div id="dx-tools"></div><dl class="read dx-read" id="dx-read" aria-live="polite"></dl><button type="button" class="btn ghost sm dx-more" id="dx-more" data-k="dxmore" aria-expanded="false">More</button></div></div>';
  function F(){ return XF[S.fn]; }
  function fnC(){ return C.fns.filter(function(q){ return q.id === S.fn; })[0]; }
  function xv(){ var v = S.x[S.fn]; return v == null ? -0.5 : v; }
  function trail(){ return S.trail[S.fn] || (S.trail[S.fn] = []); }
  function rec(){ return S.rec[S.fn] || (S.rec[S.fn] = []); }
  function sk(){ var s = S.sk[S.fn]; if (!s || !s.zeros) s = S.sk[S.fn] = dpSketch.fresh(); return s; }
  function addKeys(a, b){ var T = trail(); dpKeys(F(), a, b).forEach(function(k){ if (T.indexOf(k) < 0) T.push(k); }); }
  function fillAll(){ addKeys(F().lo, F().hi); }
  function canShow(){ return S.mode === "trail" ? trail().length >= 2 : S.mode === "table" ? rec().length >= 1 : false; }
  var dp = derivativePanels($("#dx-panels", host), {
    fn:F, x:xv(), step:0.1, big:10,
    aria:["Top panel: the function with its tangent", "Bottom panel: the slopes of the tangent"], labels:["f(x)", "f′(x)"],
    layers:function(i){
      if (!i) return {};
      var md = S.mode;
      return { trail:md === "trail" ? trail() : null, dots:md === "table" ? rec().map(function(k){ return k / 10; }) : null, join:md === "table" && !!S.join[S.fn],
        show:md === "sketch" ? !!sk().reveal : (canShow() && !!S.show[S.fn]), dot:md === "trail" ? "fill" : md === "table" ? "ring" : false, sketch:md === "sketch" ? sk() : null };
    },
    extra:function(i, sc){
      if (!mark || mark.fn !== S.fn) return;
      (mark.pts || []).forEach(function(q){
        if (q.i !== i) return;
        if (!q.noRing) sc.points.push({ x:q.x, y:q.y, r:8, open:true, color:css("--ink") });
        sc.labels.push({ x:q.x, y:q.y, text:q.text, dx:q.dx || 12, dy:q.dy || -18, align:q.align || "left", color:css("--ink"), bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif") });
      });
    },
    describe:describe,
    tapLow:function(x){ if (S.mode !== "sketch") return false; if (busy) return true; place(x); return true; },
    key:function(e){ if (e.key === "Enter" && S.mode === "sketch" && !busy) { place(dp.get()); return true; } return false; },
    locked:function(){ return busy; },
    onMove:function(x, how, prev){
      S.x[S.fn] = x;
      if (S.mode === "trail") { if (how === "set" || prev == null) addKeys(x, x); else addKeys(prev, x); }
      if (how !== "anim" && how !== "set") mark = null;
      note = ""; api.save(); syncSlider(); paintRead();
      if (S.mode !== "trail" || canShow() !== lastCan) paintTools();
      MV.changed();
    }
  });
  function describe(i, x){
    var Fn = F(), d = Fn.d(x), ok = isFinite(d);
    if (!i) return "Top: " + Fn.plain + ", tangent at x = " + num(x, 1) + (ok ? " with slope " + num(d, 2) + "." : ": no single tangent (corner).");
    if (S.mode === "trail") {
      var T = trail().slice().sort(function(a, b){ return a - b; });
      return "Bottom: " + (T.length ? "slopes traced from x = " + num(T[0] / 10, 1) + " to " + num(T[T.length - 1] / 10, 1) : "no trail yet") + (canShow() && S.show[S.fn] ? ", with the true f′ shown" : "") + ". Current point (" + num(x, 1) + ", " + (ok ? num(d, 2) : "none") + ").";
    }
    if (S.mode === "table") return "Bottom: " + rec().length + " recorded slope" + (rec().length === 1 ? "" : "s") + (S.join[S.fn] ? ", joined by a smooth curve" : "") + (canShow() && S.show[S.fn] ? ", with the true f′ shown" : "") + ".";
    var s = sk(), iv = dpSketch.intervals(s.zeros);
    return "Bottom: your sketch of f′. Zeros: " + (s.zeros.length ? s.zeros.map(function(z){ return num(z, 1); }).join(", ") : "none") + ". Signs: " +
      iv.map(function(q, j){ var g = s.signs[j]; return ivTxt(q[0], q[1]) + " " + (g > 0 ? "+" : g < 0 ? MINUS : "blank"); }).join("; ") +
      (s.ext != null ? ". Peak or valley at x = " + num(s.ext, 1) + (s.val != null ? ", value about " + s.val : "") : "") + (s.reveal ? ". The true f′ is revealed." : ".");
  }
  function place(x){
    var s = sk();
    if (S.tool === "ext") dpSketch.setExt(s, x, 0.25); else dpSketch.toggleZero(s, x, 0.25);
    api.save(); dp.render(); paintTools(); MV.changed();
  }
  function syncSlider(){ var el = $("#dx-x", host); el.value = xv(); $("#dx-xout", host).textContent = num(xv(), 1); }
  function cmpTxt(d, dl){
    if (!isFinite(d)) return "No single tangent here";
    if (!isFinite(dl)) return "No slope a step to the left (corner)";
    var s = Math.abs(d), sl = Math.abs(dl), e = 1e-9;
    if (d > e) return s > sl + e ? "Steeper uphill" : s < sl - e ? "Less steep" : "Just as steep";
    if (d < -e) return s > sl + e ? "Steeper downhill" : s < sl - e ? "Less steep downhill" : "Just as steep";
    return sl > e ? "Less steep" : "Just as steep";
  }
  function paintRead(){
    var Fn = F(), x = xv(), y = Fn.f(x), d = Fn.d(x), ok = isFinite(d), dl = Fn.d(r9(x - 0.1));
    var rows = [
      [m("x"), num(x, 1), ""],
      [m("f(x)"), dec(y, 3), " dx-x2"],
      ["Slope of tangent, " + m("f′(x)"), ok ? dec(d, 2) : "none: no single tangent", ""],
      ["Sign", ok ? (d > 1e-9 ? "Positive: " + m("f") + " is increasing here" : d < -1e-9 ? "Negative: " + m("f") + " is decreasing here" : "Zero: horizontal tangent") : "No single tangent (corner)", ""],
      ["Compared with a step to the left", cmpTxt(d, dl), " dx-x2"],
      ["Point on the " + m("f′") + " panel", ok ? (dec(d, 2).indexOf("≈") === 0 ? "≈ " : "") + "(" + num(x, 1) + ", " + num(d, 2) + ")" : "none (no slope at a corner)", " dx-x2"]
    ];
    $("#dx-read", host).innerHTML = rows.map(function(r){ return '<div class="dx-row' + r[2] + '"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
  }
  function paintTop(){
    $("#dx-eq", host).innerHTML = fnC().eq;
    MV.keepFocus($("#dx-fn", host), function(){
      $("#dx-fn", host).innerHTML = C.fns.map(function(q){ return '<button type="button" class="chip' + (q.id === S.fn ? " on" : "") + '" data-fn="' + q.id + '" data-k="fn' + q.id + '" aria-pressed="' + (q.id === S.fn) + '"><strong>' + q.id + "</strong> " + q.chip + "</button>"; }).join("");
    });
    MV.keepFocus($("#dx-mode", host), function(){ $("#dx-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    $("#dx-how", host).innerHTML = C.modeHow[S.mode];
  }
  function paintTools(){
    var h = "", mo = S.mode, sh = canShow();
    if (mo === "trail") {
      h = '<div class="q-actions"><button type="button" class="chip" data-act="show" data-k="dxshow" aria-pressed="' + (sh && !!S.show[S.fn]) + '"' + (sh ? "" : " disabled") + ">Show " + m("f′") + "</button>" +
        '<button type="button" class="btn ghost sm" data-act="clear" data-k="dxclear"' + (trail().length ? "" : " disabled") + ">Clear trail</button></div>" + (sh ? "" : '<p class="tiny muted">Move the point to leave a trail; then you can show ' + m("f′") + ".</p>");
    } else if (mo === "table") {
      var R = rec().slice().sort(function(a, b){ return a - b; }), Fn = F();
      h = '<div class="q-actions"><button type="button" class="btn primary sm" data-act="record" data-k="dxrec">Record slope</button>' +
        '<button type="button" class="chip" data-act="join" data-k="dxjoin" aria-pressed="' + !!S.join[S.fn] + '"' + (R.length > 1 ? "" : " disabled") + ">Join the dots</button>" +
        '<button type="button" class="chip" data-act="show" data-k="dxshow" aria-pressed="' + (sh && !!S.show[S.fn]) + '"' + (sh ? "" : " disabled") + ">Show " + m("f′") + "</button>" +
        '<button type="button" class="btn ghost sm" data-act="cleartab" data-k="dxctab"' + (R.length ? "" : " disabled") + ">Clear table</button></div>" +
        (note ? '<p class="tiny dx-note" role="status">' + note + "</p>" : "") +
        (R.length ? '<div class="dx-tbl">' + MV.tableHTML({ head:[m("x"), "Slope " + m("f′(x)")], rows:R.map(function(k){ return [num(k / 10, 1), dec(Fn.d(k / 10), 2)]; }), hiRow:R.indexOf(k10(xv())), caption:"Recorded tangent slopes" }) + "</div>" : '<p class="tiny muted">No rows yet: move the point, then press Record slope.</p>');
    } else {
      var s = sk(), iv = dpSketch.intervals(s.zeros);
      h = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Tap the lower panel to place</span>' + segBtns("tool", [{ id:"zero", t:"A zero of " + m("f′") }, { id:"ext", t:"Peak or valley" }], S.tool, "What a tap places") + "</div>" +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="place" data-k="dxplace">Place at the tangent (' + m("x = " + num(xv(), 1)) + ")</button></div>" +
        '<p class="tiny" style="font-weight:700;margin:10px 0 4px">Sign of ' + m("f′") + " on each interval</p>" +
        '<div class="dp-signs" role="group" aria-label="Sign of f′ on each interval">' + iv.map(function(q, j){
          var g = s.signs[j] || 0, t = ivTxt(q[0], q[1]);
          return '<button type="button" class="dp-sg' + (g ? " on" : "") + '" data-sg="' + j + '" data-k="sg' + j + '" aria-label="Sign of f′ on ' + MV.esc(t) + ": " + (g > 0 ? "positive" : g < 0 ? "negative" : "not marked") + '. Tap to change."><span>' + t + '</span><b aria-hidden="true">' + (g > 0 ? "+" : g < 0 ? MINUS : "·") + "</b></button>";
        }).join("") + "</div>";
      if (S.fn === "F6") h += '<p class="tiny" style="font-weight:700;margin:10px 0 4px">Value of ' + m("f′") + " at the peak or valley</p>" +
        '<div class="chips" role="group" aria-label="Approximate value of f′ at the peak or valley">' + C.values.map(function(v){ return '<button type="button" class="chip' + (s.val === v ? " on" : "") + '" data-val="' + MV.esc(v) + '" data-k="val' + MV.esc(v) + '" aria-pressed="' + (s.val === v) + '"' + (s.ext == null ? " disabled" : "") + ">" + v + "</button>"; }).join("") + "</div>" +
        (s.ext == null ? '<p class="tiny muted" style="margin-top:-8px">Place the peak or valley first.</p>' : "");
      h += '<div class="q-actions"><button type="button" class="chip" data-act="reveal" data-k="dxrev" aria-pressed="' + !!s.reveal + '">Reveal ' + m("f′") + '</button><button type="button" class="btn ghost sm" data-act="clearsk" data-k="dxcsk">Clear sketch</button></div>';
    }
    lastCan = sh;
    MV.keepFocus($("#dx-tools", host), function(){ $("#dx-tools", host).innerHTML = h; });
  }
  function paintAll(){ paintTop(); syncSlider(); paintTools(); paintRead(); dp.render(); }
  function chooseFn(id){
    S.fn = id; mark = null; note = "";
    if (S.mode === "trail" && MV.reduceMotion) fillAll();
    api.save(); dp.set(xv(), "set"); paintAll(); MV.changed();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b)) return;
    if (b.dataset.fn) { chooseFn(b.dataset.fn); return; }
    if (b.id === "dx-more") { var on = !$("#dx-read", host).classList.contains("dx-all"); $("#dx-read", host).classList.toggle("dx-all", on); b.setAttribute("aria-expanded", String(on)); b.textContent = on ? "Less" : "More"; return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; mark = null; note = ""; if (S.mode === "trail" && MV.reduceMotion) fillAll(); api.save(); paintAll(); MV.changed(); return; }
    if (b.dataset.tool) { S.tool = b.dataset.tool; api.save(); paintTools(); return; }
    if (b.dataset.sg != null) { var s = sk(), j = +b.dataset.sg, g = s.signs[j] || 0; s.signs[j] = g === 0 ? 1 : g === 1 ? -1 : 0; api.save(); paintTools(); dp.render(); MV.changed(); return; }
    if (b.dataset.val != null) { sk().val = b.dataset.val; api.save(); paintTools(); dp.render(); MV.changed(); return; }
    var a = b.dataset.act; if (!a) return;
    if (a === "show") S.show[S.fn] = !S.show[S.fn];
    else if (a === "clear") { S.trail[S.fn] = []; addKeys(xv(), xv()); }
    else if (a === "record") { var x = xv(); if (!isFinite(F().d(x))) note = "No single tangent at a corner, so there’s no slope to record here."; else { note = ""; if (rec().indexOf(k10(x)) < 0) rec().push(k10(x)); } }
    else if (a === "join") S.join[S.fn] = !S.join[S.fn];
    else if (a === "cleartab") { S.rec[S.fn] = []; S.join[S.fn] = false; }
    else if (a === "place") { place(xv()); return; }
    else if (a === "reveal") sk().reveal = !sk().reveal;
    else if (a === "clearsk") S.sk[S.fn] = dpSketch.fresh();
    api.save(); paintTools(); dp.render(); MV.changed();
  });
  var sl = $("#dx-x", host);
  sl.addEventListener("input", function(){ dp.set(+sl.value, "slider"); });
  sl.addEventListener("keydown", function(e){
    if (busy) { e.preventDefault(); return; }
    if (e.shiftKey && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) { e.preventDefault(); dp.set(xv() + (/Left|Down/.test(e.key) ? -1 : 1), "slider"); }
    else if (e.key === "Enter" && S.mode === "sketch") { e.preventDefault(); place(xv()); }
  });
  if (S.mode === "trail" && MV.reduceMotion) fillAll();
  addKeys(xv(), xv());
  paintAll();

  // ---- predictions: trail reveals ----
  var stopAnim = null;
  function sweep(a, b, dur, cb){
    stopAnim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ dp.set(a + (b - a) * t, "anim"); }, done:function(){ stopAnim = null; if (cb) cb(); } });
  }
  var START = { p1:-4, p2:-4, p3:-3, p4:-4 };
  // ---- challenge tests ----
  function chal(id){
    var M = MS[id];
    if (id === "tc1") {
      if (S.fn !== "F3") return { ok:false, msg:M.fn };
      var x = xv(), sl3 = XF.F3.d(x), f3 = XF.F3.f(x);
      if (Math.abs(sl3 - 9) <= 1 || near(Math.abs(x), 2, 0.05)) return { ok:true };
      if (near(Math.abs(x), 3, 0.05)) return { ok:false, msg:M.x3 };
      if (Math.abs(f3 - 9) <= 1) return { ok:false, msg:M.height };
      return { ok:false, msg:tpl(M.other, { m:dec(sl3, 2) }) };
    }
    if (id === "tc2") {
      var s = S.sk.F4;
      if (!s || !s.zeros || !s.zeros.length) return { ok:false, msg:M.fn };
      if (s.zeros.some(function(z){ return near(Math.abs(z), 2 * Math.SQRT2, 0.15); })) return { ok:false, msg:M.xint };
      if (!dpSketch.zerosOK(s.zeros, [-2, 0, 2], 0.15)) return { ok:false, msg:M.zeros };
      var g = s.signs || [];
      if (dpSketch.same(g, [-1, 1, -1, 1])) return { ok:true };
      if (g.length !== 4 || g.some(function(v){ return !v; })) return { ok:false, msg:M.missing };
      if (dpSketch.same(g, [1, -1, 1, -1])) return { ok:false, msg:M.reversed };
      if (dpSketch.same(g, [1, -1, -1, 1])) return { ok:false, msg:M.fromf };
      return { ok:false, msg:M.signs };
    }
    if (id === "tc3") {
      var t = S.sk.F6;
      if (!t || t.ext == null) return { ok:false, msg:M.fn };
      if (near(t.ext, 1, 0.2)) return { ok:false, msg:M.x1 };
      if (near(t.ext, -3, 0.2)) return { ok:false, msg:M.x3 };
      if (!near(t.ext, -1, 0.2)) return { ok:false, msg:M.xother };
      if (t.val == null) return { ok:false, msg:M.noval };
      var v = parseFloat(String(t.val).replace(MINUS, "-"));
      if (v === -4) return { ok:true };
      if (v === 0) return { ok:false, msg:M.v0 };
      return { ok:false, msg:M.v9 };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stopAnim) { stopAnim(); stopAnim = null; }
        busy = true; S.fn = p.fn; S.mode = "trail"; S.trail[p.fn] = []; S.show[p.fn] = false; mark = null; note = "";
        S.x[p.fn] = START[p.id] == null ? -4 : START[p.id];
        dp.set(S.x[p.fn], "set"); paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; api.save(); paintAll(); MV.changed(); done(); }
        function show(pts, cb){ mark = { fn:p.fn, pts:pts }; dp.render(); MV.wait(900, cb); }
        if (p.id === "p1") sweep(-4, 2, 2600, function(){ show([{ i:0, x:2, y:-3, text:"flat tangent", dy:20 }, { i:1, x:2, y:0, text:"crosses 0 at x = 2", dy:-18 }], function(){ sweep(2, 4, 900, fin); }); });
        else if (p.id === "p2") sweep(-4, 4, 3200, function(){ show([{ i:1, x:3, y:2, text:"a straight line, slope 2", dx:-12, align:"right", dy:-16 }], fin); });
        else if (p.id === "p3") sweep(-3, 0, 2000, function(){ show([{ i:0, x:0, y:0, text:"steepest point", dy:-18 }, { i:1, x:0, y:-3, text:"lowest: (0, −3)", dy:-16 }], function(){ sweep(0, 3, 1600, fin); }); });
        else if (p.id === "p4") sweep(-4, 4, 3200, function(){ show([{ i:0, x:1, y:0, text:"corner: no single tangent", dy:-20 }, { i:1, x:1, y:0, text:"no value at x = 1", dx:12, dy:16, noRing:true }], fin); });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Graph ↔ derivative ----------
// @component slopeGallery — two columns of graph thumbnails (f, f′) to pair, with a "Check it with slopes" panel: three tangents
// on the chosen f and their slopes as dots on the chosen f′ (they land on the curve only for the true pair).
var GAL = [
  { id:"A", f:function(x){ return -x + 2; }, d:function(){ return -1; }, fv:{ ymin:-2, ymax:5 }, dv:{ ymin:-3, ymax:3 }, xs:[-1, 0.5, 2], fd:"a falling line", dd:"a horizontal line at −1" },
  { id:"B", f:function(x){ return (x - 1) * (x - 1) - 2; }, d:function(x){ return 2 * x - 2; }, fv:{ ymin:-3, ymax:5 }, dv:{ ymin:-7, ymax:5 }, xs:[-1, 1, 2.5], fd:"a parabola opening up with vertex (1, −2)", dd:"a rising line crossing 0 at x = 1" },
  { id:"C", f:function(x){ return x * x * x - 3 * x; }, d:function(x){ return 3 * x * x - 3; }, fv:{ ymin:-4, ymax:4 }, dv:{ ymin:-4, ymax:8 }, xs:[-1.5, 0, 1], fd:"a cubic with turning points at x = −1 and x = 1", dd:"an upward parabola with zeros at −1 and 1" },
  { id:"D", f:function(x){ return (x - 1) * (x - 1) * (x - 1) + 1; }, d:function(x){ return 3 * (x - 1) * (x - 1); }, fv:{ ymin:-3, ymax:5 }, dv:{ ymin:-2, ymax:8 }, xs:[0, 1, 2], fd:"a cubic that flattens for a moment at (1, 1)", dd:"an upward parabola touching 0 at x = 1" }
];
var GX = { xmin:-2.4, xmax:3.4 };
var P3F = [
  FN({ f:function(x){ return x * x * x - 3 * x * x + 3; }, d:function(x){ return 3 * x * x - 6 * x; }, view:{ xmin:-1.5, xmax:3.5, ymin:-3, ymax:5 }, dv:{ ymin:-4.5, ymax:7 }, lo:-1.2, hi:3.2, x0:2.6, ip:1, kind:"valley", step:0.05 }),
  FN({ f:function(x){ return -x * x * x + 3 * x; }, d:function(x){ return -3 * x * x + 3; }, view:{ xmin:-2.5, xmax:2.5, ymin:-4, ymax:4 }, dv:{ ymin:-7, ymax:4.5 }, lo:-2.2, hi:2.2, x0:-1.5, ip:0, kind:"peak", step:0.05 }),
  FN({ f:function(x){ return 4 / (1 + Math.exp(-2 * (x - 1))); }, d:function(x){ var e = Math.exp(-2 * (x - 1)); return 8 * e / ((1 + e) * (1 + e)); }, view:{ xmin:-2, xmax:4, ymin:-0.6, ymax:4.6 }, dv:{ ymin:-0.5, ymax:2.6 }, lo:-1.8, hi:3.8, x0:-1, ip:1, kind:"peak", step:0.05 })
];
function part3(host, api){
  var S = api.S, C = api.content, ST = C.stations;
  S.g1 = S.g1 || { sel:null, pick:null, done:{} }; S.g1.done = S.g1.done || {};
  S.c = S.c == null ? 0 : S.c; S.d = S.d == null ? 0 : S.d;
  S.r3 = S.r3 || 0; S.x3 = S.x3 || {}; S.ok3 = S.ok3 || {}; S.show3 = S.show3 || {};
  var RIGHT = MV.shuffle(GAL.map(function(g){ return g.id; }), "mcv07-gallery"), LET = ["P", "Q", "R", "S"];
  function gal(id){ return GAL.filter(function(g){ return g.id === id; })[0]; }
  function letter(id){ return LET[RIGHT.indexOf(id)]; }
  function nOf(id){ return GAL.indexOf(gal(id)) + 1; }
  host.innerHTML =
    '<div class="part p3-st" id="st1"><h3>' + ST[0].title + "</h3><p>" + ST[0].text + '</p><div class="g1"><div class="g1-col"><h4>Graphs of ' + m("f") + '</h4><div class="g1-grid" role="group" aria-label="Graphs of f">' +
      GAL.map(function(g, i){ return '<button type="button" class="g1-th" data-gf="' + g.id + '" data-k="gf' + g.id + '" aria-pressed="false"><span class="g1-tag">' + (i + 1) + '</span><canvas class="plot" role="img" aria-label="Graph ' + (i + 1) + " of f: " + MV.esc(g.fd) + '"></canvas></button>'; }).join("") +
    '</div></div><div class="g1-col"><h4>Graphs of ' + m("f′") + '</h4><div class="g1-grid" role="group" aria-label="Graphs of f′">' +
      RIGHT.map(function(id, i){ return '<button type="button" class="g1-th" data-gd="' + id + '" data-k="gd' + id + '"><span class="g1-tag">' + LET[i] + '</span><canvas class="plot" role="img" aria-label="Graph ' + LET[i] + " of f′: " + MV.esc(gal(id).dd) + '"></canvas></button>'; }).join("") +
    '</div></div></div><div class="g1-check"><h4>Check it with slopes</h4><p class="tiny muted" id="g1-cap" aria-live="polite"></p><div class="g1-pan"><div class="plot-wrap"><canvas class="plot dp-low" id="g1-top" role="img" aria-label="f with three tangents"></canvas></div><div class="plot-wrap"><canvas class="plot dp-low" id="g1-low" role="img" aria-label="The chosen f′ with the slope dots"></canvas></div></div><div id="g1-fb" aria-live="polite"></div></div></div>' +
    '<div class="part p3-st" id="st2"><h3>' + ST[1].title + "</h3><p>" + ST[1].text + '</p><div class="sym"><div><div class="dp-panels"><div class="plot-wrap dp-panel"><canvas class="plot dp-top" id="g2-top" role="img" aria-label="f and g"></canvas></div><div class="plot-wrap dp-panel"><canvas class="plot dp-low" id="g2-low" role="img" aria-label="f′ and g′"></canvas></div></div>' +
      '<p class="tiny muted" style="margin:6px 0 0">Top: ' + m("f") + " (grey dashes) and " + m("g") + " (blue). Bottom: " + m("f′") + " (grey dashes) and " + m("g′") + " (long dashes).</p></div>" +
      '<div><div id="g2-sl"></div><dl class="read" id="g2-read" aria-live="polite"></dl></div></div></div>' +
    '<div class="part p3-st" id="st3"><h3>' + ST[2].title + "</h3><p>" + ST[2].text + '</p><div class="chips" id="g3-r" role="group" aria-label="Choose a graph"></div><p class="pred-q" id="g3-q"></p>' +
      '<div class="sym"><div id="g3-pan"></div><div><dl class="read" id="g3-read" aria-live="polite"></dl><div class="q-actions"><button type="button" class="btn primary sm" id="g3-mark" data-k="g3mark">Mark this point</button><button type="button" class="btn ghost sm" id="g3-show" data-k="g3show">Show me</button></div><div id="g3-fb" aria-live="polite"></div></div></div></div>';

  // ---- Station 1: matching gallery ----
  var thumbs = {};
  function thumbScene(p, g, kind){
    var isF = kind === "f", v = Object.assign({}, GX, isF ? g.fv : g.dv);
    p.draw({ view:v, xTicks:{ step:1 }, yTicks:{ step:isF ? 1 : 2 }, curves:[{ f:isF ? g.f : g.d, color:isF ? css("--pen") : css("--f3"), width:2.6 }],
      describe:(isF ? "Graph " + nOf(g.id) + " of f: " + g.fd : "Graph " + letter(g.id) + " of f′: " + g.dd) + "." });
  }
  $$(".g1-th", host).forEach(function(b){
    var id = b.dataset.gf || b.dataset.gd, kind = b.dataset.gf ? "f" : "d", p = new MV.Plot($("canvas", b), GX);
    p.render = function(){ thumbScene(p, gal(id), kind); }; p.render(); thumbs[kind + id] = p;
  });
  var gTop = new MV.Plot($("#g1-top", host), GX), gLow = new MV.Plot($("#g1-low", host), GX), g1msg = null;
  function drawCheck(){
    var G = S.g1, g = G.sel ? gal(G.sel) : null, pk = G.pick ? gal(G.pick) : null, ink = css("--ink");
    if (!g) {
      gTop.draw({ view:Object.assign({}, GX, { ymin:-3, ymax:5 }), describe:"Empty panel: choose a graph of f." });
      gLow.draw({ view:Object.assign({}, GX, { ymin:-3, ymax:5 }), describe:"Empty panel: choose a graph of f′." });
      $("#g1-cap", host).innerHTML = "Choose a graph of " + m("f") + ", then a graph of " + m("f′") + ".";
      return;
    }
    var segs = [], pts = [];
    g.xs.forEach(function(x){ var y = g.f(x), s = g.d(x), dx = 0.55 / Math.sqrt(1 + s * s); segs.push({ x1:x - dx, y1:y - s * dx, x2:x + dx, y2:y + s * dx, color:ink, width:2.4 }); pts.push({ x:x, y:y, r:4.5, color:ink }); });
    gTop.draw({ view:Object.assign({}, GX, g.fv), yLabel:"f(x)", curves:[{ f:g.f, color:css("--pen"), width:3 }], segments:segs, points:pts,
      describe:"Graph " + nOf(g.id) + " of f with tangents at x = " + g.xs.map(function(x){ return num(x, 2); }).join(", ") + ", slopes " + g.xs.map(function(x){ return num(g.d(x), 2); }).join(", ") + "." });
    if (pk) {
      var lv = Object.assign({}, GX, pk.dv);
      gLow.draw({ view:lv, yLabel:"f′(x)", curves:[{ f:pk.d, color:css("--f3"), width:2.6 }],
        points:g.xs.map(function(x){ return { x:x, y:g.d(x), r:6, color:ink, ring:false }; }),
        segments:g.xs.map(function(x){ return { x1:x, y1:lv.ymin, x2:x, y2:lv.ymax, color:css("--ink-2"), width:1, dash:[3, 5] }; }),
        describe:"Graph " + letter(pk.id) + " of f′ with the three slope dots: " + g.xs.map(function(x){ return "(" + num(x, 2) + ", " + num(g.d(x), 2) + ")"; }).join(", ") + (G.pick === G.sel ? ". They land on the curve." : ". They miss the curve."),
        after:function(ctx, p){ g.xs.forEach(function(x){ dpEdge(ctx, p, x, g.d(x), ink); }); } });
    } else gLow.draw({ view:Object.assign({}, GX, { ymin:-3, ymax:5 }), describe:"Choose a graph of f′ to plot the slope dots on it." });
    $("#g1-cap", host).innerHTML = "Tangent slopes on graph " + nOf(g.id) + " at " + m("x") + " = " + g.xs.map(function(x){ return num(x, 2); }).join(", ") + ": " + g.xs.map(function(x){ return num(g.d(x), 2); }).join(", ") + "." + (pk ? " Dots plotted on graph " + letter(pk.id) + "." : " Now choose a graph of " + m("f′") + ".");
  }
  gTop.render = drawCheck; gLow.render = drawCheck;
  function paintG1(){
    var G = S.g1;
    $$(".g1-th", host).forEach(function(b){
      var gf = b.dataset.gf, gd = b.dataset.gd, done = !!G.done[gf || gd];
      b.classList.toggle("done", done);
      if (gf) b.setAttribute("aria-pressed", String(G.sel === gf)); else b.setAttribute("aria-pressed", String(G.pick === gd && !!G.sel));
    });
    var all = GAL.every(function(g){ return G.done[g.id]; });
    $("#g1-fb", host).innerHTML = g1msg ? MV.fbHTML(g1msg.kind, g1msg.html) : (all ? MV.fbHTML("good", "<strong>✓ " + ST[0].done + "</strong>") : "");
    drawCheck();
  }
  // ---- Station 2: translations ----
  var T2 = { f:function(x){ return x * x * x - 3 * x; }, d:function(x){ return 3 * x * x - 3; } }, V2 = { xmin:-5.5, xmax:5.5, ymin:-8, ymax:8 }, D2 = { xmin:-5.5, xmax:5.5, ymin:-5, ymax:14 };
  var t2Top = new MV.Plot($("#g2-top", host), V2), t2Low = new MV.Plot($("#g2-low", host), D2);
  function drawG2(){
    var c = S.c, d = S.d, g = function(x){ return T2.f(x - d) + c; }, gd = function(x){ return T2.d(x - d); }, ink2 = css("--ink-2"), pc = css("--p-c"), pd = css("--p-d");
    var arT = [], arL = [];
    if (d) { arT.push({ from:[-1, 2], to:[-1 + d, 2], color:pd }); arL.push({ from:[0, -3], to:[d, -3], color:pd }); }
    if (c) arT.push({ from:[-1 + d, 2], to:[-1 + d, 2 + c], color:pc });
    t2Top.draw({ view:V2, yLabel:"y", curves:[{ f:T2.f, color:ink2, width:2, dash:[6, 6], alpha:0.6 }, { f:g, color:css("--pen"), width:3 }], arrowsAnn:arT,
      describe:"Top: f(x) = x³ − 3x dashed, and g(x) = f(x − " + num(d) + ") + " + num(c) + ", with turning points at x = " + num(d - 1) + " and " + num(d + 1) + "." });
    t2Low.draw({ view:D2, yLabel:"slope", curves:[{ f:T2.d, color:ink2, width:2, dash:[6, 6], alpha:0.6 }, { f:gd, color:css("--ink"), width:2.6, dash:[14, 7] }], arrowsAnn:arL,
      describe:"Bottom: f′ dashed and g′ in long dashes. g′ is f′ shifted right " + num(d) + "; its zeros are at x = " + num(d - 1) + " and " + num(d + 1) + ". The vertical shift " + num(c) + " doesn’t move it." });
    var dt = d > 0 ? "slides right " + num(d) : d < 0 ? "slides left " + num(-d) : "doesn’t move";
    $("#g2-read", host).innerHTML = MV.readoutHTML([
      [m("g(x)"), m("f(" + (d > 0 ? "x - " + num(d) : d < 0 ? "x + " + num(-d) : "x") + ")" + (c > 0 ? " + " + num(c) : c < 0 ? " - " + num(-c) : ""))],
      ["Derivative", m("g′(x) = f′(x - @d{d})")],
      ["Effect of " + m("@c{c}") + " on " + m("g′"), c ? "None: " + m("g") + " moves " + (c > 0 ? "up " : "down ") + num(Math.abs(c)) + ", but every slope stays the same" : "None (and " + m("@c{c} = 0") + " now)"],
      ["Effect of " + m("@d{d}") + " on " + m("g′"), m("g′") + " " + dt],
      ["Zeros of " + m("g′") + " (turning points of " + m("g") + ")", m("x = " + num(d - 1) + "") + " and " + m("x = " + num(d + 1))]
    ]);
  }
  t2Top.render = drawG2; t2Low.render = drawG2;
  MV.sliders($("#g2-sl", host), [
    { id:"p3c", label:"Vertical shift " + m("@c{c}"), param:"c", min:-3, max:3, step:0.5, value:S.c },
    { id:"p3d", label:"Horizontal shift " + m("@d{d}"), param:"d", min:-3, max:3, step:0.5, value:S.d }
  ], function(id, v){ if (id === "p3c") S.c = v; else S.d = v; api.save(); drawG2(); });
  // ---- Station 3: inflection finder ----
  var R3 = ST[2].rounds, g3msg = {}, lp3 = null;
  function R(){ return P3F[S.r3]; }
  function rk(){ return "r" + S.r3; }
  function x3(){ var v = S.x3[rk()]; return v == null ? R().x0 : v; }
  function solved(){ return !!S.ok3[rk()]; }
  function revealed(){ return solved() || !!S.show3[rk()]; }
  function build3(){
    var Fn = R();
    lp3 = derivativePanels($("#g3-pan", host), { fn:R, x:x3(), step:0.05, big:10,
      aria:["Graph of f with a tangent you can move", "Graph of f′ (appears when you find the steepest point)"], labels:["f(x)", "f′(x)"],
      layers:function(i){ return i ? { show:revealed(), dot:revealed() ? "fill" : false } : {}; },
      extra:function(i, sc, p){
        var ip = Fn.ip, ink = css("--ink");
        if (i === 1 && !revealed()) sc.labels.push({ x:(Fn.view.xmin + Fn.view.xmax) / 2, y:(Fn.dv.ymin + Fn.dv.ymax) / 2, text:"f′ appears when you find the steepest point", align:"center", color:css("--ink-2"), bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif") });
        if (!revealed()) return;
        if (i === 0) { sc.points.push({ x:ip, y:Fn.f(ip), r:8, open:true, color:ink }); sc.labels.push({ x:ip, y:Fn.f(ip), text:"point of inflection", dx:12, dy:Fn.kind === "valley" ? 20 : -20, color:ink, bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif") }); }
        else { sc.points.push({ x:ip, y:Fn.d(ip), r:8, open:true, color:ink }); sc.labels.push({ x:ip, y:Fn.d(ip), text:Fn.kind + " of f′", dx:12, dy:Fn.kind === "valley" ? 18 : -18, color:ink, bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif") }); }
      },
      describe:function(i, x){
        if (!i) return "Graph " + (S.r3 + 1) + " of f, tangent at x = " + num(x, 2) + " with slope about " + num(Fn.d(x), 2) + (revealed() ? ". The point of inflection is marked at (" + num(Fn.ip, 2) + ", " + num(Fn.f(Fn.ip), 2) + ")." : ".");
        return revealed() ? "Graph of f′ with its " + Fn.kind + " at x = " + num(Fn.ip, 2) + ", value " + num(Fn.d(Fn.ip), 2) + "." : "Graph of f′, hidden until you find the steepest point.";
      },
      handleLabel:function(x){ return "Tangent at x = " + num(x, 2) + ", slope about " + num(R().d(x), 2) + ". Arrow keys move it; press Enter to mark this point."; },
      key:function(e){ if (e.key === "Enter") { mark3(); return true; } return false; },
      onMove:function(x){ S.x3[rk()] = x; api.save(); paint3read(); }
    });
  }
  function paint3read(){
    var Fn = R(), x = lp3 ? lp3.get() : x3();
    $("#g3-read", host).innerHTML = MV.readoutHTML([["Tangent at", m("x = " + num(x, 2))], ["Slope", dec(Fn.d(x), 2)]]);
  }
  function paint3(){
    MV.keepFocus($("#g3-r", host), function(){ $("#g3-r", host).innerHTML = R3.map(function(r, i){ var ok = !!S.ok3["r" + i]; return '<button type="button" class="chip' + (i === S.r3 ? " on" : "") + '" data-r3="' + i + '" data-k="r3' + i + '" aria-pressed="' + (i === S.r3) + '">' + (ok ? "✓ " : "") + r.name + "</button>"; }).join(""); });
    $("#g3-q", host).innerHTML = R3[S.r3].prompt;
    var fb = $("#g3-fb", host);
    if (solved()) fb.innerHTML = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + R3[S.r3].why);
    else if (S.show3[rk()]) fb.innerHTML = MV.fbHTML("", R3[S.r3].why);
    else fb.innerHTML = g3msg[rk()] ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + g3msg[rk()]) : "";
    $("#g3-mark", host).disabled = solved(); $("#g3-show", host).disabled = revealed();
    paint3read();
  }
  function mark3(){
    if (solved()) return;
    var Fn = R(), x = lp3.get();
    if (near(x, Fn.ip, 0.2)) { S.ok3[rk()] = true; g3msg[rk()] = null; }
    else g3msg[rk()] = tpl(ST[2].wrong, { x:m("x = " + num(x, 2)), m:dec(Fn.d(x), 2) });
    api.save(); lp3.render(); paint3(); MV.focusFb($("#st3", host));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var G = S.g1;
    if (b.dataset.gf) { G.sel = G.sel === b.dataset.gf ? null : b.dataset.gf; G.pick = null; g1msg = null; api.save(); paintG1(); return; }
    if (b.dataset.gd) {
      if (!G.sel) { g1msg = { kind:"", html:"Tap a graph of " + m("f") + " first, then a graph of " + m("f′") + "." }; paintG1(); return; }
      G.pick = b.dataset.gd;
      if (G.pick === G.sel) { G.done[G.sel] = true; g1msg = { kind:"good", html:"<strong>✓ Matched: graph " + nOf(G.sel) + " and graph " + letter(G.pick) + ".</strong> " + ST[0].good }; }
      else g1msg = { kind:"bad", html:"<strong>✗ Not a pair.</strong> " + ST[0].bad };
      api.save(); paintG1(); MV.focusFb($("#st1", host)); return;
    }
    if (b.dataset.r3 != null) { S.r3 = +b.dataset.r3; api.save(); build3(); lp3.render(); paint3(); return; }
    if (b.id === "g3-mark") { mark3(); return; }
    if (b.id === "g3-show") { S.show3[rk()] = true; api.save(); lp3.render(); paint3(); return; }
  });
  paintG1(); drawG2(); build3(); lp3.render(); paint3();
  return {};
}

// ---------- Practice 2: Sketch the derivative ----------
// @component sketchBuild (uses V5 derivativePanels) — one item at a time: build f′ on the lower panel (zeros by tap or Enter,
// +/− per interval, optional shape chips and peak-or-valley marker), judged against answer {zeros, signs, shape, ext} with named
// wrong states (zeroAt, extAt, signs, zerosMissing) then general feedback; multiple-choice items (graph options) in the same frame.
var SKF = {
  s1:FN({ f:function(x){ return x * x - 6 * x + 5; }, d:function(x){ return 2 * x - 6; }, view:{ xmin:-1, xmax:7, ymin:-5.5, ymax:9 }, dv:{ ymin:-8, ymax:8 }, lo:-0.5, hi:6.5, x0:4.5, desc:"Parabola opening up through (1, 0) and (5, 0), with vertex (3, −4)" }),
  s2:FN({ f:function(x){ return -x * x * x + 3 * x * x; }, d:function(x){ return -3 * x * x + 6 * x; }, view:{ xmin:-1.5, xmax:3.5, ymin:-4, ymax:8 }, dv:{ ymin:-9, ymax:5 }, lo:-1.2, hi:3.2, x0:-0.8, desc:"Cubic with a local minimum at (0, 0) and a local maximum at (2, 4)" }),
  s3:FN({ f:function(x){ return x * x * x * x - 2 * x * x; }, d:function(x){ return 4 * x * x * x - 4 * x; }, view:{ xmin:-2, xmax:2, ymin:-2, ymax:3 }, dv:{ ymin:-6, ymax:6 }, lo:-1.8, hi:1.8, x0:-1.5, desc:"W-shaped quartic with local minima at (−1, −1) and (1, −1) and a local maximum at (0, 0)" }),
  s4:FN({ f:function(x){ return x * x * x; }, d:function(x){ return 3 * x * x; }, view:{ xmin:-2, xmax:2, ymin:-5, ymax:5 }, dv:{ ymin:-3, ymax:10 }, lo:-1.8, hi:1.8, x0:-1.2, desc:"Cubic that rises everywhere and flattens for a moment at the origin" })
};
function sketchAct(host, api, a){
  var S = api.S; S.i = Math.min(S.i || 0, a.items.length - 1); S.items = S.items || {};
  var msg = {}, dp = null;
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="sk-n"></span><span class="dots" id="sk-dots" aria-hidden="true"></span></div><div id="sk-body"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="sk-prev" data-k="skprev">Previous</button><button type="button" class="btn ghost sm" id="sk-next" data-k="sknext">Next item</button></div>';
  function it(){ return a.items[S.i]; }
  function ist(){ var q = it(), x = S.items[q.id]; if (!x) x = S.items[q.id] = { tries:0, hint:0, solved:false, first:null, sk:dpSketch.fresh(), x:null, tool:"zero" }; if (!x.sk || !x.sk.zeros) x.sk = dpSketch.fresh(); return x; }
  function needs(k){ return (it().need || []).indexOf(k) >= 0; }
  function judge(){
    var q = it(), x = ist(), s = x.sk, ans = MV.ans(q), W = q.wrong || [], g = a.general, zok = dpSketch.zerosOK(s.zeros, ans.zeros, 0.15), i;
    for (i = 0; i < W.length; i++) {
      var w = W[i];
      if (w.zeroAt && s.zeros.some(function(z){ return w.zeroAt.some(function(t){ return near(z, t); }); })) return w.fb;
      if (w.extAt && s.ext != null && w.extAt.some(function(t){ return near(s.ext, t, 0.2); })) return w.fb;
      if (w.signs && zok && dpSketch.same(s.signs, w.signs)) return w.fb;
      if (w.zerosMissing && w.zerosMissing.some(function(t){ return !s.zeros.some(function(z){ return near(z, t); }); })) return w.fb;
    }
    if (!zok) return g.zeros;
    if (!dpSketch.same(s.signs, ans.signs)) return g.signs;
    if (needs("shape") && s.shape !== ans.shape) return g.shape;
    if (needs("ext") && !(s.ext != null && near(s.ext, ans.ext, 0.2))) return g.ext;
    return null;
  }
  function paintNav(){
    $("#sk-n", host).textContent = "Item " + (S.i + 1) + " of " + a.items.length + (it().star ? " ★" : "");
    $("#sk-dots", host).innerHTML = a.items.map(function(z, i){ var y = S.items[z.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#sk-prev", host).disabled = S.i === 0; $("#sk-next", host).disabled = S.i === a.items.length - 1;
  }
  function fbHTML(){
    var q = it(), x = ist();
    if (x.solved) return MV.fbHTML("good", "<strong>✓ Correct.</strong> " + q.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    return msg[q.id] ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg[q.id] + " Try again.") : "";
  }
  function paintCtl(){
    var q = it(), x = ist(), s = x.sk, iv = dpSketch.intervals(s.zeros), lock = x.solved, h = "";
    if (needs("ext")) h += '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Tap the lower panel to place</span>' + segBtns("sktool", [{ id:"zero", t:"A zero of " + m("f′") }, { id:"ext", t:"Peak or valley" }], x.tool, "What a tap places") + "</div>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="place" data-k="skplace"' + (lock ? " disabled" : "") + ">Place at the tangent (" + m("x = " + num(dp ? dp.get() : 0, 1)) + ")</button></div>";
    h += '<p class="tiny" style="font-weight:700;margin:10px 0 4px">Zeros of ' + m("f′") + ": " + (s.zeros.length ? s.zeros.map(function(z){ return num(z, 1); }).join(", ") : '<span class="muted">none yet</span>') + "</p>";
    h += '<p class="tiny" style="font-weight:700;margin:6px 0 4px">Sign of ' + m("f′") + ' on each interval</p><div class="dp-signs" role="group" aria-label="Sign of f′ on each interval">' + iv.map(function(r, j){
      var g = s.signs[j] || 0, t = ivTxt(r[0], r[1]);
      return '<button type="button" class="dp-sg' + (g ? " on" : "") + '" data-sg="' + j + '" data-k="sksg' + j + '" aria-label="Sign of f′ on ' + MV.esc(t) + ": " + (g > 0 ? "positive" : g < 0 ? "negative" : "not marked") + '. Tap to change."' + (lock ? " disabled" : "") + "><span>" + t + '</span><b aria-hidden="true">' + (g > 0 ? "+" : g < 0 ? MINUS : "·") + "</b></button>";
    }).join("") + "</div>";
    if (needs("shape")) h += '<p class="tiny" style="font-weight:700;margin:10px 0 4px">Shape of ' + m("f′") + '</p><div class="chips" role="group" aria-label="Shape of f′">' + a.shapes.map(function(o){ return '<button type="button" class="chip' + (s.shape === o.id ? " on" : "") + '" data-shape="' + o.id + '" data-k="sh' + o.id + '" aria-pressed="' + (s.shape === o.id) + '"' + (lock ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (needs("ext")) h += '<p class="tiny" style="margin:0 0 4px"><strong>Peak or valley:</strong> ' + (s.ext != null ? m("x = " + num(s.ext, 1)) : '<span class="muted">not placed yet</span>') + "</p>";
    if (!lock) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="skchk">Check</button>' + (q.hints ? MV.hintBtn("skh" + q.id, x.hint) : "") + '<button type="button" class="btn ghost sm" data-act="clear" data-k="skclr">Clear</button></div>' + (q.hints ? MV.hintsHTML(q.hints, x.hint) : "");
    h += '<div class="sk-fb">' + fbHTML() + "</div>";
    MV.keepFocus($("#sk-ctl", host), function(){ $("#sk-ctl", host).innerHTML = h; });
  }
  function paintMC(){
    var q = it(), x = ist();
    MV.keepFocus($("#sk-mc", host), function(){ $("#sk-mc", host).innerHTML = MV.mcHTML(q, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, noConf:true }); });
  }
  function build(){
    var q = it(), x = ist(), body = $("#sk-body", host);
    paintNav(); dp = null;
    if (q.kind === "mc") { body.innerHTML = '<div class="q" id="sk-mc"></div>'; paintMC(); return; }
    var Fn = SKF[q.fn];
    body.innerHTML = '<div class="q-prompt sk-q">' + q.prompt + '</div><div class="sym"><div id="sk-pan"></div><div id="sk-ctl"></div></div>';
    dp = derivativePanels($("#sk-pan", host), { fn:function(){ return Fn; }, x:x.x == null ? Fn.x0 : x.x, step:0.1, big:10,
      aria:["Graph of f: " + Fn.desc, "Your sketch of f′"], labels:["f(x)", "f′(x)"],
      layers:function(i){ return i ? { sketch:x.sk, show:x.solved, dot:false } : {}; },
      describe:function(i, xx){
        if (!i) return "Graph of f: " + Fn.desc + ". Tangent at x = " + num(xx, 1) + ", slope " + num(Fn.d(xx), 2) + ".";
        var s = x.sk; return "Your sketch of f′. Zeros: " + (s.zeros.length ? s.zeros.map(function(z){ return num(z, 1); }).join(", ") : "none") + ". Signs: " + dpSketch.intervals(s.zeros).map(function(r, j){ var g = s.signs[j]; return ivTxt(r[0], r[1]) + " " + (g > 0 ? "+" : g < 0 ? MINUS : "blank"); }).join("; ") + (s.ext != null ? ". Peak or valley at x = " + num(s.ext, 1) : "") + (x.solved ? ". The true f′ is shown." : ".");
      },
      tapLow:function(tx){ if (!x.solved) placeAt(tx); return true; },
      key:function(e){ if (e.key === "Enter" && !x.solved) { placeAt(dp.get()); return true; } return false; },
      onMove:function(nx){ x.x = nx; api.save(); var pb = $('[data-act="place"]', host); if (pb) pb.innerHTML = "Place at the tangent (" + m("x = " + num(nx, 1)) + ")"; }
    });
    dp.render(); paintCtl();
  }
  function placeAt(tx){
    var x = ist(); if (x.solved) return;
    if (needs("ext") && x.tool === "ext") dpSketch.setExt(x.sk, tx, 0.25); else dpSketch.toggleZero(x.sk, tx, 0.25);
    msg[it().id] = null; api.save(); dp.render(); paintCtl();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = it(), x = ist();
    if (b.id === "sk-prev" || b.id === "sk-next") { S.i += b.id === "sk-prev" ? -1 : 1; api.save(); build(); return; }
    if (q.kind === "mc") {
      if (!b.closest("#sk-mc")) return;
      if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
      else if (b.dataset.act === "hint") x.hint = Math.min(3, (x.hint || 0) + 1);
      else if (b.dataset.act === "check") { x.checked = true; if (MV.ok(q.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++; }
      else return;
      api.save(); paintMC(); paintNav(); if (b.dataset.act === "check") MV.focusFb($("#sk-mc", host));
      return;
    }
    if (!b.closest("#sk-ctl")) return;
    if (b.dataset.sktool) { x.tool = b.dataset.sktool; api.save(); paintCtl(); return; }
    if (b.dataset.sg != null) { var j = +b.dataset.sg, g = x.sk.signs[j] || 0; x.sk.signs[j] = g === 0 ? 1 : g === 1 ? -1 : 0; msg[q.id] = null; api.save(); dp.render(); paintCtl(); return; }
    if (b.dataset.shape) { x.sk.shape = b.dataset.shape; msg[q.id] = null; api.save(); paintCtl(); return; }
    var act = b.dataset.act;
    if (act === "place") { placeAt(dp.get()); return; }
    if (act === "clear") { var keep = x.sk.shape; x.sk = dpSketch.fresh(); x.sk.shape = keep; msg[q.id] = null; api.save(); dp.render(); paintCtl(); return; }
    if (act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(); return; }
    if (act === "check") {
      var r = judge();
      if (r == null) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[q.id] = null; }
      else { x.tries++; msg[q.id] = r; }
      api.save(); dp.render(); paintCtl(); paintNav(); MV.focusFb($("#sk-ctl", host));
    }
  });
  build();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(q){ var y = S.items[q.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || "Sketch the derivative") + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(q){ var y = S.items[q.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(q.goal != null ? q.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: steepest descent at x = 1 ----------
var task = (function(){
  var api, pTop, pLow;
  function read(){ var s = api ? api.S : {}; return { a:s.a === -1 ? -1 : 1, p:s.p == null ? -1 : s.p, q:s.q == null ? 4 : s.q }; }
  function f(d, x){ return d.a * (2 * x * x * x - 3 * (d.p + d.q) * x * x + 6 * d.p * d.q * x); }
  function fd(d, x){ return 6 * d.a * (x - d.p) * (x - d.q); }
  function maxAt(d){ var lo = Math.min(d.p, d.q), hi = Math.max(d.p, d.q); return d.a === 1 ? lo : hi; }
  function fit(fn, a, b){ var lo = Infinity, hi = -Infinity; for (var i = 0; i <= 120; i++) { var y = fn(a + (b - a) * i / 120); lo = Math.min(lo, y); hi = Math.max(hi, y); } var pad = Math.max(1, (hi - lo) * 0.12); return { ymin:lo - pad, ymax:hi + pad }; }
  function draw(){
    var d = read(), V = { xmin:-6, xmax:6 }, a = Math.min(d.p, d.q, 1) - 1.2, b = Math.max(d.p, d.q, 1) + 1.2, ink2 = css("--ink-2");
    var vt = Object.assign({}, V, fit(function(x){ return f(d, x); }, a, b)), vl = Object.assign({}, V, fit(function(x){ return fd(d, x); }, a, b));
    var guide = function(v){ return { x1:1, y1:v.ymin, x2:1, y2:v.ymax, color:ink2, width:1.5, dash:[5, 5] }; };
    var ok = d.p !== d.q, mx = maxAt(d), mn = d.p + d.q - mx;
    pTop.draw({ view:vt, yLabel:"f(x)", curves:ok ? [{ f:function(x){ return f(d, x); }, color:css("--pen"), width:3 }] : [], segments:[guide(vt)],
      points:ok ? [{ x:mx, y:f(d, mx), r:5, color:css("--ink"), label:"max" }, { x:mn, y:f(d, mn), r:5, color:css("--ink"), label:"min", below:true }] : [],
      labels:[{ x:1, y:vt.ymax, text:"x = 1", dx:6, dy:12, color:ink2, font:"italic 13px " + (css("--font-math") || "serif") }],
      describe:ok ? "Your cubic: local maximum at x = " + num(mx) + ", local minimum at x = " + num(mn) + ". Dashed line at x = 1." : "No graph: p and q are equal." });
    pLow.draw({ view:vl, yLabel:"f′(x)", curves:ok ? [{ f:function(x){ return fd(d, x); }, color:css("--f3"), width:2.6 }] : [], segments:[guide(vl)],
      points:ok ? [{ x:1, y:fd(d, 1), r:5, color:css("--f3") }, { x:(d.p + d.q) / 2, y:fd(d, (d.p + d.q) / 2), r:5, open:true, color:css("--ink") }] : [],
      labels:ok ? [{ x:1, y:fd(d, 1), text:"f′(1) = " + num(fd(d, 1)), dx:10, dy:-14, color:css("--ink"), bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif") }] : [],
      describe:ok ? "f′(x) = 6a(x − p)(x − q) with zeros " + num(d.p) + " and " + num(d.q) + ", vertex at x = " + num((d.p + d.q) / 2) + ", opening " + (d.a === 1 ? "up" : "down") + "; f′(1) = " + num(fd(d, 1)) + "." : "No graph." });
  }
  function paintIn(inp){
    var d = read();
    MV.keepFocus(inp, function(){
      inp.innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">' + m("@a{a}") + "</span>" + segBtns("ta", [{ id:"1", t:"1" }, { id:"-1", t:MINUS + "1" }], String(d.a), "a") + "</div>" +
        ["p", "q"].map(function(k){
          var v = d[k];
          return '<div class="tk-step"><span class="tk-lab">' + m(k) + '</span><button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="tk' + k + 'm" aria-label="Decrease ' + k + '"' + (v <= -5 ? " disabled" : "") + ">" + MINUS + '</button><output class="tk-val" aria-live="polite">' + num(v) + '</output><button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="tk' + k + 'p" aria-label="Increase ' + k + '"' + (v >= 5 ? " disabled" : "") + ">+</button></div>";
        }).join("") + '<p class="eq-cap tk-eq">' + m("f′(x) = " + (d.a === 1 ? "" : "-") + "6(x " + (d.p < 0 ? "+ " + num(-d.p) : "- " + num(d.p)) + ")(x " + (d.q < 0 ? "+ " + num(-d.q) : "- " + num(d.q)) + ")") + "</p>";
    });
  }
  return {
    render:function(inp, pv, a){
      api = a;
      pv.innerHTML = '<div class="dp-panels"><div class="plot-wrap dp-panel"><canvas class="plot dp-top" id="tk-top" role="img" aria-label="Your cubic f"></canvas></div><div class="plot-wrap dp-panel"><canvas class="plot dp-low" id="tk-low" role="img" aria-label="Its derivative f′"></canvas></div></div>';
      pTop = new MV.Plot($("#tk-top"), { xmin:-6, xmax:6, ymin:-10, ymax:10 }); pLow = new MV.Plot($("#tk-low"), { xmin:-6, xmax:6, ymin:-10, ymax:10 });
      pTop.render = draw; pLow.render = draw;
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        if (b.dataset.ta) a.S.a = +b.dataset.ta;
        else if (b.dataset.st) { var d = read(), k = b.dataset.st; a.S[k] = Math.max(-5, Math.min(5, d[k] + +b.dataset.dir)); }
        else return;
        if (a.S.p == null) a.S.p = read().p; if (a.S.q == null) a.S.q = read().q;
        a.save(); paintIn(inp); draw(); a.update();
      });
      paintIn(inp); draw();
    },
    read:read,
    valid:function(d){ return d.p !== d.q ? true : MV.md("`p` and `q` must be different: choose two different turning points."); },
    checks:function(d){
      if (d.p === d.q) return [false, false, false];
      return [maxAt(d) < 0, fd(d, 1) < 0, d.a === 1 && d.p + d.q === 2];
    },
    key:function(d){ return d.a + "|" + Math.min(d.p, d.q) + "|" + Math.max(d.p, d.q); },
    label:function(k){ var s = k.split("|"); return m("@a{a} = " + (s[0] === "-1" ? "-1" : "1")) + ", {" + num(+s[1]) + ", " + num(+s[2]) + "}"; },
    text:function(k){ var s = k.split("|"); return "a = " + num(+s[0]) + ", {p, q} = {" + num(+s[1]) + ", " + num(+s[2]) + "}"; }
  };
})();

// ---------- figures: Practice 1 thumbnails and Practice 2 (S5) graphs ----------
function thumb(f, color, v, opts){
  opts = opts || {};
  return function(p){
    p.draw({ view:v, xTicks:{ step:1, fmt:function(t){ return Math.round(t) % 2 === 0 ? num(t) : ""; } }, yTicks:{ step:1, fmt:function(t){ return Math.round(t) % 2 === 0 ? num(t) : ""; } },
      curves:opts.pieces ? opts.pieces.map(function(dm){ return { f:f, color:css(color), width:2.8, domain:dm }; }) : [{ f:f, color:css(color), width:2.8 }],
      points:(opts.open || []).map(function(q){ return { x:q[0], y:q[1], r:5, open:true, color:css(color) }; }) });
  };
}
var LV = { xmin:-3, xmax:3, ymin:-4, ymax:6 }, RV = { xmin:-3, xmax:3, ymin:-4, ymax:4 }, S5V = { xmin:-4, xmax:3, ymin:-3, ymax:3 };
var FIGS = {
  m1:thumb(function(x){ return 2 * x + 1; }, "--pen", LV), m2:thumb(function(){ return 5; }, "--pen", LV), m3:thumb(function(x){ return x * x; }, "--pen", LV),
  m4:thumb(function(x){ return -x * x + 4; }, "--pen", LV), m5:thumb(function(x){ return (x - 1) * (x - 1); }, "--pen", LV), m6:thumb(function(x){ return x * x * x; }, "--pen", LV),
  m7:thumb(function(x){ return x * x * x - 3 * x; }, "--pen", LV), m8:thumb(function(x){ return Math.abs(x); }, "--pen", LV),
  d1:thumb(function(){ return 2; }, "--f3", RV), d2:thumb(function(){ return 0; }, "--f3", RV), d3:thumb(function(x){ return 2 * x; }, "--f3", RV),
  d4:thumb(function(x){ return -2 * x; }, "--f3", RV), d5:thumb(function(x){ return 2 * x - 2; }, "--f3", RV), d6:thumb(function(x){ return 3 * x * x; }, "--f3", RV),
  d7:thumb(function(x){ return 3 * x * x - 3; }, "--f3", RV), d8:thumb(function(x){ return x < 0 ? -1 : 1; }, "--f3", RV, { pieces:[[-3.1, -1e-6], [1e-6, 3.1]], open:[[0, -1], [0, 1]] }),
  s5g:thumb(function(x){ return x + 1; }, "--f3", S5V),
  s5a:thumb(function(x){ return (x + 1) * (x + 1) / 2 - 1; }, "--pen", S5V), s5b:thumb(function(x){ return -(x + 1) * (x + 1) / 2 + 1; }, "--pen", S5V),
  s5c:thumb(function(x){ return (x - 1) * (x - 1) / 2 - 1; }, "--pen", S5V), s5d:thumb(function(x){ return x + 1; }, "--pen", S5V)
};

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ sketch:sketchAct },
  task:task,
  figures:FIGS
});
})();
