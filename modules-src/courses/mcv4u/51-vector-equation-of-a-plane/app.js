// MCV4U 51 Vector Equation of a Plane: hero (a V1 3D scene weaving a plane from r⃗₀, a⃗ and b⃗), Plane weaver (Explore: V1 view3
// with V12 vector steppers in three modes, s and t sliders, grid / trace / r⃗₀ toggles, parallel-direction collapse, hinge reveal),
// Is the point on the plane? (Part 3: three stations on one 3D view), Build the equation and Plane puzzles (Practice 1–2: coefficient
// boxes judged by plane membership, not text) and the "Roof designer" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
var XYZ = ["x", "y", "z"], TAU = Math.PI * 2;

// ---------- vectors in R³ ----------
function add(p, q){ return [p[0] + q[0], p[1] + q[1], p[2] + q[2]]; }
function sub(p, q){ return [p[0] - q[0], p[1] - q[1], p[2] - q[2]]; }
function mul(k, p){ return [k * p[0], k * p[1], k * p[2]]; }
function dot(p, q){ return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; }
function cross(p, q){ return [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; }
function len(p){ return Math.sqrt(dot(p, p)); }
function zero(p){ return Math.abs(p[0]) < 1e-9 && Math.abs(p[1]) < 1e-9 && Math.abs(p[2]) < 1e-9; }
function same(p, q){ return zero(sub(p, q)); }
function par(p, q){ return zero(cross(p, q)); }
function unit(p){ var l = len(p); return l ? mul(1 / l, p) : [0, 0, 0]; }
function perp(d){ var u = unit(d); return Math.abs(u[0]) < 0.9 ? cross(d, [1, 0, 0]) : cross(d, [0, 1, 0]); }
function at(g, s, t){ return add(g.r0, add(mul(s, g.a), mul(t, g.b))); }
function arr3(v, d){ return (Array.isArray(v) && v.length === 3 && v.every(function(c){ return typeof c === "number" && isFinite(c); })) ? v.slice() : d.slice(); }
// m() sources and HTML
function vsrc(v){ return "(" + v.map(function(c){ return num(c, 2); }).join(", ") + ")"; }
function vtx(v){ return m(vsrc(v)); }
function vplain(v){ return "(" + v.map(function(c){ return num(c, 2); }).join(", ") + ")"; }
function linSrc(c0, terms){
  var out = Math.abs(c0) > 1e-9 ? num(c0, 2) : "";
  terms.forEach(function(tm){
    var k = Math.round(tm[0] * 100) / 100; if (!k) return;
    var body = (Math.abs(k) === 1 ? "" : num(Math.abs(k), 2)) + tm[1];
    out += out ? (k < 0 ? " - " : " + ") + body : (k < 0 ? "-" : "") + body;
  });
  return out || "0";
}
function paramHTML(g){ return XYZ.map(function(x, i){ return m(x + " = " + linSrc(g.r0[i], [[g.a[i], "s"], [g.b[i], "t"]])); }).join(", "); }
function eqHTML(g){
  return m("vec{r} = " + vsrc(g.r0) + " + s") + '<span class="pl-ca">' + vtx(g.a) + "</span>" + m(" + t") + '<span class="pl-cb">' + vtx(g.b) + "</span>";
}
// "b⃗ = 2a⃗" for parallel directions (names are m() sources)
function relSrc(a, b, an, bn){
  if (zero(a) && zero(b)) return an + " = " + bn + " = vec{0}";
  if (zero(b)) return bn + " = vec{0}";
  if (zero(a)) return an + " = vec{0}";
  var i = [0, 1, 2].filter(function(j){ return Math.abs(a[j]) > 1e-9; })[0], ks;
  if (Number.isInteger(a[i]) && Number.isInteger(b[i])) { var q = Q.of(b[i], a[i]); ks = q.d === 1 ? (q.n === 1 ? "" : q.n === -1 ? "-" : String(q.n)) : "(" + Q.txt(q) + ")"; }
  else ks = num(b[i] / a[i], 2);
  return bn + " = " + ks + an;
}
function isDark(){
  var t = document.documentElement.getAttribute("data-theme");
  if (t === "dark" || t === "light") return t === "dark";
  return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
}

// =====================================================================================================================
// @component V1 view3 — a 3D view on a canvas (MCV4U 51; for the Ch 8 lines-and-planes modules). Orthographic camera turned by
// yaw (about the z-axis) and pitch; z up; x toward the viewer's lower left in the isometric view. Axes to ±axis (negative halves
// dashed); planes {r0, a, b, color, alpha, grid, outline} clipped to the ±L box (Sutherland–Hodgman) with grid lines at whole-number
// s and t (the s = 0 and t = 0 lines in the direction colours); lines {p, d, color, width, dash} clipped to the box; segs {p, q, color,
// width, dash, arrow, alpha}; polys {pts, color, alpha}; pts {p, color, r, ring, label, dx, dy, align}; labels {p, text, color}.
// Grid lines fade with depth. Drag turns it (sideways: yaw, up/down: pitch), arrow keys turn 5° (Shift: 15°) when focused.
//   var v = view3(canvas, { L, fit, axis, yaw, pitch });  v.set(scene); v.draw(); v.view("iso"|"front"|"side"|"top"); v.turnTo(yaw, pitch)
//   scene.describe sets the canvas aria-label (G15). Colours are token names ("--pen"). Redraws on resize and theme change (MV.Plot).
//   viewBar(host, v) adds the Isometric · Front · Side · Top buttons.
var VIEWS = { iso:[45, 35.26], front:[0, 0], side:[90, 0], top:[-90, 90] };
function view3(canvas, o){
  o = o || {};
  var plot = new MV.Plot(canvas, { xmin:0, xmax:1, ymin:0, ymax:1 });
  var V = { yaw:o.yaw != null ? o.yaw : VIEWS.iso[0], pitch:o.pitch != null ? o.pitch : VIEWS.iso[1], L:o.L || 10, fit:o.fit || 8.5, axis:o.axis || 7, sc:{} };
  var R, U, D, k = 1, cx = 0, cy = 0;
  function basis(){
    var th = V.yaw * Math.PI / 180, ph = V.pitch * Math.PI / 180;
    R = [-Math.sin(th), Math.cos(th), 0];
    U = [-Math.cos(th) * Math.sin(ph), -Math.sin(th) * Math.sin(ph), Math.cos(ph)];
    D = [Math.cos(th) * Math.cos(ph), Math.sin(th) * Math.cos(ph), Math.sin(ph)];
  }
  function P(v){ return [cx + dot(v, R) * k, cy - dot(v, U) * k, dot(v, D)]; }
  function font(px, w){ return (w || 600) + " " + px + "px " + (css("--font-ui") || "sans-serif"); }
  function stroke(c, pts, col, w, dash, alpha){
    c.save(); c.strokeStyle = col; c.lineWidth = w || 2; c.globalAlpha = alpha == null ? 1 : alpha; c.lineCap = "round"; c.lineJoin = "round";
    if (dash) c.setLineDash(dash);
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); c.restore();
  }
  function head(c, a, b, col, size, alpha){
    var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy); if (l < 5) return;
    var ux = dx / l, uy = dy / l, s = size || 11;
    c.save(); c.fillStyle = col; c.globalAlpha = alpha == null ? 1 : alpha; c.beginPath(); c.moveTo(b[0], b[1]);
    c.lineTo(b[0] - ux * s - uy * s * 0.45, b[1] - uy * s + ux * s * 0.45); c.lineTo(b[0] - ux * s + uy * s * 0.45, b[1] - uy * s - ux * s * 0.45); c.closePath(); c.fill(); c.restore();
  }
  function text(c, str, x, y, align, col, px){
    c.save(); c.font = font(px || 13); c.textAlign = align || "left"; c.textBaseline = "middle"; c.lineJoin = "round";
    c.lineWidth = 4; c.strokeStyle = css("--sheet") || css("--paper"); c.strokeText(str, x, y); c.fillStyle = col; c.fillText(str, x, y); c.restore();
  }
  function fade(z, L){ return 0.55 + 0.45 * clamp((z + L * 1.8) / (L * 3.6), 0, 1); }
  function axes(c, dark){
    var A = V.sc.axis || V.axis, col = css("--plot-axis") || css("--ink-2"), ink2 = css("--ink-2");
    var O = P([0, 0, 0]);
    for (var i = 0; i < 3; i++) {
      var e = [0, 0, 0]; e[i] = 1;
      var pp = P(mul(A, e)), pn = P(mul(-A, e));
      stroke(c, [O, pn], col, 1.4, [4, 4], dark ? 0.6 : 0.5);
      stroke(c, [O, pp], col, 1.7);
      head(c, O, pp, col, 9);
      for (var j = 1; j < A; j++) {
        var q = P(mul(j, e)); c.save(); c.fillStyle = col; c.globalAlpha = j % 5 ? 0.6 : 1; c.beginPath(); c.arc(q[0], q[1], j % 5 ? 1.6 : 2.4, 0, TAU); c.fill(); c.restore();
        if (j === 5) { var l5 = P(add(mul(5, e), i === 2 ? [0, 0, 0] : [0, 0, -0.55])); text(c, "5", l5[0] + (i === 2 ? -9 : 0), l5[1], i === 2 ? "right" : "center", ink2, 11); }
      }
      var lp = P(mul(A + 0.75, e));
      c.save(); c.font = "italic 600 15px " + (css("--font-math") || "serif"); c.fillStyle = css("--ink"); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(XYZ[i], lp[0], lp[1]); c.restore();
    }
  }
  function plane(c, pl, L, dark){
    var poly = planePoly(pl, L); if (!poly) return;
    var col = css(pl.color || "--pen"), sp = poly.map(P), alpha = pl.alpha != null ? pl.alpha : (dark ? 0.18 : 0.14);
    c.save(); c.fillStyle = col; c.globalAlpha = alpha; c.beginPath(); c.moveTo(sp[0][0], sp[0][1]); for (var i = 1; i < sp.length; i++) c.lineTo(sp[i][0], sp[i][1]); c.closePath(); c.fill();
    if (pl.outline !== false) { c.globalAlpha = Math.min(1, alpha * 3.2); c.strokeStyle = col; c.lineWidth = 1.2; c.stroke(); }
    c.restore();
    if (!pl.grid) return;
    var gcol = css("--ink-2"), ga = dark ? 0.5 : 0.35, n = 0;
    [[pl.a, pl.b, "--f3"], [pl.b, pl.a, "--pen"]].forEach(function(q){
      for (var s = -40; s <= 40 && n < 140; s++) {
        var seg = clipLine(add(pl.r0, mul(s, q[0])), q[1], L); if (!seg) continue; n++;
        var a = P(seg[0]), b = P(seg[1]);
        if (s === 0 && pl.axes !== false) stroke(c, [a, b], css(q[2]), 1.8, null, 0.75);
        else stroke(c, [a, b], gcol, 1, null, ga * fade((a[2] + b[2]) / 2, L));
      }
    });
  }
  function draw(){
    if (!plot.ctx) return;
    plot.fit(); var c = plot.ctx, W = plot.W, H = plot.H; if (!W || !H) return;
    c.clearRect(0, 0, W, H);
    basis(); k = Math.min(W, H) / (2 * (V.sc.fit || V.fit)); cx = W / 2; cy = H / 2 + (V.sc.shift || 0) * k;
    var sc = V.sc || {}, dark = isDark(), L = sc.L || V.L;
    axes(c, dark);
    (sc.polys || []).forEach(function(pg){
      var sp = pg.pts.map(P); c.save(); c.fillStyle = css(pg.color || "--pen"); c.globalAlpha = pg.alpha != null ? pg.alpha : 0.14;
      c.beginPath(); c.moveTo(sp[0][0], sp[0][1]); for (var i = 1; i < sp.length; i++) c.lineTo(sp[i][0], sp[i][1]); c.closePath(); c.fill(); c.restore();
    });
    (sc.planes || []).forEach(function(pl){ plane(c, pl, L, dark); });
    (sc.lines || []).forEach(function(ln){ var seg = clipLine(ln.p, ln.d, L); if (seg) stroke(c, [P(seg[0]), P(seg[1])], css(ln.color || "--ink"), ln.width || 2, ln.dash, ln.alpha); });
    (sc.segs || []).forEach(function(sg){
      if (same(sg.p, sg.q)) return;
      var a = P(sg.p), b = P(sg.q), col = css(sg.color || "--ink");
      stroke(c, [a, b], col, sg.width || 2, sg.dash, sg.alpha);
      if (sg.arrow) head(c, a, b, col, (sg.width || 2) > 2.5 ? 12 : 10, sg.alpha);
    });
    (sc.pts || []).forEach(function(q){
      var s = P(q.p), r = q.r || 5;
      if (q.ring) { c.save(); c.strokeStyle = css("--hi"); c.lineWidth = 3.5; c.beginPath(); c.arc(s[0], s[1], r + 4, 0, TAU); c.stroke(); c.restore(); }
      c.save(); c.fillStyle = css(q.color || "--ink"); c.globalAlpha = q.alpha == null ? 1 : q.alpha; c.beginPath(); c.arc(s[0], s[1], r, 0, TAU); c.fill(); c.restore();
      if (q.label) text(c, q.label, s[0] + (q.dx != null ? q.dx : 10), s[1] + (q.dy != null ? q.dy : -12), q.align || "left", css(q.lc || "--ink"));
    });
    (sc.labels || []).forEach(function(q){ var s = P(q.p); text(c, q.text, s[0] + (q.dx || 0), s[1] + (q.dy || 0), q.align || "center", css(q.color || "--ink")); });
    if (sc.describe) canvas.setAttribute("aria-label", sc.describe);
  }
  plot.render = draw;
  function turn(dy, dp){ V.yaw = ((V.yaw + dy) % 360 + 360) % 360; V.pitch = clamp(V.pitch + dp, -89, 90); draw(); }
  canvas.setAttribute("tabindex", "0");
  var drag = null;
  canvas.addEventListener("pointerdown", function(e){ if (e.button) return; drag = { x:e.clientX, y:e.clientY }; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} });
  canvas.addEventListener("pointermove", function(e){ if (!drag) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; turn(-dx * 0.6, dy * 0.6); });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function(ev){ canvas.addEventListener(ev, function(){ drag = null; }); });
  canvas.addEventListener("keydown", function(e){
    var st = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") turn(st, 0); else if (e.key === "ArrowRight") turn(-st, 0);
    else if (e.key === "ArrowUp") turn(0, st); else if (e.key === "ArrowDown") turn(0, -st); else return;
    e.preventDefault();
  });
  return {
    set:function(sc){ V.sc = sc || {}; draw(); }, draw:draw,
    view:function(name){ var w = VIEWS[name]; if (w) { V.yaw = w[0]; V.pitch = w[1]; draw(); } },
    turnTo:function(y, p){ V.yaw = y; V.pitch = p; draw(); }
  };
}
function planePoly(pl, L){
  var n = cross(pl.a, pl.b); if (len(n) < 1e-9) return null; n = unit(n);
  var e1 = unit(pl.a), e2 = cross(n, e1), c0 = sub(pl.r0, mul(dot(pl.r0, n), n)), R = 2 * L * Math.sqrt(3);
  var poly = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(function(q){ return add(c0, add(mul(q[0] * R, e1), mul(q[1] * R, e2))); });
  for (var i = 0; i < 3; i++) { poly = clipHalf(poly, i, 1, L); poly = clipHalf(poly, i, -1, L); }
  return poly.length >= 3 ? poly : null;
}
function clipHalf(poly, i, sg, L){
  var out = [], n = poly.length;
  for (var j = 0; j < n; j++) {
    var cur = poly[j], prv = poly[(j + n - 1) % n], ci = sg * cur[i] <= L + 1e-9, pi = sg * prv[i] <= L + 1e-9;
    if (ci !== pi) { var t = (L - sg * prv[i]) / (sg * cur[i] - sg * prv[i]); out.push(add(prv, mul(t, sub(cur, prv)))); }
    if (ci) out.push(cur);
  }
  return out;
}
function clipLine(p, d, L){
  var lo = -Infinity, hi = Infinity;
  for (var i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-12) { if (Math.abs(p[i]) > L + 1e-9) return null; continue; }
    var t1 = (-L - p[i]) / d[i], t2 = (L - p[i]) / d[i];
    if (t1 > t2) { var tt = t1; t1 = t2; t2 = tt; }
    lo = Math.max(lo, t1); hi = Math.min(hi, t2);
  }
  if (!(hi > lo + 1e-9)) return null;
  return [add(p, mul(lo, d)), add(p, mul(hi, d))];
}
function viewBar(host, v){
  host.innerHTML = '<span class="seg" role="group" aria-label="View">' + [["iso", "Isometric"], ["front", "Front"], ["side", "Side"], ["top", "Top"]].map(function(q){
    return '<button type="button" data-view="' + q[0] + '" data-k="vw' + q[0] + '" aria-pressed="false">' + q[1] + "</button>"; }).join("") + "</span>";
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-view]"); if (b) v.view(b.dataset.view); });
}

