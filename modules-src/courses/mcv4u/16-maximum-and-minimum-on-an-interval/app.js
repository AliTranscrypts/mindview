// MCV4U 16 Maximum and Minimum on an Interval: hero (F1 between walls at −2 and 5; candidates pulse; the tie glows),
// Closed-interval hunter (Explore: draggable walls, Show / Hunt / Open modes, candidate table, V8 □√□ box for TC3),
// Extreme values in context (Part 3: V10 shapeStage — a timeline scrubber drives a greenhouse or a dose figure beside the
// objective graph — plus candidate card decks), Candidate table (Practice 1, V8 value and location boxes) and the
// "Design the window" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q, rpow = MV.mcv.rpow;

function m(s){ return MV.m(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function onGrid(x, step){ return Math.abs(x / step - Math.round(x / step)) < 1e-9; }
function xs(x){ return onGrid(x, 0.5) ? num(x, 2) : "≈ " + num(x, 2); }      // an x-value, true minus
function xsrc(x){ return onGrid(x, 0.5) ? String(+x.toFixed(2)) : "≈" + x.toFixed(2); }
function sgnTxt(v){ return (v < 0 ? MINUS : "") + Math.abs(v); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function forL(html, L){ return L === "f" ? html : String(html).replace(/<i>f<\/i>/g, "<i>" + L + "</i>"); }
function andList(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function pEval(p, x){ var v = 0; for (var i = p.length - 1; i >= 0; i--) v = v * x + p[i]; return v; }
function pEvalQ(p, q){ var v = Q.of(0); for (var i = p.length - 1; i >= 0; i--) v = Q.add(Q.mul(v, q), Q.of(p[i])); return v; }

// =====================================================================================================================
// @component intervalExtrema — the closed-interval method as an engine (MCV4U 16; reused by 17, 18, 21, 28): candidates of f on
// [a, b] are the endpoints and the critical numbers strictly inside (a critical number on a wall counts as the endpoint); exact
// values where possible; the absolute max and min with every tied location. Open intervals drop the endpoints and report
// "none" (with the value approached) when an extreme would sit at an open end.
//   FN[id] = {L (letter), poly (lowest power first) | cusp, crit:[[x, "zero"|"dne"]], lo, hi, step, w (default walls), base:[y0, y1], src}
//   valOf(F, x) -> {v, html, txt};  analyze(F, a, b, open) -> {cands, ends, inside, outside, wall, max:{none, v, xs, sup}, min}
var FN = {
  F1:{ L:"f", poly:[5, -9, -3, 1], crit:[[-1, "zero"], [3, "zero"]], lo:-4, hi:6, step:0.5, w:[-2, 5], base:[-30, 20], src:"f(x) = x^3 - 3x^2 - 9x + 5" },
  F2:{ L:"f", poly:[3, 0, -8, 0, 1], crit:[[-2, "zero"], [0, "zero"], [2, "zero"]], lo:-4, hi:6, step:0.5, w:[-1, 3], base:[-16, 8], src:"f(x) = x^4 - 8x^2 + 3" },
  F3:{ L:"f", poly:[0, -12, 0, 1], crit:[[-2, "zero"], [2, "zero"]], lo:-4, hi:6, step:0.5, w:[-1, 3], base:[-20, 20], src:"f(x) = x^3 - 12x" },
  F4:{ L:"f", cusp:true, crit:[[1, "dne"]], lo:-8, hi:10, step:1, w:[-2, 4], base:[-0.8, 4.8], src:"f(x) = (x - 1)^{2/3}" },
  G:{ L:"g", poly:[0, -4, 1], crit:[[2, "zero"]], lo:-4, hi:6, step:0.5, w:[0, 3], base:[-5, 5], src:"g(x) = x^2 - 4x" }
};
function fx(F, x){ return F.cusp ? rpow(x - 1, 2, 3) : pEval(F.poly, x); }
function valOf(F, x){
  if (F.cusp) {
    var n = Math.abs(x - 1), v = rpow(x - 1, 2, 3);
    if (n < 1e-9) return { v:0, html:"0", txt:"0" };
    if (onGrid(n, 1)) {
      var kf = MV.mcv.kfree(Math.round(n) * Math.round(n), 3);
      if (kf[1] === 1) return { v:kf[0], html:num(kf[0]), txt:num(kf[0]) };
      var src = (kf[0] > 1 ? kf[0] : "") + "∛" + kf[1];
      return { v:v, html:m(src) + " ≈ " + num(v, 2), txt:MV.plain(m(src)) + " ≈ " + num(v, 2) };
    }
    return { v:v, html:"≈ " + num(v, 2), txt:"≈ " + num(v, 2) };
  }
  if (onGrid(x, 0.5)) { var q = pEvalQ(F.poly, Q.of(Math.round(2 * x), 2)), qv = Q.val(q); return { v:qv, html:num(qv, 4), txt:num(qv, 4) }; }
  var w = pEval(F.poly, x); return { v:w, html:"≈ " + num(w, 2), txt:"≈ " + num(w, 2) };
}
function same(u, v){ return Math.abs(u - v) <= 1e-9 * Math.max(1, Math.abs(u)); }
function extreme(list, dir){
  if (!list.length) return null;
  var best = list[0].val.v;
  list.forEach(function(c){ if (dir * (c.val.v - best) > 0 && !same(c.val.v, best)) best = c.val.v; });
  var at = list.filter(function(c){ return same(c.val.v, best); });
  return { v:best, val:at[0].val, xs:at.map(function(c){ return c.x; }) };
}
function analyze(F, a, b, open){
  var R = { a:a, b:b, open:open, inside:[], outside:[], wall:[], cands:[], ends:[] };
  F.crit.forEach(function(c){
    var o = { x:c[0], kind:c[1] };
    if (c[0] > a + 1e-9 && c[0] < b - 1e-9) R.inside.push(o); else if (near(c[0], a) || near(c[0], b)) R.wall.push(o); else R.outside.push(o);
  });
  R.ends = [{ x:a, role:"end", val:valOf(F, a) }, { x:b, role:"end", val:valOf(F, b) }];
  if (!open) R.cands = R.cands.concat(R.ends);
  R.inside.forEach(function(c){ R.cands.push({ x:c.x, role:"crit", kind:c.kind, val:valOf(F, c.x) }); });
  R.cands.sort(function(p, q){ return p.x - q.x; });
  [["max", 1], ["min", -1]].forEach(function(z){
    var k = z[0], d = z[1], e = extreme(R.cands, d);
    if (!open) { R[k] = e; return; }
    var ee = extreme(R.ends, d);
    if (e && (d * (e.v - ee.v) > 0 || same(e.v, ee.v))) R[k] = e;
    else R[k] = { none:true, v:ee.v, val:ee.val, xs:[] };
  });
  return R;
}
// ------------------------------------------------- end of intervalExtrema --------------------------------------------------

function locHTML(L, xsArr){ return "at " + andList(xsArr.map(function(x){ return m(L === "t" ? "t = " + xsrc(x) : "x = " + xsrc(x)); })); }
// y-range that shows the base window and every value at the candidates (and the endpoints) — auto-scales with the walls
function autoY(F, R, extra){
  var ys = [F.base[0], F.base[1]];
  R.ends.concat(R.cands).forEach(function(c){ ys.push(c.val.v); });
  (extra || []).forEach(function(y){ if (isFinite(y)) ys.push(y); });
  var lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys), pad = (hi - lo) * 0.09;
  return [lo - pad, hi + pad];
}
function xView(F){ var p = F.step === 1 ? 0.8 : 0.6; return [F.lo - p, F.hi + p]; }
// candidate table (N14 layout) with a type column and a result column (colour is never the only signal)
function candTable(F, R, rows, tags, win){
  var L = F.L;
  var h = '<div class="tbl-wrap mm-tw"><table class="vt mm-tbl"><thead><tr><th scope="col">' + m("x") + '</th><th scope="col">' + m(L + "(x)") + "</th>" +
    (tags ? '<th scope="col">type</th>' : "") + (win ? '<th scope="col">result</th>' : "") + "</tr></thead><tbody>";
  rows.forEach(function(c){
    var isMax = win && R.max && !R.max.none && c.cand && R.max.xs.some(function(x){ return near(x, c.x); });
    var isMin = win && R.min && !R.min.none && c.cand && R.min.xs.some(function(x){ return near(x, c.x); });
    var res = isMax && isMin ? "max, min" : isMax ? "abs max" : isMin ? "abs min" : "";
    h += "<tr" + (c.excl ? ' class="mm-excl"' : "") + "><td" + (res ? ' class="hl"' : "") + ">" + m(xsrc(c.x)) + "</td><td" + (res ? ' class="hl"' : "") + ">" + c.val.html + "</td>" +
      (tags ? '<td class="mm-tag">' + (c.tag || "") + "</td>" : "") + (win ? '<td class="mm-res' + (res ? " hl" : "") + '">' + res + "</td>" : "") + "</tr>";
  });
  return h + "</tbody></table></div>";
}

// ---------- hero: F1 draws; walls slide in at −2 and 5; candidates pulse in turn; the two 10s glow together ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var F = FN.F1, V = { xmin:-3.3, xmax:6.3, ymin:-28, ymax:17 }, p = new MV.Plot(cv, V), tab = $("#mm-htab");
  var C4 = [-2, -1, 3, 5], ORDER = [-1, 3, -2, 5];
  var st = { draw:1, wa:-2, wb:5, wall:true, fade:1, shown:{ "-2":1, "-1":1, "3":1, "5":1 }, pulse:null, amp:0, glow:true };
  if (tab) tab.innerHTML = C4.map(function(x){ return '<span class="mm-hc" data-x="' + x + '">' + m(String(x)) + ' <span class="mm-ar">→</span> ' + num(fx(F, x)) + "</span>"; }).join("");
  function cells(){ if (!tab) return; $$(".mm-hc", tab).forEach(function(c){ var x = c.dataset.x; c.classList.toggle("on", !!st.shown[x]); c.classList.toggle("glow", st.glow && (x === "-1" || x === "5")); }); }
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), xr = V.xmin + (V.xmax - V.xmin) * st.draw;
    var sc = { view:V, xLabel:"x", yLabel:"y", curves:[], segments:[], points:[], labels:[] };
    var fo = function(x){ return fx(F, x); };
    sc.curves.push({ f:fo, color:pen, width:3, alpha:1 - 0.75 * st.fade, domain:[V.xmin, xr] });
    if (st.wall) {
      sc.curves.push({ f:fo, color:pen, width:3, domain:[Math.max(st.wa, V.xmin), Math.min(st.wb, xr)] });
      [st.wa, st.wb].forEach(function(x){ sc.segments.push({ x1:x, y1:V.ymin, x2:x, y2:V.ymax, color:ink2, width:2, dash:[7, 6] }); });
    }
    if (st.glow) {
      sc.segments.push({ x1:V.xmin, y1:10, x2:V.xmax, y2:10, color:ink2, width:1.4, dash:[3, 5] });
      sc.labels.push({ x:V.xmax, y:10, text:"max 10", align:"right", dx:-6, dy:-12, bg:true, font:ui(12) });
    }
    C4.forEach(function(x){
      if (!st.shown[x]) return;
      var end = x === -2 || x === 5;
      sc.points.push({ x:x, y:fx(F, x), r:6, color:end ? ink : pen, ring:st.glow && (x === -1 || x === 5) });
    });
    sc.after = function(ctx, pl){
      if (st.pulse == null || !st.amp) return;
      ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3; ctx.beginPath();
      ctx.arc(pl.X(st.pulse), pl.Y(fx(F, st.pulse)), 8 + 10 * st.amp, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    };
    sc.describe = "Graph of f(x) = x³ − 3x² − 9x + 5 between walls at x = −2 and x = 5. Candidates: f(−2) = 3, f(−1) = 10, f(3) = −22, f(5) = 10. Tie: the maximum value 10 occurs twice, at x = −1 and x = 5.";
    p.draw(sc); cells();
  }
  p.render = draw;
  function finish(){ st = { draw:1, wa:-2, wb:5, wall:true, fade:1, shown:{ "-2":1, "-1":1, "3":1, "5":1 }, pulse:null, amp:0, glow:true }; if (f.cap) f.cap.textContent = "Tie: the maximum value 10 occurs twice."; draw(); }
  if (MV.reduceMotion) { finish(); return; }
  st = { draw:0, wa:V.xmin, wb:V.xmax, wall:false, fade:0, shown:{}, pulse:null, amp:0, glow:false };
  if (f.cap) f.cap.textContent = "";
  draw();
  function pulseNext(i){
    if (i >= ORDER.length) { MV.wait(400, function(){ st.glow = true; st.pulse = null; if (f.cap) f.cap.textContent = "Tie: the maximum value 10 occurs twice."; draw(); }); return; }
    var x = ORDER[i]; st.shown[x] = 1; st.pulse = x;
    MV.tween({ dur:650, ease:function(t){ return t; }, step:function(t){ st.amp = Math.sin(Math.PI * t); draw(); }, done:function(){ st.amp = 0; draw(); MV.wait(150, function(){ pulseNext(i + 1); }); } });
  }
  MV.wait(400, function(){
    MV.tween({ dur:1300, ease:function(t){ return t; }, step:function(t){ st.draw = t; draw(); }, done:function(){
      st.wall = true;
      MV.wait(250, function(){
        MV.tween({ dur:1000, step:function(t){ st.wa = V.xmin + (-2 - V.xmin) * t; st.wb = V.xmax + (5 - V.xmax) * t; st.fade = t; draw(); }, done:function(){
          st.wa = -2; st.wb = 5; st.fade = 1; draw(); MV.wait(350, function(){ pulseNext(0); });
        } });
      });
    } });
  });
}

// ---------- Explore: Closed-interval hunter ----------
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (!FN[S.fn]) S.fn = "F1";
  if (["show", "hunt", "open"].indexOf(S.mode) < 0) S.mode = "show";
  S.w = S.w || {};
  Object.keys(FN).forEach(function(k){
    var F = FN[k], w = S.w[k];
    if (!Array.isArray(w) || w.length !== 2 || !onGrid(w[0], F.step) || !onGrid(w[1], F.step) || w[0] < F.lo || w[1] > F.hi || w[0] >= w[1]) S.w[k] = F.w.slice();
  });
  S.hunt = S.hunt && Array.isArray(S.hunt.sel) ? S.hunt : { sel:[] };
  S.tc3 = S.tc3 || { c:"", r:"" };
  var busy = false, reveal = Infinity, win = true, probe = null, stopAnim = null, huntRes = null, drag = null;
  host.innerHTML = '<div class="mm-ex"><div class="mm-main" data-mv="graph"><p class="eq-cap mm-eq" id="mx-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="mm-gw"><div class="mm-rail" id="mx-rail"></div><div class="plot-wrap"><canvas class="plot" id="mx-plot" role="img" aria-label="Graph with two walls"></canvas></div></div>' +
    '<p class="tiny muted mm-legend">' + T.legend + '</p><p class="tiny muted mm-how">' + C.wallHow + "</p></div>" +
    '<div class="mm-side"><div class="chips mm-fns" id="mx-fn" role="group" aria-label="Choose a function"></div><div id="mx-mode"></div><p class="tiny muted mm-how" id="mx-mhow"></p>' +
    '<div class="mm-hunt" id="mx-hunt" hidden><div class="chips mm-hchips" id="mx-hch" role="group" aria-label="Choose candidates"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="mx-hcheck" data-k="mxhcheck">Check</button><button type="button" class="btn ghost sm" id="mx-hclear" data-k="mxhclear">Clear</button></div><div id="mx-hfb" aria-live="polite"></div></div>' +
    '<dl class="read mm-read" id="mx-read" aria-live="polite"></dl>' +
    '<div class="mm-tc3"><p class="tiny mm-tc3h">' + T.tc3 + '</p><div class="mm-sq" role="group" aria-label="Exact b, in the form coefficient times the square root of a number">' + m("b =") +
    '<input class="numin short" id="mx-c" data-k="mxc" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="b: the number in front of the root" value="' + MV.esc(S.tc3.c) + '">' +
    '<span class="mm-rad" aria-hidden="true">√</span><input class="numin short mm-rin" id="mx-r" data-k="mxr" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="b: the number under the root (leave empty for a whole number)" value="' + MV.esc(S.tc3.r) + '"></div>' +
    '<p class="tiny muted">' + T.tc3how + '</p></div><div class="q-actions"><button type="button" class="btn ghost sm" id="mx-reset" data-k="mxreset">Reset</button></div></div></div>';
  var cv = $("#mx-plot", host), plot = new MV.Plot(cv, { xmin:-5, xmax:7, ymin:-30, ymax:20 }), rail = $("#mx-rail", host);
  function Fc(){ return FN[S.fn]; }
  function W(){ return S.w[S.fn]; }
  function R(){ var w = W(); return analyze(Fc(), w[0], w[1], S.mode === "open"); }
  function huntOn(){ return S.mode === "hunt" && !(huntRes && huntRes.ok); }
  function typedB(){
    var c = String(S.tc3.c || "").trim(), r = String(S.tc3.r || "").trim();
    if (!c && !r) return null;
    var cq = c ? Q.raw(c) : { n:1, d:1 }, rn = r ? Number(r.replace(/−/g, "-")) : 1;
    if (!cq || !Number.isInteger(rn) || rn < 1) return null;
    return Q.val(Q.of(cq.n, cq.d)) * Math.sqrt(rn);
  }
  // ---- drawing ----
  function draw(){
    var F = Fc(), A = R(), w = W(), xv = xView(F), yv = autoY(F, A, probe ? [fx(F, probe)] : null), V = { xmin:xv[0], xmax:xv[1], ymin:yv[0], ymax:yv[1] };
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), red = css("--red");
    var fo = function(x){ return fx(F, x); }, sc = { view:V, xLabel:"x", yLabel:"y", curves:[], segments:[], points:[], labels:[] };
    sc.curves.push({ f:fo, color:pen, width:3, alpha:0.25 }, { f:fo, color:pen, width:3, domain:[w[0], w[1]] });
    w.forEach(function(x){ sc.segments.push({ x1:x, y1:V.ymin, x2:x, y2:V.ymax, color:ink2, width:2, dash:[7, 6] }); });
    var tb = S.fn === "F2" ? typedB() : null;
    if (tb != null && tb > V.xmin && tb < V.xmax) {
      sc.segments.push({ x1:tb, y1:V.ymin, x2:tb, y2:V.ymax, color:ink, width:1.4, dash:[2, 4] });
      sc.points.push({ x:tb, y:fx(F, tb), r:4, color:ink });
      sc.labels.push({ x:tb, y:V.ymin, text:T.yourB, dy:-12, align:"center", bg:true, font:ui(12) });
    }
    var hunting = huntOn(), dots = [];
    if (hunting) {
      S.hunt.sel.forEach(function(x){ if (x >= V.xmin && x <= V.xmax) sc.points.push({ x:x, y:fx(F, x), r:7, open:true, color:ink }); });
    } else {
      A.outside.forEach(function(c){
        if (c.x < V.xmin || c.x > V.xmax) return;
        var y = fx(F, c.x); sc.points.push({ x:c.x, y:y, r:5, open:true, color:ink2 });
        sc.labels.push({ x:c.x, y:y, text:T.outside, dy:y > (V.ymin + V.ymax) / 2 ? 18 : -18, align:"center", bg:true, color:ink2, font:ui(12) });
      });
      var isW = function(c, k){ return win && A[k] && !A[k].none && A[k].xs.some(function(x){ return near(x, c.x); }); };
      if (S.mode === "open") A.ends.forEach(function(c){ sc.points.push({ x:c.x, y:c.val.v, r:6, open:true, color:ink }); });
      A.cands.forEach(function(c){ dots.push({ x:c.x, y:c.val.v, r:6, color:c.role === "end" ? ink : pen, ring:isW(c, "max") || isW(c, "min") }); });
      if (win) [["max", "abs max "], ["min", "abs min "]].forEach(function(z){
        var e = A[z[0]]; if (!e) return;
        sc.segments.push({ x1:V.xmin, y1:e.v, x2:V.xmax, y2:e.v, color:ink2, width:1.4, dash:e.none ? [1.5, 4] : [3, 5] });
        var up = z[0] === "max";
        sc.labels.push({ x:V.xmax, y:e.v, text:e.none ? (up ? "max: none, " : "min: none, ") + "approaches " + e.val.txt : z[1] + e.val.txt, align:"right", dx:-6, dy:up ? -12 : 12, bg:true, font:ui(12) });
      });
    }
    sc.points = sc.points.concat(dots);
    if (probe != null) { sc.points.push({ x:probe, y:fx(F, probe), r:5.5, color:ink, ring:true }); }
    sc.after = function(ctx, pl){
      if (S.mode !== "hunt" || !huntRes || huntRes.ok) return;
      ctx.save(); ctx.font = ui(12);
      huntRes.missing.forEach(function(x){
        var X = pl.X(x), Y = pl.Y(fx(F, x)); ctx.setLineDash([4, 4]); ctx.strokeStyle = red; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X, Y, 11, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]); ctx.fillStyle = red; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText("missing", X, Y - 14);
      });
      huntRes.extra.forEach(function(x){ var X = pl.X(x), Y = pl.Y(fx(F, x)); ctx.fillStyle = red; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText("✗ not a candidate", X, Y + 12); });
      ctx.restore();
    };
    sc.describe = describe(F, A, hunting);
    plot.draw(sc);
  }
  plot.render = draw;
  function describe(F, A, hunting){
    var s = "Graph of " + MV.plain(m(F.src)) + " on " + MV.plain(m(ivSrc(A))) + ", with walls at x = " + sgnTxt(A.a) + " and x = " + sgnTxt(A.b) + ".";
    if (hunting) return s + " Hunt mode: " + (S.hunt.sel.length ? "you chose x = " + S.hunt.sel.map(sgnTxt).join(", ") + "." : "no candidates chosen yet.");
    s += " Candidates " + (A.cands.length ? A.cands.map(function(c){ return sgnTxt(+c.x.toFixed(2)); }).join(", ") : "none") + ".";
    if (A.outside.length) s += " Critical numbers outside: " + A.outside.map(function(c){ return sgnTxt(c.x); }).join(", ") + ".";
    if (win) ["max", "min"].forEach(function(k){ var e = A[k], nm = k === "max" ? "maximum" : "minimum"; s += e.none ? " No absolute " + nm + ": the values approach " + e.val.txt + "." : " Absolute " + nm + " " + e.val.txt + " at x = " + e.xs.map(function(x){ return sgnTxt(+x.toFixed(2)); }).join(" and ") + "."; });
    return s;
  }
  function ivSrc(A){ return (A.open ? "(" : "[") + xsrc(A.a) + ", " + xsrc(A.b) + (A.open ? ")" : "]"); }
  // ---- wall handles (40 px, above the graph; arrows step 0.5 or 1, Shift + arrow 2) ----
  rail.innerHTML = ["a", "b"].map(function(k, i){
    return '<button type="button" class="mm-wh" role="slider" data-wall="' + i + '" data-k="mxwall' + k + '" aria-label="' + (i ? "Right wall b" : "Left wall a") + '"><span class="m"><i>' + k + "</i></span></button>";
  }).join("");
  function syncRail(){
    var F = Fc(), w = W();
    $$(".mm-wh", rail).forEach(function(b){
      var i = +b.dataset.wall, x = w[i];
      if (plot.W) b.style.left = clamp(plot.X(x), 0, plot.W) + "px";
      b.setAttribute("aria-valuemin", F.lo); b.setAttribute("aria-valuemax", F.hi); b.setAttribute("aria-valuenow", x);
      b.setAttribute("aria-valuetext", (i ? "b = " : "a = ") + xs(x) + (S.mode === "open" ? " (not included)" : ""));
      b.classList.toggle("open", S.mode === "open"); b.disabled = busy;
    });
  }
  plot.onDrawn(syncRail);
  function setWall(i, x, how){
    if (busy) return;
    var F = Fc(), w = W().slice(), st = F.step;
    x = Math.round(x / st) * st; x = +x.toFixed(2);
    if (i === 0) x = clamp(x, F.lo, w[1] - st); else x = clamp(x, w[0] + st, F.hi);
    if (near(x, w[i])) return;
    w[i] = x; S.w[S.fn] = w; huntRes = null;
    S.hunt.sel = S.hunt.sel.filter(function(v){ return onGrid(v, 1) || near(v, w[0]) || near(v, w[1]); });
    api.save(); paint(); MV.changed();
    void how;
  }
  rail.addEventListener("keydown", function(e){
    var b = e.target.closest(".mm-wh"); if (!b) return;
    var i = +b.dataset.wall, F = Fc(), d = 0;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") d = -1; else if (e.key === "ArrowRight" || e.key === "ArrowUp") d = 1;
    else if (e.key === "Home") { e.preventDefault(); setWall(i, i ? W()[0] + F.step : F.lo, "key"); return; }
    else if (e.key === "End") { e.preventDefault(); setWall(i, i ? F.hi : W()[1] - F.step, "key"); return; }
    else return;
    e.preventDefault(); setWall(i, W()[i] + d * (e.shiftKey ? 2 : F.step), "key");
  });
  function xFromEvent(e){ var r = cv.getBoundingClientRect(); return plot.xOf(e.clientX - r.left); }
  rail.addEventListener("pointerdown", function(e){
    var b = e.target.closest(".mm-wh"); if (!b || busy) return;
    e.preventDefault(); drag = +b.dataset.wall; try { b.setPointerCapture(e.pointerId); } catch (err) {} b.focus({ preventScroll:true });
  });
  rail.addEventListener("pointermove", function(e){ if (drag == null) return; setWall(drag, xFromEvent(e), "drag"); });
  ["pointerup", "pointercancel"].forEach(function(t){ rail.addEventListener(t, function(){ drag = null; }); cv.addEventListener(t, function(){ drag = null; }); });
  cv.addEventListener("pointerdown", function(e){
    if (busy) return;
    var r = cv.getBoundingClientRect(), px = e.clientX - r.left, w = W(), d0 = Math.abs(plot.X(w[0]) - px), d1 = Math.abs(plot.X(w[1]) - px);
    if (Math.min(d0, d1) <= 16) {
      drag = d0 <= d1 ? 0 : 1; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (err) {}
      $('.mm-wh[data-wall="' + drag + '"]', rail).focus({ preventScroll:true }); return;
    }
    if (huntOn()) {
      var best = null, bd = 24;
      huntVals().forEach(function(v){ var dd = Math.abs(plot.X(v) - px); if (dd < bd) { bd = dd; best = v; } });
      if (best != null) toggleHunt(best);
    }
  });
  cv.addEventListener("pointermove", function(e){ if (drag == null) return; setWall(drag, xFromEvent(e), "drag"); });
  // ---- Hunt mode ----
  function huntVals(){
    var F = Fc(), w = W(), out = [];
    for (var x = Math.ceil(F.lo); x <= F.hi; x++) out.push(x);
    w.forEach(function(x){ if (!onGrid(x, 1)) out.push(x); });
    return out.sort(function(p, q){ return p - q; });
  }
  function toggleHunt(x){
    var sel = S.hunt.sel, i = sel.findIndex(function(v){ return near(v, x); });
    if (i >= 0) sel.splice(i, 1); else sel.push(x);
    sel.sort(function(p, q){ return p - q; }); huntRes = null; api.save(); paint(); MV.changed();
  }
  function huntCheck(){
    var F = Fc(), A = R(), sel = S.hunt.sel, iv = m(ivSrc(A));
    var want = A.cands.map(function(c){ return c.x; });
    var missing = want.filter(function(x){ return !sel.some(function(v){ return near(v, x); }); });
    var extra = sel.filter(function(x){ return !want.some(function(v){ return near(v, x); }); });
    var msgs = [];
    missing.forEach(function(x){
      var c = A.cands.filter(function(q){ return near(q.x, x); })[0];
      msgs.push(c.role === "end" ? tpl(T.missEnd, { xe:m("x = " + xsrc(x)) }) : tpl(T.missCrit, { xe:m("x = " + xsrc(x)), why:forL(c.kind === "dne" ? T.dne : T.zero, F.L) }));
    });
    extra.forEach(function(x){
      var inI = x > A.a + 1e-9 && x < A.b - 1e-9;
      msgs.push(inI ? tpl(T.extraIn, { xe:m("x = " + xsrc(x)), dfx:m(F.L + "′(" + xsrc(x) + ") ≠ 0") }) : tpl(T.extraOut, { xe:m("x = " + xsrc(x)), iv:iv, fx:m(F.L + "(" + xsrc(x) + ")"), f:m(F.L) }));
    });
    huntRes = { ok:!missing.length && !extra.length, missing:missing, extra:extra, msgs:msgs };
    paint(); MV.focusFb($("#mx-hunt", host));
  }
  // ---- panels ----
  function paintCtrl(){
    var fnEl = $("#mx-fn", host), fns = C.fns.filter(function(q){ return q.id !== "G" || S.fn === "G"; });
    MV.keepFocus(fnEl, function(){
      fnEl.innerHTML = fns.map(function(q){ var on = q.id === S.fn; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-fn="' + q.id + '" data-k="fn' + q.id + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">" + q.chip + "</button>"; }).join("");
    });
    var md = $("#mx-mode", host);
    MV.keepFocus(md, function(){ md.innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode") + "</div>"; });
    $$("[data-mode]", md).forEach(function(b){ b.disabled = busy; });
    $("#mx-mhow", host).innerHTML = C.modeHow[S.mode];
    $("#mx-reset", host).disabled = busy;
    var hu = $("#mx-hunt", host); hu.hidden = S.mode !== "hunt";
    if (S.mode === "hunt") {
      var ch = $("#mx-hch", host), solved = huntRes && huntRes.ok;
      MV.keepFocus(ch, function(){
        ch.innerHTML = huntVals().map(function(x){ var on = S.hunt.sel.some(function(v){ return near(v, x); }); return '<button type="button" class="chip mm-hc2' + (on ? " on" : "") + '" data-hx="' + x + '" data-k="hx' + x + '" aria-pressed="' + on + '"' + (busy || solved ? " disabled" : "") + ">" + m("x = " + xsrc(x)) + "</button>"; }).join("");
      });
      $("#mx-hcheck", host).disabled = busy || !!solved; $("#mx-hclear", host).disabled = busy || !!solved;
      var fb = $("#mx-hfb", host);
      fb.innerHTML = !huntRes ? "" : huntRes.ok ? MV.fbHTML("good", T.huntGood) : MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + huntRes.msgs.join(" "));
    }
  }
  function paintRead(){
    var F = Fc(), A = R(), RW = C.rows, rows = [], hunting = huntOn(), L = F.L;
    rows.push([RW.fn, m(F.src)]);
    rows.push([RW.interval, m(ivSrc(A))]);
    var critTxt;
    if (hunting) critTxt = '<span class="muted">' + T.hunt + "</span>";
    else {
      var all = F.crit.map(function(c){ return m("x = " + c[0]); });
      critTxt = all.join(", ") + " " + forL(F.crit[0][1] === "dne" ? T.dne : T.zero, L);
      if (A.outside.length) critTxt += '<br><span class="tiny">' + tpl(T.notIn, { list:A.outside.map(function(c){ return m("x = " + c.x); }).join(", ") }) + "</span>";
      if (A.wall.length && !A.open) critTxt += '<br><span class="tiny">' + tpl(T.wall, { list:A.wall.map(function(c){ return m("x = " + c.x); }).join(", ") }) + "</span>";
    }
    rows.push([tpl(RW.crit, { f:m(L) }), critTxt]);
    var candTxt;
    if (hunting) candTxt = S.hunt.sel.length ? T.huntPick + ": " + S.hunt.sel.map(function(x){ return m(xsrc(x)); }).join(", ") : '<span class="muted">' + T.huntNone + "</span>";
    else if (A.open) candTxt = (A.cands.length ? A.cands.map(function(c){ return m(xsrc(c.x)); }).join(", ") : T.noCrit) + " (" + T.excl + ")";
    else candTxt = A.cands.map(function(c){ return m(xsrc(c.x)); }).join(", ");
    rows.push([RW.cand, candTxt]);
    var trs;
    if (hunting) trs = S.hunt.sel.map(function(x){ return { x:x, val:valOf(F, x), cand:true }; });
    else {
      trs = A.cands.map(function(c){ return { x:c.x, val:c.val, cand:true, tag:c.role === "end" ? T.endTag : T.critTag }; });
      if (A.open) trs = trs.concat(A.ends.map(function(c){ return { x:c.x, val:c.val, cand:false, excl:true, tag:T.openTag }; }));
      trs.sort(function(p, q){ return p.x - q.x; });
      if (reveal !== Infinity) trs = trs.filter(function(c){ return c.cand; }).slice(0, reveal);
    }
    rows.push([RW.table, trs.length ? candTable(F, A, trs, !hunting, !hunting && win) : '<span class="muted">—</span>']);
    ["max", "min"].forEach(function(k){
      var e = A[k], txt;
      if (hunting || !win) txt = "?";
      else if (e.none) txt = tpl(T.none, { v:e.val.html });
      else txt = e.val.html + ", " + locHTML(L, e.xs);
      rows.push([RW[k], txt]);
    });
    $("#mx-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paint(){ $("#mx-eq", host).innerHTML = m(Fc().src); paintCtrl(); paintRead(); draw(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || busy) return;
    if (b.dataset.fn) { if (S.fn !== b.dataset.fn) { S.fn = b.dataset.fn; S.hunt.sel = []; huntRes = null; api.save(); paint(); MV.changed(); } return; }
    if (b.dataset.mode) { if (S.mode !== b.dataset.mode) { S.mode = b.dataset.mode; huntRes = null; api.save(); paint(); MV.changed(); } return; }
    if (b.dataset.hx != null) { toggleHunt(+b.dataset.hx); return; }
    if (b.id === "mx-hcheck") { huntCheck(); return; }
    if (b.id === "mx-hclear") { S.hunt.sel = []; huntRes = null; api.save(); paint(); MV.changed(); return; }
    if (b.id === "mx-reset") { S.w[S.fn] = Fc().w.slice(); S.mode = "show"; S.hunt.sel = []; huntRes = null; api.save(); paint(); MV.changed(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "mx-c" || t.id === "mx-r") { S.tc3[t.id === "mx-c" ? "c" : "r"] = t.value; api.save(); draw(); MV.changed(); }
  });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && (e.target.id === "mx-c" || e.target.id === "mx-r")) { var b = $('#chal [data-c="tc3"] [data-act="check"]'); if (b) b.click(); }
  });
  paint();

  // ---- predictions ----
  function setWalls(a, b){ S.w[S.fn] = [a, b]; }
  function glideWalls(a1, b1, dur, cb){
    var w0 = W().slice();
    stopAnim = MV.tween({ dur:dur, ease:function(t){ return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }, step:function(t){ setWalls(w0[0] + (a1 - w0[0]) * t, w0[1] + (b1 - w0[1]) * t); paintRead(); draw(); },
      done:function(){ stopAnim = null; setWalls(a1, b1); paint(); if (cb) cb(); } });
  }
  function buildRows(n, cb){
    var i = 0;
    (function next(){ if (i >= n) { cb(); return; } i++; reveal = i; paintRead(); draw(); MV.wait(520, next); })();
  }
  var PSTART = { p1:{ fn:"F1", w:[-2, 5], mode:"show", reveal:0, win:false }, p2:{ fn:"F1", w:[-2, 5], mode:"show", reveal:0, win:false },
    p3:{ fn:"F3", w:[-1, 3], mode:"show", reveal:Infinity, win:true }, p4:{ fn:"G", w:[0, 3], mode:"open", reveal:Infinity, win:false } };
  function chalTest(id, opt){
    var M = MS[id], w = W(), a = w[0], b = w[1];
    if (id === "tc1") {
      if (S.fn !== "F1") return { ok:false, msg:M.fn };
      if (S.mode === "open") return { ok:false, msg:M.open };
      if (b < 3 - 1e-9) return { ok:false, msg:M.b };
      if (a > -1 - 1e-9) return { ok:false, msg:M.a };
      if (near(a, -3)) return { ok:false, msg:M.tie };
      if (near(a, -4) || near(a, -3.5)) return { ok:true };
      return { ok:false, msg:tpl(M.high, { v:valOf(FN.F1, a).html }) };
    }
    if (id === "tc2") {
      if (S.fn !== "F4") return { ok:false, msg:M.fn };
      if (S.mode === "open") return { ok:false, msg:M.open };
      if (!(a < 1 && b > 1)) return { ok:false, msg:M.cusp };
      if (Math.max(Math.abs(a - 1), Math.abs(b - 1)) === 8) return { ok:true };
      return { ok:false, msg:M.max };
    }
    if (id === "tc3") {
      if (opt && opt.live) return { ok:false };       // the exact box is judged only on Check (no free live tick)
      var c = String(S.tc3.c || "").trim(), r = String(S.tc3.r || "").trim(), R2 = 2 * Math.SQRT2;
      if (!c && !r) return { ok:false, msg:M.empty };
      var cq = c ? Q.raw(c) : { n:1, d:1 }, rn = r ? Number(r.replace(/−/g, "-")) : 1;
      if (!cq || !Number.isInteger(rn) || rn < 1) {
        var pv = MV.parseNum(c);
        if (!r && pv && pv.length === 1 && near(pv[0], R2, 0.02)) return { ok:false, msg:M.dec };
        return { ok:false, msg:M.bad };
      }
      var cQ = Q.of(cq.n, cq.d), J = MV.mcv.exact.judge({ num:[r ? { c:cQ, r:rn, k:2 } : { c:cQ, r:1, k:1 }], den:[{ c:{ n:1, d:1 }, r:1, k:1 }] },
        { num:MV.mcv.S.of([[2, 2]]), den:MV.mcv.S.of([[1]]) });
      if (J.equal) return { ok:true };
      var v = J.value;
      if (near(v, 2)) return { ok:false, msg:M.two };
      if (near(v, 3)) return { ok:false, msg:M.three };
      var fb = valOf(FN.F2, v).html, bh = r ? m((cQ.n === 1 && cQ.d === 1 ? "" : Q.txt(cQ)) + "√" + rn) : m(Q.src(cQ));
      if (v > 0 && v < R2) return { ok:false, msg:tpl(M.small, { b:bh, v:fb }) };
      return { ok:false, msg:tpl(M.big, { v:fb }) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stopAnim) { stopAnim(); stopAnim = null; }
        var P = PSTART[p.id] || PSTART.p1;
        busy = true; S.fn = P.fn; S.mode = P.mode; setWalls(P.w[0], P.w[1]); reveal = P.reveal; win = P.win; probe = null; huntRes = null;
        paint();
      },
      run:function(p, done){
        function fin(){ busy = false; reveal = Infinity; win = true; probe = null; api.save(); paint(); MV.changed(); done(); }
        if (p.id === "p1") buildRows(4, function(){ win = true; paint(); MV.wait(1100, fin); });
        else if (p.id === "p2") glideWalls(0, 4, 1600, function(){ MV.wait(300, function(){ buildRows(3, function(){ win = true; paint(); MV.wait(1100, fin); }); }); });
        else if (p.id === "p3") MV.wait(300, function(){ glideWalls(-1, 5, 3200, function(){ MV.wait(900, fin); }); });
        else if (p.id === "p4") {
          stopAnim = MV.tween({ dur:2200, ease:function(t){ return 1 - Math.pow(1 - t, 2); }, step:function(t){ probe = 2 - 1.96 * t; draw(); },
            done:function(){ stopAnim = null; probe = 0.04; draw(); MV.wait(700, function(){ win = true; paint(); MV.wait(1300, fin); }); } });
        }
        else fin();
      }
    },
    challenge:chalTest
  };
}

