// MHF4U 27 Equivalent Trig Expressions: hero, shift-and-overlay matcher with unit-circle twin and identity board (Explore),
// cofunction triangle, pair-up board, ratio builder and "beyond acute angles" circle (Part 3), Work backwards (Practice 2),
// and the "Same wave, new name" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, MINUS = MV.MINUS, PI = Math.PI, TAU = 2 * PI, m = MV.m;
var F = { sin:Math.sin, cos:Math.cos, tan:Math.tan };
function fill(t, o){ return String(t).replace(/\{(\w+)\}/g, function(s, k){ return o[k] != null ? o[k] : s; }); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function near(a, b, e){ return Math.abs(a - b) < (e || 1e-9); }
function isInt(v){ return near(v, Math.round(v)); }
function isDark(){ var s = css("--sheet").replace("#", ""); return s.length >= 6 && parseInt(s.slice(0, 2), 16) < 128; }
function cm(s){ return String(s).replace(/-/g, MINUS); }
function upper(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// ---------- π-multiples (N3) and exact values ----------
// n/den of π as math source ("3π/2", stacked "{3π}/{2}")
function piS(n, den, st){
  den = den || 12;
  if (!isInt(n)) return (n < 0 ? "-" : "") + MV.num(Math.abs(n / den), 3) + "π";
  n = Math.round(n); if (!n) return "0";
  var g = gcd(n, den), p = Math.abs(n / g), q = den / g, top = (p === 1 ? "" : p) + "π";
  return (n < 0 ? "-" : "") + (q === 1 ? top : st ? "{" + top + "}/{" + q + "}" : top + "/" + q);
}
function piT(n, den){ return cm(piS(n, den)); }
function piSay(n, den){
  den = den || 12; if (!isInt(n)) return MV.num(n / den, 3) + " pi"; n = Math.round(n); if (!n) return "0";
  var g = gcd(n, den), p = Math.abs(n / g), q = den / g;
  return (n < 0 ? "minus " : "") + (p === 1 ? "" : p + " ") + "pi" + (q === 1 ? "" : " over " + q);
}
var EXV = [[0, "0"], [0.5, "1/2", "{1}/{2}"], [Math.SQRT1_2, "√2/2", "{√2}/{2}"], [Math.sqrt(3) / 2, "√3/2", "{√3}/{2}"], [1, "1"]];
function exS(v, st){
  var a = Math.abs(v);
  for (var i = 0; i < EXV.length; i++) if (Math.abs(a - EXV[i][0]) < 1e-9) return (v < 0 && i ? "-" : "") + ((st && EXV[i][2]) || EXV[i][1]);
  return "≈ " + (v < 0 ? "-" : "") + a.toFixed(2);
}
function ptS(t, st){ return "(" + exS(Math.cos(t), st) + ", " + exS(Math.sin(t), st) + ")"; }
// a π-multiple typed as "3/2", "−1/2", "1.5" or "3π/2" -> coefficient of π (or NaN)
function parsePi(raw){
  var s = String(raw == null ? "" : raw).trim(); if (!s) return NaN;
  var r = MV.parseNum(s); if (!r || r.length !== 1) return NaN;
  return /π|pi/i.test(s) ? r[0] / PI : r[0];
}

// ---------- shared: radio chips (arrow keys move between chips) ----------
function radioHTML(key, label, opts, cls){
  return '<span class="rchips' + (cls ? " " + cls : "") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(label)) + '" data-rg="' + key + '">' +
    opts.map(function(o){ return '<button type="button" role="radio" data-rv="' + o.v + '" data-k="' + key + o.v + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function radioSet(host, key, val, dis){
  $$('[data-rg="' + key + '"] [data-rv]', host).forEach(function(b){ var on = b.dataset.rv === String(val); b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; b.disabled = !!dis; });
}
function radioKeys(host, pick){
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest("[data-rv]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var g = b.closest("[data-rg]"), bs = $$("[data-rv]", g), i = (bs.indexOf(b) + d + bs.length) % bs.length;
    if (bs[i].disabled) return; pick(g.dataset.rg, bs[i].dataset.rv); bs[i].focus();
  });
}

// @component N23 overlayGauge — overlay match gauge: gap shading between a moving curve and a target (G6; dark mode adds a --hi edge),
// the largest vertical gap over one period (721 samples, 2 dp), the module's exact match test, and "upside-down match" detection.
// gauge(h, T, {test(h, T), period, x0, N}) -> {gap, match, opp, text}; gauge.shade(plot, h, T, alpha) inside a scene's after().
function gauge(h, T, o){
  o = o || {};
  var P = o.period || TAU, x0 = o.x0 || 0, N = o.N || 721, gap = 0, i, x, d;
  var test = o.test || function(f, g){ return [0, 1.1, 2.3, 4.1].every(function(t){ return Math.abs(f(t) - g(t)) < 1e-9; }); };
  var match = test(h, T), opp = !match && test(h, function(t){ return -T(t); });
  if (!match) for (i = 0; i < N; i++) { x = x0 + P * i / (N - 1); d = Math.abs(h(x) - T(x)); if (isFinite(d) && d > gap) gap = d; }
  return { gap:gap, match:match, opp:opp, text:match ? "0" : gap.toFixed(2) };
}
gauge.shade = function(p, h, T, alpha){
  if (!(alpha > 0)) return;
  var ctx = p.ctx, v = p.v, N = Math.max(240, Math.round(p.W)), i, x, cl = function(y){ return p.Y(Math.max(v.ymin - 1, Math.min(v.ymax + 1, y))); };
  ctx.save(); ctx.beginPath();
  for (i = 0; i <= N; i++) { x = v.xmin + (v.xmax - v.xmin) * i / N; if (i) ctx.lineTo(p.X(x), cl(h(x))); else ctx.moveTo(p.X(x), cl(h(x))); }
  for (i = N; i >= 0; i--) { x = v.xmin + (v.xmax - v.xmin) * i / N; ctx.lineTo(p.X(x), cl(T(x))); }
  ctx.closePath(); ctx.globalAlpha = alpha; ctx.fillStyle = css("--hi-soft"); ctx.fill();
  if (isDark()) { // 1 px --hi edge just outside each curve (the curves are drawn on top)
    ctx.lineWidth = 5.2; ctx.lineJoin = "round"; ctx.strokeStyle = css("--hi"); ctx.globalAlpha = 0.4 * alpha;
    [h, T].forEach(function(f){ ctx.beginPath(); for (i = 0; i <= N; i++) { x = v.xmin + (v.xmax - v.xmin) * i / N; if (i) ctx.lineTo(p.X(x), cl(f(x))); else ctx.moveTo(p.X(x), cl(f(x))); } ctx.stroke(); });
  }
  ctx.restore();
};

// @component G8 circleDraw — canvas helpers on a Plot (data units): arc between two angles with an optional arrowhead,
// text with a sheet-coloured backing, an italic-letter label ("x = π/6").
function arcAt(p, cx, cy, r, a0, a1, col, w, head, dash){
  var ctx = p.ctx, R = p.X(r) - p.X(0);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.arc(p.X(cx), p.Y(cy), R, -a0, -a1, a1 > a0); ctx.stroke(); ctx.restore();
  if (head && Math.abs(a1 - a0) > 0.05) { var s = a1 > a0 ? -1 : 1, b = a1 + s * 0.12; p.head([cx + r * Math.cos(b), cy + r * Math.sin(b)], [cx + r * Math.cos(a1), cy + r * Math.sin(a1)], col, 9); }
}
function txt(p, t, x, y, o){
  o = o || {}; var ctx = p.ctx, X = p.X(x) + (o.dx || 0), Y = p.Y(y) + (o.dy || 0);
  ctx.save(); ctx.font = o.font || ("600 14px " + p.fontM); ctx.textAlign = o.align || "center"; ctx.textBaseline = o.base || "middle";
  if (o.bg !== false) { var w = ctx.measureText(t).width, bx = ctx.textAlign === "center" ? X - w / 2 : ctx.textAlign === "right" ? X - w : X; ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(bx - 3, Y - 10, w + 6, 20); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink"); ctx.fillText(t, X, Y); ctx.restore();
}
function eqLabel(p, letter, rest, x, y, col, o){ // italic letter + upright rest, left-aligned at (x, y)
  o = o || {}; var ctx = p.ctx, X = p.X(x) + (o.dx || 0), Y = p.Y(y) + (o.dy || 0);
  ctx.save(); ctx.textBaseline = "middle"; ctx.textAlign = "left";
  ctx.font = "italic 600 14px " + p.fontM; var w1 = ctx.measureText(letter).width;
  ctx.font = "600 14px " + p.fontM; var w2 = ctx.measureText(rest).width;
  if (o.align === "center") X -= (w1 + w2) / 2; else if (o.align === "right") X -= w1 + w2;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(X - 3, Y - 10, w1 + w2 + 6, 20); ctx.globalAlpha = 1;
  ctx.fillStyle = col; ctx.font = "italic 600 14px " + p.fontM; ctx.fillText(letter, X, Y); ctx.font = "600 14px " + p.fontM; ctx.fillText(rest, X + w1, Y); ctx.restore();
}

// @component N12 unitCircle — unit circle on an equal-scale Plot (G8, G9): terminal arms (solid or long-dash) with point labels,
// a cerulean angle arc, a rotation arc with arrowhead or a dotted mirror line through the origin (optional glow), --hi coordinate
// segments with exact labels and a violet "−" badge, and an optional right triangle that fades when it can't exist.
// unitCircle(plot, {arms:[{t, color, w, dash, name, label}], arc:{t, label}, rot:{from, to}, mirror:{ang, glow}, hl:[{pt, coord:"x"|"y", label, badge}], tri:{t, alpha}, describe})
function unitCircle(p, o){
  p.draw({ view:{ xmin:-1.45, xmax:1.45, ymin:-1.45, ymax:1.45 }, equal:true, grid:false, ticks:false, describe:o.describe, after:function(ctx){
    var ink = css("--ink"), ink2 = css("--ink-2"), hi = css("--hi"), R = p.X(1) - p.X(0);
    function seg(x1, y1, x2, y2, col, w, dash, alpha){ ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(p.X(x1), p.Y(y1)); ctx.lineTo(p.X(x2), p.Y(y2)); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p.X(0), p.Y(0), R, 0, TAU); ctx.stroke(); ctx.restore();
    txt(p, "1", 1, 0, { dx:6, dy:10, align:"left", font:"12px " + p.fontUI, color:ink2, bg:false });
    if (o.mirror) { var mc = Math.cos(o.mirror.ang) * 1.42, ms = Math.sin(o.mirror.ang) * 1.42; if (o.mirror.glow) seg(-mc, -ms, mc, ms, hi, 8, null, 0.85); seg(-mc, -ms, mc, ms, ink2, 1.5, [2, 5]); }
    if (o.tri && o.tri.alpha > 0) {
      var c = Math.cos(o.tri.t), s = Math.sin(o.tri.t);
      ctx.save(); ctx.globalAlpha = o.tri.alpha; ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.X(0), p.Y(0)); ctx.lineTo(p.X(c), p.Y(0)); ctx.lineTo(p.X(c), p.Y(s)); ctx.closePath(); ctx.stroke();
      var q = 0.07 * Math.sign(c || 1), r = 0.07 * Math.sign(s || 1); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(p.X(c - q), p.Y(0)); ctx.lineTo(p.X(c - q), p.Y(r)); ctx.lineTo(p.X(c), p.Y(r)); ctx.stroke(); ctx.restore();
    }
    if (o.rot) arcAt(p, 0, 0, 0.42, o.rot.from, o.rot.to, ink2, 1.6, true);
    var placed = [];
    (o.hl || []).forEach(function(h){
      var x = Math.cos(h.t), y = Math.sin(h.t), isX = h.coord === "x";
      if (isX) seg(0, y, x, y, hi, 7); else seg(x, 0, x, y, hi, 7);
      var lx = isX ? x / 2 : x, ly = isX ? y : y * 0.62, o2 = isX ? { dx:0, dy:y >= 0 ? -14 : 14, align:"center" } : { dx:x >= 0 ? 10 : -10, dy:0, align:x >= 0 ? "left" : "right" };
      o2.font = "600 13px " + p.fontM;
      ctx.save(); ctx.font = o2.font; var w = ctx.measureText(h.label).width; ctx.restore();
      if (h.badge) { if (o2.align === "left") o2.dx += 20; else if (o2.align === "center") o2.dx += 10; }
      // keep the coordinate labels from covering each other
      var box = function(){ var X0 = p.X(lx) + o2.dx, L = (o2.align === "center" ? X0 - w / 2 : o2.align === "right" ? X0 - w : X0) - (h.badge ? 22 : 4); return [L, p.Y(ly) + o2.dy - 11, L + w + (h.badge ? 26 : 8), p.Y(ly) + o2.dy + 11]; };
      for (var tries = 0; tries < 4 && placed.some(function(r){ var b = box(); return b[0] < r[2] && r[0] < b[2] && b[1] < r[3] && r[1] < b[3]; }); tries++) o2.dy += (isX ? (y >= 0 ? -1 : 1) : (y >= 0 ? -1 : 1)) * 22;
      placed.push(box());
      if (h.badge) {
        var X0 = p.X(lx) + o2.dx, bx = (o2.align === "center" ? X0 - w / 2 : o2.align === "right" ? X0 - w : X0) - 12, by = p.Y(ly) + o2.dy;
        ctx.save(); ctx.fillStyle = css("--acol"); ctx.beginPath(); ctx.arc(bx, by, 8, 0, TAU); ctx.fill(); ctx.fillStyle = css("--sheet"); ctx.font = "700 14px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(MINUS, bx, by + 1); ctx.restore();
      }
      txt(p, h.label, lx, ly, o2);
    });
    if (o.arc) { arcAt(p, 0, 0, 0.2, 0, o.arc.t, css("--p-t"), 2.2); var am = o.arc.t / 2; txt(p, o.arc.label || "x", 0.31 * Math.cos(am), 0.31 * Math.sin(am), { color:css("--p-t"), font:"italic 600 14px " + p.fontM, bg:false }); }
    var same = o.arms && o.arms.length === 2 && Math.abs(Math.cos(o.arms[0].t) - Math.cos(o.arms[1].t)) + Math.abs(Math.sin(o.arms[0].t) - Math.sin(o.arms[1].t)) < 0.02;
    (o.arms || []).forEach(function(a, ai){
      var x = Math.cos(a.t), y = Math.sin(a.t);
      seg(0, 0, x, y, a.color, a.w || 3, a.dash);
      ctx.save(); ctx.fillStyle = a.color; ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), 5, 0, TAU); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--sheet"); ctx.stroke(); ctx.restore();
      var al = x > 0.3 ? "left" : x < -0.3 ? "right" : "center";
      var up = y >= 0 ? -1 : 1, nx = x * 1.09, ny = y * 1.09;
      if (!(same && ai === 0)) txt(p, same ? o.arms[0].name + ", " + a.name : a.name, nx, ny, { align:al, dy:al === "center" ? up * 8 : 0, font:"italic 700 15px " + p.fontM, color:a.color === ink ? ink : a.color });
      if (a.label) txt(p, a.label, nx, ny, { align:al, dy:up * (al === "center" ? 28 : 20), font:"600 13px " + p.fontM });
    });
    ctx.save(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(p.X(0), p.Y(0), 3, 0, TAU); ctx.fill(); ctx.restore();
  } });
}

// ---------- the moving graph y = a f(k(x − d)) ----------
var GV = { xmin:-TAU, xmax:TAU, ymin:-1.6, ymax:1.6 };
var TG = [["sin", 1], ["cos", 1], ["sin", -1], ["cos", -1]], TT = ["sin x", "cos x", "-sin x", "-cos x"];
var XS = [0, 2, 3, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22];
function tFn(i){ var f = F[TG[i][0]], s = TG[i][1]; return function(x){ return s * f(x); }; }
function hFn(st, d){ var f = F[st.f], a = st.a, k = st.k, dd = (d == null ? st.d : d) * PI / 12; return function(x){ return a * f(k * (x - dd)); }; }
function matchTest(h, T){ return Math.abs(h(0) - T(0)) < 1e-9 && Math.abs(h(PI / 2) - T(PI / 2)) < 1e-9; }
function negT(s){ return s.charAt(0) === "-" ? s.slice(1) : "-" + s; }
// transformation form: sin(−(x − π/2)); angle form: sin(π/2 − x)
function trForm(s, st){
  var inner = s.d === 0 ? "x" : "x " + (s.d < 0 ? "+ " + piS(-s.d, 12, st) : "- " + piS(s.d, 12, st));
  var arg = s.k === 1 ? inner : s.d === 0 ? "-x" : "-(" + inner + ")";
  return (s.a < 0 ? "-" : "") + s.f + (arg === "x" ? " x" : "(" + arg + ")");
}
function angArg(s, st){
  if (s.k === 1) return s.d === 0 ? "x" : "x " + (s.d < 0 ? "+ " + piS(-s.d, 12, st) : "- " + piS(s.d, 12, st));
  return s.d === 0 ? "-x" : piS(s.d, 12, st) + " - x";
}
function fnOf(s, st){ var g = angArg(s, st); return s.f + (g === "x" ? " x" : "(" + g + ")"); }
function angForm(s, st){ return (s.a < 0 ? "-" : "") + fnOf(s, st); }
function rowOf(s){ return (s.f === "sin" ? 0 : 2) + (s.k === 1 ? 0 : 1); }
function cNorm(s){ var c = s.k === 1 ? -s.d : s.d; return ((Math.round(c) % 24) + 24) % 24; }
function formC(f, k, c, st){ if (k === 1) return f + (c === 0 ? " x" : "(x " + (c < 0 ? "- " + piS(-c, 12, st) : "+ " + piS(c, 12, st)) + ")"); return f + "(" + (c === 0 ? "-x" : piS(c, 12, st) + " - x") + ")"; }
function samplePts(h, map){ var out = [], N = 700, a = -TAU - 0.2, b = TAU + 0.2; for (var i = 0; i <= N; i++) { var x = a + (b - a) * i / N; out.push(map(x, h(x))); } return out; }

// ---------- hero: sine slides onto cosine, flips, slides back (storyboard in the plan) ----------
function hero(f){
  var p = new MV.Plot(f.canvas, GV), caps = (MV.C.hero.fig || {}).caps || [], u = $("#hero-u");
  var st = { rc:0, rs:0, sh:0, s:1, arrow:null, cap:-1 };
  function cap(i){ st.cap = i; f.cap.innerHTML = caps[i] || ""; if (i >= 2 && u) u.classList.add("on"); }
  p.render = function(){
    var pen = css("--pen"), teal = css("--p-d"), narrow = p.c.getBoundingClientRect().width < 420;
    p.draw({ view:GV, xTicks:{ step:narrow ? PI : PI / 2, pi:true }, yTicks:{ step:1 },
      describe:"Graph of y = cos x (dashed) and y = sin x. Sliding sine left by pi over 2, or flipping it in the y-axis and sliding it right by pi over 2, lands it on cosine.",
      after:function(ctx){
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, p.W * st.rc, p.H); ctx.clip(); p.curve({ f:Math.cos, color:css("--ink-2"), width:2.4, dash:[6, 6] }); ctx.restore();
        if (st.rs > 0) {
          ctx.save(); ctx.beginPath(); ctx.rect(0, 0, p.W * st.rs, p.H); ctx.clip();
          p.curve({ pts:samplePts(Math.sin, function(x, y){ return [st.s * x + st.sh, y]; }), color:pen, width:3 }); ctx.restore();
        }
        if (st.arrow) { p.segment({ x1:st.arrow[0], y1:1, x2:st.arrow[1], y2:1, color:teal, width:2.5, arrow:true }); txt(p, "π/2", (st.arrow[0] + st.arrow[1]) / 2, 1, { dy:-15, color:teal }); }
      } });
  };
  if (MV.reduceMotion) { st = { rc:1, rs:1, sh:PI / 2, s:-1, arrow:null }; cap(3); p.render(); return; }
  p.render();
  var tw = function(dur, fn, done){ MV.tween({ dur:dur, step:function(t){ fn(t); p.render(); }, done:done }); };
  var lin = function(t){ return t; };
  MV.tween({ dur:800, ease:lin, step:function(t){ st.rc = t; p.render(); }, done:function(){
    MV.tween({ dur:1200, ease:lin, step:function(t){ st.rs = t; p.render(); }, done:function(){
      MV.wait(400, function(){
        st.arrow = [PI / 2, 0]; cap(0); p.render();
        tw(1500, function(t){ st.sh = -PI / 2 * t; }, function(){
          MV.wait(1300, function(){
            st.arrow = null;
            tw(700, function(t){ st.sh = -PI / 2 * (1 - t); }, function(){
              cap(1);
              tw(800, function(t){ st.s = 1 - 2 * t; }, function(){
                MV.wait(1300, function(){
                  st.arrow = [-PI / 2, 0]; cap(2); p.render();
                  tw(1500, function(t){ st.sh = PI / 2 * t; }, function(){ MV.wait(1400, function(){ st.arrow = null; cap(3); p.render(); }); });
                });
              });
            });
          });
        });
      });
    } });
  } });
}

// ---------- Explore: shift-and-overlay matcher ----------
function explore(host, api){
  var C = api.content, U = C.ui, S = api.S, CH = C.challenges;
  if (!S.f) { S.f = "sin"; S.a = 1; S.k = 1; S.d = 0; S.t = 1; S.xi = 1; }
  S.board = S.board || {}; S.tc3 = S.tc3 || { v:"", unl:false }; S.view = S.view || "graph";
  var V = { d:S.d, x:XS[S.xi] * PI / 12, anim:null, thick:false, gapA:1, glowA:false, glowK:false, mirGlow:false, sweep:false, busy:false, was:null, stop:null, swipe:null };
  var TCH = [{ v:"0", t:m("y = sin x") }, { v:"1", t:m("y = cos x") }, { v:"2", t:m("y = -sin x") }, { v:"3", t:m("y = -cos x") }];
  host.innerHTML = '<div class="eqx"><div class="eqx-top" data-mv="graph"><div class="eq-cap" id="eq-cap"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="seg-wrap eqx-seg"><span class="seg" role="group" aria-label="View">' + U.views.map(function(t, i){ return '<button type="button" data-pv="' + (i ? "circle" : "graph") + '" data-k="pv' + i + '">' + t + "</button>"; }).join("") + "</span></div>" +
    '<div class="eqx-views" id="eq-views"><div class="eqx-g"><div class="plot-wrap"><canvas class="plot" id="eq-g" role="img" tabindex="0" aria-label="Graph"></canvas></div><p class="tiny muted eqx-bridge">' + C.bridge + "</p></div>" +
    '<div class="eqx-c"><div class="plot-wrap"><canvas class="plot square" id="eq-c" role="img" tabindex="0" aria-label="Unit circle"></canvas></div>' +
    '<div class="stepper"><span class="ctl-lab">' + U.sample + '</span><button type="button" class="btn ghost sqb" data-act="xm" data-k="xm" aria-label="Previous sample angle">' + MINUS + '</button><output id="eq-x" aria-live="polite"></output><button type="button" class="btn ghost sqb" data-act="xp" data-k="xp" aria-label="Next sample angle">+</button><button type="button" class="btn ghost sm" data-act="sweep" data-k="sweep">' + U.sweep + "</button></div></div></div></div>" +
    '<div class="eqx-mid"><div class="eqx-ctrl">' +
    '<div class="ctl-row"><span class="ctl-lab">' + U.fn + "</span>" + radioHTML("f", U.fn, [{ v:"sin", t:m("sin") }, { v:"cos", t:m("cos") }]) + "</div>" +
    '<div class="ctl-row"><button type="button" class="tog tog-a" data-tog="a" data-k="toga" aria-pressed="false">' + U.flipA + '</button><button type="button" class="tog tog-k" data-tog="k" data-k="togk" aria-pressed="false">' + U.flipK + "</button></div>" +
    '<div class="ctl-slide"><div class="slider-top"><label for="eq-d">' + U.slide + '</label><output id="eq-dout" class="p-d"></output></div><div class="sl-row"><button type="button" class="btn ghost sqb" data-act="dm" data-k="dm" aria-label="Slide left by pi over 12">' + MINUS + '</button><input type="range" id="eq-d" min="-24" max="24" step="1" value="0"><button type="button" class="btn ghost sqb" data-act="dp" data-k="dp" aria-label="Slide right by pi over 12">+</button></div><p class="tiny muted" id="eq-dnote" aria-live="polite"></p></div>' +
    '<div class="ctl-row"><span class="ctl-lab">' + U.target + "</span>" + radioHTML("t", U.target, TCH, "tgt") + "</div>" +
    '<div class="lockbar" id="eq-lock" hidden><span></span><button type="button" class="btn ghost sm" data-act="unlock" data-k="unlock"></button></div>' +
    '<div class="ctl-row"><button type="button" class="btn ghost sm" data-act="reset" data-k="reset">' + U.reset + "</button></div></div>" +
    '<div class="eqx-read"><dl class="read" id="eq-read" aria-live="polite"></dl></div></div>' +
    '<div class="eqx-board"><h3>' + U.board + '</h3><p class="tiny muted">' + U.boardIntro + '</p><div class="tbl-wrap bd-wrap"><table class="bd" id="eq-bd"></table></div><p id="eq-bdn" aria-live="polite"></p></div></div>';
  var gp = new MV.Plot($("#eq-g", host), GV), cp = new MV.Plot($("#eq-c", host), { xmin:-1.45, xmax:1.45, ymin:-1.45, ymax:1.45 });
  var slider = $("#eq-d", host);

  function slideLocked(){ return S.open === "tc3" && !S.tc3.unl; }
  function curGauge(){ return gauge(hFn(S), tFn(S.t), { test:matchTest }); }
  // ----- drawing -----
  gp.render = function(){
    var narrow = gp.c.getBoundingClientRect().width < 470, T = tFn(S.t), dd = V.d * PI / 12, h = hFn(S, V.d), an = V.anim, pen = css("--pen");
    var mv = an && an.type === "a" ? { pts:samplePts(an.h0, function(x, y){ return [x, an.s * y]; }) } : an && an.type === "k" ? { pts:samplePts(an.h0, function(x, y){ return [dd + an.s * (x - dd), y]; }) } : { f:h };
    var g = curGauge();
    gp.draw({ view:GV, xTicks:{ step:narrow ? PI : PI / 2, pi:true }, yTicks:{ step:1 },
      describe:"Graph of y = " + MV.plain(m(angForm(S))) + " and the target y = " + cm(TT[S.t]) + ". " + (g.match ? "They match at every x." : "Largest gap " + g.text + ".") + " Arrow keys slide the graph.",
      after:function(ctx, p){
        if (!an) gauge.shade(p, h, T, V.gapA);
        p.curve({ f:T, color:css("--ink-2"), width:2.4, dash:[6, 6] });
        mv.color = pen; mv.width = V.thick ? 3.4 : 3; p.curve(mv);
        if (!an && Math.abs(V.d) > 0.02) {
          var x0 = S.f === "sin" ? S.k * PI / 2 : 0, y0 = S.a, teal = css("--p-d"), dn = Math.round(V.d);
          p.segment({ x1:x0, y1:y0, x2:x0 + dd, y2:y0, color:teal, width:2.5, arrow:Math.abs(dd) > 0.2 });
          if (dn) txt(p, (dn < 0 ? "← " : "→ ") + piT(Math.abs(dn)), x0 + dd / 2, y0, { dy:y0 > 0 ? -15 : 15, color:teal });
        }
        var ox = p.X(0), oy = p.Y(0);
        function tick(x1, y1, x2, y2, col, glow, lab, lx, ly){
          if (glow) { ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
          ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.fillStyle = col; ctx.font = "italic 700 13px " + p.fontM; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(lab, lx, ly); ctx.restore();
        }
        if (S.a < 0 || V.glowA) { var ca = css("--acol"); [14, p.W - 14].forEach(function(X){ tick(X, oy - 11, X, oy + 11, ca, V.glowA, "a", X, oy - 20); }); }
        if (S.k < 0 || V.glowK) { var ck = css("--p-k"); [14, p.H - 14].forEach(function(Y, i){ tick(ox - 11, Y, ox + 11, Y, ck, V.glowK, "k", ox + 20, Y + (i ? -2 : 2)); }); }
        var xs = V.x, tcol = css("--p-t");
        p.segment({ x1:xs, y1:GV.ymin, x2:xs, y2:GV.ymax, color:css("--ink-2"), width:1.4, dash:[2, 4] });
        if (V.sweep) eqLabel(p, "x", "", xs, 1.42, tcol, { align:"center" });
        else eqLabel(p, "x", " = " + piT(XS[S.xi]), xs, 1.42, tcol, { dx:xs > 4.5 ? -6 : 6, align:xs > 4.5 ? "right" : "left" });
        p.point({ x:xs, y:T(xs), r:4.5, color:css("--ink-2") });
        if (!an) p.point({ x:xs, y:h(xs), r:5, color:pen });
      } });
  };
  cp.render = function(){
    var xr = V.x, dd = V.d * PI / 12, q = S.k * (xr - dd), an = V.anim;
    if (an && an.type === "k") q = an.q0 + (an.q1 - an.q0) * (1 - an.s) / 2;
    var tg = TG[S.t], qn = S.k * (XS[S.xi] - V.d), exact = !V.sweep && isInt(V.d) && !an;
    var lab = angArg(S) === "x" ? "" : cm(angArg(S)) + (exact ? " = " + piT(qn) : "");
    var hl = [{ t:xr, coord:tg[0] === "cos" ? "x" : "y", label:cm(exS(tg[0] === "cos" ? Math.cos(xr) : Math.sin(xr))) },
      { t:q, coord:S.f === "cos" ? "x" : "y", label:cm(exS(S.f === "cos" ? Math.cos(q) : Math.sin(q))), badge:S.a < 0 }];
    var o = { arms:[{ t:xr, color:css("--pen"), w:3, name:"P" }, { t:q, color:css("--ink"), w:2.5, dash:[10, 6], name:"Q", label:lab }], arc:{ t:((xr % TAU) + TAU) % TAU }, hl:hl };
    var mvTxt;
    if (S.k === 1) { var dn = Math.round(S.d); if (dd && Math.abs(Math.abs(dd) - TAU) > 1e-6) o.rot = { from:xr, to:xr - dd }; mvTxt = dn === 0 || Math.abs(dn) === 24 ? "no move" : "rotated by " + piT(Math.abs(dn)) + (dn < 0 ? " counterclockwise" : " clockwise"); }
    else { o.mirror = { ang:dd / 2, glow:V.mirGlow }; mvTxt = "reflected in the line through the origin at angle " + piT(S.d, 24); }
    o.describe = "Unit circle. P at " + (V.sweep ? "a moving angle" : piT(XS[S.xi])) + ", Q at " + (exact ? piT(qn) : "the moved angle") + ", " + mvTxt + ". Arrow keys step the sample angle.";
    unitCircle(cp, o);
  };
  function draw(){ gp.render(); cp.render(); }

  // ----- readout, controls, board -----
  function cmpLine(onQ, fn, coord, neg, val){ return fill(onQ ? (neg ? U.cmpQneg : U.cmpQ) : (neg ? U.cmpPneg : U.cmpP), { fn:m(fn), c:m(coord), v:m(exS(val, true)) }); }
  function moveText(){
    var d = Math.round(S.d);
    if (S.k === 1) { if (d === 0 || Math.abs(d) === 24) return U.still; if (Math.abs(d) === 12) return U.half; return fill(U.rot, { d:m(piS(Math.abs(d), 12, true)), dir:d < 0 ? "counterclockwise" : "clockwise" }); }
    var nm = { "0":"x", "24":"x", "-24":"x", "12":"y", "-12":"y", "6":"yx", "-18":"yx", "-6":"ynx", "18":"ynx" }[String(d)];
    return isInt(S.d) && nm ? fill(U.reflNamed, { line:U.lines[nm] }) : fill(U.refl, { h:m(piS(S.d, 24, true)) });
  }
  function paintRead(g){
    var xn = XS[S.xi], xr = xn * PI / 12, qn = S.k * (xn - S.d), qr = qn * PI / 12, tg = TG[S.t];
    var status = g.match ? fill(U.match, { eq:m(angForm(S, true) + " = " + TT[S.t]) }) : g.opp ? fill(U.opp, { eq:m(angForm(S, true) + " = " + negT(TT[S.t])) }) : U.none;
    if (g.match && S.a < 0) status += '<br><span class="tiny">' + U.aNote + "</span>";
    if (g.match && S.a > 0 && isInt(S.d)) { var c = S.k === 1 ? -Math.round(S.d) : Math.round(S.d), cn = cNorm(S); if (c !== cn) status += '<br><span class="tiny">' + fill(U.wrapNote, { a:m(formC(S.f, S.k, c)), b:m(formC(S.f, S.k, cn)) }) + "</span>"; }
    var mvV = S.a * F[S.f](qr), tV = tg[1] * F[tg[0]](xr);
    var cmp = cmpLine(true, angForm(S), S.f === "sin" ? "y" : "x", S.a < 0, mvV) + " " + cmpLine(false, TT[S.t], tg[0] === "sin" ? "y" : "x", tg[1] < 0, tV) + " " + (near(mvV, tV) ? U.equal : U.unequal);
    $("#eq-read", host).innerHTML = MV.readoutHTML([
      [U.read[0], m("y = " + trForm(S, true))], [U.read[1], m("y = " + angForm(S, true))], [U.read[2], m("y = " + TT[S.t])],
      [U.read[3], g.match ? U.gap0 : g.text], [U.read[4], '<span class="' + (g.match ? "st-good" : "") + '">' + status + "</span>"],
      [U.read[5], fill(U.circle, { x:m(piS(xn, 12, true)), P:m(ptS(xr, true)), ang:m(angArg(S, true)), v:m(piS(qn, 12, true)), Q:m(ptS(qr, true)) })],
      [U.read[6], moveText()], [U.read[7], cmp]]);
    $("#eq-cap", host).innerHTML = m("y = " + angForm(S, true));
  }
  function paintCtl(){
    var b = V.busy;
    radioSet(host, "f", S.f, b); radioSet(host, "t", S.t, b || !!S.lock);
    $$("[data-tog]", host).forEach(function(t){ t.setAttribute("aria-pressed", S[t.dataset.tog] < 0); t.disabled = b; });
    var lk = slideLocked(); slider.value = Math.round(S.d); slider.disabled = b || lk; slider.setAttribute("aria-valuetext", "d = " + piSay(Math.round(S.d)));
    $("#eq-dout", host).innerHTML = m("@d{d} = " + piS(Math.round(S.d)));
    $$('[data-act="dm"], [data-act="dp"]', host).forEach(function(x){ x.disabled = b || lk; });
    $("#eq-dnote", host).innerHTML = lk ? U.tc3lock : "";
    $$('[data-act="xm"], [data-act="xp"], [data-act="sweep"], [data-act="reset"]', host).forEach(function(x){ x.disabled = b || V.sweep; });
    $("#eq-x", host).innerHTML = m("x = " + piS(XS[S.xi]));
    var lb = $("#eq-lock", host);
    if (S.lock) { var isC = S.lock.by.charAt(0) === "t"; lb.hidden = false; $("span", lb).innerHTML = fill(isC ? U.lockC : U.lockP, { n:S.lock.by.slice(-1) }); var ub = $("button", lb); ub.textContent = MV.plain(isC ? U.unlockC : U.unlockP); ub.disabled = b; }
    else lb.hidden = true;
    $("#eq-views", host).dataset.show = S.view;
    $$("[data-pv]", host).forEach(function(x){ x.setAttribute("aria-pressed", x.dataset.pv === S.view); });
  }
  function paintBoard(){
    var sayR = ["sine of x plus c", "sine of c minus x", "cosine of x plus c", "cosine of c minus x"], sayC = ["sine x", "cosine x", "negative sine x", "negative cosine x"];
    var n = 0, h = '<thead><tr><th scope="col"><span class="vh">Form</span></th>' + U.cols.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>";
    U.rows.forEach(function(r, ri){
      h += '<tr><th scope="row">' + r + "</th>";
      for (var ci = 0; ci < 4; ci++) {
        var key = ri + "-" + ci, c = S.board[key]; if (c != null) n++;
        h += '<td><button type="button" class="bd-c' + (c != null ? " found" : "") + (V.swipe === key ? " swipe" : "") + '" data-cell="' + key + '" data-k="bd' + key + '" aria-label="' + sayR[ri] + " equals " + sayC[ci] + (c != null ? ": c = " + piSay(c) : ": not found yet") + '">' + (c != null ? m("c = " + piS(c, 12, true)) : '<span class="muted" aria-hidden="true">?</span>') + "</button></td>";
      }
      h += "</tr>";
    });
    MV.keepFocus($("#eq-bd", host), function(){ $("#eq-bd", host).innerHTML = h + "</tbody>"; });
    $("#eq-bdn", host).innerHTML = "<strong>" + fill(U.found, { n:n }) + "</strong>" + (n >= 8 ? '<br><span class="tiny">' + U.eight + "</span>" : "");
    V.swipe = null;
  }
  // after every change: board, match animation, readout
  function settle(){
    var g = curGauge();
    if (g.match && S.a === 1 && isInt(S.d)) { var key = rowOf(S) + "-" + S.t; if (S.board[key] == null) { S.board[key] = cNorm(S); V.swipe = key; api.save(); } }
    if (V.was === null) V.gapA = g.match ? 0 : 1;
    else if (g.match && !V.was) {
      V.thick = true;
      MV.tween({ dur:400, step:function(t){ V.gapA = 1 - t; gp.render(); }, done:function(){ V.gapA = 0; gp.render(); } });
      MV.wait(600, function(){ V.thick = false; gp.render(); });
    } else if (!g.match) V.gapA = 1;
    V.was = g.match;
    paintRead(g); paintBoard(); paintCtl(); draw();
  }
  function changed(){ api.save(); settle(); MV.changed(); }
  function finishAnim(){ if (V.stop) { var s = V.stop; V.stop = null; s(); } }
  function setD(n){ if (slideLocked()) return; finishAnim(); S.d = Math.max(-24, Math.min(24, Math.round(n))); V.d = S.d; changed(); }
  function glide(to, done){
    var from = V.d, cancel = null; S.d = to;
    V.stop = function(){ if (cancel) cancel(); V.d = to; V.stop = null; };
    cancel = MV.tween({ dur:1500, step:function(t){ V.d = from + (to - from) * t; draw(); }, done:function(){ V.d = to; V.stop = null; if (done) done(); } });
  }
  function flip(which, done){
    finishAnim();
    var h0 = hFn(S, V.d), xr = V.x, dd = V.d * PI / 12, q0 = S.k * (xr - dd);
    S[which] = -S[which];
    V.anim = { type:which, h0:h0, s:1, q0:q0, q1:S.k * (xr - dd) }; V[which === "a" ? "glowA" : "glowK"] = true;
    var end = function(){ V.anim = null; V.glowA = V.glowK = false; V.stop = null; }, cancel = null;
    api.save(); paintCtl();
    V.stop = function(){ if (cancel) cancel(); end(); };
    cancel = MV.tween({ dur:800, step:function(t){ if (V.anim) V.anim.s = 1 - 2 * t; draw(); }, done:function(){ end(); changed(); if (done) done(); } });
  }
  function sweep(done){
    finishAnim(); V.sweep = true; paintCtl();
    MV.tween({ dur:6000, ease:function(t){ return t; }, step:function(t){ V.x = TAU * t; draw(); }, done:function(){ V.sweep = false; V.x = XS[S.xi] * PI / 12; settle(); if (done) done(); } });
  }
  function stepX(dir){ S.xi = (S.xi + dir + XS.length) % XS.length; V.x = XS[S.xi] * PI / 12; changed(); }
  function setT(i){ if (S.lock) return; S.t = +i; changed(); }
  function setF(v){ finishAnim(); S.f = v; changed(); }

  // ----- locks: predictions and challenges set the target -----
  function chal(id){ return CH.filter(function(c){ return c.id === id; })[0]; }
  function openChal(id){
    if (S.open === id || V.busy) return;
    var st = MV.S.chal[id]; if (st && st.solved) return;
    finishAnim(); S.open = id; S.lock = { by:id }; S.t = chal(id).t;
    if (id === "tc3" && !S.tc3.unl) { S.d = 0; V.d = 0; }
    changed();
  }
  function unlock(){ S.open = null; S.lock = null; changed(); }
  function reset(){ finishAnim(); S.f = "sin"; S.a = 1; S.k = 1; S.d = 0; S.t = 1; S.xi = 1; S.lock = null; S.open = null; V.d = 0; V.x = XS[1] * PI / 12; MV.banner("", ""); changed(); }

  // ----- events -----
  radioKeys(host, function(g, v){ if (V.busy) return; if (g === "f") setF(v); else setT(v); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || V.busy) return;
    if (b.dataset.rv != null) { var g = b.closest("[data-rg]").dataset.rg; if (g === "f") setF(b.dataset.rv); else setT(b.dataset.rv); return; }
    if (b.dataset.tog) { flip(b.dataset.tog); return; }
    if (b.dataset.pv) { S.view = b.dataset.pv; api.save(); paintCtl(); draw(); return; }
    if (b.dataset.cell) {
      var rc = b.dataset.cell.split("-"), r = +rc[0], c = S.board[b.dataset.cell];
      finishAnim(); S.f = r < 2 ? "sin" : "cos"; S.k = r % 2 ? -1 : 1; S.a = 1;
      if (!S.lock) S.t = +rc[1];
      if (c != null && !slideLocked()) { S.d = S.k === 1 ? -c : c; V.d = S.d; }
      changed(); return;
    }
    var a = b.dataset.act;
    if (a === "dm") setD(S.d - 1); else if (a === "dp") setD(S.d + 1);
    else if (a === "xm") stepX(-1); else if (a === "xp") stepX(1);
    else if (a === "sweep") sweep(); else if (a === "reset") reset(); else if (a === "unlock") unlock();
  });
  slider.addEventListener("input", function(){ setD(+slider.value); });
  slider.addEventListener("keydown", function(e){
    var big = (e.shiftKey && (e.key === "ArrowRight" || e.key === "ArrowUp")) || e.key === "PageUp" ? 6 : (e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowDown")) || e.key === "PageDown" ? -6 : 0;
    if (big) { e.preventDefault(); setD(S.d + big); } else if (e.key === "Home") { e.preventDefault(); setD(-24); } else if (e.key === "End") { e.preventDefault(); setD(24); }
  });
  gp.c.addEventListener("keydown", function(e){
    if (V.busy || slideLocked()) return;
    var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0; if (!d) return;
    e.preventDefault(); setD(S.d + d * (e.shiftKey ? 6 : 1));
  });
  cp.c.addEventListener("keydown", function(e){
    if (V.busy || V.sweep) return;
    var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0; if (!d) return;
    e.preventDefault(); stepX(d);
  });
  // a challenge opens when you work in it; TC3's commit box lives in its prompt
  var chalHost = $("#chal");
  if (chalHost) {
    ["focusin", "pointerdown"].forEach(function(ev){ chalHost.addEventListener(ev, function(e){ var box = e.target.closest && e.target.closest("[data-c]"); if (box) openChal(box.dataset.c); }); });
    chalHost.addEventListener("input", function(e){ if (e.target.id === "tc3-d") { S.tc3.v = e.target.value; api.save(); } });
    chalHost.addEventListener("keydown", function(e){ if (e.target.id === "tc3-d" && e.key === "Enter") { var b = $('[data-c="tc3"] [data-act="check"]'); if (b) b.click(); } });
    var restore = function(){ var inp = $("#tc3-d"); if (!inp) return; var st = MV.S.chal.tc3; if (inp.value !== S.tc3.v && document.activeElement !== inp) inp.value = S.tc3.v; inp.disabled = !!(st && st.solved); };
    new MutationObserver(restore).observe(chalHost, { childList:true, subtree:true });
    restore();
  }

  // ----- predictions -----
  function pStart(p){
    finishAnim(); var s = p.start;
    S.f = s.f; S.a = s.a; S.k = s.k; S.d = s.d; S.t = s.t; S.xi = 1; S.open = null; S.lock = { by:p.id };
    V.d = s.d; V.x = XS[1] * PI / 12; V.was = null; V.busy = true;
    if (window.matchMedia && window.matchMedia("(max-width:820px)").matches) S.view = p.id === "p3" ? "circle" : "graph";
    api.save(); settle();
  }
  function pRun(p, done){
    var end = function(){ V.busy = false; V.mirGlow = false; changed(); done(); };
    if (p.id === "p1" || p.id === "p4") glide(-6, function(){
      settle();
      if (p.id === "p1") end();
      else MV.wait(1400, function(){ S.t = 2; settle(); MV.wait(500, end); });
    });
    else if (p.id === "p2") flip("k", function(){ MV.wait(300, end); });
    else if (p.id === "p3") { V.mirGlow = true; sweep(end); }
    else end();
  }

  // ----- challenges -----
  function named(d, M){
    var n = Math.round(d); if (!isInt(d)) return M.other;
    return M[{ "0":"whole", "24":"whole", "-24":"whole", "12":"half", "-12":"half" }[String(n)] || ""] || null;
  }
  function tc3Check(c){
    var M = c.msgs, uncounted = function(msg){ Promise.resolve().then(function(){ var st = MV.S.chal.tc3; if (st && st.tries > 0) { st.tries--; MV.save(); } }); return { ok:false, msg:msg }; };
    var coef = parsePi(S.tc3.v);
    if (isNaN(coef)) return uncounted(U.tc3empty);
    if (S.f !== "sin" || S.a !== -1 || S.k !== -1) return uncounted(U.tc3setup);
    if (Math.abs(coef) > 2 + 1e-9) return uncounted(M.range);
    var d = coef * 12, ok = matchTest(hFn({ f:"sin", a:-1, k:-1 }, d), tFn(1));
    S.tc3.unl = true; V.busy = true; paintCtl();
    glide(d, function(){ V.busy = false; changed(); if (ok) MV.wait(900, unlock); });
    if (ok) return { ok:true };
    var n = Math.round(d);
    return { ok:false, msg:!isInt(d) ? M.other : (n === 6 || n === -18) ? M.upside : named(d, M) || M.other };
  }
  function challenge(id, opt){
    var live = opt && opt.live, c = chal(id), M = c.msgs;
    if (!live) openChal(id);
    if (id === "tc3") return live ? { ok:false } : tc3Check(c);
    var want = id === "tc1" ? { f:"sin", k:1 } : { f:"cos", k:-1 };
    if (S.a !== 1 || S.k !== want.k) return { ok:false, msg:M.flip };
    if (S.f !== want.f) return { ok:false, msg:M.fn };
    if (matchTest(hFn(S), tFn(c.t))) { if (!live) MV.wait(900, function(){ if (S.open === id) unlock(); }); return { ok:true }; }
    var n = Math.round(S.d);
    if (id === "tc1" && (n === 6 || n === -18)) return { ok:false, msg:M.upside };
    if (id === "tc2" && (n === -6 || n === 18)) return { ok:false, msg:M.upside };
    return { ok:false, msg:named(S.d, M) || M.other };
  }
  boardCount = function(){ return Object.keys(S.board).length; };
  V.was = null; settle();
  return { predict:{ start:pStart, run:pRun }, challenge:challenge };
}
var boardCount = function(){ return 0; };

// ---------- Part 3: cofunction pairs from a right triangle ----------
var CO6 = { sin:"cos", cos:"sin", tan:"cot", cot:"tan", sec:"csc", csc:"sec" }, FNS = ["sin", "cos", "tan", "csc", "sec", "cot"];
var NAME6 = { sin:"sine", cos:"cosine", tan:"tangent", csc:"cosecant", sec:"secant", cot:"cotangent" };
var SIDES = { sin:["BC", "AB"], cos:["AC", "AB"], tan:["BC", "AC"], csc:["AB", "BC"], sec:["AB", "AC"], cot:["AC", "BC"] };
var ROLE = { sin:"opp/hyp", cos:"adj/hyp", tan:"opp/adj", csc:"hyp/opp", sec:"hyp/adj", cot:"adj/opp" };
var TRIS = [
  { BC:8, AC:15, AB:17, L:{ BC:"8", AC:"15", AB:"17" }, v:{ sin:"8/17", cos:"15/17", tan:"8/15", csc:"17/8", sec:"17/15", cot:"15/8" } },
  { BC:7, AC:24, AB:25, L:{ BC:"7", AC:"24", AB:"25" }, v:{ sin:"7/25", cos:"24/25", tan:"7/24", csc:"25/7", sec:"25/24", cot:"24/7" } },
  { BC:1, AC:Math.sqrt(3), AB:2, L:{ BC:"1", AC:"√3", AB:"2" }, v:{ sin:"1/2", cos:"√3/2", tan:"√3/3", csc:"2", sec:"2√3/3", cot:"√3" } },
  { BC:1, AC:1, AB:Math.SQRT2, L:{ BC:"1", AC:"1", AB:"√2" }, v:{ sin:"√2/2", cos:"√2/2", tan:"1", csc:"√2", sec:"√2", cot:"1" } }];
var LET = { BC:"p", AC:"q", AB:"r" }, CHIPS = ["p/r", "q/r", "p/q", "q/p", "r/p", "r/q"], CHIPN = { "p/r":"sin x", "q/r":"cos x", "p/q":"tan x", "q/p":"cot x", "r/p":"csc x", "r/q":"sec x" };
function swapB(s){ return s === "BC" ? "AC" : s === "AC" ? "BC" : s; }
function part3(host, api){
  var C = api.content, U = C.ui, S = api.S, PAIR = MV.ans(C.pairs), BUILD = MV.ans(C.build);
  S.tri = S.tri || 0; S.at = S.at || "A"; S.lab = S.lab || "num"; S.pairs = S.pairs || { done:{}, tries:{} }; S.build = S.build || {}; S.xi = S.xi == null ? 1 : S.xi;
  var V = { eye:S.at === "B" ? 1 : 0, glow:null, sel:null, msg:null, bmsg:{}, swapped:false };
  host.innerHTML = '<div class="cf"><div class="cf-tri"><div class="chips" id="cf-tris" role="group" aria-label="Triangle"></div>' +
    '<div class="plot-wrap"><canvas class="plot" id="cf-t" role="img" aria-label="Right triangle"></canvas></div><p class="tiny muted" style="margin:6px 0 0">' + U.caption + "</p>" +
    '<div id="cf-stand"></div><div id="cf-labs"></div><div id="cf-tbl" aria-live="polite"></div></div>' +
    '<div class="cf-boards"><h3>' + U.r1 + '</h3><p class="how">' + U.r1how + '</p><div id="cf-pairs"></div>' +
    '<h3 style="margin-top:22px">' + U.r2 + '</h3><p class="how">' + U.r2how + '</p><div id="cf-build"></div><details class="alg"><summary>Check it with algebra</summary><p style="margin:10px 0 0">' + U.alg + "</p></details></div></div>" +
    '<div class="part"><h3>' + U.beyond + "</h3><p>" + U.beyondIntro + '</p><div class="sym"><div><div class="plot-wrap"><canvas class="plot square" id="cf-c" role="img" tabindex="0" aria-label="Unit circle"></canvas></div>' +
    '<div class="stepper"><button type="button" class="btn ghost sqb" data-act="cxm" data-k="cxm" aria-label="Previous angle">' + MINUS + '</button><output id="cf-x"></output><button type="button" class="btn ghost sqb" data-act="cxp" data-k="cxp" aria-label="Next angle">+</button></div></div>' +
    '<div><p class="cf-fade muted" id="cf-fade" aria-live="polite"></p><p id="cf-read" aria-live="polite"></p><p class="tiny" style="margin-top:12px"><strong>' + U.closing + "</strong></p></div></div></div>";
  var tp = new MV.Plot($("#cf-t", host), { xmin:-0.3, xmax:1.3, ymin:-0.3, ymax:0.9 }), up = new MV.Plot($("#cf-c", host), { xmin:-1.45, xmax:1.45, ymin:-1.45, ymax:1.45 });
  var stand = MV.seg($("#cf-stand", host), { label:U.corner, options:[{ id:"A", t:U.stand[0] }, { id:"B", t:U.stand[1] }], value:S.at, onChange:function(v){ setCorner(v); } });
  var labs = MV.seg($("#cf-labs", host), { label:U.sideLab, options:[{ id:"num", t:U.sides[0] }, { id:"let", t:U.sides[1] }], value:S.lab, onChange:function(v){ S.lab = v; api.save(); tp.render(); } });
  function T(){ return TRIS[S.tri]; }
  // ----- triangle drawing -----
  tp.render = function(){
    var t = T(), k = t.BC / t.AC, A = [0, 0], Cc = [1, 0], B = [1, k], ink = css("--ink"), ink2 = css("--ink-2"), hi = css("--hi");
    var view = { xmin:-0.3, xmax:1.5, ymin:-0.36, ymax:Math.max(k, 0.55) + 0.2 };
    tp.draw({ view:view, equal:true, grid:false, axes:false, ticks:false,
      describe:"Right triangle ABC with the right angle at C. BC = " + t.L.BC + ", AC = " + t.L.AC + ", AB = " + t.L.AB + ". Standing at " + S.at + ": opposite is " + (S.at === "A" ? "BC" : "AC") + " and adjacent is " + (S.at === "A" ? "AC" : "BC") + ".",
      after:function(ctx, p){
        var P = { A:A, B:B, C:Cc };
        function side(s){ return [P[s.charAt(0)], P[s.charAt(1)]]; }
        (V.glow || []).forEach(function(s){ var q = side(s); p.segment({ x1:q[0][0], y1:q[0][1], x2:q[1][0], y2:q[1][1], color:hi, width:10 }); });
        ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(p.X(0), p.Y(0)); ctx.lineTo(p.X(1), p.Y(0)); ctx.lineTo(p.X(1), p.Y(k)); ctx.closePath(); ctx.stroke();
        var sq = 0.06; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(p.X(1 - sq), p.Y(0)); ctx.lineTo(p.X(1 - sq), p.Y(sq)); ctx.lineTo(p.X(1), p.Y(sq)); ctx.stroke(); ctx.restore();
        var aA = Math.atan2(k, 1);
        arcAt(p, 0, 0, 0.17, 0, aA, css("--p-t"), 2.2); txt(p, "x", 0.25 * Math.cos(aA / 2), 0.25 * Math.sin(aA / 2), { color:css("--p-t"), font:"italic 700 15px " + p.fontM, bg:false });
        var bA = Math.atan2(-k, -1); arcAt(p, 1, k, 0.11, -PI / 2, bA, ink, 1.6); arcAt(p, 1, k, 0.145, -PI / 2, bA, ink, 1.6);
        txt(p, cm("π/2 - x"), 1, k, { dx:-14, dy:-14, align:"right", font:"600 14px " + p.fontM });
        [["A", A, -12, 12], ["B", B, 12, -10], ["C", Cc, 12, 12]].forEach(function(q){ txt(p, q[0], q[1][0], q[1][1], { dx:q[2], dy:q[3], font:"italic 700 16px " + p.fontM, bg:false }); });
        var lab = function(s){ return S.lab === "let" ? LET[s] : t.L[s]; }, it = S.lab === "let" ? "italic 700 15px " : "700 15px ";
        txt(p, lab("BC"), 1, k / 2, { dx:12, align:"left", font:it + p.fontM });
        txt(p, lab("AC"), 0.5, 0, { dy:16, font:it + p.fontM });
        txt(p, lab("AB"), 0.5, k / 2, { dx:-10, dy:-12, align:"right", font:it + p.fontM });
        // role tags: opp/adj slide along the legs via the right-angle corner; hyp stays
        var e = V.eye, legV = [p.X(1) + 46, p.Y(k / 2)], legH = [p.X(0.5), p.Y(0) + 38], corner = [p.X(1) + 46, p.Y(0) + 38];
        function along(t1){ return t1 < 0.5 ? [legV[0] + (corner[0] - legV[0]) * t1 * 2, legV[1] + (corner[1] - legV[1]) * t1 * 2] : [corner[0] + (legH[0] - corner[0]) * (t1 * 2 - 1), corner[1] + (legH[1] - corner[1]) * (t1 * 2 - 1)]; }
        var op = along(e), ad = along(1 - e), hy = [p.X(0.5) - 34, p.Y(k / 2) - 30];
        [["opp", op], ["adj", ad], ["hyp", hy]].forEach(function(r){
          if (MV.reduceMotion && V.swapped && r[0] !== "hyp") { ctx.save(); ctx.strokeStyle = hi; ctx.lineWidth = 3; ctx.strokeRect(r[1][0] - 20, r[1][1] - 11, 40, 22); ctx.restore(); }
          ctx.save(); ctx.font = "600 13px " + p.fontUI; ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(r[0], r[1][0], r[1][1]); ctx.restore();
        });
        // eye marker at the corner you stand at
        var ex = -0.12 + (1.1 - -0.12) * e, ey = 0.08 + (k + 0.1 - 0.08) * e, X = p.X(ex), Y = p.Y(ey);
        ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(X - 11, Y); ctx.quadraticCurveTo(X, Y - 9, X + 11, Y); ctx.quadraticCurveTo(X, Y + 9, X - 11, Y); ctx.stroke();
        ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(X, Y, 3.2, 0, TAU); ctx.fill(); ctx.restore();
      } });
  };
  function setCorner(v){
    var from = V.eye, to = v === "B" ? 1 : 0; S.at = v; api.save(); V.swapped = true; paintTbl();
    MV.tween({ dur:800, step:function(t){ V.eye = from + (to - from) * t; tp.render(); }, done:function(){ V.eye = to; tp.render(); } });
  }
  function paintTris(){
    MV.keepFocus($("#cf-tris", host), function(){ $("#cf-tris", host).innerHTML = U.tris.map(function(t, i){ return '<button type="button" class="chip' + (S.tri === i ? " on" : "") + '" aria-pressed="' + (S.tri === i) + '" data-tri="' + i + '" data-k="tri' + i + '">' + t + "</button>"; }).join(""); });
  }
  function paintTbl(){
    var t = T(), atB = S.at === "B", ang = atB ? "(π/2 - x)" : " x";
    $("#cf-tbl", host).innerHTML = MV.tableHTML({ head:["Ratio", "Sides", "Value"], caption:"The six ratios from " + S.at + "’s corner", rows:FNS.map(function(f){
      var sd = SIDES[f].map(function(s){ return atB ? swapB(s) : s; }), lb = S.lab === "let";
      return [m(f + ang), ROLE[f] + " = " + m(sd.join("/")), m(lb ? sd.map(function(s){ return LET[s]; }).join("/") : t.v[atB ? CO6[f] : f])];
    }) });
  }
  // ----- Round 1: pair-up board (N6 style) -----
  var R1 = TRIS[0].v, RIGHT = ["cos", "cot", "sec", "sin", "csc", "tan"];
  function fx(f){ return m(f + " x"); } function fc(f){ return m(f + "(π/2 - x)"); }
  function pairMsg(L, R){
    var vL = m(R1[L]), vR = m(R1[CO6[R]]);
    if (L === R) {
      var opp = "the opposite side is `AC` = 15, not `BC` = 8", adj = "the adjacent side is `BC` = 8, not `AC` = 15";
      var sd = (L === "sin" || L === "csc") ? opp : (L === "cos" || L === "sec") ? adj : "the opposite side is `AC` = 15 and the adjacent side is `BC` = 8";
      return fill(U.same, { sides:MV.md(sd), R:fc(R), vR:vR, L:fx(L), vL:vL });
    }
    var prim = function(f){ return ["sin", "cos", "tan"].indexOf(f) >= 0; };
    if (prim(L) !== prim(R)) return fill(U.recip, { L:fx(L), vL:vL, R:fc(R), vR:vR, Ln:NAME6[L], Lc:NAME6[CO6[L]] });
    return fill(U.other, { R:fc(R), s:m(SIDES[R].map(swapB).join("/")), vR:vR, L:fx(L), vL:vL });
  }
  function paintPairs(){
    var P = S.pairs, done = Object.keys(P.done).length, h = "";
    if (V.msg) h += '<div class="fb ' + V.msg.k + '" role="status"><p>' + V.msg.h + "</p></div>";
    if (done === 6) h += '<div class="fb good" role="status"><p>' + U.done1 + "</p></div>";
    var doneR = {}; Object.keys(P.done).forEach(function(L){ doneR[PAIR[L]] = L; });
    h += '<div class="match"><div class="match-col" role="group" aria-label="' + MV.esc(MV.plain(U.r1left)) + '"><h4>' + U.r1left + "</h4>" + FNS.map(function(L){
      var d = P.done[L]; return '<button type="button" class="mitem' + (d ? " done" : "") + '" data-pl="' + L + '" data-k="pl' + L + '" aria-pressed="' + (V.sel === L) + '"' + (d ? " disabled" : "") + "><span>" + m(L + " x = " + R1[L]) + "</span></button>";
    }).join("") + '</div><div class="match-col" role="group" aria-label="' + MV.esc(MV.plain(U.r1right)) + '"><h4>' + U.r1right + "</h4>" + RIGHT.map(function(R){
      var d = doneR[R]; return '<button type="button" class="mitem' + (d ? " done" : "") + '" data-pr="' + R + '" data-k="pr' + R + '"' + (d ? " disabled" : "") + "><span>" + fc(R) + (d ? " " + m("= " + R1[d]) : "") + "</span></button>";
    }).join("") + "</div></div>";
    MV.keepFocus($("#cf-pairs", host), function(){ $("#cf-pairs", host).innerHTML = h; });
  }
  // ----- Round 2: ratio builder -----
  function paintBuild(){
    var h = FNS.map(function(f){
      var st = S.build[f] || {}, ans = BUILD[f];
      var r = '<div class="rb-row" data-rb="' + f + '"><p class="rb-q">' + m(f + "(π/2 - x) =") + (st.ok ? " " + m(ans + " = " + CO6[f] + " x") + ' <span class="rb-ok">✓</span>' : "") + "</p>";
      if (!st.ok) r += '<div class="chips" role="group" aria-label="' + MV.esc(MV.plain(fc(f))) + '">' + CHIPS.map(function(c){ return '<button type="button" class="chip' + (st.last === c ? " on" : "") + '" data-ch="' + c + '" data-k="rb' + f + c + '" aria-pressed="' + (st.last === c) + '">' + m(c) + "</button>"; }).join("") + "</div>";
      if (V.bmsg[f]) r += '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + V.bmsg[f] + "</p></div>";
      return r + "</div>";
    }).join("");
    MV.keepFocus($("#cf-build", host), function(){ $("#cf-build", host).innerHTML = h; });
  }
  // ----- beyond acute angles -----
  up.render = function(){
    var n = XS[S.xi], t = n * PI / 12, q = PI / 2 - t, acute = n > 0 && n < 6;
    unitCircle(up, { mirror:{ ang:PI / 4 }, tri:{ t:t, alpha:acute ? 1 : 0.15 }, arc:{ t:t },
      arms:[{ t:t, color:css("--pen"), w:3, name:"P" }, { t:q, color:css("--ink"), w:2.5, dash:[10, 6], name:"Q", label:cm("π/2 - x") }],
      hl:[{ t:t, coord:"x", label:cm(exS(Math.cos(t))) }, { t:q, coord:"y", label:cm(exS(Math.sin(q))) }],
      describe:"Unit circle. P at " + piT(n) + ", Q at " + piT(6 - n) + ", reflected in the line y = x. Arrow keys step the angle." });
  };
  function paintBeyond(){
    var n = XS[S.xi], t = n * PI / 12;
    $("#cf-x", host).innerHTML = m("x = " + piS(n));
    $("#cf-fade", host).textContent = n >= 6 ? U.fade : "";
    $("#cf-read", host).innerHTML = fill(U.read, { P:m(ptS(t)), ang:m(piS(6 - n)), Q:m(ptS(PI / 2 - t)), v:m(exS(Math.cos(t))) });
    up.render();
  }
  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.tri != null) { S.tri = +b.dataset.tri; V.glow = null; api.save(); paintTris(); paintTbl(); tp.render(); return; }
    if (b.dataset.pl) { V.sel = V.sel === b.dataset.pl ? null : b.dataset.pl; V.msg = null; if (S.tri || S.lab !== "num") { S.tri = 0; S.lab = "num"; labs.set("num"); paintTris(); paintTbl(); tp.render(); } paintPairs(); return; }
    if (b.dataset.pr) {
      if (!V.sel) { V.msg = { k:"", h:MV.plain(U.r1how) }; paintPairs(); return; }
      var L = V.sel, R = b.dataset.pr, P = S.pairs;
      if (PAIR[L] === R) { P.done[L] = true; V.glow = SIDES[L].slice(); V.msg = { k:"good", h:"<strong>✓ Matched.</strong> " + fx(L) + " = " + fc(R) + " = " + m(R1[L]) }; V.sel = null; S.tri = 0; paintTris(); tp.render(); }
      else { P.tries[L] = (P.tries[L] || 0) + 1; V.msg = { k:"bad", h:"<strong>✗ Not a match.</strong> " + pairMsg(L, R) }; }
      api.save(); paintPairs(); MV.focusFb($("#cf-pairs", host)); return;
    }
    if (b.dataset.ch) {
      var f = b.closest("[data-rb]").dataset.rb, st = S.build[f] || (S.build[f] = { tries:0 }), c = b.dataset.ch;
      if (S.lab !== "let") { S.lab = "let"; labs.set("let"); paintTbl(); tp.render(); }
      st.last = c;
      if (c === BUILD[f]) { st.ok = true; V.bmsg[f] = null; } else { st.tries++; V.bmsg[f] = fill(U.r2wrong, { chip:m(c), name:m(CHIPN[c]) }); }
      api.save(); paintBuild(); MV.focusFb($('[data-rb="' + f + '"]', host)); return;
    }
    if (b.dataset.act === "cxm" || b.dataset.act === "cxp") { S.xi = (S.xi + (b.dataset.act === "cxp" ? 1 : -1) + XS.length) % XS.length; api.save(); paintBeyond(); }
  });
  up.c.addEventListener("keydown", function(e){
    var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0; if (!d) return;
    e.preventDefault(); S.xi = (S.xi + d + XS.length) % XS.length; api.save(); paintBeyond();
  });
  void stand;
  paintTris(); paintTbl(); paintPairs(); paintBuild(); paintBeyond(); tp.render();
  return {};
}

