// MHF4U 05 Graphing from Factored Form: hero lenses, the N21 zero builder (Explore and the performance task),
// equation from a graph (Part 3), the "Find the equation" practice set and the matching thumbnails.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num;

// @component N21 zeroBuilder — zeros on the x-axis with order chips, an a slider, Build / Lens / Sign strip modes, auto-fit window with zoom (G10)
// Self-contained (copy this whole block). First home: MHF4U 05; planned reuse: 10, 14, 15.
//   var zb = zeroBuilder({ graph, ctrl, read [, cap, canvas], uid:"zbx", aria:"…",
//     state:{ zeros:[[r, k], …], a, mode:"build"|"lens"|"sign", lens:r, target:id, hideY:false },
//     snap:0.5, min:-6, max:6, maxZeros:4, maxDeg:6, aMin:-3, aMax:3, aStep:0.25, modes:true, zoom:true,
//     targets:[{ id, label, z:[[r, k], …], a, pt:[x, y] }],          // optional dashed target curves (toggle chips)
//     onChange:function(state, how){} });                              // how: drag|key|order|add|remove|a|mode|lens|zoom|target|set|morph|tween|explain
//   zb.get() -> state   zb.set(state)   zb.morph({z, a}, {dur, done})   zb.tweenA(a, {ghost, dur, done})   zb.explainYInt({done})
//   zeroBuilder.poly = polynomial helpers on {r, k} zero lists (f, deg, signs, eqM, fit, end, behave, describe, …)
//   zeroBuilder.drawLens(ctx, {cx, cy, R, f, r, k, C, open, draw}) = the G11 magnifier lens.
var zeroBuilder = (function(){
  var MV = window.MV, css = MV.css, num = MV.num;
  var P = {};
  function clean(v){ v = Math.round(v * 1e6) / 1e6; return v === 0 ? 0 : v; }
  function nm(v){ return String(clean(v)); }
  function list(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
  P.clean = clean; P.nm = nm; P.list = list;
  P.toZ = function(pairs){ return pairs.map(function(p){ return { r:p[0], k:p[1] }; }); };
  P.sorted = function(zs){ return zs.slice().sort(function(p, q){ return p.r - q.r; }); };
  P.deg = function(zs){ return zs.reduce(function(s, z){ return s + z.k; }, 0); };
  P.f = function(zs, a){ return function(x){ var y = a; for (var i = 0; i < zs.length; i++) y *= Math.pow(x - zs[i].r, zs[i].k); return y; }; };
  // near zero z0, f(x) ≈ coef·(x − r)^k
  P.coef = function(zs, a, z0){ var c = a; zs.forEach(function(z){ if (z !== z0) c *= Math.pow(z0.r - z.r, z.k); }); return c; };
  P.behave = function(k){ return k % 2 === 0 ? "touches" : k === 1 ? "crosses" : "crosses and flattens"; };
  P.end = function(a, deg){
    var ev = deg % 2 === 0, L = ev ? (a > 0 ? "∞" : "-∞") : (a > 0 ? "-∞" : "∞"), R = a > 0 ? "∞" : "-∞";
    return { q:ev ? (a > 0 ? "Q2 to Q1" : "Q3 to Q4") : (a > 0 ? "Q3 to Q1" : "Q2 to Q4"),
      words:ev ? (a > 0 ? "Both arms up" : "Both arms down") : (a > 0 ? "Starts low on the left and ends high on the right" : "Starts high on the left and ends low on the right"),
      html:"as " + MV.m("x → -∞") + ", " + MV.m("y → " + L) + ", and as " + MV.m("x → ∞") + ", " + MV.m("y → " + R) };
  };
  // math-markup strings (for MV.m)
  P.factorM = function(r, k){ var b = r === 0 ? "x" : "(x " + (r < 0 ? "+ " : "- ") + nm(Math.abs(r)) + ")"; return k > 1 ? b + "^" + k : b; };
  P.fracM = function(v){
    var s = MV.frac(clean(v), 12).replace(MV.MINUS, "-"); if (s.indexOf("/") < 0) return s;
    var neg = s.charAt(0) === "-", p = s.replace("-", "").split("/"); return (neg ? "-" : "") + "{" + p[0] + "}/{" + p[1] + "}";
  };
  P.aM = function(a){ return a === 1 ? "" : a === -1 ? "-" : P.fracM(a); };
  P.eqM = function(zs, a, col){ var c = P.aM(a); return "y = " + (c ? (col ? "@a{" + c + "}" : c) : "") + P.sorted(zs).map(function(z){ return P.factorM(z.r, z.k); }).join(""); };
  P.cells = function(zs, a){
    var s = P.sorted(zs), f = P.f(zs, a), b = [-Infinity].concat(s.map(function(z){ return z.r; }), [Infinity]), out = [];
    for (var i = 0; i + 1 < b.length; i++) {
      var lo = b[i], hi = b[i + 1], mid = lo === -Infinity ? hi - 1 : hi === Infinity ? lo + 1 : (lo + hi) / 2;
      out.push({ a:lo, b:hi, mid:mid, s:Math.sign(f(mid)) });
    }
    return out;
  };
  P.signs = function(zs, a){
    var c = P.cells(zs, a), pick = function(sg){ return c.filter(function(x){ return x.s === sg; }).map(function(x){ return { a:x.a, b:x.b, aIn:false, bIn:false }; }); };
    return { cells:c, pos:pick(1), neg:pick(-1) };
  };
  P.lobes = function(zs, a){
    var s = P.sorted(zs), f = P.f(zs, a), out = [];
    for (var i = 0; i + 1 < s.length; i++) {
      var best = 0;
      for (var j = 1; j < 80; j++) { var y = f(s[i].r + (s[i + 1].r - s[i].r) * j / 80); if (Math.abs(y) > Math.abs(best)) best = y; }
      out.push(best);
    }
    return out;
  };
  // Fit (G10): x from the zeros (and 0); y from the lobes, the neighbourhood of a lone zero and the y-intercept,
  // capped so no lobe fills less than 10% of the height. o: {x:[xmin, xmax], extraX, extraY, extraLobes, must, minSpan}
  P.fit = function(zs, a, o){
    o = o || {};
    var f = P.f(zs, a), xmin, xmax;
    if (o.x) { xmin = o.x[0]; xmax = o.x[1]; }
    else {
      var xs = zs.map(function(z){ return z.r; }).concat(o.extraX || [], [0]);
      var lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs), pad = Math.max(1.2, (hi - lo) * 0.18), span = o.minSpan || 5;
      xmin = lo - pad; xmax = hi + pad;
      if (xmax - xmin < span) { var c = (xmin + xmax) / 2; xmin = c - span / 2; xmax = c + span / 2; }
    }
    var lobes = P.lobes(zs, a);
    if (!lobes.length) zs.forEach(function(z){ lobes.push(f(z.r - 1.5), f(z.r + 1.5)); });
    lobes = lobes.concat(o.extraLobes || []);
    var vals = lobes.concat([f(0)], o.extraY || []), pos = 0, neg = 0;
    vals.forEach(function(v){ if (!isFinite(v)) return; if (v > pos) pos = v; if (-v > neg) neg = -v; });
    var mags = lobes.map(Math.abs).filter(function(v){ return v > 1e-12 && isFinite(v); });
    if (mags.length) {
      var m = Math.min.apply(null, mags), R = pos + neg, cap = Math.max(10 * m, 0.04 * R);
      if (R > cap) {
        pos = pos > 0 ? Math.max(Math.min(pos, cap * pos / R), Math.min(pos, 1.25 * m)) : 0;
        neg = neg > 0 ? Math.max(Math.min(neg, cap * neg / R), Math.min(neg, 1.25 * m)) : 0;
      }
    }
    (o.must || []).forEach(function(v){ if (v > pos) pos = v; if (-v > neg) neg = -v; });
    if (!(pos > 0) && !(neg > 0)) pos = neg = 1;
    if (pos < 0.12 * neg) pos = 0.12 * neg;
    if (neg < 0.12 * pos) neg = 0.12 * pos;
    return { xmin:xmin, xmax:xmax, ymin:-neg * 1.2, ymax:pos * 1.2 };
  };
  P.union = function(v, w){ return { xmin:Math.min(v.xmin, w.xmin), xmax:Math.max(v.xmax, w.xmax), ymin:Math.min(v.ymin, w.ymin), ymax:Math.max(v.ymax, w.ymax) }; };
  P.describe = function(zs, a){
    var s = P.sorted(zs), e = P.end(a, P.deg(s)), by = { 1:[], 2:[], 3:[] }, parts = [];
    s.forEach(function(z){ (by[z.k] || (by[z.k] = [])).push(num(z.r)); });
    if (by[1].length) parts.push("crosses at " + list(by[1]));
    if (by[2].length) parts.push("touches at " + list(by[2]));
    if (by[3].length) parts.push("crosses and flattens at " + list(by[3]));
    var t = parts.join(", ");
    return "Graph of " + MV.plain(MV.m(P.eqM(s, a))) + ". " + t.charAt(0).toUpperCase() + t.slice(1) + ". " + e.words + ". y-intercept " + num(P.f(s, a)(0), 3) + ".";
  };

  // G11 lens: the curve over −1 ≤ x − r ≤ 1 with its own vertical scale, a dashed ghost C(x − r)^k, 2 px --rule rim.
  function drawLens(ctx, o){
    var R = o.R * (o.open == null ? 1 : o.open); if (R < 2) return;
    var cx = o.cx, cy = o.cy, N = 96, i, t, y, maxA = 0;
    for (i = 0; i <= N; i++) { t = -1 + 2 * i / N; y = Math.abs(o.f(o.r + t)); if (isFinite(y) && y > maxA) maxA = y; }
    if (!(maxA > 0)) maxA = 1;
    var sx = 0.84 * R, sy = 0.72 * R / maxA;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.fillStyle = css("--sheet"); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.strokeStyle = css("--plot-grid"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
    function path(fn, upto){
      ctx.beginPath(); var on = false;
      for (i = 0; i <= N; i++) {
        t = -1 + 2 * i / N; if (t > upto + 1e-9) break;
        var yy = fn(t); if (!isFinite(yy)) { on = false; continue; }
        var X = cx + t * sx, Y = Math.max(cy - 3 * R, Math.min(cy + 3 * R, cy - yy * sy));
        if (!on) { ctx.moveTo(X, Y); on = true; } else ctx.lineTo(X, Y);
      }
      ctx.stroke();
    }
    if (o.C != null) { ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 2; ctx.setLineDash([5, 5]); path(function(tt){ return o.C * Math.pow(tt, o.k); }, 1); ctx.setLineDash([]); }
    ctx.strokeStyle = css("--pen"); ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
    path(function(tt){ return o.f(o.r + tt); }, o.draw == null ? 1 : -1 + 2 * o.draw);
    ctx.fillStyle = css("--ink"); ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, 2 * Math.PI); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.lineWidth = 2; ctx.strokeStyle = css("--rule"); ctx.stroke();
    ctx.restore();
  }
  function chip(ctx, x, y, text, font){
    ctx.font = "700 12px " + font;
    var w = Math.max(20, ctx.measureText(text).width + 12), h = 18, l = x - w / 2, tp = y - h / 2, r = 6;
    ctx.beginPath(); ctx.moveTo(l + r, tp); ctx.arcTo(l + w, tp, l + w, tp + h, r); ctx.arcTo(l + w, tp + h, l, tp + h, r); ctx.arcTo(l, tp + h, l, tp, r); ctx.arcTo(l, tp, l + w, tp, r); ctx.closePath();
    ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = css("--ink"); ctx.stroke();
    ctx.fillStyle = css("--ink"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, x, y + 0.5);
  }
  // arrowheads where the curve leaves the window between its two arms (the arms themselves get Plot's end arrows)
  function exitArrows(pl, f, color){
    var v = pl.v, N = 500, pts = [], i, first = -1, last = -1;
    for (i = 0; i <= N; i++) {
      var x = v.xmin + (v.xmax - v.xmin) * i / N, y = f(x), inn = isFinite(y) && y >= v.ymin && y <= v.ymax;
      pts.push([x, y, inn]); if (inn) { if (first < 0) first = i; last = i; }
    }
    for (i = first; i >= 0 && i < last; i++) {
      var p = pts[i], q = pts[i + 1]; if (p[2] === q[2]) continue;
      var ins = p[2] ? p : q, out = p[2] ? q : p, yb = out[1] > v.ymax ? v.ymax : v.ymin, tt = (yb - ins[1]) / (out[1] - ins[1]), xb = ins[0] + (out[0] - ins[0]) * tt;
      var from = pts[p[2] ? Math.max(first, i - 6) : Math.min(last, i + 7)];
      pl.head([from[0], from[1]], [xb, yb], color, 12);
    }
  }

  function build(o){
    o = Object.assign({ snap:0.5, min:-6, max:6, maxZeros:4, maxDeg:6, aMin:-3, aMax:3, aStep:0.25, uid:"zb", modes:true, zoom:true, targets:[] }, o);
    var st = { zs:[], a:1, mode:"build", lens:null, target:null, hideY:false }, nid = 0;
    var view = null, auto = true, frozen = null, hold = null, override = null, ghostHold = null, yDrop = null, hl = -1, subHTML = "";
    function byId(id){ return st.zs.filter(function(z){ return z.id === id; })[0]; }
    function load(s){
      s = s || {};
      st.zs = (s.zeros || [[-1, 1], [2, 2], [3, 1]]).map(function(p){ return { id:o.uid + "z" + (++nid), r:p[0], k:p[1] }; });
      st.a = s.a == null ? 1 : s.a; st.mode = s.mode || "build"; st.hideY = !!s.hideY;
      st.target = s.target && o.targets.some(function(t){ return t.id === s.target; }) ? s.target : null;
      var lz = s.lens == null ? null : st.zs.filter(function(z){ return z.r === s.lens; })[0];
      st.lens = lz ? lz.id : (st.mode === "lens" ? P.sorted(st.zs)[0].id : null);
    }
    load(o.state);
    function get(){
      var lz = byId(st.lens);
      return { zeros:P.sorted(st.zs).map(function(z){ return [z.r, z.k]; }), a:st.a, mode:st.mode, lens:lz ? lz.r : null, target:st.target, hideY:st.hideY };
    }

    // ---------- DOM ----------
    var cap = o.cap, canvas = o.canvas, g = o.graph;
    if (!canvas) {
      g.innerHTML = '<div class="eq-cap" aria-live="polite"></div><div class="plot-wrap"><canvas class="plot" role="img" aria-label="' + MV.esc(o.aria || "Graph") + '"></canvas></div>';
      cap = g.querySelector(".eq-cap"); canvas = g.querySelector("canvas");
    }
    cap.classList.add("zb-cap");
    var sub = document.createElement("p"); sub.className = "zb-sub"; sub.setAttribute("aria-live", "polite"); cap.parentNode.insertBefore(sub, cap.nextSibling);
    var wrap = canvas.parentNode, below = document.createElement("div"); below.className = "zb-below";
    below.innerHTML = '<p class="zb-lensnote tiny" aria-live="polite"></p><canvas class="plot square zb-lensc" role="img" aria-label="Lens" hidden></canvas><div class="zb-strip"></div>';
    wrap.parentNode.insertBefore(below, wrap.nextSibling);
    var lensNote = below.querySelector(".zb-lensnote"), lensC = below.querySelector(".zb-lensc"), strip = below.querySelector(".zb-strip");
    o.ctrl.innerHTML = (o.modes ? '<div class="zb-modes"></div>' : "") +
      '<div class="zb-zeros" role="group" aria-label="Zeros and their orders"></div>' +
      '<div class="q-actions zb-addrow"><button type="button" class="btn sm" data-zb="add" data-k="' + o.uid + 'add">+ Add a zero</button><span class="tiny muted zb-capnote" aria-live="polite"></span></div>' +
      '<div class="zb-sl"></div>' +
      (o.zoom ? '<div class="q-actions zb-win"><span class="tiny">Window:</span><button type="button" class="btn ghost sm" data-zb="zin" data-k="' + o.uid + 'zin">Zoom in</button><button type="button" class="btn ghost sm" data-zb="zout" data-k="' + o.uid + 'zout">Zoom out</button><button type="button" class="btn ghost sm" data-zb="fit" data-k="' + o.uid + 'fit">Fit</button><span class="tiny muted zb-winst" aria-live="polite"></span></div>' : "") +
      (o.targets.length ? '<div class="chips zb-tg" role="group" aria-label="Target graphs"></div>' : "") +
      '<p class="tiny muted zb-help">Drag a zero along the axis, or tab to it and use the arrow keys. Keys 1, 2 and 3 set its order.</p>';
    var zerosHost = o.ctrl.querySelector(".zb-zeros"), addBtn = o.ctrl.querySelector('[data-zb="add"]'), capNote = o.ctrl.querySelector(".zb-capnote"),
      winSt = o.ctrl.querySelector(".zb-winst"), tgHost = o.ctrl.querySelector(".zb-tg");
    var seg = o.modes ? MV.seg(o.ctrl.querySelector(".zb-modes"), { label:"Mode:", value:st.mode, options:[{ id:"build", t:"Build" }, { id:"lens", t:"Lens" }, { id:"sign", t:"Sign strip" }], onChange:function(m){ setMode(m, true); } }) : null;
    var sl = MV.sliders(o.ctrl.querySelector(".zb-sl"), [{ id:o.uid + "a", param:"a", label:'<i class="m va">a</i>, the leading coefficient', min:o.aMin, max:o.aMax, step:o.aStep, value:st.a, skip:[0], fmt:function(v){ return num(v, 2); } }],
      function(id, v){ st.a = v; change(true, "a"); });
    var plot = new MV.Plot(canvas, { xmin:-5, xmax:5, ymin:-5, ymax:5 }), lensPlot = new MV.Plot(lensC, { xmin:-1, xmax:1, ymin:-1, ymax:1 });

    // ---------- view ----------
    function targetSpec(){ var t = o.targets.filter(function(x){ return x.id === st.target; })[0]; return t ? { zs:P.toZ(t.z), a:t.a, pt:t.pt } : null; }
    function fitFor(zs, a){
      var T = targetSpec(), opt = {};
      if (T) { opt.extraX = T.zs.map(function(z){ return z.r; }).concat(T.pt ? [T.pt[0]] : []); opt.extraLobes = P.lobes(T.zs, T.a); opt.must = T.pt ? [T.pt[1]] : []; }
      return P.fit(zs, a, opt);
    }
    function curView(){
      if (override && override.view) return override.view;
      if (hold) return hold;
      var v = auto || !view ? fitFor(st.zs, st.a) : view;
      if (frozen) v = Object.assign({}, v, { xmin:frozen.xmin, xmax:frozen.xmax });
      return v;
    }
    function lensZero(){ return st.mode === "lens" ? byId(st.lens) : null; }

    // ---------- drawing ----------
    function draw(){
      var v = curView(), f = override && override.f ? override.f : P.f(st.zs, st.a), ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen");
      var curves = [], points = [], bands = [], T = targetSpec(), lz = lensZero(), narrow = plot.W > 0 && plot.W < 480;
      if (st.mode === "sign") P.cells(st.zs, st.a).forEach(function(c){ if (c.s > 0) bands.push({ x0:c.a, x1:c.b }); });
      if (T) curves.push({ f:P.f(T.zs, T.a), color:ink2, width:2.2, dash:[6, 6], alpha:0.9 });
      var gh = (override && override.ghost) || ghostHold;
      if (gh) curves.push({ f:gh, color:ink2, width:2, dash:[6, 6], alpha:0.6 });
      curves.push({ f:f, color:pen, width:3.2, arrows:true });
      st.zs.forEach(function(z){ points.push({ x:z.r, y:0, r:7, color:ink, ring:true }); });
      var yi = f(0), isZero = st.zs.some(function(z){ return z.r === 0; }), showY = !st.hideY && !isZero && yDrop == null;
      if (showY && yi >= v.ymin && yi <= v.ymax) points.push({ x:0, y:yi, r:5, color:ink, label:"(0, " + num(yi, 3) + ")" });
      if (yDrop != null) points.push({ x:0, y:yDrop, r:5, color:ink });
      if (T && T.pt) points.push({ x:T.pt[0], y:T.pt[1], r:5.5, color:ink2, label:"(" + num(T.pt[0]) + ", " + num(T.pt[1]) + ")" });
      plot.draw({ view:v, bands:bands, curves:curves, points:points,
        describe:(st.hideY ? P.describe(st.zs, st.a).replace(/ y-intercept [^.]*\.$/, "") : P.describe(st.zs, st.a)) + (T ? " A dashed target graph is also shown." : ""),
        after:function(ctx, pl){
          var oy = pl.Y(0), cy = oy + 30 > pl.H - 4 ? oy - 30 : oy + 30;
          st.zs.forEach(function(z){ chip(ctx, pl.X(z.r), cy, String(z.k), pl.fontUI); });
          exitArrows(pl, f, pen);
          if (showY && (yi < v.ymin || yi > v.ymax)) {
            var up = yi > v.ymax, yb = up ? v.ymax : v.ymin, dy = (v.ymax - v.ymin) * 0.08;
            pl.segment({ x1:0, y1:yb + (up ? -dy : dy), x2:0, y2:yb, color:ink, width:2, arrow:true });
            pl.label({ x:0, y:yb, text:"(0, " + num(yi, 3) + ")", dx:8, dy:up ? 14 : -14, bg:true });
          }
          if (lz && !narrow) {
            var R = Math.max(56, Math.min(92, Math.min(pl.W, pl.H) * 0.21)), zx = pl.X(lz.r), zy = oy;
            var lx = zx < pl.W / 2 ? pl.W - R - 12 : R + 12, ly = R + 12, ang = Math.atan2(zy - ly, zx - lx);
            ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.3; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(zx, zy); ctx.lineTo(lx + R * Math.cos(ang), ly + R * Math.sin(ang)); ctx.stroke(); ctx.setLineDash([]);
            ctx.beginPath(); ctx.arc(zx, zy, 14, 0, 2 * Math.PI); ctx.lineWidth = 2; ctx.strokeStyle = ink2; ctx.stroke(); ctx.restore();
            drawLens(ctx, { cx:lx, cy:ly, R:R, f:f, r:lz.r, k:lz.k, C:override ? null : P.coef(st.zs, st.a, lz) });
          }
        } });
      var showLensC = !!lz && narrow;
      if (lensC.hidden === showLensC) lensC.hidden = !showLensC;
      if (showLensC) lensPlot.render();
    }
    plot.render = draw;
    lensPlot.render = function(){
      var lz = lensZero(); if (!lz || lensC.hidden) return;
      var f = override && override.f ? override.f : P.f(st.zs, st.a);
      lensPlot.draw({ grid:false, axes:false, ticks:false, describe:"Lens on x = " + num(lz.r) + ": the graph near this zero, with its own vertical scale.",
        after:function(ctx, pl){ drawLens(ctx, { cx:pl.W / 2, cy:pl.H / 2, R:Math.min(pl.W, pl.H) / 2 - 4, f:f, r:lz.r, k:lz.k, C:override ? null : P.coef(st.zs, st.a, lz) }); } });
    };

    // ---------- text panels ----------
    function paintCap(){
      var c = P.aM(st.a), zs = P.sorted(st.zs);
      cap.innerHTML = MV.m("y = ") + (c ? MV.m("@a{" + c + "}") : "") + zs.map(function(z, i){ return '<span class="zb-f' + (i === hl ? " zb-hl" : "") + '">' + MV.m(P.factorM(z.r, z.k)) + "</span>"; }).join("");
      sub.innerHTML = subHTML;
    }
    function ivHTML(pieces){ return pieces.length ? MV.m(MV.iv.text(pieces)) : '<span class="muted">nowhere</span>'; }
    function paintRead(){
      if (!o.read) return;
      var zs = P.sorted(st.zs), a = st.a, deg = P.deg(zs), e = P.end(a, deg), sg = P.signs(zs, a), yi = P.f(zs, a)(0), c = P.aM(a);
      var br = zs.map(function(z){ return "(" + nm(Math.pow(-z.r, z.k)) + ")"; }).join("");
      o.read.innerHTML = MV.readoutHTML([
        ["Equation", MV.m(P.eqM(zs, a, true))],
        ["Zeros", zs.map(function(z){ return '<span class="nw">' + num(z.r) + "</span> (order " + z.k + ": " + P.behave(z.k) + ")"; }).join(", ")],
        ["Degree", zs.length > 1 ? zs.map(function(z){ return z.k; }).join(" + ") + " = " + deg : String(deg)],
        ["Leading coefficient", MV.m(P.fracM(a)) + '<br><span class="tiny muted">Equal to ' + MV.m("@a{a}") + " here, because every factor is " + MV.m("(x - r)") + ".</span>"],
        ["End behaviour", '<span class="qpath">' + e.q + "</span>: " + e.html],
        ["<i>y</i>-intercept", st.hideY ? '<span class="muted">? (hidden for now)</span>' : MV.m("y = " + (c ? "@a{" + c + "}" : "") + br + " = " + nm(yi))],
        ["Positive on", ivHTML(sg.pos)],
        ["Negative on", ivHTML(sg.neg)]
      ]);
    }
    function paintStrip(){
      if (st.mode !== "sign") { strip.innerHTML = ""; return; }
      var zs = P.sorted(st.zs), cells = P.cells(zs, st.a), sgn = function(v){ return v > 0 ? "+" : "−"; };
      var rows = [['<th scope="row">' + MV.m("@a{a}") + "</th>" + cells.map(function(){ return "<td>" + sgn(st.a) + "</td>"; }).join("")]];
      zs.forEach(function(z){ rows.push('<th scope="row">' + MV.m(P.factorM(z.r, z.k)) + "</th>" + cells.map(function(c){ return "<td>" + sgn(Math.pow(c.mid - z.r, z.k)) + "</td>"; }).join("")); });
      rows.push('<th scope="row">Product ' + MV.m("y") + "</th>" + cells.map(function(c){ return '<td class="' + (c.s > 0 ? "zb-pos" : "zb-neg") + '">' + sgn(c.s) + "</td>"; }).join(""));
      strip.innerHTML = '<div class="tbl-wrap"><table class="vt zb-tbl"><caption class="vh">Sign strip: the sign of each factor on each interval, and of the product</caption><thead><tr><th scope="col">Factor</th>' +
        cells.map(function(c){ return '<th scope="col">' + MV.m(MV.iv.text([{ a:c.a, b:c.b }])) + "</th>"; }).join("") + "</tr></thead><tbody>" + rows.map(function(r, i){ return '<tr' + (i === rows.length - 1 ? ' class="zb-prod"' : "") + ">" + r + "</tr>"; }).join("") + "</tbody></table></div>" +
        '<p class="tiny muted" style="margin:6px 0 0">Shaded: the intervals where ' + MV.m("y > 0") + ". An even power is never negative, so only odd-order zeros change the sign.</p>";
    }
    function paintLensNote(){
      var lz = lensZero();
      if (!lz) { lensNote.innerHTML = st.mode === "lens" ? "Tap a zero to look at it through the lens." : ""; return; }
      var C = P.coef(st.zs, st.a, lz), cm = Math.abs(C - 1) < 1e-9 ? "" : Math.abs(C + 1) < 1e-9 ? "-" : nm(+C.toPrecision(4)), fz = P.factorM(lz.r, lz.k);
      var xr = lz.r === 0 ? "x" : "x " + (lz.r < 0 ? "+ " : "- ") + nm(Math.abs(lz.r));
      lensNote.innerHTML = "<strong>Lens on " + MV.m("x = " + nm(lz.r)) + "</strong> (order " + lz.k + ": " + P.behave(lz.k) + "). It shows " + MV.m("-1 ≤ " + xr + " ≤ 1") +
        " with its own vertical scale." + (override ? "" : " Dashed: " + MV.m(cm + fz) + ", the shape of the graph near this zero.");
    }
    function paintZeros(){
      var zs = P.sorted(st.zs), deg = P.deg(zs), capped = false;
      var h = zs.map(function(z){
        var sel = st.mode === "lens" && st.lens === z.id;
        var head = st.mode === "lens" ? '<button type="button" class="zb-zl" data-zsel="' + z.id + '" data-k="' + z.id + 'sel" aria-pressed="' + sel + '">Lens on ' + MV.m("x = " + nm(z.r)) + "</button>" : '<span class="zb-zl">Zero at ' + MV.m("x = " + nm(z.r)) + "</span>";
        var chips = [1, 2, 3].map(function(k){
          var dis = k !== z.k && deg - z.k + k > o.maxDeg; if (dis) capped = true;
          return '<button type="button" class="chip' + (k === z.k ? " on" : "") + '" data-zk="' + k + '" data-zid="' + z.id + '" data-k="' + z.id + "k" + k + '" aria-pressed="' + (k === z.k) + '"' + (dis ? " disabled" : "") + ">" + k + "</button>";
        }).join("");
        return '<div class="zb-g' + (sel ? " sel" : "") + '">' + head + '<span class="zb-ord" role="group" aria-label="Order of the zero at ' + num(z.r) + '"><span class="tiny">Order</span>' + chips + "</span>" +
          '<button type="button" class="btn ghost sm" data-zrm="' + z.id + '" data-k="' + z.id + 'rm"' + (zs.length < 2 ? " disabled" : "") + ">Remove</button></div>";
      }).join("");
      MV.keepFocus(zerosHost, function(){ zerosHost.innerHTML = h; });
      var full = zs.length >= o.maxZeros, degFull = deg + 1 > o.maxDeg;
      addBtn.disabled = full || degFull;
      capNote.textContent = capped || (degFull && !full) ? "Degree " + o.maxDeg + " is the most here." : full ? "Up to " + o.maxZeros + " zeros." : "";
      if (winSt) winSt.textContent = auto && !hold ? "fitted automatically" : "press Fit to see the whole graph";
      if (tgHost) MV.keepFocus(tgHost, function(){ tgHost.innerHTML = o.targets.map(function(t){ return '<button type="button" class="chip' + (st.target === t.id ? " on" : "") + '" data-ztg="' + t.id + '" data-k="' + o.uid + "tg" + t.id + '" aria-pressed="' + (st.target === t.id) + '">' + t.label + "</button>"; }).join(""); });
    }
    function paintAll(){ paintCap(); paintZeros(); paintRead(); paintStrip(); paintLensNote(); draw(); }
    function notify(how){ if (o.onChange) o.onChange(get(), how); }
    // a user change: refit (unless dragging), clear one-off displays, repaint
    function change(refit, how){
      if (refit) { hold = null; ghostHold = null; }
      subHTML = ""; hl = -1;
      paintAll(); notify(how);
    }

    // ---------- actions ----------
    function occupied(x, id){ return st.zs.some(function(z){ return z.id !== id && Math.abs(z.r - x) < 1e-9; }); }
    function moveZero(id, x, how){
      var z = byId(id); if (!z) return;
      x = clean(Math.max(o.min, Math.min(o.max, x)));
      if (how === "drag") {
        var v = frozen || plot.v; if (!frozen) frozen = { xmin:v.xmin, xmax:v.xmax };
        var lo = Math.ceil((frozen.xmin + 0.15) / o.snap) * o.snap, hi = Math.floor((frozen.xmax - 0.15) / o.snap) * o.snap;
        x = clean(Math.max(lo, Math.min(hi, x)));
      }
      if (x === z.r) return;
      if (occupied(x, id)) {
        if (how !== "key") return;
        var dir = x > z.r ? 1 : -1;
        while (occupied(x, id) && x >= o.min && x <= o.max) x = clean(x + dir * o.snap);
        if (x < o.min || x > o.max) return;
      }
      z.r = x;
      change(true, how);
    }
    function setOrder(id, k){
      var z = byId(id); if (!z || z.k === k) return;
      if (P.deg(st.zs) - z.k + k > o.maxDeg) return;
      z.k = k; change(true, "order");
    }
    function addZero(){
      if (st.zs.length >= o.maxZeros || P.deg(st.zs) + 1 > o.maxDeg) return;
      var v = curView(), c = Math.round((v.xmin + v.xmax) / 2), x = null;
      for (var d = 0; d <= 24 && x === null; d++) [c + d, c - d].forEach(function(t){ if (x === null && t >= o.min && t <= o.max && !occupied(t)) x = clean(t); });
      for (var t = o.min; x === null && t <= o.max; t += o.snap) if (!occupied(clean(t))) x = clean(t);
      if (x === null) return;
      var z = { id:o.uid + "z" + (++nid), r:x, k:1 }; st.zs.push(z);
      if (st.mode === "lens") st.lens = z.id;
      change(true, "add");
    }
    function removeZero(id){
      if (st.zs.length < 2) return;
      st.zs = st.zs.filter(function(z){ return z.id !== id; });
      if (st.lens === id) st.lens = st.mode === "lens" ? P.sorted(st.zs)[0].id : null;
      change(true, "remove");
      addBtn.focus();
    }
    function setMode(m, user){
      st.mode = m;
      if (m === "lens" && !byId(st.lens)) st.lens = P.sorted(st.zs)[0].id;
      if (seg && seg.get() !== m) seg.set(m);
      paintAll(); if (user) notify("mode");
    }
    var drag = MV.drag(plot, {
      axis:"x", step:{ x:o.snap }, big:2,
      handles:function(){
        return st.zs.map(function(z){ return { id:z.id, x:z.r, y:0, label:"Zero at " + num(z.r) + ", order " + z.k + " (" + P.behave(z.k) + "). Arrow keys move it by " + num(o.snap) + "; 1, 2 or 3 sets its order" + (st.zs.length > 1 ? "; Delete removes it." : ".") }; });
      },
      snap:function(x){ return [clean(Math.round(x / o.snap) * o.snap), 0]; },
      move:function(id, x, y, how){ moveZero(id, x, how); },
      key:function(id, e){
        if (/^[123]$/.test(e.key)) { setOrder(id, +e.key); return true; }
        if (e.key === "Delete" || e.key === "Backspace") { removeZero(id); return true; }
        return false;
      },
      end:function(){ if (frozen) { frozen = null; change(true, "drag"); } }
    });
    void drag;
    wrap.addEventListener("focusin", function(e){
      var b = e.target.closest && e.target.closest(".drag-h");
      if (b && st.mode === "lens" && st.lens !== b.dataset.h && byId(b.dataset.h)) { st.lens = b.dataset.h; paintZeros(); paintLensNote(); draw(); notify("lens"); }
    });
    o.ctrl.addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      if (b.dataset.zk) setOrder(b.dataset.zid, +b.dataset.zk);
      else if (b.dataset.zrm) removeZero(b.dataset.zrm);
      else if (b.dataset.zsel) { st.lens = b.dataset.zsel; paintZeros(); paintLensNote(); draw(); notify("lens"); }
      else if (b.dataset.ztg) { st.target = st.target === b.dataset.ztg ? null : b.dataset.ztg; hold = null; change(false, "target"); }
      else if (b.dataset.zb === "add") addZero();
      else if (b.dataset.zb === "zin" || b.dataset.zb === "zout") {
        var v = curView(), s = b.dataset.zb === "zin" ? 0.6 : 1.6, cx = (v.xmin + v.xmax) / 2, hx = (v.xmax - v.xmin) / 2 * s, hy = (v.ymax - v.ymin) / 2 * s, cyv = (v.ymin + v.ymax) / 2;
        view = { xmin:cx - hx, xmax:cx + hx, ymin:cyv - hy, ymax:cyv + hy }; auto = false; hold = null; paintZeros(); draw(); notify("zoom");
      }
      else if (b.dataset.zb === "fit") { auto = true; hold = null; view = null; paintZeros(); draw(); notify("zoom"); }
    });

    // ---------- programmatic changes (predictions) ----------
    function set(s){
      load(Object.assign({}, get(), s));
      if (s.zeros) st.zs = s.zeros.map(function(p){ return { id:o.uid + "z" + (++nid), r:p[0], k:p[1] }; });
      if (s.lens != null) { var lz = st.zs.filter(function(z){ return z.r === s.lens; })[0]; st.lens = lz ? lz.id : null; }
      if (st.mode === "lens" && !byId(st.lens)) st.lens = P.sorted(st.zs)[0].id;
      if (seg) seg.set(st.mode);
      sl.set(o.uid + "a", st.a);
      auto = true; view = null; frozen = null; hold = null; override = null; ghostHold = null; yDrop = null; hl = -1; subHTML = "";
      paintAll(); notify("set");
    }
    function morph(to, opt){
      opt = opt || {};
      var zs0 = st.zs.map(function(z){ return { id:z.id, r:z.r, k:z.k }; }), a0 = st.a, f0 = P.f(zs0, a0);
      st.zs = to.z.map(function(p){ var old = zs0.filter(function(z){ return z.r === p[0]; })[0]; return { id:old ? old.id : o.uid + "z" + (++nid), r:p[0], k:p[1] }; });
      if (to.a != null) { st.a = to.a; sl.set(o.uid + "a", st.a); }
      if (st.lens && !byId(st.lens)) st.lens = P.sorted(st.zs)[0].id;
      var f1 = P.f(st.zs, st.a), v = P.union(fitFor(zs0, a0), fitFor(st.zs, st.a));
      override = { f:f0, view:v }; subHTML = ""; hl = -1;
      paintCap(); paintZeros(); paintLensNote(); draw();
      MV.tween({ dur:opt.dur || 1500, step:function(t){ override.f = function(x){ return (1 - t) * f0(x) + t * f1(x); }; draw(); },
        done:function(){ override = null; hold = v; paintAll(); notify("morph"); if (opt.done) opt.done(); } });
    }
    function tweenA(to, opt){
      opt = opt || {};
      var a0 = st.a, g1 = P.f(st.zs, 1), v = P.union(fitFor(st.zs, a0), fitFor(st.zs, to));
      override = { f:P.f(st.zs, a0), view:v, ghost:opt.ghost ? P.f(st.zs, a0) : null }; subHTML = ""; hl = -1;
      MV.tween({ dur:opt.dur || 1600, step:function(t){
          var at = a0 + (to - a0) * t; override.f = function(x){ return at * g1(x); };
          var shown = Math.round(at / o.aStep) * o.aStep; if (shown === 0) shown = to < 0 ? -o.aStep : o.aStep; sl.set(o.uid + "a", shown); draw(); },
        done:function(){ st.a = to; sl.set(o.uid + "a", to); ghostHold = opt.ghost ? override.ghost : null; override = null; hold = v; paintAll(); notify("tween"); if (opt.done) opt.done(); } });
    }
    // P3-style reveal: light each bracket at x = 0 in turn, then the product, then drop the y-intercept point onto the y-axis
    function explainYInt(opt){
      opt = opt || {};
      var zs = P.sorted(st.zs), a = st.a, f = P.f(zs, a), yi = f(0), c = P.aM(a), lines = [], i = 0;
      st.hideY = true; paintRead();
      function line(z){
        var inner = z.r === 0 ? "0" : "(0 " + (z.r < 0 ? "+ " : "- ") + nm(Math.abs(z.r)) + ")", val = -z.r;
        return z.k > 1 ? inner + "^" + z.k + " = (" + nm(val) + ")^" + z.k + " = " + nm(Math.pow(val, z.k)) : inner + " = " + nm(val);
      }
      function step(){
        if (i < zs.length) {
          hl = i; lines.push(MV.m(line(zs[i]))); subHTML = lines.join('<span class="zb-sep">;</span> '); paintCap(); i++;
          MV.wait(850, step); return;
        }
        hl = -1;
        subHTML = lines.join('<span class="zb-sep">;</span> ') + "<br>" + MV.m("y = " + (c ? "@a{" + c + "}" : "") + zs.map(function(z){ return "(" + nm(Math.pow(-z.r, z.k)) + ")"; }).join("") + " = " + nm(yi));
        paintCap();
        var v = curView();
        MV.wait(700, function(){
          MV.tween({ dur:700, step:function(t){ yDrop = v.ymax + (yi - v.ymax) * t; draw(); },
            done:function(){ yDrop = null; st.hideY = false; paintRead(); draw(); notify("explain"); if (opt.done) opt.done(); } });
        });
      }
      step();
    }

    paintAll();
    return { get:get, set:set, morph:morph, tweenA:tweenA, explainYInt:explainYInt, plot:plot, setMode:setMode, redraw:draw };
  }
  build.poly = P;
  build.drawLens = drawLens;
  return build;
})();
var P = zeroBuilder.poly;

