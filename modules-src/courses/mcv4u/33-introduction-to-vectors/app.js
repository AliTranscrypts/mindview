// MCV4U 33 Introduction to Vectors: hero (a distance circle, then a bearing picks one place), Arrow builder (Explore: V3 vector
// board with Draw, Compare and Compass modes, compass rose with bearing and angle arcs, three-way direction readout), Scalar or
// vector? (Part 3: K12 sort of quantities + "Where am I?" circle with a bearing dial), Directions three ways (Practice 2: degree
// boxes and chips) and the "Turn left 90°" task (three vectors from the origin on the V3 board).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num;
function m(s){ return MV.m(s); }
function md(s){ return MV.md(String(s)); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function narrow(){ return !!(window.matchMedia && window.matchMedia("(max-width: 560px)").matches); }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (val === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}
function pt(a){ return "(" + num(a[0]) + ", " + num(a[1]) + ")"; }

// =====================================================================================================================
// @component vecMath — run/rise arithmetic for 2D vectors (MCV4U Ch 6–7): exact magnitudes (whole number or simplest radical
// k√r as m() source), the angle counterclockwise from the positive x-axis, the true bearing (three digits, clockwise from north)
// and the quadrant bearing ("N ≈ 36.9° E", "due north"), with "≈" and one decimal when a direction isn't a whole number of
// degrees. angle = 90° − bearing (mod 360). cmpVec classifies two vectors (equal, opposite, parallel, neither).
// =====================================================================================================================
function isInt(t){ return Math.abs(t - Math.round(t)) < 1e-7; }
function mod360(t){ t = ((t % 360) + 360) % 360; if (isInt(t)) t = Math.round(t) % 360; return t; }
function magSrc(a, b){
  var n = a * a + b * b; if (!n) return "0";
  var k = 1, r = n; for (var f = 2; f * f <= r; f++) while (r % (f * f) === 0) { r /= f * f; k *= f; }
  return r === 1 ? String(k) : (k === 1 ? "" : k) + "√" + r;
}
function magTxt(a, b){ var v = Math.hypot(a, b); return isInt(v) ? num(Math.round(v)) : "≈ " + num(Math.round(v * 10) / 10, 1); }
function angOf(a, b){ return mod360(Math.atan2(b, a) * 180 / Math.PI); }
function brgOf(a, b){ return mod360(90 - angOf(a, b)); }
function degTxt(t, pad){
  var ex = isInt(t), s = ex ? String(Math.round(t)) : (Math.round(t * 10) / 10).toFixed(1);
  if (pad) { var parts = s.split("."); while (parts[0].length < 3) parts[0] = "0" + parts[0]; s = parts.join("."); }
  return (ex ? "" : "≈ ") + s + "°";
}
function quadTxt(B){
  if (isInt(B)) B = Math.round(B) % 360;
  var due = { 0:"due north", 90:"due east", 180:"due south", 270:"due west" };
  if (isInt(B) && due[B]) return due[B];
  if (B < 90) return "N " + degTxt(B) + " E";
  if (B < 180) return "S " + degTxt(180 - B) + " E";
  if (B < 270) return "S " + degTxt(B - 180) + " W";
  return "N " + degTxt(360 - B) + " W";
}
function cmpVec(a, b, c, d){   // v = (a, b) against u = (c, d)
  if (a === c && b === d) return "eq";
  if (a === -c && b === -d) return "neg";
  if ((a || b) && (c || d) && Math.abs(a * d - b * c) < 1e-9) return a * c + b * d > 0 ? "same" : "opp";
  return "none";
}

// =====================================================================================================================
// @component V3 vectorBoard — the 2D vector board on K21 graph paper (MCV4U Ch 6–7: 33 Explore and task; 34, 35, 38 can reuse).
//   vecArrow(ctx, plot, x1, y1, x2, y2, {color, width, head, alpha, dash, tailDot}) draws a directed segment with a filled head
//   (data units in, pixels out); vecHead(ctx, X, Y, ux, uy, size, color) draws a lone head at pixel (X, Y) pointing along (ux, uy).
//   compassRose(ctx, plot, x, y, {R, brg, ang, gap}) draws N/E/S/W at a tail (R in px; 64 px across on phones), the bearing arc
//   from north clockwise (--hi, thin) and the angle arc from the positive x-axis counterclockwise (--ink-2, thin), each with a
//   small arrowhead; gap draws a thick --hi arc from north counterclockwise by gap° (used to show N 60° W from 300°).
//   BOARD_VIEW / BOARD_TICKS: −10 to 10 on both axes, grid every unit, labels on even numbers.
// =====================================================================================================================
var BOARD_VIEW = { xmin:-10.8, xmax:10.8, ymin:-10.8, ymax:10.8 };
var BOARD_TICKS = { step:1, fmt:function(t){ return Math.round(t) % 2 ? "" : num(t); } };
function vecHead(ctx, X, Y, ux, uy, hl, col){
  var hw = hl * 0.45, bx = X - ux * hl, by = Y - uy * hl;
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(bx - uy * hw, by + ux * hw); ctx.lineTo(bx + uy * hw, by - ux * hw); ctx.closePath(); ctx.fill();
}
function vecArrow(ctx, p, x1, y1, x2, y2, o){
  o = o || {};
  var X1 = p.X(x1), Y1 = p.Y(y1), X2 = p.X(x2), Y2 = p.Y(y2), L = Math.hypot(X2 - X1, Y2 - Y1), col = o.color || css("--pen"), w = o.width || 3;
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
  if (o.tailDot !== false) { ctx.beginPath(); ctx.arc(X1, Y1, w + 1, 0, 2 * Math.PI); ctx.fill(); }
  if (L < 2) { ctx.restore(); return; }
  var ux = (X2 - X1) / L, uy = (Y2 - Y1) / L, hl = Math.min(o.head || (10 + w * 1.4), L * 0.6);
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(X1, Y1); ctx.lineTo(X2 - ux * hl * 0.9, Y2 - uy * hl * 0.9); ctx.stroke(); ctx.setLineDash([]);
  if (!o.noHead) vecHead(ctx, X2, Y2, ux, uy, hl, col);
  ctx.restore();
}
function arcHead(ctx, cx, cy, r, e, cw, col){
  var tx = cw ? -Math.sin(e) : Math.sin(e), ty = cw ? Math.cos(e) : -Math.cos(e);
  vecHead(ctx, cx + r * Math.cos(e), cy + r * Math.sin(e), tx, ty, 7, col);
}
function compassRose(ctx, p, x, y, o){
  var cx = p.X(x), cy = p.Y(y), R = o.R || 40, D = Math.PI / 180, ink = css("--ink"), i2 = css("--ink-2"), hi = css("--hi");
  ctx.save();
  ctx.strokeStyle = i2; ctx.lineWidth = 1; ctx.globalAlpha = 0.75; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
  ctx.setLineDash([]); ctx.globalAlpha = 1;
  ctx.font = ui(11, 700); ctx.textAlign = "center"; ctx.textBaseline = "middle";
  [["N", 0, -1], ["E", 1, 0], ["S", 0, 1], ["W", -1, 0]].forEach(function(q){
    var lx = cx + q[1] * (R + 8), ly = cy + q[2] * (R + 8);
    ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(lx - 6, ly - 7, 12, 14); ctx.globalAlpha = 1;
    ctx.fillStyle = ink; ctx.fillText(q[0], lx, ly);
  });
  if (o.brg != null && o.brg > 0.5) {
    var rb = R * 0.68, e = -Math.PI / 2 + o.brg * D;
    ctx.strokeStyle = hi; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(cx, cy, rb, -Math.PI / 2, e, false); ctx.stroke();
    arcHead(ctx, cx, cy, rb, e, true, hi);
  }
  if (o.ang != null && o.ang > 0.5) {
    var ra = R * 0.46, e2 = -o.ang * D;
    ctx.strokeStyle = i2; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(cx, cy, ra, 0, e2, true); ctx.stroke();
    arcHead(ctx, cx, cy, ra, e2, false, i2);
  }
  if (o.gap != null && o.gap > 0.5) {
    var rg = R * 0.86, e3 = -Math.PI / 2 - o.gap * D;
    ctx.strokeStyle = hi; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, rg, -Math.PI / 2, e3, true); ctx.stroke();
  }
  ctx.restore();
}
// a label next to a point, pushed along (ux, uy) (data orientation, y up): ahead of a tip or behind a tail
function lblAt(p, x, y, text, ux, uy, sgn, col){
  var dx = sgn * ux * 17, dy = -sgn * uy * 17, al = dx > 5 ? "left" : dx < -5 ? "right" : "center";
  if (al === "center") dy += dy >= 0 ? 5 : -5;
  p.label({ x:x, y:y, text:text, dx:dx, dy:dy, align:al, bg:true, font:ui(12), color:col || css("--ink") });
}

