// MCV4U 52 Cartesian Equation of a Plane: hero (a normal grows from P₀(1, 1, 1) and a right-angled arrow sweeps out the
// plane while its equation collapses to x + 2y + 2z − 5 = 0), Normal and plane (Explore: V1 3D view with three modes,
// Normal + point / Equation / Two planes, live V12 readouts), Converting between forms (Part 3: three stations, each
// with its own 3D view), Build the equation (Practice 2, coefficient boxes) and the "Plane to order" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
var PI = Math.PI, AXN = ["x", "y", "z"], CPN = ["yz", "xz", "xy"];
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
function isDark(){ var t = document.documentElement.getAttribute("data-theme"); return t === "dark" || (t !== "light" && !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)); }
function fillA(){ return isDark() ? 0.18 : 0.14; }

// ---------- vectors and integer helpers ----------
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function mul(a, k){ return [a[0] * k, a[1] * k, a[2] * k]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function unit(a){ var l = len(a) || 1; return mul(a, 1 / l); }
function zero3(a){ return !a[0] && !a[1] && !a[2]; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
// a is a non-zero multiple of b (any length)
function isMult(a, b){
  var nz = false, i, j;
  for (i = 0; i < a.length; i++) { if (a[i]) nz = true; for (j = 0; j < a.length; j++) if (a[i] * b[j] !== a[j] * b[i]) return false; }
  return nz && b.some(function(v){ return v; });
}
function norm4(c){ var g = c.reduce(gcd, 0) || 1, f = c.filter(function(v){ return v; })[0] || 1, s = f < 0 ? -1 : 1; return c.map(function(v){ return v / g * s + 0; }); }
// perpendicular unit vectors spanning the plane with normal n
function basis(n){
  var a = Math.abs(n[0]) <= Math.abs(n[1]) && Math.abs(n[0]) <= Math.abs(n[2]) ? [1, 0, 0] : Math.abs(n[1]) <= Math.abs(n[2]) ? [0, 1, 0] : [0, 0, 1];
  var u = unit(cross(n, a)); return [u, unit(cross(unit(n), u))];
}

// ---------- notation (m() sources; hyphens become true minus signs) ----------
function nT(v){ return v < 0 ? "-" + Math.abs(v) : String(v); }
function vSrc(a){ return "(" + a.map(nT).join(", ") + ")"; }
function fracSrc(n, d){ if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? nT(n) : nT(n) + "/" + d; }
function eqSrc(c){
  var s = "";
  for (var i = 0; i < 3; i++) { var a = c[i]; if (!a) continue; var t = (Math.abs(a) === 1 ? "" : Math.abs(a)) + AXN[i]; s += s ? (a < 0 ? " - " : " + ") + t : (a < 0 ? "-" : "") + t; }
  if (c[3]) s += s ? (c[3] < 0 ? " - " : " + ") + Math.abs(c[3]) : nT(c[3]);
  return (s || "0") + " = 0";
}
function eqPlain(c){ return MV.plain(m(eqSrc(c))); }
function angDeg(cv){ return Math.acos(clamp(cv, -1, 1)) * 180 / PI; }
function angTxt(a){ var r = Math.round(a); return Math.abs(a - r) < 1e-6 ? r + "°" : "≈ " + MV.num(a, 1) + "°"; }
function axisWord(i){ return m(AXN[i]) + "-axis"; }
function icptHTML(c){
  return [0, 1, 2].map(function(i){
    if (c[i]) return m(AXN[i] + " = " + fracSrc(-c[3], c[i]));
    return m(AXN[i]) + ": " + (c[3] ? "none (parallel to the " + axisWord(i) + ")" : "every point");
  }).join(", ");
}
function specials(c){
  var out = [], z = [0, 1, 2].filter(function(i){ return !c[i]; });
  if (z.length === 2) { var k = [0, 1, 2].filter(function(i){ return c[i]; })[0]; out.push(c[3] ? "Parallel to the " + m(CPN[k]) + "-plane" : "The " + m(CPN[k]) + "-plane"); }
  else z.forEach(function(i){ out.push(c[3] ? "Parallel to the " + axisWord(i) + " (no " + m(AXN[i]) + "-term)" : "Contains the " + axisWord(i)); });
  if (!c[3] && z.length < 2) out.push("Through the origin");
  return out.length ? out.join("; ") : "none";
}
// two planes: kind same | par | perp | nei, with the angle between normals and between planes
function relation(a, b){
  var n1 = a.slice(0, 3), n2 = b.slice(0, 3), d = dot(n1, n2);
  if (zero3(cross(n1, n2))) return { k:isMult(a, b) ? "same" : "par", d:d };
  if (d === 0) return { k:"perp", d:0, angN:90, angP:90 };
  var cv = d / (len(n1) * len(n2)), aN = angDeg(cv);
  return { k:"nei", d:d, angN:aN, angP:Math.min(aN, 180 - aN) };
}
function meetLine(a, b){
  var n1 = a.slice(0, 3), n2 = b.slice(0, 3), d = cross(n1, n2), dd = dot(d, d);
  if (dd < 1e-12) return null;
  return { p:mul(add(mul(cross(n2, d), -a[3]), mul(cross(d, n1), -b[3])), 1 / dd), d:d };
}
function nearest(c){ var n = c.slice(0, 3); return mul(n, -c[3] / dot(n, n)); }

// =====================================================================================================================
// @component V1 view3d — orthographic 3D view on an MV.Plot canvas (so it redraws on resize, theme and font load).
// Scene: planes [{c:[A,B,C,D], color, alpha, dash}] clipped to the box [−B, B]³ (back to front), axes x, y, z with arrows,
// segs [{a, b, color, width, dash}], lines [{p, d, color}] clipped to the box, polys [{pts, color, alpha}] (fans),
// rights [{at, u, w, k, color}] right-angle marks, arrows [{from, vec, color, width, label}], points [{p, color, label, ring}].
// Rotate by dragging or with the arrow keys on the focused canvas; presets Isometric · Front · Side · Top.
// tip: an optional draggable handle (opt.tip() -> {pos, n, k}; opt.onTip(newN) in whole-number steps).
var VIEWS = { iso:[0.72, 0.42], front:[0, 0], side:[PI / 2, 0], top:[0, PI / 2] };
function boxPoly(c, B){
  var n = c.slice(0, 3), d = c[3], V = [], pts = [], i, k;
  if (zero3(n)) return null;
  for (i = 0; i < 8; i++) V.push([(i & 1) ? B : -B, (i & 2) ? B : -B, (i & 4) ? B : -B]);
  for (i = 0; i < 8; i++) for (k = 0; k < 3; k++) {
    var j = i | (1 << k); if (j === i) continue;
    var a = V[i], b = V[j], fa = dot(n, a) + d, fb = dot(n, b) + d;
    if (fa === fb || fa * fb > 0) continue;
    pts.push(add(a, mul(sub(b, a), fa / (fa - fb))));
  }
  var u = []; pts.forEach(function(p){ if (!u.some(function(q){ return len(sub(p, q)) < 1e-7; })) u.push(p); });
  if (u.length < 3) return null;
  var ce = mul(u.reduce(add, [0, 0, 0]), 1 / u.length), e1 = unit(sub(u[0], ce)), e2 = cross(unit(n), e1);
  function an(p){ var q = sub(p, ce); return Math.atan2(dot(q, e2), dot(q, e1)); }
  u.sort(function(p, q){ return an(p) - an(q); });
  return u;
}
function clipLine(p, d, B){
  var t0 = -1e9, t1 = 1e9;
  for (var i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-12) { if (Math.abs(p[i]) > B) return null; continue; }
    var a = (-B - p[i]) / d[i], b = (B - p[i]) / d[i]; t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
  }
  return t1 > t0 ? [add(p, mul(d, t0)), add(p, mul(d, t1))] : null;
}
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(bx - 3, Y - 10, w + 6, 20); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
function arrow2(ctx, A, Bp, col, w){
  var dx = Bp[0] - A[0], dy = Bp[1] - A[1], L = Math.hypot(dx, dy), h = Math.min(12, L * 0.45), ux = L ? dx / L : 0, uy = L ? dy / L : 0;
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(Bp[0] - ux * h * 0.7, Bp[1] - uy * h * 0.7); ctx.stroke();
  if (L < 5) return;
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(Bp[0], Bp[1]);
  ctx.lineTo(Bp[0] - h * ux + h * 0.42 * uy, Bp[1] - h * uy - h * 0.42 * ux); ctx.lineTo(Bp[0] - h * ux - h * 0.42 * uy, Bp[1] - h * uy + h * 0.42 * ux);
  ctx.closePath(); ctx.fill();
}
function draw3(v){
  var sc = v.sc || {};
  v.p.draw({ grid:false, axes:false, describe:sc.describe || "Three-dimensional view.", after:function(ctx, P){
    var W = P.W, H = P.H, B = v.B, s = Math.min(W, H) / (3.5 * B), cx = W / 2, cy = H / 2;
    var ca = Math.cos(v.az), sa = Math.sin(v.az), ce = Math.cos(v.el), se = Math.sin(v.el);
    function pr(q){ return [cx + s * (-q[0] * sa + q[1] * ca), cy - s * (-se * ca * q[0] - se * sa * q[1] + ce * q[2])]; }
    function dp(q){ return ce * ca * q[0] + ce * sa * q[1] + se * q[2]; }
    v.pr = pr; v.R = [-sa, ca, 0]; v.U = [-se * ca, -se * sa, ce]; v.s = s;
    function path(pts){ ctx.beginPath(); pts.forEach(function(q, i){ var z = pr(q); if (i) ctx.lineTo(z[0], z[1]); else ctx.moveTo(z[0], z[1]); }); }
    function seg(a, b, col, w, dash){ var A = pr(a), Bq = pr(b); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(Bq[0], Bq[1]); ctx.stroke(); ctx.restore(); }
    // planes, far to near
    var pl = (sc.planes || []).map(function(q){ var poly = boxPoly(q.c, q.B || B); return poly ? { q:q, poly:poly, z:dp(mul(poly.reduce(add, [0, 0, 0]), 1 / poly.length)) } : null; })
      .filter(Boolean).sort(function(a, b){ return a.z - b.z; });
    pl.forEach(function(o){
      ctx.save(); path(o.poly); ctx.closePath(); ctx.globalAlpha = o.q.alpha == null ? fillA() : o.q.alpha; ctx.fillStyle = o.q.color; ctx.fill();
      ctx.globalAlpha = 0.7; ctx.strokeStyle = o.q.color; ctx.lineWidth = 1.4; ctx.setLineDash(o.q.dash || []); ctx.stroke(); ctx.restore();
    });
    (sc.polys || []).forEach(function(o){ if (o.pts.length < 3) return; ctx.save(); path(o.pts); ctx.closePath(); ctx.globalAlpha = o.alpha == null ? fillA() : o.alpha; ctx.fillStyle = o.color; ctx.fill(); ctx.restore(); });
    // axes
    var axc = css("--plot-axis") || css("--ink-2");
    for (var i = 0; i < 3; i++) {
      var e = [0, 0, 0], e2 = [0, 0, 0]; e[i] = -B; e2[i] = B * 1.12;
      ctx.save(); ctx.globalAlpha = 0.85; arrow2(ctx, pr(e), pr(e2), axc, 1.4); ctx.restore();
      ctx.save(); ctx.fillStyle = axc;
      for (var t = -Math.floor(B); t <= Math.floor(B); t++) { if (!t) continue; var tk = [0, 0, 0]; tk[i] = t; var z = pr(tk); ctx.beginPath(); ctx.arc(z[0], z[1], 1.7, 0, 2 * PI); ctx.fill(); }
      ctx.restore();
      var lb = [0, 0, 0]; lb[i] = B * 1.24; var zl = pr(lb); bgText(ctx, AXN[i], zl[0], zl[1], "center", css("--ink"), mfont(15));
    }
    (sc.segs || []).forEach(function(o){ seg(o.a, o.b, o.color, o.width, o.dash); });
    (sc.lines || []).forEach(function(o){ var c2 = clipLine(o.p, o.d, B); if (c2) seg(c2[0], c2[1], o.color, o.width || 2.6, o.dash); });
    (sc.rights || []).forEach(function(o){
      var k = o.k || 0.45, a = add(o.at, mul(o.u, k)), b = add(a, mul(o.w, k)), c2 = add(o.at, mul(o.w, k));
      ctx.save(); ctx.strokeStyle = o.color || css("--ink"); ctx.lineWidth = 1.6; path([a, b, c2]); ctx.stroke(); ctx.restore();
    });
    (sc.arrows || []).forEach(function(o){
      var A = pr(o.from), Z = pr(add(o.from, o.vec)); arrow2(ctx, A, Z, o.color, o.width || 3);
      if (o.label) { var dx = Z[0] - A[0], dy = Z[1] - A[1], L = Math.hypot(dx, dy) || 1; bgText(ctx, o.label, Z[0] + dx / L * 14, Z[1] + dy / L * 14, "center", o.color, mfont(15)); }
    });
    (sc.points || []).forEach(function(o){
      var z = pr(o.p); ctx.save();
      if (o.ring) { ctx.strokeStyle = o.color; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(z[0], z[1], 9, 0, 2 * PI); ctx.stroke(); }
      else { ctx.fillStyle = o.color || css("--ink"); ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(z[0], z[1], o.r || 5, 0, 2 * PI); ctx.fill(); ctx.stroke(); }
      ctx.restore();
      if (o.label) bgText(ctx, o.label, z[0] + 9, z[1] - 13, "left", o.color || css("--ink"), ui(13, 700));
    });
    if (sc.after) sc.after(ctx, pr);
  } });
}
// mount a 3D view (canvas + view presets) into wrap; returns the view object
function mount3(wrap, opt){
  opt = opt || {};
  var id = opt.id || "v3", T = { iso:"Isometric", front:"Front", side:"Side", top:"Top" };
  wrap.innerHTML = '<div class="plot-wrap"><canvas class="plot' + (opt.square ? " square" : "") + ' cp-cv" tabindex="0" role="img" aria-label="' + MV.esc(opt.aria || "3D view") + '"></canvas></div>' +
    '<div class="cp-vbar"><span class="seg" role="group" aria-label="View">' + Object.keys(T).map(function(k){
      return '<button type="button" data-vw="' + k + '" data-k="' + id + k + '" aria-pressed="' + (k === "iso") + '">' + T[k] + "</button>"; }).join("") + "</span></div>" +
    '<p class="tiny muted cp-vnote">Drag the view to rotate it, or focus it and use the arrow keys.</p>';
  var cv = $("canvas", wrap), v = { az:VIEWS.iso[0], el:VIEWS.iso[1], B:opt.B || 5, sc:{}, p:new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }) };
  v.p.render = function(){ draw3(v); };
  v.set = function(sc){ v.sc = sc || {}; draw3(v); };
  function pressed(k){ $$("[data-vw]", wrap).forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.vw === k)); }); }
  v.preset = function(k){ v.az = VIEWS[k][0]; v.el = VIEWS[k][1]; pressed(k); draw3(v); };
  wrap.addEventListener("click", function(e){ var b = e.target.closest("[data-vw]"); if (!b || b.disabled) return; v.preset(b.dataset.vw); });
  var drag = null;
  cv.style.touchAction = "none";
  function busy(){ return opt.busy && opt.busy(); }
  cv.addEventListener("pointerdown", function(e){
    if (busy()) return;
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, t = opt.tip && opt.tip();
    drag = null;
    if (t && v.pr) { var q = v.pr(t.pos); if (Math.hypot(q[0] - x, q[1] - y) < 20) drag = { tip:true, x:x, y:y, n:t.n.slice(), k:t.k }; }
    if (!drag) drag = { x:x, y:y, az:v.az, el:v.el };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    e.preventDefault();
  });
  cv.addEventListener("pointermove", function(e){
    if (!drag || busy()) return;
    var r = cv.getBoundingClientRect(), dx = e.clientX - r.left - drag.x, dy = e.clientY - r.top - drag.y;
    if (drag.tip) {
      var w = mul(add(mul(v.R, dx), mul(v.U, -dy)), 1 / (v.s * drag.k)), n = add(drag.n, w).map(function(c){ return clamp(Math.round(c), -4, 4); });
      if (!zero3(n)) opt.onTip(n); return;
    }
    v.az = drag.az - dx * 0.012; v.el = clamp(drag.el + dy * 0.012, -PI / 2, PI / 2); pressed(""); draw3(v);
  });
  function end(){ drag = null; }
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
  cv.addEventListener("keydown", function(e){
    if (busy()) return;
    var st = PI / 24;
    if (e.key === "ArrowLeft") v.az += st; else if (e.key === "ArrowRight") v.az -= st;
    else if (e.key === "ArrowUp") v.el = clamp(v.el + st, -PI / 2, PI / 2); else if (e.key === "ArrowDown") v.el = clamp(v.el - st, -PI / 2, PI / 2);
    else return;
    e.preventDefault(); pressed(""); draw3(v);
  });
  return v;
}
// plane-with-normal scene pieces
function normalAt(at, n, k, col, label){
  var bs = basis(n);
  return { arrow:{ from:at, vec:mul(n, k), color:col, width:3.2, label:label }, right:{ at:at, u:bs[0], w:unit(n), k:0.45, color:css("--ink") } };
}
// ------------------------------------------------------ end of V1 view3d ------------------------------------------------------

