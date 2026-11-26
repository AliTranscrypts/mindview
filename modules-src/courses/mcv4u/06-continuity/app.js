// MCV4U 06 Continuity: hero storyboard (pencil trace), Pencil test (Explore: Trace, Checklist with the V6 approach table,
// Builder), Repair shop (Part 3 stations with Retrace), Repair the constants (Practice 2, V8/N4 number boxes), "Smooth join" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function md(h){ return MV.md(h); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function nsrc(v){ return String(r9(v)); }                         // number as m() source (a hyphen becomes a true minus)
function ntx(v, dp){ return num(r9(v), dp == null ? 4 : dp); }    // number as text (true minus)
function close(a, b, t){ return Math.abs(a - b) <= (t || 1e-9); }
function lin(t){ return t; }
// lim with the approach underneath (course plan §2; copied from MCV4U 04); hidden brackets keep MV.plain() readable
function lim(sub){ return '<span class="ct-lim"><span class="ct-lt">lim</span><span class="vh"> (</span><span class="ct-lu">' + m(sub) + '</span><span class="vh">)</span></span>'; }
function yes(h){ return '<span class="ct-yes"><span aria-hidden="true">✓</span><span class="vh">Yes:</span> ' + h + "</span>"; }
function no(h){ return '<span class="ct-no"><span aria-hidden="true">✗</span><span class="vh">No:</span> ' + h + "</span>"; }
function dash(h){ return '<span class="muted">— ' + (h || "") + "</span>"; }
// "x^2 + 3", "x - 2", "x^2": base plus a signed constant (m() source)
function plus(base, c){ c = r9(c); return c === 0 ? base : base + (c > 0 ? " + " : " - ") + nsrc(Math.abs(c)); }
function coefSrc(b, v){ b = r9(b); return b === 0 ? "0" : b === 1 ? v : b === -1 ? "-" + v : nsrc(b) + v; }
// piecewise caption: rows [[expression source, condition source]] (copied from MCV4U 04)
function pw(rows){
  return '<span class="ct-pw"><span class="ct-br" aria-hidden="true">{</span><span class="ct-cases">' + rows.map(function(r){ return '<span class="ct-case">' + m(r[0]) + '<span class="ct-cond">' + m(r[1]) + "</span></span>"; }).join("") + "</span></span>";
}

