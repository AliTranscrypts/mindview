// MCV4U 34 Adding and Subtracting Vectors: hero storyboard (walk u, then v; the resultant; the parallelogram); the
// tip-to-tail table (Explore: V3 vectorBoard with Add / Subtract / Chain modes, Grid and Polar input) and its challenge
// set-ups; Resultants by hand (Part 3: two stations); the ABCD figure (Practice 1); Resultants (Practice 2, V8 surdBox);
// the "Exactly 7" performance task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, Q = MV.mcv.Q, SX = MV.mcv.S, EXACT = MV.mcv.exact;
function m(s){ return MV.m(s); }
function md(h){ return MV.md(h); }
var D2R = Math.PI / 180;
function pol(r, deg){ var a = deg * D2R, x = r * Math.cos(a), y = r * Math.sin(a); return [Math.abs(x) < 1e-12 ? 0 : x, Math.abs(y) < 1e-12 ? 0 : y]; }
function vadd(a, b){ return [a[0] + b[0], a[1] + b[1]]; }
function vsub(a, b){ return [a[0] - b[0], a[1] - b[1]]; }
function vsc(a, k){ return [a[0] * k, a[1] * k]; }
function len2(a){ return a[0] * a[0] + a[1] * a[1]; }
function lerp(a, b, t){ return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function dirOf(a){ var d = Math.atan2(a[1], a[0]) / D2R; return d < 0 ? d + 360 : d; }

// @component exactLen — exact lengths from squared lengths: c√r when the square is a whole number, otherwise ≈ (2 dp).
function surd(n){ n = Math.round(n); if (n <= 0) return [0, 1]; var c = 1, r = n; for (var k = 2; k * k <= r; k++) while (r % (k * k) === 0) { r /= k * k; c *= k; } return [c, r]; }
function surdSrc(n){ var s = surd(n); return s[1] === 1 ? String(s[0]) : (s[0] === 1 ? "" : s[0]) + "√" + s[1]; }
function exactSq(sq){ var r = Math.round(sq); return Math.abs(sq - r) < 1e-7 ? r : null; }
function lenShort(sq){ var n = exactSq(sq); return n != null ? m(surdSrc(n)) : "≈ " + num(Math.sqrt(Math.max(0, sq)), 2); }
function lenHTML(sq){ var n = exactSq(sq); if (n != null && surd(n)[1] !== 1) return m(surdSrc(n)) + ' <span class="muted">(≈ ' + num(Math.sqrt(n), 2) + ")</span>"; return lenShort(sq); }
function lenTxt(sq){ return MV.plain(lenShort(sq)); }

// ---------- canvas helpers: arrows, vector labels (letters with over-arrows), text labels, angle arcs ----------
function fontM(px, it){ return (it ? "italic " : "") + "600 " + px + "px " + (css("--font-math") || "serif"); }
function fontU(px){ return "700 " + px + "px " + (css("--font-ui") || "system-ui, sans-serif"); }
function vlab(ctx, t, X, Y, color, px){
  px = px || 17; ctx.save(); ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.lineJoin = "round";
  var ch = t.split(""), ws = ch.map(function(c){ ctx.font = fontM(px, /[a-z]/i.test(c)); return ctx.measureText(c).width; }), W = ws.reduce(function(s, w){ return s + w; }, 0), x = X - W / 2;
  ch.forEach(function(c, i){
    var L = /[a-z]/i.test(c); ctx.font = fontM(px, L);
    ctx.lineWidth = 4; ctx.strokeStyle = css("--sheet"); ctx.strokeText(c, x, Y); ctx.fillStyle = color; ctx.fillText(c, x, Y);
    if (L) {
      var y0 = Y - px * 0.74, x0 = x + 1.5, x1 = x + ws[i] + 1.5;
      ctx.strokeStyle = color; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.moveTo(x1 - 3.5, y0 - 2.6); ctx.lineTo(x1, y0); ctx.lineTo(x1 - 3.5, y0 + 2.6); ctx.stroke();
    }
    x += ws[i];
  });
  ctx.restore();
}
function tlab(ctx, t, X, Y, color, o){
  o = o || {}; ctx.save(); ctx.font = o.font || fontU(o.px || 13); ctx.textAlign = o.align || "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
  ctx.lineWidth = 4; ctx.strokeStyle = css("--sheet"); ctx.strokeText(t, X, Y); ctx.fillStyle = color || css("--ink"); ctx.fillText(t, X, Y); ctx.restore();
}
// arrow from data point a to b; o: {color, width, dash, alpha, label (vector name), side (±1), off (px), lcolor}
function arrow(ctx, pl, a, b, o){
  var x1 = pl.X(a[0]), y1 = pl.Y(a[1]), x2 = pl.X(b[0]), y2 = pl.Y(b[1]), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.strokeStyle = ctx.fillStyle = o.color;
  if (L < 2) { ctx.beginPath(); ctx.arc(x1, y1, 4.5, 0, 2 * Math.PI); ctx.fill(); ctx.restore(); return; }
  var w = o.width || 3, hl = Math.min(9 + 1.7 * w, L * 0.5), hw = hl * 0.46, ux = dx / L, uy = dy / L;
  ctx.lineWidth = w; if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - ux * hl * 0.85, y2 - uy * hl * 0.85); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - ux * hl - uy * hw, y2 - uy * hl + ux * hw); ctx.lineTo(x2 - ux * hl + uy * hw, y2 - uy * hl - ux * hw); ctx.closePath(); ctx.fill();
  ctx.restore();
  if (o.label) { var s = o.side || 1, d = o.off || 16; vlab(ctx, o.label, (x1 + x2) / 2 + uy * d * s, (y1 + y2) / 2 - ux * d * s, o.lcolor || o.color); }
}
// arc at data point c from math angle a0 (degrees, counterclockwise) through sweep; o: {width, label, lfont, dash}
function arcAt(ctx, pl, c, a0, sweep, r, color, o){
  if (sweep < 0.5) return; o = o || {};
  var X = pl.X(c[0]), Y = pl.Y(c[1]);
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = o.width || 2.2; if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.arc(X, Y, r, -a0 * D2R, -(a0 + sweep) * D2R, true); ctx.stroke(); ctx.restore();
  if (o.label) {
    var mid = (a0 + sweep / 2) * D2R, R = r + (o.loff || 13), cx = Math.cos(mid);
    tlab(ctx, o.label, X + R * cx, Y - R * Math.sin(mid), o.lcolor || color, { font:o.lfont, align:cx > 0.35 ? "left" : cx < -0.35 ? "right" : "center" });
  }
}
function seg(ctx, pl, a, b, color, w, dash, alpha){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = color; ctx.lineWidth = w || 1.6; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(pl.X(a[0]), pl.Y(a[1])); ctx.lineTo(pl.X(b[0]), pl.Y(b[1])); ctx.stroke(); ctx.restore();
}
function ringAt(ctx, pl, p, r, color){ ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(pl.X(p[0]), pl.Y(p[1]), r, 0, 2 * Math.PI); ctx.stroke(); ctx.restore(); }
function fitView(pts, min, pad){
  var M = min; pts.forEach(function(p){ M = Math.max(M, Math.abs(p[0]) + pad, Math.abs(p[1]) + pad); });
  M = Math.ceil(M); return { xmin:-M, xmax:M, ymin:-M, ymax:M };
}
function tickStep(v){ var w = v.xmax - v.xmin; return w <= 20 ? 1 : w <= 36 ? 2 : 4; }
function seg3(host, id, label, opts, value, onChange){ var el = document.createElement("div"); el.className = "vs-seg " + id; host.appendChild(el); return MV.seg(el, { label:label, value:value, options:opts, onChange:onChange }); }

