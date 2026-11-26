// MCV4U 12 The Chain Rule: hero (gear train turns once, then the equation), Explore "Gear train" (Gears, Pipeline and Graph
// modes; pipelines P1–P4 and Tune k), Part 3 "Outside–inside" (peel the layers, verify three ways, combine the rules), V8 number
// boxes (Practice 2) and the "Three flat spots" performance task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol) + 1e-12; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function fUI(){ return css("--font-ui") || "sans-serif"; }
function fM(){ return css("--font-math") || "serif"; }
function q1(v){ return Math.round(v * 10) / 10; }
var LIN = function(t){ return t; };
function lz(a, b){ return '<span class="m">d<i>' + a + "</i>/d<i>" + b + "</i></span>"; }
var DYDX = lz("y", "x"), DYDU = lz("y", "u"), DUDX = lz("u", "x");
// numbers: exact when the value is an integer, a short decimal or a fraction with a small denominator; else 3 significant figures
function sig(v){ var a = Math.abs(v); if (a >= 1000) return num(v, 0); if (a < 5e-4) return "0.000"; return (v < 0 ? MINUS : "") + a.toPrecision(3); }
function fmt(v){
  if (!isFinite(v)) return { t:"undefined", ex:true, bad:true };
  var tol = 1e-9 * Math.max(1, Math.abs(v)), r = Math.round(v);
  if (Math.abs(v - r) < tol) return { t:num(r, 0), ex:true };
  var r6 = Math.round(v * 1e6) / 1e6; if (Math.abs(r6 - v) < tol) return { t:num(r6, 6), ex:true };
  for (var d = 2; d <= 64; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < tol) return { t:(n < 0 ? MINUS : "") + Math.abs(n) + "/" + d, ex:true }; }
  return { t:sig(v), ex:false };
}
// bracket widths: exact only when short (at most 4 significant digits), else "≈" with 3 significant figures
function wfmt(w){ var f = fmt(w); return f.ex && f.t.replace(/[^0-9]/g, "").replace(/^0+/, "").length <= 4 ? f.t : "≈ " + sig(w); }
function eqv(v){ var f = fmt(v); return (f.ex ? " = " : " ≈ ") + f.t; }
function par(t){ return t.charAt(0) === MINUS ? "(" + t + ")" : t; }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (o.id === val) + '">' + o.t + "</button>";
  }).join("") + "</span>";
}
// canvas text with italic math letters and upright digits/symbols (copied from MCV4U 10)
function mtext(ctx, s, x, y, o){
  o = o || {};
  var size = o.size || 14, runs = String(s).replace(/-/g, MINUS).match(/[A-Za-z]+|[^A-Za-z]+/g) || [];
  function fnt(r){ return /[A-Za-z]/.test(r) && !o.upright ? "italic 600 " + (size + 1) + "px " + fM() : "600 " + size + "px " + fUI(); }
  var wd = 0; runs.forEach(function(r){ ctx.font = fnt(r); wd += ctx.measureText(r).width; });
  var x0 = o.align === "right" ? x - wd : o.align === "center" ? x - wd / 2 : x;
  ctx.save(); ctx.textBaseline = "middle";
  if (o.bg !== false) { ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.9; ctx.fillRect(x0 - 3, y - size * 0.72, wd + 6, size * 1.44); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink"); ctx.textAlign = "left";
  runs.forEach(function(r){ ctx.font = fnt(r); ctx.fillText(r, x0, y); x0 += ctx.measureText(r).width; });
  ctx.restore();
}
// SVG text: letters italic (tspan), hyphen -> minus; "d" stays upright when o.d is set (Leibniz labels)
function svgTx(s, o){
  o = o || {};
  var out = "", t = String(s);
  for (var i = 0; i < t.length; i++) {
    var c = t[i];
    if (/[A-Za-z]/.test(c) && !(o.d && c === "d" && /[A-Za-z]/.test(t[i + 1] || ""))) out += '<tspan class="ch-it">' + c + "</tspan>";
    else if (c === "-") out += MINUS;
    else if (c === "&") out += "&amp;"; else if (c === "<") out += "&lt;"; else if (c === ">") out += "&gt;";
    else out += c;
  }
  return out;
}

// =====================================================================================================================
// @component gearTrain — module-specific (MCV4U 12): three sprockets X (--ink-2), U (--pen) and Y (--f3) joined by chains.
// U turns a times as fast as X and Y turns b times as fast as U; a negative rate crosses that chain, so the sprocket turns the
// other way (the readout says so in words too). Teeth counts match the ratio when it gives a whole number (X has 48 teeth).
// SVG with a fixed 340-unit-wide viewBox (gears shrink to fit). gearTrain(host, {id}) -> {build(a, b), pose(turns, moving), desc(turns)}
function gearPath(R, n){
  var d = clamp(R * 0.17, 3, 7), r0 = R - d, s = 2 * Math.PI / n, pts = [];
  for (var i = 0; i < n; i++) { var a = i * s; pts.push([r0, a], [R, a + 0.22 * s], [R, a + 0.5 * s], [r0, a + 0.72 * s]); }
  return "M" + pts.map(function(p){ return q1(p[0] * Math.cos(p[1])) + " " + q1(p[0] * Math.sin(p[1])); }).join("L") + "Z";
}
function teethFor(prev, rate, r){
  if (rate) { var T = prev / Math.abs(rate); if (Math.abs(T - Math.round(T)) < 1e-9 && T >= 5 && T <= 96) return Math.round(T); }
  return Math.max(6, Math.round(r * 0.8));
}
function turnsTxt(v, moving){ var t = moving ? num(v, 2) : num(v, 4); return t + (t === "1" ? " turn" : " turns"); }
function gearTrain(host, o){
  var VW = 340, G = { a:1, b:1 }, el = {};
  function belt(c1, r1, c2, r2, cy, cross){
    var d = c2 - c1, cs = cross ? (r1 + r2) / d : (r1 - r2) / d; if (Math.abs(cs) >= 1) return "";
    var ph = Math.acos(cs), h = "";
    [ph, -ph].forEach(function(p){
      var nx = Math.cos(p), ny = Math.sin(p);
      h += '<line class="ch-belt" x1="' + q1(c1 + r1 * nx) + '" y1="' + q1(cy + r1 * ny) + '" x2="' + q1(cross ? c2 - r2 * nx : c2 + r2 * nx) + '" y2="' + q1(cross ? cy - r2 * ny : cy + r2 * ny) + '"/>';
    });
    return h;
  }
  function rateLab(x, a, b, v, cls){ return '<text class="ch-rl ' + cls + '" x="' + q1(x) + '" y="18" text-anchor="middle">d<tspan class="ch-it">' + a + "</tspan>/d<tspan class=\"ch-it\">" + b + "</tspan> = " + svgTx(fmt(v).t) + "</text>"; }
  function build(a, b){
    G.a = a; G.b = b;
    var rX = 62, rU = a ? clamp(62 / Math.abs(a), 18, 84) : 40, rY = b ? clamp(rU / Math.abs(b), 15, 84) : 30;
    var tX = 48, tU = teethFor(tX, a, rU), tY = teethFor(tU, b, rY);
    var gap = 46, nat = 2 * (rX + rU + rY) + 2 * gap + 12, sc = Math.min(1, VW / nat);
    rX *= sc; rU *= sc; rY *= sc; gap *= sc;
    var R = Math.max(rX, rU, rY), cy = 34 + R, H = Math.round(cy + R + 50), x0 = (VW - (2 * (rX + rU + rY) + 2 * gap)) / 2;
    var cX = x0 + rX, cU = cX + rX + gap + rU, cY = cU + rU + gap + rY;
    var gears = [{ k:"X", c:cX, r:rX, t:tX, cls:"ch-gX" }, { k:"U", c:cU, r:rU, t:tU, cls:"ch-gU" }, { k:"Y", c:cY, r:rY, t:tY, cls:"ch-gY" }];
    var h = '<svg class="ch-gsvg" viewBox="0 0 ' + VW + " " + H + '" aria-hidden="true" focusable="false">';
    if (a) h += belt(cX, rX + 2, cU, rU + 2, cy, a < 0);
    if (b) h += belt(cU, rU + 2, cY, rY + 2, cy, b < 0);
    gears.forEach(function(g){
      var hub = Math.max(4, g.r * 0.26);
      h += '<g class="ch-g ' + g.cls + '" transform="translate(' + q1(g.c) + " " + q1(cy) + ')"><g data-rot="' + g.k + '"><path class="ch-gp" d="' + gearPath(g.r, g.t) + '"/>' +
        '<circle class="ch-hub" r="' + q1(hub) + '"/><line class="ch-spoke" x1="' + q1(hub) + '" y1="0" x2="' + q1(g.r * 0.78) + '" y2="0"/><circle class="ch-dot" cx="' + q1(g.r * 0.78) + '" cy="0" r="' + q1(Math.max(2.2, g.r * 0.07)) + '"/></g></g>' +
        '<text class="ch-gl" x="' + q1(g.c) + '" y="' + q1(cy + R + 20) + '" text-anchor="middle"><tspan class="ch-it">' + g.k + "</tspan></text>" +
        '<text class="ch-cnt" data-cnt="' + g.k + '" x="' + q1(g.c) + '" y="' + q1(cy + R + 38) + '" text-anchor="middle"></text>';
    });
    h += rateLab((cX + cU) / 2, "u", "x", a, "ch-rlU") + rateLab((cU + cY) / 2, "y", "u", b, "ch-rlY");
    host.innerHTML = h + "</svg>";
    ["X", "U", "Y"].forEach(function(k){ el[k] = host.querySelector('[data-rot="' + k + '"]'); el["c" + k] = host.querySelector('[data-cnt="' + k + '"]'); });
  }
  function pose(t, moving){
    var v = { X:t, U:G.a * t, Y:G.a * G.b * t };
    ["X", "U", "Y"].forEach(function(k){
      if (!el[k]) return;
      el[k].setAttribute("transform", "rotate(" + q1(((360 * v[k]) % 360 + 360) % 360) + ")");
      el["c" + k].textContent = turnsTxt(v[k], moving);
    });
  }
  function desc(t){
    return "Gear train: X drives U (du/dx = " + MV.plain(fmt(G.a).t) + ", " + (G.a < 0 ? "crossed chain" : G.a ? "straight chain" : "no chain") + "), U drives Y (dy/du = " + MV.plain(fmt(G.b).t) + "). " +
      "Turns so far: X " + num(t, 4) + ", U " + num(G.a * t, 4) + ", Y " + num(G.a * G.b * t, 4) + ".";
  }
  return { build:build, pose:pose, desc:desc };
}
// --------------------------------------------------- end of gearTrain --------------------------------------------------

// ---------- pipelines (Explore); the chips' text is in content.explore.pipes ----------
function sqrtN(u){ return u < 0 ? NaN : Math.sqrt(u); }
var PIPES = {
  P1:{ g:function(x){ return x * x + 1; }, f:function(u){ return u * u * u; }, dg:function(x){ return 2 * x; }, df:function(u){ return 3 * u * u; },
    gs:"x^2 + 1", fs:"u^3", dgs:"2x", dfs:"3u^2", ys:"(x^2 + 1)^3", xr:[-3, 3],
    home:{ xmin:-2.2, xmax:2.2, ymin:-14, ymax:135 }, wide:{ xmin:-3.3, xmax:3.3, ymin:-60, ymax:1060 } },
  P2:{ g:function(x){ return 2 * x - 3; }, f:sqrtN, dg:function(){ return 2; }, df:function(u){ return u > 0 ? 1 / (2 * Math.sqrt(u)) : NaN; },
    gs:"2x - 3", fs:"√u", dgs:"2", dfs:"{1}/{2√u}", ys:"√{2x - 3}", xr:[1.5, 7.5], home:{ xmin:1, xmax:8, ymin:-0.6, ymax:4.2 } },
  P3:{ g:function(x){ return x * x * x; }, f:function(u){ return 1 / u; }, dg:function(x){ return 3 * x * x; }, df:function(u){ return -1 / (u * u); },
    gs:"x^3", fs:"{1}/{u}", dgs:"3x^2", dfs:"-{1}/{u^2}", ys:"{1}/{x^3}", xr:[-3, 3], skip0:true, home:{ xmin:-3.3, xmax:3.3, ymin:-6, ymax:6 } },
  P4:{ g:function(x){ return 1 - x * x; }, f:function(u){ return u * u * u * u; }, dg:function(x){ return -2 * x; }, df:function(u){ return 4 * u * u * u; },
    gs:"1 - x^2", fs:"u^4", dgs:"-2x", dfs:"4u^3", ys:"(1 - x^2)^4", xr:[-3, 3],
    home:{ xmin:-1.6, xmax:1.6, ymin:-0.4, ymax:2.4 }, wide:{ xmin:-3.3, xmax:3.3, ymin:-250, ymax:4400 } }
};
function autoView(F, x0, x1){
  var lo = Infinity, hi = -Infinity;
  for (var i = 0; i <= 200; i++) { var v = F(x0 + (x1 - x0) * i / 200); if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }
  lo = Math.min(lo, 0); hi = Math.max(hi, 0); var pad = (hi - lo) * 0.08 || 1;
  return { xmin:x0 - 0.2, xmax:x1 + 0.2, ymin:lo - pad, ymax:hi + pad };
}
var kCache = {};
function pipeOf(S){
  if (S.pipe !== "K") return PIPES[S.pipe] || PIPES.P1;
  var k = S.k;
  if (kCache.k === k) return kCache.P;
  var gs = k === 0 ? "x^2" : "x^2 " + (k > 0 ? "- " : "+ ") + Math.abs(k);
  var P = { g:function(x){ return x * x - k; }, f:function(u){ return u * u * u; }, dg:function(x){ return 2 * x; }, df:function(u){ return 3 * u * u; },
    gs:gs, fs:"u^3", dgs:"2x", dfs:"3u^2", ys:"(" + gs + ")^3", xr:[-3, 3] };
  var F = function(x){ return Math.pow(x * x - k, 3); };
  P.home = autoView(F, -2, 2); P.wide = autoView(F, -3.1, 3.1);
  kCache = { k:k, P:P };
  return P;
}
function chainAt(P, x){ var u = P.g(x), y = P.f(u), dg = P.dg(x), df = P.df(u); return { x:x, u:u, y:y, dg:dg, df:df, d:df * dg }; }

// =====================================================================================================================
// @component pipeLines — three linked number lines (G14 style, SVG, 400 units wide) for a two-stage pipeline x → u = g(x) →
// y = f(u). Each line is centred on its current value. A bracket of width 0.1 around x and its images on the u and y lines
// (filled dot = image of x − 0.05, open dot = image of x + 0.05, so a negative stretch shows as a flip); the arrows carry the
// local stretch factors du/dx and dy/du. Each line zooms by powers of 10 to keep its bracket readable and says so.
// pipeSVG(P, x, flow) -> {svg, desc}; flow (0..2) grows the u bracket, then the y bracket (prediction reveals).
function pipeSVG(P, x, flow){
  var L0 = 30, L1 = 328, LW = L1 - L0, YS = [40, 164, 288], H = 330;
  var xa = Math.max(x - 0.05, P.xr[0]), xb = x + 0.05, c = chainAt(P, x);
  var ua = P.g(xa), ub = P.g(xb), ya = P.f(ua), yb = P.f(ub);
  var rows = [{ k:"x", c:x, a:xa, b:xb, s:1 }, { k:"u", c:c.u, a:ua, b:ub, s:clamp(flow, 0, 1) }, { k:"y", c:c.y, a:ya, b:yb, s:clamp(flow - 1, 0, 1) }];
  var h = '<svg class="ch-psvg" viewBox="0 0 340 ' + H + '" aria-hidden="true" focusable="false">', widths = [];
  rows.forEach(function(r, i){
    var y0 = YS[i], w = Math.abs(r.b - r.a), z = 1;
    if (isFinite(w) && w > 0) { while (w > 0.8 * 4 * z) z *= 10; while (w < 0.02 * 4 * z && z > 1e-6) z /= 10; }
    var hw = 2 * z, lo = r.c - hw;
    function X(v){ return L0 + (v - lo) / (2 * hw) * LW; }
    h += '<line class="ch-nl" x1="' + L0 + '" y1="' + y0 + '" x2="' + L1 + '" y2="' + y0 + '"/>';
    var st = z / 2, dp = Math.max(0, -Math.floor(Math.log10(z) + 1e-9));
    for (var t = Math.ceil(lo / st - 1e-9) * st; t <= r.c + hw + 1e-9; t += st) {
      var px = X(t); if (px < L0 - 0.5 || px > L1 + 0.5) continue;
      var major = Math.abs(t / z - Math.round(t / z)) < 1e-6;
      h += '<line class="ch-tk" x1="' + q1(px) + '" y1="' + (y0 - (major ? 5 : 3)) + '" x2="' + q1(px) + '" y2="' + (y0 + (major ? 5 : 3)) + '"/>';
      if (major) h += '<text class="ch-tl" x="' + q1(px) + '" y="' + (y0 + 20) + '" text-anchor="middle">' + num(Math.round(t / z) * z, dp) + "</text>";
    }
    h += '<text class="ch-ll" x="13" y="' + (y0 + 6) + '" text-anchor="middle"><tspan class="ch-it">' + r.k + "</tspan></text>";
    if (z !== 1) h += '<text class="ch-zm" x="' + L0 + '" y="' + (y0 + 37) + '">' + (z > 1 ? "zoomed out ×" + num(z, 0) : "zoomed in ×" + num(1 / z, 0)) + "</text>";
    if (r.s > 0 && isFinite(r.a) && isFinite(r.b)) {
      var pa = X(r.a), pb = X(r.b), mid = (pa + pb) / 2;
      pa = mid + (pa - mid) * r.s; pb = mid + (pb - mid) * r.s;
      h += '<g style="opacity:' + q1(Math.max(0.15, r.s)) + '"><rect class="ch-br" x="' + q1(Math.min(pa, pb)) + '" y="' + (y0 - 6) + '" width="' + q1(Math.max(Math.abs(pb - pa), 1.5)) + '" height="12"/>' +
        '<circle class="ch-mk" cx="' + q1(pa) + '" cy="' + y0 + '" r="3.6"/><circle class="ch-mko" cx="' + q1(pb) + '" cy="' + y0 + '" r="3.6"/></g>';
      var wt = wfmt(Math.abs(r.b - r.a)), flip = i > 0 && (r.b - r.a) * (rows[0].b - rows[0].a) < 0;
      if (r.s >= 1) h += '<text class="ch-wl" x="' + L1 + '" y="' + (y0 + 37) + '" text-anchor="end">width ' + wt + (flip ? ", flipped" : "") + "</text>";
      widths.push(wt);
    }
    if (isFinite(r.c)) {
      var pc = X(r.c), fc = fmt(r.c);
      h += '<line class="ch-cv" x1="' + q1(pc) + '" y1="' + (y0 - 9) + '" x2="' + q1(pc) + '" y2="' + (y0 + 9) + '"/>';
      if (i === 0 || r.s > 0) h += '<text class="ch-vl" x="' + q1(pc) + '" y="' + (y0 - 15) + '" text-anchor="middle"><tspan class="ch-it">' + r.k + "</tspan> " + (fc.ex ? "= " : "≈ ") + fc.t + "</text>";
    }
  });
  [[c.dg, "u", "x", "ch-rlU", 1], [c.df, "y", "u", "ch-rlY", 2]].forEach(function(a, j){
    var s = j === 0 ? clamp(flow, 0, 1) : clamp(flow - 1, 0, 1); if (s <= 0) return;
    var yA = YS[j] + 44, yB = YS[j + 1] - 30, xm = 179, f = fmt(a[0]);
    h += '<g style="opacity:' + q1(s) + '"><line class="ch-ar ' + a[3] + 's" x1="' + xm + '" y1="' + yA + '" x2="' + xm + '" y2="' + (yB - 6) + '"/>' +
      '<path class="ch-arh ' + a[3] + 'f" d="M' + (xm - 6) + " " + (yB - 8) + "L" + (xm + 6) + " " + (yB - 8) + "L" + xm + " " + yB + 'Z"/>' +
      '<text class="ch-rl ' + a[3] + '" x="' + (xm + 12) + '" y="' + q1((yA + yB) / 2 - 2) + '">× ' + svgTx(f.bad ? "undefined" : (f.ex ? "" : "≈ ") + f.t) + "</text>" +
      '<text class="ch-rs" x="' + (xm + 12) + '" y="' + q1((yA + yB) / 2 + 15) + '">d<tspan class="ch-it">' + a[1] + "</tspan>/d<tspan class=\"ch-it\">" + a[2] + "</tspan></text></g>";
  });
  var d = "Pipeline: x = " + MV.plain(fmt(x).t) + " maps to u = " + MV.plain(fmt(c.u).t) + " maps to y = " + MV.plain(fmt(c.y).t) +
    "; stretch " + MV.plain(fmt(c.dg).t) + " then " + MV.plain(fmt(c.df).t) + (widths.length ? ". Bracket widths " + widths.map(MV.plain).join(", ") : "") + ".";
  return { svg:h + "</svg>", desc:d };
}
// --------------------------------------------------- end of pipeLines --------------------------------------------------

// ---------- hero: the gears turn once, the counters freeze, the equation appears ----------
function hero(f){
  var box = $("#ch-hero-svg"), fin = $("#ch-hero-fin"), mul = $("#ch-hero-mul"), rep = $("#ch-hero-replay"); if (!box || !fin) return;
  var H = MV.C.hero, gt = gearTrain(box, { id:"hero" }), stop = null, tok = 0;
  gt.build(3, 2);
  function frame(stage){
    box.classList.toggle("ch-faded", stage >= 2); fin.classList.toggle("on", stage >= 2); mul.classList.toggle("on", stage >= 1);
    fin.innerHTML = H.finalEq || ""; mul.innerHTML = stage >= 1 ? "6 = 2 × 3" : "";
    if (f.cap) f.cap.innerHTML = H.steps[stage] || "";
    box.setAttribute("aria-label", MV.plain(H.steps[stage] || ""));
  }
  function run(){
    tok++; var my = tok; if (stop) { stop(); stop = null; }
    if (MV.reduceMotion) { gt.pose(1, false); frame(2); rep.disabled = false; return; }
    rep.disabled = true; gt.pose(0, false); frame(0);
    stop = MV.tween({ dur:3600, ease:LIN, step:function(t){ gt.pose(t, true); }, done:function(){
      stop = null; gt.pose(1, false);
      MV.wait(450, function(){ if (my !== tok) return; frame(1);
        MV.wait(2300, function(){ if (my !== tok) return; frame(2); rep.disabled = false; }); });
    } });
  }
  rep.addEventListener("click", run);
  gt.pose(0, false); frame(0);
  if (MV.reduceMotion) run(); else { rep.disabled = true; MV.wait(700, run); }
}

// ---------- Explore: gear train ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["gears", "pipe", "graph"].indexOf(S.mode) < 0) S.mode = "gears";
  if (typeof S.a !== "number") S.a = 3;
  if (typeof S.b !== "number") S.b = 2;
  if (typeof S.turns !== "number") S.turns = 0;
  if (!PIPES[S.pipe] && S.pipe !== "K") S.pipe = "P1";
  if (typeof S.x !== "number") S.x = 1;
  if (typeof S.k !== "number") S.k = 0;
  S.kFound = S.kFound || {};
  var busy = false, playing = null, tLive = null, xLive = null, flow = 2, stop = null;
  function sl(id, label, min, max, step, col, extra){
    return '<label class="slider ch-sl"><span class="slider-top"><span>' + label + '</span><output id="' + id + '-out"></output></span><input type="range" id="' + id + '" data-big="1" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:' + col + '"' + (extra || "") + "></label>";
  }
  host.innerHTML = '<div class="ch-ex"><div class="ch-main" data-mv="graph"><p class="eq-cap ch-eq" id="ch-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ch-gearbox ch-exg" id="ch-gears" role="img" aria-label="Gear train"></div><p class="ch-said" id="ch-said" aria-live="polite"></p>' +
    '<div class="ch-pipebox" id="ch-pipe" role="img" aria-label="Pipeline number lines"></div>' +
    '<div class="plot-wrap" id="ch-gwrap"><canvas class="plot" id="ch-plot" role="img" aria-label="Graph of the composite function"></canvas></div>' +
    '<p class="tiny muted ch-key" id="ch-key"></p></div>' +
    '<div class="ch-side"><div id="ch-mode"></div><p class="tiny muted ch-how" id="ch-how"></p>' +
    '<div id="ch-gctl">' + sl("ch-a", "Inner rate " + DUDX, -4, 4, 0.5, "var(--pen)") + sl("ch-b", "Outer rate " + DYDU, -4, 4, 0.5, "var(--f3)") +
      '<div class="q-actions ch-gbtn"><button type="button" class="btn primary sm" id="ch-play" data-k="chplay" aria-pressed="false">Play</button><button type="button" class="btn ghost sm" id="ch-step" data-k="chstep">Step</button><button type="button" class="btn ghost sm" id="ch-reset" data-k="chreset">Reset counters</button></div>' +
      '<p class="tiny muted ch-kbd">Play turns <span class="m"><i>X</i></span> once; Step turns it a quarter. Space plays or pauses while a rate slider has focus.</p></div>' +
    '<div id="ch-pctl"><p class="tiny ch-lab" id="ch-plab">Pipeline</p><div class="chips ch-pipes" id="ch-pipes" role="group" aria-labelledby="ch-plab"></div>' +
      '<div id="ch-xsl"></div><div id="ch-ksl"></div><div id="ch-found" aria-live="polite"></div></div>' +
    '<dl class="read ch-read" id="ch-read" aria-live="polite"></dl></div></div>';
  var gt = gearTrain($("#ch-gears", host), { id:"ex" });
  var plot = new MV.Plot($("#ch-plot", host), { xmin:-3, xmax:3, ymin:-5, ymax:5 });
  plot.render = drawGraph;
  function cx(){ return xLive != null ? xLive : S.x; }
  function ct(){ return tLive != null ? tLive : S.turns; }
  function rebuildGears(){ gt.build(S.a, S.b); gt.pose(ct(), false); }

  // ---- painting ----
  function paintTop(){
    MV.keepFocus($("#ch-mode", host), function(){ $("#ch-mode", host).innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode") + "</div>"; });
    $("#ch-how", host).innerHTML = C.modeHow[S.mode];
    var g = S.mode === "gears";
    $("#ch-gctl", host).hidden = !g; $("#ch-pctl", host).hidden = g;
    $("#ch-gears", host).hidden = !g; $("#ch-said", host).hidden = !g;
    $("#ch-pipe", host).hidden = S.mode !== "pipe"; $("#ch-gwrap", host).hidden = S.mode !== "graph";
    MV.keepFocus($("#ch-pipes", host), function(){
      $("#ch-pipes", host).innerHTML = C.pipes.map(function(p){ return '<button type="button" class="chip' + (p.id === S.pipe ? " on" : "") + '" data-pipe="' + p.id + '" data-k="pipe' + p.id + '" aria-pressed="' + (p.id === S.pipe) + '">' + p.chip + "</button>"; }).join("");
    });
    var P = pipeOf(S), xs = $("#ch-xsl", host), xr = P.xr;
    if (!$("#ch-x", xs) || xs.dataset.r !== xr.join(",")) {
      xs.innerHTML = sl("ch-x", m("x"), xr[0], xr[1], 0.1, "var(--ink)", ' aria-label="x"'); xs.dataset.r = xr.join(",");
    }
    var ks = $("#ch-ksl", host);
    if (S.pipe === "K") { if (!$("#ch-k", ks)) ks.innerHTML = sl("ch-k", m("k"), -5, 5, 1, "var(--ink)", ' aria-label="k"'); }
    else ks.innerHTML = "";
    syncSliders();
  }
  function syncSliders(){
    var a = $("#ch-a", host), b = $("#ch-b", host), x = $("#ch-x", host), k = $("#ch-k", host);
    a.value = S.a; $("#ch-a-out", host).textContent = fmt(S.a).t; a.setAttribute("aria-valuetext", fmt(S.a).t + ", " + dirWords(S.a, "U", "X"));
    b.value = S.b; $("#ch-b-out", host).textContent = fmt(S.b).t; b.setAttribute("aria-valuetext", fmt(S.b).t + ", " + dirWords(S.b, "Y", "U"));
    if (x) { var xv = cx(); x.value = Math.round(xv * 10) / 10; $("#ch-x-out", host).textContent = num(xv, 1); }
    if (k) { k.value = S.k; $("#ch-k-out", host).textContent = num(S.k, 0); }
    var pb = $("#ch-play", host); pb.textContent = playing ? "Pause" : "Play"; pb.setAttribute("aria-pressed", String(!!playing));
  }
  function dirWords(r, A, B){
    if (!r) return A + " doesn’t turn";
    return A + " turns " + (r > 0 ? "the same way as " : "the opposite way to ") + B + (Math.abs(r) === 1 ? ", just as fast" : ", " + MV.plain(fmt(Math.abs(r)).t) + " times as fast");
  }
  function chainWords(r){
    var Y = '<i class="ch-cap">Y</i>', X = '<i class="ch-cap">X</i>';
    if (!r) return Y + " doesn’t turn";
    return Y + " turns " + (r > 0 ? "forward" : "backward") + (Math.abs(r) === 1 ? ", just as fast as " + X : ", " + fmt(Math.abs(r)).t + " times as fast as " + X);
  }
  function itWords(r, A, B){ return dirWords(r, A, B).replace(new RegExp("\\b([" + A + B + "])\\b", "g"), '<i class="ch-cap">$1</i>'); }
  function turnSentence(){
    var t = S.turns; if (!t) return "";
    function one(L, v){ var a = Math.abs(v); return '<i class="ch-cap">' + L + "</i> turned " + (v === 0 ? "0 times" : (near(a, 1) ? "1 time" : num(a, 4) + " times") + (v < 0 ? " backward" : "")); }
    return one("X", t) + ", " + one("U", S.a * t) + " and " + one("Y", S.a * S.b * t) + ".";
  }
  function paintRead(){
    var el = $("#ch-read", host), rows;
    if (S.mode === "gears") {
      var ab = S.a * S.b;
      rows = [
        ["Inner rate", DUDX + " = " + fmt(S.a).t + ": " + itWords(S.a, "U", "X")],
        ["Outer rate", DYDU + " = " + fmt(S.b).t + ": " + itWords(S.b, "Y", "U")],
        ["Chain", DYDX + " = " + fmt(S.b).t + " × " + par(fmt(S.a).t) + " = " + fmt(ab).t + ": " + chainWords(ab)],
        ["Turns so far", '<i class="ch-cap">X</i> ' + num(S.turns, 4) + ", " + '<i class="ch-cap">U</i> ' + num(S.a * S.turns, 4) + ", " + '<i class="ch-cap">Y</i> ' + num(ab * S.turns, 4)]
      ];
    } else {
      var P = pipeOf(S), c = chainAt(P, cx()), sec = (P.f(P.g(c.x + 0.001)) - c.y) / 0.001;
      var xs = fmt(c.x).t, us = fmt(c.u).t;
      rows = [
        ["Input", m("x = " + xs)],
        ["Inner value", m("u = g(" + xs + ")") + eqv(c.u)],
        ["Output", m("y = f(" + us + ")") + eqv(c.y)],
        ["Inner rate", DUDX + " = " + m(P.dgs) + eqv(c.dg) + ' <span class="ch-at">at ' + m("x = " + xs) + "</span>"],
        ["Outer rate", DYDU + " = " + m(P.dfs) + eqv(c.df) + ' <span class="ch-at ch-hl">at ' + m("u = " + us) + "</span>"],
        ["Chain", isFinite(c.d) ? DYDX + " = " + fmt(c.df).t + " × " + par(fmt(c.dg).t) + eqv(c.d) : DYDX + " is undefined here"],
        ["Check", "secant slope (" + m("h = 0.001") + ") ≈ " + sig(sec)]
      ];
      if (!isFinite(c.df)) rows.push(["Note", "At " + m("u = 0") + ", " + m("√u") + " has a vertical tangent, so " + DYDU + " doesn’t exist."]);
      else if (near(c.dg, 0)) rows.push(["Flat", "The inner rate is 0, so the whole chain is flat here."]);
      else if (near(c.df, 0)) rows.push(["Flat", "The outer rate is 0 at " + m("u = " + us) + ", so the whole chain is flat here."]);
    }
    el.innerHTML = MV.readoutHTML(rows);
  }
  function paintEq(){
    var e = $("#ch-eq", host);
    if (S.mode === "gears") { e.innerHTML = DYDX + " = " + DYDU + " × " + DUDX; return; }
    var P = pipeOf(S); e.innerHTML = m("u = " + P.gs) + " and " + m("y = " + P.fs) + ", so " + m("y = " + P.ys);
  }
  function paintKey(){
    $("#ch-key", host).innerHTML = S.mode === "gears" ? "Grey gear " + m("X") + " (input), blue gear " + m("U") + " (inner), teal gear " + m("Y") + " (outer). A crossed chain reverses the direction."
      : S.mode === "pipe" ? "Yellow band: the bracket. Filled dot: where " + m("x - 0.05") + " goes; open dot: where " + m("x + 0.05") + " goes."
      : "Solid curve: " + m("y = f(g(x))") + ". Straight line: the tangent at " + m("x") + ".";
  }
  function paintFound(){
    var el = $("#ch-found", host);
    if (S.pipe !== "K" || S.mode === "gears") { el.innerHTML = ""; return; }
    var both = S.kFound.k0 && S.kFound.k2;
    el.innerHTML = '<p class="tiny ch-fd">Slope 6 at ' + m("x = 1") + " found with: " + m("k = 0") + (S.kFound.k0 ? " ✓" : " —") + ", " + m("k = 2") + (S.kFound.k2 ? " ✓" : " —") + (both ? ' <span class="tag ch-both">Found both</span>' : "") + "</p>";
  }
  function noteFound(){
    if (S.pipe === "K" && S.mode !== "gears" && near(S.x, 1, 1e-6) && (S.k === 0 || S.k === 2) && !S.kFound["k" + S.k]) { S.kFound["k" + S.k] = true; api.save(); }
  }
  function drawGraph(){
    if (S.mode !== "graph") return;
    var P = pipeOf(S), x = cx(), c = chainAt(P, x), ink = css("--ink"), ink2 = css("--ink-2");
    var F = function(t){ return P.f(P.g(t)); };
    function inV(V){ return x >= V.xmin && x <= V.xmax && c.y >= V.ymin && c.y <= V.ymax; }
    var V = inV(P.home) ? P.home : P.wide && inV(P.wide) ? P.wide : P.home, off = !inV(V);
    var dom = S.pipe === "P2" ? [1.5, 8] : null, lines = [];
    if (isFinite(c.d) && !off) lines.push({ p:[x, c.y], q:[x + 1, c.y + c.d], color:ink, width:2 });
    plot.draw({ view:V, xLabel:"x", yLabel:"y", curves:[{ f:F, color:ink, width:3.4, domain:dom || undefined }], lines:lines,
      points:off ? [] : [{ x:x, y:c.y, r:5.5, color:ink }],
      describe:"Graph of y = " + MV.plain(m(P.ys)) + " with its tangent at x = " + num(x, 1) + ": the point (" + num(x, 1) + ", " + MV.plain(fmt(c.y).t) + "), slope " + (isFinite(c.d) ? MV.plain(fmt(c.d).t) : "undefined") + (off ? ". The point is off the graph's window." : "."),
      after:function(ctx, pl){
        var X = pl.X(x), Y = pl.Y(c.y), lab = "slope = " + (isFinite(c.d) ? MV.plain(fmt(c.d).t) : "undefined");
        if (off) {
          var ex = clamp(X, 14, pl.W - 14), ey = clamp(Y, 14, pl.H - 14), up = Y < 14;
          ctx.save(); ctx.fillStyle = ink; ctx.beginPath();
          if (up) { ctx.moveTo(ex, 4); ctx.lineTo(ex - 7, 16); ctx.lineTo(ex + 7, 16); } else { ctx.moveTo(ex, pl.H - 4); ctx.lineTo(ex - 7, pl.H - 16); ctx.lineTo(ex + 7, pl.H - 16); }
          ctx.fill(); ctx.restore();
          mtext(ctx, "point off the graph: y = " + MV.plain(fmt(c.y).t) + ", " + lab, clamp(ex, 150, pl.W - 150), up ? 30 : pl.H - 30, { align:"center", size:13, color:ink2 });
          return;
        }
        var right = X < pl.W * 0.6;
        mtext(ctx, lab, X + (right ? 14 : -14), clamp(Y - 22, 14, pl.H - 14), { align:right ? "left" : "right" });
      } });
  }
  function paintFig(){
    if (S.mode === "gears") { gt.pose(ct(), tLive != null); $("#ch-gears", host).setAttribute("aria-label", gt.desc(ct())); $("#ch-said", host).innerHTML = tLive == null ? turnSentence() : ""; }
    else if (S.mode === "pipe") { var r = pipeSVG(pipeOf(S), cx(), flow); $("#ch-pipe", host).innerHTML = r.svg; $("#ch-pipe", host).setAttribute("aria-label", r.desc); }
    else drawGraph();
  }
  function paintView(){ syncSliders(); paintFig(); paintRead(); paintEq(); paintKey(); paintFound(); }
  function paintAll(){ paintTop(); if (S.mode === "gears") rebuildGears(); paintView(); }
  function changed(){ noteFound(); api.save(); paintView(); MV.changed(); }

  // ---- gears: Play (one turn of X), Step (a quarter turn), Reset ----
  function stopPlay(){
    if (!playing) return;
    playing(); playing = null;
    if (tLive != null) { S.turns = Math.round(tLive * 1000) / 1000; tLive = null; api.save(); }
    paintView();
  }
  function turnTo(to, dur){
    var from = S.turns;
    playing = MV.tween({ dur:dur, ease:LIN, step:function(t){ tLive = from + (to - from) * t; gt.pose(tLive, true); },
      done:function(){ playing = null; tLive = null; S.turns = Math.round(to * 1000) / 1000; api.save(); paintView(); MV.changed(); } });
    syncSliders();
  }
  function play(){ if (playing) { stopPlay(); return; } var to = Math.floor(S.turns + 1e-9) + 1; turnTo(to, 3000 * (to - S.turns)); }
  function step(){ if (playing) stopPlay(); turnTo(Math.round((S.turns + 0.25) * 1000) / 1000, 650); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (busy) return;
    if (b.dataset.mode) { stopPlay(); S.mode = b.dataset.mode; noteFound(); api.save(); paintAll(); MV.changed(); return; }
    if (b.dataset.pipe) {
      S.pipe = b.dataset.pipe; var P = pipeOf(S);
      if (S.x < P.xr[0] || S.x > P.xr[1]) S.x = S.pipe === "P2" ? 2 : 1;
      if (P.skip0 && near(S.x, 0)) S.x = 1;
      noteFound(); api.save(); paintAll(); MV.changed(); return;
    }
    if (b.id === "ch-play") { play(); return; }
    if (b.id === "ch-step") { step(); return; }
    if (b.id === "ch-reset") { stopPlay(); S.turns = 0; api.save(); paintView(); return; }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (busy) { syncSliders(); return; }
    if (t.id === "ch-a" || t.id === "ch-b") {
      stopPlay(); S[t.id === "ch-a" ? "a" : "b"] = Math.round(+t.value * 2) / 2; S.turns = 0;
      rebuildGears(); changed();
    } else if (t.id === "ch-x") {
      var P = pipeOf(S), v = Math.round(+t.value * 10) / 10;
      if (P.skip0 && near(v, 0)) { v = S.x > 0 ? -0.1 : 0.1; t.value = v; }
      S.x = clamp(v, P.xr[0], P.xr[1]); changed();
    } else if (t.id === "ch-k") { S.k = Math.round(+t.value); changed(); }
  });
  host.addEventListener("keydown", function(e){
    var t = e.target;
    if (t.type === "range" && t.dataset.big && e.shiftKey && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) {
      e.preventDefault();
      var d = /Right|Up/.test(e.key) ? 1 : -1, v = clamp(+t.value + d, +t.min, +t.max);
      if (t.id === "ch-x" && pipeOf(S).skip0 && near(v, 0)) v = clamp(v + d * 0.1, +t.min, +t.max);
      t.value = v; t.dispatchEvent(new Event("input", { bubbles:true }));
      return;
    }
    if ((e.key === " " || e.code === "Space") && S.mode === "gears" && (t.id === "ch-a" || t.id === "ch-b")) { e.preventDefault(); if (!busy) play(); }
  });
  paintAll();

  // ---- predictions ----
  function anim(dur, stepFn, cb, ease){ stop = MV.tween({ dur:dur, ease:ease, step:stepFn, done:function(){ stop = null; if (cb) cb(); } }); }
  function grow(cb){
    anim(1300, function(t){ flow = t; paintFig(); }, function(){ MV.wait(500, function(){ anim(1300, function(t){ flow = 1 + t; paintFig(); }, cb); }); });
  }
  // ---- challenges ----
  function chal(id, opt){
    var M = MS[id];
    if (id === "tc1") {
      if (S.mode === "gears" || S.pipe !== "P1") return { ok:false, msg:M.pipe };
      if (near(S.x, 0, 1e-6)) return { ok:true };
      if (near(Math.abs(S.x), 1, 1e-6)) return { ok:false, msg:M.pm1 };
      if (Math.abs(S.x) <= 0.5 + 1e-9) return { ok:false, msg:M.small };
      return { ok:false, msg:tpl(M.other, { m:fmt(chainAt(PIPES.P1, S.x).d).t }) };
    }
    if (id === "tc2") {
      if (S.mode !== "gears") return { ok:false, msg:M.mode };
      if (!near(S.a, 4)) return { ok:false, msg:M.a };
      if (near(S.b, -0.5)) return { ok:true };
      if (near(S.b, 0.5)) return { ok:false, msg:M.p05 };
      if (near(S.b, -2)) return { ok:false, msg:M.m2 };
      if (near(S.b, -8)) return { ok:false, msg:M.m8 };
      if (near(S.b, 0)) return { ok:false, msg:M.zero };
      var r = S.a * S.b;
      return { ok:false, msg:tpl(M.other, { dir:r > 0 ? "forward" : "backward", r:fmt(Math.abs(r)).t }) };
    }
    if (id === "tc3") {
      if (S.mode !== "graph" || S.pipe !== "K") return { ok:false, msg:M.pipe };
      if (S.k === 0 || S.k === 2) { if (!opt || !opt.live) { S.kFound["k" + S.k] = true; api.save(); MV.wait(0, paintFound); } return { ok:true }; }
      if (S.k === 1) return { ok:false, msg:M.k1 };
      if (S.k === -1) return { ok:false, msg:M.km1 };
      return { ok:false, msg:tpl(M.other, { v:fmt(6 * (1 - S.k) * (1 - S.k)).t }) };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        stopPlay(); busy = true; xLive = null; flow = 2;
        if (p.id === "p1") { S.mode = "gears"; S.a = 3; S.b = 2; S.turns = 0; }
        else if (p.id === "p2") { S.mode = "pipe"; S.pipe = "P1"; S.x = 1; flow = 0; }
        else if (p.id === "p3") { S.mode = "graph"; S.pipe = "P1"; S.x = 0; }
        else if (p.id === "p4") { S.mode = "pipe"; S.pipe = "P2"; S.x = 6; flow = 0; }
        paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; xLive = null; flow = 2; api.save(); paintAll(); MV.changed(); done(); }
        if (p.id === "p1") anim(3200, function(t){ tLive = t; gt.pose(t, true); }, function(){ tLive = null; S.turns = 1; paintView(); MV.wait(700, fin); }, LIN);
        else if (p.id === "p2" || p.id === "p4") grow(function(){ MV.wait(700, fin); });
        else if (p.id === "p3") anim(1800, function(t){ xLive = t; paintView(); }, function(){ xLive = null; S.x = 1; paintView(); MV.wait(700, fin); });
        else fin();
      }
    },
    challenge:function(id, opt){ return chal(id, opt); }
  };
}

