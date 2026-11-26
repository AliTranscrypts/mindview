// MHF4U 19 Reciprocal of Quadratic Functions: hero, Reciprocal plotter (Explore), Three cases (Part 3 sketch builder),
// Match the graph, Work backwards, Design a reciprocal (task). Plan: mhf4u/plan/modules/19-…md
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, M = MV.m;

// ---------- numbers ----------
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function near(a, b){ return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
function isInt(v){ return Math.abs(v - Math.round(v)) < 1e-9; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function ratOf(v){ for (var d = 1; d <= 1000; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9 * Math.max(1, Math.abs(v))) return [n, d]; } return null; }
// exact text: integer, else a reduced fraction n/d, else 2 decimals
function F(v){ if (isInt(v)) return num(Math.round(v)); var r = ratOf(v); return r ? (r[0] < 0 ? MINUS : "") + Math.abs(r[0]) + "/" + r[1] : num(v, 2); }
// m() source for a coefficient: integer or a stacked fraction
function coefM(v){ var t = F(v); if (t.indexOf("/") < 0) return t; var neg = t.charAt(0) === MINUS, p = t.replace(MINUS, "").split("/"); return (neg ? "-" : "") + "{" + p[0] + "}/{" + p[1] + "}"; }
function tpl(s, o){ return String(s || "").replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : m; }); }
function pt(x, y){ return '<span class="nw">(' + x + ", " + y + ")</span>"; }
function par(t){ return t.charAt(0) === MINUS ? "(" + t + ")" : t; }

// √v for a positive rational v: exact, or k√m/q in simplest form (m-source s, plain p)
function sqrtQ(v){
  var r = ratOf(v);
  if (!r || r[1] > 1000) { var w = Math.sqrt(v); return { ex:false, v:w, s:num(w, 2), p:num(w, 2) }; }
  var n = r[0], q = r[1], sn = Math.round(Math.sqrt(n)), sq = Math.round(Math.sqrt(q));
  if (sn * sn === n && sq * sq === q) return { ex:true, v:sn / sq, s:F(sn / sq), p:F(sn / sq) };
  var m = n * q, k = 1;
  for (var f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; }
  var g = gcd(k, q), kk = k / g, den = q / g, lead = kk === 1 ? "" : String(kk), tail = den === 1 ? "" : "/" + den;
  return { ex:false, v:Math.sqrt(v), s:lead + "√{" + m + "}" + tail, p:lead + "√" + m + tail };
}
// the x-value d + sg·√R
function xv(d, sg, R){
  if (R.ex) { var v = d + sg * R.v; return { v:v, s:F(v), p:F(v), ex:true }; }
  var z = near(d, 0);
  return { v:d + sg * R.v, ex:false, s:(z ? (sg < 0 ? "-" : "") : F(d) + (sg < 0 ? " - " : " + ")) + R.s, p:(z ? (sg < 0 ? MINUS : "") : F(d) + (sg < 0 ? " − " : " + ")) + R.p };
}
// a quadratic a(x − d)² + c with its zeros (n = 2, 1 or 0)
function Q(a, d, c){
  var o = { a:a, d:d, c:c, f:function(x){ return a * (x - d) * (x - d) + c; }, z:[] };
  o.n = near(c, 0) ? 1 : (a * c < 0 ? 2 : 0);
  if (o.n === 1) o.z = [{ v:d, s:F(d), p:F(d), ex:true }];
  if (o.n === 2) { o.R = sqrtQ(-c / a); o.z = [xv(d, -1, o.R), xv(d, 1, o.R)]; }
  return o;
}
// vertex form (optionally in parameter colours) and expanded form, as m() sources
function vtxSrc(a, d, c, col){
  var P = function(k, s){ return col ? "@" + k + "{" + s + "}" : s; }, s = "";
  if (near(a, -1)) s += P("a", "-"); else if (!near(a, 1)) s += P("a", coefM(a));
  s += near(d, 0) ? "x^2" : "(x " + (d > 0 ? "- " : "+ ") + P("d", coefM(Math.abs(d))) + ")^2";
  if (!near(c, 0)) s += (c > 0 ? " + " : " - ") + P("c", coefM(Math.abs(c)));
  return s;
}
function expSrc(a, d, c){
  var A = a, B = -2 * a * d, Cc = a * d * d + c, s = "";
  s += near(A, 1) ? "x^2" : near(A, -1) ? "-x^2" : coefM(A) + "x^2";
  if (!near(B, 0)) s += (B > 0 ? " + " : " - ") + (near(Math.abs(B), 1) ? "" : coefM(Math.abs(B))) + "x";
  if (!near(Cc, 0)) s += (Cc > 0 ? " + " : " - ") + coefM(Math.abs(Cc));
  return s;
}
function recSrc(a, d, c, col){ return "y = {1}/{" + vtxSrc(a, d, c, col) + "}"; }
function recInl(a, d, c){ var v = vtxSrc(a, d, c, false); return "y = 1/(" + v + ")"; }

// ---------- drawing (G1, G16) ----------
// pieces of y = 1/f inside the view, sampled densely next to each asymptote
function recipPts(p, q){
  var v = p.v, span = v.xmax - v.xmin, x0 = v.xmin - span * 0.02, x1 = v.xmax + span * 0.02, yr = v.ymax - v.ymin;
  var ylim = Math.max(Math.abs(v.ymin), Math.abs(v.ymax)) + 2 * yr;
  var zs = q.z.map(function(z){ return z.v; }).filter(function(z){ return z > x0 && z < x1; });
  var b = [x0].concat(zs, [x1]), out = [];
  function gap(z){ return q.n === 1 ? Math.sqrt(1 / (Math.abs(q.a) * ylim)) : 1 / (Math.abs(2 * q.a * (z - q.d)) * ylim); }
  for (var i = 0; i < b.length - 1; i++) {
    var lz = i > 0, rz = i < b.length - 2, a0 = lz ? b[i] + gap(b[i]) : b[i], b0 = rz ? b[i + 1] - gap(b[i + 1]) : b[i + 1], xs = [], j;
    if (!(b0 > a0)) { out.push([]); continue; }
    for (j = 0; j <= 260; j++) xs.push(a0 + (b0 - a0) * j / 260);
    if (lz || rz) [[lz, b[i], 1], [rz, b[i + 1], -1]].forEach(function(e){
      if (!e[0]) return;
      var g0 = gap(e[1]), g1 = Math.max(g0 * 1.01, (b0 - a0) / 2);
      for (var k = 0; k <= 140; k++) xs.push(e[1] + e[2] * g0 * Math.pow(g1 / g0, k / 140));
    });
    xs = xs.filter(function(x){ return x >= a0 - 1e-12 && x <= b0 + 1e-12; }).sort(function(m, n){ return m - n; });
    out.push(xs.map(function(x){ return [x, 1 / q.f(x)]; }));
  }
  return out;
}
// arrowheads at both visible ends of a piece (copied from MHF4U 18)
function endHeads(p, pts, color, size){
  var v = p.v, ins = function(t){ return t[0] >= v.xmin && t[0] <= v.xmax && t[1] >= v.ymin && t[1] <= v.ymax; };
  var i0 = -1, i1 = -1, i;
  for (i = 0; i < pts.length; i++) if (ins(pts[i])) { i0 = i; break; }
  for (i = pts.length - 1; i >= 0; i--) if (ins(pts[i])) { i1 = i; break; }
  if (i0 < 0 || i1 - i0 < 2) return;
  function back(k, dir){ var X0 = p.X(pts[k][0]), Y0 = p.Y(pts[k][1]), j = k; while (j + dir >= 0 && j + dir < pts.length) { j += dir; if (Math.hypot(p.X(pts[j][0]) - X0, p.Y(pts[j][1]) - Y0) >= 14) break; } return j; }
  p.head(pts[back(i0, 1)], pts[i0], color, size || 13);
  p.head(pts[back(i1, -1)], pts[i1], color, size || 13);
}
// o: {color, width, head, heads, upto (x cut: left-to-right draw), around:[x0, w] (outward draw), prog:[t per piece], dir:[±1 per piece]}
function drawRecip(p, q, o){
  o = o || {};
  var col = o.color || css("--pen"), w = o.width || 3.2;
  recipPts(p, q).forEach(function(pts, i){
    if (pts.length < 2) return;
    var full = true;
    if (o.upto != null && pts[pts.length - 1][0] > o.upto) { pts = pts.filter(function(t){ return t[0] <= o.upto; }); full = false; }
    if (o.around) { var x0 = o.around[0], ww = o.around[1]; if (pts[0][0] < x0 - ww || pts[pts.length - 1][0] > x0 + ww) { pts = pts.filter(function(t){ return Math.abs(t[0] - x0) <= ww; }); full = false; } }
    if (o.prog) {
      var t = o.prog[i] == null ? 1 : o.prog[i]; if (t <= 0) return;
      if (t < 1) { var lo = pts[0][0], hi = pts[pts.length - 1][0], cut = (o.dir && o.dir[i] < 0) ? hi - (hi - lo) * t : lo + (hi - lo) * t; pts = pts.filter(function(s){ return (o.dir && o.dir[i] < 0) ? s[0] >= cut : s[0] <= cut; }); full = false; }
    }
    if (pts.length < 2) return;
    p.curve({ pts:pts, color:col, width:w });
    if (full && o.heads !== false) endHeads(p, pts, col, o.head);
  });
}
function drawPara(p, q, upto){
  var v = p.v, span = v.xmax - v.xmin, pts = [], N = 240, end = upto == null ? v.xmax + span * 0.02 : upto;
  for (var i = 0; i <= N; i++) { var x = v.xmin - span * 0.02 + (end - v.xmin + span * 0.02) * i / N; pts.push([x, q.f(x)]); }
  p.curve({ pts:pts, color:css("--ink"), width:2.6, dash:[14, 6] });
}
function bgLabel(ctx, p, txt, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ("600 13px " + (p.fontM || "serif")); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(txt).width, bx = align === "right" ? X - w : align === "center" ? X - w / 2 : X;
  bx = clamp(bx, 2, p.W - w - 2); X = align === "right" ? bx + w : align === "center" ? bx + w / 2 : bx;
  Y = clamp(Y, 10, p.H - 10);
  ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(bx - 3, Y - 9, w + 6, 18); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(txt, X, Y); ctx.restore();
  return { x:bx - 3, y:Y - 9, w:w + 6, h:18 };
}
function hit(a, b){ return a && b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h; }
function textW(ctx, txt, font){ ctx.save(); ctx.font = font; var w = ctx.measureText(txt).width; ctx.restore(); return w; }
function hLine(ctx, p, y){
  var Y = p.Y(y); if (Y < -2 || Y > p.H + 2) return;
  ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(p.W, Y); ctx.stroke(); ctx.restore();
}
function dashV(ctx, p, x, y0, y1){ ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(p.X(x), p.Y(y0)); ctx.lineTo(p.X(x), p.Y(y1)); ctx.stroke(); ctx.restore(); }
function diamond(ctx, p, x, y){ var X = p.X(x), Y = p.Y(y); ctx.save(); ctx.fillStyle = css("--hi"); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X, Y - 7); ctx.lineTo(X + 7, Y); ctx.lineTo(X, Y + 7); ctx.lineTo(X - 7, Y); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
function ringAt(ctx, p, x, y, r, col, w){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 3; ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), r, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
function cross(ctx, p, x, y){ var X = p.X(x), Y = p.Y(y); ctx.save(); ctx.strokeStyle = css("--red"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X - 7, Y - 7); ctx.lineTo(X + 7, Y + 7); ctx.moveTo(X + 7, Y - 7); ctx.lineTo(X - 7, Y + 7); ctx.stroke(); ctx.restore(); }
// a growing asymptote: dashed from the top edge down by t (0..1)
function dropAsym(ctx, p, x, t, label){
  var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H * t); ctx.stroke(); ctx.restore();
  if (label && t > 0.15) { ctx.save(); ctx.font = "italic 13px " + (p.fontM || "serif"); ctx.fillStyle = css("--ink-2"); var right = X > p.W - 60; ctx.textAlign = right ? "right" : "left"; ctx.textBaseline = "middle"; ctx.fillText(label, X + (right ? -5 : 5), 14); ctx.restore(); }
}
// the range as bars along the y-axis: pieces [{a, b, aIn, bIn}] with null for ±∞
function rangeBar(ctx, p, pieces){
  var X = p.X(0), v = p.v, hi = css("--hi"), pen = css("--pen");
  if (X < 0 || X > p.W) return;
  pieces.forEach(function(r){
    var y0 = r.a == null ? v.ymin : Math.max(r.a, v.ymin), y1 = r.b == null ? v.ymax : Math.min(r.b, v.ymax), Y0 = p.Y(y0), Y1 = p.Y(y1);
    ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = hi; ctx.fillRect(X - 5, Math.min(Y0, Y1), 10, Math.abs(Y1 - Y0)); ctx.globalAlpha = 1;
    ctx.strokeStyle = pen; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X, Y0); ctx.lineTo(X, Y1); ctx.stroke(); ctx.restore();
    if (r.a == null) p.head([0, v.ymin + (v.ymax - v.ymin) * 0.08], [0, v.ymin], pen, 11);
    if (r.b == null) p.head([0, v.ymax - (v.ymax - v.ymin) * 0.08], [0, v.ymax], pen, 11);
    [[r.a, r.aIn], [r.b, r.bIn]].forEach(function(e){ if (e[0] == null) return; p.point({ x:0, y:e[0], r:5.5, open:!e[1], color:pen }); });
  });
}
function evenFmt(v){ return Math.round(v) % 2 === 0 ? num(v) : ""; }