// ---------- hero: zeros drop onto the axis, lenses open above them, captions fade in (storyboard in the plan) ----------
function wrapText(ctx, text, maxW){
  var words = text.split(" "), lines = [], cur = "";
  words.forEach(function(w){ var t = cur ? cur + " " + w : w; if (cur && ctx.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur);
  return lines;
}
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:-4.4, xmax:4.4, ymin:-1, ymax:1 });
  var Z = [{ r:-2, k:1, s:-1 }, { r:1, k:2, s:-1 }, { r:3, k:3, s:1 }], caps = (MV.C.hero.lensCaps || []).map(MV.plain), T = MV.reduceMotion ? 1 : 0;
  function seg(t, a, d){ return Math.max(0, Math.min(1, (t - a) / d)); }
  function scene(ctx, pl){
    var W = pl.W, H = pl.H, ink = css("--ink"), ink2 = css("--ink-2"), small = W < 420;
    var gap = pl.X(3) - pl.X(1), R = Math.max(16, Math.min(H * 0.24, gap / 2 - 6)), lineH = small ? 14 : 16, capW = Math.max(60, Math.min(gap - 8, 150));
    ctx.font = "600 " + (small ? 12 : 13) + "px " + pl.fontUI;
    var wrapped = caps.map(function(c){ return wrapText(ctx, c, capW); }), nL = Math.max.apply(null, wrapped.map(function(w){ return w.length; }));
    var total = 2 * R + 18 + 46 + nL * lineH, top = Math.max(4, (H - total) / 2), cy = top + R, ay = cy + R + 18;
    // 1. the x-axis draws
    var a1 = seg(T, 0, 0.14), x0 = 6, x1 = W - 6, xe = x0 + (x1 - x0) * a1;
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x0, ay); ctx.lineTo(xe, ay); ctx.stroke();
    ctx.font = "12px " + pl.fontUI; ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (var i = -4; i <= 4; i++) { var tx = pl.X(i); if (tx > xe) continue; ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx, ay - 4); ctx.lineTo(tx, ay + 4); ctx.stroke(); ctx.fillText(num(i), tx, ay + 6); }
    if (a1 >= 1) [[x1, 1], [x0, -1]].forEach(function(e){ ctx.fillStyle = css("--plot-axis"); ctx.beginPath(); ctx.moveTo(e[0] + e[1] * 2, ay); ctx.lineTo(e[0] - e[1] * 8, ay - 5); ctx.lineTo(e[0] - e[1] * 8, ay + 5); ctx.closePath(); ctx.fill(); });
    Z.forEach(function(z, n){
      var X = pl.X(z.r), d = seg(T, 0.16 + 0.07 * n, 0.1); if (d <= 0) return;
      var e = 1 - Math.pow(1 - d, 3), zy = -10 + (ay + 10) * e;
      // 3. the lens opens and draws the local shape
      var lo = seg(T, 0.42 + 0.09 * n, 0.12), ld = seg(T, 0.47 + 0.09 * n, 0.15);
      if (lo > 0) {
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.2; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(X, cy + R * lo); ctx.lineTo(X, ay - 8); ctx.stroke(); ctx.restore();
        zeroBuilder.drawLens(ctx, { cx:X, cy:cy, R:R, open:1 - Math.pow(1 - lo, 2), f:function(x){ return z.s * Math.pow(x - z.r, z.k); }, r:z.r, k:z.k, draw:ld });
      }
      // 2. the zero drops onto the axis with its order chip
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(X, zy, 6, 0, 2 * Math.PI); ctx.fill();
      var ca = seg(T, 0.24 + 0.07 * n, 0.05);
      if (ca > 0) {
        ctx.save(); ctx.globalAlpha = ca; ctx.font = "700 12px " + pl.fontUI;
        var w = 22, h = 18, l = X - w / 2, tp = ay + 30 - h / 2;
        ctx.fillStyle = css("--sheet"); ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.rect(l, tp, w, h); ctx.fill(); ctx.stroke();
        ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(z.k), X, ay + 30.5); ctx.restore();
      }
      // 4. the caption fades in
      var cl = seg(T, 0.74 + 0.06 * n, 0.1);
      if (cl > 0) {
        ctx.save(); ctx.globalAlpha = cl; ctx.font = "600 " + (small ? 12 : 13) + "px " + pl.fontUI; ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "top";
        var cx = Math.max(capW / 2 + 2, Math.min(W - capW / 2 - 2, X));
        wrapped[n].forEach(function(t, j){ ctx.fillText(t, cx, ay + 46 + j * lineH); });
        ctx.restore();
      }
    });
  }
  p.render = function(){ p.draw({ grid:false, axes:false, ticks:false, after:function(ctx, pl){ scene(ctx, pl); } }); };
  p.render();
  if (!MV.reduceMotion) MV.tween({ dur:5600, ease:function(t){ return t; }, step:function(t){ T = t; p.render(); } });
}

