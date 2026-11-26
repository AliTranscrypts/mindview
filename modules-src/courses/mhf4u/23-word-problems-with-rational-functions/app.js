// MHF4U 23 Word Problems with Rational Functions: hero (average cost approaching $8), cost and concentration simulator
// (Explore), "What does the asymptote mean here?" (Part 3), Build the model and Answer the question (Practice),
// "Design a dilution" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function M(s){ return MV.m(s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function tpl(s, o){ return String(s == null ? "" : s).replace(/%(\w+)%/g, function(m, k){ return o[k] != null ? o[k] : m; }); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function ceilTo(v, k){ return Math.ceil(v / k - 1e-9) * k; }
// fixed decimals with true minus and spaced thousands (5+ digits)
function fmt(v, d){
  var s = Math.abs(v).toFixed(d), p = s.split("."), neg = v < 0 && +s !== 0;
  if (p[0].length > 4) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (neg ? MINUS : "") + p.join(".");
}
function fi(v){ return fmt(Math.round(v), 0); }
function posTick(t){ return t < -1e-9 ? "" : num(t); }
// exact if v terminates within dp decimals (shown with at least minDp); otherwise ≈ with dp decimals
function dec(v, dp, minDp){
  for (var d = 0; d <= dp; d++) { var p = Math.pow(10, d), w = v * p; if (Math.abs(w - Math.round(w)) < 1e-7 * Math.max(1, Math.abs(w))) return { s:fmt(v, Math.max(d, minDp || 0)), apx:false }; }
  return { s:fmt(v, Math.max(dp, minDp || 0)), apx:true };
}
function money(v){ var r = dec(v, 2, 2); return (r.apx ? "≈ " : "") + "$" + r.s; }
function moneyEq(v){ var r = dec(v, 2, 2); return (r.apx ? "≈ $" : "= $") + r.s; }
function moneyLR(v){ var r = dec(v, 4, 2); return (r.apx ? "≈ " : "") + "$" + r.s; }
function valEq(v){ var r = dec(v, 2, 0); return (r.apx ? "≈ " : "= ") + r.s; }
function valT(v){ var r = dec(v, 2, 0); return (r.apx ? "≈ " : "") + r.s; }
// exact fraction n/d as math source, with ≈ 1 dp when not whole: "270/7 ≈ 38.6"
function fracApx(n, d){ var g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } if (d === 1) return { m:String(n), apx:"" }; return { m:(n < 0 ? "-" : "") + Math.abs(n) + "/" + d, apx:" ≈ " + fmt(n / d, 1) }; }
function coefM(c){ return c === 1 ? "" : c === -1 ? "-" : fi(c); }
var LOCK = '<svg class="lock23" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><rect x="3" y="7" width="10" height="8" rx="1.5" fill="currentColor"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';

// ---------- canvas helpers ----------
function txt(ctx, P, s, X, Y, o){
  o = o || {}; var sz = o.size || 12;
  ctx.save(); ctx.font = (o.bold ? "700 " : "") + sz + "px " + (o.math ? P.fontM : P.fontUI); ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "middle";
  var w = ctx.measureText(s).width;
  if (o.fit) { if (o.align === "right" && X - w < 2) { X = w + 4; ctx.textAlign = "right"; } if ((o.align || "left") === "left" && X + w > P.W - 2) { X = P.W - 2; ctx.textAlign = "right"; } }
  if (o.bg) { var a = ctx.textAlign, x0 = a === "right" ? X - w : a === "center" ? X - w / 2 : X; ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, Y - sz * 0.72, w + 6, sz * 1.44); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink"); ctx.fillText(s, X, Y); ctx.restore();
  return w;
}
// text in parts: [[text, italic], …]
function rich(ctx, P, parts, X, Y, o){
  o = o || {}; var sz = o.size || 12;
  ctx.save(); ctx.textBaseline = "middle";
  var fonts = parts.map(function(p){ return (p[1] ? "italic " + (sz + 1) + "px " + P.fontM : sz + "px " + P.fontUI); });
  var ws = parts.map(function(p, i){ ctx.font = fonts[i]; return ctx.measureText(p[0]).width; }), tot = ws.reduce(function(a, b){ return a + b; }, 0);
  var x = o.align === "right" ? X - tot : o.align === "center" ? X - tot / 2 : X;
  if (o.bg) { ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(x - 3, Y - sz * 0.75, tot + 6, sz * 1.5); ctx.globalAlpha = 1; }
  parts.forEach(function(p, i){ ctx.font = fonts[i]; ctx.fillStyle = o.color || css("--ink-2"); ctx.textAlign = "left"; ctx.fillText(p[0], x, Y); x += ws[i]; });
  ctx.restore();
}
function hDash(ctx, P, y, col, dash, w){ var Y = P.Y(y); if (Y < -2 || Y > P.H + 2) return; ctx.save(); ctx.strokeStyle = col || css("--ink-2"); ctx.lineWidth = w || 1.5; ctx.setLineDash(dash || [8, 6]); ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(P.W, Y); ctx.stroke(); ctx.restore(); }
function vLine(ctx, P, x, col, dash, w){ var X = P.X(x); if (X < -2 || X > P.W + 2) return; ctx.save(); ctx.strokeStyle = col || css("--ink-2"); ctx.lineWidth = w || 1.5; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, P.H); ctx.stroke(); ctx.restore(); }
function cy(P, y){ return clamp(P.Y(y), -20, P.H + 20); }
// highlighted gap (--hi-soft with --hi edges) from y1 to y2 at x
function gapBar(ctx, P, x, y1, y2, w){
  var X = P.X(x), a = cy(P, y1), b = cy(P, y2), top = Math.min(a, b), h = Math.abs(a - b); w = w || 10;
  if (h < 0.5) return;
  ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(X - w / 2, top, w, h);
  ctx.strokeStyle = css("--hi"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X - w / 2, top); ctx.lineTo(X - w / 2, top + h); ctx.moveTo(X + w / 2, top); ctx.lineTo(X + w / 2, top + h); ctx.stroke(); ctx.restore();
}
function ring(ctx, P, x, y, col, r, lw){ var X = P.X(x), Y = P.Y(y); if (X < -12 || X > P.W + 12 || Y < -12 || Y > P.H + 12) return; ctx.save(); ctx.beginPath(); ctx.arc(X, Y, r || 8, 0, Math.PI * 2); ctx.lineWidth = lw || 3; ctx.strokeStyle = col; ctx.stroke(); ctx.restore(); }
function upMark(ctx, P, x){ var X = P.X(x); ctx.save(); ctx.fillStyle = css("--ink"); ctx.beginPath(); ctx.moveTo(X, 2); ctx.lineTo(X - 6, 12); ctx.lineTo(X + 6, 12); ctx.closePath(); ctx.fill(); ctx.restore(); }
// ymin that leaves `pad` px under the x-axis for tick labels (and strips)
function yLow(canvas, ymax, pad){ var H = canvas.getBoundingClientRect().height || 300; return -ymax * pad / Math.max(40, H - pad); }

// ---------- hero: average cost approaches $8 ----------
var HV = { xmin:-90, xmax:1045, ymin:-4.5, ymax:42 };
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, HV), cap = f.cap;
  var A = function(x){ return 8 + 1200 / x; };
  var st = { cover:1, ha:0, dot:false, xd:50, whole:false };
  function shareT(x){ var s = 1200 / x; return "+ $" + (Math.abs(s - Math.round(s)) < 1e-9 ? String(Math.round(s)) : s.toFixed(2)) + " share"; }
  p.render = function(){
    p.draw({ view:HV, xTicks:{ step:200 }, yTicks:{ step:10 },
      describe:"Graph of the average cost A of x equals 8 plus 1200 over x, for 50 to 1000 items. Dashed horizontal asymptote y = 8, the cost to make one item. " + (st.dot ? "At " + Math.round(st.xd) + " items the average is " + A(st.xd).toFixed(2) + " dollars, " + (1200 / st.xd).toFixed(2) + " dollars above the asymptote." : ""),
      after:function(ctx, P){
        rich(ctx, P, [["items made, ", false], ["x", true]], P.W - 6, P.Y(0) - 12, { align:"right" });
        rich(ctx, P, [["average cost ($)", false]], P.X(0) + 8, 12);
        if (st.ha > 0) {
          var xe = HV.xmin + (HV.xmax - HV.xmin) * st.ha;
          ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(0, P.Y(8)); ctx.lineTo(P.X(xe), P.Y(8)); ctx.stroke(); ctx.restore();
          if (st.ha >= 1) txt(ctx, P, "$8: the cost to make one item", P.W - 6, P.Y(8) + 13, { align:"right", color:css("--ink-2"), bg:true });
        }
        if (st.whole) P.curve({ f:A, color:css("--pen"), width:3.2, domain:[31, 1000] });
        else if (st.dot && st.xd > 50.5) P.curve({ f:A, color:css("--pen"), width:3.2, domain:[50, st.xd] });
        if (st.dot) {
          gapBar(ctx, P, st.xd, 8, A(st.xd), 10);
          var ym = (A(st.xd) + 8) / 2, right = P.X(st.xd) < P.W - 120;
          txt(ctx, P, shareT(st.xd), P.X(st.xd) + (right ? 10 : -10), Math.min(P.Y(ym), P.Y(8) - 12), { align:right ? "left" : "right", bold:true, bg:true });
          P.point({ x:st.xd, y:A(st.xd), r:5.5, ring:true, color:css("--ink") });
        }
        if (st.cover < 1) { ctx.fillStyle = css("--sheet"); ctx.fillRect(P.W * st.cover, 0, P.W, P.H); }
      } });
  };
  function capAt(x){ cap.innerHTML = M("x = " + x) + ": $" + A(x).toFixed(2); }
  function final(){ st = { cover:1, ha:1, dot:true, xd:1000, whole:true }; p.render(); cap.innerHTML = MV.C.hero.finalCap; }
  if (MV.reduceMotion) { final(); return; }
  st.cover = 0; p.render();
  var legs = [[50, 100, 500], [100, 200, 700], [200, 400, 1000], [400, 1000, 1800]];
  function leg(i){
    if (i >= legs.length) { MV.wait(500, final); return; }
    var L = legs[i];
    MV.tween({ dur:L[2], ease:function(t){ return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }, step:function(t){ st.xd = L[0] + (L[1] - L[0]) * t; p.render(); }, done:function(){ capAt(L[1]); MV.wait(500, function(){ leg(i + 1); }); } });
  }
  MV.tween({ dur:300, ease:function(t){ return t; }, step:function(t){ st.cover = t; p.render(); }, done:function(){
    MV.tween({ dur:700, step:function(t){ st.ha = t; p.render(); }, done:function(){ st.ha = 1; st.dot = true; st.xd = 50; p.render(); MV.wait(400, function(){ leg(0); }); } });
  } });
}

// ---------- shared models ----------
var VIEWS = { near:{ X:200, step:1, add:[1, 10, 100], lo:1 }, mid:{ X:1000, step:1, add:[1, 10, 100], lo:1 }, far:{ X:100000, step:100, add:[100, 1000, 10000], lo:100 } };
var VORD = ["near", "mid", "far"];
function fitX(x, view){ var V = VIEWS[view]; return clamp(Math.round(x / V.step) * V.step, V.lo, V.X); }
function avgM(name, F, v, arg){ arg = arg || "x"; return F === 0 ? name + "(" + arg + ") = {" + coefM(v) + arg + "}/{" + arg + "} = " + v : name + "(" + arg + ") = {" + fi(F) + " + " + coefM(v) + arg + "}/{" + arg + "} = " + v + " + {" + fi(F) + "}/{" + arg + "}"; }
function concF(s){ return function(t){ return (s.C0 * s.V0 + s.cin * s.r * t) / (s.V0 + s.r * t); }; }
function tFullOf(s){ return (300 - s.V0) / s.r; }
function concM(s){
  var a = s.C0 * s.V0, b = s.cin * s.r, bot = fi(s.V0) + " + " + coefM(s.r) + "t";
  var top = a ? fi(a) + (b ? " + " + coefM(b) + "t" : "") : (b ? coefM(b) + "t" : "0");
  var k = (s.C0 - s.cin) * s.V0;
  return "C(t) = {" + top + "}/{" + bot + "} = " + (k === 0 ? String(s.cin) : s.cin + (k > 0 ? " + " : " - ") + "{" + fi(Math.abs(k)) + "}/{" + bot + "}");
}
// seeded salt-dot positions (Park–Miller), so dots don't jump between frames
var SEED = (function(){ var a = [], s = 20231; function r(){ s = (s * 16807) % 2147483647; return s / 2147483647; } for (var i = 0; i < 260; i++) a.push([r(), r()]); return a; })();
function tint(c){ return 0.06 + 0.7 * clamp(c, 0, 60) / 60; }

