// MCV4U 49 Cartesian Equation of a Line in R²: hero (2x + 3y − 6 = 0 draws, the normal (2, 3) grows at (3, 0) with a
// right-angle mark, P slides along the line while the dashed arrow from (3, 0) stays at 90° to the normal), Normal dial
// (Explore: V3 vector board with draggable P₀, normal tip and test point, half-plane shading, and the V12 four-forms panel),
// Angles between lines (Part 3: two lines, normals or directions, a protractor arc and a turn slider), Find the coefficient
// (Practice 2: number and "□x + □y + □ = 0" entry, any multiple accepted) and the "Split the pair" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88; ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
// number as m() source ("-2", "1.5"), rounded to 2 dp
function fN(v){ var r = Math.round(v * 100) / 100; if (Math.abs(r) < 1e-9) r = 0; return String(r); }
function fT(v){ return fN(v).replace("-", MINUS); }
function coefTerm(c, v, first){
  var a = Math.abs(c), s = v ? (Math.abs(a - 1) < 1e-9 ? v : fN(a) + v) : fN(a);
  return first ? (c < 0 ? "-" : "") + s : (c < 0 ? " - " : " + ") + s;
}
// "2x + 3y - 6 = 0"
function eqSrc(A, B, C){
  var s = "";
  if (Math.abs(A) > 1e-9) s += coefTerm(A, "x", !s);
  if (Math.abs(B) > 1e-9) s += coefTerm(B, "y", !s);
  if (Math.abs(C) > 1e-9) s += coefTerm(C, "", !s);
  return (s || "0") + " = 0";
}
// "2(3) + 3(2) - 6": the left side evaluated at (x, y)
function valSrc(A, B, C, x, y){
  var s = "";
  function t(c, v){
    if (Math.abs(c) < 1e-9) return;
    var a = Math.abs(c), vs = Math.abs(a - 1) < 1e-9 ? (v < 0 ? "(" + fN(v) + ")" : fN(v)) : fN(a) + "(" + fN(v) + ")";
    s += s ? (c < 0 ? " - " : " + ") + vs : (c < 0 ? "-" : "") + vs;
  }
  t(A, x); t(B, y);
  if (C != null && Math.abs(C) > 1e-9) s += s ? (C < 0 ? " - " : " + ") + fN(Math.abs(C)) : fN(C);
  return s || "0";
}
function ptSrc(x, y){ return "(" + fN(x) + ", " + fN(y) + ")"; }
function sgn(v){ return Math.abs(v) < 1e-9 ? 0 : v > 0 ? 1 : -1; }
function parV(a, b, c, d){ return Math.abs(a * d - b * c) < 1e-9; }        // (a, b) ∥ (c, d)
// a number typed as a whole number, fraction or decimal (no expressions)
function parseV(t){
  var s = String(t == null ? "" : t).replace(/−/g, "-").replace(/\s+/g, "");
  if (!s) return null;
  var q = Q.raw(s); if (q && s !== "-" && s !== "+") return q.n / q.d;
  return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : NaN;
}

// =====================================================================================================================
// @component V3 vectorBoard (MCV4U 49; self-contained because 33–48 weren't built yet) — canvas helpers for vectors on an
// equal-scale grid: arrows drawn with their own alpha (the toolkit's segment head ignores alpha), right-angle marks between
// two data vectors, a line through a point clipped far outside the view, and half-plane shading (regions or bands) for
// Ax + By + C > 0. arrowD(ctx, p, x1, y1, x2, y2, color, width, {alpha, dash, head}); rightMark(ctx, p, x0, y0, u, v, color);
// lineSeg(x0, y0, dx, dy, half) -> segment; halfPlane(A, B, C, alpha) -> {regions, bands} for a Plot scene.
function arrowD(ctx, p, x1, y1, x2, y2, color, w, o){
  o = o || {};
  var X1 = p.X(x1), Y1 = p.Y(y1), X2 = p.X(x2), Y2 = p.Y(y2), ang = Math.atan2(Y2 - Y1, X2 - X1), L = Math.hypot(X2 - X1, Y2 - Y1), hs = o.head || 12;
  if (L < 2) return;
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w || 2.4; ctx.lineCap = "round";
  if (o.dash) ctx.setLineDash(o.dash);
  var ex = X2 - Math.cos(ang) * hs * 0.7, ey = Y2 - Math.sin(ang) * hs * 0.7;
  ctx.beginPath(); ctx.moveTo(X1, Y1); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(X2, Y2);
  ctx.lineTo(X2 - hs * Math.cos(ang - 0.4), Y2 - hs * Math.sin(ang - 0.4));
  ctx.lineTo(X2 - hs * Math.cos(ang + 0.4), Y2 - hs * Math.sin(ang + 0.4));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function rightMark(ctx, p, x0, y0, u, v, color, size){
  var X = p.X(x0), Y = p.Y(y0), s = size || 11, lu = Math.hypot(u[0], u[1]), lv = Math.hypot(v[0], v[1]);
  if (lu < 1e-9 || lv < 1e-9) return;
  var ux = u[0] / lu * s, uy = -u[1] / lu * s, vx = v[0] / lv * s, vy = -v[1] / lv * s;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.beginPath();
  ctx.moveTo(X + ux, Y + uy); ctx.lineTo(X + ux + vx, Y + uy + vy); ctx.lineTo(X + vx, Y + vy); ctx.stroke(); ctx.restore();
}
function lineSeg(x0, y0, dx, dy, half){
  var L = Math.hypot(dx, dy); if (L < 1e-12) return null; var h = half == null ? 40 : half;
  return { x1:x0 - dx / L * h, y1:y0 - dy / L * h, x2:x0 + dx / L * h, y2:y0 + dy / L * h };
}
function halfPlane(A, B, C, alpha){
  var col = css("--hi-soft");
  if (Math.abs(B) > 1e-9) {
    var f = function(x){ return (-A * x - C) / B; };
    return { regions:[B > 0 ? { f:function(){ return 1e3; }, g:f, color:col, alpha:alpha } : { f:f, g:function(){ return -1e3; }, color:col, alpha:alpha }], bands:[] };
  }
  var x0 = -C / A;
  return { regions:[], bands:[A > 0 ? { x0:x0, x1:1e3, color:col, alpha:alpha } : { x0:-1e3, x1:x0, color:col, alpha:alpha }] };
}
// --------------------------------------------------- end of V3 vectorBoard -----------------------------------------------

// ---------- hero ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var V = { xmin:-4, xmax:7.5, ymin:-3.2, ymax:6 }, p = new MV.Plot(cv, V, { equal:true });
  var D = [3, -2], st = { line:0, nrm:0, u:0, typed:0, done:false };
  var CAP = "(2, 3) · (x " + MINUS + " 3, y " + MINUS + " 0) = 0 ⟶ 2x + 3y " + MINUS + " 6 = 0";
  function draw(){
    var ink = css("--ink"), f4 = css("--f4"), ink2 = css("--ink-2"), segs = [], half = 9 * st.line;
    if (st.line > 0.01) { var s = lineSeg(3, 0, D[0], D[1], half); s.color = ink; s.width = 3; segs.push(s); }
    var Px = 3 + 3 * st.u, Py = -2 * st.u, showP = st.nrm >= 1 && Math.abs(st.u) > 0.04;
    p.draw({ view:V, equal:true, xLabel:"x", yLabel:"y", segments:segs,
      points:(showP ? [{ x:Px, y:Py, r:6, color:ink }] : []).concat(st.line > 0.5 ? [{ x:3, y:0, r:5.5, color:ink }] : []),
      after:function(ctx, pp){
        if (showP) arrowD(ctx, pp, 3, 0, Px, Py, ink2, 2.2, { dash:[6, 5] });
        if (st.nrm > 0.02) arrowD(ctx, pp, 3, 0, 3 + 2 * st.nrm, 3 * st.nrm, f4, 3.2);
        if (st.nrm >= 1) rightMark(ctx, pp, 3, 0, st.u < -0.04 ? [-D[0], -D[1]] : D, [2, 3], ink2, 12);
        if (st.nrm >= 1) bgText(ctx, "n = (2, 3)", pp.X(5) + 8, pp.Y(3) - 4, "left", f4, mfont(15));
        if (st.line > 0.5) bgText(ctx, "(3, 0)", pp.X(3) + 10, pp.Y(0) + 16, "left", ink, ui(13));
        if (showP) bgText(ctx, "P", pp.X(Px) - 10, pp.Y(Py) - 14, "right", ink, mfont(15));
        if (st.line >= 1) bgText(ctx, "2x + 3y " + MINUS + " 6 = 0", pp.X(-3.4), pp.Y(4.9), "left", ink, mfont(15));
      },
      describe:"The line 2x + 3y − 6 = 0" + (st.nrm >= 1 ? ", with the normal (2, 3) drawn from (3, 0) and a right-angle mark" : "") +
        (showP ? ". A point P at about (" + num(Px, 1) + ", " + num(Py, 1) + ") on the line; the dashed arrow from (3, 0) to P is at 90° to the normal." : ".") });
    if (f.cap) f.cap.innerHTML = st.done ? m("(2, 3) · (x - 3, y - 0) = 0") + " ⟶ " + m("2x + 3y - 6 = 0") : MV.esc(CAP.slice(0, st.typed)) || "&nbsp;";
  }
  p.render = draw;
  function fin(){ st.line = 1; st.nrm = 1; st.u = -1; st.typed = CAP.length; st.done = true; draw(); }
  if (MV.reduceMotion) { fin(); return; }
  draw();
  var lin = function(t){ return t; };
  function tw(dur, step, cb){ MV.tween({ dur:dur, ease:lin, step:step, done:cb }); }
  MV.wait(500, function(){
    tw(1100, function(t){ st.line = t; draw(); }, function(){
      tw(900, function(t){ st.nrm = t; draw(); }, function(){
        st.nrm = 1;
        tw(4200, function(t){ st.typed = Math.round(t * CAP.length); }, function(){});
        tw(1300, function(t){ st.u = -1.5 * t; draw(); }, function(){
          tw(1800, function(t){ st.u = -1.5 + 2.5 * t; draw(); }, function(){
            tw(1200, function(t){ st.u = 1 - 2 * t; draw(); }, fin);
          });
        });
      });
    });
  });
}

