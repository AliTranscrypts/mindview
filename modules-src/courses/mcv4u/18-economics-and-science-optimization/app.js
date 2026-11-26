// MCV4U 18 Economics and Science Optimization Problems: hero (a hoodie's price tag, a shrinking crowd and the revenue and
// profit curves), Revenue and profit dashboard (Explore: R, C, P by price and the marginal view by quantity with the
// R′ > C′ gap shaded), Science optimization (Part 3: three V10 shape-stage stations with V11 sign charts), Solve it
// (Practice 2: N4 money boxes) and the "Set up shop" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
function lin(t){ return t; }
// money: $2400, $48.75, −$800; approx() adds "≈ " when cents had to be rounded
function money(v){
  var r = Math.round(v * 100) / 100; if (Math.abs(r) < 0.005) r = 0;
  var a = Math.abs(r), s = Number.isInteger(a) ? num(a, 0) : a.toFixed(2);
  return (r < 0 ? MINUS : "") + "$" + s;
}
function approx(v, dp){ var p = Math.pow(10, dp == null ? 2 : dp); return Math.abs(v * p - Math.round(v * p)) > 1e-6 ? "≈ " : ""; }
function parseMoney(s){
  s = String(s == null ? "" : s).replace(/[$\s,]/g, "").replace(/−/g, "-");
  if (!s) return null;
  var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : NaN;
}
// view whose y-axis (x = 0) sits padPx pixels in from the left edge, so the money tick labels never clip
// (padB: the x-axis y = 0 sits padB pixels above the bottom edge, leaving room for tick labels when the data start at 0)
function padView(plot, xmax, ymin, ymax, padPx, padB){
  var r = plot.c ? plot.c.getBoundingClientRect() : { width:400, height:300 }, W = r.width || 400, H = r.height || 300; padPx = padPx || 48;
  if (padB) ymin = -padB * ymax / Math.max(H - padB, 1);
  return { xmin:-padPx * xmax / Math.max(W - padPx, 1), xmax:xmax, ymin:ymin, ymax:ymax };
}
function xfmt(f){ return function(t){ return t < 0 ? "" : f ? f(t) : num(t); }; }
function pressed(b, on){ b.setAttribute("aria-pressed", on ? "true" : "false"); if (b.classList.contains("chip")) b.classList.toggle("on", !!on); }
// axis name at the right end of the x-axis: under the tick labels when there is room, otherwise just above the axis
function axisName(ctx, pl, text){
  var y0 = pl.Y(0), below = y0 + 36 < pl.H;
  ctx.save(); ctx.font = ui(12, 400); ctx.fillStyle = css("--ink-2"); ctx.textAlign = "right"; ctx.textBaseline = below ? "top" : "bottom";
  ctx.fillText(text, pl.W - 6, below ? y0 + 20 : y0 - 4); ctx.restore();
}

// ---------- the hoodie model (plan: demand x = 200 − 4p, cost C = F + u·x) ----------
function hoodie(u, F){
  var o = { u:u, F:F };
  o.x = function(p){ return 200 - 4 * p; };
  o.R = function(p){ return p * (200 - 4 * p); };
  o.C = function(p){ return F + u * (200 - 4 * p); };
  o.P = function(p){ return (p - u) * (200 - 4 * p) - F; };
  o.mr = function(x){ return 50 - x / 2; };
  o.best = 25 + u / 2; o.max = (50 - u) * (50 - u) - F;
  return o;
}

// ---------- hero: the price tag ticks from $10 to $50, the crowd shrinks, R and P draw over price ----------
var HOODIE = '<svg class="ec-hoodie" viewBox="0 0 120 106" aria-hidden="true">' +
  '<path class="ec-hd" d="M40 12 Q60 -2 80 12 L100 20 L117 60 L104 67 L94 46 L94 102 L26 102 L26 46 L16 67 L3 60 L20 20 Z"/>' +
  '<path class="ec-hd-l" d="M47 13 Q60 34 73 13 M60 30 V40 M40 78 H80 L85 96 H35 Z"/>' +
  '<line class="ec-hd-l" x1="86" y1="38" x2="92" y2="50"/><g class="ec-tag"><rect x="62" y="48" width="44" height="24" rx="5"/><circle cx="68" cy="60" r="2.4"/>' +
  '<text id="ec-tag-t" x="88" y="61">$10</text></g></svg>';
var PERSON = '<svg class="ec-person" viewBox="0 0 16 26" aria-hidden="true"><circle cx="8" cy="5" r="4.2"/><path d="M1 26 V16 Q1 10.5 8 10.5 Q15 10.5 15 16 V26 Z"/></svg>';
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var hb = $("#ec-hoodie"), cb = $("#ec-crowd"), cn = $("#ec-crowd-n");
  if (hb) hb.innerHTML = HOODIE;
  if (cb) { var h = ""; for (var i = 0; i < 8; i++) h += PERSON; cb.innerHTML = h; }
  if (f.cap) f.cap.innerHTML = '<span class="ec-lg"><i class="ec-sw ec-sw-r"></i>revenue ' + m("R") + '</span><span class="ec-lg"><i class="ec-sw ec-sw-p"></i>profit ' + m("P") + "</span>";
  var H = hoodie(10, 800), plot = new MV.Plot(cv, { xmin:0, xmax:52, ymin:-1100, ymax:2900 }), st = { p:10, done:false };
  function strip(){
    var p = Math.round(st.p), x = H.x(p), t = $("#ec-tag-t"); if (t) t.textContent = "$" + p;
    if (cb) $$(".ec-person", cb).forEach(function(s, i){ s.classList.toggle("off", i >= Math.round(x / 20)); });
    if (cn) cn.textContent = num(x) + " sold";
  }
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), p = st.p;
    var sc = { view:padView(plot, 52, -1100, 2900, 46), xTicks:{ step:10, fmt:xfmt(money) }, yTicks:{ step:1000, fmt:money },
      curves:[{ f:H.R, color:pen, width:3, domain:[10, p] }, { f:H.P, color:ink, width:3.6, domain:[10, p] }],
      labels:[{ x:10, y:H.R(10), text:"R", dx:-8, align:"right", color:pen, font:mfont(16) }, { x:10, y:H.P(10), text:"P", dx:-8, align:"right", color:ink, font:mfont(16) }],
      segments:[], points:[] };
    if (st.done) {
      sc.segments.push({ x1:25, y1:2500, x2:25, y2:0, color:pen, width:1.8, dash:[6, 5] }, { x1:30, y1:800, x2:30, y2:0, color:ink, width:1.8, dash:[6, 5] });
      sc.points.push({ x:25, y:2500, r:5.5, color:pen }, { x:30, y:800, r:5.5, color:ink });
      sc.labels.push({ x:25, y:2500, text:"most revenue: $25", dy:-16, align:"center", bg:true, color:pen, font:ui(13) },
        { x:30, y:800, text:"most profit: $30", dx:10, dy:-16, align:"left", bg:true, color:ink, font:ui(13) });
    } else sc.points.push({ x:p, y:H.R(p), r:5, color:pen }, { x:p, y:H.P(p), r:5, color:ink });
    sc.describe = st.done ? "Revenue R and profit P against the price of a hoodie, from $10 to $50. Revenue peaks at $2500 when the price is $25; profit peaks at $800 when the price is $30. Dashed lines drop from each peak to the price axis."
      : "Revenue and profit drawn up to a price of " + money(Math.round(p)) + ".";
    plot.draw(sc);
  }
  plot.render = draw;
  if (MV.reduceMotion) { st.p = 50; st.done = true; strip(); draw(); return; }
  strip(); draw();
  MV.wait(500, function(){
    MV.tween({ dur:4200, ease:lin, step:function(t){ st.p = 10 + 40 * t; strip(); draw(); }, done:function(){ st.p = 50; strip(); MV.wait(300, function(){ st.done = true; draw(); }); } });
  });
}

