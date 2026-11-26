// MHF4U 25 Radian Measure: hero (radius pieces wrap a circle), Explore "Radius wrapper" (G8 circle drawings + ruler strip),
// Spin lab (N19 wheel, belt view, Predict-then-run, unit-chain builder), "Find the missing piece" entries and the
// "Roll to quadrant 2" task (N19 wheel rolling on a track).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, PI = Math.PI, TAU = 2 * Math.PI;
var TH = "@t{θ}";

// ---------- small helpers ----------
function fx(v, dp){ var s = Math.abs(v).toFixed(dp); return (v < 0 && Number(s) !== 0 ? MINUS : "") + s; }
function gcd(a, b){ a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
// nπ/d in lowest terms as m() source ("2π/3", stacked "{2π}/{3}")
function piSrc(n, d, stacked){
  var g = gcd(n, d); n = Math.round(n / g); d = Math.round(d / g);
  if (!n) return "0";
  var a = Math.abs(n), top = (a === 1 ? "" : a) + "π";
  return (n < 0 ? "-" : "") + (d === 1 ? top : stacked ? "{" + top + "}/{" + d + "}" : top + "/" + d);
}
function fracSrc(n, d, stacked){ var g = gcd(n, d); n = Math.round(n / g); d = Math.round(d / g); return d === 1 ? String(n) : stacked ? "{" + n + "}/{" + d + "}" : n + "/" + d; }
var WORD = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty-one twenty-two twenty-three twenty-four".split(" ");
// N3 spoken form: "two pi over three"
function piSpoken(n, d){ var g = gcd(n, d); n = Math.round(n / g); d = Math.round(d / g); if (!n) return "zero"; return (n === 1 ? "" : (WORD[n] || n) + " ") + "pi" + (d === 1 ? "" : " over " + (WORD[d] || d)); }
function cols(){ return { pen:css("--pen"), ink:css("--ink"), ink2:css("--ink-2"), hi:css("--hi"), hiSoft:css("--hi-soft"), f3:css("--f3"), pt:css("--p-t"), rule:css("--rule"), sheet:css("--sheet") }; }
function def(o, d){ Object.keys(d).forEach(function(k){ if (o[k] === undefined) o[k] = d[k]; }); return o; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
var LIN = function(t){ return t; };
var AX = ["positive <i>x</i>-axis", "positive <i>y</i>-axis", "negative <i>x</i>-axis", "negative <i>y</i>-axis"];
function axisName(i){ return AX[((i % 4) + 4) % 4]; }
// "1/2 turn", "3 turns", "1 1/2 turns" for n/d turns
function turnsTxt(n, d){
  var g = gcd(n, d); n = Math.round(n / g); d = Math.round(d / g);
  var w = Math.floor(n / d), r = n - w * d;
  if (!r) return w + (w === 1 ? " turn" : " turns");
  var f = MV.m(r + "/" + d);
  return w ? w + " " + f + " turns" : f + " turn";
}

// @component radioGroup — segmented control or chip row as a real radio group (arrow keys, roving tabindex, lock while animating)
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), lock(bool)}
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } } };
}

