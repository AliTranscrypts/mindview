// MHF4U 34 Solving Trig Equations: hero, line-meets-wave explorer (Explore), lost solutions and three builds (Part 3,
// #quadratics), "Find every solution" and "Beyond the special angles" (Practice 1 and 3), the four-solution design task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, MINUS = MV.MINUS, PI = Math.PI, TAU = 2 * PI, R2 = Math.SQRT2 / 2, R3 = Math.sqrt(3);
function fill(t, o){ return String(t).replace(/\{(\w+)\}/g, function(s, k){ return o[k] != null ? o[k] : s; }); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function near(a, b, e){ return Math.abs(a - b) < (e || 1e-9); }
function dec(v, dp){ var s = Math.abs(v).toFixed(dp == null ? 2 : dp); return (v < 0 && +s !== 0 ? MINUS : "") + s; }
function andList(a){ return a.length < 2 ? (a[0] || "") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function nSol(n){ return n === 0 ? "no solutions" : n + " solution" + (n === 1 ? "" : "s"); }
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function m(s){ return MV.m(s); }
function circ(i){ return String.fromCharCode(0x2460 + i); }
function narrow(){ return window.innerWidth <= 820; }
function fv2(el){ try { return el.matches(":focus-visible"); } catch (e) { return true; } }
function chain(steps, done){ var i = 0; (function go(){ if (i >= steps.length) { if (done) done(); return; } steps[i++](go); })(); }
function tw(dur, step){ return function(next){ MV.tween({ dur:dur, ease:function(t){ return t; }, step:step, done:next }); }; }
function wt(ms){ return function(next){ MV.wait(ms, next); }; }
function now(fn){ return function(next){ fn(); next(); }; }
function fbBox(good, html){ return '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p>' + html + "</p></div>"; }
var TRY = " Try again.";

// ---------- π-multiples (N3): angles are whole numbers of π/12 ----------
function pf(n, d){ var g = gcd(n, d); if (d < 0) { n = -n; d = -d; } return { n:n / g, d:d / g }; }
function piS(n, d, st){ if (!n) return "0"; var a = Math.abs(n), top = (a === 1 ? "" : a) + "π"; return (n < 0 ? "-" : "") + (d === 1 ? top : st ? "{" + top + "}/{" + d + "}" : top + "/" + d); }
function twS(t, st){ var f = pf(t, 12); return piS(f.n, f.d, st); }
function twT(t){ return twS(t).replace(/-/g, MINUS); }
var STRIP = [0, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24];

// ---------- exact line heights ----------
var EXV = [[-R3, "-√3"], [-1, "-1"], [-R3 / 2, "-√3/2"], [-R2, "-√2/2"], [-R3 / 3, "-√3/3"], [-0.5, "-1/2"], [0, "0"], [0.5, "1/2"], [R3 / 3, "√3/3"], [R2, "√2/2"], [R3 / 2, "√3/2"], [1, "1"], [R3, "√3"]];
var CHIPS = { sc:["-1", "-√3/2", "-√2/2", "-1/2", "0", "1/2", "√2/2", "√3/2", "1"], tan:["-√3", "-1", "-√3/3", "0", "√3/3", "1", "√3"] };
var SPEC9 = CHIPS.sc.map(exVal);
function exLab(v){ for (var i = 0; i < EXV.length; i++) if (near(EXV[i][0], v)) return EXV[i][1]; return null; }
function exVal(lab){ for (var i = 0; i < EXV.length; i++) if (EXV[i][1] === lab) return EXV[i][0]; return NaN; }
function fracLab(v){ for (var d = 1; d <= 12; d++) { var n = Math.round(v * d); if (near(n / d, v)) return (n < 0 ? "-" : "") + Math.abs(n) + (d > 1 ? "/" + d : ""); } return null; }
function stk(lab){ return lab.replace(/^(-?)(√?\d+)\/(\d+)$/, "$1{$2}/{$3}"); }
function vS(v, ex, st){ var l = ex ? (exLab(v) || fracLab(v)) : null; if (l) return st ? stk(l) : l; return dec(v, 2); }
function vT(v, ex){ return vS(v, ex).replace(/-/g, MINUS); }
var REFS = { sin:[[0, 0], [0.5, 2], [R2, 3], [R3 / 2, 4], [1, 6]], cos:[[1, 0], [R3 / 2, 2], [R2, 3], [0.5, 4], [0, 6]], tan:[[0, 0], [R3 / 3, 2], [1, 3], [R3, 4]] };
function refT(f, v){ var L = REFS[f]; for (var i = 0; i < L.length; i++) if (near(Math.abs(v), L[i][0])) return L[i][1]; return null; }
function fv(f, u){ return f === "sin" ? Math.sin(u) : f === "cos" ? Math.cos(u) : Math.tan(u); }
function quadT(t){ t = ((t % 24) + 24) % 24; return t % 6 === 0 ? 0 : Math.floor(t / 6) + 1; }
var KN = { h:[1, 2], "1":[1, 1], "2":[2, 1], "3":[3, 1] };
var FNAME = { sin:"Sine", cos:"Cosine", tan:"Tangent" };

// every solution of f(kx) = v with 0 ≤ x ≤ 2π (sols), and the ones outside it but inside the window −π/2 < x < 5π/2 (outs)
function solve(f, k, v){
  var kn = KN[k][0], kd = KN[k][1], K = kn / kd, r = refT(f, v), o = { f:f, k:k, K:K, v:v, sols:[], outs:[], possible:f === "tan" || Math.abs(v) <= 1 + 1e-12 };
  if (!o.possible) return o;
  var base = [];
  if (r != null) { o.ref = r; for (var t = 0; t < 24; t++) if (near(fv(f, t * PI / 12), v, 1e-9)) base.push({ t:t, q:quadT(t) }); }
  else {
    var a = Math.abs(v), al = f === "sin" ? Math.asin(a) : f === "cos" ? Math.acos(a) : Math.atan(a), pos = v > 0;
    o.al = al;
    ({ sin:pos ? [1, 2] : [3, 4], cos:pos ? [1, 4] : [2, 3], tan:pos ? [1, 3] : [2, 4] })[f].forEach(function(q){ base.push({ a:[al, PI - al, PI + al, TAU - al][q - 1], q:q }); });
  }
  base.forEach(function(b){
    for (var L = -2; L <= 4; L++) {
      var ex = b.t != null, t = ex ? b.t + 24 * L : 0, u = ex ? t * PI / 12 : b.a + TAU * L;
      var inI = ex ? t >= 0 && t <= 24 * K : u >= 0 && u <= TAU * K, inW = ex ? t > -6 * K && t < 30 * K : u > -PI / 2 * K && u < 2.5 * PI * K;
      if (!inI && !inW) continue;
      var s = { u:u, x:u / K, q:b.q, lap:L, ex:ex, b:b };
      if (ex) { s.t = t; var fx = pf(t * kd, 12 * kn), fu = pf(t, 12); s.xn = fx.n; s.xd = fx.d; s.un = fu.n; s.ud = fu.d; }
      (inI ? o.sols : o.outs).push(s);
    }
  });
  var by = function(p, q){ return p.x - q.x; }; o.sols.sort(by); o.outs.sort(by);
  return o;
}
function xS(s, st){ return s.ex ? piS(s.xn, s.xd, st) : dec(s.x); }
function uS(s, st){ return s.ex ? piS(s.un, s.ud, st) : dec(s.u); }
function xL(s){ return (s.ex ? "" : "≈ ") + xS(s, true); }            // canvas label
function xH(s){ return m((s.ex ? "x = " : "x ≈ ") + xS(s)); }        // html
function alS(o){ return o.ref != null ? twS(o.ref) : dec(o.al); }
function built(s, o){
  if (!s.q) return s.lap > 0 ? uS({ ex:s.ex, un:pf(s.t - 24 * s.lap, 12).n, ud:pf(s.t - 24 * s.lap, 12).d, u:s.u - TAU * s.lap }) + " + " + 2 * s.lap + "π" : null;
  var al = alS(o), e = ["", al, "π - " + al, "π + " + al, "2π - " + al][s.q];
  return e + (s.lap > 0 ? " + " + 2 * s.lap + "π" : "");
}
function fnS(f, k, col){ return f + (k === "1" ? " x" : k === "h" ? "(x/" + (col ? "@k{2}" : "2") + ")" : " " + (col ? "@k{" + k + "}" : k) + "x"); }
function kxS(k, col){ return k === "h" ? "x/" + (col ? "@k{2}" : "2") : (col ? "@k{" + k + "}" : k) + "x"; }
function solList(o){ return o.sols.length ? andList(o.sols.map(function(s){ return m(xS(s)); })) : "none"; }

// ---------- canvas maths labels (adapted from @component N12 unitCircle, MHF4U 26) ----------
var FNW = { sin:1, cos:1, tan:1 };
function grp(s, i){ var d = 0, j = i; for (; j < s.length; j++) { if (s[j] === "{") d++; else if (s[j] === "}") { d--; if (!d) break; } } return [s.slice(i + 1, j), j + 1]; }
function parse(src){
  var out = [], i = 0, buf = "";
  function flush(){ if (buf) { out.push({ t:buf }); buf = ""; } }
  while (i < src.length) {
    var ch = src[i];
    if (ch === "{") { var g = grp(src, i); if (src[g[1]] === "/" && src[g[1] + 1] === "{") { var g2 = grp(src, g[1] + 1); flush(); out.push({ fn:parse(g[0]), fd:parse(g2[0]) }); i = g2[1]; continue; } flush(); out = out.concat(parse(g[0])); i = g[1]; continue; }
    if (ch === "√") { var mm = /^\d+/.exec(src.slice(i + 1)) || [""]; flush(); out.push({ r:mm[0] }); i += 1 + mm[0].length; continue; }
    if (/[A-Za-z]/.test(ch)) { var w = /^[A-Za-z]+/.exec(src.slice(i))[0]; if (FNW[w]) buf += w; else { flush(); w.split("").forEach(function(c){ out.push({ t:c, i:true }); }); } i += w.length; continue; }
    buf += ch === "-" ? MINUS : ch; i++;
  }
  flush(); return out;
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
function drawToks(ctx, toks, x, y, sz, fm, col){
  var ws = widths(ctx, toks, sz, fm);
  toks.forEach(function(tk, i){
    if (tk.fn) {
      var fs = Math.max(9, Math.round(sz * 0.78)), wn = sum(widths(ctx, tk.fn, fs, fm)), wd = sum(widths(ctx, tk.fd, fs, fm));
      drawToks(ctx, tk.fn, x + (ws[i] - wn) / 2, y - fs * 0.64, fs, fm, col); drawToks(ctx, tk.fd, x + (ws[i] - wd) / 2, y + fs * 0.68, fs, fm, col);
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
// lab(ctx, plot, parts, X, Y, o): parts = "math src" or [{s:"math"} | {t:"plain words"}, colour c]; o = {size, color, align, bg, alpha}
function lab(ctx, p, parts, X, Y, o){
  o = o || {}; if (typeof parts === "string") parts = [{ s:parts }];
  var sz = o.size || 14, fm = p.fontM || css("--font-math") || "serif", fu = p.fontUI || "sans-serif", base = o.color || css("--ink");
  var P = parts.map(function(pt){
    if (pt.t != null) { var ts = /^[\u2460-\u2473\s]+$/.test(pt.t) ? sz + 3 : sz - 2; ctx.font = "600 " + ts + "px " + fu; return { t:pt.t, ts:ts, w:ctx.measureText(pt.t).width, c:pt.c }; }
    var tk = parse(pt.s); return { tk:tk, w:sum(widths(ctx, tk, sz, fm)), c:pt.c, fr:tk.some(function(x){ return x.fn; }) };
  });
  var w = sum(P.map(function(x){ return x.w; })), hh = P.some(function(x){ return x.fr; }) ? sz * 2.05 : sz * 1.35;
  var x0 = o.align === "right" ? X - w : o.align === "center" ? X - w / 2 : X;
  x0 = Math.max(3, Math.min(p.W - w - 3, x0)); Y = Math.max(hh / 2 + 1, Math.min(p.H - hh / 2 - 1, Y));
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
  if (o.bg !== false) { ctx.globalAlpha *= 0.9; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, Y - hh / 2, w + 6, hh); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; }
  var x = x0;
  P.forEach(function(pt){
    var col = pt.c || base;
    if (pt.t != null) { ctx.font = "600 " + pt.ts + "px " + fu; ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(pt.t, x, Y + 1); }
    else drawToks(ctx, pt.tk, x, Y, sz, fm, col);
    x += pt.w;
  });
  ctx.restore();
  return { x:x0, w:w, h:hh };
}
function line(ctx, x1, y1, x2, y2, col, w, dash, alpha){ ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.lineCap = "round"; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function disc(ctx, X, Y, r, fill, stroke, sw){ ctx.save(); ctx.beginPath(); ctx.arc(X, Y, r, 0, TAU); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw || 2; ctx.stroke(); } ctx.restore(); }
function ptDot(ctx, X, Y){ disc(ctx, X, Y, 10, css("--hi")); disc(ctx, X, Y, 6, css("--ink"), css("--sheet"), 1.5); }
function arrowHead(ctx, x, y, ang, col, s){ s = s || 10; ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - s * Math.cos(ang - 0.45), y - s * Math.sin(ang - 0.45)); ctx.lineTo(x - s * Math.cos(ang + 0.45), y - s * Math.sin(ang + 0.45)); ctx.closePath(); ctx.fill(); ctx.restore(); }
function words(ctx, t, x, y, o){ o = o || {}; ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.font = (o.w || 600) + " " + (o.size || 12) + "px " + css("--font-ui"); ctx.fillStyle = o.color || css("--ink-2"); ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "middle"; ctx.fillText(t, x, y); ctx.restore(); }

// ---------- G3/G6/G11 wave graph: the wave y = f(Kx), lines, meeting points, the washed outside bands ----------
// sc = {f, K, ymax, lines:[{v, dash, alpha, ext (0..1), tag:[parts], arrowTag}], pts:[{x, y, tag, lab}], outs:[{x, y}], br:{a, K}, desc, minor}
var XV = { xmin:-PI / 2, xmax:2.5 * PI };
function waveScene(p, sc){
  var ym = sc.ymax, f = sc.f, K = sc.K;
  p.draw({ view:{ xmin:XV.xmin, xmax:XV.xmax, ymin:-ym, ymax:ym }, xTicks:{ step:PI / 2, pi:true, den:2 }, yTicks:{ step:ym > 2 ? 1 : 0.5, fmt:function(t){ return Math.abs(t) > ym * 0.8 ? "" : MV.num(t); } }, describe:sc.desc,
    after:function(ctx){
      var W = p.W, H = p.H, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3"), hi = css("--hi"), x0 = p.X(0), x1 = p.X(TAU), oy = p.Y(0), small = W < 520;
      ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = css("--sheet"); ctx.fillRect(0, 0, x0, H); ctx.fillRect(x1, 0, W - x1, H); ctx.restore();
      [[4, "left"], [W - 4, "right"]].forEach(function(c){ words(ctx, "outside", c[0], H - 26, { size:11, align:c[1], w:400 }); words(ctx, "0 ≤ x ≤ 2π", c[0], H - 12, { size:11, align:c[1], w:400 }); });
      if (!small) { ctx.save(); ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1; ctx.beginPath(); for (var j = -5; j <= 29; j++) { if (j % 6 === 0) continue; var X = Math.round(p.X(j * PI / 12)) + 0.5; ctx.moveTo(X, oy - 3); ctx.lineTo(X, oy + 3); } ctx.stroke(); ctx.restore(); }
      line(ctx, x0, 0, x0, H, ink, 1.5); line(ctx, x1, 0, x1, H, ink, 1.5);
      ctx.save(); ctx.font = "600 22px " + (p.fontM || "serif"); ctx.fillStyle = ink; ctx.textBaseline = "top"; ctx.textAlign = "left"; ctx.fillText("[", x0 + 3, 2); ctx.textAlign = "right"; ctx.fillText("]", x1 - 3, 2); ctx.restore();
      if (f === "tan") for (var a = -3; a <= 9; a++) { var xa = (PI / 2 + a * PI) / K; if (xa > XV.xmin && xa < XV.xmax) line(ctx, p.X(xa), 0, p.X(xa), H, ink2, 1.5, [8, 6]); }
      var g = function(x){ return fv(f, K * x); };
      p.curve({ f:g, color:pen, width:3, alpha:0.4, domain:[XV.xmin, 0] }); p.curve({ f:g, color:pen, width:3, alpha:0.4, domain:[TAU, XV.xmax] }); p.curve({ f:g, color:pen, width:3, domain:[0, TAU] });
      if (sc.br && sc.br.a > 0) {
        var bw = TAU / sc.br.K, bx0 = p.X(0), bx1 = p.X(Math.min(bw, XV.xmax)), by = 30, pk = css("--p-k");
        ctx.save(); ctx.globalAlpha = sc.br.a; line(ctx, bx0, by, bx1, by, pk, 2.5); line(ctx, bx0, by, bx0, by + 8, pk, 2.5); if (bw <= XV.xmax) line(ctx, bx1, by, bx1, by + 8, pk, 2.5); else arrowHead(ctx, bx1, by, 0, pk, 10); ctx.restore();
        if (sc.br.lab) lab(ctx, p, [{ t:"period " }, { s:"2π/" }, { s:"k", c:pk }, { s:" = " + sc.br.lab }], (bx0 + bx1) / 2, by - 13, { size:13, align:"center", alpha:sc.br.a });
      }
      (sc.lines || []).forEach(function(L, li){
        if (L.ext <= 0) return;
        if (Math.abs(L.v) <= ym) {
          var Y = p.Y(L.v); line(ctx, 0, Y, W * L.ext, Y, f3, 2.6, L.dash, L.alpha);
          if (L.ext >= 1 && L.tag) lab(ctx, p, L.tag, L.left ? 4 : W - 6, Y + ((li ? L.v > -ym * 0.7 : L.v > ym * 0.7) ? 15 : -15), { size:13, align:L.left ? "left" : "right", color:f3, alpha:L.alpha });
        } else if (L.ext >= 1) {
          var up = L.v > 0, ay = up ? 4 : H - 4, ax = W * (0.6 + 0.12 * li);
          line(ctx, ax, up ? 34 : H - 34, ax, ay + (up ? 6 : -6), f3, 2.6, null, L.alpha); arrowHead(ctx, ax, ay, up ? -PI / 2 : PI / 2, f3, 11);
          if (L.tag) lab(ctx, p, L.tag, ax - 8, up ? 22 : H - 22, { size:12, align:"right", color:f3, alpha:L.alpha });
        }
      });
      (sc.outs || []).forEach(function(q){ disc(ctx, p.X(q.x), p.Y(q.y), 5, css("--sheet"), ink2, 2); });
      var rows = [-1e9, -1e9];
      (sc.pts || []).forEach(function(q){
        var X = p.X(q.x), Y = p.Y(q.y);
        if (Math.abs(q.y) > 0.02) line(ctx, X, Y, X, oy, hi, 2.5, [5, 4]);
        ptDot(ctx, X, Y);
        if (q.tag) lab(ctx, p, [{ t:W < 520 ? q.tag.charAt(0) : q.tag }], X + 9, Y + (q.y > 0 ? -15 : 15), { size:13, bg:false });
        if (q.lab) { var r = X - rows[0] >= 40 ? 0 : X - rows[1] >= 40 ? 1 : 0; rows[r] = X; var ly = q.y >= -0.05 ? oy + 22 + r * 30 : oy - 22 - r * 30; lab(ctx, p, q.lab, X, ly, { size:13, align:"center" }); }
      });
      if (sc.extra) sc.extra(ctx);
    } });
}

// ---------- G8/G9 circle view: the same line cutting the unit circle ----------
// sc = {f, lines:[{v, dash, alpha, ext}], cuts:[{a, tag, lab}], arms:[a], ref:{a, lab}, mirror:"y"|"x"|angle, laps:text, grey:bool, miss:text, after(ctx)}
function circScene(p, sc){
  p.draw({ view:{ xmin:-1.5, xmax:1.5, ymin:-1.5, ymax:1.5 }, equal:true, ticks:false, describe:sc.desc,
    after:function(ctx){
      var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3"), hi = css("--hi"), R = p.X(1) - p.X(0), cx = p.X(0), cy = p.Y(0);
      ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke(); ctx.restore();
      if (sc.grey) { ctx.save(); ctx.strokeStyle = css("--rule"); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(cx, cy, R, 0, PI); ctx.stroke(); ctx.restore(); words(ctx, "u > π: not reached", cx, cy + R + 16, { size:11, align:"center" }); }
      if (sc.mirror != null) {
        var md = sc.mirror;
        if (md === "y") line(ctx, cx, p.Y(1.25), cx, p.Y(-1.25), hi, 3.5, [2, 6], sc.mirA);
        else if (md === "x") line(ctx, p.X(-1.25), cy, p.X(1.25), cy, hi, 3.5, [2, 6], sc.mirA);
        else { line(ctx, p.X(-1.2 * Math.cos(md)), p.Y(-1.2 * Math.sin(md)), p.X(1.2 * Math.cos(md)), p.Y(1.2 * Math.sin(md)), ink2, 2, [2, 5]); words(ctx, "half turn", p.X(0.5 * Math.cos(md + 0.5)), p.Y(0.5 * Math.sin(md + 0.5)), { size:11, align:"center" }); }
      }
      (sc.lines || []).forEach(function(L){
        if (L.ext <= 0) return;
        var v = L.v, e = L.ext;
        if (sc.f === "sin") { if (Math.abs(v) <= 1.5) line(ctx, p.X(-1.5), p.Y(v), p.X(-1.5 + 3 * e), p.Y(v), f3, 2.6, L.dash, L.alpha); }
        else if (sc.f === "cos") { if (Math.abs(v) <= 1.5) line(ctx, p.X(v), p.Y(1.5), p.X(v), p.Y(1.5 - 3 * e), f3, 2.6, L.dash, L.alpha); }
        else {
          var xm = Math.min(1.5, 1.5 / Math.max(Math.abs(v), 1e-9)); line(ctx, p.X(-xm), p.Y(-xm * v), p.X(-xm + 2 * xm * e), p.Y((-xm + 2 * xm * e) * v), f3, 2.6, L.dash, L.alpha);
          line(ctx, p.X(1), p.Y(-1.5), p.X(1), p.Y(1.5), ink2, 1.5, [2, 4]);
          if (Math.abs(v) <= 1.5 && e >= 1) { disc(ctx, p.X(1), p.Y(v), 4.5, f3); words(ctx, "tan", p.X(1) + 7, p.Y(v), { size:12, color:f3, w:700 }); }
        }
      });
      if (sc.ref && sc.ref.a != null) {
        var ra = sc.ref.a, q = Math.round(((ra % TAU) + TAU) % TAU * 1e6) / 1e6, base = q > PI / 2 && q < 3 * PI / 2 ? PI : q >= 3 * PI / 2 ? TAU : 0;
        var a0 = Math.min(base, q), a1 = Math.max(base, q);
        if (a1 - a0 > 1e-6) {
          ctx.save(); ctx.strokeStyle = hi; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, R * 0.3, -a0, -a1, true); ctx.stroke(); ctx.restore();
          var mid = (a0 + a1) / 2; lab(ctx, p, sc.ref.lab, p.X(0.52 * Math.cos(mid)) + (Math.cos(mid) >= 0 ? 4 : -4), p.Y(0.52 * Math.sin(mid)), { size:12, align:Math.cos(mid) >= 0 ? "left" : "right" });
        }
      }
      (sc.arms || []).forEach(function(a){ line(ctx, cx, cy, p.X(Math.cos(a)), p.Y(Math.sin(a)), pen, 3); });
      (sc.cuts || []).forEach(function(c){
        var X = p.X(Math.cos(c.a)), Y = p.Y(Math.sin(c.a)); ptDot(ctx, X, Y);
        var co = Math.cos(c.a), si = Math.sin(c.a), LX = p.X(1.08 * co) + co * 6, LY = p.Y(1.08 * si) - si * 14 + (Math.abs(si) < 0.3 ? -14 : 0);
        var al = co > 0.3 ? "left" : co < -0.3 ? "right" : "center";
        lab(ctx, p, [{ t:c.tag + " " }].concat(c.lab), LX, LY, { size:13, align:al });
      });
      if (sc.laps) words(ctx, sc.laps, 8, 14, { size:12, color:css("--p-k"), w:700 });
      if (sc.miss) words(ctx, sc.miss, cx, p.Y(-1.38), { size:12, align:"center", color:ink });
      if (sc.after) sc.after(ctx, R, cx, cy);
    } });
}
function cutsOf(o, nums){ // group solutions by their point on the circle; nums = circled index for each solution
  var g = [];
  o.sols.forEach(function(s, i){
    var a = ((s.u % TAU) + TAU) % TAU, h = g.filter(function(x){ return near(Math.cos(x.a), Math.cos(a), 1e-7) && near(Math.sin(x.a), Math.sin(a), 1e-7); })[0];
    if (!h) { h = { a:a, tags:[], labs:[] }; g.push(h); }
    h.tags.push(nums ? nums[i] : circ(i)); h.labs.push((s.ex ? "" : "≈ ") + uS(s, true));
  });
  return g.map(function(h){ var L = []; h.labs.forEach(function(l, i){ if (i) L.push({ t:" and " }); L.push({ s:l }); }); return { a:h.a, tag:h.tags.join(""), lab:L }; });
}

// ---------- G14 solution strip: 0 to 2π with "[" and "]" ends ----------
function stripScene(p, sc){
  p.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, describe:sc.desc,
    after:function(ctx){
      var W = p.W, H = p.H, ink = css("--ink"), ink2 = css("--ink-2"), L = 18, Rr = W - 104, y = H * 0.6, X = function(x){ return L + x / TAU * (Rr - L); };
      line(ctx, L, y, Rr, y, ink, 1.5);
      ctx.save(); ctx.font = "600 24px " + (p.fontM || "serif"); ctx.fillStyle = ink; ctx.textBaseline = "middle"; ctx.textAlign = "center"; ctx.fillText("[", X(0), y); ctx.fillText("]", X(TAU), y); ctx.restore();
      for (var j = 1; j < 4; j++) { line(ctx, X(j * PI / 2), y - 5, X(j * PI / 2), y + 5, ink, 1.2); }
      [[0, "0"], [PI, "π"], [TAU, "2π"]].forEach(function(t){ words(ctx, t[1], X(t[0]), y + 18, { size:11, align:"center", w:400 }); });
      if (sc.marker != null) { line(ctx, X(sc.marker), 6, X(sc.marker), H - 4, ink, 1.5, [5, 4]); }
      var last = [-1e9, -1e9];
      (sc.pts || []).forEach(function(q){
        var Xq = X(q.x); disc(ctx, Xq, y, 6.5, css("--hi")); disc(ctx, Xq, y, 4.5, ink);
        var r = Xq - last[0] >= 34 ? 0 : 1; last[r] = Xq;
        lab(ctx, p, [{ t:q.tag + " " }, { s:q.lab }], Xq, r ? y - 44 : y - 22, { size:12, align:"center" });
      });
      if (sc.count != null) words(ctx, sc.count, W - 8, y, { size:14, color:ink, w:700, align:"right" });
    } });
}

// ---------- u-panel: the quadratic Q(u) drawn sideways, sharing the graph's vertical scale ----------
// sc = {q:[a, b, c], ymax, roots:[{v, lab}], prog (0..1), pulse (0..1), rot (phones: u across)}
function upScene(p, sc){
  var a = sc.q[0], b = sc.q[1], c = sc.q[2], ym = sc.ymax, Q = function(u){ return a * u * u + b * u + c; };
  var lo = 0, hi = 0; for (var i = 0; i <= 60; i++) { var u = -ym + 2 * ym * i / 60, qv = Q(u); lo = Math.min(lo, qv); hi = Math.max(hi, qv); }
  var pad = (hi - lo) * 0.12 + 0.3; lo -= pad; hi += pad;
  var rot = sc.rot, view = rot ? { xmin:-ym, xmax:ym, ymin:lo, ymax:hi } : { xmin:lo, xmax:hi, ymin:-ym, ymax:ym };
  p.draw({ view:view, ticks:false, describe:sc.desc,
    after:function(ctx){
      var ink = css("--ink"), N = Math.max(2, Math.round(80 * (sc.prog == null ? 1 : sc.prog))), pts = [];
      for (var j = 0; j <= N; j++) { var uu = -ym + 2 * ym * (sc.prog == null ? 1 : sc.prog) * j / N; pts.push(rot ? [uu, Q(uu)] : [Q(uu), uu]); }
      if (sc.prog !== 0) p.curve({ pts:pts, color:ink, width:2.4 });
      words(ctx, rot ? "Q(u), u across" : "Q(u)", 6, 12, { size:11, color:ink });
      words(ctx, "Q = 0", rot ? 6 : p.X(0) + 4, rot ? p.Y(0) - 9 : p.H - 10, { size:11 });
      if (sc.prog == null || sc.prog >= 1) (sc.roots || []).forEach(function(r){
        var inside = Math.abs(r.v) <= ym, X = rot ? p.X(clamp(r.v, -ym, ym)) : p.X(0), Y = rot ? p.Y(0) : p.Y(clamp(r.v, -ym, ym));
        var pr = sc.pulse ? 1 + 0.6 * Math.abs(Math.sin(sc.pulse * 2 * PI)) : 1;
        if (inside) { disc(ctx, X, Y, 9 * pr, css("--hi")); disc(ctx, X, Y, 5, ink); }
        else arrowHead(ctx, rot ? (r.v > 0 ? p.W - 3 : 3) : X, rot ? Y : (r.v > 0 ? 3 : p.H - 3), rot ? (r.v > 0 ? 0 : PI) : (r.v > 0 ? -PI / 2 : PI / 2), ink, 10);
        lab(ctx, p, "u = " + r.lab, rot ? X : X + 8, rot ? Y + (inside ? 18 : 30) : Y + (inside ? 0 : r.v > 0 ? 16 : -16), { size:12, align:rot ? "center" : "left" });
      });
    } });
}

// ---------- @component radioGroup (adapted from MHF4U 28) — segmented control or chip row as a real radio group ----------
function radios(host, o){
  var val = o.value;
  function paint(){
    host.innerHTML = '<div class="seg-wrap">' + (o.label ? '<span class="tiny ts-rl" aria-hidden="true">' + o.label + "</span>" : "") + '<span class="' + (o.chips ? "ts-rc" : "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "")) + '">' +
      o.options.map(function(x){ var on = val === x.id; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rv="' + x.id + '"' + (x.say ? ' aria-label="' + x.say + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></div>";
  }
  function pick(id, focus){ if (o.busy && o.busy()) return; var ch = id !== val; val = id; paint(); if (focus) { var b = host.querySelector('[data-rv="' + id + '"]'); if (b) b.focus({ preventScroll:true }); } if (ch && o.onChange) o.onChange(id); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rv]"); if (b) pick(b.dataset.rv, true); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rv]"); if (!b) return;
    var d = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[e.key]; if (d == null) return;
    e.preventDefault(); var n = o.options.length, i = o.options.map(function(x){ return x.id; }).indexOf(b.dataset.rv); pick(o.options[(i + d + n) % n].id, true);
  });
  paint();
  return { set:function(id){ if (id !== val) { val = id; paint(); } }, get:function(){ return val; } };
}
// @component N9 heightSlider — line-height slider (hundredths) with 40 px − and + buttons, Shift+arrow ±0.1, PageUp/PageDown to
//   the next exact value, Home/End, and an exact-value chip row; o = {id, label, say, get() -> {v, ex}, range() -> [min, max], chips() -> [labels], onSet(v, ex)}
function heightCtl(host, o){
  host.innerHTML = '<div class="ts-sl"><div class="slider-top"><label for="' + o.id + '">' + o.label + '</label><output id="' + o.id + '-o" for="' + o.id + '"></output></div>' +
    '<div class="ts-slrow"><button type="button" class="btn sm ts-pm" data-d="-1" data-k="' + o.id + 'm" aria-label="' + o.say + ' down 0.01">−</button><input type="range" id="' + o.id + '" step="1"><button type="button" class="btn sm ts-pm" data-d="1" data-k="' + o.id + 'p" aria-label="' + o.say + ' up 0.01">+</button></div>' +
    '<div class="ts-exc" role="group" aria-label="Exact values"></div></div>';
  var inp = $("input", host), out = $("output", host), exc = $(".ts-exc", host);
  function paint(){
    var V = o.get(), r = o.range(); inp.min = r[0]; inp.max = r[1]; inp.value = Math.round(V.v * 100);
    out.innerHTML = m(vS(V.v, V.ex, true)); inp.setAttribute("aria-valuetext", vT(V.v, V.ex));
    MV.keepFocus(exc, function(){ exc.innerHTML = o.chips().map(function(l){ var on = V.ex && near(exVal(l), V.v); return '<button type="button" class="chip ts-xc' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-x="' + l + '" data-k="' + o.id + "x" + l + '" aria-label="' + l.replace(/-/g, MINUS) + '">' + m(stk(l)) + "</button>"; }).join(""); });
  }
  function setN(n){ var r = o.range(); n = clamp(n, r[0], r[1]); o.onSet(n / 100, n === 0 || Math.abs(n) === 50 || Math.abs(n) === 100); }
  inp.addEventListener("input", function(){ setN(+inp.value); });
  inp.addEventListener("keydown", function(e){
    var n = Math.round(o.get().v * 100), up = e.key === "ArrowRight" || e.key === "ArrowUp";
    if (e.shiftKey && /^Arrow/.test(e.key)) { e.preventDefault(); setN(n + (up ? 10 : -10)); }
    else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault(); var cv = o.get().v, vals = o.chips().map(exVal).sort(function(a, b){ return a - b; });
      var t = e.key === "PageUp" ? vals.filter(function(x){ return x > cv + 1e-9; })[0] : vals.filter(function(x){ return x < cv - 1e-9; }).pop();
      if (t != null) o.onSet(t, true);
    }
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b) return; if (b.dataset.d) setN(Math.round(o.get().v * 100) + (+b.dataset.d)); else if (b.dataset.x) o.onSet(exVal(b.dataset.x), true); });
  return { paint:paint };
}

// ---------- hero (storyboard in the plan; reduced motion shows the final frame) ----------
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:XV.xmin, xmax:XV.xmax, ymin:-1.6, ymax:1.6 }), st = { w:0, line:0, pts:0, mir:0 };
  var CAPS = ["2 sin x - 1 = 0", "2 sin x = 1", "sin x = {1}/{2}"], one = $(".hero-eq .ts-one");
  function cap(i){ f.cap.innerHTML = '<span class="ts-hc">' + (i < 3 ? m(CAPS[i]) : m("2 sin x - 1 = 0 →") + " " + m("x = {π}/{6}") + " or " + m("x = {5π}/{6}")) + "</span>"; }
  p.render = function(){
    p.draw({ view:{ xmin:XV.xmin, xmax:XV.xmax, ymin:-1.6, ymax:1.6 }, xTicks:{ step:PI / 2, pi:true, den:2 }, yTicks:{ step:0.5 },
      describe:"Graph of y = sin x from 0 to 2π and the line y = 1/2. They meet at π/6 and 5π/6. Inset: the line y = 1/2 cuts the unit circle at π/6 and 5π/6, mirror images in the y-axis.",
      after:function(ctx){
        var W = p.W, H = p.H, ink = css("--ink"), f3 = css("--f3"), hi = css("--hi"), oy = p.Y(0), x0 = p.X(0), x1 = p.X(TAU);
        if (st.w > 0) {
          p.curve({ f:Math.sin, color:css("--pen"), width:3, domain:[0, TAU * st.w] });
          ctx.save(); ctx.font = "600 22px " + (p.fontM || "serif"); ctx.fillStyle = ink; ctx.textBaseline = "middle"; ctx.textAlign = "center"; ctx.fillText("[", x0, oy); if (st.w >= 1) ctx.fillText("]", x1, oy); ctx.restore();
        }
        var ly = 1.6 - 1.1 * st.line;
        if (st.line > 0) { line(ctx, 0, p.Y(ly), W, p.Y(ly), f3, 2.6); if (st.line >= 1) lab(ctx, p, "y = {1}/{2}", W * 0.66, p.Y(0.5) + 20, { size:13, color:f3, align:"right" }); }
        [PI / 6, 5 * PI / 6].slice(0, st.pts).forEach(function(x, i){ var X = p.X(x); line(ctx, X, p.Y(0.5), X, oy, hi, 2.5, [5, 4]); ptDot(ctx, X, p.Y(0.5)); lab(ctx, p, ["{π}/{6}", "{5π}/{6}"][i], X, oy + 22, { size:13, align:"center" }); });
        var s = W * 0.3, bx = W - s - 2, byy = 2, cx = bx + s / 2, cy = byy + s / 2, R = s * 0.36;
        ctx.save(); ctx.fillStyle = css("--sheet"); ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1.5; ctx.fillRect(bx, byy, s, s); ctx.strokeRect(bx, byy, s, s); ctx.restore();
        line(ctx, bx + 4, cy, bx + s - 4, cy, css("--plot-axis"), 1); line(ctx, cx, byy + 4, cx, byy + s - 4, st.mir > 0 ? hi : css("--plot-axis"), st.mir > 0 ? 3.5 : 1, st.mir > 0 ? [2, 5] : null);
        disc(ctx, cx, cy, R, null, css("--ink-2"), 2);
        if (st.line > 0) { var iy = cy - R * (1.4 - 0.9 * st.line); line(ctx, bx + 2, iy, bx + s - 2, iy, f3, 2.4); }
        [PI / 6, 5 * PI / 6].slice(0, st.pts).forEach(function(a){ line(ctx, cx, cy, cx + R * Math.cos(a), cy - R * Math.sin(a), css("--pen"), 2.5); disc(ctx, cx + R * Math.cos(a), cy - R * Math.sin(a), 6, hi); disc(ctx, cx + R * Math.cos(a), cy - R * Math.sin(a), 3.5, ink); });
      } });
  };
  function end(){ st = { w:1, line:1, pts:2, mir:1 }; cap(3); if (one) one.classList.add("on"); p.render(); }
  if (MV.reduceMotion) { end(); return; }
  cap(0); p.render();
  chain([tw(1200, function(t){ st.w = t; p.render(); }), wt(300), now(function(){ cap(1); }), wt(450), now(function(){ cap(2); }), wt(450),
    tw(800, function(t){ st.line = t; p.render(); }), now(function(){ if (one) one.classList.add("on"); }),
    wt(250), now(function(){ st.pts = 1; p.render(); }), wt(600), now(function(){ st.pts = 2; p.render(); }), wt(400),
    tw(600, function(t){ st.mir = t; p.render(); }), now(function(){ cap(3); })]);
}

// ---------- Explore: line meets wave ----------
function explore(host, api){
  var C = api.content, S = api.S, BANK = C.bank, CH = {}; C.challenges.forEach(function(c){ CH[c.id] = c; });
  if (!S.mode) { S.mode = "one"; S.f = "sin"; S.k = "1"; S.v = 0.5; S.ex = true; S.bank = "B1"; S.bf = "sin"; S.p = { v:0.5, ex:true }; S.q = { v:-1, ex:true }; S.view = "graph"; S.prof = []; S.swept = false; }
  var A = { busy:false, cover:null }, lock = { on:false, shown:false };
  host.innerHTML = '<div class="ts-ex"><div class="ts-top"><div class="ts-mode"></div><div class="ts-vsw"></div></div>' +
    '<p class="eq-cap ts-cap" aria-live="polite"></p><p class="ts-fac"></p><p class="banner" data-mv="banner" aria-live="polite"></p><div class="ts-lock" hidden></div>' +
    '<div class="ts-views" data-mv="graph"><div class="ts-v ts-gv" data-v="graph"><div class="ts-gwrap"><div class="ts-upw"><canvas class="ts-up" role="img"></canvas><p class="tiny muted ts-upn">The roots become line heights.</p></div>' +
    '<div class="ts-gw"><canvas class="plot ts-g" role="img" tabindex="0"></canvas></div></div><div class="ts-hid" hidden></div></div>' +
    '<div class="ts-v ts-cv" data-v="circle"><canvas class="plot square ts-c" role="img" tabindex="0"></canvas><div class="ts-hid" hidden></div></div>' +
    '<div class="ts-v ts-nv" data-v="count"><canvas class="ts-n" role="img"></canvas><p class="tiny ts-leg"></p><div class="ts-hid" hidden></div></div></div>' +
    '<div class="ts-stw"><canvas class="ts-st" role="img"></canvas><div class="ts-hid" hidden></div></div>' +
    '<div class="ts-low"><div class="ts-ctl"><div class="ts-o1"><div class="ts-fn"></div><div class="ts-k"></div><div class="ts-h"></div></div>' +
    '<div class="ts-o2"><label class="ts-sel"><span>Equation</span><select class="ts-bank"></select></label><div class="ts-own"><div class="ts-bf"></div><div class="ts-p"></div><div class="ts-q"></div></div></div>' +
    '<div class="q-actions"><button type="button" class="btn sm" data-a="sweep" data-k="tssweep">Sweep the line</button><button type="button" class="btn sm" data-a="split" data-k="tssplit">Split</button><button type="button" class="btn ghost sm" data-a="reset" data-k="tsreset">Reset</button></div></div>' +
    '<div class="ts-rd"><dl class="read" aria-live="polite"></dl></div></div></div>';
  var E = { root:$(".ts-ex", host), cap:$(".ts-cap", host), fac:$(".ts-fac", host), lockN:$(".ts-lock", host), views:$(".ts-views", host), read:$("dl.read", host), leg:$(".ts-leg", host),
    one:$(".ts-o1", host), two:$(".ts-o2", host), own:$(".ts-own", host), sel:$(".ts-bank", host), hid:$$(".ts-hid", host) };
  E.sel.innerHTML = BANK.map(function(b){ return '<option value="' + b.id + '">' + b.id + ": " + MV.esc(MV.plain(b.eq)) + "</option>"; }).join("") + '<option value="B7">B7: Build your own</option>';
  var G = new MV.Plot($(".ts-g", host), { xmin:XV.xmin, xmax:XV.xmax, ymin:-1.6, ymax:1.6 }), CI = new MV.Plot($(".ts-c", host), { xmin:-1.5, xmax:1.5, ymin:-1.5, ymax:1.5 }, { equal:true });
  var N = new MV.Plot($(".ts-n", host), { xmin:-1.5, xmax:1.5, ymin:0, ymax:8 }), ST = new MV.Plot($(".ts-st", host), { xmin:0, xmax:1, ymin:0, ymax:1 }), UP = new MV.Plot($(".ts-up", host), { xmin:-1, xmax:1, ymin:-1, ymax:1 });
  var busy = function(){ return A.busy; };
  var R = {
    mode:radios($(".ts-mode", host), { aria:"Mode", options:[{ id:"one", t:"One line" }, { id:"two", t:"Two lines" }], value:S.mode, busy:busy, onChange:function(id){ user(); S.mode = id; if (id === "two" && S.view === "count") S.view = "graph"; A.sp = null; done(); } }),
    view:radios($(".ts-vsw", host), { aria:"View", options:[{ id:"graph", t:"Graph" }, { id:"circle", t:"Circle" }, { id:"count", t:"Count" }], value:S.view, onChange:function(id){ S.view = id; api.save(); paint(); } }),
    fn:radios($(".ts-fn", host), { label:"Function " + m("f"), chips:true, options:["sin", "cos", "tan"].map(function(x){ return { id:x, t:m(x) }; }), value:S.f, busy:busy, onChange:function(id){ user(); setF(id); done(); } }),
    k:radios($(".ts-k", host), { label:"Inside angle " + m("@k{k}"), aria:"Inside angle k", chips:true, options:[["h", "x/2", "x over 2"], ["1", "x", "x"], ["2", "2x", "2x"], ["3", "3x", "3x"]].map(function(x){ return { id:x[0], t:'<span class="ts-kc">' + m(x[1]) + "</span>", say:x[2] }; }), value:S.k, busy:busy, onChange:function(id){ user(); S.k = id; clearProf(); visit(); done(); } }),
    bf:radios($(".ts-bf", host), { label:"Function " + m("f"), chips:true, options:["sin", "cos"].map(function(x){ return { id:x, t:m(x) }; }), value:S.bf, busy:busy, onChange:function(id){ user(); S.bf = id; done(); } })
  };
  var H = heightCtl($(".ts-h", host), { id:"ts-v", label:"Line height □", say:"Line height", get:function(){ return { v:S.v, ex:S.ex }; }, range:rangeN, chips:function(){ return CHIPS[S.f === "tan" ? "tan" : "sc"]; }, onSet:function(v, ex){ if (A.busy) return; user(); S.v = v; S.ex = ex; visit(); done(); } });
  var HP = heightCtl($(".ts-p", host), { id:"ts-p", label:"Height " + m("p"), say:"Height p", get:function(){ return S.p; }, range:function(){ return [-150, 150]; }, chips:function(){ return CHIPS.sc; }, onSet:function(v, ex){ if (A.busy) return; user(); S.p = { v:v, ex:ex }; done(); } });
  var HQ = heightCtl($(".ts-q", host), { id:"ts-q", label:"Height " + m("q"), say:"Height q", get:function(){ return S.q; }, range:function(){ return [-150, 150]; }, chips:function(){ return CHIPS.sc; }, onSet:function(v, ex){ if (A.busy) return; user(); S.q = { v:v, ex:ex }; done(); } });
  function rangeN(){ return S.f === "tan" ? [-400, 400] : [-150, 150]; }
  function setF(id){ var r = rangeN(); S.f = id; var r2 = rangeN(); if (Math.abs(S.v) * 100 > r2[1] + 1e-9) { S.v = S.v > 0 ? r2[1] / 100 : r2[0] / 100; S.ex = false; } void r; clearProf(); visit(); }
  function clearProf(){ S.prof = []; S.swept = false; }
  function visit(){ if (S.mode !== "one") return; var n = solve(S.f, S.k, S.v).sols.length, key = Math.round(S.v * 100); S.prof = (S.prof || []).filter(function(d){ return Math.round(d[0] * 100) !== key; }); S.prof.push([S.v, n]); }
  function user(){ A.cover = null; A.p2 = null; A.p3 = null; if (lock.on) lock.shown = false; }
  function done(){ api.save(); paint(); }

  // ----- the current model -----
  function bank(){ return BANK.filter(function(b){ return b.id === S.bank; })[0]; }
  function two(){
    var b = S.bank === "B7" ? null : bank(), f = b ? b.f : S.bf, Ls = b ? b.lines.map(function(v){ return { v:v, ex:true, lab:vS(v, true) }; }) : [S.p, S.q].map(function(L){ return { v:L.v, ex:L.ex, lab:vS(L.v, L.ex) }; });
    var os = Ls.map(function(L){ return solve(f, "1", L.v); }), all = [];
    os.forEach(function(o, li){ o.sols.forEach(function(s){ if (!all.some(function(a){ return near(a.x, s.x, 1e-7); })) all.push({ s:s, li:li }); }); });
    all.sort(function(p, q){ return p.s.x - q.s.x; });
    var q = b ? b.q : [1, -(S.p.v + S.q.v), S.p.v * S.q.v];
    return { b:b, f:f, L:Ls, os:os, all:all, q:q, same:!b && near(S.p.v, S.q.v), ymax:f === "tan" ? 4.5 : 1.6 };
  }
  function lineEq(f, L){ return f + " x = " + L.lab; }

  // ----- caption, factored form, lock note -----
  function paintCap(){
    if (S.mode === "one") { E.cap.innerHTML = m(fnS(S.f, S.k, true) + " = ") + ' <span class="ts-bx">' + m(vS(S.v, S.ex, true)) + "</span>"; E.fac.innerHTML = ""; E.fac.className = "ts-fac"; }
    else {
      var T = two();
      if (T.b) { E.cap.innerHTML = T.b.eq; E.fac.innerHTML = "Factored: " + T.b.fac; }
      else { E.cap.innerHTML = expanded(T); E.fac.innerHTML = "Factored: " + m(facS(T.f, S.p) + facS(T.f, S.q) + " = 0"); }
      E.fac.className = "ts-fac" + (A.sp && !A.sp.fac ? " hide" : "");
    }
    E.lockN.hidden = !lock.on;
    if (lock.on) E.lockN.innerHTML = "<p><strong>Commit first is on.</strong> " + (lock.shown ? "This is the state you checked. Change a control and the views hide again." : "The views stay hidden until you press <strong>Check challenge</strong> on challenge 3.") + ' <button type="button" class="btn ghost sm" data-tc3="off" data-k="tc3off">Show the views</button></p>';
  }
  function facS(f, P){ var l = vS(Math.abs(P.v), P.ex); return "(" + f + " x" + (near(P.v, 0) ? "" : P.v < 0 ? " + " + l : " - " + l) + ")"; }
  function coefS(c, first, var_){ // a term with an exact or 2-decimal coefficient
    if (near(c, 0)) return "";
    var l = vS(Math.abs(c), true), s = c < 0 ? (first ? "-" : " - ") : first ? "" : " + ";
    return s + (var_ && near(Math.abs(c), 1) ? "" : l + (var_ ? " " : "")) + var_;
  }
  function expanded(T){ var f = T.f, q = T.q; var s = m(f + "^2x" + coefS(q[1], false, f + " x") + coefS(q[2], false, "") + " = 0"); return s; }

  // ----- graph -----
  function hidden(){ return lock.on && !lock.shown; }
  G.render = function(){
    if (hidden()) { G.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, describe:"Hidden until you press Check challenge." }); return; }
    var sc;
    if (S.mode === "one") {
      var K = A.K || KN[S.k][0] / KN[S.k][1], o = solve(S.f, S.k, S.v), pts = o.sols.map(function(s, i){ return { x:s.x, y:S.v, tag:circ(i), lab:xL(s), s:s }; });
      if (/^p2/.test(A.cover || "") || (A.p2 && !A.p2.dot2)) pts = pts.filter(function(q){ return near(q.x, PI / 3, 1e-6); });
      if (A.p3) pts = A.p3.pop == null ? [] : pts.slice(0, A.p3.pop);
      var outs = (A.cover === "p2" || (A.p2 && !A.p2.dot2) || A.p3 && A.p3.pop == null) ? [] : o.outs.map(function(s){ return { x:s.x, y:S.v }; });
      var brK = A.K || (S.k !== "1" ? KN[S.k][0] / KN[S.k][1] : null), brA = A.p3 ? A.p3.br : S.k !== "1" ? 1 : 0;
      sc = { f:S.f, K:K, ymax:S.f === "tan" ? 4.5 : 1.6, lines:[{ v:S.v, ext:1, tag:"y = " + vS(S.v, S.ex, true) }], pts:pts, outs:outs,
        br:brK ? { a:brA, K:brK, lab:A.K ? null : { h:"4π", "2":"π", "3":"{2π}/{3}" }[S.k] } : null, desc:descOne(o, pts.length < o.sols.length) };
    } else {
      var T = two(), sp = A.sp, nn = 0, shown = [];
      T.all.forEach(function(a, i){ var popped = !sp || (sp.pop[a.li] > T.os[a.li].sols.indexOf(a.s)); if (popped) shown.push({ x:a.s.x, y:T.L[a.li].v, tag:circ(i) + " (line " + circ(a.li) + ")", lab:xL(a.s) }); nn++; });
      if (A.cover === "p4") shown = [];
      sc = { f:T.f, K:1, ymax:T.ymax, pts:shown, outs:[], desc:descTwo(T),
        lines:T.L.map(function(L, li){ var miss = !T.os[li].possible, ext = A.cover === "p4" ? 0 : sp ? sp.ext[li] : 1;
          return { v:L.v, left:true, dash:li ? [10, 6] : null, ext:ext, alpha:miss ? (sp ? 1 - 0.6 * sp.fade[li] : 0.4) : 1, tag:[{ t:circ(li) + " " }, { s:lineEq(T.f, L) + (miss ? ": " : "") }].concat(miss ? [{ t:"misses the wave" }] : []) }; }) };
    }
    waveScene(G, sc);
  };
  function descOne(o, part){
    var e = "Graph of y = " + MV.plain(m(fnS(o.f, o.k))) + " and the line y = " + vT(o.v, S.ex);
    if (part) return e + ". One meeting point shows, at π/3; the rest is covered until you predict.";
    if (!o.possible) return e + ". The line misses the wave: no meeting points.";
    var n = o.sols.length, xs = o.sols.map(function(s){ return MV.plain(xL(s).replace(/[{}]/g, "")); });
    return e + " on 0 to 2π. They meet " + (n === 1 ? "once" : n + " times") + (n ? ": at " + andList(xs) : "") + "." + (o.outs.length ? " " + cap1(nSol(o.outs.length).replace("solution", "more meeting point")) + " lie outside the interval." : "");
  }
  function descTwo(T){ return "Graph of y = " + T.f + " x with the lines " + T.L.map(function(L){ return "y = " + L.lab.replace(/-/g, MINUS); }).join(" and ") + ". " + (A.cover === "p4" ? "The lines are hidden until you predict." : "They meet the wave " + T.all.length + " times on 0 to 2π."); }

  // ----- circle -----
  CI.render = function(){
    if (hidden() || A.cover === "p2") { CI.draw({ view:{ xmin:-1, xmax:1, ymin:-1, ymax:1 }, grid:false, axes:false, describe:"Hidden." }); return; }
    var sc;
    if (S.mode === "one") {
      var o = solve(S.f, S.k, S.v), half = S.k === "h", cuts = cutsOf(o), P2 = A.p2;
      sc = { f:S.f, lines:[{ v:S.v, ext:P2 ? P2.drop : 1 }], cuts:cuts, arms:cuts.map(function(c){ return c.a; }), grey:half,
        laps:S.k === "1" ? null : MV.plain(m("u = " + kxS(S.k))) + ": " + { h:"half a lap", "2":"2 laps", "3":"3 laps" }[S.k],
        miss:!o.possible ? "misses the circle: no solutions" : null, mirror:null, desc:"Unit circle with the line for " + MV.plain(m(fnS(S.f, S.k))) + " = " + vT(S.v, S.ex) + ". " + (o.possible ? "It cuts the circle at " + cuts.length + " point" + (cuts.length === 1 ? "" : "s") + "." : "It misses the circle.") };
      if (o.possible && cuts.length) {
        var q1 = cuts.filter(function(c){ var a = c.a % (PI / 2); return a > 1e-6 && a < PI / 2 - 1e-6; })[0];
        if (q1 || o.ref === 0 || o.ref === 6) sc.ref = { a:q1 ? q1.a : null, lab:"α = " + (o.ref != null ? twS(o.ref, true) : "≈ " + dec(o.al)) };
        if (cuts.length >= 2) sc.mirror = S.f === "sin" ? "y" : S.f === "cos" ? "x" : cuts[0].a;
      }
      if (P2) {
        sc.cuts = P2.drop >= 1 ? cuts.filter(function(c){ return near(c.a, PI / 3, 1e-6); }) : []; sc.arms = P2.drop >= 1 ? [PI / 3] : []; sc.mirror = P2.flash > 0 ? "x" : null; sc.mirA = Math.sin(PI * P2.flash) * 0.8 + 0.2; sc.ref = null;
        sc.after = function(ctx, Rr, cx, cy){
          if (P2.sweep > 0) {
            var ag = -PI / 3 * P2.sweep; line(ctx, cx, cy, cx + Rr * Math.cos(ag), cy - Rr * Math.sin(ag), css("--pen"), 3);
            if (P2.sweep >= 1) { ptDot(ctx, cx + Rr * Math.cos(ag), cy - Rr * Math.sin(ag)); }
            if (P2.arc > 0) { ctx.save(); ctx.globalAlpha = 0.55; ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, Rr * 0.22, PI / 3, PI / 3 - TAU * P2.arc, true); ctx.stroke(); ctx.restore(); }
            lab(ctx, CI, P2.arc > 0 ? "-{π}/{3} + 2π = {5π}/{3}" : "-{π}/{3}", cx + Rr * 0.95 * Math.cos(ag) + 6, cy - Rr * 1.08 * Math.sin(ag) + 18, { size:13, align:P2.arc > 0 ? "right" : "left" });
          }
        };
      }
      if (A.p3 && A.p3.lap != null) {
        var U = A.p3.lap; sc.cuts = []; sc.arms = []; sc.ref = null; sc.mirror = null; sc.laps = MV.plain(m("u = 2x")) + ": lap " + Math.min(2, Math.floor(U / TAU) + 1);
        sc.after = function(ctx, Rr, cx, cy){ var X = cx + Rr * Math.cos(U), Y = cy - Rr * Math.sin(U); line(ctx, cx, cy, X, Y, css("--pen"), 3); disc(ctx, X, Y, 6, css("--ink")); };
      }
    } else {
      var T = two(), sp = A.sp, all = [];
      T.all.forEach(function(a, i){ if (!sp || sp.pop[a.li] > T.os[a.li].sols.indexOf(a.s)) all.push({ s:a.s, i:i }); });
      if (A.cover === "p4") all = [];
      var grouped = cutsOf({ sols:all.map(function(x){ return x.s; }) }, all.map(function(x){ return circ(x.i); }));
      sc = { f:T.f, cuts:grouped, arms:grouped.map(function(c){ return c.a; }),
        lines:T.L.map(function(L, li){ var miss = !T.os[li].possible; return { v:L.v, dash:li ? [10, 6] : null, ext:A.cover === "p4" ? 0 : sp ? sp.ext[li] : 1, alpha:miss ? 0.4 : 1 }; }),
        desc:"Unit circle with both lines. They cut the circle at " + grouped.length + " points." };
    }
    circScene(CI, sc);
  };

  // ----- count view -----
  N.render = function(){
    var r = rangeN(), lo = r[0] / 100, hi = r[1] / 100;
    if (hidden() || A.cover === "p2" || S.mode !== "one") { N.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, describe:"Hidden." }); return; }
    var dots = (A.sweep ? A.sweep : S.prof || []), prof = S.swept && !A.sweep ? profile() : null;
    N.draw({ view:{ xmin:lo - (hi - lo) * 0.06, xmax:hi + (hi - lo) * 0.03, ymin:-1.2, ymax:8.6 }, axes:false, grid:false,
      describe:"Count of solutions plotted against the line height." + (prof ? " " + MV.plain(legend(prof)) : " Visited heights: " + dots.length + "."),
      after:function(ctx){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), W = N.W, H = N.H, y0 = N.Y(0);
        ctx.save(); ctx.strokeStyle = css("--plot-grid"); ctx.lineWidth = 1; ctx.beginPath(); for (var j = 1; j <= 8; j++) { ctx.moveTo(N.X(lo), N.Y(j)); ctx.lineTo(W, N.Y(j)); } ctx.stroke(); ctx.restore();
        line(ctx, N.X(lo), y0, W, y0, ink, 1.5); line(ctx, N.X(lo), N.Y(8.4), N.X(lo), y0, ink, 1.5);
        for (var k = 0; k <= 8; k += 2) words(ctx, String(k), N.X(lo) - 5, N.Y(k), { size:11, align:"right", w:400 });
        var st = hi - lo > 4 ? 1 : 0.5; for (var t = Math.ceil(lo / st) * st; t <= hi + 1e-9; t += st) { var X = N.X(t); line(ctx, X, y0, X, y0 + 4, ink, 1); words(ctx, dec(t, st < 1 ? 1 : 0).replace(".0", ""), X, y0 + 13, { size:11, align:"center", w:400 }); }
        words(ctx, "number of solutions", N.X(lo) + 6, 9, { size:11 }); words(ctx, "□", W - 6, y0 - 10, { size:12, align:"right" });
        if (prof) {
          prof.segs.forEach(function(sg){ line(ctx, N.X(sg.a), N.Y(sg.n), N.X(sg.b), N.Y(sg.n), pen, 3); [sg.a, sg.b].forEach(function(e){ if (e > lo + 1e-9 && e < hi - 1e-9) disc(ctx, N.X(e), N.Y(sg.n), 4.5, css("--sheet"), pen, 2); }); });
          prof.pts.forEach(function(pt){ disc(ctx, N.X(pt.v), N.Y(pt.n), 5.5, pen); });
        } else dots.forEach(function(d){ disc(ctx, N.X(d[0]), N.Y(d[1]), 3.2, pen); });
        if (S.mode === "one") { var cx = N.X(S.v); line(ctx, cx, N.Y(8.4), cx, y0, css("--f3"), 1.5, [3, 4]); }
      } });
    E.leg.innerHTML = prof ? legend(prof) : "Every height you visit leaves a dot. Press <strong>Sweep the line</strong> to see the whole profile.";
  };
  function breaks(){ return S.f === "tan" ? [0] : [-1, 0, 1]; }
  function profile(){
    var r = rangeN(), lo = r[0] / 100, hi = r[1] / 100, B = breaks(), ends = [lo].concat(B, [hi]), segs = [], pts = [];
    for (var i = 0; i + 1 < ends.length; i++) segs.push({ a:ends[i], b:ends[i + 1], n:solve(S.f, S.k, (ends[i] + ends[i + 1]) / 2).sols.length });
    B.forEach(function(v){ var o = solve(S.f, S.k, v); pts.push({ v:v, n:o.sols.length, o:o }); });
    return { segs:segs, pts:pts };
  }
  function legend(prof){
    var parts = prof.pts.map(function(pt){
      var v = m(vS(pt.v, true)), n = pt.n, xs = andList(pt.o.sols.map(function(s){ return m(xS(s)); }));
      if (!n) return "□ = " + v + " gives no solutions in " + m("0 ≤ x ≤ 2π");
      if (pt.v === 0) return "□ = 0 passes through " + xs + " (" + nSol(n) + ")";
      return "□ = " + v + " touches the wave at " + xs + " (" + nSol(n) + ")";
    });
    return "Special heights for " + m(fnS(S.f, S.k)) + ": " + parts.join("; ") + "." + (S.f === "tan" ? " Every other height gives " + nSol(prof.segs[0].n) + "." : "");
  }

  // ----- strip -----
  ST.render = function(){
    if (hidden() || A.cover) { stripScene(ST, { pts:[], desc:"Solution strip, covered." }); return; }
    var pts = [], n;
    if (S.mode === "one") { var o = solve(S.f, S.k, S.v); if (A.p2 && !A.p2.dot2 || A.p3 && A.p3.pop == null) o = { sols:[] }; pts = o.sols.map(function(s, i){ return { x:s.x, tag:circ(i), lab:xL(s) }; }); n = o.sols.length; }
    else { var T = two(); if (!A.sp || A.sp.strip) pts = T.all.map(function(a, i){ return { x:a.s.x, tag:circ(i), lab:xL(a.s) }; }); n = pts.length; }
    stripScene(ST, { pts:pts, count:cap1(nSol(n)), desc:"Solution strip from 0 to 2π: " + cap1(nSol(n)) + (n ? ", at " + andList(pts.map(function(q){ return MV.plain(q.lab.replace(/[{}]/g, "")); })) : "") + "." });
  };
  UP.render = function(){
    if (S.mode !== "one") {
      var T = two(), sp = A.sp;
      upScene(UP, { q:T.q, ymax:T.ymax, rot:narrow(), prog:A.cover === "p4" ? 0 : sp ? sp.q : null, pulse:sp ? sp.pulse : 0, roots:T.L.map(function(L){ return { v:L.v, lab:L.lab }; }), desc:"The quadratic in u drawn sideways. Its roots are u = " + T.L.map(function(L){ return L.lab.replace(/-/g, MINUS); }).join(" and ") + "." });
    }
  };

  // ----- readout -----
  function cov(key){
    if ((A.cover === "p2" || A.cover === "p2r") && /^(sol|cnt|out|where|part)$/.test(key)) return '<span class="ts-pf">Predict first</span>';
    if (A.cover === "p4" && /^(l1|l2|all)$/.test(key)) return '<span class="ts-pf">Predict first</span>';
    if (hidden() && /^(sol|cnt|out)$/.test(key)) return '<span class="ts-pf">Hidden: reason it out first</span>';
    return null;
  }
  function row(rows, key, labl, html){ rows.push([labl, cov(key) || html]); }
  function paintRead(){
    var rows = [];
    if (S.mode === "one") {
      var o = solve(S.f, S.k, S.v), f = S.f, k = S.k, eqS = fnS(f, k) + " = " + vS(S.v, S.ex), fx = fnS(f, k);
      row(rows, "eq", "Equation", m(eqS));
      row(rows, "pos", "Possible?", f === "tan" ? "Yes: " + m("tan x") + " takes every real value." : o.possible ? "Yes: " + m("-1 ≤ " + vS(S.v, S.ex) + " ≤ 1") : "No: " + m(fx) + " is never " + (S.v > 0 ? "more than 1" : "less than −1") + ". The line misses the wave.");
      if (k !== "1") row(rows, "in", "Inside angle", m("u = " + kxS(k, true)) + ". As " + m("x") + " runs from 0 to 2π, " + m("u") + " runs from 0 to " + { h:"π: half a lap.", "2":"4π: two laps of the circle.", "3":"6π: three laps of the circle." }[k]);
      if (o.possible) {
        var fu = f + (k === "1" ? " " : "(") , al;
        if (o.ref != null) {
          if (S.v === 0 && f !== "cos") al = m("α = 0") + " (the line is the " + m("x") + "-axis)";
          else if (S.v === 0) al = m("α = π/2");
          else al = m("α = " + twS(o.ref)) + ", because " + m(f + (o.ref ? "(" + twS(o.ref) + ")" : " 0") + " = " + vS(Math.abs(S.v), true));
        } else al = m("α ≈ " + dec(o.al)) + ", because " + m(f + " " + dec(o.al) + " ≈ " + dec(Math.abs(S.v)));
        void fu;
        row(rows, "ref", "Reference angle", al);
        row(rows, "where", "Where", where(f, S.v, o));
        var vv = k === "1" ? "x" : "u";
        row(rows, "part", "Partner rule", FNAME[f] + ": " + m(vv) + " and " + m(f === "sin" ? "π - " + vv : f === "cos" ? "2π - " + vv : vv + " + π") + " have the same " + { sin:"sine", cos:"cosine", tan:"tangent" }[f]);
      }
      row(rows, "sol", "Solutions", solRow(o));
      row(rows, "cnt", "How many", cap1(nSol(o.sols.length)));
      var out = outRow(o, eqS);
      if (out) row(rows, "out", "Outside the interval", out);
    } else {
      var T = two();
      row(rows, "eq", "Equation", T.b ? T.b.eq : expanded(T));
      row(rows, "fac", "Factored", T.b ? T.b.fac : m(facS(T.f, S.p) + facS(T.f, S.q) + " = 0"));
      T.L.forEach(function(L, li){ row(rows, "l" + (li + 1), "Line " + circ(li), lineRow(T, li)); });
      if (T.same) row(rows, "same", "Same line twice", "Both factors give the same line, so its solutions count once.");
      row(rows, "all", "All solutions", T.all.length ? m("x = ") + " " + T.all.map(function(a){ return m((a.s.ex ? "" : "≈ ") + xS(a.s)); }).join(", ") + ": " + nSol(T.all.length) : "No solutions");
    }
    E.read.innerHTML = MV.readoutHTML(rows);
  }
  function where(f, v, o){
    if (v === 0 || Math.abs(v) === 1 || (o.ref != null && (o.ref === 0 || o.ref === 6) && f !== "tan")) {
      var t = f === "sin" ? (v === 1 ? "at the top of the circle, (0, 1)" : v === -1 ? "at the bottom of the circle, (0, −1)" : "where the circle meets the " + m("x") + "-axis, (1, 0) and (−1, 0)")
        : f === "cos" ? (v === 1 ? "at (1, 0), on the right of the circle" : v === -1 ? "at (−1, 0), on the left of the circle" : "at the top and bottom of the circle, (0, 1) and (0, −1)")
        : v === 0 ? "where the circle meets the " + m("x") + "-axis, (1, 0) and (−1, 0)" : null;
      if (t) return "On the axes: " + t;
    }
    var pos = v > 0, Q = { sin:pos ? "1 and 2" : "3 and 4", cos:pos ? "1 and 4" : "2 and 3", tan:pos ? "1 and 3" : "2 and 4" }[f];
    return FNAME[f] + " is " + (pos ? "positive" : "negative") + " in quadrants " + Q;
  }
  function solRow(o){
    if (!o.possible) return "No solutions";
    if (!o.sols.length) return o.k === "h" ? "No solutions: " + m("u = x/2") + " only runs from 0 to π, where " + (o.f === "sin" ? "sine is never negative" : "this value never happens") : "No solutions";
    if (o.k === "1") {
      var items = o.sols.map(function(s){ var b = s.q > 1 ? built(s, o) : null; return xH(s) + (b ? " (" + m(b) + ")" : ""); });
      var ends = o.sols.some(function(s){ return s.ex && s.t === 0; }) && o.sols.some(function(s){ return s.ex && s.t === 24; });
      return andList(items) + (ends ? " (both ends count)" : "");
    }
    var us = o.sols.map(function(s){ var b = built(s, o); return m(uS(s)) + (b && (s.q > 1 || s.lap > 0) ? " (" + m(b) + ")" : ""); });
    var div = o.k === "h" ? m("x = 2u") : m("x = u ÷ " + o.k);
    return m(o.sols[0].ex ? "u =" : "u ≈") + " " + us.join(", ") + "; " + div + ": " + o.sols.map(function(s){ return m((s.ex ? "" : "≈ ") + xS(s)); }).join(", ");
  }
  function outRow(o, eqS){
    if (!o.outs.length) return null;
    var vis = o.outs.slice().sort(function(p, q){ var dp = p.x < 0 ? -p.x : p.x - TAU, dq = q.x < 0 ? -q.x : q.x - TAU; return dp - dq; }).slice(0, 2).sort(function(p, q){ return p.x - q.x; });
    var half = o.k === "h" && o.f !== "tan";
    return vis.map(function(s){
      var head = m((s.ex ? "" : "≈ ") + xS(s)) + " also solves " + m(eqS) + ", but it’s outside " + m("0 ≤ x ≤ 2π") + ".";
      if (half) return head + " With " + m("x/2") + " inside, solutions repeat every 4π, so it has no partner inside the interval.";
      var tgt = s.x < 0 ? s.x + TAU : s.x - TAU, pt = o.sols.filter(function(q){ return near(q.x, tgt, 1e-7); })[0];
      return head + " " + (s.x < 0 ? "Adding" : "Subtracting") + " 2π gives " + (pt ? m((pt.ex ? "" : "≈ ") + xS(pt)) : m(dec(tgt))) + ", already in the list.";
    }).join(" ");
  }
  function lineRow(T, li){
    var L = T.L[li], o = T.os[li], f = T.f, eq = m(lineEq(f, L)), n = o.sols.length;
    if (!o.possible) return eq + ": misses the wave: no solutions (" + m(f + " x") + " is never " + (L.v > 0 ? "more than 1" : "less than −1") + ")";
    var how = Math.abs(L.v) === 1 && f !== "tan" ? "it touches the " + ((f === "sin" ? L.v > 0 : L.v > 0) ? "peak" : "trough") + (n === 2 && f === "cos" ? " at both ends" : "") : "it cuts the wave";
    return eq + ": " + m("x " + (o.sols.length && !o.sols[0].ex ? "≈" : "=")) + " " + o.sols.map(function(s){ return m(xS(s)); }).join(", ") + " (" + nSol(n) + ": " + how + ")";
  }

  // ----- controls -----
  function paintCtl(){
    E.root.classList.toggle("two", S.mode === "two"); E.root.classList.toggle("own", S.mode === "two" && S.bank === "B7");
    E.views.setAttribute("data-show", S.view);
    R.mode.set(S.mode); R.view.set(S.view); R.fn.set(S.f); R.k.set(S.k); R.bf.set(S.bf); E.sel.value = S.bank;
    E.one.hidden = S.mode !== "one"; E.two.hidden = S.mode !== "two"; E.own.hidden = S.bank !== "B7";
    $(".ts-vsw [data-rv=count]", host).hidden = S.mode === "two";
    H.paint(); if (S.bank === "B7") { HP.paint(); HQ.paint(); }
    $('[data-a="sweep"]', host).hidden = S.mode !== "one"; $('[data-a="split"]', host).hidden = S.mode !== "two";
    $$("button, select, input", $(".ts-low", host)).forEach(function(b){ if (!b.closest(".ts-rd")) b.classList.toggle("ts-busy", A.busy); });
    E.hid.forEach(function(h){ var on = hidden() || (A.cover === "p2" && (h.parentNode.classList.contains("ts-cv") || h.parentNode.classList.contains("ts-nv") || h.parentNode.classList.contains("ts-stw"))) || (A.cover === "p4" && h.parentNode.classList.contains("ts-stw"));
      h.hidden = !on; h.textContent = hidden() ? "Hidden: reason it out first" : "Predict first"; });
  }
  function paint(){ paintCtl(); paintCap(); paintRead(); G.render(); CI.render(); N.render(); ST.render(); UP.render(); MV.changed(); }
  E.sel.addEventListener("change", function(){ if (A.busy) { E.sel.value = S.bank; return; } user(); S.bank = E.sel.value; A.sp = null; done(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-a]"); if (!b || A.busy) return;
    if (b.dataset.a === "reset") { user(); S.mode = "one"; S.f = "sin"; S.k = "1"; S.v = 0.5; S.ex = true; S.view = "graph"; clearProf(); visit(); MV.banner("", ""); done(); }
    else if (b.dataset.a === "sweep") sweep();
    else if (b.dataset.a === "split") { user(); runSplit(false, function(){}); }
  });
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-tc3]"); if (!b) return;
    if (b.dataset.tc3 === "on") { if (A.busy || (MV.S.chal.tc3 && MV.S.chal.tc3.solved)) return; A.cover = null; A.p2 = A.p3 = null; lock.on = true; lock.shown = false; if (S.mode !== "one") S.mode = "one"; MV.banner("", ""); done(); var g = $(".ts-cap", host); if (g && g.scrollIntoView) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
    else { lock.on = false; done(); }
  });
  [G, CI].forEach(function(pl){ pl.c.addEventListener("keydown", function(e){ if (S.mode !== "one" || A.busy || hidden()) return; if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); var n = clamp(Math.round(S.v * 100) + (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? 10 : 1), rangeN()[0], rangeN()[1]); user(); S.v = n / 100; S.ex = n === 0 || Math.abs(n) === 50 || Math.abs(n) === 100; visit(); done(); } }); });

  // ----- sweep (6 s through every slider position, then back) -----
  function sweep(){
    user(); var r = rangeN(), keep = { v:S.v, ex:S.ex }, last = r[0] - 1;
    A.busy = true; A.sweep = []; paintCtl();
    MV.tween({ dur:6000, ease:function(t){ return t; }, step:function(t){
      var n = Math.round(r[0] + (r[1] - r[0]) * t);
      for (var j = last + 1; j <= n; j++) A.sweep.push([j / 100, solve(S.f, S.k, j / 100).sols.length]);
      last = n; S.v = n / 100; S.ex = n === 0 || Math.abs(n) === 50 || Math.abs(n) === 100; H.paint(); paintCap(); paintRead(); G.render(); CI.render(); N.render(); ST.render();
    }, done:function(){ A.busy = false; A.sweep = null; S.swept = true; S.v = keep.v; S.ex = keep.ex; MV.banner("", "Sweep done: the count view shows the whole profile."); done(); } });
  }

  // ----- split storyboard (Split button and P4) -----
  function runSplit(fromPred, fin){
    var T = two(); A.busy = true;
    A.sp = { fac:!!fromPred || !!T.b, q:0, pulse:0, ext:[0, 0], pop:[0, 0], fade:[0, 0], strip:false };
    if (!T.b) A.sp.fac = true;
    var steps = [];
    if (!fromPred) steps.push(now(function(){ A.sp.fac = false; paint(); }), wt(60), now(function(){ A.sp.fac = true; paint(); }), wt(600));
    steps.push(tw(1000, function(t){ A.sp.q = t; UP.render(); }), tw(700, function(t){ A.sp.pulse = t; UP.render(); }), now(function(){ A.sp.pulse = 0; UP.render(); }));
    [0, 1].forEach(function(li){ steps.push(tw(800, function(t){ A.sp.ext[li] = t; G.render(); CI.render(); })); });
    [0, 1].forEach(function(li){
      var n = T.os[li].sols.length;
      if (!T.os[li].possible) steps.push(tw(400, function(t){ A.sp.fade[li] = t; G.render(); }));
      for (var j = 0; j < n; j++) steps.push(now(function(){ A.sp.pop[li]++; G.render(); CI.render(); }), wt(400));
    });
    steps.push(now(function(){ A.sp.strip = true; ST.render(); }), wt(300));
    chain(steps, function(){
      A.busy = false; A.sp = null;
      var add = T.L.map(function(L, li){ var o = T.os[li]; return circ(li) + " " + m(lineEq(T.f, L)) + (o.sols.length ? " adds " + andList(o.sols.map(function(s){ return m(xS(s)); })) : " misses the wave and adds nothing"); });
      paint(); if (!fromPred) MV.banner("", MV.plain("Split: " + add.join("; ") + "."));
      api.save(); fin();
    });
  }

  // ----- predictions -----
  function startPred(p, open){
    lock.on = false; user(); var s = p.start; A.sp = null;
    if (s.mode === "one") { S.mode = "one"; S.f = s.f; S.k = s.k; S.v = s.v; S.ex = s.ex; if (open) clearProf(); }
    else { S.mode = "two"; S.bank = s.bank; }
    if (p.id === "p2") A.cover = "p2";
    if (p.id === "p4") A.cover = "p4";
    if (p.id === "p1") { clearProf(); visit(); }
    if (narrow() && S.mode === "two" && S.view === "count") S.view = "graph";
    done();
  }
  var lastOpen = -1, PH = $("#pred");
  if (PH) new MutationObserver(function(){
    var t = $(".pred-top .tiny", PH), mm = t && /Prediction (\d+)/.exec(t.textContent); if (!mm || A.busy) return;
    var i = +mm[1] - 1, open = !!$(".opt:not([disabled])", PH);
    if (open && i !== lastOpen) { lastOpen = i; startPred(C.predictions[i], true); } else if (!open) lastOpen = -1;
  }).observe(PH, { childList:true });
  function setV(n){ S.v = Math.round(n * 100) / 100; var k = Math.round(S.v * 100); S.ex = k === 0 || Math.abs(k) === 50 || Math.abs(k) === 100; visit(); }
  function runPred(p, fin){
    A.busy = true;
    var end = function(){ A.busy = false; done(); fin(); };
    if (p.id === "p1") {
      if (narrow()) S.view = "graph";
      var say = function(){ if (narrow()) MV.banner("", "□ = " + vT(S.v, S.ex) + ": " + nSol(solve("sin", "1", S.v).sols.length) + "."); };
      chain([tw(3570, function(t){ setV(0.5 + 0.5 * t); paint(); say(); }), now(function(){ setV(1); paint(); MV.banner("", MV.plain(p.banner1)); }), wt(1200),
        tw(1430, function(t){ setV(1 + 0.2 * t); paint(); say(); }), now(function(){ MV.banner("", MV.plain(p.banner2)); }), wt(400)], end);
    } else if (p.id === "p2") {
      A.cover = "p2r"; A.p2 = { drop:0, flash:0, sweep:0, arc:0, dot2:false }; if (narrow()) S.view = "circle"; paint();
      chain([tw(800, function(t){ A.p2.drop = t; CI.render(); }), tw(700, function(t){ A.p2.flash = t; CI.render(); }), tw(1000, function(t){ A.p2.sweep = t; CI.render(); }),
        tw(1200, function(t){ A.p2.arc = t; CI.render(); }), now(function(){ A.p2.dot2 = true; A.p2.flash = 0; A.cover = null; visit(); if (narrow()) S.view = "graph"; paint(); }), wt(500)], end);
    } else if (p.id === "p3") {
      A.p3 = { br:0, pop:null }; A.K = 1; paint();
      chain([tw(500, function(t){ A.p3.br = t; G.render(); }), tw(1500, function(t){ A.K = 1 + t; G.render(); }), now(function(){ A.K = null; S.k = "2"; clearProf(); visit(); A.p3.br = 1; A.p3.pop = 0; paint(); }),
        wt(300), now(function(){ A.p3.pop = 1; G.render(); }), wt(300), now(function(){ A.p3.pop = 2; G.render(); }), wt(300), now(function(){ A.p3.pop = 3; G.render(); }), wt(300), now(function(){ A.p3.pop = 4; G.render(); ST.render(); }),
        now(function(){ A.p3.lap = 0; if (narrow()) { S.view = "circle"; paintCtl(); } }), tw(2000, function(t){ A.p3.lap = 4 * PI * t; CI.render(); }), now(function(){ A.p3 = null; if (narrow()) S.view = "graph"; })], end);
    } else if (p.id === "p4") { A.cover = null; A.busy = false; runSplit(true, function(){ done(); fin(); }); }
    else end();
  }

  // ----- challenges -----
  function uncounted(id, msg){ Promise.resolve().then(function(){ var st = MV.S.chal[id]; if (st && st.tries > 0) { st.tries--; MV.save(); } }); return { ok:false, msg:msg }; }
  function isSet(o, want){ return o.sols.length === want.length && o.sols.every(function(s, i){ return s.ex && near(s.x, want[i] * PI, 1e-9); }); }
  function decs(o){ return andList(o.sols.map(function(s){ return dec(s.x); })) || "none"; }
  function check(id, opt){
    var M = CH[id].msgs;
    if (id === "tc1") {
      if (S.mode !== "one") return opt.live ? { ok:false } : uncounted(id, M.mode);
      var o = solve(S.f, S.k, S.v), f = S.f, v = S.v, n100 = Math.round(v * 100);
      if (isSet(o, [0.75, 1.25])) return { ok:true };
      if (opt.live) return { ok:false };
      if (S.k === "1") {
        if (f === "cos" && near(v, R2)) return { ok:false, msg:M.cosR2 };
        if (f === "sin" && near(v, -R2)) return { ok:false, msg:M.sinNR2 };
        if (f === "sin" && near(v, R2)) return { ok:false, msg:M.sinR2 };
        if (f === "cos" && near(v, -0.5)) return { ok:false, msg:M.cosNH };
        if (f === "tan" && near(v, -1)) return { ok:false, msg:M.tanN1 };
        if (f === "cos" && !S.ex && (n100 === -71 || n100 === -70)) return { ok:false, msg:fill(M.close, { values:decs(o) }) };
      }
      if (S.k === "h" && f === "sin" && !S.ex && (n100 === 92 || n100 === 93)) return { ok:false, msg:fill(M.half, { values:decs(o) }) };
      if (S.k !== "1") return { ok:false, msg:fill(M.kNot1, { k:m(kxS(S.k)), n:nSol(o.sols.length) }) };
      return { ok:false, msg:fill(M.other, { list:solList(o) }) };
    }
    if (id === "tc2") {
      if (S.mode !== "two" || S.bank !== "B7" || S.bf !== "sin") return opt.live ? { ok:false } : uncounted(id, M.mode);
      var T = two(), xs = T.all.map(function(a){ return a.s.x; }), p = S.p.v, q = S.q.v;
      if (xs.length === 3 && xs.every(function(x){ return x >= PI - 1e-9 && x <= TAU + 1e-9; })) return { ok:true };
      if (opt.live) return { ok:false };
      var has = function(a, b){ return (near(p, a) && b(q)) || (near(q, a) && b(p)); }, mid = function(x){ return x > -1 + 1e-9 && x < -1e-9; };
      if (has(-1, function(x){ return near(x, 0); })) return { ok:false, msg:M.m10 };
      if (mid(p) && mid(q) && !near(p, q)) return { ok:false, msg:M.both };
      if (has(1, mid)) return { ok:false, msg:M.p1 };
      if (has(-1, function(x){ return x > 1e-9 && x < 1 - 1e-9; })) return { ok:false, msg:M.top };
      if (has(-1, function(x){ return x < -1 - 1e-9 || x > 1 + 1e-9; })) return { ok:false, msg:M.miss };
      if (near(p, q)) return { ok:false, msg:M.same };
      return { ok:false, msg:fill(M.other, { n:nSol(xs.length), list:T.all.length ? andList(T.all.map(function(a){ return m(xS(a.s)); })) : "none" }) };
    }
    if (id === "tc3") {
      if (opt.live && hidden()) return { ok:false };
      if (S.mode !== "one") return opt.live ? { ok:false } : uncounted(id, M.mode);
      var o3 = solve(S.f, S.k, S.v), ok = isSet(o3, [1 / 6, 5 / 6, 1.5]);
      if (!opt.live && lock.on) { lock.shown = true; setTimeout(function(){ if (ok) lock.on = false; paint(); }, 0); }
      if (ok) return { ok:true };
      if (opt.live) return { ok:false };
      var is = function(f, k, v){ return S.f === f && S.k === k && near(S.v, v); };
      if (is("sin", "3", -1)) return { ok:false, msg:M.s3n1 };
      if (is("sin", "1", 0.5)) return { ok:false, msg:M.s1h };
      if (is("sin", "3", 0.5)) return { ok:false, msg:M.s3h };
      if (is("cos", "3", 0)) return { ok:false, msg:M.c30 };
      if (is("sin", "2", 1)) return { ok:false, msg:M.s21 };
      return { ok:false, msg:fill(M.other, { list:solList(o3) }) };
    }
    return { ok:false };
  }
  if (!S.prof || !S.prof.length) visit();
  paint();
  window.addEventListener("resize", function(){ UP.render(); });
  return { predict:{ start:function(p){ startPred(p, false); }, run:runPred }, challenge:check };
}

