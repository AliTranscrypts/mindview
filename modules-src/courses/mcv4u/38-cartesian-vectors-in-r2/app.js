// MCV4U 38 Cartesian Vectors in R²: hero (an arrow of length 8 sweeps to 150°, its component legs drop onto the axes and a
// compass rose names its bearing), Component converter (Explore: V3 2D vector board with Polar → Cartesian, Cartesian → polar
// and Bearing modes, special points, reference triangle, i/j arrows, compass rose and the tan⁻¹ check), Algebra with
// components (Part 3: add by components, AB and equal vectors, the parallel test), Components at work (Practice 2, V8 exact
// boxes) and the "First leg west" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function md(s){ return MV.md(s == null ? "" : String(s)); }
var D2R = Math.PI / 180, R3 = Math.sqrt(3);
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function near(a, b){ return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)); }
function isInt(v){ return typeof v === "number" && Number.isInteger(v); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
function mod360(d){ d = d % 360; if (d < 0) d += 360; if (Math.abs(d - 360) < 1e-9 || Math.abs(d) < 1e-9) d = 0; return d; }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + md(o.t) + "</button>"; }).join("") + "</span>";
}

// =====================================================================================================================
// @component V3exact — exact vector components p/d·√k (special angles, special points, simplified radicals) with
// m() sources, plain text and spoken text; trigE(deg) gives exact cos/sin at multiples of 30° and 45° (null otherwise).
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function E(p, d, k){ d = d || 1; k = k || 1; if (!p) return { p:0, d:1, k:1 }; var g = gcd(p, d) || 1; p /= g; d /= g; if (d < 0) { p = -p; d = -d; } return { p:p, d:d, k:k }; }
function Ev(e){ return e.p / e.d * Math.sqrt(e.k); }
function Esrc(e){ if (!e.p) return "0"; var a = Math.abs(e.p), s = (e.p < 0 ? "-" : "") + (e.k > 1 ? (a === 1 ? "" : a) + "√" + e.k : String(a)); return e.d > 1 ? s + "/" + e.d : s; }
function Etxt(e){ return Esrc(e).replace("-", MINUS); }
function Escale(e, r){ return E(e.p * r, e.d, e.k); }
function simpRad(n){ var f = 1; for (var i = 2; i * i <= n; i++) while (n % (i * i) === 0) { n /= i * i; f *= i; } return E(f, 1, n); }
var BASE = { 0:[1, 1, 1], 30:[1, 2, 3], 45:[1, 2, 2], 60:[1, 2, 1], 90:[0, 1, 1] };
function cosRef(a){ var b = BASE[a]; return b ? E(b[0], b[1], b[2]) : null; }
function trigE(deg){
  if (!isInt(deg)) return null;
  deg = mod360(deg);
  var ref, sx, sy;
  if (deg <= 90) { ref = deg; sx = 1; sy = 1; } else if (deg <= 180) { ref = 180 - deg; sx = -1; sy = 1; }
  else if (deg <= 270) { ref = deg - 180; sx = -1; sy = -1; } else { ref = 360 - deg; sx = 1; sy = -1; }
  var c = cosRef(ref), s = cosRef(90 - ref);
  if (!c || !s) return null;
  return { c:E(sx * c.p, c.d, c.k), s:E(sy * s.p, s.d, s.k) };
}
function f1(v){ return (Math.abs(v) < 0.05 ? 0 : v).toFixed(1); }
function spoken(s){ return s.replace(/[-−]/g, "negative ").replace(/√/g, " root ").replace(/\//g, " over ").replace(/≈/g, "about ").replace(/\s+/g, " ").trim(); }
// vector records: {x, y, ex, ey (exact or null), rE (exact magnitude), r, deg (0 ≤ deg < 360), degExact}
function vPolar(r, deg){
  var ir = isInt(r), t = ir ? trigE(deg) : null, ex = t ? Escale(t.c, r) : null, ey = t ? Escale(t.s, r) : null;
  return { x:ex ? Ev(ex) : r * Math.cos(deg * D2R), y:ey ? Ev(ey) : r * Math.sin(deg * D2R), ex:ex, ey:ey, rE:ir ? E(r) : null, r:r, deg:mod360(deg), degExact:isInt(deg) };
}
function magTxt(V){ return V.rE ? Etxt(V.rE) : "≈ " + num(V.r, 1); }
function vCart(a, b){
  var d = mod360(Math.atan2(b, a) / D2R), ex = Math.abs(d - Math.round(d)) < 1e-7;
  return { x:a, y:b, ex:E(a), ey:E(b), rE:simpRad(a * a + b * b), r:Math.hypot(a, b), deg:ex ? mod360(Math.round(d)) : d, degExact:ex };
}
function vSpecial(sp){ return { x:Ev(sp.x), y:Ev(sp.y), ex:sp.x, ey:sp.y, rE:sp.r, r:Ev(sp.r), deg:sp.deg, degExact:true }; }
function degTxt(d, exact){ return exact ? (d < 0 ? MINUS : "") + Math.abs(d) + "°" : "≈ " + (Math.round(d) < 0 ? MINUS : "") + Math.abs(Math.round(d)) + "°"; }
function pad3(n){ n = Math.round(n) % 360; return (n < 10 ? "00" : n < 100 ? "0" : "") + n; }
function bearingOf(V){ return mod360(90 - V.deg); }
function brTxt(b, exact){ return (exact ? "" : "≈ ") + pad3(b) + "°"; }
function qbTxt(b, exact){
  if (exact) { if (b === 0) return "due north"; if (b === 90) return "due east"; if (b === 180) return "due south"; if (b === 270) return "due west"; }
  var ns, a, ew;
  if (b < 90) { ns = "N"; a = b; ew = "E"; } else if (b < 180) { ns = "S"; a = 180 - b; ew = "E"; }
  else if (b < 270) { ns = "S"; a = b - 180; ew = "W"; } else { ns = "N"; a = 360 - b; ew = "W"; }
  return (exact ? "" : "≈ ") + ns + " " + Math.round(a) + "° " + ew;
}
function coef(s){ return s === "1" ? "" : s === "-1" ? "-" : s + " "; }
function ijSrc(xs, ys){
  var out = "";
  if (xs !== "0") out = coef(xs) + "vec{i}";
  if (ys !== "0") out = out ? out + (ys.charAt(0) === "-" ? " - " + coef(ys.slice(1)) : " + " + coef(ys)) + "vec{j}" : coef(ys) + "vec{j}";
  return out || "vec{0}";
}
function cartHTML(V){
  if (V.ex && V.ey) { var a = Esrc(V.ex), b = Esrc(V.ey); return m("(" + a + ", " + b + ") = " + ijSrc(a, b)); }
  var x = f1(V.x), y = f1(V.y);
  return "≈ " + m("(" + x + ", " + y + ") = " + ijSrc(x, y));
}
function quadOf(V){ var e = 1e-9; if (Math.abs(V.y) < e) return V.x > 0 ? "px" : "nx"; if (Math.abs(V.x) < e) return V.y > 0 ? "py" : "ny"; return V.x > 0 ? (V.y > 0 ? 1 : 4) : (V.y > 0 ? 2 : 3); }
function refDeg(V){ var d = V.deg, q = quadOf(V); return q === 1 ? d : q === 2 ? 180 - d : q === 3 ? d - 180 : 360 - d; }
function compTxt(V){ return V.ex && V.ey ? [Etxt(V.ex), Etxt(V.ey)] : ["≈ " + f1(V.x).replace("-", MINUS), "≈ " + f1(V.y).replace("-", MINUS)]; }
function describeV(V, lead){
  var c = compTxt(V), b = bearingOf(V);
  return (lead || "Vector") + " " + spoken(magTxt(V)) + " units at " + spoken(degTxt(V.deg, V.degExact)).replace("°", " degrees") +
    ": components " + spoken(c[0]) + ", " + spoken(c[1]) + "; true bearing " + spoken(brTxt(b, V.degExact)).replace("°", " degrees") + ", " + qbTxt(b, V.degExact) + ".";
}

// ---------- canvas helpers ----------
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font; ctx.textAlign = align || "center"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "left" ? X : align === "right" ? X - w : X - w / 2;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 3, Y - 10, w + 6, 20); ctx.globalAlpha = 1;
  ctx.fillStyle = color; ctx.fillText(text, X, Y); ctx.restore();
}
function arrow(ctx, p, x1, y1, x2, y2, color, w, dash, alpha){
  var X1 = p.X(x1), Y1 = p.Y(y1), X2 = p.X(x2), Y2 = p.Y(y2), L = Math.hypot(X2 - X1, Y2 - Y1); if (L < 2) return;
  var hl = Math.min(9 + 2.2 * w, L * 0.55), ux = (X2 - X1) / L, uy = (Y2 - Y1) / L, hw = hl * 0.46;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w; ctx.lineCap = "round";
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(X1, Y1); ctx.lineTo(X2 - ux * hl * 0.85, Y2 - uy * hl * 0.85); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(X2, Y2); ctx.lineTo(X2 - ux * hl - uy * hw, Y2 - uy * hl + ux * hw); ctx.lineTo(X2 - ux * hl + uy * hw, Y2 - uy * hl - ux * hw); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// a letter with an over-arrow (u⃗, v⃗, i⃗, j⃗) drawn on canvas
function vname(ctx, ch, X, Y, color, px){
  px = px || 16; ctx.save(); ctx.font = mfont(px); ctx.textAlign = "center"; ctx.textBaseline = "middle";
  var w = ctx.measureText(ch).width;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(X - w / 2 - 4, Y - px * 0.95, w + 8, px * 1.6); ctx.globalAlpha = 1;
  ctx.fillStyle = color; ctx.fillText(ch, X, Y);
  var ay = Y - px * 0.66, x0 = X - w / 2 - 1, x1 = X + w / 2 + 3;
  ctx.strokeStyle = color; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x0, ay); ctx.lineTo(x1 - 2, ay); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x1 + 1, ay); ctx.lineTo(x1 - 4, ay - 2.8); ctx.lineTo(x1 - 4, ay + 2.8); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function tickFmt(every){ return function(t){ var r = Math.round(t); return Math.abs(t - r) < 1e-6 && r % every === 0 ? num(r) : ""; }; }
