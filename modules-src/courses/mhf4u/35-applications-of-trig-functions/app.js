// MHF4U 35 Applications of Trig Functions: hero (Ferris wheel beside its height graph), Explore "Ferris wheel lab"
// (Ride / Rates), Part 3 "Real data" model builder (tides, daylight), and the "Design a viewing wheel" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, PI = Math.PI, TAU = 2 * Math.PI;

// ---------- small helpers ----------
function gcd(a, b){ a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function def(o, d){ Object.keys(d).forEach(function(k){ if (o[k] === undefined) o[k] = d[k]; }); return o; }
function isInt(v){ return Math.abs(v - Math.round(v)) < 1e-9; }
function M(s){ return MV.m(s); }
var LIN = function(t){ return t; };
function nsrc(v){ var r = Math.round(v * 10000) / 10000; return (r < 0 ? "-" : "") + String(Math.abs(r)); }
// n/d in lowest terms as m() source
function fr(n, d){ var g = gcd(n, d); n = Math.round(n / g); d = Math.round(d / g); if (d < 0) { n = -n; d = -d; } return d === 1 ? String(n) : (n < 0 ? "-" : "") + Math.abs(n) + "/" + d; }
// (n/d)π as m() source
function piS(n, d){ var g = gcd(n, d); n = Math.round(n / g); d = Math.round(d / g); if (!n) return "0"; var a = Math.abs(n), top = (a === 1 ? "" : a) + "π"; return (n < 0 ? "-" : "") + (d === 1 ? top : top + "/" + d); }
function KC(){ return { pen:css("--pen"), ink:css("--ink"), ink2:css("--ink-2"), hi:css("--hi"), hiSoft:css("--hi-soft"), rule:css("--rule"), sheet:css("--sheet"), a:css("--acol"), k:css("--p-k"), d:css("--p-d"), c:css("--p-c"), grid:css("--plot-grid"), axis:css("--plot-axis"), ui:css("--font-ui") || "sans-serif", math:css("--font-math") || "serif" }; }

// ---------- canvas helpers ----------
function ln(ctx, x1, y1, x2, y2, col, w, dash, alpha){ ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w || 1.5; ctx.setLineDash(dash || []); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function disc(ctx, x, y, r, fill, stroke, sw, alpha){ ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.lineWidth = sw || 2; ctx.strokeStyle = stroke; ctx.stroke(); } ctx.restore(); }
function head(ctx, x1, y1, x2, y2, col, s, alpha){ var a = Math.atan2(y2 - y1, x2 - x1); s = s || 9; ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)); ctx.lineTo(x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill(); ctx.restore(); }
function arrow(ctx, x1, y1, x2, y2, col, w, alpha){ if (Math.hypot(x2 - x1, y2 - y1) < 3) return; ln(ctx, x1, y1, x2, y2, col, w || 2, null, alpha); head(ctx, x1, y1, x2, y2, col, 10, alpha); }
function tx(ctx, k, s, x, y, o){
  o = o || {}; var al = o.alpha == null ? 1 : o.alpha; if (al <= 0) return;
  ctx.save(); ctx.font = o.font || ("600 13px " + k.ui); ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "middle";
  if (o.bg) { var w = ctx.measureText(s).width, bx = ctx.textAlign === "center" ? x - w / 2 : ctx.textAlign === "right" ? x - w : x, by = o.base === "top" ? y - 2 : o.base === "bottom" ? y - 16 : y - 9; ctx.globalAlpha = 0.88 * al; ctx.fillStyle = k.sheet; ctx.fillRect(bx - 3, by, w + 6, 18); }
  ctx.globalAlpha = al; ctx.fillStyle = o.color || k.ink; ctx.fillText(s, x, y); ctx.restore();
}
function tw0(ctx, k, s, font){ ctx.save(); ctx.font = font || ("600 13px " + k.ui); var w = ctx.measureText(s).width; ctx.restore(); return w; }
// vertical bracket with end ticks; label on side "left" | "right"
function vbr(ctx, k, x, ya, yb, col, label, side, alpha){
  if (alpha === 0 || Math.abs(ya - yb) < 2) return;
  ln(ctx, x, ya, x, yb, col, 2.5, null, alpha); ln(ctx, x - 5, ya, x + 5, ya, col, 2.5, null, alpha); ln(ctx, x - 5, yb, x + 5, yb, col, 2.5, null, alpha);
  if (label) tx(ctx, k, label, x + (side === "left" ? -9 : 9), (ya + yb) / 2, { color:col, align:side === "left" ? "right" : "left", bg:true, alpha:alpha });
}
function hbr(ctx, k, xa, xb, y, col, label, alpha){
  if (alpha === 0 || Math.abs(xa - xb) < 2) return;
  ln(ctx, xa, y, xb, y, col, 2.5, null, alpha); ln(ctx, xa, y - 5, xa, y + 5, col, 2.5, null, alpha); ln(ctx, xb, y - 5, xb, y + 5, col, 2.5, null, alpha);
  if (label) tx(ctx, k, label, (xa + xb) / 2, y + 8, { color:col, align:"center", base:"top", bg:true, alpha:alpha });
}

// @component radioGroup (copied from MHF4U 25, with per-option disabling) — segmented control or chip row as a real radio
//   group (arrow keys, roving tabindex). radios(host, {label, aria, options:[{id, t}], value, cls, onChange}) -> {set, get, lock, off(ids)}
function radios(host, o){
  var val = String(o.value), locked = false, offs = {};
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, dis = locked || offs[x.id]; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || offs[id]) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }).filter(function(x){ return !offs[x]; }), i = (ids.indexOf(val) + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    lock:function(b){ if (b !== locked) { locked = b; paint(); } }, off:function(ids){ var n = {}; (ids || []).forEach(function(x){ n[x] = 1; }); if (JSON.stringify(n) !== JSON.stringify(offs)) { offs = n; paint(); } } };
}

// ---------- the Ferris wheel model ----------
// rider's angle φ(t) = φ0 + 2πt/T from the right-hand horizontal; h = c + r sin φ. Boarding points: 0 bottom, 1 axle going up, 2 top, 3 axle going down
var PHI0 = [-PI / 2, 0, PI / 2, PI];
var FORM = [{ fn:"cos", s:-1 }, { fn:"sin", s:1 }, { fn:"cos", s:1 }, { fn:"sin", s:-1 }];
function dTop(T, b){ return [T / 2, T / 4, 0, 3 * T / 4][b]; }
function Hm(m, t){ return m.c + m.r * Math.sin(PHI0[m.b] + TAU * t / m.T); }
function win(r, c){ return 5 * Math.ceil((c + r + 3) / 5); }
function speed(m){ return TAU * m.r / m.T; }
// sin(mπ/12) for m = 0..23 as [coef, q]: value = coef/2·√q; null unless the angle is a multiple of π/6 or π/4
var SIN12 = (function(){ var base = { 0:[0, 1], 2:[1, 1], 3:[1, 2], 4:[1, 3], 6:[2, 1], 8:[1, 3], 9:[1, 2], 10:[1, 1] }, out = []; for (var m = 0; m < 24; m++) { var v = base[m % 12]; out.push(v ? [m < 12 ? v[0] : -v[0], v[1]] : null); } return out; })();
function exTrig(fn, n, d){ if ((12 * n) % d !== 0) return null; var m = (((12 * n / d) % 24) + 24) % 24; if (fn === "cos") m = (m + 6) % 24; return SIN12[m]; }
// exact height at a whole-number time: 2h = A + B√q
function exH(m, t){
  if (!isInt(t) || !isInt(m.r) || !isInt(m.c)) return null;
  var F = FORM[m.b], f = exTrig(F.fn, 2 * Math.round(t), m.T); if (!f) return null;
  return f[1] === 1 ? { A:2 * m.c + F.s * m.r * f[0], B:0, q:1 } : { A:2 * m.c, B:F.s * m.r * f[0], q:f[1] };
}
function exSrc(E){
  var rat = E.A / 2; if (!E.B) return nsrc(rat);
  var b = Math.abs(E.B), co = b % 2 === 0 ? (b / 2 === 1 ? "" : String(b / 2)) + "√" + E.q : "{" + b + "√" + E.q + "}/{2}";
  return (rat ? nsrc(rat) + (E.B < 0 ? " - " : " + ") : (E.B < 0 ? "-" : "")) + co;
}
// rational p/q (q > 0) as text: integer, short decimal, or fraction ≈ decimal
function ratTxt(p, q){ var g = gcd(p, q); p = Math.round(p / g); q = Math.round(q / g); if (q < 0) { p = -p; q = -q; } if (q === 1) return { src:String(p), exact:true, dec:true }; if (100 % q === 0) return { src:nsrc(p / q), exact:true, dec:true }; return { src:(p < 0 ? "-" : "") + Math.abs(p) + "/" + q + " ≈ " + nsrc(Math.round(p / q * 100) / 100), exact:true, dec:false, frac:(p < 0 ? "-" : "") + Math.abs(p) + "/" + q }; }
function modelSrc(m, stacked){
  var F = FORM[m.b], r = Math.round(m.r), c = Math.round(m.c), n = m.T / 2;
  return "h(t) = @a{" + (F.s < 0 ? "-" : "") + r + "} " + F.fn + "(@k{" + (stacked === false ? "π/" + n : "{π}/{" + n + "}") + "} t) + @c{" + c + "}";
}
function alsoSrc(m){
  var r = Math.round(m.r), c = Math.round(m.c), n = m.T / 2, d = dTop(m.T, m.b);
  if (!d) return "h(t) = @a{" + r + "} cos(@k{{π}/{" + n + "}} t) + @c{" + c + "}";
  return "h(t) = @a{" + r + "} cos[@k{{π}/{" + n + "}} (t - @d{" + nsrc(d) + "})] + @c{" + c + "}";
}
function spoken(m){ var F = FORM[m.b]; return "h of t equals " + (F.s < 0 ? "negative " : "") + Math.round(m.r) + " " + F.fn + " of pi over " + (m.T / 2) + " t, plus " + Math.round(m.c); }
// top / bottom exactly at whole-number t?
function where(m, t){
  if (isInt(t)) { var P0 = [-1, 0, 1, 2][m.b], v = (((P0 * m.T + 4 * Math.round(t)) % (4 * m.T)) + 4 * m.T) % (4 * m.T); if (v === m.T) return "top"; if (v === 3 * m.T) return "bottom"; }
  return Math.cos(PHI0[m.b] + TAU * t / m.T) > 0 ? "up" : "down";
}
function hVal(m, t, dp){ var E = exH(m, t); if (E) return E.B ? exSrc(E) + " ≈ " + num(Hm(m, t), dp || 1) : exSrc(E); return null; }
function hEq(m, t, dp){ var v = hVal(m, t, dp); return M("h(" + nsrc(t) + ")" + (v != null ? " = " + v : " ≈ " + num(Hm(m, t), dp || 1))) + " m"; }