// ---------- mixing tank (Explore Concentration mode and the task) ----------
// o: {cin, C, vol, giant, r, flow, U (labels)}
function drawTank(ctx, P, o){
  var W = P.W, H = P.H, land = W > H * 1.15, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), U = o.U;
  var j = land ? { x0:W * 0.03, x1:W * 0.2, y0:H * 0.07, y1:H * 0.4, ly:H * 0.5 } : { x0:W * 0.05, x1:W * 0.34, y0:H * 0.03, y1:H * 0.17, ly:H * 0.225 };
  var t = land ? { x0:W * 0.3, x1:W * 0.97, y0:H * 0.16, y1:H * 0.95 } : { x0:W * 0.12, x1:W * 0.95, y0:H * 0.32, y1:H * 0.97 };
  var tw = t.x1 - t.x0, fullY = t.y0 + (t.y1 - t.y0) * 0.08, fullH = t.y1 - fullY, areaFull = tw * fullH;
  var surf, frac, over = false;
  if (o.giant) { surf = t.y0 + (t.y1 - t.y0) * 0.2; frac = (t.y1 - surf) / fullH; }
  else { frac = o.vol / 300; if (frac > 1) { over = true; frac = 1; } surf = t.y1 - frac * fullH; }
  function dots(x0, y0, w, h, n){ ctx.fillStyle = ink; for (var i = 0; i < n && i < SEED.length; i++) { ctx.beginPath(); ctx.arc(x0 + 3 + SEED[i][0] * (w - 6), y0 + h - 3 - SEED[i][1] * (h - 6), 1.6, 0, Math.PI * 2); ctx.fill(); } }
  // jug
  ctx.save();
  ctx.globalAlpha = tint(o.cin); ctx.fillStyle = pen; ctx.fillRect(j.x0, j.y0 + (j.y1 - j.y0) * 0.15, j.x1 - j.x0, (j.y1 - j.y0) * 0.85); ctx.globalAlpha = 1;
  var jArea = (j.x1 - j.x0) * (j.y1 - j.y0) * 0.85;
  dots(j.x0, j.y0 + (j.y1 - j.y0) * 0.15, j.x1 - j.x0, (j.y1 - j.y0) * 0.85, Math.round(240 * o.cin / 60 * jArea / areaFull));
  ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(j.x0, j.y0); ctx.lineTo(j.x0, j.y1); ctx.lineTo(j.x1, j.y1); ctx.lineTo(j.x1, j.y0); ctx.stroke();
  ctx.restore();
  txt(ctx, P, tpl(U.jug, { c:o.cin }), j.x0, j.ly, { size:11, color:ink2 });
  // stream
  var sx = t.x0 + tw * (land ? 0.18 : 0.62), sw = 2 + 10 * (o.r - 1) / 19;
  if (o.flow) {
    ctx.save(); ctx.globalAlpha = Math.max(0.25, tint(o.cin)); ctx.strokeStyle = pen; ctx.lineWidth = sw; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(j.x1 - 2, j.y0 + 3); ctx.quadraticCurveTo(sx, j.y0 - 2, sx, surf); ctx.stroke(); ctx.restore();
  }
  // liquid
  ctx.save(); ctx.globalAlpha = tint(o.C); ctx.fillStyle = pen; ctx.fillRect(t.x0, surf, tw, t.y1 - surf); ctx.globalAlpha = 1; ctx.restore();
  dots(t.x0, surf, tw, t.y1 - surf, Math.round(240 * o.C / 60 * Math.min(frac, 1.2)));
  if (over) {
    ctx.save(); ctx.globalAlpha = tint(o.C); ctx.fillStyle = pen; ctx.fillRect(t.x0, t.y0 - 3, tw, fullY - t.y0 + 3); ctx.fillRect(t.x1, t.y0 - 3, 5, t.y1 - t.y0 + 3); ctx.restore();
    txt(ctx, P, U.overflow, t.x0 + 6, fullY + 16, { size:11, bold:true, bg:true });
  }
  // walls
  ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 2.2; ctx.beginPath();
  if (o.giant) {
    var gy = t.y0 + 4;
    ctx.moveTo(t.x0, gy); ctx.lineTo(t.x0, t.y1); ctx.lineTo(t.x1, t.y1); ctx.lineTo(t.x1, gy); ctx.stroke();
    ctx.lineWidth = 1.6; [t.x0, t.x1].forEach(function(x){ ctx.beginPath(); ctx.moveTo(x - 5, gy - 2); ctx.lineTo(x, gy - 8); ctx.lineTo(x + 5, gy - 2); ctx.stroke(); });
    ctx.restore();
    txt(ctx, P, U.giantMark, t.x0 + tw / 2, t.y0 + 14, { align:"center", size:11, color:ink2, bg:true });
    txt(ctx, P, fi(o.vol) + " L", t.x0 + 6, surf + 12, { size:12, bold:true, bg:true });
  } else {
    ctx.moveTo(t.x0, t.y0); ctx.lineTo(t.x0, t.y1); ctx.lineTo(t.x1, t.y1); ctx.lineTo(t.x1, t.y0); ctx.stroke();
    ctx.setLineDash([5, 4]); ctx.lineWidth = 1.3; ctx.strokeStyle = ink2; ctx.beginPath(); ctx.moveTo(t.x0, fullY); ctx.lineTo(t.x1, fullY); ctx.stroke(); ctx.restore();
    txt(ctx, P, U.fullMark, t.x1 - 4, fullY - 8, { align:"right", size:11, color:ink2, bg:true });
    if (!over) txt(ctx, P, fi(o.vol) + " L", t.x0 + 6, Math.min(surf + 12, t.y1 - 10), { size:12, bold:true, bg:true });
  }
}

