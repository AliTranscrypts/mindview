// MHF4U 39 Transformations of Log Functions: hero storyboard, Domain wall explorer (Transform and Stretch or shift? views),
// "Wall, domain and key points by hand" builder (Part 3), Work backwards boxes (Practice 3), "Rising to the wall" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, m = MV.m;
function fill(t, o){ return String(t == null ? "" : t).replace(/\{(\w+)\}/g, function(s, k){ return o[k] != null ? o[k] : s; }); }
function def(o, d){ Object.keys(d).forEach(function(k){ if (o[k] == null) o[k] = JSON.parse(JSON.stringify(d[k])); }); return o; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function near(a, b, e){ return Math.abs(a - b) < (e || 1e-9); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function isInt(v){ return near(v, Math.round(v)); }
function r2(v){ return Math.round(v * 2) / 2; }
var LIN = function(t){ return t; };

// ---------- exact rationals ----------
// @component exactQ (adapted from MHF4U 32 exactPiQ) — rationals {n, d} with m() sources (inline "13/4" or stacked)
function Q(n, d){ if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); n = n / g; return { n:n === 0 ? 0 : n, d:d / g }; }
function qAdd(a, b){ return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
function qSub(a, b){ return Q(a.n * b.d - b.n * a.d, a.d * b.d); }
function qMul(a, b){ return Q(a.n * b.n, a.d * b.d); }
function qDiv(a, b){ return Q(a.n * b.d, a.d * b.n); }
function qNeg(a){ return Q(-a.n, a.d); }
function qV(a){ return a.n / a.d; }
function qOf(v){ if (!isFinite(v)) return null; for (var d = 1; d <= 64; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return Q(n, d); } return null; }
function qq(v){ return qOf(v) || Q(Math.round(v * 1000), 1000); }
function qSrc(q, st){ if (q.d === 1) return String(q.n); var a = Math.abs(q.n); return (q.n < 0 ? "-" : "") + (st ? "{" + a + "}/{" + q.d + "}" : a + "/" + q.d); }
function qT(q){ return qSrc(q).replace(/-/g, MINUS); }
function ptSrc(x, y, st){ return "(" + qSrc(x, st) + ", " + qSrc(y, st) + ")"; }
function ptT(x, y){ return "(" + qT(x) + ", " + qT(y) + ")"; }
function pS(v){ return String(Math.round(v * 1000) / 1000); }            // m() source of a slider value (halves as decimals)
function ap(v){ return num(v, 2); }                                         // approximate value, 2 decimal places

// ---------- logs ----------
function logb(t, b){ return Math.log(t) / Math.log(b); }
// integer n with b^n = q exactly (q a positive rational), or null
function powExp(q, b){
  if (!q || q.n <= 0) return null;
  var L = logb(qV(q), b), n = Math.round(L); if (Math.abs(L - n) > 1e-9) return null;
  return n >= 0 ? (q.d === 1 && Math.pow(b, n) === q.n ? n : null) : (q.n === 1 && Math.pow(b, -n) === q.d ? n : null);
}
function yv(r){ return r.ok ? m("y " + (r.exact ? "= " : "≈ ") + r.s) : "no value"; }
function fOf(P){ return function(x){ var t = P.k * (x - P.d); return t > 0 ? P.a * logb(t, P.b) + P.c : NaN; }; }
function onGraph(P, x0, y0){ var t = P.k * (x0 - P.d); return t > 0 && Math.abs(P.a * logb(t, P.b) + P.c - y0) < 1e-9; }
// value of the graph at x, as {ok, exact, v, html}
function valAt(P, x){
  var t = qMul(qq(P.k), qSub(qq(x), qq(P.d)));
  if (t.n <= 0) return { ok:false };
  var n = powExp(t, P.b);
  if (n != null) { var y = P.a * n + P.c; return { ok:true, exact:true, v:y, s:qT(qq(y)) }; }
  var v = P.a * logb(qV(t), P.b) + P.c; return { ok:true, exact:false, v:v, s:ap(v) };
}
var PCOL = { a:"--acol", k:"--p-k", d:"--p-d", c:"--p-c", b:"--p-b" };
function cols(){ return { ink:css("--ink"), ink2:css("--ink-2"), pen:css("--pen"), ac:css("--acol"), pk:css("--p-k"), pd:css("--p-d"), pc:css("--p-c"), pb:css("--p-b"), hi:css("--hi"), hs:css("--hi-soft"), rule:css("--rule"), red:css("--red"), sheet:css("--sheet") }; }

// ---------- equations as m() sources (col: parameter colours) ----------
function aPre(a, col){ if (near(a, 1)) return ""; if (near(a, -1)) return col ? "@a{-}" : "-"; return (col ? "@a{" + pS(a) + "}" : pS(a)) + " "; }
function cTail(c, col){ if (near(c, 0)) return ""; var s = pS(Math.abs(c)); return (c > 0 ? " + " : " - ") + (col ? "@c{" + s + "}" : s); }
function xdS(d, col){ if (near(d, 0)) return "x"; var s = pS(Math.abs(d)); return "x " + (d > 0 ? "- " : "+ ") + (col ? "@d{" + s + "}" : s); }
function kS(k, col){ var s = near(k, -1) ? "-" : qSrc(qq(k), true); return col ? "@k{" + s + "}" : s; }
function inWrap(k, d, col){
  if (near(k, 1)) return near(d, 0) ? " x" : "(" + xdS(d, col) + ")";
  if (near(d, 0)) return "(" + kS(k, col) + "x)";
  return "[" + kS(k, col) + "(" + xdS(d, col) + ")]";
}
function logS(b, col){ return b === 10 ? "log" : "log_{" + (col ? "@b{" + b + "}" : b) + "}"; }
function eqSrc(P, col){ return "y = " + aPre(P.a, col) + logS(P.b, col) + inWrap(P.k, P.d, col) + cTail(P.c, col); }
function kPre(k){ var K = qq(k); return near(k, 1) ? "" : near(k, -1) ? "-" : K.d === 1 ? String(K.n) : "(" + qSrc(K) + ")"; }
function factS(k, d){ var xd = xdS(d, false); if (near(k, 1)) return xd; return kPre(k) + (near(d, 0) ? "x" : "(" + xd + ")"); }
function expS(k, d){
  var K = qq(k), kx = K.d === 1 ? (K.n === 1 ? "" : K.n === -1 ? "-" : String(K.n)) + "x" : (K.n < 0 ? "-" : "") + (Math.abs(K.n) === 1 ? "" : Math.abs(K.n)) + "x/" + K.d;
  var c0 = qNeg(qMul(K, qq(d)));
  return c0.n ? kx + (c0.n > 0 ? " + " : " - ") + qSrc(Q(Math.abs(c0.n), c0.d)) : kx;
}
function subS(k, d, p){ var pd = near(d, 0) ? pS(p) : pS(p) + (d > 0 ? " - " : " + ") + pS(Math.abs(d)); return near(k, 1) ? pd : kPre(k) + "(" + pd + ")"; }
function ruleSrc(P, col){
  var K = qq(P.k), inv = qDiv(Q(1), K), C = function(p, s){ return col ? "@" + p + "{" + s + "}" : s; }, xs;
  if (inv.d === 1) xs = (inv.n === 1 ? "" : C("k", inv.n === -1 ? "-" : String(inv.n))) + "x";
  else xs = "x/" + (K.n < 0 ? "(" + C("k", qSrc(K)) + ")" : C("k", qSrc(K)));
  if (!near(P.d, 0)) xs += (P.d > 0 ? " + " : " - ") + C("d", pS(Math.abs(P.d)));
  var ys = (near(P.a, 1) ? "" : C("a", near(P.a, -1) ? "-" : pS(P.a))) + "y" + cTail(P.c, col);
  return "(x, y) -> (" + xs + ", " + ys + ")";
}
function cv(p, s){ return m("@" + p + "{" + s + "}"); }
function units(v){ return Math.abs(v) === 1 ? " unit " : " units "; }
function descHTML(P){
  var A = Math.abs(P.a), K = Math.abs(P.k), inv = qDiv(Q(1), qq(K)), v = [], h = [], t = [], first = [];
  if (A > 1 + 1e-9) v.push("vertical stretch by a factor of " + cv("a", pS(A))); else if (A < 1 - 1e-9) v.push("vertical compression by a factor of " + cv("a", pS(A)));
  if (P.a < 0) v.push("reflection in the " + m("x") + "-axis");
  if (K > 1 + 1e-9) h.push("horizontal compression by a factor of " + cv("k", qSrc(inv))); else if (K < 1 - 1e-9) h.push("horizontal stretch by a factor of " + cv("k", qSrc(inv)));
  if (P.k < 0) h.push("reflection in the " + m("y") + "-axis");
  if (v.length) first.push(v.join(" and ")); if (h.length) first.push(h.join(" and "));
  if (!near(P.d, 0)) t.push(cv("d", pS(Math.abs(P.d))) + units(P.d) + (P.d > 0 ? "right" : "left"));
  if (!near(P.c, 0)) t.push(cv("c", pS(Math.abs(P.c))) + units(P.c) + (P.c > 0 ? "up" : "down"));
  var s = first.join("; ");
  if (t.length) s += (s ? "; then " : "") + "translation " + t.join(" and ");
  return s ? MV.cap(s) : "None: this is the parent " + m("y = " + logS(P.b) + " x") + ".";
}
function parents(b){ return [[Q(1, b), Q(-1)], [Q(1), Q(0)], [Q(b), Q(1)], [Q(b * b), Q(2)]]; }
function imgOf(P, pt){ return [qAdd(qDiv(pt[0], qq(P.k)), qq(P.d)), qAdd(qMul(qq(P.a), pt[1]), qq(P.c))]; }
function domSet(P){ return "{x ∈ ℝ | x " + (P.k > 0 ? ">" : "<") + " " + pS(P.d) + "}"; }
function domIv(P){ return P.k > 0 ? "(" + pS(P.d) + ", ∞)" : "(-∞, " + pS(P.d) + ")"; }
// x-intercept: k(x − d) = b^(−c/a)
function xInt(P){
  var r = qDiv(qNeg(qq(P.c)), qq(P.a)), rv = qV(r), B = Math.pow(P.b, rv), x = P.d + B / P.k, dir = P.k > 0 ? "right" : "left";
  if (B > 10000 || B < 1e-4) {
    var K = qq(P.k), inv = qDiv(Q(1), K), pw = P.b + "^{" + (r.d === 1 ? String(r.n) : qSrc(r)) + "}";
    var term = inv.d === 1 ? (Math.abs(inv.n) === 1 ? "" : Math.abs(inv.n) + " · ") + pw : pw + "/" + Math.abs(K.n);
    var src = "x = " + (near(P.d, 0) ? (P.k < 0 ? "-" : "") : pS(P.d) + (P.k > 0 ? " + " : " - ")) + term;
    return { x:x, html:m(src) + ": " + (B > 10000 ? "far off the screen to the " + dir : "just " + dir + " of the wall"), plain:MV.plain(m(src)) };
  }
  if (r.d === 1) { var X = qAdd(qq(P.d), qDiv(r.n >= 0 ? Q(Math.pow(P.b, r.n)) : Q(1, Math.pow(P.b, -r.n)), qq(P.k))); return { x:x, html:m(ptSrc(X, Q(0), true)), plain:ptT(X, Q(0)) }; }
  return { x:x, html:m("(" + ap(x) + ", 0)") + ", approximately", plain:"(" + ap(x) + ", 0), approximately" };
}

// ---------- canvas helpers ----------
// @component G11 canvasFracLabel (from MHF4U 32 / 20) — canvas labels with stacked fractions and per-token colours: toks = [{t, c, i (italic)} | {fn, fd, c}]
var LBL = null;   // label boxes already drawn in the current scene (simple collision avoidance)
function hit(r){ return !!LBL && LBL.some(function(q){ return r.x < q.x + q.w && q.x < r.x + r.w && r.y < q.y + q.h && q.y < r.y + r.h; }); }
function drawToks(ctx, p, toks, X, Y, o){
  o = o || {};
  var sz = o.size || 14, fs = Math.round(sz * 0.8), fm = p.fontM || "serif", ink = css("--ink");
  var fontOf = function(tk){ return (tk.i ? "italic " : "") + "600 " + sz + "px " + fm; };
  ctx.save();
  var ws = toks.map(function(tk){ if (tk.fn != null) { ctx.font = "600 " + fs + "px " + fm; return Math.max(ctx.measureText(tk.fn).width, ctx.measureText(tk.fd).width) + 4; } ctx.font = fontOf(tk); return ctx.measureText(tk.t).width; });
  var w = ws.reduce(function(s, x){ return s + x; }, 0), hasF = toks.some(function(tk){ return tk.fn != null; }), hh = hasF ? sz * 1.75 : sz * 1.2;
  var place = function(X, Y, al){ var x0 = al === "right" ? X - w : al === "center" ? X - w / 2 : X; x0 = clamp(x0, 3, Math.max(3, p.W - w - 3)); Y = clamp(Y, hh / 2 + 1, p.H - hh / 2 - 1); return { x0:x0, Y:Y, r:{ x:x0 - 3, y:Y - hh / 2, w:w + 6, h:hh } }; };
  var cand = [[X, Y, o.align]].concat(o.alts || []), pl = null;
  for (var c = 0; c < cand.length; c++) { var t = place(cand[c][0], cand[c][1], cand[c][2] || o.align); if (!hit(t.r)) { pl = t; break; } }
  if (!pl) { if (o.skip) { ctx.restore(); return null; } pl = place(X, Y, o.align); }
  if (LBL) LBL.push(pl.r);
  var x0 = pl.x0; Y = pl.Y;
  if (o.bg !== false) { ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, Y - hh / 2, w + 6, hh); ctx.globalAlpha = 1; }
  ctx.textBaseline = "middle";
  var x = x0;
  toks.forEach(function(tk, i){
    ctx.fillStyle = tk.c || o.color || ink;
    if (tk.fn != null) {
      ctx.font = "600 " + fs + "px " + fm; ctx.textAlign = "center";
      ctx.fillText(tk.fn, x + ws[i] / 2, Y - fs * 0.6); ctx.fillText(tk.fd, x + ws[i] / 2, Y + fs * 0.66);
      ctx.fillRect(x + 1.5, Y - 0.6, ws[i] - 3, 1.3);
    } else { ctx.font = fontOf(tk); ctx.textAlign = "left"; ctx.fillText(tk.t, x, Y); }
    x += ws[i];
  });
  ctx.restore();
  return { x:x0, w:w, h:hh };
}
function qTok(q, c){ if (q.d === 1) return [{ t:qT(q), c:c }]; return (q.n < 0 ? [{ t:MINUS, c:c }] : []).concat([{ fn:String(Math.abs(q.n)), fd:String(q.d), c:c }]); }
function ptTok(x, y, c){ return [{ t:"(", c:c }].concat(qTok(x, c), [{ t:", ", c:c }], qTok(y, c), [{ t:")", c:c }]); }
function uiText(ctx, p, text, X, Y, o){
  o = o || {}; ctx.save(); ctx.font = (o.bold ? "700 " : "") + (o.size || 12) + "px " + (p.fontUI || "sans-serif");
  var w = ctx.measureText(text).width, al = o.align || "center", x0 = al === "center" ? X - w / 2 : al === "right" ? X - w : X;
  x0 = clamp(x0, 3, Math.max(3, p.W - w - 3));
  var rr = { x:x0 - 6, y:Y - 10, w:w + 12, h:20 };
  if (o.skip && hit(rr)) { ctx.restore(); return; }
  if (LBL) LBL.push(rr);
  if (o.chip) { ctx.fillStyle = css("--sheet"); ctx.strokeStyle = o.color || css("--ink-2"); ctx.lineWidth = 1.2; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x0 - 6, Y - 10, w + 12, 20, 9); else ctx.rect(x0 - 6, Y - 10, w + 12, 20); ctx.fill(); ctx.stroke(); }
  else if (o.bg) { ctx.globalAlpha = 0.85; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, Y - 9, w + 6, 18); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink-2"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(text, x0, Y); ctx.restore();
}