// ---------- readout (plan: "Readout panel") ----------
function rangeSrc(q){
  var a = q.a, c = q.c, rc = c ? F(1 / c) : "";
  if (a > 0) return c > 0 ? "(0, " + rc + "]" : near(c, 0) ? "(0, ∞)" : "(-∞, " + rc + "] ∪ (0, ∞)";
  return c < 0 ? "[" + rc + ", 0)" : near(c, 0) ? "(-∞, 0)" : "(-∞, 0) ∪ [" + rc + ", ∞)";
}
function zerosTxt(q, R, dbl){
  if (q.n === 0) return dbl ? R.noZeros : R.none;
  if (q.n === 1) return M("x = " + q.z[0].s) + (dbl ? " (double)" : "");
  return M("x = " + q.z[0].s) + " and " + M("x = " + q.z[1].s) + (q.z[0].ex ? "" : " (≈ " + num(q.z[0].v, 2) + " and " + num(q.z[1].v, 2) + ")");
}
function ivs(list){ return list.map(function(t){ return M(t); }).join(" ∪ "); }
function incDec(q){
  var d = F(q.d), L, Rr;
  if (q.n === 2) { L = ["(-∞, " + q.z[0].s + ")", "(" + q.z[0].s + ", " + d + ")"]; Rr = ["(" + d + ", " + q.z[1].s + ")", "(" + q.z[1].s + ", ∞)"]; }
  else { L = ["(-∞, " + d + ")"]; Rr = ["(" + d + ", ∞)"]; }
  return q.a > 0 ? { inc:L, dec:Rr } : { inc:Rr, dec:L };
}
function stayTxt(q, R){
  var parts = [], count = 0;
  [1, -1].forEach(function(t){
    var s = (t - q.c) / q.a; if (s < -1e-12) return;
    var on = " (on " + M("y = " + (t > 0 ? "1" : "-1")) + ")";
    if (near(s, 0)) { count++; parts.push(M("x = " + F(q.d)) + on); return; }
    var r = sqrtQ(s); count += 2;
    if (r.ex) parts.push(M("x = " + F(q.d - r.v)) + " and " + M("x = " + F(q.d + r.v)) + on);
    else parts.push(M("x = " + (near(q.d, 0) ? "" : F(q.d) + " ") + "± " + r.s) + " ≈ " + num(q.d - r.v, 2) + ", " + num(q.d + r.v, 2) + on);
  });
  return count ? count + (count === 1 ? " point: " : " points: ") + parts.join("; ") : R.noStay;
}
function readRows(q, R){
  var a = q.a, d = q.d, c = q.c, rows = [], vs = vtxSrc(a, d, c, true), ex = expSrc(a, d, c);
  rows.push([R.quad, M("f(x) = " + vs) + (vtxSrc(a, d, c, false) === ex ? "" : " " + M("= " + ex))]);
  rows.push([R.recip, M(recSrc(a, d, c, true))]);
  rows.push([R.kase, R.cases[2 - q.n]]);
  rows.push([R.zeros, zerosTxt(q, R, true)]);
  rows.push([R.va, zerosTxt(q, R, false)]);
  rows.push([R.ha, R.haVal]);
  rows.push([R.vtx, near(c, 0) ? tpl(R.vtxZero, { d:F(d), xa:M("x = " + F(d)) }) : pt(F(d), F(c)) + ", " + (a > 0 ? R.min : R.max) + " → " + pt(F(d), F(1 / c)) + ", " + (a > 0 ? R.lmax : R.lmin)]);
  var f0 = q.f(0);
  rows.push([R.yint, near(f0, 0) ? R.yintNone : pt("0", F(1 / f0))]);
  rows.push([R.xint, R.xintVal]);
  rows.push([R.dom, M(q.n ? "{x ∈ ℝ | x ≠ " + q.z.map(function(z){ return z.s; }).join(", ") + "}" : "{x ∈ ℝ}")]);
  rows.push([R.rng, M(rangeSrc(q))]);
  var sg;
  if (q.n === 2) { var mid = "(" + q.z[0].s + ", " + q.z[1].s + ")", out = ["(-∞, " + q.z[0].s + ")", "(" + q.z[1].s + ", ∞)"]; sg = a > 0 ? "positive on " + ivs(out) + "; negative on " + M(mid) : "positive on " + M(mid) + "; negative on " + ivs(out); }
  else if (q.n === 1) sg = (a > 0 ? "positive on " : "negative on ") + ivs(["(-∞, " + F(d) + ")", "(" + F(d) + ", ∞)"]);
  else sg = a > 0 ? R.posAll : R.negAll;
  rows.push([R.sign, sg]);
  var id = incDec(q);
  rows.push([R.incdec, "increasing on " + ivs(id.inc) + "; decreasing on " + ivs(id.dec) + (q.n === 2 ? ' <span class="muted">' + tpl(R.splitTwo, { xa:M("x = " + q.z[0].s), xb:M("x = " + q.z[1].s) }) + "</span>" : "")]);
  var nr = R.none;
  if (q.n) {
    var sa = a > 0 ? "+" : "-", sb = a > 0 ? "-" : "+", side = function(z, s, v){ return "as " + M("x → " + (z.ex ? z.s : "(" + z.s + ")") + "^{" + s + "}") + ", " + M("y → " + v + "∞"); };
    nr = q.n === 1 ? side(q.z[0], "-", sa) + "; " + side(q.z[0], "+", sa) : [side(q.z[0], "-", sa), side(q.z[0], "+", sb), side(q.z[1], "-", sb), side(q.z[1], "+", sa)].join("; ");
  }
  rows.push([R.near, nr]);
  rows.push([R.ends, "as " + M("x → ±∞") + ", " + M("y → 0^{" + (a > 0 ? "+" : "-") + "}")]);
  rows.push([R.stay, stayTxt(q, R)]);
  return rows;
}
// G15 description of the graph
function describeQ(q, hideRec){
  var f = MV.plain(M(vtxSrc(q.a, q.d, q.c, false)));
  var s = "Graph of y = 1 over (" + f + "), with the parabola dashed. ";
  if (hideRec) return "Parabola f(x) = " + f + ", dashed. Its reciprocal is hidden for now.";
  var up = q.a > 0 ? "above" : "below", dn = q.a > 0 ? "below" : "above", tp = q.n === 1 ? "" : " with a local " + (q.a > 0 ? "maximum" : "minimum") + " at (" + F(q.d) + ", " + F(1 / q.c) + ")";
  if (q.n === 2) s += "Vertical asymptotes x = " + q.z[0].p + " and x = " + q.z[1].p + "; horizontal asymptote y = 0. Three pieces: " + up + " the axis left of " + q.z[0].p + ", " + dn + " the axis between " + q.z[0].p + " and " + q.z[1].p + tp + ", " + up + " the axis right of " + q.z[1].p + ".";
  else if (q.n === 1) s += "Vertical asymptote x = " + q.z[0].p + "; horizontal asymptote y = 0. Two pieces, both " + up + " the axis, " + (q.a > 0 ? "rising" : "falling") + " toward the asymptote.";
  else s += "No vertical asymptotes; horizontal asymptote y = 0. One piece, " + up + " the axis" + tp + ".";
  return s;
}

// ---------- hero (storyboard in the plan; reduced motion: final frame) ----------
function hero(f){
  var H = MV.C.hero.fig, V = { xmin:-2, xmax:6, ymin:-5, ymax:6 }, p = new MV.Plot(f.canvas, V), XS = [-1, 0, 1, 2, 3, 4, 5];
  var st = { para:0, dots:0, fly:0, drop:0, rec:0, c:-4, slide:false };
  function cap(i){ f.cap.textContent = H.caps[i]; }
  p.render = function(){
    var q = Q(1, 2, st.c), q0 = Q(1, 2, -4);
    p.draw({ view:V, xTicks:{ step:1 }, yTicks:{ step:1 }, describe:st.slide ? "The parabola slides up and its reciprocal changes shape." : MV.C.hero.fig.aria,
      after:function(ctx, pl){
        var ink = css("--ink"), pen = css("--pen"), ink2 = css("--ink-2");
        if (!st.slide) {
          if (st.drop > 0) [0, 4].forEach(function(x){ dropAsym(ctx, pl, x, st.drop, "x = " + x); });
        } else q.z.forEach(function(z){ pl.asymptote({ x:z.v, label:"" }); });
        if (st.para > 0) drawPara(pl, st.slide ? q : q0, V.xmin + (V.xmax - V.xmin) * st.para);
        if (!st.slide) XS.slice(0, st.dots).forEach(function(x){
          var h = q0.f(x);
          if (h !== 0 && st.fly > 0) { var y = h + (1 / h - h) * st.fly; pl.segment({ x1:x, y1:h, x2:x, y2:y, color:ink2, width:1.4, dash:[2, 4], alpha:0.8 }); }
          if (h !== 0) { pl.point({ x:x, y:h, r:4, color:ink }); if (st.fly > 0) pl.point({ x:x, y:h + (1 / h - h) * st.fly, r:5, color:st.fly >= 1 ? pen : ink }); }
          else if (st.fly <= 0) pl.point({ x:x, y:0, r:4.5, color:ink });
        });
        if (st.rec > 0) drawRecip(pl, st.slide ? q : q0, { upto:st.rec >= 1 ? null : V.xmin + (V.xmax - V.xmin) * st.rec });
        if (st.rec >= 1) bgLabel(ctx, pl, "y = 0", pl.W - 8, pl.Y(0) - 12, "right", ink2, "italic 13px " + pl.fontM);
      } });
  };
  function T(dur, step, done){ MV.tween({ dur:dur, ease:function(t){ return t; }, step:step, done:done }); }
  function finalFrame(){ st = { para:1, dots:7, fly:1, drop:1, rec:1, c:-4, slide:false }; cap(0); p.render(); }
  if (MV.reduceMotion) {
    finalFrame();
    f.cap.innerHTML = '<ul class="hero-caps">' + H.caps.map(function(c){ return "<li>" + c + "</li>"; }).join("") + "</ul>";
    return;
  }
  p.render(); cap(0);
  MV.wait(300, function(){
    T(1200, function(t){ st.para = t; p.render(); }, function(){
      var k = 0;
      (function dot(){ if (k >= 7) { MV.wait(300, fly); return; } st.dots = ++k; p.render(); MV.wait(250, dot); })();
    });
  });
  function fly(){
    T(900, function(t){ st.fly = t; p.render(); }, function(){
      T(600, function(t){ st.drop = t; p.render(); }, function(){
        MV.wait(300, function(){ T(1500, function(t){ st.rec = t; p.render(); }, function(){ MV.wait(1200, slide); }); });
      });
    });
  }
  function slide(){
    st.slide = true; p.render();
    T(1250, function(t){ st.c = -4 + 4 * t; if (t >= 1) st.c = 0; p.render(); }, function(){ st.c = 0; cap(1); p.render();
      MV.wait(900, function(){ T(1250, function(t){ st.c = 2 * t; p.render(); }, function(){ st.c = 2; cap(2); p.render();
        MV.wait(1400, function(){ T(1500, function(t){ st.c = 2 - 6 * t; cap(st.c > 1e-9 ? 2 : st.c < -1e-9 ? 0 : 1); p.render(); }, function(){ finalFrame(); }); });
      }); });
    });
  }
}

