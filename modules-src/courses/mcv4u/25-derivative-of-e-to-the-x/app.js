// MCV4U 25 Derivatives of Exponential Functions, y = eˣ: hero (2ˣ and its slope graph, base 3, then the curves merge at e),
// Find the special base (Explore: V5 slope tool on shared axes with Slope graph / Ratio / Match modes, a brown base slider
// with nudges and "Set to e", V8 exact boxes for challenges 2 and 3), eˣ and ln (Part 3: N13 mirror stepper, undo chips and
// V8 solve boxes, the chain rule measured), Tangents and rates (Practice 2, V8 boxes with e) and the "Peak designer" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol) * Math.max(1, Math.abs(b)); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
// placeholders #1, #2 (they survive backtick math, unlike {x})
function tpl(s, a){ return String(s).replace(/#(\d)/g, function(_, k){ return a[k - 1] != null ? a[k - 1] : "#" + k; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
// fixed decimals with a true minus ("0.693", "1.0006", "−0.693")
function fx(v, dp){ var s = (Math.abs(v) < 0.5 * Math.pow(10, -dp) ? 0 : v).toFixed(dp); return s.replace("-", MINUS); }
// value to dp decimals, "≈ " in front when rounding changed it
function dec(v, dp){ var p = Math.pow(10, dp), r = Math.round(v * p) / p; return (Math.abs(v - r) > 1e-9 ? "≈ " : "") + num(v, dp); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
// numerical slope: symmetric difference quotient, h = 0.0001 (plan build notes)
var H = 1e-4;
function slopeAt(f, x){ return (f(x + H) - f(x - H)) / (2 * H); }
function expF(a){ return function(x){ return Math.pow(a, x); }; }
function kOf(a){ return slopeAt(expF(a), 0); }

// =====================================================================================================================
// @component V8 eNumber — exact numbers typed with e for V8 boxes: 3, −2/3, 0.5, e, 2e, e/2, 1/e, e^-1, e^(−2), 4e^-2,
// 4/e², (1/2)e. Returns {v, dec (a decimal point was typed), e (e was used)} or null. No variables, no free algebra.
var SUPD = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "⁻":"-" };
function eNum(raw){
  var s = String(raw == null ? "" : raw).trim().replace(/[−–]/g, "-").replace(/\s+/g, "").replace(/[·×]/g, "*")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function(t){ return "^(" + t.split("").map(function(c){ return SUPD[c]; }).join("") + ")"; });
  if (!s) return null;
  var i = 0, decUsed = false, eUsed = false;
  function pk(){ return s[i]; }
  function expr(){ var v = term(); while (pk() === "+" || pk() === "-") { var o = s[i++], w = term(); v = o === "+" ? v + w : v - w; } return v; }
  function term(){ var v = un(); while (pk() === "*" || pk() === "/" || pk() === "(" || pk() === "e") { var o = s[i]; if (o === "*" || o === "/") i++; else o = "*"; var w = un(); v = o === "/" ? v / w : v * w; } return v; }
  function un(){ if (pk() === "-") { i++; return -un(); } if (pk() === "+") { i++; return un(); } return pw(); }
  function pw(){ var v = at(); if (pk() === "^") { i++; v = Math.pow(v, un()); } return v; }
  function at(){
    var c = pk();
    if (c === "(" || c === "{") { i++; var v = expr(); if (pk() !== ")" && pk() !== "}") throw 0; i++; return v; }
    if (c === "e") { i++; eUsed = true; return Math.E; }
    var mm = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)); if (!mm) throw 0;
    if (mm[0].indexOf(".") >= 0) decUsed = true;
    i += mm[0].length; return parseFloat(mm[0]);
  }
  try { var v = expr(); if (i !== s.length || !isFinite(v)) return null; return { v:v, dec:decUsed, e:eUsed }; } catch (err) { return null; }
}
function eList(raw){
  var parts = String(raw || "").split(/[,;]|\bor\b|\band\b/).map(function(t){ return t.replace(/^\s*[a-z]\s*=\s*/i, "").trim(); }).filter(Boolean);
  if (!parts.length) return null;
  var out = [];
  for (var k = 0; k < parts.length; k++) { var r = eNum(parts[k]); if (!r) return null; if (!out.some(function(u){ return near(u.v, r.v); })) out.push(r); }
  return out;
}
// ------------------------------------------------- end of V8 eNumber -------------------------------------------------------

function boxHTML(k, val, label, cls, dis){
  return '<input class="numin short' + (cls ? " " + cls : "") + '" data-bx="' + k + '" data-k="bx' + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(val || "") + '"' + (dis ? " disabled" : "") + ">";
}
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}