function gridScene(view, every, after, describe){
  return { view:view, equal:true, xTicks:{ step:1, fmt:tickFmt(every) }, yTicks:{ step:1, fmt:tickFmt(every) }, xLabel:"x", yLabel:"y", after:after, describe:describe };
}

// =====================================================================================================================
// @component V3 vectorBoard — the 2D vector board drawing (MCV4U 33–36, 38, 41–43, 45, 48, 49): drawV(ctx, plot, V, o) draws
// u⃗ from the origin (--pen, 3.2 px, over-arrow name) with, by option, dashed component legs in --ink-2 labelled with exact
// values (o.legs, o.legAlpha), the reference triangle (--hi-soft) with its reference-angle arc (o.tri), i⃗/j⃗ unit arrows at
// the origin repeated along each leg (o.ij), the cerulean θ arc from the positive x-axis (o.theta), and a compass rose at the
// tail (--ink-2, 60%) with north and east arms and the clockwise bearing arc β in ink (o.rose = alpha, o.bear).
function drawV(ctx, p, V, o){
  var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), cer = css("--p-t"), U = Math.abs(p.X(1) - p.X(0));
  var ox = p.X(0), oy = p.Y(0), x = V.x, y = V.y, len = Math.hypot(x, y) * U, va = -Math.atan2(y, x), q = quadOf(V);
  var Rt = clamp(len * 0.5, 22, 48), Rr = clamp(p.W * 0.2, 60, 110);
  // reference triangle and reference-angle arc
  if (o.tri && typeof q === "number") {
    ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(p.X(x), oy); ctx.lineTo(p.X(x), p.Y(y)); ctx.closePath(); ctx.fill();
    var base = x > 0 ? 0 : Math.PI, d = va - base; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    var Rf = clamp(len * 0.28, 14, 30);
    ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(ox, oy, Rf, base, base + d, d < 0); ctx.stroke();
    // right-angle mark at the foot of the leg
    var sx = x > 0 ? -1 : 1, sy = y > 0 ? -1 : 1, s = 8, fx = p.X(x);
    ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(fx + sx * s, oy); ctx.lineTo(fx + sx * s, oy + sy * s); ctx.lineTo(fx, oy + sy * s); ctx.stroke();
    ctx.restore();
    if (q !== 1 || !o.theta) { var mid = base + d / 2; bgText(ctx, degTxt(refDeg(V), V.degExact), ox + Math.cos(mid) * (Rf + 18), oy + Math.sin(mid) * (Rf + 14), "center", ink, ui(12, 700)); }
  }
  // component legs
  if (o.legs) {
    var la = o.legAlpha == null ? 1 : o.legAlpha, c = compTxt(V);
    ctx.save(); ctx.globalAlpha = la; ctx.strokeStyle = ink2; ctx.lineWidth = 2.2; ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(p.X(x), oy); ctx.lineTo(p.X(x), p.Y(y)); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha = la;
    if (Math.abs(x) > 1e-9) bgText(ctx, c[0], p.X(x / 2), oy + (y >= 0 ? 15 : -15), "center", ink2, ui(13, 700));
    if (Math.abs(y) > 1e-9) bgText(ctx, c[1], p.X(x) + (x >= 0 ? 9 : -9), p.Y(y / 2), x >= 0 ? "left" : "right", ink2, ui(13, 700));
    ctx.restore();
  }
  // i and j: unit arrows at the origin, repeated along each leg
  if (o.ij) {
    var nx = Math.floor(Math.abs(x) + 1e-9), ny = Math.floor(Math.abs(y) + 1e-9), gx = x < 0 ? -1 : 1, gy = y < 0 ? -1 : 1, k;
    for (k = 1; k <= nx; k++) arrow(ctx, p, (k - 1) * gx, 0, k * gx, 0, ink, 1.6, null, 0.7);
    for (k = 1; k <= ny; k++) arrow(ctx, p, x, (k - 1) * gy, x, k * gy, ink, 1.6, null, 0.7);
    arrow(ctx, p, 0, 0, 1, 0, ink, 2.8); arrow(ctx, p, 0, 0, 0, 1, ink, 2.8);
    vname(ctx, "i", p.X(0.5), oy + 15, ink, 14); vname(ctx, "j", ox - 12, p.Y(0.55), ink, 14);
  }
  // θ arc (cerulean, counterclockwise from the positive x-axis)
  if (o.theta && V.deg > 1e-9) {
    ctx.save(); ctx.strokeStyle = cer; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(ox, oy, Rt, 0, -V.deg * D2R, true); ctx.stroke(); ctx.restore();
    var tm = -V.deg * D2R / 2;
    bgText(ctx, "θ = " + degTxt(V.deg, V.degExact), ox + Math.cos(tm) * (Rt + 30), oy + Math.sin(tm) * (Rt + 16), "center", cer, ui(13, 700));
  }
  // compass rose, north and east arms, clockwise bearing arc β
  if (o.rose) {
    ctx.save(); ctx.globalAlpha = 0.6 * o.rose; ctx.strokeStyle = ink2; ctx.fillStyle = ink2; ctx.lineWidth = 1.4;
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4, rr = i % 2 ? Rr * 0.55 : Rr; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + Math.cos(a) * rr, oy + Math.sin(a) * rr); ctx.stroke(); }
    ctx.font = ui(13, 700); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("N", ox, oy - Rr - 10); ctx.fillText("S", ox, oy + Rr + 10); ctx.fillText("E", ox + Rr + 10, oy); ctx.fillText("W", ox - Rr - 10, oy);
    ctx.restore();
    if (o.bear) {
      var b = bearingOf(V), Rb = Rr * 0.72;
      ctx.save(); ctx.globalAlpha = o.rose; ctx.strokeStyle = ink; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - Rr); ctx.moveTo(ox, oy); ctx.lineTo(ox + Rr, oy); ctx.stroke();
      if (b > 1e-9) { ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ox, oy, Rb, -Math.PI / 2, -Math.PI / 2 + b * D2R, false); ctx.stroke(); }
      ctx.restore();
      if (b > 1e-9) { var bm = -Math.PI / 2 + b * D2R / 2; ctx.save(); ctx.globalAlpha = o.rose; bgText(ctx, "β = " + brTxt(b, V.degExact), ox + Math.cos(bm) * (Rb + 30), oy + Math.sin(bm) * (Rb + 14), "center", ink, ui(13, 700)); ctx.restore(); }
    }
  }
  // the vector
  arrow(ctx, p, 0, 0, x, y, o.color || pen, 3.2);
  if (o.name !== false) { var nl = 16 / Math.max(len, 1); vname(ctx, o.name || "u", p.X(x) + (x * U * nl) + 2, p.Y(y) - (y * U * nl) - 4, o.color || pen, 16); }
}

