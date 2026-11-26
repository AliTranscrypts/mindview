// MCV4U 27 Derivatives of Logarithmic Functions: hero (eˣ with its tangent at (1, e) flips across y = x onto ln x: the slope
// triangle's rise and run swap), Mirror slopes (Explore: Mirror / Slope trail (V5 panels) / Other bases modes, a point slider with
// special-point chips, brown base chips, a V8 exact box for challenge 3), Logs in chains (Part 3: linked g and ln g panels, two
// routes counted line by line, ln(kx) vs ln x), Tangents and rates (Practice 2, V8 exact boxes with e and ln) and "Low point".
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var E = Math.E, E2 = Math.E * Math.E;
function m(s){ return MV.m(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol) * Math.max(1, Math.abs(b)); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
// placeholders #1, #2 (they survive backtick math)
function tpl(s, a){ return String(s).replace(/#(\d)/g, function(_, k){ return a[k - 1] != null ? a[k - 1] : "#" + k; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
// fixed decimals with a true minus ("0.693", "−0.693")
function fx(v, dp){ var s = (Math.abs(v) < 0.5 * Math.pow(10, -dp) ? 0 : v).toFixed(dp); return s.replace("-", MINUS); }
// value to dp decimals, "≈ " in front when rounding changed it
function dec(v, dp){ var p = Math.pow(10, dp), r = Math.round(v * p) / p; return (Math.abs(v - r) > 1e-9 ? "≈ " : "") + num(v, dp); }
// "= 1" or "≈ 0.631" (rounding to dp decimals decides which)
function eqDec(v, dp){ var d = dec(v, dp); return d.indexOf("≈") === 0 ? d : "= " + d; }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 4, Y - 10, w + 8, 20); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
function probeLine(ctx, p, x){
  var X = p.X(x); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.75; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
}
// numerical slope: symmetric difference quotient, h = 0.0001 ("measured numerically")
var H = 1e-4;
function slopeAt(f, x){ return (f(x + H) - f(x - H)) / (2 * H); }
function LN(x){ return x > 0 ? Math.log(x) : NaN; }

// =====================================================================================================================
// @component V8 lnExact (copied from MCV4U 26; adds superscript powers such as e²) — exact answers typed with numbers, fractions,
// ln and e (no variables): "e^2", "e²", "1/e", "2 − 2 ln 2", "−1/ln 3". Implicit products ("2ln2"), ^ for powers, ln binds to the
// next power ("ln 2/4" = (ln 2)/4).   lnParse(str) -> { v, dec (a decimal was typed), sym (ln or e was used) } or { err:"syntax" | "lnneg" }
var SUPD = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "⁻":"-" };
function lnParse(str){
  var s = String(str == null ? "" : str).toLowerCase().replace(/[−–—]/g, "-").replace(/[·×*]/g, "*")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function(t){ return "^(" + t.split("").map(function(c){ return SUPD[c]; }).join("") + ")"; }).trim();
  var toks = [], i = 0, dec = false;
  while (i < s.length) {
    var c = s[i];
    if (c === " ") { i++; continue; }
    var mm = /^(\d+(?:\.\d*)?|\.\d+)/.exec(s.slice(i));
    if (mm) { toks.push({ t:"n", v:parseFloat(mm[1]) }); if (mm[1].indexOf(".") >= 0) dec = true; i += mm[1].length; continue; }
    if (s.substr(i, 2) === "ln") { toks.push({ t:"ln" }); i += 2; continue; }
    if (c === "e") { toks.push({ t:"e" }); i++; continue; }
    if ("+-*/^()".indexOf(c) >= 0) { toks.push({ t:c }); i++; continue; }
    return { err:"syntax" };
  }
  if (!toks.length) return { err:"syntax" };
  var p = 0, bad = null;
  function pk(){ return toks[p]; }
  function starts(k){ return k && (k.t === "n" || k.t === "e" || k.t === "ln" || k.t === "("); }
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
    bad = bad || "syntax"; return NaN;
  }
  var v = expr();
  if (p !== toks.length) bad = bad || "syntax";
  if (bad || !isFinite(v)) return { err:bad || "syntax" };
  return { v:v, dec:dec, sym:toks.some(function(k){ return k.t === "ln" || k.t === "e"; }) };
}
// ------------------------------------------------- end of V8 lnExact ---------------------------------------------------------

function boxHTML(k, val, label, cls, dis){
  return '<input class="numin short' + (cls ? " " + cls : "") + '" data-bx="' + k + '" data-k="bx' + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(val || "") + '"' + (dis ? " disabled" : "") + ">";
}

// ---------- slope triangles (G-series, plan build notes: --hi-soft fill, labelled legs) ----------
// tri = { pts:[A, K, C] (K the right-angle corner), legs:[{a, b, text, side}] } in graph units
function drawTri(ctx, p, tri, alpha){
  if (alpha <= 0) return;
  var P = tri.pts.map(function(q){ return [p.X(q[0]), p.Y(q[1])]; });
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = css("--hi-soft"); ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); ctx.lineTo(P[1][0], P[1][1]); ctx.lineTo(P[2][0], P[2][1]); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); ctx.lineTo(P[1][0], P[1][1]); ctx.lineTo(P[2][0], P[2][1]); ctx.stroke();
  ctx.restore();
  ctx.save(); ctx.globalAlpha = alpha;
  tri.legs.forEach(function(l){
    if (!l.text) return;
    var a = [p.X(l.a[0]), p.Y(l.a[1])], b = [p.X(l.b[0]), p.Y(l.b[1])], t = l.t == null ? 0.5 : l.t, mx = a[0] + (b[0] - a[0]) * t, my = a[1] + (b[1] - a[1]) * t;
    if (l.side === "below") bgText(ctx, l.text, mx, my + 13, "center", css("--ink"), ui(12, 700));
    else if (l.side === "above") bgText(ctx, l.text, mx, my - 13, "center", css("--ink"), ui(12, 700));
    else if (l.side === "left") bgText(ctx, l.text, mx - 8, my, "right", css("--ink"), ui(12, 700));
    else bgText(ctx, l.text, mx + 8, my, "left", css("--ink"), ui(12, 700));
  });
  ctx.restore();
}
// right-angle mark where the twin segment crosses y = x (pixel space; the graph has equal scales)
function rightMark(ctx, p, mx, color){
  var X = p.X(mx), Y = p.Y(mx), s = 8, u = [Math.SQRT1_2, -Math.SQRT1_2], w = [Math.SQRT1_2, Math.SQRT1_2];
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.beginPath();
  ctx.moveTo(X + u[0] * s, Y + u[1] * s); ctx.lineTo(X + (u[0] + w[0]) * s, Y + (u[1] + w[1]) * s); ctx.lineTo(X + w[0] * s, Y + w[1] * s); ctx.stroke(); ctx.restore();
}