// ---------- Part 3: lost solutions (N8 taps on the graph twin) and three builds (N15 move chooser) ----------
var DF = { A:function(x){ return 2 * Math.sin(x) * Math.cos(x) - R3 * Math.cos(x); }, b1:function(x){ var c = Math.cos(x); return 2 * c * c - 3 * c + 1; },
  b2:function(x){ var s = Math.sin(x); return 2 * s * s - 3 * Math.cos(x); }, b3:function(x){ return Math.cos(2 * x) + 3 * Math.sin(x) - 2; } };
var DY = { A:[-3, 3], b1:[-1.5, 6.5], b2:[-3.8, 3.8], b3:[-6.5, 1.5] };
function valTxt(v){ if (near(v * 4, Math.round(v * 4), 1e-9)) return "= " + (fracLab(v) || dec(v)).replace(/-/g, MINUS); return "≈ " + dec(v); }
function stripBtns(sel, key, o){
  o = o || {};
  return '<div class="ts-sb" role="group" aria-label="Angles from 0 to 2π">' + STRIP.map(function(t){
    var on = sel.indexOf(t) >= 0, bad = o.bad && o.bad.indexOf(t) >= 0, lit = o.lit && o.lit.indexOf(t) >= 0;
    return '<button type="button" class="ts-a' + (on ? " on" : "") + (bad ? " bad" : "") + (lit ? " lit" : "") + '" aria-pressed="' + on + '" data-t="' + t + '" data-k="' + key + t + '" aria-label="' + twT(t) + (bad ? ", doesn’t fit" : "") + '"' + (o.off ? " disabled" : "") + ">" + m(twS(t, true)) + "</button>";
  }).join("") + "</div>";
}
function part3(host, api){
  var C = api.content, S = api.S, SA = C.stageA, B = C.builds, MS = C.msgs;
  S.st = S.st || "A"; S.A = S.A || { found:[], kp:6, done:false }; S.b = S.b || {};
  host.innerHTML = '<div class="ts-p3"><div class="chips ts-p3s" role="group" aria-label="Stage"></div><div class="ts-p3g"><div class="ts-p3l"><p class="eq-cap ts-p3cap" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot ts-tw" role="img" tabindex="0"></canvas></div><p class="tiny muted ts-p3n"></p><div class="ts-p3c"></div></div><div class="ts-p3r"></div></div></div>';
  var E = { st:$(".ts-p3s", host), cap:$(".ts-p3cap", host), note:$(".ts-p3n", host), chips:$(".ts-p3c", host), r:$(".ts-p3r", host) }, cv = $(".ts-tw", host);
  var P = new MV.Plot(cv, { xmin:-PI / 6, xmax:13 * PI / 6, ymin:-4, ymax:4 }), msg = null;
  function bs(id){ return S.b[id] || (S.b[id] = { pred:null, step:0, tries:0, hint:0, fac:0, sel:[[], []], fd:[false, false], done:false, first:null, probe:null }); }
  function cur(){ return S.st === "A" ? null : B.filter(function(b){ return b.id === S.st; })[0]; }
  P.render = function(){
    var b = cur(), key = b ? b.id : "A", D = DF[key], y = DY[key], lit = [], fixed = [];
    if (!b) { fixed = [4, 8]; lit = S.A.found.slice(); }
    else { var x = bs(b.id); lit = x.sel[0].concat(x.sel[1]); }
    var probe = b ? bs(b.id).probe : null, kp = !b && !S.A.done && document.activeElement === cv && fv2(cv) ? S.A.kp : null;
    P.draw({ view:{ xmin:-PI / 6, xmax:13 * PI / 6, ymin:y[0], ymax:y[1] }, xTicks:{ step:PI / 2, pi:true, den:2 }, yTicks:{ step:1 },
      describe:(b ? MV.plain(b.twin) : SA.twin) + (lit.length ? " Found so far: " + lit.map(twT).join(", ") + "." : ""),
      after:function(ctx){
        var W = P.W, H = P.H, x0 = P.X(0), x1 = P.X(TAU), oy = P.Y(0), ink = css("--ink");
        ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = css("--sheet"); ctx.fillRect(0, 0, x0, H); ctx.fillRect(x1, 0, W - x1, H); ctx.restore();
        line(ctx, x0, 0, x0, H, ink, 1.5); line(ctx, x1, 0, x1, H, ink, 1.5);
        ctx.save(); ctx.font = "600 22px " + (P.fontM || "serif"); ctx.fillStyle = ink; ctx.textBaseline = "top"; ctx.textAlign = "left"; ctx.fillText("[", x0 + 3, 2); ctx.textAlign = "right"; ctx.fillText("]", x1 - 3, 2); ctx.restore();
        P.curve({ f:D, color:ink, width:3.4 });
        lab(ctx, P, "D(x) = 0", x1 - 6, oy - 12, { size:12, align:"right", color:css("--ink-2") });
        fixed.forEach(function(t){ var X = P.X(t * PI / 12); disc(ctx, X, oy, 9, css("--green")); disc(ctx, X, oy, 5, ink); lab(ctx, P, twS(t, true), X, oy + 24, { size:12, align:"center" }); });
        lit.forEach(function(t){ var X = P.X(t * PI / 12); ptDot(ctx, X, oy); lab(ctx, P, twS(t, true), X, oy + (fixed.length ? -24 : 24), { size:12, align:"center" }); });
        if (probe) { var px = probe.t * PI / 12, X = P.X(px), Y = P.Y(clamp(D(px), y[0], y[1])); line(ctx, X, oy, X, Y, css("--red"), 1.5, [3, 3]); disc(ctx, X, Y, 7, css("--sheet"), css("--red"), 2.5); }
        if (kp != null) { var KX = P.X(kp * PI / 12); line(ctx, KX, 0, KX, H, css("--pen"), 2, [4, 4]); lab(ctx, P, "probe: " + twS(kp, true), KX + 6, 16, { size:12 }); }
      } });
  };
  function stageChips(){
    var L = [["A", SA.title, S.A.done]].concat(B.map(function(b, i){ return [b.id, "Build " + (i + 1), bs(b.id).done]; }));
    MV.keepFocus(E.st, function(){ E.st.innerHTML = L.map(function(x){ return '<button type="button" class="chip' + (S.st === x[0] ? " on" : "") + '" aria-pressed="' + (S.st === x[0]) + '" data-st="' + x[0] + '" data-k="p3s' + x[0] + '">' + (x[2] ? "✓ " : "") + x[1] + "</button>"; }).join(""); });
  }
  function paintA(){
    var hl = function(s){ return '<span class="ts-hl">' + m(s) + "</span>"; };
    E.cap.innerHTML = S.A.done ? m("2 sin x") + " " + hl("cos x") + " " + m("= √3") + " " + hl("cos x") : SA.eq;
    E.note.innerHTML = m("D(x)") + " = left side − right side. Tap the graph where it crosses the axis, or focus it and use the arrow keys and Enter.";
    E.chips.innerHTML = '<p class="tiny"><strong>Shortcut:</strong> ' + [4, 8].map(function(t){ return '<span class="chip-in">' + m(twS(t)) + "</span>"; }).join(" ") + (S.A.found.length ? " <strong>Found:</strong> " + S.A.found.map(function(t){ return '<span class="chip-in ts-new">' + m(twS(t)) + "</span>"; }).join(" ") : "") + "</p>";
    E.r.innerHTML = "<h3>" + SA.title + "</h3><p><strong>Shortcut:</strong> " + SA.shortcut + "</p><p>" + SA.task + '</p><div class="ts-p3fb" aria-live="polite">' + (S.A.done ? fbBox(true, "<strong>✓ Both found.</strong> " + SA.success) : msg ? fbBox(msg.good, msg.html) : "") + "</div>";
  }
  function tapA(x){
    if (S.A.done) return;
    var hits = [4, 6, 8, 18].filter(function(t){ return Math.abs(t * PI / 12 - x) <= 0.1; });
    if (!hits.length) msg = { good:false, html:"<strong>✗ Not quite.</strong> " + SA.away };
    else if (hits[0] === 4 || hits[0] === 8) msg = { good:false, html:SA.already };
    else { if (S.A.found.indexOf(hits[0]) < 0) S.A.found.push(hits[0]); S.A.found.sort(function(a, b){ return a - b; }); if (S.A.found.length === 2) { S.A.done = true; msg = null; } else msg = { good:true, html:"<strong>✓</strong> " + SA.one }; }
    api.save(); paint(); MV.focusFb(E.r);
  }
  cv.addEventListener("pointerdown", function(e){ if (S.st !== "A") return; var r = cv.getBoundingClientRect(); tapA(P.xOf(e.clientX - r.left)); });
  cv.addEventListener("keydown", function(e){
    if (S.st !== "A" || S.A.done) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); S.A.kp = clamp(S.A.kp + (e.key === "ArrowRight" ? 1 : -1), -2, 26); P.render(); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tapA(S.A.kp * PI / 12); cv.focus(); }
  });
  cv.addEventListener("focus", function(){ P.render(); }); cv.addEventListener("blur", function(){ P.render(); });
  function paintB(b){
    var x = bs(b.id), h = "<h3>Build " + (B.indexOf(b) + 1) + ": " + b.eq + "</h3>", hist = [b.eq];
    for (var i = 0; i < x.step; i++) hist.push(b.steps[i].after);
    E.cap.innerHTML = hist[hist.length - 1];
    E.note.innerHTML = m("D(x)") + " = left side − right side. Every solution is an " + m("x") + "-intercept in " + m("0 ≤ x ≤ 2π") + ".";
    E.chips.innerHTML = "";
    if (x.pred == null) {
      h += "<p><strong>" + C.predictQ + '</strong></p><div class="chips" role="group" aria-label="Predicted count">' + [0, 1, 2, 3, 4, 5, 6].map(function(n){ return '<button type="button" class="chip" data-pred="' + n + '" data-k="pr' + n + '">' + n + "</button>"; }).join("") + "</div>";
      E.r.innerHTML = h; return;
    }
    h += '<ol class="ts-hist">' + hist.map(function(l, i){ return "<li" + (i === hist.length - 1 ? ' class="cur"' : "") + ">" + l + "</li>"; }).join("") + "</ol>";
    if (x.step < b.steps.length) {
      var s = b.steps[x.step];
      h += '<p class="ts-q"><strong>Step ' + (x.step + 1) + ".</strong> " + s.q + '</p><div class="ts-mv" role="group" aria-label="Moves">' + s.options.map(function(o, i){ return '<button type="button" class="opt" data-mo="' + i + '" data-k="mv' + x.step + i + '"><span>' + o.t + "</span></button>"; }).join("") + "</div>";
    } else {
      h += '<div class="ts-facs">' + b.factors.map(function(F, i){
        var L = circ(i) + " " + m(F.f + " x = " + vS(F.v, true)), st = x.fd[i] ? (F.none ? ": no solutions (impossible value) ✓" : ": " + x.sel[i].map(function(t){ return m(twS(t)); }).join(", ") + " ✓") : i === x.fac ? " (solve this line)" : "";
        return '<p class="ts-fl' + (i === x.fac && !x.done ? " cur" : "") + '">' + L + st + "</p>";
      }).join("") + "</div>";
      if (!x.done) {
        var F = b.factors[x.fac];
        h += "<p>Tap every solution of " + circ(x.fac) + " " + m(F.f + " x = " + vS(F.v, true)) + " on the strip.</p>" + stripBtns(x.sel[x.fac], "f" + b.id + x.fac, { lit:x.sel[x.fac] }) +
          '<div class="q-actions"><button type="button" class="btn sm" data-none="1" data-k="none">No solutions: impossible value</button><button type="button" class="btn primary sm" data-fdone="1" data-k="fdone">Done with line ' + circ(x.fac) + "</button></div>";
      } else {
        var n = 0; b.factors.forEach(function(F){ n += F.none ? 0 : F.sol.length; });
        h += fbBox(true, "<strong>✓ Build complete.</strong> " + b.result + " " + fill(MS.predicted, { p:x.pred, n:n }) + (x.first ? " First try." : ' <span class="muted">(not first try)</span>'));
      }
    }
    if (!x.done) h += '<div class="q-actions">' + MV.hintBtn("h" + b.id, x.hint) + "</div>" + MV.hintsHTML(b.hints, x.hint);
    h += '<div class="ts-p3fb" aria-live="polite">' + (msg ? fbBox(msg.good, msg.html) : "") + "</div>";
    MV.keepFocus(E.r, function(){ E.r.innerHTML = h; });
  }
  function paint(){ stageChips(); if (S.st === "A") paintA(); else paintB(cur()); P.render(); }
  host.addEventListener("click", function(e){
    var t = e.target.closest("button"); if (!t || t.disabled) return;
    if (t.dataset.st) { S.st = t.dataset.st; msg = null; api.save(); paint(); return; }
    var b = cur(); if (!b) return;
    var x = bs(b.id);
    if (t.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); }
    else if (t.dataset.pred != null) { x.pred = +t.dataset.pred; msg = null; }
    else if (t.dataset.mo != null) {
      var s = b.steps[x.step], o = s.options[+t.dataset.mo];
      if (MV.ok(o)) { x.step++; msg = { good:true, html:"<strong>✓ Correct.</strong> " + o.why }; }
      else { x.tries++; msg = { good:false, html:"<strong>✗ Not quite.</strong> " + o.why }; }
    } else if (t.dataset.t != null || t.dataset.none || t.dataset.fdone) {
      var F = b.factors[x.fac], sel = x.sel[x.fac]; x.probe = null;
      if (t.dataset.t != null) {
        var tt = +t.dataset.t;
        if (F.none) { x.tries++; msg = { good:false, html:"<strong>✗ Not quite.</strong> " + F.tapFb }; }
        else if (F.sol.indexOf(tt) >= 0) { if (sel.indexOf(tt) < 0) sel.push(tt); sel.sort(function(p, q){ return p - q; }); msg = { good:true, html:"<strong>✓</strong> " + m(F.f + " " + twS(tt) + " = " + vS(F.v, true)) + ", so " + m(twS(tt)) + " is a solution: it lights up on the graph." }; }
        else {
          x.tries++; var other = b.factors.some(function(G){ return !G.none && G.sol.indexOf(tt) >= 0; }), Dv = DF[b.id](tt * PI / 12);
          if (other) msg = { good:false, html:"<strong>✗ Not this line.</strong> " + m("D(" + twS(tt) + ") = 0") + ", so " + m(twS(tt)) + " is a solution, but it belongs to the other line. Tap the solutions of line " + circ(x.fac) + " here." };
          else { x.probe = { t:tt }; msg = { good:false, html:"<strong>✗ Not quite.</strong> " + fill(MS.probe, { x:m(twS(tt)), val:valTxt(Dv) }) }; }
        }
        if (!F.none && sel.length === F.sol.length) { x.fd[x.fac] = true; x.fac++; msg = { good:true, html:"<strong>✓ Line " + circ(x.fac - 1) + " done.</strong>" }; }
      } else if (t.dataset.none) {
        if (F.none) { x.fd[x.fac] = true; x.fac++; msg = { good:true, html:"<strong>✓ Correct.</strong> " + m(F.f + " x = " + vS(F.v, true)) + " is impossible, so this line adds no solutions." }; }
        else { x.tries++; msg = { good:false, html:"<strong>✗ Not quite.</strong> " + MS.noneWrong }; }
      } else {
        x.tries++;
        msg = { good:false, html:"<strong>✗ Not yet.</strong> " + (F.none ? F.tapFb : F.only && sel.join() === F.only.set.join() ? F.only.fb : MS.missing) };
      }
      if (x.fac >= b.factors.length && !x.done) { x.done = true; x.first = x.tries === 0 && x.hint < 3; msg = null; }
    } else return;
    api.save(); paint(); if (msg || x.done) MV.focusFb(E.r);
  });
  paint();
  MV.ACTS.builds = { a:{ id:"builds" },
    stats:function(){ var f = 0, d = 0; B.forEach(function(b){ var x = S.b[b.id]; if (x && x.done) d++; if (x && x.first) f++; }); return { first:f, total:B.length, done:d, line:"Quadratic builds (first try): " + f + "/" + B.length + (d < B.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; B.forEach(function(b){ var x = S.b[b.id]; if (x && (x.tries > 0 || x.hint >= 3)) g = g.concat(MV.goalIdx(b.goal)); }); return g; } };
  return {};
}

// ---------- Practice 1: find every solution (N7 select-all on the G14 strip) ----------
function sameSet(a, b){ var x = a.slice().sort(function(p, q){ return p - q; }), y = b.slice().sort(function(p, q){ return p - q; }); return x.join() === y.join(); }
function every(host, api, a){
  var S = api.S; S.i = S.i || 0; S.it = S.it || {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted ev-n"></span><span class="dots ev-d" aria-hidden="true"></span></div><p class="ts-feq ev-q"></p><div class="ev-s"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm ev-c" data-k="evc">Check</button><span class="ev-h"></span></div><div class="ev-hs"></div><div class="ev-f" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm ev-p" data-k="evp">Previous</button><button type="button" class="btn ghost sm ev-x" data-k="evx">Next equation</button></div>';
  function ist(it){ return S.it[it.id] || (S.it[it.id] = { sel:[], tries:0, hint:0, solved:false, first:null, msg:null, bad:[] }); }
  function paint(){
    var it = a.items[S.i], x = ist(it);
    $(".ev-n", host).textContent = "Equation " + (S.i + 1) + " of " + a.items.length;
    $(".ev-d", host).innerHTML = a.items.map(function(q, i){ var y = S.it[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $(".ev-q", host).innerHTML = "Solve " + it.eq + " for " + m("0 ≤ x ≤ 2π") + ".";
    MV.keepFocus($(".ev-s", host), function(){ $(".ev-s", host).innerHTML = stripBtns(x.sel, "ev" + it.id, { bad:x.bad, off:x.solved }); });
    $(".ev-c", host).disabled = x.solved;
    MV.keepFocus($(".ev-h", host), function(){ $(".ev-h", host).innerHTML = x.solved ? "" : MV.hintBtn("evh" + it.id, x.hint); });
    $(".ev-hs", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    $(".ev-f", host).innerHTML = x.solved ? fbBox(true, "<strong>✓ Correct:</strong> " + x.sel.map(function(t){ return m(twS(t)); }).join(", ") + "." + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : x.msg ? fbBox(false, "<strong>✗ Not quite.</strong> " + x.msg) : "";
    $(".ev-p", host).disabled = S.i === 0; $(".ev-x", host).disabled = S.i === a.items.length - 1;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = ist(it);
    if (b.classList.contains("ev-p") || b.classList.contains("ev-x")) { S.i += b.classList.contains("ev-p") ? -1 : 1; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.t != null) { var t = +b.dataset.t, k = x.sel.indexOf(t); if (k < 0) x.sel.push(t); else x.sel.splice(k, 1); x.sel.sort(function(p, q){ return p - q; }); x.bad = []; api.save(); paint(); return; }
    if (b.classList.contains("ev-c")) {
      if (!x.sel.length) { x.msg = "Tap at least one angle first."; paint(); return; }
      var ans = MV.ans(it);
      if (sameSet(x.sel, ans)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.msg = null; x.bad = []; }
      else {
        x.tries++;
        var w = (it.wrong || []).filter(function(r){ return r.set ? sameSet(r.set, x.sel) : r.extra ? x.sel.some(function(t){ return ans.indexOf(t) < 0; }) : false; })[0];
        if (w) { x.msg = w.fb + TRY; x.bad = []; }
        else { x.bad = x.sel.filter(function(t){ return ans.indexOf(t) < 0; }); x.msg = a.fallback + " " + fill(a.countMsg, { have:x.sel.filter(function(t){ return ans.indexOf(t) >= 0; }).length, n:ans.length }) + TRY; }
      }
      api.save(); paint(); MV.focusFb(host);
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.it[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.it[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Practice 3: beyond the special angles (@component N4 entryBoxes — decimal, whole-number, fraction and π-multiple boxes plus the strip) ----------
function beyond(host, api, a){
  var S = api.S; S.i = S.i || 0; S.it = S.it || {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted by-n"></span><span class="dots by-d" aria-hidden="true"></span></div><div class="by-q"></div><div class="by-in"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm by-c" data-k="byc">Check</button><span class="by-h"></span></div><div class="by-hs"></div><div class="by-f" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm by-p" data-k="byp">Previous</button><button type="button" class="btn ghost sm by-x" data-k="byx">Next problem</button></div>';
  function ist(it){ return S.it[it.id] || (S.it[it.id] = { v:{}, sel:[], tries:0, hint:0, solved:false, first:null, msg:null, bad:[] }); }
  function tolOf(k){ return k === "dec" ? 0.0100001 : 1e-9; }
  function read(it, x){
    return it.boxes.map(function(bx, i){
      if (bx.k === "pi") { var n = MV.parseNum(x.v[i + "n"]), d = MV.parseNum(x.v[i + "d"]); return n && d && n.length === 1 && d.length === 1 && d[0] ? n[0] / d[0] : NaN; }
      var r = MV.parseNum(x.v[i]); return r && r.length === 1 ? r[0] : NaN;
    });
  }
  function filled(it, x, i){ var bx = it.boxes[i]; return bx.k === "pi" ? !!((x.v[i + "n"] || "").trim() && (x.v[i + "d"] || "").trim()) : !!(x.v[i] || "").trim(); }
  function inputs(it, x){
    var off = x.solved ? " disabled" : "";
    var h = '<div class="inrow ts-in">' + it.boxes.map(function(bx, i){
      var id = "by-" + it.id + "-" + i, bad = x.bad.indexOf(i) >= 0 ? " bad" : "";
      if (bx.k === "pi") return '<div class="ts-pib"><span class="ts-blab">' + bx.lab + '</span><span class="ts-pir"><input class="numin short' + bad + '" id="' + id + 'n" data-b="' + i + 'n" type="number" step="1" aria-label="' + MV.esc(MV.plain(bx.lab)) + ', numerator" value="' + MV.esc(x.v[i + "n"] || "") + '"' + off + '><span>/</span><input class="numin short' + bad + '" id="' + id + 'd" data-b="' + i + 'd" type="number" step="1" min="1" aria-label="' + MV.esc(MV.plain(bx.lab)) + ', denominator" value="' + MV.esc(x.v[i + "d"] || "") + '"' + off + '><span class="m">π</span></span></div>';
      var ty = bx.k === "frac" ? 'type="text" autocomplete="off"' : 'type="number" step="' + (bx.k === "int" ? "1" : "any") + '"';
      return '<label for="' + id + '"><span>' + bx.lab + '</span><input class="numin short' + bad + '" id="' + id + '" data-b="' + i + '" ' + ty + ' value="' + MV.esc(x.v[i] || "") + '"' + off + "></label>";
    }).join("") + "</div>";
    if (it.strip) h += "<p class=\"tiny\">Tap every solution:</p>" + stripBtns(x.sel, "by" + it.id, { off:x.solved });
    return h;
  }
  function paint(load){
    var it = a.items[S.i], x = ist(it);
    $(".by-n", host).textContent = "Problem " + (S.i + 1) + " of " + a.items.length + ": " + MV.plain(it.label);
    $(".by-d", host).innerHTML = a.items.map(function(q, i){ var y = S.it[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $(".by-q", host).innerHTML = '<p class="pred-q">' + it.prompt + "</p>" + MV.usesHTML(it.use);
    if (load) $(".by-in", host).innerHTML = inputs(it, x);
    else MV.keepFocus($(".by-in", host), function(){ var sb = $(".ts-sb", host); if (sb) sb.outerHTML = stripBtns(x.sel, "by" + it.id, { off:x.solved }); $$("input", host).forEach(function(inp){ var i = parseInt(inp.dataset.b, 10); inp.classList.toggle("bad", x.bad.indexOf(i) >= 0); inp.disabled = x.solved; }); });
    $(".by-c", host).disabled = x.solved;
    MV.keepFocus($(".by-h", host), function(){ $(".by-h", host).innerHTML = x.solved ? "" : MV.hintBtn("byh" + it.id, x.hint); });
    $(".by-hs", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    $(".by-f", host).innerHTML = x.solved ? fbBox(true, "<strong>✓ Correct.</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : x.msg ? fbBox(false, x.msg) : "";
    $(".by-p", host).disabled = S.i === 0; $(".by-x", host).disabled = S.i === a.items.length - 1;
  }
  function judge(it, x){
    var vals = read(it, x), ans = MV.ans(it), entered = [], bad = [];
    it.boxes.forEach(function(bx, i){ if (filled(it, x, i)) entered.push({ i:i, v:vals[i], k:bx.k }); });
    var hasV = function(v){ return entered.some(function(e){ return Math.abs(e.v - v) <= tolOf(e.k); }); };
    var boxV = function(i, v){ return filled(it, x, i) && Math.abs(vals[i] - v) <= tolOf(it.boxes[i].k); };
    var ok;
    if (it.ordered) {
      var nums = Array.isArray(ans) ? ans : ans.nums;
      it.boxes.forEach(function(bx, i){ if (!boxV(i, nums[i])) bad.push(i); });
      ok = !bad.length && (!it.strip || sameSet(x.sel, ans.set));
    } else {
      var A2 = ans.slice().sort(function(p, q){ return p - q; }), E2 = entered.map(function(e){ return e.v; }).sort(function(p, q){ return p - q; });
      ok = A2.length === E2.length && A2.every(function(v, i){ return Math.abs(v - E2[i]) <= tolOf(it.boxes[0].k); });
      entered.forEach(function(e){ if (!ans.some(function(v){ return Math.abs(v - e.v) <= tolOf(e.k); })) bad.push(e.i); });
    }
    if (ok) return { ok:true };
    var w = (it.wrong || []).filter(function(r){
      if (r.has) return r.has.every(hasV) && !(r.lacks || []).some(hasV);
      if (r.all) return r.all.every(function(p){ return boxV(p[0], p[1]); });
      if (r.box != null) return boxV(r.box, r.val);
      if (r.neg) return x.sel.some(function(t){ return t > 12 && t < 24; });
      if (r.set) return sameSet(r.set, x.sel);
      return false;
    })[0];
    return { ok:false, msg:"<strong>✗ Not quite.</strong> " + (w ? w.fb : a.general) + TRY, bad:w ? [] : bad };
  }
  host.addEventListener("input", function(e){ var i = e.target.dataset.b; if (i == null) return; var it = a.items[S.i], x = ist(it); x.v[i] = e.target.value; api.save(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = ist(it);
    if (b.classList.contains("by-p") || b.classList.contains("by-x")) { S.i += b.classList.contains("by-p") ? -1 : 1; api.save(); paint(true); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.t != null) { var t = +b.dataset.t, k = x.sel.indexOf(t); if (k < 0) x.sel.push(t); else x.sel.splice(k, 1); x.sel.sort(function(p, q){ return p - q; }); api.save(); paint(); return; }
    if (b.classList.contains("by-c")) {
      var need = it.ordered ? it.boxes.every(function(bx, i){ return filled(it, x, i); }) : it.boxes.some(function(bx, i){ return filled(it, x, i); });
      var bogus = read(it, x).some(function(v, i){ return filled(it, x, i) && isNaN(v); });
      if (!need || bogus || (it.strip && !x.sel.length)) { x.msg = bogus ? "One of your entries isn’t a number. Use digits, a decimal point, − or a fraction such as 9/8." : it.ordered ? "Fill in every box first." + (it.strip ? " Then tap the solutions on the strip." : "") : "Enter at least one value first."; paint(); return; }
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.msg = null; x.bad = []; }
      else { x.tries++; x.msg = r.msg; x.bad = r.bad; }
      api.save(); paint(); MV.focusFb(host);
    }
  });
  paint(true);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.it[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.it[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: design a four-solution equation (Two lines preview with f = cos) ----------
function qRoots(a, b, c){
  if (a === 0) return b === 0 ? (c === 0 ? null : []) : [-c / b];
  var d = b * b - 4 * a * c; if (d < 0) return []; if (d === 0) return [-b / (2 * a)];
  var s = Math.sqrt(d); return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort(function(p, q){ return p - q; });
}
function analyse(d){
  var rs = qRoots(d.a, d.b, d.c);
  if (!rs) return { inf:true, roots:[], n:Infinity, special:false, os:[] };
  var os = rs.map(function(u){ return solve("cos", "1", u); }), n = 0; os.forEach(function(o){ n += o.sols.length; });
  var bad = rs.filter(function(u){ return u >= -1 - 1e-9 && u <= 1 + 1e-9 && !SPEC9.some(function(s){ return near(s, u); }); });
  return { roots:rs, os:os, n:n, special:!bad.length, bad:bad };
}
function eqTxt(a, b, c){
  var t = function(k, v, first){ if (!k) return ""; var s = k < 0 ? (first ? "-" : " - ") : first ? "" : " + ", A = Math.abs(k); return s + (A === 1 && v ? "" : A + (v ? " " : "")) + v; };
  var s = t(a, "cos^2x", true); s += t(b, "cos x", !s); s += t(c, "", !s);
  return (s || "0") + " = 0";
}
var task = (function(){
  var api, E = {}, G, CI, UP, ST;
  function read(){
    var s = api ? api.S : {}, raw = ["a", "b", "c"].map(function(k){ return s[k] == null ? (k === "a" ? "1" : "0") : String(s[k]); });
    var n = raw.map(function(v){ var p = MV.parseNum(v); return p && p.length === 1 ? p[0] : NaN; });
    return { raw:raw, a:n[0], b:n[1], c:n[2], ok:n.every(function(v){ return Number.isInteger(v) && v >= -6 && v <= 6; }) };
  }
  function model(){
    var d = read(); if (!d.ok) return null;
    var an = analyse(d), all = [];
    an.os.forEach(function(o, li){ o.sols.forEach(function(s){ if (!all.some(function(x){ return near(x.s.x, s.x, 1e-7); })) all.push({ s:s, li:li }); }); });
    all.sort(function(p, q){ return p.s.x - q.s.x; });
    return { d:d, an:an, all:all, L:an.roots.map(function(u){ return { v:u, lab:vS(u, true) }; }) };
  }
  function render(){
    var M = model();
    E.cap.innerHTML = M ? m(eqTxt(M.d.a, M.d.b, M.d.c)) : "Enter whole numbers from −6 to 6.";
    var L = M ? M.L : [];
    G.render = function(){ waveScene(G, { f:"cos", K:1, ymax:1.6, pts:M ? M.all.map(function(x, i){ return { x:x.s.x, y:M.L[x.li].v, tag:circ(i), lab:xL(x.s) }; }) : [], outs:[],
      lines:L.map(function(Ln, li){ var miss = Math.abs(Ln.v) > 1 + 1e-9; return { v:Ln.v, left:true, ext:1, dash:li ? [10, 6] : null, alpha:miss ? 0.4 : 1, tag:[{ t:circ(li) + " " }, { s:"cos x = " + Ln.lab + (miss ? ": " : "") }].concat(miss ? [{ t:"misses the wave" }] : []) }; }),
      desc:M ? "Cosine wave with " + (L.length ? "the lines " + L.map(function(Ln){ return "y = " + Ln.lab.replace(/-/g, MINUS); }).join(" and ") : "no lines (no real roots)") + ". " + (M.an.inf ? "Every x is a solution." : cap1(nSol(M.all.length)) + " on 0 to 2π.") : "Cosine wave." }); };
    CI.render = function(){ circScene(CI, { f:"cos", lines:L.map(function(Ln, li){ return { v:Ln.v, ext:1, dash:li ? [10, 6] : null, alpha:Math.abs(Ln.v) > 1 ? 0.4 : 1 }; }), cuts:M ? cutsOf({ sols:M.all.map(function(x){ return x.s; }) }, M.all.map(function(x, i){ return circ(i); })) : [], arms:[], desc:"Unit circle with the lines x = " + L.map(function(Ln){ return Ln.lab.replace(/-/g, MINUS); }).join(" and ") + "." }); };
    UP.render = function(){ if (!M) return; upScene(UP, { q:[M.d.a, M.d.b, M.d.c], ymax:1.6, rot:narrow(), roots:L, desc:"The quadratic in u = cos x, drawn sideways; roots " + (L.length ? L.map(function(Ln){ return Ln.lab.replace(/-/g, MINUS); }).join(" and ") : "none") + "." }); };
    ST.render = function(){ stripScene(ST, { marker:2 * PI / 3, pts:M ? M.all.map(function(x, i){ return { x:x.s.x, tag:circ(i), lab:xL(x.s) }; }) : [], count:M ? (M.an.inf ? "every x" : cap1(nSol(M.all.length))) : "", desc:"Solution strip with a dashed marker at 2π/3. " + (M ? (M.an.inf ? "Every x is a solution." : cap1(nSol(M.all.length)) + ".") : "") }); };
    G.render(); CI.render(); UP.render(); ST.render();
  }
  return {
    render:function(inp, pv, a){
      api = a; ["a", "b", "c"].forEach(function(k){ if (a.S[k] == null) a.S[k] = k === "a" ? "1" : "0"; });
      inp.innerHTML = '<div class="ts-abc">' + ["a", "b", "c"].map(function(k){ return '<div class="ts-cf"><label for="ts-t' + k + '">' + m(k) + '</label><div class="ts-stp"><button type="button" class="btn sm ts-pm" data-sk="' + k + '" data-d="-1" aria-label="' + k + ' minus 1">−</button><input id="ts-t' + k + '" data-tk="' + k + '" type="number" min="-6" max="6" step="1" value="' + MV.esc(a.S[k]) + '"><button type="button" class="btn sm ts-pm" data-sk="' + k + '" data-d="1" aria-label="' + k + ' plus 1">+</button></div></div>'; }).join("") + "</div>";
      pv.innerHTML = '<p class="eq-cap ts-tcap" aria-live="polite"></p><div class="ts-ex two ts-tv"><div class="ts-gwrap"><div class="ts-upw"><canvas class="ts-up" role="img"></canvas><p class="tiny muted ts-upn">The roots become line heights.</p></div><div class="ts-gw"><canvas class="plot" role="img"></canvas></div></div>' +
        '<div class="ts-tc"><canvas class="plot square" role="img"></canvas></div><div class="ts-stw"><canvas class="ts-st" role="img"></canvas></div></div>';
      E.cap = $(".ts-tcap", pv);
      G = new MV.Plot($(".ts-gw canvas", pv), { xmin:XV.xmin, xmax:XV.xmax, ymin:-1.6, ymax:1.6 }); CI = new MV.Plot($(".ts-tc canvas", pv), { xmin:-1.5, xmax:1.5, ymin:-1.5, ymax:1.5 }, { equal:true });
      UP = new MV.Plot($(".ts-up", pv), { xmin:-1, xmax:1, ymin:-1, ymax:1 }); ST = new MV.Plot($(".ts-st", pv), { xmin:0, xmax:1, ymin:0, ymax:1 });
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); render(); a.update(); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-sk]"); if (!b) return; var k = b.dataset.sk, v = MV.parseNum(a.S[k]); v = clamp(Math.round((v && v.length === 1 ? v[0] : 0) + (+b.dataset.d)), -6, 6); a.S[k] = String(v); $("#ts-t" + k).value = v; a.save(); render(); a.update(); });
      render();
    },
    read:read,
    valid:function(d){ return d.ok ? true : "Enter whole numbers from −6 to 6 for " + m("a") + ", " + m("b") + " and " + m("c") + "."; },
    checks:function(d){
      if (!d.ok) return [false, false, false, false];
      var an = analyse(d);
      return [d.a > 0 && gcd(gcd(d.a, d.b), d.c) === 1, d.a - 2 * d.b + 4 * d.c === 0, an.n === 4, !an.inf && an.special];
    },
    tips:function(d, r){
      var T = MV.C.task.tips, an = analyse(d), out = [];
      if (!r[0]) out.push(T[0]); if (!r[1]) out.push(T[1]);
      if (!r[2]) out.push(fill(T[2], { n:an.inf ? "infinitely many" : an.n }));
      if (!r[3]) out.push(fill(T[3], { root:an.bad && an.bad.length ? m(vS(an.bad[0], true)) : "this value" }));
      return out;
    },
    key:function(d){ return [d.a, d.b, d.c].join(","); },
    label:function(k){ var p = k.split(",").map(Number); return m(eqTxt(p[0], p[1], p[2])); },
    text:function(k){ var p = k.split(",").map(Number); return MV.plain(m(eqTxt(p[0], p[1], p[2]))); }
  };
})();

MV.module({ hero:hero, explore:explore, part3:part3, activities:{ every:every, beyond:beyond }, task:task });
})();