// ---------- Practice 2: work backwards (π-multiple boxes, N4, with a preview graph) ----------
var WB = {
  wb1:{ L:function(c, x){ return Math.sin(x + c); }, R:Math.cos },
  wb2:{ L:function(c, x){ return Math.cos(c - x); }, R:function(x){ return -Math.cos(x); } },
  wb3:{ L:function(c, x){ return Math.cos(x + c); }, R:Math.sin },
  wb4:{ L:function(c, x){ return Math.sin(c - x); }, R:function(x){ return -Math.cos(x); } },
  wb5:{ L:function(c, x){ return Math.tan(c - x); }, R:function(x){ return 1 / Math.tan(x); }, y:4 },
  wb6:{ L:function(c, x){ return Math.sin(x + c); }, R:function(x){ return Math.cos(x - PI / 3); } },
  wb7:{ L:function(c, x){ return Math.cos(c - x); }, R:function(x){ return Math.sin(x + PI / 4); } },
  wb8:{ L:function(c, x){ return -Math.sin(c - x); }, R:function(x){ return Math.cos(x + PI / 6); } } };
function works(id, coef){
  var w = WB[id], c = coef * PI;
  return [0.3, 1.1, 2.0, 2.9, 4.4, 5.3].every(function(x){ var a = w.L(c, x), b = w.R(x); return !isFinite(a) || !isFinite(b) || Math.abs(b) > 1e6 ? true : Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)); });
}
function workBack(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var msg = {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="wb-n"></span><span class="dots" id="wb-dots" aria-hidden="true"></span></div>' +
    '<p class="pred-q wb-st" id="wb-st"></p><div id="wb-in" class="wb-in"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="wb-check" data-k="wbchk">Check</button><span id="wb-hint"></span></div><div id="wb-hints"></div><div id="wb-fb" aria-live="polite"></div>' +
    '<div id="wb-pv" class="wb-pv" hidden><canvas class="plot wide" id="wb-plot" role="img" aria-label="Preview graph"></canvas><p class="tiny muted" id="wb-leg"></p></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="wb-prev" data-k="wbprev">Previous</button><button type="button" class="btn ghost sm" id="wb-next" data-k="wbnext">Next statement</button></div>';
  var plot = new MV.Plot($("#wb-plot", host), GV);
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { v:["", ""], tries:0, hint:0, solved:false, first:null, last:null }); }
  plot.render = function(){
    var it = a.items[S.i], x = ist(it), w = WB[it.id]; if (!x.last || !x.last.length) return;
    var yv = w.y || 1.6, view = { xmin:-TAU, xmax:TAU, ymin:-yv, ymax:yv }, cs = x.last, pen = css("--pen");
    var h0 = function(t){ return w.L(cs[0] * PI, t); };
    var narrow = plot.c.getBoundingClientRect().width < 470;
    plot.draw({ view:view, xTicks:{ step:narrow ? PI : PI / 2, pi:true }, yTicks:{ step:w.y ? 2 : 1 },
      describe:"Preview: the left side with c = " + cs.map(function(c){ return piT(c * 12); }).join(" and ") + " (solid) and the right side (dashed).",
      after:function(ctx, p){
        if (!w.y) gauge.shade(p, h0, w.R, 1);
        p.curve({ f:w.R, color:css("--ink-2"), width:2.4, dash:[6, 6] });
        cs.forEach(function(c, i){ p.curve({ f:function(t){ return w.L(c * PI, t); }, color:i ? css("--ink") : pen, width:i ? 2.5 : 3, dash:i ? [10, 6] : null }); });
      } });
  };
  function paint(load){
    var it = a.items[S.i], x = ist(it);
    $("#wb-n", host).textContent = "Statement " + (S.i + 1) + " of " + a.items.length;
    $("#wb-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#wb-st", host).innerHTML = it.st;
    if (load) {
      var box = function(k){ return '<label class="wb-box"><span>' + m("c =") + '</span><input type="text" class="numin short" inputmode="text" autocomplete="off" data-wb="' + k + '" data-k="wbin' + k + '" aria-label="c' + (it.two ? " value " + (k + 1) : "") + ', the number in front of pi" value="' + MV.esc(x.v[k]) + '"' + (x.solved ? " disabled" : "") + '><span class="m">π</span></label>'; };
      $("#wb-in", host).innerHTML = box(0) + (it.two ? '<span class="wb-and">and</span>' + box(1) : "");
    } else $$("[data-wb]", host).forEach(function(inp){ inp.disabled = x.solved; });
    $("#wb-check", host).disabled = x.solved;
    $("#wb-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("wbh" + it.id, x.hint);
    $("#wb-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    $("#wb-fb", host).innerHTML = x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.show + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : msg[it.id] ? '<div class="fb ' + (msg[it.id].k || "bad") + '" role="status"><p>' + msg[it.id].h + "</p></div>" : "";
    var pv = $("#wb-pv", host); pv.hidden = !(x.last && x.last.length);
    if (!pv.hidden) { $("#wb-leg", host).innerHTML = "Solid: the left side with " + x.last.map(function(c){ return m("c = " + piS(c * 12)); }).join(" and ") + ". Dashed: the right side."; plot.render(); }
    $("#wb-prev", host).disabled = S.i === 0; $("#wb-next", host).disabled = S.i === a.items.length - 1;
  }
  function judge(it, x){
    var ans = MV.ans(it), raw = it.two ? x.v : [x.v[0]], vals = [], bad = false;
    raw.forEach(function(r){ if (String(r).trim() === "") return; var c = parsePi(r); if (isNaN(c)) bad = true; else vals.push(c); });
    if (bad || !vals.length) return { skip:true, h:a.bad };
    var inR = function(c){ return c >= -1e-9 && c < 2 - 1e-9; }, isAns = function(c){ return ans.some(function(v){ return near(v, c, 1e-7); }); };
    var out = vals.filter(function(c){ return !isAns(c) && works(it.id, c) && !inR(c); });
    if (out.length) return { skip:true, h:a.outside, vals:vals };
    var wrong = vals.filter(function(c){ return !isAns(c); });
    if (wrong.length) {
      var nm = (it.wrong || []).filter(function(w){ return wrong.some(function(c){ return near(c, w.match, 1e-7); }); })[0];
      return { ok:false, h:"<strong>✗ Not quite.</strong> " + (nm ? nm.fb : a.fallback), vals:vals };
    }
    var uniq = vals.filter(function(c, i){ return vals.findIndex(function(d){ return near(c, d, 1e-7); }) === i; });
    if (uniq.length < ans.length) return { ok:false, h:"<strong>" + it.one + "</strong>", vals:vals };
    return { ok:true, vals:vals };
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.wb; if (k == null) return; ist(a.items[S.i]).v[+k] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.wb != null) $("#wb-check", host).click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = ist(it);
    if (b.id === "wb-prev" || b.id === "wb-next") { S.i += b.id === "wb-prev" ? -1 : 1; api.save(); paint(true); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id === "wb-check") {
      var r = judge(it, x);
      if (r.vals) x.last = r.vals.slice(0, 2);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
      else { if (!r.skip) x.tries++; msg[it.id] = { k:r.skip ? "" : "bad", h:r.h }; }
      api.save(); paint(); MV.focusFb(host);
    }
  });
  paint(true);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: same wave, new name ----------
