// MHF4U 36 Chapter 5 Summary & Review: hero (a unit-circle point unwraps into sin x, which tunes into a tide model),
// per-topic tables (diagnostic, mixed practice, Final Check), Connect "Four forms, four waves" (K12 grouping with
// multi-form cards + the chapter on one page), the mixed-practice set (choice, number entry, select-all on the 0-to-2π
// strip) and the "Many equations, one wave" task (N9 wave tuner).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS, PI = Math.PI, TAU = 2 * PI;
var TOPICS = ["31", "32", "33", "34", "35"];
function fill(s, o){ return String(s == null ? "" : s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function F(s, a){ return String(s == null ? "" : s).replace(/§(\d)/g, function(mm, k){ var v = a[+k - 1]; return v == null ? mm : v; }); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function near(a, b, e){ return Math.abs(a - b) < (e || 1e-9); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function modsLabel(ts){ return ts.length > 1 ? "Modules " + ts.slice(0, -1).join(", ") + " and " + ts[ts.length - 1] : "Module " + ts[0]; }
function scrollTo(el){ if (!el) return; var r = el.getBoundingClientRect(); if (r.top < 0 || r.top > window.innerHeight * 0.6) el.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
function isDark(){ var s = css("--sheet").replace("#", ""); return s.length >= 6 && parseInt(s.slice(0, 2), 16) < 128; }
// k twelfths of π as an m() source ("5π/6", or stacked "{5π}/{6}")
function angS(k, st){
  if (!k) return "0";
  var g = gcd(k, 12), p = Math.abs(k / g), q = 12 / g, top = (p === 1 ? "" : p) + "π";
  return (k < 0 ? "-" : "") + (q === 1 ? top : st ? "{" + top + "}/{" + q + "}" : top + "/" + q);
}
function angT(k){ return angS(k).replace(/-/g, MINUS); }
function piQ(n, d, st){ var g = gcd(n, d); n /= g; d /= g; if (!n) return "0"; var top = (Math.abs(n) === 1 ? "" : Math.abs(n)) + "π"; return (n < 0 ? "-" : "") + (d === 1 ? top : st ? "{" + top + "}/{" + d + "}" : top + "/" + d); }
function ratS(n, d, st){ if (d === 1) return String(n); var a = Math.abs(n); return (n < 0 ? "-" : "") + (st ? "{" + a + "}/{" + d + "}" : a + "/" + d); }
function sameSet(a, b){ var x = a.slice().sort(function(p, q){ return p - q; }), y = b.slice().sort(function(p, q){ return p - q; }); return x.join() === y.join(); }

// ---------- per-topic tables (N16 diagnostic, mixed practice, N17 Final Check), as in MHF4U 10, 16, 24 and 30 ----------
function modLink(t){ var mm = MV.topicMod(t); return mm.slug ? '<a href="' + mm.nn + "-" + mm.slug + '.html">Revisit module ' + mm.nn + "</a>" : "Revisit module " + t; }
function keyIdea(t){ var k = (MV.C.keyIdeas || {})[t]; return k ? '<div class="tt-key"><p><strong>Key idea:</strong> ' + k.idea + "</p><p><strong>Where to look:</strong> " + k.look + "</p></div>" : ""; }
// rows: [{t, r, n}] -> Module | <head> | Status; "◆ Revisit" rows add the key idea and where to look.
function topicTable(rows, head, caption){
  return '<div class="tt-wrap"><table class="topic-tbl tt"><caption class="vh">' + caption + '</caption><thead><tr><th scope="col">Module</th><th scope="col">' + head + '</th><th scope="col">Status</th></tr></thead><tbody>' +
    rows.map(function(o){
      var mm = MV.topicMod(o.t), pend = !o.n, ok = !pend && o.r === o.n;
      var st = pend ? '<span class="muted">Not tried yet</span>' : ok ? "✓ Ready" : "◆ " + modLink(o.t);
      var h = '<tr class="' + (ok || pend ? "" : "tt-rev") + '"><td>' + mm.nn + ". " + mm.title + "</td><td>" + (pend ? "—" : o.r + "/" + o.n) + "</td><td>" + st + "</td></tr>";
      if (!ok && !pend) h += '<tr class="tt-more"><td colspan="3">' + keyIdea(o.t) + "</td></tr>";
      return h;
    }).join("") + "</tbody></table></div>";
}
// Diagnostic results: the toolkit's review messages, then the per-topic Ready / Revisit table with key ideas.
MV.paintWarmResult = function(){
  var host = $("#warmup-result"), W = MV.warmCfg(), S = MV.S, ws = MV.warmStats();
  if (ws.checked < ws.total) { host.innerHTML = '<p class="tiny muted" style="margin-top:12px">' + ws.checked + " of " + ws.total + " answered.</p>"; return; }
  var frac = ws.score / ws.total;
  var msg = frac >= 5 / 6 - 1e-9 ? "You’re in good shape for this review. Use it to sharpen the details." : frac >= 0.5 ? "Good start. The table below shows which modules to revisit." : "Use the table below: revisit the modules marked before you go further.";
  var rows = TOPICS.map(function(t){
    var qs = W.list.filter(function(q){ return q.topic === t; });
    return { t:t, n:qs.length, r:qs.filter(function(q){ return S.warm[q.id] && S.warm[q.id].correct; }).length };
  }).filter(function(o){ return o.n; });
  host.innerHTML = '<div class="result"><p class="big-score">' + ws.score + " / " + ws.total + "</p>" + (ws.withSol ? '<p class="tiny muted">(' + ws.withSol + " more correct with the worked solution)</p>" : "") +
    "<p>" + msg + "</p>" + topicTable(rows, "Right", "Diagnostic results by module") + "</div>";
};
// Final Check: swap the toolkit's per-topic table for the same table with key ideas.
var finalCtl0 = MV.paintFinalCtl;
MV.paintFinalCtl = function(){
  finalCtl0.apply(this, arguments);
  if (!MV.S.final.submitted) return;
  var tbl = $("#final-ctl .topic-tbl"); if (!tbl) return;
  var tp = MV.finalStats().topics, d = document.createElement("div");
  d.innerHTML = topicTable(TOPICS.filter(function(t){ return tp[t]; }).map(function(t){ return { t:t, r:tp[t][0], n:tp[t][1] }; }), "Right", "Final Check results by module");
  tbl.parentNode.replaceChild(d.firstChild, tbl);
};
// "Modules to revisit" combines the diagnostic, mixed practice and the Final Check.
function mixedWeak(){
  var A = (MV.S.act || {}).mx, out = {}; if (!A || !A.items) return [];
  ((MV.C.mixed || {}).activities || []).forEach(function(a){ (a.items || []).forEach(function(it){ var x = A.items[it.id]; if (x && (x.tries > 0 || x.hint >= 3)) out[it.topic] = 1; }); });
  return Object.keys(out);
}
var summaryData0 = MV.summaryData;
MV.summaryData = function(){
  var d = summaryData0.apply(this, arguments), w = {};
  d.weak.concat(mixedWeak()).forEach(function(t){ w[t] = 1; });
  d.weak = Object.keys(w).sort();
  return d;
};
var summaryText0 = MV.summaryText;
MV.summaryText = function(){
  var L = summaryText0.apply(this, arguments).split("\n"), S = MV.S, W = MV.warmCfg();
  var flagged = TOPICS.filter(function(t){ return W.list.some(function(q){ var st = S.warm[q.id]; return q.topic === t && st && st.checked && !st.correct; }); });
  return L.map(function(l){ return /^Diagnostic: \d/.test(l) ? l + "; modules flagged: " + (flagged.length ? flagged.join(", ") : "none") : l; }).join("\n");
};

// ---------- canvas helpers ----------
// @component G11 canvasFracLabel (from MHF4U 32) — canvas labels with stacked fractions and per-token colours:
//   toks = [{t, c, i (italic)} | {fn, fd, c}]; o = {size, align, bg}
function drawToks(ctx, p, toks, X, Y, o){
  o = o || {};
  var sz = o.size || 14, fs = Math.round(sz * 0.8), fm = p.fontM || "serif", ink = css("--ink");
  var fontOf = function(tk){ return (tk.i ? "italic " : "") + "600 " + sz + "px " + fm; };
  ctx.save();
  var ws = toks.map(function(tk){ if (tk.fn != null) { ctx.font = "600 " + fs + "px " + fm; return Math.max(ctx.measureText(tk.fn).width, ctx.measureText(tk.fd).width) + 4; } ctx.font = fontOf(tk); return ctx.measureText(tk.t).width; });
  var w = ws.reduce(function(s, x){ return s + x; }, 0), hasF = toks.some(function(tk){ return tk.fn != null; }), hh = hasF ? sz * 1.75 : sz * 1.2;
  var x0 = o.align === "right" ? X - w : o.align === "center" ? X - w / 2 : X;
  x0 = clamp(x0, 3, Math.max(3, p.W - w - 3)); Y = clamp(Y, hh / 2 + 1, p.H - hh / 2 - 1);
  if (o.bg !== false) { ctx.globalAlpha = 0.88 * (o.alpha == null ? 1 : o.alpha); ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, Y - hh / 2, w + 6, hh); }
  ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.textBaseline = "middle";
  var x = x0;
  toks.forEach(function(tk, i){
    ctx.fillStyle = tk.c || ink;
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
// "a = 3" -> tokens: single letters italic, hyphens to minus signs
function toks(src, col){ var out = []; String(src).split(/([A-Za-z])/).forEach(function(q, i){ if (q) out.push(i % 2 ? { t:q, i:true, c:col } : { t:q.replace(/-/g, MINUS), c:col }); }); return out; }
function uiText(ctx, s, X, Y, o){
  o = o || {}; ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
  ctx.font = (o.weight || "400") + " " + (o.size || 12) + "px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "middle";
  if (o.bg) { var w = ctx.measureText(s).width, bx = ctx.textAlign === "center" ? X - w / 2 : ctx.textAlign === "right" ? X - w : X; ctx.globalAlpha *= 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(bx - 3, Y - 9, w + 6, 18); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; }
  ctx.fillStyle = o.color || css("--ink-2"); ctx.fillText(s, X, Y); ctx.restore();
}
function line(ctx, x1, y1, x2, y2, col, w, dash, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.lineCap = "round";
  if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}
function disc(ctx, x, y, r, fill, stroke, sw, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw || 2; ctx.stroke(); } ctx.restore();
}
function path(ctx, pts, col, w, dash, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = "round"; ctx.lineCap = "round";
  if (dash) ctx.setLineDash(dash); ctx.beginPath(); pts.forEach(function(q, i){ if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.restore();
}
function curvePx(f, x0, x1, X, Y, n){ var out = [], N = n || 260; for (var i = 0; i <= N; i++) { var x = x0 + (x1 - x0) * i / N; out.push([X(x), Y(f(x))]); } return out; }
// G11 brackets: vertical (ticks point right) and horizontal (ticks point down)
function bracketV(ctx, X, Y0, Y1, col, alpha, dir){ var e = 5 * (dir || 1); ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X + e, Y0); ctx.lineTo(X, Y0); ctx.lineTo(X, Y1); ctx.lineTo(X + e, Y1); ctx.stroke(); ctx.restore(); }
function bracketH(ctx, X0, X1, Y, col, alpha){ ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X0, Y + 6); ctx.lineTo(X0, Y); ctx.lineTo(X1, Y); ctx.lineTo(X1, Y + 6); ctx.stroke(); ctx.restore(); }
function arrowH(ctx, X0, X1, Y, col, alpha){
  if (Math.abs(X1 - X0) < 4) return;
  var s = X1 > X0 ? 1 : -1; line(ctx, X0, Y, X1 - s * 6, Y, col, 2.5, null, alpha);
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(X1, Y); ctx.lineTo(X1 - s * 10, Y - 5); ctx.lineTo(X1 - s * 10, Y + 5); ctx.closePath(); ctx.fill(); ctx.restore();
}
function ring(ctx, X, Y, sc){ sc = sc == null ? 1 : sc; if (sc <= 0) return; disc(ctx, X, Y, 10.5 * sc, css("--hi")); disc(ctx, X, Y, 5.5 * sc, css("--ink"), css("--sheet"), 1.5); }

// ---------- the tide frame (hero end state and "the chapter on one page") ----------
var TV = { x0:-0.6, x1:13.2, y0:-3.4, y1:6.2 };
function tideMap(W, H, o){
  o = o || {}; var L = o.L || 30, R = o.R || 10, T = o.T || 8, B = o.B || 8, V = o.V || TV;
  return { V:V, X:function(x){ return L + (x - V.x0) / (V.x1 - V.x0) * (W - L - R); }, Y:function(y){ return T + (V.y1 - y) / (V.y1 - V.y0) * (H - T - B); } };
}
// grid at t = 0, 3, 6, 9, 12 and y = −2, 1, 4; axes; tick labels; axis names (o.names = [[x name, y name, alpha], …])
function tideFrame(ctx, p, M, o){
  var V = M.V, X = M.X, Y = M.Y, a = o.alpha == null ? 1 : o.alpha; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = css("--plot-grid"); ctx.lineWidth = 1; ctx.beginPath();
  [0, 3, 6, 9, 12].forEach(function(t){ var px = Math.round(X(t)) + 0.5; ctx.moveTo(px, Y(V.y1)); ctx.lineTo(px, Y(V.y0)); });
  [-2, 1, 4].forEach(function(y){ var py = Math.round(Y(y)) + 0.5; ctx.moveTo(X(V.x0), py); ctx.lineTo(X(V.x1), py); });
  ctx.stroke();
  ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(V.x0), Y(0)); ctx.lineTo(X(V.x1), Y(0)); ctx.moveTo(X(0), Y(V.y0)); ctx.lineTo(X(0), Y(V.y1)); ctx.stroke();
  ctx.restore();
  [3, 6, 9, 12].forEach(function(t){ uiText(ctx, String(t), X(t), Y(0) + 4, { align:"center", base:"top", alpha:a }); });
  [-2, 1, 4].forEach(function(y){ uiText(ctx, num(y), X(0) - 5, Y(y), { align:"right", alpha:a }); });
  (o.names || []).forEach(function(nm){
    var al = a * (nm[2] == null ? 1 : nm[2]); if (al <= 0) return;
    if (nm[3]) { uiText(ctx, nm[0], p.W - 6, p.H - 6, { align:"right", base:"bottom", alpha:al, bg:true }); uiText(ctx, nm[1], X(0) + 6, 6, { base:"top", alpha:al, bg:true }); }
    else { drawToks(ctx, p, toks(nm[0], css("--ink-2")), X(V.x1) - 4, Y(0) + 12, { align:"right", size:14, bg:false, alpha:al }); drawToks(ctx, p, toks(nm[1], css("--ink-2")), X(0) + 7, Y(V.y1) + 10, { size:14, bg:false, alpha:al }); }
  });
}
// brackets for y = 3 sin(πt/6) + 1: axis (magenta, dashed), amplitude (violet, at the minimum), period (orange, over the top)
function tideMarks(ctx, p, M, a, o){
  if (a <= 0) return; o = o || {};
  var X = M.X, Y = M.Y, V = M.V, ac = css("--acol"), pk = css("--p-k"), pc = css("--p-c");
  line(ctx, X(0), Y(1), X(V.x1), Y(1), pc, 1.8, [8, 6], a);
  drawToks(ctx, p, o.axisT || toks("y = 1", pc), X(8.6), Y(1) - 11, { align:"right", size:13, alpha:a });
  var bx = X(9) + 8; bracketV(ctx, bx, Y(1), Y(-2), ac, a, -1);
  drawToks(ctx, p, toks("a = 3", ac), bx + 2, Y(-2) + 13, { size:13, alpha:a });
  var by = Y(4.6); bracketH(ctx, X(0), X(12), by, pk, a);
  drawToks(ctx, p, [{ t:"period 12", c:pk }], X(6), by - 11, { align:"center", size:13, alpha:a });
}

// ---------- hero: circle → sin x → y = 3 sin(πt/6) + 1, cosine, a line, a tide (storyboard in the plan) ----------
// @component N24 circleGraphLink (subset, from MHF4U 31) — a unit circle beside a graph on one vertical scale; a dotted
//   carry line joins the point's height on the circle to the same height on the graph as the curve is traced.
function heroScene(ctx, p, st){
  var W = p.W, H = p.H, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen");
  var u = Math.min((W - 38) / (2.4 + TAU + 0.3), (H - 26) / 2.7), cx = 8 + 1.2 * u, cy = H / 2, gL = cx + 1.2 * u + 14;
  var M2 = tideMap(W, H, { L:Math.max(26, W * 0.06) }), rf = clamp(st.rf, 0, 1);
  var X = function(x){ return lerp(gL + x * u, M2.X(x), rf); }, Y = function(y){ return lerp(cy - y * u, M2.Y(y), rf); };
  var M = { V:TV, X:X, Y:Y };
  // phase 1 frame: the circle (fading out) and a radian axis
  if (rf < 1) {
    var a1 = 1 - rf;
    line(ctx, cx - 1.25 * u, cy, cx + 1.25 * u, cy, css("--plot-axis"), 1, null, a1); line(ctx, cx, cy - 1.25 * u, cx, cy + 1.25 * u, css("--plot-axis"), 1, null, a1);
    if (st.circ > 0) { ctx.save(); ctx.globalAlpha = a1; ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, u, 0, -TAU * st.circ, true); ctx.stroke(); ctx.restore(); }
    line(ctx, X(0), Y(0), X(TAU) + 8, Y(0), css("--plot-axis"), 1.5, null, a1); line(ctx, X(0), Y(1.3), X(0), Y(-1.3), css("--plot-axis"), 1.2, null, a1);
    [1, 2, 3, 4].forEach(function(i){ var px = X(i * PI / 2); line(ctx, px, Y(0) - 4, px, Y(0) + 4, css("--plot-axis"), 1.2, null, a1); uiText(ctx, MV.piLabel(i * PI / 2), px, Y(0) + 6, { align:"center", base:"top", alpha:a1 }); });
    drawToks(ctx, p, toks("x", ink2), X(TAU) + 12, Y(0) - 10, { size:14, bg:false, alpha:a1 });
  }
  if (rf > 0) tideFrame(ctx, p, M, { alpha:rf, names:[["t", "y", 1 - st.lab], ["time (h)", "water level (m)", st.lab, true]] });
  // the wave: A sin(Kx) + C, morphing from sin x to 3 sin(πt/6) + 1
  var mo = clamp(st.mo, 0, 1), A = 1 + 2 * mo, C = mo, K = lerp(1, PI / 6, mo), wf = function(x){ return A * Math.sin(K * x) + C; };
  tideMarks(ctx, p, M, st.br);
  var lo = lerp(0, TV.x0, rf), hi = rf > 0 ? lerp(TAU, TV.x1, rf) : TAU * st.tr;
  if (hi > lo + 1e-6) path(ctx, curvePx(wf, lo, hi, X, Y), pen, 3.2);
  // phase 1: the point on the circle, its height bar and the carry line
  if (rf <= 0 && st.circ >= 1 && st.tr > 0 && st.tr < 1) {
    var x = TAU * st.tr, px = cx + u * Math.cos(x), py = cy - u * Math.sin(x);
    line(ctx, px, cy, px, py, pen, 3); line(ctx, px, py, X(x), Y(Math.sin(x)), ink2, 1.6, [2, 5]); line(ctx, X(x), Y(0), X(x), Y(Math.sin(x)), pen, 3);
    ring(ctx, px, py);
  } else if (rf < 1 && st.circ >= 1) ring(ctx, cx + u, cy, 1 - rf);
  // a dashed cosine slides d = s onto the wave (33)
  if (st.csA > 0) {
    var s = st.cs, cf = function(t){ return 3 * Math.cos(PI / 6 * (t - s)) + 1; }, pd = css("--p-d");
    path(ctx, curvePx(cf, TV.x0, TV.x1, X, Y), ink, 2.4, [7, 6], st.csA);
    arrowH(ctx, X(0), X(s), Y(-2.75), pd, st.csA);
    if (s > 0.2) drawToks(ctx, p, toks("d = " + num(Math.round(s * 10) / 10), pd), X(s) + 6, Y(-2.75), { size:13, alpha:st.csA });
  }
  // the line y = 2.5 meets the wave twice (34)
  if (st.ln > 0) {
    line(ctx, X(TV.x0), Y(2.5), X(lerp(TV.x0, TV.x1, st.ln)), Y(2.5), ink, 2);
    if (st.ln >= 1) drawToks(ctx, p, toks("y = 2.5"), X(6.6), Y(2.5) - 11, { size:13 });
  }
  if (st.pts > 0) [1, 5].forEach(function(t){
    line(ctx, X(t), Y(2.5), X(t), Y(0), ink2, 1.5, [2, 4], st.pts); ring(ctx, X(t), Y(2.5), st.pts);
    drawToks(ctx, p, toks("t = " + t), X(t) + 4, Y(0) - 10, { size:13, alpha:st.pts });
  });
}
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:0, xmax:1, ymin:0, ymax:1 }), H0 = MV.C.hero, steps = (H0.fig || {}).steps || [];
  var FIN = { circ:1, tr:1, rf:1, mo:1, br:1, cs:3, csA:1, ln:1, pts:1, lab:1 };
  var st = MV.reduceMotion ? Object.assign({}, FIN) : { circ:0, tr:0, rf:0, mo:0, br:0, cs:0, csA:0, ln:0, pts:0, lab:0 };
  var k = MV.reduceMotion ? steps.length : 0, cur = -1;
  function cap(){ f.cap.innerHTML = k ? steps.slice(0, k).map(function(s, i){ return '<span class="hc-l' + (i === cur ? " cur" : "") + '">' + s.cap + "</span>"; }).join("") : "&nbsp;"; }
  p.render = function(){
    var done = k >= steps.length && st.lab >= 1;
    p.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false,
      describe:done ? MV.plain(H0.fig.aria) : "Unit circle and graph. " + steps.slice(0, k).map(function(s){ return MV.plain(s.cap); }).join(" "),
      after:function(ctx){ heroScene(ctx, p, st); } });
  };
  cap(); p.render();
  if (MV.reduceMotion) return;
  function tw(key, to, dur, then, lin){ var from = st[key]; MV.tween({ dur:dur, ease:lin ? function(t){ return t; } : undefined, step:function(t){ st[key] = lerp(from, to, t); p.render(); }, done:function(){ st[key] = to; p.render(); then(); } }); }
  function go(i){ k = i + 1; cur = i; cap(); p.render(); }
  var seq = [
    function(n){ go(0); tw("circ", 1, 600, function(){ tw("tr", 1, 2600, function(){ MV.wait(800, n); }, true); }); },
    function(n){ go(1); tw("rf", 1, 900, function(){ tw("mo", 1, 1600, function(){ tw("br", 1, 500, function(){ MV.wait(1000, n); }); }); }); },
    function(n){ go(2); tw("csA", 1, 300, function(){ tw("cs", 3, 1500, function(){ MV.wait(1000, n); }); }); },
    function(n){ go(3); tw("ln", 1, 700, function(){ tw("pts", 1, 400, function(){ MV.wait(1000, n); }); }); },
    function(n){ go(4); tw("lab", 1, 700, function(){ MV.wait(1600, n); }); },
    function(){ cur = -1; cap(); p.render(); }
  ];
  MV.wait(400, function(){ (function run(i){ if (i < seq.length) seq[i](function(){ run(i + 1); }); })(0); });
}