// ---------- hero storyboard ----------
function hero(f){
  if (!f.canvas) return;
  var V = { xmin:-1.4, xmax:4.8, ymin:-1.1, ymax:5.1 }, p = new MV.Plot(f.canvas, V), U = [3, 0], W = [0, 4], R = [3, 4], O = [0, 0];
  var st = { walk:0, res:0, par:0, lab:false };
  p.render = function(){
    p.draw({ view:V, equal:true, xTicks:{ step:1 }, yTicks:{ step:1 },
      describe:"A walker goes 3 units east along u, then 4 units north along v." + (st.res ? " The resultant u + v runs from the start to the finish: length 5, not 7." : "") + (st.par ? " Ghost copies of u and v complete a parallelogram; the resultant is its diagonal from the shared tail." : ""),
      after:function(ctx, pl){
        if (st.par > 0) {
          seg(ctx, pl, O, R, css("--hi"), 12, null, 0.45 * st.par);
          var gv = lerp(U, O, st.par), gu = lerp(O, W, st.par);
          arrow(ctx, pl, gv, vadd(gv, W), { color:css("--f3"), width:2.6, dash:[6, 5], alpha:0.6, label:st.par === 1 ? "v" : "", side:1 });
          arrow(ctx, pl, gu, vadd(gu, U), { color:css("--pen"), width:2.6, dash:[6, 5], alpha:0.6, label:st.par === 1 ? "u" : "", side:1 });
        }
        var w1 = clamp(st.walk, 0, 1), w2 = clamp(st.walk - 1, 0, 1);
        if (w1 > 0) arrow(ctx, pl, O, vsc(U, w1), { color:css("--pen"), width:3.4, label:w1 === 1 ? "u" : "", side:-1 });
        if (w2 > 0) arrow(ctx, pl, U, vadd(U, vsc(W, w2)), { color:css("--f3"), width:3.4, label:w2 === 1 ? "v" : "", side:-1 });
        if (st.res > 0) arrow(ctx, pl, O, vsc(R, st.res), { color:css("--ink"), width:4.6, label:st.res === 1 ? "u + v" : "", side:1, off:20 });
        if (st.lab) tlab(ctx, "5, not 7", pl.X(1.5) - 40, pl.Y(2) - 34, css("--ink"), { px:15, align:"right" });
        if (st.walk > 0 && st.walk < 2) {
          var q = st.walk <= 1 ? vsc(U, w1) : vadd(U, vsc(W, w2)), X = pl.X(q[0]), Y = pl.Y(q[1]);
          ctx.save(); ctx.fillStyle = css("--hi"); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X, Y - 2, 8, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.restore();
        }
      } });
  };
  var capEnd = m("|vec{u} + vec{v}| = 5 <= |vec{u}| + |vec{v}| = 7");
  function finish(){ st = { walk:2, res:1, par:1, lab:true }; f.cap.innerHTML = capEnd; p.render(); }
  if (MV.reduceMotion) { finish(); return; }
  f.cap.innerHTML = "Walk " + m("vec{u}") + ": 3 units east."; p.render();
  MV.wait(500, function(){
    MV.tween({ dur:1400, step:function(t){ st.walk = t; p.render(); }, done:function(){
      f.cap.innerHTML = "Then walk " + m("vec{v}") + ": 4 units north.";
      MV.tween({ dur:1500, step:function(t){ st.walk = 1 + t; p.render(); }, done:function(){
        st.walk = 2; f.cap.innerHTML = "The resultant goes straight from the start to the finish.";
        MV.tween({ dur:1000, step:function(t){ st.res = t; p.render(); }, done:function(){
          st.res = 1; st.lab = true; p.render(); f.cap.innerHTML = m("|vec{u} + vec{v}| = 5") + ", not 3 + 4 = 7";
          MV.wait(1600, function(){
            f.cap.innerHTML = "Tails together: ghost copies complete a parallelogram, with the same diagonal.";
            MV.tween({ dur:1500, step:function(t){ st.par = t; p.render(); }, done:function(){ MV.wait(900, finish); } });
          });
        } });
      } });
    } });
  });
}

