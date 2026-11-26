// MCV4U 20 Increasing and Decreasing Functions: hero (a tangent rides along f while a sign strip fills in), Slope sign strip
// (Explore: V5 derivative panels with the V11 slope strip; Trace, Build the chart and Derivative view), From f′ back to f
// (Part 3: V14 stroke sketch pad, a C slider over linked panels, a fill-in sign chart), Sign chart builds and Working
// backwards (Practice 1–2) and the "Design a derivative" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function nmS(v){ return String(r9(v)).replace("-", MINUS); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function sgn(v){ return v > 1e-12 ? 1 : v < -1e-12 ? -1 : 0; }
function midOf(a, b){ return !isFinite(a) ? (isFinite(b) ? b - 1 : 0) : !isFinite(b) ? a + 1 : (a + b) / 2; }
var APPROX = false;
function endTxt(v){
  if (v === -Infinity) return MINUS + "∞";
  if (v === Infinity) return "∞";
  if (Math.abs(v * 100 - Math.round(v * 100)) > 1e-6) APPROX = true;
  return num(r9(v), 2);
}
function ivTxt(a, b){ return "(" + endTxt(a) + ", " + endTxt(b) + ")"; }
function ivList(list){ return list.map(function(p){ return ivTxt(p[0], p[1]); }).join(" ∪ "); }
// exact rational text: terminating decimals (≤ 4 places) as decimals, anything else as a fraction
function termQ(q){ var d = q.d, k = 0, j = 0; while (d % 2 === 0) { d /= 2; k++; } while (d % 5 === 0) { d /= 5; j++; } return d === 1 && Math.max(k, j) <= 4; }
function qTxt(q){ return termQ(q) ? num(Q.val(q), 4) : Q.txt(q); }
function qHTML(q){ return termQ(q) ? num(Q.val(q), 4) : m(Q.src(q)) + " ≈ " + num(Q.val(q), 2); }

// =====================================================================================================================
// @component ratFn (from MCV4U 11) — rational functions N/D from integer coefficient arrays (lowest power first): f, f′ by the
// quotient rule and exact values at rational x with MV.mcv.Q (fq, dq return null outside the domain).
function pEval(p, x){ var v = 0; for (var i = p.length - 1; i >= 0; i--) v = v * x + p[i]; return v; }
function pEvalQ(p, q){ var v = Q.of(0); for (var i = p.length - 1; i >= 0; i--) v = Q.add(Q.mul(v, q), Q.of(p[i])); return v; }
function pDer(p){ return p.slice(1).map(function(c, i){ return c * (i + 1); }); }
function pMul(a, b){ var o = [], i; for (i = 0; i < a.length + b.length - 1; i++) o.push(0); a.forEach(function(x, i){ b.forEach(function(y, j){ o[i + j] += x * y; }); }); return o; }
function pSub(a, b){ var n = Math.max(a.length, b.length), o = []; for (var i = 0; i < n; i++) o.push((a[i] || 0) - (b[i] || 0)); return o; }
function pAdd(a, b){ var n = Math.max(a.length, b.length), o = []; for (var i = 0; i < n; i++) o.push((a[i] || 0) + (b[i] || 0)); return o; }
function ratFn(N, D){
  var dN = pDer(N), dD = pDer(D), T = pSub(pMul(dN, D), pMul(N, dD));
  if (!T.length) T = [0];
  function zero(v){ return Math.abs(v) < 1e-12; }
  return { N:N, D:D, T:T,
    f:function(x){ var d = pEval(D, x); return zero(d) ? NaN : pEval(N, x) / d; },
    d:function(x){ var d = pEval(D, x); return zero(d) ? NaN : pEval(T, x) / (d * d); },
    fq:function(q){ var d = pEvalQ(D, q); return d.n ? Q.div(pEvalQ(N, q), d) : null; },
    dq:function(q){ var d = pEvalQ(D, q); return d.n ? Q.div(pEvalQ(T, q), Q.mul(d, d)) : null; } };
}

// ---------- Explore functions F1–F4 and the two families (Fc: x³ − cx, Fb: x³ + bx² + 3x) ----------
var BASE = {
  F1:{ N:[1, 9, -6, 1], D:[1], lo:-1, hi:5, x0:0.5, view:{ xmin:-1.4, xmax:5.4, ymin:-5, ymax:13 }, dv:{ ymin:-6, ymax:18 } },
  F2:{ N:[0, 0, -2, 0, 1], D:[1], lo:-2.2, hi:2.2, x0:-1.6, view:{ xmin:-2.6, xmax:2.6, ymin:-2.5, ymax:7.5 }, dv:{ ymin:-6, ymax:6 } },
  F3:{ N:[0, 0, 0, 1], D:[1], lo:-2, hi:2, x0:-1.5, view:{ xmin:-2.4, xmax:2.4, ymin:-10, ymax:10 }, dv:{ ymin:-3, ymax:15 } },
  F4:{ N:[4, 0, 1], D:[0, 1], lo:-5, hi:5, x0:-3, excl:[0], view:{ xmin:-5.4, xmax:5.4, ymin:-11, ymax:11 }, dv:{ ymin:-6, ymax:2 } },
  Fc:{ lo:-2.4, hi:2.4, x0:-1.5, view:{ xmin:-2.6, xmax:2.6, ymin:-7, ymax:7 }, dv:{ ymin:-6, ymax:14 } },
  Fb:{ lo:-4, hi:4, x0:-3, view:{ xmin:-4.4, xmax:4.4, ymin:-16, ymax:16 }, dv:{ ymin:-8, ymax:20 } }
};
function famZeros(id, c, b){
  if (id === "Fc") { if (c > 0) { var s = Math.sqrt(c / 3); return [{ x:-s, flip:true }, { x:s, flip:true }]; } return c === 0 ? [{ x:0, flip:false }] : []; }
  var D = b * b - 9;
  if (D > 0) { var r = Math.sqrt(D); return [{ x:(-b - r) / 3, flip:true }, { x:(-b + r) / 3, flip:true }]; }
  return D === 0 ? [{ x:-b / 3, flip:false }] : [];
}
var ZEROS = { F1:[{ x:1, flip:true }, { x:3, flip:true }], F2:[{ x:-1, flip:true }, { x:0, flip:true }, { x:1, flip:true }], F3:[{ x:0, flip:false }], F4:[{ x:-2, flip:true }, { x:2, flip:true }] };
function makeSpec(id, C, c, b){
  var B = BASE[id], N, D = [1];
  if (id === "Fc") N = [0, -c, 0, 1]; else if (id === "Fb") N = [0, 3, b, 1]; else { N = B.N; D = B.D; }
  var r = ratFn(pAdd(N, D.map(function(k){ return k * C; })), D), excl = B.excl || [];
  return { id:id, r:r, f:r.f, d:r.d, fq:r.fq, dq:r.dq, zeros:ZEROS[id] || famZeros(id, c, b), excl:excl, asym:excl,
    lo:B.lo, hi:B.hi, step:0.1, view:Object.assign({}, B.view), dv:B.dv };
}
// intervals of increase and decrease: columns between every zero and gap, merged across zeros where f′ keeps its sign
function ivsOf(sp){
  var cuts = sp.zeros.map(function(z){ return { x:z.x, flip:z.flip, g:false }; }).concat(sp.excl.map(function(e){ return { x:e, g:true }; }))
    .sort(function(a, b){ return a.x - b.x; });
  var bs = [-Infinity].concat(cuts.map(function(c){ return c.x; }), [Infinity]), cols = [], runs = [];
  for (var i = 0; i + 1 < bs.length; i++) cols.push({ a:bs[i], b:bs[i + 1], s:sgn(sp.d(midOf(bs[i], bs[i + 1]))) });
  cols.forEach(function(c, i){ var L = runs[runs.length - 1], cut = cuts[i - 1]; if (L && cut && !cut.g && L.s === c.s) L.b = c.b; else runs.push({ a:c.a, b:c.b, s:c.s }); });
  return { cols:cols, runs:runs, cuts:cuts };
}

// =====================================================================================================================
// @component V11 slopeStrip — the slope sign strip (MCV4U 20): a band under the graph painted “+” (pale --pen) where f′ > 0 and
// “−” (pale --ink-2) where f′ < 0, tick marks with “0” at zeros of f′, gaps marked “not in the domain”. In build mode it shows a
// marker, the student’s placed points (● zero, ○ undefined) and the signs the student has entered instead.
//   drawStrip(plot, { view:{xmin, xmax}, d(x), zeros:[{x}], excl:[x], keys:[k = 10x] | "all", build:{pts, sg, mk} | null, describe })
function drawStrip(p, o){
  p.draw({ view:{ xmin:o.view.xmin, xmax:o.view.xmax, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:o.describe || "Slope sign strip", after:function(ctx, pl){
    var W = pl.W, H = pl.H, y0 = 5, y1 = H - 22, ym = (y0 + y1) / 2, ink = css("--ink"), ink2 = css("--ink-2"), v = pl.v;
    var cuts = (o.zeros || []).map(function(z){ return z.x; }).concat(o.excl || []);
    ctx.save();
    ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.strokeRect(0.5, y0 + 0.5, W - 1, y1 - y0);
    var segs = [];
    function push(a, b, s){ if (b - a < 1e-9 || !s) return; var L = segs[segs.length - 1]; if (L && L.s === s && near(L.b, a, 1e-6)) L.b = b; else segs.push({ a:a, b:b, s:s }); }
    function split(a, b, sgnAt){
      var cs = cuts.filter(function(c){ return c > a + 1e-9 && c < b - 1e-9; }).sort(function(p, q){ return p - q; }), s = a;
      cs.concat([b]).forEach(function(c){ push(s, c, sgnAt(midOf(s, c))); s = c; });
    }
    if (o.build) {
      bcCols(o.build.pts).forEach(function(c){ if (!c.iv) return; var g = o.build.sg[c.k]; if (g === "+" || g === "-") push(Math.max(c.a, v.xmin), Math.min(c.b, v.xmax), g === "+" ? 1 : -1); });
    } else if (o.keys === "all") split(v.xmin, v.xmax, function(x){ return sgn(o.d(x)); });
    else {
      var ks = (o.keys || []).slice().sort(function(a, b){ return a - b; }), run = null;
      ks.forEach(function(k){ if (run && k === run[1] + 1) run[1] = k; else { if (run) split(Math.max(v.xmin, run[0] / 10 - 0.05), Math.min(v.xmax, run[1] / 10 + 0.05), function(x){ return sgn(o.d(x)); }); run = [k, k]; } });
      if (run) split(Math.max(v.xmin, run[0] / 10 - 0.05), Math.min(v.xmax, run[1] / 10 + 0.05), function(x){ return sgn(o.d(x)); });
    }
    segs.forEach(function(s){
      var xa = pl.X(s.a), xb = pl.X(s.b);
      ctx.globalAlpha = 0.22; ctx.fillStyle = css(s.s > 0 ? "--pen" : "--ink-2"); ctx.fillRect(xa, y0 + 1, xb - xa, y1 - y0 - 1); ctx.globalAlpha = 1;
      if (xb - xa > 16) { ctx.fillStyle = ink; ctx.font = ui(19, 700); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s.s > 0 ? "+" : MINUS, (xa + xb) / 2, ym + 1); }
    });
    ctx.font = ui(12, 600); ctx.textAlign = "center"; ctx.textBaseline = "top";
    if (!o.build) (o.zeros || []).forEach(function(z){
      if (z.x < v.xmin || z.x > v.xmax) return;
      var seen = o.keys === "all" || (o.keys || []).some(function(k){ return Math.abs(k - z.x * 10) <= 1.0001; }); if (!seen) return;
      var X = Math.round(pl.X(z.x)) + 0.5; ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X, y0 - 3); ctx.lineTo(X, y1 + 3); ctx.stroke();
      ctx.fillStyle = ink; ctx.fillText("0", X, y1 + 5);
    });
    (o.excl || []).forEach(function(e){
      if (e < v.xmin || e > v.xmax) return;
      var X = pl.X(e); ctx.fillStyle = css("--sheet"); ctx.fillRect(X - 6, y0 + 1, 12, y1 - y0 - 1);
      ctx.strokeStyle = ink2; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X - 6, y0); ctx.lineTo(X - 6, y1); ctx.moveTo(X + 6, y0); ctx.lineTo(X + 6, y1); ctx.stroke(); ctx.setLineDash([]);
      if (!o.build) { ctx.fillStyle = ink2; ctx.font = ui(11, 600); ctx.fillText("not in the domain", clamp(X, 52, W - 52), y1 + 5); }
    });
    if (o.build) {
      ctx.font = ui(12, 600);
      o.build.pts.forEach(function(pt){
        var X = pl.X(pt.x);
        ctx.beginPath(); ctx.arc(X, ym, 5.5, 0, Math.PI * 2);
        if (pt.t === "z") { ctx.fillStyle = ink; ctx.fill(); ctx.fillText("0", X, y1 + 5); }
        else { ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = ink2; ctx.fillText("undef.", clamp(X, 22, W - 22), y1 + 5); }
      });
      if (o.build.mk != null) {
        var MX = pl.X(o.build.mk);
        ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(MX, y0); ctx.lineTo(MX, y1); ctx.stroke();
        ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(MX, y0 + 9); ctx.lineTo(MX - 6, y0); ctx.lineTo(MX + 6, y0); ctx.closePath(); ctx.fill();
      }
    }
    ctx.restore();
  } });
}
// ------------------------------------------------- end of V11 slopeStrip --------------------------------------------------------

