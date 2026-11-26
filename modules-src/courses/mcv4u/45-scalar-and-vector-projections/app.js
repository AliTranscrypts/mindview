// MCV4U 45 Scalar and Vector Projections: hero (a⃗ casts a shadow on b⃗’s line, then swings to 120° and the shadow goes
// negative), Shadow caster (Explore: V3 R² board with draggable tips or polar input, V1 R³ view with turn/tilt, light rays,
// the shadow band, the dashed perpendicular part, stretch k, Swap and an exact readout), Projections at work (Part 3: crate,
// train and point-to-line stations on V3 boards), Projection set (Practice 1, V8 component boxes) and the
// "Push back along the track" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, num = MV.num, MINUS = MV.MINUS;
var Q = MV.mcv.Q, SS = MV.mcv.S;
function m(s){ return MV.m(s); }
function md(s){ return MV.md(s); }
function esc(s){ return MV.esc(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function mn(s){ return String(s).replace(/-/g, MINUS); }
function near(a, b, t){ return Math.abs(a - b) <= (t || 1e-9) * Math.max(1, Math.abs(b)); }
function okInts(v, n, lo, hi){ return Array.isArray(v) && v.length === n && v.every(function(x){ return Number.isInteger(x) && x >= lo && x <= hi; }) ? v.slice() : null; }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + md(o.t) + "</button>"; }).join("") + "</span>";
}

// =====================================================================================================================
// @component exactVec — exact vector arithmetic for projections. Components are surd sums (MV.mcv.S), so grid vectors,
// the halves from the k stretch and polar components (cos 15° = (√6 + √2)/4 …) all stay exact.
// ev([numbers]) -> vector; edot(u, v) -> S; eproj(P, L) -> {d, LL, PP, mag, scal, proj, perp, chk, cos, sign, zeroL, zeroP};
// ss(S) / vs(vector) -> inline m() source ("9√5/5", "(18/5, −9/5)"); rootS(Q) -> √Q as S.
function sOf(x){ return SS.of([[Q.of(x)]]); }
function ev(arr){ return arr.map(sOf); }
function rootS(q){ return q && q.n ? SS.of([[Q.of(1, q.d), q.n * q.d]]) : []; }
function edot(a, b){ var s = []; for (var i = 0; i < a.length; i++) s = SS.add(s, SS.mul(a[i], b[i])); return s; }
var ONE = { n:1, d:1 };
function eproj(P, L){
  var d = edot(P, L), LL = SS.ratQ(edot(L, L)), PP = SS.ratQ(edot(P, P));
  var o = { d:d, LL:LL, PP:PP, zeroL:!LL.n, zeroP:!PP.n, sign:SS.zero(d) ? 0 : SS.val(d) > 0 ? 1 : -1 };
  if (o.zeroL) return o;
  var f = SS.scale(d, Q.div(ONE, LL));
  o.mag = rootS(LL); o.scal = SS.mul(f, o.mag);
  o.proj = L.map(function(c){ return SS.mul(c, f); });
  o.perp = P.map(function(c, i){ return SS.sub(c, o.proj[i]); });
  o.chk = edot(o.perp, L);
  if (!o.zeroP) { var PL = Q.mul(PP, LL); o.cos = SS.mul(SS.scale(d, Q.div(ONE, PL)), rootS(PL)); }
  return o;
}
function ss(A){
  if (!A || !A.length) return "0";
  return A.map(function(t, i){
    var a = Q.abs(t.c), neg = t.c.n < 0, body;
    if (t.k === 1) body = a.d === 1 ? String(a.n) : a.n + "/" + a.d;
    else body = (a.n === 1 ? "" : a.n) + "√" + t.r + (a.d === 1 ? "" : "/" + a.d);
    return (i === 0 ? (neg ? "-" : "") : (neg ? " - " : " + ")) + body;
  }).join("");
}
function ssP(A){ var s = ss(A); return (A.length > 1 || s.charAt(0) === "-") ? "(" + s + ")" : s; }
function vs(v){ return "(" + v.map(ss).join(", ") + ")"; }
function qs(q){ return q.d === 1 ? String(q.n) : (q.n < 0 ? "-" : "") + Math.abs(q.n) + "/" + q.d; }
function plainS(A){ return mn(ss(A)); }
function plainV(v){ return "(" + v.map(plainS).join(", ") + ")"; }
// exact cos and sin at multiples of 15° (0° to 180°)
var COS = { 0:[[1]], 15:[[Q.of(1, 4), 6], [Q.of(1, 4), 2]], 30:[[Q.of(1, 2), 3]], 45:[[Q.of(1, 2), 2]], 60:[[Q.of(1, 2)]], 75:[[Q.of(1, 4), 6], [Q.of(-1, 4), 2]], 90:[] };
function cosS(t){ t = ((t % 360) + 360) % 360; if (t > 180) t = 360 - t; var neg = t > 90, A = SS.of(COS[neg ? 180 - t : t]); return neg ? SS.neg(A) : A; }
function sinS(t){ return cosS(90 - t); }
// ------------------------------------------------------ end of exactVec ---------------------------------------------------