// =====================================================================================================================
// ---------- Hero ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var VW = { xmin:-9.5, xmax:9.5, ymin:-9.5, ymax:9.5 }, p = new MV.Plot(cv, VW, { equal:true }), st = { deg:0, legs:0, rose:0 };
  function draw(){
    var V = vPolar(8, st.deg >= 150 - 1e-9 ? 150 : st.deg);
    p.draw(gridScene(VW, 4, function(ctx, pp){
      drawV(ctx, pp, V, { legs:st.legs > 0, legAlpha:st.legs, theta:true, rose:st.rose, bear:st.rose > 0 });
      if (st.rose > 0) { ctx.save(); ctx.globalAlpha = st.rose; bgText(ctx, "true bearing 300°, N 60° W", pp.W - 10, 18, "right", css("--ink"), ui(13, 700)); ctx.restore(); }
    }, "An arrow of length 8 at " + Math.round(V.deg) + " degrees" + (st.legs > 0 ? ", with components negative 4 root 3 and 4" : "") + (st.rose > 0 ? "; true bearing 300 degrees, N 60 W." : ".")));
    if (f.cap) {
      var full = m("8(cos 150°, sin 150°) = (-4√3, 4) = -4√3 vec{i} + 4 vec{j}");
      f.cap.innerHTML = st.rose > 0 ? full + " · true bearing 300°, N 60° W" : st.legs > 0 ? full : m("|vec{u}| = 8") + ", θ " + degTxt(Math.round(st.deg), true);
    }
  }
  p.render = draw;
  function fin(){ st.deg = 150; st.legs = 1; st.rose = 1; draw(); }
  if (MV.reduceMotion) { fin(); return; }
  draw();
  var lin = function(t){ return t; };
  MV.wait(700, function(){
    MV.tween({ dur:2400, ease:lin, step:function(t){ st.deg = 150 * t; draw(); }, done:function(){ st.deg = 150; draw();
      MV.wait(500, function(){ MV.tween({ dur:700, step:function(t){ st.legs = Math.max(0.01, t); draw(); }, done:function(){ st.legs = 1; draw();
        MV.wait(1300, function(){ MV.tween({ dur:900, step:function(t){ st.rose = Math.max(0.01, t); draw(); }, done:fin }); });
      } }); });
    } });
  });
}