// =====================================================================================================================
// @component V12 vecSteppers — rows "label (□, □, □)" of native number inputs with − / + buttons, whole numbers in [lo, hi]
// (MCV4U 51). vecRowsHTML(rows, get): rows = [{ k, lab (html), name (spoken), lo, hi }], get(k) -> [x, y, z].
// bindVec(host, rowsFn, get, set): clicks and typing call set(row, i, value) (return false to refuse; the input is reset).
// syncVec(host, get) writes the values back into the inputs.
function vecRowsHTML(rows, get){
  return rows.map(function(r){
    var v = get(r.k);
    return '<div class="pl-vrow" data-row="' + r.k + '"><span class="pl-vl">' + r.lab + '</span><span class="pl-vin"><span class="pl-br" aria-hidden="true">(</span>' + [0, 1, 2].map(function(i){
      var nm = MV.esc(r.name + ", " + XYZ[i] + "-component");
      return '<span class="pl-cmp"><button type="button" class="pl-pm" data-row="' + r.k + '" data-i="' + i + '" data-d="-1" data-k="' + r.k + i + 'm" aria-label="Decrease ' + nm + '">' + MINUS + "</button>" +
        '<input type="number" class="numin pl-n" data-row="' + r.k + '" data-i="' + i + '" data-k="' + r.k + i + 'n" min="' + r.lo + '" max="' + r.hi + '" step="1" value="' + v[i] + '" aria-label="' + nm + '">' +
        '<button type="button" class="pl-pm" data-row="' + r.k + '" data-i="' + i + '" data-d="1" data-k="' + r.k + i + 'p" aria-label="Increase ' + nm + '">+</button></span>' + (i < 2 ? '<span class="pl-cm" aria-hidden="true">,</span>' : "");
    }).join("") + '<span class="pl-br" aria-hidden="true">)</span></span></div>';
  }).join("");
}
function bindVec(host, rowsFn, get, set){
  function row(k){ return rowsFn().filter(function(r){ return r.k === k; })[0]; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button[data-d]"); if (!b || b.disabled) return;
    var r = row(b.dataset.row); if (!r) return;
    var i = +b.dataset.i, cur = get(r.k)[i], nv = clamp(cur + (+b.dataset.d), r.lo, r.hi);
    if (nv !== cur) set(r, i, nv);
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.matches || !t.matches("input.pl-n")) return;
    var r = row(t.dataset.row); if (!r) return;
    var s = t.value.trim(); if (!/^-?\d+$/.test(s)) return;
    var nv = +s, i = +t.dataset.i; if (nv < r.lo || nv > r.hi) return;
    if (nv !== get(r.k)[i] && set(r, i, nv) === false) t.value = get(r.k)[i];
  });
  host.addEventListener("change", function(e){
    var t = e.target; if (!t.matches || !t.matches("input.pl-n")) return;
    var r = row(t.dataset.row); if (!r) return;
    var i = +t.dataset.i, nv = Math.round(+t.value);
    if (t.value.trim() === "" || !isFinite(nv)) { t.value = get(r.k)[i]; return; }
    nv = clamp(nv, r.lo, r.hi);
    if (nv !== get(r.k)[i]) { if (set(r, i, nv) === false) t.value = get(r.k)[i]; }
    t.value = get(r.k)[i];
  });
}
function syncVec(host, get){
  $$("input.pl-n", host).forEach(function(t){ var v = get(t.dataset.row)[+t.dataset.i]; if (t.value.trim() === "" || +t.value !== v) t.value = v; });
}

