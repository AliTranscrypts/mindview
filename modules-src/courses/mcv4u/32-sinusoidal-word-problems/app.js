// MCV4U 32 Sinusoidal Word Problems: hero (a wheel turns, its height and rate graphs draw in step), Ride the model (Explore:
// V9 motion track adapted to a wheel, a harbour post and a sun arc beside V5 linked panels for the model, its rate and h″),
// Optimization with angles (Part 3: V10 shape stage, two stations), Rates and times (Practice 2, V8 π/√ boxes) and the
// "Design a Ferris wheel" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var PI = Math.PI, TAU = 2 * PI, STEP = PI / 12, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol) * Math.max(1, Math.abs(b)); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, a){ return String(s).replace(/#(\d)/g, function(_, k){ return a[k - 1] != null ? a[k - 1] : "#" + k; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
// fixed decimals with a true minus ("0.50", "−0.91")
function fx(v, dp){ var s = (Math.abs(v) < 0.5 * Math.pow(10, -dp) ? 0 : v).toFixed(dp); return s.replace("-", MINUS); }
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
function arrowHead(ctx, x1, y1, x2, y2, col, s){
  var a = Math.atan2(y2 - y1, x2 - x1); s = s || 11;
  ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - s * Math.cos(a - 0.42), y2 - s * Math.sin(a - 0.42)); ctx.lineTo(x2 - s * Math.cos(a + 0.42), y2 - s * Math.sin(a + 0.42));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function seg(ctx, x1, y1, x2, y2, col, w, dash, alpha){
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.lineCap = "round"; if (dash) ctx.setLineDash(dash); if (alpha != null) ctx.globalAlpha = alpha;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}
function niceCeil(v){ var s = MV.niceStep(v / 4); return Math.ceil(v / s - 1e-9) * s; }

// =====================================================================================================================
// @component N12 exactTrig (trimmed from MCV4U 29 / MHF4U 26) — exact sin and cos at multiples of π/6 and π/4 as surd term
// lists [n, d, r] (n/d · √r), sums, scaling, products (mul) and m() sources ("√3/2", "12 − 5√3").
var TR = (function(){
  var SIN = { 0:[], 2:[[1, 2, 1]], 3:[[1, 2, 2]], 4:[[1, 2, 3]], 6:[[1, 1, 1]] }, COS = { 0:[[1, 1, 1]], 2:[[1, 2, 3]], 3:[[1, 2, 2]], 4:[[1, 2, 1]], 6:[] };
  function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function twelfths(t){ var q = t / STEP, n = Math.round(q); return Math.abs(q - n) < 1e-7 ? n : null; }
  function special(t){
    var n = twelfths(t); if (n == null) return null;
    var a = ((n % 24) + 24) % 24; if (a % 2 && a % 3) return null;
    var mm = a % 12, ref = mm <= 6 ? mm : 12 - mm, ss = Math.sign(Math.round(Math.sin(a * STEP) * 1e9)), cs = Math.sign(Math.round(Math.cos(a * STEP) * 1e9));
    function sg(list, s){ return list.map(function(q){ return [q[0] * s, q[1], q[2]]; }); }
    return { sin:sg(SIN[ref], ss), cos:sg(COS[ref], cs) };
  }
  function norm(list){
    var out = [];
    list.forEach(function(q){
      var o = out.filter(function(z){ return z[2] === q[2]; })[0];
      if (o) { o[0] = o[0] * q[1] + q[0] * o[1]; o[1] = o[1] * q[1]; } else out.push([q[0], q[1], q[2]]);
    });
    return out.map(function(q){ var g = gcd(q[0], q[1]); return [q[0] / g, q[1] / g, q[2]]; }).filter(function(q){ return q[0] !== 0; });
  }
  function scale(list, n, d){ return norm(list.map(function(q){ return [q[0] * n, q[1] * (d || 1), q[2]]; })); }
  function mul(A, B){
    var out = [];
    A.forEach(function(a){ B.forEach(function(b){
      var n = a[0] * b[0], d = a[1] * b[1], r;
      if (a[2] === b[2]) { n *= a[2]; r = 1; } else if (a[2] === 1) r = b[2]; else if (b[2] === 1) r = a[2]; else r = a[2] * b[2];
      out.push([n, d, r]);
    }); });
    return norm(out);
  }
  function src(list){
    list = norm(list); if (!list.length) return "0";
    return list.map(function(q, i){
      var n = Math.abs(q[0]), d = q[1], body;
      if (q[2] === 1) body = d === 1 ? String(n) : n + "/" + d;
      else body = (n === 1 ? "" : n) + "√" + q[2] + (d === 1 ? "" : "/" + d);
      return (i === 0 ? (q[0] < 0 ? "-" : "") : (q[0] < 0 ? " - " : " + ")) + body;
    }).join("");
  }
  // the same terms, each multiplied by π: "π√3/6", "-π/2", "2π/3"
  function piSrc(list){
    list = norm(list); if (!list.length) return "0";
    return list.map(function(q, i){
      var n = Math.abs(q[0]), d = q[1], body = (n === 1 ? "" : n) + "π" + (q[2] === 1 ? "" : "√" + q[2]) + (d === 1 ? "" : "/" + d);
      return (i === 0 ? (q[0] < 0 ? "-" : "") : (q[0] < 0 ? " - " : " + ")) + body;
    }).join("");
  }
  function rad(list){ return norm(list).some(function(q){ return q[2] !== 1; }); }
  return { special:special, norm:norm, scale:scale, mul:mul, src:src, piSrc:piSrc, rad:rad };
})();
// a rational multiple of π as m() source: {n:1, d:3} -> "π/3", {n:-1, d:2} -> "-π/2", {n:3, d:1} -> "3π"
function piQ(q){ if (!q.n) return "0"; var a = Math.abs(q.n); return (q.n < 0 ? "-" : "") + (a === 1 ? "" : a) + "π" + (q.d === 1 ? "" : "/" + q.d); }
// ------------------------------------------------- end of N12 exactTrig -------------------------------------------------------

// =====================================================================================================================
// @component V8 piExact (copied from MCV4U 29; adds ² and ³) — exact numbers typed with fractions, √ and π (no variables):
// "π√3/6", "-2π^2", "2π²", "20√2", "sqrt3", "pi/6". √ binds to the next factor.
//   piParse(str) -> { v, dec (a decimal point was typed) } or null;  piList(str) -> [{v, dec}] (commas, "and", "or") or null
function piParse(raw){
  var s = String(raw == null ? "" : raw).toLowerCase().replace(/[−–—]/g, "-").replace(/[·×]/g, "*").replace(/sqrt/g, "√").replace(/pi/g, "π")
    .replace(/²/g, "^2").replace(/³/g, "^3").replace(/\s+/g, "");
  if (!s) return null;
  var i = 0, dec = false;
  function pk(){ return s[i]; }
  function starts(c){ return c != null && (/[0-9.(π√]/.test(c)); }
  function expr(){ var v = term(); while (pk() === "+" || pk() === "-") { var o = s[i++], w = term(); v = o === "+" ? v + w : v - w; } return v; }
  function term(){
    var v = un();
    for (;;) {
      var c = pk();
      if (c === "*" || c === "/") { i++; var w = un(); v = c === "*" ? v * w : v / w; }
      else if (starts(c)) v = v * pw();
      else break;
    }
    return v;
  }
  function un(){ if (pk() === "-") { i++; return -un(); } if (pk() === "+") { i++; return un(); } return pw(); }
  function pw(){ var b = at(); if (pk() === "^") { i++; return Math.pow(b, un()); } return b; }
  function at(){
    var c = pk();
    if (c === "(") { i++; var v = expr(); if (pk() !== ")") throw 0; i++; return v; }
    if (c === "π") { i++; return PI; }
    if (c === "√") { i++; var a = pw(); if (!(a >= 0)) throw 0; return Math.sqrt(a); }
    var mm = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)); if (!mm) throw 0;
    if (mm[0].indexOf(".") >= 0) dec = true;
    i += mm[0].length; return parseFloat(mm[0]);
  }
  try { var v = expr(); if (i !== s.length || !isFinite(v)) return null; return { v:v, dec:dec }; } catch (e) { return null; }
}
function piList(raw){
  var parts = String(raw || "").split(/[,;]|\bor\b|\band\b/).map(function(t){ return t.replace(/^\s*[a-z]\s*=\s*/i, "").trim(); }).filter(Boolean);
  if (!parts.length) return null;
  var out = [];
  for (var k = 0; k < parts.length; k++) { var r = piParse(parts[k]); if (!r) return null; if (!out.some(function(u){ return near(u.v, r.v); })) out.push(r); }
  return out;
}
// ------------------------------------------------- end of V8 piExact ----------------------------------------------------------