// =====================================================================================================================
// ---------- Explore: Component converter (V3 board, three modes) ----------
var VIEW = { xmin:-12.6, xmax:12.6, ymin:-12.6, ymax:12.6 };
var SNAP = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {}, SP = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  C.specials.forEach(function(s){ SP[s.id] = s; });
  if (["polar", "cart", "bear"].indexOf(S.mode) < 0) S.mode = "polar";
  if (!(isInt(S.r) && S.r >= 1 && S.r <= 12)) S.r = 8;
  if (!(isInt(S.deg) && S.deg >= 0 && S.deg < 360 && S.deg % 15 === 0)) S.deg = 150;
  if (!(isInt(S.cx) && isInt(S.cy) && Math.abs(S.cx) <= 12 && Math.abs(S.cy) <= 12 && (S.cx || S.cy))) { S.cx = 3; S.cy = 4; }
  if (S.sp && !SP[S.sp]) S.sp = null;
  if (S.legs == null) S.legs = true;
  ["tri", "ij", "snap"].forEach(function(k){ if (S[k] == null) S[k] = false; });
  var busy = false, note = null, pair = null, flash = false, more = false, ov = null, stop = null;
  var MORE = { ref:1, tan:1, br:1, qb:1 };

  host.innerHTML = '<div class="cv-ex"><div class="cv-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot square cv-board" id="cv-board" role="img" aria-label="Vector board"></canvas></div>' +
    '<p class="tiny muted cv-key">' + md(T.key) + "</p></div>" +
    '<div class="cv-side"><div class="cv-modes" id="cv-mode"></div><div class="cv-ctrl" id="cv-ctrl"></div><div class="cv-tog" id="cv-tog"></div>' +
    '<div class="cv-readw" id="cv-readw"><dl class="read cv-read" id="cv-read" aria-live="polite"></dl>' +
    '<button type="button" class="btn ghost sm cv-more" data-act="more" data-k="more" aria-expanded="false">' + T.more + "</button></div></div></div>";
  var plot = new MV.Plot($("#cv-board", host), VIEW, { equal:true });

  function cur(){ if (ov) return ov; return S.mode === "cart" ? (S.sp ? vSpecial(SP[S.sp]) : vCart(S.cx, S.cy)) : vPolar(S.r, S.deg); }
  function qbOf(){ var b = mod360(90 - S.deg); if (b < 90) return { ns:"N", a:b, ew:"E" }; if (b < 180) return { ns:"S", a:180 - b, ew:"E" }; if (b < 270) return { ns:"S", a:b - 180, ew:"W" }; return { ns:"N", a:360 - b, ew:"W" }; }
  function setQb(q){ var b = q.ns === "N" ? (q.ew === "E" ? q.a : 360 - q.a) : (q.ew === "E" ? 180 - q.a : 180 + q.a); S.deg = mod360(90 - b); }

  // ---- drawing ----
  function draw(){
    var V = cur(), bear = S.mode === "bear";
    plot.draw(gridScene(VIEW, 4, function(ctx, p){
      drawV(ctx, p, V, { legs:S.legs && !pair, tri:S.tri && !pair, ij:S.ij && !pair, theta:!pair, rose:bear ? 1 : 0, bear:bear });
      if (pair) {
        var t = pair.t, f3 = css("--f3");
        arrow(ctx, p, 3 * t, 4 * t, 3 * t - 3, 4 * t + 4, f3, 3.2);
        vname(ctx, "v", p.X(3 * t - 3) - 14, p.Y(4 * t + 4) + 2, f3, 16);
        if (pair.sum) { arrow(ctx, p, 0, 0, 0, 8, css("--ink"), 3.4); bgText(ctx, "(0, 8)", p.X(0) - 10, p.Y(8.4), "right", css("--ink"), ui(13, 700)); }
      }
      if (note) bgText(ctx, note, 10, 18, "left", css("--ink"), ui(14, 700));
    }, pair ? "u = (3, 4) and v = (−3, 4) placed tip to tail" + (pair.sum ? "; the sum (0, 8) points straight up, length 8." : ".") : describeV(V)));
  }
  // ---- readout ----
  function rows(){
    var V = cur(), R = T.rows, out = [], b = bearingOf(V), q = quadOf(V);
    out.push(["cart", R.cart, cartHTML(V)]);
    out.push(["mag", R.mag, V.rE ? m(Esrc(V.rE)) : magTxt(V)]);
    out.push(["th", R.th, degTxt(Math.round(V.deg * 1e6) / 1e6, V.degExact)]);
    out.push(["ref", R.ref, typeof q === "number" ? degTxt(refDeg(V), V.degExact) + " (" + T.quad[q - 1] + ")" : md(T.axis[q])]);
    if (V.x < -1e-9) {
      var a = V.ex && V.ey ? Esrc(V.ex) : f1(V.x), bb = V.ex && V.ey ? Esrc(V.ey) : f1(V.y), t = V.deg - 180;
      out.push(["tan", md(R.tan), m("tan^{-1}(" + bb + "/(" + a + "))") + " = " + degTxt(V.degExact ? t : t, V.degExact) + " → " + T.add + " → " + degTxt(V.deg, V.degExact)]);
    }
    out.push(["br", R.br, brTxt(b, V.degExact)]);
    out.push(["qb", R.qb, qbTxt(b, V.degExact)]);
    return out;
  }
  function paintRead(){
    var w = $("#cv-readw", host);
    $("#cv-read", host).innerHTML = rows().map(function(r){
      return '<div class="cv-r' + (MORE[r[0]] ? " cv-mr" : "") + (r[0] === "tan" && flash ? " cv-flash" : "") + '"><dt>' + md(r[1]) + "</dt><dd>" + r[2] + "</dd></div>"; }).join("");
    w.classList.toggle("open", more);
    var mb = $(".cv-more", host); mb.textContent = more ? T.less : T.more; mb.setAttribute("aria-expanded", String(more));
  }
  // ---- controls ----
  function slider(id, label, min, max, step, accent){
    return '<label class="slider cv-sl"><span class="slider-top"><span>' + md(label) + '</span><output id="' + id + 'o"></output></span>' +
      '<input type="range" id="' + id + '" data-k="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:var(' + accent + ')" aria-label="' + MV.esc(MV.plain(md(label))) + '"></label>';
  }
  function paintMode(){ MV.keepFocus($("#cv-mode", host), function(){ $("#cv-mode", host).innerHTML = '<p class="tiny cv-h">' + T.mode + "</p>" + segBtns("mode", C.modes, S.mode, T.mode); }); }
  function paintCtrl(){
    var h = "";
    if (S.mode === "polar") h = slider("cv-r", T.r, 1, 12, 1, "--pen") + slider("cv-th", T.th, 0, 345, 15, "--p-t") + '<div class="cv-chips" id="cv-snapw"></div>';
    else if (S.mode === "cart") h = '<p class="tiny muted cv-note">' + md(T.dragNote) + '</p><p class="tiny cv-h">' + T.sp + '</p><div class="cv-chips" id="cv-sp" role="group" aria-label="' + MV.esc(T.sp) + '"></div><p class="tiny muted cv-note">' + T.spNote + "</p>";
    else h = slider("cv-r", T.r, 1, 12, 1, "--pen") + slider("cv-br", T.br, 0, 345, 15, "--ink") + '<p class="tiny cv-h">' + T.qb + '</p><div class="cv-qb" id="cv-qb"></div>';
    $("#cv-ctrl", host).innerHTML = h;
    syncCtrl();
  }
  function syncCtrl(){
    var r = $("#cv-r", host), th = $("#cv-th", host), br = $("#cv-br", host);
    if (r) { r.value = S.r; $("#cv-ro", host).textContent = String(S.r); r.setAttribute("aria-valuetext", String(S.r)); }
    if (th) { var d = Math.round(S.deg); th.value = d; $("#cv-tho", host).textContent = d + "°"; th.setAttribute("aria-valuetext", d + " degrees"); }
    if (br) { var b = Math.round(mod360(90 - S.deg)); br.value = b; $("#cv-bro", host).textContent = pad3(b) + "°"; br.setAttribute("aria-valuetext", pad3(b) + " degrees"); }
    var sw = $("#cv-snapw", host);
    if (sw) MV.keepFocus(sw, function(){ sw.innerHTML = '<button type="button" class="chip' + (S.snap ? " on" : "") + '" data-tog="snap" data-k="togsnap" aria-pressed="' + S.snap + '">' + T.snap + "</button>"; });
    var sp = $("#cv-sp", host);
    if (sp) MV.keepFocus(sp, function(){ sp.innerHTML = C.specials.map(function(s){ var on = S.sp === s.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-sp="' + s.id + '" data-k="sp' + s.id + '" aria-pressed="' + on + '">' + md(s.t) + "</button>"; }).join(""); });
    var qb = $("#cv-qb", host);
    if (qb) {
      var q = qbOf();
      MV.keepFocus(qb, function(){
        qb.innerHTML = segBtns("ns", [{ id:"N", t:"N" }, { id:"S", t:"S" }], q.ns, "North or south") +
          '<select id="cv-qba" data-k="qba" aria-label="Angle from north or south">' + [0, 15, 30, 45, 60, 75, 90].map(function(a){ return '<option value="' + a + '"' + (a === Math.round(q.a) ? " selected" : "") + ">" + a + "°</option>"; }).join("") + "</select>" +
          segBtns("ew", [{ id:"E", t:"E" }, { id:"W", t:"W" }], q.ew, "East or west");
      });
    }
  }
  function paintTog(){
    var tg = $("#cv-tog", host);
    MV.keepFocus(tg, function(){
      tg.innerHTML = '<p class="tiny cv-h">' + T.toggles + '</p><div class="cv-chips" role="group" aria-label="' + MV.esc(T.toggles) + '">' + ["legs", "tri", "ij"].map(function(k){
        return '<button type="button" class="chip' + (S[k] ? " on" : "") + '" data-tog="' + k + '" data-k="tog' + k + '" aria-pressed="' + !!S[k] + '">' + md(T[k]) + "</button>"; }).join("") + "</div>";
    });
  }
  function paintAll(){ paintMode(); paintCtrl(); paintTog(); paintRead(); draw(); }
  function refresh(){ syncCtrl(); paintTog(); paintRead(); draw(); }
  function changed(){ api.save(); refresh(); MV.changed(); }
  function user(){ note = null; pair = null; flash = false; }
  function lock(on){ $$("input, button, select", host).forEach(function(el){ el.disabled = !!on; }); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b) || b.classList.contains("drag-h")) return;
    var d = b.dataset;
    if (d.act === "more") { more = !more; paintRead(); return; }
    user();
    if (d.mode) { if (S.mode !== d.mode) { S.mode = d.mode; paintMode(); paintCtrl(); } changed(); return; }
    if (d.tog) { S[d.tog] = !S[d.tog]; if (d.tog === "snap" && S.snap && SNAP.indexOf(S.deg) < 0) S.deg = mod360(S.deg + 15); changed(); return; }
    if (d.sp) { S.sp = S.sp === d.sp ? null : d.sp; changed(); return; }
    if (d.ns || d.ew) { var q = qbOf(); if (d.ns) q.ns = d.ns; if (d.ew) q.ew = d.ew; setQb(q); changed(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (busy) { syncCtrl(); return; }
    if (t.id === "cv-r") { user(); S.r = clamp(Math.round(+t.value), 1, 12); changed(); }
    else if (t.id === "cv-th") {
      user(); var v = mod360(Math.round(+t.value / 15) * 15);
      if (S.snap && SNAP.indexOf(v) < 0) v = mod360(v > S.deg ? v + 15 : v - 15);
      S.deg = v; changed();
    }
    else if (t.id === "cv-br") { user(); S.deg = mod360(90 - Math.round(+t.value / 15) * 15); changed(); }
  });
  host.addEventListener("change", function(e){
    if (e.target.id !== "cv-qba" || busy) return;
    user(); var q = qbOf(); q.a = +e.target.value; setQb(q); changed();
  });
  MV.drag(plot, {
    handles:function(){ if (S.mode !== "cart" || busy) return []; var V = cur(), c = compTxt(V); return [{ id:"tip", x:V.x, y:V.y, label:"Tip of vector u at (" + c[0] + ", " + c[1] + "). Arrow keys move it." }]; },
    snap:function(x, y){ return [clamp(Math.round(x), -12, 12), clamp(Math.round(y), -12, 12)]; },
    move:function(id, x, y){
      if (busy || S.mode !== "cart" || (!x && !y)) return;
      if (!S.sp && x === S.cx && y === S.cy) return;
      user(); S.cx = x; S.cy = y; S.sp = null; changed();
    },
    step:{ x:1, y:1 }, big:5
  });
  plot.render = draw;
  paintAll();

  // ---- challenges (plan's exact tests and named wrong states) ----
  function chal(id){
    var M = MS[id];
    if (id === "tc1") {
      if (S.mode !== "polar") return { ok:false, msg:M.mode };
      if (S.r === 10 && S.deg === 120) return { ok:true };
      if (S.deg === 60) return { ok:false, msg:M.q1 };
      if (S.deg === 150) return { ok:false, msg:M.swap };
      if (S.r === 5) return { ok:false, msg:M.half };
      return { ok:false, msg:M.general };
    }
    if (S.mode !== "cart" || S.sp) return { ok:false, msg:M.mode };
    var a = S.cx, b = S.cy;
    if (id === "tc2") {
      if (a === 6 && b === -6) return { ok:true };
      if (a === -6 && b === 6) return { ok:false, msg:M.ccw };
      if (a === 6 && b === 6) return { ok:false, msg:M.ne };
      if (a === -6 && b === -6) return { ok:false, msg:M.sw };
      return { ok:false, msg:M.general };
    }
    if (a === -9 && b === 12) return { ok:true };
    if (a === 9 && b === -12) return { ok:false, msg:M.east };
    if (a === -6 && b === 8) return { ok:false, msg:M.short };
    if (a === -12 && b === 9) return { ok:false, msg:M.notpar };
    return { ok:false, msg:M.general };
  }

  // ---- predictions ----
  function tw(dur, step, done){ stop = MV.tween({ dur:dur, ease:function(t){ return t; }, step:step, done:function(){ stop = null; done(); } }); }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; ov = null; user(); more = false;
        if (p.id === "p1") { S.mode = "polar"; S.r = 6; S.deg = 0; S.legs = true; }
        else if (p.id === "p2") { S.mode = "cart"; S.sp = null; S.cx = 4; S.cy = 4; }
        else if (p.id === "p3") { S.mode = "bear"; S.r = 8; S.deg = 90; }
        else { S.mode = "cart"; S.sp = null; S.cx = 3; S.cy = 4; pair = { t:0, sum:false }; }
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; ov = null; api.save(); paintAll(); lock(false); paintAll(); MV.changed(); done(); }
        function show(nt, ms, cb){ note = nt; draw(); MV.wait(ms || 1300, cb); }
        if (p.id === "p1") tw(2000, function(t){ ov = vPolar(6, 150 * t); paintRead(); draw(); }, function(){ ov = null; S.deg = 150; paintRead(); show("(−3√3, 3): quadrant II", 1300, fin); });
        else if (p.id === "p2") tw(1200, function(t){ ov = vPolar(4 * Math.SQRT2, 45 + 180 * t); ov.rE = E(4, 1, 2); paintRead(); draw(); }, function(){
          ov = null; S.cx = -4; S.cy = -4; flash = true; more = true; paintRead(); show("tan⁻¹ says 45°; the arrow points to 225°", 1500, fin); });
        else if (p.id === "p3") tw(1200, function(t){ ov = vPolar(8, 90 - 30 * t); paintRead(); draw(); }, function(){ ov = null; S.deg = 60; paintRead(); show("030° from north = 60° from east", 1300, fin); });
        else tw(1600, function(t){ pair.t = t; draw(); }, function(){ pair.t = 1; pair.sum = true; show("|u + v| = |(0, 8)| = 8", 1300, fin); });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}
// ------------------------------------------------- end of V3 vectorBoard (Explore) -------------------------------------------

// =====================================================================================================================
// ---------- Part 3: Algebra with components ----------
function readBox(raw){
  var s = String(raw == null ? "" : raw).trim(); if (!s) return { empty:true };
  if (/\d\.\d|^\.\d|[^\d]\.\d/.test(s)) return { dec:true };
  var r = MV.parseNum(s); if (!r || r.length !== 1) return { err:true };
  return { v:r[0] };
}
function boxHTML(attr, k, val, label, dis){
  return '<input class="numin short cv-in" ' + attr + '="' + k + '" data-k="' + attr + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(val || "") + '"' + (dis ? " disabled" : "") + ">";
}
function part3(host, api){
  var S = api.S, C = api.content, L = C.labels, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  S.s1 = S.s1 || { v:{}, solved:false };
  if (!Array.isArray(S.A) || !isInt(S.A[0])) S.A = [1, 1];
  if (!Array.isArray(S.B) || !isInt(S.B[0])) S.B = [4, 3];
  if (S.nextP !== "A" && S.nextP !== "B") S.nextP = "A";
  if (!isInt(S.k3) || Math.abs(S.k3) > 8) S.k3 = 2;
  var s1msg = null, copy = null, copyN = 0, stopC = null;
  function algHTML(lines){ return '<details class="alg"><summary>' + L.working + '</summary><div class="alg-lines">' + lines.map(function(l){ return "<div>" + md(l) + "</div>"; }).join("") + "</div></details>"; }
  var R1 = S1.rows;
  host.innerHTML =
    '<div class="part cv-st" id="cv-s1"><h3>' + md(S1.title) + "</h3><p>" + md(S1.text) + '</p><div class="sym cv-stg"><div><div class="plot-wrap"><canvas class="plot" id="cv-p1" role="img" aria-label="' + MV.esc(S1.graph) + '"></canvas></div></div>' +
      '<div><div class="cv-rows" id="cv-b1"></div><div id="cv-c1"></div></div></div></div>' +
    '<div class="part cv-st" id="cv-s2"><h3>' + md(S2.title) + "</h3><p>" + md(S2.text) + '</p><div class="sym cv-stg"><div><div class="plot-wrap"><canvas class="plot square" id="cv-p2" role="img" aria-label="' + MV.esc(S2.graph) + '"></canvas></div></div>' +
      '<div><dl class="read" id="cv-r2" aria-live="polite"></dl><div class="q-actions"><button type="button" class="btn primary sm" data-p2="copy" data-k="p2copy">' + S2.copy + '</button></div><p class="cv-note2"><strong>' + md(S2.note) + "</strong></p></div></div></div>" +
    '<div class="part cv-st" id="cv-s3"><h3>' + md(S3.title) + "</h3><p>" + md(S3.text) + '</p><div class="sym cv-stg"><div><div class="plot-wrap"><canvas class="plot square" id="cv-p3" role="img" aria-label="' + MV.esc(S3.graph) + '"></canvas></div></div>' +
      '<div><label class="slider cv-sl"><span class="slider-top"><span>' + md(S3.k) + '</span><output id="cv-k3o"></output></span><input type="range" id="cv-k3" min="-8" max="8" step="1" style="accent-color:var(--pen)" aria-label="k"></label>' +
      '<dl class="read" id="cv-r3" aria-live="polite"></dl><p class="cv-st3" id="cv-st3" aria-live="polite"></p>' + algHTML(S3.alg) + "</div></div></div>";

  // ---- Station 1: add by components (V8 boxes beside the tip-to-tail diagram) ----
  var V1 = { xmin:-2.5, xmax:6.5, ymin:-1.2, ymax:4.6 }, p1 = new MV.Plot($("#cv-p1", host), V1, { equal:true });
  function draw1(){
    var solved = S.s1.solved;
    p1.draw(gridScene(V1, 2, function(ctx, p){
      var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink");
      if (solved) { ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.beginPath(); ctx.moveTo(p.X(0), p.Y(0)); ctx.lineTo(p.X(4), p.Y(0)); ctx.lineTo(p.X(2), p.Y(2 * R3)); ctx.closePath(); ctx.fill(); ctx.restore(); }
      arrow(ctx, p, 0, 0, 4, 0, pen, 3.2); vname(ctx, "u", p.X(2), p.Y(0) + 16, pen, 16);
      arrow(ctx, p, 4, 0, 2, 2 * R3, f3, 3.2); vname(ctx, "v", p.X(3.2) + 14, p.Y(R3) - 2, f3, 16);
      if (solved) { arrow(ctx, p, 0, 0, 2, 2 * R3, ink, 3.4); bgText(ctx, "u + v = (2, 2√3)", p.X(0.7) - 6, p.Y(R3 + 0.5), "right", ink, ui(13, 700)); bgText(ctx, S1.tri, p.X(2), p.Y(-0.75), "center", ink, ui(12, 700)); }
    }, "u = (4, 0) in blue and v from its tip in teal" + (solved ? "; the sum (2, 2√3) closes an equilateral triangle with sides 4." : ".")));
  }
  p1.render = draw1;
  function row1(lab, keys, tail){
    var x = S.s1;
    return '<div class="cv-row"><span class="cv-rl">' + md(lab) + "</span>" + (keys.length === 2 ? "(" + boxHTML("data-b1", keys[0], x.v[keys[0]], MV.plain(md(lab)) + " first component", x.solved) + ", " + boxHTML("data-b1", keys[1], x.v[keys[1]], MV.plain(md(lab)) + " second component", x.solved) + ")" :
      boxHTML("data-b1", keys[0], x.v[keys[0]], MV.plain(md(lab)), x.solved)) + (tail || "") + "</div>";
  }
  function paint1(){
    var b = $("#cv-b1", host), x = S.s1;
    MV.keepFocus(b, function(){
      b.innerHTML = row1(R1.u, ["ux", "uy"]) + row1(R1.v, ["vx", "vy"]) + row1(R1.s, ["sx", "sy"]) +
        '<div class="cv-row"><span class="cv-rl">' + md(R1.m) + "</span>" + boxHTML("data-b1", "mg", x.v.mg, "Magnitude of u plus v", x.solved) + '<span class="cv-rl">' + md(R1.at) + "</span>" + boxHTML("data-b1", "an", x.v.an, "Angle of u plus v in degrees", x.solved) + "°</div>";
    });
    var c = $("#cv-c1", host), h = x.solved ? MV.fbHTML("good", md(S1.good)) : '<div class="q-actions"><button type="button" class="btn primary sm" data-p1="chk" data-k="p1chk">' + L.check + "</button></div>" + (s1msg ? MV.fbHTML(s1msg.bad ? "bad" : "", md(s1msg.html)) : "");
    MV.keepFocus(c, function(){ c.innerHTML = h; });
    draw1();
  }
  function check1(){
    var keys = ["ux", "uy", "vx", "vy", "sx", "sy", "mg", "an"], v = {}, i, r;
    for (i = 0; i < keys.length; i++) { r = readBox(S.s1.v[keys[i]]); if (r.empty) { s1msg = { html:L.fill }; return; } if (r.dec) { s1msg = { html:L.dec }; return; } if (r.err) { s1msg = { html:L.err }; return; } v[keys[i]] = r.v; }
    function bad(t){ s1msg = { bad:true, html:"<strong>✗ Not quite.</strong> " + t }; }
    if (near(v.mg, 8) && near(v.an, 60)) return bad(S1.eight);
    if (!(near(v.ux, 4) && near(v.uy, 0))) return bad(S1.wu);
    if (!(near(v.vx, -2) && near(v.vy, 2 * R3))) return bad(near(v.vx, -2 * R3) && near(v.vy, 2) ? S1.wvSwap : near(v.vx, 2) ? S1.wvSign : S1.wv);
    if (!(near(v.sx, 2) && near(v.sy, 2 * R3))) return bad(S1.ws);
    if (!near(v.mg, 4)) return bad(S1.wm);
    if (!near(v.an, 60)) return bad(S1.wa);
    S.s1.solved = true; s1msg = null;
  }
  paint1();

  // ---- Station 2: AB and equal vectors (tap two points; Copy slides the arrow to another tail) ----
  var V2 = { xmin:-7.3, xmax:7.3, ymin:-7.3, ymax:7.3 }, p2 = new MV.Plot($("#cv-p2", host), V2, { equal:true });
  var TAILS = [[-6, -6], [-6, 2], [0, -6], [-3, 3], [6, 6], [6, -6], [-6, 6]];
  function ab(){ return [S.B[0] - S.A[0], S.B[1] - S.A[1]]; }
  function fits(t, d){ return Math.abs(t[0] + d[0]) <= 7 && Math.abs(t[1] + d[1]) <= 7 && Math.abs(t[0]) <= 7 && Math.abs(t[1]) <= 7; }
  function draw2(){
    var d = ab();
    p2.draw(gridScene(V2, 2, function(ctx, p){
      var pen = css("--pen"), ink = css("--ink");
      if (copy && (d[0] || d[1])) { arrow(ctx, p, copy.x, copy.y, copy.x + d[0], copy.y + d[1], pen, 3, [7, 5], 0.75); bgText(ctx, "(" + num(d[0]) + ", " + num(d[1]) + ")", p.X(copy.x + d[0] / 2) + 10, p.Y(copy.y + d[1] / 2) - 12, "left", pen, ui(12, 700)); }
      if (d[0] || d[1]) arrow(ctx, p, S.A[0], S.A[1], S.B[0], S.B[1], pen, 3.2);
      [["A", S.A], ["B", S.B]].forEach(function(q){ ctx.save(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(p.X(q[1][0]), p.Y(q[1][1]), 5, 0, 2 * Math.PI); ctx.fill(); ctx.restore(); bgText(ctx, q[0], p.X(q[1][0]) - 10, p.Y(q[1][1]) - 12, "right", ink, mfont(15)); });
    }, "A(" + S.A.join(", ") + ") and B(" + S.B.join(", ") + "); vector AB = (" + d.join(", ") + ")" + (copy ? "; a copy starts at (" + copy.x + ", " + copy.y + ") with the same components." : ".")));
  }
  function paint2(){
    var d = ab(), R = S2.rows, rows = [[R.a, m("(" + S.A[0] + ", " + S.A[1] + ")")], [R.b, m("(" + S.B[0] + ", " + S.B[1] + ")")],
      [md(R.ab), m("(" + S.B[0] + " - " + (S.A[0] < 0 ? "(" + S.A[0] + ")" : S.A[0]) + ", " + S.B[1] + " - " + (S.A[1] < 0 ? "(" + S.A[1] + ")" : S.A[1]) + ") = (" + d[0] + ", " + d[1] + ")")]];
    if (copy && copy.done) rows.push([R.copy, m("(" + copy.x + ", " + copy.y + ")") + ": " + m("(" + d[0] + ", " + d[1] + ")")]);
    $("#cv-r2", host).innerHTML = MV.readoutHTML(rows);
    draw2();
  }
  p2.render = draw2;
  MV.drag(p2, {
    handles:function(){ return [{ id:"A", x:S.A[0], y:S.A[1], label:"Point A at (" + S.A.join(", ") + "). Arrow keys move it." }, { id:"B", x:S.B[0], y:S.B[1], label:"Point B at (" + S.B.join(", ") + "). Arrow keys move it." }]; },
    snap:function(x, y){ return [clamp(Math.round(x), -6, 6), clamp(Math.round(y), -6, 6)]; },
    move:function(id, x, y){ var P = S[id]; if (P[0] === x && P[1] === y) return; S[id] = [x, y]; resetCopy(); api.save(); paint2(); },
    step:{ x:1, y:1 }, big:3
  });
  $("#cv-p2", host).addEventListener("pointerdown", function(e){
    if (!p2.v) return;
    var r = e.target.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    if ([S.A, S.B].some(function(P){ return Math.hypot(p2.X(P[0]) - px, p2.Y(P[1]) - py) < 26; })) return;
    var x = clamp(Math.round(p2.xOf(px)), -6, 6), y = clamp(Math.round(p2.yOf(py)), -6, 6);
    S[S.nextP] = [x, y]; S.nextP = S.nextP === "A" ? "B" : "A"; resetCopy(); api.save(); paint2();
  });
  function resetCopy(){ if (stopC) { stopC(); stopC = null; } copy = null; }
  function doCopy(){
    var d = ab(), from = copy && copy.done ? [copy.x, copy.y] : [S.A[0], S.A[1]], tgt = null;
    for (var i = 0; i < TAILS.length && !tgt; i++) { var t = TAILS[(copyN + i) % TAILS.length]; if (fits(t, d) && !(t[0] === from[0] && t[1] === from[1]) && !(t[0] === S.A[0] && t[1] === S.A[1])) { tgt = t; copyN = (copyN + i + 1) % TAILS.length; } }
    if (!tgt) return;
    if (stopC) stopC();
    copy = { x:from[0], y:from[1], done:false };
    stopC = MV.tween({ dur:700, step:function(t){ copy.x = from[0] + (tgt[0] - from[0]) * t; copy.y = from[1] + (tgt[1] - from[1]) * t; draw2(); },
      done:function(){ stopC = null; copy = { x:tgt[0], y:tgt[1], done:true }; paint2(); } });
  }
  paint2();

  // ---- Station 3: the parallel test ----
  var V3 = { xmin:-8.6, xmax:8.6, ymin:-8.6, ymax:8.6 }, p3 = new MV.Plot($("#cv-p3", host), V3, { equal:true }), sl3 = $("#cv-k3", host);
  function draw3(){
    var k = S.k3, par = k === -4;
    p3.draw(gridScene(V3, 2, function(ctx, p){
      var f3 = css("--f3"), pen = css("--pen");
      ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.6; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(p.X(-5.6), p.Y(8.4)); ctx.lineTo(p.X(5.6), p.Y(-8.4)); ctx.stroke(); ctx.restore();
      arrow(ctx, p, 0, 0, 2, -3, f3, 3.2); bgText(ctx, "(2, −3)", p.X(2) + 8, p.Y(-3) + 4, "left", f3, ui(12, 700));
      arrow(ctx, p, 0, 0, k, 6, pen, 3.2); bgText(ctx, "(" + num(k) + ", 6)" + (par ? " ✓" : ""), p.X(k) + (k >= 0 ? 8 : -8), p.Y(6) - 12, k >= 0 ? "left" : "right", pen, ui(13, 700));
    }, "The vector (2, −3) with its dashed line through the origin, and the vector (" + num(k) + ", 6)" + (par ? ", lying on the same line: parallel." : ", not on that line.")));
  }
  function paint3(){
    var k = S.k3, R = S3.rows, par = k === -4;
    sl3.value = k; $("#cv-k3o", host).textContent = num(k); sl3.setAttribute("aria-valuetext", "k = " + num(k));
    $("#cv-r3", host).innerHTML = MV.readoutHTML([[R.v, m("(" + k + ", 6)")], [md(R.r1), m(k % 2 ? k + "/2" : String(k / 2)) + (k % 2 ? " = " + num(k / 2, 1) : "")], [md(R.r2), m("-2")]]);
    var st = $("#cv-st3", host); st.innerHTML = md(par ? S3.yes : S3.no); st.className = "cv-st3 " + (par ? "cv-yes" : "cv-no");
    draw3();
  }
  p3.render = draw3;
  sl3.addEventListener("input", function(){ S.k3 = clamp(Math.round(+sl3.value), -8, 8); api.save(); paint3(); });
  paint3();

  host.addEventListener("input", function(e){ var d = e.target.dataset || {}; if (d.b1) { S.s1.v[d.b1] = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !(e.target.dataset || {}).b1) return; e.preventDefault(); var b = $('[data-p1="chk"]', host); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.p1) { check1(); api.save(); paint1(); MV.focusFb($("#cv-c1", host)); return; }
    if (b.dataset.p2 === "copy") doCopy();
  });
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Components at work (V8 exact boxes, first-try scoring, three-level help) ----------
function workAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function frame(it){
    var x = ist(it.id);
    return it.parts.map(function(p){ return typeof p === "string" ? (p ? '<span class="cv-fl">' + md(p) + "</span>" : "") : boxHTML("data-bx", it.id + "_" + p.k, x.v[p.k], "Answer box " + p.k, x.solved); }).join("");
  }
  host.innerHTML = '<p class="how">' + md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q cv-wq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="cv-frame cv-win"></div><div class="cv-wcl"></div></div>';
  }).join("");
  function paintIn(it){ var el = $('[data-q="' + it.id + '"] .cv-win', host); MV.keepFocus(el, function(){ el.innerHTML = frame(it); }); }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .cv-wcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints.map(md), x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + md(it.display) + ".</strong> " + md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), got = {}, keys = it.parts.filter(function(p){ return typeof p !== "string"; }).map(function(p){ return p.k; });
    for (var i = 0; i < keys.length; i++) { var r = readBox(x.v[keys[i]]); if (r.empty) return { err:TX.fill }; if (r.dec) return { err:TX.dec }; if (r.err) return { err:TX.err }; got[keys[i]] = r.v; }
    var ans = MV.ans(it);
    if (keys.every(function(k){ return near(got[k], ans[k]); })) return { ok:true };
    var W = it.wrong || [];
    for (var j = 0; j < W.length; j++) if (Object.keys(W[j].v).every(function(k){ return near(got[k], W[j].v[k]); })) return { msg:W[j].fb };
    return { msg:TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx.slice(q.dataset.q.length + 1)] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
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

