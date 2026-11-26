// MCV4U 43 The Dot Product in R²: hero (b⃗ turns round a⃗ = (4, 0) while a readout and a sign band follow a⃗ · b⃗; three
// stills with reduced motion), Angle and alignment gauge (Explore: V3 vector board in Polar, Components and Work modes with
// the θ arc, the "shadow" band of a⃗ on b⃗, the sign band and both formulas live), the property lab (Part 3: six cards,
// three draggable vectors, both sides checked live, the failed "associative law"), Angles and perpendicular vectors
// (Practice 2) and the "Design the rhombus" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 16) + "px " + (css("--font-math") || "serif"); }
function fx(v, dp){ var s = (Math.abs(v) < 0.5 * Math.pow(10, -dp) ? 0 : v).toFixed(dp); return s.replace("-", MINUS); }
function rad(d){ return d * Math.PI / 180; }
function deg(r){ return r * 180 / Math.PI; }
function pt(n){ return String(n).replace("-", MINUS); }
function muted(h){ return '<span class="muted">' + h + "</span>"; }
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.9; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + MV.md(o.t) + "</button>"; }).join("") + "</span>";
}

// =====================================================================================================================
// @component V3 vectorBoard — 2D vector board (course plan V3): vectors from the origin on an equal-scale MV.Plot, tips
// dragged on an integer grid with MV.drag (Tab to a tip, arrow keys move it one step), the θ arc between the tails, a
// right-angle mark when a⃗ · b⃗ = 0, and the --hi "shadow" band of a⃗ on b⃗’s line. Helpers below: dot, len, exact surds
// (surdSrc) and exact special-angle trig (COS/SIN tables, trigSrc) as m() source for readouts.
function dot(a, b){ return a[0] * b[0] + a[1] * b[1]; }
function len(a){ return Math.hypot(a[0], a[1]); }
function eqv(a, b){ return a[0] === b[0] && a[1] === b[1]; }
function surdSrc(n){
  if (n === 0) return "0";
  for (var k = Math.floor(Math.sqrt(n) + 1e-9); k >= 1; k--) if (n % (k * k) === 0) { var r = n / (k * k); return r === 1 ? String(k) : (k === 1 ? "" : k) + "√" + r; }
  return "√" + n;
}
function magSrc(v){ return surdSrc(v[0] * v[0] + v[1] * v[1]); }
function vSrc(v){ return "(" + v[0] + ", " + v[1] + ")"; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
// special angles in degrees: [c, r, d] means c√r/d
var COS = { 0:[1, 1, 1], 30:[1, 3, 2], 45:[1, 2, 2], 60:[1, 1, 2], 90:[0, 1, 1], 120:[-1, 1, 2], 135:[-1, 2, 2], 150:[-1, 3, 2], 180:[-1, 1, 1] };
var SIN = { 0:[0, 1, 1], 30:[1, 1, 2], 45:[1, 2, 2], 60:[1, 3, 2], 90:[1, 1, 1], 120:[1, 3, 2], 135:[1, 2, 2], 150:[1, 1, 2], 180:[0, 1, 1] };
function spAngle(th){ if (th == null) return null; var r = Math.round(th); return Math.abs(th - r) < 1e-6 && COS[r] ? r : null; }
function trigSrc(k, e){
  var n = k * e[0], d = e[2], g = gcd(n, d) || 1; n /= g; d /= g;
  if (n === 0) return "0";
  var an = Math.abs(n), body = e[1] === 1 ? String(an) : (an === 1 ? "" : an) + "√" + e[1];
  return (n < 0 ? "-" : "") + body + (d > 1 ? "/" + d : "");
}
function trigVal(k, e){ return k * e[0] * Math.sqrt(e[1]) / e[2]; }
function exactDisp(k, e){ return m(trigSrc(k, e)) + (e[1] !== 1 && e[0] !== 0 ? " ≈ " + fx(trigVal(k, e), 2) : ""); }
function angleOf(a, b){ var la = len(a), lb = len(b); if (la < 1e-12 || lb < 1e-12) return null; return deg(Math.acos(clamp(dot(a, b) / (la * lb), -1, 1))); }
function angTxt(th){ var s = spAngle(th); return s != null ? s + "°" : "≈ " + Math.round(th) + "°"; }
function arrowPx(ctx, x1, y1, x2, y2, color, w, dash){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 2) return;
  var ux = dx / L, uy = dy / L, h = Math.min(12, L * 0.6), hw = h * 0.45, bx = x2 - ux * h, by = y2 - uy * h;
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w || 3; ctx.lineCap = "round"; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(bx - uy * hw, by + ux * hw); ctx.lineTo(bx + uy * hw, by - ux * hw); ctx.closePath(); ctx.fill(); ctx.restore();
}
function vecArrow(ctx, p, x1, y1, x2, y2, color, w, dash){ arrowPx(ctx, p.X(x1), p.Y(y1), p.X(x2), p.Y(y2), color, w, dash); }
function dashedPx(ctx, x1, y1, x2, y2, color, w){
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w || 1.6; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}
function tipLabel(ctx, p, v, text, color, off){
  var L = len(v); if (L < 1e-9) return;
  var ux = v[0] / L, uy = v[1] / L, X = p.X(v[0]) + ux * (off || 17) - uy * 9, Y = p.Y(v[1]) - uy * (off || 17) - ux * 9;
  bgText(ctx, text, X, Y, "center", color, mfont(17));
}
function angleArc(ctx, p, A, B, th, R, color, label){
  if (th == null || th < 0.5) return;
  var X0 = p.X(0), Y0 = p.Y(0), t1 = Math.atan2(A[1], A[0]), t = rad(th), cr = A[0] * B[1] - A[1] * B[0];
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.beginPath();
  if (cr >= 0) ctx.arc(X0, Y0, R, -t1, -(t1 + t), true); else ctx.arc(X0, Y0, R, -t1, -(t1 - t), false);
  ctx.stroke(); ctx.restore();
  if (label) { var mid = cr >= 0 ? t1 + t / 2 : t1 - t / 2; bgText(ctx, label, X0 + (R + 14) * Math.cos(mid), Y0 - (R + 14) * Math.sin(mid), "center", color, mfont(15)); }
}
function rightMark(ctx, p, A, B, at){
  var la = len(A), lb = len(B); if (la < 1e-9 || lb < 1e-9) return;
  var X0 = p.X(at ? at[0] : 0), Y0 = p.Y(at ? at[1] : 0), s = 12, ua = [A[0] / la * s, -A[1] / la * s], ub = [B[0] / lb * s, -B[1] / lb * s];
  ctx.save(); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.8; ctx.beginPath();
  ctx.moveTo(X0 + ua[0], Y0 + ua[1]); ctx.lineTo(X0 + ua[0] + ub[0], Y0 + ua[1] + ub[1]); ctx.lineTo(X0 + ub[0], Y0 + ub[1]); ctx.stroke(); ctx.restore();
}
function tipRing(ctx, p, v){ ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = css("--hi"); ctx.beginPath(); ctx.arc(p.X(v[0]), p.Y(v[1]), 12, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
function okVec(v, lim){ return Array.isArray(v) && v.length === 2 && v.every(function(x){ return Number.isInteger(x) && Math.abs(x) <= lim; }); }
// ------------------------------------------------- end of V3 vectorBoard helpers --------------------------------------------

// ---------- hero: b⃗ (length 3) turns from 0° to 180° round a⃗ = (4, 0); readout and sign band follow ----------
var HZ = ["positive", "zero", "negative"];
function r1(v){ return Math.round(v * 10) / 10; }
function arrowSVG(x1, y1, x2, y2, cls){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 2) return "";
  var ux = dx / L, uy = dy / L, h = 11, w = 5.5, bx = x2 - ux * h, by = y2 - uy * h;
  return '<line class="' + cls + '" x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(bx) + '" y2="' + r1(by) + '" stroke-width="3.4" stroke-linecap="round"/>' +
    '<polygon class="' + cls + 'f" points="' + r1(x2) + "," + r1(y2) + " " + r1(bx - uy * w) + "," + r1(by + ux * w) + " " + r1(bx + uy * w) + "," + r1(by - ux * w) + '"/>';
}
function heroFrame(th, still){
  var sp = spAngle(th), c = Math.cos(rad(th)), sn = Math.sin(rad(th)), v = sp != null ? trigVal(12, COS[sp]) : 12 * c;
  var z = Math.abs(v) < 1e-9 ? 1 : v > 0 ? 0 : 2, ox = 125, oy = 108, s = 24, bx = ox + 3 * s * c, by = oy - 3 * s * sn;
  var g = '<svg viewBox="0 0 250 132" aria-hidden="true" focusable="false"><line class="dp-sax" x1="8" y1="' + oy + '" x2="242" y2="' + oy + '" stroke-width="1.2"/>';
  if (th > 0.5) {
    var R = 20, ex = ox + R * c, ey = oy - R * sn, mid = rad(th / 2);
    g += '<path class="dp-sarc" d="M ' + (ox + R) + " " + oy + " A " + R + " " + R + " 0 0 0 " + r1(ex) + " " + r1(ey) + '" stroke-width="1.6"/>';
    if (sp !== 90) g += '<text class="dp-stx dp-tth" x="' + r1(ox + 33 * Math.cos(mid)) + '" y="' + r1(oy - 33 * Math.sin(mid) + 5) + '" text-anchor="middle">θ</text>';
  }
  if (sp === 90) g += '<path class="dp-sra" d="M ' + (ox + 11) + " " + oy + " V " + (oy - 11) + " H " + ox + '" stroke-width="1.6"/>';
  g += arrowSVG(ox, oy, ox + 4 * s, oy, "dp-sa") + arrowSVG(ox, oy, bx, by, "dp-sb");
  g += '<text class="dp-stx dp-tA" x="' + (ox + 4 * s - 4) + '" y="' + (oy + 20) + '" text-anchor="middle">a⃗</text>';
  g += '<text class="dp-stx dp-tB" x="' + r1(ox + 3 * s * c + 15 * c) + '" y="' + r1(oy - 3 * s * sn - 15 * sn + 5) + '" text-anchor="middle">b⃗</text></svg>';
  var val = sp != null ? m("vec{a} · vec{b} = " + trigSrc(12, COS[sp])) : m("vec{a} · vec{b}") + " ≈ " + fx(v, 1);
  return '<div class="dp-hf"><p class="dp-hval">' + val + '</p><div class="dp-band">' + HZ.map(function(t, i){ return '<span class="' + (i === z ? "on" : "") + '">' + t + "</span>"; }).join("") + "</div>" + g +
    (still ? '<p class="tiny muted dp-hcap">θ = ' + th + "°</p>" : "") + "</div>";
}
function hero(f){
  var box = $("#dp-hero"); if (!box) return;
  function capFor(th){ var sp = spAngle(th); return sp == null ? "" : "θ = " + sp + "°: " + m("vec{a} · vec{b} = " + trigSrc(12, COS[sp])) + "."; }
  if (MV.reduceMotion) {
    box.classList.add("dp-three"); box.innerHTML = [60, 90, 120].map(function(t){ return heroFrame(t, true); }).join("");
    box.setAttribute("aria-label", "Three stills of a = (4, 0) and b of length 3: at 60° the dot product is 6 (positive), at 90° it is 0 (zero, with a right-angle mark), at 120° it is " + MINUS + "6 (negative).");
    if (f.cap) f.cap.innerHTML = "Acute: positive. Right angle: zero. Obtuse: negative.";
    return;
  }
  function show(th){
    box.innerHTML = heroFrame(th, false);
    var sp = spAngle(th);
    if (sp != null) {
      box.setAttribute("aria-label", "a = (4, 0) and b of length 3 at " + sp + "°: the dot product is " + MV.plain(m(trigSrc(12, COS[sp]))) + ".");
      if (f.cap) f.cap.innerHTML = capFor(th);
    }
  }
  show(0);
  var lin = function(t){ return t; };
  function go(a, b, dur, cb){ MV.tween({ dur:dur, ease:lin, step:function(t){ show(a + (b - a) * t); }, done:function(){ show(b); cb(); } }); }
  MV.wait(900, function(){ go(0, 60, 1500, function(){ MV.wait(1000, function(){ go(60, 90, 900, function(){ MV.wait(1200, function(){
    go(90, 120, 900, function(){ MV.wait(1000, function(){ go(120, 180, 1500, function(){ if (f.cap) f.cap.innerHTML = "Acute: positive. Right angle: zero. Obtuse: negative."; }); }); });
  }); }); }); }); });
}

// =====================================================================================================================
// ---------- Explore: Angle and alignment gauge (V3 vector board: Polar, Components, Work) ----------
var VIEW = { polar:{ xmin:-11, xmax:11, ymin:-3, ymax:11 }, comp:{ xmin:-9, xmax:9, ymin:-9, ymax:9 }, work:{ xmin:-1, xmax:23, ymin:-3.5, ymax:14.5 } };
var KD = 0.6, KF = 0.08, LOCKMODE = { tc1:"comp", tc2:"polar", tc3:"comp" };
function slHTML(id, label, min, max, step, val, out, col, dis){
  return '<label class="slider dp-sl"><span class="slider-top"><span>' + MV.md(label) + '</span><output id="dp-o-' + id + '">' + out + "</output></span>" +
    '<input type="range" data-sl="' + id + '" data-k="sl' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" style="accent-color:var(' + col + ')" aria-valuetext="' + MV.esc(MV.plain(out)) + '"' + (dis ? " disabled" : "") + "></label>";
}
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, R = T.rows, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function okStep(v, lo, hi, st){ return typeof v === "number" && v >= lo && v <= hi && near(v / st, Math.round(v / st), 1e-9); }
  if (["polar", "comp", "work"].indexOf(S.mode) < 0) S.mode = "polar";
  if (!okStep(S.pa, 1, 10, 1)) S.pa = 4;
  if (!okStep(S.pb, 1, 10, 1)) S.pb = 5;
  if (!okStep(S.th, 0, 180, 15)) S.th = 60;
  if (!okVec(S.A, 8)) S.A = [3, 4];
  if (!okVec(S.B, 8)) S.B = [5, 1];
  if (!okStep(S.F, 10, 100, 10)) S.F = 50;
  if (!okStep(S.fa, 0, 90, 15)) S.fa = 60;
  if (!okStep(S.d, 1, 20, 1)) S.d = 8;
  S.pushed = !!S.pushed; S.rev3 = !!S.rev3; S.tc2 = S.tc2 || {};
  if (!LOCKMODE[S.lock]) S.lock = null;
  var busy = false, note = null, stop = null, hideRA = false, glow = false, boxT = null, showAll = false;

  host.innerHTML = '<div class="dp-ex"><div class="dp-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot" id="dp-cv" role="img" aria-label="Vector board"></canvas></div>' +
    '<p class="tiny dp-zh">' + T.zonesH + '</p><div class="dp-zones" id="dp-zones" aria-hidden="true"></div>' +
    '<p class="tiny muted dp-key" id="dp-key"></p></div>' +
    '<div class="dp-side"><div id="dp-mode"></div><div id="dp-ctl"></div>' +
    '<dl class="read dp-read" id="dp-read" aria-live="polite"></dl>' +
    '<button type="button" class="btn ghost sm dp-more" data-act="more" data-k="dpmore">' + T.showAll + "</button>" +
    '<p class="tiny dp-h">' + T.setupH + '</p><div class="chips dp-setup" role="group" aria-label="' + MV.esc(MV.plain(T.setupH)) + '">' +
    T.setup.map(function(t, i){ return '<button type="button" class="chip" data-setup="' + (i + 1) + '" data-k="dpsetup' + i + '">' + t + "</button>"; }).join("") + "</div></div></div>";
  var cv = $("#dp-cv", host), P = new MV.Plot(cv, VIEW.comp);
  P.render = draw;
  function aLocked(){ return S.mode === "comp" && (S.lock === "tc1" || S.lock === "tc3"); }
  var drag = MV.drag(P, {
    handles:function(){
      if (S.mode !== "comp" || busy) return [];
      var h = [];
      if (!aLocked()) h.push({ id:"a", x:S.A[0], y:S.A[1], label:T.tipA + " at (" + pt(S.A[0]) + ", " + pt(S.A[1]) + ")" });
      h.push({ id:"b", x:S.B[0], y:S.B[1], label:T.tipB + " at (" + pt(S.B[0]) + ", " + pt(S.B[1]) + ")" });
      return h;
    },
    move:function(id, x, y){
      if (busy) return;
      var v = [clamp(Math.round(x), -8, 8), clamp(Math.round(y), -8, 8)];
      if (id === "a" && aLocked()) return;
      var cur = id === "a" ? S.A : S.B; if (eqv(cur, v)) return;
      if (id === "a") S.A = v; else S.B = v;
      note = null; changed(false);
    },
    step:{ x:1, y:1 }, big:2
  });

  function info(){
    var o;
    if (S.mode === "comp") o = { a:S.A.slice(), b:S.B.slice(), dot:dot(S.A, S.B), th:angleOf(S.A, S.B) };
    else if (S.mode === "polar") {
      var sp = spAngle(S.th);
      o = { a:[S.pa, 0], b:[S.pb * Math.cos(rad(S.th)), S.pb * Math.sin(rad(S.th))], th:S.th, dot:sp != null ? trigVal(S.pa * S.pb, COS[sp]) : S.pa * S.pb * Math.cos(rad(S.th)) };
    } else {
      var sw = spAngle(S.fa);
      o = { a:[S.F * Math.cos(rad(S.fa)), S.F * Math.sin(rad(S.fa))], b:[S.d, 0], th:S.fa, dot:sw != null ? trigVal(S.F * S.d, COS[sw]) : S.F * S.d * Math.cos(rad(S.fa)) };
    }
    o.zero = o.th == null;
    o.sign = o.zero ? "zvec" : Math.abs(o.dot) < 1e-9 ? "zero" : o.dot > 0 ? "pos" : "neg";
    return o;
  }

  // ---- panels ----
  function paintMode(){ var el = $("#dp-mode", host); MV.keepFocus(el, function(){ el.innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">' + T.mode + "</span>" + segBtns("mode", C.modes, S.mode, MV.plain(T.mode)) + "</div>"; }); }
  function lockLine(){
    if (!S.lock || LOCKMODE[S.lock] !== S.mode) return "";
    var what = S.lock === "tc1" ? m("vec{a} = (2, 3)") : S.lock === "tc2" ? m("|vec{a}| = 6") : m("vec{a} = (4, 2)");
    return '<p class="tiny dp-lock">' + what + ": " + T.locked + ' <button type="button" class="btn ghost sm" data-act="unlock" data-k="dpunlock">' + T.unlock + "</button></p>";
  }
  function paintCtl(){
    var el = $("#dp-ctl", host), h = "";
    if (S.mode === "polar") h += slHTML("pa", T.pa, 1, 10, 1, S.pa, String(S.pa), "--pen", S.lock === "tc2") + slHTML("pb", T.pb, 1, 10, 1, S.pb, String(S.pb), "--f3") +
      slHTML("th", T.th, 0, 180, 15, Math.round(S.th), Math.round(S.th) + "°", "--ink") + '<p class="tiny muted">' + T.polarNote + "</p>";
    else if (S.mode === "comp") h += '<p class="tiny muted">' + T.dragNote + "</p>";
    else h += slHTML("F", T.F, 10, 100, 10, S.F, S.F + " N", "--pen") + slHTML("fa", T.fa, 0, 90, 15, S.fa, S.fa + "°", "--ink") + slHTML("d", T.d, 1, 20, 1, S.d, S.d + " m", "--f3") +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-act="push" data-k="dppush">' + T.push + '</button><button type="button" class="btn ghost sm" data-act="rbox" data-k="dprbox">' + T.resetBox + "</button></div>";
    h += lockLine();
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function syncSl(){
    var outs = { pa:String(S.pa), pb:String(S.pb), th:Math.round(S.th) + "°", F:S.F + " N", fa:S.fa + "°", d:S.d + " m" };
    $$("input[data-sl]", host).forEach(function(inp){
      var id = inp.dataset.sl; inp.value = Math.round(S[id]); inp.setAttribute("aria-valuetext", outs[id]);
      var o = $("#dp-o-" + id, host); if (o) o.textContent = outs[id];
    });
  }
  function paintRead(){
    var o = info(), rows = [], hide = S.mode === "comp" && S.lock === "tc3" && !S.rev3;
    function row(lbl, html, opt){ rows.push("<div" + (opt ? ' class="dp-opt"' : "") + "><dt>" + lbl + "</dt><dd>" + html + "</dd></div>"); }
    if (S.mode === "comp") {
      var A = o.a, B = o.b, sp = o.zero ? null : spAngle(o.th);
      row(R.a, m(vSrc(A)) + ", " + m("|vec{a}| = " + magSrc(A)), true);
      row(R.b, m(vSrc(B)) + ", " + m("|vec{b}| = " + magSrc(B)), true);
      row(R.th, hide ? muted(T.hidden) : o.zero ? T.noAngle : angTxt(o.th), true);
      row(R.geo, hide ? muted(T.hidden) : o.zero ? T.noAngle : m(magSrc(A) + " × " + magSrc(B) + " × " + (sp != null ? trigSrc(1, COS[sp]) : "cos θ") + " = " + o.dot));
      row(R.comp, m("(" + A[0] + ")(" + B[0] + ") + (" + A[1] + ")(" + B[1] + ") = " + o.dot));
    } else if (S.mode === "polar") {
      var sq = spAngle(S.th), th = Math.round(S.th);
      var bx = sq != null ? trigSrc(S.pb, COS[sq]) : fx(o.b[0], 2), by = sq != null ? trigSrc(S.pb, SIN[sq]) : fx(o.b[1], 2);
      row(R.a, m("|vec{a}| = " + S.pa) + ", " + T.alongX, true);
      row(R.b, m("|vec{b}| = " + S.pb) + ", " + T.at + " " + angTxt(S.th), true);
      row(R.th, angTxt(S.th), true);
      row(R.geo, sq != null ? m(S.pa + " × " + S.pb + " × " + trigSrc(1, COS[sq])) + " = " + exactDisp(S.pa * S.pb, COS[sq]) : m(S.pa + " × " + S.pb + " × cos " + th + "°") + " ≈ " + fx(o.dot, 2));
      row(R.comp, m("(" + S.pa + ")(" + bx + ") + (0)(" + by + ")") + (sq != null ? " = " + exactDisp(S.pa * S.pb, COS[sq]) : " ≈ " + fx(o.dot, 2)));
    } else {
      var sw = spAngle(S.fa), f1 = sw != null ? trigSrc(S.F, COS[sw]) : fx(o.a[0], 2), f2 = sw != null ? trigSrc(S.F, SIN[sw]) : fx(o.a[1], 2);
      row(R.F, m("|vec{F}| = " + S.F) + " N, " + S.fa + "° " + T.aboveFloor, true);
      row(R.d, m("|vec{d}| = " + S.d) + " m, " + T.alongFloor, true);
      row(R.th, S.fa + "°", true);
      row(R.geoW, sw != null ? m(S.F + " × " + S.d + " × " + trigSrc(1, COS[sw])) + " = " + exactDisp(S.F * S.d, COS[sw]) : m(S.F + " × " + S.d + " × cos " + S.fa + "°") + " ≈ " + fx(o.dot, 2));
      row(R.compW, m("(" + f1 + ")(" + S.d + ") + (" + f2 + ")(0)") + (sw != null ? " = " + exactDisp(S.F * S.d, COS[sw]) : " ≈ " + fx(o.dot, 2)));
      row(R.along, m(S.F + " cos " + S.fa + "°") + (sw != null ? " = " + exactDisp(S.F, COS[sw]) : " ≈ " + fx(o.a[0], 2)) + " N", true);
      row(R.lift, m(S.F + " sin " + S.fa + "°") + (sw != null ? " = " + exactDisp(S.F, SIN[sw]) : " ≈ " + fx(o.a[1], 2)) + " N", true);
    }
    row(R.sign, T.sign[o.sign]);
    if (S.mode === "work") { var sw2 = spAngle(S.fa); row(R.work, m("W = " + S.F + " × " + S.d + " × cos " + S.fa + "°") + (sw2 != null ? " = " + exactDisp(S.F * S.d, COS[sw2]) : " ≈ " + fx(o.dot, 1)) + " J"); }
    var rd = $("#dp-read", host); rd.innerHTML = rows.join(""); rd.classList.toggle("dp-all", showAll);
  }
  function paintZones(){
    var o = info(), on = { pos:0, zero:1, neg:2 }[o.sign];
    $("#dp-zones", host).innerHTML = T.zones.map(function(t, i){ return '<span class="' + (i === on ? "on" : "") + '">' + t + "</span>"; }).join("");
    $("#dp-key", host).innerHTML = S.mode === "work" ? T.keyWork : T.key;
    var mb = $(".dp-more", host); if (mb) mb.textContent = showAll ? T.showFew : T.showAll;
  }
  function paintAll(){ paintMode(); paintCtl(); paintRead(); paintZones(); draw(); }
  function changed(full){ api.save(); if (full) paintAll(); else { paintRead(); paintZones(); draw(); } MV.changed(); }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }

  // ---- drawing ----
  function drawNote(ctx, p){ if (note) bgText(ctx, note, 10, 20, "left", css("--ink"), ui(14, 700)); }
  function draw(){
    if (S.mode === "work") { drawWork(); return; }
    var o = info(), pen = css("--pen"), f3 = css("--f3"), ink2 = css("--ink-2"), A = o.a, B = o.b, la = len(A), lb = len(B);
    var hideAng = S.mode === "comp" && S.lock === "tc3" && !S.rev3;
    P.draw({ view:VIEW[S.mode], equal:true, xTicks:{ step:2 }, yTicks:{ step:2 },
      after:function(ctx, p){
        if (la > 1e-9 && lb > 1e-9) {
          var sc = dot(A, B) / (lb * lb), Px = B[0] * sc, Py = B[1] * sc;
          ctx.save(); ctx.globalAlpha = 0.6; ctx.strokeStyle = css("--hi"); ctx.lineWidth = 11; ctx.lineCap = "butt";
          ctx.beginPath(); ctx.moveTo(p.X(0), p.Y(0)); ctx.lineTo(p.X(Px), p.Y(Py)); ctx.stroke(); ctx.restore();
          if (sc < 0 || sc > 1) dashedPx(ctx, p.X(0), p.Y(0), p.X(Px), p.Y(Py), ink2, 1.2);
          dashedPx(ctx, p.X(A[0]), p.Y(A[1]), p.X(Px), p.Y(Py), ink2, 1.6);
          angleArc(ctx, p, A, B, o.th, 30, ink2, hideAng ? "θ = ?" : "θ");
          if (Math.abs(o.dot) < 1e-9 && !hideRA) rightMark(ctx, p, A, B);
        }
        if (S.mode === "comp" && !busy) { if (!aLocked()) tipRing(ctx, p, A); tipRing(ctx, p, B); }
        vecArrow(ctx, p, 0, 0, A[0], A[1], pen, 3.4);
        vecArrow(ctx, p, 0, 0, B[0], B[1], f3, 3.4);
        tipLabel(ctx, p, A, "a⃗", pen); tipLabel(ctx, p, B, "b⃗", f3);
        drawNote(ctx, p);
      },
      describe:(S.mode === "comp" ? "Vector a = " + MV.plain(m(vSrc(A))) + " in blue and vector b = " + MV.plain(m(vSrc(B))) + " in teal, tails at the origin" :
        "Vector a of length " + S.pa + " along the positive x-axis in blue and vector b of length " + S.pb + " in teal") +
        (o.zero ? "; one vector is zero, so there is no angle" : hideAng ? "; angle hidden" : "; angle " + MV.plain(angTxt(o.th))) + "; dot product " + (Number.isInteger(o.dot) ? pt(o.dot) : MV.plain(fx(o.dot, 2))) + "." +
        (Math.abs(o.dot) < 1e-9 && !o.zero && !hideRA ? " A right-angle mark shows the vectors are perpendicular." : "") });
  }
  function drawWork(){
    var o = info(), pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2"), prog = boxT != null ? boxT : (S.pushed ? 1 : 0), bx = prog * S.d * KD;
    var cx = bx + 1.5, cy = 1, Fx = o.a[0] * KF, Fy = o.a[1] * KF;
    P.draw({ view:VIEW.work, equal:true, grid:false, axes:false,
      after:function(ctx, p){
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.X(-1), p.Y(0)); ctx.lineTo(p.X(23), p.Y(0)); ctx.stroke();
        ctx.lineWidth = 1; for (var x = -0.5; x < 23; x += 0.8) { ctx.moveTo(p.X(x), p.Y(0)); ctx.lineTo(p.X(x - 0.5), p.Y(-0.5)); } ctx.stroke(); ctx.restore();
        ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.strokeStyle = ink; ctx.lineWidth = 2;
        ctx.fillRect(p.X(bx), p.Y(2), p.X(bx + 3) - p.X(bx), p.Y(0) - p.Y(2)); ctx.strokeRect(p.X(bx), p.Y(2), p.X(bx + 3) - p.X(bx), p.Y(0) - p.Y(2)); ctx.restore();
        vecArrow(ctx, p, 1.5, -1.7, 1.5 + S.d * KD, -1.7, f3, 3.2);
        bgText(ctx, "d⃗", p.X(1.5 + S.d * KD / 2), p.Y(-2.6), "center", f3, mfont(17));
        if (glow && Fx > 0.05) { ctx.save(); ctx.globalAlpha = 0.8; ctx.strokeStyle = css("--hi"); ctx.lineWidth = 12; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(p.X(cx), p.Y(cy)); ctx.lineTo(p.X(cx + Fx), p.Y(cy)); ctx.stroke(); ctx.restore(); }
        if (S.fa > 0 && S.fa < 90) {
          dashedPx(ctx, p.X(cx), p.Y(cy), p.X(cx + Fx), p.Y(cy), pen, 2.2);
          dashedPx(ctx, p.X(cx + Fx), p.Y(cy), p.X(cx + Fx), p.Y(cy + Fy), pen, 2.2);
        }
        vecArrow(ctx, p, cx, cy, cx + Fx, cy + Fy, pen, 3.4);
        tipLabel(ctx, { X:function(v){ return p.X(cx + v); }, Y:function(v){ return p.Y(cy + v); } }, [Fx, Fy], "F⃗", pen);
        drawNote(ctx, p);
      },
      describe:"A box on a floor. Force F of " + S.F + " N at " + S.fa + "° above the floor and displacement d of " + S.d + " m along the floor. Along the floor the force is about " + num(o.a[0], 1) + " N, lifting about " + num(o.a[1], 1) + " N. Work about " + num(o.dot, 1) + " J." });
  }

  // ---- actions ----
  function setMode(id){
    if (stop) { stop(); stop = null; } boxT = null; glow = false;
    S.mode = id; if (S.lock && LOCKMODE[S.lock] !== id) { S.lock = null; S.rev3 = false; }
  }
  function setup(n){
    setMode(n === 2 ? "polar" : "comp");
    if (n === 1) { S.lock = "tc1"; S.A = [2, 3]; }
    else if (n === 2) { S.lock = "tc2"; S.pa = 6; }
    else { S.lock = "tc3"; S.A = [4, 2]; S.rev3 = false; }
  }
  function push(cb){
    if (stop) { stop(); stop = null; }
    glow = true; boxT = 0; S.pushed = false;
    stop = MV.tween({ dur:1800, ease:function(t){ return t; }, step:function(t){ boxT = t; draw(); },
      done:function(){ stop = null; boxT = null; glow = false; S.pushed = true; api.save(); draw(); MV.changed(); if (cb) cb(); } });
  }
  host.addEventListener("input", function(e){
    var t = e.target, id = t.dataset && t.dataset.sl; if (!id || busy) return;
    note = null; S[id] = +t.value;
    if (id === "F" || id === "fa" || id === "d") { if (stop) { stop(); stop = null; } boxT = null; glow = false; S.pushed = false; }
    syncSl(); changed(false);
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b) || b.classList.contains("drag-h")) return;
    if (b.dataset.mode) { note = null; setMode(b.dataset.mode); changed(true); return; }
    if (b.dataset.setup) { note = null; setup(+b.dataset.setup); changed(true); return; }
    var a = b.dataset.act;
    if (a === "push") { note = null; push(null); return; }
    if (a === "rbox") { if (stop) { stop(); stop = null; } boxT = null; glow = false; S.pushed = false; note = null; changed(false); return; }
    if (a === "unlock") { S.lock = null; S.rev3 = false; changed(true); return; }
    if (a === "more") { showAll = !showAll; paintRead(); paintZones(); }
  });
  paintAll();

  // ---- challenges (plan's exact tests and named wrong states) ----
  function fill(s, k, v){ return String(s).split(k).join(v); }
  function chal(id, opt){
    var M = MS[id], live = opt && opt.live;
    if (id === "tc1") {
      if (S.mode !== "comp") return { ok:false, msg:M.mode };
      if (!eqv(S.A, [2, 3])) return { ok:false, msg:M.a };
      var B = S.B, d = dot(S.A, B);
      if (eqv(B, [3, -2]) || eqv(B, [-3, 2])) return { ok:true };
      if (eqv(B, [-2, 3])) return { ok:false, msg:M.swap };
      if (eqv(B, [6, -4]) || eqv(B, [-6, 4])) return { ok:false, msg:M.twice };
      if (eqv(B, [2, 3])) return { ok:false, msg:M.self };
      if (d === 0) return { ok:false, msg:fill(M.perpLen, "LEN", m(magSrc(B))) };
      return { ok:false, msg:fill(M.notZero, "NUM", m(String(d))) };
    }
    if (id === "tc2") {
      if (S.mode !== "polar") return { ok:false, msg:M.mode };
      if (S.pa !== 6) return { ok:false, msg:M.a };
      var key = S.pb + "|" + Math.round(S.th);
      if (key === "2|180" || key === "4|120") {
        if (!live) { var had = Object.keys(S.tc2).length; S.tc2[key] = 1; api.save(); if (!had || Object.keys(S.tc2).length < 2) MV.wait(30, function(){ api.banner("good", M.another); }); }
        return { ok:true };
      }
      if (key === "4|60") return { ok:false, msg:M.sign };
      if (key === "2|90") return { ok:false, msg:M.perp };
      var o = info();
      return { ok:false, msg:fill(M.notVal, "NUM", spAngle(S.th) != null ? m(trigSrc(S.pa * S.pb, COS[spAngle(S.th)])) : "≈ " + fx(o.dot, 2)) };
    }
    if (S.mode !== "comp") return { ok:false, msg:M.mode };
    if (!eqv(S.A, [4, 2])) return { ok:false, msg:M.a };
    if (!live && !S.rev3) { S.rev3 = true; api.save(); paintRead(); draw(); }
    var B3 = S.B, q = B3[0] * B3[0] + B3[1] * B3[1];
    if (eqv(B3, [1, 3]) || eqv(B3, [3, -1])) return { ok:true };
    if (eqv(B3, [3, 1])) return { ok:false, msg:M.close };
    if (eqv(B3, [-1, 3])) return { ok:false, msg:M.far };
    if (eqv(B3, [2, 4])) return { ok:false, msg:M.long };
    if (q !== 10) return { ok:false, msg:fill(M.lenNot, "LEN", m(magSrc(B3))) };
    return { ok:false, msg:fill(M.angNot, "NUM", String(Math.round(angleOf(S.A, B3)))) };
  }

  // ---- predictions ----
  function sweepTh(a, b, dur, cb){
    stop = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ S.th = a + (b - a) * t; syncSl(); paintRead(); paintZones(); draw(); },
      done:function(){ stop = null; S.th = b; syncSl(); paintRead(); paintZones(); draw(); cb(); } });
  }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; note = null; hideRA = false; glow = false; boxT = null; S.lock = null; S.rev3 = false;
        if (p.id === "p1" || p.id === "p2") { S.mode = "polar"; S.pa = 4; S.pb = 5; S.th = 0; }
        else if (p.id === "p3") { S.mode = "comp"; S.A = [3, 4]; S.B = [4, -3]; hideRA = true; }
        else { S.mode = "work"; S.F = 10; S.fa = 60; S.d = 8; S.pushed = false; }
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; hideRA = false; glow = false; boxT = null; lock(false); api.save(); paintAll(); MV.changed(); done(); }
        if (p.id === "p1") sweepTh(0, 60, 1800, function(){ note = "20 → 10"; draw(); MV.wait(1300, fin); });
        else if (p.id === "p2") sweepTh(0, 180, 4200, function(){ note = "20 → 0 → " + MINUS + "20"; draw(); MV.wait(1300, fin); });
        else if (p.id === "p3") MV.wait(700, function(){ hideRA = false; note = "(3)(4) + (4)(" + MINUS + "3) = 0"; draw(); MV.wait(1500, fin); });
        else push(function(){ note = "5 N × 8 m = 40 J"; draw(); MV.wait(1300, fin); });
      }
    },
    challenge:function(id, opt){ return chal(id, opt); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Properties of the dot product (property lab: six cards, three draggable vectors) ----------
var LAB_HANDLES = { comm:["a", "b"], dist:["a", "b", "c"], scal:["a", "b"], self:["a"], perp:["a", "b"], assoc:["a", "b", "c"] };
function part3(host, api){
  var S = api.S, C = api.content, L = C.labels, CARDS = C.cards;
  if (!LAB_HANDLES[S.pcard]) S.pcard = "comm";
  if (!okVec(S.pA, 6)) S.pA = [3, 2];
  if (!okVec(S.pB, 6)) S.pB = [2, 3];
  if (!okVec(S.pC, 6)) S.pC = [1, -2];
  if (typeof S.pk !== "number" || S.pk < -3 || S.pk > 3) S.pk = 2;
  S.ptried = S.ptried || {}; S.pas = S.pas ? 1 : 0;
  var al = C.algebra;
  host.innerHTML = '<div class="dp-lab"><p class="tiny dp-h">' + L.cardsH + '</p><div class="dp-cards" id="dp-cards" role="group" aria-label="' + MV.esc(MV.plain(L.cardsH)) + '"></div>' +
    '<div class="dp-labgrid"><div><div class="plot-wrap"><canvas class="plot square" id="dp-lcv" role="img" aria-label="Property lab vectors"></canvas></div><p class="tiny muted">' + L.drag + "</p></div>" +
    '<div class="dp-lside" id="dp-lside"></div></div>' +
    '<details class="alg"><summary>' + al.title + '</summary><div class="alg-lines">' + al.proofs.map(function(pr){
      return '<p class="dp-prh"><strong>' + pr.h + "</strong></p>" + pr.lines.map(function(l){ return "<div>" + MV.md(l) + "</div>"; }).join(""); }).join("") + "</div></details></div>";
  var P = new MV.Plot($("#dp-lcv", host), { xmin:-7, xmax:7, ymin:-7, ymax:7 });
  P.render = draw;
  function card(){ return CARDS.filter(function(c){ return c.id === S.pcard; })[0]; }
  var KEY = { a:"pA", b:"pB", c:"pC" }, NAME = { a:"a", b:"b", c:"c" };
  MV.drag(P, {
    handles:function(){ return LAB_HANDLES[S.pcard].map(function(k){ var v = S[KEY[k]]; return { id:k, x:v[0], y:v[1], label:"Tip of vector " + NAME[k] + " at (" + pt(v[0]) + ", " + pt(v[1]) + ")" }; }); },
    move:function(id, x, y){ var v = [clamp(Math.round(x), -6, 6), clamp(Math.round(y), -6, 6)]; if (eqv(S[KEY[id]], v)) return; S[KEY[id]] = v; upd(); },
    step:{ x:1, y:1 }, big:2
  });
  function stateKey(){ var k = S.pcard, s = LAB_HANDLES[k].map(function(h){ return S[KEY[h]].join(","); }).join("|"); return k === "scal" ? s + "|" + S.pk : s; }
  function noteTried(){ var k = S.pcard, t = S.ptried[k] || (S.ptried[k] = []), s = stateKey(); if (t.indexOf(s) < 0 && t.length < 99) t.push(s); return t.length; }
  function sc(v, k){ return [v[0] * k, v[1] * k]; }
  function nv(v){ return "(" + num(v[0]) + ", " + num(v[1]) + ")"; }
  function paintCards(){
    var el = $("#dp-cards", host);
    MV.keepFocus(el, function(){ el.innerHTML = CARDS.map(function(c, i){ return '<button type="button" class="btn ghost sm dp-card" data-card="' + c.id + '" data-k="dpcard' + c.id + '" aria-pressed="' + (c.id === S.pcard) + '">' + (i + 1) + ". " + c.t + "</button>"; }).join(""); });
  }
  function eqRows(rows){ return '<dl class="read dp-lread">' + MV.readoutHTML(rows) + "</dl>"; }
  function paintStatic(){
    var c = card(), el = $("#dp-lside", host), h = '<p class="dp-law">' + c.law + '</p><p class="tiny muted">' + c.note + "</p>";
    if (c.id === "scal") h += slHTML("pk", L.k, -3, 3, 0.5, S.pk, num(S.pk), "--acol") + '<p class="tiny muted">' + L.kNote + "</p>";
    el.innerHTML = h + '<div id="dp-lrows"></div>';
  }
  function paintSide(){
    var c = card(), A = S.pA, B = S.pB, Cc = S.pC, el = $("#dp-lrows", host), h = "", agree = true, rows = null, n = noteTried();
    var ab = dot(A, B);
    if (c.id === "comm") rows = [[L.left, m("vec{a} · vec{b} = (" + A[0] + ")(" + B[0] + ") + (" + A[1] + ")(" + B[1] + ") = " + ab)], [L.right, m("vec{b} · vec{a} = (" + B[0] + ")(" + A[0] + ") + (" + B[1] + ")(" + A[1] + ") = " + dot(B, A))]];
    else if (c.id === "dist") { var bc = [B[0] + Cc[0], B[1] + Cc[1]], ac = dot(A, Cc);
      rows = [[L.left, m("vec{a} · (vec{b} + vec{c}) = " + vSrc(A) + " · " + vSrc(bc) + " = " + dot(A, bc))], [L.right, m("vec{a} · vec{b} + vec{a} · vec{c} = " + ab + " + " + (ac < 0 ? "(" + ac + ")" : ac) + " = " + (ab + ac))]]; }
    else if (c.id === "scal") { var kA = sc(A, S.pk);
      rows = [[L.left, m("(@a{k}vec{a}) · vec{b} = " + nv(kA).replace(/−/g, "-") + " · " + vSrc(B)) + " = " + num(dot(kA, B))], [L.right, m("@a{k}(vec{a} · vec{b}) = " + num(S.pk).replace(/−/g, "-") + " × " + (ab < 0 ? "(" + ab + ")" : ab)) + " = " + num(S.pk * ab)]]; }
    else if (c.id === "self") rows = [[L.left, m("vec{a} · vec{a} = (" + A[0] + ")(" + A[0] + ") + (" + A[1] + ")(" + A[1] + ") = " + dot(A, A))], [L.right, m("|vec{a}|^2 = (" + magSrc(A) + ")^2 = " + dot(A, A))]];
    else if (c.id === "perp") {
      var th = angleOf(A, B);
      if (th == null) { agree = null; rows = [[L.left, m("vec{a} · vec{b} = " + ab)], [L.right, L.nonzero]]; }
      else { var isP = spAngle(th) === 90; rows = [[L.left, m("vec{a} · vec{b} = " + ab)], [L.right, angTxt(th) + ": " + (isP ? L.perpYes : L.perpNo)]]; agree = (ab === 0) === isP; }
    }
    if (c.id === "assoc") {
      var bcd = dot(B, Cc), v1 = sc(Cc, ab), v2 = sc(A, bcd);
      h += '<div class="dp-assoc"><p class="dp-aexpr">' + (S.pas ? m(ab + " · vec{c}") : m("(vec{a} · vec{b}) · vec{c}")) + "</p>" +
        '<div class="q-actions">' + (S.pas ? '<button type="button" class="btn ghost sm" disabled data-k="dpas2">' + L.step2 + '</button><button type="button" class="btn ghost sm" data-as="0" data-k="dpas0">' + L.restart + "</button>" :
          '<button type="button" class="btn primary sm" data-as="1" data-k="dpas1">' + L.step1 + "</button>") + "</div>";
      if (S.pas) h += MV.fbHTML("bad", "<strong>✗</strong> " + L.stuck.split("NUM").join(String(ab).replace("-", MINUS))) +
        '<p class="dp-h tiny">' + L.compareH + "</p>" + eqRows([[m("(vec{a} · vec{b})vec{c}"), m(ab + vSrc(Cc) + " = " + vSrc(v1)) + ", " + L.alongC], [m("vec{a}(vec{b} · vec{c})"), m(vSrc(A) + "(" + bcd + ") = " + vSrc(v2)) + ", " + L.alongA]]) +
          '<p class="tiny">' + L.diffNote + "</p>";
      h += "</div>";
    } else {
      h += eqRows(rows);
      h += '<p class="dp-agree" aria-live="polite">' + (agree === null ? L.nonzero : agree ? "<strong>" + L.agree + "</strong> (" + n + " " + L.tried + ")" : "<strong>" + L.differ + "</strong>") + (n < 3 ? " " + muted(L.more) : "") + "</p>";
    }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function fit(v){ var L2 = len(v); return L2 > 6.5 ? { v:sc(v, 6.5 / L2), cut:true } : { v:v, cut:false }; }
  function draw(){
    var c = S.pcard, A = S.pA, B = S.pB, Cc = S.pC, pen = css("--pen"), f3 = css("--f3"), f5 = css("--f5"), ink = css("--ink"), ink2 = css("--ink-2"), vio = css("--acol");
    var desc = "Vectors from the origin: a = " + MV.plain(m(vSrc(A))) + (c !== "self" ? ", b = " + MV.plain(m(vSrc(B))) : "") + (c === "dist" || c === "assoc" ? ", c = " + MV.plain(m(vSrc(Cc))) : "") + ".";
    P.draw({ view:{ xmin:-7, xmax:7, ymin:-7, ymax:7 }, equal:true, xTicks:{ step:2 }, yTicks:{ step:2 },
      after:function(ctx, p){
        LAB_HANDLES[c].forEach(function(k){ tipRing(ctx, p, S[KEY[k]]); });
        if (c === "comm") angleArc(ctx, p, A, B, angleOf(A, B), 28, ink2, "θ");
        if (c === "dist") {
          var la = len(A);
          if (la > 0) {
            var u = [A[0] / la, A[1] / la], sb = dot(B, u), scc = dot(Cc, u), ux = u[0], uy = -u[1], off = 7;
            ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(p.X(-12 * u[0]), p.Y(-12 * u[1])); ctx.lineTo(p.X(12 * u[0]), p.Y(12 * u[1])); ctx.stroke(); ctx.restore();
            function band(s0, s1, color, o){ ctx.save(); ctx.globalAlpha = 0.7; ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.beginPath();
              ctx.moveTo(p.X(s0 * u[0]) - uy * o, p.Y(s0 * u[1]) + ux * o); ctx.lineTo(p.X(s1 * u[0]) - uy * o, p.Y(s1 * u[1]) + ux * o); ctx.stroke(); ctx.restore(); }
            band(0, sb, f3, off); band(sb, sb + scc, f5, off); band(0, sb + scc, ink, -off);
          }
          vecArrow(ctx, p, B[0], B[1], B[0] + Cc[0], B[1] + Cc[1], f5, 2, [6, 5]);
          vecArrow(ctx, p, 0, 0, B[0] + Cc[0], B[1] + Cc[1], ink, 2.4, [7, 5]);
          tipLabel(ctx, p, [B[0] + Cc[0], B[1] + Cc[1]], "b⃗ + c⃗", ink, 26);
        }
        if (c === "scal") { var kA = sc(A, S.pk); vecArrow(ctx, p, 0, 0, kA[0], kA[1], vio, 5, null); }
        if (c === "perp" && dot(A, B) === 0) rightMark(ctx, p, A, B);
        if (c === "perp") { vecArrow(ctx, p, 0, 0, 1, 0, ink2, 2); vecArrow(ctx, p, 0, 0, 0, 1, ink2, 2); }
        if (c === "assoc" && S.pas) {
          var r1v = fit(sc(Cc, dot(A, B))), r2v = fit(sc(A, dot(B, Cc)));
          vecArrow(ctx, p, 0, 0, r1v.v[0], r1v.v[1], f5, 2.4, [7, 5]); vecArrow(ctx, p, 0, 0, r2v.v[0], r2v.v[1], pen, 2.4, [7, 5]);
          if (r1v.cut || r2v.cut) bgText(ctx, MV.plain(L.scaleNote), 8, p.H - 16, "left", ink2, ui(12, 600));
        }
        vecArrow(ctx, p, 0, 0, A[0], A[1], pen, 3.4);
        if (c !== "self") vecArrow(ctx, p, 0, 0, B[0], B[1], f3, 3.4);
        if (c === "dist" || c === "assoc") vecArrow(ctx, p, 0, 0, Cc[0], Cc[1], f5, 3.4);
        tipLabel(ctx, p, A, "a⃗", pen);
        if (c !== "self") tipLabel(ctx, p, B, "b⃗", f3);
        if (c === "dist" || c === "assoc") tipLabel(ctx, p, Cc, "c⃗", f5);
        if (c === "scal") tipLabel(ctx, p, sc(A, S.pk), "ka⃗", vio, 30);
      },
      describe:desc + (c === "scal" ? " The violet arrow is k a with k = " + MV.plain(num(S.pk)) + "." : c === "dist" ? " Shadows on a’s line: b’s shadow plus c’s shadow equals the shadow of b + c." : "") });
  }
  function upd(){ api.save(); paintSide(); draw(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.classList.contains("drag-h")) return;
    if (b.dataset.card) { S.pcard = b.dataset.card; paintCards(); paintStatic(); upd(); return; }
    if (b.dataset.as != null) { S.pas = +b.dataset.as; upd(); }
  });
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || t.dataset.sl !== "pk") return; S.pk = +t.value; var o = $("#dp-o-pk", host); if (o) o.textContent = num(S.pk); t.setAttribute("aria-valuetext", num(S.pk)); api.save(); paintSide(); draw(); });
  paintCards(); paintStatic(); paintSide(); draw();
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Angles and perpendicular vectors (number boxes, chips; first-try scoring, three-level help) ----------
function anglesAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function box(it, k, label, unit, val, dis){
    return '<label class="dp-box"><span class="dp-bl">' + (label || "") + '</span><input class="numin short" data-bx="' + k + '" data-k="bx' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(MV.plain(label || "") || "Answer") + '" value="' + MV.esc(val || "") + '"' + (dis ? " disabled" : "") + ">" + (unit ? '<span class="dp-un">' + unit + "</span>" : "") + "</label>";
  }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it, i){
    return '<div class="q dp-q" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="dp-in"></div><div class="dp-cl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .dp-in', host), h = "";
    if (it.kind === "chips") h = '<div class="chips" role="group" aria-label="' + MV.esc(MV.plain(it.prompt)) + '">' + it.choices.map(function(c){ return '<button type="button" class="chip' + (x.v.ch === c.id ? " on" : "") + '" data-ch="' + c.id + '" data-k="ch' + it.id + c.id + '" aria-pressed="' + (x.v.ch === c.id) + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    else if (it.kind === "pair") h = '<div class="inrow">' + it.boxes.map(function(bx){ return box(it, bx.k, bx.label, bx.unit, x.v[bx.k], x.solved); }).join("") + "</div>";
    else h = '<div class="inrow">' + box(it, "v", it.label || "", it.unit, x.v.v, x.solved) + "</div>" + (it.note ? '<p class="tiny muted">' + it.note + "</p>" : "");
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .dp-cl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function one(raw){ var s = String(raw == null ? "" : raw).replace(/°/g, "").trim(); if (!s) return { blank:true }; var r = MV.parseNum(s); return r && r.length === 1 ? { v:r[0] } : { err:true }; }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), W = it.wrong || [], i;
    if (it.kind === "chips") {
      if (!x.v.ch) return { err:TX.pick };
      if (x.v.ch === ans) return { ok:true };
      for (i = 0; i < W.length; i++) if (W[i].v === x.v.ch) return { msg:W[i].fb };
      return { msg:it.general || TX.general };
    }
    if (it.kind === "pair") {
      var got = {};
      for (i = 0; i < it.boxes.length; i++) { var r = one(x.v[it.boxes[i].k]); if (r.blank) return { err:TX.fill }; if (r.err) return { err:TX.err }; got[it.boxes[i].k] = r.v; }
      var okAll = it.boxes.every(function(bx){ return near(got[bx.k], ans[bx.k], 1e-6); });
      return okAll ? { ok:true } : { msg:it.general || TX.general };
    }
    if (it.kind === "set") {
      var s = String(x.v.v == null ? "" : x.v.v).replace(/°/g, "").trim(); if (!s) return { err:TX.fill };
      var list = MV.parseList(s); if (!list) return { err:TX.err };
      if (MV.sameNums(list, ans, 1e-6)) return { ok:true };
      var some = list.some(function(v){ return ans.some(function(w){ return near(v, w, 1e-6); }); });
      return { msg:some ? it.partial : (it.general || TX.general) };
    }
    var r1x = one(x.v.v); if (r1x.blank) return { err:TX.fill }; if (r1x.err) return { err:TX.err };
    if (near(r1x.v, ans, 1e-6)) return { ok:true };
    for (i = 0; i < W.length; i++) if (near(r1x.v, W[i].v, 1e-6)) return { msg:W[i].fb };
    return { msg:it.general || TX.general };
  }
  function find(q){ return a.items.filter(function(z){ return z.id === q.dataset.q; })[0]; }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = find(q), x = ist(it.id);
    if (b.dataset.ch) { x.v.ch = b.dataset.ch; msgs[it.id] = null; api.save(); paintIn(it); paintCl(it); return; }
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
// ---------- Performance task: Design the rhombus (parallelogram from a⃗ = AB⃗ and b⃗ = AD⃗) ----------
var task = (function(){
  var api, plot, KS = ["a1", "a2", "b1", "b2"];
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -6 && v <= 6 ? v : null; }
  function read(){ var v = KS.map(gi); return { a:[v[0], v[1]], b:[v[2], v[3]], valid:v.every(function(x){ return x !== null; }) }; }
  function checks(D){ if (!D.valid) return [false, false, false]; var s = [D.a[0] + D.b[0], D.a[1] + D.b[1]], d = [D.a[0] - D.b[0], D.a[1] - D.b[1]]; return [dot(s, d) === 0, dot(D.a, D.a) === 25, dot(D.a, D.b) === -7]; }
  function preview(){
    var D = read(), Lb = api.content.labels, RW = Lb.rows, rd = $("#rh-read");
    if (!D.valid) { if (rd) rd.innerHTML = '<p class="tiny muted">' + Lb.invalid + "</p>"; plot.draw({ view:{ xmin:-7, xmax:7, ymin:-7, ymax:7 }, equal:true, describe:"Empty grid: choose whole-number components." }); return; }
    var A = D.a, B = D.b, Cp = [A[0] + B[0], A[1] + B[1]], s = Cp, df = [A[0] - B[0], A[1] - B[1]], th = angleOf(A, B), dd = dot(s, df);
    var xs = [0, A[0], B[0], Cp[0]], ys = [0, A[1], B[1], Cp[1]];
    var V = { xmin:Math.min(-3, Math.min.apply(null, xs) - 2), xmax:Math.max(3, Math.max.apply(null, xs) + 2), ymin:Math.min(-3, Math.min.apply(null, ys) - 2), ymax:Math.max(3, Math.max.apply(null, ys) + 2) };
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML([
      [RW.a, m(vSrc(A))], [RW.b, m(vSrc(B))],
      [RW.diag, m(vSrc(Cp) + " · " + vSrc(df) + " = " + dd)],
      [RW.side, m(magSrc(A))], [RW.dot, m(String(dot(A, B)))],
      [RW.angA, th == null ? "—" : angTxt(th)]]) + "</dl>";
    var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2");
    plot.draw({ view:V, equal:true, xTicks:{ step:2 }, yTicks:{ step:2 },
      after:function(ctx, p){
        ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = css("--hi-soft"); ctx.beginPath(); ctx.moveTo(p.X(0), p.Y(0)); ctx.lineTo(p.X(A[0]), p.Y(A[1])); ctx.lineTo(p.X(Cp[0]), p.Y(Cp[1])); ctx.lineTo(p.X(B[0]), p.Y(B[1])); ctx.closePath(); ctx.fill(); ctx.restore();
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(p.X(A[0]), p.Y(A[1])); ctx.lineTo(p.X(Cp[0]), p.Y(Cp[1])); ctx.lineTo(p.X(B[0]), p.Y(B[1])); ctx.stroke(); ctx.restore();
        dashedPx(ctx, p.X(0), p.Y(0), p.X(Cp[0]), p.Y(Cp[1]), ink, 2);
        dashedPx(ctx, p.X(B[0]), p.Y(B[1]), p.X(A[0]), p.Y(A[1]), ink, 2);
        if (dd === 0 && len(s) > 0 && len(df) > 0) rightMark(ctx, p, s, df, [Cp[0] / 2, Cp[1] / 2]);
        if (th != null) angleArc(ctx, p, A, B, th, 24, ink2, null);
        vecArrow(ctx, p, 0, 0, A[0], A[1], pen, 3.2); vecArrow(ctx, p, 0, 0, B[0], B[1], f3, 3.2);
        [["A", [0, 0]], ["B", A], ["C", Cp], ["D", B]].forEach(function(q){
          var cx = Cp[0] / 2, cy = Cp[1] / 2, dx = q[1][0] - cx, dy = q[1][1] - cy, L = Math.hypot(dx, dy) || 1;
          bgText(ctx, q[0], p.X(q[1][0]) + dx / L * 16, p.Y(q[1][1]) - dy / L * 16, "center", ink, mfont(15));
        });
      },
      describe:"Parallelogram ABCD with A at the origin, B at " + MV.plain(m(vSrc(A))) + ", D at " + MV.plain(m(vSrc(B))) + " and C at " + MV.plain(m(vSrc(Cp))) + ". Diagonals AC and DB" + (dd === 0 ? " meet at a right angle." : " are not perpendicular.") + (th == null ? "" : " Angle at A " + MV.plain(angTxt(th)) + ".") });
  }
  function stepper(k){
    var Lb = api.content.labels;
    return '<div class="rh-step"><label for="rh-' + k + '"><span class="m">' + Lb[k] + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="rh' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="rh-' + k + '" data-tk="' + k + '" type="number" min="-6" max="6" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="rh' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var Lb = a.content.labels;
      if (a.S.a1 == null) { a.S.a1 = "4"; a.S.a2 = "1"; a.S.b1 = "1"; a.S.b2 = "3"; }
      inp.innerHTML = '<div class="rh-in"><p class="tiny" style="font-weight:700;margin:0">' + m("vec{a} = (a_1, a_2)") + ", " + m("vec{b} = (b_1, b_2)") + ' <span class="muted">' + Lb.range + "</span></p>" + KS.map(stepper).join("") + "</div>";
      pv.innerHTML = '<div id="rh-read" aria-live="polite"></div><p class="tiny rh-gh">' + Lb.graph + '</p><div class="plot-wrap"><canvas class="plot square" id="rh-plot" role="img" aria-label="Parallelogram ABCD"></canvas></div>';
      plot = new MV.Plot($("#rh-plot"), { xmin:-7, xmax:7, ymin:-7, ymax:7 }); plot.render = preview;
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -6, 6)); $("#rh-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : api.content.labels.invalid; },
    checks:checks,
    key:function(D){ return D.a.concat(D.b).join("|"); },
    label:function(k){ var v = k.split("|"); return m("vec{a} = (" + v[0] + ", " + v[1] + "), vec{b} = (" + v[2] + ", " + v[3] + ")"); },
    text:function(k){ var v = k.split("|").map(pt); return "a = (" + v[0] + ", " + v[1] + "), b = (" + v[2] + ", " + v[3] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ angles:anglesAct },
  task:task
});

})();
