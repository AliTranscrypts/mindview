// SBI4U 44 Predation, Competition and Symbiosis: hero (hare–lynx curves with the lag bracket and the +/−/0 grid),
// Interaction simulator (S10 population model: predator–prey time series and cycle plot, two-species competition, and a
// symbiosis and defence card gallery), Ripple effects (food-web predictor with data panels), the interaction sorter
// (toolkit), model and ripple reasoning (custom), Spot the Error (toolkit), "Make room for two" (task).
(function(){
"use strict";
var $ = MV.$;

// ---------- small helpers ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "si-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function lin(t){ return t; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function d1(v){ return (Math.round(v * 10) / 10).toFixed(1); }
function whole(v){ return v > 1e6 ? "more than 1 000 000" : MV.num(Math.round(v), 0); }
function arrow(x1, y1, x2, y2, cls, w){
  var L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, s = 4 + w * 1.4, bx = x2 - ux * s, by = y2 - uy * s;
  return '<g class="' + cls + '">' + sv("line", { x1:x1, y1:y1, x2:bx, y2:by, "stroke-width":w }) +
    sv("path", { d:"M" + f1(x2) + " " + f1(y2) + " L" + f1(bx - uy * s * 0.7) + " " + f1(by + ux * s * 0.7) + " L" + f1(bx + uy * s * 0.7) + " " + f1(by - ux * s * 0.7) + " Z" }) + "</g>";
}
// nice axis maximum: 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8 × 10^k
function niceMax(v){
  v = Math.max(v, 1); var p = Math.pow(10, Math.floor(Math.log10(v))), m = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  for (var i = 0; i < m.length; i++) if (m[i] * p >= v - 1e-9) return m[i] * p;
  return 10 * p;
}
function tickStep(max){ var s = niceMax(max / 5); return s; }

// ---------- @component S10 populationModel — predator–prey (Lotka–Volterra, RK4, step 0.05 years) and two-species
// competition (logistic with overlap α, r = 0.5). ppRun(a, d, h0, l0) -> {t, H, L, pH, pL}; compRun(k1, k2, al) -> {t, A, B}.
// Balance and survival come from the formulas (plan build notes), so challenges and the task test exact conditions. ----------
var DT = 0.05, HUNT = 0.01, CONV = 0.1, R = 0.5, PP_YRS = 60, COMP_YRS = 100;
var cache = {};
function rk4(f, x, y){
  var k1 = f(x, y), k2 = f(x + DT / 2 * k1[0], y + DT / 2 * k1[1]), k3 = f(x + DT / 2 * k2[0], y + DT / 2 * k2[1]), k4 = f(x + DT * k3[0], y + DT * k3[1]);
  return [x + DT / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), y + DT / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])];
}
function peaksOf(t, y){
  var mx = -Infinity, mn = Infinity, r = [], i;
  for (i = 0; i < y.length; i++) { if (y[i] > mx) mx = y[i]; if (y[i] < mn) mn = y[i]; }
  if (!(mx - mn > 0.5) || mx > 1e9) return r;
  for (i = 1; i < y.length - 1; i++) if (y[i] > y[i - 1] && y[i] >= y[i + 1]) {
    var den = y[i - 1] - 2 * y[i] + y[i + 1], off = den ? 0.5 * (y[i - 1] - y[i + 1]) / den : 0;
    r.push({ t:t[i] + off * DT, v:y[i] });
  }
  return r;
}
function ppRun(a, d, h0, l0){
  var key = "pp" + [a, d, h0, l0].join("|"); if (cache[key]) return cache[key];
  var n = Math.round(PP_YRS / DT), t = [0], H = [h0], L = [l0], x = h0, y = l0;
  function f(h, l){ return [a * h - HUNT * h * l, CONV * HUNT * h * l - d * l]; }
  for (var i = 1; i <= n; i++) { var s = rk4(f, x, y); x = Math.max(0, s[0]); y = Math.max(0, s[1]); if (x > 1e12) x = 1e12; t.push(i * DT); H.push(x); L.push(y); }
  return (cache[key] = { t:t, H:H, L:L, pH:peaksOf(t, H), pL:peaksOf(t, L) });
}
function compRun(k1, k2, al){
  var key = "c" + [k1, k2, al].join("|"); if (cache[key]) return cache[key];
  var n = Math.round(COMP_YRS / DT), t = [0], A = [50], B = [50], x = 50, y = 50;
  function f(p, q){ return [R * p * (k1 - p - al * q) / k1, R * q * (k2 - q - al * p) / k2]; }
  for (var i = 1; i <= n; i++) { var s = rk4(f, x, y); x = Math.max(0, s[0]); y = Math.max(0, s[1]); t.push(i * DT); A.push(x); B.push(y); }
  return (cache[key] = { t:t, A:A, B:B });
}
function idx(yr){ return Math.round(yr / DT); }
function balancePP(a, d){ return { h:Math.round(d * 10) * 100, l:Math.round(a * 10) * 10 }; } // d ÷ 0.001, a ÷ 0.01 (exact)
// competition outcome from the formulas (integers: A = 10α)
function compOutcome(k1, k2, al){
  var A = Math.round(al * 10), s1 = 10 * k1 - A * k2, s2 = 10 * k2 - A * k1, o = { s1:s1 > 0, s2:s2 > 0 };
  if (o.s1 && o.s2) { o.n1 = 10 * s1 / (100 - A * A); o.n2 = 10 * s2 / (100 - A * A); o.both = true; }
  else if (o.s1) { o.n1 = k1; o.n2 = 0; o.lose = 2; }
  else if (o.s2) { o.n1 = 0; o.n2 = k2; o.lose = 1; }
  else { var run = compRun(k1, k2, al), e = run.A.length - 1, a = run.A[e], b = run.B[e]; o.unstable = true; o.tie = Math.abs(a - b) < 1; o.lose = a > b ? 2 : 1; o.n1 = o.tie ? a : a > b ? k1 : 0; o.n2 = o.tie ? b : a > b ? 0 : k2; }
  return o;
}
function outcomeText(o){
  if (o.both) return "Both survive: species 1 → " + Math.round(o.n1) + ", species 2 → " + Math.round(o.n2);
  if (o.unstable && o.tie) return "Neither can win from this exactly even start; any small head start decides which species is excluded";
  if (o.unstable) return "Species " + o.lose + " is excluded: with this much overlap, whichever species gets ahead wins";
  return "Species " + o.lose + " is excluded (species " + (3 - o.lose) + " → " + (o.lose === 2 ? o.n1 : o.n2) + ")";
}