// ---------- Explore: the zero builder, predictions and target challenges ----------
var zbX = null;
var TC2 = { id:"tc2", label:"Show the TC2 target", z:[[-4, 1], [0, 3], [3, 2]], a:-0.5, pt:[1, -10] };
function chalTest(id, s){
  var c = MV.C.explore.challenges.filter(function(x){ return x.id === id; })[0], N = c.named || {};
  var zp = s.zeros, rs = zp.map(function(p){ return p[0]; }), K = {}, a = s.a, zs = P.toZ(zp), deg = P.deg(zs);
  zp.forEach(function(p){ K[p[0]] = p[1]; });
  var exactly = function(want){ return want.length === rs.length && want.every(function(r, i){ return rs[i] === r; }); };
  var has = function(want){ return want.every(function(r){ return rs.indexOf(r) >= 0; }); };
  var ok = { ok:true }, no = function(msg){ return { ok:false, msg:msg }; };
  if (id === "tc1") {
    if (exactly([-3, 2])) {
      if (K[-3] === 1 && K[2] === 2) return a > 0 ? ok : no(N.aneg);
      if (K[-3] === 2 && K[2] === 1) return no(N.swapped);
      if (K[-3] === 3) return no(N.order3);
      return no();
    }
    if (exactly([-2, 3])) return no(N.signs);
    return no();
  }
  if (id === "tc2") {
    if (exactly([-4, 0, 3])) {
      if (K[-4] === 1 && K[0] === 3 && K[3] === 2) return Math.abs(a + 0.5) < 1e-9 ? ok : no(N.wrongA.replace("{v}", num(20 * a)));
      if (K[0] !== 3) return no(N.at0);
      if (K[3] !== 2) return no(N.at3);
    }
    return no();
  }
  if (id === "tc3") {
    if (exactly([-2, 1, 4]) && K[-2] === 1 && K[1] === 2 && K[4] === 1) {
      if (Math.abs(a + 2) < 1e-9) return ok;
      if (a > 0) return no(N.apos);
      return no(N.wrongA.replace("{v}", num(-8 * a)));
    }
    if (has([1]) && K[1] % 2 === 1) return no(N.cross1);
    if (a > 0 && deg % 2 === 0) return no(N.apos);
    var f = P.f(zs, a), right = true;
    for (var x = -7.875; x < 8; x += 0.25) { var want = x > -2 && x < 4 ? 1 : -1; if (Math.sign(f(x)) !== want) { right = false; break; } }
    if (right && has([-2, 1, 4])) return no(N.degree);
    return no();
  }
  return no();
}
function explore(host, api){
  var L = MV.pgLayout(host, { aria:"Graph of the polynomial built from your zeros" }), S = api.S;
  zbX = zeroBuilder({ graph:L.graph, cap:L.cap, canvas:L.canvas, ctrl:L.ctrl, read:L.read, uid:"zbx",
    state:S.zb || { zeros:[[-1, 1], [2, 2], [3, 1]], a:1 }, targets:[TC2],
    onChange:function(st, how){ S.zb = st; api.save(); MV.changed(); if (["set", "morph", "tween", "explain"].indexOf(how) < 0) MV.banner("", ""); } });
  return {
    predict:{
      start:function(p){ zbX.set({ zeros:p.start.z, a:p.start.a, mode:p.start.mode || "build", lens:p.start.lens == null ? null : p.start.lens, hideY:!!p.start.hideY, target:null }); },
      run:function(p, done){
        if (p.id === "p1" || p.id === "p2") zbX.morph(p.end, { dur:1800, done:done });
        else if (p.id === "p3") zbX.explainYInt({ done:done });
        else if (p.id === "p4") zbX.tweenA(p.end.a, { ghost:true, dur:1900, done:done });
        else done();
      }
    },
    challenge:function(id){ return chalTest(id, zbX.get()); }
  };
}

