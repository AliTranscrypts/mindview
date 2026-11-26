// MHF4U 31 Graphing the Six Trig Functions: hero (a lap unwraps into sin x, then csc x), circle-to-graph unwrapper
// (Explore), reciprocal graph builder (Part 3, #reciprocals), property grid and Track it down (Practice 1–2),
// the "Rising below the axis" task and the Final Check A1 diagram.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, PI = Math.PI, TAU = 2 * PI, ST = PI / 12;
function fill(t, o){ return String(t).replace(/\{(\w+)\}/g, function(s, k){ return o[k] != null ? o[k] : s; }); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function kOf(x){ var k = Math.round(x / ST); return Math.abs(k * ST - x) < 1e-7 ? k : null; }
function dec(v, dp){ var s = Math.abs(v).toFixed(dp); return (v < 0 && +s !== 0 ? MINUS : "") + s; }
function isDark(){ var s = css("--sheet").replace("#", ""); return s.length >= 6 && parseInt(s.slice(0, 2), 16) < 128; }

// ---------- π-multiples (N3): k twelfths of π ----------
function angS(k, st){
  if (!k) return "0";
  var g = gcd(k, 12), p = Math.abs(k / g), q = 12 / g, top = (p === 1 ? "" : p) + "π";
  return (k < 0 ? "-" : "") + (q === 1 ? top : st ? "{" + top + "}/{" + q + "}" : top + "/" + q);
}
function angT(k){ return angS(k).replace(/-/g, MINUS); }
function angM(k, st){ return MV.m(angS(k, st)); }
function angSay(k){ if (!k) return "0"; var g = gcd(k, 12), p = Math.abs(k / g), q = 12 / g; return (k < 0 ? "minus " : "") + (p === 1 ? "" : p + " ") + "pi" + (q === 1 ? "" : " over " + q); }
function fnAt(fn, k){ return fn + (k === 0 ? " 0" : "(" + angS(k) + ")"); }
// a π-multiple typed as "5/2", "−3/2", "2.5" or "5π/2" -> coefficient of π (NaN if unreadable)
function parsePi(raw){
  var s = String(raw == null ? "" : raw).trim(); if (!s) return NaN;
  var r = MV.parseNum(s); if (!r || r.length !== 1) return NaN;
  return /π|pi/i.test(s) ? r[0] / PI : r[0];
}

// @component N12 unitCircle (exact-value subset, copied from MHF4U 26) — exact special-angle values for k twelfths of π,
//   and canvas maths labels (stacked fractions, radicals with a bar, upright function names, italic letters).
var UC = (function(){
  var R3 = Math.sqrt(3), R2 = Math.SQRT2;
  // key -> [stacked source, inline source, spoken, value]
  var SZ = { "0":["0", "0", "0", 0], "1":["1", "1", "1", 1], h:["{1}/{2}", "1/2", "one half", 0.5], r2:["{√2}/{2}", "√2/2", "root 2 over 2", R2 / 2],
    r3:["{√3}/{2}", "√3/2", "root 3 over 2", R3 / 2], t3:["{√3}/{3}", "√3/3", "root 3 over 3", R3 / 3], s3:["√3", "√3", "root 3", R3],
    s2:["√2", "√2", "root 2", R2], "2":["2", "2", "2", 2], c3:["{2√3}/{3}", "2√3/3", "2 root 3 over 3", 2 * R3 / 3], u:["undefined", "undefined", "undefined", NaN] };
  var REF = { 0:{ sin:"0", cos:"1", tan:"0", csc:"u", sec:"1", cot:"u" }, 2:{ sin:"h", cos:"r3", tan:"t3", csc:"2", sec:"c3", cot:"s3" },
    3:{ sin:"r2", cos:"r2", tan:"1", csc:"s2", sec:"s2", cot:"1" }, 4:{ sin:"r3", cos:"h", tan:"s3", csc:"c3", sec:"2", cot:"t3" },
    6:{ sin:"1", cos:"0", tan:"u", csc:"1", sec:"u", cot:"0" } };
  function sg(x){ return Math.abs(x) < 1e-9 ? 0 : x > 0 ? 1 : -1; }
  function V(key, s){
    var z = SZ[key]; s = (key === "0" || key === "u") ? 0 : s;
    return { key:key, undef:key === "u", v:key === "u" ? NaN : s < 0 ? -z[3] : z[3], m:(s < 0 ? "-" : "") + z[0], mi:(s < 0 ? "-" : "") + z[1],
      t:(s < 0 ? MINUS : "") + z[1], sp:(s < 0 ? "negative " : "") + z[2], rad:/√/.test(z[1]) };
  }
  function info(k){
    var kk = ((k % 24) + 24) % 24, a = kk * PI / 12, c = sg(Math.cos(a)), s = sg(Math.sin(a)), m = kk % 12, ref = m <= 6 ? m : 12 - m, R = REF[ref];
    if (!R) return null;
    return { k:k, cos:V(R.cos, c), sin:V(R.sin, s), tan:V(R.tan, c * s), sec:V(R.sec, c), csc:V(R.csc, s), cot:V(R.cot, c * s) };
  }
  var FN = { sin:1, cos:1, tan:1, csc:1, sec:1, cot:1, undefined:1 };
  function grp(s, i){ var d = 0, j = i; for (; j < s.length; j++) { if (s[j] === "{") d++; else if (s[j] === "}") { d--; if (!d) break; } } return [s.slice(i + 1, j), j + 1]; }
  function parse(src){
    var out = [], i = 0, buf = "";
    function flush(){ if (buf) { out.push({ t:buf }); buf = ""; } }
    while (i < src.length) {
      var ch = src[i];
      if (ch === "{") {
        var g = grp(src, i);
        if (src[g[1]] === "/" && src[g[1] + 1] === "{") { var g2 = grp(src, g[1] + 1); flush(); out.push({ fn:parse(g[0]), fd:parse(g2[0]) }); i = g2[1]; continue; }
        flush(); out = out.concat(parse(g[0])); i = g[1]; continue;
      }
      if (ch === "√") { var mm = /^\d+/.exec(src.slice(i + 1)) || [""]; flush(); out.push({ r:mm[0] }); i += 1 + mm[0].length; continue; }
      if (/[A-Za-z]/.test(ch)) {
        var w = /^[A-Za-z]+/.exec(src.slice(i))[0];
        if (FN[w]) buf += w; else { flush(); w.split("").forEach(function(c){ out.push({ t:c, i:true }); }); }
        i += w.length; continue;
      }
      buf += ch === "-" ? MINUS : ch; i++;
    }
    flush();
    return out;
  }
  function fnt(sz, it, fm){ return (it ? "italic " : "") + "600 " + sz + "px " + fm; }
  function sum(a){ return a.reduce(function(s, x){ return s + x; }, 0); }
  function widths(ctx, toks, sz, fm){
    return toks.map(function(tk){
      if (tk.fn) { var fs = Math.max(9, Math.round(sz * 0.78)); return Math.max(sum(widths(ctx, tk.fn, fs, fm)), sum(widths(ctx, tk.fd, fs, fm))) + 4; }
      if (tk.r != null) { ctx.font = fnt(sz, false, fm); return sz * 0.62 + ctx.measureText(tk.r).width + 1.5; }
      ctx.font = fnt(sz, tk.i, fm); return ctx.measureText(tk.t).width;
    });
  }
  function hasFrac(toks){ return toks.some(function(t){ return t.fn; }); }
  function drawToks(ctx, toks, x, y, sz, fm, col){
    var ws = widths(ctx, toks, sz, fm);
    toks.forEach(function(tk, i){
      if (tk.fn) {
        var fs = Math.max(9, Math.round(sz * 0.78)), wn = sum(widths(ctx, tk.fn, fs, fm)), wd = sum(widths(ctx, tk.fd, fs, fm));
        drawToks(ctx, tk.fn, x + (ws[i] - wn) / 2, y - fs * 0.64, fs, fm, col);
        drawToks(ctx, tk.fd, x + (ws[i] - wd) / 2, y + fs * 0.68, fs, fm, col);
        ctx.fillStyle = col; ctx.fillRect(x + 1.5, y - 0.6, ws[i] - 3, Math.max(1.1, sz / 12));
      } else if (tk.r != null) {
        ctx.font = fnt(sz, false, fm); var rw = ctx.measureText(tk.r).width, h = sz * 0.5;
        ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, sz / 13); ctx.lineJoin = "round"; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x + sz * 0.03, y + h * 0.1); ctx.lineTo(x + sz * 0.13, y); ctx.lineTo(x + sz * 0.3, y + h * 0.82); ctx.lineTo(x + sz * 0.55, y - h * 1.02); ctx.lineTo(x + sz * 0.62 + rw + 1, y - h * 1.02); ctx.stroke(); ctx.restore();
        ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(tk.r, x + sz * 0.6, y + sz * 0.05);
      } else { ctx.font = fnt(sz, tk.i, fm); ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(tk.t, x, y + sz * 0.05); }
      x += ws[i];
    });
  }
  // label(ctx, W, H, src, X, Y, o): src "x = {2π}/{3}"; X, Y pixels (Y = vertical middle); o = {size, color, align, bg, bgColor, fm}
  function label(ctx, W, H, src, X, Y, o){
    o = o || {};
    var sz = o.size || 14, fm = o.fm || css("--font-math") || "serif", tk = parse(src), w = sum(widths(ctx, tk, sz, fm)), hh = hasFrac(tk) ? sz * 2.05 : sz * 1.35;
    var x0 = o.align === "right" ? X - w : o.align === "center" ? X - w / 2 : X;
    x0 = Math.max(3, Math.min(W - w - 3, x0)); Y = Math.max(hh / 2 + 2, Math.min(H - hh / 2 - 2, Y));
    ctx.save();
    if (o.bg !== false) { ctx.globalAlpha = 0.9; ctx.fillStyle = o.bgColor || css("--sheet"); ctx.fillRect(x0 - 3, Y - hh / 2, w + 6, hh); ctx.globalAlpha = 1; }
    drawToks(ctx, tk, x0, Y, sz, fm, o.color || css("--ink"));
    ctx.restore();
    return { x:x0, w:w, h:hh };
  }
  function measure(ctx, src, sz){ return sum(widths(ctx, parse(src), sz || 14, css("--font-math") || "serif")); }
  return { info:info, label:label, measure:measure };
})();

// values of the six functions at x: exact when x is a multiple of π/6 or π/4, else decimals
var FV = {
  sin:Math.sin, cos:Math.cos,
  tan:function(x){ var c = Math.cos(x); return Math.abs(c) < 1e-12 ? NaN : Math.sin(x) / c; },
  csc:function(x){ var s = Math.sin(x); return Math.abs(s) < 1e-12 ? NaN : 1 / s; },
  sec:function(x){ var c = Math.cos(x); return Math.abs(c) < 1e-12 ? NaN : 1 / c; },
  cot:function(x){ var s = Math.sin(x); return Math.abs(s) < 1e-12 ? NaN : Math.cos(x) / s; }
};
function val(fn, x){
  var k = kOf(x), I = k != null ? UC.info(k) : null;
  if (I) return { ex:I[fn], v:I[fn].v, undef:I[fn].undef };
  var v = FV[fn](x); return { ex:null, v:v, undef:!isFinite(v) };
}
// "√3/2 ≈ 0.87" (radicals get a decimal), "−1/2", "≈ 0.26", "undefined"
function valHTML(r, st){
  if (r.undef) return "undefined";
  if (r.ex) return MV.m(st ? r.ex.m : r.ex.mi) + (r.ex.rad ? " ≈ " + dec(r.v, 2) : "");
  return "≈ " + dec(r.v, 2);
}
function valSrc(r){ return r.undef ? "undefined" : r.ex ? r.ex.mi : "≈ " + dec(r.v, 2); }

// ---------- canvas helpers ----------
function line(ctx, x1, y1, x2, y2, col, w, dash, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.lineCap = "round";
  if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}
