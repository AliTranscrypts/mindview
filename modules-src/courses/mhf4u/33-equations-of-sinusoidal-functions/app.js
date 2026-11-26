// MHF4U 33 Equations of Sinusoidal Functions: hero, "Read the wave" (Read mode: key-point markers, measuring tools, equation
// builder, status line; Gallery mode: start flag, board), "Many right answers" (cycle ruler rewrites, the three checks),
// Match the wave, Equations from clues, and the "One wave, four clues" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, MINUS = MV.MINUS, PI = Math.PI, TAU = 2 * PI, T12 = PI / 12, m = MV.m;
function fill(t, o){ return String(t).replace(/\{(\w+)\}/g, function(s, k){ return o[k] != null ? o[k] : s; }); }
function near(a, b, e){ return Math.abs(a - b) < (e || 1e-9); }
function isDark(){ var s = css("--sheet").replace("#", ""); return s.length >= 6 && parseInt(s.slice(0, 2), 16) < 128; }
function cm(s){ return String(s).replace(/-/g, MINUS); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }

// ---------- exact numbers: fractions and π-multiples (N3) ----------
function rat(v, mx){ mx = mx || 48; for (var d = 1; d <= mx; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return [n, d]; } return null; }
function frS(v){ var r = rat(v); if (!r) return (v < 0 ? "-" : "") + Math.abs(v).toFixed(2); return (r[0] < 0 ? "-" : "") + Math.abs(r[0]) + (r[1] === 1 ? "" : "/" + r[1]); }
function valS(v){ return rat(v, 4) ? frS(v) : "≈ " + (v < 0 ? "-" : "") + Math.abs(v).toFixed(2); }
function par(v){ return v < 0 ? "(" + frS(v) + ")" : frS(v); }
function piQ(q, st){
  var r = rat(q, 96); if (!r) return "≈ " + (q < 0 ? "-" : "") + Math.abs(q * PI).toFixed(2);
  if (!r[0]) return "0";
  var p = Math.abs(r[0]), top = (p === 1 ? "" : p) + "π";
  return (r[0] < 0 ? "-" : "") + (r[1] === 1 ? top : st ? "{" + top + "}/{" + r[1] + "}" : top + "/" + r[1]);
}
function piX(x, st){ return piQ(x / PI, st); }
function piT(x){ return cm(piX(x)); }
function piSay(x){ return MV.plain(m(piX(x))).replace(/−/g, "minus ").replace(/π/g, " pi ").replace(/\//g, " over ").replace(/\s+/g, " ").trim(); }
function ptS(x, y, st){ return "(" + piX(x, st) + ", " + frS(y) + ")"; }

// ---------- the sinusoid model: [base, a, k, d in twelfths of π, c] ----------
function E(r){ return { f:r[0], a:r[1], k:r[2], d:r[3] * T12, c:r[4] }; }
function val(e, x){ var t = e.k * (x - e.d); return e.a * (e.f === "sin" ? Math.sin(t) : Math.cos(t)) + e.c; }
function fnOf(e){ return function(x){ return val(e, x); }; }
// match test (plan): same k and c, and equal at x = 0 and x = π/(2k)
function same(e, w){ if (!near(e.k, w.k) || !near(e.c, w.c)) return false; var x2 = PI / (2 * e.k); return near(val(e, 0), val(w, 0)) && near(val(e, x2), val(w, x2)); }
function maxX(e){ return e.d + ((e.f === "cos" ? 0 : 0.25) + (e.a < 0 ? 0.5 : 0)) * TAU / e.k; }
function hi(e){ return e.c + Math.abs(e.a); }
function lo(e){ return e.c - Math.abs(e.a); }
var SEQ = { sin1:["up", "max", "down", "min"], cos1:["max", "down", "min", "up"], "sin-1":["down", "min", "up", "max"], "cos-1":["min", "up", "max", "down"] };
function seqOf(e){ return SEQ[e.f + (e.a < 0 ? "-1" : "1")]; }
var ICON = { max:"▲", min:"▼", up:"↗", down:"↘" }, ROWT = { sin:"up", cos:"max", nsin:"down", ncos:"min" };
// @component N8 keyPoints — key points of a sinusoid on [x0, x1] (maximum, minimum, axis crossing ↑ / ↓), sorted by x: {x, n (twelfths), y, t};
// the Explore canvas snaps taps within 28 px to these ("snap to key points"), with a press-and-hold ring and Left/Right/Enter keys
function keyPts(e, x0, x1){
  var P = TAU / e.k, mx = maxX(e), out = [], TY = ["max", "down", "min", "up"];
  for (var n = Math.floor((x0 - mx) / P) - 1; n <= Math.ceil((x1 - mx) / P) + 1; n++) for (var q = 0; q < 4; q++) {
    var x = mx + n * P + q * P / 4; if (x < x0 - 1e-9 || x > x1 + 1e-9) continue;
    var t = TY[q]; out.push({ x:x, n:Math.round(x / T12), y:t === "max" ? hi(e) : t === "min" ? lo(e) : e.c, t:t });
  }
  return out.sort(function(a, b){ return a.x - b.x; });
}
// math source for an equation, following the plan's writing rules
function coefA(a){ if (near(a, 1)) return ""; if (near(a, -1)) return "-"; var s = frS(Math.abs(a)); return (a < 0 ? "-" : "") + (s.indexOf("/") >= 0 ? "(" + s + ")" : s); }
function argS(k, d, st){
  var kr = rat(k), ks = frS(k), kInt = kr && kr[1] === 1;
  if (near(d, 0)) { if (near(k, 1)) return " x"; if (kInt) return " " + ks + "x"; return kr ? "(" + (kr[0] === 1 ? "" : kr[0]) + "x/" + kr[1] + ")" : "(" + ks + "x)"; }
  var inner = "x " + (d < 0 ? "+ " : "- ") + piX(Math.abs(d), st);
  if (near(k, 1)) return "(" + inner + ")";
  return "[" + (kInt ? ks : "(" + ks + ")") + "(" + inner + ")]";
}
function eqSrc(e, st){
  var ca = coefA(e.a), s = "y = " + ca + (ca && ca !== "-" ? " " : "") + e.f + argS(e.k, e.d, st);
  if (!near(e.c, 0)) s += (e.c < 0 ? " - " : " + ") + frS(Math.abs(e.c));
  return s;
}
function eqKey(e){ return [e.f, frS(e.a), frS(e.k), Math.round(e.d / T12 * 1e6) / 1e6, frS(e.c)].join("|"); }
// status line (Explore rules 1–4; null when the two match)
function status(e, w, U){
  if (!near(e.k, w.k)) return { kind:"period", html:fill(U.period, { yp:m(piX(TAU / e.k)), wp:m(piX(TAU / w.k)) }) };
  if (!near(hi(e), hi(w)) || !near(lo(e), lo(w))) return { kind:"height", html:fill(U.height, { ymin:m(frS(lo(e))), ymax:m(frS(hi(e))), wmin:m(frS(lo(w))), wmax:m(frS(hi(w))) }) };
  if (same(e, w)) return null;
  var P = TAU / w.k, s = maxX(w) - maxX(e); s -= P * Math.round(s / P); if (s <= -P / 2 + 1e-9) s += P;
  if (near(Math.abs(s), P / 2, 1e-7)) return { kind:"upside", html:fill(U.upside, { h:m(piX(P / 2)) }) };
  return { kind:"slid", html:fill(U.slid, { dir:s > 0 ? U.right : U.left, s:m(piX(Math.abs(s))) }) };
}

// @component N23 overlayGauge — copied from MHF4U 27 (gap shading G6 with a --hi edge in dark mode) and extended here with
// the largest gap over a window (961 samples, 2 dp) and the period / height / upside-down / "slide right or left by s" diagnosis (status()).
function gapOf(h, T, x0, x1, N){ N = N || 961; var g = 0; for (var i = 0; i < N; i++) { var x = x0 + (x1 - x0) * i / (N - 1), d = Math.abs(h(x) - T(x)); if (d > g) g = d; } return g; }
function shade(p, h, T, alpha){
  if (!(alpha > 0)) return;
  var ctx = p.ctx, v = p.v, N = Math.max(240, Math.round(p.W)), i, x, cl = function(y){ return p.Y(Math.max(v.ymin - 1, Math.min(v.ymax + 1, y))); };
  ctx.save(); ctx.beginPath();
  for (i = 0; i <= N; i++) { x = v.xmin + (v.xmax - v.xmin) * i / N; if (i) ctx.lineTo(p.X(x), cl(h(x))); else ctx.moveTo(p.X(x), cl(h(x))); }
  for (i = N; i >= 0; i--) { x = v.xmin + (v.xmax - v.xmin) * i / N; ctx.lineTo(p.X(x), cl(T(x))); }
  ctx.closePath(); ctx.globalAlpha = alpha; ctx.fillStyle = css("--hi-soft"); ctx.fill();
  if (isDark()) {
    ctx.lineWidth = 5.2; ctx.lineJoin = "round"; ctx.strokeStyle = css("--hi"); ctx.globalAlpha = 0.4 * alpha;
    [h, T].forEach(function(f){ ctx.beginPath(); for (i = 0; i <= N; i++) { x = v.xmin + (v.xmax - v.xmin) * i / N; if (i) ctx.lineTo(p.X(x), cl(f(x))); else ctx.moveTo(p.X(x), cl(f(x))); } ctx.stroke(); });
  }
  ctx.restore();
}

// ---------- canvas annotations (G11) ----------
// text with *italic* letters and a sheet-coloured backing
function ctext(p, s, X, Y, o){
  o = o || {}; var ctx = p.ctx, sz = o.size || 14, parts = String(s).split("*"), ws = [], W = 0, f = function(i){ return (i % 2 ? "italic " : "") + "600 " + sz + "px " + p.fontM; };
  ctx.save(); ctx.textBaseline = "middle"; ctx.textAlign = "left";
  parts.forEach(function(t, i){ ctx.font = f(i); var w = ctx.measureText(t).width; ws.push(w); W += w; });
  var x = o.align === "center" ? X - W / 2 : o.align === "right" ? X - W : X;
  x = Math.max(2, Math.min(p.W - W - 2, x));
  ctx.globalAlpha = 0.85 * (o.alpha == null ? 1 : o.alpha); ctx.fillStyle = css("--sheet"); ctx.fillRect(x - 3, Y - sz * 0.72, W + 6, sz * 1.44);
  ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.fillStyle = o.color || css("--ink");
  parts.forEach(function(t, i){ ctx.font = f(i); ctx.fillText(t, x, Y); x += ws[i]; });
  ctx.restore();
}
function flagAt(p, x, y, col, o){
  o = o || {}; var ctx = p.ctx, X = p.X(x), Y = p.Y(y), h = o.h || 26;
  if (Y - h < 4) h = -h;
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X, Y - h); ctx.stroke();
  var s = h > 0 ? 1 : -1; ctx.beginPath(); ctx.moveTo(X, Y - h); ctx.lineTo(X + 15, Y - h + 5.5 * s); ctx.lineTo(X, Y - h + 11 * s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(X, Y, o.r || 4, 0, TAU); ctx.fill(); ctx.restore();
}
function iconAt(p, t, x, y, col, alpha, big){
  var ctx = p.ctx, X = p.X(x), Y = p.Y(y);
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  if (big) { ctx.fillStyle = css("--hi"); ctx.beginPath(); ctx.arc(X, Y, 15, 0, TAU); ctx.fill(); }
  ctx.fillStyle = css("--sheet"); ctx.beginPath(); ctx.arc(X, Y, 9, 0, TAU); ctx.fill();
  ctx.fillStyle = col; ctx.font = "700 " + (big ? 16 : 14) + "px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(ICON[t], X, Y + 1);
  ctx.restore();
}
function vbr(p, x, y0, y1, col, t, lab, dx){
  var ctx = p.ctx, X = p.X(x) + (dx == null ? 12 : dx), Y0 = p.Y(y0), Y1 = p.Y(y0 + (y1 - y0) * t), s = dx != null && dx < 0 ? 6 : -6;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(X + s, Y0); ctx.lineTo(X, Y0); ctx.lineTo(X, Y1); ctx.lineTo(X + s, Y1); ctx.stroke(); ctx.restore();
  if (lab && t > 0.95) ctext(p, lab, X + (s < 0 ? 8 : -8), (Y0 + Y1) / 2, { color:col, align:s < 0 ? "left" : "right" });
}
function hbr(p, x0, x1, Y, col, t, lab, o){
  o = o || {}; var ctx = p.ctx, X0 = p.X(x0), X1 = p.X(x0 + (x1 - x0) * t);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = o.w || 2.4; if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(X0, Y - 6); ctx.lineTo(X0, Y); ctx.lineTo(X1, Y); ctx.lineTo(X1, Y - 6); ctx.stroke(); ctx.restore();
  if (lab && t > 0.95) ctext(p, lab, (X0 + X1) / 2, Y + (o.below ? 14 : -14), { color:col, align:"center" });
}
function hLine(p, y, col, t, dash, w){ var ctx = p.ctx; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1.5; ctx.setLineDash(dash || [8, 6]); ctx.beginPath(); ctx.moveTo(0, p.Y(y)); ctx.lineTo(p.W * t, p.Y(y)); ctx.stroke(); ctx.restore(); }
function ring(p, x, y, lab, o){ o = o || {}; p.point({ x:x, y:y, r:6.5, open:true, color:css("--ink") }); if (lab) ctext(p, lab, p.X(x) + (o.dx || 10), p.Y(y) + (o.dy || -15), { align:o.align || "left", size:13 }); }
function minorTicks(p){ var ctx = p.ctx, v = p.v, oy = p.Y(0); if (oy < 0 || oy > p.H) return; ctx.save(); ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1; ctx.beginPath(); for (var n = Math.ceil(v.xmin / T12); n * T12 <= v.xmax; n++) { var X = Math.round(p.X(n * T12)) + 0.5; ctx.moveTo(X, oy - 3); ctx.lineTo(X, oy + 3); } ctx.stroke(); ctx.restore(); }
function narrow(p){ return p.c.getBoundingClientRect().width < 470; }

// @component radioGroup — copied from MHF4U 27: chip row as a real radio group (arrow keys, roving tabindex)
function radioHTML(key, label, opts, cls){
  return '<span class="rchips' + (cls ? " " + cls : "") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(label)) + '" data-rg="' + key + '">' +
    opts.map(function(o){ return '<button type="button" role="radio" data-rv="' + o.v + '" data-k="' + key + o.v + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function radioSet(host, key, val, dis){
  $$('[data-rg="' + key + '"] [data-rv]', host).forEach(function(b){ var on = b.dataset.rv === String(val); b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; b.disabled = typeof dis === "function" ? dis(b.dataset.rv) : !!dis; });
  var g = $('[data-rg="' + key + '"]', host); if (g && !$('[tabindex="0"]', g)) { var f = $("[data-rv]:not(:disabled)", g); if (f) f.tabIndex = 0; }
}
function radioKeys(host, pick){
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest("[data-rv]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); e.stopPropagation();
    var g = b.closest("[data-rg]"), bs = $$("[data-rv]", g), i = bs.indexOf(b);
    for (var n = 0; n < bs.length; n++) { i = (i + d + bs.length) % bs.length; if (!bs[i].disabled) break; }
    if (bs[i].disabled || bs[i] === b) return; pick(g.dataset.rg, bs[i].dataset.rv); bs[i].focus();
  });
}

// @component N4 sinBuilder — "fill in the coefficients" y = [a] (sin|cos)[[k](x − [d]π)] + [c]: fraction boxes with ± chips and
// denominator menus (a, k, c), a π-multiple box for d (denominators 1, 2, 3, 4, 6, 12), parsing with range checks; Enter submits.
var DEN = [1, 2, 3, 4], DDEN = [1, 2, 3, 4, 6, 12], PNAME = { a:"a", k:"k", d:"d", c:"c" };
function boxHTML(key, w, b){
  var dens = w === "d" ? DDEN : DEN;
  return '<span class="fx fx-' + w + '">' + (w !== "k" ? '<button type="button" class="fx-sg" data-sg="' + w + '" data-k="' + key + "s" + w + '" aria-label="Sign of ' + w + ": " + (b.s < 0 ? "minus" : "plus") + '">' + (b.s < 0 ? MINUS : "+") + "</button>" : "") +
    '<input class="fx-n" data-fx="' + w + '" data-k="' + key + "n" + w + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="' + w + '" aria-label="' + w + (w === "d" ? ", the number of π, numerator" : ", numerator") + '" value="' + MV.esc(b.n || "") + '">' +
    '<span class="fx-sl" aria-hidden="true">' + (w === "d" ? "π/" : "/") + "</span>" +
    '<select class="fx-den" data-fd="' + w + '" aria-label="' + w + ', denominator">' + dens.map(function(d){ return "<option" + (d === (b.d || 1) ? " selected" : "") + ">" + d + "</option>"; }).join("") + "</select></span>";
}
function builder(host, o){
  var st = o.st;
  function norm(){ ["a", "k", "d", "c"].forEach(function(w){ st[w] = st[w] || { s:1, n:"", d:1 }; }); st.f = st.f || "cos"; }
  function html(){
    norm();
    if (o.dOnly) return '<span class="bld bld-d"><span class="m"><i>d</i> =</span>' + boxHTML(o.key, "d", st.d) + "</span>";
    var base = o.base === "chips" ? radioHTML(o.key + "f", "Base", [{ v:"sin", t:m("sin") }, { v:"cos", t:m("cos") }], "bld-f") : '<span class="m bld-fx">' + o.base + "</span>";
    return '<div class="bld" role="group" aria-label="' + MV.esc(o.label || "Your equation") + '"><span class="bld-l"><span class="m"><i>y</i> =</span>' + boxHTML(o.key, "a", st.a) + base + "</span>" +
      '<span class="bld-l"><span class="bld-g"><span class="m">[</span>' + boxHTML(o.key, "k", st.k) + '</span><span class="bld-g"><span class="m">(<i>x</i> −</span>' + boxHTML(o.key, "d", st.d) + '<span class="m">)]</span></span><span class="bld-g"><span class="m">+</span>' + boxHTML(o.key, "c", st.c) + "</span></span></div>";
  }
  function paint(){ host.innerHTML = html(); if (o.base === "chips") radioSet(host, o.key + "f", st.f); }
  host.addEventListener("input", function(e){ var w = e.target.dataset.fx; if (!w) return; st[w].n = e.target.value; if (o.onChange) o.onChange(); });
  host.addEventListener("change", function(e){ var w = e.target.dataset.fd; if (!w) return; st[w].d = +e.target.value; if (o.onChange) o.onChange(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && (e.target.dataset.fx || e.target.dataset.fd)) { e.preventDefault(); if (o.onEnter) o.onEnter(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.sg) { var w = b.dataset.sg; st[w].s = st[w].s < 0 ? 1 : -1; b.textContent = st[w].s < 0 ? MINUS : "+"; b.setAttribute("aria-label", "Sign of " + w + ": " + (st[w].s < 0 ? "minus" : "plus")); if (o.onChange) o.onChange(); }
    else if (b.dataset.rv && b.closest('[data-rg="' + o.key + 'f"]')) { st.f = b.dataset.rv; radioSet(host, o.key + "f", st.f); if (o.onChange) o.onChange(); }
  });
  if (o.base === "chips") radioKeys(host, function(g, v){ if (g !== o.key + "f") return; st.f = v; radioSet(host, g, v); if (o.onChange) o.onChange(); });
  paint();
  return {
    read:function(){ norm(); return parseB(st, o.dOnly, o.base === "chips" ? st.f : o.base); },
    repaint:paint,
    disable:function(dis){ $$("input, select, button", host).forEach(function(x){ x.disabled = !!dis; }); }
  };
}
function parseB(st, dOnly, f){
  var ws = dOnly ? ["d"] : ["a", "k", "d", "c"], v = {};
  for (var i = 0; i < ws.length; i++) {
    var raw = String(st[ws[i]].n == null ? "" : st[ws[i]].n).trim(), r = raw ? MV.parseNum(raw) : null;
    if (!r || r.length !== 1) return { ok:false, why:"empty" };
    v[ws[i]] = r[0];
  }
  if (!dOnly) {
    if (v.k < 0) return { ok:false, why:"kNeg" };
    if (Math.abs(v.a) > 12 || Math.abs(v.c) > 12 || v.k > 12 || v.k === 0) return { ok:false, why:"numRange" };
  }
  if (Math.abs(v.d) > 24) return { ok:false, why:"numRange" };
  var d = st.d.s * v.d / st.d.d * PI;
  if (dOnly) return { ok:true, d:d, dOut:Math.abs(d) > TAU + 1e-9 };
  var a = st.a.s * v.a / st.a.d; if (near(a, 0)) return { ok:false, why:"aZero" };
  return { ok:true, e:{ f:f, a:a, k:v.k / st.k.d, d:d, c:st.c.s * v.c / st.c.d }, dOut:Math.abs(d) > TAU + 1e-9 };
}
// a "not counted" result for the toolkit's challenge check (it adds a try; take it back after it is recorded)
function uncounted(id, msg){ Promise.resolve().then(function(){ var s = MV.S.chal[id]; if (s && s.tries > 0) { s.tries--; MV.save(); } }); return { ok:false, msg:msg }; }

// ---------- hero: one wave, four of its names ----------
function hero(f){
  if (!f.canvas) return;
  var L = (MV.C.hero.fig || {}).labels || {}, e = E(["sin", 3, 2, 2, 1]), h = fnOf(e);
  var starts = [["sin", 3, 2], ["cos", 3, 5], ["sin", -3, 8], ["cos", -3, 11]].map(function(s){ return { e:E([s[0], s[1], 2, s[2], 1]), x:s[2] * T12 }; });
  var p = new MV.Plot(f.canvas, { xmin:-PI / 2, xmax:1.5 * PI, ymin:-3, ymax:5 });
  var A = { w:0, ax:0, amp:0, per:0, flag:null, done:0 };
  p.render = function(){
    var pen = css("--pen"), td = css("--p-d");
    p.draw({ xTicks:{ step:PI / 4, pi:true }, yTicks:{ step:1 },
      describe:"The wave y = 3 sin[2(x − π/6)] + 1. " + (A.done ? "Axis y = 1, amplitude 3, period π, and four start flags: π/6, 5π/12, 2π/3 and 11π/12." : "Drawing the wave."),
      after:function(ctx, P){
        if (A.w > 0) P.curve({ f:h, color:pen, width:3, domain:[-PI / 2, -PI / 2 + 2 * PI * A.w] });
        if (A.ax > 0) { hLine(P, 1, css("--p-c"), A.ax); if (A.ax > 0.95) ctext(P, L.axis || "axis *y* = 1", P.W - 6, P.Y(1) + 13, { align:"right", color:css("--p-c") }); }
        if (A.amp > 0) vbr(P, 5 * T12, 1, 4, css("--acol"), A.amp, L.amp || "3", -10);
        if (A.per > 0) hbr(P, 5 * T12, 17 * T12, P.Y(4.55), css("--p-k"), A.per, L.per || "period π");
        if (A.done) starts.forEach(function(s){ flagAt(P, s.x, h(s.x), td); });
        else if (A.flag) flagAt(P, A.flag.x, h(A.flag.x), td, { alpha:A.flag.a == null ? 1 : A.flag.a });
      } });
  };
  function cap(i){ f.cap.innerHTML = m(eqSrc(starts[i].e)); }
  function final(){
    A = { w:1, ax:1, amp:1, per:1, flag:null, done:1 }; p.render();
    f.cap.innerHTML = '<span class="hero-list">' + starts.map(function(s){ return "<span>" + m(eqSrc(s.e)) + "</span>"; }).join("") + '<span class="hero-done">' + (L.done || "") + "</span></span>";
  }
  if (MV.reduceMotion) { final(); return; }
  p.render();
  function glide(i, done){ var x0 = starts[i - 1].x, x1 = starts[i].x; MV.tween({ dur:700, step:function(t){ A.flag = { x:x0 + (x1 - x0) * t }; p.render(); }, done:function(){ cap(i); MV.wait(1200, done); } }); }
  MV.tween({ dur:1200, ease:function(t){ return t; }, step:function(t){ A.w = t; p.render(); }, done:function(){
    MV.tween({ dur:600, step:function(t){ A.ax = t; p.render(); }, done:function(){
      MV.tween({ dur:500, step:function(t){ A.amp = t; p.render(); }, done:function(){
        MV.tween({ dur:600, step:function(t){ A.per = t; p.render(); }, done:function(){
          MV.tween({ dur:350, step:function(t){ A.flag = { x:starts[0].x, a:t }; p.render(); }, done:function(){
            cap(0);
            MV.wait(1200, function(){ glide(1, function(){ glide(2, function(){ glide(3, final); }); }); });
          } });
        } });
      } });
    } });
  } });
}

// ---------- Explore: "Read the wave" ----------
var WV = { A:["sin", 3, 2, 2, 1], B:["cos", 2, 3, 2, 3], C:["cos", 4, 0.5, 4, -1], D:["cos", 2.5, 1, 4, 0.5], E:["sin", 3, 1.5, -2, -1] };
var VIEW = { xmin:-TAU, xmax:TAU, ymin:-6, ymax:6 };
function galKeys(wv){ var out = { sin:[], cos:[], nsin:[], ncos:[] }, R = { up:"sin", max:"cos", down:"nsin", min:"ncos" }; keyPts(E(WV[wv]), -TAU, TAU).forEach(function(k){ out[R[k.t]].push(k.n); }); return out; }
var galCountA = function(){ return 0; };

function explore(host, api){
  var C = api.content, U = C.ui, ST = U.st, S = api.S, CH = C.challenges;
  if (!S.mode) { S.mode = "read"; S.wave = "A"; S.marks = []; S.tools = [1, 1, 1]; S.drawn = false; }
  S.b = S.b || {}; S.gal = S.gal || {}; S.gb = S.gb || "cos"; if (S.gd == null) S.gd = 5; S.seen = S.seen || {};
  if (S.open && (MV.S.chal[S.open] || {}).solved) S.open = null;
  var V = { ring:null, press:false, an:{ axis:1, amp:1, per:1, copy:1, curve:1, gapA:1, eA:1, sweep:1, drop:1 }, thick:false, busy:false, gd:S.gd, off:0, glow:null,
    perLab:2, hidePerRow:false, p3arrow:false, was:null, lastAdd:null, newSlot:null, dropN:null, stop:null };

  var waveChips = ["A", "B", "C", "D"].map(function(w){ return { v:w, t:w }; });
  host.innerHTML = '<div class="sx"><div class="sx-top">' +
    '<div class="ctl-row"><span class="ctl-lab">' + U.mode + "</span>" + radioHTML("md", U.mode, [{ v:"read", t:U.modes[0] }, { v:"gallery", t:U.modes[1] }], "sx-md") + "</div>" +
    '<div class="ctl-row"><span class="ctl-lab">' + U.wave + "</span>" + radioHTML("wv", U.wave, waveChips) + '<span class="tiny muted" id="sx-glock"></span></div></div>' +
    '<div class="lockbar" id="sx-lock" hidden><span></span><button type="button" class="btn ghost sm" data-act="leave" data-k="leave">' + U.leave + "</button></div>" +
    '<div class="sx-main"><div class="sx-g" data-mv="graph"><div class="eq-cap sx-cap" id="sx-cap"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot" id="sx-plot" tabindex="0" role="img" aria-label="Graph"></canvas></div><p class="sx-note" id="sx-note" aria-live="polite"></p></div>' +
    '<div class="sx-r"><dl class="read" id="sx-read" aria-live="polite"></dl></div>' +
    '<div class="sx-c"><div id="sx-cr"><div class="ctl-row"><span class="ctl-lab">' + U.toolsLab + "</span>" + U.tools.map(function(t, i){ return '<button type="button" class="tog tog-' + "akc".charAt(i === 0 ? 2 : i === 1 ? 0 : 1) + '" data-tool="' + i + '" data-k="tool' + i + '" aria-pressed="true">' + t + "</button>"; }).join("") +
    '<button type="button" class="btn ghost sm" data-act="clear" data-k="clear">' + U.clear + "</button></div>" +
    '<p class="ctl-lab sx-bl">' + U.build + '</p><div id="sx-bld"></div><p class="sx-err" id="sx-err" aria-live="polite"></p>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-act="draw" data-k="draw">' + U.draw + '</button><button type="button" class="btn primary sm" data-act="chk" data-k="chk" hidden>' + U.check + '</button><button type="button" class="btn ghost sm" data-act="reset" data-k="reset">' + U.reset + "</button></div></div>" +
    '<div id="sx-cg" hidden><div class="ctl-row"><span class="ctl-lab">' + U.base + "</span>" + radioHTML("gb", U.base, [{ v:"sin", t:m("sin") }, { v:"cos", t:m("cos") }, { v:"nsin", t:m("-sin") }, { v:"ncos", t:m("-cos") }]) + "</div>" +
    '<div class="ctl-slide"><div class="slider-top"><label for="sx-d">' + U.flag + '</label><output id="sx-dout" class="p-d"></output></div><div class="sl-row"><button type="button" class="btn ghost sqb" data-act="dm" data-k="dm" aria-label="Move the flag left by pi over 12">' + MINUS + '</button><input type="range" id="sx-d" min="-24" max="24" step="1" value="5"><button type="button" class="btn ghost sqb" data-act="dp" data-k="dp" aria-label="Move the flag right by pi over 12">+</button></div></div>' +
    '<div class="ctl-row"><button type="button" class="tog tog-d" data-act="all" data-k="all" aria-pressed="false">' + U.showAll + '</button><button type="button" class="btn ghost sm" data-act="reset" data-k="reset2">' + U.reset + "</button></div></div></div></div>" +
    '<div class="sx-board" id="sx-board" hidden><h3>' + U.board + '</h3><p class="tiny muted">' + U.boardIntro + '</p><div class="tbl-wrap bd-wrap"><table class="bd" id="sx-bd"></table></div><div id="sx-bdn" aria-live="polite"></div></div></div>';
  var plot = new MV.Plot($("#sx-plot", host), VIEW), cv = plot.c, slider = $("#sx-d", host);
  var bld = builder($("#sx-bld", host), { key:"sxb", st:S.b, base:"chips", label:U.build, onChange:function(){ $("#sx-err", host).textContent = ""; api.save(); settle(false); }, onEnter:function(){ if (S.open) clickCheck(); else draw(); } });

  function wave(){ return E(WV[S.wave]); }
  function chal(id){ return byId(CH, id); }
  function solved(id){ return !!(MV.S.chal[id] || {}).solved; }
  function galOpen(){ return solved("tc1") && solved("tc2"); }
  function seenNow(){ return !S.open || !!S.seen[S.open]; }
  function userEq(){ var r = bld.read(); return r.ok && !r.dOut ? r.e : null; }
  function showUser(){ return S.mode === "read" && S.drawn && seenNow() && !!userEq(); }
  function waveShown(){ return S.wave !== "E" || !!S.seen.tc3; }
  function galEq(dd){ var w = wave(), neg = S.gb.charAt(0) === "n"; return { f:neg ? S.gb.slice(1) : S.gb, a:(neg ? -1 : 1) * Math.abs(w.a), k:w.k, d:(dd == null ? V.gd + V.off : dd) * T12, c:w.c }; }
  function gal(w){ return S.gal[w] || (S.gal[w] = { sin:[], cos:[], nsin:[], ncos:[] }); }
  function galCount(w){ var g = gal(w); return g.sin.length + g.cos.length + g.nsin.length + g.ncos.length; }
  galCountA = function(){ return galCount("A"); };
  function note(t){ $("#sx-note", host).innerHTML = t || ""; }
  function quarter(){ return Math.round(6 / wave().k); }
  function firstMax(w){ var ks = keyPts(E(WV[w]), -1e-9, TAU); for (var i = 0; i < ks.length; i++) if (ks[i].t === "max") return ks[i].n; return 0; }
  function anim(prop, dur, done){ V.an[prop] = 0; MV.tween({ dur:dur, step:function(t){ V.an[prop] = t; plot.render(); }, done:function(){ V.an[prop] = 1; plot.render(); if (done) done(); } }); }

  // ----- measuring from the markers -----
  function marks(){ var ks = keyPts(wave(), VIEW.xmin, VIEW.xmax); return S.marks.map(function(n){ return ks.filter(function(k){ return k.n === n; })[0]; }).filter(Boolean).sort(function(a, b){ return a.x - b.x; }); }
  function relOf(p, q, ks){
    var bt = ks.filter(function(k){ return k.x > p.x + 1e-9 && k.x < q.x - 1e-9; }), ext = function(t){ return t === "max" || t === "min"; };
    if (p.t === q.t && ext(p.t)) return bt.some(function(k){ return k.t === p.t; }) ? 0 : 1;
    if (ext(p.t) && ext(q.t)) return bt.some(function(k){ return ext(k.t); }) ? 0 : 2;
    if (!ext(p.t) && !ext(q.t)) return bt.some(function(k){ return !ext(k.t); }) ? 0 : 2;
    return bt.length ? 0 : 4;
  }
  function measure(){
    var mk = marks(), ks = keyPts(wave(), VIEW.xmin, VIEW.xmax), o = { mk:mk };
    var mx = mk.filter(function(k){ return k.t === "max"; })[0], mn = mk.filter(function(k){ return k.t === "min"; })[0], cr = mk.filter(function(k){ return k.t === "up" || k.t === "down"; })[0];
    o.mx = mx; o.mn = mn; o.cr = cr;
    if (mx && mn) o.axis = { c:(mx.y + mn.y) / 2, how:"mm" }; else if (cr) o.axis = { c:cr.y, how:"x" };
    if (mx && mn) o.amp = { v:(mx.y - mn.y) / 2, how:"mm", at:mx, c:(mx.y + mn.y) / 2 }; else if (cr && (mx || mn)) o.amp = { v:Math.abs((mx || mn).y - cr.y), how:mx ? "xmax" : "xmin", at:mx || mn, c:cr.y };
    for (var i = 0; i < mk.length; i++) for (var j = i + 1; j < mk.length; j++) {
      var r = relOf(mk[i], mk[j], ks), dist = mk[j].x - mk[i].x;
      if (r && (!o.per || dist < o.per.dist - 1e-9)) o.per = { p:mk[i], q:mk[j], rel:r, dist:dist, P:r * dist, key:mk[i].n + "|" + mk[j].n };
    }
    return o;
  }
  function marksChanged(prev){
    var a = measure();
    if (a.axis && (!prev.axis || !near(a.axis.c, prev.axis.c))) anim("axis", 600);
    if (a.amp && (!prev.amp || a.amp.at.n !== prev.amp.at.n || a.amp.how !== prev.amp.how)) anim("amp", 500);
    if (a.per && (!prev.per || a.per.key !== prev.per.key)) { V.an.copy = 0; anim("per", 500, function(){ anim("copy", 300 * Math.max(1, a.per.rel - 1)); }); }
  }
  function toggleMark(n){
    var prev = measure(), i = S.marks.indexOf(n);
    if (i >= 0) S.marks.splice(i, 1);
    else if (S.marks.length >= 3) { note(U.tapMax); return; }
    else { S.marks.push(n); V.dropN = n; anim("drop", 250); }
    note(""); api.save(); marksChanged(prev); paint();
  }
  function nearestKey(ev){
    var r = cv.getBoundingClientRect(), px = ev.clientX - r.left, py = ev.clientY - r.top, best = null, bd = 28;
    keyPts(wave(), VIEW.xmin, VIEW.xmax).forEach(function(k){ var d = Math.hypot(plot.X(k.x) - px, plot.Y(k.y) - py); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  // ----- drawing -----
  plot.render = function(){
    var nar = narrow(plot), w = wave(), wf = fnOf(w), ink2 = css("--ink-2"), pen = css("--pen"), td = css("--p-d"), tc = S.open, mz = measure();
    plot.draw({ view:VIEW, xTicks:{ step:nar ? PI : PI / 2, pi:true }, yTicks:{ step:nar ? 2 : 1 }, describe:describe(mz),
      after:function(ctx, p){
        minorTicks(p);
        if (S.mode === "read") {
          var ue = showUser() ? userEq() : null, uf = ue ? fnOf(ue) : null;
          if (uf && waveShown()) shade(p, uf, wf, V.an.gapA * (V.an.curve >= 1 ? 1 : 0));
          if (waveShown()) p.curve({ f:wf, color:ink2, width:2.4, dash:[6, 6], alpha:S.wave === "E" ? V.an.eA : 1 });
          if (uf) {
            p.curve({ f:uf, color:pen, width:V.thick ? 3.4 : 3, domain:[VIEW.xmin, VIEW.xmin + (VIEW.xmax - VIEW.xmin) * V.an.curve] });
            if (V.an.curve >= 1 && ue.d >= VIEW.xmin && ue.d <= VIEW.xmax) flagAt(p, ue.d, uf(ue.d), td, { h:20, r:3.5 });
          }
          if (S.wave === "E") { ring(p, 2 * T12, 2, U.tc3pts[0]); ring(p, 6 * T12, -1, U.tc3pts[1], { dy:16 }); }
          else {
            var lab = tc === "tc1" || tc === "tc2";
            if (S.tools[0] && mz.axis) { hLine(p, mz.axis.c, css("--p-c"), V.an.axis); if (V.an.axis > 0.95) ctext(p, lab ? "axis" : "*y* = " + cm(frS(mz.axis.c)), p.W - 6, p.Y(mz.axis.c) - 12, { align:"right", color:css("--p-c") }); }
            if (S.tools[1] && mz.amp) vbr(p, mz.amp.at.x, mz.amp.c, mz.amp.at.y, css("--acol"), V.an.amp, lab ? "|*a*|" : "|*a*| = " + cm(frS(mz.amp.v)));
            if (S.tools[2] && mz.per) {
              var pr = mz.per, Yb = Math.min(p.H - 44, Math.max(p.Y(lo(w)) + 24, p.Y(0) + 34)), ok = css("--p-k"), dl = piT(pr.dist), rel = U.perBr[pr.rel];
              var l1 = lab ? (pr.rel === 1 ? U.perBr["1"] : rel) : pr.rel === 1 ? "period " + dl : (V.perLab ? dl + ": " + rel : dl);
              hbr(p, pr.p.x, pr.q.x, Yb, ok, V.an.per, l1, { below:true });
              if (pr.rel > 1 && V.an.per >= 1) {
                var n = pr.rel - 1, tt = V.an.copy * n;
                for (var i = 0; i < n; i++) { var f = Math.max(0, Math.min(1, tt - i)); if (f > 0) hbr(p, pr.q.x + i * pr.dist, pr.q.x + (i + 1) * pr.dist, Yb, ok, f, "", { dash:[2, 4], w:2 }); }
                if (V.an.copy >= 1 && V.perLab > 1) ctext(p, lab ? U.perBr["1"] : "period " + piT(pr.P), p.X(pr.p.x + pr.P / 2), Yb + 31, { align:"center", color:ok });
              }
            }
            mz.mk.forEach(function(k){
              var dropping = V.dropN === k.n && V.an.drop < 1, yy = dropping ? k.y + (1 - V.an.drop) * 1.2 : k.y;
              p.point({ x:k.x, y:yy, r:6, color:css("--ink"), ring:true });
              if (!dropping) ctext(p, ICON[k.t] + " " + ptS(k.x, k.y).replace(/-/g, MINUS), p.X(k.x), p.Y(k.y) + (k.t === "min" ? 20 : -20), { align:"center", size:13 });
            });
            if (V.ring != null) { var rk = keyPts(w, VIEW.xmin, VIEW.xmax).filter(function(k){ return k.n === V.ring; })[0]; if (rk) { ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p.X(rk.x), p.Y(rk.y), 12, 0, TAU); ctx.stroke(); ctx.restore(); } }
          }
        } else {
          var ge = galEq(), gf = fnOf(ge), gd = V.gd * T12, G = gal(S.wave), all = keyPts(w, VIEW.xmin, VIEW.xmax);
          shade(p, gf, wf, 1);
          p.curve({ f:wf, color:ink2, width:2.4, dash:[6, 6] });
          if (S.all) all.forEach(function(k){ iconAt(p, k.t, k.x, k.y, td, 0.35); });
          ["sin", "cos", "nsin", "ncos"].forEach(function(r){ G[r].forEach(function(n){ var x = n * T12; iconAt(p, ROWT[r], x, wf(x), td, 1, V.glow === n); }); });
          if (V.an.sweep < 1) { var P = TAU / w.k; ctx.save(); ctx.globalAlpha = 0.55; p.curve({ f:wf, color:css("--hi"), width:11, domain:[gd, gd + P * V.an.sweep] }); ctx.restore(); }
          p.curve({ f:gf, color:pen, width:V.thick ? 3.4 : 3 });
          if (Math.abs(gd) > 1e-6) { p.segment({ x1:0, y1:0, x2:gd, y2:0, color:td, width:2.5, arrow:Math.abs(gd) > 0.2 }); ctext(p, "*d* = " + piT(Math.round(V.gd) * T12), p.X(gd / 2), p.Y(0) - 15, { align:"center", color:td }); }
          ctx.save(); ctx.fillStyle = td; var X = p.X(gd), Y0 = p.Y(0); ctx.beginPath(); ctx.moveTo(X, Y0); ctx.lineTo(X - 8, Y0 + 13); ctx.lineTo(X + 8, Y0 + 13); ctx.closePath(); ctx.fill(); ctx.restore();
          flagAt(p, gd, gf(gd), td);
          if (V.p3arrow) { p.segment({ x1:5 * T12, y1:4.6, x2:8 * T12, y2:4.6, color:td, width:2.5, arrow:true }); ctext(p, U.p3arrow, p.X(6.5 * T12), p.Y(4.6) - 15, { align:"center", color:td }); }
        }
      } });
  };
  function describe(mz){
    var w = S.wave;
    if (S.mode === "gallery") { var at = atKey(); return "Gallery, wave " + w + ": the flag is at " + piT(Math.round(V.gd) * T12) + (at ? ", " + MV.plain(at) : "") + ". " + galCount(w) + " of " + totals(w) + " equations found."; }
    var s = w === "E" ? (waveShown() ? "Wave E, dashed, now shown. " : "Wave E is hidden. Two points: maximum (π/6, 2) and axis crossing (π/2, −1). ") : "Mystery wave " + w + ", dashed. ";
    if (mz.mk.length) s += "Markers: " + mz.mk.map(function(k){ return U.words[k.t] + " at " + cm(ptS(k.x, k.y)); }).join(", ") + ". ";
    var ue = showUser() ? userEq() : null;
    if (ue) { var stt = waveShown() ? status(ue, wave(), ST) : null; s += "Your graph, " + MV.plain(m(eqSrc(ue))) + (waveShown() ? (stt ? ": " + MV.plain(stt.html) : ", matches it at every x.") : "."); }
    return s;
  }
  function totals(w){ var g = galKeys(w); return g.sin.length + g.cos.length + g.nsin.length + g.ncos.length; }
  function atKey(){
    var w = wave(), n = Math.round(V.gd), x = n * T12, k = keyPts(w, x - 1e-6, x + 1e-6)[0], A = U.at;
    if (k) return k.t === "max" || k.t === "min" ? fill(A[k.t], { pt:m(ptS(x, k.y, true)) }) : A[k.t];
    var y = val(w, x), dy = val(w, x + 1e-5) - y;
    return fill(A.between, { dir:dy > 0 ? A.rising : A.falling, side:y > w.c ? A.above : A.below, y:m("y " + (rat(y, 4) ? "= " : "") + valS(y)) });
  }

  // ----- readout -----
  function paintRead(){
    var el = $("#sx-read", host), w = wave(), R = U.read;
    if (S.mode === "gallery") {
      var ge = galEq(Math.round(V.gd)), stt = status(ge, w, ST), key = S.gb + "|" + Math.round(V.gd);
      var sh = stt ? stt.html : (V.lastAdd === key ? ST.added : ST.already);
      el.innerHTML = MV.readoutHTML([[U.gread[0], U.bases[S.gb]], [U.gread[1], m("@d{d} = " + piX(Math.round(V.gd) * T12, true))], [U.gread[2], m(eqSrc(ge, true))],
        [U.gread[3], atKey()], [U.gread[4], '<span class="' + (stt ? "" : "st-good") + '">' + sh + "</span>"], [U.gread[5], fill(U.count, { n:galCount(S.wave), N:totals(S.wave), w:S.wave })]]);
      return;
    }
    var mz = measure(), tc = S.open, hidden = S.wave === "E", rows = [[R[0], U.waveNames[S.wave]]];
    rows.push([R[1], hidden ? U.tapHidden : mz.mk.length ? mz.mk.map(function(k){ return U.types[k.t] + " " + m(ptS(k.x, k.y, true)); }).join(" · ") : '<span class="muted">' + U.noMarks + "</span>"]);
    var der = [];
    if (hidden) der = [U.tapHidden, U.tapHidden, U.tapHidden, U.tapHidden];
    else if (tc === "tc2") der = [U.hidden, U.hidden, U.hidden, U.hidden];
    else {
      var q = tc === "tc1", ax = mz.axis, am = mz.amp, pr = mz.per;
      der.push(!ax ? U.axisNeed : ax.how === "mm" ? (q ? m("(" + frS(mz.mx.y) + " + " + par(mz.mn.y) + ") ÷ 2 = ?") : fill(U.axisMM, { y:m("y = " + frS(ax.c)), max:m(frS(mz.mx.y)), min:m(frS(mz.mn.y)), calc:m("(" + frS(mz.mx.y) + " + " + par(mz.mn.y) + ") ÷ 2") }))
        : (q ? m("y = ?") + ", " + U.words[mz.cr.t] : fill(U.axisX, { y:m("y = " + frS(ax.c)) })));
      der.push(!am ? (mz.cr ? U.ampNeedX : U.ampNeed) : am.how === "mm" ? (q ? m("(" + frS(mz.mx.y) + " - " + par(mz.mn.y) + ") ÷ 2 = ?") : fill(U.ampMM, { v:m(frS(am.v)), min:m(frS(mz.mn.y)), max:m(frS(mz.mx.y)), calc:m("(" + frS(mz.mx.y) + " - " + par(mz.mn.y) + ") ÷ 2") }))
        : am.how === "xmax" ? (q ? m(frS(am.at.y) + " - " + par(am.c) + " = ?") : fill(U.ampXmax, { v:m(frS(am.v)), axis:m("y = " + frS(am.c)), max:m(frS(am.at.y)) }))
        : (q ? m(frS(am.c) + " - " + par(am.at.y) + " = ?") : fill(U.ampXmin, { v:m(frS(am.v)), axis:m("y = " + frS(am.c)), min:m(frS(am.at.y)) })));
      if (V.hidePerRow) der.push("?", "?");
      else if (!pr) der.push(U.perNeed, U.kNeed);
      else if (q) der.push(m((pr.rel > 1 ? pr.rel + " × " : "") + "(" + piX(pr.q.x) + " - " + (pr.p.x < 0 ? "(" + piX(pr.p.x) + ")" : piX(pr.p.x)) + ") = ?"), m("2π ÷") + " period = ?");
      else {
        var ps = piX(pr.P);
        der.push(fill(U.per, { P:m(piX(pr.P, true)), t1:U.words[pr.p.t], x1:m(piX(pr.p.x, true)), t2:U.words[pr.q.t], x2:m(piX(pr.q.x, true)), rel:U.rel[pr.rel], dist:m(piX(pr.dist, true)) }),
          fill(U.kRow, { k:m(frS(TAU / pr.P)), P:m(ps.indexOf("/") >= 0 ? "(" + ps + ")" : ps) }));
      }
    }
    rows.push([R[2], der[0]], [R[3], der[1]], [R[4], der[2]], [R[5], der[3]]);
    var r = bld.read();
    rows.push([R[6], r.ok ? m(eqSrc(r.e, true)) : '<span class="muted">' + U[r.why] + "</span>"]);
    if (showUser() && waveShown()) {
      var ue = userEq(), st2 = status(ue, w, ST), g = gapOf(fnOf(ue), fnOf(w), VIEW.xmin, VIEW.xmax);
      rows.push([R[7], st2 ? g.toFixed(2) : "0.00"], [R[8], st2 ? st2.html : '<span class="st-good">' + ST.match + "</span>"]);
    } else { var msg = S.open && !seenNow() ? U.commit : U.notDrawn; rows.push([R[7], '<span class="muted">' + msg + "</span>"], [R[8], '<span class="muted">' + msg + "</span>"]); }
    el.innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    if (S.mode === "gallery") { $("#sx-cap", host).innerHTML = m(eqSrc(galEq(Math.round(V.gd)), true)); return; }
    var r = bld.read(); $("#sx-cap", host).innerHTML = r.ok ? m(eqSrc(r.e, true)) : "";
  }
  // ----- controls -----
  function paintCtl(){
    var b = V.busy, lockC = !!S.open, gl = S.mode === "gallery" && !galOpen();
    radioSet(host, "md", S.mode, b || lockC);
    radioSet(host, "wv", S.wave === "E" ? "" : S.wave, function(v){ return b || lockC || (gl && v !== "A"); });
    $("#sx-glock", host).innerHTML = gl ? U.galLock : "";
    $("#sx-cr", host).hidden = S.mode !== "read"; $("#sx-cg", host).hidden = S.mode !== "gallery"; $("#sx-board", host).hidden = S.mode !== "gallery";
    $$("[data-tool]", host).forEach(function(t, i){ t.setAttribute("aria-pressed", !!S.tools[i]); t.disabled = b || lockC; });
    $('[data-act="clear"]', host).disabled = b || S.wave === "E";
    bld.disable(b);
    var dr = $('[data-act="draw"]', host), ck = $('[data-act="chk"]', host);
    ck.hidden = !S.open; dr.hidden = !!S.open && !S.seen[S.open]; dr.disabled = b; ck.disabled = b;
    $$('[data-act="reset"]', host).forEach(function(x){ x.disabled = b; });
    var lb = $("#sx-lock", host);
    if (S.open) { lb.hidden = false; $("span", lb).innerHTML = fill(U.lock, { n:S.open.slice(-1), w:U.waveNames[S.wave] }); $("button", lb).disabled = b; } else lb.hidden = true;
    radioSet(host, "gb", S.gb, b);
    slider.value = Math.round(V.gd); slider.disabled = b; slider.setAttribute("aria-valuetext", "d = " + piSay(Math.round(V.gd) * T12));
    $("#sx-dout", host).innerHTML = m("@d{d} = " + piX(Math.round(V.gd) * T12));
    $$('[data-act="dm"], [data-act="dp"]', host).forEach(function(x){ x.disabled = b; });
    var al = $('[data-act="all"]', host); al.setAttribute("aria-pressed", !!S.all); al.disabled = b;
  }
  function paintBoard(){
    if (S.mode !== "gallery") return;
    var G = gal(S.wave), K = galKeys(S.wave), w = wave(), P = TAU / w.k, h = "<tbody>";
    ["sin", "cos", "nsin", "ncos"].forEach(function(r, ri){
      var f = G[r].slice().sort(function(a, b){ return a - b; }), row = U.rows[ri];
      h += '<tr><th scope="row">' + m(row[0].replace("−", "-")) + '<span class="bd-sub">' + row[1] + "</span></th>";
      for (var i = 0; i < K[r].length; i++) {
        var n = f[i], has = n != null, nw = has && V.newSlot === r + "|" + n;
        h += "<td>" + (has ? '<button type="button" class="bd-c found' + (nw ? " drop" : "") + '" data-slot="' + r + "|" + n + '" data-k="bd' + r + n + '" aria-label="' + MV.esc(MV.plain(row[0]) + " row: d = " + piSay(n * T12)) + '">' + m("d = " + piX(n * T12, true)) + "</button>"
          : '<button type="button" class="bd-c" disabled aria-label="' + MV.esc(MV.plain(row[0]) + " row: " + U.notTaken) + '"></button>') + "</td>";
      }
      h += "</tr>";
    });
    MV.keepFocus($("#sx-bd", host), function(){ $("#sx-bd", host).innerHTML = h + "</tbody>"; });
    V.newSlot = null;
    var notes = [], rows = ["sin", "cos", "nsin", "ncos"];
    if (rows.some(function(r){ return G[r].length >= 2; })) notes.push(fill(U.noteTwo, { P:m(piX(P)) }));
    if (rows.every(function(r){ return G[r].length >= 1; })) notes.push(fill(U.noteRows, { Q:m(piX(P / 4)) }));
    if (galCount(S.wave) >= totals(S.wave)) notes.push(fill(U.noteFull, { N:totals(S.wave) }));
    $("#sx-bdn", host).innerHTML = notes.map(function(t){ return '<p class="tiny">' + t + "</p>"; }).join("");
  }
  function paint(){ paintCtl(); paintRead(); paintCap(); plot.render(); paintBoard(); }
  // after every change: match animation and the gallery
  function settle(animate){
    var w = wave(), match = false;
    if (S.mode === "gallery") {
      var n = Math.round(V.gd); match = near(V.gd, n) && same(galEq(n), w);
      if (match) { var G = gal(S.wave); if (G[S.gb].indexOf(n) < 0) { G[S.gb].push(n); V.lastAdd = S.gb + "|" + n; V.newSlot = S.gb + "|" + n; api.save(); anim("sweep", 800); } }
    } else match = showUser() && waveShown() && same(userEq(), w);
    if (match && V.was === false && animate !== false) {
      V.thick = true; MV.wait(600, function(){ V.thick = false; plot.render(); });
      if (S.mode === "read") MV.tween({ dur:400, step:function(t){ V.an.gapA = 1 - t; plot.render(); }, done:function(){ V.an.gapA = 1; } });
    }
    V.was = match; paint(); MV.changed();
  }
  function draw(){
    var r = bld.read(), err = $("#sx-err", host);
    if (!r.ok) { err.innerHTML = U[r.why]; return; }
    if (r.dOut) { err.innerHTML = U.dRange; return; }
    err.textContent = ""; S.drawn = true; V.was = false; api.save();
    V.an.gapA = 0; paint();
    anim("curve", 1000, function(){ MV.tween({ dur:300, step:function(t){ if (!same(userEq() || {}, wave())) V.an.gapA = t; plot.render(); }, done:function(){ V.an.gapA = 1; settle(); } }); });
  }
  function clickCheck(){ var b = $('#chal [data-c="' + S.open + '"] [data-act="check"]'); if (b) b.click(); }

  // ----- gallery: the start flag -----
  function setGd(n, glide, done){
    n = Math.max(-24, Math.min(24, Math.round(n)));
    if (V.stop) { V.stop(); V.stop = null; }
    var from = V.gd; S.gd = n; api.save();
    if (!glide || Math.abs(n - from) <= 1 || MV.reduceMotion) { V.gd = n; settle(); if (done) done(); return; }
    var live = true; V.stop = function(){ live = false; V.gd = n; };
    MV.tween({ dur:Math.min(1500, 1000 + Math.abs(n - from) * 40), step:function(t){ if (!live) return; V.gd = from + (n - from) * t; plot.render(); }, done:function(){ if (!live) return; V.stop = null; V.gd = n; settle(); if (done) done(); } });
  }
  function galKey(e){
    if (V.busy) return true;
    var q = quarter(), k = e.key, d = 0;
    if (k === "ArrowRight" || k === "ArrowUp") d = e.shiftKey ? q : 1; else if (k === "ArrowLeft" || k === "ArrowDown") d = e.shiftKey ? -q : -1;
    else if (k === "PageUp") d = q; else if (k === "PageDown") d = -q;
    else if (k === "Home") { setGd(-24, true); return true; } else if (k === "End") { setGd(24, true); return true; }
    else return false;
    setGd(Math.round(V.gd) + d, Math.abs(d) > 1); return true;
  }
  var drag = MV.drag(plot, { axis:"x", step:{ x:T12 },
    handles:function(){ return S.mode === "gallery" && !V.busy ? [{ id:"d", x:V.gd * T12, y:0, label:"Start flag, d = " + piSay(Math.round(V.gd) * T12) + ". Arrow keys move it." }] : []; },
    snap:function(x){ return [Math.round(x / T12) * T12, 0]; },
    move:function(id, x){ var n = Math.round(x / T12); if (n !== Math.round(V.gd)) { if (V.stop) { V.stop(); V.stop = null; } V.gd = Math.max(-24, Math.min(24, n)); S.gd = V.gd; api.save(); settle(); } },
    key:function(id, e){ return galKey(e); } });

  // ----- mode, wave, challenges -----
  function setMode(md){ if (S.open || V.busy) return; S.mode = md; if (md === "gallery") { if (!galOpen() && S.wave !== "A") { S.wave = "A"; S.gb = "cos"; S.gd = firstMax("A"); } V.gd = S.gd; } V.ring = null; V.was = null; note(""); api.save(); settle(false); }
  function setWave(w){ if (S.open || V.busy || w === S.wave) return; S.wave = w; S.marks = []; V.ring = null; if (S.mode === "gallery") { S.gb = "cos"; S.gd = firstMax(w); V.gd = S.gd; } V.was = null; note(""); api.save(); settle(false); }
  function openChal(id){
    if (S.open === id || V.busy || solved(id)) return;
    var c = chal(id); S.open = id; S.mode = "read";
    if (S.wave !== c.wave) { S.wave = c.wave; S.marks = []; }
    S.drawn = false; S.tools = id === "tc3" ? [0, 0, 0] : [1, 1, 1]; V.ring = null; V.was = null;
    if (id === "tc3") V.an.eA = S.seen.tc3 ? 1 : 0;
    note(""); api.save(); paint();
  }
  function leave(){ S.open = null; if (S.wave === "E") { S.wave = "A"; S.marks = []; } S.tools = [1, 1, 1]; S.drawn = false; V.was = null; api.save(); paint(); MV.changed(); }
  function reset(){
    if (V.stop) { V.stop(); V.stop = null; }
    S.open = null; S.mode = "read"; S.wave = "A"; S.marks = []; S.tools = [1, 1, 1]; S.drawn = false;
    ["a", "k", "d", "c"].forEach(function(w){ S.b[w] = { s:1, n:"", d:1 }; }); S.b.f = "cos"; bld.repaint();
    V.ring = null; V.was = null; V.off = 0; V.p3arrow = false; V.glow = null; V.hidePerRow = false; V.perLab = 2; note(""); MV.banner("", ""); $("#sx-err", host).textContent = ""; api.save(); paint(); MV.changed();
  }
  function namedMsg(c, e, w){
    var N = c.named, grp = !near(e.k, w.k) ? "k" : (!near(hi(e), hi(w)) || !near(lo(e), lo(w))) ? "h" : "d";
    for (var i = 0; i < N.length; i++) {
      var n = N[i], g = n.on === "k" ? "k" : n.on === "d" ? "d" : "h"; if (g !== grp) continue;
      if ((n.on === "k" && near(e.k, n.v, 1e-6)) || (n.on === "a" && near(e.a, n.v) && near(e.c, w.c)) || (n.on === "c" && near(e.c, n.v)) ||
        (n.on === "ac" && near(e.a, n.v[0]) && near(e.c, n.v[1])) || (n.on === "d" && n.v.some(function(v){ return near(e.d, v * T12); }))) return n.msg;
    }
    var s = status(e, w, ST); return s ? s.html : "";
  }
  function challenge(id, opt){
    if (opt && opt.live) return { ok:false };
    var c = chal(id); if (V.busy) return uncounted(id, "");
    openChal(id);
    var r = bld.read();
    if (!r.ok) return uncounted(id, U[r.why]);
    if (r.dOut) return uncounted(id, U.dRange);
    var e = r.e, w = wave();
    if (e.f !== c.form[0] || (e.a < 0 ? -1 : 1) !== c.form[1]) return uncounted(id, c.form_msg);
    var first = !S.seen[id]; S.seen[id] = true; S.drawn = true; V.was = false; api.save();
    if (id === "tc3" && first) anim("eA", 600);
    V.an.gapA = 0; paint();
    anim("curve", 1000, function(){ V.an.gapA = 1; settle(); });
    if (same(e, w)) { MV.wait(1500, function(){ if (S.open === id) leave(); }); return { ok:true }; }
    return { ok:false, msg:namedMsg(c, e, w) };
  }

  // ----- events -----
  function pick(g, v){ if (V.busy) return; if (g === "md") setMode(v); else if (g === "wv") setWave(v); else if (g === "gb") { if (V.stop) { V.stop(); V.stop = null; } S.gb = v; V.gd = S.gd; api.save(); settle(); } }
  radioKeys(host, pick);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || V.busy) return;
    if (b.dataset.rv != null) { var g = b.closest("[data-rg]").dataset.rg; if (g === "md" || g === "wv" || g === "gb") pick(g, b.dataset.rv); return; }
    if (b.dataset.tool != null) { var i = +b.dataset.tool; S.tools[i] = S.tools[i] ? 0 : 1; api.save(); paint(); return; }
    if (b.dataset.slot) { var sp = b.dataset.slot.split("|"); S.gb = sp[0]; api.save(); setGd(+sp[1], true); return; }
    var a = b.dataset.act;
    if (a === "clear") { var pv = measure(); S.marks = []; api.save(); marksChanged(pv); paint(); }
    else if (a === "draw") draw(); else if (a === "chk") clickCheck(); else if (a === "reset") reset(); else if (a === "leave") leave();
    else if (a === "dm") setGd(Math.round(V.gd) - 1); else if (a === "dp") setGd(Math.round(V.gd) + 1);
    else if (a === "all") { S.all = !S.all; api.save(); paint(); }
  });
  slider.addEventListener("input", function(){ if (!V.busy) setGd(+slider.value, true); });
  slider.addEventListener("keydown", function(e){ if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "ArrowDown") { if (!e.shiftKey) return; } if (galKey(e) !== false) e.preventDefault(); });
  cv.addEventListener("pointerdown", function(ev){
    if (S.mode !== "read" || V.busy) return;
    if (S.wave === "E") { note(U.tapHidden); return; }
    var k = nearestKey(ev); V.press = true; V.ring = k ? k.n : null; plot.render();
  });
  cv.addEventListener("pointermove", function(ev){ if (!V.press) return; var k = nearestKey(ev), n = k ? k.n : null; if (n !== V.ring) { V.ring = n; plot.render(); } });
  cv.addEventListener("pointerup", function(ev){ if (!V.press) return; V.press = false; var k = nearestKey(ev); V.ring = null; if (k) toggleMark(k.n); else { note(U.tapFar); plot.render(); } });
  cv.addEventListener("pointercancel", function(){ V.press = false; V.ring = null; plot.render(); });
  cv.addEventListener("keydown", function(e){
    if (V.busy) return;
    if (S.mode === "gallery") { if (galKey(e)) e.preventDefault(); return; }
    if (S.wave === "E") return;
    var ks = keyPts(wave(), VIEW.xmin, VIEW.xmax);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault(); var i = -1; ks.forEach(function(k, j){ if (k.n === V.ring) i = j; });
      i = i < 0 ? (e.key === "ArrowRight" ? 0 : ks.length - 1) : Math.max(0, Math.min(ks.length - 1, i + (e.key === "ArrowRight" ? 1 : -1)));
      V.ring = ks[i].n; plot.render(); note(U.types[ks[i].t] + " " + m(ptS(ks[i].x, ks[i].y)) + (S.marks.indexOf(ks[i].n) >= 0 ? " (marked)" : ""));
    } else if ((e.key === "Enter" || e.key === " ") && V.ring != null) { e.preventDefault(); toggleMark(V.ring); }
    else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); var pv = measure(); S.marks = []; api.save(); marksChanged(pv); paint(); }
  });
  cv.addEventListener("blur", function(){ if (V.ring != null && !V.press) { V.ring = null; plot.render(); } });
  var chalHost = $("#chal");
  if (chalHost) ["focusin", "pointerdown"].forEach(function(ev){ chalHost.addEventListener(ev, function(e){ var box = e.target.closest && e.target.closest("[data-c]"); if (box) openChal(box.dataset.c); }); });

  // ----- predictions -----
  function pStart(p){
    if (V.stop) { V.stop(); V.stop = null; }
    var s = p.start; S.open = null; V.busy = true; V.off = 0; V.p3arrow = false; V.glow = null; V.ring = null; V.thick = false;
    Object.keys(V.an).forEach(function(k){ V.an[k] = 1; });
    S.mode = s.mode; S.wave = s.wave; V.was = null;
    if (s.mode === "read") { S.marks = s.marks.slice(); S.tools = s.tools.slice(); V.hidePerRow = !!s.hidePeriod; V.perLab = 0; S.drawn = false; }
    else { S.gb = s.base; S.gd = s.d; V.gd = s.d; V.hidePerRow = false; V.perLab = 2; }
    note(""); api.save(); settle(false);
  }
  function pRun(p, done){
    var end = function(){ V.busy = false; note(U.changed[p.id]); paint(); MV.changed(); done(); };
    if (p.id === "p1") {
      S.tools[2] = 1; V.an.per = 0; V.an.copy = 0; paint();
      anim("per", 500, function(){ MV.wait(500, function(){ V.perLab = 1; plot.render(); MV.wait(700, function(){ anim("copy", 800, function(){ V.perLab = 2; V.hidePerRow = false; api.save(); end(); }); }); }); });
    } else if (p.id === "p2") setGd(17, true, function(){ MV.wait(900, end); });
    else if (p.id === "p3") {
      S.gb = "sin"; V.off = -3; api.save(); paint();
      MV.tween({ dur:1000, step:function(t){ V.off = -3 + 3 * t; plot.render(); }, done:function(){
        V.off = 0; V.p3arrow = true; V.was = null; settle(false);
        MV.wait(2000, function(){ V.p3arrow = false; setGd(2, true, function(){ MV.wait(900, end); }); });
      } });
    } else if (p.id === "p4") setGd(11, true, function(){ V.glow = 11; plot.render(); MV.wait(1500, function(){ V.glow = null; end(); }); });
    else end();
  }
  MV.ACTS.gallery = { stats:function(){ var n = galCount("A"); return { first:n, total:16, done:n, line:fill(U.galLine, { n:n }) }; }, missed:function(){ return []; } };
  if (S.mode === "gallery") V.gd = S.gd;
  V.was = null; settle(false);
  return { predict:{ start:pStart, run:pRun }, challenge:challenge };
}