// ---------- @component V3 vectorBoard ----------
// 2D vector board (MCV4U 34; for 35–42). Modes: Add (views Triangle / Parallelogram with ghost copies), Subtract (Add the
// opposite with −v dashed at u's tip / Tails together with the difference from v's tip to u's tip; Swap shows v − u), Chain
// (u, v, w tip to tail, resultant from the first tail to the last tip, "Close the loop" indicator). Input: Grid (drag tips;
// run and rise snap to integers −8 to 8; Tab to a tip and use the arrow keys) or Polar (magnitude steppers 1–8; the angle
// between, 0°–180°, or each direction, 0°–345°, in 15° steps). Polar arcs: θ in --ink-2, the triangle's angle in --hi.
// Colours: u --pen, v --f3, w --f5, resultant thick --ink, opposites dashed. vectorBoard(host, {S, save, changed}) ->
// {apply(state), lock(bool), locked(), anim, hide(bool), paint(), info()}.
function vectorBoard(host, o){
  var S = o.S;
  function isV(a){ return Array.isArray(a) && a.length === 2 && a.every(function(x){ return Number.isInteger(x) && Math.abs(x) <= 8; }); }
  if (["add", "sub", "chain"].indexOf(S.mode) < 0) S.mode = "add";
  if (S.inp !== "polar") S.inp = "grid";
  if (S.av !== "par") S.av = "tri";
  if (S.sv !== "tails") S.sv = "opp";
  S.swap = !!S.swap; S.tgt = !!S.tgt;
  if (!S.g || !isV(S.g.u) || !isV(S.g.v) || !isV(S.g.w)) S.g = { u:[3, 1], v:[1, 3], w:[-5, -2] };
  var PD = { mu:5, mv:3, mw:4, th:60, du:0, dv:120, dw:240 };
  if (!S.p || typeof S.p !== "object") S.p = {};
  Object.keys(PD).forEach(function(k){ if (typeof S.p[k] !== "number") S.p[k] = PD[k]; });
  var locked = false, hidden = false, dragging = false, view = { xmin:-9, xmax:9, ymin:-9, ymax:9 };
  var anim = { res:1, ghost:1, shift:0 };
  var L = MV.pgLayout(host, { shape:"square", aria:"Vector board" });
  L.ctrl.innerHTML = '<div class="vs-segs"></div><div class="vs-views"></div><div class="vs-pol"></div><p class="vs-loop" aria-live="polite"></p><p class="tiny muted vs-how"></p>';
  var segs = $(".vs-segs", L.ctrl), views = $(".vs-views", L.ctrl);
  var sMode = seg3(segs, "vs-m", "Mode:", [{ id:"add", t:"Add" }, { id:"sub", t:"Subtract" }, { id:"chain", t:"Chain" }], S.mode, function(v){ if (locked) { sMode.set(S.mode); return; } S.mode = v; changed(true); });
  var sInp = seg3(segs, "vs-i", "Input:", [{ id:"grid", t:"Grid" }, { id:"polar", t:"Polar" }], S.inp, function(v){ if (locked) { sInp.set(S.inp); return; } S.inp = v; changed(true); });
  var sAv = seg3(views, "vs-av", "View:", [{ id:"tri", t:"Triangle" }, { id:"par", t:"Parallelogram" }], S.av, function(v){ if (locked) { sAv.set(S.av); return; } S.av = v; changed(true); });
  var sSv = seg3(views, "vs-sv", "View:", [{ id:"opp", t:"Add the opposite" }, { id:"tails", t:"Tails together" }], S.sv, function(v){ if (locked) { sSv.set(S.sv); return; } S.sv = v; changed(true); });
  var swapEl = document.createElement("div"); swapEl.className = "vs-swap"; views.appendChild(swapEl);
  var plot = new MV.Plot(L.canvas, view);
  function vecs(){
    if (S.inp === "grid") return { u:S.g.u.slice(), v:S.g.v.slice(), w:S.g.w.slice() };
    if (S.mode === "chain") return { u:pol(S.p.mu, S.p.du), v:pol(S.p.mv, S.p.dv), w:pol(S.p.mw, S.p.dw) };
    return { u:pol(S.p.mu, 0), v:pol(S.p.mv, S.p.th), w:[0, 0] };
  }
  function info(){
    var V = vecs(), r = S.mode === "add" ? vadd(V.u, V.v) : S.mode === "sub" ? (S.swap ? vsub(V.v, V.u) : vsub(V.u, V.v)) : vadd(vadd(V.u, V.v), V.w);
    return { u:V.u, v:V.v, w:V.w, r:r, r2:len2(r) };
  }
  function resName(){ return S.mode === "add" ? "u + v" : S.mode === "sub" ? (S.swap ? "v − u" : "u − v") : "u + v + w"; }
  function resSrc(){ return S.mode === "add" ? "vec{u} + vec{v}" : S.mode === "sub" ? (S.swap ? "vec{v} - vec{u}" : "vec{u} - vec{v}") : "vec{u} + vec{v} + vec{w}"; }
  function stepper(k, nm){
    return '<div class="vs-stp" role="group" aria-label="Magnitude of ' + nm + '"><span class="vs-stl">' + m("|vec{" + nm + "}|") + "</span>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-d="-1" data-k="vs' + k + 'm" aria-label="Decrease the magnitude of ' + nm + '">−</button>' +
      '<output class="vs-sto" data-out="' + k + '">' + S.p[k] + "</output>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-d="1" data-k="vs' + k + 'p" aria-label="Increase the magnitude of ' + nm + '">+</button></div>';
  }
  function slider(k, label, aria, max){
    return '<label class="slider vs-sl"><span class="slider-top"><span>' + label + '</span><output data-out="' + k + '">' + S.p[k] + "°</output></span>" +
      '<input type="range" data-sl="' + k + '" data-k="vs' + k + 'sl" min="0" max="' + max + '" step="15" value="' + S.p[k] + '" style="accent-color:var(--ink)" aria-label="' + aria + '"></label>';
  }
  function paintCtrl(){
    sMode.set(S.mode); sInp.set(S.inp); sAv.set(S.av); sSv.set(S.sv);
    $(".vs-av", views).hidden = S.mode !== "add"; $(".vs-sv", views).hidden = S.mode !== "sub"; swapEl.hidden = S.mode !== "sub";
    MV.keepFocus(swapEl, function(){ swapEl.innerHTML = '<button type="button" class="btn ghost sm" data-act="swap" data-k="vsswap" aria-pressed="' + S.swap + '">Swap: show ' + m(S.swap ? "vec{u} - vec{v}" : "vec{v} - vec{u}") + "</button>"; });
    var pe = $(".vs-pol", L.ctrl);
    MV.keepFocus(pe, function(){
      if (S.inp !== "polar") { pe.innerHTML = ""; return; }
      if (S.mode === "chain") pe.innerHTML = '<div class="vs-stps">' + stepper("mu", "u") + stepper("mv", "v") + stepper("mw", "w") + "</div>" +
        slider("du", "Direction of " + m("vec{u}"), "Direction of u, degrees counterclockwise from east", 345) + slider("dv", "Direction of " + m("vec{v}"), "Direction of v, degrees counterclockwise from east", 345) + slider("dw", "Direction of " + m("vec{w}"), "Direction of w, degrees counterclockwise from east", 345);
      else pe.innerHTML = '<div class="vs-stps">' + stepper("mu", "u") + stepper("mv", "v") + "</div>" + slider("th", "Angle between, " + m("θ"), "Angle between u and v, theta, in degrees", 180);
    });
    $(".vs-how", L.ctrl).innerHTML = S.inp === "grid" ? "Drag a tip, or Tab to it and use the arrow keys. Run and rise stay whole numbers from −8 to 8." :
      S.mode === "chain" ? "Directions are measured counterclockwise from east, in steps of 15°." : m("vec{u}") + " points east; " + m("vec{v}") + " turns " + m("θ") + " counterclockwise from it.";
    applyLock();
  }
  function applyLock(){ $$("button, input", L.ctrl).forEach(function(b){ b.disabled = locked; }); }
  function paintVals(){
    $$("[data-out]", L.ctrl).forEach(function(el){ var k = el.dataset.out; el.textContent = S.p[k] + (k === "th" || k.charAt(0) === "d" ? "°" : ""); });
    $$("[data-sl]", L.ctrl).forEach(function(el){ if (+el.value !== S.p[el.dataset.sl]) el.value = S.p[el.dataset.sl]; });
  }
  function rr(a){ return a < 0 ? "(" + a + ")" : String(a); }
  function runRise(V){
    var u = V.u, v = V.v, w = V.w, xs, ys, r = info().r;
    if (S.mode === "add") { xs = u[0] + " + " + rr(v[0]); ys = u[1] + " + " + rr(v[1]); }
    else if (S.mode === "sub") { var a = S.swap ? v : u, b = S.swap ? u : v; xs = a[0] + " - " + rr(b[0]); ys = a[1] + " - " + rr(b[1]); }
    else { xs = u[0] + " + " + rr(v[0]) + " + " + rr(w[0]); ys = u[1] + " + " + rr(v[1]) + " + " + rr(w[1]); }
    return m("(" + xs + ", " + ys + ") = (" + r[0] + ", " + r[1] + ")");
  }
  function readout(){
    var V = vecs(), I = info(), R = [], ch = S.mode === "chain", g = S.inp === "grid";
    var lu = g ? lenShort(len2(V.u)) : m(String(S.p.mu)), lv = g ? lenShort(len2(V.v)) : m(String(S.p.mv)), lw = g ? lenShort(len2(V.w)) : m(String(S.p.mw));
    R.push([m("|vec{u}|") + ", " + m("|vec{v}|") + (ch ? ", " + m("|vec{w}|") : ""), lu + ", " + lv + (ch ? ", " + lw : "")]);
    if (!g && !ch) {
      R.push(["Angle between (tails together)", m("θ = " + S.p.th + "°")]);
      R.push(["Angle in the triangle", S.mode === "add" ? m("180° - θ = " + (180 - S.p.th) + "°") : m("θ = " + S.p.th + "°") + ' <span class="muted">(the difference closes the tails-together triangle)</span>']);
    }
    if (!g && ch) R.push(["Directions (counterclockwise from east)", m("vec{u}") + " " + S.p.du + "°, " + m("vec{v}") + " " + S.p.dv + "°, " + m("vec{w}") + " " + S.p.dw + "°"]);
    R.push([m("|" + resSrc() + "|"), hidden ? "?" : "<strong>" + lenHTML(I.r2) + "</strong>"]);
    if (S.mode === "add") {
      var su = Math.sqrt(len2(V.u)) + Math.sqrt(len2(V.v)), ex = exactSq(len2(V.u)), ey = exactSq(len2(V.v)), sTxt;
      if (ex != null && ey != null && surd(ex)[1] === 1 && surd(ey)[1] === 1) sTxt = m(String(surd(ex)[0] + surd(ey)[0])); else sTxt = "≈ " + num(su, 2);
      var same = Math.abs(su - Math.sqrt(I.r2)) < 1e-9;
      R.push([m("|vec{u}| + |vec{v}|"), sTxt + (hidden ? "" : same ? " (= " + lenShort(I.r2) + ": they point the same way)" : " (≥ " + lenShort(I.r2) + " ✓)")]);
    }
    if (g) R.push(["Run and rise of the resultant", hidden ? "?" : runRise(V)]);
    if (ch) R.push(["Loop", I.r2 < 1e-9 ? "<strong>closed: resultant = " + m("vec{0}") + "</strong>" : "open"]);
    L.read.innerHTML = MV.readoutHTML(R);
    var lp = $(".vs-loop", L.ctrl);
    lp.hidden = !ch; lp.classList.toggle("on", ch && I.r2 < 1e-9);
    lp.innerHTML = I.r2 < 1e-9 ? "✓ Loop closed: the resultant is " + m("vec{0}") + "." : "Close the loop: the resultant has length " + lenShort(I.r2) + ".";
  }
  function describe(){
    var V = vecs(), I = info(), nm = resName(), g = S.inp === "grid", rT = hidden ? "hidden until the reveal" : lenTxt(I.r2);
    function d(n, a){ return n + " (run " + num(Math.round(a[0] * 100) / 100) + ", rise " + num(Math.round(a[1] * 100) / 100) + ")"; }
    if (S.mode === "chain") {
      var head = g ? d("u", V.u) + ", " + d("v", V.v) + " and " + d("w", V.w) : "u of length " + S.p.mu + " at " + S.p.du + "°, v of length " + S.p.mv + " at " + S.p.dv + "° and w of length " + S.p.mw + " at " + S.p.dw + "°";
      return head + " chained tip to tail; " + (I.r2 < 1e-9 ? "the chain closes, so the resultant is the zero vector." : "the resultant u + v + w has length " + rT + ".");
    }
    var hd = g ? d("u", V.u) + " and " + d("v", V.v) : "u of length " + S.p.mu + " and v of length " + S.p.mv + " at " + S.p.th + "°";
    var vw = S.mode === "add" ? (S.av === "tri" ? ", v placed at the tip of u" : ", tails together, with ghost copies completing the parallelogram") :
      (S.sv === "opp" ? ", with the opposite of " + (S.swap ? "u" : "v") + " dashed at the tip of " + (S.swap ? "v" : "u") : ", tails together; the difference runs from the tip of " + (S.swap ? "u to the tip of v" : "v to the tip of u"));
    return hd + vw + "; their " + (S.mode === "add" ? "sum" : "difference") + " " + nm + " has length " + rT + ".";
  }
  // everything to draw, in data coordinates
  function scene(){
    var V = vecs(), u = V.u, v = V.v, w = V.w, O = [0, 0], A = [], arcs = [], ext = null, pts = [O];
    var P = css("--pen"), T = css("--f3"), F = css("--f5"), K = css("--ink"), K2 = css("--ink-2"), H = css("--hi"), pol_ = S.inp === "polar";
    var th = S.p.th, thF = fontM(16, true);
    if (S.mode === "add") {
      var s = vadd(u, v);
      A.push({ a:O, b:u, o:{ color:P, width:3.2, label:"u", side:-1 } });
      if (S.av === "tri") A.push({ a:u, b:s, o:{ color:T, width:3.2, label:"v", side:-1 } });
      else {
        A.push({ a:O, b:v, o:{ color:T, width:3.2, label:"v", side:1 } });
        if (anim.ghost > 0) { var gv = vsc(u, anim.ghost), gu = vsc(v, anim.ghost); A.push({ a:gv, b:vadd(gv, v), o:{ color:T, width:2.4, dash:[6, 5], alpha:0.55 } }); A.push({ a:gu, b:vadd(gu, u), o:{ color:P, width:2.4, dash:[6, 5], alpha:0.55 } }); }
      }
      if (anim.res > 0 && !(hidden && anim.res === 0)) A.push({ a:O, b:lerp(O, s, anim.res), o:{ color:K, width:4.4, label:anim.res === 1 ? "u + v" : "", side:S.av === "tri" ? 1 : -1, off:20 }, res:true });
      if (pol_ && !hidden) {
        if (S.av === "tri") { ext = [u, vadd(u, [Math.min(2.6, S.p.mv), 0])]; arcs.push({ c:u, a0:0, sw:th, r:24, col:K2, lab:"θ", font:thF }); arcs.push({ c:u, a0:th, sw:180 - th, r:34, col:H, lab:"angle in the triangle", w:3 }); }
        else { arcs.push({ c:O, a0:0, sw:th, r:24, col:K2, lab:"θ", font:thF }); if (anim.ghost === 1) arcs.push({ c:u, a0:th, sw:180 - th, r:30, col:H, lab:"angle in the triangle", w:3 }); }
      }
      pts.push(u, v, s);
    } else if (S.mode === "sub") {
      var f1 = S.swap ? v : u, f2 = S.swap ? u : v, c2 = S.swap ? P : T, n2 = S.swap ? "u" : "v", d = vsub(f1, f2);
      A.push({ a:O, b:u, o:{ color:P, width:3.2, label:"u", side:-1 } });
      A.push({ a:O, b:v, o:{ color:T, width:3.2, label:"v", side:1 } });
      if (S.sv === "opp") {
        if (anim.shift < 1) A.push({ a:f1, b:d, o:{ color:c2, width:2.8, dash:[7, 5], alpha:1 - anim.shift, label:anim.shift === 0 ? "−" + n2 : "", side:-1 } });
        var sh = vsc(f2, anim.shift);
        if (anim.res > 0) A.push({ a:sh, b:vadd(sh, vsc(d, anim.res)), o:{ color:K, width:4.4, label:anim.res === 1 ? resName() : "", side:1, off:20 }, res:true });
        pts.push(d);
      } else if (anim.res > 0) A.push({ a:f2, b:lerp(f2, f1, anim.res), o:{ color:K, width:4.4, label:anim.res === 1 ? resName() : "", side:1, off:20 }, res:true });
      if (pol_ && !hidden) {
        arcs.push({ c:O, a0:0, sw:th, r:24, col:K2, lab:S.sv === "tails" ? "" : "θ", font:thF });
        if (S.sv === "tails") arcs.push({ c:O, a0:0, sw:th, r:34, col:H, lab:"θ: angle in the triangle", w:3 });
        else if (anim.shift === 0) arcs.push({ c:f1, a0:180, sw:th, r:30, col:H, lab:"angle in the triangle", w:3 });
      }
      pts.push(u, v);
    } else {
      var uv = vadd(u, v), s3 = vadd(uv, w);
      A.push({ a:O, b:u, o:{ color:P, width:3.2, label:"u", side:-1 } });
      A.push({ a:u, b:uv, o:{ color:T, width:3.2, label:"v", side:-1 } });
      A.push({ a:uv, b:s3, o:{ color:F, width:3.2, label:"w", side:-1 } });
      if (len2(s3) > 1e-9 && anim.res > 0) A.push({ a:O, b:lerp(O, s3, anim.res), o:{ color:K, width:4.4, label:anim.res === 1 ? "u + v + w" : "", side:1, off:20 }, res:true });
      pts.push(u, uv, s3);
    }
    if (S.tgt && S.mode === "add" && S.inp === "grid") pts.push([6, 2]);
    return { A:A, arcs:arcs, ext:ext, pts:pts };
  }
  function draw(){
    var sc = scene();
    if (!dragging) view = fitView(sc.pts, 9, 1.2);
    var st = tickStep(view);
    plot.draw({ view:view, equal:true, xTicks:{ step:st }, yTicks:{ step:st }, describe:describe(),
      after:function(ctx, pl){
        if (S.tgt && S.mode === "add" && S.inp === "grid") { ringAt(ctx, pl, [6, 2], 10, css("--hi")); tlab(ctx, "target (6, 2)", pl.X(6) + 14, pl.Y(2) + 18, css("--ink"), { align:"left" }); }
        if (sc.ext) seg(ctx, pl, sc.ext[0], sc.ext[1], css("--ink-2"), 1.8, [5, 5]);
        sc.A.forEach(function(a){ if (!a.res) arrow(ctx, pl, a.a, a.b, a.o); });
        sc.A.forEach(function(a){ if (a.res) arrow(ctx, pl, a.a, a.b, a.o); });
        sc.arcs.forEach(function(c){ arcAt(ctx, pl, c.c, c.a0, c.sw, c.r, c.col, { label:c.lab, lfont:c.font, width:c.w }); });
      } });
  }
  plot.render = draw;
  function baseOf(id){ var V = vecs(); if (S.mode === "add" && S.av === "tri" && id === "v") return V.u; if (S.mode === "chain") { if (id === "v") return V.u; if (id === "w") return vadd(V.u, V.v); } return [0, 0]; }
  MV.drag(plot, {
    handles:function(){
      if (S.inp !== "grid" || locked) return [];
      var V = vecs(), hs = [];
      ["u", "v"].concat(S.mode === "chain" ? ["w"] : []).forEach(function(id){
        var b = baseOf(id), p = vadd(b, V[id]);
        hs.push({ id:id, x:p[0], y:p[1], label:"Tip of " + id + ": run " + num(V[id][0]) + ", rise " + num(V[id][1]) + ". Arrow keys move it one unit." });
      });
      return hs;
    },
    move:function(id, x, y, how){
      if (locked) return;
      if (how === "drag") dragging = true;
      var b = baseOf(id), nv = [clamp(Math.round(x - b[0]), -8, 8), clamp(Math.round(y - b[1]), -8, 8)], cur = S.g[id];
      if (cur[0] === nv[0] && cur[1] === nv[1]) return;
      S.g[id] = nv; paintAll(); o.save(); o.changed();
    },
    end:function(){ dragging = false; draw(); }
  });
  function paintAll(){ paintVals(); readout(); draw(); }
  function changed(structural){ if (structural) paintCtrl(); paintAll(); o.save(); o.changed(); }
  L.ctrl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked) return;
    if (b.dataset.st) { var k = b.dataset.st; S.p[k] = clamp(S.p[k] + +b.dataset.d, 1, 8); changed(false); return; }
    if (b.dataset.act === "swap") { S.swap = !S.swap; changed(true); }
  });
  L.ctrl.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.sl; if (!k || locked) return;
    S.p[k] = Math.round(+e.target.value / 15) * 15; changed(false);
  });
  paintCtrl(); paintAll();
  return {
    apply:function(st){
      ["mode", "inp", "av", "sv", "swap", "tgt"].forEach(function(k){ if (st[k] != null) S[k] = st[k]; });
      if (st.g) Object.keys(st.g).forEach(function(k){ S.g[k] = st.g[k].slice(); });
      if (st.p) Object.keys(st.p).forEach(function(k){ S.p[k] = st.p[k]; });
      hidden = !!st.hide; anim.res = hidden ? 0 : 1; anim.ghost = st.ghost0 ? 0 : 1; anim.shift = 0;
      paintCtrl(); paintAll(); o.save(); o.changed();
    },
    lock:function(b){ locked = !!b; applyLock(); draw(); },
    locked:function(){ return locked; },
    hide:function(b){ hidden = !!b; readout(); draw(); },
    anim:anim, S:S, info:info,
    paint:function(){ paintCtrl(); paintAll(); },
    draw:draw
  };
}