// @component G1+G6+G16 logWall — transformed log graph pieces: the curve sampled geometrically next to the wall (with the exact
// window-edge crossings added, so it plunges cleanly to the edge) and arrowheads at both ends; the domain band along the x-axis
// with an arrow to ±∞; the hatched "no values here" side (45°, 8 px apart, --rule); the dashed wall with its label and chip.
function logPts(P, v){
  var dir = P.k > 0 ? 1 : -1, K = Math.abs(P.k), span = v.xmax - v.xmin;
  var umax = (dir > 0 ? v.xmax - P.d : P.d - v.xmin) + span * 0.02;
  if (!(umax > 0)) return [];
  var y0 = P.a > 0 ? v.ymin : v.ymax, y1 = P.a > 0 ? v.ymax : v.ymin;
  var uIn = Math.pow(P.b, (y0 - P.c) / P.a) / K, uOut = Math.pow(P.b, (y1 - P.c) / P.a) / K;
  var umin = Math.max(1e-300, Math.min(1e-6, uIn * 0.25)), u1 = Math.min(1, umax), us = [], i;
  for (i = 0; i <= 220; i++) us.push(umin * Math.pow(u1 / umin, i / 220));
  if (umax > 1) for (i = 1; i <= 320; i++) us.push(1 + (umax - 1) * i / 320);
  [uIn, uOut].forEach(function(u){ if (u > umin && u < umax) us.push(u); });
  us.sort(function(a, b){ return a - b; });
  return us.map(function(u){ return [P.d + dir * u, P.a * logb(K * u, P.b) + P.c]; });
}
function heads(p, pts, color, size){
  var v = p.v, e = 1e-7, ins = function(q){ return isFinite(q[1]) && q[0] >= v.xmin - e && q[0] <= v.xmax + e && q[1] >= v.ymin - e && q[1] <= v.ymax + e; };
  var i0 = -1, i1 = -1, i;
  for (i = 0; i < pts.length; i++) if (ins(pts[i])) { i0 = i; break; }
  for (i = pts.length - 1; i >= 0; i--) if (ins(pts[i])) { i1 = i; break; }
  if (i0 < 0 || i1 <= i0) return;
  var pd = function(a, b){ return Math.hypot(p.X(a[0]) - p.X(b[0]), p.Y(a[1]) - p.Y(b[1])); };
  var j = i0; while (j < i1 && pd(pts[j], pts[i0]) < 14) j++;
  if (j > i0) p.head(pts[j], pts[i0], color, size || 13);
  j = i1; while (j > i0 && pd(pts[j], pts[i1]) < 14) j--;
  if (j < i1) p.head(pts[j], pts[i1], color, size || 13);
}
function drawLog(p, P, o){
  o = o || {};
  var pts = logPts(P, p.v);
  if (o.reveal != null && o.reveal < 1) { var dir = P.k > 0 ? 1 : -1, far = (dir > 0 ? p.v.xmax - P.d : P.d - p.v.xmin) * o.reveal; pts = pts.filter(function(q){ return Math.abs(q[0] - P.d) <= far; }); }
  if (o.map) pts = pts.map(o.map);
  if (pts.length < 2) return;
  p.curve({ pts:pts, color:o.color || css("--pen"), width:o.width || 3, dash:o.dash, alpha:o.alpha });
  if (o.arrows) heads(p, pts, o.color || css("--pen"));
}
function hatch(ctx, p, d, right, o){
  o = o || {};
  var X = clamp(p.X(d), 0, p.W), x0 = right ? 0 : X, x1 = right ? X : p.W;
  if (x1 - x0 < 1) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, p.H); ctx.clip();
  ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.beginPath();
  for (var k = -p.H; k < p.W + p.H; k += 8 * Math.SQRT2) { ctx.moveTo(k, p.H); ctx.lineTo(k + p.H, 0); }
  ctx.stroke(); ctx.restore();
  if (o.label !== false && x1 - x0 > 104) uiText(ctx, p, "no values here", (x0 + x1) / 2, clamp(p.Y(0) + 26, 14, p.H - 14), { bg:true });
}
function band(ctx, p, d, right, o){
  o = o || {};
  var X = clamp(p.X(d), 0, p.W), x0 = right ? X : 0, x1 = right ? p.W : X, Y = p.Y(0);
  if (x1 - x0 < 1 || Y < -7 || Y > p.H + 7) return;
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.fillStyle = css("--hi-soft"); ctx.fillRect(x0, Y - 7, x1 - x0, 14);
  if (o.glow) { ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * 0.55 * o.glow; ctx.fillStyle = css("--hi"); ctx.fillRect(x0, Y - 7, x1 - x0, 14); }
  ctx.restore();
  if (o.alpha != null && o.alpha < 0.5) return;
  var ink2 = css("--ink-2"), xe = right ? p.W - 2 : 2;
  p.head([p.xOf(right ? p.W - 16 : 16), 0], [p.xOf(xe), 0], ink2, 10);
  if (o.label !== false && x1 - x0 > 70) uiText(ctx, p, o.text || "domain", right ? x1 - 30 : x0 + 30, Y - 18, { bold:true, color:css("--ink"), bg:true, align:right ? "right" : "left" });
}
function wallLine(ctx, p, d, right, o){
  o = o || {};
  var X = p.X(d), ink2 = css("--ink-2");
  if (X < -2 || X > p.W + 2) return;
  ctx.save(); ctx.strokeStyle = o.color || ink2; ctx.lineWidth = o.width || 1.5; ctx.setLineDash(o.dash || [8, 6]); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
  ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
  if (o.label === false) return;
  var side = right ? (X > 90 ? -1 : 1) : (X < p.W - 90 ? 1 : -1), al = side < 0 ? "right" : "left", lx = X + side * 7;
  drawToks(ctx, p, [{ t:"x", i:true }, { t:" = " }].concat(o.tok || [{ t:num(d), c:o.dcol || css("--p-d") }]), lx, 40, { align:al, size:13 });
  if (o.chip !== false) uiText(ctx, p, "inside = 0 here", lx, 15, { chip:true, align:al, size:11 });
}
// exact point label beside a point, away from the wall; tries four spots and skips it if all of them overlap other labels
function ptLabel(ctx, p, X, Y, right, i){
  var px = p.X(qV(X)), py = p.Y(qV(Y)), s = right ? 1 : -1, al = right ? "left" : "right", ol = right ? "right" : "left", up = i % 2 ? 1 : -1;
  drawToks(ctx, p, ptTok(X, Y), px + 9 * s, py + 16 * up, { align:al, size:p.W < 420 ? 11 : 12, skip:true, alts:[[px + 9 * s, py - 16 * up, al], [px - 9 * s, py + 16 * up, ol], [px - 9 * s, py - 16 * up, ol]] });
}
function ring(p, x, y){ p.point({ x:x, y:y, r:7, open:true, color:css("--ink"), ring:true }); }
// marker for a point outside the window: an arrowhead at the edge, pointing out along from → to
function edgeMark(p, from, to, color){
  var v = p.v, t1 = 1, dx = to[0] - from[0], dy = to[1] - from[1];
  [[dx, v.xmin - from[0]], [dx, v.xmax - from[0]], [dy, v.ymin - from[1]], [dy, v.ymax - from[1]]].forEach(function(z){ if (Math.abs(z[0]) > 1e-12) { var t = z[1] / z[0]; if (t > 0 && t < t1) t1 = t; } });
  var e = [from[0] + dx * t1, from[1] + dy * t1], b = [from[0] + dx * (t1 - 0.04), from[1] + dy * (t1 - 0.04)];
  if (Math.hypot(p.X(e[0]) - p.X(b[0]), p.Y(e[1]) - p.Y(b[1])) < 2) b = [e[0] - Math.sign(dx || 1) * 0.3, e[1] - Math.sign(dy) * 0.3];
  p.head(b, e, color, 12);
}
function inView(v, x, y){ return x >= v.xmin && x <= v.xmax && y >= v.ymin && y <= v.ymax; }
function evenTicks(every, small){ return { step:1, fmt:function(t){ var e = small ? every * 2 : every; return isInt(t / e) ? num(t) : ""; } }; }

// @component N9 stepSlider (from MHF4U 32) — slider over a list of positions with − / + buttons, Shift + arrow steps of `big`
function stepSlider(host, o){
  host.innerHTML = '<div class="lw-sl1" style="--sc:var(' + o.color + ')"><div class="lw-sl-top"><label for="lw-' + o.id + '-in">' + o.label + '</label><output id="lw-' + o.id + '-o" for="lw-' + o.id + '-in"></output></div>' +
    '<div class="lw-sl-row"><button type="button" class="btn ghost lw-pm" data-pm="-1" data-k="' + o.id + 'm" tabindex="-1" aria-label="Decrease ' + o.name + '">' + MINUS + '</button><input type="range" id="lw-' + o.id + '-in" min="0" max="' + (o.n - 1) + '" step="1">' +
    '<button type="button" class="btn ghost lw-pm" data-pm="1" data-k="' + o.id + 'p" tabindex="-1" aria-label="Increase ' + o.name + '">+</button></div>' + (o.note ? '<p class="tiny muted lw-sl-note" id="lw-' + o.id + '-n"></p>' : "") + "</div>";
  var inp = host.querySelector("input"), out = host.querySelector("output"), btns = host.querySelectorAll("[data-pm]"), note = host.querySelector(".lw-sl-note"), cur = o.idx, locked = false;
  function paint(){
    inp.value = cur; out.innerHTML = o.fmt(cur); inp.setAttribute("aria-valuetext", o.say(cur));
    if (note) note.innerHTML = o.note(cur);
    inp.disabled = locked; btns[0].disabled = locked || cur <= 0; btns[1].disabled = locked || cur >= o.n - 1;
  }
  function go(i, how){ i = clamp(i, 0, o.n - 1); if (i === cur) { paint(); return; } cur = i; paint(); o.onChange(cur, how); }
  inp.addEventListener("input", function(){ cur = +inp.value; paint(); o.onChange(cur, "drag"); });
  inp.addEventListener("keydown", function(e){
    if (locked) return;
    var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (d && e.shiftKey && o.big) { e.preventDefault(); go(cur + d * o.big, "key"); }
    else if (e.key === "PageUp" || e.key === "PageDown") { e.preventDefault(); go(cur + (e.key === "PageUp" ? 1 : -1) * (o.big || 1), "key"); }
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pm]"); if (!b || b.disabled) return; go(cur + (+b.dataset.pm), "step"); });
  paint();
  return { set:function(i){ cur = clamp(i, 0, o.n - 1); paint(); }, lock:function(b){ locked = !!b; paint(); }, get:function(){ return cur; } };
}
// @component radioGroup (from MHF4U 25 / 32) — segmented control or chip row as a real radio group (arrow keys, roving tabindex, lock)
function radios(host, o){
  var val = String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (val === "" && x === o.options[0]) ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); i = i < 0 ? (d > 0 ? 0 : ids.length - 1) : (i + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } } };
}