// ---------- Part 3: equation from a graph ----------
function part3(host, api){
  var C = MV.C.part3, RS = C.rounds, S = api.S, FB = C.fb;
  S.r = S.r || 0; S.st = S.st || {};
  host.innerHTML = '<div class="sym eq3"><div>' +
    '<div class="chips" id="eq-rounds" role="group" aria-label="Choose a round"></div>' +
    '<div class="plot-wrap"><canvas class="plot" id="eq-plot" role="img"></canvas></div>' +
    '<div class="eq-keys" id="eq-keys" role="group" aria-label="Points on the x-axis: choose one to tap the axis there"></div>' +
    '<p class="tiny muted eq-fan" id="eq-fan" aria-live="polite"></p></div>' +
    '<div><p class="eq-cap eq-eq" id="eq-eq" aria-live="polite"></p><div id="eq-steps"></div><div id="eq-fb" aria-live="polite"></div>' +
    '<details class="alg" id="eq-alg"></details><div id="eq-note"></div></div></div>';
  var plot = new MV.Plot($("#eq-plot"), { xmin:-5, xmax:5, ymin:-5, ymax:5 }), msg = null, anim = null, views = {};
  function R(){ return RS[S.r]; }
  function ans(){ var A = MV.ans(R()); return { zs:P.toZ(A.z), a:A.a }; }
  function rst(){ var id = R().id; return S.st[id] || (S.st[id] = { found:[], ord:{}, ordTries:0, misses:0, pick:null, aRaw:"", aTries:0, wrongA:null, solved:false, first:null }); }
  function viewFor(){ var r = R(), A = ans(); return views[r.id] || (views[r.id] = P.fit(A.zs, A.a, { must:r.points.map(function(q){ return q[1]; }), extraX:r.points.map(function(q){ return q[0]; }) })); }
  function allFound(){ var x = rst(); return ans().zs.every(function(z){ return x.found.indexOf(z.r) >= 0; }); }
  function allOrd(){ var x = rst(); return allFound() && ans().zs.every(function(z){ return x.ord[z.r] === z.k; }); }
  function aLabel(v){ return MV.m(P.fracM(v)); }
  plot.render = function(){
    var A = ans(), x = rst(), v = viewFor(), f = P.f(A.zs, A.a), g = P.f(A.zs, 1), ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), curves = [], points = [];
    if (allOrd()) {
      var fade = x.solved ? (anim ? 1 - anim.t : 0) : 1;
      if (fade > 0) [-2, -1, -0.5, 0.5, 1, 2].forEach(function(c){ curves.push({ f:function(t){ return c * g(t); }, color:ink2, width:2, alpha:0.35 * fade }); });
    }
    curves.push({ f:f, color:pen, width:3, arrows:true });
    if (x.wrongA != null && !x.solved) curves.push({ f:function(t){ return x.wrongA * g(t); }, color:ink, width:2.4, dash:[8, 6] });
    if (anim) curves.push({ f:function(t){ return anim.a * g(t); }, color:pen, width:3.8, alpha:0.85 });
    R().points.forEach(function(q, i){ points.push({ x:q[0], y:q[1], r:i === x.pick ? 6.5 : 5, color:ink, ring:i === x.pick, label:"(" + num(q[0]) + ", " + num(q[1]) + ")" }); });
    x.found.forEach(function(r){ points.push({ x:r, y:0, r:6, color:ink, ring:true }); });
    var st2 = (x.found.length ? " Zeros found: " + x.found.map(function(r){ return num(r); }).join(", ") + "." : "") + (allOrd() && !x.solved ? " Faint fan of curves through the same zeros." : "") + (x.solved ? " Solved: " + MV.plain(MV.m(P.eqM(A.zs, A.a))) + "." : "");
    plot.draw({ view:v, curves:curves, points:points, describe:R().desc + st2 });
  };
  function subst(q){
    var A = ans();
    return MV.m(P.nm(q[1]) + " = @a{a}" + P.sorted(A.zs).map(function(z){ return "(" + P.nm(q[0]) + (z.r === 0 ? "" : (z.r < 0 ? " + " : " - ") + P.nm(Math.abs(z.r))) + ")" + (z.k > 1 ? "^" + z.k : ""); }).join(""));
  }
  function eqTemplate(){
    var A = ans(), x = rst();
    if (x.solved) return MV.m(P.eqM(A.zs, A.a, true));
    var fs = x.found.slice().sort(function(p, q){ return p - q; });
    return MV.m("y = @a{a}" + (fs.length ? fs.map(function(r){ var k = x.ord[r]; return P.factorM(r, 1) + (k ? (k > 1 ? "^" + k : "") : "^{?}"); }).join("") : "(…)"));
  }
  function stepBox(i, state, body){ return '<div class="eq-step ' + state + '"><h4>' + (state === "done" ? "✓ " : "") + C.steps[i] + "</h4>" + body + "</div>"; }
  function paint(){
    var r = R(), A = ans(), x = rst(), zsS = P.sorted(A.zs);
    MV.keepFocus($("#eq-rounds"), function(){
      $("#eq-rounds").innerHTML = RS.map(function(q, i){ var y = S.st[q.id]; return '<button type="button" class="fchip" data-round="' + i + '" data-k="eqr' + i + '" aria-pressed="' + (i === S.r) + '">' + (y && y.solved ? "✓ " : "") + q.name + " (" + q.kind + ")</button>"; }).join("");
    });
    $("#eq-eq").innerHTML = eqTemplate();
    var f1 = allFound(), f2 = allOrd(), h = "";
    h += stepBox(0, f1 ? "done" : "now", f1 ? "<p>Zeros: " + zsS.map(function(z){ return num(z.r); }).join(", ") + "</p>" :
      "<p>Tap the zeros on the graph’s <i>x</i>-axis. Each tapped zero gets a dot.</p><p class=\"tiny muted\">Found so far: " + (x.found.length ? x.found.slice().sort(function(p, q){ return p - q; }).map(function(v){ return num(v); }).join(", ") : "none yet") + ". Keyboard: tab to the list of <i>x</i>-values under the graph.</p>");
    if (f1) {
      h += stepBox(1, f2 ? "done" : "now", f2 ? "<p>Orders: " + zsS.map(function(z){ return num(z.r) + " (order " + z.k + ")"; }).join(", ") + "</p>" :
        "<p>Look at how the graph meets the axis: crossing, touching or flattening.</p><div class=\"eq-ords\">" + zsS.map(function(z){
          var done = x.ord[z.r] === z.k;
          return '<div class="eq-og"><span class="tiny"><strong>At ' + MV.m("x = " + P.nm(z.r)) + "</strong></span><span class=\"zb-ord\" role=\"group\" aria-label=\"Order at " + num(z.r) + '">' + [1, 2, 3].map(function(k){
            return '<button type="button" class="chip' + (done && k === z.k ? " on" : "") + '" data-ord="' + k + '" data-r="' + z.r + '" data-k="eqo' + z.r + k + '" aria-pressed="' + (done && k === z.k) + '"' + (done ? " disabled" : "") + ">" + k + "</button>"; }).join("") + "</span></div>";
        }).join("") + "</div>");
    }
    if (f2) {
      h += stepBox(2, "done", "<p>" + C.fan + "</p>");
      var picked = x.pick != null;
      h += stepBox(3, picked ? "done" : "now", (picked ? "" : "<p>Tap a labelled point on the graph that isn’t a zero, or choose it here.</p>") +
        '<div class="chips eq-pts" role="group" aria-label="Points on the graph">' + r.points.map(function(q, i){ return '<button type="button" class="chip' + (x.pick === i ? " on" : "") + '" data-pt="' + i + '" data-k="eqp' + i + '" aria-pressed="' + (x.pick === i) + '"' + (x.solved ? " disabled" : "") + ">(" + num(q[0]) + ", " + num(q[1]) + ")</button>"; }).join("") +
        zsS.map(function(z){ return '<button type="button" class="chip" data-pz="' + z.r + '" data-k="eqz' + z.r + '"' + (x.solved ? " disabled" : "") + ">(" + num(z.r) + ", 0)</button>"; }).join("") + "</div>" +
        (picked ? '<p class="eq-sub">' + subst(r.points[x.pick]) + "</p>" : ""));
      if (picked) {
        h += stepBox(4, x.solved ? "done" : "now", x.solved ? "<p>" + MV.m("@a{a} = " + P.fracM(A.a)) + "</p>" :
          '<p>Solve for ' + MV.m("@a{a}") + ' and enter it. Fractions like 1/2 are fine.</p><div class="numrow"><label for="eq-a">' + MV.m("@a{a} =") + '</label><input class="numin short" id="eq-a" type="text" autocomplete="off" data-k="eqa" value="' + MV.esc(x.aRaw) + '"><button type="button" class="btn primary sm" data-act="acheck" data-k="eqachk">Check</button></div>');
      }
    }
    MV.keepFocus($("#eq-steps"), function(){ $("#eq-steps").innerHTML = h; });
    var fb = $("#eq-fb");
    if (x.solved) fb.innerHTML = '<div class="fb good" role="status"><p><strong>✓ ' + MV.m("@a{a} = " + P.fracM(A.a)) + ".</strong> The matching curve lands on the graph: " + MV.m(P.eqM(A.zs, A.a, true)) + ".</p>" +
      (S.r < RS.length - 1 ? '<div class="q-actions"><button type="button" class="btn primary sm" data-act="next" data-k="eqnext">Next round</button></div>' : '<p class="tiny muted">All three rounds done. The quick check is below.</p>') + "</div>";
    else fb.innerHTML = msg ? '<div class="fb ' + (msg.good ? "good" : "bad") + '" role="status"><p>' + (msg.good ? "" : "<strong>✗ Not quite.</strong> ") + msg.html + "</p></div>" : "";
    var alg = $("#eq-alg"), open = alg.open, oth = r.points[x.pick === 0 ? 1 : 0];
    if (x.solved) {
      var vals = P.sorted(A.zs).map(function(z){ return Math.pow(oth[0] - z.r, z.k); }), prod = A.a * vals.reduce(function(s, v){ return s * v; }, 1), c = P.aM(A.a);
      alg.innerHTML = "<summary>Check it with algebra</summary><div class=\"alg-lines\"><div>" + MV.m(P.eqM(A.zs, A.a, true)) + "</div><div>At " + "(" + num(oth[0]) + ", " + num(oth[1]) + "): " +
        MV.m((c ? "@a{" + c + "}" : "") + P.sorted(A.zs).map(function(z){ return "(" + P.nm(oth[0]) + (z.r === 0 ? "" : (z.r < 0 ? " + " : " - ") + P.nm(Math.abs(z.r))) + ")" + (z.k > 1 ? "^" + z.k : ""); }).join("") +
        " = " + (c ? "@a{" + c + "}" : "") + vals.map(function(v){ return "(" + P.nm(v) + ")"; }).join("") + " = " + P.nm(prod)) + " " + (Math.abs(prod - oth[1]) < 1e-9 ? "✓" : "✗") + "</div></div><p style=\"margin:10px 0 0\">The second labelled point fits too, so the zeros, the orders and " + MV.m("@a{a}") + " all check out.</p>";
    } else alg.innerHTML = "<summary>Check it with algebra</summary><p style=\"margin:10px 0 0\">Find " + MV.m("@a{a}") + " first. Then this panel substitutes the second labelled point into your equation to check it.</p>";
    alg.open = open;
    $("#eq-note").innerHTML = x.solved && r.note ? '<div class="refresh"><p>' + r.note + "</p></div>" : "";
    $("#eq-fan").innerHTML = f2 && !x.solved ? C.fan : "";
    var keys = $("#eq-keys");
    if (!f1) {
      var v = viewFor(), xs = [];
      for (var t = Math.ceil(v.xmin * 2) / 2; t <= v.xmax; t += 0.5) xs.push(P.clean(t));
      MV.keepFocus(keys, function(){ keys.innerHTML = '<span class="tiny">Tap the axis at:</span>' + xs.map(function(t){ return '<button type="button" class="chip" data-tx="' + t + '" data-k="eqk' + t + '">' + num(t) + "</button>"; }).join(""); });
    } else keys.innerHTML = "";
    plot.render();
  }
  function tapAxis(xv, far){
    var x = rst(), A = ans();
    if (far) { msg = { html:FB.miss }; return; }
    var z = A.zs.filter(function(q){ return Math.abs(q.r - xv) <= 0.15; })[0];
    if (!z) { x.misses++; msg = { html:FB.miss }; return; }
    if (x.found.indexOf(z.r) >= 0) { msg = { good:true, html:"You’ve already found the zero at " + num(z.r) + "." }; return; }
    x.found.push(z.r); msg = { good:true, html:"✓ A zero at " + MV.m("x = " + P.nm(z.r)) + "." };
  }
  function setOrd(r, k){
    var x = rst(), z = ans().zs.filter(function(q){ return q.r === r; })[0]; if (!z) return;
    if (k === z.k) { x.ord[r] = k; msg = { good:true, html:"✓ Order " + k + " at " + num(r) + ": the graph " + P.behave(k) + " there." }; return; }
    x.ordTries++;
    msg = { html:(z.k % 2 === 1 && k === 2) ? FB.evenAtCross : (z.k === 3 && k === 1) ? FB.oneAtFlat : (z.k === 1 && k === 3) ? FB.threeAtCross : FB.oddAtTouch };
  }
  function pickPoint(i){ var x = rst(); x.pick = i; msg = null; }
  function checkA(){
    var x = rst(), A = ans(), v = MV.parseNum(x.aRaw);
    if (!v || v.length !== 1) { msg = { html:"Enter a number, such as −2 or 1/2." }; return; }
    v = v[0];
    if (Math.abs(v - A.a) < 1e-9) {
      x.solved = true; x.first = x.ordTries === 0 && x.aTries === 0; x.wrongA = null; msg = null;
      var a0 = A.a * 2.2;
      anim = { a:a0, t:0 };
      MV.tween({ dur:1100, step:function(t){ anim.a = a0 + (A.a - a0) * t; anim.t = t; plot.render(); }, done:function(){ anim = null; plot.render(); } });
      return;
    }
    x.aTries++; x.wrongA = v === 0 ? null : v;
    var inv = Math.abs(v - 1 / A.a) < 1e-9, sgn = Math.abs(v + A.a) < 1e-9, both = Math.abs(v + 1 / A.a) < 1e-9;
    msg = { html:sgn ? FB.aSign : inv ? FB.aInv : both ? FB.aSign + " " + FB.aInv : FB.aOther };
  }
  plot.c.addEventListener("click", function(e){
    var x = rst(); if (x.solved) return;
    var rc = plot.c.getBoundingClientRect(), px = e.clientX - rc.left, py = e.clientY - rc.top;
    if (!allFound()) { tapAxis(plot.xOf(px), Math.abs(py - plot.Y(0)) > 40); api.save(); paint(); MV.focusFb(host); return; }
    if (!allOrd()) return;
    var best = null, bd = 30;
    R().points.forEach(function(q, i){ var d = Math.hypot(plot.X(q[0]) - px, plot.Y(q[1]) - py); if (d < bd) { bd = d; best = { pt:i }; } });
    ans().zs.forEach(function(z){ var d = Math.hypot(plot.X(z.r) - px, plot.Y(0) - py); if (d < bd) { bd = d; best = { z:z.r }; } });
    if (!best) return;
    if (best.z != null) msg = { html:FB.zeroPick }; else pickPoint(best.pt);
    api.save(); paint(); MV.focusFb(host);
  });
  host.addEventListener("input", function(e){ if (e.target.id === "eq-a") { rst().aRaw = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.target.id === "eq-a" && e.key === "Enter") { e.preventDefault(); checkA(); api.save(); paint(); MV.focusFb(host); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var x = rst();
    if (b.dataset.round != null) { S.r = +b.dataset.round; msg = null; anim = null; }
    else if (b.dataset.tx != null) { if (!x.solved) tapAxis(+b.dataset.tx, false); }
    else if (b.dataset.ord) setOrd(+b.dataset.r, +b.dataset.ord);
    else if (b.dataset.pt != null) pickPoint(+b.dataset.pt);
    else if (b.dataset.pz != null) msg = { html:FB.zeroPick };
    else if (b.dataset.act === "acheck") checkA();
    else if (b.dataset.act === "next") { S.r = Math.min(RS.length - 1, S.r + 1); msg = null; anim = null; api.save(); paint(); var rb = $("#eq-rounds [data-round=\"" + S.r + "\"]"); if (rb) rb.focus(); return; }
    else return;
    api.save(); paint();
    if (b.dataset.round == null) MV.focusFb(host);
  });
  paint();
}