// ---------- hero: r⃗₀, a⃗ grows, a thread of dots, b⃗ grows, the thread copies into a grid, the patch fills and turns ----------
function hero(f){
  var c = f.canvas; if (!c) return;
  var v = view3(c, { fit:6.4, axis:5, yaw:28, pitch:22, L:8 });
  var r0 = [1, 1, 1], a = [1, 0, 2], b = [0, 1, -1], h = { r0:0, aK:0, sN:0, bK:0, tN:0, sL:0, fill:0 };
  if (f.cap) f.cap.innerHTML = "Each grid point is " + m("vec{r}_0 + s vec{a} + t vec{b}") + " for whole-number " + m("s") + " and " + m("t") + ".";
  function pt(s, t){ return at({ r0:r0, a:a, b:b }, s, t); }
  function scene(){
    var sc = { polys:[], segs:[], pts:[], fit:6.4, axis:5, L:8 };
    if (h.fill > 0) sc.polys.push({ pts:[pt(-2, -2), pt(2, -2), pt(2, 2), pt(-2, 2)], color:"--pen", alpha:0.14 * h.fill });
    var i;
    for (i = 0; i < h.tN; i++) sc.segs.push({ p:pt(-2, -2 + i), q:pt(2, -2 + i), color:"--pen", width:1.6, alpha:0.85 });
    for (i = 0; i < h.sL; i++) sc.segs.push({ p:pt(-2 + i, -2), q:pt(-2 + i, 2), color:"--f3", width:1.6, alpha:0.85 });
    if (h.sN > 0) sc.segs.push({ p:pt(-2, 0), q:pt(-2 + h.sN - 1, 0), color:"--pen", width:2.4 });
    if (h.r0 > 0) sc.segs.push({ p:[0, 0, 0], q:mul(h.r0, r0), color:"--ink-2", width:1.8, dash:[6, 5], arrow:true });
    if (h.aK > 0) sc.segs.push({ p:r0, q:add(r0, mul(h.aK, a)), color:"--pen", width:3.4, arrow:true });
    if (h.bK > 0) sc.segs.push({ p:r0, q:add(r0, mul(h.bK, b)), color:"--f3", width:3.4, arrow:true });
    for (i = 0; i < h.sN; i++) sc.pts.push({ p:pt(-2 + i, 0), r:3.6, color:"--pen" });
    if (h.sL >= 5) for (var s = -2; s <= 2; s++) for (var t = -2; t <= 2; t++) if (t) sc.pts.push({ p:pt(s, t), r:2.6, color:"--ink-2" });
    if (h.r0 >= 1) sc.pts.push({ p:r0, r:5, color:"--ink", label:"(1, 1, 1)", dx:-10, dy:-12, align:"right" });
    sc.describe = "A 3D view. A point at (1, 1, 1)" + (h.aK > 0 ? ", a blue direction arrow (1, 0, 2)" : "") + (h.bK > 0 ? " and a teal direction arrow (0, 1, −1)" : "") +
      (h.fill >= 1 ? ". Grid lines at whole-number s and t from −2 to 2 fill a flat parallelogram of the plane." : ".");
    v.set(sc);
  }
  function fin(){ h = { r0:1, aK:1, sN:5, bK:1, tN:5, sL:5, fill:1 }; v.turnTo(58, 22); scene(); }
  if (MV.reduceMotion) { fin(); return; }
  scene();
  var steps = [
    [700, function(t){ h.r0 = t; }],
    [800, function(t){ h.aK = t; }],
    [1300, function(t){ h.sN = Math.min(5, Math.floor(t * 5.99)); }],
    [800, function(t){ h.bK = t; }],
    [1500, function(t){ h.tN = Math.min(5, Math.floor(t * 5.99)); }],
    [1200, function(t){ h.sL = Math.min(5, Math.floor(t * 5.99)); }],
    [700, function(t){ h.fill = t; }],
    [3600, function(t){ v.turnTo(28 + 30 * t, 22); }]
  ], i = 0;
  (function next(){
    if (i >= steps.length) return;
    var s = steps[i++];
    MV.tween({ dur:s[0], ease:function(t){ return t; }, step:function(t){ s[1](t); scene(); }, done:function(){ s[1](1); scene(); next(); } });
  })();
}