// ---------- Explore: revenue and profit dashboard ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (S.view !== "qty") S.view = "price";
  if (!(typeof S.p === "number" && S.p >= 10 && S.p <= 50)) S.p = 20;
  if ([10, 14].indexOf(S.u) < 0) S.u = 10;
  if ([800, 1200].indexOf(S.F) < 0) S.F = 800;
  S.on = Object.assign({ R:true, C:true, P:true, dR:true, dC:true }, S.on || {});
  if (typeof S.ans !== "string") S.ans = "";
  var pv = null, anim = null, busy = false;
  function chip(attr, v, html, on){ return '<button type="button" class="chip" data-' + attr + '="' + v + '" data-k="ec' + attr + v + '" aria-pressed="' + (on ? "true" : "false") + '">' + html + "</button>"; }
  host.innerHTML = '<div class="ec-dash">' +
    '<div class="ec-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="ec-g" data-g="price"><p class="ec-gcap">' + C.gcap.price + '</p><div class="plot-wrap"><canvas class="plot" id="ec-c1" role="img" aria-label="Revenue, cost and profit by price"></canvas></div>' +
        '<p class="ec-legend"><span class="ec-lg"><i class="ec-sw ec-sw-r"></i>' + C.curves.R + '</span><span class="ec-lg"><i class="ec-sw ec-sw-c"></i>' + C.curves.C + '</span><span class="ec-lg"><i class="ec-sw ec-sw-p"></i>' + C.curves.P + "</span></p></div>" +
      '<div class="ec-g" data-g="qty"><p class="ec-gcap">' + C.gcap.qty + '</p><div class="plot-wrap"><canvas class="plot wide" id="ec-c2" role="img" aria-label="Marginal revenue and marginal cost by quantity"></canvas></div>' +
        '<p class="ec-legend"><span class="ec-lg"><i class="ec-sw ec-sw-r"></i>' + m("R′(x) = 50 - x/2") + '</span><span class="ec-lg"><i class="ec-sw ec-sw-d"></i><span id="ec-mclg"></span></span><span class="ec-lg"><i class="ec-sw ec-sw-z"></i>' + C.zone.up + "</span></p></div>" +
    "</div>" +
    '<div class="ec-side" id="ec-side">' +
      '<div class="refresh ec-model"><p>' + C.model + '</p><p class="tiny ec-now" id="ec-now"></p></div>' +
      '<div class="seg-wrap"><span class="seg" role="group" aria-label="View">' + C.views.map(function(v){
        return '<button type="button" data-view="' + v.id + '" data-k="ecv' + v.id + '" aria-pressed="false"><span class="ec-long">' + v.t + '</span><span class="ec-short">' + v.short + "</span></button>"; }).join("") + "</span></div>" +
      '<label class="slider ec-sl" id="ec-psl"><span class="slider-top"><span>' + C.sl.price + '</span><output id="ec-pout"></output></span>' +
        '<input type="range" id="ec-p" min="10" max="50" step="1" style="accent-color:var(--ink)" aria-label="Price in dollars"></label>' +
      '<label class="slider ec-sl" id="ec-xsl"><span class="slider-top"><span>' + C.sl.qty + '</span><output id="ec-xout"></output></span>' +
        '<input type="range" id="ec-x" min="0" max="200" step="5" style="accent-color:var(--ink)" aria-label="Quantity: hoodies sold"></label>' +
      '<div class="ec-row" role="group" aria-label="' + MV.esc(MV.plain(C.fixedLabel)) + '"><span class="ec-rl">' + C.fixedLabel + "</span>" + chip("fc", 800, "$800") + chip("fc", 1200, "$1200") + "</div>" +
      '<div class="ec-row" role="group" aria-label="' + MV.esc(MV.plain(C.unitLabel)) + '"><span class="ec-rl">' + C.unitLabel + "</span>" + chip("uc", 10, "$10") + chip("uc", 14, "$14") + "</div>" +
      '<div class="ec-row" role="group" aria-label="' + MV.esc(MV.plain(C.curvesLabel)) + '"><span class="ec-rl">' + C.curvesLabel + "</span>" +
        ["R", "C", "P", "dR", "dC"].map(function(k){ return chip("cv", k, C.curves[k]); }).join("") + "</div>" +
      '<div class="ec-ans"><label for="ec-ans">' + C.ansLabel + '</label><span class="ec-ans-in"><span class="ec-pre" aria-hidden="true">$</span><input id="ec-ans" class="numin" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(S.ans) + '"></span>' +
        '<p class="tiny muted">' + C.ansNote + "</p></div>" +
      '<dl class="read ec-read" id="ec-read" aria-live="polite"></dl>' +
    "</div></div>";
  var dash = $(".ec-dash", host), p1 = new MV.Plot($("#ec-c1"), { xmin:0, xmax:53, ymin:-2000, ymax:3600 }), p2 = new MV.Plot($("#ec-c2"), { xmin:0, xmax:205, ymin:-55, ymax:55 });
  function H(){ return hoodie(S.u, S.F); }
  function state(){ var h = H(), p = S.p, x = h.x(p); return { h:h, p:p, x:x, R:h.R(p), C:h.C(p), P:h.P(p), mr:h.mr(x), mc:S.u }; }

  function draw1(){
    var h = H(), d = state(), pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), v = padView(p1, 53, -2000, 3600, 50);
    var sc = { view:v, xTicks:{ step:10, fmt:xfmt(money) }, yTicks:{ step:1000, fmt:money }, curves:[], segments:[], points:[], labels:[] };
    if (pv && pv.ghostF != null) { var g = hoodie(S.u, pv.ghostF); sc.curves.push({ f:g.P, color:ink2, width:2, dash:[6, 6], domain:[10, 50] }); }
    if (S.on.C) sc.curves.push({ f:h.C, color:ink2, width:2.4, dash:[8, 6], domain:[10, 50] });
    if (S.on.R) sc.curves.push({ f:h.R, color:pen, width:3, domain:[10, 50] });
    if (S.on.P) sc.curves.push({ f:h.P, color:ink, width:3.6, domain:[10, 50] });
    sc.segments.push({ x1:d.p, y1:v.ymin, x2:d.p, y2:v.ymax, color:ink2, width:1.5, dash:[4, 5] });
    if (S.on.R) { sc.labels.push({ x:10, y:h.R(10), text:"R", dx:-8, align:"right", color:pen, font:mfont() }); sc.points.push({ x:d.p, y:d.R, r:5.5, color:pen }); }
    if (S.on.C) { sc.labels.push({ x:10, y:h.C(10), text:"C", dx:-8, align:"right", color:ink2, font:mfont() }); sc.points.push({ x:d.p, y:d.C, r:5, color:ink2 }); }
    if (S.on.P) { sc.labels.push({ x:10, y:h.P(10), text:"P", dx:-8, align:"right", color:ink, font:mfont() }); sc.points.push({ x:d.p, y:d.P, r:6, color:ink }); }
    if (pv) {
      (pv.pts || []).forEach(function(q){ sc.points.push({ x:q.x, y:q.y, r:6, open:true, color:q.color || pen }); sc.labels.push({ x:q.x, y:q.y, text:q.label, dx:q.dx || -10, dy:q.dy || -16, align:q.align || "right", bg:true, color:q.color || pen, font:ui(13) }); });
      if (pv.peakR) { sc.segments.push({ x1:25, y1:2500, x2:25, y2:0, color:pen, width:1.8, dash:[6, 5] }); sc.labels.push({ x:25, y:2500, text:C.pv.peakR, dy:-18, align:"center", bg:true, color:pen, font:ui(13) }); }
      if (pv.peakP) { sc.segments.push({ x1:30, y1:h.P(30), x2:30, y2:0, color:ink, width:1.8, dash:[6, 5] }); sc.labels.push({ x:30, y:h.P(30), text:pv.peakP === true ? C.pv.peakP : pv.peakP, dx:12, dy:-18, align:"left", bg:true, color:ink, font:ui(13) }); }
    }
    sc.after = function(ctx, pl){ axisName(ctx, pl, "price (dollars)"); };
    sc.describe = "Revenue (blue), cost (dashed) and profit (thick) against the price p from $10 to $50, with fixed cost " + money(S.F) + " and " + money(S.u) + " per hoodie. At " + money(d.p) + ": revenue " + money(d.R) + ", cost " + money(d.C) + ", profit " + money(d.P) +
      ". Profit curve peaks at " + money(h.max) + " when the price is " + money(h.best) + ". Revenue peaks at $2500 when the price is $25.";
    p1.draw(sc);
  }
  function draw2(){
    var h = H(), d = state(), pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2"), v = padView(p2, 205, -55, 55, 40), xc = 2 * (50 - S.u);
    var MC = function(){ return S.u; };
    var sc = { view:v, xTicks:{ step:20, fmt:xfmt() }, yTicks:{ step:20, fmt:money }, regions:[], curves:[], segments:[], points:[], labels:[] };
    if (S.on.dR && S.on.dC) sc.regions.push({ f:h.mr, g:MC, x0:0, x1:xc, where:"above", color:css("--hi-soft") });
    if (S.on.dC) sc.curves.push({ f:MC, color:f3, width:2.6, domain:[0, 200] });
    if (S.on.dR) sc.curves.push({ f:h.mr, color:pen, width:3, domain:[0, 200] });
    sc.segments.push({ x1:d.x, y1:v.ymin, x2:d.x, y2:v.ymax, color:ink2, width:1.5, dash:[4, 5] });
    if (S.on.dR) { sc.points.push({ x:d.x, y:d.mr, r:5.5, color:pen }); sc.labels.push({ x:150, y:h.mr(150), text:"R′", dx:10, dy:-10, align:"left", color:pen, font:mfont() }); }
    if (S.on.dC) { sc.points.push({ x:d.x, y:S.u, r:5.5, color:f3 }); sc.labels.push({ x:200, y:S.u, text:"C′", dx:-4, dy:-14, align:"right", color:f3, font:mfont() }); }
    sc.after = function(ctx, pl){
      axisName(ctx, pl, "hoodies"); ctx.save();
      if (S.on.dR && S.on.dC) {
        ctx.font = ui(12); ctx.fillStyle = ink; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        ctx.fillText("profit rising", pl.X(0) + 5, pl.Y(S.u) - 3);
        ctx.textBaseline = "top"; ctx.fillStyle = ink2; ctx.fillText("profit falling", Math.min(pl.X(Math.max(xc + 24, 104)), pl.W - 90), pl.Y(S.u) + 4);
      }
      ctx.restore();
    };
    var tr = d.mr - d.mc;
    sc.describe = "Marginal revenue R′(x) = 50 − x/2 and marginal cost C′(x) = " + num(S.u) + " against the number of hoodies x. They cross at x = " + num(xc) + "; the gap is shaded where R′ > C′, where profit is still rising. Probe at x = " + num(d.x, 2) + ": R′ = " + money(d.mr) + ", C′ = " + money(d.mc) + ", profit " + (near(tr, 0) ? "level" : tr > 0 ? "rising" : "falling") + ".";
    p2.draw(sc);
  }
  function readout(){
    var d = state(), tr = d.mr - d.mc, R = C.rows;
    var trend = near(tr, 0, 1e-9) ? C.trend.level : tr > 0 ? tpl(C.trend.up, { v:money(tr) }) : tpl(C.trend.down, { v:money(-tr) });
    $("#ec-read").innerHTML = MV.readoutHTML([[R.price, money(d.p)], [R.sold, num(d.x, 2)], [R.rev, money(d.R)], [R.cost, money(d.C)],
      [R.profit, money(d.P) + (d.P < -1e-9 ? " " + C.loss : "")], [R.mr, money(d.mr) + " " + C.perHoodie], [R.mc, money(d.mc) + " " + C.perHoodie], [R.trend, trend]]);
  }
  function controls(){
    dash.setAttribute("data-view", S.view);
    $$("[data-view]", dash).forEach(function(b){ if (b.tagName === "BUTTON") pressed(b, b.dataset.view === S.view); });
    $("#ec-psl").hidden = S.view !== "price"; $("#ec-xsl").hidden = S.view !== "qty";
    var x = 200 - 4 * S.p;
    $("#ec-p").value = Math.round(S.p); $("#ec-x").value = Math.round(x / 5) * 5;
    $("#ec-pout").textContent = money(S.p); $("#ec-xout").textContent = num(x, 2);
    $$("[data-fc]", dash).forEach(function(b){ pressed(b, +b.dataset.fc === S.F); });
    $$("[data-uc]", dash).forEach(function(b){ pressed(b, +b.dataset.uc === S.u); });
    $$("[data-cv]", dash).forEach(function(b){ pressed(b, !!S.on[b.dataset.cv]); });
    $("#ec-now").innerHTML = C.modelNow + " " + m("C = " + num(Math.round(S.F)) + " + " + S.u + "x");
    $("#ec-mclg").innerHTML = m("C′(x) = " + S.u);
  }
  function paint(){ controls(); readout(); draw1(); draw2(); }
  function update(){ pv = null; api.save(); paint(); MV.changed(); }
  function setBusy(b){ busy = b; $$("#ec-side button, #ec-side input", host).forEach(function(el){ el.disabled = b; }); }
  p1.render = draw1; p2.render = draw2;
  dash.addEventListener("input", function(e){
    var t = e.target; if (busy) return;
    if (t.id === "ec-p") { S.p = +t.value; update(); }
    else if (t.id === "ec-x") { S.p = 50 - (+t.value) / 4; update(); }
    else if (t.id === "ec-ans") { S.ans = t.value; api.save(); MV.changed(); }
  });
  dash.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.view) S.view = b.dataset.view;
    else if (b.dataset.fc) S.F = +b.dataset.fc;
    else if (b.dataset.uc) S.u = +b.dataset.uc;
    else if (b.dataset.cv) S.on[b.dataset.cv] = !S.on[b.dataset.cv];
    else return;
    update();
  });
  paint();

  // challenges (plan: exact tests and named wrong states)
  function chalMsgs(id){ return (C.challenges.filter(function(c){ return c.id === id; })[0] || {}).msgs || {}; }
  function challenge(id){
    var M = chalMsgs(id), p = S.p, v = parseMoney(S.ans), has = v != null && !isNaN(v);
    if (id === "tc1") {
      if (near(p, 25) && has && near(v, 2500, 1e-6)) return { ok:true };
      if (near(p, 30)) return { ok:false, msg:M.p30 };
      if (near(p, 25)) return { ok:false, msg:has ? M.value : M.empty };
      return { ok:false };
    }
    if (id === "tc2") {
      if (S.u !== 10 || S.F !== 800) return { ok:false, msg:M.cost };
      if (near(p, 30) && has && near(v, 800, 1e-6)) return { ok:true };
      if (has && near(v, 2400, 1e-6)) return { ok:false, msg:M.rev };
      if (near(p, 25)) return { ok:false, msg:M.p25 };
      if (near(p, 30)) return { ok:false, msg:has ? M.value : M.empty };
      return { ok:false };
    }
    if (id === "tc3") {
      if (S.u !== 14 || S.F !== 800) return { ok:false, msg:M.cost };
      if (near(p, 32) && has && near(v, 496, 1e-6)) return { ok:true };
      if (near(p, 34)) return { ok:false, msg:M.p34 };
      if (near(p, 30)) return { ok:false, msg:M.p30 };
      if (near(p, 32)) return { ok:false, msg:has ? M.value : M.empty };
      return { ok:false };
    }
    return { ok:false };
  }

  // predictions: start states come from content (p.start); reveals animate the probe, the fixed cost or the peaks
  function tweenP(a, b, dur, cb){
    anim = MV.tween({ dur:dur, ease:lin, step:function(t){ S.p = a + (b - a) * t; controls(); readout(); draw1(); draw2(); }, done:function(){ S.p = b; anim = null; cb(); } });
  }
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        pv = null; var s = p.start || {};
        S.view = s.view || "price"; S.p = s.p; S.u = s.u; S.F = s.F; S.on = { R:true, C:true, P:true, dR:true, dC:true };
        setBusy(true); api.save(); paint();
      },
      run:function(p, done){
        var ink = css("--ink");
        function fin(){ anim = null; setBusy(false); api.save(); paint(); MV.changed(); done(); }
        if (p.id === "p1") { pv = { pts:[{ x:20, y:2400, label:"$2400" }] }; tweenP(20, 25, 1400, function(){ pv.pts.push({ x:25, y:2500, label:"$2500", dx:10, align:"left" }); fin(); }); }
        else if (p.id === "p2") tweenP(10, 50, 2200, function(){ MV.wait(250, function(){ tweenP(50, 25, 1300, function(){ pv = { peakR:true }; fin(); }); }); });
        else if (p.id === "p3") { pv = { pts:[{ x:25, y:700, label:"$700 at $25", color:ink, dy:22 }] }; tweenP(25, 30, 1300, function(){ pv.peakP = true; fin(); }); }
        else if (p.id === "p4") {
          pv = { ghostF:800 };
          anim = MV.tween({ dur:1600, step:function(t){ S.F = 800 + 400 * t; controls(); readout(); draw1(); }, done:function(){ S.F = 1200; pv.peakP = "$400, still at $30"; fin(); } });
        }
        else fin();
      }
    },
    challenge:function(id){ return challenge(id); }
  };
}

