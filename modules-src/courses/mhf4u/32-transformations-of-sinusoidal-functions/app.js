// MHF4U 32 Transformations of Sinusoidal Functions: hero storyboard, wave tuner with brackets, cycle box and inside ruler
// (Explore), period and phase detective (Part 3), equation-to-graph matching and multi-step entry (Practice), "Wave to order" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, m = MV.m, PI = Math.PI, TAU = 2 * PI;
function fill(t, o){ return String(t == null ? "" : t).replace(/\{(\w+)\}/g, function(s, k){ return o[k] != null ? o[k] : s; }); }
function def(o, d){ Object.keys(d).forEach(function(k){ if (o[k] == null) o[k] = JSON.parse(JSON.stringify(d[k])); }); return o; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function near(a, b, e){ return Math.abs(a - b) < (e || 1e-9); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function isInt(v){ return near(v, Math.round(v)); }
function isDark(){ var s = css("--sheet").replace("#", ""); return s.length >= 6 && parseInt(s.slice(0, 2), 16) < 128; }
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
var LIN = function(t){ return t; };

// ---------- exact π-multiples ----------
// @component exactPiQ — rationals {n, d} for π-coefficients and k values, with m() sources (inline "5π/12" or stacked)
function Q(n, d){ if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); n = n / g; return { n:n === 0 ? 0 : n, d:d / g }; }
function qA(a){ return Array.isArray(a) ? Q(a[0], a[1]) : a; }
function qAdd(a, b){ return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
function qSub(a, b){ return Q(a.n * b.d - b.n * a.d, a.d * b.d); }
function qMul(a, b){ return Q(a.n * b.n, a.d * b.d); }
function qDiv(a, b){ return Q(a.n * b.d, a.d * b.n); }
function qV(a){ return a.n / a.d; }
function qEq(a, b){ return a.n === b.n && a.d === b.d; }
function qInt(a){ return a.d === 1; }
function qNeg(a){ return Q(-a.n, a.d); }
function qOf(v){ if (!isFinite(v)) return null; for (var d = 1; d <= 48; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return Q(n, d); } return null; }
function piSrc(q, st){
  if (!q.n) return "0";
  var a = Math.abs(q.n), top = (a === 1 ? "" : a) + "π";
  return (q.n < 0 ? "-" : "") + (q.d === 1 ? top : st ? "{" + top + "}/{" + q.d + "}" : top + "/" + q.d);
}
function piT(q){ return piSrc(q).replace(/-/g, MINUS); }
function ratSrc(q, st){ if (q.d === 1) return String(q.n); var a = Math.abs(q.n); return (q.n < 0 ? "-" : "") + (st ? "{" + a + "}/{" + q.d + "}" : a + "/" + q.d); }
function ratT(q){ return ratSrc(q).replace(/-/g, MINUS); }
function dec(v){ return String(Math.round(v * 1000) / 1000); }
// a π-multiple typed as "3/2", "−1/2", "1.5" or "3π/2" -> coefficient of π (or NaN)
function parsePi(raw){ var s = String(raw == null ? "" : raw).trim(); if (!s) return NaN; var r = MV.parseNum(s); if (!r || r.length !== 1 || !isFinite(r[0])) return NaN; return /π|pi/i.test(s) ? r[0] / PI : r[0]; }
function parseOne(raw){ var s = String(raw == null ? "" : raw).trim(); if (!s) return NaN; var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : NaN; }

// ---------- sinusoid model: exact P = {f, a, k:Q, d:Q (π-coefficient), c}; float W = {f, a, k, d (radians), c} ----------
var FN = { sin:Math.sin, cos:Math.cos };
var PAT = { sin:[0, 1, 0, -1, 0], cos:[1, 0, -1, 0, 1] };
var PATW = { "sin+":"axis, max, axis, min, axis", "sin-":"axis, min, axis, max, axis", "cos+":"max, axis, min, axis, max", "cos-":"min, axis, max, axis, min" };
var PEAK = { "sin+":0.25, "sin-":0.75, "cos+":0, "cos-":0.5 };
function pkey(f, a){ return f + (a < 0 ? "-" : "+"); }
function flo(P){ return { f:P.f, a:P.a, k:qV(P.k), d:qV(P.d) * PI, c:P.c }; }
function waveF(W){ var g = FN[W.f]; return function(x){ return W.a * g(W.k * (x - W.d)) + W.c; }; }
function keyX(P, j){ return qAdd(P.d, qDiv(Q(j, 2), P.k)); }
function keyY(P, j){ return P.a * PAT[P.f][j] + P.c; }

// equation sources for m(): factored y = a f[k(x − d)] + c and expanded y = a f(kx + b) + c (col: parameter colours)
function kxSrc(k, col){ var K = function(s){ return col ? "@k{" + s + "}" : String(s); }; if (k.d === 1) return (k.n === 1 ? "" : K(k.n)) + "x"; return (k.n === 1 ? "" : K(k.n)) + "x/" + K(k.d); }
function kSrc(k, col){ var s = ratSrc(k, true); return col ? "@k{" + s + "}" : s; }
function coefSrc(a, col){ if (a === 1) return ""; if (a === -1) return col ? "@a{-}" : "-"; return (col ? "@a{" + dec(a) + "}" : dec(a)) + " "; }
function tailSrc(c, col){ if (!c) return ""; var s = dec(Math.abs(c)); return (c > 0 ? " + " : " - ") + (col ? "@c{" + s + "}" : s); }
function xdSrc(d, col, st){ if (!d.n) return "x"; var s = piSrc(Q(Math.abs(d.n), d.d), st); return "x " + (d.n > 0 ? "- " : "+ ") + (col ? "@d{" + s + "}" : s); }
function inFSrc(k, d, col, st){ if (k.n === k.d) return xdSrc(d, col, st); if (!d.n) return kxSrc(k, col); return kSrc(k, col) + "(" + xdSrc(d, col, st) + ")"; }
function wrapF(k, d, s){ if (!d.n) return k.d === 1 ? " " + s : "(" + s + ")"; return k.n === k.d ? "(" + s + ")" : "[" + s + "]"; }
function inESrc(k, b, col, st){ var s = kxSrc(k, col); if (!b.n) return s; return s + (b.n > 0 ? " + " : " - ") + piSrc(Q(Math.abs(b.n), b.d), st); }
function wrapE(k, b, s){ if (!b.n && k.d === 1) return " " + s; return "(" + s + ")"; }
function eqF(P, col, st){ return "y = " + coefSrc(P.a, col) + P.f + wrapF(P.k, P.d, inFSrc(P.k, P.d, col, st)) + tailSrc(P.c, col); }
function eqE(P, b, col, st){ return "y = " + coefSrc(P.a, col) + P.f + wrapE(P.k, b, inESrc(P.k, b, col, st)) + tailSrc(P.c, col); }
function bOf(P){ return qNeg(qMul(P.k, P.d)); }

// ---------- canvas helpers ----------
// @component G11 canvasFracLabel (from MHF4U 20) — canvas labels with stacked fractions and per-token colours: toks = [{t, c, i (italic)} | {fn, fd, c}]
function drawToks(ctx, p, toks, X, Y, o){
  o = o || {};
  var sz = o.size || 14, fs = Math.round(sz * 0.8), fm = p.fontM || "serif", ink = css("--ink");
  var fontOf = function(tk){ return (tk.i ? "italic " : "") + "600 " + sz + "px " + fm; };
  ctx.save();
  var ws = toks.map(function(tk){ if (tk.fn != null) { ctx.font = "600 " + fs + "px " + fm; return Math.max(ctx.measureText(tk.fn).width, ctx.measureText(tk.fd).width) + 4; } ctx.font = fontOf(tk); return ctx.measureText(tk.t).width; });
  var w = ws.reduce(function(s, x){ return s + x; }, 0), hasF = toks.some(function(tk){ return tk.fn != null; }), hh = hasF ? sz * 1.75 : sz * 1.2;
  var x0 = o.align === "right" ? X - w : o.align === "center" ? X - w / 2 : X;
  x0 = clamp(x0, 3, Math.max(3, p.W - w - 3)); Y = clamp(Y, hh / 2 + 1, p.H - hh / 2 - 1);
  if (o.bg !== false) { ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, Y - hh / 2, w + 6, hh); ctx.globalAlpha = 1; }
  ctx.textBaseline = "middle";
  var x = x0;
  toks.forEach(function(tk, i){
    ctx.fillStyle = tk.c || ink;
    if (tk.fn != null) {
      ctx.font = "600 " + fs + "px " + fm; ctx.textAlign = "center";
      ctx.fillText(tk.fn, x + ws[i] / 2, Y - fs * 0.6); ctx.fillText(tk.fd, x + ws[i] / 2, Y + fs * 0.66);
      ctx.fillRect(x + 1.5, Y - 0.6, ws[i] - 3, 1.3);
    } else { ctx.font = fontOf(tk); ctx.textAlign = "left"; ctx.fillText(tk.t, x, Y); }
    x += ws[i];
  });
  ctx.restore();
  return { x:x0, w:w, h:hh };
}
function tPi(q, col){
  if (!q.n) return [{ t:"0", c:col }];
  var a = Math.abs(q.n), top = (a === 1 ? "" : a) + "π", out = q.n < 0 ? [{ t:MINUS, c:col }] : [];
  return out.concat(q.d === 1 ? [{ t:top, c:col }] : [{ fn:top, fd:String(q.d), c:col }]);
}
function samplePts(f, x0, x1, n){ var out = [], N = n || 1400; for (var i = 0; i <= N; i++) { var x = x0 + (x1 - x0) * i / N; out.push([x, f(x)]); } return out; }
function curveOn(p, f, o){ var v = p.v, s = (v.xmax - v.xmin) * 0.01, a = v.xmin - s, b = v.xmax + s; if (o.domain) { a = Math.max(a, o.domain[0]); b = Math.min(b, o.domain[1]); } if (b <= a) return; p.curve(Object.assign({ pts:samplePts(f, a, b, o.n) }, o)); }
function hLine(ctx, p, y, col, w, dash, alpha){ var Y = p.Y(y); ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(p.W, Y); ctx.stroke(); ctx.restore(); }
function vLine(ctx, p, x, col, w, dash, alpha, y0, y1){ var X = p.X(x); ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(X, y0 == null ? 0 : p.Y(y0)); ctx.lineTo(X, y1 == null ? p.H : p.Y(y1)); ctx.stroke(); ctx.restore(); }
function piTicks(labelEvery, gridEvery){ return { step:gridEvery * PI, fmt:function(t){ return isInt(t / PI / labelEvery) ? MV.piLabel(t) : ""; } }; }

// @component N23 overlayGauge (from MHF4U 27) — gap shading between a moving curve and a target (G6; dark mode adds a --hi edge)
// and the largest vertical gap across the window; the exact match test lives with each use.
function gap(h, T, x0, x1){ var g = 0; for (var i = 0; i <= 1440; i++) { var x = x0 + (x1 - x0) * i / 1440, d = Math.abs(h(x) - T(x)); if (isFinite(d) && d > g) g = d; } return g; }
function shade(p, h, T, alpha){
  if (!(alpha > 0)) return;
  var ctx = p.ctx, v = p.v, N = Math.max(400, Math.round(p.W * 2)), i, x, cl = function(y){ return p.Y(Math.max(v.ymin - 1, Math.min(v.ymax + 1, y))); };
  ctx.save(); ctx.beginPath();
  for (i = 0; i <= N; i++) { x = v.xmin + (v.xmax - v.xmin) * i / N; if (i) ctx.lineTo(p.X(x), cl(h(x))); else ctx.moveTo(p.X(x), cl(h(x))); }
  for (i = N; i >= 0; i--) { x = v.xmin + (v.xmax - v.xmin) * i / N; ctx.lineTo(p.X(x), cl(T(x))); }
  ctx.closePath(); ctx.globalAlpha = alpha; ctx.fillStyle = css("--hi-soft"); ctx.fill();
  if (isDark()) { ctx.lineWidth = 5.2; ctx.lineJoin = "round"; ctx.strokeStyle = css("--hi"); ctx.globalAlpha = 0.4 * alpha;
    [h, T].forEach(function(f){ ctx.beginPath(); for (i = 0; i <= N; i++) { x = v.xmin + (v.xmax - v.xmin) * i / N; if (i) ctx.lineTo(p.X(x), cl(f(x))); else ctx.moveTo(p.X(x), cl(f(x))); } ctx.stroke(); }); }
  ctx.restore();
};

// @component insideRuler — strip under a graph's x-axis showing a sinusoid's inside angle: ticks labelled 0, π/2, π, 3π/2, 2π
// under one cycle (0 tick teal, 0-to-2π span underlined orange), fainter unlabelled ticks every π/2 beyond. Set it from the wave
// (x0 = d, x1 = d + period) or from two entered x-values (dashed until they are right). o.pulse highlights one labelled tick.
var RUL_LAB = [Q(0), Q(1, 2), Q(1), Q(3, 2), Q(2)];
function drawRuler(p, o){
  p.draw({ view:{ xmin:o.view.xmin, xmax:o.view.xmax, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:o.desc, after:function(ctx){
    var ink = css("--ink"), ink2 = css("--ink-2"), by = 11;
    ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(p.W, by); ctx.stroke(); ctx.restore();
    if (o.empty) { ctx.save(); ctx.font = "12px " + p.fontUI; ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.empty, p.W / 2, 32); ctx.restore(); return; }
    var x0 = o.x0, q = (o.x1 - o.x0) / 4, dash = o.solid === false ? [5, 4] : [];
    if (!(Math.abs(q) > 1e-9)) return;
    var X0 = p.X(o.x0), X1 = p.X(o.x1);
    ctx.save(); ctx.strokeStyle = css("--p-k"); ctx.lineWidth = 4; ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(X0, by + 2); ctx.lineTo(X1, by + 2); ctx.stroke(); ctx.restore();
    var lo = Math.min((o.view.xmin - x0) / q, (o.view.xmax - x0) / q), hi = Math.max((o.view.xmin - x0) / q, (o.view.xmax - x0) / q);
    var px = Math.abs(p.X(x0 + q) - p.X(x0));
    for (var j = Math.ceil(lo - 1e-9); j <= Math.floor(hi + 1e-9); j++) {
      var X = p.X(x0 + j * q), main = j >= 0 && j <= 4;
      if (X < -2 || X > p.W + 2) continue;
      ctx.save(); ctx.setLineDash(main ? dash : []);
      ctx.strokeStyle = main ? (j === 0 ? css("--p-d") : ink) : ink2; ctx.globalAlpha = main ? 1 : 0.45; ctx.lineWidth = main ? (j === 0 ? 3 : 2) : 1.2;
      ctx.beginPath(); ctx.moveTo(X, by - (main ? 7 : 4)); ctx.lineTo(X, by + (main ? 9 : 5)); ctx.stroke(); ctx.restore();
      if (!main) continue;
      if ((px < 26 && (j === 1 || j === 3)) || (px < 13 && j === 2)) continue;
      if (o.pulse === j) { ctx.save(); ctx.fillStyle = css("--hi"); ctx.globalAlpha = 0.85; ctx.fillRect(X - 14, by + 11, 28, 30); ctx.restore(); }
      drawToks(ctx, p, tPi(RUL_LAB[j], j === 0 ? css("--p-d") : ink), X, by + 26, { align:"center", size:13, bg:false });
    }
  } });
}
function rulerDesc(insidePlain, x0, x1){ return "Inside ruler: the inside, " + insidePlain + ", is 0 at x = " + x0 + " and 2π at x = " + x1 + "."; }

// @component radioGroup (from MHF4U 25) — segmented control or chip row as a real radio group (arrow keys, roving tabindex, lock)
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, relabel:function(opts){ o.options = opts; paint(); } };
}