// ---------- Part 3: "Many right answers" ----------
// @component cycleRuler — one period under a graph on the same x-scale: five tick buttons (start, +¼, +½, +¾, +1 period) with
// key-point icons and stacked π values ("?" until revealed); positions follow the plot on every redraw.
function rulerHTML(e, U, o){
  var P = TAU / e.k, sq = seqOf(e), h = '<div class="rl-bar" data-x0="' + e.d + '" data-x1="' + (e.d + P) + '"></div>';
  for (var i = 0; i < 5; i++) {
    var x = e.d + i * P / 4, t = sq[i % 4], show = i === 0 || o.reveal, tag = o.buttons ? "button" : "span";
    h += "<" + tag + (o.buttons ? ' type="button"' : "") + ' class="rl-t' + (i === 0 ? " rl-s" : "") + (o.mark === i ? " on" : "") + '" data-tick="' + i + '" data-x="' + x + '"' + (o.buttons ? ' data-k="rl' + o.key + i + '"' + (o.dis ? " disabled" : "") : "") +
      ' aria-label="' + MV.esc(U.tickSay[i] + ": " + U.kp[t] + (show ? ", x = " + piSay(x) : "")) + '"><span class="rl-ic" aria-hidden="true">' + ICON[t] + '</span><span class="rl-lab" aria-hidden="true">' + U.ticks[i] + '</span><span class="rl-v" aria-hidden="true">' + (show ? m(piX(x, true)) : "?") + "</span></" + tag + ">";
  }
  return h + (o.drop != null ? '<span class="rl-drop" data-x="' + o.drop + '" aria-hidden="true"></span>' : "");
}
function rulerPlace(host, p){
  if (!p.v || !(p.W > 20)) return;
  $$("[data-x]", host).forEach(function(el){ el.style.left = p.X(+el.dataset.x) + "px"; });
  var b = $(".rl-bar", host); if (b) { var x0 = p.X(+b.dataset.x0); b.style.left = x0 + "px"; b.style.width = (p.X(+b.dataset.x1) - x0) + "px"; host.classList.toggle("stag", (p.X(+b.dataset.x1) - x0) / 4 < 52); }
}
function viewOf(v){ return { xmin:v[0] * T12, xmax:v[1] * T12, ymin:v[2], ymax:v[3] }; }
function xStep(p, v){ var span = v.xmax - v.xmin; return span > 4 * PI + 1e-9 || (narrow(p) && span > 2 * PI + 1e-9) ? PI : PI / 2; }
function kpA(t, U){ var w = U.kp[t]; return (/^[aeiou]/.test(w) ? "an " : "a ") + w; }