function boxHTML(k, val, label, cls, dis){
  return '<input class="numin short' + (cls ? " " + cls : "") + '" data-bx="' + k + '" data-k="bx' + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(val || "") + '"' + (dis ? " disabled" : "") + ">";
}

// =====================================================================================================================
// @component V9 motionTrack (wheel mode; adapted from MCV4U 03 / 15) — a Ferris wheel on a ground line, drawn in metres on a
// fixed scale (o.top metres fill the canvas height): the A-frame, the axle-height line (--p-c dashes), the radius to the rider
// (--acol, the amplitude role), the rider (--pen), and the velocity arrow (--ink, steady length) with its vertical part
// (--f3, the rate h′). o = {r, H, T, t, top, vel, lab, grey}. Boarding is at the bottom: θ = 2πt/T from the lowest point.
function wheelPic(p, o){
  p.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, after:function(ctx){
    var W = p.W, Hh = p.H, y0 = Hh - 14, s = (Hh - 30) / o.top, cx = W / 2, cy = y0 - o.H * s, R = o.r * s, th = TAU * o.t / o.T;
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3"), ac = css("--acol"), pc = css("--p-c");
    seg(ctx, 6, y0, W - 6, y0, ink2, 2);
    var leg = Math.max(R * 0.55, 16);
    seg(ctx, cx - leg, y0, cx, cy, ink2, 3); seg(ctx, cx + leg, y0, cx, cy, ink2, 3);
    seg(ctx, 6, cy, W - 6, cy, pc, 1.6, [6, 5]);
    for (var k = 0; k < 8; k++) { var a = th + k * PI / 4; seg(ctx, cx, cy, cx + R * Math.sin(a), cy + R * Math.cos(a), ink2, 1, null, 0.45); }
    ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke(); ctx.restore();
    var x = cx + R * Math.sin(th), y = cy + R * Math.cos(th);
    seg(ctx, cx, cy, x, y, ac, 3);
    ctx.save(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, TAU); ctx.fill(); ctx.restore();
    if (o.vel) {
      var L = clamp(R * 0.75, 26, 52), ux = Math.cos(th), uy = -Math.sin(th);
      seg(ctx, x, y, x + L * ux, y + L * uy, ink, 2.2); arrowHead(ctx, x, y, x + L * ux, y + L * uy, ink, 10);
      if (Math.abs(uy * L) > 4) { seg(ctx, x, y, x, y + uy * L, f3, 3.4); arrowHead(ctx, x, y, x, y + uy * L, f3, 10); }
    }
    ctx.save(); ctx.fillStyle = pen; ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    if (o.lab) {
      bgText(ctx, "H = " + num(o.H, 1) + " m", W - 8, cy - 13, "right", pc, ui(12, 700));
      bgText(ctx, "r = " + num(o.r, 1) + " m", (cx + x) / 2 + (Math.sin(th) >= 0 ? -10 : 10), (cy + y) / 2 - 12, Math.sin(th) >= 0 ? "right" : "left", ac, ui(12, 700));
      bgText(ctx, "h = " + fx(o.H - o.r * Math.cos(th), 1) + " m", 8, 14, "left", pen, ui(13, 700));
    }
  } });
}
// ------------------------------------------------- end of V9 motionTrack (wheel) -------------------------------------------------

// ---------- hero: the wheel turns; h (pen) and h′ (teal) draw in step; "fastest" pulses at the axle height, "h′ = 0" at the top ----------
function hero(f){
  var fig = f.fig || document, cw = fig.querySelector("#hero-wheel"), cp = f.canvas || fig.querySelector("#hero-plot"), cd = fig.querySelector("#hero-d");
  if (!cw || !cp || !cd) return;
  var HC = (MV.C.hero || {}).cap || {};
  var VH = { xmin:-4, xmax:63, ymin:-3, ymax:25 }, VD = { xmin:-4, xmax:63, ymin:-1.6, ymax:1.6 };
  var pw = new MV.Plot(cw, { xmin:0, xmax:1, ymin:0, ymax:1 }), ph = new MV.Plot(cp, VH), pd = new MV.Plot(cd, VD), st = { t:0, done:false };
  function h(t){ return 12 - 10 * Math.cos(PI * t / 30); }
  function d(t){ return PI / 3 * Math.sin(PI * t / 30); }
  function draw(){
    var t = st.t, pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), pc = css("--p-c");
    wheelPic(pw, { r:10, H:12, T:60, t:t, top:24, vel:true, lab:false });
    ph.draw({ view:VH, xTicks:{ step:15 }, yTicks:{ step:6 }, xLabel:"t", segments:[{ x1:0, y1:12, x2:60, y2:12, color:pc, width:1.5, dash:[6, 5] }],
      curves:t > 0.05 ? [{ f:h, color:pen, width:3, domain:[0, t] }] : [], points:[{ x:t, y:h(t), r:5, color:pen }],
      after:function(ctx, p){ bgText(ctx, "height h", p.X(-3), p.Y(22.5), "left", pen, ui(12, 700)); },
      describe:"Height graph h(t) = 12 − 10 cos(πt/30) drawn to t = " + num(t, 0) + " s; the axle height 12 m is dashed." });
    var pts = [{ x:t, y:d(t), r:5, color:f3 }], pulse = 1 - Math.min(1, Math.abs(t - 15) / 4);
    if (t >= 15) pts.push({ x:15, y:PI / 3, r:5 + (st.done ? 0 : 3 * pulse), color:f3, ring:true });
    if (t >= 30) pts.push({ x:30, y:0, r:5, color:ink, ring:true });
    pd.draw({ view:VD, xTicks:{ step:15 }, yTicks:{ step:1 }, xLabel:"t", curves:t > 0.05 ? [{ f:d, color:f3, width:2.8, domain:[0, t] }] : [], points:pts,
      after:function(ctx, p){
        bgText(ctx, "rate h′", p.X(-3), p.Y(1.35), "left", f3, ui(12, 700));
        if (t >= 15) bgText(ctx, "fastest", p.X(15) + 12, p.Y(PI / 3) + 4, "left", f3, ui(13, 700));
        if (t >= 30) bgText(ctx, "h′ = 0", p.X(30) + 10, p.Y(0) + 18, "left", ink, ui(13, 700));
      },
      describe:"Rate graph h′(t) = (π/3) sin(πt/30)" + (t >= 15 ? ", fastest at t = 15 s where the rider is level with the axle" : "") + (t >= 30 ? ", and h′ = 0 at the top, t = 30 s." : ".") });
    pw.describe("A Ferris wheel of radius 10 m with its axle 12 m up. The rider is at height " + fx(h(t), 1) + " m.");
    if (f.cap) f.cap.innerHTML = MV.md(t >= 30 ? HC.end : HC.start);
  }
  pw.render = draw; ph.render = draw; pd.render = draw;
  function finalFrame(){ st = { t:60, done:true }; draw(); }
  if (MV.reduceMotion) { finalFrame(); return; }
  draw();
  MV.wait(500, function(){ MV.tween({ dur:7000, ease:function(x){ return x; }, step:function(x){ st.t = 60 * x; draw(); }, done:finalFrame }); });
}