// ---------- Explore: the tip-to-tail table, predictions and challenges ----------
var PSTART = {
  p1:{ mode:"add", inp:"grid", av:"tri", tgt:false, g:{ u:[3, 0], v:[0, 4] }, hide:true },
  p2:{ mode:"add", inp:"grid", av:"par", tgt:false, g:{ u:[5, 1], v:[2, 4] }, hide:true, ghost0:true },
  p3:{ mode:"sub", inp:"grid", sv:"tails", swap:false, g:{ u:[5, 2], v:[1, 4] }, hide:true },
  p4:{ mode:"add", inp:"polar", av:"tri", p:{ mu:3, mv:5, th:0 } }
};
var SETUP = {
  1:{ mode:"add", inp:"grid", av:"tri", tgt:true, g:{ u:[2, 5], v:[1, 1] } },
  2:{ mode:"add", inp:"polar", av:"tri", p:{ mu:5, mv:8, th:90 } },
  3:{ mode:"chain", inp:"polar", p:{ mu:4, mv:4, mw:4, du:0, dv:90, dw:180 } }
};
function explore(host, api){
  var S = api.S, wrap = document.createElement("div"); host.appendChild(wrap);
  var B = vectorBoard(wrap, { S:S, save:api.save, changed:api.changed });
  var su = document.createElement("div"); su.className = "vs-setup"; host.appendChild(su);
  su.innerHTML = '<span class="tiny" style="font-weight:700">Challenge set-ups:</span>' + [1, 2, 3].map(function(i){ return '<button type="button" class="btn ghost sm" data-setup="' + i + '" data-k="vssu' + i + '">Set up challenge ' + i + "</button>"; }).join("");
  su.addEventListener("click", function(e){ var b = e.target.closest("[data-setup]"); if (!b || B.locked()) return; B.apply(SETUP[b.dataset.setup]); });
  function tw(dur, step, done){ MV.tween({ dur:dur, step:step, done:done }); }
  function chal(id){
    var P = S.p;
    if (id === "tc1") {
      if (S.mode !== "add" || S.inp !== "grid") return { ok:false, msg:"Switch to Add mode with Grid input (or press Set up challenge 1)." };
      if (S.g.u[0] !== 2 || S.g.u[1] !== 5) return { ok:false, msg:md("Keep `vec{u}` at run 2, rise 5 (press Set up challenge 1).") };
      var v = S.g.v;
      if (v[0] === 4 && v[1] === -3) return { ok:true };
      if (v[0] === 6 && v[1] === 2) return { ok:false, msg:md("You made `vec{v}` reach the target from the origin, but `vec{v}` starts at `vec{u}`’s tip. `vec{v}` = target − `vec{u}`.") };
      if (v[0] === -4 && v[1] === 3) return { ok:false, msg:"That’s the opposite of what’s needed." };
      return { ok:false, msg:md("`vec{u} + vec{v}` ends at (" + num(2 + v[0]) + ", " + num(5 + v[1]) + "), not at the target (6, 2).") };
    }
    if (id === "tc2") {
      if (S.mode !== "add" || S.inp !== "polar") return { ok:false, msg:"Switch to Add mode with Polar input (or press Set up challenge 2)." };
      if (P.mu !== 5 || P.mv !== 8) return { ok:false, msg:md("Set `|vec{u}| = 5` and `|vec{v}| = 8` first.") };
      if (P.th === 120) return { ok:true };
      if (P.th === 60) return { ok:false, msg:md("At 60° they point fairly close together, so the sum is longer: `√129` ≈ 11.4. You used 60° as the triangle’s angle; the angle between is 180° − 60°.") };
      if (P.th === 90) return { ok:false, msg:md("`√89` ≈ 9.4: still too long.") };
      var r2 = 89 + 80 * Math.cos(P.th * D2R);
      return { ok:false, msg:md("At `θ = " + P.th + "°`, `|vec{u} + vec{v}|` is " + lenTxt(r2) + ", not 7.") };
    }
    if (id === "tc3") {
      if (S.mode !== "chain" || S.inp !== "polar") return { ok:false, msg:"Switch to Chain mode with Polar input (or press Set up challenge 3)." };
      if (P.mu !== 4 || P.mv !== 4 || P.mw !== 4) return { ok:false, msg:"Set all three magnitudes to 4." };
      var d = [P.du, P.dv, P.dw].sort(function(a, b){ return a - b; }), g1 = d[1] - d[0], g2 = d[2] - d[1];
      if (g1 === 120 && g2 === 120) return { ok:true };
      var opp = [[P.du, P.dv], [P.du, P.dw], [P.dv, P.dw]].some(function(q){ return Math.abs(q[0] - q[1]) === 180; });
      if (opp) return { ok:false, msg:md("The first two cancel, leaving the third. " + "Back where you started means no displacement: the sum is `vec{0}`.") };
      if (g1 === 60 && g2 === 60) return { ok:false, msg:"Resultant 8. Each turn should be bigger." };
      var r = vadd(vadd(pol(4, P.du), pol(4, P.dv)), pol(4, P.dw));
      return { ok:false, msg:md("The resultant has length " + lenTxt(len2(r)) + ", not 0. Tip to tail, the three arrows must close up.") };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){ B.lock(false); B.apply(PSTART[p.id]); B.lock(true); },
      run:function(p, done){
        var A = B.anim, fin = function(){ B.hide(false); A.res = 1; A.ghost = 1; A.shift = 0; B.lock(false); B.paint(); done(); };
        if (p.id === "p1") tw(1000, function(t){ A.res = t; B.draw(); }, fin);
        else if (p.id === "p2") tw(1300, function(t){ A.ghost = t; B.draw(); }, function(){ A.ghost = 1; tw(900, function(t){ A.res = t; B.draw(); }, fin); });
        else if (p.id === "p3") {
          S.sv = "opp"; B.hide(false); A.res = 0; B.paint();
          tw(800, function(t){ A.res = t; B.draw(); }, function(){
            A.res = 1; B.draw();
            MV.wait(500, function(){ tw(1400, function(t){ A.shift = t; B.draw(); }, function(){ S.sv = "tails"; A.shift = 0; api.save(); fin(); }); });
          });
        }
        else if (p.id === "p4") tw(3600, function(t){ var th = Math.round(t * 12) * 15; if (th !== S.p.th) { S.p.th = th; B.paint(); } }, function(){ S.p.th = 180; api.save(); fin(); });
        else fin();
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Resultants by hand (two stations) ----------
var S2 = [
  { t:"Draw the first leg: 4 km east." },
  { t:"From its tip, draw the second leg: 4 km at N 30° E. That direction is 30° from north, so it turns 60° left of east.",
    q:{ k:"c2a", ask:"What angle is inside the triangle at the joint?", ch:["120°", "60°", "30°"], ok:"120°",
      fb:{ "120°":"Right: the second leg turns 60° from the first, so inside the triangle the angle is 180° − 60° = 120°.",
        "60°":"Tip to tail, the angle inside the triangle is `180° - θ`. The turn is 60°; inside it’s 180° − 60°.",
        "30°":"N 30° E is 30° from north, which is 60° from east. Inside the triangle: 180° − 60°." } } },
  { t:"Magnitude: `d^2 = 16 + 16 - 32 cos 120° = 48`, so `d = 4√3` km." },
  { t:"Direction: the triangle is isosceles, so its base angles are each 30°. The resultant points 30° north of east. Sine law check: `{sin φ}/{4} = {sin 120°}/{4√3}` gives `sin φ = {1}/{2}`, so `φ = 30°`." },
  { t:"As a bearing: 90° − 30° = 060°. The return trip is 060° + 180° = 240°.",
    q:{ k:"c2b", ask:"What bearing takes you straight back to the start?", ch:["240°", "060°", "150°"], ok:"240°",
      fb:{ "240°":"Right: reverse the resultant by adding 180° to its bearing.", "060°":"That’s the way out. Convert the triangle’s angle into a bearing; to go back, add 180°.", "150°":"To go back, add 180° to the bearing, not 90°." } } }
];
function part3(host, api){
  var S = api.S;
  S.st = S.st === "s2" ? "s2" : "s1"; S.th1 = [60, 90, 120].indexOf(S.th1) >= 0 ? S.th1 : 60; S.slid = !!S.slid;
  S.step = Number.isInteger(S.step) ? clamp(S.step, 0, 4) : 0; S.c2a = S.c2a || ""; S.c2b = S.c2b || "";
  var slideT = S.slid ? 1 : 0, busy = false;
  host.innerHTML = '<div class="vs-st3"></div>' +
    '<div class="vs-s1"><h3 class="vs-h">Station 1: which angle goes in the cosine law?</h3><p>' + m("|vec{u}| = 3") + " and " + m("|vec{v}| = 5") + ", drawn tails together. Choose the angle between them, then slide " + m("vec{v}") + " to " + m("vec{u}") + "’s tip.</p>" +
      '<div class="sym vs-p3"><div><div class="chips vs-ths" role="group" aria-label="Angle between u and v"></div>' +
      '<div class="plot-wrap"><canvas class="plot" id="vs-s1plot" role="img" aria-label="Station 1 drawing"></canvas></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-act="slide" data-k="vsslide"></button></div></div>' +
      '<div><dl class="read" id="vs-s1read" aria-live="polite"></dl><p class="vs-say" aria-live="polite"></p>' +
      '<details class="alg"><summary>Check it with algebra</summary><div>' +
        "<p>" + m("|vec{u} + vec{v}|^2 = |vec{u}|^2 + |vec{v}|^2 - 2|vec{u}||vec{v}| cos(180° - θ) = |vec{u}|^2 + |vec{v}|^2 + 2|vec{u}||vec{v}| cos θ") + ".</p>" +
        "<p>With " + m("|vec{u}| = 3") + ", " + m("|vec{v}| = 5") + ": " + m("θ = 60°") + " gives 49 (so 7); " + m("θ = 120°") + " gives 19 (so " + m("√19") + ").</p>" +
        "<p>And " + m("|vec{u} - vec{v}|^2 = |vec{u}|^2 + |vec{v}|^2 - 2|vec{u}||vec{v}| cos θ") + ": the same triangle with " + m("θ") + " itself inside.</p></div></details></div></div></div>" +
    '<div class="vs-s2"><h3 class="vs-h">Station 2: a two-leg walk</h3><p>Walk 4 km east, then 4 km at N 30° E. Where do you end up?</p>' +
      '<div class="sym vs-p3"><div><div class="plot-wrap"><canvas class="plot" id="vs-s2plot" role="img" aria-label="Station 2 drawing"></canvas></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="prev" data-k="vsprev">Previous</button><span class="tiny muted vs-stepn" aria-live="polite"></span><button type="button" class="btn primary sm" data-act="next" data-k="vsnext">Next step</button></div></div>' +
      '<div><ol class="vs-steps"></ol><div class="vs-q2"></div></div></div></div>';
  var stSeg = MV.seg($(".vs-st3", host), { label:"Station:", value:S.st, options:[{ id:"s1", t:"1" }, { id:"s2", t:"2" }], onChange:function(v){ S.st = v; api.save(); paint(); } });
  var p1 = new MV.Plot($("#vs-s1plot", host), { xmin:-3, xmax:9, ymin:-1.5, ymax:6.5 }), p2 = new MV.Plot($("#vs-s2plot", host), { xmin:-1, xmax:7.5, ymin:-1.3, ymax:5 });
  var U1 = [3, 0];
  function draw1(){
    var th = S.th1, v = pol(5, th), tail = vsc(U1, slideT), s = vadd(U1, v), O = [0, 0], K2 = css("--ink-2"), H = css("--hi");
    p1.draw({ view:{ xmin:-3.2, xmax:9, ymin:-1.4, ymax:6.4 }, equal:true, xTicks:{ step:1 }, yTicks:{ step:1 },
      describe:"u of length 3 pointing east and v of length 5 at " + th + "° from u" + (slideT === 1 ? ", placed at the tip of u. The angle inside the triangle at the joint is 180° − " + th + "° = " + (180 - th) + "°, and u + v has length " + lenTxt(34 + 30 * Math.cos(th * D2R)) + "." : ", tails together. The angle between them is " + th + "°."),
      after:function(ctx, pl){
        if (slideT === 1) { seg(ctx, pl, U1, [5.6, 0], K2, 1.8, [5, 5]); arrow(ctx, pl, O, s, { color:css("--ink"), width:4.4, label:"u + v", side:1, off:20 }); }
        arrow(ctx, pl, O, U1, { color:css("--pen"), width:3.2, label:"u", side:-1 });
        arrow(ctx, pl, tail, vadd(tail, v), { color:css("--f3"), width:3.2, label:"v", side:slideT === 1 ? -1 : 1 });
        if (slideT === 0) arcAt(ctx, pl, O, 0, th, 26, K2, { label:"θ = " + th + "°", lfont:fontM(15, true) });
        if (slideT === 1) { arcAt(ctx, pl, U1, 0, th, 24, K2, { label:"θ", lfont:fontM(15, true) }); arcAt(ctx, pl, U1, th, 180 - th, 34, H, { width:3, label:"180° − θ = " + (180 - th) + "°" }); }
      } });
  }
  function read1(){
    var th = S.th1, sq = 34 + 30 * Math.cos(th * D2R), cs = th === 60 ? "(-{1}/{2})" : th === 90 ? "(0)" : "({1}/{2})", sl = slideT === 1;
    $("#vs-s1read", host).innerHTML = MV.readoutHTML([
      [m("|vec{u}|") + ", " + m("|vec{v}|"), "3, 5"],
      ["Angle between (tails together)", m("θ = " + th + "°")],
      ["Angle in the triangle", sl ? m("180° - θ = " + (180 - th) + "°") : '<span class="muted">slide ' + m("vec{v}") + " to see it</span>"],
      [m("|vec{u} + vec{v}|^2"), sl ? m("9 + 25 - 30 cos " + (180 - th) + "° = 9 + 25 - 30" + cs + " = " + Math.round(sq)) : "?"],
      [m("|vec{u} + vec{v}|"), sl ? "<strong>" + lenHTML(sq) + "</strong>" : "?"]
    ]);
    $(".vs-say", host).innerHTML = sl ? "Tip to tail, the angle at the joint is " + m("180° - θ") + ", not " + m("θ") + ". Using " + m("θ") + " would give " + m("|vec{u} - vec{v}|") + " instead." : "";
    var b = $('[data-act="slide"]', host); b.innerHTML = sl ? "Back to tails together" : "Slide " + m("vec{v}") + " to " + m("vec{u}") + "’s tip"; b.disabled = busy;
    var ths = $(".vs-ths", host);
    MV.keepFocus(ths, function(){ ths.innerHTML = [60, 90, 120].map(function(t){ return '<button type="button" class="fchip" data-th1="' + t + '" data-k="vsth' + t + '" aria-pressed="' + (t === th) + '"' + (busy ? " disabled" : "") + ">" + t + "°</button>"; }).join(""); });
  }
  function draw2(){
    var k = S.step, O = [0, 0], A = [4, 0], B = vadd(A, pol(4, 60)), K2 = css("--ink-2"), H = css("--hi");
    p2.draw({ view:{ xmin:-1.2, xmax:7.6, ymin:-1.4, ymax:5.2 }, equal:true, xTicks:{ step:1 }, yTicks:{ step:1 }, xLabel:"km east", yLabel:"km north",
      describe:"Step " + (k + 1) + " of 5. The first leg goes 4 km east" + (k >= 1 ? "; the second goes 4 km at N 30° E from its tip, and the angle inside the triangle at the joint is 120°" : "") + (k >= 2 ? "; the resultant from the start to the finish is 4√3 km" : "") + (k >= 3 ? ", 30° north of east" : "") + (k >= 4 ? ": bearing 060°, return bearing 240°." : "."),
      after:function(ctx, pl){
        tlab(ctx, "N", pl.X(-0.6), pl.Y(4.75), css("--ink"), { px:13 }); arrow(ctx, pl, [-0.6, 3.6], [-0.6, 4.45], { color:css("--ink"), width:2 });
        arrow(ctx, pl, O, A, { color:css("--pen"), width:3.2 }); tlab(ctx, "4 km", pl.X(2), pl.Y(0) + 16, css("--pen"));
        if (k >= 1) {
          seg(ctx, pl, A, [4, 4.2], K2, 1.6, [5, 5]); seg(ctx, pl, A, [6.6, 0], K2, 1.6, [5, 5]);
          arrow(ctx, pl, A, B, { color:css("--f3"), width:3.2 }); tlab(ctx, "4 km", pl.X(5.4) + 22, pl.Y(1.7), css("--f3"), { align:"left" });
          arcAt(ctx, pl, A, 60, 30, 30, K2, { label:"30°" });
          arcAt(ctx, pl, A, 60, 120, 20, H, { width:3, label:"120°", loff:10 });
        }
        if (k >= 2) { arrow(ctx, pl, O, B, { color:css("--ink"), width:4.4 }); tlab(ctx, "4√3 km", pl.X(3) - 12, pl.Y(1.73) - 16, css("--ink"), { align:"right" }); }
        if (k >= 3) arcAt(ctx, pl, O, 0, 30, 40, H, { width:3, label:"30°" });
        if (k >= 4) { seg(ctx, pl, O, [0, 4.2], K2, 1.6, [5, 5]); arcAt(ctx, pl, O, 30, 60, 58, K2, { label:"060°" }); }
      } });
  }
  function paint2(){
    var k = S.step;
    $(".vs-steps", host).innerHTML = S2.slice(0, k + 1).map(function(s, i){ return "<li" + (i === k ? ' class="cur"' : "") + ">" + md(s.t) + "</li>"; }).join("");
    $(".vs-stepn", host).textContent = "Step " + (k + 1) + " of " + S2.length;
    $('[data-act="prev"]', host).disabled = k === 0; $('[data-act="next"]', host).disabled = k === S2.length - 1;
    var q = null; for (var i = k; i >= 0; i--) if (S2[i].q) { q = S2[i].q; break; }
    var qh = $(".vs-q2", host);
    MV.keepFocus(qh, function(){
      if (!q) { qh.innerHTML = ""; return; }
      var pick = S[q.k];
      qh.innerHTML = '<p class="vs-qask"><strong>' + q.ask + '</strong></p><div class="chips" role="group" aria-label="' + MV.esc(q.ask) + '">' + q.ch.map(function(c){ return '<button type="button" class="fchip" data-q2="' + q.k + '" data-v="' + c + '" data-k="vs' + q.k + c + '" aria-pressed="' + (pick === c) + '">' + c + "</button>"; }).join("") + "</div>" +
        (pick ? MV.fbHTML(pick === q.ok ? "good" : "bad", (pick === q.ok ? "" : "✗ Not quite. ") + md(q.fb[pick]) + (pick === q.ok ? "" : " Try another.")) : "");
    });
    draw2();
  }
  function paint(){
    stSeg.set(S.st);
    $(".vs-s1", host).hidden = S.st !== "s1"; $(".vs-s2", host).hidden = S.st !== "s2";
    if (S.st === "s1") { read1(); draw1(); } else paint2();
  }
  p1.render = draw1; p2.render = draw2;
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.th1) { S.th1 = +b.dataset.th1; S.slid = false; slideT = 0; api.save(); paint(); return; }
    if (b.dataset.act === "slide") {
      if (S.slid) { S.slid = false; slideT = 0; api.save(); paint(); return; }
      busy = true; read1();
      MV.tween({ dur:1100, step:function(t){ slideT = t; draw1(); }, done:function(){ slideT = 1; S.slid = true; busy = false; api.save(); paint(); } });
      return;
    }
    if (b.dataset.act === "prev") { S.step = Math.max(0, S.step - 1); api.save(); paint2(); return; }
    if (b.dataset.act === "next") { S.step = Math.min(S2.length - 1, S.step + 1); api.save(); paint2(); return; }
    if (b.dataset.q2) { S[b.dataset.q2] = b.dataset.v; api.save(); paint2(); MV.focusFb($(".vs-q2", host)); }
  });
  paint();
  return {};
}