function part3(host, api){
  var C = api.content, U = C.ui, S = api.S, RW = C.rewrites, PR = C.pairs;
  S.i = S.i || 0; S.it = S.it || {}; S.j = S.j || 0; S.pr = S.pr || {};
  host.innerHTML = '<div class="rw"><h3>' + U.r1 + '</h3><p class="muted">' + U.r1intro + '</p><div class="pred-top"><span class="tiny muted" id="rw-n"></span><span class="dots" id="rw-dots" aria-hidden="true"></span></div>' +
    '<div class="rw-grid"><div class="rw-g"><div class="eq-cap rw-cap" id="rw-cap"></div><div class="plot-wrap"><canvas class="plot" id="rw-plot" role="img" aria-label="Graph"></canvas></div><div class="ruler" id="rw-rl" role="group" aria-label="Cycle ruler"></div><p class="rl-cap" id="rw-q"></p></div>' +
    '<div class="rw-p"><p class="pred-q" id="rw-t"></p><p id="rw-s1">' + U.step1 + '</p><div id="rw-fb1"></div><div id="rw-s2" hidden><p>' + U.step2 + '</p><div id="rw-bld"></div><div class="q-actions"><button type="button" class="btn primary sm" id="rw-chk" data-k="rwchk">' + U.check + "</button></div></div>" +
    '<div class="q-actions"><span id="rw-hb"></span></div><div id="rw-hints"></div><div id="rw-fb"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="rw-prev" data-k="rwprev">' + U.prev + '</button><button type="button" class="btn ghost sm" id="rw-next" data-k="rwnext">' + U.next + "</button></div></div></div>" +
    '<details class="alg" id="rw-alg" hidden><summary>' + U.alg + '</summary><p id="rw-algp"></p></details></div>' +
    '<div class="part rw2"><h3>' + U.r2 + '</h3><p class="muted">' + U.r2intro + '</p><div class="pred-top"><span class="tiny muted" id="r2-n"></span><span class="dots" id="r2-dots" aria-hidden="true"></span></div>' +
    '<div class="rw-grid"><div class="rw-g"><div class="r2-eqs" id="r2-eqs"></div><div class="plot-wrap"><canvas class="plot" id="r2-plot" role="img" aria-label="Graph"></canvas></div><div class="ruler" id="r2-rl" aria-hidden="true"></div><p class="rl-cap" id="r2-drop" aria-live="polite"></p></div>' +
    '<div class="rw-p"><ol class="r2-steps" id="r2-steps"></ol><div id="r2-fb"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="r2-prev" data-k="r2prev">' + U.prev + '</button><button type="button" class="btn ghost sm" id="r2-next" data-k="r2next">' + U.next.replace(/equation/, "pair") + "</button></div></div></div></div>";

  // ----- Round 1 -----
  var p1 = new MV.Plot($("#rw-plot", host), viewOf(RW[0].view)), A1 = { att:null, t:1, thick:false }, msg1 = {}, fb1 = {};
  var bst = {}, bld = builder($("#rw-bld", host), { key:"rwb", st:bst, dOnly:true, onEnter:function(){ $("#rw-chk", host).click(); } });
  function it(){ return RW[S.i]; }
  function ist(x){ x = x || it(); return S.it[x.id] || (S.it[x.id] = { tick:false, tTries:0, dTries:0, hint:0, solved:false, first:null, d:{ s:1, n:"", d:1 } }); }
  function tgt(x, d){ var g = E(x.given); return { f:x.form[0], a:x.form[1] * Math.abs(g.a), k:g.k, d:d, c:g.c }; }
  p1.render = function(){
    var x = it(), v = viewOf(x.view), g = E(x.given), gf = fnOf(g), P = TAU / g.k, s = ist(x);
    p1.draw({ view:v, xTicks:{ step:xStep(p1, v), pi:true }, yTicks:{ step:1 }, describe:"Given: " + MV.plain(m(eqSrc(g))) + ", start flag at x = " + piT(g.d) + "." + (A1.att ? " Your rewrite " + MV.plain(m(eqSrc(A1.att))) + (same(A1.att, g) ? " lands on it." : " does not land on it.") : ""),
      after:function(ctx, p){
        p.curve({ f:gf, color:css("--pen"), width:3 }); p.curve({ f:gf, color:css("--pen"), width:4, domain:[g.d, g.d + P] });
        flagAt(p, g.d, gf(g.d), css("--p-d"));
        if (A1.att) p.curve({ f:fnOf(A1.att), color:css("--ink"), width:A1.thick ? 3.4 : 2.6, dash:[10, 6], domain:[v.xmin, v.xmin + (v.xmax - v.xmin) * A1.t] });
        if (s.solved && !A1.att) p.curve({ f:fnOf(tgt(x, sDval(x, s))), color:css("--ink"), width:2.6, dash:[10, 6] });
      } });
  };
  function sDval(x, s){ var r = parseB({ d:s.d }, true); return r.ok ? r.d : 0; }
  p1.onDrawn(function(){ rulerPlace($("#rw-rl", host), p1); });
  function paint1(load){
    var x = it(), s = ist(x), g = E(x.given), right = MV.ans(x);
    $("#rw-n", host).textContent = fill(U.item, { n:S.i + 1 });
    $("#rw-dots", host).innerHTML = RW.map(function(q, i){ var y = S.it[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#rw-cap", host).innerHTML = U.given + ": " + m(eqSrc(g, true));
    $("#rw-t", host).innerHTML = x.target;
    MV.keepFocus($("#rw-rl", host), function(){ $("#rw-rl", host).innerHTML = rulerHTML(g, U, { buttons:true, key:x.id, reveal:s.solved, mark:s.tick ? right : null, dis:s.tick }); });
    rulerPlace($("#rw-rl", host), p1);
    $("#rw-q", host).innerHTML = fill(U.quarter, { q:s.solved ? m(piX(TAU / g.k / 4, true)) : "?" });
    $("#rw-fb1", host).innerHTML = s.tick ? MV.fbHTML("good", fill(U.tickRight, { what:kpA(seqOf(g)[right % 4], U) })) : fb1[x.id] ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + fb1[x.id]) : "";
    $("#rw-s2", host).hidden = !s.tick;
    if (load) { Object.keys(bst).forEach(function(k){ delete bst[k]; }); bst.d = s.d; bld.repaint(); }
    bld.disable(s.solved); $("#rw-chk", host).disabled = s.solved;
    MV.keepFocus(host, function(){ $("#rw-hb", host).innerHTML = s.solved ? "" : MV.hintBtn("rwh" + x.id, s.hint); $("#rw-hints", host).innerHTML = s.solved ? "" : MV.hintsHTML(x.hints, s.hint); });
    $("#rw-fb", host).innerHTML = s.solved ? MV.fbHTML("good", "<strong>" + fill(U.solved, { eq:m(eqSrc(tgt(x, sDval(x, s)))) }) + "</strong> " + U.lands + (s.first ? "" : ' <span class="muted">' + U.notFirst + "</span>")) : msg1[x.id] ? MV.fbHTML(msg1[x.id].k, msg1[x.id].h) : "";
    var al = $("#rw-alg", host); al.hidden = !s.solved; $("#rw-algp", host).innerHTML = x.alg; if (!s.solved) al.open = false;
    $("#rw-prev", host).disabled = S.i === 0; $("#rw-next", host).disabled = S.i === RW.length - 1;
    p1.render();
  }
  function go1(i){ S.i = i; A1.att = null; A1.t = 1; api.save(); paint1(true); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.closest("#rw-rl") && b.dataset.tick != null) {
      var x = it(), s = ist(x), i = +b.dataset.tick;
      if (i === MV.ans(x)) { s.tick = true; fb1[x.id] = null; } else { s.tTries++; fb1[x.id] = x.tickFb[i]; }
      api.save(); paint1(); MV.focusFb($("#rw-fb1", host)); if (s.tick) { var inp = $("#rw-bld input", host); if (inp) inp.focus({ preventScroll:true }); }
      return;
    }
    if (b.id === "rw-prev") { go1(S.i - 1); return; }
    if (b.id === "rw-next") { go1(S.i + 1); return; }
    if (b.dataset.act === "hint" && b.closest(".rw")) { var s2 = ist(); s2.hint = Math.min(3, s2.hint + 1); api.save(); paint1(); return; }
    if (b.id === "rw-chk") check1();
  });
  function check1(){
    var x = it(), s = ist(x), g = E(x.given), r = bld.read(), U2 = MV.C.explore.ui;
    s.d = JSON.parse(JSON.stringify(bst.d)); api.save();
    if (!r.ok) { msg1[x.id] = { k:"bad", h:r.why === "empty" ? U.empty : U.dRange }; paint1(); return; }
    var e = tgt(x, r.d);
    A1.att = e; A1.thick = false;
    if (same(e, g)) {
      if (r.dOut) { msg1[x.id] = { k:"", h:U.outRange }; paint1(); MV.focusFb($("#rw-fb", host)); return; }
      s.solved = true; s.first = s.tTries === 0 && s.dTries === 0 && s.hint < 3; msg1[x.id] = null; api.save(); paint1();
      A1.t = 0; MV.tween({ dur:1000, step:function(t){ A1.t = t; p1.render(); }, done:function(){ A1.thick = true; p1.render(); MV.wait(600, function(){ A1.thick = false; p1.render(); }); } });
      var al = $("#rw-alg", host); al.hidden = false; al.open = true;
    } else {
      s.dTries++; api.save();
      var n = (x.wrongD || []).filter(function(w){ return near(r.d, w.n * T12); })[0], st = status(e, g, U2.st);
      msg1[x.id] = { k:"bad", h:"<strong>✗ Not quite.</strong> " + (n ? n.msg : st ? st.html : "") };
      A1.t = 0; paint1(); MV.tween({ dur:700, step:function(t){ A1.t = t; p1.render(); } });
    }
    MV.focusFb($("#rw-fb", host));
  }

  // ----- Round 2 -----
  var p2 = new MV.Plot($("#r2-plot", host), viewOf(PR[0].view)), A2 = { drop:1, ov:1 };
  function pr(){ return PR[S.j]; }
  function pst(x){ x = x || pr(); return S.pr[x.id] || (S.pr[x.id] = { step:0, tries:[0, 0, 0, 0], last:null, first:null }); }
  p2.render = function(){
    var x = pr(), s = pst(x), v = viewOf(x.view), e1 = E(x.eqs[0]), e2 = E(x.eqs[1]), mid = (v.xmin + v.xmax) / 2, half = (v.xmax - v.xmin) / 2, done = s.step >= 4;
    p2.draw({ view:v, xTicks:{ step:xStep(p2, v), pi:true }, yTicks:{ step:1 }, describe:done ? "Both curves drawn: largest gap " + gapOf(fnOf(e1), fnOf(e2), v.xmin, v.xmax).toFixed(2) + "." : "Annotations for equations 1 and 2; the curves appear after your verdict.",
      after:function(ctx, p){
        var pc = css("--p-c"), ac = css("--acol"), kc = css("--p-k");
        if (done) { shade(p, fnOf(e2), fnOf(e1), A2.ov); p.curve({ f:fnOf(e1), color:css("--pen"), width:3 }); p.curve({ f:fnOf(e2), color:css("--ink"), width:2.6, dash:[10, 6] }); return; }
        [e1, e2].forEach(function(e, i){
          var x0 = i ? mid : v.xmin, X0 = p.X(x0), X1 = p.X(x0 + half);
          ctx.save(); ctx.strokeStyle = pc; ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(X0 + 4, p.Y(e.c)); ctx.lineTo(X1 - 4, p.Y(e.c)); ctx.stroke(); ctx.restore();
          ctext(p, (i + 1) + ": *y* = " + cm(frS(e.c)), X0 + 8, p.Y(e.c) + 13, { color:pc, size:13 });
          vbr(p, x0 + half * 0.3, e.c, hi(e), ac, 1, (i + 1) + ": " + cm(frS(Math.abs(e.a))));
          if (s.step >= 1) { var P = TAU / e.k, sc = Math.min(1, 0.92 * half / P), L = P * sc, xs = x0 + (half - L) / 2; hbr(p, xs, xs + L, p.Y(lo(e)) - 10 + (p.Y(v.ymin) - p.Y(lo(e))) * 0.45, kc, 1, (i + 1) + ": period " + piT(P), { below:true }); }
          if (i === 0) { ctx.save(); ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.X(mid), 0); ctx.lineTo(p.X(mid), p.H); ctx.stroke(); ctx.restore(); }
        });
      } });
  };
  p2.onDrawn(function(){ rulerPlace($("#r2-rl", host), p2); });
  function landText(x){
    var e1 = E(x.eqs[0]), e2 = E(x.eqs[1]), P = TAU / e1.k, q = ((e2.d - e1.d) / P * 4 % 4 + 4) % 4, qi = Math.round(q);
    if (!near(q, qi)) return fill(U.drop, { x:m(piX(e2.d)), tick:"", what:"a point between key points" });
    var t = seqOf(e1)[qi % 4]; return fill(U.drop, { x:m(piX(e2.d)), tick:U.ticks[qi], what:kpA(t, U) });
  }
  function paint2(){
    var x = pr(), s = pst(x), e1 = E(x.eqs[0]), e2 = E(x.eqs[1]), ans = MV.ans(x);
    $("#r2-n", host).textContent = fill(U.pair, { n:S.j + 1 });
    $("#r2-dots", host).innerHTML = PR.map(function(q, i){ var y = S.pr[q.id]; return '<span class="dot' + (y && y.step >= 4 ? " done" : "") + (i === S.j ? " cur" : "") + '"></span>'; }).join("");
    $("#r2-eqs", host).innerHTML = "<p>1: " + m(eqSrc(e1, true)) + "</p><p>2: " + m(eqSrc(e2, true)) + "</p>";
    var rl = $("#r2-rl", host);
    rl.innerHTML = s.step >= 2 ? rulerHTML(e1, U, { reveal:true, drop:e2.d }) : "";
    var dp = $(".rl-drop", rl); if (dp && A2.drop < 1) dp.classList.add("fall");
    rulerPlace(rl, p2);
    $("#r2-drop", host).innerHTML = s.step >= 2 ? landText(x) : "";
    var h = "";
    for (var k = 0; k < 4 && k <= s.step; k++) {
      h += '<li><p class="r2-q">' + U.checks[k] + "</p>";
      if (k < s.step) h += '<p class="r2-a"><strong>✓ ' + U.chips[k][ans[k]] + ".</strong> " + x.facts[k] + "</p>";
      else h += '<div class="chips" role="group" aria-label="' + MV.esc(U.checks[k]) + '">' + U.chips[k].map(function(t, i){ return '<button type="button" class="chip" data-r2="' + i + '" data-k="r2' + x.id + k + i + '">' + t + "</button>"; }).join("") + "</div>";
      h += "</li>";
    }
    MV.keepFocus($("#r2-steps", host), function(){ $("#r2-steps", host).innerHTML = h; });
    var fb = $("#r2-fb", host);
    if (s.step >= 4) fb.innerHTML = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + fill(U.overlay, { g:gapOf(fnOf(e1), fnOf(e2), viewOf(x.view).xmin, viewOf(x.view).xmax).toFixed(2) }) + (s.first ? "" : ' <span class="muted">' + U.notFirst + "</span>"));
    else fb.innerHTML = s.last != null ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + x.facts[s.step] + " Try again.") : "";
    $("#r2-prev", host).disabled = S.j === 0; $("#r2-next", host).disabled = S.j === PR.length - 1;
    p2.render();
  }
  $("#r2-steps", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-r2]"); if (!b || b.disabled) return;
    var x = pr(), s = pst(x), i = +b.dataset.r2, ans = MV.ans(x);
    if (i === ans[s.step]) {
      s.last = null; s.step++;
      if (s.step === 4) { s.first = s.tries[3] === 0; A2.ov = 0; MV.tween({ dur:800, step:function(t){ A2.ov = t; p2.render(); } }); }
      if (s.step === 2) { A2.drop = 0; MV.wait(650, function(){ A2.drop = 1; }); }
    } else { s.tries[s.step]++; s.last = i; }
    api.save(); paint2(); MV.focusFb($("#r2-fb", host).querySelector(".fb") ? $("#r2-fb", host) : $("#r2-steps", host));
  });
  $("#r2-prev", host).addEventListener("click", function(){ S.j--; api.save(); paint2(); });
  $("#r2-next", host).addEventListener("click", function(){ S.j++; api.save(); paint2(); });

  MV.ACTS.rewrite = {
    stats:function(){ var f = 0, d = 0; RW.forEach(function(x){ var y = S.it[x.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:4, done:d, line:fill(U.rewriteLine, { f:f }) + (d < 4 ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; RW.forEach(function(x){ var y = S.it[x.id]; if (y && (y.tTries || y.dTries || y.hint >= 3)) g = g.concat(MV.goalIdx(x.goal)); }); return g; } };
  MV.ACTS.checks3 = {
    stats:function(){ var f = 0, d = 0; PR.forEach(function(x){ var y = S.pr[x.id]; if (y && y.step >= 4) d++; if (y && y.first) f++; }); return { first:f, total:2, done:d, line:fill(U.checksLine, { f:f }) + (d < 2 ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; PR.forEach(function(x){ var y = S.pr[x.id]; if (y && y.tries.some(function(t){ return t > 0; })) g = g.concat(MV.goalIdx(x.goal)); }); return g; } };
  paint1(true); paint2();
  return {};
}

// ---------- Practice 1: Match the wave ----------
// @component N6 graphMatch (adapted from MHF4U 19) — K5 graph thumbnails (4 × 2; one column of 120 px strips on phones) and an
// equation list; tap a graph then an equation (or the other way round), pair-specific feedback, hints for the selected pair
function thumbEq(G){ var x1 = G.max[0] * T12, x2 = G.min[0] * T12, P = 2 * Math.abs(x1 - x2); return { f:"cos", a:(G.max[1] - G.min[1]) / 2, k:TAU / P, d:x1, c:(G.max[1] + G.min[1]) / 2 }; }
function matchAct(host, api, a){
  var S = api.S; S.done = S.done || {}; S.tries = S.tries || {}; S.hints = S.hints || {};
  var sel = null, msg = null, K = MV.ans(a), U = a.ui, V = { xmin:-PI / 2, xmax:1.5 * PI, ymin:-4, ymax:6 };
  var eqs = MV.shuffle(a.eqs, MV.meta.id + a.id), letter = {}; eqs.forEach(function(q, i){ letter[q.id] = "abcdefgh".charAt(i); });
  var inv = {}; Object.keys(K).forEach(function(g){ inv[K[g]] = g; });
  function sayG(G){ var mx = G.max, mn = G.min, first = mx[0] <= mn[0]; var A = first ? [U.max, mx] : [U.min, mn], B = first ? [U.min, mn] : [U.max, mx]; return U.graph + " " + G.n + ": " + A[0] + " at " + cm(ptS(A[1][0] * T12, A[1][1])) + "; " + U.next + " " + B[0] + " at " + cm(ptS(B[1][0] * T12, B[1][1])); }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="mw-sel" id="mw-sel"></div><div id="mw-msg"></div><p class="sort-done" id="mw-done" hidden></p>' +
    '<div class="mw-grid" role="group" aria-label="' + U.graphs + '">' + a.graphs.map(function(G){ return '<button type="button" class="mw-th" data-g="' + G.id + '" data-k="mw' + G.id + '" aria-pressed="false"><span class="mw-tag">' + U.graph + " " + G.n + '</span><canvas class="plot mw-c" role="img" aria-label="' + MV.esc(sayG(G)) + '"></canvas><span class="mw-eqd"></span></button>'; }).join("") + "</div>" +
    '<h4 class="mw-h">' + U.eqs + '</h4><div class="mw-eqs" role="group" aria-label="' + U.eqs + '">' + eqs.map(function(q){ return '<button type="button" class="mw-eq" data-e="' + q.id + '" data-k="mwe' + q.id + '" aria-pressed="false"><span class="mw-l">' + letter[q.id] + ".</span> " + q.t + '<span class="mw-to"></span></button>'; }).join("") + "</div>";
  a.graphs.forEach(function(G){
    var cv = $('[data-g="' + G.id + '"] canvas', host), pl = new MV.Plot(cv, V), e = thumbEq(G);
    pl.render = function(){
      pl.draw({ view:V, xTicks:{ step:PI / 4, pi:true, fmt:function(t){ var q = t / (PI / 2); return near(q, Math.round(q), 1e-6) ? MV.piLabel(t) : ""; } }, yTicks:{ step:2 }, describe:sayG(G),
        after:function(ctx, p){ p.curve({ f:fnOf(e), color:css("--pen"), width:2.6 }); [G.max, G.min].forEach(function(q){ var X = q[0] * T12, Y = p.Y(q[1]), up = q === G.max, fit = up ? Y - 14 > 9 : Y + 14 < p.H - 9; p.point({ x:X, y:q[1], r:4.5, color:css("--ink") }); ctext(p, cm(ptS(X, q[1])), p.X(X) + (fit ? 0 : 10), fit ? Y + (up ? -14 : 14) : Y, { align:fit ? "center" : "left", size:12 }); }); } });
    };
    pl.render();
  });
  function stats(){ var f = 0, d = 0, miss = []; a.graphs.forEach(function(G){ var bad = (S.tries[G.id] || 0) > 0 || (S.hints[K[G.id]] || 0) >= 3; if (S.done[G.id]) { d++; if (!bad) f++; } if (bad) miss.push(G); }); return { first:f, done:d, total:a.graphs.length, miss:miss }; }
  function selEq(){ return !sel ? null : sel.t === "e" ? byId(a.eqs, sel.id) : byId(a.eqs, K[sel.id]); }
  function paint(){
    $$(".mw-th", host).forEach(function(b){ var g = b.dataset.g, d = !!S.done[g]; b.classList.toggle("done", d); b.disabled = d; var on = !!sel && sel.t === "g" && sel.id === g; b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); $(".mw-eqd", b).innerHTML = d ? '<span class="pair-n">✓ ' + letter[K[g]] + ".</span> " + byId(a.eqs, K[g]).t : ""; });
    $$(".mw-eq", host).forEach(function(b){ var q = b.dataset.e, d = !!S.done[inv[q]]; b.classList.toggle("done", d); b.disabled = d; var on = !!sel && sel.t === "e" && sel.id === q; b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); $(".mw-to", b).textContent = d ? " → " + U.graph + " " + byId(a.graphs, inv[q]).n : ""; });
    var q = selEq(), lv = q ? (S.hints[q.id] || 0) : 0, lab = sel ? (sel.t === "g" ? U.graph + " " + byId(a.graphs, sel.id).n : letter[sel.id] + ". " + q.t) : "";
    MV.keepFocus($("#mw-sel", host), function(){ $("#mw-sel", host).innerHTML = sel ? '<div class="sel-bar"><span>' + U.sel + ": <strong>" + lab + "</strong></span>" + (q.hints ? MV.hintBtn("mwh" + a.id, lv) : "") + "</div>" + MV.hintsHTML(q.hints, lv) : ""; });
    $("#mw-msg", host).innerHTML = msg ? '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>" : "";
    var s = stats(), dn = $("#mw-done", host); dn.hidden = s.done < s.total; dn.textContent = fill(U.done, { f:s.first, n:s.total });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.act === "hint" && sel) { var q = selEq(); S.hints[q.id] = Math.min(3, (S.hints[q.id] || 0) + 1); api.save(); paint(); return; }
    var t = b.dataset.g ? "g" : b.dataset.e ? "e" : null; if (!t) return;
    var id = b.dataset.g || b.dataset.e;
    if (!sel || sel.t === t) { sel = sel && sel.t === t && sel.id === id ? null : { t:t, id:id }; msg = null; paint(); return; }
    var g = t === "g" ? id : sel.id, eq = t === "e" ? id : sel.id, item = sel.t === "g" ? sel.id : inv[sel.id];
    if (K[g] === eq) { S.done[g] = true; var G = byId(a.graphs, g); msg = { type:"good", html:"<strong>✓ Matched.</strong> " + U.graph + " " + G.n + ": " + byId(a.eqs, eq).why }; sel = null; }
    else { S.tries[item] = (S.tries[item] || 0) + 1; msg = { type:"bad", html:"<strong>✗ Not a match.</strong> " + ((a.wrong || {})[eq + "|" + g] || a.wrongDefault) + " " + a.tail }; }
    api.save(); paint(); MV.focusFb($("#mw-msg", host));
  });
  paint();
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:a.summary + " (first try): " + s.first + "/" + s.total + (s.done < s.total ? " (unfinished)" : "") }; },
    missed:function(){ return stats().miss.length ? MV.goalIdx(a.goal) : []; }
  };
}