// @component G8 circleDraw — circles, thick arcs, sectors, angle markers, terminal arms, tick rings, polylines and labels
// on an equal-scale MV.Plot (G9). Angles in radians, counterclockwise from the positive x-axis; lengths in data units
// (rPx / offPx in pixels). Use inside plot.draw({ equal:true, after:function(ctx, p){ CD.arc(p, { r:3, a0:0, a1:2 }); } }).
var CD = (function(){
  function px(p, r){ return Math.abs(p.X(r) - p.X(0)); }
  function dat(p, n){ return n / Math.abs(p.X(1) - p.X(0)); }
  function Rof(p, o){ return (o.rPx != null ? o.rPx : px(p, o.r)) + (o.offPx || 0); }
  function at(p, o, R, a){ return [p.X(o.cx || 0) + R * Math.cos(a), p.Y(o.cy || 0) - R * Math.sin(a)]; }
  function pen(c, o, col){ c.strokeStyle = o.color || col; c.lineWidth = o.width == null ? 2 : o.width; c.globalAlpha = o.alpha == null ? 1 : o.alpha; c.setLineDash(o.dash || []); c.lineCap = o.cap || "round"; c.lineJoin = "round"; }
  function path(c, p, o, R){ var a0 = o.a0 || 0, a1 = o.a1 == null ? TAU : o.a1; c.arc(p.X(o.cx || 0), p.Y(o.cy || 0), Math.max(0.5, R), -a0, -a1, a1 > a0); }
  return {
    px:px, dat:dat,
    at:function(p, o, a){ return at(p, o, Rof(p, o), a); },
    circle:function(p, o){ var c = p.ctx; c.save(); pen(c, o, css("--ink-2")); c.beginPath(); path(c, p, { cx:o.cx, cy:o.cy, a0:0, a1:TAU }, Rof(p, o)); if (o.fill) { c.fillStyle = o.fill; c.fill(); } if (o.width !== 0) c.stroke(); c.restore(); },
    arc:function(p, o){ if (Math.abs((o.a1 || 0) - (o.a0 || 0)) < 1e-6) return; var c = p.ctx; c.save(); pen(c, o, css("--pen")); c.beginPath(); path(c, p, o, Rof(p, o)); c.stroke(); c.restore(); },
    sector:function(p, o){
      if (Math.abs(o.a1 - o.a0) < 1e-6) return;
      var c = p.ctx; c.save(); c.globalAlpha = o.alpha == null ? 1 : o.alpha; c.beginPath();
      if (o.a1 - o.a0 >= TAU - 1e-9) path(c, p, { cx:o.cx, cy:o.cy, a0:0, a1:TAU }, Rof(p, o));
      else { c.moveTo(p.X(o.cx || 0), p.Y(o.cy || 0)); path(c, p, o, Rof(p, o)); c.closePath(); }
      c.fillStyle = o.fill || css("--hi-soft"); c.fill();
      if (o.color) { pen(c, o, o.color); c.stroke(); }
      c.restore();
    },
    arm:function(p, o){ var c = p.ctx, e = at(p, o, Rof(p, o), o.a); c.save(); pen(c, o, css("--pen")); c.beginPath(); c.moveTo(p.X(o.cx || 0), p.Y(o.cy || 0)); c.lineTo(e[0], e[1]); c.stroke(); c.restore(); },
    // small angle marker at a fixed pixel radius; past a full turn it continues on a slightly larger ring
    marker:function(p, o){
      var c = p.ctx, a0 = o.a0 || 0, a1 = o.a1, R = o.rPx;
      c.save(); pen(c, o, css("--p-t")); c.lineWidth = o.width || 2.5;
      if (a1 - a0 > 1e-6) {
        c.beginPath(); path(c, p, { cx:o.cx, cy:o.cy, a0:a0, a1:Math.min(a1, a0 + TAU) }, R); c.stroke();
        if (a1 - a0 > TAU) { c.beginPath(); path(c, p, { cx:o.cx, cy:o.cy, a0:a0 + TAU, a1:a1 }, R + 6); c.stroke(); }
      }
      if (o.label) {
        var mid = a1 - a0 > TAU ? a1 / 2 : (a0 + a1) / 2, q = at(p, o, R + (o.gap || 15), a1 - a0 < 0.35 ? Math.max(mid, 0.38) : mid);
        c.globalAlpha = 1; c.font = o.font || ("600 14px " + p.fontM); c.textAlign = "center"; c.textBaseline = "middle";
        if (o.bg) { var w = c.measureText(o.label).width; c.fillStyle = css("--sheet"); c.globalAlpha = 0.85; c.fillRect(q[0] - w / 2 - 3, q[1] - 9, w + 6, 18); c.globalAlpha = 1; }
        c.fillStyle = o.color || css("--p-t"); c.fillText(o.label, q[0], q[1]);
      }
      c.restore();
    },
    // marks:[{a, label, len, gap, la (label angle)}], side "in" | "out"
    ticks:function(p, o){
      var c = p.ctx, R = Rof(p, o), base = o.font || ("12px " + p.fontUI);
      c.save(); c.strokeStyle = o.color || css("--ink-2"); c.fillStyle = o.color || css("--ink-2"); c.lineWidth = o.width || 1.5; c.globalAlpha = o.alpha == null ? 1 : o.alpha;
      c.textAlign = "center"; c.textBaseline = "middle"; c.setLineDash([]);
      o.marks.forEach(function(mk){
        var s = o.side === "out" ? 1 : -1, len = mk.len || o.len || 6, a = at(p, o, R, mk.a), b = at(p, o, R + s * len, mk.a);
        c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
        if (mk.label) { var q = at(p, o, R + s * (mk.gap || o.gap || 16), mk.la != null ? mk.la : mk.a); c.font = mk.font || base; c.fillText(mk.label, q[0], q[1]); }
      });
      c.restore();
    },
    poly:function(p, pts, o){ if (pts.length < 2) return; var c = p.ctx; c.save(); pen(c, o, css("--pen")); c.beginPath(); pts.forEach(function(q, i){ var x = p.X(q[0]), y = p.Y(q[1]); if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.stroke(); c.restore(); },
    text:function(p, x, y, s, o){
      o = o || {}; var c = p.ctx; c.save(); c.font = o.font || ("600 14px " + p.fontM); c.textAlign = o.align || "center"; c.textBaseline = o.base || "middle";
      var X = p.X(x) + (o.dx || 0), Y = p.Y(y) + (o.dy || 0);
      if (o.bg) { var w = c.measureText(s).width, bx = c.textAlign === "center" ? X - w / 2 : c.textAlign === "right" ? X - w : X; c.fillStyle = css("--sheet"); c.globalAlpha = 0.88; c.fillRect(bx - 4, Y - 10, w + 8, 20); c.globalAlpha = 1; }
      c.fillStyle = o.color || css("--ink"); c.fillText(s, X, Y); c.restore();
    }
  };
})();

// Points of a radius-length ribbon on a circle of radius R centred at the origin, part-way through its animation.
// ph 0 = the radius itself (lifting off), 1 = sliding round to the end of the wrapped arc and standing tangent,
// 2 = bending onto the circle. Past a full turn the ribbon lands offData outside the circle.
function ribbonPts(R, a0, len, ph, t, offData){
  var out = [], N = 30;
  for (var i = 0; i <= N; i++) {
    var u = len * i / N, x, y;
    if (ph === 0) { x = 1 - u; y = 0; }
    else if (ph === 1) { var be = t * a0, ph1 = be + PI - t * PI / 2; x = Math.cos(be) + u * Math.cos(ph1); y = Math.sin(be) + u * Math.sin(ph1); }
    else {
      var sx = Math.cos(a0) + u * Math.cos(a0 + PI / 2), sy = Math.sin(a0) + u * Math.sin(a0 + PI / 2), a = a0 + u, rho = a > TAU ? 1 + (offData || 0) / R : 1;
      x = lerp(sx, rho * Math.cos(a), t); y = lerp(sy, rho * Math.sin(a), t);
    }
    out.push([x * R, y * R]);
  }
  return out;
}

// ---------- hero: six radius pieces wrap the circle, then the gap flashes ----------
function hero(f){
  var C = MV.C.hero, END = 6100, el = MV.reduceMotion ? END : 0;
  var p = new MV.Plot(f.canvas, { xmin:-1.6, xmax:1.6, ymin:-1.6, ymax:1.6 }, { equal:true });
  var P1 = [900, 1050, 1450, 2100];   // piece 1: lift, move, bend
  function pieceAt(k){ return k === 1 ? P1 : [2900 + (k - 2) * 400, 2940 + (k - 2) * 400, 3070 + (k - 2) * 400, 3300 + (k - 2) * 400]; }
  function scene(pl){
    var K = cols(), cp = clamp(el / 900, 0, 1), rp = clamp(el / 300, 0, 1);
    if (cp > 0) CD.arc(pl, { r:1, a0:0, a1:cp * TAU, color:K.ink2, width:2 });
    for (var k = 1; k <= 6; k++) {
      var T = pieceAt(k);
      if (el >= T[3]) {
        CD.arc(pl, { r:1, a0:k - 1, a1:k, color:K.pen, width:6, alpha:k % 2 ? 1 : 0.55, cap:"butt" });
        CD.ticks(pl, { r:1, side:"out", len:8, gap:20, marks:[{ a:k, label:String(k) }], color:K.ink, font:"600 14px " + pl.fontUI });
      } else if (el >= T[0]) {
        var ph = el < T[1] ? 0 : el < T[2] ? 1 : 2, t = ph === 0 ? (el - T[0]) / (T[1] - T[0]) : ph === 1 ? (el - T[1]) / (T[2] - T[1]) : MV.ease((el - T[2]) / (T[3] - T[2]));
        CD.poly(pl, ribbonPts(1, k - 1, 1, ph, t, 0), { color:K.pen, width:6, cap:"butt" });
      }
    }
    if (rp > 0) CD.arm(pl, { r:rp, a:0, color:K.ink, width:2 });
    if (el >= P1[3]) CD.marker(pl, { rPx:CD.px(pl, 0.3), a0:0, a1:1, label:"1", color:K.pt });
    if (el >= 4900) {
      var k2 = el >= END ? 1 : 0.55 + 0.45 * Math.cos((el - 4900) / 1000 * PI * 6);
      CD.arc(pl, { r:1, offPx:-9, a0:6, a1:TAU, color:K.hi, width:10, alpha:k2, cap:"butt" });
    }
  }
  p.render = function(){ p.draw({ equal:true, grid:false, axes:false, after:function(c, pl){ scene(pl); }, describe:el >= END ? "Six radius-length pieces wrapped around a circle, with a small gap left before the start: a full turn is 2π, about 6.28 radius lengths." : "A circle with radius-length pieces wrapping around it." }); };
  function cap(){ f.cap.textContent = el >= 4900 ? C.caps[1] : el >= P1[3] ? C.caps[0] : ""; }
  p.render(); cap();
  if (!MV.reduceMotion) MV.tween({ dur:END, ease:LIN, step:function(t){ el = t * END; p.render(); cap(); } });
}

// ---------- Explore: the radius wrapper ----------
var RPAD = 16, RH = 84;
function explore(host, api){
  var C = api.content, T = C.text, S = def(api.S, { mode:"wrap", L:0, r2:6, step:"pi", idx:8, hund:250, rad:true, deg:false, trig:false });
  var A = { busy:false, gen:0, piece:null, flash:null, unroll:0, ruler:null, landed:false, rO:null, thO:null, hl:null, ghost:false, tc3open:false };
  host.innerHTML = '<div class="rw-top" id="rw-modes"></div><div id="rw-pg"></div>';
  var L = MV.pgLayout($("#rw-pg"), { shape:"square", aria:"Radius wrapper circle" });
  var rw = document.createElement("div"); rw.className = "rw-ruler-wrap"; rw.hidden = true;
  rw.innerHTML = '<canvas class="plot rw-ruler rows1" role="img" aria-label="Ruler strip"></canvas><p class="tiny muted rw-rcap">' + T.rulerCap + "</p>";
  L.graph.appendChild(rw);
  var plot = new MV.Plot(L.canvas, { xmin:-1.5, xmax:1.5, ymin:-1.5, ymax:1.5 }, { equal:true });
  var rcan = $("canvas", rw), rplot = new MV.Plot(rcan, { xmin:0, xmax:1, ymin:0, ymax:1 });
  function slider(id, label, col){
    return '<div class="rw-sl"><div class="slider-top"><span id="rw-' + id + '-lab">' + label + '</span><output id="rw-' + id + '-out" style="color:var(' + col + ')"></output></div>' +
      '<div class="rw-slrow"><button type="button" class="btn ghost rw-pm" data-pm="' + id + '" data-d="-1" data-k="pm' + id + 'm" aria-label="Decrease ' + (id === "r" ? "r" : "θ") + ' by one step">' + MINUS + "</button>" +
      '<input type="range" id="rw-' + id + '" data-sl="' + id + '" aria-labelledby="rw-' + id + '-lab" style="accent-color:var(' + col + ')">' +
      '<button type="button" class="btn ghost rw-pm" data-pm="' + id + '" data-d="1" data-k="pm' + id + 'p" aria-label="Increase ' + (id === "r" ? "r" : "θ") + ' by one step">+</button></div></div>';
  }
  L.ctrl.innerHTML =
    '<div data-for="wrap"><div class="rw-wrapbtns" role="group" aria-label="Wrap pieces">' +
      '<button type="button" class="btn primary sm" data-w="10" data-k="w10">+1 radius</button>' +
      '<button type="button" class="btn ghost sm" data-w="1" data-k="w1">+0.1</button>' +
      '<button type="button" class="btn ghost sm" data-w="-1" data-k="wm1">' + MINUS + "0.1</button>" +
      '<button type="button" class="btn ghost sm" data-w="clr" data-k="wclr">Clear</button></div></div>' +
    '<div data-for="arc">' + slider("r", MV.m("r") + ", the radius", "--ink") + "</div>" +
    '<div data-for="arc cmp">' + slider("t", MV.m(TH) + ", the angle", "--p-t") + '<div id="rw-step"></div></div>' +
    '<div data-for="arc" class="q-actions"><button type="button" class="btn sm" id="rw-unroll" data-k="rwun">Unroll the arc</button></div>' +
    '<div data-for="cmp" class="q-actions"><button type="button" class="btn sm" id="rw-line" data-k="rwline">Line them up</button></div>' +
    '<div class="rw-tog" role="group" aria-label="Show on the circle">' +
      '<button type="button" class="chip" data-tog="rad" data-k="tgrad">Radian ring</button>' +
      '<button type="button" class="chip" data-tog="deg" data-k="tgdeg">Degree ring</button>' +
      '<button type="button" class="chip" data-tog="trig" data-k="tgtrig" data-for="arc">Trig ratios</button></div>';
  var modesR = radios($("#rw-modes"), { aria:"Mode", options:[{ id:"wrap", t:"Wrap" }, { id:"arc", t:"Arc" }, { id:"cmp", t:"Compare" }], value:S.mode,
    onChange:function(m){ if (A.busy) { modesR.set(S.mode); return; } S.mode = m; resetRuler(); touch(); commit(); } });
  var stepR = radios($("#rw-step"), { label:"Step set", options:[{ id:"pi", t:"π-steps" }, { id:"dec", t:"Decimal steps" }], value:S.step,
    onChange:function(s){ if (A.busy) { stepR.set(S.step); return; } var th = curTh(); S.step = s; if (s === "pi") S.idx = clamp(Math.round(th / (PI / 12)), 0, 24); else S.hund = clamp(Math.round(th * 100), 0, 628); touch(); commit(); } });

  // ----- state readers -----
  function curR(){ return A.rO != null ? A.rO : S.r2 / 2; }
  function curTh(){ return A.thO != null ? A.thO : S.step === "pi" ? S.idx * PI / 12 : S.hund / 100; }
  function exact(){ return S.step === "pi" && A.thO == null; }
  function thShort(){ return exact() ? (S.idx ? piSrc(S.idx, 12) : "0") : fx(curTh(), 2); }
  function tw(o){ var g = A.gen; return MV.tween({ dur:o.dur, ease:o.ease || LIN, step:function(t){ if (g === A.gen) o.step(t); }, done:function(){ if (g === A.gen && o.done) o.done(); } }); }
  function later(ms, fn){ var g = A.gen; MV.wait(ms, function(){ if (g === A.gen) fn(); }); }
  function touch(){ A.flash = null; A.hl = null; A.ghost = false; MV.banner("", ""); }
  function commit(){ api.save(); paint(); MV.changed(); }
  function resetRuler(){ A.ruler = null; A.landed = false; A.unroll = 0; A.ghost = false; rw.hidden = true; }

  // ----- readout -----
  function whereHTML(th, idx){
    if (idx != null) return idx % 6 === 0 ? "On the " + axisName(idx / 6) : "Quadrant " + (Math.floor(idx / 6) % 4 + 1);
    if (th < 1e-9) return "On the " + axisName(0);
    return "Quadrant " + (Math.floor(th / (PI / 2)) % 4 + 1);
  }
  function nearHTML(th, idx){
    if (idx != null) {
      var m = idx % 6, k = Math.floor(idx / 6); if (!m) return null;
      if (m === 3) return MV.m("π/4") + " from both axes: halfway between them";
      return m < 3 ? MV.m(piSrc(m, 12)) + " past the " + axisName(k) : MV.m(piSrc(6 - m, 12)) + " before the " + axisName(k + 1);
    }
    if (th < 1e-9) return null;
    var k2 = Math.floor(th / (PI / 2)), past = th - k2 * PI / 2, before = (k2 + 1) * PI / 2 - th;
    return past < before ? fx(past, 2) + " past the " + axisName(k2) : fx(before, 2) + " before the " + axisName(k2 + 1);
  }
  function tv(v, undef){ if (undef) return "is undefined"; var r = Math.round(v * 1000); return (Math.abs(v * 1000 - r) < 1e-6 ? "= " : "≈ ") + fx(r / 1000, 3); }
  function angleHTML(){
    var th = curTh(), idx = S.idx, mu = function(s){ return ' <span class="muted">(' + s + ")</span>"; };
    if (exact()) {
      if (!idx) return MV.m(TH + " = 0") + mu("0°");
      if (idx === 24) return MV.m(TH + " = 2π ≈ 6.28") + mu("360°") + ": one full turn";
      return MV.m(TH + " = " + piSrc(idx, 12, true) + " ≈ " + fx(th, 2)) + mu(idx * 15 + "°");
    }
    if (th < 1e-9) return MV.m(TH + " = 0") + mu("0°");
    return MV.m(TH + " = " + fx(th, 2) + " ≈ " + fx(th / PI, 2) + "π") + mu("≈ " + fx(th * 180 / PI, 1) + "°");
  }
  function arcRows(){
    var r = curR(), th = curTh(), ex = exact(), idx = S.idx, rs = num(r, 1), rows = [];
    rows.push(["Angle", angleHTML()]);
    rows.push(["Radius", MV.m("r = " + rs) + " cm"]);
    var al = ex ? MV.m("a = r" + TH + " = " + rs + " × " + (idx ? piSrc(idx, 12, true) + " = " + piSrc(S.r2 * idx, 24, true) + " ≈ " + fx(r * th, 2) : "0 = 0"))
      : MV.m("a = r" + TH + " = " + rs + " × " + fx(th, 2) + " = " + fx(r * th, 2));
    rows.push(["Arc length", al + " cm"]);
    rows.push(["Arc ÷ radius", fx(th, 2) + " radius lengths: that’s " + MV.m(TH), A.hl === "ratio"]);
    rows.push(["Part of a full turn", ex ? (idx === 24 ? "1 full turn" : !idx ? "0 of a turn" : MV.m(fracSrc(idx, 24, true)) + " of a turn") : (th < 1e-9 ? "0 of a turn" : "≈ " + fx(th / TAU, 2) + " of a turn")]);
    rows.push(["Where", whereHTML(th, ex ? idx : null)]);
    var nr = nearHTML(th, ex ? idx : null); if (nr) rows.push(["Nearest axis", nr, A.hl === "near"]);
    if (S.trig) {
      var s = Math.sin(th), c = Math.cos(th), s0, c0;
      if (ex) { s0 = idx % 12 === 0; c0 = idx % 12 === 6; if (s0) s = 0; if (c0) c = 0; } else { s0 = th < 1e-9; c0 = false; }
      var f = function(nm, v, u){ return '<span class="nw">' + MV.m(nm + " " + TH) + " " + tv(v, u) + "</span>"; };
      rows.push(["Trig ratios", f("sin", s) + ", " + f("cos", c) + ", " + f("tan", s / c, c0)]);
      rows.push(["Reciprocals", f("csc", 1 / s, s0) + ", " + f("sec", 1 / c, c0) + ", " + f("cot", c / s, s0)]);
      if (th > 1e-9) { var tr = Math.round(th * 100) / 100; rows.push(["Degree-mode check", "A tool in degree mode would find " + MV.m("sin(" + fx(tr, 2) + "°)") + " " + tv(Math.sin(tr * PI / 180)) + " instead: a different angle."]); }
    }
    return rows;
  }
  function wrapRows(){
    var Lt = S.L, Lv = Lt / 10, w = Math.floor(Lt / 10), f = Lt % 10, rows = [];
    rows.push(["Pieces wrapped", w + " whole radius length" + (w === 1 ? "" : "s") + (f ? " + 0." + f : "") + " = " + fx(Lv, 1)]);
    rows.push(["Angle", Lt ? MV.m(TH + " = " + fx(Lv, 1)) + ' radians <span class="muted">(≈ ' + fx(Lv * 180 / PI, 1) + "°)</span>" : MV.m(TH + " = 0") + ' radians <span class="muted">(0°)</span>']);
    if (Lv < TAU) rows.push(["Left to a full turn", MV.m("2π - " + fx(Lv, 1) + " ≈ " + fx(TAU - Lv, 2)) + " radius lengths"]);
    rows.push(["Where", whereHTML(Lv % TAU)]);
    if (Lv > TAU) rows.push(["Past a full turn", T.past.replace("{x}", fx(Lv - TAU, 2))]);
    return rows;
  }
  function cmpRows(){
    var th = curTh(), ex = exact(), idx = S.idx, thS = ex ? (idx ? piSrc(idx, 12, true) : "0") : fx(th, 2);
    var body = [2, 4, 6].map(function(r){
      var a = ex ? (idx ? piSrc(r * idx, 12, true) + " ≈ " + fx(r * th, 2) : "0") : fx(r * th, 2);
      return [MV.m("r = " + r) + " cm", MV.m(r + " × " + thS + " = " + a) + " cm", ex && idx ? MV.m(thS + " ≈ " + fx(th, 2)) : fx(th, 2)];
    });
    return [["Angle", angleHTML()], ["Three circles", MV.tableHTML({ head:["Circle", "Arc length", "Arc ÷ radius"], rows:body, caption:"Arc length and arc divided by radius for the three circles" })], ["Arc ÷ radius", T.cmpLast]];
  }
  function readout(){
    var rows = S.mode === "wrap" ? wrapRows() : S.mode === "arc" ? arcRows() : cmpRows();
    return rows.map(function(r){ return "<div" + (r[2] ? ' class="rw-hl"' : "") + "><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
  }
  function caption(){
    if (S.mode === "wrap") return MV.m(TH + " = " + fx(S.L / 10, 1));
    var s = exact() ? (S.idx ? piSrc(S.idx, 12, true) : "0") : fx(curTh(), 2);
    return MV.m(TH + " = " + s) + (S.mode === "arc" ? '<span class="rw-capr">, ' + MV.m("r = " + num(curR(), 1)) + " cm</span>" : "");
  }
  function wherePlain(th, idx){ var w = MV.plain(whereHTML(th, idx)); return w.indexOf("Quadrant") === 0 ? "in q" + w.slice(1) : "o" + w.slice(1); }
  function describe(){
    if (S.mode === "wrap") { var Lv = S.L / 10; return "Circle with " + fx(Lv, 1) + " radius lengths wrapped around its edge. The angle is " + fx(Lv, 1) + " radians, about " + fx(Lv * 180 / PI, 1) + " degrees, " + wherePlain(Lv % TAU) + "." + (Lv > TAU ? " The last piece runs past the start of the circle." : ""); }
    var th = curTh(), ex = exact(), ang = ex ? piSrc(S.idx, 12) + " (" + piSpoken(S.idx, 12) + ")" : fx(th, 2);
    if (S.mode === "cmp") return "Three circles of radius 2, 4 and 6 cm share the angle θ = " + ang + ", " + wherePlain(th, ex ? S.idx : null) + ". Their arcs are " + fx(2 * th, 2) + ", " + fx(4 * th, 2) + " and " + fx(6 * th, 2) + " cm long.";
    var r = curR(); return "Circle of radius " + num(r, 1) + " cm. Angle θ = " + ang + ", " + wherePlain(th, ex ? S.idx : null) + ". Arc length " + (ex && S.idx ? piSrc(S.r2 * S.idx, 24) + ", about " : "") + fx(r * th, 2) + " cm, highlighted.";
  }

  // ----- controls -----
  function syncCtl(){
    $$("[data-for]", L.ctrl).forEach(function(el){ el.hidden = el.dataset.for.split(" ").indexOf(S.mode) < 0; });
    modesR.set(S.mode); stepR.set(S.step); modesR.lock(A.busy); stepR.lock(A.busy);
    var wb = function(k){ return $('[data-w="' + k + '"]', L.ctrl); };
    wb("10").disabled = A.busy || S.L > 60; wb("1").disabled = A.busy || S.L >= 70; wb("-1").disabled = A.busy || S.L <= 0; wb("clr").disabled = A.busy || S.L === 0;
    var r = $("#rw-r"), t = $("#rw-t"), th = curTh();
    r.min = 2; r.max = 12; r.step = 1; r.value = S.r2; r.disabled = A.busy; r.setAttribute("aria-valuetext", num(S.r2 / 2) + " centimetres");
    $("#rw-r-out").textContent = num(curR(), 1) + " cm";
    t.min = 0; t.step = 1; t.max = S.step === "pi" ? 24 : 628; t.value = S.step === "pi" ? S.idx : S.hund; t.disabled = A.busy;
    t.setAttribute("aria-valuetext", exact() ? piSpoken(S.idx, 12) + ", about " + fx(th, 2) + " radians" : fx(th, 2) + " radians");
    $("#rw-t-out").innerHTML = MV.m(thShort());
    var tmax = S.step === "pi" ? 24 : 628, tv0 = S.step === "pi" ? S.idx : S.hund;
    $$("[data-pm]", L.ctrl).forEach(function(b){ var d = +b.dataset.d; b.disabled = A.busy || (b.dataset.pm === "r" ? (d < 0 ? S.r2 <= 2 : S.r2 >= 12) : (d < 0 ? tv0 <= 0 : tv0 >= tmax)); });
    ["rad", "deg", "trig"].forEach(function(k){ var b = $('[data-tog="' + k + '"]', L.ctrl); b.setAttribute("aria-pressed", String(!!S[k])); b.classList.toggle("on", !!S[k]); b.disabled = A.busy; });
    var un = $("#rw-unroll"), ln = $("#rw-line");
    un.textContent = A.ruler === "arc" ? "Roll it back" : "Unroll the arc"; un.disabled = A.busy;
    ln.textContent = A.ruler === "cmp" ? "Roll them back" : "Line them up"; ln.disabled = A.busy;
  }
  function paint(){
    MV.keepFocus(L.ctrl, syncCtl);
    L.cap.innerHTML = caption();
    L.read.innerHTML = readout();
    draw(); drawRuler();
  }
  L.ctrl.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id || A.busy) return;
    var v = +e.target.value; if (id === "r") S.r2 = v; else if (S.step === "pi") S.idx = v; else S.hund = v;
    touch(); commit();
  });
  L.ctrl.addEventListener("keydown", function(e){
    if (!e.target.dataset || e.target.dataset.sl !== "t" || A.busy || (e.key !== "PageUp" && e.key !== "PageDown")) return;
    e.preventDefault(); var up = e.key === "PageUp";
    if (S.step === "pi") S.idx = up ? Math.min(24, (Math.floor(S.idx / 6) + 1) * 6) : Math.max(0, (Math.ceil(S.idx / 6) - 1) * 6);
    else S.hund = clamp(S.hund + (up ? 10 : -10), 0, 628);
    touch(); commit();
  });
  L.ctrl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || A.busy || b.dataset.rg) return;
    if (b.dataset.w) {
      touch();
      if (b.dataset.w === "clr") { S.L = 0; commit(); }
      else if (b.dataset.w === "10") addPiece(900);
      else { var old = S.L; S.L = clamp(S.L + (+b.dataset.w), 0, 70); crossCheck(old); commit(); }
    } else if (b.dataset.pm) {
      var d = +b.dataset.d;
      if (b.dataset.pm === "r") S.r2 = clamp(S.r2 + d, 2, 12); else if (S.step === "pi") S.idx = clamp(S.idx + d, 0, 24); else S.hund = clamp(S.hund + d, 0, 628);
      touch(); commit();
    } else if (b.dataset.tog) { S[b.dataset.tog] = !S[b.dataset.tog]; commit(); }
    else if (b.id === "rw-unroll") { touch(); unrollGo("arc", A.ruler === "arc" ? -1 : 1); }
    else if (b.id === "rw-line") { touch(); unrollGo("cmp", A.ruler === "cmp" ? -1 : 1); }
  });

  // ----- animations -----
  function flash(a0, a1, label){
    A.flash = { a0:a0, a1:a1, label:label, k:1 };
    tw({ dur:1500, step:function(t){ if (!A.flash) return; A.flash.k = 0.55 + 0.45 * Math.cos(t * PI * 6); draw(); }, done:function(){ if (A.flash) { A.flash.k = 1; draw(); } } });
  }
  function crossCheck(old){ if (old / 10 <= TAU && S.L / 10 > TAU) { MV.banner("", T.gap7); flash(6, TAU, A.flash && A.flash.a0 === 6 ? A.flash.label : null); } }
  function addPiece(dur, done){
    if (S.L > 60) { if (done) done(); return; }
    var a0 = S.L / 10, d = [dur * 0.11, dur * 0.33, dur * 0.56], k = 0;
    A.busy = true; paint();
    (function next(){
      if (k === 3) { var old = S.L; S.L += 10; A.piece = null; A.busy = false; crossCheck(old); api.save(); paint(); MV.changed(); if (done) done(); return; }
      var ph = k++;
      tw({ dur:d[ph], ease:ph === 2 ? MV.ease : LIN, step:function(t){ A.piece = { a0:a0, ph:ph, t:t }; draw(); }, done:next });
    })();
  }
  function rowsFor(kind){ return kind === "cmp" ? [2, 4, 6] : kind === "tc3" ? [curR(), curR()] : [curR()]; }
  function unrollGo(kind, dir, done){
    A.busy = true;
    if (dir > 0) { A.ruler = kind; A.landed = false; rw.hidden = false; rcan.className = "plot rw-ruler rows" + rowsFor(kind).length; }
    else A.landed = false;
    paint();
    tw({ dur:1200, step:function(t){ A.unroll = dir > 0 ? t : 1 - t; draw(); drawRuler(); }, done:function(){
      A.busy = false; A.unroll = 0;
      if (dir > 0) {
        A.landed = true; var th = curTh();
        if (kind === "arc") MV.banner("", "Unrolled: the arc is " + fx(curR() * th, 2) + " cm, which is " + fx(th, 2) + " radius lengths.");
        if (kind === "cmp") MV.banner("", "The arcs are in the ratio 1 : 2 : 3, but each one is " + fx(th, 2) + " radius lengths long.");
      } else resetRuler();
      paint(); MV.changed(); if (done) done();
    } });
  }

  // ----- drawing -----
  function faint(p, K){ var c = p.ctx; c.save(); c.strokeStyle = K.rule; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, p.Y(0)); c.lineTo(p.W, p.Y(0)); c.moveTo(p.X(0), 0); c.lineTo(p.X(0), p.H); c.stroke(); c.restore(); }
  function rings(p, K, R){
    var Rp = CD.px(p, R), phone = p.W < 480;
    if (S.rad) {
      var whole = []; for (var k = 1; k <= 6; k++) whole.push({ a:k, label:Rp >= 70 ? String(k) : "" });
      CD.ticks(p, { r:R, side:"in", len:7, gap:15, marks:whole, color:K.ink2, font:"700 12px " + p.fontUI });
      var q = [{ a:PI / 2, label:"π/2" }, { a:PI, label:"π" }, { a:3 * PI / 2, label:"3π/2" }, { a:TAU, label:"2π", la:S.mode === "wrap" ? -0.16 : 0.16 }];
      if (Rp < 45) q.forEach(function(m){ m.label = ""; });
      CD.ticks(p, { r:R, side:"in", len:13, gap:31, marks:q, color:K.ink2, font:"italic 600 13px " + p.fontM });
    }
    if (S.deg) {
      var ms = []; for (var d = 0; d < 360; d += 15) ms.push({ a:d * PI / 180, len:d % 30 ? 4 : 8, label:(d % (phone ? 90 : 30)) ? "" : d + "°" });
      CD.ticks(p, { r:R, side:"out", gap:17, marks:ms, color:K.ink2, alpha:0.8, font:"11px " + p.fontUI });
    }
  }
  function flashDraw(p, K, R){
    if (!A.flash) return;
    var F = A.flash, Rp = CD.px(p, R);
    CD.arc(p, { r:R, offPx:-10, a0:F.a0, a1:F.a1, color:K.hi, width:10, alpha:F.k, cap:"butt" });
    if (F.label) { var q = CD.at(p, { r:R, offPx:-Math.min(58, Rp * 0.42) }, (F.a0 + F.a1) / 2); var c = p.ctx; c.save(); c.font = "700 13px " + p.fontUI; c.textAlign = "left"; c.textBaseline = "middle"; var w = c.measureText(F.label).width, x = F.a0 > 4 ? q[0] - w : q[0] - 4; c.fillStyle = K.sheet; c.globalAlpha = 0.9; c.fillRect(x - 4, q[1] - 11, w + 8, 22); c.globalAlpha = 1; c.fillStyle = K.ink; c.fillText(F.label, x, q[1]); c.restore(); }
  }
  function drawWrap(p, K){
    var Lw = S.L / 10, full = Math.min(Lw, TAU), Rp = CD.px(p, 1), off8 = CD.dat(p, 8), k;
    for (k = 0; k < full - 1e-9; k++) CD.sector(p, { r:1, a0:k, a1:Math.min(k + 1, full), fill:K.hiSoft, alpha:k % 2 ? 0.5 : 1 });
    CD.circle(p, { r:1, color:K.ink2, width:2 });
    rings(p, K, 1);
    for (k = 0; k < Lw - 1e-9; k++) {
      var e = Math.min(k + 1, Lw);
      if (k < TAU) CD.arc(p, { r:1, a0:k, a1:Math.min(e, TAU), color:K.pen, width:6, alpha:k % 2 ? 0.55 : 1, cap:"butt" });
      if (e > TAU) CD.arc(p, { r:1, offPx:8, a0:Math.max(k, TAU), a1:e, color:K.ink2, width:5, dash:[7, 5], cap:"butt" });
    }
    var jg = S.deg ? 36 : 19;
    for (k = 1; k <= Math.floor(Lw + 1e-9); k++) { var o = k > TAU ? 8 : 0; CD.ticks(p, { r:1, offPx:o - 7, side:"out", len:14, gap:7 + jg, marks:[{ a:k, label:String(k) }], color:K.ink, width:2, font:"700 14px " + p.fontUI }); }
    flashDraw(p, K, 1);
    CD.arm(p, { r:1, a:0, color:K.ink, width:2 });
    CD.text(p, 0.55, 0, "1 radius length", { dy:-11, font:"12px " + p.fontUI, color:K.ink2, bg:true });
    if (!A.piece) CD.arm(p, { r:1, a:Lw, color:K.pen, width:3 });
    if (Lw > 0) CD.marker(p, { rPx:Math.min(30, Rp * 0.2), a0:0, a1:Lw, label:fx(Lw, 1), color:K.pt, bg:true });
    if (A.piece) {
      var pc = A.piece, pts = ribbonPts(1, pc.a0, 1, pc.ph, pc.t, off8);
      if (pc.ph === 0) CD.poly(p, pts, { color:K.hi, width:12, alpha:pc.t, cap:"butt" });
      CD.poly(p, pts, { color:K.pen, width:6, cap:"butt" });
    }
  }
  // arc sampled as [x, y, s] (s = arc length so far)
  function arcPath(r, th){ var N = Math.max(12, Math.ceil(th * 24)), out = []; for (var i = 0; i <= N; i++) { var u = th * i / N; out.push([r * Math.cos(u), r * Math.sin(u), r * u]); } return out; }
  function outlinePath(r, th){
    var out = [], P = [r * Math.cos(th), r * Math.sin(th)], i;
    for (i = 0; i <= 10; i++) out.push([P[0] * (1 - i / 10), P[1] * (1 - i / 10), r * i / 10]);
    for (i = 1; i <= 10; i++) out.push([r * i / 10, 0, r + r * i / 10]);
    arcPath(r, th).slice(1).forEach(function(q){ out.push([q[0], q[1], 2 * r + q[2]]); });
    return out;
  }
  // morph a path into a straight bar at the strip's scale along the bottom edge (row = 0 at the top of the rows)
  function morph(p, path, t, row, nrows, col){
    var c = p.ctx, cm = (p.W - 2 * RPAD) / 40, ty = p.H - 12 - (nrows - 1 - row) * 14;
    c.save(); c.strokeStyle = col; c.lineWidth = 5; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath();
    path.forEach(function(q, i){ var x = lerp(p.X(q[0]), RPAD + q[2] * cm, t), y = lerp(p.Y(q[1]), ty, t); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
    c.stroke(); c.restore();
  }
  function tc3Open(){ var ch = MV.S.chal || {}, s3 = ch.tc3; if (s3 && s3.solved) return false; return A.tc3open || !!(ch.tc1 && ch.tc1.solved && ch.tc2 && ch.tc2.solved); }
  function drawArc(p, K){
    var r = curR(), th = curTh(), Rp = CD.px(p, r), moving = A.ruler && !A.landed && A.unroll > 0;
    CD.sector(p, { r:r, a0:0, a1:th, fill:K.hiSoft });
    CD.circle(p, { r:r, color:K.ink2, width:2 });
    rings(p, K, r);
    if (A.ruler === "arc" && (A.landed || moving)) CD.arc(p, { r:r, a0:0, a1:th, color:K.pen, width:5, alpha:0.25 });
    else CD.arc(p, { r:r, a0:0, a1:th, color:K.pen, width:5 });
    if (A.ruler === "arc" && moving) morph(p, arcPath(r, th), A.unroll, 0, 1, K.pen);
    CD.arm(p, { r:r, a:0, color:K.ink, width:2 });
    CD.arm(p, { r:r, a:th, color:K.pen, width:3 });
    var P = CD.at(p, { r:r, offPx:S.deg ? 36 : 14 }, th), c = p.ctx; c.save(); c.font = "italic 600 15px " + p.fontM; c.fillStyle = K.ink; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("P", P[0], P[1]); c.restore();
    CD.marker(p, { rPx:Math.min(28, Rp * 0.3), a0:0, a1:th, label:th > 1e-9 ? thShort() : "", color:K.pt, bg:true });
    flashDraw(p, K, r);
    if (A.ruler === "tc3" && moving) morph(p, outlinePath(r, th), A.unroll, 0, 2, K.ink);
    else if (tc3Open() && !A.busy) { var op = outlinePath(r, th).map(function(q){ return [q[0], q[1]]; }); CD.poly(p, op, { color:K.ink, width:2.5 }); }
  }
  function drawCmp(p, K){
    var th = curTh(), moving = A.ruler === "cmp" && !A.landed && A.unroll > 0;
    CD.sector(p, { r:6, a0:0, a1:th, fill:K.hiSoft });
    [2, 4, 6].forEach(function(r, i){
      CD.circle(p, { r:r, color:K.ink2, width:i === 2 ? 2 : 1.5 });
      CD.arc(p, { r:r, a0:0, a1:th, color:K.pen, width:5, alpha:A.ruler === "cmp" && (A.landed || moving) ? 0.25 : 1 });
      CD.text(p, r, 0, "r = " + r, { dy:13, dx:-6, align:"right", font:"italic 13px " + p.fontM, color:K.ink2 });
    });
    rings(p, K, 6);
    if (moving) [2, 4, 6].forEach(function(r, i){ morph(p, arcPath(r, th), A.unroll, i, 3, K.pen); });
    CD.arm(p, { r:6, a:0, color:K.ink, width:2 });
    CD.arm(p, { r:6, a:th, color:K.pen, width:3 });
    CD.marker(p, { rPx:24, a0:0, a1:th, label:th > 1e-9 ? thShort() : "", color:K.pt, bg:true });
  }
  function draw(){
    var v = S.mode === "wrap" ? { xmin:-1.5, xmax:1.5, ymin:-1.5, ymax:1.5 } : { xmin:-6.8, xmax:6.8, ymin:-6.8, ymax:6.8 };
    plot.draw({ view:v, equal:true, grid:false, axes:false, describe:describe(), after:function(ctx, p){
      var K = cols(); faint(p, K);
      if (S.mode === "wrap") drawWrap(p, K); else if (S.mode === "arc") drawArc(p, K); else drawCmp(p, K);
    } });
  }
  plot.render = draw;

  // ----- ruler strip (its own scale: 0–40 cm on top, radius lengths below) -----
  function rulerRow(p, K, y0, r, len, o){
    var c = p.ctx, x = function(cm){ return RPAD + cm / 40 * (p.W - 2 * RPAD); }, yl = y0 + 44, k;
    c.save(); c.strokeStyle = K.ink; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x(0), yl); c.lineTo(x(40), yl); c.stroke();
    c.lineWidth = 1; c.fillStyle = K.ink2; c.font = "11px " + p.fontUI; c.textAlign = "center"; c.textBaseline = "middle";
    for (k = 0; k <= 40; k++) { var mj = k % 5 === 0; c.beginPath(); c.moveTo(x(k), yl); c.lineTo(x(k), yl - (mj ? 8 : 4)); c.stroke(); if (mj && !(k === 35 && x(40) - x(35) < 50)) c.fillText(k === 40 ? "40 cm" : String(k), k === 40 ? x(40) - 12 : x(k), y0 + 30); }
    var last = -99;
    for (k = 0; k * r <= 40.0001; k++) {
      c.beginPath(); c.moveTo(x(k * r), yl); c.lineTo(x(k * r), yl + 7); c.stroke();
      if (k && x(k * r) - last >= 30 && x(k * r) < p.W - 10) { c.font = "11px " + p.fontUI; var nw = c.measureText(k + " ").width; c.font = "italic 12px " + p.fontM; var rw2 = c.measureText("r").width, sx = x(k * r) - (nw + rw2) / 2; c.textAlign = "left"; c.font = "11px " + p.fontUI; c.fillText(k + " ", sx, y0 + 60); c.font = "italic 12px " + p.fontM; c.fillText("r", sx + nw, y0 + 60); c.textAlign = "center"; last = x(k * r); }
    }
    if (o.label) { c.font = "italic 12px " + p.fontM; c.textAlign = "right"; c.fillStyle = K.ink2; c.fillText(o.label, x(40), y0 + 9); }
    if (o.bar) {
      var xe = x(len);
      c.strokeStyle = o.color; c.lineWidth = 6; c.lineCap = "butt"; c.beginPath(); c.moveTo(x(0), yl); c.lineTo(xe, yl); c.stroke();
      c.strokeStyle = K.ink; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x(0), y0 + 22); c.lineTo(x(0), y0 + 18); c.lineTo(xe, y0 + 18); c.lineTo(xe, y0 + 22); c.stroke();
      c.font = "700 12px " + p.fontUI; c.textAlign = "center"; c.fillStyle = K.ink;
      var w = c.measureText(o.bar).width, bx = clamp((x(0) + xe) / 2, x(0) + w / 2, p.W - w / 2 - 70);
      c.fillStyle = K.sheet; c.fillRect(bx - w / 2 - 3, y0 + 2, w + 6, 14); c.fillStyle = K.ink; c.fillText(o.bar, bx, y0 + 9);
      if (o.reading) { c.fillStyle = K.pt; c.beginPath(); c.moveTo(xe, yl + 3); c.lineTo(xe - 5, yl + 11); c.lineTo(xe + 5, yl + 11); c.closePath(); c.fill(); c.font = "italic 600 13px " + p.fontM; var rw3 = c.measureText(o.reading).width; c.textAlign = "center"; var rx = clamp(xe, rw3 / 2 + 2, p.W - rw3 / 2 - 2); c.fillStyle = K.sheet; c.fillRect(rx - rw3 / 2 - 3, y0 + 68, rw3 + 6, 16); c.fillStyle = K.pt; c.fillText(o.reading, rx, y0 + 76); }
    }
    c.restore();
    return { x:x, yl:yl };
  }
  function drawRuler(){
    if (!A.ruler || rw.hidden) return;
    rplot.draw({ grid:false, axes:false, describe:rulerDesc(), after:function(ctx, p){
      var K = cols(), th = curTh(), r = curR(), show = A.landed, rd = exact() ? "θ = " + (S.idx ? piSrc(S.idx, 12) + " ≈ " + fx(th, 2) : "0") : "θ = " + fx(th, 2);
      if (A.ruler === "arc") {
        rulerRow(p, K, 4, r, r * th, { bar:show ? fx(r * th, 2) + " cm" : "", color:K.pen, reading:show ? rd : "" });
        if (A.ghost && show) { var c = p.ctx; c.save(); c.font = "600 12px " + p.fontUI; c.textAlign = "left"; c.textBaseline = "middle"; c.fillStyle = K.ink2; c.fillText(C.text.ghost180, RPAD, 4 + RH + 8); c.restore(); }
      } else if (A.ruler === "cmp") {
        var ends = [];
        [2, 4, 6].forEach(function(rr, i){ var g = rulerRow(p, K, 4 + i * RH, rr, rr * th, { bar:show ? fx(rr * th, 2) + " cm" : "", color:K.pen, reading:show ? rd : "", label:"r = " + rr + " cm" }); ends.push([g.x(rr * th), g.yl]); });
        if (show && th > 1e-9) { var c2 = p.ctx, x0 = ends[0][0] - (ends[2][0] - ends[0][0]) / (ends[2][1] - ends[0][1]) * (ends[0][1] - 2), y0 = 2, x1 = ends[2][0] + (ends[2][0] - ends[0][0]) / (ends[2][1] - ends[0][1]) * (p.H - 2 - ends[2][1]); c2.save(); c2.strokeStyle = K.hi; c2.lineWidth = 2.5; c2.setLineDash([6, 4]); c2.beginPath(); c2.moveTo(x0, y0); c2.lineTo(x1, p.H - 2); c2.stroke(); c2.restore(); }
      } else if (A.ruler === "tc3") {
        var LB = C.challenges.filter(function(x){ return x.id === "tc3"; })[0].rulerLabels;
        rulerRow(p, K, 4, r, 2 * r + r * th, { bar:show ? LB[0] + " ≈ " + fx(2 * r + r * th, 2) + " cm" : "", color:K.ink });
        rulerRow(p, K, 4 + RH, r, PI * r, { bar:show ? LB[1] + " ≈ " + fx(PI * r, 2) + " cm" : "", color:K.pen });
      }
    } });
  }
  function rulerDesc(){
    var th = curTh(), r = curR();
    if (A.ruler === "cmp") return "Three ruler strips: the unrolled arcs are " + fx(2 * th, 2) + ", " + fx(4 * th, 2) + " and " + fx(6 * th, 2) + " cm long, and each reads " + fx(th, 2) + " on its radius-length scale.";
    if (A.ruler === "tc3") return "Two ruler strips: the sector's perimeter is " + fx(2 * r + r * th, 2) + " cm and half the circumference is " + fx(PI * r, 2) + " cm.";
    return "Ruler strip: the unrolled arc is " + fx(r * th, 2) + " cm long, which is " + fx(th, 2) + " radius lengths." + (A.ghost ? " " + C.text.ghost180 : "");
  }
  rplot.render = drawRuler;

  // ----- "What you found" panel: opens after P4 and stays available -----
  var found = document.createElement("details"); found.className = "alg rw-found";
  found.innerHTML = "<summary>" + C.found.title + "</summary>" + C.found.html;
  found.hidden = !(MV.S.preds && MV.S.preds.p4);
  var predHost = $("#pred"); if (predHost) predHost.parentNode.appendChild(found);
  // TC3's sector outline shows while that challenge is open (after any tap on it, or once TC1 and TC2 are met)
  var chalHost = $("#chal"); if (chalHost) chalHost.addEventListener("click", function(e){ if (e.target.closest('[data-c="tc3"]') && !A.tc3open) { A.tc3open = true; draw(); } }, true);
  // Practice 1: the "Use these values" box above the boxes (N20)
  var srt = $("#act-where"), wa = (MV.C.practice.activities || []).filter(function(a){ return a.id === "where"; })[0];
  if (srt && wa && wa.use) srt.insertAdjacentHTML("beforebegin", MV.usesHTML(wa.use));

  // ----- challenges -----
  var CHM = {}; (C.challenges || []).forEach(function(c){ CHM[c.id] = c.msgs; });
  function challenge(id, opt){
    var m = CHM[id], th = curTh(), r = S.r2 / 2, pi = S.step === "pi";
    if (S.mode !== "arc") return { ok:false, msg:m.mode };
    if (id === "tc1") {
      if (!pi && S.r2 === 8 && Math.abs(r * th - 10) < 0.005) return { ok:true };
      if (!pi && S.r2 === 8 && S.hund === 40) return { ok:false, msg:m.flip };
      if (!pi && S.r2 === 8 && (S.hund === 249 || S.hund === 251)) return { ok:false, msg:m.close.replace("{a}", fx(r * th, 2)) };
      if (pi) return { ok:false, msg:m.steps };
      if (S.r2 !== 8) return { ok:false, msg:m.radius };
      return { ok:false, msg:m.other.replace("{a}", fx(r * th, 2)) };
    }
    if (id === "tc2") {
      if (pi && S.r2 === 12 && S.idx === 4) return { ok:true };
      if (pi) {
        if (S.r2 * S.idx === 48) return { ok:false, msg:m.frac.replace("{f}", m.fracs[String(r)] || "") };
        if (S.idx === 4) return { ok:false, msg:m.sixth.replace("{a}", MV.m(piSrc(S.r2, 6))) };
        if (S.idx === 2) return { ok:false, msg:m.twelfth };
        return { ok:false, msg:m.other };
      }
      if (S.r2 === 12 && S.hund === 105) return { ok:false, msg:m.dec };
      return { ok:false, msg:m.other };
    }
    if (id === "tc3") {
      var near = function(v){ return Math.abs(th - v) < 0.005; };
      if (!pi && near(PI - 2)) {
        if (!opt.live && !A.busy) setTimeout(function(){ unrollGo("tc3", 1); }, 0);
        return { ok:true };
      }
      if (near(PI)) return { ok:false, msg:m.pi };
      if (near(PI - 1)) return { ok:false, msg:m.pim1 };
      if (near(TAU - 2)) return { ok:false, msg:m.whole };
      if (near(PI / 2)) return { ok:false, msg:m.quarter };
      if (pi) return { ok:false, msg:m.steps };
      return { ok:false, msg:m.other };
    }
    return { ok:false };
  }

  // ----- predictions -----
  function applyStart(st){
    A.gen++; A.busy = false; A.piece = null; A.rO = A.thO = null; A.flash = null; A.hl = null; resetRuler();
    S.mode = st.mode;
    if (st.mode === "wrap") S.L = st.L;
    else { S.step = st.step; S.r2 = Math.round(st.r * 2); if (st.step === "pi") S.idx = st.idx; else S.hund = Math.round(st.th * 100); }
    S.rad = st.rad != null ? st.rad : true; S.deg = !!st.deg; S.trig = false;
    api.save(); paint(); MV.changed();
  }
  function run(p, done){
    if (p.id === "p1") {
      var n = 0;
      (function more(){
        if (n < 5) { n++; addPiece(400, more); return; }
        flash(6, TAU, T.gapP1);
        later(1300, function(){ addPiece(900, function(){ later(500, done); }); });
      })();
    } else if (p.id === "p2") {
      A.hl = "ratio"; A.busy = true; paint();
      tw({ dur:2000, step:function(t){ A.rO = 2 + 3 * t; paint(); }, done:function(){ A.rO = null; S.r2 = 10; A.busy = false; api.save(); paint(); MV.changed(); later(300, done); } });
    } else if (p.id === "p3") {
      A.busy = true; paint();
      tw({ dur:2000, ease:MV.ease, step:function(t){ A.thO = 3 * t; paint(); }, done:function(){ A.thO = null; S.hund = 300; A.busy = false; A.hl = "near"; flash(3, PI, T.gapP3); api.save(); paint(); MV.changed(); later(1000, done); } });
    } else if (p.id === "p4") {
      unrollGo("arc", 1, function(){ A.ghost = true; drawRuler(); later(900, function(){ found.hidden = false; found.open = true; done(); }); });
    } else done();
  }

  paint();
  return { predict:{ start:function(p){ applyStart(p.start); }, run:run }, challenge:challenge };
}