// ---------- graph scenes (MV.Plot) ----------
function ppScale(run, l0){
  if (!l0) return 2000;
  var m = 0; for (var i = 0; i < run.H.length; i++) m = Math.max(m, run.H[i], 10 * run.L[i]);
  return niceMax(m * 1.08);
}
function latestPair(run, yr){
  var pH = run.pH.filter(function(p){ return p.t <= yr + 1e-9; }), pL = run.pL.filter(function(p){ return p.t <= yr + 1e-9; });
  var lastH = pH[pH.length - 1], lastL = pL[pL.length - 1], pair = null;
  for (var j = pL.length - 1; j >= 0 && !pair; j--) {
    var before = pH.filter(function(p){ return p.t < pL[j].t; }); if (before.length) pair = { h:before[before.length - 1], l:pL[j] };
  }
  return { lastH:lastH, lastL:lastL, pair:pair };
}
function tsScene(plot, s, yr){
  var css = MV.css, run = ppRun(s.a, s.d, s.h0, s.l0), Y = ppScale(run, s.l0), n = idx(yr), hp = [], lp = [], i, cap = Y * 3;
  for (i = 0; i <= n; i++) { hp.push([run.t[i], Math.min(run.H[i], cap)]); lp.push([run.t[i], Math.min(10 * run.L[i], cap)]); }
  var blue = css("--pen"), orange = css("--bio-atp"), ink = css("--ink"), st = tickStep(Y), lp2 = latestPair(run, yr), segs = [], pts = [], labs = [];
  if (lp2.pair) {
    var ph = lp2.pair.h, pl = lp2.pair.l, yb = Math.min(Y * 1.02, Math.max(ph.v, 10 * pl.v) + Y * 0.07);
    pts.push({ x:ph.t, y:ph.v, r:4.5, color:blue }, { x:pl.t, y:10 * pl.v, r:4.5, color:orange });
    segs.push({ x1:ph.t, y1:yb, x2:pl.t, y2:yb, color:ink, width:2 }, { x1:ph.t, y1:yb, x2:ph.t, y2:yb - Y * 0.035, color:ink, width:2 }, { x1:pl.t, y1:yb, x2:pl.t, y2:yb - Y * 0.035, color:ink, width:2 });
    labs.push({ x:pl.t, y:yb, text:"lag " + d1(pl.t - ph.t) + " years", color:ink, align:"left", dx:6, dy:-2, bg:true });
  }
  if (yr < PP_YRS) segs.push({ x1:yr, y1:0, x2:yr, y2:Y, color:css("--ink-2"), width:1.2, dash:[4, 4] });
  pts.push({ x:yr, y:Math.min(run.H[n], Y * 1.05), r:5, color:blue }, { x:yr, y:Math.min(10 * run.L[n], Y * 1.05), r:5, color:orange });
  plot.draw({ view:{ xmin:-9, xmax:69, ymin:-Y * 0.09, ymax:Y * 1.1 }, xTicks:{ step:10 }, yTicks:{ step:st },
    curves:[{ pts:hp, color:blue, width:3 }, { pts:lp, color:orange, width:3 }], segments:segs, points:pts, labels:labs, xLabel:"year", yLabel:"hares",
    after:function(ctx, p){
      ctx.save(); ctx.fillStyle = orange; ctx.font = "600 12px " + css("--font-ui"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
      for (var v = st; v <= Y + 1e-9; v += st) if (p.Y(v) > 10) ctx.fillText(MV.num(v / 10, 1), p.X(PP_YRS) + 6, p.Y(v));
      ctx.textBaseline = "top"; ctx.textAlign = "right"; ctx.fillText("lynx", p.W - 4, 4); ctx.restore();
    },
    describe:"Time series to year " + yr + ". Blue: hares (left scale). Orange: lynx (right scale, one tenth of the left). Now " + whole(run.H[n]) + " hares and " + whole(run.L[n]) + " lynx." +
      (lp2.pair ? " Latest hare peak at year " + d1(lp2.pair.h.t) + ", lynx peak at year " + d1(lp2.pair.l.t) + ": lag " + d1(lp2.pair.l.t - lp2.pair.h.t) + " years." : " No peaks yet.") });
}
function cyScene(plot, s, yr){
  var css = MV.css, run = ppRun(s.a, s.d, s.h0, s.l0), b = balancePP(s.a, s.d), n = idx(yr), pts = [], mh = 0, ml = 0, i;
  for (i = 0; i < run.H.length; i++) { mh = Math.max(mh, run.H[i]); ml = Math.max(ml, run.L[i]); }
  var X = s.l0 ? niceMax(Math.max(mh, b.h) * 1.1) : 2000, Y = niceMax(Math.max(ml, b.l, 10) * 1.12);
  for (i = 0; i <= n; i++) pts.push([Math.min(run.H[i], X * 3), Math.min(run.L[i], Y * 3)]);
  var ink = css("--ink"), path = css("--ink-2"), cw = X * 0.035, ch = Y * 0.05;
  plot.draw({ view:{ xmin:-X * 0.14, xmax:X * 1.06, ymin:-Y * 0.1, ymax:Y * 1.1 }, xTicks:{ step:tickStep(X) }, yTicks:{ step:tickStep(Y) },
    curves:[{ pts:pts, color:path, width:2.6 }],
    segments:[{ x1:b.h - cw, y1:b.l, x2:b.h + cw, y2:b.l, color:ink, width:3 }, { x1:b.h, y1:b.l - ch, x2:b.h, y2:b.l + ch, color:ink, width:3 }],
    points:[{ x:Math.min(run.H[n], X * 1.05), y:Math.min(run.L[n], Y * 1.05), r:6, color:ink, ring:true }],
    labels:[{ x:b.h, y:b.l, text:"balance (" + b.h + ", " + b.l + ")", color:ink, align:"left", dx:10, dy:-12, bg:true }],
    xLabel:"hares", yLabel:"lynx",
    after:function(ctx, p){ if (n > 8) { var k = Math.max(0, n - 6); if (Math.hypot(p.X(pts[n][0]) - p.X(pts[k][0]), p.Y(pts[n][1]) - p.Y(pts[k][1])) > 3) p.head(pts[k], pts[n], path, 12); } },
    describe:"Cycle plot to year " + yr + ": lynx against hares. The path starts at (" + s.h0 + ", " + s.l0 + ") and is now at (" + whole(run.H[n]) + ", " + whole(run.L[n]) + "). The balance point cross is at (" + b.h + ", " + b.l + ")." +
      (s.l0 && s.h0 ? " The path loops counterclockwise around the balance point." : "") });
}
function compScene(plot, k1, k2, al, yr, o){
  o = o || {};
  var css = MV.css, run = compRun(k1, k2, al), n = idx(yr), a = [], b = [], i;
  for (i = 0; i <= n; i++) { a.push([run.t[i], run.A[i]]); b.push([run.t[i], run.B[i]]); }
  var blue = css("--pen"), teal = css("--bio-nadh"), kc = css("--ink-2"), segs = [];
  segs.push({ x1:0, y1:k1, x2:COMP_YRS, y2:k1, color:kc, width:1.6, dash:[8, 6] }, { x1:0, y1:k2, x2:COMP_YRS, y2:k2, color:kc, width:1.6, dash:[8, 6] });
  if (yr < COMP_YRS) segs.push({ x1:yr, y1:0, x2:yr, y2:850, color:kc, width:1.2, dash:[4, 4] });
  var same = k1 === k2, labs = [{ x:COMP_YRS, y:k1, text:same ? "K₁ = K₂ = " + k1 : "K₁ = " + k1, color:kc, align:"right", dy:k1 >= k2 ? -10 : 12, bg:true }];
  if (!same) labs.push({ x:COMP_YRS, y:k2, text:"K₂ = " + k2, color:kc, align:"right", dy:k2 > k1 ? -10 : 12, bg:true });
  plot.draw({ view:{ xmin:-14, xmax:104, ymin:-70, ymax:900 }, xTicks:{ step:20 }, yTicks:{ step:200 },
    curves:[{ pts:a, color:blue, width:3 }, { pts:b, color:teal, width:3 }], segments:segs,
    points:[{ x:yr, y:run.A[n], r:5, color:blue }, { x:yr, y:run.B[n], r:5, color:teal }], labels:labs, xLabel:"year", yLabel:"population",
    describe:(o.pre || "") + "Competition to year " + yr + ", " + "K₁ = " + k1 + ", K₂ = " + k2 + ", overlap " + d1(al) + ". Blue: species 1, now " + Math.round(run.A[n]) + ". Teal: species 2, now " + Math.round(run.B[n]) + ". Dashed lines: the two carrying capacities." });
}
var LEG_PP = '<span><i class="sw" style="background:var(--pen)"></i>hares (prey), left scale</span><span><i class="sw" style="background:var(--bio-atp)"></i>lynx (predators), right scale</span>';
var LEG_CY = '<span><i class="sw" style="background:var(--ink-2)"></i>path of (hares, lynx) over time</span><span><b class="si-x" aria-hidden="true">+</b>balance point</span>';
var LEG_C = '<span><i class="sw" style="background:var(--pen)"></i>species 1</span><span><i class="sw" style="background:var(--bio-nadh)"></i>species 2</span><span><i class="sw si-dash"></i><em>K</em> lines (carrying capacities)</span>';

// ---------- @component interactionCard — the symbiosis and defence gallery: two partner boxes, the flow between them
// (moving dots), and the +/−/0 signs that pop in. stageSVG(card, k) with k = 0…1 (reduced motion: k = 1). viewBox 340 × 160 ----------
function wrap(s, n){ var w = s.split(" "), lines = [""]; w.forEach(function(x){ var l = lines[lines.length - 1]; if (l && (l + " " + x).length > n) lines.push(x); else lines[lines.length - 1] = l ? l + " " + x : x; }); return lines; }
function boxSVG(x, y, name, sign, k, role){
  var h = sv("rect", { x:x, y:y, width:112, height:52, rx:10, "class":"si-pbox" + (role ? " " + role : "") }), L = wrap(name, 15);
  L.forEach(function(l, i){ h += txt(x + 56, y + 26 + (i - (L.length - 1) / 2) * 15 + 4, l, "si-t si-tb", "middle"); });
  if (k > 0.75) {
    var a = clamp((k - 0.75) / 0.15, 0, 1), word = sign === "+" ? "gains" : sign === "−" ? "loses" : "unaffected";
    h += '<g opacity="' + d1(a) + '">' + txt(x + 56, y - 22, sign, "si-t si-sign", "middle") + txt(x + 56, y - 6, word, "si-t si-ts", "middle") + "</g>";
  }
  return h;
}
function dots(x1, y1, x2, y2, k, n){
  var h = "", u = clamp(k / 0.8, 0, 1);
  if (u <= 0 || u >= 1) return h;
  for (var i = 0; i < n; i++) { var q = (u * 2.2 - i * 0.3); if (q < 0 || q > 1) continue; h += sv("circle", { cx:lerp(x1, x2, q), cy:lerp(y1, y2, q), r:4, "class":"si-dot" }); }
  return h;
}
function stageSVG(c, k){
  var h = "", AX = 14, BX = 214, Y = 62, def = c.set === "def";
  var ax = AX, apr = 0;
  if (def) { // the predator lunges toward the prey, then turns back
    apr = k < 0.45 ? MV.ease(k / 0.45) : k < 0.6 ? 1 : 1 - MV.ease((k - 0.6) / 0.25);
    apr = clamp(apr, 0, 1); ax = AX + apr * 50;
  }
  if (c.kind === "ride" && k > 0) { var dx = Math.sin(k * Math.PI) * 6; BX += dx; }
  if (c.kind === "hide") h += sv("rect", { x:BX - 10, y:Y - 12, width:132, height:76, rx:14, "class":"si-snow" }) + txt(BX + 56, Y + 76, "snow", "si-t si-ts", "middle");
  h += boxSVG(ax, Y, c.a.n, c.a.s, k, "si-pa") + boxSVG(BX, Y, c.b.n, c.b.s, k, "si-pb");
  var mx = (ax + 112 + BX) / 2, ym = Y + 26;
  if (c.kind === "eat" || c.kind === "flow" || c.kind === "ride") {
    h += arrow(BX - 4, ym, ax + 116, ym, "si-arr", 2) + txt(mx, ym - 8, c.flow, "si-t si-ts", "middle") + dots(BX - 6, ym, ax + 118, ym, k, 3);
    if (c.kind === "eat" && k > 0.7) h += txt(BX + 56, Y + 68, "eaten", "si-t si-ts", "middle");
  } else if (c.kind === "trade") {
    h += arrow(BX - 4, ym - 10, ax + 116, ym - 10, "si-arr", 2) + txt(mx, ym - 18, c.flow, "si-t si-ts", "middle") + dots(BX - 6, ym - 10, ax + 118, ym - 10, k, 3);
    h += arrow(ax + 116, ym + 10, BX - 4, ym + 10, "si-arr", 2) + txt(mx, ym + 26, c.back, "si-t si-ts", "middle") + dots(ax + 118, ym + 10, BX - 6, ym + 10, k, 3);
  } else if (c.kind === "share") {
    var rx = 170, ry = 140;
    h += sv("ellipse", { cx:rx, cy:ry, rx:34, ry:12, "class":"si-res" }) + txt(rx, ry + 4, c.flow, "si-t si-ts", "middle");
    h += arrow(rx - 30, ry - 8, ax + 100, Y + 54, "si-arr", 2) + arrow(rx + 30, ry - 8, BX + 12, Y + 54, "si-arr", 2);
    h += dots(rx - 30, ry - 8, ax + 100, Y + 54, k, 2) + dots(rx + 30, ry - 8, BX + 12, Y + 54, k, 2);
  } else { // defences: an attack arrow that stops short, with the defence feature named
    var tip = ax + 116 + (BX - ax - 120) * clamp(apr * 1.2, 0, 1);
    if (apr > 0.05) h += arrow(ax + 116, ym, Math.max(ax + 124, tip - 10), ym, "si-arr si-att", 2);
    h += txt(BX + 56, Y + 70, c.flow, "si-t si-ts", "middle");
    if (k > 0.45) h += txt(mx, ym - 12, { hide:"can’t see it", toxic:"✗ tastes bad", bates:"looks like a wasp", mull:"✗ learned: avoid" }[c.kind], "si-t si-tb", "middle");
  }
  return h;
}
function cardBtn(c, on){
  return '<button type="button" class="si-card" data-card="' + c.id + '" data-k="card' + c.id + '" aria-pressed="' + on + '"><span class="si-cn">' + c.name + '</span><span class="si-cp">' + c.pair + "</span><span class=\"si-cw\">" + c.a.n + " · " + c.b.n + "</span></button>";
}

// ---------- Explore: Interaction simulator ----------
function explore(host, api){
  var C = api.content, S = api.S, CARDS = C.cards;
  var D = { mode:"pp", view:"ts", a:0.5, d:0.4, h0:400, l0:20, yp:60, k1:600, k2:400, al:0.5, yc:100, filt:"int", card:null };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  var anim = null, pend = null, cardAnim = null;
  host.innerHTML = '<div class="pg si-pg">' +
    '<div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="si-gwrap"><div class="plot-wrap"><canvas class="plot" id="si-plot" role="img" aria-label="Population graph"></canvas></div><p class="legend si-leg" id="si-leg"></p></div>' +
      '<div id="si-gal" class="si-gal"><div class="si-cards" id="si-cards"></div><div class="si-stage"><svg id="si-stage" viewBox="0 0 340 160" role="img" focusable="false"></svg></div><p class="si-cap" id="si-scap" aria-live="polite"></p></div></div>' +
    '<div class="pg-ctrl"><div id="si-mode"></div>' +
      '<div id="si-ppan" class="si-panel"><div id="si-view"></div><div id="si-ppsl"></div><p class="tiny muted">' + C.fixedNote + '</p><div id="si-ypsl"></div>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="si-ppplay" data-k="siplay1">Play from year 0</button></div>' +
        '<details class="alg"><summary>' + C.modelTitle + "</summary>" + C.modelPP + '<p class="tiny muted"><span class="bio-model">Model</span> ' + C.realNote + "</p></details></div>" +
      '<div id="si-cpan" class="si-panel"><div id="si-csl"></div><p class="tiny muted">Both species start at 50.</p><div id="si-ycsl"></div>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="si-cplay" data-k="siplay2">Play from year 0</button></div>' +
        '<details class="alg"><summary>' + C.modelTitle + "</summary>" + C.modelComp + "</details></div>" +
      '<div id="si-span" class="si-panel"><div id="si-filt"></div><p class="tiny muted">Tap a card to watch the interaction and see who gains (+), who loses (−) and who is unaffected (0).</p></div></div>' +
    '<div class="pg-read"><dl class="read" id="si-read" aria-live="polite"></dl></div></div>';
  var canvas = $("#si-plot"), plot = new MV.Plot(canvas, { xmin:0, xmax:60, ymin:0, ymax:1000 });
  plot.render = renderGraph;
  var fx1 = function(v){ return d1(v); };
  var modeSeg = MV.seg($("#si-mode"), { label:"Mode", options:[{ id:"pp", t:"Predator–prey" }, { id:"comp", t:"Competition" }, { id:"sym", t:"Symbiosis and defence" }], value:S.mode,
    onChange:function(v){ stop(); S.mode = v; api.save(); paint(); MV.changed(); } });
  var viewSeg = MV.seg($("#si-view"), { label:"View", options:[{ id:"ts", t:"Time series" }, { id:"cy", t:"Cycle plot" }], value:S.view,
    onChange:function(v){ S.view = v; api.save(); paint(); MV.changed(); } });
  var filtSeg = MV.seg($("#si-filt"), { label:"Show", options:[{ id:"int", t:"Interactions" }, { id:"def", t:"Defence mechanisms" }], value:S.filt,
    onChange:function(v){ S.filt = v; S.card = null; api.save(); paintCards(); paintRead(); } });
  var ppSl = MV.sliders($("#si-ppsl"), [
    { id:"si-a", label:"prey birth rate <em>a</em> (per year)", min:0.2, max:1, step:0.1, value:S.a, fmt:fx1 },
    { id:"si-d", label:"predator death rate <em>d</em> (per year)", min:0.1, max:0.8, step:0.1, value:S.d, fmt:fx1 },
    { id:"si-h0", label:"starting prey <em>H</em>₀ (hares)", min:50, max:800, step:50, value:S.h0 },
    { id:"si-l0", label:"starting predators <em>L</em>₀ (lynx)", min:0, max:150, step:10, value:S.l0 }],
    function(id, v){ stop(); S[{ "si-a":"a", "si-d":"d", "si-h0":"h0", "si-l0":"l0" }[id]] = v; api.save(); paint(); MV.changed(); });
  var ypSl = MV.sliders($("#si-ypsl"), [{ id:"si-yp", label:"Year shown", min:0, max:PP_YRS, step:1, value:S.yp }], function(id, v){ stop(); S.yp = v; api.save(); paint(); MV.changed(); });
  var cSl = MV.sliders($("#si-csl"), [
    { id:"si-k1", label:"<em>K</em>₁ (species 1)", min:100, max:800, step:100, value:S.k1 },
    { id:"si-k2", label:"<em>K</em>₂ (species 2)", min:100, max:800, step:100, value:S.k2 },
    { id:"si-al", label:"niche overlap <em>α</em> (both species)", min:0, max:1.2, step:0.1, value:S.al, fmt:fx1 }],
    function(id, v){ stop(); S[{ "si-k1":"k1", "si-k2":"k2", "si-al":"al" }[id]] = v; api.save(); paint(); MV.changed(); });
  var ycSl = MV.sliders($("#si-ycsl"), [{ id:"si-yc", label:"Year shown", min:0, max:COMP_YRS, step:1, value:S.yc }], function(id, v){ stop(); S.yc = v; api.save(); paint(); MV.changed(); });
  function syncSliders(){
    ppSl.set("si-a", S.a); ppSl.set("si-d", S.d); ppSl.set("si-h0", S.h0); ppSl.set("si-l0", S.l0); ypSl.set("si-yp", Math.round(S.yp));
    cSl.set("si-k1", S.k1); cSl.set("si-k2", S.k2); cSl.set("si-al", S.al); ycSl.set("si-yc", Math.round(S.yc));
    modeSeg.set(S.mode); viewSeg.set(S.view); filtSeg.set(S.filt);
  }
  function renderGraph(){
    if (S.mode === "pp") { if (S.view === "cy") cyScene(plot, S, S.yp); else tsScene(plot, S, S.yp); }
    else if (S.mode === "comp") compScene(plot, S.k1, S.k2, S.al, S.yc);
  }
  function paintRead(){
    var rows;
    if (S.mode === "pp") {
      var run = ppRun(S.a, S.d, S.h0, S.l0), n = idx(S.yp), b = balancePP(S.a, S.d), lp = latestPair(run, S.yp);
      rows = [["Year", String(Math.round(S.yp))], ["Prey (hares)", whole(run.H[n])], ["Predators (lynx)", whole(run.L[n])], ["Balance point", b.h + " hares, " + b.l + " lynx"],
        ["Latest peaks", "Prey: " + (lp.lastH ? "year " + d1(lp.lastH.t) : "none yet") + " · Predators: " + (lp.lastL ? "year " + d1(lp.lastL.t) : "none yet")],
        ["Lag", lp.pair ? d1(lp.pair.l.t - lp.pair.h.t) + " years" : "—"]];
    } else if (S.mode === "comp") {
      var cr = compRun(S.k1, S.k2, S.al), m = idx(S.yc);
      rows = [["Year", String(Math.round(S.yc))], ["Species 1", String(Math.round(cr.A[m]))], ["Species 2", String(Math.round(cr.B[m]))], ["Competition outcome", outcomeText(compOutcome(S.k1, S.k2, S.al))]];
    } else {
      var c = S.card && byId(CARDS, S.card);
      rows = c ? [["Card", c.name], ["Signs", c.a.n + " " + c.a.s + " · " + c.b.n + " " + c.b.s], ["Kind", c.set === "def" ? "defence mechanism, shaped by predation" : "interaction between species"]] : [["Card", "tap a card"]];
    }
    $("#si-read").innerHTML = MV.readoutHTML(rows);
  }
  function paintCards(){
    var list = CARDS.filter(function(c){ return c.set === S.filt; });
    MV.keepFocus($("#si-cards"), function(){ $("#si-cards").innerHTML = list.map(function(c){ return cardBtn(c, S.card === c.id); }).join(""); });
    drawStage(1);
  }
  function drawStage(k){
    var c = S.card && byId(CARDS, S.card), sv2 = $("#si-stage");
    if (!c) { sv2.innerHTML = txt(170, 84, "Tap a card above.", "si-t si-ts", "middle"); sv2.setAttribute("aria-label", "No card chosen yet."); $("#si-scap").textContent = ""; return; }
    sv2.innerHTML = stageSVG(c, k);
    sv2.setAttribute("aria-label", c.name + ": " + c.a.n + " " + c.a.s + ", " + c.b.n + " " + c.b.s + ". " + MV.plain(c.cap));
    $("#si-scap").innerHTML = "<strong>" + c.name + " (" + c.pair + ").</strong> " + c.cap;
  }
  $("#si-cards").addEventListener("click", function(e){
    var b = e.target.closest("[data-card]"); if (!b) return;
    S.card = b.dataset.card; api.save();
    if (cardAnim) { cardAnim(); cardAnim = null; }
    MV.keepFocus($("#si-cards"), function(){ $("#si-cards").innerHTML = CARDS.filter(function(c){ return c.set === S.filt; }).map(function(c){ return cardBtn(c, S.card === c.id); }).join(""); });
    paintRead();
    var c = byId(CARDS, S.card);
    $("#si-scap").innerHTML = "<strong>" + c.name + " (" + c.pair + ").</strong> " + c.cap;
    cardAnim = MV.tween({ dur:2600, ease:lin, step:function(k){ drawStage(k); }, done:function(){ cardAnim = null; drawStage(1); } });
  });
  function paint(){
    syncSliders();
    var g = S.mode !== "sym";
    $("#si-gwrap").hidden = !g; $("#si-gal").hidden = g;
    $("#si-ppan").hidden = S.mode !== "pp"; $("#si-cpan").hidden = S.mode !== "comp"; $("#si-span").hidden = S.mode !== "sym";
    $("#si-leg").innerHTML = S.mode === "comp" ? LEG_C : S.view === "cy" ? LEG_CY : LEG_PP;
    canvas.setAttribute("aria-label", S.mode === "comp" ? "Competition graph" : S.view === "cy" ? "Cycle plot of lynx against hares" : "Time series of hares and lynx");
    if (g) renderGraph(); else paintCards();
    paintRead();
  }
  function stop(){
    if (anim) { anim(); anim = null; }
    playBtns(false);
    if (pend) { var d = pend; pend = null; d(); }
  }
  function playBtns(busy){ $("#si-ppplay").disabled = busy; $("#si-cplay").disabled = busy; }
  function animateYear(key, to, dur, done){
    if (anim) { anim(); anim = null; }
    playBtns(true);
    anim = MV.tween({ dur:dur, ease:lin, step:function(k){ S[key] = Math.round(to * k * 20) / 20; renderGraph(); paintRead(); (key === "yp" ? ypSl : ycSl).set("si-" + key, Math.round(S[key])); },
      done:function(){ anim = null; S[key] = to; api.save(); playBtns(false); paint(); MV.changed(); if (done) done(); } });
  }
  $("#si-ppplay").addEventListener("click", function(){ stop(); animateYear("yp", PP_YRS, 4200); });
  $("#si-cplay").addEventListener("click", function(){ stop(); animateYear("yc", COMP_YRS, 3600); });
  paint();

  function chal(id){
    if (id === "tc2") {
      if (S.mode !== "comp") return { ok:false, msg:"Switch to Competition mode first." };
      if (S.k1 !== 600 || S.k2 !== 400) return { ok:false, msg:"Set <em>K</em>₁ = 600 and <em>K</em>₂ = 400 first." };
      var A = Math.round(S.al * 10), o = compOutcome(S.k1, S.k2, S.al);
      if (A === 0) return { ok:false, msg:"That’s no competition at all; the goal asks for some overlap." };
      if (o.both) return { ok:true };
      if (A >= 7) return { ok:false, msg:"Species 2 is excluded. Its habitat holds 400, but species 1’s crowding costs it more than that." };
      return { ok:false, msg:outcomeText(o) + "." };
    }
    if (S.mode !== "pp") return { ok:false, msg:"Switch to Predator–prey mode first." };
    var a10 = Math.round(S.a * 10), d10 = Math.round(S.d * 10), b = balancePP(S.a, S.d);
    if (id === "tc1") {
      if (a10 !== 5 || d10 !== 4) return { ok:false, msg:"Set <em>a</em> = 0.5 and <em>d</em> = 0.4 first." };
      if (S.h0 === 400 && S.l0 === 50) return { ok:true };
      if (S.h0 === 50) return { ok:false, msg:"Swapped: 400 is the hare balance; 50 is the lynx balance." };
      if (S.h0 === 400) return { ok:false, msg:"Hares are steady only when lynx eat exactly as many as are born: <em>L</em> = <em>a</em> ÷ 0.01." };
      return { ok:false, msg:"Both curves must stay flat. Start at the balance point shown in the readout." };
    }
    if (id === "tc3") {
      if (b.h === 800 && b.l === 50) return { ok:true };
      if (a10 === 10 && d10 === 4) return { ok:false, msg:"A faster hare birth rate raises the <strong>lynx</strong> balance, not the hares’. The extra hares feed more lynx." };
      if (a10 === 10 && d10 === 8) return { ok:false, msg:"Right number of hares, but now 100 lynx." };
      return { ok:false, msg:"The balance point is " + b.h + " hares, " + b.l + " lynx. You need 800 hares and 50 lynx." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop();
        if (cardAnim) { cardAnim(); cardAnim = null; }
        Object.keys(p.start).forEach(function(k){ S[k] = p.start[k]; });
        if (S.mode === "pp") S.yp = 0; else S.yc = 0;
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        animateYear(S.mode === "pp" ? "yp" : "yc", p.to, 3000, function(){ var d = pend; pend = null; if (d) MV.wait(200, d); });
      }
    },
    challenge:chal
  };
}

// ---------- hero: hare and lynx curves draw left to right; the lag bracket and the +/−/0 grid fade in ----------
function hareSVG(x, y){
  return '<g transform="translate(' + x + " " + y + ')" class="si-hare">' + sv("ellipse", { cx:0, cy:6, rx:14, ry:9.5 }) + sv("circle", { cx:13, cy:-3, r:6 }) +
    sv("ellipse", { cx:11, cy:-15, rx:2.4, ry:8.5, transform:"rotate(-12 11 -15)" }) + sv("ellipse", { cx:16, cy:-15, rx:2.4, ry:8.5, transform:"rotate(10 16 -15)" }) +
    sv("ellipse", { cx:-4, cy:15, rx:9, ry:2.8 }) + sv("circle", { cx:-14, cy:2, r:3.2 }) + "</g>";
}
function lynxSVG(x, y){
  return '<g transform="translate(' + x + " " + y + ')" class="si-lynx">' + sv("ellipse", { cx:2, cy:4, rx:19, ry:8.5 }) + sv("circle", { cx:-17, cy:-5, r:7.5 }) +
    sv("path", { d:"M-23 -10 L-22 -21 L-18 -11 Z M-15 -11 L-11 -21 L-10 -9 Z" }) +
    sv("rect", { x:-12, y:8, width:4, height:13, rx:1.5 }) + sv("rect", { x:-4, y:9, width:4, height:12, rx:1.5 }) + sv("rect", { x:8, y:9, width:4, height:12, rx:1.5 }) + sv("rect", { x:15, y:8, width:4, height:13, rx:1.5 }) +
    sv("rect", { x:19, y:-2, width:7, height:5, rx:2 }) + "</g>";
}
function hero(f){
  var svg = $("#si-hsvg"), grid = $("#si-hgrid"); if (!svg) return;
  var cap = f && f.cap, run = ppRun(0.5, 0.4, 400, 20), YR = 30, X0 = 36, X1 = 350, Y0 = 210, YT = 72, VM = 1100;
  function X(t){ return X0 + (X1 - X0) * t / YR; }
  function Yv(v){ return Y0 - (Y0 - YT) * v / VM; }
  var ph = run.pH[0], pl = run.pL[0];
  function frame(k){
    var yr = YR * k, n = idx(yr), hp = "", lp = "", i, h = "";
    h += sv("line", { x1:X0, y1:Y0, x2:X1, y2:Y0, "class":"si-ax" }) + sv("line", { x1:X0, y1:Y0, x2:X0, y2:YT - 6, "class":"si-ax" });
    h += txt(X1, Y0 + 14, "years", "si-t si-ts", "end") + txt(X0 - 4, YT - 10, "numbers", "si-t si-ts");
    for (i = 0; i <= n; i += 4) { hp += (i ? "L" : "M") + f1(X(run.t[i])) + " " + f1(Yv(run.H[i])); lp += (i ? "L" : "M") + f1(X(run.t[i])) + " " + f1(Yv(10 * run.L[i])); }
    h += sv("path", { d:hp, "class":"si-hc" }) + sv("path", { d:lp, "class":"si-lc" });
    if (yr >= pl.t + 0.3) {
      var yb = YT - 4;
      h += '<g class="si-brk">' + sv("line", { x1:X(ph.t), y1:yb, x2:X(pl.t), y2:yb }) + sv("line", { x1:X(ph.t), y1:yb, x2:X(ph.t), y2:yb + 7 }) + sv("line", { x1:X(pl.t), y1:yb, x2:X(pl.t), y2:yb + 7 }) +
        sv("line", { x1:X(ph.t), y1:Yv(ph.v), x2:X(ph.t), y2:yb + 7, "class":"si-brkd" }) + sv("line", { x1:X(pl.t), y1:Yv(10 * pl.v), x2:X(pl.t), y2:yb + 7, "class":"si-brkd" }) + "</g>" +
        txt(X(pl.t) + 6, yb + 4, "lag", "si-t si-tb");
    }
    h += hareSVG(220, 30) + txt(240, 30, "hare", "si-t si-tb si-tblue") + lynxSVG(300, 30) + txt(296, 58, "lynx", "si-t si-tb si-torange", "middle");
    svg.innerHTML = h;
  }
  function setCap(t){ if (cap) cap.textContent = t; }
  if (MV.reduceMotion) { frame(1); grid.classList.add("on"); setCap("The prey peaks first; the predator’s peak lags behind."); return; }
  setCap("Hares rise first…");
  MV.tween({ dur:4200, ease:lin, step:function(k){ frame(k); if (k > 0.35) setCap("…and the lynx peak comes later: the lag."); },
    done:function(){ frame(1); grid.classList.add("on"); setCap("Predation is +/−: the lynx gains, the hare loses."); } });
}

// ---------- Part 3: Ripple effects — @component foodWebPredictor: native buttons over an SVG of arrows (food → eater;
// dashed for other links). Each button cycles ↑ → ↓ → little change; Check names the skipped link (M7). ----------
var BW = 54, BH = 27;
function edge(p, q){ // where the line from p toward q leaves p's box
  var dx = q.x - p.x, dy = q.y - p.y, t = Math.min(dx ? BW / Math.abs(dx) : Infinity, dy ? BH / Math.abs(dy) : Infinity);
  return { x:p.x + dx * t, y:p.y + dy * t };
}
function webSVG(st){
  var h = "";
  st.links.forEach(function(l){
    var p = byId(st.nodes, l.f), q = byId(st.nodes, l.to), a = edge(p, q), b = edge(q, p);
    h += arrow(a.x, a.y, b.x, b.y, "si-warr" + (l.dash ? " si-wdash" : ""), 2);
    if (l.lab) { var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; h += sv("rect", { x:mx - 26, y:my - 8, width:52, height:15, rx:4, "class":"si-wlabbg" }) + txt(mx, my + 4, l.lab, "si-t si-ts", "middle"); }
  });
  return h;
}
function part3(host, api){
  var C = api.content, S = api.S; S.web = S.web || {};
  var ST = C.stations, SW = {}; C.states.forEach(function(s){ SW[s[0]] = s[1]; });
  var NEXT = { "":"up", up:"down", down:"same", same:"up" };
  function ws(id){ return S.web[id] || (S.web[id] = { sel:{}, checked:false, solved:false, tries:0, msg:null }); }
  host.innerHTML = '<div class="si-p3">' + ST.map(function(st){ return '<div class="si-st" data-st="' + st.id + '"></div>'; }).join("") + "</div>";
  function paintSt(st){
    var x = ws(st.id), key = MV.ans(st), box = $('[data-st="' + st.id + '"]', host), h = "<h3>" + st.title + "</h3><p>" + st.text + "</p>";
    h += '<div class="si-web" style="aspect-ratio:360 / ' + st.h + '"><svg viewBox="0 0 360 ' + st.h + '" aria-hidden="true" focusable="false">' + webSVG(st) + "</svg>";
    st.nodes.forEach(function(nd){
      var pos = "left:" + f1(nd.x / 3.6) + "%;top:" + f1(nd.y / st.h * 100) + "%";
      if (nd.fixed) { h += '<div class="si-node si-fixed" style="' + pos + '"><span class="si-nn">' + nd.t + '</span><span class="si-ns">' + (nd.fixed === "up" ? "↑ " : "↓ ") + nd.note + "</span></div>"; return; }
      var v = x.sel[nd.id] || "", mk = x.marks ? x.marks[nd.id] : null, mark = x.solved ? " good" : mk === true ? " good" : mk === false ? " bad" : "", sym = x.solved || mk === true ? "✓ " : mk === false ? "✗ " : "";
      h += '<button type="button" class="si-node' + mark + '" style="' + pos + '" data-node="' + nd.id + '" data-k="' + st.id + nd.id + '"' + (x.solved ? " disabled" : "") +
        ' aria-label="' + MV.esc(MV.plain(nd.t) + ": " + (v ? SW[v] : "not predicted yet") + (sym ? (sym === "✓ " ? ", right" : ", wrong") : "") + ". Tap to change.") + '"><span class="si-nn">' + nd.t + '</span><span class="si-ns">' + sym + (v ? SW[v] : "tap to predict") + "</span></button>";
    });
    h += "</div>";
    h += '<p class="tiny muted">Links: ' + st.links.map(function(l){ return MV.plain(byId(st.nodes, l.f).t) + " → " + MV.plain(byId(st.nodes, l.to).t) + (l.lab ? " (" + l.lab + ")" : " (eaten by)"); }).join("; ") + ".</p>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + st.id + 'chk">Check</button></div>';
    if (x.msg) h += '<div class="fb ' + (x.solved ? "good" : "bad") + '" role="status"><p>' + x.msg + "</p></div>";
    if (x.checked) h += '<div class="si-data"><h4>' + C.panel + ' <span class="bio-model">' + C.illus + "</span></h4>" + MV.tableHTML({ caption:C.panel + " (" + C.illus.toLowerCase() + ")", head:st.data.head, rows:st.data.rows, hiCol:2 }) + "<p>" + st.note + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-st]"); if (!box) return;
    var st = byId(ST, box.dataset.st), x = ws(st.id), key = MV.ans(st);
    if (b.dataset.node) { x.sel[b.dataset.node] = NEXT[x.sel[b.dataset.node] || ""]; if (x.marks) delete x.marks[b.dataset.node]; api.save(); paintSt(st); return; }
    if (b.dataset.act === "check") {
      var ids = st.nodes.filter(function(n){ return !n.fixed; }).map(function(n){ return n.id; });
      if (ids.some(function(id){ return !x.sel[id]; })) { x.msg = "Predict every population first: tap each one until it shows ↑, ↓ or little change."; x.solved = false; paintSt(st); MV.focusFb(box); return; }
      var wrong = ids.filter(function(id){ return x.sel[id] !== key[id]; });
      x.checked = true; x.marks = {}; ids.forEach(function(id){ x.marks[id] = x.sel[id] === key[id]; });
      if (!wrong.length) { x.solved = true; x.msg = "<strong>✓ Correct.</strong> Every link passed the change along. Compare your prediction with the data below."; }
      else { x.tries++; x.msg = "<strong>✗ Not quite.</strong> " + C.m7 + "<br>" + wrong.map(function(id){ return st.fb[id]; }).join("<br>") + "<br>Change the populations marked ✗ and check again."; }
      api.save(); paintSt(st); MV.focusFb(box);
    }
  });
  ST.forEach(paintSt);
}