// ---------- Practice 2: Equations from clues ----------
function cluesAct(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var U = a.ui, UX = MV.C.explore.ui, msg = {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="cl-n"></span><span class="dots" id="cl-dots" aria-hidden="true"></span></div>' +
    '<div class="design cl"><div><div class="pred-q" id="cl-clue"></div><p id="cl-form"></p><div id="cl-bld"></div><div class="q-actions"><button type="button" class="btn primary sm" id="cl-check" data-k="clchk">' + U.check + '</button><span id="cl-hint"></span></div><div id="cl-hints"></div><div id="cl-fb"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="cl-prev" data-k="clprev">' + U.prev + '</button><button type="button" class="btn ghost sm" id="cl-next" data-k="clnext">' + U.next + "</button></div></div>" +
    '<div><p class="tiny muted">' + U.preview + '</p><canvas class="plot" id="cl-plot" role="img" aria-label="Preview"></canvas></div></div>';
  var plot = new MV.Plot($("#cl-plot", host), viewOf(a.items[0].view)), bh = $("#cl-bld", host), bld = null;
  function cur(){ return a.items[S.i]; }
  function ist(it){ it = it || cur(); return S.items[it.id] || (S.items[it.id] = { b:{}, tries:0, hint:0, solved:false, first:null, shown:null }); }
  plot.render = function(){
    var it = cur(), x = ist(it), v = viewOf(it.view), e = x.shown;
    plot.draw({ view:v, xTicks:{ step:xStep(plot, v), pi:true }, yTicks:{ step:1 }, describe:U.clues + ": " + MV.plain(it.clue) + (e ? " Your equation: " + MV.plain(m(eqSrc(e))) + "." : ""),
      after:function(ctx, p){
        (it.lines || []).forEach(function(y){ hLine(p, y, css("--ink-2"), 1, [2, 5], 1.5); });
        if (e) p.curve({ f:fnOf(e), color:css("--pen"), width:3 });
        it.rings.forEach(function(r){ p.point({ x:r[0] * T12, y:r[1], r:6.5, open:true, color:css("--ink") }); });
      } });
  };
  function paint(load){
    var it = cur(), x = ist(it), fm = it.form;
    $("#cl-n", host).textContent = fill(U.item, { n:S.i + 1 }) + (S.i >= 6 ? " ★" : "");
    $("#cl-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#cl-clue", host).innerHTML = "<strong>" + U.clues + ":</strong> " + it.clue;
    $("#cl-form", host).innerHTML = fill(U.form, { f:m("y = a " + fm[0] + "[k(x - d)] + c") + " with " + m(fm[1] > 0 ? "a > 0" : "a < 0") });
    if (load) { bh.innerHTML = ""; bh = bh.cloneNode(false); $("#cl-bld", host).replaceWith(bh); bld = builder(bh, { key:"cl" + it.id, st:x.b, base:fm[0], label:"Your equation", onChange:function(){ api.save(); }, onEnter:function(){ $("#cl-check", host).click(); } }); }
    bld.disable(x.solved); $("#cl-check", host).disabled = x.solved;
    MV.keepFocus(host, function(){ $("#cl-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("clh" + it.id, x.hint); $("#cl-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint); });
    $("#cl-fb", host).innerHTML = x.solved ? MV.fbHTML("good", "<strong>" + fill(U.solved, { eq:m(eqSrc(x.shown)) }) + "</strong>" + (x.first ? "" : ' <span class="muted">' + U.notFirst + "</span>")) : msg[it.id] ? MV.fbHTML(msg[it.id].k, msg[it.id].h) : "";
    $("#cl-prev", host).disabled = S.i === 0; $("#cl-next", host).disabled = S.i === a.items.length - 1;
    plot.render();
  }
  function fbFor(it, e, A){
    var W = it.wrong || [], hit = function(n){ return (n.on === "ac" && near(e.a, n.v[0]) && near(e.c, n.v[1])) || (n.on === "kd" && near(e.k, n.v[0], 1e-6) && near(e.d, n.v[1] * T12)); };
    for (var i = 0; i < W.length; i++) if ((W[i].on === "ac" || W[i].on === "kd") && hit(W[i])) return W[i].msg;
    var box = !near(e.c, A.c) ? "c" : !near(e.a, A.a) ? "a" : !near(e.k, A.k, 1e-9) ? "k" : "d";
    for (var j = 0; j < W.length; j++) { var n = W[j]; if (n.on !== box) continue; if (box === "d" ? n.v.some(function(v){ return near(e.d, v * T12); }) : near(e[box], n.v, 1e-6)) return n.msg; }
    var s = status(e, A, UX.st); return s ? s.html : "";
  }
  host.addEventListener("click", function(ev){
    var b = ev.target.closest("button"); if (!b || b.disabled || b.closest("#cl-bld")) return;
    var it = cur(), x = ist(it);
    if (b.id === "cl-prev" || b.id === "cl-next") { S.i += b.id === "cl-prev" ? -1 : 1; api.save(); paint(true); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id !== "cl-check") return;
    var r = bld.read(), A = E(MV.ans(it));
    if (!r.ok) { msg[it.id] = { k:"bad", h:UX[r.why] }; paint(); MV.focusFb($("#cl-fb", host)); return; }
    var e = r.e;
    if ((e.a < 0 ? -1 : 1) !== it.form[1]) { msg[it.id] = { k:"bad", h:fill(U.sign, { s:m(it.form[1] > 0 ? "a > 0" : "a < 0") }) }; paint(); MV.focusFb($("#cl-fb", host)); return; }
    x.shown = e;
    if (same(e, A) && r.dOut) msg[it.id] = { k:"", h:U.outRange };
    else if (same(e, A)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
    else { x.tries++; msg[it.id] = { k:"bad", h:"<strong>✗ Not quite.</strong> " + fbFor(it, e, A) }; }
    api.save(); paint(); MV.focusFb($("#cl-fb", host));
  });
  paint(true);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: one wave, four clues ----------
var task = (function(){
  var api, plot, bld, T, UX;
  function read(){ return bld ? bld.read() : { ok:false, why:"empty" }; }
  function draw(){
    var r = read(), e = r.ok ? r.e : null, v = { xmin:-TAU, xmax:TAU, ymin:-8, ymax:8 };
    plot.draw({ view:v, xTicks:{ step:narrow(plot) ? PI : PI / 2, pi:true }, yTicks:{ step:2 }, describe:"Clues: dotted lines y = 5 and y = −1, a ring at (π/3, 5), a ring at (0, 2), and a bracket of length π. " + (e ? "Your curve: " + MV.plain(m(eqSrc(e))) + "." : "No curve yet."),
      after:function(ctx, p){
        hLine(p, 5, css("--ink-2"), 1, [2, 5], 1.5); hLine(p, -1, css("--ink-2"), 1, [2, 5], 1.5);
        hbr(p, -1.5 * PI, -0.5 * PI, p.H - 22, css("--p-k"), 1, T.ui.bracket);
        if (e) p.curve({ f:fnOf(e), color:css("--pen"), width:3 });
        p.point({ x:PI / 3, y:5, r:6.5, open:true, color:css("--ink") }); ctext(p, "▲", p.X(PI / 3), p.Y(5) - 16, { align:"center", size:13 });
        p.point({ x:0, y:2, r:6.5, open:true, color:css("--ink") });
      } });
  }
  function caption(){ var r = read(), el = $("#tk-cap"); if (el) el.innerHTML = r.ok ? m(eqSrc(r.e)) : '<span class="muted tiny">' + (r.why ? UX[r.why] : "") + "</span>"; }
  function whyBox(){ var w = $("#tk-why"); if (w) w.hidden = !MV.taskState().found.length; }
  function after(){
    var ts = MV.taskState(), fb = $("#task-fb .fb.good"); whyBox(); if (!fb) return;
    var forms = {}; ts.found.forEach(function(k){ var p = k.split("|"); forms[p[0] + (p[1].charAt(0) === "-" ? "-" : "+")] = 1; });
    if (Object.keys(forms).length >= 4) fb.insertAdjacentHTML("beforeend", "<p>" + T.ui.forms + "</p>");
    if (ts.found.length >= 13) fb.insertAdjacentHTML("beforeend", "<p>" + T.ui.all + "</p>");
  }
  function vals(d){ var e = d.e; return { e:e, A:Math.abs(e.a) }; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; UX = MV.C.explore.ui; a.S.b = a.S.b || {};
      inp.innerHTML = '<div id="tk-bld"></div><p class="tiny muted tk-cl">' + T.ui.caption + '</p><div class="eq-cap tk-cap" id="tk-cap" aria-live="polite"></div>';
      pv.innerHTML = '<p class="tiny muted">' + T.ui.pv + '</p><canvas class="plot" id="tk-plot" role="img" aria-label="Preview"></canvas><details class="alg" id="tk-why" hidden><summary>' + T.ui.whyT + "</summary><p>" + T.ui.why + "</p></details>";
      plot = new MV.Plot($("#tk-plot"), { xmin:-TAU, xmax:TAU, ymin:-8, ymax:8 }); plot.render = draw;
      bld = builder($("#tk-bld"), { key:"tk", st:a.S.b, base:"chips", label:"Your equation", onChange:function(){ a.save(); caption(); draw(); a.update(); }, onEnter:function(){ $("#task-check").click(); } });
      $("#task-check").addEventListener("click", function(){ setTimeout(after, 0); });
      caption(); draw(); whyBox();
    },
    read:read,
    valid:function(d){ return d.ok && !d.dOut ? true : d.ok ? UX.dRange : (UX[d.why] || T.ui.fill); },
    checks:function(d){
      if (!d.ok || d.dOut) return [false, false, false, false];
      var v = vals(d), e = v.e;
      return [near(e.c + v.A, 5) && near(e.c - v.A, -1), near(val(e, PI / 3), e.c + v.A), near(val(e, 0), 2), e.k <= 2 + 1e-9];
    },
    tips:function(d, res){
      var e = d.e, A = Math.abs(e.a), i = res.indexOf(false), t = T.tips[i];
      if (i === 0) return [fill(t, { min:m(frS(e.c - A)), max:m(frS(e.c + A)) })];
      if (i === 1) return [fill(t, { v:m(valS(val(e, PI / 3))) })];
      if (i === 2) return [fill(t, { v:m(valS(val(e, 0))) })];
      if (i === 3) return [fill(t, { P:m(piX(TAU / e.k)) })];
      return [];
    },
    key:function(d){ return eqKey(d.e); },
    label:function(k){ var p = k.split("|"); return m(eqSrc({ f:p[0], a:MV.parseNum(p[1])[0], k:MV.parseNum(p[2])[0], d:+p[3] * T12, c:MV.parseNum(p[4])[0] })); },
    text:function(k){ var p = k.split("|"); return MV.plain(m(eqSrc({ f:p[0], a:MV.parseNum(p[1])[0], k:MV.parseNum(p[2])[0], d:+p[3] * T12, c:MV.parseNum(p[4])[0] }))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ match:matchAct, clues:cluesAct },
  task:task
});
})();
