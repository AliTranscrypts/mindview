// MCV4U 10 The Product Rule: hero (growing rectangle with an N13 step-through), Explore "Growing rectangle" (Rectangle, Graphs
// and Wrong rule modes; Build and Tune-k pairs), Part 3 "Expand or rule?" (race, radical, pattern hunt), V8 coefficient-box
// practice (Activities 1 and 2) and the "Flat at x = 1" performance task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol) + 1e-12; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function fUI(){ return css("--font-ui") || "sans-serif"; }
function fM(){ return css("--font-math") || "serif"; }
// exact to 6 decimals when the value terminates there; otherwise "≈" with 3 decimals (3 significant figures below 1)
function fm(v){
  if (!isFinite(v)) return "—";
  var r6 = Math.round(v * 1e6) / 1e6;
  if (Math.abs(r6 - v) < 1e-9 * Math.max(1, Math.abs(v))) return num(r6, 6);
  if (Math.abs(v) >= 1) return "≈ " + num(v, 3);
  var s = String(Number(Math.abs(v).toPrecision(3)));
  if (/e/.test(s)) s = Math.abs(v).toFixed(9).replace(/0+$/, "");
  return "≈ " + (v < 0 ? MINUS : "") + s;
}
function pct(v){ return (v >= 1 ? num(v, 1) : num(v, 2)) + "%"; }
function plusTerm(a, b){ return a + (String(b).charAt(0) === MINUS ? " + (" + b + ")" : " + " + b); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (o.id === val) + '">' + o.t + "</button>";
  }).join("") + "</span>";
}
// canvas text with italic math letters and upright digits/symbols (labels on the graph panels)
function mtext(ctx, s, x, y, o){
  o = o || {};
  var size = o.size || 14, runs = String(s).replace(/-/g, MINUS).match(/[A-Za-z]+|[^A-Za-z]+/g) || [];
  function fnt(r){ return /[A-Za-z]/.test(r) ? "italic 600 " + (size + 1) + "px " + fM() : "600 " + size + "px " + fUI(); }
  var wd = 0; runs.forEach(function(r){ ctx.font = fnt(r); wd += ctx.measureText(r).width; });
  var x0 = o.align === "right" ? x - wd : o.align === "center" ? x - wd / 2 : x;
  ctx.save(); ctx.textBaseline = "middle";
  if (o.bg !== false) { ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.9; ctx.fillRect(x0 - 3, y - size * 0.72, wd + 6, size * 1.44); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink"); ctx.textAlign = "left";
  runs.forEach(function(r){ ctx.font = fnt(r); ctx.fillText(r, x0, y); x0 += ctx.measureText(r).width; });
  ctx.restore();
}

// =====================================================================================================================
// @component rectGrowth — growing rectangle for the product rule (SVG, equal scale): the rectangle f × g with its edges f
// (--pen) and g (--f3), the top strip fΔg (teal at 20%), the side strip gΔf (blue at 20%) and the corner ΔfΔg (--hi); labels
// sit outside the shape (the corner label top right with a leader line); zoom:true keeps a window around the corner.
//   rectSVG({id, f0, g0, f1, g1, zoom, cornerAlpha, lab:{f, g, top:[lines], side:[lines], corner:[lines], tag}}) -> "<svg…>"
//   Label text is m()-like: letters italic, hyphen -> minus. Styles: .pr-svg … in app.css (tokens only).
function svgTx(s){
  var out = "", t = String(s);
  for (var i = 0; i < t.length; i++) {
    var c = t[i];
    if (/[A-Za-z]/.test(c)) out += '<tspan class="pr-it">' + c + "</tspan>";
    else if (c === "-") out += MINUS;
    else if (c === "&") out += "&amp;"; else if (c === "<") out += "&lt;"; else if (c === ">") out += "&gt;";
    else out += c;
  }
  return out;
}
function rectSVG(o){
  var VW = 420, VH = 300, L = 50, R = 330, T = 50, B = 262;
  var df = o.f1 - o.f0, dg = o.g1 - o.g0, d = Math.max(df, dg), grow = d > 1e-12, w;
  if (o.zoom && grow) w = { x0:o.f0 - 3 * d, x1:o.f1 + 0.7 * d, y0:o.g0 - 3 * d, y1:o.g1 + 0.7 * d };
  else w = { x0:0, x1:Math.max(o.f1, o.f0), y0:0, y1:Math.max(o.g1, o.g0) };
  var s = Math.min((R - L) / (w.x1 - w.x0), (B - T) / (w.y1 - w.y0));
  function X(x){ return L + (x - w.x0) * s; }
  function Y(y){ return B - (y - w.y0) * s; }
  function q(v){ return Math.round(v * 100) / 100; }
  function rect(x0, y0, x1, y1, cls, extra){
    var a = X(x0), b = X(x1), c = Y(y1), e = Y(y0);
    return '<rect class="' + cls + '" x="' + q(a) + '" y="' + q(c) + '" width="' + q(Math.max(b - a, 0)) + '" height="' + q(Math.max(e - c, 0)) + '"' + (extra || "") + "/>";
  }
  function tx(x, y, str, cls, anchor, rot){
    return '<text x="' + q(x) + '" y="' + q(y) + '" class="' + cls + '" text-anchor="' + (anchor || "middle") + '"' + (rot ? ' transform="rotate(-90 ' + q(x) + " " + q(y) + ')"' : "") + ">" + svgTx(str) + "</text>";
  }
  function lines(arr, x, y, cls, anchor){ return arr.map(function(str, i){ return tx(x, y + i * 18, str, cls, anchor); }).join(""); }
  var cid = "prc-" + o.id, cx1 = X(w.x1), cy1 = Y(w.y1);
  var h = '<svg class="pr-svg" viewBox="0 0 ' + VW + " " + VH + '" aria-hidden="true" focusable="false"><defs><clipPath id="' + cid + '"><rect x="' + (L - 3) + '" y="' + q(cy1 - 3) + '" width="' + q(cx1 - L + 6) + '" height="' + q(B - cy1 + 6) + '"/></clipPath></defs><g clip-path="url(#' + cid + ')">';
  h += rect(0, 0, o.f0, o.g0, "pr-b");
  if (grow) {
    h += rect(0, o.g0, o.f0, o.g1, "pr-st") + rect(o.f0, 0, o.f1, o.g0, "pr-ss");
    h += rect(o.f0, o.g0, o.f1, o.g1, "pr-cn", ' style="opacity:' + q(o.cornerAlpha == null ? 1 : o.cornerAlpha) + '"');
  }
  h += '<line class="pr-ef" x1="' + q(X(0)) + '" y1="' + q(Y(0)) + '" x2="' + q(X(o.f0)) + '" y2="' + q(Y(0)) + '"/>';
  h += '<line class="pr-eg" x1="' + q(X(0)) + '" y1="' + q(Y(0)) + '" x2="' + q(X(0)) + '" y2="' + q(Y(o.g0)) + '"/></g>';
  var lab = o.lab || {}, zoomed = o.zoom && grow;
  if (!zoomed) {
    if (lab.f) h += tx(clamp(X(o.f0 / 2), L + 44, R - 30), B + 24, lab.f, "pr-tf");
    if (lab.g) h += tx(L - 16, clamp(Y(o.g0 / 2), T + 40, B - 40), lab.g, "pr-tg", "middle", true);
  }
  if (grow && lab.top) h += lines(lab.top, clamp(X((Math.max(0, w.x0) + o.f0) / 2), L + 44, 246), Math.max(20, Y(o.g1) - 12 - 18 * (lab.top.length - 1)), "pr-tg");
  if (grow && lab.side) h += lines(lab.side, Math.min(X(o.f1) + 8, VW - 84), clamp(Y((Math.max(0, w.y0) + o.g0) / 2), T + 44, B - 24), "pr-tf", "start");
  if (grow && lab.corner) {
    var ccx = X((o.f0 + o.f1) / 2), ccy = Y((o.g0 + o.g1) / 2);
    h += '<line class="pr-ld" x1="' + (VW - 40) + '" y1="' + (12 + 18 * lab.corner.length) + '" x2="' + q(ccx) + '" y2="' + q(ccy) + '"/>' + lines(lab.corner, VW - 6, 18, "pr-tk", "end");
  }
  if (zoomed && lab.tag) h += '<text class="pr-tm" x="' + L + '" y="' + (B + 26) + '">' + MV.esc(lab.tag) + "</text>";
  return h + "</svg>";
}
// ------------------------------------------------- end of rectGrowth ----------------------------------------------------

// ---------- pairs (Explore) ----------
var DX = [0.5, 0.2, 0.1, 0.05, 0.01];
var GCH = {
  g1:{ g:function(x){ return x * x + 2 * x; }, d:function(x){ return 2 * x + 2; }, pl:"x² + 2x" },
  g2:{ g:function(x){ return x * x * x + 2 * x * x; }, d:function(x){ return 3 * x * x + 4 * x; }, pl:"x³ + 2x²" },
  g3:{ g:function(x){ return 3 * x + 4; }, d:function(){ return 3; }, pl:"3x + 4" },
  g4:{ g:function(x){ return x * x + 4 * x; }, d:function(x){ return 2 * x + 4; }, pl:"x² + 4x" }
};
function sq(x){ return x * x; }
function one(){ return 1; }
function idf(x){ return x; }
function pairOf(S){
  var id = S.pair, P;
  if (id === "P1") P = { f:function(x){ return x + 1; }, df:one, g:sq, dg:function(x){ return 2 * x; }, fp:"x + 1", gp:"x²" };
  else if (id === "P2") P = { f:function(x){ return 2 * x; }, df:function(){ return 2; }, g:function(x){ return x + 3; }, dg:one, fp:"2x", gp:"x + 3" };
  else if (id === "P3") P = { f:sq, df:function(x){ return 2 * x; }, g:Math.sqrt, dg:function(x){ return 1 / (2 * Math.sqrt(x)); }, fp:"x²", gp:"√x" };
  else if (id === "P4") P = { f:idf, df:one, g:idf, dg:one, fp:"x", gp:"x" };
  else if (id === "B") { var G = GCH[S.g]; if (!G) return { none:true, fp:"x", gp:"?" }; P = { f:idf, df:one, g:G.g, dg:G.d, fp:"x", gp:G.pl }; }
  else { var k = S.k; P = { f:sq, df:function(x){ return 2 * x; }, g:function(x){ return x - k; }, dg:one, fp:"x²", gp:k ? "x " + MINUS + " " + num(k, 1) : "x" }; }
  P.p = function(x){ return P.f(x) * P.g(x); };
  P.t1 = function(x){ return P.df(x) * P.g(x); };
  P.t2 = function(x){ return P.f(x) * P.dg(x); };
  P.dp = function(x){ return P.t1(x) + P.t2(x); };
  P.w = function(x){ return P.df(x) * P.dg(x); };
  return P;
}
var XV = { xmin:-0.3, xmax:4.5 }, DOM = [0.02, 4.5];
function yRange(fns, fixed){
  if (fixed) return fixed;
  var lo = 0, hi = 0;
  for (var i = 0; i <= 160; i++) { var x = DOM[0] + (DOM[1] - DOM[0]) * i / 160; fns.forEach(function(f){ var v = f(x); if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }); }
  var pad = (hi - lo) * 0.1 || 1;
  return { ymin:lo - pad * (lo < 0 ? 1 : 0.6), ymax:hi + pad };
}
function target(x){ return 3 * x * x + 4 * x; }

// ---------- hero: the rectangle grows, the nudge shrinks, the equation assembles ----------
function hero(f){
  var box = $("#pr-hero-svg"), ctl = $("#pr-hero-ctl"); if (!box || !ctl) return;
  var STEPS = MV.C.hero.steps || [], DXS = [0, 0.5, 0.3, 0.15, 0.05, 0.05];
  function F(x){ return 2 + x; }
  function G(x){ return 1.5 + x * x / 2; }
  var cur = 0, idx = 0, stop = null;
  function draw(){
    var fin = idx === 5, dx = cur, a = dx <= 0 ? 0 : Math.min(1, Math.pow(dx / 0.5, 1.6));
    box.innerHTML = rectSVG({ id:"hero", f0:3, g0:2, f1:F(1 + dx), g1:G(1 + dx), cornerAlpha:a,
      lab:{ f:"f(x)", g:"g(x)", top:fin ? ["fΔg ÷ Δx", "→ fg′"] : ["fΔg"], side:fin ? ["gΔf ÷ Δx", "→ f′g"] : ["gΔf"], corner:fin ? ["ΔfΔg ÷ Δx", "→ 0"] : ["ΔfΔg"] } });
    box.setAttribute("aria-label", MV.plain(STEPS[idx] || ""));
    if (f.cap) f.cap.innerHTML = STEPS[idx] || "";
  }
  var player = MV.player(ctl, { count:6, interval:2100, label:function(i){ return "Step " + (i + 1) + " of 6"; },
    render:function(i){
      idx = i; var from = cur, to = DXS[i];
      if (stop) { stop(); stop = null; }
      stop = MV.tween({ dur:950, step:function(t){ cur = from + (to - from) * t; draw(); }, done:function(){ stop = null; cur = to; draw(); } });
    } });
  if (MV.reduceMotion) player.go(5);
  else MV.wait(1400, function(){ var b = ctl.querySelector('[data-pl="play"]'); if (b && player.get() === 0) b.click(); });
}

// ---------- Explore: growing rectangle ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  var PIDS = C.pairs.map(function(p){ return p.id; });
  if (PIDS.indexOf(S.pair) < 0) S.pair = "P4";
  if (["rect", "graphs", "wrong"].indexOf(S.mode) < 0) S.mode = "rect";
  if (typeof S.x !== "number") S.x = 3;
  if (typeof S.di !== "number") S.di = 0;
  if (typeof S.k !== "number") S.k = 0;
  S.zoom = !!S.zoom;
  var busy = false, xLive = null, dxLive = null, stop = null;
  host.innerHTML = '<div class="pr-ex"><div class="pr-main" data-mv="graph"><p class="eq-cap pr-eq" id="pr-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="pr-svgbox" id="pr-rect" role="img" aria-label="Growing rectangle"></div>' +
    '<div class="pr-graphs" id="pr-graphs" hidden><canvas class="plot pr-top" id="pr-top" role="img" aria-label="The product with its tangent"></canvas><canvas class="plot pr-low" id="pr-low" role="img" aria-label="The product’s derivative with the stacked bar"></canvas></div>' +
    '<p class="tiny muted pr-key" id="pr-key"></p></div>' +
    '<div class="pr-side"><p class="tiny pr-lab">Pair</p><div class="chips pr-pairs" id="pr-pairs" role="group" aria-label="Choose f and g"></div><div id="pr-gch"></div><div id="pr-ksl"></div>' +
    '<label class="slider pr-sl"><span class="slider-top"><span>' + m("x") + '</span><output id="pr-xout"></output></span><input type="range" id="pr-x" min="0.5" max="4" step="0.1" style="accent-color:var(--ink)" aria-label="x"></label>' +
    '<label class="slider pr-sl"><span class="slider-top"><span>Nudge ' + m("Δx") + '</span><output id="pr-dxout"></output></span><input type="range" id="pr-dx" min="0" max="4" step="1" style="accent-color:var(--ink)" aria-label="Nudge Δx: 0.5, 0.2, 0.1, 0.05 or 0.01"></label>' +
    '<div id="pr-mode"></div><p class="tiny muted pr-how" id="pr-how"></p>' +
    '<div class="q-actions pr-zrow" id="pr-zrow"><button type="button" class="chip" id="pr-zoom" data-k="przoom" aria-pressed="false">Zoom on the corner</button></div>' +
    '<dl class="read pr-read" id="pr-read" aria-live="polite"></dl></div></div>';
  var top = new MV.Plot($("#pr-top", host), { xmin:XV.xmin, xmax:XV.xmax, ymin:-1, ymax:10 });
  var low = new MV.Plot($("#pr-low", host), { xmin:XV.xmin, xmax:XV.xmax, ymin:-1, ymax:10 });
  top.render = drawGraphs; low.render = drawGraphs;
  function cx(){ return xLive != null ? xLive : S.x; }
  function cdx(){ return dxLive != null ? dxLive : DX[S.di]; }
  function pc(){ return C.pairs.filter(function(p){ return p.id === S.pair; })[0]; }
  function views(P){
    var key = S.pair === "B" ? "B" + S.g : S.pair;
    if (views.k === key && views.v) return views.v;
    var v = S.pair === "K" ? { top:{ ymin:-36, ymax:80 }, low:{ ymin:-20, ymax:60 } }
      : { top:yRange([P.p]), low:yRange([P.dp, P.t1, P.w].concat(S.pair === "B" ? [target] : [])) };
    views.k = key; views.v = v; return v;
  }
  function paintTop(){
    var P = pc();
    $("#pr-eq", host).innerHTML = S.pair === "K" ? m("f(x) = x^2") + ", " + m("g(x) = x " + (S.k ? "- " + num(S.k, 1) : "")) : S.pair === "B" && S.g ? m("f(x) = x") + ", " + m("g(x) = ") + C.gChips.filter(function(c){ return c.id === S.g; })[0].t : P.eq;
    MV.keepFocus($("#pr-pairs", host), function(){
      $("#pr-pairs", host).innerHTML = C.pairs.map(function(q){ return '<button type="button" class="chip' + (q.id === S.pair ? " on" : "") + '" data-pair="' + q.id + '" data-k="pair' + q.id + '" aria-pressed="' + (q.id === S.pair) + '">' + q.chip + "</button>"; }).join("");
    });
    MV.keepFocus($("#pr-gch", host), function(){
      $("#pr-gch", host).innerHTML = S.pair !== "B" ? "" : '<p class="tiny pr-lab">Choose ' + m("g(x)") + '</p><div class="chips" role="group" aria-label="Choose g of x">' + C.gChips.map(function(c){
        return '<button type="button" class="chip' + (c.id === S.g ? " on" : "") + '" data-g="' + c.id + '" data-k="g' + c.id + '" aria-pressed="' + (c.id === S.g) + '">' + c.t + "</button>";
      }).join("") + "</div>";
    });
    var ks = $("#pr-ksl", host);
    if (S.pair === "K") {
      if (!$("#pr-k", ks)) ks.innerHTML = '<label class="slider pr-sl"><span class="slider-top"><span>' + m("k") + '</span><output id="pr-kout"></output></span><input type="range" id="pr-k" min="0" max="6" step="0.5" style="accent-color:var(--ink)" aria-label="k"></label>';
    } else ks.innerHTML = "";
    MV.keepFocus($("#pr-mode", host), function(){ $("#pr-mode", host).innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode") + "</div>"; });
    $("#pr-how", host).innerHTML = C.modeHow[S.mode];
    $("#pr-zrow", host).hidden = S.mode !== "rect";
    var z = $("#pr-zoom", host); z.setAttribute("aria-pressed", String(S.zoom)); z.classList.toggle("on", S.zoom);
    $("#pr-rect", host).hidden = S.mode !== "rect";
    $("#pr-graphs", host).hidden = S.mode === "rect";
    syncSliders();
  }
  function syncSliders(){
    var x = cx(), xs = $("#pr-x", host); xs.value = Math.round(x * 10) / 10; $("#pr-xout", host).textContent = num(x, 1);
    var ds = $("#pr-dx", host); ds.value = S.di; $("#pr-dxout", host).textContent = dxLive != null ? fm(dxLive) : num(DX[S.di], 2); ds.setAttribute("aria-valuetext", num(DX[S.di], 2));
    var ks = $("#pr-k", host); if (ks) { ks.value = S.k; $("#pr-kout", host).textContent = num(S.k, 1); }
  }
  function nums(P, x, dx){
    var f0 = P.f(x), g0 = P.g(x), f1 = P.f(x + dx), g1 = P.g(x + dx), Df = f1 - f0, Dg = g1 - g0;
    var o = { f0:f0, g0:g0, f1:f1, g1:g1, Df:Df, Dg:Dg, top:f0 * Dg, side:g0 * Df, cn:Df * Dg, t1:P.t1(x), t2:P.t2(x), w:P.w(x) };
    o.dA = o.top + o.side + o.cn; o.dp = o.t1 + o.t2; return o;
  }
  function paintRead(P, N){
    var el = $("#pr-read", host);
    if (P.none) { el.innerHTML = MV.readoutHTML([["Build", "Pick " + m("g(x)") + " from the chips."]]); return; }
    var rows = [
      [m("f(x)") + ", " + m("g(x)"), fm(N.f0) + ", " + fm(N.g0)],
      [m("Δf") + ", " + m("Δg"), fm(N.Df) + ", " + fm(N.Dg)],
      ["Top strip " + m("fΔg"), fm(N.top)],
      ["Side strip " + m("gΔf"), fm(N.side)],
      ["Corner " + m("ΔfΔg"), fm(N.cn) + (N.f0 > 0 && N.g0 > 0 && N.Df > 0 && N.Dg > 0 ? " (" + pct(100 * N.cn / N.dA) + " of the new area)" : "")],
      [m("ΔA ÷ Δx"), fm(N.dA / cdx())],
      [m("f′g + fg′") + " at " + m("x"), plusTerm(fm(N.t1), fm(N.t2)) + " = " + fm(N.dp)]
    ];
    if (S.mode === "wrong") rows.push([m("f′g′") + " (wrong rule)", fm(N.w) + ", off by " + fm(Math.abs(N.dp - N.w))]);
    el.innerHTML = MV.readoutHTML(rows);
  }
  function rectAria(N){
    return "Rectangle f(x) = " + fm(N.f0) + " by g(x) = " + fm(N.g0) + " grows by Δf = " + fm(N.Df) + " and Δg = " + fm(N.Dg) + ": top strip " + fm(N.top) + ", side strip " + fm(N.side) + ", corner " + fm(N.cn) + (S.zoom ? ". Zoomed in on the corner." : ".");
  }
  function paintRect(P, N){
    var box = $("#pr-rect", host);
    if (P.none) { box.innerHTML = '<p class="pr-msg">Pick ' + m("g(x)") + " from the chips to build the rectangle.</p>"; box.setAttribute("aria-label", "No g chosen yet."); return; }
    if (!(N.f0 > 0 && N.g0 > 0 && N.Df > 0 && N.Dg > 0)) {
      box.innerHTML = '<p class="pr-msg">A rectangle needs positive sides, but here ' + m("g(x)") + " = " + fm(N.g0) + ". Move " + m("x") + " past " + m("k") + ", or use Graphs mode.</p>";
      box.setAttribute("aria-label", "No rectangle: g(x) is not positive here."); return;
    }
    box.innerHTML = rectSVG({ id:"ex", f0:N.f0, g0:N.g0, f1:N.f1, g1:N.g1, zoom:S.zoom,
      lab:{ f:"f(x) = " + fm(N.f0), g:"g(x) = " + fm(N.g0), top:["fΔg", "= " + fm(N.top)], side:["gΔf", "= " + fm(N.side)], corner:["ΔfΔg", "= " + fm(N.cn)], tag:"Zoomed in on the corner" } });
    box.setAttribute("aria-label", rectAria(N));
  }
  function drawGraphs(){
    if (S.mode === "rect") return;
    var P = pairOf(S), ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3");
    if (P.none) {
      var V0 = { xmin:XV.xmin, xmax:XV.xmax, ymin:-5, ymax:60 };
      top.draw({ view:V0, describe:"Pick g of x from the chips to draw the product." });
      low.draw({ view:V0, curves:[{ f:target, color:ink2, width:2, dash:[2, 5], domain:DOM }], describe:"Target 3x² + 4x shown dotted. Pick g of x from the chips.",
        after:function(ctx, pl){ mtext(ctx, "target 3x^2 + 4x", pl.X(3.4), pl.Y(target(3.4)), { align:"right", color:ink2, size:13 }); } });
      return;
    }
    var V = views(P), x = cx(), N = nums(P, x, cdx()), px = P.p(x);
    var tv = { xmin:XV.xmin, xmax:XV.xmax, ymin:V.top.ymin, ymax:V.top.ymax }, lv = { xmin:XV.xmin, xmax:XV.xmax, ymin:V.low.ymin, ymax:V.low.ymax };
    top.draw({ view:tv, xLabel:"x", curves:[{ f:P.p, color:ink, width:3.4, domain:DOM }],
      lines:[{ p:[x, px], q:[x + 1, px + N.dp], color:ink, width:2 }], points:[{ x:x, y:px, r:5.5, color:ink }],
      describe:"Top panel: the product p = (" + P.fp + ")(" + P.gp + ") with its tangent at x = " + num(x, 1) + ", height " + fm(px) + ", slope " + fm(N.dp) + ".",
      after:function(ctx, pl){
        var X = pl.X(x), Y = pl.Y(px), right = X < pl.W * 0.62;
        mtext(ctx, "p = fg", pl.X(0) + 10, 14, { color:ink, size:13 });
        mtext(ctx, "slope = " + fm(N.dp), X + (right ? 14 : -14), clamp(Y - 22, 14, pl.H - 14), { align:right ? "left" : "right" });
      } });
    var curves = [];
    if (S.pair === "B") curves.push({ f:target, color:ink2, width:2, dash:[2, 5], domain:DOM });
    if (S.mode === "wrong") curves.push({ f:P.w, color:ink2, width:2.4, dash:[6, 6], domain:DOM });
    curves.push({ f:P.dp, color:ink, width:2.6, dash:[13, 7], domain:DOM });
    low.draw({ view:lv, xLabel:"x", curves:curves, points:[{ x:x, y:N.dp, r:5, color:ink }],
      describe:"Bottom panel: p′ in long dashes" + (S.mode === "wrong" ? ", the wrong rule f′g′ in short dashes (" + fm(N.w) + " at x = " + num(x, 1) + ")" : "") + (S.pair === "B" ? ", the target 3x² + 4x dotted" : "") +
        ". The bar at x = " + num(x, 1) + " stacks f′g = " + fm(N.t1) + " (blue) and fg′ = " + fm(N.t2) + " (teal) to reach p′ = " + fm(N.dp) + ".",
      after:function(ctx, pl){
        var X = pl.X(x), bw = 14, y0 = pl.Y(0), y1 = pl.Y(N.t1), y2 = pl.Y(N.dp);
        ctx.save();
        ctx.globalAlpha = 0.9; ctx.fillStyle = pen; ctx.fillRect(X - bw / 2, Math.min(y0, y1), bw, Math.abs(y1 - y0));
        ctx.fillStyle = f3; ctx.fillRect(X - bw / 2, Math.min(y1, y2), bw, Math.abs(y2 - y1));
        ctx.globalAlpha = 1; ctx.strokeStyle = ink; ctx.lineWidth = 1.2;
        ctx.strokeRect(X - bw / 2, Math.min(y0, y1), bw, Math.abs(y1 - y0)); ctx.strokeRect(X - bw / 2, Math.min(y1, y2), bw, Math.abs(y2 - y1));
        ctx.restore();
        var side = X > pl.W * 0.78 ? -1 : 1, lx = X + side * (bw / 2 + 8), al = side > 0 ? "left" : "right";
        var ya = (y0 + y1) / 2, yb = (y1 + y2) / 2;
        if (Math.abs(ya - yb) < 20) { var mid = (ya + yb) / 2, up = y2 < y0 ? -1 : 1; yb = mid + up * 10; ya = mid - up * 10; }
        mtext(ctx, "f′g = " + fm(N.t1), lx, clamp(ya, 12, pl.H - 12), { align:al, color:pen, size:13 });
        mtext(ctx, "fg′ = " + fm(N.t2), lx, clamp(yb, 12, pl.H - 12), { align:al, color:f3, size:13 });
        var xe = 4.3;
        mtext(ctx, "p′", pl.X(xe), clamp(pl.Y(P.dp(xe)) - 14, 12, pl.H - 12), { align:"right", color:ink, size:14 });
        if (S.mode === "wrong") mtext(ctx, "f′g′", pl.X(xe), clamp(pl.Y(P.w(xe)) + 16, 12, pl.H - 12), { align:"right", color:ink2, size:14 });
        if (S.pair === "B") mtext(ctx, "target", pl.X(3.3), clamp(pl.Y(target(3.3)) + 16, 12, pl.H - 12), { align:"right", color:ink2, size:13 });
      } });
  }
  function paintKey(){
    $("#pr-key", host).innerHTML = S.mode === "rect" ? "Blue strip " + m("gΔf") + ": from " + m("f") + " growing. Teal strip " + m("fΔg") + ": from " + m("g") + " growing. Yellow corner: " + m("ΔfΔg") + "."
      : "Top: " + m("p = fg") + " (solid) and its tangent. Bottom: " + m("p′") + " (long dashes) and the bar " + m("f′g") + " (blue) + " + m("fg′") + " (teal)" + (S.mode === "wrong" ? "; " + m("f′g′") + " (short dashes)" : "") + (S.pair === "B" ? "; the target " + m("3x^2 + 4x") + " (dotted)" : "") + ".";
  }
  function paintView(){
    var P = pairOf(S), N = P.none ? null : nums(P, cx(), cdx());
    syncSliders();
    if (S.mode === "rect") paintRect(P, N); else drawGraphs();
    paintRead(P, N); paintKey();
  }
  function paintAll(){ paintTop(); paintView(); }
  function changed(){ api.save(); paintView(); MV.changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (busy) return;
    if (b.dataset.pair) { S.pair = b.dataset.pair; if (S.pair === "K" && !S.kSeen) { S.kSeen = true; S.x = 2; } views.k = null; api.save(); paintAll(); MV.changed(); return; }
    if (b.dataset.g) { S.g = b.dataset.g; views.k = null; api.save(); paintAll(); MV.changed(); return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; api.save(); paintAll(); MV.changed(); return; }
    if (b.id === "pr-zoom") { S.zoom = !S.zoom; api.save(); paintTop(); paintView(); return; }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (busy) { syncSliders(); return; }
    if (t.id === "pr-x") { S.x = Math.round(+t.value * 10) / 10; changed(); }
    else if (t.id === "pr-dx") { S.di = clamp(Math.round(+t.value), 0, 4); changed(); }
    else if (t.id === "pr-k") { S.k = Math.round(+t.value * 2) / 2; views.k = null; api.save(); paintTop(); paintView(); MV.changed(); }
  });
  paintAll();

  // ---- predictions ----
  function anim(dur, step, cb){ stop = MV.tween({ dur:dur, step:step, done:function(){ stop = null; if (cb) cb(); } }); }
  function sweepX(a, b, dur, cb){ anim(dur, function(t){ xLive = a + (b - a) * t; paintView(); }, function(){ xLive = null; S.x = b; paintView(); if (cb) cb(); }); }
  // ---- challenges ----
  function chal(id){
    var M = MS[id];
    if (id === "tc1") {
      if (S.pair !== "P1") return { ok:false, msg:M.pair };
      if (near(S.x, 2, 0.05)) return { ok:true };
      if (near(S.x, 2.2, 0.05)) return { ok:false, msg:M.area };
      if (near(S.x, 3, 0.05)) return { ok:false, msg:M.x3 };
      return { ok:false, msg:tpl(M.other, { m:fm(pairOf(S).dp(S.x)) }) };
    }
    if (id === "tc2") {
      if (S.pair !== "B") return { ok:false, msg:M.pair };
      if (!GCH[S.g]) return { ok:false, msg:M.nog };
      if (S.g === "g1") return { ok:true };
      return { ok:false, msg:M[S.g] };
    }
    if (id === "tc3") {
      if (S.pair !== "K") return { ok:false, msg:M.pair };
      if (near(S.k, 3)) return { ok:true };
      if (near(S.k, 2)) return { ok:false, msg:M.k2 };
      if (near(S.k, 0)) return { ok:false, msg:M.k0 };
      return { ok:false, msg:tpl(M.other, { v:fm(12 - 4 * S.k) }) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; xLive = null; dxLive = null;
        if (p.id === "p1") { S.pair = "P4"; S.x = 3; S.di = 0; S.mode = "rect"; S.zoom = false; }
        else if (p.id === "p2") { S.pair = "P1"; S.x = 1; S.mode = "graphs"; }
        else if (p.id === "p3") { S.pair = "P3"; S.x = 1; S.mode = "graphs"; }
        else if (p.id === "p4") { S.pair = "P2"; S.x = 0.5; S.mode = "wrong"; }
        views.k = null; paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; xLive = null; dxLive = null; api.save(); paintAll(); MV.changed(); done(); }
        if (p.id === "p1") {
          var seq = [1, 2, 3, 4], j = 0;
          (function next(){
            if (j >= seq.length) { MV.wait(500, fin); return; }
            var from = DX[S.di], to = DX[seq[j]];
            anim(850, function(t){ dxLive = from * Math.pow(to / from, t); paintView(); }, function(){ dxLive = null; S.di = seq[j]; j++; paintView(); MV.wait(700, next); });
          })();
        }
        else if (p.id === "p2") sweepX(1, 3, 1800, function(){ MV.wait(700, fin); });
        else if (p.id === "p3") sweepX(1, 4, 1800, function(){ MV.wait(700, fin); });
        else if (p.id === "p4") sweepX(0.5, 4, 2600, function(){ MV.wait(600, fin); });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// @component V8 coefBoxes — structured number entry (course plan V8, coefficient form; no free algebra). A frame in m() source
// with [] slots becomes typeset text with number boxes: "[]x^3 + []x^2", "y = []x + []", "([], []) and ([], [])",
// "[](3x - 1)^[]" (^[] is a box in the exponent), or {num, den} for a stacked fraction. Boxes take integers, fractions (3/2),
// decimals and √ (MV.parseNum). cbJudge(item, raw[]) compares in order, as a set (set:true), as unordered pairs (pairs:true) or
// up to a common factor (scale:true, equivalent fraction forms); blankZero:true reads empty boxes as 0; item.wrong:[{v, fb}]
// gives named feedback. cbAct(host, api, a) is the practice activity built on it (first-try scoring, three-level help).
function cbCount(fr){ if (fr && typeof fr === "object") return cbCount(fr.num) + cbCount(fr.den); return (String(fr).match(/\[\]/g) || []).length; }
function cbHTML(fr, vals, key, dis, ctr){
  ctr = ctr || { i:0, n:cbCount(fr) };
  if (fr && typeof fr === "object") return '<span class="cb-frac"><span class="cb-fn">' + cbHTML(fr.num, vals, key, dis, ctr) + '</span><span class="cb-fd">' + cbHTML(fr.den, vals, key, dis, ctr) + "</span></span>";
  var toks = String(fr).split(/(\^?\[\])/);
  return toks.map(function(t, j){
    if (t !== "[]" && t !== "^[]") return t ? m(t) : "";
    var i = ctr.i++, nx = toks[j + 1] ? MV.plain(m(toks[j + 1])).trim() : "";
    var lab = "Box " + (i + 1) + " of " + ctr.n + (t === "^[]" ? ", the exponent" : "") + (nx && nx !== "^[]" && nx !== "[]" ? ", before " + nx : "");
    var inp = '<input class="numin cb-in' + (t === "^[]" ? " cb-sup" : "") + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-bi="' + i + '" data-k="' + key + "b" + i + '" aria-label="' + MV.esc(lab) + '" value="' + MV.esc(vals[i] || "") + '"' + (dis ? " disabled" : "") + ">";
    return t === "^[]" ? "<sup>" + inp + "</sup>" : inp;
  }).join("");
}
function cbParse(item, raw, frame){
  var n = cbCount(frame || item.frame), vals = [], filled = 0;
  for (var i = 0; i < n; i++) {
    var s = String(raw[i] == null ? "" : raw[i]).trim();
    if (!s) { vals.push(null); continue; }
    var p = MV.parseNum(s); if (!p || p.length !== 1) return { err:"Type a number in each box, such as 3, −4 or 3/2." };
    vals.push(p[0]); filled++;
  }
  if (!filled) return { err:n > 1 ? "Fill in the boxes first." : "Type your answer first." };
  if (vals.some(function(v){ return v === null; })) { if (item.blankZero) vals = vals.map(function(v){ return v === null ? 0 : v; }); else return { err:"Fill in every box." }; }
  return { vals:vals };
}
function cbSame(mode, vals, tg){
  if (mode.pairs) {
    var A = []; for (var i = 0; i + 1 < vals.length; i += 2) A.push([vals[i], vals[i + 1]]);
    if (A.length !== tg.length) return false;
    var used = [];
    return tg.every(function(b){ for (var j = 0; j < A.length; j++) if (!used[j] && near(A[j][0], b[0]) && near(A[j][1], b[1])) { used[j] = 1; return true; } return false; });
  }
  if (mode.set) return MV.sameNums(vals, tg, 1e-9);
  if (vals.length !== tg.length) return false;
  if (mode.scale) {
    var k = null; for (var q = 0; q < tg.length; q++) if (tg[q] !== 0) { k = vals[q] / tg[q]; break; }
    if (!k || !isFinite(k)) return false;
    return tg.every(function(t, j){ return near(vals[j], k * t, 1e-9 * Math.max(1, Math.abs(k * t))); });
  }
  return tg.every(function(t, j){ return near(vals[j], t); });
}
function cbJudge(item, raw, ans, wrong, frame){
  var r = cbParse(item, raw, frame); if (r.err) return r;
  if (cbSame(item, r.vals, ans)) return { ok:true };
  var w = (wrong || []).filter(function(x){ return cbSame({ pairs:item.pairs, set:item.set }, r.vals, x.v); })[0];
  return { ok:false, fb:w ? w.fb : null };
}
function cbAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:[], tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it, i){
    return '<div class="q cb-q" data-cq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="cb-row"></div><div class="cb-ctl"></div></div>';
  }).join("");
  function paintRow(it){
    var x = ist(it.id), el = $('[data-cq="' + it.id + '"] .cb-row', host);
    MV.keepFocus(el, function(){ el.innerHTML = '<div class="cb-frame">' + cbHTML(it.frame, x.v, a.id + it.id, x.solved) + "</div>"; });
  }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-cq="' + it.id + '"] .cb-ctl', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong>" + (it.why ? " " + it.why : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  a.items.forEach(function(it){ paintRow(it); paintCtl(it); });
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || t.dataset.bi == null) return; var box = t.closest("[data-cq]"); if (!box) return; ist(box.dataset.cq).v[+t.dataset.bi] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || e.target.dataset.bi == null) return; var box = e.target.closest("[data-cq]"), b = box && box.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-cq]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.cq; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = cbJudge(it, x.v, MV.ans(it), it.wrong);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintRow(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + (r.fb || it.general || "Check each factor’s derivative and both terms.") + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}
// ------------------------------------------------- end of V8 coefBoxes --------------------------------------------------

