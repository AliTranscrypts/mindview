// MCV4U 40 Linear Combinations and Spanning Sets: hero (a⃗ = (2, 1), b⃗ = (−1, 2), a skewed grid fans out, 2a⃗ + 1b⃗ lands on (3, 4),
// then b⃗ turns onto a⃗'s line and the grid collapses), Span painter (Explore: V3 2D board and V1 3D view), Reach the target (Part 3:
// equation boxes + N15 move chooser, an in-the-span station and a coplanar k slider, both on V1 views), Find the combination
// (Practice 2, V8 boxes) and "Through the target" (task, V1 view with an s, t finder).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, Q = MV.mcv.Q;

function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function isDark(){ var t = document.documentElement.getAttribute("data-theme"); return t === "dark" || (t !== "light" && !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)); }
function mathFont(px, w){ return "italic " + (w || 600) + " " + (px || 15) + "px " + (css("--font-math") || "serif"); }

// ---------- vector arithmetic ----------
function add(p, q){ return p.map(function(v, i){ return v + q[i]; }); }
function sub(p, q){ return p.map(function(v, i){ return v - q[i]; }); }
function scl(k, p){ return p.map(function(v){ return k * v; }); }
function dot(p, q){ var s = 0; for (var i = 0; i < p.length; i++) s += p[i] * q[i]; return s; }
function cross(p, q){ return [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; }
function isZero(p){ return p.every(function(v){ return Math.abs(v) < 1e-9; }); }
function same(p, q){ return p.length === q.length && p.every(function(v, i){ return near(v, q[i], 1e-9); }); }
function isPar(p, q){ return p.length === 2 ? Math.abs(p[0] * q[1] - p[1] * q[0]) < 1e-9 : isZero(cross(p, q)); }
function kOf(p, q){ for (var i = 0; i < p.length; i++) if (Math.abs(p[i]) > 1e-12) return q[i] / p[i]; return 0; }
// m() source: numbers with a hyphen minus (m() makes it a true minus); vectors "(2, -1)"; coefficients "(-3)" before a bracket
function ns(v){ var q = Q.of(r9(v)); return q && q.d > 1 && q.d <= 12 ? (q.n < 0 ? "-" : "") + Math.abs(q.n) + "/" + q.d : String(r9(v)); }
function vs(p){ return "(" + p.map(ns).join(", ") + ")"; }
function cf(v){ return v < 0 ? "(" + ns(v) + ")" : ns(v); }
function kv(k, name){ var t = ns(k); return (t === "1" ? "" : t === "-1" ? "-" : t) + "vec{" + name + "}"; }
// "s a⃗ + t b⃗" with numbers: "2vec{a} - 3vec{b}"
function comb(ks, names){
  var out = "";
  ks.forEach(function(k, i){
    k = r9(k); if (k === 0 && ks.length > 1) return;
    var t = kv(Math.abs(k), names[i]);
    out += out ? (k < 0 ? " - " : " + ") + t : (k < 0 ? "-" : "") + t;
  });
  return out || "vec{0}";
}
function say(v){ v = r9(v); return (v < 0 ? "negative " : "") + num(Math.abs(v)); }
function sayV(p){ return p.map(say).join(", "); }

// =====================================================================================================================
// @component V2 vecLabel — canvas text with over-arrow vector names: tokens "2", "@a" (italic a with an arrow), " + 1", "@b".
//   vtext(ctx, X, Y, toks, {align, color, size, bg}) draws at pixel (X, Y) (vertical middle).
function vtext(ctx, X, Y, toks, o){
  o = o || {};
  var size = o.size || 15, fI = mathFont(size), fN = "600 " + size + "px " + (css("--font-math") || "serif"), col = o.color || css("--ink");
  var parts = toks.map(function(t){ var v = t.charAt(0) === "@"; ctx.font = v ? fI : fN; var s = v ? t.slice(1) : t; return { s:s, v:v, w:ctx.measureText(s).width + (v ? 2 : 0) }; });
  var W = parts.reduce(function(a, p){ return a + p.w; }, 0), x = o.align === "center" ? X - W / 2 : o.align === "right" ? X - W : X;
  ctx.save();
  if (o.bg) { ctx.globalAlpha = 0.85; ctx.fillStyle = css("--sheet"); ctx.fillRect(x - 3, Y - size * 0.95, W + 6, size * 1.6); ctx.globalAlpha = 1; }
  ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillStyle = col; ctx.strokeStyle = col;
  parts.forEach(function(p){
    ctx.font = p.v ? fI : fN; ctx.fillText(p.s, x, Y);
    if (p.v) {
      var y = Y - size * 0.62, x0 = x + 1.5, x1 = x + p.w;
      ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1 + 1, y); ctx.lineTo(x1 - 3.2, y - 2.6); ctx.lineTo(x1 - 3.2, y + 2.6); ctx.closePath(); ctx.fill();
    }
    x += p.w;
  });
  ctx.restore();
}