// =====================================================================================================================
// ---------- Explore: Ride the model ----------
// @component V5 derivativePanels (adapted from MCV4U 07 / 29: linked model, rate and f″ panels on one time axis, one probe)
// for a sinusoidal model y = c + A·fn(k(t − sh)). The model is --pen, its rate --f3, f″ --ink long dashes (rule 7: the magenta
// axis slider is on screen), points of inflection --ink dots. Exact readouts at special angles through N12 exactTrig.
function scModel(S, sc, ov){
  var o;
  if (sc === "tide") o = { id:"tide", nm:"d", c:5, A:3, fn:"cos", k:PI / 6, sh:0, tmax:24, step:0.25, dp:2, speed:2, yv:[-0.6, 9.8], xt:3, yt:2, u:{ t:"h", y:"m", r:"m/h" },
    model:"d(t) = @a{3} cos(πt/6) + @c{5}", arg:"(πt/6)", q:[1, 6] };
  else if (sc === "daylight") o = { id:"daylight", nm:"L", c:12, A:4, fn:"sin", k:TAU / 365, sh:80, tmax:365, step:5, dp:0, speed:30, yv:[-0.8, 17.5], xt:50, yt:4, u:{ t:"days", y:"h", r:"h/day" },
    model:"L(t) = @a{4} sin[2π(t - 80)/365] + @c{12}", arg:"[2π(t - 80)/365]", q:[2, 365] };
  else {
    var r = ov && ov.r != null ? ov.r : S.r, H = ov && ov.H != null ? ov.H : S.H, T = ov && ov.T != null ? ov.T : S.T;
    o = { id:"ferris", nm:"h", c:H, A:-r, fn:"cos", k:TAU / T, sh:0, tmax:120, step:1, dp:0, speed:10, yv:[-1, 42], xt:20, yt:10, u:{ t:"s", y:"m", r:"m/s" },
      model:"h(t) = @c{" + num(H, 1) + "} - @a{" + num(r, 1) + "} cos(πt/" + num(T / 2, 1) + ")", arg:"(πt/" + num(T / 2, 1) + ")", q:[2, T], r:r, H:H, T:T };
  }
  o.th = function(t){ return o.k * (t - o.sh); };
  o.f = function(t){ var a = o.th(t); return o.c + o.A * (o.fn === "cos" ? Math.cos(a) : Math.sin(a)); };
  o.d1 = function(t){ var a = o.th(t); return o.fn === "cos" ? -o.A * o.k * Math.sin(a) : o.A * o.k * Math.cos(a); };
  o.d2 = function(t){ var a = o.th(t); return -o.A * o.k * o.k * (o.fn === "cos" ? Math.cos(a) : Math.sin(a)); };
  o.fast = Math.abs(o.A) * o.k;
  o.infl = [];
  for (var n = -2; n < 400; n++) { var tt = o.sh + ((o.fn === "cos" ? PI / 2 : 0) + n * PI) / o.k; if (tt > o.tmax + 1e-9) break; if (tt >= -1e-9) o.infl.push(tt); }
  return o;
}
// exact rate coefficient R (a rational multiple of π): rate = Rπ · g(θ), g = sin for a cos model, cos for a sin model
function rateQ(o){ return Q.mul(Q.of(o.A * (o.fn === "cos" ? -1 : 1)), Q.of(o.q[0], o.q[1])); }
function rateSrc(o){ var R = rateQ(o), a = Q.abs(R), body = piQ(a); if (a.d > 1) body = "(" + body + ")"; return o.nm + "′(t) = " + (R.n < 0 ? "-" : "") + body + " " + (o.fn === "cos" ? "sin" : "cos") + o.arg; }
function valNow(o, t){
  var v = o.f(t), sp = TR.special(o.th(t));
  if (!sp) return "≈ " + fx(v, 2);
  var list = TR.norm([[o.c, 1, 1]].concat(TR.scale(o.fn === "cos" ? sp.cos : sp.sin, o.A)));
  return m(TR.src(list)) + (TR.rad(list) ? " ≈ " + fx(v, 2) : "");
}
function rateNow(o, t){
  var v = o.d1(t), sp = TR.special(o.th(t));
  if (!sp) return "≈ " + fx(v, 2);
  var R = rateQ(o), list = TR.scale(o.fn === "cos" ? sp.sin : sp.cos, R.n, R.d);
  return list.length ? m(TR.piSrc(list)) + " ≈ " + fx(v, 2) : "0";
}
function stateOf(o, t){
  var v = o.d1(t);
  if (Math.abs(v) <= 0.025 * o.fast) return o.d2(t) < 0 ? "max" : "min";
  if (Math.abs(v) >= 0.99 * o.fast) return v > 0 ? "riseF" : "fallF";
  return v > 0 ? "rise" : "fall";
}
function tTxt(o, t){ return o.id === "daylight" ? "day " + num(t, 0) : m("t = " + num(t, o.dp)) + " " + o.u.t; }

