// MCV4U 59 Distance from a Point to a Plane: hero (a probe wanders over the intercept triangle and settles at the foot),
// Drop the perpendicular (Explore: V1 3D view with Slide / Formula / Parallel modes), Skew distance (Part 3: three N13
// stations, each beside its own 3D view), Beyond the formula (Practice 2, V8 coordinate boxes) and the
// "Two planes, one point" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
var D2R = Math.PI / 180, N = [2, 1, 2];   // π: 2x + y + 2z − 6 = 0

// Wide over-arrow for subscripted names such as vec{P_1P_2} (mcv4u.js only widens plain letter pairs).
(function(){
  var base = MV.m;
  MV.m = function(s){ return base(s).replace(/<span class="vec">((?:<i>[A-Za-z]<\/i>(?:<sub>\d<\/sub>)?){2,})<\/span>/g, '<span class="vec wide">$1</span>'); };
})();

function m(s){ return MV.m(s); }
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function scl(a, k){ return [a[0] * k, a[1] * k, a[2] * k]; }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function unit(a){ var l = len(a) || 1; return scl(a, 1 / l); }
function near(a, b, t){ return Math.abs(a - b) <= (t == null ? 1e-9 : t); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function tpl(s, a){ a = [].concat(a); return String(s).replace(/#(\d)/g, function(_, k){ return a[k - 1] != null ? a[k - 1] : ""; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mathFont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
// m() source of an exact coordinate (integers, halves, ninths …)
function cs(v){ var q = Q.of(v); if (!q) return num(v, 2); return (q.n < 0 ? "-" : "") + Math.abs(q.n) + (q.d > 1 ? "/" + q.d : ""); }
function ptSrc(p){ return "(" + p.map(cs).join(", ") + ")"; }
function ptTxt(p){ return MV.plain(m(ptSrc(p))); }
function par(v){ return v < 0 ? "(" + cs(v) + ")" : cs(v); }
// stacked fraction source for |a|/b in lowest terms
function fracSrc(a, b){ var q = Q.of(a, b); return q.d === 1 ? String(q.n) : "{" + Math.abs(q.n) + "}/{" + q.d + "}"; }
// exact √n / d (n ≥ 0 integer, d > 0 integer) as m() source
function surdSrc(n, d){
  if (!n) return "0";
  var a = 1, b = n; for (var f = 2; f * f <= b; f++) while (b % (f * f) === 0) { b /= f * f; a *= f; }
  var g = gcd(a, d); a /= g; d /= g;
  var top = b === 1 ? String(a) : (a === 1 ? "" : a) + "√" + b;
  return d === 1 ? top : "{" + top + "}/{" + d + "}";
}
// linear expression source: co = coefficients for vars ("x", "y", "z", "")
function linSrc(co, vars){
  var s = "";
  co.forEach(function(c, i){ if (!c) return; var v = vars[i], a = Math.abs(c), t = v && a === 1 ? v : a + v; s += s ? (c < 0 ? " - " : " + ") + t : (c < 0 ? "-" : "") + t; });
  return s || "0";
}
function planeSrc(n, D){ return linSrc([n[0], n[1], n[2], D], ["x", "y", "z", ""]) + " = 0"; }
function isDark(){
  var c = css("--paper") || "#fff", r, g, b, mm = /^#([0-9a-f]{6})$/i.exec(c);
  if (mm) { r = parseInt(mm[1].slice(0, 2), 16); g = parseInt(mm[1].slice(2, 4), 16); b = parseInt(mm[1].slice(4), 16); }
  else { var p = (c.match(/[\d.]+/g) || [255, 255, 255]).map(Number); r = p[0]; g = p[1]; b = p[2]; }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45;
}
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}

// =====================================================================================================================
// @component V1 view3d — orthographic 3D view (course plan V1), self-contained. make3d(canvas, o) draws through MV.Plot (so it
// redraws on resize and theme change); view3d(host, o) adds drag-to-rotate, arrow keys on the focused canvas (Shift = 30°
// steps) and preset views Isometric / Front (xz) / Side (yz) / Top (xy). o = { box (planes and lines are clipped to ±box),
// axis (positive axis length), neg (negative half length; dashed), fit (half-width of the view), center [x, y, z], az, el,
// scene() -> { planes:[{n, D, color, alpha, poly}], lines:[{p, m, color, width, dash}], segs:[{a, b, color, width, dash, alpha}],
// bands:[{a, b}] (projection: --hi band under a thin --ink arrow), arrows:[{a, b, color, width}], marks:[{at, u, v, s, color}]
// (right-angle marks), pts:[{p, r, color, label, guides, ring}], labels:[{p, text, color, dx, dy, font, align}], describe } }.
// Planes: fill at 14% (20% in dark mode), edge 1.5 px at 60%; axes --ink-2 with x, y, z at the positive ends; farther points
// are drawn fainter. The describe sentence becomes the canvas label for screen readers.
var VIEWS = [{ id:"iso", t:"Isometric", az:45, el:35.26 }, { id:"front", t:"Front (<i>xz</i>)", az:-90, el:0 }, { id:"side", t:"Side (<i>yz</i>)", az:0, el:0 }, { id:"top", t:"Top (<i>xy</i>)", az:-90, el:90 }];
var DEFVIEW = { az:-32, el:22 };
function clipPlane(n, D, B){
  var pts = [], c = [-B, B];
  for (var ax = 0; ax < 3; ax++) {
    var a1 = (ax + 1) % 3, a2 = (ax + 2) % 3;
    for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
      var p0 = [0, 0, 0], p1 = [0, 0, 0]; p0[ax] = -B; p1[ax] = B; p0[a1] = p1[a1] = c[i]; p0[a2] = p1[a2] = c[j];
      var f0 = dot(n, p0) + D, f1 = dot(n, p1) + D;
      if (f0 === f1 || f0 * f1 > 0) continue;
      var t = f0 / (f0 - f1); pts.push(add(p0, scl(sub(p1, p0), t)));
    }
  }
  var out = []; pts.forEach(function(p){ if (!out.some(function(q){ return len(sub(p, q)) < 1e-6; })) out.push(p); });
  if (out.length < 3) return [];
  var cen = scl(out.reduce(add, [0, 0, 0]), 1 / out.length), u = unit(sub(out[0], cen)), v = cross(unit(n), u);
  out.sort(function(p, q){ var a = sub(p, cen), b = sub(q, cen); return Math.atan2(dot(a, v), dot(a, u)) - Math.atan2(dot(b, v), dot(b, u)); });
  return out;
}
function clipLine(p, d, B){
  var t0 = -1e9, t1 = 1e9;
  for (var k = 0; k < 3; k++) {
    if (Math.abs(d[k]) < 1e-12) { if (Math.abs(p[k]) > B) return null; continue; }
    var a = (-B - p[k]) / d[k], b = (B - p[k]) / d[k]; if (a > b) { var t = a; a = b; b = t; }
    t0 = Math.max(t0, a); t1 = Math.min(t1, b);
  }
  return t0 < t1 ? [add(p, scl(d, t0)), add(p, scl(d, t1))] : null;
}
function make3d(canvas, o){
  var st = { az:o.az == null ? DEFVIEW.az : o.az, el:o.el == null ? DEFVIEW.el : o.el };
  var F = o.fit || 9, B = o.box || 6, A = o.axis || 7, NEG = o.neg == null ? A : o.neg, C = o.center || [0, 0, 0];
  var V = { xmin:-F, xmax:F, ymin:-F, ymax:F }, plot = new MV.Plot(canvas, V);
  function basis(){
    var a = st.az * D2R, e = st.el * D2R, ca = Math.cos(a), sa = Math.sin(a), ce = Math.cos(e), se = Math.sin(e);
    return { R:[-sa, ca, 0], U:[-ca * se, -sa * se, ce], W:[ca * ce, sa * ce, se] };
  }
  function paint(ctx, pl, sc){
    var bs = basis(), ink = css("--ink"), ink2 = css("--ink-2"), dark = isDark(), Rd = B * Math.sqrt(3);
    function P(p){ var q = sub(p, C); return [pl.X(dot(q, bs.R)), pl.Y(dot(q, bs.U))]; }
    function depth(p){ return dot(sub(p, C), bs.W); }
    function fade(p){ return clamp(0.55 + 0.45 * (depth(p) + Rd) / (2 * Rd), 0.45, 1); }
    function seg(a, b, col, w, dash, al){
      var A2 = P(a), B2 = P(b); ctx.save(); ctx.globalAlpha = al == null ? 1 : al; ctx.strokeStyle = col; ctx.lineWidth = w || 2;
      ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(A2[0], A2[1]); ctx.lineTo(B2[0], B2[1]); ctx.stroke(); ctx.restore();
    }
    function head(a, b, col, sz){
      var A2 = P(a), B2 = P(b), dx = B2[0] - A2[0], dy = B2[1] - A2[1], l = Math.hypot(dx, dy); if (l < 2) return;
      dx /= l; dy /= l; sz = Math.min(sz || 11, l * 0.6);
      ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(B2[0], B2[1]);
      ctx.lineTo(B2[0] - sz * dx - sz * 0.45 * dy, B2[1] - sz * dy + sz * 0.45 * dx); ctx.lineTo(B2[0] - sz * dx + sz * 0.45 * dy, B2[1] - sz * dy - sz * 0.45 * dx);
      ctx.closePath(); ctx.fill(); ctx.restore();
    }
    function text(x, y, s, col, font, align){
      ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
      var w = ctx.measureText(s).width, x0 = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
      ctx.globalAlpha = 0.85; ctx.fillStyle = css("--sheet") || css("--paper"); ctx.fillRect(x0 - 3, y - 10, w + 6, 20);
      ctx.globalAlpha = 1; ctx.fillStyle = col || ink; ctx.fillText(s, x, y); ctx.restore();
    }
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    // planes, farthest first
    (sc.planes || []).map(function(pn){ var poly = pn.poly || clipPlane(pn.n, pn.D, pn.box || B); return { pn:pn, poly:poly, d:poly.length ? depth(scl(poly.reduce(add, [0, 0, 0]), 1 / poly.length)) : 0 }; })
      .filter(function(x){ return x.poly.length >= 3; }).sort(function(a, b){ return a.d - b.d; })
      .forEach(function(x){
        var al = x.pn.alpha == null ? 1 : x.pn.alpha, pts = x.poly.map(P);
        ctx.beginPath(); pts.forEach(function(q, i){ if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.closePath();
        ctx.globalAlpha = al * (dark ? 0.2 : 0.14); ctx.fillStyle = x.pn.color; ctx.fill();
        ctx.globalAlpha = al * 0.6; ctx.strokeStyle = x.pn.color; ctx.lineWidth = 1.5; ctx.setLineDash([]); ctx.stroke(); ctx.globalAlpha = 1;
      });
    // axes
    if (!sc.noAxes) [[1, 0, 0, "x"], [0, 1, 0, "y"], [0, 0, 1, "z"]].forEach(function(a){
      var e = [a[0], a[1], a[2]];
      seg([0, 0, 0], scl(e, -NEG), ink2, 1.5, [5, 5]); seg([0, 0, 0], scl(e, A), ink2, 1.5); head(scl(e, A - 0.4), scl(e, A), ink2, 8);
      var L = P(scl(e, A + 0.7)); text(L[0], L[1], a[3], ink2, mathFont(15), "center");
    });
    (sc.lines || []).forEach(function(l){ var c = clipLine(l.p, l.m, l.box || B); if (c) seg(c[0], c[1], l.color, l.width || 2.4, l.dash); });
    (sc.segs || []).forEach(function(s){ seg(s.a, s.b, s.color, s.width, s.dash, s.alpha); });
    (sc.bands || []).forEach(function(b){ if (len(sub(b.b, b.a)) < 1e-6) return; seg(b.a, b.b, css("--hi"), 8, null, 0.9); seg(b.a, b.b, ink, 1.4); head(b.a, b.b, ink, 8); });
    (sc.arrows || []).forEach(function(r){ seg(r.a, r.b, r.color, r.width || 3); head(r.a, r.b, r.color, 12); });
    (sc.marks || []).forEach(function(k){ var s = k.s || 0.45, a = add(k.at, scl(k.u, s)), c = add(k.at, scl(k.v, s)), b = add(a, scl(k.v, s)); seg(a, b, k.color || ink2, 1.6); seg(b, c, k.color || ink2, 1.6); });
    (sc.pts || []).forEach(function(p){
      var q = P(p.p), al = fade(p.p);
      if (p.guides) { var g = css("--plot-axis") || ink2, f = [p.p[0], p.p[1], 0]; seg(p.p, f, g, 1, [3, 4], 0.7); seg(f, [p.p[0], 0, 0], g, 1, [3, 4], 0.7); seg(f, [0, p.p[1], 0], g, 1, [3, 4], 0.7); }
      ctx.save(); ctx.globalAlpha = al;
      if (p.ring) { ctx.strokeStyle = css("--hi"); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(q[0], q[1], (p.r || 6) + 4, 0, 2 * Math.PI); ctx.stroke(); }
      ctx.fillStyle = p.color || ink; ctx.beginPath(); ctx.arc(q[0], q[1], p.r || 6, 0, 2 * Math.PI); ctx.fill();
      if (p.open) { ctx.fillStyle = css("--sheet") || css("--paper"); ctx.beginPath(); ctx.arc(q[0], q[1], (p.r || 6) - 2.2, 0, 2 * Math.PI); ctx.fill(); }
      ctx.restore();
      if (p.label) text(q[0] + (p.dx == null ? 10 : p.dx), q[1] + (p.dy == null ? -14 : p.dy), p.label, p.lcolor || p.color || ink, mathFont(15), p.align || "left");
    });
    (sc.labels || []).forEach(function(l){ var q = P(l.p); text(q[0] + (l.dx || 0), q[1] + (l.dy || 0), l.text, l.color || ink, l.font || ui(13), l.align || "center"); });
    ctx.restore();
  }
  function draw(){
    var sc = o.scene();
    plot.draw({ view:V, equal:true, grid:false, axes:false, ticks:false, describe:sc.describe || o.aria || "3D view",
      after:function(ctx, pl){ paint(ctx, pl, sc); } });
  }
  plot.render = draw;
  return { st:st, draw:draw, plot:plot };
}
function view3d(host, o){
  host.innerHTML = '<div class="plot-wrap"><canvas class="plot square dp-cv" tabindex="0" role="img" aria-label="' + MV.esc(o.aria || "3D view") + '"></canvas></div>' +
    '<div class="dp-views" role="group" aria-label="Preset views">' + VIEWS.map(function(v){ return '<button type="button" class="btn ghost sm" data-view="' + v.id + '" data-k="v' + v.id + '">' + v.t + "</button>"; }).join("") + "</div>" +
    '<p class="tiny muted dp-rot">Drag the picture to rotate it, or tab to it and use the arrow keys (Shift + arrow for big steps).</p>';
  var cv = $("canvas", host), R = make3d(cv, o), drag = null;
  cv.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY, id:e.pointerId }; try { cv.setPointerCapture(e.pointerId); } catch (_) {} });
  cv.addEventListener("pointermove", function(e){
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
    R.st.az = (R.st.az - dx * 0.5) % 360; R.st.el = clamp(R.st.el + dy * 0.5, -90, 90); R.draw();
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function(ev){ cv.addEventListener(ev, function(){ drag = null; }); });
  cv.addEventListener("keydown", function(e){
    var s = e.shiftKey ? 30 : 5;
    if (e.key === "ArrowLeft") R.st.az = (R.st.az + s) % 360; else if (e.key === "ArrowRight") R.st.az = (R.st.az - s) % 360;
    else if (e.key === "ArrowUp") R.st.el = clamp(R.st.el + s, -90, 90); else if (e.key === "ArrowDown") R.st.el = clamp(R.st.el - s, -90, 90);
    else return;
    e.preventDefault(); R.draw();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-view]"); if (!b) return;
    var v = VIEWS.filter(function(x){ return x.id === b.dataset.view; })[0]; R.st.az = v.az; R.st.el = v.el; R.draw();
  });
  R.draw();
  return R;
}
// ------------------------------------------------------ end of view3d --------------------------------------------------------

