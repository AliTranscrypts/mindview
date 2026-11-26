// MCV4U 31 Logarithmic Differentiation: hero (y = xˣ draws, "y = xˣ" morphs into "ln y = x ln x", a tangent slides and flattens
// at 1/e), Log-then-differentiate machine (Explore: V7 move menu with traps, Graph mode with tangent-from-your-formula and the
// tool's secant, Split the slope bars, V8 exact boxes for challenge 3), Which method? (Part 3: the toolkit's tap-to-sort grid and
// an N13 step-through of the two routes), Slopes and rates (Practice 2, V8 exact boxes) and "Flat at x = 1" (ratio dial).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
var E = Math.E, IE = 1 / Math.E, HP = Math.PI / 2;
function m(s){ return MV.m(s); }
function md(s){ return MV.md(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol) * Math.max(1, Math.abs(b)); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
// placeholders #1, #2 (they survive backtick math)
function tpl(s, a){ return String(s).replace(/#(\d)/g, function(_, k){ return a[k - 1] != null ? a[k - 1] : "#" + k; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px, up){ return (up ? "400 " : "italic 400 ") + (px || 15) + "px " + (css("--font-math") || "serif"); }
// fixed decimals with a true minus ("0.69", "−0.69")
function fx(v, dp){ var s = (Math.abs(v) < 0.5 * Math.pow(10, -dp) ? 0 : v).toFixed(dp); return s.replace("-", MINUS); }
// "≈ 6.77", or "= 4" when rounding to dp decimals changes nothing
function apx(v, dp){ var p = Math.pow(10, dp), r = Math.round(v * p) / p; return (Math.abs(v - r) > 1e-9 ? "≈ " : "= ") + num(v, dp); }
function segBtns(name, opts, val, label, dis){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '"' + (dis && dis(o.id) ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</span>";
}
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 4, Y - 10, w + 8, 20); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
// a line through (x, y) with slope s, drawn in pixel space: len px each way (so steep tangents keep their length)
function drawTan(ctx, p, x, y, s, color, width, len, dash){
  if (!isFinite(y) || !isFinite(s) || len <= 0) return;
  var X = p.X(x), Y = p.Y(y), dx = p.X(x + 1) - X, dy = p.Y(y + s) - Y, n = Math.sqrt(dx * dx + dy * dy) || 1;
  dx = dx / n * len; dy = dy / n * len;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = "round"; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(X - dx, Y - dy); ctx.lineTo(X + dx, Y + dy); ctx.stroke(); ctx.restore();
}
// rich text pieces on a canvas: [{t, up (upright), sup (superscript)}]; returns the width
function rich(ctx, X, Y, pieces, px, color, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = color; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
  var x = X;
  pieces.forEach(function(q){ ctx.font = mfont(q.sup ? px * 0.68 : px, q.up); ctx.fillText(q.t, x, q.sup ? Y - px * 0.42 : Y); x += ctx.measureText(q.t).width; });
  ctx.restore(); return x - X;
}

// =====================================================================================================================
// @component V8 lnExact (copied from MCV4U 27; adds √ and sqrt) — exact answers typed with numbers, fractions, ln, e and √ (no
// variables): "e^2", "e²", "1/e", "e^(−1/e)", "(1/e)^(1/e)", "2 − 2 ln 2", "1/√e". Implicit products ("2ln2"), ^ for powers, ln and √
// bind to the next power ("ln 2/4" = (ln 2)/4).   lnParse(str) -> { v, dec (a decimal was typed), sym (ln or e was used) } or { err:"syntax" | "lnneg" }
var SUPD = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "⁻":"-" };
function lnParse(str){
  var s = String(str == null ? "" : str).toLowerCase().replace(/[−–—]/g, "-").replace(/[·×*]/g, "*").replace(/sqrt/g, "√")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function(t){ return "^(" + t.split("").map(function(c){ return SUPD[c]; }).join("") + ")"; }).trim();
  var toks = [], i = 0, dec = false;
  while (i < s.length) {
    var c = s[i];
    if (c === " ") { i++; continue; }
    var mm = /^(\d+(?:\.\d*)?|\.\d+)/.exec(s.slice(i));
    if (mm) { toks.push({ t:"n", v:parseFloat(mm[1]) }); if (mm[1].indexOf(".") >= 0) dec = true; i += mm[1].length; continue; }
    if (s.substr(i, 2) === "ln") { toks.push({ t:"ln" }); i += 2; continue; }
    if (c === "√") { toks.push({ t:"rt" }); i++; continue; }
    if (c === "e") { toks.push({ t:"e" }); i++; continue; }
    if ("+-*/^()".indexOf(c) >= 0) { toks.push({ t:c }); i++; continue; }
    return { err:"syntax" };
  }
  if (!toks.length) return { err:"syntax" };
  var p = 0, bad = null;
  function pk(){ return toks[p]; }
  function starts(k){ return k && (k.t === "n" || k.t === "e" || k.t === "ln" || k.t === "rt" || k.t === "("); }
  function expr(){ var v = term(); while (pk() && (pk().t === "+" || pk().t === "-")) { var o = toks[p++].t, w = term(); v = o === "+" ? v + w : v - w; } return v; }
  function term(){
    var v = unary();
    for (;;) {
      var k = pk();
      if (k && (k.t === "*" || k.t === "/")) { p++; var w = unary(); v = k.t === "*" ? v * w : v / w; }
      else if (starts(k)) v = v * power();
      else break;
    }
    return v;
  }
  function unary(){ var k = pk(); if (k && k.t === "-") { p++; return -unary(); } if (k && k.t === "+") { p++; return unary(); } return power(); }
  function power(){ var b = atom(); if (pk() && pk().t === "^") { p++; return Math.pow(b, unary()); } return b; }
  function atom(){
    var k = toks[p++];
    if (!k) { bad = bad || "syntax"; return NaN; }
    if (k.t === "n") return k.v;
    if (k.t === "e") return Math.E;
    if (k.t === "(") { var v = expr(); if (!pk() || pk().t !== ")") { bad = bad || "syntax"; return NaN; } p++; return v; }
    if (k.t === "ln") { var a = power(); if (!(a > 0)) { bad = bad || (isFinite(a) ? "lnneg" : "syntax"); return NaN; } return Math.log(a); }
    if (k.t === "rt") { var r = power(); if (!(r >= 0)) { bad = bad || "syntax"; return NaN; } return Math.sqrt(r); }
    bad = bad || "syntax"; return NaN;
  }
  var v = expr();
  if (p !== toks.length) bad = bad || "syntax";
  if (bad || !isFinite(v)) return { err:bad || "syntax" };
  return { v:v, dec:dec, sym:toks.some(function(k){ return k.t === "ln" || k.t === "e"; }) };
}
// ------------------------------------------------- end of V8 lnExact ---------------------------------------------------------
function boxHTML(k, val, label, cls, dis, ph){
  return '<input class="numin short' + (cls ? " " + cls : "") + '" data-bx="' + k + '" data-k="bx' + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '"' + (ph ? ' placeholder="' + MV.esc(ph) + '"' : "") + ' value="' + MV.esc(val || "") + '"' + (dis ? " disabled" : "") + ">";
}

// =====================================================================================================================
// ---------- the four machine functions: value, derivative ("your formula", y · y′/y), view and snap points ----------
function f4(x){ return (x + 1) * (x + 1) * Math.pow(x - 2, 3) / (x * x + 1); }
function f4ypy(x){ return 2 / (x + 1) + 3 / (x - 2) - 2 * x / (x * x + 1); }
var SNAP = [{ v:IE, n:"1/e" }, { v:1, n:"1" }, { v:HP, n:"π/2" }, { v:2, n:"2" }, { v:E, n:"e" }];
var FN = {
  F1:{ f:function(x){ return x > 0 ? Math.pow(x, x) : NaN; }, d:function(x){ return Math.pow(x, x) * (Math.log(x) + 1); },
    lo:0.05, hi:4, view:{ xmin:-0.3, xmax:4.2, ymin:-0.7, ymax:4.6 }, open:true, dom:[0.0005, 4.4], name:"y = xˣ" },
  F2:{ f:function(x){ return x > 0 ? Math.pow(x, Math.sin(x)) : NaN; }, d:function(x){ return Math.pow(x, Math.sin(x)) * (Math.cos(x) * Math.log(x) + Math.sin(x) / x); },
    lo:0.05, hi:4, view:{ xmin:-0.3, xmax:4.2, ymin:-0.5, ymax:2.6 }, open:true, dom:[0.0005, 4.4], name:"y = x^(sin x)" },
  F3:{ f:function(x){ return x > 0 ? Math.pow(x, Math.log(x)) : NaN; }, d:function(x){ return Math.pow(x, Math.log(x)) * 2 * Math.log(x) / x; },
    lo:0.05, hi:4, view:{ xmin:-0.3, xmax:4.2, ymin:-1, ymax:8.4 }, open:false, dom:[0.02, 4.4], name:"y = x^(ln x)" },
  F4:{ f:f4, d:function(x){ var y = f4(x); return Math.abs(y) < 1e-12 ? NaN : y * f4ypy(x); },
    lo:-3, hi:4, view:{ xmin:-3.3, xmax:4.3, ymin:-12, ymax:8 }, open:false, dom:[-3, 4], name:"y = (x + 1)²(x − 2)³/(x² + 1)", snap0:true }
};
var LADDER = [1, 2, 4, 10, 25, 60, 200, 1000, 2000];
function viewFor(id, y){
  var V = FN[id].view, k = 1;
  if (isFinite(y)) for (var i = 0; i < LADDER.length; i++) { k = LADDER[i]; if (y <= V.ymax * k * 0.86 && y >= V.ymin * k * 0.86) break; }
  return { xmin:V.xmin, xmax:V.xmax, ymin:V.ymin * k, ymax:V.ymax * k };
}
function snapsOf(id){ return FN[id].snap0 ? [{ v:0, n:"0" }].concat(SNAP) : SNAP; }
function xName(id, x){ var s = snapsOf(id); for (var i = 0; i < s.length; i++) if (near(x, s[i].v)) return s[i].n; return num(x, 2); }
// exact point value and slope (m() sources) where a clean form exists
function exactAt(id, x){
  var n = function(v){ return near(x, v); };
  if (id === "F1") {
    if (n(IE)) return { y:"e^{-1/e}", s:"0" };
    if (n(E)) return { y:"e^e", s:"2e^e" };
    if (n(HP)) return { y:"(π/2)^{π/2}", s:"(π/2)^{π/2}(ln(π/2) + 1)" };
    if (n(1)) return { y:"1", s:"1" };
    if (Number.isInteger(r9(x))) { var p = Math.pow(x, x); return { y:String(p), s:p + "(ln " + x + " + 1)" }; }
  }
  if (id === "F2") { if (n(1)) return { y:"1", s:"sin 1" }; if (n(HP)) return { y:"π/2", s:"1" }; }
  if (id === "F3") {
    if (n(IE)) return { y:"e", s:"-2e^2" }; if (n(1)) return { y:"1", s:"0" }; if (n(E)) return { y:"e", s:"2" };
    if (n(2)) return { y:"2^{ln 2}", s:"2^{ln 2} ln 2" };
  }
  if (id === "F4" && Number.isInteger(r9(2 * x))) {
    var X = Q.of(Math.round(2 * x), 2), A = Q.add(X, Q.of(1)), B = Q.sub(X, Q.of(2)), D = Q.add(Q.mul(X, X), Q.of(1));
    var Y = Q.div(Q.mul(Q.mul(A, A), Q.mul(B, Q.mul(B, B))), D);
    if (Y.n === 0) return { y:"0", s:null, zero:true };
    var R = Q.sub(Q.add(Q.div(Q.of(2), A), Q.div(Q.of(3), B)), Q.div(Q.mul(Q.of(2), X), D));
    return { y:Q.txt(Y), s:Q.txt(Q.mul(Y, R)) };
  }
  return {};
}
function qPlain(s){ return /^[−-]?\d+(\/\d+)?$/.test(s); }

// =====================================================================================================================
// ---------- hero: y = xˣ draws; "y = xˣ" morphs into "ln y = x ln x"; a tangent slides along and flattens at 1/e ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var V = { xmin:-0.25, xmax:2.45, ymin:-0.35, ymax:6.2 }, pl = new MV.Plot(cv, V), F = FN.F1.f, D = FN.F1.d;
  var st = { end:0, lab:0, morph:0, tx:null, tA:0, flat:false, fin:0 };
  function cap(h){ if (f.cap) f.cap.innerHTML = MV.md(h); }
  function label(ctx, p){
    if (st.lab <= 0) return;
    var px = Math.max(15, Math.min(20, p.W / 22)), X0 = p.X(0.06), Y0 = p.Y(5.45), t = st.morph, s = t * t * (3 - 2 * t), col = css("--pen");
    ctx.save(); ctx.font = mfont(px, true); var wLn = ctx.measureText("ln ").width, wLn2 = ctx.measureText(" ln ").width;
    ctx.font = mfont(px); var wY = ctx.measureText("y = ").width, wX = ctx.measureText("x").width; ctx.restore();
    // pieces: "y = " B, base x E, exponent x C; "ln " A and " ln " D fade in
    var bx0 = X0, bx1 = X0 + wLn, ex0 = X0 + wY, ex1 = X0 + wLn + wY + wX + wLn2, cx0 = X0 + wY + wX, cx1 = X0 + wLn + wY;
    var a = st.lab;
    ctx.save(); ctx.globalAlpha = 0.86 * a; ctx.fillStyle = css("--sheet"); ctx.fillRect(X0 - 6, Y0 - px * 1.25, ex1 + wX - X0 + 12, px * 1.65); ctx.restore();
    rich(ctx, bx0 + (bx1 - bx0) * s, Y0, [{ t:"y = " }], px, col, a);
    rich(ctx, ex0 + (ex1 - ex0) * s, Y0, [{ t:"x" }], px, col, a);
    var csz = px * (0.68 + 0.32 * s), cy = Y0 - px * 0.42 * (1 - s);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.font = mfont(csz); ctx.textBaseline = "alphabetic"; ctx.fillText("x", cx0 + (cx1 - cx0) * s, cy); ctx.restore();
    if (s > 0) { rich(ctx, X0, Y0, [{ t:"ln ", up:true }], px, col, a * s); rich(ctx, X0 + wLn + wY + wX, Y0, [{ t:" ln ", up:true }], px, col, a * s); }
    if (st.fin > 0) {
      var Y1 = Y0 + px * 1.7, w = 0;
      ctx.save(); ctx.globalAlpha = 0.86 * st.fin; ctx.fillStyle = css("--sheet"); ctx.fillRect(X0 - 6, Y1 - px * 1.25, px * 9.4, px * 1.65); ctx.restore();
      w += rich(ctx, X0 + w, Y1, [{ t:"y′ = x" }, { t:"x", sup:true }, { t:"(ln ", up:true }, { t:"x" }, { t:" + 1)", up:true }], px, css("--ink"), st.fin);
    }
  }
  function draw(){
    var pen = css("--pen"), ink = css("--ink");
    var sc = { view:V, xLabel:"x", yLabel:"y", curves:[], points:[] };
    if (st.end > 0.01) { sc.curves.push({ f:F, color:pen, width:3, domain:[0.0005, st.end] }); sc.points.push({ x:0, y:1, r:4.5, color:pen, open:true }); }
    if (st.tx != null) sc.points.push({ x:st.tx, y:F(st.tx), r:5.5, color:ink });
    sc.after = function(ctx, p){
      if (st.tx != null) drawTan(ctx, p, st.tx, F(st.tx), D(st.tx), ink, 2.2, p.W * 0.2 * st.tA);
      if (st.flat) bgText(ctx, "slope 0", p.X(st.tx), p.Y(F(st.tx)) + 24, "center", ink, ui(13, 700));
      label(ctx, p);
    };
    sc.describe = "Graph of y = xˣ for x from 0 to " + num(st.end, 1) + (st.morph >= 1 ? ", labelled ln y = x ln x" : st.lab > 0 ? ", labelled y = xˣ" : "") +
      (st.tx != null ? ". Tangent at x = " + (st.flat ? "1/e, about 0.37, slope 0" : num(st.tx, 2)) : "") + (st.fin > 0 ? ". y′ = xˣ(ln x + 1)." : ".");
    pl.draw(sc);
  }
  pl.render = draw;
  function finalFrame(){ st.end = 2.2; st.lab = 1; st.morph = 1; st.tx = IE; st.tA = 1; st.flat = true; st.fin = 1; draw(); cap("`y′ = x^x(ln x + 1)` is 0 when `ln x = -1`: the tangent is flat at `x = 1/e ≈ 0.37`."); }
  if (MV.reduceMotion) { finalFrame(); return; }
  var lin = function(t){ return t; };
  cap("`y = x^x`"); draw();
  MV.wait(300, function(){
    MV.tween({ dur:1400, ease:lin, step:function(t){ st.end = 2.2 * t; draw(); }, done:function(){
      MV.tween({ dur:400, step:function(t){ st.lab = t; draw(); }, done:function(){
        MV.wait(700, function(){
          cap("Take ln of both sides: the exponent comes down in front.");
          MV.tween({ dur:1300, step:function(t){ st.morph = t; draw(); }, done:function(){
            MV.wait(600, function(){
              cap("A tangent slides along the curve …"); st.tx = 1.6;
              MV.tween({ dur:450, step:function(t){ st.tA = t; draw(); }, done:function(){
                MV.tween({ dur:1900, step:function(t){ st.tx = 1.6 + (IE - 1.6) * t; draw(); }, done:function(){
                  st.tx = IE; st.flat = true; draw(); cap("… and flattens at `x = 1/e ≈ 0.37`.");
                  MV.wait(800, function(){ MV.tween({ dur:700, step:function(t){ st.fin = t; draw(); }, done:finalFrame }); });
                } });
              } });
            });
          } });
        });
      } });
    } });
  });
}

