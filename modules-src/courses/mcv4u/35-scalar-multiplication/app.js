// MCV4U 35 Multiplication of a Vector by a Scalar: hero (u⃗ on its dashed track while a violet k runs 1 → 2 → ½ → 0 → −1 → −2),
// Stretch dial (Explore: V3 vectorBoard in Stretch / Unit / Combine modes), Vectors in geometry (Part 3: three dynamic-geometry
// stations with draggable vertices), Express it (Practice 2: N4 coefficient boxes over a fixed triangle OAB) and the
// "Undo the stretch" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
// m() source for a number ("-1.5"; −0 becomes "0") and plain text with a true minus
function ns(v){ var r = Math.round(v * 1e6) / 1e6; return String(r + 0); }
function nt(v){ return ns(v).replace("-", MINUS); }
function evenFmt(t){ return Math.round(t) % 2 ? "" : num(t); }
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
function segBtns(name, opts, val, label, dis){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (String(val) === String(o.id)) + '"' + (dis ? " disabled" : "") + ">" + MV.md(o.t) + "</button>"; }).join("") + "</span>";
}
// arrow segment (null when too short to draw)
function arr(x1, y1, x2, y2, color, width, alpha){
  if (Math.hypot(x2 - x1, y2 - y1) < 1e-6) return null;
  return { x1:x1, y1:y1, x2:x2, y2:y2, color:color, width:width, arrow:true, alpha:alpha };
}
function push(list, s){ if (s) list.push(s); }
// label beyond the tip of an arrow (pixel offset along the arrow, or along its left normal)
function tipLabel(ctx, p, x0, y0, x1, y1, text, color, side){
  var X0 = p.X(x0), Y0 = p.Y(y0), X1 = p.X(x1), Y1 = p.Y(y1), dx = X1 - X0, dy = Y1 - Y0, L = Math.hypot(dx, dy) || 1;
  var ux = dx / L, uy = dy / L, ox = side ? -uy * 18 : ux * 20, oy = side ? ux * 18 : uy * 20;
  bgText(ctx, text, clamp(X1 + ox, 24, p.W - 24), clamp(Y1 + oy, 14, p.H - 14), "center", color, mfont(15));
}

// ---------- exact magnitudes ----------
function sqf(N){ var s = 1, t = N; for (var f = 2; f * f <= t; f++) while (t % (f * f) === 0) { t /= f * f; s *= f; } return { s:s, t:t }; }
// |(x, y)| as m() source ("5", "√5", "1.5√5"); components that are multiples of 1/4 are exact, others approximate
function magSrc(x, y){
  var X = Math.round(x * 4), Y = Math.round(y * 4);
  if (!near(X, x * 4, 1e-7) || !near(Y, y * 4, 1e-7)) return "≈ " + num(Math.hypot(x, y), 2);
  var N = X * X + Y * Y; if (!N) return "0";
  var r = sqf(N), c = r.s / 4;
  return r.t === 1 ? ns(c) : (near(c, 1) ? "" : ns(c)) + "√" + r.t;
}
function qTxt(n, d){ var q = Q.of(n, d); return (q.n < 0 ? MINUS : "") + Math.abs(q.n) + (q.d > 1 ? "/" + q.d : ""); }
// component x·M/|u|^D with N = |u|², rationalized: "3/5", "2√5/5"
function compTxt(x, M, D, N){
  if (!D) return nt(x * M);
  var r = sqf(N);
  if (r.t === 1) return qTxt(x * M, r.s);
  var q = Q.of(x * M, r.s * r.t);
  if (q.n === 0) return "0";
  return (q.n < 0 ? MINUS : "") + (Math.abs(q.n) === 1 ? "" : Math.abs(q.n)) + "√" + r.t + (q.d > 1 ? "/" + q.d : "");
}
function termSrc(c, name){ if (near(c, 0)) return null; var v = "vec{" + name + "}"; return near(c, 1) ? v : near(c, -1) ? "-" + v : ns(c) + v; }
function comboSrc(s, t){
  var a = termSrc(s, "u"), b = termSrc(t, "v");
  if (!a && !b) return "vec{0}";
  if (!a) return b; if (!b) return a;
  return a + (b.charAt(0) === "-" ? " - " + b.slice(1) : " + " + b);
}
function runRise(x, y){ return "run " + nt(x) + ", rise " + nt(y); }

// =====================================================================================================================
// ---------- Hero ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var V = { xmin:-6.5, xmax:6.5, ymin:-3.4, ymax:3.4 }, U = [2, 1], pl = new MV.Plot(cv, V), st = { k:1, fin:false };
  function kTxt(k){ var r = Math.round(k * 100) / 100; return near(r, 0.5) ? "½" : nt(r); }
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), ac = css("--acol"), segs = [], pts = [], k = st.k;
    segs.push({ x1:-4 * U[0], y1:-4 * U[1], x2:4 * U[0], y2:4 * U[1], color:ink2, width:1.5, dash:[6, 6], alpha:0.6 });
    if (st.fin) {
      push(segs, arr(0, 0, 2 * U[0], 2 * U[1], ink, 4.5)); push(segs, arr(0, 0, -2 * U[0], -2 * U[1], ink, 4.5));
      push(segs, arr(0, 0, U[0], U[1], pen, 3));
    } else if (Math.abs(k) < 0.03) pts.push({ x:0, y:0, r:6, color:pen });
    else push(segs, arr(0, 0, k * U[0], k * U[1], pen, 3.5));
    pl.draw({ view:V, equal:true, ticks:false, segments:segs, points:pts,
      after:function(ctx, p){
        if (st.fin) {
          tipLabel(ctx, p, 0, 0, U[0], U[1], "u⃗", pen, true);
          tipLabel(ctx, p, 0, 0, 2 * U[0], 2 * U[1], "2u⃗", ink);
          tipLabel(ctx, p, 0, 0, -2 * U[0], -2 * U[1], MINUS + "2u⃗", ink);
          bgText(ctx, "same line, every time", p.W - 10, 18, "right", ink, ui(14, 700));
        } else {
          bgText(ctx, "k = " + kTxt(k), 12, 18, "left", ac, mfont(18));
          if (Math.abs(k) < 0.03) bgText(ctx, "0⃗", p.X(0) + 14, p.Y(0) - 18, "left", pen, mfont(16));
          else tipLabel(ctx, p, 0, 0, k * U[0], k * U[1], (near(k, 1) ? "" : kTxt(k)) + "u⃗", pen);
        }
      },
      describe:st.fin ? "The vectors u, 2u and −2u all lie on one dashed track line through the origin: same line, every time." :
        "The arrow k u on its dashed track with k = " + kTxt(k) + "." });
    if (f.cap) f.cap.innerHTML = st.fin ? "Same line, every time: " + m("vec{u}") + ", " + m("2vec{u}") + " and " + m("-2vec{u}") + "." :
      m("@a{k} = " + (near(Math.round(k * 100) / 100, 0.5) ? "½" : ns(Math.round(k * 100) / 100))) + ": " + (Math.abs(k) < 0.03 ? m("0vec{u} = vec{0}") : k < 0 ? "reversed" : "same direction");
  }
  pl.render = draw;
  function fin(){ st.fin = true; draw(); }
  if (MV.reduceMotion) { fin(); return; }
  draw();
  var seq = [2, 0.5, 0, -1, -2], i = 0;
  function next(){
    if (i >= seq.length) { MV.wait(1100, fin); return; }
    var a = st.k, b = seq[i++];
    MV.tween({ dur:900, step:function(t){ st.k = a + (b - a) * t; draw(); }, done:function(){ st.k = b; draw(); MV.wait(850, next); } });
  }
  MV.wait(800, next);
}