// =====================================================================================================================
// @component V8 coefBoxes (copied from MCV4U 10; extended) — structured number entry with no free algebra. A frame in m() source
// with [] slots becomes typeset text with number boxes ("y = []x + []", "([], [])", "[](3x - 1)^[] · []", or {num, den}).
// Boxes take integers, fractions, decimals and √ (MV.parseNum). cbJudge(item, raw[]) compares in order (null in a target or a
// wrong vector is a wildcard), as a set (set:true; a box may hold ±√2/2; blank boxes are skipped), as unordered pairs
// (pairs:true; blankPairs:true drops empty pairs so "how many points" isn't given away) or up to a common factor (scale:true).
// item.wrong:[{v, fb}] gives named feedback. cbAct(host, api, a) is the practice activity (first-try scoring, three-level help).
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
  var n = cbCount(frame || item.frame), vals = [], filled = 0, i;
  for (i = 0; i < n; i++) {
    var s = String(raw[i] == null ? "" : raw[i]).trim();
    if (!s) { vals.push(null); continue; }
    var p = MV.parseNum(s); if (!p || !(p.length === 1 || (item.set && p.length === 2))) return { err:"Type a number in each box, such as 3, −4, 3/5 or √2/2." };
    vals.push(p.length === 1 ? p[0] : p); filled++;
  }
  if (!filled) return { err:n > 1 ? "Fill in the boxes first." : "Type your answer first." };
  if (item.set) { var out = []; vals.forEach(function(v){ if (v !== null) out = out.concat(v); }); return { vals:out }; }
  if (item.pairs && item.blankPairs) {
    var pr = [];
    for (i = 0; i + 1 < n; i += 2) { var a = vals[i], b = vals[i + 1]; if (a === null && b === null) continue; if (a === null || b === null) return { err:"Fill in both coordinates of each point." }; pr.push(a, b); }
    return { vals:pr };
  }
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
  return tg.every(function(t, j){ return t === null || near(vals[j], t, 1e-9 * Math.max(1, Math.abs(t))); });
}
function cbJudge(item, raw, ans, wrong, frame){
  var r = cbParse(item, raw, frame); if (r.err) return r;
  if (item.test ? item.test(r.vals) : cbSame(item, r.vals, ans)) return { ok:true };
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
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + (r.fb || it.general || "Name the outer and inner functions, find both rates, and multiply.") + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}
// ------------------------------------------------- end of V8 coefBoxes --------------------------------------------------