// =====================================================================================================================
// @component V11 signChart.build (adapted from MCV4U 11 / 14 / 15 for a chart the student builds) — columns from the placed
// points (zeros “z” and undefined points “u”) and the open intervals between them; a sign row (cells cycle +, −, 0), an
// arrow row for f (cells cycle ↗, ↘) and an optional “Increasing here?” row (intervals and zeros toggle). Wrong cells
// are marked ✗ after a check. The table scrolls inside its box on phones.
//   bcCols(pts) -> [{iv:true, a, b, k, mid} | {iv:false, x, t, k}];  bcTableHTML({ pts, sg, ar, sel|null, bad, lock, pre, ptF(col), dLabel })
function ivKey(a, b){ return (isFinite(a) ? r9(a) : "-inf") + "|" + (isFinite(b) ? r9(b) : "inf"); }
function bcCols(pts){
  var ps = pts.slice().sort(function(p, q){ return p.x - q.x; }), b = [-Infinity].concat(ps.map(function(p){ return p.x; }), [Infinity]), cols = [];
  for (var i = 0; i + 1 < b.length; i++) {
    cols.push({ iv:true, a:b[i], b:b[i + 1], k:ivKey(b[i], b[i + 1]), mid:midOf(b[i], b[i + 1]) });
    if (i < ps.length) cols.push({ iv:false, x:ps[i].x, t:ps[i].t, k:"p" + r9(ps[i].x) });
  }
  return cols;
}
function sgDisp(g){ return g === "+" ? "+" : g === "-" ? MINUS : g === "0" ? "0" : "?"; }
function bcTableHTML(o){
  var cols = bcCols(o.pts), bad = o.bad || {}, pre = o.pre || "bc";
  function end(v){ return v === -Infinity ? MINUS + "∞" : v === Infinity ? "∞" : nmS(v); }
  function td(c, kind, html, cls){ var b = bad[kind + "|" + c.k] || (!c.iv && bad["pt|" + c.k]); return "<td" + ((cls || b) ? ' class="' + [cls || "", b ? "id-bad" : ""].join(" ").trim() + '"' : "") + ">" + (b ? '<span class="id-x" aria-hidden="true">✗</span><span class="vh">wrong: </span>' : "") + html + "</td>"; }
  function btn(kind, c, html, pressed, label){
    return '<button type="button" class="id-cell" data-bc="' + kind + '" data-key="' + c.k + '" data-k="' + pre + kind + c.k + '"' + (pressed != null ? ' aria-pressed="' + pressed + '"' : "") + (o.lock ? " disabled" : "") + ' aria-label="' + MV.esc(label) + '">' + html + "</button>";
  }
  function lab(c){ return c.iv ? "(" + end(c.a) + ", " + end(c.b) + ")" : "x = " + end(c.x); }
  var h = '<div class="tbl-wrap id-scwrap"><table class="vt id-sct"><caption class="vh">' + (o.caption || "Your sign chart") + '</caption><thead><tr><th scope="col">' + m("x") + "</th>" +
    cols.map(function(c){ return '<th scope="col"' + (bad["pt|" + c.k] ? ' class="id-bad"' : "") + ">" + lab(c).replace(/^x = /, "") + "</th>"; }).join("") + "</tr></thead><tbody>";
  h += '<tr><th scope="row">' + (o.dLabel || "Sign of " + m("f′(x)")) + "</th>" + cols.map(function(c){
    if (!c.iv) return td(c, "sg", c.t === "z" ? "0" : '<span class="id-u">undefined</span>', "id-pt");
    var g = o.sg[c.k]; return td(c, "sg", btn("sg", c, sgDisp(g), null, "Sign of f′ on " + lab(c) + ": " + (g ? sgDisp(g).replace(MINUS, "minus") : "not set") + ". Tap to change."));
  }).join("") + "</tr>";
  h += '<tr><th scope="row">' + m("f") + "</th>" + cols.map(function(c){
    if (!c.iv) return td(c, "ar", '<span class="id-u">' + (o.ptF ? o.ptF(c) : c.t === "z" ? "slope 0" : "not in the domain") + "</span>", "id-pt");
    var a = o.ar[c.k]; return td(c, "ar", btn("ar", c, a === "u" ? '<span aria-hidden="true">↗</span>' : a === "d" ? '<span aria-hidden="true">↘</span>' : "?", null, "f on " + lab(c) + ": " + (a === "u" ? "increasing" : a === "d" ? "decreasing" : "not set") + ". Tap to change."), "id-arc");
  }).join("") + "</tr>";
  if (o.sel) h += '<tr class="id-selrow"><th scope="row">Increasing here?</th>' + cols.map(function(c){
    if (!c.iv && c.t !== "z") return td(c, "sel", "—", "id-pt");
    var on = !!o.sel[c.k]; return td(c, "sel", btn("sel", c, on ? "✓" : "", on, "Select " + lab(c) + " as part of where f is increasing"));
  }).join("") + "</tr>";
  return h + "</tbody></table></div>";
}
function bcCycle(st, kind, k){
  if (kind === "sg") st.sg[k] = st.sg[k] === "+" ? "-" : st.sg[k] === "-" ? "0" : "+";
  else if (kind === "ar") st.ar[k] = st.ar[k] === "u" ? "d" : "u";
  else if (kind === "sel") st.sel[k] = !st.sel[k];
}
// the student's selection as interval pieces (intervals open, zeros as single points)
function bcSel(pts, sel){
  var ps = [];
  bcCols(pts).forEach(function(c){ if (!sel[c.k]) return; if (c.iv) ps.push({ a:c.a, b:c.b, aIn:false, bIn:false }); else if (c.t === "z") ps.push({ a:c.x, b:c.x, aIn:true, bIn:true }); });
  return MV.iv.norm(ps);
}
// marker row + point buttons (shared by Explore Build mode and Practice builds)
function placeHTML(pre, mk, at, lock){
  var dis = lock ? " disabled" : "";
  return '<div class="id-mkrow"><span class="tiny" style="font-weight:700">Marker</span><button type="button" class="btn ghost sm id-pm" data-bm="-1" data-k="' + pre + 'mm" aria-label="Move the marker left"' + dis + ">" + MINUS + "</button>" +
    '<output class="id-mkout" aria-live="polite">' + m("x = " + nmS(mk).replace(MINUS, "-")) + '</output><button type="button" class="btn ghost sm id-pm" data-bm="1" data-k="' + pre + 'mp" aria-label="Move the marker right"' + dis + ">+</button></div>" +
    '<div class="q-actions id-place"><button type="button" class="btn ghost sm" data-bp="z" data-k="' + pre + 'pz" aria-pressed="' + !!(at && at.t === "z") + '"' + dis + ">Zero of " + m("f′") + " here</button>" +
    '<button type="button" class="btn ghost sm" data-bp="u" data-k="' + pre + 'pu" aria-pressed="' + !!(at && at.t === "u") + '"' + dis + ">" + m("f′") + " undefined here</button></div>";
}
function ptAt(pts, x){ return pts.filter(function(p){ return near(p.x, x, 1e-9); })[0] || null; }
function togglePt(st, x, t){
  var at = ptAt(st.pts, x);
  if (at && at.t === t) st.pts.splice(st.pts.indexOf(at), 1);
  else if (at) at.t = t;
  else if (st.pts.length < 6) st.pts.push({ x:r9(x), t:t });
  st.pts.sort(function(a, b){ return a.x - b.x; });
}
// ------------------------------------------------- end of V11 signChart.build ---------------------------------------------------

// =====================================================================================================================
// @component V5 derivativePanels (adapted from MCV4U 11: adds the V11 slope strip between f and f′) — linked panels on one
// shared x-axis with one probe line. Top: f (--pen, 3 px), vertical asymptotes, the tangent (--ink, 2 px) and a “slope = …”
// label; a point outside the window becomes an edge arrow. Middle: the strip (drawn by o.strip). Lower (optional, hidden
// unless shown): f′ (--f3, 2.6 px), faint where the strip isn’t painted (trail mode: painted runs solid), the (x, f′(x)) dot.
// Non-domain x-values (FN.excl) are skipped in the direction of motion; onMove is told which value was skipped.
//   var dp = derivativePanels(host, { fn(){ return FN; }, x, big:10, aria:[top, strip, low], strip(plot, x), tapStrip(x),
//     runs(){ return [[a, b]] | null }, extra(i, scene, plot, x), describe(i, x), locked(), handleLabel(x), onMove(x, how, prev, skipped) })
//   FN = { f, d, view, dv, lo, hi, step, excl:[x], asym:[x], zeros:[{x}] }  ->  { get(), set(x, how), render(), plots, showLow(bool), focus() }
function isEx(Fn, v){ return (Fn.excl || []).some(function(e){ return Math.abs(e - v) < 1e-9; }); }
function dpSnap(Fn, v, prev){
  var st = Fn.step || 0.1, lo = Fn.lo, hi = Fn.hi, skipped = null;
  v = r9(Math.max(lo, Math.min(hi, Math.round(v / st) * st)));
  if (isEx(Fn, v)) {
    skipped = v;
    var dir = prev == null || v >= prev ? 1 : -1, w = r9(v + dir * st);
    if (w > hi || w < lo || isEx(Fn, w)) w = r9(v - dir * st);
    v = w;
  }
  return { v:v, skipped:skipped };
}
function dpSlopeLabel(v){
  if (!isFinite(v)) return "no tangent";
  if (Math.abs(v) < 1e-12) return "slope = 0";
  var c = Math.round(r9(v) * 100), exact = Math.abs(r9(v) * 100 - c) < 1e-6;
  return "slope " + (exact ? "= " : "≈ ") + (c < 0 ? MINUS : "") + num(Math.abs(c) / 100, 2);
}
function dpEdge(ctx, p, x, y, col){
  var v = p.v; if (!v || !isFinite(y) || (y <= v.ymax && y >= v.ymin)) return;
  var X = p.X(x), up = y > v.ymax, Y = up ? 4 : p.H - 4, s = 8;
  ctx.save(); ctx.fillStyle = col; ctx.beginPath();
  if (up) { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y + s * 1.4); ctx.lineTo(X + s, Y + s * 1.4); }
  else { ctx.moveTo(X, Y); ctx.lineTo(X - s, Y - s * 1.4); ctx.lineTo(X + s, Y - s * 1.4); }
  ctx.closePath(); ctx.fill();
  ctx.font = ui(13); ctx.textAlign = X > p.W - 70 ? "right" : "left"; ctx.textBaseline = up ? "top" : "bottom";
  ctx.fillText(num(y, 2), X + (X > p.W - 70 ? -12 : 12), up ? 4 : p.H - 4);
  ctx.restore();
}
function derivativePanels(host, o){
  var aria = o.aria || [];
  host.classList.add("dp-panels");
  host.innerHTML = '<div class="plot-wrap dp-panel"><canvas class="plot dp-top" role="img" aria-label="' + MV.esc(aria[0] || "") + '"></canvas></div>' +
    '<div class="plot-wrap dp-panel id-stripwrap"><canvas class="plot id-strip" role="img" aria-label="' + MV.esc(aria[1] || "") + '"></canvas></div>' +
    '<div class="plot-wrap dp-panel dp-lowwrap" hidden><canvas class="plot dp-low" role="img" aria-label="' + MV.esc(aria[2] || "") + '"></canvas></div>';
  var cv = $$("canvas", host), x = o.x, plots = cv.map(function(c){ return new MV.Plot(c, { xmin:-1, xmax:1, ymin:-1, ymax:1 }); }), lowWrap = $(".dp-lowwrap", host);
  function F(){ return o.fn(); }
  function probeLine(ctx, p){
    var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
  }
  function topScene(){
    var Fn = F(), V = Fn.view, ink = css("--ink"), y = Fn.f(x), d = Fn.d(x), ok = isFinite(d) && isFinite(y), yc = clamp(y, V.ymin, V.ymax), right = (x - V.xmin) / (V.xmax - V.xmin) > 0.55;
    var sc = { view:V, yLabel:"y", asymptotes:(Fn.asym || []).map(function(a){ return { x:a, label:"" }; }), curves:[{ f:Fn.f, color:css("--pen"), width:3 }], lines:[], points:[], labels:[], segments:[] };
    if (ok) sc.lines.push({ p:[x, y], q:[x + 1, y + d], color:ink, width:2 });
    if (ok && y === yc) sc.points.push({ x:x, y:y, r:6, color:ink, ring:true });
    if (ok) sc.labels.push({ x:x, y:yc, text:dpSlopeLabel(d), dx:right ? -14 : 14, dy:yc > V.ymax - (V.ymax - V.ymin) * 0.15 ? 22 : -22, align:right ? "right" : "left", bg:true, font:ui(14) });
    sc.after = function(ctx, pl){ probeLine(ctx, pl); dpEdge(ctx, pl, x, y, ink); };
    return sc;
  }
  function lowScene(){
    var Fn = F(), V = Fn.view, c = css("--f3"), v2 = { xmin:V.xmin, xmax:V.xmax, ymin:Fn.dv.ymin, ymax:Fn.dv.ymax }, gy = Fn.d(x), runs = o.runs ? o.runs() : null;
    var s2 = { view:v2, yLabel:"f′(x)", asymptotes:(Fn.asym || []).map(function(a){ return { x:a, label:"" }; }), curves:[{ f:Fn.d, color:c, width:2.6, alpha:runs ? 0.35 : 1 }], points:[], labels:[], segments:[] };
    (runs || []).forEach(function(r){ s2.curves.push({ f:Fn.d, color:c, width:2.8, domain:[r[0], r[1]] }); });
    (Fn.zeros || []).forEach(function(z){ s2.points.push({ x:z.x, y:0, r:5, open:true, color:css("--ink") }); });
    if (isFinite(gy) && gy >= v2.ymin && gy <= v2.ymax) s2.points.push({ x:x, y:gy, r:5.5, color:c, ring:true });
    s2.after = function(ctx, pl){ probeLine(ctx, pl); dpEdge(ctx, pl, x, gy, c); };
    return s2;
  }
  var busy = false;
  function render(){
    if (busy) return; busy = true;
    try {
      var sc = topScene(); if (o.extra) o.extra(0, sc, plots[0], x); if (o.describe) sc.describe = o.describe(0, x); plots[0].draw(sc);
      o.strip(plots[1], x);
      if (!lowWrap.hidden) { var s2 = lowScene(); if (o.extra) o.extra(2, s2, plots[2], x); if (o.describe) s2.describe = o.describe(2, x); plots[2].draw(s2); }
    } finally { busy = false; }
  }
  plots.forEach(function(p){ p.render = render; });
  function set(v, how){
    if (o.locked && o.locked() && how !== "anim" && how !== "set") return;
    var s = dpSnap(F(), v, x);
    if (s.v === x && how !== "set") { if (s.skipped != null && o.onMove) { o.onMove(x, how, x, s.skipped); render(); } return; }
    var prev = x; x = s.v;
    if (o.onMove) o.onMove(x, how, prev, s.skipped);
    render();
  }
  var dr = MV.drag(plots[0], { axis:"x", step:{ x:0.1, y:0.1 }, big:o.big || 10,
    handles:function(){ var Fn = F(), y = Fn.f(x), V = Fn.view; return [{ id:"probe", x:x, y:isFinite(y) ? clamp(y, V.ymin, V.ymax) : 0, label:o.handleLabel ? o.handleLabel(x) : "Probe at x = " + num(x, 1) + ". Arrow keys move it; Shift moves it by 1." }]; },
    move:function(id, nx, ny, how){ set(nx, how === "key" ? "key" : "drag"); } });
  plots.forEach(function(p, i){
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
    p.c.addEventListener("pointerdown", function(e){
      if (e.defaultPrevented || !p.v) return;
      if (i === 1 && o.tapStrip && o.tapStrip(at(e))) { e.preventDefault(); return; }
      active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {}
      set(at(e), "tap");
    });
    p.c.addEventListener("pointermove", function(e){ if (active) set(at(e), "drag"); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  });
  return { get:function(){ return x; }, set:set, render:render, plots:plots, showLow:function(on){ lowWrap.hidden = !on; }, focus:function(){ dr.focus("probe"); } };
}
// ------------------------------------------------- end of V5 derivativePanels ---------------------------------------------------

// ---------- hero: f(x) = x³ − 6x² + 9x + 1 draws in; a tangent rides along it; the sign strip fills in behind it ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var fn = function(x){ return x * x * x - 6 * x * x + 9 * x + 1; }, dfn = function(x){ return 3 * (x - 1) * (x - 3); };
  var V = { xmin:-0.6, xmax:4.6, ymin:-5.4, ymax:8 }, X0 = -0.2, X1 = 4.2, B0 = -4.9, B1 = -3.1;
  var p = new MV.Plot(cv, V), st = { x:X0, arr:0, seen:{}, done:false }, fac = $("#id-hfac");
  function now(){ return window.performance ? performance.now() : 0; }
  function desc(){
    if (st.done) return "Graph of f(x) = x³ − 6x² + 9x + 1. Under the x-axis, a sign strip: + and rising on (−∞, 1), 0 at x = 1, − and falling on (1, 3), 0 at x = 3, + and rising on (3, ∞). Above the strip: f′(x) = 3(x − 1)(x − 3).";
    return "Graph of f(x) = x³ − 6x² + 9x + 1 drawn up to x = " + num(st.x, 1) + ", with a tangent of slope " + num(dfn(st.x), 2) + " there; the sign strip is filled in up to the same x.";
  }
  function draw(){
    var x = st.x, t = now();
    p.draw({ view:V, yLabel:"f(x)", curves:[{ f:fn, color:css("--pen"), width:3, domain:[X0, Math.max(X0 + 0.01, x)] }], describe:desc(), after:function(ctx, pl){
      var top = pl.Y(-2.55), by0 = pl.Y(B1), by1 = pl.Y(B0), bh = by1 - by0, ink = css("--ink"), xa = pl.X(X0), xb = pl.X(X1);
      ctx.save(); ctx.fillStyle = css("--sheet"); ctx.fillRect(0, top, pl.W, pl.H - top);
      ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.strokeRect(xa + 0.5, by0 + 0.5, xb - xa, bh);
      [[X0, 1, 1], [1, 3, -1], [3, X1, 1]].forEach(function(s){
        var a = s[0], b = Math.min(s[1], x); if (b <= a) return;
        var pa = pl.X(a), pb = pl.X(b);
        ctx.globalAlpha = 0.22; ctx.fillStyle = css(s[2] > 0 ? "--pen" : "--ink-2"); ctx.fillRect(pa, by0 + 1, pb - pa, bh - 1); ctx.globalAlpha = 1;
        if (pb - pa > 20) { ctx.fillStyle = ink; ctx.font = ui(20, 700); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s[2] > 0 ? "+" : MINUS, (pa + pb) / 2 - (st.arr ? 14 : 0), by0 + bh / 2 + 1); }
        if (st.arr && b >= s[1] - 1e-9) { ctx.globalAlpha = st.arr; ctx.fillStyle = css("--pen"); ctx.font = ui(22, 700); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s[2] > 0 ? "↗" : "↘", (pa + pb) / 2 + 14, by0 + bh / 2); ctx.globalAlpha = 1; }
      });
      [1, 3].forEach(function(z){
        if (x < z) return;
        var X = Math.round(pl.X(z)) + 0.5, age = st.done ? 99 : (t - (st.seen[z] || t)) / 1000;
        ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X, by0 - 3); ctx.lineTo(X, by1 + 3); ctx.stroke();
        var big = age < 0.9 ? 1 + 0.5 * Math.sin(age / 0.9 * Math.PI) : 1;
        ctx.fillStyle = ink; ctx.font = ui(Math.round(13 * big), 700); ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText("0", X, by1 + 4);
        if (age < 0.9) { ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X, by0 + bh / 2, 10 + 8 * Math.sin(age / 0.9 * Math.PI), 0, Math.PI * 2); ctx.stroke(); }
      });
      if (!st.done) {
        var y = fn(x), d = dfn(x), px = pl.X(x), py = pl.Y(y), dx = pl.X(x + 1) - px, dy = pl.Y(y + d) - py, L = Math.hypot(dx, dy) || 1, ux = dx / L * 48, uy = dy / L * 48;
        ctx.strokeStyle = ink; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(px - ux, py - uy); ctx.lineTo(px + ux, py + uy); ctx.stroke();
        ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
        ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(px, Math.min(py, pl.Y(0))); ctx.lineTo(px, by0); ctx.stroke();
      }
      ctx.restore();
      if (fac) { fac.style.left = (cv.offsetLeft + pl.X(2)) + "px"; fac.style.top = (cv.offsetTop + pl.Y(-1.75)) + "px"; }
    } });
  }
  p.render = draw;
  function finish(){ st.x = X1; st.arr = 1; st.done = true; st.seen = { 1:1, 3:1 }; draw(); if (fac) fac.classList.add("on"); if (f.cap) f.cap.innerHTML = "The strip: + on (−∞, 1), − on (1, 3), + on (3, ∞). The graph rises, falls, then rises."; }
  if (MV.reduceMotion) { finish(); return; }
  draw(); if (f.cap) f.cap.innerHTML = "Watch the strip under the graph.";
  MV.wait(600, function(){
    MV.tween({ dur:5600, ease:function(k){ return k; }, step:function(k){
      st.x = X0 + (X1 - X0) * k;
      [1, 3].forEach(function(z){ if (st.x >= z && !st.seen[z]) st.seen[z] = now(); });
      if (f.cap) f.cap.innerHTML = "Slope at " + m("x = " + num(st.x, 1)) + ": " + (Math.abs(dfn(st.x)) < 0.05 ? "0" : dfn(st.x) > 0 ? "positive (+)" : "negative (−)");
      draw();
    }, done:function(){
      st.x = X1; st.done = false; draw();
      MV.tween({ dur:600, step:function(k){ st.arr = k; draw(); }, done:function(){ MV.wait(300, finish); } });
    } });
  });
}