// @component N19 wheel — a wheel seen from above that turns counterclockwise: rim, spokes, a marked spoke, riders at chosen
// radii with trails, a cerulean angle wedge with a label, and a real-time clock (Run for t seconds, Play/Pause, Reset;
// reduced motion jumps to the end). N19.draw(plot, opts) draws one wheel; N19.clock(tick) drives the time.
var N19 = {
  draw:function(p, o){
    // o: {cx, cy, R, ang, spokes, rim, rimWidth, spoke, marked:color, points:[{r, color, label}], trails:bool, trailAlpha, wedge:{r, color, label}}
    var cx = o.cx || 0, cy = o.cy || 0, ang = o.ang || 0, K = cols();
    if (o.wedge && ang > 1e-6) CD.sector(p, { cx:cx, cy:cy, r:o.wedge.r, a0:0, a1:Math.min(ang, TAU), fill:o.wedge.color, alpha:0.22, color:o.wedge.color, width:1.5 });
    CD.circle(p, { cx:cx, cy:cy, r:o.R, color:o.rim || K.ink2, width:o.rimWidth || 2.5, fill:o.fill });
    for (var i = 0; i < (o.spokes || 0); i++) CD.arm(p, { cx:cx, cy:cy, r:o.R, a:ang + i * TAU / o.spokes, color:o.spoke || K.rule, width:1.5 });
    if (o.marked) CD.arm(p, { cx:cx, cy:cy, r:o.R, a:ang, color:o.marked, width:3.5 });
    (o.points || []).forEach(function(pt){
      if (o.trails && ang > 1e-6) CD.arc(p, { cx:cx, cy:cy, r:pt.r, a0:0, a1:Math.min(ang, TAU), color:pt.color, width:4, alpha:o.trailAlpha == null ? 1 : o.trailAlpha });
      var q = CD.at(p, { cx:cx, cy:cy, r:pt.r }, ang), c = p.ctx;
      c.save(); c.beginPath(); c.arc(q[0], q[1], 7, 0, TAU); c.fillStyle = pt.color; c.fill(); c.lineWidth = 2; c.strokeStyle = K.sheet; c.stroke();
      if (pt.label) { var l = CD.at(p, { cx:cx, cy:cy, r:pt.r, offPx:16 }, ang + 0.18); c.font = "700 14px " + p.fontUI; c.fillStyle = pt.color; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(pt.label, l[0], l[1]); }
      c.restore();
    });
    CD.circle(p, { cx:cx, cy:cy, rPx:4, width:0, fill:K.ink });
    if (o.wedge && o.wedge.label) CD.text(p, cx, cy, o.wedge.label, { dy:-CD.px(p, o.wedge.r) - 12, color:o.wedge.color, font:"italic 600 15px " + p.fontM, bg:true });
  },
  clock:function(tick){
    var raf = null, last = null, c = { el:0, end:null, playing:false, cb:null };
    function f(now){
      if (last == null) last = now;
      c.el += (now - last) / 1000; last = now;
      var fin = c.end != null && c.el >= c.end; if (fin) c.el = c.end;
      tick(c.el, fin);
      if (fin) { halt(); var cb = c.cb; c.cb = null; c.end = null; if (cb) cb(); return; }
      raf = requestAnimationFrame(f);
    }
    function halt(){ if (raf) cancelAnimationFrame(raf); raf = null; last = null; c.playing = false; }
    c.run = function(t, cb){ halt(); c.el = 0; c.end = t; c.cb = cb; if (MV.reduceMotion) { c.el = t; c.end = null; c.cb = null; tick(t, true); if (cb) cb(); return; } c.playing = true; raf = requestAnimationFrame(f); };
    c.play = function(){ halt(); c.end = null; c.cb = null; if (MV.reduceMotion) { c.el += 1; tick(c.el, false); return; } c.playing = true; raf = requestAnimationFrame(f); };
    c.pause = function(){ halt(); tick(c.el, false); };
    c.reset = function(){ halt(); c.el = 0; c.end = null; c.cb = null; };
    return c;
  }
};