// ---------- Part 3: Expand or use the rule? ----------
function part3(host, api){
  var S = api.S, C = api.content, ST = C.stations, Q = MV.mcv.Q;
  var s1 = ST[0], s2 = ST[1], s3 = ST[2];
  S.s1 = S.s1 || {}; ["L", "R"].forEach(function(k){ S.s1[k] = S.s1[k] || { v:[], ok:false, tries:0 }; });
  S.s2 = S.s2 || { x:4, done:false };
  S.s3 = S.s3 || {}; s3.rows.forEach(function(r){ S.s3[r.id] = S.s3[r.id] || { v:[], ok:false, tries:0 }; });
  var msg1 = {}, msg3 = {};
  function col(k, c){
    return '<div class="pr-col" data-col="' + k + '"><h4>' + c.title + "</h4>" + c.lines.map(function(l){ return '<p class="pr-line">' + l + "</p>"; }).join("") +
      (c.ask ? '<p class="tiny pr-ask">' + c.ask + "</p>" : "") + '<div class="pr-fr" data-fr="' + k + '"></div><div class="pr-cfb" data-cfb="' + k + '"></div></div>';
  }
  host.innerHTML =
    '<div class="part p3-st" id="pr-s1"><h3>' + s1.title + "</h3><p>" + s1.text + '</p><div class="pr-cols">' + col("L", s1.left) + col("R", s1.right) + "</div>" +
      '<p class="banner pr-race" id="pr-s1b" aria-live="polite"></p><details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><div>' + s1.alg + "</div></div></details></div>" +
    '<div class="part p3-st" id="pr-s2"><h3>' + s2.title + "</h3><p>" + s2.text + '</p><div class="pr-cols">' + col("L2", s2.left) + col("R2", s2.right) + "</div>" +
      '<div class="pr-same" id="pr-same"></div><div id="pr-s2n" aria-live="polite"></div></div>' +
    '<div class="part p3-st" id="pr-s3"><h3>' + s3.title + "</h3><p>" + s3.text + '</p><div id="pr-s3rows"></div><div class="pr-pred" id="pr-s3p"></div></div>';

  // station 1: race
  function paintS1(k){
    var st = S.s1[k], fr = $('[data-fr="' + k + '"]', host), fb = $('[data-cfb="' + k + '"]', host);
    MV.keepFocus(fr, function(){
      fr.innerHTML = '<div class="cb-frame">' + m("f′(x) = ") + " " + cbHTML(s1.frame, st.v, "s1" + k, st.ok) + "</div>" +
        (st.ok ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-s1="' + k + '" data-k="s1chk' + k + '">Check</button></div>');
    });
    fb.innerHTML = st.ok ? MV.fbHTML("good", "<strong>✓ " + s1.display + "</strong>") : msg1[k] ? MV.fbHTML(msg1[k].bad ? "bad" : "", msg1[k].html) : "";
    $(".pr-col[data-col=\"" + k + "\"]", host).classList.toggle("ok", st.ok);
    var both = S.s1.L.ok && S.s1.R.ok, bn = $("#pr-s1b", host);
    bn.className = "banner pr-race" + (both ? " good" : ""); bn.textContent = both ? "✓ " + MV.plain(s1.banner) : "";
  }
  function checkS1(k){
    var st = S.s1[k], r = cbJudge({ blankZero:true }, st.v, MV.ans(s1), k === "L" ? s1.wrongL : s1.wrongR, s1.frame);
    if (r.err) msg1[k] = { bad:false, html:r.err };
    else if (r.ok) { st.ok = true; msg1[k] = null; }
    else { st.tries++; msg1[k] = { bad:true, html:"<strong>✗ Not quite.</strong> " + (r.fb || (k === "L" ? s1.generalL : s1.generalR)) + " Try again." }; }
    api.save(); paintS1(k); MV.focusFb($('[data-col="' + k + '"]', host));
  }

  // station 2: radical, compared at x = 1, 4 or 9 with exact fractions
  function qsrc(v){ return Q.src(v); }
  function paintS2(){
    var n = Math.round(Math.sqrt(S.s2.x));
    MV.keepFocus($("#pr-same", host), function(){
      $("#pr-same", host).innerHTML = '<span class="tiny" style="font-weight:700">Compare at</span><span class="chips" role="group" aria-label="Value of x">' + s2.xs.map(function(v){
        return '<button type="button" class="chip' + (v === S.s2.x ? " on" : "") + '" data-s2x="' + v + '" data-k="s2x' + v + '" aria-pressed="' + (v === S.s2.x) + '">' + m("x = " + v) + "</button>";
      }).join("") + '</span><button type="button" class="btn primary sm" data-s2="same" data-k="s2same">' + s2.same + "</button>";
    });
    var l = "", r = "";
    if (S.s2.done) {
      var a = Q.of(3 * n, 2), b = Q.of(1, 2 * n), c = Q.of(n * n + 1, 2 * n), d = Q.of(n, 1), sL = Q.add(a, b), sR = Q.add(c, d);
      l = MV.fbHTML("good", "At " + m("x = " + S.s2.x) + ": " + m(qsrc(a) + " + " + qsrc(b) + " = " + qsrc(sL)) + " ✓");
      r = MV.fbHTML("good", "At " + m("x = " + S.s2.x) + ": " + m(qsrc(c) + " + " + qsrc(d) + " = " + qsrc(sR)) + " ✓");
    }
    $('[data-cfb="L2"]', host).innerHTML = l; $('[data-cfb="R2"]', host).innerHTML = r;
    $$('.pr-col[data-col="L2"], .pr-col[data-col="R2"]', host).forEach(function(el){ el.classList.toggle("ok", !!S.s2.done); });
    $("#pr-s2n", host).innerHTML = S.s2.done ? '<p class="banner good pr-race">✓ Same value. ' + s2.note + "</p>" : "";
  }

  // station 3: pattern hunt
  function paintS3row(r){
    var st = S.s3[r.id], el = $('[data-s3r="' + r.id + '"]', host);
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="pr-line">' + r.expr + '</p><div class="cb-frame"><span class="cb-word">Derivative</span>' + m("=") + " " + cbHTML("[](3x - 1)^[]", st.v, "s3" + r.id, st.ok) + "</div>" +
        (st.ok ? MV.fbHTML("good", "<strong>✓ " + m(MV.ans(r)[0] + "(3x - 1)" + (MV.ans(r)[1] === 1 ? "" : "^" + MV.ans(r)[1])) + "</strong>") :
          '<div class="q-actions"><button type="button" class="btn primary sm" data-s3="' + r.id + '" data-k="s3chk' + r.id + '">Check</button></div>' + (msg3[r.id] ? MV.fbHTML(msg3[r.id].bad ? "bad" : "", msg3[r.id].html) : ""));
    });
  }
  function paintS3pred(){
    var el = $("#pr-s3p", host), pk = S.s3.pick, opts = s3.options;
    MV.keepFocus(el, function(){
      var good = pk != null && MV.ok(opts[pk]);
      el.innerHTML = '<p class="pr-line">' + s3.predict + '</p><div class="chips" role="group" aria-label="Predict the derivative">' + opts.map(function(o, i){
        return '<button type="button" class="chip' + (pk === i ? " on" : "") + '" data-s3p="' + i + '" data-k="s3p' + i + '" aria-pressed="' + (pk === i) + '"' + (good ? " disabled" : "") + ">" + o.t + "</button>";
      }).join("") + "</div>" + (pk == null ? "" : good ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s3.message) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (opts[pk].why || "") + " Try again."));
    });
  }
  $("#pr-s3rows", host).innerHTML = s3.rows.map(function(r){ return '<div class="pr-s3row" data-s3r="' + r.id + '"></div>'; }).join("");
  function checkS3(r){
    var st = S.s3[r.id], v = st.v.slice(); if (String(v[0] || "").trim() && !String(v[1] || "").trim()) v[1] = "1";
    var res = cbJudge({}, v, MV.ans(r), r.wrong, "[](3x - 1)^[]");
    if (res.err) msg3[r.id] = { bad:false, html:res.err };
    else if (res.ok) { st.ok = true; msg3[r.id] = null; }
    else { st.tries++; msg3[r.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + (res.fb || r.general) + " Try again." }; }
    api.save(); paintS3row(r); MV.focusFb($('[data-s3r="' + r.id + '"]', host));
  }

  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || t.dataset.bi == null) return;
    var c = t.closest("[data-fr]"), rr = t.closest("[data-s3r]");
    if (c) S.s1[c.dataset.fr].v[+t.dataset.bi] = t.value; else if (rr) S.s3[rr.dataset.s3r].v[+t.dataset.bi] = t.value;
    api.save();
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || e.target.dataset.bi == null) return;
    var wrap = e.target.closest("[data-fr]") || e.target.closest("[data-s3r]"), b = wrap && wrap.querySelector("button[data-s1], button[data-s3]");
    if (b) { e.preventDefault(); b.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.s1) { checkS1(b.dataset.s1); return; }
    if (b.dataset.s2x) { S.s2.x = +b.dataset.s2x; S.s2.done = false; api.save(); paintS2(); return; }
    if (b.dataset.s2 === "same") { S.s2.done = true; api.save(); paintS2(); MV.focusFb($("#pr-s2", host)); return; }
    if (b.dataset.s3) { checkS3(s3.rows.filter(function(r){ return r.id === b.dataset.s3; })[0]); return; }
    if (b.dataset.s3p != null) { S.s3.pick = +b.dataset.s3p; api.save(); paintS3pred(); MV.focusFb($("#pr-s3p", host)); }
  });
  paintS1("L"); paintS1("R"); paintS2(); s3.rows.forEach(paintS3row); paintS3pred();
  return {};
}