// =====================================================================================================================
// ---------- SVG drawing helpers (screen units: 1 user unit = 1 px of the viewBox; y down) ----------
function f1(v){ return String(Math.round(v * 10) / 10); }
function ln(x1, y1, x2, y2, cls){ return '<line class="' + cls + '" x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '"/>'; }
function arrow(x1, y1, x2, y2, cls, head){
  head = head || 13; var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 0.5) return "";
  var ux = dx / L, uy = dy / L, h = Math.min(head, L * 0.6), bx = x2 - ux * h, by = y2 - uy * h, w = h * 0.48;
  return '<g class="' + cls + '">' + ln(x1, y1, bx + ux, by + uy, "pj-shaft") + '<polygon class="pj-head" points="' + f1(x2) + "," + f1(y2) + " " + f1(bx - uy * w) + "," + f1(by + ux * w) + " " + f1(bx + uy * w) + "," + f1(by - ux * w) + '"/></g>';
}
function txt(x, y, s, cls, anchor){ return '<text class="' + (cls || "pj-t") + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '" dominant-baseline="central">' + esc(s) + "</text>"; }
function bgTxt(x, y, s, cls){
  var w = String(s).length * 7.2 + 12;
  return '<rect class="pj-pill" x="' + f1(x - w / 2) + '" y="' + f1(y - 11) + '" width="' + f1(w) + '" height="22" rx="6"/>' + txt(x, y, s, cls || "pj-t");
}
function dot(x, y, r, cls){ return '<circle class="' + (cls || "pj-pt") + '" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (r || 4) + '"/>'; }
function plane(U){ return { U:U, X:function(x){ return x * U; }, Y:function(y){ return -y * U; } }; }
function viewBox(svg, V, U){ svg.setAttribute("viewBox", f1(V.xmin * U) + " " + f1(-V.ymax * U) + " " + f1((V.xmax - V.xmin) * U) + " " + f1((V.ymax - V.ymin) * U)); }
function gridSVG(B, V, step){
  var h = "", i, x0 = Math.ceil(V.xmin), x1 = Math.floor(V.xmax), y0 = Math.ceil(V.ymin), y1 = Math.floor(V.ymax);
  for (i = x0; i <= x1; i++) if (i) h += ln(B.X(i), B.Y(V.ymin), B.X(i), B.Y(V.ymax), "pj-grid");
  for (i = y0; i <= y1; i++) if (i) h += ln(B.X(V.xmin), B.Y(i), B.X(V.xmax), B.Y(i), "pj-grid");
  h += ln(B.X(V.xmin), 0, B.X(V.xmax), 0, "pj-axis") + ln(0, B.Y(V.ymin), 0, B.Y(V.ymax), "pj-axis");
  for (i = x0; i <= x1; i++) if (i && i % step === 0) h += txt(B.X(i), 12, mn(i), "pj-tick");
  for (i = y0; i <= y1; i++) if (i && i % step === 0) h += txt(-6, B.Y(i), mn(i), "pj-tick", "end");
  return h;
}
function kTxt(k){ return k === 1 ? "" : k === -1 ? MINUS : mn(k); }
function signedTxt(exact, val){
  if (Math.abs(val) < 1e-9) return "0: no shadow";
  var s = exact ? plainS(exact) : null;
  if (!s || s.length > 9) s = num(val, 2);
  if (val > 0 && s.charAt(0) !== "+") s = "+" + s;
  return s;
}

// =====================================================================================================================
// @component V3 shadowLayer — for numeric P (the projected vector) and L (the line vector) on a 2-D board: the dashed line of
// L, dotted light rays falling perpendicular to it from P’s side, the shadow (a --hi band under a thin --ink arrow, scaled by
// o.grow for reveals) and the dashed perpendicular part with a right-angle mark at the foot. Returns {svg, ok, u, n, pr, pp, f}.
function shadowLayer(B, P, L, o){
  var LL = L[0] * L[0] + L[1] * L[1]; if (LL < 1e-12) return { svg:"", ok:false };
  var h = "", Ln = Math.sqrt(LL), u = [L[0] / Ln, L[1] / Ln], f = (P[0] * L[0] + P[1] * L[1]) / LL, pr = [L[0] * f, L[1] * f], pp = [P[0] - pr[0], P[1] - pr[1]];
  var n0 = [-u[1], u[0]], side = (pp[0] * n0[0] + pp[1] * n0[1]) < 0 ? -1 : 1, n = [n0[0] * side, n0[1] * side];
  var g = o.grow == null ? 1 : o.grow, X = B.X, Y = B.Y, ext = o.ext || 30, s;
  if (o.line) h += ln(X(-ext * u[0]), Y(-ext * u[1]), X(ext * u[0]), Y(ext * u[1]), "pj-line");
  if (o.rays) for (s = -ext; s <= ext; s += (o.raySp || 1.5)) h += ln(X(s * u[0] + o.rayLen * n[0]), Y(s * u[1] + o.rayLen * n[1]), X(s * u[0] + 0.12 * n[0]), Y(s * u[1] + 0.12 * n[1]), "pj-ray");
  var plen = Math.hypot(pr[0], pr[1]), tip = [pr[0] * g, pr[1] * g];
  if (plen * g > 0.02) h += ln(0, 0, X(tip[0]), Y(tip[1]), "pj-band") + arrow(0, 0, X(tip[0]), Y(tip[1]), "pj-vP", 11);
  var perpLen = Math.hypot(pp[0], pp[1]);
  if (o.perp && g >= 0.999 && perpLen > 0.02) {
    h += ln(X(pr[0]), Y(pr[1]), X(P[0]), Y(P[1]), "pj-perp");
    if (perpLen > 0.6) {
      var q = 0.42, w = f > 0 ? -q : q, a1 = [pr[0] + u[0] * w, pr[1] + u[1] * w], a2 = [a1[0] + n[0] * q, a1[1] + n[1] * q], a3 = [pr[0] + n[0] * q, pr[1] + n[1] * q];
      h += '<polyline class="pj-ra" points="' + [a1, a2, a3].map(function(p){ return f1(X(p[0])) + "," + f1(Y(p[1])); }).join(" ") + '"/>';
    }
  }
  return { svg:h, ok:true, u:u, n:n, pr:pr, pp:pp, f:f };
}
function vlab(B, v, s, cls, off){ var L = Math.hypot(v[0], v[1]) || 1, d = off || 0.8; return txt(B.X(v[0] + v[0] / L * d), B.Y(v[1] + v[1] / L * d), s, cls); }

// =====================================================================================================================
// @component V3 vectorBoard — an SVG integer-grid board with draggable vector tips (G7 pattern): pointer drag snaps to whole
// numbers, Tab reaches each tip (role slider, aria-valuetext "(x, y)"), arrow keys move it by 1. o = {U, view, handles:[{id,
// cls, name, get(), set(x, y), on(), lo, hi}], scene(B) -> svg, busy(), moved(id)}. Returns B with X/Y and render().
function vboard(svg, o){
  var U = o.U, V = o.view, B = plane(U), HS = o.handles || [], drag = null;
  viewBox(svg, V, U);
  svg.innerHTML = '<g class="vb-scene"></g><g class="vb-hs">' + HS.map(function(h){
    return '<circle class="vb-h ' + h.cls + '" r="11" tabindex="0" role="slider" data-h="' + h.id + '" aria-valuemin="' + h.lo + '" aria-valuemax="' + h.hi + '"></circle>'; }).join("") + "</g>";
  var scene = svg.querySelector(".vb-scene");
  function H(id){ return HS.filter(function(h){ return h.id === id; })[0]; }
  function isOn(h){ return !h.on || h.on(); }
  B.render = function(){
    scene.innerHTML = o.scene(B);
    HS.forEach(function(h){
      var el = svg.querySelector('[data-h="' + h.id + '"]'), p = h.get(), on = isOn(h);
      el.setAttribute("cx", f1(p[0] * U)); el.setAttribute("cy", f1(-p[1] * U));
      el.style.display = on ? "" : "none";
      if (on) el.setAttribute("tabindex", "0"); else el.removeAttribute("tabindex");
      el.setAttribute("aria-label", h.name + ". Arrow keys move it by 1.");
      el.setAttribute("aria-valuenow", p[0]); el.setAttribute("aria-valuetext", "(" + mn(p[0]) + ", " + mn(p[1]) + ")");
    });
  };
  function pt(e){ var c = svg.getScreenCTM(); if (!c) return null; var P = svg.createSVGPoint(); P.x = e.clientX; P.y = e.clientY; P = P.matrixTransform(c.inverse()); return [P.x / U, -P.y / U]; }
  function put(h, x, y){ x = clamp(Math.round(x), h.lo, h.hi); y = clamp(Math.round(y), h.lo, h.hi); var p = h.get(); if (p[0] === x && p[1] === y) return; h.set(x, y); o.moved(h.id); }
  svg.addEventListener("pointerdown", function(e){
    if (o.busy && o.busy()) return;
    var q = pt(e); if (!q) return;
    var id = e.target.dataset && e.target.dataset.h, best = null, bd = 1.3;
    if (!id) HS.forEach(function(h){ if (!isOn(h)) return; var p = h.get(), d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < bd) { bd = d; best = h.id; } });
    id = id || best; if (!id || !isOn(H(id))) return;
    drag = id; e.preventDefault();
    try { svg.setPointerCapture(e.pointerId); } catch (err) {}
    var el = svg.querySelector('[data-h="' + id + '"]'); if (el && el.focus) el.focus({ preventScroll:true });
    put(H(id), q[0], q[1]);
  });
  svg.addEventListener("pointermove", function(e){ if (!drag) return; var q = pt(e); if (q) put(H(drag), q[0], q[1]); });
  function end(){ drag = null; }
  svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
  svg.addEventListener("keydown", function(e){
    var id = e.target.dataset && e.target.dataset.h; if (!id || (o.busy && o.busy())) return;
    var d = { ArrowLeft:[-1, 0], ArrowRight:[1, 0], ArrowUp:[0, 1], ArrowDown:[0, -1] }[e.key]; if (!d) return;
    e.preventDefault(); var h = H(id), p = h.get(); put(h, p[0] + d[0], p[1] + d[1]);
  });
  return B;
}
// ---------------------------------------------------- end of V3 vectorBoard ------------------------------------------------