function disc(ctx, x, y, r, fill, stroke, sw, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw || 2; ctx.stroke(); } ctx.restore();
}
function diamond(ctx, x, y, r, fill, stroke){
  ctx.save(); ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); } ctx.restore();
}
function txt(ctx, s, x, y, o){
  o = o || {}; ctx.save(); ctx.font = o.font || ("12px " + (css("--font-ui") || "sans-serif")); ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "middle";
  if (o.bg) { var w = ctx.measureText(s).width, bx = ctx.textAlign === "center" ? x - w / 2 : ctx.textAlign === "right" ? x - w : x; ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(bx - 3, y - 9, w + 6, 18); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink"); ctx.fillText(s, x, y); ctx.restore();
}
// words in the UI font followed by a short maths label (italic letters), on a sheet-coloured backing
function lab2(ctx, p, words, src, X, Y, centre){
  var ui = "12px " + (css("--font-ui") || "sans-serif"), sz = 14;
  ctx.save(); ctx.font = ui; var w1 = ctx.measureText(words).width; ctx.restore();
  var w2 = UC.measure(ctx, src, sz), x0 = centre ? X - (w1 + w2) / 2 : X;
  x0 = clamp(x0, 3, p.W - w1 - w2 - 3);
  ctx.save(); ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, Y - 10, w1 + w2 + 6, 20); ctx.restore();
  txt(ctx, words, x0, Y, { font:ui });
  UC.label(ctx, p.W, p.H, src, x0 + w1, Y, { size:sz, bg:false });
}
// shaded band with the dark-mode --hi outline (plan: --hi-soft is faint in dark mode)
function softRect(ctx, x, y, w, h){
  ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(x, y, w, h);
  if (isDark()) { ctx.strokeStyle = css("--hi"); ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
  ctx.restore();
}

// @component N24 circleGraphLink — a unit circle and a graph that share one vertical scale: the circle's centre sits on the
//   graph's x-axis line, a dotted carry line joins a height on the circle to the same height on the graph, and the graph can
//   run at true scale (one unit on the circle = one unit along the x-axis, so an unrolled arc lands exactly at x). On narrow
//   screens it falls back to two stacked canvases (circle above, graph below) with matching colours. Pilot in MHF4U 31;
//   modules 34 and 35 pair a circle (or wheel) with a graph the same way.
//   layout(o) -> pixel layout of one combined canvas; view(L, gx0, ux) -> MV.Plot view for the graph part;
//   frame(ctx, p, G) draws the graph's grid, axes and π ticks in its region; carry(), unrollPts() and tangent() are the shared
//   annotations (G8, G11).
var N24 = (function(){
  // o: {W, yr (half-height in units), span (graph width in units of u), circW (circle half-width in u), padL, padR, gap,
  //     extra (px to the right of the circle), padY, Hmax}
  function layout(o){
    var padY = o.padY == null ? 12 : o.padY;
    var u = (o.W - o.padL - o.padR - o.gap - (o.extra || 0)) / (2 * o.circW + o.span);
    if (o.Hmax) u = Math.min(u, (o.Hmax - 2 * padY) / (2 * o.yr));
    u = Math.max(6, u);
    var H = Math.round(2 * o.yr * u + 2 * padY), left = Math.max(0, o.W - (o.padL + 2 * o.circW * u + (o.extra || 0) + o.gap + o.span * u + o.padR)) / 3;
    var gR = o.W - o.padR - left, gL = gR - o.span * u;
    return { W:o.W, H:H, u:u, padY:padY, cx:o.padL + left + o.circW * u, cy:H / 2, R:u, gL:gL, gR:gR };
  }
  function view(L, gx0, ux, uy){ uy = uy || L.u; var xmin = gx0 - L.gL / ux; return { xmin:xmin, xmax:xmin + L.W / ux, ymin:-L.H / 2 / uy, ymax:L.H / 2 / uy }; }
  // G: {gL, gR, x0, x1, xStep, xLab (label every n steps), yStep, ymin, ymax, yLabs:[values], tickFont}
  function frame(ctx, p, G){
    var top = p.Y(G.ymax), bot = p.Y(G.ymin), x, y, ui = css("--font-ui") || "sans-serif";
    ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    for (x = Math.ceil(G.x0 / G.xStep - 1e-9) * G.xStep; x <= G.x1 + 1e-9; x += G.xStep) { var px = Math.round(p.X(x)) + 0.5; ctx.moveTo(px, top); ctx.lineTo(px, bot); }
    for (y = Math.ceil(G.ymin / G.yStep - 1e-9) * G.yStep; y <= G.ymax + 1e-9; y += G.yStep) { var py = Math.round(p.Y(y)) + 0.5; ctx.moveTo(G.gL, py); ctx.lineTo(G.gR, py); }
    ctx.stroke();
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath();
    ctx.moveTo(G.gL - 4, p.Y(0)); ctx.lineTo(G.gR + 6, p.Y(0));
    var ax = clamp(p.X(0), G.gL, G.gR); ctx.moveTo(ax, top); ctx.lineTo(ax, bot); ctx.stroke();
    ctx.fillStyle = css("--ink-2"); ctx.font = (G.tickFont || 12) + "px " + ui; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var n = 0, lastR = -1e9;
    for (x = Math.ceil(G.x0 / G.xStep - 1e-9) * G.xStep; x <= G.x1 + 1e-9; x += G.xStep, n++) {
      var k = Math.round(x / G.xStep);
      if (Math.abs(x) < 1e-9 || (G.xLab && k % G.xLab)) continue;
      var lab = MV.piLabel(x), w = ctx.measureText(lab).width, X = p.X(x);
      if (X - w / 2 < lastR + 3) continue;
      ctx.fillText(lab, X, p.Y(0) + 5); lastR = X + w / 2;
    }
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    (G.yLabs || []).forEach(function(v){ if (p.Y(v) > top + 6 && p.Y(v) < bot - 6) ctx.fillText(num(v), ax - 5, p.Y(v)); });
    ctx.restore();
    void n;
  }
  // dotted carry line (--ink-2, [2, 5]) from a point on the circle straight across to the graph
  function carry(ctx, x1, y1, x2, y2){ line(ctx, x1, y1, x2, y2, css("--ink-2"), 1.6, [2, 5]); }
  // the arc from (1, 0) to angle a, unrolled: t 0..0.5 straightens it up the tangent at (1, 0), 0.5..1 lays it on the axis
  // C: {cx, cy, R}; toAxis(s) -> [px, py] for arc length s along the graph's x-axis
  function unrollPts(C, a, t, toAxis){
    var N = 60, out = [];
    for (var i = 0; i <= N; i++) {
      var s = a * i / N, P0 = [C.cx + C.R * Math.cos(s), C.cy - C.R * Math.sin(s)], P1 = [C.cx + C.R, C.cy - s * C.R], P2 = toAxis(s), q;
      if (t <= 0.5) { q = MV.ease(t * 2); out.push([P0[0] + (P1[0] - P0[0]) * q, P0[1] + (P1[1] - P0[1]) * q]); }
      else { q = MV.ease((t - 0.5) * 2); out.push([P1[0] + (P2[0] - P1[0]) * q, P1[1] + (P2[1] - P1[1]) * q]); }
    }
    return out;
  }
  function poly(ctx, pts, col, w, alpha){
    ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
    pts.forEach(function(q, i){ if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.restore();
  }
  // the unit circle with its axes, the angle arc (cerulean) and the point P (ink dot, --hi ring)
  function circle(ctx, C, o){
    var R = C.R, ext = 1.22 * R;
    line(ctx, C.cx - ext, C.cy, C.cx + ext, C.cy, css("--plot-axis"), 1);
    line(ctx, C.cx, C.cy - ext, C.cx, C.cy + ext, css("--plot-axis"), 1);
    ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 2; ctx.beginPath();
    ctx.arc(C.cx, C.cy, R, 0, -TAU * (o.circle == null ? 1 : o.circle), true); ctx.stroke(); ctx.restore();
    if (o.arc != null && Math.abs(o.arc) > 1e-6) {
      ctx.save(); ctx.strokeStyle = css("--p-t"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(C.cx, C.cy, R, 0, -o.arc, o.arc > 0); ctx.stroke(); ctx.restore();
      if (o.arcLabel && Math.abs(o.arc) > 0.35) {
        var ma = o.arc / 2, lx = C.cx + (R + 13) * Math.cos(ma), ly = C.cy - (R + 13) * Math.sin(ma);
        txt(ctx, "x", lx, ly, { font:"italic 600 15px " + (css("--font-math") || "serif"), color:css("--p-t"), align:"center", bg:true });
      }
    }
  }
  function point(ctx, X, Y, col){ disc(ctx, X, Y, 10.5, css("--hi")); disc(ctx, X, Y, 6, col || css("--ink"), css("--sheet"), 1.5); }
  return { layout:layout, view:view, frame:frame, carry:carry, unrollPts:unrollPts, poly:poly, circle:circle, point:point };
})();

// ---------- hero (storyboard: circle, one lap traced, the lap unrolls to 2π, then csc x from sin x) ----------
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:0, xmax:1, ymin:-1, ymax:1 }), H0 = MV.C.hero.cap || {};
  var st = { circ:0, axis:0, x:0, lapDone:false, flash:0, unroll:-1, fade:0, yr:1.5, asym:0, csc:0, dia:0 };
  function cap(html){ if (f.cap) f.cap.innerHTML = html || ""; }
  p.render = function(){
    var W = f.canvas.getBoundingClientRect().width; if (W < 40) return;
    var L = N24.layout({ W:W, yr:1.5, span:TAU, circW:1.2, padL:6, padR:24, gap:16, padY:10 });
    if (Math.abs(parseFloat(f.canvas.style.height || 0) - L.H) > 0.5) f.canvas.style.height = L.H + "px";
    var uy = (L.H - 2 * L.padY) / (2 * st.yr), v = N24.view(L, 0, L.u, uy);
    p.draw({ view:v, grid:false, axes:false, ticks:false,
      describe:st.csc >= 1 ? "Unit circle beside the graph of y = csc x, drawn solid, with the dashed graph of y = sin x. Vertical asymptotes at 0, π and 2π. The graphs touch at (π/2, 1) and (3π/2, −1)." : "A point travels around the unit circle while its height traces y = sin x from 0 to 2π.",
      after:function(ctx, pp){
        var C = { cx:L.cx, cy:pp.Y(0), R:uy }, ax = L.gL + (L.gR - L.gL) * st.axis;
        // radian axis
        if (st.axis > 0) {
          line(ctx, L.gL, C.cy, ax, C.cy, css("--plot-axis"), 1.5);
          line(ctx, L.gL, L.padY, L.gL, L.H - L.padY, css("--plot-axis"), 1.2);
          ctx.save(); ctx.fillStyle = css("--ink-2"); ctx.font = "12px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "center"; ctx.textBaseline = "top";
          [1, 2, 3, 4].forEach(function(i){ var X = pp.X(i * PI / 2); if (X <= ax + 1) { line(ctx, X, C.cy - 4, X, C.cy + 4, css("--plot-axis"), 1.2); ctx.fillText(MV.piLabel(i * PI / 2), X, C.cy + 6); } });
          ctx.restore();
        }
        if (st.asym > 0) [0, PI, TAU].forEach(function(xa){ line(ctx, pp.X(xa), 0, pp.X(xa), L.H * st.asym, css("--ink-2"), 1.5, [8, 6]); });
        N24.circle(ctx, C, { circle:st.circ });
        // sine: traced, then faded to dashed --ink-2
        if (st.x > 0) {
          var sinCv = { f:Math.sin, domain:[0, Math.min(st.x, TAU)], width:3 };
          if (st.fade > 0) pp.curve(Object.assign({}, sinCv, { color:css("--ink-2"), width:2, dash:[6, 6], alpha:0.85 * st.fade }));
          if (st.fade < 1) pp.curve(Object.assign({}, sinCv, { color:css("--pen"), alpha:1 - st.fade }));
        }
        if (st.csc > 0) {
          var end = TAU * st.csc;
          pp.curve({ f:FV.csc, domain:[0.0005, Math.min(end, PI - 0.0005)], color:css("--pen"), width:3 });
          if (end > PI) pp.curve({ f:FV.csc, domain:[PI + 0.0005, Math.min(end, TAU - 0.0005)], color:css("--pen"), width:3 });
        }
        if (st.dia > 0) [[PI / 2, 1], [3 * PI / 2, -1]].forEach(function(q){ diamond(ctx, pp.X(q[0]), pp.Y(q[1]), 4 + 3 * st.dia, css("--hi"), css("--ink")); });
        // P with its height bar and the carry line
        if (st.circ >= 1 && !st.lapDone) {
          var px = C.cx + C.R * Math.cos(st.x), py = C.cy - C.R * Math.sin(st.x);
          if (st.axis >= 1) N24.carry(ctx, px, py, pp.X(st.x), pp.Y(Math.sin(st.x)));
          line(ctx, px, C.cy, px, py, css("--pen"), 3);
          if (st.axis >= 1) line(ctx, pp.X(st.x), C.cy, pp.X(st.x), pp.Y(Math.sin(st.x)), css("--pen"), 3);
          N24.point(ctx, px, py);
        } else if (st.lapDone) N24.point(ctx, C.cx + C.R, C.cy);
        if (st.flash > 0) { ctx.save(); ctx.globalAlpha = st.flash; ctx.strokeStyle = css("--hi"); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(C.cx, C.cy, C.R, 0, TAU); ctx.stroke(); ctx.restore(); }
        if (st.unroll >= 0) N24.poly(ctx, N24.unrollPts(C, TAU, st.unroll, function(s){ return [pp.X(s), C.cy]; }), css("--hi"), 6, st.unroll >= 1 ? Math.max(0, 1 - st.fade * 1.4) : 1);
      } });
  };
  function finalFrame(){ st = { circ:1, axis:1, x:TAU, lapDone:true, flash:0, unroll:-1, fade:1, yr:3, asym:1, csc:1, dia:1 }; p.render(); cap(H0.end); }
  if (MV.reduceMotion) { finalFrame(); return; }
  p.render();
  var seq = [
    function(n){ MV.tween({ dur:600, step:function(t){ st.circ = t; p.render(); }, done:n }); },
    function(n){ MV.tween({ dur:600, step:function(t){ st.axis = t; p.render(); }, done:n }); },
    function(n){ MV.tween({ dur:4000, ease:function(t){ return t; }, step:function(t){ st.x = TAU * t; p.render(); }, done:n }); },
    function(n){ st.lapDone = true; cap(H0.lap); MV.tween({ dur:300, step:function(t){ st.flash = t; p.render(); }, done:n }); },
    function(n){ st.flash = 0; MV.tween({ dur:1000, step:function(t){ st.unroll = t; p.render(); }, done:function(){ MV.wait(900, n); } }); },
    function(n){ MV.tween({ dur:600, step:function(t){ st.fade = t; st.yr = 1.5 + 1.5 * t; p.render(); }, done:function(){ st.unroll = -1; n(); } }); },
    function(n){ MV.tween({ dur:600, step:function(t){ st.asym = t; p.render(); }, done:n }); },
    function(n){ MV.tween({ dur:1200, ease:function(t){ return t; }, step:function(t){ st.csc = t; p.render(); }, done:n }); },
    function(n){ MV.tween({ dur:500, step:function(t){ st.dia = t; p.render(); }, done:n }); },
    function(){ cap(H0.end); }
  ];
  (function run(i){ if (i < seq.length) seq[i](function(){ run(i + 1); }); })(0);
}

// @component radioGroup (copied from MHF4U 25) — segmented control or chip row as a real radio group (arrow keys, roving
//   tabindex, lock while animating). radios(host, {label, aria, options:[{id, t}], value, cls, onChange(id)}) -> {set, get, lock}
function radios(host, o){
  var val = String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = (ids.indexOf(val) + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } } };
}

// ---------- Explore: circle-to-graph unwrapper ----------
var ASY = [-1.5 * PI, -0.5 * PI, 0.5 * PI, 1.5 * PI];
function covered(tr, xa){ return (tr || []).some(function(iv){ return iv[0] <= xa + 1e-9 && iv[1] >= xa - 1e-9; }); }
function addTr(tr, a, b){
  var m = [Math.min(a, b), Math.max(a, b)], out = [];
  (tr || []).forEach(function(iv){ if (iv[1] < m[0] - 1e-9 || iv[0] > m[1] + 1e-9) out.push(iv); else m = [Math.min(iv[0], m[0]), Math.max(iv[1], m[1])]; });
  out.push(m); out.sort(function(p, q){ return p[0] - q[0]; });
  return out;
}
function cer(src){ return MV.m("@t{" + src + "}"); }
var LIN = function(t){ return t; };