// ---------- Explore: Reciprocal plotter ----------
var SV = { xmin:-6, xmax:6, ymin:-5, ymax:5 };
var EDEF = { mode:"plot", preset:"two", a:1, d:2, c:-4, para:true, flightP:true, flightS:false, ones:false, band:false, table:false };
function explore(host, api){
  var S = api.S, C = api.content, R = C.read, PL = C.plot, G = C.graph, TB = C.table, PRE = C.presets;
  Object.keys(EDEF).forEach(function(k){ if (S[k] == null) S[k] = EDEF[k]; });
  S.pts = S.pts || {}; S.drawn = S.drawn || {};
  var X = { sel:null, fly:null, ghost:null, pulse:null, drop:null, curve:null, demo:null, hide:false, tbl:null, busy:false, msg:null, all:false, lastN:null, cv:null, flights:null, tpLab:null, around:null, prog:null, walk:null, snaps:false, entryX:null };
  host.innerHTML = '<div class="pg rq"><div class="pg-graph" data-mv="graph"><div id="rq-mode"></div>' +
    '<ol class="rq-strip" id="rq-strip" aria-label="The three cases">' + C.caseStrip.map(function(t, i){ return '<li data-cs="' + i + '"><span class="rq-ic" aria-hidden="true">' + caseIcon(i) + "</span><span>" + t + "</span></li>"; }).join("") + "</ol>" +
    '<p class="eq-cap rq-cap" id="rq-cap"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot" id="rq-c" role="img" aria-label="Reciprocal plotter"></canvas><div id="rq-dots"></div></div>' +
    '<div id="rq-snaps" class="rq-snaps" hidden></div><div id="rq-entry" class="rq-entry"></div><div id="rq-tbl"></div></div>' +
    '<div class="pg-ctrl"><div id="rq-plotctl"></div><div id="rq-slidectl"><div class="rq-sl" id="rq-sl"></div><p class="tiny muted rq-note">' + C.note + '</p><div class="q-actions" style="margin-top:4px"><button type="button" class="btn ghost sm" id="rq-reset">' + C.reset + "</button></div></div>" +
    '<div class="chips rq-tg" id="rq-tg" role="group" aria-label="Layers"></div></div>' +
    '<div class="pg-read"><dl class="read rq-read" id="rq-read"></dl><button type="button" class="btn ghost sm rq-all" id="rq-all" aria-expanded="false">' + R.more + '</button><p class="vh" id="rq-say" aria-live="polite"></p></div></div>';
  var p = new MV.Plot($("#rq-c", host), SV);
  function preset(id){ return PRE.filter(function(x){ return x.id === id; })[0]; }
  function mode(){ return X.demo ? X.demo.mode : S.mode; }
  function curPre(){ return preset(X.demo && X.demo.preset ? X.demo.preset : S.preset); }
  function cur(){
    if (mode() === "plot") { var pr = curPre(); return { q:Q(pr.a, pr.d, pr.c), v:pr.view, pr:pr }; }
    return { q:Q(S.a, S.d, X.cv != null ? X.cv : S.c), v:SV };
  }
  function ptState(pid, x){ var b = S.pts[pid] || (S.pts[pid] = {}); return b[x] || (b[x] = { done:false, tries:0, first:null }); }
  function plottedHere(pid, x){ if (X.demo && X.demo.preset === pid) return !!X.demo.done[x]; var b = S.pts[pid]; return !!(b && b[x] && b[x].done); }
  function curveOn(pid){ if (X.demo && X.demo.preset === pid) return X.demo.curve; return S.drawn[pid] ? 1 : X.curve; }

  // ----- graph -----
  p.render = function(){
    var cu = cur(), q = cu.q, v = cu.v, plotM = mode() === "plot", small = p.W < 480, live = X.cv != null;
    var regions = S.band ? [{ f:function(){ return 1; }, g:function(){ return -1; }, x0:v.xmin, x1:v.xmax }] : [];
    var asy = [], showRec = !X.hide;
    if (!plotM && showRec) q.z.forEach(function(z){ asy.push({ x:z.v, label:"x = " + (live ? num(z.v, 2) : z.p) }); });
    if (plotM) cu.pr.xs.forEach(function(x){ if (q.f(x) === 0 && plottedHere(cu.pr.id, x) && !(X.drop && X.drop.x === x)) asy.push({ x:x, label:"x = " + F(x) }); });
    if (plotM && X.demo && X.demo.asym != null && X.demo.asymT >= 1) asy.push({ x:X.demo.asym, label:"x = " + F(X.demo.asym) });
    p.draw({ view:v, xTicks:{ step:1, fmt:v.xmax - v.xmin > 9 && small ? evenFmt : null }, yTicks:{ step:1 }, regions:regions, asymptotes:asy,
      describe:plotM ? plotDescribe(cu) : describeQ(q, X.hide),
      after:function(ctx, pl){
        var ink = css("--ink"), pen = css("--pen"), ink2 = css("--ink-2"), fm = "italic 13px " + pl.fontM;
        if (S.band && !small) bgLabel(ctx, pl, G.small, 8, pl.Y(0.5), "left", ink2, "600 12px " + pl.fontUI);
        if (S.ones) {
          hLine(ctx, pl, 1); hLine(ctx, pl, -1);
          [1, -1].forEach(function(t){ var s = (t - q.c) / q.a; if (s < -1e-12) return; var r = Math.sqrt(Math.max(0, s)), xs = r < 1e-9 ? [q.d] : [q.d - r, q.d + r];
            xs.forEach(function(x){ if (x < v.xmin || x > v.xmax) return; diamond(ctx, pl, x, t); if (!small) bgLabel(ctx, pl, G.stay, pl.X(x) + 9, pl.Y(t) + (t > 0 ? -13 : 13), "left", ink, "600 12px " + pl.fontUI); }); });
        }
        if (plotM) drawPlotLayer(ctx, pl, cu);
        else drawSlideLayer(ctx, pl, q, small, live);
        if (S.para) drawPara(pl, q);
        if (plotM) drawPlotDots(ctx, pl, cu);
        var on = plotM ? curveOn(cu.pr.id) : (showRec ? 1 : 0);
        if (!plotM && showRec) drawRecip(pl, q, { around:X.around, prog:X.prog, dir:X.dir });
        if (plotM && on > 0) drawRecip(pl, q, { upto:on >= 1 ? null : v.xmin + (v.xmax - v.xmin) * on });
        X.rects = [];
        if (!plotM) drawVertex(ctx, pl, q, small, live);
        if (on >= 1 || (!plotM && showRec)) {
          var ht = small ? "y = 0" : G.ha, hw = textW(ctx, ht, fm) + 6, Y0 = pl.Y(0), s1 = q.a > 0 ? 1 : -1;
          var cand = [[pl.W - 8, Y0 + 14 * s1, "right"], [pl.W - 8, Y0 - 14 * s1, "right"], [8, Y0 + 14 * s1, "left"], [8, Y0 - 14 * s1, "left"]];
          var pick = cand.filter(function(c){ var r = { x:c[2] === "right" ? c[0] - hw : c[0], y:c[1] - 9, w:hw, h:18 }; return !X.rects.some(function(o){ return hit(o, r); }); })[0] || cand[0];
          bgLabel(ctx, pl, ht, pick[0], pick[1], pick[2], ink2, fm);
        }
        if (X.walk && X.walk.x != null) { pl.point({ x:X.walk.x, y:q.f(X.walk.x), r:7, ring:true, color:ink }); }
      } });
  };
  function drawSlideLayer(ctx, pl, q, small, live){
    var ink2 = css("--ink-2"), ink = css("--ink"), pen = css("--pen");
    var fl = X.flights || (S.flightS && !X.hide ? [0, -0.5, 0.5, -1, 1, -2, 2, -3, 3].map(function(k){ return q.d + k; }) : []);
    fl.forEach(function(e){
      var x = e.x != null ? e.x : e, t = e.t != null ? e.t : 1, h = q.f(x); if (Math.abs(h) < 1e-9 || t <= 0) return;
      var y = 1 / h; if (x < pl.v.xmin || x > pl.v.xmax || (t >= 1 && (y < pl.v.ymin || y > pl.v.ymax))) return;
      pl.segment({ x1:x, y1:h, x2:x, y2:h + (y - h) * t, color:ink2, width:1.4, dash:[2, 4] });
      pl.point({ x:x, y:h, r:3.5, color:ink }); if (t >= 1) pl.point({ x:x, y:y, r:4, color:pen });
    });
  }
  function drawVertex(ctx, pl, q, small, live){
    var ink = css("--ink"), pen = css("--pen"), ink2 = css("--ink-2"), d = q.d, c = q.c, f2 = live ? function(v){ return num(v, 2); } : F;
    ringAt(ctx, pl, d, c, 12, css("--hi"), 5);
    pl.point({ x:d, y:c, r:6, open:true, color:ink });
    var right = pl.X(d) < pl.W - 150;
    if (near(c, 0) && !live) { if (!small) X.rects.push(bgLabel(ctx, pl, tpl(G.onAxis, { d:F(d) }), pl.X(d) + (right ? 16 : -16), pl.Y(0) + 18, right ? "left" : "right", ink)); return; }
    if (!small || X.tpLab) X.rects.push(bgLabel(ctx, pl, "(" + f2(d) + ", " + f2(c) + ") " + (q.a > 0 ? G.min : G.max), pl.X(d) + (right ? 16 : -16), pl.Y(c) + (c > 0 ? -16 : 16), right ? "left" : "right", ink));
    if (X.hide || near(c, 0) || (X.prog && X.prog[1] < 1)) return;
    var ty = 1 / c;
    dashV(ctx, pl, d, c, ty);
    pl.point({ x:d, y:ty, r:5.5, color:pen });
    X.rects.push(bgLabel(ctx, pl, X.tpLab || ("(" + f2(d) + ", " + f2(ty) + ") " + (q.a > 0 ? G.lmax : G.lmin)), pl.X(d) + (right ? 12 : -12), pl.Y(ty) + (ty > 0 ? -14 : 14), right ? "left" : "right", pen));
  }
  // plot-by-hand layer: flight lines, landed points, ghosts, pulses, drops
  function drawPlotLayer(ctx, pl, cu){
    var pr = cu.pr, q = cu.q, ink2 = css("--ink-2"), flightsOn = S.flightP;
    if (X.sel != null && !X.demo) { var top = pl.v.ymax, bot = pl.v.ymin; ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.2; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(pl.X(X.sel), pl.Y(top)); ctx.lineTo(pl.X(X.sel), pl.Y(bot)); ctx.stroke(); ctx.restore(); }
    pr.xs.forEach(function(x){
      var h = q.f(x); if (h === 0 || !plottedHere(pr.id, x) || (X.fly && X.fly.x === x)) return;
      if (flightsOn) pl.segment({ x1:x, y1:h, x2:x, y2:1 / h, color:ink2, width:1.4, dash:[2, 4], alpha:0.8 });
    });
    if (X.drop) dropAsym(ctx, pl, X.drop.x, X.drop.t, "x = " + F(X.drop.x));
    if (X.demo && X.demo.asym != null && X.demo.asymT < 1) dropAsym(ctx, pl, X.demo.asym, X.demo.asymT, "x = " + F(X.demo.asym));
  }
  function drawPlotDots(ctx, pl, cu){
    var pr = cu.pr, q = cu.q, ink = css("--ink"), pen = css("--pen");
    pr.xs.forEach(function(x){
      var h = q.f(x);
      pl.point({ x:x, y:h, r:5, color:ink, ring:X.sel === x && !X.demo });
      if (h !== 0 && plottedHere(pr.id, x) && !(X.fly && X.fly.x === x)) pl.point({ x:x, y:1 / h, r:5.5, color:pen });
    });
    if (X.fly) { var h = q.f(X.fly.x), y = h + (1 / h - h) * X.fly.t; if (S.flightP) pl.segment({ x1:X.fly.x, y1:h, x2:X.fly.x, y2:y, color:css("--ink-2"), width:1.4, dash:[2, 4] }); pl.point({ x:X.fly.x, y:y, r:5.5, color:X.fly.t >= 1 ? pen : ink }); }
    if (X.pulse) X.pulse.xs.forEach(function(x){ ringAt(ctx, pl, x, q.f(x), 9 + 10 * X.pulse.t, css("--hi"), 4 * (1 - X.pulse.t) + 1); });
    if (X.pulseLab) X.pulseLab.forEach(function(x){ bgLabel(ctx, pl, MV.C.explore.graph.stay, pl.X(x) + 10, pl.Y(q.f(x)) - 14, "left", ink, "600 12px " + pl.fontUI); });
    if (X.ghost) { var gy = X.ghost.y; if (gy >= pl.v.ymin && gy <= pl.v.ymax) cross(ctx, pl, X.ghost.x, gy); }
  }
  function plotDescribe(cu){
    var pr = cu.pr, q = cu.q, n = pr.xs.filter(function(x){ return plottedHere(pr.id, x); }).length;
    var s = "Plot by hand, preset " + pr.name + ": the parabola f(x) = " + MV.plain(M(vtxSrc(q.a, q.d, q.c, false))) + ", dashed, with dots at x = " + pr.xs.map(F).join(", ") + ". " + n + " of " + pr.xs.length + " reciprocal points plotted.";
    if (curveOn(pr.id) >= 1) s += " " + describeQ(q, false);
    return s;
  }
  // dot buttons over the canvas (N8 tap a point; 32 px targets; ← / → move between dots)
  p.onDrawn(function(pl){
    var box = $("#rq-dots", host), cu = cur();
    if (mode() !== "plot" || X.demo) { box.innerHTML = ""; return; }
    var pr = cu.pr, q = cu.q, have = $$("button", box).map(function(b){ return b.dataset.x; }).join(","), want = pr.xs.map(String).join(",");
    if (have !== want) box.innerHTML = pr.xs.map(function(x){ return '<button type="button" class="rq-dot" data-x="' + x + '" data-k="rqd' + x + '"></button>'; }).join("");
    $$("button", box).forEach(function(b){
      var x = +b.dataset.x, h = q.f(x), done = plottedHere(pr.id, x);
      b.style.left = (pl.c.offsetLeft + pl.X(x)) + "px"; b.style.top = (pl.c.offsetTop + pl.Y(h)) + "px";
      b.setAttribute("aria-label", "Dot at x = " + F(x) + ": f(" + F(x) + ") = " + F(h) + (done ? ", plotted" : ", not plotted yet"));
      b.setAttribute("aria-pressed", String(X.sel === x));
    });
  });
  $("#rq-dots", host).addEventListener("click", function(e){ var b = e.target.closest(".rq-dot"); if (!b) return; touch(); X.sel = +b.dataset.x; X.msg = null; p.render(); paintEntry(); var n = $("#rq-n", host); if (n && !n.disabled) n.focus(); });
  $("#rq-dots", host).addEventListener("keydown", function(e){
    var b = e.target.closest(".rq-dot"); if (!b || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    e.preventDefault(); var bs = $$(".rq-dot", host), i = bs.indexOf(b) + (e.key === "ArrowRight" ? 1 : -1); if (bs[i]) bs[i].focus();
  });

  // ----- plot-by-hand entry panel (N4 fraction box) -----
  function paintEntry(){
    var el = $("#rq-entry", host);
    if (mode() !== "plot" || X.demo) { el.innerHTML = ""; return; }
    var pr = curPre(), q = Q(pr.a, pr.d, pr.c);
    if (X.sel == null) { el.innerHTML = '<p class="tiny muted">' + PL.pick + "</p>"; return; }
    var x = X.sel, h = q.f(x), fx = M("f(" + F(x) + ")"), st = ptState(pr.id, x), done = st.done;
    var h1 = '<p class="rq-q">' + tpl(PL.prompt, { fx:fx, v:F(h) }) + "</p>";
    h1 += '<div class="rq-row"><span class="m rq-lhs">1/<i>f</i>(' + F(x) + ') =</span><span class="frbox"><input id="rq-n" type="number" step="1" autocomplete="off" aria-label="' + PL.num + '"' + (done ? " disabled" : "") + '><span class="frbar" aria-hidden="true"></span><input id="rq-d" type="number" step="1" min="1" autocomplete="off" aria-label="' + MV.esc(PL.den) + '"' + (done ? " disabled" : "") + "></span>" +
      '<button type="button" class="btn primary sm" id="rq-plot" data-k="rqplot"' + (done ? " disabled" : "") + ">" + PL.plotIt + '</button><button type="button" class="btn ghost sm" id="rq-none" data-k="rqnone"' + (done ? " disabled" : "") + ">" + PL.noValue + "</button></div>";
    var msg = X.msg && X.msg.x === x ? X.msg : (done ? { kind:"good", html:rightMsg(x, h) } : null);
    h1 += '<div id="rq-fb">' + (msg ? '<div class="fb ' + msg.kind + '" role="status"><p>' + msg.html + "</p></div>" : "") + "</div>";
    el.innerHTML = h1;
  }
  function rightMsg(x, h){
    var fx = M("f(" + F(x) + ")");
    if (h === 0) return "<strong>✓ Correct.</strong> " + tpl(PL.rightZero, { fx:fx, xa:M("x = " + F(x)) });
    if (Math.abs(h) === 1) return "<strong>✓ Correct.</strong> " + tpl(PL.stay, { fx:fx, v:F(h), vp:par(F(h)) });
    return "<strong>✓ Correct.</strong> " + tpl(PL.right, { fx:fx, v:F(h), r:F(1 / h) });
  }
  function badMsg(t){ return /^Not quite/.test(MV.plain(t)) ? "<strong>✗</strong> " + t : "<strong>✗ Not quite.</strong> " + t; }
  function judge(noValue){
    var pr = curPre(), q = Q(pr.a, pr.d, pr.c), x = X.sel, h = q.f(x), st = ptState(pr.id, x), fx = M("f(" + F(x) + ")"), FB = PL.fb, e = null;
    if (st.done) return;
    if (!noValue) {
      var nr = $("#rq-n", host).value.trim(), dr = $("#rq-d", host).value.trim();
      var n = nr === "" ? NaN : +nr, d = dr === "" ? 1 : +dr;
      if (!isInt(n) || !isInt(d) || d < 1) { X.msg = { x:x, kind:"bad", html:FB.empty }; paintEntry(); MV.focusFb($("#rq-entry", host)); return; }
      e = n / d;
    }
    var ok = noValue ? h === 0 : (h !== 0 && near(e, 1 / h)), msg;
    if (ok) {
      st.done = true; st.first = st.tries === 0; X.msg = { x:x, kind:"good", html:rightMsg(x, h) }; api.save();
      if (h === 0) { X.drop = { x:x, t:0 }; MV.tween({ dur:600, step:function(t){ X.drop.t = t; p.render(); }, done:function(){ X.drop = null; p.render(); } }); }
      else if (Math.abs(h) === 1) { X.pulse = { xs:[x], t:0 }; MV.tween({ dur:700, step:function(t){ X.pulse.t = t; p.render(); }, done:function(){ X.pulse = null; p.render(); } }); }
      else { X.fly = { x:x, t:0 }; MV.tween({ dur:600, step:function(t){ X.fly.t = t; p.render(); }, done:function(){ X.fly = null; p.render(); } }); }
      paintEntry(); paintPlotCtl(); MV.focusFb($("#rq-entry", host)); p.render();
      return;
    }
    st.tries++; api.save();
    if (noValue) msg = tpl(FB.noValue, { fx:fx, v:F(h) });
    else if (h === 0) msg = e === 0 ? FB.zero0 : tpl(FB.zeroNum, { fx:fx });
    else if (near(e, h) && Math.abs(h) !== 1) msg = tpl(FB.self, { fx:fx });
    else if (near(e, -1 / h)) msg = tpl(FB.sign, { fx:fx, v:F(h), pn:h > 0 ? "positive" : "negative" });
    else if (near(e, -h)) msg = FB.neg;
    else if (x !== 0 && near(e, 1 / x) && !near(1 / x, 1 / h)) msg = tpl(FB.recipX, { fx:fx, xx:M("x = " + F(x)) });
    else msg = tpl(FB.other, { fx:fx, v:F(h) });
    X.msg = { x:x, kind:"bad", html:badMsg(msg) };
    if (!noValue) { X.ghost = { x:x, y:e }; var g = X.ghost; p.render(); MV.wait(1500, function(){ if (X.ghost === g) { X.ghost = null; p.render(); } var n1 = $("#rq-n", host), d1 = $("#rq-d", host); if (n1 && !n1.disabled) { n1.value = ""; d1.value = ""; } }); }
    paintEntry(); MV.focusFb($("#rq-entry", host));
  }
  $("#rq-entry", host).addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b || b.disabled) return; if (b.id === "rq-plot") judge(false); else if (b.id === "rq-none") judge(true); });
  $("#rq-entry", host).addEventListener("keydown", function(e){
    if (e.target.tagName !== "INPUT") return;
    if (e.key === "Enter") { e.preventDefault(); judge(false); }
    else if (e.key === "Escape") { var b = host.querySelector('.rq-dot[data-x="' + X.sel + '"]'); if (b) b.focus(); }
  });
  function counts(){ var n = 0, f = 0; PRE.forEach(function(pr){ var b = S.pts[pr.id] || {}; pr.xs.forEach(function(x){ var s = b[x]; if (s && s.done) { n++; if (s.first) f++; } }); }); return { n:n, f:f }; }
  function paintPlotCtl(){
    var el = $("#rq-plotctl", host), pr = curPre(), b = S.pts[pr.id] || {}, n = 0, f = 0;
    pr.xs.forEach(function(x){ var s = b[x]; if (s && s.done) { n++; if (s.first) f++; } });
    var left = pr.xs.length - n, drawn = !!S.drawn[pr.id];
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="chips rq-pre" role="group" aria-label="Presets">' + PRE.map(function(x){ var on = x.id === pr.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-pre="' + x.id + '" data-k="rqp' + x.id + '">' + x.name + "</button>"; }).join("") + "</div>" +
        '<p class="tiny rq-prog" aria-live="polite">' + tpl(PL.progress, { n:n, N:pr.xs.length, f:f }) + "</p>" +
        '<div class="q-actions" style="margin-top:4px"><button type="button" class="btn primary sm" id="rq-draw" data-k="rqdraw"' + (left || drawn ? " disabled" : "") + ">" + PL.draw + "</button>" +
        (drawn && PRE.some(function(x){ return !S.drawn[x.id]; }) ? '<button type="button" class="btn ghost sm" id="rq-another" data-k="rqanother">' + PL.another + "</button>" : "") + "</div>" +
        (left ? '<p class="tiny muted">' + tpl(PL.toGo, { n:left }) + "</p>" : "");
    });
  }
  $("#rq-plotctl", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pre) { touch(); S.preset = b.dataset.pre; X.sel = null; X.msg = null; api.save(); paint(); return; }
    if (b.id === "rq-another") { var nx = PRE.filter(function(x){ return !S.drawn[x.id]; })[0]; if (nx) { touch(); S.preset = nx.id; X.sel = null; api.save(); paint(); } return; }
    if (b.id === "rq-draw") {
      var pr = curPre(); touch(); X.curve = 0; MV.banner("", "");
      MV.tween({ dur:1500, ease:function(t){ return t; }, step:function(t){ X.curve = t; p.render(); }, done:function(){
        X.curve = null; S.drawn[pr.id] = true; api.save(); paint();
        var q = Q(pr.a, pr.d, pr.c);
        MV.banner("good", MV.plain(q.n ? tpl(PL.banner, { n:pr.xs.length, xs:q.z.map(function(z){ return "x = " + z.p; }).join(" and ") }) : tpl(PL.bannerNone, { n:pr.xs.length })));
      } });
    }
  });

  // ----- close-up table (N14) -----
  function f6(v){ return num(v, 6); }
  function rcp(v){ var r = 1 / v; return Math.abs(Math.round(r * 100) / 100 - r) < 1e-9 * Math.max(1, Math.abs(r)) ? num(r, 2) : "≈ " + num(r, 2); }
  function paintTable(){
    var el = $("#rq-tbl", host);
    if (!S.table && !X.tbl) { el.innerHTML = ""; return; }
    var cu = cur(), q = cu.q, rows = [], capt = "", head = TB.head;
    if (X.tbl) {
      capt = tpl(TB.cap, { xa:M("x = " + F(X.tbl.zero)) });
      rows = X.tbl.xs.map(function(x, i){ return X.tbl.shown[i] ? [num(x, 4), f6(q.f(x)), rcp(q.f(x))] : [num(x, 4), "", ""]; });
    } else if (mode() === "plot") {
      var pr = cu.pr;
      if (pr.zero == null) { el.innerHTML = '<div class="refresh rq-tnote"><p>' + tpl(TB.none, { c:F(q.c), rc:F(1 / q.c) }) + "</p></div>"; return; }
      capt = tpl(TB.cap, { xa:M("x = " + F(pr.zero)) });
      rows = pr.tableXs.map(function(x){ return [num(x, 4), f6(q.f(x)), rcp(q.f(x))]; });
    } else {
      if (!q.n) { el.innerHTML = '<div class="refresh rq-tnote"><p>' + tpl(q.a < 0 && q.c < 0 ? TB.noneBelow : TB.none, { c:F(q.c), rc:F(1 / q.c) }) + "</p></div>"; return; }
      var z = q.z[q.z.length - 1];
      capt = tpl(TB.cap, { xa:M("x = " + z.s) });
      rows = [-0.1, -0.01, 0.01, 0.1].map(function(o, i){ var x = z.v + o, fv = q.f(x);
        return z.ex ? [num(x, 4), f6(fv), rcp(fv)] : [TB.offs[i], "≈ " + num(fv, 4), "≈ " + num(1 / fv, 2)]; });
    }
    el.innerHTML = '<p class="tiny rq-tcap" aria-hidden="true">' + capt + "</p>" + MV.tableHTML({ head:head, rows:rows, caption:MV.plain(capt) });
  }

  // ----- case strip, caption, readout -----
  function paintStrip(announce){
    var q = cur().q, k = 2 - q.n;
    $$("#rq-strip li", host).forEach(function(li, i){ li.classList.toggle("on", i === k); li.setAttribute("aria-current", i === k ? "true" : "false"); });
    if (X.lastN != null && X.lastN !== q.n) {
      var li = host.querySelector('#rq-strip li[data-cs="' + k + '"]'); if (li && !MV.reduceMotion) { li.classList.remove("pulse"); void li.offsetWidth; li.classList.add("pulse"); }
      if (announce !== false) say(tpl(C.caseSay[["none", "one", "two"][q.n]], { xs:MV.plain(q.z.map(function(z){ return "x = " + z.p; }).join(" and ")) }));
    }
    X.lastN = q.n;
  }
  function paintCap(){
    var q = cur().q;
    $("#rq-cap", host).innerHTML = M("f(x) = " + vtxSrc(q.a, q.d, q.c, true)) + ' <span class="w">and</span> ' + M(recSrc(q.a, q.d, q.c, true));
  }
  function paintRead(){
    var q = cur().q, rows = readRows(q, R);
    $("#rq-read", host).innerHTML = rows.map(function(r, i){ return '<div class="' + (i >= 6 ? "rq-x" : "") + '"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    $("#rq-read", host).classList.toggle("all", X.all);
  }
  var sayT = null;
  function say(t){ var el = $("#rq-say", host); el.textContent = ""; setTimeout(function(){ el.textContent = t; }, 30); }
  function sayLater(){
    clearTimeout(sayT);
    sayT = setTimeout(function(){ var q = cur().q, rows = readRows(q, R); say([2, 4, 6, 10].map(function(i){ return MV.plain(rows[i][0]) + ": " + MV.plain(rows[i][1]); }).join(". ")); }, 400);
  }
  function paintToggles(){
    MV.keepFocus($("#rq-tg", host), function(){
      $("#rq-tg", host).innerHTML = C.toggles.map(function(t){ var k = t[0] === "flight" ? (mode() === "plot" ? "flightP" : "flightS") : t[0], on = !!S[k]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-tg="' + k + '" data-k="rqtg' + t[0] + '">' + t[1] + "</button>"; }).join("");
    });
  }
  function paint(){
    var plotM = mode() === "plot";
    if (seg.get() !== mode()) seg.set(mode());
    $("#rq-plotctl", host).hidden = !plotM; $("#rq-slidectl", host).hidden = plotM;
    sl.set("a", S.a); sl.set("d", S.d); sl.set("c", S.c);
    if (plotM) paintPlotCtl();
    paintToggles(); paintCap(); paintStrip(); paintRead(); paintEntry(); paintTable(); p.render();
  }
  // a user action ends any prediction demo
  function touch(){ if (X.busy) return; X.demo = null; X.hide = false; X.tbl = null; X.flights = null; X.tpLab = null; X.around = null; X.prog = null; X.dir = null; X.walk = null; X.pulseLab = null; X.cv = null; if (X.snaps) { $("#rq-snaps", host).hidden = true; X.snaps = false; } }
  function setSlide(o){ touch(); Object.keys(o).forEach(function(k){ S[k] = o[k]; }); api.save(); paint(); MV.changed(); sayLater(); }

  var seg = MV.seg($("#rq-mode", host), { label:"", value:S.mode, options:C.modes, onChange:function(v){ touch(); S.mode = v; X.sel = null; api.save(); paint(); MV.changed(); } });
  var SL = C.sliders;
  var sl = MV.sliders($("#rq-sl", host), [
    { id:"a", label:SL.a, param:"a", min:-2, max:2, step:0.25, value:S.a, skip:[0], fmt:F, note:SL.skip },
    { id:"d", label:SL.d, param:"d", min:-3, max:3, step:0.5, value:S.d, fmt:F },
    { id:"c", label:SL.c, param:"c", min:-4, max:4, step:0.25, value:S.c, fmt:F }
  ], function(id, v){ var o = {}; o[id] = v; setSlide(o); });
  $("#rq-tg", host).addEventListener("click", function(e){ var b = e.target.closest("[data-tg]"); if (!b) return; touch(); S[b.dataset.tg] = !S[b.dataset.tg]; api.save(); paint(); });
  $("#rq-reset", host).addEventListener("click", function(){ setSlide({ a:1, d:2, c:-4 }); });
  $("#rq-all", host).addEventListener("click", function(){ X.all = !X.all; this.textContent = X.all ? R.fewer : R.more; this.setAttribute("aria-expanded", String(X.all)); paintRead(); });
  // G7 vertex handle: arrows move d by 0.5 or c by 0.25; Shift + arrow moves by 1
  MV.drag(p, { axis:"xy",
    handles:function(){ return mode() === "slide" && !X.busy ? [{ id:"V", x:S.d, y:S.c, label:tpl(MV.plain(SL.handle), { d:F(S.d), c:F(S.c) }) }] : []; },
    move:function(id, x, y){ var d = clamp(Math.round(x * 2) / 2, -3, 3), c = clamp(Math.round(y * 4) / 4, -4, 4); if (d !== S.d || c !== S.c) setSlide({ d:d, c:c }); },
    key:function(id, e){
      var k = e.key, big = e.shiftKey;
      if (k === "ArrowLeft" || k === "ArrowRight") { setSlide({ d:clamp(S.d + (k === "ArrowRight" ? 1 : -1) * (big ? 1 : 0.5), -3, 3) }); return true; }
      if (k === "ArrowUp" || k === "ArrowDown") { setSlide({ c:clamp(S.c + (k === "ArrowUp" ? 1 : -1) * (big ? 1 : 0.25), -4, 4) }); return true; }
      return false;
    } });
  p.c.style.touchAction = "pan-y";
  paint();

  // ----- predictions (K9, K10) -----
  function startPred(pr){
    var s = pr.start; X.busy = false; touch(); X.busy = true; MV.banner("", "");
    if (s.mode === "plot") {
      X.demo = { mode:"plot", preset:s.preset, done:{}, asym:null, asymT:0, curve:0 };
      s.plotted.forEach(function(x){ X.demo.done[x] = true; });
    } else { S.mode = "slide"; S.a = s.a; S.d = s.d; S.c = s.c; X.hide = !!s.hide; }
    X.sel = null; paint();
  }
  function lin(t){ return t; }
  function runPred(pr, done){
    var fin = function(){ X.busy = false; api.save(); paint(); MV.changed(); done(); };
    if (pr.id === "p1") {
      var D = X.demo;
      X.pulse = { xs:[0, 2], t:0 }; X.pulseLab = [0, 2]; D.done[0] = D.done[2] = true;
      MV.tween({ dur:900, step:function(t){ X.pulse.t = t; p.render(); }, done:function(){ X.pulse = null; p.render();
        D.asym = 1; MV.tween({ dur:600, step:function(t){ D.asymT = t; p.render(); }, done:function(){ D.asymT = 1; p.render();
          X.tbl = { zero:1, xs:[0.9, 0.99, 1.01, 1.1], shown:{} }; paintTable();
          var order = [3, 2, 0, 1], k = 0;
          (function row(){
            if (k >= order.length) { MV.wait(400, function(){ MV.tween({ dur:1500, ease:lin, step:function(t){ D.curve = t; p.render(); }, done:function(){ D.curve = 1; fin(); } }); }); return; }
            X.tbl.shown[order[k++]] = true; paintTable(); MV.wait(450, row);
          })();
        } });
      } });
    } else if (pr.id === "p2") {
      X.flights = [{ x:1, t:0 }];
      MV.tween({ dur:700, step:function(t){ X.flights[0].t = t; p.render(); }, done:function(){
        MV.wait(300, function(){
          var more = [0, 2, -1, 3].map(function(x){ return { x:x, t:0 }; }); X.flights = X.flights.concat(more);
          MV.tween({ dur:800, step:function(t){ more.forEach(function(m){ m.t = t; }); p.render(); }, done:function(){
            X.hide = false; X.around = [1, 0];
            MV.tween({ dur:1400, ease:lin, step:function(t){ X.around = [1, 7 * t]; p.render(); }, done:function(){ X.around = null; X.tpLab = MV.plain(pr.label); fin(); } });
          } });
        });
      } });
    } else if (pr.id === "p3") {
      if (MV.reduceMotion) { showSnaps(pr); S.c = -2; fin(); return; }
      var stops = [1, 0, -1, -2], i = 0, from = 2;
      (function seg2(){
        if (i >= stops.length) { X.cv = null; S.c = -2; fin(); return; }
        var to = stops[i++], f0 = from; from = to;
        MV.tween({ dur:1000, ease:lin, step:function(t){ X.cv = f0 + (to - f0) * t; paintStrip(false); p.render(); }, done:function(){
          X.cv = null; S.c = to; paintCap(); paintStrip(); paintRead(); p.render();
          MV.wait(i < stops.length ? 800 : 200, seg2);
        } });
      })();
    } else if (pr.id === "p4") {
      var xs = pr.walk, j = 0;
      X.tbl = { zero:2, xs:xs, shown:{} }; X.walk = { x:null }; paintTable();
      (function step(){
        if (j >= xs.length) {
          X.walk = { x:null }; X.hide = false; X.prog = [0, 0, 0]; X.dir = [1, 1, -1];
          MV.tween({ dur:1100, ease:lin, step:function(t){ X.prog[2] = t; p.render(); }, done:function(){
            MV.tween({ dur:1000, ease:lin, step:function(t){ X.prog[1] = t; p.render(); }, done:function(){
              X.tpLab = "(0, 1/4) " + MV.C.explore.graph.lmin;
              MV.tween({ dur:600, ease:lin, step:function(t){ X.prog[0] = t; p.render(); }, done:function(){ X.prog = null; X.walk = null; fin(); } });
            } });
          } });
          return;
        }
        X.walk.x = xs[j]; X.tbl.shown[j] = true; j++; paintTable(); p.render(); MV.wait(650, step);
      })();
    } else fin();
  }
  function showSnaps(pr){
    var el = $("#rq-snaps", host); X.snaps = true; el.hidden = false;
    el.innerHTML = [1, 0, -1].map(function(c, i){ return '<figure><canvas class="plot" role="img" aria-label="' + MV.esc(MV.plain(pr.snaps[i])) + '"></canvas><figcaption>' + pr.snaps[i] + "</figcaption></figure>"; }).join("");
    $$("canvas", el).forEach(function(cv, i){
      var c = [1, 0, -1][i], q = Q(1, 0, c), pl = new MV.Plot(cv, { xmin:-3, xmax:3, ymin:-3, ymax:3 });
      pl.render = function(){ pl.draw({ view:{ xmin:-3, xmax:3, ymin:-3, ymax:3 }, ticks:false, asymptotes:q.z.map(function(z){ return { x:z.v, label:"" }; }), describe:MV.plain(pr.snaps[i]), after:function(ctx, P){ drawPara(P, q); drawRecip(P, q, { width:2.4, head:9 }); } }); };
      pl.render();
    });
  }

  // ----- target challenges: the plan's exact tests and named wrong states -----
  function chal(id){ return (C.challenges || []).filter(function(c){ return c.id === id; })[0] || {}; }
  function rTxt(q){ return q.z.map(function(z){ return M("x = " + z.s); }); }
  function test(id){
    var a = S.a, d = S.d, c = S.c, q = Q(a, d, c), N = chal(id).named || {};
    if (id === "tc1") {
      if (d === 0 && near(c, -a)) return { ok:true };
      if (c === 0) return { ok:false, msg:N.c0 };
      if (a * c > 0) return { ok:false, msg:N.none };
      if (d !== 0) { var r = rTxt(q); return { ok:false, msg:tpl(N.offCentre, { r1:r[0], r2:r[1], xd:M("x = " + F(d)) }) }; }
      if (q.n === 2) return { ok:false, msg:N.gap };
      return { ok:false, msg:N.other };
    }
    if (id === "tc2") {
      if (d === -2 && c === 3 && a < 0) return { ok:true };
      if (d === -2 && c === 3) return { ok:false, msg:N.aPos };
      if (d === -2 && c > 0 && c < 1) return { ok:false, msg:tpl(N.small, { v:F(1 / c) }) };
      if (d === -2 && c === -3) return { ok:false, msg:N.cNeg };
      if (d === 2) return { ok:false, msg:N.d2 };
      return { ok:false, msg:N.other };
    }
    if (id === "tc3") {
      if (a === -0.5 && d === 2 && c === 2) return { ok:true };
      if (a === 1 && d === 2 && c === -4) return { ok:false, msg:N.start };
      if (d === 2 && near(c, -4 * a) && a > 0) return { ok:false, msg:tpl(N.maxBelow, { v:F(1 / c) }) };
      if (d === 2 && near(c, -4 * a) && a < 0 && c !== 2) return { ok:false, msg:tpl(N.minHeight, { v:F(1 / c) }) };
      if (d === 2 && c === 2 && a < 0) {
        var rs = q.z[0].ex ? M(q.z[0].s) + " and " + M(q.z[1].s) : M("2 ± " + q.R.s) + " (≈ " + num(q.z[0].v, 2) + " and " + num(q.z[1].v, 2) + ")";
        return { ok:false, msg:tpl(N.wrongA, { rs:rs, v:F(4 * a + 2) }) };
      }
      if (d === 2 && c === 2) return { ok:false, msg:N.aPos };
      if (d === 2 && c === 0.5) return { ok:false, msg:N.cHalf };
      return { ok:false, msg:N.other };
    }
    return { ok:false };
  }
  // each challenge starts from the start graph: reset after one is met (if another is still open)
  function afterMet(id){
    var open = (C.challenges || []).some(function(c){ return c.id !== id && !(MV.S.chal[c.id] && MV.S.chal[c.id].solved); });
    if (open) MV.wait(1400, function(){ S.mode = "slide"; setSlide({ a:1, d:2, c:-4 }); });
  }
  // results: plot by hand (registered like an activity so the summary shows it)
  MV.ACTS.plotByHand = {
    stats:function(){ var k = counts(); return { first:k.f, total:24, done:k.n, line:"Plot by hand: " + k.n + " of 24 points plotted, " + k.f + " right first time" }; },
    missed:function(){ var bad = false; PRE.forEach(function(pr){ var b = S.pts[pr.id] || {}; pr.xs.forEach(function(x){ if (b[x] && b[x].tries) bad = true; }); }); return bad ? [0] : []; }
  };
  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id, opt){
      if (S.mode !== "slide" && !(opt && opt.live)) { touch(); S.mode = "slide"; api.save(); paint(); }
      var r = test(id);
      if (r.ok && !(opt && opt.live)) afterMet(id);
      return r;
    }
  };
}
// tiny icons for the case strip
function caseIcon(i){
  var P = [
    "M2 4 C6 4 7 6 7.5 13 M10.5 13 C11 9 12 8 13 8 C14 8 15 9 15.5 13 M18.5 13 C19 6 20 4 24 4",
    "M2 9 C7 9 10 6 11.5 1 M14.5 1 C16 6 19 9 24 9",
    "M2 12 C7 12 9 5 13 5 C17 5 19 12 24 12"
  ][i];
  var A = [[9, 17], [13], []][i];
  return '<svg width="26" height="16" viewBox="0 0 26 16"><path d="M1 14H25" stroke="currentColor" stroke-width="1" opacity=".5"/>' + A.map(function(x){ return '<path d="M' + x + ' 1V15" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>'; }).join("") + '<path d="' + P + '" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
}

// ---------- Part 3: Three cases, one routine ----------
// @component sketchBuilder — step panel beside a graph: each correct step adds one layer (parabola, asymptotes, sign
// regions, turning point, arrows, range bracket), then "Draw it" draws the curve and shows a feature card
function part3(host, api){
  var S = api.S, C = api.content, U = C.ui, FL = C.files, FB = C.fallback, NAMES = C.stepNames;
  S.i = S.i || 0; S.f = S.f || {}; S.tri = S.tri || {};
  var X = { draw:null, fb:{}, sel:{} };
  function fs(f){ f = f || FL[S.i]; var s = S.f[f.id]; if (!s) { s = S.f[f.id] = { step:0, st:[], taps:[], signs:[], sides:[], ends:[], drawn:false }; for (var j = 0; j < 6; j++) s.st.push({ tries:0, hint:0, first:null }); } return s; }
  function fq(f){ return Q(f.a, f.d, f.c); }
  host.innerHTML = '<div class="sk">' +
    '<div class="sk-tri" id="sk-tri">' + C.triptych.map(function(t, i){ return '<figure class="sk-tc" data-t="' + i + '"><canvas class="plot" role="img" aria-label="' + MV.esc(t.aria) + '"></canvas><figcaption>' + t.t + "</figcaption></figure>"; }).join("") + "</div>" +
    '<div class="pred-top"><span class="tiny muted" id="sk-n"></span><span class="dots" id="sk-dots" aria-hidden="true"></span></div>' +
    '<p class="eq-cap sk-eq" id="sk-eq"></p>' +
    '<div class="design sk-grid"><div><div class="plot-wrap"><canvas class="plot" id="sk-c" role="img" aria-label="Sketch"></canvas></div>' +
    '<div class="sk-axis" id="sk-axis" role="group" aria-label="' + MV.esc(U.axisBtns) + '"></div><div class="sk-strip" id="sk-strip"></div></div>' +
    '<div><ol class="sk-steps" id="sk-steps"></ol><div id="sk-step"></div><details class="alg" id="sk-alg"><summary>' + U.alg + '</summary><div class="alg-lines" id="sk-algl"></div></details></div></div>' +
    '<div id="sk-card"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="sk-prev">' + U.prev + '</button><button type="button" class="btn ghost sm" id="sk-next">' + U.next + "</button></div></div>";
  var p = new MV.Plot($("#sk-c", host), FL[0].view);
  // triptych (three small graphs; a finished case file replaces its panel)
  var tri = $$(".sk-tc canvas", host).map(function(cv, i){
    var pl = new MV.Plot(cv, { xmin:-3, xmax:3, ymin:-2.5, ymax:2.5 });
    pl.render = function(){
      var fi = S.tri[i], f = fi != null ? FL[fi] : null, t = C.triptych[i], q = f ? fq(f) : Q(t.a, t.d, t.c), v = f ? f.view : { xmin:-3, xmax:3, ymin:-2.5, ymax:2.5 };
      pl.draw({ view:v, ticks:false, grid:false, asymptotes:q.z.map(function(z){ return { x:z.v, label:"" }; }), describe:f ? "Your finished graph of " + MV.plain(f.eq) : t.aria, after:function(ctx, P){ drawRecip(P, q, { width:2.2, head:8 }); } });
    };
    pl.render(); return pl;
  });
  function intervals(f){
    var zs = MV.ans(f.s2), out = [], b = [null].concat(zs, [null]);
    for (var i = 0; i < b.length - 1; i++) {
      var lo = b[i], hi = b[i + 1], lab = lo == null && hi == null ? "x ∈ ℝ" : lo == null ? "x < " + F(hi) : hi == null ? "x > " + F(lo) : F(lo) + " < x < " + F(hi);
      out.push({ lo:lo, hi:hi, lab:lab });
    }
    return out;
  }
  // ----- the sketch, layer by layer -----
  p.render = function(){
    var f = FL[S.i], s = fs(f), q = fq(f), v = f.view, k = s.step, sig = MV.ans(f.s3), arr = MV.ans(f.s5), zs = MV.ans(f.s2);
    var small = p.W < 480, asy = k >= 2 ? zs.map(function(z){ return { x:z, label:"x = " + F(z) }; }) : [];
    p.draw({ view:v, xTicks:{ step:1, fmt:small ? evenFmt : null }, yTicks:{ step:(v.ymax - v.ymin) > 2 ? 0.5 : 0.1 }, asymptotes:asy, describe:skDescribe(f, s, q),
      after:function(ctx, pl){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), hi = css("--hi-soft"), X0 = pl.X(0);
        var off = function(X, w){ return Math.abs(X - X0) < w / 2 + 10 ? (X0 + w / 2 + 14 < pl.W - 4 ? X0 + w / 2 + 14 : X0 - w / 2 - 14) : X; };
        if (k >= 3) intervals(f).forEach(function(iv, i){
          var x0 = pl.X(iv.lo == null ? v.xmin : iv.lo), x1 = pl.X(iv.hi == null ? v.xmax : iv.hi), Y0 = pl.Y(0), up = sig[i] === "+";
          ctx.save(); ctx.fillStyle = hi; ctx.fillRect(x0, up ? 0 : Y0, x1 - x0, up ? Y0 : pl.H - Y0); ctx.restore();
          if (x1 - x0 > (small ? 150 : 90)) bgLabel(ctx, pl, U.lives, off((x0 + x1) / 2, 80), up ? Math.max(70, Y0 * 0.62) : Y0 + (pl.H - Y0) * 0.5, "center", ink, "600 12px " + pl.fontUI);
        });
        if (k >= 1) {
          drawPara(pl, q);
          var vy = f.c, out = vy > v.ymax ? 1 : vy < v.ymin ? -1 : 0;
          if (out && !small) bgLabel(ctx, pl, "vertex (" + F(f.d) + ", " + F(f.c) + ") " + (out > 0 ? "↑" : "↓"), off(pl.X(f.d), 100), out > 0 ? 14 : pl.H - 14, "center", ink2, "600 12px " + pl.fontUI);
        }
        if (k >= 2) bgLabel(ctx, pl, "y = 0", pl.W - 44, pl.Y(0) + 16, "right", ink2, "italic 13px " + pl.fontM);
        if (k === 1) s.taps.forEach(function(x){ pl.point({ x:x, y:0, r:7, open:true, color:ink }); bgLabel(ctx, pl, "x = " + F(x), pl.X(x) + 9, pl.Y(0) - 14, "left", ink, "600 12px " + pl.fontUI); });
        if (k >= 4 && f.s4.tp) { pl.point({ x:f.s4.tp[0], y:f.s4.tp[1], r:6, color:pen }); var rt = pl.X(f.s4.tp[0]) < pl.W - 130; bgLabel(ctx, pl, f.s4.tpLabel, pl.X(f.s4.tp[0]) + (rt ? 10 : -10), pl.Y(f.s4.tp[1]) + (f.s4.tp[1] > 0 ? -15 : 15), rt ? "left" : "right", pen); }
        if (k >= 5) {
          zs.forEach(function(z, i){ [-1, 1].forEach(function(sd, j){ var up = arr.sides[i][j] === "+", Xa = pl.X(z) + sd * 12, Yt = up ? 26 : pl.H - 6, Yb = up ? 54 : pl.H - 34;
            ctx.save(); ctx.strokeStyle = pen; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(Xa, Yb); ctx.lineTo(Xa, Yt + (up ? 6 : -6)); ctx.stroke(); ctx.restore(); pl.head([pl.xOf(Xa), pl.yOf(Yb)], [pl.xOf(Xa), pl.yOf(Yt)], pen, 12); }); });
          [0, 1].forEach(function(e){ var dy = arr.ends[e] === "+" ? -9 : 9, Y = pl.Y(0) + dy, Xa = e ? pl.W - 34 : 34, Xb = e ? pl.W - 6 : 6;
            ctx.save(); ctx.strokeStyle = pen; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(Xa, Y); ctx.lineTo(Xb + (e ? -6 : 6), Y); ctx.stroke(); ctx.restore(); pl.head([pl.xOf(Xa), pl.yOf(Y)], [pl.xOf(Xb), pl.yOf(Y)], pen, 11); });
        }
        if (k >= 6) rangeBar(ctx, pl, f.s6.pieces);
        if (s.drawn || X.draw != null) drawRecip(pl, q, { upto:X.draw != null ? v.xmin + (v.xmax - v.xmin) * X.draw : null });
      } });
  };
  function skDescribe(f, s, q){
    var parts = ["Sketch for " + MV.plain(f.eq) + "."];
    if (s.step >= 1) parts.push("The parabola is dashed.");
    if (s.step >= 2) parts.push(MV.ans(f.s2).length ? "Vertical asymptotes at x = " + MV.ans(f.s2).map(F).join(" and ") + "; horizontal asymptote y = 0." : "No vertical asymptotes; horizontal asymptote y = 0.");
    if (s.step >= 3) parts.push("Shaded regions show where 1/f lives: " + intervals(f).map(function(iv, i){ return iv.lab + " " + (MV.ans(f.s3)[i] === "+" ? "above" : "below") + " the axis"; }).join(", ") + ".");
    if (s.step >= 4 && f.s4.tp) parts.push("Turning point " + f.s4.tpLabel + ".");
    if (s.step >= 6) parts.push("The range is marked on the y-axis.");
    if (s.drawn) parts.push(describeQ(q, false));
    return parts.join(" ");
  }
  // ----- panels -----
  function stepDone(s, j){ return s.step > j; }
  function summaryOf(f, s, j){
    if (!stepDone(s, j)) return "";
    if (j === 0) { var ch = f.s1.choices.filter(MV.ok)[0]; return ch.t; }
    if (j === 1) { var z = MV.ans(f.s2); return z.length ? z.map(function(x){ return M("x = " + F(x)); }).join(", ") : U.none; }
    if (j === 2) return MV.ans(f.s3).map(function(t){ return t === "+" ? "+" : MINUS; }).join(", ");
    if (j === 3) return f.s4.options.filter(MV.ok)[0].t;
    if (j === 4) return "✓";
    return f.s6.options.filter(MV.ok)[0].t;
  }
  function paint(){
    var f = FL[S.i], s = fs(f), k = s.step;
    $("#sk-n", host).textContent = tpl(U.file, { n:S.i + 1 });
    $("#sk-dots", host).innerHTML = FL.map(function(g, i){ var t = S.f[g.id]; return '<span class="dot' + (t && t.drawn ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#sk-eq", host).innerHTML = f.eqs;
    $("#sk-algl", host).innerHTML = f.alg.map(function(l){ return "<span>" + l + "</span>"; }).join("");
    $("#sk-steps", host).innerHTML = NAMES.map(function(n, j){ var d = stepDone(s, j), cls = d ? "done" : j === k ? "cur" : ""; return '<li class="' + cls + '"><span class="mk" aria-hidden="true">' + (d ? "✓" : j + 1) + "</span><span><strong>" + n + "</strong>" + (d ? ": " + summaryOf(f, s, j) : "") + (d ? '<span class="vh"> (done)</span>' : "") + "</span></li>"; }).join("");
    $$(".sk-tc", host).forEach(function(fg, i){ fg.classList.toggle("on", k >= 1 && i === 2 - fq(f).n); });
    tri.forEach(function(t){ t.render(); });
    $("#sk-prev", host).disabled = S.i === 0; $("#sk-next", host).disabled = S.i === FL.length - 1;
    paintStep(); paintAxis(); paintStrip(); paintCard(); p.render();
  }
  function fbBox(j){ var m = X.fb[FL[S.i].id + j]; return m ? '<div class="fb ' + m.kind + '" role="status"><p>' + m.html + "</p></div>" : ""; }
  function chips(name, val, opts){ return '<span class="sk-ch" role="radiogroup">' + opts.map(function(o){ var on = val === o[0]; return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-' + name + '="' + o[0] + '" data-k="' + name + o[0] + '">' + o[1] + "</button>"; }).join("") + "</span>"; }
  function paintStep(){
    var f = FL[S.i], s = fs(f), k = s.step, el = $("#sk-step", host), h = "";
    if (k >= 6) {
      h = s.drawn ? '<div class="fb good" role="status"><p><strong>' + tpl(U.done, { n:s.st.filter(function(t){ return t.first; }).length }) + "</strong></p></div>" : fbBox(5) + '<div class="q-actions"><button type="button" class="btn primary" id="sk-draw" data-k="skdraw"' + (X.draw != null ? " disabled" : "") + ">" + U.drawIt + "</button></div>";
      MV.keepFocus(el, function(){ el.innerHTML = h; }); return;
    }
    var st = s.st[k], sd = f["s" + (k + 1)];
    h += '<h3 class="sk-h">' + tpl(U.stepOf, { n:k + 1 }) + NAMES[k] + '</h3><p class="how">' + C.stepHow[k] + "</p>";
    if (k === 0) h += '<div class="sk-ch">' + sd.choices.map(function(c, i){ return '<button type="button" class="chip" data-c1="' + i + '" data-k="skc1' + i + '">' + c.t + "</button>"; }).join("") + "</div>";
    if (k === 1) h += '<p class="tiny" aria-live="polite">' + (s.taps.length ? tpl(U.tapped, { xs:s.taps.map(function(x){ return M("x = " + F(x)); }).join(", ") }) : U.tappedNone) + '</p><div class="q-actions"><button type="button" class="btn primary sm" id="sk-check" data-k="skchk"' + (s.taps.length ? "" : " disabled") + ">" + U.check + '</button><button type="button" class="btn ghost sm" id="sk-none" data-k="sknone">' + U.none + "</button></div>";
    if (k === 2) h += '<div class="q-actions"><button type="button" class="btn primary sm" id="sk-check" data-k="skchk"' + (intervals(f).every(function(_, i){ return s.signs[i]; }) ? "" : " disabled") + ">" + U.check + "</button></div>";
    if (k === 3 || k === 5) h += '<div class="opts">' + sd.options.map(function(o, i){ return '<button type="button" class="opt" data-op="' + i + '" data-k="skop' + k + i + '"><span>' + o.t + "</span></button>"; }).join("") + "</div>";
    if (k === 4) {
      var zs = MV.ans(f.s2);
      h += zs.map(function(z, i){ return '<div class="sk-row"><span class="sk-lab">' + tpl(U.left, { x:M("x = " + F(z)) }) + "</span>" + chips("sl" + i, (s.sides[i] || [])[0], [["+", U.up], ["-", U.down]]) + '</div><div class="sk-row"><span class="sk-lab">' + tpl(U.right, { x:M("x = " + F(z)) }) + "</span>" + chips("sr" + i, (s.sides[i] || [])[1], [["+", U.up], ["-", U.down]]) + "</div>"; }).join("");
      h += [0, 1].map(function(e){ return '<div class="sk-row"><span class="sk-lab">' + (e ? U.endR : U.endL) + "</span>" + chips("se" + e, s.ends[e], [["+", U.zp], ["-", U.zm]]) + "</div>"; }).join("");
      var ready = zs.every(function(_, i){ return s.sides[i] && s.sides[i][0] && s.sides[i][1]; }) && s.ends[0] && s.ends[1];
      h += '<div class="q-actions"><button type="button" class="btn primary sm" id="sk-check" data-k="skchk"' + (ready ? "" : " disabled") + ">" + U.check + "</button></div>";
    }
    h += '<div class="q-actions">' + MV.hintBtn("skh" + f.id + k, st.hint) + "</div>" + MV.hintsHTML(sd.hints, st.hint);
    h += fbBox(k) || fbBox(k - 1);
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintAxis(){
    var f = FL[S.i], s = fs(f), el = $("#sk-axis", host);
    if (s.step !== 1) { el.innerHTML = ""; return; }
    MV.keepFocus(el, function(){ var h = ""; for (var x = -6; x <= 6; x++) { var on = s.taps.indexOf(x) >= 0; h += '<button type="button" class="chip" data-ax="' + x + '" data-k="skax' + x + '" aria-pressed="' + on + '">x = ' + F(x) + "</button>"; } el.innerHTML = h; });
  }
  function paintStrip(){
    var f = FL[S.i], s = fs(f), el = $("#sk-strip", host);
    if (s.step < 2) { el.innerHTML = ""; return; }
    var ivs = intervals(f), live = s.step === 2, sig = MV.ans(f.s3);
    MV.keepFocus(el, function(){
      el.innerHTML = '<table class="vt sk-sign"><thead><tr><th scope="row">' + U.interval + "</th>" + ivs.map(function(iv){ return "<th scope=\"col\">" + M(iv.lab) + "</th>"; }).join("") + '</tr></thead><tbody><tr><th scope="row">' + U.sign + "</th>" + ivs.map(function(iv, i){
        var v = live ? s.signs[i] : sig[i];
        return "<td>" + (live ? chips("sg" + i, v, [["+", "+"], ["-", MINUS]]) : '<strong>' + (v === "+" ? "+" : MINUS) + "</strong>") + "</td>"; }).join("") + "</tr></tbody></table>";
    });
  }
  function paintCard(){
    var f = FL[S.i], s = fs(f), el = $("#sk-card", host);
    if (!s.drawn) { el.innerHTML = ""; return; }
    var cd = f.card;
    el.innerHTML = '<div class="refresh sk-card"><h4>' + U.card + "</h4>" + MV.readoutHTML([[U.dom, cd.dom], [U.rng, cd.rng], [U.yint, cd.yint], [U.xint, U.xintVal], [U.inc, cd.inc], [U.dec, cd.dec]]).replace(/<div>/g, '<div class="sk-kv">') + "</div>";
  }
  function setFb(j, kind, html){ X.fb[FL[S.i].id + j] = { kind:kind, html:html }; }
  function wrong(j, msg){
    var f = FL[S.i], s = fs(f); s.st[j].tries++;
    msg = msg || FB[j + 1];
    setFb(j, "bad", "<strong>✗ Not quite.</strong> " + msg + (/Try again\.$/.test(MV.plain(msg)) ? "" : " Try again."));
    api.save(); paint(); MV.focusFb($("#sk-step", host));
  }
  function right(j, why){
    var f = FL[S.i], s = fs(f), st = s.st[j];
    if (st.first == null) st.first = st.tries === 0 && st.hint < 3;
    s.step = j + 1; setFb(j, "good", "<strong>✓ Correct.</strong> " + (why || ""));
    api.save(); paint(); MV.focusFb($("#sk-step", host));
  }
  function setsEq(a, b){ return MV.sameNums(a.slice().sort(function(x, y){ return x - y; }), b.slice().sort(function(x, y){ return x - y; }), 1e-9) || (!a.length && !b.length); }
  function check(j, arg){
    var f = FL[S.i], s = fs(f), sd = f["s" + (j + 1)];
    if (j === 0) { var ch = sd.choices[arg]; if (MV.ok(ch)) right(0); else wrong(0, ch.fb); return; }
    if (j === 1) {
      var got = arg === "none" ? [] : s.taps.slice(), want = MV.ans(sd);
      if (setsEq(got, want)) { right(1); return; }
      var w = (sd.wrong || []).filter(function(x){ return setsEq(x.set, got); })[0];
      wrong(1, w && w.fb); return;
    }
    if (j === 2) {
      var g = intervals(f).map(function(_, i){ return s.signs[i]; }), wt = MV.ans(sd);
      if (g.join() === wt.join()) { right(2); return; }
      if (sd.anyWrong) { wrong(2, sd.anyWrong); return; }
      var w2 = (sd.wrong || []).filter(function(x){ return x.signs.join() === g.join(); })[0];
      wrong(2, w2 && w2.fb); return;
    }
    if (j === 3 || j === 5) { var o = sd.options[arg]; if (MV.ok(o)) right(j, o.why); else wrong(j, o.why); return; }
    if (j === 4) {
      var A = MV.ans(sd), sideBad = A.sides.some(function(pr, i){ return pr[0] !== s.sides[i][0] || pr[1] !== s.sides[i][1]; }), endBad = A.ends[0] !== s.ends[0] || A.ends[1] !== s.ends[1];
      if (!sideBad && !endBad) { right(4); return; }
      var nm = (sd.named || []).filter(function(n){ return s.sides[n.at][n.side] === n.val && A.sides[n.at][n.side] !== n.val; })[0];
      wrong(4, nm ? nm.fb : sideBad && sd.side ? sd.side : !sideBad && endBad && sd.end ? sd.end : sideBad ? null : sd.end);
    }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var f = FL[S.i], s = fs(f), k = s.step;
    if (b.id === "sk-prev" || b.id === "sk-next") { S.i = clamp(S.i + (b.id === "sk-next" ? 1 : -1), 0, FL.length - 1); X.draw = null; api.save(); paint(); return; }
    if (b.dataset.act === "hint" && k < 6) { s.st[k].hint = Math.min(3, s.st[k].hint + 1); api.save(); paintStep(); return; }
    if (b.dataset.c1 != null) { check(0, +b.dataset.c1); return; }
    if (b.dataset.op != null) { check(k, +b.dataset.op); return; }
    if (b.dataset.ax != null) { toggleTap(+b.dataset.ax); return; }
    if (b.id === "sk-none") { check(1, "none"); return; }
    if (b.id === "sk-check") { check(k); return; }
    var m;
    for (var key in b.dataset) {
      if ((m = /^sg(\d)$/.exec(key))) { s.signs[+m[1]] = b.dataset[key]; api.save(); paintStrip(); paintStep(); return; }
      if ((m = /^s([lr])(\d)$/.exec(key))) { var i = +m[2]; s.sides[i] = s.sides[i] || []; s.sides[i][m[1] === "l" ? 0 : 1] = b.dataset[key]; api.save(); paintStep(); return; }
      if ((m = /^se(\d)$/.exec(key))) { s.ends[+m[1]] = b.dataset[key]; api.save(); paintStep(); return; }
    }
    if (b.id === "sk-draw") {
      X.draw = 0; paintStep();
      MV.tween({ dur:1500, ease:function(t){ return t; }, step:function(t){ X.draw = t; p.render(); }, done:function(){
        X.draw = null; s.drawn = true; S.tri[2 - fq(f).n] = S.i; api.save(); paint(); MV.focusFb($("#sk-step", host));
      } });
    }
  });
  function toggleTap(x){ var s = fs(); if (s.step !== 1) return; var i = s.taps.indexOf(x); if (i >= 0) s.taps.splice(i, 1); else s.taps.push(x); s.taps.sort(function(a, b){ return a - b; }); api.save(); paintStep(); paintAxis(); p.render(); }
  p.c.addEventListener("pointerdown", function(e){
    var s = fs(); if (s.step !== 1) return;
    var r = p.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    if (Math.abs(py - p.Y(0)) > 40) return;
    var x = Math.round(p.xOf(px)); if (x < -6 || x > 6) return;
    toggleTap(x);
  });
  paint();
  MV.ACTS.caseSteps = {
    stats:function(){ var n = 0, d = 0; FL.forEach(function(f){ var s = S.f[f.id]; if (!s) return; s.st.forEach(function(t, j){ if (t.first) n++; if (s.step > j) d++; }); }); return { first:n, total:24, done:d, line:"Three cases, case-file steps (first try): " + n + "/24" + (d < 24 ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; FL.forEach(function(f){ var s = S.f[f.id]; if (!s) return; s.st.forEach(function(t, j){ if (t.tries > 0 || t.hint >= 3) g = g.concat(MV.goalIdx(C.stepGoals[j])); }); }); return g; }
  };
  return {};
}

// ---------- Practice 1: Match the graph ----------
// @component N6 graphMatch (adapted from MHF4U 18) — equation chips above a grid of K5 graph thumbnails (2 × 4 on phones,
// 4 × 2 from 560 px), pair-specific feedback from the data, worked-match hints for the selected equation
function matchAct(host, api, a){
  var S = api.S; S.done = S.done || {}; S.tries = S.tries || {}; S.hints = S.hints || {};
  var sel = null, msg = null, K = MV.ans(a), U = a.ui, V = a.view;
  function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="gm-eqs" role="group" aria-label="' + U.eqs + '">' +
    a.left.map(function(L){ return '<button type="button" class="chip gm-eq" data-l="' + L.id + '" data-k="gm' + L.id + '" aria-pressed="false"><span class="gm-n">' + L.n + ".</span> " + L.t + '<span class="gm-to"></span></button>'; }).join("") +
    '</div><div id="gm-sel"></div><div id="gm-msg"></div><p class="sort-done" id="gm-done" hidden></p><div class="gm-grid" role="group" aria-label="' + U.graphs + '">' +
    a.graphs.map(function(G){ return '<button type="button" class="gm-th" data-g="' + G.id + '" data-k="gm' + G.id + '"><span class="gm-tag">' + U.graph + " " + G.id + '</span><canvas class="plot gm-c" role="img" aria-label="' + MV.esc(U.graph + " " + G.id + ": " + MV.plain(G.desc)) + '"></canvas><span class="gm-eqd"></span></button>'; }).join("") + "</div>";
  a.graphs.forEach(function(G){
    var cv = host.querySelector('[data-g="' + G.id + '"] canvas'), pl = new MV.Plot(cv, V), q = Q(G.a, G.d, G.c);
    pl.render = function(){
      pl.draw({ view:V, ticks:false, xTicks:{ step:2 }, yTicks:{ step:0.5 }, asymptotes:q.z.map(function(z){ return { x:z.v, label:"x = " + z.p }; }), describe:U.graph + " " + G.id + ": " + MV.plain(G.desc),
        after:function(ctx, P){ drawRecip(P, q, { width:2.6, head:10 }); if (q.n !== 1) { P.point({ x:q.d, y:1 / q.c, r:4.5, color:css("--pen") }); bgLabel(ctx, P, "(" + F(q.d) + ", " + F(1 / q.c) + ")", P.X(q.d), P.Y(1 / q.c) + (q.c > 0 ? -14 : 14), "center", css("--ink"), "600 12px " + P.fontUI); } } });
    };
    pl.render();
  });
  function stats(){ var f = 0, d = 0, miss = []; a.left.forEach(function(L){ var bad = (S.tries[L.id] || 0) > 0 || (S.hints[L.id] || 0) >= 3; if (S.done[L.id]) { d++; if (!bad) f++; } if (bad) miss.push(L); }); return { first:f, done:d, total:a.left.length, miss:miss }; }
  function paint(){
    var doneG = {};
    a.left.forEach(function(L){ if (S.done[L.id]) doneG[K[L.id]] = L; });
    $$(".gm-eq", host).forEach(function(b){ var L = byId(a.left, b.dataset.l), d = !!S.done[L.id]; b.classList.toggle("done", d); b.disabled = d; b.setAttribute("aria-pressed", String(sel === L.id)); b.classList.toggle("on", sel === L.id); b.querySelector(".gm-to").textContent = d ? " → " + U.graph + " " + K[L.id] : ""; });
    $$(".gm-th", host).forEach(function(b){ var L = doneG[b.dataset.g]; b.classList.toggle("done", !!L); b.disabled = !!L; b.querySelector(".gm-eqd").innerHTML = L ? '<span class="pair-n">✓ ' + L.n + ".</span> " + L.t : ""; });
    var L = sel ? byId(a.left, sel) : null, lv = L ? (S.hints[sel] || 0) : 0;
    MV.keepFocus($("#gm-sel", host), function(){ $("#gm-sel", host).innerHTML = L ? '<div class="sel-bar"><span>' + U.sel + ": <strong>" + L.n + ".</strong> " + L.t + "</span>" + MV.hintBtn("gmh" + a.id, lv) + "</div>" + MV.hintsHTML(L.hints, lv) : ""; });
    $("#gm-msg", host).innerHTML = msg ? '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>" : "";
    var s = stats(), dn = $("#gm-done", host); dn.hidden = s.done < s.total; dn.textContent = tpl(U.done, { f:s.first, n:s.total });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.l) { sel = sel === b.dataset.l ? null : b.dataset.l; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { S.hints[sel] = Math.min(3, (S.hints[sel] || 0) + 1); api.save(); paint(); return; }
    if (b.dataset.g) {
      if (!sel) { msg = { type:"", html:U.pick }; paint(); return; }
      var L = byId(a.left, sel), G = byId(a.graphs, b.dataset.g);
      if (K[sel] === G.id) { S.done[sel] = true; msg = { type:"good", html:"<strong>✓ Matched.</strong> " + L.n + ". " + L.t + " → " + U.graph + " " + G.id + ". " + G.desc }; sel = null; api.save(); paint(); MV.focusFb($("#gm-msg", host)); }
      else { S.tries[sel] = (S.tries[sel] || 0) + 1; msg = { type:"bad", html:"<strong>✗ Not a match.</strong> " + ((a.wrong || {})[sel + "|" + G.id] || a.wrongDefault) + " " + a.tail }; api.save(); paint(); MV.focusFb($("#gm-msg", host)); }
    }
  });
  paint();
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:a.summary + " (first try): " + s.first + "/" + s.total + (s.done < s.total ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; stats().miss.forEach(function(L){ g = g.concat(MV.goalIdx(L.goal != null ? L.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Work backwards ----------
// @component N4 coefTemplate — fill-in-the-coefficients templates y = 1/([a](x − [ ])(x − [ ])), 1/([a](x − [d])²),
// 1/([a](x − [d])² + [c]) with per-box named mistakes, and a features-only thumbnail (asymptotes, points, range bar)
function workBack(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var msg = {}, U = a.ui;
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="wb-n"></span><span class="dots" id="wb-dots" aria-hidden="true"></span></div>' +
    '<div class="design wb"><div><p class="pred-q" id="wb-feat"></p><div class="wb-frame" id="wb-frame"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="wb-check">' + U.check + '</button><span id="wb-hint"></span></div><div id="wb-hints"></div><div id="wb-fb"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="wb-prev">' + U.prev + '</button><button type="button" class="btn ghost sm" id="wb-next">' + U.next + "</button></div></div>" +
    '<div><canvas class="plot" id="wb-plot" role="img" aria-label="Features"></canvas></div></div>';
  var plot = new MV.Plot($("#wb-plot", host), a.items[0].view);
  function cur(){ return a.items[S.i]; }
  function ist(it){ it = it || cur(); return S.items[it.id] || (S.items[it.id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function boxes(it){ return it.tpl === "roots" ? ["a", "r1", "r2"] : it.tpl === "double" ? ["a", "d"] : ["a", "d", "c"]; }
  function inp(k, x){ var cls = k === "a" ? "p-a" : k === "d" ? "p-d" : k === "c" ? "p-c" : ""; var ph = k.charAt(0) === "r" ? "" : k, lab = k === "r1" ? "first number in the brackets" : k === "r2" ? "second number in the brackets" : k; return '<input class="numin wb-in ' + cls + '" data-b="' + k + '" type="text" autocomplete="off" spellcheck="false" placeholder="' + ph + '" aria-label="' + lab + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function frame(it, x){
    var m = function(s){ return '<span class="m">' + s + "</span>"; };
    if (it.tpl === "roots") return m("<i>y</i> = 1/(") + inp("a", x) + m("(<i>x</i> − ") + inp("r1", x) + m(")(<i>x</i> − ") + inp("r2", x) + m("))");
    if (it.tpl === "double") return m("<i>y</i> = 1/(") + inp("a", x) + m("(<i>x</i> − ") + inp("d", x) + m(")<sup>2</sup>)");
    return m("<i>y</i> = 1/(") + inp("a", x) + m("(<i>x</i> − ") + inp("d", x) + m(")<sup>2</sup> + ") + inp("c", x) + m(")");
  }
  plot.render = function(){
    var it = cur(), x = ist(it), v = it.view, A = MV.ans(it);
    plot.draw({ view:v, xTicks:{ step:1 }, yTicks:{ step:(v.ymax - v.ymin) > 1.2 ? 0.5 : 0.1 }, asymptotes:it.asym.map(function(z){ return { x:z, label:"x = " + F(z) }; }),
      describe:U.features + ": " + MV.plain(it.features) + (x.solved ? ". " + describeQ(qOf(it, A), false) : ""),
      after:function(ctx, p){
        var ink = css("--ink");
        if (it.range) rangeBar(ctx, p, it.range);
        if (x.solved) drawRecip(p, qOf(it, A));
        it.pts.forEach(function(r){ p.point({ x:r[0], y:r[1], r:6.5, open:true, color:ink }); bgLabel(ctx, p, r[2], p.X(r[0]) + 10, p.Y(r[1]) + (r[1] >= 0 ? -13 : 13), p.X(r[0]) > p.W - 120 ? "right" : "left"); });
      } });
  };
  function qOf(it, A){ if (it.tpl === "roots") { var d = (A.r[0] + A.r[1]) / 2, h = (A.r[1] - A.r[0]) / 2; return Q(A.a, d, -A.a * h * h); } if (it.tpl === "double") return Q(A.a, A.d, 0); return Q(A.a, A.d, A.c); }
  function paint(load){
    var it = cur(), x = ist(it);
    $("#wb-n", host).textContent = tpl(U.item, { n:S.i + 1 });
    $("#wb-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#wb-feat", host).innerHTML = "<strong>" + U.features + ":</strong> " + it.features;
    if (load) $("#wb-frame", host).innerHTML = frame(it, x);
    $$(".wb-in", host).forEach(function(i){ i.disabled = x.solved; });
    $("#wb-check", host).disabled = x.solved;
    MV.keepFocus(host, function(){ $("#wb-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("wbh" + it.id, x.hint); $("#wb-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint); });
    var A = MV.ans(it);
    $("#wb-fb", host).innerHTML = x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct: ' + M(recInl(qOf(it, A).a, qOf(it, A).d, qOf(it, A).c)) + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : (msg[it.id] ? '<div class="fb bad" role="status">' + msg[it.id] + "</div>" : "");
    $("#wb-prev", host).disabled = S.i === 0; $("#wb-next", host).disabled = S.i === a.items.length - 1;
    plot.render();
  }
  function val(raw){ var r = MV.parseNum(raw); return r && r.length === 1 ? r[0] : null; }
  host.addEventListener("input", function(e){ var b = e.target.dataset && e.target.dataset.b; if (!b) return; ist().v[b] = e.target.value; e.target.removeAttribute("aria-invalid"); api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.b) $("#wb-check", host).click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = cur(), x = ist(it);
    if (b.id === "wb-prev" || b.id === "wb-next") { S.i += b.id === "wb-prev" ? -1 : 1; api.save(); paint(true); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id !== "wb-check") return;
    var ks = boxes(it), vals = {}, A = MV.ans(it), bad = [], msgs = [];
    ks.forEach(function(k){ vals[k] = val(x.v[k]); });
    if (ks.some(function(k){ return vals[k] == null; })) { msg[it.id] = "<p>" + a.empty + "</p>"; paint(); MV.focusFb($("#wb-fb", host)); return; }
    if (vals.a === 0) { msg[it.id] = "<p>" + a.azero + "</p>"; paint(); MV.focusFb($("#wb-fb", host)); return; }
    ks.forEach(function(k){
      var v = vals[k], ok;
      if (k === "r1") ok = A.r.some(function(r){ return near(r, v); });
      else if (k === "r2") ok = A.r.some(function(r){ return near(r, v); }) && !near(v, vals.r1);
      else ok = near(v, A[k]);
      if (ok) return;
      bad.push(k);
      var bx = k.charAt(0) === "r" ? "r" : k;
      var nm = (it.wrong || []).filter(function(w){ return w.box === bx && (w.neg ? v < 0 : Array.isArray(w.v) ? w.v.some(function(t){ return near(t, v); }) : near(w.v, v)); })[0];
      var t = (nm ? nm.fb : a.generic) + " " + a.tail;
      if (msgs.indexOf(t) < 0) msgs.push(t);
    });
    $$(".wb-in", host).forEach(function(i){ if (bad.indexOf(i.dataset.b) >= 0) i.setAttribute("aria-invalid", "true"); else i.removeAttribute("aria-invalid"); });
    if (!bad.length) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
    else { x.tries++; msg[it.id] = msgs.map(function(t, i){ return "<p>" + (i ? "" : "<strong>✗ Not quite.</strong> ") + t + "</p>"; }).join(""); }
    api.save(); paint(); MV.focusFb($("#wb-fb", host));
  });
  paint(true);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a reciprocal ----------
var AS = [-4, -2, -1, -0.5, -0.25, 0.25, 0.5, 1, 2, 4], TV = { xmin:-7, xmax:7, ymin:-2, ymax:2 };
var task = (function(){
  var api, plot;
  function T(){ return MV.C.task; }
  function read(){ var s = api ? api.S : {}; return { a:s.a != null ? s.a : 1, d:s.d != null ? s.d : 0, c:s.c != null ? s.c : 1 }; }
  function asymList(q){ return q.n ? q.z.map(function(z){ return M("x = " + z.s); }).join(" and ") : T().ui.none; }
  function live(){
    var D = read(), q = Q(D.a, D.d, D.c), U = T().ui, f0 = q.f(0);
    $("#ds-eq").innerHTML = M("f(x) = " + vtxSrc(D.a, D.d, D.c, true)) + (vtxSrc(D.a, D.d, D.c, false) === expSrc(D.a, D.d, D.c) ? "" : " " + M("= " + expSrc(D.a, D.d, D.c)));
    $("#ds-read").innerHTML = MV.readoutHTML([
      [U.eq, M(recSrc(D.a, D.d, D.c, true))],
      [U.va, asymList(q)],
      [U.yint, near(f0, 0) ? U.none : pt("0", F(1 / f0))],
      [U.tp, near(D.c, 0) ? U.noTp : pt(F(D.d), F(1 / D.c)) + ", " + (D.a > 0 ? U.lmax : U.lmin)],
      [U.rng, M(rangeSrc(q))]
    ]);
    plot.render();
  }
  function draw(){
    var D = read(), q = Q(D.a, D.d, D.c), f0 = q.f(0);
    plot.draw({ view:TV, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:0.5 }, asymptotes:q.z.map(function(z){ return { x:z.v, label:"x = " + z.p }; }), describe:describeQ(q, false),
      after:function(ctx, p){
        drawPara(p, q); drawRecip(p, q);
        if (!near(f0, 0)) { p.point({ x:0, y:1 / f0, r:5.5, color:css("--pen") }); bgLabel(ctx, p, "(0, " + F(1 / f0) + ")", p.X(0) + 9, p.Y(1 / f0) + (f0 > 0 ? -13 : 13), "left", css("--ink"), "600 12px " + p.fontUI); }
        if (!near(D.c, 0)) { p.point({ x:D.d, y:1 / D.c, r:5.5, color:css("--pen") }); bgLabel(ctx, p, "(" + F(D.d) + ", " + F(1 / D.c) + ")", p.X(D.d) + 9, p.Y(1 / D.c) + (D.c > 0 ? -13 : 13), "left", css("--pen"), "600 12px " + p.fontUI); }
      } });
  }
  function paintA(){
    var D = read(), el = $("#ds-a");
    MV.keepFocus(el, function(){ el.innerHTML = AS.map(function(v){ var on = near(v, D.a); return '<button type="button" class="chip" role="radio" aria-checked="' + on + '" data-av="' + v + '" data-k="dsa' + v + '"' + (on ? ' style="border-color:var(--acol)"' : "") + ">" + M(F(v)) + "</button>"; }).join(""); });
    $$("#ds-a .chip").forEach(function(b){ b.classList.toggle("on", b.getAttribute("aria-checked") === "true"); });
  }
  function setV(k, v){ api.S[k] = v; api.save(); live(); api.update(); }
  function stepper(k, lab, lo, hi, step){
    return '<div class="ds-st"><span class="ds-lab">' + lab + '</span><button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="ds' + k + 'm" aria-label="' + T().ui.minus + " " + k + '">' + MINUS + '</button><input class="numin short ds-in p-' + k + '" id="ds-' + k + '" data-in="' + k + '" type="text" autocomplete="off" spellcheck="false" aria-label="' + k + '" aria-describedby="ds-' + k + '-m"><button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="ds' + k + 'p" aria-label="' + T().ui.plus + " " + k + '">+</button><span class="tiny ds-bad" id="ds-' + k + '-m" aria-live="polite"></span></div>';
  }
  var LIM = { d:[-5, 5, 0.5], c:[-9, 9, 1] };
  function okVal(k, v){ var L = LIM[k]; return v != null && v >= L[0] - 1e-9 && v <= L[1] + 1e-9 && isInt(v / L[2]); }
  return {
    render:function(inp, pv, a){
      api = a; var U = T().ui;
      if (a.S.a == null) { a.S.a = 1; a.S.d = 0; a.S.c = 1; }
      inp.innerHTML = '<div class="ds"><div class="ds-row"><span class="ds-lab">' + U.a + '</span><span class="chips ds-a" id="ds-a" role="radiogroup" aria-label="a"></span></div>' + stepper("d", U.d, -5, 5, 0.5) + stepper("c", U.c, -9, 9, 1) + '<p class="eq-cap ds-eq" id="ds-eq" aria-live="polite"></p></div>';
      pv.innerHTML = '<canvas class="plot" id="ds-plot" role="img" aria-label="Preview"></canvas><dl class="read ds-read" id="ds-read"></dl>';
      plot = new MV.Plot($("#ds-plot"), TV); plot.render = draw;
      $("#ds-d").value = F(a.S.d); $("#ds-c").value = F(a.S.c);
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.av != null) { setV("a", +b.dataset.av); paintA(); return; }
        if (b.dataset.st) { var k = b.dataset.st, L = LIM[k], v = clamp(a.S[k] + (+b.dataset.dir) * L[2], L[0], L[1]); $("#ds-" + k).value = F(v); $("#ds-" + k + "-m").textContent = ""; setV(k, v); }
      });
      inp.addEventListener("keydown", function(e){
        var b = e.target.closest && e.target.closest('[role="radio"]'); if (!b || ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key) < 0) return;
        e.preventDefault(); var sib = $$('[role="radio"]', b.parentNode), j = (sib.indexOf(b) + (e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1) + sib.length) % sib.length;
        sib[j].click(); var nb = inp.querySelector('[data-k="' + sib[j].dataset.k + '"]'); if (nb) nb.focus();
      });
      inp.addEventListener("input", function(e){
        var k = e.target.dataset.in; if (!k) return;
        var r = MV.parseNum(e.target.value), v = r && r.length === 1 ? r[0] : null, m = $("#ds-" + k + "-m");
        if (okVal(k, v)) { m.textContent = ""; setV(k, Math.round(v / LIM[k][2]) * LIM[k][2]); }
        else m.textContent = k === "d" ? U.dBad : U.cBad;
      });
      inp.addEventListener("change", function(e){ var k = e.target.dataset.in; if (!k) return; e.target.value = F(a.S[k]); });
      // after "Check my design": the plan's message once all four answers are found
      document.addEventListener("click", function(e){
        if (!e.target.closest || !e.target.closest("#task-check")) return;
        setTimeout(function(){ var ts = MV.taskState(), g = $("#task-fb .fb.good"); if (g && ts.found.length >= 4 && !g.querySelector(".ds-all")) g.insertAdjacentHTML("beforeend", '<p class="ds-all">' + T().all4 + "</p>"); }, 0);
      });
      paintA(); live();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(D){
      var q = Q(D.a, D.d, D.c), r = -D.c / D.a, two = r > 0 && isInt(D.d - Math.sqrt(r)) && isInt(D.d + Math.sqrt(r));
      return [D.a > 0 && D.c === -4, two, near(D.a * D.d * D.d + D.c, -3)];
    },
    tips:function(D, res){
      var q = Q(D.a, D.d, D.c), t = T().tips, out = [];
      if (!res[0]) out.push(tpl(t[0], { range:M(rangeSrc(q)) }));
      if (!res[1]) out.push(tpl(t[1], { list:asymList(q) }));
      if (!res[2]) out.push(tpl(t[2], { v:F(D.a * D.d * D.d + D.c) }));
      return out;
    },
    key:function(D){ return [D.a, D.d, D.c].join("|"); },
    label:function(k){ var v = k.split("|").map(Number); return M(recInl(v[0], v[1], v[2])); },
    text:function(k){ var v = k.split("|").map(Number); return MV.plain(M(recInl(v[0], v[1], v[2]))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ match:matchAct, wb:workBack },
  task:task
});
})();