// ---------- performance task: Flat at x = 1 ----------
var task = (function(){
  var api, plot;
  function g(k){ var s = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"); if (s === "") return null; var v = Number(s); return Number.isInteger(v) && v >= -12 && v <= 12 ? v : NaN; }
  function read(){ var p = g("p"), q = g("q"); return { p:p, q:q, ok:Number.isInteger(p) && Number.isInteger(q) }; }
  function lin(p){ return p === 0 ? "x" : "x " + (p < 0 ? "- " : "+ ") + Math.abs(p); }
  function quad(q){ return q === 0 ? "x^2" : "x^2 " + (q < 0 ? "- " : "+ ") + Math.abs(q); }
  function sg(v){ return (v < 0 ? MINUS : "") + Math.abs(v); }
  function roots(d){
    var R = [{ v:-d.p, t:sg(-d.p) }];
    if (d.q < 0) { var s = Math.sqrt(-d.q), r = Math.round(s), ex = r * r === -d.q;
      [-1, 1].forEach(function(sn){ var v = sn * s; if (!R.some(function(z){ return near(z.v, v, 1e-9); })) R.push({ v:v, t:ex ? sg(sn * r) : (sn < 0 ? MINUS : "") + "√" + (-d.q) + " ≈ " + num(v, 2) }); }); }
    else if (d.q === 0 && d.p !== 0) R.push({ v:0, t:"0" });
    return R.sort(function(a, b){ return a.v - b.v; });
  }
  function draw(){
    var d = read(), ink = css("--ink"), pen = css("--pen");
    if (!d.ok) { plot.draw({ view:{ xmin:-6, xmax:6, ymin:-10, ymax:10 }, describe:"Enter whole numbers from −12 to 12 for p and q to draw the graph." }); return; }
    var Y = function(x){ return (x + d.p) * (x * x + d.q); }, dY = function(x){ return (x * x + d.q) + 2 * x * (x + d.p); };
    var R = roots(d), keys = [0, 1].concat(R.map(function(z){ return z.v; })), disc = 4 * d.p * d.p - 12 * d.q;
    if (disc >= 0) { keys.push((-2 * d.p + Math.sqrt(disc)) / 6, (-2 * d.p - Math.sqrt(disc)) / 6); }
    var x0 = Math.min.apply(null, keys) - 1.2, x1 = Math.max.apply(null, keys) + 1.2;
    if (x1 - x0 < 7) { var c = (x0 + x1) / 2; x0 = c - 3.5; x1 = c + 3.5; }
    var ys = keys.map(Y).concat([0]), lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys), pad = Math.max((hi - lo) * 0.25, 4);
    var V = { xmin:x0, xmax:x1, ymin:lo - pad, ymax:hi + pad }, y1 = Y(1), m1 = dY(1);
    plot.draw({ view:V, xLabel:"x", yLabel:"y", curves:[{ f:Y, color:pen, width:3 }],
      lines:[{ p:[1, y1], q:[2, y1 + m1], color:ink, width:2 }],
      points:[{ x:1, y:y1, r:5.5, color:ink }, { x:0, y:Y(0), r:4.5, color:pen }].concat(R.map(function(z){ return { x:z.v, y:0, r:4.5, color:pen }; })),
      describe:"y = (" + MV.plain(m(lin(d.p))) + ")(" + MV.plain(m(quad(d.q))) + "). Tangent at x = 1 has slope " + sg(m1) + ". x-intercepts: " + R.map(function(z){ return MV.plain(z.t); }).join(", ") + ". y-intercept " + sg(d.p * d.q) + ".",
      after:function(ctx, pl){ mtext(ctx, "slope at x = 1: " + sg(m1), pl.X(1) + 12, clamp(pl.Y(y1) - 22, 14, pl.H - 14), { size:13 }); } });
  }
  function readout(){
    var d = read(), el = $("#pr-tkread"); if (!el) return;
    $("#pr-tkeq").innerHTML = d.ok ? m("y = (" + lin(d.p) + ")(" + quad(d.q) + ")") : m("y = (x + p)(x^2 + q)");
    if (!d.ok) { el.innerHTML = MV.readoutHTML([["", "Choose whole numbers from −12 to 12 for " + m("p") + " and " + m("q") + "."]]); return; }
    var a = 1 + d.q, b = 2 * (1 + d.p);
    el.innerHTML = MV.readoutHTML([
      [m("y′ = (x^2 + q) + 2x(x + p)"), m("y′ = (" + quad(d.q) + ") + 2x(" + lin(d.p) + ")")],
      [m("y′(1)"), m("(1 + q) + 2(1 + p)") + " = " + sg(a) + (b < 0 ? " " + MINUS + " " + Math.abs(b) : " + " + b) + " = " + sg(a + b)],
      [m("x") + "-intercepts", roots(d).map(function(z){ return z.t; }).join(", ")],
      [m("y") + "-intercept, " + m("pq"), sg(d.p * d.q)]
    ]);
  }
  function upd(){ draw(); readout(); api.update(); }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.p == null) a.S.p = "0"; if (a.S.q == null) a.S.q = "0";
      inp.innerHTML = '<div class="pr-tk">' + ["p", "q"].map(function(k){
        return '<div class="pr-tkrow"><span class="pr-tklab">' + m(k) + '</span><button type="button" class="btn ghost sm" data-tk="' + k + '" data-d="-1" data-k="tk' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + '</button>' +
          '<input class="numin short" id="pr-tk' + k + '" data-tkin="' + k + '" type="number" min="-12" max="12" step="1" aria-label="' + k + ', a whole number from −12 to 12">' +
          '<button type="button" class="btn ghost sm" data-tk="' + k + '" data-d="1" data-k="tk' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
      }).join("") + "</div>";
      pv.innerHTML = '<p class="pr-tkeq" id="pr-tkeq"></p><div class="plot-wrap"><canvas class="plot" id="pr-tkplot" role="img" aria-label="Graph of your design"></canvas></div><dl class="read" id="pr-tkread" aria-live="polite"></dl>';
      ["p", "q"].forEach(function(k){ $("#pr-tk" + k).value = a.S[k]; });
      plot = new MV.Plot($("#pr-tkplot"), { xmin:-6, xmax:6, ymin:-10, ymax:10 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tkin; if (!k) return; a.S[k] = e.target.value; a.save(); upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button[data-tk]"); if (!b) return;
        var k = b.dataset.tk, v = Number(String(a.S[k]).replace(/−/g, "-")); if (!Number.isInteger(v)) v = 0;
        v = clamp(v + Number(b.dataset.d), -12, 12); a.S[k] = String(v); $("#pr-tk" + k).value = v; a.save(); upd();
      });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.ok ? true : "Choose whole numbers from −12 to 12 for " + m("p") + " and " + m("q") + "."; },
    checks:function(d){ if (!d.ok) return [false, false, false]; return [3 + 2 * d.p + d.q === 0, d.q < 0 && d.p * d.p !== -d.q, d.p * d.q < 0]; },
    key:function(d){ return d.p + "," + d.q; },
    label:function(k){ var s = k.split(","); return m("(p, q) = (" + s[0] + ", " + s[1] + ")"); },
    text:function(k){ var s = k.split(","); return "(p, q) = (" + sg(+s[0]) + ", " + sg(+s[1]) + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ pieces:cbAct, problems:cbAct },
  task:task
});
})();