// ---------- Explore: slope sign strip ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {}, FNC = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  C.fns.forEach(function(q){ FNC[q.id] = q; });
  if (!FNC[S.fn]) S.fn = "F1";
  if (["trace", "build", "deriv"].indexOf(S.mode) < 0) S.mode = "trace";
  S.x = S.x || {}; S.paint = S.paint || {}; S.bd = S.bd || {}; S.tc3 = Array.isArray(S.tc3) ? S.tc3 : [];
  S.C = Number.isInteger(S.C) ? S.C : 0; S.c = Number.isInteger(S.c) ? S.c : 3; S.b = Number.isInteger(S.b) ? S.b : 4;
  var busy = false, mark = null, note = "", bfb = null, bbad = {}, SP = null, stopAnim = null, B = C.build;
  function key(){ return S.fn + "|" + S.C + "|" + (S.fn === "Fc" ? S.c : S.fn === "Fb" ? S.b : ""); }
  function spec(){ if (!SP || SP.key !== key()) { SP = makeSpec(S.fn, S.C, S.c, S.b); SP.key = key(); } return SP; }
  function xv(){ var v = S.x[S.fn]; return v == null ? BASE[S.fn].x0 : v; }
  function keys(){ return S.paint[S.fn] || (S.paint[S.fn] = []); }
  function bd(){ var b = S.bd[S.fn]; if (!b || !b.pts) b = S.bd[S.fn] = { pts:[], sg:{}, ar:{}, sel:{}, mk:0 }; return b; }
  function buildable(){ return /^F[1-4]$/.test(S.fn); }
  function q(s){ return $(s, host); }
  host.innerHTML = '<div class="dp-ex id-ex"><div class="dp-main" data-mv="graph"><p class="eq-cap id-eq" id="id-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="id-panels"></div><p class="tiny muted id-key" id="id-key"></p><p class="id-note" id="id-note" aria-live="polite"></p><div class="id-build" id="id-build" hidden></div></div>' +
    '<div class="dp-side"><div class="chips id-fns" id="id-fn" role="group" aria-label="Choose a function"></div><div class="seg-wrap" id="id-mode"></div><p class="tiny muted id-how" id="id-how"></p>' +
    '<label class="slider id-sl"><span class="slider-top"><span>Probe, ' + m("x") + '</span><output id="id-xout"></output></span><input type="range" id="id-x" step="0.1" style="accent-color:var(--ink)" aria-label="x-value of the probe"></label>' +
    '<label class="slider id-sl"><span class="slider-top"><span>' + C.shift + '</span><output id="id-cout"></output></span><input type="range" id="id-C" min="-5" max="5" step="1" style="accent-color:var(--ink)" aria-label="Vertical shift C, from −5 to 5"></label>' +
    '<div id="id-fam"></div><div class="q-actions id-acts" id="id-acts"></div><dl class="read id-read" id="id-read" aria-live="polite"></dl></div></div>';
  var dp = derivativePanels(q("#id-panels"), {
    fn:spec, x:xv(), big:10, aria:["Graph of f with the tangent at the probe", "Slope sign strip", "Graph of f′, the slope at each x"],
    strip:function(p){ var sp = spec(), bm = S.mode === "build" && buildable(); drawStrip(p, { view:sp.view, d:sp.d, zeros:sp.zeros, excl:sp.excl, keys:keys(), build:bm ? { pts:bd().pts, sg:bd().sg, mk:bd().mk } : null, describe:stripDesc() }); },
    tapStrip:function(x){ if (S.mode !== "build" || !buildable() || busy) return false; var b = bd(), sp = spec(); b.mk = clamp(Math.round(x * 2) / 2, Math.ceil(sp.lo * 2) / 2, Math.floor(sp.hi * 2) / 2); api.save(); paintBuild(); dp.render(); return true; },
    runs:function(){ return S.mode === "deriv" ? runsOf(keys()) : null; },
    extra:function(i, sc){
      if (i === 0 && S.C) sc.labels.push({ x:spec().view.xmin, y:spec().view.ymax, text:"y = f(x) " + (S.C > 0 ? "+ " : MINUS + " ") + Math.abs(S.C), dx:8, dy:14, align:"left", bg:true, color:css("--pen"), font:"italic 600 14px " + (css("--font-math") || "serif") });
      if (!mark || mark.fn !== S.fn) return;
      mark.pts.forEach(function(pt){
        if (pt.i !== i) return;
        sc.points.push({ x:pt.x, y:pt.y, r:8, open:true, color:css("--ink") });
        sc.labels.push({ x:pt.x, y:pt.y, text:pt.text, dx:pt.dx || 12, dy:pt.dy || -18, align:pt.align || "left", bg:true, font:ui(13) });
      });
    },
    describe:describe, locked:function(){ return busy; },
    handleLabel:function(x){ var sp = spec(), d = sp.d(x); return "Probe at x = " + num(x, 1) + ", slope " + (isFinite(d) ? num(d, 2) : "undefined") + ". Arrow keys move it by 0.1; Shift moves it by 1."; },
    onMove:function(x, how, prev, skipped){
      S.x[S.fn] = x;
      if (prev != null && how !== "set") addKeys(prev, x); else addKeys(x, x);
      if (how !== "anim" && how !== "set") { mark = null; }
      if (skipped != null) note = tpl(C.skip, { x:m("x = " + nmS(skipped).replace(MINUS, "-")) }); else if (how !== "anim" && !busy) note = "";
      if (how !== "anim") api.save();
      syncSliders(); paintRead(); paintNote();
      if (how !== "anim") MV.changed();
    }
  });
  function addKeys(a, b){
    var sp = spec(), K = keys(), lo = Math.round(Math.min(a, b) * 10), hi = Math.round(Math.max(a, b) * 10);
    for (var k = lo; k <= hi; k++) { var x = k / 10; if (x < sp.lo - 1e-9 || x > sp.hi + 1e-9 || isEx(sp, x) || !isFinite(sp.d(x))) continue; if (K.indexOf(k) < 0) K.push(k); }
  }
  function fillAll(){ var sp = spec(); addKeys(sp.lo, sp.hi); }
  function runsOf(ks){
    var s = ks.slice().sort(function(a, b){ return a - b; }), out = [], r = null;
    s.forEach(function(k){ if (r && k === r[1] + 1) r[1] = k; else { if (r) out.push(r); r = [k, k]; } }); if (r) out.push(r);
    return out.filter(function(r){ return r[1] > r[0]; }).map(function(r){ return [r[0] / 10, r[1] / 10]; });
  }
  function painted(a, b){ return keys().some(function(k){ return k / 10 > a + 1e-9 && k / 10 < b - 1e-9; }); }
  function ivsPlain(sp){ var I = ivsOf(sp); APPROX = false; var inc = I.runs.filter(function(r){ return r.s > 0; }).map(function(r){ return ivTxt(r.a, r.b); }), dec = I.runs.filter(function(r){ return r.s < 0; }).map(function(r){ return ivTxt(r.a, r.b); });
    return (inc.length ? "Increasing on " + inc.join(" and ") : "Never increasing") + (dec.length ? ", decreasing on " + dec.join(" and ") : ", never decreasing") + (APPROX ? " (ends rounded)" : "") + "."; }
  function fnPlain(){ var c = FNC[S.fn].plain; if (S.fn === "Fc") c = "f(x) = x³ " + (S.c < 0 ? "+ " + -S.c : MINUS + " " + S.c) + "x"; if (S.fn === "Fb") c = "f(x) = x³ " + (S.b < 0 ? MINUS + " " + -S.b : "+ " + S.b) + "x² + 3x"; return c + (S.C ? (S.C > 0 ? " + " : " " + MINUS + " ") + Math.abs(S.C) : ""); }
  function describe(i, x){
    var sp = spec(), y = sp.f(x), d = sp.d(x);
    if (i === 0) return "Graph of " + fnPlain() + ". " + ivsPlain(sp) + " Tangent at x = " + num(x, 1) + (isFinite(d) ? ", point (" + num(x, 1) + ", " + num(y, 2) + "), slope " + num(d, 2) + "." : ": not in the domain.");
    return "Graph of f′ in teal. At x = " + num(x, 1) + ", f′ = " + (isFinite(d) ? num(d, 2) : "undefined") + ". Zeros of f′ at " + (sp.zeros.length ? sp.zeros.map(function(z){ return num(z.x, 2); }).join(", ") : "no x-value") + ".";
  }
  function stripDesc(){
    var sp = spec();
    if (S.mode === "build" && buildable()) { var b = bd(); return "Your chart on the strip: marker at x = " + nmS(b.mk) + "; placed " + (b.pts.length ? b.pts.map(function(p){ return (p.t === "z" ? "zero at " : "undefined point at ") + nmS(p.x); }).join(", ") : "no points") + "."; }
    var rs = runsOf(keys()); if (!keys().length) return "Slope sign strip, not painted yet. Move the probe to paint it.";
    APPROX = false;
    return "Slope sign strip painted on " + rs.map(function(r){ return "[" + num(r[0], 1) + ", " + num(r[1], 1) + "]"; }).join(", ") + ". " + ivsOf(sp).cols.filter(function(c){ return painted(c.a, c.b); }).map(function(c){ return (c.s > 0 ? "plus" : "minus") + " on " + ivTxt(c.a, c.b); }).join("; ") + (sp.excl.length ? ". Gap at x = 0: not in the domain." : ".");
  }
  // ---- readouts ----
  function qx(x){ return Q.of(Math.round(x * 10), 10); }
  function paintRead(){
    var sp = spec(), x = xv(), R = C.rows, fq = sp.fq(qx(x)), dq = sp.dq(qx(x)), d = sp.d(x), s = sgn(d);
    var rows = [
      [R.pt, isFinite(sp.f(x)) && fq ? m("(" + nmS(x).replace(MINUS, "-") + ", " + qTxt(fq).replace(MINUS, "-") + ")").replace(/\{|\}/g, "") : "not in the domain"],
      [R.slope, dq ? m("f′(" + nmS(x).replace(MINUS, "-") + ") =") + " " + qHTML(dq) : "undefined"],
      [R.sign, !isFinite(d) ? "undefined" : s > 0 ? "positive" : s < 0 ? "negative" : "zero"],
      [R.dir, !isFinite(d) ? "not in the domain" : s > 0 ? m("f") + " is increasing" : s < 0 ? m("f") + " is decreasing" : "level for an instant"]
    ];
    if (S.mode === "build" && buildable()) rows.push([R.ivs, '<span class="muted">Build the chart yourself.</span>']);
    else {
      var I = ivsOf(sp); APPROX = false;
      var inc = I.runs.filter(function(r){ return r.s > 0 && painted(r.a, r.b); }), dec = I.runs.filter(function(r){ return r.s < 0 && painted(r.a, r.b); }), parts = [];
      if (inc.length) parts.push("increasing on " + ivList(inc.map(function(r){ return [r.a, r.b]; })));
      if (dec.length) parts.push("decreasing on " + ivList(dec.map(function(r){ return [r.a, r.b]; })));
      rows.push([R.ivs, parts.length ? parts.join("; ") + (APPROX ? ' <span class="tiny muted">(ends rounded)</span>' : "") : '<span class="muted">Paint the strip to fill this in.</span>']);
    }
    q("#id-read").innerHTML = MV.readoutHTML(rows);
  }
  function paintNote(){ q("#id-note").innerHTML = note; }
  function syncSliders(){
    var sp = spec(), el = q("#id-x"); el.min = sp.lo; el.max = sp.hi; el.value = xv(); q("#id-xout").textContent = num(xv(), 1);
    q("#id-C").value = S.C; q("#id-cout").textContent = num(S.C);
  }
  function paintTop(){
    var F = FNC[S.fn], eq = F.eq;
    if (S.fn === "Fc") eq += ' <span class="tiny muted">now</span> ' + m("f(x) = x^3 " + (S.c < 0 ? "+ " + -S.c : "- " + S.c) + "x");
    if (S.fn === "Fb") eq += ' <span class="tiny muted">now</span> ' + m("f(x) = x^3 " + (S.b < 0 ? "- " + -S.b : "+ " + S.b) + "x^2 + 3x");
    q("#id-eq").innerHTML = "<strong>" + (S.fn.length === 2 && /\d/.test(S.fn[1]) ? S.fn : "") + "</strong> " + eq + '<span class="id-d">' + F.d + "</span>";
    MV.keepFocus(q("#id-fn"), function(){
      q("#id-fn").innerHTML = C.fns.map(function(o){ var on = o.id === S.fn, lab = /\d/.test(o.id[1]) ? "<strong>" + o.id + "</strong> " + o.chip : o.chip; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-fn="' + o.id + '" data-k="fn' + o.id + '" aria-pressed="' + on + '">' + lab + "</button>"; }).join("");
    });
    MV.keepFocus(q("#id-mode"), function(){ q("#id-mode").innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    q("#id-how").innerHTML = C.modeHow[S.mode];
    var fam = q("#id-fam"), want = S.fn === "Fc" ? "c" : S.fn === "Fb" ? "b" : "";
    if (fam.dataset.on !== want) {
      fam.dataset.on = want;
      fam.innerHTML = !want ? "" : '<label class="slider id-sl"><span class="slider-top"><span>' + m(want) + '</span><output id="id-famout"></output></span><input type="range" id="id-famr" min="' + (want === "c" ? -5 : -6) + '" max="' + (want === "c" ? 5 : 6) + '" step="1" style="accent-color:var(--ink)" aria-label="' + want + (want === "c" ? ", from −5 to 5" : ", from −6 to 6") + '"></label>' +
        (want === "b" ? '<p class="tiny id-tc3l">' + C.tc3.label + '</p><div class="chips id-tc3" id="id-tc3" role="group" aria-label="Values of b that keep f increasing"></div>' : "");
    }
    if (want) { q("#id-famr").value = S[want]; q("#id-famout").textContent = num(S[want]); }
    if (want === "b") MV.keepFocus(q("#id-tc3"), function(){
      var h = ""; for (var bb = -6; bb <= 6; bb++) { var on = S.tc3.indexOf(bb) >= 0; h += '<button type="button" class="chip id-bchip' + (on ? " on" : "") + '" data-tb="' + bb + '" data-k="tb' + bb + '" aria-pressed="' + on + '" aria-label="b = ' + bb + '">' + nmS(bb) + "</button>"; }
      q("#id-tc3").innerHTML = h;
    });
    MV.keepFocus(q("#id-acts"), function(){ q("#id-acts").innerHTML = S.mode === "build" ? "" : '<button type="button" class="btn ghost sm" data-act="sweep" data-k="idsweep">Sweep the strip</button><button type="button" class="btn ghost sm" data-act="clear" data-k="idclear">Clear the strip</button>'; });
    dp.showLow(S.mode === "deriv");
    q("#id-key").innerHTML = S.mode === "build" ? "Top: " + m("f") + " and its tangent. Below it: your chart on the strip (● zero of " + m("f′") + ", ○ undefined), with the marker." :
      S.mode === "deriv" ? "Top: " + m("f") + ". Middle: the sign strip. Bottom: " + m("f′") + " in teal, solid where the strip is painted." : "Top: " + m("f") + " and its tangent. Below it: the strip records the sign of the slope.";
  }
  // ---- Build mode ----
  function truthPts(sp){ return sp.zeros.map(function(z){ return { x:r9(z.x), t:"z" }; }).concat(sp.excl.map(function(e){ return { x:e, t:"u" }; })).sort(function(a, b){ return a.x - b.x; }); }
  function incTruth(sp){ return MV.iv.norm(ivsOf(sp).runs.filter(function(r){ return r.s > 0; }).map(function(r){ return { a:r.a, b:r.b, aIn:false, bIn:false }; })); }
  function selOK(sp, sel){
    var T = MV.iv.text(incTruth(sp)), lv = sp.zeros.filter(function(z){ return !z.flip; }).map(function(z){ return { a:z.x, b:z.x, aIn:true, bIn:true }; });
    return MV.iv.text(sel) === T || MV.iv.text(MV.iv.norm(sel.concat(lv))) === T;
  }
  function judgeBuild(sp, b){
    var tp = truthPts(sp), bad = {}, msgs = [];
    tp.forEach(function(t){ var at = ptAt(b.pts, t.x); if (!at) msgs.push(B.missZ); else if (at.t !== t.t) { bad["pt|p" + r9(at.x)] = 1; msgs.push(tpl(t.t === "u" ? B.wantGap : B.wantZero, { x:m("x = " + nmS(t.x).replace(MINUS, "-")) })); } });
    b.pts.forEach(function(p){ if (!ptAt(tp, p.x)) { bad["pt|p" + r9(p.x)] = 1; msgs.push(tpl(B.extra, { x:m("x = " + nmS(p.x).replace(MINUS, "-")) })); } });
    if (msgs.length) return { bad:bad, msg:msgs.filter(function(v, i, a){ return a.indexOf(v) === i; }).join(" "), stage:"pts" };
    var cols = bcCols(b.pts).filter(function(c){ return c.iv; }), blank = false, ws = false, wa = false;
    cols.forEach(function(c){
      var s = sgn(sp.d(c.mid)), g = b.sg[c.k], a = b.ar[c.k];
      if (!g || !a) blank = true;
      if (g && g !== (s > 0 ? "+" : s < 0 ? "-" : "0")) { bad["sg|" + c.k] = 1; ws = true; }
      if (a && a !== (s > 0 ? "u" : "d")) { bad["ar|" + c.k] = 1; wa = true; }
    });
    if (ws || wa) return { bad:bad, msg:(ws ? B.signs : "") + (ws && wa ? " " : "") + (wa ? B.arrows : ""), stage:"signs" };
    if (blank) return { bad:bad, msg:B.blank, stage:"signs" };
    var sel = bcSel(b.pts, b.sel);
    if (!sel.length) return { bad:bad, msg:B.selNone, stage:"sel", part:true };
    var turn = sp.zeros.filter(function(z){ return z.flip; }).some(function(z){ return b.sel["p" + r9(z.x)]; });
    if (turn) return { bad:bad, msg:B.selPt, stage:"sel", part:true };
    if (!selOK(sp, sel)) return { bad:bad, msg:B.sel, stage:"sel", part:true };
    return { bad:bad, msg:B.allOk, stage:"done", good:true };
  }
  function paintBuild(){
    var el = q("#id-build"), on = S.mode === "build";
    el.hidden = !on; if (!on) return;
    if (!buildable()) { el.innerHTML = '<p class="id-warn">' + B.famNote + "</p>"; return; }
    var b = bd(), at = ptAt(b.pts, b.mk), sel = bcSel(b.pts, b.sel);
    var h = placeHTML("ex", b.mk, at, busy) + bcTableHTML({ pts:b.pts, sg:b.sg, ar:b.ar, sel:b.sel, bad:bbad, lock:busy, pre:"ex", caption:"Your sign chart of f′ for " + fnPlain() }) +
      '<p class="tiny id-selnow">Your selection: ' + (sel.length ? "increasing on " + MV.iv.text(sel) : "none yet") + "</p>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-ba="check" data-k="exbchk"' + (busy ? " disabled" : "") + '>Check</button><button type="button" class="btn ghost sm" data-ba="clear" data-k="exbclr"' + (busy ? " disabled" : "") + ">Clear the chart</button></div>" +
      (bfb ? MV.fbHTML(bfb.good ? "good" : bfb.part ? "" : "bad", bfb.html) : "");
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintAll(){ paintTop(); syncSliders(); paintRead(); paintNote(); paintBuild(); dp.render(); }
  function chooseFn(id){ S.fn = id; mark = null; note = ""; bfb = null; bbad = {}; api.save(); dp.set(xv(), "set"); paintAll(); MV.changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || busy) return;
    if (b.dataset.fn) { if (b.dataset.fn !== S.fn) chooseFn(b.dataset.fn); return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; mark = null; bfb = null; bbad = {}; api.save(); paintAll(); MV.changed(); return; }
    if (b.dataset.tb != null) { var v = +b.dataset.tb, i = S.tc3.indexOf(v); if (i >= 0) S.tc3.splice(i, 1); else S.tc3.push(v); S.tc3.sort(function(p, r){ return p - r; }); api.save(); paintTop(); MV.changed(); return; }
    var a = b.dataset.act;
    if (a === "sweep") { sweep(); return; }
    if (a === "clear") { S.paint[S.fn] = []; addKeys(xv(), xv()); api.save(); paintRead(); dp.render(); MV.changed(); return; }
    if (!buildable()) return;
    var bs = bd(), sp = spec();
    if (b.dataset.bm) { bs.mk = clamp(bs.mk + 0.5 * +b.dataset.bm, Math.ceil(sp.lo * 2) / 2, Math.floor(sp.hi * 2) / 2); api.save(); paintBuild(); dp.render(); return; }
    if (b.dataset.bp) { togglePt(bs, bs.mk, b.dataset.bp); bfb = null; bbad = {}; api.save(); paintBuild(); dp.render(); MV.changed(); return; }
    if (b.dataset.bc) { bcCycle(bs, b.dataset.bc, b.dataset.key); delete bbad[b.dataset.bc + "|" + b.dataset.key]; bfb = null; api.save(); paintBuild(); dp.render(); MV.changed(); return; }
    if (b.dataset.ba === "clear") { S.bd[S.fn] = { pts:[], sg:{}, ar:{}, sel:{}, mk:bs.mk }; bfb = null; bbad = {}; api.save(); paintBuild(); dp.render(); MV.changed(); return; }
    if (b.dataset.ba === "check") { var r = judgeBuild(sp, bs); bbad = r.bad; bfb = { good:!!r.good, part:!!r.part, html:r.good ? "<strong>" + r.msg + "</strong>" : r.part ? "<strong>" + B.chartOk + "</strong> " + r.msg : "<strong>✗ Not yet.</strong> " + r.msg }; paintBuild(); MV.focusFb(q("#id-build")); }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (busy) return;
    if (t.id === "id-x") { dp.set(+t.value, "slider"); return; }
    if (t.id === "id-C") { S.C = +t.value; q("#id-cout").textContent = num(S.C); mark = null; api.save(); paintTop(); paintRead(); dp.render(); MV.changed(); return; }
    if (t.id === "id-famr") { var k = q("#id-fam").dataset.on; S[k] = +t.value; q("#id-famout").textContent = num(S[k]); mark = null; note = ""; api.save(); paintTop(); paintRead(); dp.render(); MV.changed(); }
  });
  function moveTo(a, b2, dur, cb){
    stopAnim = MV.tween({ dur:dur, ease:function(k){ return k; }, step:function(k){ var v = r9(Math.round((a + (b2 - a) * k) * 10) / 10); if (v !== dp.get()) dp.set(v, "anim"); },
      done:function(){ stopAnim = null; dp.set(b2, "anim"); api.save(); if (cb) cb(); } });
  }
  function lock(on){ busy = on; paintBuild(); q("#id-x").disabled = on; q("#id-C").disabled = on; var fr = q("#id-famr"); if (fr) fr.disabled = on; }
  function sweep(){
    var sp = spec(); lock(true); dp.set(sp.lo, "set");
    moveTo(sp.lo, sp.hi, 3200, function(){ lock(false); paintAll(); MV.changed(); });
  }
  paintAll();

  // ---- predictions ----
  function setNote(h){ note = h; paintNote(); }
  var PST = { p1:{ x:0.5 }, p2:{ x:-1.8 }, p3:{ x:-3 }, p4:{ x:2, full:true } };
  var pred = {
    start:function(p){
      if (stopAnim) { stopAnim(); stopAnim = null; }
      var st = PST[p.id] || { x:0 };
      S.fn = p.fn; S.mode = "trace"; S.C = 0; mark = null; note = ""; bfb = null; SP = null;
      S.paint[S.fn] = []; S.x[S.fn] = st.x;
      lock(true); paintAll(); dp.set(st.x, "set");
      if (st.full) { fillAll(); dp.render(); paintRead(); }
    },
    run:function(p, done){
      function fin(){ lock(false); api.save(); paintAll(); MV.changed(); done(); }
      if (p.id === "p1") {
        moveTo(0.5, 2, 1800, function(){
          mark = { fn:"F1", pts:[{ i:0, x:2, y:3, text:"(2, 3): above the axis", dy:22 }] }; dp.render();
          setNote("The tangent tilts down: " + m("f′(2) = 3(1)(-1) = -3") + ". The strip is " + MINUS + " here, even though " + m("f(2) = 3") + " is positive.");
          MV.wait(1400, fin);
        });
      } else if (p.id === "p2") {
        moveTo(-1.8, 0, 1600, function(){
          setNote(m("f′(0) = 0") + ": the tangent is level for an instant.");
          MV.wait(1000, function(){ moveTo(0, 1.8, 1600, function(){ setNote("The strip is + on both sides of the 0 tick: " + m("x^3") + " never falls."); MV.wait(900, fin); }); });
        });
      } else if (p.id === "p3") {
        moveTo(-3, 3, 3000, function(){
          mark = { fn:"F4", pts:[{ i:0, x:-1, y:-5, text:"f(−1) = −5", dy:22 }, { i:0, x:1, y:5, text:"f(1) = 5", dy:-20 }] }; dp.set(1, "anim");
          setNote("The strip has a gap at 0: not in the domain. From " + m("x = -1") + " to " + m("x = 1") + " the value rises from −5 to 5.");
          MV.wait(1500, fin);
        });
      } else if (p.id === "p4") {
        stopAnim = MV.tween({ dur:1800, step:function(k){ S.C = Math.round(5 * k * 100) / 100; SP = null; q("#id-cout").textContent = num(S.C, 1); dp.render(); },
          done:function(){ stopAnim = null; S.C = 5; SP = null; syncSliders(); paintRead(); dp.render();
            setNote(m("C = 5") + ": the graph moved up 5, but every tangent kept its slope. The strip didn’t change.");
            MV.wait(1200, fin); } });
      } else fin();
    }
  };
  // ---- challenges ----
  function chal(id){
    var X = MS[id];
    if (id === "tc1") {
      if (S.fn !== "F2" || S.mode !== "build") return { ok:false, msg:X.fn };
      var sp = spec(), b = bd(), zs = b.pts.filter(function(p){ return p.t === "z"; }).map(function(p){ return p.x; }), us = b.pts.filter(function(p){ return p.t !== "z"; });
      var same = function(a, w){ return a.length === w.length && w.every(function(v){ return a.some(function(u){ return near(u, v); }); }); };
      if (us.length || !same(zs, [-1, 0, 1])) return { ok:false, msg:!us.length && same(zs, [-1, 1]) ? X.only1 : X.zeros };
      var cols = bcCols(b.pts).filter(function(c){ return c.iv; }), want = ["-", "+", "-", "+"];
      if (cols.some(function(c){ return !b.sg[c.k]; })) return { ok:false, msg:X.blank };
      if (cols.some(function(c, i){ return b.sg[c.k] !== want[i]; })) return { ok:false, msg:X.signs };
      if (cols.some(function(c, i){ return b.ar[c.k] && b.ar[c.k] !== (want[i] === "+" ? "u" : "d"); })) return { ok:false, msg:X.arrows };
      var sel = MV.iv.text(bcSel(b.pts, b.sel));
      if (sel === MV.iv.text([{ a:-1, b:0 }, { a:1, b:Infinity }])) return { ok:true };
      if (sel === MV.iv.text([{ a:-1, b:1 }])) return { ok:false, msg:X.sel11 };
      if (b.sel["p-1"] || b.sel["p1"]) return { ok:false, msg:X.selPt };
      return { ok:false, msg:X.sel };
    }
    if (id === "tc2") {
      if (S.fn !== "Fc") return { ok:false, msg:X.fn };
      if (S.c === 0) return { ok:true };
      if (S.c === 1) return { ok:false, msg:X.c1 };
      return { ok:false, msg:S.c > 0 ? X.pos : X.neg };
    }
    if (id === "tc3") {
      var set = S.tc3.slice();
      if (!set.length) return { ok:false, msg:S.fn !== "Fb" ? X.fn : X.empty };
      var good = [-3, -2, -1, 0, 1, 2, 3], extra = set.filter(function(v){ return good.indexOf(v) < 0; }), miss = good.filter(function(v){ return set.indexOf(v) < 0; });
      if (!extra.length && !miss.length) return { ok:true };
      if (extra.indexOf(4) >= 0) return { ok:false, msg:X.inc4 };
      if (extra.indexOf(-4) >= 0) return { ok:false, msg:X.inc4n };
      if (extra.length) return { ok:false, msg:tpl(X.bigPre, { b:nmS(extra[0]) }) + X.big };
      if (miss.indexOf(3) >= 0) return { ok:false, msg:X.miss3 };
      if (miss.indexOf(-3) >= 0) return { ok:false, msg:X.miss3n };
      return { ok:false, msg:tpl(X.smallPre, { b:nmS(miss[0]) }) + X.small };
    }
    return { ok:false };
  }
  return { predict:pred, challenge:function(id){ return chal(id); } };
}

// =====================================================================================================================
// @component V14 strokePad — stroke sketch pad (MCV4U 20; reused by 24): a graph of f built piece by piece. Turning points
// (joints) split the x-axis into pieces; each piece gets a stroke tile (“u” rising or “d” falling), drawn as a smooth
// monotone curve that is level at every joint; outer pieces run off to the edges. Joints are dragged up or down (keyboard:
// arrow keys), constrained so each stroke keeps its direction.
//   padPieces(J) -> [[a, b]];  padFix(J, T) makes heights agree with the tiles;  padBounds(J, T, i) -> [lo, hi] for joint i
//   padDraw(plot, { view, J:[{x, y}], T:["u"|"d"|null], upTo, marker, guides:[x], describe, after })
function padPieces(J){ var b = [-Infinity].concat(J.map(function(j){ return j.x; }), [Infinity]), out = []; for (var i = 0; i + 1 < b.length; i++) out.push([b[i], b[i + 1]]); return out; }
function padRemap(oldJ, oldT, newJ){
  var op = padPieces(oldJ);
  return padPieces(newJ).map(function(pc){ var md = midOf(pc[0], pc[1]); for (var j = 0; j < op.length; j++) if (md > op[j][0] && md < op[j][1]) return oldT[j] || null; return null; });
}
function padFix(J, T){
  for (var i = 1; i < J.length; i++) {
    var t = T[i];
    if (t === "u" && J[i].y < J[i - 1].y + 0.5) J[i].y = J[i - 1].y + 2;
    if (t === "d" && J[i].y > J[i - 1].y - 0.5) J[i].y = J[i - 1].y - 2;
  }
  var hi = Math.max.apply(null, J.map(function(j){ return j.y; }).concat([-99])), lo = Math.min.apply(null, J.map(function(j){ return j.y; }).concat([99]));
  if (hi > 5.5) J.forEach(function(j){ j.y -= hi - 5.5; }); else if (lo < -5.5) J.forEach(function(j){ j.y += -5.5 - lo; });
  J.forEach(function(j){ j.y = clamp(Math.round(j.y * 2) / 2, -6.5, 6.5); });
}
function padBounds(J, T, i){
  var lo = -6.5, hi = 6.5;
  if (i > 0) { if (T[i] === "u") lo = Math.max(lo, J[i - 1].y + 0.5); if (T[i] === "d") hi = Math.min(hi, J[i - 1].y - 0.5); }
  if (i + 1 < J.length) { if (T[i + 1] === "u") hi = Math.min(hi, J[i + 1].y - 0.5); if (T[i + 1] === "d") lo = Math.max(lo, J[i + 1].y + 0.5); }
  return [lo, hi];
}
function padPath(J, T, v, i){
  var pc = padPieces(J)[i], t = T[i]; if (!t) return null;
  var a = Math.max(pc[0], v.xmin), b = Math.min(pc[1], v.xmax), L = J[i - 1], R = J[i], dir = t === "u" ? 1 : -1, pts = [], n = 40;
  for (var k = 0; k <= n; k++) {
    var x = a + (b - a) * k / n, y;
    if (L && R) { var s = (x - L.x) / (R.x - L.x); y = L.y + (R.y - L.y) * (3 * s * s - 2 * s * s * s); }
    else if (R) { var H = Math.max(2.5, (R.x - a) * 1.1), s2 = (x - a) / (R.x - a); y = R.y - dir * H + dir * H * (1 - (1 - s2) * (1 - s2)); }
    else if (L) { var H2 = Math.max(2.5, (b - L.x) * 1.1), s3 = (x - L.x) / (b - L.x); y = L.y + dir * H2 * s3 * s3; }
    else y = dir * (-3 + 6 * (x - a) / (b - a));
    pts.push([x, y]);
  }
  return pts;
}
function padDraw(p, o){
  var v = o.view, J = o.J, T = o.T;
  p.draw({ view:v, yLabel:"y", describe:o.describe, after:function(ctx, pl){
    var ink = css("--ink");
    ctx.save();
    (o.guides || []).forEach(function(g){ var X = Math.round(pl.X(g)) + 0.5; ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.6; ctx.lineWidth = 1.2; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, pl.H); ctx.stroke(); ctx.globalAlpha = 1; ctx.setLineDash([]); });
    if (o.upTo != null) { ctx.beginPath(); ctx.rect(0, 0, pl.X(o.upTo), pl.H); ctx.clip(); }
    padPieces(J).forEach(function(pc, i){
      var pts = padPath(J, T, v, i);
      if (!pts) { if (o.placeholders !== false) { var a = Math.max(pc[0], v.xmin), b = Math.min(pc[1], v.xmax), ya = J[i - 1] ? J[i - 1].y : 0, yb = J[i] ? J[i].y : 0; ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([2, 6]); ctx.beginPath(); ctx.moveTo(pl.X(a), pl.Y(J[i - 1] ? ya : yb)); ctx.lineTo(pl.X(b), pl.Y(J[i] ? yb : ya)); ctx.stroke(); ctx.setLineDash([]); } return; }
      ctx.strokeStyle = css("--pen"); ctx.lineWidth = 3.2; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.beginPath();
      pts.forEach(function(q, k){ var X = pl.X(q[0]), Y = clamp(pl.Y(q[1]), -5 * pl.H, 6 * pl.H); if (k) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }); ctx.stroke();
    });
    ctx.restore();
    J.forEach(function(j){ if (o.upTo == null || j.x <= o.upTo) pl.point({ x:j.x, y:j.y, r:6, color:ink, ring:!!o.ring }); });
    if (o.marker != null) {
      var MX = pl.X(o.marker), Y0 = pl.Y(0);
      ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(MX, 0); ctx.lineTo(MX, pl.H); ctx.stroke();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(MX, Y0 - 2); ctx.lineTo(MX - 7, Y0 + 10); ctx.lineTo(MX + 7, Y0 + 10); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    if (o.after) o.after(ctx, pl);
  } });
}
// ------------------------------------------------- end of V14 strokePad ---------------------------------------------------------

// ---------- Part 3: From f′ back to f ----------
var PADV = { xmin:-4.4, xmax:5.4, ymin:-7.5, ymax:7.5 };
function tileWord(t){ return t === "u" ? "rising ↗" : t === "d" ? "falling ↘" : "no stroke yet"; }
function chartRowHTML(cols, rows, caption){
  return '<div class="tbl-wrap id-scwrap"><table class="vt id-sct"><caption class="vh">' + caption + '</caption><thead><tr><th scope="col">' + m("x") + "</th>" + cols.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
    rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th>" + r[1].map(function(c){ return "<td" + (c.cls ? ' class="' + c.cls + '"' : "") + ">" + c.h + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
}
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.s1 = S.s1 || { J:[], T:[null], mk:0, tile:null, solved:false }; if (!Array.isArray(S.s1.T)) S.s1.T = [null];
  S.s2 = S.s2 || { C:0 }; S.s3 = S.s3 || { cells:{}, solved:false };
  var fb1 = null, fb3 = null, bad3 = {}, anim3 = null;
  host.innerHTML =
    '<div class="part p3-st" id="id-st1"><h3>' + s1.title + "</h3><p>" + s1.text + '</p><div id="id-s1chart"></div><p class="how">' + s1.how + "</p>" +
      '<div class="plot-wrap"><canvas class="plot id-padc" id="id-pad1" role="img" aria-label="Sketch pad"></canvas></div><div id="id-s1ctl"></div><div id="id-s1fb" aria-live="polite"></div><div id="id-s1gal"></div></div>' +
    '<div class="part p3-st" id="id-st2"><h3>' + s2.title + "</h3><p>" + s2.text + '</p><div class="id-s2"><div class="id-s2g"><div class="plot-wrap"><canvas class="plot dp-top" id="id-s2f" role="img" aria-label="Graph of f"></canvas></div>' +
      '<div class="plot-wrap"><canvas class="plot dp-low" id="id-s2d" role="img" aria-label="Graph of f′"></canvas></div></div><div class="id-s2c">' +
      '<label class="slider"><span class="slider-top"><span>' + m("C") + '</span><output id="id-s2out"></output></span><input type="range" id="id-s2C" min="-4" max="4" step="1" style="accent-color:var(--ink)" aria-label="C, from −4 to 4"></label>' +
      '<dl class="read" id="id-s2read" aria-live="polite"></dl><details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + s2.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details></div></div></div>" +
    '<div class="part p3-st" id="id-st3"><h3>' + s3.title + "</h3><p>" + s3.text + '</p><div id="id-s3tab"></div><div class="q-actions"><button type="button" class="btn primary sm" data-s3="check" data-k="s3chk">Check</button></div><div id="id-s3fb" aria-live="polite"></div>' +
      '<p class="banner" id="id-s3ban" aria-live="polite"></p><div class="plot-wrap" id="id-s3padw" hidden><canvas class="plot id-padc" id="id-pad3" role="img" aria-label="Sketch of f"></canvas></div></div>';
  // ---- Station 1 ----
  var A1 = s1.chart, st1 = S.s1, pad1 = new MV.Plot($("#id-pad1"), PADV);
  $("#id-s1chart").innerHTML = chartRowHTML(["(−∞, −1)", "−1", "(−1, 2)", "2", "(2, ∞)"], [["Sign of " + m("f′(x)"), [{ h:"+" }, { h:"0", cls:"id-pt" }, { h:MINUS }, { h:"0", cls:"id-pt" }, { h:"+" }]]], "Sign chart of f′: plus on (−∞, −1), zero at −1, minus on (−1, 2), zero at 2, plus on (2, ∞)");
  function d1(){
    var J = st1.J;
    padDraw(pad1, { view:PADV, J:J, T:st1.T, marker:st1.solved ? null : st1.mk, ring:!st1.solved,
      describe:"Sketch pad. " + (J.length ? "Turning points at " + J.map(function(j){ return "(" + nmS(j.x) + ", " + nmS(j.y) + ")"; }).join(", ") + ". " : "No turning points yet. ") +
        padPieces(J).map(function(pc, i){ APPROX = false; return ivTxt(pc[0], pc[1]) + ": " + tileWord(st1.T[i]); }).join("; ") + "." + (st1.solved ? "" : " Marker at x = " + nmS(st1.mk) + ".") });
  }
  pad1.render = d1;
  var drag1 = MV.drag(pad1, { axis:"y", step:{ x:0.5, y:0.5 }, big:4,
    handles:function(){ return st1.solved ? [] : st1.J.map(function(j, i){ return { id:"j" + i, x:j.x, y:j.y, label:"Turning point at x = " + nmS(j.x) + ", height " + nmS(j.y) + ". Up and down arrow keys move it." }; }); },
    snap:function(x, y){ return [x, Math.round(y * 2) / 2]; },
    move:function(id, nx, ny){ var i = +id.slice(1), bnd = padBounds(st1.J, st1.T, i); st1.J[i].y = clamp(ny, bnd[0], bnd[1]); api.save(); d1(); } });
  $("#id-pad1").addEventListener("pointerdown", function(e){
    if (e.defaultPrevented || st1.solved || !pad1.v) return;
    var r = pad1.c.getBoundingClientRect(); st1.mk = clamp(Math.round(pad1.xOf(e.clientX - r.left) * 2) / 2, -4, 5); api.save(); paint1();
  });
  function setJoints(nJ){ st1.T = padRemap(st1.J, st1.T, nJ); st1.J = nJ; padFix(st1.J, st1.T); }
  function paint1(){
    var J = st1.J, at = J.filter(function(j){ return near(j.x, st1.mk); })[0], h = "";
    if (!st1.solved) {
      h += '<div class="id-mkrow"><span class="tiny" style="font-weight:700">Marker</span><button type="button" class="btn ghost sm id-pm" data-s1="mm" data-k="s1mm" aria-label="Move the marker left">' + MINUS + '</button><output class="id-mkout" aria-live="polite">' + m("x = " + nmS(st1.mk).replace(MINUS, "-")) + '</output><button type="button" class="btn ghost sm id-pm" data-s1="mp" data-k="s1mp" aria-label="Move the marker right">+</button>' +
        '<button type="button" class="btn ghost sm" data-s1="joint" data-k="s1j">' + (at ? "Remove the turning point here" : "Add a turning point here") + "</button></div>";
      h += '<div class="id-tray" role="group" aria-label="Stroke tiles"><span class="tiny" style="font-weight:700">Tiles</span>' + [["u", "Rising ↗"], ["d", "Falling ↘"]].map(function(t){ return '<button type="button" class="chip id-tile' + (st1.tile === t[0] ? " on" : "") + '" data-tile="' + t[0] + '" data-k="s1t' + t[0] + '" aria-pressed="' + (st1.tile === t[0]) + '">' + t[1] + "</button>"; }).join("") + "</div>";
    }
    h += '<div class="id-slots" role="group" aria-label="Pieces of the graph">' + padPieces(J).map(function(pc, i){ APPROX = false; return '<button type="button" class="id-slot' + (st1.T[i] ? " set" : "") + '" data-slot="' + i + '" data-k="s1s' + i + '"' + (st1.solved ? " disabled" : "") + ' aria-label="Piece ' + MV.esc(ivTxt(pc[0], pc[1])) + ": " + tileWord(st1.T[i]) + (st1.tile ? ". Tap to place the " + tileWord(st1.tile) + " tile." : ". Tap to change.") + '"><span class="id-slotiv">' + ivTxt(pc[0], pc[1]) + '</span><span class="id-slott">' + (st1.T[i] === "u" ? "↗" : st1.T[i] === "d" ? "↘" : "?") + "</span></button>"; }).join("") + "</div>";
    if (!st1.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-s1="check" data-k="s1chk">Check my graph</button><button type="button" class="btn ghost sm" data-s1="clear" data-k="s1clr">Start again</button></div>';
    MV.keepFocus($("#id-s1ctl"), function(){ $("#id-s1ctl").innerHTML = h; });
    $("#id-s1fb").innerHTML = st1.solved ? MV.fbHTML("good", "<strong>" + s1.fb.done + "</strong>") : fb1 ? MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + fb1) : "";
    paintGal(); d1();
  }
  function check1(){
    var J = st1.J, T = st1.T, xs = A1.zeros, P = padPieces(J);
    if (T.some(function(t){ return !t; })) return s1.fb.tiles;
    var extra = J.filter(function(j){ return !xs.some(function(z){ return near(z, j.x); }); });
    if (extra.length) return tpl(s1.fb.extra, { x:m("x = " + nmS(extra[0].x).replace(MINUS, "-")) });
    if (J.length !== xs.length) return s1.fb.joints;
    var sg = A1.signs, msg = null;
    P.forEach(function(pc, i){ if (msg) return; var want = sg[i] > 0 ? "u" : "d"; if (T[i] !== want) { APPROX = false; msg = tpl(s1.fb.piece, { iv:ivTxt(pc[0], pc[1]), sg:sg[i] > 0 ? "positive" : "negative", dir:sg[i] > 0 ? "rises" : "falls" }); } });
    return msg;
  }
  function paintGal(){
    var el = $("#id-s1gal");
    if (!st1.solved) { el.innerHTML = ""; return; }
    if (el.dataset.on === "1") return;
    el.dataset.on = "1";
    el.innerHTML = '<p class="id-galp">' + s1.gallery + '</p><div class="id-gal">' + s1.galleryCaps.map(function(c, i){ return '<figure class="id-galf"><canvas class="plot id-galc" id="id-gal' + i + '" role="img" aria-label="' + MV.esc(c) + '"></canvas><figcaption class="tiny">' + c + "</figcaption></figure>"; }).join("") + "</div>";
    var G = [[[-1, 3], [2, -2]], [[-1, 6], [2, 3]], [[-1, -2], [2, -5]]];
    G.forEach(function(g, i){
      var pl = new MV.Plot($("#id-gal" + i), PADV), J = g.map(function(q){ return { x:q[0], y:q[1] }; });
      pl.render = function(){ padDraw(pl, { view:PADV, J:J, T:["u", "d", "u"], guides:[-1, 2], describe:s1.galleryCaps[i] + ": rises to a peak at (−1, " + nmS(g[0][1]) + "), falls to a valley at (2, " + nmS(g[1][1]) + "), then rises." }); };
      pl.render();
    });
  }
  $("#id-st1").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || st1.solved) return;
    if (b.dataset.s1 === "mm" || b.dataset.s1 === "mp") { st1.mk = clamp(st1.mk + (b.dataset.s1 === "mp" ? 0.5 : -0.5), -4, 5); api.save(); paint1(); return; }
    if (b.dataset.s1 === "joint") {
      var nJ = st1.J.map(function(j){ return { x:j.x, y:j.y }; }), at = nJ.filter(function(j){ return near(j.x, st1.mk); })[0];
      if (at) nJ.splice(nJ.indexOf(at), 1); else if (nJ.length < 5) { var prev = nJ.filter(function(j){ return j.x < st1.mk; }).pop(); nJ.push({ x:st1.mk, y:prev ? prev.y : 0 }); }
      nJ.sort(function(p, q){ return p.x - q.x; }); setJoints(nJ); fb1 = null; api.save(); paint1(); return;
    }
    if (b.dataset.tile) { st1.tile = st1.tile === b.dataset.tile ? null : b.dataset.tile; api.save(); paint1(); return; }
    if (b.dataset.slot != null) {
      var i = +b.dataset.slot; st1.T[i] = st1.tile || (st1.T[i] === "u" ? "d" : "u"); padFix(st1.J, st1.T); fb1 = null; api.save(); paint1(); return;
    }
    if (b.dataset.s1 === "clear") { st1.J = []; st1.T = [null]; fb1 = null; api.save(); paint1(); return; }
    if (b.dataset.s1 === "check") { var r = check1(); if (r) fb1 = r; else { st1.solved = true; fb1 = null; } api.save(); paint1(); MV.focusFb($("#id-st1")); }
  });
  paint1();
  // ---- Station 2 ----
  var F2f = function(x){ return x * x * x - 3 * x + S.s2.C; }, F2d = function(x){ return 3 * x * x - 3; };
  var V2 = { xmin:-2.6, xmax:2.6, ymin:-7, ymax:7 }, V2d = { xmin:-2.6, xmax:2.6, ymin:-4.5, ymax:12 }, pf = new MV.Plot($("#id-s2f"), V2), pd = new MV.Plot($("#id-s2d"), V2d);
  function d2(){
    var Cc = S.s2.C, y = 3.375 - 4.5 + Cc, ink = css("--ink"), pen = css("--pen");
    var probe = function(ctx, pl){ var X = pl.X(1.5); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, pl.H); ctx.stroke(); ctx.restore(); };
    var curves = [{ f:F2f, color:pen, width:3 }];
    if (Cc) curves.unshift({ f:function(x){ return x * x * x - 3 * x; }, color:css("--ink-2"), width:2, dash:[6, 6] });
    pf.draw({ view:V2, yLabel:"f(x)", curves:curves, lines:[{ p:[1.5, y], q:[2.5, y + 3.75], color:ink, width:2 }], points:[{ x:1.5, y:y, r:5.5, color:ink }],
      labels:[{ x:1.5, y:y, text:"slope = 3.75", dx:-12, dy:-20, align:"right", bg:true, font:ui(13) }].concat(Cc ? [{ x:-2.5, y:6.4, text:"dashed: C = 0", align:"left", bg:true, color:css("--ink-2"), font:ui(12) }] : []),
      describe:"Graph of f(x) = x³ − 3x " + (Cc < 0 ? MINUS + " " + -Cc : "+ " + Cc) + (Cc ? ", with the C = 0 graph dashed" : "") + ". The tangent at x = 1.5 has slope 3.75.", after:probe });
    pd.draw({ view:V2d, yLabel:"f′(x)", curves:[{ f:F2d, color:css("--f3"), width:2.6 }], points:[{ x:1.5, y:3.75, r:5.5, color:css("--f3"), ring:true }],
      labels:[{ x:1.5, y:3.75, text:"(1.5, 3.75)", dx:-12, dy:-16, align:"right", bg:true, font:ui(13) }], describe:"Graph of f′(x) = 3x² − 3, the same for every C; at x = 1.5 it is 3.75.", after:probe });
    $("#id-s2out").textContent = num(Cc); $("#id-s2C").value = Cc;
    $("#id-s2read").innerHTML = MV.readoutHTML([[m("C"), num(Cc)], [m("f(1.5)"), num(y, 3)], [m("f′(1.5)"), "3.75 for every " + m("C")]]);
  }
  pf.render = d2; pd.render = d2; d2();
  $("#id-s2C").addEventListener("input", function(e){ S.s2.C = +e.target.value; api.save(); d2(); });
  // ---- Station 3 ----
  var COL3 = [{ k:"a", a:-Infinity, b:-2, mid:-3 }, { k:"b", a:-2, b:1, mid:0 }, { k:"c", a:1, b:Infinity, mid:2 }];
  var ROW3 = [{ r:"s", lab:m("(x - 1)^2"), f:function(x){ return (x - 1) * (x - 1); }, pt:["+", "0"] }, { r:"l", lab:m("x + 2"), f:function(x){ return x + 2; }, pt:["0", "+"] }, { r:"d", lab:m("f′(x)"), f:function(x){ return (x - 1) * (x - 1) * (x + 2); }, pt:["0", "0"] }];
  var pad3 = new MV.Plot($("#id-pad3"), PADV), up3 = null;
  function d3(){
    if ($("#id-s3padw").hidden) return;
    padDraw(pad3, { view:PADV, J:[{ x:-2, y:-3.5 }, { x:1, y:1 }], T:["d", "u", "u"], guides:[-2, 1], upTo:up3, placeholders:false,
      describe:"Sketch of f: falls to a minimum at x = −2, rises, levels off for an instant at x = 1, and rises again.",
      after:function(ctx, pl){ if (up3 != null && up3 < 1) return; pl.label({ x:1, y:1, text:"level, no turn", dx:10, dy:22, align:"left", bg:true, font:ui(13) }); if (up3 == null || up3 >= -2) pl.label({ x:-2, y:-3.5, text:"minimum", dx:10, dy:20, align:"left", bg:true, font:ui(13) }); } });
  }
  pad3.render = d3;
  function cellsHTML(){
    var cells = S.s3.cells, lock = S.s3.solved;
    var cols = ["(−∞, −2)", "−2", "(−2, 1)", "1", "(1, ∞)"];
    var rows = ROW3.map(function(R){
      var out = [];
      COL3.forEach(function(c, j){
        var k = R.r + c.k, g = cells[k], bd = bad3[k];
        out.push({ h:(bd ? '<span class="id-x" aria-hidden="true">✗</span><span class="vh">wrong: </span>' : "") + '<button type="button" class="id-cell" data-c3="' + k + '" data-k="c3' + k + '"' + (lock ? " disabled" : "") + ' aria-label="Sign of ' + MV.esc(MV.plain(R.lab)) + " on " + cols[j * 2] + ": " + (g ? sgDisp(g).replace(MINUS, "minus") : "not set") + '">' + sgDisp(g) + "</button>", cls:bd ? "id-bad" : "" });
        if (j < 2) out.push({ h:R.pt[j], cls:"id-pt" });
      });
      return [R.lab, out];
    });
    return chartRowHTML(cols, rows, "Sign chart of f′(x) = (x − 1)²(x + 2) to fill in");
  }
  function paint3(){
    MV.keepFocus($("#id-s3tab"), function(){ $("#id-s3tab").innerHTML = cellsHTML(); });
    $("#id-s3fb").innerHTML = S.s3.solved ? MV.fbHTML("good", "<strong>" + s3.fb.done + "</strong>") : fb3 ? MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + fb3) : "";
    var chk = $('[data-s3="check"]'); if (chk) chk.disabled = !!S.s3.solved;
    $("#id-s3padw").hidden = !S.s3.solved; $("#id-s3ban").textContent = S.s3.solved && (up3 == null || up3 >= PADV.xmax) ? MV.plain(s3.banner) : "";
    $("#id-s3ban").className = "banner" + (S.s3.solved && (up3 == null || up3 >= PADV.xmax) ? " good" : "");
    d3();
  }
  function check3(){
    var cells = S.s3.cells, msgs = []; bad3 = {};
    var all = ROW3.every(function(R){ return COL3.every(function(c){ return cells[R.r + c.k]; }); });
    if (!all) return s3.fb.blank;
    ROW3.forEach(function(R){ COL3.forEach(function(c){ var s = sgn(R.f(c.mid)), want = s > 0 ? "+" : "-"; if (cells[R.r + c.k] !== want) { bad3[R.r + c.k] = 1; var mm = R.r === "s" ? s3.fb.sq : R.r === "l" ? s3.fb.lin : s3.fb.prod; if (msgs.indexOf(mm) < 0) msgs.push(mm); } }); });
    return msgs.length ? msgs.join(" ") : null;
  }
  $("#id-st3").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || S.s3.solved) return;
    if (b.dataset.c3) { var k = b.dataset.c3, c = S.s3.cells; c[k] = c[k] === "+" ? "-" : c[k] === "-" ? "0" : "+"; delete bad3[k]; fb3 = null; api.save(); paint3(); return; }
    if (b.dataset.s3 === "check") {
      var r = check3();
      if (r) { fb3 = r; api.save(); paint3(); MV.focusFb($("#id-st3")); return; }
      S.s3.solved = true; fb3 = null; api.save(); up3 = PADV.xmin; paint3(); MV.focusFb($("#id-st3"));
      MV.tween({ dur:2400, ease:function(k){ return k; }, step:function(k){ up3 = PADV.xmin + (PADV.xmax - PADV.xmin) * k; d3(); }, done:function(){ up3 = null; paint3(); } });
    }
  });
  paint3();
}