// =====================================================================================================================
// @component V10 shapeStage — a figure driven by one variable beside the objective graph (course plan V10: 16 Part 3, 17–19, 28,
// 32): an SVG figure redrawn from v, the graph of the objective with the feasible domain shaded (--hi-soft band; the curve
// outside it at 25%), the current point marked with a ring, and a slider (the scrubber) for v with an aria-live readout.
//   shapeStage(host, {v, min, max, step, label, box:"0 0 w h", fig(v) -> svg markup, figAria(v), f(v), view, domain:[lo, hi],
//     xLabel, yLabel, xTicks, fmt(v) -> html, read(v) -> html, marks() -> {points, labels, segments}, describe(v), onChange(v)})
//   -> {set(v), get(), paint()}
function shapeStage(host, o){
  host.innerHTML = '<div class="mm-stage"><div class="mm-sfig"><svg class="mm-svg" viewBox="' + o.box + '" role="img" aria-label=""></svg></div>' +
    '<div class="mm-sgr"><canvas class="plot wide" role="img" aria-label=""></canvas></div></div>' +
    '<label class="slider mm-ssl"><span class="slider-top"><span>' + o.label + '</span><output></output></span><input type="range" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.v + '" style="accent-color:var(--ink)"></label>' +
    '<p class="mm-sread" aria-live="polite"></p>';
  var svg = $("svg", host), cv = $("canvas", host), inp = $("input", host), out = $("output", host), rd = $(".mm-sread", host);
  var plot = new MV.Plot(cv, o.view), v = o.v;
  inp.setAttribute("aria-label", MV.plain(o.label));
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), V = o.view, y = o.f(v), mk = o.marks ? o.marks() : {};
    var sc = { view:V, xLabel:o.xLabel, yLabel:o.yLabel, xTicks:o.xTicks, bands:[{ x0:o.domain[0], x1:o.domain[1] }],
      curves:[{ f:o.f, color:pen, width:3, alpha:0.25 }, { f:o.f, color:pen, width:3, domain:o.domain }],
      segments:[{ x1:v, y1:Math.max(V.ymin, 0), x2:v, y2:y, color:ink2, width:1.4, dash:[3, 4] }].concat(mk.segments || []),
      points:(mk.points || []).concat([{ x:v, y:y, r:6, color:ink, ring:true }]), labels:mk.labels || [] };
    sc.describe = o.describe(v);
    plot.draw(sc);
  }
  plot.render = draw;
  function paint(){
    svg.innerHTML = o.fig(v); svg.setAttribute("aria-label", o.figAria(v));
    out.innerHTML = o.fmt(v); if (+inp.value !== v) inp.value = v; inp.setAttribute("aria-valuetext", MV.plain(o.fmt(v)));
    rd.innerHTML = o.read(v); draw();
  }
  inp.addEventListener("input", function(){ v = +inp.value; paint(); if (o.onChange) o.onChange(v); });
  paint();
  return { set:function(x){ v = clamp(x, o.min, o.max); paint(); }, get:function(){ return v; }, paint:paint };
}
// ------------------------------------------------- end of V10 shapeStage ---------------------------------------------------