// @component N19+N24 wheelGraph — a Ferris wheel (N19: ground, platform, rim, 8 turning spokes, axle, the rider's car, arcs,
//   brackets, ghost car, speed arrow with its vertical part) beside its height graph on ONE vertical scale (N24 circle–graph
//   link: the wheel at equal scale, a --hi height line straight across). Wider than 560 px it is one canvas; at 560 px and
//   narrower it falls back to two stacked canvases (wheel square, graph 4:3) with --hi height markers on each height axis.
//   wg = wheelGraph(host, {ratio, aria}); wg.set(scene) redraws; wg.p1 / wg.pg are the graph plots (for MV.drag); wg.last()
//   is the visible graph's layout (for strips drawn under it). Scene keys are listed in paintWheel / paintGraph.
function wheelGraph(host, o){
  host.classList.add("wg");
  host.innerHTML = '<div class="wg-one"><div class="plot-wrap"><canvas class="plot wg-c1" role="img" aria-label="' + MV.esc(o.aria || "Ferris wheel and height graph") + '"></canvas></div></div>' +
    '<div class="wg-two"><div class="plot-wrap"><canvas class="plot square wg-cw" role="img" aria-label="' + MV.esc(o.aria || "Ferris wheel") + '"></canvas></div><div class="plot-wrap"><canvas class="plot wg-cg" role="img" aria-label="Height graph"></canvas></div></div>';
  var c1 = $(".wg-c1", host), cw = $(".wg-cw", host), cg = $(".wg-cg", host);
  if (o.ratio) c1.style.aspectRatio = o.ratio;
  var V0 = { xmin:0, xmax:1, ymin:0, ymax:1 }, p1 = new MV.Plot(c1, V0), pw = new MV.Plot(cw, V0), pg = new MV.Plot(cg, V0), sc = null, last = null;
  function base(s){ return { ymin:s.ymin || 0, ymax:s.ymax }; }
  function lay1(W, H, s){
    var b = base(s), padT = 26, padB = 52, u = (H - padT - padB) / (b.ymax - b.ymin), rr = Math.max(s.r, s.ghostW ? s.ghostW.r : 0);
    var leftM = clamp(W * 0.085, 24, 84), R = s.r * u, cx = leftM + rr * u, wpR = Math.max(W * 0.36, cx + rr * u + 18), gL = wpR + 34, gR = W - 16, ux = (gR - gL) / s.tmax;
    return { kind:"one", W:W, H:H, u:u, padB:padB, leftM:leftM, cx:cx, R:R, gx0:0, gx1:W, gL:gL, gR:gR, ux:ux, b:b,
      Y:function(h){ return H - padB - (h - b.ymin) * u; }, X:function(t){ return gL + t * ux; },
      view:{ xmin:-gL / ux, xmax:(W - gL) / ux, ymin:b.ymin - padB / u, ymax:b.ymin + (H - padB) / u } };
  }
  function layW(W, H, s){
    var b = base(s), padT = 12, padB = 22, axX = 30, leftM = axX + 34, rr = Math.max(s.r, s.ghostW ? s.ghostW.r : 0);
    var u = Math.min((H - padT - padB) / (b.ymax - b.ymin), (W - leftM - 26) / (2 * rr)), R = s.r * u, cx = leftM + rr * u + Math.max(0, (W - leftM - 26 - 2 * rr * u) / 2);
    return { kind:"wheel", W:W, H:H, u:u, padB:padB, axX:axX, leftM:leftM, cx:cx, R:R, gx0:0, gx1:W, b:b, Y:function(h){ return H - padB - (h - b.ymin) * u; } };
  }
  function layG(W, H, s){
    var b = base(s), padT = 26, padB = 52, u = (H - padT - padB) / (b.ymax - b.ymin), gL = 40, gR = W - 16, ux = (gR - gL) / s.tmax;
    return { kind:"graph", W:W, H:H, u:u, padB:padB, gL:gL, gR:gR, ux:ux, b:b, Y:function(h){ return H - padB - (h - b.ymin) * u; }, X:function(t){ return gL + t * ux; },
      view:{ xmin:-gL / ux, xmax:(W - gL) / ux, ymin:b.ymin - padB / u, ymax:b.ymin + (H - padB) / u } };
  }
  function draw(p, c, lay, parts){
    var r = c.getBoundingClientRect();
    if (!sc || r.width < 40) return;
    var F = lay(r.width, r.height, sc);
    p.draw({ view:F.view || V0, grid:false, axes:false, ticks:false, describe:sc.describe, after:function(ctx){ var k = KC(); parts.forEach(function(fn){ fn(ctx, k, F, sc); }); } });
    if (F.gL) last = F;
  }
  p1.render = function(){ draw(p1, c1, lay1, [paintWheel, paintGraph, paintLink]); };
  pw.render = function(){ draw(pw, cw, layW, [paintWheel]); };
  pg.render = function(){ draw(pg, cg, layG, [paintGraph]); };
  return { p1:p1, pg:pg, pw:pw, last:function(){ return last; }, set:function(s){ sc = s; p1.render(); pw.render(); pg.render(); }, scene:function(){ return sc; } };
}
// Scene (wheel part): r, c, T, b, ymax, ymin, t (car time, null = no car), rot (spoke turn time), ground 0..1, wheelDraw 0..1,
//   ghostW {r, c}, brackets {r, c} (alphas), lab {r, c, T, axis}, level {h, label, fill, fillLabel, marks, pulse}, flash,
//   rates {t1, t2, arrow, ghost}, probe (speed-arrow time), arcs [{a, b, label}], hline
function paintWheel(ctx, k, F, s){
  var Y = F.Y, cx = F.cx, R = F.R, ay = Y(s.c), wd = s.wheelDraw == null ? 1 : s.wheelDraw, g = s.ground == null ? 1 : s.ground;
  var phi = function(t){ return PHI0[s.b] + TAU * t / s.T; }, P = function(a){ return [cx + R * Math.cos(a), ay - R * Math.sin(a)]; };
  ln(ctx, F.gx0, Y(0), F.gx0 + (F.gx1 - F.gx0) * g, Y(0), k.ink, 2);
  if (F.axX) { // stacked wheel canvas: its own height axis
    ln(ctx, F.axX, Y(F.b.ymin), F.axX, Y(s.ymax), k.axis, 1.2);
    ctx.save(); ctx.fillStyle = k.ink2; ctx.font = "12px " + k.ui; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (var hh = Math.ceil(F.b.ymin / 5) * 5; hh <= s.ymax + 1e-9; hh += 5) { ln(ctx, F.axX - 3, Y(hh), F.axX + 3, Y(hh), k.axis, 1); ctx.fillText(num(hh), F.axX - 5, Y(hh)); }
    ctx.restore();
    tx(ctx, k, "height (m)", F.axX + 6, 10, { font:"12px " + k.ui, color:k.ink2 });
  }
  if (wd <= 0) return;
  if (s.ghostW) { ctx.save(); ctx.globalAlpha = 0.7; ctx.strokeStyle = k.ink2; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(cx, Y(s.ghostW.c), s.ghostW.r * F.u, 0, TAU); ctx.stroke(); ctx.restore(); disc(ctx, cx, Y(s.ghostW.c), 3, k.ink2, null, 0, 0.7); }
  // legs and the boarding platform
  ln(ctx, cx, ay, cx - 0.55 * R, Y(0), k.ink2, 2, null, 0.4 * wd); ln(ctx, cx, ay, cx + 0.55 * R, Y(0), k.ink2, 2, null, 0.4 * wd);
  var py = Y(s.c - s.r) + 8;
  if (py < Y(0) - 1) { ctx.save(); ctx.globalAlpha = wd; ctx.fillStyle = k.rule; ctx.fillRect(cx - 13, py, 26, Y(0) - py); ctx.strokeStyle = k.ink2; ctx.lineWidth = 1; ctx.strokeRect(cx - 12.5, py + 0.5, 25, Y(0) - py - 1); ctx.restore(); }
  // region above a level line (P4, task): the circular segment above it
  var L = s.level;
  if (L && L.fill && wd >= 1) {
    var sn = (L.h - s.c) / s.r;
    if (sn < 1) {
      ctx.save(); ctx.beginPath();
      if (sn <= -1) ctx.arc(cx, ay, R, 0, TAU); else { var a1 = Math.asin(sn), a2 = PI - a1; ctx.arc(cx, ay, R, -a1, -a2, true); ctx.closePath(); }
      ctx.fillStyle = k.hiSoft; ctx.fill(); ctx.restore();
      if (sn > -1) { ctx.save(); ctx.strokeStyle = k.hi; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, ay, R, -Math.asin(sn), -(PI - Math.asin(sn)), true); ctx.stroke(); ctx.restore(); }
    }
  }
  // rim (drawn progressively in the hero), spokes, axle
  ctx.save(); ctx.strokeStyle = k.ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, ay, R, PI / 2, PI / 2 - TAU * wd, true); ctx.stroke(); ctx.restore();
  var rot = TAU * (s.rot != null ? s.rot : (s.t || 0)) / s.T;
  for (var i = 0; i < 8; i++) { var sp = P(PHI0[s.b] + rot + i * PI / 4); ln(ctx, cx, ay, sp[0], sp[1], k.ink2, 1.2, null, 0.45 * wd); }
  disc(ctx, cx, ay, 4, k.ink, null, 0, wd);
  // arcs of the rim (Rates mode between t1 and t2; P2's three sixths)
  function arc(ta, tb, w){ if (Math.abs(tb - ta) < 1e-6) return; var a0 = phi(Math.min(ta, tb)), a1 = phi(Math.max(ta, tb)); ctx.save(); ctx.strokeStyle = k.hi; ctx.lineWidth = w || 5; ctx.lineCap = "round"; ctx.beginPath(); if (a1 - a0 >= TAU - 1e-9) ctx.arc(cx, ay, R, 0, TAU); else ctx.arc(cx, ay, R, -a0, -a1, true); ctx.stroke(); ctx.restore(); }
  var bx = cx + R + 9;
  (s.arcs || []).forEach(function(A){ arc(A.a, A.b); vbr(ctx, k, bx, Y(Hm(s, A.a)), Y(Hm(s, A.b)), k.ink, A.label, "left"); });
  var A = s.rates;
  if (A) {
    arc(A.t1, A.t2);
    var h1 = Hm(s, A.t1), h2 = Hm(s, A.t2);
    if (!(s.arcs && s.arcs.length)) { ln(ctx, bx, Y(h1), bx, Y(h2), k.ink, 6, null, 0.9); ln(ctx, bx, Y(h1), bx, Y(h2), k.hi, 3.5); ln(ctx, bx - 5, Y(h1), bx + 5, Y(h1), k.ink, 2); ln(ctx, bx - 5, Y(h2), bx + 5, Y(h2), k.ink, 2);
      if (Math.abs(Y(h1) - Y(h2)) > 14) tx(ctx, k, "rise " + num(h2 - h1, Math.abs(A.t2 - A.t1) < 1 ? 3 : 1) + " m", bx - 9, (Y(h1) + Y(h2)) / 2, { align:"right", bg:true }); }
    if (A.ghost !== false) { var g1 = P(phi(A.t1)); disc(ctx, g1[0], g1[1], 7, k.ink2, k.sheet, 2, 0.5); }
  }
  // brackets: violet axle → top (the radius), magenta ground → axle
  var B = s.brackets || {};
  if (B.r) {
    var lr = (s.lab && s.lab.r) || "";
    if (tw0(ctx, k, lr) > 0.85 * R) { vbr(ctx, k, cx + 7, ay, Y(s.c + s.r), k.a, null, "right", B.r); tx(ctx, k, lr, cx, Y(s.c + s.r) - 13, { color:k.a, align:"center", bg:true, alpha:B.r }); }
    else { vbr(ctx, k, cx + 7, ay, Y(s.c + s.r), k.a, null, "right", B.r); tx(ctx, k, lr, cx + 16, Y(s.c + 0.7 * s.r), { color:k.a, bg:true, alpha:B.r }); }
  }
  if (B.c) {
    var xb = cx - R - 12, lw = tw0(ctx, k, (s.lab && s.lab.c) || "");
    vbr(ctx, k, xb, Y(0), ay, k.c, s.lab && s.lab.c, xb - (F.axX || 0) - lw > 14 ? "left" : "right", B.c);
  }
  // level line (stacked canvases draw it here; the one-canvas layout draws it across both panels in paintLink)
  if (L && F.kind === "wheel") { ln(ctx, 0, Y(L.h), F.W, Y(L.h), k.ink, 1.8, [8, 6]); tx(ctx, k, L.label, F.W - 6, Y(L.h) - 10, { align:"right", bg:true }); }
  if (L && L.pulse) { var q1 = Math.asin(clamp((L.h - s.c) / s.r, -1, 1)); [q1, PI - q1].forEach(function(a){ var q = P(a); disc(ctx, q[0], q[1], 9 + 5 * L.pulse, null, k.ink, 3, L.pulse); disc(ctx, q[0], q[1], 7 + 5 * L.pulse, null, k.hi, 3, L.pulse); }); }
  // the rider's car
  if (s.t != null) {
    var c0 = P(phi(s.t));
    if (s.flash) disc(ctx, c0[0], c0[1], 17, k.hi, null, 0, s.flash);
    disc(ctx, c0[0], c0[1], 11, k.hi); disc(ctx, c0[0], c0[1], 7, k.ink, k.sheet, 2);
    if (F.axX && s.hline) tri(ctx, k, F.axX, Y(Hm(s, s.t)));
  }
  // speed arrow at the car at t1 (or at the moving car during a reveal): along the rim, and its vertical part
  if (A && A.arrow) {
    var ta = s.probe != null ? s.probe : A.t1, a = phi(ta), p0 = P(a), Ls = clamp(speed(s) * 42, 16, 130), vy = Math.cos(a);
    arrow(ctx, p0[0], p0[1], p0[0] - Math.sin(a) * Ls, p0[1] - vy * Ls, k.ink, 2.5);
    if (Math.abs(vy * Ls) > 4) {
      ln(ctx, p0[0], p0[1], p0[0], p0[1] - vy * Ls, k.ink, 6.5); head(ctx, p0[0], p0[1], p0[0], p0[1] - vy * Ls * 1.04, k.ink, 13);
      ln(ctx, p0[0], p0[1], p0[0], p0[1] - vy * (Ls - 3), k.hi, 3.5); head(ctx, p0[0], p0[1], p0[0], p0[1] - vy * Ls, k.hi, 10);
      var right = p0[0] < cx; tx(ctx, k, "rate of climb", p0[0] + (right ? 10 : -10), p0[1] - vy * Ls / 2, { align:right ? "left" : "right", bg:true });
    }
  }
}
function tri(ctx, k, x, y){ ctx.save(); ctx.beginPath(); ctx.moveTo(x + 1, y); ctx.lineTo(x - 10, y - 7); ctx.lineTo(x - 10, y + 7); ctx.closePath(); ctx.fillStyle = k.hi; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = k.ink; ctx.stroke(); ctx.restore(); }
// Scene (graph part): tmax, frameA 0..1, curve {to, ahead}, axisLine, periodBr (alpha), also (d), rates {t1, t2, tangent, slope},
//   secs [{a, b, label}], level (fill over the first turn, marks), dot
function paintGraph(ctx, k, F, s){
  var Y = F.Y, X = F.X, gL = F.gL, gR = F.gR, y0 = Y(0), top = Y(s.ymax), bot = Y(F.b.ymin), fa = s.frameA == null ? 1 : s.frameA;
  var H = function(t){ return Hm(s, t); }, tStep = s.T / 4, t, h;
  if (fa > 0) {
    ctx.save(); ctx.globalAlpha = fa; ctx.strokeStyle = k.grid; ctx.lineWidth = 1; ctx.beginPath();
    for (t = 0; t <= s.tmax + 1e-9; t += tStep) { var px = Math.round(X(t)) + 0.5; ctx.moveTo(px, top); ctx.lineTo(px, bot); }
    for (h = Math.ceil(F.b.ymin / 5) * 5; h <= s.ymax + 1e-9; h += 5) { var py = Math.round(Y(h)) + 0.5; ctx.moveTo(gL, py); ctx.lineTo(gR, py); }
    ctx.stroke();
    ctx.strokeStyle = k.axis; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gL, y0); ctx.lineTo(gR + 6, y0); ctx.moveTo(gL, bot); ctx.lineTo(gL, top - 6); ctx.stroke();
    ctx.fillStyle = k.ink2; ctx.font = "12px " + k.ui; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var lastR = -1e9;
    for (t = tStep; t <= s.tmax + 1e-9; t += tStep) { var lab = num(t, 1), w = ctx.measureText(lab).width, xx = X(t); if (xx - w / 2 < lastR + 5 || xx + w / 2 > F.W - 1) continue; ctx.fillText(lab, xx, y0 + 4); lastR = xx + w / 2; }
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (h = Math.ceil(F.b.ymin / 5) * 5; h <= s.ymax + 1e-9; h += 5) ctx.fillText(num(h), gL - 5, Y(h));
    ctx.restore();
    tx(ctx, k, "height (m)", gL + 6, top - 12, { font:"12px " + k.ui, color:k.ink2, alpha:fa });
    tx(ctx, k, "time (s)", gR + 6, y0 + 19, { font:"12px " + k.ui, color:k.ink2, align:"right", base:"top", alpha:fa });
  }
  var L = s.level, T1 = Math.min(s.T, s.tmax), xs;
  ctx.save(); ctx.beginPath(); ctx.rect(gL - 1, 0, gR - gL + 10, F.H); ctx.clip();
  if (L && L.fill) {
    ctx.save(); ctx.beginPath(); var N = 160;
    for (var i = 0; i <= N; i++) { t = T1 * i / N; var yy = Y(Math.max(H(t), L.h)); if (i) ctx.lineTo(X(t), yy); else ctx.moveTo(X(t), yy); }
    ctx.lineTo(X(T1), Y(L.h)); ctx.lineTo(X(0), Y(L.h)); ctx.closePath(); ctx.fillStyle = k.hiSoft; ctx.fill(); ctx.restore();
  }
  if (s.axisLine) { ln(ctx, gL, Y(s.c), gR, Y(s.c), k.c, 1.8, [7, 5]); if (s.lab && s.lab.axis) tx(ctx, k, s.lab.axis, gR - 2, Y(s.c) - 11, { color:k.c, align:"right", bg:true }); }
  if (s.also != null) {
    var yd = y0 - 10;
    if (s.also > 1e-9) { arrow(ctx, X(0), yd, X(s.also), yd, k.d, 2.5); tx(ctx, k, "d = " + num(s.also, 1), (X(0) + X(s.also)) / 2, yd - 11, { color:k.d, align:"center", bg:true }); }
    else tx(ctx, k, "d = 0", X(0) + 6, yd - 11, { color:k.d, bg:true });
  }
  // the height curve: full strength up to `to`, 35% beyond ("what comes next")
  var C = s.curve;
  if (C) {
    var to = C.to == null ? s.tmax : clamp(C.to, 0, s.tmax);
    var path = function(a, b, al){ if (b - a < 1e-9) return; var n = Math.max(8, Math.ceil(240 * (b - a) / s.tmax)); ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = k.pen; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.beginPath(); for (var j = 0; j <= n; j++) { var tt = a + (b - a) * j / n; if (j) ctx.lineTo(X(tt), Y(H(tt))); else ctx.moveTo(X(tt), Y(H(tt))); } ctx.stroke(); ctx.restore(); };
    path(0, to, 1); if (C.ahead !== false) path(to, s.tmax, 0.35);
  }
  if (L && F.kind === "graph") { ln(ctx, 0, Y(L.h), F.W, Y(L.h), k.ink, 1.8, [8, 6]); tx(ctx, k, L.label, gR - 2, Y(L.h) - 11, { align:"right", bg:true }); }

  // secants: P2's finished ones, then the live one
  function secant(a, b, tri, lab, slope){
    var ya = H(a), yb = H(b), xa = X(a), xb = X(b), Ya = Y(ya), Yb = Y(yb); if (Math.abs(xb - xa) < 0.5) return;
    var m = (Yb - Ya) / (xb - xa), ext = 0.25 * Math.abs(xb - xa) + 20, x1 = Math.min(xa, xb) - ext, x2 = Math.max(xa, xb) + ext;
    ln(ctx, x1, Ya + m * (x1 - xa), x2, Ya + m * (x2 - xa), k.ink2, 2);
    if (tri) {
      ln(ctx, xa, Ya, xb, Ya, k.ink, 2); ln(ctx, xb, Ya, xb, Yb, k.ink, 2);
      if (lab && Math.abs(xb - xa) > 34) {
        var dt = b - a, dpT = Math.abs(dt) < 1 ? 2 : 0;
        tx(ctx, k, "run " + num(Math.abs(dt), dpT) + " s", (xa + xb) / 2, Ya + (Yb < Ya ? 5 : -5), { align:"center", base:Yb < Ya ? "top" : "bottom", bg:true });
        if (Math.abs(Yb - Ya) > 14) tx(ctx, k, "rise " + num(yb - ya, Math.abs(dt) < 1 ? 3 : 1) + " m", xb + (xb > gR - 90 ? -8 : 8), (Ya + Yb) / 2, { align:xb > gR - 90 ? "right" : "left", bg:true });
      }
    }
    if (slope) tx(ctx, k, slope, xb + 8, (Ya + Yb) / 2, { bg:true, color:k.ink });
  }
  (s.secs || []).forEach(function(q){ secant(q.a, q.b, true, false, q.label); disc(ctx, X(q.a), Y(H(q.a)), 4.5, k.ink, k.sheet, 1.5); disc(ctx, X(q.b), Y(H(q.b)), 4.5, k.ink, k.sheet, 1.5); });
  var A = s.rates;
  if (A) {
    secant(A.t1, A.t2, true, !(s.secs && s.secs.length), null);
    if (A.tangent) { var y1 = H(A.t1), x1t = X(A.t1), m2 = -A.slope * F.u / F.ux, dx = 90; ln(ctx, x1t - dx, Y(y1) - m2 * dx, x1t + dx, Y(y1) + m2 * dx, k.ink, 2); tx(ctx, k, A.tangent, x1t + 12, Y(y1) + (m2 < 0 ? 18 : -18), { bg:true }); }
    [A.t1, A.t2].forEach(function(tt){ disc(ctx, X(tt), Y(H(tt)), 12, k.hi); disc(ctx, X(tt), Y(H(tt)), 7, k.ink, k.sheet, 2); });
    tx(ctx, k, "t₁", X(A.t1) - 8, Y(H(A.t1)) + 16, { align:"right", font:"italic 600 14px " + k.math, bg:true });
    tx(ctx, k, "t₂", X(A.t2) + 8, Y(H(A.t2)) + 16, { font:"italic 600 14px " + k.math, bg:true });
  }
  (L && L.marks || []).forEach(function(tt){ disc(ctx, X(tt), Y(L.h), 11, null, k.ink, 2.5); disc(ctx, X(tt), Y(L.h), 5, k.ink); });
  if (s.dot && s.t != null && s.t <= s.tmax + 1e-9) { disc(ctx, X(s.t), Y(H(s.t)), 9, k.hi); disc(ctx, X(s.t), Y(H(s.t)), 5, k.ink, k.sheet, 1.5); }
  ctx.restore();
  if (L && L.fill && L.fillLabel) { var fw = tw0(ctx, k, L.fillLabel) / 2 + 6; xs = X(dTop(s.T, s.b) % s.T); tx(ctx, k, L.fillLabel, gR - gL > 2 * fw ? clamp(xs, gL + fw, gR - fw) : gL + fw, Y(s.c + s.r) - 14, { align:"center", bg:true }); }
  if (s.periodBr) { var lbT = s.lab && s.lab.T; hbr(ctx, k, X(0), X(Math.min(s.T, s.tmax)), y0 + 41, k.k, null, s.periodBr); if (lbT) tx(ctx, k, lbT, (X(0) + X(Math.min(s.T, s.tmax))) / 2, y0 + 41, { color:k.k, align:"center", bg:true, alpha:s.periodBr }); }
  if (F.kind === "graph" && s.hline && s.t != null) tri(ctx, k, gL, Y(H(s.t)));
}
// one-canvas extras: the height line straight across, and level lines across both panels
function paintLink(ctx, k, F, s){
  if (s.hline && s.t != null && (s.wheelDraw == null || s.wheelDraw >= 1)) {
    var a = PHI0[s.b] + TAU * s.t / s.T, x0 = F.cx + F.R * Math.cos(a), h = Hm(s, s.t), tt = Math.min(s.t, s.tmax);
    ln(ctx, x0 + 12, F.Y(h), F.X(tt) - 10, F.Y(h), k.hi, 2.5, [7, 5]);
  }
  if (s.level) { ln(ctx, 0, F.Y(s.level.h), F.gR, F.Y(s.level.h), k.ink, 1.8, [8, 6]); tx(ctx, k, s.level.label, F.gR - 2, F.Y(s.level.h) - 11, { align:"right", bg:true }); }
}