// ---------- value lists ----------
var AV = [], HV = [], i0;
for (i0 = -8; i0 <= 8; i0++) if (i0) AV.push(i0 / 2);
for (i0 = -16; i0 <= 16; i0++) HV.push(i0 / 2);
var KV = [-4, -3, -2, -1, -1 / 2, -1 / 3, -1 / 4, 1 / 4, 1 / 3, 1 / 2, 1, 2, 3, 4];
var SKV = [1 / 10, 1 / 9, 1 / 8, 1 / 4, 1 / 3, 1 / 2, 1, 2, 3, 4, 8, 9, 10];
function idxOf(list, v){ var best = 0; list.forEach(function(x, i){ if (Math.abs(x - v) < Math.abs(list[best] - v)) best = i; }); return best; }
function fmtK(v){ return m(qSrc(qq(v))); }
function fmtV(v){ return m(pS(v)); }
function kNote(v){ var inv = qDiv(Q(1), qq(Math.abs(v))); return "factor " + m(qSrc(inv)); }
// parameter sliders (Explore and the task share them)
function paramSliders(host, S, pre, onChange){
  host.innerHTML = '<div class="lw-sl4"><div id="' + pre + 'a"></div><div id="' + pre + 'k"></div><div id="' + pre + 'd"></div><div id="' + pre + 'c"></div></div>';
  var defs = { a:[AV, "a", m("@a{a}") + " · vertical", 2, fmtV], k:[KV, "k", m("@k{k}") + " · horizontal", 0, fmtK], d:[HV, "d", m("@d{d}") + " · horizontal shift", 4, fmtV], c:[HV, "c", m("@c{c}") + " · vertical shift", 4, fmtV] }, out = {};
  Object.keys(defs).forEach(function(id){
    var D = defs[id], list = D[0];
    out[id] = stepSlider($("#" + pre + id, host), { id:pre + id, label:D[2], name:id, color:PCOL[id], n:list.length, idx:idxOf(list, S[id]), big:D[3],
      fmt:function(i){ return D[4](list[i]); }, say:function(i){ return id + " = " + MV.plain(D[4](list[i])); }, note:id === "k" ? function(i){ return kNote(list[i]); } : null,
      onChange:function(i, how){ S[id] = list[i]; onChange(id, how); } });
  });
  return { sync:function(){ out.a.set(idxOf(AV, S.a)); out.k.set(idxOf(KV, S.k)); out.d.set(idxOf(HV, S.d)); out.c.set(idxOf(HV, S.c)); }, lockD:function(b){ out.d.lock(b); } };
}
function baseChips(host, S, onChange){
  return radios(host, { label:"Base " + m("@b{b}") + ":", aria:"Base", cls:"chips", value:String(S.b), options:[2, 3, 10].map(function(b){ return { id:String(b), t:'<span class="p-b">' + b + "</span>" }; }), onChange:function(v){ S.b = +v; onChange(); } });
}

// ---------- shared Transform-view scene (Explore and the task) ----------
var TV = { xmin:-12, xmax:12, ymin:-9, ymax:9 };
function describeT(P, extra){
  var right = P.k > 0, xi = xInt(P);
  return "Graph of " + MV.plain(m(eqSrc(P))) + ". Vertical asymptote x = " + num(P.d) + "; domain x " + (right ? "greater" : "less") + " than " + num(P.d) + ". The curve " +
    (P.a < 0 ? "comes down from the top of the wall" : "rises from the bottom of the wall") + " and keeps " + (P.a * P.k > 0 ? "rising" : "falling") + " slowly to the " + (right ? "right" : "left") +
    ", crossing the x-axis at " + xi.plain + "." + (extra || "");
}
function sceneT(p, P, o){
  var K = cols(), right = P.k > 0, v = p.v;
  hatch(p.ctx, p, P.d, right);
  band(p.ctx, p, P.d, right, { glow:o.glow });
  if (o.par) drawLog(p, { b:P.b, a:1, k:1, d:0, c:0 }, { color:K.ink2, width:2, dash:[6, 6], alpha:0.6 });
  if (o.before) o.before(p, K);
  wallLine(p.ctx, p, P.d, right, {});
  // translation arrows: teal along the x-axis from 0 to d, magenta up the wall from 0 to c
  if (!near(P.d, 0) && o.trans !== false) { var Yd = p.Y(0) + 14; p.segment({ x1:0, y1:p.yOf(Yd), x2:P.d, y2:p.yOf(Yd), color:K.pd, width:2.2, arrow:true }); }
  if (!near(P.c, 0) && o.trans !== false) { var xc = p.xOf(p.X(P.d) + (right ? -9 : 9)); p.segment({ x1:xc, y1:0, x2:xc, y2:P.c, color:K.pc, width:2.2, arrow:true }); }
  if (o.curve !== false) drawLog(p, P, { arrows:true });
  if (o.after) o.after(p, K);
}

// ---------- hero: parent with wall and band; points travel while the wall slides; new curve draws ----------
function hero(f){
  var V = { xmin:-6, xmax:10, ymin:-6, ymax:6 }, p = new MV.Plot(f.canvas, V), RM = MV.reduceMotion;
  var PAR = { b:2, a:1, k:1, d:0, c:0 }, FIN = { b:2, a:2, k:-1, d:3, c:1 };
  var PT = [[0.5, -1], [1, 0], [2, 1], [4, 2]], IM = [[2.5, -1], [2, 1], [1, 3], [-1, 5]];
  var H = RM ? { r0:1, t:1, r1:1 } : { r0:0, t:0, r1:0 };
  p.render = function(){
    var K = cols(), t = H.t, wx = 3 * t;
    p.draw({ view:V, xTicks:evenTicks(2, p.W < 420), yTicks:evenTicks(2), describe:H.r1 >= 1 ? "Final graph of y = 2 log base 2 of the quantity negative (x minus 3), plus 1: wall x = 3, domain x < 3, through (5/2, −1), (2, 1), (1, 3) and (−1, 5). The parent y = log base 2 of x is faded behind it." : "y = log base 2 of x with its wall x = 0 and domain x > 0; key points (1/2, −1), (1, 0), (2, 1) and (4, 2).",
      after:function(ctx){
        if (t < 1) band(ctx, p, 0, true, { alpha:1 - t, text:"domain x > 0" });
        if (t > 0) band(ctx, p, 3, false, { alpha:t, text:"domain x < 3" });
        drawLog(p, PAR, { color:K.ink2, width:2.4, dash:[6, 6], alpha:lerp(1, 0.3, t), reveal:H.r0 });
        wallLine(ctx, p, wx, t < 0.5, { label:false });
        if (t === 0 || t === 1) drawToks(ctx, p, [{ t:"wall " }, { t:"x", i:true }, { t:" = " + (t === 1 ? "3" : "0") }], p.X(wx) + (t === 1 ? 8 : 8), 16, { align:"left", size:13, color:K.ink2 });
        if (H.r1 > 0) drawLog(p, FIN, { color:K.pen, width:3.2, reveal:H.r1, arrows:H.r1 >= 1 });
        PT.forEach(function(q, i){
          var x = lerp(q[0], IM[i][0], t), y = lerp(q[1], IM[i][1], t);
          if (t > 0 && t < 1 || (t === 1 && H.r1 < 1)) p.segment({ x1:q[0], y1:q[1], x2:x, y2:y, color:K.ink2, width:1.2, arrow:true });
          if (H.r0 >= 1) p.point(t >= 1 ? { x:x, y:y, r:5, color:K.pen } : { x:x, y:y, r:4.5, open:true, color:K.ink2 });
        });
      } });
  };
  function done(){ f.cap.innerHTML = MV.C.hero.capEnd; }
  p.render();
  if (RM) { done(); return; }
  MV.tween({ dur:1000, ease:LIN, step:function(x){ H.r0 = x; p.render(); }, done:function(){ H.r0 = 1; p.render();
    MV.wait(600, function(){ MV.tween({ dur:2000, step:function(x){ H.t = x; p.render(); }, done:function(){ H.t = 1; p.render();
      MV.wait(300, function(){ MV.tween({ dur:1000, ease:LIN, step:function(x){ H.r1 = x; p.render(); }, done:function(){ H.r1 = 1; p.render(); done(); } }); }); } }); }); } });
}