// =====================================================================================================================
// @component V11 signChart (adapted from MCV4U 11 / 14 for optimization) — one row per factor of the numerator and the
// denominator of the derivative, the derivative's sign, and a behaviour row for the objective (↗ increasing / ↘ decreasing,
// and the word for the critical number: "least" or "greatest"). The domain runs from lo to hi (hi may be Infinity); the
// table scrolls inside its box on phones.
//   signChartHTML({ v:"x", lo, hi, crit:[c], top:[{s, f}], bot:[{s, f}], d:function(x), dLabel, fLabel, critWord, unit })
function signChartHTML(o){
  var edges = [o.lo].concat(o.crit, [o.hi]), cols = [], i;
  for (i = 0; i + 1 < edges.length; i++) {
    var a = edges[i], b = edges[i + 1];
    cols.push({ iv:true, a:a, b:b, mid:isFinite(b) ? (a + b) / 2 : a + 1 });
    if (i < o.crit.length) cols.push({ iv:false, x:o.crit[i] });
  }
  function end(v){ return v === Infinity ? "∞" : num(v); }
  function sg(v){ return v > 1e-12 ? "+" : v < -1e-12 ? MINUS : "0"; }
  function frow(F, kind){
    return '<tr><th scope="row">' + m(F.s) + '<span class="ec-sc-k">' + kind + "</span></th>" + cols.map(function(c){
      return "<td>" + sg(F.f(c.iv ? c.mid : c.x)) + "</td>"; }).join("") + "</tr>";
  }
  var h = '<div class="tbl-wrap ec-sc-wrap"><table class="vt ec-sct"><caption class="vh">Sign chart of ' + MV.plain(o.dLabel) + "</caption><thead><tr><th scope=\"col\">" + m(o.v) + "</th>" +
    cols.map(function(c){ return '<th scope="col">' + (c.iv ? "(" + end(c.a) + ", " + end(c.b) + ")" : end(c.x)) + "</th>"; }).join("") + "</tr></thead><tbody>";
  h += o.top.map(function(F){ return frow(F, "numerator"); }).join("") + o.bot.map(function(F){ return frow(F, "denominator"); }).join("");
  h += '<tr class="ec-sc-d"><th scope="row">' + o.dLabel + "</th>" + cols.map(function(c){ return "<td>" + (c.iv ? sg(o.d(c.mid)) : "0") + "</td>"; }).join("") + "</tr>";
  h += '<tr><th scope="row">' + o.fLabel + "</th>" + cols.map(function(c){
    if (!c.iv) return '<td class="ec-sc-u">' + o.critWord + "</td>";
    var up = o.d(c.mid) > 0;
    return '<td class="ec-sc-ar"><span aria-hidden="true">' + (up ? "↗" : "↘") + '</span><span class="vh">' + (up ? "increasing" : "decreasing") + "</span></td>";
  }).join("") + "</tr></tbody></table></div>";
  return h;
}
// ------------------------------------------------- end of V11 signChart ---------------------------------------------------------