// =====================================================================================================================
// ---------- hero: a⃗ (blue) at 60° casts a shadow on b⃗’s line (teal); then swings to 120° and the shadow goes negative ----------
function hero(f){
  var host = $("#pj-hero"); if (!host) return;
  var U = 30, R = 4;
  function pic(th, g, perpOn, lab){
    var t = th * Math.PI / 180, ax = R * Math.cos(t) * U, ay = -R * Math.sin(t) * U, fx = ax * g, h = "", x;
    for (x = -100; x <= 214; x += 18) h += ln(x, -142, x, -5, "pj-ray");
    h += ln(-110, 0, 220, 0, "pj-line");
    if (Math.abs(fx) > 0.5) h += ln(0, 0, fx, 0, "pj-band") + arrow(0, 0, fx, 0, "pj-vP", 10);
    h += arrow(0, 0, 150, 0, "pj-vB");
    if (perpOn) {
      h += ln(ax, 0, ax, ay, "pj-perp");
      var w = ax > 0 ? -10 : 10; h += '<polyline class="pj-ra" points="' + f1(ax + w) + ",0 " + f1(ax + w) + ",-10 " + f1(ax) + ',-10"/>';
    }
    h += arrow(0, 0, ax, ay, "pj-vA") + dot(0, 0, 3.5);
    h += txt(ax + Math.cos(t) * 16, ay - Math.sin(t) * 16, "a⃗", "pj-tv pj-ta") + txt(164, -14, "b⃗", "pj-tv pj-tb");
    if (lab) h += bgTxt(fx / 2, 20, lab, "pj-ts");
    return '<svg class="pj-hsvg" viewBox="-110 -150 330 185" aria-hidden="true" focusable="false">' + h + "</svg>";
  }
  function cap(s){ if (f.cap) f.cap.innerHTML = s; }
  if (MV.reduceMotion) {
    host.innerHTML = '<div class="pj-hst"><div>' + pic(60, 1, true, "+2") + '<p class="tiny">θ = 60°: shadow +2</p></div><div>' + pic(120, 1, true, MINUS + "2: negative") + '<p class="tiny">θ = 120°: shadow ' + MINUS + "2</p></div></div>";
    cap("An acute angle casts a shadow along " + m("vec{b}") + " (left); an obtuse angle casts it backward, a negative scalar projection (right).");
    return;
  }
  var st = { th:60, g:0, perp:false, lab:null };
  function draw(){ host.innerHTML = pic(st.th, st.g, st.perp, st.lab); }
  draw(); cap("Light falls straight down onto the line of " + m("vec{b}") + ".");
  MV.wait(700, function(){
    MV.tween({ dur:1400, step:function(t){ st.g = t; draw(); }, done:function(){
      st.g = 1; st.perp = true; st.lab = "+2"; draw();
      cap("The shadow of " + m("vec{a}") + " has signed length " + m("4 cos 60° = 2") + ": the scalar projection.");
      MV.wait(1600, function(){
        st.lab = null;
        MV.tween({ dur:2400, step:function(t){ st.th = 60 + 60 * t; draw(); }, done:function(){
          st.th = 120; st.lab = MINUS + "2: negative"; draw();
          cap("At 120° the shadow falls behind the tail: " + m("4 cos 120° = -2") + ", a negative scalar projection.");
        } });
      });
    } });
  });
}