// ---------- Part 3: Extreme values in context ----------
function Tg(t){ return -t * t * t + 12 * t * t - 36 * t + 40; }
function Cd(t){ return 10 * t / (t * t + 4); }
function clock(t){ var mins = Math.round((6 + t) * 60), h = Math.floor(mins / 60), mm = mins % 60; return h + ":" + (mm < 10 ? "0" : "") + mm; }
function dec1(v){ var r = Math.round(v * 100) / 100; return (near(v, r, 1e-9) ? "" : "≈ ") + num(v, 2); }
// figures (SVG, viewBox 0 0 220 200; colours from tokens via classes in app.css)
function greenFig(t){
  var T = Tg(t), lev = clamp(T, 0, 45), y = 160 - lev / 45 * 128, mins = (6 + t) * 60, hA = (mins / 60 % 12) / 12 * 2 * Math.PI, mA = (mins % 60) / 60 * 2 * Math.PI;
  var s = '<line class="mm-g-ground" x1="6" y1="172" x2="150" y2="172"/>' +
    '<path class="mm-g-house" d="M20 172 V96 L80 48 L140 96 V172 Z"/><path class="mm-g-pane" d="M20 96 H140 M50 96 V172 M80 48 V172 M110 96 V172 M35 84 L80 120 M125 84 L80 120"/>' +
    '<path class="mm-g-plant" d="M66 172 C66 158 70 150 80 146 M80 172 V140 M94 172 C94 160 90 152 80 146"/><circle class="mm-g-leaf" cx="80" cy="138" r="6"/>';
  // thermometer
  s += '<rect class="mm-g-tube" x="171" y="24" width="18" height="140" rx="9"/><rect class="mm-g-fluid" x="176" y="' + y.toFixed(1) + '" width="8" height="' + (166 - y).toFixed(1) + '"/>' +
    '<circle class="mm-g-bulb" cx="180" cy="172" r="12"/>';
  [0, 10, 20, 30, 40].forEach(function(k){ var yy = 160 - k / 45 * 128; s += '<line class="mm-g-tick" x1="189" y1="' + yy + '" x2="196" y2="' + yy + '"/><text class="mm-g-tl" x="199" y="' + (yy + 4) + '">' + k + "</text>"; });
  s += '<text class="mm-g-tl" x="164" y="16">°C</text>';
  // clock
  s += '<circle class="mm-g-clock" cx="34" cy="30" r="20"/>' +
    '<line class="mm-g-hand" x1="34" y1="30" x2="' + (34 + 10 * Math.sin(hA)).toFixed(1) + '" y2="' + (30 - 10 * Math.cos(hA)).toFixed(1) + '"/>' +
    '<line class="mm-g-hand thin" x1="34" y1="30" x2="' + (34 + 15 * Math.sin(mA)).toFixed(1) + '" y2="' + (30 - 15 * Math.cos(mA)).toFixed(1) + '"/>';
  return s;
}
function doseFig(t){
  var C = Cd(t), h = C / 3 * 136, y = 166 - h;
  var s = '<path class="mm-d-vial" d="M88 22 V160 Q88 172 100 172 H140 Q152 172 152 160 V22"/><line class="mm-d-rim" x1="80" y1="22" x2="160" y2="22"/>' +
    '<path class="mm-d-fluid" d="M92 ' + y.toFixed(1) + ' H148 V160 Q148 168 140 168 H100 Q92 168 92 160 Z"/>';
  [0, 1, 2, 3].forEach(function(k){ var yy = 166 - k / 3 * 136; s += '<line class="mm-g-tick" x1="74" y1="' + yy + '" x2="86" y2="' + yy + '"/><text class="mm-g-tl" x="70" y="' + (yy + 4) + '" text-anchor="end">' + k + "</text>"; });
  s += '<text class="mm-g-tl" x="8" y="14">mg/L</text>';
  // timeline 0–6 h
  s += '<line class="mm-g-tick" x1="170" y1="30" x2="170" y2="166"/>';
  [0, 2, 4, 6].forEach(function(k){ var yy = 30 + k / 6 * 136; s += '<line class="mm-g-tick" x1="166" y1="' + yy + '" x2="174" y2="' + yy + '"/><text class="mm-g-tl" x="178" y="' + (yy + 4) + '">' + k + " h</text>"; });
  s += '<circle class="mm-d-now" cx="170" cy="' + (30 + t / 6 * 136).toFixed(1) + '" r="6"/>';
  return s;
}
function part3(host, api){
  var S = api.S, C = api.content, LB = C.labels;
  S.v = S.v || {}; S.flip = S.flip || {}; S.pick = S.pick || {};
  host.innerHTML = C.stations.map(function(st){
    return '<div class="part mm-st" data-st="' + st.id + '"><h3>' + st.title + "</h3><p>" + st.text + "</p>" + (st.banner ? '<p class="banner mm-sban" aria-live="polite"></p>' : "") +
      '<div class="mm-stg"></div><p class="tiny muted">' + C.stageHow + "</p>" +
      '<p class="tiny mm-dh"><strong>Candidate cards.</strong> ' + C.cardHow + '</p><div class="mm-deck" role="group" aria-label="Candidate cards"></div>' +
      '<div class="mm-picks">' + st.picks.map(function(pk){ return '<div class="mm-pick" data-pk="' + pk.id + '"><p class="mm-pq">' + pk.q + '</p><div class="chips mm-pch" role="group" aria-label="' + MV.esc(MV.plain(pk.q)) + '"></div><div class="mm-pfb"></div></div>'; }).join("") + "</div>" +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + st.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details></div>";
  }).join("");
  var stages = {};
  C.stations.forEach(function(st){
    var box = $('[data-st="' + st.id + '"]', host), green = st.kind === "green", f = green ? Tg : Cd;
    S.flip[st.id] = S.flip[st.id] || {}; S.pick[st.id] = S.pick[st.id] || {};
    var v0 = typeof S.v[st.id] === "number" && S.v[st.id] >= st.lo && S.v[st.id] <= st.hi ? S.v[st.id] : st.lo;
    function cardVal(t){
      if (green) return { src:"T(" + t + ") = " + Tg(t), say:Tg(t) + " °C at " + clock(t) };
      var q = Q.of(10 * t, t * t + 4);
      return { src:"C(" + t + ") = " + Q.src(q), say:num(Q.val(q), 2) + " mg/L at " + t + " h" };
    }
    stages[st.id] = shapeStage($(".mm-stg", box), {
      v:v0, min:st.lo, max:st.hi, step:0.25, box:"0 0 220 200",
      label:green ? LB.time + " " + m("t") + " (hours after 6:00)" : LB.time + " " + m("t") + " (hours " + LB.after + ")",
      fig:green ? greenFig : doseFig,
      figAria:function(t){ return green ? "A greenhouse with a thermometer reading " + dec1(Tg(t)) + " °C and a clock showing " + clock(t) + "." : "A vial filled to " + dec1(Cd(t)) + " mg/L, " + num(t, 2) + " h after the dose."; },
      f:f, view:green ? { xmin:-0.3, xmax:8.3, ymin:-3, ymax:47 } : { xmin:-0.4, xmax:6.6, ymin:-0.25, ymax:3.05 },
      domain:[st.lo, st.hi], xLabel:"t", yLabel:green ? "T" : "C", xTicks:{ step:1 },
      fmt:function(t){ return m("t = " + num(t, 2)) + (green ? " (" + clock(t) + ")" : " h"); },
      read:function(t){ return green ? m("T(" + num(t, 2) + ")") + " " + (dec1(Tg(t)).indexOf("≈") === 0 ? "≈ " : "= ") + num(Tg(t), 2) + " °C at " + clock(t) : m("C(" + num(t, 2) + ")") + " " + (dec1(Cd(t)).indexOf("≈") === 0 ? "≈ " : "= ") + num(Cd(t), 2) + " mg/L"; },
      marks:function(){
        var pts = [], labs = [], ink = css("--ink"), ink2 = css("--ink-2");
        st.cards.forEach(function(c){
          var V = green ? { lo:-0.3, hi:8.3 } : { lo:-0.4, hi:6.6 };
          if (c.t < V.lo || c.t > V.hi) return;
          var y = f(c.t);
          if (c.out) { pts.push({ x:c.t, y:y, r:5, open:true, color:ink2 }); labs.push({ x:c.t, y:y, text:"outside", dy:-16, align:"center", bg:true, color:ink2, font:ui(12) }); return; }
          if (!S.flip[st.id][c.t]) return;
          pts.push({ x:c.t, y:y, r:5.5, color:ink });
          labs.push({ x:c.t, y:y, text:green ? num(y) + " °C" : num(y, 2) + " mg/L", dy:y > (green ? 30 : 2) ? 18 : -18, align:"center", bg:true, font:ui(12) });
        });
        return { points:pts, labels:labs };
      },
      describe:function(t){
        var flipped = st.cards.filter(function(c){ return !c.out && S.flip[st.id][c.t]; }).map(function(c){ return MV.plain(m(cardVal(c.t).src)); });
        return (green ? "Graph of the greenhouse temperature T(t)" : "Graph of the concentration C(t)") + " with the window " + st.lo + " ≤ t ≤ " + st.hi + " shaded; current point t = " + num(t, 2) + ", " +
          (green ? "T ≈ " + num(Tg(t), 1) + " °C" : "C ≈ " + num(Cd(t), 2) + " mg/L") + "." + (flipped.length ? " Flipped cards: " + flipped.join("; ") + "." : "");
      },
      onChange:function(t){ S.v[st.id] = t; api.save(); }
    });
    function paintDeck(){
      var deck = $(".mm-deck", box);
      MV.keepFocus(deck, function(){
        deck.innerHTML = st.cards.map(function(c){
          var when = green ? clock(c.t) : (c.t < 0 ? MINUS + Math.abs(c.t) : c.t) + " h", front = m("t = " + c.t) + '<span class="mm-cw">' + when + "</span>";
          if (c.out) return '<button type="button" class="mm-card out" data-k="cd' + st.id + c.t + '" aria-disabled="true" disabled>' + front + '<span class="mm-cb">' + LB.outside + "</span></button>";
          var on = !!S.flip[st.id][c.t], cvv = cardVal(c.t);
          return '<button type="button" class="mm-card' + (on ? " on" : "") + '" data-ct="' + c.t + '" data-k="cd' + st.id + c.t + '" aria-pressed="' + on + '">' + front +
            '<span class="mm-cb">' + (on ? m(cvv.src) + '<span class="mm-cw">' + cvv.say + "</span>" : LB.flip) + "</span></button>";
        }).join("");
      });
      var ban = $(".mm-sban", box);
      if (ban) ban.textContent = st.cards.filter(function(c){ return !c.out; }).every(function(c){ return S.flip[st.id][c.t]; }) || st.picks.every(function(pk){ var i = S.pick[st.id][pk.id]; return i != null && pk.opts[i] && MV.ok(pk.opts[i]); }) ? MV.plain(st.banner) : "";
    }
    function paintPicks(){
      st.picks.forEach(function(pk){
        var el = $('[data-pk="' + pk.id + '"]', box), ch = $(".mm-pch", el), i = S.pick[st.id][pk.id], done = i != null && pk.opts[i] && MV.ok(pk.opts[i]);
        MV.keepFocus(ch, function(){
          ch.innerHTML = pk.opts.map(function(o, j){ var on = i === j; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-pi="' + j + '" data-k="pk' + st.id + pk.id + j + '" aria-pressed="' + on + '"' + (done ? " disabled" : "") + ">" + o.t + "</button>"; }).join("");
        });
        var fb = $(".mm-pfb", el);
        fb.innerHTML = i == null ? "" : done ? MV.fbHTML("good", "<strong>✓</strong> " + pk.good) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (pk.opts[i].fb || pk.bad));
      });
    }
    box.addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      if (b.dataset.ct != null) { var t = +b.dataset.ct; S.flip[st.id][t] = true; S.v[st.id] = t; api.save(); paintDeck(); stages[st.id].set(t); return; }
      var pe = b.closest("[data-pk]");
      if (pe && b.dataset.pi != null) { S.pick[st.id][pe.dataset.pk] = +b.dataset.pi; api.save(); paintPicks(); paintDeck(); MV.focusFb(pe); }
    });
    paintDeck(); paintPicks();
  });
  return {};
}