// ---------- hero: wheel draws, rider rides one turn while her height traces h(t), brackets fade in ----------
function hero(f){
  var host = $("#hero-wg"); if (!host) return;
  var wg = wheelGraph(host, { ratio:"16 / 10", aria:"Ferris wheel of radius 10 metres with its axle 12 metres up, beside the graph of the rider’s height over one 60-second turn" });
  var st = { ground:0, wheel:0, frame:0, car:false, t:0, br:0, bc:0, bt:0 };
  function paint(){
    wg.set({ r:10, c:12, T:60, b:0, ymax:25, tmax:60, ground:st.ground, wheelDraw:st.wheel, frameA:st.frame, t:st.car ? st.t : null, rot:st.t,
      curve:st.car ? { to:st.t, ahead:false } : null, hline:st.car, dot:st.car, brackets:{ r:st.br, c:st.bc }, periodBr:st.bt,
      lab:{ r:"radius 10 m = amplitude", c:"axle 12 m = axis", T:"60 s per turn = period" },
      describe:"Ferris wheel, radius 10 metres, axle 12 metres, one turn every 60 seconds. The rider starts at the bottom, 2 metres up, and her height traces the graph of h of t equals negative 10 cos of pi over 30 t, plus 12, from 0 to 60 seconds. Brackets: radius 10 metres is the amplitude, axle 12 metres is the axis, 60 seconds per turn is the period." });
  }
  function cap(){ if (f.cap) f.cap.innerHTML = MV.C.hero.cap.end; }
  if (MV.reduceMotion) { st = { ground:1, wheel:1, frame:1, car:true, t:60, br:1, bc:1, bt:1 }; paint(); cap(); return; }
  paint();
  var seq = [
    function(n){ MV.tween({ dur:700, ease:LIN, step:function(x){ st.ground = x; paint(); }, done:n }); },
    function(n){ MV.tween({ dur:1100, step:function(x){ st.wheel = x; st.frame = x; paint(); }, done:n }); },
    function(n){ st.car = true; paint(); MV.wait(700, n); },
    function(n){ MV.tween({ dur:6000, ease:LIN, step:function(x){ st.t = 60 * x; paint(); }, done:n }); },
    function(n){ MV.tween({ dur:450, step:function(x){ st.br = x; paint(); }, done:function(){ MV.wait(500, n); } }); },
    function(n){ MV.tween({ dur:450, step:function(x){ st.bc = x; paint(); }, done:function(){ MV.wait(500, n); } }); },
    function(n){ MV.tween({ dur:450, step:function(x){ st.bt = x; paint(); }, done:n }); },
    function(){ cap(); }
  ];
  (function run(i){ if (i < seq.length) seq[i](function(){ run(i + 1); }); })(0);
}