// @component N9 stepSlider — slider over a list of positions with 40 px − / + buttons, custom Page Up/Down steps, a formatted
// value label, and a hollow "between steps" thumb when an exact value sits between positions
function stepSlider(host, o){
  host.innerHTML = '<div class="wt-sl" style="--sc:var(' + o.color + ')"><div class="wt-sl-top"><label for="wt-' + o.id + '-in">' + o.label + '</label><output id="wt-' + o.id + '-o" for="wt-' + o.id + '-in"></output></div>' +
    '<div class="wt-sl-row"><button type="button" class="btn ghost wt-pm" data-pm="-1" data-k="' + o.id + 'm" aria-label="Decrease ' + o.name + '">' + MINUS + '</button><input type="range" id="wt-' + o.id + '-in" min="0" max="' + (o.n - 1) + '" step="1">' +
    '<button type="button" class="btn ghost wt-pm" data-pm="1" data-k="' + o.id + 'p" aria-label="Increase ' + o.name + '">+</button></div></div>';
  var inp = host.querySelector("input"), out = host.querySelector("output"), btns = host.querySelectorAll("[data-pm]"), cur = o.idx, between = null, locked = false;
  function paint(){
    inp.value = cur; inp.classList.toggle("between", between != null);
    out.innerHTML = between != null ? between : o.fmt(cur);
    inp.setAttribute("aria-valuetext", between != null ? MV.plain(between) : o.say(cur));
    inp.disabled = locked; btns[0].disabled = locked || (between == null && cur <= 0); btns[1].disabled = locked || (between == null && cur >= o.n - 1);
  }
  function go(i, how){ i = clamp(i, 0, o.n - 1); if (i === cur && between == null) { paint(); return; } cur = i; between = null; paint(); o.onChange(cur, how); }
  inp.addEventListener("input", function(){ cur = +inp.value; between = null; paint(); o.onChange(cur, "drag"); });
  inp.addEventListener("keydown", function(e){ if (e.key === "PageUp" || e.key === "PageDown") { e.preventDefault(); if (!locked) go(cur + (e.key === "PageUp" ? 1 : -1) * (o.page || 1), "key"); } });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pm]"); if (!b || b.disabled) return; var dir = +b.dataset.pm; go(between != null && o.fromBetween ? o.fromBetween(dir) : cur + dir, "step"); });
  paint();
  return { set:function(i, bw){ cur = i; between = bw || null; paint(); }, lock:function(b){ locked = !!b; paint(); }, get:function(){ return cur; }, between:function(){ return between != null; } };
}

// ---------- hero: sin x, then a, k, d and c one at a time (storyboard in the plan) ----------
function hero(f){
  var V = { xmin:-PI / 2, xmax:5 * PI / 2, ymin:-2.5, ymax:3.5 }, p = new MV.Plot(f.canvas, V), RM = MV.reduceMotion;
  var FIN = { f:"sin", a:2, k:2, d:PI / 6, c:1 };
  var H = { W:RM ? FIN : { f:"sin", a:1, k:1, d:0, c:0 }, rev:RM ? 1 : 0, full:RM ? 1 : 0, step:RM ? 5 : 0, grow:RM ? 1 : 0 };
  var caps = ["`y = sin x`: amplitude 1, period 2π", "`@a{a} = 2`: amplitude 2", "`@k{k} = 2`: period 2π/2 = π", "`@d{d} = π/6`: phase shift π/6 right", "`@c{c} = 1`: axis `y = 1`", "`y = @a{2} sin[@k{2}(x - @d{π/6})] + @c{1}`: max 3, min −1"];
  function cap(i){ f.cap.innerHTML = MV.md(caps[i]); }
  p.render = function(){
    var W = H.W, A = Math.abs(W.a), Pd = TAU / W.k, s = H.step;
    p.draw({ view:V, xTicks:{ step:PI / 6, fmt:function(t){ return isInt(t / (PI / 2)) ? MV.piLabel(t) : ""; } }, yTicks:{ step:1 },
      describe:MV.plain(MV.md(caps[Math.min(5, Math.max(0, s))])) + (s >= 1 ? ". The graph of y = sin x is dashed behind it." : "."),
      after:function(ctx){
        var K = { ink:css("--ink"), ink2:css("--ink-2"), pen:css("--pen"), ac:css("--acol"), pk:css("--p-k"), pd:css("--p-d"), pc:css("--p-c") };
        if (s >= 4) hLine(ctx, p, W.c, K.pc, 1.5, [8, 6]);
        if (s >= 1) curveOn(p, Math.sin, { color:K.ink2, width:2, dash:[6, 6], alpha:0.6 });
        var fw = waveF(W);
        if (H.full < 1) { curveOn(p, fw, { color:K.pen, width:3.2, domain:[0, Math.max(0.001, TAU * H.rev)] }); if (H.full > 0) curveOn(p, fw, { color:K.pen, width:3.2, alpha:H.full }); }
        else curveOn(p, fw, { color:K.pen, width:3.2 });
        if (s >= 1) { var xm = W.d + Pd / 4, hgt = s === 1 ? H.grow : 1; ctx.save(); ctx.strokeStyle = K.ac; ctx.lineWidth = 2.5; var Xa = p.X(xm) - 10, Y0 = p.Y(W.c), Y1 = p.Y(W.c + A * hgt); ctx.beginPath(); ctx.moveTo(Xa, Y0); ctx.lineTo(Xa, Y1); ctx.moveTo(Xa - 4, Y0); ctx.lineTo(Xa + 4, Y0); ctx.moveTo(Xa - 4, Y1); ctx.lineTo(Xa + 4, Y1); ctx.stroke(); ctx.restore();
          if (s > 1 || H.grow >= 1) drawToks(ctx, p, [{ t:"|", c:K.ac }, { t:"a", i:true, c:K.ac }, { t:"| = " + num(Math.round(A * 100) / 100), c:K.ac }], Xa - 6, (Y0 + Y1) / 2, { align:"right", size:13 }); }
        if (s >= 2) { var Yp = p.Y(W.c + A) - 12, Xs = p.X(W.d), Xe = p.X(W.d + Pd); ctx.save(); ctx.strokeStyle = K.pk; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(Xs, Yp + 5); ctx.lineTo(Xs, Yp); ctx.lineTo(Xe, Yp); ctx.lineTo(Xe, Yp + 5); ctx.stroke(); ctx.restore();
          var pq = qOf(Pd / PI); if (pq && (s > 2 || H.grow >= 1)) drawToks(ctx, p, [{ t:"period ", c:K.pk }].concat(tPi(pq, K.pk)), (Xs + Xe) / 2, Yp - 14, { align:"center", size:13 }); }
        if (s >= 3 && Math.abs(W.d) > 1e-6) { ctx.save(); ctx.strokeStyle = K.pd; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(p.X(0), p.Y(W.c)); ctx.lineTo(p.X(W.d), p.Y(W.c)); ctx.stroke(); ctx.restore(); p.head([W.d - 0.05, W.c], [W.d, W.c], K.pd, 9);
          if (s > 3 || H.grow >= 1) drawToks(ctx, p, [{ t:"d", i:true, c:K.pd }, { t:" = ", c:K.pd }].concat(tPi(Q(1, 6), K.pd)), p.X(W.d) + 6, p.Y(W.c) + 22, { align:"left", size:13 }); }
        if (s >= 4 && (s > 4 || H.grow >= 1)) drawToks(ctx, p, [{ t:"y", i:true, c:K.pc }, { t:" = " + num(W.c), c:K.pc }], p.W - 6, p.Y(W.c) - 12, { align:"right", size:13 });
        if (H.rev >= 1) for (var j = 0; j < 5; j++) p.point({ x:W.d + j * Pd / 4, y:W.a * PAT.sin[j] + W.c, r:4.5, color:K.ink });
      } });
  };
  cap(RM ? 5 : 0); p.render();
  if (RM) return;
  var seq = [null, { a:2 }, { k:2 }, { d:PI / 6 }, { c:1 }];
  function step(s){
    if (s > 4) { H.step = 5; cap(5); p.render(); return; }
    var from = Object.assign({}, H.W), to = Object.assign({}, from, seq[s]); H.step = s; H.grow = 0; cap(s);
    MV.tween({ dur:s === 2 ? 1200 : 1000, step:function(t){ H.grow = t; H.W = { f:"sin", a:lerp(from.a, to.a, t), k:lerp(from.k, to.k, t), d:lerp(from.d, to.d, t), c:lerp(from.c, to.c, t) }; p.render(); },
      done:function(){ H.W = to; H.grow = 1; p.render(); MV.wait(1000, function(){ step(s + 1); }); } });
  }
  MV.tween({ dur:1200, ease:LIN, step:function(t){ H.rev = t; p.render(); }, done:function(){ H.rev = 1; p.render();
    MV.tween({ dur:400, step:function(t){ H.full = t; p.render(); }, done:function(){ H.full = 1; MV.wait(700, function(){ step(1); }); } }); } });
}