function explore(host, api){
  var EX = MV.C.explore, U = EX.ui, S = api.S, NM = {};
  EX.challenges.forEach(function(c){ NM[c.id] = c.named || {}; });
  if (S.mode == null) Object.assign(S, { mode:"unwrap", view:"one", x:0, sinOn:true, cosOn:false, trS:[[0, 0]], trC:null, trT:null, partners:false, whole:false, pins:[] });
  S.tc3 = S.tc3 || { p:"", q:"1", lock:false, checked:false };
  S.pins = S.pins || [];
  var fx = {}, anim = null, playing = false, mq = window.matchMedia("(min-width: 820px)"), more = false, capShown = false;
  host.innerHTML =
    '<div class="cg-top"><div id="cg-mode"></div><div id="cg-view"></div></div>' +
    '<div class="cgl" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="cgl-one plot-wrap"><canvas class="plot cgl-c" tabindex="0" role="img" aria-label="Unit circle and graph"></canvas></div>' +
      '<div class="cgl-two"><div class="plot-wrap cgl-cw"><canvas class="plot square cgl-circ" tabindex="0" role="img" aria-label="Unit circle"></canvas></div>' +
      '<div class="plot-wrap"><canvas class="plot cgl-g" tabindex="0" role="img" aria-label="Graph"></canvas></div></div>' +
      '<p class="tiny muted cg-note" id="cg-note"></p><p class="cg-cap" id="cg-cap"></p><div id="cg-frames"></div></div>' +
    '<div class="cg-body"><div class="cg-ctrl">' +
      '<div class="cg-ang"><div class="cg-angtop"><span class="rg-lab">Angle</span><output id="cg-xval" class="cg-xval" for="cg-x"></output></div>' +
      '<div class="cg-slrow"><button type="button" class="btn ghost sm cg-pm" id="cg-minus" aria-label="Decrease x by pi over 12">−</button><input type="range" id="cg-x" step="1" aria-label="Angle x, in steps of pi over 12"><button type="button" class="btn ghost sm cg-pm" id="cg-plus" aria-label="Increase x by pi over 12">+</button></div>' +
      '<p class="tiny cg-lock" id="cg-lock" hidden></p></div>' +
      '<div class="player" id="cg-player"><button type="button" class="btn ghost sm" data-pl="back">Back</button><button type="button" class="btn primary sm" data-pl="step">Step</button>' + (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" data-pl="play" id="cg-play">Play</button>') + "</div>" +
      '<div class="cg-tog" id="cg-tog"></div>' +
      '<div class="cg-acts"><button type="button" class="btn ghost sm" id="cg-unroll">Unroll the arc</button><button type="button" class="btn ghost sm" id="cg-clear">Clear trace</button><button type="button" class="btn ghost sm" id="cg-reset">Reset</button></div>' +
      '<div class="cg-pins" id="cg-pins"></div>' +
    '</div><div class="cg-read"><dl class="read" id="cg-read"></dl><button type="button" class="btn ghost sm cg-more" id="cg-more" aria-expanded="false">More facts</button></div></div>' +
    '<p class="vh" aria-live="polite" id="cg-say"></p>';
  var cv = { w:$(".cgl-c", host), c:$(".cgl-circ", host), g:$(".cgl-g", host) };
  var pw = new MV.Plot(cv.w, { xmin:0, xmax:1, ymin:-1, ymax:1 }), pc = new MV.Plot(cv.c, { xmin:-1, xmax:1, ymin:-1, ymax:1 }), pg = new MV.Plot(cv.g, { xmin:0, xmax:1, ymin:-1, ymax:1 });
  pw.render = pc.render = pg.render = function(){ paintCanvas(); };
  var rMode = radios($("#cg-mode", host), { label:"Mode", options:[{ id:"unwrap", t:"Unwrap" }, { id:"tan", t:"Tangent line" }], value:S.mode, onChange:function(v){ setMode(v); } });
  var rView = radios($("#cg-view", host), { label:"View", options:[{ id:"one", t:"One lap" }, { id:"two", t:"Two laps" }], value:S.view, onChange:function(v){ setView(v); } });
  var slider = $("#cg-x", host);

  function wide(){ return mq.matches; }
  function tanMode(){ return S.mode === "tan"; }
  function yr(){ return tanMode() ? 4 : 1.5; }
  function kRange(){ return S.view === "one" ? [0, 24] : [-24, 24]; }
  function xRange(){ var r = kRange(); return [r[0] * ST, r[1] * ST]; }
  function locked(){ return !!S.tc3.lock; }

  // ----- motion -----
  function setX(nx){
    var ox = S.x; S.x = nx;
    if (fx.unrolled != null && Math.abs(nx - ox) > 1e-9) fx.unrolled = null;
    if (!tanMode()) { if (S.sinOn) S.trS = addTr(S.trS, ox, nx); if (S.cosOn) S.trC = addTr(S.trC, ox, nx); }
    else {
      var before = ASY.filter(function(xa){ return covered(S.trT, xa); });
      S.trT = addTr(S.trT, ox, nx);
      ASY.forEach(function(xa){ if (before.indexOf(xa) < 0 && covered(S.trT, xa)) growAsym(xa); });
    }
  }
  function growAsym(xa){
    fx.grow = fx.grow || {}; fx.grow[xa] = 0; fx.flashArm = 1;
    MV.tween({ dur:400, ease:LIN, step:function(t){ if (fx.grow) fx.grow[xa] = t; fx.flashArm = 1 - t; paintCanvas(); }, done:function(){ if (fx.grow) delete fx.grow[xa]; fx.flashArm = 0; paintCanvas(); } });
  }
  function stop(){ if (anim) { var a = anim; anim = null; a(); } playing = false; }
  function moveTo(x1, dur, o){
    o = o || {}; stop();
    var x0 = S.x;
    if (!dur || Math.abs(x1 - x0) < 1e-12) { setX(x1); settle(); if (o.done) o.done(); return; }
    playing = !!o.play;
    var my = MV.tween({ dur:dur, ease:o.ease || MV.ease, step:function(t){ setX(x0 + (x1 - x0) * t); paint(); liveCtl(); if (o.step) o.step(t); }, done:function(){ if (anim === my) anim = null; playing = false; setX(x1); settle(); if (o.done) o.done(); } });
    if (anim === null && dur) anim = my;
    paintCtl();
  }
  function liveCtl(){
    var r = kRange(), k = curK();
    slider.value = clamp(k, r[0], r[1]);
    $("#cg-xval", host).innerHTML = kOf(S.x) != null ? cer("x = " + angS(k, true)) : cer("x ≈ " + dec(S.x, 2));
  }
  function settle(){ var k = kOf(S.x); if (k != null) S.x = k * ST; api.save(); paint(); paintCtl(); MV.changed(); sayLater(); }
  function curK(){ var k = kOf(S.x); return k != null ? k : Math.round(S.x / ST); }
  function stepBy(d, glide){ if (locked()) return; var r = kRange(), k = clamp(curK() + d, r[0], r[1]); clearFx(); moveTo(k * ST, glide ? 300 : 0); }
  function jumpTo(k){ if (locked()) return; clearFx(); moveTo(clamp(k, kRange()[0], kRange()[1]) * ST, 0); }
  function play(){
    if (locked()) return;
    if (playing) { var k = Math.round(S.x / ST); stop(); moveTo(clamp(k, kRange()[0], kRange()[1]) * ST, 150); return; }
    var end = xRange()[1]; if (S.x >= end - 1e-9) return;
    clearFx(); fx.playCopy = 0;
    moveTo(end, (end - S.x) / (PI / 4) * 1000, { ease:LIN, play:true });
  }
  function clearFx(){ fx.band = null; fx.quad = null; fx.fall = false; fx.ghost = null; fx.ghostArm = null; fx.flashPts = null; fx.flashPiece = null; fx.pinMoving = false; fx.unrolled = null; }

  // ----- mode, view, toggles -----
  function setMode(v){
    stop(); clearFx(); S.mode = v;
    if (v === "tan") { if (!S.trT) S.trT = [[S.x, S.x]]; }
    else if (S.sinOn && !S.trS) S.trS = [[S.x, S.x]];
    api.save(); paintTog(); paint(); paintCtl(); MV.changed(); sayLater();
  }
  function clipTr(tr, a, b){ if (!tr) return tr; var o = []; tr.forEach(function(iv){ var lo = Math.max(iv[0], a), hi = Math.min(iv[1], b); if (hi >= lo) o.push([lo, hi]); }); return o.length ? o : null; }
  function setView(v){
    stop(); clearFx(); S.view = v;
    if (v === "one") {
      if (S.x < -1e-9) S.x += TAU;
      S.trS = clipTr(S.trS, 0, TAU); S.trC = clipTr(S.trC, 0, TAU); S.trT = clipTr(S.trT, 0, TAU);
      if (S.sinOn && !S.trS) S.trS = [[S.x, S.x]]; if (S.cosOn && !S.trC) S.trC = [[S.x, S.x]]; if (tanMode() && !S.trT) S.trT = [[S.x, S.x]];
    }
    api.save(); paint(); paintCtl(); MV.changed(); sayLater();
  }
  function paintTog(){
    var b = function(id, label, on){ return '<button type="button" class="chip cg-t" id="' + id + '" data-k="' + id + '" aria-pressed="' + !!on + '">' + label + "</button>"; };
    var h = tanMode() ? b("cg-partners", "Show " + MV.m("sin x") + " and " + MV.m("cos x"), S.partners)
      : b("cg-tsin", "Trace " + MV.m("sin x"), S.sinOn) + b("cg-tcos", "Trace " + MV.m("cos x"), S.cosOn);
    h += b("cg-whole", "Whole graph", S.whole);
    MV.keepFocus($("#cg-tog", host), function(){ $("#cg-tog", host).innerHTML = h; });
  }
  function paintPins(){
    var el = $("#cg-pins", host);
    if (!tanMode()) { el.innerHTML = ""; return; }
    var pins = S.pins.slice().sort(function(a, b){ return a - b; });
    var h = '<div class="cg-pinrow"><button type="button" class="btn ghost sm" id="cg-pin" data-k="cgpin"' + (locked() || S.pins.length >= 8 || kOf(S.x) == null ? " disabled" : "") + ">Pin this angle</button>" +
      '<span class="tiny muted">' + (pins.length ? "Pins (tap one to remove it):" : "No pins yet.") + "</span></div>";
    if (pins.length) h += '<div class="chips cg-pinchips" role="group" aria-label="Pinned angles">' + pins.map(function(k){ return '<button type="button" class="chip cg-pinchip" data-pin="' + k + '" data-k="pin' + k + '" aria-label="Remove pin at ' + angSay(k) + '">' + angM(k) + " ✕</button>"; }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCtl(){
    var r = kRange(), k = curK(), lk = locked();
    slider.min = r[0]; slider.max = r[1]; slider.value = clamp(k, r[0], r[1]); slider.disabled = lk;
    slider.setAttribute("aria-valuetext", "x = " + (kOf(S.x) != null ? angSay(k) : num(S.x, 2)));
    $("#cg-xval", host).innerHTML = kOf(S.x) != null ? cer("x = " + angS(k, true)) : cer("x ≈ " + dec(S.x, 2));
    $("#cg-minus", host).disabled = lk || k <= r[0]; $("#cg-plus", host).disabled = lk || k >= r[1];
    $$("#cg-player [data-pl]", host).forEach(function(b){
      var a = b.dataset.pl; b.disabled = lk || (a === "back" ? k <= r[0] : (a === "step" ? k >= r[1] : (!playing && S.x >= xRange()[1] - 1e-9)));
      if (a === "play") b.textContent = playing ? "Pause" : "Play";
    });
    $("#cg-unroll", host).disabled = lk || Math.abs(S.x) < 1e-9 || !!fx.unroll;
    var lock = $("#cg-lock", host); lock.hidden = !lk; lock.innerHTML = lk ? U.lock : "";
    var note = $("#cg-note", host);
    note.innerHTML = wide() ? (S.view === "two" ? U.halfNote : "") : (S.view === "one" ? U.trueNote : "");
    paintPins();
  }

  // ----- drawing -----
  function trWords(tr){ return (tr || []).filter(function(iv){ return iv[1] - iv[0] > 1e-6; }).map(function(iv){ return words(iv[0]) + " to " + words(iv[1]); }).join(" and "); }
  function words(x){ var k = kOf(x); return k != null ? angT(k) : num(x, 2); }
  function describe(){
    var x = S.x, k = kOf(x), at = k != null ? angT(k) : num(x, 2), s = val("sin", x), c = val("cos", x), d;
    if (!tanMode()) {
      d = "Unit circle and graph. P at " + at + ", height " + MV.plain(valHTML(s)) + ", run " + MV.plain(valHTML(c)) + ".";
      var a = trWords(S.sinOn ? S.trS : null), b = trWords(S.cosOn ? S.trC : null);
      if (a) d += " The graph of y = sin x is traced from " + a + "."; if (b) d += " The graph of y = cos x is traced from " + b + ".";
    } else {
      var t = val("tan", x);
      d = "Unit circle with the tangent line x = 1, and graph. P at " + at + ". " + (t.undef ? "The arm is vertical, parallel to the tangent line: no meeting point." : "The arm’s line meets the tangent line at T = (1, " + MV.plain(valHTML(t)) + ").");
      var tt = trWords(S.trT); if (tt) d += " The graph of y = tan x is traced from " + tt + ".";
      var as = ASY.filter(function(xa){ return covered(S.trT, xa); }).map(function(xa){ return angT(Math.round(xa / ST)); });
      if (as.length) d += " Vertical asymptotes at " + as.join(", ") + ".";
    }
    if (S.pins.length && tanMode()) d += " Pins at " + S.pins.map(angT).join(", ") + ".";
    return d;
  }
  function drawTrace(p, f, iv, col, w, fall){
    if (iv[1] - iv[0] < 1e-6) return;
    p.curve({ f:f, domain:[iv[0], iv[1]], color:col, width:w });
    if (fall) { var lo = Math.max(iv[0], fall[0]), hi = Math.min(iv[1], fall[1]); if (hi - lo > 1e-6) p.curve({ f:f, domain:[lo, hi], color:col, width:6.5 }); }
  }
  function flag(ctx, X, Y){
    line(ctx, X, Y, X, Y - 20, css("--ink"), 1.5);
    ctx.save(); ctx.beginPath(); ctx.moveTo(X, Y - 20); ctx.lineTo(X + 11, Y - 16); ctx.lineTo(X, Y - 12); ctx.closePath(); ctx.fillStyle = css("--hi"); ctx.fill(); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
  }
  function drawGraph(ctx, p, G){
    var tan = tanMode(), r = yr(), x = S.x, pen = css("--pen"), f3 = css("--f3"), dom = [G.x0, G.x1];
    if (fx.band) softRect(ctx, p.X(fx.band[0]), p.Y(r), p.X(fx.band[1]) - p.X(fx.band[0]), p.Y(-r) - p.Y(r));
    N24.frame(ctx, p, { gL:G.gL, gR:G.gR, x0:G.x0, x1:G.x1, xStep:PI / 2, xLab:(!wide() && S.view === "two") ? 2 : 1, yStep:1, ymin:-r, ymax:r, yLabs:tan ? [-4, -3, -2, -1, 1, 2, 3, 4] : [-1, 1] });
    ctx.save(); ctx.beginPath(); ctx.rect(G.gL - 2, 0, G.gR - G.gL + 4, p.H); ctx.clip();
    if (tan) ASY.forEach(function(xa){
      if (xa < G.x0 - 1e-9 || xa > G.x1 + 1e-9 || !covered(S.trT, xa)) return;
      var g = fx.grow && fx.grow[xa] != null ? fx.grow[xa] : 1, X = p.X(xa), top = p.Y(r), bot = p.Y(-r);
      line(ctx, X, top, X, top + (bot - top) * g, css("--ink-2"), 1.5, [8, 6]);
      if (g >= 1) UC.label(ctx, p.W, p.H, "x = " + angS(Math.round(xa / ST)), X + 5, top + 14, { size:13, color:css("--ink-2"), align:X > G.gR - 70 ? "right" : "left" });
    });
    var AL = 0.35;
    if (S.whole) {
      if (tan) p.curve({ f:FV.tan, domain:dom, color:pen, width:3, alpha:AL });
      else { p.curve({ f:Math.sin, domain:dom, color:pen, width:3, alpha:AL }); p.curve({ f:Math.cos, domain:dom, color:f3, width:2.6, alpha:AL }); }
    }
    if (tan && S.partners) { p.curve({ f:Math.sin, domain:dom, color:pen, width:2.6, alpha:AL }); p.curve({ f:Math.cos, domain:dom, color:f3, width:2.6, alpha:AL }); }
    if (fx.flashPiece) p.curve({ f:Math.sin, domain:fx.flashPiece, color:css("--hi"), width:10, alpha:fx.flashA == null ? 1 : fx.flashA });
    if (fx.ghost) p.curve({ f:function(t){ return Math.sin(t - fx.ghost.s); }, domain:[fx.ghost.s, fx.ghost.s + TAU], color:pen, width:6, alpha:0.3 });
    if (!tan) {
      if (S.sinOn) (S.trS || []).forEach(function(iv){ drawTrace(p, Math.sin, iv, pen, 3, fx.fall ? [PI / 2, 3 * PI / 2] : null); });
      if (S.cosOn) (S.trC || []).forEach(function(iv){ drawTrace(p, Math.cos, iv, f3, 2.6, fx.fall ? [0, PI] : null); });
    } else (S.trT || []).forEach(function(iv){ drawTrace(p, FV.tan, iv, pen, 3); });
    // bars and the point at x
    var X = p.X(x);
    if (!tan) {
      if (S.cosOn && !fx.carryCos) { line(ctx, X, p.Y(0), X, p.Y(Math.cos(x)), f3, 3); disc(ctx, X, p.Y(Math.cos(x)), 4.5, f3); }
      line(ctx, X, p.Y(0), X, p.Y(Math.sin(x)), pen, 3); disc(ctx, X, p.Y(Math.sin(x)), 4.5, pen);
    } else {
      var tv = FV.tan(x);
      if (isFinite(tv) && Math.abs(tv) <= r) { disc(ctx, X, p.Y(tv), 9, css("--hi")); disc(ctx, X, p.Y(tv), 5.5, pen, css("--sheet"), 1.5); }
    }
    if (fx.flashPts) fx.flashPts.forEach(function(q){ disc(ctx, p.X(q[0]), p.Y(q[1]), 12, null, css("--hi"), 4, fx.flashA == null ? 1 : fx.flashA); });
    if (tan) S.pins.forEach(function(k){ var px = p.X(k * ST); if (px >= G.gL - 1 && px <= G.gR + 1) flag(ctx, px, p.Y(0)); });
    // the unrolled arc on the axis (phones: drawn here; wide: drawn by the ribbon)
    if (!wide() && fx.unroll) { var t = clamp((fx.unroll.t - 0.5) * 2, 0, 1); if (t > 0) line(ctx, p.X(0), p.Y(0), p.X(fx.unroll.a * t), p.Y(0), css("--hi"), 6); }
    if (fx.unrolled != null) { line(ctx, p.X(0), p.Y(0), p.X(fx.unrolled), p.Y(0), css("--hi"), 6); unrollLabel(ctx, p, (p.X(0) + p.X(fx.unrolled)) / 2, p.Y(0) - 14); }
    // cerulean tick at x
    line(ctx, X, p.Y(0) - 7, X, p.Y(0) + 7, css("--p-t"), 2.5);
    ctx.restore();
    var k = kOf(x);
    UC.label(ctx, p.W, p.H, k != null ? "x = " + angS(k) : "x ≈ " + dec(x, 2), X, p.Y(0) + 32, { size:13, color:css("--p-t"), align:"center" });
  }
  function unrollLabel(ctx, p, X, Y){ lab2(ctx, p, U.unrollLab.replace(/x$/, ""), "x", X, Y, true); }
  function drawCircle(ctx, Cc, isWide, pp){
    var x = S.x, tan = tanMode(), c = Math.cos(x), s = Math.sin(x), R = Cc.R, cx = Cc.cx, cy = Cc.cy, PX = cx + R * c, PY = cy - R * s;
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3");
    if (fx.quad) softRect(ctx, cx - 1.22 * R, cy - 1.22 * R, 1.22 * R, 1.22 * R);
    N24.circle(ctx, Cc, { arc:fx.unroll || fx.unrolled != null ? null : x, arcLabel:true });
    if (!isWide && fx.unroll) { ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, -fx.unroll.a, fx.unroll.a > 0); ctx.stroke(); ctx.restore(); }
    if (tan) {
      var top = Cc.top, bot = Cc.bot, TX = cx + R;
      ctx.save(); ctx.beginPath(); ctx.rect(0, top, Cc.clipR, bot - top); ctx.clip();
      var drawArmLine = function(a, col, w, dash, alpha){
        var cc = Math.cos(a), ss = Math.sin(a);
        if (Math.abs(cc) < 1e-9) line(ctx, cx, top, cx, bot, col, w, dash, alpha);
        else { var m = ss / cc, xa = (0 - cx) / R, xb = (Cc.clipR - cx) / R; line(ctx, cx + xa * R, cy - m * xa * R, cx + xb * R, cy - m * xb * R, col, w, dash, alpha); }
      };
      drawArmLine(x, ink2, 1.6, [2, 5]);
      if (fx.flashArm > 0) drawArmLine(x, css("--hi"), 5, null, fx.flashArm);
      ctx.restore();
      line(ctx, TX, top, TX, bot, ink, 2);
      lab2(ctx, pp, U.tangentLab.replace(/x = 1$/, ""), "x = 1", TX + 6, top + 11, false);
      if (Math.abs(c) > 1e-9) {
        var tv = s / c, TY = cy - tv * R;
        if (TY < top + 6 || TY > bot - 6) {
          var up = TY < top + 6, ay = up ? top + 24 : bot - 4;
          ctx.save(); ctx.fillStyle = pen; ctx.beginPath();
          if (up) { ctx.moveTo(TX, top + 14); ctx.lineTo(TX - 7, top + 26); ctx.lineTo(TX + 7, top + 26); } else { ctx.moveTo(TX, bot - 4); ctx.lineTo(TX - 7, bot - 16); ctx.lineTo(TX + 7, bot - 16); }
          ctx.closePath(); ctx.fill(); ctx.restore();
          var of = "600 12px " + (css("--font-ui") || "sans-serif"); ctx.save(); ctx.font = of; var ow = ctx.measureText(U.offScreen).width; ctx.restore();
          var oRight = TX + 10 + ow < pp.W - 3;
          txt(ctx, U.offScreen, oRight ? TX + 10 : TX - 10, up ? top + 38 : bot - 26, { bg:true, color:pen, font:of, align:oRight ? "left" : "right" });
          void ay;
        } else {
          disc(ctx, TX, TY, 10, css("--hi")); disc(ctx, TX, TY, 6, pen, css("--sheet"), 1.5);
          txt(ctx, "T", TX - 12, TY - 13, { font:"italic 600 15px " + (css("--font-math") || "serif"), align:"right", color:ink, bg:true });
          var tvv = val("tan", x);
          UC.label(ctx, pp.W, pp.H, tvv.ex ? tvv.ex.m : "≈ " + dec(tvv.v, 2), TX + 12, TY, { size:13, color:pen });
        }
      }
    }
    if (fx.ghostArm != null) {
      var ga = fx.ghostArm; line(ctx, cx, cy, cx + R * Math.cos(ga), cy - R * Math.sin(ga), ink, 3, null, 0.4);
      disc(ctx, cx + R * Math.cos(ga), cy - R * Math.sin(ga), 6, ink, null, 0, 0.4);
    }
    line(ctx, cx, cy, PX, PY, ink, 2);
    if (!tan) {
      if (fx.carryCos) {
        var t = fx.carryCos.t;
        if (t <= 0.5 || !isWide) { var th = clamp(t * 2, 0, 1) * PI / 2; line(ctx, cx, cy, cx + R * c * Math.cos(th), cy - R * c * Math.sin(th), f3, 3.5); }
      } else line(ctx, cx, cy, PX, cy, f3, 3);
    }
    line(ctx, PX, cy, PX, PY, pen, 3);
    N24.point(ctx, PX, PY);
    var lx = PX + (c >= 0 ? 14 : -14);
    txt(ctx, "P", lx, PY + (s >= 0 ? -12 : 12), { font:"italic 600 16px " + (css("--font-math") || "serif"), align:c >= 0 ? "left" : "right", bg:true });
  }
  function drawLinks(ctx, Cc, p){
    var x = S.x;
    if (!tanMode()) {
      if (!fx.carryCos) N24.carry(ctx, Cc.cx + Cc.R * Math.cos(x) + 10, p.Y(Math.sin(x)), p.X(x) - 5, p.Y(Math.sin(x)));
      if (fx.playCopy != null && fx.playCopy < 1) { var q = fx.playCopy, bx = Cc.cx + Cc.R * Math.cos(x) + (p.X(x) - Cc.cx - Cc.R * Math.cos(x)) * q; line(ctx, bx, p.Y(0), bx, p.Y(Math.sin(x)), css("--pen"), 3, null, 0.5); }
    } else {
      var c = Math.cos(x); if (Math.abs(c) < 1e-9) return;
      var tv = Math.sin(x) / c; if (Math.abs(tv) > yr()) return;
      N24.carry(ctx, Cc.cx + Cc.R + 11, p.Y(tv), p.X(x) - 10, p.Y(tv));
    }
    if (fx.carryCos && fx.carryCos.t > 0.5) {
      var u = MV.ease((fx.carryCos.t - 0.5) * 2), cc = Math.cos(x);
      var x1 = Cc.cx + (p.X(x) - Cc.cx) * u, y0 = Cc.cy + (p.Y(0) - Cc.cy) * u, y1 = (Cc.cy - Cc.R * cc) + (p.Y(cc) - (Cc.cy - Cc.R * cc)) * u;
      line(ctx, x1, y0, x1, y1, css("--f3"), 3.5);
    }
    if (fx.unroll) N24.poly(ctx, N24.unrollPts(Cc, fx.unroll.a, fx.unroll.t, function(s){ return [p.X(s), p.Y(0)]; }), css("--hi"), 6);
  }
  function paintCanvas(){
    var d = describe(), tan = tanMode(), one = S.view === "one", r = yr(), x0 = one ? 0 : -TAU, x1 = TAU;
    if (wide()) {
      var W = cv.w.getBoundingClientRect().width; if (W < 40) return;
      var extra = tan ? 104 : 0;
      var L = N24.layout({ W:W, yr:r, span:TAU, circW:1.3, padL:8, padR:30, gap:34, extra:extra, padY:12, Hmax:tan ? Math.min(560, 0.62 * W, Math.max(380, window.innerHeight * 0.68)) : 0 });
      if (Math.abs(parseFloat(cv.w.style.height || 0) - L.H) > 0.5) cv.w.style.height = L.H + "px";
      var ux = one ? L.u : L.u / 2;
      pw.draw({ view:N24.view(L, x0, ux), grid:false, axes:false, ticks:false, describe:d, after:function(ctx, p){
        var Cc = { cx:L.cx, cy:p.Y(0), R:L.u, top:p.Y(r), bot:p.Y(-r), clipR:L.gL - 14 };
        drawGraph(ctx, p, { gL:L.gL, gR:L.gR, x0:x0, x1:x1 });
        drawCircle(ctx, Cc, true, p);
        drawLinks(ctx, Cc, p);
      } });
    } else {
      pc.draw({ view:tan ? { xmin:-1.4, xmax:2.5, ymin:-2.6, ymax:2.6 } : { xmin:-1.4, xmax:1.4, ymin:-1.4, ymax:1.4 }, equal:true, grid:false, axes:false, ticks:false, describe:d, after:function(ctx, p){
        drawCircle(ctx, { cx:p.X(0), cy:p.Y(0), R:p.X(1) - p.X(0), top:4, bot:p.H - 4, clipR:p.W }, false, p);
      } });
      var pad = (x1 - x0) * 0.05;
      pg.draw({ view:{ xmin:x0 - pad, xmax:x1 + pad * 0.6, ymin:-r - 0.12 * r, ymax:r + 0.12 * r }, grid:false, axes:false, ticks:false, describe:d, after:function(ctx, p){
        drawGraph(ctx, p, { gL:p.X(x0), gR:p.X(x1), x0:x0, x1:x1 });
      } });
    }
  }

  // ----- readout -----
  var MOVE = {
    q1:"`P` is moving up and to the left: `sin x` is increasing and `cos x` is decreasing",
    q2:"`P` is moving down and to the left: `sin x` is decreasing and `cos x` is decreasing",
    q3:"`P` is moving down and to the right: `sin x` is decreasing and `cos x` is increasing",
    q4:"`P` is moving up and to the right: both are increasing",
    r:"`P` is at the far right: `cos x` is at its maximum, 1; `sin x` is increasing",
    t:"`P` is at the top: `sin x` is at its maximum, 1; `cos x` is decreasing",
    l:"`P` is at the far left: `cos x` is at its minimum, −1; `sin x` is decreasing",
    b:"`P` is at the bottom: `sin x` is at its minimum, −1; `cos x` is increasing"
  };
  function where(x){
    var c = Math.cos(x), s = Math.sin(x), e = 1e-9;
    if (Math.abs(s) < e) return c > 0 ? "r" : "l"; if (Math.abs(c) < e) return s > 0 ? "t" : "b";
    return s > 0 ? (c > 0 ? "q1" : "q2") : (c < 0 ? "q3" : "q4");
  }
  function rows(){
    var x = S.x, k = kOf(x), tan = tanMode(), R = [], st = k != null, w = where(x);
    var ang;
    if (st && k === 0) ang = cer("x = 0") + ": `P` is at its start, (1, 0)";
    else if (st && k > 0) ang = cer("x = " + angS(k, true)) + ": `P` has travelled " + angM(k) + " ≈ " + dec(x, 2) + " around the circle";
    else if (st) ang = cer("x = " + angS(k, true)) + ": `P` has travelled " + angM(-k) + " clockwise";
    else ang = cer("x ≈ " + dec(x, 2)) + ": `P` has travelled " + dec(Math.abs(x), 2) + (x < 0 ? " clockwise" : " around the circle");
    R.push(["Angle", ang]);
    var I = st ? UC.info(k) : null;
    R.push(["Point " + MV.m("P"), I ? MV.m("(" + I.cos.m + ", " + I.sin.m + ")") : "≈ (" + dec(Math.cos(x), 2) + ", " + dec(Math.sin(x), 2) + ")"]);
    var sv = val("sin", x), cvv = val("cos", x);
    var ext = function(r, hi, lo){ return Math.abs(r.v - 1) < 1e-9 ? " (" + hi + ")" : Math.abs(r.v + 1) < 1e-9 ? " (" + lo + ")" : ""; };
    R.push([MV.m("sin x") + " (height of " + MV.m("P") + ")", valHTML(sv, true) + ext(sv, "the highest " + MV.m("P") + " gets", "the lowest " + MV.m("P") + " gets"), tan ? "more" : ""]);
    R.push([MV.m("cos x") + " (run of " + MV.m("P") + ")", valHTML(cvv, true) + ext(cvv, "farthest right", "farthest left"), tan ? "more" : ""]);
    if (tan) {
      var tv = val("tan", x);
      R.push([MV.m("tan x"), tv.undef ? "undefined: `cos x = 0`, so `sin x ÷ cos x` divides by 0" : valHTML(tv, true) + ": the slope of `P`’s arm, `sin x ÷ cos x`"]);
      var Trow;
      if (tv.undef) Trow = "No meeting point: the arm is parallel to the tangent line";
      else {
        var Tp = tv.ex ? "`T` = " + MV.m("(1, " + tv.ex.m + ")") + ". " : "`T` ≈ " + MV.m("(1, " + dec(tv.v, 2) + ")") + ". ";
        if (w === "q1" || w === "q4" || w === "r") Trow = Tp + "The arm itself reaches the tangent line";
        else if (w === "l") Trow = Tp + "`P` is on the negative `x`-axis, so the arm’s line meets `x = 1` when it is extended back through the origin, at the axis";
        else Trow = Tp + "`P` is in quadrant " + (w === "q2" ? "2" : "3") + ", so the arm’s line meets `x = 1` when it is extended back through the origin, " + (w === "q2" ? "below" : "above") + " the axis";
      }
      R.push(["Meeting point " + MV.m("T"), Trow]);
    }
    R.push(["Moving", MOVE[w] + '<span class="tiny muted cg-mnote">' + U.movingNote + "</span>", fx.pinMoving ? "hl" : ""]);
    var fn = tan ? "tan" : "sin", lap;
    if (st && k >= 24) lap = "One full lap: back at the start, so every value repeats";
    else if (x >= -1e-9) lap = "First lap (`0 ≤ x < 2π`)";
    else if (st) { var fv = val(fn, x); lap = "Going clockwise: `x = " + angS(k) + "` is the same point as `x + 2π = " + angS(k + 24) + "`, so `" + fnAt(fn, k) + " = " + fnAt(fn, k + 24) + "` " + (fv.undef ? "is undefined" : "= " + MV.m(valSrc(fv))); }
    else lap = "Going clockwise: `x ≈ " + dec(x, 2) + "` is the same point as `x + 2π ≈ " + dec(x + TAU, 2) + "`";
    R.push(["Lap", lap, "more"]);
    if (!tan) R.push(["Wave facts", U.waveFacts, "more"]);
    else {
      var same = "…";
      if (st) {
        var kr = kRange(), list = [];
        for (var j = -2; j <= 2; j++) { if (!j) continue; var kk = k + 12 * j; if (kk >= kr[0] && kk <= kr[1]) list.push(kk); }
        var tvx = val("tan", x), tail = tvx.undef ? "`tan x` is undefined there too" : "`tan x = " + valSrc(tvx) + "` there too";
        if (list.length === 1 && Math.abs(list[0] - k) === 12) same = "`x " + (list[0] > k ? "+" : "-") + " π = " + angS(list[0]) + "`: the arm points the opposite way along the same line, so " + (tvx.undef ? "`" + fnAt("tan", list[0]) + "` is undefined too" : "`" + fnAt("tan", list[0]) + " = " + valSrc(tvx) + "` too");
        else same = list.map(function(q){ return angM(q); }).join(", ").replace(/, ([^,]*)$/, " and $1") + ": the arm lies along the same line at each, so " + tail;
      }
      R.push(["Same line as", same, "more"]);
    }
    return R;
  }
  function paintRead(){
    var dl = $("#cg-read", host), R = rows();
    dl.innerHTML = R.map(function(r){ return '<div class="' + (r[2] || "") + '"><dt>' + r[0] + "</dt><dd>" + MV.md(r[1]) + "</dd></div>"; }).join("");
    dl.classList.toggle("open", more);
  }
  var sayT = null;
  function sayLater(){
    clearTimeout(sayT);
    sayT = setTimeout(function(){ var R = rows().slice(0, tanMode() ? 6 : 5); $("#cg-say", host).textContent = R.map(function(r){ return MV.plain(MV.md(r[0])) + ": " + MV.plain(MV.md(r[1])); }).join(". "); }, 400);
  }
  function paint(){ paintCanvas(); paintRead(); }

  // ----- events -----
  slider.addEventListener("input", function(){ if (locked()) return; stop(); clearFx(); setX(+slider.value * ST); settle(); });
  slider.addEventListener("keydown", function(e){
    var r = kRange(), k = curK();
    if (e.key === "PageUp") { e.preventDefault(); jumpTo(k + 6); } else if (e.key === "PageDown") { e.preventDefault(); jumpTo(k - 6); }
    else if (e.key === "Home") { e.preventDefault(); jumpTo(r[0]); } else if (e.key === "End") { e.preventDefault(); jumpTo(r[1]); }
  });
  [cv.w, cv.c, cv.g].forEach(function(c){
    c.addEventListener("keydown", function(e){
      var r = kRange(), k = curK(), key = e.key;
      if (key === "ArrowRight" || key === "ArrowUp") jumpTo(k + 1); else if (key === "ArrowLeft" || key === "ArrowDown") jumpTo(k - 1);
      else if (key === "PageUp") jumpTo(k + 6); else if (key === "PageDown") jumpTo(k - 6);
      else if (key === "Home") jumpTo(r[0]); else if (key === "End") jumpTo(r[1]);
      else if (key === " " || key === "Spacebar") { if (MV.reduceMotion) stepBy(1, true); else play(); }
      else return;
      e.preventDefault();
    });
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "cg-minus") stepBy(-1, true);
    else if (b.id === "cg-plus") stepBy(1, true);
    else if (b.dataset.pl === "back") stepBy(-1, true);
    else if (b.dataset.pl === "step") stepBy(1, true);
    else if (b.dataset.pl === "play") play();
    else if (b.id === "cg-tsin") { S.sinOn = !S.sinOn; S.trS = S.sinOn ? [[S.x, S.x]] : null; done(); }
    else if (b.id === "cg-tcos") { S.cosOn = !S.cosOn; S.trC = S.cosOn ? [[S.x, S.x]] : null; done(); if (S.cosOn) carryCos(); }
    else if (b.id === "cg-partners") { S.partners = !S.partners; done(); }
    else if (b.id === "cg-whole") { S.whole = !S.whole; done(); }
    else if (b.id === "cg-unroll") unroll();
    else if (b.id === "cg-clear") { stop(); clearFx(); if (S.sinOn) S.trS = [[S.x, S.x]]; if (S.cosOn) S.trC = [[S.x, S.x]]; if (S.trT) S.trT = [[S.x, S.x]]; done(); }
    else if (b.id === "cg-reset") { stop(); clearFx(); Object.assign(S, { mode:"unwrap", view:"one", x:0, sinOn:true, cosOn:false, trS:[[0, 0]], trC:null, trT:null, partners:false, whole:false }); rMode.set("unwrap"); rView.set("one"); done(); MV.banner("", ""); }
    else if (b.id === "cg-pin") { var k = kOf(S.x); if (k != null && S.pins.indexOf(k) < 0 && S.pins.length < 8) S.pins.push(k); done(); }
    else if (b.dataset.pin != null) { var pk = +b.dataset.pin; S.pins = S.pins.filter(function(q){ return q !== pk; }); done(); var nb = $("#cg-pin", host); if (nb && !$("[data-pin]", host)) nb.focus(); }
    else if (b.id === "cg-more") { more = !more; b.setAttribute("aria-expanded", more); b.textContent = more ? "Fewer facts" : "More facts"; paintRead(); }
  });
  function done(){ api.save(); paintTog(); paint(); paintCtl(); MV.changed(); sayLater(); }
  mq.addEventListener ? mq.addEventListener("change", function(){ paint(); paintCtl(); }) : mq.addListener(function(){ paint(); paintCtl(); });

  // ----- storyboard animations -----
  function carryCos(cb){
    if (tanMode() || !S.cosOn) { if (cb) cb(); return; }
    if (!capShown) { $("#cg-cap", host).innerHTML = MV.md(U.carryCap); capShown = true; }
    fx.carryCos = { t:0 };
    MV.tween({ dur:1000, ease:LIN, step:function(t){ if (fx.carryCos) fx.carryCos.t = t; paintCanvas(); }, done:function(){ fx.carryCos = null; paintCanvas(); if (cb) cb(); } });
  }
  function unroll(){
    if (Math.abs(S.x) < 1e-9) return;
    stop(); var a = S.x; fx.unrolled = null; fx.unroll = { a:a, t:0 }; paintCtl();
    MV.tween({ dur:1200, ease:LIN, step:function(t){ if (fx.unroll) fx.unroll.t = t; paintCanvas(); }, done:function(){ fx.unroll = null; fx.unrolled = a; paintCanvas(); paintCtl(); } });
  }
  function flashA(dur, cb){ fx.flashA = 1; MV.tween({ dur:dur, ease:LIN, step:function(t){ fx.flashA = 1 - t; paintCanvas(); }, done:function(){ fx.flashA = 0; fx.flashPts = null; fx.flashPiece = null; paintCanvas(); if (cb) cb(); } }); }
  function framesUI(list, cb){
    // reduced motion: still frames with a Next button (plan: P4)
    var el = $("#cg-frames", host), i = 0;
    function show(){
      list[i]();
      el.innerHTML = '<div class="q-actions"><span class="tiny muted">Frame ' + (i + 1) + " of " + list.length + '</span><button type="button" class="btn primary sm" id="cg-next">' + (i < list.length - 1 ? "Next frame" : "Finish") + "</button></div>";
      $("#cg-next", host).focus({ preventScroll:true });
    }
    el.onclick = function(e){ if (!e.target.closest("#cg-next")) return; i++; if (i < list.length) show(); else { el.innerHTML = ""; el.onclick = null; cb(); } };
    show();
  }
  function startState(o){
    stop(); clearFx(); fx.carryCos = null; fx.unroll = null;
    Object.assign(S, o);
    rMode.set(S.mode); rView.set(S.view);
    api.save(); paintTog(); paint(); paintCtl();
  }
  var predict = {
    start:function(p){
      $("#cg-frames", host).innerHTML = "";
      if (p.id === "p1") startState({ mode:"unwrap", view:"one", x:0, sinOn:true, cosOn:true, trS:[[0, 0]], trC:[[0, 0]], partners:false, whole:false });
      else if (p.id === "p2") startState({ mode:"unwrap", view:"two", x:0, sinOn:true, cosOn:false, trS:[[0, TAU]], trC:null, partners:false, whole:false });
      else if (p.id === "p3") startState({ mode:"tan", view:"one", x:PI / 6, trT:[[PI / 6, PI / 6]], partners:false, whole:false });
      else if (p.id === "p4") startState({ mode:"tan", view:"one", x:5 * PI / 12, trT:[[5 * PI / 12, 5 * PI / 12]], partners:true, whole:false });
    },
    run:function(p, finish){
      var fin = function(){ settle(); finish(); };
      if (p.id === "p1") {
        fx.pinMoving = true; paintRead();
        carryCos(function(){
          fx.fall = true;
          moveTo(TAU, 8000, { ease:LIN, done:function(){ fx.band = [PI / 2, PI]; fx.quad = 2; fx.pinMoving = true; fin(); } });
        });
      } else if (p.id === "p2") {
        moveTo(-TAU, 8000, { ease:LIN, done:function(){
          fx.ghost = { s:0 };
          MV.tween({ dur:1200, step:function(t){ fx.ghost.s = -TAU * t; paintCanvas(); }, done:function(){ fx.ghost = null; fx.flashPiece = [-TAU, 0]; flashA(700, fin); } });
        } });
      } else if (p.id === "p3") {
        fx.ghostArm = PI / 6;
        moveTo(7 * PI / 6, 1500, { done:function(){ fx.ghostArm = PI / 6; fx.flashPts = [[PI / 6, Math.sqrt(3) / 3], [7 * PI / 6, Math.sqrt(3) / 3]]; flashA(900, function(){ fx.ghostArm = PI / 6; paintCanvas(); fin(); }); } });
      } else if (p.id === "p4") {
        if (MV.reduceMotion) {
          framesUI([
            function(){ moveTo(5 * PI / 12, 0); },
            function(){ moveTo(PI / 2, 0); MV.banner("", MV.plain(MV.md(U.p4Banner))); },
            function(){ moveTo(7 * PI / 12, 0); }
          ], fin);
          return;
        }
        var said = false;
        moveTo(7 * PI / 12, 3000, { ease:LIN, step:function(){ if (!said && S.x >= PI / 2 - 1e-9) { said = true; MV.banner("", MV.plain(MV.md(U.p4Banner))); } }, done:fin });
      } else fin();
    }
  };
  // play: a copy of the height bar slides along the carry line once, as Play starts
  var basePlay = play;
  play = function(){
    if (!playing && wide() && !tanMode() && !MV.reduceMotion && !locked() && S.x < xRange()[1] - 1e-9) {
      fx.playCopy = 0;
      MV.tween({ dur:500, step:function(t){ fx.playCopy = t; paintCanvas(); }, done:function(){ fx.playCopy = null; paintCanvas(); } });
    }
    basePlay();
  };

  // ----- target challenges -----
  function inK(k, list){ return list.indexOf(k) >= 0; }
  function tc1(){
    var k = kOf(S.x), N = NM.tc1;
    if (k != null && inK(k, [22, -2])) return { ok:true };
    if (k == null) return { ok:false, msg:N.other };
    if (inK(k, [14, -10])) return { ok:false, msg:N.side };
    if (inK(k, [2, 10, -14, -22])) return { ok:false, msg:N.plus };
    if (inK(k, [20, -4])) return { ok:false, msg:N.deep };
    if (inK(k, [18, -6])) return { ok:false, msg:N.bottom };
    if (inK(k, [8, -16])) return { ok:false, msg:N.swap };
    return { ok:false, msg:N.other };
  }
  function tc2(){
    var N = NM.tc2, pins = S.pins.slice().sort(function(a, b){ return a - b; }), want = [-15, -3, 9, 21], i;
    if (!pins.length) return { ok:false, msg:N.none };
    for (i = 0; i < pins.length; i++) if (inK(pins[i], [-21, -9, 3, 15])) return { ok:false, msg:fill(N.one, { a:angM(pins[i]) }) };
    for (i = 0; i < pins.length; i++) if (inK(pins[i], [-18, -6, 6, 18])) return { ok:false, msg:fill(N.undef, { a:angM(pins[i]) }) };
    for (i = 0; i < pins.length; i++) if (!inK(pins[i], want)) return { ok:false, msg:fill(N.other, { a:angM(pins[i]), v:MV.m(valSrc(val("tan", pins[i] * ST))) }) };
    if (pins.join() === want.join()) return { ok:true };
    if (pins.join() === "9,21") return { ok:false, msg:N.half };
    return { ok:false, msg:fill(N.some, { n:pins.length }) };
  }
  // TC3: commit first (π-multiple box inside the challenge card; the slider locks until the first check)
  function tc3Read(){ var t = String(S.tc3.p == null ? "" : S.tc3.p).trim().replace("−", "-"), q = +S.tc3.q; if (!/^-?\d+$/.test(t) || [1, 2, 3, 4, 6].indexOf(q) < 0) return null; return { p:parseInt(t, 10), q:q }; }
  function uncount(){ setTimeout(function(){ var st = MV.S.chal.tc3; if (st && st.tries > 0) { st.tries--; MV.save(); } }, 0); }
  function tc3(live){
    var N = NM.tc3, r = tc3Read();
    if (live) return { ok:false };
    if (!r) { uncount(); return { ok:false, msg:N.empty }; }
    var k = r.p * 12 / r.q;
    if (Math.abs(r.p) > 24 || Math.abs(k) > 24) { uncount(); return { ok:false, msg:N.range }; }
    // first check, right or wrong: P glides to the entered angle, the Moving row lights up, the slider unlocks
    {
      S.tc3.checked = true; S.tc3.lock = false;
      if (k < 0 && S.view === "one") { S.view = "two"; rView.set("two"); }
      clearFx(); fx.pinMoving = true;
      setTimeout(function(){ moveTo(k * ST, 900, { done:function(){ fx.pinMoving = true; paintRead(); } }); paintCtl(); }, 0);
    }
    if (inK(k, [16, -8])) return { ok:true };
    if (inK(k, [4, -20])) return { ok:false, msg:N.q1 };
    if (inK(k, [14, -10])) return { ok:false, msg:N.sixth };
    if (inK(k, [15, -9])) return { ok:false, msg:N.quarter };
    if (inK(k, [8, 20, -4, -16])) return { ok:false, msg:N.neg };
    return { ok:false, msg:N.other };
  }
  function tc3Box(box){
    var solved = MV.S.chal.tc3 && MV.S.chal.tc3.solved;
    box.innerHTML = '<div class="tc3-in"><span class="m"><i>x</i> =</span> <input type="number" step="1" min="-24" max="24" id="tc3-p" class="tc3-p" autocomplete="off" aria-label="Number on top, a whole number from negative 24 to 24" value="' + MV.esc(S.tc3.p) + '"' + (solved ? " disabled" : "") + '> <span class="tc3-sl" aria-hidden="true">/</span> <select id="tc3-q" class="tc3-q" aria-label="Number underneath"' + (solved ? " disabled" : "") + ">" +
      [1, 2, 3, 4, 6].map(function(q){ return '<option value="' + q + '"' + (String(q) === String(S.tc3.q) ? " selected" : "") + ">" + q + "</option>"; }).join("") + '</select> <span class="m">π</span></div><p class="tiny muted" style="margin:4px 0 0">' + U.tc3Hint + "</p>";
  }
  function lockNow(){ var st = MV.S.chal.tc3 || {}; if (!st.solved && !S.tc3.checked && !S.tc3.lock) { stop(); S.tc3.lock = true; api.save(); paintCtl(); } }
  function mountTc3(){ var box = $('#chal [data-c="tc3"] .tc3-box'); if (box && !box.firstChild) tc3Box(box); }
  var chal = $("#chal");
  if (chal) {
    new MutationObserver(mountTc3).observe(chal, { childList:true, subtree:true });
    chal.addEventListener("input", function(e){ if (e.target.id === "tc3-p") { S.tc3.p = e.target.value; lockNow(); api.save(); } });
    chal.addEventListener("change", function(e){ if (e.target.id === "tc3-q") { S.tc3.q = e.target.value; lockNow(); api.save(); } });
    chal.addEventListener("focusin", function(e){ if (e.target.id === "tc3-p" || e.target.id === "tc3-q") lockNow(); });
  }
  setTimeout(mountTc3, 0);

  paintTog(); paint(); paintCtl(); sayLater();
  return {
    predict:predict,
    challenge:function(id, opt){
      var live = opt && opt.live;
      if (id === "tc1") return tc1();
      if (id === "tc2") return tc2();
      if (id === "tc3") { var r = tc3(live); if (!live && r.ok) { S.tc3.lock = false; api.save(); paintCtl(); } return r; }
      return { ok:false };
    }
  };
}

// ---------- Part 3: reciprocal graph builder (layers: asymptotes, (zeros), points that stay put, shapes, draw and probe) ----------
function sameSet(a, b){ var x = a.slice().sort(function(p, q){ return p - q; }), y = b.slice().sort(function(p, q){ return p - q; }); return x.join() === y.join(); }
function qSay(q){ return angSay(3 * q); }
function part3(host, api){
  var B = MV.C.part3.builder, BL = B.builds, S = api.S, PF = { sin:Math.sin, cos:Math.cos, tan:FV.tan }, fx = {};
  S.cur = S.cur || "csc"; S.b = S.b || {}; S.done = S.done || {};
  function bld(){ return BL.filter(function(b){ return b.id === S.cur; })[0]; }
  function bs(id){ return S.b[id] || (S.b[id] = { stage:"l1", sel:[], sel1b:[], sel2:[], shape:{}, bad:{}, tries:{}, drawn:0, probe:2, band:false, msg:null }); }
  function unlocked(i){ return i === 0 || !!S.done[BL[i - 1].id]; }
  function stages(b){ return b.id === "cot" ? ["l1", "l1b", "l2", "l3", "l4"] : ["l1", "l2", "l3", "l4"]; }
  function past(st, s){ var b = bld(), L = stages(b); if (st.stage === "done") return true; return L.indexOf(st.stage) > L.indexOf(s); }
  function bounds(b){ var xs = [0].concat(b.asym.filter(function(q){ return q > 0 && q < 8; }), [8]); var out = []; for (var i = 0; i + 1 < xs.length; i++) out.push([xs[i] * PI / 4, xs[i + 1] * PI / 4, b.asym.indexOf(xs[i]) >= 0, b.asym.indexOf(xs[i + 1]) >= 0]); return out; }
  host.innerHTML = '<div class="rb-builds chips" id="rb-builds" role="group" aria-label="Builds"></div>' +
    '<div class="rcb"><div class="rb-g"><div class="plot-wrap rb-wrap"><canvas class="plot" id="rb-plot" role="img" aria-label="Graph"></canvas><div class="rb-taps" id="rb-taps" role="group" aria-label="Tap targets"></div></div>' +
    '<p class="rb-line" id="rb-line" aria-live="polite"></p></div>' +
    '<div class="rb-card"><div id="rb-head"></div><div id="rb-main"></div><div id="rb-play"></div><div id="rb-after"></div></div></div>' +
    '<details class="alg" id="rb-alg"><summary>Check it with algebra</summary><div id="rb-algb"></div></details>';
  var plot = new MV.Plot($("#rb-plot", host), { xmin:-0.35, xmax:TAU + 0.35, ymin:-4, ymax:4 }), taps = $("#rb-taps", host), focusI = 0;
  var good = function(h){ return '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (h || "") + "</p></div>"; };
  var bad = function(h){ return '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + h + "</p></div>"; };
  var stayLab = function(y){ return y > 0 ? B.stay1 : B.stayM1; };

  plot.render = function(){
    var b = bld(), st = bs(b.id), pf = PF[b.partner], f = FV[b.fn], ink2 = css("--ink-2"), pen = css("--pen");
    var desc = st.stage === "done" ? b.describe : "Dashed graph of y = " + b.partner + " x from 0 to 2π. Building y = " + b.fn + " x." +
      (past(st, "l1") ? " Vertical asymptotes at " + b.asym.map(function(q){ return angT(3 * q); }).join(", ") + "." : "") +
      (b.zeros && past(st, "l1b") ? " Zeros at π/2 and 3π/2." : "") + (past(st, "l2") ? " Points that stay put: " + b.stay.map(function(s){ return "(" + angT(3 * s[0]) + ", " + (s[1] < 0 ? MINUS : "") + "1)"; }).join(", ") + "." : "") +
      (st.drawn ? " " + st.drawn + " of " + bounds(b).length + " pieces drawn." : "");
    plot.draw({ view:{ xmin:-0.35, xmax:TAU + 0.35, ymin:-4, ymax:4 }, xTicks:{ step:PI / 4, fmt:function(){ return ""; } }, yTicks:{ step:1 }, describe:desc,
      after:function(ctx, p){
        ctx.save(); ctx.fillStyle = css("--ink-2"); ctx.font = "12px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "center"; ctx.textBaseline = "top";
        for (var lq = 1; lq <= 4; lq++) ctx.fillText(MV.piLabel(lq * PI / 2), p.X(lq * PI / 2), p.Y(0) + 19);
        ctx.restore();
        if (st.stage === "done" && st.band) {
          softRect(ctx, p.X(0), p.Y(1), p.X(TAU) - p.X(0), p.Y(-1) - p.Y(1));
          txt(ctx, B.bandLab, p.X(TAU) - 4, p.Y(0.55), { align:"right", bg:true, color:css("--ink") });
        }
        p.curve({ f:pf, domain:[0, TAU], color:ink2, width:2, dash:[6, 6], alpha:0.85 });
        if (past(st, "l1")) b.asym.forEach(function(q){
          var xa = q * PI / 4, g = fx.grow != null ? fx.grow : 1, X = p.X(xa);
          line(ctx, X, 0, X, p.H * g, ink2, 1.5, [8, 6]);
          if (g >= 1) UC.label(ctx, p.W, p.H, "x = " + angS(3 * q), X + (q === 8 ? -5 : 5), 14, { size:12, color:ink2, align:q === 8 ? "right" : "left" });
        });
        if (b.zeros && past(st, "l1b")) b.zeros.forEach(function(q){ var X = p.X(q * PI / 4); disc(ctx, X, p.Y(0), 6, pen, css("--sheet"), 1.5); UC.label(ctx, p.W, p.H, B.zeroLab, X, p.Y(0) + (q === 2 ? 24 : -24), { size:12, align:"center", color:pen }); });
        var bs4 = bounds(b);
        for (var i = 0; i < bs4.length; i++) {
          var full = i < st.drawn, grow = fx.piece && fx.piece.i === i ? fx.piece.t : (full ? 1 : 0); if (grow <= 0) continue;
          var a0 = bs4[i][0] + (bs4[i][2] ? 1e-4 : 0), a1 = bs4[i][1] - (bs4[i][3] ? 1e-4 : 0);
          p.curve({ f:f, domain:[a0, a0 + (a1 - a0) * grow], color:pen, width:3.2 });
        }
        if (past(st, "l2")) b.stay.forEach(function(s){
          var X = p.X(s[0] * PI / 4), Y = p.Y(s[1]); diamond(ctx, X, Y, 7, css("--hi"), css("--ink"));
          txt(ctx, stayLab(s[1]), clamp(X, 60, p.W - 60), Y + (s[1] > 0 ? -18 : 18), { align:"center", bg:true, font:"11.5px " + (css("--font-ui") || "sans-serif") });
        });
        if (st.stage === "done") {
          var x = st.probe * ST, py = pf(x), ry = f(x), X = p.X(x);
          line(ctx, X, 0, X, p.H, css("--plot-axis"), 1, [2, 4], 0.5);
          if (isFinite(py) && isFinite(ry)) line(ctx, X, p.Y(py), X, p.Y(clamp(ry, -4.5, 4.5)), ink2, 1.8, [2, 5]);
          if (isFinite(py)) disc(ctx, X, p.Y(py), 5, ink2, css("--sheet"), 1.5);
          if (isFinite(ry) && Math.abs(ry) <= 4) { disc(ctx, X, p.Y(ry), 9, css("--hi")); disc(ctx, X, p.Y(ry), 5.5, pen, css("--sheet"), 1.5); }
        }
      } });
  };
  plot.onDrawn(placeTaps);
  function tapList(){
    var b = bld(), st = bs(b.id), out = [], pf = PF[b.partner];
    if (st.stage === "l1" || st.stage === "l1b") for (var q = 0; q <= 8; q++) out.push({ q:q, x:q * PI / 4, y:0, on:(st.stage === "l1" ? st.sel : st.sel1b).indexOf(q) >= 0, lab:"x equals " + qSay(q), cls:"rb-t" });
    else if (st.stage === "l2") for (var r = 0; r <= 8; r++) { var y = pf(r * PI / 4); if (!isFinite(y)) continue; var v = val(b.partner, r * PI / 4); out.push({ q:r, x:r * PI / 4, y:y, on:st.sel2.indexOf(r) >= 0, lab:"point " + qSay(r) + ", height " + (v.ex ? v.ex.sp : num(y, 2)), cls:"rb-m" }); }
    return out;
  }
  function placeTaps(){
    var L = tapList(), c = plot.c, ks = L.map(function(t){ return t.cls + t.q; }).join();
    if (taps.dataset.ks !== ks) {
      var hadFocus = taps.contains(document.activeElement);
      taps.innerHTML = L.map(function(t, i){ return '<button type="button" class="' + t.cls + '" data-q="' + t.q + '" aria-pressed="' + t.on + '" aria-label="' + t.lab + '" tabindex="' + (i === focusI ? 0 : -1) + '"></button>'; }).join("");
      taps.dataset.ks = ks; if (focusI >= L.length) focusI = 0;
      if (hadFocus && L.length) $$("button", taps)[focusI].focus({ preventScroll:true });
    }
    $$("button", taps).forEach(function(bt, i){
      var t = L[i]; bt.style.left = (c.offsetLeft + plot.X(t.x)) + "px"; bt.style.top = (c.offsetTop + plot.Y(t.y)) + "px";
      bt.setAttribute("aria-pressed", t.on); bt.tabIndex = i === focusI ? 0 : -1;
    });
  }
  taps.addEventListener("click", function(e){
    var bt = e.target.closest("button"); if (!bt) return;
    var b = bld(), st = bs(b.id), q = +bt.dataset.q, list = st.stage === "l1" ? st.sel : st.stage === "l1b" ? st.sel1b : st.sel2, i = list.indexOf(q);
    focusI = $$("button", taps).indexOf(bt);
    if (i < 0) list.push(q); else list.splice(i, 1);
    api.save(); plot.render();
  });
  taps.addEventListener("keydown", function(e){
    var bts = $$("button", taps), i = bts.indexOf(e.target); if (i < 0) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return;
    e.preventDefault(); focusI = (i + d + bts.length) % bts.length; bts.forEach(function(x, j){ x.tabIndex = j === focusI ? 0 : -1; }); bts[focusI].focus();
  });

  // ----- layer checks -----
  function partnerExact(b, q){ var v = val(b.partner, q * PI / 4); return v.ex ? MV.m(v.ex.mi) : num(v.v, 2); }
  function checkL1(b, st){
    var sel = st.sel, want = b.asym, F = B.fb, v = function(q){ return angM(3 * q); };
    if (!sel.length) return bad(F.none);
    if (sameSet(sel, want)) { st.stage = b.id === "cot" ? "l1b" : "l2"; growAsym(); return good(""); }
    st.tries.l1 = (st.tries.l1 || 0) + 1;
    var h;
    if (b.id === "csc" && (h = sel.filter(function(q){ return q === 2 || q === 6; })[0]) != null) return bad(fill(F.cscHalf, { v:v(h), s:h === 2 ? "1" : MINUS + "1" }));
    if (b.id === "sec" && (h = sel.filter(function(q){ return q === 0 || q === 4 || q === 8; })[0]) != null) return bad(fill(F.secPi, { v:v(h), s:h === 4 ? MINUS + "1" : "1" }));
    if (b.id === "cot" && (h = sel.filter(function(q){ return q === 2 || q === 6; })[0]) != null) return bad(fill(F.cotHalf, { v:v(h) }));
    if ((h = sel.filter(function(q){ return q % 2; })[0]) != null) return bad(fill(F.odd, { v:v(h), s:partnerExact(b, h) }));
    if ((b.id === "csc" || b.id === "cot") && (sel.indexOf(0) < 0 || sel.indexOf(8) < 0)) return bad(F.edge);
    return bad(F.other1);
  }
  function checkL1b(b, st){
    var sel = st.sel1b;
    if (!sel.length) return bad(B.fb.none);
    if (sameSet(sel, b.zeros)) { st.stage = "l2"; return good(B.l1bRight); }
    st.tries.l1b = (st.tries.l1b || 0) + 1;
    if (sel.some(function(q){ return q === 0 || q === 4 || q === 8; })) return bad(B.l1bWrong);
    return bad(B.fb.other1b);
  }
  function checkL2(b, st){
    var sel = st.sel2, want = b.stay.map(function(s){ return s[0]; }), F = B.fb;
    if (!sel.length) return bad(F.none);
    if (sameSet(sel, want)) { st.stage = "l3"; return good(""); }
    st.tries.l2 = (st.tries.l2 || 0) + 1;
    var wrong = sel.filter(function(q){ return want.indexOf(q) < 0; }).sort(function(p, q){ return p - q; }).slice(0, 2);
    if (!wrong.length) return bad(F.missing2);
    return bad(wrong.map(function(q){
      var x = q * PI / 4, pv = val(b.partner, x);
      if (Math.abs(pv.v) < 1e-12) return fill(F.zero, { v:angM(3 * q) });
      var rv = val(b.fn, x);
      return fill(F.moves, { v:angM(3 * q), p:MV.m(b.partner + " x = " + pv.ex.mi), pd:dec(pv.v, 2), r:MV.m(rv.ex.mi), rd:dec(rv.v, 2) });
    }).join(" "));
  }
  function shapeMsg(pc, chip){
    var ans = MV.ans(pc), opp = { up:"down", down:"up", rise:"fall", fall:"rise" }, F = B.fb;
    if (chip === opp[ans]) return F.partner;
    if ((chip === "rise" || chip === "fall") && pc.whole) return F.whole;
    if ((chip === "up" || chip === "down") && pc.half) return F.half;
    if ((chip === "up" || chip === "down") && pc.cot) return F.cot;
    return F.partner;
  }
  function growAsym(){ fx.grow = 0; MV.tween({ dur:600, step:function(t){ fx.grow = t; plot.render(); }, done:function(){ fx.grow = null; plot.render(); } }); }

  // ----- the card -----
  function paintBuilds(){
    MV.keepFocus($("#rb-builds", host), function(){
      $("#rb-builds", host).innerHTML = BL.map(function(b, i){ var on = b.id === S.cur, ok = unlocked(i); return '<button type="button" class="fchip" data-build="' + b.id + '" data-k="rbb' + b.id + '" aria-pressed="' + on + '"' + (ok ? "" : " disabled") + ">" + (S.done[b.id] ? "✓ " : "") + b.chip + (ok ? "" : ' <span class="tiny">(locked)</span>') + "</button>"; }).join("");
    });
  }
  function paintHead(){
    var b = bld(), st = bs(b.id), L = stages(b), names = { l1:B.layerNames[0], l1b:B.layerNames[1], l2:B.layerNames[2], l3:B.layerNames[3], l4:B.layerNames[4] };
    var cur = st.stage === "done" ? L.length : L.indexOf(st.stage);
    $("#rb-head", host).innerHTML = "<h3>Build " + MV.m("y = " + b.fn + " x") + " from " + MV.m("y = " + b.partner + " x") + '</h3><ol class="rb-steps">' +
      L.map(function(s, i){ return '<li class="' + (i < cur ? "done" : i === cur ? "cur" : "") + '">' + (i < cur ? '<span aria-hidden="true">✓ </span>' : "") + names[s] + (i < cur ? '<span class="vh"> (done)</span>' : i === cur ? '<span class="vh"> (now)</span>' : "") + "</li>"; }).join("") + "</ol>";
  }
  function paintMain(){
    var b = bld(), st = bs(b.id), h = "";
    if (st.stage === "l1" || st.stage === "l1b" || st.stage === "l2") {
      var ins = st.stage === "l1" ? B.l1 : st.stage === "l1b" ? B.l1b : B.l2;
      h = '<p class="rb-ins">' + ins + '</p><p class="tiny muted">' + (st.stage === "l2" ? "Tap the markers on the dashed graph (or Tab to them and press Enter), then press Check." : "Tap the circles on the x-axis (or Tab to them and press Enter), then press Check.") + "</p>" +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="rb-check" data-k="rbcheck">Check</button><button type="button" class="btn ghost sm" id="rb-clear" data-k="rbclear">Clear taps</button></div>';
    } else {
      h = (st.stage === "l3" && st.msg ? st.msg : "") + '<p class="rb-ins">' + B.l3 + "</p>" + b.pieces.map(function(pc, i){
        var ok = st.shape[i] === "ok", badc = st.bad[i];
        return '<div class="rb-piece" data-pc="' + i + '"><div class="rb-plab">' + pc.lab + '</div><div class="chips" role="group" aria-label="Shape of the piece ' + MV.esc(MV.plain(pc.lab)) + '">' +
          B.chips.map(function(c){ var on = ok ? MV.ans(pc) === c.id : badc === c.id; return '<button type="button" class="chip rb-chip" data-chip="' + c.id + '" data-k="rbc' + i + c.id + '" aria-pressed="' + on + '"' + (ok ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>" +
          (ok ? good(pc.why) : badc ? bad(shapeMsg(pc, badc)) : "") + "</div>";
      }).join("") + (st.stage === "l3" ? "" : '<p class="rb-ins" style="margin-top:12px">' + B.l4 + "</p>");
    }
    MV.keepFocus($("#rb-main", host), function(){ $("#rb-main", host).innerHTML = h + (st.msg && /^l[12]/.test(st.stage) ? st.msg : ""); });
  }
  var playT = null;
  function paintPlay(){
    var b = bld(), st = bs(b.id), el = $("#rb-play", host), n = bounds(b).length;
    if (st.stage !== "l4" && st.stage !== "done") { el.innerHTML = ""; return; }
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="player"><button type="button" class="btn ghost sm" data-pl="back" data-k="rbpb"' + (st.drawn <= 0 || playT ? " disabled" : "") + ">Back</button>" +
        '<button type="button" class="btn primary sm" data-pl="step" data-k="rbps"' + (st.drawn >= n || playT ? " disabled" : "") + ">Step</button>" +
        (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" data-pl="play" data-k="rbpp"' + (st.drawn >= n || playT ? " disabled" : "") + ">Play</button>") +
        '<span class="ctr" aria-live="polite">Pieces drawn: ' + st.drawn + " of " + n + "</span></div>";
    });
  }
  function probeText(b, k){
    var x = k * ST, pn = b.partner, fn = b.fn, pv = val(pn, x), rv = val(fn, x);
    var par = function(s){ return /^[-−≈]/.test(s) ? "(" + s + ")" : s; };
    if (fn === "cot" && pv.undef) return MV.m("tan x") + " is undefined → " + MV.m("cot x = cos x/sin x = 0");
    if (Math.abs(pv.v) < 1e-12) return MV.m(pn + " x = 0") + " → " + MV.m(fn + " x") + " is undefined: an asymptote";
    if (pv.ex) return MV.m(pn + " x = " + pv.ex.mi) + " → " + MV.m(fn + " x = 1 ÷ " + par(pv.ex.mi) + " = " + rv.ex.mi);
    return MV.m(pn + " x ≈ " + dec(pv.v, 2)) + " → " + MV.m(fn + " x ≈ 1 ÷ " + par(dec(pv.v, 2)) + " ≈ " + dec(rv.v, 2));
  }
  function paintAfter(){
    var b = bld(), st = bs(b.id), el = $("#rb-after", host), i = BL.indexOf(b);
    if (st.stage !== "done") { el.innerHTML = ""; $("#rb-line", host).innerHTML = ""; return; }
    var k = st.probe;
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="rb-probe"><label class="slider"><span class="slider-top"><span>Probe ' + MV.m("x") + '</span><output id="rb-pout">' + MV.m("x = " + angS(k)) + '</output></span><input type="range" id="rb-px" min="0" max="24" step="1" value="' + k + '" aria-label="Probe x, in steps of pi over 12" aria-valuetext="x = ' + angSay(k) + '"></label>' +
        '<button type="button" class="chip rb-band" id="rb-band" data-k="rbband" aria-pressed="' + !!st.band + '">' + B.band + "</button>" + (st.band ? '<p class="tiny rb-bandmsg">' + B.bandMsg + "</p>" : "") + "</div>" +
        '<div class="refresh rb-sum"><h4>Summary</h4><p>' + b.summary + "</p></div>" +
        (i < BL.length - 1 ? '<div class="q-actions"><button type="button" class="btn primary sm" id="rb-next" data-k="rbnext">Next build: ' + BL[i + 1].chip + "</button></div>" : "");
    });
    $("#rb-line", host).innerHTML = probeText(b, k);
  }
  function paintAlg(){
    var b = bld(), A = B.alg, T = A.tables[b.id], pf = PF[b.partner], f = FV[b.fn];
    var near = { csc:PI, sec:PI / 2, cot:PI }[b.id], nearS = { csc:"π", sec:"π/2", cot:"π" }[b.id];
    var rows = [-0.1, -0.01, 0.01].map(function(d){ var x = near + d; return [MV.m("x = " + nearS + (d < 0 ? " - " : " + ") + Math.abs(d)), "≈ " + dec(pf(x), 4), "≈ " + dec(f(x), 2)]; });
    $("#rb-algb", host).innerHTML = MV.tableHTML({ head:T.head, rows:T.rows, caption:"Exact values of " + b.partner + " x and " + b.fn + " x" }) +
      '<p style="margin:12px 0 6px"><strong>' + (b.id === "sec" ? A.closeSec : A.closeTitle) + "</strong></p>" +
      MV.tableHTML({ head:[MV.m("x"), MV.m(b.partner + " x"), MV.m(b.fn + " x")], rows:rows, caption:"Close-up near the asymptote" }) +
      '<p style="margin:12px 0 6px"><strong>The algebra, in words</strong></p><p>' + A.words + '</p><p style="margin:12px 0 6px"><strong>Notation</strong></p><p>' + A.notation + "</p>";
  }
  function paintAll(){ paintBuilds(); paintHead(); paintMain(); paintPlay(); paintAfter(); paintAlg(); plot.render(); }
  function drawNext(cb){
    var b = bld(), st = bs(b.id), n = bounds(b).length; if (st.drawn >= n) { if (cb) cb(); return; }
    var i = st.drawn; fx.piece = { i:i, t:0 };
    MV.tween({ dur:MV.reduceMotion ? 0 : 1500 / n, ease:LIN, step:function(t){ fx.piece.t = t; plot.render(); }, done:function(){
      fx.piece = null; st.drawn = i + 1;
      if (st.drawn >= n && st.stage !== "done") { st.stage = "done"; S.done[b.id] = true; }
      api.save(); plot.render(); if (cb) cb(); else paintAll();
    } });
  }
  host.addEventListener("click", function(e){
    var bt = e.target.closest("button"); if (!bt || bt.disabled || bt.closest("#rb-taps")) return;
    var b = bld(), st = bs(b.id);
    if (bt.dataset.build) { S.cur = bt.dataset.build; focusI = 0; api.save(); paintAll(); return; }
    if (bt.id === "rb-check") {
      st.msg = st.stage === "l1" ? checkL1(b, st) : st.stage === "l1b" ? checkL1b(b, st) : checkL2(b, st);
      api.save(); paintAll(); MV.focusFb($("#rb-main", host)); return;
    }
    if (bt.id === "rb-clear") { if (st.stage === "l1") st.sel = []; else if (st.stage === "l1b") st.sel1b = []; else st.sel2 = []; st.msg = null; api.save(); paintAll(); return; }
    if (bt.dataset.chip) {
      var i = +bt.closest("[data-pc]").dataset.pc, pc = b.pieces[i];
      st.msg = null;
      if (bt.dataset.chip === MV.ans(pc)) { st.shape[i] = "ok"; delete st.bad[i]; } else { st.bad[i] = bt.dataset.chip; st.tries.l3 = (st.tries.l3 || 0) + 1; }
      if (b.pieces.every(function(_, j){ return st.shape[j] === "ok"; })) { st.stage = "l4"; st.msg = null; }
      api.save(); paintAll(); MV.focusFb(bt.closest("[data-pc]") || $("#rb-main", host)); return;
    }
    if (bt.dataset.pl === "step") { drawNext(); return; }
    if (bt.dataset.pl === "back") { st.drawn = Math.max(0, st.drawn - 1); api.save(); paintAll(); return; }
    if (bt.dataset.pl === "play") {
      playT = true; paintPlay();
      (function go(){ drawNext(function(){ var n = bounds(b).length; if (st.drawn < n) MV.wait(60, go); else { playT = null; paintAll(); } }); })();
      return;
    }
    if (bt.id === "rb-band") { st.band = !st.band; api.save(); paintAfter(); plot.render(); return; }
    if (bt.id === "rb-next") { var j = BL.indexOf(b); S.cur = BL[j + 1].id; focusI = 0; api.save(); paintAll(); $("#rb-builds", host).scrollIntoView({ block:"nearest" }); return; }
  });
  host.addEventListener("input", function(e){
    if (e.target.id !== "rb-px") return;
    var st = bs(bld().id); st.probe = +e.target.value; api.save();
    $("#rb-pout", host).innerHTML = MV.m("x = " + angS(st.probe)); e.target.setAttribute("aria-valuetext", "x = " + angSay(st.probe));
    $("#rb-line", host).innerHTML = probeText(bld(), st.probe); plot.render();
  });
  MV.ACTS.recipBuilder = { stats:function(){ return { first:0, total:0, done:0, line:"" }; },
    missed:function(){ return BL.some(function(b){ var t = (S.b[b.id] || {}).tries || {}; return Object.keys(t).some(function(k){ return t[k] > 0; }); }) ? [3] : []; } };
  paintAll();
}

// ---------- Practice 1: property grid (6 rows × 4 chip cells, Check row, per-cell feedback) ----------
var ROWGOAL = { sin:[5, 2], cos:[5, 2], tan:[5, 3], csc:[5, 4], sec:[5, 4], cot:[5, 4] };
function grid(host, api, a){
  var S = api.S; S.rows = S.rows || {};
  function rs(id){ return S.rows[id] || (S.rows[id] = { pick:{}, marks:{}, tries:0, hint:0, solved:false, first:null, msg:null }); }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pgd"><div class="pgd-head" aria-hidden="true"><span></span>' + a.cols.map(function(c){ return "<span>" + c.label + "</span>"; }).join("") + "</div>" +
    a.rows.map(function(r){ return '<div class="pgd-row" data-row="' + r.id + '"></div>'; }).join("") + "</div>";
  function paintRow(r){
    var x = rs(r.id), el = $('[data-row="' + r.id + '"]', host), h = '<div class="pgd-fn">' + r.label + "</div>";
    a.cols.forEach(function(c){
      var mk = x.marks[c.id], pick = x.pick[c.id];
      h += '<div class="pgd-cell' + (mk ? " " + mk : "") + '"><span class="pgd-cl">' + c.label + '</span><span class="pgd-chips" role="radiogroup" aria-label="' + MV.esc(c.label + " of " + MV.plain(r.label)) + '">' +
        c.chips.map(function(ch, i){ var on = pick === ch.id, tab = on || (!pick && i === 0); return '<button type="button" role="radio" class="pgd-chip" data-col="' + c.id + '" data-v="' + ch.id + '" data-k="g' + r.id + c.id + ch.id + '" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '"' + (x.solved ? " disabled" : "") + ">" + ch.t + "</button>"; }).join("") +
        "</span>" + (mk ? '<span class="pgd-mk" aria-label="' + (mk === "good" ? "right" : "wrong") + '">' + (mk === "good" ? "✓" : "✗") + "</span>" : "") + "</div>";
    });
    h += '<div class="pgd-foot">';
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> Every cell in this row is right.' + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="g' + r.id + 'chk">Check row</button>' + MV.hintBtn("g" + r.id + "h", x.hint) + "</div>" + MV.hintsHTML(r.hints, x.hint) + (x.msg ? x.msg : "");
    h += "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var rowEl = b.closest("[data-row]"); if (!rowEl) return;
    var r = a.rows.filter(function(q){ return q.id === rowEl.dataset.row; })[0], x = rs(r.id);
    if (b.dataset.v) { x.pick[b.dataset.col] = b.dataset.v; delete x.marks[b.dataset.col]; }
    else if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.act === "check") {
      if (a.cols.some(function(c){ return !x.pick[c.id]; })) x.msg = '<div class="fb bad" role="status"><p>Choose a chip in every cell first.</p></div>';
      else {
        var ans = MV.ans(r), msgs = [];
        a.cols.forEach(function(c){
          var ok = x.pick[c.id] === ans[c.id]; x.marks[c.id] = ok ? "good" : "bad";
          if (!ok) msgs.push("<strong>" + c.label + ":</strong> " + ((r.fb[c.id] || {})[x.pick[c.id]] || "Check this cell again."));
        });
        if (!msgs.length) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.msg = null; }
        else { x.tries++; x.msg = '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong></p>' + msgs.map(function(m){ return "<p>" + m + "</p>"; }).join("") + "<p>" + a.fixLine + "</p></div>"; }
      }
    } else return;
    api.save(); paintRow(r); if (b.dataset.act === "check") MV.focusFb(rowEl);
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest(".pgd-chip"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var bs = $$(".pgd-chip", b.parentNode), i = (bs.indexOf(b) + d + bs.length) % bs.length; bs[i].focus(); bs[i].click();
  });
  a.rows.forEach(paintRow);
  return {
    stats:function(){ var f = 0, d = 0; a.rows.forEach(function(r){ var x = rs(r.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.rows.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.rows.length + " rows" + (d < a.rows.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.rows.forEach(function(r){ var x = rs(r.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(ROWGOAL[r.id])); }); return g; }
  };
}

// ---------- Practice 2: Track it down (π-multiple and whole-number boxes, preview graph after each check) ----------
function asymList(fn, a, b){
  var out = [], start = fn === "tan" || fn === "sec" ? PI / 2 : 0;
  for (var k = Math.ceil((a - start) / PI - 1e-9); start + k * PI <= b + 1e-9; k++) out.push(start + k * PI);
  return out;
}
var TDV = {
  td1:{ x:[2 * PI, 4 * PI], f:["csc"], y:4 }, td2:{ x:[-2 * PI, -PI], f:["tan"], y:4 }, td3:{ x:[PI, TAU], f:["cot"], y:4, h:-1 },
  td4:{ x:[0, TAU], f:["sec", "csc"], y:4 }, td5:{ x:[0, TAU], f:["csc", "sin"], y:4 }, td6:{ x:[0, 6 * PI], f:["sec"], y:4 },
  td7:{ x:[0, 6 * PI], f:["csc"], y:6, h:4 }, td8:{ x:[-TAU, TAU], f:["tan"], y:7, h:5 }
};
function track(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="td-n"></span><span class="dots" id="td-dots" aria-hidden="true"></span></div>' +
    '<p class="pred-q" id="td-q"></p><div id="td-in" class="td-in"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="td-check">Check</button><span id="td-hint"></span></div><div id="td-hints"></div><div id="td-fb"></div>' +
    '<div class="td-pv" id="td-pv" hidden><canvas class="plot" id="td-plot" role="img" aria-label="Preview graph"></canvas><p class="tiny muted" id="td-cap"></p></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="td-prev">Previous</button><button type="button" class="btn ghost sm" id="td-next">Next item</button></div>';
  var plot = new MV.Plot($("#td-plot", host), { xmin:0, xmax:1, ymin:-1, ymax:1 });
  function ist(id){ return S.items[id] || (S.items[id] = { raw:["", ""], tries:0, hint:0, solved:false, first:null, msg:null, last:null }); }
  function cur(){ return a.items[S.i]; }
  plot.render = function(){
    var it = cur(), x = ist(it.id), V = TDV[it.id]; if (!x.last) return;
    var x0 = V.x[0], x1 = V.x[1], pad = (x1 - x0) * 0.06, cols = [css("--pen"), css("--f3")];
    var asy = []; V.f.forEach(function(fn){ if (fn !== "sin") asymList(fn === "tan" || fn === "sec" ? fn : "csc", x0, x1).forEach(function(v){ if (asy.indexOf(v) < 0) asy.push(v); }); });
    if (V.f.join() === "sec,csc") asy = asymList("csc", x0, x1).concat(asymList("sec", x0, x1));
    var curves = V.f.map(function(fn, i){ return { f:FV[fn], domain:[x0, x1], color:cols[i], width:i ? 2.6 : 3 }; });
    var marks = it.kind === "count" ? [] : x.last.map(function(c){ return c * PI; });
    plot.draw({ view:{ xmin:x0 - pad, xmax:x1 + pad, ymin:-V.y, ymax:V.y }, xTicks:{ step:PI / 2, pi:true }, yTicks:{ step:V.y > 5 ? 2 : 1 },
      asymptotes:asy.map(function(v){ return { x:v, label:"" }; }),
      describe:"Preview: " + V.f.map(function(fn){ return "y = " + fn + " x"; }).join(" and ") + " for " + MV.piLabel(x0) + " to " + MV.piLabel(x1) + (marks.length ? ", with your answer marked at x = " + marks.map(function(m){ return MV.piLabel(m); }).join(" and ") : "") + ".",
      after:function(ctx, p){
        softRect(ctx, p.X(x0), 0, p.X(x1) - p.X(x0), 3); softRect(ctx, p.X(x0), p.H - 3, p.X(x1) - p.X(x0), 3);
        line(ctx, p.X(x0), 0, p.X(x0), p.H, css("--ink-2"), 1, [2, 3]); line(ctx, p.X(x1), 0, p.X(x1), p.H, css("--ink-2"), 1, [2, 3]);
        if (V.h != null) { line(ctx, 0, p.Y(V.h), p.W, p.Y(V.h), css("--ink"), 1.6, [6, 4]); txt(ctx, "y = " + (V.h < 0 ? MINUS : "") + Math.abs(V.h), p.W - 4, p.Y(V.h) - 10, { align:"right", bg:true, font:"italic 600 13px " + (css("--font-math") || "serif") }); }
        curves.forEach(function(cv){ p.curve(cv); });
        marks.forEach(function(m){ if (m < x0 - pad || m > x1 + pad) return; var X = p.X(m); line(ctx, X, 0, X, p.H, css("--hi"), 4, null, 0.8); var y = FV[V.f[0]](m); if (isFinite(y) && Math.abs(y) < V.y) disc(ctx, X, p.Y(y), 6, css("--ink"), css("--hi"), 3); });
      } });
  };
  function inputs(it, x){
    var box = function(i){ return '<label class="td-box"><span>' + it.lab + '</span><input type="text" inputmode="text" autocomplete="off" spellcheck="false" class="numin td-v" data-i="' + i + '" value="' + MV.esc(x.raw[i] || "") + '" aria-label="' + (it.kind === "pi2" ? "x-value " + (i + 1) + ", the number in front of pi" : "The number in front of pi") + '"' + (x.solved ? " disabled" : "") + '><span class="m">π</span></label>'; };
    if (it.kind === "count") return '<label class="td-box"><span>' + it.lab + '</span><input type="text" inputmode="numeric" autocomplete="off" class="numin td-v" data-i="0" value="' + MV.esc(x.raw[0] || "") + '" aria-label="' + MV.esc(MV.plain(it.lab)) + '"' + (x.solved ? " disabled" : "") + "></label>";
    return box(0) + (it.kind === "pi2" ? '<span class="td-and">and</span>' + box(1) : "");
  }
  function paint(load){
    var it = cur(), x = ist(it.id);
    $("#td-n", host).textContent = "Item " + (S.i + 1) + " of " + a.items.length + (it.star ? " ★" : "");
    $("#td-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#td-q", host).innerHTML = it.prompt;
    if (load) $("#td-in", host).innerHTML = inputs(it, x);
    $("#td-check", host).disabled = x.solved;
    $("#td-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("tdh" + it.id, x.hint);
    $("#td-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    $("#td-fb", host).innerHTML = x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct: ' + (it.kind === "count" ? MV.ans(it)[0] : MV.m(it.show)) + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : (x.msg || "");
    var pv = $("#td-pv", host); pv.hidden = !x.last;
    if (x.last) {
      var V = TDV[it.id];
      $("#td-cap", host).innerHTML = "Your answer: " + (it.kind === "count" ? x.last[0] : x.last.map(function(c){ return MV.m(MV.piLabel(c * PI).replace(/−/g, "-")); }).join(" and ")) +
        (V.f.length > 1 ? ". Blue: " + MV.m("y = " + V.f[0] + " x") + ". Teal: " + MV.m("y = " + V.f[1] + " x") + "." : ".") + " The shaded edges mark the stated interval.";
      plot.render();
    }
    $("#td-prev", host).disabled = S.i === 0; $("#td-next", host).disabled = S.i === a.items.length - 1;
  }
  function check(){
    var it = cur(), x = ist(it.id), want = MV.ans(it), vals, bad = function(h){ return '<div class="fb bad" role="status"><p>' + h + "</p></div>"; };
    if (it.kind === "count") {
      var s = String(x.raw[0] || "").trim();
      if (!/^\d+$/.test(s)) { x.msg = bad("Type a whole number."); return; }
      vals = [+s];
    } else {
      var raws = x.raw.slice(0, it.kind === "pi2" ? 2 : 1).filter(function(r){ return String(r || "").trim() !== ""; });
      if (!raws.length) { x.msg = bad("Type the number in front of π first, such as 5/2."); return; }
      vals = raws.map(parsePi);
      if (vals.some(isNaN)) { x.msg = bad("Type the number in front of π as a fraction or a whole number, such as 5/2 or −3/2."); return; }
      vals = vals.filter(function(v, i){ return vals.findIndex(function(w){ return Math.abs(w - v) < 1e-9; }) === i; });
    }
    var same = function(p, q){ return MV.sameNums(p, q, 1e-9); };
    x.last = vals;
    if (same(vals, want) && (it.kind !== "pi2" || vals.length === 2)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.msg = null; return; }
    var named = (it.wrong || []).filter(function(w){ return same(vals, w.v); })[0];
    if (named) { x.tries++; x.msg = '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + named.fb + " Try again.</p></div>"; return; }
    if (it.kind === "pi2" && vals.length < 2) { x.msg = bad(a.both); return; }
    if (it.kind !== "count" && vals.some(function(v){ return !(v > it.lo + 1e-9 && v < it.hi - 1e-9); })) { x.msg = bad(a.outside); return; }
    x.tries++; x.msg = '<div class="fb bad" role="status"><p>' + a.fallback + "</p></div>";
  }
  host.addEventListener("input", function(e){ if (!e.target.classList.contains("td-v")) return; var x = ist(cur().id); x.raw[+e.target.dataset.i] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.classList.contains("td-v")) { e.preventDefault(); $("#td-check", host).click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = cur(), x = ist(it.id);
    if (b.id === "td-prev" || b.id === "td-next") { S.i += b.id === "td-prev" ? -1 : 1; api.save(); paint(true); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id === "td-check") { check(); api.save(); paint(x.solved); MV.focusFb($("#td-fb", host)); }
  });
  paint(true);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Rising below the axis ----------
var task = (function(){
  var api, plot, rFn, T;
  // intervals in quarter-π units on [0, 2π] (plan §Performance task)
  var INC = { sin:[[0, 2], [6, 8]], cos:[[4, 8]], tan:[[0, 2], [2, 6], [6, 8]], csc:[[2, 4], [4, 6]], sec:[[0, 2], [2, 4]], cot:[] };
  var NEG = { sin:[[4, 8]], cos:[[2, 6]], tan:[[2, 4], [6, 8]], csc:[[4, 8]], sec:[[2, 6]], cot:[[2, 4], [6, 8]] };
  var DEC = { sin:[[2, 6]], cos:[[0, 4]], tan:[], csc:[[0, 2], [6, 8]], sec:[[4, 6], [6, 8]], cot:[[0, 4], [4, 8]] };
  var POS = { sin:[[0, 4]], cos:[[0, 2], [6, 8]], tan:[[0, 2], [4, 6]], csc:[[0, 4]], sec:[[0, 2], [6, 8]], cot:[[0, 2], [4, 6]] };
  var ASQ = { sin:[], cos:[], tan:[2, 6], sec:[2, 6], csc:[0, 4, 8], cot:[0, 4, 8] };
  var FNS = ["sin", "cos", "tan", "csc", "sec", "cot"];
  function inside(list, a, b){ return list.some(function(iv){ return iv[0] <= a && b <= iv[1]; }); }
  function overlap(list, a, b){ var o = []; list.forEach(function(iv){ var lo = Math.max(iv[0], a), hi = Math.min(iv[1], b); if (hi > lo) o.push([lo, hi]); }); return o; }
  function ivM(iv){ return MV.m("(" + angS(3 * iv[0]) + ", " + angS(3 * iv[1]) + ")"); }
  function ivList(l){ return l.map(ivM).join(" and "); }
  function fM(f){ return MV.m(f + " x"); }
  function read(){ var s = api ? api.S : {}; return { f:s.f || "sin", a:s.a == null ? 0 : +s.a, b:s.b == null ? 2 : +s.b }; }
  function asymIn(d){ return ASQ[d.f].filter(function(q){ return q > d.a && q < d.b; }); }
  function caption(d){ return MV.m("y = " + d.f + " x") + " on " + MV.m(angS(3 * d.a) + " < x < " + angS(3 * d.b)); }
  function draw(){
    var d = read(), ok = d.b > d.a, f = FV[d.f], A = d.a * PI / 4, Bq = d.b * PI / 4, red = css("--red"), pen = css("--pen");
    var asyAll = ASQ[d.f].map(function(q){ return q * PI / 4; }), inA = ok ? asymIn(d) : [];
    plot.draw({ view:{ xmin:-0.3, xmax:TAU + 0.3, ymin:-4, ymax:4 }, xTicks:{ step:PI / 4, fmt:function(t){ var k = Math.round(t / (PI / 2)); return Math.abs(t - k * PI / 2) < 1e-9 ? MV.piLabel(t) : ""; } }, yTicks:{ step:1 },
      asymptotes:asyAll.filter(function(x){ return inA.indexOf(Math.round(x / (PI / 4))) < 0; }).map(function(x){ return { x:x, label:"" }; }),
      describe:"Preview: y = " + d.f + " x for 0 to 2π" + (ok ? ", with the interval " + angT(3 * d.a) + " < x < " + angT(3 * d.b) + " shaded." : ". Choose b greater than a."),
      after:function(ctx, p){
        if (ok) softRect(ctx, p.X(A), 0, p.X(Bq) - p.X(A), p.H);
        inA.forEach(function(q){ var X = p.X(q * PI / 4); line(ctx, X, 0, X, p.H, red, 2, [8, 6]); txt(ctx, "undefined here", X + 5, 14, { color:red, bg:true, font:"600 12px " + (css("--font-ui") || "sans-serif") }); });
        if (ok) {
          var badParts = overlap(DEC[d.f], d.a, d.b).concat(overlap(POS[d.f], d.a, d.b));
          badParts.forEach(function(iv){ p.curve({ f:f, domain:[iv[0] * PI / 4 + 1e-4, iv[1] * PI / 4 - 1e-4], color:red, width:9 }); });
        }
        p.curve({ f:f, domain:[0, TAU], color:pen, width:3 });
        if (ok) p.curve({ f:f, domain:[A + 1e-4, Bq - 1e-4], color:pen, width:4.5 });
      } });
  }
  function opt(sel){ var h = ""; for (var q = 0; q <= 8; q++) h += '<option value="' + q + '"' + (q === sel ? " selected" : "") + ">" + angT(3 * q) + "</option>"; return h; }
  function paintCap(){ var d = read(), el = $("#rb-tcap"); if (!el) return; el.innerHTML = d.b > d.a ? caption(d) : '<span class="rq-warn">' + T.chooseB + "</span>"; }
  return {
    render:function(inp, pv, ap){
      api = ap; T = MV.C.task; var s = ap.S; if (s.f == null) { s.f = "sin"; s.a = 0; s.b = 2; }
      inp.innerHTML = '<div class="rq-fn" id="rq-fn"></div><div class="inrow rq-ab"><label class="rq-d"><span>' + MV.m("a") + '</span><select id="rq-a" class="rq-sel">' + opt(+s.a) + '</select></label><label class="rq-d"><span>' + MV.m("b") + '</span><select id="rq-b" class="rq-sel">' + opt(+s.b) + "</select></label></div>" +
        '<p class="rq-cap" id="rb-tcap" aria-live="polite"></p>';
      pv.innerHTML = '<canvas class="plot" id="rq-plot" role="img" aria-label="Preview graph"></canvas>';
      plot = new MV.Plot($("#rq-plot"), { xmin:0, xmax:TAU, ymin:-4, ymax:4 }); plot.render = draw;
      rFn = radios($("#rq-fn"), { label:"Function", cls:"chips", options:FNS.map(function(f){ return { id:f, t:MV.m(f + " x") }; }), value:s.f, onChange:function(v){ s.f = v; ap.save(); draw(); paintCap(); ap.update(); } });
      inp.addEventListener("change", function(e){ if (e.target.id === "rq-a") s.a = +e.target.value; else if (e.target.id === "rq-b") s.b = +e.target.value; else return; ap.save(); draw(); paintCap(); ap.update(); });
      draw(); paintCap();
      // after all six designs: the plan's closing note
      var th = $("#task");
      if (th) th.addEventListener("click", function(e){
        if (!e.target.closest || !e.target.closest("#task-check")) return;
        var ts = MV.taskState(), g = $("#task-fb .fb.good");
        if (g && ts.found.length >= 6 && !$(".rq-six", g)) g.insertAdjacentHTML("beforeend", '<p class="rq-six">' + T.allSix + "</p>");
      });
    },
    read:read,
    valid:function(d){ return d.b > d.a ? true : T.chooseB + "."; },
    checks:function(d){
      if (!(d.b > d.a)) return [false, false, false, false];
      return [d.b - d.a >= 2, !asymIn(d).length, inside(INC[d.f], d.a, d.b), inside(NEG[d.f], d.a, d.b)];
    },
    tips:function(d, c){
      var out = [], tips = T.tips, inA = asymIn(d);
      if (!c[0]) out.push(tips[0]);
      if (!c[1]) out.push(fill(tips[1], { f:fM(d.f), v:angM(3 * inA[0]) }));
      if (!c[2]) { var fall = overlap(DEC[d.f], d.a, d.b); out.push(fall.length ? fill(tips[2], { f:fM(d.f), part:ivList(fall) }) : fill(T.tipJump, { f:fM(d.f), v:angM(3 * (inA[0] != null ? inA[0] : 4)) })); }
      if (!c[3]) out.push(fill(tips[3], { f:fM(d.f), sign:"positive", part:ivList(overlap(POS[d.f], d.a, d.b)) }));
      return out;
    },
    key:function(d){ return d.f + "|" + d.a + "|" + d.b; },
    label:function(k){ var p = k.split("|"); return caption({ f:p[0], a:+p[1], b:+p[2] }); },
    text:function(k){ var p = k.split("|"); return "y = " + p[0] + " x on " + angT(3 * +p[1]) + " < x < " + angT(3 * +p[2]); }
  };
})();

// ---------- Final Check A1: the light, the wall and the beam ----------
function figA1(p){
  var ang = 0.72;
  p.draw({ view:{ xmin:-0.3, xmax:1.6, ymin:-0.45, ymax:1.3 }, equal:true, grid:false, axes:false, ticks:false,
    describe:"A light L is 1 metre from a straight wall. N is the point on the wall nearest the light, so LN is 1 metre. The beam leaves L at angle x to LN and lights a spot on the wall.",
    after:function(ctx, q){
      var ink = css("--ink"), ink2 = css("--ink-2"), fm = css("--font-math") || "serif", X = function(v){ return q.X(v); }, Y = function(v){ return q.Y(v); };
      ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1; ctx.beginPath();
      for (var y = -0.4; y < 1.3; y += 0.1) { ctx.moveTo(X(1), Y(y)); ctx.lineTo(X(1.08), Y(y + 0.08)); } ctx.stroke(); ctx.restore();
      line(ctx, X(1), Y(-0.42), X(1), Y(1.28), ink, 3.5);
      txt(ctx, "wall", X(1.12), Y(1.12), { color:ink2, font:"12px " + (css("--font-ui") || "sans-serif") });
      line(ctx, X(0), Y(0), X(1), Y(0), ink2, 2);
      line(ctx, X(1) - 10, Y(0), X(1) - 10, Y(0) - 10, ink2, 1.2); line(ctx, X(1) - 10, Y(0) - 10, X(1), Y(0) - 10, ink2, 1.2);
      line(ctx, X(0), Y(0), X(1), Y(Math.tan(ang)), css("--pen"), 2.5);
      ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(X(0), Y(0), 28, 0, -ang, true); ctx.stroke(); ctx.restore();
      txt(ctx, "x", X(0) + 38 * Math.cos(ang / 2), Y(0) - 38 * Math.sin(ang / 2), { font:"italic 600 15px " + fm, align:"center" });
      disc(ctx, X(1), Y(Math.tan(ang)), 7, css("--hi"), ink, 1.5);
      disc(ctx, X(0), Y(0), 6, ink); txt(ctx, "L", X(0) - 10, Y(0), { font:"italic 600 16px " + fm, align:"right" });
      disc(ctx, X(1), Y(0), 4, ink); txt(ctx, "N", X(1) + 12, Y(0) + 4, { font:"italic 600 16px " + fm });
      txt(ctx, "1 m", X(0.5), Y(0) + 15, { align:"center", font:"14px " + fm });
      txt(ctx, "spot", X(1) - 8, Y(Math.tan(ang)) - 4, { align:"right", color:ink2, font:"12px " + (css("--font-ui") || "sans-serif"), bg:true });
    } });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ grid:grid, track:track },
  task:task,
  figures:{ a1:figA1 }
});
})();