// ---------- hero: 2ˣ and its slope graph (× 0.69), base 3 (× 1.10), then the curves merge at e and a tangent flashes ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var V = { xmin:-3, xmax:2.4, ymin:-0.8, ymax:8.6 }, pl = new MV.Plot(cv, V);
  var st = { a:2, end:-3, dEnd:-3, tan:0, merged:false, cap:"" };
  function draw(){
    var a = st.a, F = expF(a), k = Math.log(a), D = function(x){ return k * F(x); };
    var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink");
    var sc = { view:V, xLabel:"x", yLabel:"y", curves:[], lines:[], points:[], labels:[] };
    if (st.dEnd > -3) sc.curves.push({ f:D, color:f3, width:st.merged ? 7 : 2.6, domain:[-3, st.dEnd] });
    if (st.end > -3) sc.curves.push({ f:F, color:pen, width:3, domain:[-3, st.end] });
    if (st.tan > 0) {
      sc.lines.push({ p:[1, Math.E], q:[2, 2 * Math.E], color:ink, width:2.2 });
      sc.points.push({ x:1, y:Math.E, r:6, color:ink });
    }
    sc.after = function(ctx, p){
      if (st.dEnd > 1.2 && !st.merged) {
        var X = p.X(1.6), y1 = F(1.6), y2 = D(1.6);
        ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.fillStyle = css("--ink-2"); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(X, p.Y(y1)); ctx.lineTo(X, p.Y(y2)); ctx.stroke();
        var dir = y2 < y1 ? 1 : -1, Y2 = p.Y(y2); ctx.beginPath(); ctx.moveTo(X, Y2); ctx.lineTo(X - 5, Y2 - dir * 9); ctx.lineTo(X + 5, Y2 - dir * 9); ctx.closePath(); ctx.fill(); ctx.restore();
        bgText(ctx, "× " + fx(k, 2), X + 10, p.Y((y1 + y2) / 2), "left", ink, ui(15, 700));
      }
      if (st.end > 1.8) bgText(ctx, st.merged ? "y = eˣ = its own derivative" : "y = " + (Math.abs(a - 2) < 1e-6 ? "2" : Math.abs(a - 3) < 1e-6 ? "3" : fx(a, 2)) + "ˣ", p.X(-2.8), p.Y(st.merged ? 7.6 : 7.6), "left", pen, mfont(16));
      if (st.dEnd > 1.8 && !st.merged) bgText(ctx, "slope graph", p.X(-2.8), p.Y(6.5), "left", f3, ui(14, 700));
      if (st.tan > 0) { ctx.save(); ctx.globalAlpha = st.tan; bgText(ctx, "slope e at (1, e)", p.X(1) + 12, p.Y(Math.E) + 18, "left", ink, ui(13, 700)); ctx.restore(); }
    };
    sc.describe = st.merged ? "Graph of y = eˣ. Its slope graph lies exactly on top of it: eˣ is its own derivative." + (st.tan > 0 ? " The tangent at (1, e) has slope e." : "")
      : "Graph of y = " + fx(a, 2) + "ˣ in blue and its slope graph in teal, " + fx(k, 2) + " times as tall at every x.";
    pl.draw(sc);
    if (f.cap) f.cap.innerHTML = st.cap;
  }
  pl.render = draw;
  function finalFrame(){ st.a = Math.E; st.end = 2.4; st.dEnd = 2.4; st.merged = true; st.tan = 1; st.cap = "Base `e` ≈ 2.718: the slope graph lands on the curve, and at " + m("(1, e)") + " the tangent has slope " + m("e") + "."; st.cap = MV.md(st.cap); draw(); }
  if (MV.reduceMotion) { finalFrame(); return; }
  var lin = function(t){ return t; };
  st.cap = m("y = 2^x") + " and its slope graph: every slope is about 0.69 times the height."; draw();
  MV.wait(400, function(){
    MV.tween({ dur:1400, ease:lin, step:function(t){ st.end = -3 + 5.4 * t; draw(); }, done:function(){
      MV.tween({ dur:1400, ease:lin, step:function(t){ st.dEnd = -3 + 5.4 * t; draw(); }, done:function(){
        MV.wait(900, function(){
          st.cap = "Base 3: now the slope graph rises above the curve (× 1.10).";
          MV.tween({ dur:1600, step:function(t){ st.a = 2 + t; draw(); }, done:function(){
            MV.wait(1000, function(){
              st.cap = "Slide the base back down …";
              MV.tween({ dur:1800, step:function(t){ st.a = 3 + (Math.E - 3) * t; draw(); }, done:function(){
                st.a = Math.E; st.merged = true; st.cap = MV.md("At `e` ≈ 2.718 the two curves merge: `y = e^x` is its own derivative."); draw();
                MV.wait(900, function(){
                  MV.tween({ dur:1500, ease:lin, step:function(t){ st.tan = 0.5 + 0.5 * Math.cos(t * Math.PI * 5); draw(); }, done:finalFrame });
                });
              } });
            });
          } });
        });
      } });
    } });
  });
}