function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["ferris", "tide", "daylight"].indexOf(S.sc) < 0) S.sc = "ferris";
  if (!(Number.isInteger(S.r) && S.r >= 5 && S.r <= 15)) S.r = 10;
  if (!(Number.isInteger(S.T) && S.T >= 20 && S.T <= 120 && S.T % 10 === 0)) S.T = 60;
  if (!(Number.isInteger(S.H) && S.H >= S.r + 1 && S.H <= 25)) S.H = Math.max(12, S.r + 1);
  if (!S.tt || typeof S.tt !== "object") S.tt = {};
  ["ferris", "tide", "daylight"].forEach(function(id){ var o = scModel(S, id); var v = S.tt[id]; if (typeof v !== "number" || !(v >= 0 && v <= o.tmax)) S.tt[id] = id === "daylight" ? 80 : id === "tide" ? 2 : 10; });
  if (typeof S.rate !== "boolean") S.rate = true;
  S.conc = !!S.conc;
  var busy = false, playing = null, hl = null, anim = null, stop = null, more = false;

  function pan(id, cap){ return '<div class="sr-pan" id="sr-p' + id + '"><p class="sr-pcap" id="sr-cap' + id + '">' + cap + '</p><div class="plot-wrap"><canvas class="plot sr-pc' + (id === "2" ? " sr-pc2" : "") + '" id="sr-c' + id + '" role="img" aria-label="Graph"></canvas></div></div>'; }
  function sl(id, label, min, max, step, col){
    return '<label class="slider sr-sl" id="sr-l' + id + '"><span class="slider-top"><span>' + MV.md(label) + '</span><output id="sr-o' + id + '" class="sr-o' + id + '"></output></span>' +
      '<input type="range" id="sr-' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:var(' + col + ')" aria-label="' + MV.esc(MV.plain(MV.md(label))) + '"></label>';
  }
  host.innerHTML = '<div class="sr-ex"><div class="sr-main" data-mv="graph"><p class="eq-cap sr-eq" id="sr-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="sr-stage"><div class="sr-picw"><canvas class="plot sr-pic" id="sr-pic" role="img" aria-label="Scenario picture"></canvas></div>' +
    '<div class="sr-pans">' + pan("m", T.capModel) + pan("r", T.capRate) + pan("2", T.capD2) + "</div></div>" +
    '<p class="tiny muted sr-key" id="sr-key"></p></div>' +
    '<div class="sr-ctl"><div class="sr-c1">' +
    '<div class="sr-tbar"><button type="button" class="btn primary sm" data-act="play" data-k="srplay" id="sr-play">' + T.play + '</button><button type="button" class="btn sm" data-act="step" data-k="srstep">' + T.step + "</button></div>" +
    '<label class="slider sr-sl"><span class="slider-top"><span>' + MV.md(T.time) + '</span><output id="sr-tout"></output></span><input type="range" id="sr-t" min="0" max="120" step="1" style="accent-color:var(--ink)" aria-label="Time t"></label>' +
    '<p class="tiny muted sr-note">' + MV.md(T.timeNote) + "</p>" +
    '<p class="sr-lab" id="sr-sclab">' + T.scenario + '</p><div class="chips sr-chips" role="radiogroup" aria-labelledby="sr-sclab" id="sr-scs"></div>' +
    '<div id="sr-fer">' + sl("r", T.r, 5, 15, 1, "--acol") + sl("H", T.H, 6, 25, 1, "--p-c") + sl("T", T.T, 20, 120, 10, "--ink") + '<p class="tiny muted sr-note">' + MV.md(T.ferrisNote) + "</p></div>" +
    '<div id="sr-tid"><p class="tiny muted sr-note">' + MV.md(T.tideNote) + "</p></div>" +
    '<div id="sr-day"><p class="tiny muted sr-note">' + MV.md(T.dayNote) + "</p>" + MV.usesHTML(MV.md(T.use)) + "</div>" +
    '<p class="sr-lab">' + T.show + '</p><div class="chips sr-chips" id="sr-show"></div>' +
    '</div><div class="sr-c2"><dl class="read sr-read" id="sr-read"></dl><button type="button" class="btn ghost sm sr-more" data-act="more" data-k="srmore" aria-expanded="false"></button></div></div></div>';
  var pP = new MV.Plot($("#sr-pic", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), pM = new MV.Plot($("#sr-cm", host), { xmin:0, xmax:1, ymin:0, ymax:1 }),
    pR = new MV.Plot($("#sr-cr", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), p2 = new MV.Plot($("#sr-c2", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  var slT = $("#sr-t", host), slr = $("#sr-r", host), slH = $("#sr-H", host), slP = $("#sr-T", host);

  function O(){ return scModel(S, S.sc, anim && anim.ov); }
  function tNow(){ return S.tt[S.sc]; }
  function integral(){ return Number.isInteger(S.r) && Number.isInteger(S.H) && Number.isInteger(S.T); }

  // ---------- drawing ----------
  function rv(o){ return anim && anim.rv ? anim.rv : niceCeil(1.3 * o.fast); }
  function drawPic(o, t){
    if (o.id === "ferris") { wheelPic(pP, { r:o.r, H:o.H, T:o.T, t:t, top:42, vel:true, lab:true }); pP.describe("Ferris wheel, radius " + num(o.r, 1) + " m, axle " + num(o.H, 1) + " m. The rider is at " + fx(o.f(t), 1) + " m, " + T.states[stateOf(o, t)] + "."); return; }
    pP.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, after:function(ctx){
      var W = pP.W, Hh = pP.H, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3"), v = o.f(t), r = o.d1(t);
      if (o.id === "tide") {
        var y0 = Hh - 14, s = (Hh - 34) / 10, px = W * 0.34, wy = y0 - v * s;
        ctx.save(); ctx.globalAlpha = 0.4; ctx.fillStyle = pen; ctx.fillRect(6, wy, W - 12, y0 - wy); ctx.restore();
        seg(ctx, 6, wy, W - 6, wy, pen, 2.4);
        seg(ctx, 6, y0, W - 6, y0, ink2, 2.4);
        ctx.save(); ctx.fillStyle = css("--sheet"); ctx.fillRect(px - 7, y0 - 10 * s, 14, 10 * s); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.strokeRect(px - 7, y0 - 10 * s, 14, 10 * s); ctx.restore();
        for (var k = 0; k <= 10; k++) { seg(ctx, px - 7, y0 - k * s, px + (k % 2 ? 0 : 7), y0 - k * s, ink, 1.2); if (k % 2 === 0 && k) bgText(ctx, k + " m", px - 12, y0 - k * s, "right", ink2, ui(11, 600)); }
        var ax = W * 0.72, L = r * 26;
        if (Math.abs(L) > 3) { seg(ctx, ax, wy, ax, wy - L, f3, 3.4); arrowHead(ctx, ax, wy, ax, wy - L, f3, 10); }
        bgText(ctx, "d = " + fx(v, 2) + " m", W - 8, 14, "right", pen, ui(13, 700));
        bgText(ctx, (r >= 0 ? "rising" : "falling"), ax + 10, wy - L / 2, "left", f3, ui(12, 700));
        pP.describe("Harbour post with the water at " + fx(v, 2) + " m, " + T.states[stateOf(o, t)] + ".");
      } else {
        var hy = Hh * 0.82, cx = W / 2, hw = (W * 0.46) * (v / 18), top = (Hh * 0.7) * (v / 17);
        seg(ctx, 6, hy, W - 6, hy, ink2, 2.4);
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.ellipse(cx, hy, hw, top, 0, PI, TAU); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.fillStyle = css("--hi"); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx, hy - top, 12, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
        bgText(ctx, "L ≈ " + fx(v, 1) + " h of daylight", W / 2, Hh - 12, "center", pen, ui(13, 700));
        bgText(ctx, "day " + num(t, 0), 8, 14, "left", ink, ui(13, 700));
        pP.describe("Sun arc over the horizon on day " + num(t, 0) + ": about " + fx(v, 1) + " hours of daylight, " + T.states[stateOf(o, t)] + ".");
      }
    } });
  }
  function hlFor(panel){ return (hl || []).filter(function(z){ return z.panel === panel; }); }
  function annotate(list){ return function(ctx, p){ list.forEach(function(z){ bgText(ctx, z.text, p.X(z.at[0]), p.Y(z.at[1]), z.align || "center", css("--ink"), ui(13, 700)); }); }; }
  function drawAll(){
    var o = O(), t = tNow(), pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2");
    drawPic(o, t);
    var span = o.tmax, X0 = -0.03 * span, X1 = o.tmax + 0.03 * span;
    var probe = function(y0, y1){ return { x1:t, y1:y0, x2:t, y2:y1, color:ink2, width:1.5, dash:[4, 4] }; };
    var hm = hlFor("m"), ptsM = [{ x:t, y:o.f(t), r:5.5, color:pen }];
    if (S.conc) o.infl.forEach(function(x){ ptsM.push({ x:x, y:o.f(x), r:3.8, color:ink }); });
    hm.forEach(function(z){ z.pts.forEach(function(q){ ptsM.push({ x:q[0], y:q[1], r:5, color:ink, ring:true }); }); });
    pM.draw({ view:{ xmin:X0, xmax:X1, ymin:o.yv[0], ymax:o.yv[1] }, xTicks:{ step:o.xt }, yTicks:{ step:o.yt }, xLabel:"t",
      segments:[probe(o.yv[0], o.yv[1])], curves:[{ f:o.f, color:pen, width:3, domain:[0, o.tmax] }], points:ptsM, after:annotate(hm),
      describe:"Model graph " + MV.plain(m(o.model)) + ". At " + MV.plain(tTxt(o, t)) + " the value is about " + fx(o.f(t), 2) + " " + o.u.y + "." });
    var showR = S.rate || !!(anim && anim.forceRate);
    $("#sr-pr", host).hidden = !showR;
    if (showR) {
      var Y = rv(o), hr = hlFor("r"), ptsR = [{ x:t, y:o.d1(t), r:5.5, color:f3 }], cv = [];
      if (anim && anim.ghost) cv.push({ f:anim.ghost, color:ink2, width:2, dash:[8, 6] });
      cv.push({ f:o.d1, color:f3, width:2.8, domain:[0, o.tmax] });
      hr.forEach(function(z){ z.pts.forEach(function(q){ ptsR.push({ x:q[0], y:q[1], r:5, color:ink, ring:true }); }); });
      pR.draw({ view:{ xmin:X0, xmax:X1, ymin:-Y, ymax:Y }, xTicks:{ step:o.xt }, xLabel:"t", segments:[probe(-Y, Y)], curves:cv, points:ptsR, after:annotate(hr),
        describe:"Rate graph. At " + MV.plain(tTxt(o, t)) + " the rate is about " + fx(o.d1(t), 2) + " " + o.u.r + "; the fastest rate is about " + fx(o.fast, 2) + " " + o.u.r + "." });
    }
    $("#sr-p2", host).hidden = !S.conc;
    if (S.conc) {
      var Y2 = niceCeil(1.3 * Math.abs(o.A) * o.k * o.k);
      p2.draw({ view:{ xmin:X0, xmax:X1, ymin:-Y2, ymax:Y2 }, xTicks:{ step:o.xt }, xLabel:"t", segments:[probe(-Y2, Y2)],
        curves:[{ f:o.d2, color:ink, width:2.2, dash:[12, 6], domain:[0, o.tmax] }], points:o.infl.map(function(x){ return { x:x, y:0, r:3.8, color:ink }; }),
        describe:"Second derivative graph, zero at the points of inflection." });
    }
  }
  function paintEq(){
    var o = O(); if (o.id === "ferris" && !integral()) return;
    $("#sr-eq", host).innerHTML = m(o.model) + " ⟶ " + m(rateSrc(o));
  }
  function paintRead(){
    var o = O(), t = tNow(); if (o.id === "ferris" && !integral()) return;
    var R = rateQ(o), u = o.u, rows = [
      [T.rows.model, m(o.model), "x"], [T.rows.rate, m(rateSrc(o)), "x"],
      [T.rows.now, tTxt(o, t) + ", " + m(o.nm + " = ") + valNow(o, t) + " " + u.y],
      [T.rows.rateNow, m(o.nm + "′(" + num(t, o.dp) + ") = ") + rateNow(o, t) + " " + u.r],
      [T.rows.state, "<strong>" + T.states[stateOf(o, t)] + "</strong>"],
      [T.rows.fastest, m(piQ(Q.abs(R))) + " ≈ " + fx(o.fast, 2) + " " + u.r + ", " + T.atAxis]];
    $("#sr-read", host).innerHTML = rows.map(function(r){ return '<div' + (r[2] ? ' class="sr-x"' : "") + "><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    $("#sr-read", host).classList.toggle("sr-open", more);
    var mb = $(".sr-more", host); mb.textContent = more ? T.less : T.more; mb.setAttribute("aria-expanded", String(more));
  }
  function paintCtl(){
    var o = O();
    $("#sr-scs", host).innerHTML = C.scenarios.map(function(s){
      var on = s.id === S.sc;
      return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-sc="' + s.id + '" data-k="sc' + s.id + '">' + s.t + "</button>";
    }).join("");
    $("#sr-fer", host).hidden = S.sc !== "ferris"; $("#sr-tid", host).hidden = S.sc !== "tide"; $("#sr-day", host).hidden = S.sc !== "daylight";
    $("#sr-show", host).innerHTML = [["rate", T.rate, S.rate], ["conc", T.conc, S.conc]].map(function(q){
      return '<button type="button" class="chip' + (q[2] ? " on" : "") + '" aria-pressed="' + q[2] + '" data-tog="' + q[0] + '" data-k="tog' + q[0] + '">' + q[1] + "</button>"; }).join("");
    var pb = $("#sr-play", host); pb.textContent = playing ? T.pause : T.play; pb.hidden = !!MV.reduceMotion;
    $("#sr-key", host).innerHTML = (S.sc === "ferris" ? MV.md(T.keyFerris) + " " : "") + (S.conc ? MV.md(T.keyConc) : "");
    slT.max = o.tmax; slT.step = o.step;
  }
  function syncSl(){
    var o = O(), t = tNow();
    slT.value = t; $("#sr-tout", host).innerHTML = tTxt(o, t);
    if (S.sc === "ferris") {
      slr.value = S.r; slH.min = Math.max(6, Math.round(S.r) + 1); slH.value = S.H; slP.value = S.T;
      $("#sr-or", host).textContent = num(S.r, 1) + " m"; $("#sr-oH", host).textContent = num(S.H, 1) + " m"; $("#sr-oT", host).textContent = num(S.T, 1) + " s";
    }
  }
  function paintAll(){ paintCtl(); syncSl(); paintEq(); paintRead(); drawAll(); }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }
  function setT(v){ var o = O(); v = clamp(v, 0, o.tmax); S.tt[S.sc] = Math.round(v / o.step) * o.step; S.tt[S.sc] = +S.tt[S.sc].toFixed(4); }

  // ---------- play ----------
  function stopPlay(){ if (playing) { cancelAnimationFrame(playing.id); playing = null; setT(tNow()); changed(); } }
  function play(){
    if (playing || MV.reduceMotion) return;
    var o = O(); if (tNow() >= o.tmax - 1e-9) S.tt[S.sc] = 0;
    playing = { last:null, id:0 };
    function frame(ts){
      if (!playing) return;
      if (playing.last != null) S.tt[S.sc] = Math.min(o.tmax, tNow() + (ts - playing.last) / 1000 * o.speed);
      playing.last = ts; syncSl(); paintRead(); drawAll();
      if (tNow() >= o.tmax - 1e-9) { stopPlay(); return; }
      playing.id = requestAnimationFrame(frame);
    }
    playing.id = requestAnimationFrame(frame); paintCtl();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b)) return;
    if (b.dataset.sc) { if (b.dataset.sc !== S.sc) { stopPlay(); S.sc = b.dataset.sc; } changed(); var nb = $('[data-sc="' + S.sc + '"]', host); if (nb) nb.focus(); return; }
    if (b.dataset.tog) { S[b.dataset.tog] = !S[b.dataset.tog]; changed(); return; }
    var a = b.dataset.act;
    if (a === "play") { if (playing) stopPlay(); else play(); return; }
    if (a === "step") { stopPlay(); var o = O(); setT(tNow() + o.step); changed(); return; }
    if (a === "more") { more = !more; paintRead(); }
  });
  $("#sr-scs", host).addEventListener("keydown", function(e){
    var k = e.key, d = k === "ArrowRight" || k === "ArrowDown" ? 1 : k === "ArrowLeft" || k === "ArrowUp" ? -1 : 0; if (!d || busy) return;
    e.preventDefault(); stopPlay();
    var ids = C.scenarios.map(function(s){ return s.id; }); S.sc = ids[(ids.indexOf(S.sc) + d + ids.length) % ids.length];
    changed(); var nb = $('[data-sc="' + S.sc + '"]', host); if (nb) nb.focus();
  });
  host.addEventListener("keydown", function(e){
    if (busy || e.key !== " " || !e.target || (e.target !== slT && !e.target.classList.contains("sr-pc") && e.target.id !== "sr-pic")) return;
    e.preventDefault(); if (playing) stopPlay(); else play();
  });
  slT.addEventListener("keydown", function(e){
    if (busy || !e.shiftKey) return;
    var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0; if (!d) return;
    e.preventDefault(); stopPlay(); setT(tNow() + d * 10 * O().step); changed();
  });
  slT.addEventListener("input", function(){ if (busy) return; if (playing) { cancelAnimationFrame(playing.id); playing = null; } setT(+slT.value); changed(); });
  slr.addEventListener("input", function(){ if (busy) return; S.r = +slr.value; if (S.H < S.r + 1) S.H = S.r + 1; changed(); });
  slH.addEventListener("input", function(){ if (busy) return; S.H = Math.max(+slH.value, S.r + 1); changed(); });
  slP.addEventListener("input", function(){ if (busy) return; S.T = +slP.value; changed(); });
  [pM, pR, p2].forEach(function(p){
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
    p.c.style.touchAction = "none";
    p.c.addEventListener("pointerdown", function(e){ if (busy || !p.v) return; active = true; if (playing) { cancelAnimationFrame(playing.id); playing = null; } try { p.c.setPointerCapture(e.pointerId); } catch (err) {} setT(at(e)); changed(); });
    p.c.addEventListener("pointermove", function(e){ if (!active || busy) return; setT(at(e)); changed(); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  });
  paintAll();

  // ---------- challenges ----------
  function chal(id){
    var M = MS[id], t;
    if (id === "tc1") {
      if (S.sc !== "tide") return { ok:false, msg:M.sc };
      t = S.tt.tide;
      if (t === 3 || t === 15) return { ok:true };
      if (t === 6 || t === 18) return { ok:false, msg:M.low };
      if (t === 9 || t === 21) return { ok:false, msg:M.rise };
      if (t === 0 || t === 12 || t === 24) return { ok:false, msg:M.high };
      return { ok:false, msg:M.general };
    }
    if (id === "tc2") {
      if (S.sc !== "ferris") return { ok:false, msg:M.sc };
      if (S.T === 4 * S.r) return { ok:true };
      if (S.T === 2 * S.r) return { ok:false, msg:M.twice };
      if (S.T === 8 * S.r) return { ok:false, msg:M.half };
      return { ok:false, msg:M.general };
    }
    if (id === "tc3") {
      if (S.sc !== "ferris") return { ok:false, msg:M.sc };
      if (!(S.r === 10 && S.H === 12 && S.T === 60)) return { ok:false, msg:M.wheel };
      t = S.tt.ferris;
      if (t === 5) return { ok:true };
      if (Math.abs(t - 7.5) <= 0.5) return { ok:false, msg:M.lin };
      if (t === 25) return { ok:false, msg:M.second };
      if (t === 15) return { ok:false, msg:M.top };
      return { ok:false, msg:M.general };
    }
    return { ok:false };
  }

  // ---------- predictions ----------
  var lin = function(x){ return x; };
  function rateOf(r, T){ return function(t){ return TAU * r / T * Math.sin(TAU * t / T); }; }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        if (playing) { cancelAnimationFrame(playing.id); playing = null; }
        busy = true; hl = null; anim = null; more = false;
        S.sc = "ferris"; S.r = 10; S.H = 12; S.T = 60; S.rate = true;
        S.tt.ferris = p.id === "p2" || p.id === "p3" ? 15 : 0;
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; anim = null; lock(false); api.save(); paintAll(); MV.changed(); done(); }
        function show(list, cb){ hl = list; drawAll(); MV.wait(1400, cb); }
        if (p.id === "p1") {
          stop = MV.tween({ dur:3000, ease:lin, step:function(x){ S.tt.ferris = Math.round(30 * x * 100) / 100; syncSl(); paintRead(); drawAll(); }, done:function(){
            stop = null; S.tt.ferris = 30;
            show([{ panel:"r", pts:[[15, PI / 3]], text:"fastest: π/3 ≈ 1.05 m/s at t = 15 s", at:[48, PI / 3 + 0.25] }, { panel:"m", pts:[[15, 12]], text:"height crosses 12 m", at:[48, 30] }], fin);
          } });
        } else if (p.id === "p2") {
          stop = MV.tween({ dur:2200, ease:lin, step:function(x){ S.tt.ferris = Math.round((15 + 15 * x) * 100) / 100; syncSl(); paintRead(); drawAll(); }, done:function(){
            stop = null; S.tt.ferris = 30;
            show([{ panel:"r", pts:[[30, 0]], text:"h′ = 0 at the top", at:[60, 0.9] }, { panel:"m", pts:[[30, 22]], text:"maximum: 22 m", at:[60, 36] }], fin);
          } });
        } else {
          var p3 = p.id === "p3", R1 = p3 ? 15 : 10, H1 = p3 ? 17 : 12, T1 = p3 ? 60 : 30;
          anim = { ov:{ r:10, H:12, T:60 }, rv:niceCeil(1.3 * TAU * R1 / T1), ghost:rateOf(10, 60), forceRate:true };
          stop = MV.tween({ dur:2400, step:function(x){ anim.ov = { r:10 + (R1 - 10) * x, H:12 + (H1 - 12) * x, T:60 + (T1 - 60) * x }; drawAll(); }, done:function(){
            stop = null; S.r = R1; S.H = H1; S.T = T1; anim.ov = null; paintAll();
            show(p3 ? [{ panel:"r", pts:[[15, PI / 2]], text:"peak rises from π/3 to π/2", at:[60, PI / 2 + 0.35] }]
              : [{ panel:"r", pts:[[7.5, 2 * PI / 3]], text:"peaks double: 2π/3 ≈ 2.09 m/s", at:[60, 2 * PI / 3 + 0.4] }], fin);
          } });
        }
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Optimization with angles ----------
// @component V10 shapeStage (MCV4U 16–19, 28, 32: a figure driven by one variable beside its objective graph) — here the variable
// is an angle θ (slider 0 to π in steps of π/24). Station "pen": two 10 m fences and a rope, A = 50 sin θ. Station "gutter": a
// 10 cm base with 10 cm sides tilted at θ, A = 100 sin θ(1 + cos θ); the allowed interval [0, π/2] is shaded, θ > π/2 greys the
// figure ("sides fold inward") and the outside root θ = π is marked in --ink-2. "Check it with algebra" reveals the steps and
// marks the critical value. Exact areas at special angles through N12 exactTrig.
function part3(host, api){
  var S = api.S, C = api.content, T = C.txt, SS = C.stations;
  if (!(S.cur >= 0 && S.cur < SS.length)) S.cur = 0;
  if (!S.n || typeof S.n !== "object") S.n = {};
  if (!S.alg || typeof S.alg !== "object") S.alg = {};
  SS.forEach(function(st){ if (!(Number.isInteger(S.n[st.id]) && S.n[st.id] >= 0 && S.n[st.id] <= 24)) S.n[st.id] = 4; });
  host.innerHTML = '<div class="sr-stbar" role="group" aria-label="Stations" id="sr-stbar"></div>' +
    '<div class="sr-st"><div class="sr-stl"><h4 class="sr-sth" id="sr-sth"></h4><p id="sr-stt"></p>' +
    '<div class="plot-wrap"><canvas class="plot sr-fig" id="sr-fig" role="img" aria-label="Figure"></canvas></div>' +
    '<label class="slider sr-sl"><span class="slider-top"><span>' + MV.md(T.theta) + '</span><output id="sr-thout"></output></span><input type="range" id="sr-th" min="0" max="24" step="1" style="accent-color:var(--ink)" aria-label="Angle theta"></label>' +
    '<p class="tiny muted sr-note">' + MV.md(T.thetaNote) + '</p><dl class="read" id="sr-stread" aria-live="polite"></dl></div>' +
    '<div class="sr-str"><p class="sr-fn" id="sr-fn"></p><div class="plot-wrap"><canvas class="plot sr-gr" id="sr-gr" role="img" aria-label="Graph"></canvas></div>' +
    '<div class="q-actions"><button type="button" class="btn sm" data-act="alg" data-k="sralg" id="sr-algb"></button></div><div id="sr-alg" aria-live="polite"></div></div></div>';
  var pF = new MV.Plot($("#sr-fig", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), pG = new MV.Plot($("#sr-gr", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), sl = $("#sr-th", host);
  function st(){ return SS[S.cur]; }
  function th(){ return S.n[st().id] * PI / 24; }
  function A(id, x){ return id === "pen" ? 50 * Math.sin(x) : 100 * Math.sin(x) * (1 + Math.cos(x)); }
  function exactA(id, x){
    var sp = TR.special(x); if (!sp) return null;
    return id === "pen" ? TR.scale(sp.sin, 50) : TR.mul(TR.scale(sp.sin, 100), TR.norm([[1, 1, 1]].concat(sp.cos)));
  }
  function drawFig(){
    var s = st(), x = th(), pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), ac = css("--acol");
    if (s.id === "pen") {
      var P = [0, 0], A1 = [10, 0], B = [10 * Math.cos(x), 10 * Math.sin(x)];
      pF.draw({ view:{ xmin:-11.5, xmax:11.5, ymin:-1.8, ymax:11.5 }, equal:true, grid:false, axes:false, ticks:false, after:function(ctx, p){
        ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = pen; ctx.beginPath(); ctx.moveTo(p.X(P[0]), p.Y(P[1])); ctx.lineTo(p.X(A1[0]), p.Y(A1[1])); ctx.lineTo(p.X(B[0]), p.Y(B[1])); ctx.closePath(); ctx.fill(); ctx.restore();
        seg(ctx, p.X(A1[0]), p.Y(A1[1]), p.X(B[0]), p.Y(B[1]), ink2, 2, [7, 5]);
        seg(ctx, p.X(0), p.Y(0), p.X(A1[0]), p.Y(A1[1]), pen, 4); seg(ctx, p.X(0), p.Y(0), p.X(B[0]), p.Y(B[1]), pen, 4);
        var rr = Math.abs(p.X(1.6) - p.X(0));
        if (x > 0.01) { ctx.save(); ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.X(0), p.Y(0), rr, -x, 0); ctx.stroke(); ctx.restore();
          bgText(ctx, "θ", p.X(2.3 * Math.cos(x / 2)), p.Y(2.3 * Math.sin(x / 2)), "center", ac, "italic 700 15px " + (css("--font-math") || "serif")); }
        ctx.save(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(p.X(0), p.Y(0), 5, 0, TAU); ctx.fill(); ctx.restore();
        bgText(ctx, "10 m", p.X(5), p.Y(0) + 14, "center", pen, ui(12, 700));
        bgText(ctx, "10 m", p.X(B[0] / 2) - 14, p.Y(B[1] / 2), "right", pen, ui(12, 700));
        bgText(ctx, "rope", p.X((A1[0] + B[0]) / 2) + 10, p.Y((A1[1] + B[1]) / 2), "left", ink2, ui(12, 600));
      }, describe:"Triangle pen: two 10 m fences meet at angle " + MV.piLabel(x, 24) + "; area about " + fx(A("pen", x), 1) + " square metres." });
    } else {
      var fold = x > PI / 2 + 1e-9, c = Math.cos(x), sn = Math.sin(x), L1 = [-5 - 10 * c, 10 * sn], R1 = [5 + 10 * c, 10 * sn], col = fold ? ink2 : pen;
      pF.draw({ view:{ xmin:-16, xmax:16, ymin:-2.5, ymax:12 }, equal:true, grid:false, axes:false, ticks:false, after:function(ctx, p){
        if (!fold && sn > 0.01) { ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = pen; ctx.beginPath(); ctx.moveTo(p.X(-5), p.Y(0)); ctx.lineTo(p.X(5), p.Y(0)); ctx.lineTo(p.X(R1[0]), p.Y(R1[1])); ctx.lineTo(p.X(L1[0]), p.Y(L1[1])); ctx.closePath(); ctx.fill(); ctx.restore(); }
        ctx.save(); if (fold) ctx.globalAlpha = 0.55;
        seg(ctx, p.X(-5), p.Y(0), p.X(5), p.Y(0), col, 4); seg(ctx, p.X(-5), p.Y(0), p.X(L1[0]), p.Y(L1[1]), col, 4); seg(ctx, p.X(5), p.Y(0), p.X(R1[0]), p.Y(R1[1]), col, 4);
        ctx.restore();
        seg(ctx, p.X(5), p.Y(0), p.X(10), p.Y(0), ink2, 1.2, [4, 4]);
        if (x > 0.01) { var rr = Math.abs(p.X(1.8) - p.X(0)); ctx.save(); ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.X(5), p.Y(0), rr, -x, 0); ctx.stroke(); ctx.restore();
          bgText(ctx, "θ", p.X(5 + 2.7 * Math.cos(x / 2)), p.Y(2.7 * Math.sin(x / 2)), "center", ac, "italic 700 15px " + (css("--font-math") || "serif")); }
        bgText(ctx, "10 cm", p.X(0), p.Y(0) + 14, "center", col, ui(12, 700));
        if (fold) bgText(ctx, T.fold, p.X(0), p.Y(11), "center", ink2, ui(13, 700));
      }, describe:"Gutter cross-section with sides tilted at " + MV.piLabel(x, 24) + (fold ? ": the sides fold inward." : "; area about " + fx(A("gutter", x), 1) + " square centimetres.") });
    }
  }
  function drawGraph(){
    var s = st(), x = th(), pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), shown = !!S.alg[s.id];
    var V = s.id === "pen" ? { xmin:-0.12, xmax:PI + 0.12, ymin:-6, ymax:58 } : { xmin:-0.12, xmax:PI + 0.12, ymin:-16, ymax:150 };
    var sc = { view:V, xTicks:{ step:PI / 6, pi:true }, yTicks:{ step:s.id === "pen" ? 10 : 25 }, xLabel:"θ", curves:[], points:[], bands:[], labels:[] };
    var f = function(t){ return A(s.id, t); };
    if (s.id === "pen") sc.curves.push({ f:f, color:pen, width:3, domain:[0, PI] });
    else {
      sc.bands.push({ x0:0, x1:PI / 2 });
      sc.curves.push({ f:f, color:pen, width:3, domain:[0, PI / 2] }, { f:f, color:ink2, width:2, dash:[8, 6], domain:[PI / 2, PI] });
      sc.points.push({ x:PI, y:0, r:5.5, color:ink2, open:true });
    }
    if (shown) {
      if (s.id === "pen") sc.points.push({ x:PI / 2, y:50, r:5, color:ink, ring:true });
      else sc.points.push({ x:PI / 3, y:75 * Math.sqrt(3), r:5, color:ink, ring:true });
    }
    sc.points.push({ x:x, y:f(x), r:6, color:x > PI / 2 + 1e-9 && s.id === "gutter" ? ink2 : pen });
    sc.after = function(ctx, p){
      if (s.id === "gutter") {
        bgText(ctx, T.allowed, p.X(PI / 4), p.Y(-8), "center", ink2, ui(12, 600));
        bgText(ctx, "A′ = 0 at θ = π (" + T.outside + ")", p.X(PI) - 8, p.Y(0) - 16, "right", ink2, ui(12, 700));
      }
      if (shown) bgText(ctx, s.id === "pen" ? "max 50 m² at θ = π/2" : "max 75√3 ≈ 130 cm² at θ = π/3", p.X(s.id === "pen" ? PI / 2 : PI / 3), p.Y(s.id === "pen" ? 54 : 142), "center", ink, ui(12, 700));
    };
    sc.describe = "Graph of " + MV.plain(MV.md(s.fn)) + " for θ from 0 to π, with the current point at θ = " + MV.piLabel(x, 24) + "." + (s.id === "gutter" ? " The allowed interval 0 to π/2 is shaded; the root θ = π lies outside it." : "");
    pG.draw(sc);
  }
  function paintRead(){
    var s = st(), x = th(), v = A(s.id, x), ex = exactA(s.id, x), fold = s.id === "gutter" && x > PI / 2 + 1e-9;
    var av = ex ? m(TR.src(ex)) + (TR.rad(ex) ? " ≈ " + fx(v, 1) : "") : "≈ " + fx(v, 1);
    $("#sr-stread", host).innerHTML = MV.readoutHTML([[T.angle, m("θ = " + MV.piLabel(x, 24).replace(MINUS, "-")) + " (" + num(x * 180 / PI, 1) + "°)"],
      [T.area, fold ? "<span class=\"muted\">" + T.fold + "</span>" : m("A = ") + av + " " + s.unit]]);
    $("#sr-thout", host).innerHTML = m(MV.piLabel(x, 24).replace(MINUS, "-"));
  }
  function paint(){
    var s = st();
    $("#sr-stbar", host).innerHTML = SS.map(function(q, i){ var on = i === S.cur; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-st="' + i + '" data-k="st' + i + '">' + MV.md(q.title) + "</button>"; }).join("");
    $("#sr-sth", host).innerHTML = MV.md(s.title); $("#sr-stt", host).innerHTML = MV.md(s.text); $("#sr-fn", host).innerHTML = MV.md(s.fn);
    sl.value = S.n[s.id];
    var shown = !!S.alg[s.id];
    $("#sr-algb", host).textContent = shown ? T.hideAlg : T.alg; $("#sr-algb", host).setAttribute("aria-expanded", String(shown));
    $("#sr-alg", host).innerHTML = shown ? '<div class="refresh sr-algbox"><ol>' + s.alg.map(function(l){ return "<li>" + MV.md(l) + "</li>"; }).join("") + "</ol></div>" : "";
    paintRead(); drawFig(); drawGraph();
  }
  pF.render = drawFig; pG.render = drawGraph;
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.st != null) { S.cur = +b.dataset.st; api.save(); paint(); return; }
    if (b.dataset.act === "alg") { S.alg[st().id] = !S.alg[st().id]; api.save(); paint(); }
  });
  sl.addEventListener("input", function(){ S.n[st().id] = clamp(Math.round(+sl.value), 0, 24); api.save(); paintRead(); drawFig(); drawGraph(); });
  paint();
}