// ---------- Explore: cost and concentration simulator ----------
function explore(host, api){
  var C = api.content, U = C.ui, S = api.S;
  if (!S.mode) S.mode = "cost";
  S.cost = S.cost || { F:1200, v:8, x:100, view:"mid" };
  S.cmp = S.cmp || { FA:600, vA:9, FB:1500, vB:6, x:100, view:"mid" };
  S.conc = S.conc || { V0:100, C0:0, cin:30, r:10, t:0, tank:"real", far:false, rate:false };
  var T = { view:null, anim:null, run:null, chal:null, focus:null, p2:null, busy:false, flow:false, stripN:null, stripAnim:null };
  host.innerHTML = '<div class="ex23" id="ex23"><div class="ex23-mode" id="ex-mode"></div><div class="pg"><div class="pg-graph" data-mv="graph">' +
    '<p class="eq-cap ex23-cap" id="ex-cap" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ex23-stripbox" id="ex-stripbox"><canvas class="ex23-strip" id="ex-strip" role="img" aria-label="Fixed-cost strip"></canvas><p class="tiny ex23-striplab" id="ex-striplab"></p></div>' +
    '<div class="ex23-panels" id="ex-panels"><div class="ex23-tankbox"><canvas class="plot ex23-tank" id="ex-tank" role="img" aria-label="Mixing tank"></canvas></div>' +
    '<div class="plot-wrap ex23-gw"><canvas class="plot" id="ex-plot" role="img" aria-label="Graph"></canvas></div></div>' +
    '<p class="tiny muted ex23-note" id="ex-note"></p><div id="ex-table" class="ex23-table"></div></div>' +
    '<div class="pg-ctrl" id="ex-ctrl"></div><div class="pg-read"><dl class="read ex23-read" id="ex-read" aria-live="polite"></dl></div></div></div>';
  var root = $("#ex23", host), ctrl = $("#ex-ctrl", host), plotEl = $("#ex-plot", host);
  var plot = new MV.Plot(plotEl, { xmin:0, xmax:1, ymin:0, ymax:1 });
  var strip = new MV.Plot($("#ex-strip", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  var tank = new MV.Plot($("#ex-tank", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  function banner(kind, h){ var b = $("[data-mv=banner]", host); b.className = "banner" + (kind ? " " + kind : ""); b.innerHTML = h || ""; }
  function solved(id){ return !!(MV.S.chal && MV.S.chal[id] && MV.S.chal[id].solved); }
  function chalOn(id){ return T.chal === id && !solved(id); }
  function tgtOn(id){ return (T.chal === id || T.focus === id) && !solved(id); }

  // ----- views (G10 smooth zoom) -----
  function targetView(){
    var m = S.mode;
    if (m === "cost" || m === "cmp") {
      var s = m === "cost" ? S.cost : S.cmp, X = VIEWS[s.view].X, y;
      if (m === "cost") { y = Math.max(s.v + s.F / (X / 20), s.v + 5); if (tgtOn("tc1")) y = Math.max(y, 20); }
      else y = Math.max(s.vA + s.FA / (X / 20), s.vB + s.FB / (X / 20), Math.max(s.vA, s.vB) + 5);
      return { xmin:-0.09 * X, xmax:X * 1.03, ymax:ceilTo(y, 5) };
    }
    var c = S.conc, Tw;
    if (c.tank === "giant") Tw = c.far ? 6000 : 600;
    else { Tw = ceilTo(1.2 * tFullOf(c), 10); if (tgtOn("tc2")) Tw = Math.max(Tw, 20); }
    return { xmin:-0.09 * Tw, xmax:Tw * 1.02, ymax:62 };
  }
  function stopView(){ if (T.anim) { T.anim(); T.anim = null; } }
  function goView(dur, done){
    stopView();
    var to = targetView(), from = T.view;
    var same = from && ["xmin", "xmax", "ymax"].every(function(k){ return Math.abs(from[k] - to[k]) < 1e-9; });
    if (!from || !dur || MV.reduceMotion || same) { T.view = to; paint(); if (done) done(); return; }
    var g = function(a, b, t){ return a * Math.pow(b / a, t); };
    paint();
    T.anim = MV.tween({ dur:dur, step:function(t){ var xm = g(from.xmax, to.xmax, t); T.view = { xmax:xm, xmin:to.xmin / to.xmax * xm, ymax:g(from.ymax, to.ymax, t) }; drawPlot(); },
      done:function(){ T.anim = null; T.view = to; paint(); if (done) done(); } });
  }

  // ----- controls -----
  var modeHost = $("#ex-mode", host);
  var modeSeg = MV.seg(modeHost, { label:"Mode", value:S.mode, options:[["cost", 0], ["cmp", 1], ["conc", 2]].map(function(o){ var t = U.modes[o[1]]; return { id:o[0], t:'<span class="lg">' + t[0] + '</span><span class="sh" aria-hidden="true">' + t[1] + "</span>" }; }), onChange:function(v){ if (T.busy) { modeSeg.set(S.mode); renderMode(); return; } setMode(v); } });
  function renderMode(){
    if (modeSeg.get() !== S.mode) modeSeg.set(S.mode);
    $$("button", modeHost).forEach(function(b){ b.disabled = T.busy; });
  }
  function dol(v){ return "$" + fi(v); }
  function sl(id, key, label, min, max, step, value, fmtf, note){ return { id:id, key:key, label:label, min:min, max:max, step:step, value:value, fmt:fmtf, note:note }; }
  function tEnd(){ var c = S.conc; if (c.tank === "giant") return c.far ? 6000 : 600; var e = Math.floor(tFullOf(c) + 1e-9); return chalOn("tc2") ? Math.max(e, 10) : e; }
  function addRow(view){ return '<div class="ex23-add" role="group" aria-label="Add items">' + VIEWS[view].add.map(function(d){ return '<button type="button" class="btn ghost sm" data-act="add" data-d="' + d + '" data-k="add' + d + '">+' + fi(d) + "</button>"; }).join("") + "</div>"; }
  function runBtn(label){ var on = !!T.run; return '<button type="button" class="btn sm ex23-run" data-act="run" data-k="run" aria-pressed="' + on + '">' + (on ? "■ " + U.stop : "▶ " + label) + "</button>"; }
  function mkSliders(hostEl, defs, obj){
    MV.sliders(hostEl, defs, function(id, v){
      var d = defs.filter(function(x){ return x.id === id; })[0]; if (!d || T.busy) return;
      onInput(obj, d.key, v);
    });
  }
  function renderCtrl(){
    var m = S.mode, h = "";
    if (m === "cost") h = '<div id="ex-s1"></div>' + addRow(S.cost.view) + '<div class="q-actions">' + runBtn(U.runCost) + '</div><div id="ex-vw"></div>';
    else if (m === "cmp") h = '<details class="ex23-grp"' + (chalOn("tc3") ? "" : " open") + '><summary>' + U.planA + '</summary><div id="ex-s1"></div></details><details class="ex23-grp" open><summary>' + U.planB + '</summary><div id="ex-s2"></div></details><div id="ex-s3"></div>' + addRow(S.cmp.view) + '<div class="q-actions">' + runBtn(U.runCost) + '</div><div id="ex-vw"></div>';
    else h = '<div id="ex-s1"></div><div class="q-actions">' + runBtn(U.run) + '</div><div id="ex-tk"></div><div class="q-actions">' +
      (S.conc.tank === "giant" ? '<button type="button" class="btn ghost sm" data-act="far" data-k="far" aria-pressed="' + !!S.conc.far + '">' + U.farT + "</button>" : "") +
      '<button type="button" class="btn ghost sm" data-act="rate" data-k="rate" aria-pressed="' + !!S.conc.rate + '">' + U.showRate + "</button></div>";
    if (T.chal && !solved(T.chal)) h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="leave" data-k="leave">' + U.leave + "</button></div>";
    MV.keepFocus(ctrl, function(){
      ctrl.innerHTML = h;
      if (m === "cost") {
        var s = S.cost, V = VIEWS[s.view];
        mkSliders($("#ex-s1", ctrl), [sl("cF", "F", U.sl.F, 0, 3000, 100, s.F, dol), sl("cv", "v", U.sl.v, 1, 20, 1, s.v, dol), sl("cx", "x", U.sl.x, V.lo, V.X, V.step, s.x, fi)], s);
      } else if (m === "cmp") {
        var c = S.cmp, V2 = VIEWS[c.view];
        mkSliders($("#ex-s1", ctrl), [sl("mFA", "FA", U.sl.FA, 0, 3000, 100, c.FA, dol), sl("mvA", "vA", U.sl.vA, 1, 20, 1, c.vA, dol)], c);
        mkSliders($("#ex-s2", ctrl), [sl("mFB", "FB", U.sl.FB, 0, 3000, 100, c.FB, dol), sl("mvB", "vB", U.sl.vB, 1, 20, 1, c.vB, dol)], c);
        mkSliders($("#ex-s3", ctrl), [sl("mx", "x", U.sl.x, V2.lo, V2.X, V2.step, c.x, fi)], c);
      } else {
        var k = S.conc, far = k.tank === "giant" && k.far;
        mkSliders($("#ex-s1", ctrl), [sl("kV0", "V0", U.sl.V0, 20, 200, 10, k.V0, function(v){ return v + " L"; }), sl("kC0", "C0", U.sl.C0, 0, 60, 5, k.C0, function(v){ return v + " g/L"; }, U.notes.C0),
          sl("kcin", "cin", U.sl.cin, 0, 60, 5, k.cin, function(v){ return v + " g/L"; }, U.notes.cin), sl("kr", "r", U.sl.r, 1, 20, 1, k.r, function(v){ return v + " L/min"; }),
          sl("kt", "t", U.sl.t, 0, tEnd(), far ? 10 : 1, k.t, function(v){ return fi(v) + " min"; })], k);
        MV.seg($("#ex-tk", ctrl), { label:"Tank", value:k.tank, options:[{ id:"real", t:U.tanks[0] }, { id:"giant", t:U.tanks[1] }], onChange:setTank });
      }
      if (m !== "conc") MV.seg($("#ex-vw", ctrl), { label:"View", value:(m === "cost" ? S.cost : S.cmp).view, options:VORD.map(function(v, i){ return { id:v, t:U.views[i] }; }), onChange:setView });
      applyLocks();
    });
  }
  function lock(id){
    var el = document.getElementById("sl-" + id); if (!el) return;
    el.disabled = true; var lab = el.closest(".slider"); lab.classList.add("locked23");
    var top = lab.querySelector(".slider-top"); if (top && !lab.querySelector(".lock-note")) top.insertAdjacentHTML("afterend", '<span class="lock-note tiny">' + LOCK + " " + U.locked + "</span>");
  }
  function applyLocks(){
    if (chalOn("tc2")) { lock("kC0"); lock("kt"); }
    if (chalOn("tc3")) { lock("mFA"); lock("mvA"); }
    if (T.busy) $$("input, button", ctrl).forEach(function(el){ el.disabled = true; });
  }
  function setBusy(b){ T.busy = b; renderMode(); renderCtrl(); }

  // ----- state changes -----
  function clearOverlay(){ T.p2 = null; }
  function runLabel(){ var b = $("[data-act=run]", ctrl); if (!b) return; var on = !!T.run; b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "■ " + U.stop : "▶ " + (S.mode === "conc" ? U.run : U.runCost); }
  function stopRun(){ if (T.run) { T.run(); T.run = null; T.flow = false; runLabel(); } }
  function onInput(obj, key, v){
    clearOverlay(); banner("", "");
    if (T.run) stopRun();
    obj[key] = v;
    if (S.mode === "conc" && (key === "V0" || key === "r")) {
      var e = tEnd(), el = document.getElementById("sl-kt");
      if (S.conc.t > e && !chalOn("tc2")) { S.conc.t = e; }
      if (el) { el.max = e; el.value = S.conc.t; var o = document.getElementById("sl-kt-out"); if (o) o.textContent = fi(S.conc.t) + " min"; }
    }
    api.save();
    if (key === "x") stripTo(v);
    if (key === "x" || key === "t") paint(); else goView(400);
  }
  function setMode(v){
    if (T.busy || v === S.mode) return;
    stopRun(); stopView(); clearOverlay(); banner("", "");
    if (T.chal) T.chal = null;
    S.mode = v; api.save(); T.view = null; T.stripN = null;
    renderCtrl(); goView(0);
  }
  function setView(v){
    var s = S.mode === "cost" ? S.cost : S.cmp; if (T.busy) return;
    stopRun(); clearOverlay(); s.view = v; s.x = fitX(s.x, v); api.save(); T.stripN = s.x;
    renderCtrl(); goView(900);
  }
  function setTank(v){
    if (T.busy) return;
    stopRun(); clearOverlay(); var c = S.conc; c.tank = v; if (v === "real") c.far = false; c.t = Math.min(c.t, tEnd()); api.save();
    renderCtrl(); goView(700);
  }
  function stripTo(x){
    if (T.stripAnim) { T.stripAnim(); T.stripAnim = null; }
    var from = T.stripN == null ? x : T.stripN;
    if (MV.reduceMotion || T.run || from === x) { T.stripN = x; return; }
    T.stripAnim = MV.tween({ dur:400, step:function(t){ T.stripN = from + (x - from) * t; paintStrip(); }, done:function(){ T.stripAnim = null; T.stripN = x; paintStrip(); } });
  }
  function startRun(){
    if (T.run) { stopRun(); return; }
    clearOverlay(); banner("", "");
    var m = S.mode, obj, key, end, lo;
    if (m === "conc") { obj = S.conc; key = "t"; end = tEnd(); lo = 0; if (chalOn("tc2")) return; }
    else { obj = m === "cost" ? S.cost : S.cmp; key = "x"; end = VIEWS[obj.view].X; lo = VIEWS[obj.view].lo; }
    var from = obj[key] >= end ? lo : obj[key], step = m === "conc" ? (S.conc.far ? 10 : 1) : VIEWS[obj.view].step;
    if (m === "conc") T.flow = true;
    var finished = false;
    var cancel = MV.tween({ dur:6000, step:function(t){ obj[key] = Math.round((from + (end - from) * t) / step) * step; if (key === "x") T.stripN = obj[key]; syncSlider(key, obj[key]); paint(); },
      done:function(){ finished = true; T.run = null; T.flow = false; obj[key] = end; if (key === "x") T.stripN = end; syncSlider(key, end); api.save(); runLabel(); paint(); } });
    if (!finished) { T.run = function(){ cancel(); T.flow = false; api.save(); }; runLabel(); }
  }
  function syncSlider(key, v){
    var id = S.mode === "conc" ? "kt" : S.mode === "cost" ? "cx" : "mx", el = document.getElementById("sl-" + id); if (!el) return;
    el.value = v; var o = document.getElementById("sl-" + id + "-out"); if (o) o.textContent = key === "t" ? fi(v) + " min" : fi(v);
  }
  ctrl.addEventListener("click", function(e){
    var b = e.target.closest("[data-act]"); if (!b || b.disabled || T.busy) return;
    var a = b.dataset.act;
    if (a === "run") startRun();
    else if (a === "add") { var s = S.mode === "cost" ? S.cost : S.cmp; stopRun(); clearOverlay(); s.x = Math.min(VIEWS[s.view].X, s.x + (+b.dataset.d)); syncSlider("x", s.x); api.save(); stripTo(s.x); paint(); }
    else if (a === "far") { stopRun(); clearOverlay(); S.conc.far = !S.conc.far; if (S.conc.far) S.conc.t = Math.round(S.conc.t / 10) * 10; S.conc.t = Math.min(S.conc.t, tEnd()); api.save(); renderCtrl(); goView(900); }
    else if (a === "rate") { S.conc.rate = !S.conc.rate; api.save(); renderCtrl(); paint(); }
    else if (a === "leave") leave();
  });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && T.run) { stopRun(); paint(); } });
  function leave(){ T.chal = null; banner("", ""); renderCtrl(); goView(500); }

  // ----- drawing -----
  function paintStrip(){
    if (S.mode !== "cost") return;
    var s = S.cost, n = T.stripN == null ? s.x : T.stripN;
    $("#ex-striplab", host).textContent = tpl(U.strip, { F:fi(s.F), n:fi(s.x), each:money(s.F / s.x).replace("≈ ", "≈ ") });
    strip.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:"Fixed-cost strip: $" + s.F + " split " + s.x + " ways, " + (s.F / s.x).toFixed(2) + " dollars each.", after:function(ctx, P){
      var L = (P.W - 4) * s.F / 3000, y0 = 6, h = P.H - 12, ink2 = css("--ink-2");
      ctx.save(); ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.strokeRect(2, y0, P.W - 4, h); ctx.restore();
      if (L < 1) return;
      function hatch(x0, w){ ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip(); ctx.fillStyle = css("--paper"); ctx.fillRect(x0, y0, w, h); ctx.strokeStyle = ink2; ctx.lineWidth = 1.2; ctx.beginPath(); for (var k = x0 - h; k < x0 + w + h; k += 6) { ctx.moveTo(k, y0 + h); ctx.lineTo(k + h, y0); } ctx.stroke(); ctx.restore(); ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.2; ctx.strokeRect(x0, y0, w, h); ctx.restore(); }
      if (n <= 50) {
        var gap = Math.min(3, L / n * 0.3);
        for (var i = 0; i < Math.ceil(n - 1e-9); i++) { var a = 2 + L * i / n, b = Math.min(2 + L, 2 + L * (i + 1) / n); hatch(a + gap / 2, Math.max(0.5, b - a - gap)); }
      } else {
        hatch(2, L);
        var sp = L / n, every = Math.max(1, Math.ceil(2 / sp));
        ctx.save(); ctx.strokeStyle = css("--sheet"); ctx.globalAlpha = clamp(sp / 4, 0.25, 0.9); ctx.lineWidth = 1;
        ctx.beginPath(); for (var k2 = every; k2 < n; k2 += every) { var X = 2 + L * k2 / n; ctx.moveTo(X, y0); ctx.lineTo(X, y0 + h); } ctx.stroke(); ctx.restore();
      }
    } });
  }
  function axisCost(ctx, P){
    rich(ctx, P, [[U.axX, false], ["x", true]], P.W - 6, P.Y(0) - 12, { align:"right", bg:true });
    rich(ctx, P, [[U.axY, false]], P.X(0) + 8, 12, { bg:true });
    txt(ctx, P, "x = 0", P.X(0) + 6, 32, { math:true, size:13, color:css("--ink-2"), bg:true });
  }
  function priceTag(ctx, P, x, v, F, col, w, dx, lab){
    var A = v + F / x, X = P.X(x) + dx, y0 = P.Y(0), yv = cy(P, v), yA = Math.max(P.Y(A), 0);
    ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = col; ctx.fillRect(X - w / 2, yv, w, y0 - yv); ctx.globalAlpha = 1;
    ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.strokeRect(X - w / 2, yv, w, y0 - yv);
    ctx.fillStyle = css("--hi-soft"); ctx.fillRect(X - w / 2, yA, w, yv - yA); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 2; ctx.strokeRect(X - w / 2, yA, w, yv - yA); ctx.restore();
    if (P.Y(A) < 0) upMark(ctx, P, x);
    return { X:X, yv:yv, yA:yA, y0:y0 };
  }
  function drawCost(ctx, P){
    var s = S.cost, A = function(x){ return s.v + s.F / x; }, X = VIEWS[s.view].X, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2");
    axisCost(ctx, P);
    if (T.p2) {
      var A0 = function(x){ return 8 + 1200 / x; }, dom = [X * 0.0005, P.v.xmax];
      P.curve({ f:A0, color:ink2, width:2, dash:[6, 6], alpha:0.6, domain:dom });
      hDash(ctx, P, 8); hDash(ctx, P, 7);
      var span = P.v.xmax - dom[0];
      if (T.p2.a > 0) P.curve({ f:function(x){ return 8 + 600 / x; }, color:ink, width:3, dash:[14, 8], domain:[dom[0], dom[0] + span * T.p2.a] });
      if (T.p2.b > 0) P.curve({ f:function(x){ return 7 + 1200 / x; }, color:pen, width:3.2, domain:[dom[0], dom[0] + span * T.p2.b] });
      if (T.p2.a >= 1) txt(ctx, P, U.p2.halve, P.X(X * 0.55), P.Y(8.006) - 14, { bold:true, bg:true });
      if (T.p2.b >= 1) rich(ctx, P, [["Lower ", false], ["v", true]], P.X(X * 0.55), P.Y(7.012) + 16, { bg:true, color:pen });
      txt(ctx, P, "y = 8", 6 + P.X(0) + 40, P.Y(8) - 10, { math:true, color:ink2, bg:true }); txt(ctx, P, "y = 7", 6 + P.X(0) + 40, P.Y(7) + 12, { math:true, color:ink2, bg:true });
      return;
    }
    var near = s.view === "near";
    P.curve({ f:A, color:pen, width:3.2, alpha:near ? 0.35 : 1, domain:[X * 0.0005, P.v.xmax] });
    if (near) { ctx.save(); ctx.fillStyle = pen; for (var k = 1; k <= 200; k++) { var Yk = P.Y(A(k)); if (Yk < -4) continue; ctx.beginPath(); ctx.arc(P.X(k), Yk, 2.5, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
    hDash(ctx, P, s.v);
    var tagRight = P.X(s.x) > P.W - 240;
    txt(ctx, P, tpl(U.haCost, { v:s.v }), tagRight ? P.X(0) + 46 : P.W - 6, P.Y(s.v) + 13, { align:tagRight ? "left" : "right", color:ink2, bg:true });
    if (tgtOn("tc1")) {
      hDash(ctx, P, 9, css("--hi"), [10, 6], 3.5);
      txt(ctx, P, "target: y = 9", P.X(X * 0.5), P.Y(9) - 11, { color:ink, bg:true, size:11 });
      ring(ctx, P, 200, 15, css("--hi"), 9, 3.5); txt(ctx, P, "(200, 15)", P.X(200) + 13, P.Y(15) - 12, { size:11, bg:true });
    }
    var x = s.x, tg = priceTag(ctx, P, x, s.v, s.F, pen, 14, 0), right = tg.X < P.W - 130;
    var al = right ? "left" : "right", lx = tg.X + (right ? 12 : -12);
    var mid1 = (tg.y0 + tg.yv) / 2, mid2 = (tg.yv + tg.yA) / 2;
    if (tg.yv - tg.yA < 20) mid2 = tg.yv - 14;
    if (tg.y0 - tg.yv < 20) mid1 = tg.yv + 10;
    txt(ctx, P, tpl(U.make, { m:"$" + fmt(s.v, 2) }), lx, mid1, { align:al, size:12, bg:true, fit:true });
    txt(ctx, P, tpl(U.share, { s:money(s.F / x) }), lx, Math.max(12, mid2), { align:al, size:12, bold:true, bg:true, fit:true });
    if (P.Y(A(x)) >= 0) P.point({ x:x, y:A(x), r:5.5, ring:true, color:ink });
  }
  function drawCmp(ctx, P){
    var s = S.cmp, A = function(x){ return s.vA + s.FA / x; }, B = function(x){ return s.vB + s.FB / x; }, X = VIEWS[s.view].X;
    var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2"), hide = chalOn("tc3");
    axisCost(ctx, P);
    var dom = [X * 0.0005, P.v.xmax];
    hDash(ctx, P, s.vA); hDash(ctx, P, s.vB);
    txt(ctx, P, "$" + s.vA, P.W - 6, P.Y(s.vA) + (s.vA >= s.vB ? -10 : 11), { align:"right", color:ink2, bg:true });
    if (s.vB !== s.vA) txt(ctx, P, "$" + s.vB, P.W - 6, P.Y(s.vB) + (s.vB > s.vA ? -10 : 11), { align:"right", color:ink2, bg:true });
    P.curve({ f:A, color:pen, width:3.2, domain:dom });
    P.curve({ f:B, color:f3, width:2.6, domain:dom });
    var xl = X * 0.82, aHigh = A(xl) >= B(xl);
    txt(ctx, P, U.planA, P.X(xl), P.Y(A(xl)) + (aHigh ? -13 : 14), { color:pen, bold:true, bg:true, align:"center" });
    txt(ctx, P, U.planB, P.X(xl), P.Y(B(xl)) + (aHigh ? 14 : -13), { color:f3, bold:true, bg:true, align:"center" });
    // cheaper-here bands under the axis
    var dv = s.vA - s.vB, dF = s.FB - s.FA, xs = dv !== 0 ? dF / dv : null, by = P.Y(0) + 22, bh = 13;
    function band(x0, x1, who){
      var a = Math.max(P.X(Math.max(x0, 0)), 0), b = Math.min(P.X(x1), P.W); if (b - a < 1) return;
      ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = who === "A" ? pen : who === "B" ? f3 : ink2; ctx.fillRect(a, by, b - a, bh); ctx.restore();
      var lab = who ? tpl(U.cheaperBand, { p:who }) : U.sameCost; ctx.save(); ctx.font = "700 10.5px " + P.fontUI; var w = ctx.measureText(lab).width; ctx.restore();
      if (b - a > w + 8) txt(ctx, P, lab, (a + b) / 2, by + bh / 2, { align:"center", size:10.5, bold:true });
      else if (b - a > 12) txt(ctx, P, who || "=", (a + b) / 2, by + bh / 2, { align:"center", size:10.5, bold:true });
    }
    var cheapLow = function(x){ var d = A(x) - B(x); return Math.abs(d) < 1e-12 ? "" : d < 0 ? "A" : "B"; };
    if (xs != null && xs > 1 && xs < P.v.xmax) { band(1, xs, cheapLow((1 + xs) / 2)); band(xs, P.v.xmax, cheapLow(xs + 1)); }
    else band(1, P.v.xmax, cheapLow(Math.max(2, P.v.xmax / 2)));
    if (!hide && xs != null && xs >= 1 && xs <= P.v.xmax) {
      var yb = A(xs); P.point({ x:xs, y:yb, r:5.5, ring:true, color:ink });
      txt(ctx, P, "(" + (Number.isInteger(xs) ? fi(xs) : fmt(xs, 1)) + ", " + valT(yb).replace("≈ ", "≈") + ")", P.X(xs) + 10, P.Y(yb) - 14, { bold:true, bg:true, size:12, fit:true });
    }
    var x = s.x, ta = priceTag(ctx, P, x, s.vA, s.FA, pen, 9, -6), tb = priceTag(ctx, P, x, s.vB, s.FB, f3, 9, 6);
    txt(ctx, P, hide ? "A" : "A: " + money(A(x)), ta.X - 9, Math.max(10, ta.yA - 4), { align:"right", size:11.5, bold:true, bg:true, color:ink, fit:true });
    txt(ctx, P, hide ? "B" : "B: " + money(B(x)), tb.X + 9, Math.max(10, tb.yA - 4), { align:"left", size:11.5, bold:true, bg:true, color:ink, fit:true });
    if (P.Y(A(x)) >= 0) P.point({ x:x, y:A(x), r:4.5, color:ink });
    if (P.Y(B(x)) >= 0) P.point({ x:x, y:B(x), r:4.5, color:ink });
  }
  plot.render = function(){ paintPlot(); };
  strip.render = function(){ paintStrip(); };
  tank.render = function(){ paintTank(); };
  function drawPlot(){
    if (!T.view) T.view = targetView();
    var v = T.view, m = S.mode, pad = m === "cmp" ? 40 : 24;
    var view = { xmin:v.xmin, xmax:v.xmax, ymin:yLow(plotEl, v.ymax, pad), ymax:v.ymax };
    if (m === "conc") { concDraw(plot, view, concState(), { U:U, tc2:tgtOn("tc2"), rate:S.conc.rate }); return; }
    plot.draw({ view:view, yTicks:{ step:MV.niceStep(v.ymax / 7), fmt:posTick }, describe:describeCost(), after:function(ctx, P){ if (m === "cost") drawCost(ctx, P); else drawCmp(ctx, P); } });
  }
  function paintPlot(){ drawPlot(); }
  function concState(){ var c = S.conc; return { V0:c.V0, C0:c.C0, cin:c.cin, r:c.r, t:c.t, giant:c.tank === "giant" }; }
  function describeCost(){
    if (S.mode === "cost") { var s = S.cost, A = s.v + s.F / s.x; return "Graph of average cost A of x equals (" + s.F + " + " + s.v + "x)/x. Horizontal asymptote y = " + s.v + ". At " + s.x + " items the average is " + A.toFixed(2) + " dollars, " + (s.F / s.x).toFixed(2) + " dollars above the asymptote." + (s.view === "near" ? " Whole numbers of items shown as dots." : "") + (T.p2 ? " Ghost of the original curve, with the curves for half the setup cost and for v = 7." : ""); }
    var c = S.cmp; return "Graphs of Plan A, (" + c.FA + " + " + c.vA + "x)/x, and Plan B, (" + c.FB + " + " + c.vB + "x)/x, with asymptotes y = " + c.vA + " and y = " + c.vB + ". At " + c.x + " items Plan A averages " + (c.vA + c.FA / c.x).toFixed(2) + " and Plan B " + (c.vB + c.FB / c.x).toFixed(2) + " dollars.";
  }
  function paintTank(){
    if (S.mode !== "conc") return;
    var c = S.conc, f = concF(c), vol = c.V0 + c.r * c.t;
    tank.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false,
      describe:"Mixing tank holding " + fi(vol) + " litres at " + f(c.t).toFixed(2) + " grams per litre" + (c.tank === "giant" ? " (imaginary giant tank)" : vol > 300 ? ", overflowing the 300 litre tank" : " of 300 litres") + ". A jug of incoming brine at " + c.cin + " grams per litre pours in at " + c.r + " litres per minute.",
      after:function(ctx, P){ drawTank(ctx, P, { cin:c.cin, C:f(c.t), vol:vol, giant:c.tank === "giant", r:c.r, flow:T.flow, U:U }); } });
  }

  // ----- caption, readout, tables -----
  function readout(){
    var m = S.mode, rows = [];
    if (m === "cost") {
      var s = S.cost, x = s.x, A = s.v + s.F / x, R = U.rowsCost, Tt = s.F + s.v * x;
      rows.push([R[0], M(avgM("A", s.F, s.v))]);
      rows.push([R[1], M("x = " + fi(x))]);
      rows.push([R[2], M("T(" + fi(x) + ") = " + fi(s.F) + " + " + s.v + " × " + fi(x) + " = ") + "$" + fi(Tt)]);
      rows.push([R[3], M("A(" + fi(x) + ") = " + fi(Tt) + " ÷ " + fi(x)) + " " + moneyEq(A) + " " + U.perItem]);
      rows.push([R[4], tpl(U.shareRow, { make:"$" + fmt(s.v, 2), share:money(s.F / x) })]);
      rows.push([R[5], s.F === 0 ? tpl(U.haNone, { v:s.v }) : tpl(U.haRow, { eq:M("y = " + s.v), v:s.v, F:fi(s.F) })]);
      rows.push([R[6], s.F === 0 ? U.vaNone : tpl(U.vaRow, { eq:M("x = 0") })]);
      rows.push([R[7], U.domain]);
      rows.push([R[8], tpl(U.gapRow, { gap:money(s.F / x), F:fi(s.F), x:fi(x) })]);
    } else if (m === "cmp") {
      var c = S.cmp, xx = c.x, Ax = c.vA + c.FA / xx, Bx = c.vB + c.FB / xx, Rc = U.rowsCmp, hide = chalOn("tc3");
      rows.push([Rc[0], hide ? M("A(x) = {" + fi(c.FA) + " + " + coefM(c.vA) + "x}/{x}") : M("A(" + fi(xx) + ") = {" + fi(c.FA) + " + " + fi(c.vA * xx) + "}/{" + fi(xx) + "}") + " " + moneyEq(Ax) + " " + U.perItem]);
      rows.push([Rc[1], hide ? M("B(x) = {" + fi(c.FB) + " + " + coefM(c.vB) + "x}/{x}") : M("B(" + fi(xx) + ") = {" + fi(c.FB) + " + " + fi(c.vB * xx) + "}/{" + fi(xx) + "}") + " " + moneyEq(Bx) + " " + U.perItem]);
      var d = Ax - Bx;
      rows.push([tpl(Rc[2], { x:M("x = " + fi(xx)) }), hide ? U.hidden : Math.abs(d) < 1e-9 ? U.sameCost : tpl(U.cheaper, { p:d < 0 ? "A" : "B", d:money(Math.abs(d)) })]);
      var dv = c.vA - c.vB, dF = c.FB - c.FA, meet;
      if (dv === 0 && dF === 0) meet = U.always;
      else if (dv === 0) meet = tpl(U.never, { p:c.FA < c.FB ? "A" : "B" });
      else { var xs = dF / dv; if (xs < 1) meet = tpl(U.never, { p:c.vA < c.vB ? "A" : "B" }); else if (Math.abs(xs - Math.round(xs)) < 1e-9) { xs = Math.round(xs); meet = tpl(U.meet, { x:M("x = " + fi(xs)), c:money(c.vA + c.FA / xs), T:"$" + fi(c.FA + c.vA * xs) }); } else meet = tpl(U.meetFrac, { a:fi(Math.floor(xs)), b:fi(Math.ceil(xs)), x:M("x ≈ " + fmt(xs, 1)) }); }
      rows.push([Rc[3], hide ? U.hidden : meet]);
      rows.push([Rc[4], c.vA === c.vB ? tpl(U.longSame, { v:c.vA }) : c.vA < c.vB ? tpl(U.longCmp, { p:"A", v:c.vA, q:"B", w:c.vB }) : tpl(U.longCmp, { p:"B", v:c.vB, q:"A", w:c.vA })]);
    } else {
      var k = S.conc, f = concF(k), t = k.t, vol = k.V0 + k.r * t, salt = k.C0 * k.V0 + k.cin * k.r * t, Cv = salt / vol, Rk = U.rowsConc, same = k.C0 === k.cin;
      rows.push([Rk[0], M(concM(k))]);
      rows.push([Rk[1], M("t = " + fi(t)) + " min"]);
      rows.push([Rk[2], M(fi(k.V0) + " + " + k.r + " × " + fi(t) + " = " + fi(vol)) + " L"]);
      rows.push([Rk[3], M(fi(k.C0 * k.V0) + " + " + k.cin + " × " + k.r + " × " + fi(t) + " = " + fi(salt)) + " g"]);
      rows.push([Rk[4], M("C(" + fi(t) + ") = " + fi(salt) + " ÷ " + fi(vol)) + " " + valEq(Cv) + " g/L"]);
      rows.push([Rk[5], same ? tpl(U.haConcSame, { eq:M("C = " + k.cin) }) : tpl(U.haConc, { eq:M("C = " + k.cin), c:k.cin })]);
      var hole = fracApx(-k.V0, k.r);
      rows.push([Rk[6], same ? tpl(U.noChange, { Ct:M("C(t) = " + k.cin), hole:M("t = " + hole.m) + hole.apx }) : k.C0 < k.cin ? U.below : U.above]);
      var gap = Math.abs(Cv - k.cin);
      rows.push([Rk[7], same ? U.gapNone : tpl(k.C0 < k.cin ? U.gapBelow : U.gapAbove, { g:valT(gap) })]);
      rows.push([Rk[8], same ? tpl(U.vaConcSame, { hole:M("t = " + hole.m) + hole.apx }) : tpl(U.vaConc, { eq:M("t = " + hole.m) + hole.apx, vol:M(fi(k.V0) + " + " + coefM(k.r) + "t") })]);
      var full = fracApx(300 - k.V0, k.r);
      rows.push([Rk[9], k.tank === "giant" ? U.tankGiant : tpl(U.tankFull, { t:M("t = " + full.m) + full.apx })]);
      if (k.rate) {
        var t2 = k.tank === "giant" ? t + 10 : Math.min(t + 10, tFullOf(k)), n = t2 - t;
        if (n <= 1e-9) rows.push([Rk[10], "—"]);
        else { var sl2 = (f(t2) - f(t)) / n, nn = valT(n); rows.push([Rk[10], Math.abs(sl2) < 1e-12 ? tpl(U.steady, { n:nn }) : tpl(U.rate, { n:nn, dir:sl2 > 0 ? U.rising : U.falling, r:valT(Math.abs(sl2)) })]); }
      }
    }
    $("#ex-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function caption(){
    var m = S.mode, h;
    if (m === "cost") h = M(avgM("A", S.cost.F, S.cost.v));
    else if (m === "cmp") { var c = S.cmp; h = M("A(x) = {" + fi(c.FA) + " + " + coefM(c.vA) + "x}/{x}") + '<span class="ex23-sep"> · </span>' + M("B(x) = {" + fi(c.FB) + " + " + coefM(c.vB) + "x}/{x}"); }
    else h = M(concM(S.conc));
    $("#ex-cap", host).innerHTML = h;
  }
  function tables(){
    var h = "", note = "";
    if (S.mode === "cost" && T.p2 && T.p2.table) {
      var rws = [[1200, 8], [600, 8], [1200, 7]].map(function(p, i){ return [U.p2.rows[i], moneyLR(p[1] + p[0] / 100000)]; });
      h = MV.tableHTML({ head:U.p2.head, rows:rws, caption:U.p2.head[1] });
    } else if (S.mode === "cost" && S.cost.view === "far") {
      var s = S.cost, xs = [1000, 10000, 100000];
      h = MV.tableHTML({ head:[U.longRun + ": " + M("x")].concat(xs.map(fi)), rows:[[M("A(x)")].concat(xs.map(function(x){ return moneyLR(s.v + s.F / x); }))], caption:U.longRun });
    } else if (S.mode === "conc" && S.conc.tank === "giant" && S.conc.far) {
      var f = concF(S.conc), ts = [60, 600, 6000];
      h = MV.tableHTML({ head:[U.longRun + ": " + M("t") + " (min)"].concat(ts.map(fi)), rows:[[M("C(t)") + " (g/L)"].concat(ts.map(function(t){ return valT(f(t)); }))], caption:U.longRun });
    }
    if (S.mode === "cost" && S.cost.view === "near" && !T.p2) note = U.near;
    $("#ex-table", host).innerHTML = h; $("#ex-note", host).textContent = note;
  }
  function paint(){
    root.dataset.mode = S.mode;
    caption(); drawPlot(); paintStrip(); paintTank(); readout(); tables();
    MV.changed();
  }

  // ----- challenges: set-up buttons injected into the toolkit's cards -----
  function applyStart(st){
    var m = st.mode; S.mode = m;
    if (m === "cost") S.cost = { F:st.F, v:st.v, x:st.x, view:st.view };
    else if (m === "cmp") S.cmp = { FA:st.FA, vA:st.vA, FB:st.FB, vB:st.vB, x:st.x, view:st.view };
    else S.conc = { V0:st.V0, C0:st.C0, cin:st.cin, r:st.r, t:st.t, tank:st.tank, far:false, rate:false };
    T.stripN = m === "cost" ? S.cost.x : null;
  }
  function setup(id){
    var c = (C.challenges || []).filter(function(x){ return x.id === id; })[0]; if (!c || T.busy) return;
    stopRun(); stopView(); clearOverlay(); applyStart(c.start); T.chal = id; T.focus = id; api.save();
    renderMode(); renderCtrl(); T.view = targetView(); paint();
    banner("", "Challenge " + id.slice(2) + " is set up.");
    var g = $("[data-mv=graph]", host), r = g.getBoundingClientRect();
    if (r.top < 60 || r.top > window.innerHeight * 0.5) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  }
  var chalHost = $("#chal");
  function inject(){
    if (!chalHost) return;
    $$(".chal[data-c]", chalHost).forEach(function(box){
      var qa = box.querySelector(".q-actions"); if (!qa || qa.querySelector("[data-setup]")) return;
      var b = document.createElement("button"); b.type = "button"; b.className = "btn ghost sm"; b.dataset.setup = box.dataset.c; b.dataset.k = box.dataset.c + "setup"; b.textContent = U.setup;
      qa.insertBefore(b, qa.firstChild);
    });
  }
  if (chalHost) {
    new MutationObserver(inject).observe(chalHost, { childList:true, subtree:true });
    chalHost.addEventListener("click", function(e){ var b = e.target.closest("[data-setup]"); if (b) setup(b.dataset.setup); });
    setTimeout(inject, 0);
  }
  function chalFocus(e){
    var box = e.target && e.target.closest && e.target.closest("#chal [data-c]"); if (!box) return;
    if (T.focus !== box.dataset.c) { T.focus = box.dataset.c; setTimeout(function(){ goView(300); }, 0); }
  }
  document.addEventListener("click", chalFocus); document.addEventListener("focusin", chalFocus);
  function fbOf(id){ return ((C.challenges || []).filter(function(x){ return x.id === id; })[0] || {}).fb || {}; }
  function challenge(id, opt){
    var fb = fbOf(id), r;
    if (id === "tc1") {
      var s = S.cost, F = s.F, v = s.v;
      if (v === 9 && F === 1200) r = { ok:true };
      else if (v === 15) r = { msg:fb.v15 };
      else if (F + 200 * v === 3000) r = { msg:tpl(fb.onDot, { ha:M("y = " + v) }) };
      else if (v === 9 && F === 3000) r = { msg:fb.F3000 };
      else if (v === 9 && F === 1800) r = { msg:fb.F1800 };
      else if (v === 9) r = { msg:tpl(fb.vRight, { avg:money(v + F / 200) }) };
      else r = { msg:fb.other };
    } else if (id === "tc2") {
      var k = S.conc;
      if (k.C0 === 0 && k.cin === 40 && k.V0 === 10 * k.r && k.V0 + 10 * k.r <= 300) r = { ok:true };
      else if (k.cin === 20) r = { msg:fb.c20 };
      else if (k.cin === 40 && k.V0 === 10 * k.r && k.r >= 16) { var tf = fracApx(300 - k.V0, k.r); r = { msg:tpl(fb.overflow, { tf:M("t = (300 - V_0)/r = " + tf.m) + tf.apx + " min" }) }; }
      else if (k.cin === 40 && k.V0 !== 10 * k.r) { var th = fracApx(k.V0, k.r); r = { msg:tpl(fb.half, { th:M("t = V_0/r = " + th.m) + th.apx + " min" }) }; }
      else r = { msg:fb.other };
    } else if (id === "tc3") {
      var c = S.cmp, Fb = c.FB, vb = c.vB;
      if (Fb + 400 * vb === 4000 && vb < 6) r = { ok:true };
      else if (Fb === 1600 && vb === 6) r = { msg:fb.same };
      else if (Fb + 400 * vb === 4000 && vb > 6) r = { msg:tpl(fb.above, { ha:M("y = " + vb) }) };
      else if (vb < 6 && Fb <= 1600) r = { msg:fb.never };
      else if (vb < 6 && Fb > 1600) { var mx = fracApx(Fb - 1600, 6 - vb); r = { msg:tpl(fb.meet, { meet:M("x = (F_{B} - 1600)/(6 - v_{B}) = " + mx.m) + mx.apx }) }; }
      else if (vb === 6) r = { msg:fb.v6 };
      else r = { msg:tpl(fb.other, { vB:vb }) };
    } else r = { ok:false };
    r.ok = !!r.ok;
    if (r.ok && !(opt && opt.live) && T.chal === id) setTimeout(function(){ leave(); }, 0);
    return r;
  }

  // ----- predictions -----
  function predStart(p){
    stopRun(); stopView(); clearOverlay(); banner("", ""); T.chal = null;
    applyStart(p.start); api.save();
    T.busy = false; renderMode(); renderCtrl(); T.view = targetView(); paint();
  }
  function predRun(p, done){
    setBusy(true);
    function finish(){ setBusy(false); api.save(); paint(); done(); }
    function tweenKey(obj, key, to, dur, after){
      var from = obj[key], step = key === "t" && S.conc.far ? 10 : 1;
      MV.tween({ dur:dur, ease:function(t){ return key === "t" ? t : MV.ease(t); }, step:function(t){ obj[key] = Math.round((from + (to - from) * t) / step) * step; if (key === "x") T.stripN = from + (to - from) * t; syncSlider(key, obj[key]); paint(); }, done:function(){ obj[key] = to; if (key === "x") T.stripN = to; paint(); after(); } });
    }
    if (p.id === "p1") tweenKey(S.cost, "x", 400, 2000, finish);
    else if (p.id === "p2") {
      S.cost.view = "far"; S.cost.x = fitX(S.cost.x, "far"); renderCtrl();
      goView(2000, function(){
        T.p2 = { a:0, b:0, table:false }; paint();
        MV.tween({ dur:1200, step:function(t){ T.p2.a = t; drawPlot(); }, done:function(){ T.p2.a = 1;
          MV.tween({ dur:1200, step:function(t){ T.p2.b = t; drawPlot(); }, done:function(){ T.p2.b = 1; T.p2.table = true; var keep = T.p2; setBusy(false); T.p2 = keep; api.save(); paint(); done(); } });
        } });
      });
    } else if (p.id === "p3") {
      S.conc.rate = true; renderCtrl(); T.flow = true;
      tweenKey(S.conc, "t", 600, 4000, function(){ T.flow = false; S.conc.far = true; renderCtrl(); goView(1500, finish); });
    } else if (p.id === "p4") { T.flow = true; tweenKey(S.conc, "t", 600, 4000, function(){ T.flow = false; finish(); }); }
    else finish();
  }

  renderMode(); renderCtrl(); T.stripN = S.cost.x; T.view = targetView(); paint();
  return { predict:{ start:predStart, run:predRun }, challenge:challenge };
}

// concentration graph (Explore and task). o: {U, tc2, task, rate}
function concDraw(plot, view, s, o){
  var U = o.U, f = concF(s), tF = tFullOf(s), t = s.t, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2");
  var vol = s.V0 + s.r * t;
  plot.draw({ view:view, yTicks:{ step:10, fmt:posTick }, xTicks:{ step:MV.niceStep(view.xmax / 6) },
    describe:"Graph of the concentration C of t equals " + MV.plain(M(concM(s))).replace(/−/g, "minus ") + ". Horizontal asymptote C = " + s.cin + ". At t = " + t + " minutes the concentration is " + f(t).toFixed(2) + " grams per litre." + (s.giant ? " Imaginary giant tank." : " The tank is full at t = " + tF.toFixed(1) + " minutes; after that the curve is faded."),
    after:function(ctx, P){
      rich(ctx, P, [[U.axT || "time, ", false], ["t", true], [" (min)", false]], P.W - 6, P.Y(0) - 12, { align:"right", bg:true });
      rich(ctx, P, [[U.axC || "concentration (g/L)", false]], P.X(0) + 8, 12, { bg:true });
      var xe = P.v.xmax, end = s.giant ? xe : Math.min(tF, xe);
      P.curve({ f:f, color:pen, width:3, alpha:0.35, domain:[0, end] });
      if (!s.giant && tF < xe) {
        P.curve({ f:f, color:pen, width:3, alpha:0.2, domain:[tF, xe] });
        vLine(ctx, P, tF, ink2, null, 1.5);
        txt(ctx, P, U.fullLine, P.X(tF) + (P.X(tF) > P.W - 80 ? -5 : 5), 26, { align:P.X(tF) > P.W - 80 ? "right" : "left", size:11, color:ink2, bg:true });
        if (P.X(xe) - P.X(tF) > 130) { var tb = tF + (xe - tF) * 0.72; txt(ctx, P, U.bigger, P.X(tb), P.Y(f(tb)) + (f(tF) > s.cin ? -15 : 15), { align:"center", size:11, color:ink2, bg:true, fit:true }); }
      }
      if (t > 0) P.curve({ f:f, color:pen, width:3.2, domain:[0, t] });
      hDash(ctx, P, s.cin);
      txt(ctx, P, tpl(U.haConcLabel, { c:s.cin }), P.W - 6, P.Y(s.cin) + (s.cin > 50 ? 12 : -10), { align:"right", color:ink2, bg:true, size:12 });
      if (o.task) {
        hDash(ctx, P, 10, css("--hi"), [10, 6], 3.5);
        txt(ctx, P, o.targetHA, P.X(0) + 34, P.Y(10) + 12, { size:11, bg:true });
        ring(ctx, P, 20, 30, css("--hi"), 9, 3.5); txt(ctx, P, "(20, 30)", P.X(20) + 12, P.Y(30) - 12, { size:11, bg:true });
      }
      if (o.tc2) { ring(ctx, P, 10, 20, css("--hi"), 9, 3.5); txt(ctx, P, "(10, 20)", P.X(10) + 12, P.Y(20) - 12, { size:11, bg:true }); }
      gapBar(ctx, P, t, s.cin, f(t), 10);
      if (o.rate) {
        var t2 = s.giant ? t + 10 : Math.min(t + 10, tF);
        if (t2 - t > 1e-9) {
          var sl = (f(t2) - f(t)) / (t2 - t), lab = "slope " + valT(sl) + " g/L per min";
          P.line({ p:[t, f(t)], q:[t2, f(t2)], segmentOnly:true, color:ink2, width:2 });
          P.point({ x:t2, y:f(t2), r:4, color:ink2 }); P.point({ x:t, y:f(t), r:4, color:ink2 });
          txt(ctx, P, lab, P.X(t2) + 8, P.Y(f(t2)) + (sl > 0 ? 14 : -14), { size:11, bg:true, fit:true });
        }
      }
      P.point({ x:t, y:f(t), r:5.5, ring:true, color:ink });
      if (!s.giant && vol > 300) txt(ctx, P, U.overflow, P.X(t) + 10, P.Y(f(t)) + 16, { size:11, bold:true, bg:true, fit:true });
    } });
}

// ---------- Part 3: what does the asymptote mean here? ----------
var P3 = {
  boat:{ f:function(s){ return 24 / (s - 3); }, inDom:function(s){ return s > 3; }, va:3, ha:0,
    views:{ def:{ xmin:0, xmax:30, ymin:-30, ymax:30 }, out:{ xmin:-15, xmax:300, ymin:-10, ymax:20 }, "in":{ xmin:1.5, xmax:4.5, ymin:-160, ymax:160 } },
    feats:{ va:{ k:"v", x:3 }, ha:{ k:"h", y:0, lx:0.72, dy:30 }, branch:{ k:"p", x:1, y:-12 } }, out:[0.25, -4], inp:{ min:4, max:30, def:5 } },
  ft:{ f:function(n){ return (12 + n) / (20 + n); }, inDom:function(n){ return n >= 0; }, whole:true, va:-20, ha:1,
    views:{ def:{ xmin:-60, xmax:160, ymin:-1, ymax:3 }, out:{ xmin:-150, xmax:2000, ymin:-1, ymax:2 }, "in":{ xmin:-30, xmax:-10, ymin:-25, ymax:25 } },
    feats:{ pt:{ k:"p", x:0, y:0.6 }, ha:{ k:"h", y:1, lx:0.72, dy:-11 }, va:{ k:"v", x:-20 } }, out:[-58, -0.6], inp:{ min:0, max:160, def:20 } },
  pipes:{ f:function(x){ return 6 * x / (x + 6); }, inDom:function(x){ return x > 0; }, va:-6, ha:6,
    views:{ def:{ xmin:-20, xmax:60, ymin:-10, ymax:20 }, out:{ xmin:-60, xmax:600, ymin:-10, ymax:14 }, "in":{ xmin:-10, xmax:-2, ymin:-120, ymax:120 } },
    feats:{ ha:{ k:"h", y:6, lx:0.72, dy:-11 }, pt:{ k:"p", x:6, y:3 }, dom:{ k:"d" } }, out:[-19, 17.5], inp:{ min:1, max:60, def:3 } }
};
function part3(host, api){
  var C = api.content, U = C.ui, S = api.S, SITS = C.sits;
  S.sit = S.sit || "boat"; S.ans = S.ans || {}; S.sel = S.sel || {}; S.zoom = S.zoom || {}; S.inp = S.inp || {};
  var R = { view:null, anim:null, step:0, msg:null };
  host.innerHTML = '<div id="m-sit" class="m23-sit"></div><div class="m23-story" id="m-story"></div>' +
    '<div class="sym m23"><div><div class="plot-wrap"><canvas class="plot" id="m-plot" role="img" aria-label="Graph"></canvas></div>' +
    '<div class="m23-feats" id="m-feats" role="group" aria-label="Features of the graph"></div><div class="q-actions" id="m-zoom"></div></div>' +
    '<div class="m23-card" id="m-card"></div></div><div class="m23-alg" id="m-alg"></div>';
  var plotEl = $("#m-plot", host), plot = new MV.Plot(plotEl, P3.boat.views.def);
  function sit(){ return SITS.filter(function(x){ return x.id === S.sit; })[0]; }
  function D(){ return P3[S.sit]; }
  function key(fid){ return S.sit + "." + fid; }
  function ast(fid){ return S.ans[key(fid)] || (S.ans[key(fid)] = { tries:0, solved:false, first:null, last:null }); }
  function allSolved(){ return sit().feats.every(function(f){ return S.ans[key(f.id)] && S.ans[key(f.id)].solved; }); }
  function zv(){ var z = S.zoom[S.sit] || "def"; return D().views[z]; }
  MV.seg($("#m-sit", host), { label:"Situation", value:S.sit, options:SITS.map(function(s){ return { id:s.id, t:s.name }; }), onChange:function(v){ S.sit = v; R.msg = null; R.step = 0; api.save(); if (R.anim) { R.anim(); R.anim = null; } R.view = zv(); paintAll(); } });
  function zoom(z){
    var cur = S.zoom[S.sit] || "def", to = cur === z ? "def" : z; S.zoom[S.sit] = to; api.save();
    var a = R.view || zv(), b = D().views[to];
    if (R.anim) R.anim();
    R.anim = MV.tween({ dur:700, step:function(t){ var L = function(p, q){ return p + (q - p) * t; }; R.view = { xmin:L(a.xmin, b.xmin), xmax:L(a.xmax, b.xmax), ymin:L(a.ymin, b.ymin), ymax:L(a.ymax, b.ymax) }; draw(); }, done:function(){ R.anim = null; R.view = b; draw(); paintZoom(); } });
    paintZoom();
  }
  function paintZoom(){
    var z = S.zoom[S.sit] || "def";
    MV.keepFocus($("#m-zoom", host), function(){ $("#m-zoom", host).innerHTML = '<button type="button" class="btn ghost sm" data-z="out" data-k="zout" aria-pressed="' + (z === "out") + '">' + U.zoomOut + '</button><button type="button" class="btn ghost sm" data-z="in" data-k="zin" aria-pressed="' + (z === "in") + '">' + U.zoomIn + "</button>"; });
  }
  function axisTitles(ctx, P, s){
    rich(ctx, P, [[s.x, true]].concat(s.xu ? [[" (" + s.xu + ")", false]] : []), P.W - 6, clamp(P.Y(0), 20, P.H - 30) - 12, { align:"right", bg:true });
    rich(ctx, P, [[s.y, true]].concat(s.yu ? [[" (" + s.yu + ")", false]] : []), clamp(P.X(0), 4, P.W - 60) + 8, 12, { bg:true });
  }
  plot.render = draw;
  function draw(){
    var s = sit(), d = D(), v = R.view || zv(), pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), hi = css("--hi"), sel = S.sel[S.sit];
    plot.draw({ view:v, describe:describe(), after:function(ctx, P){
      axisTitles(ctx, P, s);
      // features: glow first, then lines
      Object.keys(d.feats).forEach(function(fid){
        var ft = d.feats[fid], on = sel === fid;
        if (ft.k === "v") { if (on) vLine(ctx, P, ft.x, hi, null, 9); vLine(ctx, P, ft.x, ink2, [8, 6], 1.5); }
        if (ft.k === "h") { if (on) { var Y = P.Y(ft.y); ctx.save(); ctx.strokeStyle = hi; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(P.W, Y); ctx.stroke(); ctx.restore(); } hDash(ctx, P, ft.y); }
        if (ft.k === "d") { var y0 = P.Y(0) + 7, x0 = Math.max(P.X(0), 0); ctx.save(); if (on) { ctx.strokeStyle = hi; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(P.W, y0); ctx.stroke(); } ctx.strokeStyle = ink2; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 + 5, y0); ctx.lineTo(P.W - 2, y0); ctx.stroke(); ctx.restore(); P.point({ x:0, y:P.yOf(y0), open:true, r:5, color:ink2 }); }
      });
      // faded part (outside the situation) and solid part
      var span = v.xmax - v.xmin;
      P.curve({ f:function(x){ return d.inDom(x) ? NaN : d.f(x); }, color:pen, width:2.6, alpha:0.3, dash:[2, 5], domain:[v.xmin, v.xmax] });
      if (d.whole) {
        var px = P.X(1) - P.X(0);
        P.curve({ f:d.f, color:pen, width:2.6, alpha:px >= 2.5 ? 0.35 : 1, domain:[0, v.xmax] });
        if (px >= 2.5) { ctx.save(); ctx.fillStyle = pen; for (var n = Math.max(0, Math.ceil(v.xmin)); n <= v.xmax; n++) { var Yn = P.Y(d.f(n)); if (Yn < -4 || Yn > P.H + 4) continue; ctx.beginPath(); ctx.arc(P.X(n), Yn, clamp(px * 0.36, 1, 2.5), 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
      } else P.curve({ f:function(x){ return d.inDom(x) ? d.f(x) : NaN; }, color:pen, width:3.2, domain:[Math.max(v.xmin, d.va + span * 1e-4), v.xmax] });
      void span;
      txt(ctx, P, U.outside, P.X(d.out[0]), P.Y(d.out[1]), { size:11, color:ink2, bg:true, fit:true });
      // labels and point features
      Object.keys(d.feats).forEach(function(fid){
        var ft = d.feats[fid], st = S.ans[key(fid)], mark = st && st.solved ? " ✓" : "", f0 = s.feats.filter(function(q){ return q.id === fid; })[0];
        if (ft.k === "v") txt(ctx, P, MV.plain(f0.label).replace(/^Vertical asymptote /, "") + mark, P.X(ft.x) + 5, 30, { math:true, size:13, color:ink2, bg:true, fit:true });
        if (ft.k === "h") txt(ctx, P, MV.plain(f0.label).replace(/^Horizontal asymptote /, "") + mark, P.W * ft.lx, P.Y(ft.y) + ft.dy, { align:"center", math:true, size:13, color:ink2, bg:true });
        if (ft.k === "d") txt(ctx, P, "domain?" + mark, P.W - 8, P.Y(0) + 22, { align:"right", size:11, color:ink2, bg:true });
        if (ft.k === "p") {
          if (sel === fid) ring(ctx, P, ft.x, ft.y, hi, 12, 6);
          if (fid === "branch") { P.point({ x:ft.x, y:ft.y, open:true, r:6, color:ink }); txt(ctx, P, "?" + mark, P.X(ft.x) + 10, P.Y(ft.y), { bold:true, size:13, bg:true }); }
          else P.point({ x:ft.x, y:ft.y, r:5, color:ink, label:"(" + num(ft.x) + ", " + num(ft.y) + ")" + mark });
        }
      });
      if (R.step >= 5 && allSolved()) {
        var u = S.inp[S.sit] != null ? S.inp[S.sit] : d.inp.def;
        gapBar(ctx, P, u, d.ha, d.f(u), 10); P.point({ x:u, y:d.f(u), r:5, ring:true, color:ink });
      }
    } });
  }
  function describe(){
    var s = sit(), sel = S.sel[S.sit];
    return "Graph of " + MV.plain(s.story).replace(/^.*?(\w\(\w\) =)/, "$1") + " The part inside the situation is solid; the rest is faded and dotted. Marked features: " + s.feats.map(function(f){ return MV.plain(f.label); }).join(", ") + "." + (sel ? " Selected: " + MV.plain(s.feats.filter(function(f){ return f.id === sel; })[0].label) + "." : "");
  }
  function opts(f){ var o = f.options.map(function(x, i){ return i; }); return f.options.length === 4 ? o : MV.shuffle(o, "23" + S.sit + f.id); }
  function paintFeats(){
    var s = sit();
    MV.keepFocus($("#m-feats", host), function(){
      $("#m-feats", host).innerHTML = s.feats.map(function(f){ var st = S.ans[key(f.id)], tag = st && st.solved ? '<span class="m23-ok">✓</span> ' : "", tail = st && !st.solved && st.tries ? ' <span class="m23-try">(' + U.tryAgain + ")</span>" : "";
        return '<button type="button" class="chip m23-f' + (S.sel[S.sit] === f.id ? " on" : "") + '" data-f="' + f.id + '" data-k="mf' + f.id + '" aria-pressed="' + (S.sel[S.sit] === f.id) + '">' + tag + f.label + tail + "</button>"; }).join("");
    });
  }
  function paintCard(){
    var s = sit(), fid = S.sel[S.sit], host2 = $("#m-card", host);
    if (!fid) { host2.innerHTML = '<p class="muted">' + U.pick + "</p>"; return; }
    var f = s.feats.filter(function(q){ return q.id === fid; })[0], st = ast(fid), ri = MV.right(f.options);
    var h = '<h4 class="m23-q" id="m-q" tabindex="-1">' + f.label + "</h4><p class=\"q-prompt\">" + f.q + '</p><div class="opts m23-opts" role="radiogroup" aria-label="Choose a meaning">' +
      opts(f).map(function(i){ var o = f.options[i], c = "opt"; if (st.solved && i === ri) c += " right"; else if (!st.solved && st.last === i) c += " wrong";
        return '<button type="button" class="' + c + '" role="radio" aria-checked="' + (st.last === i) + '" data-o="' + i + '" data-k="mo' + fid + i + '"' + (st.solved ? " disabled" : "") + "><span>" + o.t + "</span></button>"; }).join("") + "</div>";
    if (st.last != null) { var o2 = f.options[st.last], good = st.last === ri; h += good ? '<div class="fb good" role="status"><p><strong>✓</strong> ' + o2.fb + (st.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + o2.fb + " Try again.</p></div>"; }
    MV.keepFocus(host2, function(){ host2.innerHTML = h; });
  }
  function algStep(i){
    var s = sit(), d = D(), St = U.steps, out = [];
    out.push("<p><strong>1. " + St[0] + ".</strong> " + U.splitTop + " " + s.alg.top + "</p>");
    if (i >= 1) out.push("<p><strong>2. " + St[1] + ":</strong> " + s.alg.frac + "</p>");
    if (i >= 2) out.push("<p><strong>3. " + St[2] + ":</strong> " + U.read + "</p>");
    if (i >= 3) out.push("<p><strong>4. " + St[3] + "</strong> " + U.side + "</p>");
    if (i >= 4) out.push('<p class="m23-note"><strong>5. ' + St[4] + ":</strong> " + U.note + "</p>");
    if (i >= 5) {
      var u = S.inp[S.sit] != null ? S.inp[S.sit] : d.inp.def;
      out.push("<p><strong>6. " + St[5] + ":</strong></p>" + '<label class="slider m23-sl"><span class="slider-top"><span>' + M(s.x) + '</span><output id="m-inp-out">' + num(u) + '</output></span><input type="range" id="m-inp" data-inp="1" min="' + d.inp.min + '" max="' + d.inp.max + '" step="1" value="' + u + '"></label>' +
        '<p id="m-inp-read" aria-live="polite">' + inpRead(u) + '</p><p class="tiny muted">' + U.samples + " " + s.alg.samples + "</p>");
    }
    return out.join("");
  }
  function inpRead(u){
    var s = sit(), d = D(), y = d.f(u), L = y - d.ha, r;
    if (S.sit === "boat") r = M("t = 0 + {24}/{" + u + " - 3} = 0 + " + num(L, 3) + " = " + num(y, 3)) + " h";
    else if (S.sit === "ft") r = M("P = 1 - {8}/{" + (20 + u) + "} = 1 - " + num(-L, 4) + " = " + num(y, 4)) + ": " + num(y * 100, 2) + "%";
    else r = M("T = 6 - {36}/{" + (u + 6) + "} = 6 - " + num(-L, 3) + " = " + num(y, 3)) + " h";
    void s;
    return r + ". " + tpl(U.gapIs, { l:num(L, 4) });
  }
  function paintAlg(){
    var a = $("#m-alg", host);
    if (!allSolved()) { a.innerHTML = '<h3>' + U.algTitle + '</h3><p class="muted">' + U.algLocked + "</p>"; R.step = 0; return; }
    a.innerHTML = "<h3>" + U.algTitle + '</h3><div id="m-steps" class="m23-steps" aria-live="polite"></div><div id="m-pl"></div>';
    var St = U.steps;
    MV.player($("#m-pl", a), { count:6, interval:1600, label:function(i){ return "Step " + (i + 1) + " of 6: " + St[i]; }, render:function(i){ R.step = i; $("#m-steps", a).innerHTML = algStep(i); draw(); } });
  }
  $("#m-alg", host).addEventListener("input", function(e){
    if (!e.target.dataset.inp) return; var u = +e.target.value; S.inp[S.sit] = u; api.save();
    $("#m-inp-out", host).textContent = num(u); $("#m-inp-read", host).innerHTML = inpRead(u); draw();
  });
  function select(fid, focusCard){
    S.sel[S.sit] = fid; R.msg = null; api.save(); paintFeats(); paintCard(); draw();
    if (focusCard) { var q = $("#m-q", host); if (q) q.focus(); }
    else { var c = $("#m-card", host); if (c && c.getBoundingClientRect().top > window.innerHeight - 80) c.scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.f) { select(b.dataset.f, e.detail === 0); return; }
    if (b.dataset.z) { zoom(b.dataset.z); return; }
    if (b.dataset.o != null) {
      var fid = S.sel[S.sit], f = sit().feats.filter(function(q){ return q.id === fid; })[0], st = ast(fid), i = +b.dataset.o;
      st.last = i;
      if (MV.ok(f.options[i])) { st.solved = true; if (st.first == null) st.first = st.tries === 0; }
      else { st.tries++; st.first = false; }
      var was = allSolved(); void was;
      api.save(); paintCard(); paintFeats(); draw(); paintAlg(); MV.focusFb($("#m-card", host));
    }
  });
  // tap a feature on the graph (G7-style hit test: asymptote bands 24 px, points 32 px)
  plotEl.addEventListener("click", function(e){
    var P = plot, r = plotEl.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, d = D(), best = null, bd = 1e9;
    Object.keys(d.feats).forEach(function(fid){
      var ft = d.feats[fid], dist = 1e9;
      if (ft.k === "p") { dist = Math.hypot(P.X(ft.x) - px, P.Y(ft.y) - py); dist = dist <= 16 ? dist - 100 : 1e9; }
      else if (ft.k === "v") { dist = Math.abs(P.X(ft.x) - px); if (dist > 12) dist = 1e9; }
      else if (ft.k === "h") { dist = Math.abs(P.Y(ft.y) - py); if (dist > 12) dist = 1e9; }
      else if (ft.k === "d") { dist = px >= P.X(0) - 8 ? Math.abs(P.Y(0) + 7 - py) : 1e9; if (dist > 12) dist = 1e9; }
      if (dist < bd) { bd = dist; best = fid; }
    });
    if (best) select(best, false);
  });
  function paintAll(){
    var s = sit();
    $("#m-story", host).innerHTML = "<p>" + s.story + "</p>";
    if (!R.view) R.view = zv();
    paintFeats(); paintZoom(); paintCard(); paintAlg(); draw();
  }
  MV.ACTS.meaning = { a:{ id:"meaning" }, stats:function(){ return { first:0, total:0, done:0, line:"" }; },
    missed:function(){ return Object.keys(S.ans).some(function(k){ var x = S.ans[k]; return x.first === false; }) ? [1] : []; } };
  R.view = zv(); paintAll();
  return {};
}

// ---------- Practice: number boxes ----------
// @component N4 boxSet — adapted from MHF4U 11: one-at-a-time items whose frame holds several number boxes; named wrong
// entries (whole set or one box), wrong boxes outlined, three-level hints, first-try scoring. opt: {noun, frame(it, box), judge(it, raw) -> {empty|ok|bad|fbs|msg}, right(it, res)}
function boxSet(host, api, a, opt){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  if (S.i >= a.items.length) S.i = 0;
  var msgs = {}, bads = {};
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { vals:{}, tries:0, hint:0, solved:false, first:null, res:null }); }
  function inp(it, id, label, kind){ var x = ist(it), bad = bads[it.id] && bads[it.id][id]; return '<input class="bx-in' + (bad ? " bad" : "") + '" type="' + (kind || "text") + '"' + (kind === "number" ? ' step="1"' : ' inputmode="decimal"') + ' autocomplete="off" spellcheck="false" data-bx="' + id + '" data-k="bx' + it.id + id + '" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.vals[id] || "") + '"' + (x.solved ? " disabled" : "") + (bad ? ' aria-invalid="true"' : "") + ">"; }
  function paint(){
    var it = a.items[S.i], x = ist(it);
    var h = (a.how ? '<p class="how">' + a.how + "</p>" : "") + '<div class="pred-top"><span class="tiny muted">' + opt.noun + " " + (S.i + 1) + " of " + a.items.length + '</span><span class="dots" aria-hidden="true">' +
      a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<div class="bx-item" data-it="' + it.id + '">' + opt.frame(it, function(id, label, kind){ return inp(it, id, label, kind); }) + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="bxchk">Check</button>' + MV.hintBtn("bxh" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p>' + opt.right(it, x) + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p>" + (opt.after ? opt.after(it, x) : "") + "</div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="prev" data-k="bxprev"' + (S.i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-act="next" data-k="bxnext"' + (S.i === a.items.length - 1 ? " disabled" : "") + ">Next</button></div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  function check(){
    var it = a.items[S.i], x = ist(it), r = opt.judge(it, x.vals);
    if (r.msg) { msgs[it.id] = r.msg; bads[it.id] = null; paint(); MV.focusFb(host); return; }
    if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.res = r.res || null; msgs[it.id] = null; bads[it.id] = null; api.save(); paint(); MV.focusFb(host); return; }
    x.tries++; bads[it.id] = r.bad || {};
    var fbs = (r.fbs || []).filter(function(t, i, arr){ return arr.indexOf(t) === i; });
    msgs[it.id] = fbs.length ? "<strong>✗ Not quite.</strong> " + fbs.join(" ") + " Try again." : "<strong>✗</strong> " + opt.general;
    api.save(); paint(); MV.focusFb(host);
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; ist(a.items[S.i]).vals[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){
    var t = e.target; if (e.key !== "Enter" || !t.dataset || !t.dataset.bx) return;
    e.preventDefault(); var all = $$(".bx-in", host), nx = all.slice(all.indexOf(t) + 1).filter(function(n){ return !n.value.trim(); })[0];
    if (nx) { nx.focus(); return; }
    check();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = ist(it);
    if (b.dataset.act === "check") { check(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "prev" || b.dataset.act === "next") { S.i += b.dataset.act === "prev" ? -1 : 1; api.save(); paint(); return; }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}
function parse1(raw){ var r = MV.parseNum(raw); return r && r.length === 1 ? r[0] : null; }
// Build the model: coefficient templates such as A(x) = ([ ] + [ ]x)/x
function formOf(it, v){ return it.form.replace(/%(\d)(?=[a-z])/g, function(m, i){ return coefM(v[+i]); }).replace(/%(\d)/g, function(m, i){ return fi(v[+i]); }); }
function buildAct(host, api, a){
  return boxSet(host, api, a, { noun:"Model", general:a.general,
    frame:function(it, box){
      var A = MV.ans(it), html = M(it.tpl).replace(/\[(\d)\]/g, function(m, i){ return box(i, "box " + (+i + 1) + " of " + A.length, "number"); });
      return '<p class="task">' + it.prompt + '</p><p class="bm-tpl">' + html + "</p>";
    },
    judge:function(it, raw){
      var A = MV.ans(it), v = [];
      for (var i = 0; i < A.length; i++) { var x = parse1(raw[i]); if (x == null) return { msg:a.empty }; v.push(x); }
      if (v.some(function(x){ return !Number.isInteger(x); })) return { msg:"<strong>✗</strong> " + a.whole };
      var exact = v.every(function(x, i){ return x === A[i]; });
      var ratio = it.ratio && v[2] !== 0 && v[0] * A[2] === A[0] * v[2] && v[1] * A[2] === A[1] * v[2];
      if (exact || ratio) return { ok:true, res:v };
      var fbs = [];
      (it.wrong || []).forEach(function(w){ if (w.match && w.match.every(function(x, i){ return v[i] === x; })) fbs.push(w.fb); });
      (it.wrong || []).forEach(function(w){ if (w.box != null && v[w.box] === w.val) fbs.push(w.fb); });
      var bad = {};
      if (it.ratio && v[2] !== 0) { var k = v[2] / A[2]; v.forEach(function(x, i){ if (Math.abs(x - A[i] * k) > 1e-9) bad[i] = 1; }); }
      else v.forEach(function(x, i){ if (x !== A[i]) bad[i] = 1; });
      return { bad:bad, fbs:fbs };
    },
    right:function(it, x){
      var A = MV.ans(it), v = x.res || A, same = v.every(function(q, i){ return q === A[i]; });
      return "<strong>✓ Correct: " + M(formOf(it, v)) + ".</strong>" + (same ? "" : " " + tpl(a.same, { m:M(formOf(it, A)) }));
    } });
}
// Answer the question: several labelled boxes, named wrong values per box, then a sense check
function answerAct(host, api, a){
  return boxSet(host, api, a, { noun:"Question", general:a.general,
    frame:function(it, box){
      return '<p class="task">' + it.prompt + '</p><div class="bx-row">' + it.boxes.map(function(b){ return '<label class="bx-lab">' + b.label + " " + box(b.id, MV.plain(b.label)) + "</label>"; }).join("") + "</div>";
    },
    judge:function(it, raw){
      var A = MV.ans(it), v = {}, bad = {}, fbs = [];
      for (var i = 0; i < it.boxes.length; i++) { var id = it.boxes[i].id, x = parse1(raw[id]); if (x == null) return { msg:a.empty }; v[id] = x; }
      it.boxes.forEach(function(b){ if (Math.abs(v[b.id] - A[b.id]) > 1e-9) bad[b.id] = 1; });
      if (!Object.keys(bad).length) return { ok:true };
      (it.wrong || []).forEach(function(w){ if (Math.abs(v[w.box] - w.val) <= (w.tol || 1e-9)) fbs.push(w.fb); });
      return { bad:bad, fbs:fbs };
    },
    right:function(){ return "<strong>✓ Correct.</strong>"; },
    after:function(it){ return "<p><strong>" + a.senseHead + "</strong> " + it.sense + "</p>"; } });
}

// ---------- Performance task: design a dilution ----------
var task = (function(){
  var api, plotG, plotT, TU, EU;
  var KEYS = ["V0", "C0", "cin", "r"], RG = { V0:[20, 200, 10, " L"], C0:[0, 60, 5, " g/L"], cin:[0, 60, 5, " g/L"], r:[1, 20, 1, " L/min"] };
  function read(){ var s = api ? api.S : {}; return { V0:s.V0, C0:s.C0, cin:s.cin, r:s.r }; }
  function st(d){ return { V0:d.V0, C0:d.C0, cin:d.cin, r:d.r, t:20, giant:false }; }
  function draw(){
    var d = read(), s = st(d), Tw = Math.max(30, ceilTo(1.2 * tFullOf(s), 10)), el = $("#tk23-plot");
    if (!el) return;
    concDraw(plotG, { xmin:-0.09 * Tw, xmax:Tw * 1.02, ymin:yLow(el, 62, 24), ymax:62 }, s, { U:EU, task:true, targetHA:TU.targetHA });
    var f = concF(s), vol = d.V0 + 20 * d.r;
    plotT.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false,
      describe:"Your tank at t = 20 minutes: " + fi(vol) + " litres at " + f(20).toFixed(2) + " grams per litre" + (vol > 300 ? ", overflowing the 300 litre tank." : ".") + " Incoming brine " + d.cin + " grams per litre at " + d.r + " litres per minute.",
      after:function(ctx, P){ drawTank(ctx, P, { cin:d.cin, C:f(20), vol:vol, giant:false, r:d.r, flow:false, U:EU }); } });
    $("#tk23-cap").innerHTML = M(concM(s));
  }
  return {
    render:function(inp, pv, a){
      api = a; TU = MV.C.task.ui; EU = MV.C.explore.ui;
      var D0 = { V0:100, C0:0, cin:30, r:10 }; KEYS.forEach(function(k){ if (typeof a.S[k] !== "number") a.S[k] = D0[k]; });
      inp.innerHTML = '<div class="tk23">' + KEYS.map(function(k){ var g = RG[k];
        return '<div class="tk23-row"><div class="slider-top"><label for="tk23-' + k + '">' + TU.sl[k] + '</label><output id="tk23-' + k + '-out">' + a.S[k] + g[3] + "</output></div>" +
          '<div class="tk23-ctl"><button type="button" class="btn ghost sm" data-tk="' + k + '" data-d="-1" data-k="tk' + k + 'm" aria-label="Decrease">' + MINUS + '</button><input type="range" id="tk23-' + k + '" data-tki="' + k + '" min="' + g[0] + '" max="' + g[1] + '" step="' + g[2] + '" value="' + a.S[k] + '"><button type="button" class="btn ghost sm" data-tk="' + k + '" data-d="1" data-k="tk' + k + 'p" aria-label="Increase">+</button></div></div>'; }).join("") + "</div>";
      pv.innerHTML = '<p class="eq-cap tk23-cap" id="tk23-cap" aria-live="polite"></p><div class="ex23-panels tk23-panels"><div class="ex23-tankbox"><canvas class="plot ex23-tank" id="tk23-tank" role="img" aria-label="Your tank"></canvas></div><div class="plot-wrap"><canvas class="plot" id="tk23-plot" role="img" aria-label="Graph of your design"></canvas></div></div>';
      plotG = new MV.Plot($("#tk23-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plotG.render = draw;
      plotT = new MV.Plot($("#tk23-tank"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plotT.render = draw;
      function set(k, v){ var g = RG[k]; v = clamp(Math.round(v / g[2]) * g[2], g[0], g[1]); a.S[k] = v; $("#tk23-" + k).value = v; $("#tk23-" + k + "-out").textContent = v + g[3]; a.save(); draw(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tki; if (k) set(k, +e.target.value); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-tk]"); if (!b) return; var k = b.dataset.tk; set(k, a.S[k] + (+b.dataset.d) * RG[k][2]); });
      $$("[data-tk]", inp).forEach(function(b){ var k = b.dataset.tk, lab = MV.plain(TU.sl[k]); b.setAttribute("aria-label", (b.dataset.d === "1" ? "Increase " : "Decrease ") + lab); });
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.C0 > d.cin, d.cin === 10, d.C0 * d.V0 + 20 * d.cin * d.r === 30 * (d.V0 + 20 * d.r), d.V0 + 20 * d.r <= 300]; },
    tips:function(d, c){
      var T = MV.C.task.tips, out = [], salt = d.C0 * d.V0 + 20 * d.cin * d.r, vol = d.V0 + 20 * d.r;
      c.forEach(function(ok, i){ if (!ok) out.push(tpl(T[i], { C20:M("C(20) = " + fi(salt) + " ÷ " + fi(vol)) + " " + valEq(salt / vol) + " g/L", vol:fi(vol) })); });
      return out;
    },
    key:function(d){ return KEYS.map(function(k){ return d[k]; }).join(","); },
    label:function(k){ var p = k.split(",").map(Number); return "(" + p[0] + " L, " + p[1] + " g/L, " + p[2] + " g/L, " + p[3] + " L/min)"; },
    text:function(k){ var p = k.split(",").map(Number); return "V₀ = " + p[0] + " L, C₀ = " + p[1] + " g/L, cᵢₙ = " + p[2] + " g/L, r = " + p[3] + " L/min"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ build:buildAct, answer:answerAct },
  task:task
});
})();