// ---------- Explore: Ferris wheel lab ----------
var DTS = [10, 5, 1, 0.1, 0.01];
function explore(host, api){
  var C = api.content, U = C.ui;
  var S = def(api.S, { mode:"ride", r:10, c:12, T:60, b:0, t:0, t1:10, t2:20, rows:[], br:true, line:true, also:false, arrow:true, rg:false, lock:null });
  var V = { ymax:win(S.r, S.c), anims:[], timers:[], busy:false, play:null, ov:{}, ghost:null, note:false, flashK:false, zoom:null };
  var phone = window.innerWidth <= 560;
  host.innerHTML =
    '<div class="lab-top"><div id="lab-mode"></div><div class="lab-lock" id="lab-lock" hidden></div></div>' +
    '<div data-mv="graph" class="lab-graph"><p class="eq-cap lab-cap" id="lab-cap" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="lab-wg"></div><div class="lab-rate" id="lab-rate-w" hidden><canvas class="plot" id="lab-rate" role="img" aria-label="Graph of the rider’s rate of climb"></canvas></div></div>' +
    '<div class="lab-grid"><div class="lab-ctrl">' +
      '<details class="lab-grp" id="lab-gw"' + (phone ? "" : " open") + '><summary>Wheel</summary><div id="lab-sw"></div><div id="lab-board" class="lab-row"></div><p class="tiny muted lab-note" id="lab-note" aria-live="polite"></p></details>' +
      '<details class="lab-grp" id="lab-gt" open><summary>Time</summary><div id="lab-st"></div><div class="q-actions lab-tb"><button type="button" class="btn ghost sm" id="lab-m1" data-k="labm1">' + MINUS + '1 s</button><button type="button" class="btn ghost sm" id="lab-p1" data-k="labp1">+1 s</button><button type="button" class="btn primary sm" id="lab-play" data-k="labplay"></button><span class="tiny muted" id="lab-speed"></span></div></details>' +
      '<div class="lab-grp" id="lab-gr"><div id="lab-sr"></div><div class="q-actions"><button type="button" class="btn primary sm" id="lab-shrink" data-k="labshrink">Shrink toward ' + M("t_1") + '</button><button type="button" class="btn ghost sm" id="lab-reset" data-k="labreset">Reset</button></div></div>' +
      '<div class="lab-tog" id="lab-tog" role="group" aria-label="Show"></div>' +
    '</div><div class="lab-read"><dl class="read" id="lab-read" aria-live="polite"></dl></div></div>';
  var wg = wheelGraph($("#lab-wg"), { ratio:"16 / 10", aria:"Ferris wheel lab" });
  var rp = new MV.Plot($("#lab-rate"), { xmin:0, xmax:1, ymin:-1, ymax:1 });
  function m(){ return { r:S.r, c:S.c, T:S.T, b:S.b }; }
  function mi(){ return { r:Math.round(S.r), c:Math.round(S.c), T:S.T, b:S.b }; }

  // ----- controls -----
  var modeR = radios($("#lab-mode"), { aria:"Mode", cls:"seg", options:[{ id:"ride", t:U.modes[0] }, { id:"rates", t:U.modes[1] }], value:S.mode, onChange:function(v){ if (V.busy) { modeR.set(S.mode); return; } userAct(); S.mode = v; stopPlay(); save(); paintAll(); } });
  var slW = MV.sliders($("#lab-sw"), [
    { id:"r", label:"Radius " + M("r") + " (the amplitude)", param:"a", min:4, max:20, step:1, value:S.r, fmt:function(v){ return Math.round(v) + " m"; } },
    { id:"c", label:"Axle height " + M("c"), param:"c", min:S.r, max:35, step:1, value:S.c, fmt:function(v){ return Math.round(v) + " m"; } },
    { id:"T", label:"Time per turn " + M("T"), param:"k", min:20, max:120, step:2, value:S.T, fmt:function(v){ return v + " s · k = π/" + (v / 2); } }
  ], onWheel);
  var boardR = radios($("#lab-board"), { label:"Boarding point", cls:"chips", options:U.boards.map(function(t, i){ return { id:String(i), t:t }; }), value:String(S.b), onChange:function(v){ if (V.busy || S.lock === "tc2") { boardR.set(String(S.b)); return; } userAct(); S.b = +v; S.rows = []; save(); paintAll(); } });
  var slT = MV.sliders($("#lab-st"), [{ id:"t", label:"Time " + M("t"), min:0, max:2 * S.T, step:1, value:S.t, fmt:function(v){ return num(v, 0) + " s"; } }], function(id, v){ if (V.busy) { slT.set("t", S.t); return; } stopPlay(); userAct(); S.t = v; save(); paintAll(); });
  var slR = MV.sliders($("#lab-sr"), [
    { id:"t1", label:M("t_1"), min:0, max:2 * S.T - 10, step:1, value:S.t1, fmt:function(v){ return num(v, 2) + " s"; } },
    { id:"t2", label:M("t_2"), min:0, max:2 * S.T, step:1, value:S.t2, fmt:function(v){ return num(v, 2) + " s"; } }], onRates);
  ["t", "t1", "t2"].forEach(function(id){ var i = $("#sl-" + id), o = $("#sl-" + id + "-out"); if (i) i.style.accentColor = "var(--ink)"; if (o) o.style.color = "var(--ink)"; });

  function onWheel(id, v){
    if (V.busy || S.lock === "tc2") { syncSliders(); return; }
    userAct(); stopPlay();
    S[id] = v;
    if (id === "r") { if (S.c < S.r) { S.c = S.r; V.note = true; } else V.note = false; }
    if (id === "c") V.note = false;
    if (id === "T") { S.t = Math.min(S.t, 2 * S.T); S.t1 = Math.min(S.t1, 2 * S.T - 10); S.t2 = Math.min(S.t2, 2 * S.T); if (S.t2 === S.t1) S.t2 = S.t1 + 10; }
    S.rows = [];
    if (id !== "T") zoomTo(win(S.r, S.c));
    save(); paintAll();
  }
  function onRates(id, v){
    if (V.busy) { syncSliders(); return; }
    userAct();
    if (id === "t1") { S.t1 = v; if (S.lock === "tc2") S.t2 = v + 10; else if (Math.abs(S.t2 - S.t1) < 1e-9) S.t2 = S.t1 + 1 <= 2 * S.T ? S.t1 + 1 : S.t1 - 1; }
    else { if (S.lock === "tc2") { syncSliders(); return; } var prev = S.t2; if (Math.abs(v - S.t1) < 1e-9) v = clamp(v + (v >= prev ? 1 : -1), 0, 2 * S.T); if (Math.abs(v - S.t1) < 1e-9) v = S.t1 + (S.t1 < 2 * S.T ? 1 : -1); S.t2 = v; }
    S.rows = []; save(); paintAll();
  }
  function syncSliders(){
    var cIn = $("#sl-c"); if (cIn) cIn.min = Math.round(S.r);
    slW.set("r", Math.round(S.r)); slW.set("c", Math.round(S.c)); slW.set("T", S.T);
    var tIn = $("#sl-t"); if (tIn) tIn.max = 2 * S.T; slT.set("t", S.t);
    var a = $("#sl-t1"), b = $("#sl-t2"); if (a) a.max = 2 * S.T - 10; if (b) b.max = 2 * S.T; slR.set("t1", S.t1); slR.set("t2", S.t2);
  }
  function zoomTo(y){
    if (V.zoom) V.zoom(); var y0 = V.ymax;
    if (y0 === y) return;
    V.zoom = MV.tween({ dur:300, step:function(x){ V.ymax = y0 + (y - y0) * x; render(); }, done:function(){ V.ymax = y; V.zoom = null; render(); } });
  }
  function userAct(){ V.ov = {}; V.ghost = null; V.flashK = false; }
  function save(){ api.save(); }

  // ----- Play / Step -----
  function playing(){ return !!V.play; }
  function stopPlay(){ if (!V.play) return; cancelAnimationFrame(V.play.raf); V.play = null; S.t = Math.round(S.t); save(); paintAll(); }
  function startPlay(){
    if (S.t >= 2 * S.T - 1e-9) S.t = 0;
    var last = null;
    V.play = { raf:0 };
    function f(now){
      if (!V.play) return;
      if (last != null) S.t = Math.min(2 * S.T, S.t + (now - last) / 1000 * S.T / 6);
      last = now; render(); paintRead(); slT.set("t", S.t);
      if (S.t >= 2 * S.T) { V.play = null; S.t = 2 * S.T; save(); paintAll(); return; }
      V.play.raf = requestAnimationFrame(f);
    }
    V.play.raf = requestAnimationFrame(f); paintCtrl();
  }
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && V.play) stopPlay(); });

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "lab-m1" || b.id === "lab-p1") { if (V.busy) return; stopPlay(); userAct(); S.t = clamp(Math.round(S.t) + (b.id === "lab-p1" ? 1 : -1), 0, 2 * S.T); save(); paintAll(); return; }
    if (b.id === "lab-play") {
      if (V.busy) return;
      if (MV.reduceMotion) { userAct(); S.t = S.t >= 2 * S.T ? 0 : Math.min(2 * S.T, Math.round(S.t) + Math.max(1, Math.round(S.T / 12))); save(); paintAll(); return; }
      if (playing()) stopPlay(); else { userAct(); startPlay(); }
      return;
    }
    if (b.id === "lab-shrink") { if (V.busy || S.lock === "tc2" || S.rows.length >= DTS.length) return; userAct(); var dt = DTS[S.rows.length]; S.t2 = S.t1 + dt; S.rows.push({ dt:dt, s:(Hm(m(), S.t2) - Hm(m(), S.t1)) / dt }); save(); paintAll(); return; }
    if (b.id === "lab-reset") { if (V.busy || S.lock === "tc2") return; userAct(); S.t2 = Math.min(S.t1 + 10, 2 * S.T); S.rows = []; save(); paintAll(); return; }
    if (b.dataset.tog) { var key = b.dataset.tog; S[key] = !S[key]; save(); paintAll(); return; }
    if (b.id === "lab-unlock") { S.lock = null; save(); paintAll(); }
  });

  // ----- drag handles for t1 and t2 (Rates mode), on both layouts -----
  function handles(){
    if (S.mode !== "rates") return [];
    var mm = m(), out = [{ id:"t1", x:S.t1, y:Hm(mm, S.t1), label:"t1 = " + num(S.t1, 2) + " seconds, height " + num(Hm(mm, S.t1), 1) + " metres. Arrow keys move it 1 second; Shift + arrow, 5 seconds." }];
    if (S.lock !== "tc2") out.push({ id:"t2", x:S.t2, y:Hm(mm, S.t2), label:"t2 = " + num(S.t2, 2) + " seconds, height " + num(Hm(mm, S.t2), 1) + " metres. Arrow keys move it 1 second; Shift + arrow, 5 seconds." });
    return out;
  }
  function moveH(id, x){
    if (V.busy) return;
    var v = Math.round(x);
    if (id === "t1") { v = clamp(v, 0, 2 * S.T - 10); if (v === S.t1) return; onRates("t1", v); }
    else { v = clamp(v, 0, 2 * S.T); if (v === S.t2) return; onRates("t2", v); }
    syncSliders();
  }
  [wg.p1, wg.pg].forEach(function(p){ MV.drag(p, { handles:handles, move:function(id, x){ moveH(id, x); }, axis:"x", step:{ x:1, y:1 }, big:5 }); });

  // ----- scene, caption, readout -----
  function scene(){
    var rates = S.mode === "rates", mm = m(), O = V.ov;
    var s = { r:S.r, c:S.c, T:S.T, b:S.b, ymax:V.ymax, tmax:2 * S.T, t:rates ? S.t2 : S.t,
      curve:{ to:rates ? null : S.t }, axisLine:true, periodBr:1, brackets:S.br ? { r:1, c:1 } : null,
      lab:{ r:"r = " + Math.round(S.r) + " m", c:"c = " + Math.round(S.c) + " m", T:"T = " + S.T + " s", axis:"axis h = " + Math.round(S.c) + " (axle height)" },
      also:!rates && S.also ? dTop(S.T, S.b) : null, hline:!rates && S.line, dot:!rates, ghostW:V.ghost, flash:O.flash || 0,
      level:O.level || null, secs:O.secs, arcs:O.arcs, probe:O.probe };
    if (rates) {
      s.rates = { t1:S.t1, t2:S.t2, arrow:S.arrow, ghost:true };
      if (S.rows.length >= DTS.length) { s.rates.slope = S.rows[DTS.length - 1].s; s.rates.tangent = "slope ≈ " + num(S.rows[DTS.length - 1].s, 3); }
    }
    var h = Hm(mm, s.t), w = where(mi(), s.t);
    s.describe = "Ferris wheel, radius " + Math.round(S.r) + " metres, axle " + Math.round(S.c) + " metres, one turn every " + S.T + " seconds. " +
      (rates ? "Secant on the height graph from t1 = " + num(S.t1, 2) + " to t2 = " + num(S.t2, 2) + " seconds, average rate " + num((Hm(mm, S.t2) - Hm(mm, S.t1)) / (S.t2 - S.t1), 2) + " metres per second. "
        : "At " + num(S.t, 1) + " seconds the rider is " + num(h, 1) + " metres high, " + (w === "top" ? "at the top" : w === "bottom" ? "at the bottom" : "going " + w) + ". ") +
      "Graph of " + spoken(mi()) + ", from 0 to " + 2 * S.T + " seconds." + (O.level ? " A dashed line marks " + O.level.label + "." : "");
    return s;
  }
  function render(){
    wg.set(scene());
    var on = S.mode === "rates" && S.rg; $("#lab-rate-w").hidden = !on; if (on) drawRate();
  }
  function drawRate(){
    var L = wg.last(), mm = m(); if (!L) return;
    var sp = speed(mm), ym = Math.max(0.5, sp * 1.2);
    rp.draw({ view:{ xmin:-L.gL / L.ux, xmax:(L.W - L.gL) / L.ux, ymin:-ym, ymax:ym }, grid:false, axes:false, ticks:false,
      describe:"Rate of climb, estimated with 0.01-second secants, from 0 to " + 2 * S.T + " seconds. It swings between about " + num(-sp, 2) + " and " + num(sp, 2) + " metres per second, and is 0 at every top and bottom. The dot marks t1.",
      after:function(ctx, p){
        var k = KC(), X = function(t){ return p.X(t); }, Yv = function(v){ return p.Y(v); };
        ln(ctx, L.gL, Yv(0), L.gR, Yv(0), k.axis, 1.2); ln(ctx, L.gL, 4, L.gL, p.H - 4, k.axis, 1.2);
        tx(ctx, k, "rate of climb (m/s)", L.gL + 6, 10, { font:"12px " + k.ui, color:k.ink2 });
        tx(ctx, k, "0", L.gL - 5, Yv(0), { font:"12px " + k.ui, color:k.ink2, align:"right" });
        tx(ctx, k, num(sp, 2), L.gL - 5, Yv(sp), { font:"12px " + k.ui, color:k.ink2, align:"right" }); tx(ctx, k, num(-sp, 2), L.gL - 5, Yv(-sp), { font:"12px " + k.ui, color:k.ink2, align:"right" });
        ctx.save(); ctx.strokeStyle = k.ink2; ctx.lineWidth = 2; ctx.beginPath();
        for (var i = 0; i <= 300; i++) { var t = 2 * S.T * i / 300, v = (Hm(mm, t + 0.01) - Hm(mm, t)) / 0.01; if (i) ctx.lineTo(X(t), Yv(v)); else ctx.moveTo(X(t), Yv(v)); }
        ctx.stroke(); ctx.restore();
        var v1 = (Hm(mm, S.t1 + 0.01) - Hm(mm, S.t1)) / 0.01; disc(ctx, X(S.t1), Yv(v1), 9, k.hi); disc(ctx, X(S.t1), Yv(v1), 5, k.ink, k.sheet, 1.5);
      } });
  }
  function paintCap(){ $("#lab-cap").innerHTML = M(modelSrc(mi())) + (V.flashK ? ' <span class="lab-unch">' + M("@k{π/30}") + " unchanged</span>" : ""); }
  function avgHTML(mm, t1, t2){
    var h1 = Hm(mm, t1), h2 = Hm(mm, t2), dt = t2 - t1, rate = (h2 - h1) / dt, E1 = exH(mm, t1), E2 = exH(mm, t2), src, amt;
    if (E1 && E2 && (!E1.B || !E2.B || E1.q === E2.q)) {
      var q = E1.B ? E1.q : E2.q, dA = E2.A - E1.A, dB = E2.B - E1.B, idt = Math.round(dt);
      if (!dB) { var R0 = ratTxt(dA, 2 * idt); src = "(" + exSrc(E2) + " - " + exSrc(E1) + ")/(" + nsrc(t2) + " - " + nsrc(t1) + ") = " + nsrc(dA / 2) + "/" + nsrc(dt) + " = " + R0.src; amt = R0.dec ? nsrc(Math.abs(rate)) : (R0.frac || "").replace("-", ""); }
      else { src = "[h(" + nsrc(t2) + ") - h(" + nsrc(t1) + ")]/(" + nsrc(t2) + " - " + nsrc(t1) + ") = (" + exSrc({ A:dA, B:dB, q:q }) + ")/" + nsrc(dt) + " ≈ " + nsrc(Math.round(rate * 100) / 100); amt = "about " + num(Math.abs(rate), 2); }
    } else {
      var dp = Math.abs(dt) < 0.05 ? 4 : Math.abs(dt) < 1 ? 3 : 2;
      src = "(" + nsrc(Math.round(h2 * Math.pow(10, dp)) / Math.pow(10, dp)) + " - " + nsrc(Math.round(h1 * Math.pow(10, dp)) / Math.pow(10, dp)) + ")/(" + nsrc(t2) + " - " + nsrc(t1) + ") ≈ " + nsrc(Math.round(rate * 100) / 100);
      amt = "about " + num(Math.abs(rate), 2);
    }
    var words = Math.abs(rate) < 1e-9 ? "no net change in her height." : "on average the rider " + (rate > 0 ? "rises " : "falls ") + amt + " m each second.";
    return M(src) + " m/s: " + words;
  }
  function turnTxt(t){
    if (!isInt(t)) return M("t ≈ " + num(t, 1)) + " s";
    var g = gcd(t, S.T), n = t / g, d = S.T / g, w = Math.floor(n / d), rem = n - w * d, part;
    if (!n) part = "no turning yet";
    else if (!rem) part = w + (w === 1 ? " turn" : " turns") + " so far";
    else part = (w ? w + (w === 1 ? " turn" : " turns") + " and " + M(rem + "/" + d) : M(rem + "/" + d) + " of a turn") + " so far";
    return M("t = " + t) + " s: " + part + " (the wheel has turned " + M(piS(2 * t, S.T)) + ").";
  }
  function heightRow(mm, t){
    if (!isInt(t)) return hEq(mm, t);
    var F = FORM[mm.b], v = hVal(mm, t);
    return M("h(" + t + ") = " + (F.s < 0 ? "-" : "") + mm.r + " " + F.fn + "(" + piS(2 * t, mm.T) + ") + " + mm.c + (v != null ? " = " + v : " ≈ " + num(Hm(mm, t), 1))) + " m";
  }
  function row(l, v, cls){ return '<div' + (cls ? ' class="' + cls + '"' : "") + "><dt>" + l + "</dt><dd>" + v + "</dd></div>"; }
  function paintRead(){
    var mm = mi(), r = mm.r, c = mm.c, h = "";
    if (S.mode === "ride") {
      var w = where(mm, S.t);
      h += row("Model", M(modelSrc(mm)) + (S.also ? '<br><span class="tiny">Also correct:</span> ' + M(alsoSrc(mm)) + (dTop(S.T, S.b) ? "" : " (" + M("@d{d} = 0") + ")") : ""));
      h += row("Amplitude", r + " m: the radius. The rider goes " + r + " m above and below the axle.");
      h += row("Axis", M("h = " + c) + ": the axle is " + c + " m above the ground.");
      h += row("Highest and lowest", (c + r) + " m at the top; " + (c === r ? "0 m: the lowest seat touches the ground." : (c - r) + " m at the lowest seat."));
      h += row("Period", S.T + " s per turn, so " + M("k = 2π/" + S.T + " = π/" + S.T / 2) + " (radians per second).");
      h += row("Time", turnTxt(S.t));
      h += row("Height", heightRow(mm, S.t), "lab-hrow");
      h += row("Moving", w === "up" ? "Going up" : w === "down" ? "Going down" : w === "top" ? "At the top: for an instant, not rising or falling" : "At the bottom: for an instant, not rising or falling");
    } else {
      var dt = S.t2 - S.t1, sp = speed(mm), n = S.rows.length;
      h += row("Interval", "From " + M("t_1") + " = " + num(S.t1, 2) + " s to " + M("t_2") + " = " + num(S.t2, 2) + " s (" + M("Δt") + " = " + num(dt, 2) + " s)");
      h += row("Heights", hEq(mm, S.t1, Math.abs(dt) < 1 ? 4 : 1) + ", " + hEq(mm, S.t2, Math.abs(dt) < 1 ? 4 : 1), "lab-hrow");
      h += row("Average rate of change", avgHTML(mm, S.t1, S.t2));
      h += row("Shrinking table", n ? MV.tableHTML({ head:[M("Δt") + " (s)"].concat(S.rows.map(function(x){ return num(x.dt, 2); })), rows:[["slope (m/s)"].concat(S.rows.map(function(x){ return x.s.toFixed(4).replace("-", MINUS); }))], caption:"Secant slopes as the interval shrinks" })
        : '<span class="muted">Press <strong>Shrink toward ' + M("t_1") + "</strong> to add a row.</span>");
      if (n >= DTS.length) h += row("Instantaneous rate at " + M("t_1"), "≈ " + num(S.rows[n - 1].s, 3) + " m/s: the secant slopes settle here.");
      h += row("Rider’s speed along the rim", S.lock === "tc3" ? '<span class="muted">' + U.tc3Hidden + "</span>" : M("2π × " + r + " ÷ " + S.T + " = " + piS(2 * r, S.T) + " ≈ " + num(sp, 3)) + " m/s");
      if (n >= DTS.length) {
        var pc = Math.round(Math.abs(S.rows[n - 1].s) / sp * 100), up = S.rows[n - 1].s >= 0;
        h += row("Rate of climb vs speed", pc >= 100 ? "100%: she’s moving straight up (or down)." : pc <= 0 ? "0%: she’s moving sideways." : (up ? "Climbing" : "Falling") + " at about " + pc + "% of her speed: she’s moving partly sideways.");
      }
    }
    $("#lab-read").innerHTML = h;
  }
  function paintCtrl(){
    var rates = S.mode === "rates", L2 = S.lock === "tc2", L3 = S.lock === "tc3";
    modeR.set(S.mode); modeR.lock(V.busy || L2); modeR.off(L3 ? ["rates"] : []);
    boardR.set(String(S.b)); boardR.lock(V.busy || L2);
    ["r", "c", "T"].forEach(function(id){ var i = $("#sl-" + id); if (i) i.disabled = V.busy || L2; });
    var t2i = $("#sl-t2"); if (t2i) t2i.disabled = V.busy || L2; var t1i = $("#sl-t1"); if (t1i) t1i.disabled = V.busy; var ti = $("#sl-t"); if (ti) ti.disabled = V.busy;
    $("#lab-gt").hidden = rates; $("#lab-gr").hidden = !rates;
    $("#lab-shrink").disabled = V.busy || L2 || S.rows.length >= DTS.length; $("#lab-reset").disabled = V.busy || L2;
    $("#lab-m1").disabled = V.busy || S.t <= 0; $("#lab-p1").disabled = V.busy || S.t >= 2 * S.T;
    var pb = $("#lab-play"); pb.disabled = V.busy; pb.textContent = MV.reduceMotion ? "Step +" + Math.max(1, Math.round(S.T / 12)) + " s" : playing() ? "■ Stop" : "▶ Play";
    pb.setAttribute("aria-label", MV.reduceMotion ? "Step forward " + Math.max(1, Math.round(S.T / 12)) + " seconds" : playing() ? "Stop" : "Play two turns");
    $("#lab-speed").textContent = MV.reduceMotion ? "" : "One turn takes 6 s on screen (×" + num(S.T / 6, 1) + ")";
    var tg = rates ? [["arrow", "Speed arrow"], ["rg", "Rate graph"]] : [["br", "Brackets"], ["line", phone ? "Height markers" : "Height line"], ["also", "Also correct"]];
    MV.keepFocus($("#lab-tog"), function(){ $("#lab-tog").innerHTML = '<span class="rg-lab">Show</span>' + tg.map(function(x){ return '<button type="button" class="chip' + (S[x[0]] ? " on" : "") + '" aria-pressed="' + !!S[x[0]] + '" data-tog="' + x[0] + '" data-k="tog' + x[0] + '">' + x[1] + "</button>"; }).join(""); });
    var lk = $("#lab-lock"); lk.hidden = !S.lock;
    if (S.lock) lk.innerHTML = '<span class="tiny"><strong>' + U.locked + "</strong> " + (L2 ? "The wheel stays at " + M("r = 10") + ", " + M("c = 12") + ", " + M("T = 60") + ", Bottom, and " + M("t_2") + " follows " + M("t_1") + " + 10." : "Rates mode is off: reason it out.") + '</span> <button type="button" class="btn ghost sm" id="lab-unlock" data-k="labunlock">Unlock</button>';
    $("#lab-note").textContent = V.note ? U.raised : "";
  }
  function paintAll(){ syncSliders(); paintCtrl(); paintCap(); paintRead(); render(); MV.changed(); }
  function paintFast(){ syncSliders(); paintCap(); paintRead(); render(); }

  // ----- challenge set-up buttons (injected into the toolkit's challenge cards) -----
  function stopAnims(){ V.anims.forEach(function(c){ c(); }); V.anims = []; V.timers.forEach(clearTimeout); V.timers = []; if (V.play) { cancelAnimationFrame(V.play.raf); V.play = null; } }
  function defaults(){ S.r = 10; S.c = 12; S.T = 60; S.b = 0; S.t = 0; S.rows = []; V.ymax = win(10, 12); V.note = false; userAct(); }
  function setup(id){
    if (V.busy) return;
    stopAnims(); defaults();
    if (id === "tc1") { S.lock = null; S.mode = "ride"; }
    if (id === "tc2") { S.lock = "tc2"; S.mode = "rates"; S.t1 = 0; S.t2 = 10; }
    if (id === "tc3") { S.lock = "tc3"; S.mode = "ride"; }
    save(); paintAll(); MV.banner("", "Challenge " + id.slice(2) + " is set up.");
    var g = $(".lab-graph"), rr = g.getBoundingClientRect(); if (rr.top < 60 || rr.top > window.innerHeight * 0.5) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  }
  var chalHost = $("#chal");
  function inject(){
    if (!chalHost) return;
    $$(".chal[data-c]", chalHost).forEach(function(box){
      var qa = box.querySelector(".q-actions"); if (!qa || qa.querySelector("[data-setup]")) return;
      var b = document.createElement("button"); b.type = "button"; b.className = "btn ghost sm"; b.dataset.setup = box.dataset.c; b.dataset.k = box.dataset.c + "setup"; b.textContent = U.setup;
      qa.insertBefore(b, qa.firstChild);
    });
  }
  if (chalHost) { new MutationObserver(inject).observe(chalHost, { childList:true, subtree:true }); chalHost.addEventListener("click", function(e){ var b = e.target.closest("[data-setup]"); if (b) setup(b.dataset.setup); }); setTimeout(inject, 0); }

  // ----- challenge tests -----
  function msgOf(id){ return ((C.challenges || []).filter(function(x){ return x.id === id; })[0] || {}).msgs || {}; }
  function uncounted(id, msg, live){ if (!live) Promise.resolve().then(function(){ var st = MV.S.chal[id]; if (st && st.tries > 0) { st.tries--; MV.save(); } }); return { ok:false, msg:msg }; }
  function met(id, live){ if (!live && S.lock === id) Promise.resolve().then(function(){ S.lock = null; save(); paintCtrl(); paintRead(); }); return { ok:true }; }
  function challenge(id, opt){
    var live = opt && opt.live, g = msgOf(id), r = Math.round(S.r), c = Math.round(S.c), T = S.T;
    if (V.busy) return { ok:false, msg:"Wait for the animation to finish." };
    if (id === "tc1") {
      if (r !== 9) return { ok:false, msg:r === 18 ? g.r18 : g.r };
      if (c !== 12) return { ok:false, msg:c === 9 ? g.c9 : c === 21 ? g.c21 : g.c.replace("{v}", c - 9) };
      if (T !== 40) return { ok:false, msg:T === 90 ? g.T90 : T === 60 ? g.T60 : g.T };
      if (S.b !== 0) return { ok:false, msg:g.b };
      return met(id, live);
    }
    if (id === "tc2") {
      if (!(r === 10 && c === 12 && T === 60 && S.b === 0 && S.mode === "rates" && Math.abs(S.t2 - S.t1 - 10) < 1e-9)) return uncounted(id, g.setup, live);
      var t1 = S.t1, avg = (Hm(m(), t1 + 10) - Hm(m(), t1)) / 10;
      if (Math.abs(avg - 1) < 1e-9) return met(id, live);
      if (t1 === 40 || t1 === 100) return { ok:false, msg:g.down };
      if (t1 === 25 || t1 === 85) return { ok:false, msg:g.top };
      if (t1 === 15 || t1 === 75) return { ok:false, msg:g.start };
      if (t1 === 0 || t1 === 60) return { ok:false, msg:g.low };
      var E1 = exH(m(), t1), E2 = exH(m(), t1 + 10), v = (E1 && E2 && E1.B === 0 && E2.B === 0) ? ratTxt(E2.A - E1.A, 20).src : "about " + num(avg, 2);
      return { ok:false, msg:g.other.replace("{v}", v.replace(/-/g, MINUS)) };
    }
    if (id === "tc3") {
      if (c + r !== 30 || c - r !== 2) return { ok:false, msg:g.ends.replace("{v}", c + r).replace("{w}", num(c - r)) };
      if (T === 56) return met(id, live);
      if (T === 36) return { ok:false, msg:g.T36 };
      if (T === 112) return { ok:false, msg:g.T112 };
      return { ok:false, msg:g.T.replace("{v}", T).replace("{w}", M(piS(28, T)) + " ≈ " + num(28 * PI / T, 2)) };
    }
    return { ok:false };
  }

  // ----- predictions -----
  function tw(o){ var c = MV.tween(o); V.anims.push(c); return c; }
  function later(ms, fn){ V.timers.push(MV.wait(ms, fn)); }
  function pstart(p){
    stopAnims(); V.busy = false; userAct();
    var st = p.start; S.lock = null; S.mode = st.mode; S.r = st.r; S.c = st.c; S.T = st.T; S.b = st.b; S.rows = [];
    if (st.t != null) S.t = st.t; if (st.t1 != null) { S.t1 = st.t1; S.t2 = st.t2; }
    V.ymax = win(S.r, S.c); V.note = false;
    if (st.camera) V.ov.level = { h:17, label:U.camera, marks:[] };
    save(); paintAll();
  }
  function prun(p, done){
    V.busy = true; paintCtrl();
    var fin = function(){ V.busy = false; save(); paintAll(); done(); };
    if (p.id === "p1") {
      V.ghost = { r:10, c:12 };
      tw({ dur:1800, step:function(x){ S.r = 10 + 5 * x; S.c = 2 + S.r; V.ymax = 25 + 10 * x; paintFast(); }, done:function(){ S.r = 15; S.c = 17; V.ymax = 35; V.flashK = true; paintFast(); later(1800, fin); } });
    } else if (p.id === "p2") {
      V.ov = { secs:[], arcs:[] };
      var ints = [[0, 10], [10, 20], [20, 30]];
      (function step(i){
        if (i >= ints.length) { V.ov.probe = null; return fin(); }
        var a = ints[i][0], b = ints[i][1]; S.t1 = a; S.t2 = a + 0.5;
        tw({ dur:1400, ease:LIN, step:function(x){ S.t2 = a + 0.5 + (b - a - 0.5) * x; V.ov.probe = S.t2; paintFast(); }, done:function(){
          S.t2 = b; V.ov.probe = null; var mm = m(), rise = Hm(mm, b) - Hm(mm, a);
          V.ov.secs.push({ a:a, b:b, label:num(rise / (b - a), 1) + " m/s" }); V.ov.arcs.push({ a:a, b:b, label:num(rise, 0) + " m" });
          paintFast(); later(600, function(){ step(i + 1); }); } });
      })(0);
    } else if (p.id === "p3") {
      tw({ dur:2600, step:function(x){ S.t2 = 10 + 50 * x; paintFast(); }, done:function(){ S.t2 = 60; paintFast(); later(300, fin); } });
    } else if (p.id === "p4") {
      var L = V.ov.level || (V.ov.level = { h:17, label:U.camera, marks:[] });
      tw({ dur:1100, ease:LIN, step:function(x){ L.pulse = Math.abs(Math.sin(PI * 2 * x)); render(); }, done:function(){
        L.pulse = 0;
        tw({ dur:6000, ease:LIN, step:function(x){ S.t = 60 * x; [20, 40].forEach(function(tc){ if (S.t >= tc && L.marks.indexOf(tc) < 0) L.marks.push(tc); }); var dd = Math.min(Math.abs(S.t - 20), Math.abs(S.t - 40)); V.ov.flash = dd < 2.5 ? 1 - dd / 2.5 : 0; paintFast(); },
          done:function(){ S.t = 60; V.ov.flash = 0; L.fill = true; L.fillLabel = "above 17 m for 20 s: one-third of the turn"; paintFast(); later(500, fin); } });
      } });
    } else fin();
  }

  if (S.lock === "tc2") { S.mode = "rates"; }
  paintAll();
  return { predict:{ start:pstart, run:prun }, challenge:challenge };
}