// ---------- Practice 1 figure: parallelogram ABCD ----------
function figABCD(p){
  var A = [0, 0], B = [5, 0], D = [1.6, 2.6], C = [6.6, 2.6];
  p.draw({ view:{ xmin:-0.9, xmax:7.5, ymin:-0.9, ymax:3.5 }, equal:true, grid:false, axes:false,
    describe:"Parallelogram ABCD: the arrow from A to B along the bottom is u, the arrow from A to D up the left side is v, and C is opposite A.",
    after:function(ctx, pl){
      seg(ctx, pl, A, C, css("--ink-2"), 1.4, [3, 5]); seg(ctx, pl, B, D, css("--ink-2"), 1.4, [3, 5]);
      seg(ctx, pl, D, C, css("--ink-2"), 2); seg(ctx, pl, B, C, css("--ink-2"), 2);
      arrow(ctx, pl, A, B, { color:css("--pen"), width:3.2, label:"u", side:-1 });
      arrow(ctx, pl, A, D, { color:css("--f3"), width:3.2, label:"v", side:1 });
      [[A, "A", -14, 12], [B, "B", 14, 12], [C, "C", 14, -12], [D, "D", -14, -12]].forEach(function(q){ tlab(ctx, q[1], pl.X(q[0][0]) + q[2], pl.Y(q[0][1]) + q[3], css("--ink"), { px:15 }); });
    } });
}