// @component N19 beltPath — belt loop around two pulleys at (0, cy) and (D, cy) (two external tangents + two arcs);
// at(s) gives the point s along it counterclockwise (lower strand left → right), pts(s0, s1) a polyline for a bracket
function beltPath(r1, r2, D, cy){
  var psi = PI / 2 + Math.asin((r2 - r1) / D), tl = Math.sqrt(D * D - (r2 - r1) * (r2 - r1));
  var P = function(cx, r, a){ return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  var A1 = P(0, r1, -psi), B1 = P(D, r2, -psi), A2 = P(D, r2, psi), B2 = P(0, r1, psi);
  var segs = [
    { len:tl, at:function(u){ return [lerp(A1[0], B1[0], u / tl), lerp(A1[1], B1[1], u / tl)]; } },
    { len:r2 * 2 * psi, at:function(u){ return P(D, r2, -psi + u / r2); } },
    { len:tl, at:function(u){ return [lerp(A2[0], B2[0], u / tl), lerp(A2[1], B2[1], u / tl)]; } },
    { len:r1 * (TAU - 2 * psi), at:function(u){ return P(0, r1, psi + u / r1); } }];
  var total = segs.reduce(function(a, s){ return a + s.len; }, 0);
  return { len:total, at:function(s){ s = ((s % total) + total) % total; for (var i = 0; i < 4; i++) { if (s <= segs[i].len) return segs[i].at(s); s -= segs[i].len; } return segs[0].at(0); },
    pts:function(s0, s1){ var out = [], N = Math.max(8, Math.ceil((s1 - s0) / 0.6)); for (var i = 0; i <= N; i++) out.push(this.at(s0 + (s1 - s0) * i / N)); return out; } };
}

// ---------- Part 3: Spin lab ----------
function part3(host, api){
  var C = api.content, S = def(api.S, { view:"0", rpm:"15", t:"2", r1:"5", r2:"15", n1:"90", tb:"2", ri:0, runs:{}, ci:0, chains:{} });
  var V = { done:false, free:false, unroll:0, busy:false };
  host.innerHTML = '<div id="sp-view" class="rw-top"></div><div class="sp-grid"><div class="sp-graph"><p class="eq-cap sp-cap" id="sp-cap" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot square" id="sp-plot" role="img" aria-label="Spin lab"></canvas></div></div>' +
    '<div class="sp-side"><div id="sp-c0"><div class="sp-row" id="sp-rpm"></div><div class="sp-row" id="sp-t"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="sp-run" data-k="sprun">Run</button><button type="button" class="btn sm" id="sp-play" data-k="spplay">Play</button><button type="button" class="btn ghost sm" id="sp-reset" data-k="spreset">Reset</button><button type="button" class="btn ghost sm" id="sp-unroll" data-k="spun">Unroll the trails</button></div></div>' +
    '<div id="sp-c1"><div class="sp-row" id="sp-r1"></div><div class="sp-row" id="sp-r2"></div><div class="sp-row" id="sp-n1"></div><div class="sp-row" id="sp-tb"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="sp-run1" data-k="sprun1">Run</button><button type="button" class="btn ghost sm" id="sp-reset1" data-k="spreset1">Reset</button></div></div>' +
    '<dl class="read" id="sp-read" aria-live="polite"></dl></div></div>' +
    '<div class="part"><h3>Predict, then run</h3><p class="muted">' + C.runIntro + '</p><div id="sp-runs"></div></div>' +
    '<div class="part"><h3>Unit chains</h3><p class="muted">' + C.chainIntro + '</p><div id="sp-chains"></div></div>';
  var plot = new MV.Plot($("#sp-plot"), { xmin:-3.5, xmax:3.5, ymin:-4.4, ymax:2.6 }, { equal:true });
  var clk = N19.clock(function(el, fin){ if (fin) V.done = true; draw(); readout(); });
  function reset(){ clk.reset(); V.done = false; V.free = false; V.unroll = 0; }
  function changed(){ reset(); api.save(); paint(); }
  var viewR = radios($("#sp-view"), { aria:"View", options:C.views.map(function(t, i){ return { id:String(i), t:t }; }), value:S.view, onChange:function(v){ S.view = v; changed(); } });
  function chipGroup(id, label, key, vals, unit){ return radios($("#" + id), { label:label, cls:"chips", options:vals.map(function(v){ return { id:String(v), t:v + " " + unit }; }), value:S[key], onChange:function(v){ S[key] = v; changed(); } }); }
  var G = {
    rpm:chipGroup("sp-rpm", "Speed", "rpm", [5, 10, 15, 20], "rpm"), t:chipGroup("sp-t", "Time", "t", [1, 2, 3], "s"),
    r1:chipGroup("sp-r1", "Small pulley radius", "r1", [3, 5], "cm"), r2:chipGroup("sp-r2", "Big pulley radius", "r2", [10, 15], "cm"),
    n1:chipGroup("sp-n1", "Small pulley speed", "n1", [30, 60, 90], "rpm"), tb:chipGroup("sp-tb", "Time", "tb", [1, 2, 3], "s")
  };
  function runIt(){ V.unroll = 0; V.free = false; V.done = false; var t = S.view === "0" ? +S.t : +S.tb; clk.run(t, function(){ V.done = true; paint(); }); paint(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "sp-run" || b.id === "sp-run1") runIt();
    else if (b.id === "sp-play") { if (clk.playing) clk.pause(); else { V.done = false; V.free = true; V.unroll = 0; clk.play(); } paint(); }
    else if (b.id === "sp-reset" || b.id === "sp-reset1") { reset(); paint(); }
    else if (b.id === "sp-unroll") { var dir = V.unroll > 0.5 ? -1 : 1; V.busy = true; paint(); MV.tween({ dur:1200, step:function(t){ V.unroll = dir > 0 ? t : 1 - t; draw(); }, done:function(){ V.busy = false; V.unroll = dir > 0 ? 1 : 0; paint(); } }); }
  });

  // ----- drawing -----
  function v0(){ var rpm = +S.rpm, t = +S.t; return { rpm:rpm, t:t, w:rpm * PI / 30, n:rpm * t }; }   // θ = n·π/30 after a run
  function v1(){ var r1 = +S.r1, r2 = +S.r2, n1 = +S.n1, t = +S.tb; return { r1:r1, r2:r2, n1:n1, t:t, n2:n1 * r1 / r2, w1:n1 * PI / 30, w2:n1 * r1 * PI / (30 * r2), v:r1 * n1 * PI / 30 }; }
  function draw(){
    if (S.view === "0") {
      var d = v0(), ang = d.w * clk.el, K = cols(), U = V.unroll;
      plot.draw({ view:{ xmin:-3.5, xmax:3.5, ymin:-4.4, ymax:2.6 }, equal:true, grid:false, axes:false, describe:desc0(ang), after:function(ctx, p){
        var lab = ang < 1e-6 ? "" : V.done ? "θ = " + piSrc(d.n, 30) : "θ ≈ " + fx(ang, 2);
        N19.draw(p, { R:2, ang:ang, spokes:6, rim:K.ink2, spoke:K.rule, points:[{ r:2, color:K.pen, label:"A" }, { r:1, color:K.f3, label:"B" }], trails:true, trailAlpha:U > 0 ? 0.25 : 1, wedge:{ r:0.62, color:K.pt, label:lab } });
        CD.text(p, -3.35, 2.4, "t = " + fx(clk.el, 1) + " s", { align:"left", font:"italic 600 15px " + p.fontM, color:K.ink });
        var a = Math.min(ang, TAU);
        if (V.done && U === 0 && a > 1e-6) {
          var qa = CD.at(p, { r:2, offPx:20 }, a / 2), qb = CD.at(p, { r:1, offPx:-16 }, a / 2), c = p.ctx;
          c.save(); c.font = "700 13px " + p.fontUI; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = K.pen; c.fillText(piSrc(2 * d.n, 30) + " m", qa[0], qa[1]); c.fillStyle = K.f3; c.fillText(piSrc(d.n, 30) + " m", qb[0], qb[1]); c.restore();
        }
        if (U > 0 && a > 1e-6) {
          [[2, K.pen, -2.95, "A"], [1, K.f3, -3.75, "B"]].forEach(function(z){
            var N = 40, c2 = p.ctx; c2.save(); c2.strokeStyle = z[1]; c2.lineWidth = 5; c2.lineCap = "butt"; c2.beginPath();
            for (var i = 0; i <= N; i++) { var u = a * i / N, x = lerp(z[0] * Math.cos(u), -3.2 + 0.5 * z[0] * u, U), y = lerp(z[0] * Math.sin(u), z[2], U); if (i) c2.lineTo(p.X(x), p.Y(y)); else c2.moveTo(p.X(x), p.Y(y)); }
            c2.stroke(); c2.restore();
            if (U >= 1) CD.text(p, -3.2, z[2] + 0.28, z[3] + ": " + piSrc(z[0] * d.n, 30) + " ≈ " + fx(z[0] * a, 2) + " m", { align:"left", font:"700 13px " + p.fontUI, color:z[1] });
          });
        }
      } });
    } else {
      var e = v1(), el = clk.el, K1 = cols(), D = 30, cy = 4, belt = beltPath(e.r1, e.r2, D, cy), s = e.v * el;
      plot.draw({ view:{ xmin:-8, xmax:48, ymin:-24, ymax:32 }, equal:true, grid:false, axes:false, describe:desc1(), after:function(ctx, p){
        if (s > 1e-6) CD.poly(p, belt.pts(0, Math.min(s, belt.len)), { color:K1.hi, width:10, cap:"butt" });
        CD.poly(p, belt.pts(0, belt.len), { color:K1.ink, width:2.5 });
        var a1 = e.w1 * el, a2 = e.w2 * el, wl = function(n){ return V.done ? "θ = " + piSrc(n, 30) : ""; };
        N19.draw(p, { cx:0, cy:cy, R:e.r1, ang:a1, spokes:4, rim:K1.pen, rimWidth:3, spoke:K1.rule, marked:K1.pen, wedge:V.done ? { r:e.r1 * 0.7, color:K1.pt } : null });
        N19.draw(p, { cx:D, cy:cy, R:e.r2, ang:a2, spokes:4, rim:K1.f3, rimWidth:3, spoke:K1.rule, marked:K1.f3, wedge:V.done ? { r:e.r2 * 0.6, color:K1.pt } : null });
        var mk = belt.at(s), c = p.ctx; c.save(); c.beginPath(); c.arc(p.X(mk[0]), p.Y(mk[1]), 10, 0, TAU); c.fillStyle = K1.hi; c.fill(); c.beginPath(); c.arc(p.X(mk[0]), p.Y(mk[1]), 5.5, 0, TAU); c.fillStyle = K1.ink; c.fill(); c.restore();
        var t1 = V.done ? MV.plain(turnsTxt(e.n1 * e.t, 60)) : fx(e.n1 * el / 60, 1) + " turns", t2 = V.done ? MV.plain(turnsTxt(e.n2 * e.t, 60)) : fx(e.n2 * el / 60, 1) + " turns";
        CD.text(p, 0, cy + 15 + 3, "Small: " + t1, { color:K1.pen, font:"700 13px " + p.fontUI, bg:true });
        CD.text(p, D, cy + e.r2 + 3, "Big: " + t2, { color:K1.f3, font:"700 13px " + p.fontUI, bg:true });
        if (V.done) {
          CD.text(p, 0, cy - e.r1 - 3.5, wl(e.n1 * e.t), { color:K1.pt, font:"italic 600 14px " + p.fontM, bg:true });
          CD.text(p, D, cy - e.r2 - 3, wl(e.n2 * e.t), { color:K1.pt, font:"italic 600 14px " + p.fontM, bg:true });
          CD.text(p, 20, -19, "The belt moved " + piSrc(e.r1 * e.n1 * e.t, 30) + " ≈ " + fx(s, 2) + " cm", { font:"700 13px " + p.fontUI, color:K1.ink, bg:true });
        }
      } });
    }
  }
  plot.render = draw;
  function desc0(ang){ return "Merry-go-round seen from above, radius 2 m, with rider A at the edge and rider B 1 m from the centre. It has turned through " + fx(ang, 2) + " radians in " + fx(clk.el, 1) + " s." + (V.unroll >= 1 ? " The trails are unrolled into bars: A's is twice as long as B's." : ""); }
  function desc1(){ var e = v1(); return "Two pulleys joined by a belt: a small one of radius " + e.r1 + " cm turning at " + e.n1 + " rpm and a big one of radius " + e.r2 + " cm. After " + fx(clk.el, 1) + " s the belt has moved " + fx(e.v * clk.el, 2) + " cm."; }

  // ----- readout -----
  var MUTE = '<span class="muted">Run the wheel to fill this in.</span>';
  function readout(){
    var rows = [];
    if (S.view === "0") {
      var d = v0(), el = clk.el, ang = d.w * el, ws = piSrc(d.rpm, 30, true), show = V.done || V.free || clk.playing;
      rows.push(["Speed", d.rpm + " rpm = " + d.rpm + " turns per minute"]);
      rows.push(["Time", V.done || !show ? MV.m("t = " + d.t) + " s" : MV.m("t ≈ " + fx(el, 1)) + " s (turning freely)"]);
      if (V.done) {
        var ts = piSrc(d.n, 30, true);
        rows.push(["Turns", turnsTxt(d.n, 60)]);
        rows.push(["Angle turned", MV.m(TH + " = " + ts + " ≈ " + fx(d.n * PI / 30, 2)) + " rad"]);
        rows.push(["Angular velocity", MV.m("ω = " + TH + " ÷ t = " + ws + " ≈ " + fx(d.w, 2)) + " rad/s, for A and B alike"]);
        [[2, "A"], [1, "B"]].forEach(function(z){
          rows.push(["Rider " + z[1] + " (" + MV.m("r") + " = " + z[0] + " m)", "travelled " + MV.m("a = " + z[0] + " × " + ts + " = " + piSrc(z[0] * d.n, 30, true) + " ≈ " + fx(z[0] * d.n * PI / 30, 2)) + " m; speed " + MV.m("v = " + z[0] + " × " + ws + " = " + piSrc(z[0] * d.rpm, 30, true) + " ≈ " + fx(z[0] * d.w, 2)) + " m/s"]);
        });
      } else if (show) {
        rows.push(["Turns", "≈ " + fx(ang / TAU, 2) + " turns"]);
        rows.push(["Angle turned", MV.m(TH + " ≈ " + fx(ang, 2)) + " rad"]);
        rows.push(["Angular velocity", MV.m("ω = " + ws + " ≈ " + fx(d.w, 2)) + " rad/s, for A and B alike"]);
        rows.push(["Rider A (" + MV.m("r") + " = 2 m)", "travelled " + MV.m("a ≈ " + fx(2 * ang, 2)) + " m; speed " + MV.m("v = 2 × " + ws + " ≈ " + fx(2 * d.w, 2)) + " m/s"]);
        rows.push(["Rider B (" + MV.m("r") + " = 1 m)", "travelled " + MV.m("a ≈ " + fx(ang, 2)) + " m; speed " + MV.m("v = 1 × " + ws + " ≈ " + fx(d.w, 2)) + " m/s"]);
      } else rows.push(["Angle turned", MUTE]);
    } else {
      var e = v1();
      rows.push(["Small pulley", e.n1 + " rpm: " + MV.m("ω_1 = " + piSrc(e.n1, 30, true) + " ≈ " + fx(e.w1, 2)) + " rad/s"]);
      if (V.done) {
        var vs = piSrc(e.r1 * e.n1, 30, true), k = e.r2 / e.r1, ki = Math.abs(k - Math.round(k)) < 1e-9;
        rows.push(["Belt speed", MV.m("v = r_1ω_1 = " + e.r1 + " × " + piSrc(e.n1, 30, true) + " = " + vs + " ≈ " + fx(e.v, 2)) + " cm/s"]);
        rows.push(["Big pulley", MV.m("ω_2 = v ÷ r_2 = " + vs + " ÷ " + e.r2 + " = " + piSrc(e.r1 * e.n1, 30 * e.r2, true) + " ≈ " + fx(e.w2, 2)) + " rad/s (" + num(e.n2) + " rpm)"]);
        rows.push(["Ratio", "The small pulley turns " + (ki ? Math.round(k) : "about " + fx(k, 2)) + " times for each turn of the big one (" + e.r2 + " ÷ " + e.r1 + (ki ? " = " + Math.round(k) : " ≈ " + fx(k, 2)) + ")"]);
        rows.push(["After " + MV.m("t = " + e.t) + " s", "Small: " + turnsTxt(e.n1 * e.t, 60) + " (" + MV.m(piSrc(e.n1 * e.t, 30)) + " rad). Big: " + turnsTxt(e.n2 * e.t, 60) + " (" + MV.m(piSrc(e.n2 * e.t, 30)) + " rad). The belt moved " + MV.m(piSrc(e.r1 * e.n1 * e.t, 30) + " ≈ " + fx(e.v * e.t, 2)) + " cm"]);
      } else rows.push(["Belt speed", MUTE]);
    }
    $("#sp-read").innerHTML = rows.map(function(r){ return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    $("#sp-cap").innerHTML = S.view === "0" ? MV.m("v = rω") : MV.m("r_1ω_1 = r_2ω_2");
  }
  function paint(){
    viewR.set(S.view);
    $("#sp-c0").hidden = S.view !== "0"; $("#sp-c1").hidden = S.view !== "1";
    Object.keys(G).forEach(function(k){ G[k].set(S[k]); });
    $("#sp-play").textContent = clk.playing ? "Pause" : "Play";
    $("#sp-unroll").textContent = V.unroll > 0.5 ? "Roll them back" : "Unroll the trails";
    $("#sp-unroll").disabled = V.busy || !V.done;
    draw(); readout();
  }

  // ----- Predict, then run (R1–R4) -----
  var RUNS = C.runs, rmsg = {}, rq = {};
  function rst(it){ return S.runs[it.id] || (S.runs[it.id] = { val:"", q:null, tries:0, hint:0, solved:false, first:null }); }
  function setupOf(it){
    var s = it.setup;
    if (s.view === 0) { S.view = "0"; S.rpm = String(s.rpm); S.t = String(s.t); }
    else { S.view = "1"; S.r1 = String(s.r1); S.n1 = String(s.n1); S.r2 = String(s.r2); S.tb = String(s.t); }
    reset(); api.save(); paint();
  }
  function setupText(it){ var s = it.setup; return "Set-up: " + C.views[s.view] + " · " + (s.view === 0 ? s.rpm + " rpm · " + MV.m("t") + " = " + s.t + " s" : "small " + s.r1 + " cm at " + s.n1 + " rpm, big " + s.r2 + " cm · " + MV.m("t") + " = " + s.t + " s"); }
  function runsPaint(){
    var host2 = $("#sp-runs"), it = RUNS[S.ri], x = rst(it), box = it.box;
    var h = '<div class="pred-top"><span class="tiny muted">Run ' + (S.ri + 1) + " of " + RUNS.length + '</span><span class="dots" aria-hidden="true">' + RUNS.map(function(q, i){ var y = S.runs[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.ri ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<p class="tiny muted">' + setupText(it) + '</p><p class="pred-q">' + it.prompt + "</p>";
    h += '<div class="numrow"><label for="sp-in">' + (box.pre || "Your answer:") + '</label><input class="numin short" id="sp-in" type="text" inputmode="decimal" autocomplete="off" data-k="spin" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" + (box.post ? '<span class="m">' + box.post + "</span>" : "") + "</div>";
    if (it.quad) h += '<div class="sp-quad" id="sp-quad"></div>';
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="rcheck" data-k="rchk">Check</button>' + MV.hintBtn("rh" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + ' The wheel runs so you can see it.</p></div><div class="q-actions"><button type="button" class="btn ghost sm" data-act="rrun" data-k="rrun">Run it again</button></div>';
    else if (rmsg[it.id]) h += '<div class="fb bad" role="status"><p>' + rmsg[it.id] + "</p></div>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="rprev" data-k="rprev"' + (S.ri === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-act="rnext" data-k="rnext"' + (S.ri === RUNS.length - 1 ? " disabled" : "") + ">Next</button></div>";
    MV.keepFocus(host2, function(){ host2.innerHTML = h; });
    if (it.quad) {
      rq = radios($("#sp-quad", host2), { label:"Rider A stops in", cls:"chips", options:[1, 2, 3, 4].map(function(n){ return { id:String(n), t:"Quadrant " + n }; }), value:x.q == null ? "" : x.q, onChange:function(v){ x.q = v; api.save(); } });
      if (x.solved) rq.lock(true);
    }
  }
  function parseCoef(raw, pi){ var s = String(raw || "").trim(); if (!s) return null; var r = MV.parseNum(s); if (!r || r.length !== 1) return null; return pi && /π|pi/i.test(s) ? r[0] / PI : r[0]; }
  function runCheck(){
    var it = RUNS[S.ri], x = rst(it), A = MV.ans(it), isPi = /π/.test(it.box.post || ""), v = parseCoef(x.val, isPi);
    if (v == null) { rmsg[it.id] = "Enter a number, such as 2, 1/2 or 0.75."; runsPaint(); MV.focusFb($("#sp-runs")); return; }
    if (it.quad && !x.q) { rmsg[it.id] = "Choose a quadrant too."; runsPaint(); MV.focusFb($("#sp-runs")); return; }
    var vOk = Math.abs(v - A.v) < 1e-4, qOk = !it.quad || +x.q === A.q;
    if (vOk && qOk) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; rmsg[it.id] = null; api.save(); runsPaint(); MV.focusFb($("#sp-runs")); setupOf(it); runIt(); return; }
    x.tries++;
    var fb = null;
    if (!vOk) { var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.v) < 1e-4; })[0]; fb = w ? w.fb : null; }
    else fb = (it.qwrong || {})[x.q] || null;
    rmsg[it.id] = "<strong>✗ Not quite.</strong> " + (fb || "Check your work and try again.");
    api.save(); runsPaint(); MV.focusFb($("#sp-runs"));
  }
  $("#sp-runs").addEventListener("input", function(e){ if (e.target.id === "sp-in") { rst(RUNS[S.ri]).val = e.target.value; api.save(); } });
  $("#sp-runs").addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.id === "sp-in") { e.preventDefault(); runCheck(); } });
  $("#sp-runs").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.dataset.rg) return;
    var it = RUNS[S.ri], x = rst(it);
    if (b.dataset.act === "rcheck") runCheck();
    else if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); runsPaint(); }
    else if (b.dataset.act === "rrun") { setupOf(it); runIt(); }
    else if (b.dataset.act === "rprev" || b.dataset.act === "rnext") { S.ri += b.dataset.act === "rprev" ? -1 : 1; api.save(); runsPaint(); setupOf(RUNS[S.ri]); }
  });

  // @component unitChain — unit-chain builder: a starting rate, 1–2 slots, a tray of fraction tiles (tap a tile, then a slot),
  // units that cancel struck through, Check the units (tile-specific feedback) then a value box (π-box or plain) with known wrong values
  var CH = C.chains, TILES = {}, umsg = {}, sel = null;
  C.tiles.forEach(function(t){ TILES[t.id] = t; });
  function cst(it){ var y = S.chains[it.id]; if (!y) y = S.chains[it.id] = { slots:[], unitsOk:false, uTries:0, val:"", vTries:0, hint:0, solved:false, first:null }; while (y.slots.length < it.slots) y.slots.push(null); return y; }
  // which units cancel: factors [{nu, du}] -> {struck:{"i:n"|"i:d":1}, res:"rad/s"}
  function cancel(factors){
    var num = [], den = [], struck = {};
    factors.forEach(function(f, i){ if (f) { num.push({ u:f.nu, k:i + ":n" }); den.push({ u:f.du, k:i + ":d" }); } });
    num.forEach(function(n){ var d = den.filter(function(q){ return q.u === n.u && !struck[q.k]; })[0]; if (d) { struck[n.k] = 1; struck[d.k] = 1; } });
    var rn = num.filter(function(q){ return !struck[q.k]; }).map(function(q){ return q.u; }), rd = den.filter(function(q){ return !struck[q.k]; }).map(function(q){ return q.u; });
    return { struck:struck, res:(rn.join(" · ") || "1") + (rd.length ? "/" + rd.join(" · ") : "") };
  }
  function fracHTML(f, i, struck){
    var part = function(txt, u, k){ var sp = txt.lastIndexOf(" "), a = txt.slice(0, sp), w = txt.slice(sp + 1); return MV.esc(a) + " " + (struck[i + ":" + k] ? "<s>" + w + "</s>" : "<span>" + w + "</span>"); };
    return '<span class="uc-f"><span class="uc-n">' + part(f.n, f.nu, "n") + '</span><span class="uc-d">' + part(f.d, f.du, "d") + "</span></span>";
  }
  function chainsPaint(){
    var host3 = $("#sp-chains"), it = CH[S.ci], x = cst(it), factors = [it.start].concat(x.slots.map(function(id){ return id ? TILES[id] : null; })), cc = cancel(factors);
    var h = '<div class="pred-top"><span class="tiny muted">Chain ' + (S.ci + 1) + " of " + CH.length + '</span><span class="dots" aria-hidden="true">' + CH.map(function(q, i){ var y = S.chains[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.ci ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<p class="pred-q">' + it.q + '</p><div class="uc-scroll"><div class="uc-row">' + fracHTML(it.start, 0, cc.struck);
    x.slots.forEach(function(id, si){
      h += '<span class="uc-x" aria-hidden="true">×</span><button type="button" class="uc-slot' + (id ? " full" : "") + (sel && !id ? " ready" : "") + '" data-slot="' + si + '" data-k="ucs' + si + '"' + (x.unitsOk ? " disabled" : "") + ' aria-label="' + (id ? "Slot " + (si + 1) + ": " + MV.esc(TILES[id].n + " per " + TILES[id].d) + ". Tap to take the tile out." : "Empty slot " + (si + 1)) + '">' + (id ? fracHTML(TILES[id], si + 1, cc.struck) : '<span class="uc-empty">slot</span>') + "</button>";
    });
    h += '<span class="uc-x" aria-hidden="true">=</span><span class="uc-res">' + cc.res.replace("turn", "turns") + "</span></div></div>";
    if (!x.unitsOk) {
      var used = x.slots.filter(Boolean);
      h += '<div class="uc-tray" role="group" aria-label="Tiles">' + C.tiles.filter(function(t){ return used.indexOf(t.id) < 0; }).map(function(t){ return '<button type="button" class="uc-tile" data-tile="' + t.id + '" data-k="uct' + t.id + '" aria-pressed="' + (sel === t.id) + '" aria-label="' + MV.esc(t.n + " per " + t.d) + '">' + fracHTML(t, -1, {}) + "</button>"; }).join("") + "</div>";
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="ucheck" data-k="uchk">Check the units</button><button type="button" class="btn ghost sm" data-act="uclear" data-k="uclr">Clear</button>' + (x.solved ? "" : MV.hintBtn("uh" + it.id, x.hint)) + "</div>";
    } else if (!x.solved) {
      h += '<div class="fb good" role="status"><p><strong>✓ The units cancel to ' + it.target.replace("turn/min", "turns per minute (rpm)") + ".</strong> Now find the value.</p></div>";
      h += '<div class="numrow"><label for="uc-in">Value:</label><input class="numin short" id="uc-in" type="text" inputmode="decimal" autocomplete="off" data-k="ucin" value="' + MV.esc(x.val) + '"><span class="m">' + it.box.post + "</span></div>";
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="vcheck" data-k="vchk">Check the value</button>' + MV.hintBtn("uh" + it.id, x.hint) + "</div>";
    }
    if (!x.solved) h += MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + (it.after ? " " + it.after : "") + "</p></div>";
    else if (umsg[it.id]) h += '<div class="fb bad" role="status"><p>' + umsg[it.id] + "</p></div>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="cprev" data-k="cprev"' + (S.ci === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-act="cnext" data-k="cnext"' + (S.ci === CH.length - 1 ? " disabled" : "") + ">Next chain</button></div>";
    MV.keepFocus(host3, function(){ host3.innerHTML = h; });
  }
  function unitCheck(){
    var it = CH[S.ci], x = cst(it), A = MV.ans(it);
    if (x.slots.some(function(s){ return !s; })) { umsg[it.id] = "Put a tile in every slot first."; chainsPaint(); MV.focusFb($("#sp-chains")); return; }
    var bad = x.slots.filter(function(id){ return A.tiles.indexOf(id) < 0; })[0];
    if (!bad) { x.unitsOk = true; umsg[it.id] = null; api.save(); chainsPaint(); var inp = $("#uc-in"); if (inp) inp.focus(); return; }
    x.uTries++; umsg[it.id] = "<strong>✗ Not quite.</strong> " + (it.tileFb[bad] || "Check which unit each tile cancels.");
    api.save(); chainsPaint(); MV.focusFb($("#sp-chains"));
  }
  function valueCheck(){
    var it = CH[S.ci], x = cst(it), A = MV.ans(it), v = parseCoef(x.val, it.box.pi);
    if (v == null) { umsg[it.id] = "Enter a number, such as 180, 3/2 or 0.5."; chainsPaint(); MV.focusFb($("#sp-chains")); return; }
    if (Math.abs(v - A.v) < 1e-4 * Math.max(1, Math.abs(A.v))) { x.solved = true; x.first = x.uTries === 0 && x.vTries === 0 && x.hint < 3; umsg[it.id] = null; api.save(); chainsPaint(); MV.focusFb($("#sp-chains")); return; }
    x.vTries++; var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.v) < 1e-4 * Math.max(1, Math.abs(q.v)); })[0];
    umsg[it.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : "Check your work and try again.");
    api.save(); chainsPaint(); MV.focusFb($("#sp-chains"));
  }
  $("#sp-chains").addEventListener("input", function(e){ if (e.target.id === "uc-in") { cst(CH[S.ci]).val = e.target.value; api.save(); } });
  $("#sp-chains").addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.id === "uc-in") { e.preventDefault(); valueCheck(); } });
  $("#sp-chains").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = CH[S.ci], x = cst(it);
    if (b.dataset.tile) { sel = sel === b.dataset.tile ? null : b.dataset.tile; umsg[it.id] = null; chainsPaint(); return; }
    if (b.dataset.slot != null) {
      var si = +b.dataset.slot;
      if (x.slots[si]) { x.slots[si] = null; umsg[it.id] = null; }
      else if (sel) { x.slots[si] = sel; sel = null; umsg[it.id] = null; }
      else umsg[it.id] = "Tap a tile first, then tap an empty slot.";
      api.save(); chainsPaint(); return;
    }
    if (b.dataset.act === "ucheck") unitCheck();
    else if (b.dataset.act === "vcheck") valueCheck();
    else if (b.dataset.act === "uclear") { x.slots = x.slots.map(function(){ return null; }); sel = null; umsg[it.id] = null; api.save(); chainsPaint(); }
    else if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); chainsPaint(); }
    else if (b.dataset.act === "cprev" || b.dataset.act === "cnext") { S.ci += b.dataset.act === "cprev" ? -1 : 1; sel = null; api.save(); chainsPaint(); }
  });

  // Results summary lines and goals to review for the two Spin lab activities
  function reg(id, list, store, label, bad){
    MV.ACTS[id] = { stats:function(){ var f = 0, d = 0; list.forEach(function(it){ var y = S[store][it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:list.length, done:d, line:label + " (first try): " + f + "/" + list.length + (d < list.length ? " (unfinished)" : "") }; },
      missed:function(){ var g = []; list.forEach(function(it){ var y = S[store][it.id]; if (y && bad(y)) g = g.concat(MV.goalIdx(it.goal)); }); return g; } };
  }
  reg("spin-runs", RUNS, "runs", "Predict, then run", function(y){ return y.tries > 0 || y.hint >= 3; });
  reg("spin-chains", CH, "chains", "Unit chains", function(y){ return y.uTries > 0 || y.vTries > 0 || y.hint >= 3; });

  paint(); runsPaint(); chainsPaint();
}

// @component N4 piBoxes — number entries with π-boxes (coefficient of π; "2π/9" also accepted), decimal boxes with an absolute
// tolerance, several boxes per item, known-wrong values per box (single value or list, own tolerance), first-try scoring
function numsAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { vals:[], tries:0, hint:0, solved:false, first:null }); }
  function parse(raw, pi){ var s = String(raw == null ? "" : raw).trim(); if (!s) return null; var r = MV.parseNum(s); if (!r || r.length !== 1) return null; return pi && /π|pi/i.test(s) ? r[0] / PI : r[0]; }
  function hit(v, w, tol){ var vs = Array.isArray(w.v) ? w.v : [w.v], t = w.tol != null ? w.tol : tol; return vs.some(function(u){ return Math.abs(v - u) <= t + 1e-9; }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-ni="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="numrow nm-row">' + it.boxes.map(function(b, bi){
          var id = "nm-" + it.id + "-" + bi, lab = b.pre || (it.boxes.length > 1 ? "Box " + (bi + 1) : "Your answer:");
          return '<span class="nm-box"><label for="' + id + '">' + lab + '</label><input class="numin short" id="' + id + '" data-nm="' + it.id + '" data-b="' + bi + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.vals[bi] || "") + '"' + (x.solved ? " disabled" : "") + ">" + (b.pi ? '<span class="m">π</span>' : b.post ? '<span class="nm-post' + (b.post === "°" ? " deg" : "") + '">' + b.post + "</span>" : "") + "</span>";
        }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  function check(it){
    var x = ist(it.id), A = MV.ans(it), vals = it.boxes.map(function(b, bi){ return parse(x.vals[bi], b.pi); });
    if (vals.some(function(v){ return v == null; })) { msgs[it.id] = "Enter a number" + (it.boxes.length > 1 ? " in every box" : "") + ", such as 12, " + MINUS + "3.5 or 3/4."; paint(); MV.focusFb(host.querySelector('[data-ni="' + it.id + '"]')); return; }
    var fbs = [], allOk = true;
    it.boxes.forEach(function(b, bi){
      var v = vals[bi]; if (Math.abs(v - A[bi]) <= b.tol + 1e-9) return;
      allOk = false; var w = (b.wrong || []).filter(function(q){ return hit(v, q, b.tol); })[0];
      fbs.push((it.boxes.length > 1 && b.name ? "For " + b.name + ": " : "") + (w ? w.fb : "Check your work and try again."));
    });
    if (allOk) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + fbs.join(" "); }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-ni="' + it.id + '"]'));
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.nm) return; ist(t.dataset.nm).vals[+t.dataset.b] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ var t = e.target; if (e.key !== "Enter" || !t.dataset || !t.dataset.nm) return; e.preventDefault(); check(a.items.filter(function(q){ return q.id === t.dataset.nm; })[0]); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ni]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.ni; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); }
    else if (b.dataset.act === "check") check(it);
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Roll to quadrant 2 (N19 wheel rolling left along a track) ----------
var task = (function(){
  var api, plot, T, s = 0, gen = 0, timer = null, RADII = [4, 5, 6, 8, 10];
  function read(){
    var st = api ? api.S : {}, r = +(st.r || 4), raw = String(st.d == null ? "" : st.d).trim(), d = /^\d+$/.test(raw) ? +raw : NaN;
    var valid = RADII.indexOf(r) >= 0 && Number.isInteger(d) && d >= 10 && d <= 100, th = d / r, turns = Math.floor(th / TAU), phi = th - turns * TAU;
    return { r:r, d:d, raw:raw, valid:valid, th:th, turns:turns, phi:phi };
  }
  function quad(phi){ return phi < PI / 2 ? 1 : phi < PI ? 2 : phi < 3 * PI / 2 ? 3 : 4; }
  function draw(){
    var D = read(), K = cols(), r = D.valid ? D.r : 5, cx = -s, ang = s / r, wide = plot.c.getBoundingClientRect().width;
    var hw = wide < 520 ? 24 : 38;
    plot.draw({ view:{ xmin:cx - hw, xmax:cx + hw, ymin:-6, ymax:24 }, equal:true, grid:false, axes:false,
      describe:D.valid ? "A wheel of radius " + D.r + " cm rolls " + D.d + " cm to the left along a track. Its painted spoke turns through " + fx(D.th, 2) + " radians and stops " + (D.phi % (PI / 2) < 1e-9 ? "on an axis" : "in quadrant " + quad(D.phi)) + "." : "Track with a wheel at the start. Choose a radius and a distance.",
      after:function(ctx, p){
        var c = p.ctx; c.save(); c.strokeStyle = K.ink; c.lineWidth = 2; c.beginPath(); c.moveTo(p.X(-130), p.Y(0)); c.lineTo(p.X(20), p.Y(0)); c.stroke();
        c.lineWidth = 1.2; c.fillStyle = K.ink2; c.font = "11px " + p.fontUI; c.textAlign = "center"; c.textBaseline = "top";
        for (var k = 0; k <= 120; k += 10) { c.beginPath(); c.moveTo(p.X(-k), p.Y(0)); c.lineTo(p.X(-k), p.Y(0) + 7); c.stroke(); c.fillText(k === 0 ? "0 cm" : String(k), p.X(-k), p.Y(0) + 9); }
        c.restore();
        N19.draw(p, { cx:cx, cy:r, R:r, ang:ang, spokes:0, rim:K.ink, rimWidth:2.5, fill:K.sheet, marked:K.pen });
        // inset: final direction of the spoke, quadrant shaded, leftover angle in cerulean
        if (D.valid) {
          var R = 26, ix = p.W - R - 14, iy = R + 14, q = quad(D.phi), c2 = p.ctx;
          c2.save(); c2.fillStyle = K.sheet; c2.globalAlpha = 0.92; c2.fillRect(ix - R - 8, iy - R - 8, 2 * R + 16, 2 * R + 16); c2.globalAlpha = 1;
          c2.strokeStyle = K.rule; c2.lineWidth = 1; c2.strokeRect(ix - R - 8, iy - R - 8, 2 * R + 16, 2 * R + 16);
          if (D.phi % (PI / 2) > 1e-9) { c2.beginPath(); c2.moveTo(ix, iy); c2.arc(ix, iy, R, -(q - 1) * PI / 2, -q * PI / 2, true); c2.closePath(); c2.fillStyle = K.hiSoft; c2.fill(); }
          c2.strokeStyle = K.ink2; c2.beginPath(); c2.moveTo(ix - R - 4, iy); c2.lineTo(ix + R + 4, iy); c2.moveTo(ix, iy - R - 4); c2.lineTo(ix, iy + R + 4); c2.stroke();
          c2.beginPath(); c2.arc(ix, iy, R, 0, TAU); c2.lineWidth = 1.5; c2.stroke();
          if (D.phi > 1e-9) { c2.beginPath(); c2.arc(ix, iy, R * 0.45, 0, -D.phi, true); c2.strokeStyle = K.pt; c2.lineWidth = 2.5; c2.stroke(); }
          c2.beginPath(); c2.moveTo(ix, iy); c2.lineTo(ix + R * Math.cos(D.phi), iy - R * Math.sin(D.phi)); c2.strokeStyle = K.pen; c2.lineWidth = 3; c2.lineCap = "round"; c2.stroke();
          c2.restore();
        }
      } });
  }
  function caption(){
    var D = read(), el = $("#rq-cap"); if (!el) return;
    if (!D.valid) { el.innerHTML = '<span class="muted">' + T.invalid + "</span>"; return; }
    var turn = D.turns === 0 ? "less than one full turn" : D.turns + " full turn" + (D.turns > 1 ? "s" : "") + " + " + fx(D.phi, 2);
    el.innerHTML = MV.m(TH + " = d ÷ r = " + D.d + " ÷ " + D.r + " = " + fx(D.th, 2)) + " radians (" + turn + ")";
  }
  function roll(){
    var D = read(), g = ++gen;
    if (!D.valid) { s = 0; draw(); return; }
    MV.tween({ dur:2000, ease:LIN, step:function(t){ if (g === gen) { s = D.d * t; draw(); } } });
  }
  function update(){ caption(); api.update(); clearTimeout(timer); var D = read(); if (!D.valid) { gen++; s = 0; draw(); return; } s = 0; draw(); timer = setTimeout(roll, 350); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; def(a.S, { r:4, d:"" });
      inp.innerHTML = '<div class="inrow rq-in"><label for="rq-r"><span>Wheel radius ' + MV.m("r") + '</span><select id="rq-r" class="rq-sel">' + RADII.map(function(v){ return '<option value="' + v + '"' + (+a.S.r === v ? " selected" : "") + ">" + v + " cm</option>"; }).join("") + "</select></label>" +
        '<div class="rq-d"><label for="rq-d"><span>Driving distance ' + MV.m("d") + ' (cm)</span></label><div class="rw-slrow"><button type="button" class="btn ghost rw-pm" id="rq-m" aria-label="Decrease the distance by 1 cm">' + MINUS + '</button><input id="rq-d" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" value="' + MV.esc(a.S.d) + '" placeholder="10 to 100"><button type="button" class="btn ghost rw-pm" id="rq-p" aria-label="Increase the distance by 1 cm">+</button></div></div></div>';
      pv.innerHTML = '<canvas class="plot wide" id="rq-plot" role="img" aria-label="The robot wheel on its track"></canvas><p class="rq-cap" id="rq-cap" aria-live="polite"></p><div class="q-actions" style="margin-top:4px"><button type="button" class="btn ghost sm" id="rq-roll">Roll again</button></div>';
      plot = new MV.Plot($("#rq-plot"), { xmin:-40, xmax:40, ymin:-6, ymax:24 }); plot.render = draw;
      $("#rq-r").addEventListener("change", function(){ a.S.r = +$("#rq-r").value; a.save(); update(); });
      $("#rq-d").addEventListener("input", function(){ a.S.d = $("#rq-d").value; a.save(); update(); });
      function step(dlt){ var v = parseInt(a.S.d, 10); v = isNaN(v) ? 40 : clamp(v + dlt, 10, 100); a.S.d = String(v); $("#rq-d").value = a.S.d; a.save(); update(); }
      $("#rq-m").addEventListener("click", function(){ step(-1); });
      $("#rq-p").addEventListener("click", function(){ step(1); });
      $("#rq-roll").addEventListener("click", function(){ clearTimeout(timer); roll(); });
      // after a success with both a 5 cm and a 6 cm wheel, add the plan's closing note
      var chk = $("#task-check"); if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var fb = $("#task-fb .fb.good"), found = MV.taskState().found || [];
        var radii = found.map(function(k){ return k.split("|")[0]; });
        if (fb && radii.indexOf("5") >= 0 && radii.indexOf("6") >= 0) fb.insertAdjacentHTML("beforeend", "<p>" + T.afterBoth + "</p>");
      }, 0); });
      caption(); draw(); var D0 = read(); if (D0.valid) { s = D0.d; draw(); }
    },
    read:read,
    valid:function(d){ return d.valid ? true : T.invalid; },
    checks:function(d){ if (!d.valid) return [false, false, false]; return [d.d >= 40 && d.d <= 60, d.th > TAU && d.th < 2 * TAU, d.phi > PI / 2 && d.phi < PI]; },
    tips:function(d, res){
      var out = [];
      if (!res[0]) out.push(T.tips[0]);
      if (!res[1]) out.push(T.tips[1].replace("{th}", fx(d.th, 2)));
      if (!res[2]) out.push(T.tips[2].replace("{phi}", fx(d.phi, 2)));
      return out;
    },
    key:function(d){ return d.r + "|" + d.d; },
    label:function(k){ var p = k.split("|"); return MV.m("r") + " = " + p[0] + " cm, " + MV.m("d") + " = " + p[1] + " cm"; },
    text:function(k){ var p = k.split("|"); return "r = " + p[0] + " cm, d = " + p[1] + " cm"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ nums:numsAct },
  task:task
});
})();