// @component exactDec (copied from MCV4U 04) — exact rationals (BigInt) printed as exact decimals (3.999, not 3.9990000…);
// of(v) reads any decimal up to 12 places exactly; decS() adds "≈ " when it had to round.
var XQ = (function(){
  var B = window.BigInt, Z = B(0), ONE = B(1), TWO = B(2), FIVE = B(5), TEN = B(10);
  function abs(a){ return a < Z ? -a : a; }
  function gcd(a, b){ a = abs(a); b = abs(b); while (b !== Z) { var t = a % b; a = b; b = t; } return a; }
  function mk(n, d){ if (d < Z) { n = -n; d = -d; } var g = gcd(n, d); if (g > ONE) { n = n / g; d = d / g; } return { n:n, d:d }; }
  function of(v){
    if (v && typeof v === "object") return v;
    var s = Number(v).toFixed(12), neg = s.charAt(0) === "-"; if (neg) s = s.slice(1);
    var p = s.split("."), n = B(p[0] + p[1]), d = B("1" + p[1].replace(/\d/g, "0"));
    return mk(neg ? -n : n, d);
  }
  function add(a, b){ a = of(a); b = of(b); return mk(a.n * b.d + b.n * a.d, a.d * b.d); }
  function sub(a, b){ a = of(a); b = of(b); return mk(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mul(a, b){ a = of(a); b = of(b); return mk(a.n * b.n, a.d * b.d); }
  function div(a, b){ a = of(a); b = of(b); return b.n === Z ? null : mk(a.n * b.d, a.d * b.n); }
  function neg(a){ a = of(a); return { n:-a.n, d:a.d }; }
  function sign(a){ a = of(a); return a.n < Z ? -1 : a.n > Z ? 1 : 0; }
  function toNum(a){ a = of(a); return Number(a.n) / Number(a.d); }
  function pow10(k){ var p = ONE; while (k-- > 0) p = p * TEN; return p; }
  function dec(a, maxDp, rDp){
    a = of(a); maxDp = maxDp == null ? 9 : maxDp; rDp = rDp == null ? 4 : rDp;
    var d = a.d, i = 0, j = 0;
    while (d % TWO === Z) { d = d / TWO; i++; }
    while (d % FIVE === Z) { d = d / FIVE; j++; }
    var k = Math.max(i, j), exact = d === ONE && k <= maxDp;
    if (!exact) k = rDp;
    var ng = a.n < Z, n = abs(a.n), s = pow10(k), q = exact ? n * s / a.d : (n * s * TWO + a.d) / (TWO * a.d), str = q.toString();
    if (k > 0) { while (str.length <= k) str = "0" + str; str = (str.slice(0, str.length - k) + "." + str.slice(str.length - k)).replace(/0+$/, "").replace(/\.$/, ""); }
    var parts = str.split(".");
    if (parts[0].length > 4) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    str = parts.join(".");
    return { s:(ng && /[1-9]/.test(str) ? MINUS : "") + str, exact:exact };
  }
  function decS(a, maxDp, rDp){ var r = dec(a, maxDp, rDp); return (r.exact ? "" : "≈ ") + r.s; }
  return { of:of, add:add, sub:sub, mul:mul, div:div, neg:neg, sign:sign, toNum:toNum, dec:dec, decS:decS };
})();

// ---------- canvas maths text: italic letters, upright digits, operators and "lim" (copied from MCV4U 04) ----------
function rich(ctx, s, x, y, o){
  o = o || {};
  var size = o.size || 15, fam = css("--font-math") || "serif", parts = String(s).split(/([A-Za-z]+)/), w = 0, ws = [];
  function font(i, p){ return ((i % 2 === 1 && p !== "lim") ? "italic " : "") + (o.weight || 500) + " " + size + "px " + fam; }
  parts.forEach(function(p, i){ ctx.font = font(i, p); var ww = p ? ctx.measureText(p).width : 0; ws.push(ww); w += ww; });
  if (o.measure) return w;
  var x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  if (o.bg) { ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88 * (o.alpha == null ? 1 : o.alpha); ctx.fillRect(x0 - 4, y - size * 0.72, w + 8, size * 1.44); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; }
  ctx.fillStyle = o.color || css("--ink"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
  parts.forEach(function(p, i){ if (!p) return; ctx.font = font(i, p); ctx.fillText(p, x0, y); x0 += ws[i]; });
  return w;
}
// "lim" with the approach under it, then the rest: limCanvas(ctx, x, y, "x → a", "f(x) = f(a)", {align, bg, size})
function limCanvas(ctx, x, y, sub, rest, o){
  o = o || {};
  var size = o.size || 16, s2 = Math.round(size * 0.7);
  var wl = rich(ctx, "lim", 0, 0, { size:size, measure:true }), wsub = rich(ctx, sub, 0, 0, { size:s2, measure:true }), wr = rich(ctx, rest, 0, 0, { size:size, measure:true });
  var head = Math.max(wl, wsub), gap = size * 0.3, total = head + gap + wr, x0 = o.align === "right" ? x - total : o.align === "center" ? x - total / 2 : x;
  if (o.bg) { ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.9 * (o.alpha == null ? 1 : o.alpha); ctx.fillRect(x0 - 6, y - size * 0.8, total + 12, size * 2); }
  ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
  rich(ctx, "lim", x0 + head / 2, y, { size:size, align:"center", color:o.color, alpha:o.alpha });
  rich(ctx, sub, x0 + head / 2, y + size * 0.82, { size:s2, align:"center", color:o.color, alpha:o.alpha });
  rich(ctx, rest, x0 + head + gap, y, { size:size, color:o.color, alpha:o.alpha });
  ctx.globalAlpha = 1;
}
// y tick labels drawn at the left edge (the plot's own labels clip when the y-axis is off-screen) (copied from MCV4U 04)
function edgeTicks(v, narrow){
  var s = MV.niceStep((v.ymax - v.ymin) / (narrow ? 5 : 7)), dp = Math.max(0, Math.ceil(-Math.log10(s) - 1e-9));
  return { step:s, after:function(ctx, pl){
    ctx.save(); ctx.font = "12px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
    for (var yy = Math.ceil(v.ymin / s - 1e-9) * s; yy <= v.ymax + 1e-9; yy += s) {
      var Y = pl.Y(yy), t = num(r9(yy), dp); if (Y < 10 || Y > pl.H - 24) continue;
      var w = ctx.measureText(t).width; ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(3, Y - 8, w + 6, 16); ctx.globalAlpha = 1;
      ctx.fillStyle = css("--ink-2"); ctx.fillText(t, 6, Y);
    }
    ctx.restore();
  } };
}
function xTicksFor(v, narrow){ var s = MV.niceStep((v.xmax - v.xmin) / (narrow ? 4 : 7)), dp = Math.max(0, Math.ceil(-Math.log10(s) - 1e-9)); return { step:s, fmt:function(t){ return num(r9(t), dp); } }; }

// @component V6 approachTable (copied from MCV4U 04, trimmed) — x → a from the left and from the right (a ∓ 0.1, 0.01, 0.001),
// values computed exactly in code (exactDec XQ), "undefined" where f is undefined, and the x = a line.
//   F = { q(X, x) -> XQ | null (exact; X = XQ.of(x), x the float; null = undefined), at:"(0/0)" (note after "undefined" at x = a) }
//   V6.html(F, a, {name:"f", steps}) -> left table (x → a⁻) and right table (x → a⁺), side by side (stacked on phones), then x = a.
var V6 = (function(){
  function val(F, x){ var q = F.q(XQ.of(x), x); if (!q) return { s:"undefined", undef:true }; return { s:XQ.decS(q, 9, 4), v:XQ.toNum(q) }; }
  function side(F, a, dir, o){
    var st = o.steps || [0.1, 0.01, 0.001], nm = o.name || "f", word = dir < 0 ? "left" : "right";
    var rows = st.map(function(d){
      var x = r9(a + dir * d), vv = val(F, x);
      return "<tr><td>" + ntx(x, 6) + "</td><td>" + (vv.undef ? '<span class="muted">undefined</span>' : vv.s) + "</td></tr>";
    }).join("");
    return '<div class="ct-v6s"><table class="vt ct-v6t"><caption class="vh">Values of ' + nm + "(x) as x approaches " + ntx(a) + " from the " + word + "</caption><thead>" +
      '<tr><th scope="colgroup" colspan="2" class="ct-v6h">' + m("x → " + nsrc(a) + (dir < 0 ? "^{-}" : "^{+}")) + " from the " + word + "</th></tr>" +
      '<tr><th scope="col">' + m("x") + '</th><th scope="col">' + m(nm + "(x)") + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>";
  }
  function html(F, a, o){
    o = o || {};
    var nm = o.name || "f", va = val(F, a);
    return '<div class="ct-v6"><div class="ct-v6g">' + side(F, a, -1, o) + side(F, a, 1, o) + "</div>" +
      '<p class="ct-v6at">At ' + m("x = " + nsrc(a)) + ": " + m(nm + "(" + nsrc(a) + ")") + (va.undef ? " is <strong>undefined</strong>" + (F.at ? " " + F.at : "") : " = " + va.s) + "</p></div>";
  }
  return { val:val, html:html };
})();

// @component pencilTrace — the "pencil test" engine (hero, Explore, Repair shop). A spec is
//   { tf(x) -> curve height (the pieces' formulas, ignoring single points), events:[{x, lift, kind:"hole"|"jump"|"asym"|"corner", y, side}] }
// pencilAt(sp, x, w) -> {x, y, lifted, s}: inside a lift window (x ± w) the pencil hops from one side to the other;
// drawPencil(ctx, plot, pos) draws a 6 px --ink dot, raised with a shadow and a --hi ring while lifted (clamped to the
// canvas edge, with a small arrow, when the curve is off the paper); drawEvLabels() labels the events the pencil has passed.
var EVT = { hole:"Lifted: hole", jump:"Lifted: jump", asym:"Lifted: asymptote", corner:"Corner: no lift" };
function pencilAt(sp, x, w){
  var evs = sp.events || [];
  for (var i = 0; i < evs.length; i++) {
    var e = evs[i]; if (!e.lift) continue;
    if (x > e.x - w && x < e.x + w) { var s = (x - (e.x - w)) / (2 * w), ya = sp.tf(e.x - w), yb = sp.tf(e.x + w); return { x:x, y:ya + (yb - ya) * s, lifted:true, s:s, ev:e }; }
  }
  return { x:x, y:sp.tf(x), lifted:false, s:0 };
}
function drawPencil(ctx, pl, pos){
  var X = pl.X(pos.x), Y = pl.Y(pos.y), H = pl.H, off = 0;
  if (!isFinite(Y) || Y < 9) { Y = 9; off = -1; } else if (Y > H - 9) { Y = H - 9; off = 1; }
  if (X < -10 || X > pl.W + 10) return;
  var up = pos.lifted ? Math.min(Math.sin(Math.PI * pos.s) * 16 + 6, Math.max(0, Y - 10)) : 0;
  ctx.save(); ctx.globalAlpha = 1;
  if (pos.lifted) {
    ctx.globalAlpha = 0.3; ctx.fillStyle = css("--ink-2"); ctx.beginPath(); ctx.ellipse(X, Y + 3, 8, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(X, Y - up, 11.5, 0, Math.PI * 2); ctx.fillStyle = css("--hi"); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(X, Y - up, 6.5, 0, Math.PI * 2); ctx.fillStyle = css("--ink"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--sheet"); ctx.stroke();
  if (off && !pos.lifted) { var d = off < 0 ? -1 : 1; ctx.fillStyle = css("--ink"); ctx.beginPath(); ctx.moveTo(X, Y + d * 15); ctx.lineTo(X - 5, Y + d * 9); ctx.lineTo(X + 5, Y + d * 9); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function tagText(ctx, pl, text, X, Y, align){
  ctx.save(); ctx.font = "700 13px " + (css("--font-ui") || "sans-serif");
  var w = ctx.measureText(text).width, x0 = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  x0 = Math.max(4, Math.min(pl.W - w - 4, x0)); Y = Math.max(13, Math.min(pl.H - 13, Y));
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.9; ctx.fillRect(x0 - 4, Y - 10, w + 8, 20); ctx.globalAlpha = 1;
  ctx.fillStyle = css("--ink"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(text, x0, Y);
  ctx.restore();
}
function drawEvLabels(ctx, pl, sp, upto, w){
  (sp.events || []).forEach(function(e){
    if (upto == null || upto < e.x + w) return;
    var X = pl.X(e.x), y = e.y != null ? e.y : sp.tf(e.x), Y = pl.Y(y);
    if (e.kind === "asym") tagText(ctx, pl, EVT.asym, X + 8, 46, "left");
    else if (e.kind === "jump") tagText(ctx, pl, EVT.jump, X + (e.side === "left" ? -12 : 12), Y, e.side === "left" ? "right" : "left");
    else if (e.kind === "corner") tagText(ctx, pl, EVT.corner, X, Y + 28, "center");
    else tagText(ctx, pl, EVT.hole, X, Y - 30, "center");
  });
}
function glow(ctx, pl, x, y, r){
  var X = pl.X(x), Y = Math.max(0, Math.min(pl.H, pl.Y(y)));
  ctx.save(); ctx.beginPath(); ctx.arc(X, Y, r || 17, 0, Math.PI * 2); ctx.fillStyle = css("--hi-soft"); ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = css("--hi"); ctx.stroke(); ctx.restore();
}
function passedLifts(sp, upto, w){ return (sp.events || []).filter(function(e){ return e.lift && upto != null && upto >= e.x + w; }); }

// ---------- hero storyboard: the pencil lifts at a hole (x = 1) and a jump (x = 3), not at a corner (x = 5) ----------
function hero(f){
  if (!f.canvas) return;
  var V = { xmin:-0.7, xmax:6.45, ymin:-0.45, ymax:5.25 }, p = new MV.Plot(f.canvas, V), W = 0.2;
  function L(x){ return -0.25 * (x - 1) * (x - 1) + 0.5 * (x - 1) + 2; }
  function R(x){ return x <= 5 ? 4 - 0.5 * (x - 3) : 3 + (x - 5); }
  var sp = { tf:function(x){ return x < 3 ? L(x) : R(x); },
    events:[{ x:1, lift:true, kind:"hole", y:2 }, { x:3, lift:true, kind:"jump", y:3.1, side:"left" }, { x:5, lift:false, kind:"corner", y:3 }] };
  var st = { x:null, eq:0, pulse:0, end:false }, FINAL = "Hole and jump: lifted. Corner: no lift.";
  p.render = function(){
    var pen = css("--pen");
    var sc = { view:V, xTicks:{ step:1 }, yTicks:{ step:1 },
      curves:[{ f:L, domain:[-1, 3], color:pen, width:3.2 }, { f:R, domain:[3, 7], color:pen, width:3.2 }],
      points:[{ x:1, y:2, open:true, color:pen, r:6 }, { x:3, y:2, open:true, color:pen, r:6 }, { x:3, y:4, color:pen, r:6 }] };
    sc.after = function(ctx, pl){
      if (st.pulse > 0) { ctx.save(); ctx.globalAlpha = st.pulse; ctx.lineWidth = 3; ctx.strokeStyle = css("--hi"); ctx.beginPath(); ctx.arc(pl.X(1), pl.Y(2), 13, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      drawEvLabels(ctx, pl, sp, st.end ? 99 : st.x, W);
      if (st.x != null) drawPencil(ctx, pl, pencilAt(sp, st.x, W));
      if (st.eq > 0) limCanvas(ctx, pl.X(4.85), pl.Y(1.15), "x → a", "f(x) = f(a)", { bg:true, size:18, alpha:st.eq, align:"center" });
    };
    sc.describe = "A curve with a hole (open circle) at (1, 2), a jump from an open circle at (3, 2) up to a filled dot at (3, 4), and a sharp corner at (5, 3). " +
      (st.end ? "The pencil lifted at the hole and at the jump, but turned the corner without lifting. The equation: the limit of f of x as x approaches a equals f of a." : "A pencil dot traces the curve from left to right.");
    p.draw(sc);
  };
  function finish(){ st = { x:6.2, eq:1, pulse:0, end:true }; f.cap.textContent = FINAL; p.render(); }
  if (MV.reduceMotion) { finish(); return; }
  f.cap.innerHTML = "&nbsp;"; st.x = -0.5; p.render();
  var said = {};
  MV.wait(600, function(){
    MV.tween({ dur:6400, ease:lin, step:function(t){
      st.x = -0.5 + 6.7 * t;
      if (st.x > 1 + W && !said.h) { said.h = 1; f.cap.textContent = "Lifted: hole";
        MV.tween({ dur:1300, ease:lin, step:function(u){ st.pulse = Math.abs(Math.sin(u * Math.PI * 3)); }, done:function(){ st.pulse = 0; } }); }
      if (st.x > 3 + W && !said.j) { said.j = 1; f.cap.textContent = "Lifted: jump"; }
      if (st.x > 5 && !said.c) { said.c = 1; f.cap.textContent = "Corner: no lift"; }
      p.render();
    }, done:function(){
      MV.tween({ dur:800, step:function(u){ st.eq = u; p.render(); }, done:function(){ st.end = true; MV.wait(900, function(){ f.cap.textContent = FINAL; p.render(); }); } });
    } });
  });
}

// ---------- the six Explore functions (F1–F6) ----------
var XR = [-2, 4];
var FKEYS = ["f", "g", "h", "k", "m", "p"];
var FSPEC = {
  f:{ nm:"f", a:2, chip:"`f(x) = (x^2 - 4)/(x - 2)`", txt:"f(x) = (x² − 4)/(x − 2)", eq:function(){ return m("f(x) = {x^2 - 4}/{x - 2}"); },
    tf:function(x){ return x + 2; }, pieces:[{ f:function(x){ return x + 2; } }],
    q:function(X, x){ return x === 2 ? null : XQ.div(XQ.sub(XQ.mul(X, X), 4), XQ.sub(X, 2)); }, at:"(0/0)",
    holes:[[2, 4]], dots:[], lL:4, lR:4, fa:null, ylim:[-1.5, 7.5], events:[{ x:2, lift:true, kind:"hole", y:4 }] },
  g:{ nm:"g", a:2, chip:"`g`: the same, but `g(2) = 1`", txt:"g(x) = (x² − 4)/(x − 2) for x ≠ 2, with g(2) = 1", eq:function(){ return m("g(x) =") + " " + pw([["{x^2 - 4}/{x - 2}", "x ≠ 2"], ["1", "x = 2"]]); },
    tf:function(x){ return x + 2; }, pieces:[{ f:function(x){ return x + 2; } }],
    q:function(X, x){ return x === 2 ? XQ.of(1) : XQ.div(XQ.sub(XQ.mul(X, X), 4), XQ.sub(X, 2)); },
    holes:[[2, 4]], dots:[[2, 1]], lL:4, lR:4, fa:1, ylim:[-1.5, 7.5], events:[{ x:2, lift:true, kind:"hole", y:4 }] },
  h:{ nm:"h", a:1, chip:"`h`: two pieces", txt:"h(x) = x + 1 for x < 1, and x − 2 for x ≥ 1", eq:function(){ return m("h(x) =") + " " + pw([["x + 1", "x < 1"], ["x - 2", "x ≥ 1"]]); },
    tf:function(x){ return x < 1 ? x + 1 : x - 2; }, pieces:[{ f:function(x){ return x + 1; }, domain:[-50, 1] }, { f:function(x){ return x - 2; }, domain:[1, 50] }],
    q:function(X, x){ return x < 1 ? XQ.add(X, 1) : XQ.sub(X, 2); },
    holes:[[1, 2]], dots:[[1, -1]], lL:2, lR:-1, fa:-1, ylim:[-3.5, 4.5], events:[{ x:1, lift:true, kind:"jump", y:0.5 }] },
  k:{ nm:"k", a:1, chip:"`k(x) = 1/(x - 1)^2`", txt:"k(x) = 1/(x − 1)²", eq:function(){ return m("k(x) = {1}/{(x - 1)^2}"); },
    tf:function(x){ return 1 / ((x - 1) * (x - 1)); },
    pieces:[{ f:function(x){ return 1 / ((x - 1) * (x - 1)); }, domain:[-50, 0.9995] }, { f:function(x){ return 1 / ((x - 1) * (x - 1)); }, domain:[1.0005, 50] }],
    q:function(X, x){ if (x === 1) return null; var d = XQ.sub(X, 1); return XQ.div(1, XQ.mul(d, d)); }, at:"(1/0)",
    asym:1, holes:[], dots:[], lL:Infinity, lR:Infinity, fa:null, ylim:[-1, 8], events:[{ x:1, lift:true, kind:"asym" }] },
  m:{ nm:"m", a:1, chip:"`m(x) = |x - 1| + 1`", txt:"m(x) = |x − 1| + 1", eq:function(){ return m("m(x) = |x - 1| + 1"); },
    tf:function(x){ return Math.abs(x - 1) + 1; }, pieces:[{ f:function(x){ return Math.abs(x - 1) + 1; } }],
    q:function(X){ var d = XQ.sub(X, 1); return XQ.add(XQ.sign(d) < 0 ? XQ.neg(d) : d, 1); },
    holes:[], dots:[], lL:1, lR:1, fa:1, corner:true, ylim:[-0.5, 5.5], events:[{ x:1, lift:false, kind:"corner", y:1 }] },
  p:{ nm:"p", a:1, chip:"`p(x) = x^3 - 3x`", txt:"p(x) = x³ − 3x", eq:function(){ return m("p(x) = x^3 - 3x"); },
    tf:function(x){ return x * x * x - 3 * x; }, pieces:[{ f:function(x){ return x * x * x - 3 * x; } }],
    q:function(X){ return XQ.sub(XQ.mul(X, XQ.mul(X, X)), XQ.mul(3, X)); },
    holes:[], dots:[], lL:-2, lR:-2, fa:-2, ylim:[-4, 6], events:[] }
};
// Builder (TC2, TC3): two pieces x² + c | 3x − 1, or three pieces x + a | bx² | 2x + 4
function buildSpec(S){
  if (S.bk !== "three") {
    var c = S.c, lL = r9(1 + c), ok = close(lL, 2);
    return { nm:"f", a:1, build:"two", txt:"f(x) = x² " + (c < 0 ? "− " + ntx(-c) : "+ " + ntx(c)) + " for x < 1, and 3x − 1 for x ≥ 1",
      eq:function(){ return m("f(x) =") + " " + pw([[plus("x^2", c), "x < 1"], ["3x - 1", "x ≥ 1"]]); },
      tf:function(x){ return x < 1 ? x * x + c : 3 * x - 1; },
      pieces:[{ f:function(x){ return x * x + c; }, domain:[-50, 1] }, { f:function(x){ return 3 * x - 1; }, domain:[1, 50] }],
      holes:ok ? [] : [[1, lL]], dots:[[1, 2]], lL:lL, lR:2, fa:2, ylim:[-6.5, 12.5],
      joins:[{ x:1, lL:lL, fa:2, left:m("1^2 + c") + " = " + ntx(lL), val:m("f(1) = 3(1) - 1") + " = 2" }],
      events:[ok ? { x:1, lift:false, kind:"corner", y:2 } : { x:1, lift:true, kind:"jump", y:(lL + 2) / 2 }] };
  }
  var a = S.ba, b = S.bb, l1 = r9(1 + a), l2 = r9(4 * b), ok1 = close(l1, b), ok2 = close(l2, 8), ev = [], holes = [];
  if (!ok1) { holes.push([1, l1]); ev.push({ x:1, lift:true, kind:"jump", y:(l1 + b) / 2 }); } else if (!close(2 * b, 1)) ev.push({ x:1, lift:false, kind:"corner", y:b });
  if (!ok2) { holes.push([2, l2]); ev.push({ x:2, lift:true, kind:"jump", y:(l2 + 8) / 2 }); } else if (!close(4 * b, 2)) ev.push({ x:2, lift:false, kind:"corner", y:8 });
  return { nm:"f", a:1, build:"three", txt:"f(x) = x " + (a < 0 ? "− " + ntx(-a) : "+ " + ntx(a)) + " for x < 1, " + ntx(b) + "x² for 1 ≤ x < 2, and 2x + 4 for x ≥ 2",
    eq:function(){ return m("f(x) =") + " " + pw([[plus("x", a), "x < 1"], [coefSrc(b, "x^2"), "1 ≤ x < 2"], ["2x + 4", "x ≥ 2"]]); },
    tf:function(x){ return x < 1 ? x + a : x < 2 ? b * x * x : 2 * x + 4; },
    pieces:[{ f:function(x){ return x + a; }, domain:[-50, 1] }, { f:function(x){ return b * x * x; }, domain:[1, 2] }, { f:function(x){ return 2 * x + 4; }, domain:[2, 50] }],
    holes:holes, dots:[[1, b], [2, 8]], lL:l1, lR:b, fa:b, ylim:[-8.5, 14.5],
    joins:[{ x:1, lL:l1, fa:b, left:m("1 + a") + " = " + ntx(l1), val:m("f(1) = b(1)^2") + " = " + ntx(b) },
           { x:2, lL:l2, fa:8, left:m("b(2)^2 = 4b") + " = " + ntx(l2), val:m("f(2) = 2(2) + 4") + " = 8" }],
    events:ev };
}
function classify(sp){
  if (!isFinite(sp.lL) || !isFinite(sp.lR)) return "infinite";
  if (!close(sp.lL, sp.lR)) return "jump";
  if (sp.fa == null || !close(sp.fa, sp.lL)) return "removable";
  return "continuous";
}
var KIND = { removable:"Removable", jump:"Jump", infinite:"Infinite" };
function sideTxt(L){ return L === Infinity ? "∞" : L === -Infinity ? MINUS + "∞" : ntx(L); }
function verdictOf(sp){ var c = classify(sp); return c === "continuous" ? "Continuous at " + m("x = " + sp.a) : KIND[c] + " discontinuity at " + m("x = " + sp.a); }
function smoothOf(sp){ return classify(sp) !== "continuous" ? dash() : sp.corner ? "Corner at " + m("x = " + sp.a) + ": continuous, but not smooth" : "Yes"; }

// ---------- Explore: the pencil test ----------
var PSTART = { p1:{ fn:"f", mode:"trace" }, p2:{ fn:"g", mode:"check" }, p3:{ fn:"h", mode:"trace" }, p4:{ fn:"m", mode:"trace" } };
function explore(host, api){
  var S = api.S;
  S.fn = FSPEC[S.fn] ? S.fn : "f"; S.mode = ["trace", "check", "build"].indexOf(S.mode) >= 0 ? S.mode : "trace";
  S.speed = S.speed === "fast" ? "fast" : "slow"; S.zoom = [1, 4, 16].indexOf(S.zoom) >= 0 ? S.zoom : 1; S.bk = S.bk === "three" ? "three" : "two";
  S.c = typeof S.c === "number" ? S.c : 0; S.ba = typeof S.ba === "number" ? S.ba : 0; S.bb = typeof S.bb === "number" ? S.bb : 1; S.tx = null;
  var A = { zoom:null, ghost:null, pulse:0, reveal:null, running:false, ban:"", cardOpen:true }, anim = null, zAnim = null, locked = false;
  var L = MV.pgLayout(host, { aria:"Pencil test graph" });
  var pg = L.graph.parentNode; pg.classList.add("ct-ex");
  var pwrap = $(".plot-wrap", L.graph);
  var tview = document.createElement("div"); tview.className = "ct-tview"; pwrap.parentNode.insertBefore(tview, pwrap.nextSibling);
  var det = document.createElement("details"); det.className = "ct-rd"; det.open = true;
  var sumEl = document.createElement("summary"); det.appendChild(sumEl); L.read.parentNode.insertBefore(det, L.read); det.appendChild(L.read);
  function sl(key, label, aria){ return '<label class="slider ct-sl" data-sk="' + key + '"><span class="slider-top"><span>' + label + '</span><output class="ct-out"></output></span><input type="range" data-bs="' + key + '" min="-5" max="5" step="0.5" style="accent-color:var(--ink)" aria-label="' + aria + '"></label>'; }
  L.ctrl.innerHTML = '<div class="chips ct-fns" data-for="trace check" role="group" aria-label="Function"></div>' +
    '<div class="ct-mode"></div>' +
    '<div class="ct-bk" data-for="build"></div>' +
    '<div class="ct-sls" data-for="build">' + sl("c", m("c") + ' <span class="tiny muted">(in ' + m("x^2 + c") + ")</span>", "c, from −5 to 5") + sl("ba", m("a") + ' <span class="tiny muted">(in ' + m("x + a") + ")</span>", "a, from −5 to 5") + sl("bb", m("b") + ' <span class="tiny muted">(in ' + m("bx^2") + ")</span>", "b, from −5 to 5") + '<p class="tiny muted ct-shift">Arrow keys move a slider by 0.5; hold Shift for steps of 2.</p></div>' +
    '<div class="ct-tr" data-for="trace build" role="group" aria-label="Pencil"><button type="button" class="btn primary sm" data-tr="play" data-k="ctplay">Trace</button><button type="button" class="btn ghost sm" data-tr="step" data-k="ctstep">Step</button><button type="button" class="btn ghost sm" data-tr="reset" data-k="ctreset">Reset</button></div>' +
    '<div class="ct-speed" data-for="trace build"></div>' +
    '<div class="ct-zoom"></div>';
  var plot = new MV.Plot(L.canvas, { xmin:-2.45, xmax:4.45, ymin:-2, ymax:8 });
  function q(sel){ return $(sel, host); }
  function spec(){ return S.mode === "build" ? buildSpec(S) : FSPEC[S.fn]; }
  function zNow(){ return A.zoom != null ? A.zoom : S.zoom; }
  function wNow(){ return 0.15 / zNow(); }
  function save(){ api.save(); MV.changed(); }
  function stop(){ if (anim) { var a = anim; anim = null; a(); } A.running = false; }

  // ---- geometry and drawing ----
  function viewOf(sp){
    var base = { xmin:-2.45, xmax:4.45, ymin:sp.ylim[0], ymax:sp.ylim[1] }, z = zNow();
    if (z <= 1.001) return base;
    var hw = 3.45 / z, keys = [sp.lL, sp.lR, sp.fa].filter(function(v){ return v != null && isFinite(v); });
    if (!keys.length) return { xmin:sp.a - hw, xmax:sp.a + hw, ymin:sp.ylim[0] * z, ymax:sp.ylim[1] * z };
    var lo = Math.min.apply(null, keys), hi = Math.max.apply(null, keys), cy = (lo + hi) / 2, hh = Math.max((base.ymax - base.ymin) / 2 / z, (hi - lo) / 2 * 1.6);
    return { xmin:sp.a - hw, xmax:sp.a + hw, ymin:cy - hh, ymax:cy + hh };
  }
  function draw(){
    var sp = spec(), v = viewOf(sp), W = L.canvas.getBoundingClientRect().width || 600, narrow = W < 420, z = zNow(), zoomed = z > 1.01, pen = css("--pen"), w = wNow();
    var sc = { view:v, curves:[], asymptotes:[], points:[] };
    sp.pieces.forEach(function(p){ sc.curves.push({ f:p.f, domain:p.domain, color:pen, width:3 }); });
    if (sp.asym != null) sc.asymptotes.push({ x:sp.asym, label:"x = " + sp.asym });
    sp.holes.forEach(function(h){ sc.points.push({ x:h[0], y:h[1], open:true, color:pen, r:5.5 }); });
    sp.dots.forEach(function(d){ sc.points.push({ x:d[0], y:d[1], color:pen, r:5.5 }); });
    var et = zoomed ? edgeTicks(v, narrow) : null;
    if (zoomed) { sc.xTicks = xTicksFor(v, narrow); sc.yTicks = { step:et.step, fmt:function(){ return ""; } }; }
    else { sc.xTicks = { step:1 }; sc.yTicks = { step:v.ymax - v.ymin > 16 ? 4 : v.ymax - v.ymin > 9 ? 2 : 1 }; }
    sc.after = function(ctx, pl){
      if (et) et.after(ctx, pl);
      if (A.pulse > 0 && sp.holes.length) { ctx.save(); ctx.globalAlpha = A.pulse; ctx.lineWidth = 3; ctx.strokeStyle = css("--hi"); ctx.beginPath(); ctx.arc(pl.X(sp.holes[0][0]), pl.Y(sp.holes[0][1]), 13, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      if (A.ghost) drawGhost(ctx, pl, sp);
      if (!A.ghost) drawEvLabels(ctx, pl, sp, S.tx, w);
      if (S.tx != null) drawPencil(ctx, pl, pencilAt(sp, S.tx, w));
    };
    var d = "Graph of " + sp.txt + ".";
    sp.holes.forEach(function(h){ d += " Hole (open circle) at (" + ntx(h[0]) + ", " + ntx(h[1]) + ")."; });
    sp.dots.forEach(function(h){ d += " Filled dot at (" + ntx(h[0]) + ", " + ntx(h[1]) + ")."; });
    if (sp.asym != null) d += " Vertical asymptote x = " + sp.asym + ".";
    (sp.events || []).forEach(function(e){ if (e.kind === "corner") d += " Corner at x = " + ntx(e.x) + "."; });
    if (S.tx != null) { var lifts = passedLifts(sp, S.tx, w); d += " The pencil is at x = " + ntx(S.tx, 2) + (lifts.length ? "; it lifted at " + lifts.map(function(e){ return "x = " + ntx(e.x); }).join(" and ") : "") + "."; }
    if (zoomed) d += " Zoomed in ×" + Math.round(z) + " around x = " + sp.a + ".";
    sc.describe = d;
    plot.draw(sc);
  }
  plot.render = draw;
  function drawGhost(ctx, pl, sp){
    var g = A.ghost, X = pl.X(g.x), ink2 = css("--ink-2");
    ctx.save(); ctx.setLineDash([5, 5]); ctx.lineWidth = 1.6; ctx.strokeStyle = ink2;
    [sp.lL, sp.lR].forEach(function(yy){ ctx.beginPath(); ctx.moveTo(X - 60, pl.Y(yy)); ctx.lineTo(X + 60, pl.Y(yy)); ctx.stroke(); });
    ctx.setLineDash([]); ctx.beginPath(); ctx.arc(X, pl.Y(g.y), 7, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = css("--ink"); ctx.stroke();
    ctx.restore();
    tagText(ctx, pl, "left side → 2", X - 66, pl.Y(sp.lL), "right");
    tagText(ctx, pl, "right side → " + MINUS + "1", X + 66, pl.Y(sp.lR), "left");
    tagText(ctx, pl, "h(1) = " + ntx(g.y, 2) + ": touches " + (close(g.y, sp.lL, 0.02) ? "only the left side" : close(g.y, sp.lR, 0.02) ? "only the right side" : "neither side"), X, pl.H - 18, "center");
  }

  // ---- readout (the checklist) and the approach table ----
  function pencilRow(sp){
    if (S.tx == null) return '<span class="muted">Press <strong>Trace</strong> or <strong>Step</strong>.</span>';
    if (A.running) return "Tracing…";
    var w = wNow(), lifts = passedLifts(sp, S.tx, w), atEnd = S.tx >= XR[1] - 1e-9;
    if (lifts.length) return "Lifted at " + lifts.map(function(e){ return m("x = " + nsrc(e.x)); }).join(" and ") + (atEnd ? "" : " (so far)");
    var cur = pencilAt(sp, S.tx, w);
    if (cur.lifted) return "Lifting at " + m("x = " + nsrc(cur.ev.x)) + "…";
    return atEnd ? "Never lifted from " + m("x = -2") + " to " + m("x = 4") : "No lift so far (at " + m("x = " + nsrc(r9(Math.round(S.tx * 100) / 100))) + ")";
  }
  function rowsFor(sp){
    if (sp.build) {
      var rows = [["Function", sp.build === "two" ? "Two pieces, " + m("c = " + nsrc(S.c)) : "Three pieces, " + m("a = " + nsrc(S.ba)) + ", " + m("b = " + nsrc(S.bb))]];
      var bad = [];
      sp.joins.forEach(function(j){
        var ok = close(j.lL, j.fa); if (!ok) bad.push(j.x);
        rows.push(["Join at " + m("x = " + j.x), "Left → " + j.left + "; " + j.val + "<br>" + (ok ? yes("the pieces meet") : no("the pieces don’t meet: a jump"))]);
      });
      if (S.mode === "build" && S.tx != null) rows.push(["Pencil", pencilRow(sp)]);
      rows.push(["Verdict", "<strong>" + (bad.length ? "Jump discontinuit" + (bad.length > 1 ? "ies" : "y") + " at " + bad.map(function(x){ return m("x = " + x); }).join(" and ") : "Continuous everywhere") + "</strong>"]);
      return rows;
    }
    var a = sp.a, nm = sp.nm, head = [["Function and point", m(nm) + " at " + m("x = " + a)]];
    if (S.mode === "trace") {
      var passed = S.tx != null && !A.running && S.tx >= a + wNow();
      return head.concat([["Pencil", pencilRow(sp)], ["Verdict", passed ? "<strong>" + verdictOf(sp) + "</strong>" : '<span class="muted">Trace past ' + m("x = " + a) + " to see.</span>"], ["Smooth?", passed ? smoothOf(sp) : dash()]]);
    }
    var fa = m(nm + "(" + a + ")"), limEx = classify(sp) === "continuous" || classify(sp) === "removable";
    var r1 = sp.fa == null ? no(fa + " is undefined " + sp.at) : yes(m(nm + "(" + a + ") = " + nsrc(sp.fa)));
    var r2 = limEx ? yes("left → " + ntx(sp.lL) + ", right → " + ntx(sp.lR) + ", so the limit is " + ntx(sp.lL)) : no("left → " + sideTxt(sp.lL) + ", right → " + sideTxt(sp.lR) + (isFinite(sp.lL) ? "" : ": no limit"));
    var r3 = (sp.fa == null || !limEx) ? dash("(can’t compare)") : close(sp.fa, sp.lL) ? yes(ntx(sp.lL) + " = " + ntx(sp.fa)) : no(ntx(sp.lL) + " ≠ " + ntx(sp.fa));
    var rows2 = [["1. " + m("f(a)") + " defined?", r1], ["2. Limit exists?", r2], ["3. Limit = " + m("f(a)") + "?", r3], ["Verdict", "<strong>" + verdictOf(sp) + "</strong>"], ["Smooth?", smoothOf(sp)]];
    if (A.reveal != null) rows2 = rows2.map(function(r, i){ return i >= A.reveal ? [r[0], '<span class="muted">…</span>'] : r; });
    return head.concat(rows2);
  }
  var lastRead = "";
  function paintRead(){
    var sp = spec(), h = MV.readoutHTML(rowsFor(sp));
    sumEl.textContent = S.mode === "check" ? "Checklist" : S.mode === "build" ? "Builder checklist" : "Pencil report";
    if (h !== lastRead) { L.read.innerHTML = h; lastRead = h; }
  }
  function paintTable(){
    if (S.mode !== "check") { tview.innerHTML = ""; return; }
    var sp = spec();
    tview.innerHTML = '<details class="ct-card"' + (A.cardOpen ? " open" : "") + "><summary>Approach table: " + m("x → " + sp.a) + "</summary>" + V6.html(sp, sp.a, { name:sp.nm }) + '<p class="tiny muted ct-v6n">Computed exactly by the tool.</p></details>';
    $("details", tview).addEventListener("toggle", function(e){ A.cardOpen = e.target.open; });
  }

  // ---- banner ----
  function bannerTick(final){
    var sp = spec(), w = wNow(), lifts = passedLifts(sp, S.tx, w), txt = A.ban;
    var where = lifts.map(function(e){ return "x = " + ntx(e.x); }).join(" and ");
    if (final) {
      var corner = (sp.events || []).filter(function(e){ return e.kind === "corner"; })[0];
      txt = lifts.length ? "The pencil lifted at " + where + ": discontinuous there." : corner ? "The pencil turned the corner at x = " + ntx(corner.x) + " without lifting." : "The pencil never lifted between x = −2 and x = 4.";
    } else if (lifts.length) txt = "The pencil lifted at " + where + ".";
    if (txt !== A.ban) { A.ban = txt; MV.banner("", txt); paintRead(); }
  }

  // ---- trace controls ----
  function runTo(to, dur, cb){
    stop();
    if (S.tx == null || S.tx >= to - 1e-9) S.tx = XR[0];
    var from = S.tx; A.running = true; A.ban = ""; paintCtl(); paintRead();
    anim = MV.tween({ dur:dur, ease:lin, step:function(t){ S.tx = from + (to - from) * t; draw(); bannerTick(false); },
      done:function(){ anim = null; A.running = false; S.tx = to; api.save(); bannerTick(to >= XR[1] - 1e-9); paint(); if (cb) cb(); } });
    if (A.running) paintCtl();
  }
  function fullDur(from){ return (XR[1] - from) / (XR[1] - XR[0]) * (S.speed === "fast" ? 3200 : 8000); }
  function play(){
    if (A.running) { stop(); paint(); return; }
    var from = (S.tx == null || S.tx >= XR[1] - 1e-9) ? XR[0] : S.tx;
    if (S.tx != null && S.tx >= XR[1] - 1e-9) S.tx = null;
    runTo(XR[1], fullDur(from));
  }
  function stepOnce(){
    if (A.running) stop();
    if (S.tx == null) { S.tx = XR[0]; A.ban = ""; MV.banner("", ""); save(); paint(); return; }
    if (S.tx >= XR[1] - 1e-9) return;
    var to = Math.min(XR[1], r9(Math.floor(S.tx / 0.5 + 1e-9) * 0.5 + 0.5)), from = S.tx;
    A.running = true; paintCtl();
    anim = MV.tween({ dur:280, ease:lin, step:function(t){ S.tx = from + (to - from) * t; draw(); },
      done:function(){ anim = null; A.running = false; S.tx = to; save(); bannerTick(to >= XR[1] - 1e-9); paint(); } });
  }
  function resetTrace(){ stop(); S.tx = null; A.ban = ""; MV.banner("", ""); save(); paint(); }
  function zoomTo(z){
    if (zAnim) { zAnim(); zAnim = null; }
    var from = zNow(); S.zoom = z; api.save();
    zAnim = MV.tween({ dur:700, step:function(t){ A.zoom = from * Math.pow(z / from, t); draw(); }, done:function(){ zAnim = null; A.zoom = null; paint(); } });
  }
  function setMode(v){
    stop(); var was = S.mode; S.mode = v;
    if ((was === "build") !== (v === "build")) { S.tx = null; A.ban = ""; MV.banner("", ""); }
    save(); paint();
  }

  // ---- controls ----
  var segMode = MV.seg(q(".ct-mode"), { label:"Mode:", value:S.mode, options:[{ id:"trace", t:"Trace" }, { id:"check", t:"Checklist" }, { id:"build", t:"Builder" }],
    onChange:function(v){ if (locked) { segMode.set(S.mode); return; } setMode(v); } });
  var segBk = MV.seg(q(".ct-bk"), { label:"Builder:", value:S.bk, options:[{ id:"two", t:"Two pieces" }, { id:"three", t:"Three pieces" }],
    onChange:function(v){ if (locked) { segBk.set(S.bk); return; } stop(); S.bk = v; S.tx = null; A.ban = ""; MV.banner("", ""); save(); paint(); } });
  var segSp = MV.seg(q(".ct-speed"), { label:"Speed:", value:S.speed, options:[{ id:"slow", t:"Slow" }, { id:"fast", t:"Fast" }],
    onChange:function(v){ if (locked) { segSp.set(S.speed); return; } S.speed = v; api.save(); if (A.running) { stop(); play(); } } });
  var segZ = MV.seg(q(".ct-zoom"), { label:"Zoom around the point:", value:String(S.zoom), options:[{ id:"1", t:"×1" }, { id:"4", t:"×4" }, { id:"16", t:"×16" }],
    onChange:function(v){ if (locked) { segZ.set(String(S.zoom)); return; } zoomTo(+v); } });
  q(".ct-fns").addEventListener("click", function(e){
    var b = e.target.closest("[data-fn]"); if (!b || locked) return;
    stop(); if (S.fn !== b.dataset.fn) { S.fn = b.dataset.fn; S.tx = null; A.ban = ""; MV.banner("", ""); } save(); paint();
  });
  q(".ct-tr").addEventListener("click", function(e){
    var b = e.target.closest("[data-tr]"); if (!b || b.disabled || locked) return;
    if (b.dataset.tr === "play") play(); else if (b.dataset.tr === "step") stepOnce(); else resetTrace();
  });
  function setSlider(key, v){ v = Math.max(-5, Math.min(5, Math.round(v * 2) / 2)); if (S[key] === v) return; S[key] = r9(v); A.ban = ""; MV.banner("", ""); stop(); save(); paint(); }
  q(".ct-sls").addEventListener("input", function(e){ var k = e.target.dataset.bs; if (!k) return; if (locked) { e.target.value = S[k]; return; } setSlider(k, +e.target.value); });
  q(".ct-sls").addEventListener("keydown", function(e){
    var k = e.target.dataset && e.target.dataset.bs; if (!k || !e.shiftKey || locked) return;
    var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0; if (!d) return;
    e.preventDefault(); setSlider(k, S[k] + d * 2); e.target.value = S[k];
  });
  function paintCtl(){
    MV.keepFocus(q(".ct-fns"), function(){ q(".ct-fns").innerHTML = FKEYS.map(function(k){ return '<button type="button" class="fchip ct-fc" data-fn="' + k + '" data-k="ctfn' + k + '" aria-pressed="' + (S.fn === k) + '">' + md(FSPEC[k].chip) + "</button>"; }).join(""); });
    $$("[data-for]", L.ctrl).forEach(function(el){ el.hidden = el.dataset.for.split(" ").indexOf(S.mode) < 0; });
    $$("[data-sk]", host).forEach(function(el){ var k = el.dataset.sk; el.hidden = S.bk === "two" ? k !== "c" : k === "c"; $("input", el).value = S[k]; $("output", el).textContent = ntx(S[k]); });
    segMode.set(S.mode); segBk.set(S.bk); segSp.set(S.speed); segZ.set(String(S.zoom));
    var bp = $('[data-tr="play"]', host), bs = $('[data-tr="step"]', host), br = $('[data-tr="reset"]', host);
    bp.textContent = A.running && anim && !MV.reduceMotion ? "Pause" : "Trace";
    bs.disabled = S.tx != null && S.tx >= XR[1] - 1e-9; br.disabled = S.tx == null;
  }
  function paint(){
    var sp = spec();
    L.cap.innerHTML = sp.eq() + ' <span class="ct-at">at ' + m("x = " + sp.a) + (sp.build === "three" ? " and " + m("x = 2") : "") + "</span>";
    paintCtl(); paintTable(); paintRead(); draw();
  }
  paint();

  // ---- predictions and challenges ----
  function apply(st){
    stop(); if (zAnim) { zAnim(); zAnim = null; }
    S.fn = st.fn; S.mode = st.mode; S.zoom = 1; A.zoom = null; S.tx = null; A.ghost = null; A.pulse = 0; A.reveal = null; A.ban = ""; MV.banner("", "");
    save(); paint();
  }
  function lock(v){ locked = !!v; host.classList.toggle("ct-locked", locked); }
  function chal(id){
    if (id === "tc1") {
      var f = S.fn;
      if (f === "g") return { ok:true };
      if (f === "f") return { ok:false, msg:md("`f(2)` is undefined, so row 1 fails.") };
      if (f === "h") return { ok:false, msg:"The limit at 1 doesn’t exist: left → 2, right → " + MINUS + "1." };
      if (f === "k") return { ok:false, msg:"The right side → ∞: no limit." };
      return { ok:false, msg:md("That one is continuous at `a`.") };
    }
    if (id === "tc2") {
      var c = S.c;
      if (close(c, 1)) return { ok:true };
      if (close(c, 2)) return { ok:false, msg:md("The left side now arrives at 3, but `f(1) = 3(1) - 1 = 2`.") };
      if (close(c, 0)) return { ok:false, msg:md("Left → 1, but `f(1) = 2`: a jump of 1.") };
      return { ok:false, msg:md("The pencil still lifts at `x = 1`. Compare the two heights in the checklist.") };
    }
    if (id === "tc3") {
      var a = S.ba, b = S.bb;
      if (close(a, 1) && close(b, 2)) return { ok:true };
      if (close(b, 2)) return { ok:false, msg:md("`x = 2` joins now, but `x = 1` still jumps.") };
      if (close(b, 4)) return { ok:false, msg:md("At `x = 2`, `bx^2 = 4b`, which must equal 2(2) + 4 = 8.") };
      if (close(a, 1)) return { ok:false, msg:md("`a` depends on `b`. Fix the join at `x = 2` first.") };
      return { ok:false, msg:md("The pencil still lifts. Compare the heights at both joins in the checklist (Builder, Three pieces).") };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){ lock(false); apply(PSTART[p.id]); lock(true); },
      run:function(p, done){
        var fin = function(){ A.ghost = null; A.pulse = 0; A.reveal = null; lock(false); paint(); done(); };
        if (p.id === "p2") {
          A.reveal = 0; paintRead();
          var n = 0;
          (function next(){ n++; A.reveal = n; paintRead(); if (n >= 5) { A.reveal = null; paintRead(); MV.wait(500, fin); } else MV.wait(n === 1 ? 500 : 750, next); })();
          return;
        }
        runTo(XR[1], 3600, function(){
          if (p.id === "p1") { MV.tween({ dur:1400, ease:lin, step:function(u){ A.pulse = Math.abs(Math.sin(u * Math.PI * 3)); draw(); }, done:function(){ A.pulse = MV.reduceMotion ? 1 : 0; draw(); MV.wait(300, fin); } }); return; }
          if (p.id === "p3") {
            A.ghost = { x:1, y:-1 }; draw();
            MV.tween({ dur:1600, step:function(u){ A.ghost.y = -1 + 3 * u; draw(); }, done:function(){
              MV.tween({ dur:800, step:function(u){ A.ghost.y = 2 - 1.5 * u; draw(); }, done:function(){ MV.wait(MV.reduceMotion ? 50 : 900, fin); } });
            } });
            return;
          }
          MV.wait(400, fin);
        });
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: the Repair shop ----------
var MENU = [{ id:"point", t:"Redefine one point" }, { id:"const", t:"Choose a constant" }, { id:"none", t:"Can’t be repaired" }];
var STN = {
  s1:{ a:3, ok:"point", view:{ xmin:-1.3, xmax:6.3, ymin:-0.8, ymax:9.6 }, eq:function(){ return m("f(x) = {x^2 - 9}/{x - 3}"); }, txt:"f(x) = (x² − 9)/(x − 3)" },
  s2:{ a:-1, ok:"const", view:{ xmin:-3.6, xmax:2.3, ymin:-8, ymax:6.5 }, eq:function(R){ return m("f(x) =") + " " + pw([["2x + k", "x < -1"], ["x^2", "x ≥ -1"]]) + ' <span class="ct-at">with ' + m("k = " + nsrc(R.k)) + "</span>"; }, txt:"f(x) = 2x + k for x < −1, and x² for x ≥ −1" },
  s3a:{ a:2, ok:"none", view:{ xmin:-1.3, xmax:5.3, ymin:-6, ymax:6 }, eq:function(){ return m("f(x) = {1}/{x - 2}"); }, txt:"f(x) = 1/(x − 2)" },
  s3b:{ a:0, ok:"none", view:{ xmin:-3.3, xmax:3.3, ymin:-2.6, ymax:2.6 }, eq:function(){ return m("f(x) =") + " " + pw([["-1", "x < 0"], ["1", "x ≥ 0"]]); }, txt:"the step function f(x) = −1 for x < 0, and 1 for x ≥ 0" },
  s4:{ a:1, ok:"const", view:{ xmin:-1.6, xmax:3.3, ymin:-4, ymax:7 }, eq:function(R){ return m("f(x) =") + " " + pw([["x^2", "x < 1"], ["mx + b", "x ≥ 1"]]) + ' <span class="ct-at">with ' + m("m = " + nsrc(R.m)) + ", " + m("b = " + nsrc(R.b)) + "</span>"; }, txt:"f(x) = x² for x < 1, and mx + b for x ≥ 1" }
};
// station spec from its repair state R
function stSpec(id, R){
  if (id === "s1") {
    var y1 = R.menu === "point" ? R.y : null, fx1 = y1 != null && close(y1, 6);
    return { tf:function(x){ return x + 3; }, pieces:[{ f:function(x){ return x + 3; } }], holes:fx1 ? [] : [[3, 6]], dots:[],
      glow:fx1 ? null : [3, 6], fixed:fx1, events:fx1 ? [] : [{ x:3, lift:true, kind:"hole", y:6 }] };
  }
  if (id === "s2") {
    var k = R.k, l2 = r9(-2 + k), fx2 = close(l2, 1);
    return { tf:function(x){ return x < -1 ? 2 * x + k : x * x; }, pieces:[{ f:function(x){ return 2 * x + k; }, domain:[-50, -1] }, { f:function(x){ return x * x; }, domain:[-1, 50] }],
      holes:fx2 ? [] : [[-1, l2]], dots:[[-1, 1]], glow:fx2 ? null : [-1, (l2 + 1) / 2], fixed:fx2, lL:l2,
      events:[fx2 ? { x:-1, lift:false, kind:"corner", y:1 } : { x:-1, lift:true, kind:"jump", y:(l2 + 1) / 2 }] };
  }
  if (id === "s3a") {
    var g = function(x){ return 1 / (x - 2); };
    return { tf:g, pieces:[{ f:g, domain:[-50, 1.9995] }, { f:g, domain:[2.0005, 50] }], asym:2, holes:[], dots:[],
      glow:[2, 0], fixed:false, events:[{ x:2, lift:true, kind:"asym" }] };
  }
  if (id === "s3b") {
    var pt = R.menu === "point";
    return { tf:function(x){ return x < 0 ? -1 : 1; }, pieces:[{ f:function(){ return -1; }, domain:[-50, 0] }, { f:function(){ return 1; }, domain:[0, 50] }],
      holes:pt ? [[0, -1], [0, 1]] : [[0, -1]], dots:pt ? [] : [[0, 1]], glow:[0, 0], fixed:false, events:[{ x:0, lift:true, kind:"jump", y:0, side:"left" }] };
  }
  var mm = R.m, bb = R.b, h = r9(mm + bb), cont = close(h, 1), smooth = cont && close(mm, 2);
  return { tf:function(x){ return x < 1 ? x * x : mm * x + bb; }, pieces:[{ f:function(x){ return x * x; }, domain:[-50, 1] }, { f:function(x){ return mm * x + bb; }, domain:[1, 50] }],
    holes:cont ? [] : [[1, 1]], dots:[[1, h]], glow:cont ? null : [1, (1 + h) / 2], fixed:cont, cont:cont, smooth:smooth, corner:cont && !smooth, h:h,
    events:cont ? (smooth ? [] : [{ x:1, lift:false, kind:"corner", y:1 }]) : [{ x:1, lift:true, kind:"jump", y:(1 + h) / 2 }] };
}
var ALG = {
  s1:'<div class="alg-lines"><span>1. `f(3) = {0}/{0}`: undefined until you define it.</span><span>2. ' + "LIMS(x → 3) `{x^2 - 9}/{x - 3} =` LIMS(x → 3) `(x + 3) = 6`: the limit exists.</span><span>3. LIMS(x → 3) `(x + 3) = 6`, so define `f(3) = 6`.</span></div>",
  s2:'<div class="alg-lines"><span>1. `f(-1) = (-1)^2 = 1`: defined.</span><span>2. Left: LIMS(x → -1^{-}) `(2x + k) = -2 + k`. Right: LIMS(x → -1^{+}) `x^2 = 1`.</span><span>3. The limit exists and equals `f(-1)` only if `-2 + k = 1`, so `k = 3`.</span></div>',
  s3a:'<div class="alg-lines"><span>1. `f(2) = {1}/{0}`: undefined.</span><span>2. As `x → 2^{-}` the values decrease without bound; as `x → 2^{+}` they grow without bound. No limit.</span><span>3. No value of `f(2)` can equal a limit that doesn’t exist.</span></div>',
  s3b:'<div class="alg-lines"><span>1. `f(0) = 1`: defined.</span><span>2. LIMS(x → 0^{-}) `f(x) = -1`, but LIMS(x → 0^{+}) `f(x) = 1`. No limit.</span><span>3. Whatever you choose for `f(0)`, it can’t equal both −1 and 1.</span></div>',
  s4:'<div class="alg-lines"><span>Height: LIMS(x → 1^{-}) `x^2 = 1` and `f(1) = m(1) + b`, so continuous means `m + b = 1`.</span><span>Slope: the slope of `x^2` at `x = 1` is 2 (module 02); the line’s slope is `m`.</span><span>Smooth means the same height <strong>and</strong> the same slope: `m = 2` and `b = -1`.</span></div>'
};
function algHTML(id){ return md(ALG[id].replace(/LIMS\(([^)]*)\)/g, function(_, s){ return lim(s); })); }
function part3(host, api){
  var S = api.S; S.st = ["s1", "s2", "s3", "s4"].indexOf(S.st) >= 0 ? S.st : "s1";
  S.c3 = S.c3 === "b" ? "b" : "a";
  S.r = S.r || {};
  var D = { s1:{ y:0 }, s2:{ k:0 }, s3a:{ y:0 }, s3b:{ y:0 }, s4:{ m:0, b:0 } };
  Object.keys(D).forEach(function(k){ S.r[k] = Object.assign({ menu:null, done:false, msg:null }, D[k], S.r[k] || {}); });
  var A3 = { tx:null, run:null, fb:{} };
  host.innerHTML = '<div class="ct-st"></div><div class="ct-c3" hidden></div>' +
    '<div class="ct-stg"><div class="ct-stl"><div class="eq-cap ct-cap" aria-live="polite"></div><div class="plot-wrap"><canvas class="plot" id="ct-p3plot" role="img" aria-label="Station graph"></canvas></div><div class="ct-badges" aria-live="polite"></div></div>' +
    '<div class="ct-str"><h4 class="ct-mh">Choose a repair</h4><div class="chips ct-menu" role="group" aria-label="Repair menu"></div><div class="ct-rc"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-rt="1" data-k="ctretrace">Retrace</button></div><div class="ct-rfb" aria-live="polite"></div>' +
    '<details class="alg ct-alg"><summary>Check it with algebra</summary><div class="ct-algb"></div></details></div></div>';
  var plot = new MV.Plot($("#ct-p3plot", host), { xmin:-2, xmax:6, ymin:-2, ymax:8 });
  function q(sel){ return $(sel, host); }
  function cur(){ return S.st === "s3" ? "s3" + S.c3 : S.st; }
  function R(){ return S.r[cur()]; }
  function done(id){ return id === "s3" ? S.r.s3a.done && S.r.s3b.done : S.r[id].done; }
  function save(){ api.save(); }
  function stopRun(){ if (A3.run) { var r = A3.run; A3.run = null; r(); } }
  var segSt = MV.seg(q(".ct-st"), { label:"Station:", value:S.st, options:[1, 2, 3, 4].map(function(i){ return { id:"s" + i, t:String(i) }; }),
    onChange:function(v){ stopRun(); S.st = v; A3.tx = null; save(); paint(); } });
  var segC3 = MV.seg(q(".ct-c3"), { label:"Graph:", value:S.c3, options:[{ id:"a", t:m("1/(x - 2)") }, { id:"b", t:"Step function" }],
    onChange:function(v){ stopRun(); S.c3 = v; A3.tx = null; save(); paint(); } });
  // draggable dot for "Redefine one point" (stations 1 and 3): ↑ ↓ keys, Shift for steps of 2
  var drag = MV.drag(plot, { axis:"y", step:{ x:0, y:0.5 }, big:4,
    handles:function(){ var id = cur(), r = R(); if (r.menu !== "point" || STN[id].ok === "const") return []; return [{ id:"pt", x:STN[id].a, y:r.y, label:"Your point f(" + ntx(STN[id].a) + ") = " + ntx(r.y) + ". Use the up and down arrow keys to move it." }]; },
    snap:function(x, y){ var v = STN[cur()].view; return [x, Math.max(Math.ceil(v.ymin), Math.min(Math.floor(v.ymax), Math.round(y * 2) / 2))]; },
    move:function(id, x, y){ var r = R(); if (close(r.y, y)) return; r.y = r9(y); A3.tx = null; A3.fb[cur()] = null; save(); paintRc(); paintBadges(); draw(); } });
  void drag;
  function draw(){
    var id = cur(), st = STN[id], r = R(), sp = stSpec(id, r), pen = css("--pen"), w = 0.16;
    var sc = { view:st.view, xTicks:{ step:1 }, yTicks:{ step:st.view.ymax - st.view.ymin > 9 ? 2 : 1 }, curves:[], asymptotes:[], points:[] };
    sp.pieces.forEach(function(p){ sc.curves.push({ f:p.f, domain:p.domain, color:pen, width:3 }); });
    if (sp.asym != null) sc.asymptotes.push({ x:sp.asym });
    sp.holes.forEach(function(h){ sc.points.push({ x:h[0], y:h[1], open:true, color:pen, r:5.5 }); });
    sp.dots.forEach(function(d){ sc.points.push({ x:d[0], y:d[1], color:pen, r:5.5 }); });
    var userDot = r.menu === "point" && st.ok !== "const";
    if (userDot) sc.points.push({ x:st.a, y:r.y, color:css("--ink"), r:7, ring:true });
    sc.after = function(ctx, pl){
      if (sp.glow) glow(ctx, pl, sp.glow[0], sp.glow[1], sp.asym != null ? 24 : 17);
      if (id === "s4") {
        var ink = css("--ink"); ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(pl.X(0.35), pl.Y(1 - 2 * 0.65)); ctx.lineTo(pl.X(1), pl.Y(1)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pl.X(1), pl.Y(sp.h)); ctx.lineTo(pl.X(1.65), pl.Y(sp.h + r.m * 0.65)); ctx.stroke(); ctx.restore();
        tagText(ctx, pl, "slope 2", pl.X(1) - 12, pl.Y(1) - 20, "right");
        tagText(ctx, pl, "slope " + ntx(r.m), pl.X(1) + 12, pl.Y(sp.h) - 20, "left");
      }
      drawEvLabels(ctx, pl, sp, A3.tx, w);
      if (A3.tx != null) drawPencil(ctx, pl, pencilAt(sp, A3.tx, w));
    };
    var d = "Graph of " + st.txt + (id === "s2" ? " with k = " + ntx(r.k) : id === "s4" ? " with m = " + ntx(r.m) + " and b = " + ntx(r.b) : "") + ".";
    sp.holes.forEach(function(h){ d += " Open circle at (" + ntx(h[0]) + ", " + ntx(h[1]) + ")."; });
    sp.dots.forEach(function(h){ d += " Filled dot at (" + ntx(h[0]) + ", " + ntx(h[1]) + ")."; });
    if (sp.asym != null) d += " Vertical asymptote x = 2.";
    if (userDot) d += " Your point, which you can move up and down, is at (" + ntx(st.a) + ", " + ntx(r.y) + ").";
    d += sp.glow ? " The break glows." : " No break: the pieces meet.";
    if (id === "s4") d += " Tangent slopes at x = 1: 2 from the left, " + ntx(r.m) + " from the right." + (sp.corner ? " Corner badge." : "");
    sc.describe = d;
    plot.draw(sc);
  }
  plot.render = draw;
  function menuMsg(id, choice){
    var M = {
      s1:{ point:"Drag the dot on the graph (or focus it and use the ↑ ↓ keys) to set `f(3)`, then press Retrace.",
           "const":"There’s no constant in this rule to choose. The two sides head to the same height; what’s missing?",
           none:"It can be repaired: both sides approach the same height, so one point can fill the hole." },
      s2:{ "const":"Move the `k` slider until the pieces meet, then press Retrace.",
           point:"Changing one point can fill a hole. It can’t close a jump. Here `k` controls where the left piece arrives.",
           none:"It can be repaired: `k` slides the left piece up and down until the pieces meet." },
      s3a:{ none:"Right. An infinite or jump discontinuity can’t be fixed by one point.",
            point:"Try it: drag the dot (or use the ↑ ↓ keys), then press Retrace. Can any height reach both sides?",
            "const":"There’s no constant in this rule to choose." },
      s3b:{ none:"Right. An infinite or jump discontinuity can’t be fixed by one point.",
            point:"Try it: drag the dot (or use the ↑ ↓ keys), then press Retrace. Can any height reach both sides?",
            "const":"There’s no constant in this rule to choose." },
      s4:{ "const":"Move `m` and `b`. First goal: make `f` continuous. Second goal: make it smooth. Press Retrace to test.",
           point:"One point can’t make the pieces meet, and it can’t match their slopes. Use the constants.",
           none:"It can be repaired: `m` and `b` move the right piece." }
    };
    return md(M[id][choice]);
  }
  function slider(key, label, min, max){ return '<label class="slider ct-sl"><span class="slider-top"><span>' + label + '</span><output>' + ntx(R()[key]) + '</output></span><input type="range" data-rs="' + key + '" data-k="ctrs' + key + '" min="' + min + '" max="' + max + '" step="0.5" value="' + R()[key] + '" style="accent-color:var(--ink)" aria-label="' + key + ", from " + ntx(min) + " to " + ntx(max) + '"></label>'; }
  function paintRc(){
    var id = cur(), r = R(), el = q(".ct-rc"), h = "";
    if (r.menu) {
      var good = r.menu === STN[id].ok, tryIt = id.indexOf("s3") === 0 && r.menu === "point";
      h += MV.fbHTML(good ? (id.indexOf("s3") === 0 ? "good" : "") : tryIt ? "" : "bad", (good || tryIt ? "" : "<strong>✗ Not that repair.</strong> ") + menuMsg(id, r.menu));
    }
    if (r.menu === "point" && STN[id].ok !== "const") {
      var a = STN[id].a, fa = m("f(" + nsrc(a) + ")");
      h += '<p class="ct-val">' + fa + " = " + ntx(r.y) + "</p>";
      if (id === "s3a") h += '<p class="tiny">' + md("From the left the graph decreases without bound; from the right it grows without bound. No height reaches both.") + "</p>";
      if (id === "s3b") h += '<p class="tiny">' + md("Left → −1, right → 1. Your dot at " + ntx(r.y) + (close(r.y, 1) || close(r.y, -1) ? " touches only one side." : " touches neither side.")) + "</p>";
    }
    if (r.menu === "const" && id === "s2") h += slider("k", m("k"), -5, 5) + '<p class="tiny muted">' + md("Left piece arrives at `-2 + k` = ") + ntx(-2 + r.k) + md("; the right piece starts at `(-1)^2 = 1`.") + "</p>";
    if (r.menu === "const" && id === "s4") {
      var sp = stSpec(id, r);
      h += slider("m", m("m"), -4, 4) + slider("b", m("b"), -4, 4);
      h += '<dl class="read ct-s4r"><div><dt>Heights at ' + m("x = 1") + "</dt><dd>left " + m("1^2 = 1") + "; right " + m("m + b") + " = " + ntx(sp.h) + "</dd></div><div><dt>Tangent slopes at " + m("x = 1") + "</dt><dd>left 2 (from module 02); right " + m("m") + " = " + ntx(r.m) + "</dd></div></dl>";
      h += '<ul class="checks ct-goals"><li class="' + (r.g1 ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (r.g1 ? "✓" : "○") + "</span><span>First goal: continuous" + (r.g1 ? '<span class="vh"> (met)</span>' : '<span class="vh"> (not met yet)</span>') + '</span></li><li class="' + (r.g2 ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (r.g2 ? "✓" : "○") + "</span><span>Second goal: smooth" + (r.g2 ? '<span class="vh"> (met)</span>' : '<span class="vh"> (not met yet)</span>') + "</span></li></ul>";
    }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintBadges(){
    var id = cur(), sp = stSpec(id, R()), b = q(".ct-badges");
    b.innerHTML = id === "s4" && sp.corner ? '<span class="ct-badge">Corner at ' + m("x = 1") + ": continuous, not smooth</span>" : id === "s4" && sp.smooth ? '<span class="ct-badge ok">Smooth join at ' + m("x = 1") + "</span>" : "";
  }
  function paintFb(){ var f = A3.fb[cur()]; q(".ct-rfb").innerHTML = f ? MV.fbHTML(f.kind, f.html) : ""; }
  function paint(){
    var id = cur(), st = STN[id], r = R();
    segSt.set(S.st); segC3.set(S.c3);
    q(".ct-st .seg").querySelectorAll("button").forEach(function(btn){ var sid = btn.dataset.seg; btn.innerHTML = sid.slice(1) + (done(sid) ? ' <span aria-hidden="true">✓</span><span class="vh"> (repaired or settled)</span>' : ""); });
    q(".ct-c3").hidden = S.st !== "s3";
    q(".ct-cap").innerHTML = st.eq(r) + ' <span class="ct-at">at ' + m("x = " + st.a) + "</span>";
    MV.keepFocus(q(".ct-menu"), function(){ q(".ct-menu").innerHTML = MENU.map(function(c){ return '<button type="button" class="chip" data-menu="' + c.id + '" data-k="ctm' + c.id + '" aria-pressed="' + (r.menu === c.id) + '">' + c.t + "</button>"; }).join(""); });
    $('[data-rt]', host).disabled = !r.menu || !!A3.run;
    q(".ct-algb").innerHTML = algHTML(id);
    paintRc(); paintBadges(); paintFb(); draw();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var id = cur(), r = R();
    if (b.dataset.menu) { stopRun(); r.menu = b.dataset.menu; A3.tx = null; A3.fb[id] = null; if (STN[id].ok === "none" && r.menu === "none") r.done = true; save(); paint(); MV.focusFb(q(".ct-rc")); return; }
    if (b.dataset.rt) retrace();
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.rs; if (!k) return;
    var r = R(); r[k] = r9(+e.target.value); A3.tx = null; A3.fb[cur()] = null; save();
    var out = e.target.parentNode.querySelector("output"); if (out) out.textContent = ntx(r[k]);
    paintRc(); paintBadges(); paintFb(); q(".ct-cap").innerHTML = STN[cur()].eq(r) + ' <span class="ct-at">at ' + m("x = " + STN[cur()].a) + "</span>"; draw();
  });
  host.addEventListener("keydown", function(e){
    var k = e.target.dataset && e.target.dataset.rs; if (!k || !e.shiftKey) return;
    var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0; if (!d) return;
    e.preventDefault(); var mx = +e.target.max, mn = +e.target.min; e.target.value = Math.max(mn, Math.min(mx, +e.target.value + d * 2)); e.target.dispatchEvent(new Event("input", { bubbles:true }));
  });
  function verdict(id, r, sp){
    var a = STN[id].a;
    if (id === "s1") {
      if (sp.fixed) { r.done = true; return { kind:"good", html:"<strong>✓ The open circle fills and the pencil passes.</strong> " + lim("x → 3") + " " + m("(x + 3) = 6") + md(", so define `f(3) = 6`.") }; }
      return { kind:"bad", html:"<strong>✗ The pencil still lifts at " + m("x = 3") + ".</strong> " + (r.menu === "point" ? md("The graph arrives at height 6 from both sides, but your point is at " + ntx(r.y) + ".") : md("The point `f(3)` is still missing.")) };
    }
    if (id === "s2") {
      if (sp.fixed && r.menu === "const") { r.done = true; return { kind:"good", html:"<strong>✓ The pencil passes.</strong> " + md("With `k = 3`, the left piece arrives at `-2 + 3 = 1`, where the right piece starts.") }; }
      return { kind:"bad", html:"<strong>✗ The pencil still lifts at " + m("x = -1") + ".</strong> " + md("The left piece arrives at `-2 + k` = ") + ntx(sp.lL) + md(", but the right piece starts at 1.") };
    }
    if (id === "s3a" || id === "s3b") return { kind:r.menu === "none" ? "good" : "bad", html:"<strong>" + (r.menu === "none" ? "✓ Right: the pencil still lifts at " : "✗ The pencil still lifts at ") + m("x = " + a) + ".</strong> An infinite or jump discontinuity can’t be fixed by one point." };
    if (!sp.cont) return { kind:"bad", html:"<strong>✗ The pencil still lifts at " + m("x = 1") + ".</strong> " + md("The left piece arrives at 1, but the right piece starts at `m + b` = ") + ntx(sp.h) + "." };
    if (r.menu !== "const") return { kind:"bad", html:md("Choose a repair from the menu first.") };
    r.g1 = true;
    if (sp.smooth) { r.g2 = true; r.done = true; return { kind:"good", html:"<strong>✓ Both goals met.</strong> Continuous: the pieces meet. Smooth: they meet <strong>and</strong> have the same slope." }; }
    return { kind:"good", html:"<strong>✓ First goal met: the pencil passes.</strong> " + md("But the slopes are 2 and ") + ntx(r.m) + md(": a corner. Now make it smooth too.") };
  }
  function retrace(){
    var id = cur(), r = R(); if (!r.menu) return;
    stopRun(); A3.fb[id] = null; paintFb();
    var v = STN[id].view, x0 = v.xmin + (v.xmax - v.xmin) * 0.03, x1 = v.xmax - (v.xmax - v.xmin) * 0.03;
    A3.tx = x0; $('[data-rt]', host).disabled = true;
    A3.run = MV.tween({ dur:3000, ease:lin, step:function(t){ A3.tx = x0 + (x1 - x0) * t; draw(); }, done:function(){
      A3.run = null; A3.tx = x1;
      var sp = stSpec(id, r); A3.fb[id] = verdict(id, r, sp); save(); paint(); MV.focusFb(q(".ct-rfb"));
    } });
  }
  paint();
  return {};
}

// ---------- Practice 2: repair the constants ----------
// @component N4 unitBoxes (adapted from MCV4U 03 / 04) — labelled number boxes per item (V8: fractions such as 1/4 accepted;
// R5 and R6 take two boxes); wrong:[{<box>:value, …, fb} | {word:"undef", fb}] for named feedback; first-try scoring.
function constantsAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q ct-rq" data-rq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="ct-rb"></div><div class="ct-rcl"></div></div>';
  }).join("");
  function paintBoxes(it){
    var x = ist(it.id), el = $('[data-rq="' + it.id + '"] .ct-rb', host);
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="ct-bxs">' + it.boxes.map(function(b){
        return '<label for="ct-r' + it.id + b.k + '"><span>' + b.label + '</span><input class="numin short" id="ct-r' + it.id + b.k + '" data-bx="' + b.k + '" data-k="' + it.id + b.k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(x.v[b.k] || "") + '"' + (x.solved ? " disabled" : "") + "></label>";
      }).join("") + "</div>";
    });
  }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-rq="' + it.id + '"] .ct-rcl', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  a.items.forEach(function(it){ paintBoxes(it); paintCtl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, w;
    for (var i = 0; i < it.boxes.length; i++) {
      var b = it.boxes[i], raw = String(x.v[b.k] || "").trim();
      if (!raw) return { err:it.boxes.length > 1 ? "Fill in both boxes first." : "Type your answer first." };
      if (/undef|exist|dne|none/i.test(raw)) { w = (it.wrong || []).filter(function(z){ return z.word; })[0]; return { ok:false, msg:w ? w.fb : (it.general || "A value that repairs the function is a number. Look for the height both sides approach.") }; }
      var p = MV.parseNum(raw); if (!p || p.length !== 1) return { err:"Type a number in each box, such as 3, −12 or 1/4." };
      vals[b.k] = p[0];
    }
    if (Object.keys(ans).every(function(k){ return close(vals[k], ans[k], 1e-9); })) return { ok:true };
    w = (it.wrong || []).filter(function(z){ var ks = Object.keys(z).filter(function(k){ return k !== "fb" && k !== "word"; }); return ks.length && ks.every(function(k){ return close(vals[k], z[k], 1e-9); }); })[0];
    if (w) return { ok:false, msg:md(w.fb) };
    if (it.general) return { ok:false, msg:md(it.general) };
    var right = it.boxes.filter(function(b){ return close(vals[b.k], ans[b.k], 1e-9); });
    if (it.boxes.length > 1 && right.length) return { ok:false, msg:"Your " + right.map(function(b){ return m(b.k); }).join(" and ") + " is right; check the other box." };
    return { ok:false, msg:"Set the left and right heights at the join equal (or find the limit at the hole), then solve." };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var box = t.closest("[data-rq]"); ist(box.dataset.rq).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var box = e.target.closest("[data-rq]"), b = box && box.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-rq]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.rq; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintBoxes(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: smooth join ----------
var task = (function(){
  var api, plot, T;
  function read(){
    var s = api ? api.S : {};
    function g(k){ var t = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -10 && v <= 10 ? v : null; }
    var A = g("a"), Bb = g("b"), C = g("c");
    return { a:A, b:Bb, c:C, valid:A !== null && Bb !== null && C !== null };
  }
  function draw(){
    var d = read(), V0 = { xmin:-2.6, xmax:3.6, ymin:-6, ymax:8 };
    if (!d.valid) { plot.draw({ view:V0, segments:[{ x1:1, y1:V0.ymin, x2:1, y2:V0.ymax, color:css("--ink-2"), width:1.5, dash:[3, 5] }], describe:"Enter whole numbers from −10 to 10 for a, b and c to draw both pieces. The dotted line marks the join, x = 1." }); return; }
    var lH = d.a + d.b, rH = 1 + d.c, pen = css("--pen"), ink = css("--ink");
    var ys = [lH, rH, d.b, 4 + d.c, d.a * -2.4 + d.b, 0], v = { xmin:-2.6, xmax:3.6, ymin:Math.min(-6, Math.min.apply(null, ys) - 2), ymax:Math.max(8, Math.max(lH, rH, 4 + d.c) + 3) };
    var pts = [{ x:1, y:rH, color:pen, r:5.5 }, { x:0, y:d.b, color:ink, r:4 }, { x:2, y:4 + d.c, color:ink, r:4 }];
    if (!close(lH, rH)) pts.unshift({ x:1, y:lH, open:true, color:pen, r:5.5 });
    plot.draw({ view:v, yTicks:{ step:MV.niceStep((v.ymax - v.ymin) / 8) },
      curves:[{ f:function(x){ return d.a * x + d.b; }, domain:[-10, 1], color:pen, width:3 }, { f:function(x){ return x * x + d.c; }, domain:[1, 10], color:pen, width:3 }],
      segments:[{ x1:1, y1:v.ymin, x2:1, y2:v.ymax, color:css("--ink-2"), width:1.5, dash:[3, 5] },
        { x1:1, y1:rH, x2:1.7, y2:rH + 2 * 0.7, color:ink, width:2, dash:[6, 4] }],
      points:pts,
      labels:[{ x:1, y:v.ymax, text:"join x = 1", dx:6, dy:12, align:"left", bg:true, color:css("--ink-2"), font:"600 12px " + (css("--font-ui") || "sans-serif") },
        { x:0, y:d.b, text:"f(0) = " + ntx(d.b), dx:-8, dy:-14, align:"right", bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif") },
        { x:2, y:4 + d.c, text:"f(2) = " + ntx(4 + d.c), dx:8, dy:-14, align:"left", bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif") }],
      describe:"Left piece y = " + MV.plain(m(plus(coefSrc(d.a, "x"), d.b))) + " for x < 1, arriving at height " + ntx(lH) + " at x = 1. Right piece y = x² " + (d.c < 0 ? "− " + Math.abs(d.c) : "+ " + d.c) + " for x ≥ 1, starting at (1, " + ntx(rH) + ") with slope 2 (dashed tangent). f(0) = " + ntx(d.b) + ", f(2) = " + ntx(4 + d.c) + "." });
  }
  function readout(){
    var d = read(), el = $("#ct-tread"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Enter whole numbers from −10 to 10 for ' + m("a") + ", " + m("b") + " and " + m("c") + ".</dd></div>"; return; }
    el.innerHTML = MV.readoutHTML([
      ["Heights at " + m("x = 1"), "left " + m("a(1) + b") + " = " + ntx(d.a + d.b) + "; right " + m("1^2 + c") + " = " + ntx(1 + d.c)],
      ["Slopes at " + m("x = 1"), "left " + m("a") + " = " + ntx(d.a) + "; right 2 (the slope of " + m("x^2 + c") + " at " + m("x = 1") + ")"],
      [m("f(0)"), m("b") + " = " + ntx(d.b)],
      [m("f(2)"), m("4 + c") + " = " + ntx(4 + d.c)]
    ]);
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; if (a.S.a == null) { a.S.a = "1"; a.S.b = "0"; a.S.c = "0"; }
      inp.innerHTML = '<div class="inrow">' + ["a", "b", "c"].map(function(k){ return '<label for="ct-t' + k + '"><span>' + m(k) + ' <span class="tiny muted">(−10 to 10)</span></span><input id="ct-t' + k + '" data-tk="' + k + '" type="number" min="-10" max="10" step="1" autocomplete="off" value="' + MV.esc(a.S[k]) + '"></label>'; }).join("") + "</div>";
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="ct-tplot" role="img" aria-label="Your piecewise function"></canvas></div><dl class="read" id="ct-tread" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#ct-tplot"), { xmin:-2.6, xmax:3.6, ymin:-6, ymax:8 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); a.update(); });
      // the frame's own closing note appears after 3 answers; this plan's note waits for all four
      document.addEventListener("click", function(e){
        if (!e.target.closest || !e.target.closest("#task-check")) return;
        setTimeout(function(){ var ts = MV.taskState(), fb = $("#task-fb .fb.good"); if (fb && ts.found.length >= 4 && T.afterAll && !fb.querySelector(".ct-after")) { var p = document.createElement("p"); p.className = "ct-after"; p.innerHTML = T.afterAll; fb.appendChild(p); } }, 0);
      });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers from −10 to 10 for a, b and c."; },
    checks:function(d){ if (!d.valid) return [false, false, false, false]; return [d.a + d.b === 1 + d.c, d.a === 2, d.b < 0, 4 + d.c > 0]; },
    key:function(d){ return d.a + "," + d.b + "," + d.c; },
    label:function(k){ return "(" + k.split(",").map(function(v){ return ntx(+v); }).join(", ") + ")"; },
    text:function(k){ var p = k.split(","); return "a = " + ntx(+p[0]) + ", b = " + ntx(+p[1]) + ", c = " + ntx(+p[2]); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ constants:constantsAct },
  task:task
});
})();
