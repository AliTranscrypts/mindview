// MCV4U 41 Vectors as Forces: hero (three 8 N ropes on a ring slide tip to tail into a closed triangle; one is cut and the
// resultant appears), Force table (Explore: V3 2D vector board with a force-table skin: ring, angle rim, tip-to-tail chain,
// resultant / equilibrant / components modes, pin and drift, challenge set-ups), Forces on a ramp (Part 3: rotating split of a
// weight on a ramp with the "Why is the angle θ here?" animation, and a sled pulled at an angle) and the "Hang the weight" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var D2R = Math.PI / 180, R3 = Math.sqrt(3);
function m(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, a){ return String(s).replace(/#(\d)/g, function(_, k){ return a[k - 1] != null ? a[k - 1] : "#" + k; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic 600 " + (px || 15) + "px " + (css("--font-math") || "serif"); }
// fixed decimals with a true minus
function fx(v, dp){ var s = (Math.abs(v) < 0.5 * Math.pow(10, -dp) ? 0 : v).toFixed(dp); return s.replace("-", MINUS); }
function normA(a){ a = a % 360; if (a < 0) a += 360; return a; }
function between(a, b){ var d = normA(a - b); return Math.min(d, 360 - d); }
function bgText(ctx, text, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(text).width, bx = align === "center" ? X - w / 2 : align === "right" ? X - w : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88 * (ctx.globalAlpha || 1); ctx.fillRect(bx - 4, Y - 11, w + 8, 22); ctx.restore();
  ctx.save(); ctx.font = font || ui(13); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  ctx.fillStyle = color || css("--ink"); ctx.fillText(text, X, Y); ctx.restore();
}
// arrow in pixel coordinates (dashed shaft allowed, solid head)
function arrowPx(ctx, x1, y1, x2, y2, col, w, dash, head){
  var L = Math.hypot(x2 - x1, y2 - y1); if (L < 1.5) return;
  var a = Math.atan2(y2 - y1, x2 - x1), s = Math.min(head || (8 + 1.6 * (w || 2)), L * 0.6);
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w || 2; ctx.lineCap = "round";
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - s * 0.8 * Math.cos(a), y2 - s * 0.8 * Math.sin(a)); ctx.stroke();
  ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - s * Math.cos(a - 0.4), y2 - s * Math.sin(a - 0.4)); ctx.lineTo(x2 - s * Math.cos(a + 0.4), y2 - s * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function lineW(ctx, p, x1, y1, x2, y2, col, w, dash){
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1.5; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(p.X(x1), p.Y(y1)); ctx.lineTo(p.X(x2), p.Y(y2)); ctx.stroke(); ctx.restore();
}
function arrowW(ctx, p, x1, y1, x2, y2, col, w, dash){ arrowPx(ctx, p.X(x1), p.Y(y1), p.X(x2), p.Y(y2), col, w, dash); }
// a vector name for canvas labels: letter with a small arrow over it, then a subscript and extra text ("F₁ = 8 N")
function vecLabel(ctx, X, Y, letter, rest, color, align){
  ctx.save(); var f1 = mfont(15), f2 = ui(13, 700);
  ctx.font = f1; var w1 = ctx.measureText(letter).width; ctx.font = f2; var w2 = ctx.measureText(rest).width, W = w1 + w2 + 2;
  var x0 = align === "right" ? X - W : align === "center" ? X - W / 2 : X;
  ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.88 * ctx.globalAlpha; ctx.fillRect(x0 - 4, Y - 14, W + 8, 26); ctx.restore();
  ctx.save(); ctx.fillStyle = color; ctx.strokeStyle = color; ctx.textBaseline = "middle"; ctx.textAlign = "left";
  ctx.font = f1; ctx.fillText(letter, x0, Y + 1); ctx.font = f2; ctx.fillText(rest, x0 + w1 + 2, Y + 2);
  var ay = Y - 10; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x0 + 1, ay); ctx.lineTo(x0 + w1 + 1, ay); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x0 + w1 + 2, ay); ctx.lineTo(x0 + w1 - 2, ay - 2.6); ctx.lineTo(x0 + w1 - 2, ay + 2.6); ctx.closePath(); ctx.fill();
  ctx.restore();
}
var SUB = ["₁", "₂", "₃"];