var task = (function(){
  var api, plot, U;
  var TGT = function(x){ return Math.cos(x - PI / 3); };
  function read(){
    var s = api ? api.S : {}, praw = s.p == null ? "" : String(s.p), pv = praw.trim() === "" ? NaN : Number(praw), q = +(s.q || 6);
    return { fn:s.fn || "sin", sg:s.sg || "+", ins:s.ins || "x+c", praw:praw, p:pv, q:q, pOk:Number.isInteger(pv) && pv >= 0 && pv <= 24 };
  }
  function val(d){ var c = d.p / d.q * PI, f = F[d.fn], s = d.sg === "-" ? -1 : 1; return function(x){ return s * f(d.ins === "x+c" ? x + c : c - x); }; }
  function cTxt(d){ var g = gcd(d.p, d.q); return d.p === 0 ? "0" : piS(d.p / g, d.q / g); }
  function expr(d){ var c = d.pOk ? cTxt(d) : "c", arg = d.ins === "x+c" ? (c === "0" ? "x" : "x + " + c) : (c === "0" ? "-x" : c + " - x"); return (d.sg === "-" ? "-" : "") + d.fn + (arg === "x" ? " x" : "(" + arg + ")"); }
  function draw(){
    var d = read(), h = d.pOk ? val(d) : null;
    var g = h ? gauge(h, TGT, { test:function(f, t){ return Math.abs(f(0) - t(0)) < 1e-9 && Math.abs(f(PI / 3) - t(PI / 3)) < 1e-9; } }) : null;
    var narrow = plot.c.getBoundingClientRect().width < 470;
    plot.draw({ view:GV, xTicks:{ step:narrow ? PI : PI / 2, pi:true }, yTicks:{ step:1 },
      describe:"Target y = cos(x − π/3), dashed, with open rings at (0, 1/2) and (π/3, 1)." + (h ? " Your graph y = " + MV.plain(m(expr(d))) + (g.match ? ": it matches at every x." : ": largest gap " + g.text + ".") : ""),
      after:function(ctx, p){
        if (h && !g.match) gauge.shade(p, h, TGT, 1);
        p.curve({ f:TGT, color:css("--ink-2"), width:2.4, dash:[6, 6] });
        if (h) p.curve({ f:h, color:css("--pen"), width:3 });
        [[0, 0.5], [PI / 3, 1]].forEach(function(q){ p.point({ x:q[0], y:q[1], r:7, open:true, color:css("--ink") }); });
      } });
    $("#tk-cap").innerHTML = m("y = " + expr(d));
    $("#tk-gap").innerHTML = g ? (g.match ? U.gap0 : fill(U.gap, { g:g.text })) : "";
  }
  function chips(){
    var S = api.S, d = read();
    radioSet($("#task-in"), "fn", d.fn); radioSet($("#task-in"), "sg", d.sg); radioSet($("#task-in"), "ins", d.ins);
    void S;
  }
  return {
    render:function(inp, pv, a){
      api = a; U = a.content.ui; var S = a.S; S.q = S.q || 6;
      inp.innerHTML = '<div class="tk-in"><div class="ctl-row"><span class="ctl-lab">' + U.fn + "</span>" + radioHTML("fn", U.fn, [{ v:"sin", t:m("sin") }, { v:"cos", t:m("cos") }]) + "</div>" +
        '<div class="ctl-row"><span class="ctl-lab">' + U.sign + "</span>" + radioHTML("sg", U.sign, [{ v:"+", t:"+" }, { v:"-", t:MINUS }], "pa") + "</div>" +
        '<div class="ctl-row"><span class="ctl-lab">' + U.inside + "</span>" + radioHTML("ins", U.inside, [{ v:"x+c", t:m("x + c") }, { v:"c-x", t:m("c - x") }], "pk") + "</div>" +
        '<div class="ctl-row tk-c"><span class="ctl-lab">' + U.c + '</span><label class="vh" for="tk-p">p, a whole number from 0 to 24</label><input type="number" id="tk-p" class="numin short" min="0" max="24" step="1" autocomplete="off" value="' + MV.esc(S.p == null ? "" : S.p) + '">' +
        '<span aria-hidden="true">/</span><label class="vh" for="tk-q">q</label><select id="tk-q" class="numin short">' + [1, 2, 3, 4, 6].map(function(q){ return '<option value="' + q + '"' + (+S.q === q ? " selected" : "") + ">" + q + "</option>"; }).join("") + '</select><span class="m">π</span></div>' +
        '<p class="eq-cap tk-cap" id="tk-cap" aria-live="polite"></p></div>';
      pv.innerHTML = '<canvas class="plot" id="tk-plot" role="img" aria-label="Target and your graph"></canvas><p class="tiny" id="tk-gap" aria-live="polite" style="margin-top:6px"></p>';
      plot = new MV.Plot($("#tk-plot"), GV); plot.render = draw;
      radioKeys(inp, function(g, v){ S[g] = v; a.save(); chips(); draw(); a.update(); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-rv]"); if (!b) return; S[b.closest("[data-rg]").dataset.rg] = b.dataset.rv; a.save(); chips(); draw(); a.update(); });
      inp.addEventListener("input", function(e){ if (e.target.id === "tk-p") S.p = e.target.value; else if (e.target.id === "tk-q") S.q = +e.target.value; else return; a.save(); draw(); a.update(); });
      inp.addEventListener("change", function(e){ if (e.target.id === "tk-q") { S.q = +e.target.value; a.save(); draw(); a.update(); } });
      // after all four answers, add the closing question (the frame shows the first-success message itself)
      $("#task-check").addEventListener("click", function(){ setTimeout(function(){ var fb = $("#task-fb .fb.good"); if (!fb || MV.taskState().found.length < 4 || $(".tk-all4", fb)) return; var more = MV.C.task.more || ""; $$("p", fb).forEach(function(q){ if (more && q.innerHTML.indexOf(more) === 0) q.innerHTML = q.innerHTML.slice(more.length).trim(); }); fb.insertAdjacentHTML("beforeend", '<p class="tk-all4">' + U.all4 + "</p>"); }, 0); });
      chips(); draw();
    },
    read:read,
    valid:function(d){ return d.praw.trim() === "" ? U.needC : d.pOk ? true : U.needC; },
    checks:function(d){
      if (!d.pOk) return [d.fn === "sin", false, false, false];
      var h = val(d);
      return [d.fn === "sin", d.p / d.q < 2 - 1e-12, Math.abs(h(0) - 0.5) < 1e-9, Math.abs(h(PI / 3) - 1) < 1e-9];
    },
    tips:function(d, c){
      var T = MV.C.task.tips, out = [], h = val(d);
      if (!c[0]) out.push(T[0]);
      if (!c[1]) out.push(T[1]);
      if (!c[2]) out.push(fill(T[2], { v:m(exS(h(0))) }));
      else if (!c[3]) out.push(fill(T[3], { v:m(exS(h(PI / 3))) }));
      return out;
    },
    key:function(d){ var g = gcd(d.p, d.q); return d.fn + "|" + d.sg + "|" + d.ins + "|" + (d.p / g) + "/" + (d.q / g); },
    label:function(k){ var s = k.split("|"), pq = s[3].split("/"); return m("y = " + expr({ fn:s[0], sg:s[1], ins:s[2], p:+pq[0], q:+pq[1], pOk:true })); },
    text:function(k){ return MV.plain(this.label(k)).replace(/^y = /, ""); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ wb:workBack },
  task:task,
  summaryLines:function(){ return ["Identity board: " + boardCount() + "/16 found"]; }
});
})();