// =====================================================================================================================
// @component V10 shapeStage — a figure driven by one variable beside its objective graph (MCV4U 16–19, 28, 32): the objective
// in --pen, an optional feasible-domain band (the curve is dashed outside it), extra curves, and the current point with a
// drag handle (arrow keys step it; Shift for big steps). A slider under the stage drives the same value. Self-contained:
//   var st = shapeStage(host, { fig:"html", cap:"graph caption html", sl:"slider label html", aria:"slider aria", min, max, step,
//     big, value, fmt(v) -> text, view(plot) -> {xmin, xmax, ymin, ymax}, f, plot:[a, b], band:[a, b], xTicks, yTicks, xName,
//     extra(v) -> scene additions {curves, points, labels, segments}, describe(v), handle(v) -> aria label, onChange(v) });
//   st.get(), st.set(v), st.redraw()
function shapeStage(host, o){
  var v = o.value;
  host.innerHTML = '<div class="ec-ss"><div class="ec-ss-fig">' + o.fig + '</div><div class="ec-ss-g"><p class="ec-gcap">' + o.cap + '</p><div class="plot-wrap"><canvas class="plot" role="img" aria-label="Objective graph"></canvas></div></div></div>' +
    '<label class="slider ec-ss-sl"><span class="slider-top"><span>' + o.sl + "</span><output></output></span>" +
    '<input type="range" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" style="accent-color:var(--ink)" aria-label="' + MV.esc(o.aria) + '"></label>';
  var cv = $("canvas", host), out = $(".ec-ss-sl output", host), inp = $(".ec-ss-sl input", host);
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 });
  function snap(x){ var s = Math.round((x - o.min) / o.step) * o.step + o.min; return clamp(Math.round(s * 1e6) / 1e6, o.min, o.max); }
  plot.render = function(){
    var pen = css("--pen"), ink2 = css("--ink-2"), view = o.view(plot), y = o.f(v);
    var sc = { view:view, xTicks:o.xTicks, yTicks:o.yTicks, bands:[], curves:[], segments:[], points:[], labels:[] };
    if (o.band) { sc.bands.push({ x0:o.band[0], x1:o.band[1], color:css("--hi-soft") });
      sc.curves.push({ f:o.f, color:pen, width:2, dash:[6, 6], domain:o.plot }); sc.curves.push({ f:o.f, color:pen, width:3, domain:o.band }); }
    else sc.curves.push({ f:o.f, color:pen, width:3, domain:o.plot });
    var ex = o.extra ? o.extra(v) : {};
    ["curves", "segments", "points", "labels"].forEach(function(k){ if (ex[k]) sc[k] = sc[k].concat(ex[k]); });
    sc.segments.push({ x1:v, y1:view.ymin, x2:v, y2:y, color:ink2, width:1.5, dash:[4, 5] });
    sc.points.push({ x:v, y:y, r:6.5, color:css("--ink"), ring:true });
    sc.after = function(ctx, pl){ if (o.xName) axisName(ctx, pl, o.xName); };
    sc.describe = o.describe(v);
    plot.draw(sc);
  };
  MV.drag(plot, { axis:"x", step:{ x:o.step, y:1 }, big:o.big || 5,
    handles:function(){ return [{ id:"pt", x:v, y:o.f(v), label:o.handle(v) }]; },
    move:function(id, x){ set(snap(x), true); } });
  inp.addEventListener("input", function(){ set(+inp.value, true); });
  function set(x, user){ v = snap(x); inp.value = v; out.textContent = o.fmt(v); plot.render(); if (user && o.onChange) o.onChange(v); }
  set(v);
  return { get:function(){ return v; }, set:set, redraw:function(){ plot.render(); } };
}
// ------------------------------------------------- end of V10 shapeStage --------------------------------------------------------