// ---------- Practice 2: find the equation (number entry and select-all) ----------
function findActivity(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { vals:{}, pick:{}, tries:0, hint:0, solved:false, first:null }); }
  function parse(raw){ var v = MV.parseNum(raw); return v && v.length === 1 ? v[0] : null; }
  function close(v, w){ return v != null && Math.abs(v - w) <= 1e-6 * Math.max(1, Math.abs(w)); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-fi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + (it.note ? '<p class="tiny muted" style="margin:6px 0 0">' + it.note + "</p>" : "") + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        if (it.kind === "select") {
          h += '<div class="opts" role="group" aria-label="Options (select every pair that works)">' + it.options.map(function(o, oi){
            var on = !!x.pick[oi], c = "opt sa-opt";
            if (x.solved && MV.ok(o)) c += " right"; else if (x.checked && on && !MV.ok(o)) c += " wrong";
            return '<button type="button" class="' + c + '" role="checkbox" aria-checked="' + on + '" data-oi="' + oi + '" data-k="' + it.id + "o" + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>";
          }).join("") + "</div>";
        } else {
          h += '<div class="ff-row">' + it.fields.map(function(fd){
            return '<label class="ff-f"><span>' + fd.label + '</span><input class="numin short" type="text" autocomplete="off" data-ff="' + it.id + "|" + fd.id + '" data-k="ff' + it.id + fd.id + '" value="' + MV.esc(x.vals[fd.id] || "") + '"' + (x.solved ? " disabled" : "") + "></label>";
          }).join("") + "</div>";
        }
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status">' + msgs[it.id] + "</div>";
        return h + "</div>";
      }).join("");
    });
  }
  var GEN = "Check your work and try again. The hints walk you through it.";
  function judge(it, x){
    var ans = MV.ans(it);
    if (it.kind === "select") {
      var wrong = [], missing = 0, any = false;
      it.options.forEach(function(o, oi){ var on = !!x.pick[oi], good = MV.ok(o); if (on) any = true; if (on && !good && wrong.indexOf(o.why) < 0) wrong.push(o.why); if (!on && good) missing++; });
      if (!any) return { skip:"Select at least one pair, then press Check." };
      if (!wrong.length && !missing) return { ok:true };
      return { msg:wrong.length ? wrong.map(function(w){ return "<p>" + w + "</p>"; }).join("") : "<p>" + it.partial + "</p>" };
    }
    if (typeof ans === "number") {
      var v = parse(x.vals.v);
      if (v == null) return { skip:"Enter a number, such as 12, −3 or 3/4." };
      if (close(v, ans)) return { ok:true };
      var named = (it.wrong || []).filter(function(w){ return close(v, w.match); })[0];
      return { msg:"<p>" + (named ? named.fb : GEN) + "</p>" };
    }
    var va = parse(x.vals.a), vy = parse(x.vals.y);
    if (va == null || vy == null) return { skip:"Enter a number in both boxes, such as −3 or 3/4." };
    var okA = close(va, ans.a), okY = close(vy, ans.y);
    if (okA && okY) return { ok:true };
    var nw = function(field, v){ return (it.wrong || []).filter(function(w){ return w.field === field && close(v, w.match); })[0]; };
    if (!okA) { var na = nw("a", va); return { msg:"<p>" + (na ? na.fb : GEN) + "</p>" }; }
    var ny = nw("y", vy);
    return { msg:"<p>Your " + MV.m("a") + " is right. " + (ny ? ny.fb : GEN) + "</p>" };
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.ff; if (!k) return; var p = k.split("|"); ist(p[0]).vals[p[1]] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ var k = e.target.dataset && e.target.dataset.ff; if (k && e.key === "Enter") { var b = host.querySelector('[data-k="' + k.split("|")[0] + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-fi]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.fi; })[0], x = ist(it.id);
    if (b.dataset.oi != null) { var oi = +b.dataset.oi; x.pick[oi] = !x.pick[oi]; x.checked = false; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.skip) { msgs[it.id] = "<p>" + r.skip + "</p>"; paint(); return; }
      x.checked = true;
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<p><strong>✗ Not quite.</strong></p>" + r.msg; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-fi="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 1: matching thumbnails, drawn from the equations (window −4 ≤ x ≤ 4, fitted y) ----------
var THUMBS = { gE:{ z:[[-2, 1], [1, 1], [3, 1]], a:1 }, gB:{ z:[[-2, 1], [1, 1], [3, 1]], a:-1 }, gH:{ z:[[-2, 2], [1, 1]], a:1 }, gA:{ z:[[-2, 1], [1, 2]], a:1 },
  gF:{ z:[[1, 3]], a:1 }, gC:{ z:[[-2, 2], [1, 2]], a:-1 }, gG:{ z:[[-2, 1], [0, 1], [1, 1], [3, 1]], a:1 }, gD:{ z:[[-2, 1], [1, 3]], a:1 } };
