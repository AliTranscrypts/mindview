// MCV4U 23 Concavity and Points of Inflection: hero (a tangent slides along y = x³ − 6x² + 9x + 1, tinting the gap between curve
// and tangent), Bend detector (Explore: V5 derivative panels with the V11 concavity strip; Tangent, Slopes and Three panels modes;
// Mark; Build x⁴ + bx³ + cx²; an N10 interval builder for challenge 2), The second derivative test (Part 3: cups and caps with
// radios, three silent cards, an N13 step-through for x + 1/x and a fastest-growth slider), Bend it (Practice 2: interval
// builders and number boxes) and the "Design a bend" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function sgn(v){ return v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0; }
function midOf(a, b){ return !isFinite(a) ? (isFinite(b) ? b - 1 : 0) : !isFinite(b) ? a + 1 : (a + b) / 2; }
// at most dp decimals, with "≈ " in front when rounding changed the value
function dec(v, dp){ var r = r9(v), p = Math.pow(10, dp); return (Math.abs(r * p - Math.round(r * p)) > 1e-6 ? "≈ " : "") + num(r, dp); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function nmS(v){ return String(r9(v)).replace("-", MINUS); }
function segBtns(name, opts, val, label, dis){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '"' + (dis ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</span>";
}
function probeLine(ctx, p, x){
  var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
}
function narrow(){ return !!(window.matchMedia && window.matchMedia("(max-width: 560px)").matches); }
function lin(t){ return t; }
// exact rationals: terminating decimals (≤ 4 places) as decimals, anything else as a fraction
function termQ(q){ var d = q.d, k = 0, j = 0; while (d % 2 === 0) { d /= 2; k++; } while (d % 5 === 0) { d /= 5; j++; } return d === 1 && Math.max(k, j) <= 4; }
function qHTML(q){ return termQ(q) ? num(Q.val(q), 4) : m(Q.src(q)); }
function qPlain(q){ return termQ(q) ? num(Q.val(q), 4) : Q.txt(q); }
function valQ(q){ return q ? (termQ(q) ? num(Q.val(q), 4) : "≈ " + num(Q.val(q), 4)) : "undefined"; }
// hatched --hi-soft fill (concave down), so the meaning never relies on colour alone
var HATCH = {};
function hatch(ctx){
  var bg = css("--hi-soft"), ln = css("--ink-2"), key = bg + "|" + ln;
  if (!HATCH[key]) {
    var c = document.createElement("canvas"); c.width = c.height = 10;
    var g = c.getContext("2d"); g.fillStyle = bg; g.fillRect(0, 0, 10, 10); g.strokeStyle = ln; g.globalAlpha = 0.55; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(-2, 12); g.lineTo(12, -2); g.moveTo(-2, 2); g.lineTo(2, -2); g.moveTo(8, 12); g.lineTo(12, 8); g.stroke();
    HATCH[key] = c;
  }
  return ctx.createPattern(HATCH[key], "repeat");
}

// =====================================================================================================================
// @component ladderFn (trimmed from MCV4U 14) — polynomials as integer coefficient arrays (lowest power first): pDer, pEval,
// pEvalQ (exact with MV.mcv.Q), pSrc (m() source). quadRoots(c) — real zeros of a polynomial of degree ≤ 2 as {x, q (exact Q or
// null when irrational), dbl}.
function pTrim(p){ p = p.slice(); while (p.length && !p[p.length - 1]) p.pop(); return p; }
function pDer(p){ return pTrim(p.slice(1).map(function(c, i){ return c * (i + 1); })); }
function pEval(p, x){ var v = 0; for (var i = p.length - 1; i >= 0; i--) v = v * x + p[i]; return v; }
function pEvalQ(p, q){ var v = Q.of(0); for (var i = p.length - 1; i >= 0; i--) v = Q.add(Q.mul(v, q), Q.of(p[i])); return v; }
function pSrc(p){
  p = pTrim(p); if (!p.length) return "0";
  var out = "";
  for (var i = p.length - 1; i >= 0; i--) {
    var c = p[i]; if (!c) continue;
    var a = Math.abs(c), body = i === 0 ? String(a) : (a === 1 ? "" : String(a)) + "x" + (i > 1 ? "^" + i : "");
    out += out ? (c < 0 ? " - " : " + ") + body : (c < 0 ? "-" : "") + body;
  }
  return out;
}
function quadRoots(c){
  c = pTrim(c);
  if (c.length <= 1) return [];
  if (c.length === 2) return [{ x:-c[0] / c[1], q:Q.of(-c[0], c[1]) }];
  var A = c[2], B = c[1], C = c[0], D = B * B - 4 * A * C;
  if (D < 0) return [];
  if (D === 0) return [{ x:-B / (2 * A), q:Q.of(-B, 2 * A), dbl:true }];
  var s = Math.sqrt(D), si = Math.round(s), ex = si * si === D;
  return [-1, 1].map(function(k){ return { x:(-B + k * s) / (2 * A), q:ex ? Q.of(-B + k * si, 2 * A) : null }; }).sort(function(u, v){ return u.x - v.x; });
}

// =====================================================================================================================
// concavity analysis of a function spec F = { f, d1, d2, fq?, cands:[{x, q, t:"zero"|"undef"}], gaps:[x] }:
// columns between every candidate and gap with the sign of f″, points of inflection (candidates in the domain where the sign
// changes), zeros with no change ("flat") and gaps across which the sign changes.
function analyse(F){
  var cuts = F.cands.map(function(c){ return { x:c.x, q:c.q, t:c.t }; }).concat((F.gaps || []).map(function(g){ return { x:g, q:Q.of(g), t:"gap" }; }))
    .sort(function(a, b){ return a.x - b.x; });
  var bs = [{ x:-Infinity }].concat(cuts, [{ x:Infinity }]), cols = [], i;
  for (i = 0; i + 1 < bs.length; i++) cols.push({ a:bs[i].x, b:bs[i + 1].x, ca:bs[i], cb:bs[i + 1], s:sgn(F.d2(midOf(bs[i].x, bs[i + 1].x))) });
  var pois = [], flat = [], gapCh = [];
  cuts.forEach(function(c, j){
    var L = cols[j].s, R = cols[j + 1].s, ch = L !== 0 && R !== 0 && L !== R;
    if (c.t === "gap") { if (ch) gapCh.push(c); return; }
    if (ch) pois.push({ x:c.x, q:c.q, yq:c.q && F.fq ? F.fq(c.q) : null, yv:F.f(c.x), t:c.t, from:L, to:R });
    else if (c.t === "zero") flat.push(c);
  });
  return { cuts:cuts, cols:cols, pois:pois, flat:flat, gapCh:gapCh,
    up:cols.filter(function(c){ return c.s > 0; }), down:cols.filter(function(c){ return c.s < 0; }) };
}
function cutTxt(c, fl){ if (!isFinite(c.x)) return c.x < 0 ? MINUS + "∞" : "∞"; if (c.q) return qPlain(c.q); if (fl) fl.approx = true; return num(c.x, 2); }
function ivsTxt(cols, fl){ return cols.map(function(c){ return "(" + cutTxt(c.ca, fl) + ", " + cutTxt(c.cb, fl) + ")"; }).join(" and "); }
function poiTxt(p, fl){
  var y = p.yq ? qPlain(p.yq) : (function(){ if (fl) fl.approx = true; return num(p.yv, 2); })();
  return "(" + cutTxt(p, fl) + ", " + y + ")";
}
function concTxt(A, fl){
  var parts = [];
  if (A.up.length) parts.push("up on " + ivsTxt(A.up, fl));
  if (A.down.length) parts.push("down on " + ivsTxt(A.down, fl));
  return parts.join("; ");
}

// =====================================================================================================================
// @component V11 concavityStrip (MCV4U 20 slopeStrip adapted for f″) — a band under the graph painted solid --hi-soft with “∪”
// where f″ > 0 (slopes increasing) and hatched --hi-soft with “∩” where f″ < 0 (slopes decreasing). It fills in only where the
// probe has been (keys = 20x), shows “0” or “undef.” at candidates the probe has reached, and “not in the domain” at gaps.
//   drawStrip(plot, { view:{xmin, xmax}, F, A (analyse(F)), keys:{k:1} | "all", describe })
function drawStrip(p, o){
  p.draw({ view:{ xmin:o.view.xmin, xmax:o.view.xmax, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:o.describe || "Concavity strip", after:function(ctx, pl){
    var W = pl.W, H = pl.H, y0 = 4, y1 = H - 18, ym = (y0 + y1) / 2, ink = css("--ink"), ink2 = css("--ink-2"), v = pl.v, A = o.A, F = o.F;
    var cuts = A.cuts.map(function(c){ return c.x; }), segs = [];
    ctx.save();
    ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.strokeRect(0.5, y0 + 0.5, W - 1, y1 - y0);
    function push(a, b, s){ if (b - a < 1e-9 || !s) return; var L = segs[segs.length - 1]; if (L && L.s === s && near(L.b, a, 1e-6)) L.b = b; else segs.push({ a:a, b:b, s:s }); }
    function split(a, b){
      var cs = cuts.filter(function(c){ return c > a + 1e-9 && c < b - 1e-9; }).sort(function(u, w){ return u - w; }), s = a;
      cs.concat([b]).forEach(function(c){ push(s, c, sgn(F.d2(midOf(s, c)))); s = c; });
    }
    if (o.keys === "all") split(v.xmin, v.xmax);
    else {
      var ks = Object.keys(o.keys || {}).map(Number).sort(function(a, b){ return a - b; }), run = null;
      ks.forEach(function(k){ if (run && k === run[1] + 1) run[1] = k; else { if (run) split(Math.max(v.xmin, run[0] / 20 - 0.025), Math.min(v.xmax, run[1] / 20 + 0.025)); run = [k, k]; } });
      if (run) split(Math.max(v.xmin, run[0] / 20 - 0.025), Math.min(v.xmax, run[1] / 20 + 0.025));
    }
    var pat = hatch(ctx);
    segs.forEach(function(s){
      var xa = pl.X(s.a), xb = pl.X(s.b);
      ctx.fillStyle = s.s > 0 ? css("--hi-soft") : pat; ctx.fillRect(xa, y0 + 1, xb - xa, y1 - y0 - 1);
      var w = xb - xa, t = s.s > 0 ? (w > 150 ? "∪ slopes increasing" : "∪") : (w > 150 ? "∩ slopes decreasing" : "∩");
      if (w > 14) {
        ctx.font = ui(w > 150 ? 13 : 17, 700); ctx.textAlign = "center"; ctx.textBaseline = "middle";
        var tw = ctx.measureText(t).width; ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect((xa + xb) / 2 - tw / 2 - 3, ym - 9, tw + 6, 18); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.fillText(t, (xa + xb) / 2, ym + 1);
      }
    });
    ctx.font = ui(11, 600); ctx.textAlign = "center"; ctx.textBaseline = "top";
    A.cuts.forEach(function(c){
      if (c.x < v.xmin || c.x > v.xmax) return;
      var X = pl.X(c.x);
      if (c.t === "gap") {
        ctx.fillStyle = css("--sheet"); ctx.fillRect(X - 6, y0 + 1, 12, y1 - y0 - 1);
        ctx.strokeStyle = ink2; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X - 6, y0); ctx.lineTo(X - 6, y1); ctx.moveTo(X + 6, y0); ctx.lineTo(X + 6, y1); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = ink2; ctx.fillText("not in the domain", clamp(X, 50, W - 50), y1 + 3);
        return;
      }
      var seen = o.keys === "all" || Object.keys(o.keys || {}).some(function(k){ return Math.abs(+k - c.x * 20) <= 1.0001; }); if (!seen) return;
      var XX = Math.round(X) + 0.5; ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(XX, y0 - 2); ctx.lineTo(XX, y1 + 2); ctx.stroke();
      ctx.fillStyle = ink; ctx.fillText(c.t === "zero" ? "0" : "undef.", clamp(X, 20, W - 20), y1 + 3);
    });
    ctx.restore();
  } });
}
// ------------------------------------------------- end of V11 concavityStrip ----------------------------------------------------

// =====================================================================================================================
// @component V5 derivativePanels (adapted from MCV4U 14 / 20: panels of any kind stacked on one shared x-axis, each with an HTML
// caption, one probe; drag the point on panel 0 or tap any panel; arrow keys step o.step, Shift o.step × 10). The app builds each
// scene. Excluded x-values are skipped in the direction of motion; onMove is told which value was skipped.
//   var dp = derivativePanels(host, { kinds:["f", "strip", "d1", "d2"], x, step, dom(){ return {lo, hi, excl:[x]} },
//     draw(i, plot, x), handle(x) -> {x, y, label}, locked(), onMove(x, how, prev, skipped) })
//   -> { get(), set(x, how), render(), plots, caps, wraps, layout(visible(i)), focus() }
function dpSlopeLabel(v){
  if (!isFinite(v)) return "vertical tangent";
  if (Math.abs(v) < 1e-12) return "slope = 0";
  var c = Math.round(r9(v) * 100), exact = Math.abs(r9(v) * 100 - c) < 1e-6;
  return "slope " + (exact ? "= " : "≈ ") + (c < 0 ? MINUS : "") + num(Math.abs(c) / 100, 2);
}
function dpEdge(ctx, p, x, y, col){
  var v = p.v; if (!v || !isFinite(y) || (y <= v.ymax && y >= v.ymin)) return;
  var X = p.X(x), up = y > v.ymax, Y = up ? 4 : p.H - 4, s = 7;
  ctx.save(); ctx.fillStyle = col; ctx.beginPath();
  if (up) { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y + s * 1.4); ctx.lineTo(X + s, Y + s * 1.4); }
  else { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y - s * 1.4); ctx.lineTo(X + s, Y - s * 1.4); }
  ctx.closePath(); ctx.fill();
  ctx.font = ui(12); ctx.textAlign = X > p.W - 80 ? "right" : "left"; ctx.textBaseline = up ? "top" : "bottom";
  ctx.fillText(num(y, 2), X + (X > p.W - 80 ? -11 : 11), up ? 3 : p.H - 3);
  ctx.restore();
}
function dpSnap(D, v, prev, st){
  var skipped = null;
  function ex(w){ return (D.excl || []).some(function(e){ return Math.abs(e - w) < 1e-9; }); }
  v = r9(clamp(Math.round(v / st) * st, D.lo, D.hi));
  if (ex(v)) {
    skipped = v;
    var dir = prev == null || v >= prev ? 1 : -1, w = r9(v + dir * st);
    if (w > D.hi || w < D.lo || ex(w)) w = r9(v - dir * st);
    v = w;
  }
  return { v:v, skipped:skipped };
}
function derivativePanels(host, o){
  var x = o.x, st = o.step || 0.05;
  host.classList.add("dp-panels");
  host.innerHTML = o.kinds.map(function(k, i){ return '<div class="cv-pan" data-pan="' + i + '"><p class="cv-pcap"></p><div class="plot-wrap"><canvas class="plot cv-c-' + k + '" role="img" aria-label="Panel ' + (i + 1) + '"></canvas></div></div>'; }).join("");
  var wraps = $$(".cv-pan", host), caps = $$(".cv-pcap", host), plots = $$("canvas", host).map(function(c){ return new MV.Plot(c, { xmin:-1, xmax:1, ymin:-1, ymax:1 }); });
  var busy = false;
  function render(){
    if (busy) return; busy = true;
    try { plots.forEach(function(p, i){ if (!wraps[i].hidden) o.draw(i, p, x); }); } finally { busy = false; }
  }
  plots.forEach(function(p){ p.render = render; });
  function set(v, how){
    if (o.locked && o.locked() && how !== "anim" && how !== "set") return;
    var s = dpSnap(o.dom(), v, x, st);
    if (s.v === x && how !== "set") { if (s.skipped != null && o.onMove) { o.onMove(x, how, x, s.skipped); render(); } return; }
    var prev = x; x = s.v;
    if (o.onMove) o.onMove(x, how, prev, s.skipped);
    render();
  }
  var dr = MV.drag(plots[0], { axis:"x", step:{ x:st, y:st }, big:10,
    handles:function(){ var h = o.handle(x); return [{ id:"probe", x:h.x, y:h.y, label:h.label }]; },
    move:function(id, nx, ny, how){ set(nx, how === "key" ? "key" : "drag"); } });
  plots.forEach(function(p){
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
    p.c.addEventListener("pointerdown", function(e){
      if (e.defaultPrevented || !p.v) return;
      active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {}
      set(at(e), "tap");
    });
    p.c.addEventListener("pointermove", function(e){ if (active) set(at(e), "drag"); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  });
  function layout(vis){ wraps.forEach(function(w, i){ w.hidden = !vis(i); }); }
  return { get:function(){ return x; }, set:set, render:render, plots:plots, wraps:wraps, caps:caps, layout:layout, focus:function(){ dr.focus("probe"); } };
}
// ------------------------------------------------- end of V5 derivativePanels ---------------------------------------------------

// ---------- function specs ----------
function polyF(p){
  var p1 = pDer(p), p2 = pDer(p1);
  return { poly:true, p:p, p1:p1, p2:p2,
    f:function(x){ return pEval(p, x); }, d1:function(x){ return pEval(p1, x); }, d2:function(x){ return pEval(p2, x); },
    fq:function(q){ return pEvalQ(p, q); }, d1q:function(q){ return pEvalQ(p1, q); }, d2q:function(q){ return pEvalQ(p2, q); },
    cands:quadRoots(p2).map(function(r){ return { x:r.x, q:r.q, t:"zero", dbl:r.dbl }; }), gaps:[], excl:[], asym:[], vert:null };
}
var CBRT = { f:function(x){ return Math.cbrt(x); },
  d1:function(x){ return Math.abs(x) < 1e-12 ? NaN : 1 / (3 * Math.cbrt(x * x)); },
  d2:function(x){ return Math.abs(x) < 1e-12 ? NaN : -2 / (9 * x * Math.cbrt(x * x)); },
  cands:[{ x:0, q:Q.of(0), t:"undef" }], gaps:[], excl:[], asym:[], vert:0, fq:function(q){ return q.n === 0 ? Q.of(0) : null; } };
var RECIP = { f:function(x){ return Math.abs(x) < 1e-12 ? NaN : 1 / x; }, d1:function(x){ return Math.abs(x) < 1e-12 ? NaN : -1 / (x * x); }, d2:function(x){ return Math.abs(x) < 1e-12 ? NaN : 2 / (x * x * x); },
  fq:function(q){ return q.n ? Q.div(Q.of(1), q) : null; }, d1q:function(q){ return q.n ? Q.neg(Q.div(Q.of(1), Q.mul(q, q))) : null; }, d2q:function(q){ return q.n ? Q.div(Q.of(2), Q.mul(q, Q.mul(q, q))) : null; },
  cands:[], gaps:[0], excl:[0], asym:[0], vert:null };
var FNDEF = {
  C1:{ poly:[1, 9, -6, 1], lo:-0.5, hi:4, x0:0.5, view:{ xmin:-0.8, xmax:4.3, ymin:-6, ymax:8 }, v1:{ ymin:-5, ymax:17 }, v2:{ ymin:-16, ymax:14 } },
  C2:{ poly:[0, 0, -6, 0, 1], lo:-3, hi:3, x0:0.5, view:{ xmin:-3.3, xmax:3.3, ymin:-11, ymax:13 }, v1:{ ymin:-14, ymax:14 }, v2:{ ymin:-16, ymax:40 } },
  C3:{ poly:[0, 0, 0, 0, 1], lo:-2, hi:2, x0:-1.5, view:{ xmin:-2.3, xmax:2.3, ymin:-2, ymax:12 }, v1:{ ymin:-34, ymax:34 }, v2:{ ymin:-6, ymax:50 } },
  C4:{ spec:CBRT, lo:-4, hi:4, x0:-2, view:{ xmin:-4.3, xmax:4.3, ymin:-2.2, ymax:2.2 }, v1:{ ymin:-0.4, ymax:1.6 }, v2:{ ymin:-1.2, ymax:1.2 } },
  C5:{ spec:RECIP, lo:-4, hi:4, x0:-2, view:{ xmin:-4.3, xmax:4.3, ymin:-5, ymax:5 }, v1:{ ymin:-6, ymax:1 }, v2:{ ymin:-6, ymax:6 } },
  C6:{ poly:[0, 0, 0, 1], lo:-2, hi:2, x0:-1.5, view:{ xmin:-2.3, xmax:2.3, ymin:-9, ymax:9 }, v1:{ ymin:-2, ymax:13 }, v2:{ ymin:-13, ymax:13 } }
};
// y-range covering g at the given x-values (and 0), padded, at least `min` tall
function viewAt(g, xs, min){
  var lo = 0, hi = 0;
  xs.forEach(function(x){ var v = g(x); if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } });
  if (hi - lo < min) { var c = (hi + lo) / 2; if (lo >= 0) { hi = Math.max(hi, lo + min); } else if (hi <= 0) { lo = Math.min(lo, hi - min); } else { lo = c - min / 2; hi = c + min / 2; } }
  var pad = (hi - lo) * 0.2; return { ymin:lo - pad, ymax:hi + pad };
}
function inW(xs, a, b){ return xs.filter(function(x){ return x >= a && x <= b; }); }
// x⁴ + bx³ + cx²: interesting x-values in [a, b] (0, zeros of f′ and f″, the vertex of f″)
function quartXs(b, c, a, z){
  var F = polyF([0, 0, c, b, 1]), xs = [0];
  quadRoots(pDer(F.p).slice(1)).forEach(function(r){ xs.push(r.x); });
  F.cands.forEach(function(r){ xs.push(r.x); });
  return { F:F, xs:inW(xs, a, z), v2:inW([0, -b / 4].concat(F.cands.map(function(r){ return r.x; })), a, z) };
}
function makeFn(id, B){
  var D = FNDEF[id], F;
  if (id === "B") {
    var X = quartXs(B.b, B.c, -4, 4); F = X.F;
    F.lo = -4; F.hi = 4; F.x0 = 0; F.view = Object.assign({ xmin:-4.3, xmax:4.3 }, viewAt(F.f, X.xs, 8));
    F.v1 = viewAt(F.d1, X.v2.concat(X.xs), 6); F.v2 = viewAt(F.d2, X.v2, 8);
  } else {
    F = D.poly ? polyF(D.poly) : Object.assign({}, D.spec);
    F.lo = D.lo; F.hi = D.hi; F.x0 = D.x0; F.view = D.view; F.v1 = D.v1; F.v2 = D.v2;
  }
  F.id = id; F.A = analyse(F);
  return F;
}

// ---------- hero: y = x³ − 6x² + 9x + 1 draws; a tangent slides along it; the gap is tinted; it stops at the inflection (2, 3) ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var F = function(x){ return x * x * x - 6 * x * x + 9 * x + 1; }, D = function(x){ return 3 * x * x - 12 * x + 9; };
  var V = { xmin:-0.5, xmax:4.5, ymin:-2, ymax:7.5 }, st = { upTo:V.xmin, x:null, fin:false };
  var p = new MV.Plot(cv, V);
  function draw(){
    var ink = css("--ink"), sc = { view:V, xTicks:{ step:1 }, yTicks:{ step:1 }, yLabel:"y", curves:[{ f:F, color:css("--pen"), width:3, domain:[V.xmin - 1, st.upTo] }], regions:[], lines:[], points:[], labels:[] };
    var desc = "Graph of y = x³ − 6x² + 9x + 1.";
    if (st.x != null) {
      var x = st.x, y = F(x), d = D(x), T = function(t){ return y + d * (t - x); }, a = Math.max(V.xmin, x - 0.9), b = Math.min(V.xmax, x + 0.9);
      sc.regions.push({ f:F, g:T, x0:a, x1:b, where:"above", color:css("--hi-soft") }, { f:F, g:T, x0:a, x1:b, where:"below", color:hatch(p.ctx) });
      sc.lines.push({ p:[x, y], q:[x + 1, y + d], color:ink, width:2 });
      sc.points.push({ x:x, y:y, r:5.5, color:ink });
      if (st.fin) {
        sc.points.push({ x:2, y:3, r:10, open:true, color:ink });
        sc.labels.push({ x:2, y:3, text:"point of inflection (2, 3)", dx:16, dy:-18, align:"left", bg:true, font:ui(14) },
          { x:1, y:V.ymax, text:"∩ concave down", dy:14, align:"center", bg:true, font:ui(14) }, { x:3, y:V.ymax, text:"∪ concave up", dy:14, align:"center", bg:true, font:ui(14) });
        desc += " The tangent at (2, 3) crosses the curve: left of x = 2 the curve is below its tangent (concave down, hatched), right of x = 2 it is above (concave up, shaded). (2, 3) is a point of inflection.";
      } else {
        var up = x > 2 + 1e-6, dn = x < 2 - 1e-6;
        sc.labels.push({ x:x, y:V.ymax, text:up ? "∪ concave up" : dn ? "∩ concave down" : "crosses the curve", dy:14, align:"center", bg:true, font:ui(14) });
        desc += " The tangent at x = " + num(x, 1) + (up ? " lies below the curve: concave up." : dn ? " lies above the curve: concave down." : " crosses the curve.");
      }
    }
    sc.describe = desc;
    p.draw(sc);
  }
  p.render = draw;
  function finish(){ st.upTo = V.xmax + 1; st.x = 2; st.fin = true; draw(); if (f.cap) f.cap.innerHTML = "Left of `x = 2` the curve bends down; right of it, up. At (2, 3) the tangent crosses the curve.".replace(/`([^`]+)`/g, function(_, s){ return m(s); }); }
  if (MV.reduceMotion) { finish(); return; }
  draw();
  MV.wait(400, function(){
    MV.tween({ dur:1400, ease:lin, step:function(t){ st.upTo = V.xmin + (V.xmax - V.xmin + 0.2) * t; draw(); }, done:function(){
      st.upTo = V.xmax + 1;
      MV.tween({ dur:3600, ease:lin, step:function(t){ st.x = 0.2 + 3.6 * t; draw(); }, done:function(){
        MV.tween({ dur:1300, step:function(t){ st.x = 3.8 - 1.8 * t; draw(); }, done:finish });
      } });
    } });
  });
}

// ---------- Explore: bend detector ----------
var KINDS = ["f", "strip", "d1", "d2"];
function explore(host, api){
  var S = api.S, C = api.content, MS = {}, FD = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  C.fns.forEach(function(q){ FD[q.id] = q; });
  if (!FD[S.fn]) S.fn = "C1";
  if (["tan", "slopes", "three"].indexOf(S.mode) < 0) S.mode = "tan";
  S.B = S.B || { b:0, c:0 }; S.marks = S.marks || {};
  if (typeof S.x !== "number") S.x = FNDEF.C1.x0;
  var busy = false, pv = null, note = "", markMsg = "", seen = {}, cache = { key:null, F:null }, anim = null, ib = null;
  host.innerHTML = '<div class="cv-ex"><div class="cv-main" data-mv="graph"><p class="eq-cap cv-eq" id="cv-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="cv-panels"></div></div>' +
    '<div class="cv-side"><div class="chips cv-fns" id="cv-fn" role="group" aria-label="Choose a function"></div><div id="cv-build"></div>' +
    '<div class="seg-wrap" id="cv-mode"></div><p class="tiny muted cv-how" id="cv-how"></p>' +
    '<label class="slider cv-sl"><span class="slider-top"><span>Probe, ' + m("x") + '</span><output id="cv-xout"></output></span>' +
    '<input type="range" id="cv-x" min="-4" max="4" step="0.05" style="accent-color:var(--ink)" aria-label="x-value of the probe (Shift + arrow moves by 0.5)"></label>' +
    '<p class="tiny muted">' + C.probeHow + '</p><p class="tiny cv-skip" id="cv-skip" aria-live="polite"></p>' +
    '<div class="q-actions cv-mk"><button type="button" class="btn primary sm" id="cv-mark" data-k="cvmark">' + C.markBtn + '</button><button type="button" class="btn ghost sm" id="cv-clear" data-k="cvclear">' + C.clearBtn + "</button>" +
    '<button type="button" class="chip" id="cv-fact" data-k="cvfact" aria-pressed="false">' + C.factBtn + "</button></div>" +
    '<p class="tiny cv-mnote" id="cv-mnote" aria-live="polite"></p><dl class="read cv-read" id="cv-read" aria-live="polite"></dl>' +
    '<details class="cv-sum" id="cv-sum"><summary>' + C.summaryLabel + '</summary><dl class="read" id="cv-read2" aria-live="polite"></dl></details></div></div>' +
    '<div class="cv-ibbox"><h3 class="cv-ibh">' + C.ibTitle + '</h3><p class="tiny muted">' + C.ibText + '</p><div id="cv-ib"></div></div>';
  function fnKey(){ return S.fn === "B" ? "B" + S.B.b + "|" + S.B.c : S.fn; }
  function F(){ var k = fnKey(); if (cache.key !== k) { cache.key = k; cache.F = makeFn(S.fn, S.B); } return cache.F; }
  function marks(){ return S.marks[S.fn] || (S.marks[S.fn] = []); }
  function seenKeys(){ return seen[fnKey()] || (seen[fnKey()] = {}); }
  function visible(i){ var k = KINDS[i]; return k === "f" || k === "strip" || (k === "d1" && S.mode !== "tan") || (k === "d2" && S.mode === "three"); }
  function stateAt(x){
    var Fn = F(), A = Fn.A;
    if (Fn.vert != null && near(x, Fn.vert)) return "vert";
    var poi = A.pois.filter(function(q){ return near(q.x, x, 1e-9); })[0]; if (poi) return "poi";
    var d2 = Fn.d2(x); if (!isFinite(d2)) return "gap";
    if (Math.abs(d2) < 1e-9) { var s = sgn(Fn.d2(x + 0.01)); return s > 0 ? "upBoth" : s < 0 ? "downBoth" : "flat"; }
    return d2 > 0 ? "up" : "down";
  }
  var STLAB = { up:"∪ concave up", down:"∩ concave down", poi:"the tangent crosses the curve", vert:"the vertical tangent crosses the curve", upBoth:"∪ above the tangent on both sides", downBoth:"∩ below the tangent on both sides", flat:"", gap:"" };
  function src(k){ var Fn = F(), q = FD[S.fn];
    if (S.fn === "B") { var b = S.B.b, c = S.B.c;
      if (S.fact) return k === "f" ? "x^2(" + pSrc([c, b, 1]) + ")" : k === "d1" ? "x(" + pSrc([2 * c, 3 * b, 4]) + ")" : "2(" + pSrc([c, 3 * b, 6]) + ")";
      return pSrc(k === "f" ? Fn.p : k === "d1" ? Fn.p1 : Fn.p2); }
    return S.fact && q[k + "x"] ? q[k + "x"] : q[k]; }
  function fnPlain(){ return MV.plain(m("y = " + src("f"))); }
  // ---- scenes ----
  function drawPanel(i, pl, x){
    var k = KINDS[i], Fn = F(), A = Fn.A, ink = css("--ink"), ink2 = css("--ink-2"), XV = { xmin:Fn.view.xmin, xmax:Fn.view.xmax };
    if (k === "strip") {
      drawStrip(pl, { view:XV, F:Fn, A:A, keys:seenKeys(), describe:"Concavity strip, filled in where the probe has been: " + (Object.keys(seenKeys()).length ? "solid with a cup where the slopes increase, hatched with a cap where they decrease." : "nothing yet.") });
      return;
    }
    var asym = pv && pv.hideAsym ? [] : Fn.asym.map(function(a){ return { x:a, label:k === "f" ? null : "" }; });
    if (k === "f") {
      var V = Fn.view, y = Fn.f(x), d = Fn.d1(x), okT = isFinite(d) && isFinite(y), yc = clamp(y, V.ymin, V.ymax), right = (x - V.xmin) / (V.xmax - V.xmin) > 0.55, st = stateAt(x);
      var sc = { view:V, yLabel:"y", asymptotes:asym, regions:[], curves:[{ f:Fn.f, color:css("--pen"), width:3 }], lines:[], segments:[], points:[], labels:[] };
      if (okT && S.mode === "tan") {
        var w = Math.min(1, 0.2 * (V.xmax - V.xmin)), a = Math.max(V.xmin, x - w), b = Math.min(V.xmax, x + w), T = function(t){ return y + d * (t - x); };
        (Fn.gaps || []).forEach(function(g){ if (g > x && g < b) b = g - 0.12; if (g < x && g > a) a = g + 0.12; });
        sc.regions.push({ f:Fn.f, g:T, x0:a, x1:b, where:"above", color:css("--hi-soft") }, { f:Fn.f, g:T, x0:a, x1:b, where:"below", color:hatch(pl.ctx) });
      }
      if (okT) sc.lines.push({ p:[x, y], q:[x + 1, y + d], color:ink, width:2 });
      else if (st === "vert") sc.segments.push({ x1:x, y1:V.ymin, x2:x, y2:V.ymax, color:ink, width:2 });
      if (S.mode === "three") A.cuts.forEach(function(c){ if (c.t !== "gap" && isFinite(Fn.f(c.x))) sc.points.push({ x:c.x, y:Fn.f(c.x), r:7, open:true, color:ink2 }); });
      marks().forEach(function(mx){
        var my = Fn.f(mx), ok = A.pois.some(function(q){ return near(q.x, mx, 1e-6); });
        if (!isFinite(my)) return;
        sc.points.push(ok ? { x:mx, y:my, r:6, color:ink, ring:true } : { x:mx, y:my, r:6, open:true, color:ink });
        sc.labels.push({ x:mx, y:clamp(my, V.ymin, V.ymax), text:ok ? "point of inflection" : "marked", dx:10, dy:my > (V.ymin + V.ymax) / 2 ? 20 : -20, align:"left", bg:true, font:ui(12) });
      });
      if (isFinite(y) && y === yc) sc.points.push({ x:x, y:y, r:6, color:ink, ring:true });
      if (isFinite(y)) sc.labels.push({ x:x, y:yc, text:dpSlopeLabel(d), dx:right ? -14 : 14, dy:yc > V.ymax - (V.ymax - V.ymin) * 0.3 ? 24 : -22, align:right ? "right" : "left", bg:true, font:ui(13) });
      if (STLAB[st]) sc.labels.push({ x:clamp(x, V.xmin + (V.xmax - V.xmin) * 0.18, V.xmax - (V.xmax - V.xmin) * 0.18), y:V.ymax, text:STLAB[st], dy:14, align:"center", bg:true, font:ui(14) });
      if (pv && pv.marks) pv.marks.forEach(function(q){ sc.points.push({ x:q.x, y:q.y, r:9, open:true, color:ink }); sc.labels.push({ x:q.x, y:q.y, text:q.text, dx:q.dx == null ? 14 : q.dx, dy:q.dy == null ? 22 : q.dy, align:q.align || "left", bg:true, font:ui(13) }); });
      sc.after = function(ctx, p){
        probeLine(ctx, p, x); dpEdge(ctx, p, x, y, ink);
        if (S.mode === "slopes") miniTangents(ctx, p, Fn);
        if (pv && pv.asymNote && !pv.hideAsym) { ctx.save(); ctx.font = ui(13); ctx.fillStyle = ink; ctx.textAlign = "left"; ctx.textBaseline = "middle"; var X0 = p.X(0) + 8, tx = "x = 0: not in the domain"; var tw = ctx.measureText(tx).width; ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(X0 - 3, p.H * 0.62 - 10, tw + 6, 20); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.fillText(tx, X0, p.H * 0.62); ctx.restore(); }
      };
      sc.describe = describeTop(x, st);
      pl.draw(sc);
      return;
    }
    var one = k === "d1", g = one ? Fn.d1 : Fn.d2, col = css(one ? "--f3" : "--f4"), gy = g(x), VV = one ? Fn.v1 : Fn.v2;
    var s2 = { view:{ xmin:XV.xmin, xmax:XV.xmax, ymin:VV.ymin, ymax:VV.ymax }, yLabel:one ? "f′(x)" : "f″(x)", asymptotes:asym, curves:[{ f:g, color:col, width:one ? 2.6 : 2.4 }], points:[], labels:[] };
    if (!one && S.mode === "three") A.cuts.forEach(function(c){ if (c.t === "gap") return; s2.points.push({ x:c.x, y:0, r:7, open:true, color:ink }); if (c.t === "undef") s2.labels.push({ x:c.x, y:0, text:"undefined", dx:10, dy:16, align:"left", bg:true, font:ui(12) }); });
    if (one && S.mode === "slopes") slopeXs(Fn).forEach(function(sx){ var v = Fn.d1(sx); if (isFinite(v)) s2.points.push({ x:sx, y:v, r:3.2, color:col }); });
    if (isFinite(gy) && gy >= VV.ymin && gy <= VV.ymax) s2.points.push({ x:x, y:gy, r:5.5, color:col, ring:true });
    else if (!isFinite(gy) && Fn.vert != null && near(x, Fn.vert)) s2.labels.push({ x:x, y:(VV.ymin + VV.ymax) / 2, text:"undefined at x = 0", dx:10, align:"left", bg:true, font:ui(12) });
    s2.after = function(ctx, p){ probeLine(ctx, p, x); dpEdge(ctx, p, x, gy, col); };
    s2.describe = (one ? "f′" : "f″") + "(x) = " + MV.plain(m(src(k))) + "; at x = " + num(x, 2) + " it is " + (isFinite(gy) ? MV.plain(dec(gy, 3)) : "undefined") + "." +
      (!one && S.mode === "three" && A.cuts.length ? " Candidates (hollow rings) at x = " + A.cuts.filter(function(c){ return c.t !== "gap"; }).map(function(c){ return cutTxt(c); }).join(", ") + "." : "");
    pl.draw(s2);
  }
  function slopeXs(Fn){ var out = []; for (var k = Math.ceil(Fn.lo * 2 - 1e-9); k <= Math.floor(Fn.hi * 2 + 1e-9); k++) { var sx = k / 2; if (!(Fn.excl || []).some(function(e){ return near(e, sx); })) out.push(sx); } return out; }
  function miniTangents(ctx, p, Fn){
    var xs = slopeXs(Fn), ink2 = css("--ink-2"), ink = css("--ink"), gap = Math.abs(p.X(0.5) - p.X(0)), every = gap < 34 ? 2 : 1;
    ctx.save(); ctx.lineCap = "round";
    xs.forEach(function(sx, j){
      var y = Fn.f(sx), d = Fn.d1(sx); if (!isFinite(y)) return;
      var X = p.X(sx), Y = p.Y(y); if (Y < -5 || Y > p.H + 5) return;
      var ux, uy;
      if (isFinite(d)) { ux = p.X(sx + 1) - p.X(sx); uy = p.Y(y + d) - p.Y(y); } else { ux = 0; uy = 1; }
      var L = Math.sqrt(ux * ux + uy * uy) || 1, h = Math.min(15, gap * 0.42); ux = ux / L * h; uy = uy / L * h;
      ctx.strokeStyle = ink2; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(X - ux, Y - uy); ctx.lineTo(X + ux, Y + uy); ctx.stroke();
      ctx.fillStyle = ink2; ctx.beginPath(); ctx.arc(X, Y, 2.4, 0, Math.PI * 2); ctx.fill();
      if (j % every) return;
      var t = isFinite(d) ? num(r9(Math.round(d * 10) / 10), 1) : "∞", below = Y < 26;
      ctx.font = ui(11); ctx.textAlign = "center"; ctx.textBaseline = below ? "top" : "bottom";
      var tw = ctx.measureText(t).width, ty = below ? Y + 9 : Y - 9;
      ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.8; ctx.fillRect(X - tw / 2 - 2, below ? ty : ty - 13, tw + 4, 13); ctx.globalAlpha = 1;
      ctx.fillStyle = ink; ctx.fillText(t, X, ty);
    });
    ctx.restore();
  }
  function describeTop(x, st){
    var Fn = F(), A = Fn.A, fl = {}, ct = concTxt(A, fl), pois = A.pois.length ? "Points of inflection at " + A.pois.map(function(q){ return poiTxt(q, fl); }).join(" and ") + "." : "No points of inflection.";
    return "Graph of " + fnPlain() + ". Concave " + ct.replace("; down", ", concave down") + ". " + pois + " Probe at x = " + num(x, 2) + (STLAB[st] ? ": " + STLAB[st].replace(/^[∪∩] /, "") + "." : ".") +
      (marks().length ? " Marked at x = " + marks().map(function(v){ return num(v, 2); }).join(", ") + "." : "");
  }
  var dp = derivativePanels($("#cv-panels", host), { kinds:KINDS, x:S.x, step:0.05,
    dom:function(){ var Fn = F(); return { lo:Fn.lo, hi:Fn.hi, excl:Fn.excl }; },
    draw:drawPanel,
    handle:function(x){ var Fn = F(), y = Fn.f(x), V = Fn.view; return { x:x, y:isFinite(y) ? clamp(y, V.ymin, V.ymax) : 0, label:"Probe at x = " + num(x, 2) + ". Arrow keys move it by 0.05; Shift moves it by 0.5." }; },
    locked:function(){ return busy; },
    onMove:function(x, how, prev, skipped){
      S.x = x; var sk = seenKeys(), k1 = Math.round(x * 20);
      if (prev != null && how !== "set" && Math.abs(x - prev) <= 0.55) { for (var k0 = Math.round(Math.min(x, prev) * 20); k0 <= Math.round(Math.max(x, prev) * 20); k0++) sk[k0] = 1; }
      sk[k1] = 1;
      if (skipped != null) note = C.skip; else if (how !== "anim") note = "";
      if (how !== "anim" && how !== "set") markMsg = "";
      api.save(); syncSlider(); paintRead(); MV.changed();
    } });
  // ---- captions, readouts, controls ----
  function sw(v){ return '<span class="cv-sw" style="background:var(' + v + ')" aria-hidden="true"></span>'; }
  function paintCaps(){
    dp.caps[0].innerHTML = sw("--pen") + m("f(x) = " + src("f"));
    dp.caps[1].innerHTML = "<span>" + C.stripCap + "</span>";
    dp.caps[2].innerHTML = sw("--f3") + m("f′(x) = " + src("d1"));
    dp.caps[3].innerHTML = sw("--f4") + m("f″(x) = " + src("d2"));
  }
  function atProbe(){
    var Fn = F(), x = dp.get(), q = Q.of(Math.round(x * 20), 20), parts;
    if (Fn.poly) parts = [valQ(Fn.fq(q)), valQ(Fn.d1q(q)), valQ(Fn.d2q(q))];
    else if (Fn.d1q) parts = [valQ(Fn.fq(q)), valQ(Fn.d1q(q)), valQ(Fn.d2q(q))];
    else { var v = [Fn.f(x), Fn.d1(x), Fn.d2(x)]; parts = v.map(function(t, j){ return isFinite(t) ? dec(t, 4) : j === 1 ? "undefined (vertical tangent)" : "undefined"; }); }
    return m("f") + " = " + parts[0] + ", " + m("f′") + " = " + parts[1] + ", " + m("f″") + " = " + parts[2];
  }
  function paintRead(){
    var Fn = F(), A = Fn.A, x = dp.get(), st = stateAt(x), R = C.rows, VS = C.vs, SL = C.slopes, rows = [];
    rows.push([R.fx, m(src("f"))], [R.d1, m(src("d1"))], [R.d2, m(src("d2"))], [R.at + " (" + m("x = " + nmS(x).replace(MINUS, "-")) + ")", atProbe()]);
    var vs = { up:VS.up, down:VS.down, poi:VS.cross, vert:VS.vert, upBoth:VS.upBoth, downBoth:VS.downBoth }[st] || "not on the graph";
    var poi = A.pois.filter(function(q){ return near(q.x, x, 1e-9); })[0];
    var sl = { up:SL.up, down:SL.down, vert:SL.undef, upBoth:SL.flatUp, downBoth:SL.flatDown }[st];
    if (!sl && poi) { var s1 = sgn(Fn.d1(x)); sl = (poi.from < 0 ? SL.fmin : SL.fmax) + (s1 === 0 ? SL.flatPt : (poi.from < 0) === (s1 < 0) ? (s1 < 0 ? SL.steepDown : SL.steepUp) : SL.least); }
    if (!sl) sl = "undefined here";
    rows.push([R.vs, vs], [R.slopes, sl]);
    $("#cv-read", host).innerHTML = MV.readoutHTML(rows);
    var fl = {}, ivs = concTxt(A, fl), pt;
    if (A.pois.length) pt = A.pois.map(function(q){ return poiTxt(q, fl); }).join(", ");
    else if (A.flat.length) pt = tpl(C.none.zero, { x:A.flat.map(function(c){ return cutTxt(c, fl); }).join(" and ") });
    else if (A.gapCh.length) pt = tpl(C.none.domain, { x:A.gapCh.map(function(c){ return cutTxt(c, fl); }).join(" and ") });
    else pt = C.none.never;
    $("#cv-read2", host).innerHTML = MV.readoutHTML([[R.ivs, ivs + (fl.approx ? ' <span class="tiny muted">(rounded to 2 decimal places)</span>' : "")], [R.pois, MV.md(pt)]]);
  }
  function syncSlider(){
    var Fn = F(), sl = $("#cv-x", host); sl.min = Fn.lo; sl.max = Fn.hi; sl.value = dp.get();
    $("#cv-xout", host).textContent = num(dp.get(), 2); $("#cv-skip", host).innerHTML = note; $("#cv-mnote", host).innerHTML = markMsg;
  }
  function paintTop(){
    $("#cv-eq", host).innerHTML = (S.fn === "B" ? "Build: " : "<strong>" + S.fn + "</strong>: ") + m("f(x) = " + src("f"));
    MV.keepFocus($("#cv-fn", host), function(){
      $("#cv-fn", host).innerHTML = C.fns.map(function(c){ var on = c.id === S.fn; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-fn="' + c.id + '" data-k="fn' + c.id + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">" + (c.form ? "<strong>" + c.chip + "</strong> " + c.form : "<strong>" + c.id + "</strong> " + c.chip) + "</button>"; }).join("");
    });
    MV.keepFocus($("#cv-mode", host), function(){ $("#cv-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode", busy); });
    $("#cv-how", host).innerHTML = C.modeHow[S.mode];
    var bEl = $("#cv-build", host), want = S.fn === "B" ? "B" : "";
    if (bEl.dataset.on !== want) {
      bEl.dataset.on = want;
      bEl.innerHTML = !want ? "" : '<div class="cv-bsl">' + ["b", "c"].map(function(k){
        return '<label class="slider"><span class="slider-top"><span>' + m(k) + '</span><output id="cv-' + k + 'out">' + num(S.B[k]) + '</output></span><input type="range" data-bk="' + k + '" min="-20" max="20" step="1" value="' + S.B[k] + '" style="accent-color:var(--ink)" aria-label="' + k + ' (−20 to 20)"></label>';
      }).join("") + '</div><p class="tiny muted">' + C.buildNote + "</p>";
    }
    $$("#cv-build input", host).forEach(function(inp){ inp.disabled = busy; });
    $("#cv-x", host).disabled = busy;
    ["#cv-mark", "#cv-clear", "#cv-fact"].forEach(function(s){ $(s, host).disabled = busy; });
    $("#cv-fact", host).setAttribute("aria-pressed", String(!!S.fact)); $("#cv-fact", host).classList.toggle("on", !!S.fact);
  }
  function paintAll(){ paintTop(); dp.layout(visible); paintCaps(); syncSlider(); paintRead(); dp.render(); }
  // ---- events ----
  function chooseFn(id){ S.fn = id; note = ""; markMsg = ""; api.save(); dp.set(S.x, "set"); paintAll(); MV.changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.classList.contains("drag-h") || b.closest("#cv-ib")) return;
    if (busy) return;
    if (b.dataset.fn) { chooseFn(b.dataset.fn); return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; api.save(); paintAll(); MV.changed(); return; }
    if (b.id === "cv-fact") { S.fact = !S.fact; api.save(); paintAll(); return; }
    if (b.id === "cv-clear") { S.marks[S.fn] = []; markMsg = C.markNote.cleared; api.save(); syncSlider(); dp.render(); MV.changed(); return; }
    if (b.id === "cv-mark") {
      var x = dp.get(), L = marks(), at = L.filter(function(v){ return near(v, x, 1e-9); })[0];
      if (at != null) { L.splice(L.indexOf(at), 1); markMsg = C.markNote.off; }
      else { L.push(x); L.sort(function(a, c){ return a - c; }); markMsg = F().A.pois.some(function(q){ return near(q.x, x, 1e-6); }) ? C.markNote.yes : C.markNote.no; }
      api.save(); syncSlider(); dp.render(); MV.changed();
    }
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.bk; if (!k || busy) return;
    S.B[k] = +e.target.value; $("#cv-" + k + "out", host).textContent = num(S.B[k]); S.marks.B = [];
    api.save(); dp.set(S.x, "set"); paintTop(); paintCaps(); paintRead(); dp.render(); MV.changed();
  });
  var sl = $("#cv-x", host);
  sl.addEventListener("input", function(){ if (busy) { syncSlider(); return; } dp.set(+sl.value, "slider"); syncSlider(); });
  sl.addEventListener("keydown", function(e){
    if (busy) { e.preventDefault(); return; }
    if (e.shiftKey && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) { e.preventDefault(); dp.set(dp.get() + (/Left|Down/.test(e.key) ? -0.5 : 0.5), "slider"); syncSlider(); }
  });
  // ---- interval builder (challenge 2) ----
  ib = MV.intervalBuilder($("#cv-ib", host), { min:-2, max:6, maxPieces:1, modes:false, test:false, readout:false, halfToggle:false, caption:true, aria:"Interval builder for challenge 2",
    pieces:[{ a:0, b:5, aIn:true, bIn:true }], onChange:function(st){ S.ibs = st; api.save(); MV.changed(); } });
  if (S.ibs) ib.set(S.ibs, true);
  seenKeys()[Math.round(S.x * 20)] = 1;
  dp.set(S.x, "set");
  paintAll();

  // ---- predictions ----
  var START = { p1:{ fn:"C1", x:0.5 }, p2:{ fn:"C3", x:-1.5 }, p3:{ fn:"C4", x:-2 }, p4:{ fn:"C5", x:-2.5, hideAsym:true } };
  function sweep(a, b, dur, cb){ anim = MV.tween({ dur:dur, ease:lin, step:function(t){ dp.set(a + (b - a) * t, "anim"); }, done:function(){ anim = null; dp.set(b, "anim"); cb(); } }); }
  function chal(id){
    var M = MS[id];
    if (id === "tc1") {
      if (S.fn !== "C2") return { ok:false, msg:M.fn };
      var L = S.marks.C2 || [], R3 = Math.sqrt(3);
      if (!L.length) return { ok:false, msg:M.none };
      if (L.some(function(v){ return near(v, 0, 0.051); })) return { ok:false, msg:M.zero };
      if (L.some(function(v){ return near(Math.abs(v), R3, 0.051); })) return { ok:false, msg:M.mins };
      var other = L.filter(function(v){ return !near(Math.abs(v), 1, 0.051); })[0];
      if (other != null) return { ok:false, msg:tpl(M.other, { x:m("x = " + nmS(other).replace(MINUS, "-")) }) };
      var neg = L.some(function(v){ return near(v, -1, 0.051); }), pos = L.some(function(v){ return near(v, 1, 0.051); });
      return neg && pos ? { ok:true } : { ok:false, msg:M.one };
    }
    if (id === "tc2") {
      var P = ib.iv()[0]; if (!P) return { ok:false, msg:M.general };
      if (P.a === 2 && P.b === 3) return P.aIn || P.bIn ? { ok:false, msg:M.closed } : { ok:true };
      if (P.a === 1 && P.b === 3 && !P.aIn && !P.bIn) return { ok:false, msg:M.dec };
      if (P.a === 2 && P.b === Infinity && !P.aIn) return { ok:false, msg:M.up };
      return { ok:false, msg:M.general };
    }
    if (id === "tc3") {
      if (S.fn !== "B") return { ok:false, msg:M.fn };
      var b = S.B.b, c = S.B.c, v1 = 12 + 6 * b + 2 * c, v3 = 108 + 18 * b + 2 * c;
      if (b === -8 && c === 18) return { ok:true };
      if (b === -4 && c === 3) return { ok:false, msg:M.quad };
      if (b === 8 && c === 18) return { ok:false, msg:M.sign };
      if (v1 === 0 && v3 !== 0) return { ok:false, msg:M.one3 };
      if (v3 === 0 && v1 !== 0) return { ok:false, msg:M.one1 };
      return { ok:false, msg:tpl(M.other, { v1:m(nmS(v1).replace(MINUS, "-")), v3:m(nmS(v3).replace(MINUS, "-")) }) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        busy = true;
        var s = START[p.id]; S.fn = s.fn; S.mode = "tan"; note = ""; markMsg = "";
        pv = { hideAsym:!!s.hideAsym, marks:null };
        seen[fnKey()] = {};
        api.save(); dp.set(s.x, "set"); paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; pv = null; api.save(); paintAll(); MV.changed(); done(); }
        function show(mk, ms){ pv.marks = mk; dp.render(); MV.wait(ms || 1300, fin); }
        if (p.id === "p1") sweep(0.5, 2, 2200, function(){ show([{ x:2, y:3, text:"slope −3: the tangent crosses the curve", dy:-22, dx:14 }]); });
        else if (p.id === "p2") sweep(-1.5, 1.5, 2400, function(){ sweep(1.5, 0, 900, function(){ show([{ x:0, y:0, text:"above the tangent on both sides", dy:-26, dx:14 }]); }); });
        else if (p.id === "p3") sweep(-2, 2, 2600, function(){ sweep(2, 0, 1000, function(){ show([{ x:0, y:0, text:"concavity changes at (0, 0)", dy:24, dx:14 }]); }); });
        else if (p.id === "p4") sweep(-2.5, -0.5, 1400, function(){ dp.set(0.5, "anim"); sweep(0.5, 2.5, 1400, function(){ pv.hideAsym = false; pv.asymNote = true; dp.render(); MV.wait(1500, fin); }); });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// @component radioGroup (copied from MCV4U 05) — real radio buttons (role="radio", arrow keys move the choice; with nothing chosen
// the first option holds the tab stop). radios(host, {aria, options:[{id, t}], value, onChange(id)}) -> {set(id), get(), lock(bool)}
function radios(host, o){
  var val = o.value == null ? null : String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="cv-rg" role="radiogroup" aria-label="' + MV.esc(o.aria) + '">' + o.options.map(function(x, i){
      var on = String(x.id) === val, tab = on || (val == null && i === 0);
      return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? " disabled" : "") + ">" + x.t + "</button>";
    }).join("") + "</span>";
    if (f) { var b = host.querySelector('[data-rg="' + (val == null ? o.options[0].id : val) + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ if (locked) return; id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), cur = ids.indexOf(val == null ? b.dataset.rg : val);
    choose(ids[(cur + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ id = id == null ? null : String(id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, lock:function(v){ v = !!v; if (v !== locked) { locked = v; paint(); } } };
}

// =====================================================================================================================
// @component V11 signChart (adapted from MCV4U 14: a derivative chart for f′ or f″) — one row per factor of the numerator and
// denominator, the sign row, and a behaviour row: ↗ / ↘ for f (from f′) or ∪ / ∩ for concavity (from f″). Points are "zero"
// (0), "undef" (undefined) or "nd" (not in the domain). The table scrolls inside its box on phones.
//   signChartHTML({ top:[{s, f, z:[x]}], bot:[…], d(x), pts:[{x, t}], dLabel, beh:"f′" | "f″", ptBeh(pt) })
function signChartHTML(o){
  var pts = o.pts.slice().sort(function(a, b){ return a.x - b.x; }), edges = [-Infinity].concat(pts.map(function(p){ return p.x; }), [Infinity]), cols = [], i;
  for (i = 0; i + 1 < edges.length; i++) { cols.push({ iv:true, a:edges[i], b:edges[i + 1], mid:midOf(edges[i], edges[i + 1]) }); if (i < pts.length) cols.push({ iv:false, x:pts[i].x, t:pts[i].t }); }
  function end(v){ return v === -Infinity ? MINUS + "∞" : v === Infinity ? "∞" : nmS(v); }
  function sg(v){ return v > 1e-12 ? "+" : v < -1e-12 ? MINUS : "0"; }
  function frow(F, kind){
    return '<tr><th scope="row">' + m(F.s) + '<span class="cv-sc-k">' + kind + "</span></th>" + cols.map(function(c){
      return "<td" + (c.iv ? "" : ' class="cv-sc-p"') + ">" + (c.iv ? sg(F.f(c.mid)) : F.z.some(function(z){ return near(z, c.x); }) ? "0" : sg(F.f(c.x))) + "</td>";
    }).join("") + "</tr>";
  }
  var h = '<div class="tbl-wrap cv-sc-wrap"><table class="vt cv-sct"><caption class="vh">Sign chart of ' + MV.plain(o.dLabel) + '</caption><thead><tr><th scope="col">' + m("x") + "</th>" +
    cols.map(function(c){ return '<th scope="col">' + (c.iv ? "(" + end(c.a) + ", " + end(c.b) + ")" : end(c.x)) + "</th>"; }).join("") + "</tr></thead><tbody>";
  h += o.top.map(function(F){ return frow(F, "numerator"); }).join("") + (o.bot || []).map(function(F){ return frow(F, "denominator"); }).join("");
  h += '<tr class="cv-sc-d"><th scope="row">' + o.dLabel + "</th>" + cols.map(function(c){ return c.iv ? "<td>" + sg(o.d(c.mid)) + "</td>" : '<td class="cv-sc-u">' + (c.t === "zero" ? "0" : "undefined") + "</td>"; }).join("") + "</tr>";
  var conc = o.beh === "f″";
  h += '<tr class="cv-sc-b"><th scope="row">' + (conc ? "Concavity of " + m("f") : m("f")) + "</th>" + cols.map(function(c){
    if (c.iv) { var up = o.d(c.mid) > 0; return '<td class="cv-sc-ar"><span aria-hidden="true">' + (conc ? (up ? "∪" : "∩") : (up ? "↗" : "↘")) + '</span><span class="cv-sc-w">' + (conc ? (up ? "concave up" : "concave down") : (up ? "increasing" : "decreasing")) + "</span></td>"; }
    return '<td class="cv-sc-u">' + (o.ptBeh ? o.ptBeh(c) : c.t === "nd" ? "not in the domain" : "") + "</td>";
  }).join("") + "</tr></tbody></table></div>";
  return h;
}
// ------------------------------------------------- end of V11 signChart ---------------------------------------------------------

// draws a cup (∪) under or a cap (∩) over a point, with a label
function cupCap(ctx, p, x, y, kind, text, side){
  var X = p.X(x), Y = p.Y(y), ink = css("--ink"); if (!isFinite(X) || !isFinite(Y)) return;
  ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath();
  if (kind === "cap") ctx.arc(X, Y + 4, 16, Math.PI * 1.08, Math.PI * 1.92); else ctx.arc(X, Y - 4, 16, Math.PI * 0.08, Math.PI * 0.92);
  ctx.stroke();
  if (text) { ctx.font = ui(13); var tw = ctx.measureText(text).width, ty = kind === "cap" ? Y - 30 : Y + 30, tx = clamp(X + (side || 0) * (tw / 2 + 8), tw / 2 + 4, p.W - tw / 2 - 4); ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(tx - tw / 2 - 3, ty - 10, tw + 6, 20); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, tx, ty); }
  ctx.restore();
}

// ---------- Part 3: the second derivative test (N13 stationStepper for x + 1/x) ----------
var P3F = { f:function(x){ return x * x * x - 3 * x * x; } };
var CARDF = { a:function(x){ return Math.pow(x, 4); }, b:function(x){ return -Math.pow(x, 4); }, c:function(x){ return x * x * x; } };
var CARDS = { a:{ L:MINUS, R:"+" }, b:{ L:"+", R:MINUS }, c:{ L:"+", R:"+" } };
var GF = function(x){ return Math.abs(x) < 1e-12 ? NaN : x + 1 / x; };
var NF = function(t){ return -t * t * t + 9 * t * t + 3 * t; }, NF1 = function(t){ return -3 * t * t + 18 * t + 3; }, NF2 = function(t){ return -6 * t + 18; };
function part3(host, api){
  var S = api.S, C = api.content, A = C.st1, B = C.st2, G = C.st3;
  S.s1 = S.s1 || {}; S.s2 = S.s2 || {}; S.s3 = S.s3 || {};
  if (typeof S.s3.t !== "number") S.s3.t = 1;
  var msg3 = null;
  host.innerHTML =
    '<div class="part cv-st" id="cv-st1"><h3>' + A.title + "</h3><p>" + A.text + '</p><div class="sym cv-s1"><div><div class="plot-wrap"><canvas class="plot" id="cv-s1p" role="img" aria-label="Graph of y = x³ − 3x²"></canvas></div></div><div>' +
      A.pts.map(function(pt, i){ return '<div class="cv-cpt" data-pt="' + i + '"><p class="cv-cl"><strong>At ' + pt.label + ":</strong></p><div class=\"cv-rgh\"></div><div class=\"q-actions\"><button type=\"button\" class=\"btn primary sm\" data-rev1=\"" + i + '" data-k="rev1' + i + '">Reveal</button></div><div class="cv-fb1" aria-live="polite"></div></div>'; }).join("") +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + A.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + '</div><div id="cv-sc1"></div></details></div></div></div>' +
    '<div class="part cv-st" id="cv-st2"><h3>' + B.title + "</h3><p>" + B.text + '</p><div class="cv-cards">' +
      B.cards.map(function(c){ return '<div class="cv-card" data-card="' + c.id + '"><p class="cv-cf">' + c.f + '</p><div class="plot-wrap"><canvas class="plot" role="img" aria-label="Graph hidden until you reveal it"></canvas></div><div class="cv-rgh"></div><div class="q-actions"><button type="button" class="btn primary sm" data-rev2="' + c.id + '" data-k="rev2' + c.id + '">Reveal</button></div><div class="cv-fb2" aria-live="polite"></div></div>'; }).join("") +
      '</div><div id="cv-s2done" aria-live="polite"></div></div>' +
    '<div class="part cv-st" id="cv-st3"><h3>' + G.title + "</h3><p>" + G.textA + '</p><div class="sym cv-s3"><div><ol class="cv-steps" id="cv-steps" aria-live="polite"></ol><div id="cv-pl"></div>' +
      '<details class="alg"><summary>Check it with algebra</summary><div id="cv-sc3"></div></details></div>' +
      '<div><div class="plot-wrap"><canvas class="plot" id="cv-s3p" role="img" aria-label="Graph of y = x + 1/x"></canvas></div></div></div>' +
      "<p>" + G.textB + '</p><div class="sym cv-s3b"><div><p class="cv-pcap">' + '<span class="cv-sw" style="background:var(--pen)" aria-hidden="true"></span>' + m("N(t)") + '</p><div class="plot-wrap"><canvas class="plot cv-c-n" id="cv-np" role="img" aria-label="Graph of N(t)"></canvas></div>' +
      '<p class="cv-pcap"><span class="cv-sw" style="background:var(--f3)" aria-hidden="true"></span>' + m("N′(t)") + '</p><div class="plot-wrap"><canvas class="plot cv-c-n1" id="cv-n1p" role="img" aria-label="Graph of N′(t)"></canvas></div></div>' +
      '<div><label class="slider"><span class="slider-top"><span>Time, ' + m("t") + ' (days)</span><output id="cv-tout"></output></span><input type="range" id="cv-t" min="0" max="6" step="0.1" style="accent-color:var(--ink)" aria-label="Time t in days"></label>' +
      '<dl class="read" id="cv-nread" aria-live="polite"></dl><div class="q-actions"><button type="button" class="btn primary sm" id="cv-fast" data-k="cvfast">This is the fastest growth</button></div><div id="cv-fb3" aria-live="polite"></div>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + G.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details></div></div></div>";
  // ---- Station 1 ----
  var V1 = { xmin:-1.3, xmax:3.3, ymin:-6, ymax:2.6 }, p1 = new MV.Plot($("#cv-s1p", host), V1), rg1 = [];
  function done1(){ return A.pts.every(function(pt, i){ return S.s1[i] && S.s1[i].rev; }); }
  function draw1(){
    var ink = css("--ink"), both = done1(), sc = { view:V1, yLabel:"y", xTicks:{ step:1 }, yTicks:{ step:1 }, curves:[{ f:P3F.f, color:css("--pen"), width:3 }], points:[], labels:[], bands:[] };
    if (both) sc.bands.push({ x0:1, x1:V1.xmax, color:css("--hi-soft") });
    A.pts.forEach(function(pt, i){ var r = S.s1[i] && S.s1[i].rev; sc.points.push(r ? { x:pt.x, y:pt.y, r:5.5, color:ink } : { x:pt.x, y:pt.y, r:7, open:true, color:ink }); });
    if (both) sc.points.push({ x:1, y:-2, r:5, open:true, color:ink });
    sc.after = function(ctx, p){
      if (both) { ctx.save(); ctx.beginPath(); ctx.rect(p.X(V1.xmin), 0, p.X(1) - p.X(V1.xmin), p.H); ctx.clip(); ctx.globalAlpha = 0.6; ctx.fillStyle = hatch(ctx); ctx.fillRect(0, 0, p.W, p.H); ctx.restore();
        ctx.save(); ctx.font = ui(12); ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("∩ concave down", p.X(0), p.H - 6); ctx.fillText("∪ concave up", p.X(2.3), p.H - 6); ctx.restore(); p.curve({ f:P3F.f, color:css("--pen"), width:3 }); }
      A.pts.forEach(function(pt, i){ if (S.s1[i] && S.s1[i].rev) cupCap(ctx, p, pt.x, pt.y, MV.ans(pt), MV.ans(pt) === "cap" ? "cap: local max" : "cup: local min"); });
    };
    sc.describe = "Graph of y = x³ − 3x² with critical points at (0, 0) and (2, −4)." + A.pts.map(function(pt, i){ return S.s1[i] && S.s1[i].rev ? " At x = " + pt.x + ": a " + MV.ans(pt) + "." : ""; }).join("") + (both ? " Concave down for x < 1 (hatched), concave up for x > 1 (shaded); (1, −2) is a point of inflection." : "");
    p1.draw(sc);
  }
  p1.render = draw1;
  function paint1(){
    A.pts.forEach(function(pt, i){
      var st = S.s1[i] || {}, box = $('[data-pt="' + i + '"]', host), fb = $(".cv-fb1", box);
      rg1[i].lock(!!st.rev); $("[data-rev1]", box).hidden = !!st.rev;
      if (st.rev) fb.innerHTML = MV.fbHTML(st.ch === MV.ans(pt) ? "good" : "bad", st.ch === MV.ans(pt) ? "<strong>✓ Correct.</strong> " + MV.md(pt.right) : "<strong>✗ Not quite.</strong> " + MV.md(pt.wrong));
      else if (st.need) fb.innerHTML = MV.fbHTML("", "Choose cup or cap first.");
      else fb.innerHTML = "";
    });
    draw1();
  }
  A.pts.forEach(function(pt, i){
    var box = $('[data-pt="' + i + '"]', host);
    rg1[i] = radios($(".cv-rgh", box), { aria:C.radioAria + " at x = " + pt.x, options:A.choices.map(function(c){ return { id:c.id, t:c.t }; }), value:S.s1[i] && S.s1[i].ch,
      onChange:function(id){ var st = S.s1[i] || (S.s1[i] = {}); st.ch = id; st.need = false; api.save(); paint1(); } });
  });
  $("#cv-sc1", host).innerHTML = '<p class="tiny" style="font-weight:700;margin:10px 0 4px">Sign chart of ' + m("f′") + "</p>" + signChartHTML({
    top:[{ s:"3x", f:function(x){ return 3 * x; }, z:[0] }, { s:"x - 2", f:function(x){ return x - 2; }, z:[2] }], d:function(x){ return 3 * x * (x - 2); },
    pts:[{ x:0, t:"zero" }, { x:2, t:"zero" }], dLabel:m("f′(x)"), beh:"f′", ptBeh:function(c){ return c.x === 0 ? "local max" : "local min"; } });
  // ---- Station 2 ----
  var V2 = { xmin:-1.5, xmax:1.5, ymin:-1.8, ymax:1.8 }, p2 = {}, rg2 = {};
  B.cards.forEach(function(c){
    var box = $('[data-card="' + c.id + '"]', host);
    p2[c.id] = new MV.Plot($("canvas", box), V2);
    p2[c.id].render = function(){ draw2(c); };
    rg2[c.id] = radios($(".cv-rgh", box), { aria:"What " + MV.plain(c.f) + " has at x = 0", options:B.choices, value:S.s2[c.id] && S.s2[c.id].ch,
      onChange:function(id){ var st = S.s2[c.id] || (S.s2[c.id] = {}); st.ch = id; st.need = false; api.save(); paint2(); } });
  });
  function draw2(c){
    var st = S.s2[c.id] || {}, ink = css("--ink"), K = CARDS[c.id], sc = { view:V2, xTicks:{ step:1 }, yTicks:{ step:1 }, curves:[], points:[{ x:0, y:0, r:6, open:!st.rev, color:ink }], labels:[] };
    if (st.rev) { sc.curves.push({ f:CARDF[c.id], color:css("--pen"), width:3 }); sc.labels.push({ x:-0.75, y:V2.ymin, text:"f′: " + K.L, dy:-12, align:"center", bg:true, font:ui(13) }, { x:0.75, y:V2.ymin, text:"f′: " + K.R, dy:-12, align:"center", bg:true, font:ui(13) }); }
    else sc.labels.push({ x:0, y:0, text:"?", dx:14, dy:-16, font:ui(20, 700) });
    sc.describe = st.rev ? "Graph of " + c.plain + " near x = 0; f′ is " + (K.L === "+" ? "positive" : "negative") + " on the left and " + (K.R === "+" ? "positive" : "negative") + " on the right." : "The graph of " + c.plain + " is hidden until you reveal it. The point (0, 0) is marked.";
    p2[c.id].draw(sc);
  }
  function paint2(){
    B.cards.forEach(function(c){
      var st = S.s2[c.id] || {}, box = $('[data-card="' + c.id + '"]', host), fb = $(".cv-fb2", box), ok = st.ch === MV.ans(c);
      rg2[c.id].lock(!!st.rev); $("[data-rev2]", box).hidden = !!st.rev;
      fb.innerHTML = st.rev ? MV.fbHTML(ok ? "good" : "bad", "<strong>" + (ok ? B.right : B.wrong) + "</strong> " + MV.md(c.reveal)) : st.need ? MV.fbHTML("", "Choose an answer first.") : "";
      draw2(c);
    });
    var all = B.cards.every(function(c){ return S.s2[c.id] && S.s2[c.id].rev; });
    $("#cv-s2done", host).innerHTML = all ? MV.fbHTML("good", "<strong>The test is silent.</strong> " + MV.md(B.done)) : "";
  }
  // ---- Station 3: x + 1/x step-through ----
  var V3 = { xmin:-4.5, xmax:4.5, ymin:-7, ymax:7 }, p3 = new MV.Plot($("#cv-s3p", host), V3), step = 0;
  function draw3(){
    var ink = css("--ink"), sc = { view:V3, yLabel:"y", asymptotes:[{ x:0, label:"" }], curves:[{ f:GF, color:css("--pen"), width:3 }], points:[], labels:[], regions:[] };
    sc.points.push({ x:-1, y:-2, r:step >= 3 ? 5.5 : 6.5, open:step < 3, color:ink }, { x:1, y:2, r:step >= 2 ? 5.5 : 6.5, open:step < 2, color:ink });
    sc.after = function(ctx, p){
      if (step >= 4) {
        ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = hatch(ctx); ctx.fillRect(0, 0, p.X(0) - 4, p.H); ctx.globalAlpha = 1; ctx.fillStyle = css("--hi-soft"); ctx.globalAlpha = 0.7; ctx.fillRect(p.X(0) + 4, 0, p.W - p.X(0) - 4, p.H); ctx.restore();
        p.curve({ f:GF, color:css("--pen"), width:3 });
        ctx.save(); ctx.font = ui(13); ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText("∩ concave down", p.X(-2.6), 8); ctx.fillText("∪ concave up", p.X(2.6), 8);
        ctx.textBaseline = "bottom"; ctx.fillText("x = 0: not in the domain", p.X(0), p.H - 6); ctx.restore();
      }
      if (step >= 2) cupCap(ctx, p, 1, 2, "cup", "local min (1, 2)", 1);
      if (step >= 3) cupCap(ctx, p, -1, -2, "cap", "local max (−1, −2)", -1);
    };
    sc.describe = "Graph of y = x + 1/x with the asymptote x = 0. Critical points at (−1, −2) and (1, 2)." + (step >= 2 ? " (1, 2) is a local min (a cup)." : "") + (step >= 3 ? " (−1, −2) is a local max (a cap)." : "") + (step >= 4 ? " Concave down for x < 0, concave up for x > 0; no point of inflection, because 0 isn't in the domain." : "");
    p3.draw(sc);
  }
  p3.render = draw3;
  MV.player($("#cv-pl", host), { count:G.steps.length, interval:1700,
    label:function(i){ return "Step " + (i + 1) + " of " + G.steps.length; },
    render:function(i){ step = i; $("#cv-steps", host).innerHTML = G.steps.map(function(t, j){ return j <= i ? '<li class="' + (j === i ? "cur" : "") + '"><span class="sn">' + (j + 1) + ".</span><span>" + MV.md(t) + "</span></li>" : ""; }).join(""); draw3(); } });
  $("#cv-sc3", host).innerHTML = '<p class="tiny" style="font-weight:700;margin:10px 0 4px">Sign chart of ' + m("f″") + "</p>" + signChartHTML({
    top:[{ s:"2", f:function(){ return 2; }, z:[] }], bot:[{ s:"x^3", f:function(x){ return x * x * x; }, z:[0] }], d:function(x){ return 2 / (x * x * x); },
    pts:[{ x:0, t:"nd" }], dLabel:m("f″(x)"), beh:"f″" });
  // ---- Station 3: fastest growth ----
  var VN = { xmin:-0.3, xmax:6.3, ymin:-12, ymax:140 }, VN1 = { xmin:-0.3, xmax:6.3, ymin:-4, ymax:36 };
  var pn = new MV.Plot($("#cv-np", host), VN), pn1 = new MV.Plot($("#cv-n1p", host), VN1);
  function drawN(){
    var t = S.s3.t, ink = css("--ink"), y = NF(t), d = NF1(t), solved = S.s3.solved;
    pn.draw({ view:VN, yLabel:"N", xLabel:"t", xTicks:{ step:1 }, curves:[{ f:NF, color:css("--pen"), width:3, domain:[0, 6] }], lines:[{ p:[t, y], q:[t + 1, y + d], color:ink, width:2 }],
      points:[{ x:t, y:y, r:5.5, color:ink }].concat(solved ? [{ x:3, y:63, r:9, open:true, color:ink }] : []), labels:solved ? [{ x:3, y:63, text:"point of inflection (3, 63)", dx:-12, dy:-20, align:"right", bg:true, font:ui(13) }] : [],
      after:function(ctx, p){ probeLine(ctx, p, t); }, describe:"Graph of N(t) = −t³ + 9t² + 3t for 0 ≤ t ≤ 6 with its tangent at t = " + num(t, 1) + ", slope " + num(d, 2) + "." });
    pn1.draw({ view:VN1, yLabel:"N′", xLabel:"t", xTicks:{ step:1 }, yTicks:{ step:10 }, curves:[{ f:NF1, color:css("--f3"), width:2.6, domain:[0, 6] }], points:[{ x:t, y:d, r:5.5, color:css("--f3"), ring:true }].concat(solved ? [{ x:3, y:30, r:9, open:true, color:ink }] : []),
      labels:solved ? [{ x:3, y:30, text:"maximum of N′: 30", dx:12, dy:18, align:"left", bg:true, font:ui(13) }] : [],
      after:function(ctx, p){ probeLine(ctx, p, t); }, describe:"Graph of N′(t) = −3t² + 18t + 3; at t = " + num(t, 1) + " it is " + num(d, 2) + "." });
  }
  pn.render = drawN; pn1.render = drawN;
  function paintN(){
    var t = S.s3.t;
    $("#cv-t", host).value = t; $("#cv-tout", host).textContent = num(t, 1);
    $("#cv-nread", host).innerHTML = MV.readoutHTML([[m("N(t)") + " (hundreds)", num(r9(NF(t)), 3)], [m("N′(t)") + " (hundreds per day)", num(r9(NF1(t)), 3)], [m("N″(t)"), num(r9(NF2(t)), 3)]]);
    $("#cv-fb3", host).innerHTML = S.s3.solved ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + MV.md(G.fast.replace(/^Right\.\s*/, ""))) : msg3 ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg3) : "";
    $("#cv-fast", host).hidden = !!S.s3.solved;
    drawN();
  }
  // ---- events ----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.rev1 != null) { var i = +b.dataset.rev1, st = S.s1[i] || (S.s1[i] = {}); if (!st.ch) st.need = true; else st.rev = true; api.save(); paint1(); MV.focusFb($('[data-pt="' + i + '"]', host)); return; }
    if (b.dataset.rev2) { var id = b.dataset.rev2, s2 = S.s2[id] || (S.s2[id] = {}); if (!s2.ch) s2.need = true; else s2.rev = true; api.save(); paint2(); MV.focusFb($('[data-card="' + id + '"]', host)); return; }
    if (b.id === "cv-fast") {
      var t = S.s3.t;
      if (near(t, 3, 1e-9)) { S.s3.solved = true; msg3 = null; }
      else if (near(t, 6, 1e-9)) msg3 = MV.md(G.biggest);
      else msg3 = MV.md(tpl(G.other, { v:"`" + num(r9(NF1(t)), 2).replace(MINUS, "-") + "`" }));
      api.save(); paintN(); MV.focusFb($("#cv-st3", host));
    }
  });
  $("#cv-t", host).addEventListener("input", function(e){ S.s3.t = r9(Math.round(+e.target.value * 10) / 10); msg3 = null; api.save(); paintN(); });
  paint1(); paint2(); paintN();
  return {};
}

// ---------- Practice 2: Bend it ----------
// @component V8 bendBoxes (adapted from MCV4U 14 ladderBoxes / 13 pointBoxes, with N10 interval builders) — labelled answer fields
// per item: "iv" (an MV.intervalBuilder with one piece; ±∞ allowed), "pts" (n points “(□, □)” in any order, fractions accepted)
// and "num" (one number or fraction). Named wrong states per field ({k, iv:[a, b, aIn, bIn]} / {k, pts} / {k, only} / {k, has} /
// {k, notv}), bracket feedback, first-try scoring and three-level help where the plan gives hints.
function bendAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, IB = {}, M = a.msgs;
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, ivs:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q cv-bq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="cv-bin"></div><div class="cv-bcl"></div></div>';
  }).join("");
  function nv(s){ var p = MV.parseNum(String(s == null ? "" : s)); return p && p.length === 1 && isFinite(p[0]) ? p[0] : NaN; }
  function inp(it, k, label, x){ return '<input class="numin short" data-bx="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.v[k] || "") + '">'; }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .cv-bin', host);
    if (x.solved) { el.innerHTML = ""; IB[it.id] = {}; return; }
    if (el.dataset.built) return;
    el.dataset.built = "1"; IB[it.id] = {};
    el.innerHTML = it.fields.map(function(fd){
      if (fd.kind === "iv") return '<div class="cv-bf cv-bfiv"><p class="cv-bl">' + fd.label + '</p><div class="cv-bib" data-ib="' + fd.k + '"></div></div>';
      if (fd.kind === "num") return '<div class="cv-bf"><label class="cv-bnum"><span>' + fd.label + "</span>" + inp(it, fd.k, MV.plain(fd.label).replace(/\s*=\s*$/, ""), x) + "</label></div>";
      var n = fd.n || 1;
      return '<div class="cv-bf"><p class="cv-bl">' + fd.label + '</p><div class="cv-bpts">' + Array.apply(null, Array(n)).map(function(_, j){ var L = n > 1 ? "Point " + (j + 1) : "Point"; return '<span class="cv-bpt"><span class="m">(</span>' + inp(it, fd.k + j + "x", L + " x-coordinate", x) + '<span class="m">,</span>' + inp(it, fd.k + j + "y", L + " y-coordinate", x) + '<span class="m">)</span></span>'; }).join('<span class="cv-band">and</span>') + "</div></div>";
    }).join("");
    it.fields.forEach(function(fd){
      if (fd.kind !== "iv") return;
      var b = MV.intervalBuilder($('[data-ib="' + fd.k + '"]', el), { min:fd.min, max:fd.max, maxPieces:1, modes:false, test:false, readout:false, halfToggle:false, caption:true,
        aria:MV.plain(fd.label) + ": number line", pieces:[{ a:0, b:1, aIn:true, bIn:true }], onChange:function(st){ x.ivs[fd.k] = st; msgs[it.id] = null; api.save(); paintCl(it); } });
      if (x.ivs[fd.k]) b.set(x.ivs[fd.k], true);
      IB[it.id][fd.k] = b;
    });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .cv-bcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + MV.md(it.display) + ".</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function ivOf(it, k){ var b = IB[it.id] && IB[it.id][k]; return b ? b.iv()[0] : null; }
  function W(w){ return { a:w[0] == null ? -Infinity : w[0], b:w[1] == null ? Infinity : w[1], aIn:!!w[2], bIn:!!w[3] }; }
  function sameEnds(P, w){ return P && P.a === w.a && P.b === w.b; }
  function sameIv(P, w){ return sameEnds(P, w) && (!isFinite(w.a) || P.aIn === w.aIn) && (!isFinite(w.b) || P.bIn === w.bIn); }
  function readPts(it, fd){
    var x = ist(it.id), out = [], blank = 0, bad = false;
    for (var j = 0; j < (fd.n || 1); j++) {
      var sx = String(x.v[fd.k + j + "x"] || "").trim(), sy = String(x.v[fd.k + j + "y"] || "").trim();
      if (!sx && !sy) { blank++; continue; }
      var px = nv(sx), py = nv(sy); if (!isFinite(px) || !isFinite(py)) bad = true; else out.push([px, py]);
    }
    return { pts:out, blank:blank, bad:bad };
  }
  function samePts(P, T){ if (P.length !== T.length) return false; var used = []; return T.every(function(t){ for (var i = 0; i < P.length; i++) if (used.indexOf(i) < 0 && near(P[i][0], t[0], 1e-9) && near(P[i][1], t[1], 1e-9)) { used.push(i); return true; } return false; }); }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, right = {}, i;
    for (i = 0; i < it.fields.length; i++) {
      var fd = it.fields[i];
      if (fd.kind === "iv") { vals[fd.k] = ivOf(it, fd.k); right[fd.k] = sameIv(vals[fd.k], W(ans[fd.k])); }
      else if (fd.kind === "num") { var raw = String(x.v[fd.k] || "").trim(); if (!raw) return { err:M.empty }; vals[fd.k] = nv(raw); if (!isFinite(vals[fd.k])) return { err:M.num }; right[fd.k] = near(vals[fd.k], ans[fd.k], 1e-9); }
      else { var r = readPts(it, fd); if (r.bad) return { err:M.num }; if (!r.pts.length) return { err:M.empty }; vals[fd.k] = r.pts; right[fd.k] = samePts(r.pts, ans[fd.k]); }
    }
    if (it.fields.every(function(fd){ return right[fd.k]; })) return { ok:true };
    var named = (it.wrong || []).filter(function(w){
      var v = vals[w.k]; if (right[w.k]) return false;
      if (w.iv) return sameIv(v, W(w.iv)) && v.aIn === !!w.iv[2] && v.bIn === !!w.iv[3];
      if (w.pts) return samePts(v, w.pts);
      if (w.only) return v.length < (it.fields.filter(function(fd){ return fd.k === w.k; })[0].n || 1) && samePts(v, w.only);
      if (w.has) return v.some(function(p){ return near(p[0], w.has[0], 1e-9) && near(p[1], w.has[1], 1e-9); });
      if (w.notv != null) return isFinite(v) && !near(v, w.notv, 1e-9);
      return false;
    })[0];
    if (named) return { ok:false, msg:named.fb };
    if (it.wrongDefault) return { ok:false, msg:it.wrongDefault };
    for (i = 0; i < it.fields.length; i++) {
      var f2 = it.fields[i], w2 = ans[f2.k]; if (right[f2.k]) continue;
      if (f2.kind === "iv") { var P = vals[f2.k], T = W(w2); if (sameEnds(P, T)) return { ok:false, msg:(!isFinite(T.a) && P.aIn) || (!isFinite(T.b) && P.bIn) ? M.inf : T.aIn || T.bIn ? "Check your brackets: is each endpoint included or not?" : M.closed }; return { ok:false, msg:M.ivEnds }; }
      if (f2.kind === "pts") { var hit = vals[f2.k].filter(function(p){ return w2.some(function(t){ return near(p[0], t[0], 1e-9) && near(p[1], t[1], 1e-9); }); }).length; return { ok:false, msg:hit && w2.length > 1 ? M.onePt : M.pts }; }
      return { ok:false, msg:"Check " + f2.label.replace(/\s*=\s*`?$/, "") + "." };
    }
    return { ok:false, msg:M.pts };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !b.dataset.act) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + MV.md(r.msg) + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a bend ----------