// =====================================================================================================================
// @component splitBars — module-specific (MCV4U 31 "Split the slope"): an SVG waterfall on one shared vertical scale: the
// exponential-rule piece A (--f3, hangs below the zero line when negative, outlined), the power-rule piece B (--f5) stacked
// from A up to A + B, and the total A + B (thick --ink bar). Value labels in words-plus-numbers; aria-label kept current.
//   var b = splitBars(host, {labels:[a, b, t]});  b.set(A, B, xName)
function splitBars(host, o){
  var NS = "http://www.w3.org/2000/svg", L = o.labels;
  host.innerHTML = '<svg class="ld-bsvg" viewBox="0 0 230 262" role="img" aria-label="Split the slope bars"></svg>' +
    '<ul class="ld-bleg"><li><span class="ld-sw ld-swa"></span>' + L[0] + '</li><li><span class="ld-sw ld-swb"></span>' + L[1] + '</li><li><span class="ld-sw ld-swt"></span>' + L[2] + "</li></ul>";
  var svg = $("svg", host);
  function el(tag, at, txt){ var e = document.createElementNS(NS, tag); Object.keys(at).forEach(function(k){ e.setAttribute(k, at[k]); }); if (txt != null) e.textContent = txt; svg.appendChild(e); return e; }
  return { set:function(A, B, xn){
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var T = A + B, lo = Math.min(0, A, T), hi = Math.max(0, A, T), top = 26, bot = 214, span = hi - lo || 1, u = (bot - top) / span;
    function Y(v){ return top + (hi - v) * u; }
    var y0 = Y(0), cols = [{ x:22, c:"ld-ba", a:0, b:A, v:A, n:"xˣ ln x" }, { x:92, c:"ld-bb", a:A, b:T, v:B, n:"x · xˣ⁻¹" }, { x:162, c:"ld-bt", a:0, b:T, v:T, n:"total" }];
    el("line", { x1:8, y1:Y(A), x2:96, y2:Y(A), "class":"ld-bguide" });
    el("line", { x1:66, y1:Y(T), x2:222, y2:Y(T), "class":"ld-bguide" });
    cols.forEach(function(q){
      var ya = Y(Math.max(q.a, q.b)), yb = Y(Math.min(q.a, q.b)), h = Math.max(1.5, yb - ya);
      el("rect", { x:q.x, y:ya, width:46, height:h, rx:2, "class":q.c + (q.c === "ld-ba" && A < 0 ? " neg" : "") });
      var up = q.b >= q.a, ty = up ? ya - 7 : yb + 15;
      if (q.c === "ld-ba" && A < 0) ty = yb + 15;
      el("text", { x:q.x + 23, y:clamp(ty, 13, 230), "class":"ld-bval" }, Math.abs(q.v) < 0.005 ? "0" : fx(q.v, 2));
      el("text", { x:q.x + 23, y:254, "class":"ld-bcap" }, q.n);
    });
    el("line", { x1:6, y1:y0, x2:224, y2:y0, "class":"ld-bzero" });
    el("text", { x:4, y:y0 - 4, "class":"ld-bz" }, "0");
    svg.setAttribute("aria-label", "Split the slope at x = " + xn + ": exponential-rule piece xˣ ln x about " + fx(A, 2) + (A < 0 ? " (below the axis)" : "") +
      ", power-rule piece xˣ about " + fx(B, 2) + ", total slope about " + fx(T, 2) + ".");
  } };
}