// =====================================================================================================================
// @component compassDial — an SVG dial for a true bearing (000°–355° in steps of 5°; a drag snaps to a multiple of 15° when
// within 4°). role="slider": arrow keys turn 5°, Page Up/Down 15°, Home 000°. o = {label, value, onChange(v), disabled()}.
// Needle --pen, bearing arc --hi (clockwise from N). Returns {set(v), get(), el}.
// =====================================================================================================================
function compassDial(host, o){
  var val = o.value || 0, down = false, t = "";
  for (var a = 0; a < 360; a += 15) {
    var big = a % 90 === 0, r1 = big ? 40 : 44, s = Math.sin(a * Math.PI / 180), c = Math.cos(a * Math.PI / 180);
    t += '<line class="vc-dtick" x1="' + (60 + r1 * s).toFixed(1) + '" y1="' + (60 - r1 * c).toFixed(1) + '" x2="' + (60 + 49 * s).toFixed(1) + '" y2="' + (60 - 49 * c).toFixed(1) + '"/>';
  }
  host.innerHTML = '<svg class="vc-dial" viewBox="0 0 120 120" role="slider" tabindex="0" aria-label="' + MV.esc(o.label) + '" aria-valuemin="0" aria-valuemax="355">' +
    '<circle class="vc-dface" cx="60" cy="60" r="50"/>' + t +
    '<text class="vc-dl" x="60" y="23">N</text><text class="vc-dl" x="97" y="61">E</text><text class="vc-dl" x="60" y="99">S</text><text class="vc-dl" x="23" y="61">W</text>' +
    '<path class="vc-darc" d=""/><line class="vc-dneedle" x1="60" y1="60" x2="60" y2="20"/><circle class="vc-dhub" cx="60" cy="60" r="4"/></svg>';
  var svg = $("svg", host), arc = $(".vc-darc", host), nd = $(".vc-dneedle", host);
  function paint(){
    var r = val * Math.PI / 180, s = Math.sin(r), c = Math.cos(r);
    nd.setAttribute("x2", (60 + 36 * s).toFixed(1)); nd.setAttribute("y2", (60 - 36 * c).toFixed(1));
    arc.setAttribute("d", val ? "M60 30A30 30 0 " + (val > 180 ? 1 : 0) + " 1 " + (60 + 30 * s).toFixed(2) + " " + (60 - 30 * c).toFixed(2) : "");
    var b = String(val); while (b.length < 3) b = "0" + b;
    svg.setAttribute("aria-valuenow", val); svg.setAttribute("aria-valuetext", "true bearing " + b + " degrees");
    svg.setAttribute("aria-disabled", o.disabled && o.disabled() ? "true" : "false");
  }
  function set(v){ v = mod360(Math.round(v / 5) * 5); if (v === val) return; val = v; paint(); if (o.onChange) o.onChange(val); }
  svg.addEventListener("keydown", function(e){
    if (o.disabled && o.disabled()) return;
    var d = { ArrowRight:5, ArrowUp:5, ArrowLeft:-5, ArrowDown:-5, PageUp:15, PageDown:-15 }[e.key];
    if (e.key === "Home") { e.preventDefault(); set(0); return; }
    if (d == null) return;
    e.preventDefault(); set(val + d);
  });
  function fromEv(e){
    var r = svg.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    if (Math.hypot(x, y) < 6) return;
    var a = mod360(Math.atan2(x, -y) * 180 / Math.PI), n15 = Math.round(a / 15) * 15;
    set(Math.abs(a - n15) <= 4 ? n15 : Math.round(a / 5) * 5);
  }
  svg.addEventListener("pointerdown", function(e){ if (o.disabled && o.disabled()) return; down = true; try { svg.setPointerCapture(e.pointerId); } catch (err) {} svg.focus({ preventScroll:true }); e.preventDefault(); fromEv(e); });
  svg.addEventListener("pointermove", function(e){ if (down) fromEv(e); });
  svg.addEventListener("pointerup", function(){ down = false; }); svg.addEventListener("pointercancel", function(){ down = false; });
  paint();
  return { set:function(v){ val = mod360(v); paint(); }, get:function(){ return val; }, el:svg, sync:paint };
}