// ---------- names of special points and bases ----------
var XN = [{ v:0.25, n:"1/4" }, { v:0.5, n:"1/2" }, { v:1, n:"1" }, { v:2, n:"2" }, { v:E, n:"e" }, { v:4, n:"4" }, { v:E2, n:"e^2" }, { v:8, n:"8" }];
var CHIPS = [0.5, 1, 2, E, 4, E2, 8];
var BASES = [{ id:"0.5", v:0.5, n:"1/2" }, { id:"2", v:2, n:"2" }, { id:"e", v:E, n:"e" }, { id:"3", v:3, n:"3" }, { id:"4", v:4, n:"4" }, { id:"10", v:10, n:"10" }];
function xName(x){ for (var i = 0; i < XN.length; i++) if (near(x, XN[i].v)) return XN[i].n; return num(x, 2); }
function lnName(x){ if (near(x, 1)) return "0"; if (near(x, E)) return "1"; if (near(x, E2)) return "2"; var n = xName(x); return n.indexOf("/") >= 0 ? "ln(" + n + ")" : "ln " + n; }
function lnExactX(x){ return near(x, 1) || near(x, E) || near(x, E2); }
function bOf(id){ return BASES.filter(function(b){ return b.id === id; })[0] || BASES[1]; }
function logSrc(bn, col){ return "log_{" + (col ? "@b{" + bn + "}" : bn) + "}"; }
// the legs of a slope triangle on the eˣ side: run r, rise r·m (m = slope = x); the run is 1, 1/2 or 1/4
function runFor(m){ return m <= 2.6 ? 1 : m <= 5.2 ? 0.5 : 0.25; }
function legName(x, r){
  if (r === 1) return xName(x);
  var n = xName(x);
  if (n === "e" || n === "e^2") return n + "/" + (1 / r);
  var v = r * x; return (Math.abs(v * 100 - Math.round(v * 100)) > 1e-6 ? "≈ " : "") + num(v, 2);
}
function plainName(n){ return MV.plain(m(n)); }
// twin triangles: T on eˣ (slope x), P on ln x (slope 1/x); forward (up-right) when it fits, else backward (down-left)
function twinTris(x, top){
  var lx = Math.log(x), T = [lx, x], r = runFor(x), h = r * x, fwd = x + h <= top - 0.25;
  var rn = r === 1 ? "1" : r === 0.5 ? "1/2" : "1/4", hn = plainName(legName(x, r)), rN = plainName(rn);
  var te, tl;
  if (fwd) {
    te = { pts:[T, [lx + r, x], [lx + r, x + h]], legs:[{ a:T, b:[lx + r, x], text:"run " + rN, side:"below", t:0.4 }, { a:[lx + r, x], b:[lx + r, x + h], text:"rise " + hn, side:"right" }] };
    tl = { pts:[[x, lx], [x, lx + r], [x + h, lx + r]], legs:[{ a:[x, lx], b:[x, lx + r], text:"rise " + rN, side:"left", t:0.25 }, { a:[x, lx + r], b:[x + h, lx + r], text:"run " + hn, side:"above" }] };
  } else {
    te = { pts:[[lx - r, x - h], [lx, x - h], T], legs:[{ a:[lx - r, x - h], b:[lx, x - h], text:"run " + rN, side:"below" }, { a:[lx, x - h], b:T, text:"rise " + hn, side:"right" }] };
    tl = { pts:[[x - h, lx - r], [x - h, lx], [x, lx]], legs:[{ a:[x - h, lx - r], b:[x - h, lx], text:"rise " + rN, side:"left" }, { a:[x - h, lx], b:[x, lx], text:"run " + hn, side:"above" }] };
  }
  return { e:te, l:tl };
}

// =====================================================================================================================
// ---------- hero: eˣ (teal) draws, the mirror y = x appears, a tangent at (1, e) with "run 1, rise e"; a copy of the curve and
// its tangent flips across the mirror (rotation about y = x) and lands as ln x (--pen) with "run e, rise 1": slope 1/e ----------
function flipPt(q, c){ var s = (q[0] + q[1]) / 2, d = (q[0] - q[1]) / 2; return [s + c * d, s - c * d]; }
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var V = { xmin:-2.2, xmax:6.4, ymin:-2.2, ymax:6.4 }, pl = new MV.Plot(cv, V, { equal:true });
  var EX = []; for (var t0 = -2.6; t0 <= 1.95; t0 += 0.02) EX.push([t0, Math.exp(t0)]);
  var st = { end:-2.6, mir:false, tan:0, flip:null, landed:false };
  var eqEl = document.querySelector(".hero-eq");
  function cap(h){ if (f.cap) f.cap.innerHTML = MV.md(h); }
  function draw(){
    var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2");
    var sc = { view:V, equal:true, xLabel:"x", yLabel:"y", curves:[], segments:[], points:[] };
    if (st.mir) sc.segments.push({ x1:-2.4, y1:-2.4, x2:6.6, y2:6.6, color:ink2, width:1.6, dash:[2, 5] });
    if (st.end > -2.6) sc.curves.push({ pts:EX.filter(function(q){ return q[0] <= st.end; }), color:f3, width:3 });
    var A = [1, E], tanE = [[-0.45, -0.45 * E], [2.15, 2.15 * E]];
    var triE = { pts:[A, [2, E], [2, 2 * E]], legs:[{ a:A, b:[2, E], text:"run 1", side:"below" }, { a:[2, E], b:[2, 2 * E], text:"rise e", side:"right" }] };
    if (st.tan > 0) sc.segments.push({ x1:tanE[0][0], y1:tanE[0][1], x2:tanE[1][0], y2:tanE[1][1], color:ink, width:2.2, alpha:st.tan });
    var c = st.flip == null ? null : Math.cos(Math.PI * st.flip), col = st.flip != null && st.flip > 0.5 ? pen : f3;
    if (c != null) {
      sc.curves.push({ pts:EX.map(function(q){ return flipPt(q, c); }), color:col, width:3 });
      var a = flipPt(tanE[0], c), b = flipPt(tanE[1], c);
      sc.segments.push({ x1:a[0], y1:a[1], x2:b[0], y2:b[1], color:ink, width:2.2 });
    }
    if (st.tan > 0) sc.points.push({ x:1, y:E, r:5.5, color:f3 });
    if (c != null) { var P = flipPt(A, c); sc.points.push({ x:P[0], y:P[1], r:5.5, color:col }); }
    sc.after = function(ctx, p){
      if (st.tan > 0) {
        drawTri(ctx, p, triE, st.tan);
        ctx.save(); ctx.globalAlpha = st.tan; bgText(ctx, "slope e", p.X(1) - 12, p.Y(E) - 2, "right", ink, ui(14, 700)); ctx.restore();
      }
      if (c != null) {
        var tri = { pts:triE.pts.map(function(q){ return flipPt(q, c); }), legs:st.landed ?
          [{ a:[E, 1], b:[E, 2], text:"rise 1", side:"left" }, { a:[E, 2], b:[2 * E, 2], text:"run e", side:"above" }] : [] };
        drawTri(ctx, p, tri, 1);
        if (st.landed) bgText(ctx, "slope 1/e", p.X(E) + 12, p.Y(1) + 16, "left", ink, ui(14, 700));
      }
      if (st.end > 1.2) bgText(ctx, "y = eˣ", p.X(-1.9), p.Y(1.25), "left", f3, mfont(16));
      if (st.mir) bgText(ctx, "y = x", p.X(5.9), p.Y(5.9) + 16, "right", ink2, mfont(15));
      if (st.landed) bgText(ctx, "y = ln x", p.X(4.6), p.Y(Math.log(4.6)) + 22, "center", pen, mfont(16));
    };
    sc.describe = st.landed ? "y = eˣ in teal with the tangent at (1, e): run 1, rise e, slope e. Its reflection in the dotted line y = x is y = ln x in blue with the tangent at (e, 1): run e, rise 1, slope 1/e."
      : "y = eˣ in teal" + (st.mir ? " and the dotted mirror line y = x" : "") + (st.tan > 0 ? ", with the tangent at (1, e): run 1, rise e" : "") + (c != null ? "; a copy flips across the mirror." : ".");
    pl.draw(sc);
  }
  pl.render = draw;
  function finalFrame(){
    st.end = 2; st.mir = true; st.tan = 1; st.flip = 1; st.landed = true; draw();
    cap("Reflection swaps rise and run: slope `e` at `(1, e)` becomes slope `1/e` at `(e, 1)`.");
    if (eqEl) eqEl.style.opacity = "";
  }
  if (MV.reduceMotion) { finalFrame(); return; }
  if (eqEl) { eqEl.style.transition = "opacity .9s"; eqEl.style.opacity = "0.18"; }
  var lin = function(t){ return t; };
  cap("`y = e^x`"); draw();
  MV.wait(300, function(){
    MV.tween({ dur:1300, ease:lin, step:function(t){ st.end = -2.6 + 4.6 * t; draw(); }, done:function(){
      MV.wait(300, function(){
        st.mir = true; cap("The mirror: the line `y = x`."); draw();
        MV.wait(900, function(){
          cap("The tangent at `(1, e)`: run 1, rise `e`.");
          MV.tween({ dur:700, step:function(t){ st.tan = t; draw(); }, done:function(){
            MV.wait(1300, function(){
              cap("Flip the curve and its tangent across `y = x` …");
              MV.tween({ dur:2000, step:function(t){ st.flip = t; draw(); }, done:function(){
                st.flip = 1; st.landed = true; draw();
                cap("`y = ln x` with the tangent at `(e, 1)`: run `e`, rise 1, so the slope is `1/e`.");
                MV.wait(1600, finalFrame);
              } });
            });
          } });
        });
      });
    } });
  });
}