// =====================================================================================================================
// @component vecExact — exact components of forces at multiples of 30° and 45°: a value is (p + q√2 + r√3)/2 stored as the
// integer array [p, q, r]; sums stay exact; src() gives m() source ("4 + 4√3", "5√3/2"); surd(N) simplifies √N ("8√2").
var EX = (function(){
  var C = [[0, 0, 0], [1, 0, 0], [-1, 0, 0], [2, 0, 0], [-2, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  function val(e){ return (e[0] + e[1] * Math.SQRT2 + e[2] * R3) / 2; }
  function trig(v){ for (var i = 0; i < C.length; i++) if (Math.abs(val(C[i]) - v) < 1e-9) return C[i]; return null; }
  function ofForce(mag, deg){
    deg = normA(Math.round(deg * 1e6) / 1e6);
    if (deg % 30 && deg % 45) return null;
    var c = trig(Math.cos(deg * D2R)), s = trig(Math.sin(deg * D2R)); if (!c || !s) return null;
    return { x:c.map(function(k){ return k * mag; }), y:s.map(function(k){ return k * mag; }) };
  }
  function add(a, b){ return a.map(function(k, i){ return k + b[i]; }); }
  function term(k, r){
    var rad = r > 1 ? "√" + r : "";
    if (k % 2 === 0) { var n = k / 2; return (n === 1 && rad ? "" : String(n)) + rad; }
    return (k === 1 && rad ? "" : String(k)) + rad + "/2";
  }
  function src(e){
    var out = "", rs = [1, 2, 3];
    for (var i = 0; i < 3; i++) { var k = e[i]; if (!k) continue; var t = term(Math.abs(k), rs[i]); out += out ? (k < 0 ? " - " : " + ") + t : (k < 0 ? "-" : "") + t; }
    return out || "0";
  }
  function surd(N){
    var s = 1; for (var k = Math.floor(Math.sqrt(N)); k > 1; k--) if (N % (k * k) === 0) { s = k; break; }
    var r = N / (s * s); return r === 1 ? String(s) : (s === 1 ? "" : String(s)) + "√" + r;
  }
  return { val:val, ofForce:ofForce, add:add, src:src, surd:surd };
})();
function comps(F){ return { x:F.m * Math.cos(F.a * D2R), y:F.m * Math.sin(F.a * D2R) }; }
// magnitude text: exact when |v|² is a whole number ("8 N", "10√2 N ≈ 14.1 N"), else "≈ 10.6 N"
function magHTML(x, y, unit){
  unit = unit == null ? " N" : unit;
  var N2 = x * x + y * y, n = Math.round(N2), mag = Math.sqrt(N2);
  if (Math.abs(N2 - n) < 1e-6) { var s = EX.surd(n); return m(s) + unit + (s.indexOf("√") >= 0 ? " ≈ " + fx(mag, 1) + unit : ""); }
  return "≈ " + fx(mag, 1) + unit;
}
function magPlain(x, y){ return MV.plain(magHTML(x, y)); }
function dirDeg(x, y){ var d = Math.atan2(y, x) / D2R; d = normA(d); if (Math.abs(d - 360) < 1e-7) d = 0; return d; }
function dirHTML(x, y){ var d = dirDeg(x, y), r = Math.round(d); return Math.abs(d - r) < 1e-6 ? num(r % 360) + "°" : "≈ " + fx(d, 1) + "°"; }
function angHTML(a){ var r = Math.round(a); return Math.abs(a - r) < 1e-6 ? num(normA(r)) + "°" : "≈ " + fx(a, 1) + "°"; }
// components of a list of forces: exact pair src or null
function sumExact(L){
  var sx = [0, 0, 0], sy = [0, 0, 0];
  for (var i = 0; i < L.length; i++) { var e = EX.ofForce(L[i].m, L[i].a); if (!e) return null; sx = EX.add(sx, e.x); sy = EX.add(sy, e.y); }
  return { x:sx, y:sy };
}
function pairHTML(L){
  var e = sumExact(L), x = 0, y = 0;
  L.forEach(function(F){ var c = comps(F); x += c.x; y += c.y; });
  if (e) return m("(" + EX.src(e.x) + ", " + EX.src(e.y) + ")");
  return "≈ " + m("(" + fx(x, 1).replace(MINUS, "-") + ", " + fx(y, 1).replace(MINUS, "-") + ")");
}
function compHTML(F, which){
  var e = EX.ofForce(F.m, F.a), c = comps(F);
  return e ? m(EX.src(e[which])) : "≈ " + fx(c[which], 1);
}

// =====================================================================================================================
// ---------- Hero ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var V = { xmin:-7.6, xmax:7.6, ymin:-3.6, ymax:3.6 }, HC = (MV.C.hero || {}).cap || {};
  var p = new MV.Plot(cv, V, { equal:true }), K = 2.6, st = { s:0, z:0, c:0, r:0 };
  var RG = [-4.2, -0.1], VV = [[K, 0], [K * Math.cos(120 * D2R), K * Math.sin(120 * D2R)], [K * Math.cos(240 * D2R), K * Math.sin(240 * D2R)]];
  var T0 = [1.9, -1.15], TT = [T0, [T0[0] + VV[0][0], T0[1]], [T0[0] + VV[0][0] + VV[1][0], T0[1] + VV[1][1]]];
  function draw(){
    var cols = [css("--pen"), css("--f3"), css("--f5")], ink = css("--ink"), ink2 = css("--ink-2");
    var jx = 0.55 * Math.cos(60 * D2R) * st.c, jy = 0.55 * Math.sin(60 * D2R) * st.c, rx = RG[0] + jx, ry = RG[1] + jy;
    p.draw({ view:V, equal:true, grid:false, axes:false,
      describe:st.r > 0.5 ? "A ring held by two 8 N ropes, at 0° and 120°, after the third rope was cut: it jerks toward the upper right, along the resultant 8 N at 60°. Beside it, the three forces drawn tip to tail close into an equilateral triangle: their sum is the zero vector."
        : "A ring pulled by three 8 N ropes at 0°, 120° and 240°. The ring sits still.",
      after:function(ctx){
        // ring's ropes
        for (var i = 0; i < 3; i++) {
          var al = i === 2 ? 1 - st.c : 1; if (al <= 0.01) continue;
          ctx.save(); ctx.globalAlpha = al; arrowW(ctx, p, rx, ry, rx + VV[i][0], ry + VV[i][1], cols[i], 3.2); ctx.restore();
        }
        if (st.c > 0 && st.c < 1) { ctx.save(); ctx.globalAlpha = 1 - st.c; bgText(ctx, "✂", p.X(rx + VV[2][0] * 0.5) + 10, p.Y(ry + VV[2][1] * 0.5), "left", cols[2], ui(16, 700)); ctx.restore(); }
        if (st.r > 0) {
          ctx.save(); ctx.globalAlpha = st.r; arrowW(ctx, p, rx, ry, rx + K * Math.cos(60 * D2R), ry + K * Math.sin(60 * D2R), ink, 4.4);
          vecLabel(ctx, p.X(rx + K * 0.5) + 16, p.Y(ry + K * 0.87) - 6, "R", " = 8 N at 60°", ink, "left"); ctx.restore();
        }
        // ring
        ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = ink; ctx.fillStyle = css("--sheet"); ctx.beginPath(); ctx.arc(p.X(rx), p.Y(ry), 9, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.restore();
        if (st.c < 0.5) for (var j = 0; j < 3; j++) vecLabel(ctx, p.X(rx + VV[j][0] * 1.08) + (j === 0 ? 6 : -6), p.Y(ry + VV[j][1] * 1.08) + (j === 0 ? -14 : 0), "F", SUB[j] + " 8 N", cols[j], j === 0 ? "left" : "right");
        // copies sliding tip to tail
        if (st.s > 0) for (var k = 0; k < 3; k++) {
          var tx = RG[0] + st.s * (TT[k][0] - RG[0]), ty = RG[1] + st.s * (TT[k][1] - RG[1]);
          arrowW(ctx, p, tx, ty, tx + VV[k][0], ty + VV[k][1], cols[k], 3.2);
        }
        if (st.z > 0) {
          ctx.save(); ctx.globalAlpha = st.z;
          ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(p.X(T0[0]), p.Y(T0[1]), 4.5, 0, 2 * Math.PI); ctx.fill();
          vecLabel(ctx, p.X(T0[0]) - 12, p.Y(T0[1]) + 18, "0", "  sum = zero vector", ink, "left");
          ctx.restore();
        }
      } });
    if (f.cap) f.cap.innerHTML = st.r > 0.5 ? HC.end : HC.start;
  }
  p.render = draw;
  function finalFrame(){ st = { s:1, z:1, c:1, r:1 }; draw(); }
  if (MV.reduceMotion) { finalFrame(); return; }
  draw();
  MV.wait(900, function(){
    MV.tween({ dur:1900, step:function(t){ st.s = t; draw(); }, done:function(){
      MV.tween({ dur:700, step:function(t){ st.z = t; draw(); }, done:function(){
        MV.wait(1100, function(){
          MV.tween({ dur:650, step:function(t){ st.c = t; draw(); }, done:function(){
            MV.tween({ dur:700, step:function(t){ st.r = t; draw(); }, done:finalFrame });
          } });
        });
      } });
    } });
  });
}

// =====================================================================================================================
// ---------- Explore: Force table ----------
// @component V3 vectorBoard (force-table skin; MCV4U 41) — an equal-scale board with a ring at the origin, an angle rim
// (15° ticks, 30° labels), up to three forces from the ring in --pen / --f3 / --f5, faint copies tip to tail, the resultant in
// --ink (thickest) or the equilibrant as an --ink dashed arrow that closes the chain, dashed x- and y-parts in Components mode,
// a pin with drift toward the net force, and exact readouts (vecExact). The view grows to fit the chain.
var ANG = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function okF(F){ return F && typeof F.m === "number" && F.m >= 0 && F.m <= 20 && typeof F.a === "number"; }
  if (!Array.isArray(S.f) || S.f.length !== 3 || !S.f.every(okF)) S.f = [{ m:8, a:0 }, { m:8, a:120 }, { m:8, a:240 }];
  S.f.forEach(function(F){ F.m = Math.round(F.m); F.a = normA(Math.round(F.a / 15) * 15); });
  S.on3 = !!S.on3;
  if (["res", "eq", "comp"].indexOf(S.mode) < 0) S.mode = "res";
  if (["free", "tc1", "tc2", "tc3"].indexOf(S.setup) < 0) S.setup = "free";
  if (typeof S.pin !== "boolean") S.pin = true;
  S.attach = !!S.attach;
  if (!(S.tab >= 0 && S.tab <= 2)) S.tab = 0;
  var busy = false, stop = null, dstop = null, A = { slide:1, hideR:false, hideE:false, hideRead:false, eA:1, rot:null, note:null };
  var ring = { x:0, y:0 };

  function locked(i){ return (S.setup === "tc1" && i < 2) || (S.setup === "tc3" && i === 0); }
  function L(){ return S.on3 ? S.f : S.f.slice(0, 2); }
  function R(){ var x = 0, y = 0; L().forEach(function(F){ var c = comps(F); x += c.x; y += c.y; }); return { x:x, y:y, mag:Math.hypot(x, y) }; }
  function net(){ var r = R(); if (S.mode === "eq" && S.attach && !A.hideE) return { x:0, y:0, mag:0 }; return r; }
  function hideMag(){ return S.setup === "tc3"; }

  var cols = function(){ return [css("--pen"), css("--f3"), css("--f5")]; };
  function forcePanel(i){
    var nm = T.forces[i], pcol = ["var(--pen)", "var(--f3)", "var(--f5)"][i];
    var h = '<div class="vf-fp" data-fp="' + i + '"><p class="vf-fh" style="--vf-c:' + pcol + '">' + nm + '<span class="vf-lock tiny muted" data-lk="' + i + '"></span></p>';
    if (i === 2) h += '<button type="button" class="chip vf-add" data-act="add3" data-k="vfadd3" aria-pressed="false">' + T.add3 + "</button>";
    h += '<div class="vf-fbody" data-fb="' + i + '">' +
      '<label class="slider vf-sl"><span class="slider-top"><span>' + T.mag + '</span><output data-mo="' + i + '"></output></span>' +
      '<input type="range" min="0" max="20" step="1" data-f="' + i + '" data-p="m" data-k="vfm' + i + '" style="accent-color:' + pcol + '" aria-label="' + MV.esc(MV.plain(nm)) + ' magnitude in newtons"></label>' +
      '<label class="slider vf-sl"><span class="slider-top"><span>' + T.dir + '</span><output data-ao="' + i + '"></output></span>' +
      '<input type="range" min="0" max="345" step="15" data-f="' + i + '" data-p="a" data-k="vfa' + i + '" style="accent-color:' + pcol + '" aria-label="' + MV.esc(MV.plain(nm)) + ' direction in degrees"></label>' +
      '<p class="tiny muted vf-note">' + T.dirNote + "</p>" +
      '<div class="chips vf-angs" role="radiogroup" aria-label="' + MV.esc(MV.plain(nm)) + ": " + T.angles + '">' + ANG.map(function(a){
        return '<button type="button" class="chip" role="radio" aria-checked="false" tabindex="-1" data-f="' + i + '" data-ang="' + a + '" data-k="vfc' + i + "_" + a + '">' + a + "°</button>"; }).join("") + "</div></div></div>";
    return h;
  }
  host.innerHTML = '<div class="vf-ex"><div class="vf-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot square vf-board" id="vf-board" role="img" aria-label="Force table"></canvas></div>' +
    '<p class="tiny muted vf-key" id="vf-key"></p><p class="vf-drift" id="vf-drift" aria-live="polite"></p></div>' +
    '<div class="vf-side"><div class="vf-tabs seg" role="group" aria-label="' + MV.esc(T.tabs) + '">' + [0, 1, 2].map(function(i){
      return '<button type="button" data-tab="' + i + '" data-k="vft' + i + '" aria-pressed="false">' + T.forces[i].replace(/^Force\s*/, "") + "</button>"; }).join("") + "</div>" +
    forcePanel(0) + forcePanel(1) + forcePanel(2) +
    '<div class="seg-wrap vf-seg"><span class="tiny" style="font-weight:700">' + T.mode + '</span><span class="seg" role="group" aria-label="Mode">' + C.modes.map(function(o){
      return '<button type="button" data-mode="' + o.id + '" data-k="vfmd' + o.id + '" aria-pressed="false">' + o.t + "</button>"; }).join("") + "</span></div>" +
    '<div class="q-actions vf-eqb" id="vf-eqb"><button type="button" class="btn sm" data-act="pin" data-k="vfpin"></button><button type="button" class="btn ghost sm" data-act="attach" data-k="vfatt"></button></div>' +
    '<div class="seg-wrap vf-seg"><span class="tiny" style="font-weight:700">' + T.setup + '</span><span class="seg vf-setseg" role="group" aria-label="Challenge set-up">' + C.setups.map(function(o){
      return '<button type="button" data-setup="' + o.id + '" data-k="vfsu' + o.id + '" aria-pressed="false">' + o.t + "</button>"; }).join("") + '</span></div><p class="tiny muted vf-note">' + T.setupNote + "</p>" +
    '<dl class="read vf-read" id="vf-read" aria-live="polite"></dl><p class="tiny muted vf-note">' + T.measured + '</p><div id="vf-tbl"></div></div></div>';
  var plot = new MV.Plot($("#vf-board", host), { xmin:-12, xmax:12, ymin:-12, ymax:12 }, { equal:true });

  // ---------- drawing ----------
  function chain(){
    var pts = [[ring.x, ring.y]], x = ring.x, y = ring.y;
    L().forEach(function(F){ var c = comps(F); x += c.x; y += c.y; pts.push([x, y]); });
    return pts;
  }
  function describe(){
    var parts = L().map(function(F, i){ return "F" + (i + 1) + " " + F.m + " N at " + MV.plain(angHTML(F.a)); }), r = R();
    var s = "Ring with forces " + parts.join(", ") + "; ";
    if (A.hideRead) return s + "the resultant is revealed after your prediction.";
    if (hideMag()) return s + "the resultant arrow is shown without its size (challenge 3).";
    s += r.mag < 0.05 ? "resultant zero: equilibrium." : "resultant " + magPlain(r.x, r.y) + " at " + MV.plain(dirHTML(r.x, r.y)) + ".";
    if (S.mode === "eq" && !A.hideE && r.mag >= 0.05) s += " Equilibrant " + magPlain(r.x, r.y) + " at " + MV.plain(angHTML(dirDeg(r.x, r.y) + 180)) + ", dashed.";
    if (S.mode === "eq" && !S.pin) s += " The pin is out.";
    return s;
  }
  function draw(){
    var pts = chain(), r = R(), ext = 6;
    pts.forEach(function(q){ ext = Math.max(ext, Math.abs(q[0]), Math.abs(q[1])); });
    L().forEach(function(F){ var c = comps(F); ext = Math.max(ext, Math.abs(ring.x + c.x), Math.abs(ring.y + c.y)); });
    var half = Math.max(10, Math.ceil(ext * 1.18 / 5) * 5), step = half <= 10 ? 2 : half <= 25 ? 5 : 10;
    var C3 = cols(), ink = css("--ink"), ink2 = css("--ink-2");
    plot.draw({ view:{ xmin:-half, xmax:half, ymin:-half, ymax:half }, equal:true, ticks:false, xTicks:{ step:step }, yTicks:{ step:step },
      describe:describe(),
      after:function(ctx, p){
        // angle rim
        var cx = p.X(0), cy = p.Y(0), rad = Math.min(p.X(half) - cx, cy - p.Y(half)) * 0.9;
        ctx.save(); ctx.strokeStyle = ink2; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 2 * Math.PI); ctx.stroke();
        for (var a = 0; a < 360; a += 15) { var big = a % 30 === 0, ca = Math.cos(a * D2R), sa = Math.sin(a * D2R); ctx.beginPath(); ctx.moveTo(cx + rad * ca, cy - rad * sa); ctx.lineTo(cx + (rad - (big ? 9 : 5)) * ca, cy - (rad - (big ? 9 : 5)) * sa); ctx.stroke(); }
        ctx.restore();
        ctx.save(); ctx.fillStyle = ink2; ctx.font = ui(11, 600); ctx.textAlign = "center"; ctx.textBaseline = "middle";
        for (a = 0; a < 360; a += 30) ctx.fillText(a + "°", cx + (rad - 20) * Math.cos(a * D2R), cy - (rad - 20) * Math.sin(a * D2R));
        ctx.restore();
        bgText(ctx, "grid: " + step + " N per square", 8, p.H - 14, "left", ink2, ui(11, 600));
        var Fs = L(), n = Fs.length, showR = !A.hideR && r.mag >= 0.05, i, c;
        // chain copies (Resultant and Equilibrant modes)
        if (S.mode !== "comp" && A.slide > 0) {
          for (i = 1; i < n; i++) {
            c = comps(Fs[i]);
            var tx = ring.x + A.slide * (pts[i][0] - ring.x), ty = ring.y + A.slide * (pts[i][1] - ring.y);
            ctx.save(); ctx.globalAlpha = 0.45; arrowW(ctx, p, tx, ty, tx + c.x, ty + c.y, C3[i], 2.6); ctx.restore();
          }
        }
        // components
        if (S.mode === "comp") for (i = 0; i < n; i++) {
          c = comps(Fs[i]);
          if (Math.abs(c.x) > 1e-9 && Math.abs(c.y) > 1e-9) {
            arrowW(ctx, p, ring.x, ring.y, ring.x + c.x, ring.y, C3[i], 2, [6, 5]); arrowW(ctx, p, ring.x + c.x, ring.y, ring.x + c.x, ring.y + c.y, C3[i], 2, [6, 5]);
          }
        }
        // forces from the ring
        for (i = 0; i < n; i++) { c = comps(Fs[i]); arrowW(ctx, p, ring.x, ring.y, ring.x + c.x, ring.y + c.y, C3[i], 3.2); }
        // resultant / equilibrant
        if (S.mode !== "eq" && showR && A.slide >= 1) arrowW(ctx, p, ring.x, ring.y, ring.x + r.x, ring.y + r.y, ink, 4.6);
        if (S.mode === "eq" && !A.hideE && r.mag >= 0.05) {
          ctx.save(); ctx.globalAlpha = A.eA;
          arrowW(ctx, p, ring.x, ring.y, ring.x - r.x, ring.y - r.y, ink, 3.4, [9, 6]);
          var e = pts[pts.length - 1]; arrowW(ctx, p, e[0], e[1], e[0] - r.x, e[1] - r.y, ink, 2.6, [9, 6]);
          ctx.restore();
        }
        // ring and pin
        ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = ink; ctx.fillStyle = css("--sheet"); ctx.beginPath(); ctx.arc(p.X(ring.x), p.Y(ring.y), 9, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
        if (S.mode === "eq" && S.pin) { ctx.fillStyle = ink2; ctx.beginPath(); ctx.arc(p.X(0), p.Y(0), 3.6, 0, 2 * Math.PI); ctx.fill(); }
        ctx.restore();
        // labels
        for (i = 0; i < n; i++) {
          c = comps(Fs[i]); if (Fs[i].m === 0) continue;
          var ux = c.x / Fs[i].m, uy = c.y / Fs[i].m, LX = p.X(ring.x + c.x) + ux * 16, LY = p.Y(ring.y + c.y) - uy * 16;
          vecLabel(ctx, LX, LY, "F", SUB[i] + " " + Fs[i].m + " N", C3[i], ux > 0.3 ? "left" : ux < -0.3 ? "right" : "center");
        }
        if (S.mode !== "eq" && showR && A.slide >= 1) {
          var rl = hideMag() || A.hideRead ? "" : " " + magPlain(r.x, r.y);
          vecLabel(ctx, p.X(ring.x + r.x) + (r.x >= 0 ? 14 : -14), p.Y(ring.y + r.y) + (r.y >= 0 ? -16 : 16), "R", rl, ink, r.x >= 0 ? "left" : "right");
        }
        if (S.mode === "eq" && !A.hideE && r.mag >= 0.05 && A.eA > 0.3)
          vecLabel(ctx, p.X(ring.x - r.x) + (-r.x >= 0 ? 14 : -14), p.Y(ring.y - r.y) + (-r.y >= 0 ? -16 : 16), "E", hideMag() ? "" : " " + magPlain(r.x, r.y), ink, -r.x >= 0 ? "left" : "right");
        if (A.note) bgText(ctx, A.note, p.W / 2, 16, "center", ink, ui(13, 700));
      } });
  }
  plot.render = draw;

  // ---------- controls and readouts ----------
  function paintCtl(){
    for (var i = 0; i < 3; i++) {
      var F = S.f[i], lk = locked(i), off = i === 2 && !S.on3, panel = $('[data-fp="' + i + '"]', host);
      panel.classList.toggle("on", S.tab === i);
      $('[data-fb="' + i + '"]', host).hidden = off;
      $('[data-lk="' + i + '"]', host).textContent = lk ? " · " + T.locked : "";
      $$("input", panel).forEach(function(el){ el.value = el.dataset.p === "m" ? F.m : Math.round(normA(F.a)); el.disabled = busy || lk;
        el.setAttribute("aria-valuetext", el.dataset.p === "m" ? F.m + " newtons" : MV.plain(angHTML(F.a))); });
      $('[data-mo="' + i + '"]', host).textContent = F.m + " N";
      $('[data-ao="' + i + '"]', host).textContent = MV.plain(angHTML(F.a));
      var chips = $$("[data-ang]", panel), any = false;
      chips.forEach(function(b){ var on = Math.abs(normA(F.a) - +b.dataset.ang) < 1e-6; any = any || on; b.classList.toggle("on", on); b.setAttribute("aria-checked", on ? "true" : "false"); b.tabIndex = on ? 0 : -1; b.disabled = busy || lk; });
      if (!any && chips[0]) chips[0].tabIndex = 0;
    }
    var add = $('[data-act="add3"]', host); add.setAttribute("aria-pressed", S.on3 ? "true" : "false"); add.classList.toggle("on", S.on3); add.disabled = busy || S.setup === "tc1";
    $$("[data-tab]", host).forEach(function(b){ b.setAttribute("aria-pressed", +b.dataset.tab === S.tab ? "true" : "false"); b.disabled = busy; });
    $$("[data-mode]", host).forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.mode === S.mode ? "true" : "false"); b.disabled = busy; });
    $$("[data-setup]", host).forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.setup === S.setup ? "true" : "false"); b.disabled = busy; });
    $("#vf-eqb", host).hidden = S.mode !== "eq";
    var pb = $('[data-act="pin"]', host), ab = $('[data-act="attach"]', host);
    pb.innerHTML = S.pin ? T.pinOut : T.pinIn; pb.disabled = busy;
    ab.innerHTML = S.attach ? T.detach : T.attach; ab.disabled = busy; ab.setAttribute("aria-pressed", S.attach ? "true" : "false");
    $("#vf-key", host).innerHTML = S.mode === "eq" ? T.keyEq : S.mode === "comp" ? T.keyComp : T.keyRes;
  }
  function paintRead(){
    var r = R(), rows = [], Fs = L(), Tr = T.rows, hid = A.hideRead;
    [0, 1, 2].forEach(function(i){
      var F = S.f[i];
      if (i === 2 && !S.on3) { rows.push([Tr.f3, '<span class="muted">' + T.off + "</span>"]); return; }
      rows.push([Tr["f" + (i + 1)], F.m + " N at " + angHTML(F.a) + " · " + pairHTML([F])]);
    });
    rows.push([Tr.between, S.f[0].m && S.f[1].m ? angHTML(between(S.f[0].a, S.f[1].a)) : "—"]);
    if (hid) { rows.push([Tr.res, "…"]); rows.push([Tr.eq, "…"]); rows.push([Tr.status, "…"]); }
    else if (hideMag()) { rows.push([Tr.res, '<span class="muted">' + T.hidden + "</span>"]); rows.push([Tr.eq, '<span class="muted">' + T.hidden + "</span>"]); rows.push([Tr.status, '<span class="muted">' + T.hidden + "</span>"]); }
    else {
      var zero = r.mag < 0.05;
      rows.push([Tr.res, zero ? m("vec{0}") : pairHTML(Fs) + " · " + magHTML(r.x, r.y) + " at " + dirHTML(r.x, r.y)]);
      rows.push([Tr.eq, zero ? T.noE : magHTML(r.x, r.y) + " at " + angHTML(dirDeg(r.x, r.y) + 180)]);
      rows.push([Tr.status, zero ? T.bal : tpl(T.notBal, [magHTML(r.x, r.y) + " at " + dirHTML(r.x, r.y)]) + (S.mode === "eq" && S.attach && !A.hideE ? "<br>" + T.held : "")]);
    }
    $("#vf-read", host).innerHTML = MV.readoutHTML(rows);
    var tb = $("#vf-tbl", host);
    if (S.mode === "comp" && !hid) {
      var trs = Fs.map(function(F, i){ return [Tr["f" + (i + 1)], compHTML(F, "x"), compHTML(F, "y")]; });
      var e = sumExact(Fs);
      trs.push([T.sumRow, hideMag() ? "…" : e ? m(EX.src(e.x)) : "≈ " + fx(r.x, 1), hideMag() ? "…" : e ? m(EX.src(e.y)) : "≈ " + fx(r.y, 1)]);
      tb.innerHTML = MV.tableHTML({ head:T.compHead, rows:trs, hiRow:trs.length - 1, caption:"Components of each force and their sums" });
    } else tb.innerHTML = "";
    var d = $("#vf-drift", host), nt = net();
    if (S.mode === "eq" && !S.pin && !A.hideE && !hid) d.innerHTML = nt.mag < 0.05 ? T.stays : tpl(MV.reduceMotion ? T.drift : T.driftMove, [dirHTML(nt.x, nt.y)]);
    else d.innerHTML = "";
  }
  function driftTarget(){
    if (S.mode !== "eq" || S.pin) return { x:0, y:0 };
    var n = net(); if (n.mag < 0.05) return { x:0, y:0 };
    var d = Math.min(0.35 * n.mag, 7); return { x:d * n.x / n.mag, y:d * n.y / n.mag };
  }
  function drift(cb){
    var t = driftTarget(), x0 = ring.x, y0 = ring.y;
    if (dstop) { dstop(); dstop = null; }
    if (Math.hypot(t.x - x0, t.y - y0) < 1e-6) { ring.x = t.x; ring.y = t.y; draw(); if (cb) cb(); return; }
    dstop = MV.tween({ dur:clamp(400 + 120 * Math.hypot(t.x - x0, t.y - y0), 400, 1400), step:function(k){ ring.x = x0 + (t.x - x0) * k; ring.y = y0 + (t.y - y0) * k; draw(); }, done:function(){ dstop = null; if (cb) cb(); } });
  }
  function paintAll(){ paintCtl(); paintRead(); draw(); }
  function changed(){ api.save(); paintAll(); drift(); MV.changed(); }
  ring = driftTarget();
  paintAll();

  // ---------- events ----------
  host.addEventListener("input", function(e){
    var t = e.target; if (busy || !t.dataset || t.dataset.f == null || !t.dataset.p) return;
    var i = +t.dataset.f; if (locked(i)) return;
    S.f[i][t.dataset.p] = t.dataset.p === "m" ? Math.round(+t.value) : normA(Math.round(+t.value / 15) * 15);
    changed();
  });
  function pickAng(b){ var i = +b.dataset.f; if (locked(i)) return; S.f[i].a = +b.dataset.ang; changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.ang != null) { pickAng(b); return; }
    if (b.dataset.tab != null) { S.tab = +b.dataset.tab; api.save(); paintCtl(); return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; changed(); return; }
    if (b.dataset.setup) { setup(b.dataset.setup); return; }
    var act = b.dataset.act;
    if (act === "add3") { S.on3 = !S.on3; if (S.on3) S.tab = 2; changed(); }
    else if (act === "pin") { S.pin = !S.pin; changed(); }
    else if (act === "attach") { S.attach = !S.attach; changed(); }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target; if (!b.dataset || b.dataset.ang == null) return;
    var k = e.key, d = k === "ArrowRight" || k === "ArrowDown" ? 1 : k === "ArrowLeft" || k === "ArrowUp" ? -1 : 0; if (!d) return;
    e.preventDefault();
    var all = $$('[data-ang][data-f="' + b.dataset.f + '"]', host), j = (all.indexOf(b) + d + all.length) % all.length;
    pickAng(all[j]); var nb = all[j]; if (nb && !nb.disabled) nb.focus();
  });
  function setup(id){
    S.setup = id; S.mode = "res";
    if (id === "tc1") { S.f[0] = { m:8, a:0 }; S.f[1] = { m:8, a:120 }; if (!S.on3) { S.on3 = true; S.f[2] = { m:0, a:0 }; } S.tab = 2; }
    else if (id === "tc2") { S.on3 = false; S.tab = 0; }
    else if (id === "tc3") { S.f[0] = { m:4, a:0 }; S.on3 = false; S.tab = 1; }
    changed();
  }

  // ---------- challenges ----------
  function is(F, mg, a){ return F.m === mg && Math.abs(normA(F.a) - a) < 1e-6; }
  function chal(id){
    var M = MS[id], F = S.f, r = R();
    if (id === "tc1") {
      if (!is(F[0], 8, 0) || !is(F[1], 8, 120)) return { ok:false, msg:M.setup };
      if (!S.on3) return { ok:false, msg:M.on3 };
      if (is(F[2], 8, 240)) return { ok:true };
      if (is(F[2], 8, 60)) return { ok:false, msg:M.res };
      if (is(F[2], 16, 240)) return { ok:false, msg:M.dbl };
      if (is(F[2], 8, 180) || is(F[2], 8, 300)) return { ok:false, msg:M.close };
      return { ok:false, msg:tpl(M.general, [magHTML(r.x, r.y) + " at " + dirHTML(r.x, r.y)]) };
    }
    if (id === "tc2") {
      if (S.on3) return { ok:false, msg:M.off3 };
      if (F[0].m !== 10 || F[1].m !== 10) return { ok:false, msg:M.mags };
      var d = between(F[0].a, F[1].a);
      if (Math.abs(d - 120) < 1e-6) return { ok:true };
      if (Math.abs(d - 60) < 1e-6) return { ok:false, msg:M.a60 };
      if (Math.abs(d - 90) < 1e-6) return { ok:false, msg:M.a90 };
      return { ok:false, msg:tpl(M.general, [magHTML(r.x, r.y)]) };
    }
    if (id === "tc3") {
      if (!is(F[0], 4, 0)) return { ok:false, msg:M.setup };
      if (S.on3) return { ok:false, msg:M.off3 };
      if (is(F[1], 8, 120)) return { ok:true };
      if (is(F[1], 8, 90)) return { ok:false, msg:M.a90 };
      if (is(F[1], 4, 120)) return { ok:false, msg:M.m4 };
      if (is(F[1], 7, 120)) return { ok:false, msg:M.m7 };
      return { ok:false, msg:M.general };
    }
    return { ok:false };
  }

  // ---------- predictions ----------
  function resetA(){ A = { slide:1, hideR:false, hideE:false, hideRead:false, eA:1, note:null }; }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        if (dstop) { dstop(); dstop = null; }
        busy = true; resetA(); S.setup = "free"; S.on3 = false; S.attach = false; S.pin = true; ring = { x:0, y:0 };
        if (p.id === "p1") { S.mode = "res"; S.f[0] = { m:6, a:0 }; S.f[1] = { m:8, a:90 }; A.slide = 0; A.hideR = true; A.hideRead = true; }
        else if (p.id === "p2") { S.mode = "res"; S.f[0] = { m:10, a:0 }; S.f[1] = { m:10, a:0 }; }
        else if (p.id === "p3") { S.mode = "res"; S.f[0] = { m:10, a:0 }; S.f[1] = { m:10, a:120 }; A.slide = 0; A.hideR = true; A.hideRead = true; }
        else { S.mode = "eq"; S.f[0] = { m:3, a:0 }; S.f[1] = { m:4, a:90 }; A.hideE = true; A.hideRead = true; }
        S.tab = 0; paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; resetA(); api.save(); paintAll(); drift(); MV.changed(); done(); }
        if (p.id === "p1" || p.id === "p3") {
          stop = MV.tween({ dur:1600, step:function(t){ A.slide = t; draw(); }, done:function(){
            stop = null; A.hideR = false; A.hideRead = false;
            A.note = p.id === "p1" ? "Right triangle: |R| = √(36 + 64) = 10 N" : "Equilateral triangle: |R| = 10 N";
            paintRead(); draw(); MV.wait(1300, fin);
          } });
        } else if (p.id === "p2") {
          stop = MV.tween({ dur:4200, ease:function(t){ return t; }, step:function(t){
            S.f[1].a = 180 * t; var r = R();
            A.note = "Angle between: " + Math.round(180 * t) + "°, |R| ≈ " + fx(r.mag, 1) + " N";
            paintRead(); draw();
          }, done:function(){ stop = null; S.f[1].a = 180; A.note = "At 180° the forces cancel: |R| = 0"; paintRead(); draw(); MV.wait(1300, fin); } });
        } else {
          A.hideE = false; A.hideRead = false; A.eA = 0;
          stop = MV.tween({ dur:900, step:function(t){ A.eA = t; draw(); }, done:function(){
            stop = null; A.eA = 1; S.attach = true; paintAll();
            MV.wait(700, function(){ S.pin = false; A.note = "Pin out: the ring stays put"; paintAll(); drift(function(){ MV.wait(1200, fin); }); });
          } });
        }
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Forces on a ramp ----------
// @component N13 rampSplit (MCV4U 41) — two stations: a block on a frictionless ramp whose weight (--ink) splits into a part
// along the slope (--pen) and into the slope (--f3), completed to a dashed rectangle, with the "Why is the angle θ here?"
// animation (a shaded copy of the ramp's angle slides and turns onto the angle between the weight and the line into the
// slope); and a sled pulled by a rope at angle α (tension --ink, horizontal --pen, vertical --f3). Exact readouts (vecExact).
function part3(host, api){
  var S = api.S, T = api.content.txt;
  if (["s1", "s2"].indexOf(S.st) < 0) S.st = "s1";
  if (!(S.th >= 0 && S.th <= 60 && S.th % 15 === 0)) S.th = 30;
  if (!(S.W >= 10 && S.W <= 100 && S.W % 10 === 0)) S.W = 40;
  if (!(S.al >= 0 && S.al <= 90 && S.al % 15 === 0)) S.al = 30;
  if (!(S.T >= 10 && S.T <= 100 && S.T % 10 === 0)) S.T = 50;
  var wedge = null, whyShown = false, stop = null;
  function sl(id, label, min, max, step, col){
    return '<label class="slider vr-sl"><span class="slider-top"><span>' + label + '</span><output id="vr-o' + id + '"></output></span><input type="range" id="vr-' + id + '" data-sl="' + id + '" data-k="vr' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:' + col + '" aria-label="' + MV.esc(MV.plain(label)) + '"></label>';
  }
  host.innerHTML = '<div class="seg-wrap vr-stseg"><span class="seg" role="group" aria-label="Station">' + T.stations.map(function(o){
      return '<button type="button" data-st="' + o.id + '" data-k="vrst' + o.id + '" aria-pressed="false">' + o.t + "</button>"; }).join("") + "</span></div>" +
    '<div class="vr-wrap"><div class="vr-main"><p class="vr-intro" id="vr-intro"></p><div class="plot-wrap"><canvas class="plot vr-cv" id="vr-cv" role="img" aria-label="Ramp"></canvas></div><p class="vr-note" id="vr-note" aria-live="polite"></p></div>' +
    '<div class="vr-side"><div id="vr-c1">' + sl("th", T.ramp, 0, 60, 15, "var(--ink)") +
    '<div class="chips vr-chips" role="group" aria-label="Ramp angle">' + [30, 45, 60].map(function(a){ return '<button type="button" class="chip" data-th="' + a + '" data-k="vrth' + a + '" aria-pressed="false">' + a + "°</button>"; }).join("") + "</div>" +
    sl("W", T.weight, 10, 100, 10, "var(--ink)") +
    '<div class="q-actions"><button type="button" class="btn sm" data-act="why" data-k="vrwhy">' + T.why + "</button></div></div>" +
    '<div id="vr-c2">' + sl("al", T.alpha, 0, 90, 15, "var(--ink)") + sl("T", T.tension, 10, 100, 10, "var(--ink)") + "</div>" +
    '<dl class="read vr-read" id="vr-read" aria-live="polite"></dl>' +
    '<details class="alg" id="vr-alg"><summary>' + T.alg + "</summary>" + T.algHTML + "</details></div></div>";
  var plot = new MV.Plot($("#vr-cv", host), { xmin:-1, xmax:13, ymin:-2, ymax:9 }, { equal:true });

  function exParts(F, deg){ // F cos(deg), F sin(deg) as html with ≈ where needed
    var e = EX.ofForce(F, deg), c = F * Math.cos(deg * D2R), s = F * Math.sin(deg * D2R);
    function one(k, v){ if (!e) return "≈ " + fx(v, 1) + " N"; var sr = EX.src(e[k]); return m(sr) + " N" + (sr.indexOf("√") >= 0 ? " ≈ " + fx(v, 1) + " N" : ""); }
    return { cos:one("x", c), sin:one("y", s), cv:c, sv:s };
  }
  function drawRamp(ctx, p){
    var th = S.th * D2R, W = S.W, ink = css("--ink"), pen = css("--pen"), f3 = css("--f3"), ink2 = css("--ink-2");
    var Lr = S.th === 0 ? 12 : Math.min(12, 9 / Math.tan(th)), H = Lr * Math.tan(th);
    var u = [Math.cos(th), Math.sin(th)], nOut = [-Math.sin(th), Math.cos(th)], b = 1.5;
    var P0 = [u[0] * Lr * 0.58, u[1] * Lr * 0.58], G = [P0[0] + nOut[0] * b / 2, P0[1] + nOut[1] * b / 2];
    // ramp
    ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(p.X(0), p.Y(0)); ctx.lineTo(p.X(Lr), p.Y(0)); ctx.lineTo(p.X(Lr), p.Y(H)); ctx.closePath(); ctx.fill(); ctx.stroke();
    lineW(ctx, p, -1, 0, Lr + 1.5, 0, ink2, 1.5);
    // block
    var q = [[P0[0] - u[0] * b / 2, P0[1] - u[1] * b / 2]]; q.push([q[0][0] + u[0] * b, q[0][1] + u[1] * b]); q.push([q[1][0] + nOut[0] * b, q[1][1] + nOut[1] * b]); q.push([q[0][0] + nOut[0] * b, q[0][1] + nOut[1] * b]);
    ctx.fillStyle = css("--sheet"); ctx.beginPath(); q.forEach(function(v, i){ if (i) ctx.lineTo(p.X(v[0]), p.Y(v[1])); else ctx.moveTo(p.X(v[0]), p.Y(v[1])); }); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    // forces (scaled)
    var k = (1.4 + 3.6 * W / 100) / W, Wv = [0, -W * k], al = W * Math.sin(th) * k, it = W * Math.cos(th) * k;
    var A1 = [G[0] - u[0] * al, G[1] - u[1] * al], I1 = [G[0] - nOut[0] * it, G[1] - nOut[1] * it], Wt = [G[0], G[1] + Wv[1]];
    if (al > 1e-6 && it > 1e-6) { lineW(ctx, p, A1[0], A1[1], Wt[0], Wt[1], ink2, 1.3, [4, 4]); lineW(ctx, p, I1[0], I1[1], Wt[0], Wt[1], ink2, 1.3, [4, 4]); }
    if (al > 1e-6) arrowW(ctx, p, G[0], G[1], A1[0], A1[1], pen, 3.2);
    if (it > 1e-6) arrowW(ctx, p, G[0], G[1], I1[0], I1[1], f3, 3.2);
    arrowW(ctx, p, G[0], G[1], Wt[0], Wt[1], ink, 3.6);
    ctx.save(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(p.X(G[0]), p.Y(G[1]), 3.5, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
    bgText(ctx, "W = " + W + " N", p.X(Wt[0]) + 8, p.Y(Wt[1]) + 14, "left", ink, ui(13, 700));
    if (al > 1e-6) bgText(ctx, "W sin θ", p.X(A1[0]) - 8, p.Y(A1[1]) - 12, "right", pen, ui(13, 700));
    if (it > 1e-6) bgText(ctx, "W cos θ", p.X(I1[0]) + 8, p.Y(I1[1]) + (S.th >= 45 ? -10 : 10), "left", f3, ui(13, 700));
    // angle arcs: at the ramp's foot and between W and the line into the slope
    function arc(cx, cy, r, a0, a1, fill){
      ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.fillStyle = css("--hi"); ctx.globalAlpha = fill ? 0.55 : 1;
      ctx.beginPath(); ctx.moveTo(p.X(cx), p.Y(cy)); var n = 20; for (var j = 0; j <= n; j++) { var a = a0 + (a1 - a0) * j / n; ctx.lineTo(p.X(cx + r * Math.cos(a)), p.Y(cy + r * Math.sin(a))); }
      ctx.closePath(); if (fill) ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
    }
    if (S.th > 0) {
      arc(0, 0, 1.6, 0, th, false); bgText(ctx, "θ", p.X(1.9 * Math.cos(th / 2)) + 2, p.Y(1.9 * Math.sin(th / 2)), "left", ink, mfont(15));
      if (whyShown || wedge) {
        var t = wedge ? wedge.t : 1, cx = G[0] * t, cy = G[1] * t, a0 = -Math.PI / 2 * t, r = 1.6 - 0.3 * t;
        arc(cx, cy, r, a0, a0 + th, true);
        if (t >= 1) bgText(ctx, "θ", p.X(G[0] + 1.75 * Math.cos(-Math.PI / 2 + th / 2)) + 3, p.Y(G[1] + 1.75 * Math.sin(-Math.PI / 2 + th / 2)), "left", ink, mfont(15));
      }
    }
    return { xmax:Lr + 1.5, ymax:Math.max(H, G[1]) + 1.2, ymin:Math.min(-0.8, Wt[1] - 1.2) };
  }
  function rampView(){
    var th = S.th * D2R, Lr = S.th === 0 ? 12 : Math.min(12, 9 / Math.tan(th)), H = Lr * Math.tan(th), b = 1.5;
    var Gy = Math.sin(th) * Lr * 0.58 + Math.cos(th) * b / 2, Wl = 1.4 + 3.6 * S.W / 100;
    return { xmin:-1.5, xmax:Lr + 2, ymin:Math.min(-1, Gy - Wl - 1.4), ymax:Math.max(H, Gy) + 1.5 };
  }
  function drawSled(ctx, p){
    var al = S.al * D2R, Tn = S.T, ink = css("--ink"), pen = css("--pen"), f3 = css("--f3"), ink2 = css("--ink-2");
    lineW(ctx, p, -4, 0, 9, 0, ink2, 1.6);
    ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(p.X(-3), p.Y(0.15)); ctx.lineTo(p.X(0), p.Y(0.15)); ctx.lineTo(p.X(0), p.Y(1.3)); ctx.lineTo(p.X(-3), p.Y(1.3)); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    var O = [0, 0.75], k = (1.4 + 4.6 * Tn / 100) / Tn, tx = Tn * Math.cos(al) * k, ty = Tn * Math.sin(al) * k;
    if (tx > 1e-6 && ty > 1e-6) { lineW(ctx, p, O[0] + tx, O[1], O[0] + tx, O[1] + ty, ink2, 1.3, [4, 4]); lineW(ctx, p, O[0], O[1] + ty, O[0] + tx, O[1] + ty, ink2, 1.3, [4, 4]); }
    if (tx > 1e-6) arrowW(ctx, p, O[0], O[1], O[0] + tx, O[1], pen, 3.2);
    if (ty > 1e-6) arrowW(ctx, p, O[0], O[1], O[0], O[1] + ty, f3, 3.2);
    arrowW(ctx, p, O[0], O[1], O[0] + tx, O[1] + ty, ink, 3.6);
    bgText(ctx, "T = " + Tn + " N", p.X(O[0] + tx) + 8, p.Y(O[1] + ty) - 12, "left", ink, ui(13, 700));
    if (tx > 1e-6) bgText(ctx, "T cos α", p.X(O[0] + tx / 2), p.Y(O[1]) + 16, "center", pen, ui(13, 700));
    if (ty > 1e-6) bgText(ctx, "T sin α", p.X(O[0]) - 8, p.Y(O[1] + ty / 2), "right", f3, ui(13, 700));
    if (S.al > 0 && S.al < 90) {
      ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(p.X(O[0]), p.Y(O[1]), 30, -al, 0); ctx.stroke(); ctx.restore();
      bgText(ctx, "α", p.X(O[0]) + 36 * Math.cos(al / 2) + 2, p.Y(O[1]) - 36 * Math.sin(al / 2), "left", ink, mfont(15));
    }
  }
  function draw(){
    if (S.st === "s1") {
      var th = S.th, W = S.W, E = exParts(W, th);
      plot.draw({ view:rampView(), equal:true, grid:false, axes:false,
        describe:"A block on a frictionless ramp at " + th + "°. Its weight, " + W + " N straight down, splits into " + MV.plain(E.sin) + " along the slope and " + MV.plain(E.cos) + " into the slope." + (whyShown && th > 0 ? " The angle between the weight and the line into the slope is also " + th + "°." : ""),
        after:function(ctx, p){ drawRamp(ctx, p); } });
    } else {
      var A = exParts(S.T, S.al);
      plot.draw({ view:{ xmin:-4, xmax:7.5, ymin:-1, ymax:7 }, equal:true, grid:false, axes:false,
        describe:"A sled pulled by a rope at " + S.al + "° above the horizontal with tension " + S.T + " N: horizontal part " + MV.plain(A.cos) + ", vertical part " + MV.plain(A.sin) + ".",
        after:function(ctx, p){ drawSled(ctx, p); } });
    }
  }
  plot.render = draw;
  function paint(){
    $$("[data-st]", host).forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.st === S.st ? "true" : "false"); });
    var s1 = S.st === "s1";
    $("#vr-c1", host).hidden = !s1; $("#vr-c2", host).hidden = s1; $("#vr-alg", host).hidden = !s1;
    $("#vr-intro", host).innerHTML = s1 ? T.s1Intro : T.s2Intro;
    ["th", "W", "al", "T"].forEach(function(k){ var el = $("#vr-" + k, host); el.value = S[k]; el.setAttribute("aria-valuetext", S[k] + (k === "th" || k === "al" ? " degrees" : " newtons")); $("#vr-o" + k, host).textContent = S[k] + (k === "th" || k === "al" ? "°" : " N"); });
    $$("[data-th]", host).forEach(function(b){ var on = +b.dataset.th === S.th; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    var rows = [], note = "";
    if (s1) {
      var E = exParts(S.W, S.th), z = S.th === 0;
      rows.push([T.along, m("W sin θ") + " = " + (z ? "0 N" : E.sin)]);
      rows.push([T.into, m("W cos θ") + " = " + E.cos]);
      rows.push([T.hold, z ? "0 N" : E.sin + T.up]);
      if (z) note = T.flatRamp; else if (whyShown) note = T.whyDone;
      $('[data-act="why"]', host).disabled = z || !!wedge;
    } else {
      var A = exParts(S.T, S.al);
      rows.push([T.horiz, m("T cos α") + " = " + (S.al === 90 ? "0 N" : A.cos)]);
      rows.push([T.vert, m("T sin α") + " = " + (S.al === 0 ? "0 N" : A.sin)]);
      if (S.al === 90) note = T.allLift;
    }
    $("#vr-read", host).innerHTML = MV.readoutHTML(rows);
    $("#vr-note", host).innerHTML = note;
    draw();
  }
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.sl; if (!k) return;
    S[k] = Math.round(+e.target.value); if (k === "th") { whyShown = false; if (stop) { stop(); stop = null; wedge = null; } }
    api.save(); paint();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.st) { S.st = b.dataset.st; api.save(); paint(); return; }
    if (b.dataset.th) { S.th = +b.dataset.th; whyShown = false; api.save(); paint(); return; }
    if (b.dataset.act === "why") {
      whyShown = false; wedge = { t:0 }; paint();
      stop = MV.tween({ dur:1800, step:function(t){ wedge.t = t; draw(); }, done:function(){ stop = null; wedge = null; whyShown = true; paint(); } });
    }
  });
  paint();
}