// =====================================================================================================================
// ---------- Practice 2: Rates and times ----------
// @component V8 designBoxes (copied from MCV4U 29 exactAct; adds units after the box) — labelled answer boxes per item, values
// with π and √ through V8 piExact; lists ("1, 5") are order-free; named wrong states ({k, eq}); a "give the exact value"
// message for decimals close to the answer; first-try scoring and three-level help.
function ratesAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + MV.md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q sr-dq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="sr-din"></div><div class="sr-dcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .sr-din', host);
    var h = '<div class="sr-dt">' + it.boxes.map(function(b){
      return '<div class="sr-dr"><span class="sr-dl">' + MV.md(b.pre) + "</span>" + boxHTML(b.k, x.v[b.k], MV.plain(MV.md(b.pre)), b.list ? "sr-long" : "", x.solved) + (b.post ? '<span class="sr-du">' + b.post + "</span>" : "") + "</div>";
    }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .sr-dcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.md(MV.hintsHTML(it.hints, x.hint)) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + MV.md(it.display) + ".</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", MV.md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, decs = false, i, b;
    for (i = 0; i < it.boxes.length; i++) {
      b = it.boxes[i]; var raw = String(x.v[b.k] || "").trim();
      if (!raw) return { err:TX.fill };
      if (b.list) { var l = piList(raw); if (!l) return { err:TX.err }; if (l.some(function(q){ return q.dec; })) decs = true; vals[b.k] = l.map(function(q){ return q.v; }); }
      else { var p = piParse(raw); if (!p) return { err:TX.err }; if (p.dec) decs = true; vals[b.k] = p.v; }
    }
    function same(k, Av, tol){
      var V = vals[k];
      if (Array.isArray(Av)) return Array.isArray(V) && V.length === Av.length && MV.sameNums(V, Av, tol);
      return typeof V === "number" && near(V, Av, tol);
    }
    var keys = Object.keys(ans);
    if (!decs && keys.every(function(k){ return same(k, ans[k], 1e-9); })) return { ok:true };
    var W = it.wrong || [];
    for (i = 0; i < W.length; i++) if (same(W[i].k, W[i].eq, 1e-9)) return { msg:W[i].fb };
    if (decs && keys.every(function(k){ return same(k, ans[k], 0.01); })) return { exact:true };
    return { msg:it.general || TX.general };
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
    else if (r.exact) msgs[it.id] = { bad:false, html:TX.exact };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// =====================================================================================================================
// ---------- Performance task: Design a Ferris wheel ----------
// Sliders r (4–16 m, --acol), H (5–30 m, --p-c), T (20–120 s, step 2). Live wheel picture (V9 wheel mode), height and rate
// graphs over one turn, and the fastest rate shown exactly (2πr/T as a multiple of π).
var task = (function(){
  var api, pW, pH, pD;
  function read(){ var s = api ? api.S : {}; return { r:s.r, H:s.H, T:s.T, valid:[s.r, s.H, s.T].every(Number.isInteger) }; }
  function checks(D){ if (!D.valid) return [false, false, false, false]; return [D.H + D.r === 30, D.H - D.r >= 6, D.T === 6 * D.r, D.T > 45]; }
  function preview(){
    var D = read(); if (!D.valid) return;
    var L = api.content.labels, r = D.r, H = D.H, P = D.T, k = TAU / P, half = P / 2;
    var h = function(t){ return H - r * Math.cos(k * t); }, d = function(t){ return r * k * Math.sin(k * t); };
    var F = Q.of(2 * r, P), coef = piQ(F), coefP = F.d > 1 ? "(" + coef + ")" : coef;
    $("#fw-read").innerHTML = '<dl class="read">' + MV.readoutHTML([
      [L.model, m("h(t) = @c{" + H + "} - @a{" + r + "} cos(πt/" + half + ")")],
      [L.rate, m("h′(t) = " + coefP + " sin(πt/" + half + ")")],
      [L.top, m("@c{" + H + "} + @a{" + r + "} = " + (H + r)) + " m"], [L.bottom, m("@c{" + H + "} - @a{" + r + "} = " + (H - r)) + " m"],
      [L.fastest, m(coef) + " ≈ " + fx(r * k, 2) + " m/s"]]) + "</dl>";
    wheelPic(pW, { r:r, H:H, T:P, t:P / 4, top:46, vel:true, lab:true });
    pW.describe("Ferris wheel of radius " + r + " m with its axle " + H + " m up; the rider is shown level with the axle, rising fastest.");
    var X1 = P * 1.04, X0 = -P * 0.04, Y = niceCeil(1.3 * r * k);
    pH.draw({ view:{ xmin:X0, xmax:X1, ymin:-2, ymax:48 }, xTicks:{ step:P / 4 }, yTicks:{ step:10 }, xLabel:"t",
      segments:[{ x1:0, y1:30, x2:P, y2:30, color:css("--ink-2"), width:1.2, dash:[4, 4] }, { x1:0, y1:6, x2:P, y2:6, color:css("--ink-2"), width:1.2, dash:[4, 4] }],
      curves:[{ f:h, color:css("--pen"), width:3, domain:[0, P] }],
      after:function(ctx, p){ bgText(ctx, "30 m", p.X(X1) - 4, p.Y(30) - 11, "right", css("--ink-2"), ui(11, 600)); bgText(ctx, "6 m", p.X(X1) - 4, p.Y(6) - 11, "right", css("--ink-2"), ui(11, 600)); },
      describe:"Height over one turn of " + P + " s: from " + (H - r) + " m up to " + (H + r) + " m." });
    pD.draw({ view:{ xmin:X0, xmax:X1, ymin:-Y, ymax:Y }, xTicks:{ step:P / 4 }, xLabel:"t", curves:[{ f:d, color:css("--f3"), width:2.8, domain:[0, P] }],
      points:[{ x:P / 4, y:r * k, r:5, color:css("--f3") }],
      describe:"Rate over one turn: fastest " + MV.plain(m(coef)) + " m/s at t = " + num(P / 4, 1) + " s, level with the axle." });
  }
  function sl(id, label, min, max, step, col, v){
    return '<label class="slider sr-sl"><span class="slider-top"><span>' + MV.md(label) + '</span><output id="fw-o' + id + '"></output></span>' +
      '<input type="range" id="fw-' + id + '" data-fw="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + v + '" style="accent-color:var(' + col + ')" aria-label="' + MV.esc(MV.plain(MV.md(label))) + '"></label>';
  }
  function outs(){ var s = api.S; $("#fw-or").textContent = s.r + " m"; $("#fw-oH").textContent = s.H + " m"; $("#fw-oT").textContent = s.T + " s"; }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels, s = a.S;
      if (!(Number.isInteger(s.r) && s.r >= 4 && s.r <= 16)) s.r = 6;
      if (!(Number.isInteger(s.H) && s.H >= 5 && s.H <= 30)) s.H = 12;
      if (!(Number.isInteger(s.T) && s.T >= 20 && s.T <= 120 && s.T % 2 === 0)) s.T = 40;
      inp.innerHTML = '<div class="fw-in">' + sl("r", L.r, 4, 16, 1, "--acol", s.r) + sl("H", L.H, 5, 30, 1, "--p-c", s.H) + sl("T", L.T, 20, 120, 2, "--ink", s.T) + "</div>";
      pv.innerHTML = '<div id="fw-read" aria-live="polite"></div><div class="fw-pv"><div class="fw-w"><canvas class="plot fw-wc" id="fw-wheel" role="img" aria-label="Ferris wheel"></canvas></div>' +
        '<div class="fw-g"><p class="tiny fw-gh">' + MV.md(L.graph) + '</p><canvas class="plot fw-gc" id="fw-h" role="img" aria-label="Height graph"></canvas><canvas class="plot fw-gc" id="fw-d" role="img" aria-label="Rate graph"></canvas></div></div>';
      pW = new MV.Plot($("#fw-wheel"), { xmin:0, xmax:1, ymin:0, ymax:1 }); pH = new MV.Plot($("#fw-h"), { xmin:0, xmax:1, ymin:0, ymax:1 }); pD = new MV.Plot($("#fw-d"), { xmin:0, xmax:1, ymin:0, ymax:1 });
      pW.render = preview; pH.render = preview; pD.render = preview;
      inp.addEventListener("input", function(e){
        var t = e.target; if (!t.dataset || !t.dataset.fw) return;
        a.S[t.dataset.fw] = Math.round(+t.value); a.save(); outs(); preview(); a.update();
      });
      outs(); preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : "Choose r, H and T."; },
    checks:checks,
    key:function(D){ return D.r + "|" + D.H + "|" + D.T; },
    label:function(k){ var s = k.split("|"); return m("(@a{r}, @c{H}, T) = (" + s[0] + ", " + s[1] + ", " + s[2] + ")"); },
    text:function(k){ var s = k.split("|"); return "(r, H, T) = (" + s[0] + ", " + s[1] + ", " + s[2] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ rates:ratesAct },
  task:task
});
})();