// ---------- Hero: a distance alone gives a circle; a bearing picks one place ----------
function hero(f){
  var c = f.canvas; if (!c) return;
  var p = new MV.Plot(c, { xmin:-7, xmax:7, ymin:-7, ymax:7 }, { equal:true });
  var B = 37, TIP = [5 * Math.sin(B * Math.PI / 180), 5 * Math.cos(B * Math.PI / 180)];
  var st = { r:0, needle:null, arrow:0, fade:1, cap:"" };
  var CAP1 = "5 km from start: anywhere on this circle", CAP2 = "5 km at bearing 037°: one exact place";
  function draw(){
    p.draw({ view:{ xmin:-7, xmax:7, ymin:-7, ymax:7 }, axes:false, ticks:false, xTicks:{ step:1 }, yTicks:{ step:1 },
      describe:st.arrow >= 1 ? "Map grid: an arrow 5 km long from Start at true bearing 037° ends at one point on the faded circle." : st.r > 0 ? "Map grid: a dashed circle of radius 5 around Start. Every point on it is 5 km from Start." : "Map grid with a point labelled Start.",
      after:function(ctx, pl){
        var cx = pl.X(0), cy = pl.Y(0), u = pl.X(1) - pl.X(0);
        if (st.r > 0) { ctx.save(); ctx.globalAlpha = st.fade; ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 2; ctx.setLineDash([7, 6]); ctx.beginPath(); ctx.arc(cx, cy, st.r * u, 0, 2 * Math.PI); ctx.stroke(); ctx.restore(); }
        if (st.needle != null) {
          compassRose(ctx, pl, 0, 0, { R:Math.min(46, u * 1.7), brg:st.needle });
          var nr = st.needle * Math.PI / 180, nl = Math.min(46, u * 1.7) * 0.95;
          if (st.arrow <= 0) { ctx.save(); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + nl * Math.sin(nr), cy - nl * Math.cos(nr)); ctx.stroke(); ctx.restore(); }
        }
        if (st.arrow > 0) vecArrow(ctx, pl, 0, 0, TIP[0] * st.arrow, TIP[1] * st.arrow, { color:css("--pen"), width:3.4 });
        pl.point({ x:0, y:0, r:5, color:css("--ink") });
        pl.label({ x:0, y:0, text:"Start", dx:-10, dy:14, align:"right", bg:true, font:ui(13) });
        if (st.arrow >= 1) { pl.point({ x:TIP[0], y:TIP[1], r:6, color:css("--pen") }); pl.label({ x:TIP[0], y:TIP[1], text:"037°, 5 km", dx:10, dy:-12, align:"left", bg:true, font:ui(13) }); }
      } });
    if (f.cap) f.cap.textContent = st.cap;
  }
  p.render = draw;
  function finish(){ st.r = 5; st.needle = B; st.arrow = 1; st.fade = 0.3; st.cap = CAP2; draw(); }
  if (MV.reduceMotion) { finish(); return; }
  draw();
  MV.wait(500, function(){
    st.cap = CAP1;
    MV.tween({ dur:1400, step:function(t){ st.r = 5 * t; draw(); }, done:function(){
      MV.wait(1100, function(){
        MV.tween({ dur:1100, step:function(t){ st.needle = B * t; draw(); }, done:function(){
          MV.tween({ dur:1000, step:function(t){ st.arrow = t; draw(); }, done:function(){
            MV.tween({ dur:800, step:function(t){ st.fade = 1 - 0.7 * t; draw(); }, done:finish });
          } });
        } });
      });
    } });
  });
}