// =====================================================================================================================
// @component V3 vecBoard (2D board for linear combinations) — one MV.Plot scene: skewed grid of lines parallel to a⃗ and b⃗ through
//   whole-number combinations (collapses to the one span line when a⃗ ∥ b⃗), painted dots (--ink 50%), a target ring (--hi, ✓ when hit),
//   a⃗ (--pen) and b⃗ (--f3) from the origin, the tip-to-tail construction s a⃗ then t b⃗, and the result in --ink 3.6 px.
//   board(plot, {view, a, b, s, t, grid (0–1, fan-out), paint:[[x, y]], target, describe, names:["a", "b"]})
function arrow2(pl, p, q, col, w, alpha){
  if (Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-9) return;
  pl.segment({ x1:p[0], y1:p[1], x2:q[0], y2:q[1], color:col, width:w, alpha:alpha == null ? 1 : alpha, arrow:true });
}
function board(pl, o){
  var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2"), hi = css("--hi"), dk = isDark();
  var a = o.a, b = o.b, sa = scl(o.s, a), r = add(sa, scl(o.t, b)), nm = o.names || ["a", "b"];
  var T = o.target, hit = T && near(r[0], T[0], 1e-6) && near(r[1], T[1], 1e-6);
  pl.draw({ view:o.view, equal:true, xLabel:"x", yLabel:"y", describe:o.describe, after:function(ctx){
    var g = o.grid == null ? 1 : o.grid, ga = dk ? 0.35 : 0.3, i, big = 60;
    function longSeg(p, d, alpha, w){ var L = Math.hypot(d[0], d[1]); if (L < 1e-9) return; var u = [d[0] / L * big, d[1] / L * big]; pl.segment({ x1:p[0] - u[0], y1:p[1] - u[1], x2:p[0] + u[0], y2:p[1] + u[1], color:ink2, width:w || 1.2, alpha:alpha }); }
    if (g > 0) {
      if (isZero(a) && isZero(b)) { /* nothing to draw */ }
      else if (isPar(a, b)) longSeg([0, 0], isZero(a) ? b : a, Math.min(1, ga * 2.2) * g, 2.2);
      else {
        var K = Math.round(30 * g);
        for (i = -K; i <= K; i++) {
          var pb = scl(i, b), pa = scl(i, a);
          if (Math.hypot(pb[0], pb[1]) < 40) longSeg(pb, a, ga * g);
          if (Math.hypot(pa[0], pa[1]) < 40) longSeg(pa, b, ga * g);
        }
      }
    }
    if (o.paint && o.paint.length) {
      ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = ink;
      o.paint.forEach(function(p){ ctx.beginPath(); ctx.arc(pl.X(p[0]), pl.Y(p[1]), 3.4, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();
    }
    if (T) {
      ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = hi; ctx.beginPath(); ctx.arc(pl.X(T[0]), pl.Y(T[1]), 11, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      pl.label({ x:T[0], y:T[1], text:(hit ? "✓ " : "") + "(" + num(T[0]) + ", " + num(T[1]) + ")", dx:15, dy:-15, align:"left", bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif") });
    }
    arrow2(pl, [0, 0], a, pen, 2.6, 0.45); arrow2(pl, [0, 0], b, f3, 2.6, 0.45);
    arrow2(pl, [0, 0], sa, pen, 3); arrow2(pl, sa, r, f3, 3);
    arrow2(pl, [0, 0], r, ink, 3.6);
    function lab(p, toks, col){ if (isZero(p)) return; var L = Math.hypot(p[0], p[1]); vtext(ctx, pl.X(p[0]) + p[0] / L * 16, pl.Y(p[1]) - p[1] / L * 16, toks, { color:col, align:p[0] / L > 0.3 ? "left" : p[0] / L < -0.3 ? "right" : "center", bg:true }); }
    lab(a, ["@" + nm[0]], pen); lab(b, ["@" + nm[1]], f3);
    if (o.label) lab(r, o.label, ink);
    pl.point({ x:r[0], y:r[1], r:4.5, color:ink });
    if (o.extra) o.extra(ctx, pl);
  } });
  return r;
}

// =====================================================================================================================
// @component V1 view3d — orthographic 3D view on a canvas (an MV.Plot handles size, theme and resize). Drag or arrow keys rotate it
//   (Shift: 15° steps); preset buttons Isometric / Front (xz) / Side (yz) / Top (xy). Axes in --ink-2 with dashed negative halves and
//   x, y, z at the positive ends; planes are translucent polygons clipped to a ±L box; dots fade with depth; vector labels use vtext.
//   view3d(wrap, canvas, {scene() -> {L, polys:[{pts, color, alpha}], dots:[{p, color, alpha}], segs:[{p, q, color, width, dash,
//   alpha, arrow}], pts:[{p, color, r, ring, open}], labels:[{p, toks, color, dx, dy, align}], describe}, views:host, locked()})
//   -> {draw, set(th, ph), turn(th, ph, ms, done), st}. No inertia, so reduced motion needs nothing extra.
var VIEWS = { iso:{ th:35, ph:22, t:"Isometric" }, front:{ th:-90, ph:0, t:"Front (xz)" }, side:{ th:0, ph:0, t:"Side (yz)" }, top:{ th:-90, ph:90, t:"Top (xy)" } };
function planeBox(n, L){
  var pts = [], u = [];
  [0, 1, 2].forEach(function(i){
    var j = (i + 1) % 3, k = (i + 2) % 3; if (Math.abs(n[i]) < 1e-12) return;
    [-L, L].forEach(function(a){ [-L, L].forEach(function(b){
      var v = -(n[j] * a + n[k] * b) / n[i];
      if (v >= -L - 1e-9 && v <= L + 1e-9) { var p = [0, 0, 0]; p[i] = v; p[j] = a; p[k] = b; pts.push(p); }
    }); });
  });
  pts.forEach(function(p){ if (!u.some(function(q){ return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) < 1e-7; })) u.push(p); });
  var nn = Math.hypot(n[0], n[1], n[2]), e1 = Math.abs(n[0]) < 0.9 * nn ? cross(n, [1, 0, 0]) : cross(n, [0, 1, 0]), e2 = cross(n, e1);
  u.sort(function(p, q){ return Math.atan2(dot(p, e2), dot(p, e1)) - Math.atan2(dot(q, e2), dot(q, e1)); });
  return u;
}
function lineBox(d, L){ var tm = Infinity; d.forEach(function(v){ if (Math.abs(v) > 1e-12) tm = Math.min(tm, L / Math.abs(v)); }); return isFinite(tm) ? [scl(-tm, d), scl(tm, d)] : null; }
// span of a list of 3D vectors: {dim:0} | {dim:1, d} | {dim:2, n} | {dim:3}
function span3(list){
  var nz = list.filter(function(v){ return !isZero(v); }), i, j;
  if (!nz.length) return { dim:0 };
  for (i = 0; i < nz.length; i++) for (j = i + 1; j < nz.length; j++) {
    var n = cross(nz[i], nz[j]);
    if (!isZero(n)) { if (nz.some(function(v){ return Math.abs(dot(v, n)) > 1e-9; })) return { dim:3 }; return { dim:2, n:n }; }
  }
  return { dim:1, d:nz[0] };
}
// exact s, t with c = s a + t b (a, b not parallel); null if c is off their plane
function solve2(a, b, c){
  var n = a.length, i, j;
  for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
    var det = a[i] * b[j] - a[j] * b[i];
    if (Math.abs(det) > 1e-12) {
      var s = (c[i] * b[j] - c[j] * b[i]) / det, t = (a[i] * c[j] - a[j] * c[i]) / det;
      return same(add(scl(s, a), scl(t, b)), c) ? { s:r9(s), t:r9(t) } : null;
    }
  }
  return null;
}
function spanPlaneScene(sc, list, L, fade){
  var sp = span3(list), pen = css("--pen"), al = (isDark() ? 0.18 : 0.14) * (fade == null ? 1 : fade);
  if (sp.dim === 2) sc.polys.push({ pts:planeBox(sp.n, L), color:pen, alpha:al, edge:0.6 * (fade == null ? 1 : fade) });
  else if (sp.dim === 1) { var e = lineBox(sp.d, L); if (e) sc.segs.unshift({ p:e[0], q:e[1], color:pen, width:2.2, alpha:0.55 * (fade == null ? 1 : fade) }); }
  return sp;
}
function view3d(wrap, cv, o){
  var st = { th:VIEWS.iso.th, ph:VIEWS.iso.ph }, pl = new MV.Plot(cv, { xmin:-1, xmax:1, ymin:-1, ymax:1 }), drag = null;
  function basis(){
    var t = st.th * Math.PI / 180, p = st.ph * Math.PI / 180;
    return { r:[-Math.sin(t), Math.cos(t), 0], u:[-Math.sin(p) * Math.cos(t), -Math.sin(p) * Math.sin(t), Math.cos(p)], d:[Math.cos(p) * Math.cos(t), Math.cos(p) * Math.sin(t), Math.sin(p)] };
  }
  function draw(){
    var B = basis(), sc = o.scene(), L = sc.L || 5, R = L * 1.5;
    function P(v){ return [dot(v, B.r), dot(v, B.u)]; }
    pl.draw({ view:{ xmin:-R, xmax:R, ymin:-R, ymax:R }, equal:true, grid:false, axes:false, describe:sc.describe, after:function(ctx){
      var ink2 = css("--ink-2"), D = L * Math.sqrt(3);
      (sc.polys || []).forEach(function(g){
        if (!g.pts || g.pts.length < 3) return;
        ctx.save(); ctx.beginPath();
        g.pts.forEach(function(v, i){ var q = P(v), X = pl.X(q[0]), Y = pl.Y(q[1]); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
        ctx.closePath(); ctx.globalAlpha = g.alpha; ctx.fillStyle = g.color; ctx.fill();
        ctx.globalAlpha = g.edge == null ? 0.6 : g.edge; ctx.lineWidth = 1.5; ctx.strokeStyle = g.color; ctx.stroke(); ctx.restore();
      });
      ["x", "y", "z"].forEach(function(nm, i){
        var e = [0, 0, 0]; e[i] = L; var q = P(e), qn = P(scl(-1, e)), ql = P(scl(1.12, e));
        pl.segment({ x1:0, y1:0, x2:qn[0], y2:qn[1], color:ink2, width:1.5, dash:[5, 5] });
        pl.segment({ x1:0, y1:0, x2:q[0], y2:q[1], color:ink2, width:1.5 });
        pl.label({ x:ql[0], y:ql[1], text:nm, color:ink2, align:"center", font:mathFont(15) });
      });
      var dots = (sc.dots || []).map(function(d){ return { d:d, z:dot(d.p, B.d) }; }).sort(function(p, q){ return p.z - q.z; });
      ctx.save();
      dots.forEach(function(x){
        var q = P(x.d.p), f = 0.45 + 0.55 * clamp((x.z + D) / (2 * D), 0, 1);
        ctx.globalAlpha = (x.d.alpha == null ? 0.5 : x.d.alpha) * f; ctx.fillStyle = x.d.color || css("--ink");
        ctx.beginPath(); ctx.arc(pl.X(q[0]), pl.Y(q[1]), x.d.r || 3, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
      (sc.segs || []).forEach(function(s){
        if (s.arrow && isZero(sub(s.q, s.p))) return;
        var p = P(s.p), q = P(s.q);
        if (s.arrow && Math.hypot(pl.X(q[0]) - pl.X(p[0]), pl.Y(q[1]) - pl.Y(p[1])) < 3) return;
        pl.segment({ x1:p[0], y1:p[1], x2:q[0], y2:q[1], color:s.color, width:s.width || 2, dash:s.dash, alpha:s.alpha, arrow:s.arrow });
      });
      (sc.pts || []).forEach(function(p){
        var q = P(p.p);
        if (p.glow) { ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = css("--hi"); ctx.beginPath(); ctx.arc(pl.X(q[0]), pl.Y(q[1]), 11, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        pl.point({ x:q[0], y:q[1], r:p.r || 5, color:p.color, open:p.open });
      });
      (sc.labels || []).forEach(function(l){
        var q = P(l.p), X = pl.X(q[0]) + (l.dx || 0), Y = pl.Y(q[1]) + (l.dy == null ? -14 : l.dy);
        if (l.text) pl.label({ x:q[0], y:q[1], text:l.text, dx:l.dx || 0, dy:l.dy == null ? -14 : l.dy, align:l.align || "left", bg:true, color:l.color, font:"600 13px " + (css("--font-ui") || "sans-serif") });
        else vtext(ctx, X, Y, l.toks, { color:l.color, align:l.align || "left", bg:true });
      });
    } });
  }
  pl.render = draw;
  cv.style.touchAction = "none";
  cv.addEventListener("pointerdown", function(e){ if (o.locked && o.locked()) return; drag = { x:e.clientX, y:e.clientY }; try { cv.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); });
  cv.addEventListener("pointermove", function(e){
    if (!drag) return;
    st.th -= (e.clientX - drag.x) * 0.5; st.ph = clamp(st.ph + (e.clientY - drag.y) * 0.5, -89, 89); drag = { x:e.clientX, y:e.clientY }; draw();
  });
  function end(){ drag = null; }
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
  wrap.addEventListener("keydown", function(e){
    if (e.target !== wrap || (o.locked && o.locked())) return;
    var d = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") st.th += d; else if (e.key === "ArrowRight") st.th -= d;
    else if (e.key === "ArrowUp") st.ph = clamp(st.ph + d, -89, 90); else if (e.key === "ArrowDown") st.ph = clamp(st.ph - d, -89, 90);
    else return;
    e.preventDefault(); draw();
  });
  if (o.views) {
    o.views.innerHTML = '<span class="tiny lc-vlab">View</span>' + Object.keys(VIEWS).map(function(k){ return '<button type="button" class="btn ghost sm" data-view="' + k + '" data-k="' + (o.key || "v") + k + '">' + VIEWS[k].t + "</button>"; }).join("");
    o.views.addEventListener("click", function(e){ var b = e.target.closest("button[data-view]"); if (!b || (o.locked && o.locked())) return; var v = VIEWS[b.dataset.view]; st.th = v.th; st.ph = v.ph; draw(); });
  }
  return {
    draw:draw, st:st,
    set:function(th, ph){ st.th = th; st.ph = ph; draw(); },
    turn:function(th, ph, dur, cb){ var a = st.th, b = st.ph; return MV.tween({ dur:dur, step:function(t){ st.th = a + (th - a) * t; st.ph = b + (ph - b) * t; draw(); }, done:function(){ st.th = th; st.ph = ph; draw(); if (cb) cb(); } }); }
  };
}
function vecSegs(sc, list){ // list: [{v, from, color, width, alpha, name}]
  list.forEach(function(x){
    var p = x.from || [0, 0, 0], q = add(p, x.v);
    sc.segs.push({ p:p, q:q, color:x.color, width:x.width || 3, alpha:x.alpha, arrow:true });
    if (x.name && !isZero(x.v)) sc.labels.push({ p:q, toks:["@" + x.name], color:x.color, dx:8, dy:-12 });
  });
}

// =====================================================================================================================
// ---------- hero: skewed grid, 2a⃗ + 1b⃗ = (3, 4), then b⃗ turns onto a⃗'s line ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var V = { xmin:-5.5, xmax:5.5, ymin:-3.5, ymax:6.5 }, pl = new MV.Plot(cv, V), A = [2, 1], B0 = [-1, 2];
  var st = { grow:1, grid:1, s:2, t:1, b:B0, lab:true };
  if (f.cap) f.cap.innerHTML = '<span class="lc-hcap"><span data-st="1">' + m("2vec{a} + 1vec{b} = (3, 4)") + '</span><span data-st="2">span collapses to a line</span></span>';
  function stage(n){ if (f.cap) $$("[data-st]", f.cap).forEach(function(el){ el.style.opacity = +el.dataset.st <= n ? 1 : 0; }); }
  function draw(){
    var a = scl(st.grow, A), b = scl(st.grow, st.b), col = isPar(A, st.b);
    board(pl, { view:V, a:a, b:b, s:st.grow < 1 ? 1 : st.s, t:st.grow < 1 ? 0 : st.t, grid:st.grid,
      label:st.lab && st.grow >= 1 && !col ? [ns(st.s), "@a", " + " + ns(st.t), "@b"] : null,
      describe:col ? "b has turned to (4, 2) = 2a: every combination lies on one line through the origin, so the span collapses to a line." :
        "a = (2, 1) in blue and b = (−1, 2) in teal from the origin, with a skewed grid of lines parallel to them. 2a + 1b lands on (3, 4)." });
  }
  pl.render = draw;
  function finish(){ st.grow = 1; st.grid = 1; st.s = 2; st.t = 1; st.b = B0; st.lab = true; stage(1); draw(); }
  if (MV.reduceMotion) { finish(); if (f.cap) { var c2 = $('[data-st="2"]', f.cap); c2.innerHTML = "If " + m("vec{b}") + " lines up with " + m("vec{a}") + ", the span collapses to a line."; c2.style.opacity = 1; } return; }
  st.grow = 0; st.grid = 0; st.s = 0; st.t = 0; st.lab = false; stage(0); draw();
  MV.wait(400, function(){
    MV.tween({ dur:1000, step:function(t){ st.grow = t; draw(); }, done:function(){
      st.grow = 1; st.s = 0; st.t = 0;
      MV.tween({ dur:1300, step:function(t){ st.grid = t; draw(); }, done:function(){
        MV.tween({ dur:1100, step:function(t){ st.s = 2 * t; draw(); }, done:function(){
          MV.tween({ dur:900, step:function(t){ st.t = t; draw(); }, done:function(){
            st.s = 2; st.t = 1; st.lab = true; stage(1); draw();
            MV.wait(1800, function(){
              st.lab = false; st.s = 0; st.t = 0;
              var a0 = Math.atan2(2, -1), a1 = Math.atan2(1, 2), R = Math.sqrt(5) * 2;   // b⃗ turns clockwise until it is (4, 2) = 2a⃗
              MV.tween({ dur:2000, step:function(t){ var g = a0 + (a1 - a0) * t, rr = Math.sqrt(5) + (R - Math.sqrt(5)) * t; st.b = [r9(rr * Math.cos(g)), r9(rr * Math.sin(g))]; draw(); }, done:function(){
                st.b = [4, 2]; stage(2); draw();
                MV.wait(2600, finish);
              } });
            });
          } });
        } });
      } });
    } });
  });
}

// =====================================================================================================================
// ---------- Explore: Span painter ----------
var TG = [[7, -4], [-1, 7], [-4, 3]], V2 = { xmin:-8, xmax:8, ymin:-8, ymax:8 }, L3 = 5;
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function ok(v, n, lo, hi){ return Array.isArray(v) && v.length === n && v.every(function(x){ return Number.isInteger(x) && x >= lo && x <= hi; }); }
  function okc(v, lo, hi){ return typeof v === "number" && v >= lo && v <= hi && near(v * 2, Math.round(v * 2)); }
  if (S.mode !== "2d" && S.mode !== "3d") S.mode = "2d";
  if (!ok(S.a2, 2, -5, 5)) S.a2 = [2, 1];
  if (!ok(S.b2, 2, -5, 5)) S.b2 = [-1, 2];
  if (!okc(S.s2, -5, 5)) S.s2 = 1;
  if (!okc(S.t2, -5, 5)) S.t2 = 1;
  if (!ok(S.a3, 3, -3, 3)) S.a3 = [1, 0, 1];
  if (!ok(S.b3, 3, -3, 3)) S.b3 = [0, 1, 1];
  if (!ok(S.c3, 3, -3, 3)) S.c3 = [1, -1, 1];
  ["s3", "t3"].forEach(function(k){ if (!okc(S[k], -3, 3)) S[k] = 1; });
  if (!okc(S.u3, -3, 3)) S.u3 = 0;
  if (typeof S.grid !== "boolean") S.grid = true;
  S.paint = !!S.paint; S.tg = !!S.tg; S.useC = !!S.useC;
  if (!(S.ti >= 0 && S.ti < TG.length)) S.ti = 0;
  var busy = false, stop = null, dots2 = [], dots3 = [], bAnim = null, planeFade = 1;

  host.innerHTML = '<div class="lc-ex"><div class="lc-main">' +
    '<div class="lc-top"><span class="tiny lc-vlab">Mode</span><span class="seg" role="group" aria-label="Mode" id="lx-mode"></span></div>' +
    '<p class="lc-warn" id="lx-warn" aria-live="polite"></p>' +
    '<div class="plot-wrap" id="lx-w2"><canvas class="plot square" id="lx-c2" role="img" aria-label="2D span painter"></canvas></div>' +
    '<div class="plot-wrap lc-3d" id="lx-w3" tabindex="0" role="group" aria-label="3D view. Drag it, or use the arrow keys, to rotate it."><canvas class="plot square" id="lx-c3" role="img" aria-label="3D span painter"></canvas></div>' +
    '<div class="lc-views" id="lx-views"></div>' +
    '<div class="lc-coefs" id="lx-coefs"></div></div>' +
    '<div class="lc-side"><div class="chips lc-tog" id="lx-tog" role="group" aria-label="Show"></div><div class="chips lc-tgts" id="lx-tgts" role="group" aria-label="Choose a target"></div>' +
    '<details class="lc-drawer" id="lx-drawer"' + (window.innerWidth > 700 ? " open" : "") + '><summary>Vectors</summary><div id="lx-vecs"></div></details>' +
    '<dl class="read lc-read" id="lx-read" aria-live="polite"></dl></div></div>';
  var p2 = new MV.Plot($("#lx-c2", host), V2);
  var v3 = view3d($("#lx-w3", host), $("#lx-c3", host), { scene:scene3, views:$("#lx-views", host), key:"lx", locked:function(){ return busy; } });

  function res2(){ return add(scl(S.s2, S.a2), scl(S.t2, S.b2)); }
  function res3(){ var r = add(scl(S.s3, S.a3), scl(S.t3, S.b3)); return S.useC ? add(r, scl(S.u3, S.c3)) : r; }
  function tgt(){ return S.tg ? TG[S.ti] : null; }
  function addDot(list, r){ if (!list.some(function(q){ return same(q, r); })) { list.push(r.slice()); if (list.length > 400) list.shift(); } }
  function record(){ if (!S.paint) return; if (S.mode === "2d") addDot(dots2, res2()); else addDot(dots3, res3()); }

  // ----- 2D -----
  function spanTxt2(a, b){
    if (isZero(a) && isZero(b)) return "Just the origin";
    if (isPar(a, b)) { var d = isZero(a) ? b : a, q = d[0] === 0 ? null : Q.of(d[1], d[0]); return "The line " + m(!q ? "x = 0" : q.n === 0 ? "y = 0" : "y = " + (q.d === 1 ? (q.n === 1 ? "" : q.n === -1 ? "-" : q.n) : (q.n < 0 ? "-" : "") + "{" + Math.abs(q.n) + "}/{" + q.d + "}") + "x"); }
    return "All of R²";
  }
  function parTxt(a, b){
    if (isZero(a) || isZero(b)) return "One of them is " + m("vec{0}") + ", which adds no direction";
    if (isPar(a, b)) return "Yes: " + m("vec{b} = " + kv(kOf(a, b), "a"));
    if (a.every(function(v){ return v !== 0; })) return "No (ratios " + a.map(function(v, i){ return m(Q.src(Q.of(b[i], v)).replace(/\{(\d+)\}\/\{(\d+)\}/, "$1/$2")); }).join(" and ").replace(/ and (?=[^]* and )/g, ", ") + " differ)";
    return "No: " + m("vec{b}") + " isn’t a multiple of " + m("vec{a}");
  }
  function desc2(){
    var a = S.a2, b = S.b2, r = res2(), par = isPar(a, b), T = tgt();
    return num(S.s2) + " a plus " + say(S.t2) + " b equals " + sayV(r) + ". a = (" + sayV(a) + ") and b = (" + sayV(b) + ") are " + (par ? "parallel; they span only a line through the origin." : "not parallel; they span all of R².") +
      (S.grid ? " Skewed grid on." : "") + (S.paint ? " " + dots2.length + " painted dots." : "") + (T ? " Target (" + sayV(T) + ")" + (same(r, T) ? ", reached." : ".") : "");
  }
  function draw2(){
    board(p2, { view:V2, a:S.a2, b:bAnim || S.b2, s:S.s2, t:S.t2, grid:S.grid ? 1 : 0, paint:S.paint ? dots2 : [], target:tgt(), describe:desc2() });
  }
  p2.render = draw2;
  var dr = MV.drag(p2, {
    handles:function(){ if (S.mode !== "2d") return []; return [{ id:"a", x:S.a2[0], y:S.a2[1], label:"Tip of vector a at (" + sayV(S.a2) + "). Arrow keys move it." }, { id:"b", x:(bAnim || S.b2)[0], y:(bAnim || S.b2)[1], label:"Tip of vector b at (" + sayV(S.b2) + "). Arrow keys move it." }]; },
    snap:function(x, y){ return [clamp(Math.round(x), -5, 5), clamp(Math.round(y), -5, 5)]; },
    move:function(id, x, y){
      if (busy) return; var k = id === "a" ? "a2" : "b2";
      if (S[k][0] === x && S[k][1] === y) return;
      S[k] = [x, y]; dots2 = []; record(); api.save(); paint(); MV.changed();
    } });

  // ----- 3D -----
  function scene3(){
    var a = S.a3, b = S.b3, c = S.c3, r = res3(), sa = scl(S.s3, a), sb = add(sa, scl(S.t3, b));
    var sc = { L:L3, polys:[], dots:[], segs:[], pts:[], labels:[] }, pen = css("--pen"), f3 = css("--f3"), f5 = css("--f5"), ink = css("--ink");
    var sp = planeFade > 0 ? spanPlaneScene(sc, [a, b], L3, planeFade) : span3([a, b]);
    if (S.paint) {
      var R = [-3, -2, -1, 0, 1, 2, 3], U = S.useC ? R : [0];
      R.forEach(function(i){ R.forEach(function(j){ U.forEach(function(k){
        var p = add(add(scl(i, a), scl(j, b)), scl(k, c));
        if (Math.max(Math.abs(p[0]), Math.abs(p[1]), Math.abs(p[2])) <= L3 + 1e-9) sc.dots.push({ p:p, alpha:0.42, r:2.6 });
      }); }); });
      dots3.forEach(function(p){ sc.dots.push({ p:p, alpha:0.5, r:3.4 }); });
    }
    vecSegs(sc, [{ v:a, color:pen, width:2.6, alpha:0.45, name:"a" }, { v:b, color:f3, width:2.6, alpha:0.45, name:"b" }].concat(S.useC ? [{ v:c, color:f5, width:2.6, alpha:0.45, name:"c" }] : []));
    vecSegs(sc, [{ v:sa, color:pen }, { v:scl(S.t3, b), from:sa, color:f3 }].concat(S.useC ? [{ v:scl(S.u3, c), from:sb, color:f5 }] : []));
    vecSegs(sc, [{ v:r, color:ink, width:3.6 }]);
    sc.pts.push({ p:r, color:ink, r:4.5 });
    var whole = span3(S.useC ? [a, b, c] : [a, b]);
    sc.describe = "3D view. a = (" + sayV(a) + "), b = (" + sayV(b) + ")" + (S.useC ? ", c = (" + sayV(c) + ")" : "") + ". " +
      ["Their span is just the origin.", "Their span is a line through the origin.", "Their span is a plane through the origin" + (sp.dim === 2 && planeFade > 0 ? ", drawn as a translucent blue plane." : "."), "They span all of R³."][whole.dim] +
      " The result " + comb(S.useC ? [S.s3, S.t3, S.u3] : [S.s3, S.t3], ["a", "b", "c"]).replace(/vec\{(\w)\}/g, " $1").replace(/^ /, "") + " is (" + sayV(r) + ")." + (S.paint ? " Paint shows the lattice of whole-number combinations" + (whole.dim === 3 ? ", filling the box." : ", which stays flat.") : "");
    return sc;
  }
  function inSpanTxt(){
    var a = S.a3, b = S.b3, c = S.c3, sp = span3([a, b]);
    if (sp.dim === 2) {
      var st = solve2(a, b, c);
      return st ? "Yes: " + m("vec{c} = " + comb([st.s, st.t], ["a", "b"])) + ", so the three span only that plane" : "No: " + m("vec{c}") + " is off the plane, so the three span R³";
    }
    if (sp.dim === 1) return isPar(sp.d, c) ? "Yes: " + m("vec{c}") + " is on the same line" : "No: " + m("vec{c}") + " is off the line, so the three span a plane";
    return isZero(c) ? "Yes: " + m("vec{c} = vec{0}") : "No: span{" + m("vec{a}") + ", " + m("vec{b}") + "} is just the origin";
  }

  // ----- paint -----
  function slider(k, lab, min, max, step, col, val, aria){
    return '<label class="slider lc-sl"><span class="slider-top"><span>' + lab + '</span><output data-out="' + k + '">' + num(val) + '</output></span>' +
      '<input type="range" data-co="' + k + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" style="accent-color:var(' + col + ')" aria-label="' + MV.esc(aria) + '"></label>';
  }
  function buildCoefs(){
    var el = $("#lx-coefs", host), d3 = S.mode === "3d", want = d3 ? "3" + (S.useC ? "u" : "") : "2";
    if (el.dataset.w === want) return; el.dataset.w = want;
    el.innerHTML = d3 ? slider("s3", m("s"), -3, 3, 0.5, "--ink", S.s3, "Coefficient s, −3 to 3") + slider("t3", m("t"), -3, 3, 0.5, "--ink", S.t3, "Coefficient t, −3 to 3") + (S.useC ? slider("u3", m("u"), -3, 3, 0.5, "--ink", S.u3, "Coefficient u, −3 to 3") : "")
      : slider("s2", m("s"), -5, 5, 0.5, "--ink", S.s2, "Coefficient s, −5 to 5") + slider("t2", m("t"), -5, 5, 0.5, "--ink", S.t2, "Coefficient t, −5 to 5");
  }
  function buildVecs(){
    var el = $("#lx-vecs", host), want = S.mode;
    if (el.dataset.w === want) return; el.dataset.w = want;
    if (S.mode === "2d") { el.innerHTML = '<p class="tiny">Drag the tips of ' + m("vec{a}") + " and " + m("vec{b}") + ' on the board; they snap to whole numbers from −5 to 5. A focused tip moves with the arrow keys.</p><p class="lc-vval" id="lx-v2"></p><button type="button" class="btn ghost sm" data-act="reset2" data-k="lxreset2">Reset to ' + m("vec{a} = (2, 1)") + ", " + m("vec{b} = (-1, 2)") + "</button>"; return; }
    el.innerHTML = [["a3", "a", "--pen"], ["b3", "b", "--f3"], ["c3", "c", "--f5"]].map(function(v){
      return '<div class="lc-vrow"><span class="lc-vn">' + m("vec{" + v[1] + "}") + '</span><span class="lc-vsl">' + ["x", "y", "z"].map(function(ax, i){
        return '<label class="lc-mini"><span class="m">' + m(ax) + '</span><input type="range" data-vk="' + v[0] + '" data-i="' + i + '" min="-3" max="3" step="1" value="' + S[v[0]][i] + '" style="accent-color:var(' + v[2] + ')" aria-label="' + v[1] + " vector, " + ax + '-component (−3 to 3)"><output data-vo="' + v[0] + i + '">' + num(S[v[0]][i]) + "</output></label>";
      }).join("") + "</span></div>";
    }).join("");
  }
  function syncInputs(){
    $$("[data-co]", host).forEach(function(inp){ var v = S[inp.dataset.co]; if (+inp.value !== v) inp.value = v; var o = $('[data-out="' + inp.dataset.co + '"]', host); if (o) o.textContent = num(v); });
    $$("[data-vk]", host).forEach(function(inp){ var v = S[inp.dataset.vk][+inp.dataset.i]; if (+inp.value !== v) inp.value = v; var o = $('[data-vo="' + inp.dataset.vk + inp.dataset.i + '"]', host); if (o) o.textContent = num(v); });
    var v2 = $("#lx-v2", host); if (v2) v2.innerHTML = m("vec{a} = " + vs(S.a2)) + ", " + m("vec{b} = " + vs(S.b2));
  }
  function paintTop(){
    MV.keepFocus($("#lx-mode", host), function(){ $("#lx-mode", host).innerHTML = [["2d", "2D"], ["3d", "3D"]].map(function(o){ return '<button type="button" data-mode="' + o[0] + '" data-k="lxm' + o[0] + '" aria-pressed="' + (S.mode === o[0]) + '">' + o[1] + "</button>"; }).join(""); });
    var tg = S.mode === "2d" ? [["grid", "Skewed grid"], ["paint", "Paint"], ["tg", "Target"]] : [["paint", "Paint"], ["useC", "Add " + m("vec{c}")]];
    MV.keepFocus($("#lx-tog", host), function(){ $("#lx-tog", host).innerHTML = tg.map(function(o){ return '<button type="button" class="chip' + (S[o[0]] ? " on" : "") + '" data-tog="' + o[0] + '" data-k="lxt' + o[0] + '" aria-pressed="' + !!S[o[0]] + '">' + o[1] + "</button>"; }).join(""); });
    var te = $("#lx-tgts", host);
    MV.keepFocus(te, function(){ te.innerHTML = S.mode === "2d" && S.tg ? '<span class="tiny lc-vlab">Target</span>' + TG.map(function(p, i){ return '<button type="button" class="chip' + (i === S.ti ? " on" : "") + '" data-ti="' + i + '" data-k="lxti' + i + '" aria-pressed="' + (i === S.ti) + '">' + m(vs(p)) + "</button>"; }).join("") : ""; });
    $("#lx-w2", host).hidden = S.mode !== "2d"; $("#lx-w3", host).hidden = S.mode !== "3d"; $("#lx-views", host).hidden = S.mode !== "3d";
    buildCoefs(); buildVecs(); syncInputs();
  }
  function paintRead(){
    var rows = [], w = $("#lx-warn", host);
    if (S.mode === "2d") {
      var a = S.a2, b = S.b2, r = res2(), T = tgt();
      rows.push([m("vec{a}") + ", " + m("vec{b}"), m(vs(a)) + ", " + m(vs(b))]);
      rows.push(["Combination", m(cf(S.s2) + vs(a) + " + " + cf(S.t2) + vs(b) + " = " + vs(r))]);
      rows.push(["Parallel?", parTxt(a, b)]);
      rows.push(["Span", spanTxt2(a, b)]);
      if (T) rows.push(["Target", same(r, T) ? m(vs(T)) + " reached with " + m("s = " + ns(S.s2)) + ", " + m("t = " + ns(S.t2)) + " ✓" : m(vs(T)) + ": not reached yet"]);
      var col = !isZero(a) && !isZero(b) && isPar(a, b);
      w.textContent = col ? "Span is a line: every combination stays on one line through the origin." : "";
      w.classList.toggle("on", col);
    } else {
      var a3 = S.a3, b3 = S.b3, c3 = S.c3, r3 = res3(), ks = S.useC ? [S.s3, S.t3, S.u3] : [S.s3, S.t3], vv = S.useC ? [a3, b3, c3] : [a3, b3], sp = span3(vv);
      rows.push([m("vec{a}") + ", " + m("vec{b}") + (S.useC ? ", " + m("vec{c}") : ""), vv.map(function(v){ return m(vs(v)); }).join(", ")]);
      rows.push(["Combination", m(ks.map(function(k, i){ return cf(k) + vs(vv[i]); }).join(" + ") + " = " + vs(r3))]);
      rows.push(["Parallel?", parTxt(a3, b3)]);
      rows.push(["Span", ["Just the origin", "A line through the origin", "A plane through the origin", "All of R³"][sp.dim]]);
      if (S.useC) rows.push(["Is " + m("vec{c}") + " in span{" + m("vec{a}") + ", " + m("vec{b}") + "}?", inSpanTxt()]);
      w.textContent = ""; w.classList.remove("on");
    }
    $("#lx-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function draw(){ if (S.mode === "2d") draw2(); else v3.draw(); }
  function paint(){ paintTop(); paintRead(); draw(); }
  function reset2(){ S.a2 = [2, 1]; S.b2 = [-1, 2]; dots2 = []; }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.dataset.view || b.classList.contains("drag-h")) return;
    if (busy) return;
    if (b.dataset.mode) { if (S.mode === b.dataset.mode) return; S.mode = b.dataset.mode; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.tog) { var k = b.dataset.tog; S[k] = !S[k]; if (k === "paint" && S.paint) record(); if (k === "useC") $("#lx-coefs", host).dataset.w = ""; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.ti != null) { S.ti = +b.dataset.ti; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.act === "reset2") { reset2(); record(); api.save(); paint(); MV.changed(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset) return;
    if (busy) { syncInputs(); return; }
    if (t.dataset.co) { S[t.dataset.co] = +t.value; record(); }
    else if (t.dataset.vk) { S[t.dataset.vk][+t.dataset.i] = +t.value; dots3 = []; record(); }
    else return;
    api.save(); syncInputs(); paintRead(); draw(); MV.changed();
  });
  paint(); void dr;

  // ---- predictions ----
  function tw(dur, step, cb){ stop = MV.tween({ dur:dur, step:step, done:function(){ stop = null; if (cb) cb(); } }); }
  var PSTART = {
    p1:function(){ S.mode = "2d"; reset2(); S.s2 = 0; S.t2 = 0; S.tg = true; S.ti = 0; S.grid = true; },
    p2:function(){ S.mode = "2d"; reset2(); S.s2 = 1; S.t2 = 1; S.tg = false; S.grid = true; S.paint = true; dots2 = [[1, 3]]; },
    p3:function(){ S.mode = "3d"; S.a3 = [1, 0, 1]; S.b3 = [0, 1, 1]; S.useC = false; S.paint = false; S.s3 = 1; S.t3 = 1; planeFade = 0; v3.set(VIEWS.iso.th, VIEWS.iso.ph); },
    p4:function(){ S.mode = "3d"; S.a3 = [1, 0, 1]; S.b3 = [0, 1, 1]; S.c3 = [1, 1, 2]; S.useC = false; S.paint = false; S.s3 = 0; S.t3 = 0; S.u3 = 0; dots3 = []; v3.set(VIEWS.iso.th, VIEWS.iso.ph); }
  };
  function chal(id){
    var M = MS[id];
    if (id === "tc1" || id === "tc2") {
      if (S.mode !== "2d" || !same(S.a2, [2, 1]) || !same(S.b2, [-1, 2])) return { ok:false, msg:M.setup };
      var s = S.s2, t = S.t2, r = res2(), other = { ok:false, msg:tpl(M.other, { r:m(vs(r)) }) };
      if (id === "tc1") {
        if (s === 1 && t === 3) return { ok:true };
        if (s === 3 && t === 1) return { ok:false, msg:M.swap };
        if (s === -1 && t === 7) return { ok:false, msg:M.target };   // VERIFY: unreachable with the plan's −5 to 5 sliders; kept for fidelity
        return other;
      }
      if (s === -1 && t === 2) return { ok:true };
      if (s === 1 && t === 2) return { ok:false, msg:M.pos };
      if (s === 0 && t === 2) return { ok:false, msg:M.half };
      return other;
    }
    if (id === "tc3") {
      if (S.mode !== "3d" || !same(S.a3, [1, 0, 1]) || !same(S.b3, [0, 1, 1])) return { ok:false, msg:M.setup };
      if (S.c3[0] !== 1 || S.c3[1] !== 2) return { ok:false, msg:M.c12 };
      var z = S.c3[2];
      if (z === 3) return { ok:true };
      if (z === 0) return { ok:false, msg:M.z0 };
      if (z === 2) return { ok:false, msg:M.z2 };
      return { ok:false, msg:tpl(M.other, { z:num(z) }) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; bAnim = null; planeFade = 1;
        (PSTART[p.id] || PSTART.p1)();
        $("#lx-coefs", host).dataset.w = ""; $("#lx-vecs", host).dataset.w = "";
        paint();
      },
      run:function(p, done){
        function fin(){ busy = false; bAnim = null; planeFade = 1; api.save(); paint(); MV.changed(); done(); }
        if (p.id === "p1") tw(1200, function(t){ S.s2 = r9(2 * t); syncInputs(); paintRead(); draw2(); }, function(){
          S.s2 = 2; tw(1400, function(t){ S.t2 = r9(-3 * t); syncInputs(); paintRead(); draw2(); }, function(){ S.t2 = -3; paint(); MV.wait(900, fin); });
        });
        else if (p.id === "p2") tw(1800, function(t){ bAnim = [-1 + 5 * t, 2]; draw2(); }, function(){
          bAnim = null; S.b2 = [4, 2]; paint();
          var combos = []; for (var i = -5; i <= 5; i++) for (var j = -2; j <= 2; j++) { var r = add(scl(i * 0.5, S.a2), scl(j, S.b2)); if (Math.abs(r[0]) <= 8 && Math.abs(r[1]) <= 8) combos.push(r); }
          combos.sort(function(p, q){ return p[0] - q[0]; });
          tw(1500, function(t){ var n = Math.round(combos.length * t); for (var k = 0; k < n; k++) addDot(dots2, combos[k]); draw2(); }, function(){ combos.forEach(function(r){ addDot(dots2, r); }); paint(); MV.wait(900, fin); });
        });
        else if (p.id === "p3") tw(900, function(t){ planeFade = t; v3.draw(); }, function(){
          planeFade = 1; paint();
          stop = v3.turn(125, 6, 1700, function(){ MV.wait(700, function(){ stop = v3.turn(VIEWS.iso.th, VIEWS.iso.ph, 1300, function(){ stop = null; fin(); }); }); });
        });
        else if (p.id === "p4") {
          S.useC = true; S.paint = true; $("#lx-coefs", host).dataset.w = ""; paint();
          tw(1100, function(t){ S.u3 = r9(t); syncInputs(); paintRead(); v3.draw(); }, function(){
            S.u3 = 1; addDot(dots3, res3()); paint();
            stop = v3.turn(135, 0, 1700, function(){ MV.wait(1000, function(){ stop = v3.turn(VIEWS.iso.th, VIEWS.iso.ph, 1300, function(){ stop = null; fin(); }); }); });
          });
        }
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Reach the target ----------
// @component N15 moveChooser — a worked solution built one move at a time: each step offers three moves (shuffled, seeded);
//   a wrong move shows its feedback and stays on the step; the right one is added to the list of lines.
function part3(host, api){
  var S = api.S, C = api.content, S1 = C.s1, S2 = C.s2, S3 = C.s3;
  S.eq = S.eq || {}; S.mv = Number.isInteger(S.mv) ? clamp(S.mv, 0, S1.moves.length) : 0; S.eqOk = !!S.eqOk;
  S.tsel = S.tsel === "out" ? "out" : "in"; S.ans = S.ans || {}; S.k = typeof S.k === "number" ? clamp(S.k, -3, 3) : 0;
  var EQ = { x0:3, x1:-1, x2:1, y0:2, y1:2, y2:8 }, mvMsg = null, eqMsg = null, anim = { s:0, t:0 }, A1 = [3, 2], B1 = [-1, 2], T1 = [1, 8];
  var A2 = [1, 2, -1], B2 = [2, -1, 3], W2 = [2, -1, 1], W3 = [0, 5, 1];
  function box(k, lab){ return '<input class="numin short" data-eq="' + k + '" data-k="p3' + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(lab) + '" value="' + MV.esc(S.eq[k] || "") + '">'; }
  host.innerHTML =
    '<div class="part lc-st" data-st="1"><h3>' + S1.title + "</h3><p>" + S1.text + '</p><div class="sym lc-stg"><div class="lc-stl">' +
      '<p class="tiny muted">' + S1.eqHow + '</p><div class="lc-eqs">' +
      '<div class="lc-eqr"><span class="lc-eqn">' + m("x") + ":</span>" + box("x0", "x-equation, coefficient of s") + m("s +") + box("x1", "x-equation, coefficient of t") + m("t =") + box("x2", "x-equation, right side") + "</div>" +
      '<div class="lc-eqr"><span class="lc-eqn">' + m("y") + ":</span>" + box("y0", "y-equation, coefficient of s") + m("s +") + box("y1", "y-equation, coefficient of t") + m("t =") + box("y2", "y-equation, right side") + "</div></div>" +
      '<div class="lc-eqact"></div><div class="lc-moves"></div></div>' +
      '<div class="lc-str"><div class="plot-wrap"><canvas class="plot square" id="p3-c1" role="img" aria-label="Station 1 board"></canvas></div><dl class="read" id="p3-r1" aria-live="polite"></dl></div></div></div>' +
    '<div class="part lc-st" data-st="2"><h3>' + S2.title + "</h3><p>" + S2.text + '</p><div class="sym lc-stg"><div class="lc-stl">' +
      '<div class="chips" id="p3-tg" role="group" aria-label="Choose a target"></div><div id="p3-s2"></div></div>' +
      '<div class="lc-str"><div class="plot-wrap lc-3d" id="p3-w2" tabindex="0" role="group" aria-label="3D view. Drag it, or use the arrow keys, to rotate it."><canvas class="plot square" id="p3-c2" role="img" aria-label="Station 2 view"></canvas></div><div class="lc-views" id="p3-v2"></div></div></div></div>' +
    '<div class="part lc-st" data-st="3"><h3>' + S3.title + "</h3><p>" + S3.text + '</p><div class="sym lc-stg"><div class="lc-stl">' +
      '<label class="slider lc-sl"><span class="slider-top"><span>' + m("k") + '</span><output id="p3-kout"></output></span><input type="range" id="p3-k" min="-3" max="3" step="0.5" style="accent-color:var(--ink)" aria-label="k, from −3 to 3"></label>' +
      '<dl class="read" id="p3-r3" aria-live="polite"></dl><p class="lc-s3msg" id="p3-s3msg" aria-live="polite"></p>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + S3.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details></div>" +
      '<div class="lc-str"><div class="plot-wrap lc-3d" id="p3-w3" tabindex="0" role="group" aria-label="3D view. Drag it, or use the arrow keys, to rotate it."><canvas class="plot square" id="p3-c3" role="img" aria-label="Station 3 view"></canvas></div><div class="lc-views" id="p3-v3"></div></div></div></div>';

  // ----- station 1 -----
  var pl1 = new MV.Plot($("#p3-c1", host), { xmin:-4, xmax:6, ymin:-2, ymax:9 });
  function done1(){ return S.eqOk && S.mv >= S1.moves.length; }
  function draw1(){
    var s = anim.s, t = anim.t, r = add(scl(s, A1), scl(t, B1));
    board(pl1, { view:{ xmin:-4, xmax:6, ymin:-2, ymax:9 }, a:A1, b:B1, s:s, t:t, grid:1, target:T1, label:done1() && near(s, 1.25) ? ["5/4", "@a", " + 11/4", "@b"] : null,
      describe:"a = (3, 2) and b = (−1, 2) with a skewed grid and the target (1, 8). " + (done1() ? "The result " + num(s) + " a plus " + num(t) + " b is at (" + sayV(r) + ")" + (same(r, T1) ? ", on the target." : ".") : "Solve for s and t to move the result.") });
    var rows = [["Target", m("(1, 8)")]];
    rows.push([m("s") + ", " + m("t"), done1() ? m("s = 5/4") + ", " + m("t = 11/4") : '<span class="muted">solve to find them</span>']);
    if (done1()) rows.push(["Check", m("{5}/{4}(3, 2) + {11}/{4}(-1, 2) = (1, 8)") + " ✓"]);
    $("#p3-r1", host).innerHTML = MV.readoutHTML(rows);
  }
  pl1.render = draw1;
  function choices(i){ return MV.shuffle(S1.moves[i].choices.map(function(c, j){ return { c:c, j:j }; }), "mcv4u40mv" + i); }
  function paint1(){
    var st = $('[data-st="1"]', host), act = $(".lc-eqact", st), mv = $(".lc-moves", st);
    $$("[data-eq]", st).forEach(function(inp){ inp.disabled = S.eqOk; });
    MV.keepFocus(act, function(){
      act.innerHTML = S.eqOk ? MV.fbHTML("good", S1.eqDone) : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="eq" data-k="p3eqchk">Check equations</button></div>' + (eqMsg ? MV.fbHTML(eqMsg.bad ? "bad" : "", eqMsg.html) : "");
    });
    var h = "";
    if (S.eqOk) {
      h += '<ol class="lc-mvdone">' + S1.moves.slice(0, S.mv).map(function(mo){ var c = mo.choices.filter(function(x){ return MV.ok(x); })[0]; return "<li>" + c.t + "</li>"; }).join("") + "</ol>";
      if (S.mv < S1.moves.length) {
        h += '<p class="lc-mvq"><strong>Move ' + (S.mv + 1) + " of " + S1.moves.length + ":</strong> " + S1.moves[S.mv].prompt + '</p><div class="lc-mvch" role="group" aria-label="Choose the next move">' +
          choices(S.mv).map(function(x){ return '<button type="button" class="btn ghost lc-mvb" data-mv="' + x.j + '" data-k="p3mv' + S.mv + "_" + x.j + '">' + x.c.t + "</button>"; }).join("") + "</div>" +
          (mvMsg ? MV.fbHTML("bad", mvMsg) : "");
      } else h += MV.fbHTML("good", S1.done) + '<p class="lc-note">' + S1.note + "</p>";
    }
    MV.keepFocus(mv, function(){ mv.innerHTML = h; });
    draw1();
  }
  function runAnim(){
    anim = { s:0, t:0 };
    MV.tween({ dur:1100, step:function(t){ anim.s = 1.25 * t; draw1(); }, done:function(){ anim.s = 1.25;
      MV.tween({ dur:1100, step:function(t){ anim.t = 2.75 * t; draw1(); }, done:function(){ anim.t = 2.75; draw1(); } });
    } });
  }
  if (done1()) anim = { s:1.25, t:2.75 };
  function checkEq(){
    var v = {}, k, bad = false;
    for (k in EQ) { var p = MV.parseNum(String(S.eq[k] || "").trim()); if (!p || p.length !== 1) { eqMsg = { bad:false, html:"Fill in every box with a whole number." }; return; } v[k] = p[0]; }
    for (k in EQ) if (!near(v[k], EQ[k])) bad = true;
    if (!bad) { S.eqOk = true; eqMsg = null; return; }
    var W = S1.eqWrong;
    if (near(v.x0, 3) && near(v.x1, 2) || near(v.x0, 3) && near(v.y0, -1) || near(v.x1, 2) && near(v.y0, -1)) eqMsg = { bad:true, html:"<strong>✗ Not quite.</strong> " + W.swap };
    else if (near(v.x1, 1) || near(v.y1, -2)) eqMsg = { bad:true, html:"<strong>✗ Not quite.</strong> " + W.sign };
    else eqMsg = { bad:true, html:"<strong>✗ Not quite.</strong> " + W.other };
  }
  var s1 = $('[data-st="1"]', host);
  s1.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.eq; if (!k) return; S.eq[k] = e.target.value; api.save(); });
  s1.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.eq) { var b = $('[data-act="eq"]', s1); if (b) b.click(); } });
  s1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.act === "eq") { checkEq(); api.save(); paint1(); MV.focusFb($(".lc-eqact", s1)); return; }
    if (b.dataset.mv != null) {
      var mo = S1.moves[S.mv], c = mo.choices[+b.dataset.mv];
      if (MV.ok(c)) { S.mv++; mvMsg = null; api.save(); paint1(); if (S.mv >= S1.moves.length) runAnim(); }
      else { mvMsg = "<strong>✗ Not quite.</strong> " + c.fb; paint1(); }
      MV.focusFb($(".lc-moves", s1));
    }
  });
  paint1();

  // ----- station 2 -----
  function T2(){ return S2.targets.filter(function(x){ return x.id === S.tsel; })[0]; }
  var w2 = view3d($("#p3-w2", host), $("#p3-c2", host), { key:"p3v2", views:$("#p3-v2", host), scene:function(){
    var T = T2(), sc = { L:8, polys:[], dots:[], segs:[], pts:[], labels:[] }, ink = css("--ink"), ink2 = css("--ink-2"), ans = S.ans[T.id], inn = T.id === "in";
    spanPlaneScene(sc, [A2, B2], 8);
    vecSegs(sc, [{ v:A2, color:css("--pen"), name:"a" }, { v:B2, color:css("--f3"), name:"b" }]);
    var c = add(scl(T.st[0], A2), scl(T.st[1], B2));
    if (ans && ans.ok) {
      if (!inn) { sc.segs.push({ p:T.p, q:c, color:ink2, width:1.6, dash:[6, 5] }); sc.pts.push({ p:c, color:ink2, r:4 }); sc.labels.push({ p:c, text:"(" + c.map(num).join(", ") + ")", dx:10, dy:0, color:ink2 }); }
    }
    sc.pts.push({ p:T.p, color:ink, r:5.5, glow:!!(ans && ans.ok && inn) });
    sc.labels.push({ p:T.p, text:"(" + T.p.map(num).join(", ") + ")" + (ans && ans.ok ? (inn ? ": on the plane" : ": off the plane") : ""), dx:10, dy:-14 });
    sc.describe = "3D view: a = (1, 2, −1), b = (2, −1, 3) and their span plane through the origin; the target (" + sayV(T.p) + ")" + (ans && ans.ok ? (inn ? " lies on the plane." : " hovers off the plane; 3a − b lands at (1, 7, −6) instead.") : ".");
    return sc;
  } });
  function algRows(T){
    var s = T.st[0], t = T.st[1];
    return ["x", "y", "z"].map(function(ax, i){
      var lhs = comb([A2[i], B2[i]], ["s", "t"]).replace(/vec\{(\w)\}/g, "$1"), val = A2[i] * s + B2[i] * t, ok = val === T.p[i];
      var subs = [[A2[i], s], [B2[i], t]].map(function(q, j){ var c = q[0], v = "(" + q[1] + ")"; return (j && c >= 0 ? " + " : j ? " - " : c < 0 ? "-" : "") + (Math.abs(c) === 1 ? "" : Math.abs(c)) + v; }).join("");
      return "<div>" + m(ax) + ": " + m(lhs + " = " + T.p[i]) + "; " + m(subs + " = " + val) + " " + (ok ? "✓" : m("≠ " + T.p[i]) + " ✗") + "</div>";
    }).join("");
  }
  function paint2(){
    var T = T2(), ans = S.ans[T.id], el = $("#p3-s2", host), tg = $("#p3-tg", host);
    MV.keepFocus(tg, function(){ tg.innerHTML = '<span class="tiny lc-vlab">Target</span>' + S2.targets.map(function(x){ var on = x.id === S.tsel; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-tg="' + x.id + '" data-k="p3tg' + x.id + '" aria-pressed="' + on + '">' + m(vs(x.p)) + "</button>"; }).join(""); });
    var h = '<p class="lc-first">' + T.first + '</p><p class="lc-ask">' + S2.ask + '</p>';
    if (!(ans && ans.ok)) h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-yn="yes" data-k="p3yes">' + S2.yesT + '</button><button type="button" class="btn ghost sm" data-yn="no" data-k="p3no">' + S2.noT + "</button></div>";
    if (ans) h += MV.fbHTML(ans.ok ? "good" : "bad", ans.ok ? T[ans.pick] : "<strong>✗ Not quite.</strong> " + T[ans.pick] + " Try again.");
    h += '<details class="alg"' + (S.algOpen ? " open" : "") + '><summary>Check it with algebra</summary><div class="alg-lines">' + algRows(T) + "</div></details>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
    w2.draw();
  }
  $('[data-st="2"]', host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.tg) { S.tsel = b.dataset.tg; api.save(); paint2(); return; }
    if (b.dataset.yn) { var T = T2(), right = T.id === "in" ? "yes" : "no"; S.ans[T.id] = { pick:b.dataset.yn, ok:b.dataset.yn === right }; api.save(); paint2(); MV.focusFb($("#p3-s2", host)); }
  });
  $('[data-st="2"]', host).addEventListener("toggle", function(e){ if (e.target.matches && e.target.matches("details.alg")) { S.algOpen = e.target.open; api.save(); } }, true);
  paint2();

  // ----- station 3 -----
  var N3 = cross(W2, W3);
  function on3(){ return Math.abs(dot([1, 2, S.k], N3)) < 1e-9; }
  var w3 = view3d($("#p3-w3", host), $("#p3-c3", host), { key:"p3v3", views:$("#p3-v3", host), scene:function(){
    var a = [1, 2, S.k], sc = { L:6, polys:[], dots:[], segs:[], pts:[], labels:[] }, on = on3();
    spanPlaneScene(sc, [W2, W3], 6);
    vecSegs(sc, [{ v:W2, color:css("--f3") }, { v:W3, color:css("--f5") }, { v:a, color:css("--pen"), name:"a" }]);
    sc.labels.push({ p:W2, text:"(2, −1, 1)", dx:8, dy:12, color:css("--f3") }, { p:W3, text:"(0, 5, 1)", dx:8, dy:-14, color:css("--f5") });
    if (!on) { var nn = dot(N3, N3), foot = sub(a, scl(dot(a, N3) / nn, N3)); sc.segs.push({ p:a, q:foot, color:css("--ink-2"), width:1.6, dash:[6, 5] }); }
    sc.pts.push({ p:a, color:css("--pen"), r:4.5, glow:on });
    sc.describe = "3D view: the plane spanned by (2, −1, 1) and (0, 5, 1), and a = (1, 2, " + say(S.k) + ")" + (on ? ", whose tip lies on the plane." : ", whose tip is off the plane; a dashed line drops to the plane.");
    return sc;
  } });
  function paint3(){
    var on = on3(), inp = $("#p3-k", host);
    if (+inp.value !== S.k) inp.value = S.k;
    $("#p3-kout", host).textContent = num(S.k);
    inp.setAttribute("aria-valuetext", num(S.k) + (on ? ": on the plane" : ": off the plane"));
    $("#p3-r3", host).innerHTML = MV.readoutHTML([[m("vec{a}"), m(vs([1, 2, S.k]))], ["Tip of " + m("vec{a}"), on ? "on the plane ✓" : "off the plane"]]);
    var msg = $("#p3-s3msg", host); msg.innerHTML = on ? S3.on : S3.off; msg.classList.toggle("on", on);
    w3.draw();
  }
  $("#p3-k", host).addEventListener("input", function(e){ S.k = +e.target.value; api.save(); paint3(); });
  paint3();
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Find the combination ----------
// @component V8 coefBoxes (trimmed from MCV4U 13 pointBoxes) — labelled exact-answer boxes (fractions such as 3/2 accepted), named
//   wrong states per box values, an item-level default message, first-try scoring and three-level help where the plan gives hints.
function comboAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function nv(s){ var p = MV.parseNum(String(s).replace(/−/g, "-")); return p && p.length === 1 ? p[0] : NaN; }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q lc-pq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="lc-pin"></div><div class="lc-pcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .lc-pin', host);
    var h = '<div class="lc-bxs">' + it.boxes.map(function(b){ return "<label><span>" + b.label + '</span><input class="numin short" data-bx="' + b.k + '" data-k="' + it.id + b.k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(MV.plain(b.label)) + '" value="' + MV.esc(x.v[b.k] || "") + '"' + (x.solved ? " disabled" : "") + "></label>"; }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .lc-pcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, i;
    for (i = 0; i < it.boxes.length; i++) {
      var raw = String(x.v[it.boxes[i].k] || "").trim();
      if (!raw) return { err:it.boxes.length > 1 ? "Fill in every box first." : "Type your answer first." };
      var v = nv(raw); if (!isFinite(v)) return { err:TX.err };
      vals[it.boxes[i].k] = v;
    }
    if (Object.keys(ans).every(function(k){ return near(vals[k], nv(ans[k]), 1e-9); })) return { ok:true };
    var w = (it.wrong || []).filter(function(z){ return Object.keys(z).filter(function(k){ return k !== "fb"; }).every(function(k){ return near(vals[k], nv(z[k]), 1e-9); }); })[0];
    if (w) return { ok:false, msg:w.fb };
    if (it.fb) return { ok:false, msg:it.fb };
    var right = it.boxes.filter(function(b){ return near(vals[b.k], nv(ans[b.k]), 1e-9); });
    if (it.boxes.length > 1 && right.length) return { ok:false, msg:"Your " + MV.plain(right[0].label) + " is right; check the other box." };
    return { ok:false, msg:TX.boxes };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
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
// ---------- Performance task: Through the target (V1 view, s, t finder) ----------
var task = (function(){
  var api, v3, A = [1, 2, 2], T = [3, 2, 4];
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -3 && v <= 3 ? v : null; }
  function read(){ var b = [gi("b1"), gi("b2"), gi("b3")]; return { b:b, valid:b.every(function(v){ return v !== null; }) }; }
  function inSpan(b){ return !isPar(A, b) && Math.abs(dot(T, cross(A, b))) < 1e-9; }
  function checks(d){ if (!d.valid) return [false, false, false]; return [!isPar(A, d.b), inSpan(d.b), dot(d.b, d.b) === 5]; }
  function stTxt(b){ var st = solve2(A, b, T); return st ? m("(3, 2, 4) = " + comb([st.s, st.t], ["a", "b"])) : null; }
  function scene(){
    var d = read(), b = d.valid ? d.b : [0, 0, 0], sc = { L:5, polys:[], dots:[], segs:[], pts:[], labels:[] }, on = d.valid && inSpan(b);
    spanPlaneScene(sc, [A, b], 5);
    vecSegs(sc, [{ v:A, color:css("--pen"), name:"a" }, { v:b, color:css("--f3"), name:"b" }]);
    sc.pts.push({ p:T, color:css("--ink"), r:5.5, glow:on });
    sc.labels.push({ p:T, text:"(3, 2, 4)" + (on ? ": on the plane" : ""), dx:10, dy:-14 });
    var sp = span3([A, b]);
    sc.describe = "3D view: a = (1, 2, 2)" + (d.valid ? ", b = (" + sayV(b) + ")" : "") + "; their span is " + ["just the origin", "a line through the origin", "a plane through the origin", "all of R³"][sp.dim] + ". The target (3, 2, 4) " + (on ? "lies on the plane and glows." : "is not in the span.");
    return sc;
  }
  function readout(){
    var d = read(), el = $("#lt-read"); if (!el) return;
    var rows = [[m("vec{a}"), m("(1, 2, 2)")], [m("vec{b}"), d.valid ? m(vs(d.b)) : '<span class="muted">Choose whole numbers from −3 to 3.</span>']];
    if (d.valid) {
      rows.push([m("|vec{b}|^2"), m(d.b.map(function(v){ return v < 0 ? "(" + v + ")^2" : v + "^2"; }).join(" + ") + " = " + dot(d.b, d.b))]);
      if (api.S.find) rows.push([m("s") + ", " + m("t") + " finder", isPar(A, d.b) ? m("vec{b}") + " is parallel to " + m("vec{a}") + ": the span is only a line, and (3, 2, 4) isn’t on it." : (stTxt(d.b) || "No " + m("s") + " and " + m("t") + " work: the target is off the plane.")]);
    }
    el.innerHTML = MV.readoutHTML(rows);
    var fb = $("#lt-find"); if (fb) { fb.setAttribute("aria-pressed", String(!!api.S.find)); fb.textContent = api.S.find ? "Hide the s, t finder" : "Find s and t"; }
  }
  function stepper(k, lab){
    return '<div class="it-step lc-step"><label for="lt-' + k + '"><span class="m lc-lab">' + lab + '</span> <span class="tiny muted">(−3 to 3)</span></label>' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="lt' + k + 'm" aria-label="Decrease ' + k + '">' + MV.MINUS + "</button>" +
      '<input class="numin short" id="lt-' + k + '" data-tk="' + k + '" type="number" min="-3" max="3" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="lt' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.b1 == null) { a.S.b1 = "0"; a.S.b2 = "0"; a.S.b3 = "1"; }
      inp.innerHTML = '<p class="tiny" style="font-weight:700;margin:0">' + m("vec{b} = (b_1, b_2, b_3)") + "</p>" + stepper("b1", m("b_1")) + stepper("b2", m("b_2")) + stepper("b3", m("b_3")) +
        '<p style="margin:14px 0 0"><button type="button" class="btn ghost sm" id="lt-find" data-k="ltfind" aria-pressed="false">Find s and t</button></p>';
      pv.innerHTML = '<div class="plot-wrap lc-3d" id="lt-w" tabindex="0" role="group" aria-label="3D view. Drag it, or use the arrow keys, to rotate it."><canvas class="plot square" id="lt-c" role="img" aria-label="Your vectors, their span and the target"></canvas></div><div class="lc-views" id="lt-v"></div><dl class="read" id="lt-read" aria-live="polite" style="margin-top:10px"></dl>';
      v3 = view3d($("#lt-w"), $("#lt-c"), { scene:scene, views:$("#lt-v"), key:"lt" });
      function upd(){ a.save(); v3.draw(); readout(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.id === "lt-find") { a.S.find = !a.S.find; a.save(); readout(); return; }
        if (!b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -3, 3)); $("#lt-" + k).value = a.S[k]; upd();
      });
      v3.draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Choose whole numbers from −3 to 3 for each component of " + m("vec{b}") + "."; },
    checks:checks,
    key:function(d){ return d.b.join(","); },
    label:function(k){ var b = k.split(",").map(Number); return m("vec{b} = " + vs(b)) + ": " + (stTxt(b) || ""); },
    text:function(k){ var b = k.split(",").map(Number); return "b = (" + b.map(function(v){ return num(v); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ combo:comboAct },
  task:task
});
})();