// ---------- Explore: Domain wall ----------
// @component logExplorer — Domain wall: Transform view (a, k over a listed set, d, c, base chips, wall, domain band and hatching,
// key points with mapping arrows, translation arrows, draggable domain probe, mapping table, 15-row readout) and
// Stretch or shift? view (k stepper over 13 values, gap bars, slide-the-parent, gap table, inset comparison with y = x²)
var SVW = { xmin:-2, xmax:14, ymin:-6, ymax:6 }, IVW = { xmin:0, xmax:2.5, ymin:0, ymax:20 };
function explore(host, api){
  var S = api.S, C = api.content, CH = {};
  (C.challenges || []).forEach(function(c){ CH[c.id] = c; });
  var D0 = { b:2, a:1, k:1, d:0, c:0, p:2, ks:1 };
  def(S, { view:"t", b:2, a:1, k:1, d:0, c:0, p:2, ks:1, par:true, kp:true, tbl:false, cmp:false, tgt:"", all:false });
  Object.keys(D0).forEach(function(k){ if (typeof S[k] !== "number" || !isFinite(S[k])) S[k] = D0[k]; });
  if (typeof S.tgt !== "string") S.tgt = "";
  var O = { anim:false, flip:null, ghost:null, bracket:null, glow:0, slide:null, rows:4, ksAnim:null };
  host.innerHTML = '<div class="lw">' +
    '<div class="lw-top"><div id="lw-view"></div><div id="lw-base"></div></div>' +
    '<div class="lw-sl"><div id="lw-tsl"></div><div id="lw-ssl" hidden></div><p class="tiny lw-lock" id="lw-lock" hidden></p></div>' +
    '<div class="lw-graph" data-mv="graph"><p class="eq-cap lw-cap" id="lw-cap" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot" id="lw-plot" role="img" aria-label="Domain wall graph"></canvas></div>' +
      '<p class="lw-leg tiny muted" id="lw-leg"></p>' +
      '<div id="lw-inset" class="lw-inset" hidden><canvas class="plot" id="lw-iplot" role="img" aria-label="Comparison with y = x squared"></canvas><p class="tiny lw-icap" id="lw-icap"></p></div></div>' +
    '<div class="lw-tog"><div id="lw-ttog"><div class="lw-togs" role="group" aria-label="Show on the graph">' +
        '<button type="button" class="chip lw-tb" data-tg="par" data-k="tgpar">Parent graph</button><button type="button" class="chip lw-tb" data-tg="kp" data-k="tgkp">Key points and arrows</button><button type="button" class="chip lw-tb" data-tg="tbl" data-k="tgtbl">Mapping table</button></div>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="lw-reset">Reset</button><button type="button" class="btn ghost sm" id="lw-hide" hidden>Hide the challenge target</button></div></div>' +
      '<div id="lw-stog" hidden><div class="q-actions"><button type="button" class="btn sm" id="lw-slide">Slide the parent by the gap</button></div><div class="lw-togs"><button type="button" class="chip lw-tb" data-tg="cmp" data-k="tgcmp">Compare with ' + m("y = x^2") + "</button></div></div></div>" +
    '<div id="lw-tbl" class="lw-tbl"></div><div class="lw-read" id="lw-rd"><dl class="read" id="lw-read" aria-live="polite"></dl><button type="button" class="btn ghost sm lw-more" id="lw-more"></button></div>' +
    "</div>";
  var plot = new MV.Plot($("#lw-plot", host), TV), iplot = new MV.Plot($("#lw-iplot", host), IVW);
  var segV = radios($("#lw-view", host), { label:"View:", value:S.view, options:[{ id:"t", t:"Transform" }, { id:"s", t:"Stretch or shift?" }], onChange:function(v){ S.view = v; O.slide = null; O.ghost = null; userChange(); } });
  var chipsB = baseChips($("#lw-base", host), S, function(){ O.slide = null; userChange(); });
  var sl = paramSliders($("#lw-tsl", host), S, "lwt-", function(){ userChange(); });
  sl.lockD(lockOf(S.tgt) != null);
  var skl = stepSlider($("#lw-ssl", host), { id:"ks", label:m("@k{k}") + " · inside factor", name:"k", color:"--p-k", n:SKV.length, idx:idxOf(SKV, S.ks),
    fmt:function(i){ return fmtK(SKV[i]); }, say:function(i){ return "k = " + qT(qq(SKV[i])); }, note:function(i){ return SKV[i] === 1 ? "no change" : (SKV[i] > 1 ? "compression, " : "stretch, ") + kNote(SKV[i]); },
    onChange:function(i){ S.ks = SKV[i]; O.slide = null; userChange(); } });
  function cur(){ return { b:S.b, a:S.a, k:S.k, d:S.d, c:S.c }; }
  function userChange(){ if (O.anim) return; O.ghost = null; O.bracket = null; O.glow = 0; api.save(); paint(); MV.changed(); }
  // the probe (G7)
  var drag = MV.drag(plot, {
    handles:function(){ return S.view === "t" && !O.anim ? [{ id:"p", x:S.p, y:0, label:"Domain probe at x = " + num(S.p) + ". Left and Right move it by 0.5; hold Shift to move it by 2." }] : []; },
    move:function(id, x){ var v = clamp(r2(x), -12, 12); if (v !== S.p) { S.p = v; api.save(); paint(); } },
    axis:"x", step:{ x:0.5, y:0.5 }, big:4
  });
  plot.c.style.touchAction = "pan-y";
  // toggles, reset, slide, show all
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || O.anim) return;
    if (b.dataset.tg) { S[b.dataset.tg] = !S[b.dataset.tg]; api.save(); paint(); return; }
    if (b.id === "lw-reset") { S.b = 2; S.a = 1; S.k = 1; S.d = 0; S.c = 0; S.p = 2; setTgt(""); chipsB.set("2"); userChange(); return; }
    if (b.id === "lw-hide") { setTgt(""); paint(); return; }
    if (b.id === "lw-slide") { slideRun(); return; }
    if (b.id === "lw-more") { S.all = !S.all; api.save(); paint(); }
  });
  // tapping a challenge shows its target (and locks d for TC3)
  var chalBox = $("#chal");
  if (chalBox) chalBox.addEventListener("click", function(e){ var c = e.target.closest("[data-c]"); if (!c || O.anim) return; if (S.tgt !== c.dataset.c) { setTgt(c.dataset.c); if (S.view !== "t") { S.view = "t"; segV.set("t"); } api.save(); paint(); MV.changed(); } }, true);
  function lockOf(id){ var t = id && CH[id] ? CH[id].target : null; return t && t.lockD != null ? t.lockD : null; }
  function setTgt(id){
    S.tgt = id || "";
    var lk = lockOf(S.tgt);
    if (lk != null) { S.d = lk; sl.sync(); }
    sl.lockD(lk != null);
  }
  // ---------- drawing ----------
  function tgtScene(p, K){
    var ch = S.tgt ? CH[S.tgt] : null; if (!ch) return;
    var A = MV.ans(ch);
    if (A && A.k) { wallLine(p.ctx, p, A.d, A.k > 0, { color:K.ink, width:1.4, dash:[12, 7], label:false }); drawLog(p, A, { color:K.ink, width:2.2, dash:[12, 7] }); }
  }
  function tgtPts(p){
    var ch = S.tgt ? CH[S.tgt] : null; if (!ch) return;
    var pts = (ch.target && ch.target.pts) || (ch.id === "tc1" ? [[2, 0]] : []);
    pts.forEach(function(q){ ring(p, q[0], q[1]); });
  }
  function drawT(){
    var P = O.flip != null ? { b:S.b, a:S.a, k:1, d:S.d, c:S.c } : cur(), right = O.flip != null ? O.flip > 0 : P.k > 0, inD = P.k * (S.p - P.d) > 0, f = fOf(P);
    var desc = describeT(P, " Domain probe at x = " + num(S.p) + (inD ? ", where y = " + ap(f(S.p)) + "." : ": no value there.") + (S.par ? " The parent y = log" + (S.b === 10 ? "" : " base " + S.b) + " x is dashed." : "") + (S.tgt ? " The target for challenge " + S.tgt.slice(2) + " is shown." : ""));
    plot.draw({ view:TV, xTicks:evenTicks(2, plot.W < 420), yTicks:evenTicks(2), describe:desc, after:function(ctx, p){
      var K = cols(); LBL = [];
      if (O.flip != null) {
        hatch(ctx, p, P.d, right); band(ctx, p, P.d, right, {});
        if (S.par) drawLog(p, { b:P.b, a:1, k:1, d:0, c:0 }, { color:K.ink2, width:2, dash:[6, 6], alpha:0.6 });
        wallLine(ctx, p, P.d, right, {});
        var h = O.flip; drawLog(p, P, { color:K.pen, width:3, alpha:0.55, map:function(q){ return [P.d + h * (q[0] - P.d), q[1]]; } });
        LBL = null; return;
      }
      sceneT(p, P, { par:S.par, glow:O.glow, before:function(pp, KK){
        tgtScene(pp, KK);
        if (O.ghost) drawLog(pp, O.ghost, { color:KK.pen, width:2.6, alpha:0.3 });
        if (S.kp) parents(P.b).forEach(function(q){ var x0 = qV(q[0]), y0 = qV(q[1]), im = imgOf(P, q), X = qV(im[0]), Y = qV(im[1]);
          if (Math.hypot(X - x0, Y - y0) > 1e-6) { pp.segment({ x1:x0, y1:y0, x2:X, y2:Y, color:KK.ink2, width:1.1, arrow:inView(TV, X, Y) }); if (!inView(TV, X, Y)) edgeMark(pp, [x0, y0], [X, Y], KK.pen); }
          pp.point({ x:x0, y:y0, r:4, open:true, color:KK.ink2 }); });
      }, after:function(pp, KK){
        if (O.bracket) { var B = O.bracket, Xb = pp.X(B.x) + 12; ctx.save(); ctx.strokeStyle = KK.ac; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(Xb, pp.Y(B.y0)); ctx.lineTo(Xb, pp.Y(B.y1)); ctx.moveTo(Xb - 5, pp.Y(B.y0)); ctx.lineTo(Xb + 5, pp.Y(B.y0)); ctx.moveTo(Xb - 5, pp.Y(B.y1)); ctx.lineTo(Xb + 5, pp.Y(B.y1)); ctx.stroke(); ctx.restore();
          drawToks(ctx, pp, [{ t:"a", i:true, c:KK.ac }, { t:" = " + num(S.a, 1), c:KK.ac }], Xb + 8, pp.Y((B.y0 + B.y1) / 2), { align:"left", size:13 }); }
        if (S.kp) parents(P.b).forEach(function(q, i){ var im = imgOf(P, q), X = qV(im[0]), Y = qV(im[1]);
          if (!inView(TV, X, Y)) return;
          pp.point({ x:X, y:Y, r:5, color:KK.pen });
          if (!O.anim) ptLabel(ctx, pp, im[0], im[1], right, i); });
        tgtPts(pp);
        // probe
        var Xp = pp.X(S.p), y = f(S.p);
        ctx.save(); ctx.strokeStyle = KK.ink; ctx.lineWidth = 1.6; if (!inD) ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(Xp, 0); ctx.lineTo(Xp, pp.H); ctx.stroke(); ctx.restore();
        if (inD && y >= TV.ymin && y <= TV.ymax) pp.point({ x:S.p, y:y, r:5.5, color:KK.ink });
        if (!inD) uiText(ctx, pp, "no value", Xp + (Xp > pp.W - 80 ? -8 : 8), pp.Y(0) - 30, { chip:true, color:KK.ink, align:Xp > pp.W - 80 ? "right" : "left" });
        pp.point({ x:S.p, y:0, r:6.5, color:KK.ink, ring:true });
      } });
      LBL = null;
    } });
  }
  function gapOf(k, b){ return logb(k, b); }
  function gapStr(k, b){ var n = powExp(qq(k), b); return n != null ? qT(Q(n)) : ap(gapOf(k, b)); }
  function drawS(){
    var b = S.b, k = O.ksAnim != null ? O.ksAnim : S.ks, g = gapOf(k, b), lab = O.ksAnim != null ? ap(g) : gapStr(k, b);
    plot.draw({ view:SVW, xTicks:evenTicks(2, plot.W < 420), yTicks:evenTicks(2), describe:"Graph of y = " + (b === 10 ? "log" : "log base " + b) + " of " + qT(qq(k)) + "x (solid) and the parent (dashed). Gap bars at x = 1, 2, 4 and 8 all measure " + lab + "." + (O.slide != null ? " A copy of the parent slides up by the gap." : ""),
      after:function(ctx, p){
        var K = cols(), par = { b:b, a:1, k:1, d:0, c:0 }, nw = { b:b, a:1, k:k, d:0, c:0 };
        drawLog(p, par, { color:K.ink2, width:2, dash:[6, 6], alpha:0.6 });
        drawLog(p, nw, { color:K.pen, width:3, arrows:true });
        if (O.slide != null) drawLog(p, par, { color:K.ink, width:2.4, dash:[14, 8], map:function(q){ return [q[0], q[1] + g * O.slide]; } });
        [1, 2, 4, 8].forEach(function(x){
          var y0 = logb(x, b), y1 = y0 + g, ya = clamp(y0, SVW.ymin, SVW.ymax), yb = clamp(y1, SVW.ymin, SVW.ymax), X = p.X(x) + 5;
          ctx.save(); ctx.strokeStyle = K.pc; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(X, p.Y(ya)); ctx.lineTo(X, p.Y(yb)); ctx.stroke();
          ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X - 4, p.Y(ya)); ctx.lineTo(X + 4, p.Y(ya)); ctx.moveTo(X - 4, p.Y(yb)); ctx.lineTo(X + 4, p.Y(yb)); ctx.stroke(); ctx.restore();
          drawToks(ctx, p, [{ t:lab, c:K.pc }], X + 6, p.Y((ya + yb) / 2), { align:"left", size:12 });
        });
      } });
  }
  function drawInset(){
    if (!(S.view === "s" && S.cmp)) return;
    var k = O.ksAnim != null ? O.ksAnim : S.ks;
    iplot.draw({ view:IVW, xTicks:{ step:0.5, fmt:function(t){ return isInt(t) ? num(t) : ""; } }, yTicks:{ step:2, fmt:function(t){ return isInt(t / 4) ? num(t) : ""; } },
      describe:"Inset: y = x squared (dashed) and y = (" + qT(qq(k)) + "x) squared (solid), with gap bars at x = 0.5, 1, 1.5 and 2.",
      after:function(ctx, p){
        var K = cols();
        p.curve({ pts:samp(function(x){ return x * x; }, 0, 2.6), color:K.ink2, width:2, dash:[6, 6] });
        p.curve({ pts:samp(function(x){ return k * k * x * x; }, 0, 2.6), color:K.pen, width:3 });
        [0.5, 1, 1.5, 2].forEach(function(x){
          var y0 = x * x, y1 = k * k * x * x, ya = clamp(y0, IVW.ymin, IVW.ymax), yb = clamp(y1, IVW.ymin, IVW.ymax), X = p.X(x) + 4;
          ctx.save(); ctx.strokeStyle = K.ink2; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X, p.Y(ya)); ctx.lineTo(X, p.Y(yb)); ctx.stroke(); ctx.restore();
          drawToks(ctx, p, [{ t:num(y1 - y0, 2), c:K.ink }], X + 5, p.Y((ya + yb) / 2), { align:"left", size:11 });
        });
      } });
  }
  function samp(f, a, b){ var out = []; for (var i = 0; i <= 200; i++) { var x = a + (b - a) * i / 200; out.push([x, f(x)]); } return out; }
  plot.render = function(){ if (S.view === "s") drawS(); else drawT(); };
  iplot.render = drawInset;
  // ---------- readouts ----------
  function readT(P){
    var K = qq(P.k), fs = factS(P.k, P.d), es = expS(P.k, P.d), right = P.k > 0, kv = qSrc(K), rows = [];
    rows.push(["Equation", m(eqSrc(P, true))]);
    rows.push(["Inside the log", fs === es ? m(fs) + " (already multiplied out)" : m(fs) + ", which is " + m(es) + " multiplied out"]);
    rows.push(["Vertical asymptote", m("x = @d{" + pS(P.d) + "}") + ' <span class="lw-why">· the inside, ' + m(fs) + ", is 0 here</span>"]);
    rows.push(["Domain", m(domSet(P)) + ", or " + m(domIv(P)) + ' <span class="lw-why">· the inside must be positive; ' + m("@k{k} = " + kv + (right ? " > 0" : " < 0")) + ", so " + m("x " + (right ? ">" : "<") + " " + pS(P.d)) + (right ? "" : " (dividing by a negative reverses the inequality)") + "</span>"]);
    rows.push(["Range", m("{y ∈ ℝ}") + ' <span class="lw-why">· a log graph has no horizontal asymptote</span>']);
    rows.push(["Transformations", descHTML(P)]);
    rows.push(["Mapping rule", m(ruleSrc(P, true))]);
    var pa = parents(P.b);
    rows.push(["Key points", pa.map(function(q){ var im = imgOf(P, q); return m(ptSrc(im[0], im[1], true)); }).join(", ") + ' <span class="lw-why">· images of ' + pa.map(function(q){ return m(ptSrc(q[0], q[1])); }).join(", ") + "</span>"]);
    rows.push([m("x") + "-intercept", xInt(P).html]);
    var yi;
    if (P.k * (0 - P.d) > 0) { var vy = valAt(P, 0); yi = vy.exact ? m(ptSrc(Q(0), qq(vy.v), true)) : m("(0, " + vy.s + ")") + ", approximately"; }
    else yi = "None: " + m("x = 0") + " is outside the domain";
    rows.push([m("y") + "-intercept", yi]);
    var same = P.a * P.k > 0;
    rows.push(["Rising or falling", (same ? "Increasing" : "Decreasing") + " on " + m(domIv(P)) + ' <span class="lw-why">· ' + m("@a{a}") + " and " + m("@k{k}") + " have " + (same ? "the same sign" : "opposite signs") + "</span>"]);
    rows.push(["Next to the wall", "As " + m("x → " + pS(P.d) + (right ? "⁺" : "⁻")) + ", " + m("y → " + (P.a > 0 ? "-∞" : "∞"))]);
    rows.push(["Far from the wall", "As " + m("x → " + (right ? "∞" : "-∞")) + ", " + m("y → " + (P.a > 0 ? "∞" : "-∞")) + ", slowly, with no horizontal asymptote"]);
    if (!near(Math.abs(P.k), 1)) {
      var AK = qq(Math.abs(P.k)), n = powExp(AK, P.b), inner = near(P.d, 0) ? (right ? " x" : "(-x)") : (right ? "(" + xdS(P.d) + ")" : "[-(" + xdS(P.d) + ")]"), base = aPre(P.a) + logS(P.b) + inner, lk = logS(P.b) + (AK.d === 1 ? " " + AK.n : "(" + qSrc(AK) + ")");
      if (n != null) { var sh = P.a * n; rows.push(["Same curve without " + m("@k{k}"), m("y = " + base + cTail(P.c + sh)) + ' <span class="lw-why">· the factor ' + m(qSrc(AK)) + " inside adds " + m((near(P.a, 1) ? "" : pS(P.a) + " × ") + lk + " = " + pS(sh)) + " to the outside</span>"]); }
      else { var sh2 = P.a * logb(qV(AK), P.b), tot = P.c + sh2, tm = (P.a > 0 ? " + " : " - ") + (near(Math.abs(P.a), 1) ? "" : pS(Math.abs(P.a)) + " ") + lk; rows.push(["Same curve without " + m("@k{k}"), m("y = " + base + cTail(P.c) + tm) + " ≈ " + m("y = " + base + (Math.abs(tot) < 0.005 ? "" : (tot > 0 ? " + " : " - ") + ap(Math.abs(tot)))) + ' <span class="lw-why">· the factor ' + m(qSrc(AK)) + " inside adds " + m(aPre(P.a) + lk) + " ≈ " + ap(sh2) + " to the outside</span>"]); }
    }
    rows.push(["Probe", probeHTML(P, S.p)]);
    return rows;
  }
  function probeHTML(P, p){
    var t = qMul(qq(P.k), qSub(qq(p), qq(P.d))), head = m("x = " + pS(p)) + ": inside " + m(subS(P.k, P.d, p) + " = " + qSrc(t));
    if (t.n === 0) return head + ": " + m(logS(P.b) + " 0") + " has no value (this is the wall)";
    if (t.n < 0) return head + ". A log of a negative number has no value, so " + m("x = " + pS(p)) + " isn’t in the domain.";
    var vy = valAt(P, p), expr = aPre(P.a) + logS(P.b) + (t.d === 1 ? " " + t.n : "(" + qSrc(t) + ")") + cTail(P.c);
    return head + "; " + m("y = " + expr + (vy.exact ? " = " + qSrc(qq(vy.v)) : " ≈ " + vy.s));
  }
  function readS(){
    var b = S.b, k = S.ks, K = qq(k), n = powExp(K, b), g = logb(k, b), lb = logS(b), rows = [];
    rows.push(["Equation", m("y = " + logS(b, true) + (near(k, 1) ? " x" : "(@k{" + qSrc(K, true) + "}x)"))]);
    rows.push(["Sideways change", k > 1 ? "Horizontal compression by a factor of " + m(qSrc(qDiv(Q(1), K))) : k < 1 ? "Horizontal stretch by a factor of " + m(qSrc(qDiv(Q(1), K))) : "None: " + m("@k{k} = 1")]);
    var gs = n != null ? qT(Q(n)) : "≈ " + ap(g);
    rows.push(["Gaps at " + m("x = 1") + ", 2, 4, 8", [gs, gs, gs, gs].join(", ")]);
    var ud = function(v){ return v > 0 ? "up" : "down"; };
    if (near(k, 1)) rows.push(["Same curve as", m("y = " + lb + " x") + " itself: no translation"]);
    else if (n != null) rows.push(["Same curve as", m("y = " + lb + " x" + (n > 0 ? " + " : " - ") + Math.abs(n)) + ", a translation " + Math.abs(n) + units(n) + ud(n)]);
    else rows.push(["Same curve as", m("y = " + lb + " x + " + lb + (K.d === 1 ? " " + K.n : "(" + qSrc(K) + ")")) + " ≈ " + m("y = " + lb + " x" + (g > 0 ? " + " : " - ") + ap(Math.abs(g))) + ", a translation about " + ap(Math.abs(g)) + " units " + ud(g)]);
    var why;
    if (near(k, 1)) why = m("@k{k} = 1") + " leaves the inside alone, so the gap is 0";
    else if (n != null) why = m(qSrc(K) + " = " + b + "^{" + n + "}") + ", so multiplying the inside by " + m(qSrc(K)) + " adds " + m(lb + (K.d === 1 ? " " + K.n : "(" + qSrc(K) + ")") + " = " + n);
    else why = m(qSrc(K)) + " isn’t " + b + " to an integer power, but the gap is still the same at every " + m("x") + ": about " + ap(g);
    rows.push(["Why", why]);
    return rows;
  }
  function tableT(P){
    var rows = parents(P.b).map(function(q){ var im = imgOf(P, q); return [m(ptSrc(q[0], q[1], true)), m(qSrc(im[0], true)), m(qSrc(im[1], true)), m(ptSrc(im[0], im[1], true))]; });
    return '<h4 class="lw-th">Mapping table</h4>' + MV.tableHTML({ head:["Parent point", m("x/@k{k} + @d{d}"), m("@a{a}y + @c{c}"), "Image"], rows:rows, caption:"Key points of the parent and their images" });
  }
  function tableS(){
    var b = S.b, k = S.ks, K = qq(k), lb = logS(b);
    var cell = function(q){ var n = powExp(q, b), arg = q.d === 1 ? " " + q.n : "(" + qSrc(q) + ")"; return m(lb + arg + (n != null ? " = " + n : " ≈ " + ap(logb(qV(q), b)))); };
    var rows = [1, 2, 4, 8].map(function(x, i){ if (i >= O.rows) return [m(String(x)), "", "", ""]; var kx = qMul(K, Q(x)); return [m(String(x)), cell(kx), cell(Q(x)), m(gapStr(k, b))]; });
    return '<h4 class="lw-th">Gap table</h4>' + MV.tableHTML({ head:[m("x"), m(lb + "(@k{k}x)"), m(lb + " x"), "Gap"], rows:rows, caption:"The new curve and the parent at x = 1, 2, 4 and 8" });
  }
  // ---------- paint ----------
  function paint(){
    var tv = S.view === "t";
    segV.set(S.view);
    $("#lw-tsl", host).hidden = !tv; $("#lw-ssl", host).hidden = tv; $("#lw-ttog", host).hidden = !tv; $("#lw-stog", host).hidden = tv;
    if (!O.anim) { sl.sync(); skl.set(idxOf(SKV, S.ks)); }
    $$(".lw-tb", host).forEach(function(b){ var on = !!S[b.dataset.tg]; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); });
    var lk = lockOf(S.tgt);
    $("#lw-lock", host).hidden = !tv || lk == null; $("#lw-lock", host).innerHTML = lk != null ? m("@d{d}") + " is locked at " + num(lk) + " for challenge 3." : "";
    $("#lw-hide", host).hidden = !S.tgt;
    var P = cur();
    if (!O.anim) {
      $("#lw-cap", host).innerHTML = tv ? m(eqSrc(P, true)) : m("y = " + logS(S.b, true) + (near(S.ks, 1) ? " x" : "(@k{" + qSrc(qq(S.ks), true) + "}x)")) + ' <span class="lw-vs">vs</span> ' + m("y = " + logS(S.b) + " x");
      $("#lw-read", host).innerHTML = MV.readoutHTML(tv ? readT(P) : readS());
      $("#lw-tbl", host).innerHTML = tv ? (S.tbl ? tableT(P) : "") : tableS();
    }
    $("#lw-leg", host).innerHTML = tv ? '<span><i class="ln par"></i>parent</span><span><i class="ln cur"></i>your graph</span><span><i class="dt ho"></i>parent points</span><span><i class="dt"></i>images</span>' + (S.tgt === "tc2" ? '<span><i class="ln tg"></i>target</span>' : "") :
      '<span><i class="ln par"></i>parent</span><span><i class="ln cur"></i>new curve</span><span><i class="ln gap"></i>gap bars</span>' + (O.slide != null ? '<span><i class="ln tg"></i>parent, slid by the gap</span>' : "");
    $("#lw-rd", host).classList.toggle("all", !!S.all);
    $("#lw-more", host).textContent = S.all ? "Show fewer features" : "Show all features";
    $("#lw-inset", host).hidden = tv || !S.cmp;
    $("#lw-icap", host).innerHTML = "For " + m("x^2") + ", squeezing sideways is the same as stretching up. For a log, it’s the same as moving up.";
    plot.render(); if (!tv && S.cmp) drawInset();
  }
  // ---------- Stretch or shift?: slide the parent by the gap ----------
  function slideRun(done){
    var b = S.b, k = S.ks, K = qq(k), n = powExp(K, b), lb = logS(b), arg = K.d === 1 ? String(K.n) : "(" + qSrc(K) + ")";
    var msg = near(k, 1) ? "With k = 1 the two curves are already the same." : MV.plain(m("Same curve: " + lb + "(" + (K.d === 1 ? K.n : qSrc(K)) + "x) = " + lb + " x" + (n != null ? (n > 0 ? " + " : " - ") + Math.abs(n) : " + " + lb + (K.d === 1 ? " " + K.n : arg) + " ≈ " + lb + " x " + (logb(k, b) > 0 ? "+ " : "- ") + ap(Math.abs(logb(k, b)))) + "."));
    O.slide = 0; paint();
    MV.tween({ dur:1200, step:function(t){ O.slide = t; plot.render(); }, done:function(){ O.slide = 1; paint(); MV.banner("good", msg); if (done) done(msg); } });
  }
  // ---------- predictions ----------
  function setState(st){
    O = { anim:false, flip:null, ghost:null, bracket:null, glow:0, slide:null, rows:4, ksAnim:null };
    setTgt("");
    S.view = st.view; S.b = st.b; chipsB.set(String(st.b));
    if (st.view === "t") { S.a = st.a; S.k = st.k; S.d = st.d; S.c = st.c; S.p = st.probe; S.kp = true; }
    else { S.ks = st.ks; }
    api.save(); paint(); MV.changed();
  }
  function tw(keys, to, dur, done){
    var from = keys.map(function(k){ return S[k]; });
    MV.tween({ dur:dur, step:function(t){ keys.forEach(function(k, i){ S[k] = lerp(from[i], to[i], t); }); plot.render(); },
      done:function(){ keys.forEach(function(k, i){ S[k] = to[i]; }); plot.render(); if (done) done(); } });
  }
  function bannerAppend(text){ var b = $("[data-mv=banner]", host); if (b && text) b.textContent = (b.textContent ? b.textContent + " " : "") + text; }
  function plainB(p, i){ return MV.plain((p.banners || [])[i] || ""); }
  paint();
  return {
    predict:{
      start:function(p){ setState(p.start); },
      run:function(p, done){
        O.anim = true; drag.sync();
        var last = "";
        var fin = function(){ O.anim = false; api.save(); paint(); MV.changed(); MV.wait(250, function(){ done(); bannerAppend(last); }); };
        if (p.id === "p1") {
          tw(["c"], [4], 1200, function(){ last = plainB(p, 0); MV.banner("", last); MV.wait(900, function(){ tw(["d"], [-3], 1200, function(){ last = plainB(p, 1); MV.banner("", last); MV.wait(800, fin); }); }); });
        } else if (p.id === "p2") {
          O.bracket = { x:4, y0:0, y1:1 };
          MV.tween({ dur:1500, step:function(t){ S.a = lerp(1, -3, t); O.bracket.y1 = S.a; O.glow = Math.sin(Math.PI * t); plot.render(); },
            done:function(){ S.a = -3; O.bracket.y1 = -3; O.glow = 0.6; plot.render(); last = plainB(p, 0); MV.banner("", last); MV.wait(1200, function(){ var br = O.bracket; fin(); O.bracket = br; O.glow = 0.6; plot.render(); }); } });
        } else if (p.id === "p3") {
          O.flip = 1;
          MV.tween({ dur:1500, step:function(t){ O.flip = Math.cos(Math.PI * t); plot.render(); },
            done:function(){ O.flip = null; S.k = -1; if (MV.reduceMotion) O.ghost = { b:S.b, a:S.a, k:1, d:S.d, c:S.c }; plot.render(); last = plainB(p, 0); MV.banner("", last); MV.wait(900, function(){ var gh = O.ghost; fin(); O.ghost = gh; plot.render(); }); } });
        } else if (p.id === "p4") {
          O.rows = 0; paint();
          var kt = function(a, b, cb){ MV.tween({ dur:1000, step:function(t){ O.ksAnim = a * Math.pow(b / a, t); plot.render(); drawInset(); }, done:function(){ O.ksAnim = null; S.ks = b; O.anim = false; paint(); O.anim = true; cb(); } }); };
          kt(1, 2, function(){ MV.wait(500, function(){ kt(2, 4, function(){
            var r = 0; (function addRow(){ r++; O.rows = r; O.anim = false; paint(); O.anim = true; if (r < 4) MV.wait(350, addRow); else MV.wait(500, function(){ slideRun(function(){ last = plainB(p, 0); MV.wait(700, fin); }); }); })();
          }); }); });
        } else fin();
      }
    },
    challenge:function(id, opt){
      var P = cur(), F = (C.chalFb || {})[id] || {}, M = function(s){ return m(s); };
      void opt;
      if (id === "tc1") {
        if (near(P.d, 3) && P.k < 0 && onGraph(P, 2, 0)) return { ok:true };
        if (near(P.d, -3)) return { ok:false, msg:F.dm3 };
        if (near(P.d, 3) && P.k > 0 && P.a < 0) return { ok:false, msg:F.aNeg };
        if (near(P.d, 3) && P.k > 0) return { ok:false, msg:F.kPos };
        if (near(P.d, 3) && P.k < 0) return { ok:false, msg:fill(F.miss, { yv:yv(valAt(P, 2)) }) };
        return { ok:false, msg:CH.tc1.general };
      }
      if (id === "tc2") {
        var T2 = CH.tc2.target.pts;
        if (T2.every(function(q){ return onGraph(P, q[0], q[1]); })) return { ok:true };
        if (P.k > 0) return { ok:false, msg:F.kPos };
        if (near(P.d, -1)) return { ok:false, msg:F.dm1 };
        if (P.a < 0) return { ok:false, msg:F.aNeg };
        if (P.b === 2 && near(P.d, 1) && near(P.k, -1) && near(P.a, 1) && near(P.c, -1)) return { ok:false, msg:F.a1 };
        if (P.b !== 2) return { ok:false, msg:fill(F.base, { b:M(String(P.b)) }) };
        return { ok:false, msg:CH.tc2.general };
      }
      if (id === "tc3") {
        if (near(P.d, -2) && onGraph(P, 0, 1) && onGraph(P, 6, -1)) return { ok:true };
        if (P.k < 0) return { ok:false, msg:F.kNeg };
        if (P.a > 0) return { ok:false, msg:F.aPos };
        if (P.b === 2 && near(P.a, -2)) return { ok:false, msg:F.a2 };
        if (P.b !== 2) { var L = logb(4, P.b); return { ok:false, msg:fill(F.base, { b:M(String(P.b)), L:M(logS(P.b) + " 4"), v:M(ap(L)), av:M(ap(-2 / L)) }) }; }
        return { ok:false, msg:fill(F.other, { y0:yv(valAt(P, 0)), y6:yv(valAt(P, 6)) }) };
      }
      return { ok:false };
    }
  };
}