// ---------- Part 3: science optimization stations ----------
function stackSVG(keys, max){
  return '<svg class="ec-bar" viewBox="0 0 150 250" aria-hidden="true" data-max="' + max + '"><line class="ec-bar-ax" x1="18" y1="236" x2="132" y2="236"/>' +
    keys.map(function(k){ return '<rect class="ec-seg ec-seg-' + k + '" data-seg="' + k + '" x="45" width="60" y="236" height="0"/>'; }).join("") +
    '<line class="ec-bar-top" x1="38" x2="112" y1="236" y2="236"/><text class="ec-bar-tot" x="75" y="22" text-anchor="middle"></text></svg>';
}
function setStack(box, keys, vals, total){
  var svg = $("svg.ec-bar", box); if (!svg) return;
  var max = +svg.dataset.max, sc = 200 / max, y = 236;
  keys.forEach(function(k, i){ var hgt = Math.max(0, vals[i] * sc), r = svg.querySelector('[data-seg="' + k + '"]'); y -= hgt; r.setAttribute("y", y); r.setAttribute("height", hgt); });
  var top = svg.querySelector(".ec-bar-top"); top.setAttribute("y1", y); top.setAttribute("y2", y);
  var t = svg.querySelector(".ec-bar-tot"); t.setAttribute("y", Math.max(16, y - 8)); t.textContent = total;
}
function partsHTML(parts){ return '<ul class="ec-parts">' + parts.map(function(p){ return '<li><i class="ec-sw ec-seg-' + p.k + '"></i><span>' + p.t + '</span><b data-pv="' + p.k + '"></b></li>'; }).join("") + "</ul>"; }
var HEATER = '<svg class="ec-heat" viewBox="0 0 250 170" aria-hidden="true"><defs><radialGradient id="ec-glow-g"><stop offset="0" class="ec-glow-s0"/><stop offset="1" class="ec-glow-s1"/></radialGradient></defs>' +
  '<rect class="ec-batt" x="12" y="52" width="70" height="66" rx="6"/><rect class="ec-batt-t" x="38" y="44" width="18" height="8" rx="2"/>' +
  '<text class="ec-svg-t" x="47" y="80" text-anchor="middle">12 V</text><text class="ec-svg-s" x="47" y="100" text-anchor="middle">4 Ω inside</text>' +
  '<path class="ec-wire" d="M82 70 H150 M82 100 H150"/>' +
  '<circle class="ec-glow" id="ec-glow" cx="190" cy="85" r="62"/>' +
  '<rect class="ec-htr" x="150" y="45" width="80" height="80" rx="8"/><path class="ec-coil" id="ec-coil" d="M160 85 l7 -18 l7 36 l7 -36 l7 36 l7 -36 l7 36 l7 -36 l7 18"/>' +
  '<text class="ec-svg-t" id="ec-heat-t" x="190" y="150" text-anchor="middle"></text></svg>';