// ---------- Explore: Arrow builder ----------
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function okPt(a){ return Array.isArray(a) && a.length === 2 && a.every(function(z){ return Number.isInteger(z) && z >= -10 && z <= 10; }); }
  function refOf(id){ return C.refs.filter(function(r){ return r.id === id; })[0]; }
  if (["draw", "compare", "compass"].indexOf(S.mode) < 0) S.mode = "draw";
  if (["bearing", "angle", "both"].indexOf(S.show) < 0) S.show = "bearing";
  if (!S.d || !okPt(S.d.t) || !okPt(S.d.h)) S.d = { t:[-1, -2], h:[2, 2], tn:"A", hn:"B" };
  if (S.d.tn !== "A" && S.d.tn !== "B") S.d.tn = "A";
  S.d.hn = S.d.tn === "A" ? "B" : "A";
  if (!S.c || !okPt(S.c.t) || !okPt(S.c.h)) S.c = { ref:"r1", t:[2, -3], h:[5, 1] };
  if (!refOf(S.c.ref)) S.c.ref = "r1";
  if (!S.k || !(S.k.mag >= 1 && S.k.mag <= 10) || !(S.k.brg >= 0 && S.k.brg < 360) || S.k.brg % 5) S.k = { mag:5, brg:60 };
  S.hide = !!S.hide;
  if (S.chip && !C.tc3chips.some(function(q){ return q.id === S.chip; })) S.chip = null;
  var busy = false, sel = "h", mark = null, fx = {}, anim = null, note = "";

  host.innerHTML = '<div class="vc-ex"><div class="vc-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot square" id="vc-cv" role="img" aria-label="Vector board"></canvas></div></div>' +
    '<div class="vc-side"><div class="seg-wrap" id="vc-mode"></div><div class="seg-wrap" id="vc-show"></div><p class="tiny muted vc-how" id="vc-how"></p>' +
    '<div id="vc-cmp" hidden><p class="tiny vc-lab">Reference ' + m("vec{u}") + '</p><div class="chips" id="vc-refs" role="group" aria-label="Reference vector u"></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="vc-slide" data-k="vcslide">' + C.slideBtn + '</button><button type="button" class="btn ghost sm" id="vc-rev" data-k="vcrev">' + C.revBtn + "</button></div></div>" +
    '<div id="vc-cps" hidden><label class="slider"><span class="slider-top"><span>Magnitude</span><output id="vc-magout"></output></span>' +
      '<input type="range" id="vc-mag" min="1" max="10" step="1" style="accent-color:var(--ink)" aria-label="Magnitude (1 to 10)"></label>' +
      '<div class="vc-dialrow"><div class="vc-dialbox" id="vc-dial"></div><p class="vc-dialout"><span class="tiny">True bearing</span><output id="vc-brgout"></output></p></div></div>' +
    '<p class="tiny vc-note" id="vc-note" aria-live="polite"></p><dl class="read vc-read" id="vc-read" aria-live="polite"></dl>' +
    '<div id="vc-tc3"><button type="button" class="btn ghost sm" id="vc-hide" data-k="vchide" aria-pressed="false">' + C.hideBtn + '</button>' +
      '<div id="vc-chipbox" hidden><p class="tiny">' + C.hidden + '</p><div class="chips" id="vc-chips" role="group" aria-label="Quadrant bearing for challenge 3"></div></div></div></div></div>';

  var P = new MV.Plot($("#vc-cv", host), BOARD_VIEW, { equal:true });
  P.render = draw;
  var dial = compassDial($("#vc-dial", host), { label:"True bearing", value:S.k.brg, disabled:function(){ return busy; },
    onChange:function(v){ S.k.brg = v; mark = null; changed(); } });

  // ---- the current vector ----
  function ref(){ return refOf(S.c.ref).v; }
  function cur(){
    if (S.mode === "draw") return { t:S.d.t, h:S.d.h, name:S.d.tn + S.d.hn, tn:S.d.tn, hn:S.d.hn };
    if (S.mode === "compare") return { t:S.c.t, h:S.c.h, name:"v", tn:"", hn:"" };
    var r = S.k.brg * Math.PI / 180;
    return { t:[0, 0], h:[S.k.mag * Math.sin(r), S.k.mag * Math.cos(r)], name:"OP", tn:"O", hn:"P", compass:true };
  }
  function rr(v){ return [v.h[0] - v.t[0], v.h[1] - v.t[1]]; }
  function dirOf(v){
    if (v.compass) return { B:S.k.brg, A:mod360(90 - S.k.brg) };
    var d = rr(v); if (!d[0] && !d[1]) return null;
    return { B:brgOf(d[0], d[1]), A:angOf(d[0], d[1]) };
  }
  function vName(v){ return "vec{" + v.name + "}"; }
  function plainName(v){ return v.name === "v" ? "v" : v.name; }
  function magOf(v){ return v.compass ? String(S.k.mag) : magSrc(rr(v)[0], rr(v)[1]); }
  function cmpKey(){ var d = rr(cur()), R = ref(); return cmpVec(d[0], d[1], R[2] - R[0], R[3] - R[1]); }

  // ---- drawing ----
  function roseR(){ return narrow() ? 32 : 42; }
  function draw(){
    var v = cur(), d = rr(v), D = dirOf(v), pen = css("--pen"), ink = css("--ink"), i2 = css("--ink-2");
    P.draw({ view:BOARD_VIEW, equal:true, xTicks:BOARD_TICKS, yTicks:BOARD_TICKS, describe:describe(), after:function(ctx, p){
      var L = Math.hypot(d[0], d[1]), ux = L ? d[0] / L : 0, uy = L ? d[1] / L : 1;
      if (S.mode === "compare") {
        var R = ref(), rl = Math.hypot(R[2] - R[0], R[3] - R[1]), rx = (R[2] - R[0]) / rl, ry = (R[3] - R[1]) / rl;
        vecArrow(ctx, p, R[0], R[1], R[2], R[3], { color:css("--f3"), width:3.4 });
        p.label({ x:(R[0] + R[2]) / 2, y:(R[1] + R[3]) / 2, text:"u⃗", dx:-ry * 16, dy:-rx * 16, align:"center", bg:true, font:"italic 600 15px " + (css("--font-math") || "serif"), color:css("--f3") });
      }
      if (S.mode === "draw" && fx.rev == null && d[0] && d[1]) {
        ctx.save(); ctx.strokeStyle = i2; ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.moveTo(p.X(v.t[0]), p.Y(v.t[1])); ctx.lineTo(p.X(v.h[0]), p.Y(v.t[1])); ctx.lineTo(p.X(v.h[0]), p.Y(v.h[1])); ctx.stroke(); ctx.restore();
        p.label({ x:(v.t[0] + v.h[0]) / 2, y:v.t[1], text:"run " + num(d[0]), dy:d[1] > 0 ? 13 : -13, align:"center", bg:true, font:ui(12), color:i2 });
        p.label({ x:v.h[0], y:(v.t[1] + v.h[1]) / 2, text:"rise " + num(d[1]), dx:d[0] > 0 ? 7 : -7, align:d[0] > 0 ? "left" : "right", bg:true, font:ui(12), color:i2 });
      }
      if (fx.rev == null) compassRose(ctx, p, v.t[0], v.t[1], { R:roseR(), brg:D && S.show !== "angle" ? D.B : null,
        ang:fx.ang != null ? fx.ang : D && S.show !== "bearing" ? D.A : null, gap:fx.gap });
      if (fx.rev != null) {
        vecArrow(ctx, p, v.t[0], v.t[1], v.h[0], v.h[1], { color:pen, width:3.2, noHead:true, tailDot:false });
        var f = fx.rev, X = p.X(v.h[0] + (v.t[0] - v.h[0]) * f), Y = p.Y(v.h[1] + (v.t[1] - v.h[1]) * f), Lp = Math.hypot(p.X(v.t[0]) - p.X(v.h[0]), p.Y(v.t[1]) - p.Y(v.h[1]));
        ctx.save(); vecHead(ctx, X, Y, (p.X(v.t[0]) - p.X(v.h[0])) / Lp, (p.Y(v.t[1]) - p.Y(v.h[1])) / Lp, 15, pen); ctx.restore();
      } else vecArrow(ctx, p, v.t[0], v.t[1], v.h[0], v.h[1], { color:pen, width:3.2 });
      if (!busy && S.mode !== "compass") {
        var sp = sel === "t" ? v.t : v.h; ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(p.X(sp[0]), p.Y(sp[1]), 11, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
      }
      if (S.mode === "compass") p.point({ x:v.h[0], y:v.h[1], r:5, color:pen });
      // labels
      if (S.mode === "draw") {
        var lt = fx.rev != null ? null : v;
        if (lt) { lblAt(p, v.t[0], v.t[1], v.tn + pt(v.t), ux, uy, -1); lblAt(p, v.h[0], v.h[1], v.hn + pt(v.h), ux, uy, 1); }
      } else if (S.mode === "compare") {
        lblAt(p, v.t[0], v.t[1], pt(v.t), ux, uy, -1); lblAt(p, v.h[0], v.h[1], "v⃗ " + pt(v.h), ux, uy, 1, pen);
      } else {
        lblAt(p, 0, 0, "O", ux, uy, -1); lblAt(p, v.h[0], v.h[1], "P", ux, uy, 1);
      }
      if (mark) p.label({ x:mark.x, y:mark.y, text:mark.text, dx:mark.dx || 0, dy:mark.dy || -18, align:mark.align || "center", bg:true, font:ui(13, 700), color:ink });
    } });
  }
  function describe(){
    var v = cur(), d = rr(v), D = dirOf(v), s = "";
    if (S.mode === "compare") { var R = ref(); s = "Reference vector u from " + MV.plain(pt([R[0], R[1]])) + " to " + MV.plain(pt([R[2], R[3]])) + ". "; }
    s += "Vector " + plainName(v) + " from " + MV.plain(pt(v.t)) + " to " + (v.compass ? "its tip P" : MV.plain(pt(v.h)));
    if (!D) return s + ": the zero vector, with no direction.";
    s += ": magnitude " + MV.plain(m(magOf(v))) + ", true bearing " + (isInt(D.B) ? "" : "about ") + degTxt(D.B, true).replace("≈ ", "") + ".";
    if (S.mode === "compare") s += " Compared with u: " + MV.plain(C.cmp[cmpKey()]) + ".";
    if (S.mode === "draw" && d[0] && d[1]) s += " Run " + num(d[0]) + ", rise " + num(d[1]) + ".";
    return s;
  }

  // ---- readout and side panel ----
  function paintRead(){
    var el = $("#vc-read", host), v = cur(), R = C.rows;
    if (S.mode === "draw" && S.hide) { el.innerHTML = MV.readoutHTML([[R.name, m(vName(v))]]); return; }
    var d = rr(v), D = dirOf(v), rows = [[R.name, m(vName(v))]];
    rows.push([R.rr, v.compass ? magRR(d[0]) + ", " + magRR(d[1]) : num(d[0]) + ", " + num(d[1])]);
    rows.push([R.mag, m("|" + vName(v) + "| = " + magOf(v))]);
    if (!D) rows.push([R.ang, "none: the zero vector has no direction"]);
    else rows.push([R.ang, degTxt(D.A)], [R.brg, degTxt(D.B, true)], [R.quad, quadTxt(D.B)]);
    if (S.mode === "compare") rows.push([R.cmp, C.cmp[cmpKey()]]);
    el.innerHTML = MV.readoutHTML(rows);
  }
  function magRR(x){ var r = Math.round(x * 100) / 100; return (isInt(x * 100) || Math.abs(x - r) < 1e-9 ? "" : "≈ ") + num(r, 2); }
  function paintSide(){
    MV.keepFocus($("#vc-mode", host), function(){ $("#vc-mode", host).innerHTML = '<span class="tiny vc-lab">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    MV.keepFocus($("#vc-show", host), function(){ $("#vc-show", host).innerHTML = '<span class="tiny vc-lab">Show</span>' + segBtns("show", C.shows, S.show, "Show arcs"); });
    $("#vc-how", host).innerHTML = C.how[S.mode];
    $("#vc-cmp", host).hidden = S.mode !== "compare";
    $("#vc-cps", host).hidden = S.mode !== "compass";
    $("#vc-tc3", host).hidden = S.mode !== "draw";
    MV.keepFocus($("#vc-refs", host), function(){
      $("#vc-refs", host).innerHTML = C.refs.map(function(r){ var on = r.id === S.c.ref; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-ref="' + r.id + '" data-k="ref' + r.id + '" aria-pressed="' + on + '">' + r.t + "</button>"; }).join("");
    });
    var hb = $("#vc-hide", host); hb.setAttribute("aria-pressed", String(S.hide)); hb.classList.toggle("on", S.hide);
    $("#vc-chipbox", host).hidden = !S.hide;
    MV.keepFocus($("#vc-chips", host), function(){
      $("#vc-chips", host).innerHTML = C.tc3chips.map(function(q){ var on = q.id === S.chip; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-chip="' + q.id + '" data-k="tc3' + q.id + '" aria-pressed="' + on + '">' + q.t + "</button>"; }).join("");
    });
    $("#vc-mag", host).value = S.k.mag; $("#vc-magout", host).textContent = num(S.k.mag);
    dial.set(S.k.brg); $("#vc-brgout", host).textContent = degTxt(S.k.brg, true);
    $("#vc-note", host).textContent = note;
    lock();
  }
  function lock(){ $$(".vc-side button, .vc-side input", host).forEach(function(b){ b.disabled = busy; }); dial.sync(); }
  function paintAll(){ paintSide(); paintRead(); draw(); }
  function changed(){ note = ""; api.save(); $("#vc-note", host).textContent = ""; $("#vc-magout", host).textContent = num(S.k.mag); $("#vc-brgout", host).textContent = degTxt(S.k.brg, true); paintRead(); draw(); MV.changed(); }

  // ---- dragging, tap-to-place, keys ----
  function setPt(id, x, y){
    if (S.mode === "compass") {
      var dd = Math.hypot(x, y); if (dd < 0.3) return;
      var a = mod360(Math.atan2(x, y) * 180 / Math.PI), n15 = Math.round(a / 15) * 15;
      S.k.brg = mod360(Math.abs(a - n15) <= 4 ? n15 : Math.round(a / 5) * 5); S.k.mag = clamp(Math.round(dd), 1, 10); dial.set(S.k.brg);
    } else {
      x = clamp(Math.round(x), -10, 10); y = clamp(Math.round(y), -10, 10);
      var o = S.mode === "draw" ? S.d : S.c; o[id] = [x, y];
    }
    mark = null; changed();
  }
  var drag = MV.drag(P, {
    handles:function(){
      var v = cur();
      if (S.mode === "compass") return [{ id:"h", x:v.h[0], y:v.h[1], label:"Tip P: magnitude " + S.k.mag + ", true bearing " + degTxt(S.k.brg, true) + ". Left and right arrows turn 5°, Page Up and Page Down 15°, up and down change the magnitude." }];
      var nt = S.mode === "draw" ? v.tn : "v", tl = S.mode === "draw" ? "Point " + v.tn + " (tail)" : "Tail of v", hl = S.mode === "draw" ? "Point " + v.hn + " (tip)" : "Tip of v";
      return [{ id:"t", x:v.t[0], y:v.t[1], label:tl + " at " + MV.plain(pt(v.t)) + ". Arrow keys move it 1; Shift + arrow moves 5." },
        { id:"h", x:v.h[0], y:v.h[1], label:hl + " at " + MV.plain(pt(v.h)) + " (" + nt + "). Arrow keys move it 1; Shift + arrow moves 5." }];
    },
    snap:function(x, y){ return S.mode === "compass" ? [x, y] : [clamp(Math.round(x), -10, 10), clamp(Math.round(y), -10, 10)]; },
    step:{ x:1, y:1 }, big:5,
    key:function(id, e){
      if (busy) return true;
      if (S.mode !== "compass") return false;
      var db = { ArrowRight:5, ArrowLeft:-5, PageUp:15, PageDown:-15 }[e.key], dm = { ArrowUp:1, ArrowDown:-1 }[e.key];
      if (db == null && dm == null) return false;
      if (db != null) { S.k.brg = mod360(S.k.brg + db); dial.set(S.k.brg); } else S.k.mag = clamp(S.k.mag + dm, 1, 10);
      mark = null; changed(); return true;
    },
    move:function(id, x, y){ if (busy) return; sel = id; setPt(id, x, y); }
  });
  var nearDown = false;
  function nearHandle(e){
    var r = P.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, v = cur();
    return [v.t, v.h].some(function(q){ return Math.hypot(P.X(q[0]) - px, P.Y(q[1]) - py) < 26; });
  }
  P.c.addEventListener("pointerdown", function(e){ nearDown = nearHandle(e); });
  P.c.addEventListener("click", function(e){
    if (busy || nearDown) return;
    var r = P.c.getBoundingClientRect(), x = P.xOf(e.clientX - r.left), y = P.yOf(e.clientY - r.top);
    if (S.mode === "compass") sel = "h";
    setPt(sel, x, y); drag.focus(sel);
  });
  P.c.parentNode.addEventListener("focusin", function(e){ var h = e.target.dataset && e.target.dataset.h; if (h && h !== sel) { sel = h; draw(); } });

  // ---- buttons ----
  function swap(){
    if (S.mode === "draw") { var t = S.d.t; S.d.t = S.d.h; S.d.h = t; var n = S.d.tn; S.d.tn = S.d.hn; S.d.hn = n; }
    else if (S.mode === "compare") { var t2 = S.c.t; S.c.t = S.c.h; S.c.h = t2; }
  }
  function reverse(dur, cb){
    busy = true; lock(); fx.rev = 0;
    anim = MV.tween({ dur:dur, step:function(t){ fx.rev = t; draw(); }, done:function(){ anim = null; fx.rev = null; swap(); if (cb) cb(); else { busy = false; paintAll(); api.save(); MV.changed(); } } });
  }
  function slide(dur, cb){
    var R = ref(), t0 = S.c.t.slice(), h0 = S.c.h.slice(), dx = R[0] - t0[0], dy = R[1] - t0[1], h1 = [h0[0] + dx, h0[1] + dy];
    if (!okPt(h1)) { note = "Sliding would push the tip of v off the grid. Move v first."; paintSide(); if (cb) cb(); return; }
    busy = true; lock();
    anim = MV.tween({ dur:dur, step:function(t){ S.c.t = [t0[0] + dx * t, t0[1] + dy * t]; S.c.h = [h0[0] + dx * t, h0[1] + dy * t]; draw(); },
      done:function(){ anim = null; S.c.t = [R[0], R[1]]; S.c.h = h1; if (cb) cb(); else { busy = false; paintAll(); api.save(); MV.changed(); } } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.classList.contains("drag-h") || busy) return;
    if (b.dataset.mode) { S.mode = b.dataset.mode; mark = null; fx = {}; if (S.mode === "compass") sel = "h"; }
    else if (b.dataset.show) { S.show = b.dataset.show; }
    else if (b.dataset.ref) { S.c.ref = b.dataset.ref; mark = null; }
    else if (b.dataset.chip) { S.chip = b.dataset.chip; }
    else if (b.id === "vc-hide") { S.hide = !S.hide; }
    else if (b.id === "vc-slide") { mark = null; slide(1300, null); return; }
    else if (b.id === "vc-rev") { mark = null; reverse(900, null); return; }
    else return;
    note = ""; api.save(); paintAll(); MV.changed();
  });
  $("#vc-mag", host).addEventListener("input", function(e){ if (busy) return; S.k.mag = clamp(+e.target.value, 1, 10); mark = null; changed(); });
  if (window.matchMedia) { var mq = window.matchMedia("(max-width: 560px)"); var onMq = function(){ draw(); }; if (mq.addEventListener) mq.addEventListener("change", onMq); else if (mq.addListener) mq.addListener(onMq); }
  paintAll();

  // ---- predictions ----
  var START = {
    p1:function(){ S.mode = "compare"; S.c = { ref:"r1", t:[2, -3], h:[5, 1] }; S.show = "bearing"; },
    p2:function(){ S.mode = "draw"; S.d = { t:[1, 1], h:[4, 5], tn:"A", hn:"B" }; S.show = "bearing"; S.hide = false; },
    p3:function(){ S.mode = "compass"; S.k = { mag:6, brg:300 }; S.show = "bearing"; },
    p4:function(){ S.mode = "compass"; S.k = { mag:6, brg:135 }; S.show = "both"; }
  };
  function sweep(key, to, dur, cb){
    fx[key] = 0;
    anim = MV.tween({ dur:dur, step:function(t){ fx[key] = to * t; draw(); }, done:function(){ anim = null; fx[key] = key === "gap" ? to : null; cb(); } });
  }

  // ---- challenges ----
  function chal(id){
    var M = MS[id], v = cur(), d = rr(v), r = d[0], s = d[1], n = r * r + s * s;
    function is(a, b){ return r === a && s === b; }
    if (id === "tc1") {
      if (S.mode !== "compare") return { ok:false, msg:M.mode };
      if (S.c.ref !== "r2") return { ok:false, msg:md(M.ref) };
      var t = S.c.t, h = S.c.h;
      if (t[0] !== -3 || t[1] !== 2) return { ok:false, msg:md(M.tail) };
      if (h[0] === 1 && h[1] === -1) return { ok:true };
      if (h[0] === -7 && h[1] === 5) return { ok:false, msg:md(M.neg) };
      if (h[0] === 4 && h[1] === -3) return { ok:false, msg:md(M.copy) };
      if (h[0] === 1 && h[1] === 5) return { ok:false, msg:md(M.rise) };
      return { ok:false, msg:md(tpl(M.other, { r:num(r), s:num(s) })) };
    }
    if (id === "tc2") {
      if (S.mode !== "draw") return { ok:false, msg:M.mode };
      if (is(5, 12) || is(12, 5)) return { ok:true };
      if (is(12, -5) || is(5, -12)) return { ok:false, msg:M.se };
      if (is(-5, 12) || is(-12, 5)) return { ok:false, msg:M.nw };
      if (n === 169) {
        if (!r || !s) return { ok:false, msg:tpl(M.due, { d:!r ? (s > 0 ? "north" : "south") : (r > 0 ? "east" : "west") }) };
        if (r < 0 && s < 0) return { ok:false, msg:M.sw };
      }
      return { ok:false, msg:tpl(M.mag, { m:magTxt(r, s) }) };
    }
    if (id === "tc3") {
      if (S.mode !== "draw") return { ok:false, msg:M.mode };
      if (is(-6, -8)) {
        if (!S.hide || !S.chip) return { ok:false, msg:M.chip };
        if (S.chip === "c1") return { ok:true };
        return { ok:false, msg:M[S.chip] || M.chip };
      }
      if (is(-8, -6)) return { ok:false, msg:M.west };
      if (is(6, -8)) return { ok:false, msg:M.se };
      if (is(-7, -7)) return { ok:false, msg:md(M.diag) };
      if (n !== 100) return { ok:false, msg:tpl(M.mag, { m:magTxt(r, s) }) };
      if (!(r < 0 && s < 0)) return { ok:false, msg:M.quad };
      return { ok:false, msg:M.near };
    }
    return { ok:false };
  }

  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        fx = {}; mark = null; note = ""; busy = true;
        if (START[p.id]) START[p.id]();
        api.save(); paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; api.save(); paintAll(); MV.changed(); done(); }
        function hold(mk, ms){ mark = mk; draw(); MV.wait(ms || 900, fin); }
        if (p.id === "p1") slide(1500, function(){ paintRead(); hold({ x:1.5, y:2, text:"They match: v⃗ = u⃗", dx:14, dy:-6, align:"left" }); });
        else if (p.id === "p2") reverse(1100, function(){ paintRead(); hold({ x:2.5, y:3, text:"BA⃗ = −AB⃗", dx:-14, dy:-4, align:"right" }); });
        else if (p.id === "p3") sweep("gap", 60, 1300, function(){ paintRead(); hold({ x:0, y:0, text:"60° from north, toward west", dx:0, dy:-(roseR() + 26) }); });
        else if (p.id === "p4") sweep("ang", 315, 1900, function(){ paintRead(); hold({ x:0, y:0, text:"angle 315° (or −45°)", dx:0, dy:roseR() + 30 }); });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Scalar or vector? ----------
function part3(host, api){
  var S = api.S, C = api.content, A = C.st1, B = C.st2;
  if (!(S.b2 >= 0 && S.b2 < 360) || S.b2 % 5) S.b2 = 60;
  S.dir = !!S.dir;
  host.innerHTML = '<div class="vc-st"><h4>' + A.title + '</h4><div id="vc-sort"></div></div>' +
    '<div class="vc-st"><h4>' + B.title + "</h4><p>" + B.text + "</p>" +
    '<div class="vc-p3"><div class="vc-p3g"><div class="plot-wrap"><canvas class="plot square" id="vc-cv2" role="img" aria-label="Trailhead map"></canvas></div></div>' +
    '<div class="vc-p3s"><p class="vc-cap2" id="vc-cap2" aria-live="polite"></p>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="vc-add" data-k="vcadd" aria-pressed="false">' + B.addBtn + "</button></div>" +
    '<div class="vc-dialrow" id="vc-d2row" hidden><div class="vc-dialbox" id="vc-dial2"></div><p class="vc-dialout"><span class="tiny">' + B.dialLabel + '</span><output id="vc-b2out"></output></p></div></div></div>' +
    '<details class="alg"><summary>' + B.algTitle + "</summary><div>" + B.alg.map(function(l){ return "<p>" + l + "</p>"; }).join("") + "</div></details>" +
    '<ul class="vc-real">' + B.real.map(function(l){ return "<li>" + l + "</li>"; }).join("") + "</ul></div>";
  MV.activityTypes.sorter($("#vc-sort", host), { id:"sv-sort", noun:A.noun, boxes:A.boxes, items:A.items, txt:true });
  var P = new MV.Plot($("#vc-cv2", host), { xmin:-8.5, xmax:8.5, ymin:-8.5, ymax:8.5 }, { equal:true });
  var TK = { step:1, fmt:function(t){ return Math.round(t) % 2 ? "" : num(t); } };
  function tip(){ var r = S.b2 * Math.PI / 180; return [6 * Math.sin(r), 6 * Math.cos(r)]; }
  function b3(){ return degTxt(S.b2, true); }
  function draw(){
    var T = tip();
    P.draw({ view:{ xmin:-8.5, xmax:8.5, ymin:-8.5, ymax:8.5 }, equal:true, xTicks:TK, yTicks:TK,
      describe:S.dir ? "Map in km: the dashed circle of radius 6 around the trailhead has faded; an arrow 6 km long at bearing " + b3() + " ends at the one point (" + MV.plain(magPt(T)) + ")." : "Map in km: a dashed circle of radius 6 around the trailhead. Every point on it is 6 km away.",
      after:function(ctx, p){
        var u = p.X(1) - p.X(0);
        ctx.save(); ctx.globalAlpha = S.dir ? 0.35 : 1; ctx.strokeStyle = css("--pen"); ctx.lineWidth = 2.4; ctx.setLineDash([7, 6]);
        ctx.beginPath(); ctx.arc(p.X(0), p.Y(0), 6 * u, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
        if (S.dir) {
          compassRose(ctx, p, 0, 0, { R:narrow() ? 32 : 40, brg:S.b2 });
          vecArrow(ctx, p, 0, 0, T[0], T[1], { color:css("--pen"), width:3.2 });
          p.point({ x:T[0], y:T[1], r:7, color:css("--pen") });
          var right = T[0] >= 0;
          p.label({ x:T[0], y:T[1], text:magPt(T), dx:right ? 12 : -12, dy:T[1] > 5 ? 16 : -14, align:right ? "left" : "right", bg:true, font:ui(12), color:css("--ink") });
        }
        p.point({ x:0, y:0, r:5, color:css("--ink") });
        p.label({ x:0, y:0, text:"Trailhead", dx:0, dy:S.dir && S.b2 > 90 && S.b2 < 270 ? -16 : 18, align:"center", bg:true, font:ui(12), color:css("--ink") });
      } });
    $("#vc-cap2", host).innerHTML = S.dir ? tpl(B.one, { b:b3() }) : B.circle;
    $("#vc-b2out", host).textContent = b3();
  }
  function magPt(T){
    function c(v){ var r = Math.round(v * 10) / 10; return (Math.abs(v - r) < 1e-9 ? "" : "≈ ") + num(Math.abs(r) < 1e-9 ? 0 : r, 1); }
    return "(" + c(T[0]) + ", " + c(T[1]) + ")";
  }
  P.render = draw;
  var dial = compassDial($("#vc-dial2", host), { label:B.dialLabel, value:S.b2, onChange:function(v){ S.b2 = v; api.save(); draw(); } });
  function paint(){ var b = $("#vc-add", host); b.setAttribute("aria-pressed", String(S.dir)); b.hidden = S.dir; $("#vc-d2row", host).hidden = !S.dir; dial.set(S.b2); draw(); }
  $("#vc-add", host).addEventListener("click", function(){ S.dir = true; api.save(); paint(); dial.el.focus(); });
  paint();
  return {};
}

// ---------- Practice 2: Directions three ways (number entry with a degree box, or chips) ----------
function dirsAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:"", tries:0, hint:0, solved:false, first:null, pick:null }); }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it, i){
    return '<div class="q vc-dq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="vc-din"></div><div class="vc-dcl"></div></div>';
  }).join("");
  function item(id){ return a.items.filter(function(z){ return z.id === id; })[0]; }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .vc-din', host);
    MV.keepFocus(el, function(){
      if (it.chips) el.innerHTML = '<div class="chips" role="group" aria-label="Choose the quadrant bearing">' + it.choices.map(function(c, k){
        var on = x.pick === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-ch="' + k + '" data-k="' + it.id + "c" + k + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
      else el.innerHTML = '<label class="vc-deg"><span>' + it.label + '</span><input class="numin short" data-bx="v" data-k="' + it.id + 'v" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(it.label + " in degrees") + '" value="' + MV.esc(x.v || "") + '"' + (x.solved ? " disabled" : "") + '><span aria-hidden="true">°</span></label>';
    });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .vc-dcl', host), h = "";
    if (!x.solved) {
      h += '<div class="q-actions">' + (it.chips ? "" : '<button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>') + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    } else {
      var shown = it.chips ? it.choices[x.pick].t + ". " + md(it.choices[x.pick].fb || "") : MV.ans(it) + "°.";
      h += MV.fbHTML("good", "<strong>✓ Correct: " + shown + "</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    }
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judgeNum(it){
    var x = ist(it.id), t = String(x.v || "").replace(/°/g, "").replace(/deg(rees)?/i, "").trim();
    if (!t) return { err:"Type your answer first." };
    var p = MV.parseNum(t); if (!p || p.length !== 1 || !isFinite(p[0])) return { err:"Type a number of degrees, such as 150." };
    var v = p[0], ans = MV.ans(it);
    if (Math.abs(v - ans) < 1e-9) return { ok:true };
    var w = (it.wrong || []).filter(function(z){ return Math.abs(z.v - v) < 1e-9; })[0];
    return { ok:false, msg:w ? w.fb : a.wrongDefault };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; ist(t.closest("[data-q]").dataset.q).v = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = item(q.dataset.q), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.ch != null) {
      var k = +b.dataset.ch, ch = it.choices[k]; x.pick = k;
      if (MV.ok(ch)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + md(ch.fb) + " Try again." }; }
      api.save(); paintIn(it); paintCl(it); MV.focusFb(q); return;
    }
    if (b.dataset.act !== "check") return;
    var r = judgeNum(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + md(r.msg) + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Turn left 90° (three vectors from the origin on the V3 board) ----------
var task = (function(){
  var api, P = null, drag = null, K = ["ux", "uy", "vx", "vy", "wx", "wy"], N = ["u", "v", "w"], COL = { u:"--pen", v:"--f3", w:"--f5" };
  function g(k){ var s = api ? api.S : {}, t = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -10 && v <= 10 ? v : null; }
  function read(){ var d = {}; K.forEach(function(k){ d[k] = g(k); }); d.valid = K.every(function(k){ return d[k] !== null; }); return d; }
  function desc(d, n){
    var x = d[n + "x"], y = d[n + "y"]; if (x === null || y === null) return "not set";
    if (!x && !y) return "(0, 0): the zero vector";
    return pt([x, y]) + ": magnitude " + m(magSrc(x, y)) + ", true bearing " + degTxt(brgOf(x, y), true);
  }
  function draw(){
    if (!P) return;
    var d = read();
    P.draw({ view:BOARD_VIEW, equal:true, xTicks:BOARD_TICKS, yTicks:BOARD_TICKS,
      describe:N.map(function(n){ return "Vector " + n + " from the origin to " + MV.plain(desc(d, n)); }).join(". ") + ".",
      after:function(ctx, p){
        N.forEach(function(n){
          var x = d[n + "x"], y = d[n + "y"]; if (x === null || y === null) return;
          vecArrow(ctx, p, 0, 0, x, y, { color:css(COL[n]), width:n === "u" ? 3.4 : 2.8 });
          var L = Math.hypot(x, y) || 1;
          lblAt(p, x, y, n + "⃗", x / L, y / L, 1, css(COL[n]));
        });
      } });
  }
  function readout(){
    var el = $("#vc-tread"); if (!el) return;
    var d = read();
    el.innerHTML = MV.readoutHTML(N.map(function(n){ return ['<span style="color:var(' + COL[n] + ')">' + m("vec{" + n + "}") + "</span>", desc(d, n)]; }));
  }
  function stepper(k, lab){
    return '<div class="vc-tstep"><label for="vc-t' + k + '" class="tiny">' + lab + '</label>' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="vct' + k + 'm" aria-label="Decrease ' + k[0] + " " + lab + '">' + MV.MINUS + "</button>" +
      '<input class="numin short" id="vc-t' + k + '" data-tk="' + k + '" type="number" min="-10" max="10" step="1" autocomplete="off">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="vct' + k + 'p" aria-label="Increase ' + k[0] + " " + lab + '">+</button></div>';
  }
  function syncInputs(){ K.forEach(function(k){ var el = $("#vc-t" + k); if (el && document.activeElement !== el) el.value = api.S[k]; }); }
  function refresh(){ api.save(); draw(); readout(); api.update(); }
  return {
    render:function(inp, pv, a){
      api = a;
      if (a.S.ux == null) { a.S.ux = "2"; a.S.uy = "-1"; a.S.vx = "-1"; a.S.vy = "2"; a.S.wx = "1"; a.S.wy = "2"; }
      inp.innerHTML = N.map(function(n){ return '<div class="vc-trow"><span class="vc-tname" style="color:var(' + COL[n] + ')">' + m("vec{" + n + "}") + "</span>" + stepper(n + "x", "run") + stepper(n + "y", "rise") + "</div>"; }).join("");
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot square" id="vc-tcv" role="img" aria-label="Your three vectors"></canvas></div><dl class="read" id="vc-tread" aria-live="polite" style="margin-top:10px"></dl>';
      P = new MV.Plot($("#vc-tcv", pv), BOARD_VIEW, { equal:true }); P.render = draw;
      drag = MV.drag(P, {
        handles:function(){ var d = read(); return N.filter(function(n){ return d[n + "x"] !== null && d[n + "y"] !== null; }).map(function(n){ return { id:n, x:d[n + "x"], y:d[n + "y"], label:"Tip of " + n + " at " + MV.plain(pt([d[n + "x"], d[n + "y"]])) + ". Arrow keys move it 1; Shift + arrow moves 5." }; }); },
        snap:function(x, y){ return [clamp(Math.round(x), -10, 10), clamp(Math.round(y), -10, 10)]; },
        step:{ x:1, y:1 }, big:5,
        move:function(id, x, y){ a.S[id + "x"] = String(x); a.S[id + "y"] = String(y); syncInputs(); refresh(); }
      });
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; refresh(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10);
        if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -10, 10)); $("#vc-t" + k).value = a.S[k];
        refresh();
      });
      syncInputs(); draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers from −10 to 10 for every run and rise."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      var s = Math.hypot(d.ux, d.uy);
      return [isInt(s) && s >= 5 - 1e-9 && s <= 10 + 1e-9, d.ux > 0 && d.uy < 0, d.vx === -d.ux && d.vy === -d.uy, d.wx === -d.uy && d.wy === d.ux];
    },
    key:function(d){ return K.map(function(k){ return d[k]; }).join("|"); },
    label:function(k){ var p = k.split("|").map(Number); return pt([p[0], p[1]]) + "; " + pt([p[2], p[3]]) + "; " + pt([p[4], p[5]]); },
    text:function(k){ var p = k.split("|").map(Number); return MV.plain(pt([p[0], p[1]]) + "; " + pt([p[2], p[3]]) + "; " + pt([p[4], p[5]])); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ dirs:dirsAct },
  task:task
});
})();
