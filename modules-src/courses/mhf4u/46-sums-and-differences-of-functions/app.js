// MHF4U 46 Sums and Differences of Functions: hero (the wave rides on the line), stacking-bars explorer (Explore),
// superposition mixer and keypad decoder (Part 3), "Combine and work backwards" (Practice 1) and the "Build to spec" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS, PI = Math.PI, RM = MV.reduceMotion;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function LIN(t){ return t; }
function ea(s){ return MV.esc(MV.plain(s)); }
function dark(){ var t = document.documentElement.getAttribute("data-theme"); return t === "dark" || (t !== "light" && !!window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches); }

// ---------- exact rationals [n, d] ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function Q(n, d){ if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return [n / g, d / g]; }
function qadd(a, b){ return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
function qneg(a){ return [-a[0], a[1]]; }
function qmul(a, b){ return Q(a[0] * b[0], a[1] * b[1]); }
function qinv(a){ return a[0] ? Q(a[1], a[0]) : null; }
function qeq(a, b){ return !!a && !!b && a[0] === b[0] && a[1] === b[1]; }
function qtxt(q){ return (q[0] < 0 ? MINUS : "") + Math.abs(q[0]) + (q[1] === 1 ? "" : "/" + q[1]); }
function qOf(x){ var n = Math.round(x * 64); return Math.abs(n / 64 - x) < 1e-12 ? Q(n, 64) : null; }
function p2(k){ return k >= 0 ? [Math.pow(2, k), 1] : [1, Math.pow(2, -k)]; }

// ---------- the function library (Explore, task) ----------
var DIV0 = "division by 0", LOGN = "a logarithm needs a positive input";
var LIB = [
  { id:"x", src:"x", dbl:"2x", say:"x", f:function(x){ return x; }, ex:qOf, dk:"", par:"odd", z:[[0, "0"]], L:"-inf", R:"+inf", rk:[2, 2] },
  { id:"x2", src:"x^2", dbl:"2x^2", say:"x squared", f:function(x){ return x * x; }, ex:function(x){ var q = qOf(x); return q && qmul(q, q); }, dk:"", par:"even", z:[[0, "0"]], L:"+inf", R:"+inf", rk:[3, 3] },
  { id:"e", src:"2^x", dbl:"2 · 2^x", say:"2 to the power x", f:function(x){ return Math.pow(2, x); }, ex:function(x){ return Number.isInteger(x) && Math.abs(x) <= 40 ? p2(x) : null; }, dk:"", par:"neither", z:[], L:0, R:"+inf", rk:[-1, 4] },
  { id:"en", src:"2^{-x}", dbl:"2 · 2^{-x}", say:"2 to the power negative x", f:function(x){ return Math.pow(2, -x); }, ex:function(x){ return Number.isInteger(x) && Math.abs(x) <= 40 ? p2(-x) : null; }, dk:"", par:"neither", z:[], L:"+inf", R:0, rk:[4, -1] },
  { id:"sin", src:"sin x", dbl:"2 sin x", say:"sine x", f:Math.sin, ex:function(x){ return x === 0 ? [0, 1] : null; }, dk:"", par:"odd", z:[[-PI, "-π"], [0, "0"], [PI, "π"]], L:"osc", R:"osc", rk:[0, 0] },
  { id:"cos", src:"cos x", dbl:"2 cos x", say:"cosine x", f:Math.cos, ex:function(x){ return x === 0 ? [1, 1] : null; }, dk:"", par:"even", z:[[-PI / 2, "-π/2"], [PI / 2, "π/2"]], L:"osc", R:"osc", rk:[0, 0] },
  { id:"rx", src:"{1}/{x}", dbl:"{2}/{x}", say:"1 over x", f:function(x){ return 1 / x; }, ex:function(x){ var q = qOf(x); return q && qinv(q); }, dk:"ne0", why:DIV0, par:"odd", z:[], L:0, R:0, rk:[-1, -1] },
  { id:"log", src:"log_{2} x", dbl:"2 log_{2} x", say:"log base 2 of x", f:Math.log2, ex:function(x){ var k = Math.round(Math.log2(x)); return Math.pow(2, k) === x ? [k, 1] : null; }, dk:"gt0", why:LOGN, par:"neither", z:[[1, "1"]], L:"undef", R:"+inf", rk:[null, 1] },
  { id:"rx2", src:"{1}/{x - 2}", dbl:"{2}/{x - 2}", say:"1 over x minus 2", f:function(x){ return 1 / (x - 2); }, ex:function(x){ var q = qOf(x); return q && qinv(qadd(q, [-2, 1])); }, dk:"ne2", why:DIV0, par:"neither", z:[], L:0, R:0, rk:[-1, -1] },
  { id:"c2", src:"2", dbl:"4", say:"2", f:function(){ return 2; }, ex:function(){ return [2, 1]; }, dk:"", par:"even", z:[], L:2, R:2, rk:[0, 0] }
];
var IX = {}; LIB.forEach(function(F, i){ IX[F.id] = i; });
function okAt(F, x){ return F.dk === "ne0" ? x !== 0 : F.dk === "gt0" ? x > 0 : F.dk === "ne2" ? x !== 2 : true; }
function val(i, x){ var F = LIB[i]; if (!okAt(F, x)) return { d:false }; return { d:true, v:F.f(x), q:F.ex(x) }; }
function comb(a, b, s){ if (!a.d || !b.d) return { d:false }; return { d:true, v:a.v + s * b.v, q:(a.q && b.q) ? qadd(a.q, s > 0 ? b.q : qneg(b.q)) : null }; }
function resAt(fi, gi, s, x){ return comb(val(fi, x), val(gi, x), s); }
function fnOf(i){ var F = LIB[i]; return function(x){ return okAt(F, x) ? F.f(x) : NaN; }; }
function rfn(fi, gi, s){ var F = LIB[fi], G = LIB[gi]; return function(x){ return okAt(F, x) && okAt(G, x) ? F.f(x) + s * G.f(x) : NaN; }; }
function dom(fi, gi){ var D = { gt0:false, ne0:false, ne2:false }; [fi, gi].forEach(function(i){ var k = LIB[i].dk; if (k) D[k] = true; }); if (D.gt0) D.ne0 = false; return D; }
function domF(i){ return dom(i, i); }
function inD(D, x){ return !(D.gt0 && x <= 0) && !(D.ne0 && x === 0) && !(D.ne2 && x === 2); }
function lop(D){ return D.gt0 || D.ne2; }
function dsrc(D){ var c = []; if (D.gt0) c.push("x > 0"); if (D.ne0) c.push("x != 0"); if (D.ne2) c.push("x != 2"); return c.length ? "{x ∈ ℝ | " + c.join(", ") + "}" : "{x ∈ ℝ}"; }
function resSrc(fi, gi, s){ return fi === gi ? (s > 0 ? LIB[fi].dbl : "0") : LIB[fi].src + (s > 0 ? " + " : " - ") + LIB[gi].src; }
function vX(o){ return !!(o.q && o.q[1] <= 64); }
function vS(o){ return vX(o) ? qtxt(o.q) : num(o.v, 2); }
function vEq(o){ return vX(o) ? " = " : " ≈ "; }
function br(s){ return s.charAt(0) === MINUS ? "(" + s + ")" : s; }
function isZero(o){ return o.q ? o.q[0] === 0 : Math.abs(o.v) < 1e-12; }

// curve samples with breaks (G1) and dense sampling next to x = 0 and x = 2 (G16)
function samp(fn, a, b, spec){
  var xs = [], i, N = 640;
  for (i = 0; i <= N; i++) xs.push(a + (b - a) * i / N);
  (spec || [0, 2]).forEach(function(s){ if (s > a && s < b) { for (var k = 0; k <= 36; k++) { var d = Math.pow(10, -k / 7); xs.push(s - d, s + d); } xs.push(s); } });
  xs.sort(function(p, q){ return p - q; });
  return xs.map(function(x){ var y = fn(x); return [x, isFinite(y) ? y : NaN]; });
}
var PC = {};
function ptsOf(key, fn){ return PC[key] || (PC[key] = samp(fn, -4.3, 4.3)); }

// ---------- canvas helpers ----------
// @component G11 canvasMath (from MHF4U 37) — canvas text with ^{…} superscripts and _{…} subscripts in the math font
function cmath(ctx, s, x, y, o){
  o = o || {};
  var F = o.size || 14, fm = css("--font-math") || "serif", segs = [], i = 0;
  function push(t, lv){ t.split(/([A-Za-z]+)/).forEach(function(w, k){ if (w) segs.push({ t:w, lv:lv, it:k % 2 === 1 && w.length === 1 }); }); }
  while (i < s.length) {
    var c = s[i];
    if ((c === "^" || c === "_") && i + 1 < s.length) {
      var g, j;
      if (s[i + 1] === "{") { j = s.indexOf("}", i + 2); g = s.slice(i + 2, j); i = j + 1; } else { g = s[i + 1]; i += 2; }
      push(g.replace(/-/g, MINUS), c === "^" ? 1 : -1); continue;
    }
    var k = i; while (k < s.length && s[k] !== "^" && s[k] !== "_") k++;
    push(s.slice(i, k).replace(/-/g, MINUS), 0); i = k;
  }
  function font(sg){ return (sg.it ? "italic " : "") + (o.weight || 600) + " " + (sg.lv ? Math.round(F * 0.72) : F) + "px " + fm; }
  var w = 0; segs.forEach(function(sg){ ctx.font = font(sg); sg.w = ctx.measureText(sg.t).width + (sg.it ? 1 : 0); w += sg.w; });
  var x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  ctx.save(); ctx.textBaseline = "middle"; ctx.textAlign = "left";
  if (o.bg !== false) { ctx.globalAlpha = 0.85; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, y - F * 0.8, w + 6, F * 1.6); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink");
  segs.forEach(function(sg){ ctx.font = font(sg); ctx.fillText(sg.t, x0, y + (sg.lv === 1 ? -F * 0.38 : sg.lv === -1 ? F * 0.3 : 0)); x0 += sg.w; });
  ctx.restore();
  return w;
}
// @component G13 valueBar (stacked, adapted from MHF4U 11 and 28) — signed bar from y0 to y1 at x (offset dx px, w px wide),
// clipped to the window with an arrowhead at the edge and its value printed beside it; optional label on the left or right
function vbar(p, x, dx, y0, y1, col, w, o){
  o = o || {}; if (Math.abs(y1 - y0) < 1e-9 && !o.zero) return;
  var ctx = p.ctx, v = p.v, X = p.X(x) + dx, lo = Math.min(y0, y1), hi = Math.max(y0, y1);
  var Yt = p.Y(Math.min(hi, v.ymax)), Yb = p.Y(Math.max(lo, v.ymin)), up = hi > v.ymax, dn = lo < v.ymin;
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.fillStyle = col;
  if (Yb > Yt) ctx.fillRect(X - w / 2, Yt, w, Yb - Yt);
  if (up) { ctx.beginPath(); ctx.moveTo(X, 1); ctx.lineTo(X - 7, 13); ctx.lineTo(X + 7, 13); ctx.closePath(); ctx.fill(); }
  if (dn) { ctx.beginPath(); ctx.moveTo(X, p.H - 1); ctx.lineTo(X - 7, p.H - 13); ctx.lineTo(X + 7, p.H - 13); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  if (o.lab) {
    var t = o.lab + ((up || dn) && o.val ? " = " + o.val : ""), L = o.side === "left", tw0 = t.length * 7 + 12;
    var sh = 0; if (L && X - tw0 < 0) L = false; else if (!L && X + tw0 > p.W) { L = true; sh = 20; }
    cmath(ctx, t, X + (L ? -w / 2 - 5 : w / 2 + 5), clamp((up ? 22 : dn ? p.H - 22 : (Yt + Yb) / 2) + (dn ? -sh : sh), 12, p.H - 12), { size:13, align:L ? "right" : "left" });
  }
}
function undefBar(p, x, dx, w, flash){
  var ctx = p.ctx, X = p.X(x) + dx, Y0 = p.Y(0), h = 44;
  ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = flash ? 3 : 1.5; ctx.setLineDash([4, 3]); ctx.strokeRect(X - w / 2, Y0 - h, w, h); ctx.restore();
  cmath(ctx, "undefined", X + (dx < 0 ? -w / 2 - 4 : w / 2 + 4), Y0 - h + 8, { size:12, align:dx < 0 ? "right" : "left", color:css("--ink-2"), weight:400 });
}
function dotAt(p, x, y, r, col){ var ctx = p.ctx, X = p.X(x), Y = p.Y(y); if (!isFinite(Y) || Y < -8 || Y > p.H + 8) return; ctx.save(); ctx.beginPath(); ctx.arc(X, Y, r, 0, 2 * PI); ctx.fillStyle = col || css("--ink"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--sheet"); ctx.stroke(); ctx.restore(); }
function ringAt(p, x, y, r, col, lw){ var ctx = p.ctx, X = p.X(x), Y = p.Y(y); if (!isFinite(Y) || Y < -12 || Y > p.H + 12) return; ctx.save(); ctx.beginPath(); ctx.arc(X, Y, r, 0, 2 * PI); ctx.lineWidth = lw || 2.5; ctx.strokeStyle = col; ctx.stroke(); ctx.restore(); }
function vline(p, x, col, lw, dash){ var ctx = p.ctx, X = p.X(x); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore(); }
function arrowV(ctx, X, Ya, Yb, col, both){
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X, Ya); ctx.lineTo(X, Yb); ctx.stroke();
  function head(Y, d){ ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X - 5, Y - d * 9); ctx.lineTo(X + 5, Y - d * 9); ctx.closePath(); ctx.fill(); }
  if (Math.abs(Yb - Ya) > 12) { var d = Yb > Ya ? 1 : -1; head(Yb, d); if (both) head(Ya, -d); }
  ctx.restore();
}
// excluded x-values: a hatched --ink-2 band (G6, 20% / 25% in dark mode), a thin strip for a single value
function hatch(p){
  var col = css("--ink-2"), c0 = p.c;
  if (c0._sdH && c0._sdH.col === col) return c0._sdH.p;
  var c = document.createElement("canvas"); c.width = c.height = 8; var g = c.getContext("2d");
  g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 8); g.lineTo(8, 0); g.moveTo(-2, 2); g.lineTo(2, -2); g.moveTo(6, 10); g.lineTo(10, 6); g.stroke();
  c0._sdH = { col:col, p:p.ctx.createPattern(c, "repeat") }; return c0._sdH.p;
}
function exBands(p, D, upto){
  var out = [], c = hatch(p), al = dark() ? 0.25 : 0.2, w = 0.07;
  function add(a, b){ b = Math.min(b, upto); if (b > a) out.push({ x0:a, x1:b, color:c, alpha:al }); }
  if (D.gt0) add(-6, 0.02);
  if (D.ne0) add(-w, w);
  if (D.ne2) add(2 - w, 2 + w);
  return out;
}
function exPts(D, upto){ var o = []; if (D.ne0 && upto >= 0) o.push({ x:0, y:0, open:true, color:css("--ink-2") }); if (D.ne2 && upto >= 2) o.push({ x:2, y:0, open:true, color:css("--ink-2") }); return o; }

// ---------- small widgets ----------
// @component radioGroup (from MHF4U 25/32/37) — segmented control or chip row as a real radio group (arrow keys, roving tabindex, lock)
function radios(host, o){
  var val = o.value == null ? null : String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + ea(o.aria || o.label || "Options") + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (val == null && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled && host.contains(b)) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = (Math.max(0, ids.indexOf(val)) + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ id = id == null ? null : String(id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, repaint:function(opts){ if (opts) o.options = opts; paint(); } };
}
// @component functionPicker — radio group of function chips in the math font with a slot-coloured outline (f in --pen, g in --f3),
// arrow keys with a roving tabindex, one sideways-scrolling row of 40 px chips on phones (selected chip scrolled into view),
// and a disabled state with a reason ("Locked for this challenge"). o = {slot, label, aria, name, value, onChange(i)}
function picker(host, o){
  var val = o.value, why = null;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<div class="sd-pk sd-pk-' + o.slot + '"><span class="sd-pk-lab">' + o.label + '</span><div class="sd-pk-row" role="radiogroup" aria-label="' + ea(o.aria) + '">' +
      LIB.map(function(F, i){ var on = i === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-pk="' + i + '" aria-label="' + MV.esc(o.name + " equals " + F.say) + '"' + (why ? " disabled" : "") + ">" + m(F.src) + "</button>"; }).join("") +
      "</div>" + (why ? '<p class="sd-pk-why">' + why + "</p>" : "") + "</div>";
    var row = host.querySelector(".sd-pk-row"), b = row.querySelector('[aria-checked="true"]');
    if (b && row.scrollWidth > row.clientWidth + 2) row.scrollLeft = b.offsetLeft - row.offsetLeft - row.clientWidth / 2 + b.offsetWidth / 2;
    if (f && b && !b.disabled) b.focus({ preventScroll:true });
  }
  function choose(i){ if (why) return; var ch = i !== val; val = i; paint(); if (ch && o.onChange) o.onChange(i); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pk]"); if (b && !b.disabled) choose(+b.dataset.pk); });
  host.addEventListener("keydown", function(e){
    if (!e.target.closest("[data-pk]")) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0;
    if (e.key === "Home") d = -val; if (e.key === "End") d = LIB.length - 1 - val; if (!d) return;
    e.preventDefault(); choose((val + d + LIB.length) % LIB.length);
  });
  paint();
  return { set:function(i){ if (i !== val) { val = i; paint(); } }, get:function(){ return val; }, lock:function(r){ if (r !== why) { why = r; paint(); } } };
}

// ---------- hero: the wave rides on the line ----------
var HV = { xmin:-7, xmax:7, ymin:-8, ymax:8 };
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, HV), STOPS = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(function(k){ return k * PI / 2; }), RINGS = [-2, -1, 0, 1, 2].map(function(k){ return k * PI; });
  var fP = samp(function(x){ return x; }, -7.3, 7.3, []), gP = samp(Math.sin, -7.3, 7.3, []), sP = samp(function(x){ return x + Math.sin(x); }, -7.3, 7.3, []);
  var st = { fr:0, gr:0, sr:0, done:[], rings:[], cur:null };
  function clip(pts, t){ if (t >= 1) return pts; var lim = -7.3 + 14.6 * t; return pts.filter(function(q){ return q[0] <= lim; }); }
  function piS(x){ return MV.piLabel(x, 2); }
  p.render = function(){
    var pen = css("--pen"), teal = css("--f3"), ink = css("--ink"), cv = [];
    if (st.gr > 0) cv.push({ pts:clip(gP, st.gr), color:teal, width:2.6 });
    if (st.fr > 0) cv.push({ pts:clip(fP, st.fr), color:pen, width:3 });
    if (st.sr > 0) cv.push({ pts:clip(sP, st.sr), color:ink, width:3.4 });
    p.draw({ view:HV, xTicks:{ step:PI, pi:true }, yTicks:{ step:2 }, curves:cv, after:function(ctx){
      if (st.fr >= 1) cmath(ctx, "y = x", p.X(5.1) - 8, p.Y(6.4), { size:13, align:"right", color:pen });
      if (st.gr >= 1) cmath(ctx, "y = sin x", p.X(-5.5), p.Y(2.1), { size:13, align:"center", color:teal });
      if (st.sr >= 1) cmath(ctx, "y = x + sin x", p.X(3.3) + 10, p.Y(1.6), { size:13, align:"left", color:ink });
      st.rings.forEach(function(x){ ringAt(p, x, x, 10, css("--hi"), 3); });
      st.done.forEach(function(x){ dotAt(p, x, x + Math.sin(x), 4.5); });
      if (st.cur) {
        var x = st.cur.x, ph = st.cur.ph, gv = Math.sin(x), grow = clamp(ph / 0.4, 0, 1), lift = MV.ease(clamp((ph - 0.45) / 0.35, 0, 1));
        vline(p, x, css("--ink-2"), 1.2, [4, 4]);
        vbar(p, x, -5, 0, x * grow, pen, 8);
        vbar(p, x, 5, x * lift, x * lift + gv * grow, teal, 8);
        if (ph >= 0.85) dotAt(p, x, x + gv, 5.5);
      }
    }, describe:"Graph of y = x (blue) and y = sin x (teal). At nine x-values from −2π to 2π, the sine bar is stacked on the line’s bar; the tops of the stacks lie on y = x + sin x, which meets the line wherever sin x = 0." });
  };
  function cap(x){ var g = Math.round(Math.sin(x)); f.cap.innerHTML = m("x = " + piS(x)) + ": " + m(piS(x) + " + " + (g < 0 ? "(-1)" : String(g))); }
  function fin(){ f.cap.innerHTML = m("(f + g)(x) = x + sin x") + ": the wave rides on the line"; }
  if (RM) { st = { fr:1, gr:1, sr:1, done:STOPS, rings:RINGS, cur:null }; p.render(); fin(); return; }
  p.render();
  MV.tween({ dur:800, ease:LIN, step:function(t){ st.fr = t; p.render(); }, done:function(){
    MV.tween({ dur:800, ease:LIN, step:function(t){ st.gr = t; p.render(); }, done:function(){
      var i = 0;
      (function stop(){
        if (i >= STOPS.length) { st.cur = null; MV.tween({ dur:1200, ease:LIN, step:function(t){ st.sr = t; var lim = -7.3 + 14.6 * t; RINGS.forEach(function(x){ if (x <= lim && st.rings.indexOf(x) < 0) st.rings.push(x); }); p.render(); }, done:function(){ p.render(); fin(); } }); return; }
        var x = STOPS[i]; st.cur = { x:x, ph:0 }; cap(x);
        MV.tween({ dur:500, ease:LIN, step:function(t){ st.cur.ph = t; p.render(); }, done:function(){ st.done.push(x); i++; stop(); } });
      })();
    } });
  } });
}

// ---------- Explore: stacking bars ----------
var EV = { xmin:-4.3, xmax:4.3, ymin:-8, ymax:8 };
var IC = {}, SX = []; for (var k0 = 0; k0 < 40; k0++) SX.push(0.0137 + 0.1 * k0);
function zerosOf(fi, gi, s){
  var h = rfn(fi, gi, s), out = [], prevX = -4, prevY = h(-4);
  function push(z){ if (!out.some(function(q){ return Math.abs(q - z) < 1e-6; })) out.push(z); }
  if (prevY === 0) push(-4);
  for (var i = 1; i <= 3200; i++) {
    var x = (i - 1600) / 400, y = h(x);
    if (y === 0) push(x);
    else if (isFinite(prevY) && isFinite(y) && prevY !== 0 && (prevY < 0) !== (y < 0)) {
      var a = prevX, b = x, ya = prevY;
      for (var k = 0; k < 80; k++) { var c = (a + b) / 2, yc = h(c); if (!isFinite(yc)) break; if ((yc < 0) === (ya < 0)) { a = c; ya = yc; } else b = c; }
      var z = (a + b) / 2, hz = h(z); if (isFinite(hz) && Math.abs(hz) < 1e-6) push(z);
    }
    prevX = x; prevY = y;
  }
  return out.sort(function(p, q){ return p - q; }).map(function(z){
    var pq = Math.round(z * 4) / 4;
    if (Math.abs(z - pq) < 1e-7) { var r = resAt(fi, gi, s, pq); if (r.d && r.q && r.q[0] === 0) return { x:pq, ex:true, l:num(pq) }; }
    var sh = LIB[fi].z.filter(function(a){ return Math.abs(a[0] - z) < 1e-6 && LIB[gi].z.some(function(b){ return Math.abs(b[0] - a[0]) < 1e-9; }); })[0];
    return sh ? { x:z, ex:true, l:sh[1] } : { x:z, ex:false, l:num(z, 2) };
  });
}
function symOf(fi, gi, s){
  var D = dom(fi, gi), h = rfn(fi, gi, s);
  if (lop(D)) return { k:"lop", D:D };
  if (fi === gi && s < 0) return { k:"both" };
  var ev = true, od = true;
  SX.forEach(function(x){ var a = h(x), b = h(-x), t = 1e-9 * Math.max(1, Math.abs(a)); if (!(Math.abs(b - a) <= t)) ev = false; if (!(Math.abs(b + a) <= t)) od = false; });
  if (ev) return { k:"even" }; if (od) return { k:"odd" };
  var cands = [1, 2, 0.5].concat(SX);
  for (var i = 0; i < cands.length; i++) { var x = cands[i], a = h(x), b = h(-x), t = 1e-9 * Math.max(1, Math.abs(a)); if (Math.abs(b - a) > t && Math.abs(b + a) > t) return { k:"neither", x:x }; }
  return { k:"neither", x:null };
}
function behave(l){ return l === "osc" ? "keeps oscillating" : "→ " + (l === "+inf" ? "∞" : l === "-inf" ? MINUS + "∞" : num(l)); }
function farDir(fi, gi, s, dir){
  var F = LIB[fi], G = LIB[gi], k = dir === "L" ? 0 : 1, lf = F[dir], lg = G[dir];
  if (lf === "undef" || lg === "undef") return "undefined (the domain stops at 0).";
  if (fi === gi && s > 0) return "the result is " + m("2f") + ": it does what " + m("f") + " does, with every value doubled, so the result " + behave(lf === "+inf" || lf === "-inf" || lf === "osc" ? lf : 2 * lf) + ".";
  var rf = F.rk[k], rg = G.rk[k];
  if (Math.max(rf, rg) >= 1 && rf !== rg) {
    var win = rf > rg ? F : G, oth = win === F ? G : F, sub = win === G && s < 0, sign = (win[dir] === "+inf" ? 1 : -1) * (sub ? -1 : 1);
    return m(win.src) + " takes over" + ((oth.id === "e" || oth.id === "en") && oth[dir] === 0 ? " (" + m(oth.src + " → 0") + ")" : "") + (sub ? ", and it’s subtracted" : "") + ", so the result → " + (sign > 0 ? "∞" : MINUS + "∞") + ".";
  }
  if (lf === "osc" || lg === "osc") return "the result keeps oscillating; it doesn’t settle on one value.";
  var sh = [F, G].filter(function(P){ return P[dir] === 0; });
  return (sh.length === 2 ? "both pieces shrink to 0" : m(sh[0].src) + " shrinks to 0") + ", so the result → " + num(lf + s * lg) + ".";
}
function info(fi, gi, s){
  var key = fi + "_" + gi + "_" + s; if (IC[key]) return IC[key];
  var D = dom(fi, gi), zero = fi === gi && s < 0, keep = function(z){ return inD(D, z[0]); };
  return (IC[key] = { D:D, zero:zero, mf:LIB[gi].z.filter(keep), mg:LIB[fi].z.filter(keep), zs:zero ? null : zerosOf(fi, gi, s), sym:symOf(fi, gi, s),
    far:zero ? "The result is 0 for every " + m("x") + " in its domain." : "Far left: " + farDir(fi, gi, s, "L") + " Far right: " + farDir(fi, gi, s, "R") });
}
function FULL(){ return { fH:1, gH:1, flip:1, lift:1, dot:true }; }

function explore(host, api){
  var S = api.S, C = api.content;
  if (S.f == null) { S.f = IX.x2; S.g = IX.rx; S.mode = "sum"; S.x = 1; S.bars = true; S.res = false; S.gap = false; S.view = "graph"; }
  var A = { x:S.x, dots:[], band:null, stack:FULL(), fade:null, reveal:null, fold:null, lock:null, open:null, extra:[], keep:[], p4:false, gapS:1, flash:false, swipe:false, sweeping:false, tw:[], sid:0, idle:null, more:false };
  host.innerHTML = '<div class="sd-ex" data-view="' + S.view + '"><div class="sd-l"><div class="sd-vsw"></div>' +
    '<div class="sd-gv" data-mv="graph"><div class="eq-cap sd-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot" role="img" aria-label="Graph of f, g and their combination"></canvas></div><div class="sd-leg" aria-hidden="true"></div></div>' +
    '<div class="sd-tv"><p class="sd-th">Table of values</p><div class="sd-tbl"></div></div></div>' +
    '<div class="sd-r"><div class="sd-pick"><div class="sd-pf"></div><div class="sd-pg"></div><div class="sd-md"></div></div>' +
    '<div class="sd-ctl"><div class="sd-sl"><div class="sd-sl-top"><label for="sd-px">Probe ' + m("x") + '</label><output id="sd-px-o" for="sd-px"></output></div><input type="range" id="sd-px" min="-4" max="4" step="0.25"></div>' +
    '<div class="sd-btns"><button type="button" class="btn primary sm" data-a="sweep">Sweep</button><button type="button" class="btn ghost sm" data-a="reset">Reset</button></div>' +
    '<div class="sd-btns" role="group" aria-label="Show"><span class="sd-bl">Show:</span><button type="button" class="btn ghost sm sd-tg" data-t="bars">Bars</button><button type="button" class="btn ghost sm sd-tg" data-t="res">Result curve</button><button type="button" class="btn ghost sm sd-tg" data-t="gap">Gap</button></div>' +
    '<div class="sd-btns" role="group" aria-label="Symmetry tests"><button type="button" class="btn ghost sm" data-a="fold">Fold (even?)</button><button type="button" class="btn ghost sm" data-a="spin">Spin (odd?)</button></div></div>' +
    '<div class="sd-rd"><dl class="read" aria-live="polite"></dl><button type="button" class="btn ghost sm sd-morebtn" aria-expanded="false">More</button></div></div></div>';
  var ex = $(".sd-ex", host), cv = $("canvas", host), plot = new MV.Plot(cv, EV), sl = $("#sd-px", host);
  function sg(){ return S.mode === "diff" ? -1 : 1; }
  function nm(){ return S.mode === "diff" ? "(f - g)" : "(f + g)"; }
  function hidden(){ return A.lock === "pred" || A.lock === "tc3"; }
  function track(c){ A.tw.push(c); return c; }
  function tw(o){ return track(MV.tween(o)); }
  function later(ms, fn){ var id = A.sid; MV.wait(ms, function(){ if (id === A.sid) fn(); }); }
  function stopAll(){ A.tw.forEach(function(c){ c(); }); A.tw = []; A.sid++; clearTimeout(A.idle); A.sweeping = false; A.fold = null; A.reveal = null; A.stack = FULL(); A.gapS = 1; A.flash = false; }
  var pf = picker($(".sd-pf", host), { slot:"f", label:m("f(x) ="), aria:"Choose f", name:"f of x", value:S.f, onChange:function(i){ change(function(){ S.f = i; }); } });
  var pg = picker($(".sd-pg", host), { slot:"g", label:m("g(x) ="), aria:"Choose g", name:"g of x", value:S.g, onChange:function(i){ change(function(){ S.g = i; }); } });
  var md = radios($(".sd-md", host), { label:"Mode", options:[{ id:"sum", t:"Sum " + m("f + g") }, { id:"diff", t:"Difference " + m("f - g") }], value:S.mode, onChange:function(v){ change(function(){ S.mode = v; }); } });
  var vw = radios($(".sd-vsw", host), { aria:"Show the graph or the table", options:[{ id:"graph", t:"Graph" }, { id:"table", t:"Table" }], value:S.view, onChange:function(v){ S.view = v; ex.dataset.view = v; api.save(); plot.render(); } });
  $(".sd-leg", host).innerHTML = '<span><i class="sd-sw" style="background:var(--pen)"></i>' + m("f") + '</span><span><i class="sd-sw" style="background:var(--f3)"></i>' + m("g") + '</span><span><i class="sd-sw sd-sw-r" style="background:var(--ink)"></i><span class="sd-legr"></span></span>';

  function change(fn){
    stopAll(); var old = { f:S.f, g:S.g, s:sg() };
    fn(); A.dots = []; A.band = null; A.extra = []; A.keep = []; A.p4 = false; MV.banner("", "");
    api.save(); paintAll(); MV.changed();
    if (old.f !== S.f || old.g !== S.g || old.s !== sg()) {
      A.fade = { old:old, t:0 };
      tw({ dur:400, ease:LIN, step:function(t){ A.fade.t = t; plot.render(); }, done:function(){ A.fade = null; plot.render(); stackAnim("full"); } });
    }
  }
  function stackAt(kind, e, dif){
    function seg(a, b){ return clamp((e - a) / (b - a), 0, 1); }
    if (kind === "short") return { fH:1, gH:1, flip:dif ? 1 : 0, lift:seg(0, 150), dot:e >= 150 };
    if (kind === "lift") return { fH:1, gH:1, flip:dif ? 1 : 0, lift:MV.ease(seg(0, 500)), dot:e >= 500 };
    var o = dif ? 300 : 0;
    return { fH:MV.ease(seg(0, 300)), gH:MV.ease(seg(300, 600)), flip:dif ? MV.ease(seg(600, 900)) : 0, lift:MV.ease(seg(600 + o, 1100 + o)), dot:e >= 1100 + o };
  }
  function stackAnim(kind, done){
    var dif = sg() < 0, dur = kind === "short" ? 150 : kind === "lift" ? 600 : dif ? 1500 : 1200;
    tw({ dur:dur, ease:LIN, step:function(t){ A.stack = stackAt(kind, t * dur, dif); plot.render(); }, done:function(){
      A.stack = FULL();
      if (kind !== "short") { A.swipe = true; paintRead(); later(450, function(){ A.swipe = false; }); if (S.gap && dif) gapAnim(); }
      plot.render(); if (done) done();
    } });
  }
  function gapAnim(){ A.gapS = 0; plot.render(); later(RM ? 0 : 400, function(){ tw({ dur:800, step:function(t){ A.gapS = t; plot.render(); } }); }); }
  function setX(x, how){
    if (A.predRun && how !== "sys") return;
    x = clamp(Math.round(x * 4) / 4, -4, 4);
    if (how !== "sys" && A.sweeping) stopAll();
    var moved = x !== A.x; A.x = x; S.x = x;
    if (how !== "sys") { A.stack = FULL(); A.gapS = RM ? 1 : 0; clearTimeout(A.idle); if (!RM) A.idle = setTimeout(function(){ if (!A.sweeping) stackAnim("full"); }, 300); }
    api.save(); plot.render(); paintRead(); paintTable(); syncSl();
    if (moved && how !== "sys") MV.changed();
  }
  function syncSl(){ sl.value = A.x; $("#sd-px-o", host).innerHTML = m(num(A.x, 2)); sl.setAttribute("aria-valuetext", "x = " + num(A.x, 2)); }
  function addDot(x){ if (resAt(S.f, S.g, sg(), x).d && A.dots.indexOf(x) < 0) A.dots.push(x); }
  function sweep(done, internal){
    if (!internal) stopAll(); var id = A.sid, xs = []; for (var k = 0; k <= 32; k++) xs.push(-4 + k / 4);
    A.sweeping = true; A.dots = []; A.band = -4; S.res = false; A.fold = null; paintBtns();
    function fin(){ A.sweeping = false; A.band = Infinity; S.res = true; api.save(); plot.render(); paintBtns(); paintRead(); paintTable(); MV.changed(); if (done) done(); }
    function reveal(){ if (RM) { fin(); return; } A.reveal = 0; tw({ dur:800, ease:LIN, step:function(t){ A.reveal = t; plot.render(); }, done:function(){ A.reveal = null; fin(); } }); }
    if (RM) { xs.forEach(addDot); setX(4, "sys"); A.band = Infinity; reveal(); return; }
    var i = 0;
    (function step(){
      if (id !== A.sid) return;
      var x = xs[i]; A.band = x; addDot(x); A.flash = !resAt(S.f, S.g, sg(), x).d; setX(x, "sys");
      if (A.flash) later(120, function(){ A.flash = false; plot.render(); }); else stackAnim("short");
      i++; if (i < xs.length) later(200, step); else later(250, reveal);
    })();
  }
  function symTest(kind, done){
    if (!S.res || hidden() || A.sweeping) { if (done) done(); return; }
    var I = info(S.f, S.g, sg());
    if (I.sym.k === "lop") { MV.banner("bad", "The domain isn’t symmetric about 0, so the result can’t be even or odd."); if (done) done(); return; }
    var match = I.sym.k === "both" || I.sym.k === (kind === "fold" ? "even" : "odd");
    var me = A.fold = { kind:kind, t:0 }; MV.banner("", kind === "fold" ? "Folding the left half across the y-axis…" : "Turning the curve a half turn about the origin…");
    tw({ dur:1200, step:function(t){ if (A.fold !== me) return; me.t = t; plot.render(); }, done:function(){
      if (A.fold !== me) { if (done) done(); return; }
      MV.banner(match ? "good" : "bad", match ? "✓ Match: the result is " + (kind === "fold" ? "even" : "odd") : "No match: not " + (kind === "fold" ? "even" : "odd"));
      later(match ? 1200 : 2000, function(){ if (A.fold === me) { A.fold = null; plot.render(); } });
      if (done) done();
    } });
  }
  plot.render = function(){
    var fi = S.f, gi = S.g, s = sg(), x = A.x, D = dom(fi, gi), hid = hidden(), pen = css("--pen"), teal = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2"), cvs = [];
    var showR = (S.res || A.reveal != null) && !hid;
    function add(a, b, s2, al){
      cvs.push({ pts:ptsOf("f" + b, fnOf(b)), color:teal, width:2.6, alpha:al });
      cvs.push({ pts:ptsOf("f" + a, fnOf(a)), color:pen, width:3, alpha:al });
      if (showR) { var rp = ptsOf("r" + a + "_" + b + "_" + s2, rfn(a, b, s2)); if (A.reveal != null) { var lim = -4.3 + 8.6 * A.reveal; rp = rp.filter(function(q){ return q[0] <= lim; }); } cvs.push({ pts:rp, color:ink, width:3.4, alpha:al }); }
    }
    if (A.fade) add(A.fade.old.f, A.fade.old.g, A.fade.old.s, 1 - A.fade.t);
    add(fi, gi, s, A.fade ? A.fade.t : 1);
    var bandsOn = A.band != null && !hid, upto = A.band === Infinity ? 9 : A.band;
    var fv = val(fi, x), gv = val(gi, x), r = comb(fv, gv, s), I = info(fi, gi, s);
    plot.draw({ view:EV, xTicks:{ step:1 }, yTicks:{ step:2 }, curves:cvs, bands:bandsOn ? exBands(plot, D, upto) : [], points:bandsOn ? exPts(D, upto) : [],
      asymptotes:(fi === IX.rx2 || gi === IX.rx2) ? [{ x:2, label:"x = 2" }] : [],
      after:function(ctx, p){
        if (!hid) A.dots.forEach(function(xd){ var rr = resAt(fi, gi, s, xd); if (rr.d) dotAt(p, xd, rr.v, 3.4); });
        A.extra.forEach(function(q){ ringAt(p, q[0], q[1], 8, css("--hi"), 3); });
        if (A.p4) { ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.6; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(p.X(-1), p.Y(2.5)); ctx.lineTo(p.X(1), p.Y(2.5)); ctx.stroke(); ctx.restore(); }
        A.keep.forEach(function(q){ dotAt(p, q[0], q[1], 5); });
        if (S.res && A.reveal == null && !hid && !A.sweeping) {
          I.mf.forEach(function(z){ ringAt(p, z[0], LIB[fi].f(z[0]), 8, css("--hi"), 2.5); });
          if (s > 0) I.mg.forEach(function(z){ ringAt(p, z[0], LIB[gi].f(z[0]), 8, css("--hi"), 2.5); });
        }
        rings().forEach(function(q){ ringAt(p, q[0], q[1], 7, ink, 2); cmath(ctx, q[2], p.X(q[0]) + 11, p.Y(q[1]) - 12, { size:13 }); });
        vline(p, x, ink2, 1.3, [5, 5]);
        var w = p.W < 500 ? 8 : 10, off = w / 2 + 1, st = hid ? { fH:1, gH:1, flip:0, lift:0, dot:false } : A.stack;
        if (S.bars) {
          if (!fv.d) undefBar(p, x, -off, w, A.flash); else vbar(p, x, -off, 0, fv.v * st.fH, pen, w, { lab:"f(x)", side:"left", val:vS(fv), zero:false });
          if (!gv.d) undefBar(p, x, off, w, A.flash);
          else {
            var fl = s < 0 ? 1 - 2 * st.flip : 1, base = fv.d ? fv.v * st.lift : 0;
            vbar(p, x, off, base, base + gv.v * st.gH * fl, teal, w, { lab:(s < 0 && st.flip > 0.5 ? "-" : "") + "g(x)", side:"right", val:vS(gv) });
          }
        }
        if (r.d && st.dot && !hid) dotAt(p, x, r.v, 6);
        if (s < 0 && S.gap && r.d && !hid) {
          var gs = A.gapS, y0 = gv.v - gs * gv.v, y1 = fv.v - gs * gv.v, rt = p.X(x) < p.W - 150, X = p.X(x) + (rt ? 1 : -1) * (off + w / 2 + 16), Ya = clamp(p.Y(y0), 0, p.H), Yb = clamp(p.Y(y1), 0, p.H);
          arrowV(ctx, X, Ya, Yb, ink2, true);
          cmath(ctx, "f(x) - g(x) = " + vS(r), X + (rt ? 7 : -7), clamp((Ya + Yb) / 2, 12, p.H - 12), { size:13, color:ink, align:rt ? "left" : "right" });
        }
        if (A.fold && showR) {
          var fo = A.fold, rp = ptsOf("r" + fi + "_" + gi + "_" + s, rfn(fi, gi, s)), ox = p.X(0), oy = p.Y(0), th = PI * fo.t, pen2 = false;
          ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 3; ctx.setLineDash([7, 5]); ctx.globalAlpha = 0.9; ctx.beginPath();
          rp.forEach(function(q){
            if (!isFinite(q[1]) || (fo.kind === "fold" && q[0] >= 0)) { pen2 = false; return; }
            var X2 = p.X(q[0]), Y2 = clamp(p.Y(q[1]), -p.H * 4, p.H * 5), dx = X2 - ox, dy = Y2 - oy, px, py;
            if (fo.kind === "fold") { px = ox + dx * (1 - 2 * fo.t); py = Y2; } else { px = ox + dx * Math.cos(th) - dy * Math.sin(th); py = oy + dx * Math.sin(th) + dy * Math.cos(th); }
            if (!pen2) { ctx.moveTo(px, py); pen2 = true; } else ctx.lineTo(px, py);
          });
          ctx.stroke(); ctx.restore();
        }
        p.point({ x:x, y:0, r:5, color:ink, ring:true });
      },
      describe:describe(fv, gv, r, D) });
  };
  function describe(fv, gv, r, D){
    var F = LIB[S.f], G = LIB[S.g], s = sg(), xs = num(A.x, 2), t = "Graph of f(x) = " + F.say + " and g(x) = " + G.say + (S.res && !hidden() ? ", and their " + (s > 0 ? "sum" : "difference") : "") + ". ";
    if (!fv.d || !gv.d) t += "At x = " + xs + ", " + (!fv.d ? "f" : "g") + " is undefined, so there is no point of the result.";
    else t += "At x = " + xs + ": " + vS(fv) + (s > 0 ? " plus " : " minus ") + MV.plain(vS(gv)).replace(MINUS, "negative ") + (hidden() ? "." : " equals " + vS(r) + ".");
    if (!hidden()) t += " The result is defined for " + MV.plain(m(dsrc(D))) + ".";
    return t;
  }
  function rings(){ return A.open === "tc2" ? [[0, 1, "(0, 1)"], [2, 6, "(2, 6)"]] : A.open === "tc3" ? [[1, 1.5, "(1, 3/2)"]] : []; }
  function paintRead(){
    var fi = S.f, gi = S.g, s = sg(), x = A.x, F = LIB[fi], G = LIB[gi], fv = val(fi, x), gv = val(gi, x), r = comb(fv, gv, s), I = info(fi, gi, s), lk = !!A.lock, n = nm(), xs = num(x, 2), rows = [];
    function row(lab, html, cls){ rows.push('<div' + (cls ? ' class="' + cls + '"' : "") + "><dt>" + lab + "</dt><dd>" + html + "</dd></div>"); }
    row("Functions", fi === gi ? m("f(x) = g(x) = " + F.src) + ": the same function twice. " + (s > 0 ? m("f + f = 2f") + ", so " + m(n + "(x) = " + F.dbl) : m("f - f = 0") + ", so " + m(n + "(x) = 0")) + "."
      : m("f(x) = " + F.src) + ", " + m("g(x) = " + G.src) + "; " + m(n + "(x) = " + resSrc(fi, gi, s)));
    var at;
    if (!fv.d || !gv.d) {
      var parts = []; if (fv.d) parts.push(m("f(" + xs + ")" + vEq(fv) + vS(fv)) + "."); if (gv.d) parts.push(m("g(" + xs + ")" + vEq(gv) + vS(gv)) + ".");
      var und = [], why = [];
      if (!fv.d) { und.push(m("f(" + xs + ")")); why.push(F.why); } if (!gv.d) { und.push(m("g(" + xs + ")")); if (why.indexOf(G.why) < 0) why.push(G.why); }
      at = (parts.length ? parts.join(" ") + " " : "") + und.join(" and ") + (und.length > 1 ? " are" : " is") + " undefined (" + why.join("; ") + ")" + (lk ? "." : ", so " + m(n + "(" + xs + ")") + " is undefined.");
    } else {
      at = m("f(" + xs + ")" + vEq(fv) + vS(fv)) + ", " + m("g(" + xs + ")" + vEq(gv) + vS(gv));
      if (!lk) at += ", " + m(n + "(" + xs + ")" + (vX(fv) && vX(gv) ? " = " : " ≈ ") + vS(fv) + (s > 0 ? " + " : " - ") + br(vS(gv)) + vEq(r) + vS(r));
    }
    row("At " + m("x = " + xs), at, A.swipe ? "sd-swipe" : "");
    function amt(o){ return (vX(o) ? "" : "about ") + vS({ v:Math.abs(o.v), q:o.q ? [Math.abs(o.q[0]), o.q[1]] : null }); }
    var b = !fv.d ? m("f") + " has no bar here: it’s undefined." : isZero(fv) ? m("f") + "’s bar has height 0." : m("f") + "’s bar goes " + (fv.v > 0 ? "up " : "down ") + amt(fv) + ".";
    if (!gv.d) b += " " + m("g") + " has no bar here: it’s undefined.";
    else if (lk) b += " " + (isZero(gv) ? m("g") + "’s bar has height 0." : m("g") + "’s bar goes " + (gv.v > 0 ? "up " : "down ") + amt(gv) + ".");
    else if (s > 0) b += " " + (isZero(gv) ? m("g") + "’s bar has height 0." : m("g") + "’s bar goes " + (gv.v > 0 ? "up " : "down ") + amt(gv) + ", starting from the top of " + m("f") + "’s bar.");
    else b += " " + (isZero(gv) ? m("g") + "’s bar has height 0, so flipping it changes nothing." : m("g") + "’s bar is flipped, because it’s subtracted: it goes " + (gv.v > 0 ? "down " : "up ") + amt(gv) + " from the top of " + m("f") + "’s bar.");
    if (!lk) b += r.d ? " The stack ends at " + (vX(r) ? "" : "about ") + vS(r) + "." : " There’s no stack, because " + m(n + "(" + xs + ")") + " is undefined.";
    row("Bars", b);
    var sf = dsrc(domF(fi)), sgs = dsrc(domF(gi)), sr = dsrc(I.D), predLk = A.lock === "pred" || A.lock === "reveal";
    row("Domain", sf === sgs && sgs === sr && !predLk ? "All three: " + m(sr) + ", where both are defined" : m("f") + ": " + m(sf) + "; " + m("g") + ": " + m(sgs) + (predLk ? "" : "; result: " + m(sr) + ", where both are defined"));
    if (lk) row("Result", '<span class="muted">' + (A.lock === "tc3" ? "Hidden until you press Check challenge." : "Hidden until the reveal.") + "</span>");
    else {
      function zl(a){ return a.length ? a.map(function(z){ return m("x = " + z[1]); }).join(", ") : "nowhere"; }
      function zs(){ if (I.zero) return "Every " + m("x") + " in the domain: the result is 0 everywhere"; var a = I.zs.map(function(z){ return m("x " + (z.ex ? "=" : "≈") + " " + z.l); }); return a.length === 2 ? a.join(" and ") : a.join(", "); }
      var zt = I.zero || I.zs.length ? zs() : "";
      row("Meets", I.zero ? "The result is 0 everywhere: its graph lies on the " + m("x") + "-axis." : "Meets " + m("f") + "’s graph where " + m("g(x) = 0") + ": " + zl(I.mf) + ". " + (s > 0 ? "Meets " + m("g") + "’s graph where " + m("f(x) = 0") + ": " + zl(I.mg) + "." : "On the " + m("x") + "-axis where the graphs of " + m("f") + " and " + m("g") + " cross: " + (zt || "nowhere") + "."));
      row("Zeros in view", zt ? zt + (s < 0 && !I.zero ? " (where the graphs of " + m("f") + " and " + m("g") + " cross)" : "") + "." : "No zeros in view.");
      var y = I.sym, sy;
      if (y.k === "lop") sy = "Neither. The domain isn’t symmetric about 0: it includes " + (y.D.gt0 ? "1 but not −1." : "−2 but not 2.");
      else if (y.k === "both") sy = "Both even and odd: the result is 0 everywhere.";
      else if (y.k === "even") sy = "Even: " + m(n + "(-x) = " + n + "(x)") + " at every point tested.";
      else if (y.k === "odd") sy = "Odd: " + m(n + "(-x) = -" + n + "(x)") + " at every point tested.";
      else if (y.x == null) sy = "Neither: the values at " + m("x") + " and " + m("-x") + " are neither always equal nor always opposite.";
      else { var q = qOf(y.x), xl = q ? qtxt(q) : num(y.x, 2), a1 = resAt(fi, gi, s, y.x), a2 = resAt(fi, gi, s, -y.x), vs = function(o){ return vX(o) ? vS(o) : "about " + vS(o); };
        sy = "Neither: at " + m("x = " + xl) + " the result is " + vs(a1) + ", but at " + m("x = -" + xl) + " it’s " + vs(a2) + "."; }
      row("Symmetry", sy, "sd-more"); row("Far left and far right", I.far, "sd-more");
    }
    $("dl.read", host).innerHTML = rows.join("");
    $(".sd-cap", host).innerHTML = m(n + "(x) = " + resSrc(fi, gi, s));
    $(".sd-legr", host).innerHTML = m(n);
  }
  function paintTable(){
    var fi = S.f, gi = S.g, s = sg(), xs = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    if (A.x % 1) { xs.push(A.x); xs.sort(function(a, b){ return a - b; }); }
    function cell(o){ return m((vX(o) ? "" : "≈ ") + vS(o)); }
    function und(t){ return '<span class="sd-und">' + t + "</span>"; }
    var rows = xs.map(function(x){
      if (A.sweeping && x > A.band + 1e-9) return [m(num(x, 2)), "", "", ""];
      var fv = val(fi, x), gv = val(gi, x), r = comb(fv, gv, s);
      return [m(num(x, 2)), fv.d ? cell(fv) : und("undefined"), gv.d ? cell(gv) : und("undefined"), A.lock ? und("hidden") : r.d ? cell(r) : und("undefined (needs both)")];
    });
    $(".sd-tbl", host).innerHTML = MV.tableHTML({ head:[m("x"), m("f(x)"), m("g(x)"), m(nm() + "(x)")], rows:rows, hiRow:xs.indexOf(A.x), caption:"Values of f, g and the result" });
  }
  function paintBtns(){
    var hid = hidden(), lk = !!A.predRun;
    $$("[data-t]", host).forEach(function(b){ var k = b.dataset.t; b.setAttribute("aria-pressed", String(!!S[k])); b.disabled = lk || (k === "gap" && sg() > 0) || (k === "res" && hid); });
    var sw = $('[data-a="sweep"]', host); sw.textContent = A.sweeping ? "Stop" : "Sweep"; sw.disabled = lk; $('[data-a="reset"]', host).disabled = lk;
    $$('[data-a="fold"], [data-a="spin"]', host).forEach(function(b){ b.disabled = !S.res || hid || A.sweeping || lk; });
  }
  function uiLock(on){ A.predRun = on; var why = on ? "Wait for the reveal to finish." : null; pf.lock(why || (A.open === "tc2" ? "Locked for this challenge" : null)); pg.lock(why); md.lock(on); sl.disabled = on; paintBtns(); }
  function paintAll(){ pf.set(S.f); pg.set(S.g); md.set(S.mode); plot.render(); paintRead(); paintTable(); paintBtns(); syncSl(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || A.predRun) return;
    if (b.dataset.t) {
      var k = b.dataset.t; S[k] = !S[k];
      if (k === "res") A.reveal = null;
      if (k === "gap" && S.gap) gapAnim();
      api.save(); plot.render(); paintBtns(); return;
    }
    if (b.classList.contains("sd-morebtn")) { A.more = !A.more; $(".sd-rd", host).classList.toggle("sd-open", A.more); b.setAttribute("aria-expanded", String(A.more)); b.textContent = A.more ? "Less" : "More"; return; }
    var a = b.dataset.a;
    if (a === "sweep") { if (A.sweeping) { stopAll(); paintAll(); } else sweep(); }
    else if (a === "reset") { stopAll(); setOpen(null, true); S.f = IX.x2; S.g = IX.rx; S.mode = "sum"; S.res = false; S.gap = false; S.bars = true; A.dots = []; A.band = null; A.extra = []; A.keep = []; A.p4 = false; A.x = S.x = 1; MV.banner("", ""); api.save(); paintAll(); MV.changed(); }
    else if (a === "fold" || a === "spin") symTest(a);
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Escape" && A.sweeping && !A.predRun) { stopAll(); paintAll(); } });
  sl.addEventListener("input", function(){ setX(+sl.value, "slider"); });
  sl.addEventListener("keydown", function(e){ if (e.shiftKey && /^Arrow/.test(e.key)) { e.preventDefault(); setX(A.x + ((e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : -1), "key"); } });
  MV.drag(plot, { axis:"x", step:{ x:0.25, y:0.25 }, big:4,
    handles:function(){ return [{ id:"p", x:A.x, y:0, label:"Probe at x = " + num(A.x, 2) + ". Arrow keys move it by 0.25, Shift + arrow by 1. Space sweeps; F folds; S spins." }]; },
    snap:function(x, y){ return [clamp(Math.round(x * 4) / 4, -4, 4), 0]; },
    move:function(id, nx, ny, how){ setX(nx, how); },
    key:function(id, e){
      var k = e.key;
      if (k === "Home" || k === "End") { setX(k === "Home" ? -4 : 4, "key"); return true; }
      if (A.predRun) return true;
      if (k === " " || k === "Spacebar") { if (A.sweeping) { stopAll(); paintAll(); } else sweep(); return true; }
      if (k === "Escape" && A.sweeping) { stopAll(); paintAll(); return true; }
      if (k === "f" || k === "F") { symTest("fold"); return true; }
      if (k === "s" || k === "S") { symTest("spin"); return true; }
      return false;
    } });
  (function(){
    var on = false;
    function at(e){ var r = cv.getBoundingClientRect(); return plot.xOf(e.clientX - r.left); }
    cv.addEventListener("pointerdown", function(e){ if (e.defaultPrevented || A.predRun) return; on = true; try { cv.setPointerCapture(e.pointerId); } catch (er) {} setX(at(e), "tap"); });
    cv.addEventListener("pointermove", function(e){ if (on) setX(at(e), "drag"); });
    cv.addEventListener("pointerup", function(){ on = false; }); cv.addEventListener("pointercancel", function(){ on = false; });
  })();

  // ----- challenges: Open buttons for TC2 (locks f) and TC3 (commit first) -----
  function setOpen(id, quiet){
    if (!quiet) stopAll();
    A.open = id; A.lock = id === "tc3" ? "tc3" : (A.lock === "tc3" ? null : A.lock);
    if (id === "tc2") { S.f = IX.x; pf.set(S.f); pf.lock("Locked for this challenge"); A.dots = []; A.band = null; } else pf.lock(null);
    api.save(); if (!quiet) { paintAll(); MV.changed(); } refreshOpen();
  }
  var OPEN = { tc2:["Open this challenge (locks " + m("f") + " to " + m("x") + ")", "Close (unlock " + m("f") + ")"], tc3:["Open this challenge (hides the result)", "Close (show the result)"] };
  function inject(){
    ["tc2", "tc3"].forEach(function(id){
      var box = document.querySelector('#chal [data-c="' + id + '"] .q-actions'); if (!box || box.querySelector("[data-open]")) return;
      var on = A.open === id, b = document.createElement("button"); b.type = "button"; b.className = "btn ghost sm"; b.dataset.open = id; b.dataset.k = id + "open";
      b.setAttribute("aria-pressed", String(on)); b.innerHTML = OPEN[id][on ? 1 : 0]; box.insertBefore(b, box.firstChild);
    });
  }
  function refreshOpen(){ $$("#chal [data-open]").forEach(function(b){ b.remove(); }); inject(); }
  var chalHost = $("#chal");
  if (chalHost) {
    new MutationObserver(inject).observe(chalHost, { childList:true });
    chalHost.addEventListener("click", function(e){ var b = e.target.closest("[data-open]"); if (!b) return; e.stopImmediatePropagation(); if (A.predRun) return; setOpen(A.open === b.dataset.open ? null : b.dataset.open); var nb = $('#chal [data-open="' + b.dataset.open + '"]'); if (nb) nb.focus(); });
  }
  function chal(id, opt){
    var c = (C.challenges || []).filter(function(x){ return x.id === id; })[0], F = c.fb, fi = S.f, gi = S.g, s = sg(), live = opt && opt.live;
    function has(k){ return fi === IX[k] || gi === IX[k]; }
    function no(msg){ return { ok:false, msg:msg || c.general }; }
    if (id === "tc1") {
      var D = dom(fi, gi);
      if (D.gt0 && D.ne2) return { ok:true };
      if (has("rx") && has("rx2")) return no(F.recips);
      if (has("log") && has("rx")) return no(F.logRecip);
      if (has("log")) return no(F.logOther);
      if (has("rx2") && (LIB[fi].dk === "" || LIB[gi].dk === "")) return no(F.shiftAll);
      return no();
    }
    if (id === "tc2") {
      if (fi !== IX.x) return no(F.lock);
      if (qeq(resAt(fi, gi, s, 0).q, [1, 1]) && qeq(resAt(fi, gi, s, 2).q, [6, 1])) { if (!live && A.open === "tc2") MV.wait(30, function(){ setOpen(null); }); return { ok:true }; }
      if (s > 0 && gi === IX.x2) return no(F.sq);
      if (s > 0 && gi === IX.en) return no(F.neg);
      if (s > 0 && gi === IX.cos) return no(F.cos);
      if (s < 0 && gi === IX.e) return no(F.diff);
      return no();
    }
    if (id === "tc3") {
      if (live) return { ok:false };
      var y = symOf(fi, gi, s), r1 = resAt(fi, gi, s, 1), res;
      if ((y.k === "odd" || y.k === "both") && qeq(r1.q, [3, 2])) res = { ok:true };
      else if (fi === IX.e && gi === IX.en && s > 0) res = no(F.p4);
      else if (fi === IX.en && gi === IX.e && s < 0) res = no(F.swap);
      else if (LIB[fi].par === "odd" || LIB[gi].par === "odd") res = no(F.oddPiece);
      else if (lop(dom(fi, gi))) res = no(F.lop);
      else res = no();
      MV.wait(30, function(){ if (A.open === "tc3") { A.open = null; A.lock = null; S.res = true; api.save(); paintAll(); refreshOpen(); } });
      return res;
    }
    return { ok:false };
  }

  // ----- predictions -----
  var PS = { p1:[IX.e, IX.rx2, 1], p2:[IX.e, IX.sin, -4], p3:[IX.log, IX.rx, -4], p4:[IX.e, IX.en, 1] };
  function pStart(p){
    stopAll(); if (A.open) setOpen(null, true);
    var st = PS[p.id]; S.f = st[0]; S.g = st[1]; S.mode = "sum"; A.x = S.x = st[2]; S.res = false; S.gap = false; S.bars = true;
    S.view = "graph"; ex.dataset.view = "graph"; vw.set("graph");
    A.lock = "pred"; A.dots = []; A.band = null; A.extra = []; A.keep = []; A.p4 = false; A.fade = null;
    A.stack = p.id === "p1" ? { fH:1, gH:1, flip:0, lift:0, dot:false } : FULL();
    api.save(); paintAll();
  }
  function pRun(p, done){
    var ended = false;
    function fin(){ if (ended) return; ended = true; uiLock(false); A.lock = null; api.save(); paintAll(); MV.changed(); done(); }
    A.lock = "reveal"; uiLock(true); paintAll();
    if (p.id === "p1") stackAnim("lift", function(){ later(500, fin); });
    else if (p.id === "p2") {
      var legs = [[-4, -PI], [-PI, 0], [0, PI], [PI, 4]], li = 0;
      if (RM) { for (var k = 0; k <= 32; k++) addDot(-4 + k / 4); [-PI, 0, PI].forEach(function(z){ A.extra.push([z, Math.pow(2, z)]); }); A.band = Infinity; S.res = true; setX(4, "sys"); fin(); return; }
      A.sweeping = true; A.band = -4; paintBtns();
      (function leg(){
        var L = legs[li];
        tw({ dur:Math.abs(L[1] - L[0]) * 750, ease:LIN, step:function(t){
          var x = lerp(L[0], L[1], t); A.x = x; A.band = x; for (var g = -4; g <= x + 1e-9; g += 0.25) addDot(g); plot.render(); paintRead(); paintTable();
        }, done:function(){
          li++;
          if (li < legs.length) { A.extra.push([L[1], Math.pow(2, L[1])]); plot.render(); later(600, leg); }
          else { A.sweeping = false; A.band = Infinity; A.x = S.x = 4; A.reveal = 0; tw({ dur:800, ease:LIN, step:function(t){ A.reveal = t; plot.render(); }, done:function(){ A.reveal = null; S.res = true; later(300, fin); } }); }
        } });
      })();
    }
    else if (p.id === "p3") sweep(function(){ later(400, fin); }, true);
    else if (p.id === "p4") {
      stackAnim("full", function(){
        A.keep = [[1, 2.5]]; later(400, function(){
          setX(-1, "sys"); stackAnim("full", function(){
            A.keep.push([-1, 2.5]); A.p4 = true; plot.render();
            later(600, function(){ sweep(function(){ symTest("fold", function(){ later(1500, fin); }); }, true); });
          });
        });
      });
    }
    else fin();
  }
  paintAll();
  return { predict:{ start:pStart, run:pRun }, challenge:chal };
}

// ---------- Part 3: superposition mixer and keypad decoder ----------
var AMP = [0.5, 1, 2], X12 = PI / 12;
var KEYS = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["*", "0", "#"]], ROWT = [2, 3, 4, 5], COLT = [6, 7, 8];
function keyOf(r, c){ return KEYS[ROWT.indexOf(r)][COLT.indexOf(c)]; }
function ampSrc(a){ return a === 1 ? "" : a === 2 ? "2 " : "{1}/{2} "; }
function kx(k){ return k === 1 ? "x" : k + "x"; }
function perSrc(k){ var g = gcd(2, k), n = 2 / g, d = k / g; return (n === 1 ? "" : n) + "π" + (d === 1 ? "" : "/" + d); }
function cs(v){ var a = Math.abs(v), t = a === 1 ? "" : Number.isInteger(a) ? a + " " : "{" + a * 2 + "}/{2} "; return (v < 0 ? "-" : "") + t; }
function halfS(v){ var r = Math.round(v * 2) / 2; return Math.abs(v - r) < 1e-9 ? { t:num(r), ex:true } : { t:num(v, 2), ex:false }; }
// @component tonePlayer — plays 1 s clips, each a sum of sine tones (wave frequency k → k × 220 waves per second), through the
// browser's built-in Web Audio at 20% volume with short fades; nothing is downloaded or sent; plays only on a button press
function tonePlayer(){
  var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
  var ctx = null, src = null;
  return {
    play:function(clips, onEnd){
      try {
        ctx = ctx || new AC(); if (ctx.resume) ctx.resume();
        var sr = ctx.sampleRate, n = sr, buf = ctx.createBuffer(1, n * clips.length, sr), d = buf.getChannelData(0), fade = Math.round(sr * 0.02);
        clips.forEach(function(parts, ci){
          for (var i = 0; i < n; i++) {
            var t = i / sr, y = 0; parts.forEach(function(q){ y += q.a * Math.sin(2 * PI * q.k * 220 * t + q.ph); });
            d[ci * n + i] = 0.2 * y * Math.min(1, i / fade, (n - i) / fade);
          }
        });
        if (src) try { src.stop(); } catch (e) {}
        src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination); src.onended = function(){ src = null; if (onEnd) onEnd(); }; src.start();
      } catch (e) { if (onEnd) onEnd(); }
    },
    stop:function(){ if (src) try { src.stop(); } catch (e) {} }
  };
}
function part3(host, api){
  var S = api.S, C = api.content;
  if (S.mode == null) { S.mode = "mix"; S.a1 = 1; S.m1 = 1; S.a2 = 1; S.n2 = 1; S.sh = 0; S.pi = 6; S.exp = {}; S.dsel = "d1"; S.row = 0; S.col = 0; S.dsol = {}; }
  var P = { trace:null, mo:null, smo:null, wide:false, copies:null, tw:[], sid:0, msg:"", busy:null, play:false, dfb:null };
  var tone = tonePlayer();
  host.innerHTML = '<div class="sd-p3"><div class="sd-p3l"><div class="sd-p3m"></div><p class="sd-method tiny"></p><p class="banner sd-p3b" aria-live="polite"></p><div class="sd-strips-h"></div></div>' +
    '<div class="sd-p3r"><div class="sd-mix"><div class="sd-w1a"></div><div class="sd-w1m"></div><div class="sd-w2a"></div><div class="sd-w2n"></div><div class="sd-w2s"></div>' +
    '<div class="sd-sl"><div class="sd-sl-top"><label for="sd-pp">Probe ' + m("x") + '</label><output id="sd-pp-o" for="sd-pp"></output></div><input type="range" id="sd-pp" min="0" max="24" step="1"></div>' +
    '<div class="sd-btns"><button type="button" class="btn primary sm" data-p="run">Run</button>' + (tone ? '<button type="button" class="btn ghost sm" data-p="listen">Listen</button>' : "") + '</div><dl class="read sd-p3rd" aria-live="polite"></dl></div>' +
    '<div class="sd-dec"><div class="sd-dsel"></div><div class="sd-keys" role="group" aria-label="Model keypad"></div><p class="tiny muted sd-knote"></p><div class="sd-drow"></div><div class="sd-dcol"></div><p class="sd-guess"></p>' +
    '<div class="sd-btns"><button type="button" class="btn primary sm" data-p="dcheck">Check key</button></div><div class="sd-dfb" aria-live="polite"></div></div></div></div>' +
    '<div class="part sd-xps"><h3>Experiments</h3><p class="sd-tally"></p><div class="sd-xgrid"></div></div>';
  var root = $(".sd-p3", host), sh = $(".sd-strips-h", host), plots = [], sl = $("#sd-pp", host);
  $(".sd-knote", host).innerHTML = C.keypadNote; $(".sd-method", host).innerHTML = C.method;
  function track(c){ P.tw.push(c); return c; }
  function tw(o){ return track(MV.tween(o)); }
  function later(ms, fn){ var id = P.sid; MV.wait(ms, function(){ if (id === P.sid) fn(); }); }
  function stopP(){ P.tw.forEach(function(c){ c(); }); P.tw = []; P.sid++; P.mo = null; P.smo = null; P.trace = null; P.copies = null; P.busy = null; }
  function banner(t, k){ var b = $(".sd-p3b", host); b.className = "banner sd-p3b" + (k ? " " + k : ""); b.innerHTML = t || ""; }
  function XM(){ return P.wide ? 4 * PI : 2 * PI; }
  function W1(st){ st = st || S; var a = AMP[st.a1], k = st.m1; return function(x){ return a * Math.sin(k * x); }; }
  function W2(st){ st = st || S; var b = AMP[st.a2], n = st.n2, s = st.sh; return s === 1 ? function(x){ return b * Math.cos(n * x); } : s === 2 ? function(x){ return -b * Math.sin(n * x); } : function(x){ return b * Math.sin(n * x); }; }
  function snap(){ return { a1:S.a1, m1:S.m1, a2:S.a2, n2:S.n2, sh:S.sh }; }
  function w1d(x){ var v = W1()(x); return P.mo && P.mo.w === 1 ? lerp(P.mo.f(x), v, P.mo.t) : v; }
  function w2d(x){ var v = W2()(x); return P.mo && P.mo.w === 2 ? lerp(P.mo.f(x), v, P.mo.t) : v; }
  function sumd(x){ var v = w1d(x) + w2d(x); return P.smo ? lerp(P.smo.f(x), v, P.smo.t) : v; }
  function silent(){ return S.m1 === S.n2 && S.sh === 2 && S.a1 === S.a2; }
  function px(){ return S.pi * X12; }
  function tgt(){
    if (S.dsel.charAt(0) === "k") { var key = S.dsel.slice(1), r = -1, c = -1; KEYS.forEach(function(row, i){ var j = row.indexOf(key); if (j >= 0) { r = ROWT[i]; c = COLT[j]; } }); return { row:r, col:c, key:key, mys:false }; }
    var md = C.mysteries.filter(function(q){ return q.id === S.dsel; })[0], a = MV.ans(md); return { row:a.row, col:a.col, key:keyOf(a.row, a.col), mys:true, name:md.name };
  }
  // @component N27 linkedPanels (adapted from MHF4U 09) — strips stacked on one shared x-axis with a --hi probe line through
  // all of them; tap or drag any strip to move the probe; the strip group is one focusable element (arrows, Shift + arrow)
  function build(){
    var T = S.mode === "mix" ? ["Wave 1", "Wave 2", "Sum: what you hear"] : [tgt().mys ? "Mystery signal (" + tgt().name + ")" : "Signal of key " + tgt().key, "Your guess", "Leftover = mystery − guess"];
    sh.innerHTML = '<div class="sd-strips" tabindex="0" role="group" aria-label="Three wave strips sharing one x-axis. Arrow keys move the probe by π/12; Shift + arrow by π/2.">' +
      T.map(function(t, i){ return '<p class="sd-st-t">' + t + '</p><div class="plot-wrap"><canvas class="plot sd-strip' + (i === 2 ? " sd-strip3" : "") + '" role="img"></canvas></div>'; }).join("") + "</div>";
    plots = $$("canvas", sh).map(function(c){ var p = new MV.Plot(c, { xmin:0, xmax:2 * PI, ymin:-2, ymax:2 }); p.render = drawS; return p; });
    plots.forEach(function(p){
      var on = false;
      function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
      function go(e){ setPi(Math.round(clamp(at(e), 0, 2 * PI) / X12)); }
      p.c.addEventListener("pointerdown", function(e){ on = true; try { p.c.setPointerCapture(e.pointerId); } catch (er) {} go(e); });
      p.c.addEventListener("pointermove", function(e){ if (on) go(e); });
      p.c.addEventListener("pointerup", function(){ on = false; }); p.c.addEventListener("pointercancel", function(){ on = false; });
    });
    $(".sd-strips", sh).addEventListener("keydown", function(e){
      var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return;
      e.preventDefault(); setPi(S.pi + d * (e.shiftKey ? 6 : 1));
    });
    drawS();
  }
  function setPi(i){ i = clamp(i, 0, 24); if (P.busy || P.trace != null) { if (P.busy) return; stopP(); } S.pi = i; api.save(); drawS(); paintRead(); syncSl(); }
  function syncSl(){ sl.value = S.pi; $("#sd-pp-o", host).innerHTML = m(MV.piLabel(px(), 12)); sl.setAttribute("aria-valuetext", "x = " + MV.piLabel(px(), 12)); }
  var drawing = false;
  function drawS(){
    if (drawing || !plots.length) return; drawing = true;
    try { plots.forEach(function(p, i){ p.draw(S.mode === "mix" ? mixScene(p, i) : decScene(p, i)); }); } finally { drawing = false; }
  }
  function ticks(){ return { step:P.wide ? PI : PI / 2, pi:true, den:2 }; }
  function probeAfter(p, fn){ return function(ctx){ if (fn) fn(ctx, p); var x = P.trace != null ? P.trace : px(); vline(p, x, css("--hi"), 2.5); }; }
  function stats(){ return peak(W1(), W2()); }
  function peak(f1, f2){
    var a = AMP[S.a1], b = AMP[S.a2], same = S.m1 === S.n2, n = S.m1, out = { single:same && !silent(), zero:silent() };
    if (out.zero) return out;
    if (same) {
      if (S.sh === 0) { out.v = a + b; out.vs = num(a + b); out.x = PI / (2 * n); }
      else if (S.sh === 2) { out.v = Math.abs(a - b); out.vs = num(Math.abs(a - b)); out.x = (a > b ? PI : 3 * PI) / (2 * n); }
      else { var r2 = a * a + b * b; out.v = Math.sqrt(r2); out.vs = { "0.5":"√2/2", "1.25":"√5/2", "4.25":"√17/2", "2":"√2", "5":"√5", "8":"2√2" }[String(r2)] + " ≈ " + num(out.v, 2); out.x = (PI / 2 - Math.atan2(b, a)) / n; }
      return out;
    }
    var h = function(x){ return f1(x) + f2(x); }, N = 2400, best = -Infinity, list = [];
    for (var i = 1; i < N; i++) { var x0 = 2 * PI * (i - 1) / N, x1 = 2 * PI * i / N, x2 = 2 * PI * (i + 1) / N, y1 = h(x1); if (y1 >= h(x0) && y1 >= h(x2)) { var lo = x0, hi = x2; for (var k = 0; k < 60; k++) { var p1 = lo + (hi - lo) / 3, q1 = hi - (hi - lo) / 3; if (h(p1) < h(q1)) lo = p1; else hi = q1; } var xm = (lo + hi) / 2; list.push([xm, h(xm)]); best = Math.max(best, h(xm)); } }
    var first = list.filter(function(q){ return q[1] >= best - 1e-7; })[0];
    out.v = best; out.vs = "≈ " + num(best, 2); out.x = first[0]; out.approx = true;
    return out;
  }
  function xLab(x){ var l = MV.piLabel(x, 24); return /π/.test(l) || l === "0" ? { t:l, ex:true } : { t:num(x, 2), ex:false }; }
  function mixScene(p, i){
    var XMx = XM(), pen = css("--pen"), teal = css("--f3"), ink = css("--ink"), x = px(), w = p.W < 500 ? 8 : 10, tr = P.trace;
    if (i < 2) {
      var fn = i === 0 ? w1d : w2d, col = i === 0 ? pen : teal;
      return { view:{ xmin:0, xmax:XMx, ymin:-2, ymax:2 }, xTicks:ticks(), yTicks:{ step:1 }, curves:[{ f:fn, color:col, width:i === 0 ? 3 : 2.6 }],
        after:probeAfter(p, function(){ var xx = tr != null ? tr : x; vbar(p, xx, 0, 0, fn(xx), col, w); dotAt(p, xx, fn(xx), 4.5, col); }),
        describe:(i === 0 ? "Wave 1: " : "Wave 2: ") + MV.plain(m(i === 0 ? w1Src() : w2Src())) + ". At the probe its height is " + num(fn(x), 2) + "." };
    }
    var cvs = [{ f:sumd, color:ink, width:3.4, domain:[0, tr != null ? Math.max(tr, 1e-6) : (P.wide ? 2 * PI : XMx)] }];
    if (P.wide) cvs.push({ f:sumd, color:css("--ink-2"), width:2, dash:[6, 5], domain:[2 * PI, 4 * PI] });
    var pk = (tr == null && !P.mo && !P.smo && !P.copies) ? stats() : null;
    return { view:{ xmin:0, xmax:XMx, ymin:-4, ymax:4 }, xTicks:ticks(), yTicks:{ step:2 }, curves:cvs,
      after:probeAfter(p, function(ctx){
        if (P.copies) ["a", "b"].forEach(function(k){
          var cp = P.copies[k]; if (!cp) return; ctx.save(); ctx.strokeStyle = css("--hi"); ctx.globalAlpha = 0.75; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath();
          for (var j = 0; j <= 240; j++) { var xs = cp.len * j / 240, X = p.X(xs + cp.off), Y = p.Y(sumd(xs)); if (j) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
          ctx.stroke(); ctx.restore();
        });
        var xx = tr != null ? tr : x, a = w1d(xx), b = w2d(xx), off = w / 2 + 1;
        vbar(p, xx, -off, 0, a, pen, w); vbar(p, xx, off, a, a + b, teal, w); dotAt(p, xx, a + b, 5.5);
        if (pk && !pk.zero) {
          ringAt(p, pk.x, pk.v, 9, css("--hi"), 3); cmath(ctx, pk.vs,p.X(pk.x) + 12, p.Y(pk.v) - 4, { size:13 });
          if (pk.single) { var X = p.X(pk.x) - 16, Y0 = p.Y(0), Y1 = p.Y(pk.v); ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(X + 5, Y0); ctx.lineTo(X, Y0); ctx.lineTo(X, Y1); ctx.lineTo(X + 5, Y1); ctx.stroke(); ctx.restore(); cmath(ctx, "amplitude", X - 4, (Y0 + Y1) / 2, { size:12, align:"right" }); }
        }
      }),
      describe:"Sum strip: " + MV.plain(m(sumSrc())) + (silent() ? ". The sum is 0 everywhere: silence." : ". At the probe the sum is " + num(sumd(x), 2) + ".") };
  }
  function decScene(p, i){
    var t = tgt(), r = S.row, c = S.col, pen = css("--pen"), teal = css("--f3"), ink = css("--ink"), x = px();
    var tf = function(xx){ return Math.sin(t.row * xx) + Math.sin(t.col * xx); }, gf = function(xx){ return (r ? Math.sin(r * xx) : 0) + (c ? Math.sin(c * xx) : 0); };
    var base = { view:{ xmin:0, xmax:2 * PI, ymin:i === 2 ? -4 : -2, ymax:i === 2 ? 4 : 2 }, xTicks:ticks(), yTicks:{ step:i === 2 ? 2 : 1 } };
    if (i === 0) { base.curves = [{ f:tf, color:ink, width:3 }]; base.after = probeAfter(p, function(){ dotAt(p, x, tf(x), 4.5); }); base.describe = "Signal strip: two waves added."; }
    else if (i === 1) {
      base.curves = []; if (r) base.curves.push({ f:function(xx){ return Math.sin(r * xx); }, color:pen, width:2.4 }); if (c) base.curves.push({ f:function(xx){ return Math.sin(c * xx); }, color:teal, width:2.2 }); if (r && c) base.curves.push({ f:gf, color:ink, width:3 });
      base.after = probeAfter(p); base.describe = "Your guess: " + (r || c ? MV.plain(m(guessSrc())) : "nothing chosen yet") + ".";
    } else { base.curves = [{ f:function(xx){ return tf(xx) - gf(xx); }, color:ink, width:3 }]; base.after = probeAfter(p); base.describe = "Leftover strip: the signal minus your guess" + (r === t.row && c === t.col ? ", flat at 0." : "."); }
    return base;
  }
  function w1Src(){ return "y = " + ampSrc(AMP[S.a1]) + "sin " + kx(S.m1); }
  function w2Core(){ var b = AMP[S.a2]; return S.sh === 1 ? ampSrc(b) + "cos " + kx(S.n2) : (S.sh === 2 ? "-" : "") + ampSrc(b) + "sin " + kx(S.n2); }
  function w2Src(){ return "y = " + w2Core(); }
  function sumSrc(){
    var a = AMP[S.a1], b = AMP[S.a2], s1 = ampSrc(a) + "sin " + kx(S.m1), s2 = w2Core(), t = "y = " + s1 + (s2.charAt(0) === "-" ? " - " + s2.slice(1) : " + " + s2);
    if (S.m1 === S.n2 && S.sh !== 1) { var v = S.sh === 0 ? a + b : a - b; t += " = " + (Math.abs(v) < 1e-9 ? "0" : cs(v) + "sin " + kx(S.m1)); }
    return t;
  }
  function guessSrc(){ var p = []; if (S.row) p.push("sin " + kx(S.row)); if (S.col) p.push("sin " + kx(S.col)); return "y = " + p.join(" + "); }
  function paintRead(){
    if (S.mode !== "mix") return;
    var a = AMP[S.a1], b = AMP[S.a2], rows = [], same = S.m1 === S.n2, per = perSrc(S.m1);
    function row(l, h){ rows.push("<div><dt>" + l + "</dt><dd>" + h + "</dd></div>"); }
    function amp(v){ return v === 0.5 ? "1/2" : num(v); }
    row("Wave 1", m(w1Src()) + ": amplitude " + amp(a) + ", period " + m(per));
    var base = ampSrc(b) + "sin " + kx(S.n2);
    row("Wave 2", m(w2Src()) + (S.sh === 1 ? " (" + m("sin " + kx(S.n2)) + " shifted a quarter cycle)" : S.sh === 2 ? " (" + m(base) + " flipped)" : "") + ": amplitude " + amp(b) + ", period " + m(perSrc(S.n2)));
    row("Sum", m(sumSrc()));
    var kind;
    if (!same) { var g = gcd(S.m1, S.n2), rp = perSrc(g); kind = "Not a single sine wave. It repeats every 2π ÷ (greatest common factor of " + S.m1 + " and " + S.n2 + ") = " + m(rp) + "."; }
    else if (S.sh === 0) kind = "Same period, in step: a single wave with amplitude " + amp(a) + " + " + amp(b) + " = " + amp(a + b) + " and period " + m(per) + ".";
    else if (S.sh === 2) kind = a === b ? "Silence: the waves cancel." : "Same period, flipped: a single wave with amplitude |" + amp(a) + " − " + amp(b) + "| = " + amp(Math.abs(a - b)) + " and period " + m(per) + ".";
    else { var pk0 = stats(); kind = "Same period, a quarter cycle apart: a single wave with amplitude " + m("√{" + (a === 0.5 ? "({1}/{2})" : amp(a)) + "^2 + " + (b === 0.5 ? "({1}/{2})" : amp(b)) + "^2}") + " = " + m(pk0.vs) + " and period " + m(per) + "."; }
    row("What kind of wave", kind);
    var pk = stats(), hp;
    if (pk.zero) hp = "None: the sum is 0 everywhere.";
    else {
      var xl = pk.approx ? { t:num(pk.x, 2), ex:false } : xLab(pk.x), ww1 = W1()(pk.x), ww2 = W2()(pk.x);
      hp = m(pk.vs) + ", first at " + m("x " + (xl.ex ? "=" : "≈") + " " + xl.t) + (ww1 < a - 1e-6 && ww2 < b - 1e-6 ? ", where neither wave is at its peak" : "") + "." ;
      if (Math.abs(pk.v - (a + b)) > 1e-9) hp += " " + m("A + B") + " = " + amp(a + b) + " would need both waves to peak at the same " + m("x") + ".";
    }
    row("Highest point", hp);
    var x = px(), v1 = halfS(W1()(x)), v2 = halfS(W2()(x)), vs = halfS(W1()(x) + W2()(x));
    row("At the probe", m("x = " + MV.piLabel(x, 12)) + ": " + m((v1.ex && v2.ex ? "" : "≈ ") + v1.t + " + " + br(v2.t) + (vs.ex ? " = " : " ≈ ") + vs.t));
    $(".sd-p3rd", host).innerHTML = rows.join("");
  }
  // ----- mixer controls -----
  var ampOpts = [{ id:0, t:m("{1}/{2}") }, { id:1, t:"1" }, { id:2, t:"2" }], kOpts = [1, 2, 3, 4, 5, 6].map(function(k){ return { id:k, t:String(k) }; });
  var ctl = {
    a1:radios($(".sd-w1a", host), { label:"Wave 1 amplitude", cls:"chips", options:ampOpts, value:S.a1, onChange:function(v){ waveChange(1, function(){ S.a1 = +v; }); } }),
    m1:radios($(".sd-w1m", host), { label:"Wave 1 frequency " + m("m"), cls:"chips", options:kOpts, value:S.m1, onChange:function(v){ waveChange(1, function(){ S.m1 = +v; }); } }),
    a2:radios($(".sd-w2a", host), { label:"Wave 2 amplitude", cls:"chips", options:ampOpts, value:S.a2, onChange:function(v){ waveChange(2, function(){ S.a2 = +v; }); } }),
    n2:radios($(".sd-w2n", host), { label:"Wave 2 frequency " + m("n"), cls:"chips", options:kOpts, value:S.n2, onChange:function(v){ waveChange(2, function(){ S.n2 = +v; }); } }),
    sh:radios($(".sd-w2s", host), { label:"Wave 2 shift", cls:"chips", options:C.shifts.map(function(t, i){ return { id:i, t:t }; }), value:S.sh, onChange:function(v){ waveChange(2, function(){ S.sh = +v; }); } })
  };
  function syncCtl(){ ctl.a1.set(S.a1); ctl.m1.set(S.m1); ctl.a2.set(S.a2); ctl.n2.set(S.n2); ctl.sh.set(S.sh); }
  function retrace(dur, done){
    if (RM) { P.trace = null; drawS(); paintRead(); afterTrace(); if (done) done(); return; }
    P.trace = 0; tw({ dur:dur, ease:LIN, step:function(t){ P.trace = 2 * PI * t; drawS(); }, done:function(){ P.trace = null; drawS(); paintRead(); afterTrace(); if (done) done(); } });
  }
  function afterTrace(){ if (silent()) banner(C.silence, "good"); }
  function waveChange(which, fn){
    var old = which === 1 ? W1() : W2(), oldSum = (function(f1, f2){ return function(x){ return f1(x) + f2(x); }; })(W1(), W2());
    stopP(); P.wide = false; banner(""); fn(); api.save(); syncCtl();
    if (silent()) {
      P.mo = { w:which, f:old, t:0 }; P.smo = { f:oldSum, t:0 };
      tw({ dur:800, ease:LIN, step:function(t){ P.mo.t = Math.min(1, t * 2); P.smo.t = t; drawS(); }, done:function(){ P.mo = null; P.smo = null; drawS(); paintRead(); afterTrace(); } });
    } else {
      P.mo = { w:which, f:old, t:0 }; P.trace = 0;
      tw({ dur:400, ease:LIN, step:function(t){ P.mo.t = t; drawS(); }, done:function(){ P.mo = null; retrace(1000); } });
    }
    paintRead();
  }
  function run(done, pauses){
    stopP(); banner(""); P.busy = done ? "x" : "run"; var id = P.sid; paintBtns();
    function fin(){ if (id !== P.sid) return; P.trace = null; P.busy = null; S.pi = 24; api.save(); drawS(); paintRead(); syncSl(); paintBtns(); afterTrace(); if (done) done(); }
    if (RM) { if (pauses) banner(pauses[pauses.length - 1][1]); fin(); return; }
    var stops = (pauses || []).map(function(q){ return q[0]; }).concat([2 * PI]), si = 0, from = 0;
    (function leg(){
      var to = stops[si];
      function arrive(){
        var pz = pauses && pauses[si]; si++;
        if (si >= stops.length) { fin(); return; }
        if (pz) { banner(pz[1]); later(1100, function(){ from = to; leg(); }); } else { from = to; leg(); }
      }
      if (to - from < 1e-9) { P.trace = to; S.pi = Math.round(to / X12); drawS(); arrive(); return; }
      tw({ dur:(to - from) / (2 * PI) * 5000, ease:LIN, step:function(t){ var x = lerp(from, to, t); P.trace = x; S.pi = Math.round(x / X12); drawS(); syncSl(); }, done:arrive });
    })();
  }
  // ----- experiments -----
  var XCFG = { x1:[1, 2, 1, 2, 0], x2:[2, 2, 1, 2, 2], x3:[1, 1, 1, 1, 1], x4:[1, 2, 1, 3, 0] };
  function xSet(id){
    stopP(); banner(""); P.wide = false; var c = XCFG[id]; S.mode = "mix"; mode.set("mix"); S.a1 = c[0]; S.m1 = c[1]; S.a2 = c[2]; S.n2 = c[3]; S.sh = c[4];
    var st = S.exp[id] || (S.exp[id] = {}); st.set = true; api.save(); syncCtl(); layout(); retrace(1000); paintX();
  }
  function xRun(id){
    var C3 = ["`x = 0`: `cos x` peaks; sum = 0 + 1 = 1", "`x = π/4`: sum = √2 ≈ 1.41, the highest point", "`x = π/2`: `sin x` peaks; sum = 1 + 0 = 1"].map(MV.md);
    var c = XCFG[id]; S.a1 = c[0]; S.m1 = c[1]; S.a2 = c[2]; S.n2 = c[3]; S.sh = c[4]; syncCtl(); P.wide = id === "x4"; layout();
    function done(){ var st = S.exp[id]; st.ran = true; P.busy = null; api.save(); paintX(); paintBtns(); }
    if (id === "x1") run(function(){ later(400, function(){ var old = W1(); S.a1 = 2; syncCtl(); api.save(); P.mo = { w:1, f:old, t:0 }; P.trace = 0; tw({ dur:400, ease:LIN, step:function(t){ P.mo.t = t; drawS(); }, done:function(){ P.mo = null; retrace(1000, done); } }); if (RM) { P.mo = null; drawS(); } }); });
    else if (id === "x2") run(function(){ later(400, function(){ var old = W2(), os = (function(f1, f2){ return function(x){ return f1(x) + f2(x); }; })(W1(), W2()); S.a2 = 2; syncCtl(); api.save(); P.mo = { w:2, f:old, t:0 }; P.smo = { f:os, t:0 };
      tw({ dur:800, ease:LIN, step:function(t){ P.mo.t = Math.min(1, t * 2); P.smo.t = t; drawS(); }, done:function(){ P.mo = null; P.smo = null; drawS(); paintRead(); afterTrace(); done(); } }); }); });
    else if (id === "x3") run(done, [[0, C3[0]], [PI / 4, C3[1]], [PI / 2, C3[2]]]);
    else run(function(){
      if (RM) { P.copies = { a:{ len:PI, off:PI }, b:{ len:2 * PI, off:2 * PI } }; banner("Copies of the first π and of the whole 0 to 2π trace, moved along: only the 2π copy matches."); drawS(); done(); return; }
      P.copies = { a:{ len:PI, off:0 } }; banner("A copy of the first π doesn’t match the next π.");
      tw({ dur:1200, step:function(t){ P.copies.a.off = PI * t; drawS(); }, done:function(){ later(900, function(){
        P.copies = { b:{ len:2 * PI, off:0 } }; banner("A copy of the whole 0 to 2π trace matches the next 2π: the sum repeats every 2π.");
        tw({ dur:1600, step:function(t){ P.copies.b.off = 2 * PI * t; drawS(); }, done:done });
      }); } });
    });
  }
  function paintX(){
    var X = C.experiments, matched = 0;
    $(".sd-xgrid", host).innerHTML = X.map(function(x){
      var st = S.exp[x.id] || {}, h = '<div class="sd-xc" data-x="' + x.id + '"><h4>' + x.title + '</h4><p class="tiny">Set-up: ' + x.setup + "</p>";
      h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-xs="' + x.id + '" data-k="xs' + x.id + '">Set it up</button></div>';
      h += '<p class="sd-xq">' + x.q + '</p><div class="chips" role="group" aria-label="Your prediction">' + x.chips.map(function(c, i){ var on = st.pick === i; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-xp="' + x.id + '" data-i="' + i + '" data-k="xp' + x.id + i + '"' + (!st.set || st.ran ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-xr="' + x.id + '" data-k="xr' + x.id + '"' + (st.pick == null || P.busy ? " disabled" : "") + ">" + (st.ran ? "Run again" : "Run") + "</button></div>";
      if (st.ran) { var ok = MV.ok(x.chips[st.pick]); if (ok) matched++; h += '<div class="fb ' + (ok ? "good" : "bad") + '" role="status"><p><strong>' + (ok ? "✓ Your prediction matched." : "✗ Your prediction didn’t match.") + "</strong> " + x.conclusion + "</p></div>"; }
      return h + "</div>";
    }).join("");
    $(".sd-tally", host).textContent = "Your predictions: " + matched + " of 4 matched";
  }
  // ----- decoder -----
  var mode = radios($(".sd-p3m", host), { aria:"Mixer mode", options:[{ id:"mix", t:"Mix" }, { id:"dec", t:"Decode a key" }], value:S.mode, onChange:function(v){ stopP(); banner(""); P.wide = false; S.mode = v; api.save(); layout(); } });
  var dsel = radios($(".sd-dsel", host), { label:"Mystery signal", cls:"chips", options:[], value:S.dsel, onChange:function(v){ S.dsel = v; P.dfb = null; api.save(); layout(); } });
  var drow = radios($(".sd-drow", host), { label:"Row tone", cls:"chips", options:[{ id:0, t:"none" }].concat(ROWT.map(function(r){ return { id:r, t:String(r) }; })), value:S.row, onChange:function(v){ S.row = +v; P.dfb = null; api.save(); paintDec(); drawS(); } });
  var dcol = radios($(".sd-dcol", host), { label:"Column tone", cls:"chips", options:[{ id:0, t:"none" }].concat(COLT.map(function(r){ return { id:r, t:String(r) }; })), value:S.col, onChange:function(v){ S.col = +v; P.dfb = null; api.save(); paintDec(); drawS(); } });
  $(".sd-keys", host).innerHTML = KEYS.map(function(row, i){ return row.map(function(k, j){ return '<button type="button" class="sd-key" data-key="' + k + '" aria-label="Key ' + k + ": row tone " + ROWT[i] + ", column tone " + COLT[j] + '">' + k + "</button>"; }).join(""); }).join("");
  function paintDec(){
    dsel.repaint(C.mysteries.map(function(q){ return { id:q.id, t:(S.dsol[q.id] ? "✓ " : "") + q.name }; }));
    dsel.set(S.dsel.charAt(0) === "k" ? null : S.dsel);
    $$(".sd-key", host).forEach(function(b){ b.setAttribute("aria-pressed", String(S.dsel === "k" + b.dataset.key)); });
    $(".sd-guess", host).innerHTML = "Your guess: " + (S.row || S.col ? m(guessSrc()) : '<span class="muted">nothing chosen yet</span>');
    $(".sd-dfb", host).innerHTML = P.dfb ? '<div class="fb ' + P.dfb.k + '" role="status"><p>' + P.dfb.t + "</p></div>" : "";
  }
  function dCheck(){
    var t = tgt(), r = S.row, c = S.col, F = C.decodeFb, txt, k = "bad";
    if (r === t.row && c === t.col) { txt = F.done.replace("{key}", t.key).replace("{row}", t.row).replace("{col}", t.col); k = "good"; if (t.mys) S.dsol[S.dsel] = true; }
    else if (r === t.row && !c) { txt = F.rowOnly; k = "good"; }
    else if (c === t.col && !r) { txt = F.colOnly; k = "good"; }
    else if (!r && !c) { txt = C.method; k = ""; }
    else txt = F.wrong;
    P.dfb = { k:k, t:txt }; api.save(); paintDec(); MV.focusFb($(".sd-dec", host));
  }
  function paintBtns(){
    var rb = $('[data-p="run"]', host); if (rb) rb.disabled = !!P.busy && P.busy !== "run";
    if (rb) rb.textContent = P.busy === "run" ? "Stop" : "Run";
    var lb = $('[data-p="listen"]', host); if (lb) lb.textContent = P.play ? "Stop sound" : "Listen";
    $$("[data-xr]", host).forEach(function(b){ var st = S.exp[b.dataset.xr] || {}; b.disabled = st.pick == null || !!P.busy; });
  }
  function layout(){
    root.dataset.mode = S.mode; $(".sd-xps", host).hidden = S.mode !== "mix"; mode.set(S.mode);
    build(); paintRead(); syncSl(); paintDec(); paintBtns();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.p === "run") { if (P.busy === "run") { stopP(); P.busy = null; drawS(); paintBtns(); } else run(); return; }
    if (b.dataset.p === "listen") {
      if (P.play) { tone.stop(); return; }
      var a = AMP[S.a1], bb = AMP[S.a2], ph = [0, PI / 2, PI][S.sh], c1 = { a:a, k:S.m1, ph:0 }, c2 = { a:bb, k:S.n2, ph:ph };
      P.play = true; paintBtns(); tone.play([[c1], [c2], [c1, c2]], function(){ P.play = false; paintBtns(); }); return;
    }
    if (b.dataset.p === "dcheck") { dCheck(); return; }
    if (b.dataset.key) { S.dsel = "k" + b.dataset.key; P.dfb = null; api.save(); layout(); return; }
    if (b.dataset.xs) { xSet(b.dataset.xs); return; }
    if (b.dataset.xp) { var st = S.exp[b.dataset.xp] || (S.exp[b.dataset.xp] = {}); st.pick = +b.dataset.i; api.save(); MV.keepFocus($(".sd-xgrid", host), paintX); return; }
    if (b.dataset.xr) { xRun(b.dataset.xr); paintBtns(); return; }
  });
  sl.addEventListener("input", function(){ setPi(+sl.value); });
  sl.addEventListener("keydown", function(e){ if (e.shiftKey && /^Arrow/.test(e.key)) { e.preventDefault(); setPi(S.pi + ((e.key === "ArrowRight" || e.key === "ArrowUp") ? 6 : -6)); } });
  layout(); paintX(); afterTrace();
  return {};
}

// ---------- Practice 1: combine and work backwards (N4 number entry with mini-graphs) ----------
var N12 = { xs:[-2, -1, 0, 1, 2], f:[5, 2, 1, 2, 5], g:[-4, 1, 0, -1, 4] };
function nf3(x){ return 2 * x + 1; } function ng3(x){ return x * x - 4; }
function miniScene(id, A, solved){
  var pen = css("--pen"), teal = css("--f3"), o = { bars:[], dots:[], rings:[], curves:[], cap:"" }, ns = function(v){ return num(v); };
  function lo(v){ return Math.min(-6, v - 2); } function hi(v){ return Math.max(9, v + 2); }
  if (id === "n1") { o.view = { xmin:-4, xmax:0, ymin:lo(A), ymax:hi(A) }; o.bars = [[-2, 0, 5, "f", "f(-2) = 5"], [-2, 5, A, "g", "g(-2) = " + ns(A - 5)]]; o.dots = [[-2, A]];
    o.cap = solved ? "`f(-2) + g(-2) = 5 + (-4) = 1`." : "Your answer needs `g(-2)` = " + ns(A - 5) + ". The table says `g(-2) = -4`."; }
  else if (id === "n2") { o.view = { xmin:-1, xmax:3, ymin:lo(A), ymax:hi(A) }; o.bars = [[1, 0, 2, "f", "f(1) = 2"], [1, 2, A, "g", "-g(1) = " + ns(A - 2)]]; o.dots = [[1, A]];
    o.cap = solved ? "`f(1) - g(1) = 2 - (-1) = 3`: flipping `g`’s bar points it up." : "Your answer needs `g(1)` = " + ns(2 - A) + ". The table says `g(1) = -1`."; }
  else if (id === "n3") { var fA = nf3(A), gA = ng3(A); if (Math.abs(A) <= 4) { o.bars = [[A, 0, fA, "f", "f(" + ns(A) + ")"], [A, fA, fA + gA, "g", "g(" + ns(A) + ")"]]; o.dots = [[A, fA + gA]]; }
    o.cap = "At `x = " + ns(A) + "`: `f + g` = " + ns(fA) + " + " + br(ns(gA)) + " = " + ns(fA + gA) + "."; }
  else if (id === "n4") { o.view = { xmin:1, xmax:5, ymin:lo(7 + A), ymax:hi(7 + A) }; o.bars = [[3, 0, 7, "f", "f(3) = 7"], [3, 7, 7 + A, "g", "g(3) = " + ns(A)]]; o.dots = [[3, 7 + A]]; o.rings = [[3, 4, "(f + g)(3) = 4"]];
    o.cap = "With `g(3)` = " + ns(A) + ", the stack ends at 7 + " + br(ns(A)) + " = " + ns(7 + A) + "."; }
  else if (id === "n5") { o.view = { xmin:3, xmax:7, ymin:lo(Math.min(A, A + 6)), ymax:hi(Math.max(A, A + 6)) }; o.bars = [[5, 0, A, "f", "f(5) = " + ns(A)], [5, A, A + 6, "g", "-g(5) = 6"]]; o.dots = [[5, A + 6]]; o.rings = [[5, -2, "h(5) = -2", "a"]];
    o.cap = "With `f(5)` = " + ns(A) + ": `h(5)` = " + ns(A) + " − (−6) = " + ns(A + 6) + "."; }
  else if (id === "n6") { o.nl = true; o.view = { xmin:-5.6, xmax:5.6, ymin:-2, ymax:2 }; o.cap = "Your count: " + ns(A) + ". `f` needs `x > -1`; `g` needs `x ≠ -2` and `x ≠ 2`." + (solved ? " Both: 0, 1, 3, 4 and 5." : ""); }
  else if (id === "n7") { var f2 = 7 - A; o.view = { xmin:-4, xmax:4, ymin:lo(Math.min(f2, 7 - 2 * A)), ymax:hi(Math.max(f2, 7)) };
    o.bars = [[2, 0, f2, "f", "f(2) = " + ns(f2)], [2, f2, 7, "g", "g(2) = " + ns(A)], [-2, 0, f2, "f", "f(-2) = " + ns(f2)], [-2, f2, 7 - 2 * A, "g", "g(-2) = " + ns(-A)]];
    o.dots = [[2, 7], [-2, 7 - 2 * A]]; o.rings = [[2, 7, "(2, 7)", "a"], [-2, 3, "(-2, 3)"]];
    o.cap = "With `g(2)` = " + ns(A) + ": `f(2)` = " + ns(f2) + ", so `(f + g)(-2)` = " + ns(f2) + " + " + br(ns(-A)) + " = " + ns(7 - 2 * A) + "."; }
  else if (id === "n8") { o.view = { xmin:0, xmax:4, ymin:lo(Math.min(A, A - 8)), ymax:hi(Math.max(8, A)) }; o.curves = [{ f:function(x){ return Math.pow(2, x); }, color:pen, width:2.4 }];
    o.bars = [[1, 0, 2, "f", ""], [1, 2, 0, "g", ""], [2, 0, 4, "f", ""], [2, 4, 0, "g", ""], [3, 0, 8, "f", "f(3) = 8"], [3, 8, A, "g", "g(3) = " + ns(A - 8)]]; o.dots = [[1, 0], [2, 0], [3, A]];
    o.cap = "Your answer needs `g(3)` = " + ns(A - 8) + ". Is (3, " + ns(A - 8) + ") on the line through (1, −2) and (2, −4)?"; }
  o.pen = pen; o.teal = teal;
  return o;
}
function drawMini(p, o, desc){
  p.draw({ view:o.view, xTicks:{ step:1 }, yTicks:o.nl ? { step:5 } : {}, grid:!o.nl, axes:!o.nl, curves:o.curves, describe:desc, after:function(ctx){
    if (o.nl) {
      var Y = p.Y(0), ink = css("--ink");
      ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(4, Y); ctx.lineTo(p.W - 4, Y); ctx.stroke();
      ctx.fillStyle = ink; ctx.font = "12px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var k = -5; k <= 5; k++) { ctx.beginPath(); ctx.moveTo(p.X(k), Y - 5); ctx.lineTo(p.X(k), Y + 5); ctx.stroke(); ctx.fillText(num(k), p.X(k), Y + 9); }
      ctx.strokeStyle = o.pen; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(p.X(-1), Y - 16); ctx.lineTo(p.W - 2, Y - 16); ctx.stroke(); ctx.restore();
      p.point({ x:-1, y:p.yOf(Y - 16), open:true, color:o.pen, r:5 });
      cmath(ctx, "f: x > -1", p.X(-1) + 10, Y - 30, { size:13, color:o.pen });
      [-2, 2].forEach(function(v){ p.point({ x:v, y:p.yOf(Y + 22), open:true, color:o.teal, r:5.5 }); });
      cmath(ctx, "g: x ≠ ±2", p.X(-2) - 10, Y + 36, { size:13, align:"right", color:o.teal });
      if (o.solved) [0, 1, 3, 4, 5].forEach(function(v){ dotAt(p, v, 0, 6); });
      return;
    }
    o.bars.forEach(function(b){ vbar(p, b[0], b[3] === "f" ? -6 : 6, b[1], b[2], b[3] === "f" ? o.pen : o.teal, 9, b[4] ? { lab:b[4], side:b[3] === "f" ? "left" : "right" } : null); });
    o.rings.forEach(function(r){ ringAt(p, r[0], r[1], 7, css("--ink"), 2); cmath(ctx, r[2], p.X(r[0]) + 12, p.Y(r[1]) + (r[3] === "a" ? -20 : 22), { size:12 }); });
    o.dots.forEach(function(d){ dotAt(p, d[0], d[1], 5.5); });
    if (o.extra) o.extra(ctx);
  } });
}
function combine(host, api, a){
  var S = api.S; S.items = S.items || {}; var msg = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", tries:0, hint:0, solved:false, first:null, last:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + MV.tableHTML({ head:[m("x")].concat(N12.xs.map(function(v){ return m(num(v)); })), rows:[[m("f(x)")].concat(N12.f.map(function(v){ return m(num(v)); })), [m("g(x)")].concat(N12.g.map(function(v){ return m(num(v)); }))], caption:a.tableCap }) +
    a.items.map(function(it){ return '<div class="q sd-ci" data-ci="' + it.id + '"></div>'; }).join("");
  function paintItem(it, i){
    var box = $('[data-ci="' + it.id + '"]', host), x = ist(it.id), h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div></div>";
    if (it.fig) h += '<div class="plot-wrap sd-n3w"><canvas class="plot sd-n3" role="img"></canvas></div><p class="tiny muted sd-mcap" data-cap="1"></p>';
    h += '<div class="numrow"><label for="ci-' + it.id + '">Your answer:</label><input class="numin" id="ci-' + it.id + '" data-cin="' + it.id + '" type="number" step="1" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msg[it.id]) h += '<div class="fb bad" role="status"><p>' + msg[it.id] + "</p></div>";
    if (x.last != null && !it.fig) h += '<div class="sd-miniw"><canvas class="plot wide sd-mini" role="img"></canvas><p class="tiny muted sd-mcap" data-cap="1"></p></div>';
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    var c = $("canvas", box); if (!c) return;
    var p = c._p || (c._p = new MV.Plot(c, { xmin:-4, xmax:4, ymin:-6, ymax:8 }));
    p.render = function(){
      var cap = $("[data-cap]", box), o;
      if (it.fig) {
        o = x.last != null ? miniScene("n3", x.last, x.solved) : { bars:[], dots:[], rings:[], cap:"" };
        o.view = { xmin:-4, xmax:4, ymin:-6, ymax:8 }; o.pen = css("--pen"); o.teal = css("--f3");
        o.curves = [{ f:ng3, color:o.teal, width:2.6 }, { f:nf3, color:o.pen, width:3 }];
        o.extra = function(ctx){ cmath(ctx, "f", p.X(3.1) - 10, p.Y(7.2), { size:14, align:"right", color:o.pen }); cmath(ctx, "g", p.X(-3.3) + 10, p.Y(6.9), { size:14, color:o.teal }); };
        drawMini(p, o, "Graphs of f, the line through (−1, −1) and (1, 3), and g, the parabola with vertex (0, −4) through (−2, 0) and (2, 0)." + (x.last != null ? " " + MV.plain(MV.md(o.cap)) : ""));
      } else { o = miniScene(it.id, x.last, x.solved); o.solved = x.solved; drawMini(p, o, "Mini-graph of the bars your answer makes. " + MV.plain(MV.md(o.cap))); }
      if (cap) cap.innerHTML = MV.md(o.cap || "");
    };
    p.render();
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.cin; if (!id) return; ist(id).val = e.target.value; MV.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = $('[data-k="' + e.target.dataset.cin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ci]"); if (!box) return;
    var i = a.items.map(function(q){ return q.id; }).indexOf(box.dataset.ci), it = a.items[i], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); MV.save(); paintItem(it, i); return; }
    if (b.dataset.act === "check") {
      var inp = $("input", box); x.val = inp ? inp.value : x.val;
      var r = MV.parseNum(x.val);
      if (!r || r.length !== 1 || !Number.isInteger(r[0])) { msg[it.id] = "Enter a whole number, such as −3."; paintItem(it, i); return; }
      var v = r[0], ans = MV.ans(it); x.last = v;
      if (v === ans) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
      else { x.tries++; var w = (it.wrong || []).filter(function(q){ return q.match === v; })[0]; msg[it.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : a.fallback); }
      MV.save(); paintItem(it, i); MV.focusFb(box);
    }
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: build to spec ----------
var CQ = [[-2, 1], [-1, 1], [-1, 2], [1, 2], [1, 1], [2, 1]];
var TP = (function(){ var o = [0]; for (var k = -600; k <= 600; k++) { var v = Math.pow(10, k / 200); o.push(v, -v); } return o.sort(function(a, b){ return a - b; }); })();
var task = (function(){
  var api, plot, pf, pg, cr, T;
  function read(){ var s = api ? api.S : {}; return { f:s.f == null ? IX.e : s.f, g:s.g == null ? IX.rx : s.g, c:s.c == null ? 4 : s.c }; }
  function cq(d){ return CQ[d.c]; }
  function cv(d){ return cq(d)[0] / cq(d)[1]; }
  function l1(d){ var D = dom(d.f, d.g); return D.gt0 && !D.ne2; }
  function h1(d){ var a = LIB[d.f].ex(1), b = LIB[d.g].ex(1); return a && b ? qadd(a, qmul(cq(d), b)) : null; }
  function stepOK(F, G, c, a, b){ return (F.f(b) - F.f(a)) + c * (G.f(b) - G.f(a)) > 0; }
  function drop(d){
    var F = LIB[d.f], G = LIB[d.g], c = cv(d), xs = TP.filter(function(x){ return okAt(F, x) && okAt(G, x); });
    for (var i = 0; i + 1 < xs.length; i++) if (!stepOK(F, G, c, xs[i], xs[i + 1])) return [xs[i], xs[i + 1]];
    return null;
  }
  function nicePair(d, fb){
    var F = LIB[d.f], G = LIB[d.g], c = cv(d), xs = []; for (var k = -16; k <= 16; k++) { var x = k / 4; if (okAt(F, x) && okAt(G, x)) xs.push(x); }
    for (var i = 0; i + 1 < xs.length; i++) if (!stepOK(F, G, c, xs[i], xs[i + 1])) return [num(xs[i], 2), num(xs[i + 1], 2)];
    var f = function(v){ return Number(v.toPrecision(3)).toString().replace("-", MINUS); }; return [f(fb[0]), f(fb[1])];
  }
  function terms(d){
    var t = {};
    function add(i, q){ var id = LIB[i].id; if (id === "c2") { id = "k"; q = qmul(q, [2, 1]); } t[id] = t[id] ? qadd(t[id], q) : q; }
    add(d.f, [1, 1]); add(d.g, cq(d)); Object.keys(t).forEach(function(k){ if (!t[k][0]) delete t[k]; }); return t;
  }
  function key(d){ var t = terms(d); return Object.keys(t).sort().map(function(k){ return k + ":" + t[k][0] + "/" + t[k][1]; }).join("|") || "0"; }
  function termSrc(id, q, first){
    var neg = q[0] < 0, a = [Math.abs(q[0]), q[1]], one = a[0] === 1 && a[1] === 1, co = a[1] === 1 ? String(a[0]) : "(" + a[0] + "/" + a[1] + ")", s;
    if (id === "k") s = qtxt(a);
    else { var F = LIB[IX[id]];
      if (one) s = F.src;
      else if (id === "rx") s = "{" + a[0] + "}/{" + (a[1] === 1 ? "" : a[1]) + "x}";
      else if (id === "rx2") s = "{" + a[0] + "}/{" + (a[1] === 1 ? "x - 2" : a[1] + "(x - 2)") + "}";
      else if (id === "e" || id === "en" || id === "c2") s = co + " · " + F.src;
      else s = co + (id === "x" || id === "x2" ? "" : " ") + F.src; }
    return (first ? (neg ? "-" : "") : (neg ? " - " : " + ")) + s;
  }
  function canon(k){
    if (k === "0") return "0";
    var ts = k.split("|").map(function(p){ var b = p.split(":"), q = b[1].split("/"); return { id:b[0], q:[+q[0], +q[1]] }; });
    ts.sort(function(x, y){ function r(t){ return [t.q[0] === 1 && t.q[1] === 1 ? 0 : t.q[0] > 0 ? 1 : 2, t.id === "k" ? 2 : t.id === "log" ? 0 : 1, t.id === "k" ? 99 : IX[t.id]]; } var a = r(x), b = r(y); return a[0] - b[0] || a[1] - b[1] || a[2] - b[2]; });
    return ts.map(function(t, i){ return termSrc(t.id, t.q, i === 0); }).join("");
  }
  function written(d){ return LIB[d.f].src + termSrc(LIB[d.g].id, cq(d), false); }
  function capSrc(d){ var w = written(d), c = canon(key(d)); return "h(x) = " + w + (c.replace(/\s/g, "") !== w.replace(/\s/g, "") ? " = " + c : ""); }
  function draw(){
    var d = read(), F = LIB[d.f], G = LIB[d.g], c = cv(d), D = dom(d.f, d.g), ink2 = css("--ink-2");
    var h = function(x){ return okAt(F, x) && okAt(G, x) ? F.f(x) + c * G.f(x) : NaN; }, cg = function(x){ return okAt(G, x) ? c * G.f(x) : NaN; };
    plot.draw({ view:EV, xTicks:{ step:1 }, yTicks:{ step:2 }, bands:exBands(plot, D, 9), points:exPts(D, 9),
      asymptotes:(d.f === IX.rx2 || d.g === IX.rx2) ? [{ x:2, label:"x = 2" }] : [],
      curves:[{ pts:samp(cg, -4.3, 4.3), color:css("--f3"), width:2.6 }, { pts:ptsOf("f" + d.f, fnOf(d.f)), color:css("--pen"), width:3 }, { pts:samp(h, -4.3, 4.3), color:css("--ink"), width:3.4 }],
      after:function(ctx, p){
        for (var x = -3.75; x < 4; x += 0.5) { var a = h(x - 0.06), b = h(x + 0.06), y = h(x); if (isFinite(a) && isFinite(b) && isFinite(y) && b < a && y > -7.5 && y < 7.5) { var X = p.X(x), Y = p.Y(y) + 10; arrowV(ctx, X, Y, Y + 13, ink2, false); } }
        ringAt(p, 1, 1, 7, css("--ink"), 2); cmath(ctx, "(1, 1)", p.X(1) + 11, p.Y(1) - 12, { size:13 });
      },
      describe:"Graph of h(x) = " + MV.plain(m(written(d))) + " (ink), with f in blue and c times g in teal. The ring marks (1, 1)." });
  }
  function update(){ $("#sd-tcap").innerHTML = m(capSrc(read())); draw(); api.update(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task;
      inp.innerHTML = '<div class="sd-tpf"></div><div class="sd-tpg"></div><div class="sd-tc"></div><p class="eq-cap sd-tcap" id="sd-tcap" aria-live="polite"></p>';
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="sd-tplot" role="img" aria-label="Preview of h"></canvas></div><div class="sd-leg" aria-hidden="true"><span><i class="sd-sw" style="background:var(--pen)"></i>' + m("f") + '</span><span><i class="sd-sw" style="background:var(--f3)"></i>' + m("c · g") + '</span><span><i class="sd-sw sd-sw-r" style="background:var(--ink)"></i>' + m("h") + "</span></div>";
      plot = new MV.Plot($("#sd-tplot"), EV); plot.render = draw;
      var d = read();
      pf = picker($(".sd-tpf", inp), { slot:"f", label:m("f(x) ="), aria:"Choose f for h", name:"f of x", value:d.f, onChange:function(i){ a.S.f = i; a.save(); update(); } });
      pg = picker($(".sd-tpg", inp), { slot:"g", label:m("g(x) ="), aria:"Choose g for h", name:"g of x", value:d.g, onChange:function(i){ a.S.g = i; a.save(); update(); } });
      cr = radios($(".sd-tc", inp), { label:m("c"), aria:"Choose c", cls:"chips", options:CQ.map(function(q, i){ return { id:i, t:m(qtxt(q)) }; }), value:d.c, onChange:function(v){ a.S.c = +v; a.save(); update(); } });
      $("#sd-tcap").innerHTML = m(capSrc(d)); draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){
        var dd = read(); if (!(l1(dd) && qeq(h1(dd), [1, 1]) && !drop(dd))) return;
        var k = key(dd), ts = MV.taskState(), seen = a.S.seen || (a.S.seen = {}), sig = dd.f + "|" + dd.g + "|" + dd.c;
        if (ts.found.indexOf(k) >= 0 && seen[k] && seen[k] !== sig) {
          var o = seen[k].split("|").map(Number), note = T.sameFn.replace("{new}", m(written(dd))).replace("{old}", m(written({ f:o[0], g:o[1], c:o[2] })));
          setTimeout(function(){ var fb = $("#task-fb .fb.good"); if (fb) fb.insertAdjacentHTML("beforeend", "<p>" + note + "</p>"); }, 0);
        }
        if (!seen[k]) seen[k] = sig; a.save();
      });
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [l1(d), qeq(h1(d), [1, 1]), !drop(d)]; },
    tips:function(d, res){
      var out = [], tp = T.tips;
      if (!res[0]) out.push(tp[0].replace("{set}", m(dsrc(dom(d.f, d.g)))));
      if (!res[1]) { var q = h1(d), F = LIB[d.f], G = LIB[d.g]; out.push(tp[1].replace("{value}", m(q ? qtxt(q) : "≈ " + num(F.f(1) + cv(d) * G.f(1), 2)))); }
      if (!res[2]) { var dr = drop(d) || [0, 0], np = nicePair(d, dr); out.push(tp[2].replace("{a}", m(np[0])).replace("{b}", m(np[1]))); }
      return out;
    },
    key:key,
    label:function(k){ return m(canon(k)); },
    text:function(k){ return MV.plain(m(canon(k))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ combine:combine },
  task:task
});
})();