function part3(host, api){
  var S = api.S, P3 = api.content, ST = P3.stations;
  if (["s1", "s2", "s3"].indexOf(S.st) < 0) S.st = "s1";
  if (!(S.x1 >= 5 && S.x1 <= 50)) S.x1 = 8;
  if (!(S.v2 >= 40 && S.v2 <= 100)) S.v2 = 50;
  if (!(S.r3 >= 0 && S.r3 <= 20)) S.r3 = 1;
  S.rev1 = !!S.rev1;
  host.innerHTML = '<div class="chips ec-stns" role="group" aria-label="Choose a station">' + ST.map(function(s, i){
    return '<button type="button" class="fchip ec-stchip" data-st="' + s.id + '" data-k="ecst' + s.id + '" aria-pressed="false">' + (i + 1) + ". " + s.chip + "</button>"; }).join("") + '</div><div id="ec-stn"></div>';
  var box = $("#ec-stn", host);
  function stn(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function algHTML(s, chart){
    return '<details class="alg ec-alg"><summary>' + P3.algSummary + '</summary><ol class="ec-alg-steps">' + s.alg.map(function(t){ return "<li>" + t + "</li>"; }).join("") + "</ol>" +
      '<p class="ec-sch">' + P3.signTitle + "</p>" + chart + "</details>";
  }
  function trendRow(s, d, best){ return best ? '<span class="ec-best">✓ ' + s.trend.best + "</span>" : d < 0 ? s.trend.down : s.trend.up; }
  function render(){
    $$("[data-st]", host).forEach(function(b){ pressed(b, b.dataset.st === S.st); });
    var s = stn(S.st);
    var h = '<div class="ec-stp"><h3>' + s.title + "</h3><p>" + s.text + '</p><p class="how">' + s.how + '</p><p class="banner" id="ec-sbn" aria-live="polite"></p><div id="ec-ssh"></div><dl class="read ec-sread" id="ec-sread" aria-live="polite"></dl>';
    if (s.id === "s1") h += '<div class="q-actions"><button type="button" class="btn ghost sm" id="ec-rev" data-k="ecrev" aria-pressed="' + S.rev1 + '">' + s.reveal + '</button></div><div id="ec-revt" aria-live="polite"></div>';
    box.innerHTML = h + '<div id="ec-algh"></div></div>';
    var sh = $("#ec-ssh", box), read = $("#ec-sread", box), bn = $("#ec-sbn", box);
    if (s.id === "s1") {
      var A = function(x){ return x + 6 + 400 / x; }, keys = ["a", "c", "b"];
      shapeStage(sh, { fig:stackSVG(keys, 100) + partsHTML(s.parts), cap:s.graph, sl:s.sl, aria:"Number of chairs", min:5, max:50, step:1, big:5, value:S.x1,
        fmt:function(x){ return num(x) + " chairs"; }, f:A, plot:[5, 50], xName:"chairs",
        view:function(pl){ return padView(pl, 52, 0, 100, 40, 40); }, xTicks:{ step:10, fmt:xfmt() }, yTicks:{ step:20, fmt:money },
        extra:function(){ if (!S.rev1) return {}; var f3 = css("--f3"); return { curves:[{ f:function(x){ return 2 * x + 6; }, color:f3, width:2.6, domain:[5, 47] }],
          points:[{ x:20, y:46, r:5.5, open:true, color:f3 }], labels:[{ x:44, y:94, text:"C′(x)", dx:-8, align:"right", color:f3, font:mfont() }] }; },
        handle:function(x){ return num(x) + " chairs: average cost " + money(A(x)) + " per chair"; },
        describe:function(x){ return "Average cost A(x) = x + 6 + 400/x for 5 to 50 chairs; lowest point (20, 46). Current point: " + num(x) + " chairs, " + approx(A(x)) + money(A(x)) + " per chair." + (S.rev1 ? " The marginal cost C′(x) = 2x + 6 (teal) crosses A(x) at (20, 46)." : ""); },
        onChange:function(x){ S.x1 = x; api.save(); upd(x); } });
      var upd = function(x){
        var a = 400 / x, best = near(x, 20), dA = 1 - 400 / (x * x);
        setStack(sh, keys, [a, 6, x], approx(A(x)) + money(A(x)));
        $('[data-pv="a"]', sh).textContent = approx(a) + money(a); $('[data-pv="c"]', sh).textContent = "$6"; $('[data-pv="b"]', sh).textContent = money(x);
        var rows = [[s.rows.x, num(x)], [s.rows.A, approx(A(x)) + money(A(x)) + " per chair"]];
        if (S.rev1) rows.push([s.rows.mc, money(2 * x + 6) + " per chair"]);
        rows.push([s.rows.trend, trendRow(s, dA, best)]);
        read.innerHTML = MV.readoutHTML(rows);
        bn.className = "banner" + (best ? " good" : ""); bn.textContent = "";
      };
      upd(S.x1);
      var revt = function(){ $("#ec-revt", box).innerHTML = S.rev1 ? '<div class="refresh ec-revbox"><p>' + s.revealText + '</p><p class="tiny" style="margin-top:6px">' + s.foot + "</p></div>" : ""; };
      revt();
      $("#ec-algh", box).innerHTML = algHTML(s, signChartHTML({ v:"x", lo:0, hi:Infinity, crit:[20], dLabel:m("A′(x)"), fLabel:m("A(x)"), critWord:"least",
        top:[{ s:"x - 20", f:function(x){ return x - 20; } }, { s:"x + 20", f:function(x){ return x + 20; } }], bot:[{ s:"x^2", f:function(x){ return x * x; } }],
        d:function(x){ return 1 - 400 / (x * x); } }));
      $("#ec-rev", box).addEventListener("click", function(){ S.rev1 = !S.rev1; api.save(); pressed(this, S.rev1); revt(); upd(S.x1); MV.redrawAll(); });
    } else if (s.id === "s2") {
      var Cv = function(v){ return 25600 / v + 4 * v; }, k2 = ["a", "b"];
      shapeStage(sh, { fig:stackSVG(k2, 850) + partsHTML(s.parts), cap:s.graph, sl:s.sl, aria:"Speed in kilometres per hour", min:40, max:100, step:1, big:10, value:S.v2,
        fmt:function(v){ return num(v) + " km/h"; }, f:Cv, plot:[25, 110], band:[40, 100], xName:"km/h",
        view:function(pl){ return padView(pl, 112, 0, 1150, 44, 40); }, xTicks:{ step:20, fmt:xfmt() }, yTicks:{ step:200, fmt:money },
        extra:function(){ return { labels:[{ x:70, y:1100, text:"legal speeds", align:"center", color:css("--ink-2"), font:ui(12) }] }; },
        handle:function(v){ return num(v) + " km/h: trip cost " + money(Cv(v)); },
        describe:function(v){ return "Trip cost C(v) = 25 600/v + 4v for speeds from 25 to 110 km/h, solid on the legal speeds 40 to 100 km/h; lowest point (80, 640). Current point: " + num(v) + " km/h, " + approx(Cv(v)) + money(Cv(v)) + "."; },
        onChange:function(v){ S.v2 = v; api.save(); upd2(v); } });
      var upd2 = function(v){
        var drv = 25600 / v, fuel = 4 * v, best = near(v, 80), t = 400 / v;
        setStack(sh, k2, [drv, fuel], approx(Cv(v)) + money(Cv(v)));
        $('[data-pv="a"]', sh).textContent = approx(drv) + money(drv); $('[data-pv="b"]', sh).textContent = money(fuel);
        read.innerHTML = MV.readoutHTML([[s.rows.v, num(v) + " km/h"], [s.rows.time, approx(t) + num(t, 2) + " h"], [s.rows.C, approx(Cv(v)) + money(Cv(v))], [s.rows.trend, trendRow(s, 4 - 25600 / (v * v), best)]]);
        bn.className = "banner" + (best ? " good" : ""); bn.textContent = "";
      };
      upd2(S.v2);
      $("#ec-algh", box).innerHTML = algHTML(s, signChartHTML({ v:"v", lo:40, hi:100, crit:[80], dLabel:m("C′(v)"), fLabel:m("C(v)"), critWord:"least",
        top:[{ s:"4", f:function(){ return 4; } }, { s:"v - 80", f:function(v){ return v - 80; } }, { s:"v + 80", f:function(v){ return v + 80; } }], bot:[{ s:"v^2", f:function(v){ return v * v; } }],
        d:function(v){ return 4 - 25600 / (v * v); } }));
    } else {
      var Pw = function(R){ return 144 * R / ((R + 4) * (R + 4)); };
      shapeStage(sh, { fig:HEATER, cap:s.graph, sl:s.sl, aria:"Load resistance in ohms", min:0, max:20, step:0.5, big:4, value:S.r3,
        fmt:function(R){ return num(R) + " Ω"; }, f:Pw, plot:[0, 20], xName:"Ω",
        view:function(pl){ return padView(pl, 21, 0, 10.5, 30, 40); }, xTicks:{ step:2, fmt:xfmt() }, yTicks:{ step:2 },
        handle:function(R){ return num(R) + " ohms: power " + num(Pw(R), 2) + " watts"; },
        describe:function(R){ return "Power P(R) = 144R/(R + 4)² for loads from 0 to 20 ohms; highest point (4, 9). Current point: " + num(R) + " ohms, " + approx(Pw(R)) + num(Pw(R), 2) + " W."; },
        onChange:function(R){ S.r3 = R; api.save(); upd3(R); } });
      var upd3 = function(R){
        var P = Pw(R), best = near(R, 4), g = $("#ec-glow", sh), c = $("#ec-coil", sh);
        if (g) g.style.opacity = (P / 9).toFixed(3);
        if (c) c.classList.toggle("hot", P > 4.5);
        $("#ec-heat-t", sh).textContent = approx(P) + num(P, 2) + " W";
        read.innerHTML = MV.readoutHTML([[s.rows.R, num(R) + " Ω"], [s.rows.P, approx(P) + num(P, 2) + " W"], [s.rows.trend, trendRow(s, 4 - R, best)]]);
        bn.className = "banner" + (best ? " good" : ""); bn.textContent = best ? MV.plain(s.banner) : "";
      };
      upd3(S.r3);
      $("#ec-algh", box).innerHTML = algHTML(s, signChartHTML({ v:"R", lo:0, hi:Infinity, crit:[4], dLabel:m("P′(R)"), fLabel:m("P(R)"), critWord:"greatest",
        top:[{ s:"144", f:function(){ return 144; } }, { s:"4 - R", f:function(R){ return 4 - R; } }], bot:[{ s:"(R + 4)^3", f:function(R){ return Math.pow(R + 4, 3); } }],
        d:function(R){ return 144 * (4 - R) / Math.pow(R + 4, 3); } }));
    }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-st]"); if (!b) return;
    S.st = b.dataset.st; api.save(); render();
  });
  render();
}