var task = (function(){
  var api, P = [];
  function g(k){ var s = api ? api.S : {}, t = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -12 && v <= 12 ? v : null; }
  function read(){ var b = g("b"), c = g("c"); return { b:b, c:c, valid:b !== null && c !== null }; }
  function fsrc(d){ return "f(x) = " + pSrc([0, 0, d.c, d.b, 1]); }
  function draw(){
    var d = read(), V0 = { xmin:-2.3, xmax:3.3, ymin:-5, ymax:5 };
    if (!d.valid) { P.forEach(function(p){ p.draw({ view:V0, describe:"Enter whole numbers from −12 to 12 for b and c to draw the graph." }); }); return; }
    var X = quartXs(d.b, d.c, V0.xmin, V0.xmax), F = X.F, A = analyse(F), ink = css("--ink"), V = Object.assign({ xmin:V0.xmin, xmax:V0.xmax }, viewAt(F.f, X.xs.concat(A.pois.map(function(q){ return q.x; })), 6));
    var V2 = Object.assign({ xmin:V0.xmin, xmax:V0.xmax }, viewAt(F.d2, X.v2, 8)), fl = {};
    var pts = A.pois.map(function(q){ return { x:q.x, y:q.yv, r:7, open:true, color:ink }; }), labs = A.pois.map(function(q, i){ return { x:q.x, y:q.yv, text:poiTxt(q, fl), dx:i % 2 ? 12 : -12, dy:i % 2 ? 20 : -20, align:i % 2 ? "left" : "right", bg:true, font:ui(12) }; });
    if (2 * d.c > 0) { pts.push({ x:0, y:0, r:5, color:ink }); labs.push({ x:0, y:0, text:"min (0, 0)", dx:10, dy:20, align:"left", bg:true, font:ui(12) }); }
    P[0].draw({ view:V, yLabel:"f(x)", curves:[{ f:F.f, color:css("--pen"), width:3 }], points:pts, labels:labs,
      describe:"Graph of " + MV.plain(m(fsrc(d))) + ". " + (A.pois.length ? "Points of inflection at " + A.pois.map(function(q){ return poiTxt(q, fl); }).join(" and ") + "." : "No points of inflection.") });
    P[1].draw({ view:V2, yLabel:"f″(x)", curves:[{ f:F.d2, color:css("--f4"), width:2.4 }], points:A.cuts.map(function(c){ return { x:c.x, y:0, r:6, open:true, color:ink }; }),
      describe:"Graph of f″(x) = " + MV.plain(m(pSrc(F.p2))) + (A.cuts.length ? ", zero at x = " + A.cuts.map(function(c){ return cutTxt(c, fl); }).join(" and ") : ", never zero") + "." });
  }
  function readout(){
    var d = read(), el = $("#cv-tread"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Enter whole numbers from −12 to 12 for ' + m("b") + " and " + m("c") + ".</dd></div>"; return; }
    var F = polyF([0, 0, d.c, d.b, 1]), A = analyse(F), fl = {};
    el.innerHTML = MV.readoutHTML([["Function", m(fsrc(d))], [m("f″(x)"), m(pSrc(F.p2))], [m("f″(1)"), num(12 + 6 * d.b + 2 * d.c)], [m("f″(0)"), num(2 * d.c)],
      ["Points of inflection", A.pois.length ? A.pois.map(function(q){ return poiTxt(q, fl); }).join(", ") + (fl.approx ? ' <span class="tiny muted">(rounded)</span>' : "") : "none"]]);
  }
  function stepper(k, v){
    return '<div class="cv-tstep"><label for="cv-t' + k + '"><span class="m cv-tlab"><i>' + k + '</i></span> <span class="tiny muted">(−12 to 12)</span></label>' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="cvt' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="cv-t' + k + '" data-tk="' + k + '" type="number" min="-12" max="12" step="1" autocomplete="off" value="' + MV.esc(v) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="cvt' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.b == null) { a.S.b = "0"; a.S.c = "0"; }
      inp.innerHTML = stepper("b", a.S.b) + stepper("c", a.S.c);
      pv.innerHTML = '<div class="cv-tpan"><p class="cv-pcap"><span class="cv-sw" style="background:var(--pen)" aria-hidden="true"></span>' + m("f(x)") + ' with its points of inflection ringed</p><div class="plot-wrap"><canvas class="plot cv-ttop" role="img" aria-label="Graph of f"></canvas></div>' +
        '<p class="cv-pcap"><span class="cv-sw" style="background:var(--f4)" aria-hidden="true"></span>' + m("f″(x)") + '</p><div class="plot-wrap"><canvas class="plot cv-tlow" role="img" aria-label="Graph of f″"></canvas></div></div><dl class="read" id="cv-tread" aria-live="polite" style="margin-top:10px"></dl>';
      P = $$("canvas", pv).map(function(c){ var p = new MV.Plot(c, { xmin:-2, xmax:3, ymin:-5, ymax:5 }); p.render = draw; return p; });
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10);
        if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -12, 12)); $("#cv-t" + k).value = a.S[k];
        a.save(); draw(); readout(); a.update();
      });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers from −12 to 12 for b and c."; },
    checks:function(d){
      if (!d.valid) return [false, false, false];
      var disc = 36 * d.b * d.b - 96 * d.c;
      return [12 + 6 * d.b + 2 * d.c === 0 && disc > 0, disc > 0, 2 * d.c > 0];
    },
    key:function(d){ return d.b + "|" + d.c; },
    label:function(k){ var p = k.split("|").map(Number); return m("b = " + p[0]) + ", " + m("c = " + p[1]) + ": " + m(fsrc({ b:p[0], c:p[1] })); },
    text:function(k){ var p = k.split("|").map(Number); return "b = " + nmS(p[0]) + ", c = " + nmS(p[1]); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ bend:bendAct },
  task:task
});
})();
