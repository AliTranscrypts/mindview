// MCV4U 14 Higher Order Derivatives: hero (three linked panels for y = x³ − 3x), Derivative ladder (Explore: V5 derivative
// panels with up to six rungs, Ladder and Slope speedometer modes, Build cubic / quartic), Read the second derivative (Part 3:
// drag-dot sketches of f′ and f″, three rational/radical cards with shading and a V11 sign chart of f″), Climb the ladder
// (Practice 2, V8 boxes) and the "Slowest slope" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
// at most dp decimals, with "≈ " in front when rounding changed the value
function dec(v, dp){ var r = r9(v), p = Math.pow(10, dp); return (Math.abs(r * p - Math.round(r * p)) > 1e-6 ? "≈ " : "") + num(r, dp); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function probeLine(ctx, p, x){
  var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
}
function xq(x){ return Q.of(Math.round(x * 10), 10); }
function narrow(){ return !!(window.matchMedia && window.matchMedia("(max-width: 560px)").matches); }

// =====================================================================================================================
// @component ladderFn — the derivative ladder of a polynomial (integer coefficients, lowest power first) or of 1/x. Rung k is
// the kth derivative: { k, f(x), q(Q) exact value with MV.mcv.Q (null at x = 0 for 1/x), src (m() source), deg (−1 for the
// zero polynomial; undefined for 1/x), pw (the power of x for 1/x), zero }. dName(k) m() source "f″" / "f^{(4)}"; dPlain(k)
// "f″" / "f⁽⁴⁾"; pSrc(p) m() source of a polynomial; qHTML(q) exact value (decimal when it terminates, else a fraction ≈ …).
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
function fact(n){ var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
function qPow(q, n){ var r = Q.of(1); for (var i = 0; i < n; i++) r = Q.mul(r, q); return r; }
var SUPS = { 4:"⁽⁴⁾", 5:"⁽⁵⁾", 6:"⁽⁶⁾" };
function dName(k){ return ["f", "f′", "f″", "f‴"][k] || "f^{(" + k + ")}"; }
function dPlain(k){ return ["f", "f′", "f″", "f‴"][k] || "f" + SUPS[k]; }
function polyRung(p, k){ return { k:k, p:p, deg:p.length - 1, zero:!p.length, f:function(x){ return pEval(p, x); }, q:function(x){ return pEvalQ(p, x); }, src:pSrc(p) }; }
function recipRung(k){
  var c = (k % 2 ? -1 : 1) * fact(k), n = k + 1;
  return { k:k, recip:true, pw:-n, zero:false, f:function(x){ return Math.abs(x) < 1e-12 ? NaN : c / Math.pow(x, n); },
    q:function(x){ return x.n ? Q.div(Q.of(c), qPow(x, n)) : null; },
    src:(c < 0 ? "-" : "") + "{" + Math.abs(c) + "}/{x" + (n > 1 ? "^" + n : "") + "}" };
}
function ladder(spec, n){
  var out = [], p = pTrim(spec.poly || []);
  for (var k = 0; k <= n; k++) { out.push(spec.recip ? recipRung(k) : polyRung(p, k)); if (!spec.recip) p = pDer(p); }
  return out;
}
function termDec(q){ var d = q.d; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; }
function qHTML(q){ if (!q) return "undefined"; return termDec(q) ? num(Q.val(q), 6) : m(Q.src(q)) + " ≈ " + num(Q.val(q), 2); }
function qPlain(q){ if (!q) return "undefined"; return termDec(q) ? num(Q.val(q), 6) : Q.txt(q) + " ≈ " + num(Q.val(q), 2); }
function qSign(q){ return !q ? NaN : q.n > 0 ? 1 : q.n < 0 ? -1 : 0; }
// y-range of g over [a, b], always including 0, padded
function autoView(g, a, b){
  var lo = 0, hi = 0;
  for (var i = 0; i <= 160; i++) { var v = g(a + (b - a) * i / 160); if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }
  if (hi - lo < 1e-9) return { ymin:-1, ymax:1 };
  var pad = (hi - lo) * 0.12; return { ymin:lo - pad, ymax:hi + pad };
}

// =====================================================================================================================
// @component V5 derivativePanels (adapted from MCV4U 07 / 11 for a ladder of up to six panels) — f and its derivatives on
// stacked panels sharing one x-axis, with one probe line through every panel. Panel 0: f (--pen, 3 px), its tangent (--ink, 2 px),
// a "slope = …" label and the probe point (drag it or tap any panel; arrow keys 0.1, Shift 1). Panels 1+: each rung in its colour
// (f′ --f3 2.6 px, f″ --f4 2.4 px, higher rungs --ink 2 px, always labelled), the (x, f⁽ᵏ⁾(x)) dot, an edge arrow with the value
// when it is off the panel, and vertical asymptotes. A curve can be hidden, or drawn only up to an x-value (prediction reveals).
// Excluded x-values (1/x at 0) are skipped in the direction of motion. Each panel has an HTML caption above it (the app fills it).
//   var dp = derivativePanels(host, { max:6, x, panels(){ return [{ g, view:{ymin, ymax}, color, width, name, hide, upTo }] },
//     xv(){ return {xmin, xmax} }, dom(){ return { lo, hi, step, excl:[x], asym:[x] } }, slope(x), extra(i, scene, plot, x),
//     describe(i, x), locked(), handleLabel(x), onMove(x, how, prev, skipped) })      how: "drag" | "key" | "tap" | "slider" | "set" | "anim"
//   -> { get(), set(x, how), render(), plots, wraps, caps, layout(count, visible(i)), focus() }
function dpSlopeLabel(v){
  if (!isFinite(v)) return "no tangent";
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
function dpSnap(D, v, prev){
  var st = D.step || 0.1, skipped = null;
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
  var max = o.max || 6, x = o.x, h = "", count = 1, i;
  host.classList.add("dp-panels");
  for (i = 0; i < max; i++) h += '<div class="hd-pan" data-pan="' + i + '"' + (i ? " hidden" : "") + '><p class="hd-pcap"></p><div class="plot-wrap"><canvas class="plot ' + (i ? "hd-low" : "hd-top") + '" role="img" aria-label="Panel ' + (i + 1) + '"></canvas></div></div>';
  host.innerHTML = h;
  var wraps = $$(".hd-pan", host), caps = $$(".hd-pcap", host), plots = $$("canvas", host).map(function(c){ return new MV.Plot(c, { xmin:-1, xmax:1, ymin:-1, ymax:1 }); });
  function scene(i){
    var P = o.panels()[i], XV = o.xv(), D = o.dom(), ink = css("--ink"), V = { xmin:XV.xmin, xmax:XV.xmax, ymin:P.view.ymin, ymax:P.view.ymax };
    var sc = { view:V, yLabel:P.name + "(x)", asymptotes:(D.asym || []).map(function(a){ return { x:a, label:i ? "" : null }; }), curves:[], lines:[], points:[], labels:[], segments:[] };
    var y = P.g(x), inV = isFinite(y) && y >= V.ymin && y <= V.ymax;
    if (!P.hide) sc.curves.push({ f:P.g, color:P.color, width:P.zero ? 3.4 : P.width, domain:P.upTo != null ? [V.xmin - 1, P.upTo] : null });
    if (i === 0) {
      var d = o.slope(x), ok = isFinite(d) && isFinite(y), right = (x - V.xmin) / (V.xmax - V.xmin) > 0.55, yc = clamp(y, V.ymin, V.ymax);
      if (ok) sc.lines.push({ p:[x, y], q:[x + 1, y + d], color:ink, width:2 });
      if (ok && inV) sc.points.push({ x:x, y:y, r:6, color:ink, ring:true });
      if (ok) sc.labels.push({ x:x, y:yc, text:dpSlopeLabel(d), dx:right ? -14 : 14, dy:yc > V.ymax - (V.ymax - V.ymin) * 0.2 ? 22 : -22, align:right ? "right" : "left", bg:true, font:ui(14) });
    } else if (!P.hide && inV && (P.upTo == null || x <= P.upTo + 1e-9)) sc.points.push({ x:x, y:y, r:5, color:P.color });
    sc.after = function(ctx, pl){ probeLine(ctx, pl, x); if (!P.hide) dpEdge(ctx, pl, x, y, i ? P.color : ink); };
    return sc;
  }
  var busy = false;
  function render(){
    if (busy) return; busy = true;
    try {
      var n = Math.min(count, o.panels().length);
      plots.forEach(function(p, i){
        if (i >= n || wraps[i].hidden) return;
        var sc = scene(i);
        if (o.extra) o.extra(i, sc, p, x);
        if (o.describe) sc.describe = o.describe(i, x);
        p.draw(sc);
      });
    } finally { busy = false; }
  }
  plots.forEach(function(p){ p.render = render; });
  function set(v, how){
    if (o.locked && o.locked() && how !== "anim" && how !== "set") return;
    var s = dpSnap(o.dom(), v, x);
    if (s.v === x && how !== "set") { if (s.skipped != null && o.onMove) { o.onMove(x, how, x, s.skipped); render(); } return; }
    var prev = x; x = s.v;
    if (o.onMove) o.onMove(x, how, prev, s.skipped);
    render();
  }
  var dr = MV.drag(plots[0], { axis:"x", step:{ x:0.1, y:0.1 }, big:10,
    handles:function(){ var y = o.panels()[0].g(x), V = o.panels()[0].view; return [{ id:"probe", x:x, y:isFinite(y) ? clamp(y, V.ymin, V.ymax) : 0, label:o.handleLabel ? o.handleLabel(x) : "Probe at x = " + num(x, 1) }]; },
    move:function(id, nx, ny, how){ set(nx, how === "key" ? "key" : "drag"); } });
  plots.forEach(function(p, i){
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
  function layout(n, vis){ count = n; wraps.forEach(function(w, i){ w.hidden = !(i < n && (!vis || vis(i))); }); }
  return { get:function(){ return x; }, set:set, render:render, plots:plots, wraps:wraps, caps:caps, layout:layout, focus:function(){ dr.focus("probe"); } };
}
// ------------------------------------------------- end of V5 derivativePanels ---------------------------------------------------

// =====================================================================================================================
// @component slopeDial — the "slope speedometer" (MCV4U 14): an SVG half-dial facing right whose needle is parallel to the
// tangent (needle angle = arctan of the slope; face --sheet, needle --ink), ticks at slopes 0, ±0.5, ±1, ±2, ±5, ±20, and a
// magenta (--f4) arc arrow showing which way and how fast the needle turns as x increases (its sweep follows f″, capped).
//   var dial = slopeDial(host);  dial.set(slope, d2)   (sets the SVG's aria-label too)
function slopeDial(host){
  var CX = 24, CY = 104, R = 86;
  function pt(r, th){ return [CX + r * Math.cos(th), CY - r * Math.sin(th)]; }
  function f2(v){ return Math.round(v * 10) / 10; }
  var h = '<svg class="hd-dial" viewBox="0 0 150 208" role="img" aria-label="Slope speedometer"><path class="hd-face" d="M' + CX + " " + (CY - R) + " A" + R + " " + R + " 0 0 1 " + CX + " " + (CY + R) + ' Z"/>';
  [-20, -5, -2, -1, -0.5, 0, 0.5, 1, 2, 5, 20].forEach(function(s){
    var th = Math.atan(s), a = pt(R - (s % 1 ? 5 : 9), th), b = pt(R, th);
    h += '<line class="hd-tick" x1="' + f2(a[0]) + '" y1="' + f2(a[1]) + '" x2="' + f2(b[0]) + '" y2="' + f2(b[1]) + '"/>';
    if (Math.abs(s) === 20 || s % 1) return;
    var l = pt(R + 11, th);
    h += '<text class="hd-tl" x="' + f2(l[0]) + '" y="' + f2(l[1]) + '">' + (s < 0 ? MINUS : "") + Math.abs(s) + "</text>";
  });
  h += '<path class="hd-turn" d=""/><path class="hd-turnh" d=""/><line class="hd-needle" x1="' + CX + '" y1="' + CY + '" x2="' + (CX + R - 12) + '" y2="' + CY + '"/><circle class="hd-hub" cx="' + CX + '" cy="' + CY + '" r="6"/></svg>';
  host.innerHTML = h;
  var svg = host.querySelector("svg"), nd = svg.querySelector(".hd-needle"), tr = svg.querySelector(".hd-turn"), th2 = svg.querySelector(".hd-turnh");
  return { set:function(s, d2){
    if (!isFinite(s)) { nd.setAttribute("visibility", "hidden"); tr.setAttribute("d", ""); th2.setAttribute("d", ""); svg.setAttribute("aria-label", "Slope speedometer: no slope here."); return; }
    nd.removeAttribute("visibility");
    var a = Math.atan(s), tip = pt(R - 12, a);
    nd.setAttribute("x2", f2(tip[0])); nd.setAttribute("y2", f2(tip[1]));
    // sweep: where the needle will point 0.35 units of x later, at least 15° and at most 50° so the turn is always visible
    var rr = R - 28, b = isFinite(d2) ? Math.atan(s + 0.35 * d2) : a;
    if (isFinite(d2) && Math.abs(d2) > 1e-12) b = a + Math.sign(d2) * clamp(Math.abs(b - a), 0.26, 0.87);
    b = clamp(b, -1.53, 1.53);
    if (Math.abs(b - a) < 0.03 || !isFinite(d2) || Math.abs(d2) < 1e-12) { tr.setAttribute("d", ""); th2.setAttribute("d", ""); }
    else {
      var p1 = pt(rr, a), p2 = pt(rr, b), up = b > a, dir = up ? [-Math.sin(b), -Math.cos(b)] : [Math.sin(b), Math.cos(b)], nrm = [-dir[1], dir[0]];
      tr.setAttribute("d", "M" + f2(p1[0]) + " " + f2(p1[1]) + " A" + rr + " " + rr + " 0 0 " + (up ? 0 : 1) + " " + f2(p2[0]) + " " + f2(p2[1]));
      var tipP = [p2[0] + dir[0] * 5, p2[1] + dir[1] * 5], bse = [p2[0] - dir[0] * 4, p2[1] - dir[1] * 4];
      th2.setAttribute("d", "M" + f2(tipP[0]) + " " + f2(tipP[1]) + " L" + f2(bse[0] + nrm[0] * 5) + " " + f2(bse[1] + nrm[1] * 5) + " L" + f2(bse[0] - nrm[0] * 5) + " " + f2(bse[1] - nrm[1] * 5) + " Z");
    }
    svg.setAttribute("aria-label", "Slope speedometer: the needle shows slope " + MV.plain(dec(s, 2)) + (!isFinite(d2) ? "." : Math.abs(d2) < 1e-12 ? "; it is momentarily still." : "; it is turning " + (d2 > 0 ? "up" : "down") + " at " + MV.plain(dec(Math.abs(d2), 2)) + " per unit of x."));
  } };
}

// =====================================================================================================================
// @component V11 signChart (adapted from MCV4U 11 for f″) — one row per factor of the numerator and denominator of f″, the sign
// of f″, and a behaviour row (slopes ↗ increasing / ↘ decreasing; "not in the domain" or "f″ undefined" at the marked points).
// The domain can start at lo (√x). The table scrolls inside its box on phones.
//   signChartHTML({ top:[{s, f, z:[x]}], bot:[{s, f, z:[x]}], d:function(x), pts:[{x, t:"nd" | "undef" | "zero"}], lo, ptHTML(x), dLabel })
function signChartHTML(o){
  var lo = o.lo == null ? -Infinity : o.lo, pts = o.pts.slice().sort(function(a, b){ return a.x - b.x; }), cols = [], i;
  var inner = pts.filter(function(p){ return p.x > lo + 1e-9; }), edges = [lo].concat(inner.map(function(p){ return p.x; }), [Infinity]);
  var p0 = pts.filter(function(p){ return near(p.x, lo); })[0];
  if (p0) cols.push({ iv:false, x:p0.x, t:p0.t });
  for (i = 0; i + 1 < edges.length; i++) {
    var a0 = edges[i], a1 = edges[i + 1], mid = !isFinite(a0) ? (isFinite(a1) ? a1 - 1 : 0) : !isFinite(a1) ? a0 + 1 : (a0 + a1) / 2;
    cols.push({ iv:true, a:a0, b:a1, mid:mid });
    if (i < inner.length) cols.push({ iv:false, x:inner[i].x, t:inner[i].t });
  }
  function end(v){ return v === -Infinity ? MINUS + "∞" : v === Infinity ? "∞" : o.ptHTML(v); }
  function sg(v){ return v > 1e-12 ? "+" : v < -1e-12 ? MINUS : "0"; }
  function frow(F, kind){
    return '<tr><th scope="row">' + m(F.s) + '<span class="hd-sc-k">' + kind + "</span></th>" + cols.map(function(c){
      return "<td>" + (c.iv ? sg(F.f(c.mid)) : F.z.some(function(z){ return near(z, c.x); }) ? "0" : sg(F.f(c.x))) + "</td>";
    }).join("") + "</tr>";
  }
  var h = '<div class="tbl-wrap hd-sc-wrap"><table class="vt hd-sct"><caption class="vh">Sign chart of ' + MV.plain(o.dLabel) + '</caption><thead><tr><th scope="col">' + m("x") + "</th>" +
    cols.map(function(c){ return '<th scope="col">' + (c.iv ? "(" + end(c.a) + ", " + end(c.b) + ")" : end(c.x)) + "</th>"; }).join("") + "</tr></thead><tbody>";
  h += o.top.map(function(F){ return frow(F, "numerator"); }).join("") + o.bot.map(function(F){ return frow(F, "denominator"); }).join("");
  h += '<tr class="hd-sc-d"><th scope="row">' + o.dLabel + "</th>" + cols.map(function(c){ return c.iv ? "<td>" + sg(o.d(c.mid)) + "</td>" : '<td class="hd-sc-u">' + (c.t === "zero" ? "0" : "undefined") + "</td>"; }).join("") + "</tr>";
  h += '<tr class="hd-sc-b"><th scope="row">Slopes of ' + m("f") + "</th>" + cols.map(function(c){
    if (c.iv) { var up = o.d(c.mid) > 0; return '<td class="hd-sc-ar"><span aria-hidden="true">' + (up ? "↗" : "↘") + '</span><span class="hd-sc-w">' + (up ? "increasing" : "decreasing") + "</span></td>"; }
    return '<td class="hd-sc-u">' + (c.t === "nd" ? "not in the domain" : c.t === "undef" ? "no " + m("f′") + " or " + m("f″") : "momentarily steady") + "</td>";
  }).join("") + "</tr></tbody></table></div>";
  return h;
}
// ------------------------------------------------- end of V11 signChart ---------------------------------------------------------

// ---------- hero: a probe sweeps y = x³ − 3x; teal and magenta trails draw f′ and f″ below; it pauses at x = 0 ----------
function hero(f){
  var c0 = f.canvas, c1 = $("#hero-d1"), c2 = $("#hero-d2"); if (!c0 || !c1 || !c2) return;
  var F = function(x){ return x * x * x - 3 * x; }, D = function(x){ return 3 * x * x - 3; }, D2 = function(x){ return 6 * x; };
  var X0 = -2.2, X1 = 2.2, XV = { xmin:-2.4, xmax:2.4 }, st = { x:X0, trail:X0, hi:false };
  var P = [new MV.Plot(c0, XV), new MV.Plot(c1, XV), new MV.Plot(c2, XV)];
  var VW = [{ ymin:-3.6, ymax:3.6 }, { ymin:-5, ymax:13 }, { ymin:-15, ymax:15 }];
  function v(i){ return { xmin:XV.xmin, xmax:XV.xmax, ymin:VW[i].ymin, ymax:VW[i].ymax }; }
  function after(ctx, p){ probeLine(ctx, p, st.x); }
  function draw(){
    var x = st.x, y = F(x), d = D(x), ink = css("--ink"), f3 = css("--f3"), f4 = css("--f4"), right = x > 0.6, tr = Math.max(st.trail, x);
    P[0].draw({ view:v(0), yLabel:"f(x)", curves:[{ f:F, color:css("--pen"), width:3 }], lines:[{ p:[x, y], q:[x + 1, y + d], color:ink, width:2 }],
      points:[{ x:x, y:y, r:5.5, color:ink }], labels:[{ x:x, y:y, text:dpSlopeLabel(d), dx:right ? -12 : 12, dy:y > 1.5 ? 20 : -20, align:right ? "right" : "left", bg:true, font:ui(13) }],
      describe:"Top panel: y = x³ − 3x with its tangent at x = " + num(x, 1) + ", slope " + num(d, 2) + (st.hi ? "; this is where the cubic’s slope is least." : "."), after:after });
    P[1].draw({ view:v(1), yLabel:"f′(x)", curves:[{ f:D, color:f3, width:2.8, domain:[X0, tr] }], points:[{ x:x, y:d, r:5, color:f3 }].concat(st.hi ? [{ x:0, y:-3, r:8, open:true, color:ink }] : []),
      labels:st.hi ? [{ x:0, y:-3, text:"lowest slope: −3", dx:12, dy:-16, align:"left", bg:true, font:ui(13) }] : [],
      describe:"Middle panel: the slope trail f′(x) = 3x² − 3 from x = −2.2 to " + num(tr, 1) + (st.hi ? "; its lowest point is (0, −3)." : "."), after:after });
    P[2].draw({ view:v(2), yLabel:"f″(x)", curves:[{ f:D2, color:f4, width:2.6, domain:[X0, tr] }], points:[{ x:x, y:D2(x), r:5, color:f4 }].concat(st.hi ? [{ x:0, y:0, r:8, open:true, color:ink }] : []),
      labels:st.hi ? [{ x:0, y:0, text:"f″ = 0 here", dx:12, dy:-16, align:"left", bg:true, font:ui(13) }] : [],
      describe:"Bottom panel: the change in slope f″(x) = 6x from x = −2.2 to " + num(tr, 1) + (st.hi ? "; it crosses 0 at x = 0, where the slope of the cubic is least." : "."), after:after });
  }
  P.forEach(function(p){ p.render = draw; });
  function lin(t){ return t; }
  function finish(){ st.trail = X1; st.x = 0; st.hi = true; draw(); }
  if (MV.reduceMotion) { finish(); return; }
  draw();
  MV.wait(600, function(){
    MV.tween({ dur:2600, ease:lin, step:function(t){ st.x = st.trail = X0 - X0 * t; draw(); }, done:function(){
      st.x = st.trail = 0; st.hi = true; draw();
      MV.wait(1500, function(){
        st.hi = false;
        MV.tween({ dur:2600, ease:lin, step:function(t){ st.x = st.trail = X1 * t; draw(); }, done:function(){
          MV.tween({ dur:900, step:function(t){ st.x = X1 * (1 - t); draw(); }, done:finish });
        } });
      });
    } });
  });
}

// ---------- Explore: derivative ladder ----------
var FNS = { L1:{ poly:[0, -3, 0, 1] }, L2:{ poly:[0, 0, 0, -4, 1] }, L3:{ poly:[0, 0, 0, 0, 1] }, L4:{ recip:true } };
// hand-set y-ranges per rung (the builds use autoView over −2.5 ≤ x ≤ 2.5); values off a panel show as edge arrows
var RVIEW = { L1:[[-6, 6], [-5, 16], [-20, 20], [-2, 8], [-1, 1], [-1, 1]], L2:[[-35, 40], [-35, 20], [-20, 45], [-70, 50], [-5, 32], [-1, 1]],
  L3:[[-5, 40], [-55, 55], [-10, 70], [-80, 80], [-5, 32], [-1, 1]], L4:[[-4, 4], [-6, 1.5], [-8, 8], [-14, 3], [-30, 30], [-60, 12]] };
var PCOL = ["--pen", "--f3", "--f4", "--ink", "--ink", "--ink"], PWID = [3, 2.6, 2.4, 2, 2, 2];
var XVIEW = { xmin:-3.4, xmax:3.4 };
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["L1", "L2", "L3", "L4", "C", "Q"].indexOf(S.fn) < 0) S.fn = "L1";
  if (!(S.rungs >= 1 && S.rungs <= 4)) S.rungs = 2;
  if (["ladder", "speed"].indexOf(S.mode) < 0) S.mode = "ladder";
  if (typeof S.x !== "number") S.x = -1.5;
  S.C = S.C || { a:1, b:1, c:-2, d:0 }; S.Q = S.Q || { a:1, b:-2 };
  var busy = false, pv = null, extra = false, mark = null, note = "", pg = 0, trendMsg = "", stopPlay = null, playFrom = null, cache = {};
  host.innerHTML = '<div class="hd-ex"><div class="hd-main" data-mv="graph"><p class="eq-cap hd-eq" id="hd-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="hd-speed" id="hd-speed" hidden><div class="hd-dialbox" id="hd-dial"></div><div class="hd-sread"><dl class="read" id="hd-sread" aria-live="polite"></dl>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="hd-play" data-k="hdplay">Play</button></div><p class="tiny hd-trend" id="hd-trend" aria-live="polite"></p></div></div>' +
    '<div class="hd-pager" id="hd-pager" hidden><button type="button" class="btn ghost sm" data-pg="-1" data-k="hdpgp">Previous rung</button><span class="tiny" id="hd-pgt" aria-live="polite"></span><button type="button" class="btn ghost sm" data-pg="1" data-k="hdpgn">Next rung</button></div>' +
    '<div id="hd-panels"></div></div>' +
    '<div class="hd-side"><div class="chips hd-fns" id="hd-fn" role="group" aria-label="Choose a function"></div><div id="hd-build"></div>' +
    '<div class="seg-wrap" id="hd-rungs"></div><div class="seg-wrap" id="hd-mode"></div><p class="tiny muted hd-how" id="hd-how"></p>' +
    '<label class="slider hd-sl"><span class="slider-top"><span>Probe, ' + m("x") + '</span><output id="hd-xout"></output></span>' +
    '<input type="range" id="hd-x" min="-3" max="3" step="0.1" style="accent-color:var(--ink)" aria-label="x-value of the probe (Shift + arrow moves by 1)"></label>' +
    '<p class="tiny hd-skip" id="hd-skip" aria-live="polite"></p><dl class="read hd-read" id="hd-read" aria-live="polite"></dl></div></div>';
  function spec(){ return S.fn === "C" ? { poly:[S.C.d, S.C.c, S.C.b, S.C.a] } : S.fn === "Q" ? { poly:[0, 0, 0, S.Q.b, S.Q.a] } : FNS[S.fn]; }
  function lad(){
    var sp = spec(), key = S.fn + JSON.stringify(sp);
    if (!cache[key]) {
      var RVk = RVIEW[S.fn], L = ladder(sp, 5), views = L.map(function(R, k){ return RVk ? { ymin:RVk[k][0], ymax:RVk[k][1] } : autoView(R.f, -2.5, 2.5); });
      cache = {}; cache[key] = { L:L, views:views, recip:!!sp.recip };
    }
    return cache[key];
  }
  function nPanels(){ return 1 + S.rungs + (extra ? 1 : 0); }
  function panels(){
    var Z = lad(), out = [];
    for (var k = 0; k < nPanels(); k++) out.push({ g:Z.L[k].f, view:Z.views[k], color:css(PCOL[k]), width:PWID[k], name:dPlain(k), zero:Z.L[k].zero,
      hide:!!(pv && pv.hide && pv.hide[k]), upTo:pv && pv.upTo && pv.upTo[k] != null ? pv.upTo[k] : null });
    return out;
  }
  function dom(){ return { lo:-3, hi:3, step:0.1, excl:lad().recip ? [0] : [], asym:lad().recip ? [0] : [] }; }
  function fnHTML(){
    if (S.fn === "C" || S.fn === "Q") return m("f(x) = " + pSrc(spec().poly));
    return m("f(x) = " + (S.fn === "L4" ? "{1}/{x}" : pSrc(FNS[S.fn].poly)));
  }
  var dp = derivativePanels($("#hd-panels", host), {
    max:6, x:S.x, panels:panels, xv:function(){ return XVIEW; }, dom:dom,
    slope:function(x){ return lad().L[1].f(x); },
    extra:function(i, sc){
      if (!mark) return;
      mark.forEach(function(q){
        if (q.i !== i) return;
        if (!q.noRing) sc.points.push({ x:q.x, y:q.y, r:8, open:true, color:css("--ink") });
        sc.labels.push({ x:q.x, y:q.y, text:q.text, dx:q.dx == null ? 12 : q.dx, dy:q.dy == null ? -16 : q.dy, align:q.align || "left", bg:true, font:ui(13) });
      });
    },
    describe:describe,
    locked:function(){ return busy; },
    handleLabel:function(x){ return "Probe at x = " + num(x, 1) + ", slope " + MV.plain(qHTML(lad().L[1].q(xq(x)))) + ". Arrow keys move it by 0.1; Shift moves it by 1."; },
    onMove:function(x, how, prev, skipped){
      S.x = x;
      if (how !== "anim" && how !== "set") { mark = null; if (stopPlay) pause(); }
      if (skipped != null) note = C.skip; else if (how !== "anim") note = "";
      api.save(); syncSlider(); paintRead(); paintSpeed();
      MV.changed();
    }
  });
  var dial = slopeDial($("#hd-dial", host));
  function describe(i, x){
    var Z = lad(), R = Z.L[i], P = panels()[i];
    if (P.hide) return "Panel " + (i + 1) + ": " + dPlain(i) + "(x), hidden until the reveal.";
    var v = qPlain(R.q(xq(x)));
    if (!i) return "Top panel: " + MV.plain(fnHTML()) + " with the tangent at x = " + num(x, 1) + "; f(x) = " + v + ", slope " + qPlain(Z.L[1].q(xq(x))) + ".";
    return "Panel " + (i + 1) + ": " + dPlain(i) + "(x) = " + MV.plain(m(R.src)) + (R.zero ? ", flat on the x-axis" : "") + "; at x = " + num(x, 1) + " it is " + v + ".";
  }
  // ---- captions, layout, readouts ----
  function degHTML(R){ return R.recip ? "power " + m("x^{" + R.pw + "}") : R.zero ? "the zero function" : "degree " + R.deg; }
  function paintCaps(){
    var Z = lad();
    dp.caps.forEach(function(c, k){
      if (k >= nPanels()) { c.innerHTML = ""; return; }
      var hid = pv && pv.hide && pv.hide[k], sw = '<span class="hd-sw" style="background:var(' + PCOL[k] + ')" aria-hidden="true"></span>';
      c.innerHTML = sw + m(dName(k) + "(x) = " + (hid ? "?" : Z.L[k].src)) + (hid ? "" : ' <span class="hd-deg">' + degHTML(Z.L[k]) + "</span>");
    });
  }
  function layout(){
    var n = nPanels(), nar = narrow() && n > 3;
    pg = nar ? clamp(pg, 0, n - 3) : 0;
    dp.layout(n, function(i){ return !nar || (i >= pg && i < pg + 3); });
    var pgEl = $("#hd-pager", host); pgEl.hidden = !nar;
    if (nar) {
      $("#hd-pgt", host).innerHTML = "Showing " + m(dName(pg)) + " to " + m(dName(pg + 2)) + " of " + n + " panels";
      $('[data-pg="-1"]', host).disabled = pg === 0 || busy; $('[data-pg="1"]', host).disabled = pg >= n - 3 || busy;
    }
  }
  function showPanel(k){ if (!narrow()) return; if (k < pg) pg = k; if (k > pg + 2) pg = k - 2; layout(); }
  function trendKey(x){ var s = qSign(lad().L[2].q(xq(x))); return s > 0 ? "up" : s < 0 ? "down" : s === 0 ? "flat" : null; }
  function paintRead(){
    var Z = lad(), x = dp.get(), q = xq(x), R = C.rows, rows = [], k;
    rows.push([R.f, qHTML(Z.L[0].q(q))], [R.d1, qHTML(Z.L[1].q(q))], [R.d2, qHTML(Z.L[2].q(q))]);
    if (S.rungs >= 3) rows.push([R.d3, qHTML(Z.L[3].q(q))]);
    var tk = trendKey(x); rows.push([R.trend, tk ? C.trend[tk] : "undefined here"]);
    var degs = "", until = "";
    if (Z.recip) { degs = "never reaches 0"; until = "∞"; }
    else if (Z.L[0].zero) { degs = m("f") + " is already 0"; until = "0"; }
    else { var d0 = Z.L[0].deg, parts = []; for (k = d0; k >= 0; k--) parts.push(String(k)); degs = parts.join(" → "); until = String(d0 + 1); }
    rows.push([R.deg, degs], [R.until, until]);
    $("#hd-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintSpeed(){
    var on = S.mode === "speed", el = $("#hd-speed", host); el.hidden = !on;
    if (!on) return;
    var Z = lad(), x = dp.get(), s = Z.L[1].f(x), d2 = Z.L[2].f(x), q = xq(x);
    dial.set(s, d2);
    var turn = !isFinite(d2) ? "" : Math.abs(d2) < 1e-12 ? "momentarily still" : d2 > 0 ? "turning up" : "turning down";
    $("#hd-sread", host).innerHTML = MV.readoutHTML([
      ["Needle: slope " + m("f′(x)"), qHTML(Z.L[1].q(q))],
      ["Needle speed: " + m("f″(x)"), isFinite(d2) ? qHTML(Z.L[2].q(q)) + " per unit of " + m("x") + (turn ? " (" + turn + ")" : "") : "undefined"]
    ]);
    var pb = $("#hd-play", host); pb.textContent = stopPlay ? "Pause" : "Play"; pb.disabled = busy;
    $("#hd-trend", host).innerHTML = trendMsg;
  }
  function syncSlider(){ $("#hd-x", host).value = dp.get(); $("#hd-xout", host).textContent = num(dp.get(), 1); $("#hd-skip", host).innerHTML = note; }
  function paintTop(){
    $("#hd-eq", host).innerHTML = fnHTML();
    MV.keepFocus($("#hd-fn", host), function(){
      $("#hd-fn", host).innerHTML = C.fns.map(function(q){ var on = q.id === S.fn; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-fn="' + q.id + '" data-k="fn' + q.id + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">" + (q.form ? "<strong>" + q.chip + "</strong>" : "<strong>" + q.id + "</strong> " + q.chip) + "</button>"; }).join("");
    });
    MV.keepFocus($("#hd-rungs", host), function(){ $("#hd-rungs", host).innerHTML = '<span class="tiny" style="font-weight:700">Rungs shown</span>' + segBtns("rung", [1, 2, 3, 4].map(function(n){ return { id:String(n), t:String(n) }; }), String(S.rungs), "Rungs shown"); });
    MV.keepFocus($("#hd-mode", host), function(){ $("#hd-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    $$("#hd-rungs button, #hd-mode button", host).forEach(function(b){ b.disabled = busy; });
    $("#hd-how", host).innerHTML = C.modeHow[S.mode];
    var bEl = $("#hd-build", host), want = S.fn === "C" || S.fn === "Q" ? S.fn : "";
    if (bEl.dataset.on !== want) {
      bEl.dataset.on = want;
      if (!want) bEl.innerHTML = "";
      else {
        var fn = C.fns.filter(function(q){ return q.id === want; })[0], ks = want === "C" ? ["a", "b", "c", "d"] : ["a", "b"], B = S[want];
        bEl.innerHTML = '<p class="tiny hd-form">' + fn.chip + ": " + fn.form + '</p><div class="hd-bsl">' + ks.map(function(k){
          var big = k === "a" || k === "b", lo = big ? -12 : -5, hi = big ? 12 : 5;
          return '<label class="slider"><span class="slider-top"><span>' + m(k) + '</span><output id="hd-' + k + 'out">' + num(B[k]) + '</output></span><input type="range" data-bk="' + k + '" min="' + lo + '" max="' + hi + '" step="1" value="' + B[k] + '" style="accent-color:var(--ink)" aria-label="' + k + " (" + num(lo) + " to " + num(hi) + ')"></label>';
        }).join("") + '</div><p class="tiny muted">' + C.buildNote + "</p>";
      }
    }
    $$("#hd-build input", host).forEach(function(inp){ inp.disabled = busy; });
    $("#hd-x", host).disabled = busy;
  }
  function paintAll(){ paintTop(); layout(); paintCaps(); syncSlider(); paintRead(); paintSpeed(); dp.render(); }
  // ---- Play (slope speedometer) ----
  function trendText(x0, x1){
    var Z = lad(), d1 = Z.L[1].f, d2 = Z.L[2].f, N = Math.max(2, Math.round(Math.abs(x1 - x0) / 0.02)), pts = [x0], i;
    function sg(v){ return v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0; }
    var prevS = sg(d2(x0 + (x1 - x0) * 0.5 / N));
    for (i = 1; i < N; i++) {
      var s = sg(d2(x0 + (x1 - x0) * (i + 0.5) / N));
      if (s !== prevS && s !== 0 && prevS !== 0) {
        var a = x0 + (x1 - x0) * (i - 0.5) / N, b = x0 + (x1 - x0) * (i + 0.5) / N;
        for (var j = 0; j < 40; j++) { var c = (a + b) / 2; if (sg(d2(c)) === prevS) a = c; else b = c; }
        pts.push(r9(Math.round((a + b) / 2 * 1e6) / 1e6));
      }
      if (s !== 0) prevS = s;
    }
    pts.push(x1);
    var parts = [];
    for (i = 0; i + 1 < pts.length; i++) {
      var sd = sg(d2((pts[i] + pts[i + 1]) / 2));
      parts.push({ w:sd > 0 ? "increased" : sd < 0 ? "decreased" : "stayed", to:d1(pts[i + 1]) });
    }
    if (parts.length === 1 && parts[0].w === "stayed") return "The slope stayed at " + dec(d1(x0), 2) + ".";
    var t = "The slope " + parts[0].w + " from " + dec(d1(x0), 2) + " to " + dec(parts[0].to, 2);
    for (i = 1; i < parts.length; i++) t += ", then " + parts[i].w + " to " + dec(parts[i].to, 2);
    return t + ".";
  }
  function runPlay(x0, x1, dur, cb){
    playFrom = x0; trendMsg = "";
    stopPlay = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ dp.set(x0 + (x1 - x0) * t, "anim"); }, done:function(){
      stopPlay = null; trendMsg = trendText(x0, dp.get()) + (lad().recip && x1 < 0 && x0 < 0 && near(x1, -0.1) ? " Play stops before the asymptote at " + m("x = 0") + "." : "");
      paintSpeed(); if (cb) cb();
    } });
    paintSpeed();
  }
  function pause(){
    if (!stopPlay) return;
    stopPlay(); stopPlay = null;
    if (playFrom != null && !near(playFrom, dp.get())) trendMsg = trendText(playFrom, dp.get());
    paintSpeed();
  }
  function play(){
    if (stopPlay) { pause(); return; }
    var x0 = dp.get();
    if (x0 >= 3 - 1e-9) { x0 = -3; dp.set(x0, "set"); }
    var x1 = lad().recip && x0 < 0 ? -0.1 : 3;
    if (near(x0, x1)) { x0 = 0.1; dp.set(x0, "set"); x1 = 3; }
    runPlay(x0, x1, Math.abs(x1 - x0) * 1100, null);
  }
  // ---- events ----
  function chooseFn(id){ pause(); S.fn = id; mark = null; extra = false; note = ""; trendMsg = ""; api.save(); dp.set(S.x, "set"); paintAll(); MV.changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.classList.contains("drag-h")) return;
    if (b.id === "hd-play") { if (!busy) play(); return; }
    if (busy) return;
    if (b.dataset.fn) { chooseFn(b.dataset.fn); return; }
    if (b.dataset.rung) { pause(); S.rungs = +b.dataset.rung; extra = false; mark = null; api.save(); paintAll(); MV.changed(); return; }
    if (b.dataset.mode) { pause(); S.mode = b.dataset.mode; mark = null; trendMsg = ""; api.save(); paintAll(); MV.changed(); return; }
    if (b.dataset.pg) { pg += +b.dataset.pg; layout(); dp.render(); }
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.bk; if (!k || busy) return;
    pause(); var B = S[S.fn]; B[k] = +e.target.value; $("#hd-" + k + "out", host).textContent = num(B[k]);
    mark = null; extra = false; trendMsg = ""; api.save(); $("#hd-eq", host).innerHTML = fnHTML();
    layout(); paintCaps(); paintRead(); paintSpeed(); dp.render(); MV.changed();
  });
  var sl = $("#hd-x", host);
  sl.addEventListener("input", function(){ if (busy) { syncSlider(); return; } dp.set(+sl.value, "slider"); syncSlider(); });
  sl.addEventListener("keydown", function(e){
    if (busy) { e.preventDefault(); return; }
    if (e.shiftKey && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) { e.preventDefault(); dp.set(dp.get() + (/Left|Down/.test(e.key) ? -1 : 1), "slider"); }
  });
  if (window.matchMedia) { var mq = window.matchMedia("(max-width: 560px)"); var onMq = function(){ layout(); dp.render(); }; if (mq.addEventListener) mq.addEventListener("change", onMq); else if (mq.addListener) mq.addListener(onMq); }
  dp.set(S.x, "set");
  paintAll();

  // ---- predictions ----
  var START = { p1:{ fn:"L1", rungs:2, mode:"ladder", x:-3, hide:[2] }, p2:{ fn:"L3", rungs:4, mode:"ladder", x:-3, hide:[1, 2, 3, 4] },
    p3:{ fn:"L1", rungs:2, mode:"speed", x:-1, hide:[] }, p4:{ fn:"L4", rungs:4, mode:"ladder", x:-3, hide:[1, 2, 3, 4] } };
  var anim = null;
  function reveal(k, dur, cb){
    pv.hide[k] = false; pv.upTo[k] = -3.4; showPanel(k); paintCaps();
    anim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ var x = -3 + 6 * t; pv.upTo[k] = x; dp.set(x, "anim"); dp.render(); }, done:function(){ anim = null; delete pv.upTo[k]; dp.render(); cb(); } });
  }
  function chain(ks, dur, cb){ if (!ks.length) { cb(); return; } reveal(ks[0], dur, function(){ chain(ks.slice(1), dur, cb); }); }
  function chal(id){
    var M = MS[id], x = dp.get(), Z = lad();
    if (id === "tc1") {
      if (S.fn !== "L2") return { ok:false, msg:M.fn };
      if (near(x, 2, 1e-6)) return { ok:true };
      if (near(x, 3, 1e-6)) return { ok:false, msg:M.three };
      if (near(x, 0, 1e-6)) return { ok:false, msg:M.zero };
      return { ok:false, msg:tpl(M.other, { v:qHTML(Z.L[2].q(xq(x))) }) };
    }
    if (id === "tc2") {
      if (S.fn !== "C") return { ok:false, msg:M.fn };
      var a = S.C.a, b = S.C.b;
      if (a === 2 && b === -6) return { ok:true };
      if (a !== 2) return { ok:false, msg:tpl(M.a, { t:num(6 * a) }) };
      return { ok:false, msg:tpl(M.b, { s:num(12 + 2 * b) }) };
    }
    if (id === "tc3") {
      if (S.fn !== "Q") return { ok:false, msg:M.fn };
      var qa = S.Q.a, qb = S.Q.b, v4 = 192 * qa + 24 * qb;
      if (qa === 1 && qb === -6) return { ok:true };
      if (qa === -1 && qb === 6) return { ok:false, msg:M.flip };
      if (qa === 2 && qb === -12) return { ok:false, msg:M.dbl };
      if (!qa && !qb) return { ok:false, msg:M.none };
      if (qa && qb === -6 * qa) return { ok:false, msg:tpl(M.ratio, { v:num(v4) }) };
      var zs = [0]; if (qa) zs.push(Q.of(-qb, 2 * qa));
      zs = zs.filter(function(z, i){ return !i || Q.val(z) !== 0; });
      return { ok:false, msg:tpl(M.other, { z:zs.map(function(z){ return m("x = " + (typeof z === "number" ? z : (z.n < 0 ? "-" : "") + Math.abs(z.n) + (z.d > 1 ? "/" + z.d : ""))); }).join(" and "), v:num(v4) }) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        pause(); busy = true;
        var s = START[p.id]; S.fn = s.fn; S.rungs = s.rungs; S.mode = s.mode; extra = false; mark = null; note = ""; trendMsg = ""; pg = 0;
        pv = { hide:{}, upTo:{} }; s.hide.forEach(function(k){ pv.hide[k] = true; });
        api.save(); dp.set(s.x, "set"); paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; pv = null; api.save(); paintAll(); MV.changed(); done(); }
        function show(pts, ms, cb){ mark = pts; dp.render(); MV.wait(ms || 900, cb); }
        if (p.id === "p1") reveal(2, 2200, function(){ dp.set(1, "anim"); show([{ i:2, x:1, y:6, text:"f″(x) = 6x: a line", dx:-12, align:"right" }], 1100, fin); });
        else if (p.id === "p2") chain([1, 2, 3, 4], 750, function(){
          extra = true; pv.hide[5] = true; layout(); paintCaps();
          reveal(5, 900, function(){ dp.set(1, "anim"); show([{ i:4, x:1, y:24, text:"f⁽⁴⁾ = 24 = 4!", dy:16 }, { i:5, x:1, y:0, text:"f⁽⁵⁾ = 0 for every x", dy:-16 }], 1100, fin); });
        });
        else if (p.id === "p3") runPlay(-1, -0.5, 1600, function(){ show([{ i:0, x:-1, y:2, text:"slope 0 at the top", dy:-18 }], 1000, fin); });
        else if (p.id === "p4") chain([1, 2, 3, 4], 800, function(){ dp.set(1, "anim"); show([{ i:4, x:1, y:24, text:"24/x⁵: still a power of x", dy:-16, dx:-12, align:"right" }], 1100, fin); });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Read the second derivative ----------
var S1X = [-2, -1, 0, 1, 2], S2X = [-1, 0, 1];
var SF = function(x){ return x * x * x - 3 * x; }, SD = function(x){ return 3 * x * x - 3; }, SD2 = function(x){ return 6 * x; };
var CARDS = {
  c1:{ f:function(x){ return Math.abs(x + 1) < 1e-12 ? NaN : 1 / (x + 1); }, d:function(x){ return -1 / Math.pow(x + 1, 2); }, d2:function(x){ return 2 / Math.pow(x + 1, 3); },
    view:{ xmin:-4.2, xmax:3.2, ymin:-5, ymax:5 }, lo:-4, hi:3, x0:0.5, excl:[-1], asym:[-1], bands:[[-Infinity, -1, -1], [-1, Infinity, 1]],
    top:[{ s:"2", f:function(){ return 2; }, z:[] }], bot:[{ s:"(x + 1)^3", f:function(x){ return Math.pow(x + 1, 3); }, z:[-1] }], pts:[{ x:-1, t:"nd" }] },
  c2:{ f:function(x){ return x < 0 ? NaN : Math.sqrt(x); }, d:function(x){ return x > 0 ? 0.5 / Math.sqrt(x) : NaN; }, d2:function(x){ return x > 0 ? -0.25 / Math.pow(x, 1.5) : NaN; },
    view:{ xmin:-0.6, xmax:9.4, ymin:-0.6, ymax:3.6 }, lo:0.1, hi:9, x0:1, excl:[], asym:[], bands:[[0, Infinity, -1]], lo0:0,
    top:[{ s:"-1", f:function(){ return -1; }, z:[] }], bot:[{ s:"4x^{3/2}", f:function(x){ return 4 * Math.pow(x, 1.5); }, z:[0] }], pts:[{ x:0, t:"undef" }] },
  c3:{ f:function(x){ return Math.abs(x) < 1e-12 ? NaN : x + 4 / x; }, d:function(x){ return 1 - 4 / (x * x); }, d2:function(x){ return 8 / (x * x * x); },
    view:{ xmin:-6.4, xmax:6.4, ymin:-12, ymax:12 }, lo:-6, hi:6, x0:2, excl:[0], asym:[0], bands:[[-Infinity, 0, -1], [0, Infinity, 1]],
    top:[{ s:"8", f:function(){ return 8; }, z:[] }], bot:[{ s:"x^3", f:function(x){ return x * x * x; }, z:[0] }], pts:[{ x:0, t:"nd" }] }
};
function part3(host, api){
  var S = api.S, C = api.content, A = C.st1, B = C.st2;
  var s1 = S.s1 = S.s1 || {};
  if (!Array.isArray(s1.d1) || s1.d1.length !== 5) s1.d1 = [4, 4, 4, 4, 4];
  if (!Array.isArray(s1.d2) || s1.d2.length !== 3) s1.d2 = [3, 3, 3];
  s1.tan = !!s1.tan;
  if (!CARDS[S.card]) S.card = "c1";
  S.cx = S.cx || {};
  var msg1 = null, msg2 = null;
  host.innerHTML =
    '<div class="part p3-st" id="hd-st1"><h3>' + A.title + "</h3><p>" + A.text + '</p><div class="hd-s1"><div class="hd-s1p">' +
      '<p class="hd-pcap"><span class="hd-sw" style="background:var(--pen)" aria-hidden="true"></span>' + m("y = f(x)") + ' <span class="hd-deg">equation hidden</span></p><div class="plot-wrap"><canvas class="plot hd-s1f" id="hd-s1f" role="img" aria-label="The cubic"></canvas></div>' +
      '<p class="hd-pcap"><span class="hd-sw" style="background:var(--f3)" aria-hidden="true"></span>Your ' + m("f′") + ' <span class="hd-deg">one grid square = 2 units up</span></p><div class="plot-wrap"><canvas class="plot hd-s1d" id="hd-s1d1" role="img" aria-label="Your f′ dots"></canvas></div>' +
      '<div class="hd-s1b" hidden><p class="hd-pcap"><span class="hd-sw" style="background:var(--f4)" aria-hidden="true"></span>Your ' + m("f″") + ' <span class="hd-deg">one grid square = 2 units up</span></p>' +
        '<div class="plot-wrap"><canvas class="plot hd-s1d" id="hd-s1d2" role="img" aria-label="Your f″ dots"></canvas></div></div></div>' +
      '<div class="hd-s1c"><p class="how">' + A.how + '</p><div class="q-actions"><button type="button" class="chip" id="hd-tan" data-k="hdtan" aria-pressed="false">' + A.tanOn + "</button></div>" +
        '<h4 class="hd-s1h">1. Sketch ' + m("f′") + '</h4><div class="q-actions"><button type="button" class="btn primary sm" id="hd-chk1" data-k="hdchk1">Check my sketch</button></div><div id="hd-fb1" aria-live="polite"></div>' +
        '<div class="hd-s1b" hidden><h4 class="hd-s1h">2. Sketch ' + m("f″") + "</h4><p>" + A.text2 + '</p><div class="q-actions"><button type="button" class="btn primary sm" id="hd-chk2" data-k="hdchk2">Check my sketch</button></div><div id="hd-fb2" aria-live="polite"></div></div>' +
        '<div id="hd-iv" hidden><h4 class="hd-s1h">3. ' + A.ivPrompt + '</h4><div class="chips" id="hd-ivc" role="group" aria-label="Intervals"></div><div id="hd-fbiv" aria-live="polite"></div></div></div></div></div>' +
    '<div class="part p3-st" id="hd-st2"><h3>' + B.title + "</h3><p>" + B.text + '</p><div class="chips hd-cards" id="hd-cards" role="group" aria-label="Choose a card"></div>' +
      '<div class="sym hd-c2"><div><div class="plot-wrap"><canvas class="plot" id="hd-cplot" role="img" aria-label="The card’s graph"></canvas></div><p class="tiny muted hd-key" id="hd-ckey"></p></div>' +
      '<div><label class="slider"><span class="slider-top"><span>Tangent at ' + m("x") + '</span><output id="hd-cxout"></output></span><input type="range" id="hd-cx" step="0.1" style="accent-color:var(--ink)" aria-label="x-value of the tangent point"></label>' +
      '<dl class="read" id="hd-cread" aria-live="polite"></dl></div></div>' +
      '<details class="alg" id="hd-alg"><summary>Check it with algebra</summary><div class="alg-lines" id="hd-algl"></div><div id="hd-sc"></div></details></div>';
  // ---- Station 1 ----
  var pf = new MV.Plot($("#hd-s1f", host), { xmin:-2.6, xmax:2.6, ymin:-4, ymax:4 });
  var p1 = new MV.Plot($("#hd-s1d1", host), { xmin:-2.6, xmax:2.6, ymin:-6, ymax:12 });
  var p2 = new MV.Plot($("#hd-s1d2", host), { xmin:-2.6, xmax:2.6, ymin:-8, ymax:8 });
  var V1 = { xmin:-2.6, xmax:2.6, ymin:-6, ymax:12 }, V2 = { xmin:-2.6, xmax:2.6, ymin:-8, ymax:8 };
  function off(vals, xs, g){ return xs.map(function(x, i){ return Math.abs(vals[i] - g(x)) > 1 + 1e-9; }); }
  function tanSegs(xs, g, d, col){ return xs.map(function(x){ var y = g(x), s = d(x), h = 0.45; return { x1:x - h, y1:y - h * s, x2:x + h, y2:y + h * s, color:col, width:1.8 }; }); }
  function drawF(){
    var bands = s1.iv === "r" ? [{ x0:0, x1:3, color:css("--hi-soft") }] : [];
    pf.draw({ view:{ xmin:-2.6, xmax:2.6, ymin:-4, ymax:4 }, xTicks:{ step:1 }, yTicks:{ step:1 }, bands:bands, yLabel:"y", curves:[{ f:SF, color:css("--pen"), width:3 }],
      segments:s1.tan && !s1.ok1 ? tanSegs(S1X, SF, SD, css("--ink")) : [], points:S1X.map(function(x){ return { x:x, y:SF(x), r:3.5, color:css("--ink") }; }),
      describe:"A cubic with a local maximum at (−1, 2) and a local minimum at (1, −2); it crosses the origin falling" + (s1.tan && !s1.ok1 ? ". Short tangent lines are drawn at x = −2, −1, 0, 1 and 2." : ".") + (s1.iv === "r" ? " The part where x > 0 is shaded." : "") });
  }
  function drawDots(p, V, xs, vals, g, col, checked, tans, iv){
    var bad = checked ? off(vals, xs, g) : xs.map(function(){ return false; }), red = css("--red"), pts = [], labs = [];
    xs.forEach(function(x, i){
      if (bad[i]) { pts.push({ x:x, y:vals[i], r:12, open:true, color:red }); labs.push({ x:x, y:vals[i], text:"off", dx:16, dy:0, color:red, bg:true, font:ui(12, 700) }); }
      pts.push({ x:x, y:vals[i], r:7, color:col, ring:false });
    });
    p.draw({ view:V, xTicks:{ step:1 }, yTicks:{ step:2 }, yLabel:p === p1 ? "f′(x)" : "f″(x)", bands:iv ? [{ x0:0, x1:3, color:css("--hi-soft") }] : [],
      curves:checked ? [{ f:g, color:col, width:2.4, alpha:0.55 }] : [], segments:tans || [], points:pts, labels:labs,
      describe:"Your dots at " + xs.map(function(x, i){ return "x = " + num(x) + ", height " + num(vals[i], 1) + (bad[i] ? " (off)" : ""); }).join("; ") + (checked ? ". The true curve is drawn behind them." : ".") });
  }
  function draw1(){ drawDots(p1, V1, S1X, s1.d1, SD, css("--f3"), s1.chk1, s1.tan && s1.ok1 && !s1.ok2 ? tanSegs(S2X, SD, SD2, css("--ink")) : null, false); }
  function draw2(){ if (!$(".hd-s1b", host).hidden) drawDots(p2, V2, S2X, s1.d2, SD2, css("--f4"), s1.chk2, null, s1.iv === "r"); }
  pf.render = drawF; p1.render = draw1; p2.render = draw2;
  function dotDrag(p, xs, key, V, name){
    return MV.drag(p, { axis:"y", step:{ x:1, y:1 }, big:2,
      handles:function(){ return xs.map(function(x, i){ return { id:key + i, x:x, y:s1[key][i], label:name + " dot at x = " + num(x) + ", height " + num(s1[key][i], 1) + ". Up and down arrows move it half a grid square." }; }); },
      snap:function(x, y){ return [x, clamp(Math.round(y * 2) / 2, V.ymin + 0.5, V.ymax - 0.5)]; },
      move:function(id, nx, ny){ var i = +id.slice(key.length); s1[key][i] = clamp(Math.round(ny * 2) / 2, V.ymin + 0.5, V.ymax - 0.5); api.save(); if (key === "d1") draw1(); else draw2(); } });
  }
  dotDrag(p1, S1X, "d1", V1, "f′"); dotDrag(p2, S2X, "d2", V2, "f″");
  function paint1(){
    $("#hd-tan", host).setAttribute("aria-pressed", String(s1.tan));
    $("#hd-fb1", host).innerHTML = msg1 ? MV.fbHTML(msg1.good ? "good" : "bad", msg1.html) : s1.ok1 ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + A.good1) : "";
    var bs = $$(".hd-s1b", host), wasHidden = bs[0].hidden; bs.forEach(function(el){ el.hidden = !s1.ok1; });
    $("#hd-fb2", host).innerHTML = msg2 ? MV.fbHTML(msg2.good ? "good" : "bad", msg2.html) : s1.ok2 ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + A.good2) : "";
    $("#hd-iv", host).hidden = !s1.ok2;
    MV.keepFocus($("#hd-ivc", host), function(){
      $("#hd-ivc", host).innerHTML = A.ivs.map(function(v){ var on = s1.iv === v.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-iv="' + v.id + '" data-k="iv' + v.id + '" aria-pressed="' + on + '">' + v.t + "</button>"; }).join("");
    });
    var iv = A.ivs.filter(function(v){ return v.id === s1.iv; })[0];
    $("#hd-fbiv", host).innerHTML = iv ? MV.fbHTML(MV.ok(iv) ? "good" : "bad", (MV.ok(iv) ? "" : "<strong>✗ Not quite.</strong> ") + iv.fb + (MV.ok(iv) ? "" : " Try another interval.")) : "";
    drawF(); draw1(); if (wasHidden && s1.ok1) requestAnimationFrame(draw2); else draw2();
  }
  function check(key){
    var two = key === "d2", xs = two ? S2X : S1X, g = two ? SD2 : SD, bad = off(s1[key], xs, g), ok = !bad.some(Boolean);
    if (two) { s1.chk2 = true; s1.ok2 = ok; } else { s1.chk1 = true; s1.ok1 = s1.ok1 || ok; if (!ok) { s1.ok2 = false; } }
    var M = { good:ok, html:ok ? "<strong>✓ Correct.</strong> " + (two ? A.good2 : A.good1) : "<strong>✗ Not quite.</strong> " + (two ? A.bad2 : A.bad1) + " Off: " + xs.filter(function(x, i){ return bad[i]; }).map(function(x){ return m("x = " + x); }).join(", ") + "." };
    if (two) msg2 = M; else msg1 = M;
    api.save(); paint1(); MV.focusFb($(two ? "#hd-fb2" : "#hd-fb1", host));
  }
  // ---- Station 2 ----
  var pc = new MV.Plot($("#hd-cplot", host), CARDS.c1.view);
  function card(){ return CARDS[S.card]; }
  function cardC(){ return B.cards.filter(function(c){ return c.id === S.card; })[0]; }
  function cxv(){ var K = card(), v = S.cx[S.card]; return v == null ? K.x0 : v; }
  function drawC(){
    var K = card(), V = K.view, x = cxv(), y = K.f(x), d = K.d(x), ink = css("--ink"), hs = css("--hi-soft"), ib = css("--info-bg"), right = x > (V.xmin + V.xmax) / 2;
    var bands = K.bands.map(function(b){ return { x0:Math.max(b[0], V.xmin), x1:Math.min(b[1], V.xmax), color:b[2] > 0 ? hs : ib }; });
    var shortL = pc.c.getBoundingClientRect().width < 520;
    var labs = K.bands.map(function(b){ var a = Math.max(b[0], V.xmin), c = Math.min(b[1], V.xmax); return { x:(a + c) / 2, y:V.ymax, text:b[2] > 0 ? "f″ > 0" + (shortL ? "" : ": slopes increasing") : "f″ < 0" + (shortL ? "" : ": slopes decreasing"), dy:13, align:"center", bg:true, font:ui(12), color:ink }; });
    labs.push({ x:x, y:clamp(y, V.ymin, V.ymax), text:dpSlopeLabel(d), dx:right ? -12 : 12, dy:22, align:right ? "right" : "left", bg:true, font:ui(13) });
    pc.draw({ view:V, bands:bands, yLabel:"y", asymptotes:K.asym.map(function(a){ return { x:a }; }), curves:[{ f:K.f, color:css("--pen"), width:3, domain:K.lo0 != null ? [K.lo0, V.xmax + 1] : null }],
      lines:isFinite(d) ? [{ p:[x, y], q:[x + 1, y + d], color:ink, width:2 }] : [], points:(K.lo0 != null ? [{ x:0, y:0, r:4, color:css("--pen") }] : []).concat([{ x:x, y:y, r:5.5, color:ink }]), labels:labs,
      describe:"Graph of " + cardC().plain + ". " + K.bands.map(function(b){ return (b[2] > 0 ? "f″ > 0 (shaded yellow)" : "f″ < 0 (shaded blue)") + " for " + (isFinite(b[0]) ? "x > " + num(b[0]) : "x < " + num(b[1])); }).join("; ") +
        ". Tangent at x = " + num(x, 1) + " with slope " + num(d, 2) + "." });
  }
  pc.render = drawC;
  function paint2(){
    var K = card(), x = cxv();
    MV.keepFocus($("#hd-cards", host), function(){
      $("#hd-cards", host).innerHTML = B.cards.map(function(c){ var on = c.id === S.card; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-card="' + c.id + '" data-k="card' + c.id + '" aria-pressed="' + on + '">' + c.chip + "</button>"; }).join("");
    });
    var sl = $("#hd-cx", host); sl.min = K.lo; sl.max = K.hi; sl.value = x; $("#hd-cxout", host).textContent = num(x, 1);
    var d2 = K.d2(x);
    var fy = K.f(x), apx = dec(fy, 2).indexOf("≈") === 0;
    $("#hd-cread", host).innerHTML = MV.readoutHTML([["Point", (apx ? "≈ " : "") + m("(" + num(x, 1) + ", " + num(fy, 2) + ")")], [m("f′(x)") + " (slope)", dec(K.d(x), 3)],
      [m("f″(x)"), dec(d2, 3)], ["The slope is…", d2 > 0 ? "increasing as " + m("x") + " increases" : "decreasing as " + m("x") + " increases"]]);
    $("#hd-ckey", host).innerHTML = "Yellow: " + m("f″ > 0") + ". Blue: " + m("f″ < 0") + ". Dashed lines are asymptotes.";
    $("#hd-algl", host).innerHTML = cardC().alg.map(function(l){ return "<div>" + l + "</div>"; }).join("");
    $("#hd-sc", host).innerHTML = '<p class="tiny" style="font-weight:700;margin:10px 0 4px">Sign chart of ' + m("f″") + "</p>" + signChartHTML({ top:K.top, bot:K.bot, d:K.d2, pts:K.pts, lo:K.lo0, dLabel:m("f″(x)"), ptHTML:function(v){ return m(num(v)); } });
    drawC();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.classList.contains("drag-h")) return;
    if (b.id === "hd-tan") { s1.tan = !s1.tan; api.save(); paint1(); return; }
    if (b.id === "hd-chk1") { check("d1"); return; }
    if (b.id === "hd-chk2") { check("d2"); return; }
    if (b.dataset.iv) { s1.iv = b.dataset.iv; api.save(); paint1(); MV.focusFb($("#hd-iv", host)); return; }
    if (b.dataset.card) { S.card = b.dataset.card; api.save(); paint2(); }
  });
  $("#hd-cx", host).addEventListener("input", function(e){
    var K = card(), v = r9(Math.round(+e.target.value * 10) / 10);
    if (K.excl.some(function(z){ return near(z, v); })) { var prev = cxv(); v = r9(v + (v >= prev ? 0.1 : -0.1)); }
    S.cx[S.card] = clamp(v, K.lo, K.hi); api.save(); paint2();
  });
  paint1(); paint2();
  return {};
}

// ---------- Practice 2: Climb the ladder ----------
// @component V8 ladderBoxes (trimmed from MCV4U 11 slopeBoxes) — exact answers in labelled boxes (whole numbers or fractions such
// as −1/4), named wrong values per box ({v:7, fb}), a per-item default message, "one box right" for two-box items, first-try scoring.
function ladderAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q hd-lq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="hd-lin"></div><div class="hd-lcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .hd-lin', host);
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="hd-bxs">' + it.boxes.map(function(b){ return "<label><span>" + b.label + '</span><input class="numin short" data-bx="' + b.k + '" data-k="' + it.id + b.k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(MV.plain(b.label).replace(/\s*=\s*$/, "")) + '" value="' + MV.esc(x.v[b.k] || "") + '"' + (x.solved ? " disabled" : "") + "></label>"; }).join("") + "</div>";
    });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .hd-lcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function val(raw){ var t = String(raw || "").trim(); if (!t) return { empty:true }; var p = MV.parseNum(t); return p && p.length === 1 && isFinite(p[0]) ? { v:p[0] } : { err:true }; }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), W = it.wrong || [], vals = {}, i;
    for (i = 0; i < it.boxes.length; i++) { var r = val(x.v[it.boxes[i].k]); if (r.empty) return { err:it.boxes.length > 1 ? "Fill in every box first." : "Type your answer first." }; if (r.err) return { err:"Type a whole number or a fraction such as 18 or −1/4 in each box." }; vals[it.boxes[i].k] = r.v; }
    if (Object.keys(ans).every(function(k){ return near(vals[k], ans[k], 1e-9); })) return { ok:true };
    var w = W.filter(function(z){ return Object.keys(z).filter(function(k){ return k !== "fb"; }).every(function(k){ return near(vals[k], z[k], 1e-9); }); })[0];
    if (w) return { ok:false, msg:w.fb };
    if (it.wrongDefault) return { ok:false, msg:it.wrongDefault };
    return { ok:false, msg:"Differentiate step by step, then substitute." };
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
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + MV.md(r.msg) + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Slowest slope ----------
var task = (function(){
  var api, P = [];
  function g(k){ var s = api ? api.S : {}, t = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -5 && v <= 5 ? v : null; }
  function read(){ var a = g("a"), b = g("b"), c = g("c"); return { a:a, b:b, c:c, valid:a !== null && b !== null && c !== null }; }
  function poly(d){ return [0, d.c, d.b, d.a]; }
  function eqSrc(d){ return "f(x) = " + pSrc(poly(d)); }
  function xs(d){ return d.a ? Q.of(-d.b, 3 * d.a) : null; }      // where f″ = 0
  function draw(){
    var d = read(), V0 = { xmin:-3, xmax:3, ymin:-5, ymax:5 };
    if (!d.valid) { P.forEach(function(p){ p.draw({ view:V0, describe:"Enter whole numbers from −5 to 5 for a, b and c to draw the ladder." }); }); return; }
    var L = ladder({ poly:poly(d) }, 3), x0 = xs(d), cx = x0 ? clamp(Q.val(x0), -3, 3) : 0, XV = { xmin:cx - 3, xmax:cx + 3 };
    var cols = [css("--pen"), css("--f3"), css("--f4")], names = ["f(x)", "f′(x)", "f″(x)"];
    P.forEach(function(p, i){
      var vw = autoView(L[i].f, XV.xmin, XV.xmax), V = { xmin:XV.xmin, xmax:XV.xmax, ymin:vw.ymin, ymax:vw.ymax }, pts = [], labs = [];
      if (x0) {
        var xv = Q.val(x0), yv = L[i].f(xv);
        if (i === 1) { pts.push({ x:xv, y:yv, r:6, color:cols[1] }); labs.push({ x:xv, y:yv, text:d.a > 0 ? "lowest slope: " + MV.plain(qHTML(L[1].q(x0))) : "highest slope: " + MV.plain(qHTML(L[1].q(x0))), dy:d.a > 0 ? 18 : -18, dx:8, align:"left", bg:true, font:ui(12) }); }
        if (i === 2) { pts.push({ x:xv, y:0, r:6, color:cols[2] }); labs.push({ x:xv, y:0, text:"f″ = 0", dy:-16, dx:8, align:"left", bg:true, font:ui(12) }); }
      }
      p.draw({ view:V, yLabel:names[i], curves:[{ f:L[i].f, color:cols[i], width:i ? 2.6 : 3 }], points:pts, labels:labs,
        after:function(ctx, pl){ if (x0) probeLine(ctx, pl, Q.val(x0)); },
        describe:names[i].replace("(x)", "") + "(x) = " + MV.plain(m(L[i].src)) + (x0 && i === 1 ? "; its " + (d.a > 0 ? "lowest" : "highest") + " point is at x = " + Q.txt(x0) + ", value " + qPlain(L[1].q(x0)) : "") + (x0 && i === 2 ? "; it is 0 at x = " + Q.txt(x0) : "") + "." });
    });
  }
  function readout(){
    var d = read(), el = $("#hd-tread"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Enter whole numbers from −5 to 5 for ' + m("a") + ", " + m("b") + " and " + m("c") + ".</dd></div>"; return; }
    var L = ladder({ poly:poly(d) }, 3), x0 = xs(d), low;
    if (!x0) low = d.b ? "none: " + m("f′") + " is a line" : "always " + num(d.c) + ": " + m("f′") + " is constant";
    else if (d.a > 0) low = qHTML(L[1].q(x0)) + " at " + m("x = " + Q.src(x0));
    else low = "none: " + m("f′") + " has a highest value instead";
    el.innerHTML = MV.readoutHTML([
      ["Function", m(eqSrc(d))],
      [m("f′(x)"), m(L[1].src)], [m("f″(x)"), m(L[2].src)], [m("f‴(x)"), m(L[3].src)],
      [m("f″ = 0") + " at", x0 ? m("x = " + Q.src(x0)) : d.b ? "nowhere" : "every " + m("x")],
      ["Lowest slope", low]
    ]);
  }
  function stepper(k, v){
    return '<div class="hd-tstep"><label for="hd-t' + k + '"><span class="m hd-tlab"><i>' + k + '</i></span> <span class="tiny muted">(−5 to 5)</span></label>' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="hdt' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="hd-t' + k + '" data-tk="' + k + '" type="number" min="-5" max="5" step="1" autocomplete="off" value="' + MV.esc(v) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="hdt' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.a == null) { a.S.a = "1"; a.S.b = "0"; a.S.c = "0"; }
      inp.innerHTML = stepper("a", a.S.a) + stepper("b", a.S.b) + stepper("c", a.S.c);
      pv.innerHTML = '<div class="hd-tpan">' + ["f", "f′", "f″"].map(function(n, i){ return '<div class="plot-wrap"><canvas class="plot ' + (i ? "hd-tlow" : "hd-ttop") + '" role="img" aria-label="' + n + ' panel"></canvas></div>'; }).join("") +
        '</div><dl class="read" id="hd-tread" aria-live="polite" style="margin-top:10px"></dl>';
      P = $$("canvas", pv).map(function(c){ var p = new MV.Plot(c, { xmin:-3, xmax:3, ymin:-5, ymax:5 }); p.render = draw; return p; });
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10);
        if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -5, 5)); $("#hd-t" + k).value = a.S[k];
        a.save(); draw(); readout(); a.update();
      });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers from −5 to 5 for a, b and c."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      var never = d.a > 0 ? d.b * d.b <= 3 * d.a * d.c : d.a === 0 ? d.b === 0 && d.c >= 0 : false;
      return [6 * d.a === 12, d.a !== 0 && -d.b / (3 * d.a) > 0, never, d.c === 2];
    },
    key:function(d){ return d.a + "|" + d.b + "|" + d.c; },
    label:function(k){ var p = k.split("|"); return m(eqSrc({ a:+p[0], b:+p[1], c:+p[2] })); },
    text:function(k){ var p = k.split("|"); return MV.plain(m(pSrc(poly({ a:+p[0], b:+p[1], c:+p[2] })))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ ladder:ladderAct },
  task:task
});
})();