// =====================================================================================================================
// ---------- Explore: Shadow caster ----------
// @component V1 view3d — oblique R³ view with Turn (yaw) and Tilt (pitch) controls: x toward the viewer (lower left), y to the
// right, z up at the defaults; p3(p) -> screen point; seg3/arrow3 draw projected segments and arrows.
var U2 = 20, U3 = 19, VIEW = { xmin:-11.2, xmax:11.2, ymin:-11.2, ymax:11.2 }, YAW0 = -120, PITCH0 = 20;
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["r2", "r3"].indexOf(S.space) < 0) S.space = "r2";
  if (["drag", "polar"].indexOf(S.mode) < 0) S.mode = "drag";
  S.a2 = okInts(S.a2, 2, -8, 8) || [4, 3]; S.b2 = okInts(S.b2, 2, -8, 8) || [5, 0];
  S.a3 = okInts(S.a3, 3, -6, 6) || [2, 4, 3]; S.b3 = okInts(S.b3, 3, -6, 6) || [3, 0, 1];
  var pol = S.pol || {};
  S.pol = { ma:Number.isInteger(pol.ma) && pol.ma >= 1 && pol.ma <= 10 ? pol.ma : 5, mb:Number.isInteger(pol.mb) && pol.mb >= 1 && pol.mb <= 10 ? pol.mb : 5,
    th:Number.isInteger(pol.th) && pol.th >= 0 && pol.th <= 180 && pol.th % 15 === 0 ? pol.th : 60 };
  if (typeof S.k !== "number" || !S.k || Math.abs(S.k * 2 - Math.round(S.k * 2)) > 1e-9 || Math.abs(S.k) > 3) S.k = 1;
  S.swap = !!S.swap;
  var sh0 = S.show || {}; S.show = { rays:sh0.rays !== false, perp:sh0.perp !== false, line:sh0.line !== false };
  var vw = S.view || {}; S.view = { yaw:Number.isInteger(vw.yaw) && Math.abs(vw.yaw) <= 180 ? vw.yaw : YAW0, pitch:Number.isInteger(vw.pitch) && vw.pitch >= 0 && vw.pitch <= 60 ? vw.pitch : PITCH0 };
  if (["tc1", "tc2", "tc3"].indexOf(S.lock) < 0) S.lock = null;
  S.tc3seen = !!S.tc3seen; S.all = !!S.all;
  var busy = false, anim = false, grow = 1, note = null, stop = null;

  function slider(id, label, min, max, step, col){
    return '<label class="slider pj-sl"><span class="slider-top"><span>' + md(label) + '</span><output id="pj-' + id + 'o"></output></span>' +
      '<input type="range" id="pj-' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:var(' + col + ')"></label>';
  }
  function compRow(v, label){
    return '<div class="pj-comp"><span class="tiny pj-h">' + md(label) + '</span><div class="pj-cr">' + [0, 1, 2].map(function(i){
      var nm = v + " component " + (i + 1);
      return '<span class="pj-cs"><button type="button" class="btn ghost sm" data-cs="' + v + i + '" data-dir="-1" data-k="cs' + v + i + 'm" aria-label="Decrease ' + nm + '">' + MINUS + "</button>" +
        '<input class="numin short" type="number" min="-6" max="6" step="1" data-ci="' + v + i + '" aria-label="Vector ' + nm + '">' +
        '<button type="button" class="btn ghost sm" data-cs="' + v + i + '" data-dir="1" data-k="cs' + v + i + 'p" aria-label="Increase ' + nm + '">+</button></span>';
    }).join("") + "</div></div>";
  }
  host.innerHTML = '<div class="pj-ex"><div class="pj-main">' +
    '<div class="pj-top"><div class="pj-ctl" id="pj-space"></div><div class="pj-ctl" id="pj-mode"></div>' +
    '<button type="button" class="btn ghost sm pj-swap" data-act="swap" data-k="pjswap" aria-pressed="false">' + md(T.swap) + "</button></div>" +
    '<div class="pj-ctl pj-setup"><span class="tiny pj-h">' + T.setup + '</span><span class="chips" id="pj-setup" role="group" aria-label="' + esc(T.setup) + '"></span></div>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<svg class="pj-svg" id="pj-svg" role="group" focusable="false"></svg>' +
    '<p class="tiny muted pj-key">' + md(T.key) + '</p><p class="tiny pj-note" id="pj-note"></p></div>' +
    '<div class="pj-side">' +
    '<div id="pj-pol" class="pj-box">' + slider("ma", T.ma, 1, 10, 1, "--pen") + slider("mb", T.mb, 1, 10, 1, "--f3") + slider("th", T.th, 0, 180, 15, "--ink") + "</div>" +
    '<div id="pj-3d" class="pj-box">' + compRow("a", T.a3) + compRow("b", T.b3) + slider("yaw", T.turn, -180, 180, 5, "--ink") + slider("pitch", T.tilt, 0, 60, 5, "--ink") +
    '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="rv" data-k="pjrv">' + T.resetView + "</button></div></div>" +
    slider("k", T.stretch, -3, 3, 0.5, "--acol") + '<p class="tiny muted pj-kn">' + md(T.stretchNote) + "</p>" +
    '<fieldset class="pj-show"><legend class="tiny">' + T.show + "</legend>" + ["rays", "perp", "line"].map(function(k){
      return '<label class="pj-cb"><input type="checkbox" data-show="' + k + '"> ' + md(T[k]) + "</label>"; }).join("") + "</fieldset>" +
    '<dl class="read pj-read" id="pj-read" aria-live="polite"></dl><div class="q-actions pj-morew"><button type="button" class="btn ghost sm pj-more" data-act="more" data-k="pjmore"></button></div>' +
    "</div></div>";
  var svg = $("#pj-svg", host);
  function dragOn(){ return S.space === "r2" && S.mode === "drag"; }
  var B = vboard(svg, { U:U2, view:VIEW,
    handles:[
      { id:"a", cls:"hA", name:"Tip of vector a", get:function(){ return S.a2; }, set:function(x, y){ S.a2 = [x, y]; }, on:function(){ return dragOn() && !S.lock; }, lo:-8, hi:8 },
      { id:"b", cls:"hB", name:"Tip of vector b", get:function(){ return S.b2; }, set:function(x, y){ S.b2 = [x, y]; }, on:dragOn, lo:-8, hi:8 }],
    scene:function(B){ return S.space === "r3" ? scene3() : scene2(B); },
    busy:function(){ return busy; }, moved:function(){ note = null; changed(); } });

  // ---- model ----
  function vecs(){
    var a, b;
    if (S.space === "r3") { a = ev(S.a3); b = ev(S.b3); }
    else if (S.mode === "polar") { a = [SS.scale(cosS(S.pol.th), Q.of(S.pol.ma)), SS.scale(sinS(S.pol.th), Q.of(S.pol.ma))]; b = [sOf(S.pol.mb), []]; }
    else { a = ev(S.a2); b = ev(S.b2); }
    var kq = Q.of(S.k), kb = b.map(function(c){ return SS.scale(c, kq); });
    return { a:a, b:b, kb:kb, P:S.swap ? kb : a, L:S.swap ? a : kb };
  }
  function numVecs(){
    var a, b;
    if (S.space === "r3") { a = S.a3.slice(); b = S.b3.slice(); }
    else if (S.mode === "polar") { var t = S.pol.th * Math.PI / 180; a = [S.pol.ma * Math.cos(t), S.pol.ma * Math.sin(t)]; b = [S.pol.mb, 0]; }
    else { a = S.a2.slice(); b = S.b2.slice(); }
    var kb = b.map(function(c){ return c * S.k; });
    return { a:a, b:b, kb:kb, P:S.swap ? kb : a, L:S.swap ? a : kb };
  }
  function exact(){ return anim ? null : eproj(vecs().P, vecs().L); }
  function perpHidden(){ return S.lock === "tc3" && !S.tc3seen && S.space === "r3"; }

  // ---- R² scene ----
  function scene2(B){
    var N = numVecs(), h = gridSVG(B, VIEW, 4);
    var sh = shadowLayer(B, N.P, N.L, { line:S.show.line, rays:S.show.rays, perp:S.show.perp, grow:grow, rayLen:16, ext:32, raySp:1.5 });
    h += sh.svg;
    if (S.k !== 1) h += arrow(0, 0, B.X(N.b[0]), B.Y(N.b[1]), "pj-vK", 10);
    h += arrow(0, 0, B.X(N.kb[0]), B.Y(N.kb[1]), "pj-vB") + arrow(0, 0, B.X(N.a[0]), B.Y(N.a[1]), "pj-vA") + dot(0, 0, 3.5);
    h += vlab(B, N.a, "a⃗", "pj-tv pj-ta") + vlab(B, N.kb, kTxt(S.k) + "b⃗", "pj-tv pj-tb");
    if (sh.ok && grow >= 0.999) {
      var E = exact(), LL = N.L[0] * N.L[0] + N.L[1] * N.L[1], sc = (N.P[0] * N.L[0] + N.P[1] * N.L[1]) / Math.sqrt(LL);
      h += bgTxt(B.X(sh.pr[0] / 2 - sh.n[0] * 1.15), B.Y(sh.pr[1] / 2 - sh.n[1] * 1.15), signedTxt(E && E.scal, sc), "pj-ts");
    }
    if (note) h += bgTxt(B.X(note.x), B.Y(note.y), note.text, "pj-tn");
    return h;
  }
  // ---- R³ scene (V1 view3d) ----
  function p3(p){
    var yw = S.view.yaw * Math.PI / 180, pt = S.view.pitch * Math.PI / 180, x1 = p[0] * Math.cos(yw) - p[1] * Math.sin(yw), y1 = p[0] * Math.sin(yw) + p[1] * Math.cos(yw);
    return [x1 * U3, -(p[2] * Math.cos(pt) + y1 * Math.sin(pt)) * U3];
  }
  function seg3(a, b, cls){ var A = p3(a), Bp = p3(b); return ln(A[0], A[1], Bp[0], Bp[1], cls); }
  function arrow3(a, b, cls, hd){ var A = p3(a), Bp = p3(b); return arrow(A[0], A[1], Bp[0], Bp[1], cls, hd); }
  function lab3(v, s, cls){ var L = Math.hypot(v[0], v[1], v[2]) || 1, q = p3([v[0] * (1 + 0.8 / L), v[1] * (1 + 0.8 / L), v[2] * (1 + 0.8 / L)]); return txt(q[0], q[1], s, cls); }
  function add3(u, v, k){ return [u[0] + v[0] * k, u[1] + v[1] * k, u[2] + v[2] * k]; }
  function scene3(){
    var N = numVecs(), h = "", i, A = 7, O = [0, 0, 0];
    for (i = -6; i <= 6; i += 2) h += seg3([i, -6, 0], [i, 6, 0], "pj-grid") + seg3([-6, i, 0], [6, i, 0], "pj-grid");
    h += seg3([-A, 0, 0], [A, 0, 0], "pj-axis") + seg3([0, -A, 0], [0, A, 0], "pj-axis") + seg3([0, 0, -A], [0, 0, A], "pj-axis");
    [["x", [A + 0.7, 0, 0]], ["y", [0, A + 0.7, 0]], ["z", [0, 0, A + 0.7]]].forEach(function(t){ var q = p3(t[1]); h += txt(q[0], q[1], t[0], "pj-tax"); });
    var P = N.P, L = N.L, LL = L[0] * L[0] + L[1] * L[1] + L[2] * L[2];
    if (LL > 1e-12) {
      var Ln = Math.sqrt(LL), u = [L[0] / Ln, L[1] / Ln, L[2] / Ln], fq = (P[0] * L[0] + P[1] * L[1] + P[2] * L[2]) / LL, pr = [L[0] * fq, L[1] * fq, L[2] * fq];
      var pp = [P[0] - pr[0], P[1] - pr[1], P[2] - pr[2]], pl = Math.hypot(pp[0], pp[1], pp[2]), n = pl > 1e-9 ? [pp[0] / pl, pp[1] / pl, pp[2] / pl] : null, s;
      if (S.show.line) h += seg3(add3(O, u, -14), add3(O, u, 14), "pj-line");
      if (S.show.rays && n) for (s = -12; s <= 12; s += 1.5) h += seg3(add3(add3(O, u, s), n, 7), add3(add3(O, u, s), n, 0.12), "pj-ray");
      var tip = [pr[0] * grow, pr[1] * grow, pr[2] * grow];
      if (Math.hypot(tip[0], tip[1], tip[2]) > 0.02) h += seg3(O, tip, "pj-band") + arrow3(O, tip, "pj-vP", 11);
      if (S.show.perp && n && grow >= 0.999) {
        h += seg3(pr, P, "pj-perp");
        if (pl > 0.6) { var q = 0.45, w = fq > 0 ? -q : q, a1 = add3(pr, u, w), a2 = add3(a1, n, q), a3 = add3(pr, n, q);
          h += '<polyline class="pj-ra" points="' + [a1, a2, a3].map(function(p){ var r = p3(p); return f1(r[0]) + "," + f1(r[1]); }).join(" ") + '"/>'; }
      }
      if (grow >= 0.999) {
        var E = exact(), sc = (P[0] * L[0] + P[1] * L[1] + P[2] * L[2]) / Ln, side = n ? n : [0, 0, 1], mid = p3(add3([pr[0] / 2, pr[1] / 2, pr[2] / 2], side, -1.1));
        h += bgTxt(mid[0], mid[1], signedTxt(E && E.scal, sc), "pj-ts");
      }
    }
    if (S.k !== 1) h += arrow3(O, N.b, "pj-vK", 10);
    h += arrow3(O, N.kb, "pj-vB") + arrow3(O, N.a, "pj-vA");
    var o = p3(O); h += dot(o[0], o[1], 3.5);
    h += lab3(N.a, "a⃗", "pj-tv pj-ta") + lab3(N.kb, kTxt(S.k) + "b⃗", "pj-tv pj-tb");
    return h;
  }
  function describe(){
    if (anim) return "Shadow caster board: the shadow is moving.";
    var E = vecs(), o = eproj(E.P, E.L), nP = S.swap ? "b" : "a", nL = S.swap ? "a" : "b";
    var s = "Shadow caster board in " + (S.space === "r3" ? "R3" : "R2") + ". a = " + plainV(E.a) + ", b = " + plainV(E.kb);
    if (o.zeroL) return s + ". The line vector is the zero vector, so there is no shadow.";
    return s + "; projecting " + nP + " on " + nL + ": scalar projection " + plainS(o.scal) + "; vector projection " + plainV(o.proj) + "; perpendicular part " + (perpHidden() ? "hidden" : plainV(o.perp)) + ".";
  }
  function draw(){ B.render(); svg.setAttribute("aria-label", describe()); }

  // ---- readout ----
  function readRows(){
    var E = vecs(), o = eproj(E.P, E.L), R = T.rows, nP = S.swap ? "vec{b}" : "vec{a}", nL = S.swap ? "vec{a}" : "vec{b}", rows = [];
    var polar = S.space === "r2" && S.mode === "polar";
    var v1 = (polar ? m("|vec{a}| = " + S.pol.ma) + ", " + m("|vec{b}| = " + S.pol.mb) + ", θ = " + S.pol.th + "°<br>" : "") +
      m("vec{a} = " + vs(E.a)) + "<br>" + m("vec{b} = " + (S.k !== 1 ? "@a{" + S.k + "}" + vs(E.b) + " = " + vs(E.kb) : vs(E.b)));
    rows.push([m("vec{a}") + ", " + m("vec{b}"), v1, true]);
    rows.push([m(nP + " · " + nL), m(ss(o.d)), true]);
    rows.push([m("|" + nL + "|"), m(ss(rootS(o.LL))), true]);
    if (o.zeroL) { rows.push([R.scal, md(S.swap ? T.noLineA : T.noLine)]); return rows; }
    var sc = m("{" + ss(o.d) + "}/{" + ss(o.mag) + "} = " + ss(o.scal));
    if (!o.zeroP) sc += "<br>" + m("|" + nP + "| cos θ = " + ss(rootS(o.PP)) + " × " + ssP(o.cos));
    rows.push([R.scal + " of " + m(nP) + " on " + m(nL), sc]);
    rows.push([R.vec + " " + m("proj_{" + nL + "} " + nP), m("({" + ss(o.d) + "}/{" + qs(o.LL) + "})" + vs(E.L) + " = " + vs(o.proj))]);
    rows.push([R.perp + " " + m(nP + " - proj"), perpHidden() ? T.hidden : m(vs(o.perp))]);
    rows.push([R.check, m("(" + nP + " - proj) · " + nL + " = " + ss(o.chk)) + " ✓", true]);
    rows.push([R.dir, o.zeroP ? T.none + " " + m(nP + " = vec{0}") : o.sign > 0 ? T.along + " " + m(nL) : o.sign < 0 ? T.opposite + " " + m(nL) : T.none + " " + m(nP + " ⊥ " + nL), true]);
    return rows;
  }
  function paintRead(){
    var el = $("#pj-read", host); el.classList.toggle("all", S.all);
    el.innerHTML = readRows().map(function(r){ return "<div" + (r[2] ? ' class="pj-x"' : "") + "><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    $('[data-act="more"]', host).textContent = S.all ? T.showFew : T.showAll;
  }

  // ---- controls ----
  function setSl(id, v, out){ var s = $("#pj-" + id, host); if (document.activeElement !== s || busy) s.value = v; $("#pj-" + id + "o", host).textContent = out; s.setAttribute("aria-valuetext", out); }
  function syncK(){ setSl("k", S.k, "k = " + (Math.abs(S.k - Math.round(S.k)) < 1e-9 ? mn(Math.round(S.k)) : mn(num(S.k, 2)))); }
  function syncPol(){ setSl("ma", S.pol.ma, String(S.pol.ma)); setSl("mb", S.pol.mb, String(S.pol.mb)); setSl("th", Math.round(S.pol.th), Math.round(S.pol.th) + "°"); }
  function paintTop(){
    MV.keepFocus($("#pj-space", host), function(){ $("#pj-space", host).innerHTML = '<span class="tiny pj-h">' + T.space + "</span>" + segBtns("sp", [{ id:"r2", t:"R²" }, { id:"r3", t:"R³" }], S.space, T.space); });
    var mo = $("#pj-mode", host); mo.hidden = S.space !== "r2";
    MV.keepFocus(mo, function(){ mo.innerHTML = '<span class="tiny pj-h">' + T.input + "</span>" + segBtns("md", [{ id:"drag", t:T.drag }, { id:"polar", t:T.polar }], S.mode, T.input); });
    $('[data-act="swap"]', host).setAttribute("aria-pressed", String(S.swap));
    MV.keepFocus($("#pj-setup", host), function(){
      $("#pj-setup", host).innerHTML = [["tc1", T.c1], ["tc2", T.c2], ["tc3", T.c3], ["free", T.free]].map(function(c){
        var on = c[0] === "free" ? !S.lock : S.lock === c[0];
        return '<button type="button" class="chip' + (on ? " on" : "") + '" data-setup="' + c[0] + '" data-k="su' + c[0] + '" aria-pressed="' + on + '">' + c[1] + "</button>"; }).join("");
    });
  }
  function paintSide(){
    $("#pj-pol", host).hidden = !(S.space === "r2" && S.mode === "polar");
    $("#pj-3d", host).hidden = S.space !== "r3";
    syncPol(); syncK();
    setSl("yaw", S.view.yaw, S.view.yaw + "°"); setSl("pitch", S.view.pitch, S.view.pitch + "°");
    ["a", "b"].forEach(function(v){
      var arr = v === "a" ? S.a3 : S.b3, lockA = v === "a" && S.lock === "tc3";
      [0, 1, 2].forEach(function(i){
        var inp = $('[data-ci="' + v + i + '"]', host); if (document.activeElement !== inp) inp.value = arr[i];
        if (!busy) { inp.disabled = lockA; $$('[data-cs="' + v + i + '"]', host).forEach(function(b){ b.disabled = lockA || (b.dataset.dir === "1" ? arr[i] >= 6 : arr[i] <= -6); }); }
      });
    });
    $$("[data-show]", host).forEach(function(c){ c.checked = !!S.show[c.dataset.show]; });
    $("#pj-note", host).innerHTML = S.lock && S.lock !== "tc3" ? md(T.locked) : S.lock === "tc3" ? md(T.locked) : dragOn() ? md(T.dragNote) : "";
  }
  function paintAll(){ paintTop(); paintSide(); paintRead(); draw(); }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }
  function setup(id){
    S.swap = false; S.k = 1;
    if (id === "free") { S.lock = null; return; }
    S.lock = id;
    if (id === "tc3") { S.space = "r3"; S.a3 = [3, 1, 2]; S.b3 = [1, 0, 0]; S.tc3seen = false; }
    else { S.space = "r2"; S.mode = "drag"; S.a2 = id === "tc1" ? [6, 2] : [5, -1]; S.b2 = id === "tc1" ? [2, 5] : [3, 1]; }
    MV.banner("", "");
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b)) return;
    note = null;
    if (b.dataset.sp) { if (S.space !== b.dataset.sp) { S.space = b.dataset.sp; S.lock = null; } changed(); return; }
    if (b.dataset.md) { if (S.mode !== b.dataset.md) { S.mode = b.dataset.md; S.lock = null; } changed(); return; }
    if (b.dataset.setup) { setup(b.dataset.setup); changed(); return; }
    if (b.dataset.cs) {
      var v = b.dataset.cs.charAt(0), i = +b.dataset.cs.charAt(1), arr = v === "a" ? S.a3 : S.b3;
      if (v === "a" && S.lock === "tc3") return;
      arr[i] = clamp(arr[i] + +b.dataset.dir, -6, 6); changed(); return;
    }
    var a = b.dataset.act;
    if (a === "swap") { S.swap = !S.swap; changed(); return; }
    if (a === "rv") { S.view = { yaw:YAW0, pitch:PITCH0 }; changed(); return; }
    if (a === "more") { S.all = !S.all; api.save(); paintRead(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (busy || !t) return;
    note = null;
    if (t.id === "pj-k") { var kv = +t.value; if (kv === 0) { kv = S.k > 0 ? -0.5 : 0.5; t.value = kv; } S.k = kv; changed(); return; }
    if (t.id === "pj-ma" || t.id === "pj-mb") { S.pol[t.id.slice(3)] = clamp(Math.round(+t.value), 1, 10); changed(); return; }
    if (t.id === "pj-th") { S.pol.th = clamp(Math.round(+t.value / 15) * 15, 0, 180); changed(); return; }
    if (t.id === "pj-yaw") { S.view.yaw = clamp(Math.round(+t.value), -180, 180); changed(); return; }
    if (t.id === "pj-pitch") { S.view.pitch = clamp(Math.round(+t.value), 0, 60); changed(); return; }
    if (t.dataset && t.dataset.ci) {
      var n = Number(String(t.value).replace(/−/g, "-")), v = t.dataset.ci.charAt(0), i = +t.dataset.ci.charAt(1);
      if (v === "a" && S.lock === "tc3") return;
      if (Number.isInteger(n) && n >= -6 && n <= 6) { (v === "a" ? S.a3 : S.b3)[i] = n; changed(); }
      return;
    }
    if (t.dataset && t.dataset.show) { S.show[t.dataset.show] = t.checked; changed(); }
  });
  paintAll();

  // ---- challenges (plan’s exact tests and named wrong states) ----
  function same(u, v){ return u.length === v.length && u.every(function(x, i){ return x === v[i]; }); }
  function par(u, v){
    if (u.length === 2) return Math.abs(u[0] * v[1] - u[1] * v[0]) < 1e-9;
    return Math.abs(u[1] * v[2] - u[2] * v[1]) < 1e-9 && Math.abs(u[2] * v[0] - u[0] * v[2]) < 1e-9 && Math.abs(u[0] * v[1] - u[1] * v[0]) < 1e-9;
  }
  function chal(id, opt){
    var M = MS[id], live = opt && opt.live;
    if (id === "tc3") {
      if (S.space !== "r3" || !same(S.a3, [3, 1, 2])) return { ok:false, msg:M.setup };
      if (!live && !S.tc3seen) { S.tc3seen = true; api.save(); paintRead(); draw(); }
      if (S.swap) return { ok:false, msg:M.swap };
      var b = S.b3.map(function(c){ return c * S.k; });
      if (b.every(function(c){ return c === 0; })) return { ok:false, msg:M.zero };
      if (par(b, [1, 1, 1])) return { ok:true };
      if (par(b, [1, -1, 0])) return { ok:false, msg:M.roles };
      if (par(b, [3, 1, 2])) return { ok:false, msg:M.self };
      return { ok:false, msg:M.general.replace("{v}", m(vs(eproj(ev([3, 1, 2]), ev(b)).perp))) };
    }
    var A = id === "tc1" ? [6, 2] : [5, -1];
    if (S.space !== "r2" || S.mode !== "drag" || !same(S.a2, A)) return { ok:false, msg:M.setup };
    if (S.swap) return { ok:false, msg:M.swap };
    var b2 = S.b2.map(function(c){ return c * S.k; });
    if (!b2[0] && !b2[1]) return { ok:false, msg:M.zero };
    var o = eproj(ev(A), ev(b2)), d = A[0] * b2[0] + A[1] * b2[1], bb = b2[0] * b2[0] + b2[1] * b2[1];
    if (id === "tc1") {
      if (d > 0 && Math.abs(d * d - 36 * bb) < 1e-9) { if (!live) MV.banner("", MV.plain(M.more)); return { ok:true }; }
      if (b2[1] === 0 && b2[0] < 0) return { ok:false, msg:M.back };
      if (b2[0] === 0 && b2[1] > 0) return { ok:false, msg:M.yaxis };
      if (par(b2, A) && d > 0) return { ok:false, msg:M.self };
      return { ok:false, msg:M.general.replace("{v}", m(ss(o.scal))) };
    }
    if (b2[0] === b2[1]) return { ok:true };
    if (b2[0] === -b2[1]) return { ok:false, msg:M.cross };
    if (par(b2, A)) return { ok:false, msg:M.self };
    return { ok:false, msg:M.general.replace("{v}", m(vs(o.proj))) };
  }

  // ---- predictions ----
  function tw(dur, step, fin){ stop = MV.tween({ dur:dur, ease:function(t){ return t; }, step:step, done:function(){ stop = null; fin(); } }); }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; anim = false; note = null; grow = 1;
        S.lock = null; S.swap = false; S.k = 1; S.space = "r2";
        if (p.id === "p3") { S.mode = "polar"; S.pol = { ma:6, mb:5, th:60 }; }
        else { S.mode = "drag"; S.a2 = [4, 3]; S.b2 = p.id === "p4" ? [8, 0] : [5, 0]; }
        if (p.id === "p1") grow = 0;
        MV.banner("", "");
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; anim = false; grow = 1; lock(false); api.save(); paintAll(); MV.changed(); done(); }
        function show(nt){ anim = false; note = nt; draw(); MV.wait(1400, fin); }
        anim = true;
        if (p.id === "p1") tw(1500, function(t){ grow = t; draw(); }, function(){ grow = 1; show({ x:2, y:-2.7, text:"shadow from 0 to 4" }); });
        else if (p.id === "p2") tw(1800, function(t){ S.k = 1 + t; syncK(); draw(); }, function(){ S.k = 2; syncK(); show({ x:5, y:-2.7, text:"still 4: 40/10 = 4" }); });
        else if (p.id === "p3") tw(2200, function(t){ S.pol.th = 60 + 60 * t; syncPol(); draw(); }, function(){ S.pol.th = 120; syncPol(); show({ x:-1.5, y:-2.7, text:"6 cos 120° = " + MINUS + "3" }); });
        else { S.swap = true; grow = 0; paintTop(); tw(1500, function(t){ grow = t; draw(); }, function(){ grow = 1; show({ x:-5, y:7, text:"32/5 along a⃗’s line" }); }); }
      }
    },
    challenge:function(id, opt){ return chal(id, opt); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Projections at work (three V3 stations) ----------
function part3(host, api){
  var S = api.S, C = api.content, L = C.labels, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  S.F1 = okInts(S.F1, 2, -8, 8) || [3, 4]; S.d1 = okInts(S.d1, 2, -8, 8) || [5, 0]; S.F2 = okInts(S.F2, 2, -10, 10) || [10, -5];
  if (typeof S.s3 !== "number" || !(S.s3 >= -2 && S.s3 <= 16) || Math.abs(S.s3 * 2 - Math.round(S.s3 * 2)) > 1e-9) S.s3 = 4;
  function algHTML(lines){ return '<details class="alg"><summary>' + L.working + '</summary><div class="alg-lines">' + lines.map(function(l){ return "<div>" + md(l) + "</div>"; }).join("") + "</div></details>"; }
  function stHTML(id, st, extra){
    return '<div class="part pj-st" id="pj-s' + id + '"><h3>' + st.title + "</h3><p>" + md(st.text) + '</p><div class="sym pj-stg"><div><svg class="pj-svg pj-ssvg" id="pj-b' + id + '" role="group" aria-label="' + esc(MV.plain(st.fig)) + '" focusable="false"></svg>' + (extra || "") +
      '</div><div><dl class="read" id="pj-r' + id + '" aria-live="polite"></dl>' + (id === 3 ? '<p class="tiny muted">' + md(st.note) + "</p>" : "") + "</div></div>" + algHTML(st.alg) + "</div>";
  }
  var dn = '<p class="tiny muted">' + md(L.dragNote) + "</p>";
  host.innerHTML = stHTML(1, S1, dn) + stHTML(2, S2, dn) +
    stHTML(3, S3, '<label class="slider pj-sl"><span class="slider-top"><span>' + md(S3.slider) + '</span><output id="pj-s3o"></output></span><input type="range" id="pj-s3" min="-2" max="16" step="0.5" style="accent-color:var(--ink)"></label>');

  // ---- Station 1: work done ----
  var V1 = { xmin:-9, xmax:9, ymin:-9, ymax:9 };
  var b1 = vboard($("#pj-b1", host), { U:20, view:V1,
    handles:[{ id:"F", cls:"hA", name:"Tip of the force F", get:function(){ return S.F1; }, set:function(x, y){ S.F1 = [x, y]; }, lo:-8, hi:8 },
      { id:"d", cls:"hB", name:"Tip of the path d", get:function(){ return S.d1; }, set:function(x, y){ S.d1 = [x, y]; }, lo:-8, hi:8 }],
    scene:function(B){
      var h = gridSVG(B, V1, 4) + '<rect class="pj-crate" x="-13" y="-13" width="26" height="26" rx="3"/>';
      var sh = shadowLayer(B, S.F1, S.d1, { line:true, perp:true, ext:20 });
      h += sh.svg + arrow(0, 0, B.X(S.d1[0]), B.Y(S.d1[1]), "pj-vB") + arrow(0, 0, B.X(S.F1[0]), B.Y(S.F1[1]), "pj-vA");
      h += vlab(B, S.F1, "F⃗", "pj-tv pj-ta") + vlab(B, S.d1, "d⃗", "pj-tv pj-tb");
      return h;
    }, moved:function(){ api.save(); paint1(); } });
  function paint1(){
    b1.render();
    var o = eproj(ev(S.F1), ev(S.d1)), R = S1.rows, rows = [[md(R.F), m("vec{F} = " + vs(ev(S.F1))) + " N"], [md(R.d), m("vec{d} = " + vs(ev(S.d1))) + " m"]];
    if (o.zeroL) rows.push([md(R.along), md(S1.noPath)]);
    else {
      rows.push([md(R.along), m("{vec{F} · vec{d}}/{|vec{d}|} = {" + ss(o.d) + "}/{" + ss(o.mag) + "} = " + ss(o.scal)) + " N"]);
      rows.push([md(R.work), m(ssP(o.scal) + " × " + ssP(o.mag) + " = vec{F} · vec{d} = " + ss(o.d)) + " J"]);
    }
    $("#pj-r1", host).innerHTML = MV.readoutHTML(rows);
    $("#pj-b1", host).setAttribute("aria-label", MV.plain(S1.fig) + " F = " + mn("(" + S.F1.join(", ") + ")") + " N, d = " + mn("(" + S.d1.join(", ") + ")") + " m" + (o.zeroL ? "." : "; part along d " + plainS(o.scal) + " N, work " + plainS(o.d) + " J."));
  }
  paint1();

  // ---- Station 2: the useful part of a force ----
  var V2 = { xmin:-11, xmax:11, ymin:-11, ymax:11 }, TR = [4, 3];
  var b2 = vboard($("#pj-b2", host), { U:17, view:V2,
    handles:[{ id:"F", cls:"hA", name:"Tip of the wind force F", get:function(){ return S.F2; }, set:function(x, y){ S.F2 = [x, y]; }, lo:-10, hi:10 }],
    scene:function(B){
      var h = gridSVG(B, V2, 5), u = [0.8, 0.6], n = [-0.6, 0.8], s;
      for (s = -16; s <= 16; s += 1) h += ln(B.X(s * u[0] - 0.55 * n[0]), B.Y(s * u[1] - 0.55 * n[1]), B.X(s * u[0] + 0.55 * n[0]), B.Y(s * u[1] + 0.55 * n[1]), "pj-tie");
      [-0.3, 0.3].forEach(function(k){ h += ln(B.X(-16 * u[0] + k * n[0]), B.Y(-16 * u[1] + k * n[1]), B.X(16 * u[0] + k * n[0]), B.Y(16 * u[1] + k * n[1]), "pj-rail"); });
      h += '<g transform="rotate(' + f1(Math.atan2(-3, 4) * 180 / Math.PI) + ')"><rect class="pj-train" x="-34" y="-12" width="68" height="24" rx="6"/></g>';
      var sh = shadowLayer(B, S.F2, TR, { line:false, perp:true, ext:20 });
      h += sh.svg + arrow(0, 0, B.X(S.F2[0]), B.Y(S.F2[1]), "pj-vA") + vlab(B, S.F2, "F⃗", "pj-tv pj-ta") + bgTxt(B.X(8.2), B.Y(8.6), "track (4, 3)", "pj-t");
      return h;
    }, moved:function(){ api.save(); paint2(); } });
  function paint2(){
    b2.render();
    var o = eproj(ev(S.F2), ev(TR)), R = S2.rows, pl = rootS(SS.ratQ(edot(o.perp, o.perp)));
    $("#pj-r2", host).innerHTML = MV.readoutHTML([[md(R.F), m("vec{F} = " + vs(ev(S.F2))) + " N"],
      [md(R.along), m("{vec{F} · (4, 3)}/{5} = {" + ss(o.d) + "}/{5} = " + ss(o.scal)) + " N"],
      [md(R.vec), m("({" + ss(o.d) + "}/{25})(4, 3) = " + vs(o.proj))],
      [md(R.perp), m(vs(o.perp)) + ": " + m(ss(pl)) + " N"]]);
    $("#pj-b2", host).setAttribute("aria-label", MV.plain(S2.fig) + " F = " + mn("(" + S.F2.join(", ") + ")") + " N; " + plainS(o.scal) + " N along the track; push on the rails " + plainS(pl) + " N.");
  }
  paint2();

  // ---- Station 3: distance from a point to a line ----
  var V3 = { xmin:-3, xmax:13, ymin:-3, ymax:13 }, P = [5, 10], D = [4, 3];
  var sv3 = $("#pj-b3", host), B3 = plane(21), sl = $("#pj-s3", host);
  viewBox(sv3, V3, 21);
  function paint3(){
    var s = S.s3, q = [0.8 * s, 0.6 * s], h = gridSVG(B3, V3, 4);
    var sh = shadowLayer(B3, P, D, { line:true, perp:true, ext:22 });
    h += sh.svg + arrow(0, 0, B3.X(P[0]), B3.Y(P[1]), "pj-vA");
    h += ln(B3.X(q[0]), B3.Y(q[1]), B3.X(P[0]), B3.Y(P[1]), "pj-pq") + dot(B3.X(q[0]), B3.Y(q[1]), 5.5, "pj-q") + dot(B3.X(P[0]), B3.Y(P[1]), 5) + dot(0, 0, 3.5);
    h += txt(B3.X(P[0]) + 10, B3.Y(P[1]) - 12, "P(5, 10)", "pj-t", "start") + txt(-10, 12, "O", "pj-t") + txt(B3.X(q[0]) + 14, B3.Y(q[1]) + 14, "Q", "pj-t");
    var pq2 = Q.of(25 + (s - 10) * (s - 10)), pq = rootS(pq2), pv = Math.sqrt(Q.val(pq2)), pqT = s === 10 ? "5" : (SS.rational(pq) ? plainS(pq) : "≈ " + num(pv, 2));
    h += bgTxt((B3.X(q[0]) + B3.X(P[0])) / 2 + 26, (B3.Y(q[1]) + B3.Y(P[1])) / 2, "|PQ| " + (pqT.charAt(0) === "≈" ? pqT : "= " + pqT), "pj-ts");
    sv3.innerHTML = h;
    sv3.setAttribute("aria-label", MV.plain(S3.fig) + " Q is " + mn(num(s, 1)) + " units along the line from O; |PQ| is " + (SS.rational(pq) ? plainS(pq) : "about " + num(pv, 2)) + ".");
    if (document.activeElement !== sl) sl.value = s;
    $("#pj-s3o", host).textContent = "OQ = " + mn(num(s, 1)); sl.setAttribute("aria-valuetext", "Q " + mn(num(s, 1)) + " units along the line from O");
    var R = S3.rows, pqH = s === 10 ? m("5") + " (" + md(S3.shortest) + ")" : m(ss(pq)) + (SS.rational(pq) ? "" : " ≈ " + num(pv, 2));
    $("#pj-r3", host).innerHTML = MV.readoutHTML([[md(R.proj), m("({50}/{25})(4, 3) = (8, 6)")], [md(R.perp), m("(5, 10) - (8, 6) = (-3, 4)")],
      [md(R.dist), m("|(-3, 4)| = 5")], [md(R.pq), pqH]]);
  }
  sl.addEventListener("input", function(){ S.s3 = clamp(Math.round(+sl.value * 2) / 2, -2, 16); api.save(); paint3(); });
  paint3();
  return {};
}

// =====================================================================================================================
// @component V8 componentBoxes — exact entry with one box per component (course plan V8): frames such as "( □ , □ , □ )",
// "parallel ( □, □ ) + perpendicular ( □, □ )" or "θ = □° and θ = □°". Boxes take whole numbers, fractions or √ forms;
// answers compare by value (ang2 as an order-free set); known wrong answers ({v} or {has}) get their own feedback.
var FRAMES = {
  s:["=", 0], k:["`k =`", 0], v2:["(", 0, ",", 0, ")"], v3:["(", 0, ",", 0, ",", 0, ")"],
  split:["parallel (", 0, ",", 0, ") + perpendicular (", 0, ",", 0, ")"], ang2:["θ =", 0, "° and θ =", 0, "°"]
};
function flat(a){ return Array.isArray(a) ? a.reduce(function(s, x){ return s.concat(flat(x)); }, []) : [a]; }
function eqArr(u, v){ return u.length === v.length && u.every(function(x, i){ return near(x, v[i], 1e-6); }); }
function projSet(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ var x = S.it[id] || (S.it[id] = { v:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.v)) x.v = []; return x; }
  function frameHTML(it, x){
    var fr = FRAMES[it.form], nb = fr.filter(function(p){ return p === 0; }).length, i = 0;
    return fr.map(function(p){
      if (p !== 0) return '<span class="pj-fl">' + md(p) + "</span>";
      var k = i++;
      return '<input class="numin short pj-bx" data-bx="' + k + '" data-k="' + it.id + "bx" + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="Box ' + (k + 1) + " of " + nb + '" value="' + esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">";
    }).join("");
  }
  host.innerHTML = '<p class="how">' + md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q pj-dq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="pj-frame pj-din"></div><div class="pj-dcl"></div></div>';
  }).join("");
  function paintIn(it){ var x = ist(it.id), el = $('[data-q="' + it.id + '"] .pj-din', host); MV.keepFocus(el, function(){ el.innerHTML = frameHTML(it, x); }); }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .pj-dcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints.map(md), x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + md(it.display) + ".</strong> " + md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), nb = FRAMES[it.form].filter(function(p){ return p === 0; }).length, vals = [], i;
    for (i = 0; i < nb; i++) {
      var raw = String(x.v[i] == null ? "" : x.v[i]).trim();
      if (!raw) return { err:TX.fill };
      var r = MV.parseNum(raw); if (!r || r.length !== 1 || !isFinite(r[0])) return { err:TX.err };
      vals.push(r[0]);
    }
    var ans = flat(MV.ans(it));
    if (it.form === "ang2" ? MV.sameNums(vals, ans, 1e-6) : eqArr(vals, ans)) return { ok:true };
    var W = it.wrong || [];
    for (i = 0; i < W.length; i++) {
      var w = W[i];
      if (w.has != null ? vals.some(function(v){ return near(v, w.has, 1e-6); }) : eqArr(vals, flat(w.v))) return { msg:w.fb };
    }
    return { msg:it.general || TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || t.dataset.bx == null) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[+t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || e.target.dataset.bx == null) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
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
// ---------------------------------------------------- end of V8 componentBoxes --------------------------------------------