var figures = {};
Object.keys(THUMBS).forEach(function(key){
  figures[key] = function(p){
    var d = THUMBS[key], zs = P.toZ(d.z), f = P.f(zs, d.a), yi = f(0);
    p.draw({ view:P.fit(zs, d.a, { x:[-4, 4] }), xTicks:{ step:1 }, yTicks:{ fmt:function(){ return ""; } }, curves:[{ f:f, color:css("--pen"), width:2.6, arrows:true }],
      points:[{ x:0, y:yi, r:4.5, color:css("--ink"), label:"(0, " + num(yi) + ")" }] });
  };
});

// ---------- performance task: hit the checkpoints (the zero builder, whole-number zeros) ----------
var task = (function(){
  var zbT = null;
  function poly(){ var s = zbT ? zbT.get() : { zeros:[[0, 1]], a:1 }; return { zs:P.toZ(s.zeros), a:s.a }; }
  function parseKey(k){ var p = k.split("|"); return { zs:p[0].split(",").map(function(t){ var q = t.split(":"); return { r:+q[0], k:+q[1] }; }), a:+p[1] }; }
  return {
    render:function(inp, pv, api){
      pv.innerHTML = '<div class="zb-task-graph"></div><dl class="read zb-task-read" aria-live="polite"></dl>';
      inp.innerHTML = '<div class="zb-task-ctrl"></div>';
      zbT = zeroBuilder({ graph:pv.querySelector(".zb-task-graph"), ctrl:inp.querySelector(".zb-task-ctrl"), read:pv.querySelector(".zb-task-read"), uid:"zbt", snap:1,
        aria:"Graph of your design", state:api.S.zb || { zeros:[[-2, 1], [1, 1], [3, 1]], a:1 },
        onChange:function(st){ api.S.zb = st; api.save(); api.update(); } });
    },
    read:poly,
    valid:function(){ return true; },
    checks:function(d){
      var deg = P.deg(d.zs), yi = P.f(d.zs, d.a)(0);
      return [deg === 4, d.zs.length === 3, deg % 2 === 0 && d.a < 0, Math.abs(yi - 8) < 1e-9, d.zs.some(function(z){ return z.k % 2 === 0 && z.r > 0; })];
    },
    tips:function(d, c){
      var T = MV.C.task.tips, out = [], deg = P.deg(d.zs), prod = P.f(d.zs, 1)(0), yi = d.a * prod;
      if (!c[0]) out.push(T[0].replace("{n}", deg));
      if (!c[1]) out.push(T[1].replace("{k}", d.zs.length));
      if (!c[2]) out.push(T[2]);
      if (!c[3]) out.push(T[3].replace("{v}", num(yi, 3)).replace("{p}", num(prod, 3)));
      if (!c[4]) out.push(T[4]);
      return out;
    },
    key:function(d){ return P.sorted(d.zs).map(function(z){ return z.r + ":" + z.k; }).join(",") + "|" + d.a; },
    label:function(k){ var d = parseKey(k); return MV.m(P.eqM(d.zs, d.a, true)); },
    text:function(k){ var d = parseKey(k); return MV.plain(MV.m(P.eqM(d.zs, d.a))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ find:findActivity },
  task:task,
  figures:figures
});
})();