// =====================================================================================================================
// @component N4 intervalEntry — typed interval notation: pieces like (−∞, −2) ∪ [1, 3), joined by ∪, U, “and”, “or” or commas;
// “inf”, “infinity” and ∞ for infinity; an inequality such as “−6 ≤ k ≤ 6” or “k > 2” in the item’s variable; “∅”/“none”.
// parseIv(str, v) -> [{a, b, aIn, bIn}] (sorted, not merged) or null.  ivEq(P, W) compares piece lists exactly (brackets too).
function parseEnd(t){
  var s = String(t).trim().replace(/−/g, "-").replace(/\s+/g, "");
  var mm = /^([+-]?)(∞|inf|infinity|oo)$/i.exec(s);
  if (mm) return mm[1] === "-" ? -Infinity : Infinity;
  var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : null;
}
function parseIv(str, v){
  var s = String(str == null ? "" : str).trim().replace(/−/g, "-").replace(/≤/g, "<=").replace(/≥/g, ">=");
  if (!s) return null;
  if (/^(∅|\{\s*\}|none|empty|no\s+values?)$/i.test(s)) return [];
  v = v || "x";
  var vr = new RegExp("^(.+?)(<=|<)\\s*" + v + "\\s*(<=|<)(.+)$", "i"), m1 = vr.exec(s);
  if (m1) { var a = parseEnd(m1[1]), b = parseEnd(m1[4]); return a != null && b != null && a < b ? [{ a:a, b:b, aIn:m1[2] === "<=", bIn:m1[3] === "<=" }] : null; }
  var m2 = new RegExp("^" + v + "\\s*(<=|<|>=|>)(.+)$", "i").exec(s);
  if (m2) { var c = parseEnd(m2[2]); if (c == null || !isFinite(c)) return null; return m2[1][0] === "<" ? [{ a:-Infinity, b:c, aIn:false, bIn:m2[1] === "<=" }] : [{ a:c, b:Infinity, aIn:m2[1] === ">=", bIn:false }]; }
  var re = /([\(\[])\s*([^,\(\)\[\]]+?)\s*,\s*([^,\(\)\[\]]+?)\s*([\)\]])/g, out = [], mt, rest = s;
  while ((mt = re.exec(s))) {
    var A = parseEnd(mt[2]), Bv = parseEnd(mt[3]); if (A == null || Bv == null || !(A < Bv)) return null;
    out.push({ a:A, b:Bv, aIn:mt[1] === "[", bIn:mt[4] === "]" });
    rest = rest.replace(mt[0], " ");
  }
  if (!out.length || rest.replace(/∪|\bU\b|\bu\b|\band\b|\bor\b|[,;\s]/gi, "") !== "") return null;
  return out.sort(function(p, q){ return p.a - q.a; });
}
function ivW(list){ return list.map(function(w){ return { a:w[0] == null ? -Infinity : w[0], b:w[1] == null ? Infinity : w[1], aIn:!!w[2], bIn:!!w[3] }; }).sort(function(p, q){ return p.a - q.a; }); }
function ivSameEnds(P, W){ return P.length === W.length && P.every(function(p, i){ return p.a === W[i].a || near(p.a, W[i].a); }) && P.every(function(p, i){ return p.b === W[i].b || near(p.b, W[i].b); }); }
function ivEq(P, W){ return ivSameEnds(P, W) && P.every(function(p, i){ return p.aIn === W[i].aIn && p.bIn === W[i].bIn; }); }
function ivInsertBtns(id){ return '<span class="id-ins" role="group" aria-label="Insert a symbol">' + [["∞", "∞"], [MINUS + "∞", "−∞"], ["∪", "∪"]].map(function(s){ return '<button type="button" class="btn ghost sm" data-ins="' + s[1] + '" data-for="' + id + '" data-k="ins' + id + s[1] + '" aria-label="Insert ' + (s[1] === "∪" ? "union" : s[1] === "∞" ? "infinity" : "minus infinity") + '">' + s[0] + "</button>"; }).join("") + "</span>"; }
function doInsert(root, b){
  var inp = root.querySelector('[data-iv="' + b.dataset.for + '"]'); if (!inp || inp.disabled) return null;
  var s = inp.selectionStart == null ? inp.value.length : inp.selectionStart, e = inp.selectionEnd == null ? s : inp.selectionEnd, t = b.dataset.ins === "∪" ? " ∪ " : b.dataset.ins;
  inp.value = inp.value.slice(0, s) + t + inp.value.slice(e); inp.focus(); try { inp.setSelectionRange(s + t.length, s + t.length); } catch (err) {}
  return inp;
}
// bracket feedback when the ends are right but the brackets aren’t
function bracketMsg(P, W, M){
  var inf = P.some(function(p){ return (p.a === -Infinity && p.aIn) || (p.b === Infinity && p.bIn); });
  return inf ? M.inf : M.closed;
}