// ---------- Explore: Plane weaver ----------
var D0 = { mode:"pd", r0:[1, 1, 1], a:[1, 0, 2], b:[0, 1, -1], A:[1, 0, 0], B:[0, 2, 0], C:[0, 0, 2], p:[0, 1, 2], m:[1, -1, 1], Q:[2, 0, 5] };
var PRESETS = [{ id:"floor", t:"Floor", r0:[0, 0, 0], a:[1, 0, 0], b:[0, 1, 0] }, { id:"tilted", t:"Tilted", r0:[1, 1, 1], a:[1, 0, 2], b:[0, 1, -1] },
  { id:"collapse", t:"Collapse", r0:[0, 0, 0], a:[1, 2, 0], b:[2, 4, 0] }];
function colLab(cls, src){ return '<span class="' + cls + '">' + m(src) + "</span>"; }
var ROWS = {
  pd:[{ k:"r0", lab:m("vec{r}_0"), name:"r nought", lo:-5, hi:5 }, { k:"a", lab:colLab("pl-ca", "vec{a}"), name:"direction a", lo:-4, hi:4, dir:true },
    { k:"b", lab:colLab("pl-cb", "vec{b}"), name:"direction b", lo:-4, hi:4, dir:true }],
  pts:[{ k:"A", lab:"Point A", name:"point A", lo:-5, hi:5 }, { k:"B", lab:"Point B", name:"point B", lo:-5, hi:5 }, { k:"C", lab:"Point C", name:"point C", lo:-5, hi:5 }],
  lp:[{ k:"p", lab:"Line point " + m("vec{p}"), name:"line point p", lo:-5, hi:5 }, { k:"m", lab:"Line direction " + colLab("pl-ca", "vec{m}"), name:"line direction m", lo:-4, hi:4, dir:true },
    { k:"Q", lab:"Point Q", name:"point Q", lo:-5, hi:5 }]
};
var NAMES = { pd:["vec{a}", "vec{b}"], pts:["vec{AB}", "vec{AC}"], lp:["vec{m}", "vec{PQ}"] };
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (!ROWS[S.mode]) S.mode = "pd";
  Object.keys(D0).forEach(function(k){ if (k !== "mode") S[k] = arr3(S[k], D0[k]); });
  ["a", "b", "m"].forEach(function(k){ if (zero(S[k])) S[k] = D0[k].slice(); });
  S.s = typeof S.s === "number" ? clamp(S.s, -3, 3) : 0; S.t = typeof S.t === "number" ? clamp(S.t, -3, 3) : 0;
  if (S.grid === undefined) S.grid = true; if (S.sr0 === undefined) S.sr0 = true; S.trace = !!S.trace;
  S.trail = Array.isArray(S.trail) ? S.trail.filter(function(q){ return Array.isArray(q) && q.length === 3; }).slice(-60) : [];
  var busy = false, hinge = null, anim = null;

  host.innerHTML = '<div class="pl-ex"><div class="pl-colL"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot square pl-cv" role="img" aria-label="3D view of the plane"></canvas></div>' +
    '<p class="pl-warn" aria-live="polite"></p><div class="pl-views"></div>' +
    '<p class="tiny muted pl-turn">Drag the view, or select it and use the arrow keys, to turn it (Shift + arrows: 15°).</p>' +
    '<details class="pl-rdd" open><summary>Readout</summary><dl class="read pl-read" aria-live="polite"></dl></details></div>' +
    '<div class="pl-colR"><div class="pl-mode"></div><div class="chips pl-pre" role="group" aria-label="Presets"></div><div class="pl-vecs"></div><p class="pl-msg" role="status"></p>' +
    ["s", "t"].map(function(q){
      return '<label class="slider pl-sl"><span class="slider-top"><span>Parameter ' + m(q) + '</span><output class="pl-out" data-o="' + q + '" style="color:var(--ink)"></output></span>' +
        '<input type="range" class="pl-r" data-p="' + q + '" min="-3" max="3" step="0.5" style="accent-color:var(--ink)" aria-label="Parameter ' + q + ', from −3 to 3 in steps of 0.5"></label>';
    }).join("") +
    '<div class="chips pl-tog" role="group" aria-label="Show">' + [["grid", "Grid"], ["trace", "Trace"], ["sr0", "Show " + m("vec{r}_0")]].map(function(q){
      return '<button type="button" class="chip" data-tog="' + q[0] + '" data-k="tog' + q[0] + '" aria-pressed="false">' + q[1] + "</button>"; }).join("") + "</div></div></div>";
  var v = view3($("canvas", host), { fit:8.6, axis:7 });
  viewBar($(".pl-views", host), v);
  var vecs = $(".pl-vecs", host), msgEl = $(".pl-msg", host);
  var modeSeg = MV.seg($(".pl-mode", host), { label:"Build the plane from", value:S.mode,
    options:[{ id:"pd", t:"Point + two directions" }, { id:"pts", t:"Three points" }, { id:"lp", t:"Line + point" }],
    onChange:function(id){ if (busy) { modeSeg.set(S.mode); return; } S.mode = id; S.trail = []; msg(""); renderVecs(); after(); } });
  function get(k){ return S[k]; }
  function renderVecs(){ MV.keepFocus(vecs, function(){ vecs.innerHTML = vecRowsHTML(ROWS[S.mode], get); }); paintPre(); }
  function paintPre(){
    var pre = $(".pl-pre", host);
    if (S.mode !== "pd") { pre.innerHTML = ""; pre.hidden = true; return; }
    pre.hidden = false;
    MV.keepFocus(pre, function(){ pre.innerHTML = '<span class="tiny pl-pl">Presets</span>' + PRESETS.map(function(p){
      var on = same(S.r0, p.r0) && same(S.a, p.a) && same(S.b, p.b);
      return '<button type="button" class="chip' + (on ? " on" : "") + '" data-pre="' + p.id + '" data-k="pre' + p.id + '" aria-pressed="' + on + '">' + p.t + "</button>"; }).join(""); });
  }
  function msg(h){ msgEl.innerHTML = h || ""; }
  bindVec(vecs, function(){ return ROWS[S.mode]; }, get, function(row, i, val){
    if (busy) return false;
    var nv = S[row.k].slice(); nv[i] = val;
    if (row.dir && zero(nv)) { msg("A direction can’t be " + m("vec{0}") + "."); return false; }
    S[row.k] = nv; S.trail = []; msg(""); after(); return true;
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.p) return;
    if (busy) { t.value = S[t.dataset.p]; return; }
    S[t.dataset.p] = clamp(Math.round(+t.value * 2) / 2, -3, 3);
    if (S.trace) { var cur = at(geo(), S.s, S.t), last = S.trail[S.trail.length - 1]; if (!last || !same(last, cur)) { S.trail.push(cur); if (S.trail.length > 60) S.trail.shift(); } }
    after();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.tog) { if (busy) return; S[b.dataset.tog] = !S[b.dataset.tog]; if (b.dataset.tog === "trace") S.trail = S.trace ? [at(geo(), S.s, S.t)] : []; after(); return; }
    if (b.dataset.pre) {
      if (busy) return;
      var p = PRESETS.filter(function(q){ return q.id === b.dataset.pre; })[0];
      S.r0 = p.r0.slice(); S.a = p.a.slice(); S.b = p.b.slice(); S.trail = []; msg(""); after(); return;
    }
  });
  function geo(){
    if (S.mode === "pts") return { r0:S.A, a:sub(S.B, S.A), b:sub(S.C, S.A) };
    if (S.mode === "lp") return { r0:S.p, a:S.m, b:sub(S.Q, S.p) };
    return { r0:S.r0, a:S.a, b:S.b };
  }
  function warnTxt(){ return S.mode === "pts" ? "A, B and C are collinear: infinitely many planes contain them." : S.mode === "lp" ? "Q is on the line: infinitely many planes." : "These directions are parallel: you only get a line."; }
  function sceneEx(){
    var g = geo(), flat = !par(g.a, g.b), cur = at(g, S.s, S.t), sc = { planes:[], lines:[], segs:[], pts:[] };
    if (hinge != null && !zero(g.a)) {
      var e1 = unit(perp(g.a)), e2 = unit(cross(g.a, e1));
      sc.planes.push({ r0:g.r0, a:g.a, b:add(mul(Math.cos(hinge), e1), mul(Math.sin(hinge), e2)), color:"--pen" });
      sc.lines.push({ p:g.r0, d:g.a, color:"--pen", width:3 });
    } else if (flat) sc.planes.push({ r0:g.r0, a:g.a, b:g.b, color:"--pen", grid:S.grid });
    else { var dd = !zero(g.a) ? g.a : g.b; if (!zero(dd)) sc.lines.push({ p:g.r0, d:dd, color:"--pen", width:5 }); }
    if (S.mode === "lp") sc.lines.push({ p:S.p, d:S.m, color:"--ink", width:2.2 });
    if (S.sr0) sc.segs.push({ p:[0, 0, 0], q:g.r0, color:"--ink-2", width:1.8, dash:[6, 5], arrow:true });
    if (S.s) sc.segs.push({ p:g.r0, q:add(g.r0, mul(S.s, g.a)), color:"--pen", width:2, dash:[5, 4], arrow:true });
    if (S.t) sc.segs.push({ p:add(g.r0, mul(S.s, g.a)), q:cur, color:"--f3", width:2, dash:[5, 4], arrow:true });
    sc.segs.push({ p:g.r0, q:add(g.r0, g.a), color:"--pen", width:3.4, arrow:true });
    sc.segs.push({ p:g.r0, q:add(g.r0, g.b), color:"--f3", width:3.4, arrow:true });
    S.trail.forEach(function(q){ sc.pts.push({ p:q, r:3, color:"--ink-2" }); });
    if (S.mode === "pts") [["A", S.A], ["B", S.B], ["C", S.C]].forEach(function(q){ sc.pts.push({ p:q[1], r:4.5, color:"--ink", label:q[0], dx:-9, dy:-11, align:"right" }); });
    else if (S.mode === "lp") { sc.pts.push({ p:S.p, r:4.5, color:"--ink", label:"P", dx:-9, dy:-11, align:"right" }); sc.pts.push({ p:S.Q, r:4.5, color:"--ink", label:"Q", dx:-9, dy:-11, align:"right" }); }
    else sc.pts.push({ p:g.r0, r:4, color:"--ink-2" });
    sc.pts.push({ p:cur, r:5.5, color:"--ink", ring:true, label:(S.mode === "lp" ? "" : "P") + vplain(cur) });
    sc.describe = (flat ? "Plane through " + vplain(g.r0) + " with directions " + vplain(g.a) + " and " + vplain(g.b) + "." :
      "The directions " + vplain(g.a) + " and " + vplain(g.b) + " are parallel, so only a line through " + vplain(g.r0) + " is shown.") + " Current point " + vplain(cur) + ".";
    return sc;
  }
  function readout(){
    var g = geo(), cur = at(g, S.s, S.t), nm = NAMES[S.mode], flat = !par(g.a, g.b), rows = [];
    rows.push(["Vector equation", eqHTML(g)]);
    rows.push(["Parametric equations", paramHTML(g)]);
    rows.push(["Parameters", m("s = " + num(S.s, 1)) + ", " + m("t = " + num(S.t, 1))]);
    rows.push(["Current point", m((S.mode === "lp" ? "" : "P") + vsrc(cur))]);
    rows.push(["Directions", flat ? "Not parallel: they span a plane" : "Parallel: " + m(relSrc(g.a, g.b, nm[0], nm[1])) + ". Only a line."]);
    if (S.mode === "pts") rows.push(["Points", m("vec{r} = vec{OA} + s vec{AB} + t vec{AC}") + ". " + m("vec{AB} = " + vsrc(g.a)) + ", " + m("vec{AC} = " + vsrc(g.b)) + "; " +
      (flat ? "not collinear" : "A, B and C are collinear: infinitely many planes contain them.")]);
    if (S.mode === "lp") rows.push(["Line and point", "Line " + m("vec{r} = " + vsrc(S.p) + " + u" + vsrc(S.m)) + "; " + m("vec{PQ} = " + vsrc(g.b)) + (flat ? ", not parallel to " + m("vec{m}") : ": Q is on the line, so infinitely many planes contain them.")]);
    $(".pl-read", host).innerHTML = MV.readoutHTML(rows);
    $(".pl-warn", host).textContent = (!flat && hinge == null) ? warnTxt() : "";
  }
  function paint(){
    v.set(sceneEx()); readout();
    $$(".pl-r", host).forEach(function(r){ var q = r.dataset.p; if (+r.value !== S[q]) r.value = S[q]; r.disabled = busy; });
    $$(".pl-out", host).forEach(function(o){ o.textContent = num(S[o.dataset.o], 1); });
    $$("[data-tog]", host).forEach(function(b){ var on = !!S[b.dataset.tog]; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    syncVec(vecs, get); paintPre();
  }
  function after(){ api.save(); paint(); MV.changed(); }
  renderVecs(); paint();

  // ---- predictions ----
  function tw(dur, step, cb){
    anim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ step(t); paint(); }, done:function(){ anim = null; step(1); paint(); cb(); } });
  }
  function chal(id){
    var M = MS[id], g = geo(), cur = at(g, S.s, S.t);
    if (id === "tc1") {
      if (S.mode !== "pd" || !same(S.r0, [1, 2, 3]) || !same(S.a, [1, 0, 2]) || !same(S.b, [0, 1, -1])) return { ok:false, msg:M.set };
      if (S.s === 2 && S.t === -1) return { ok:true };
      if (S.s === -1 && S.t === 2) return { ok:false, msg:M.swap };
      if (S.s === 2 && S.t === 1) return { ok:false, msg:M.tpos };
      return { ok:false, msg:tpl(M.other, { p:vtx(cur) }) };
    }
    if (id === "tc2") {
      if (S.mode !== "pts" || !same(S.A, [1, 0, 0]) || !same(S.B, [0, 2, 0])) return { ok:false, msg:M.set };
      if (same(S.C, S.A) || same(S.C, S.B)) return { ok:false, msg:M.same };
      if (par(sub(S.B, S.A), sub(S.C, S.A))) return { ok:true };
      return { ok:false, msg:S.C[2] === 0 ? M.floor : M.off };
    }
    if (id === "tc3") {
      var n = [1, -1, 1];
      if (S.mode !== "pd") return { ok:false, msg:M.mode };
      if (same(S.r0, [1, 0, 2])) return { ok:false, msg:M.same };
      if (dot(n, S.r0) !== 3) { var s = S.r0[0] - 1, t = S.r0[1] - s; return { ok:false, msg:tpl(M.r0, { s:num(s), t:num(t), z:num(2 + t), z0:num(S.r0[2]) }) }; }
      var dirs = [S.a, S.b], i;
      for (i = 0; i < 2; i++) if (dot(n, dirs[i]) !== 0) return { ok:false, msg:tpl(M.dir, { d:vtx(dirs[i]) }) };
      if (par(S.a, S.b)) return { ok:false, msg:M.par };
      for (i = 0; i < 2; i++) if (par(dirs[i], [1, 1, 0]) || par(dirs[i], [0, 1, 1])) return { ok:false, msg:tpl(M.old, { d:vtx(dirs[i]) }) };
      return { ok:true };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        busy = true; hinge = null; S.trail = []; S.s = 0; S.t = 0; msg("");
        if (p.id === "p3") { S.mode = "pts"; S.A = [1, 1, 1]; S.B = [2, 3, 2]; S.C = [4, 7, 4]; }
        else { S.mode = "pd"; S.r0 = [0, 0, 0]; S.a = p.id === "p1" ? [1, 2, 0] : [1, 0, 0]; S.b = [0, 1, 0]; }
        modeSeg.set(S.mode); renderVecs(); api.save(); paint();
      },
      run:function(p, done){
        function fin(){ busy = false; hinge = null; anim = null; after(); done(); }
        if (p.id === "p1") tw(1800, function(t){ S.b = [2 * t, 1 + 3 * t, 0]; }, function(){
          S.b = [2, 4, 0]; tw(1600, function(t){ S.t = Math.round((-1.5 + 3 * t) * 2) / 2; }, function(){ MV.wait(700, fin); });
        });
        else if (p.id === "p2") tw(1900, function(t){ S.b = [t, 1, 0]; }, function(){ S.b = [1, 1, 0]; MV.wait(900, fin); });
        else if (p.id === "p3") tw(3600, function(t){ hinge = t < 1 ? TAU * t : null; }, function(){ hinge = null; paint(); MV.wait(700, fin); });
        else if (p.id === "p4") tw(1900, function(t){ S.r0 = [2 * t, 3 * t, 0]; }, function(){ S.r0 = [2, 3, 0]; MV.wait(900, fin); });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Is the point on the plane? (three stations on one 3D view) ----------
var G1 = { r0:[2, -1, 1], a:[1, 2, 0], b:[0, 1, 3] }, SA = [1, 2, 0], SB = [3, 2, 1], SC = [1, 4, -1];
function part3(host, api){
  var S = api.S, C = api.content, SL = C.stations;
  if (!/^s[123]$/.test(S.st)) S.st = "s1";
  if (S.pt !== "P" && S.pt !== "Q") S.pt = null;
  var s2 = S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {};
  s2.ab = arr3(s2.ab, [0, 0, 0]); s2.ac = arr3(s2.ac, [0, 0, 0]); s2.useA = !!s2.useA; s2.ok = !!s2.ok; s2.d = !!s2.d; s2.trap = !!s2.trap; s2.msg = s2.msg || "";
  S.onLine = !!S.onLine;
  var spin = null, ang = 0;
  host.innerHTML = '<div class="chips pl-stc" role="group" aria-label="Choose a station">' + SL.map(function(st){
    return '<button type="button" class="chip" data-stc="' + st.id + '" data-k="stc' + st.id + '" aria-pressed="false">' + st.chip + "</button>"; }).join("") + "</div>" +
    '<div class="pl-p3"><div class="pl-p3L"><p class="banner pl-p3b" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot square pl-cv" role="img" aria-label="3D view"></canvas></div>' +
    '<div class="pl-views"></div><p class="tiny muted pl-turn">Drag the view, or select it and use the arrow keys, to turn it.</p></div><div class="pl-p3R"></div></div>';
  var v = view3($("canvas", host), { fit:8.6, axis:7 });
  viewBar($(".pl-views", host), v);
  var RH = $(".pl-p3R", host), ban = $(".pl-p3b", host);
  function st(id){ return SL.filter(function(q){ return q.id === id; })[0]; }
  function algHTML(lines, cls){ return '<ol class="pl-alg">' + lines.map(function(l, i){ return '<li class="' + (cls[i] || "") + '">' + l + "</li>"; }).join("") + "</ol>"; }
  var ROWS2 = [{ k:"ab", lab:m("vec{AB}") + " =", name:"vector A B", lo:-5, hi:5 }, { k:"ac", lab:m("vec{AC}") + " =", name:"vector A C", lo:-5, hi:5 }];
  function get2(k){ return s2[k]; }
  function paintR(){
    var T = st(S.st), h = "<h3>" + T.title + "</h3><p>" + T.text + "</p>";
    if (S.st === "s1") {
      h += '<div class="chips" role="group" aria-label="Test point">' + T.tests.map(function(q){ var on = S.pt === q.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-pt="' + q.id + '" data-k="pt' + q.id + '" aria-pressed="' + on + '">' + q.t + "</button>"; }).join("") + "</div>";
      if (S.pt) {
        var q = T.tests.filter(function(x){ return x.id === S.pt; })[0], isP = S.pt === "P";
        h += '<dl class="read pl-sread">' + MV.readoutHTML([["Solve two", isP ? m("s = 1") + ", " + m("t = 2") : m("s = 2") + ", " + m("t = 1")], ["The plane reaches", m(isP ? "(3, 3, 7)" : "(4, 4, 4)")], ["Verdict", q.verdict]]) + "</dl>";
        h += '<details class="alg" open><summary>Check it with algebra</summary>' + algHTML(q.alg, ["pl-used", "pl-used", isP ? "pl-bad" : "pl-good"]) +
          '<p class="tiny muted">Highlighted: the two equations used to solve for ' + m("s") + " and " + m("t") + ". The third is the check.</p></details>";
      } else h += '<p class="muted">Choose a test point to see where the plane reaches.</p>';
    } else if (S.st === "s2") {
      h += '<div class="q-actions"><button type="button" class="btn ' + (s2.useA ? "ghost" : "primary") + ' sm" data-act="useA" data-k="s2useA" aria-pressed="' + s2.useA + '">' + T.useA + "</button>" +
        (s2.useA ? '<button type="button" class="btn ghost sm" data-act="trap" data-k="s2trap" aria-pressed="' + s2.trap + '">' + T.trap + "</button>" : "") + "</div>";
      if (s2.useA) {
        h += '<p class="pl-ok">' + m("vec{r}_0 = vec{OA} = (1, 2, 0)") + "</p>";
        if (s2.trap) h += MV.fbHTML("bad", T.trapNote);
        h += "<h4>" + T.build + '</h4><div class="pl-vecs2">' + vecRowsHTML(ROWS2, get2) + "</div>";
        if (!s2.ok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="chk" data-k="s2chk">' + T.check + "</button></div>" + (s2.msg ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s2.msg + " Try again.") : "");
        else {
          h += MV.fbHTML("good", T.ok) + '<dl class="read pl-sread">' + MV.readoutHTML([["Vector equation", T.eq], ["Parametric equations", T.par]]) + "</dl>";
          h += '<p class="pl-dq">' + T.dq + '</p><div class="q-actions"><button type="button" class="btn ' + (s2.d ? "ghost" : "primary") + ' sm" data-act="testD" data-k="s2d">' + T.dbtn + "</button></div>";
          if (s2.d) h += '<details class="alg" open><summary>Check it with algebra</summary>' + algHTML(T.dalg, ["pl-used", "pl-used", "pl-good"]) + "</details>" + MV.fbHTML("good", "✓ " + T.dverdict);
        }
      }
    } else {
      h += '<dl class="read pl-sread">' + MV.readoutHTML([["Second direction", S.onLine ? T.onLine : T.pq]]) + "</dl>";
      h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="onLine" data-k="s3tog" aria-pressed="' + S.onLine + '">' + T.toggle + "</button></div>";
    }
    MV.keepFocus(RH, function(){ RH.innerHTML = h; });
    $$("[data-stc]", host).forEach(function(b){ var on = b.dataset.stc === S.st; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
  }
  function draw(){
    var sc = { planes:[], lines:[], segs:[], pts:[], labels:[] }, d = "";
    ban.textContent = ""; ban.className = "banner pl-p3b";
    if (S.st === "s1") {
      sc.planes.push({ r0:G1.r0, a:G1.a, b:G1.b, color:"--pen", grid:true });
      sc.pts.push({ p:G1.r0, r:4, color:"--ink-2" });
      d = "Plane through (2, −1, 1) with directions (1, 2, 0) and (0, 1, 3).";
      if (S.pt === "P") {
        sc.segs.push({ p:[3, 3, 7], q:[3, 3, 3], color:"--hi", width:3, dash:[6, 5] });
        sc.pts.push({ p:[3, 3, 7], r:5, color:"--pen", label:"(3, 3, 7)" });
        sc.pts.push({ p:[3, 3, 3], r:5.5, color:"--ink", label:"P(3, 3, 3) ✗" });
        sc.labels.push({ p:[3, 3, 5], text:"gap 4", dx:-30 });
        d += " With s = 1 and t = 2 the plane reaches (3, 3, 7); P(3, 3, 3) is 4 units below it, so P is not on the plane.";
        ban.textContent = "✗ Not on the plane: z is off by 4."; ban.className = "banner bad pl-p3b";
      } else if (S.pt === "Q") {
        sc.pts.push({ p:[4, 4, 4], r:5.5, color:"--ink", ring:true, label:"Q(4, 4, 4) ✓" });
        d += " Q(4, 4, 4) lies on the plane with s = 2 and t = 1.";
        ban.textContent = "✓ On the plane: s = 2, t = 1."; ban.className = "banner good pl-p3b";
      }
    } else if (S.st === "s2") {
      [["A", SA], ["B", SB], ["C", SC]].forEach(function(q){ sc.pts.push({ p:q[1], r:4.5, color:"--ink", label:q[0] + vplain(q[1]) }); });
      d = "Points A(1, 2, 0), B(3, 2, 1) and C(1, 4, −1).";
      if (s2.useA) { sc.segs.push({ p:[0, 0, 0], q:SA, color:"--ink-2", width:1.8, dash:[6, 5], arrow:true }); }
      if (s2.trap) { sc.planes.push({ r0:SA, a:[3, 2, 1], b:[1, 4, -1], color:"--red", alpha:0.12 }); d += " Trap plane through A with directions (3, 2, 1) and (1, 4, −1): it misses B and C."; }
      if (s2.ok) { sc.planes.push({ r0:SA, a:[2, 0, 1], b:[0, 2, -1], color:"--pen", grid:true }); d += " Plane r = (1, 2, 0) + s(2, 0, 1) + t(0, 2, −1)."; }
      if (s2.useA && !zero(s2.ab)) sc.segs.push({ p:SA, q:add(SA, s2.ab), color:"--pen", width:3.2, arrow:true });
      if (s2.useA && !zero(s2.ac)) sc.segs.push({ p:SA, q:add(SA, s2.ac), color:"--f3", width:3.2, arrow:true });
      if (s2.d) { sc.pts.push({ p:[5, 6, 0], r:5.5, color:"--ink", ring:true, label:"D(5, 6, 0) ✓" }); d += " D(5, 6, 0) is on the plane."; }
    } else {
      var P0 = [0, 1, 2], M0 = [1, -1, 1], Qp = S.onLine ? [1, 0, 3] : [2, 0, 5], PQ = sub(Qp, P0);
      sc.lines.push({ p:P0, d:M0, color:"--ink", width:2.6 });
      if (!S.onLine) sc.planes.push({ r0:P0, a:M0, b:PQ, color:"--pen", grid:true });
      else {
        var e1 = unit(perp(M0)), e2 = unit(cross(M0, e1));
        (MV.reduceMotion ? [0, Math.PI / 3, 2 * Math.PI / 3] : [ang]).forEach(function(th){ sc.planes.push({ r0:P0, a:M0, b:add(mul(Math.cos(th), e1), mul(Math.sin(th), e2)), color:"--pen", alpha:MV.reduceMotion ? 0.1 : null }); });
        ban.textContent = st("s3").banner; ban.className = "banner bad pl-p3b";
      }
      sc.segs.push({ p:P0, q:add(P0, M0), color:"--pen", width:3.2, arrow:true });
      if (!S.onLine) sc.segs.push({ p:P0, q:Qp, color:"--f3", width:3.2, arrow:true });
      sc.pts.push({ p:P0, r:4.5, color:"--ink", label:"P(0, 1, 2)", dx:-10, align:"right" });
      sc.pts.push({ p:Qp, r:5, color:"--ink", label:"Q" + vplain(Qp) });
      d = S.onLine ? "Line through (0, 1, 2) with direction (1, −1, 1) and the point Q(1, 0, 3) on it: many planes contain them." :
        "Line through (0, 1, 2) with direction (1, −1, 1), point Q(2, 0, 5) and the plane r = (0, 1, 2) + s(1, −1, 1) + t(2, −1, 3).";
    }
    sc.describe = d;
    v.set(sc);
  }
  function stopSpin(){ if (spin) { spin(); spin = null; } }
  function startSpin(){
    stopSpin(); ang = 0;
    if (MV.reduceMotion) return;
    spin = MV.tween({ dur:6000, ease:function(t){ return t; }, step:function(t){ ang = TAU * t; draw(); }, done:function(){ spin = null; ang = 0; draw(); } });
  }
  function show(){ paintR(); draw(); }
  bindVec(RH, function(){ return S.st === "s2" && s2.useA && !s2.ok ? ROWS2 : []; }, get2, function(row, i, val){
    var nv = s2[row.k].slice(); nv[i] = val; s2[row.k] = nv; s2.msg = ""; api.save(); draw(); syncVec($(".pl-vecs2", RH) || RH, get2); return true;
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.stc) { stopSpin(); S.st = b.dataset.stc; api.save(); show(); return; }
    if (b.dataset.pt) { S.pt = b.dataset.pt; api.save(); show(); return; }
    var a = b.dataset.act; if (!a) return;
    var T = st(S.st);
    if (a === "useA") { s2.useA = true; }
    else if (a === "trap") { s2.trap = !s2.trap; }
    else if (a === "chk") {
      var ab = s2.ab, ac = s2.ac, okB = same(ab, [2, 0, 1]), okC = same(ac, [0, 2, -1]);
      if (okB && okC) { s2.ok = true; s2.msg = ""; }
      else {
        var pre = okB ? m("vec{AB}") + " is right. " : okC ? m("vec{AC}") + " is right. " : "";
        s2.msg = pre + (same(ab, SB) ? T.msgs.pos : same(ac, SC) ? T.msgs.posC : (same(ab, [-2, 0, -1]) || same(ac, [0, -2, 1])) ? T.msgs.rev : T.msgs.other);
      }
    }
    else if (a === "testD") { s2.d = true; }
    else if (a === "onLine") { S.onLine = !S.onLine; if (S.onLine) startSpin(); else stopSpin(); }
    api.save(); show();
    if (a === "chk") MV.focusFb(RH);
  });
  show();
  return {};
}

// ---------- Practice 1–2: coefficient boxes judged by plane membership (V12), number boxes, chips and a direction vector ----------
function pnum(s){ var p = MV.parseNum(String(s == null ? "" : s)); return p && p.length === 1 ? p[0] : NaN; }
var FIELDS = ["r0", "a", "b"];
function boxAct(host, api, a){
  var S = api.S; S.it = S.it && typeof S.it === "object" ? S.it : {};
  var TX = a.msgs || {}, msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null, pick:null }); }
  function item(id){ return a.items.filter(function(z){ return z.id === id; })[0]; }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it, i){
    return '<div class="q pl-q" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") +
      '</div><div class="pl-in"></div><div class="pl-cl"></div></div>';
  }).join("");
  function box(it, key, aria){
    var x = ist(it.id), val = x.v[key] != null ? x.v[key] : "";
    return '<input class="numin pl-bx" data-bx="' + key + '" data-k="' + it.id + key + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(aria) + '" value="' + MV.esc(val) + '"' + (x.solved ? " disabled" : "") + ">";
  }
  function triple(it, f, nm){ return "(" + [0, 1, 2].map(function(i){ return box(it, f + i, nm + ", " + XYZ[i] + "-component"); }).join(", ") + ")"; }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .pl-in', host), h = "";
    if (it.kind === "eq" && it.form === "param") {
      h = '<div class="pl-eqb">' + XYZ.map(function(c, i){
        return '<div class="pl-eqr"><span class="pl-eql">' + m(c + " =") + "</span>" + box(it, "r0" + i, c + " constant term") + m("+") + box(it, "a" + i, c + ", coefficient of s") + m("s +") + box(it, "b" + i, c + ", coefficient of t") + m("t") + "</div>";
      }).join("") + "</div>";
    } else if (it.kind === "eq") {
      h = '<div class="pl-eqb"><div class="pl-eqr"><span class="pl-eql">' + m("vec{r} =") + "</span>" + triple(it, "r0", "r nought") + "</div>" +
        '<div class="pl-eqr"><span class="pl-eql">' + m("+ s") + "</span>" + triple(it, "a", "first direction") + "</div>" +
        '<div class="pl-eqr"><span class="pl-eql">' + m("+ t") + "</span>" + triple(it, "b", "second direction") + "</div></div>";
    } else if (it.kind === "num") {
      h = '<label class="pl-nb"><span>' + it.label + "</span>" + box(it, "v", MV.plain(it.label).replace(/\s*=\s*$/, "") || "Answer") + "</label>";
    } else if (it.kind === "vec") {
      h = '<div class="pl-eqr"><span class="pl-eql">' + it.label + "</span>" + triple(it, "b", "direction b") + "</div>";
    } else if (it.kind === "chips") {
      h = '<div class="chips pl-chs" role="group" aria-label="Answer choices">' + it.options.map(function(o, i){
        var on = x.pick === i, cls = "chip" + (on ? " on" : "");
        return '<button type="button" class="' + cls + '" data-pick="' + i + '" data-k="' + it.id + "c" + i + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .pl-cl', host), h = "";
    if (!x.solved) h += '<div class="q-actions">' + (it.kind !== "chips" ? '<button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' : "") + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) {
      var shown = it.kind === "eq" ? "One accepted answer: " + it.display + "." : it.kind === "vec" ? (it.why || "") + " Other answers: " + it.display + "." : it.kind === "chips" ? (it.why || "") : it.display + ". " + (it.why || "");
      h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + shown + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judgeEq(it, x){
    var g = {}, bad = false;
    FIELDS.forEach(function(f){ g[f] = [0, 1, 2].map(function(i){ var v = pnum(x.v[f + i]); if (!isFinite(v)) bad = true; return v; }); });
    if (bad) return { err:TX.empty };
    if (zero(g.a) || zero(g.b)) return { ok:false, msg:TX.zero };
    var A = MV.ans(it), n = cross(A.a, A.b), tol = 1e-9;
    var onP = Math.abs(dot(n, sub(g.r0, A.r0))) < tol, aIn = Math.abs(dot(n, g.a)) < tol, bIn = Math.abs(dot(n, g.b)) < tol, np = !par(g.a, g.b);
    if (onP && aIn && bIn && np) return { ok:true };
    var W = it.wrong || [];
    for (var i = 0; i < W.length; i++) {
      var w = W[i];
      if (w.coef && g[FIELDS[w.coef[1]]][w.coef[0]] === w.coef[2]) return { ok:false, msg:w.fb };
      if (w.dir && ((par(g.a, w.dir) && !aIn) || (par(g.b, w.dir) && !bIn))) return { ok:false, msg:w.fb };
      if (w.r0 && same(g.r0, w.r0)) return { ok:false, msg:w.fb };
      if (w.par && !np) return { ok:false, msg:w.fb };
      if (w.r0off && !onP) return { ok:false, msg:w.fb };
    }
    if (!np) return { ok:false, msg:TX.par };
    if (!onP) return { ok:false, msg:tpl(TX.r0, { p:vtx(g.r0) }) };
    return { ok:false, msg:tpl(TX.dir, { d:vtx(!aIn ? g.a : g.b) }) };
  }
  function judge(it){
    var x = ist(it.id);
    if (it.kind === "eq") return judgeEq(it, x);
    if (it.kind === "num") {
      var raw = String(x.v.v || "").trim(); if (!raw) return { err:TX.empty };
      var val = pnum(raw); if (!isFinite(val)) return { err:TX.err };
      if (Math.abs(val - MV.ans(it)) < 1e-9) return { ok:true };
      var W = it.wrong || [];
      for (var i = 0; i < W.length; i++) if (Math.abs(val - W[i].v) < 1e-9) return { ok:false, msg:W[i].fb };
      return { ok:false, msg:it.wrongDefault || "Check your working." };
    }
    if (it.kind === "vec") {
      var b = [0, 1, 2].map(function(j){ return pnum(x.v["b" + j]); }), M = it.msgs || {};
      if (b.some(function(q){ return !isFinite(q); })) return { err:TX.vempty };
      if (b.some(function(q){ return q !== Math.round(q) || q < -4 || q > 4; })) return { err:M.range };
      if (zero(b)) return { ok:false, msg:M.zero };
      var A = MV.ans(it);
      if (Math.abs(dot(A.n, b)) > 1e-9) return { ok:false, msg:M.off };
      if (par(b, A.not)) return { ok:false, msg:M.par };
      return { ok:true };
    }
    return { ok:false };
  }
  function record(it, r, q){
    var x = ist(it.id);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  }
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.bx) return;
    var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save();
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return;
    var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = item(q.dataset.q), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.pick != null && it.kind === "chips") {
      var k = +b.dataset.pick, o = it.options[k]; x.pick = k;
      paintIn(it);
      record(it, MV.ok(o) ? { ok:true } : { ok:false, msg:o.why }, q);
      return;
    }
    if (b.dataset.act === "check") record(it, judge(it), q);
  });
  return {
    stats:function(){
      var f = 0, d = 0;
      a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") };
    },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Roof designer ----------
var task = (function(){
  var api, v3, R1 = [0, 0, 4], R2 = [6, 0, 4], E = [0, 2, 2], X = [1, 0, 0];
  var TR = [{ k:"r0", lab:m("vec{r}_0"), name:"r nought", lo:-5, hi:5 }, { k:"a", lab:colLab("pl-ca", "vec{a}"), name:"direction a", lo:-5, hi:5 },
    { k:"b", lab:colLab("pl-cb", "vec{b}"), name:"direction b", lo:-5, hi:5 }];
  function read(){ var s = api ? api.S : {}; return { r0:arr3(s.r0, [0, 0, 0]), a:arr3(s.a, [1, 0, 0]), b:arr3(s.b, [0, 1, 0]) }; }
  function draw(){
    if (!v3) return;
    var d = read(), sc = { planes:[], lines:[], segs:[], pts:[] }, flat = !par(d.a, d.b);
    if (flat) sc.planes.push({ r0:d.r0, a:d.a, b:d.b, color:"--pen", grid:true });
    else { var dd = !zero(d.a) ? d.a : d.b; if (!zero(dd)) sc.lines.push({ p:d.r0, d:dd, color:"--pen", width:5 }); }
    sc.segs.push({ p:R1, q:R2, color:"--ink", width:3.4 });
    sc.segs.push({ p:R1, q:E, color:"--ink-2", width:1.6, dash:[5, 4] });
    sc.segs.push({ p:d.r0, q:add(d.r0, d.a), color:"--pen", width:3.2, arrow:true });
    sc.segs.push({ p:d.r0, q:add(d.r0, d.b), color:"--f3", width:3.2, arrow:true });
    sc.pts.push({ p:d.r0, r:4.5, color:"--ink-2", label:"r₀", dx:8, dy:14 });
    [["R₁", R1, -10, "right"], ["R₂", R2, 10, "left"], ["E", E, 10, "left"]].forEach(function(q){ sc.pts.push({ p:q[1], r:5.5, color:"--ink", label:q[0], dx:q[2], align:q[3] }); });
    sc.describe = "Roof preview: ridge from R₁(0, 0, 4) to R₂(6, 0, 4), eave point E(0, 2, 2)" + (flat ? ", and your plane through " + vplain(d.r0) + " with directions " + vplain(d.a) + " and " + vplain(d.b) + "." : ". Your directions are parallel, so only a line is shown.");
    v3.set(sc);
  }
  function readout(){
    var el = $("#pl-tread"); if (!el) return;
    var d = read();
    el.innerHTML = MV.readoutHTML([["Your equation", eqHTML(d)], ["Parametric equations", paramHTML(d)]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; var S = a.S;
      S.r0 = arr3(S.r0, [0, 0, 0]); S.a = arr3(S.a, [1, 0, 0]); S.b = arr3(S.b, [0, 1, 0]);
      inp.innerHTML = '<p class="how">Set ' + m("vec{r}_0") + ", " + m("vec{a}") + " and " + m("vec{b}") + " (whole numbers from −5 to 5).</p>" + '<div class="pl-vecs">' + vecRowsHTML(TR, function(k){ return a.S[k]; }) + "</div>";
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot square pl-cv" role="img" aria-label="Roof preview"></canvas></div><div class="pl-views"></div><dl class="read" id="pl-tread" aria-live="polite" style="margin-top:10px"></dl>';
      v3 = view3($("canvas", pv), { fit:7.6, axis:7, yaw:35, pitch:24 });
      viewBar($(".pl-views", pv), v3);
      bindVec($(".pl-vecs", inp), function(){ return TR; }, function(k){ return a.S[k]; }, function(row, i, val){
        var nv = a.S[row.k].slice(); nv[i] = val; a.S[row.k] = nv; a.save(); draw(); readout(); syncVec(inp, function(k){ return a.S[k]; }); a.update(); return true;
      });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return (zero(d.a) || zero(d.b)) ? "A direction can’t be " + m("vec{0}") + "." : true; },
    checks:function(d){
      var n = cross(d.a, d.b), l1 = !zero(n);
      return [l1,
        l1 && dot(sub(R1, d.r0), n) === 0 && dot(sub(R2, d.r0), n) === 0,
        l1 && dot(sub(E, d.r0), n) === 0,
        !par(d.a, X) && !par(d.b, X),
        !same(d.r0, R1) && !same(d.r0, R2) && !same(d.r0, E)];
    },
    key:function(d){ return [d.r0, d.a, d.b].map(function(q){ return q.join(","); }).join("|"); },
    label:function(k){ var p = k.split("|").map(function(q){ return q.split(",").map(Number); }); return eqHTML({ r0:p[0], a:p[1], b:p[2] }); },
    text:function(k){ var p = k.split("|").map(function(q){ return "(" + q.split(",").map(function(c){ return num(+c); }).join(", ") + ")"; }); return "r = " + p[0] + " + s" + p[1] + " + t" + p[2]; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ build:boxAct, puzzles:boxAct },
  task:task
});
})();