// ---------- Practice 1: Candidate table ----------
// @component V8 extremaBoxes (adapted from MCV4U 13 pointBoxes) — the absolute max and min as value boxes plus location boxes that
// take one or more x-values ("1, 4"; order-free, repeats ignored), or a constant k with the min; named wrong states per box
// ({k, eq} a value, {k, has} a location, {any} any location), partial-credit messages, first-try scoring, three-level help.
function candAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  var LAY = { mm:[["Absolute maximum", "maxV", "maxX"], ["Absolute minimum", "minV", "minX"]], k:[["Constant", "k", null], ["Absolute minimum", "minV", "minX"]] };
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q mm-cq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="mm-cin"></div><div class="mm-ccl"></div></div>';
  }).join("");
  function inp(it, k, label, x, list){
    return '<input class="numin short' + (list ? " mm-list" : "") + '" data-bx="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">";
  }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .mm-cin', host);
    var h = '<div class="mm-ct">' + LAY[it.kind].map(function(r){
      if (!r[2]) return '<div class="mm-ctr"><span class="mm-ctl">' + r[0] + '</span><label class="mm-cbx"><span>' + m("k =") + "</span>" + inp(it, "k", "k", x) + "</label></div>";
      return '<div class="mm-ctr"><span class="mm-ctl">' + r[0] + '</span><label class="mm-cbx"><span>value</span>' + inp(it, r[1], r[0] + " value", x) + '</label><label class="mm-cbx"><span>at ' + m("x =") + "</span>" + inp(it, r[2], r[0] + ": every x where it occurs", x, true) + "</label></div>";
    }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .mm-ccl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function uniq(l){ var o = []; l.forEach(function(v){ if (!o.some(function(w){ return near(v, w); })) o.push(v); }); return o; }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), keys = Object.keys(ans), vals = {}, i;
    for (i = 0; i < keys.length; i++) {
      var k = keys[i], raw = String(x.v[k] || "").trim();
      if (!raw) return { err:TX.fill };
      if (Array.isArray(ans[k])) { var l = MV.parseList(raw); if (!l) return { err:TX.err }; vals[k] = uniq(l); }
      else { var p = MV.parseNum(raw); if (!p || p.length !== 1 || !isFinite(p[0])) return { err:TX.err }; vals[k] = p[0]; }
    }
    function eqK(k){ return Array.isArray(ans[k]) ? MV.sameNums(vals[k], ans[k], 1e-9) : near(vals[k], ans[k], 1e-9); }
    if (keys.every(eqK)) return { ok:true };
    var W = it.wrong || [];
    for (i = 0; i < W.length; i++) {
      var w = W[i];
      if (w.k && w.eq != null && !Array.isArray(vals[w.k]) && near(vals[w.k], w.eq, 1e-9)) return { ok:false, msg:w.fb };
      if (w.k && w.has != null && Array.isArray(vals[w.k]) && vals[w.k].some(function(v){ return near(v, w.has); })) return { ok:false, msg:w.fb };
      if (w.any != null && keys.some(function(k){ return Array.isArray(vals[k]) && vals[k].some(function(v){ return near(v, w.any); }); })) return { ok:false, msg:w.fb };
    }
    var mx = ["maxV", "maxX"].filter(function(k){ return k in ans; }), mn = ["minV", "minX"];
    var maxOk = mx.length && mx.every(eqK), minOk = mn.every(eqK), valsOk = keys.filter(function(k){ return !Array.isArray(ans[k]); }).every(eqK);
    if (valsOk && keys.length > 2) return { ok:false, msg:TX.valOk };
    if (maxOk) return { ok:false, msg:TX.maxOk };
    if (minOk && mx.length) return { ok:false, msg:TX.minOk };
    return { ok:false, msg:it.general || TX.general };
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
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design the window (f(x) = x³ − 12x on [a, b], whole numbers −5 to 6) ----------
var task = (function(){
  var api, plot, F = { L:"f", poly:[0, -12, 0, 1], crit:[[-2, "zero"], [2, "zero"]], lo:-5, hi:6, step:1, base:[-20, 20], src:"f(x) = x^3 - 12x" };
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -5 && v <= 6 ? v : null; }
  function read(){ var a = gi("a"), b = gi("b"); return { a:a, b:b, valid:a !== null && b !== null && a < b }; }
  function checks(d){
    if (!d.valid) return [false, false, false, false];
    var A = analyze(F, d.a, d.b, false), ins = A.inside.map(function(c){ return c.x; });
    var c2 = A.max.xs.every(function(x){ return x === d.a || x === d.b; });
    var c3 = A.min.xs.every(function(x){ return ins.indexOf(x) >= 0; });
    return [ins.length === 1, c2, c3, d.b - d.a === 5];
  }
  function draw(){
    var d = read(), pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), V, sc;
    if (!d.valid) {
      V = { xmin:-5.6, xmax:6.6, ymin:-70, ymax:150 };
      sc = { view:V, xLabel:"x", yLabel:"y", curves:[{ f:function(x){ return pEval(F.poly, x); }, color:pen, width:3, alpha:0.25 }], describe:"Graph of f(x) = x³ − 12x. Choose a and b to place the walls." };
      plot.draw(sc); return;
    }
    var A = analyze(F, d.a, d.b, false), y = autoY(F, A);
    V = { xmin:-5.6, xmax:6.6, ymin:y[0], ymax:y[1] };
    sc = { view:V, xLabel:"x", yLabel:"y", curves:[{ f:function(x){ return pEval(F.poly, x); }, color:pen, width:3, alpha:0.25 }, { f:function(x){ return pEval(F.poly, x); }, color:pen, width:3, domain:[d.a, d.b] }],
      segments:[], points:[], labels:[] };
    [d.a, d.b].forEach(function(x){ sc.segments.push({ x1:x, y1:V.ymin, x2:x, y2:V.ymax, color:ink2, width:2, dash:[7, 6] }); });
    A.outside.forEach(function(c){ var yy = pEval(F.poly, c.x); sc.points.push({ x:c.x, y:yy, r:5, open:true, color:ink2 }); sc.labels.push({ x:c.x, y:yy, text:"outside", dy:-18, align:"center", bg:true, color:ink2, font:ui(12) }); });
    [["max", "abs max "], ["min", "abs min "]].forEach(function(z){ var e = A[z[0]]; sc.segments.push({ x1:V.xmin, y1:e.v, x2:V.xmax, y2:e.v, color:ink2, width:1.4, dash:[3, 5] }); sc.labels.push({ x:V.xmax, y:e.v, text:z[1] + e.val.txt, align:"right", dx:-6, dy:z[0] === "max" ? -12 : 12, bg:true, font:ui(12) }); });
    A.cands.forEach(function(c){
      var w = A.max.xs.concat(A.min.xs).some(function(x){ return x === c.x; });
      sc.points.push({ x:c.x, y:c.val.v, r:6, color:c.role === "end" ? ink : pen, ring:w });
    });
    sc.describe = "Graph of f(x) = x³ − 12x on [" + sgnTxt(d.a) + ", " + sgnTxt(d.b) + "]. Candidates " + A.cands.map(function(c){ return sgnTxt(c.x); }).join(", ") + ". Absolute maximum " + A.max.val.txt + " at x = " + A.max.xs.map(sgnTxt).join(" and ") + "; absolute minimum " + A.min.val.txt + " at x = " + A.min.xs.map(sgnTxt).join(" and ") + ".";
    plot.draw(sc);
  }
  function table(){
    var d = read(), el = $("#mt-tab"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<p class="tiny muted">' + api.content.labels.invalid + "</p>"; return; }
    var A = analyze(F, d.a, d.b, false), T = MV.C.explore.txt;
    var rows = A.cands.map(function(c){ return { x:c.x, val:c.val, cand:true, tag:c.role === "end" ? T.endTag : T.critTag }; });
    el.innerHTML = '<p class="tiny" style="font-weight:700;margin:10px 0 4px">Candidate table on ' + m("[" + d.a + ", " + d.b + "]") + "</p>" + candTable(F, A, rows, true, true);
  }
  function stepper(k, lab){
    var L = api.content.labels;
    return '<div class="mm-step"><label for="mt-' + k + '"><span class="m">' + m(k) + '</span> <span class="tiny muted">' + L[k] + " " + L.range + '</span></label>' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="mt' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="mt-' + k + '" data-tk="' + k + '" type="number" min="-5" max="6" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="mt' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
    void lab;
  }
  function afterAll(){
    // the plan's "after all four" note, added once every valid window has been found (the toolkit's own note fires after 3)
    setTimeout(function(){
      var t = MV.S.task, fb = $("#task-fb"), d = read();
      if (!t || !fb || !d.valid || !checks(d).every(Boolean) || (t.found || []).length < 4 || $(".mm-all", fb)) return;
      var g = $(".fb.good", fb); if (g) g.insertAdjacentHTML("beforeend", '<p class="mm-all">' + api.content.afterAll + "</p>");
    }, 0);
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.a == null) { a.S.a = "-3"; a.S.b = "3"; }
      inp.innerHTML = '<p class="tiny" style="font-weight:700;margin:0">The walls</p>' + stepper("a") + stepper("b");
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="mt-plot" role="img" aria-label="Graph of f(x) = x³ − 12x with your walls"></canvas></div><div id="mt-tab" aria-live="polite"></div>';
      plot = new MV.Plot($("#mt-plot"), { xmin:-5.6, xmax:6.6, ymin:-70, ymax:150 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); table(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -5, 6)); $("#mt-" + k).value = a.S[k];
        a.save(); draw(); table(); a.update();
      });
      var ck = $("#task-check"); if (ck) ck.addEventListener("click", afterAll);
      draw(); table();
    },
    read:read,
    valid:function(d){ return d.valid ? true : api.content.labels.invalid; },
    checks:checks,
    key:function(d){ return d.a + "," + d.b; },
    label:function(k){ var p = k.split(",").map(Number); return m("[" + p[0] + ", " + p[1] + "]"); },
    text:function(k){ var p = k.split(",").map(Number); return "[" + sgnTxt(p[0]) + ", " + sgnTxt(p[1]) + "]"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ cand:candAct },
  task:task
});
})();