// =====================================================================================================================
// ---------- Hero: n = (1, 2, 2) grows from P₀(1, 1, 1); an arrow at 90° to n sweeps out the plane ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var P0 = [1, 1, 1], N = [1, 2, 2], K = 0.62, bs = basis(N), R = 2.6, pen = function(){ return css("--pen"); };
  var v = { az:VIEWS.iso[0], el:VIEWS.iso[1], B:4, sc:{}, p:new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }) };
  var st = { a:0, k:0, phi:0, full:false, eq:0 };
  function onPlane(phi){ return add(P0, add(mul(bs[0], R * Math.cos(phi)), mul(bs[1], R * Math.sin(phi)))); }
  function mag(t){ return '<span class="cp-mag">' + m(t) + "</span>"; }
  var E1 = [mag("(1)"), m("(x - 1) +"), mag("2"), m("(y - 1) +"), mag("2"), m("(z - 1) = 0")];
  var E2 = mag("1") + m("x +") + " " + mag("2") + m("y +") + " " + mag("2") + m("z - 5 = 0");
  function draw(){
    var sc = { arrows:[], rights:[], points:[], polys:[], planes:[] }, ink = css("--ink"), f4 = css("--f4");
    if (st.full) sc.planes.push({ c:[1, 2, 2, -5], color:pen() });
    else if (st.phi > 0) { var pts = [P0]; for (var t = 0; t <= st.phi + 1e-9; t += PI / 60) pts.push(onPlane(t)); pts.push(onPlane(st.phi)); sc.polys.push({ pts:pts, color:pen() }); }
    if (st.k > 0) { var na = normalAt(P0, N, K * st.k, f4, st.k > 0.6 ? "n" : ""); sc.arrows.push(na.arrow); }
    if (st.phi > 0 && !st.full) {
      var tip = onPlane(st.phi); sc.arrows.push({ from:P0, vec:sub(tip, P0), color:css("--ink-2"), width:2.4 });
      sc.rights.push({ at:P0, u:unit(sub(tip, P0)), w:unit(N), k:0.45, color:ink }); sc.points.push({ p:tip, color:css("--ink-2"), label:"P" });
    } else if (st.full) sc.rights.push({ at:P0, u:bs[0], w:unit(N), k:0.45, color:ink });
    if (st.a > 0) sc.points.push({ p:P0, color:ink, label:"P₀(1, 1, 1)" });
    sc.describe = st.full ? "The plane x + 2y + 2z − 5 = 0 through P₀(1, 1, 1), with the normal n = (1, 2, 2) at right angles to it." :
      "The point P₀(1, 1, 1) with the normal n = (1, 2, 2); an arrow from P₀ stays at right angles to n and sweeps out the plane.";
    v.sc = sc; draw3(v);
    if (f.cap) f.cap.innerHTML = st.eq >= 7 ? E2 : st.eq > 0 ? E1.slice(0, st.eq).join(" ") : "A normal and a point fix a plane.";
  }
  v.p.render = draw;
  function fin(){ st = { a:1, k:1, phi:2 * PI, full:true, eq:7 }; draw(); }
  if (MV.reduceMotion) { fin(); return; }
  draw();
  var lin = function(t){ return t; };
  MV.wait(400, function(){ st.a = 1; draw();
    MV.tween({ dur:1000, step:function(t){ st.k = t; draw(); }, done:function(){ st.k = 1; draw();
      MV.wait(400, function(){ MV.tween({ dur:3600, ease:lin, step:function(t){ st.phi = 2 * PI * t; draw(); }, done:function(){ st.phi = 2 * PI; draw();
        MV.tween({ dur:1500, ease:lin, step:function(t){ st.eq = Math.max(1, Math.ceil(t * 6)); draw(); }, done:function(){ st.eq = 6; draw();
          MV.wait(1300, fin); } }); } }); }); } });
  });
}