// =====================================================================================================================
// ---------- Explore: Find the special base ----------
// @component V5 derivativePanels (adapted from MCV4U 07: one shared-axes panel for a family y = aˣ) — f in --pen, the slope
// graph in --f3 (Trail mode: visited probe keys x·10 joined into runs; Match mode: the whole curve), the tangent in --ink with
// "slope ≈ …", a stretch arrow "× k" between the curves at the probe, and (x, f′(x)) dots. Slopes are numerical (h = 0.0001).
var XV = { xmin:-3.3, xmax:2.3, ymin:-4, ymax:9 };
function runs(keys){
  var s = keys.slice().sort(function(a, b){ return a - b; }), out = [];
  s.forEach(function(k){ var r = out[out.length - 1]; if (r && k === r[1] + 1) r[1] = k; else if (!r || k !== r[1]) out.push([k, k]); });
  return out;
}
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (typeof S.a !== "number" || !(S.a >= 0.2 && S.a <= 8)) { S.a = 2; S.isE = false; }
  if (typeof S.x !== "number" || !(S.x >= -3 && S.x <= 2)) S.x = 1;
  if (["slope", "ratio", "match"].indexOf(S.mode) < 0) S.mode = "slope";
  if (!Array.isArray(S.trail)) S.trail = [];
  S.e2 = S.e2 || { c:"", r:"" }; S.e3 = S.e3 || { c:"", p:"" };
  var busy = false, mark = null, rowsN = 5, lastA = S.a, stop = null;
  host.innerHTML = '<div class="ee-ex"><div class="ee-main" data-mv="graph"><p class="eq-cap ee-eq" id="ee-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot ee-plot" id="ee-plot" role="img" aria-label="Graph of y = a to the x and its slope graph"></canvas></div>' +
    '<p class="tiny muted ee-key">' + T.key + '</p><div id="ee-panel"></div></div>' +
    '<div class="ee-side"><div class="seg-wrap" id="ee-mode"></div><p class="tiny muted ee-how" id="ee-how"></p>' +
    '<div class="ee-base"><label class="slider ee-sl"><span class="slider-top"><span>' + T.base + '</span><output id="ee-aout" class="ee-bout"></output></span>' +
    '<input type="range" id="ee-a" min="0.2" max="8" step="0.001" style="accent-color:var(--p-b)" aria-label="Base a"></label>' +
    '<div class="ee-nudge" role="group" aria-label="Nudge the base">' + [-0.01, -0.001, 0.001, 0.01].map(function(d){
      return '<button type="button" class="btn ghost sm" data-nudge="' + d + '" data-k="nd' + d + '" aria-label="' + (d < 0 ? "Decrease" : "Increase") + " the base by " + Math.abs(d) + '">' + (d < 0 ? MINUS : "+") + Math.abs(d) + "</button>"; }).join("") +
    '<button type="button" class="btn sm ee-ebtn" data-act="sete" data-k="sete">' + T.setE + '</button></div><p class="tiny muted ee-note">' + T.baseNote + "</p></div>" +
    '<label class="slider ee-sl"><span class="slider-top"><span>' + T.probe + '</span><output id="ee-xout"></output></span>' +
    '<input type="range" id="ee-x" min="-3" max="2" step="0.1" style="accent-color:var(--ink)" aria-label="Probe x"></label><p class="tiny muted ee-note">' + T.probeNote + "</p>" +
    '<dl class="read ee-read" id="ee-read" aria-live="polite"></dl>' +
    '<div class="ee-exact"><p class="ee-exh">' + T.exact + '</p><p class="tiny muted">' + T.exactHow + "</p>" +
    '<div class="ee-frow"><span class="ee-fl">' + T.x2 + "</span>" + boxHTML("e2c", S.e2.c, "Challenge 2: number in front of ln") + '<span class="ee-ln">' + T.lnBox + "</span>" + boxHTML("e2r", S.e2.r, "Challenge 2: number after ln") + "</div>" +
    '<div class="ee-frow"><span class="ee-fl">' + T.a3 + "</span>" + boxHTML("e3c", S.e3.c, "Challenge 3: number in front of e") + '<span class="ee-e">' + T.eBox + '</span><span class="ee-sup">' + boxHTML("e3p", S.e3.p, "Challenge 3: power of e", "ee-pow") + "</span></div></div></div></div>";
  var plot = new MV.Plot($("#ee-plot", host), XV);
  plot.render = draw;
  var slA = $("#ee-a", host), slX = $("#ee-x", host);

  function F(){ return expF(S.a); }
  function D(){ var f = F(); return function(x){ return slopeAt(f, x); }; }
  function baseTxt(){ return S.isE ? "e" : num(S.a, 3); }
  function baseSrc(){ return S.isE ? "e" : "@b{" + (S.a < 1 ? "(" + num(S.a, 3) + ")" : num(S.a, 3)) + "}"; }
  function addKeys(a, b){ var lo = Math.round(Math.min(a, b) * 10), hi = Math.round(Math.max(a, b) * 10); for (var k = lo; k <= hi; k++) if (S.trail.indexOf(k) < 0) S.trail.push(k); }
  function kDp(){ return S.mode === "match" ? 4 : 3; }
  function describe(){
    var k = kOf(S.a), f = MV.plain(m("y = " + (S.isE ? "e" : num(S.a, 3)) + "^x")), ka = fx(Math.abs(k), 3), h;
    if (Math.abs(k - 1) < 0.0005) h = "its slope graph lies on top of it: slope = height at every x";
    else if (k < 0) h = "its slope graph is flipped below the x-axis, " + ka + " times as tall at every x";
    else h = "its slope graph, about " + ka + " times as tall at every x";
    var extra = S.mode === "slope" ? (S.trail.length ? " The slope graph is traced from x = " + num(Math.min.apply(null, S.trail) / 10, 1) + " to " + num(Math.max.apply(null, S.trail) / 10, 1) + "." : "") :
      S.mode === "ratio" ? " Dots mark x = −2, −1, 0, 1 and 2." : "";
    return "Graph of " + f + " and " + h + "." + extra + " Probe at x = " + num(S.x, 1) + ": height " + num(F()(S.x), 3) + ", slope " + num(D()(S.x), 3) + ".";
  }
  function draw(){
    var f = F(), d = D(), k = kOf(S.a), x = S.x, y = f(x), s = d(x);
    var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2"), close = Math.abs(k - 1) < 0.02;
    var sc = { view:XV, xLabel:"x", yLabel:"y", curves:[], lines:[], points:[], labels:[] };
    var showD = S.mode === "match" || (S.mode === "slope" && S.trail.indexOf(Math.round(x * 10)) >= 0) || S.mode === "ratio";
    if (S.mode === "match") sc.curves.push({ f:d, color:f3, width:close ? 7 : 2.6 });
    else if (S.mode === "slope") runs(S.trail).forEach(function(r){
      if (r[0] === r[1]) sc.points.push({ x:r[0] / 10, y:d(r[0] / 10), r:3.2, color:f3 });
      else sc.curves.push({ f:d, color:f3, width:close ? 7 : 2.6, domain:[r[0] / 10, r[1] / 10] });
    });
    sc.curves.push({ f:f, color:pen, width:3 });
    if (S.mode === "ratio") [-2, -1, 0, 1, 2].forEach(function(t, i){ if (i < rowsN) { sc.points.push({ x:t, y:f(t), r:4.5, color:pen }); sc.points.push({ x:t, y:d(t), r:4.5, color:f3 }); } });
    sc.lines.push({ p:[x, y], q:[x + 1, y + s], color:ink, width:2 });
    sc.points.push({ x:x, y:y, r:6.5, color:ink, ring:true });
    if (showD) sc.points.push({ x:x, y:s, r:5.5, color:f3 });
    sc.after = function(ctx, p){
      var X = p.X(x), Yf = p.Y(clamp(y, XV.ymin, XV.ymax)), Yd = p.Y(clamp(s, XV.ymin, XV.ymax)), right = x > 0.3;
      // stretch arrow between the curves at the probe
      if (showD && Math.abs(Yf - Yd) > 14) {
        ctx.save(); ctx.strokeStyle = ink2; ctx.fillStyle = ink2; ctx.lineWidth = 1.8; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(X, Yf); ctx.lineTo(X, Yd); ctx.stroke(); ctx.setLineDash([]);
        var dir = Yd > Yf ? 1 : -1; ctx.beginPath(); ctx.moveTo(X, Yd - dir * 5); ctx.lineTo(X - 5, Yd - dir * 14); ctx.lineTo(X + 5, Yd - dir * 14); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      function yc(Y){ return clamp(Y, 16, p.H - 16); }
      // "× k" beside the arrow (below the lower point when the arrow is short), "slope ≈ …" above the higher point
      if (showD) bgText(ctx, "× " + fx(k, 3), X + (right ? -12 : 12), yc(Math.abs(Yf - Yd) > 48 ? (Yf + Yd) / 2 : Math.max(Yf, Yd) + 24), right ? "right" : "left", ink, ui(14, 700));
      bgText(ctx, "slope ≈ " + fx(s, 3), X + (right ? -14 : 14), yc(Math.min(Yf, showD ? Yd : Yf) - 24), right ? "right" : "left", ink, ui(13, 700));
      // curve names where each curve is about 5 (or −3) units high, so they sit inside the window
      function at(g, target){ var best = 2.1, bd = Infinity; for (var t = -2.9; t <= 2.1; t += 0.05) { var v = Math.abs(g(t) - target); if (v < bd) { bd = v; best = t; } } return best; }
      var xr = at(f, 5);
      bgText(ctx, "f", p.X(xr) - 10, yc(p.Y(f(xr))), "right", pen, mfont(17));
      if (S.mode !== "ratio" && (S.mode === "match" || S.trail.length > 1)) {
        var xd = at(d, k < 0 ? -3 : 3);
        if (S.mode === "match" || S.trail.indexOf(Math.round(xd * 10)) >= 0) bgText(ctx, "f′", p.X(xd) + 10, yc(p.Y(d(xd))), "left", f3, mfont(17));
      }
      if (mark) bgText(ctx, mark.text, p.X(mark.x), p.Y(mark.y), mark.align || "center", ink, ui(14, 700));
    };
    sc.describe = describe();
    plot.draw(sc);
  }
  function matchTxt(k){
    if (Math.abs(k - 1) < 0.0005) return T.matches;
    if (k < 0) return T.under;
    return k < 1 ? T.below : T.above;
  }
  function derivTxt(k){
    var ka = fx(Math.abs(k), 3);
    if (Math.abs(k - 1) < 0.0005) return T.equal;
    if (k < 0) return tpl(T.flip, [ka, Math.abs(k) > 1 ? T.flipS : T.flipC]);
    return tpl(k > 1 ? T.stretch : T.comp, [ka]);
  }
  function paintRead(){
    var f = F(), x = S.x, y = f(x), s = D()(x), k = kOf(S.a), xs = num(x, 1);
    var rows = [
      [T.rows.fn, m("y = " + baseSrc() + "^x")],
      [T.rows.probe, m("f(" + xs + ")") + " " + (dec(y, 3).indexOf("≈") === 0 ? "" : "= ") + dec(y, 3) + ", slope ≈ " + fx(s, 3)],
      [T.rows.ratio, m("k") + " ≈ " + fx(k, kDp()) + ' <span class="tiny muted">(' + T.same + ")</span>"],
      [T.rows.deriv, (S.isE ? m("f′(x) = e^x") : m("f′(x) ≈ " + fx(k, 3).replace(MINUS, "-") + " · " + baseSrc() + "^x")) + '<br><span class="tiny">' + derivTxt(k) + "</span>"],
      [T.rows.match, matchTxt(k)]
    ];
    $("#ee-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintPanel(){
    var h = "", f = F(), d = D(), k = kOf(S.a);
    if (S.mode === "slope") {
      h = '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="all" data-k="eeall">' + T.showAll + '</button><button type="button" class="btn ghost sm" data-act="clear" data-k="eeclr"' + (S.trail.length > 1 ? "" : " disabled") + ">" + T.clear + "</button></div>";
    } else if (S.mode === "ratio") {
      var hi = [-2, -1, 0, 1, 2].indexOf(Math.round(S.x * 10) / 10);
      h = '<div class="ee-tbl">' + MV.tableHTML({ head:T.tHead, caption:T.tableCap, hiRow:hi, rows:[-2, -1, 0, 1, 2].map(function(t, i){
        if (i >= rowsN) return [num(t), "…", "…", "…"];
        return [num(t), dec(f(t), 3), fx(d(t), 3), fx(d(t) / f(t), 3)]; }) }) + "</div>";
    } else {
      var gap = Math.abs(k - 1), w1 = clamp(gap, 0, 1) * 100, w2 = clamp(gap / 0.01, 0, 1) * 100, ok = gap < 0.0005;
      h = '<div class="ee-gauge"><p class="ee-gh">' + T.gauge + "</p>" +
        '<div class="ee-grow"><div class="ee-bar" role="img" aria-label="Gap ' + fx(gap, 4) + ' on a scale from 0 to 1"><span style="width:' + w1.toFixed(1) + '%"></span></div><span class="tiny muted">' + T.coarse + "</span></div>" +
        '<div class="ee-grow"><div class="ee-bar ee-fine' + (ok ? " ok" : "") + '" role="img" aria-label="Gap ' + fx(gap, 4) + ' on a zoomed scale from 0 to 0.01"><span style="width:' + w2.toFixed(1) + '%"></span></div><span class="tiny muted">' + T.fine + "</span></div>" +
        '<p class="ee-gv">' + tpl(T.gap, [fx(gap, 4)]) + (ok ? ' <strong class="ee-ok">' + T.gaugeOk + "</strong>" : "") + "</p></div>";
    }
    MV.keepFocus($("#ee-panel", host), function(){ $("#ee-panel", host).innerHTML = h; });
  }
  function paintTop(){
    MV.keepFocus($("#ee-mode", host), function(){ $("#ee-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    $("#ee-how", host).innerHTML = C.modeHow[S.mode];
    $("#ee-eq", host).innerHTML = m("y = " + baseSrc() + "^x") + (S.isE ? ' <span class="tiny muted">(' + m("e") + " ≈ 2.718 …)</span>" : "");
  }
  function syncSl(){
    slA.value = S.a; $("#ee-aout", host).innerHTML = S.isE ? m("e") + " ≈ 2.718" : num(S.a, 3);
    slX.value = S.x; $("#ee-xout", host).textContent = num(S.x, 1);
  }
  function paintAll(){ paintTop(); syncSl(); paintRead(); paintPanel(); draw(); }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function setBase(v){ S.a = r9(clamp(v, 0.2, 8)); S.isE = false; lastA = S.a; }
  function setX(v, how){ var prev = S.x; S.x = r9(clamp(Math.round(v * 10) / 10, -3, 2)); if (S.mode === "slope") addKeys(how === "set" ? S.x : prev, S.x); }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b)) return;
    if (b.dataset.mode) { S.mode = b.dataset.mode; mark = null; if (S.mode === "slope") addKeys(S.x, S.x); changed(); return; }
    if (b.dataset.nudge) {
      var dd = +b.dataset.nudge, base = S.isE ? Math.round(S.a * 1000) / 1000 : S.a, v = r9(base + dd);
      if (near(v, 1, 1e-9)) v = r9(v + dd);
      setBase(v); mark = null; changed(); return;
    }
    var a = b.dataset.act;
    if (a === "sete") { S.a = Math.E; S.isE = true; lastA = S.a; mark = null; changed(); return; }
    if (a === "all") { addKeys(-3, 2); changed(); return; }
    if (a === "clear") { S.trail = []; addKeys(S.x, S.x); changed(); }
  });
  slA.addEventListener("input", function(){
    if (busy) return;
    var v = +slA.value;
    if (near(v, 1, 1e-9)) { v = v >= lastA ? 1.001 : 0.999; slA.value = v; }
    setBase(v); mark = null; changed();
  });
  slX.addEventListener("input", function(){ if (busy) return; setX(+slX.value); mark = null; changed(); });
  $("#ee-plot", host).addEventListener("pointerdown", function(e){
    if (busy || !plot.v) return;
    var r = e.target.getBoundingClientRect(); setX(plot.xOf(e.clientX - r.left)); mark = null; changed();
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.bx; if (!k) return;
    if (k === "e2c") S.e2.c = e.target.value; else if (k === "e2r") S.e2.r = e.target.value; else if (k === "e3c") S.e3.c = e.target.value; else if (k === "e3p") S.e3.p = e.target.value;
    api.save(); MV.changed();
  });
  if (S.mode === "slope") addKeys(S.x, S.x);
  paintAll();

  // ---- exact entries (V8): x = □ ln □ and a = □e^□ ----
  function val2(){
    var c = String(S.e2.c || "").trim(), r = String(S.e2.r || "").trim();
    if (!c && !r) return null;
    if (!r) { var p = eNum(c); return p ? { v:p.v, dec:p.dec } : { bad:true }; }
    var cv = c ? eNum(c) : { v:1, dec:false }, rv = eNum(r);
    if (!cv || !rv || rv.v <= 0) return { bad:true };
    return { v:cv.v * Math.log(rv.v), dec:cv.dec || rv.dec };
  }
  function val3(){
    var c = String(S.e3.c || "").trim(), p = String(S.e3.p || "").trim();
    if (!c && !p) return null;
    var cv = c ? eNum(c) : { v:1, dec:false }, pv = p ? eNum(p) : { v:1, dec:false };
    if (!cv || !pv) return { bad:true };
    return { v:cv.v * Math.exp(pv.v), dec:cv.dec || pv.dec };
  }
  function chal(id){
    var M = MS[id], a = S.a, k = kOf(a), v;
    if (id === "tc1") {
      if (Math.abs(k - 1) < 0.0005) return { ok:true };
      if (near(a, 2.7, 1e-6)) return { ok:false, msg:M.a27 };
      if (near(a, 2.72, 1e-6)) return { ok:false, msg:M.a272 };
      return { ok:false, msg:tpl(k < 1 ? M.low : M.high, [fx(k, 4)]) };
    }
    if (id === "tc2") {
      if (Math.abs(a - Math.E) > 0.0005) return { ok:false, msg:M.base };
      v = val2();
      var L5 = Math.log(5), probeOK = Math.abs(S.x - L5) <= 0.01 + 1e-9;
      if (v && !v.bad && near(v.v, 5)) return { ok:false, msg:M.x5 };
      if (v && !v.bad && near(v.v, 5 / Math.E)) return { ok:false, msg:M.x5e };
      if (!probeOK) return { ok:false, msg:M.probe };
      if (!v || v.bad) return { ok:false, msg:M.blank };
      if (near(v.v, L5) && !v.dec) return { ok:true };
      if (Math.abs(v.v - L5) < 0.01) return { ok:false, msg:M.approx };
      return { ok:false, msg:M.general };
    }
    if (id === "tc3") {
      var E2 = Math.exp(2), E2e = 2 * Math.E;
      v = val3();
      var vOK = v && !v.bad;
      if (Math.abs(a - E2) > 0.01 + 1e-9) {
        if (Math.abs(a - E2e) <= 0.01 || (vOK && near(v.v, E2e))) return { ok:false, msg:M.a2e };
        if (Math.abs(a - 2) <= 0.01 || (vOK && near(v.v, 2))) return { ok:false, msg:M.a2 };
        return { ok:false, msg:M.slider };
      }
      if (!vOK) return { ok:false, msg:M.blank };
      if (near(v.v, E2) && !v.dec) return { ok:true };
      if (near(v.v, E2e)) return { ok:false, msg:M.a2e };
      if (near(v.v, 2)) return { ok:false, msg:M.a2 };
      if (Math.abs(v.v - E2) < 0.01) return { ok:false, msg:M.approx };
      return { ok:false, msg:M.general };
    }
    return { ok:false };
  }

  // ---- predictions ----
  function sweep(a, b, dur, cb){ stop = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ setX(a + (b - a) * t); paintRead(); syncSl(); draw(); }, done:function(){ stop = null; if (cb) cb(); } }); }
  function baseTo(a, b, dur, cb){ stop = MV.tween({ dur:dur, step:function(t){ S.a = a + (b - a) * t; S.isE = false; syncSl(); paintRead(); paintPanel(); draw(); }, done:function(){ stop = null; if (cb) cb(); } }); }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; mark = null; rowsN = 5; S.isE = false;
        if (p.id === "p1") { S.a = 2; S.mode = "slope"; S.trail = []; S.x = -3; addKeys(-3, -3); }
        else if (p.id === "p2") { S.a = 3; S.mode = "ratio"; S.x = -2; rowsN = 0; }
        else if (p.id === "p3") { S.a = 2; S.mode = "match"; S.x = 0; }
        else { S.a = 0.5; S.mode = "slope"; S.trail = []; S.x = -3; addKeys(-3, -3); }
        lastA = S.a; paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; rowsN = 5; lastA = S.a; lock(false); api.save(); paintAll(); MV.changed(); done(); }
        function show(mk, cb){ mark = mk; draw(); MV.wait(1100, cb); }
        if (p.id === "p1") sweep(-3, 2, 3000, function(){ show({ x:-0.6, y:5.6, text:"every slope ≈ 0.693 × height" }, fin); });
        else if (p.id === "p2") {
          var step = function(){ if (rowsN >= 5) { show({ x:-0.6, y:7.6, text:"slope ÷ height ≈ 1.099 in every row" }, fin); return; } rowsN++; S.x = rowsN - 3; syncSl(); paintRead(); paintPanel(); draw(); MV.wait(550, step); };
          MV.wait(300, step);
        }
        else if (p.id === "p3") baseTo(2, 3, 1600, function(){ MV.wait(500, function(){ baseTo(3, Math.E, 1600, function(){ S.a = Math.E; S.isE = true; paintAll(); show({ x:-0.6, y:7.6, text:"k = 1 at a ≈ 2.718: the number e" }, fin); }); }); });
        else sweep(-3, 2, 3000, function(){ show({ x:-0.6, y:-2.6, text:"every slope ≈ −0.693 × height" }, fin); });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: eˣ and ln x, an inverse pair (@component N13 stationStepper: a step-through beside a tap-a-point graph) ----------