// =====================================================================================================================
// ---------- Performance task: First leg west (V3 board: drag the tip of u; the second leg (6, 0) follows) ----------
var task = (function(){
  var api, plot, VT = { xmin:-13, xmax:19, ymin:-13, ymax:13 };
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -12 && v <= 12 ? v : null; }
  function read(){ var a = gi("a"), b = gi("b"); return { a:a, b:b, valid:a !== null && b !== null && !(a === 0 && b === 0) }; }
  function isSq(n){ var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function checks(D){ if (!D.valid) return [false, false, false]; return [D.a * D.a + D.b * D.b === 100, D.a < 0, isSq((D.a + 6) * (D.a + 6) + D.b * D.b)]; }
  function preview(){
    var D = read(), L = api.content.labels, rd = $("#lw-read");
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + md(L.invalid) + "</p>";
      plot.draw(gridScene(VT, 4, null, "Empty board: choose the components of u."));
      return;
    }
    var a = D.a, b = D.b, V = vCart(a, b), br = bearingOf(V), tx = a + 6, dE = simpRad(tx * tx + b * b);
    var rows = [[md(L.u), m("(" + a + ", " + b + ")")], [md(L.mag), m(Esrc(V.rE)) + " km"], [md(L.br), brTxt(br, V.degExact) + " (" + qbTxt(br, V.degExact) + ")"],
      [md(L.tot), m("(" + a + ", " + b + ") + (6, 0) = (" + tx + ", " + b + ")")], [md(L.dist), (tx || b ? m(Esrc(dE)) : "0") + " km"]];
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
    plot.draw(gridScene(VT, 4, function(ctx, p){
      var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink");
      if (tx || b) arrow(ctx, p, 0, 0, tx, b, ink, 2.6, [8, 5]);
      arrow(ctx, p, a, b, tx, b, f3, 3.2); bgText(ctx, "(6, 0)", p.X(a + 3), p.Y(b) + (b >= 0 ? -14 : 14), "center", f3, ui(12, 700));
      drawV(ctx, p, V, { name:"u" });
      bgText(ctx, "start", p.X(0) - 8, p.Y(0) + 14, "right", ink, ui(12, 700));
    }, "Board: first leg u = (" + a + ", " + b + "), then (6, 0) from its tip; the hiker ends at (" + tx + ", " + b + "), " + spoken(Etxt(dE)) + " km from the start."));
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (a.S.a == null) { a.S.a = "3"; a.S.b = "4"; }
      function step(k){
        return '<div class="lw-step"><label for="lw-' + k + '"><span class="m">' + md(L[k]) + '</span> <span class="tiny muted">' + L.range + "</span></label>" +
          '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="lw' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
          '<input class="numin short" id="lw-' + k + '" data-tk="' + k + '" type="number" min="-12" max="12" step="1" autocomplete="off" value="' + MV.esc(a.S[k]) + '">' +
          '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="lw' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
      }
      inp.innerHTML = '<div class="lw-in"><p class="tiny" style="margin:0">' + md(L.inNote) + "</p>" + step("a") + step("b") + "</div>";
      pv.innerHTML = '<div id="lw-read" aria-live="polite"></div><div class="plot-wrap"><canvas class="plot" id="lw-plot" role="img" aria-label="' + MV.esc(L.graph) + '"></canvas></div>';
      plot = new MV.Plot($("#lw-plot"), VT, { equal:true }); plot.render = preview;
      function upd(){ a.save(); preview(); a.update(); }
      function setAB(x, y){ a.S.a = String(x); a.S.b = String(y); var ia = $("#lw-a"), ib = $("#lw-b"); if (ia) ia.value = a.S.a; if (ib) ib.value = a.S.b; upd(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, c = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(c)) c = 0;
        var nv = clamp(c + +b.dataset.dir, -12, 12), o = k === "a" ? gi("b") : gi("a");
        if (nv === 0 && o === 0) nv = clamp(nv + +b.dataset.dir, -12, 12);
        a.S[k] = String(nv); $("#lw-" + k).value = a.S[k]; upd();
      });
      MV.drag(plot, {
        handles:function(){ var D = read(); return D.valid ? [{ id:"tip", x:D.a, y:D.b, label:"Tip of the first leg u at (" + D.a + ", " + D.b + "). Arrow keys move it." }] : []; },
        snap:function(x, y){ return [clamp(Math.round(x), -12, 12), clamp(Math.round(y), -12, 12)]; },
        move:function(id, x, y){ var D = read(); if ((!x && !y) || (D.valid && D.a === x && D.b === y)) return; setAB(x, y); },
        step:{ x:1, y:1 }, big:5
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : md(api.content.labels.invalid); },
    checks:checks,
    key:function(D){ return D.a + "|" + D.b; },
    label:function(k){ return m("vec{u} = (" + k.split("|").join(", ") + ")"); },
    text:function(k){ return "u = (" + k.split("|").map(function(v){ return v.replace("-", MINUS); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ work:workAct },
  task:task
});

})();