// ---------- Practice 2: Resultants (@component V8 surdBox — exact answer "□√□": the number in front and the radicand; an
// empty radicand means a whole number, an empty front box means 1. Judged by MV.mcv.exact.judge: an equal but unsimplified
// radical gets its note and doesn't count as a try. Items: {ask, lead, unit, deg, answer:"5√2" | "13", wrong:[{v, fb}]}) ----------
function parseAns(s){ s = String(s).replace(/\s/g, ""); var r = /^(\d*)√(\d+)$/.exec(s); return r ? { c:r[1] ? +r[1] : 1, r:+r[2] } : { c:+s, r:1 }; }
function resAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { c:"", r:"", tries:0, hint:0, solved:false, first:null }); }
  function box(it){
    var x = ist(it.id), dis = x.solved ? " disabled" : "";
    var c = '<input class="numin vs-c" data-f="c" data-k="' + it.id + 'c" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + (it.deg ? "Angle in degrees" : "Number in front of the root; leave it empty for 1") + '" value="' + MV.esc(x.c) + '"' + dis + ">";
    var r = it.deg ? "°" : '<span class="vs-rt" aria-hidden="true">√</span><input class="numin vs-r" data-f="r" data-k="' + it.id + 'r" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="Number under the root; leave it empty for a whole number" value="' + MV.esc(x.r) + '"' + dis + ">";
    return '<div class="vs-v8" role="group" aria-label="Your exact answer"><span class="vs-v8l">' + (it.lead || "") + "</span>" + c + r + (it.unit ? ' <span class="vs-unit">' + it.unit + "</span>" : "") + "</div>";
  }
  function ansHTML(it){ var A = parseAns(MV.ans(it)); return (A.r === 1 ? m(String(A.c)) : m(surdSrc(A.c * A.c * A.r))) + (it.deg ? "°" : it.unit ? " " + it.unit : ""); }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .vs-v8c', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + ansHTML(it) + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", (msgs[it.id].bad ? "<strong>✗ Not quite.</strong> " : "") + msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it, i){
    return '<div class="q vs-rq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.ask + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>" +
      box(it) + '<div class="vs-v8c"></div></div>';
  }).join("");
  a.items.forEach(paintCtl);
  function judge(it){
    var x = ist(it.id), cs = String(x.c || "").trim(), rs = it.deg ? "" : String(x.r || "").trim();
    if (!cs && !rs) return { err:"Fill in the " + (it.deg ? "box" : "boxes") + " first." };
    var c = cs ? Q.raw(cs) : { n:1, d:1 };
    if (!c) return { err:"Type a whole number or a fraction" + (it.deg ? "." : " in the front box.") };
    if (rs && !/^\d+$/.test(rs)) return { err:"The number under the root must be a whole number." };
    var r = rs ? +rs : 1, val = c.n / c.d * Math.sqrt(r), A = parseAns(MV.ans(it)), av = A.c * Math.sqrt(A.r);
    if (val < 0) return { ok:false, msg:it.deg ? "The angle between two vectors is from 0° to 180°." : "A length can’t be negative." };
    if (Math.abs(val - av) < 1e-9) {
      var simp = true, note = "";
      try {
        var j = EXACT.judge({ num:[r === 1 ? { c:c, r:1, k:1 } : { c:c, r:r, k:2 }], den:[{ c:{ n:1, d:1 }, r:1, k:1 }] }, { num:SX.of([[A.c, A.r]]), den:SX.of([[1]]) });
        if (j && j.equal && !j.simplified) { simp = false; note = j.msg ? md(j.msg) : ""; }
      } catch (e) { var sr = surd(r); simp = sr[0] === 1 && c.d === 1; }
      if (!simp) return { simp:true, msg:"That’s equal to the answer, but simplify it. " + (note || "Take square factors out of the root.") };
      return { ok:true };
    }
    var w = (it.wrong || []).filter(function(z){ var q = parseAns(z.v); return Math.abs(val - q.c * Math.sqrt(q.r)) < 1e-9; })[0];
    return { ok:false, msg:w ? md(w.fb) : it.deg ? "Find the angle inside the triangle first; the angle between is 180° minus that angle." : "Draw the tip-to-tail triangle and use the cosine law with the angle inside it." };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.f) return; var q = t.closest("[data-q]"); ist(q.dataset.q)[t.dataset.f] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.f) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.simp) msgs[it.id] = { bad:false, html:r.msg };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; $$("input", q).forEach(function(inp){ inp.disabled = true; }); }
    else { x.tries++; msgs[it.id] = { bad:true, html:r.msg + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- performance task: Exactly 7 ----------
var task = (function(){
  var api, plot, TH = [0, 30, 60, 90, 120, 150, 180], C2 = { 0:2, 60:1, 90:0, 120:-1, 180:-2 };   // 2 cos θ where it is a whole number
  function read(){ var S = api ? api.S : {}, a = S.a, b = S.b, t = S.t; return { a:a, b:b, t:t, valid:Number.isInteger(a) && a >= 1 && a <= 8 && Number.isInteger(b) && b >= 1 && b <= 8 && TH.indexOf(t) >= 0 }; }
  function sq(d, sgn){ return d.a * d.a + d.b * d.b + sgn * 2 * d.a * d.b * Math.cos(d.t * D2R); }
  function draw(){
    var d = read(); if (!d.valid) return;
    var O = [0, 0], u = [d.a, 0], v = pol(d.b, d.t), s = vadd(u, v), V = { xmin:Math.min(-1, v[0], s[0]) - 1.5, xmax:Math.max(u[0], s[0], 1) + 1.5, ymin:-1.5, ymax:Math.max(s[1], v[1], 1) + 1.5 };
    plot.draw({ view:V, equal:true, xTicks:{ step:1 }, yTicks:{ step:1 },
      describe:"u of length " + d.a + " and v of length " + d.b + " at " + d.t + "°, tails together, with ghost copies completing the parallelogram. The sum diagonal u + v has length " + lenTxt(sq(d, 1)) + "; the difference diagonal u − v, from the tip of v to the tip of u, has length " + lenTxt(sq(d, -1)) + ".",
      after:function(ctx, pl){
        if (d.t !== 0 && d.t !== 180) { arrow(ctx, pl, u, s, { color:css("--f3"), width:2.2, dash:[6, 5], alpha:0.5 }); arrow(ctx, pl, v, s, { color:css("--pen"), width:2.2, dash:[6, 5], alpha:0.5 }); }
        arrow(ctx, pl, O, u, { color:css("--pen"), width:3.2, label:"u", side:-1 });
        arrow(ctx, pl, O, v, { color:css("--f3"), width:3.2, label:"v", side:1 });
        if (len2(vsub(u, v)) > 1e-9) arrow(ctx, pl, v, u, { color:css("--ink-2"), width:3, label:"u − v", side:-1, off:20 });
        if (len2(s) > 1e-9) arrow(ctx, pl, O, s, { color:css("--ink"), width:4.4, label:"u + v", side:1, off:20 });
        if (d.t > 0 && d.t < 180) arcAt(ctx, pl, O, 0, d.t, 22, css("--ink-2"), { label:d.t + "°", lfont:fontM(14, true) });
      } });
  }
  function readout(){
    var d = read(), el = $("#x7-read"); if (!el || !d.valid) return;
    $("#x7-cap").innerHTML = m("|vec{u}| = " + d.a) + ", " + m("|vec{v}| = " + d.b) + ", " + m("θ = " + d.t + "°");
    el.innerHTML = MV.readoutHTML([
      [m("|vec{u} + vec{v}|"), "<strong>" + lenHTML(sq(d, 1)) + "</strong>"],
      [m("|vec{u} - vec{v}|"), "<strong>" + lenHTML(sq(d, -1)) + "</strong>"],
      [m("|vec{u} + vec{v}|^2 = a^2 + b^2 + 2ab cos θ"), C2[d.t] != null ? m(d.a * d.a + " + " + d.b * d.b + " + " + (C2[d.t] < 0 ? "(" + C2[d.t] * d.a * d.b + ")" : C2[d.t] * d.a * d.b) + " = " + (d.a * d.a + d.b * d.b + C2[d.t] * d.a * d.b)) : m(d.a * d.a + d.b * d.b + " " + (d.t === 30 ? "+" : "-") + " " + d.a * d.b + "√3") + " (not a whole number)"]
    ]);
  }
  function paintIn(){
    var S = api.S;
    $$("[data-x7o]").forEach(function(o){ o.textContent = S[o.dataset.x7o]; });
    $$("[data-x7t]").forEach(function(b){ b.setAttribute("aria-pressed", String(+b.dataset.x7t === S.t)); });
  }
  return {
    render:function(inp, pv, ap){
      api = ap; var S = ap.S;
      if (!Number.isInteger(S.a)) S.a = 3; if (!Number.isInteger(S.b)) S.b = 5; if (TH.indexOf(S.t) < 0) S.t = 60;
      function stp(k, nm){ return '<div class="vs-stp" role="group" aria-label="Magnitude of ' + nm + '"><span class="vs-stl">' + m("|vec{" + nm + "}|") + '</span><button type="button" class="btn ghost sm" data-x7="' + k + '" data-d="-1" data-k="x7' + k + 'm" aria-label="Decrease the magnitude of ' + nm + '">−</button><output class="vs-sto" data-x7o="' + k + '">' + S[k] + '</output><button type="button" class="btn ghost sm" data-x7="' + k + '" data-d="1" data-k="x7' + k + 'p" aria-label="Increase the magnitude of ' + nm + '">+</button></div>'; }
      inp.innerHTML = '<div class="vs-stps">' + stp("a", "u") + stp("b", "v") + '</div><p class="tiny" style="font-weight:700;margin:10px 0 4px">Angle between, ' + m("θ") + '</p><div class="chips" role="group" aria-label="Angle between u and v">' +
        TH.map(function(t){ return '<button type="button" class="fchip" data-x7t="' + t + '" data-k="x7t' + t + '" aria-pressed="' + (t === S.t) + '">' + t + "°</button>"; }).join("") + "</div>";
      pv.innerHTML = '<p class="eq-cap" id="x7-cap" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot" id="x7-plot" role="img" aria-label="Your vectors, tails together, with both diagonals"></canvas></div><dl class="read" id="x7-read" aria-live="polite" style="margin-top:10px"></dl>';
      plot = new MV.Plot($("#x7-plot"), { xmin:-2, xmax:10, ymin:-2, ymax:8 }); plot.render = draw;
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.x7) { var k = b.dataset.x7; S[k] = clamp(S[k] + +b.dataset.d, 1, 8); }
        else if (b.dataset.x7t) S.t = +b.dataset.x7t;
        else return;
        ap.save(); paintIn(); draw(); readout(); ap.update();
      });
      draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Choose magnitudes from 1 to 8 and an angle."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      return [C2[d.t] != null && d.a * d.a + d.b * d.b + C2[d.t] * d.a * d.b === 49, d.a !== d.b, d.t !== 0 && d.t !== 180, d.t > 90];
    },
    key:function(d){ return d.a + "," + d.b + "," + d.t; },
    label:function(k){ var p = k.split(","); return "(" + p[0] + ", " + p[1] + ", " + p[2] + "°)"; },
    text:function(k){ var p = k.split(","); return "|u| = " + p[0] + ", |v| = " + p[1] + ", θ = " + p[2] + "°"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ resultants:resAct },
  task:task,
  figures:{ abcd:figABCD }
});
})();