// =====================================================================================================================
// ---------- Performance task: Push back along the track (a⃗ = (a₁, a₂) against the track direction (3, 4)) ----------
var task = (function(){
  var api, TRK = [3, 4], V = { xmin:-11, xmax:11, ymin:-11, ymax:11 }, U = 15;
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -10 && v <= 10 ? v : null; }
  function read(){ var a = gi("a1"), b = gi("a2"); return { a1:a, a2:b, valid:a !== null && b !== null }; }
  function checks(D){ if (!D.valid) return [false, false, false]; return [3 * D.a1 + 4 * D.a2 === -10, Math.abs(-4 * D.a1 + 3 * D.a2) >= 20, D.a1 * D.a1 + D.a2 * D.a2 < 100]; }
  function preview(){
    var D = read(), Lb = api.content.labels, rd = $("#pt-read"), sv = $("#pt-svg"), B = plane(U), h = gridSVG(B, V, 5);
    var u = [0.6, 0.8], n = [-0.8, 0.6], s;
    for (s = -16; s <= 16; s += 1) h += ln(B.X(s * u[0] - 0.5 * n[0]), B.Y(s * u[1] - 0.5 * n[1]), B.X(s * u[0] + 0.5 * n[0]), B.Y(s * u[1] + 0.5 * n[1]), "pj-tie");
    [-0.28, 0.28].forEach(function(k){ h += ln(B.X(-16 * u[0] + k * n[0]), B.Y(-16 * u[1] + k * n[1]), B.X(16 * u[0] + k * n[0]), B.Y(16 * u[1] + k * n[1]), "pj-rail"); });
    h += '<g transform="rotate(' + f1(Math.atan2(-4, 3) * 180 / Math.PI) + ')"><rect class="pj-train" x="-22" y="-10" width="44" height="20" rx="5"/></g>';
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + md(Lb.invalid) + "</p>";
      if (sv) { sv.innerHTML = h; sv.setAttribute("aria-label", "The track in the direction (3, 4). Choose a1 and a2."); }
      return;
    }
    var A = [D.a1, D.a2], sh = shadowLayer(B, A, TRK, { line:false, perp:true, ext:20 });
    h += sh.svg + arrow(0, 0, B.X(A[0]), B.Y(A[1]), "pj-vA") + vlab(B, A, "a⃗", "pj-tv pj-ta") + bgTxt(B.X(5.2), B.Y(9.6), "track (3, 4)", "pj-t");
    var o = eproj(ev(A), ev(TRK)), dd = 3 * D.a1 + 4 * D.a2, side = Math.abs(-4 * D.a1 + 3 * D.a2), mag = rootS(Q.of(D.a1 * D.a1 + D.a2 * D.a2));
    if (sv) { sv.innerHTML = h; sv.setAttribute("aria-label", "The track in the direction (3, 4) and a = " + mn("(" + D.a1 + ", " + D.a2 + ")") + ": scalar projection " + plainS(o.scal) + " N, sideways part " + mn(MV.frac(side / 5)) + " N, magnitude " + plainS(mag) + " N."); }
    var rows = [
      [md(Lb.scal), m("{3a_1 + 4a_2}/{5} = {" + dd + "}/{5} = " + ss(o.scal)) + " N: " + (dd < 0 ? Lb.back : dd > 0 ? Lb.fwd : Lb.zero)],
      [md(Lb.vec), m("({" + dd + "}/{25})(3, 4) = " + vs(o.proj))],
      [md(Lb.perp), m("vec{a} - proj = " + vs(o.perp))],
      [md(Lb.side), m("{|-4a_1 + 3a_2|}/{5} = {" + side + "}/{5} = " + qs(Q.of(side, 5))) + " N"],
      [md(Lb.mag), m(ss(mag)) + (SS.rational(mag) ? "" : " ≈ " + num(Math.sqrt(D.a1 * D.a1 + D.a2 * D.a2), 2)) + " N"]];
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
  }
  function stepper(k){
    var Lb = api.content.labels;
    return '<div class="pt-step"><label for="pt-' + k + '"><span class="m">' + md(Lb[k]) + '</span> <span class="tiny muted">' + Lb.range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="pt' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="pt-' + k + '" data-tk="' + k + '" type="number" min="-10" max="10" step="1" autocomplete="off" value="' + esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="pt' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var Lb = a.content.labels;
      if (a.S.a1 == null) { a.S.a1 = "4"; a.S.a2 = "0"; }
      inp.innerHTML = '<div class="pt-in"><p class="tiny" style="font-weight:700;margin:0">' + m("vec{a} = (a_1, a_2)") + "</p>" + stepper("a1") + stepper("a2") + "</div>";
      pv.innerHTML = '<div id="pt-read" aria-live="polite"></div><p class="tiny pt-gh">' + md(Lb.graph) + '</p><svg class="pj-svg pj-ssvg" id="pt-svg" role="img" focusable="false"></svg>';
      viewBox($("#pt-svg"), V, U);
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -10, 10)); $("#pt-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : md(api.content.labels.invalid); },
    checks:checks,
    key:function(D){ return D.a1 + "|" + D.a2; },
    label:function(k){ return m("vec{a} = (" + k.split("|").join(", ") + ")"); },
    text:function(k){ return "(" + k.split("|").map(mn).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ projset:projSet },
  task:task
});

})();