// =====================================================================================================================
// ---------- Explore: Normal dial (V3 vector board + V12 four forms) ----------
var NR = 6, PR = 6, VB = 8;          // normal components −6..6, P₀ and Q −6..6, board −8..8
var FORMS = {
  cart:{ keys:["A", "B", "C"], parts:[{ k:"A" }, "x +", { k:"B" }, "y +", { k:"C" }, "= 0"] },
  vec:{ keys:["x0", "y0", "m1", "m2"], parts:["vec{r} = (", { k:"x0" }, ",", { k:"y0" }, ") + t(", { k:"m1" }, ",", { k:"m2" }, ")"] },
  par:{ keys:["x0", "m1", "y0", "m2"], parts:["x =", { k:"x0" }, "+", { k:"m1" }, "t,", "y =", { k:"y0" }, "+", { k:"m2" }, "t"] },
  si:{ keys:["m", "b"], parts:["y =", { k:"m" }, "x +", { k:"b" }] }
};
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function okInt(v, r){ return typeof v === "number" && Number.isInteger(v) && Math.abs(v) <= r; }
  if (["normal", "test", "convert"].indexOf(S.mode) < 0) S.mode = "normal";
  if (!okInt(S.px, PR) || !okInt(S.py, PR)) { S.px = 3; S.py = 0; }
  if (!okInt(S.A, NR) || !okInt(S.B, NR) || (S.A === 0 && S.B === 0)) { S.A = 2; S.B = 3; }
  if (!okInt(S.qx, PR) || !okInt(S.qy, PR)) { S.qx = 3; S.qy = 2; }
  S.cv = S.cv || {};
  var busy = false, hide = {}, note = null, notes = {}, stop = null;

  host.innerHTML = '<div class="cl-ex"><div class="cl-main" data-mv="graph"><p class="eq-cap cl-eq" id="cl-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot square cl-board" id="cl-board" role="img" aria-label="Normal dial board"></canvas></div>' +
    '<p class="tiny muted cl-key">' + MV.md(T.key) + "</p></div>" +
    '<div class="cl-side"><div class="cl-ctl" id="cl-mode"></div>' +
    '<div class="cl-nbox" id="cl-nbox"></div>' +
    '<p class="tiny muted cl-note">' + MV.md(T.dragNote) + '</p>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="reset" data-k="clreset">' + T.reset + "</button></div>" +
    '<dl class="read cl-read" id="cl-read" aria-live="polite"></dl></div></div>' +
    '<div id="cl-forms" class="cl-forms"></div>';
  var board = new MV.Plot($("#cl-board", host), { xmin:-VB, xmax:VB, ymin:-VB, ymax:VB }, { equal:true });
  board.render = draw;

  function Cv(){ return -(S.A * S.px + S.B * S.py); }
  function tipIn(){ var x = S.px + S.A, y = S.py + S.B; return Math.abs(x) <= VB && Math.abs(y) <= VB; }
  var drag = MV.drag(board, {
    handles:function(){
      var h = [{ id:"p0", x:S.px, y:S.py, label:"Point P0 at (" + fT(S.px) + ", " + fT(S.py) + ")" }];
      if (tipIn()) h.push({ id:"tip", x:S.px + S.A, y:S.py + S.B, label:"Tip of the normal n = (" + fT(S.A) + ", " + fT(S.B) + ")" });
      if (S.mode === "test") h.push({ id:"q", x:S.qx, y:S.qy, label:"Test point Q at (" + fT(S.qx) + ", " + fT(S.qy) + ")" });
      return h;
    },
    snap:function(x, y){ return [Math.round(x), Math.round(y)]; },
    move:function(id, x, y){
      if (busy) return;
      if (id === "p0") { S.px = clamp(x, -PR, PR); S.py = clamp(y, -PR, PR); }
      else if (id === "q") { S.qx = clamp(x, -PR, PR); S.qy = clamp(y, -PR, PR); }
      else {
        var a = clamp(clamp(x, -VB, VB) - S.px, -NR, NR), b = clamp(clamp(y, -VB, VB) - S.py, -NR, NR);
        if (a === 0 && b === 0) return;
        S.A = a; S.B = b;
      }
      note = null; syncForms(); changed();
    }
  });

  // ---- drawing ----
  function describe(){
    var A = S.A, B = S.B, c = Cv(), s = "Line " + MV.plain(m(eqSrc(A, B, c))) + " through P0 (" + fT(S.px) + ", " + fT(S.py) + "), normal (" + fT(A) + ", " + fT(B) + "), direction (" + fT(B) + ", " + fT(-A) + ").";
    if (S.mode === "test") { var v = A * S.qx + B * S.qy + c; s += " Test point (" + fT(S.qx) + ", " + fT(S.qy) + ") gives " + fT(v) + (v > 0 ? ": the normal’s side." : v < 0 ? ": the other side." : ": on the line.") + " A(−2, 1) gives " + fT(-2 * A + B + c) + " and B(4, 3) gives " + fT(4 * A + 3 * B + c) + "."; }
    return s;
  }
  function draw(){
    var A = S.A, B = S.B, c = Cv(), ink = css("--ink"), ink2 = css("--ink-2"), f4 = css("--f4"), pen = css("--pen"), test = S.mode === "test";
    var sc = { view:{ xmin:-VB, xmax:VB, ymin:-VB, ymax:VB }, equal:true, xLabel:"x", yLabel:"y", segments:[], points:[], regions:[], bands:[] };
    if (test && !hide.shade) { var hp = halfPlane(A, B, c, hide.shadeA == null ? 1 : hide.shadeA); sc.regions = hp.regions; sc.bands = hp.bands; }
    if (!hide.line) { var s = lineSeg(S.px, S.py, B, -A, hide.lineFrac == null ? 40 : 40 * hide.lineFrac); if (s) { s.color = ink; s.width = 3; sc.segments.push(s); } }
    if (test) {
      sc.points.push({ x:-2, y:1, r:5, color:ink2, open:true }, { x:4, y:3, r:5, color:ink2, open:true });
      sc.points.push({ x:S.qx, y:S.qy, r:6.5, color:ink, ring:true });
    }
    sc.points.push({ x:S.px, y:S.py, r:6.5, color:ink, ring:true });
    sc.after = function(ctx, p){
      if (!hide.dir) arrowD(ctx, p, S.px, S.py, S.px + B, S.py - A, pen, 2.6, { alpha:0.55 });
      arrowD(ctx, p, S.px, S.py, S.px + A, S.py + B, f4, 3.2);
      if (!hide.line) rightMark(ctx, p, S.px, S.py, [B, -A], [A, B], ink2, 11);
      var tx = S.px + A, ty = S.py + B, right = p.X(tx) < p.W - 90;
      bgText(ctx, "n = (" + fT(A) + ", " + fT(B) + ")", p.X(tx) + (right ? 10 : -10), clamp(p.Y(ty) - 14, 14, p.H - 14), right ? "left" : "right", f4, mfont(14));
      bgText(ctx, "P₀", p.X(S.px) - 10, clamp(p.Y(S.py) + 18, 14, p.H - 14), "right", ink, mfont(14));
      if (test) {
        bgText(ctx, "A", p.X(-2) - 9, p.Y(1) - 13, "right", ink2, mfont(14));
        bgText(ctx, "B", p.X(4) + 9, p.Y(3) - 13, "left", ink2, mfont(14));
        bgText(ctx, "Q", p.X(S.qx) + 10, p.Y(S.qy) - 14, "left", ink, mfont(14));
      }
      if (note) bgText(ctx, note.text, p.X(note.x), p.Y(note.y), "center", ink, ui(13, 700));
    };
    sc.describe = describe();
    board.draw(sc);
  }

  // ---- side panel ----
  function radioSeg(name, opts, val, label){
    return '<span class="seg cl-seg" role="radiogroup" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
      return '<button type="button" role="radio" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-checked="' + (val === o.id) + '" tabindex="' + (val === o.id ? 0 : -1) + '">' + MV.md(o.t) + "</button>"; }).join("") + "</span>";
  }
  function paintSide(){
    var md = $("#cl-mode", host), nb = $("#cl-nbox", host);
    MV.keepFocus(md, function(){ md.innerHTML = '<span class="tiny cl-h">' + T.mode + "</span>" + radioSeg("mode", C.modes, S.mode, T.mode); });
    MV.keepFocus(nb, function(){
      nb.innerHTML = '<p class="tiny cl-h">' + MV.md(T.nH) + ' <span class="muted">' + T.nRange + "</span></p>" + ["A", "B"].map(function(k){
        return '<span class="cl-step"><span class="m"><i>' + k + "</i></span>" +
          '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="clst' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
          '<output class="cl-out" aria-live="polite">' + fT(S[k]) + "</output>" +
          '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="clst' + k + 'p" aria-label="Increase ' + k + '">+</button></span>';
      }).join("");
    });
  }
  function paintEq(){
    var e = $("#cl-eq", host);
    e.innerHTML = hide.rows ? m("@c{vec{n}} = (" + fN(S.A) + ", " + fN(S.B) + ")") : m(eqSrc(S.A, S.B, Cv())) + ' <span class="tiny muted">' + m("@c{vec{n}} = (" + fN(S.A) + ", " + fN(S.B) + ")") + "</span>";
  }
  function paintRead(){
    var A = S.A, B = S.B, c = Cv(), R = T.rows, q = "?", rows = [];
    rows.push([MV.md(R.n), m("(" + fN(A) + ", " + fN(B) + ")")]);
    rows.push([MV.md(R.m), hide.rows ? q : m("(" + fN(B) + ", " + fN(-A) + ")")]);
    var wk = '<button type="button" class="btn ghost sm cl-wk" data-act="work" data-k="clwork" aria-expanded="' + !!S.work + '">' + (S.work ? T.hideWork : T.work) + "</button>" +
      (S.work ? '<span class="cl-work">' + m("C = -(" + valSrc(A, B, null, S.px, S.py) + ") = " + fN(c)) + "</span>" : "");
    rows.push([MV.md(R.cart), hide.rows ? q : m(eqSrc(A, B, c)) + " " + wk]);
    var si = Math.abs(B) < 1e-9 ? T.vertical + " " + m("x = " + fN(-c / A)) : m(Q.src(Q.of(Math.round(-A * 1e6), Math.round(B * 1e6)))) + "; " + m(Q.src(Q.of(Math.round(-c * 1e6), Math.round(B * 1e6))));
    rows.push([MV.md(R.slope), hide.rows ? q : si]);
    rows.push([MV.md(R.vec), hide.rows ? q : m("vec{r} = " + ptSrc(S.px, S.py) + " + t(" + fN(B) + ", " + fN(-A) + ")")]);
    if (S.mode === "test") {
      var v = A * S.qx + B * S.qy + c, sd = sgn(v);
      rows.push([MV.md(R.test), hide.test ? q : m("Q" + ptSrc(S.qx, S.qy)) + ": " + m(valSrc(A, B, c, S.qx, S.qy) + " = " + fN(v) + (sd > 0 ? " > 0" : sd < 0 ? " < 0" : "")) + ", " + MV.md(sd > 0 ? T.side.pos : sd < 0 ? T.side.neg : T.side.zero)]);
      var va = -2 * A + B + c, vb = 4 * A + 3 * B + c;
      rows.push([MV.md(R.a), m("A(-2, 1)") + ": " + m(fN(va))]);
      rows.push([MV.md(R.b), m("B(4, 3)") + ": " + m(fN(vb))]);
    }
    var rd = $("#cl-read", host);
    MV.keepFocus(rd, function(){ rd.innerHTML = MV.readoutHTML(rows); });
  }

  // ---- V12 four forms (Convert mode) ----
  function derived(){
    var A = S.A, B = S.B, c = Cv(), o = { cart:{ A:fT(A), B:fT(B), C:fT(c) }, vec:{ x0:fT(S.px), y0:fT(S.py), m1:fT(B), m2:fT(-A) } };
    o.par = { x0:o.vec.x0, y0:o.vec.y0, m1:o.vec.m1, m2:o.vec.m2 };
    o.si = B === 0 ? { m:"", b:"" } : { m:Q.txt(Q.of(-A, B)), b:Q.txt(Q.of(-c, B)) };
    return o;
  }
  function syncForms(except){ var d = derived(); Object.keys(FORMS).forEach(function(k){ if (k !== except) { S.cv[k] = d[k]; notes[k] = null; } }); }
  function partHTML(fm, p, i, n){
    if (typeof p === "string") return '<span class="cl-fl">' + m(p) + "</span>";
    var v = (S.cv[fm] || {})[p.k];
    return '<input class="numin short cl-box" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-fm="' + fm + '" data-fk="' + p.k + '" data-k="clfm' + fm + p.k + '" aria-label="' + MV.esc(T.forms[fm] + " form, box " + (i + 1) + " of " + n) + '" value="' + MV.esc(v == null ? "" : v) + '">';
  }
  function paintForm(fm){
    var el = $('[data-form="' + fm + '"]', host); if (!el) return;
    var F = FORMS[fm], n = F.keys.length, bi = 0;
    MV.keepFocus(el, function(){
      el.querySelector(".cl-frow").innerHTML = F.parts.map(function(p){ var h = partHTML(fm, p, bi, n); if (typeof p !== "string") bi++; return h; }).join("");
    });
    paintNote(fm);
  }
  function paintNote(fm){
    var el = $('[data-form="' + fm + '"] .cl-fnote', host); if (!el) return;
    var k = notes[fm];
    if (!k && fm === "si" && S.B === 0) k = "vertical";
    el.innerHTML = k ? MV.md(T.formNote[k]) : "";
    el.className = "tiny cl-fnote" + (k === "ok" ? " cl-good" : k ? " muted" : "");
  }
  function paintForms(){
    var h = $("#cl-forms", host);
    if (S.mode !== "convert") { h.innerHTML = ""; return; }
    if (!h.firstChild) h.innerHTML = '<p class="cl-ph">' + T.formsH + '</p><div class="cl-fgrid">' + Object.keys(FORMS).map(function(fm){
      return '<div class="cl-form" data-form="' + fm + '"><p class="tiny cl-fh">' + T.forms[fm] + '</p><div class="cl-frow"></div><p class="tiny cl-fnote" aria-live="polite"></p></div>'; }).join("") + "</div>";
    Object.keys(FORMS).forEach(paintForm);
  }
  function applyLine(A, B, c){
    if (A === 0 && B === 0) return "zero";
    if (Math.abs(A) > NR || Math.abs(B) > NR) { var g = gcd(gcd(A, B), c) || 1; A /= g; B /= g; c /= g; }
    if (Math.abs(A) > NR || Math.abs(B) > NR) return "range";
    var best = null, bd = 1e9;
    for (var x = -PR; x <= PR; x++) for (var y = -PR; y <= PR; y++) if (A * x + B * y + c === 0) { var d = Math.hypot(x - S.px, y - S.py); if (d < bd) { bd = d; best = [x, y]; } }
    if (!best) return "none";
    S.A = A; S.B = B; S.px = best[0]; S.py = best[1];
    return "ok";
  }
  function tryForm(fm){
    var v = S.cv[fm] || {}, F = FORMS[fm], q = {}, i, r;
    for (i = 0; i < F.keys.length; i++) {
      var t = String(v[F.keys[i]] == null ? "" : v[F.keys[i]]).trim();
      if (!t) return "fill";
      var qq = Q.raw(t); if (!qq) return "err";
      if (fm !== "si" && qq.d !== 1) return "err";
      q[F.keys[i]] = qq;
    }
    if (fm === "cart") return applyLine(q.A.n, q.B.n, q.C.n);
    if (fm === "si") {
      var L = q.m.d * q.b.d / gcd(q.m.d, q.b.d), A = q.m.n * L / q.m.d, B = -L, c = q.b.n * L / q.b.d;
      if (A < 0) { A = -A; B = -B; c = -c; }
      var g = gcd(gcd(A, B), c) || 1;
      return applyLine(A / g, B / g, c / g);
    }
    var x0 = q.x0.n, y0 = q.y0.n, m1 = q.m1.n, m2 = q.m2.n;
    if (m1 === 0 && m2 === 0) return "zero";
    if (Math.abs(x0) > PR || Math.abs(y0) > PR) return "range";
    if (Math.abs(m1) > NR || Math.abs(m2) > NR) { r = gcd(m1, m2); m1 /= r; m2 /= r; }
    if (Math.abs(m1) > NR || Math.abs(m2) > NR) return "range";
    S.px = x0; S.py = y0; S.A = -m2 + 0; S.B = m1 + 0;
    return "ok";
  }

  function paintAll(){ paintSide(); paintEq(); paintRead(); paintForms(); draw(); }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function lock(on){ busy = !!on; $$("input, button", host).forEach(function(el){ el.disabled = !!on; }); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !host.contains(b)) return;
    if (b.dataset.mode) { if (S.mode !== b.dataset.mode) { S.mode = b.dataset.mode; note = null; syncForms(); $("#cl-forms", host).innerHTML = ""; changed(); } return; }
    if (b.dataset.st) {
      var k = b.dataset.st, nv = clamp(S[k] + +b.dataset.dir, -NR, NR);
      if (nv === 0 && S[k === "A" ? "B" : "A"] === 0) nv = clamp(nv + +b.dataset.dir, -NR, NR);
      if (nv === 0 && S[k === "A" ? "B" : "A"] === 0) return;
      S[k] = nv; note = null; syncForms(); changed(); return;
    }
    var a = b.dataset.act;
    if (a === "work") { S.work = !S.work; api.save(); paintRead(); return; }
    if (a === "reset") { S.px = 3; S.py = 0; S.A = 2; S.B = 3; S.qx = 3; S.qy = 2; note = null; syncForms(); changed(); }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest('[role="radio"][data-mode]'); if (!b || busy) return;
    if (!/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return;
    e.preventDefault();
    var ids = C.modes.map(function(o){ return o.id; }), i = ids.indexOf(S.mode), d = /Right|Down/.test(e.key) ? 1 : -1;
    S.mode = ids[(i + d + ids.length) % ids.length]; note = null; syncForms(); $("#cl-forms", host).innerHTML = ""; changed();
    var nb = $('[data-mode="' + S.mode + '"]', host); if (nb) nb.focus();
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.fm || busy) return;
    var fm = t.dataset.fm; S.cv[fm] = S.cv[fm] || {}; S.cv[fm][t.dataset.fk] = t.value;
    var r = tryForm(fm);
    notes[fm] = r;
    if (r === "ok") {
      note = null; syncForms(fm);
      Object.keys(FORMS).forEach(function(k){ if (k !== fm) paintForm(k); });
      paintNote(fm); paintSide(); paintEq(); paintRead(); draw(); api.save(); MV.changed();
    } else { paintNote(fm); api.save(); }
  });
  syncForms();
  paintAll();

  // ---- challenges (plan's exact tests and named wrong states) ----
  function chal(id){
    var M = MS[id], A = S.A, B = S.B, x = S.px, y = S.py, c = Cv();
    if (id === "tc1") {
      if ((A === 3 && B === -4) || (A === -3 && B === 4)) return 3 * x - 4 * y === -2 ? { ok:true } : { ok:false, msg:M.point };
      if (parV(A, B, 4, 3)) return { ok:false, msg:M.dir };
      return { ok:false, msg:M.general };
    }
    if (id === "tc2") {
      if (parV(A, B, 2, 1)) return 2 * x + y === 5 ? { ok:true } : { ok:false, msg:M.point };
      if (parV(A, B, 1, -2)) return { ok:false, msg:M.same };
      if (parV(A, B, 2, -1)) return { ok:false, msg:M.m2 };
      return { ok:false, msg:M.general };
    }
    if (S.mode !== "test") return { ok:false, msg:M.mode };
    var va = -2 * A + B + c, vb = 4 * A + 3 * B + c;
    if (parV(A, B, 1, -3) && A + 2 * B + c === 0) return { ok:false, msg:M.along };
    if (va === 0) return { ok:false, msg:M.onA };
    if (vb === 0) return { ok:false, msg:M.onB };
    if (parV(A, B, 3, 1)) {
      if (va === -vb) return { ok:true };
      if (c === 0) return { ok:false, msg:M.origin };
      if (va * vb < 0) return { ok:false, msg:String(M.unequal).replace("{a}", fT(va)).replace("{b}", fT(vb)) };
    }
    return { ok:false, msg:M.general };
  }

  // ---- predictions ----
  function tween(dur, step, cb){ stop = MV.tween({ dur:dur, ease:function(t){ return t; }, step:step, done:function(){ stop = null; cb(); } }); }
  function setStart(mode){ S.mode = mode; S.px = 3; S.py = 0; S.A = 2; S.B = 3; S.qx = 3; S.qy = 2; syncForms(); $("#cl-forms", host).innerHTML = ""; }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        note = null; hide = {};
        if (p.id === "p1") { setStart("normal"); hide = { line:true, dir:true, rows:true }; }
        else if (p.id === "p3") { setStart("test"); hide = { shade:true, test:true }; }
        else setStart("normal");
        paintAll(); lock(true);
      },
      run:function(p, done){
        function fin(){ hide = {}; lock(false); syncForms(); api.save(); paintAll(); MV.changed(); done(); }
        function show(nt, cb){ note = nt; draw(); MV.wait(1300, cb); }
        if (p.id === "p1") {
          hide.line = false; hide.lineFrac = 0;
          tween(1200, function(t){ hide.lineFrac = t; draw(); }, function(){ hide.lineFrac = null; hide.dir = false; draw();
            show({ x:-1.5, y:6.6, text:"(3, " + MINUS + "2) lies on the line; (2, 3) sticks out" }, fin); });
        } else if (p.id === "p2") {
          tween(1500, function(t){ S.A = 2 + 2 * t; S.B = 3 + 3 * t; paintEq(); paintRead(); draw(); }, function(){ S.A = 4; S.B = 6; paintEq(); paintRead();
            show({ x:-1.5, y:-6.6, text:"Same line: 4x + 6y " + MINUS + " 12 = 0" }, fin); });
        } else if (p.id === "p3") {
          hide.shade = false; hide.shadeA = 0;
          tween(900, function(t){ hide.shadeA = t; draw(); }, function(){ hide.shadeA = null; hide.test = false; paintRead();
            show({ x:3, y:6.6, text:"2(3) + 3(2) " + MINUS + " 6 = 6 > 0" }, fin); });
        } else {
          tween(1400, function(t){ S.px = 3 - 6 * t; S.py = 4 * t; paintEq(); paintRead(); draw(); }, function(){
            tween(2000, function(t){ S.px = -3 + 9 * t; S.py = 4 - 6 * t; paintEq(); paintRead(); draw(); }, function(){
              S.px = 6; S.py = -2; paintEq(); paintRead(); show({ x:-1.5, y:-6.6, text:"C = " + MINUS + "6 at every point of the line" }, fin); });
          });
        }
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Angles between lines ----------
function part3(host, api){
  var S = api.S, C = api.content, L = C.labels, P = {}, R3 = Math.sqrt(3);
  C.pairs.forEach(function(p){ P[p.id] = p; });
  if (!P[S.pair]) S.pair = "s2";
  if (typeof S.turn !== "number" || Math.abs(S.turn) > 90) S.turn = 0;
  if (S.use !== "d") S.use = "n";
  S.v = S.v || {};
  host.innerHTML = '<div class="cl-p3"><div class="cl-main"><div class="plot-wrap"><canvas class="plot square" id="cl-p3b" role="img" aria-label="' + MV.esc(L.graph) + '"></canvas></div>' +
    '<p class="tiny muted cl-key">' + MV.md(L.key) + "</p></div>" +
    '<div class="cl-side"><p class="tiny cl-h">' + L.pairs + '</p><div class="chips cl-pairs" id="cl-pairs"></div>' +
    '<div class="cl-ctl" id="cl-use"></div>' +
    '<label class="slider cl-sl"><span class="slider-top"><span>' + L.turn + '</span><output id="cl-tout"></output></span>' +
    '<input type="range" id="cl-turn" min="-90" max="90" step="5" style="accent-color:var(--ink)" aria-label="' + MV.esc(L.turn) + '"></label>' +
    '<p class="tiny muted cl-note">' + L.turnNote + '</p><div class="q-actions"><button type="button" class="btn ghost sm" data-act="rt" data-k="clrt">' + L.reset + "</button></div>" +
    '<dl class="read cl-read" id="cl-p3r" aria-live="polite"></dl></div></div>' +
    '<div class="cl-st"><h3>' + C.st1.title + "</h3><p>" + MV.md(C.st1.text) + '</p><div id="cl-st1"></div></div>' +
    '<div class="cl-st"><h3>' + C.st2.title + "</h3><p>" + MV.md(C.st2.text) + '</p><div class="refresh cl-formula"><p>' + MV.md(C.st2.formula) + "</p></div>" +
    '<ul class="cl-wl">' + C.st2.worked.map(function(w){ return "<li><span>" + MV.md(w.t) + '</span> <button type="button" class="btn ghost sm" data-pair="' + w.id + '" data-k="clw' + w.id + '">' + C.st2.show + "</button></li>"; }).join("") + "</ul></div>" +
    '<div class="cl-st"><h3>' + C.st3.title + "</h3><p>" + MV.md(C.st3.text) + '</p><p class="banner cl-ban" id="cl-ban" aria-live="polite"></p></div>';
  var plot = new MV.Plot($("#cl-p3b", host), { xmin:-6, xmax:6, ymin:-6, ymax:6 }, { equal:true });
  plot.render = draw;
  var sl = $("#cl-turn", host);

  function lines(){
    var p = P[S.pair], a = p.l1, b = p.l2.slice(), X = cross(a, b), piv;
    if (S.turn) {
      piv = X || (function(){ var k = -b[2] / (b[0] * b[0] + b[1] * b[1]); return [b[0] * k, b[1] * k]; })();
      var t = S.turn * Math.PI / 180, A2 = b[0] * Math.cos(t) - b[1] * Math.sin(t), B2 = b[0] * Math.sin(t) + b[1] * Math.cos(t);
      b = [A2, B2, -(A2 * piv[0] + B2 * piv[1])];
    }
    return { a:a, b:b, X:cross(a, b) };
  }
  function cross(a, b){ var d = a[0] * b[1] - b[0] * a[1]; if (Math.abs(d) < 1e-9) return null; return [(a[1] * b[2] - b[1] * a[2]) / d, (b[0] * a[2] - a[0] * b[2]) / d]; }
  function vecs(l){ return S.use === "d" ? [l[1], -l[0]] : [l[0], l[1]]; }
  function angBetween(u, v){ var c = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1])); return Math.acos(clamp(c, -1, 1)) * 180 / Math.PI; }
  function eq2(l, p){ return !S.turn && p.r3 ? "x + √3y - 4 = 0" : eqSrc(l[0], l[1], l[2]); }
  function samePair(l){ var a = l.a, b = l.b; return !l.X && Math.abs(a[0] * b[2] - b[0] * a[2]) < 1e-9 && Math.abs(a[1] * b[2] - b[1] * a[2]) < 1e-9; }
  function arc(ctx, X, Y, r, u, v, color, o){
    o = o || {};
    var a1 = Math.atan2(-u[1], u[0]), a2 = Math.atan2(-v[1], v[0]), d = a2 - a1;
    while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    ctx.save();
    if (o.fill) { ctx.beginPath(); ctx.moveTo(X, Y); ctx.arc(X, Y, r, a1, a1 + d, d < 0); ctx.closePath(); ctx.fillStyle = o.fill; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1; }
    ctx.beginPath(); ctx.arc(X, Y, r, a1, a1 + d, d < 0); ctx.strokeStyle = color; ctx.lineWidth = o.w || 2; if (o.dash) ctx.setLineDash(o.dash); ctx.stroke(); ctx.restore();
    var mid = a1 + d / 2; return [X + Math.cos(mid) * (r + 16), Y + Math.sin(mid) * (r + 16)];
  }
  function draw(){
    var l = lines(), p = P[S.pair], ink = css("--ink"), ink2 = css("--ink-2"), f3 = css("--f3"), f4 = css("--f4"), pen = css("--pen");
    var segs = [];
    [[l.a, ink], [l.b, f3]].forEach(function(z){
      var A = z[0][0], B = z[0][1], c = z[0][2], k = -c / (A * A + B * B), s = lineSeg(A * k, B * k, B, -A);
      s.color = z[1]; s.width = 3; if (z[1] === f3) s.dash = samePair(l) ? [10, 8] : null; segs.push(s);
    });
    var vc = S.use === "d" ? pen : f4, u1 = vecs(l.a), u2 = vecs(l.b), angV = angBetween(u1, u2);
    plot.draw({ view:{ xmin:-6, xmax:6, ymin:-6, ymax:6 }, equal:true, xLabel:"x", yLabel:"y", segments:segs,
      points:l.X ? [{ x:l.X[0], y:l.X[1], r:4.5, color:ink }] : [],
      after:function(ctx, pp){
        var base = l.X, b1, b2;
        if (base) { b1 = base; b2 = base; }
        else { var k1 = -l.a[2] / (l.a[0] * l.a[0] + l.a[1] * l.a[1]), k2 = -l.b[2] / (l.b[0] * l.b[0] + l.b[1] * l.b[1]); b1 = [l.a[0] * k1, l.a[1] * k1]; b2 = [l.b[0] * k2, l.b[1] * k2]; }
        var n1 = Math.hypot(u1[0], u1[1]), n2 = Math.hypot(u2[0], u2[1]), len = 2.4;
        if (base) {
          var d1 = [l.a[1], -l.a[0]], d2 = [l.b[1], -l.b[0]];
          if (d1[0] * d2[0] + d1[1] * d2[1] < 0) d2 = [-d2[0], -d2[1]];
          var X = pp.X(base[0]), Y = pp.Y(base[1]), sc = pp.X(1) - pp.X(0), th = angBetween(d1, d2);
          var la = arc(ctx, X, Y, 0.95 * sc, d1, d2, ink2, { fill:css("--hi-soft") });
          var lb = arc(ctx, X, Y, 0.95 * sc, d2, [-d1[0], -d1[1]], ink2, { dash:[4, 4] });
          bgText(ctx, "θ = " + num(th, 1) + "°", la[0] + (la[0] < X ? -4 : 4), la[1], la[0] < X ? "right" : "left", ink, ui(13, 700));
          bgText(ctx, num(180 - th, 1) + "°", lb[0], lb[1], lb[0] < X ? "right" : "left", ink2, ui(12, 600));
          var lc = arc(ctx, X, Y, 1.75 * sc, u1, u2, vc, { w:2.2 });
          bgText(ctx, num(angV, 1) + "°", lc[0], lc[1], lc[0] < X ? "right" : "left", vc, ui(13, 700));
        }
        arrowD(ctx, pp, b1[0], b1[1], b1[0] + u1[0] / n1 * len, b1[1] + u1[1] / n1 * len, vc, 3);
        arrowD(ctx, pp, b2[0], b2[1], b2[0] + u2[0] / n2 * len, b2[1] + u2[1] / n2 * len, vc, 3, { dash:[6, 4] });
        var nm = S.use === "d" ? "m" : "n";
        bgText(ctx, nm + "₁", pp.X(b1[0] + u1[0] / n1 * (len + 0.45)), pp.Y(b1[1] + u1[1] / n1 * (len + 0.45)), "center", vc, mfont(14));
        bgText(ctx, nm + "₂", pp.X(b2[0] + u2[0] / n2 * (len + 0.45)), pp.Y(b2[1] + u2[1] / n2 * (len + 0.45)), "center", vc, mfont(14));
      },
      describe:"Line 1 " + MV.plain(m(eqSrc(l.a[0], l.a[1], l.a[2]))) + " and line 2 " + MV.plain(m(eq2(l.b, p))) + (S.turn ? " (turned " + S.turn + "°)" : "") + ". " +
        (l.X ? "They cross at (" + num(l.X[0], 2) + ", " + num(l.X[1], 2) + "). The " + (S.use === "d" ? "directions" : "normals") + " make " + num(angV, 1) + "°; the lines make " + num(Math.min(angV, 180 - angV), 1) + "° and " + num(Math.max(angV, 180 - angV), 1) + "°." : L.parallel) });
    paintRead(l, p, angV);
  }
  function paintRead(l, p, angV){
    var R = L.rows, th = Math.min(angV, 180 - angV), n1 = l.a, n2 = l.b, rows = [];
    rows.push([R.eq1, m(eqSrc(n1[0], n1[1], n1[2]))]);
    rows.push([R.eq2, m(eq2(n2, p)) + (S.turn ? ' <span class="tiny muted">' + L.turned.replace("{d}", (S.turn > 0 ? "" : MINUS) + Math.abs(S.turn)) + "</span>" : "")]);
    if (!l.X) rows.push([R.lines, samePair(l) ? L.same : L.parallel]);
    else {
      rows.push([S.use === "d" ? R.dd : R.nn, num(angV, 1) + "° (" + L.match + ")"]);
      rows.push([R.lines, m("θ") + " = " + num(th, 1) + "° and 180° " + MINUS + " " + m("θ") + " = " + num(180 - th, 1) + "°"]);
      var dot = n1[0] * n2[0] + n1[1] * n2[1];
      rows.push([MV.md(R.cos), m("|" + fN(dot) + "|") + " ÷ (" + num(Math.hypot(n1[0], n1[1]), 3) + " × " + num(Math.hypot(n2[0], n2[1]), 3) + ") ≈ " + num(Math.abs(dot) / (Math.hypot(n1[0], n1[1]) * Math.hypot(n2[0], n2[1])), 3)]);
    }
    var rd = $("#cl-p3r", host); rd.innerHTML = MV.readoutHTML(rows);
    $("#cl-tout", host).textContent = (S.turn < 0 ? MINUS : "") + Math.abs(S.turn) + "°";
    sl.value = S.turn;
    $("#cl-ban", host).textContent = S.use === "d" ? MV.plain(C.st3.banner) : "";
    $("#cl-ban", host).style.display = S.use === "d" ? "" : "none";
  }
  function paintCtl(){
    var pc = $("#cl-pairs", host), uc = $("#cl-use", host);
    MV.keepFocus(pc, function(){ pc.innerHTML = C.pairs.map(function(p){ return '<button type="button" class="chip" data-pair="' + p.id + '" data-k="clp' + p.id + '" aria-pressed="' + (S.pair === p.id) + '">' + p.t + "</button>"; }).join(""); });
    MV.keepFocus(uc, function(){
      uc.innerHTML = '<span class="tiny cl-h">' + L.use + '</span><span class="seg cl-seg" role="radiogroup" aria-label="' + MV.esc(L.use) + '">' +
        [["n", L.useN], ["d", L.useD]].map(function(o){ return '<button type="button" role="radio" data-use="' + o[0] + '" data-k="clu' + o[0] + '" aria-checked="' + (S.use === o[0]) + '" tabindex="' + (S.use === o[0] ? 0 : -1) + '">' + o[1] + "</button>"; }).join("") + "</span>";
    });
  }
  function paintSt1(){
    var h = $("#cl-st1", host);
    MV.keepFocus(h, function(){
      h.innerHTML = C.st1.items.map(function(it, i){
        var ch = S.v[it.id], ans = MV.ans(it), fb = ch ? it.fb[ch] : "";
        return '<div class="q cl-v" data-v="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div></div>" +
          '<div class="chips" role="group" aria-label="Verdict">' + C.st1.verdicts.map(function(v){ return '<button type="button" class="chip" data-vd="' + v.id + '" data-vi="' + it.id + '" data-k="clv' + it.id + v.id + '" aria-pressed="' + (ch === v.id) + '">' + v.t + "</button>"; }).join("") + "</div>" +
          (ch ? MV.fbHTML(ch === ans ? "good" : "bad", (ch === ans ? "" : "<strong>✗ Not quite.</strong> ") + MV.md(fb) + (ch === ans ? "" : " Try another verdict.")) : "") +
          '<details class="alg"><summary>Check it with algebra</summary><p>' + MV.md(it.alg) + "</p></details></div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pair) { S.pair = b.dataset.pair; S.turn = 0; api.save(); paintCtl(); draw(); return; }
    if (b.dataset.use) { S.use = b.dataset.use; api.save(); paintCtl(); draw(); return; }
    if (b.dataset.vd) { S.v[b.dataset.vi] = b.dataset.vd; S.pair = b.dataset.vi; S.turn = 0; api.save(); paintSt1(); paintCtl(); draw(); MV.focusFb($('[data-v="' + b.dataset.vi + '"]', host)); return; }
    if (b.dataset.act === "rt") { S.turn = 0; api.save(); draw(); }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest('[role="radio"][data-use]'); if (!b) return;
    if (!/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return;
    e.preventDefault(); S.use = S.use === "n" ? "d" : "n"; api.save(); paintCtl(); draw();
    var nb = $('[data-use="' + S.use + '"]', host); if (nb) nb.focus();
  });
  sl.addEventListener("input", function(){ S.turn = clamp(Math.round(+sl.value / 5) * 5, -90, 90); api.save(); draw(); });
  paintCtl(); paintSt1(); draw();
}

// =====================================================================================================================
// ---------- Practice 2: Find the coefficient (N4 numbers and V8 "□x + □y + □ = 0" lines; first-try scoring) ----------
// @component V8 lineBoxes — a Cartesian equation typed as three coefficient boxes; judged by proportionality, so any
// non-zero multiple of the target counts; (A, B) right but C wrong gets the M3 sentence.
function propTo(u, w){
  if (!u.some(function(z){ return Math.abs(z) > 1e-12; })) return false;
  return Math.abs(u[0] * w[1] - u[1] * w[0]) < 1e-9 && Math.abs(u[0] * w[2] - u[2] * w[0]) < 1e-9 && Math.abs(u[1] * w[2] - u[2] * w[1]) < 1e-9;
}
function coefAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function box(it, k, label, dis){
    var x = ist(it.id);
    return '<input class="numin short cl-box" data-bx="' + k + '" data-k="cf' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.v[k] || "") + '"' + (dis ? " disabled" : "") + ">";
  }
  function inHTML(it){
    var x = ist(it.id), d = x.solved;
    if (it.form === "line") return box(it, "A", "Coefficient A", d) + '<span class="cl-fl">' + m("x +") + "</span>" + box(it, "B", "Coefficient B", d) + '<span class="cl-fl">' + m("y +") + "</span>" + box(it, "C", "Constant C", d) + '<span class="cl-fl">' + m("= 0") + "</span>";
    return '<span class="cl-fl">' + MV.md(it.label) + "</span>" + box(it, "v", MV.plain(MV.md(it.label)) + " (answer)", d) + (it.unit ? '<span class="cl-fl">' + it.unit + "</span>" : "");
  }
  host.innerHTML = '<p class="how">' + MV.md(a.how) + "</p>" + a.items.map(function(it, i){
    return '<div class="q cl-cq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + MV.md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="cl-frow cl-cin"></div><div class="cl-ccl"></div></div>';
  }).join("");
  function paintIn(it){ var el = $('[data-q="' + it.id + '"] .cl-cin', host); MV.keepFocus(el, function(){ el.innerHTML = inHTML(it); }); }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .cl-ccl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints.map(MV.md), x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + MV.md(it.display) + ".</strong> " + MV.md(it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", MV.md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), W = it.wrong || [], i;
    if (it.form === "line") {
      var u = [];
      for (i = 0; i < 3; i++) { var t = x.v["ABC".charAt(i)], v = parseV(t); if (v === null) return { err:TX.fill }; if (!isFinite(v)) return { err:TX.err }; u.push(v); }
      if (u[0] === 0 && u[1] === 0) return { err:TX.zero };
      if (propTo(u, ans)) return { ok:true };
      for (i = 0; i < W.length; i++) if (propTo(u, W[i].line)) return { msg:W[i].fb };
      if (parV(u[0], u[1], ans[0], ans[1])) return { msg:TX.lineC };
      return { msg:it.general || TX.general };
    }
    var n = parseV(x.v.v);
    if (n === null) return { err:TX.fill };
    if (!isFinite(n)) return { err:TX.err };
    if (Math.abs(n - ans) < 1e-6) return { ok:true };
    for (i = 0; i < W.length; i++) if (Math.abs(n - W[i].v) < 1e-3) return { msg:W[i].fb };
    return { msg:it.general || TX.general };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
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
// ---------- Performance task: Split the pair ----------
var task = (function(){
  var api, plot, RNG = 6, PA = [3, 1], PB = [-1, 5];
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && Math.abs(v) <= RNG ? v : null; }
  function read(){ var A = gi("A"), B = gi("B"), c = gi("C"); return { A:A, B:B, C:c, valid:A !== null && B !== null && c !== null && !(A === 0 && B === 0) }; }
  function vals(D){ return [D.A * PA[0] + D.B * PA[1] + D.C, D.A * PB[0] + D.B * PB[1] + D.C]; }
  function checks(D){
    if (!D.valid) return [false, false, false, false];
    var v = vals(D);
    return [-D.A - 2 * D.B === 0, v[0] * v[1] < 0, D.A !== 0 && D.B !== 0 && D.C % D.A === 0 && D.C % D.B === 0, D.C !== 0];
  }
  function norm(D){ var g = gcd(gcd(D.A, D.B), D.C) || 1, s = (D.A < 0 || (D.A === 0 && D.B < 0)) ? -1 : 1; return [s * D.A / g + 0, s * D.B / g + 0, s * D.C / g + 0]; }
  function preview(){
    var D = read(), Lb = api.content.labels, rd = $("#sp-read"), ink = css("--ink"), ink2 = css("--ink-2"), V = { xmin:-7, xmax:7, ymin:-7, ymax:7 };
    var base = { view:V, equal:true, xLabel:"x", yLabel:"y", points:[{ x:PA[0], y:PA[1], r:5.5, color:ink2, open:true, label:"A" }, { x:PB[0], y:PB[1], r:5.5, color:ink2, open:true, label:"B" }] };
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + MV.md(Lb.invalid) + "</p>";
      base.describe = "Points A(3, 1) and B(−1, 5); choose A, B and C to draw a line.";
      plot.draw(base); return;
    }
    var v = vals(D), s = lineSeg(D.B === 0 ? -D.C / D.A : 0, D.B === 0 ? 0 : -D.C / D.B, D.B, -D.A);
    function vtxt(x){ return m(fN(x)) + ": " + (x > 0 ? Lb.pos : x < 0 ? Lb.neg : Lb.zero); }
    var xi = D.A !== 0 ? m(Q.src(Q.of(-D.C, D.A))) : Lb.none, yi = D.B !== 0 ? m(Q.src(Q.of(-D.C, D.B))) : Lb.none;
    var rows = [[Lb.eq, m(eqSrc(D.A, D.B, D.C))], [Lb.atA, vtxt(v[0])], [Lb.atB, vtxt(v[1])], [Lb.ints, m("x") + ": " + xi + "; " + m("y") + ": " + yi]];
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows.map(function(r){ return [MV.md(r[0]), r[1]]; })) + "</dl>";
    s.color = css("--pen"); s.width = 3; base.segments = [s];
    base.after = function(ctx, p){ var k = 2.2 / Math.hypot(D.A, D.B), x0 = D.B === 0 ? -D.C / D.A : 0, y0 = D.B === 0 ? 0 : -D.C / D.B; if (Math.abs(x0) < 6.5 && Math.abs(y0) < 6.5) arrowD(ctx, p, x0, y0, x0 + D.A * k, y0 + D.B * k, css("--f4"), 3); };
    base.describe = "Graph of " + MV.plain(m(eqSrc(D.A, D.B, D.C))) + " with A(3, 1) giving " + fT(v[0]) + " and B(−1, 5) giving " + fT(v[1]) + ".";
    plot.draw(base);
  }
  function stepper(k){
    var Lb = api.content.labels;
    return '<div class="fs-step cl-tstep"><label for="sp-' + k + '"><span class="m">' + MV.md(Lb[k]) + '</span> <span class="tiny muted">' + Lb.range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="sp' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="sp-' + k + '" data-tk="' + k + '" type="number" min="-6" max="6" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="sp' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a;
      if (a.S.A == null) { a.S.A = "1"; a.S.B = "1"; a.S.C = "0"; }
      inp.innerHTML = '<div class="cl-tin"><p class="tiny" style="font-weight:700;margin:0">' + m("Ax + By + C = 0") + "</p>" + stepper("A") + stepper("B") + stepper("C") + "</div>";
      pv.innerHTML = '<div id="sp-read" aria-live="polite"></div><p class="tiny cl-tgh">' + MV.md(a.content.labels.graph) + '</p><div class="plot-wrap"><canvas class="plot square" id="sp-plot" role="img" aria-label="Graph of your line"></canvas></div>';
      plot = new MV.Plot($("#sp-plot"), { xmin:-7, xmax:7, ymin:-7, ymax:7 }, { equal:true }); plot.render = preview;
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -RNG, RNG)); $("#sp-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : MV.md(api.content.labels.invalid); },
    checks:checks,
    key:function(D){ return norm(D).join("|"); },
    label:function(k){ var s = k.split("|").map(Number); return m(eqSrc(s[0], s[1], s[2])); },
    text:function(k){ var s = k.split("|").map(Number); return MV.plain(m(eqSrc(s[0], s[1], s[2]))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ coef:coefAct },
  task:task
});

})();