// =====================================================================================================================
// @component V5 derivativePanels (copied from MCV4U 23: panels of any kind stacked on one shared x-axis, each with an HTML
// caption, one probe; drag the point on panel 0 or tap any panel; arrow keys step o.step, Shift o.step × 10). Adapted: a "set"
// or "anim" move keeps its exact value (special points such as e are off the step grid); drags, taps and keys still snap.
//   var dp = derivativePanels(host, { kinds:["f", "d1"], x, step, dom(){ return {lo, hi, excl:[x]} }, draw(i, plot, x),
//     handle(x) -> {x, y, label}, locked(), onMove(x, how, prev, skipped) })  -> { get(), set(x, how), render(), plots, caps, wraps, layout(visible(i)), focus() }
function dpSnap(D, v, prev, st, exact){
  var skipped = null;
  function ex(w){ return (D.excl || []).some(function(e){ return Math.abs(e - w) < 1e-9; }); }
  v = exact ? r9(clamp(v, D.lo, D.hi)) : r9(clamp(Math.round(v / st) * st, D.lo, D.hi));
  if (ex(v)) {
    skipped = v;
    var dir = prev == null || v >= prev ? 1 : -1, w = r9(v + dir * st);
    if (w > D.hi || w < D.lo || ex(w)) w = r9(v - dir * st);
    v = w;
  }
  return { v:v, skipped:skipped };
}
function derivativePanels(host, o){
  var x = o.x, st = o.step || 0.05;
  host.classList.add("dp-panels");
  host.innerHTML = o.kinds.map(function(k, i){ return '<div class="lg-pan" data-pan="' + i + '"><p class="lg-pcap"></p><div class="plot-wrap"><canvas class="plot lg-c-' + k + '" role="img" aria-label="Panel ' + (i + 1) + '"></canvas></div></div>'; }).join("");
  var wraps = $$(".lg-pan", host), caps = $$(".lg-pcap", host), plots = $$("canvas", host).map(function(c){ return new MV.Plot(c, { xmin:-1, xmax:1, ymin:-1, ymax:1 }); });
  var busy = false;
  function render(){
    if (busy) return; busy = true;
    try { plots.forEach(function(p, i){ if (!wraps[i].hidden) o.draw(i, p, x); }); } finally { busy = false; }
  }
  plots.forEach(function(p){ p.render = render; });
  function set(v, how){
    if (o.locked && o.locked() && how !== "anim" && how !== "set") return;
    var s = dpSnap(o.dom(), v, x, st, how === "set" || how === "anim");
    if (s.v === x && how !== "set") { if (s.skipped != null && o.onMove) { o.onMove(x, how, x, s.skipped); render(); } return; }
    var prev = x; x = s.v;
    if (o.onMove) o.onMove(x, how, prev, s.skipped);
    render();
  }
  var dr = MV.drag(plots[0], { axis:"x", step:{ x:st, y:st }, big:10,
    handles:function(){ var h = o.handle(x); return [{ id:"probe", x:h.x, y:h.y, label:h.label }]; },
    move:function(id, nx, ny, how){ set(nx, how === "key" ? "key" : "drag"); } });
  plots.forEach(function(p){
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
    p.c.addEventListener("pointerdown", function(e){
      if (e.defaultPrevented || !p.v) return;
      active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {}
      set(at(e), "tap");
    });
    p.c.addEventListener("pointermove", function(e){ if (active) set(at(e), "drag"); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  });
  function layout(vis){ wraps.forEach(function(w, i){ w.hidden = !vis(i); }); }
  return { get:function(){ return x; }, set:set, render:render, plots:plots, wraps:wraps, caps:caps, layout:layout, focus:function(){ dr.focus("probe"); } };
}
// ------------------------------------------------- end of V5 derivativePanels ---------------------------------------------------
function swatch(v, dash){ return '<span class="lg-sw' + (dash ? " dash" : "") + '" style="' + (dash ? "border-color:" : "background:") + "var(" + v + ')"></span>'; }
function runs(keys){
  var s = keys.slice().sort(function(a, b){ return a - b; }), out = [];
  s.forEach(function(k){ var r = out[out.length - 1]; if (r && k === r[1] + 1) r[1] = k; else if (!r || k !== r[1]) out.push([k, k]); });
  return out;
}

// =====================================================================================================================
// ---------- Explore: Mirror slopes ----------
var MV_V = { xmin:-1.6, xmax:8.4, ymin:-1.6, ymax:8.4 };
var TV = { xmin:-0.35, xmax:8.4 }, TV0 = { ymin:-2, ymax:2.6 }, TV1 = { ymin:-0.5, ymax:4.4 };
var BV = { xmin:-0.35, xmax:8.4, ymin:-3.4, ymax:3.6 };
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, R = T.rows, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["mirror", "trail", "bases"].indexOf(S.mode) < 0) S.mode = "mirror";
  if (typeof S.x !== "number" || !(S.x >= 0.25 && S.x <= 8)) S.x = 2;
  if (!BASES.some(function(b){ return b.id === S.b; })) S.b = "2";
  if (!Array.isArray(S.trail)) S.trail = [];
  S.recip = !!S.recip; if (typeof S.ex !== "string") S.ex = "";
  var busy = false, mark = null, tanA = 1, bAnim = null, stop = null;
  host.innerHTML = '<div class="lg-ex"><div class="lg-main" data-mv="graph"><p class="eq-cap lg-eq" id="lg-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="lg-gm"><div class="plot-wrap"><canvas class="plot square lg-mir" id="lg-mir" role="img" aria-label="Graph of y = ln x and y = e to the x"></canvas></div></div>' +
    '<div id="lg-gt"></div>' +
    '<div id="lg-gb"><div class="plot-wrap"><canvas class="plot lg-bas" id="lg-bas" role="img" aria-label="Graph of y = log base b of x"></canvas></div></div>' +
    '<p class="tiny muted lg-key" id="lg-key"></p></div>' +
    '<div class="lg-side"><div class="seg-wrap" id="lg-mode"></div><p class="tiny muted lg-how" id="lg-how"></p>' +
    '<label class="slider lg-sl"><span class="slider-top"><span id="lg-xlab">' + T.point + '</span><output id="lg-xout"></output></span>' +
    '<input type="range" id="lg-x" min="0.25" max="8" step="0.25" style="accent-color:var(--pen)" aria-label="Point x on y = ln x"></label>' +
    '<div class="chips lg-xch" id="lg-xch" role="group" aria-label="Special points"></div><p class="tiny muted lg-note">' + T.pointNote + "</p>" +
    '<div class="lg-bwrap" id="lg-bwrap"><p class="lg-bh">' + T.base + '</p><div class="chips lg-bch" id="lg-bch" role="group" aria-label="Base b"></div></div>' +
    '<div class="q-actions lg-tact" id="lg-tact"></div>' +
    '<dl class="read lg-read" id="lg-read" aria-live="polite"></dl>' +
    '<div class="lg-exact"><p class="lg-exh">' + T.exact + '</p><p class="tiny muted">' + T.exactHow + '</p><div class="lg-frow"><span class="lg-fl">' + T.exactLab + "</span>" +
    boxHTML("ex", S.ex, "Challenge 3: x-coordinate, exactly") + "</div></div></div></div>";
  var slX = $("#lg-x", host), mp = new MV.Plot($("#lg-mir", host), MV_V, { equal:true }), bp = new MV.Plot($("#lg-bas", host), BV);
  mp.render = drawMir; bp.render = drawBas;
  var dp = derivativePanels($("#lg-gt", host), { kinds:["f", "d1"], x:S.x, step:0.25,
    dom:function(){ return { lo:0.25, hi:8, excl:[] }; },
    draw:drawTrail,
    handle:function(x){ return { x:x, y:Math.log(x), label:"Point on y = ln x at x = " + plainName(xName(x)) }; },
    locked:function(){ return busy; },
    onMove:function(x, how, prev){ if (how === "set" || how === "anim") return; S.x = x; if (S.mode === "trail") addKeys(prev, x); mark = null; refresh(); } });

  function bVal(){ return bAnim != null ? bAnim : bOf(S.b).v; }
  function addKeys(a, b){ var lo = Math.round(Math.min(a, b) * 4), hi = Math.round(Math.max(a, b) * 4); for (var k = lo; k <= hi; k++) if (S.trail.indexOf(k) < 0) S.trail.push(k); }
  function setX(v, how){ var prev = S.x; S.x = r9(clamp(v, 0.25, 8)); if (S.mode === "trail") addKeys(prev, S.x); dp.set(S.x, how || "set"); }

  // ---- Mirror ----
  function drawMir(){
    var x = S.x, lx = Math.log(x), pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), ink2 = css("--ink-2");
    var sc = { view:MV_V, equal:true, xLabel:"x", yLabel:"y", segments:[{ x1:-2, y1:-2, x2:9, y2:9, color:ink2, width:1.6, dash:[2, 5] }],
      curves:[{ f:LN, color:pen, width:3, domain:[0.0004, 9] }, { f:Math.exp, color:f3, width:3 }], points:[] };
    var L = 24 * tanA;
    if (tanA > 0) {
      var u1 = 1 / Math.sqrt(1 + 1 / (x * x)), v1 = u1 / x, u2 = 1 / Math.sqrt(1 + x * x), v2 = u2 * x;
      sc.segments.push({ x1:x - L * u1, y1:lx - L * v1, x2:x + L * u1, y2:lx + L * v1, color:ink, width:2 });
      sc.segments.push({ x1:lx - L * u2, y1:x - L * v2, x2:lx + L * u2, y2:x + L * v2, color:ink, width:2 });
    }
    sc.segments.push({ x1:x, y1:lx, x2:lx, y2:x, color:ink2, width:1.8, dash:[5, 4] });
    sc.points.push({ x:lx, y:x, r:6, color:f3 }, { x:x, y:lx, r:6.5, color:pen, ring:true });
    var tr = twinTris(x, MV_V.ymax);
    sc.after = function(ctx, p){
      if (Math.abs(x - lx) > 0.3) rightMark(ctx, p, (x + lx) / 2, ink2);
      drawTri(ctx, p, tr.e, tanA); drawTri(ctx, p, tr.l, tanA);
      bgText(ctx, "y = ln x", p.X(6.6), p.Y(Math.log(6.6)) + 22, "center", pen, mfont(15));
      bgText(ctx, "y = eˣ", p.X(Math.log(6.6)) - 12, p.Y(6.6), "right", f3, mfont(15));
      bgText(ctx, "y = x", p.X(8.1), p.Y(8.1) + 16, "right", ink2, mfont(14));
      if (mark) bgText(ctx, mark.text, p.X(mark.x), p.Y(mark.y), "center", ink, ui(14, 700));
    };
    var xs = plainName(xName(x));
    sc.describe = "Graph of y = ln x (blue) and y = eˣ (teal) with the dotted mirror y = x. Point (" + xs + ", " + fx(lx, 2) + ") on y = ln x" +
      (tanA > 0 ? " with its tangent, slope " + fx(1 / x, 3) : "") + ". Mirror point on y = eˣ at (" + fx(lx, 2) + ", " + xs + ")" + (tanA > 0 ? ", slope " + fx(x, 3) : "") + ". A dashed segment joins them at a right angle to y = x.";
    mp.draw(sc);
  }
  // ---- Slope trail (V5) ----
  function drawTrail(i, p, x){
    var pen = css("--pen"), f3 = css("--f3"), ink = css("--ink"), lx = Math.log(x), s = slopeAt(Math.log, x);
    if (i === 0) {
      var V0 = { xmin:TV.xmin, xmax:TV.xmax, ymin:TV0.ymin, ymax:TV0.ymax };
      p.draw({ view:V0, xLabel:"x", yLabel:"y", curves:[{ f:LN, color:pen, width:3, domain:[0.0004, 9] }],
        lines:[{ p:[x, lx], q:[x + 1, lx + s], color:ink, width:2 }], points:[{ x:x, y:lx, r:6, color:ink }],
        after:function(ctx, pl){ probeLine(ctx, pl, x); bgText(ctx, "slope ≈ " + fx(s, 3), pl.X(x) + (x > 5 ? -12 : 12), pl.Y(lx) + 22, x > 5 ? "right" : "left", ink, ui(13, 700)); },
        describe:"Graph of f(x) = ln x with the tangent at x = " + plainName(xName(x)) + ", slope about " + fx(s, 3) + "." });
      return;
    }
    var V1 = { xmin:TV.xmin, xmax:TV.xmax, ymin:TV1.ymin, ymax:TV1.ymax }, sc = { view:V1, xLabel:"x", yLabel:"slope", curves:[], points:[] };
    runs(S.trail).forEach(function(r){
      if (r[0] === r[1]) sc.points.push({ x:r[0] / 4, y:4 / r[0], r:3.2, color:f3 });
      else sc.curves.push({ f:function(t){ return 1 / t; }, color:f3, width:2.6, domain:[r[0] / 4, r[1] / 4] });
    });
    if (S.recip) sc.curves.push({ f:function(t){ return t > 0 ? 1 / t : NaN; }, color:ink, width:2, dash:[12, 7], domain:[0.2, 9] });
    sc.points.push({ x:x, y:s, r:6, color:f3 });
    sc.after = function(ctx, pl){
      probeLine(ctx, pl, x);
      if (mark) bgText(ctx, mark.text, pl.X(mark.x), pl.Y(mark.y), "center", ink, ui(14, 700));
    };
    var tr = S.trail.length ? " The trail runs from x = " + num(Math.min.apply(null, S.trail) / 4, 2) + " to " + num(Math.max.apply(null, S.trail) / 4, 2) + "." : "";
    sc.describe = "Slope of ln x plotted against x: at x = " + plainName(xName(x)) + " the slope is about " + fx(s, 3) + "." + tr + (S.recip ? " The dashed curve y = 1/x is shown." : "");
    p.draw(sc);
  }
  // ---- Other bases ----
  function drawBas(){
    var b = bVal(), x = S.x, k = 1 / Math.log(b), g = function(t){ return t > 0 ? Math.log(t) * k : NaN; }, y = g(x), s = k / x;
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), isE = Math.abs(b - E) < 1e-9;
    var sc = { view:BV, xLabel:"x", yLabel:"y", curves:[], lines:[], points:[] };
    if (!isE) sc.curves.push({ f:LN, color:ink2, width:2, dash:[6, 6], domain:[0.0004, 9] });
    sc.curves.push({ f:g, color:pen, width:3, domain:[0.0004, 9] });
    sc.lines.push({ p:[x, y], q:[x + 1, y + s], color:ink, width:2 });
    sc.points.push({ x:x, y:y, r:6.5, color:ink, ring:true });
    var bn = bAnim != null && !BASES.some(function(q){ return Math.abs(q.v - b) < 1e-9; }) ? num(b, 2) : plainName(bOf(S.b).n);
    sc.after = function(ctx, p){
      var xl = 7.2, yl = g(xl);
      bgText(ctx, isE ? "y = ln x" : "y = log" + subs(bn) + " x", p.X(xl), p.Y(yl) + (k > 0 ? -18 : 18), "center", pen, mfont(15));
      if (!isE) bgText(ctx, "y = ln x", p.X(xl), p.Y(Math.log(xl)) + (Math.log(xl) > yl ? -18 : 18), "center", ink2, mfont(14));
      bgText(ctx, "slope ≈ " + fx(s, 3), p.X(x) + (x > 5 ? -14 : 14), p.Y(y) + (s > 0 ? 22 : -22), x > 5 ? "right" : "left", ink, ui(13, 700));
      if (mark) bgText(ctx, mark.text, p.X(mark.x), p.Y(mark.y), "center", ink, ui(14, 700));
    };
    sc.describe = "Graph of y = log base " + bn + " of x" + (isE ? " (which is ln x)" : " with y = ln x dashed") + ". Tangent at x = " + plainName(xName(x)) + ", slope about " + fx(s, 3) + ".";
    bp.draw(sc);
  }
  var SUB = { "0":"₀", "1":"₁", "2":"₂", "3":"₃", "4":"₄", "5":"₅", "6":"₆", "7":"₇", "8":"₈", "9":"₉", ".":".", "/":"/" };
  function subs(n){ return n === "e" ? "ₑ" : String(n).split("").map(function(c){ return SUB[c] || c; }).join(""); }

  // ---- readout and controls ----
  function ptHTML(x){
    var lx = Math.log(x), ex = lnExactX(x);
    return m("(" + xName(x) + ", " + lnName(x)) + (ex ? "" : " ≈ " + fx(lx, 3)) + m(")");
  }
  function paintRead(){
    var x = S.x, lx = Math.log(x), s = slopeAt(Math.log, x), rows;
    if (S.mode === "mirror") {
      var ts = slopeAt(Math.exp, lx);
      rows = [[R.pt, ptHTML(x)], [R.sl, "≈ " + fx(s, 3)],
        [R.twin, m("(" + lnName(x)) + (lnExactX(x) ? "" : " ≈ " + fx(lx, 3)) + m(", " + xName(x) + ")")], [R.tsl, "≈ " + fx(ts, 3)],
        [R.prod, fx(s * ts, 3)]];
    } else if (S.mode === "trail") {
      rows = [[R.pt, ptHTML(x)], [R.sl, "≈ " + fx(s, 3)], [R.trail, "(" + num(x, 2) + ", " + fx(s, 3) + ")"]];
      if (S.recip) rows.push([R.recip, m("1/" + xName(x)) + (near(x, 1) || near(x, 2) || near(x, 4) || near(x, 8) || near(x, 0.5) || near(x, 0.25) ? " = " + num(1 / x, 4) : " ≈ " + fx(1 / x, 3))]);
    } else {
      var B = bOf(S.b), b = bVal(), k = 1 / Math.log(b), isE = B.id === "e";
      rows = [[R.fn, m("y = " + logSrc(B.n, true) + " x") + (isE ? " = " + m("ln x") : "")],
        [R.ptb, isE ? ptHTML(x) : m("(" + xName(x) + ", " + logSrc(B.n, false) + " " + xName(x)) + " " + eqDec(k * lx, 3) + m(")")],
        [R.sl, "≈ " + fx(k / x, 3)],
        [R.xs, m(isE ? "1/ln e = 1" : (B.n.indexOf("/") >= 0 ? "1/ln(" + B.n + ")" : "1/ln " + B.n)) + (isE ? "" : " ≈ " + fx(k, 3))]];
    }
    $("#lg-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCtl(){
    MV.keepFocus($("#lg-mode", host), function(){ $("#lg-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    $("#lg-how", host).innerHTML = C.modeHow[S.mode];
    MV.keepFocus($("#lg-xch", host), function(){
      $("#lg-xch", host).innerHTML = CHIPS.map(function(v, i){ var on = near(S.x, v); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-xc="' + i + '" data-k="xc' + i + '" aria-pressed="' + on + '">' + m(xName(v)) + "</button>"; }).join("");
    });
    $("#lg-bwrap", host).hidden = S.mode !== "bases";
    MV.keepFocus($("#lg-bch", host), function(){
      $("#lg-bch", host).innerHTML = BASES.map(function(b){ var on = S.b === b.id && bAnim == null; return '<button type="button" class="chip lg-bchip' + (on ? " on" : "") + '" data-bc="' + b.id + '" data-k="bc' + b.id + '" aria-pressed="' + on + '">' + m("@b{" + b.n + "}") + "</button>"; }).join("");
    });
    var ta = $("#lg-tact", host); ta.hidden = S.mode !== "trail";
    MV.keepFocus(ta, function(){
      ta.innerHTML = '<button type="button" class="btn ghost sm" data-act="recip" data-k="lgrecip" aria-pressed="' + S.recip + '">' + (S.recip ? "✓ " : "") + T.recip + "</button>" +
        '<button type="button" class="btn ghost sm" data-act="clear" data-k="lgclr"' + (S.trail.length > 1 ? "" : " disabled") + ">" + T.clear + "</button>";
    });
    slX.value = S.x; $("#lg-xout", host).innerHTML = m(xName(S.x));
    $("#lg-xlab", host).innerHTML = S.mode === "bases" ? T.pointB : T.point;
    var eq = S.mode === "mirror" ? m("y = ln x") + " and " + m("y = e^x") : S.mode === "trail" ? m("f(x) = ln x") + " and its slope" : m("y = " + logSrc(bOf(S.b).n, true) + " x");
    $("#lg-eq", host).innerHTML = eq;
    $("#lg-key", host).innerHTML = S.mode === "mirror" ? T.keyM : S.mode === "trail" ? T.keyT : T.keyB;
  }
  function layout(){
    $("#lg-gm", host).hidden = S.mode !== "mirror"; $("#lg-gt", host).hidden = S.mode !== "trail"; $("#lg-gb", host).hidden = S.mode !== "bases";
    dp.caps[0].innerHTML = swatch("--pen") + " " + T.topCap;
    dp.caps[1].innerHTML = swatch("--f3") + " " + T.lowCap + (S.recip ? ' <span class="lg-capsep">·</span> ' + swatch("--ink", true) + " " + T.recipCap : "");
  }
  function drawAll(){ if (S.mode === "mirror") drawMir(); else if (S.mode === "trail") dp.render(); else drawBas(); }
  function refresh(){ paintCtl(); layout(); paintRead(); drawAll(); }
  function changed(){ api.save(); refresh(); MV.changed(); }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b)) return;
    if (b.dataset.mode) { S.mode = b.dataset.mode; mark = null; if (S.mode === "trail") addKeys(S.x, S.x); changed(); return; }
    if (b.dataset.xc != null) { setX(CHIPS[+b.dataset.xc]); mark = null; changed(); return; }
    if (b.dataset.bc) { S.b = b.dataset.bc; mark = null; changed(); return; }
    if (b.dataset.act === "recip") { S.recip = !S.recip; changed(); return; }
    if (b.dataset.act === "clear") { S.trail = []; addKeys(S.x, S.x); changed(); }
  });
  slX.addEventListener("input", function(){ if (busy) return; setX(+slX.value); mark = null; changed(); });
  $("#lg-mir", host).addEventListener("pointerdown", function(e){
    if (busy || !mp.v) return;
    var r = e.target.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, gx = mp.xOf(px), gy = mp.yOf(py);
    // closer to eˣ (above the mirror) → the twin's height is the point's x
    var v = gy > gx ? gy : gx;
    setX(Math.round(clamp(v, 0.25, 8) * 4) / 4); mark = null; changed();
  });
  $("#lg-bas", host).addEventListener("pointerdown", function(e){
    if (busy || !bp.v) return;
    var r = e.target.getBoundingClientRect(); setX(Math.round(clamp(bp.xOf(e.clientX - r.left), 0.25, 8) * 4) / 4); mark = null; changed();
  });
  host.addEventListener("input", function(e){ if (e.target.dataset && e.target.dataset.bx === "ex") { S.ex = e.target.value; api.save(); MV.changed(); } });
  if (S.mode === "trail") addKeys(S.x, S.x);
  dp.set(S.x, "set");
  refresh();

  // ---- challenges ----
  function chal(id){
    var M = MS[id], x = S.x;
    if (id === "tc1") {
      if (S.mode !== "mirror") return { ok:false, msg:M.mode };
      if (near(x, 2)) return { ok:true };
      if (near(x, 0.5)) return { ok:false, msg:M.half };
      if (near(x, 4)) return { ok:false, msg:M.four };
      return { ok:false, msg:tpl(M.general, [fx(1 / x, 3)]) };
    }
    if (id === "tc2") {
      if (S.mode !== "bases") return { ok:false, msg:M.mode };
      var b = bOf(S.b).v;
      if (S.b === "4") return { ok:true };
      if (S.b === "2") return { ok:false, msg:M.b2 };
      if (S.b === "10") return { ok:false, msg:M.b10 };
      return { ok:false, msg:tpl(M.general, [fx(1 / (2 * Math.log(b)), 3)]) };
    }
    if (id === "tc3") {
      var raw = String(S.ex || "").trim();
      if (!raw) return { ok:false, msg:near(x, E2) ? M.chip : M.blank };
      var r = lnParse(raw);
      if (r.err) return { ok:false, msg:r.err === "lnneg" ? M.pos : M.err };
      if (!(r.v > 0)) return { ok:false, msg:M.pos };
      if (near(r.v, E2) && !r.dec) return { ok:true };
      if (near(r.v, E)) return { ok:false, msg:M.e };
      if (near(r.v, 1)) return { ok:false, msg:M.one };
      if (r.dec && Math.abs(r.v - E2) < 0.01) return { ok:false, msg:M.approx };
      return { ok:false, msg:tpl(M.general, [fx(Math.log(r.v) - 1, 3)]) };
    }
    return { ok:false };
  }

  // ---- predictions ----
  function fin(done){ busy = false; bAnim = null; tanA = 1; lock(false); api.save(); refresh(); MV.changed(); done(); }
  function show(mk, cb){ mark = mk; drawAll(); MV.wait(1300, cb); }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; mark = null; bAnim = null; tanA = 1;
        if (p.id === "p1") { S.mode = "mirror"; S.x = 1; tanA = 0; }
        else if (p.id === "p2") { S.mode = "mirror"; S.x = E2; tanA = 0; }
        else if (p.id === "p3") { S.mode = "trail"; S.trail = []; S.x = 0.25; addKeys(0.25, 0.25); }
        else { S.mode = "bases"; S.x = 1; S.b = "e"; }
        dp.set(S.x, "set"); refresh(); lock(true);
      },
      run:function(p, done){
        if (p.id === "p1" || p.id === "p2") {
          stop = MV.tween({ dur:1500, step:function(t){ tanA = t; drawMir(); }, done:function(){
            stop = null; tanA = 1;
            show(p.id === "p1" ? { x:4.6, y:0.2, text:"both tangents have slope 1" } : { x:4.4, y:4.2, text:"slope 7.39 ↔ slope 1/7.39 ≈ 0.135" }, function(){ fin(done); });
          } });
        } else if (p.id === "p3") {
          stop = MV.tween({ dur:3800, ease:function(t){ return t; }, step:function(t){ setX(0.25 + 7.75 * t, "anim"); paintRead(); slX.value = S.x; $("#lg-xout", host).innerHTML = m(xName(S.x)); }, done:function(){
            stop = null; setX(8, "anim"); show({ x:5, y:1.6, text:"slope → 0, but always above the axis" }, function(){ fin(done); });
          } });
        } else {
          stop = MV.tween({ dur:1800, step:function(t){ bAnim = E + (2 - E) * t; drawBas(); }, done:function(){
            stop = null; bAnim = null; S.b = "2"; refresh(); lock(true);
            show({ x:4.6, y:-2.4, text:"log₂ x is steeper: slope ≈ 1.443" }, function(){ fin(done); });
          } });
        }
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Logs in chains (Station 1: V5 linked panels g and ln g; Station 2: two routes stepped line by line with an
// N13 player each and a lines-used count; Station 3: ln(kx) vs the ghost of ln x with parallel tangents) ----------
function part3(host, api){
  var S = api.S, C = api.content, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  if (typeof S.x1 !== "number" || !(S.x1 >= -3 && S.x1 <= 3)) S.x1 = 1;
  S.r = S.r || {};
  if (typeof S.k !== "number" || !(S.k >= 0.25 && S.k <= 8)) S.k = 2;
  if (typeof S.x3 !== "number" || !(S.x3 >= 0.5 && S.x3 <= 6)) S.x3 = 2;
  host.innerHTML =
    '<div class="part lg-st" id="lg-s1"><h3>' + S1.title + "</h3><p>" + S1.text + '</p><div class="sym lg-stg"><div><div id="lg-s1p"></div></div>' +
    '<div><p class="lg-bh">' + S1.chipsLab + '</p><div class="chips" id="lg-s1c" role="group" aria-label="Probe x"></div><p class="tiny muted">' + S1.note + "</p>" +
    '<dl class="read" id="lg-s1r" aria-live="polite"></dl><p class="lg-rel">' + S1.rel + '</p><details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + S1.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details></div></div></div>" +
    '<div class="part lg-st" id="lg-s2"><h3>' + S2.title + "</h3><p>" + S2.text + '</p><p class="lg-dom">' + S2.domain + '</p><div class="lg-routes">' + S2.routes.map(function(r){
      return '<div class="lg-route" data-r="' + r.id + '"><h4>' + r.title + '</h4><ol class="lg-lines" aria-live="polite"></ol><p class="lg-val"></p><div class="lg-rpl"></div></div>'; }).join("") +
    '</div><div id="lg-s2done" aria-live="polite"></div><details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + S2.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details></div>" +
    '<div class="part lg-st" id="lg-s3"><h3>' + S3.title + "</h3><p>" + S3.text + '</p><div class="sym lg-stg"><div><div class="plot-wrap"><canvas class="plot" id="lg-k" role="img" aria-label="Graph of y = ln(kx) and y = ln x"></canvas></div></div>' +
    '<div><label class="slider lg-sl"><span class="slider-top"><span>' + S3.k + '</span><output id="lg-kout"></output></span><input type="range" id="lg-ks" min="0.25" max="8" step="0.25" style="accent-color:var(--ink)" aria-label="k"></label>' +
    '<label class="slider lg-sl"><span class="slider-top"><span>' + S3.x + '</span><output id="lg-x3out"></output></span><input type="range" id="lg-x3" min="0.5" max="6" step="0.5" style="accent-color:var(--ink)" aria-label="Tangents at x"></label>' +
    '<dl class="read" id="lg-s3r" aria-live="polite"></dl><p class="lg-note3">' + S3.note + "</p></div></div></div>";

  // ---- Station 1: g and ln g on linked panels ----
  var gF = function(x){ return x * x + 1; }, lgF = function(x){ return Math.log(x * x + 1); };
  var GV = { xmin:-3.3, xmax:3.3 };
  var d1 = derivativePanels($("#lg-s1p", host), { kinds:["g", "lg"], x:S.x1, step:0.25,
    dom:function(){ return { lo:-3, hi:3, excl:[] }; },
    draw:function(i, p, x){
      var ink = css("--ink"), F = i === 0 ? gF : lgF, y = F(x), s = i === 0 ? 2 * x : 2 * x / (x * x + 1);
      var V = i === 0 ? { xmin:GV.xmin, xmax:GV.xmax, ymin:-1, ymax:10.6 } : { xmin:GV.xmin, xmax:GV.xmax, ymin:-0.7, ymax:2.7 };
      p.draw({ view:V, xLabel:"x", yLabel:"y", curves:[{ f:F, color:i === 0 ? css("--pen") : css("--f3"), width:3 }],
        lines:[{ p:[x, y], q:[x + 1, y + s], color:ink, width:2 }], points:[{ x:x, y:y, r:6, color:ink }],
        after:function(ctx, pl){ probeLine(ctx, pl, x); bgText(ctx, "slope " + (Math.abs(s * 1000 - Math.round(s * 1000)) < 1e-6 ? "= " : "≈ ") + fx(s, 3), pl.X(x) + (x > 1.2 ? -12 : 12), pl.Y(y) - 20, x > 1.2 ? "right" : "left", ink, ui(13, 700)); },
        describe:(i === 0 ? "Graph of g(x) = x² + 1" : "Graph of y = ln(x² + 1)") + " with the tangent at x = " + num(x, 2) + ", slope " + fx(s, 3) + "." });
    },
    handle:function(x){ return { x:x, y:gF(x), label:"Probe on g at x = " + num(x, 2) }; },
    onMove:function(x){ S.x1 = x; api.save(); paintS1(); } });
  d1.caps[0].innerHTML = swatch("--pen") + " " + S1.capG; d1.caps[1].innerHTML = swatch("--f3") + " " + S1.capL;
  function paintS1(){
    var x = S.x1, g = gF(x), dg = 2 * x, ratio = dg / g, sl = slopeAt(lgF, x), R = S1.rows;
    $("#lg-s1r", host).innerHTML = MV.readoutHTML([[R.g, dec(g, 4)], [R.dg, dec(dg, 4)], [R.ratio, (dg === 0 ? "0" : dec(ratio, 3))], [R.sl, "≈ " + fx(sl, 3) + (Math.abs(sl - ratio) < 5e-4 ? ' <span class="lg-ok">' + S1.same + "</span>" : "")]]);
    MV.keepFocus($("#lg-s1c", host), function(){
      $("#lg-s1c", host).innerHTML = [-2, -1, 0, 1, 2].map(function(v){ var on = near(x, v); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-s1x="' + v + '" data-k="s1x' + v + '" aria-pressed="' + on + '">' + m("x = " + v) + "</button>"; }).join("");
    });
  }
  paintS1(); d1.render();

  // ---- Station 2: two routes, line by line ----
  function routeHost(r){ return $('.lg-route[data-r="' + r.id + '"]', host); }
  function paintDone(){
    var all = S2.routes.every(function(r){ return (S.r[r.id] | 0) >= r.lines.length + 1; });
    $("#lg-s2done", host).innerHTML = all ? MV.fbHTML("good", "<strong>✓</strong> " + S2.done) : "";
  }
  S2.routes.forEach(function(r){
    var el = routeHost(r), n = r.lines.length, saved = clamp(S.r[r.id] | 0, 0, n + 1);
    MV.player($(".lg-rpl", el), { count:n + 2, interval:1500,
      label:function(i){ return tpl(S2.used, [Math.min(i, n)]); },
      render:function(i){
        S.r[r.id] = i; api.save();
        $(".lg-lines", el).innerHTML = i === 0 ? '<li class="lg-empty">' + S2.start + "</li>" : r.lines.slice(0, Math.min(i, n)).map(function(l){ return '<li><span class="lg-rule">' + l.r + '</span><span class="lg-le">' + l.e + "</span></li>"; }).join("");
        $(".lg-val", el).innerHTML = i > n ? r.val : "";
        paintDone();
      } }).go(saved);
  });

  // ---- Station 3: ln(kx) vs ln x ----
  var kp = new MV.Plot($("#lg-k", host), { xmin:-0.3, xmax:8.4, ymin:-3.2, ymax:4.6 });
  function drawK(){
    var k = S.k, x = S.x3, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), lk = Math.log(k);
    var g = function(t){ return t > 0 ? Math.log(k * t) : NaN; }, y0 = Math.log(x), y1 = g(x), s = slopeAt(g, x);
    var sc = { view:{ xmin:-0.3, xmax:8.4, ymin:-3.2, ymax:4.6 }, xLabel:"x", yLabel:"y",
      curves:[{ f:LN, color:ink2, width:2, dash:[6, 6], domain:[0.0004, 9] }, { f:g, color:pen, width:3, domain:[0.0004, 9] }],
      lines:[{ p:[x, y0], q:[x + 1, y0 + 1 / x], color:ink2, width:1.6, dash:[3, 4] }, { p:[x, y1], q:[x + 1, y1 + s], color:ink, width:2 }],
      points:[{ x:x, y:y0, r:5, color:ink2 }, { x:x, y:y1, r:6, color:ink }], segments:[] };
    var xa = 7.2;
    if (Math.abs(lk) > 0.15) sc.segments.push({ x1:xa, y1:Math.log(xa), x2:xa, y2:Math.log(k * xa), color:ink, width:1.8, arrow:true });
    sc.after = function(ctx, p){
      if (Math.abs(lk) > 0.15) bgText(ctx, "ln k ≈ " + fx(lk, 2), p.X(xa) - 10, p.Y((Math.log(xa) + Math.log(k * xa)) / 2), "right", ink, ui(13, 700));
      bgText(ctx, "y = ln(kx)", p.X(1.1), p.Y(g(1.1)) - 20, "center", pen, mfont(15));
      bgText(ctx, "y = ln x", p.X(4.2), p.Y(Math.log(4.2)) + (lk >= 0 ? 20 : -20), "center", ink2, mfont(14));
    };
    sc.describe = "Graph of y = ln(" + num(k, 2) + "x) in blue and the dashed ghost y = ln x. The curve is shifted " + (lk >= 0 ? "up" : "down") + " by ln " + num(k, 2) + " ≈ " + fx(Math.abs(lk), 2) + ". At x = " + num(x, 1) + " both tangents have slope " + fx(1 / x, 3) + ": they are parallel.";
    kp.draw(sc);
  }
  kp.render = drawK;
  function paintS3(){
    var k = S.k, x = S.x3, lk = Math.log(k), s = slopeAt(function(t){ return Math.log(k * t); }, x), R = S3.rows;
    $("#lg-ks", host).value = k; $("#lg-kout", host).textContent = num(k, 2);
    $("#lg-x3", host).value = x; $("#lg-x3out", host).textContent = num(x, 1);
    $("#lg-s3r", host).innerHTML = MV.readoutHTML([[R.shift, m("ln " + num(k, 2)) + " " + (near(k, 1) ? "= 0" : "≈ " + fx(lk, 3))],
      [R.sk, "≈ " + fx(s, 3)], [R.s1, m("1/" + num(x, 1)) + " " + dec(1 / x, 3)]]);
    drawK();
  }
  paintS3();

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.s1x != null) { d1.set(+b.dataset.s1x, "set"); S.x1 = d1.get(); api.save(); paintS1(); }
  });
  $("#lg-ks", host).addEventListener("input", function(e){ S.k = +e.target.value; api.save(); paintS3(); });
  $("#lg-x3", host).addEventListener("input", function(e){ S.x3 = +e.target.value; api.save(); paintS3(); });
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Tangents and rates ----------
// @component V8 designBoxes (adapted from MCV4U 25 / 21: values with e and ln through V8 lnExact) — labelled answer boxes per item:
// single values, points "(□, □)" and lines "y = □x + □"; named wrong states ({k, eq} a whole value, or {k, i, v} one component),
// a "give the exact value" message for decimals close to the answer, first-try scoring and three-level help.
function ratesAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q lg-dq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="lg-din"></div><div class="lg-dcl"></div></div>';
  }).join("");
  function bx(it, x, k, label){ return boxHTML(k, x.v[k], label, "", x.solved); }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .lg-din', host);
    var h = '<div class="lg-dt">' + it.boxes.map(function(b){
      var lab = MV.plain(b.pre || "");
      if (b.line) return '<div class="lg-dr"><span class="lg-fl">' + m("y =") + "</span>" + bx(it, x, b.k + "0", "slope") + '<span class="lg-fl">' + m("x +") + "</span>" + bx(it, x, b.k + "1", "y-intercept") + "</div>";
      if (b.pt) return '<div class="lg-dr"><span class="lg-dl">' + b.pre + '</span><span class="lg-dpt">(' + bx(it, x, b.k + "0", lab + ": x") + ", " + bx(it, x, b.k + "1", lab + ": y") + ")</span></div>";
      return '<div class="lg-dr"><span class="lg-dl">' + b.pre + "</span>" + bx(it, x, b.k, lab) + "</div>";
    }).join("") + "</div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .lg-dcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), vals = {}, decs = false, i, b;
    function one(k){ var r = String(x.v[k] || "").trim(); if (!r) return "fill"; var p = lnParse(r); if (p.err) return p.err === "lnneg" ? "lnneg" : "err"; if (p.dec) decs = true; return p.v; }
    function bad(v){ return v === "fill" || v === "err" || v === "lnneg"; }
    function errOf(v){ return { err:v === "fill" ? TX.fill : v === "lnneg" ? TX.lnneg : TX.err }; }
    for (i = 0; i < it.boxes.length; i++) {
      b = it.boxes[i];
      if (b.pt || b.line) { var p0 = one(b.k + "0"), p1 = one(b.k + "1"); if (p0 === "fill" || p1 === "fill") return errOf("fill"); if (bad(p0)) return errOf(p0); if (bad(p1)) return errOf(p1); vals[b.k] = [p0, p1]; }
      else { var p = one(b.k); if (bad(p)) return errOf(p); vals[b.k] = p; }
    }
    function same(k, A, tol){
      var V = vals[k];
      if (Array.isArray(A)) { if (!Array.isArray(V) || V.length !== A.length) return false; return V.every(function(v, j){ return near(v, A[j], tol); }); }
      return typeof V === "number" && near(V, A, tol);
    }
    var keys = Object.keys(ans);
    if (keys.every(function(k){ return same(k, ans[k], 1e-9); })) return { ok:true };
    var W = it.wrong || [];
    for (i = 0; i < W.length; i++) {
      var w = W[i], V = vals[w.k];
      if (w.eq != null && same(w.k, w.eq, 1e-9)) return { msg:w.fb };
      if (w.i != null && Array.isArray(V) && near(V[w.i], w.v, 1e-9)) return { msg:w.fb };
    }
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
// ---------- Performance task: Low point, f(x) = a ln x + bx ----------
function fSrc(a, b){
  var s = (a === 1 ? "" : a === -1 ? "-" : a + " ") + "ln x", bb = Math.abs(b);
  return s + (b > 0 ? " + " : " - ") + (bb === 1 ? "" : bb) + "x";
}
function dSrc(a, b){ return (a < 0 ? "-" : "") + "{" + Math.abs(a) + "}/{x}" + (b > 0 ? " + " : " - ") + Math.abs(b); }
var task = (function(){
  var api, plot;
  function gi(k, lo, hi){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= lo && v <= hi ? v : null; }
  function read(){ var a = gi("a", -12, 12), b = gi("b", -6, 6); return { a:a, b:b, valid:a !== null && b !== null && a !== 0 && b !== 0 }; }
  function checks(D){
    if (!D.valid) return [false, false, false, false];
    return [D.a + 2 * D.b === 0, D.a < 0, D.b >= 3, D.a + D.b * Math.E < 4];
  }
  function preview(){
    var D = read(), L = api.content.labels, rd = $("#lp-read"), pen = css("--pen"), ink = css("--ink");
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + L.invalid + "</p>";
      plot.draw({ view:{ xmin:-0.3, xmax:8.4, ymin:-4, ymax:6 }, xLabel:"x", yLabel:"y", describe:"Empty graph: choose a and b." });
      return;
    }
    var a = D.a, b = D.b, f = function(x){ return x > 0 ? a * Math.log(x) + b * x : NaN; };
    var d2 = a / 2 + b, dd2 = -a / 4, f1 = b, fe = a + b * Math.E, f2 = f(2), horiz = d2 === 0;
    var rows = [[L.fRow, m(fSrc(a, b))], [L.dRow, m(dSrc(a, b))],
      [L.d2, horiz ? m("0") + " (" + L.flat + ")" : m(String(r9(d2)))],
      [L.dd2, m(String(r9(dd2))) + " (" + (dd2 > 0 ? L.up : L.down) + ")"], [L.f1, m(String(f1))], [L.fe, m(a + " + " + (b < 0 ? "(" + b + ")" : b) + "e") + " ≈ " + num(fe, 2)]];
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
    var lo = Infinity, hi = -Infinity;
    for (var i = 0; i <= 80; i++) { var t = 0.35 + 7.65 * i / 80, v = f(t); if (isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }
    [0, f1, fe, f2].forEach(function(v){ lo = Math.min(lo, v); hi = Math.max(hi, v); });
    var pad = (hi - lo) * 0.15 || 1, V = { xmin:-0.3, xmax:8.4, ymin:lo - pad, ymax:hi + pad };
    plot.draw({ view:V, xLabel:"x", yLabel:"y", curves:[{ f:f, color:pen, width:3, domain:[0.0005, 8] }],
      lines:[{ p:[2, f2], q:[3, f2 + d2], color:ink, width:2 }],
      points:[{ x:1, y:f1, r:5, color:ink }, { x:Math.E, y:fe, r:5, color:ink }, { x:2, y:f2, r:6, color:ink, ring:true }],
      after:function(ctx, pl){
        bgText(ctx, "f(1) = " + String(f1).replace("-", MINUS), pl.X(1) - 10, pl.Y(f1) + (f1 >= f2 ? -18 : 18), "right", ink, ui(12, 700));
        bgText(ctx, "f(e) ≈ " + fx(fe, 2), pl.X(Math.E) + 12, pl.Y(fe) + (fe >= f2 ? -18 : 18), "left", ink, ui(12, 700));
        bgText(ctx, horiz ? "f′(2) = 0" : "f′(2) = " + fx(d2, 1), pl.X(2), pl.Y(f2) + (dd2 > 0 ? 24 : -24), "center", ink, ui(12, 700));
      },
      describe:"Graph of f(x) = " + MV.plain(m(fSrc(a, b))) + " for x from 0 to 8, with the tangent at x = 2" + (horiz ? ", which is horizontal" : ", slope " + num(d2, 1)) + ". f(1) = " + f1 + " and f(e) is about " + num(fe, 2) + "." });
  }
  function stepper(k, range, lo, hi){
    var L = api.content.labels;
    return '<div class="lp-step"><label for="lp-' + k + '"><span class="m">' + L[k] + '</span> <span class="tiny muted">' + range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="lp' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="lp-' + k + '" data-tk="' + k + '" type="number" min="' + lo + '" max="' + hi + '" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="lp' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  var LIM = { a:[-12, 12], b:[-6, 6] };
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (a.S.a == null) { a.S.a = "1"; a.S.b = "1"; }
      inp.innerHTML = '<div class="lp-in"><p class="tiny" style="font-weight:700;margin:0">' + m("f(x) = a ln x + bx") + "</p>" + stepper("a", L.rangeA, -12, 12) + stepper("b", L.rangeB, -6, 6) + "</div>";
      pv.innerHTML = '<div id="lp-read" aria-live="polite"></div><p class="tiny lp-gh">' + L.graph + '</p><div class="plot-wrap"><canvas class="plot" id="lp-plot" role="img" aria-label="Graph of f"></canvas></div>';
      plot = new MV.Plot($("#lp-plot"), { xmin:-0.3, xmax:8.4, ymin:-4, ymax:6 }); plot.render = preview;
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, lim = LIM[k], cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        var nv = clamp(cur + +b.dataset.dir, lim[0], lim[1]); if (nv === 0) nv = clamp(nv + +b.dataset.dir, lim[0], lim[1]) || cur;
        a.S[k] = String(nv); $("#lp-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : api.content.labels.invalid; },
    checks:checks,
    key:function(D){ return D.a + "|" + D.b; },
    label:function(k){ var s = k.split("|"); return m("(a, b) = (" + s.join(", ") + ")"); },
    text:function(k){ return "(a, b) = (" + k.split("|").map(function(v){ return v.replace("-", MINUS); }).join(", ") + ")"; }
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