// ---------- Practice 2: model and ripple reasoning (N4 number entry and chips; adapted from SBI4U 07's data activity) ----------
function modelAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { vals:["", ""], ch:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function parseVal(raw){ var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Z].*$/, "").replace(/\s/g, "").replace(/,/g, "."); var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, t, tol){ return Math.abs(v - t) <= (tol || 1e-6) * Math.max(1, tol ? 1 : Math.abs(t)); }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), dis = x.solved ? " disabled" : "", h;
    h = '<div class="q-head"><span class="qn" aria-hidden="true">R' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "pair") h += '<div class="numrow">' + it.fields.map(function(lab, j){ return '<label class="si-pf"><span>' + lab + '</span><input class="numin si-numin" data-lin="' + it.id + '" data-j="' + j + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.vals[j]) + '"' + dis + "></label>"; }).join("") + "</div>";
    else if (it.kind === "num") h += '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin si-numin" id="li-' + it.id + '" data-lin="' + it.id + '" data-j="0" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.vals[0]) + '"' + dis + ">" + (it.unit ? "<span>" + it.unit + "</span>" : "") + "</div>";
    else h += '<div class="si-chg">' + it.groups.map(function(g){
      return '<div class="si-chrow"><span class="si-chl" id="lab-' + it.id + g.id + '">' + g.t + '</span><span class="chips" role="group" aria-labelledby="lab-' + it.id + g.id + '">' + it.choices.map(function(c){
        return '<button type="button" class="chip' + (x.ch[g.id] === c[0] ? " on" : "") + '" aria-pressed="' + (x.ch[g.id] === c[0]) + '" data-g="' + g.id + '" data-c="' + c[0] + '" data-k="' + it.id + g.id + c[0] + '"' + dis + ">" + c[1] + "</button>"; }).join("") + "</span></div>";
    }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).vals[+e.target.dataset.j] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = byId(a.items, box.dataset.li), x = ist(it.id), ans = MV.ans(it), ok, named;
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.g) { x.ch[b.dataset.g] = b.dataset.c; msgs[it.id] = null; }
    else if (b.dataset.act === "check") {
      if (it.kind === "chips") {
        if (it.groups.some(function(g){ return !x.ch[g.id]; })) { msgs[it.id] = "Choose a chip for every population first."; paintItem(it); return; }
        var bad = it.groups.filter(function(g){ return x.ch[g.id] !== ans[g.id]; }).map(function(g){ return g.id; });
        ok = !bad.length;
        if (!ok) { bad.sort(function(p, q){ return p === "alg" ? -1 : q === "alg" ? 1 : 0; }); msgs[it.id] = "<strong>✗ Not quite.</strong> " + bad.map(function(id){ return it.wrong[id]; }).join(" ") + " Try again."; }
      } else {
        var n = it.kind === "pair" ? 2 : 1, vals = [];
        for (var j = 0; j < n; j++) { var v = parseVal(x.vals[j]); if (v == null) { msgs[it.id] = n === 2 ? "Enter a number in each box." : "Enter a number, such as 12 or 0.5."; paintItem(it); return; } vals.push(v); }
        var target = n === 2 ? ans : [ans];
        ok = vals.every(function(v, k){ return near(v, target[k], it.tol); });
        if (!ok) {
          named = (it.wrong || []).filter(function(w){ var m = Array.isArray(w.match) ? w.match : [w.match]; return m.every(function(mv, k){ return near(vals[k], mv); }); })[0];
          msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general) + " Try again.";
        }
      }
      if (ok) { msgs[it.id] = null; x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else return;
    api.save(); paintItem(it); if (b.dataset.act === "check") MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Make room for two (sliders; live competition graph to year 100 with both balances) ----------
var task = (function(){
  var api = null, plot = null, DEF = { k1:600, k2:400, al:0.5 };
  function read(){ var s = api ? api.S : {}, d = {}; Object.keys(DEF).forEach(function(k){ d[k] = s[k] != null ? s[k] : DEF[k]; }); d.A = Math.round(d.al * 10); return d; }
  function bal(d){ return compOutcome(d.k1, d.k2, d.A / 10); }
  function draw(){
    if (!plot) return;
    var d = read(), o = bal(d);
    compScene(plot, d.k1, d.k2, d.A / 10, COMP_YRS, { pre:"Your design. " });
    $("#si-tread").innerHTML = MV.readoutHTML([["Species 1 balance", o.n1 > 0.5 ? String(Math.round(o.n1)) : "excluded"], ["Species 2 balance", o.n2 > 0.5 ? String(Math.round(o.n2)) : "excluded"], ["Outcome", outcomeText(o)]]);
  }
  function key(d){ return [d.k1, d.k2, d.A].join("|"); }
  function unkey(k){ var p = k.split("|"); return { k1:+p[0], k2:+p[1], A:+p[2] }; }
  return {
    render:function(inp, pv, a){
      api = a;
      Object.keys(DEF).forEach(function(k){ if (a.S[k] == null) a.S[k] = DEF[k]; });
      inp.innerHTML = '<div id="si-tsl"></div>';
      MV.sliders($("#si-tsl", inp), [
        { id:"si-tk1", label:"<em>K</em>₁ (species 1)", min:100, max:800, step:100, value:a.S.k1 },
        { id:"si-tk2", label:"<em>K</em>₂ (species 2)", min:100, max:800, step:100, value:a.S.k2 },
        { id:"si-tal", label:"overlap <em>α</em>", min:0, max:1, step:0.1, value:a.S.al, fmt:function(v){ return d1(v); } }],
        function(id, v){ a.S[{ "si-tk1":"k1", "si-tk2":"k2", "si-tal":"al" }[id]] = v; a.save(); draw(); a.update(); });
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="si-tplot" role="img" aria-label="Competition graph for your design"></canvas></div><p class="legend si-leg">' + LEG_C + '</p><dl class="read" id="si-tread" aria-live="polite"></dl>';
      plot = new MV.Plot($("#si-tplot", pv), { xmin:0, xmax:100, ymin:0, ymax:900 });
      plot.render = draw;
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var o = bal(d); return [!!o.both, d.A >= 6, d.k1 > d.k2, o.n2 >= 150 - 1e-9]; },
    key:key,
    label:function(k){ var d = unkey(k), o = compOutcome(d.k1, d.k2, d.A / 10); return "<em>K</em>₁ = " + d.k1 + ", <em>K</em>₂ = " + d.k2 + ", overlap " + d1(d.A / 10) + " → species 2 keeps " + Math.round(o.n2); },
    text:function(k){ var d = unkey(k), o = compOutcome(d.k1, d.k2, d.A / 10); return "(" + d.k1 + ", " + d.k2 + ", " + d1(d.A / 10) + ") → " + Math.round(o.n2); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ model:modelAct },
  task:task
});
})();