// π: 2x + y + 2z − 6 = 0 helpers
function exprPi(p){ return dot(N, p) - 6; }
function footPi(p){ return sub(p, scl(N, exprPi(p) / 9)); }
function probe(s, t){ return [3 + s + t, -2 * t, -s]; }
var UIN = unit([1, 0, -1]), TRI = [[3, 0, 0], [0, 6, 0], [0, 0, 3]];

// ---------- hero: a probe wanders over the intercept triangle and settles at the foot F(1, 2, 1) ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var P = [3, 3, 3], F0 = [1, 2, 1], u = UIN, v = unit(cross(N, u)), st = { pa:0, pp:0, a:0, b:0, show:false, done:false };
  if (f.cap) f.cap.innerHTML = '<span class="dp-hcap">' + m("|9|/√9 = 3") + "</span>";
  function cap(on){ if (f.cap) f.cap.firstChild.style.opacity = on ? 1 : 0; }
  var R = make3d(cv, { box:6, axis:6.6, neg:1.2, fit:5.6, center:[1.4, 2.4, 1.5], az:-28, el:20, scene:function(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), f4 = css("--f4");
    var sc = { planes:[{ poly:TRI, color:pen, alpha:st.pa }], segs:[], arrows:[], marks:[], pts:[], labels:[] };
    TRI.forEach(function(p){ if (st.pa > 0.5) sc.labels.push({ p:p, text:ptTxt(p), color:ink2, dy:p[2] ? -14 : 16, font:ui(12) }); });
    if (st.pa > 0.5) { var a0 = [2, 1, 0.5]; sc.arrows.push({ a:a0, b:add(a0, scl(N, 0.6)), color:f4 }); sc.marks.push({ at:a0, u:unit(N), v:u, s:0.3, color:f4 }); sc.labels.push({ p:add(a0, scl(N, 0.6)), text:"n", color:f4, dx:12, dy:-4, font:mathFont(15) }); }
    if (st.pp > 0) {
      var Qp = add(F0, add(scl(u, st.a), scl(v, st.b))), d = len(sub(P, Qp));
      sc.segs.push({ a:P, b:Qp, color:ink, width:st.done ? 2.6 : 2, dash:st.done ? null : [6, 6], alpha:st.pp });
      if (st.done) sc.marks.push({ at:F0, u:unit(N), v:u, s:0.35, color:ink });
      sc.pts.push({ p:Qp, r:5, color:ink2, label:st.done ? "F" : "", dy:16 });
      sc.pts.push({ p:P, r:6, color:ink, label:"P(3, 3, 3)" });
      sc.labels.push({ p:scl(add(P, Qp), 0.5), text:st.done ? "3" : num(d, 2), dx:-22, color:ink, font:ui(14, 700) });
    }
    sc.describe = "3D view of the plane 2x + y + 2z − 6 = 0 as its intercept triangle (3, 0, 0), (0, 6, 0), (0, 0, 3), with the point P(3, 3, 3)" +
      (st.done ? ". The segment from P meets the plane at the foot F(1, 2, 1) at a right angle, along the normal; its length is 3." : ".");
    return sc;
  } });
  function finish(){ st.pa = 1; st.pp = 1; st.a = 0; st.b = 0; st.done = true; cap(true); R.draw(); }
  if (MV.reduceMotion) { finish(); return; }
  cap(false); R.draw();
  MV.wait(400, function(){
    MV.tween({ dur:800, step:function(t){ st.pa = t; R.draw(); }, done:function(){
      MV.tween({ dur:600, step:function(t){ st.pp = t; st.a = 1.25; st.b = 0; R.draw(); }, done:function(){
        MV.tween({ dur:4200, ease:function(t){ return t; }, step:function(t){
          var amp = 1.25 * (1 - t) * (1 - t); st.a = amp * Math.cos(t * 4.2 * Math.PI); st.b = amp * Math.sin(t * 6.4 * Math.PI); R.draw();
        }, done:function(){ MV.wait(250, finish); } });
      } });
    } });
  });
}