// =====================================================================================================================
// ---------- Explore: Log-then-differentiate machine ----------
// @component V7 ruleChooser (log-differentiation machine, MCV4U 31; after MCV4U 05's ruleChooser) — a move menu (native buttons in
// a list, traps mixed in and never marked). A right move appends the next working line; a wrong move or trap gets named feedback,
// counts as a move and adds nothing. Per-function state {stage 0–5, moves, traps[]}; the working shows the last three lines on
// phones ("Show all"). Graph mode draws the tangent from the derived formula once stage ≥ 4.
var STEPS = ["ln", "law", "diff", "mult", "sub"], TRAPS = ["power", "expo", "each"];
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, R = T.rows, FB = C.fb, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (!FN[S.fn]) S.fn = "F1";
  if (["machine", "graph", "split"].indexOf(S.mode) < 0) S.mode = "machine";
  S.xs = S.xs || {};
  var X0 = { F1:2, F2:HP, F3:1, F4:0 };
  Object.keys(FN).forEach(function(k){ var v = S.xs[k]; if (typeof v !== "number" || !(v >= FN[k].lo && v <= FN[k].hi)) S.xs[k] = X0[k]; });
  S.work = S.work || {};
  Object.keys(FN).forEach(function(k){ var w = S.work[k]; if (!w || typeof w.stage !== "number") S.work[k] = { stage:0, moves:0, traps:[] }; });
  S.ex = S.ex || { x:"", y:"" }; S.all = !!S.all;
  if (S.mode === "split") S.fn = "F1";
  var busy = false, mark = null, ov = null, reveal = false, tanA = 1, mfb = null, stop = null, splitNote = false;
  var fnById = {}; C.fns.forEach(function(q){ fnById[q.id] = q; });

  host.innerHTML = '<div class="ld-ex"><div class="ld-main" data-mv="graph"><p class="eq-cap ld-eq" id="ld-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="ld-mach"><ol class="ld-work" id="ld-work" aria-live="polite"></ol><button type="button" class="btn ghost sm ld-showall" id="ld-all" data-k="ldall"></button></div>' +
    '<div class="ld-gwrap" id="ld-gwrap"><div class="ld-gcol"><div class="plot-wrap"><canvas class="plot ld-g" id="ld-g" role="img" aria-label="Graph"></canvas></div><p class="tiny muted ld-key" id="ld-key"></p></div>' +
    '<div class="ld-bars" id="ld-bars"></div></div></div>' +
    '<div class="ld-side"><p class="ld-lab" id="ld-fnlab">' + T.fnLab + '</p><div class="chips ld-fns" id="ld-fns" role="group" aria-labelledby="ld-fnlab"></div>' +
    '<div id="ld-mode"></div><p class="tiny muted ld-how" id="ld-how"></p><p class="ld-note" id="ld-snote" aria-live="polite"></p>' +
    '<div id="ld-movesw"><p class="ld-lab" id="ld-mvlab">' + T.movesLab + '</p><ul class="ld-moves" id="ld-moves" aria-labelledby="ld-mvlab"></ul>' +
      '<div id="ld-mfb" aria-live="polite"></div><p class="tiny ld-cnt" id="ld-cnt"></p><button type="button" class="btn ghost sm" id="ld-reset" data-k="ldreset">' + T.reset + "</button></div>" +
    '<div id="ld-ptw"><label class="slider ld-sl"><span class="slider-top"><span>' + T.point + '</span><output id="ld-xout"></output></span>' +
      '<input type="range" id="ld-x" step="0.01" style="accent-color:var(--pen)" aria-label="Point x zero"></label>' +
      '<p class="ld-lab ld-snl" id="ld-snlab">' + T.snaps + '</p><div class="chips ld-snaps" id="ld-snaps" role="group" aria-labelledby="ld-snlab"></div><p class="tiny muted ld-pnote">' + T.pointNote + "</p></div>" +
    '<dl class="read ld-read" id="ld-read" aria-live="polite"></dl>' +
    '<div class="ld-exact"><p class="ld-exh">' + T.exact + '</p><p class="tiny muted">' + T.exactHow + '</p>' +
      '<div class="ld-frow"><span class="ld-fl">' + T.exX + "</span>" + boxHTML("ex", S.ex.x, "Challenge 3: x-coordinate, exactly", "", false, "e^(…)") + "</div>" +
      '<div class="ld-frow"><span class="ld-fl">' + T.exY + "</span>" + boxHTML("ey", S.ex.y, "Challenge 3: y-value, exactly", "", false, "e^(…)") + "</div></div></div></div>";
  var slX = $("#ld-x", host), gp = new MV.Plot($("#ld-g", host), FN.F1.view);
  gp.render = drawG;
  var bars = splitBars($("#ld-bars", host), { labels:[T.barA, T.barB, T.barT] });

  function W(){ return S.work[S.fn]; }
  function curX(){ return S.xs[S.fn]; }
  function derived(){ return W().stage >= 4; }
  function setX(v){ var F = FN[S.fn]; S.xs[S.fn] = r9(clamp(v, F.lo, F.hi)); }
  function snapNear(v, tol){ var s = snapsOf(S.fn); for (var i = 0; i < s.length; i++) if (Math.abs(s[i].v - v) <= tol) return s[i].v; return null; }
  function clearShow(){ mark = null; ov = null; reveal = false; }
  // arrow keys: next 0.01 (or 0.1) grid point, but a snap point in between is visited first
  function stepKey(dir, big){
    var x = curX(), st = big ? 0.1 : 0.01, g = r9(Math.round(x / st) * st), nx;
    if (dir > 0) nx = g > x + 1e-9 ? g : r9(g + st); else nx = g < x - 1e-9 ? g : r9(g - st);
    var sp = snapsOf(S.fn).map(function(q){ return q.v; }).filter(function(v){ return dir > 0 ? v > x + 1e-9 && v < nx - 1e-9 : v < x - 1e-9 && v > nx + 1e-9; }).sort(function(a, b){ return a - b; });
    if (sp.length) nx = dir > 0 ? sp[0] : sp[sp.length - 1];
    setX(nx);
  }

  // ---- graph ----
  function drawG(){
    var id = S.fn, F = FN[id], x = curX(), y = F.f(x), V = viewFor(id, ov === "p2" ? 4 : y);
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), f3 = css("--f3");
    var sc = { view:V, xLabel:"x", yLabel:"y", curves:[], points:[], segments:[] };
    if (ov === "p2") {
      sc.curves.push({ f:function(t){ return t * t; }, color:ink2, width:2.2, dash:[6, 6] });
      sc.curves.push({ f:function(t){ return Math.pow(2, t); }, color:f3, width:2.2, dash:[6, 6] });
    }
    if (ov === "p3") sc.segments.push({ x1:V.xmin, y1:V.xmin, x2:V.xmax, y2:V.xmax, color:ink2, width:1.6, dash:[6, 6] });
    sc.curves.push({ f:F.f, color:pen, width:3, domain:F.dom });
    if (F.open) sc.points.push({ x:0, y:1, r:4.5, color:pen, open:true });
    var s = F.d(x), showTan = (S.mode === "split" || derived() || reveal) && isFinite(s);
    var secS = (F.f(x + 0.001) - y) / 0.001;
    sc.points.push({ x:x, y:y, r:6.5, color:ink, ring:true });
    sc.after = function(ctx, p){
      // snap points that aren't whole numbers get a label above the x-axis
      snapsOf(id).forEach(function(q){
        if (Number.isInteger(q.v) || q.v < V.xmin || q.v > V.xmax) return;
        var X = p.X(q.v), Y0 = clamp(p.Y(0), 12, p.H - 4);
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X, Y0 - 5); ctx.lineTo(X, Y0 + 5); ctx.stroke(); ctx.restore();
        bgText(ctx, q.n, X, Y0 + (Y0 < 30 ? 16 : -15), "center", ink2, mfont(13));
      });
      if (ov === "p2" && tanA > 0) {
        drawTan(ctx, p, 2, 4, 4, ink2, 1.8, p.W * 0.16 * tanA, [6, 4]);
        drawTan(ctx, p, 2, 4, 4 * Math.LN2, f3, 2, p.W * 0.16 * tanA, [6, 4]);
      }
      if (showTan) drawTan(ctx, p, x, y, s, ink, 2.4, p.W * 0.22 * (reveal ? tanA : 1));
      if (S.mode === "graph" && isFinite(secS)) drawTan(ctx, p, x, y, secS, ink2, 1.3, p.W * 0.3, [4, 4]);
      if (ov === "p2" && tanA >= 1) {
        bgText(ctx, "x²: slope 4", p.X(2) + 14, p.Y(4) + 34, "left", ink2, ui(12, 700));
        bgText(ctx, "2ˣ: slope ≈ 2.77", p.X(2) + 14, p.Y(4) + 56, "left", f3, ui(12, 700));
        bgText(ctx, "xˣ: slope ≈ 6.77", p.X(2) - 14, p.Y(4) - 20, "right", ink, ui(12, 700));
      }
      if (ov === "p3") bgText(ctx, "y = x", p.X(3.7), p.Y(3.7) + 16, "right", ink2, mfont(14));
      if (mark) {
        if (mark.ring) { ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.X(mark.x), p.Y(mark.y), 9, 0, 2 * Math.PI); ctx.stroke(); ctx.restore(); }
        bgText(ctx, mark.text, p.X(mark.x) + (mark.dx || 0), p.Y(mark.y) + (mark.dy || -24), mark.align || "center", ink, ui(13, 700));
      }
    };
    var xs = MV.plain(m(xName(id, x)));
    sc.describe = "Graph of " + F.name + ". Point (" + xs + ", " + fx(y, 2) + ")" + (showTan ? " with the tangent, slope about " + fx(s, 2) : "") +
      (S.mode === "graph" && isFinite(secS) ? "; the tool’s secant has slope about " + fx(secS, 2) : "") + "." +
      (ov === "p2" ? " Also y = x² dashed grey and y = 2ˣ dashed teal, all through (2, 4)." : "") + (ov === "p3" ? " The dashed line y = x is shown." : "") +
      (mark ? " " + mark.text + "." : "");
    gp.draw(sc);
  }

  // ---- readout ----
  function rowsFor(){
    var id = S.fn, F = FN[id], fd = fnById[id], w = W(), wk = C.work[id], x = curX(), y = F.f(x), ex = exactAt(id, x), rows = [];
    var wait = function(mv){ return '<span class="muted">' + T.notYet + " “" + mv + "”</span>"; };
    var mvT = {}; C.moves.forEach(function(q){ mvT[q.id] = q.t; });
    if (S.mode !== "split") {
      rows.push([R.fn, m(fd.eq) + ", " + fd.dom]);
      rows.push([id === "F4" ? R.lnyF4 : R.lny, w.stage >= 2 ? m(wk.lny) : wait(mvT.law)]);
      rows.push([R.ypy, w.stage >= 3 ? m(wk.ypy) : wait(mvT.diff)]);
      rows.push([R.yp, w.stage >= 5 ? m(wk.ypx) : w.stage >= 4 ? m(wk.yp) : wait(mvT.mult)]);
    }
    if (S.mode === "machine") return rows;
    var xs = xName(id, x), pt = ex.y != null ? m("(" + xs + ", " + ex.y + ")") : "≈ " + m("(" + xs + ", " + fx(y, 2) + ")");
    if (ex.y != null && !qPlain(ex.y) && isFinite(y) && !/^\d+$/.test(ex.y)) pt += " ≈ " + m("(" + fx(x, 2) + ", " + fx(y, 2) + ")");
    rows.push([R.pt, pt]);
    var s = F.d(x);
    if (S.mode === "split") {
      var A = y * Math.log(x), B = y;
      rows.push([R.pa, (near(x, 1) ? "= 0" : apx(A, 2))], [R.pb, apx(B, 2)], [R.tot, ex.s != null ? m(ex.s) + (qPlain(ex.s) ? "" : " " + apx(s, 2)) : apx(s, 2)]);
      return rows;
    }
    var sf;
    if (ex.zero) sf = '<span class="muted">' + T.zero + "</span>";
    else if (!derived()) sf = '<span class="muted">' + T.notDerived + "</span>";
    else sf = ex.s != null ? m(ex.s) + (qPlain(ex.s) ? "" : " " + apx(s, 2)) : apx(s, 2);
    rows.push([R.sf, sf]);
    var sec = (F.f(x + 0.001) - y) / 0.001;
    var ok = derived() && isFinite(s) && Math.abs(sec - s) <= 0.01 * Math.max(1, Math.abs(s));
    rows.push([R.ss, "≈ " + fx(sec, 2) + (ok ? ' <span class="ld-ok">' + T.match + "</span>" : "")]);
    return rows;
  }
  function paintRead(){ $("#ld-read", host).innerHTML = MV.readoutHTML(rowsFor()); }

  // ---- machine working and menu ----
  function notes(){ return S.fn === "F4" ? C.notesF4 : C.notes; }
  function paintWork(){
    var w = W(), wk = C.work[S.fn], ol = $("#ld-work", host), nt = notes();
    ol.innerHTML = wk.lines.slice(0, w.stage + 1).map(function(l, i){ return '<li class="' + (i === w.stage ? "cur" : "") + '"><span class="ld-wnum" aria-hidden="true">' + (i + 1) + '.</span><span class="ld-wn">' + nt[i] + '</span><span class="ld-we">' + m(l) + "</span></li>"; }).join("");
    ol.classList.toggle("ld-clip", !S.all);
    var b = $("#ld-all", host); b.hidden = w.stage + 1 <= 3; b.textContent = S.all ? T.showLess : T.showAll; b.setAttribute("aria-expanded", String(S.all));
  }
  function paintMoves(){
    var w = W(), done = w.stage >= 5;
    MV.keepFocus($("#ld-moves", host), function(){
      $("#ld-moves", host).innerHTML = C.moves.map(function(q){ return '<li><button type="button" class="btn ghost sm ld-mv" data-move="' + q.id + '" data-k="mv' + q.id + '"' + (done || busy ? " disabled" : "") + ">" + q.t + "</button></li>"; }).join("");
    });
    $("#ld-mfb", host).innerHTML = mfb ? MV.fbHTML(mfb.bad ? "bad" : "good", mfb.html) : "";
    var tr = w.traps.map(function(t){ return C.moves.filter(function(q){ return q.id === t; })[0].t; });
    $("#ld-cnt", host).innerHTML = tpl(T.moveCount, [w.moves]) + (tr.length ? " · " + tpl(T.traps, [tr.join(", ")]) : "");
  }
  function doMove(id){
    var w = W(), st = w.stage, F4 = S.fn === "F4";
    if (st >= 5) return;
    w.moves++;
    if (id === STEPS[st]) {
      w.stage++;
      var line = m(C.work[S.fn].lines[w.stage]);
      mfb = { bad:false, html:w.stage >= 5 ? "<strong>" + tpl(FB.done, [w.moves]) + "</strong> " + line : "<strong>" + FB.ok + "</strong> " + line };
    } else if (TRAPS.indexOf(id) >= 0) {
      if (w.traps.indexOf(id) < 0) w.traps.push(id);
      var t = F4 && id === "power" ? FB.powerF4 : F4 && id === "expo" ? FB.expoF4 : FB[id];
      mfb = { bad:true, html:"<strong>✗</strong> " + t + ' <span class="muted">' + FB.trapNote + "</span>" };
    } else mfb = { bad:true, html:"<strong>✗</strong> " + wrongMsg(id, st, F4) + ' <span class="muted">' + FB.trapNote + "</span>" };
  }
  function wrongMsg(id, st, F4){
    if (st === 0) { if (id === "law") return FB.lawEarly; if (id === "diff") return F4 ? FB.diffEarlyF4 : FB.diffEarly; if (id === "sub") return FB.subEarly; return FB.first; }
    if (id === "ln") return FB.lnDone;
    if (id === "law" && st >= 2) return F4 ? FB.lawDoneF4 : FB.lawDone;
    if (st === 1) { if (id === "diff") return F4 ? FB.diffNoLawF4 : FB.diffNoLaw; if (id === "mult") return FB.multEarly; if (id === "sub") return FB.subEarly; }
    if (st === 2) { if (id === "mult") return FB.multEarly; if (id === "sub") return FB.subEarly; }
    if (st === 3) { if (id === "diff") return FB.diffDone; if (id === "sub") return FB.subEarlyY; }
    if (st === 4) { if (id === "diff") return FB.diffDone; if (id === "mult") return FB.multDone; }
    return FB.first;
  }

  // ---- controls ----
  function paintCtl(){
    MV.keepFocus($("#ld-fns", host), function(){
      $("#ld-fns", host).innerHTML = C.fns.map(function(q){ var on = S.fn === q.id, dis = busy || (S.mode === "split" && q.id !== "F1");
        return '<button type="button" class="chip ld-fchip' + (on ? " on" : "") + '" data-fn="' + q.id + '" data-k="fn' + q.id + '" aria-pressed="' + on + '"' + (dis ? " disabled" : "") + ">" + q.chip + "</button>"; }).join("");
    });
    MV.keepFocus($("#ld-mode", host), function(){ $("#ld-mode", host).innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">' + T.modeLab + "</span>" + segBtns("mode", C.modes, S.mode, T.modeLab, function(){ return busy; }) + "</div>"; });
    $("#ld-how", host).innerHTML = C.modeHow[S.mode];
    $("#ld-snote", host).innerHTML = splitNote ? T.splitOnly : ""; $("#ld-snote", host).hidden = !splitNote;
    $("#ld-movesw", host).hidden = S.mode !== "machine";
    $("#ld-mach", host).hidden = S.mode !== "machine";
    $("#ld-ptw", host).hidden = S.mode === "machine";
    $("#ld-bars", host).hidden = S.mode !== "split";
    $("#ld-gwrap", host).classList.toggle("ld-split", S.mode === "split");
    var F = FN[S.fn];
    slX.min = F.lo; slX.max = F.hi; slX.value = curX(); slX.disabled = busy;
    $("#ld-xout", host).innerHTML = m(xName(S.fn, curX()));
    MV.keepFocus($("#ld-snaps", host), function(){
      $("#ld-snaps", host).innerHTML = snapsOf(S.fn).map(function(q, i){ var on = near(curX(), q.v); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-snap="' + i + '" data-k="sn' + S.fn + i + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">" + m(q.n) + "</button>"; }).join("");
    });
    $("#ld-eq", host).innerHTML = m(fnById[S.fn].eq);
    $("#ld-key", host).innerHTML = S.mode === "machine" ? (derived() ? T.keyM : T.needMachine) : S.mode === "graph" ? (derived() || reveal ? T.keyG : T.needFormula) : "";
    $("#ld-reset", host).disabled = busy || W().moves === 0;
  }
  function paintBars(){ if (S.mode !== "split") return; var x = curX(), y = FN.F1.f(x); bars.set(y * Math.log(x), y, MV.plain(m(xName("F1", x)))); }
  function refresh(){ paintCtl(); paintWork(); paintMoves(); paintRead(); paintBars(); drawG(); }
  function changed(){ api.save(); refresh(); MV.changed(); }
  function lock(on){ busy = !!on; $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); if (!on) refresh(); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b)) return;
    if (b.dataset.fn) { if (S.fn !== b.dataset.fn) { S.fn = b.dataset.fn; mfb = null; } splitNote = false; clearShow(); changed(); return; }
    if (b.dataset.mode) {
      S.mode = b.dataset.mode; splitNote = false; clearShow();
      if (S.mode === "split" && S.fn !== "F1") { S.fn = "F1"; mfb = null; splitNote = true; }
      changed(); return;
    }
    if (b.dataset.move) { doMove(b.dataset.move); api.save(); refresh(); MV.changed(); MV.focusFb($("#ld-movesw", host)); return; }
    if (b.id === "ld-reset") { S.work[S.fn] = { stage:0, moves:0, traps:[] }; mfb = null; changed(); return; }
    if (b.id === "ld-all") { S.all = !S.all; api.save(); paintWork(); return; }
    if (b.dataset.snap != null) { setX(snapsOf(S.fn)[+b.dataset.snap].v); clearShow(); changed(); }
  });
  slX.addEventListener("input", function(){ if (busy) return; var v = +slX.value, sn = snapNear(v, 0.02); setX(sn != null ? sn : v); clearShow(); changed(); });
  slX.addEventListener("keydown", function(e){
    if (busy) return;
    var k = e.key, d = k === "ArrowRight" || k === "ArrowUp" ? 1 : k === "ArrowLeft" || k === "ArrowDown" ? -1 : 0;
    if (d) { e.preventDefault(); stepKey(d, e.shiftKey); }
    else if (k === "PageUp" || k === "PageDown") { e.preventDefault(); stepKey(k === "PageUp" ? 1 : -1, true); }
    else if (k === "Home" || k === "End") { e.preventDefault(); var s = snapsOf(S.fn); setX(k === "Home" ? s[0].v : s[s.length - 1].v); }
    else return;
    clearShow(); changed();
  });
  (function(){
    var c = $("#ld-g", host), active = false;
    function at(ev){ var r = c.getBoundingClientRect(), v = gp.xOf(ev.clientX - r.left), sn = snapNear(v, 0.04); setX(sn != null ? sn : Math.round(v * 100) / 100); clearShow(); changed(); }
    c.addEventListener("pointerdown", function(ev){ if (busy || !gp.v || S.mode === "machine") return; active = true; try { c.setPointerCapture(ev.pointerId); } catch (err) {} at(ev); });
    c.addEventListener("pointermove", function(ev){ if (active && !busy) at(ev); });
    c.addEventListener("pointerup", function(){ active = false; }); c.addEventListener("pointercancel", function(){ active = false; });
  })();
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.bx; if (k === "ex" || k === "ey") { S.ex[k === "ex" ? "x" : "y"] = e.target.value; api.save(); MV.changed(); } });
  refresh();

  // ---- challenges ----
  function chal(id){
    var M = MS[id];
    if (id === "tc1") {
      var w = S.work.F1;
      if (!w.moves) return { ok:false, msg:M.start };
      for (var i = 0; i < TRAPS.length; i++) if (w.traps.indexOf(TRAPS[i]) >= 0) return { ok:false, msg:M[TRAPS[i]] };
      if (w.stage >= 5) return w.moves <= 5 ? { ok:true } : { ok:false, msg:tpl(M.many, [w.moves]) };
      if (w.stage === 3) return { ok:false, msg:M.ypy };
      if (w.stage === 4) return { ok:false, msg:M.sub };
      return { ok:false, msg:M.early };
    }
    if (id === "tc2") {
      if (S.mode !== "graph" || S.fn !== "F3") return { ok:false, msg:M.mode };
      var x = S.xs.F3;
      if (near(x, E)) return { ok:true };
      if (near(x, 2)) return { ok:false, msg:M.x2 };
      if (near(x, 3)) return { ok:false, msg:M.x3 };
      if (near(x, 1)) return { ok:false, msg:M.x1 };
      return { ok:false, msg:tpl(M.general, [fx(FN.F3.d(x), 2)]) };
    }
    if (id === "tc3") {
      var rx = String(S.ex.x || "").trim(), ry = String(S.ex.y || "").trim();
      var px = rx ? lnParse(rx) : null, py = ry ? lnParse(ry) : null;
      if (px && px.err) return { ok:false, msg:M.err };
      if (px && !(px.v > 0)) return { ok:false, msg:M.pos };
      if (px && near(px.v, 1)) return { ok:false, msg:M.x1 };
      if (!px || !py) return { ok:false, msg:M.blank };
      if (py.err) return { ok:false, msg:M.err };
      var xOk = near(px.v, IE), yv = Math.exp(-IE);
      if (xOk && near(py.v, IE)) return { ok:false, msg:M.yx };
      if (xOk && near(py.v, 1)) return { ok:false, msg:M.y1 };
      if (xOk && near(py.v, yv)) return (px.dec || py.dec) ? { ok:false, msg:M.approx } : { ok:true };
      if ((px.dec || py.dec) && Math.abs(px.v - IE) < 0.01 && Math.abs(py.v - yv) < 0.01) return { ok:false, msg:M.approx };
      if (!xOk) return { ok:false, msg:tpl(M.xgen, [fx(FN.F1.d(px.v), 2)]) };
      return { ok:false, msg:M.ygen };
    }
    return { ok:false };
  }

  // ---- predictions ----
  function fin(done){ stop = null; tanA = 1; lock(false); api.save(); refresh(); MV.changed(); done(); }
  function pause(ms, cb){ MV.wait(MV.reduceMotion ? 0 : ms, cb); }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        clearShow(); mfb = null; splitNote = false; tanA = 0;
        S.mode = "graph";
        if (p.id === "p1") { S.fn = "F1"; S.xs.F1 = 0.2; }
        else if (p.id === "p2") { S.fn = "F1"; S.xs.F1 = 2; ov = "p2"; }
        else if (p.id === "p3") { S.fn = "F2"; S.xs.F2 = HP; }
        else { S.fn = "F4"; S.xs.F4 = 0; }
        busy = true; refresh(); lock(true); busy = true;
      },
      run:function(p, done){
        reveal = true; busy = true;
        function grow(cb){ stop = MV.tween({ dur:900, step:function(t){ tanA = t; drawG(); }, done:function(){ tanA = 1; drawG(); cb(); } }); }
        if (p.id === "p1") {
          grow(function(){
            stop = MV.tween({ dur:1600, step:function(t){ S.xs.F1 = r9(0.2 + (IE - 0.2) * t); paintRead(); drawG(); }, done:function(){
              S.xs.F1 = IE; mark = { x:IE, y:FN.F1.f(IE), text:"slope 0 at x = 1/e ≈ 0.37", dy:28, ring:true }; paintRead(); drawG();
              pause(1100, function(){
                stop = MV.tween({ dur:1200, step:function(t){ S.xs.F1 = r9(IE + (0.9 - IE) * t); paintRead(); drawG(); }, done:function(){ S.xs.F1 = 0.9; fin(done); } });
              });
            } });
          });
        } else if (p.id === "p2") {
          tanA = 0; stop = MV.tween({ dur:1300, step:function(t){ tanA = t; drawG(); }, done:function(){ tanA = 1; drawG(); pause(900, function(){ fin(done); }); } });
        } else if (p.id === "p3") {
          grow(function(){ ov = "p3"; mark = { x:HP, y:HP, text:"slope 1: parallel to y = x", dx:14, dy:30, align:"left" }; drawG(); pause(1200, function(){ fin(done); }); });
        } else {
          grow(function(){ mark = { x:0, y:-8, text:"falling: slope −4", dx:14, dy:26, align:"left" }; drawG(); pause(1200, function(){ fin(done); }); });
        }
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Which method? (the toolkit's K12 tap-to-sort grid; domain note; "Check it with algebra" with an
// N13 step-through of the two routes) ----------
// @component N13 stationStepper (after MCV4U 13 / 25: a step-through that writes two routes line by line, side by side)
function part3(host, api){
  var S = api.S, C = api.content, A = C.alg, n = A.rows.length;
  host.innerHTML = '<div class="part ld-p3"><h3>' + C.sort.title + '</h3><div class="ld-sort"></div><p class="ld-dom">' + C.domain + "</p></div>" +
    '<details class="alg ld-alg"><summary>' + A.title + "</summary><p>" + A.text + '</p><div class="ld-routes">' +
    '<div class="ld-route"><h4>' + A.left + '</h4><ol class="ld-rl" data-r="0" aria-live="polite"></ol></div>' +
    '<div class="ld-route"><h4>' + A.right + '</h4><ol class="ld-rl" data-r="1" aria-live="polite"></ol></div></div>' +
    '<div class="ld-apl"></div><div class="ld-aend" aria-live="polite"></div></details>';
  MV.activityTypes.sorter($(".ld-sort", host), C.sort);
  var saved = clamp(S.alg | 0, 0, n);
  MV.player($(".ld-apl", host), { count:n + 1, interval:1500,
    label:function(i){ return i ? tpl(A.step, [i]) : A.startLine; },
    render:function(i){
      S.alg = i; api.save();
      $$(".ld-rl", host).forEach(function(ol){ var r = +ol.dataset.r; ol.innerHTML = A.rows.slice(0, i).map(function(row, j){ return '<li class="' + (j === i - 1 ? "cur" : "") + '">' + row[r] + "</li>"; }).join(""); });
      $(".ld-aend", host).innerHTML = i >= n ? MV.fbHTML("good", "<strong>✓</strong> " + A.end) : "";
    } }).go(saved);
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Slopes and rates ----------
// @component V8 designBoxes (copied from MCV4U 27 / 25, trimmed: single values; adds a unit after the box and strips a typed "%")
// — labelled answer boxes per item, values typed exactly through V8 lnExact; named wrong states ({k, eq}); a "give the exact
// value" message for decimals close to the answer; first-try scoring and three-level help.
function ratesAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q ld-dq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="ld-din"></div><div class="ld-dcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .ld-din', host);
    var h = '<div class="ld-dt">' + it.boxes.map(function(b){
      return '<div class="ld-dr"><span class="ld-dl">' + b.pre + "</span>" + boxHTML(b.k, x.v[b.k], MV.plain(b.pre || "") || "answer", "", x.solved) + (b.unit ? '<span class="ld-unit">' + b.unit + "</span>" : "") + "</div>";
    }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .ld-dcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, decs = false, i;
    for (i = 0; i < it.boxes.length; i++) {
      var b = it.boxes[i], r = String(x.v[b.k] || "").trim();
      if (b.unit) r = r.replace(/%/g, "").trim();
      if (!r) return { err:TX.fill };
      var p = lnParse(r);
      if (p.err) return { err:p.err === "lnneg" ? TX.lnneg : TX.err };
      if (p.dec) decs = true;
      vals[b.k] = p.v;
    }
    var keys = Object.keys(ans);
    if (keys.every(function(k){ return near(vals[k], ans[k]); })) return { ok:true };
    var Wr = it.wrong || [];
    for (i = 0; i < Wr.length; i++) if (near(vals[Wr[i].k], Wr[i].eq)) return { msg:Wr[i].fb };
    if (decs && keys.every(function(k){ return near(vals[k], ans[k], 0.01); })) return { exact:true };
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
// @component ratioDial (adapted from MCV4U 26: any symmetric range with labelled whole-number ticks and a highlighted 0 tick)
// — an SVG half-dial for a ratio (here y′/y) from −max (left) through 0 (up) to max (right); values beyond the range pin at the
// end. var d = ratioDial(host, {max, labels:[v…], zero:"flat", aria}); d.set(v, text)
function ratioDial(host, o){
  var CX = 120, CY = 118, R = 90, MAXV = o.max;
  function ang(v){ return Math.PI / 2 - clamp(v, -MAXV, MAXV) / MAXV * Math.PI / 2; }
  function pt(r, v){ var a = ang(v); return [CX + r * Math.cos(a), CY - r * Math.sin(a)]; }
  function f1(v){ return Math.round(v * 10) / 10; }
  var h = '<svg class="ld-dial" viewBox="0 0 240 142" role="img" aria-label="' + MV.esc(o.aria) + '"><path class="ld-dtrack" d="M' + (CX - R) + " " + CY + " A" + R + " " + R + " 0 0 1 " + (CX + R) + " " + CY + '"/>';
  for (var v = -MAXV; v <= MAXV + 1e-9; v += 0.5) { var a = pt(R - 7, v), b = pt(R + 3, v); h += '<line class="ld-dtk" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/>'; }
  o.labels.forEach(function(q){
    var a = pt(R - 12, q), b = pt(R + 6, q), l = pt(R + 16, q);
    h += '<line class="' + (q === 0 ? "ld-dtk0" : "ld-dtkL") + '" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/><text class="ld-dtl" x="' + f1(l[0]) + '" y="' + f1(l[1]) + '">' + String(q).replace("-", MINUS) + (q === 0 ? ": " + o.zero : "") + "</text>";
  });
  h += '<line class="ld-dneedle" x1="' + CX + '" y1="' + CY + '" x2="' + CX + '" y2="' + (CY - R + 14) + '"/><circle class="ld-dhub" cx="' + CX + '" cy="' + CY + '" r="6"/></svg>';
  host.innerHTML = h;
  var svg = $("svg", host), nd = $(".ld-dneedle", svg);
  return { set:function(v, text){
    var tip = pt(R - 14, v); nd.setAttribute("x2", f1(tip[0])); nd.setAttribute("y2", f1(tip[1]));
    nd.setAttribute("class", "ld-dneedle" + (Math.abs(v) < 1e-12 ? " zero" : ""));
    svg.setAttribute("aria-label", o.aria + ": " + text + ".");
  } };
}

// =====================================================================================================================
// ---------- Performance task: Flat at x = 1, y = (x + 1)^a (x − 2)^b / (x − 4)^c ----------
var task = (function(){
  var api, plot, dial;
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim(), v = Number(t); return t !== "" && Number.isInteger(v) && v >= 1 && v <= 6 ? v : null; }
  function read(){ var a = gi("a"), b = gi("b"), c = gi("c"); return { a:a, b:b, c:c, valid:a !== null && b !== null && c !== null }; }
  function ratio(D){ return Q.add(Q.sub(Q.of(D.a, 2), Q.of(D.b)), Q.of(D.c, 3)); }
  function checks(D){
    if (!D.valid) return [false, false, false];
    return [ratio(D).n === 0, (D.b + D.c) % 2 === 1, D.a + D.b <= 10];
  }
  function preview(){
    var D = read(), L = api.content.labels, rd = $("#fx-read"), pen = css("--pen"), ink = css("--ink");
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + L.invalid + "</p>";
      plot.draw({ view:{ xmin:-3.2, xmax:6.2, ymin:-2, ymax:2 }, xLabel:"x", yLabel:"y", asymptotes:[{ x:4 }], describe:"Empty graph: choose a, b and c." });
      if (dial) dial.set(0, "no design yet");
      return;
    }
    var a = D.a, b = D.b, c = D.c, f = function(x){ return Math.pow(x + 1, a) * Math.pow(x - 2, b) / Math.pow(x - 4, c); };
    var R = ratio(D), y1 = Q.of((b % 2 ? -1 : 1) * Math.pow(2, a) * (c % 2 ? -1 : 1), Math.pow(3, c)), y1v = Q.val(y1), s1 = y1v * Q.val(R), flat = R.n === 0;
    var rows = [[L.fRow, m("{(x + 1)^" + a + "(x - 2)^" + b + "}/{(x - 4)^" + c + "}")],
      [L.ypy, m(a + "/2 - " + b + " + " + c + "/3 = " + Q.txt(R)) + " (" + (flat ? L.flat : L.notFlat) + ")"],
      [L.y1, m(Q.txt(y1)) + " (" + (y1v < 0 ? L.below : L.above) + ")"], [L.deg, m(a + " + " + b + " = " + (a + b))]];
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
    if (dial) dial.set(Q.val(R), "y′/y at x = 1 is " + Q.txt(R) + (flat ? ", a horizontal tangent" : ""));
    var hi = Math.abs(y1v) * 1.6;
    for (var i = 0; i <= 80; i++) { var t = -0.5 + 2.8 * i / 80, v = Math.abs(f(t)); if (isFinite(v)) hi = Math.max(hi, v * 1.25); }
    hi = Math.max(hi, 0.05);
    plot.draw({ view:{ xmin:-3.2, xmax:6.2, ymin:-hi, ymax:hi }, xLabel:"x", yLabel:"y", asymptotes:[{ x:4 }],
      curves:[{ f:f, color:pen, width:3, domain:[-3, 6] }],
      points:[{ x:1, y:y1v, r:6, color:ink, ring:true }],
      after:function(ctx, pl){
        drawTan(ctx, pl, 1, y1v, s1, ink, 2.2, pl.W * 0.16);
        bgText(ctx, flat ? "y′(1) = 0" : "y′(1) ≈ " + fx(s1, 2), pl.X(1) + 12, pl.Y(y1v) + (y1v < 0 ? 24 : -24), "left", ink, ui(12, 700));
        bgText(ctx, "x = 4", pl.X(4) + 6, 14, "left", css("--ink-2"), mfont(13));
      },
      describe:"Graph of y = (x + 1)^" + a + "(x − 2)^" + b + "/(x − 4)^" + c + " for x from −3 to 6 with the asymptote x = 4. At x = 1, y = " + Q.txt(y1) + " and the tangent " + (flat ? "is horizontal." : "has slope about " + fx(s1, 2) + ".") });
  }
  function stepper(k){
    var L = api.content.labels;
    return '<div class="fx-step"><label for="fx-' + k + '"><span class="m">' + L[k] + '</span> <span class="tiny muted">' + L.range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="fx' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="fx-' + k + '" data-tk="' + k + '" type="number" min="1" max="6" step="1" inputmode="numeric" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="fx' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (a.S.a == null) { a.S.a = "1"; a.S.b = "1"; a.S.c = "1"; }
      inp.innerHTML = '<div class="fx-in"><p class="tiny" style="font-weight:700;margin:0">' + m("y = {(x + 1)^a(x - 2)^b}/{(x - 4)^c}") + "</p>" + stepper("a") + stepper("b") + stepper("c") + "</div>";
      pv.innerHTML = '<div id="fx-read" aria-live="polite"></div><p class="tiny fx-gh">' + L.meter + '</p><div class="fx-dial" id="fx-dial"></div><p class="tiny fx-gh">' + L.graph + '</p><div class="plot-wrap"><canvas class="plot" id="fx-plot" role="img" aria-label="Graph of y"></canvas></div>';
      dial = ratioDial($("#fx-dial"), { max:4, labels:[-4, -2, 0, 2, 4], zero:"flat", aria:"Meter for y′/y at x = 1" });
      plot = new MV.Plot($("#fx-plot"), { xmin:-3.2, xmax:6.2, ymin:-2, ymax:2 }); plot.render = preview;
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]), 10); if (!isFinite(cur)) cur = 1;
        a.S[k] = String(clamp(cur + +b.dataset.dir, 1, 6)); $("#fx-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : api.content.labels.invalid; },
    checks:checks,
    key:function(D){ return D.a + "|" + D.b + "|" + D.c; },
    label:function(k){ return m("(a, b, c) = (" + k.split("|").join(", ") + ")"); },
    text:function(k){ return "(a, b, c) = (" + k.split("|").join(", ") + ")"; }
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