// ---------- Connect: four forms, four waves ----------
// @component K12 groupSort (multi-form cards) — tap-to-sort into group slots. Cards carry any face (equation, mini graph,
// table, words); each group shows a fixed anchor card and one slot per form. Tap a card, then "Place in wave X" (on the
// group or in the sticky bar): a right card locks into its slot, a wrong one stays in the tray with pair-specific feedback
// (card id) or a per-form default. One challenge at a time (group, multiple choice or a chip row per group), first-try tracked.
var CN = null;
function sineOf(P){ var g = P.f === "sin" ? Math.sin : Math.cos; return function(t){ return P.a * g(PI * t / P.kd) + P.c; }; }
function listAnd(a){ return a.length > 1 ? a.slice(0, -1).join(", ") + " and " + a[a.length - 1] : a[0] || ""; }
function graphDesc(P){
  var f = sineOf(P), A = Math.abs(P.a), hi = P.c + A, lo = P.c - A, h0 = f(0), up = f(0.01) > h0, H = [], L = [];
  for (var t = 0; t <= 12 + 1e-9; t += 0.25) { var y = f(t); if (near(y, hi, 1e-6)) H.push(num(t)); if (near(y, lo, 1e-6)) L.push(num(t)); }
  return "at t = 0, h = " + num(h0) + (near(h0, hi, 1e-6) ? ", a high" : near(h0, lo, 1e-6) ? ", a low" : up ? " and rising" : " and falling") + "; highs of " + num(hi) + " at t = " + listAnd(H) + "; lows of " + num(lo) + " at t = " + listAnd(L) + ".";
}
function tableHTML(rows, hl){
  hl = hl || function(){ return ["", ""]; };
  return '<table class="ff-tb"><tbody><tr><th scope="row">' + m("t") + " (h)</th>" + rows.map(function(r){ return '<td class="' + hl(r)[0] + '">' + num(r[0]) + "</td>"; }).join("") + "</tr>" +
    '<tr><th scope="row">' + m("h") + " (m)</th>" + rows.map(function(r){ return '<td class="' + hl(r)[1] + '">' + num(r[1]) + "</td>"; }).join("") + "</tr></tbody></table>";
}
function connect(host, api){
  var C = api.content, U = C.ui, CH = C.challenges, S = api.S, msg = {}, CARD = {}, EL = {}, PLOTS = [], FORMS = ["eq", "graph", "table"];
  C.cards.forEach(function(c){ CARD[c.id] = c; });
  S.cur = clamp(S.cur || 0, 0, CH.length - 1); S.ch = S.ch || {}; S.place = S.place || {}; if (S.sel && !CARD[S.sel]) S.sel = null;
  function st(c){ var x = S.ch[c.id] || (S.ch[c.id] = { tries:0, solved:false, first:null }); x.picks = x.picks || {}; return x; }
  function solved(c){ var x = S.ch[c.id]; return !!(x && x.solved); }
  function waveOf(id){ return MV.ans(CARD[id]); }
  function chOf(w){ for (var i = 0; i < CH.length; i++) if (CH[i].type === "group" && CH[i].wave === w) return i; return -1; }
  function placedIn(w, fm){ for (var id in S.place) if (S.place[id] === w && CARD[id] && CARD[id].form === fm) return id; return null; }
  function live(){ var c = CH[S.cur]; return c.type === "group" && !st(c).solved; }
  function cardAria(c){
    if (c.form === "eq") return U.forms.eq + ": " + MV.plain(c.t);
    if (c.form === "table") return U.forms.table + ": " + c.rows.map(function(r){ return "t " + num(r[0]) + ", h " + num(r[1]); }).join("; ");
    return U.forms.graph + " from t = 0 to 12: " + graphDesc(c.p);
  }
  // a card's face (equation, table or mini graph) in a tray button or a group slot
  function fillFace(el, c){
    if (c.form === "eq") { el.innerHTML = '<span class="ff-ct">' + c.t + "</span>"; return; }
    if (c.form === "table") { el.innerHTML = tableHTML(c.rows); return; }
    el.innerHTML = '<canvas class="plot ff-gc" role="img" aria-label="' + MV.esc(MV.plain(cardAria(c))) + '"></canvas>';
    var pl = new MV.Plot($("canvas", el), { xmin:-0.8, xmax:12.8, ymin:-3.3, ymax:5.3 }), f = sineOf(c.p);
    pl.render = function(){
      pl.draw({ view:{ xmin:-0.8, xmax:12.8, ymin:-3.3, ymax:5.3 }, xTicks:{ step:1.5, fmt:function(t){ return near(t % 3, 0, 1e-6) ? num(t) : ""; } },
        yTicks:{ step:1, fmt:function(y){ return [-2, 1, 4].indexOf(Math.round(y)) >= 0 ? num(y) : ""; } }, describe:MV.plain(cardAria(c)),
        after:function(ctx, pp){ pp.curve({ f:f, color:css("--pen"), width:2.6, domain:[-0.8, 12.8] }); } });
    };
    PLOTS.push(pl); pl.render();
  }
  // tray cards stay in the tray (a card already in one group can still be tried in another); a copy of the face fills the slot
  function makeCard(c){
    var b = document.createElement("button");
    b.type = "button"; b.className = "ff-card ff-" + c.form; b.dataset.card = c.id; b.dataset.k = "ffc" + c.id; b.setAttribute("aria-pressed", "false");
    b.innerHTML = '<span class="ff-badge"></span><span class="ff-face"></span>';
    fillFace($(".ff-face", b), c);
    EL[c.id] = b;
  }
  C.cards.forEach(makeCard);
  var gname = function(w){ return F(U.wave, [w]); };
  host.innerHTML = '<div class="ff"><div class="cv-chal" id="ff-chal"></div>' +
    '<div class="ff-tray" id="ff-tray"><h3 class="ff-th">' + U.tray + "</h3>" + FORMS.map(function(fm){ return '<div class="ff-row"><span class="ff-lab">' + U.rows[fm] + '</span><div class="ff-rc ff-rc-' + fm + '" data-row="' + fm + '" role="group" aria-label="' + MV.esc(U.rows[fm]) + '"></div></div>'; }).join("") +
    "</div>" +
    '<div class="ff-groups">' + C.groups.map(function(g){
      return '<section class="ff-g" data-g="' + g.id + '" aria-label="' + MV.esc(gname(g.id)) + '"><div class="ff-gh"><h3 class="ff-gt">' + gname(g.id) + '</h3><button type="button" class="btn sm ff-put" data-put="' + g.id + '" data-k="ffput' + g.id + '">' + F(U.put, [g.id]) + "</button></div>" +
        '<div class="ff-words"><span class="ff-lab">' + U.forms.words + "</span><p>" + g.words + "</p></div>" +
        '<div class="ff-slots">' + FORMS.map(function(fm){ return '<div class="ff-slot ff-slot-' + fm + '" data-slot="' + g.id + fm + '"><span class="ff-lab">' + U.forms[fm] + '</span><div class="ff-sh"><span class="ff-empty">' + U.empty + "</span></div></div>"; }).join("") + "</div>" +
        '<p class="tiny muted ff-wait"></p></section>';
    }).join("") + "</div>" +
    '<div class="ff-bar" id="ff-bar" hidden></div><div class="ff-one" id="ff-one"></div></div>';
  var root = $(".ff", host);
  MV.shuffle(C.cards, MV.meta.id + "ff").forEach(function(c){ $('[data-row="' + c.form + '"]', root).appendChild(EL[c.id]); });

  // ---- painting ----
  function paintCards(){
    var c = CH[S.cur], lv = live();
    C.cards.forEach(function(cd){
      var el = EL[cd.id], w = S.place[cd.id], on = S.sel === cd.id, here = !!w && c.type === "group" && w === c.wave;
      el.disabled = !lv || here; el.classList.toggle("used", !!w); el.classList.toggle("on", on); el.setAttribute("aria-pressed", String(on));
      $(".ff-badge", el).textContent = w ? "✓ " + F(U.inWave, [w]) : "";
      el.setAttribute("aria-label", MV.plain(cardAria(cd)) + (w ? " (" + F(U.inWave, [w]) + ")" : ""));
      if (w) { var sh = $('[data-slot="' + w + cd.form + '"] .ff-sh', root); if (!sh.querySelector(".ff-sface")) { sh.innerHTML = '<div class="ff-sface"></div>'; fillFace($(".ff-sface", sh), cd); } }
    });
    $$(".ff-g", root).forEach(function(sec){
      var g = sec.dataset.g, i = chOf(g), done = i >= 0 && solved(CH[i]), isCur = c.type === "group" && c.wave === g;
      sec.classList.toggle("cur", isCur && lv); sec.classList.toggle("done", done);
      var b = $(".ff-put", sec); b.disabled = !(isCur && lv); b.hidden = done;
      $(".ff-wait", sec).textContent = !done && !isCur && i >= 0 ? F(U.wait, [i + 1]) : "";
    });
  }
  function selSummary(id){
    var c = CARD[id];
    var w = S.place[id], tail = w ? " (" + F(U.inWave, [w]) + ")" : "";
    if (c.form === "eq") return c.t + tail;
    if (c.form === "table") return U.tableCard + " (" + c.rows.map(function(r){ return m("t") + " = " + num(r[0]) + ": " + num(r[1]); }).join(", ") + ")" + tail;
    return U.graphCard + " (" + graphDesc(c.p) + ")" + tail;
  }
  function fbBox(M){ return M.kind === "info" ? '<div class="fb" role="status"><p>' + M.html + "</p></div>" : MV.fbHTML(M.kind, M.html); }
  function paintBar(){
    var c = CH[S.cur], bar = $("#ff-bar", root), M = msg[c.id];
    bar.hidden = !live(); if (bar.hidden) return;
    MV.keepFocus(bar, function(){
      bar.innerHTML = '<div class="ff-brow"><p class="ff-bs">' + (S.sel ? "<strong>" + U.selected + "</strong> " + selSummary(S.sel) : '<span class="muted">' + U.none + "</span>") + "</p>" +
        '<button type="button" class="btn primary sm" data-put="' + c.wave + '" data-k="ffbarput"' + (S.sel ? "" : " disabled") + ">" + F(U.put, [c.wave]) + "</button></div>" + (M ? fbBox(M) : "");
    });
  }
  function paintChal(){
    var c = CH[S.cur], x = st(c), i = S.cur, box = $("#ff-chal", root), M = msg[c.id], h;
    var nf = x.first ? "" : ' <span class="muted">(not first try)</span>';
    h = '<div class="pred-top cv-top"><span class="tiny muted">' + F(U.chal, [i + 1, CH.length]) + '</span><span class="cv-tags"><span class="tag">' + c.id + '</span><span class="tag">' + modsLabel(c.topics) + "</span>" + (c.stretch ? '<span class="tag">Stretch</span>' : "") + "</span>" +
      '<span class="dots" aria-hidden="true">' + CH.map(function(q, kk){ return '<span class="dot' + (solved(q) ? " done" : "") + (kk === i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    if (c.type === "group") {
      h += '<div class="q-head"><div class="q-prompt">' + c.prompt + "</div></div>";
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ " + F(U.done, [c.wave]) + "</strong> " + c.why + nf);
      else h += '<p class="how">' + F(C.how, [c.wave]) + "</p>" + '<p class="tiny muted ff-cnt">' + FORMS.filter(function(fm){ return placedIn(c.wave, fm); }).length + " of 3 placed.</p>";
    } else if (c.type === "mc") {
      h += '<div class="ff-mc">' + MV.mcHTML(c, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, noConf:true }) + (x.solved && !x.first ? '<p class="tiny muted" style="margin:6px 0 0">(not first try)</p>' : "") + "</div>";
    } else {
      h += '<div class="q-head"><div class="q-prompt">' + c.prompt + '</div></div><div class="ff-per">' + C.groups.map(function(g){
        return '<div class="ff-pr"><span class="ff-pw">' + gname(g.id) + '</span><span class="chips" role="group" aria-label="' + MV.esc(gname(g.id)) + '">' + c.forms.map(function(fm){
          var on = x.picks[g.id] === fm.id;
          return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-pick="' + g.id + "|" + fm.id + '" data-k="ffp' + g.id + fm.id + '"' + (x.solved ? " disabled" : "") + ">" + fm.t + "</button>";
        }).join("") + "</span></div>";
      }).join("") + "</div>";
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + c.note + " " + c.periods + nf);
      else { h += '<div class="q-actions"><button type="button" class="btn primary sm" data-ff="check" data-k="ffchk">' + U.check + "</button></div>"; if (M) h += fbBox(M); }
    }
    h += '<div class="q-actions cv-nav"><button type="button" class="btn ghost sm" data-cv="prev" data-k="ffprev"' + (i === 0 ? " disabled" : "") + ">" + U.prev + '</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-cv="next" data-k="ffnext"' + (i === CH.length - 1 ? " disabled" : "") + ">" + U.next + "</button></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  var onePlot = null;
  function paintOne(){
    var el = $("#ff-one", root), n = CH.filter(solved).length, O = C.onePage;
    if (n < CH.length) { el.dataset.done = ""; onePlot = null; el.innerHTML = '<p class="tiny muted">' + F(U.progress, [n, CH.length]) + "</p>"; return; }
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var key = {}; O.key.forEach(function(q){ key[q.id] = q; });
    function notes(list){ return '<ul class="ff-notes">' + list.map(function(q){ return '<li class="ff-n ff-n-' + q[0] + '"><strong>' + key[q[0]].name + ":</strong> " + q[1] + "</li>"; }).join("") + "</ul>"; }
    var tA = C.cards.filter(function(c){ return c.form === "table" && waveOf(c.id) === "A"; })[0];
    var tbl = tableHTML(tA.rows, function(r){ return [r[0] === 0 ? "ff-h-start" : r[0] === 3 ? "ff-h-per" : "", r[1] === 4 || r[1] === -2 ? "ff-h-amp" : r[1] === 1 ? "ff-h-axis" : ""]; });
    var Cl = O.cells;
    el.innerHTML = "<h3>" + O.title + '</h3><p class="muted">' + O.intro + '</p><p class="ff-key">' + O.key.map(function(q){ return '<span class="ff-h ff-h-' + q.id + '">' + q.t + "</span>"; }).join(" ") + "</p>" +
      '<div class="ff-onegrid">' +
      '<div class="ff-oc"><h4>' + U.forms.eq + '</h4><p class="ff-oeq">' + Cl.eq.html + "</p>" + notes(Cl.eq.notes) + "</div>" +
      '<div class="ff-oc"><h4>' + U.forms.graph + '</h4><canvas class="plot wide" id="ff-anat" role="img" aria-label="' + MV.esc(MV.plain(O.aria)) + '"></canvas>' + notes(Cl.graph.notes) + "</div>" +
      '<div class="ff-oc"><h4>' + U.forms.table + '</h4><div class="ff-otb">' + tbl + "</div>" + notes(Cl.table.notes) + "</div>" +
      '<div class="ff-oc"><h4>' + U.forms.words + '</h4><p class="ff-ow">' + Cl.words.html + "</p>" + notes(Cl.words.notes) + "</div></div>";
    onePlot = new MV.Plot($("#ff-anat", el), { xmin:0, xmax:1, ymin:0, ymax:1 });
    onePlot.render = function(){
      onePlot.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:MV.plain(O.aria), after:function(ctx){
        var p = onePlot, M = tideMap(p.W, p.H, { L:Math.max(26, p.W * 0.06) }), f = function(t){ return 3 * Math.sin(PI * t / 6) + 1; };
        tideFrame(ctx, p, M, { names:[["time (h)", "height (m)", 1, true]] });
        tideMarks(ctx, p, M, 1, { axisT:toks("h = 1", css("--p-c")) });
        path(ctx, curvePx(f, TV.x0, TV.x1, M.X, M.Y), css("--pen"), 3.2);
        ring(ctx, M.X(0), M.Y(1));
        drawToks(ctx, p, [{ t:"start", c:css("--ink") }], M.X(0) + 12, M.Y(1) + 16, { size:13 });
      } });
    };
    onePlot.render();
  }
  function paintAll(){ paintChal(); paintCards(); paintBar(); paintOne(); }

  // ---- judging ----
  function bad(t){ return { kind:"bad", html:"<strong>✗ Not quite.</strong> " + t + " Try another card." }; }
  function put(w){
    var c = CH[S.cur], x = st(c);
    if (c.type !== "group" || x.solved || w !== c.wave) return;
    if (!S.sel) { msg[c.id] = { kind:"info", html:F(U.pick, [w]) }; return; }
    var id = S.sel, cd = CARD[id]; S.sel = null;
    if (waveOf(id) === w) {
      S.place[id] = w;
      var n = FORMS.filter(function(fm){ return placedIn(w, fm); }).length;
      if (n >= 3) { x.solved = true; x.first = x.tries === 0; msg[c.id] = null; }
      else msg[c.id] = { kind:"good", html:"<strong>✓ " + F(U.placed, [w, n]) + "</strong>" };
    } else { x.tries++; msg[c.id] = bad((c.fb || {})[id] || C.def[cd.form]); }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var c = CH[S.cur], x = st(c);
    if (b.dataset.cv) {
      S.cur = clamp(S.cur + (b.dataset.cv === "next" ? 1 : -1), 0, CH.length - 1); S.sel = null;
      api.save(); paintAll();
      var nb = host.querySelector('[data-cv="' + b.dataset.cv + '"]'); if (nb && !nb.disabled) nb.focus({ preventScroll:true });
      return;
    }
    if (b.dataset.card) { S.sel = S.sel === b.dataset.card ? null : b.dataset.card; msg[c.id] = null; api.save(); paintCards(); paintBar(); return; }
    if (b.dataset.put) {
      put(b.dataset.put); api.save(); paintAll();
      if (x.solved) { var bx = $("#ff-chal", root); scrollTo(bx); MV.focusFb(bx); } else MV.focusFb($("#ff-bar", root));
      return;
    }
    if (c.type === "mc") {
      if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; api.save(); paintChal(); return; }
      if (b.dataset.act === "check" && x.choice != null) {
        x.checked = true;
        if (MV.ok(c.options[x.choice])) { x.solved = true; x.first = x.tries === 0; } else x.tries++;
        api.save(); paintAll(); MV.focusFb($("#ff-chal", root));
      }
      return;
    }
    if (b.dataset.pick) { var pk = b.dataset.pick.split("|"); x.picks[pk[0]] = pk[1]; msg[c.id] = null; api.save(); paintChal(); return; }
    if (b.dataset.ff === "check") {
      if (C.groups.every(function(g){ return x.picks[g.id]; })) { x.solved = true; x.first = x.tries === 0; msg[c.id] = null; }
      else msg[c.id] = { kind:"info", html:U.needAll };
      api.save(); paintAll(); MV.focusFb($("#ff-chal", root));
    }
  });
  paintAll();
  CN = { repaint:function(){ PLOTS.forEach(function(pl){ pl.render(); }); if (onePlot) onePlot.render(); } };

  // Register with the activity list so the summary and "skills to review" include Connect.
  MV.ACTS.connect = { a:{ id:"connect", title:C.summary },
    stats:function(){ var f = 0, d = 0; CH.forEach(function(c){ var y = S.ch[c.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:CH.length, done:d, line:C.summary + " (first try): " + f + "/" + CH.length + (d < CH.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; CH.forEach(function(c){ var y = S.ch[c.id]; if (y && y.tries > 0) g = g.concat(MV.goalIdx(c.goal)); }); return g; } };
  return {};
}

// ---------- Mixed practice: choice (retry), number entry (N4), select-all on the 0-to-2π strip (N7, from MHF4U 34) ----------
var STRIP = [0, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24];
var GENERAL = "Check your work, or use a hint.";
function stripBtns(sel, key, o){
  o = o || {};
  return '<div class="mx-sb" role="group" aria-label="Angles from 0 to 2π">' + STRIP.map(function(t){
    var on = sel.indexOf(t) >= 0, bad = o.bad && o.bad.indexOf(t) >= 0;
    return '<button type="button" class="mx-a' + (on ? " on" : "") + (bad ? " bad" : "") + '" aria-pressed="' + on + '" data-t="' + t + '" data-k="' + key + t + '" aria-label="' + angT(t) + (bad ? ", doesn’t fit" : "") + '"' + (o.off ? " disabled" : "") + ">" + m(angS(t, true)) + "</button>";
  }).join("") + "</div>";
}
function mixed(host, api, a){
  var S = api.S; S.items = S.items || {};
  var items = a.items, msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  function tags(it){ return '<span class="tags"><span class="tag">' + MV.topicLabel(it.topic) + "</span>" + (it.star ? '<span class="tag">★ Challenge</span>' : "") + "</span>"; }
  function head(it, i){ return '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + tags(it) + "</div>"; }
  function box(it){ return host.querySelector('[data-mx="' + it.id + '"]'); }
  function feedback(it, x){
    if (x.solved) return MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    var M = msgs[it.id]; if (!M) return "";
    return M.bad ? MV.fbHTML("bad", M.html) : '<div class="fb" role="status"><p>' + M.html + "</p></div>";
  }
  function actions(it, x){ return x.solved ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.kind === "strip" ? '<button type="button" class="btn ghost sm" data-act="clear" data-k="' + it.id + 'clr">Clear</button>' : "") + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint); }
  function inp(it, x){
    var id = "mxn-" + it.id, im = it.keypad === "decimal" ? "decimal" : "text";
    return '<label class="mx-lab" for="' + id + '">' + (it.label || "Your answer:") + '</label><span class="mx-cell"><input class="numin short" id="' + id + '" data-mxn="' + it.id + '" type="text" inputmode="' + im + '" autocomplete="off" value="' + MV.esc(x.val || "") + '"' + (x.solved ? " disabled" : "") + ">" +
      (it.unit ? '<span class="mx-unit">' + it.unit + "</span>" : "") + "</span>";
  }
  host.innerHTML = items.map(function(it){ return '<div class="q mx-q" data-mx="' + it.id + '"></div>'; }).join("") + '<div class="mx-sum" aria-live="polite"></div>';
  function paint(it){
    var i = items.indexOf(it), x = ist(it.id), el = box(it);
    if (it.kind === "mc") {
      MV.keepFocus(el, function(){
        el.innerHTML = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:MV.topicLabel(it.topic) + (it.star ? '</span><span class="tag">★ Challenge' : "") }) +
          (x.solved && !x.first ? '<p class="tiny muted" style="margin:6px 0 0">(not first try)</p>' : "");
      });
    } else if (it.kind === "strip") {
      var sel = x.sel || [];
      MV.keepFocus(el, function(){
        el.innerHTML = head(it, i) + '<p class="how">Tap every angle that fits (tap again to remove it), then press Check.</p>' + stripBtns(sel, "mx" + it.id, { bad:x.bad, off:x.solved }) +
          '<p class="mx-yours" aria-live="polite"><strong>Your angles:</strong> ' + (sel.length ? sel.slice().sort(function(p, q){ return p - q; }).map(function(k){ return m(angS(k)); }).join(", ") : '<span class="muted">none yet</span>') + "</p>" +
          actions(it, x) + '<div class="mx-fb">' + feedback(it, x) + "</div>";
      });
    } else {
      MV.keepFocus(el, function(){ el.innerHTML = head(it, i) + '<div class="numrow">' + inp(it, x) + "</div>" + actions(it, x) + '<div class="mx-fb">' + feedback(it, x) + "</div>"; });
    }
    paintSum();
  }
  function paintSum(){
    var el = $(".mx-sum", host), done = items.filter(function(it){ return ist(it.id).solved; }).length;
    if (done < items.length) { el.innerHTML = '<p class="tiny muted">' + done + " of " + items.length + " done. Your first-try table by module appears when all " + items.length + " are done.</p>"; return; }
    var rows = TOPICS.map(function(t){ var its = items.filter(function(it){ return it.topic === t; }); return { t:t, n:its.length, r:its.filter(function(it){ return ist(it.id).first; }).length }; }).filter(function(o){ return o.n; });
    el.innerHTML = '<div class="part"><h3>Your first tries by module</h3>' + topicTable(rows, "First try", "Mixed practice first tries by module") + "</div>";
  }
  function bad(text){ return { bad:true, html:"<strong>✗ Not quite.</strong> " + text + " Try again." }; }
  function judge(it, x){
    var ans = MV.ans(it);
    if (it.kind === "num") {
      var raw = String(x.val || "").replace(/\bh\b|hours?|solutions?/gi, "").trim(), v = MV.parseNum(raw);
      if (!v || v.length !== 1) return { msg:{ bad:false, html:"Enter a number, such as 12 or 3.5." } };
      if (near(v[0], ans, 1e-6)) return { ok:true };
      var w = (it.wrong || []).filter(function(q){ return near(v[0], q.match, 1e-6); })[0];
      return { msg:bad(w ? w.fb : (it.general || GENERAL)) };
    }
    var sel = x.sel || [];
    if (!sel.length) return { msg:{ bad:false, html:"Tap at least one angle first." } };
    if (sameSet(sel, ans)) return { ok:true };
    x.bad = sel.filter(function(k){ return ans.indexOf(k) < 0; });
    var rules = it.rules || [];
    for (var r = 0; r < rules.length; r++) {
      var R = rules[r];
      if (R.set && sameSet(R.set, sel)) return { msg:bad(R.fb) };
      if (R.any && R.any.some(function(k){ return sel.indexOf(k) >= 0; })) return { msg:bad(R.fb) };
    }
    if (it.general) return { msg:bad(it.general) };
    if (!x.bad.length) return { msg:bad("Every angle you chose fits, but there’s at least one more.") };
    return { msg:bad("The angles marked in red don’t fit. Check each one again.") };
  }
  host.addEventListener("input", function(e){ var t = e.target, id = t.dataset && t.dataset.mxn; if (!id) return; ist(id).val = t.value; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.mxn) return;
    var b = host.querySelector('[data-k="' + e.target.dataset.mxn + 'chk"]'); if (b) { e.preventDefault(); b.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-mx]"); if (!el) return;
    var it = items.filter(function(q){ return q.id === el.dataset.mx; })[0], x = ist(it.id);
    if (b.dataset.t != null) {
      var t = +b.dataset.t; x.sel = x.sel || []; var j = x.sel.indexOf(t); if (j < 0) x.sel.push(t); else x.sel.splice(j, 1);
      x.bad = (x.bad || []).filter(function(q){ return x.sel.indexOf(q) >= 0; }); msgs[it.id] = null; api.save(); paint(it); return;
    }
    if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; api.save(); paint(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, (x.hint || 0) + 1); api.save(); paint(it); return; }
    if (b.dataset.act === "clear") { x.sel = []; x.bad = []; msgs[it.id] = null; api.save(); paint(it); return; }
    if (b.dataset.act !== "check") return;
    if (it.kind === "mc") {
      if (x.choice == null) return;
      x.checked = true;
      if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else {
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.bad = []; msgs[it.id] = null; }
      else { if (r.msg.bad) x.tries++; msgs[it.id] = r.msg; }
    }
    api.save(); paint(it); MV.focusFb(el);
  });
  items.forEach(paint);
  return {
    stats:function(){ var f = 0, d = 0; items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + items.length + (d < items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: many equations, one wave ----------
// @component N9 stepSlider (copied from MHF4U 32) — slider over a list of positions with 40 px − / + buttons, Page Up/Down
// steps and a formatted, parameter-coloured value label
function stepSlider(host, o){
  host.innerHTML = '<div class="ww-sl" style="--sc:var(' + o.color + ')"><div class="ww-sl-top"><label for="ww-' + o.id + '-in">' + o.label + '</label><output id="ww-' + o.id + '-o" for="ww-' + o.id + '-in"></output></div>' +
    '<div class="ww-sl-row"><button type="button" class="btn ghost ww-pm" data-pm="-1" data-k="ww' + o.id + 'm" aria-label="Decrease ' + o.name + '">' + MINUS + '</button><input type="range" id="ww-' + o.id + '-in" min="0" max="' + (o.n - 1) + '" step="1">' +
    '<button type="button" class="btn ghost ww-pm" data-pm="1" data-k="ww' + o.id + 'p" aria-label="Increase ' + o.name + '">+</button></div></div>';
  var inp = host.querySelector("input"), out = host.querySelector("output"), btns = host.querySelectorAll("[data-pm]"), cur = o.idx;
  function paint(){ inp.value = cur; out.innerHTML = o.fmt(cur); inp.setAttribute("aria-valuetext", o.say(cur)); btns[0].disabled = cur <= 0; btns[1].disabled = cur >= o.n - 1; }
  function go(i){ i = clamp(i, 0, o.n - 1); if (i === cur) return; cur = i; paint(); o.onChange(cur); }
  inp.addEventListener("input", function(){ cur = +inp.value; paint(); o.onChange(cur); });
  inp.addEventListener("keydown", function(e){ if (e.key === "PageUp" || e.key === "PageDown") { e.preventDefault(); go(cur + (e.key === "PageUp" ? 1 : -1) * (o.page || 1)); } });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pm]"); if (!b || b.disabled) return; go(cur + +b.dataset.pm); });
  paint();
  return { set:function(i){ cur = i; paint(); }, get:function(){ return cur; } };
}
var AV = [], CV = [], JV = [], KV = [[-4, 1], [-3, 1], [-2, 1], [-3, 2], [-1, 1], [-1, 2], [1, 2], [1, 1], [3, 2], [2, 1], [3, 1], [4, 1]];
(function(){ for (var i = -10; i <= 10; i++) { if (i) AV.push(i / 2); CV.push(i / 2); } for (var j = -12; j <= 12; j++) JV.push(j); })();
function piTicks(labelEvery, gridEvery){ return { step:gridEvery * PI, fmt:function(t){ var q = t / PI / labelEvery; return near(q, Math.round(q), 1e-6) ? MV.piLabel(t) : ""; } }; }
var task = (function(){
  var api, plot, T, U;
  function P(){ var S = api ? api.S : {}; return { a:AV[S.ia], kn:KV[S.ik][0], kd:KV[S.ik][1], j:JV[S.ij], c:CV[S.ic] }; }
  function kv(p){ return p.kn / p.kd; }
  function fx(p){ var k = kv(p), d = p.j * PI / 12; return function(x){ return p.a * Math.sin(k * (x - d)) + p.c; }; }
  function dec(v){ return String(v); }
  // y = a sin[k(x − d)] + c as an m() source (col: parameter colours)
  function eqSrc(p, col, st){
    var A = p.a, K = function(t){ return col ? "@k{" + t + "}" : t; }, s = "y = ";
    s += A === 1 ? "" : A === -1 ? (col ? "@a{-}" : "-") : (col ? "@a{" + dec(A) + "}" : dec(A)) + " ";
    s += "sin";
    var one = p.kn === p.kd, neg = p.kn === -p.kd;
    if (!p.j) {
      if (one) s += " x";
      else if (p.kd === 1 && p.kn > 0) s += " " + K(String(p.kn)) + "x";
      else s += "(" + K(neg ? "-" : ratS(p.kn, p.kd, st)) + "x)";
    } else {
      var ds = angS(Math.abs(p.j), st), inner = "x " + (p.j > 0 ? "- " : "+ ") + (col ? "@d{" + ds + "}" : ds);
      s += one ? "(" + inner + ")" : "[" + K(neg ? "-" : ratS(p.kn, p.kd, st)) + "(" + inner + ")]";
    }
    if (p.c) s += (p.c > 0 ? " + " : " - ") + (col ? "@c{" + dec(Math.abs(p.c)) + "}" : dec(Math.abs(p.c)));
    return s;
  }
  function perSrc(p){ return piQ(2 * p.kd, Math.abs(p.kn), true); }
  function valT(v){ return near(v * 4, Math.round(v * 4), 1e-9) ? "= " + num(Math.round(v * 4) / 4) : "≈ " + num(v, 2); }
  function read(){ var p = P(); p.valid = true; return p; }
  function checks(p){ var A = Math.abs(p.a), k = Math.abs(kv(p)); return [near(p.c + A, 5) && near(p.c - A, -1), near(TAU / k, PI), near(fx(p)(PI / 4), 5, 1e-9)]; }
  function draw(){
    var p = P(), A = Math.abs(p.a), wide = p.c + A > 6 || p.c - A < -6, V = { xmin:-PI / 2, xmax:TAU, ymin:wide ? -10.5 : -6.5, ymax:wide ? 10.5 : 6.5 };
    var ph = plot.c.getBoundingClientRect().width < 420, f = fx(p), v4 = f(PI / 4);
    plot.draw({ view:V, xTicks:piTicks(ph ? 1 : 0.5, 0.25), yTicks:{ step:1, fmt:function(t){ return (wide || ph) && Math.round(t) % 2 ? "" : num(t); } },
      describe:"Wave tuner preview of " + MV.plain(m(eqSrc(p))) + ", with dashed guide lines at y = 5 and y = −1 and a ring at (π/4, 5). At x = π/4 the wave is at y " + valT(v4) + ".",
      after:function(ctx, pp){
        var ink2 = css("--ink-2"), ink = css("--ink");
        [5, -1].forEach(function(y){ line(ctx, 0, pp.Y(y), pp.W, pp.Y(y), ink2, 1.6, [6, 5]); drawToks(ctx, pp, toks("y = " + y, ink2), pp.W - 6, pp.Y(y) + (y > 0 ? -11 : 11), { align:"right", size:12 }); });
        pp.curve({ f:f, color:css("--pen"), width:3 });
        pp.point({ x:PI / 4, y:5, r:8, open:true, color:ink });
        pp.point({ x:PI / 4, y:v4, r:4.5, color:ink });
      } });
  }
  function readout(){
    var p = P(), A = Math.abs(p.a), R = U.rows;
    $("#ww-eq").innerHTML = m(eqSrc(p, true, true));
    $("#ww-read").innerHTML = MV.readoutHTML([[R.mm, num(p.c + A) + " and " + num(p.c - A)], [R.per, m(perSrc(p))], [R.val, valT(fx(p)(PI / 4))]]);
  }
  function key(p){ return [p.a, p.kn + "/" + p.kd, p.j, p.c].join("|"); }
  function unkey(k){ var q = String(k).split("|"), kk = q[1].split("/"); return { a:+q[0], kn:+kk[0], kd:+kk[1], j:+q[2], c:+q[3] }; }
  function text(k){ return MV.plain(m(eqSrc(unkey(k)))); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; U = T.ui; var S = a.S;
      if (S.ia == null) S.ia = AV.indexOf(1); if (S.ik == null) S.ik = 7; if (S.ij == null) S.ij = 12; if (S.ic == null) S.ic = CV.indexOf(0);
      inp.innerHTML = '<p class="tiny muted ww-how">' + U.how + '</p><div class="ww-sls"><div id="ww-a"></div><div id="ww-k"></div><div id="ww-d"></div><div id="ww-c"></div></div>';
      pv.innerHTML = '<h4 class="ww-h">' + U.tuner + '</h4><p class="ww-eq" id="ww-eq" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot" id="ww-plot" role="img" aria-label="Wave tuner preview"></canvas></div><dl class="read" id="ww-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#ww-plot"), { xmin:-PI / 2, xmax:TAU, ymin:-6.5, ymax:6.5 }); plot.render = draw;
      function changed(){ a.save(); draw(); readout(); a.update(); }
      stepSlider($("#ww-a"), { id:"a", name:"a", label:m("@a{a}"), color:"--acol", n:AV.length, idx:S.ia, page:2, fmt:function(i){ return m("@a{" + dec(AV[i]) + "}"); }, say:function(i){ return "a = " + num(AV[i]); }, onChange:function(i){ S.ia = i; changed(); } });
      stepSlider($("#ww-k"), { id:"k", name:"k", label:m("@k{k}"), color:"--p-k", n:KV.length, idx:S.ik, page:2, fmt:function(i){ return m("@k{" + ratS(KV[i][0], KV[i][1], true) + "}"); }, say:function(i){ return "k = " + ratS(KV[i][0], KV[i][1]).replace("-", MINUS); }, onChange:function(i){ S.ik = i; changed(); } });
      stepSlider($("#ww-d"), { id:"d", name:"d", label:m("@d{d}"), color:"--p-d", n:JV.length, idx:S.ij, page:3, fmt:function(i){ return m("@d{" + angS(JV[i], true) + "}"); }, say:function(i){ return "d = " + angT(JV[i]); }, onChange:function(i){ S.ij = i; changed(); } });
      stepSlider($("#ww-c"), { id:"c", name:"c", label:m("@c{c}"), color:"--p-c", n:CV.length, idx:S.ic, page:2, fmt:function(i){ return m("@c{" + dec(CV[i]) + "}"); }, say:function(i){ return "c = " + num(CV[i]); }, onChange:function(i){ S.ic = i; changed(); } });
      draw(); readout();
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    tips:function(p, res){
      var out = [], A = Math.abs(p.a);
      if (!res[0]) out.push(fill(T.tipNow[0], { mx:num(p.c + A), mn:num(p.c - A) }) + " " + T.tips[0]);
      if (!res[1]) out.push(fill(T.tipNow[1], { p:m(perSrc(p)) }) + " " + T.tips[1]);
      if (!res[2]) out.push(fill(T.tipNow[2], { v:valT(fx(p)(PI / 4)) }) + (res[0] && res[1] ? " " + T.tips[2] : ""));
      return out;
    },
    key:key,
    label:function(k){ return m(eqSrc(unkey(k), false, true)); },
    text:text,
    summary:function(ts){ var T0 = MV.C.task, n = ts.found.length; return [(T0.summary || T0.title) + ": " + (n >= 3 ? "solved (" + ts.found.map(text).join("; ") + ")" : "not solved yet" + (n ? " (" + n + " of 3 equations: " + ts.found.map(text).join("; ") + ")" : ""))]; },
    repaint:function(){ if (plot) plot.render(); }
  };
})();

MV.module({
  hero:hero,
  connect:connect,
  activities:{ mx:mixed },
  task:task,
  onShow:function(v){
    if (v === "connect" && CN) CN.repaint();
    if (v === "final-check") task.repaint();
  }
});
})();