// ---------- Part 3: Wall, domain and key points by hand ----------
// @component N8 logSketchBuilder — read a, k, d, c (fraction boxes; optional "Factor first" line), place the wall (tap the x-axis or
// Place wall + arrows, drag), choose the side, map three key points into fraction boxes (points and arrows appear as rows fill),
// "Draw my sketch" (monotone cubic between the points, log-shaped ends toward and away from the wall), live self-consistency line,
// named per-entry feedback on Check, true-graph overlay
var PV = { xmin:-8, xmax:8, ymin:-6, ymax:6 };
function parseOne(raw){ var s = String(raw == null ? "" : raw).trim(); if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }
// monotone cubic (Fritsch–Carlson) through knots (u sorted), with end tangents m0, m2
function monoCubic(us, ys, m0, mN){
  var n = us.length, dl = [], ms = [], i;
  for (i = 0; i < n - 1; i++) dl.push((ys[i + 1] - ys[i]) / (us[i + 1] - us[i]));
  ms[0] = m0; ms[n - 1] = mN; for (i = 1; i < n - 1; i++) ms[i] = dl[i - 1] * dl[i] <= 0 ? 0 : (dl[i - 1] + dl[i]) / 2;
  for (i = 0; i < n - 1; i++) {
    if (dl[i] === 0) { ms[i] = 0; ms[i + 1] = 0; continue; }
    var a = ms[i] / dl[i], b = ms[i + 1] / dl[i];
    if (a < 0) ms[i] = 0; if (b < 0) ms[i + 1] = 0;
    var s = a * a + b * b; if (s > 9) { var t = 3 / Math.sqrt(s); ms[i] = t * a * dl[i]; ms[i + 1] = t * b * dl[i]; }
  }
  return function(u){
    var k = 0; while (k < n - 2 && u > us[k + 1]) k++;
    var h = us[k + 1] - us[k], t = (u - us[k]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[k] + (t3 - 2 * t2 + t) * h * ms[k] + (-2 * t3 + 3 * t2) * ys[k + 1] + (t3 - t2) * h * ms[k + 1];
  };
}
function sketchPts(pts, wall, side, v){
  var s = side === "r" ? 1 : -1, P = pts.map(function(q){ return { u:s * (q[0] - wall), y:q[1] }; }).sort(function(a, b){ return a.u - b.u; });
  var fit = function(p, q){ var A = (q.y - p.y) / Math.log(q.u / p.u); return { A:A, f:function(u){ return A * Math.log(u / p.u) + p.y; } }; };
  var nf = fit(P[0], P[1]), ff = fit(P[1], P[2]), mc = monoCubic(P.map(function(z){ return z.u; }), P.map(function(z){ return z.y; }), nf.A / P[0].u, ff.A / P[2].u);
  var umax = (s > 0 ? v.xmax - wall : wall - v.xmin) + 0.2, out = [], i, u;
  if (P[0].u > 0.1) for (i = 0; i <= 80; i++) { u = 0.1 * Math.pow(P[0].u / 0.1, i / 80); out.push([u, nf.f(u)]); }
  for (i = 0; i <= 120; i++) { u = P[0].u + (P[2].u - P[0].u) * i / 120; out.push([u, mc(u)]); }
  if (umax > P[2].u) for (i = 1; i <= 120; i++) { u = P[2].u + (umax - P[2].u) * i / 120; out.push([u, ff.f(u)]); }
  return out.map(function(z){ return [wall + s * z[0], z[1]]; });
}
function part3(host, api){
  var C = api.content, U = C.ui, R = C.rounds, S = api.S, CK = C.checks;
  S.r = S.r || 0; S.st = S.st || {};
  var fbList = null, reveal = null, dragged = false;
  function st(i){ i = i == null ? S.r : i; var id = R[i].id; return S.st[id] || (S.st[id] = { p:{ a:"", k:"", d:"", c:"" }, f:["", ""], wall:null, side:"", pts:[["", ""], ["", ""], ["", ""]], drawn:false, marks:null, tries:0, hint:0, solved:false, first:null }); }
  function box(id, lab, w){ return '<label class="lh-box" for="' + id + '"><span class="m">' + lab + '</span><input class="numin lh-in' + (w ? " " + w : "") + '" id="' + id + '" type="text" autocomplete="off" spellcheck="false" data-in="' + id + '"></label>'; }
  host.innerHTML = '<div class="chips lh-rounds" id="lh-rounds" role="group" aria-label="Rounds"></div><p class="eq-cap lh-eq" id="lh-eq"></p>' +
    '<div class="sym lh"><div><div class="plot-wrap"><canvas class="plot" id="lh-plot" role="img" aria-label="Sketch grid"></canvas></div>' +
      '<p class="lw-leg tiny muted"><span><i class="ln par"></i>your wall</span><span><i class="dt ho"></i>parent points</span><span><i class="dt dk"></i>your images</span><span><i class="ln tg"></i>your sketch</span><span><i class="ln cur"></i>true graph</span></p></div>' +
    '<div><ol class="lh-steps">' +
      '<li><strong>' + U.steps[0] + '</strong><div class="lh-fac" id="lh-fac"><span class="lh-flab">' + U.factorLab + '</span> <span id="lh-flhs"></span> ' + box("lh-f0", "", "short") + '<span class="m">(x −</span> ' + box("lh-f1", "", "short") + '<span class="m">)</span></div>' +
        '<div class="lh-pbox">' + box("lh-a", "<i class=\"p-a\">a</i> =") + box("lh-k", "<i class=\"p-k\">k</i> =") + box("lh-d", "<i class=\"p-d\">d</i> =") + box("lh-c", "<i class=\"p-c\">c</i> =") + "</div></li>" +
      '<li><strong>' + U.steps[1] + '</strong><p class="tiny muted">' + U.wallHow + '</p><div class="q-actions"><button type="button" class="btn sm" id="lh-wallb">Place wall</button><span id="lh-wallv" class="lh-v"></span></div></li>' +
      '<li><strong>' + U.steps[2] + '</strong><div id="lh-side"></div></li>' +
      '<li><strong>' + U.steps[3] + '</strong><p class="tiny muted">' + U.pointsHow + '</p><div class="lh-pts" id="lh-pts"></div></li>' +
      '<li><strong>' + U.steps[4] + '</strong><p class="tiny muted">' + U.sketchHow + '</p><div class="q-actions"><button type="button" class="btn sm" id="lh-draw">Draw my sketch</button></div></li></ol>' +
    '<ul class="checks lh-checks" id="lh-checks"></ul>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="lh-check">Check my sketch</button><span id="lh-hb"></span></div><div id="lh-hints"></div><div id="lh-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="lh-prev">Previous round</button><button type="button" class="btn ghost sm" id="lh-next">Next round</button></div>' +
    '<details class="alg" id="lh-alg"><summary>Check it with algebra</summary><div id="lh-algb"></div></details></div></div>';
  // points table: one row per parent point, two boxes for its image
  $("#lh-pts", host).innerHTML = [0, 1, 2].map(function(i){ return '<div class="lh-prow"><span class="lh-par" id="lh-par' + i + '"></span><span class="m">→ (</span>' + box("lh-x" + i, "", "short") + '<span class="m">,</span>' + box("lh-y" + i, "", "short") + '<span class="m">)</span></div>'; }).join("");
  $$(".lh-prow", host).forEach(function(r, i){ var ins = r.querySelectorAll("input"); ins[0].setAttribute("aria-label", "x-coordinate of image " + (i + 1)); ins[1].setAttribute("aria-label", "y-coordinate of image " + (i + 1)); });
  $("#lh-f0", host).setAttribute("aria-label", "Factor in front of the bracket"); $("#lh-f1", host).setAttribute("aria-label", "Number subtracted from x in the bracket");
  var sideRG = radios($("#lh-side", host), { aria:"Domain side", cls:"chips", value:"", options:[{ id:"l", t:U.sides[0] }, { id:"r", t:U.sides[1] }], onChange:function(v){ var x = st(); if (x.solved) return; x.side = v; touched([2]); } });
  var plot = new MV.Plot($("#lh-plot", host), PV);
  function rd(){ return R[S.r] || R[0]; }
  function vals(x){ var o = {}; ["a", "k", "d", "c"].forEach(function(k){ o[k] = parseOne(x.p[k]); }); return o; }
  function ptsOf(x){ return x.pts.map(function(q){ var X = parseOne(q[0]), Y = parseOne(q[1]); return X == null || Y == null ? null : [X, Y]; }); }
  function ready(x, r){ var v = vals(x), p = ptsOf(x); return ["a", "k", "d", "c"].every(function(k){ return v[k] != null; }) && (!r.factor || (parseOne(x.f[0]) != null && parseOne(x.f[1]) != null)) && x.wall != null && !!x.side && p.every(Boolean); }
  // line 5: do the student's own entries agree with each other?
  function agree(x){
    var p = ptsOf(x); if (x.wall == null || !x.side || !p.every(Boolean)) return { ok:false, msg:"" };
    var s = x.side === "r" ? 1 : -1, w = x.wall;
    for (var i = 0; i < 3; i++) {
      var u = s * (p[i][0] - w), pt = ptT(qq(p[i][0]), qq(p[i][1]));
      if (near(u, 0)) return { ok:false, msg:fill(U.onWall, { pt:pt, w:m(pS(w)) }), bad:i };
      if (u < 0) return { ok:false, msg:fill(U.wrongSide, { pt:pt, lr:p[i][0] < w ? "left" : "right", w:m(pS(w)), side:x.side === "r" ? "right" : "left" }), bad:i };
    }
    var q = p.map(function(z){ return { u:s * (z[0] - w), y:z[1] }; }).sort(function(a, b){ return a.u - b.u; });
    if (near(q[0].u, q[1].u) || near(q[1].u, q[2].u)) return { ok:false, msg:U.sameX };
    var up = q[1].y > q[0].y && q[2].y > q[1].y, dn = q[1].y < q[0].y && q[2].y < q[1].y;
    if (!up && !dn) return { ok:false, msg:fill(U.notMono, { hs:q.map(function(z){ return qT(qq(z.y)); }).join(", ") }) };
    return { ok:true, msg:"" };
  }
  plot.render = function(){
    var r = rd(), x = st(), K = cols(), A = MV.ans(r), p = ptsOf(x), ag = agree(x), b = r.b;
    var desc = "Sketch grid for " + MV.plain(r.eq) + ". " + (x.wall != null ? "Your wall x = " + num(x.wall) + ". " : "No wall yet. ") + (x.side ? "Domain " + (x.side === "r" ? "right" : "left") + " of the wall. " : "") +
      p.map(function(q, i){ return q ? "Image " + (i + 1) + ": " + ptT(qq(q[0]), qq(q[1])) + ". " : ""; }).join("") + (x.drawn && ag.ok ? "Your sketch is drawn with long dashes. " : "") + (x.solved ? "The true graph is drawn in blue." : "");
    plot.draw({ view:PV, xTicks:evenTicks(2, plot.W < 420), yTicks:evenTicks(2), describe:desc, after:function(ctx, pp){
      LBL = [];
      if (x.wall != null && x.side) { hatch(ctx, pp, x.wall, x.side === "r", { alpha:0.8 }); band(ctx, pp, x.wall, x.side === "r", {}); }
      if (x.wall != null) wallLine(ctx, pp, x.wall, x.side !== "l", { tok:[{ t:num(x.wall) }], chip:false });
      r.parents.forEach(function(q, i){
        pp.point({ x:q[0], y:q[1], r:4.5, open:true, color:K.ink2 });
        if (p[i]) { if (Math.hypot(p[i][0] - q[0], p[i][1] - q[1]) > 1e-6) { pp.segment({ x1:q[0], y1:q[1], x2:p[i][0], y2:p[i][1], color:K.ink2, width:1.1, arrow:inView(PV, p[i][0], p[i][1]) }); if (!inView(PV, p[i][0], p[i][1])) edgeMark(pp, q, p[i], K.ink); } }
      });
      if (x.drawn && ag.ok) pp.curve({ pts:sketchPts(p, x.wall, x.side, PV), color:K.ink, width:2.6, dash:[14, 8] });
      if (x.solved || reveal != null) drawLog(pp, { b:b, a:A.a, k:A.k, d:A.d, c:A.c }, { color:K.pen, width:3.2, reveal:reveal == null ? 1 : reveal, arrows:reveal == null });
      p.forEach(function(q, i){
        if (!q || !inView(PV, q[0], q[1])) return;
        pp.point({ x:q[0], y:q[1], r:5.5, color:K.ink });
        if (ag.bad === i) { ctx.save(); ctx.beginPath(); ctx.arc(pp.X(q[0]), pp.Y(q[1]), 10, 0, Math.PI * 2); ctx.lineWidth = 2.6; ctx.strokeStyle = K.red; ctx.stroke(); ctx.restore(); }
        ptLabel(ctx, pp, qq(q[0]), qq(q[1]), x.side !== "l", i);
      });
      LBL = null;
    } });
  };
  var drag = MV.drag(plot, {
    handles:function(){ var x = st(); return x.solved || x.wall == null ? [] : [{ id:"w", x:x.wall, y:0, label:"Your wall x = " + num(x.wall) + ". Left and Right move it by 0.5." }]; },
    move:function(id, px, py, how){ var x = st(); if (x.solved) return; if (how === "drag") dragged = true; setWall(clamp(r2(px), -7.5, 7.5)); },
    step:{ x:0.5, y:0.5 }, big:4, axis:"x"
  });
  plot.c.style.touchAction = "pan-y";
  plot.c.addEventListener("pointerdown", function(){ dragged = false; });
  plot.c.addEventListener("click", function(e){
    var x = st(); if (x.solved) return;
    if (dragged) { dragged = false; return; }
    var rc = plot.c.getBoundingClientRect(), px = e.clientX - rc.left, py = e.clientY - rc.top;
    if (Math.abs(py - plot.Y(0)) <= 22) setWall(clamp(r2(plot.xOf(px)), -7.5, 7.5));
  });
  function setWall(v){ var x = st(); if (x.wall === v) { plot.render(); return; } x.wall = v; touched([1]); }
  function touched(lines){ var x = st(); if (x.marks) lines.forEach(function(k){ x.marks[k] = null; }); fbList = null; api.save(); paint(); }
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.in; if (!id) return;
    var x = st(), v = e.target.value;
    if (/^lh-[akdc]$/.test(id)) { x.p[id.slice(3)] = v; touched([0]); }
    else if (/^lh-f[01]$/.test(id)) { x.f[+id.slice(4)] = v; touched([0]); }
    else if (/^lh-[xy]\d$/.test(id)) { x.pts[+id.slice(4)][id[3] === "x" ? 0 : 1] = v; touched([3]); }
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.in) { var b = $("#lh-check", host); if (!b.disabled) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var x = st();
    if (b.dataset.r != null) { S.r = +b.dataset.r; fbList = null; reveal = null; api.save(); paint(true); return; }
    if (b.id === "lh-prev" || b.id === "lh-next") { S.r = clamp(S.r + (b.id === "lh-prev" ? -1 : 1), 0, R.length - 1); fbList = null; reveal = null; api.save(); paint(true); return; }
    if (x.solved) return;
    if (b.id === "lh-wallb") { if (x.wall == null) setWall(0); drag.sync(); drag.focus("w"); return; }
    if (b.id === "lh-draw") { x.drawn = true; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id === "lh-check") check();
  });
  function check(){
    var r = rd(), x = st(), A = MV.ans(r), W = r.wrong || {}, G = U.generic, v = vals(x), p = ptsOf(x);
    if (!ready(x, r)) return;
    var fOK = !r.factor || (near(parseOne(x.f[0]), A.f[0]) && near(parseOne(x.f[1]), A.f[1]));
    var badP = ["a", "k", "d", "c"].filter(function(k){ return !near(v[k], A[k]); });
    var badPts = [0, 1, 2].filter(function(i){ return !(near(p[i][0], A.img[i][0]) && near(p[i][1], A.img[i][1])); });
    x.marks = [fOK && !badP.length, near(x.wall, A.d), x.side === A.side, !badPts.length];
    var msgs = [], l1 = [];
    if (!fOK) { var fw = (W.factor || []).filter(function(w){ return near(parseOne(x.f[0]), w.v[0]) && near(parseOne(x.f[1]), w.v[1]); })[0]; l1.push(fw ? fw.fb : G.factor); }
    if (badP.length) {
      var dn = badP.indexOf("d") >= 0 ? (W.d || []).filter(function(w){ return near(v.d, w.v); })[0] : null;
      if (dn) l1.push(dn.fb);
      var rest = badP.filter(function(k){ return !(k === "d" && dn); });
      if (rest.length) l1.push(fill(G.params, { list:rest.map(function(k){ return m("@" + k + "{" + k + "}"); }).join(", ").replace(/, ([^,]*)$/, " and $1") }));
    }
    if (l1.length) msgs.push([CK[0], l1.join(" ")]);
    if (!x.marks[1]) { var ww = (W.wall || []).filter(function(w){ return near(x.wall, w.v); })[0]; msgs.push([CK[1], ww ? ww.fb : fill(G.wall, { w:m(pS(x.wall)) })]); }
    if (!x.marks[2]) msgs.push([CK[2], W.side || G.side]);
    if (badPts.length) msgs.push([CK[3], badPts.map(function(i){ var nw = (W.pts || []).filter(function(w){ return w.i === i && near(p[i][0], w.p[0]) && near(p[i][1], w.p[1]); })[0]; var q = r.parents[i]; return nw ? nw.fb : fill(G.point, { pt:ptT(qq(q[0]), qq(q[1])) }); }).join(" ")]);
    if (!msgs.length) {
      x.solved = true; x.first = x.tries === 0 && x.hint < 3; fbList = null; api.save(); paint();
      reveal = 0;
      MV.tween({ dur:1200, ease:LIN, step:function(t){ reveal = t; plot.render(); }, done:function(){ reveal = null; plot.render(); } });
    } else { x.tries++; fbList = msgs; api.save(); paint(); }
    MV.focusFb($("#lh-fb", host));
  }
  function paint(load){
    var i = S.r, x = st(), r = rd(), ag = agree(x);
    MV.keepFocus($("#lh-rounds", host), function(){ $("#lh-rounds", host).innerHTML = R.map(function(rr, k){ var y = st(k); return '<button type="button" class="chip' + (k === i ? " on" : "") + '" data-r="' + k + '" data-k="lhr' + k + '" aria-pressed="' + (k === i) + '">' + (y.solved ? "✓ " : "") + "Round " + (k + 1) + "</button>"; }).join(""); });
    $("#lh-eq", host).innerHTML = r.eq;
    $("#lh-fac", host).hidden = !r.factor; if (r.factor) $("#lh-flhs", host).innerHTML = r.factor.lhs;
    var setIn = function(id, v){ var el = $("#" + id, host); if (load || document.activeElement !== el) el.value = v; el.disabled = x.solved; };
    ["a", "k", "d", "c"].forEach(function(k){ setIn("lh-" + k, x.p[k]); });
    setIn("lh-f0", x.f[0]); setIn("lh-f1", x.f[1]);
    r.parents.forEach(function(q, k){ $("#lh-par" + k, host).innerHTML = m(ptSrc(qq(q[0]), qq(q[1]))); setIn("lh-x" + k, x.pts[k][0]); setIn("lh-y" + k, x.pts[k][1]); });
    $("#lh-wallv", host).innerHTML = x.wall != null ? m("x = " + pS(x.wall)) : "";
    $("#lh-wallb", host).disabled = x.solved; $("#lh-draw", host).disabled = x.solved;
    sideRG.set(x.side || ""); sideRG.lock(x.solved);
    var marks = x.marks || [];
    $("#lh-checks", host).innerHTML = CK.map(function(lab, k){
      var l5 = k === 4, ok = l5 ? ag.ok : marks[k] === true, bad = l5 ? !ag.ok && !!ag.msg : marks[k] === false;
      return '<li class="' + (ok ? "yes" : bad ? "no bad" : "no") + '"><span class="mk" aria-hidden="true">' + (ok ? "✓" : bad ? "✗" : "○") + "</span><span>" + lab + '<span class="vh">' + (ok ? " (met)" : " (not met)") + "</span>" + (l5 && ag.msg ? '<span class="lh-why">' + ag.msg + "</span>" : "") + "</span></li>";
    }).join("");
    $("#lh-check", host).disabled = x.solved || !ready(x, r);
    MV.keepFocus($("#lh-hb", host), function(){ $("#lh-hb", host).innerHTML = x.solved ? "" : MV.hintBtn("lhh" + r.id, x.hint); });
    $("#lh-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(r.hints, x.hint);
    var fb = "";
    if (x.solved) fb = '<div class="fb good" role="status"><p><strong>✓ ' + U.allRight + "</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (fbList) fb = '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong></p><ul class="lh-fbl">' + fbList.map(function(z){ return "<li><strong>" + MV.plain(z[0]).replace(/&/g, "&amp;") + ":</strong> " + z[1] + "</li>"; }).join("") + "</ul></div>";
    $("#lh-fb", host).innerHTML = fb;
    $("#lh-prev", host).disabled = i === 0; $("#lh-next", host).disabled = i === R.length - 1;
    var alg = $("#lh-alg", host), open = alg.open;
    $("#lh-algb", host).innerHTML = "<p><strong>This round:</strong> " + r.alg + "</p>" + C.algGeneral.map(function(g){ return "<p><strong>" + g[0] + ":</strong> " + g[1] + "</p>"; }).join("");
    alg.open = open;
    plot.render();
  }
  paint(true);
  MV.ACTS.byhand = { a:{ id:"byhand" },
    stats:function(){ var f = 0, d = 0; R.forEach(function(r, i){ var y = st(i); if (y.solved) d++; if (y.first) f++; }); return { first:f, total:R.length, done:d, line:"Wall, domain and key points by hand (first try): " + f + "/" + R.length + " rounds" + (d < R.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; R.forEach(function(r, i){ var y = st(i); if (y.tries > 0 || y.hint >= 3) g = g.concat(MV.goalIdx(r.goal)); }); return g; } };
  return {};
}

// ---------- Practice 3: Work backwards (fill in the coefficients) ----------
// @component N4 logCoefBoxes — y = [a] log_b[[k](x − [d])] + [c] templates (or shorter ones) with fraction boxes, same-function
// acceptance (d, sign of k, a and c + a·log_b|k|), named wrong entries, generic feature-by-feature feedback, mini-graph after Check
function backwards(host, api, a){
  var S = api.S; S.items = S.items || {};
  var U = a.ui, msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { v:{ a:"", k:"", d:"", c:"" }, tries:0, hint:0, solved:false, first:null, last:null }); }
  function inp(it, p){ var x = ist(it.id); return '<input class="numin bw-in" id="bw-' + it.id + p + '" type="text" autocomplete="off" spellcheck="false" aria-label="' + p + '" data-bi="' + it.id + '" data-bp="' + p + '" data-k="bw' + it.id + p + '" value="' + MV.esc(x.v[p] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function tplHTML(it){
    var lb = it.b === 10 ? "log" : "log_{" + it.b + "}";
    var g = function(h){ return '<span class="bw-g">' + h + "</span>"; };
    if (it.tpl === "dc") return g(m("y = " + lb + "(x -") + inp(it, "d") + m(")")) + g(m("+") + inp(it, "c"));
    if (it.tpl === "adc") return g(m("y =") + inp(it, "a") + m(lb + "(x -")) + g(inp(it, "d") + m(")")) + g(m("+") + inp(it, "c"));
    return g(m("y =") + inp(it, "a") + m(lb + "[")) + g(inp(it, "k") + m("(x -") + inp(it, "d") + m(")]")) + g(m("+") + inp(it, "c"));
  }
  function asked(it){ return it.tpl === "dc" ? ["d", "c"] : it.tpl === "adc" ? ["a", "d", "c"] : ["a", "k", "d", "c"]; }
  function valsOf(it, x){ var o = { a:1, k:1, d:0, c:0 }, bad = null; asked(it).forEach(function(p){ var v = parseOne(x.v[p]); if (v == null) bad = bad || "empty"; else o[p] = v; }); if (!bad && (o.a === 0 || o.k === 0)) bad = o.a === 0 ? "a" : "k"; o.b = it.b; return bad ? { bad:bad } : o; }
  function same(P, K){ return near(P.d, K.d) && (P.k > 0) === (K.k > 0) && near(P.a, K.a) && near(P.c + P.a * logb(Math.abs(P.k), P.b), K.c + K.a * logb(Math.abs(K.k), K.b)); }
  function generic(it, P){
    var parts = [], mk = function(ok){ return ok ? " ✓" : " ✗"; };
    if (it.wall != null) { parts.push(fill(U.wall, { w:m(pS(P.d)) }) + mk(near(P.d, it.wall))); parts.push(fill(U.side, { lr:P.k > 0 ? "right" : "left" }) + mk((P.k > 0) === (it.side === "r"))); }
    it.pts.forEach(function(q){
      var r = valAt(P, q[0]), X = m(pS(q[0])), need = fill(U.needs, { v:m(pS(q[1])) });
      if (!r.ok) parts.push(fill(U.none, { x:X }) + " ✗ " + need);
      else if (Math.abs(r.v - q[1]) < 1e-9) parts.push(fill(U.passes, { pt:ptT(qq(q[0]), qq(q[1])) }) + " ✓");
      else parts.push(fill(U.gives, { x:X, yv:yv(r) }) + " ✗ " + need);
    });
    return U.your + " " + parts.join(", ") + ".";
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-bq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.feat + "</div>" + (it.star ? '<span class="tag" title="Above Final Check level">★</span>' : "") + "</div>";
        h += '<div class="bw-tpl">' + tplHTML(it) + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p>' + it.right + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        if (x.last) h += '<canvas class="plot bw-mini" data-bwc="' + it.id + '" role="img" aria-label="Your curve with the item’s points"></canvas>';
        return h + "</div>";
      }).join("");
    });
    $$("canvas[data-bwc]", host).forEach(function(cv){
      var it = a.items.filter(function(q){ return q.id === cv.dataset.bwc; })[0], x = ist(it.id), P = x.last, p = new MV.Plot(cv, it.view);
      p.render = function(){
        var K = cols();
        p.draw({ view:it.view, xTicks:evenTicks(2, p.W < 300), yTicks:evenTicks(2), describe:"Your curve " + MV.plain(m(eqSrc(P))) + " with the points " + it.pts.map(function(q){ return ptT(qq(q[0]), qq(q[1])); }).join(", ") + " ringed.",
          after:function(ctx){ wallLine(ctx, p, P.d, P.k > 0, { label:false }); drawLog(p, P, { arrows:true }); it.pts.forEach(function(q){ ring(p, q[0], q[1]); }); } });
      };
      p.render();
    });
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bp) return; ist(t.dataset.bi).v[t.dataset.bp] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.bp) { var b = host.querySelector('[data-k="' + e.target.dataset.bi + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-bq]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.bq; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act !== "check") return;
    var P = valsOf(it, x), K = MV.ans(it);
    if (P.bad) { msgs[it.id] = P.bad === "empty" ? U.empty : fill(U.zero, { p:m("@" + P.bad + "{" + P.bad + "}") }); paint(); MV.focusFb(host.querySelector('[data-bq="' + it.id + '"]')); return; }
    x.last = P;
    if (same(P, { b:it.b, a:K.a, k:K.k, d:K.d, c:K.c })) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else {
      x.tries++;
      var raw = {}; asked(it).forEach(function(p){ raw[p] = parseOne(x.v[p]); });
      var nw = (it.wrong || []).filter(function(w){ return Object.keys(w.m).every(function(k){ return raw[k] != null && near(raw[k], w.m[k]); }); })[0];
      msgs[it.id] = "<strong>✗ Not quite.</strong> " + (nw ? nw.fb : generic(it, P)) + " Try again.";
    }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-bq="' + it.id + '"]'));
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = S.items[it.id]; if (x && x.solved) d++; if (x && x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = S.items[it.id]; if (x && (x.tries > 0 || x.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Rising to the wall ----------
var task = (function(){
  var api, plot, sl, T;
  function read(){ var s = api ? api.S : {}; return { b:s.b || 2, a:s.a == null ? 1 : s.a, k:s.k == null ? 1 : s.k, d:s.d || 0, c:s.c || 0 }; }
  function x0Of(d){ return d.d + Math.pow(d.b, -d.c / d.a) / d.k; }
  function checks(d){
    var x0 = x0Of(d), n = Math.round(x0);
    return [near(d.d, 4) && d.k < 0, onGraph(d, 3, 2), d.a * d.k > 0, isFinite(x0) && Math.abs(x0 - n) < 1e-9 && n >= -10 && n <= 10];
  }
  function cPrime(d){ return d.c + d.a * logb(Math.abs(d.k), d.b); }
  function key(d){ return [d.b, d.a, d.k > 0 ? 1 : -1, d.d, Math.round(cPrime(d) * 1e6) / 1e6].join("|"); }
  function canon(k){
    var p = k.split("|").map(Number), b = p[0], a = p[1], s = p[2], d = p[3], c = p[4];
    var inner = s > 0 ? (near(d, 0) ? " x" : "(" + xdS(d) + ")") : (near(d, 0) ? "(-x)" : "(" + pS(d) + " - x)");
    return "y = " + aPre(a) + logS(b) + inner + cTail(Math.abs(c - Math.round(c)) < 1e-6 ? Math.round(c) : Math.round(c * 100) / 100);
  }
  function draw(){
    var d = read(), inD = d.k * (api.S.p - d.d) > 0, f = fOf(d);
    plot.draw({ view:TV, xTicks:evenTicks(2, plot.W < 420), yTicks:evenTicks(2), describe:describeT(d, " The point (3, 2) is ringed. Probe at x = " + num(api.S.p) + (inD ? ", y = " + ap(f(api.S.p)) : ", no value") + "."),
      after:function(ctx, p){
        sceneT(p, d, { par:false, after:function(pp, K){
          ring(pp, 3, 2);
          var Xp = pp.X(api.S.p), y = f(api.S.p);
          ctx.save(); ctx.strokeStyle = K.ink; ctx.lineWidth = 1.6; if (!inD) ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(Xp, 0); ctx.lineTo(Xp, pp.H); ctx.stroke(); ctx.restore();
          if (inD && y >= TV.ymin && y <= TV.ymax) pp.point({ x:api.S.p, y:y, r:5.5, color:K.ink });
          if (!inD) uiText(ctx, pp, "no value", Xp + (Xp > pp.W - 80 ? -8 : 8), pp.Y(0) - 30, { chip:true, color:K.ink, align:Xp > pp.W - 80 ? "right" : "left" });
          pp.point({ x:api.S.p, y:0, r:6.5, color:K.ink, ring:true });
        } });
      } });
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S;
      def(S, { b:2, a:1, k:1, d:0, c:0, p:3 });
      inp.innerHTML = '<p class="eq-cap lw-cap" id="rw-eq" aria-live="polite"></p><div id="rw-base"></div><div id="rw-sl" class="rw-sl"></div>';
      var box = document.createElement("div"); box.className = "rw-pv";
      box.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="rw-plot" role="img" aria-label="Preview of your design"></canvas></div><p class="tiny muted rw-note">Drag the probe (or focus it and use the arrow keys) to test any ' + m("x") + "-value. The point (3, 2) is ringed.</p>";
      // on narrow screens the preview sits between the equation and the controls, so it stays in view while designing
      var mq = window.matchMedia ? window.matchMedia("(max-width: 820px)") : null;
      var place = function(){ if (mq && mq.matches) inp.insertBefore(box, $("#rw-base")); else pv.appendChild(box); if (plot) draw(); };
      place(); if (mq) { if (mq.addEventListener) mq.addEventListener("change", place); else if (mq.addListener) mq.addListener(place); }
      plot = new MV.Plot($("#rw-plot"), TV); plot.render = draw;
      MV.drag(plot, { handles:function(){ return [{ id:"p", x:S.p, y:0, label:"Probe at x = " + num(S.p) + ". Left and Right move it by 0.5." }]; }, move:function(id, x){ S.p = clamp(r2(x), -12, 12); a.save(); draw(); }, axis:"x", step:{ x:0.5, y:0.5 }, big:4 });
      plot.c.style.touchAction = "pan-y";
      function upd(){ a.save(); $("#rw-eq").innerHTML = m(eqSrc(read(), true)); draw(); a.update(); }
      baseChips($("#rw-base"), S, upd);
      sl = paramSliders($("#rw-sl"), S, "rw-", upd);
      $("#rw-eq").innerHTML = m(eqSrc(read(), true)); draw();
      // extra messages after the frame's own feedback: a repeated function, and all five found
      $("#task-check").addEventListener("click", function(){
        var d = read(), ok = checks(d).every(Boolean), k = key(d), had = MV.taskState().found.indexOf(k) >= 0;
        setTimeout(function(){
          if (!ok) return; var fb = $("#task-fb .fb.good"); if (!fb) return;
          if (had) fb.insertAdjacentHTML("beforeend", "<p><strong>" + T.same + "</strong></p>");
          if (MV.taskState().found.length >= 5) fb.insertAdjacentHTML("beforeend", "<p>" + T.allFive + "</p>");
        }, 0);
      });
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    tips:function(d, res){
      var out = [];
      if (!res[0]) out.push(T.tips[0]);
      if (!res[1]) {
        var r = valAt(d, 3);
        if (!r.ok) out.push(T.tip2out);
        else out.push(fill(T.tips[1], { yv:yv(r) }) + (res[0] ? " " + T.tip2more : ""));
      }
      if (!res[2]) out.push(T.tips[2]);
      if (!res[3]) { var x0 = x0Of(d); out.push(fill(T.tips[3], { v:Math.abs(x0 - d.d) > 10000 || !isFinite(x0) ? T.far : m(ap(x0)) })); }
      return out;
    },
    key:key,
    label:function(k){ return m(canon(k)); },
    text:function(k){ return MV.plain(m(canon(k))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ backwards:backwards },
  task:task
});
})();