// ---------- Part 3: Outside–inside ----------
// Station 1 is @component V7 layerPeeler — the rule chooser for composites: tap the outer layer, then choose the rules in order
// (outside first, then times the inside's derivative); each right choice writes a line of working, a wrong one gets named
// feedback. Stations 2 and 3 use N13 step-throughs (MV.player, each in a fresh host) with "Check it with algebra" panels and
// V8 boxes for the final forms.
function part3(host, api){
  var S = api.S, C = api.content, PE = C.peel, VE = C.verify, CO = C.combine;
  S.peel = S.peel || { card:0, st:{} }; S.peel.st = S.peel.st || {};
  S.ver = S.ver || {}; S.ver.step = S.ver.step || {}; if (!S.ver.tab) S.ver.tab = VE.tabs[0].id; S.ver.pv = S.ver.pv || [];
  S.com = S.com || {};
  var msg1 = null, msgP = null, msgC = {};
  host.innerHTML =
    '<div class="part p3-st" id="ch-s1"><h3>' + PE.title + "</h3><p>" + PE.text + '</p><div id="ch-s1c"></div></div>' +
    '<div class="part p3-st" id="ch-s2"><h3>' + VE.title + "</h3><p>" + VE.text + '</p><div id="ch-s2t"></div><div id="ch-s2b"></div></div>' +
    '<div class="part p3-st" id="ch-s3"><h3>' + CO.title + "</h3><p>" + CO.text + "</p>" + CO.probs.map(function(p, i){
      return '<div class="ch-prob" data-cp="' + p.id + '"><p class="ch-expr"><span class="ch-pn">' + (i + 1) + ".</span> " + p.expr + '</p><div class="ch-cpick"></div><div class="ch-clines"></div><div class="ch-cbox"></div></div>';
    }).join("") + "</div>";

  // ---- station 1 ----
  function cst(i){ var id = PE.cards[i].id; return S.peel.st[id] || (S.peel.st[id] = { stage:0 }); }
  function paintS1(){
    var i = clamp(S.peel.card | 0, 0, PE.cards.length - 1), c = PE.cards[i], st = cst(i), el = $("#ch-s1c", host);
    MV.keepFocus(el, function(){
      var h = '<div class="chips ch-cards" role="group" aria-label="Cards">' + PE.cards.map(function(cc, j){
        var done = cst(j).stage >= 3;
        return '<button type="button" class="chip' + (j === i ? " on" : "") + '" data-card="' + j + '" data-k="card' + j + '" aria-pressed="' + (j === i) + '">Card ' + (j + 1) + (done ? " ✓" : "") + "</button>";
      }).join("") + "</div>";
      h += '<div class="ch-card"><p class="ch-expr">' + c.expr + "</p>";
      if (st.stage === 0) h += '<p class="ch-ask">1. Tap the outer layer.</p><div class="chips" role="group" aria-label="Layers">' + c.layers.map(function(l, k){
        return '<button type="button" class="chip" data-layer="' + k + '" data-k="layer' + c.id + k + '">' + l.t + "</button>"; }).join("") + "</div>";
      else h += '<p class="ch-okl">✓ Outer layer: ' + c.outerName + "</p>";
      if (st.stage >= 1 && st.stage < 3) h += '<p class="ch-ask">' + (st.stage === 1 ? "2. Choose the first step." : "3. Choose the next step.") + '</p><div class="ch-rules" role="group" aria-label="Rules">' + PE.rules.map(function(r){
        return '<button type="button" class="btn ghost sm" data-rule="' + r.id + '" data-k="rule' + r.id + '">' + r.t + "</button>"; }).join("") + "</div>";
      if (st.stage >= 2) h += '<ol class="ch-work">' + c.lines.slice(0, st.stage - 1).map(function(l, k){ return '<li><span class="ch-wn">' + PE.rules[k].t + ":</span> " + l + "</li>"; }).join("") + "</ol>";
      if (st.stage >= 3) {
        h += MV.fbHTML("good", "<strong>✓ Peeled.</strong> " + c.lines[1] + (c.note ? " " + c.note : ""));
        if (i < PE.cards.length - 1) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-card="' + (i + 1) + '" data-k="cardnext">Next card</button></div>';
      } else if (msg1) h += MV.fbHTML(msg1.bad ? "bad" : "", msg1.html);
      el.innerHTML = h + "</div>";
    });
  }
  function layer(k){
    var c = PE.cards[S.peel.card], st = cst(S.peel.card);
    if (MV.ok(c.layers[k])) { st.stage = 1; msg1 = null; } else msg1 = { bad:true, html:"<strong>✗ Not quite.</strong> " + PE.msgs.wrong };
    api.save(); paintS1(); MV.focusFb($("#ch-s1c", host));
  }
  function rule(id){
    var st = cst(S.peel.card);
    if (st.stage === 1) {
      if (id === "out") { st.stage = 2; msg1 = null; }
      else msg1 = { bad:true, html:"<strong>✗ Not quite.</strong> " + (id === "in" ? PE.msgs.wrong : PE.msgs.mulFirst) };
    } else if (st.stage === 2) {
      if (id === "mul") { st.stage = 3; msg1 = null; }
      else msg1 = { bad:true, html:"<strong>✗ Not quite.</strong> " + PE.msgs.outDone };
    }
    api.save(); paintS1(); MV.focusFb($("#ch-s1c", host));
  }

  // ---- station 2 ----
  function tabOf(){ return VE.tabs.filter(function(t){ return t.id === S.ver.tab; })[0] || VE.tabs[0]; }
  function lineHTML(l){ return '<li><span class="ch-le">' + l.e + '</span> <span class="ch-ln">' + l.n + "</span></li>"; }
  function paintS2(){
    var T = tabOf(), tabs = $("#ch-s2t", host);
    MV.keepFocus(tabs, function(){ tabs.innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Check</span>' + segBtns("vtab", VE.tabs.map(function(t){ return { id:t.id, t:t.t }; }), T.id, "Which check") + "</div>"; });
    var body = $("#ch-s2b", host);
    body.innerHTML = '<ol class="ch-vlines" id="ch-vl" aria-live="polite"></ol><div class="ch-vpl"></div>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><div>' + T.alg + "</div></div></details>" + (T.predict ? '<div class="ch-vpred" id="ch-vpred"></div>' : "");
    var pl = MV.player($(".ch-vpl", body), { count:T.lines.length, interval:1700, label:function(i){ return "Line " + (i + 1) + " of " + T.lines.length; },
      render:function(i){ S.ver.step[T.id] = i; api.save(); $("#ch-vl", body).innerHTML = T.lines.slice(0, i + 1).map(lineHTML).join(""); } });
    var sv = S.ver.step[T.id] | 0; if (sv) pl.go(sv);
    if (T.predict) paintPred();
  }
  function predTest(v){ return near(v[1], 3) && near(v[0] * v[2], 12); }
  function paintPred(){
    var T = tabOf(), el = $("#ch-vpred", host); if (!el) return;
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="ch-ask">' + T.predict + '</p><div class="cb-frame">' + cbHTML(T.frame, S.ver.pv, "vp", S.ver.pok) + "</div>" +
        (S.ver.pok ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + T.message) :
          '<div class="q-actions"><button type="button" class="btn primary sm" data-vp="chk" data-k="vpchk">Check</button></div>' + (msgP ? MV.fbHTML(msgP.bad ? "bad" : "", msgP.html) : ""));
    });
  }
  function checkPred(){
    var T = tabOf(), r = cbJudge({ test:predTest }, S.ver.pv, MV.ans(T), T.wrong, T.frame);
    if (r.err) msgP = { bad:false, html:r.err };
    else if (r.ok) { S.ver.pok = true; msgP = null; }
    else msgP = { bad:true, html:"<strong>✗ Not quite.</strong> " + (r.fb || T.general) + " Try again." };
    api.save(); paintPred(); MV.focusFb($("#ch-vpred", host));
  }

  // ---- station 3 ----
  function pst(p){ return S.com[p.id] || (S.com[p.id] = { pick:null, step:0, v:[], ok:false }); }
  function unlocked(p){ var st = pst(p); return !p.choices || (st.pick != null && MV.ok(p.choices[st.pick])); }
  function pbox(p){ return $('[data-cp="' + p.id + '"]', host); }
  function paintPick(p){
    var el = $(".ch-cpick", pbox(p)), st = pst(p); if (!p.choices) { el.innerHTML = ""; return; }
    var done = unlocked(p);
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="ch-ask">' + p.ask + '</p><div class="chips" role="group" aria-label="' + MV.esc(MV.plain(p.ask)) + '">' + p.choices.map(function(c, i){
        return '<button type="button" class="chip' + (st.pick === i ? " on" : "") + '" data-cpick="' + i + '" data-k="cp' + p.id + i + '" aria-pressed="' + (st.pick === i) + '"' + (done ? " disabled" : "") + ">" + c.t + "</button>";
      }).join("") + "</div>" + (st.pick == null ? "" : MV.fbHTML(MV.ok(p.choices[st.pick]) ? "good" : "bad", (MV.ok(p.choices[st.pick]) ? "" : "<strong>✗ Not quite.</strong> ") + p.choices[st.pick].fb));
    });
  }
  function buildLines(p){
    var el = $(".ch-clines", pbox(p)), st = pst(p);
    if (!unlocked(p)) { el.innerHTML = ""; return; }
    if (el.dataset.built) return;
    el.dataset.built = "1";
    el.innerHTML = '<ol class="ch-vlines" aria-live="polite"></ol><div class="ch-cpl"></div>';
    var ol = $("ol", el), pl = MV.player($(".ch-cpl", el), { count:p.lines.length, interval:1700, label:function(i){ return "Line " + (i + 1) + " of " + p.lines.length; },
      render:function(i){ st.step = Math.max(st.step | 0, i); api.save(); ol.innerHTML = p.lines.slice(0, i + 1).map(lineHTML).join(""); paintBox(p, i); } });
    if (st.step) pl.go(st.step);
  }
  function paintBox(p, cur){
    var el = $(".ch-cbox", pbox(p)), st = pst(p);
    if (!unlocked(p) || (!st.ok && (st.step | 0) < p.lines.length - 1)) { el.innerHTML = ""; return; }
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="ch-ask">' + p.finish + '</p><div class="cb-frame">' + m("y′ = ") + " " + cbHTML(p.frame, st.v, "cb" + p.id, st.ok) + "</div>" +
        (st.ok ? MV.fbHTML("good", "<strong>✓ Correct: " + p.display + ".</strong>") :
          '<div class="q-actions"><button type="button" class="btn primary sm" data-cchk="' + p.id + '" data-k="cchk' + p.id + '">Check</button></div>' + (msgC[p.id] ? MV.fbHTML(msgC[p.id].bad ? "bad" : "", msgC[p.id].html) : ""));
    });
    void cur;
  }
  function checkBox(p){
    var st = pst(p), r = cbJudge({}, st.v, MV.ans(p), p.wrong, p.frame);
    if (r.err) msgC[p.id] = { bad:false, html:r.err };
    else if (r.ok) { st.ok = true; msgC[p.id] = null; }
    else msgC[p.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + (r.fb || p.general) + " Try again." };
    api.save(); paintBox(p); MV.focusFb($(".ch-cbox", pbox(p)));
  }
  function paintS3(){ CO.probs.forEach(function(p){ paintPick(p); buildLines(p); paintBox(p); }); }

  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || t.dataset.bi == null) return;
    var cp = t.closest("[data-cp]");
    if (cp) pst(CO.probs.filter(function(p){ return p.id === cp.dataset.cp; })[0]).v[+t.dataset.bi] = t.value;
    else if (t.closest("#ch-vpred")) S.ver.pv[+t.dataset.bi] = t.value;
    api.save();
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || e.target.dataset.bi == null) return;
    var wrap = e.target.closest("[data-cp]") || e.target.closest("#ch-vpred"), b = wrap && wrap.querySelector("button[data-cchk], button[data-vp]");
    if (b) { e.preventDefault(); b.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.card != null) { S.peel.card = +b.dataset.card; msg1 = null; api.save(); paintS1(); if (b.dataset.k === "cardnext") { var nb = $('#ch-s1c [data-card="' + S.peel.card + '"]', host); if (nb) nb.focus(); } return; }
    if (b.dataset.layer != null) { layer(+b.dataset.layer); return; }
    if (b.dataset.rule) { rule(b.dataset.rule); return; }
    if (b.dataset.vtab) { S.ver.tab = b.dataset.vtab; msgP = null; api.save(); paintS2(); return; }
    if (b.dataset.vp) { checkPred(); return; }
    if (b.dataset.cpick != null) {
      var p = CO.probs.filter(function(x){ return x.id === b.closest("[data-cp]").dataset.cp; })[0];
      pst(p).pick = +b.dataset.cpick; api.save(); paintPick(p); buildLines(p); paintBox(p); MV.focusFb($(".ch-cpick", pbox(p))); return;
    }
    if (b.dataset.cchk) { checkBox(CO.probs.filter(function(x){ return x.id === b.dataset.cchk; })[0]); }
  });
  paintS1(); paintS2(); paintS3();
  return {};
}

