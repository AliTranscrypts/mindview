// MCV4U 44 The Dot Product in R³: hero (a look-alike pair seen from the top, then turned to isometric; a hidden right angle),
// 3D angle finder (Explore: Angle / Direction angles / Look-alike modes on a V1 3D view), Find the missing component (Part 3:
// a plane of perpendiculars, a line of common perpendiculars, angles in a cube) and the "Square corner" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, MINUS = MV.MINUS;
var D2R = Math.PI / 180;

function m(s){ return MV.m(s); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}

// ---------- vector arithmetic and exact forms ----------
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function crs(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function sc3(a, k){ return [a[0] * k, a[1] * k, a[2] * k]; }
function ad3(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub3(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function unit(a){ var l = len(a); return l ? sc3(a, 1 / l) : [0, 0, 0]; }
function isZero(a){ return !a[0] && !a[1] && !a[2]; }
function same(a, b){ return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; }
function parallel(a, b){ return isZero(crs(a, b)); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function sqf(N){ var s = 1, r = N; for (var k = 2; k * k <= r; k++) while (r % (k * k) === 0) { r /= k * k; s *= k; } return [s, r]; }
function rootSrc(N){ var p = sqf(N); return p[1] === 1 ? String(p[0]) : (p[0] === 1 ? "" : p[0]) + "√" + p[1]; }
// n√r/d (r square-free) as m() source; inline gives "n√r/d" on one line
function sfrac(n, d, r, inline){
  if (n === 0) return "0";
  var g = gcd(n, d); n /= g; d /= g;
  var sg = n < 0 ? "-" : "", a = Math.abs(n), top = r === 1 ? String(a) : (a === 1 ? "" : a) + "√" + r;
  if (d === 1) return sg + top;
  return inline ? sg + top + "/" + d : sg + "{" + top + "}/{" + d + "}";
}
function overRoot(n, N, inline){ var p = sqf(N); return sfrac(n, p[0] * p[1], p[1], inline); }   // n/√N, rationalized
var SPEC = [[1, 0], [Math.sqrt(3) / 2, 30], [Math.SQRT2 / 2, 45], [0.5, 60], [0, 90], [-0.5, 120], [-Math.SQRT2 / 2, 135], [-Math.sqrt(3) / 2, 150], [-1, 180]];
function angInfo(c){
  for (var i = 0; i < SPEC.length; i++) if (Math.abs(c - SPEC[i][0]) < 1e-9) return { exact:true, deg:SPEC[i][1] };
  return { exact:false, deg:Math.acos(Math.max(-1, Math.min(1, c))) / D2R };
}
function angTxt(c){ var A = angInfo(c); return (A.exact ? "= " : "≈ ") + Math.round(A.deg) + "°"; }
function angVal(c){ var A = angInfo(c); return (A.exact ? "" : "≈ ") + Math.round(A.deg) + "°"; }
function angOf(a, b){ return dot(a, b) / Math.sqrt(dot(a, a) * dot(b, b)); }
function tup(v){ return "(" + v.join(", ") + ")"; }
function tupTxt(v){ return "(" + v.map(function(x){ return (x < 0 ? MINUS : "") + Math.abs(x); }).join(", ") + ")"; }
function par(v){ return "(" + v + ")"; }
function prodSrc(a, b){ return [0, 1, 2].map(function(i){ return par(a[i]) + par(b[i]); }).join(" + ") + " = " + dot(a, b); }
function statusOf(a, b, ST){
  if (isZero(a) || isZero(b)) return ST.zero;
  var d = dot(a, b);
  if (parallel(a, b)) return d > 0 ? ST.same : ST.opp;
  return d === 0 ? ST.perp : d > 0 ? ST.acute : ST.obtuse;
}
function isDark(){ var t = document.documentElement.getAttribute("data-theme"); return t ? t === "dark" : !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches); }

// @component V1 view3d — orthographic 3D view (course plan V1), hand-written on an MV.Plot canvas (MCV4U 44). Camera by azimuth
// and elevation (degrees; VIEWS gives Isometric, Top xy, Front xz, Side yz). Drag or arrow keys rotate it (Shift 15°); o.pick /
// o.move let a page drag handles instead. A scene is {L (axis half-length), R (fit radius, optional), items:[…]} with items
// plane {n, color, L} (through the origin, clipped to the ±L box, 14% fill / 18% in dark mode, 60% edge), disk {a, b, R, color}
// (the plane of two vectors), line {d, color} (clipped to the box), seg {p, q, color, width, dash}, vec {v, from, color, name}
// (3 px shaft, over-arrow name; farther tips drawn fainter), arc {a, b, r, label, color, bold} (in the plane of a and b),
// right {a, b, s} (3D right-angle mark), fake {a, b, label} (dashed screen-space right-angle mark: "looks like 90°?"),
// pt {p, r, color, ring}. Axes in --ink-2 (1.5 px, negative halves dashed, x y z letters). api.panes([{az, el, title}, …])
// draws side-by-side views (reduced-motion reveals). Returns {draw, set, get, animate, lock, busy, panes, pane(i)}.
var VIEWS = { iso:{ az:45, el:35.26 }, top:{ az:-90, el:90 }, front:{ az:-90, el:0 }, side:{ az:0, el:0 } };
var CUBE_E = (function(){
  var E = [];
  [[0, 1, 2], [1, 0, 2], [2, 0, 1]].forEach(function(ax){ [-1, 1].forEach(function(s1){ [-1, 1].forEach(function(s2){
    var p = [0, 0, 0], q = [0, 0, 0]; p[ax[0]] = -1; q[ax[0]] = 1; p[ax[1]] = q[ax[1]] = s1; p[ax[2]] = q[ax[2]] = s2; E.push([p, q]);
  }); }); });
  return E;
})();
function planePoly(n, L){
  var pts = [];
  CUBE_E.forEach(function(e){
    var p = sc3(e[0], L), q = sc3(e[1], L), fp = dot(n, p), fq = dot(n, q);
    if (Math.abs(fp) < 1e-9) pts.push(p);
    if (Math.abs(fq) < 1e-9) pts.push(q);
    if (fp * fq < 0 && Math.abs(fp) >= 1e-9 && Math.abs(fq) >= 1e-9) { var t = fp / (fp - fq); pts.push(ad3(p, sc3(sub3(q, p), t))); }
  });
  var u = unit(Math.abs(unit(n)[0]) < 0.9 ? crs(n, [1, 0, 0]) : crs(n, [0, 1, 0])), v = unit(crs(n, u)), out = [];
  pts.forEach(function(p){ if (!out.some(function(q){ return len(sub3(p, q)) < 1e-7; })) out.push(p); });
  out.sort(function(p, q){ return Math.atan2(dot(p, v), dot(p, u)) - Math.atan2(dot(q, v), dot(q, u)); });
  return out;
}
function view3d(canvas, o){
  var V = { az:o.az, el:o.el, lock:false, busy:false, panes:null, last:[] }, stop = null;
  var plot = new MV.Plot(canvas, { xmin:-1, xmax:1, ymin:-1, ymax:1 });
  function cam(az, el){ var a = az * D2R, e = el * D2R, ca = Math.cos(a), sa = Math.sin(a), ce = Math.cos(e), se = Math.sin(e); return { r:[-sa, ca, 0], u:[-se * ca, -se * sa, ce], d:[ce * ca, ce * sa, se] }; }
  function halo(ctx, text, x, y, color, font, align){
    ctx.font = font; ctx.textAlign = align || "center"; ctx.textBaseline = "middle";
    ctx.lineJoin = "round"; ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 4; ctx.strokeText(text, x, y);
    ctx.fillStyle = color; ctx.fillText(text, x, y);
  }
  function vecName(ctx, x, y, name, color){
    var f = "italic 600 16px " + (css("--font-math") || "serif");
    halo(ctx, name, x, y, color, f);
    var w = ctx.measureText(name).width, yy = y - 11;
    ctx.strokeStyle = color; ctx.lineWidth = 1.3; ctx.beginPath();
    ctx.moveTo(x - w / 2 - 1, yy); ctx.lineTo(x + w / 2 + 2, yy); ctx.moveTo(x + w / 2 - 1.5, yy - 2.6); ctx.lineTo(x + w / 2 + 2, yy); ctx.lineTo(x + w / 2 - 1.5, yy + 2.6); ctx.stroke();
  }
  function paintPane(ctx, P, sc){
    var C = P.C, L = sc.L || 4, R = sc.R || L, items = sc.items || [], dark = isDark();
    items.forEach(function(it){ if (it.t === "vec") R = Math.max(R, len(ad3(it.from || [0, 0, 0], it.v))); });
    var k = Math.max(4, (Math.min(P.w, P.h - (P.title ? 22 : 0)) / 2 - 24) / R);
    function pj(p){ return [P.cx + k * dot(p, C.r), P.cy - k * dot(p, C.u), dot(p, C.d)]; }
    P.pj = pj; P.k = k;
    var ink = css("--ink"), ink2 = css("--ink-2"), fontM = css("--font-math") || "serif", fontUI = css("--font-ui") || "sans-serif";
    function poly(pts, color, fillA, edgeA){
      if (pts.length < 3) return;
      ctx.beginPath(); pts.forEach(function(p, i){ var q = pj(p); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.closePath();
      ctx.globalAlpha = fillA; ctx.fillStyle = color; ctx.fill();
      if (edgeA) { ctx.globalAlpha = edgeA; ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.setLineDash([]); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
    function seg(p, q, color, w, dash, alpha){
      var a = pj(p), b = pj(q); ctx.globalAlpha = alpha == null ? 1 : alpha;
      ctx.strokeStyle = color; ctx.lineWidth = w || 1.5; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
    function arcPts(a, b, r){
      var ua = unit(a), e = sub3(unit(b), sc3(ua, dot(ua, unit(b)))), th = Math.acos(Math.max(-1, Math.min(1, dot(ua, unit(b))))), out = [];
      e = unit(e); var n = Math.max(8, Math.round(th / D2R / 4));
      for (var i = 0; i <= n; i++) { var t = th * i / n; out.push(ad3(sc3(ua, r * Math.cos(t)), sc3(e, r * Math.sin(t)))); }
      return out;
    }
    var fillA = dark ? 0.18 : 0.14;
    items.forEach(function(it){
      if (it.t === "plane") poly(planePoly(it.n, it.L || L), it.color, fillA, 0.6);
      else if (it.t === "disk") {
        var ua = unit(it.a), e = unit(sub3(unit(it.b), sc3(ua, dot(ua, unit(it.b))))), pts = [];
        for (var i = 0; i < 60; i++) { var t = 2 * Math.PI * i / 60; pts.push(ad3(sc3(ua, it.R * Math.cos(t)), sc3(e, it.R * Math.sin(t)))); }
        poly(pts, it.color, dark ? 0.16 : 0.1, 0);
      }
    });
    if (!sc.noAxes) {
      ["x", "y", "z"].forEach(function(nm, i){
        var e = [0, 0, 0]; e[i] = L;
        seg([0, 0, 0], sc3(e, -1), ink2, 1.5, [5, 5], 0.8);
        seg([0, 0, 0], e, ink2, 1.5);
        var a = pj([0, 0, 0]), b = pj(e), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
        var lx = l > 4 ? b[0] + dx / l * 12 : b[0] + 10, ly = l > 4 ? b[1] + dy / l * 12 : b[1] - 10;
        halo(ctx, nm, lx, ly, ink2, "italic 15px " + fontM);
      });
    }
    var ORDER = { line:1, seg:1, arc:2, right:2, fake:2, vec:3, pt:4 };
    items.filter(function(it){ return ORDER[it.t]; }).sort(function(p, q){ return ORDER[p.t] - ORDER[q.t]; }).forEach(function(it){
      if (it.t === "line") {
        var mx = Math.max(Math.abs(it.d[0]), Math.abs(it.d[1]), Math.abs(it.d[2])), tm = (it.L || L) / mx;
        seg(sc3(it.d, -tm), sc3(it.d, tm), it.color, it.width || 2.4);
      } else if (it.t === "seg") seg(it.p, it.q, it.color, it.width, it.dash, it.alpha);
      else if (it.t === "arc") {
        var pts = arcPts(it.a, it.b, it.r);
        ctx.strokeStyle = it.color || ink; ctx.lineWidth = it.bold ? 3 : 1.8; ctx.beginPath();
        pts.forEach(function(p, i){ var q = pj(p); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke();
        if (it.label) {
          var mid = pts[Math.round(pts.length / 2)], o0 = pj([0, 0, 0]), q = pj(sc3(mid, 1.45)), q2 = pj(mid);
          if (Math.hypot(q[0] - q2[0], q[1] - q2[1]) < 10) { var dx = q2[0] - o0[0], dy = q2[1] - o0[1], l = Math.hypot(dx, dy) || 1; q = [q2[0] + dx / l * 14, q2[1] + dy / l * 14]; }
          halo(ctx, it.label, q[0], q[1], it.color || ink, (it.bold ? "700 " : "600 ") + "14px " + fontUI);
        }
      } else if (it.t === "right") {
        var s = it.s || 0.35, ua = sc3(unit(it.a), s), ub = sc3(unit(it.b), s);
        var p1 = pj(ua), p2 = pj(ad3(ua, ub)), p3 = pj(ub);
        ctx.strokeStyle = it.color || ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.lineTo(p3[0], p3[1]); ctx.stroke();
      } else if (it.t === "fake") {
        var o1 = pj([0, 0, 0]), A = pj(it.a), B = pj(it.b), da = [A[0] - o1[0], A[1] - o1[1]], db = [B[0] - o1[0], B[1] - o1[1]];
        var la = Math.hypot(da[0], da[1]) || 1, lb = Math.hypot(db[0], db[1]) || 1, s2 = 16;
        da = [da[0] / la * s2, da[1] / la * s2]; db = [db[0] / lb * s2, db[1] / lb * s2];
        ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.setLineDash([3, 3]); ctx.beginPath();
        ctx.moveTo(o1[0] + da[0], o1[1] + da[1]); ctx.lineTo(o1[0] + da[0] + db[0], o1[1] + da[1] + db[1]); ctx.lineTo(o1[0] + db[0], o1[1] + db[1]); ctx.stroke(); ctx.setLineDash([]);
        if (it.label) halo(ctx, it.label, o1[0] + (da[0] + db[0]) * 2.2, o1[1] + (da[1] + db[1]) * 2.2, ink, "600 14px " + fontUI);
      } else if (it.t === "vec") {
        var f = it.from || [0, 0, 0], tip = ad3(f, it.v), a = pj(f), b = pj(tip), dx2 = b[0] - a[0], dy2 = b[1] - a[1], l2 = Math.hypot(dx2, dy2);
        var alpha = b[2] >= 0 ? 1 : Math.max(0.55, 1 + 0.45 * b[2] / R);
        ctx.globalAlpha = alpha; ctx.strokeStyle = it.color; ctx.fillStyle = it.color;
        if (l2 < 6) { ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(b[0], b[1], 6, 0, 2 * Math.PI); ctx.stroke(); ctx.beginPath(); ctx.arc(b[0], b[1], 2, 0, 2 * Math.PI); ctx.fill(); }
        else {
          var ux = dx2 / l2, uy = dy2 / l2, hl = Math.min(12, l2 * 0.45), hw = hl * 0.48;
          ctx.lineWidth = it.width || 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * hl * 0.8, b[1] - uy * hl * 0.8); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[0] - ux * hl - uy * hw, b[1] - uy * hl + ux * hw); ctx.lineTo(b[0] - ux * hl + uy * hw, b[1] - uy * hl - ux * hw); ctx.closePath(); ctx.fill();
          ctx.lineCap = "butt";
        }
        ctx.globalAlpha = 1;
        if (it.name) { var nx = l2 > 4 ? dx2 / l2 : 0.7, ny = l2 > 4 ? dy2 / l2 : -0.7; vecName(ctx, b[0] + nx * 16 + (Math.abs(nx) < 0.3 ? 12 : 0), b[1] + ny * 16 + 2, it.name, it.color); }
      } else if (it.t === "pt") {
        var p = pj(it.p); ctx.fillStyle = it.color || ink; ctx.beginPath(); ctx.arc(p[0], p[1], it.r || 3.5, 0, 2 * Math.PI); ctx.fill();
        if (it.ring) { ctx.strokeStyle = it.color || ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p[0], p[1], (it.r || 3.5) + 5, 0, 2 * Math.PI); ctx.stroke(); }
      }
    });
    if (P.title) halo(ctx, P.title, P.cx, 13, ink2, "600 13px " + fontUI);
  }
  function draw(){
    plot.draw({ view:{ xmin:-1, xmax:1, ymin:-1, ymax:1 }, grid:false, axes:false, ticks:false, describe:o.describe ? o.describe() : "", after:function(ctx, pl){
      var list = V.panes || [{ az:V.az, el:V.el }], n = list.length, w = pl.W / n;
      V.last = list.map(function(p, i){ return { C:cam(p.az, p.el), x:i * w, w:w, h:pl.H, cx:i * w + w / 2, cy:pl.H / 2 + (p.title ? 10 : 0), title:p.title, opt:p }; });
      V.last.forEach(function(P, i){
        ctx.save(); ctx.beginPath(); ctx.rect(P.x, 0, P.w, P.h); ctx.clip(); paintPane(ctx, P, o.scene(i, P.opt)); ctx.restore();
        if (i) { ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(P.x + 0.5, 6); ctx.lineTo(P.x + 0.5, P.h - 6); ctx.stroke(); }
      });
    } });
  }
  plot.render = draw;
  function rot(daz, del){ V.az = ((V.az + daz) % 360 + 540) % 360 - 180; V.el = Math.max(-90, Math.min(90, V.el + del)); V.panes = null; draw(); }
  if (!o.still) {
    canvas.tabIndex = 0; canvas.style.touchAction = "none";
    var drag = null;
    canvas.addEventListener("pointerdown", function(e){
      if (V.busy) return;
      var r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, P = V.last.filter(function(q){ return x >= q.x && x <= q.x + q.w; })[0] || V.last[0];
      var h = o.pick && P ? o.pick(x, y, P) : null;
      if (h) drag = { h:h, P:P };
      else if (!V.lock) drag = { x:x, y:y, az:V.az, el:V.el };
      else return;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", function(e){
      if (!drag || V.busy) return;
      var r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (drag.h) { o.move(drag.h, x, y, drag.P); return; }
      V.az = drag.az; V.el = drag.el; rot(-(x - drag.x) * 0.5, (y - drag.y) * 0.5);
      if (o.onView) o.onView(false);
    });
    function end(){ if (drag && !drag.h && o.onView) o.onView(true); drag = null; }
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("keydown", function(e){
      if (!/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return;
      e.preventDefault(); if (V.busy || V.lock) return;
      var s = e.shiftKey ? 15 : 5;
      if (e.key === "ArrowLeft") rot(s, 0); else if (e.key === "ArrowRight") rot(-s, 0); else if (e.key === "ArrowUp") rot(0, s); else rot(0, -s);
      if (o.onView) o.onView(true);
    });
  }
  return {
    draw:draw, plot:plot,
    get:function(){ return { az:V.az, el:V.el }; },
    set:function(az, el){ if (stop) { stop(); stop = null; } V.az = az; V.el = el; V.panes = null; draw(); },
    animate:function(az, el, dur, cb){
      if (stop) { stop(); stop = null; }
      var a0 = V.az, e0 = V.el, da = ((az - a0) % 360 + 540) % 360 - 180, de = el - e0;
      V.panes = null;
      stop = MV.tween({ dur:dur == null ? 1200 : dur, step:function(t){ V.az = a0 + da * t; V.el = e0 + de * t; draw(); }, done:function(){ stop = null; V.az = az; V.el = el; draw(); if (cb) cb(); } });
    },
    lock:function(b){ V.lock = !!b; }, busy:function(b){ V.busy = !!b; },
    panes:function(list){ V.panes = list; draw(); },
    pane:function(i){ return V.last[i || 0]; }
  };
}
// ------------------------------------------------------ end of view3d ------------------------------------------------------
function trueView(a, b, fallback){
  var n = crs(a, b); if (isZero(n)) return fallback;
  n = unit(n); if (n[2] < 0) n = sc3(n, -1);
  var el = Math.asin(Math.max(-1, Math.min(1, n[2]))) / D2R, az = Math.abs(el) > 89.5 ? fallback.az : Math.atan2(n[1], n[0]) / D2R;
  return { az:az, el:el };
}
function viewName(v){
  for (var k in VIEWS) if (Math.abs(VIEWS[k].az - v.az) < 0.5 && Math.abs(VIEWS[k].el - v.el) < 0.5) return { iso:"isometric", top:"top (xy)", front:"front (xz)", side:"side (yz)" }[k];
  return "turned";
}

// ---------- hero: a look-alike pair from the top, turned to isometric; then a hidden right angle ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var A1 = [1, 0, 3], B1 = [0, 1, -2], A2 = [1, 2, 2], B2 = [2, -2, 1];
  var st = { pair:1, fake:true, arc:false, right:false };
  if (f.cap) f.cap.innerHTML = '<span class="dp-hcap"><span data-st="1">' + m("vec{a} = (1, 0, 3)") + ", " + m("vec{b} = (0, 1, -2)") + ": " + m("(1)(0) + (0)(1) + (3)(-2) = -6") + ", θ ≈ 148°</span>" +
    '<span data-st="2">' + m("vec{a} = (1, 2, 2)") + ", " + m("vec{b} = (2, -2, 1)") + ": " + m("(1)(2) + (2)(-2) + (2)(1) = 0") + ", θ = 90°</span></span>";
  function stage(n){ if (f.cap) $$("[data-st]", f.cap).forEach(function(el){ el.style.opacity = +el.dataset.st <= n ? 1 : 0; }); }
  function scene(i, p){
    var o = p.pair ? p : st, a = o.pair === 1 ? A1 : A2, b = o.pair === 1 ? B1 : B2, items = [];
    items.push({ t:"vec", v:a, color:css("--pen"), name:"a" }, { t:"vec", v:b, color:css("--f3"), name:"b" });
    if (o.fake) items.push({ t:"fake", a:a, b:b, label:"looks like 90°?" });
    if (o.arc) items.push({ t:"arc", a:a, b:b, r:1.1, label:"θ ≈ 148°" });
    if (o.right) items.push({ t:"right", a:a, b:b, s:0.55 });
    return { L:3.2, items:items };
  }
  var V3 = view3d(cv, { az:VIEWS.top.az, el:VIEWS.top.el, still:true, scene:scene, describe:function(){
    if (MV.reduceMotion) return "Two views. Top view: a = (1, 0, 3) and b = (0, 1, −2) look perpendicular, but their dot product is −6, so θ ≈ 148°. Isometric view: a = (1, 2, 2) and b = (2, −2, 1) look skewed, but their dot product is 0: a right angle.";
    return st.pair === 1 ? "a = (1, 0, 3) and b = (0, 1, −2)" + (st.fake ? " seen from the top: they look perpendicular." : "; dot product −6, θ ≈ 148°.") : "a = (1, 2, 2) and b = (2, −2, 1); dot product 0: perpendicular.";
  } });
  if (MV.reduceMotion) {
    stage(2);
    V3.panes([{ az:VIEWS.top.az, el:VIEWS.top.el, title:"Top view", pair:1, fake:true }, { az:VIEWS.iso.az, el:VIEWS.iso.el, title:"Isometric", pair:2, right:true }]);
    return;
  }
  stage(0); V3.draw();
  MV.wait(1400, function(){
    st.fake = false; V3.animate(VIEWS.iso.az, VIEWS.iso.el, 2400, function(){
      st.arc = true; stage(1); V3.draw();
      MV.wait(2600, function(){
        st.pair = 2; st.arc = false; V3.draw();
        MV.wait(1100, function(){ st.right = true; stage(2); V3.draw(); });
      });
    });
  });
}

// ---------- Explore: 3D angle finder ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function okv(v, lim){ return Array.isArray(v) && v.length === 3 && v.every(function(x){ return Number.isInteger(x) && Math.abs(x) <= lim; }); }
  if (!okv(S.a, 6)) S.a = [1, 2, 2];
  if (!okv(S.b, 6)) S.b = [2, -2, 1];
  if (["angle", "dir", "look"].indexOf(S.mode) < 0) S.mode = "angle";
  if (!S.view || typeof S.view.az !== "number" || typeof S.view.el !== "number") S.view = { az:VIEWS.iso.az, el:VIEWS.iso.el };
  if (["tc1", "tc2", "tc3"].indexOf(S.lock) < 0) S.lock = null;
  S.found2 = Array.isArray(S.found2) ? S.found2.filter(function(v){ return okv(v, 3); }) : [];
  if (!S.look || typeof S.look !== "object" || !S.look.from) S.look = null;
  if (S.mode === "look" && !S.look) S.look = { from:{ az:S.view.az, el:S.view.el }, guess:null, rev:false };
  var busy = false, hide = false, arcStage = 3, hiG = false, ST = C.status;
  var vecRow = function(k, nm){ return '<div class="dp-vrow"><span class="dp-vn m">' + m("vec{" + nm + "}") + ' =</span><span class="m">(</span>' + [0, 1, 2].map(function(i){
    return '<input class="numin dp-st-in" type="number" step="1" id="dx-' + k + i + '" data-v="' + k + '" data-i="' + i + '" aria-label="' + nm + ", " + ["x", "y", "z"][i] + '-component">' + (i < 2 ? '<span class="m">,</span>' : ""); }).join("") + '<span class="m">)</span></div>'; };
  host.innerHTML = '<div class="dp-ex"><div class="dp-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot square dp-v" id="dx-plot" role="img" aria-label="3D view of the vectors"></canvas></div>' +
    '<div class="dp-views" id="dx-views" role="group" aria-label="View"></div><p class="tiny muted dp-how">' + C.viewHow + "</p></div>" +
    '<div class="dp-side"><div class="dp-vecs" id="dx-vecs">' + vecRow("a", "a") + '<div id="dx-brow">' + vecRow("b", "b") + "</div></div>" +
    '<div class="chips dp-pre" id="dx-pre" role="group" aria-label="Presets"></div>' +
    '<div class="seg-wrap" id="dx-mode"></div><p class="tiny muted dp-how" id="dx-how"></p><div id="dx-look"></div><div id="dx-gam"></div>' +
    '<dl class="read dp-read" id="dx-read" aria-live="polite"></dl><p class="tiny dp-note">' + C.note + "</p>" +
    '<div class="dp-setups"><div class="chips" id="dx-setups" role="group" aria-label="Challenge set-ups"></div><p class="tiny muted" id="dx-lock"></p></div></div></div>';
  var V3 = view3d($("#dx-plot", host), { az:S.view.az, el:S.view.el, scene:scene, describe:describe,
    onView:function(end){ var v = V3.get(); S.view = { az:v.az, el:v.el }; if (end) { api.save(); paintViews(); } } });
  function lim(k){ return (S.lock === "tc2" && k === "b") || (S.lock === "tc3" && k === "a") ? 3 : 6; }
  function locked(k, i){ if (busy) return true; if (S.lock === "tc1") return k === "a" || i < 2; if (S.lock === "tc2") return k === "a"; if (S.lock === "tc3") return k === "b"; return false; }
  function showAngles(){ return S.mode === "angle" ? !hide : S.mode === "look" ? !!(S.look && S.look.rev) && !hide : false; }
  function scene(){
    var a = S.a, b = S.b, items = [], pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2");
    var maxc = Math.max.apply(null, (S.mode === "dir" ? a : a.concat(b)).map(Math.abs)), L = maxc <= 3 ? 4 : 7;
    if (S.mode === "dir") {
      if (!isZero(a)) {
        var P = a, fx = [a[0], a[1], 0], fy = [a[0], 0, a[2]], fz = [0, a[1], a[2]], X = [a[0], 0, 0], Y = [0, a[1], 0], Z = [0, 0, a[2]];
        [[P, fx], [P, fy], [P, fz], [fx, X], [fx, Y], [fy, X], [fy, Z], [fz, Y], [fz, Z]].forEach(function(s){ items.push({ t:"seg", p:s[0], q:s[1], color:ink2, width:1.2, dash:[4, 4] }); });
        if (!hide || arcStage < 3) {
          var la = len(a), names = ["α", "β", "γ"];
          [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(function(e, i){
            if ((hide && i >= arcStage) || parallel(a, e)) return;
            items.push({ t:"arc", a:a, b:e, r:Math.max(0.6, la * (0.3 + 0.1 * i)), label:names[i], color:ink, bold:hiG && i === 2 });
          });
        }
      }
      items.push({ t:"vec", v:a, color:pen, name:"a" });
    } else {
      if (S.mode === "angle" && !isZero(a) && !isZero(b) && !parallel(a, b)) items.push({ t:"disk", a:a, b:b, R:Math.max(len(a), len(b)) * 1.08, color:ink2 });
      items.push({ t:"vec", v:a, color:pen, name:"a" }, { t:"vec", v:b, color:f3, name:"b" });
      if (showAngles() && !isZero(a) && !isZero(b) && !parallel(a, b)) {
        var d = dot(a, b), r = Math.max(0.5, Math.min(len(a), len(b)) * 0.38);
        if (d === 0) items.push({ t:"right", a:a, b:b, s:r * 0.8, color:ink });
        else items.push({ t:"arc", a:a, b:b, r:r, label:"θ " + angTxt(angOf(a, b)), color:ink });
      }
    }
    return { L:L, items:items };
  }
  function describe(){
    var a = S.a, b = S.b, vw = " View: " + viewName(S.view) + ".";
    if (S.mode === "dir") {
      if (isZero(a)) return "a is the zero vector." + vw;
      var la = len(a), ang = a.map(function(x){ return Math.round(Math.acos(x / la) / D2R); });
      return "a = " + tupTxt(a) + " with dashed box guides to the axes" + (hide ? "." : "; direction angles about " + ang[0] + "°, " + ang[1] + "° and " + ang[2] + "°.") + vw;
    }
    var t = "a = " + tupTxt(a) + ", b = " + tupTxt(b);
    if (!showAngles()) return t + "; the angle is hidden." + vw;
    return t + "; dot product " + MV.plain(m(String(dot(a, b)))) + "; " + statusOf(a, b, ST).toLowerCase() + "." + vw;
  }
  function readRows(){
    var a = S.a, b = S.b, rows = [], la2 = dot(a, a), lb2 = dot(b, b), q = '<span class="muted">?</span>';
    rows.push([m("vec{a}") + ", " + m("|vec{a}|"), m(tup(a)) + ", " + m(rootSrc(la2))]);
    if (S.mode === "dir") {
      if (isZero(a)) { rows.push(["Direction", ST.zero]); return rows; }
      var dc = a.map(function(x){ return overRoot(x, la2, false); }), dcI = a.map(function(x){ return overRoot(x, la2, true); });
      rows.push(["Direction cosines", hide ? q : m("(" + dc.join(", ") + ")")]);
      rows.push(["Check", hide ? q : m(dcI.map(function(s){ return "(" + s + ")^2"; }).join(" + ") + " = 1") + " ✓"]);
      rows.push(["Direction angles", hide ? q : ["α", "β", "γ"].map(function(g, i){ return g + " " + angTxt(a[i] / Math.sqrt(la2)); }).join(", ")]);
      return rows;
    }
    rows.push([m("vec{b}") + ", " + m("|vec{b}|"), m(tup(b)) + ", " + m(rootSrc(lb2))]);
    if (!showAngles()) { rows.push([m("vec{a} · vec{b}"), S.mode === "look" ? '<span class="muted">Hidden until you judge the angle.</span>' : q]); rows.push([m("θ"), q]); return rows; }
    rows.push([m("vec{a} · vec{b}"), m(prodSrc(a, b))]);
    if (!la2 || !lb2) { rows.push(["Status", ST.zero]); return rows; }
    rows.push([m("cos θ"), m(overRoot(dot(a, b), la2 * lb2, false))]);
    rows.push([m("θ"), angVal(angOf(a, b))]);
    rows.push(["Status", "<strong>" + statusOf(a, b, ST) + "</strong>"]);
    if (S.lock === "tc2" && S.found2.length) rows.push(["60° answers found", S.found2.map(function(v){ return m(tup(v)); }).join("; ")]);
    return rows;
  }
  function record60(){
    if (S.lock !== "tc2" || !same(S.a, [1, 1, 0]) || isZero(S.b) || !okv(S.b, 3)) return;
    var d = dot(S.a, S.b);
    if (d > 0 && 4 * d * d === 2 * dot(S.b, S.b) && !S.found2.some(function(v){ return same(v, S.b); })) S.found2.push(S.b.slice());
  }
  function paintViews(){
    var el = $("#dx-views", host), dis = busy || (S.mode === "look" && S.look && !S.look.rev);
    MV.keepFocus(el, function(){
      el.innerHTML = C.views.map(function(v){ var on = viewName(S.view) === viewName(VIEWS[v.id]); return '<button type="button" class="btn ghost sm' + (on ? " on" : "") + '" data-view="' + v.id + '" data-k="vw' + v.id + '" aria-pressed="' + on + '"' + (dis ? " disabled" : "") + ">" + v.t + "</button>"; }).join("");
    });
  }
  function paint(){
    record60();
    ["a", "b"].forEach(function(k){ [0, 1, 2].forEach(function(i){
      var el = $("#dx-" + k + i, host), L = lim(k);
      el.min = -L; el.max = L; el.disabled = locked(k, i);
      if (document.activeElement !== el || parseInt(el.value, 10) !== S[k][i]) el.value = S[k][i];
    }); });
    $("#dx-brow", host).hidden = S.mode === "dir";
    MV.keepFocus($("#dx-pre", host), function(){ $("#dx-pre", host).innerHTML = '<span class="tiny" style="font-weight:700">Presets</span>' + C.presets.map(function(p){ return '<button type="button" class="chip" data-pre="' + p.id + '" data-k="pre' + p.id + '"' + (busy ? " disabled" : "") + ">" + p.t + "</button>"; }).join(""); });
    MV.keepFocus($("#dx-mode", host), function(){ $("#dx-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    $$("#dx-mode button", host).forEach(function(b){ b.disabled = busy; });
    $("#dx-how", host).innerHTML = C.modeHow[S.mode];
    var lk = $("#dx-look", host), lh = "";
    if (S.mode === "look" && S.look) {
      if (!S.look.rev) lh = '<p class="tiny dp-ask">' + C.lookAsk + '</p><div class="chips" role="group" aria-label="Your judgement">' + C.looks.map(function(o){ return '<button type="button" class="chip" data-look="' + o.id + '" data-k="lk' + o.id + '"' + (busy ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
      else if (!hide) {
        var truth = isZero(S.a) || isZero(S.b) ? null : dot(S.a, S.b) === 0 ? "perp" : dot(S.a, S.b) > 0 ? "acute" : "obtuse", g = C.looks.filter(function(o){ return o.id === S.look.guess; })[0];
        lh = '<p class="dp-verdict">' + (g ? "You said it " + g.t + ". " : "") + (truth ? "True angle: θ " + angTxt(angOf(S.a, S.b)) + " (" + statusOf(S.a, S.b, ST).toLowerCase() + ")." : ST.zero + ".") +
          (g && truth ? (g.id === truth ? " Your eye was right this time." : " The flat view fooled your eye.") : "") + "</p>" +
          '<button type="button" class="btn ghost sm" data-act="relook" data-k="relook"' + (busy ? " disabled" : "") + ">Judge another view</button>";
      }
    }
    MV.keepFocus(lk, function(){ lk.innerHTML = lh; });
    var gm = $("#dx-gam", host);
    MV.keepFocus(gm, function(){
      gm.innerHTML = S.lock === "tc3" ? '<p class="tiny dp-ask">Your γ for challenge 3:</p><div class="chips" role="group" aria-label="Choose gamma">' + C.gammas.map(function(g){ var on = S.gam === g; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-gam="' + g + '" data-k="gm' + g + '" aria-pressed="' + on + '">γ = ' + g + "°</button>"; }).join("") + "</div>" : "";
    });
    $("#dx-read", host).innerHTML = MV.readoutHTML(readRows());
    MV.keepFocus($("#dx-setups", host), function(){
      $("#dx-setups", host).innerHTML = C.setups.map(function(s){ var on = S.lock === s.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-setup="' + s.id + '" data-k="su' + s.id + '"' + (s.id !== "free" ? ' aria-pressed="' + on + '"' : "") + (busy ? " disabled" : "") + ">" + s.t + "</button>"; }).join("");
    });
    $("#dx-lock", host).innerHTML = S.lock ? C.lockNote[S.lock] : "";
    paintViews();
    V3.lock(S.mode === "look" && S.look && !S.look.rev);
    if (MV.reduceMotion && S.mode === "look" && S.look && S.look.rev && !busy) V3.panes([{ az:S.look.from.az, el:S.look.from.el, title:"Locked view" }, { az:S.view.az, el:S.view.el, title:"Face-on view" }]);
    else V3.draw();
  }
  function setView(v, cb){
    S.view = { az:v.az, el:v.el };
    if (MV.reduceMotion) { V3.set(v.az, v.el); if (cb) cb(); return; }
    busy = true; V3.busy(true); paint();
    V3.animate(v.az, v.el, 1100, function(){ busy = false; V3.busy(false); api.save(); paint(); if (cb) cb(); });
  }
  function changed(){ if (S.mode === "look") S.look = { from:{ az:S.view.az, el:S.view.el }, guess:null, rev:false }; api.save(); paint(); MV.changed(); }
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.v || busy) return;
    var v = parseInt(String(t.value).replace(/−/g, "-"), 10), L = lim(t.dataset.v);
    if (!isFinite(v)) return;
    v = Math.max(-L, Math.min(L, v)); S[t.dataset.v][+t.dataset.i] = v; changed();
  });
  host.addEventListener("change", function(e){ var t = e.target; if (t.dataset && t.dataset.v) t.value = S[t.dataset.v][+t.dataset.i]; });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || busy) return;
    if (b.dataset.view) { setView(VIEWS[b.dataset.view]); return; }
    if (b.dataset.pre) { var p = C.presets.filter(function(q){ return q.id === b.dataset.pre; })[0]; S.lock = null; S.gam = null; S.a = p.a.slice(); S.b = p.b.slice(); if (S.mode === "dir") S.mode = "angle"; changed(); return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; S.look = S.mode === "look" ? { from:{ az:S.view.az, el:S.view.el }, guess:null, rev:false } : null; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.look) {
      S.look.guess = b.dataset.look; S.look.rev = true; S.look.from = { az:S.view.az, el:S.view.el };
      var tv = trueView(S.a, S.b, S.view);
      if (MV.reduceMotion) { S.view = tv; V3.set(tv.az, tv.el); api.save(); paint(); }
      else { api.save(); setView(tv); }
      MV.changed(); return;
    }
    if (b.dataset.act === "relook") { S.look = { from:{ az:S.view.az, el:S.view.el }, guess:null, rev:false }; V3.set(S.view.az, S.view.el); api.save(); paint(); return; }
    if (b.dataset.gam) { S.gam = +b.dataset.gam; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.setup) {
      var id = b.dataset.setup; S.gam = null;
      if (id === "free") S.lock = null;
      else {
        S.lock = id;
        if (id === "tc1") { S.a = [2, -1, 3]; S.b = [1, 5, 0]; S.mode = "angle"; }
        if (id === "tc2") { S.a = [1, 1, 0]; S.b = S.b.map(function(x){ return Math.max(-3, Math.min(3, x)); }); S.mode = "angle"; S.found2 = []; }
        if (id === "tc3") { S.a = S.a.map(function(x){ return Math.max(-3, Math.min(3, x)); }); S.mode = "dir"; }
        S.look = null;
      }
      changed();
    }
  });
  paint();

  // ---- predictions ----
  var PSTART = {
    p1:{ mode:"angle", a:[1, 2, 2], b:[2, -2, 1], view:VIEWS.iso },
    p2:{ mode:"look", a:[1, 0, 3], b:[0, 1, -2], view:VIEWS.top },
    p3:{ mode:"dir", a:[2, 2, 1], b:[2, -2, 1], view:VIEWS.iso },
    p4:{ mode:"angle", a:[1, 1, 1], b:[1, 0, 0], view:VIEWS.iso }
  };
  return {
    predict:{
      start:function(p){
        var P = PSTART[p.id] || PSTART.p1;
        busy = true; V3.busy(true); hide = true; hiG = false; arcStage = 0;
        S.lock = null; S.gam = null; S.mode = P.mode; S.a = P.a.slice(); S.b = P.b.slice();
        S.view = { az:P.view.az, el:P.view.el }; S.look = P.mode === "look" ? { from:{ az:P.view.az, el:P.view.el }, guess:null, rev:false } : null;
        V3.set(P.view.az, P.view.el); paint();
      },
      run:function(p, done){
        function fin(){ busy = false; V3.busy(false); hide = false; arcStage = 3; api.save(); paint(); MV.changed(); done(); }
        function reveal(){ hide = false; arcStage = 3; paint(); }
        function turn(v, cb){ S.view = { az:v.az, el:v.el }; if (MV.reduceMotion) { V3.set(v.az, v.el); cb(); } else V3.animate(v.az, v.el, 1800, cb); }
        if (p.id === "p1" || p.id === "p4") turn(trueView(S.a, S.b, VIEWS.iso), function(){ reveal(); MV.wait(1300, fin); });
        else if (p.id === "p2") {
          S.look.rev = true;
          turn(VIEWS.iso, function(){ reveal(); MV.wait(1300, fin); });
        } else if (p.id === "p3") {
          MV.wait(400, function(){ arcStage = 1; paint(); MV.wait(700, function(){ arcStage = 2; paint(); MV.wait(700, function(){ arcStage = 3; hiG = true; reveal(); MV.wait(1300, function(){ hiG = false; fin(); }); }); }); });
        } else fin();
      }
    },
    challenge:function(id){
      var M = MS[id], a = S.a, b = S.b;
      if (id === "tc1") {
        if (!same(a, [2, -1, 3]) || b[0] !== 1 || b[1] !== 5) return { ok:false, msg:M.setup };
        if (b[2] === 1) return { ok:true };
        if (b[2] === -1) return { ok:false, msg:M.m1 };
        if (b[2] === 0) return { ok:false, msg:M.z };
        return { ok:false, msg:tpl(M.other, { d:MV.plain(m(String(dot(a, b)))) }) };
      }
      if (id === "tc2") {
        if (!same(a, [1, 1, 0])) return { ok:false, msg:M.setup };
        if (isZero(b)) return { ok:false, msg:M.zero };
        if (!okv(b, 3)) return { ok:false, msg:M.range };
        var d = dot(a, b), good = d > 0 && 4 * d * d === 2 * dot(b, b);
        if (good) {
          if (S.found2.some(function(v){ return !parallel(v, b); })) return { ok:true };
          return { ok:false, msg:tpl(M.first, { v:m(tup(b)) }) };
        }
        if (same(b, [0, 1, 0])) return { ok:false, msg:M.y };
        if (same(b, [1, 1, 1])) return { ok:false, msg:M.one };
        if (same(b, [-1, 0, 1])) return { ok:false, msg:M.obt };
        return { ok:false, msg:tpl(M.other, { t:angTxt(angOf(a, b)) }) };
      }
      if (id === "tc3") {
        if (S.mode !== "dir") return { ok:false, msg:M.setup };
        if (!okv(a, 3)) return { ok:false, msg:M.range };
        if (isZero(a)) return { ok:false, msg:"A zero vector has no direction angles." };
        if (a[0] > 0 && a[0] === a[1] && a[2] === 0) return S.gam === 90 ? { ok:true } : { ok:false, msg:S.gam == null ? M.gam : M.gwrong };
        if (a[0] === a[1] && a[0] === a[2] && a[0] > 0) return { ok:false, msg:S.gam === 45 ? M.ones45 : M.ones };
        if (a[0] < 0 && a[0] === a[1] && a[2] === 0) return { ok:false, msg:M.neg };
        var la = Math.sqrt(dot(a, a));
        return { ok:false, msg:tpl(M.other, { a:angTxt(a[0] / la), b:angTxt(a[1] / la) }) };
      }
      return { ok:false };
    }
  };
}

// ---------- Part 3: Find the missing component (three V1 stations) ----------
function part3(host, api){
  var S = api.S, C = api.content, ST = C.stations, A = [1, 2, 3], Cc = [2, 1, 0], W = [1, -2, 1], TS = [-2, -1, 1, 2];
  var P1 = [], x, y, z;
  for (z = -3; z <= 3; z++) for (y = -3; y <= 3; y++) { x = -2 * y - 3 * z; if (Math.abs(x) <= 3 && (x || y || z)) P1.push([x, y, z]); }
  var start1 = P1.findIndex(function(p){ return same(p, [1, 1, -1]); });
  if (!Number.isInteger(S.i1) || S.i1 < 0 || S.i1 >= P1.length) S.i1 = start1;
  if (!S.f1 || typeof S.f1 !== "object") S.f1 = {};
  S.f1[P1[S.i1].join(",")] = true;
  if (!Number.isInteger(S.t2) || S.t2 < 0 || S.t2 >= TS.length) S.t2 = 2;
  var VEC3 = ST[2].vecs;
  if (!Array.isArray(S.sel3) || S.sel3.some(function(id){ return !VEC3.some(function(v){ return v.id === id; }); })) S.sel3 = ["fxy", "fyz"];
  function stHTML(st, side){
    return '<div class="part dp-st" data-st="' + st.id + '"><h3>' + st.title + "</h3><p>" + st.text + '</p><div class="dp-stg"><div class="dp-stv"><div class="plot-wrap"><canvas class="plot square dp-v" id="p3-' + st.id + '" role="img" aria-label="3D view"></canvas></div><p class="tiny muted dp-how">' +
      (st.id === "s3" ? C.turnHow : C.dragHow) + '</p></div><div class="dp-sts">' + side + "</div></div></div>";
  }
  var steps = '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="prev" data-k="{id}prev">Previous point</button><button type="button" class="btn ghost sm" data-act="next" data-k="{id}next">Next point</button></div>';
  host.innerHTML = stHTML(ST[0], tpl(steps, { id:"s1" }) + '<dl class="read" id="p3-r1" aria-live="polite"></dl><p class="dp-count" id="p3-c1" aria-live="polite"></p><p class="tiny muted">' + ST[0].plane + "</p>") +
    stHTML(ST[1], tpl(steps, { id:"s2" }) + '<dl class="read" id="p3-r2" aria-live="polite"></dl><details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + ST[1].alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + '</div></details><p class="dp-after">' + ST[1].after + "</p>") +
    stHTML(ST[2], '<p class="tiny dp-ask">' + ST[2].pick + '</p><div class="chips dp-cube" id="p3-chips" role="group" aria-label="Cube vectors"></div><dl class="read" id="p3-r3" aria-live="polite"></dl>');
  var pen = function(){ return css("--pen"); }, f3 = function(){ return css("--f3"); }, f5 = function(){ return css("--f5"); }, ink = function(){ return css("--ink"); }, ink2 = function(){ return css("--ink-2"); };
  function nearest(P, list, x0, y0){ var bi = -1, bd = 1e9; list.forEach(function(p, i){ var q = P.pj(p), d = Math.hypot(q[0] - x0, q[1] - y0); if (d < bd) { bd = d; bi = i; } }); return bi; }
  function pickTip(tip){ return function(x0, y0, P){ if (!P.pj) return null; var q = P.pj(tip()); return Math.hypot(q[0] - x0, q[1] - y0) < 24 ? "tip" : null; }; }
  // station 1
  function b1(){ return P1[S.i1]; }
  var v1 = view3d($("#p3-s1", host), { az:40, el:24, L:4,
    scene:function(){ return { L:4, items:[{ t:"plane", n:A, color:pen(), L:3.6 }, { t:"vec", v:A, color:pen(), name:"a" }, { t:"vec", v:b1(), color:f3(), name:"b" }, { t:"right", a:A, b:b1(), s:0.45, color:ink() }] }; },
    describe:function(){ return "a = (1, 2, 3) with the plane of vectors perpendicular to it, x + 2y + 3z = 0; b = " + tupTxt(b1()) + " lies in the plane; dot product 0; perpendicular."; },
    pick:pickTip(b1), move:function(h, x0, y0, P){ var i = nearest(P, P1, x0, y0); if (i >= 0 && i !== S.i1) set1(i); } });
  function set1(i){ S.i1 = (i + P1.length) % P1.length; S.f1[P1[S.i1].join(",")] = true; api.save(); paint1(); }
  function paint1(){
    var b = b1();
    $("#p3-r1", host).innerHTML = MV.readoutHTML([[m("vec{b}"), m(tup(b))], [m("vec{a} · vec{b}"), m(prodSrc(A, b))]]);
    $("#p3-c1", host).textContent = tpl(ST[0].count, { n:Object.keys(S.f1).length });
    v1.draw();
  }
  // station 2
  function w2(){ return sc3(W, TS[S.t2]); }
  var LINE = TS.map(function(t){ return sc3(W, t); });
  var v2 = view3d($("#p3-s2", host), { az:40, el:24,
    scene:function(){ return { L:4, items:[{ t:"plane", n:A, color:pen(), L:3.6 }, { t:"plane", n:Cc, color:f5(), L:3.6 }, { t:"line", d:W, color:ink(), width:2.4, L:4 },
      { t:"vec", v:A, color:pen(), name:"a" }, { t:"vec", v:Cc, color:f5(), name:"c" }, { t:"vec", v:w2(), color:ink(), name:"w", width:3.4 }] }; },
    describe:function(){ return "Two planes: one perpendicular to a = (1, 2, 3), one perpendicular to c = (2, 1, 0). They meet in the line through the origin along (1, −2, 1). w = " + tupTxt(w2()) + " lies on that line; dot products with a and c are both 0."; },
    pick:pickTip(w2), move:function(h, x0, y0, P){ var i = nearest(P, LINE, x0, y0); if (i >= 0 && i !== S.t2) { S.t2 = i; api.save(); paint2(); } } });
  function paint2(){
    var w = w2(), t = TS[S.t2];
    $("#p3-r2", host).innerHTML = MV.readoutHTML([[m("vec{w}"), m((t === 1 ? "" : t === -1 ? "-" : t) + "(1, -2, 1) = " + tup(w))], [m("vec{w} · vec{a}"), m(prodSrc(w, A))], [m("vec{w} · vec{c}"), m(prodSrc(w, Cc))]]);
    v2.draw();
  }
  // station 3
  function sel(){ return S.sel3.map(function(id){ return VEC3.filter(function(v){ return v.id === id; })[0]; }); }
  var CUBE = [];
  [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]].forEach(function(p, i, all){ all.forEach(function(q, j){ if (j > i && Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) === 1) CUBE.push([p, q]); }); });
  var v3 = view3d($("#p3-s3", host), { az:35, el:24,
    scene:function(){
      var items = CUBE.map(function(e){ return { t:"seg", p:e[0], q:e[1], color:ink2(), width:1.3, alpha:0.8 }; }), s = sel();
      if (s[0]) items.push({ t:"vec", v:s[0].v, color:pen(), name:"u" });
      if (s[1]) items.push({ t:"vec", v:s[1].v, color:f3(), name:"v" });
      if (s[0] && s[1]) { var d = dot(s[0].v, s[1].v); items.push(d === 0 ? { t:"right", a:s[0].v, b:s[1].v, s:0.22, color:ink() } : { t:"arc", a:s[0].v, b:s[1].v, r:0.42, label:"θ " + angTxt(angOf(s[0].v, s[1].v)), color:ink() }); }
      return { L:1.5, R:1.8, items:items };
    },
    describe:function(){ var s = sel(); return "A unit cube with a vertex at the origin" + (s[0] ? "; u = " + tupTxt(s[0].v) : "") + (s[1] ? ", v = " + tupTxt(s[1].v) + "; angle " + angVal(angOf(s[0].v, s[1].v)) : "") + "."; } });
  function paint3(){
    var s = sel(), ch = $("#p3-chips", host);
    MV.keepFocus(ch, function(){ ch.innerHTML = VEC3.map(function(v){ var on = S.sel3.indexOf(v.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-cv="' + v.id + '" data-k="cv' + v.id + '" aria-pressed="' + on + '">' + v.t + "</button>"; }).join(""); });
    var rows = [];
    if (s[0]) rows.push([m("vec{u}"), m(tup(s[0].v))]);
    if (s[1]) {
      var u = s[0].v, v = s[1].v;
      rows.push([m("vec{v}"), m(tup(v))], [m("vec{u} · vec{v}"), m(prodSrc(u, v))], [m("cos θ"), m(dot(u, v) + "/(" + rootSrc(dot(u, u)) + " · " + rootSrc(dot(v, v)) + ") = " + overRoot(dot(u, v), dot(u, u) * dot(v, v), false))], [m("θ"), angVal(angOf(u, v))]);
    } else rows.push(["", '<span class="muted">' + ST[2].pick + "</span>"]);
    $("#p3-r3", host).innerHTML = MV.readoutHTML(rows);
    v3.draw();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-st]"); if (!box) return;
    var id = box.dataset.st, dir = b.dataset.act === "next" ? 1 : b.dataset.act === "prev" ? -1 : 0;
    if (id === "s1" && dir) set1(S.i1 + dir);
    if (id === "s2" && dir) { S.t2 = (S.t2 + dir + TS.length) % TS.length; api.save(); paint2(); }
    if (b.dataset.cv) {
      var k = S.sel3.indexOf(b.dataset.cv);
      if (k >= 0) S.sel3.splice(k, 1); else { S.sel3.push(b.dataset.cv); if (S.sel3.length > 2) S.sel3.shift(); }
      api.save(); paint3();
    }
  });
  paint1(); paint2(); paint3();
  return {};
}

// ---------- Performance task: Square corner (V1 view of the three edges and the box they build) ----------
var task = (function(){
  var api, V3, A = [2, -1, 2];
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -4 && v <= 4 ? v : null; }
  function read(){
    var b = [gi("b0"), gi("b1"), gi("b2")], c = [gi("c0"), gi("c1"), gi("c2")], ok = b.concat(c).every(function(v){ return v !== null; });
    return { b:b, c:c, whole:ok, valid:ok && !isZero(b) && !isZero(c) };
  }
  function checks(d){
    if (!d.valid) return [false, false, false, false];
    return [dot(d.b, A) === 0, dot(d.c, A) === 0, dot(d.b, d.c) === 0, dot(d.b, d.b) === 9 && dot(d.c, d.c) === 9];
  }
  function scene(){
    var d = read(), items = [{ t:"vec", v:A, color:css("--pen"), name:"a" }], ink = css("--ink"), ink2 = css("--ink-2");
    if (d.whole) {
      var b = d.b, c = d.c;
      if (!isZero(b)) items.push({ t:"vec", v:b, color:css("--f3"), name:"b" });
      if (!isZero(c)) items.push({ t:"vec", v:c, color:css("--f5"), name:"c" });
      if (!isZero(b) && !isZero(c)) {
        var ab = ad3(A, b), ac = ad3(A, c), bc = ad3(b, c), abc = ad3(ab, c);
        [[A, ab], [A, ac], [b, ab], [b, bc], [c, ac], [c, bc], [ab, abc], [ac, abc], [bc, abc]].forEach(function(s){ items.push({ t:"seg", p:s[0], q:s[1], color:ink2, width:1.2, dash:[4, 4] }); });
        if (dot(A, b) === 0) items.push({ t:"right", a:A, b:b, s:0.5, color:ink });
        if (dot(A, c) === 0) items.push({ t:"right", a:A, b:c, s:0.5, color:ink });
        if (dot(b, c) === 0) items.push({ t:"right", a:b, b:c, s:0.5, color:ink });
      }
    }
    return { L:4, items:items };
  }
  function readout(){
    var d = read(), el = $("#sq-read"); if (!el) return;
    if (!d.whole) { el.innerHTML = MV.readoutHTML([["", '<span class="muted">Whole numbers from −4 to 4.</span>']]); return; }
    el.innerHTML = MV.readoutHTML([
      [m("vec{a} · vec{b}"), m(prodSrc(A, d.b))], [m("vec{a} · vec{c}"), m(prodSrc(A, d.c))], [m("vec{b} · vec{c}"), m(prodSrc(d.b, d.c))],
      [m("|vec{b}|, |vec{c}|"), m(rootSrc(dot(d.b, d.b))) + ", " + m(rootSrc(dot(d.c, d.c)))]]);
  }
  function row(k){
    return '<div class="dp-vrow"><span class="dp-vn m">' + m("vec{" + k + "}") + ' =</span><span class="m">(</span>' + [0, 1, 2].map(function(i){
      return '<input class="numin dp-st-in" type="number" min="-4" max="4" step="1" data-tk="' + k + i + '" data-k="sq' + k + i + '" aria-label="' + k + ", " + ["x", "y", "z"][i] + '-component (−4 to 4)" value="' + MV.esc(api.S[k + i]) + '">' + (i < 2 ? '<span class="m">,</span>' : ""); }).join("") + '<span class="m">)</span></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a;
      if (a.S.b0 == null) { a.S.b0 = "1"; a.S.b1 = "0"; a.S.b2 = "0"; a.S.c0 = "0"; a.S.c1 = "1"; a.S.c2 = "0"; }
      inp.innerHTML = '<p class="tiny" style="font-weight:700;margin:0 0 6px">' + m("vec{a} = (2, -1, 2)") + " is fixed. Choose the other two edges.</p>" + row("b") + row("c");
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot square dp-v" id="sq-plot" role="img" aria-label="The three edges"></canvas></div><p class="tiny muted dp-how">Drag the view, or focus it and use the arrow keys, to turn it.</p><dl class="read" id="sq-read" aria-live="polite" style="margin-top:10px"></dl>';
      V3 = view3d($("#sq-plot"), { az:40, el:24, scene:scene, describe:function(){
        var d = read(); if (!d.whole) return "a = (2, −1, 2).";
        return "a = (2, −1, 2), b = " + tupTxt(d.b) + ", c = " + tupTxt(d.c) + " and the box they build" + ["a·b", "a·c", "b·c"].filter(function(_, i){ return [dot(A, d.b), dot(A, d.c), dot(d.b, d.c)][i] === 0; }).map(function(s){ return "; " + s + " = 0"; }).join("") + ".";
      } });
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); V3.draw(); readout(); a.update(); });
      V3.draw(); readout();
    },
    read:read,
    valid:function(d){ return !d.whole ? "Type whole numbers from −4 to 4 in all six boxes." : !d.valid ? m("vec{b}") + " and " + m("vec{c}") + " must not be the zero vector." : true; },
    checks:checks,
    key:function(d){ return d.b.join(",") + "|" + d.c.join(","); },
    label:function(k){ var p = k.split("|"); return m("vec{b} = (" + p[0].split(",").join(", ") + ")") + ", " + m("vec{c} = (" + p[1].split(",").join(", ") + ")"); },
    text:function(k){ var p = k.split("|").map(function(s){ return s.split(",").map(Number); }); return "b = " + tupTxt(p[0]) + ", c = " + tupTxt(p[1]); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