// ---------- Practice 2: Solve it ----------
// @component N4 moneyBoxes (adapted from MCV4U 03 unitBoxes) — labelled number boxes per item with a $ in front and units
// after (items: boxes:[{k, label, pre, unit}], answer:{k:value}, wrong:[{k, v, fb}], wrongDefault); "30", "30.00", "$30" and
// "122 500" are all read as numbers; per-box named feedback, three-level hints where the item has them, first-try scoring.
function solve(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ return st.items[id] || (st.items[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q ec-sq" data-sq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="ec-sb"></div><div class="ec-sc"></div></div>';
  }).join("");
  function paintBoxes(it){
    var x = ist(it.id), el = $('[data-sq="' + it.id + '"] .ec-sb', host);
    MV.keepFocus(el, function(){
      el.innerHTML = it.boxes.map(function(b){
        return '<div class="ec-brow"><label for="sq-' + it.id + b.k + '">' + b.label + '</label><span class="ec-bin">' + (b.pre ? '<span class="ec-pre">' + b.pre + "</span>" : '<span class="ec-pre" aria-hidden="true" style="visibility:hidden">$</span>') +
          '<input class="numin" id="sq-' + it.id + b.k + '" data-bx="' + b.k + '" data-k="' + it.id + b.k + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.v[b.k] || "") + '"' + (x.solved ? " disabled" : "") + ">" +
          (b.unit ? '<span class="ec-u">' + b.unit + "</span>" : "") + "</span></div>";
      }).join("");
    });
  }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-sq="' + it.id + '"] .ec-sc', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  a.items.forEach(function(it){ paintBoxes(it); paintCtl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), named = [], right = 0, wrongN = 0;
    for (var i = 0; i < it.boxes.length; i++) {
      var b = it.boxes[i], raw = String(x.v[b.k] || "").trim();
      if (!raw) return { err:"Fill in every box first." };
      var v = parseMoney(raw);
      if (v == null || isNaN(v)) return { err:"Type a number in each box, such as 30, 30.00 or 122 500." };
      if (near(v, ans[b.k], 1e-6 * Math.max(1, Math.abs(ans[b.k])))) right++;
      else { wrongN++; var w = (it.wrong || []).filter(function(z){ return z.k === b.k && near(z.v, v, 1e-6); })[0]; if (w) named.push(w.fb); }
    }
    if (!wrongN) return { ok:true };
    var msg = named.length ? named.join(" ") : it.wrongDefault ? it.wrongDefault : (right ? "One of your answers is right; check the other box." : "Check your working.");
    return { ok:false, msg:msg };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var box = t.closest("[data-sq]"); ist(box.dataset.sq).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var box = e.target.closest("[data-sq]"), b = box && box.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-sq]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.sq; })[0], x = ist(it.id);
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