// =====================================================================================================================
// ---------- Explore: Stretch dial ----------
// @component V3 vectorBoard — 2D vector board (course plan V3; MCV4U 35, self-contained): equal-scale grid −10 to 10, draggable
// tips (MV.drag, whole-number snapping −8 to 8, arrow keys), arrows with heads via Plot segments. Modes: Stretch (u⃗ on a dashed
// --ink-2 track through the origin, k u⃗ thick --ink, violet k slider −3 to 3 step 0.25, optional fixed w⃗ in --f3 with k locked),
// Unit (dashed unit circle, Divide by |u⃗| / Multiply by L with exact rationalized components) and Combine (s u⃗ then t v⃗ tip to
// tail, result thick --ink). Readouts are exact (magSrc / compTxt above).
var VW = { xmin:-10, xmax:10, ymin:-10, ymax:10 }, URNG = 8, W3 = [2, -3];
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, R = T.rows, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function okV(a){ return Array.isArray(a) && a.length === 2 && a.every(function(z){ return Number.isInteger(z) && Math.abs(z) <= URNG; }) && !!(a[0] || a[1]); }
  function okN(v, lo, hi, st){ return typeof v === "number" && v >= lo - 1e-9 && v <= hi + 1e-9 && near(Math.round(v / st) * st, v, 1e-9); }
  if (["stretch", "unit", "combine"].indexOf(S.mode) < 0) S.mode = "stretch";
  if (!okV(S.u)) S.u = [3, 4];
  if (!okV(S.v)) S.v = [3, 1];
  if (!okN(S.k, -3, 3, 0.25)) S.k = 1;
  if (!okN(S.s, -3, 3, 0.5)) S.s = 1;
  if (!okN(S.t, -3, 3, 0.5)) S.t = 1;
  if (!Number.isInteger(S.L) || S.L < 1 || S.L > 20) S.L = 10;
  S.ud = !!S.ud; S.umul = !!S.umul; S.wOn = !!S.wOn;
  if (S.wOn) S.k = 1;
  if (!Array.isArray(S.found)) S.found = [];
  var busy = false, stop = null, note = null, anim = null, ctrlMode = null;

  host.innerHTML = '<div class="smv-ex"><div class="smv-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot smv-board" id="smv-board" role="img" aria-label="Vector board"></canvas></div>' +
    '<p class="tiny muted smv-key" id="smv-key"></p></div>' +
    '<div class="smv-side"><div class="smv-ctl" id="smv-mode"></div><p class="tiny muted smv-note" id="smv-dnote"></p>' +
    '<div id="smv-ctrls"></div><dl class="read smv-read" id="smv-read" aria-live="polite"></dl></div></div>';
  var board = new MV.Plot($("#smv-board", host), VW);
  board.render = draw;

  function mag(a){ return Math.hypot(a[0], a[1]); }
  function N2(a){ return a[0] * a[0] + a[1] * a[1]; }
  function unitRes(){ var f = (S.umul ? S.L : 1) / (S.ud ? mag(S.u) : 1); return [S.u[0] * f, S.u[1] * f]; }
  function comb(){ return [S.s * S.u[0] + S.t * S.v[0], S.s * S.u[1] + S.t * S.v[1]]; }
  function off(x, y){ return Math.abs(x) > 10 || Math.abs(y) > 10; }

  // ---- drawing ----
  function describe(){
    var u = S.u, k = S.k;
    if (S.mode === "stretch") {
      var d = near(k, 0) ? "the zero vector" : "a vector of length " + MV.plain(m(magSrc(k * u[0], k * u[1]))) + " pointing " + (k > 0 ? "the same way" : "the opposite way");
      return "u has run " + nt(u[0]) + ", rise " + nt(u[1]) + ". k = " + nt(k) + " gives " + d + "." + (S.wOn ? " The fixed vector w has run 2, rise −3." : "");
    }
    if (S.mode === "unit") {
      var r = unitRes();
      return "u has run " + nt(u[0]) + ", rise " + nt(u[1]) + ", length " + MV.plain(m(magSrc(u[0], u[1]))) + ", with a dashed unit circle at its tail." +
        (S.ud || S.umul ? " The result has length " + (S.ud ? (S.umul ? S.L : 1) : MV.plain(m(magSrc(r[0], r[1])))) + "." : "");
    }
    var c = comb();
    return "u has run " + nt(u[0]) + ", rise " + nt(u[1]) + "; v has run " + nt(S.v[0]) + ", rise " + nt(S.v[1]) + ". " +
      MV.plain(m(comboSrc(S.s, S.t))) + " has run " + nt(c[0]) + ", rise " + nt(c[1]) + ".";
  }
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), f3 = css("--f3"), u = S.u, segs = [], pts = [], labs = [];
    var sc = { view:VW, equal:true, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:1, fmt:evenFmt }, segments:segs, points:pts };
    if (S.mode === "stretch") {
      var L = mag(u), ex = 40 / L, k = S.k, kx = k * u[0], ky = k * u[1];
      segs.push({ x1:-u[0] * ex, y1:-u[1] * ex, x2:u[0] * ex, y2:u[1] * ex, color:ink2, width:1.5, dash:[6, 6], alpha:0.6 });
      if (S.wOn) { push(segs, arr(0, 0, W3[0], W3[1], f3, 3)); labs.push([0, 0, W3[0], W3[1], "w⃗", f3, true]); }
      if (Math.abs(k) < 0.03) { pts.push({ x:0, y:0, r:6, color:ink }); }
      else { push(segs, arr(0, 0, kx, ky, ink, 5.5)); labs.push([0, 0, kx, ky, (near(k, 1) ? "" : near(k, -1) ? MINUS : nt(Math.round(k * 100) / 100)) + "u⃗", ink, false]); }
      push(segs, arr(0, 0, u[0], u[1], pen, 3));
      labs.push([0, 0, u[0], u[1], "u⃗", pen, true]);
      pts.push({ x:u[0], y:u[1], r:5, color:pen });
      if (Math.abs(k) < 0.03) labs.push(["zero"]);
    } else if (S.mode === "unit") {
      var r = anim && anim.uf != null ? [u[0] * anim.uf, u[1] * anim.uf] : (S.ud || S.umul ? unitRes() : null);
      var longer = r && mag(r) > mag(u), isUnit = r && near(mag(r), 1, 1e-6);
      if (r && longer) push(segs, arr(0, 0, r[0], r[1], ink, 5.5));
      push(segs, arr(0, 0, u[0], u[1], pen, 3));
      if (r && !longer) push(segs, arr(0, 0, r[0], r[1], isUnit ? pen : ink, 5.5));
      pts.push({ x:u[0], y:u[1], r:5, color:pen });
      labs.push([0, 0, u[0], u[1], "u⃗", pen, true]);
      if (r && (S.ud || S.umul) && !anim) labs.push([0, 0, r[0], r[1], S.ud && !S.umul ? "unit" : S.ud ? "length " + S.L : "L u⃗", isUnit ? pen : ink, false]);
    } else {
      var cp = anim && anim.cp != null ? anim.cp : 2, a1 = Math.min(1, cp), a2 = clamp(cp - 1, 0, 1);
      var su = [S.s * u[0] * a1, S.s * u[1] * a1], tv = [S.t * S.v[0] * a2, S.t * S.v[1] * a2], c = [su[0] + tv[0], su[1] + tv[1]];
      push(segs, arr(0, 0, u[0], u[1], pen, 2, 0.45)); push(segs, arr(0, 0, S.v[0], S.v[1], f3, 2, 0.45));
      if (cp >= 2) push(segs, arr(0, 0, c[0], c[1], ink, 5.5));
      push(segs, arr(0, 0, su[0], su[1], pen, 3.5));
      push(segs, arr(su[0], su[1], c[0], c[1], f3, 3.5));
      pts.push({ x:u[0], y:u[1], r:5, color:pen }, { x:S.v[0], y:S.v[1], r:5, color:f3 });
      labs.push([0, 0, u[0], u[1], "u⃗", pen, true], [0, 0, S.v[0], S.v[1], "v⃗", f3, true]);
      if (cp >= 2 && (c[0] || c[1])) labs.push([0, 0, c[0], c[1], MV.plain(m(comboSrc(S.s, S.t))), ink, false]);
    }
    sc.after = function(ctx, p){
      if (S.mode === "unit") {
        ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.arc(p.X(0), p.Y(0), Math.abs(p.X(1) - p.X(0)), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
      labs.forEach(function(l){
        if (l[0] === "zero") { bgText(ctx, "0⃗", p.X(0) + 14, p.Y(0) - 18, "left", ink, mfont(16)); return; }
        tipLabel(ctx, p, l[0], l[1], l[2], l[3], l[4], l[5], l[6]);
      });
      if (note) bgText(ctx, note, p.W / 2, p.H - 18, "center", ink, ui(14, 700));
    };
    sc.describe = describe();
    board.draw(sc);
  }

  // ---- readout ----
  function readRows(){
    var u = S.u, uRow = [MV.md(R.u), runRise(u[0], u[1]) + "; " + m("|vec{u}| = " + magSrc(u[0], u[1]))];
    if (S.mode === "stretch") {
      var k = Math.round(S.k * 100) / 100, kx = k * u[0], ky = k * u[1];
      return [uRow, [MV.md(R.k), '<span class="p-a smv-kv">' + nt(k) + "</span>"],
        [MV.md(R.ku), runRise(kx, ky) + (off(kx, ky) ? " " + T.off : "")],
        [MV.md(R.kum), m(magSrc(kx, ky) + " = |" + ns(k) + "| × " + magSrc(u[0], u[1]))],
        [R.dir, MV.md(near(k, 0) ? T.zero : k > 0 ? T.same : T.opp)]];
    }
    if (S.mode === "unit") {
      var rows = [uRow, [MV.md(R.L), nt(S.L)]], N = N2(u);
      if (!S.ud && !S.umul) rows.push([R.res, MV.md(T.pressDiv)]);
      else {
        var M = S.umul ? S.L : 1, D = S.ud ? 1 : 0, r = unitRes();
        var val = "run " + m(compTxt(u[0], M, D, N)) + ", rise " + m(compTxt(u[1], M, D, N)) + "; " + T.length + " " + m(D ? String(M) : magSrc(r[0], r[1])) + (off(r[0], r[1]) ? " " + T.off : "");
        rows.push([MV.md(D && !S.umul ? R.unit : D ? R.lu : R.mu), val]);
      }
      return rows;
    }
    var c = comb();
    return [uRow, [MV.md(R.v), runRise(S.v[0], S.v[1])], [MV.md(R.st), m("s = " + ns(S.s)) + ", " + m("t = " + ns(S.t))],
      [R.res, m(comboSrc(S.s, S.t)) + " = " + runRise(c[0], c[1]) + (off(c[0], c[1]) ? " " + T.off : "")]];
  }
  function paintRead(){ $("#smv-read", host).innerHTML = MV.readoutHTML(readRows()); }

  // ---- controls ----
  function slider(id, label, min, max, step, col){
    return '<label class="slider smv-sl"><span class="slider-top"><span>' + MV.md(label) + '</span><output id="smv-' + id + 'o" style="color:' + col + '"></output></span>' +
      '<input type="range" id="smv-' + id + '" data-sl="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:' + col + '" aria-label="' + MV.esc(MV.plain(MV.md(label))) + '"></label>';
  }
  function buildCtrls(){
    ctrlMode = S.mode; var h = "";
    if (S.mode === "stretch") h = slider("k", T.kLabel, -3, 3, 0.25, "var(--acol)") + '<p class="tiny muted smv-note">' + MV.md(T.kNote) + "</p>" +
      '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="w" data-k="smvw"></button></div><div id="smv-w" class="smv-w"></div>';
    else if (S.mode === "unit") h = '<div class="smv-step"><span class="smv-sh">' + MV.md(T.L) + '</span><button type="button" class="btn ghost sm" data-act="Lm" data-k="smvLm" aria-label="Decrease L">' + MINUS + '</button>' +
      '<output id="smv-Lo" class="smv-Lo" aria-live="polite"></output><button type="button" class="btn ghost sm" data-act="Lp" data-k="smvLp" aria-label="Increase L">+</button></div>' +
      '<div class="q-actions smv-ub"><button type="button" class="btn sm" data-act="div" data-k="smvdiv">' + MV.md(T.div) + '</button><button type="button" class="btn sm" data-act="mul" data-k="smvmul">' + MV.md(T.mul) + "</button>" +
      '<button type="button" class="btn ghost sm" data-act="again" data-k="smvagain">' + T.again + '</button></div><p class="tiny muted smv-note">' + MV.md(T.unitNote) + "</p>";
    else h = slider("s", T.sLabel, -3, 3, 0.5, "var(--ink)") + slider("t", T.tLabel, -3, 3, 0.5, "var(--ink)") + '<p class="tiny muted smv-note">' + MV.md(T.stNote) + "</p>";
    $("#smv-ctrls", host).innerHTML = h;
  }
  function setSl(id, v, txt){ var el = $("#smv-" + id, host); if (!el) return; el.value = v; el.setAttribute("aria-valuetext", txt); $("#smv-" + id + "o", host).textContent = nt(Math.round(v * 100) / 100); }
  function syncCtrls(){
    if (ctrlMode !== S.mode) buildCtrls();
    MV.keepFocus($("#smv-mode", host), function(){ $("#smv-mode", host).innerHTML = '<span class="tiny smv-h">' + T.mode + "</span>" + segBtns("mode", C.modes, S.mode, T.mode, busy); });
    $("#smv-dnote", host).innerHTML = MV.md(S.mode === "combine" ? T.dragNoteC : T.dragNote);
    $("#smv-key", host).innerHTML = MV.md(S.mode === "unit" ? T.keyU : S.mode === "combine" ? T.keyC : T.key);
    if (S.mode === "stretch") {
      setSl("k", S.k, "k = " + nt(S.k)); $("#smv-k", host).disabled = busy || S.wOn;
      var wb = $('[data-act="w"]', host); wb.innerHTML = MV.md(S.wOn ? T.wOff : T.wOn); wb.setAttribute("aria-pressed", String(S.wOn)); wb.disabled = busy;
      $("#smv-w", host).innerHTML = S.wOn ? '<p class="tiny">' + MV.md(T.wNote) + "</p><p class=\"tiny\"><strong>" + T.found + "</strong> " +
        (S.found.length ? S.found.map(function(k){ return "(" + k.split(",").map(function(z){ return nt(+z); }).join(", ") + ")"; }).join(" and ") : '<span class="muted">' + T.noneFound + "</span>") + "</p>" : "";
    } else if (S.mode === "unit") {
      $("#smv-Lo", host).textContent = String(S.L);
      $('[data-act="Lm"]', host).disabled = busy || S.L <= 1; $('[data-act="Lp"]', host).disabled = busy || S.L >= 20;
      $('[data-act="div"]', host).disabled = busy || S.ud; $('[data-act="mul"]', host).disabled = busy || S.umul;
      $('[data-act="again"]', host).disabled = busy || !(S.ud || S.umul);
    } else {
      setSl("s", S.s, "s = " + nt(S.s)); setSl("t", S.t, "t = " + nt(S.t));
      $("#smv-s", host).disabled = busy; $("#smv-t", host).disabled = busy;
    }
  }
  function paintAll(){ syncCtrls(); paintRead(); draw(); }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function lock(on){ $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }
  function track(){
    if (S.mode !== "stretch" || !S.wOn) return;
    var key = S.u[0] + "," + S.u[1];
    if ((key === "4,-6" || key === "-4,6") && S.found.indexOf(key) < 0) S.found.push(key);
  }

  // ---- dragging ----
  MV.drag(board, {
    step:{ x:1, y:1 }, big:2,
    handles:function(){
      var h = [{ id:"u", x:S.u[0], y:S.u[1], label:"Tip of vector u at run " + nt(S.u[0]) + ", rise " + nt(S.u[1]) }];
      if (S.mode === "combine") h.push({ id:"v", x:S.v[0], y:S.v[1], label:"Tip of vector v at run " + nt(S.v[0]) + ", rise " + nt(S.v[1]) });
      return h;
    },
    snap:function(x, y){ return [clamp(Math.round(x), -URNG, URNG), clamp(Math.round(y), -URNG, URNG)]; },
    move:function(id, x, y){
      if (busy || (!x && !y)) return;
      var cur = id === "v" ? S.v : S.u;
      if (cur[0] === x && cur[1] === y) return;
      note = null;
      if (id === "v") S.v = [x, y];
      else { S.u = [x, y]; S.ud = false; S.umul = false; track(); }
      changed();
    }
  });

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b) || b.classList.contains("drag-h")) return;
    note = null;
    if (b.dataset.mode) { if (S.mode !== b.dataset.mode) { S.mode = b.dataset.mode; changed(); } return; }
    var a = b.dataset.act;
    if (a === "w") { S.wOn = !S.wOn; if (S.wOn) { S.k = 1; track(); } changed(); return; }
    if (a === "Lm" || a === "Lp") { S.L = clamp(S.L + (a === "Lp" ? 1 : -1), 1, 20); changed(); return; }
    if (a === "div") { S.ud = true; changed(); return; }
    if (a === "mul") { S.umul = true; changed(); return; }
    if (a === "again") { S.ud = false; S.umul = false; changed(); }
  });
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id || busy) return;
    var st = id === "k" ? 0.25 : 0.5, v = clamp(Math.round(+e.target.value / st) * st, -3, 3);
    if (id === "k" && S.wOn) return;
    note = null; S[id] = v + 0; changed();
  });
  host.addEventListener("keydown", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id || busy || !e.shiftKey) return;
    var d = /^Arrow(Right|Up)$/.test(e.key) ? 1 : /^Arrow(Left|Down)$/.test(e.key) ? -1 : 0; if (!d) return;
    if (id === "k" && S.wOn) return;
    e.preventDefault(); note = null; S[id] = clamp(S[id] + d, -3, 3); changed();
  });
  paintAll();

  // ---- challenges (plan's exact tests and named wrong states) ----
  function chal(id){
    var M = MS[id], u = S.u;
    if (id === "tc1") {
      if (!(u[0] === 2 && u[1] === -1)) return { ok:false, msg:M.setU };
      if (S.wOn) return { ok:false, msg:M.locked };
      if (near(S.k, -3)) return { ok:true };
      if (near(S.k, 3)) return { ok:false, msg:M.k3 };
      if (near(S.k, -1.5)) return { ok:false, msg:M.k15 };
      return { ok:false, msg:M.general };
    }
    if (id === "tc2") {
      if (!(u[0] === 3 && u[1] === -4)) return { ok:false, msg:M.setU };
      if (S.umul && !S.ud && S.L === 10) return { ok:false, msg:M.mulFirst };
      if (near(S.k, 10)) return { ok:false, msg:M.k10 };
      if (!(S.ud && S.umul && S.L === 10)) return { ok:false, msg:M.build };
      if (near(S.k, 2)) return { ok:true };
      if (near(S.k, -2)) return { ok:false, msg:M.kneg };
      return { ok:false, msg:M.kset };
    }
    var a = S.found.indexOf("4,-6") >= 0, b = S.found.indexOf("-4,6") >= 0;
    if (a && b) return { ok:true };
    if (!S.wOn) return { ok:false, msg:M.showW };
    var key = u[0] + "," + u[1];
    if (key === "4,-3") return { ok:false, msg:M.runOnly };
    if (key === "-3,2" || key === "3,2") return { ok:false, msg:M.swap };
    if (key === "2,-3") return { ok:false, msg:M.self };
    if (a || b) return { ok:false, msg:M.one };
    return { ok:false, msg:M.general };
  }

  // ---- predictions ----
  function tw(dur, step, cb){
    stop = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ step(t); syncCtrls(); paintRead(); draw(); },
      done:function(){ stop = null; cb(); } });
  }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; note = null; anim = null; S.wOn = false;
        if (p.id === "p1") { S.mode = "stretch"; S.u = [3, 4]; S.k = 1; }
        else if (p.id === "p2") { S.mode = "stretch"; S.u = [3, 4]; S.k = 2; }
        else if (p.id === "p3") { S.mode = "unit"; S.u = [3, 4]; S.ud = false; S.umul = false; }
        else { S.mode = "combine"; S.u = [1, 2]; S.v = [3, 1]; S.s = 2; S.t = -1; anim = { cp:0 }; }
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ anim = null; busy = false; lock(false); api.save(); paintAll(); MV.changed(); done(); }
        function hold(text){ note = text; draw(); MV.wait(1400, fin); }
        if (p.id === "p1") tw(2600, function(t){ S.k = Math.round((1 - 3 * t) * 100) / 100; }, function(){ S.k = -2; hold("|−2u⃗| = 10: twice as long, reversed"); });
        else if (p.id === "p2") tw(3600, function(t){ S.k = Math.round((2 - 4 * t) * 100) / 100; }, function(){ S.k = -2; hold("k u⃗ stays on u⃗’s line for every k"); });
        else if (p.id === "p3") { anim = { uf:1 }; tw(1800, function(t){ anim.uf = 1 - 0.8 * t; }, function(){ anim = null; S.ud = true; hold("length 1: run 3/5, rise 4/5"); }); }
        else tw(2800, function(t){ anim.cp = 2 * t; }, function(){ anim = null; hold("2u⃗ − v⃗ = run −1, rise 3"); });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}
