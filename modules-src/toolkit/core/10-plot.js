// Graph engine (K21) from the reference, with G1 asymptote breaks, G2 holes/end dots, G3 radian ticks, G5 secants/tangents,
// G6 bands/regions, G7 draggable points (MV.drag), G9 equal scale, G11 labels/annotation arrows, G12 data points,
// G14 number-line mode, G15 descriptions (plot.describe), G16 extra sampling near jumps. Also K10 tween.
(function(){
"use strict";
var MV = window.MV, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var PLOTS = MV._plots = [];
function niceStep(raw){
  var mag = Math.pow(10, Math.floor(Math.log10(raw))), nrm = raw / mag;
  return (nrm < 1.5 ? 1 : nrm < 3 ? 2 : nrm < 7 ? 5 : 10) * mag;
}
MV.niceStep = niceStep;
// pi-multiple label: 5π/6, −π/4, 2π
MV.piLabel = function(v, den){
  den = den || 12;
  var q = v / Math.PI;
  for (var d = 1; d <= den; d++) {
    var n = Math.round(q * d);
    if (Math.abs(n / d - q) < 1e-9) {
      if (n === 0) return "0";
      var sgn = n < 0 ? MINUS : "", a = Math.abs(n);
      return sgn + (a === 1 ? "" : a) + "π" + (d === 1 ? "" : "/" + d);
    }
  }
  return num(v, 2);
};

function Plot(canvas, view, opts){
  this.c = canvas; this.view = view; this.render = null; this.opts = opts || {}; this._hooks = [];
  this.ctx = (canvas && canvas.getContext) ? canvas.getContext("2d") : null;
  var self = this;
  if (this.ctx && window.ResizeObserver) new ResizeObserver(function(){ if (self.render) self.render(); }).observe(canvas);
  PLOTS.push(this);
}
MV.Plot = Plot;
Plot.prototype.fit = function(){
  var r = this.c.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  this.W = r.width; this.H = r.height;
  var w = Math.round(this.W * dpr), h = Math.round(this.H * dpr);
  if (this.c.width !== w) this.c.width = w;
  if (this.c.height !== h) this.c.height = h;
  this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};
Plot.prototype.X = function(x){ var v = this.v; return (x - v.xmin) / (v.xmax - v.xmin) * this.W; };
Plot.prototype.Y = function(y){ var v = this.v; return this.H - (y - v.ymin) / (v.ymax - v.ymin) * this.H; };
Plot.prototype.xOf = function(px){ var v = this.v; return v.xmin + px / this.W * (v.xmax - v.xmin); };
Plot.prototype.yOf = function(py){ var v = this.v; return v.ymin + (this.H - py) / this.H * (v.ymax - v.ymin); };
Plot.prototype.onDrawn = function(fn){ this._hooks.push(fn); };
Plot.prototype.describe = function(text){ if (this.c) this.c.setAttribute("aria-label", text); };
// Equal scale (G9): widen the x or y range so one unit is the same length on both axes.
function equalize(v, W, H){
  var xr = v.xmax - v.xmin, yr = v.ymax - v.ymin, cx = (v.xmax + v.xmin) / 2, cy = (v.ymax + v.ymin) / 2;
  if (xr / W > yr / H) { yr = xr * H / W; return { xmin:v.xmin, xmax:v.xmax, ymin:cy - yr / 2, ymax:cy + yr / 2 }; }
  xr = yr * W / H; return { xmin:cx - xr / 2, xmax:cx + xr / 2, ymin:v.ymin, ymax:v.ymax };
}

Plot.prototype.draw = function(sc){
  if (!this.ctx) return;
  sc = sc || {};
  this.fit();
  if (this.W < 20 || this.H < 20) return;
  var ctx = this.ctx, W = this.W, H = this.H, self = this;
  if (Object.prototype.hasOwnProperty.call(this, "X")) { delete this.X; delete this.xOf; }
  var v = sc.view || this.view;
  if (sc.equal || this.opts.equal) v = equalize(v, W, H);
  this.v = v; this.sc = sc;
  var fontUI = css("--font-ui") || "sans-serif", fontM = css("--font-math") || "serif";
  this.fontUI = fontUI; this.fontM = fontM;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = css("--sheet"); ctx.fillRect(0, 0, W, H);
  if (sc.numberLine) { this.numberLine(sc.numberLine); this._after(sc); return; }
  var ox = this.X(0), oy = this.Y(0);
  var Q = { 1:[ox, 0, W - ox, oy], 2:[0, 0, ox, oy], 3:[0, oy, ox, H - oy], 4:[ox, oy, W - ox, H - oy] };
  if (sc.shade) { ctx.fillStyle = css("--hi-soft"); sc.shade.forEach(function(q){ var r = Q[q]; ctx.fillRect(r[0], r[1], r[2], r[3]); }); }
  (sc.bands || []).forEach(function(b){
    var x0 = Math.max(0, self.X(Math.max(b.x0, v.xmin))), x1 = Math.min(W, self.X(Math.min(b.x1, v.xmax)));
    ctx.globalAlpha = b.alpha == null ? 1 : b.alpha; ctx.fillStyle = b.color || css("--hi-soft"); ctx.fillRect(x0, 0, x1 - x0, H); ctx.globalAlpha = 1;
  });
  (sc.regions || []).forEach(function(r){ self.region(r); });
  var xt = sc.xTicks || {}, yt = sc.yTicks || {};
  var sx = xt.step || niceStep((v.xmax - v.xmin) / (W < 420 ? 6 : 10)), sy = yt.step || niceStep((v.ymax - v.ymin) / (H < 320 ? 6 : 9));
  var x, y;
  if (sc.grid !== false) {
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    for (x = Math.ceil(v.xmin / sx - 1e-9) * sx; x <= v.xmax + 1e-9; x += sx) { var px = Math.round(this.X(x)) + 0.5; ctx.moveTo(px, 0); ctx.lineTo(px, H); }
    for (y = Math.ceil(v.ymin / sy - 1e-9) * sy; y <= v.ymax + 1e-9; y += sy) { var py = Math.round(this.Y(y)) + 0.5; ctx.moveTo(0, py); ctx.lineTo(W, py); }
    ctx.stroke();
  }
  if (sc.axes !== false) {
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath();
    ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
  }
  if (sc.ticks !== false && sc.axes !== false) {
    ctx.fillStyle = css("--ink-2"); ctx.font = "12px " + fontUI;
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    var ly = Math.min(Math.max(oy + 4, 2), H - 16), lastX = -1e9;
    var xfmt = xt.fmt || (xt.pi ? function(t){ return MV.piLabel(t, xt.den); } : function(t){ return num(t); });
    for (x = Math.ceil(v.xmin / sx - 1e-9) * sx; x <= v.xmax + 1e-9; x += sx) {
      if (Math.abs(x) < 1e-9 || this.X(x) < 8 || this.X(x) > W - 8) continue;
      var lab = xfmt(x), lw = ctx.measureText(lab).width;
      if (this.X(x) - lw / 2 < lastX + 4) continue;
      ctx.fillText(lab, this.X(x), ly); lastX = this.X(x) + lw / 2;
    }
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    var lx = Math.min(Math.max(ox - 5, 26), W - 4), yfmt = yt.fmt || function(t){ return num(t); };
    for (y = Math.ceil(v.ymin / sy - 1e-9) * sy; y <= v.ymax + 1e-9; y += sy) { if (Math.abs(y) < 1e-9 || this.Y(y) < 8 || this.Y(y) > H - 8) continue; ctx.fillText(yfmt(y), lx, this.Y(y)); }
  }
  if (sc.xLabel) { ctx.fillStyle = css("--ink-2"); ctx.font = "italic 13px " + fontM; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(sc.xLabel, W - 6, Math.min(Math.max(oy - 4, 16), H - 4)); }
  if (sc.yLabel) { ctx.fillStyle = css("--ink-2"); ctx.font = "italic 13px " + fontM; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(sc.yLabel, Math.min(Math.max(ox + 6, 4), W - 60), 4); }
  if (sc.quads) {
    var pos = { 1:[(ox + W) / 2, 8], 2:[ox / 2, 8], 3:[ox / 2, H - 8], 4:[(ox + W) / 2, H - 8] };
    [1, 2, 3, 4].forEach(function(q){
      var on = sc.shade && sc.shade.indexOf(q) >= 0, p = pos[q];
      ctx.font = (on ? "600 15px " : "400 13px ") + fontM;
      ctx.fillStyle = on ? css("--ink") : css("--ink-2");
      ctx.globalAlpha = on ? 1 : 0.7;
      ctx.textAlign = "center"; ctx.textBaseline = q < 3 ? "top" : "bottom";
      ctx.fillText("Q" + q, p[0], p[1]);
      ctx.globalAlpha = 1;
    });
  }
  (sc.asymptotes || []).forEach(function(a){ self.asymptote(a); });
  (sc.lines || []).forEach(function(l){ self.line(l); });
  (sc.curves || []).forEach(function(cv){ self.curve(cv); });
  (sc.segments || []).forEach(function(s){ self.segment(s); });
  (sc.arrowsAnn || []).forEach(function(a){ self.annArrow(a); });
  (sc.data || []).forEach(function(p){ self.point({ x:p.x, y:p.y, r:p.r || 4, color:p.color || css("--ink"), label:p.label }); });
  (sc.points || []).forEach(function(p){ self.point(p); });
  (sc.labels || []).forEach(function(l){ self.label(l); });
  this._after(sc);
};
Plot.prototype._after = function(sc){
  if (sc.after) sc.after(this.ctx, this);
  if (sc.describe) this.describe(sc.describe);
  var self = this; this._hooks.forEach(function(f){ f(self); });
};
// Sample a function with extra samples near steep parts (G16) and breaks at jumps/asymptotes (G1).
Plot.prototype.sample = function(f, x0, x1){
  var v = this.v, H = this.H, span = x1 - x0, N = Math.max(300, Math.round(this.W * 1.2)), pts = [];
  var yr = v.ymax - v.ymin, jump = yr * 1.2;
  function ok(y){ return typeof y === "number" && isFinite(y); }
  var prevX = x0, prevY = f(x0);
  pts.push([prevX, prevY]);
  for (var i = 1; i <= N; i++) {
    var x = x0 + span * i / N, y = f(x);
    if (ok(prevY) && ok(y) && Math.abs(y - prevY) > yr * 0.05) {
      // refine this interval
      var sub = 16, lx = prevX, ly = prevY, broke = false;
      for (var j = 1; j < sub; j++) {
        var xx = prevX + (x - prevX) * j / sub, yy = f(xx);
        if (ok(ly) && ok(yy) && Math.abs(yy - ly) > jump && ((yy > v.ymax && ly < v.ymin) || (yy < v.ymin && ly > v.ymax) || Math.sign(yy) !== Math.sign(ly))) { pts.push([xx, NaN]); broke = true; }
        pts.push([xx, yy]); lx = xx; ly = yy;
      }
      if (ok(ly) && ok(y) && Math.abs(y - ly) > jump && Math.sign(y) !== Math.sign(ly)) pts.push([x, NaN]);
      void broke;
    }
    pts.push([x, y]); prevX = x; prevY = y;
  }
  return pts;
};
Plot.prototype.curve = function(cv){
  var ctx = this.ctx, v = this.v, pts = cv.pts, i;
  if (!pts) {
    var span = v.xmax - v.xmin, a = v.xmin - span * 0.01, b = v.xmax + span * 0.01;
    if (cv.domain) { a = Math.max(a, cv.domain[0]); b = Math.min(b, cv.domain[1]); }
    pts = this.sample(cv.f, a, b);
  }
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, this.W, this.H); ctx.clip();
  ctx.globalAlpha = cv.alpha == null ? 1 : cv.alpha;
  ctx.strokeStyle = cv.color || css("--pen"); ctx.lineWidth = cv.width || 3; ctx.lineJoin = "round"; ctx.lineCap = "round";
  if (cv.dash) ctx.setLineDash(cv.dash);
  ctx.beginPath();
  var pen = false, lim = this.H * 6;
  for (i = 0; i < pts.length; i++) {
    var p = pts[i];
    if (!isFinite(p[0]) || !isFinite(p[1])) { pen = false; continue; }
    var X = Math.max(-lim, Math.min(lim, this.X(p[0]))), Y = Math.max(-lim, Math.min(lim, this.Y(p[1])));
    if (!pen) { ctx.moveTo(X, Y); pen = true; } else ctx.lineTo(X, Y);
  }
  ctx.stroke(); ctx.setLineDash([]);
  if (cv.arrows) this.arrows(pts, cv.color || css("--pen"));
  ctx.restore();
};
Plot.prototype.arrows = function(pts, color){
  var v = this.v, inside = function(p){ return isFinite(p[1]) && p[0] >= v.xmin && p[0] <= v.xmax && p[1] >= v.ymin && p[1] <= v.ymax; };
  var i0 = -1, i1 = -1, i;
  for (i = 0; i < pts.length; i++) if (inside(pts[i])) { i0 = i; break; }
  for (i = pts.length - 1; i >= 0; i--) if (inside(pts[i])) { i1 = i; break; }
  if (i0 < 0) return;
  this.head(pts[Math.min(i0 + 8, pts.length - 1)], pts[i0], color);
  this.head(pts[Math.max(i1 - 8, 0)], pts[i1], color);
};
Plot.prototype.head = function(from, to, color, size){
  var ctx = this.ctx, fx = this.X(from[0]), fy = this.Y(from[1]), tx = this.X(to[0]), ty = this.Y(to[1]);
  var ang = Math.atan2(ty - fy, tx - fx), s = size || 14;
  ctx.globalAlpha = 1; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(tx, ty);
  ctx.lineTo(tx - s * Math.cos(ang - 0.42), ty - s * Math.sin(ang - 0.42));
  ctx.lineTo(tx - s * Math.cos(ang + 0.42), ty - s * Math.sin(ang + 0.42));
  ctx.closePath(); ctx.fill();
};
// p: {x, y, r, color, label, open (hole: sheet fill + coloured ring), ring (drag handle highlight)}
Plot.prototype.point = function(p){
  var ctx = this.ctx, X = this.X(p.x), Y = this.Y(p.y), r = p.r || (p.open ? 5 : 4.5);
  if (!isFinite(X) || !isFinite(Y) || X < -10 || X > this.W + 10 || Y < -10 || Y > this.H + 10) return;
  ctx.globalAlpha = 1;
  if (p.ring) { ctx.beginPath(); ctx.arc(X, Y, r + 5, 0, Math.PI * 2); ctx.fillStyle = css("--hi"); ctx.fill(); }
  ctx.beginPath(); ctx.arc(X, Y, r, 0, Math.PI * 2);
  if (p.open) { ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = p.color || css("--pen"); ctx.stroke(); }
  else { ctx.fillStyle = p.color || css("--ink"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--sheet"); ctx.stroke(); }
  if (p.label) {
    ctx.font = "600 14px " + (this.fontM || css("--font-math") || "serif"); ctx.fillStyle = css("--ink");
    var right = X > this.W - 80, up = !(p.below || Y < 22);
    ctx.textAlign = right ? "right" : "left"; ctx.textBaseline = up ? "bottom" : "top";
    ctx.fillText(p.label, X + (right ? -10 : 10), Y + (up ? -8 : 8));
  }
};
// l: {x, y, text, color, font, align, baseline, dx, dy, bg}
Plot.prototype.label = function(l){
  var ctx = this.ctx, X = this.X(l.x) + (l.dx || 0), Y = this.Y(l.y) + (l.dy || 0);
  ctx.font = l.font || ("600 14px " + (this.fontM || "serif"));
  ctx.textAlign = l.align || "left"; ctx.textBaseline = l.baseline || "middle";
  if (l.bg) { var w = ctx.measureText(l.text).width, bx = l.align === "center" ? X - w / 2 : l.align === "right" ? X - w : X; ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(bx - 3, Y - 10, w + 6, 20); ctx.globalAlpha = 1; }
  ctx.fillStyle = l.color || css("--ink"); ctx.fillText(l.text, X, Y);
};
// s: {x1, y1, x2, y2, color, width, dash, arrow:true|"both", alpha}
Plot.prototype.segment = function(s){
  var ctx = this.ctx;
  ctx.save(); ctx.globalAlpha = s.alpha == null ? 1 : s.alpha;
  ctx.strokeStyle = s.color || css("--ink"); ctx.lineWidth = s.width || 2; ctx.lineCap = "round";
  if (s.dash) ctx.setLineDash(s.dash);
  ctx.beginPath(); ctx.moveTo(this.X(s.x1), this.Y(s.y1)); ctx.lineTo(this.X(s.x2), this.Y(s.y2)); ctx.stroke(); ctx.setLineDash([]);
  if (s.arrow) this.head([s.x1, s.y1], [s.x2, s.y2], s.color || css("--ink"), 11);
  if (s.arrow === "both") this.head([s.x2, s.y2], [s.x1, s.y1], s.color || css("--ink"), 11);
  ctx.restore();
};
// Annotation arrow (G11): {from:[x,y], to:[x,y], color, label}
Plot.prototype.annArrow = function(a){
  this.segment({ x1:a.from[0], y1:a.from[1], x2:a.to[0], y2:a.to[1], color:a.color, width:a.width || 2, arrow:true, dash:a.dash });
  if (a.label) this.label({ x:(a.from[0] + a.to[0]) / 2, y:(a.from[1] + a.to[1]) / 2, text:a.label, color:a.color, dy:-12, align:"center", bg:true });
};
// Asymptote (G1): {x:2} vertical, {y:1} horizontal, {m, b} oblique; dashed --ink-2, labelled.
Plot.prototype.asymptote = function(a){
  var v = this.v, ctx = this.ctx, col = a.color || css("--ink-2");
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.setLineDash(a.dash || [8, 6]); ctx.beginPath();
  var lab = a.label, lx, ly, al = "left";
  if (a.x != null) { ctx.moveTo(this.X(a.x), 0); ctx.lineTo(this.X(a.x), this.H); lab = lab == null ? "x = " + num(a.x) : lab; lx = this.X(a.x) + 5; ly = 14; if (lx > this.W - 60) { lx -= 10; al = "right"; } }
  else if (a.y != null) { ctx.moveTo(0, this.Y(a.y)); ctx.lineTo(this.W, this.Y(a.y)); lab = lab == null ? "y = " + num(a.y) : lab; lx = this.W - 6; ly = this.Y(a.y) - 10; al = "right"; }
  else { ctx.moveTo(0, this.Y(a.m * v.xmin + a.b)); ctx.lineTo(this.W, this.Y(a.m * v.xmax + a.b)); lx = 8; ly = this.Y(a.m * (v.xmin + (v.xmax - v.xmin) * 0.06) + a.b) - 12; }
  ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  if (lab) { ctx.font = "italic 13px " + (this.fontM || "serif"); ctx.fillStyle = col; ctx.textAlign = al; ctx.textBaseline = "middle"; ctx.fillText(lab, lx, ly); }
};
// Line through two points (secant) or a tangent (G5): {p:[x,y], q:[x,y]} or {x0, f, tangent:true}; label e.g. "slope ≈ 2.3"
Plot.prototype.line = function(l){
  var p = l.p, q = l.q, v = this.v;
  if (l.tangent) { var h = 1e-5, y0 = l.f(l.x0), m = (l.f(l.x0 + h) - l.f(l.x0 - h)) / (2 * h); p = [l.x0, y0]; q = [l.x0 + 1, y0 + m]; }
  var dx = q[0] - p[0], dy = q[1] - p[1], x1, y1, x2, y2;
  if (Math.abs(dx) < 1e-12) { x1 = x2 = p[0]; y1 = v.ymin; y2 = v.ymax; }
  else { var m2 = dy / dx; x1 = v.xmin; x2 = v.xmax; y1 = p[1] + m2 * (x1 - p[0]); y2 = p[1] + m2 * (x2 - p[0]); }
  if (l.segmentOnly) { x1 = p[0]; y1 = p[1]; x2 = q[0]; y2 = q[1]; }
  this.segment({ x1:x1, y1:y1, x2:x2, y2:y2, color:l.color || (l.tangent ? css("--ink") : css("--ink-2")), width:l.width || 2, dash:l.dash });
  if (l.label) this.label({ x:(l.tangent ? p[0] : (p[0] + q[0]) / 2), y:(l.tangent ? p[1] : (p[1] + q[1]) / 2), text:l.label, dx:12, dy:-16, bg:true, color:l.color || css("--ink") });
};
// Region (G6): shade between f and g (or the x-axis) for x0..x1. {f, g?, x0, x1, color, alpha, where:"above"|"below"}
Plot.prototype.region = function(r){
  var ctx = this.ctx, v = this.v, x0 = Math.max(r.x0 == null ? v.xmin : r.x0, v.xmin), x1 = Math.min(r.x1 == null ? v.xmax : r.x1, v.xmax), N = 200, i, x;
  var g = r.g || function(){ return 0; };
  ctx.save(); ctx.globalAlpha = r.alpha == null ? 1 : r.alpha; ctx.fillStyle = r.color || css("--hi-soft"); ctx.beginPath();
  var clampY = function(y){ return Math.max(v.ymin - 1, Math.min(v.ymax + 1, y)); };
  for (i = 0; i <= N; i++) { x = x0 + (x1 - x0) * i / N; var y = r.f(x); if (r.where === "above" && y < g(x)) y = g(x); if (r.where === "below" && y > g(x)) y = g(x); var Y = this.Y(clampY(y)); if (i === 0) ctx.moveTo(this.X(x), Y); else ctx.lineTo(this.X(x), Y); }
  for (i = N; i >= 0; i--) { x = x0 + (x1 - x0) * i / N; ctx.lineTo(this.X(x), this.Y(clampY(g(x)))); }
  ctx.closePath(); ctx.fill(); ctx.restore();
};

// ---------- Number-line mode (G14) ----------
// nl: { min, max, step:1, every:1 (label every n ticks), pieces:[{a,b,aIn,bIn}], style:"set"|"outline", hatch:[pieces],
//       dots:[{x, closed, color}], marks:[{x, label, color}], half:false }
Plot.prototype.numberLine = function(nl){
  var ctx = this.ctx, W = this.W, H = this.H, self = this, pad = 22;
  this.v = { xmin:nl.min - (nl.max - nl.min) * 0, xmax:nl.max, ymin:-1, ymax:1 };
  // map with side padding so arrows/dots at the ends stay visible
  var x0 = pad, x1 = W - pad;
  this.X = function(x){ return x0 + (x - nl.min) / (nl.max - nl.min) * (x1 - x0); };
  this.xOf = function(px){ return nl.min + (px - x0) / (x1 - x0) * (nl.max - nl.min); };
  var cy = Math.round(H * (nl.y || 0.5)) + 0.5, band = Math.min(26, H * 0.32);
  var X = function(x){ return x === -Infinity ? 2 : x === Infinity ? W - 2 : self.X(x); };
  var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2");
  var pieces = nl.pieces || [];
  // set: highlighter band + thick pen line
  pieces.forEach(function(p){
    var a = X(p.a), b = X(p.b);
    if (nl.style === "outline") { ctx.save(); ctx.strokeStyle = ink2; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.strokeRect(a, cy - band / 2, Math.max(2, b - a), band); ctx.restore(); }
    else { ctx.fillStyle = css("--hi-soft"); ctx.fillRect(a, cy - band / 2, Math.max(2, b - a), band); }
  });
  (nl.hatch || []).forEach(function(p){
    var a = X(p.a), b = X(p.b);
    ctx.save(); ctx.beginPath(); ctx.rect(a, cy - band / 2, Math.max(2, b - a), band); ctx.clip();
    ctx.strokeStyle = ink2; ctx.lineWidth = 1.3; ctx.beginPath();
    for (var k = a - band; k < b + band; k += 6) { ctx.moveTo(k, cy + band / 2); ctx.lineTo(k + band, cy - band / 2); }
    ctx.stroke(); ctx.restore();
  });
  // axis + ticks
  ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(4, cy); ctx.lineTo(W - 4, cy); ctx.stroke();
  this.head([nl.max - 1, 0], [nl.max + (nl.max - nl.min) * 0.04, 0], ink, 9);
  this.head([nl.min + 1, 0], [nl.min - (nl.max - nl.min) * 0.04, 0], ink, 9);
  var step = nl.step || 1, every = nl.every || (W < 420 && (nl.max - nl.min) / step > 12 ? 2 : 1), k2 = 0;
  ctx.font = "12px " + this.fontUI; ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "top";
  for (var t = Math.ceil(nl.min / step) * step; t <= nl.max + 1e-9; t += step, k2++) {
    var px = Math.round(this.X(t)) + 0.5, major = Math.round(t / step) % every === 0;
    ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, cy - (major ? 6 : 3)); ctx.lineTo(px, cy + (major ? 6 : 3)); ctx.stroke();
    if (major) ctx.fillText(num(t), px, cy + band / 2 + 4);
  }
  // pieces: pen line, arrows at infinite ends
  pieces.forEach(function(p){
    if (nl.style === "outline") return;
    var a = X(p.a), b = X(p.b);
    ctx.strokeStyle = p.color || pen; ctx.lineWidth = 4; ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(a, cy); ctx.lineTo(b, cy); ctx.stroke();
    var px2 = function(x){ return self.xOf(x); };
    if (p.a === -Infinity) self.head([px2(14), 0], [px2(0), 0], p.color || pen, 12);
    if (p.b === Infinity) self.head([px2(W - 14), 0], [px2(W), 0], p.color || pen, 12);
  });
  (nl.hatch || []).forEach(function(p){
    var px2 = function(x){ return self.xOf(x); };
    if (p.a === -Infinity) self.head([px2(14), 0], [px2(0), 0], ink2, 11);
    if (p.b === Infinity) self.head([px2(W - 14), 0], [px2(W), 0], ink2, 11);
  });
  var dots = (nl.dots || []).slice();
  pieces.forEach(function(p){
    if (nl.style === "outline") return;
    if (isFinite(p.a)) dots.push({ x:p.a, closed:p.aIn, color:p.color });
    if (isFinite(p.b) && p.b !== p.a) dots.push({ x:p.b, closed:p.bIn, color:p.color });
  });
  dots.forEach(function(d){
    var px = self.X(d.x);
    ctx.beginPath(); ctx.arc(px, cy, d.r || 6.5, 0, Math.PI * 2);
    if (d.closed) { ctx.fillStyle = d.color || pen; ctx.fill(); }
    else { ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = d.color || pen; ctx.stroke(); }
    if (d.ring) { ctx.beginPath(); ctx.arc(px, cy, (d.r || 6.5) + 5, 0, Math.PI * 2); ctx.lineWidth = 2.5; ctx.strokeStyle = css("--hi"); ctx.stroke(); }
  });
  (nl.marks || []).forEach(function(mk){
    var px = self.X(mk.x);
    ctx.font = "600 13px " + self.fontM; ctx.fillStyle = mk.color || ink; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    ctx.fillText(mk.label || "", px, cy - band / 2 - 4);
  });
};

MV.redrawAll = function(){ PLOTS.forEach(function(p){ if (p.render) p.render(); }); };

// ---------- K10 tween ----------
MV.ease = function(t){ return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
// MV.tween({dur:ms, step(t 0..1 eased), done()}) -> cancel(). With reduced motion it jumps to the end.
MV.tween = function(o){
  var dur = MV.reduceMotion ? 0 : (o.dur == null ? 800 : o.dur), t0 = null, live = true, ease = o.ease || MV.ease;
  // Reduced motion: jump to the end now, but run done() just after this call returns, so the
  // common pattern  x = MV.tween({ done(){ x = null } })  works (done must not run before the
  // caller stores the cancel function). Cancelling before then skips done, as in the animated path.
  if (!dur) { o.step(1); var alive = true; if (o.done) Promise.resolve().then(function(){ if (alive) o.done(); }); return function(){ alive = false; }; }
  function tick(now){
    if (!live) return;
    if (t0 === null) t0 = now;
    var t = Math.min(1, (now - t0) / dur);
    o.step(ease(t));
    if (t < 1) requestAnimationFrame(tick); else if (o.done) o.done();
  }
  requestAnimationFrame(tick);
  return function(){ live = false; };
};
// Promise-free delay that respects reduced motion (short delays become tiny).
MV.wait = function(ms, fn){ return setTimeout(fn, MV.reduceMotion ? Math.min(ms, 60) : ms); };

// ---------- G7 draggable points ----------
// MV.drag(plot, {
//   handles: function(){ return [{id, x, y, label}] },        // current handle positions (data units)
//   move: function(id, x, y, how){},                           // called with snapped coords; how = "drag"|"key"
//   snap: function(x, y, id){ return [x, y]; },                // optional
//   step: {x:1, y:1}, big: 5, axis: "x"|"y"|"xy",
//   key: function(id, e){ return true if handled }             // optional extra keys (e.g. O / C)
// })  The canvas must sit inside an element with class "plot-wrap". Returns {sync(), focus(id)}.
MV.drag = function(plot, o){
  var wrap = plot.c.parentNode, btns = {}, active = null, axis = o.axis || "xy";
  if (wrap && !wrap.classList.contains("plot-wrap")) wrap.classList.add("plot-wrap");
  plot.c.style.touchAction = axis === "x" ? "pan-y" : "none";
  var step = o.step || { x:1, y:1 }, big = o.big || 5;
  function snap(x, y, id){ return o.snap ? o.snap(x, y, id) : [x, y]; }
  function sync(){
    var hs = o.handles(), seen = {};
    hs.forEach(function(h){
      seen[h.id] = 1;
      var b = btns[h.id];
      if (!b) {
        b = document.createElement("button"); b.type = "button"; b.className = "drag-h"; b.dataset.h = h.id;
        b.addEventListener("keydown", function(e){
          var id = b.dataset.h, cur = o.handles().filter(function(q){ return q.id === id; })[0]; if (!cur) return;
          if (o.key && o.key(id, e)) { e.preventDefault(); return; }
          var m = e.shiftKey ? big : 1, dx = 0, dy = 0;
          if (e.key === "ArrowLeft") dx = -1; else if (e.key === "ArrowRight") dx = 1; else if (e.key === "ArrowUp") dy = 1; else if (e.key === "ArrowDown") dy = -1; else return;
          if (axis === "x") { if (dy) { dx = dy; dy = 0; } } else if (axis === "y") { if (dx) { dy = dx; dx = 0; } }
          e.preventDefault();
          var nx = cur.x + dx * (step.x || 1) * m, ny = cur.y + dy * (step.y || 1) * m, s = snap(nx, ny, id);
          o.move(id, s[0], s[1], "key");
        });
        b.addEventListener("pointerdown", function(e){ start(e, b.dataset.h); });
        wrap.appendChild(b); btns[h.id] = b;
      }
      b.style.left = (plot.c.offsetLeft + plot.X(h.x)) + "px";
      b.style.top = (plot.c.offsetTop + (axis === "x" && plot.sc && plot.sc.numberLine ? plot.H * (plot.sc.numberLine.y || 0.5) : plot.Y(h.y))) + "px";
      b.setAttribute("aria-label", h.label || ("Point at " + num(h.x) + ", " + num(h.y)));
    });
    Object.keys(btns).forEach(function(id){ if (!seen[id]) { btns[id].remove(); delete btns[id]; } });
  }
  function toData(e){ var r = plot.c.getBoundingClientRect(); return [plot.xOf(e.clientX - r.left), plot.yOf(e.clientY - r.top)]; }
  function start(e, id){
    if (!id) {
      var r = plot.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, best = null, bd = 26;
      o.handles().forEach(function(h){
        var hy = (axis === "x" && plot.sc && plot.sc.numberLine) ? plot.H * (plot.sc.numberLine.y || 0.5) : plot.Y(h.y);
        var d = Math.hypot(plot.X(h.x) - px, hy - py); if (d < bd) { bd = d; best = h.id; }
      });
      id = best;
    }
    if (!id) return;
    e.preventDefault(); active = id;
    try { plot.c.setPointerCapture(e.pointerId); } catch (err) {}
    if (btns[id]) btns[id].focus({ preventScroll:true });
  }
  plot.c.addEventListener("pointerdown", function(e){ start(e, null); });
  plot.c.addEventListener("pointermove", function(e){
    if (!active) return;
    var d = toData(e), s = snap(d[0], d[1], active); o.move(active, s[0], s[1], "drag");
  });
  function end(){ if (active && o.end) o.end(active); active = null; }
  plot.c.addEventListener("pointerup", end); plot.c.addEventListener("pointercancel", end);
  plot.onDrawn(sync);
  return { sync:sync, focus:function(id){ if (btns[id]) btns[id].focus(); }, buttons:btns };
};
})();