// ---------- Practice 1: Sign chart builds ----------
var BF = {
  b1:{ d:function(x){ return 6 * (x + 2) * (x - 1); }, fac:[function(){ return 6; }, function(x){ return x + 2; }, function(x){ return x - 1; }] },
  b2:{ d:function(x){ return 4 * x * x * (x - 3); }, fac:[function(x){ return 4 * x * x; }, function(x){ return x - 3; }] },
  b3:{ d:function(x){ return (1 - x * x) / Math.pow(x * x + 1, 2); }, fac:[function(x){ return 1 - x; }, function(x){ return 1 + x; }, function(x){ return Math.pow(x * x + 1, 2); }] },
  b4:{ d:function(x){ return Math.abs(x) < 1e-12 ? NaN : (x * x - 9) / (x * x); }, fac:[function(x){ return x - 3; }, function(x){ return x + 3; }, function(x){ return x * x; }] },
  b5:{ d:function(x){ return Math.abs(x) < 1e-12 ? NaN : 5 * (x - 2) / (3 * MV.mcv.rpow(x, 1, 3)); }, fac:[function(){ return 5; }, function(x){ return x - 2; }, function(x){ return 3 * MV.mcv.rpow(x, 1, 3); }] }
};
var STG = ["factor", "pts", "signs", "ivs"];
function buildsAct(host, api, a){
  var S = api.S; S.it = S.it || {}; S.cur = S.cur || 0;
  var M = a.msgs, items = a.items, fb = {}, bad = {}, plot = null;
  function ist(id){ return S.it[id] || (S.it[id] = { stage:0, fc:null, pts:[], sg:{}, ar:{}, inc:"", dec:"", mk:0, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="id-bnav" id="id-bnav"></div><div class="q id-bq" id="id-bq"></div>';
  function cur(){ return items[clamp(S.cur, 0, items.length - 1)]; }
  function truth(it){ return MV.ans(it).pts.map(function(p){ return { x:p[0], t:p[1] }; }); }
  function nav(){
    var h = '<div class="id-bdots" role="group" aria-label="Choose a build">' + items.map(function(it, i){ var x = ist(it.id); return '<button type="button" class="chip' + (i === S.cur ? " on" : "") + '" data-go="' + i + '" data-k="bgo' + i + '" aria-pressed="' + (i === S.cur) + '">Build ' + (i + 1) + (x.solved ? " ✓" : "") + (it.star ? " ★" : "") + "</button>"; }).join("") + "</div>";
    MV.keepFocus($("#id-bnav", host), function(){ $("#id-bnav", host).innerHTML = h; });
  }
  function ptF(it){ var nd = it.nd || []; return function(c){ return c.t === "z" ? "slope 0" : nd.some(function(v){ return near(v, c.x); }) ? "not in the domain" : m("f′") + " undefined"; }; }
  function fullChart(it){
    var tp = truth(it), cols = bcCols(tp), F = BF[it.id];
    function cell(v){ var s = sgn(v); return s > 0 ? "+" : s < 0 ? MINUS : "0"; }
    var head = cols.map(function(c){ APPROX = false; return c.iv ? ivTxt(c.a, c.b) : nmS(c.x); });
    var rows = it.fac.map(function(fc, j){
      return [m(fc.s) + (fc.k === "den" ? '<span class="id-k">denominator</span>' : ""), cols.map(function(c){ var v = F.fac[j](c.iv ? c.mid : c.x); return { h:c.iv ? cell(v) : Math.abs(v) < 1e-12 ? "0" : cell(v), cls:c.iv ? "" : "id-pt" }; })];
    });
    rows.push(["Sign of " + m("f′(x)"), cols.map(function(c){ return c.iv ? { h:cell(F.d(c.mid)) } : { h:c.t === "z" ? "0" : "undefined", cls:"id-pt" }; })]);
    rows.push([m("f"), cols.map(function(c){ return c.iv ? { h:F.d(c.mid) > 0 ? "↗" : "↘", cls:"id-arc" } : { h:ptF(it)(c), cls:"id-pt" }; })]);
    return chartRowHTML(head, rows, "Sign chart of f′ for build " + it.id.slice(1));
  }
  function paint(){
    nav();
    var it = cur(), x = ist(it.id), st = STG[Math.min(x.stage, 3)], box = $("#id-bq", host), lvl = x.hint, lock = x.solved;
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (S.cur + 1) + '</span><div class="q-prompt">' + it.f + (x.stage > 0 || x.solved ? '<span class="id-bfd">' + m("f′(x) = " + it.dSrc) + "</span>" : "") + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<ol class="id-stg">' + STG.map(function(s, i){ var dn = x.solved || i < x.stage; return '<li class="' + (dn ? "done" : i === x.stage ? "now" : "") + '">' + (i + 1) + ". " + (dn ? "✓ " : "") + a.stages[s] + "</li>"; }).join("") + "</ol>";
    if (x.solved) {
      h += MV.fbHTML("good", "<strong>✓ Correct.</strong> Increasing on " + it.display.inc + "; decreasing on " + it.display.dec + "." + (x.first ? "" : ' <span class="muted">(not first try)</span>')) + fullChart(it);
    } else {
      h += '<p class="how">' + a.stageHow[st] + "</p>";
      if (st === "factor") h += '<p class="pred-q">' + it.factor.prompt + '</p><div class="opts">' + it.factor.options.map(function(op, i){ return '<button type="button" class="opt' + (x.fc === i ? " picked" : "") + '" data-fc="' + i + '" data-k="bfc' + it.id + i + '" aria-pressed="' + (x.fc === i) + '"><span>' + op.t + "</span></button>"; }).join("") + "</div>";
      if (st === "pts") h += '<div class="plot-wrap"><canvas class="plot id-strip id-bstrip" id="id-bstrip" role="img" aria-label="Number line for placing points"></canvas></div>' + placeHTML("bb", x.mk, ptAt(x.pts, x.mk), false);
      if (st === "signs") h += '<div class="plot-wrap"><canvas class="plot id-strip id-bstrip" id="id-bstrip" role="img" aria-label="Your points and signs on a number line"></canvas></div>' + bcTableHTML({ pts:x.pts, sg:x.sg, ar:x.ar, sel:null, bad:bad[it.id] || {}, pre:"bb", ptF:ptF(it), caption:"Your sign chart of f′" });
      if (st === "ivs") h += fullChartLite(it, x) + ["inc", "dec"].map(function(k){ return '<div class="numrow id-ivrow"><label for="id-iv' + k + '">' + (k === "inc" ? "Increasing on" : "Decreasing on") + '</label><input class="numin id-ivin" id="id-iv' + k + '" data-iv="' + k + '" data-k="biv' + k + '" type="text" autocomplete="off" spellcheck="false" value="' + MV.esc(x[k]) + '">' + ivInsertBtns(k) + "</div>"; }).join("");
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="bchk">Check</button>' + MV.hintBtn("bh" + it.id, lvl) + "</div>" + MV.hintsHTML(it.hints, lvl);
      if (fb[it.id]) h += MV.fbHTML(fb[it.id].good ? "good" : "bad", fb[it.id].html);
    }
    h += '<div class="q-actions id-bpn"><button type="button" class="btn ghost sm" data-go="' + (S.cur - 1) + '" data-k="bprev"' + (S.cur === 0 ? " disabled" : "") + '>Previous build</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-go="' + (S.cur + 1) + '" data-k="bnext"' + (S.cur === items.length - 1 ? " disabled" : "") + ">Next build</button></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    var cvs = $("#id-bstrip", host);
    if (cvs) {
      var R = it.range, F = BF[it.id];
      plot = new MV.Plot(cvs, { xmin:R[0] - 0.4, xmax:R[1] + 0.4, ymin:0, ymax:1 });
      plot.render = function(){ var xx = ist(it.id); drawStrip(plot, { view:{ xmin:R[0] - 0.4, xmax:R[1] + 0.4 }, d:F.d, zeros:[], excl:[], build:{ pts:xx.pts, sg:xx.stage >= 2 ? xx.sg : {}, mk:xx.stage === 1 ? xx.mk : null },
        describe:"Number line from " + nmS(R[0]) + " to " + nmS(R[1]) + ". " + (xx.pts.length ? "Placed: " + xx.pts.map(function(p){ return (p.t === "z" ? "zero at " : "undefined at ") + nmS(p.x); }).join(", ") + "." : "No points placed.") + (xx.stage === 1 ? " Marker at " + nmS(xx.mk) + "." : "") }); };
      plot.render();
      cvs.addEventListener("pointerdown", function(e){ var xx = ist(it.id); if (xx.stage !== 1 || xx.solved) return; var r = cvs.getBoundingClientRect(); xx.mk = clamp(Math.round(plot.xOf(e.clientX - r.left) * 2) / 2, R[0], R[1]); api.save(); paint(); });
    }
  }
  // the student's finished chart as a reminder during the interval step
  function fullChartLite(it, x){ return bcTableHTML({ pts:x.pts, sg:x.sg, ar:x.ar, sel:null, bad:{}, lock:true, pre:"bl", ptF:ptF(it), caption:"Your sign chart of f′" }); }
  function judge(it, x){
    var st = STG[x.stage], ans = MV.ans(it);
    if (st === "factor") { if (x.fc == null) return { err:"Tap an answer first." }; return MV.ok(it.factor.options[x.fc]) ? { ok:true } : { ok:false, msg:M.factor }; }
    if (st === "pts") {
      var tp = truth(it), msgs = [], bb = {};
      tp.forEach(function(t){ var at = ptAt(x.pts, t.x); if (!at) msgs.push(it.missFb && it.missFb[String(t.x)] ? it.missFb[String(t.x)] : t.t === "z" ? M.missZ : M.missU); else if (at.t !== t.t) msgs.push(tpl(t.t === "u" ? M.wantU : M.wantZ, { x:m("x = " + nmS(t.x).replace(MINUS, "-")) })); });
      x.pts.forEach(function(p){ if (!ptAt(tp, p.x)) msgs.push(tpl(M.extra, { x:m("x = " + nmS(p.x).replace(MINUS, "-")) })); });
      return msgs.length ? { ok:false, msg:msgs.filter(function(v, i, A){ return A.indexOf(v) === i; }).join(" ") } : { ok:true };
    }
    if (st === "signs") {
      var cols = bcCols(x.pts).filter(function(c){ return c.iv; }), F = BF[it.id], b2 = {}, ws = false, wa = false, blank = false, spec = null;
      cols.forEach(function(c){
        var s = sgn(F.d(c.mid)), g = x.sg[c.k], ar = x.ar[c.k];
        if (!g || !ar) blank = true;
        if (g && g !== (s > 0 ? "+" : "-")) { b2["sg|" + c.k] = 1; ws = true; var key = r9(c.a) + "|" + r9(c.b) + "|" + (g === "+" ? 1 : g === "-" ? -1 : 0); if (it.signFb && it.signFb[key]) spec = it.signFb[key]; }
        if (ar && ar !== (s > 0 ? "u" : "d")) { b2["ar|" + c.k] = 1; wa = true; }
      });
      bad[it.id] = b2;
      if (ws || wa) return { ok:false, msg:spec || ((ws ? M.signs : "") + (ws && wa ? " " : "") + (wa ? M.arrows : "")) };
      if (blank) return { err:M.blank };
      return { ok:true };
    }
    var P = { inc:parseIv(x.inc), dec:parseIv(x.dec) };
    if (!String(x.inc).trim() || !String(x.dec).trim()) return { err:M.ivEmpty };
    if (!P.inc || !P.dec) return { err:M.ivBad };
    var res = [];
    ["inc", "dec"].forEach(function(k){
      var alts = ans[k].map(ivW), okk = alts.some(function(W){ return ivEq(P[k], W); });
      if (okk) return;
      var named = (it.ivFb && it.ivFb[k] || []).filter(function(w){ return ivEq(P[k], ivW(w.iv)); })[0];
      if (named) { res.push(named.fb); return; }
      var ends = alts.some(function(W){ return ivSameEnds(P[k], W); });
      res.push(ends ? bracketMsg(P[k], alts[0], M) : M[k]);
    });
    return res.length ? { ok:false, msg:res.filter(function(v, i, A){ return A.indexOf(v) === i; }).join(" ") } : { ok:true };
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.go != null) { S.cur = clamp(+b.dataset.go, 0, items.length - 1); api.save(); paint(); return; }
    var it = cur(), x = ist(it.id);
    if (b.dataset.ins) { var inp = doInsert(host, b); if (inp) { x[inp.dataset.iv] = inp.value; api.save(); } return; }
    if (x.solved) return;
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.fc != null) { x.fc = +b.dataset.fc; fb[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.bm) { x.mk = clamp(x.mk + 0.5 * +b.dataset.bm, it.range[0], it.range[1]); api.save(); paint(); return; }
    if (b.dataset.bp) { togglePt(x, x.mk, b.dataset.bp); fb[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.bc) { bcCycle(x, b.dataset.bc, b.dataset.key); var bb = bad[it.id] || {}; delete bb[b.dataset.bc + "|" + b.dataset.key]; fb[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.err) fb[it.id] = { good:false, html:r.err };
      else if (r.ok) {
        x.stage++; bad[it.id] = {};
        if (x.stage >= STG.length) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; fb[it.id] = null; }
        else fb[it.id] = { good:true, html:"<strong>✓ Right.</strong> On to step " + (x.stage + 1) + "." };
      } else { x.tries++; fb[it.id] = { good:false, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
      api.save(); paint(); MV.focusFb($("#id-bq", host));
    }
  });
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.iv; if (!k) return; ist(cur().id)[k] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.iv) { var c = $('[data-k="bchk"]', host); if (c) c.click(); } });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + items.length + (d < items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Working backwards ----------
function backAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { iv:"", a:"", ch:null, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q id-wq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="id-win"></div><div class="id-wcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .id-win', host), dis = x.solved ? " disabled" : "", h = "";
    if (it.kind === "chips") h = '<div class="chips" role="group" aria-label="Your answer">' + it.choices.map(function(c, j){ return '<button type="button" class="chip' + (x.ch === j ? " on" : "") + '" data-ch="' + j + '" data-k="' + it.id + "ch" + j + '" aria-pressed="' + (x.ch === j) + '"' + dis + ">" + c + "</button>"; }).join("") + "</div>";
    else {
      if (it.kind === "pair") h += '<div class="numrow id-ivrow"><label for="id-wa' + it.id + '">' + it.numLabel + '</label><input class="numin short" id="id-wa' + it.id + '" data-wa="' + it.id + '" data-k="' + it.id + 'a" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.a) + '"' + dis + "></div>";
      h += '<div class="numrow id-ivrow"><label for="id-wi' + it.id + '">' + it.label + '</label><input class="numin id-ivin" id="id-wi' + it.id + '" data-iv="' + it.id + '" data-k="' + it.id + 'iv" type="text" autocomplete="off" spellcheck="false" value="' + MV.esc(x.iv) + '"' + dis + ">" + (x.solved ? "" : ivInsertBtns(it.id)) + "</div>";
    }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .id-wcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judgeIv(it, raw, W){
    var P = parseIv(raw, it.var || "x");
    if (!String(raw || "").trim()) return { err:"Type your answer first." };
    if (!P) return { err:"Type intervals like (−∞, −1) or (−∞, −3) ∪ (2, ∞)." + (it.var ? " You can also type an inequality such as −1 ≤ " + it.var + " ≤ 1." : "") };
    if (ivEq(P, W)) return { ok:true };
    var nw = (it.wrong || []).filter(function(w){ return ivEq(P, ivW(w.iv)); })[0];
    if (nw) return { ok:false, msg:nw.fb };
    if (it.overlap && P.some(function(p){ return p.a < it.overlap.iv[1] && p.b > it.overlap.iv[0]; })) return { ok:false, msg:it.overlap.fb };
    if (ivSameEnds(P, W)) return { ok:false, msg:P.some(function(p){ return (p.a === -Infinity && p.aIn) || (p.b === Infinity && p.bIn); }) ? "Infinity always takes a round bracket." : "Check your brackets: is each endpoint included or not?" };
    return { ok:false, msg:it.general };
  }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it);
    if (it.kind === "chips") { if (x.ch == null) return { err:"Tap an answer first." }; return it.choices[x.ch] === ans ? { ok:true } : { ok:false, msg:it.general }; }
    if (it.kind === "pair") {
      if (!String(x.a).trim() || !String(x.iv).trim()) return { err:"Fill in both answers first." };
      var av = MV.parseNum(x.a); if (!av || av.length !== 1) return { err:"Type a number for " + m("a") + "." };
      var r = judgeIv(it, x.iv, ivW(ans.iv));
      if (r.err) return r;
      if (!near(av[0], ans.a, 1e-9)) return { ok:false, msg:it.aFb };
      return r;
    }
    return judgeIv(it, x.iv, ivW(ans));
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset || {}; if (d.iv) { ist(d.iv).iv = e.target.value; api.save(); } else if (d.wa) { ist(d.wa).a = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){ var d = e.target.dataset || {}, id = d.iv || d.wa; if (e.key !== "Enter" || !id) return; var b = host.querySelector('[data-k="' + id + 'chk"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var qb = b.closest("[data-q]"); if (!qb) return;
    var it = a.items.filter(function(z){ return z.id === qb.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.ins) { var inp = doInsert(qb, b); if (inp) { x.iv = inp.value; api.save(); } return; }
    if (b.dataset.ch != null) { x.ch = +b.dataset.ch; msgs[it.id] = null; api.save(); paintIn(it); paintCl(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(qb);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a derivative ----------
var task = (function(){
  var api, pF, pD, AS = [-3, -2, -1, 1, 2, 3];
  function gi(k){ var s = api ? api.S : {}, v = Number(String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-")); return String(s[k] == null ? "" : s[k]).trim() !== "" && Number.isInteger(v) ? v : null; }
  function read(){ var a = gi("a"), p = gi("p"), q = gi("q"); return { a:a, p:p, q:q, ok3:a !== null && AS.indexOf(a) >= 0 && p !== null && q !== null && p >= -5 && p <= 5 && q >= -5 && q <= 5 }; }
  function fac(r){ return r === 0 ? "x" : "(x " + (r < 0 ? "+ " + -r : "- " + r) + ")"; }
  function src(a, p, q){ var c = a === 1 ? "" : a === -1 ? "-" : String(a); return c + (p === q ? (p === 0 ? "x^2" : fac(p) + "^2") : (c && p === 0 ? "x" : fac(p)) + fac(q)); }
  function line1(d){ return d.a > 0 ? (d.q <= -1 || d.p >= 3) : (d.p <= -1 && d.q >= 3 && d.p < d.q); }
  function draw(){
    var d = read(), V = { xmin:-6, xmax:6 };
    if (!d.ok3 || d.p > d.q) { pF.draw({ view:{ xmin:-6, xmax:6, ymin:-10, ymax:10 }, describe:"Choose a, p and q (p ≤ q) to see one possible f." }); pD.draw({ view:{ xmin:-6, xmax:6, ymin:-10, ymax:10 }, describe:"Choose a, p and q (p ≤ q) to see the graph of f′." }); return; }
    var a = d.a, p = d.p, q = d.q, fd = function(x){ return a * (x - p) * (x - q); }, ff = function(x){ return a * (x * x * x / 3 - (p + q) * x * x / 2 + p * q * x); };
    // f’s y-range fits a window around the zeros of f′ (the cubic’s growth elsewhere would flatten its turns); it runs off-screen outside
    var w0 = Math.max(-6, p - 1.2), w1 = Math.min(6, q + 1.2), wm = (w0 + w1) / 2; if (w1 - w0 < 3) { w0 = wm - 1.5; w1 = wm + 1.5; }
    var yl = Infinity, yh = -Infinity, dl = 0, dh = 0;
    for (var i = 0; i <= 120; i++) { var x = -6 + i / 10, y = ff(x), g = fd(x); if (x >= w0 - 1e-9 && x <= w1 + 1e-9) { yl = Math.min(yl, y); yh = Math.max(yh, y); } dl = Math.min(dl, g); dh = Math.max(dh, g); }
    var cy = 0, py = Math.max((yh - yl) * 0.15, 0.6), pdd = (dh - dl) * 0.1 + 1;
    var band = [{ x0:-1, x1:3, color:css("--hi-soft") }], ink = css("--ink");
    var zs = p === q ? [p] : [p, q];
    pF.draw({ view:{ xmin:V.xmin, xmax:V.xmax, ymin:Math.max(yl - py, -200) - cy, ymax:Math.min(yh + py, 200) + cy }, bands:band, yLabel:"f(x)", curves:[{ f:ff, color:css("--pen"), width:3 }],
      points:zs.map(function(z){ return { x:z, y:ff(z), r:5, color:ink }; }), labels:[{ x:1, y:Math.min(yh + py, 200) + cy, text:"(−1, 3)", dy:12, align:"center", bg:true, font:ui(12) }],
      describe:"One possible f for f′(x) = " + MV.plain(m(src(a, p, q))) + ", with the interval from −1 to 3 shaded; level points at x = " + zs.map(function(z){ return nmS(z); }).join(" and ") + "." });
    pD.draw({ view:{ xmin:V.xmin, xmax:V.xmax, ymin:Math.max(dl - pdd, -120), ymax:Math.min(dh + pdd, 120) }, bands:band, yLabel:"f′(x)", curves:[{ f:fd, color:css("--f3"), width:2.6 }],
      points:zs.map(function(z){ return { x:z, y:0, r:5, open:true, color:ink }; }).concat([{ x:0, y:fd(0), r:5, color:css("--f3") }]), labels:[{ x:0, y:fd(0), text:"f′(0) = " + nmS(fd(0)), dx:8, dy:-14, align:"left", bg:true, font:ui(12) }],
      describe:"Graph of f′(x) = " + MV.plain(m(src(a, p, q))) + ": zeros at x = " + zs.map(function(z){ return nmS(z); }).join(" and ") + "; f′(0) = " + nmS(fd(0)) + "." });
  }
  function chart(){
    var d = read(), el = $("#id-tchart"); if (!el) return;
    if (!d.ok3 || d.p > d.q) { el.innerHTML = '<p class="tiny muted">Choose ' + m("a") + ", " + m("p") + " and " + m("q") + " with " + m("p ≤ q") + ".</p>"; return; }
    var a = d.a, p = d.p, q = d.q, fd = function(x){ return a * (x - p) * (x - q); };
    var pts = (p === q ? [p] : [p, q]).map(function(z){ return { x:z, t:"z" }; }), cols = bcCols(pts);
    function cs(v){ var s = sgn(v); return s > 0 ? "+" : s < 0 ? MINUS : "0"; }
    var rows = [];
    if (a !== 1) rows.push([m(String(a)), cols.map(function(c){ return { h:cs(a), cls:c.iv ? "" : "id-pt" }; })]);
    (p === q ? [[p, 2]] : [[p, 1], [q, 1]]).forEach(function(z){ rows.push([m(z[1] === 2 ? fac(z[0]) + "^2" : fac(z[0]).replace(/^\(|\)$/g, "")), cols.map(function(c){ var v = Math.pow((c.iv ? c.mid : c.x) - z[0], z[1]); return { h:Math.abs(v) < 1e-12 ? "0" : cs(v), cls:c.iv ? "" : "id-pt" }; })]); });
    rows.push(["Sign of " + m("f′(x)"), cols.map(function(c){ return c.iv ? { h:cs(fd(c.mid)) } : { h:"0", cls:"id-pt" }; })]);
    rows.push([m("f"), cols.map(function(c){ return c.iv ? { h:fd(c.mid) > 0 ? "↗" : "↘", cls:"id-arc" } : { h:"slope 0", cls:"id-pt" }; })]);
    APPROX = false;
    el.innerHTML = chartRowHTML(cols.map(function(c){ return c.iv ? ivTxt(c.a, c.b) : nmS(c.x); }), rows, "Sign chart of your f′");
  }
  function update(){ draw(); chart(); var d = read(), el = $("#id-tnow"); if (el) el.innerHTML = d.ok3 && d.p <= d.q ? m("f′(x) = " + src(d.a, d.p, d.q)) : ""; }
  function stepper(k, v){
    return '<div class="id-tstep"><label for="id-t' + k + '"><span class="m"><i>' + k + "</i></span> " + '<span class="tiny muted">(−5 to 5)</span></label>' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="it' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="id-t' + k + '" data-tk="' + k + '" type="number" min="-5" max="5" step="1" autocomplete="off" value="' + MV.esc(v) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="it' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  function aChips(){ var cur = gi("a"); return '<div class="id-tstep"><span class="id-tlab"><span class="m"><i>a</i></span></span><span class="chips" role="group" aria-label="Choose a">' + AS.map(function(v){ return '<button type="button" class="chip' + (cur === v ? " on" : "") + '" data-ta="' + v + '" data-k="ita' + v + '" aria-pressed="' + (cur === v) + '">' + nmS(v) + "</button>"; }).join("") + "</span></div>"; }
  return {
    render:function(inp, pv, A){
      api = A; if (A.S.a == null) { A.S.a = "1"; A.S.p = "0"; A.S.q = "2"; }
      function paintIn(){ MV.keepFocus(inp, function(){ inp.innerHTML = aChips() + stepper("p", A.S.p) + stepper("q", A.S.q) + '<p class="id-tnow" id="id-tnow" aria-live="polite"></p>'; }); }
      paintIn();
      pv.innerHTML = '<div id="id-tchart" aria-live="polite"></div><div class="plot-wrap"><canvas class="plot dp-top" id="id-tf" role="img" aria-label="One possible f"></canvas></div><div class="plot-wrap"><canvas class="plot dp-low" id="id-td" role="img" aria-label="Graph of f′"></canvas></div><p class="tiny muted">Shaded: the interval (−1, 3).</p>';
      pF = new MV.Plot($("#id-tf"), { xmin:-6, xmax:6, ymin:-10, ymax:10 }); pD = new MV.Plot($("#id-td"), { xmin:-6, xmax:6, ymin:-10, ymax:10 });
      pF.render = draw; pD.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; A.S[k] = e.target.value; A.save(); update(); A.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.ta) { A.S.a = b.dataset.ta; A.save(); paintIn(); update(); A.update(); return; }
        if (!b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(A.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        A.S[k] = String(clamp(cur + +b.dataset.dir, -5, 5)); $("#id-t" + k).value = A.S[k]; A.save(); update(); A.update();
      });
      update();
    },
    read:read,
    valid:function(d){ if (!d.ok3) return "Choose a from the chips, and whole numbers p and q from −5 to 5."; return d.p <= d.q ? true : "Make p ≤ q (swap them)."; },
    checks:function(d){
      if (!d.ok3 || d.p > d.q) return [false, false, false];
      return [line1(d), d.a > 0 && d.p < d.q, d.a * d.p * d.q === 6];
    },
    tips:function(d, res){
      var T = api.content.tips, out = [];
      if (!d.ok3 || d.p > d.q) return ["Choose a, p and q with p ≤ q."];
      if (d.a < 0) out.push(T[0]);
      else if (!res[0] || !res[1]) { out.push(T[1]); if (!res[0]) out.push(T[3]); }
      if (!res[2]) out.push(T[2]);
      return out;
    },
    key:function(d){ return d.a + "|" + d.p + "|" + d.q; },
    label:function(k){ var s = k.split("|").map(Number); return m("f′(x) = " + src(s[0], s[1], s[2])); },
    text:function(k){ var s = k.split("|").map(Number); return "f′(x) = " + MV.plain(m(src(s[0], s[1], s[2]))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ builds:buildsAct, back:backAct },
  task:task
});
})();