// ---------- Explore: Drop the perpendicular ----------
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, RW = T.rows, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function okInt(v, lo, hi){ return Number.isInteger(v) && v >= lo && v <= hi; }
  function okHalf(v, lo, hi){ return typeof v === "number" && Number.isInteger(v * 2) && v >= lo && v <= hi; }
  if (["slide", "formula", "parallel"].indexOf(S.mode) < 0) S.mode = "slide";
  if (!Array.isArray(S.P) || S.P.length !== 3 || !S.P.every(function(v){ return okInt(v, -6, 6); })) S.P = [3, 3, 3];
  if (!okHalf(S.s, -4, 4)) S.s = 0; if (!okHalf(S.t, -4, 4)) S.t = 0;
  if (!okInt(S.D2, -30, 30)) S.D2 = 6; if (!okHalf(S.lt, -5, 5)) S.lt = 0;
  S.x2 = !!S.x2; S.line = !!S.line; S.found = !!S.found; S.show = !!S.show;
  var busy = false, hide = false, band = 1, stopAnim = null;
  function sl(id, label, min, max, step, aria){
    return '<label class="slider dp-sl"><span class="slider-top"><span>' + label + '</span><output id="dp-' + id + '-o"></output></span>' +
      '<input type="range" id="dp-' + id + '" data-sl="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:var(--ink)" aria-label="' + MV.esc(aria) + '"></label>';
  }
  host.innerHTML = '<div class="dp-ex"><div class="dp-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><p class="eq-cap dp-eq" id="dp-eq"></p><div id="dp-v"></div></div>' +
    '<div class="dp-side"><div class="seg-wrap" id="dp-mode"></div><p class="tiny muted dp-how" id="dp-how"></p>' +
    '<p class="dp-h">' + T.pTitle + "</p>" + sl("px", m("x"), -6, 6, 1, "P, x-coordinate (−6 to 6)") + sl("py", m("y"), -6, 6, 1, "P, y-coordinate (−6 to 6)") + sl("pz", m("z"), -6, 6, 1, "P, z-coordinate (−6 to 6)") +
    '<p class="tiny muted dp-how">' + T.pHow + " Shift + arrow moves 3.</p>" +
    '<div id="dp-g-slide"><p class="dp-h">' + T.probe + "</p>" + sl("s", m("s"), -4, 4, 0.5, "Probe, parameter s (−4 to 4)") + sl("t", m("t"), -4, 4, 0.5, "Probe, parameter t (−4 to 4)") +
    '<p class="tiny muted dp-how">' + C.planeVec + "</p></div>" +
    '<div id="dp-g-par"><p class="dp-h">' + T.par + "</p>" + sl("d2", T.d2, -30, 30, 1, "D2 (−30 to 30)") +
    '<div class="dp-tg" id="dp-tg"></div><div id="dp-g-lt">' + sl("lt", T.lt, -5, 5, 0.5, "Point on the line, t (−5 to 5)") + "</div></div>" +
    '<div class="dp-acts" id="dp-acts"></div>' +
    '<dl class="read dp-read" id="dp-read" aria-live="polite"></dl><button type="button" class="btn ghost sm dp-more" id="dp-more" data-k="dpmore" aria-expanded="false">' + T.more + "</button></div></div>";
  var V3 = view3d($("#dp-v", host), { box:6, axis:7, neg:5, fit:9.6, center:[0.6, 1.2, 0.6], aria:"3D view of the plane and P", scene:scene });

  function Qcur(){ return S.mode === "formula" ? [3, 0, 0] : probe(S.s, S.t); }
  function isPar(){ var w = cross(sub(Qcur(), S.P), N); return len(w) < 1e-9 && len(sub(Qcur(), S.P)) > 1e-9; }
  function footOn(){ return S.found || S.show; }
  function scene(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), f3 = css("--f3"), f4 = css("--f4"), f5 = css("--f5");
    var P = S.P, E = exprPi(P), nh = unit(N), sc = { planes:[{ n:N, D:-6, color:pen }], lines:[], segs:[], bands:[], arrows:[], marks:[], pts:[], labels:[] }, words = [];
    var w = [-2, 4, 0];
    sc.labels.push({ p:add(scl(N, 2 / 3), w), text:"π", color:pen, font:mathFont(17) });
    TRI.forEach(function(p, i){ sc.segs.push({ a:p, b:TRI[(i + 1) % 3], color:pen, width:1, dash:[4, 4], alpha:0.8 }); });
    var a0 = [0, 0, 3]; sc.arrows.push({ a:a0, b:add(a0, N), color:f4 }); sc.marks.push({ at:a0, u:nh, v:UIN, s:0.45, color:f4 });
    sc.labels.push({ p:add(a0, N), text:"n", color:f4, dx:12, dy:-6, font:mathFont(15) });
    words.push("3D view of the plane π: 2x + y + 2z − 6 = 0 (blue) with its normal n = (2, 1, 2) in magenta, and the point P" + ptTxt(P) + ".");
    if (S.mode === "slide") {
      var Qp = Qcur(), pq = len(sub(P, Qp)), pa = isPar();
      sc.segs.push({ a:P, b:Qp, color:ink, width:pa ? 2.8 : 2, dash:pa ? null : [6, 6] });
      if (pa) sc.marks.push({ at:Qp, u:E >= 0 ? nh : scl(nh, -1), v:UIN, s:0.45, color:ink });
      sc.pts.push({ p:Qp, r:5.5, color:ink2, label:"Q", ring:!busy, dy:16 });
      if (!hide) sc.labels.push({ p:scl(add(P, Qp), 0.5), text:"|PQ| ≈ " + num(pq, 2), dx:-8, align:"right", font:ui(13, 700) });
      words.push("The probe Q" + MV.plain(m("(" + Qp.map(function(v){ return num(v, 2); }).join(", ") + ")")) + " is " + num(pq, 2) + " units from P" + (pa ? ", straight along the normal: Q is the foot." : "."));
    } else if (S.mode === "formula") {
      var Q0 = [3, 0, 0], sh = scl(N, (E / 9) * band);
      sc.arrows.push({ a:Q0, b:P, color:f3 });
      if (!hide && E) { sc.bands.push({ a:Q0, b:add(Q0, sh) }); if (band >= 1) sc.segs.push({ a:P, b:add(Q0, sh), color:ink2, width:1.2, dash:[3, 4] }); }
      sc.pts.push({ p:Q0, r:5.5, color:ink2, label:"Q", dy:16 });
      sc.labels.push({ p:scl(add(P, Q0), 0.5), text:"QP", color:f3, dx:14, font:mathFont(14), align:"left" });
      if (!hide) words.push("The vector QP from Q(3, 0, 0) is teal; its shadow on the normal has signed length " + MV.plain(m(fracSrc(E, 3))) + ", so P is " + MV.plain(m(fracSrc(Math.abs(E), 3))) + " units from π" + (E < 0 ? ", on the side opposite n." : E > 0 ? ", on the side n points to." : ": P is on the plane."));
    } else {
      var k = (-S.D2 - 6) / 9;
      sc.planes.push({ n:N, D:S.D2, color:f5 });
      var X2 = add(scl(N, -S.D2 / 9), w); if (Math.max(Math.abs(X2[0]), Math.abs(X2[1]), Math.abs(X2[2])) <= 6) sc.labels.push({ p:X2, text:S.x2 ? MV.plain(m(planeSrc([4, 2, 4], 2 * S.D2))) : MV.plain(m(planeSrc(N, S.D2))), color:f5, font:ui(12, 700) });
      if (!hide && k) {
        var shown = 0;
        [[1, 2, 1], [3, 0, 0], [0, 2, 2], [2, 2, 0], [0, 4, 1]].forEach(function(X){
          var Y = add(X, scl(N, k)); if (Math.max(Math.abs(Y[0]), Math.abs(Y[1]), Math.abs(Y[2])) > 6.01) return;
          sc.segs.push({ a:X, b:Y, color:ink2, width:1.6 });
          if (shown++ < 2) sc.labels.push({ p:scl(add(X, Y), 0.5), text:MV.plain(m(fracSrc(Math.abs(9 * k), 3))), dx:10, align:"left", font:ui(12, 700), color:ink2 });
        });
      }
      words.push("A second plane " + MV.plain(m(planeSrc(N, S.D2))) + " (orange) is parallel to π" + (hide ? "." : ", " + MV.plain(m(fracSrc(Math.abs(-6 - S.D2), 3))) + " units away."));
      if (S.line) {
        var X = [S.lt, 0, -S.lt], Fl = add(X, scl(N, 2 / 3));
        sc.lines.push({ p:[0, 0, 0], m:[1, 0, -1], color:f3, width:2.4 });
        sc.segs.push({ a:X, b:Fl, color:f3, width:2, dash:[5, 4] });
        sc.pts.push({ p:X, r:5.5, color:f3 });
        if (!hide) sc.labels.push({ p:scl(add(X, Fl), 0.5), text:"2", color:f3, dx:-10, align:"right", font:ui(13, 700) });
        words.push("The line r = t(1, 0, −1) (teal) runs parallel to π; its moving point is " + (hide ? "some distance" : "2 units") + " from π.");
      }
    }
    if (footOn() && S.mode !== "parallel") {
      var F = footPi(P);
      sc.pts.push({ p:F, r:4.5, color:ink, label:"F", dy:16, dx:8 });
      if (S.mode === "formula") sc.segs.push({ a:P, b:F, color:ink, width:1.6, dash:[2, 4] });
      words.push("The foot of the perpendicular is F" + ptTxt(F) + ".");
    }
    sc.pts.push({ p:P, r:6.5, color:ink, label:"P", guides:true });
    sc.describe = words.join(" ");
    return sc;
  }

  function distHTML(P){ var E = exprPi(P); return m("{|2" + "(" + cs(P[0]) + ") + " + par(P[1]) + " + 2(" + cs(P[2]) + ") - 6|}/{3} = " + Math.abs(E) + "/3" + (Math.abs(E) % 3 ? "" : " = " + Math.abs(E) / 3)); }
  function paintRead(){
    var P = S.P, E = exprPi(P), rows = [], H = T.hidden;
    rows.push([RW.pi, m("2x + y + 2z - 6 = 0") + ", " + m("vec{n} = (2, 1, 2)") + ", " + m("|vec{n}| = 3")]);
    if (S.mode === "slide") {
      var Qp = Qcur(), d = sub(P, Qp), n4 = Math.round(4 * dot(d, d)), pq = Math.sqrt(n4) / 2;
      rows.push([RW.p, m(ptSrc(P))]);
      rows.push([RW.q, m("(" + Qp.map(function(v){ return num(v, 2); }).join(", ") + ")")]);
      rows.push([RW.pq, hide ? H : m(surdSrc(n4, 2)) + (near(pq, Math.round(pq * 100) / 100, 1e-9) ? "" : " ≈ " + num(pq, 2))]);
      rows.push([RW.dot, m(String(E)) + ' <span class="tiny muted">(' + T.shadow + ")</span>"]);
      rows.push([RW.par, hide ? H : isPar() ? "<strong>" + T.yes + "</strong>" : T.no]);
      rows.push([RW.dist, footOn() && !hide ? distHTML(P) : '<span class="muted">' + T.footHidden + "</span>"]);
      rows.push([RW.foot, footOn() && !hide ? m(ptSrc(footPi(P))) : '<span class="muted">' + T.footHidden + "</span>"]);
    } else if (S.mode === "formula") {
      rows.push([RW.p, m(ptSrc(P))]);
      rows.push([RW.q0, m("(3, 0, 0)")]);
      rows.push([RW.qpv, m("vec{QP} = " + ptSrc(sub(P, [3, 0, 0])))]);
      rows.push([RW.dot, hide ? H : m(String(E)) + ": " + (E > 0 ? T.plus : E < 0 ? T.minus : T.zero)]);
      rows.push([RW.dist, hide ? H : distHTML(P)]);
      rows.push([RW.foot, footOn() && !hide ? m(ptSrc(footPi(P))) : '<span class="muted">' + T.footHidden + "</span>"]);
    } else {
      var two = S.x2 ? m(planeSrc([4, 2, 4], 2 * S.D2)) + (hide ? "" : "; " + T.halve + m(planeSrc(N, S.D2))) : m(planeSrc(N, S.D2));
      rows.push([RW.plane2, two]);
      var gap = Math.abs(-6 - S.D2);
      rows.push([RW.planes, hide ? H : m("|-6 - " + par(S.D2) + "|/3 = " + gap + "/3" + (gap % 3 ? "" : " = " + gap / 3)) + (gap ? "" : " (" + T.same + ")")]);
      rows.push([RW.p, m(ptSrc(P))]);
      rows.push([RW.pPi, m(fracSrc(Math.abs(E), 3))]);
      rows.push([RW.pP2, hide ? H : m(fracSrc(Math.abs(dot(N, P) + S.D2), 3))]);
      if (S.line) {
        rows.push([RW.line, m("vec{r} = t(1, 0, -1)") + "; " + T.lineNote]);
        rows.push([RW.lpt, m("(" + [S.lt, 0, -S.lt].map(function(v){ return num(v, 2); }).join(", ") + ")")]);
        rows.push([RW.lineD, hide ? H : "2 " + T.constant]);
      }
    }
    $("#dp-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function setSl(id, v, txt, vt){ var el = $("#dp-" + id, host); if (+el.value !== v) el.value = v; $("#dp-" + id + "-o", host).textContent = txt; el.setAttribute("aria-valuetext", vt || txt); }
  function paintCtl(){
    MV.keepFocus($("#dp-mode", host), function(){ $("#dp-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">' + T.mode + "</span>" + segBtns("mode", C.modes, S.mode, T.mode); });
    $("#dp-how", host).innerHTML = C.modeHow[S.mode];
    $("#dp-g-slide", host).hidden = S.mode !== "slide";
    $("#dp-g-par", host).hidden = S.mode !== "parallel";
    $("#dp-g-lt", host).hidden = !S.line;
    MV.keepFocus($("#dp-tg", host), function(){
      $("#dp-tg", host).innerHTML = '<button type="button" class="chip' + (S.x2 ? " on" : "") + '" data-tg="x2" data-k="tgx2" aria-pressed="' + S.x2 + '">' + T.x2 + "</button>" +
        '<button type="button" class="chip' + (S.line ? " on" : "") + '" data-tg="line" data-k="tgline" aria-pressed="' + S.line + '">' + T.line + "</button>";
    });
    MV.keepFocus($("#dp-acts", host), function(){ $("#dp-acts", host).innerHTML = S.mode === "parallel" ? "" : '<button type="button" class="btn ghost sm" data-act="show" data-k="dpshow"' + (footOn() ? " disabled" : "") + ">" + T.show + "</button>"; });
    var eq = m("π: 2x + y + 2z - 6 = 0");
    if (S.mode === "parallel") eq += '<span class="dp-eq2">' + m(S.x2 ? planeSrc([4, 2, 4], 2 * S.D2) : planeSrc(N, S.D2)) + "</span>";
    $("#dp-eq", host).innerHTML = eq;
    ["x", "y", "z"].forEach(function(c, i){ setSl("p" + c, S.P[i], num(S.P[i]), "P " + c + " = " + num(S.P[i]) + "; P" + ptTxt(S.P)); });
    var Qp = probe(S.s, S.t), qt = "Q(" + Qp.map(function(v){ return num(v, 2); }).join(", ") + ")";
    setSl("s", S.s, num(S.s, 2), "s = " + num(S.s, 2) + "; " + qt); setSl("t", S.t, num(S.t, 2), "t = " + num(S.t, 2) + "; " + qt);
    setSl("d2", S.D2, num(S.D2), "D2 = " + num(S.D2)); setSl("lt", S.lt, num(S.lt, 2), "t = " + num(S.lt, 2));
  }
  function paint(){ paintCtl(); paintRead(); V3.draw(); }
  function commit(){ api.save(); paint(); MV.changed(); }
  var BIG = { px:3, py:3, pz:3, s:2, t:2, d2:5, lt:2 };
  function setVal(k, v){
    if (k === "px" || k === "py" || k === "pz") { S.P[{ px:0, py:1, pz:2 }[k]] = clamp(Math.round(v), -6, 6); S.found = false; S.show = false; }
    else if (k === "s" || k === "t") { S[k] = clamp(Math.round(v * 2) / 2, -4, 4); if (isPar()) S.found = true; }
    else if (k === "d2") S.D2 = clamp(Math.round(v), -30, 30);
    else if (k === "lt") S.lt = clamp(Math.round(v * 2) / 2, -5, 5);
    commit();
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.sl; if (!k) return; if (busy) { paint(); return; } setVal(k, +e.target.value); });
  host.addEventListener("keydown", function(e){
    var k = e.target.dataset && e.target.dataset.sl; if (!k || !e.shiftKey || !/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return;
    e.preventDefault(); if (busy) return;
    var cur = k === "px" ? S.P[0] : k === "py" ? S.P[1] : k === "pz" ? S.P[2] : k === "d2" ? S.D2 : S[k];
    setVal(k, cur + (/Left|Down/.test(e.key) ? -1 : 1) * BIG[k]);
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.id === "dp-more") { var r = $("#dp-read", host), on = !r.classList.contains("dp-all"); r.classList.toggle("dp-all", on); b.setAttribute("aria-expanded", String(on)); b.textContent = on ? T.less : T.more; return; }
    if (busy || b.dataset.view) return;
    if (b.dataset.mode) { S.mode = b.dataset.mode; commit(); return; }
    if (b.dataset.tg) { S[b.dataset.tg] = !S[b.dataset.tg]; commit(); return; }
    if (b.dataset.act === "show") { S.show = true; commit(); }
  });
  paint();

  // ---- predictions ----
  var PSTART = {
    p1:{ mode:"slide", P:[3, 3, 3], s:0, t:0 },
    p2:{ mode:"formula", P:[0, 0, 0] },
    p3:{ mode:"parallel", P:[3, 3, 3], D2:3, x2:true, line:false },
    p4:{ mode:"parallel", P:[3, 3, 3], line:true, lt:-4, x2:false }
  };
  function tw(dur, step, cb){ stopAnim = MV.tween({ dur:dur, step:step, done:function(){ stopAnim = null; if (cb) cb(); } }); }
  // ---- challenges ----
  function chal(id){
    var M = MS[id], P = S.P, E = exprPi(P), at3 = P[0] === 3 && P[1] === 3 && P[2] === 3;
    if (id === "tc1") {
      if (S.mode !== "slide") return { ok:false, msg:M.mode };
      if (!at3) return { ok:false, msg:M.p };
      if (S.s === -1 && S.t === -1) return { ok:true };
      if (S.s === 0 && S.t === 0) return { ok:false, msg:M.start };
      if (Math.abs(S.s + 1) <= 0.5 && Math.abs(S.t + 1) <= 0.5) return { ok:false, msg:M.close };
      return { ok:false, msg:tpl(M.general, [num(len(sub(P, Qcur())), 2)]) };
    }
    if (id === "tc2") {
      if (S.mode !== "formula") return { ok:false, msg:M.mode };
      if (P[2] !== 0) return { ok:false, msg:M.z };
      if (E === -6) return { ok:true };
      if (E === 6) return { ok:false, msg:M.same };
      if (E === -2) return { ok:false, msg:M.num };
      return { ok:false, msg:tpl(M.general, [num(E), m(fracSrc(Math.abs(E), 3))]) };
    }
    if (id === "tc3") {
      if (S.mode !== "parallel") return { ok:false, msg:M.mode };
      if (!at3) return { ok:false, msg:M.p };
      if (S.D2 === -24) return { ok:true };
      if (S.D2 === -12) return { ok:false, msg:M.m12 };
      if (S.D2 === 12) return { ok:false, msg:M.p12 };
      if (S.D2 === 3) return { ok:false, msg:M.p3 };
      return { ok:false, msg:tpl(M.general, [m(fracSrc(Math.abs(15 + S.D2), 3))]) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stopAnim) { stopAnim(); stopAnim = null; }
        var st = PSTART[p.id] || PSTART.p1;
        busy = true; hide = true; band = 1;
        Object.keys(st).forEach(function(k){ S[k] = Array.isArray(st[k]) ? st[k].slice() : st[k]; });
        S.found = false; S.show = false; if (p.id === "p1") hide = false;
        paint();
      },
      run:function(p, done){
        function fin(){ busy = false; hide = false; band = 1; api.save(); paint(); MV.changed(); done(); }
        if (p.id === "p1") tw(1600, function(t){ S.s = -t; S.t = -t; paintRead(); V3.draw(); }, function(){ S.s = -1; S.t = -1; S.found = true; paint(); MV.wait(500, fin); });
        else if (p.id === "p2") { hide = false; band = 0; paint(); tw(1100, function(t){ band = t; V3.draw(); }, function(){ band = 1; paint(); MV.wait(600, fin); }); }
        else if (p.id === "p3") MV.wait(500, function(){ hide = false; paint(); MV.wait(900, function(){ S.x2 = false; paint(); MV.wait(900, fin); }); });
        else if (p.id === "p4") { hide = false; paint(); tw(2400, function(t){ S.lt = Math.round((-4 + 8 * t) * 2) / 2; paintCtl(); paintRead(); V3.draw(); }, function(){ S.lt = 4; paint(); MV.wait(400, fin); }); }
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Skew distance (three N13 stations, each beside a V1 view) ----------
function part3(host, api){
  var S = api.S, C = api.content, ST = C.stations, TX = C.txt || {};
  if (typeof S.lt2 !== "number" || S.lt2 < -3 || S.lt2 > 2) S.lt2 = 0;
  var idx = {}, views = {};
  host.innerHTML = ST.map(function(st){
    var extra = "";
    if (st.skip) extra += '<div class="dp-skip"><button type="button" class="btn ghost sm" data-skip="1" data-k="skip">' + st.skip.btn + '</button><div class="dp-skipfb" aria-live="polite"></div></div>';
    if (st.slide) extra += '<label class="slider dp-sl"><span class="slider-top"><span>' + st.slide + ' <span class="m"><i>t</i></span></span><output class="dp-lt2o"></output></span><input type="range" class="dp-lt2" min="-3" max="2" step="0.5" value="' + S.lt2 + '" style="accent-color:var(--ink)" aria-label="Point on L, parameter t (−3 to 2)"></label>';
    if (st.shelves) extra += '<p class="dp-shelf" hidden>' + st.shelves + "</p>";
    if (st.alg) extra += '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + st.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details>";
    return '<div class="part dp-st" data-st="' + st.id + '"><h3>' + st.title + "</h3><p>" + st.text + '</p><div class="dp-stg"><div class="dp-stl"><ol class="dp-steps" aria-live="polite"></ol><div class="dp-pl"></div>' + extra +
      '</div><div class="dp-str"><div class="dp-stv"></div></div></div></div>';
  }).join("");
  var pen = function(){ return css("--pen"); };
  function scene(id){
    var i = idx[id] || 0, st = ST.filter(function(s){ return s.id === id; })[0], ink = css("--ink"), ink2 = css("--ink-2"), f3 = css("--f3"), f4 = css("--f4"), f5 = css("--f5");
    var sc = { planes:[], lines:[], segs:[], bands:[], arrows:[], marks:[], pts:[], labels:[] }, n1 = [1, -2, 2], nh = unit(n1);
    if (id === "s1") {
      sc.planes.push({ n:n1, D:-3, color:pen() }, { n:[2, -4, 4], D:12, color:f5 });
      sc.labels.push({ p:[-2, 1, 3], text:"π₁", color:pen(), font:mathFont(16) }, { p:[-4, 1, 0], text:i >= 1 ? "π₂: x − 2y + 2z + 6 = 0" : "π₂: 2x − 4y + 4z + 12 = 0", color:f5, font:ui(12, 700) });
      var a0 = [1, 1, 2]; sc.arrows.push({ a:a0, b:add(a0, n1), color:f4 }); sc.labels.push({ p:add(a0, n1), text:"n", color:f4, dx:12, font:mathFont(15) });
      if (i >= 2) { sc.segs.push({ a:a0, b:[0, 3, 0], color:ink, width:2.4 }); sc.labels.push({ p:scl(add(a0, [0, 3, 0]), 0.5), text:"3", dx:-10, align:"right", font:ui(14, 700) }); }
      if (i >= 3) { sc.segs.push({ a:[3, 0, 0], b:[2, 2, -2], color:ink, width:2.4 }); sc.marks.push({ at:[2, 2, -2], u:nh, v:unit([2, 1, 0]), s:0.45, color:ink }); sc.pts.push({ p:[3, 0, 0], r:5, color:ink, label:"(3, 0, 0)", lcolor:ink }); sc.labels.push({ p:[2.5, 1, -1], text:"3", dx:12, align:"left", font:ui(14, 700) }); }
    } else if (id === "s2") {
      var X = [2 + 2 * S.lt2, 1, 3 - S.lt2], Fx = sub(X, scl(n1, 1 / 3));
      sc.planes.push({ n:n1, D:-3, color:pen() });
      sc.labels.push({ p:[-2, 1, 3], text:"π₁", color:pen(), font:mathFont(16) });
      sc.lines.push({ p:[2, 1, 3], m:[2, 0, -1], color:f3, width:2.6 }); sc.labels.push({ p:[-2, 1, 5], text:"L", color:f3, font:mathFont(16) });
      var a1 = [3, 0, 0]; sc.arrows.push({ a:a1, b:add(a1, n1), color:f4 }); sc.labels.push({ p:add(a1, n1), text:"n", color:f4, dx:12, font:mathFont(15) });
      sc.segs.push({ a:X, b:Fx, color:f3, width:2, dash:i >= 2 ? null : [5, 4] });
      sc.pts.push({ p:X, r:6, color:f3 });
      if (i >= 2) { sc.marks.push({ at:Fx, u:nh, v:unit([2, 0, -1]), s:0.35, color:ink }); sc.labels.push({ p:scl(add(X, Fx), 0.5), text:"d = 1", dx:12, align:"left", font:ui(13, 700) }); }
      if (i >= 1) sc.labels.push({ p:[4, 1, 2], text:"m · n = 0", color:ink2, dy:-22, font:ui(12, 700) });
    } else {
      var A1 = [4 / 3, 8 / 3, 8 / 3], A2 = [10 / 3, 2 / 3, 11 / 3], nn = [2, -2, 1];
      if (i >= 3) sc.planes.push({ n:nn, D:0, color:pen() }, { n:nn, D:-9, color:f3 });
      sc.lines.push({ p:[0, 0, 0], m:[1, 2, 2], color:pen(), width:2.8 }, { p:[2, 0, 5], m:[2, 1, -2], color:f3, width:2.8 });
      sc.labels.push({ p:[2.6, 5.2, 5.2], text:"L₁", color:pen(), font:mathFont(16) }, { p:[5, 1.5, 2], text:"L₂", color:f3, font:mathFont(16), dx:14 });
      sc.pts.push({ p:[0, 0, 0], r:5, color:pen(), label:"P₁", dy:16 }, { p:[2, 0, 5], r:5, color:f3, label:"P₂" });
      if (i >= 1) { sc.arrows.push({ a:[0, 0, 0], b:nn, color:f4 }); sc.labels.push({ p:nn, text:"n", color:f4, dx:12, font:mathFont(15) }); }
      if (i >= 2) sc.arrows.push({ a:[0, 0, 0], b:[2, 0, 5], color:ink, width:2.4 });
      if (i >= 3) { sc.bands.push({ a:[0, 0, 0], b:nn }); sc.segs.push({ a:A1, b:A2, color:ink, width:3 }); sc.marks.push({ at:A1, u:unit(nn), v:unit([1, 2, 2]), s:0.4, color:ink }); sc.labels.push({ p:scl(add(A1, A2), 0.5), text:"d = 3", dx:12, align:"left", font:ui(14, 700) }); }
    }
    sc.describe = MV.plain(st.say[Math.min(i, st.say.length - 1)]) + (id === "s2" ? " The point on L is " + ptTxt([2 + 2 * S.lt2, 1, 3 - S.lt2]) + ", 1 unit from π₁." : "");
    return sc;
  }
  ST.forEach(function(st){
    var box = $('[data-st="' + st.id + '"]', host), n = st.steps.length;
    idx[st.id] = 0;
    views[st.id] = view3d($(".dp-stv", box), { box:6, axis:7, neg:5, fit:st.id === "s3" ? 9 : 9.8, center:st.id === "s3" ? [1.5, 1.5, 2.5] : [0.5, 1, 0.5], aria:"3D view", scene:function(){ return scene(st.id); } });
    MV.player($(".dp-pl", box), { count:n + 1, interval:1800,
      label:function(i){ return i === 0 ? TX.ready || "Press Step to begin." : tpl(TX.stepOf || "Step #1 of #2", [i, n]); },
      render:function(i){
        idx[st.id] = i;
        $(".dp-steps", box).innerHTML = st.steps.map(function(t, j){ return j < i ? '<li class="' + (j === i - 1 ? "cur" : "") + '"><span class="sn">' + (j + 1) + ".</span><span>" + t + "</span></li>" : ""; }).join("");
        var sh = $(".dp-shelf", box); if (sh) sh.hidden = i < n;
        views[st.id].draw();
      } });
    var lt = $(".dp-lt2", box);
    if (lt) {
      var paintLt = function(){ $(".dp-lt2o", box).textContent = num(S.lt2, 2); lt.setAttribute("aria-valuetext", "t = " + num(S.lt2, 2) + ": point " + ptTxt([2 + 2 * S.lt2, 1, 3 - S.lt2]) + ", 1 unit from π₁"); };
      lt.addEventListener("input", function(){ S.lt2 = clamp(Math.round(+lt.value * 2) / 2, -3, 2); api.save(); paintLt(); views[st.id].draw(); });
      paintLt();
    }
    var sk = $("[data-skip]", box);
    if (sk) sk.addEventListener("click", function(){ $(".dp-skipfb", box).innerHTML = MV.fbHTML("bad", "<strong>✗ Not the right move.</strong> " + st.skip.fb); });
  });
  return {};
}

// ---------- Practice 2: Beyond the formula ----------
// @component V8 coordBoxes (adapted from MCV4U 13 pointBoxes) — labelled rows of exact-answer boxes: one number per row or a
// point (□, □, □); rows can be order-free (two values or two points in either order); named wrong states per row value
// ({v:[…], row}), a one-of-two message, an optional reason chip group, first-try scoring and three-level help.
function beyondAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null, ch:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q dp-bq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">N' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") +
      '</div><div class="dp-bin"></div><div class="dp-bch"></div><div class="dp-bcl"></div></div>';
  }).join("");
  function inp(it, k, label, x){ return '<input class="numin short" data-bx="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .dp-bin', host);
    var h = '<div class="dp-rows">' + it.rows.map(function(r, i){
      var lab = MV.plain(r.pre), body;
      if (r.n === 1) body = inp(it, "r" + i + "c0", lab, x);
      else body = '<span class="m">(</span>' + ["x", "y", "z"].map(function(c, j){ return inp(it, "r" + i + "c" + j, lab + ", " + c + "-coordinate", x); }).join('<span class="m">,</span>') + '<span class="m">)</span>';
      return '<span class="dp-row"><span class="dp-rl">' + r.pre + "</span>" + body + "</span>";
    }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
    if (it.choice) {
      var ce = $('[data-q="' + it.id + '"] .dp-bch', host);
      MV.keepFocus(ce, function(){
        ce.innerHTML = '<p class="tiny" style="font-weight:700;margin:10px 0 4px">' + it.choice.label + '</p><div class="dp-chs" role="group" aria-label="' + MV.esc(MV.plain(it.choice.label)) + '">' + it.choice.options.map(function(o, j){
          return '<button type="button" class="chip' + (x.ch === j ? " on" : "") + '" data-ch="' + j + '" data-k="' + it.id + "ch" + j + '" aria-pressed="' + (x.ch === j) + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
      });
    }
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .dp-bcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function eq(p, q){ return p.length === q.length && p.every(function(v, k){ return Math.abs(v - q[k]) < 1e-6; }); }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), rows = [], i, j;
    for (i = 0; i < it.rows.length; i++) {
      var vals = [], empty = 0, bad = false;
      for (j = 0; j < it.rows[i].n; j++) {
        var t = String(x.v["r" + i + "c" + j] || "").trim();
        if (!t) { empty++; continue; }
        var p = MV.parseNum(t); if (!p || p.length !== 1) bad = true; else vals.push(p[0]);
      }
      if (empty === it.rows[i].n) rows.push(null);
      else if (empty) return { err:it.rows[i].n > 1 ? TX.fillPt : TX.fill };
      else if (bad) return { err:TX.err };
      else rows.push(vals);
    }
    var filled = rows.filter(function(r){ return r; });
    if (!filled.length) return { err:TX.fill };
    var correct;
    if (it.unordered) { var used = []; correct = rows.every(function(r){ if (!r) return false; for (var k = 0; k < ans.length; k++) if (used.indexOf(k) < 0 && eq(r, ans[k])) { used.push(k); return true; } return false; }); }
    else correct = rows.every(function(r, k){ return r && eq(r, ans[k]); });
    if (correct) {
      if (!it.choice) return { ok:true };
      if (x.ch == null) return { err:TX.choose };
      var o = it.choice.options[x.ch];
      return MV.ok(o) ? { ok:true } : { ok:false, msg:TX.reason + " " + (o.fb || "") };
    }
    var W = it.wrong || [];
    for (i = 0; i < W.length; i++) { var w = W[i]; if (rows.some(function(r, k){ return r && (w.row == null || w.row === k) && eq(r, w.v); })) return { ok:false, msg:w.fb }; }
    var good = rows.filter(function(r, k){ return r && (it.unordered ? ans.some(function(q){ return eq(r, q); }) : eq(r, ans[k])); });
    if (filled.length < rows.length) return good.length === filled.length && it.one ? { ok:false, msg:it.one } : { err:TX.fill };
    if (it.unordered && filled.length === 2 && eq(filled[0], filled[1]) && it.one) return { ok:false, msg:it.one };
    if (good.length) return { ok:false, msg:TX.oneRight };
    return { ok:false, msg:it.fb || TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.ch != null) { x.ch = +b.dataset.ch; api.save(); paintIn(it); return; }
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

// ---------- Performance task: Two planes, one point ----------
var N2 = [1, -2, 2];
var task = (function(){
  var api, V;
  function L(){ return (MV.C && MV.C.task && MV.C.task.labels) || {}; }
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -5 && v <= 5 ? v : null; }
  function read(){ var x = gi("x"), y = gi("y"), z = gi("z"); return { x:x, y:y, z:z, valid:x !== null && y !== null && z !== null }; }
  function e1(d){ return 2 * d.x + d.y + 2 * d.z - 6; }
  function e2(d){ return d.x - 2 * d.y + 2 * d.z + 1; }
  function checks(d){ if (!d.valid) return [false, false, false]; var a = e1(d), b = e2(d); return [Math.abs(a) === 9, Math.abs(b) === 3, a < 0]; }
  function scene(){
    var d = read(), pen = css("--pen"), f3 = css("--f3"), ink = css("--ink");
    var sc = { planes:[{ n:N, D:-6, color:pen }, { n:N2, D:1, color:f3 }], segs:[], marks:[], pts:[], labels:[] };
    sc.labels.push({ p:[-1.5, 5, 2], text:"π₁", color:pen, font:mathFont(16) }, { p:[4, 4, 1.5], text:"π₂", color:f3, font:mathFont(16) });
    var words = "3D view of π₁: 2x + y + 2z − 6 = 0 (blue) and π₂: x − 2y + 2z + 1 = 0 (teal)";
    if (d.valid) {
      var P = [d.x, d.y, d.z], F1 = sub(P, scl(N, e1(d) / 9)), F2 = sub(P, scl(N2, e2(d) / 9));
      sc.segs.push({ a:P, b:F1, color:pen, width:2.2, dash:[5, 4] }, { a:P, b:F2, color:f3, width:2.2, dash:[5, 4] });
      sc.pts.push({ p:F1, r:3.5, color:pen }, { p:F2, r:3.5, color:f3 }, { p:P, r:6.5, color:ink, label:"P", guides:true });
      words += ", with P" + ptTxt(P) + ", " + MV.plain(m(fracSrc(Math.abs(e1(d)), 3))) + " units from π₁ and " + MV.plain(m(fracSrc(Math.abs(e2(d)), 3))) + " units from π₂.";
    } else words += ".";
    sc.describe = words;
    return sc;
  }
  function readout(){
    var d = read(), el = $("#dp-tread"), Lb = L(); if (!el) return;
    if (!d.valid) { el.innerHTML = MV.readoutHTML([["P", '<span class="muted">' + (Lb.invalid || "") + "</span>"]]); return; }
    var a = e1(d), b = e2(d);
    el.innerHTML = MV.readoutHTML([
      ["P", m("(" + d.x + ", " + d.y + ", " + d.z + ")")],
      [Lb.e1, m(String(a)) + " (" + (a < 0 ? Lb.sameO : a > 0 ? Lb.farO : Lb.onP) + ")"],
      [Lb.d1, m("|" + a + "|/3 = " + fracSrc(Math.abs(a), 3))],
      [Lb.e2, m(String(b))],
      [Lb.d2, m("|" + b + "|/3 = " + fracSrc(Math.abs(b), 3))]
    ]);
  }
  function stepper(k, lab){
    return '<div class="dp-tstep"><label for="dp-t' + k + '"><span class="m">' + lab + '</span> <span class="tiny muted">' + (L().range || "") + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="dpt' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="dp-t' + k + '" data-tk="' + k + '" type="number" min="-5" max="5" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="dpt' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  function upd(){ if (V) V.draw(); readout(); api.update(); }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.x == null) { a.S.x = "0"; a.S.y = "0"; a.S.z = "0"; }
      inp.innerHTML = '<p class="tiny" style="font-weight:700;margin:0">Point P</p>' + stepper("x", L().x || "x") + stepper("y", L().y || "y") + stepper("z", L().z || "z");
      pv.innerHTML = '<div class="dp-tv"></div><dl class="read" id="dp-tread" aria-live="polite" style="margin-top:10px"></dl>';
      V = view3d($(".dp-tv", pv), { box:6, axis:7, neg:5, fit:9.8, center:[0, 0, 0], aria:MV.plain(L().view || "3D view"), scene:scene });
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -5, 5)); $("#dp-t" + k).value = a.S[k];
        a.save(); upd();
      });
      readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : L().invalid || "Choose whole numbers from −5 to 5."; },
    checks:checks,
    key:function(d){ return d.x + "," + d.y + "," + d.z; },
    label:function(k){ var p = k.split(",").map(Number); return m("P(" + p.join(", ") + ")"); },
    text:function(k){ var p = k.split(",").map(Number); return "P" + ptTxt(p); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ beyond:beyondAct },
  task:task
});
})();