// ------------------------------------------------- end of V3 vectorBoard ------------------------------------------------

// =====================================================================================================================
// ---------- Part 3: Vectors in geometry (three dynamic-geometry stations) ----------
// @component geoStations — module-specific (MCV4U 35): equal-scale grid −6 to 6 with draggable integer vertices (MV.drag, Tab +
// arrow keys; a vertex can't land on another), midsegment (MN⃗ thick --ink, BC⃗ --pen), collinearity test with an exact k
// (MV.mcv.Q) and a segment divided m:n with tick marks, exact readouts and an N13 step-through for the algebra.
var GV = { xmin:-6, xmax:6, ymin:-6, ymax:6 }, A3 = [-5, 1], B3 = [3, 5];
function sub(a, b){ return [a[0] - b[0], a[1] - b[1]]; }
function mid(a, b){ return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
function ptTxt(p){ return "(" + nt(p[0]) + ", " + nt(p[1]) + ")"; }
function part3(host, api){
  var S = api.S, C = api.content, L = C.labels, S1 = C.st1, S2 = C.st2, S3 = C.st3;
  function okP(p){ return Array.isArray(p) && p.length === 2 && p.every(function(z){ return Number.isInteger(z) && Math.abs(z) <= 6; }); }
  function okT(o){
    if (!o || !okP(o.A) || !okP(o.B) || !okP(o.C)) return false;
    var k = [o.A, o.B, o.C].map(String); return k[0] !== k[1] && k[0] !== k[2] && k[1] !== k[2];
  }
  if (!okT(S.t1)) S.t1 = { A:[-1, 4], B:[-5, -3], C:[5, -2] };
  if (!okT(S.t2)) S.t2 = { A:[-4, -2], B:[-1, -1], C:[5, 1] };
  if ([1, 2, 3, 4].indexOf(S.m3) < 0) S.m3 = 2;
  if ([1, 2, 3, 4].indexOf(S.n3) < 0) S.n3 = 3;
  var R1 = S1.rows, R2 = S2.rows, R3 = S3.rows, NUMS = [1, 2, 3, 4].map(function(i){ return { id:i, t:String(i) }; });
  function block(id, st, canvasId, extra, side){
    return '<div class="part smv-st" id="' + id + '"><h3>' + st.title + "</h3><p>" + MV.md(st.text) + '</p><div class="sym smv-stg"><div><div class="plot-wrap"><canvas class="plot square smv-geo" id="' + canvasId + '" role="img" aria-label="' + MV.esc(st.fig) + '"></canvas></div>' +
      (extra || "") + "</div><div>" + side + "</div></div></div>";
  }
  var dn = '<p class="tiny muted smv-gnote">' + L.drag + "</p>";
  host.innerHTML =
    block("smv-s1", S1, "smv-g1", dn, '<dl class="read" id="smv-r1" aria-live="polite"></dl><p class="smv-ph">' + L.steps + '</p><ol class="smv-alg" id="smv-alg"></ol><div class="smv-apl"></div>') +
    block("smv-s2", S2, "smv-g2", dn, '<dl class="read" id="smv-r2" aria-live="polite"></dl>') +
    block("smv-s3", S3, "smv-g3", "", '<div class="smv-ctl" id="smv-mn"></div><dl class="read" id="smv-r3" aria-live="polite"></dl>');
  var g1 = new MV.Plot($("#smv-g1", host), GV), g2 = new MV.Plot($("#smv-g2", host), GV), g3 = new MV.Plot($("#smv-g3", host), GV);
  function base(){ return { view:GV, equal:true, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:1, fmt:evenFmt } }; }
  function line(a, b, color, w, dash){ return { x1:a[0], y1:a[1], x2:b[0], y2:b[1], color:color, width:w, dash:dash }; }
  function ptLabels(ctx, p, list, centre){
    list.forEach(function(q){
      var X = p.X(q[0][0]), Y = p.Y(q[0][1]), cx = p.X(centre[0]), cy = p.Y(centre[1]), dx = X - cx, dy = Y - cy, d = Math.hypot(dx, dy) || 1;
      bgText(ctx, q[1], clamp(X + dx / d * 18, 12, p.W - 12), clamp(Y + dy / d * 18, 12, p.H - 12), "center", q[2] || css("--ink"), mfont(15));
    });
  }
  function dragFor(plot, key, paint){
    MV.drag(plot, { step:{ x:1, y:1 }, big:2,
      handles:function(){ var P = S[key]; return ["A", "B", "C"].map(function(n){ return { id:n, x:P[n][0], y:P[n][1], label:"Point " + n + " at " + ptTxt(P[n]) }; }); },
      snap:function(x, y){ return [clamp(Math.round(x), -6, 6), clamp(Math.round(y), -6, 6)]; },
      move:function(id, x, y){
        var P = S[key], clash = ["A", "B", "C"].some(function(n){ return n !== id && P[n][0] === x && P[n][1] === y; });
        if (clash || (P[id][0] === x && P[id][1] === y)) return;
        P[id] = [x, y]; api.save(); paint(); MV.changed();
      } });
  }

  // ---- Station 1: the midsegment ----
  function paint1(){
    var P = S.t1, A = P.A, B = P.B, Cc = P.C, M = mid(A, B), N = mid(A, Cc), ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen");
    var sc = base(), mn = sub(N, M), bc = sub(Cc, B), cen = [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3];
    sc.segments = [line(A, B, ink2, 1.6), line(A, Cc, ink2, 1.6)];
    push(sc.segments, arr(B[0], B[1], Cc[0], Cc[1], pen, 3.5)); push(sc.segments, arr(M[0], M[1], N[0], N[1], ink, 4.5));
    sc.points = [A, B, Cc].map(function(q){ return { x:q[0], y:q[1], r:5.5, color:ink }; }).concat([M, N].map(function(q){ return { x:q[0], y:q[1], r:5, color:ink, open:true }; }));
    sc.after = function(ctx, p){ ptLabels(ctx, p, [[A, "A"], [B, "B"], [Cc, "C"], [M, "M"], [N, "N"]], cen); };
    sc.describe = "Triangle with A at " + ptTxt(A) + ", B at " + ptTxt(B) + " and C at " + ptTxt(Cc) + ". M " + ptTxt(M) + " and N " + ptTxt(N) +
      " are the midpoints of AB and AC. MN has length " + MV.plain(m(magSrc(mn[0], mn[1]))) + " and BC has length " + MV.plain(m(magSrc(bc[0], bc[1]))) + ": MN is parallel to BC and half as long.";
    g1.draw(sc);
    $("#smv-r1", host).innerHTML = MV.readoutHTML([[MV.md(R1.mn), m(magSrc(mn[0], mn[1]))], [MV.md(R1.bc), m(magSrc(bc[0], bc[1]))], [MV.md(R1.ratio), S1.ratio], [R1.par, MV.md(S1.par)]]);
  }
  g1.render = paint1;
  dragFor(g1, "t1", paint1);
  paint1();
  var algOl = $("#smv-alg", host);
  function renderAlg(i){
    algOl.innerHTML = S1.alg.map(function(l, j){ return j > i ? "" : '<li class="' + (j === i ? "cur" : "") + '">' + MV.md(l) + "</li>"; }).join("");
  }
  MV.player($(".smv-apl", host), { count:S1.alg.length, interval:2000, label:function(i){ return L.line + " " + (i + 1) + " of " + S1.alg.length; }, render:renderAlg });
  renderAlg(0);

  // ---- Station 2: collinear or not? ----
  function verdict(A, B, Cc){
    var ab = sub(B, A), ac = sub(Cc, A), cr = ab[0] * ac[1] - ab[1] * ac[0];
    if (cr !== 0) return { col:false, html:MV.md(S2.no) };
    var k = Q.of(ab[0] * ac[0] + ab[1] * ac[1], ab[0] * ab[0] + ab[1] * ab[1]), kv = k.n / k.d;
    var kS = k.d === 1 ? (k.n === -1 ? "-" : ns(k.n)) : Q.src(k), head = m("vec{AC} = " + kS + "vec{AB}") + ": ", txt;
    if (kv > 1) txt = S2.far.replace("{f}", m(Q.src(Q.div(Q.of(1, 1), k))));
    else if (kv > 0) txt = S2.near.replace("{f}", m(Q.src(k)));
    else txt = S2.between;
    return { col:true, k:kv, html:head + MV.md(txt) };
  }
  function paint2(){
    var P = S.t2, A = P.A, B = P.B, Cc = P.C, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), v = verdict(A, B, Cc);
    var sc = base(), ab = sub(B, A), ac = sub(Cc, A), cen = [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3];
    sc.segments = [];
    if (v.col) { var e = 30 / Math.hypot(ab[0], ab[1]); sc.segments.push({ x1:A[0] - ab[0] * e, y1:A[1] - ab[1] * e, x2:A[0] + ab[0] * e, y2:A[1] + ab[1] * e, color:ink2, width:1.5, dash:[6, 6], alpha:0.6 }); }
    push(sc.segments, arr(A[0], A[1], Cc[0], Cc[1], ink, 4.5)); push(sc.segments, arr(A[0], A[1], B[0], B[1], pen, 3));
    sc.points = [A, B, Cc].map(function(q){ return { x:q[0], y:q[1], r:5.5, color:ink }; });
    if (v.col) { var dx = Cc[0] - A[0], dy = Cc[1] - A[1]; cen = [cen[0] - dy, cen[1] + dx]; }
    sc.after = function(ctx, p){ ptLabels(ctx, p, [[A, "A"], [B, "B"], [Cc, "C"]], cen); };
    sc.describe = "Points A " + ptTxt(A) + ", B " + ptTxt(B) + " and C " + ptTxt(Cc) + " with the vectors AB and AC. " + MV.plain(v.html);
    g2.draw(sc);
    $("#smv-r2", host).innerHTML = MV.readoutHTML([[MV.md(R2.ab), runRise(ab[0], ab[1])], [MV.md(R2.ac), runRise(ac[0], ac[1])], [R2.verdict, v.html]]);
  }
  g2.render = paint2;
  dragFor(g2, "t2", paint2);
  paint2();

  // ---- Station 3: dividing a segment ----
  function paint3(){
    var mm = S.m3, nn = S.n3, tot = mm + nn, ab = sub(B3, A3), Pt = [A3[0] + ab[0] * mm / tot, A3[1] + ab[1] * mm / tot];
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3"), sc = base();
    sc.segments = [line(A3, B3, ink2, 2)];
    push(sc.segments, arr(0, 0, A3[0], A3[1], ink2, 2)); push(sc.segments, arr(0, 0, B3[0], B3[1], ink2, 2));
    push(sc.segments, arr(A3[0], A3[1], Pt[0], Pt[1], pen, 3.5)); push(sc.segments, arr(0, 0, Pt[0], Pt[1], ink, 4.5));
    sc.points = [{ x:A3[0], y:A3[1], r:5.5, color:ink }, { x:B3[0], y:B3[1], r:5.5, color:ink }, { x:Pt[0], y:Pt[1], r:6, color:f3, ring:true }, { x:0, y:0, r:4, color:ink }];
    sc.after = function(ctx, p){
      var dx = p.X(B3[0]) - p.X(A3[0]), dy = p.Y(B3[1]) - p.Y(A3[1]), d = Math.hypot(dx, dy), nx = -dy / d * 7, ny = dx / d * 7;
      ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 2;
      for (var i = 1; i < tot; i++) { var X = p.X(A3[0] + ab[0] * i / tot), Y = p.Y(A3[1] + ab[1] * i / tot); ctx.beginPath(); ctx.moveTo(X - nx, Y - ny); ctx.lineTo(X + nx, Y + ny); ctx.stroke(); }
      ctx.restore();
      ptLabels(ctx, p, [[A3, "A"], [B3, "B"], [Pt, "P", f3]], [0, 6]);
      bgText(ctx, "O", p.X(0) + 12, p.Y(0) + 14, "left", ink, mfont(15));
    };
    sc.describe = "Segment AB from A(−5, 1) to B(3, 5) cut into " + tot + " equal parts. P is " + mm + " parts from A, at (" + qTxt(5 * -tot + 8 * mm, tot) + ", " + qTxt(tot + 4 * mm, tot) + "). Vectors OA, OB and OP start at the origin.";
    g3.draw(sc);
    function fr(a, b){ var q = Q.of(a, b); return "{" + a + "}/{" + b + "}" + (q.d !== b ? " = " + Q.src(q) : ""); }
    MV.keepFocus($("#smv-mn", host), function(){
      $("#smv-mn", host).innerHTML = '<div class="smv-mrow"><span class="smv-sh">' + MV.md(S3.m) + "</span>" + segBtns("m3", NUMS, mm, "m") + '</div><div class="smv-mrow"><span class="smv-sh">' + MV.md(S3.n) + "</span>" + segBtns("n3", NUMS, nn, "n") + "</div>";
    });
    $("#smv-r3", host).innerHTML = MV.readoutHTML([[R3.ratio, mm + ":" + nn], [MV.md(R3.ap), m(fr(mm, tot) + " vec{AB}")],
      [MV.md(R3.op), m("{" + nn + "}/{" + tot + "} vec{OA} + {" + mm + "}/{" + tot + "} vec{OB}")], [R3.p, "(" + qTxt(-5 * tot + 8 * mm, tot) + ", " + qTxt(tot + 4 * mm, tot) + ")"]]);
  }
  g3.render = paint3;
  paint3();
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.m3) { S.m3 = +b.dataset.m3; api.save(); paint3(); MV.changed(); return; }
    if (b.dataset.n3) { S.n3 = +b.dataset.n3; api.save(); paint3(); MV.changed(); }
  });
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Express it (@component N4 coefBoxes — "□a⃗ + □b⃗" coefficient boxes, fractions accepted, first-try scoring) ----------
function triSVG(label){
  var O = [30, 200], A = [120, 30], B = [330, 200], M = mid(A, B), N = mid(O, A), P = [O[0] + (B[0] - O[0]) / 3, 200], G = [(O[0] + A[0] + B[0]) / 3, (O[1] + A[1] + B[1]) / 3];
  var Qp = [A[0] + 0.75 * (B[0] - A[0]), A[1] + 0.75 * (B[1] - A[1])];
  function ln(a, b, cls){ return '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" class="' + cls + '"/>'; }
  function dot(p, cls){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4.5" class="' + (cls || "smv-fd") + '"/>'; }
  function tx(p, t, dx, dy, cls){ return '<text x="' + (p[0] + dx) + '" y="' + (p[1] + dy) + '" class="' + (cls || "smv-ft") + '">' + t + "</text>"; }
  return '<svg class="smv-tri" viewBox="0 0 360 230" role="img" aria-label="' + MV.esc(label) + '" focusable="false">' +
    '<defs><marker id="smv-ha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="smv-fa"/></marker>' +
    '<marker id="smv-hb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="smv-fb"/></marker></defs>' +
    ln(A, B, "smv-fl") + ln(O, M, "smv-fm") + ln(O, A, "smv-fva") + ln(O, B, "smv-fvb") +
    dot(O) + dot(A) + dot(B) + dot(M) + dot(N) + dot(P) + dot(G) + dot(Qp) +
    tx(O, "O", -16, 6) + tx(A, "A", -6, -10) + tx(B, "B", 8, 6) + tx(M, "M", 9, -6) + tx(N, "N", -18, 0) + tx(P, "P", -4, 20) + tx(G, "G", -4, -10) + tx(Qp, "Q", 9, -4) +
    tx([62, 100], "a⃗", -14, 0, "smv-ft smv-fta") + tx([180, 200], "b⃗", 0, 20, "smv-ft smv-ftb") + "</svg>";
}
function expressAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ var x = S.it[id]; if (!x || typeof x !== "object") x = S.it[id] = { a:"", b:"", tries:0, hint:0, solved:false, first:null }; return x; }
  host.innerHTML = '<p class="how">' + MV.md(a.how) + '</p><figure class="smv-fig">' + triSVG(a.fig) + "</figure>" + a.items.map(function(it, i){
    return '<div class="q smv-xq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">Express ' + MV.md(it.v) + ".</div>" + (it.star ? '<span class="tag">★</span>' : "") +
      '</div><div class="smv-frame"></div><div class="smv-xcl"></div></div>';
  }).join("");
  function box(it, k, x){
    var nm = MV.plain(MV.md(it.v.split(",")[0]));
    return '<input class="numin short" data-bx="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="Coefficient of vector ' + k + " in " + MV.esc(nm) + '" value="' + MV.esc(x[k]) + '"' + (x.solved ? " disabled" : "") + ">";
  }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .smv-frame', host);
    MV.keepFocus(el, function(){ el.innerHTML = '<span class="smv-fl2">' + MV.md(it.v.split(",")[0]) + " =</span>" + box(it, "a", x) + '<span class="smv-fl2">' + m("vec{a}") + " +</span>" + box(it, "b", x) + '<span class="smv-fl2">' + m("vec{b}") + "</span>"; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .smv-xcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints.map(MV.md), x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + MV.md(it.display) + ".</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", MV.md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function val(raw){
    var t = String(raw == null ? "" : raw).trim(); if (!t) return { blank:true };
    var r = MV.parseNum(t); return r && r.length === 1 && isFinite(r[0]) ? { v:r[0] } : { bad:true };
  }
  function judge(it){
    var x = ist(it.id), va = val(x.a), vb = val(x.b);
    if (va.blank || vb.blank) return { err:TX.fill };
    if (va.bad || vb.bad) return { err:TX.err };
    var ans = MV.ans(it);
    if (near(va.v, ans.a, 1e-9) && near(vb.v, ans.b, 1e-9)) return { ok:true };
    var w = (it.wrong || []).filter(function(z){ return near(va.v, z.a, 1e-9) && near(vb.v, z.b, 1e-9); })[0];
    return { msg:w ? w.fb : TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q)[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
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
// ---------- Performance task: Undo the stretch ----------
var task = (function(){
  var api, plot, V = { xmin:-8, xmax:8, ymin:-8, ymax:8 };
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -6 && v <= 6 ? v : null; }
  function read(){ var k = api.S.k, x = gi("x"), y = gi("y"); return { k:k, x:x, y:y, valid:x !== null && y !== null && typeof k === "number" && !near(k, 0) }; }
  function checks(D){ if (!D.valid) return [false, false, false]; return [near(D.k * D.x, 6) && near(D.k * D.y, -6), D.k < 0, Math.abs(D.k) > 1]; }
  function preview(){
    var D = read(), Lb = api.content.labels, rd = $("#ut-read"), pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2");
    var sc = { view:V, equal:true, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:1, fmt:evenFmt }, segments:[], points:[] };
    push(sc.segments, { x1:0, y1:0, x2:6, y2:-6, color:ink2, width:2.5, dash:[7, 5], arrow:true });
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + MV.md(Lb.invalid) + "</p>";
      sc.describe = "The target (6, −6) as a dashed arrow; choose u."; plot.draw(sc); return;
    }
    var kx = D.k * D.x, ky = D.k * D.y;
    push(sc.segments, arr(0, 0, kx, ky, ink, 5.5)); push(sc.segments, arr(0, 0, D.x, D.y, pen, 3));
    if (!D.x && !D.y) sc.points.push({ x:0, y:0, r:5, color:pen });
    sc.after = function(ctx, p){
      bgText(ctx, "(6, " + MINUS + "6)", p.X(6) + 6, p.Y(-6) + 16, "center", ink2, ui(13, 700));
      if (D.x || D.y) tipLabel(ctx, p, 0, 0, D.x, D.y, "u⃗", pen, true);
      if (kx || ky) tipLabel(ctx, p, 0, 0, kx, ky, "k u⃗", ink, false);
    };
    sc.describe = "u has run " + nt(D.x) + ", rise " + nt(D.y) + "; k = " + nt(D.k) + " gives k u with run " + nt(kx) + ", rise " + nt(ky) + ". The target (6, −6) is a dashed arrow.";
    plot.draw(sc);
    var Rw = Lb.rows;
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML([[MV.md(Rw.u), runRise(D.x, D.y)], [MV.md(Rw.ku), runRise(kx, ky)],
      [MV.md(Rw.um), m(magSrc(D.x, D.y))], [MV.md(Rw.kum), m(magSrc(kx, ky) + " = |" + ns(D.k) + "| × " + magSrc(D.x, D.y))]]) + "</dl>";
  }
  function stepper(k, label){
    return '<div class="fs-step smv-tst"><label for="ut-' + k + '"><span>' + MV.md(label) + '</span> <span class="tiny muted">' + api.content.labels.range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="ut' + k + 'm" aria-label="Decrease the ' + MV.esc(MV.plain(MV.md(label))) + '">' + MINUS + "</button>" +
      '<input class="numin short" id="ut-' + k + '" data-tk="' + k + '" type="number" min="-6" max="6" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="ut' + k + 'p" aria-label="Increase the ' + MV.esc(MV.plain(MV.md(label))) + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var Lb = a.content.labels;
      if (typeof a.S.k !== "number" || near(a.S.k, 0) || Math.abs(a.S.k) > 3 || !near(Math.round(a.S.k * 2) / 2, a.S.k)) a.S.k = 1;
      if (a.S.x == null) { a.S.x = "6"; a.S.y = "-6"; }
      inp.innerHTML = '<div class="fs-in"><div id="ut-k"></div>' + stepper("x", Lb.run) + stepper("y", Lb.rise) + "</div>";
      pv.innerHTML = '<div id="ut-read" aria-live="polite"></div><p class="tiny fs-gh">' + MV.md(Lb.graph) + '</p><div class="plot-wrap"><canvas class="plot square smv-geo" id="ut-plot" role="img" aria-label="Vectors u and k u with the target"></canvas></div>';
      plot = new MV.Plot($("#ut-plot"), V); plot.render = preview;
      function upd(){ a.save(); preview(); a.update(); }
      MV.sliders($("#ut-k"), [{ id:"utk", label:MV.md(Lb.k), param:"a", min:-3, max:3, step:0.5, value:a.S.k, skip:[0], fmt:nt }], function(id, v){ a.S.k = v; upd(); });
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -6, 6)); $("#ut-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : MV.md(api.content.labels.invalid); },
    checks:checks,
    key:function(D){ return ns(D.k) + "|" + D.x + "|" + D.y; },
    label:function(k){ var s = k.split("|"); return m("k = " + s[0] + ", vec{u} = (" + s[1] + ", " + s[2] + ")"); },
    text:function(k){ var s = k.split("|").map(function(v){ return v.replace("-", MINUS); }); return "k = " + s[0] + ", u⃗ = (" + s[1] + ", " + s[2] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ express:expressAct },
  task:task
});

})();