// =====================================================================================================================
// ---------- Performance task: Hang the weight ----------
var task = (function(){
  var api, plot, KEYS = ["a1", "b1", "a2", "b2", "w"];
  function int(v){ var s = String(v == null ? "" : v).trim().replace(/−/g, "-"); return /^-?\d+$/.test(s) ? parseInt(s, 10) : null; }
  function read(){
    var R = (api && api.S.v) || {}, d = {}; KEYS.forEach(function(k){ d[k] = int(R[k]); });
    d.filled = KEYS.every(function(k){ return d[k] !== null; });
    d.range = d.filled && [d.a1, d.b1, d.a2, d.b2].every(function(v){ return v >= -20 && v <= 20; }) && d.w >= 1 && d.w <= 20;
    return d;
  }
  function whole(a, b){ var n = a * a + b * b, r = Math.round(Math.sqrt(n)); return r * r === n; }
  function checks(d){
    if (!d.filled || !d.range) return [false, false, false, false, false];
    return [d.a1 + d.a2 === 0 && d.b1 + d.b2 - d.w === 0, d.b1 > 0 && d.b2 > 0, d.a1 !== 0, whole(d.a1, d.b1) && whole(d.a2, d.b2), d.w >= 10 && d.w <= 20];
  }
  function src(v){ return String(v); }
  function preview(){
    var d = read(), Lb = api.content.labels, rd = $("#hw-read");
    var pen = css("--pen"), f3 = css("--f3"), f5 = css("--f5"), ink = css("--ink"), ink2 = css("--ink-2");
    var V = { xmin:-22, xmax:22, ymin:-22, ymax:22 };
    if (!d.filled || !d.range) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + (d.filled ? Lb.range : Lb.fill) + "</p>";
      plot.draw({ view:V, equal:true, ticks:false, xTicks:{ step:5 }, yTicks:{ step:5 }, describe:"The ring, waiting for whole-number rope components and a weight." }); return;
    }
    var nx = d.a1 + d.a2, ny = d.b1 + d.b2 - d.w;
    var rows = [[Lb.r1 + " " + Lb.tension, magHTML(d.a1, d.b1)], [Lb.r2 + " " + Lb.tension, magHTML(d.a2, d.b2)], [Lb.weightRow, d.w + " N, " + m("(0, " + src(-d.w) + ")")],
      [Lb.net, m("(" + src(nx) + ", " + src(ny) + ")") + (nx === 0 && ny === 0 ? " = " + m("vec{0}") : "")]];
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
    plot.draw({ view:V, equal:true, ticks:false, xTicks:{ step:5 }, yTicks:{ step:5 },
      describe:"Ring with rope 1 pulling (" + d.a1 + ", " + d.b1 + "), tension " + magPlain(d.a1, d.b1) + "; rope 2 pulling (" + d.a2 + ", " + d.b2 + "), tension " + magPlain(d.a2, d.b2) + "; weight " + d.w + " N down. Net force (" + nx + ", " + ny + ").",
      after:function(ctx, p){
        function rope(a, b){ if (b <= 0) return; var t = 22 / b; lineW(ctx, p, a, b, a * t, 22, ink2, 1.4, [5, 5]); }
        rope(d.a1, d.b1); rope(d.a2, d.b2);
        bgText(ctx, "grid: 5 N per square", 8, p.H - 14, "left", ink2, ui(11, 600));
        arrowW(ctx, p, 0, 0, d.a1, d.b1, pen, 3.2); arrowW(ctx, p, 0, 0, d.a2, d.b2, f3, 3.2); arrowW(ctx, p, 0, 0, 0, -d.w, f5, 3.2);
        ctx.save(); ctx.fillStyle = f5; ctx.globalAlpha = 0.3; ctx.fillRect(p.X(-1.6), p.Y(-d.w), p.X(1.6) - p.X(-1.6), p.Y(-d.w - 3) - p.Y(-d.w)); ctx.restore();
        ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = ink; ctx.fillStyle = css("--sheet"); ctx.beginPath(); ctx.arc(p.X(0), p.Y(0), 8, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.restore();
        function lab(a, b, txt, col){ if (!a && !b) return; var L = Math.hypot(a, b); bgText(ctx, txt, p.X(a) + 14 * a / L, p.Y(b) - 14 * b / L, a > 0.5 ? "left" : a < -0.5 ? "right" : "center", col, ui(13, 700)); }
        lab(d.a1, d.b1, "rope 1: " + magPlain(d.a1, d.b1), pen); lab(d.a2, d.b2, "rope 2: " + magPlain(d.a2, d.b2), f3);
        bgText(ctx, "weight " + d.w + " N", p.X(2.2), p.Y(-d.w - 1.5), "left", f5, ui(13, 700));
      } });
  }
  function field(k, label){ var v = (api.S.v || {})[k]; return '<label class="hw-f"><span>' + label + '</span><input class="numin hw-in" type="number" min="' + (k === "w" ? 1 : -20) + '" max="20" step="1" data-hw="' + k + '" data-k="hw' + k + '" value="' + MV.esc(v == null ? "" : v) + '"></label>'; }
  return {
    render:function(inp, pv, a){
      api = a; var Lb = a.content.labels; a.S.v = a.S.v || {};
      inp.innerHTML = '<div class="hw-in-wrap">' +
        '<fieldset class="hw-row" style="--vf-c:var(--pen)"><legend>' + Lb.r1 + "</legend>" + field("a1", Lb.a) + field("b1", Lb.b) + "</fieldset>" +
        '<fieldset class="hw-row" style="--vf-c:var(--f3)"><legend>' + Lb.r2 + "</legend>" + field("a2", Lb.a) + field("b2", Lb.b) + "</fieldset>" +
        '<fieldset class="hw-row" style="--vf-c:var(--f5)"><legend>' + Lb.weightRow + "</legend>" + field("w", Lb.w) + "</fieldset></div>";
      pv.innerHTML = '<div id="hw-read" aria-live="polite"></div><div class="plot-wrap"><canvas class="plot square" id="hw-plot" role="img" aria-label="Ring, ropes and weight"></canvas></div>';
      plot = new MV.Plot($("#hw-plot"), { xmin:-22, xmax:22, ymin:-22, ymax:22 }, { equal:true }); plot.render = preview;
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.hw; if (!k) return; a.S.v[k] = e.target.value; a.save(); preview(); a.update(); });
      preview();
    },
    read:read,
    valid:function(d){ if (!d.filled) return api.content.labels.fill; if (!d.range) return api.content.labels.range; return true; },
    checks:checks,
    key:function(d){ return [d.a1, d.b1, d.a2, d.b2, d.w].join(","); },
    label:function(k){ var v = k.split(","); return m("(" + v[0] + ", " + v[1] + ")") + " and " + m("(" + v[2] + ", " + v[3] + ")") + ", " + m("w = " + v[4]); },
    text:function(k){ var v = k.split(",").map(function(s){ return s.replace("-", MINUS); }); return "(" + v[0] + ", " + v[1] + ") and (" + v[2] + ", " + v[3] + "), w = " + v[4]; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
