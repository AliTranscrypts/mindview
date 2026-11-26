// MCV4U 56 Intersection of Two Planes: hero (V1 3D view: two planes appear, their line draws itself, the normals and
// n₁ × n₂ grow from it), Two-plane hinge (Explore: V1 view with Hinge, Build and Scale modes, normals and cross-product
// toggles, a live readout of the configuration, a point and the line), Find the line (Part 3: three N13 step stations with
// their own 3D views and a Compare overlay), Find the line set (Practice 2: V12 line entry with equivalence checking) and
// the "Horizontal crease" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
var PI = Math.PI, DEG = PI / 180;
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
function sgn(v){ return String(v).replace("-", MINUS); }

// ---------- vectors ----------
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function scl(a, k){ return [a[0] * k, a[1] * k, a[2] * k]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function unit(a){ var l = len(a); return l ? scl(a, 1 / l) : a; }
function isZero(a, tol){ tol = tol || 1e-9; return Math.abs(a[0]) < tol && Math.abs(a[1]) < tol && Math.abs(a[2]) < tol; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function reduce(v){ var g = gcd(gcd(v[0], v[1]), v[2]) || 1; return v.map(function(x){ return x / g + 0; }); }

// ---------- formatting (m() source) ----------
function qv(x){ return typeof x === "number" ? Q.of(x) : x; }
function cSrc(x){ var q = qv(x); return (q.n < 0 ? "-" : "") + Math.abs(q.n) + (q.d > 1 ? "/" + q.d : ""); }
function vSrc(v){ return "(" + v.map(cSrc).join(", ") + ")"; }
function termSrc(x, v, first){
  var q = qv(x); if (!q.n) return "";
  var a = Math.abs(q.n), body = (v && a === 1 && q.d === 1) ? "" : (q.d > 1 ? "{" + a + "}/{" + q.d + "}" : String(a));
  body += v;
  return first ? (q.n < 0 ? "-" : "") + body : (q.n < 0 ? " - " : " + ") + body;
}
function lhsSrc(c){ var s = ""; ["x", "y", "z"].forEach(function(v, i){ s += termSrc(c[i], v, s === ""); }); return s; }
function planeSrc(c){ var s = lhsSrc(c); s += termSrc(c[3], "", s === ""); return (s || "0") + " = 0"; }
function sysSrc(n, d){ return (lhsSrc(n) || "0") + " = " + cSrc(d); }

// ---------- two planes {n:[A, B, C], d} meaning n · r = d ----------
// exact (integer planes): the case, n₁ × n₂, and a point from z = 0, then x = 0, then y = 0 (the first 2 × 2 that is solvable)
function meet(P, R){
  if (isZero(P.n) || isZero(R.n)) return { kind:"bad" };
  var mm = cross(P.n, R.n);
  if (isZero(mm)) { var i = P.n[0] ? 0 : P.n[1] ? 1 : 2; return { kind:R.d * P.n[i] === P.d * R.n[i] ? "coin" : "par", m:mm }; }
  var T = [[2, 0, 1], [0, 1, 2], [1, 0, 2]];
  for (var j = 0; j < 3; j++) {
    var a = T[j][1], b = T[j][2], det = P.n[a] * R.n[b] - P.n[b] * R.n[a];
    if (!det) continue;
    var pq = [Q.of(0), Q.of(0), Q.of(0)];
    pq[a] = Q.of(P.d * R.n[b] - P.n[b] * R.d, det); pq[b] = Q.of(P.n[a] * R.d - P.d * R.n[a], det);
    return { kind:"line", m:mm, pq:pq, p:pq.map(Q.val), zv:"xyz".charAt(T[j][0]), zi:j };
  }
  return { kind:"bad" };
}
// float version for drawing: p is the point of the line nearest the origin
function meetF(P, R){
  if (isZero(P.n, 1e-12) || isZero(R.n, 1e-12)) return { kind:"bad" };
  var mm = cross(P.n, R.n), L2 = dot(mm, mm), s = len(P.n) * len(R.n);
  if (L2 < 1e-12 * s * s) return { kind:isZero(sub(scl(R.n, P.d), scl(P.n, R.d)), 1e-7 * Math.max(1, s)) ? "coin" : "par", m:mm };
  return { kind:"line", m:mm, p:scl(cross(sub(scl(R.n, P.d), scl(P.n, R.d)), mm), 1 / L2) };
}
function foot(P){ return scl(P.n, P.d / dot(P.n, P.n)); }
function isDark(){
  var c = (css("--sheet") || "#fff").trim(), mm, r, g, b;
  if ((mm = /^#([0-9a-f]{3})$/i.exec(c))) c = "#" + mm[1].split("").map(function(h){ return h + h; }).join("");
  if ((mm = /^#([0-9a-f]{6})/i.exec(c))) { var v = parseInt(mm[1], 16); r = v >> 16; g = v >> 8 & 255; b = v & 255; }
  else if ((mm = /(\d+)\D+(\d+)\D+(\d+)/.exec(c))) { r = +mm[1]; g = +mm[2]; b = +mm[3]; } else return false;
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
}
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}

// =====================================================================================================================
// @component V1 view3d — orthographic 3D view on a canvas (course plan V1): right-handed axes, the ±10 viewing box, planes as
// translucent polygons clipped to the box (14% fill, 20% in dark mode; striped in --ink-2 when two coincide), lines clipped to
// the box (frac draws part of one, for animation), arrows, points and labels; points and arrows farther away are fainter.
// Drag or arrow keys rotate (Shift + arrows: 15° steps); preset views Isometric / Front (xz) / Side (yz) / Top (xy) as chips
// in o.btns. new View3D(canvas, {scene(), btns, txt:{iso, front, side, top}, noDrag}) → {draw(), set(id)}.
// scene() → {planes:[{n, d, color, alpha, stripe}], lines:[{p, m, color, width, dash, frac}], arrows:[{from, v, color, width,
// label}], points:[{p, color, r, label}], labels:[{p, text, color}], describe}.
var V3 = { iso:[45, 35.264], front:[-90, 0], side:[0, 0], top:[-90, 90] }, BOX = 10, VR = 17;
var V3T = { iso:"Isometric", front:"Front", side:"Side", top:"Top" };
var CUBE = (function(){
  var e = [], s = [-BOX, BOX];
  for (var a = 0; a < 3; a++) for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
    var p = [0, 0, 0], q; p[(a + 1) % 3] = s[i]; p[(a + 2) % 3] = s[j]; q = p.slice(); p[a] = -BOX; q[a] = BOX; e.push([p, q]);
  }
  return e;
})();
function planePoly(n, d){
  var pts = [], B = BOX;
  for (var a = 0; a < 3; a++) {
    if (Math.abs(n[a]) < 1e-12) continue;
    var b = (a + 1) % 3, c = (a + 2) % 3;
    for (var sb = -1; sb <= 1; sb += 2) for (var sc = -1; sc <= 1; sc += 2) {
      var p = [0, 0, 0]; p[b] = sb * B; p[c] = sc * B;
      var v = (d - n[b] * p[b] - n[c] * p[c]) / n[a];
      if (v >= -B - 1e-9 && v <= B + 1e-9) { p[a] = clamp(v, -B, B); if (!pts.some(function(q){ return isZero(sub(q, p), 1e-6); })) pts.push(p); }
    }
  }
  if (pts.length < 3) return [];
  var ctr = scl(pts.reduce(add, [0, 0, 0]), 1 / pts.length), nn = unit(n), e1 = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  var u = unit(cross(nn, e1)), w = cross(nn, u);
  pts.sort(function(p, q){ var P = sub(p, ctr), R = sub(q, ctr); return Math.atan2(dot(P, w), dot(P, u)) - Math.atan2(dot(R, w), dot(R, u)); });
  return pts;
}
function clipT(p, mm){
  var t0 = -Infinity, t1 = Infinity;
  for (var i = 0; i < 3; i++) {
    if (Math.abs(mm[i]) < 1e-12) { if (Math.abs(p[i]) > BOX + 1e-9) return null; continue; }
    var a = (-BOX - p[i]) / mm[i], b = (BOX - p[i]) / mm[i];
    t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
  }
  return t1 > t0 + 1e-9 ? [t0, t1] : null;
}
function View3D(canvas, o){
  var self = this; o = o || {};
  this.o = o; this.c = canvas; this.view = "iso"; this.az = V3.iso[0] * DEG; this.el = V3.iso[1] * DEG; this._tw = null;
  this.plot = new MV.Plot(canvas, { xmin:-VR, xmax:VR, ymin:-VR, ymax:VR });
  this.plot.render = function(){ self.draw(); };
  if (!o.noDrag) {
    canvas.setAttribute("tabindex", "0");
    var dr = null;
    canvas.addEventListener("pointerdown", function(e){ self.stop(); dr = { x:e.clientX, y:e.clientY, az:self.az, el:self.el }; try { canvas.setPointerCapture(e.pointerId); } catch (er) {} });
    canvas.addEventListener("pointermove", function(e){
      if (!dr) return;
      self.az = dr.az - (e.clientX - dr.x) * 0.011; self.el = clamp(dr.el + (e.clientY - dr.y) * 0.011, -PI / 2, PI / 2);
      if (self.view) { self.view = null; self.paintBtns(); }
      self.draw();
    });
    var end = function(){ dr = null; };
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("keydown", function(e){
      var st = (e.shiftKey ? 15 : 5) * DEG, k = e.key;
      if (k === "ArrowLeft") self.az += st; else if (k === "ArrowRight") self.az -= st;
      else if (k === "ArrowUp") self.el = clamp(self.el + st, -PI / 2, PI / 2); else if (k === "ArrowDown") self.el = clamp(self.el - st, -PI / 2, PI / 2);
      else return;
      e.preventDefault(); self.stop(); self.view = null; self.paintBtns(); self.draw();
    });
  }
  if (o.btns) o.btns.addEventListener("click", function(e){ var b = e.target.closest("[data-v3]"); if (b && !b.disabled) self.set(b.dataset.v3); });
  this.paintBtns();
}
View3D.prototype.paintBtns = function(){
  var o = this.o, h = o.btns, self = this, T = o.txt || V3T; if (!h) return;
  MV.keepFocus(h, function(){
    h.innerHTML = Object.keys(V3).map(function(id){ var on = self.view === id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-v3="' + id + '" data-k="v3' + id + '" aria-pressed="' + on + '">' + T[id] + "</button>"; }).join("");
  });
};
View3D.prototype.stop = function(){ if (this._tw) { this._tw(); this._tw = null; } };
View3D.prototype.set = function(id){
  var self = this, a0 = this.az, e0 = this.el, a1 = V3[id][0] * DEG, e1 = V3[id][1] * DEG;
  var da = ((a1 - a0) % (2 * PI) + 3 * PI) % (2 * PI) - PI;
  this.stop(); this.view = id; this.paintBtns();
  this._tw = MV.tween({ dur:450, step:function(t){ self.az = a0 + da * t; self.el = e0 + (e1 - e0) * t; self.draw(); }, done:function(){ self._tw = null; self.az = a0 + da; self.el = e1; self.draw(); } });
};
View3D.prototype.viewName = function(){ return this.view ? (this.o.txt || V3T)[this.view].toLowerCase() + " view" : "rotated view"; };
View3D.prototype.pr = function(v){
  var ca = Math.cos(this.az), sa = Math.sin(this.az), ce = Math.cos(this.el), se = Math.sin(this.el), h = v[0] * ca + v[1] * sa;
  return [-v[0] * sa + v[1] * ca, v[2] * ce - h * se, h * ce + v[2] * se];
};
View3D.prototype.draw = function(){
  var self = this, sc = this.o.scene ? this.o.scene() : {};
  this.plot.draw({ view:{ xmin:-VR, xmax:VR, ymin:-VR, ymax:VR }, equal:true, grid:false, axes:false, ticks:false,
    describe:"3D view (" + this.viewName() + "). " + (sc.describe || ""), after:function(ctx, p){ self.paint(ctx, p, sc); } });
};
View3D.prototype.paint = function(ctx, p, sc){
  var self = this, dark = isDark(), ink2 = css("--ink-2"), axis = css("--plot-axis") || ink2, ink = css("--ink");
  function P(v){ var q = self.pr(v); return [p.X(q[0]), p.Y(q[1]), q[2]]; }
  function path(pts, close){ ctx.beginPath(); pts.forEach(function(q, i){ var s = P(q); if (i) ctx.lineTo(s[0], s[1]); else ctx.moveTo(s[0], s[1]); }); if (close) ctx.closePath(); }
  function fade(d){ return 0.55 + 0.45 * clamp((d + VR) / (2 * VR), 0, 1); }
  ctx.save(); ctx.strokeStyle = css("--plot-grid") || css("--rule"); ctx.lineWidth = 1;
  CUBE.forEach(function(e){ path(e); ctx.stroke(); }); ctx.restore();
  (sc.planes || []).forEach(function(pl){
    var poly = planePoly(pl.n, pl.d), al = pl.alpha == null ? 1 : pl.alpha; if (poly.length < 3 || al <= 0) return;
    ctx.save(); path(poly, true); ctx.globalAlpha = al * (dark ? 0.2 : 0.14); ctx.fillStyle = pl.color; ctx.fill();
    if (pl.stripe) {
      ctx.clip(); var xs = poly.map(function(q){ return P(q); }), x0 = Math.min.apply(null, xs.map(function(s){ return s[0]; })), x1 = Math.max.apply(null, xs.map(function(s){ return s[0]; }));
      var y0 = Math.min.apply(null, xs.map(function(s){ return s[1]; })), y1 = Math.max.apply(null, xs.map(function(s){ return s[1]; }));
      ctx.globalAlpha = al * 0.6; ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath();
      for (var x = x0 - (y1 - y0); x < x1; x += 9) { ctx.moveTo(x, y1); ctx.lineTo(x + (y1 - y0), y0); }
      ctx.stroke();
    }
    ctx.restore();
    ctx.save(); path(poly, true); ctx.globalAlpha = al * 0.9; ctx.strokeStyle = pl.color; ctx.lineWidth = 1.6; ctx.stroke(); ctx.restore();
  });
  ["x", "y", "z"].forEach(function(nm, i){
    var e = [0, 0, 0], f = [0, 0, 0]; e[i] = BOX; f[i] = -BOX;
    ctx.save(); ctx.strokeStyle = axis; ctx.lineWidth = 1.4; path([[0, 0, 0], e]); ctx.stroke();
    ctx.setLineDash([4, 4]); ctx.globalAlpha = 0.7; path([[0, 0, 0], f]); ctx.stroke(); ctx.restore();
    var t = e.slice(); t[i] = BOX * 1.13; var s = P(t);
    ctx.save(); ctx.font = mfont(15); ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(nm, s[0], s[1]); ctx.restore();
  });
  (sc.lines || []).forEach(function(ln){
    var tt = clipT(ln.p, ln.m), f = ln.frac == null ? 1 : ln.frac; if (!tt || f <= 0) return;
    var a = add(ln.p, scl(ln.m, tt[0])), b = add(ln.p, scl(ln.m, tt[0] + (tt[1] - tt[0]) * f));
    ctx.save(); ctx.strokeStyle = ln.color; ctx.lineWidth = ln.width || 3.4; ctx.lineCap = "round"; if (ln.dash) ctx.setLineDash(ln.dash);
    path([a, b]); ctx.stroke(); ctx.restore();
  });
  (sc.arrows || []).forEach(function(ar){
    var a = P(ar.from), b = P(add(ar.from, ar.v)), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy), w = ar.width || 3;
    ctx.save(); ctx.globalAlpha = fade(b[2]); ctx.strokeStyle = ar.color; ctx.fillStyle = ar.color; ctx.lineWidth = w; ctx.lineCap = "round";
    if (L < 6) { ctx.beginPath(); ctx.arc(b[0], b[1], w + 2, 0, 2 * PI); ctx.fill(); }
    else {
      var ux = dx / L, uy = dy / L, hl = Math.min(8 + w * 2, L * 0.5);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0] - ux * hl * 0.8, b[1] - uy * hl * 0.8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[0] - ux * hl - uy * hl * 0.5, b[1] - uy * hl + ux * hl * 0.5); ctx.lineTo(b[0] - ux * hl + uy * hl * 0.5, b[1] - uy * hl - ux * hl * 0.5); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    if (ar.label && L >= 6) bgText(ctx, ar.label, b[0] + (dx / L) * 16, b[1] + (dy / L) * 16, "center", ar.color, mfont(14));
  });
  (sc.points || []).forEach(function(pt){
    var s = P(pt.p);
    ctx.save(); ctx.globalAlpha = fade(s[2]); ctx.fillStyle = pt.color || ink; ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(s[0], s[1], pt.r || 5.5, 0, 2 * PI); ctx.fill(); ctx.stroke(); ctx.restore();
    if (pt.label) bgText(ctx, pt.label, s[0] + 10, s[1] - 16, "left", pt.color || ink, ui(13, 700));
  });
  (sc.labels || []).forEach(function(lb){ var s = P(lb.p); bgText(ctx, lb.text, s[0], s[1], lb.align || "center", lb.color || ink, lb.font || ui(13, 700)); });
};
// ------------------------------------------------- end of V1 view3d -----------------------------------------------------
function plainSrc(src){ return MV.plain(m(src)); }
function isInt(v){ return Math.abs(v - Math.round(v)) < 1e-9; }
function planePlain(P){
  if (P.n.concat([P.d]).every(isInt)) return plainSrc(sysSrc(P.n.map(Math.round), Math.round(P.d)));
  var s = "";
  ["x", "y", "z"].forEach(function(v, i){ var c = P.n[i]; if (Math.abs(c) < 0.005) return; s += (s ? (c < 0 ? " − " : " + ") : (c < 0 ? MINUS : "")) + MV.num(Math.abs(c), 2) + v; });
  return (s || "0") + " = " + MV.num(P.d, 2);
}
function describePair(P1, P2, R, hide){
  var s = "Blue plane π₁: " + planePlain(P1) + ". ";
  if (!P2) return s;
  s += "Teal plane π₂: " + planePlain(P2) + ". ";
  if (hide) return s;
  if (R.kind === "line") return s + "They meet in the line through " + plainSrc(vSrc(R.pq || R.p.map(function(v){ return Math.round(v * 100) / 100; }))) + " with direction " + plainSrc(vSrc(reduce(R.m))) + ".";
  return s + (R.kind === "par" ? "They are parallel and distinct." : R.kind === "coin" ? "They are coincident." : "");
}

// =====================================================================================================================
// ---------- hero: blue plane fades in, teal plane swings about the line into place, the line draws, normals and n₁ × n₂ grow ----------
function hero(f){
  if (!f.canvas) return;
  var N1 = [1, 1, 1], N2 = [1, -1, 3], P0 = [4, 2, 0], MID = [2, 3, 1], X = [4, -2, -2];
  var u1 = unit(N1), u2 = unit(N2), mh = unit(X), w = cross(mh, u1), th = Math.acos(dot(u1, u2));
  var st = { a1:0, sw:0, line:0, nrm:0, x:0, cap:false };
  var v = new View3D(f.canvas, { noDrag:true, scene:function(){
    var t = th + (st.sw - 1) * 1.15, n2 = add(scl(u1, Math.cos(t)), scl(w, Math.sin(t))), sc = { planes:[], lines:[], arrows:[], points:[] };
    if (st.a1 > 0) sc.planes.push({ n:N1, d:6, color:css("--pen"), alpha:st.a1 });
    if (st.sw > 0) sc.planes.push({ n:n2, d:dot(n2, P0), color:css("--f3"), alpha:Math.min(1, st.sw * 2.5) });
    if (st.line > 0) sc.lines.push({ p:P0, m:[-2, 1, 1], color:css("--ink"), width:4, frac:st.line });
    if (st.nrm > 0) { sc.arrows.push({ from:MID, v:scl(u1, 5 * st.nrm), color:css("--pen"), width:3, label:st.nrm > 0.9 ? "n⃗₁" : "" }); sc.arrows.push({ from:MID, v:scl(u2, 5 * st.nrm), color:css("--f3"), width:3, label:st.nrm > 0.9 ? "n⃗₂" : "" }); }
    if (st.x > 0) sc.arrows.push({ from:MID, v:scl(mh, 7 * st.x), color:css("--ink"), width:5, label:st.x > 0.9 ? "n⃗₁ × n⃗₂" : "" });
    if (st.cap) sc.points.push({ p:P0, label:"(4, 2, 0)" });
    sc.describe = "Blue plane x + y + z = 6" + (st.sw > 0 ? " and teal plane x − y + 3z = 2" : "") + (st.line > 0.99 ? ", meeting in the line through (4, 2, 0) with direction (−2, 1, 1)" : "") +
      (st.x > 0.99 ? ". Normals (1, 1, 1) and (1, −1, 3) and their cross product (4, −2, −2) along the line." : ".");
    return sc;
  } });
  function cap(){ if (f.cap) f.cap.innerHTML = st.cap ? m("vec{r} = (4, 2, 0) + t(-2, 1, 1)") : ""; }
  function fin(){ st.a1 = 1; st.sw = 1; st.line = 1; st.nrm = 1; st.x = 1; st.cap = true; cap(); v.draw(); }
  if (MV.reduceMotion) { fin(); return; }
  cap(); v.draw();
  function go(k, dur, cb){ MV.tween({ dur:dur, step:function(t){ st[k] = t; v.draw(); }, done:function(){ st[k] = 1; v.draw(); MV.wait(250, cb); } }); }
  MV.wait(500, function(){ go("a1", 900, function(){ go("sw", 1400, function(){ go("line", 1100, function(){ go("nrm", 800, function(){ go("x", 800, function(){ st.cap = true; cap(); v.draw(); }); }); }); }); }); });
}

// =====================================================================================================================
// ---------- Explore: Two-plane hinge ----------
var KS = [[-3, 1], [-2, 1], [-1, 1], [1, 2], [1, 1], [2, 1], [3, 1]];
function kTxt(i){ var k = KS[i]; return sgn(k[0]) + (k[1] > 1 ? "/" + k[1] : ""); }
function alphaOf(h){ return Math.atan2(h.n[1], h.n[2]); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + MV.md(o.t) + "</button>"; }).join("") + "</span>";
}
function sliderHTML(k, lab, lo, hi, val, col, aria){
  return '<label class="slider tp-sl"><span class="slider-top"><span>' + lab + '</span><output data-out="' + k + '"></output></span><input type="range" data-sl="' + k + '" data-k="sl' + k + '" min="' + lo + '" max="' + hi + '" step="1" value="' + val + '" style="accent-color:var(' + col + ')" aria-label="' + MV.esc(aria) + '"></label>';
}
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function iv(k, lo, hi, d){ var v = S[k]; if (typeof v !== "number" || !Number.isInteger(v) || v < lo || v > hi) S[k] = d; }
  if (["hinge", "build", "scale"].indexOf(S.mode) < 0) S.mode = "hinge";
  if (["a", "b", "c"].indexOf(S.p1) < 0) S.p1 = "a";
  iv("stop", 0, 7, 2); iv("A", -4, 4, 1); iv("B", -4, 4, -1); iv("C", -4, 4, 3); iv("D", -12, 12, -2); iv("ki", 0, 6, 5); iv("s", -6, 6, 2);
  S.showN = !!S.showN; S.showX = !!S.showX;
  var A = { alpha:null, dOff:0, hideP2:false, hideCfg:false, line:1, x:1 }, busy = false, tw = null, panelKey = null;
  host.innerHTML = '<div class="tp-ex"><div class="tp-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot square tp-v3" id="tp-cv" role="img" aria-label="3D view of the two planes"></canvas></div>' +
    '<div class="tp-vw" role="group" aria-label="' + MV.esc(T.view) + '" id="tp-vw"></div><p class="tiny muted tp-note">' + T.viewNote + '</p>' +
    '<p class="banner tp-cfgb" id="tp-cfgb" aria-live="polite"></p><p class="tiny muted tp-key">' + MV.md(T.key) + "</p></div>" +
    '<div class="tp-side"><div class="tp-ctl" id="tp-mode"></div><div id="tp-panel"></div><div class="chips tp-tog" id="tp-tog" role="group" aria-label="Arrows"></div>' +
    '<dl class="read tp-read" id="tp-read" aria-live="polite"></dl></div></div>';
  var view = new View3D($("#tp-cv", host), { btns:$("#tp-vw", host), txt:T.views, scene:scene });

  function preset(){ return C.presets.filter(function(p){ return p.id === S.p1; })[0]; }
  // exact planes (P1, P2 as integers), display coefficients c1, c2 ([A, B, C, D] for Ax + By + Cz + D = 0) and the case R
  function cur(){
    var r = {};
    if (S.mode === "hinge") { var h = C.hinge[S.stop]; r.P1 = { n:[0, 0, 1], d:0 }; r.P2 = { n:h.n.slice(), d:h.d }; r.c1 = [0, 0, 1, 0]; r.c2 = h.n.concat([-h.d]); }
    else {
      var p = preset(); r.P1 = { n:p.n.slice(), d:p.d }; r.c1 = p.n.concat([-p.d]);
      if (S.mode === "build") { r.P2 = { n:[S.A, S.B, S.C], d:-S.D }; r.c2 = [S.A, S.B, S.C, S.D]; }
      else {
        var k = KS[S.ki], kq = Q.of(k[0], k[1]);
        r.P2 = { n:p.n.map(function(x){ return k[0] * x; }), d:k[0] * p.d + k[1] * S.s };
        r.c2 = p.n.map(function(x){ return Q.mul(kq, Q.of(x)); }).concat([Q.neg(Q.add(Q.mul(kq, Q.of(p.d)), Q.of(S.s)))]);
      }
    }
    r.R = meet(r.P1, r.P2);
    return r;
  }
  function fPlanes(r){
    var P2 = r.P2;
    if (S.mode === "hinge" && A.alpha != null) P2 = { n:[0, Math.sin(A.alpha), Math.cos(A.alpha)], d:4 * Math.cos(A.alpha) };
    else if (A.dOff) P2 = { n:P2.n, d:P2.d - A.dOff };
    return { P1:r.P1, P2:P2 };
  }
  function scene(){
    var r = cur(), F = fPlanes(r), RF = meetF(F.P1, F.P2), pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), sc = { planes:[], lines:[], arrows:[], points:[], labels:[] };
    var show2 = !A.hideP2 && RF.kind !== "bad";
    sc.planes.push({ n:F.P1.n, d:F.P1.d, color:pen, stripe:show2 && RF.kind === "coin" });
    if (show2) sc.planes.push({ n:F.P2.n, d:F.P2.d, color:f3 });
    if (S.mode === "hinge") sc.lines.push({ p:[0, 0, 4], m:[1, 0, 0], color:css("--ink-2"), width:2, dash:[7, 6] });
    var base = null;
    if (show2 && RF.kind === "line") {
      var tt = clipT(RF.p, RF.m); if (tt) base = add(RF.p, scl(RF.m, (tt[0] + tt[1]) / 2));
      if (A.line > 0) sc.lines.push({ p:RF.p, m:RF.m, color:ink, width:4.2, frac:A.line });
    }
    if (S.showN && show2) {
      sc.arrows.push({ from:base || foot(F.P1), v:scl(unit(F.P1.n), 5), color:pen, width:3, label:"n⃗₁" });
      sc.arrows.push({ from:base || foot(F.P2), v:scl(unit(F.P2.n), 5), color:f3, width:3, label:"n⃗₂" });
    }
    if (S.showX && base && A.x > 0) sc.arrows.push({ from:base, v:scl(unit(RF.m), 7 * A.x), color:ink, width:5, label:"n⃗₁ × n⃗₂" });
    sc.describe = describePair(F.P1, show2 ? F.P2 : null, RF.kind === "line" && A.alpha == null && !A.dOff ? r.R : RF, A.hideCfg) +
      (S.showN && show2 ? " Normal arrows shown." : "") + (S.showX && base ? " The arrow n₁ × n₂ lies along the line." : "");
    return sc;
  }
  function lamSrc(r){
    var i = r.c1[0] ? 0 : r.c1[1] ? 1 : 2, l = Q.div(qv(r.c2[i]), qv(r.c1[i])), a = Q.abs(l);
    var s = a.n === 1 && a.d === 1 ? "" : a.d > 1 ? "{" + a.n + "}/{" + a.d + "}" : String(a.n);
    return "vec{n}₂ = " + (l.n < 0 ? "-" : "") + s + "vec{n}₁";
  }
  function rows(){
    var r = cur(), R = r.R, out = [], H = T.hidden, RW = T.rows;
    out.push([RW.p1, m(planeSrc(r.c1)) + ", " + m("vec{n}₁ = " + vSrc(r.c1.slice(0, 3)))]);
    if (R.kind === "bad") { out.push([RW.p2, MV.md(T.notPlane)]); return out; }
    out.push([RW.p2, m(planeSrc(r.c2)) + ", " + m("vec{n}₂ = " + vSrc(r.c2.slice(0, 3)))]);
    if (A.hideCfg) { ["nor", "cross", "cfg", "pt", "line"].forEach(function(k){ out.push([MV.md(RW[k]), H]); }); return out; }
    var ln = R.kind === "line";
    out.push([RW.nor, ln ? T.notPar : T.parallel + ": " + m(lamSrc(r))]);
    out.push([MV.md(RW.cross), ln ? m(vSrc(R.m)) : m("vec{0}")]);
    out.push([RW.cfg, ln ? T.line : R.kind === "par" ? T.parD : T.coinc]);
    out.push([RW.pt, ln ? m(vSrc(R.pq)) + ", " + T.using + " " + m(R.zv + " = 0") : R.kind === "par" ? T.none : T.anyPt]);
    out.push([RW.line, ln ? m("vec{r} = " + vSrc(R.pq) + " + t" + vSrc(reduce(R.m))) : R.kind === "par" ? T.none : T.whole]);
    return out;
  }
  function panelHTML(){
    if (S.mode === "hinge") return '<p class="tiny muted tp-pn">' + MV.md(T.hingeNote) + "</p>" + sliderHTML("stop", T.tilt, 0, 7, S.stop, "--f3", T.tilt) + '<p class="tiny muted tp-pn">' + MV.md(T.tiltNote) + "</p>";
    var h = '<p class="tiny tp-h">' + T.p1 + '</p><div class="chips tp-pre" role="group" aria-label="π₁">' + C.presets.map(function(p){
      var on = S.p1 === p.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-p1="' + p.id + '" data-k="p1' + p.id + '" aria-pressed="' + on + '">' + MV.md(p.t) + "</button>"; }).join("") + "</div>";
    if (S.mode === "build") return h + '<p class="tiny tp-h">' + MV.md(T.p2) + "</p>" + ["A", "B", "C"].map(function(k){ return sliderHTML(k, m(k), -4, 4, S[k], "--f3", k); }).join("") + sliderHTML("D", m("D"), -12, 12, S.D, "--f3", "D");
    return h + '<p class="tiny tp-h">' + MV.md(T.scaleEq) + '</p><p class="tp-seq" id="tp-seq"></p>' + sliderHTML("ki", MV.md(T.k), 0, 6, S.ki, "--acol", "k") + sliderHTML("s", T.s, -6, 6, S.s, "--f3", "shift s");
  }
  function paintPanel(){
    var key = S.mode + S.p1, P = $("#tp-panel", host);
    if (key !== panelKey) { panelKey = key; MV.keepFocus(P, function(){ P.innerHTML = panelHTML(); }); }
    $$("[data-sl]", host).forEach(function(el){
      var k = el.dataset.sl, v = S[k], o = $('[data-out="' + k + '"]', host), t;
      if (+el.value !== v) el.value = v;
      if (k === "stop") t = "stop " + v; else if (k === "ki") t = kTxt(v); else t = sgn(v);
      o.innerHTML = k === "ki" ? '<span class="tp-k">' + t + "</span>" : t; el.setAttribute("aria-valuetext", (k === "ki" ? "k = " : "") + t);
    });
    var se = $("#tp-seq", host);
    if (se) { var p = preset(), kk = kTxt(S.ki).replace(MINUS, "-"); se.innerHTML = "π₂: " + m("@a{" + kk + "}(" + lhsSrc(p.n) + ") = @a{" + kk + "} · " + p.d + (S.s < 0 ? " - " + -S.s : " + " + S.s)); }
  }
  function paintTop(){
    MV.keepFocus($("#tp-mode", host), function(){ $("#tp-mode", host).innerHTML = '<span class="tiny tp-h">' + T.mode + "</span>" + segBtns("mode", C.modes, S.mode, T.mode); });
    MV.keepFocus($("#tp-tog", host), function(){
      $("#tp-tog", host).innerHTML = [["N", S.showN, T.showN], ["X", S.showX, T.showX]].map(function(t){ return '<button type="button" class="chip' + (t[1] ? " on" : "") + '" data-tog="' + t[0] + '" data-k="tog' + t[0] + '" aria-pressed="' + t[1] + '">' + MV.md(t[2]) + "</button>"; }).join("");
    });
  }
  function paintRead(){
    $("#tp-read", host).innerHTML = MV.readoutHTML(rows());
    var R = cur().R, b = $("#tp-cfgb", host), t = A.hideCfg || A.alpha != null ? "" : R.kind === "par" ? T.par : R.kind === "coin" ? T.coin : "";
    if (b.textContent !== t) b.textContent = t;
  }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }
  function paintAll(){ paintTop(); paintPanel(); paintRead(); view.draw(); if (busy) lock(true); }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function stopTw(){ if (tw) { tw(); tw = null; } }
  function hingeTo(n){
    var a0 = A.alpha != null ? A.alpha : alphaOf(C.hinge[S.stop]), a1 = alphaOf(C.hinge[n]);
    stopTw(); S.stop = n; api.save(); A.alpha = a0; paintAll();
    tw = MV.tween({ dur:Math.min(900, 160 + Math.abs(a1 - a0) * 500), step:function(t){ A.alpha = a0 + (a1 - a0) * t; view.draw(); },
      done:function(){ tw = null; A.alpha = null; paintAll(); MV.changed(); } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b) || b.dataset.v3) return;
    if (b.dataset.mode) { stopTw(); A.alpha = null; S.mode = b.dataset.mode; changed(); return; }
    if (b.dataset.p1) { S.p1 = b.dataset.p1; changed(); return; }
    if (b.dataset.tog) { if (b.dataset.tog === "N") S.showN = !S.showN; else S.showX = !S.showX; changed(); }
  });
  host.addEventListener("input", function(e){
    var el = e.target; if (!el.dataset || !el.dataset.sl || busy) return;
    var k = el.dataset.sl, v = Math.round(+el.value);
    if (k === "stop") { if (v !== S.stop) hingeTo(v); return; }
    S[k] = v; changed();
  });
  paintAll();

  // ---- challenges (plan's exact tests and named wrong states) ----
  function chal(id){
    var M = MS[id], want = id === "tc1" ? "a" : id === "tc2" ? "c" : "b";
    if (S.mode !== "build" || S.p1 !== want) return { ok:false, msg:M.mode };
    var n2 = [S.A, S.B, S.C], n1 = preset().n, D = S.D;
    if (isZero(n2)) return { ok:false, msg:M.notPlane };
    var par = isZero(cross(n1, n2));
    if (id === "tc1") { if (!par) return { ok:false, msg:M.line }; return D === -6 * S.A ? { ok:false, msg:M.same } : { ok:true }; }
    if (id === "tc2") {
      if (isZero(cross(n2, [2, 0, -1]))) return { ok:false, msg:M.normal };
      if (par) return { ok:false, msg:M.par };
      return 2 * S.A - S.C === 0 ? { ok:true } : { ok:false, msg:M.other };
    }
    var onA = S.A + S.B + S.C + D === 0, onB = 3 * S.A + S.C + D === 0;
    if (onA && onB) return par ? { ok:false, msg:M.same } : { ok:true };
    if (onA) return { ok:false, msg:M.onlyA };
    if (onB) return { ok:false, msg:M.onlyB };
    return { ok:false, msg:M.general };
  }

  // ---- predictions ----
  function anim(k, a, b, dur, cb){ tw = MV.tween({ dur:dur, step:function(t){ A[k] = a + (b - a) * t; view.draw(); }, done:function(){ tw = null; A[k] = b; view.draw(); if (cb) cb(); } }); }
  function setBuild(p1, n, D){ S.mode = "build"; S.p1 = p1; S.A = n[0]; S.B = n[1]; S.C = n[2]; S.D = D; }
  return {
    predict:{
      start:function(p){
        stopTw(); view.stop(); busy = true;
        A = { alpha:null, dOff:0, hideP2:false, hideCfg:false, line:1, x:1 };
        if (p.id === "p1") { S.mode = "hinge"; S.stop = 2; }
        else if (p.id === "p2") { setBuild("a", [2, 2, 2], -12); A.hideP2 = true; A.hideCfg = true; }
        else if (p.id === "p3") { setBuild("a", [2, 2, 2], -8); A.hideP2 = true; A.hideCfg = true; }
        else { setBuild("a", [1, -1, 0], 0); A.hideCfg = true; A.line = 0; A.x = 0; S.showN = true; S.showX = false; }
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ A = { alpha:null, dOff:0, hideP2:false, hideCfg:false, line:1, x:1 }; busy = false; lock(false); api.save(); paintAll(); MV.changed(); done(); }
        if (p.id === "p1") {
          var a2 = alphaOf(C.hinge[2]), a1 = alphaOf(C.hinge[1]);
          A.alpha = a2;
          anim("alpha", a2, a1, 1300, function(){ S.stop = 1; paintAll(); MV.wait(900, function(){ anim("alpha", a1, 0, 1500, function(){ S.stop = 0; A.alpha = null; paintAll(); MV.wait(700, fin); }); }); });
        } else if (p.id === "p2") {
          A.hideP2 = false; A.dOff = 24; view.draw();
          anim("dOff", 24, 0, 1600, function(){ A.hideCfg = false; paintAll(); MV.wait(900, fin); });
        } else if (p.id === "p3") {
          A.hideP2 = false; A.dOff = -4; view.draw();
          MV.wait(800, function(){ anim("dOff", -4, 0, 1300, function(){ A.hideCfg = false; paintAll(); MV.wait(900, fin); }); });
        } else {
          anim("line", 0, 1, 1100, function(){ S.showX = true; A.x = 0; paintAll(); anim("x", 0, 1, 900, function(){ A.hideCfg = false; paintAll(); MV.wait(900, fin); }); });
        }
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Find the line (three N13 step stations, each with its own V1 view) ----------
function part3(host, api){
  var S = api.S, C = api.content, L = C.labels, ST = [C.st1, C.st2, C.st3];
  S.cmp = !!S.cmp;
  var PA = { n:[1, 1, 1], d:6 }, PB = { n:[1, -1, 3], d:2 }, PC = { n:[1, 1, 1], d:5 }, PD = { n:[1, 1, -1], d:1 };
  var idx = [0, 0, 0], fr = [1, 1, 1], views = [];
  host.innerHTML = ST.map(function(st, i){
    var k = i + 1;
    return '<div class="part tp-st" id="tp-s' + k + '"><h3>' + MV.md(st.title) + "</h3><p>" + MV.md(st.text) + '</p><div class="sym tp-stg"><div>' +
      '<div class="plot-wrap"><canvas class="plot square tp-v3" id="tp-c' + k + '" role="img" aria-label="' + MV.esc(L.view) + '"></canvas></div><div class="tp-vw" role="group" aria-label="View" id="tp-w' + k + '"></div></div>' +
      '<div><ol class="tp-steps" id="tp-o' + k + '"></ol><div id="tp-pl' + k + '"></div><div class="tp-x" id="tp-x' + k + '" aria-live="polite"></div></div></div>' +
      (i === 0 ? '<details class="alg"><summary>' + L.working + '</summary><div class="alg-lines">' + st.alg.map(function(l){ return "<div>" + MV.md(l) + "</div>"; }).join("") + "</div></details>" : "") + "</div>";
  }).join("");
  function base(P, R){ return [{ n:P.n, d:P.d, color:css("--pen") }, { n:R.n, d:R.d, color:css("--f3") }]; }
  var SC = [
    function(i){
      var sc = { planes:base(PA, PB), lines:[], arrows:[], points:[] }, ink = css("--ink");
      if (i >= 1) sc.lines.push({ p:[4, 2, 0], m:[-2, 1, 1], color:ink, width:4.2, frac:fr[0] });
      if (i >= 2) { sc.points.push({ p:[4, 2, 0], label:"(4, 2, 0)" }); sc.arrows.push({ from:[4, 2, 0], v:[-4, 2, 2], color:ink, width:3.4, label:"(−2, 1, 1)" }); }
      sc.describe = describePair(PA, PB, { kind:"x" }, true) + (i >= 1 ? " The line r = (4, 2, 0) + t(−2, 1, 1) is drawn where they meet." : "");
      return sc;
    },
    function(i){
      var sc = { planes:base(PA, PB), lines:[], arrows:[], points:[] }, ink = css("--ink"), mid = [2, 3, 1];
      if (i === 1) sc.planes.push({ n:[0, 0, 1], d:0, color:css("--ink-2"), alpha:0.7 });
      sc.arrows.push({ from:mid, v:scl(unit([1, 1, 1]), 5), color:css("--pen"), width:3, label:"n⃗₁" });
      sc.arrows.push({ from:mid, v:scl(unit([1, -1, 3]), 5), color:css("--f3"), width:3, label:"n⃗₂" });
      sc.arrows.push({ from:mid, v:scl(unit([4, -2, -2]), 7), color:ink, width:5, label:"n⃗₁ × n⃗₂" });
      if (i >= 1) { sc.lines.push({ p:[4, 2, 0], m:[4, -2, -2], color:ink, width:4.2 }); sc.points.push({ p:[4, 2, 0], label:"(4, 2, 0)" }); }
      if (i >= 2 && S.cmp) sc.lines.push({ p:[4, 2, 0], m:[-2, 1, 1], color:css("--f5") || css("--hi"), width:2.6, dash:[9, 7] });
      sc.describe = describePair(PA, PB, { kind:"x" }, true) + " Normals (1, 1, 1) and (1, −1, 3) and their cross product (4, −2, −2)." +
        (i >= 1 ? " The line through (4, 2, 0) with direction (4, −2, −2)." : "") + (i >= 2 && S.cmp ? " The station 1 line, dashed, lies exactly on it." : "");
      return sc;
    },
    function(i){
      var sc = { planes:base(PC, PD), lines:[], arrows:[], points:[], labels:[] }, ink = css("--ink");
      sc.planes.push({ n:[0, 0, 1], d:0, color:css("--ink-2"), alpha:0.7 });
      sc.labels.push({ p:[9, -9, 0], text:"z = 0", color:css("--ink-2") });
      if (i >= 1) { sc.lines.push({ p:[0, 3, 2], m:[-1, 1, 0], color:ink, width:4.2, frac:fr[2] }); sc.labels.push({ p:[-6, 9, 3.4], text:"z = 2" }); }
      if (i >= 2) sc.arrows.push({ from:[0, 3, 2], v:[-4, 4, 0], color:ink, width:3.4, label:"(−2, 2, 0)" });
      if (i >= 3) sc.points.push({ p:[0, 3, 2], label:"(0, 3, 2)" });
      sc.describe = describePair(PC, PD, { kind:"x" }, true) + " The floor z = 0 is grey." + (i >= 1 ? " Their line is horizontal at height z = 2 and never touches the floor." : "");
      return sc;
    }
  ];
  function paint(j){
    var st = ST[j], i = idx[j], ol = $("#tp-o" + (j + 1), host), x = $("#tp-x" + (j + 1), host);
    ol.innerHTML = st.steps.map(function(s, k){ return k > i ? "" : '<li class="' + (k === i ? "cur" : "") + '"><strong>' + MV.md(s.h) + "</strong> " + MV.md(s.t) + "</li>"; }).join("");
    var h = "";
    if (j === 1 && i >= 2) h = '<div class="q-actions"><button type="button" class="btn primary sm" data-cmp="1" data-k="tpcmp" aria-pressed="' + S.cmp + '">' + (S.cmp ? L.compared : L.compare) + "</button></div>" + (S.cmp ? MV.fbHTML("good", "<strong>✓</strong> " + MV.md(st.same)) : "");
    if (j === 2 && i >= 1) h = '<p class="tiny tp-fl">' + MV.md(st.floor) + "</p>";
    MV.keepFocus(x, function(){ x.innerHTML = h; });
    views[j].draw();
  }
  ST.forEach(function(st, j){
    views[j] = new View3D($("#tp-c" + (j + 1), host), { btns:$("#tp-w" + (j + 1), host), scene:function(){ return SC[j](idx[j]); } });
    var stopF = null;
    MV.player($("#tp-pl" + (j + 1), host), { count:st.steps.length, interval:2600, label:function(i){ return "Step " + (i + 1) + " of " + st.steps.length; },
      render:function(i){
        var prev = idx[j]; idx[j] = i;
        if (stopF) { stopF(); stopF = null; }
        if ((j === 0 || j === 2) && i === 1 && prev === 0) { fr[j] = 0; stopF = MV.tween({ dur:1000, step:function(t){ fr[j] = t; views[j].draw(); }, done:function(){ stopF = null; fr[j] = 1; views[j].draw(); } }); }
        else fr[j] = 1;
        paint(j);
      } });
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-cmp]"); if (!b) return;
    S.cmp = !S.cmp; api.save(); paint(1);
  });
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Find the line set (V12: any point on the line and any parallel direction is accepted) ----------
// @component V12 lineEntry (MCV4U 56) — structured entry for a line in R³: a point box triple and a direction box triple
// (whole numbers or fractions), judged for equivalence: d ∥ m and (P − P₀) ∥ m; also single points, k/m coefficient pairs.
var GR = { p:["Point", ["x", "y", "z"]], m:["Direction", ["x", "y", "z"]] };
function linesAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function keys(it){ var K = []; if (it.kind === "km" || it.kind === "kline") K.push("k"); if (it.kind === "km") K.push("m"); if (it.kind !== "km") K.push("p0", "p1", "p2"); if (it.kind === "line" || it.kind === "kline") K.push("m0", "m1", "m2"); return K; }
  function box(it, k, label, dis){ var x = ist(it.id); return '<input class="numin short" data-bx="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.v[k] || "") + '"' + (dis ? " disabled" : "") + ">"; }
  function frame(it){
    var dis = ist(it.id).solved, h = "";
    function grp(g){ return '<span class="tp-grp"><span>' + GR[g][0] + " (</span>" + [0, 1, 2].map(function(i){ return box(it, g + i, GR[g][0] + " " + GR[g][1][i], dis); }).join("<span>,</span>") + "<span>)</span></span>"; }
    if (it.kind === "km" || it.kind === "kline") h += '<span class="tp-grp">' + m("k =") + box(it, "k", "k", dis) + "</span>";
    if (it.kind === "km") h += '<span class="tp-grp">' + m("m =") + box(it, "m", "m", dis) + "</span>";
    if (it.kind !== "km") h += grp("p");
    if (it.kind === "line" || it.kind === "kline") h += grp("m");
    return h;
  }
  host.innerHTML = '<p class="how">' + MV.md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q tp-lq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="tp-frame"></div><div class="tp-cl"></div></div>';
  }).join("");
  function q(it){ return $('[data-q="' + it.id + '"]', host); }
  function paintIn(it){ var el = $(".tp-frame", q(it)); MV.keepFocus(el, function(){ el.innerHTML = frame(it); }); }
  function paintCl(it){
    var x = ist(it.id), c = $(".tp-cl", q(it)), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints.map(MV.md), x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + MV.md(it.display) + ".</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", MV.md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function read(it){
    var x = ist(it.id), v = {};
    var K = keys(it);
    for (var i = 0; i < K.length; i++) {
      var raw = String(x.v[K[i]] || "").trim();
      if (!raw) return { err:TX.fill };
      var r = Q.raw(raw); if (!r || !r.d) return { err:TX.err };
      v[K[i]] = r.n / r.d;
    }
    v.p = [v.p0, v.p1, v.p2]; v.m = [v.m0, v.m1, v.m2];
    return { v:v };
  }
  function same(p, q){ return isZero(sub(p, q), 1e-9); }
  function judgeLine(it, v, ans){
    if (isZero(v.m)) return { msg:TX.zero };
    if (!isZero(cross(v.m, ans.m), 1e-9)) { var w = (it.wrongDir || []).filter(function(z){ return isZero(cross(v.m, z.d), 1e-9); })[0]; return { msg:w ? w.fb : TX.dir }; }
    if (!isZero(cross(sub(v.p, ans.p), ans.m), 1e-9)) return { msg:it.ptFail || TX.pt };
    return { ok:true };
  }
  function judge(it){
    var r = read(it); if (r.err) return { err:r.err };
    var v = r.v, ans = MV.ans(it);
    if (it.kind === "line") return judgeLine(it, v, ans);
    if (it.kind === "point") { if (same(v.p, ans.p)) return { ok:true }; var w = (it.wrongPt || []).filter(function(z){ return same(v.p, z.p); })[0]; return { msg:w ? w.fb : it.general || TX.general }; }
    if (it.kind === "km") { if (Math.abs(v.k - ans.k) < 1e-9 && Math.abs(v.m - ans.m) < 1e-9) return { ok:true }; var wm = (it.wrongM || []).filter(function(z){ return Math.abs(v.m - z.m) < 1e-9; })[0]; return { msg:wm ? wm.fb : it.general || TX.general }; }
    if (Math.abs(v.k - ans.k) > 1e-9) { var wk = (it.wrongK || []).filter(function(z){ return Math.abs(v.k - z.k) < 1e-9; })[0]; return { msg:wk ? wk.fb : it.kGeneral || TX.general }; }
    return judgeLine(it, v, ans);
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var qq = t.closest("[data-q]"); ist(qq.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var qq = e.target.closest("[data-q]"), b = qq && qq.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var qq = b.closest("[data-q]"); if (!qq) return;
    var it = a.items.filter(function(z){ return z.id === qq.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(qq);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// =====================================================================================================================
// ---------- Performance task: Horizontal crease (π₂: Ax + By + Cz + D = 0 with π₁: x + y + z = 6) ----------
var task = (function(){
  var api, view, RNG = { A:[-2, 2], B:[-2, 2], C:[-2, 2], D:[-12, 12] }, KEYS = ["A", "B", "C", "D"], P1 = { n:[1, 1, 1], d:6 };
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= RNG[k][0] && v <= RNG[k][1] ? v : null; }
  function read(){ var o = {}; KEYS.forEach(function(k){ o[k] = gi(k); }); o.ints = KEYS.every(function(k){ return o[k] !== null; }); o.plane = o.ints && !(o.A === 0 && o.B === 0 && o.C === 0); return o; }
  function checks(D){ if (!D.plane) return [false, false, false, false]; return [!(D.A === D.B && D.B === D.C), 2 * D.A + 2 * D.B + 2 * D.C + D.D === 0, D.A === D.B, D.C !== 0]; }
  function norm(D){ var v = [D.A, D.B, D.C, D.D], g = v.reduce(function(s, x){ return gcd(s, x); }, 0) || 1, f = v.filter(function(x){ return x; })[0] < 0 ? -1 : 1; return v.map(function(x){ return x * f / g + 0; }); }
  function scene(){
    var D = read(), sc = { planes:[{ n:P1.n, d:P1.d, color:css("--pen") }], lines:[], arrows:[], points:[{ p:[2, 2, 2], label:"P" }] };
    if (!D.plane) { sc.describe = "Blue plane π₁: x + y + z = 6 and the point P(2, 2, 2). π₂ is not set."; return sc; }
    var P2 = { n:[D.A, D.B, D.C], d:-D.D }, R = meet(P1, P2);
    sc.planes.push({ n:P2.n, d:P2.d, color:css("--f3") });
    if (R.kind === "coin") sc.planes[0].stripe = true;
    if (R.kind === "line") sc.lines.push({ p:R.p, m:R.m, color:css("--ink"), width:4.2 });
    sc.describe = describePair(P1, P2, R, false) + " Point P(2, 2, 2) is " + (checks(D)[1] ? "" : "not ") + "on π₂.";
    return sc;
  }
  function preview(){
    var D = read(), L = api.content.labels, rd = $("#tc-read");
    if (rd) {
      if (!D.ints) rd.innerHTML = '<p class="tiny muted">' + MV.md(L.invalid) + "</p>";
      else if (!D.plane) rd.innerHTML = '<p class="tiny muted">' + MV.md(L.notPlane) + "</p>";
      else {
        var c = [D.A, D.B, D.C, D.D], R = meet(P1, { n:c.slice(0, 3), d:-D.D }), dir = [D.C - D.B, D.A - D.C, D.B - D.A];
        rd.innerHTML = '<dl class="read">' + MV.readoutHTML([[L.p1, m("x + y + z - 6 = 0")], [L.p2, m(planeSrc(c))],
          [MV.md(L.dir), m(vSrc(dir)) + (R.kind === "line" ? " (" + (dir[2] === 0 ? L.horiz : L.notHoriz) + ")" : "")],
          [L.cfg, R.kind === "line" ? api.content.cfg.line : R.kind === "par" ? api.content.cfg.par : api.content.cfg.coin],
          [L.P, checks(D)[1] ? L.yes : L.no]]) + "</dl>";
      }
    }
    var all = $("#tc-all"); if (all) all.innerHTML = MV.taskState().found.length >= 6 ? MV.fbHTML("good", MV.md(api.content.afterAll)) : "";
    view.draw();
  }
  function stepper(k){
    var L = api.content.labels;
    return '<div class="tc-step"><label for="tc-' + k + '"><span class="m">' + MV.md(L[k]) + '</span> <span class="tiny muted">' + (k === "D" ? L.rangeD : L.rangeABC) + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="tc' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="tc-' + k + '" data-tk="' + k + '" type="number" min="' + RNG[k][0] + '" max="' + RNG[k][1] + '" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="tc' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      a.content.cfg = { line:"intersect in a line", par:"parallel and distinct", coin:"coincident" };
      if (a.S.A == null) { a.S.A = "1"; a.S.B = "0"; a.S.C = "1"; a.S.D = "-4"; }
      inp.innerHTML = '<div class="tc-in"><p class="tiny" style="font-weight:700;margin:0">π₂: ' + m("Ax + By + Cz + D = 0") + "</p>" + KEYS.map(stepper).join("") + "</div>";
      pv.innerHTML = '<div id="tc-read" aria-live="polite"></div><p class="tiny tc-gh">' + MV.md(L.graph) + '</p><div class="plot-wrap"><canvas class="plot square tp-v3" id="tc-cv" role="img" aria-label="3D preview"></canvas></div><div class="tp-vw" role="group" aria-label="View" id="tc-vw"></div><div id="tc-all" aria-live="polite"></div>';
      view = new View3D($("#tc-cv"), { btns:$("#tc-vw"), scene:scene });
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, c = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(c)) c = 0;
        a.S[k] = String(clamp(c + +b.dataset.dir, RNG[k][0], RNG[k][1])); $("#tc-" + k).value = a.S[k]; upd();
      });
      var tc = $("#task-check"); if (tc) tc.addEventListener("click", function(){ setTimeout(preview, 0); });
      preview();
    },
    read:read,
    valid:function(D){ var L = api.content.labels; return !D.ints ? MV.md(L.invalid) : !D.plane ? MV.md(L.notPlane) : true; },
    checks:checks,
    key:function(D){ return norm(D).join("|"); },
    label:function(k){ return m(planeSrc(k.split("|").map(Number))); },
    text:function(k){ return MV.plain(m(planeSrc(k.split("|").map(Number)))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ lines:linesAct },
  task:task
});

})();