// =====================================================================================================================
// ---------- Explore: Normal and plane (V1 3D view + V12 readouts; modes np / eq / two) ----------
var RNG = { n:[-4, 4], p:[-4, 4], q:[-5, 5], e:[-6, 6], a:[-6, 6], b:[-6, 6] };
function rng(key){ return key === "e3" ? [-20, 20] : RNG[key.charAt(0)]; }
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function arr(v, d){ return Array.isArray(v) && v.length === d.length && v.every(function(x){ return Number.isInteger(x); }) ? v : d.slice(); }
  if (["np", "eq", "two"].indexOf(S.mode) < 0) S.mode = "np";
  S.n = arr(S.n, [1, 2, 2]); S.p0 = arr(S.p0, [1, 1, 1]); S.q = arr(S.q, [3, 1, 0]);
  S.eq = arr(S.eq, [1, 2, 2, -5]); S.t1 = arr(S.t1, [1, 2, -2, -4]); S.t2 = arr(S.t2, [1, 1, 1, -3]); S.tidy = !!S.tidy;
  var busy = false, mask = false, showK = null, rot = null;
  var VEC = { n:"n", p:"p0", q:"q", e:"eq", a:"t1", b:"t2" };
  function getA(key){ return S[VEC[key.charAt(0)]]; }
  host.innerHTML = '<div class="cp-ex"><div class="cp-main" data-mv="graph"><p class="eq-cap cp-eq" id="cp-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="cp-v3" id="cp-v3"></div><div id="cp-tipw"></div></div>' +
    '<div class="cp-side"><p class="cp-h">' + T.modeL + '</p><span class="seg cp-modes" role="group" aria-label="' + T.modeL + '">' + ["np", "eq", "two"].map(function(k){
      return '<button type="button" data-mode="' + k + '" data-k="md' + k + '" aria-pressed="false">' + T.modes[k] + "</button>"; }).join("") + "</span>" +
    '<div id="cp-ctl"></div><dl class="read cp-read" id="cp-read" aria-live="polite"></dl></div></div>';
  var V = mount3($("#cp-v3", host), { id:"ex", B:5, aria:"3D view of the plane",
    busy:function(){ return busy; },
    tip:function(){ return S.mode === "np" ? { pos:add(S.p0, mul(S.n, 0.55)), n:S.n, k:0.55 } : null; },
    onTip:function(n){ if (n.join() === S.n.join()) return; S.n = n; changed(true); } });

  function plane1(){ var n = S.n; return [n[0], n[1], n[2], -dot(n, S.p0)]; }
  function shown(c){ return S.tidy && (c.filter(function(v){ return v; })[0] || 0) < 0 ? c.map(function(v){ return -v + 0; }) : c; }
  function cur(){ return S.mode === "np" ? plane1() : S.mode === "eq" ? S.eq : null; }

  function stepper(key, lab){
    var r = rng(key);
    return '<div class="cp-step"><label class="cp-sl" for="cp-' + key + '">' + m(lab) + '</label><span class="cp-sr">' +
      '<button type="button" class="btn ghost sm" data-st="' + key + '" data-dir="-1" data-k="st' + key + 'm" aria-label="Decrease ' + MV.esc(lab) + '">' + MINUS + "</button>" +
      '<input class="numin short" id="cp-' + key + '" data-tk="' + key + '" type="number" step="1" min="' + r[0] + '" max="' + r[1] + '" autocomplete="off">' +
      '<button type="button" class="btn ghost sm" data-st="' + key + '" data-dir="1" data-k="st' + key + 'p" aria-label="Increase ' + MV.esc(lab) + '">+</button></span></div>';
  }
  function coefRow(pre, label){
    function bx(i, nm){ var key = pre + i, r = rng(key); return '<input class="numin short cp-cb" data-tk="' + key + '" data-k="cb' + key + '" type="number" step="1" min="' + r[0] + '" max="' + r[1] + '" autocomplete="off" aria-label="' + MV.esc(label + ", " + nm) + '">'; }
    return '<div class="cp-row" role="group" aria-label="' + MV.esc(label) + '">' + bx(0, "A, coefficient of x") + m("x +") + bx(1, "B, coefficient of y") + m("y +") + bx(2, "C, coefficient of z") + m("z +") + bx(3, "D, the constant") + m("= 0") + "</div>";
  }
  function paintCtl(){
    var h = "", el = $("#cp-ctl", host);
    if (S.mode === "np") {
      h = '<p class="cp-h">' + MV.md(T.normalH) + '</p><div class="cp-grid">' + stepper("n0", "A") + stepper("n1", "B") + stepper("n2", "C") + "</div>" +
        '<p class="cp-h">' + MV.md(T.pointH) + '</p><div class="cp-grid">' + stepper("p0", "x_0") + stepper("p1", "y_0") + stepper("p2", "z_0") + "</div>" +
        '<p class="cp-h">' + MV.md(T.testH) + '</p><div class="cp-grid">' + stepper("q0", "x") + stepper("q1", "y") + stepper("q2", "z") + "</div>" +
        '<p class="tiny muted cp-rg">' + MV.md(T.ranges.np) + '</p><div class="q-actions"><button type="button" class="chip" data-act="tidy" data-k="cptidy" aria-pressed="' + S.tidy + '">' + T.tidy + '</button><span class="tiny muted">' + T.tidyNote + "</span></div>";
    } else if (S.mode === "eq") {
      h = '<p class="cp-h">' + MV.md(T.eqH) + "</p>" + coefRow("e", "Equation") + '<p class="tiny muted cp-rg">' + MV.md(T.ranges.eq) + "</p>";
    } else {
      h = '<p class="cp-h">' + T.p1H + "</p>" + coefRow("a", "Plane 1") + '<p class="cp-h">' + T.p2H + "</p>" + coefRow("b", "Plane 2") + '<p class="tiny muted cp-rg">' + MV.md(T.ranges.two) + "</p>";
    }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
    var tw = $("#cp-tipw", host);
    MV.keepFocus(tw, function(){ tw.innerHTML = S.mode === "np" ? '<p class="tiny cp-tipn"><button type="button" class="btn ghost sm" data-act="tip" data-k="cptip" aria-label="' + MV.esc(T.tipLabel) + '">' + T.tip + "</button> " + T.tipNote + "</p>" : ""; });
    $$("[data-mode]", host).forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.mode === S.mode)); });
    syncIn();
    if (busy) lock(true);
  }
  function syncIn(){
    $$("input[data-tk]", host).forEach(function(inp){
      if (inp === document.activeElement && inp.dataset.dirty) return;
      var k = inp.dataset.tk, a = getA(k); inp.value = String(a[+k.charAt(1)]).replace("-", "-"); inp.removeAttribute("aria-invalid");
    });
  }
  function paintRead(){
    var R = T.rows, rows = [], eq = $("#cp-eq", host), c;
    if (S.mode === "two") {
      var a = S.t1, b = S.t2;
      eq.innerHTML = "Π₁: " + m(eqSrc(a)) + " &nbsp; Π₂: " + m(eqSrc(b));
      rows.push([R.p1, zero3(a.slice(0, 3)) ? MV.md(T.notPlane) : m(eqSrc(a))], [R.p2, zero3(b.slice(0, 3)) ? MV.md(T.notPlane) : m(eqSrc(b))]);
      if (!zero3(a.slice(0, 3)) && !zero3(b.slice(0, 3))) {
        var rl = relation(a, b);
        rows.push([MV.md(R.dot), m(vSrc(a.slice(0, 3)) + " · " + vSrc(b.slice(0, 3)) + " = " + nT(rl.d))]);
        rows.push([R.rel, mask ? '<span class="muted">' + T.mask + "</span>" : rl.k === "same" ? T.same : rl.k === "par" ? T.par : rl.k === "perp" ? T.perp :
          T.meet + " " + angTxt(rl.angP) + (Math.abs(rl.angN - rl.angP) > 1e-6 ? " (" + T.normalsAt + " " + angTxt(rl.angN) + ")" : "")]);
      }
    } else {
      c = cur();
      var n = c.slice(0, 3);
      if (zero3(n)) { eq.innerHTML = MV.md(T.notPlane); rows.push([R.eq, MV.md(T.notPlane)]); }
      else {
        var sh = shown(c);
        eq.innerHTML = m(eqSrc(sh));
        rows.push([R.normal, m("vec{n} = " + vSrc(n))]);
        if (S.mode === "np") rows.push([R.point, m("P_0" + vSrc(S.p0))]);
        rows.push([R.eq, m(eqSrc(sh))]);
        if (S.mode === "np") rows.push([MV.md(R.d), m("D = -(" + [0, 1, 2].map(function(i){ var v = n[i] * S.p0[i]; return v < 0 ? "(" + nT(v) + ")" : nT(v); }).join(" + ") + ") = " + nT(c[3]))]);
        rows.push([R.icpt, icptHTML(c)], [R.special, specials(c)]);
        if (S.mode === "np") { var val = dot(n, S.q) + c[3]; rows.push([R.test, m("Q" + vSrc(S.q)) + ": value " + m(nT(val)) + " → " + (val === 0 ? T.onP : val > 0 ? T.plusSide : T.minusSide)]); }
      }
    }
    $("#cp-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function draw(){
    var sc = { planes:[], arrows:[], rights:[], points:[], segs:[], lines:[] }, f4 = css("--f4"), ink = css("--ink"), pen = css("--pen"), f3 = css("--f3"), desc;
    if (S.mode === "two") {
      var a = S.t1, b = S.t2, okA = !zero3(a.slice(0, 3)), okB = !zero3(b.slice(0, 3));
      if (okA) sc.planes.push({ c:a, color:pen }); if (okB) sc.planes.push({ c:b, color:f3 });
      if (okA && okB) {
        var ml = meetLine(a, b), rl = relation(a, b);
        if (ml) {
          sc.lines.push({ p:ml.p, d:ml.d, color:ink, width:2.8 });
          sc.arrows.push({ from:ml.p, vec:mul(unit(a.slice(0, 3)), 2.4), color:f4, width:3, label:"n₁" }, { from:ml.p, vec:mul(unit(b.slice(0, 3)), 2.4), color:f4, width:3, label:"n₂" });
          if (rl.k === "perp" && !mask) sc.rights.push({ at:ml.p, u:unit(a.slice(0, 3)), w:unit(b.slice(0, 3)), k:0.55, color:ink });
        } else {
          sc.arrows.push({ from:nearest(a), vec:mul(unit(a.slice(0, 3)), 2.4), color:f4, width:3, label:"n₁" }, { from:nearest(b), vec:mul(unit(b.slice(0, 3)), 2.4), color:f4, width:3, label:"n₂" });
        }
        desc = "Plane 1 " + eqPlain(a) + " in blue and plane 2 " + eqPlain(b) + " in teal, with both normals" + (ml ? " and their line of intersection." : "; the planes don’t meet in a line.") + (mask ? "" : " " + (rl.k === "perp" ? "They are perpendicular." : rl.k === "par" ? "They are parallel." : rl.k === "same" ? "They are the same plane." : "They meet at " + angTxt(rl.angP) + "."));
      } else desc = "Two planes mode: a plane needs A, B and C not all 0.";
    } else {
      var c = cur(), n = c.slice(0, 3);
      if (zero3(n)) desc = "No plane: A, B and C are all 0.";
      else {
        sc.planes.push({ c:c, color:pen });
        if (S.mode === "np") {
          var k = 0.55 * (showK || 1), base = S.p0, na = normalAt(base, showK ? mul(n, 1) : n, k, f4, "n");
          sc.arrows.push(na.arrow); sc.rights.push(na.right);
          sc.points.push({ p:base, color:ink, label:"P₀" }, { p:S.q, color:css("--ink-2"), label:"Q" });
          if (!busy) sc.points.push({ p:add(base, mul(n, k)), color:f4, ring:true });
        } else {
          var nb = nearest(c), na2 = normalAt(nb, unit(n), 2.4, f4, "n"); sc.arrows.push(na2.arrow); sc.rights.push(na2.right);
          if (!c.every(Number.isInteger)) { V.set({ planes:sc.planes, arrows:sc.arrows, rights:sc.rights, describe:"The plane is turning as its coefficients change." }); return; }
          var ic = [0, 1, 2].map(function(i){ if (!c[i]) return null; var p = [0, 0, 0]; p[i] = -c[3] / c[i]; return p; });
          ic.forEach(function(p, i){ if (p && Math.abs(p[i]) <= 5.6 && c[3]) sc.points.push({ p:p, color:ink, label:AXN[i] + " = " + MV.plain(m(fracSrc(-c[3], c[i]))) }); });
          if (c[3] && ic.every(function(p){ return p; })) sc.segs.push({ a:ic[0], b:ic[1], color:ink, width:2 }, { a:ic[1], b:ic[2], color:ink, width:2 }, { a:ic[2], b:ic[0], color:ink, width:2 });
        }
        desc = "Plane " + eqPlain(c) + " with normal " + MV.plain(m(vSrc(n))) + ". Intercepts: " + MV.plain(icptHTML(c)) + "." + (boxPoly(c, 5) ? "" : " " + T.off);
      }
    }
    sc.describe = desc;
    V.set(sc);
  }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }
  function changed(syncAll){ api.save(); if (syncAll) syncIn(); paintRead(); draw(); MV.changed(); }
  paintCtl(); paintRead(); draw();

  function setKey(key, val){
    var a = getA(key), i = +key.charAt(1), old = a[i]; a[i] = val;
    if (key.charAt(0) === "n" && zero3(a)) { a[i] = old; return false; }
    return true;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b) || b.dataset.vw) return;
    if (b.dataset.mode) { S.mode = b.dataset.mode; api.save(); paintCtl(); paintRead(); draw(); MV.changed(); return; }
    if (b.dataset.st) {
      var key = b.dataset.st, r = rng(key), a = getA(key), i = +key.charAt(1), nv = clamp(a[i] + +b.dataset.dir, r[0], r[1]);
      if (!setKey(key, nv)) setKey(key, clamp(nv + +b.dataset.dir, r[0], r[1]));
      changed(true); return;
    }
    if (b.dataset.act === "tidy") { S.tidy = !S.tidy; b.setAttribute("aria-pressed", String(S.tidy)); changed(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target, key = t.dataset && t.dataset.tk; if (!key || busy) return;
    var s = String(t.value).trim(), v = Number(s), r = rng(key);
    t.dataset.dirty = "1";
    if (s === "" || !Number.isInteger(v) || v < r[0] || v > r[1] || !setKey(key, v)) { t.setAttribute("aria-invalid", "true"); return; }
    t.removeAttribute("aria-invalid"); changed();
  });
  host.addEventListener("change", function(e){ var t = e.target; if (t.dataset && t.dataset.tk) { delete t.dataset.dirty; syncIn(); } });
  host.addEventListener("focusout", function(e){ var t = e.target; if (t.dataset && t.dataset.tk) { delete t.dataset.dirty; syncIn(); } });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest('[data-act="tip"]'); if (!b || busy) return;
    var map = { ArrowLeft:[0, -1], ArrowRight:[0, 1], ArrowDown:[1, -1], ArrowUp:[1, 1], PageDown:[2, -1], PageUp:[2, 1] }, mv = map[e.key];
    if (!mv) return;
    e.preventDefault();
    var n = S.n.slice(); n[mv[0]] = clamp(n[mv[0]] + mv[1], -4, 4);
    if (!zero3(n)) { S.n = n; changed(true); }
  });

  // ---- challenges (plan's exact tests and named wrong states) ----
  function chal(id){
    var M = MS[id];
    if (id === "tc1" || id === "tc2") {
      var c = S.eq;
      if (id === "tc1") {
        if (isMult(c, [3, 1, -2, -8])) return { ok:true };
        if (S.mode !== "eq") return { ok:false, msg:M.mode };
        if (isMult(c, [3, 1, -2, 8])) return { ok:false, msg:M.sign };
        if (isMult(c, [2, 0, -1, -8])) return { ok:false, msg:M.swap };
        if (isMult(c, [3, 1, -2, 0])) return { ok:false, msg:M.origin };
        return { ok:false, msg:M.general };
      }
      if (isMult(c, [3, 2, 1, -6])) return { ok:true };
      if (S.mode !== "eq") return { ok:false, msg:M.mode };
      if (isMult(c, [2, 3, 6, -1])) return { ok:false, msg:M.coef };
      if (isMult(c, [1, 1, 1, -6])) return { ok:false, msg:M.onlyZ };
      if (isMult(c, [3, 2, 1, 6])) return { ok:false, msg:M.sign };
      return { ok:false, msg:M.general };
    }
    var p = S.t2;
    if (S.mode !== "two") return { ok:false, msg:M.mode };
    if (!isMult(S.t1, [1, 2, -2, -4])) return { ok:false, msg:M.p1 };
    if (isMult(p, [2, -1, 0, -1])) return { ok:true };
    if (isMult(p.slice(0, 3), [1, 2, -2])) return { ok:false, msg:M.par };
    if (isMult(p, [1, 2, 0, -3])) return { ok:false, msg:M.noPerp };
    if (isMult(p, [0, 1, 1, -2])) return { ok:false, msg:M.meetsZ };
    if (isMult(p, [2, -1, 0, 1])) return { ok:false, msg:M.point };
    return { ok:false, msg:M.general };
  }

  // ---- predictions ----
  function tweenEq(from, to, dur, done){
    rot = MV.tween({ dur:dur, step:function(t){
      S.eq = from.map(function(v, i){ return v + (to[i] - v) * t; }); draw(); }, done:function(){ rot = null; S.eq = to.slice(); done(); } });
  }
  return {
    predict:{
      start:function(p){
        if (rot) { rot(); rot = null; }
        busy = true; mask = false; showK = null;
        if (p.id === "p1") { S.mode = "np"; S.n = [1, 2, 2]; S.p0 = [1, 1, 1]; }
        else if (p.id === "p2") { S.mode = "eq"; S.eq = [1, 1, 1, -3]; }
        else if (p.id === "p3") { S.mode = "eq"; S.eq = [1, 1, 1, -4]; }
        else { S.mode = "two"; S.t1 = [1, 1, 1, -1]; S.t2 = [1, -1, 0, 0]; mask = true; }
        V.preset("iso");
        paintCtl(); paintRead(); draw(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; mask = false; showK = null; lock(false); api.save(); paintCtl(); paintRead(); draw(); MV.changed(); done(); }
        if (p.id === "p1") {
          rot = MV.tween({ dur:1800, step:function(t){ showK = 1 + t; draw(); }, done:function(){ rot = null; showK = null; S.n = [2, 4, 4]; paintRead(); draw(); MV.wait(1200, fin); } });
        } else if (p.id === "p2") tweenEq([1, 1, 1, -3], [0, 0, 1, -3], 2200, function(){ paintRead(); draw(); MV.wait(1200, fin); });
        else if (p.id === "p3") tweenEq([1, 1, 1, -4], [1, 0, 1, -4], 2200, function(){ V.preset("top"); MV.wait(900, function(){ V.preset("iso"); paintRead(); MV.wait(900, fin); }); });
        else {
          var a0 = V.az;
          rot = MV.tween({ dur:1800, step:function(t){ V.az = a0 + 0.6 * t; draw(); }, done:function(){ rot = null; mask = false; paintRead(); draw(); MV.wait(1300, fin); } });
        }
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Converting between forms (three stations, each with its own V1 view) ----------
function part3(host, api){
  var S = api.S, C = api.content, L = C.labels, P1 = C.st1, P2 = C.st2, P3 = C.st3;
  if (typeof S.s1 !== "number") S.s1 = 0;
  S.s2 = S.s2 || {}; S.s3 = S.s3 || {}; S.s3.sel = Array.isArray(S.s3.sel) ? S.s3.sel : []; S.s3.done = S.s3.done || {};
  var pick = null, fb3 = null;
  host.innerHTML =
    '<div class="part cp-st" id="cp-s1"><h3>' + P1.title + "</h3><p>" + MV.md(P1.text) + '</p><div class="sym cp-stg"><div class="cp-v3" id="cp-v31"></div><div><ol class="cp-steps" id="cp-s1l"></ol></div></div></div>' +
    '<div class="part cp-st" id="cp-s2"><h3>' + P2.title + "</h3><p>" + MV.md(P2.text) + '</p><div class="sym cp-stg"><div class="cp-v3" id="cp-v32"></div><div id="cp-s2c"></div></div>' +
      '<details class="alg"><summary>' + L.working + '</summary><div class="alg-lines">' + P2.alg.map(function(l){ return "<div>" + MV.md(l) + "</div>"; }).join("") + "</div></details></div>" +
    '<div class="part cp-st" id="cp-s3"><h3>' + P3.title + "</h3><p>" + MV.md(P3.text) + '</p><div class="sym cp-stg"><div class="cp-v3" id="cp-v33"></div><div id="cp-s3c"></div></div></div>';
  var V1 = mount3($("#cp-v31", host), { id:"s1", B:5.5, aria:P1.fig }), V2 = mount3($("#cp-v32", host), { id:"s2", B:5, aria:P2.fig }), V3 = mount3($("#cp-v33", host), { id:"s3", B:5, aria:P3.fig });

  // ---- Station 1 ----
  function paint1(){
    var ol = $("#cp-s1l", host);
    MV.keepFocus(ol, function(){ ol.innerHTML = P1.steps.map(function(s, i){
      var on = i < S.s1;
      return '<li class="cp-sti' + (on ? " on" : "") + '"><button type="button" class="btn ' + (i === S.s1 ? "primary" : "ghost") + ' sm" data-s1="' + i + '" data-k="s1b' + i + '"' + (i <= S.s1 ? "" : " disabled") + ' aria-expanded="' + on + '">' + MV.md(s.b) + "</button>" +
        (on ? '<div class="cp-rv">' + MV.md(s.r) + "</div>" : "") + "</li>"; }).join(""); });
    var P = [1, 0, 2], a = [1, 1, 0], b = [0, 1, 3], n = [3, -3, 1], ink = css("--ink"), sc = { planes:[{ c:[3, -3, 1, -5], color:css("--pen"), alpha:0.1 }],
      arrows:[{ from:P, vec:a, color:css("--pen"), width:3, label:"a" }, { from:P, vec:b, color:css("--f3"), width:3, label:"b" }], rights:[], points:[{ p:P, color:ink, label:"(1, 0, 2)" }] };
    if (S.s1 >= 1) { sc.arrows.push({ from:P, vec:mul(n, 0.5), color:css("--f4"), width:3.2, label:"n" }); sc.rights.push({ at:P, u:unit(a), w:unit(n), color:ink }, { at:P, u:unit(b), w:unit(n), color:ink }); }
    if (S.s1 >= 4) sc.points.push({ p:[2, 2, 5], color:ink, label:"(2, 2, 5) ✓" });
    sc.describe = "The plane through (1, 0, 2) with directions (1, 1, 0) and (0, 1, 3)" + (S.s1 >= 1 ? ", and the normal (3, −3, 1) at right angles to both" : "") + (S.s1 >= 3 ? ". Equation 3x − 3y + z − 5 = 0." : ".");
    V1.set(sc);
  }
  // ---- Station 2 ----
  function paint2(){
    var c = $("#cp-s2c", host), h = "", s = S.s2;
    [["a", P2.methA], ["b", P2.methB]].forEach(function(z){
      h += '<div class="cp-meth"><button type="button" class="btn ' + (s[z[0]] ? "ghost" : "primary") + ' sm" data-s2="' + z[0] + '" data-k="s2' + z[0] + '" aria-expanded="' + !!s[z[0]] + '">' + z[1].b + "</button>" + (s[z[0]] ? '<div class="cp-rv">' + MV.md(z[1].r) + "</div>" : "") + "</div>";
    });
    h += '<div class="cp-meth"><button type="button" class="btn ghost sm" data-s2="trap" data-k="s2trap" aria-pressed="' + !!s.trap + '">' + P2.trap.b + "</button>" + (s.trap ? MV.fbHTML("bad", "<strong>✗</strong> " + MV.md(P2.trap.msg)) : "") + "</div>";
    MV.keepFocus(c, function(){ c.innerHTML = h; });
    var Q = [0, 0, 4], N = [2, -1, 1], ink = css("--ink"), sc = { planes:[{ c:[2, -1, 1, -4], color:css("--pen") }], arrows:[{ from:Q, vec:mul(N, 0.8), color:css("--f4"), width:3.2, label:"n" }], segs:[], points:[], rights:[] };
    if (s.a) sc.arrows.push({ from:Q, vec:[1, 0, -2], color:css("--pen"), width:3 }, { from:Q, vec:[0, 1, 1], color:css("--f3"), width:3 });
    if (s.b) { var I = [[2, 0, 0], [0, -4, 0], [0, 0, 4]]; I.forEach(function(p){ sc.points.push({ p:p, color:ink, label:MV.plain(m(vSrc(p))) }); }); sc.segs.push({ a:I[0], b:I[1], color:ink }, { a:I[1], b:I[2], color:ink }, { a:I[2], b:I[0], color:ink }); }
    if (s.trap) sc.planes.push({ c:[2, 5, 1, -4], color:css("--f5"), dash:[6, 5] });
    sc.points.push({ p:Q, color:ink, label:s.b ? "" : "(0, 0, 4)" });
    sc.describe = "The plane 2x − y + z = 4 with its normal (2, −1, 1)" + (s.a ? ", directions (1, 0, −2) and (0, 1, 1) from (0, 0, 4)" : "") + (s.b ? ", the intercepts (2, 0, 0), (0, −4, 0), (0, 0, 4)" : "") +
      (s.trap ? ", and in orange the wrong plane made by using the normal as a direction, at right angles to the real one." : ".");
    V2.set(sc);
  }
  // ---- Station 3 ----
  var PL = P3.planes;
  function pairKey(){ var a = S.s3.sel; return a.length === 2 ? Math.min(a[0], a[1]) + "-" + Math.max(a[0], a[1]) : null; }
  function paint3(){
    var c = $("#cp-s3c", host), sel = S.s3.sel, key = pairKey(), h = "", R = P3.rows, done = Object.keys(S.s3.done).length;
    h += '<div class="chips cp-pls" role="group" aria-label="Planes">' + PL.map(function(p, i){
      var on = sel.indexOf(i) >= 0; return '<button type="button" class="chip" data-pl="' + i + '" data-k="pl' + i + '" aria-pressed="' + on + '">' + p.name + ": " + MV.md(p.eq) + "</button>"; }).join("") + "</div>";
    if (!key) h += '<p class="tiny muted">' + (sel.length ? P3.pickOne : P3.pick) + "</p>";
    else {
      var a = PL[sel[0]].c, b = PL[sel[1]].c, rl = relation(a, b), solved = S.s3.done[key];
      if (!solved) {
        h += '<div class="chips cp-rels" role="group" aria-label="Relationship">' + ["par", "perp", "nei"].map(function(k){
          return '<button type="button" class="chip" data-rel="' + k + '" data-k="rel' + k + '" aria-pressed="' + (pick === k) + '">' + P3.rels[k] + "</button>"; }).join("") + "</div>";
        if (pick === "nei") h += '<p class="tiny cp-angh">' + P3.angH + '</p><div class="chips" role="group" aria-label="Angle">' + P3.angles.map(function(g){
          return '<button type="button" class="chip" data-ang="' + g + '" data-k="ang' + g + '">' + g + "°</button>"; }).join("") + "</div>";
        if (fb3) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + MV.md(fb3) + " Try again.");
      } else {
        h += MV.fbHTML("good", MV.md(rl.k === "par" ? P3.msgs.par : rl.k === "perp" ? P3.msgs.perp : P3.msgs.nei + " " + angTxt(rl.angP) + "."));
        var rows = [[R.n1, m(vSrc(a.slice(0, 3)))], [R.n2, m(vSrc(b.slice(0, 3)))], [MV.md(R.dot), m(nT(rl.d))]];
        if (rl.k !== "par") rows.push([R.angN, angTxt(rl.angN)], [R.angP, angTxt(rl.angP)]);
        h += '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
      }
    }
    h += '<p class="tiny cp-tally">' + P3.tally + " " + done + "/6</p>";
    MV.keepFocus(c, function(){ c.innerHTML = h; });
    var sc = { planes:[], arrows:[], lines:[], rights:[] }, f4 = css("--f4"), ink = css("--ink");
    if (sel[0] != null) sc.planes.push({ c:PL[sel[0]].c, color:css("--pen") });
    if (sel[1] != null) sc.planes.push({ c:PL[sel[1]].c, color:css("--f3") });
    if (key) {
      var A = PL[sel[0]].c, Bc = PL[sel[1]].c, ml = meetLine(A, Bc);
      if (ml) { sc.lines.push({ p:ml.p, d:ml.d, color:ink }); sc.arrows.push({ from:ml.p, vec:mul(unit(A.slice(0, 3)), 2.2), color:f4, label:"n₁" }, { from:ml.p, vec:mul(unit(Bc.slice(0, 3)), 2.2), color:f4, label:"n₂" }); }
      else sc.arrows.push({ from:nearest(A), vec:mul(unit(A.slice(0, 3)), 2.2), color:f4, label:"n₁" }, { from:nearest(Bc), vec:mul(unit(Bc.slice(0, 3)), 2.2), color:f4, label:"n₂" });
    }
    sc.describe = sel.length ? "Chosen planes: " + sel.map(function(i){ return PL[i].name + " " + MV.plain(MV.md(PL[i].eq)); }).join(" and ") + ", with their normals." : "No planes chosen yet.";
    V3.set(sc);
  }
  function judge3(choice, ang){
    var key = pairKey(), a = PL[S.s3.sel[0]].c, b = PL[S.s3.sel[1]].c, rl = relation(a, b), M = P3.msgs;
    fb3 = null;
    if (choice === "par") { if (rl.k === "par") S.s3.done[key] = true; else fb3 = M.notPar; }
    else if (choice === "perp") { if (rl.k === "perp") S.s3.done[key] = true; else fb3 = rl.k === "par" ? M.isPar : M.notPerp; }
    else { if (rl.k === "par") fb3 = M.isPar; else if (rl.k === "perp") fb3 = M.isPerp; else if (Math.abs(ang - rl.angP) < 1e-6) S.s3.done[key] = true; else fb3 = M.ang; }
    pick = null; api.save(); paint3(); MV.focusFb($("#cp-s3", host));
  }
  paint1(); paint2(); paint3();
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.dataset.vw) return;
    var d = b.dataset;
    if (d.s1 != null) { var i = +d.s1; if (i === S.s1) { S.s1 = Math.min(4, S.s1 + 1); api.save(); paint1(); } return; }
    if (d.s2) { S.s2[d.s2] = d.s2 === "trap" ? !S.s2.trap : true; api.save(); paint2(); return; }
    if (d.pl != null) {
      var k = +d.pl, sel = S.s3.sel, at = sel.indexOf(k);
      if (at >= 0) sel.splice(at, 1); else { if (sel.length >= 2) sel.shift(); sel.push(k); }
      pick = null; fb3 = null; api.save(); paint3(); return;
    }
    if (d.rel) { if (d.rel === "nei") { pick = "nei"; fb3 = null; paint3(); } else judge3(d.rel); return; }
    if (d.ang) judge3("nei", +d.ang);
  });
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Build the equation (V12 coefficient boxes; any non-zero multiple; first-try scoring) ----------
function coefBoxes(pre, vals, dis, label){
  function bx(i, nm){ return '<input class="numin short cp-cb" data-bx="' + pre + i + '" data-k="bx' + pre + i + '" type="number" step="1" autocomplete="off" aria-label="' + MV.esc(label + ", " + nm) + '" value="' + MV.esc(vals[i] == null ? "" : vals[i]) + '"' + (dis ? " disabled" : "") + ">"; }
  return '<div class="cp-row" role="group" aria-label="' + MV.esc(label) + '">' + bx(0, "A, coefficient of x") + m("x +") + bx(1, "B, coefficient of y") + m("y +") + bx(2, "C, coefficient of z") + m("z +") + bx(3, "D, the constant") + m("= 0") + "</div>";
}
function readInts(vals, n){
  var out = [];
  for (var i = 0; i < n; i++) { var s = String(vals[i] == null ? "" : vals[i]).trim().replace(/−/g, "-"); if (s === "" || !/^[-+]?\d+$/.test(s)) return null; out.push(parseInt(s, 10)); }
  return out;
}
function buildAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + MV.md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q cp-bq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="cp-bin"></div><div class="cp-bcl"></div></div>';
  }).join("");
  function paintIn(it){ var x = ist(it.id), el = $('[data-q="' + it.id + '"] .cp-bin', host); MV.keepFocus(el, function(){ el.innerHTML = coefBoxes(it.id + "_", x.v, x.solved, "Item " + it.id.slice(1) + " equation"); }); }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .cp-bcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints.map(MV.md), x.hint) : "");
    if (x.solved) { var ans = readInts(x.v, 4) || MV.ans(it); h += MV.fbHTML("good", "<strong>✓ Correct: " + m(eqSrc(ans)) + ".</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>')); }
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", MV.md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), c = readInts(x.v, 4);
    if (!c) return { err:TX.fill };
    if (zero3(c.slice(0, 3))) return { err:TX.zero };
    if (isMult(c, MV.ans(it))) return { ok:true };
    var W = it.wrong || [];
    for (var i = 0; i < W.length; i++) { var w = W[i]; if ((w.c && isMult(c, w.c)) || (w.n && isMult(c.slice(0, 3), w.n))) return { msg:w.fb }; }
    return { msg:it.general || TX.general };
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
// ---------- Performance task: Plane to order ----------
var task = (function(){
  var api, V, TR = [[-6, 6], [-6, 6], [-6, 6], [-20, 20]], P = [1, 2, 3], G = [1, -1, 1, -5];
  function read(){
    var c = [0, 1, 2, 3].map(function(i){ var s = String(api && api.S["c" + i] != null ? api.S["c" + i] : "").trim().replace(/−/g, "-"), v = Number(s); return s !== "" && Number.isInteger(v) && v >= TR[i][0] && v <= TR[i][1] ? v : null; });
    var ok = c.every(function(v){ return v !== null; }) && !zero3(c.slice(0, 3));
    return { c:c, valid:ok };
  }
  function checks(D){
    if (!D.valid) return [false, false, false, false];
    var c = D.c;
    return [c[0] + 2 * c[1] + 3 * c[2] + c[3] === 0, c[0] - c[1] + c[2] === 0, !!(c[0] && c[1] && c[2]), c[2] !== 0 && -c[3] / c[2] > 0];
  }
  function preview(){
    var D = read(), L = api.content.labels, rd = $("#pt-read"), ink = css("--ink"), sc = { planes:[{ c:G, color:css("--f3") }], points:[{ p:P, color:ink, label:"P(1, 2, 3)" }] };
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + MV.md(L.invalid) + "</p>";
      sc.describe = "The given plane x − y + z = 5 in teal and the point P(1, 2, 3). Choose A, B, C and D to draw your plane.";
      V.set(sc); return;
    }
    var c = D.c, atP = dot(c.slice(0, 3), P) + c[3], dn = c[0] - c[1] + c[2];
    sc.planes.push({ c:c, color:css("--pen") });
    var zi = c[2] ? -c[3] / c[2] : null;
    if (zi !== null && Math.abs(zi) <= 6.5) sc.points.push({ p:[0, 0, zi], color:css("--f4"), label:"z = " + MV.plain(m(fracSrc(-c[3], c[2]))) });
    var rows = [[L.eq, m(eqSrc(c))], [MV.md(L.atP), m(c[0] + " + 2(" + nT(c[1]) + ") + 3(" + nT(c[2]) + ") + (" + nT(c[3]) + ") = " + nT(atP))],
      [MV.md(L.dotRow), m(nT(c[0]) + " - (" + nT(c[1]) + ") + (" + nT(c[2]) + ") = " + nT(dn))],
      [MV.md(L.zRow), zi === null ? MV.md(L.none) : m("z = " + fracSrc(-c[3], c[2]))]];
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
    sc.describe = "Your plane " + eqPlain(c) + " in blue, the given plane x − y + z = 5 in teal and P(1, 2, 3)." + (zi === null ? " Your plane has no z-intercept." : " Your z-intercept is " + MV.plain(m(fracSrc(-c[3], c[2]))) + ".");
    V.set(sc);
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (a.S.c0 == null) { a.S.c0 = "1"; a.S.c1 = "1"; a.S.c2 = "1"; a.S.c3 = "-6"; }
      var nm = ["A, coefficient of x (−6 to 6)", "B, coefficient of y (−6 to 6)", "C, coefficient of z (−6 to 6)", "D, the constant (−20 to 20)"];
      function bx(i){ return '<input class="numin short cp-cb" id="pt-c' + i + '" data-tk="c' + i + '" data-k="ptc' + i + '" type="number" step="1" min="' + TR[i][0] + '" max="' + TR[i][1] + '" autocomplete="off" aria-label="' + MV.esc(nm[i]) + '" value="' + MV.esc(String(a.S["c" + i])) + '">'; }
      inp.innerHTML = '<div class="cp-ptin"><p class="tiny" style="font-weight:700;margin:0">' + m("Ax + By + Cz + D = 0") + '</p><div class="cp-row">' + bx(0) + m("x +") + bx(1) + m("y +") + bx(2) + m("z +") + bx(3) + m("= 0") + "</div></div>";
      pv.innerHTML = '<div id="pt-read" aria-live="polite"></div><p class="tiny cp-pgh">' + MV.md(L.graph) + '</p><div class="cp-v3" id="pt-v3"></div>';
      V = mount3($("#pt-v3", pv), { id:"pt", B:6, aria:L.graph });
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); preview(); a.update(); });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : MV.md(api.content.labels.invalid); },
    checks:checks,
    key:function(D){ return norm4(D.c).join("|"); },
    label:function(k){ return m(eqSrc(k.split("|").map(Number))); },
    text:function(k){ return eqPlain(k.split("|").map(Number)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ build:buildAct },
  task:task
});

})();