// ---------- Performance task: Set up shop ----------
var task = (function(){
  var api, plot, T, hooked = false;
  function read(){ var s = api ? api.S : {}; return { u:+s.u || 0, F:+s.F || 0 }; }
  function draw(){
    var d = read(), h = hoodie(d.u, d.F), pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), v = padView(plot, 52, -1200, 2800, 50);
    plot.draw({ view:v, xTicks:{ step:10, fmt:xfmt(money) }, yTicks:{ step:500, fmt:money },
      curves:[{ f:h.P, color:ink, width:3.4, domain:[0, 50] }],
      segments:[{ x1:h.best, y1:0, x2:h.best, y2:h.max, color:ink2, width:1.5, dash:[4, 5] }],
      points:[{ x:h.best, y:h.max, r:6, color:pen }],
      labels:[{ x:h.best, y:h.max, text:"(" + money(h.best) + ", " + money(h.max) + ")", dy:h.max > 2300 ? 20 : -16, align:h.best > 38 ? "right" : "center", dx:h.best > 38 ? -8 : 0, bg:true, color:pen, font:ui(13) }],
      after:function(ctx, pl){
        var x0 = pl.X(30), x1 = pl.X(40), y0 = pl.Y(600), y1 = pl.Y(400);
        ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(x0, y0, x1 - x0, y1 - y0); ctx.strokeStyle = ink2; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
        ctx.setLineDash([]); ctx.font = ui(12); ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(MV.plain(T.read.target), (x0 + x1) / 2, y1 + 3);
        ctx.restore(); axisName(ctx, pl, "price (dollars)");
      },
      describe:"Your profit curve P(p) = (p − " + num(d.u) + ")(200 − 4p) − " + num(d.F) + ". Its peak is at a price of " + money(h.best) + " with a maximum profit of " + money(h.max) + ". The dashed target box covers prices from $30 to $40 and profits from $400 to $600." });
  }
  function readout(){
    var d = read(), h = hoodie(d.u, d.F), el = $("#ec-tread"); if (!el) return;
    el.innerHTML = MV.readoutHTML([[T.read.best, money(h.best)], [T.read.max, money(h.max)]]);
    $("#ec-tuo").textContent = money(d.u); $("#ec-tfo").textContent = money(d.F);
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; if (a.S.u == null) { a.S.u = 0; a.S.F = 0; }
      function sl(k, lab, max, step, aria){ return '<label class="slider ec-tsl"><span class="slider-top"><span>' + lab + '</span><output id="ec-t' + k.toLowerCase() + 'o"></output></span><input type="range" data-tl="' + k + '" min="0" max="' + max + '" step="' + step + '" value="' + a.S[k] + '" style="accent-color:var(--ink)" aria-label="' + aria + '"></label>'; }
      inp.innerHTML = sl("u", T.inputs.u, 40, 5, "Cost per hoodie in dollars") + sl("F", T.inputs.F, 2000, 100, "Fixed cost in dollars") + '<p class="tiny muted">' + T.inputs.note + "</p>";
      pv.innerHTML = '<canvas class="plot" id="ec-tplot" role="img" aria-label="Your profit curve"></canvas><dl class="read" id="ec-tread" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#ec-tplot"), { xmin:0, xmax:52, ymin:-1200, ymax:2800 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tl; if (!k) return; a.S[k] = +e.target.value; a.save(); draw(); readout(); a.update(); });
      // the frame's own closing note waits for 3 answers; this plan's note comes after all four
      if (!hooked) { hooked = true; document.addEventListener("click", function(e){
        if (!e.target.closest || !e.target.closest("#task-check")) return;
        setTimeout(function(){ var ts = MV.taskState(), fb = $("#task-fb .fb.good"); if (fb && ts.found.length >= 4 && T.afterAll && !$(".ec-after", fb)) { var p = document.createElement("p"); p.className = "ec-after"; p.innerHTML = T.afterAll; fb.appendChild(p); } }, 0);
      }); }
      draw(); readout();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var h = hoodie(d.u, d.F); return [near(h.best, Math.round(h.best)), h.best >= 30 - 1e-9 && h.best <= 40 + 1e-9, h.max >= 400 - 1e-9 && h.max <= 600 + 1e-9, d.F >= 500]; },
    key:function(d){ return d.u + "|" + d.F; },
    label:function(k){ var p = k.split("|"); return m("u") + " = $" + p[0] + ", " + m("F") + " = $" + p[1]; },
    text:function(k){ var p = k.split("|"), h = hoodie(+p[0], +p[1]); return "u = $" + p[0] + ", F = $" + p[1] + " (best price " + money(h.best) + ", profit " + money(h.max) + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ solve:solve },
  task:task
});
})();