function part3(host, api){
  var S = api.S, C = api.content, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  S.u = S.u || {}; S.v = S.v || {}; S.vb = S.vb || {}; S.s3 = S.s3 || { meas:false, pred:null, ok:false, x:1 };
  var cur = 0, vMsg = {};
  host.innerHTML =
    '<div class="part ee-st" id="ee-s1"><h3>' + S1.title + "</h3><p>" + S1.text + '</p><div class="sym ee-stg"><div><div class="plot-wrap"><canvas class="plot square" id="ee-mir" role="img" aria-label="' + MV.esc(S1.graph) + '"></canvas></div></div>' +
    '<div><div id="ee-mpl"></div><p class="ee-pair" id="ee-pair" aria-live="polite"></p>' + MV.tableHTML({ head:S1.head, rows:S1.rows.map(function(r){ return ["<strong>" + r[0] + "</strong>", r[1], r[2]]; }), caption:"Domain and range of y = eˣ and y = ln x" }) +
    '<p class="tiny muted">' + S1.tableNote + '</p><details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + S1.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details></div></div></div>" +
    '<div class="part ee-st" id="ee-s2"><h3>' + S2.title + "</h3><p>" + S2.text + '</p><div class="ee-undo">' + S2.chips.map(function(u){
      return '<div class="ee-urow" data-u="' + u.id + '"><div class="ee-uex">' + u.ex + ' =</div><div class="chips" role="group" aria-label="Choose the simplified value"></div><div class="ee-ufb"></div></div>'; }).join("") +
    '</div><p class="ee-svh">' + S2.solveTitle + "</p>" + S2.solve.map(function(v){ return '<div class="ee-solve" data-v="' + v.id + '"><p class="ee-sq">' + v.eq + '</p><div class="ee-frame"></div><div class="ee-vcl"></div></div>'; }).join("") + "</div>" +
    '<div class="part ee-st" id="ee-s3"><h3>' + S3.title + "</h3><p>" + S3.text + '</p><div class="sym ee-stg"><div><div class="plot-wrap"><canvas class="plot square" id="ee-chn" role="img" aria-label="' + MV.esc(S3.graph) + '"></canvas></div></div><div id="ee-s3c"></div></div></div>';

  // ---- Station 1: the mirror ----
  var mp = new MV.Plot($("#ee-mir", host), { xmin:-2.5, xmax:4.6, ymin:-2.5, ymax:4.6 }, { equal:true });
  function drawMir(){
    var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2"), P = S1.pts[cur];
    var sc = { view:{ xmin:-2.5, xmax:4.6, ymin:-2.5, ymax:4.6 }, equal:true, xLabel:"x", yLabel:"y",
      lines:[{ p:[0, 0], q:[1, 1], color:ink2, width:1.6, dash:[2, 5] }],
      curves:[{ f:Math.exp, color:pen, width:3 }, { f:function(x){ return x > 0 ? Math.log(x) : NaN; }, color:f3, width:3, domain:[0.004, 5] }],
      segments:[{ x1:P.av, y1:P.bv, x2:P.bv, y2:P.av, color:ink2, width:1.8, dash:[5, 4] }], points:[], labels:[] };
    S1.pts.forEach(function(q, i){ if (i !== cur) { sc.points.push({ x:q.av, y:q.bv, r:4, color:pen }); sc.points.push({ x:q.bv, y:q.av, r:4, color:f3 }); } });
    sc.points.push({ x:P.av, y:P.bv, r:7, color:pen, ring:true }); sc.points.push({ x:P.bv, y:P.av, r:7, color:f3, ring:true });
    sc.after = function(ctx, p){
      function t(s){ return MV.plain(m(s)); }
      bgText(ctx, "(" + t(P.a) + ", " + t(P.b) + ")", p.X(P.av) - 12, p.Y(P.bv) - 4, "right", pen, ui(14, 700));
      bgText(ctx, "(" + t(P.b) + ", " + t(P.a) + ")", p.X(P.bv) + 12, p.Y(P.av) + 16, "left", f3, ui(14, 700));
      bgText(ctx, "y = eˣ", p.X(-2.3), p.Y(0.55), "left", pen, mfont(15));
      bgText(ctx, "y = ln x", p.X(3.2), p.Y(Math.log(3.2)) + 20, "center", f3, mfont(15));
      bgText(ctx, "y = x", p.X(4.2), p.Y(4.2) + 16, "right", ink2, mfont(14));
    };
    sc.describe = "y = eˣ (blue), y = ln x (teal) and the dotted line y = x. The point " + MV.plain(m("(" + P.a + ", " + P.b + ")")) + " on y = eˣ and its mirror image " + MV.plain(m("(" + P.b + ", " + P.a + ")")) + " on y = ln x, joined by a dashed segment across y = x.";
    mp.draw(sc);
  }
  mp.render = drawMir;
  var player = MV.player($("#ee-mpl", host), { count:S1.pts.length, interval:1800,
    label:function(i){ return "Point " + (i + 1) + " of " + S1.pts.length; },
    render:function(i){ cur = i; var P = S1.pts[i]; $("#ee-pair", host).innerHTML = tpl(S1.pair, [m(P.a), m(P.b)]); drawMir(); } });
  $("#ee-mir", host).addEventListener("pointerdown", function(e){
    if (!mp.v) return;
    var r = e.target.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, best = -1, bd = 900;
    S1.pts.forEach(function(q, i){ [[q.av, q.bv], [q.bv, q.av]].forEach(function(c){ var dx = mp.X(c[0]) - px, dy = mp.Y(c[1]) - py, d2 = dx * dx + dy * dy; if (d2 < bd) { bd = d2; best = i; } }); });
    if (best >= 0) player.go(best);
  });

  // ---- Station 2: the undo machine (chips) and V8 solve boxes ----
  function paintU(u){
    var row = $('[data-u="' + u.id + '"]', host), pick = S.u[u.id], chips = $(".chips", row), fb = $(".ee-ufb", row), solved = pick != null && MV.ok(u.choices[pick]);
    MV.keepFocus(chips, function(){
      chips.innerHTML = u.choices.map(function(c, i){ var on = pick === i; return '<button type="button" class="chip' + (on ? " on" : "") + (on && solved ? " good" : "") + '" data-uc="' + i + '" data-k="u' + u.id + i + '" aria-pressed="' + on + '"' + (solved && !on ? " disabled" : "") + ">" + c.t + "</button>"; }).join("");
    });
    fb.innerHTML = pick == null ? "" : MV.fbHTML(solved ? "good" : "bad", (solved ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + u.choices[pick].fb + (solved ? "" : " Try another chip."));
  }
  S2.chips.forEach(paintU);
  function vState(v){ return S.vb[v.id] || (S.vb[v.id] = { b:["", "", ""], solved:false }); }
  function paintV(v){
    var box = $('[data-v="' + v.id + '"]', host), x = vState(v), L = v.lab, A = v.aria, h;
    if (v.frame === "lnover") h = '<span class="ee-fl">' + L[0] + "</span>" + boxHTML(v.id + "0", x.b[0], A[0], "", x.solved) + '<span class="ee-fl">' + L[1] + "</span>" + boxHTML(v.id + "1", x.b[1], A[1], "", x.solved);
    else h = '<span class="ee-fl">' + L[0] + "</span>" + boxHTML(v.id + "0", x.b[0], A[0], "", x.solved) + '<span class="ee-fl">' + L[1] + "</span>" + boxHTML(v.id + "1", x.b[1], A[1], "", x.solved) + '<span class="ee-ln">' + L[2] + "</span>" + boxHTML(v.id + "2", x.b[2], A[2], "", x.solved);
    MV.keepFocus($(".ee-frame", box), function(){ $(".ee-frame", box).innerHTML = h; });
    var c = $(".ee-vcl", box), ch = x.solved ? MV.fbHTML("good", v.good) : '<div class="q-actions"><button type="button" class="btn primary sm" data-vchk="' + v.id + '" data-k="vchk' + v.id + '">Check</button></div>' + (vMsg[v.id] ? MV.fbHTML(vMsg[v.id].bad ? "bad" : "", vMsg[v.id].html) : "");
    MV.keepFocus(c, function(){ c.innerHTML = ch; });
  }
  S2.solve.forEach(paintV);
  function judgeV(v){
    var b = vState(v).b, t = b.map(function(s){ return String(s || "").trim(); }), val;
    if (v.frame === "lnover") {
      if (!t[0]) return { err:S2.fill };
      var A = eNum(t[0]), Dn = t[1] ? eNum(t[1]) : { v:1 };
      if (!A || !Dn || A.v <= 0 || !Dn.v) return { err:S2.err };
      val = Math.log(A.v) / Dn.v;
      if (near(val, Math.log(7) / 2)) return { ok:true };
      if (near(val, Math.log(3.5))) return { msg:v.half };
      if (near(val, Math.log(7))) return { msg:v.two };
      return { msg:v.general };
    }
    if (!t[0] || !t[2]) return { err:S2.fill };
    var c0 = eNum(t[0]), c1 = t[1] ? eNum(t[1]) : { v:1 }, ar = eNum(t[2]);
    if (!c0 || !c1 || !ar || ar.v <= 0) return { err:S2.err };
    val = c0.v + c1.v * Math.log(ar.v);
    if (near(val, 1 + Math.log(4))) return { ok:true };
    if (near(val, 1 + Math.log(20))) return { msg:v.div5 };
    if (near(val, Math.log(4) - 1) || near(val, Math.log(4))) return { msg:v.add1 };
    if (near(val, 1 + Math.log(20) / 5)) return { msg:v.quarter };
    return { msg:v.general };
  }

  // ---- Station 3: the chain rule, measured ----
  var g3 = function(x){ return Math.exp(x * x); }, V3 = { xmin:-1.8, xmax:1.8, ymin:-0.8, ymax:7.2 };
  var cp = new MV.Plot($("#ee-chn", host), V3);
  function drawCh(){
    var x = S.s3.x, y = g3(x), s = slopeAt(g3, x), pen = css("--pen"), ink = css("--ink");
    var sc = { view:V3, xLabel:"x", yLabel:"y", curves:[{ f:g3, color:pen, width:3 }], lines:[], points:[{ x:x, y:y, r:6.5, color:ink, ring:true }] };
    if (S.s3.meas) sc.lines.push({ p:[x, y], q:[x + 1, y + s], color:ink, width:2 });
    sc.after = function(ctx, p){
      bgText(ctx, "y = e", p.X(-1.7), p.Y(6.6), "left", pen, mfont(16));
      ctx.save(); ctx.font = mfont(12); ctx.fillStyle = pen; ctx.textBaseline = "middle"; ctx.fillText("x²", p.X(-1.7) + 1 + (function(){ ctx.font = mfont(16); var w = ctx.measureText("y = e").width; ctx.font = mfont(12); return w; })(), p.Y(6.6) - 8); ctx.restore();
      if (S.s3.meas) bgText(ctx, "slope ≈ " + fx(s, 3), p.X(x) + (x > 0 ? -14 : 14), p.Y(y) - 24, x > 0 ? "right" : "left", ink, ui(13, 700));
    };
    sc.describe = "Graph of y = e to the power x² with the point at x = " + num(x, 1) + (S.s3.meas ? " and its tangent, measured slope about " + num(s, 3) + "." : ".");
    cp.draw(sc);
  }
  cp.render = drawCh;
  function paintS3(){
    var st = S.s3, x = st.x, s = slopeAt(g3, x), h = "";
    if (!st.meas) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-s3="meas" data-k="s3meas">' + S3.measure + "</button></div>";
    else {
      h += '<p class="ee-meas" aria-live="polite">' + MV.md(tpl(S3.measured, [num(x, 1), fx(s, 3)])) + "</p>";
      h += '<p class="ee-pq">' + S3.predict + '</p><div class="chips ee-pch" role="group" aria-label="Predict the formula’s value at x = 1">' + S3.choices.map(function(c, i){
        var on = st.pred === i; return '<button type="button" class="chip' + (on ? " on" : "") + (on && st.ok ? " good" : "") + '" data-s3c="' + i + '" data-k="s3c' + i + '" aria-pressed="' + on + '"' + (st.ok && !on ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
      if (st.pred != null) h += MV.fbHTML(st.ok ? "good" : "bad", (st.ok ? "" : "<strong>✗ Not quite.</strong> ") + S3.choices[st.pred].fb + (st.ok ? "" : " Try another chip."));
      if (st.ok) {
        var fv = 2 * x * Math.exp(x * x), x2 = r9(x * x);
        h += '<p class="ee-pq">' + S3.pick + '</p><div class="chips" role="group" aria-label="Choose x">' + [-1, -0.5, 0, 0.5, 1].map(function(t){
          var on = near(t, x); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-s3x="' + t + '" data-k="s3x' + t + '" aria-pressed="' + on + '">' + m("x = " + num(t, 1)) + "</button>"; }).join("") + "</div>" +
          '<p class="ee-cmp" aria-live="polite">' + tpl(S3.formula, [num(x, 1), num(x2, 2), fx(fv, 3)]) + (Math.abs(fv - s) < 0.0005 ? ' <strong class="ee-ok">' + S3.matchTxt + "</strong>" : "") + "</p>" +
          (near(x, -1) ? '<p class="ee-note2">' + S3.neg + "</p>" : "");
      }
    }
    var host3 = $("#ee-s3c", host);
    MV.keepFocus(host3, function(){ host3.innerHTML = h; });
    drawCh();
  }
  paintS3();

  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.bx; if (!k) return;
    var v = S2.solve.filter(function(q){ return k.indexOf(q.id) === 0; })[0]; if (!v) return;
    vState(v).b[+k.slice(v.id.length)] = e.target.value; api.save();
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return;
    var q = e.target.closest("[data-v]"), b = q && q.querySelector("[data-vchk]"); if (b) b.click();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.uc != null) { var row = b.closest("[data-u]"), u = S2.chips.filter(function(q){ return q.id === row.dataset.u; })[0]; S.u[u.id] = +b.dataset.uc; api.save(); paintU(u); MV.focusFb(row); return; }
    if (b.dataset.vchk) {
      var v = S2.solve.filter(function(q){ return q.id === b.dataset.vchk; })[0], r = judgeV(v), box = b.closest("[data-v]");
      if (r.err) vMsg[v.id] = { bad:false, html:r.err };
      else if (r.ok) { vState(v).solved = true; vMsg[v.id] = null; }
      else vMsg[v.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." };
      api.save(); paintV(v); MV.focusFb(box); return;
    }
    if (b.dataset.s3 === "meas") { S.s3.meas = true; S.s3.x = 1; api.save(); paintS3(); return; }
    if (b.dataset.s3c != null) { var i = +b.dataset.s3c; S.s3.pred = i; S.s3.ok = MV.ok(S3.choices[i]); api.save(); paintS3(); MV.focusFb($("#ee-s3c", host)); return; }
    if (b.dataset.s3x != null) { S.s3.x = +b.dataset.s3x; api.save(); paintS3(); }
  });
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Tangents and rates ----------
// @component V8 designBoxes (adapted from MCV4U 21: values with e through V8 eNumber) — labelled answer boxes per item: single
// values, lists ("2, 3"; order-free), points "(□, □)" and lines "y = □x + □"; named wrong states ({k, eq} a value, point or
// line), a "give the exact value" message for decimals close to an e-answer, first-try scoring and three-level help.
function ratesAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q ee-dq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="ee-din"></div><div class="ee-dcl"></div></div>';
  }).join("");
  function bx(it, x, k, label){ return boxHTML(it.id + k, x.v[k], label, "", x.solved).replace('data-bx="' + it.id + k + '"', 'data-bx="' + k + '"'); }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .ee-din', host);
    var h = '<div class="ee-dt">' + it.boxes.map(function(b){
      var lab = MV.plain(b.pre || "");
      if (b.line) return '<div class="ee-dr"><span class="ee-fl">' + m("y =") + "</span>" + bx(it, x, b.k + "0", "slope") + '<span class="ee-fl">' + m("x +") + "</span>" + bx(it, x, b.k + "1", "y-intercept") + "</div>";
      if (b.pt) return '<div class="ee-dr"><span class="ee-dl">' + b.pre + '</span><span class="ee-dpt">(' + bx(it, x, b.k + "0", lab + ": x") + ", " + bx(it, x, b.k + "1", lab + ": y") + ")</span></div>";
      return '<div class="ee-dr"><span class="ee-dl">' + b.pre + "</span>" + bx(it, x, b.k, lab) + "</div>";
    }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .ee-dcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, decs = false, i, b;
    function one(k){ var r = String(x.v[k] || "").trim(); if (!r) return "fill"; var p = eNum(r); if (!p) return "err"; if (p.dec) decs = true; return p.v; }
    for (i = 0; i < it.boxes.length; i++) {
      b = it.boxes[i];
      if (b.pt || b.line) { var p0 = one(b.k + "0"), p1 = one(b.k + "1"); if (p0 === "fill" || p1 === "fill") return { err:TX.fill }; if (p0 === "err" || p1 === "err") return { err:TX.err }; vals[b.k] = [p0, p1]; }
      else if (b.list) { var raw = String(x.v[b.k] || "").trim(); if (!raw) return { err:TX.fill }; var l = eList(raw); if (!l) return { err:TX.err }; if (l.some(function(q){ return q.dec; })) decs = true; vals[b.k] = l.map(function(q){ return q.v; }); }
      else { var p = one(b.k); if (p === "fill") return { err:TX.fill }; if (p === "err") return { err:TX.err }; vals[b.k] = p; }
    }
    function isList(k){ return it.boxes.some(function(q){ return q.k === k && q.list; }); }
    function same(k, A, tol){
      var V = vals[k];
      if (Array.isArray(A)) { if (!Array.isArray(V) || V.length !== A.length) return false; return isList(k) ? MV.sameNums(V, A, tol) : V.every(function(v, j){ return near(v, A[j], tol); }); }
      return typeof V === "number" && near(V, A, tol);
    }
    var keys = Object.keys(ans);
    if (keys.every(function(k){ return same(k, ans[k], 1e-9); })) return { ok:true };
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
// ---------- Performance task: Peak designer, f(x) = (px + q)e^(rx) ----------
function linSrc(A, B){
  var s = A === 0 ? "" : (A === 1 ? "x" : A === -1 ? "-x" : A + "x");
  if (!s) return String(B);
  return B === 0 ? s : s + (B > 0 ? " + " + B : " - " + -B);
}
function expSrc(r){ return r === 1 ? "e^x" : r === -1 ? "e^{-x}" : "e^{" + r + "x}"; }
var task = (function(){
  var api, plot;
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -5 && v <= 5 ? v : null; }
  function read(){ var p = gi("p"), q = gi("q"), r = gi("r"); return { p:p, q:q, r:r, valid:p !== null && q !== null && r !== null && p !== 0 && r !== 0 }; }
  function checks(D){
    if (!D.valid) return [false, false, false];
    var c1 = D.p + D.r * (D.p + D.q) === 0;
    return [c1, c1 && D.p * D.r < 0, D.q > 0];
  }
  function preview(){
    var D = read(), L = api.content.labels, rd = $("#pk-read"), pen = css("--pen"), ink = css("--ink");
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + L.invalid + "</p>";
      plot.draw({ view:{ xmin:-2, xmax:3, ymin:-3, ymax:3 }, xLabel:"x", yLabel:"y", describe:"Empty graph: choose p, q and r." });
      return;
    }
    var p = D.p, q = D.q, r = D.r, f = function(x){ return (p * x + q) * Math.exp(r * x); };
    var A = p * r, B = p + q * r, d1 = (A + B) * Math.exp(r), f1 = f(1), horiz = A + B === 0;
    var rows = [[L.fRow, m("(" + linSrc(p, q) + ")" + expSrc(r))], [L.dRow, m(B === 0 && A === 0 ? "0" : "(" + linSrc(A, B) + ")" + expSrc(r))],
      [L.d1, horiz ? m("0") + " (" + L.flat + ")" : m("(" + (A + B) + ")e^{" + r + "}") + " " + dec(d1, 2)], [L.f0, m(String(q))]];
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
    // window: the part of the graph between x = −0.5 and 1.3 sets the y-range (intercept and x = 1 always in view)
    var lo = Infinity, hi = -Infinity;
    for (var i = 0; i <= 36; i++) { var t = -0.5 + 1.8 * i / 36, v = f(t); if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }
    lo = Math.min(lo, 0); hi = Math.max(hi, 0); var pad = (hi - lo) * 0.18 || 1;
    var V = { xmin:-2, xmax:3, ymin:lo - pad, ymax:hi + pad };
    plot.draw({ view:V, xLabel:"x", yLabel:"y", curves:[{ f:f, color:pen, width:3 }],
      lines:[{ p:[1, f1], q:[2, f1 + d1], color:ink, width:2 }],
      points:[{ x:0, y:q, r:5, color:ink }, { x:1, y:f1, r:6, color:ink, ring:true }],
      after:function(ctx, pl){ bgText(ctx, horiz ? "f′(1) = 0" : "f′(1) " + dec(d1, 2), pl.X(1) + 12, pl.Y(f1) + (d1 > 0 ? 20 : -20), "left", ink, ui(13, 700)); },
      describe:"Graph of f(x) = " + MV.plain(m("(" + linSrc(p, q) + ")" + expSrc(r))) + " with the tangent at x = 1" + (horiz ? ", which is horizontal" : ", slope about " + num(d1, 2)) + ". The y-intercept is " + num(q) + "." });
  }
  function stepper(k, range){
    var L = api.content.labels;
    return '<div class="pk-step"><label for="pk-' + k + '"><span class="m">' + L[k] + '</span> <span class="tiny muted">' + range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="pk' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="pk-' + k + '" data-tk="' + k + '" type="number" min="-5" max="5" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="pk' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (a.S.p == null) { a.S.p = "1"; a.S.q = "1"; a.S.r = "1"; }
      inp.innerHTML = '<div class="pk-in"><p class="tiny" style="font-weight:700;margin:0">' + m("f(x) = (px + q)e^{rx}") + "</p>" + stepper("p", L.rangeNZ) + stepper("q", L.range) + stepper("r", L.rangeNZ) + "</div>";
      pv.innerHTML = '<div id="pk-read" aria-live="polite"></div><p class="tiny pk-gh">' + L.graph + '</p><div class="plot-wrap"><canvas class="plot" id="pk-plot" role="img" aria-label="Graph of f"></canvas></div>';
      plot = new MV.Plot($("#pk-plot"), { xmin:-2, xmax:3, ymin:-3, ymax:3 }); plot.render = preview;
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        var nv = clamp(cur + +b.dataset.dir, -5, 5); if (k !== "q" && nv === 0) nv = clamp(nv + +b.dataset.dir, -5, 5) || cur;
        a.S[k] = String(nv); $("#pk-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : api.content.labels.invalid; },
    checks:checks,
    key:function(D){ return D.p + "|" + D.q + "|" + D.r; },
    label:function(k){ var s = k.split("|"); return m("(p, q, r) = (" + s.join(", ") + ")"); },
    text:function(k){ return "(p, q, r) = (" + k.split("|").map(function(v){ return v.replace("-", MINUS); }).join(", ") + ")"; }
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