// ---------- Part 3: Real data (tides and daylight) ----------
var FULLM = ["March 21", "April 21", "May 21", "June 21", "July 21", "August 21", "September 21", "October 21", "November 21", "December 21", "January 21", "February 21", "March 21"];
var MODELS = { tide:function(t){ return 4 * Math.cos(PI / 6 * (t - 2)) + 5; }, day:function(t){ return 4 * Math.cos(PI / 6 * (t - 3)) + 12; } };
var VIEWS = { tide:{ xmin:-1.6, xmax:25.2, ymin:-1.4, ymax:11.8 }, day:{ xmin:-0.9, xmax:12.7, ymin:-1.8, ymax:20.8 } };
function part3(host, api){
  var C = api.content, SETS = C.sets;
  var S = def(api.S, { ds:"tide", sets:{}, use:{} });
  ["tide", "day"].forEach(function(k){ S.sets[k] = def(S.sets[k] || {}, { step:0, st:[{}, {}, {}, {}], c:"", a:"", T:"", k:null, d:"", form:"cos", taps:[], fit:null, over:false }); });
  ["u1", "u2", "u3"].forEach(function(k){ S.use[k] = def(S.use[k] || {}, { v:k === "u1" ? ["", "", "", ""] : "", tries:0, solved:false, first:null }); });
  var V = { sweep:1, fb:{}, ufb:{}, busy:false, bar:null, real:0, realBusy:false };
  host.innerHTML = '<div id="dt-set" class="dt-set"></div><div class="refresh dt-story" id="dt-story"></div><div id="dt-table"></div>' +
    '<div class="sym dt-main"><div><div class="plot-wrap"><canvas class="plot" id="dt-plot" role="img" aria-label="Scatter plot of the data"></canvas></div>' +
      '<div class="dt-pts" id="dt-pts" role="group" aria-label="Data points (choose two for the period, or one maximum for the phase shift)"></div><div id="dt-bars"></div></div>' +
    '<div class="dt-card" id="dt-card" aria-live="polite"></div></div>' +
    '<details class="alg" id="dt-alg"><summary>Check it with algebra</summary><div id="dt-alg-lines" class="dt-alg-lines"></div><div id="dt-player"></div></details>' +
    '<div class="part" id="dt-use"></div>' +
    '<details class="alg" id="dt-real"><summary>' + C.reality.title + '</summary><p class="tiny" style="margin:10px 0 0">' + C.reality.text + '</p><div class="q-actions"><button type="button" class="btn sm" id="dt-run" data-k="dtrun">' + C.reality.btn + '</button><span class="tiny" id="dt-drift" aria-live="polite"></span></div><canvas class="plot wide" id="dt-rplot" role="img" aria-label="Three days of tide: the 12-hour model and a 12.4-hour tide"></canvas></details>';
  var plot = new MV.Plot($("#dt-plot"), VIEWS.tide), rplot = new MV.Plot($("#dt-rplot"), { xmin:-2, xmax:79, ymin:-1, ymax:10.5 });
  var setR = radios($("#dt-set"), { aria:"Data set", cls:"seg", options:[{ id:"tide", t:SETS.tide.label }, { id:"day", t:SETS.day.label }], value:S.ds, onChange:function(v){ S.ds = v; api.save(); paintAll(); } });
  function B(){ return S.sets[S.ds]; }
  function D(){ return SETS[S.ds]; }
  function tLab(ds, t){ return ds === "tide" ? (t % 24) + ":00" : SETS.day.dates[t]; }
  function val1(raw){ var r = MV.parseNum(raw); return r && r.length === 1 ? r[0] : null; }
  function stepAns(i){ var st = D().steps; if (i < 3) return MV.ans(st[i]); return MV.ans(S.ds === "day" && B().form === "sin" ? st[4] : st[3]); }
  function guideVal(i, field){ var b = B(); return b.st[i].solved ? stepAns(i) : val1(b[field]); }

  // ----- plot -----
  plot.render = function(){
    var ds = S.ds, b = B(), d = D(), k = KC(), view = VIEWS[ds], f = MODELS[ds];
    var sc = { view:view, xTicks:{ step:ds === "tide" ? 2 : 1 }, yTicks:{ step:ds === "tide" ? 1 : 2 }, xLabel:"t (" + d.tUnit + ")", yLabel:ds === "tide" ? "depth (m)" : "daylight (h)",
      curves:[], segments:[], points:[], labels:[], bands:[], data:[] };
    var desc = (ds === "tide" ? "Tide depths every hour from midnight to midnight." : "Hours of daylight on the 21st of each month from March 21.");
    var cV = guideVal(0, "c"), aV = b.step >= 1 ? guideVal(1, "a") : null, TV = b.step >= 2 ? guideVal(2, "T") : null, dV = b.step >= 3 ? (b.step > 3 ? stepAns(3) : val1(b.d)) : null;
    if (ds === "tide" && S.use.u1.solved) { sc.bands.push({ x0:6, x1:10 }, { x0:18, x1:22 }); desc += " The closed times, 6 to 10 and 18 to 22, are shaded."; }
    if (ds === "tide" && b.over) { sc.segments.push({ x1:view.xmin, y1:3, x2:view.xmax, y2:3, color:k.ink, width:1.8, dash:[8, 6] }); sc.labels.push({ x:view.xmax - 0.2, y:3, text:"3 m: the ferry’s depth", align:"right", dy:-12, bg:true, font:"600 13px " + k.ui }); }
    if (b.over) {
      var x1 = view.xmin + (view.xmax - view.xmin) * V.sweep;
      sc.curves.push({ f:f, color:k.pen, width:3, domain:[view.xmin, x1] });
      if (V.sweep >= 1) d.data.forEach(function(y, t){ sc.segments.push({ x1:t, y1:y, x2:t, y2:f(t), color:k.ink2, width:1.5 }); });
      desc += " Model curve " + MV.plain(d.model) + " drawn over the data.";
    }
    if (cV != null) { sc.segments.push({ x1:view.xmin, y1:cV, x2:view.xmax, y2:cV, color:k.c, width:2, dash:[7, 5] }); sc.labels.push({ x:view.xmax - 0.2, y:cV, text:"c = " + num(cV, 2), color:k.c, align:"right", dy:-12, bg:true, font:"600 13px " + k.ui }); desc += " Axis guide at " + num(cV, 2) + "."; }
    var cc = b.st[0].solved ? stepAns(0) : null;
    if (aV != null && cc != null) {
      var tMax = ds === "tide" ? 2 : 3, tMin = ds === "tide" ? 8 : 9;
      sc.segments.push({ x1:tMax + 0.35, y1:cc, x2:tMax + 0.35, y2:cc + aV, color:k.a, width:2.5, arrow:"both" }, { x1:tMin + 0.35, y1:cc, x2:tMin + 0.35, y2:cc - aV, color:k.a, width:2.5, arrow:"both" });
      sc.labels.push({ x:tMax + 0.6, y:cc + aV / 2, text:"a = " + num(aV, 2), color:k.a, bg:true, font:"600 13px " + k.ui }, { x:tMin + 0.6, y:cc - aV / 2, text:"a = " + num(aV, 2), color:k.a, bg:true, font:"600 13px " + k.ui });
    }
    if (TV != null && TV > 0) {
      var t0 = b.taps.length === 2 ? Math.min(b.taps[0], b.taps[1]) : (ds === "tide" ? 2 : 0), yb = view.ymax - (ds === "tide" ? 0.7 : 1.2);
      sc.segments.push({ x1:t0, y1:yb, x2:t0 + TV, y2:yb, color:k.k, width:2.5, arrow:"both" });
      sc.labels.push({ x:t0 + TV / 2, y:yb, text:"T = " + num(TV, 2) + " " + (ds === "tide" ? "h" : "months"), color:k.k, align:"center", dy:-12, bg:true, font:"600 13px " + k.ui });
    }
    if (dV != null && Math.abs(dV) > 1e-9) { var y0 = view.ymin * 0.45; sc.segments.push({ x1:0, y1:y0, x2:clamp(dV, view.xmin, view.xmax), y2:y0, color:k.d, width:2.5, arrow:true }); sc.labels.push({ x:clamp(dV / 2, view.xmin + 1, view.xmax - 1), y:y0, text:"d = " + num(dV, 2), color:k.d, align:"center", dy:-12, bg:true, font:"600 13px " + k.ui }); }
    d.data.forEach(function(y, t){ var tap = b.taps.indexOf(t) >= 0 && b.step === 2; sc.points.push({ x:t, y:y, r:tap ? 6 : 4.2, color:k.ink, ring:tap }); });
    sc.describe = desc;
    plot.draw(sc);
  };
  $("#dt-plot").addEventListener("click", function(e){
    var b = B(); if (b.step !== 2 && b.step !== 3) return;
    var r = $("#dt-plot").getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, best = -1, bd = 24;
    D().data.forEach(function(y, t){ var dd = Math.hypot(plot.X(t) - px, plot.Y(y) - py); if (dd < bd) { bd = dd; best = t; } });
    if (best >= 0) tapPoint(best);
  });
  $("#dt-pts").addEventListener("click", function(e){ var bt = e.target.closest("[data-pt]"); if (bt && !bt.disabled) tapPoint(+bt.dataset.pt); });
  function tapPoint(t){
    var b = B();
    if (b.step === 2) { if (b.taps.length >= 2) b.taps = []; b.taps.push(t); if (b.taps.length === 2) b.T = String(Math.abs(b.taps[1] - b.taps[0])); }
    else if (b.step === 3) b.d = String(t);
    V.fb[S.ds] = null; api.save(); paintCard(); paintPts(); plot.render();
  }
  function paintPts(){
    var b = B(), on = b.step === 2 || b.step === 3, ds = S.ds;
    MV.keepFocus($("#dt-pts"), function(){ $("#dt-pts").innerHTML = D().data.map(function(y, t){ return '<button type="button" class="chip" data-pt="' + t + '" data-k="pt' + t + '" aria-pressed="' + (b.step === 2 && b.taps.indexOf(t) >= 0) + '"' + (on ? "" : " disabled") + ">" + tLab(ds, t) + ", " + y.toFixed(1) + " " + D().unit + "</button>"; }).join(""); });
  }

  // ----- builder card -----
  function stepDone(i){
    var b = B(), d = D(), unit = S.ds === "tide" ? "h" : "months";
    if (i === 0) return M("c = " + stepAns(0));
    if (i === 1) return M("a = " + stepAns(1));
    if (i === 2) return M("T = 12") + " " + unit + ", so " + M("k = {π}/{6}");
    var dv = val1(b.d); return (S.ds === "day" && b.form === "sin" ? "sine form, " : "") + M("d = " + nsrc(dv == null ? stepAns(3) : dv));
  }
  function paintCard(){
    var b = B(), d = D(), names = C.stepNames, h = '<h3 class="dt-h">Build ' + M(d.fn + "(t)") + "</h3>";
    for (var i = 0; i < 4; i++) {
      var st = b.st[i];
      if (st.solved) { h += '<p class="dt-done">✓ <strong>' + names[i] + ":</strong> " + stepDone(i) + (st.first ? "" : ' <span class="muted tiny">(not first try)</span>') + "</p>" + (i === b.step - 1 && V.fb[S.ds] ? V.fb[S.ds] : ""); continue; }
      if (i !== b.step) { h += '<p class="dt-later">' + names[i] + "</p>"; continue; }
      h += '<div class="dt-step"><p class="dt-sname"><strong>' + names[i] + "</strong></p>";
      if (i === 0 || i === 1) h += "<p>" + C.stepAsk[i] + "</p>" + box(i === 0 ? "c" : "a", i === 0 ? "c =" : "a =", d.unit);
      if (i === 2) {
        h += '<p class="tiny">' + d.periodHow + "</p>" + box("T", "T =", S.ds === "tide" ? "h" : "months") + (b.taps.length ? '<p class="tiny muted">Tapped: ' + b.taps.map(function(t){ return tLab(S.ds, t); }).join(" and ") + "</p>" : "");
        h += '<p class="dt-kask">' + C.kAsk + '</p><div class="dt-k" role="radiogroup" aria-label="k">' + C.kChips.map(function(ch, j){ return '<button type="button" class="fchip" role="radio" aria-checked="' + (b.k === j) + '" aria-pressed="' + (b.k === j) + '" data-kc="' + j + '" data-k="kc' + j + '">' + ch.t + "</button>"; }).join("") + "</div>";
      }
      if (i === 3) {
        if (S.ds === "day") h += '<div class="dt-form" id="dt-form"></div>';
        h += '<p class="tiny">' + d.phaseHow + "</p>" + box("d", "d =", S.ds === "tide" ? "h" : "months");
      }
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="dtcheck" data-k="dtcheck">Check</button></div>' + (V.fb[S.ds] ? V.fb[S.ds] : "") + "</div>";
    }
    if (b.step >= 4) {
      h += '<div class="dt-fit"><p><strong>' + C.fitAsk + "</strong></p><div class=\"dt-fitc\" role=\"radiogroup\" aria-label=\"Predict your fit\">" + C.fitChips.map(function(t, j){ return '<button type="button" class="chip' + (b.fit === j ? " on" : "") + '" role="radio" aria-checked="' + (b.fit === j) + '" data-fit="' + j + '" data-k="fit' + j + '"' + (b.over ? " disabled" : "") + ">" + t + "</button>"; }).join("") + "</div>";
      if (!b.over) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="overlay" data-k="dtover"' + (b.fit == null ? " disabled" : "") + ">" + C.fitBtn + "</button></div>";
      else if (V.sweep >= 1) h += '<div class="fb good" role="status"><p>' + readout() + "</p></div>";
      h += "</div>";
    }
    MV.keepFocus($("#dt-card"), function(){ $("#dt-card").innerHTML = h; });
    if (b.step === 3 && S.ds === "day") radios($("#dt-form"), { aria:"Form", cls:"seg", options:[{ id:"cos", t:C.cosForm }, { id:"sin", t:C.sineForm }], value:b.form, onChange:function(v){ b.form = v; b.d = ""; V.fb.day = null; api.save(); paintCard(); plot.render(); } });
  }
  function box(field, lab, unit){ return '<div class="numrow"><label for="dt-in-' + field + '">' + M(lab) + '</label><input class="numin short" id="dt-in-' + field + '" data-in="' + field + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(B()[field]) + '"><span class="tiny">' + unit + "</span></div>"; }
  function gaps(){
    var ds = S.ds, d = D(), f = MODELS[ds], mx = 0, at = [];
    d.data.forEach(function(y, t){ var g = Math.round(Math.abs(y - f(t)) * 100) / 100; if (g > mx + 1e-9) { mx = g; at = [t]; } else if (Math.abs(g - mx) < 1e-9) at.push(t); });
    var wh = at.map(function(t){ return ds === "tide" ? t + ":00" : FULLM[t]; });
    return { gap:num(mx, 1), where:wh.length > 1 ? wh.slice(0, -1).join(", ") + " and " + wh[wh.length - 1] : wh[0] };
  }
  function readout(){ var g = gaps(), b = B(); return D().readout.replace("{gap}", g.gap).replace("{where}", g.where).replace("{pred}", b.fit != null ? C.fitChips[b.fit] : ""); }
  function fb(kind, html){ return MV.fbHTML(kind, (kind === "good" ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + html); }
  function check(){
    var b = B(), d = D(), i = b.step, st = b.st[i], ds = S.ds, field = ["c", "a", "T", "d"][i], v = val1(b[field]);
    if (v == null) { V.fb[ds] = MV.fbHTML("", "Enter a number first."); return paintCard(); }
    var good = false, msg = "", note = "";
    if (i < 2) { good = Math.abs(v - stepAns(i)) < 1e-6; if (!good) msg = named(d.steps[i], v) || C.stepGeneral[i]; }
    else if (i === 2) {
      if (Math.abs(v - stepAns(2)) > 1e-6) {
        if (ds === "day" && Math.abs(v - 6) < 1e-6 && b.taps.length === 2 && b.taps.indexOf(0) >= 0 && b.taps.indexOf(6) >= 0) msg = d.steps[2].equinox;
        else msg = named(d.steps[2], v) || C.stepGeneral[2];
      } else if (b.k == null) { V.fb[ds] = MV.fbHTML("", "Now choose " + M("k") + "."); return paintCard(); }
      else if (!MV.ok(C.kChips[b.k])) msg = C.kChips[b.k].fb;
      else good = true;
    } else {
      var sine = ds === "day" && b.form === "sin", target = stepAns(3), per = (v - target) / 12;
      if (isInt(per)) { good = true; if (Math.abs(v - target) > 1e-9) note = sine ? d.alsoSin : d.also; }
      else msg = named(sine ? d.steps[4] : d.steps[3], v) || C.stepGeneral[sine ? 4 : 3];
    }
    if (good) { st.solved = true; st.first = !st.tries; b.step = i + 1; V.fb[ds] = note ? MV.fbHTML("good", "<strong>✓ " + note + "</strong>") : null; }
    else { st.tries = (st.tries || 0) + 1; V.fb[ds] = fb("bad", msg); }
    api.save(); paintCard(); paintPts(); plot.render(); paintUse();
    var fbEl = $("#dt-card .fb"); if (fbEl) MV.focusFb($("#dt-card"));
  }
  function named(step, v){ var w = (step.wrong || []).filter(function(x){ return Math.abs(x.match - v) < 1e-6; })[0]; return w ? w.fb : ""; }
  host.addEventListener("input", function(e){
    var f = e.target.dataset && e.target.dataset.in; if (f) { B()[f] = e.target.value; if (f === "T") B().taps = []; api.save(); plot.render(); return; }
    var u = e.target.dataset && e.target.dataset.u; if (u) { var it = S.use[u]; if (u === "u1") it.v[+e.target.dataset.i] = e.target.value; else it.v = e.target.value; api.save(); }
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter") return;
    if (e.target.dataset && e.target.dataset.in) { e.preventDefault(); check(); }
    if (e.target.dataset && e.target.dataset.u) { e.preventDefault(); useCheck(e.target.dataset.u); }
  });
  host.addEventListener("click", function(e){
    var bt = e.target.closest("button"); if (!bt || bt.disabled) return;
    var b = B();
    if (bt.dataset.act === "dtcheck") return check();
    if (bt.dataset.kc != null) { b.k = +bt.dataset.kc; V.fb[S.ds] = null; api.save(); return paintCard(); }
    if (bt.dataset.fit != null) { b.fit = +bt.dataset.fit; api.save(); return paintCard(); }
    if (bt.dataset.act === "overlay") {
      b.over = true; api.save(); V.sweep = 0; paintCard();
      MV.tween({ dur:1200, ease:LIN, step:function(x){ V.sweep = x; plot.render(); }, done:function(){ V.sweep = 1; plot.render(); paintCard(); paintUse(); MV.focusFb($("#dt-card")); } });
      return;
    }
    if (bt.dataset.uc) return useCheck(bt.dataset.uc);
    if (bt.id === "dt-run") return runReal();
  });

  // ----- Use the model -----
  var UC = C.use;
  function useFb(id){ return V.ufb[id] || ""; }
  function paintUse(){
    var T = S.sets.tide.over, Dd = S.sets.day.over, U1 = S.use.u1, U2 = S.use.u2, U3 = S.use.u3, h = "<h3>Use the model</h3><p class=\"muted\">" + C.useIntro + "</p>";
    h += '<div class="q" data-uq="u1"><p class="task"><strong>Tide: “' + UC.harbour.title + "”</strong></p>";
    if (!T) h += '<p class="muted tiny">Finish the tide model and its overlay first.</p>';
    else {
      h += '<div class="q-prompt">' + UC.harbour.prompt + "</div><p class=\"dt-frame\">" + UC.harbour.frame.map(function(w, j){ return '<label>' + w + ' <input class="numin dt-hr" type="text" inputmode="decimal" autocomplete="off" data-u="u1" data-i="' + j + '" aria-label="' + MV.esc(w) + " (hour)" + '" value="' + MV.esc(U1.v[j]) + '"' + (U1.solved ? " disabled" : "") + "></label>"; }).join(" ") + "</p>";
      if (!U1.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-uc="u1" data-k="uc1">Check</button></div>' + useFb("u1");
      else h += MV.fbHTML("good", "<strong>✓ Correct: closed from 6:00 to 10:00 and from 18:00 to 22:00 (4 h each).</strong>" + (U1.first ? "" : ' <span class="muted">(not first try)</span>') + " " + UC.harbour.work);
    }
    h += "</div>";
    h += '<div class="q" data-uq="u2"><p class="task"><strong>Daylight: “' + UC.d1.title + "”</strong></p>";
    if (!Dd) h += '<p class="muted tiny">Finish the daylight model and its overlay first.</p>';
    else [["u2", UC.d1, U2], ["u3", UC.d2, U3]].forEach(function(x){
      var id = x[0], q = x[1], st = x[2];
      h += '<div class="dt-uq"><div class="q-prompt">' + q.prompt + MV.usesHTML(q.use) + '</div><div class="numrow"><label for="dt-' + id + '">Your answer:</label><input class="numin short" id="dt-' + id + '" type="text" inputmode="decimal" autocomplete="off" data-u="' + id + '" value="' + MV.esc(st.v) + '"' + (st.solved ? " disabled" : "") + '><span class="tiny">' + q.unit + "</span></div>";
      if (!st.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-uc="' + id + '" data-k="uc' + id + '">Check</button></div>' + useFb(id);
      else h += MV.fbHTML("good", "<strong>✓ Correct.</strong>" + (st.first ? "" : ' <span class="muted">(not first try)</span>') + " " + q.work);
      h += "</div>";
    });
    h += "</div>";
    MV.keepFocus($("#dt-use"), function(){ $("#dt-use").innerHTML = h; });
    paintBars();
  }
  function useCheck(id){
    var st = S.use[id];
    if (id === "u1") {
      var vs = st.v.map(val1);
      if (vs.some(function(x){ return x == null; })) {
        var got = vs.filter(function(x){ return x != null; }), uniq = got.filter(function(x, j){ return got.indexOf(x) === j; }).sort(function(a, b){ return a - b; });
        if (uniq.length === 2 && uniq[0] === 8 && uniq[1] === 20) { st.tries++; V.ufb.u1 = fb("bad", UC.harbour.wrongLows); }
        else V.ufb.u1 = MV.fbHTML("", "Fill in all four times, as hours after midnight (for example, 6 for 6:00).");
      } else {
        var pairs = [[vs[0], vs[1]].sort(function(a, b){ return a - b; }), [vs[2], vs[3]].sort(function(a, b){ return a - b; })].sort(function(a, b){ return a[0] - b[0]; }), flat = pairs[0].concat(pairs[1]);
        var ans = MV.ans(UC.harbour), set = flat.filter(function(x, j){ return flat.indexOf(x) === j; }).sort(function(a, b){ return a - b; });
        if (flat.every(function(x, j){ return Math.abs(x - ans[j]) < 1e-6; })) { st.solved = true; st.first = !st.tries; V.ufb.u1 = ""; }
        else { st.tries++; V.ufb.u1 = fb("bad", flat.join() === "7,9,19,21" ? UC.harbour.wrongReadings : set.join() === "8,20" ? UC.harbour.wrongLows : UC.harbour.general); }
      }
    } else {
      var q = id === "u2" ? UC.d1 : UC.d2, v = val1(st.v);
      if (v == null) V.ufb[id] = MV.fbHTML("", "Enter a number, such as 3 or 0.5.");
      else {
        var ok = id === "u2" ? Math.abs(v - MV.ans(q)) < 1e-6 : v >= 1 - 1e-9 && v <= 1.2 + 1e-9;
        if (ok) { st.solved = true; st.first = !st.tries; V.ufb[id] = ""; }
        else { st.tries++; var w = (q.wrong || []).filter(function(x){ return Math.abs(x.match - v) < 1e-6; })[0]; V.ufb[id] = fb("bad", w ? w.fb : q.general); }
      }
    }
    api.save(); paintUse(); plot.render(); MV.focusFb($('[data-uq="' + (id === "u1" ? "u1" : "u2") + '"]'));
  }
  // monthly change bars (daylight, after both "Minutes per day" answers)
  var BARS = [[2, "2"], [2 * Math.sqrt(3) - 2, "2√3 - 2"], [4 - 2 * Math.sqrt(3), "4 - 2√3"], [-(4 - 2 * Math.sqrt(3)), "-(4 - 2√3)"], [-(2 * Math.sqrt(3) - 2), "-(2√3 - 2)"], [-2, "-2"], [-2, "-2"], [-(2 * Math.sqrt(3) - 2), "-(2√3 - 2)"], [-(4 - 2 * Math.sqrt(3)), "-(4 - 2√3)"], [4 - 2 * Math.sqrt(3), "4 - 2√3"], [2 * Math.sqrt(3) - 2, "2√3 - 2"], [2, "2"]];
  function paintBars(){
    var host2 = $("#dt-bars"), on = S.ds === "day" && S.use.u2.solved && S.use.u3.solved, dates = SETS.day.dates;
    if (!on) { host2.innerHTML = ""; return; }
    var sel = V.bar == null ? 0 : V.bar, bv = BARS[sel];
    host2.innerHTML = '<div class="dt-bars"><p class="dt-bt"><strong>' + C.bars.title + '</strong></p><div class="dt-bscroll"><div class="dt-brow" role="group" aria-label="' + MV.esc(C.bars.title) + '">' + BARS.map(function(x, i){
      var hpx = Math.round(Math.abs(x[0]) / 2 * 46), lab = dates[i] + " to " + dates[i + 1] + ": " + (x[0] > 0 ? "+" : MINUS) + num(Math.abs(x[0]), 2) + " h";
      return '<button type="button" class="dt-bar' + (i === sel ? " on" : "") + '" data-bar="' + i + '" data-k="bar' + i + '" aria-label="' + MV.esc(lab) + ", exactly " + MV.esc(MV.plain(M(x[1]))) + ' h"><span class="dt-bb ' + (x[0] > 0 ? "up" : "dn") + '" style="height:' + hpx + 'px"></span><span class="dt-bm">' + dates[i].slice(0, 1) + "</span></button>";
    }).join("") + '</div></div><p class="tiny dt-bsel" aria-live="polite">' + dates[sel] + " → " + dates[sel + 1] + ": " + (bv[0] > 0 ? "+" : MINUS) + num(Math.abs(bv[0]), 2) + " h (exact: " + M(bv[1]) + " h)</p><p class=\"tiny\">" + C.bars.caption + "</p></div>";
  }
  $("#dt-bars").addEventListener("focusin", function(e){ var b = e.target.closest("[data-bar]"); if (b && +b.dataset.bar !== V.bar) { V.bar = +b.dataset.bar; MV.keepFocus($("#dt-bars"), paintBars); } });
  $("#dt-bars").addEventListener("mouseover", function(e){ var b = e.target.closest("[data-bar]"); if (b && +b.dataset.bar !== V.bar) { V.bar = +b.dataset.bar; paintBars(); } });

  // ----- Check it with algebra (N13 step-through, fresh host) -----
  MV.player($("#dt-player"), { count:C.algSteps.length, interval:1800, render:function(i){ $("#dt-alg-lines").innerHTML = C.algSteps.slice(0, i + 1).map(function(x, j){ return '<p class="' + (j === i ? "dt-cur" : "") + '">' + x + "</p>"; }).join(""); }, label:function(i){ return "Step " + (i + 1) + " of " + C.algSteps.length; } });

  // ----- Model vs reality (tide only) -----
  rplot.render = function(){
    var k = KC(), x = V.real, f = MODELS.tide, g = function(t){ return 4 * Math.cos(TAU * (t - 2) / 12.4) + 5; };
    var sc = { view:{ xmin:-2, xmax:79, ymin:-1, ymax:10.5 }, xTicks:{ step:12 }, yTicks:{ step:2 }, xLabel:"t (h)", yLabel:"depth (m)", curves:[], labels:[], points:[],
      describe:"Tide over " + num(x, 0) + " hours: the 12-hour model in blue and a dashed 12.4-hour tide. Their high tides drift apart by 0.4 hours each cycle." };
    if (x > 0) { sc.curves.push({ f:f, color:k.pen, width:2.6, domain:[0, x] }, { f:g, color:k.ink2, width:2, dash:[7, 5], domain:[0, x] }); }
    var n = 0; for (var j = 1; j <= 6; j++) if (x >= 2 + 12.4 * j) n = j;
    for (var i = 0; i <= n; i++) { sc.points.push({ x:2 + 12 * i, y:9, r:4, color:k.pen }, { x:2 + 12.4 * i, y:9, r:4, color:k.ink2 }); }
    sc.labels.push({ x:77, y:10.1, text:"12-hour model", color:k.pen, align:"right", font:"600 12px " + k.ui }, { x:77, y:-0.5, text:"12.4-hour tide (dashed)", color:k.ink2, align:"right", font:"600 12px " + k.ui });
    rplot.draw(sc);
    var drift = n ? n + (n === 1 ? " high tide" : " high tides") + " later: " + num(n * 0.4, 1) + " h off" : "";
    $("#dt-drift").textContent = drift;
  };
  function runReal(){
    if (V.realBusy) return; V.realBusy = true; V.real = 0;
    MV.tween({ dur:4500, ease:LIN, step:function(x){ V.real = 78 * x; rplot.render(); }, done:function(){ V.real = 78; V.realBusy = false; rplot.render(); } });
  }
  $("#dt-real").addEventListener("toggle", function(){ if ($("#dt-real").open) rplot.render(); });

  function paintAll(){
    var d = D(), ds = S.ds;
    setR.set(ds);
    $("#dt-story").innerHTML = "<p>" + d.story + "</p>" + (d.note ? '<p class="tiny muted">' + d.note + "</p>" : "");
    var ts = d.data.map(function(_, t){ return t; });
    $("#dt-table").innerHTML = ds === "tide"
      ? MV.tableHTML({ head:[M("t") + " (h)"].concat(ts.map(String)), rows:[[d.rowLabel].concat(d.data.map(function(y){ return y.toFixed(1); }))], caption:"Tide depths" })
      : MV.tableHTML({ head:[M("t") + " (months)"].concat(ts.map(String)), rows:[["Date"].concat(d.dates), [d.rowLabel].concat(d.data.map(function(y){ return y.toFixed(1); }))], caption:"Hours of daylight" });
    plot.view = VIEWS[ds];
    $("#dt-real").hidden = ds !== "tide";
    paintCard(); paintPts(); paintUse(); plot.render();
  }

  // ----- results summary lines -----
  MV.ACTS.builder = { a:{ id:"builder" },
    stats:function(){ var f = 0, d = 0; ["tide", "day"].forEach(function(k){ S.sets[k].st.forEach(function(x){ if (x.solved) d++; if (x.first) f++; }); }); return { first:f, total:8, done:d, line:"Model builder steps (first try): " + f + "/8" + (d < 8 ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; ["tide", "day"].forEach(function(k){ S.sets[k].st.forEach(function(x){ if (x.tries) g = g.concat(MV.goalIdx(3)); }); }); return g; } };
  MV.ACTS.usemodel = { a:{ id:"usemodel" },
    stats:function(){ var f = 0, d = 0; ["u1", "u2", "u3"].forEach(function(k){ var x = S.use[k]; if (x.solved) d++; if (x.first) f++; }); return { first:f, total:3, done:d, line:"Use the model (first try): " + f + "/3" + (d < 3 ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; if (S.use.u1.tries) g = g.concat(MV.goalIdx(4)); if (S.use.u2.tries || S.use.u3.tries) g = g.concat(MV.goalIdx(5)); return g; } };

  paintAll();
}

// ---------- Performance task: Design a viewing wheel ----------
var task = (function(){
  var api, wg, T;
  function read(){
    var s = api ? api.S : {}, p = function(v){ var r = MV.parseNum(v); return r && r.length === 1 ? r[0] : NaN; };
    var d = { r:p(s.r), c:p(s.c), T:p(s.T) };
    d.valid = [["r", 4, 20], ["c", 5, 40], ["T", 20, 120]].every(function(x){ var v = d[x[0]]; return Number.isInteger(v) && v >= x[1] && v <= x[2]; });
    return d;
  }
  function checks(d){ if (!d.valid) return [false, false, false, false]; return [d.c - d.r >= 2 && d.c - d.r <= 8, 2 * d.c + d.r === 40, d.T >= TAU * d.r, d.T <= 90]; }
  function draw(){
    var d = read(), cap = $("#tk-cap");
    if (!d.valid) { cap.innerHTML = '<span class="muted tiny">' + T.invalid + "</span>"; wg.set({ r:4, c:12, T:60, b:0, ymax:25, tmax:60, wheelDraw:0, frameA:1, t:null, describe:"Enter r, c and T to see the wheel." }); return; }
    var mm = { r:d.r, c:d.c, T:d.T, b:0 }, ymin = d.c - d.r < 0 ? 5 * Math.floor((d.c - d.r - 1) / 5) : 0;
    cap.innerHTML = M(modelSrc(mm));
    wg.set({ r:d.r, c:d.c, T:d.T, b:0, ymax:Math.max(25, win(d.r, d.c)), ymin:ymin, tmax:d.T, t:0, curve:{ to:d.T }, axisLine:true, periodBr:1,
      lab:{ T:"T = " + d.T + " s", axis:"axis h = " + d.c }, level:{ h:20, label:T.deck, fill:true },
      describe:"Your wheel: radius " + d.r + " metres, axle " + d.c + " metres, one turn every " + d.T + " seconds, the rider boarding at the bottom, " + (d.c - d.r) + " metres up. A dashed line marks the 20-metre viewing deck; the part of the turn above it is shaded. Graph of " + spoken(mm) + " over one turn." });
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; def(a.S, { r:"10", c:"12", T:"60" });
      inp.innerHTML = MV.usesHTML(T.use) + '<div class="tk-in">' + T.inputs.map(function(x){
        return '<div class="tk-f"><label for="tk-' + x.id + '">' + x.label + '</label><div class="tk-row"><button type="button" class="btn ghost tk-pm" data-pm="' + x.id + '" data-d="-1" data-k="pm' + x.id + 'm" aria-label="Decrease ' + x.id + ' by 1">' + MINUS + '</button><input id="tk-' + x.id + '" data-tk="' + x.id + '" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(a.S[x.id]) + '"><button type="button" class="btn ghost tk-pm" data-pm="' + x.id + '" data-d="1" data-k="pm' + x.id + 'p" aria-label="Increase ' + x.id + ' by 1">+</button></div></div>';
      }).join("") + "</div>";
      pv.innerHTML = '<p class="eq-cap tk-cap" id="tk-cap" aria-live="polite"></p><div id="tk-wg"></div>';
      wg = wheelGraph($("#tk-wg"), { ratio:"16 / 10", aria:"Your viewing wheel and its height graph" });
      inp.addEventListener("input", function(e){ var id = e.target.dataset.tk; if (!id) return; a.S[id] = e.target.value; a.save(); draw(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-pm]"); if (!b) return;
        var id = b.dataset.pm, x = T.inputs.filter(function(q){ return q.id === id; })[0], v = MV.parseNum(a.S[id]), cur = v && v.length === 1 && isFinite(v[0]) ? Math.round(v[0]) : x.min;
        a.S[id] = String(clamp(cur + (+b.dataset.d), x.min, x.max)); $("#tk-" + id).value = a.S[id]; a.save(); draw(); a.update();
      });
      // after designs on two different wheels, add the pattern line under the success message
      var fbHost = $("#task-fb");
      if (fbHost) new MutationObserver(function(){
        var g = fbHost.querySelector(".fb.good"); if (!g || g.querySelector(".tk-two")) return;
        var wheels = {}; MV.taskState().found.forEach(function(k){ var p = k.split(","); wheels[p[0] + "," + p[1]] = 1; });
        if (Object.keys(wheels).length >= 2) { var pp = document.createElement("p"); pp.className = "tk-two"; pp.innerHTML = T.twoWheels; g.appendChild(pp); }
      }).observe(fbHost, { childList:true, subtree:true });
      draw();
    },
    read:read,
    valid:function(d){ return d.valid ? true : T.invalid; },
    checks:checks,
    tips:function(d, res){
      var out = [], w = T.tipWords;
      if (!res[0]) out.push(T.tips[0].replace("{v}", num(d.c - d.r)));
      if (!res[1]) { var word = d.c + d.r <= 20 ? w.none : d.c - d.r >= 20 ? w.all : 2 * d.c + d.r > 40 ? w.more : w.less; out.push(T.tips[1].replace("{v}", word)); }
      if (!res[2]) out.push(T.tips[2].replace("{v}", num(TAU * d.r / d.T, 2)));
      if (!res[3]) out.push(T.tips[3]);
      return out;
    },
    key:function(d){ return d.r + "," + d.c + "," + d.T; },
    label:function(k){ var p = k.split(","); return M("(r, c, T) = (" + p.join(", ") + ")"); },
    text:function(k){ var p = k.split(","); return "r = " + p[0] + " m, c = " + p[1] + " m, T = " + p[2] + " s"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