// ---------- Explore: wave tuner ----------
var KS = [[1, 2], [2, 3], [3, 4], [1, 1], [4, 3], [3, 2], [2, 1], [3, 1], [4, 1]];
var AV = [-3, -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3];
var CV = [-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
var VIEW = { xmin:-TAU, xmax:3 * TAU, ymin:-6.5, ymax:6.5 };
function kQ(i){ return Q(KS[i][0], KS[i][1]); }
function kIdx(k){ for (var i = 0; i < KS.length; i++) if (KS[i][0] * k.d === KS[i][1] * k.n) return i; return -1; }

// readout rows from the exact state E = {form, P, b}
function readRows(E){
  var P = E.P, A = Math.abs(P.a), k = P.k, one = k.n === k.d, Pq = qDiv(Q(2), k), rows = [], d = P.d, key = pkey(P.f, P.a);
  if (E.form === "F") { rows.push(["Equation", m(eqF(P, true, true))]); rows.push(["Expanded form", one || !d.n ? "Same as above" : m(eqE(P, bOf(P), true, true))]); }
  else { rows.push(["Equation", m(eqE(P, E.b, true, true))]); rows.push(["Factored form", one || !E.b.n ? "Same as above" : m(eqF(P, true, true))]); }
  rows.push(["Amplitude", num(A) + (P.a < 0 ? " (" + m("|@a{" + dec(P.a) + "}| = " + dec(A)) + ": an amplitude is a distance, never negative)" : "")]);
  var v = [];
  if (A !== 1) v.push((A > 1 ? "stretch" : "compression") + " by a factor of " + num(A));
  if (P.a < 0) v.push((v.length ? "a reflection" : "reflection") + " in the " + m("x") + "-axis (" + m("@a{a} < 0") + ")");
  rows.push(["Vertical stretch and reflection", v.length ? cap1(v.join(", and ")) : "None"]);
  rows.push(["Period", one ? m("2π") + " (" + m("@k{k} = 1") + ")" : k.d === 1 ? m("{2π}/{@k{" + k.n + "}} = " + piSrc(Pq, true)) : m("2π ÷ " + kSrc(k, true) + " = " + piSrc(Pq, true))]);
  var inv = Q(k.d, k.n);
  rows.push(["Horizontal stretch", one ? "None" : (qV(k) > 1 ? "Compression" : "Stretch") + " by a factor of " + m(ratSrc(inv, true))]);
  var per = d.n ? qDiv(d, Pq) : null, perTxt = per && qInt(per) ? ": exactly " + (Math.abs(per.n) === 1 ? "one period" : Math.abs(per.n) + " periods") : "";
  rows.push(["Phase shift", !d.n ? "None (" + m("@d{d} = 0") + ")" : m(piSrc(Q(Math.abs(d.n), d.d), true)) + " to the " + (d.n > 0 ? "right" : "left") + " (" + m("@d{d} = " + piSrc(d, true)) + ")" + perTxt]);
  rows.push(["Axis", !P.c ? m("y = 0") + ", the " + m("x") + "-axis" : m("y = @c{" + dec(P.c) + "}") + " (" + m("@c{c} = " + dec(P.c)) + ")"]);
  rows.push(["Maximum and minimum", "Max " + num(P.c + A) + ", min " + num(P.c - A) + " (" + m("@c{c} + |@a{a}|") + " and " + m("@c{c} - |@a{a}|") + ")"]);
  rows.push(["Domain and range", m("{x ∈ ℝ}") + "; " + m("{y ∈ ℝ | " + dec(P.c - A) + " ≤ y ≤ " + dec(P.c + A) + "}")]);
  rows.push(["Highlighted cycle", m("x = " + piSrc(d, true)) + " to " + m("x = " + piSrc(qAdd(d, Pq), true)) + " (the inside runs from 0 to 2π)"]);
  rows.push(["Key points", [0, 1, 2, 3, 4].map(function(j){ return m("(" + piSrc(keyX(P, j), true) + ", " + dec(keyY(P, j)) + ")"); }).join(", ")]);
  rows.push(["Cycle pattern", (P.f === "sin" ? "Sine" : "Cosine") + ", " + m("@a{a} " + (P.a > 0 ? ">" : "<") + " 0") + ": " + PATW[key]]);
  if (E.form === "E") { var mb = qNeg(E.b); rows.push(["Phase shift from " + m("b"), m(inESrc(k, E.b, false, true) + " = " + inFSrc(k, d, false, true)) + ": " + m("d = -b/k = " + piSrc(d, true)) + (qEq(d, mb) ? "" : ", not " + m(piSrc(mb, true)))]); }
  return rows;
}

function explore(host, api){
  var S = api.S, C = api.content, FB = C.chalFb, CH = {};
  C.challenges.forEach(function(c){ CH[c.id] = c; });
  var WHY2 = CH.tc2.why;
  def(S, { form:"F", f:"sin", a:1, ki:3, d:[0, 1], b:[0, 1], c:0, sh:{ parent:true, box:true, ruler:true, table:false }, ch:null, tc2shown:false, tc2same:false, tc3done:false, tc3k:3, tc3d:"" });
  if (!(S.ki >= 0 && S.ki < KS.length)) S.ki = 3;
  if (AV.indexOf(S.a) < 0) S.a = 1;
  if (CV.indexOf(S.c) < 0) S.c = 0;
  if (S.tc2same) CH.tc2.why = CH.tc2.whySame;
  var O = { W:null, glow:null, ghost:null, ghostGap:false, pulse:-1, thick:false, gap:1, busy:false, cancel:null, note:"", capHold:false };
  host.innerHTML = '<div class="wt">' +
    '<div class="wt-graph"><div class="eq-cap wt-cap" id="wt-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot" id="wt-plot" tabindex="0" role="img" aria-label="Graph of the wave"></canvas></div>' +
      '<div id="wt-rw"><canvas class="wt-ruler" id="wt-rul" role="img" aria-label="Inside ruler"></canvas><p class="wt-rcap" id="wt-rcap"></p></div>' +
      '<p class="wt-gauge" id="wt-gauge" aria-live="polite"></p><p class="tiny muted wt-keys">Graph keys: ← and → step ' + m("@d{d}") + " (or " + m("b") + "), ↑ and ↓ step " + m("@c{c}") + ".</p></div>" +
    '<div class="wt-ctrl"><div class="wt-chal" id="wt-chal" hidden></div><div id="wt-form" class="wt-row"></div><div id="wt-f" class="wt-row"></div>' +
      '<div id="wt-sa"></div><div id="wt-sk"></div><div id="wt-sd"></div><div id="wt-sb"></div><div id="wt-sc"></div>' +
      '<div class="wt-show" role="group" aria-label="Show"><span class="rg-lab">Show:</span>' + [["parent", "Parent graph"], ["box", "Cycle box and key points"], ["ruler", "Inside ruler"], ["table", "Key-point table"]].map(function(t){ return '<button type="button" class="chip wt-tog" data-show="' + t[0] + '" data-k="wts' + t[0] + '" aria-pressed="false">' + t[1] + "</button>"; }).join("") + "</div>" +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="wt-reset" data-k="wtreset">Reset</button></div><p class="tiny wt-note" id="wt-note" aria-live="polite"></p></div>' +
    '<div class="wt-tbl" id="wt-tbl" hidden></div>' +
    '<div class="wt-read"><dl class="read" id="wt-read"></dl><p class="vh" id="wt-say" aria-live="polite"></p></div></div>';
  var cv = $("#wt-plot", host), plot = new MV.Plot(cv, VIEW), rul = new MV.Plot($("#wt-rul", host), VIEW);
  function exact(){
    var k = kQ(S.ki), d, b;
    if (S.form === "F") { d = qA(S.d); b = qNeg(qMul(k, d)); } else { b = qA(S.b); d = qDiv(qNeg(b), k); }
    return { form:S.form, P:{ f:S.f, a:S.a, k:k, d:d, c:S.c }, b:b };
  }
  function cur(){ return O.W || flo(exact().P); }
  function target(){
    if (S.ch === "tc2" && S.tc2shown) return { f:"sin", a:2, k:3, d:PI / 6, c:1 };
    if (S.ch === "tc3" && S.tc3done) return { f:"sin", a:1, k:2, d:PI / 12, c:0 };
    return null;
  }
  function locks(){
    var L = { form:false, f:false, a:false, k:false, d:false, b:false, c:false };
    if (O.busy) { Object.keys(L).forEach(function(k){ L[k] = true; }); return L; }
    if (S.ch === "tc1") L.form = L.f = L.k = L.d = L.b = true;
    if (S.ch === "tc2") L.form = L.f = L.a = true;
    if (S.ch === "tc3") { L.form = L.f = L.a = L.c = true; if (!S.tc3done) L.k = L.d = L.b = true; }
    return L;
  }
  // ----- controls -----
  var rForm = radios($("#wt-form", host), { label:"Form", options:[{ id:"F", t:"Factored " + m("y = @a{a} f[@k{k}(x - @d{d})] + @c{c}") }, { id:"E", t:"Expanded " + m("y = @a{a} f(@k{k}x + b) + @c{c}") }], value:S.form, cls:"seg wt-formseg", onChange:switchForm });
  var rF = radios($("#wt-f", host), { label:"Function " + m("f") + ":", aria:"Function f", options:[{ id:"sin", t:m("sin") }, { id:"cos", t:m("cos") }], value:S.f, cls:"chips", onChange:function(v){ if (O.busy) return; S.f = v; userChange(); } });
  function between12(qa, dir, off){ var v = qV(qA(qa)) * 12; return (dir > 0 ? Math.floor(v + 1e-9) + 1 : Math.ceil(v - 1e-9) - 1) + off; }
  var slA = stepSlider($("#wt-sa", host), { id:"sa", name:"a", label:m("@a{a}") + " vertical stretch", color:"--acol", n:AV.length, idx:AV.indexOf(S.a), page:2,
    fmt:function(i){ return m("@a{a} = " + dec(AV[i])); }, say:function(i){ return "a = " + num(AV[i]); }, onChange:function(i, how){ setParam("a", AV[i], how); } });
  var slK = stepSlider($("#wt-sk", host), { id:"sk", name:"k", label:m("@k{k}") + " horizontal stretch", color:"--p-k", n:KS.length, idx:S.ki, page:1,
    fmt:function(i){ return m("@k{k} = " + ratSrc(kQ(i), true)); }, say:function(i){ return "k = " + ratT(kQ(i)); }, onChange:function(i, how){ setParam("k", i, how); } });
  var slD = stepSlider($("#wt-sd", host), { id:"sd", name:"d", label:m("@d{d}") + " phase shift", color:"--p-d", n:49, idx:24, page:3,
    fmt:function(i){ return m("@d{d} = " + piSrc(Q(i - 24, 12), true)); }, say:function(i){ return "d = " + piT(Q(i - 24, 12)); }, fromBetween:function(dir){ return between12(S.d, dir, 24); },
    onChange:function(i, how){ var q = Q(i - 24, 12); setParam("d", [q.n, q.d], how); } });
  var slB = stepSlider($("#wt-sb", host), { id:"sb", name:"b", label:m("b") + " constant in " + m("kx + b"), color:"--ink", n:25, idx:12, page:3,
    fmt:function(i){ return m("b = " + piSrc(Q(i - 12, 12), true)); }, say:function(i){ return "b = " + piT(Q(i - 12, 12)); }, fromBetween:function(dir){ return between12(S.b, dir, 12); },
    onChange:function(i, how){ var q = Q(i - 12, 12); setParam("b", [q.n, q.d], how); } });
  var slC = stepSlider($("#wt-sc", host), { id:"sc", name:"c", label:m("@c{c}") + " axis", color:"--p-c", n:CV.length, idx:CV.indexOf(S.c), page:2,
    fmt:function(i){ return m("@c{c} = " + dec(CV[i])); }, say:function(i){ return "c = " + num(CV[i]); }, onChange:function(i, how){ setParam("c", CV[i], how); } });

  function setParam(key, val, how){
    if (O.busy) { paint(); return; }
    var from = cur(), oldA = S.a;
    S[key === "k" ? "ki" : key] = val;
    if (S.ch === "tc3" && S.tc3done && (key === "k" || key === "d")) { S.tc3k = S.ki; S.tc3d = ratT(qA(S.d)); syncPanel(); }
    if (how === "step" && !MV.reduceMotion) {
      var dur = { a:800, k:1500, d:1200, b:1200, c:1000 }[key], glow = null;
      if (key === "k") glow = S.form === "F" ? { x:qV(qA(S.d)) * PI, col:"--p-d" } : { x:0, col:"--hi" };
      if (key === "a" && (oldA > 0) !== (val > 0)) glow = { axis:true };
      tweenTo(from, dur, glow, null, function(){ MV.changed(); });
      api.save(); paint(); announce();
    } else { userChange(); }
  }
  function userChange(){ api.save(); paint(); MV.changed(); announce(); }
  function tweenTo(from, dur, glow, kPath, done){
    if (O.cancel) O.cancel();
    var to = flo(exact().P), E = S.form === "E", bf = -from.k * from.d, bt = -to.k * to.d;
    O.glow = glow; O.W = from; O.boxA = glow && glow.axis ? Math.abs(to.a) : null;
    O.cancel = MV.tween({ dur:dur, ease:kPath ? LIN : null, step:function(t){
        var k = kPath ? kPath(t) : lerp(from.k, to.k, t);
        O.W = { f:to.f, a:lerp(from.a, to.a, t), k:k, d:E ? -lerp(bf, bt, t) / k : lerp(from.d, to.d, t), c:lerp(from.c, to.c, t) };
        drawAll();
      }, done:function(){ O.W = null; O.glow = null; O.cancel = null; O.boxA = null; drawAll(); if (done) done(); } });
  }
  function switchForm(v){
    if (O.busy || v === S.form) return;
    var E = exact(), note = "Same wave, written the other way.";
    if (v === "E") {
      var b = E.b, bn = b, s = 0;
      while (bn.n > bn.d) { bn = qSub(bn, Q(2)); s -= 2; }
      while (bn.n <= -bn.d) { bn = qAdd(bn, Q(2)); s += 2; }
      S.b = [bn.n, bn.d];
      if (s) note += " " + m("b = " + piSrc(b) + (s > 0 ? " + " : " - ") + piSrc(Q(Math.abs(s))) + " = " + piSrc(bn)) + ": " + (s > 0 ? "adding " : "subtracting ") + (Math.abs(s) === 2 ? "2π" : "a multiple of 2π") + (s > 0 ? " to " : " from ") + m("b") + " changes nothing.";
    } else S.d = [E.P.d.n, E.P.d.d];
    S.form = v; O.note = note; captionSwap(); api.save(); paint(); MV.changed(); announce();
  }
  function captionSwap(){
    var el = $("#wt-cap", host);
    if (MV.reduceMotion) return;
    O.capHold = true; el.classList.add("wt-out");
    setTimeout(function(){ O.capHold = false; caption(); el.classList.remove("wt-out"); }, 300);
  }
  function caption(){ if (O.capHold) return; var E = exact(); $("#wt-cap", host).innerHTML = m(E.form === "F" ? eqF(E.P, true, true) : eqE(E.P, E.b, true, true)); }

  // ----- drawing -----
  function scene(ctx, p){
    var W = cur(), E = exact(), A = O.boxA != null ? O.boxA : Math.abs(W.a), Pd = TAU / W.k, D = W.d, top = W.c + A, bot = W.c - A, f = waveF(W), T = target();
    var anim = !!O.W || Math.abs(p.X(Pd) - p.X(0)) < 60; // crowded labels move to the readout (it always has them)
    var K = { ink:css("--ink"), ink2:css("--ink-2"), pen:css("--pen"), ac:css("--acol"), pk:css("--p-k"), pd:css("--p-d"), pc:css("--p-c"), hi:css("--hi"), hs:css("--hi-soft") };
    if (T && O.gap > 0) shade(p, f, waveF(T), O.gap);
    if (O.ghost && O.ghostGap) shade(p, f, waveF(O.ghost), 0.9);
    if (S.sh.box && A > 0.02) {
      var X0 = p.X(D), X1 = p.X(D + Pd), Yt = p.Y(top), Yb = p.Y(bot);
      ctx.save(); ctx.fillStyle = K.hs; ctx.fillRect(X0, Yt, X1 - X0, Yb - Yt);
      if (isDark()) { ctx.strokeStyle = K.hi; ctx.lineWidth = 1; ctx.strokeRect(X0 - 1.5, Yt - 1.5, X1 - X0 + 3, Yb - Yt + 3); }
      ctx.strokeStyle = K.ink2; ctx.lineWidth = 1; ctx.strokeRect(X0 + 0.5, Yt + 0.5, X1 - X0 - 1, Yb - Yt - 1);
      ctx.setLineDash([2, 3]); ctx.beginPath(); for (var j = 1; j < 4; j++) { var xq = p.X(D + j * Pd / 4); ctx.moveTo(xq, Yt); ctx.lineTo(xq, Yb); } ctx.stroke(); ctx.restore();
    }
    if (O.glow) {
      ctx.save(); ctx.globalAlpha = 0.4; ctx.lineWidth = 10; ctx.lineCap = "round"; ctx.beginPath();
      if (O.glow.axis) { ctx.strokeStyle = K.pc; ctx.moveTo(0, p.Y(W.c)); ctx.lineTo(p.W, p.Y(W.c)); }
      else { ctx.strokeStyle = css(O.glow.col || "--hi"); ctx.moveTo(p.X(O.glow.x), 0); ctx.lineTo(p.X(O.glow.x), p.H); }
      ctx.stroke(); ctx.restore();
    }
    if (S.ch === "tc1") [4, -2].forEach(function(y){ hLine(ctx, p, y, K.ink2, 1.6, [5, 5]); drawToks(ctx, p, [{ t:"y", i:true, c:K.ink2 }, { t:" = " + num(y), c:K.ink2 }], 6, p.Y(y) - 11, { size:12 }); });
    hLine(ctx, p, W.c, K.pc, 1.5, [8, 6]);
    if (S.sh.parent) curveOn(p, FN[W.f], { color:K.ink2, width:2, dash:[6, 6], alpha:0.6 });
    if (O.ghost) curveOn(p, waveF(O.ghost), { color:K.ink2, width:2.2, dash:[10, 6], alpha:0.95 });
    if (T) curveOn(p, waveF(T), { color:K.ink2, width:2.4, dash:[12, 7] });
    curveOn(p, f, { color:K.pen, width:O.thick ? 3.4 : 3, n:1600 });
    if (!anim) drawToks(ctx, p, [{ t:"y", i:true, c:K.pc }, { t:" = " + num(W.c), c:K.pc }], p.W - 6, p.Y(W.c) - 12, { align:"right", size:13 });
    if (A > 0.05) {
      var xm = D + Pd * PEAK[pkey(W.f, W.a)], Xa = p.X(xm), Yc = p.Y(W.c), Ytop = p.Y(top);
      ctx.save(); ctx.strokeStyle = K.ac; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(Xa, Yc); ctx.lineTo(Xa, Ytop); ctx.moveTo(Xa - 5, Yc); ctx.lineTo(Xa + 5, Yc); ctx.moveTo(Xa - 5, Ytop); ctx.lineTo(Xa + 5, Ytop); ctx.stroke(); ctx.restore();
      var Xs = p.X(D), Xe = p.X(D + Pd), above = p.Y(top) - 40 > 0, Yp = above ? p.Y(top) - 9 : p.Y(bot) + 9, tk = above ? 5 : -5;
      ctx.save(); ctx.strokeStyle = K.pk; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(Xs, Yp + tk); ctx.lineTo(Xs, Yp); ctx.lineTo(Xe, Yp); ctx.lineTo(Xe, Yp + tk); ctx.stroke(); ctx.restore();
      if (!anim) {
        var Pq = qDiv(Q(2), E.P.k), lab = drawToks(ctx, p, [{ t:"|", c:K.ac }, { t:"a", i:true, c:K.ac }, { t:"| = " + num(A), c:K.ac }], Xa - 8, (Yc + Ytop) / 2, { align:"right", size:13 });
        void lab;
        drawToks(ctx, p, [{ t:"period ", c:K.pk }].concat(tPi(Pq, K.pk)), (Xs + Xe) / 2, above ? Yp - 15 : Yp + 17, { align:"center", size:13 });
      }
    }
    if (Math.abs(D) > 1e-6) {
      ctx.save(); ctx.strokeStyle = K.pd; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(p.X(0), p.Y(W.c)); ctx.lineTo(p.X(D), p.Y(W.c)); ctx.stroke(); ctx.restore();
      p.head([D - Math.sign(D) * 0.05, W.c], [D, W.c], K.pd, 10);
      if (!anim) { var dq = E.P.d; drawToks(ctx, p, [{ t:"d", i:true, c:K.pd }, { t:" = ", c:K.pd }].concat(tPi(dq, K.pd)), (p.X(0) + p.X(D)) / 2, p.Y(W.c) + 24, { align:"center", size:13 }); }
    }
    if (S.sh.box) {
      var gapPx = Math.abs(p.X(Pd / 4) - p.X(0));
      for (var i = 0; i < 5; i++) {
        var kx = D + i * Pd / 4, ky = W.a * PAT[W.f][i] + W.c;
        if (O.pulse === i) { ctx.save(); ctx.strokeStyle = K.hi; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p.X(kx), p.Y(ky), 10 + 2.5 * Math.sin(Date.now() / 160), 0, TAU); ctx.stroke(); ctx.restore(); }
        p.point({ x:kx, y:ky, r:4.5, color:K.ink });
        if (gapPx >= 14) { ctx.save(); ctx.font = "600 11px " + p.fontUI; ctx.fillStyle = K.ink2; ctx.textAlign = "center"; ctx.textBaseline = "middle"; var ly = p.Y(ky) + (PAT[W.f][i] * Math.sign(W.a || 1) < 0 ? 13 : -13); ctx.fillText(String(i + 1), p.X(kx) + 9, ly); ctx.restore(); }
      }
    }
    if (S.ch === "tc3" && S.tc3done) [[PI / 3, 1, Q(1, 3), "1"], [5 * PI / 6, -1, Q(5, 6), MINUS + "1"]].forEach(function(t){
      p.point({ x:t[0], y:t[1], r:8, open:true, color:K.ink });
      drawToks(ctx, p, [{ t:"(" }].concat(tPi(t[2]), [{ t:", " + t[3] + ")" }]), p.X(t[0]) + 12, p.Y(t[1]) + (t[1] > 0 ? -18 : 18), { size:12 });
    });
  }
  function desc(){
    var E = exact(), P = E.P, A = Math.abs(P.a), Pq = qDiv(Q(2), P.k);
    var s = "Graph of " + MV.plain(m(E.form === "F" ? eqF(P) : eqE(P, E.b))) + ". Axis y = " + num(P.c) + ", between " + num(P.c - A) + " and " + num(P.c + A) + ", period " + piT(Pq) + ". One cycle highlighted from " + piT(P.d) + " to " + piT(qAdd(P.d, Pq)) + ".";
    if (S.sh.parent) s += " The parent y = " + P.f + " x is dashed.";
    if (target()) s += " A dashed target wave is shown.";
    if (S.ch === "tc1") s += " Dashed lines mark y = 4 and y = −2.";
    return s;
  }
  plot.render = function(){
    var ph = plot.c.getBoundingClientRect().width < 500;
    plot.draw({ view:VIEW, xTicks:piTicks(ph ? 1 : 0.5, ph ? 0.5 : 0.25), yTicks:{ step:1, fmt:function(t){ return ph && Math.round(t) % 2 ? "" : num(t); } }, describe:desc(), after:scene });
  };
  rul.render = function(){
    var W = cur(), E = exact(), ins = E.form === "F" ? inFSrc(E.P.k, E.P.d, false, false) : inESrc(E.P.k, E.b, false, false);
    drawRuler(rul, { view:VIEW, x0:W.d, x1:W.d + TAU / W.k, pulse:O.pulse, desc:rulerDesc(MV.plain(m(ins)), piT(E.P.d), piT(qAdd(E.P.d, qDiv(Q(2), E.P.k)))) });
    $("#wt-rcap", host).innerHTML = "inside: " + m(E.form === "F" ? inFSrc(E.P.k, E.P.d, true, false) : inESrc(E.P.k, E.b, true, false));
  };
  function gaugeLine(){
    var T = target(), el = $("#wt-gauge", host);
    if (!T) { el.textContent = ""; el.hidden = true; return; }
    var g = gap(waveF(cur()), waveF(T), VIEW.xmin, VIEW.xmax);
    el.hidden = false; el.innerHTML = "<strong>Largest gap:</strong> " + (g < 1e-6 ? "0 (the graphs match)" : num(g, 2));
  }
  function drawAll(){ plot.render(); if (S.sh.ruler) rul.render(); gaugeLine(); }
  function tableHTML(){
    var E = exact(), P = E.P, th = ["0", "{π}/{2}", "π", "{3π}/{2}", "2π"], thT = ["0", "π/2", "π", "3π/2", "2π"];
    return '<div class="tbl-wrap"><table class="vt wt-kt"><caption class="vh">Key points of the highlighted cycle</caption><thead><tr><th scope="row">Inside angle θ</th>' +
      th.map(function(t, j){ return '<th scope="col"><button type="button" class="wt-col" data-col="' + j + '" data-k="wtc' + j + '" aria-label="Key point ' + (j + 1) + ": inside angle " + thT[j] + ", x = " + piT(keyX(P, j)) + ", y = " + num(keyY(P, j)) + '">' + m(t) + "</button></th>"; }).join("") + "</tr></thead><tbody>" +
      "<tr><th scope=\"row\">" + m(E.form === "F" ? "x = θ/@k{k} + @d{d}" : "x = (θ - b)/@k{k}") + "</th>" + [0, 1, 2, 3, 4].map(function(j){ return "<td>" + m(piSrc(keyX(P, j), true)) + "</td>"; }).join("") + "</tr>" +
      "<tr><th scope=\"row\">" + m(P.f + " θ") + "</th>" + PAT[P.f].map(function(v){ return "<td>" + num(v) + "</td>"; }).join("") + "</tr>" +
      "<tr><th scope=\"row\">" + m("y = @a{a} " + P.f + " θ + @c{c}") + "</th>" + [0, 1, 2, 3, 4].map(function(j){ return "<td>" + num(keyY(P, j)) + "</td>"; }).join("") + "</tr></tbody></table></div>" +
      '<p class="tiny muted">Focus a column (or hover over it) to pulse its key point on the graph and its tick on the ruler.</p>';
  }
  var tblEl = $("#wt-tbl", host), pulseRun = false;
  function setPulse(j){
    O.pulse = j; drawAll();
    if (j >= 0 && !pulseRun && !MV.reduceMotion) { pulseRun = true; (function loop(){ if (O.pulse < 0) { pulseRun = false; return; } plot.render(); requestAnimationFrame(loop); })(); }
  }
  tblEl.addEventListener("focusin", function(e){ var b = e.target.closest("[data-col]"); if (b) setPulse(+b.dataset.col); });
  tblEl.addEventListener("focusout", function(){ setPulse(-1); });
  tblEl.addEventListener("mouseover", function(e){ var b = e.target.closest("[data-col]"); if (b && O.pulse !== +b.dataset.col) setPulse(+b.dataset.col); });
  tblEl.addEventListener("mouseleave", function(){ if (!tblEl.contains(document.activeElement)) setPulse(-1); });
  function readout(){ $("#wt-read", host).innerHTML = MV.readoutHTML(readRows(exact())); }
  var sayT = null;
  function announce(){
    clearTimeout(sayT);
    sayT = setTimeout(function(){ var E = exact(), P = E.P, d = P.d; $("#wt-say", host).textContent = MV.plain(m(E.form === "F" ? eqF(P) : eqE(P, E.b))) + ". Amplitude " + num(Math.abs(P.a)) + ", period " + piT(qDiv(Q(2), P.k)) + ", phase shift " + (d.n ? piT(Q(Math.abs(d.n), d.d)) + " to the " + (d.n > 0 ? "right" : "left") : "none") + ", axis y = " + num(P.c) + "."; }, 500);
  }
  function chalNote(){
    var el = $("#wt-chal", host);
    if (!S.ch) { el.hidden = true; el.innerHTML = ""; return; }
    var txt = { tc1:"`f`, `k` and `d` are locked.", tc2:"Factored form, `f` and `a` are locked. The target appears after your first check.", tc3:S.tc3done ? "`a` and `c` are locked; `k` and `d` are free now." : "Every slider stays locked until your first check. Choose `k` and enter `d` in the challenge card." }[S.ch];
    el.hidden = false;
    el.innerHTML = '<p><strong>Challenge ' + S.ch.slice(2) + " is set up.</strong> " + MV.md(txt) + '</p><button type="button" class="btn ghost sm" id="wt-free" data-k="wtfree">Free tuning</button>';
  }
  function paint(){
    var L = locks(), dq = qA(S.d), bq = qA(S.b);
    rForm.set(S.form); rForm.lock(L.form); rF.set(S.f); rF.lock(L.f);
    slA.set(AV.indexOf(S.a)); slA.lock(L.a); slK.set(S.ki); slK.lock(L.k);
    $("#wt-sd", host).hidden = S.form !== "F"; $("#wt-sb", host).hidden = S.form !== "E";
    var dv = qV(dq) * 12, bv = qV(bq) * 12;
    slD.set(clamp(Math.round(dv), -24, 24) + 24, isInt(dv) ? null : m("@d{d} = " + piSrc(dq, true)) + ", between steps"); slD.lock(L.d);
    slB.set(clamp(Math.round(bv), -12, 12) + 12, isInt(bv) ? null : m("b = " + piSrc(bq, true)) + ", between steps"); slB.lock(L.b);
    slC.set(CV.indexOf(S.c)); slC.lock(L.c);
    $$(".wt-tog", host).forEach(function(b){ var on = !!S.sh[b.dataset.show]; b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); b.disabled = O.busy && b.dataset.show !== "table"; });
    $("#wt-reset", host).disabled = O.busy;
    $("#wt-rw", host).hidden = !S.sh.ruler; tblEl.hidden = !S.sh.table;
    if (S.sh.table) MV.keepFocus(tblEl, function(){ tblEl.innerHTML = tableHTML(); });
    $("#wt-note", host).innerHTML = O.note;
    chalNote(); caption(); readout(); drawAll();
  }
  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.show) { S.sh[b.dataset.show] = !S.sh[b.dataset.show]; if (b.dataset.show === "table" && !S.sh.table) setPulse(-1); api.save(); paint(); return; }
    if (b.id === "wt-reset") { if (O.cancel) O.cancel(); S.ch = null; S.form = "F"; S.f = "sin"; S.a = 1; S.ki = 3; S.d = [0, 1]; S.b = [0, 1]; S.c = 0; O.ghost = null; O.ghostGap = false; O.note = ""; O.W = null; O.glow = null; O.boxA = null; userChange(); return; }
    if (b.id === "wt-free") { S.ch = null; O.note = ""; api.save(); paint(); MV.changed(); var r = $("#wt-reset", host); if (r) r.focus(); }
  });
  cv.addEventListener("keydown", function(e){
    if (O.busy) return;
    var L = locks(), dir = 0;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      dir = e.key === "ArrowRight" ? 1 : -1; e.preventDefault();
      if (S.form === "F" && !L.d) { var i = slD.between() ? between12(S.d, dir, 24) : slD.get() + dir; i = clamp(i, 0, 48); var q = Q(i - 24, 12); setParam("d", [q.n, q.d], "key"); }
      else if (S.form === "E" && !L.b) { var i2 = slB.between() ? between12(S.b, dir, 12) : slB.get() + dir; i2 = clamp(i2, 0, 24); var q2 = Q(i2 - 12, 12); setParam("b", [q2.n, q2.d], "key"); }
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault(); if (L.c) return;
      var ci = clamp(CV.indexOf(S.c) + (e.key === "ArrowUp" ? 1 : -1), 0, CV.length - 1); setParam("c", CV[ci], "key");
    }
  });
  // challenges: tapping a card sets the tuner up for it; TC3's commit panel lives inside its card
  function enterChal(id){
    if (O.busy || S.ch === id) return;
    var st = MV.S.chal && MV.S.chal[id]; if (st && st.solved) return;
    if (O.cancel) { O.cancel(); O.cancel = null; O.W = null; O.glow = null; }
    S.ch = id; O.ghost = null; O.ghostGap = false; O.note = ""; O.gap = 1;
    if (id === "tc1") { S.form = "F"; S.f = "sin"; S.ki = 3; S.d = [0, 1]; }
    if (id === "tc2") { S.form = "F"; S.f = "sin"; S.a = 2; }
    if (id === "tc3") { S.form = "F"; S.f = "sin"; S.a = 1; S.c = 0; if (!S.tc3done) { S.ki = 3; S.d = [0, 1]; } }
    api.save(); paint(); MV.changed(); announce();
  }
  var chalBox = $("#chal");
  if (chalBox) chalBox.addEventListener("click", function(e){ var c = e.target.closest("[data-c]"); if (c) enterChal(c.dataset.c); }, true);
  var panel = document.createElement("div"); panel.className = "wt-commit";
  panel.innerHTML = '<p class="wt-commit-h"><strong>Commit:</strong> choose ' + m("@k{k}") + " and enter " + m("@d{d}") + ", then press Check challenge.</p><div class=\"wt-ck\"></div>" +
    '<div class="nm-row wt-cdrow"><label for="wt-cd">' + m("@d{d} =") + '</label><input class="numin short" id="wt-cd" type="text" inputmode="text" autocomplete="off"><span class="m">π</span></div>' +
    '<p class="tiny muted">Type the number in front of π as a fraction with denominator 1, 2, 3, 4, 6 or 12, for example −1/4 for −π/4.</p>';
  var rK3 = radios($(".wt-ck", panel), { label:m("@k{k}") + ":", aria:"k for challenge 3", options:KS.map(function(q, i){ return { id:i, t:m(ratSrc(Q(q[0], q[1]), true)) }; }), value:S.tc3k, cls:"chips", onChange:function(v){ S.tc3k = +v; api.save(); } });
  // the panel re-renders its chips on click, so keep its clicks away from the toolkit's challenge handler
  panel.addEventListener("click", function(e){ e.stopPropagation(); });
  var cdIn = $("#wt-cd", panel); cdIn.value = S.tc3d || "";
  cdIn.addEventListener("input", function(){ S.tc3d = cdIn.value; api.save(); });
  cdIn.addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); var b = $('#chal [data-c="tc3"] [data-act="check"]'); if (b) b.click(); } });
  function syncPanel(){ rK3.set(S.tc3k); if (document.activeElement !== cdIn) cdIn.value = S.tc3d; }
  function placePanel(){
    var card = $('#chal [data-c="tc3"]'); if (!card) return;
    var st = MV.S.chal && MV.S.chal.tc3;
    if (st && st.solved) { if (panel.parentNode) panel.parentNode.removeChild(panel); return; }
    var act = card.querySelector(".q-actions"); if (panel.parentNode !== card) card.insertBefore(panel, act);
  }
  if (chalBox) new MutationObserver(placePanel).observe(chalBox, { childList:true });
  function uncount(id){ setTimeout(function(){ var s = MV.S.chal && MV.S.chal[id]; if (s && s.tries > 0) { s.tries--; MV.save(); } }, 0); }
  function matchFx(){
    if (MV.reduceMotion) { O.gap = 0; drawAll(); return; }
    var go = function(){ O.thick = true; MV.tween({ dur:600, step:function(t){ O.gap = 1 - t; drawAll(); }, done:function(){ O.gap = 0; O.thick = false; drawAll(); } }); };
    if (O.cancel) MV.wait(1250, go); else go();
  }
  function tc3ok(P){ return P.f === "sin" && P.a === 1 && P.c === 0 && qEq(P.k, Q(2)) && qInt(qDiv(qSub(qMul(Q(2), qSub(Q(1, 3), P.d)), Q(1, 2)), Q(2))); }
  function tc2ok(P){ return P.f === "sin" && P.a === 2 && qEq(P.k, Q(3)) && P.c === 1 && qInt(qMul(qSub(P.d, Q(1, 6)), Q(3, 2))); }
  function challenge(id, o){
    o = o || {};
    var E = exact(), P = E.P, A = Math.abs(P.a);
    if (id === "tc1") {
      var ok1 = P.f === "sin" && qEq(P.k, Q(1)) && !P.d.n && P.c + A === 4 && P.c - A === -2;
      if (o.live || ok1) return { ok:ok1 };
      var F1 = FB.tc1;
      if (A === 3 && P.c === 0) return { ok:false, msg:F1.a3c0 };
      if (P.c === 1 && A !== 3) return { ok:false, msg:fill(F1.c1, { max:num(P.c + A), min:num(P.c - A) }) };
      if (A === 2 && P.c === 2) return { ok:false, msg:F1.a2c2 };
      if (A === 3 && P.c === -1) return { ok:false, msg:F1.a3cm1 };
      if (P.c === -2) return { ok:false, msg:F1.cm2 };
      return { ok:false, msg:F1.other };
    }
    if (id === "tc2") {
      var ok2 = S.form === "F" && tc2ok(P);
      if (o.live) return { ok:S.tc2shown && ok2 };
      S.tc2shown = true; api.save();
      if (ok2) { S.tc2same = !qEq(P.d, Q(1, 6)); CH.tc2.why = S.tc2same ? CH.tc2.whySame : WHY2; api.save(); O.gap = 1; matchFx(); return { ok:true }; }
      O.gap = 1; drawAll();
      var F2 = FB.tc2;
      if (!qEq(P.k, Q(3))) return { ok:false, msg:fill(F2.k, { k:m(ratSrc(P.k, true)), P:m(piSrc(qDiv(Q(2), P.k))) }) };
      if (qEq(P.d, Q(1, 2))) return { ok:false, msg:F2.dpi2 };
      if (qEq(P.d, Q(-1, 6))) return { ok:false, msg:F2.dm6 };
      if (P.c !== 1) return { ok:false, msg:F2.c };
      return { ok:false, msg:F2.other };
    }
    if (id === "tc3") {
      if (o.live) return { ok:S.tc3done && S.form === "F" && tc3ok(P) };
      var F3 = FB.tc3, v = parsePi(S.tc3d), q = qOf(v);
      if (!q || [1, 2, 3, 4, 6, 12].indexOf(q.d) < 0) { uncount("tc3"); return { ok:false, msg:"Enter " + m("@d{d}") + " as the number in front of π: a fraction with denominator 1, 2, 3, 4, 6 or 12, such as 1/3 or −1/4." }; }
      if (v < -1 - 1e-9 || v > 1 + 1e-9) { uncount("tc3"); return { ok:false, msg:F3.range }; }
      var from = cur(); S.form = "F"; S.ki = S.tc3k; S.d = [q.n, q.d]; S.tc3done = true; O.gap = 1; api.save();
      tweenTo(from, 1200, null, null, function(){ MV.changed(); }); paint(); syncPanel(); announce();
      var P3 = exact().P;
      if (tc3ok(P3)) { matchFx(); return { ok:true }; }
      if (S.ki === 3) return { ok:false, msg:F3.k1 };
      if (S.ki === 8) return { ok:false, msg:F3.k4 };
      if (S.ki === 6) { if (qEq(q, Q(1, 3))) return { ok:false, msg:F3.dpi3 }; if (qEq(q, Q(1, 6))) return { ok:false, msg:F3.dpi6 }; if (qEq(q, Q(7, 12))) return { ok:false, msg:F3.d7 }; }
      return { ok:false, msg:F3.other };
    }
    return { ok:false };
  }
  // ----- predictions -----
  function setStart(st){
    if (O.cancel) { O.cancel(); O.cancel = null; }
    S.ch = null; O.W = null; O.glow = null; O.gap = 1; O.thick = false; O.note = ""; O.ghostGap = false; O.boxA = null;
    S.form = st.form; S.f = st.f; S.a = st.a; S.ki = kIdx(Q(st.k)); S.c = st.c;
    if (st.d) S.d = st.d.slice(); if (st.b) S.b = st.b.slice();
    O.ghost = st.ghost ? flo(exact().P) : null;
    api.save(); paint(); MV.changed();
  }
  paint();
  return {
    predict:{
      start:function(p){ setStart(p.start); },
      run:function(p, done){
        O.busy = true; paint();
        var fin = function(){ O.busy = false; O.glow = null; api.save(); paint(); MV.changed(); announce(); MV.wait(250, done); };
        var from = cur();
        if (p.id === "p1") {
          var ks = [1, 1.5, 2, 3], path = function(t){ var s = Math.min(2, Math.floor(t * 3)), u = t * 3 - s; var kk = lerp(ks[s], ks[s + 1], u); var ix = kk >= 3 ? 7 : kk >= 2 ? 6 : kk >= 1.5 ? 5 : 3; if (slK.get() !== ix) slK.set(ix); return kk; };
          S.ki = 7; readout(); caption(); tweenTo(from, 1500, { x:0, col:"--p-d" }, path, fin);
        } else if (p.id === "p2") {
          S.d = [2, 3]; O.ghostGap = true; readout(); caption(); tweenTo(from, 1200, null, null, fin);
        } else if (p.id === "p3") {
          S.ki = 6; readout(); caption();
          tweenTo(from, 1500, { x:0, col:"--hi" }, null, function(){
            O.glow = null; paint();
            MV.wait(900, function(){
              MV.banner("", "Now in Factored form: the same change of k, with the start x = d held still.");
              S.form = "F"; S.ki = 3; S.d = [1, 2]; O.note = "Now in Factored form."; captionSwap(); paint();
              MV.wait(700, function(){ var f2 = cur(); S.ki = 6; readout(); caption(); tweenTo(f2, 1500, { x:PI / 2, col:"--p-d" }, null, fin); });
            });
          });
        } else if (p.id === "p4") {
          S.a = -2; readout(); caption(); tweenTo(from, 800, { axis:true }, null, fin);
        } else fin();
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: period and phase detective ----------
function part3(host, api){
  var S = api.S, C = api.content, CS = C.cases, M = C.msg;
  def(S, { cur:CS[0].id, cs:{} });
  var O = { held:null, focus:false, reveal:1, anim:false };
  function st(id){ return S.cs[id] || (S.cs[id] = { s:"", e:"", chk:null, t1:0, ok1:false, f1:false, su:null, eu:null, fb1:"", pts:[], draws:0, drawn:false, solved:false, first:null, hint:0, cur:[0, 0], marks:null, fb:null }); }
  function model(c){
    var k = qA(c.k), b = qA(c.b), d = qDiv(qNeg(b), k), P = qDiv(Q(2), k);
    return { c:c, f:c.f, a:c.a, cc:c.c, A:Math.abs(c.a), k:k, b:b, d:d, P:P, q:qDiv(P, Q(4)), e8:qDiv(P, Q(8)),
      win:{ xmin:qV(qA(c.view.x0)) * PI, xmax:qV(qA(c.view.x1)) * PI, ymin:c.view.y0, ymax:c.view.y1 } };
  }
  var MD = {}; CS.forEach(function(c){ var md = model(c), w = md.win, px = (w.xmax - w.xmin) * 0.04; md.view = { xmin:w.xmin - px, xmax:w.xmax + px, ymin:w.ymin - 0.35, ymax:w.ymax + 0.35 }; MD[c.id] = md; });
  function CUR(){ return MD[S.cur] || MD[CS[0].id]; }
  host.innerHTML = '<div class="dt"><div id="dt-pick"></div><div class="dt-card"><p class="dt-eq" id="dt-eq"></p></div>' +
    '<div class="dt-gw"><div class="plot-wrap"><canvas class="plot" id="dt-plot" tabindex="0" role="img" aria-label="Case graph"></canvas></div>' +
    '<canvas class="wt-ruler" id="dt-rul" role="img" aria-label="Inside ruler"></canvas><p class="wt-rcap" id="dt-rcap"></p><p class="vh" id="dt-say" aria-live="polite"></p></div>' +
    '<div class="dt-stage" id="dt-s1"><h3>Stage 1: Where does one cycle start and end?</h3><div class="dt-boxes">' +
      '<div class="dt-box"><label for="dt-s">Start <span class="tiny muted">(where the inside is 0)</span></label><span class="nm-row"><input class="numin short" id="dt-s" type="text" inputmode="text" autocomplete="off"><span class="m">π</span></span><div class="dt-under" id="dt-su" aria-live="polite"></div></div>' +
      '<div class="dt-box"><label for="dt-e">End <span class="tiny muted">(where the inside is 2π)</span></label><span class="nm-row"><input class="numin short" id="dt-e" type="text" inputmode="text" autocomplete="off"><span class="m">π</span></span><div class="dt-under" id="dt-eu" aria-live="polite"></div></div></div>' +
      '<p class="tiny muted">Type the number in front of π, for example 1/6 for π/6 or −1/4 for −π/4.</p>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="dt-check" data-k="dtchk">Check</button><span id="dt-hb"></span></div><div id="dt-hints"></div><div id="dt-s1fb" aria-live="polite"></div></div>' +
    '<div class="dt-stage" id="dt-s2"><h3>Stage 2: Place the five key points</h3><div id="dt-s2in"><p class="how">Tap the grid to place point 1, then 2, and so on (points are numbered from left to right). Tap a placed point to pick it up, then tap where it goes. Keyboard: Tab to the graph, move the cursor with the arrow keys, press Enter to place or lift a point and Delete to remove one.</p>' +
      '<p class="tiny" id="dt-count" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn primary sm" id="dt-draw" data-k="dtdraw">Draw it</button><button type="button" class="btn ghost sm" id="dt-clear" data-k="dtclr">Clear points</button></div><div id="dt-fb" aria-live="polite"></div></div><p class="tiny muted" id="dt-s2wait">Finish stage 1 first: the grid snaps to the cycle you find there.</p></div>' +
    '<details class="alg" id="dt-alg"><summary>Check it with algebra</summary><div class="alg-lines" id="dt-algl"></div></details></div>';
  var cv = $("#dt-plot", host), plot = new MV.Plot(cv, CUR().view), rul = new MV.Plot($("#dt-rul", host), CUR().view);
  var pick = radios($("#dt-pick", host), { label:"", aria:"Choose a case", options:CS.map(function(c){ return { id:c.id, t:c.name }; }), value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; O.held = null; api.save(); paint(true); } });
  function colX(c, j){ return qAdd(c.d, qMul(Q(j), c.e8)); }
  function insideAt(c, xq){ return qAdd(qMul(c.k, xq), c.b); }
  function sorted(x){ return x.pts.slice().sort(function(p, q){ return p[0] - q[0]; }); }
  plot.render = function(){
    var c = CUR(), x = st(c.c.id), V = c.view, ph = plot.c.getBoundingClientRect().width < 500;
    plot.draw({ view:V, xTicks:piTicks(ph ? 1 : 0.5, 0.25), yTicks:{ step:1 }, describe:describeGraph(c, x), after:function(ctx, p){
      var ink = css("--ink"), ink2 = css("--ink-2");
      if (x.ok1) for (var j = 0; j <= 8; j++) vLine(ctx, p, qV(colX(c, j)) * PI, ink2, j % 2 ? 1 : 1.4, j % 2 ? [1, 5] : [2, 4], j % 2 ? 0.55 : 1);
      else if (x.chk) { [x.chk.s, x.chk.e].forEach(function(v, i){ vLine(ctx, p, v * PI, ink2, 1.5, [6, 5]); drawToks(ctx, p, [{ t:i ? "your end" : "your start", c:ink2 }], p.X(v * PI) + 4, 14, { size:12 }); }); }
      if (x.drawn) { var W = { f:c.f, a:c.a, k:qV(c.k), d:qV(c.d) * PI, c:c.cc }; curveOn(p, waveF(W), { color:css("--pen"), width:3, domain:[V.xmin - 1, V.xmin + (V.xmax - V.xmin) * O.reveal] }); }
      var sp = sorted(x), showMarks = x.marks && !O.anim;
      sp.forEach(function(pt, r){
        var X = qV(colX(c, pt[0])) * PI, Y = pt[1], held = O.held != null && x.pts[O.held] && x.pts[O.held][0] === pt[0];
        p.point({ x:X, y:Y, r:6, color:ink, ring:held });
        ctx.save(); ctx.font = "700 12px " + p.fontUI; ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(r + 1), p.X(X) - 11, p.Y(Y) - 12); ctx.restore();
        if (showMarks) { var ok = x.marks[r]; ctx.save(); ctx.font = "700 16px " + p.fontUI; ctx.fillStyle = css(ok ? "--green" : "--red"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(ok ? "✓" : "✗", p.X(X) + 9, p.Y(Y) - 12); ctx.restore(); }
      });
      if (O.focus && x.ok1 && !x.solved) { var cx = qV(colX(c, x.cur[0])) * PI; ctx.save(); ctx.strokeStyle = css("--pen"); ctx.lineWidth = 2.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(p.X(cx), p.Y(x.cur[1]), 11, 0, TAU); ctx.stroke(); ctx.restore(); }
    } });
  };
  rul.render = function(){
    var c = CUR(), x = st(c.c.id), V = c.view, ins = MV.plain(c.c.inside);
    if (!x.chk) drawRuler(rul, { view:V, empty:"Check your start and end to draw the inside ruler.", desc:"Inside ruler: not drawn yet. Check your start and end first." });
    else drawRuler(rul, { view:V, x0:x.chk.s * PI, x1:x.chk.e * PI, solid:x.ok1, desc:"Your inside ruler for " + ins + ": 0 at x = " + fmtX(x.chk.s, true) + " and 2π at x = " + fmtX(x.chk.e, true) + (x.ok1 ? ". Both are right." : ".") });
    $("#dt-rcap", host).innerHTML = "inside: " + c.c.inside + (x.chk ? ' <span class="muted">· ' + (x.ok1 ? "ruler from your start and end (both right)" : "dashed ruler drawn from your start and end") + "</span>" : "");
  };
  function fmtX(v, plain){ var q = qOf(v); var s = q ? piSrc(q) : num(v, 3) + "π"; return plain ? s.replace(/-/g, MINUS) : s; }
  function describeGraph(c, x){
    var s = "Graph for " + MV.plain(c.c.eq) + ", window x from " + piT(qOf(c.win.xmin / PI)) + " to " + piT(qOf(c.win.xmax / PI)) + ", y from " + num(c.win.ymin) + " to " + num(c.win.ymax) + ".";
    if (x.ok1) s += " Dotted lines mark the nine snap columns from " + piT(c.d) + " to " + piT(qAdd(c.d, c.P)) + ".";
    var sp = sorted(x);
    if (sp.length) s += " Your points: " + sp.map(function(pt, r){ return (r + 1) + " at (" + piT(colX(c, pt[0])) + ", " + num(pt[1]) + ")" + (x.marks && !O.anim ? (x.marks[r] ? " right" : " wrong") : ""); }).join("; ") + ".";
    if (x.drawn) s += " The true curve is drawn.";
    return s;
  }
  function under(c, v, ok, isStart){
    var q = qOf(v), xs = m("x = " + fmtX(v)), ins = c.c.inside;
    if (ok) return { good:true, html:fill(isStart ? M.startOk : M.endOk, { x:xs, inside:ins }) };
    var w = (isStart ? c.c.wrongStart : c.c.wrongEnd).filter(function(w){ return near(v, w.v[0] / w.v[1]); })[0];
    if (w) return { good:false, html:w.fb };
    var th = q ? m(piSrc(insideAt(c, q))) : m("≈ " + num(qV(c.k) * v + qV(c.b), 2) + "π");
    return { good:false, html:fill(isStart ? M.startGen : M.endGen, { x:xs, inside:ins, th:th }) };
  }
  function check1(){
    var c = CUR(), x = st(c.c.id), sv = parsePi(x.s), ev = parsePi(x.e);
    if (!isFinite(sv) || !isFinite(ev)) { x.fb1 = "Enter both values as the number in front of π, such as 1/6 or −1/4."; paint(); return; }
    x.fb1 = ""; x.t1++; x.chk = { s:sv, e:ev };
    var sOk = near(sv, qV(c.d)), eOk = near(ev, qV(qAdd(c.d, c.P)));
    x.su = under(c, sv, sOk, true); x.eu = under(c, ev, eOk, false);
    if (sOk && eOk) { x.ok1 = true; x.f1 = x.t1 === 1; x.cur = [0, Math.round((c.win.ymin + c.win.ymax) / 2)]; }
    api.save(); paint(); MV.focusFb($("#dt-s1", host));
  }
  function say(t){ $("#dt-say", host).textContent = t; }
  function act(col, row){
    var c = CUR(), x = st(c.c.id); if (!x.ok1 || x.solved) return;
    var at = -1; x.pts.forEach(function(p, i){ if (p[0] === col) at = i; });
    var msg = "";
    if (O.held != null) {
      if (at >= 0 && at !== O.held) msg = "There’s already a point in that column. Pick that one up first, or choose another column.";
      else { x.pts[O.held] = [col, row]; O.held = null; msg = "Point placed."; }
    } else if (at >= 0) {
      if (x.pts[at][1] === row) { O.held = at; msg = "Point picked up. Tap (or press Enter at) the place it should go."; }
      else { x.pts[at] = [col, row]; msg = "Point moved."; }
    } else if (x.pts.length < 5) { x.pts.push([col, row]); msg = "Point placed."; }
    else msg = "All five points are placed. Tap one to pick it up and move it.";
    x.marks = null; x.fb = null; x.cur = [col, row];
    api.save(); paint(); say(msg + " " + countText(x));
  }
  function countText(x){ return x.pts.length + " of 5 points placed."; }
  function snap(e){
    var c = CUR(), r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    var X = plot.xOf(px), Y = plot.yOf(py), e8 = qV(c.e8) * PI;
    return [clamp(Math.round((X - qV(c.d) * PI) / e8), 0, 8), clamp(Math.round(Y), c.win.ymin, c.win.ymax)];
  }
  cv.addEventListener("click", function(e){ var c = CUR(), x = st(c.c.id); if (!x.ok1 || x.solved || O.anim) return; var s = snap(e); act(s[0], s[1]); });
  cv.addEventListener("focus", function(){ O.focus = true; plot.render(); });
  cv.addEventListener("blur", function(){ O.focus = false; plot.render(); });
  cv.addEventListener("keydown", function(e){
    var c = CUR(), x = st(c.c.id); if (!x.ok1 || x.solved || O.anim) return;
    var cr = x.cur, k = e.key;
    if (k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown") {
      e.preventDefault();
      if (k === "ArrowLeft") cr[0] = Math.max(0, cr[0] - 1); else if (k === "ArrowRight") cr[0] = Math.min(8, cr[0] + 1);
      else if (k === "ArrowUp") cr[1] = Math.min(c.win.ymax, cr[1] + 1); else cr[1] = Math.max(c.win.ymin, cr[1] - 1);
      plot.render(); say("Cursor at x = " + piT(colX(c, cr[0])) + ", y = " + num(cr[1]) + ".");
    } else if (k === "Enter" || k === " ") { e.preventDefault(); act(cr[0], cr[1]); }
    else if (k === "Delete" || k === "Backspace") {
      e.preventDefault(); var i = O.held != null ? O.held : -1;
      if (i < 0) x.pts.forEach(function(p, j){ if (p[0] === cr[0]) i = j; });
      if (i >= 0) { x.pts.splice(i, 1); O.held = null; x.marks = null; x.fb = null; api.save(); paint(); say("Point removed. " + countText(x)); }
    } else if (k === "Escape" && O.held != null) { O.held = null; plot.render(); say("Point put back."); }
  });
  function patHeights(key, c){ var f = key.slice(0, 3), s = key[3] === "-" ? -c.A : c.A; return PAT[f].map(function(v){ return v * s + c.cc; }); }
  function patName(K, T){
    var sameF = K.slice(0, 3) === T.slice(0, 3), neg = K[3] === "-";
    if (sameF) return neg ? "upside-down pattern" : "pattern for " + m("a > 0");
    return (neg ? "upside-down " : "") + (K.slice(0, 3) === "sin" ? "sine" : "cosine") + " pattern";
  }
  function calcSrc(a, v, cc){ return m(dec(a) + " × " + (v < 0 ? "(" + dec(v) + ")" : dec(v)) + (cc < 0 ? " - " + dec(-cc) : " + " + dec(cc))); }
  function pointFb(c, sp, marks){
    var T = pkey(c.f, c.a), sum = '<p class="tiny">' + sp.map(function(p, r){ return "Point " + (r + 1) + " " + (marks[r] ? "✓" : "✗"); }).join(" · ") + "</p>";
    if (sp.every(function(p, r){ return p[0] === 2 * r; })) {
      var hs = sp.map(function(p){ return p[1]; }), keys = ["sin+", "sin-", "cos+", "cos-"];
      for (var i = 0; i < keys.length; i++) {
        var K = keys[i]; if (K === T) continue;
        var ph = patHeights(K, c); if (ph.every(function(v, j){ return v === hs[j]; }) && ph.some(function(v, j){ return v !== patHeights(T, c)[j]; })) return sum + "<p>" + (c.c.mix[K] || fill(M.mix, { name:patName(K, T), F:c.f === "sin" ? "Sine" : "Cosine", sign:m("a " + (c.a > 0 ? ">" : "<") + " 0"), words:PATW[T] })) + "</p>";
      }
    }
    var r = marks.indexOf(false), p = sp[r], xr = colX(c, 2 * r);
    if (p[0] !== 2 * r) return sum + "<p>" + fill(M.col, { n:r + 1, xv:m("x"), start:m(piSrc(c.d)), q:m(piSrc(c.q)), v:m(piSrc(xr)) }) + "</p>";
    var th = Q(r, 2), fv = PAT[c.f][r];
    return sum + "<p>" + fill(M.height, { xv:m("x = " + piSrc(xr)), th:m(piSrc(th)), fth:m(c.f + "(" + piSrc(th) + ")"), fv:num(fv), calc:calcSrc(c.a, fv, c.cc), h:num(c.a * fv + c.cc) }) + "</p>";
  }
  function drawIt(){
    var c = CUR(), x = st(c.c.id); if (x.pts.length < 5 || !x.ok1 || x.solved) return;
    x.draws++; O.held = null;
    var sp = sorted(x), marks = sp.map(function(p, r){ return p[0] === 2 * r && p[1] === c.a * PAT[c.f][r] + c.cc; });
    x.marks = marks; x.drawn = true;
    if (marks.every(Boolean)) { x.solved = true; x.first = !!x.f1 && x.draws === 1 && x.hint < 3; x.fb = { good:true, html:"<p><strong>✓ Case solved.</strong> All five key points sit on the true curve." + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p>" }; }
    else x.fb = { good:false, html:pointFb(c, sp, marks) };
    api.save();
    if (MV.reduceMotion) { O.reveal = 1; paint(); MV.focusFb($("#dt-s2", host)); return; }
    O.anim = true; O.reveal = 0; paint();
    MV.tween({ dur:1500, ease:LIN, step:function(t){ O.reveal = t; plot.render(); }, done:function(){ O.anim = false; O.reveal = 1; paint(); MV.focusFb($("#dt-s2", host)); } });
  }
  host.addEventListener("input", function(e){ var c = CUR(), x = st(c.c.id); if (e.target.id === "dt-s") { x.s = e.target.value; api.save(); } else if (e.target.id === "dt-e") { x.e = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && (e.target.id === "dt-s" || e.target.id === "dt-e")) { e.preventDefault(); if (!st(S.cur).ok1) check1(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var c = CUR(), x = st(c.c.id);
    if (b.id === "dt-check") check1();
    else if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); }
    else if (b.id === "dt-draw") drawIt();
    else if (b.id === "dt-clear") { x.pts = []; O.held = null; x.marks = null; x.fb = null; api.save(); paint(); say("All points cleared."); }
  });
  function paint(load){
    var c = CUR(), x = st(c.c.id), cc = c.c;
    pick.relabel(CS.map(function(k){ var y = S.cs[k.id]; return { id:k.id, t:(y && y.solved ? "✓ " : "") + k.name }; }));
    pick.set(S.cur);
    $("#dt-eq", host).innerHTML = "<strong>" + cc.name + ".</strong> " + cc.eq;
    var si = $("#dt-s", host), ei = $("#dt-e", host);
    if (load || document.activeElement !== si) si.value = x.s; if (load || document.activeElement !== ei) ei.value = x.e;
    si.disabled = ei.disabled = x.ok1;
    var u = function(r){ return r ? '<p class="' + (r.good ? "dt-ok" : "dt-no") + '">' + r.html + "</p>" : ""; };
    $("#dt-su", host).innerHTML = x.chk ? u(x.su) : ""; $("#dt-eu", host).innerHTML = x.chk ? u(x.eu) : "";
    $("#dt-check", host).disabled = x.ok1;
    MV.keepFocus($("#dt-hb", host), function(){ $("#dt-hb", host).innerHTML = x.solved ? "" : MV.hintBtn("dth" + cc.id, x.hint); });
    $("#dt-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(cc.hints, x.hint);
    var ps = c.d.n > 0 ? "to the right" : c.d.n < 0 ? "to the left" : "";
    $("#dt-s1fb", host).innerHTML = x.fb1 ? MV.fbHTML("bad", x.fb1) : x.ok1 ? '<div class="fb good" role="status"><p><strong>✓ Cycle found.</strong></p><p>Period = end − start = ' + m(piSrc(c.P)) + "</p><p>Phase shift = " + m(piSrc(Q(Math.abs(c.d.n), c.d.d))) + " " + ps + "</p></div>" : (x.chk ? '<div class="fb bad" role="status"><p><strong>✗ Not yet.</strong> Read the notes under each box, then try again.</p></div>' : "");
    $("#dt-s2in", host).hidden = !x.ok1; $("#dt-s2wait", host).hidden = x.ok1;
    $("#dt-count", host).textContent = x.solved ? "" : countText(x) + (O.held != null ? " One point is picked up." : "");
    $("#dt-draw", host).disabled = x.pts.length < 5 || x.solved || O.anim; $("#dt-clear", host).disabled = !x.pts.length || x.solved || O.anim;
    $("#dt-fb", host).innerHTML = x.fb && !O.anim ? '<div class="fb ' + (x.fb.good ? "good" : "bad") + '" role="status">' + (x.fb.good ? "" : "<p><strong>✗ Not yet.</strong></p>") + x.fb.html + "</div>" : "";
    var algD = $("#dt-alg", host); if (load) algD.open = false;
    $("#dt-algl", host).innerHTML = cc.alg.map(function(l){ return "<span>" + l + "</span>"; }).join("");
    plot.render(); rul.render();
  }
  MV.ACTS.detective = { a:{ id:"detective" },
    stats:function(){ var f = 0, d = 0; CS.forEach(function(c){ var x = S.cs[c.id]; if (x && x.solved) d++; if (x && x.first) f++; }); return { first:f, total:CS.length, done:d, line:"Detective cases (first try): " + f + "/" + CS.length + (d < CS.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; CS.forEach(function(c){ var x = S.cs[c.id]; if (x && (x.t1 > 1 || x.draws > 1 || x.hint >= 3)) g = g.concat(MV.goalIdx(c.goal)); }); return g; } };
  paint(true);
  return {};
}

// ---------- Practice 1: match the equation to its graph ----------
// @component N6 graphMatch (adapted from MHF4U 19) — equation chips beside a grid of sinusoid thumbnails, mistake feedback built
// from the first feature that differs (axis, amplitude, period, start and pattern), with trap-pair sentences from content
var GV = { xmin:-PI / 2 - 0.3, xmax:3 * PI / 2 + 0.3, ymin:-3.5, ymax:3.5 };
function itemP(L){ return { f:L.p.f, a:L.p.a, k:Q(L.p.k), d:qA(L.p.d), c:L.p.c }; }
function matchAct(host, api, a){
  var S = api.S; def(S, { done:{}, tries:{}, hints:{} });
  var K = MV.ans(a), M = a.msg, sel = null, msg = null, byG = {}, order = MV.shuffle(a.graphs.slice(), MV.meta.id + a.id), num1 = {};
  a.items.forEach(function(L){ byG[K[L.id]] = L; });
  order.forEach(function(g, i){ num1[g] = i + 1; });
  function gdesc(L){
    var P = itemP(L), A = Math.abs(P.a), Pq = qDiv(Q(2), P.k), key = pkey(P.f, P.a);
    var move = { "sin+":"rises through its axis", "sin-":"falls through its axis", "cos+":"starts a cycle at its maximum", "cos-":"starts a cycle at its minimum" }[key];
    return fill(M.desc, { lo:num(P.c - A), hi:num(P.c + A), ax:"y = " + num(P.c), P:piT(Pq), move:move, d:piT(P.d), pk:piT(qAdd(P.d, qMul(qOf(PEAK[key]), Pq))) });
  }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="gm-wrap"><div class="gm-eqs" role="group" aria-label="Equations">' +
    a.items.map(function(L){ return '<button type="button" class="mitem gm-eq" data-l="' + L.id + '" data-k="gm' + L.id + '" aria-pressed="false"><span>' + L.eq + '</span><span class="gm-to"></span></button>'; }).join("") +
    '</div><div><div class="gm-sel" id="gm-sel-' + a.id + '"></div><div id="gm-msg-' + a.id + '"></div><p class="sort-done" id="gm-done-' + a.id + '" hidden></p><div class="gm-grid" role="group" aria-label="Graphs">' +
    order.map(function(g){ return '<button type="button" class="gm-th" data-g="' + g + '" data-k="gm' + g + '"><span class="gm-tag">Graph ' + num1[g] + '</span><canvas class="plot gm-c" role="img" aria-label="Graph ' + num1[g] + ": " + MV.esc(MV.plain(gdesc(byG[g]))) + '"></canvas><span class="gm-eqd"></span></button>'; }).join("") + "</div></div></div>";
  order.forEach(function(g){
    var cvs = host.querySelector('[data-g="' + g + '"] canvas'), pl = new MV.Plot(cvs, GV), W = flo(itemP(byG[g]));
    pl.render = function(){ pl.draw({ view:GV, xTicks:piTicks(0.5, 1 / 6), yTicks:{ step:1 }, describe:"Graph " + num1[g] + ": " + MV.plain(gdesc(byG[g])), after:function(ctx, p){ curveOn(p, waveF(W), { color:css("--pen"), width:2.6 }); } }); };
    pl.render();
  });
  function feedback(L, G){
    var pair = a.wrong[L.id + "|" + G.id];
    if (pair) return pair;
    var P = itemP(L), R = itemP(G), A = Math.abs(P.a), A2 = Math.abs(R.a);
    if (P.c !== R.c) return fill(M.axis, { ax2:m("y = " + dec(R.c)), eq:L.eqR, cEq:m("c = " + dec(P.c)) });
    if (A !== A2) return fill(M.amp, { A2:num(A2), eq:L.eqR, A:num(A) });
    if (!qEq(P.k, R.k)) { var Pq = qDiv(Q(2), P.k); return fill(M.period, { P2:m(piSrc(qDiv(Q(2), R.k))), eq:L.eqR, kEq:m("k = " + ratSrc(P.k)), Pcalc:m("2π/" + ratSrc(P.k) + " = " + piSrc(Pq)) }); }
    var key = pkey(P.f, P.a);
    return fill(M.start, { fact:L.fact, xd:m("x = " + piSrc(P.d)), how:{ "sin+":M.up, "sin-":M.down, "cos+":M.max, "cos-":M.min }[key] });
  }
  function stats(){ var f = 0, d = 0, miss = []; a.items.forEach(function(L){ var bad = (S.tries[L.id] || 0) > 0 || (S.hints[L.id] || 0) >= 3; if (S.done[L.id]) { d++; if (!bad) f++; } if (bad) miss.push(L); }); return { first:f, done:d, total:a.items.length, miss:miss }; }
  function paint(){
    var doneG = {};
    a.items.forEach(function(L){ if (S.done[L.id]) doneG[K[L.id]] = L; });
    $$(".gm-eq", host).forEach(function(b){ var id = b.dataset.l, d = !!S.done[id]; b.classList.toggle("done", d); b.disabled = d; b.setAttribute("aria-pressed", String(sel === id)); b.querySelector(".gm-to").textContent = d ? "→ Graph " + num1[K[id]] : ""; });
    $$(".gm-th", host).forEach(function(b){ var L = doneG[b.dataset.g]; b.classList.toggle("done", !!L); b.classList.toggle("ready", !!sel && !L); b.disabled = !!L; b.querySelector(".gm-eqd").innerHTML = L ? '<span class="pair-n">✓</span> ' + L.eq : ""; });
    var L = sel ? a.items.filter(function(x){ return x.id === sel; })[0] : null, lv = L ? (S.hints[sel] || 0) : 0, sb = $("#gm-sel-" + a.id, host);
    sb.classList.toggle("on", !!L);
    var hd = document.querySelector("header.top"); sb.style.top = L && hd ? Math.max(0, Math.round(hd.getBoundingClientRect().bottom)) + "px" : "";
    MV.keepFocus(sb, function(){ sb.innerHTML = L ? '<div class="sel-bar"><span>Selected: ' + L.eq + "</span>" + MV.hintBtn("gmh" + a.id, lv) + "</div>" + MV.hintsHTML(L.hints, lv) : ""; });
    $("#gm-msg-" + a.id, host).innerHTML = msg ? '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>" : "";
    var s = stats(), dn = $("#gm-done-" + a.id, host); dn.hidden = s.done < s.total; dn.textContent = "All matched! You got " + s.first + " of " + s.total + " right on the first try, without the worked solution.";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.l) { sel = sel === b.dataset.l ? null : b.dataset.l; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { S.hints[sel] = Math.min(3, (S.hints[sel] || 0) + 1); api.save(); paint(); return; }
    if (b.dataset.g) {
      if (!sel) { msg = { type:"", html:"Tap an equation first, then tap the graph it makes." }; paint(); return; }
      var L = a.items.filter(function(x){ return x.id === sel; })[0], G = byG[b.dataset.g];
      if (K[sel] === b.dataset.g) { S.done[sel] = true; msg = { type:"good", html:"<strong>✓ Matched.</strong> " + L.eq + " → Graph " + num1[b.dataset.g] + ". " + L.why }; sel = null; }
      else { S.tries[sel] = (S.tries[sel] || 0) + 1; msg = { type:"bad", html:"<strong>✗ Not a match.</strong> " + feedback(L, G) + " " + M.tail }; }
      api.save(); paint(); MV.focusFb($("#gm-msg-" + a.id, host));
    }
  });
  paint();
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:a.summary + " (first try): " + s.first + "/" + s.total + (s.done < s.total ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; stats().miss.forEach(function(L){ g = g.concat(MV.goalIdx(a.goal)); }); return g; }
  };
}

// ---------- Practice 3: multi-step and work backwards ----------
// @component N4 waveBoxes — one frame per item holding π-boxes (number in front of π), number and fraction boxes, a fraction
// box with a "× π" chip and Left/Right chips; named wrong values per item or per box; a preview graph after every check
function pvScene(id, v){
  var sin = Math.sin, cos = Math.cos;
  if (id === "n1") { var f1 = function(x){ return 3 * sin(2 * x - PI / 2) + 1; }, x1 = v[0] * PI; return { view:{ xmin:-PI / 4, xmax:Math.max(3 * PI / 2, x1 + PI / 4), ymin:-3, ymax:5 }, pi:true, curves:[f1], vl:[x1], pts:[[x1, f1(x1)]], cap:"Your " + m("x = " + fmtPi(v[0])) + ": the wave is at " + m("y = " + num(f1(x1), 2)) + ". Its highest value is 4." }; }
  if (id === "n2") return { view:{ xmin:-PI / 6, xmax:2 * PI + PI / 6, ymin:-1.6, ymax:1.6 }, pi:true, curves:[function(x){ return cos(3 * x); }], band:[0, TAU], cap:"The shaded strip is " + m("0 ≤ x ≤ 2π") + ". You counted " + num(v[0]) + " maximums." };
  if (id === "n3") { var k3 = v[0]; if (!(k3 > 0)) return null; var P3 = TAU / k3, xr = clamp(Math.max(5, P3 * 1.15), 5, 40); return { view:{ xmin:0, xmax:xr, ymin:-1.6, ymax:1.6 }, pi:false, curves:[function(x){ return sin(k3 * x); }], vl:[4, P3], cap:"Your " + m("k ≈ " + num(k3, 3)) + " gives a period of about " + num(P3, 2) + ". The first dashed line is at 4." }; }
  if (id === "n4") { var k4 = v[0]; if (!(k4 > 0)) return null; return { view:{ xmin:0, xmax:4 * PI / 3, ymin:-1.6, ymax:1.6 }, pi:true, curves:[function(x){ return sin(k4 * (x - PI / 6)); }], band:[PI / 6, 7 * PI / 6], cap:"With your " + m("k ≈ " + num(k4, 3)) + ", the strip from π/6 to 7π/6 holds " + num(k4 / 2, 2) + " cycles." }; }
  if (id === "n5") { var k5 = v[0], d5 = v[1] * PI; return { view:{ xmin:-PI / 2, xmax:3 * PI / 2, ymin:-2.6, ymax:2.6 }, pi:true, target:function(x){ return 2 * cos(PI / 3 - 2 * x); }, curves:[function(x){ return 2 * cos(k5 * (x - d5)); }], cap:"Dashed: " + m("y = 2 cos(π/3 - 2x)") + ". Solid: your " + m("y = 2 cos[k(x - d)]") + ". Shading shows any gap." }; }
  if (id === "n6") { var a6 = v[0], c6 = v[1], lo = Math.min(-1, c6 - Math.abs(a6) - 1), hi = Math.max(8, c6 + Math.abs(a6) + 1); return { view:{ xmin:-PI / 2, xmax:5 * PI / 2, ymin:lo, ymax:hi }, pi:true, curves:[function(x){ return a6 * sin(x) + c6; }], hl:[7], ring:[[0, 3]], cap:"Your wave with the line " + m("y = 7") + " (dashed) and the point (0, 3) (ring)." }; }
  if (id === "n7") { var s7 = (v[1] === "R" ? 1 : -1) * v[0] * PI; return { view:{ xmin:-PI / 2, xmax:3 * PI / 2, ymin:-1.6, ymax:1.6 }, pi:true, target:function(x){ return sin(3 * x + PI / 4); }, ghost:function(x){ return sin(3 * x - PI / 2); }, curves:[function(x){ return sin(3 * (x - s7) - PI / 2); }], cap:"Dashed: the target " + m("y = sin(3x + π/4)") + ". Solid: " + m("y = sin(3x - π/2)") + " moved by your translation." }; }
  if (id === "n8") { var k8 = v[0], f8 = function(x){ return sin(k8 * x - PI / 2); }; return { view:{ xmin:-PI / 6, xmax:PI, ymin:-1.6, ymax:1.6 }, pi:true, curves:[f8], vl:[PI / 3], pts:[[PI / 3, f8(PI / 3)]], cap:"With your " + m("k = " + num(k8, 3)) + ", the wave is at " + m("y = " + num(f8(PI / 3), 2)) + " when " + m("x = π/3") + "." }; }
  return null;
}
function fmtPi(v){ var q = qOf(v); return q ? piSrc(q) : num(v, 3) + "π"; }
function drawPv(p, sc){
  var ph = p.c.getBoundingClientRect().width < 420;
  p.draw({ view:sc.view, xTicks:sc.pi ? piTicks(ph ? 1 : 0.5, sc.view.xmax - sc.view.xmin > 3 * PI ? 0.5 : 1 / 6) : { step:sc.view.xmax > 20 ? 5 : 1 }, describe:MV.plain(sc.cap), after:function(ctx){
    var ink2 = css("--ink-2"), pen = css("--pen");
    if (sc.band) { ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(p.X(sc.band[0]), 0, p.X(sc.band[1]) - p.X(sc.band[0]), p.H); ctx.restore(); }
    if (sc.target) shade(p, sc.curves[0], sc.target, 1);
    (sc.hl || []).forEach(function(y){ hLine(ctx, p, y, ink2, 1.5, [6, 5]); });
    (sc.vl || []).forEach(function(x){ vLine(ctx, p, x, ink2, 1.5, [6, 5]); });
    if (sc.ghost) curveOn(p, sc.ghost, { color:ink2, width:1.8, dash:[3, 5], alpha:0.8 });
    if (sc.target) curveOn(p, sc.target, { color:ink2, width:2.4, dash:[12, 7] });
    sc.curves.forEach(function(f){ curveOn(p, f, { color:pen, width:2.8 }); });
    (sc.pts || []).forEach(function(q){ p.point({ x:q[0], y:q[1], r:5, color:css("--ink") }); });
    (sc.ring || []).forEach(function(q){ p.point({ x:q[0], y:q[1], r:7, open:true, color:css("--ink") }); });
  } });
}
function multiAct(host, api, a){
  var S = api.S; def(S, { items:{} });
  function ist(id){ return S.items[id] || (S.items[id] = { vals:[], pi:{}, tries:0, hint:0, solved:false, first:null, pv:null, msg:"" }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    var x = ist(it.id);
    return '<div class="q mp-q" data-ni="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + '</div></div><div class="mp-row">' +
      it.boxes.map(function(b, bi){
        var id = "mp-" + it.id + "-" + bi;
        if (b.kind === "dir") return '<span class="mp-box"><span class="mp-lab">' + b.pre + '</span><span class="rg chips" role="radiogroup" aria-label="Direction" data-dir="' + bi + '">' + [["L", "Left"], ["R", "Right"]].map(function(o){ return '<button type="button" role="radio" aria-checked="' + (x.vals[bi] === o[0]) + '" data-dv="' + o[0] + '" data-k="' + id + o[0] + '">' + o[1] + "</button>"; }).join("") + "</span></span>";
        return '<span class="mp-box"><label for="' + id + '">' + b.pre + '</label><input class="numin short" id="' + id + '" data-b="' + bi + '" type="text" inputmode="text" autocomplete="off" value="' + MV.esc(x.vals[bi] || "") + '">' +
          (b.kind === "pi" ? '<span class="m">π</span>' : b.kind === "fracpi" ? '<button type="button" class="chip mp-pi" data-pi="' + bi + '" data-k="' + id + 'pi" aria-pressed="' + !!x.pi[bi] + '">× π</button>' : "") + "</span>";
      }).join("") + '</div><div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button><span class="mp-hb"></span></div><div class="mp-hints"></div><div class="mp-fb" aria-live="polite"></div>' +
      '<div class="mp-pv" hidden><canvas class="plot wide" role="img" aria-label="Preview graph"></canvas><p class="tiny mp-cap"></p></div></div>';
  }).join("");
  var plots = {};
  a.items.forEach(function(it){ var box = host.querySelector('[data-ni="' + it.id + '"]'), pl = new MV.Plot(box.querySelector(".mp-pv canvas"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plots[it.id] = pl; pl.render = function(){ var x = ist(it.id), sc = x.pv ? pvScene(it.id, x.pv) : null; if (sc) drawPv(pl, sc); }; });
  function read(it){
    var x = ist(it.id);
    return it.boxes.map(function(b, bi){
      if (b.kind === "dir") return x.vals[bi] === "L" || x.vals[bi] === "R" ? x.vals[bi] : null;
      var raw = x.vals[bi];
      if (b.kind === "pi") { var v = parsePi(raw); return isFinite(v) ? v : null; }
      var w = parseOne(raw); if (!isFinite(w)) return null;
      if (b.kind === "fracpi" && x.pi[bi] && !/π|pi/i.test(String(raw))) w *= PI;
      return w;
    });
  }
  function same(u, w){ return typeof w === "string" ? u === w : typeof u === "number" && Math.abs(u - w) <= 1e-6 * Math.max(1, Math.abs(w)); }
  function paintItem(it){
    var box = host.querySelector('[data-ni="' + it.id + '"]'), x = ist(it.id);
    $$("input", box).forEach(function(inp){ inp.disabled = x.solved; });
    $$("[data-pi]", box).forEach(function(b){ b.setAttribute("aria-pressed", !!x.pi[+b.dataset.pi]); b.classList.toggle("on", !!x.pi[+b.dataset.pi]); b.disabled = x.solved; });
    $$("[data-dir]", box).forEach(function(g){ $$("[data-dv]", g).forEach(function(b){ var on = x.vals[+g.dataset.dir] === b.dataset.dv; b.setAttribute("aria-checked", on); b.tabIndex = on || (!x.vals[+g.dataset.dir] && b.dataset.dv === "L") ? 0 : -1; b.disabled = x.solved; }); });
    box.querySelector('[data-act="check"]').hidden = x.solved;
    var hb = box.querySelector(".mp-hb"); MV.keepFocus(hb, function(){ hb.innerHTML = x.solved ? "" : MV.hintBtn(it.id + "hint", x.hint); });
    box.querySelector(".mp-hints").innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    box.querySelector(".mp-fb").innerHTML = x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : x.msg ? '<div class="fb bad" role="status"><p>' + x.msg + "</p></div>" : "";
    var sc = x.pv ? pvScene(it.id, x.pv) : null, pv = box.querySelector(".mp-pv");
    pv.hidden = !sc; if (sc) { pv.querySelector(".mp-cap").innerHTML = sc.cap; plots[it.id].render(); }
  }
  function check(it){
    var x = ist(it.id), vals = read(it), A = MV.ans(it);
    if (vals.some(function(v){ return v == null; })) { x.msg = "Enter a value in every box" + (it.boxes.some(function(b){ return b.kind === "dir"; }) ? " and choose a direction" : "") + ". Fractions such as 1/2 or −3/4 are fine."; paintItem(it); MV.focusFb(host.querySelector('[data-ni="' + it.id + '"]')); return; }
    x.pv = vals;
    if (vals.every(function(v, i){ return same(v, A[i]); })) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.msg = ""; }
    else {
      x.tries++;
      var whole = (it.wrong || []).filter(function(w){ return w.box == null && w.v.every(function(u, i){ return same(vals[i], u); }); })[0], fbs = [];
      if (whole) fbs.push(whole.fb);
      else it.boxes.forEach(function(b, bi){ if (same(vals[bi], A[bi])) return; var w = (it.wrong || []).filter(function(w){ return w.box === bi && same(vals[bi], w.v); })[0]; if (w) fbs.push((it.boxes.length > 1 && b.name ? "For " + b.name + ": " : "") + w.fb); });
      x.msg = "<strong>✗ Not quite.</strong> " + (fbs.length ? fbs.join(" ") : a.fallback.replace(/^Not quite\.\s*/, ""));
    }
    api.save(); paintItem(it); MV.focusFb(host.querySelector('[data-ni="' + it.id + '"]'));
  }
  function itemOf(el){ var box = el.closest("[data-ni]"); return box ? a.items.filter(function(q){ return q.id === box.dataset.ni; })[0] : null; }
  host.addEventListener("input", function(e){ var t = e.target; if (t.dataset.b == null) return; var it = itemOf(t); ist(it.id).vals[+t.dataset.b] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){
    var t = e.target;
    if (e.key === "Enter" && t.dataset.b != null) { e.preventDefault(); var it = itemOf(t); if (!ist(it.id).solved) check(it); return; }
    var dv = t.closest && t.closest("[data-dv]");
    if (dv && /Arrow(Left|Right|Up|Down)/.test(e.key)) { e.preventDefault(); var it2 = itemOf(dv), g = dv.closest("[data-dir]"), x2 = ist(it2.id); x2.vals[+g.dataset.dir] = dv.dataset.dv === "L" ? "R" : "L"; api.save(); paintItem(it2); var nb = g.querySelector('[data-dv="' + x2.vals[+g.dataset.dir] + '"]'); if (nb) nb.focus(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = itemOf(b); if (!it) return; var x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); }
    else if (b.dataset.act === "check") check(it);
    else if (b.dataset.pi != null) { x.pi[+b.dataset.pi] = !x.pi[+b.dataset.pi]; api.save(); paintItem(it); }
    else if (b.dataset.dv) { x.vals[+b.closest("[data-dir]").dataset.dir] = b.dataset.dv; api.save(); paintItem(it); }
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Wave to order ----------
var task = (function(){
  var api, plot, T;
  var QS = [1, 2, 3, 4, 6, 12], PEAKANG = { "cos+":Q(0), "sin+":Q(1, 2), "cos-":Q(1), "sin-":Q(3, 2) };
  function halves(raw){ var v = parseOne(raw); return isFinite(v) && isInt(v * 2) && v >= -6 && v <= 6 ? v : NaN; }
  function kRead(raw){
    var s = String(raw == null ? "" : raw).trim().replace(/−/g, "-"), mt = /^(\d+)\s*(?:\/\s*(\d+))?$/.exec(s);
    if (!mt) return null; var p = +mt[1], q = mt[2] ? +mt[2] : 1;
    if (p < 1 || p > 12 || q < 1 || q > 12) return null; return Q(p, q);
  }
  function read(){
    var s = api ? api.S : {}, a = halves(s.a), c = halves(s.c), k = kRead(s.k), bq = +(s.bq || 1), bn = String(s.bn == null ? "" : s.bn).trim().replace(/−/g, "-");
    var b = /^-?\d+$/.test(bn) ? Q(+bn, bq) : null;
    var inRange = !!b && b.n > -b.d && b.n <= b.d;
    return { f:s.f || "cos", a:a, c:c, k:k, b:b, bOk:inRange, valid:isFinite(a) && a !== 0 && isFinite(c) && !!k && !!b && inRange };
  }
  function P(d){ return { f:d.f, a:d.a, k:d.k, d:qDiv(qNeg(d.b), d.k), c:d.c }; }
  function peakOk(d){ var th = qAdd(qMul(d.k, Q(1, 3)), d.b), phi = PEAKANG[pkey(d.f, d.a)]; return qInt(qDiv(qSub(th, phi), Q(2))); }
  function valAt(d){
    var th = qAdd(qMul(d.k, Q(1, 3)), d.b), v = d.a * FN[d.f](qV(th) * PI) + d.c, q = qOf(Math.round(v * 1e9) / 1e9);
    return q && q.d <= 12 ? m(ratSrc(q)) : "about " + num(v, 2);
  }
  function caption(){
    var d = read(), el = $("#wo-cap"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<span class="muted">' + (d.b && !d.bOk ? T.bRange : "Fill in every box to see your wave.") + "</span>"; return; }
    var PP = P(d);
    el.innerHTML = m(eqE(PP, d.b, true, false)) + '<br><span class="wo-fac">= ' + m(eqF(PP, true, false).replace(/^y = /, "")) + "</span>";
  }
  function draw(){
    var d = read(), ph = plot.c.getBoundingClientRect().width < 420, wide = false, W = null, Pd = null;
    if (d.valid) { W = flo(P(d)); Pd = TAU / W.k; wide = W.c + Math.abs(W.a) > 9 || W.c - Math.abs(W.a) < -1; }
    var V = { xmin:-PI / 2, xmax:TAU, ymin:wide ? -12.5 : -1, ymax:wide ? 12.5 : 9 };
    $("#wo-note").innerHTML = wide ? T.wide : "";
    plot.draw({ view:V, xTicks:piTicks(ph ? 1 : 0.5, 0.25), yTicks:{ step:1, fmt:function(t){ return (wide || ph) && Math.round(t) % 2 ? "" : num(t); } },
      describe:d.valid ? "Preview of " + MV.plain(m(eqE(P(d), d.b))) + ", with dashed guide lines at y = 7 and y = 1 and a ring at (π/3, 7)." : "Preview: dashed guide lines at y = 7 and y = 1 and a ring at (π/3, 7). Fill in every box to see your wave.",
      after:function(ctx, p){
        var ink2 = css("--ink-2"), ink = css("--ink");
        if (W) { var A = Math.abs(W.a), X0 = p.X(W.d), X1 = p.X(W.d + Pd); ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(X0, p.Y(W.c + A), X1 - X0, p.Y(W.c - A) - p.Y(W.c + A)); ctx.strokeStyle = ink2; ctx.lineWidth = 1; ctx.strokeRect(X0 + 0.5, p.Y(W.c + A) + 0.5, X1 - X0 - 1, p.Y(W.c - A) - p.Y(W.c + A) - 1); ctx.restore(); }
        [7, 1].forEach(function(y){ hLine(ctx, p, y, ink2, 1.6, [6, 5]); drawToks(ctx, p, [{ t:"y", i:true, c:ink2 }, { t:" = " + y, c:ink2 }], 6, p.Y(y) - 11, { size:12 }); });
        if (W) { curveOn(p, waveF(W), { color:css("--pen"), width:3, n:1200 }); for (var j = 0; j < 5; j++) p.point({ x:W.d + j * Pd / 4, y:W.a * PAT[W.f][j] + W.c, r:4.5, color:ink }); }
        p.point({ x:PI / 3, y:7, r:8, open:true, color:ink });
      } });
  }
  function update(){ caption(); draw(); api.update(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; def(a.S, { f:"cos", a:"", k:"", bn:"", bq:1, c:"" });
      inp.innerHTML = '<div class="wo-in"><div id="wo-f"></div><div class="inrow wo-row">' +
        '<label for="wo-a"><span>' + m("@a{a}") + '</span><input id="wo-a" type="text" inputmode="text" autocomplete="off" placeholder="−6 to 6"></label>' +
        '<label for="wo-k"><span>' + m("@k{k}") + '</span><input id="wo-k" type="text" inputmode="text" autocomplete="off" placeholder="p/q"></label>' +
        '<div class="wo-b"><label for="wo-bn">' + m("b") + '</label><span class="wo-bf"><input id="wo-bn" type="text" inputmode="text" autocomplete="off" aria-label="numerator of b, the number in front of π"><span class="wo-sl">/</span><select id="wo-bq" aria-label="denominator of b">' + QS.map(function(q){ return '<option value="' + q + '">' + q + "</option>"; }).join("") + '</select><span class="m">π</span></span></div>' +
        '<label for="wo-c"><span>' + m("@c{c}") + '</span><input id="wo-c" type="text" inputmode="text" autocomplete="off" placeholder="−6 to 6"></label></div>' +
        '<p class="tiny muted">' + m("@a{a}") + " and " + m("@c{c}") + ": −6 to 6 in steps of 1/2. " + m("@k{k}") + ": a fraction " + m("p/q") + " with whole numbers from 1 to 12. " + m("b") + ": a whole number over 1, 2, 3, 4, 6 or 12, times π, with −π < " + m("b") + " ≤ π.</p>" +
        '<p class="wo-cap" id="wo-cap" aria-live="polite"></p></div>';
      pv.innerHTML = '<canvas class="plot" id="wo-plot" role="img" aria-label="Preview of your wave"></canvas><p class="tiny" id="wo-note" aria-live="polite"></p>';
      plot = new MV.Plot($("#wo-plot"), { xmin:-PI / 2, xmax:TAU, ymin:-1, ymax:9 }); plot.render = draw;
      radios($("#wo-f"), { label:"Function:", aria:"Function", options:[{ id:"sin", t:m("sin") }, { id:"cos", t:m("cos") }], value:a.S.f, cls:"chips", onChange:function(v){ a.S.f = v; a.save(); update(); } });
      [["wo-a", "a"], ["wo-k", "k"], ["wo-bn", "bn"], ["wo-c", "c"]].forEach(function(p){ var el = $("#" + p[0]); el.value = a.S[p[1]]; el.addEventListener("input", function(){ a.S[p[1]] = el.value; a.save(); update(); }); });
      var sel = $("#wo-bq"); sel.value = String(a.S.bq); sel.addEventListener("change", function(){ a.S.bq = +sel.value; a.save(); update(); });
      var chk = $("#task-check"); if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var fb = $("#task-fb .fb.good"), found = MV.taskState().found || [];
        if (fb && found.length >= 4 && !fb.querySelector(".wo-all")) fb.insertAdjacentHTML("beforeend", '<p class="wo-all">' + T.allFour + "</p>");
      }, 0); });
      caption(); draw();
    },
    read:read,
    valid:function(d){ return d.valid ? true : (d.b && !d.bOk ? T.bRange : T.invalid); },
    checks:function(d){ if (!d.valid) return [false, false, false, false]; var A = Math.abs(d.a); return [d.c + A === 7, d.c - A === 1, qEq(d.k, Q(2)), peakOk(d)]; },
    tips:function(d, res){
      var A = Math.abs(d.a), out = [];
      if (!res[0]) out.push(fill(T.tips[0], { v:num(d.c + A) }));
      if (!res[1]) out.push(fill(T.tips[1], { v:num(d.c - A) }));
      if (!res[2]) out.push(fill(T.tips[2], { v:m(piSrc(qDiv(Q(2), d.k))) }));
      if (!res[3]) out.push(fill(T.tips[3], { v:valAt(d) }));
      return out;
    },
    key:function(d){ return [d.f, d.a, d.k.n + "/" + d.k.d, d.b.n + "/" + d.b.d, d.c].join("|"); },
    label:function(k){ var p = k.split("|"), kk = p[2].split("/"), bb = p[3].split("/"), d = { f:p[0], a:+p[1], k:Q(+kk[0], +kk[1]), b:Q(+bb[0], +bb[1]), c:+p[4] }; return m(eqE(P(d), d.b, false, false)); },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ match:matchAct, multi:multiAct },
  task:task
});
})();