// ---------- performance task: Three flat spots ----------
var task = (function(){
  var api, plot, C;
  function gi(k){ var s = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"); if (s === "") return null; var v = Number(s); return Number.isInteger(v) && v >= -10 && v <= 10 ? v : NaN; }
  function read(){ var b = gi("b"), c = gi("c"), n = +(api && api.S.n); return { b:b, c:c, n:n, ok:Number.isInteger(b) && Number.isInteger(c) && [2, 3, 4].indexOf(n) >= 0 }; }
  function sg(v){ return (v < 0 ? MINUS : "") + Math.abs(v); }
  function inside(b, c){ return "x^2" + (b ? (b < 0 ? " - " : " + ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x" : "") + (c ? (c < 0 ? " - " : " + ") + Math.abs(c) : ""); }
  function lin(b){ return "2x" + (b ? (b < 0 ? " - " : " + ") + Math.abs(b) : ""); }
  function fr(n, d){ var q = MV.mcv.Q.of(n, d); return MV.mcv.Q.txt(q); }
  function flats(d){
    var out = [{ v:-d.b / 2, t:fr(-d.b, 2) }], disc = d.b * d.b - 4 * d.c;
    if (disc > 0) {
      var kf = MV.mcv.kfree(disc, 2), s = kf[0], r = kf[1];
      if (r === 1) [-1, 1].forEach(function(sn){ out.push({ v:(-d.b + sn * s) / 2, t:fr(-d.b + sn * s, 2) }); });
      else {
        var t = (s % 2 === 0 && d.b % 2 === 0) ? (d.b ? fr(-d.b, 2) + " ± " : "±") + (s / 2 === 1 ? "" : s / 2) + "√" + r : "(" + sg(-d.b) + " ± " + (s === 1 ? "" : s) + "√" + r + ")/2";
        [-1, 1].forEach(function(sn){ out.push({ v:(-d.b + sn * s * Math.sqrt(r)) / 2, t:null, pm:t }); });
      }
    }
    return out.sort(function(a, b){ return a.v - b.v; });
  }
  function flatTxt(L){
    var seen = {}, parts = [];
    L.forEach(function(z){ if (z.t) parts.push(z.t); else if (!seen[z.pm]) { seen[z.pm] = 1; parts.push(z.pm + " (≈ " + num(L.filter(function(w){ return w.pm === z.pm; })[0].v, 2) + " and " + num(L.filter(function(w){ return w.pm === z.pm; })[1].v, 2) + ")"); } });
    return parts.join(", ");
  }
  function draw(){
    var d = read(), ink = css("--ink"), pen = css("--pen");
    if (!d.ok) { plot.draw({ view:{ xmin:-6, xmax:6, ymin:-10, ymax:30 }, describe:"Enter whole numbers from −10 to 10 for b and c, and choose n, to draw the graph." }); return; }
    var Y = function(x){ return Math.pow(x * x + d.b * x + d.c, d.n); }, L = flats(d);
    var keys = L.map(function(z){ return z.v; }).concat([0]);
    var x0 = Math.min.apply(null, keys) - 1.2, x1 = Math.max.apply(null, keys) + 1.2;
    if (x1 - x0 < 6) { var mid = (x0 + x1) / 2; x0 = mid - 3; x1 = mid + 3; }
    var ys = keys.map(Y).concat([0]), lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys), span = hi - lo || 4, pad = span * 0.25;
    var V = { xmin:x0, xmax:x1, ymin:lo - pad, ymax:hi + pad }, hw = (x1 - x0) * 0.06;
    plot.draw({ view:V, xLabel:"x", yLabel:"y", curves:[{ f:Y, color:pen, width:3 }],
      segments:L.map(function(z){ return { x1:z.v - hw, y1:Y(z.v), x2:z.v + hw, y2:Y(z.v), color:ink, width:2.4 }; }),
      points:L.map(function(z){ return { x:z.v, y:Y(z.v), r:5, color:ink }; }).concat([{ x:0, y:Y(0), r:4.5, color:pen, open:true }]),
      describe:"y = (" + MV.plain(m(inside(d.b, d.c))) + ")^" + d.n + ". Horizontal tangents at x = " + MV.plain(flatTxt(L)) + ". y-intercept " + sg(Math.pow(d.c, d.n)) + ".",
      after:function(ctx, pl){ mtext(ctx, "(0, " + sg(Math.pow(d.c, d.n)) + ")", pl.X(0) + 10, clamp(pl.Y(Y(0)) - 16, 14, pl.H - 14), { size:13, color:pen }); } });
  }
  function readout(){
    var d = read(), el = $("#ch-tkread"); if (!el) return;
    $("#ch-tkeq").innerHTML = d.ok ? m("y = (" + inside(d.b, d.c) + ")^" + d.n) : m("y = (x^2 + bx + c)^n");
    if (!d.ok) { el.innerHTML = MV.readoutHTML([["", "Choose whole numbers from −10 to 10 for " + m("b") + " and " + m("c") + ", and choose " + m("n") + "."]]); return; }
    var L = flats(d);
    el.innerHTML = MV.readoutHTML([
      [m("y′"), m(d.n + "(" + inside(d.b, d.c) + ")" + (d.n - 1 > 1 ? "^" + (d.n - 1) : "") + "(" + lin(d.b) + ")")],
      ["Horizontal tangents", L.length + " (at " + m("x") + " = " + flatTxt(L) + ")"],
      [m("y") + " at " + m("x = 0"), m("c^n") + " = " + m("(" + sg(d.c) + ")^" + d.n) + " = " + sg(Math.pow(d.c, d.n))]
    ]);
  }
  function upd(){ draw(); readout(); api.update(); }
  function nBtns(){ return '<div class="ch-tkrow"><span class="ch-tklab">' + m("n") + '</span><span class="chips" role="group" aria-label="n">' + [2, 3, 4].map(function(v){
    var on = +api.S.n === v; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-tkn="' + v + '" data-k="tkn' + v + '" aria-pressed="' + on + '">' + v + "</button>"; }).join("") + "</span></div>"; }
  return {
    render:function(inp, pv, a){
      api = a; C = a.content;
      if (a.S.b == null) a.S.b = "0"; if (a.S.c == null) a.S.c = "0"; if ([2, 3, 4].indexOf(+a.S.n) < 0) a.S.n = 2;
      inp.innerHTML = '<div class="ch-tk">' + ["b", "c"].map(function(k){
        return '<div class="ch-tkrow"><span class="ch-tklab">' + m(k) + '</span><button type="button" class="btn ghost sm" data-tk="' + k + '" data-d="-1" data-k="tk' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + '</button>' +
          '<input class="numin short" id="ch-tk' + k + '" data-tkin="' + k + '" type="number" min="-10" max="10" step="1" aria-label="' + k + ', a whole number from −10 to 10">' +
          '<button type="button" class="btn ghost sm" data-tk="' + k + '" data-d="1" data-k="tk' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
      }).join("") + '<div id="ch-tkn"></div></div>';
      pv.innerHTML = '<p class="ch-tkeq" id="ch-tkeq"></p><div class="plot-wrap"><canvas class="plot" id="ch-tkplot" role="img" aria-label="Graph of your design"></canvas></div><dl class="read" id="ch-tkread" aria-live="polite"></dl>';
      ["b", "c"].forEach(function(k){ $("#ch-tk" + k).value = a.S[k]; });
      $("#ch-tkn").innerHTML = nBtns();
      plot = new MV.Plot($("#ch-tkplot"), { xmin:-6, xmax:6, ymin:-10, ymax:10 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tkin; if (!k) return; a.S[k] = e.target.value; a.save(); upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.tkn) { a.S.n = +b.dataset.tkn; a.save(); MV.keepFocus($("#ch-tkn"), function(){ $("#ch-tkn").innerHTML = nBtns(); }); upd(); return; }
        if (!b.dataset.tk) return;
        var k = b.dataset.tk, v = Number(String(a.S[k]).replace(/−/g, "-")); if (!Number.isInteger(v)) v = 0;
        v = clamp(v + Number(b.dataset.d), -10, 10); a.S[k] = String(v); $("#ch-tk" + k).value = v; a.save(); upd();
      });
      // after four different answers, add the plan's narrowing note under the toolkit's success message
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var st = MV.taskState(), g = $("#task-fb .fb.good");
        if (g && st.found.length >= 4 && C.after4 && !g.querySelector(".ch-after4")) g.insertAdjacentHTML("beforeend", '<p class="ch-after4">' + C.after4 + "</p>");
      }, 0); });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.ok ? true : "Choose whole numbers from −10 to 10 for " + m("b") + " and " + m("c") + ", and choose " + m("n") + "."; },
    checks:function(d){ if (!d.ok) return [false, false, false]; return [Math.pow(d.c, d.n) === 16, d.b * d.b - 4 * d.c > 0, -d.b / 2 === 1 || 1 + d.b + d.c === 0]; },
    key:function(d){ return d.b + "," + d.c + "," + d.n; },
    label:function(k){ var s = k.split(",").map(Number); return m("(" + inside(s[0], s[1]) + ")^" + s[2]); },
    text:function(k){ var s = k.split(",").map(Number); return MV.plain(m("(" + inside(s[0], s[1]) + ")^" + s[2])); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ slopes:cbAct },
  task:task
});
})();
