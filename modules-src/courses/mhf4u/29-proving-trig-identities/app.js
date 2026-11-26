// MHF4U 29 Proving Trig Identities: hero (one graph, then a counterexample), proof workbench (Explore: N15 two-column
// mode, graph twin with the N23 overlay gauge, proof map), counterexample hunter (Part 3), "Put the proof in order" with a
// decoy tray (N5), "Make it an identity" boxes (N4) and the "Flatten the wave" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, PI = Math.PI, TAU = 2 * Math.PI;
var sin = Math.sin, cos = Math.cos, tan = Math.tan, sqrt = Math.sqrt;
function m(s){ return MV.m(s); }
function fill(t, o){ return String(t).replace(/\{(\w+)\}/g, function(w, k){ return o[k] != null ? o[k] : w; }); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function big(v){ return typeof v !== "number" || !isFinite(v) || Math.abs(v) > 1e9; }
function plural(n, w){ return n + " " + w + (n === 1 ? "" : "s"); }

// ---------- exact values at special angles ----------
// @component exactRad — exact value recognizer at special angles: v -> (a + b√r)/q (r = 2, 3, 6), m() source with stacked
//   fractions ("1 + √2/2", "(√3 − 1)/2"), exactness rule by the angles inside the functions (multiples of π/6 or π/4).
// Angles inside the functions, in units of π/48: [multiple of x, offset]. Exact only when every one is a multiple of π/6 or π/4.
var ANG = { x:[[1, 0]], x2:[[1, 0], [2, 0]], b1:[[1, 0], [1, 8], [1, -8]], r3:[[1, 0], [1, -16]], r6:[[12, 0]] };
function exactAt(j, key){
  return (ANG[key] || ANG.x).every(function(a){ var n = a[0] * j + a[1]; return ((n % 8) + 8) % 8 === 0 || ((n % 12) + 12) % 12 === 0; });
}
function exactOf(v){
  if (big(v)) return null;
  var Q, A, r, B, s, R = [2, 3, 6];
  function out(a, b, rr, q){ var g = gcd(gcd(a, b), q); return { a:a / g, b:b / g, r:rr, q:q / g }; }
  for (Q = 1; Q <= 24; Q++) { A = v * Q; if (Math.abs(A - Math.round(A)) < 1e-7) return out(Math.round(A), 0, 1, Q); }
  for (Q = 1; Q <= 24; Q++) for (r = 0; r < 3; r++) for (B = 1; B <= 48; B++) for (s = -1; s <= 1; s += 2) {
    A = v * Q - s * B * sqrt(R[r]);
    if (Math.abs(A) < 2000 && Math.abs(A - Math.round(A)) < 1e-7) return out(Math.round(A), s * B, R[r], Q);
  }
  return null;
}
function exactSrc(e){
  var a = e.a, b = e.b, q = e.q;
  function rad(c){ return (Math.abs(c) === 1 ? "" : Math.abs(c)) + "√" + e.r; }
  if (!b) return q === 1 ? String(a) : (a < 0 ? "-" : "") + "{" + Math.abs(a) + "}/{" + q + "}";
  if (!a) return (b < 0 ? "-" : "") + (q === 1 ? rad(b) : "{" + rad(b) + "}/{" + q + "}");
  if (a % q === 0) return (a / q) + (b < 0 ? " - " : " + ") + (q === 1 ? rad(b) : "{" + rad(b) + "}/{" + q + "}");
  if (a < 0 && b < 0) return "-{" + Math.abs(a) + " + " + rad(b) + "}/{" + q + "}";
  return "{" + (a > 0 ? a + (b < 0 ? " - " : " + ") + rad(b) : rad(b) + " - " + Math.abs(a)) + "}/{" + q + "}";
}
// value as html: exact at special angles, otherwise ≈ to 2 decimals (null when undefined)
function valHTML(v, ex, approxToo){
  if (big(v)) return null;
  var r = Math.round(v);
  if (Math.abs(v - r) < 1e-9) return m(String(r));
  if (ex) { var e = exactOf(v); if (e) return m(exactSrc(e)) + (approxToo && e.b ? " ≈ " + num(v, 2) : ""); }
  return "≈ " + num(v, 2);
}
function piFr(j){ var g = gcd(j, 48); return { n:j / g, d:48 / g }; }
function piSrc(j){ if (!j) return "0"; var f = piFr(j), t = (f.n === 1 ? "" : f.n) + "π"; return f.d === 1 ? t : "{" + t + "}/{" + f.d + "}"; }
function piTxt(j){ if (!j) return "0"; var f = piFr(j), t = (f.n === 1 ? "" : f.n) + "π"; return f.d === 1 ? t : t + "/" + f.d; }

// ---------- restrictions (from the original statement; G1 asymptotes, G2 holes) ----------
var ZJ = { sin:[0, 48, 96], cos:[24, 72], sc:[0, 24, 48, 72, 96], c2x:[24, 72], omc:[0, 96] };
var UT = { sin:function(x){ return Math.abs(sin(x)) < 1e-9; }, cos:function(x){ return Math.abs(cos(x)) < 1e-9; },
  sc:function(x){ return Math.abs(sin(x)) < 1e-9 || Math.abs(cos(x)) < 1e-9; }, c2x:function(x){ return Math.abs(1 + cos(2 * x)) < 1e-12; }, omc:function(x){ return Math.abs(1 - cos(x)) < 1e-13; } };
function mask(f, code){ if (!code) return f; return function(x){ return UT[code](x) ? NaN : f(x); }; }
function undefJ(code, j){ return !!code && ZJ[code].indexOf(j) >= 0; }
var featCache = {};
function feats(f, code, key){
  if (!code) return { asym:[], holes:[] };
  if (key && featCache[key]) return featCache[key];
  var out = { asym:[], holes:[] }, e = 1e-5, fin = function(v){ return isFinite(v) && Math.abs(v) < 1e4; };
  ZJ[code].forEach(function(j){
    var x = j * PI / 48, a = f(x - e), b = f(x + e);
    if (j === 0) a = b; if (j === 96) b = a;
    if (fin(a) && fin(b) && Math.abs(a - b) < 1e-3) out.holes.push({ x:x, y:(a + b) / 2 }); else out.asym.push(x);
  });
  if (key) featCache[key] = out;
  return out;
}
// at least 1200 samples on 0 ≤ x ≤ 2π (G16), with the engine's breaks at jumps (G1)
function dense(plot, f, a, b){ var W0 = plot.W; plot.W = Math.max(W0, 1050); var p = plot.sample(f, a, b); plot.W = W0; return p; }
function prep(plot, v){ plot.fit(); plot.v = v; }
function tickFmt(narrow){ return function(t){ var k = Math.round(t / (PI / 4)); if (Math.abs(k * PI / 4 - t) > 1e-6 || k % (narrow ? 4 : 2)) return ""; return MV.piLabel(t, 4); }; }
function wrapText(ctx, text, x, y, maxW, lh){
  var words = String(text).split(" "), line = "", lines = [];
  words.forEach(function(w){ var t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
  if (line) lines.push(line);
  lines.forEach(function(l, i){ ctx.fillText(l, x, y + (i - (lines.length - 1) / 2) * lh); });
}
function hiddenMsg(ctx, p, text){
  ctx.save(); ctx.fillStyle = css("--sheet"); ctx.globalAlpha = 0.85; ctx.fillRect(0, p.H * 0.18, p.W, p.H * 0.26); ctx.globalAlpha = 1;
  ctx.fillStyle = css("--ink-2"); ctx.font = "15px " + (p.fontUI || "sans-serif"); ctx.textAlign = "center"; ctx.textBaseline = "middle";
  wrapText(ctx, text, p.W / 2, p.H * 0.31, p.W - 40, 20); ctx.restore();
}
function radView(yw){ return { xmin:-0.22, xmax:TAU + 0.22, ymin:yw[0], ymax:yw[1] }; }

// @component N23 overlayGauge — overlay of two curves f and g on one view: shades the gap between them (G6) and finds the
//   largest gap where both are on screen (marker + value). Mode "compare" (MHF4U 29) compares a new line with the line above.
//   gauge(plot, f, g, view, {x0, x1, color}) -> {regions:[…], gap:{x, d, yf, yg} | null}; gaugeMarker(gap, color) -> segments
function gauge(plot, f, g, view, o){
  o = o || {};
  var x0 = o.x0 == null ? 0 : o.x0, x1 = o.x1 == null ? TAU : o.x1, best = null, N = 1200, lo = view.ymin, hi = view.ymax;
  for (var i = 0; i <= N; i++) {
    var x = x0 + (x1 - x0) * i / N, a = f(x), b = g(x);
    if (big(a) || big(b) || a < lo || a > hi || b < lo || b > hi) continue;
    var d = Math.abs(a - b);
    if (!best || d > best.d) best = { x:x, d:d, yf:a, yg:b };
  }
  var clip = function(fn){ return function(x){ var v = fn(x); return big(v) ? NaN : Math.max(lo - 1, Math.min(hi + 1, v)); }; };
  return { regions:x1 > x0 ? [{ f:clip(f), g:clip(g), x0:x0, x1:x1, color:o.color || css("--hi-soft") }] : [], gap:best && best.d > 1e-6 ? best : null };
}
function gaugeMarker(gap, color){
  return gap ? [{ x1:gap.x, y1:gap.yf, x2:gap.x, y2:gap.yg, color:color || css("--red"), width:2.5, arrow:"both" }] : [];
}

// ---------- graph functions (every legal line of a proof is the same function as its left side) ----------
var PF = {
  G0:function(x){ return sin(x) * (cos(x) / sin(x)); },
  G1:function(x){ return (sin(x) + cos(x)) / sin(x); },
  TC1:function(x){ return 1 / cos(x) - cos(x); },
  TC2:function(x){ return tan(x) + 1 / tan(x); },
  TC3:function(x){ return sin(2 * x) / (1 + cos(2 * x)); },
  B1:function(x){ return sin(x + PI / 6) + sin(x - PI / 6); },
  B2:function(x){ var c = cos(x); return (1 - sin(x)) * (1 + sin(x)) / (c * c); },
  B3:function(x){ return sin(x) / (1 - cos(x)); }
};
function s2(x){ return sin(2 * x); }
var TF = {
  G1:{ q:function(x){ return 1 + cos(x); } },
  TC1:{ c:function(x){ return 1 - cos(x); } },
  TC2:{ c:function(){ return 2; } },
  TC3:{ s0:function(x){ return s2(x) + s2(x) / cos(2 * x); }, c2:function(x){ return sin(x) * cos(x) / (1 + cos(x)); },
    sdN0:function(x){ var s = sin(x), c = cos(x); return s2(x) + s2(x) / (c * c) - s2(x) / (s * s); },
    sdN1:function(x){ var s = sin(x), c = cos(x); return s2(x) + s2(x) / (c * c) - s2(x) / (s * s); },
    scN0:function(x){ var s = sin(x); return s2(x) / 2 - s2(x) / (2 * s * s); }, scN1:function(x){ var s = sin(x); return s2(x) / 2 - s2(x) / (2 * s * s); } },
  B2:{ p:function(x){ var c = cos(x); return c * (1 + sin(x)) / (c * c); } },
  B3:{ s:function(x){ return sin(x) - tan(x); } }
};
var CF = {
  c1:{ L:function(x){ return sin(2 * x); }, R:function(x){ return 2 * sin(x); } },
  c2:{ L:function(x){ return cos(x); }, R:function(x){ var s = sin(x); return sqrt(Math.max(0, 1 - s * s)); } }
};
var FORM = { sin:"sin 2x", cs:"cos^2x - sin^2x", c2:"2cos^2x - 1", s2:"1 - 2sin^2x" };

// ---------- hero ----------
function hero(f){
  var H = MV.C.hero, plot = new MV.Plot(f.canvas, { xmin:0, xmax:1, ymin:0, ymax:1 });
  var V1 = { xmin:-0.25, xmax:TAU + 0.25, ymin:-0.9, ymax:12.6 }, V3 = { xmin:-0.08, xmax:PI / 2 + 0.08, ymin:-0.4, ymax:8 };
  var sq = function(v){ return v * v; };
  var fId = function(x){ return sq(1 / cos(x)) + sq(1 / sin(x)); }, gId = function(x){ return sq(1 / cos(x)) * sq(1 / sin(x)); };
  var fNo = function(x){ return 1 / cos(x) + 1 / sin(x); }, gNo = function(x){ return 1 / (cos(x) * sin(x)); };
  var st = { phase:"id", t1:0, t2:0, z:0, c1:0, c2:0, x:false, final:false }, eqEl = $(".hero-eq"), eqHTML = eqEl ? eqEl.innerHTML : "", step = 0;
  function ms(fn){ return mask(fn, "sc"); }
  function sceneId(p, v, t1, t2, label){
    prep(p, v); var narrow = p.W < 360;
    var cv = [];
    if (t1 > 0) cv.push({ pts:dense(p, ms(fId), 0, TAU * t1), color:css("--pen"), width:3 });
    if (t2 > 0) cv.push({ pts:dense(p, ms(gId), 0, TAU * t2), color:css("--ink-2"), width:2.4, dash:[6, 6] });
    p.draw({ view:v, xTicks:{ step:PI / 4, fmt:tickFmt(narrow) }, yTicks:{ step:4 }, asymptotes:[0, PI / 2, PI, 3 * PI / 2, TAU].map(function(x){ return { x:x, label:"" }; }), curves:cv,
      labels:[{ x:0, y:12.1, text:"undefined", dx:30, color:css("--ink-2"), font:"italic 12px " + (p.fontM || "serif") }, { x:TAU, y:12.1, text:"undefined", dx:-4, align:"right", color:css("--ink-2"), font:"italic 12px " + (p.fontM || "serif") }]
        .concat(label ? [{ x:PI / 4, y:2.2, text:label, color:css("--green"), align:"center", bg:true }] : []),
      after:label ? function(ctx){ drawInset(ctx, p); } : null,
      describe:"y = sec²x + csc²x (solid) and y = sec²x csc²x (dashed) for x from 0 to 2π, with asymptotes at 0, π/2, π, 3π/2 and 2π. " + (t2 >= 1 ? "The two graphs are one curve, four U-shaped pieces each with lowest point y = 4." : "Drawing…") +
        (label ? " Inset: the false claim sec x + csc x = sec x csc x on 0 to π/2. Its two curves stay apart; at π/4 the values are 2√2 and 2." : "") });
  }
  // the false claim as a small inset in the empty band below y = 4 (final frame)
  function drawInset(ctx, p){
    var top = p.Y(3.55), bot = p.Y(0.35), bh = bot - top, bw = Math.min(p.W * 0.44, bh * 1.9), bx = p.W - bw - 8, by = top;
    var X = function(x){ return bx + 8 + (bw - 16) * x / (PI / 2); }, Y = function(y){ return by + bh - 6 - (bh - 12) * (y - 1.5) / 3; };
    ctx.save(); ctx.fillStyle = css("--sheet"); ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1.5; ctx.fillRect(bx, by, bw, bh); ctx.strokeRect(bx, by, bw, bh);
    ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip();
    [[fNo, css("--pen"), 2.2, []], [gNo, css("--ink-2"), 1.8, [4, 4]]].forEach(function(c){
      ctx.strokeStyle = c[1]; ctx.lineWidth = c[2]; ctx.setLineDash(c[3]); ctx.beginPath();
      for (var i = 1; i < 160; i++) { var x = PI / 2 * i / 160, yy = Math.min(6, c[0](x)); if (i === 1) ctx.moveTo(X(x), Y(yy)); else ctx.lineTo(X(x), Y(yy)); }
      ctx.stroke(); ctx.setLineDash([]);
    });
    ctx.strokeStyle = css("--red"); ctx.lineWidth = 2;
    [2, 2 * Math.SQRT2].forEach(function(y){ var cx = X(PI / 4), cy = Y(y); ctx.beginPath(); ctx.moveTo(cx - 4, cy - 4); ctx.lineTo(cx + 4, cy + 4); ctx.moveTo(cx + 4, cy - 4); ctx.lineTo(cx - 4, cy + 4); ctx.stroke(); });
    ctx.fillStyle = css("--red"); ctx.font = "600 12px " + (p.fontM || "serif"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("2√2 ≠ 2", X(PI / 4), Y(3.75));
    ctx.restore();
  }
  function sceneNo(p, v, c1, c2, showX, small){
    prep(p, v);
    var cv = [], x0 = 0.0001, x1 = PI / 2 - 0.0001, pts = [], labs = [], segs = [];
    if (c1 > 0) cv.push({ pts:dense(p, fNo, x0, x0 + (x1 - x0) * c1), color:css("--pen"), width:small ? 2.4 : 3 });
    if (c2 > 0) cv.push({ pts:dense(p, gNo, x0, x0 + (x1 - x0) * c2), color:css("--ink-2"), width:small ? 2 : 2.4, dash:[6, 6] });
    if (showX) {
      segs.push({ x1:PI / 4, y1:2, x2:PI / 4, y2:2 * Math.SQRT2, color:css("--red"), width:2, dash:[3, 3] });
      labs.push({ x:PI / 4, y:2 * Math.SQRT2 + (small ? 1.3 : 0.9), text:"2√2 ≠ 2", color:css("--red"), align:"center", bg:true, font:"600 " + (small ? 12 : 15) + "px " + (p.fontM || "serif") });
    }
    p.draw({ view:v, xTicks:{ step:PI / 4, fmt:function(t){ return Math.abs(t - PI / 4) < 1e-6 ? "π/4" : Math.abs(t - PI / 2) < 1e-6 ? "π/2" : ""; } }, yTicks:{ step:2 },
      asymptotes:[{ x:0, label:"" }, { x:PI / 2, label:"" }], curves:cv, segments:segs, labels:labs,
      after:function(ctx){ if (!showX) return; [2, 2 * Math.SQRT2].forEach(function(y){ var X = p.X(PI / 4), Y = p.Y(y), r = small ? 4 : 6; ctx.save(); ctx.strokeStyle = css("--red"); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(X - r, Y - r); ctx.lineTo(X + r, Y + r); ctx.moveTo(X + r, Y - r); ctx.lineTo(X - r, Y + r); ctx.stroke(); ctx.restore(); }); },
      describe:"False claim: y = sec x + csc x (solid) and y = sec x csc x (dashed) for x from 0 to π/2. The curves stay apart. At x = π/4 the values are 2√2 and 2, so the claim fails there." });
  }
  plot.render = function(){
    if (st.phase === "no") { var t = st.z, v = { xmin:V1.xmin + (V3.xmin - V1.xmin) * t, xmax:V1.xmax + (V3.xmax - V1.xmax) * t, ymin:V1.ymin + (V3.ymin - V1.ymin) * t, ymax:V1.ymax + (V3.ymax - V1.ymax) * t };
      if (t < 1) sceneId(plot, v, 1, 1); else sceneNo(plot, V3, st.c1, st.c2, st.x); return; }
    sceneId(plot, V1, st.t1, st.t2, st.final ? H.caps.id : "");
  };
  function proofHTML(i){
    var P = H.proof, ls = P.ls.map(function(s, k){ return '<p class="h29-l' + (i > k ? " on" : "") + (i >= 6 && k === 2 ? " glow" : "") + '">' + (k ? "= " : "LS = ") + m(s) + "</p>"; }).join("");
    var rs = P.rs.map(function(s, k){ return '<p class="h29-l' + (i > 3 + k ? " on" : "") + (i >= 6 && k === 1 ? " glow" : "") + '">' + (k ? "= " : "RS = ") + m(s) + "</p>"; }).join("");
    return '<div class="h29-col">' + ls + '</div><div class="h29-mid"><span class="h29-chip' + (i >= 6 ? " on" : "") + '">LS = RS ✓</span></div><div class="h29-col">' + rs + "</div>";
  }
  var pl = MV.player($("#h29-player"), { count:7, interval:800, label:function(i){ return "Proof step " + i + " of 6"; }, render:function(i){ step = i; $("#h29-proof").innerHTML = proofHTML(i); } });
  function hl(id){ ["he-plus", "he-prod"].forEach(function(k){ var e = document.getElementById(k); if (e) e.classList.toggle("on", k === id); }); }
  function cap(t){ f.cap.textContent = t; }
  function finalFrame(){
    st = { phase:"id", t1:1, t2:1, z:0, c1:1, c2:1, x:true, final:true };
    if (eqEl) { eqEl.innerHTML = eqHTML; eqEl.classList.remove("fade"); }
    hl(null); f.fig.classList.add("h29-final"); pl.go(6); cap(H.caps.same + " " + H.caps.one); plot.render();
  }
  if (MV.reduceMotion) { finalFrame(); return; }
  plot.render();
  var lin = function(t){ return t; };
  MV.wait(500, function(){
    hl("he-plus");
    MV.tween({ dur:1500, ease:lin, step:function(t){ st.t1 = t; plot.render(); }, done:function(){
      hl("he-prod");
      MV.tween({ dur:1500, ease:lin, step:function(t){ st.t2 = t; plot.render(); }, done:function(){
        hl(null); cap(H.caps.same);
        var i = 0, tick = function(){ i++; pl.go(i); if (i < 6) MV.wait(800, tick); else MV.wait(1400, contrast); };
        MV.wait(600, tick);
      } });
    } });
  });
  function contrast(){
    if (eqEl) { eqEl.classList.add("fade"); MV.wait(300, function(){ eqEl.innerHTML = H.contrastEq; eqEl.classList.remove("fade"); }); }
    st.phase = "no"; st.z = 0; st.c1 = 0; st.c2 = 0; st.x = false;
    MV.tween({ dur:500, step:function(t){ st.z = t; plot.render(); }, done:function(){
      MV.tween({ dur:600, ease:lin, step:function(t){ st.c1 = t; plot.render(); }, done:function(){
        MV.tween({ dur:600, ease:lin, step:function(t){ st.c2 = t; plot.render(); }, done:function(){
          st.x = true; plot.render(); cap(H.caps.one);
          MV.wait(2600, finalFrame);
        } });
      } });
    } });
  }
}

// ---------- Explore: proof workbench ----------
// @component N15 moveChooser (two-column LS/RS mode) — proof board with Left side / Right side columns, a 20-move menu in
//   three groups (tabs on phones), per-proof move maps from content (states, legal moves, traps that jump and are removed,
//   refused equation moves, double-angle form pop-over), coach marks, graph twin with probe, proof map and readout.
function explore(host, api){
  var C = MV.C.explore, W = C.wb, S = api.S;
  var PROOF = {}, CLAIM = {}, MOVE = {};
  C.proofs.forEach(function(p){ PROOF[p.id] = p; }); C.claims.forEach(function(c){ CLAIM[c.id] = c; }); W.moves.forEach(function(x){ MOVE[x.id] = x; });
  S.mode = S.mode === "test" ? "test" : "prove"; if (!PROOF[S.pid]) S.pid = "G0"; if (!CLAIM[S.cid] && !PROOF[S.cid]) S.cid = "c1";
  S.side = S.side === "R" ? "R" : "L"; if (typeof S.k !== "number") S.k = 4; S.panel = S.panel || "graph"; S.pv = S.pv || "board"; S.tab = S.tab || "id";
  S.boards = S.boards || {}; S.done = S.done || {};
  var view = { busy:false, hl:null, newLine:null, sweep:null, trap:null, chip:false, hide:false, reveal:null, marks:null, shade:false, pop:null, flash:false, last:null, coachNote:null, meet:false };
  host.innerHTML = '<div class="wb" data-mv="graph">' +
    '<div class="wb-top"><div class="wb-mode" id="wb-mode"></div><label class="wb-sel"><span class="tiny b" id="wb-sel-lab"></span><select id="wb-sel"></select></label></div>' +
    '<p class="wb-shelf tiny" id="wb-shelf"></p><p class="banner wb-banner" data-mv="banner" aria-live="polite"></p><div class="wb-pvseg" id="wb-pvseg"></div>' +
    '<div class="wb-grid"><div class="wb-left"><div class="wb-board" id="wb-board" tabindex="-1"></div><div class="wb-claim" id="wb-claim"></div></div>' +
    '<div class="wb-right"><div class="wb-rseg" id="wb-rseg"></div><div class="wb-graph"><div class="plot-wrap"><canvas class="plot" id="wb-plot" role="img" tabindex="0" aria-label="Graph twin"></canvas><span class="wb-chip" id="wb-chip" hidden>' + W.sameChip + '</span></div>' +
    '<div class="wb-pr"><span class="tiny b">' + W.probeLabel + '</span><button type="button" class="btn ghost pr-btn" data-pr="-1" aria-label="Move the probe left">−</button><input type="range" id="wb-range" min="0" max="24" step="1" aria-label="Value probe x"><button type="button" class="btn ghost pr-btn" data-pr="1" aria-label="Move the probe right">+</button><output id="wb-px" class="pr-x"></output></div></div>' +
    '<div class="wb-map" id="wb-map"></div></div>' +
    '<div class="wb-moves" id="wb-moves"></div><div class="wb-read"><dl class="read" id="wb-read" aria-live="polite"></dl></div></div></div>';
  var root = $(".wb", host), E = { mode:$("#wb-mode"), sel:$("#wb-sel"), selLab:$("#wb-sel-lab"), shelf:$("#wb-shelf"), banner:$(".wb-banner", host), pvseg:$("#wb-pvseg"), board:$("#wb-board"), claim:$("#wb-claim"),
    rseg:$("#wb-rseg"), map:$("#wb-map"), moves:$("#wb-moves"), read:$("#wb-read"), range:$("#wb-range"), px:$("#wb-px"), chip:$("#wb-chip") };
  var plot = new MV.Plot($("#wb-plot"), radView([-2, 2]));
  function setBanner(kind, html){ E.banner.className = "banner wb-banner" + (kind ? " " + kind : ""); E.banner.innerHTML = html || ""; }

  // ----- model -----
  function pr(){ return PROOF[S.pid]; }
  function board(pid){ pid = pid || S.pid; return S.boards[pid] || (S.boards[pid] = { L:[], R:[] }); }
  function curS(pid, side){ var b = board(pid), l = b[side], p = PROOF[pid]; return l.length ? l[l.length - 1].s : p[side === "L" ? "ls" : "rs"]; }
  function nMoves(pid){ var b = board(pid); return b.L.length + b.R.length; }
  function complete(pid){ return curS(pid, "L") === curS(pid, "R"); }
  function src(pid, sid){ var p = PROOF[pid]; return p.states[sid] || (p.traps && p.traps[sid] && p.traps[sid].m) || ""; }
  function tagHTML(line){ return line.form ? "Double angle (" + m(FORM[line.form]) + ")" : MOVE[line.mv].t; }
  function coachStep(){ if (complete("G0")) return 2; return curS("G0", "L") === "A1" ? 1 : 0; }
  // what the graph twin shows: two sides with functions, restrictions and an angle key
  function sides(){
    var id = S.mode === "test" ? S.cid : S.pid;
    if (CLAIM[id]) { var c = CLAIM[id]; return { id:id, claim:true, L:{ f:CF[id].L }, R:{ f:CF[id].R }, ang:c.angles || "x", ywin:c.ywin, undefAt:c.undefAt, lsSrc:c.ls, rsSrc:c.rs }; }
    var p = PROOF[id];
    return { id:id, claim:false, L:{ f:PF[id], code:p.undef.ls }, R:{ f:PF[id], code:p.undef.rs }, ang:p.angles || "x", ywin:p.ywin, undefAt:p.undefAt, lsSrc:p.states[p.ls], rsSrc:p.states[p.rs] };
  }
  function sideVal(sd, side, j){ var s = sd[side]; if (undefJ(s.code, j)) return NaN; return s.f(j * PI / 48); }

  // ----- moves -----
  function refuse(){
    setBanner("bad", W.eqMsg); view.last = W.refused; view.flash = true; paintBoard(); paintRead();
    MV.wait(450, function(){ view.flash = false; paintBoard(); });
  }
  function neutral(msg){ setBanner("", msg); }
  function doMove(id, form){
    if (view.busy || S.mode !== "prove") return;
    var p = pr(), st = curS(S.pid, S.side), mv = MOVE[id];
    view.coachNote = null;
    if (mv.g === "eq") { refuse(); return; }
    if (complete(S.pid)) { neutral(W.doneMsg); return; }
    if (p.guided) { var want = ["quotDown", "cancel", null][coachStep()]; if (S.side !== "L" || id !== want) { neutral(W.coachOther); return; } }
    var entry = (p.map[st] || {})[id], target = null;
    if (!entry) { neutral(W.neutral); return; }
    if (id === "double") {
      if (form) target = form === "sin" ? entry.sin : entry.cos && entry.cos[form];
      else if (entry.cos) { view.pop = { sin:!!entry.sin }; paintMoves(); var f0 = $(".wb-pop [data-form]", host); if (f0) f0.focus(); return; }
      else { target = entry.sin; form = "sin"; }
      view.pop = null;
      if (!target) { neutral(W.neutral); paintMoves(); return; }
    } else if (entry.trap) { runTrap(entry.trap, id, S.side); return; }
    else target = entry;
    legal(target, id, form);
  }
  function legal(target, id, form){
    var side = S.side, pid = S.pid;
    view.busy = true; view.hl = side; setBanner("", ""); paintBoard(); paintMoves();
    MV.wait(400, function(){
      var b = board(pid); b[side].push(form ? { s:target, mv:id, form:form } : { s:target, mv:id });
      view.hl = null; view.busy = false; view.newLine = side; view.last = fill(W.legal, { move:form ? "Double angle" : MOVE[id].t });
      var done = complete(pid);
      if (done) { S.done[pid] = true; view.meet = true; MV.wait(700, function(){ view.meet = false; }); }
      api.save(); paint(); MV.changed();
      view.sweep = { side:side, t:0 }; E.chip.hidden = false;
      MV.tween({ dur:800, ease:function(t){ return t; }, step:function(t){ if (view.sweep) { view.sweep.t = t; plot.render(); } }, done:function(){ view.sweep = null; plot.render(); } });
      MV.wait(1500, function(){ E.chip.hidden = true; });
      MV.wait(650, function(){ view.newLine = null; });
    });
  }
  function runTrap(tid, id, side, after){
    var p = pr(), tr = p.traps[tid], pid = S.pid;
    view.busy = true; view.hl = side; setBanner("", ""); paintBoard(); paintMoves();
    MV.wait(400, function(){
      view.hl = null; view.trap = { side:side, f:TF[pid][tid], m:tr.m, mv:id, t:0, strike:false, who:tr.who || "new line", pid:pid };
      paint();
      MV.tween({ dur:800, ease:function(t){ return t; }, step:function(t){ if (view.trap) { view.trap.t = t; plot.render(); } } });
      MV.wait(1500, function(){
        if (!view.trap) return; view.trap.strike = true; paintBoard(); paintMap();
        MV.wait(450, function(){
          view.trap = null; view.busy = false; view.last = fill(W.trapLast, { move:MOVE[id].t });
          setBanner("bad", "<strong>✗</strong> " + (W.trapFb[tr.fb] || tr.fb));
          paint(); if (after) after();
        });
      });
    });
  }
  function undo(){
    if (view.busy || S.mode !== "prove") return;
    var b = board(); if (!b[S.side].length) return;
    b[S.side].pop(); view.last = W.undo; view.coachNote = null; setBanner("", ""); api.save(); paint(); MV.changed();
  }
  function resetProof(pid){ S.boards[pid || S.pid] = { L:[], R:[] }; }

  // ----- painting -----
  function segHTML(name, opts, val, label){
    return '<div class="seg-wrap">' + (label ? '<span class="tiny b">' + label + "</span>" : "") + '<span class="seg" role="radiogroup" aria-label="' + MV.esc(MV.plain(label || name)) + '">' +
      opts.map(function(o){ return '<button type="button" role="radio" data-seg-' + name + '="' + o[0] + '" data-k="' + name + o[0] + '" aria-checked="' + (val === o[0]) + '" aria-pressed="' + (val === o[0]) + '"' + (view.busy ? " disabled" : "") + ">" + o[1] + "</button>"; }).join("") + "</span></div>";
  }
  function paintTop(){
    root.setAttribute("data-mode", S.mode); root.setAttribute("data-panel", S.panel); root.setAttribute("data-pv", S.pv); root.setAttribute("data-tab", S.tab);
    MV.keepFocus(E.mode, function(){ E.mode.innerHTML = segHTML("mode", [["prove", W.modes.prove], ["test", W.modes.test]], S.mode); });
    E.selLab.textContent = S.mode === "test" ? W.claimLabel : W.proofLabel;
    var opts = S.mode === "test" ? C.claims.map(function(c){ return [c.id, c.label]; }).concat(C.proofs.map(function(p){ return [p.id, p.label]; })) : C.proofs.map(function(p){ return [p.id, p.label]; });
    var val = S.mode === "test" ? S.cid : S.pid;
    E.sel.innerHTML = opts.map(function(o){ return '<option value="' + o[0] + '"' + (o[0] === val ? " selected" : "") + ">" + MV.esc(o[1]) + (S.mode === "prove" && S.done[o[0]] ? " ✓" : "") + "</option>"; }).join("");
    E.sel.disabled = view.busy;
    var nb = ["B1", "B2", "B3"].filter(function(k){ return S.done[k]; }).length;
    E.shelf.innerHTML = fill(W.bonus, { x:nb }) + " " + ["B1", "B2", "B3"].map(function(k, i){ return '<span class="wb-star' + (S.done[k] ? " on" : "") + '" aria-hidden="true">' + (S.done[k] ? "✓" : "○") + " Bonus " + (i + 1) + "</span>"; }).join(" ");
    MV.keepFocus(E.pvseg, function(){ E.pvseg.innerHTML = segHTML("pv", [["board", W.phone.board], ["graph", W.phone.graph], ["map", W.phone.map]], S.pv, "View"); });
    MV.keepFocus(E.rseg, function(){ E.rseg.innerHTML = segHTML("panel", [["graph", W.panels.graph], ["map", W.panels.map]], S.panel); });
  }
  function lineLi(pid, side, line, i, isCur, extra){
    var s = src(pid, line.s), tag = i ? tagHTML(line) : "", lab = "Line " + (i + 1) + ", " + (side === "L" ? "left" : "right") + " side: " + MV.plain(m(s)) + (i ? ", from " + MV.plain(tag) : "");
    return '<li class="wb-line' + (isCur ? " cur" : "") + (extra || "") + '" aria-label="' + MV.esc(lab) + '"><span class="wb-ex">' + (i ? "= " : "") + m(s) + "</span>" + (tag ? '<span class="wb-tag">' + tag + "</span>" : "") + "</li>";
  }
  function paintBoard(){
    if (S.mode !== "prove") { var sd = sides(); E.claim.innerHTML = '<div class="wb-card"><p class="wb-claim-t">' + m(sd.lsSrc + " = " + sd.rsSrc) + "</p>" + (CLAIM[sd.id] && CLAIM[sd.id].note ? '<p class="wb-note">' + CLAIM[sd.id].note + "</p>" : "") + "</div>"; return; }
    var p = pr(), b = board(), done = complete(S.pid);
    var col = function(side){
      var lines = [{ s:p[side === "L" ? "ls" : "rs"] }].concat(b[side]), n = lines.length;
      var h = lines.map(function(l, i){ return lineLi(S.pid, side, l, i, i === n - 1 && !view.trap, (i === n - 1 && view.hl === side ? " hl" : "") + (i === n - 1 && i > 0 && view.newLine === side ? " new" : "") + (done && i === n - 1 ? " meet" : "")); }).join("");
      if (view.trap && view.trap.side === side) h += '<li class="wb-line trap' + (view.trap.strike ? " strike" : "") + ' new" aria-label="' + MV.esc("Trap line: " + MV.plain(m(view.trap.m)) + ", different graph") + '"><span class="wb-ex">= ' + m(view.trap.m) + '</span><span class="wb-tag bad">✗ ' + MOVE[view.trap.mv].t + "</span></li>";
      return '<div class="wb-col' + (S.side === side ? " on" : "") + '"><h4>' + W.colHeads[side] + '</h4><ol class="wb-lines">' + h + "</ol></div>";
    };
    MV.keepFocus(E.board, function(){
      E.board.innerHTML = '<p class="wb-goal">Prove: ' + m(p.states[p.ls] + " = " + p.states[p.rs]) + "</p>" + segHTML("side", [["L", W.sideLabels.L], ["R", W.sideLabels.R]], S.side, "Side to work on") +
        '<div class="wb-cols">' + col("L") + '<div class="wb-eq' + (view.flash ? " flash" : "") + '" aria-hidden="true">' + (done ? '<span class="wb-lsrs">' + W.lsrs + "</span>" : "=") + "</div>" + col("R") + "</div>" +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="undo" data-k="wbundo"' + (view.busy || !b[S.side].length ? " disabled" : "") + ">" + W.undo + '</button><button type="button" class="btn ghost sm" data-act="reset" data-k="wbreset"' + (view.busy || !nMoves(S.pid) ? " disabled" : "") + ">" + W.reset + "</button></div>";
    });
  }
  function paintMap(){
    if (S.mode !== "prove") { E.map.innerHTML = ""; return; }
    var p = pr(), b = board(), done = complete(S.pid), n = nMoves(S.pid);
    var chain = function(side){
      var lines = [{ s:p[side === "L" ? "ls" : "rs"] }].concat(b[side]);
      var h = lines.map(function(l, i){ return (i ? '<div class="pm-arr"><span>' + tagHTML(l) + "</span></div>" : "") + '<div class="pm-node' + (i ? "" : " start") + (done ? " route" : "") + (i === lines.length - 1 && i > 0 && view.newLine === side ? " grow" : "") + (done && i === lines.length - 1 ? " last" : "") + '">' + m(src(S.pid, l.s)) + "</div>"; }).join("");
      if (view.trap && view.trap.side === side) h += '<div class="pm-arr trap"><span>' + MOVE[view.trap.mv].t + '</span></div><div class="pm-node trap' + (view.trap.strike ? " fade" : "") + '">✗ ' + m(view.trap.m) + "</div>";
      return '<div class="pm-col"><p class="pm-h">' + W.colHeads[side] + "</p>" + h + "</div>";
    };
    var h = '<div class="pm-scroll"><div class="pm-cols">' + chain("L") + chain("R") + "</div>";
    if (done) h += '<div class="pm-meet' + (view.meet ? " grow" : "") + '"><span class="pm-mh">' + W.lsrs + "</span>" + m(src(S.pid, curS(S.pid, "L"))) + "</div>";
    h += '</div><p class="pm-route">' + fill(W.route, { n:n }) + (done ? " " + fill(W.shortest, { m:p.shortest }) : "") + "</p>" + (done && p.mapNote ? '<p class="tiny muted">' + p.mapNote + "</p>" : "");
    E.map.innerHTML = h;
  }
  function paintMoves(){
    if (S.mode !== "prove") { E.moves.innerHTML = ""; return; }
    var p = pr(), cs = p.guided ? coachStep() : -1, want = p.guided ? ["quotDown", "cancel", null][cs] : null, dis = view.busy ? " disabled" : "";
    var coach = p.guided ? '<div class="wb-coach" role="status"><strong>Coach:</strong> ' + W.coach[cs] + "</div>" : (view.coachNote ? '<div class="wb-coach" role="status">' + view.coachNote + "</div>" : "");
    var h = coach + '<div class="wb-tabs">' + segHTML("tab", W.groups.map(function(g){ return [g.id, g.t]; }), S.tab, "Moves") + "</div>";
    W.groups.forEach(function(g){
      h += '<div class="mv-group" data-g="' + g.id + '"><h4>' + g.t + "</h4>" + (g.id === "id" ? '<p class="tiny muted mv-key">' + W.keyLine + "</p>" : "") + '<div class="mv-grid">' +
        W.moves.filter(function(x){ return x.g === g.id; }).map(function(x){ return '<button type="button" class="mvb' + (x.id === want ? " coach" : "") + (g.id === "eq" ? " eqm" : "") + '" data-move="' + x.id + '" data-k="mv' + x.id + '"' + dis + '><span class="mvn">' + x.t + '</span><span class="mve">' + m(x.ex) + "</span></button>"; }).join("") + "</div>";
      if (g.id === "id" && view.pop) {
        var forms = (view.pop.sin ? ["sin"] : []).concat(["cs", "c2", "s2"]);
        h += '<div class="wb-pop" role="radiogroup" aria-label="' + MV.esc(W.dbl.title) + '"><p class="tiny b">' + W.dbl.title + '</p><div class="chips">' + forms.map(function(f){ return '<button type="button" role="radio" aria-checked="false" class="chip" data-form="' + f + '" data-k="form' + f + '">' + m(W.dbl[f]) + "</button>"; }).join("") +
          '</div><button type="button" class="btn ghost sm" data-act="popclose" data-k="popclose">' + W.dbl.cancel + "</button></div>";
      }
      h += "</div>";
    });
    MV.keepFocus(E.moves, function(){ E.moves.innerHTML = h; });
  }
  function paintRead(){
    var sd = sides(), j = S.k * 4, ex = exactAt(j, sd.ang), rows = [];
    E.range.value = S.k; E.range.setAttribute("aria-valuetext", "x = " + piTxt(j)); E.px.innerHTML = m("x = " + piSrc(j));
    var lv = sideVal(sd, "L", j), rv = sideVal(sd, "R", j), lh = valHTML(lv, ex), rh = valHTML(rv, ex);
    var probe = "At " + m("x = " + piTxt(j)) + ": left side = " + (lh || "undefined" + (sd.L.code ? " (" + W.reasons[sd.L.code] + ")" : "")) + ", right side = " + (rh || "undefined" + (sd.R.code ? " (" + W.reasons[sd.R.code] + ")" : ""));
    if (S.mode === "test") {
      var here = !lh || !rh ? "Undefined here, so this isn’t a counterexample." : Math.abs(lv - rv) < 1e-9 ? "Equal" + (Math.abs(lv) < 1e-9 ? " (both 0)" : "") : "Not equal: this " + m("x") + " is a counterexample.";
      rows = [[W.read.claim, m(sd.lsSrc + " = " + sd.rsSrc)], [W.read.probe, view.hide ? "—" : probe], [W.read.here, view.hide ? "—" : here], [W.read.undef, sd.undefAt]];
    } else {
      var p = pr(), b = board(), done = complete(S.pid), nL = b.L.length, nR = b.R.length, n = nL + nR;
      var status = done ? fill(W.complete, { e:m(src(S.pid, curS(S.pid, "L"))), n:n }) : W.notYet;
      if (view.trap) {
        var t = view.trap, old = sideVal(sd, t.side, j), nv = t.f(j * PI / 48), oh = valHTML(old, ex, true), nh = valHTML(nv, ex, true);
        probe = "At " + m("x = " + piTxt(j)) + ": line above = " + (oh || "undefined") + "; " + t.who + " = " + (nh || "undefined") + ". " + (!oh || !nh ? W.oneUndef : Math.abs(old - nv) < 1e-9 ? W.agree : "");
      }
      rows = [[W.read.goal, "Prove: " + m(p.states[p.ls] + " = " + p.states[p.rs])],
        [W.read.ls, m(src(S.pid, curS(S.pid, "L"))) + " (" + plural(nL, "move") + ")"], [W.read.rs, m(src(S.pid, curS(S.pid, "R"))) + " (" + plural(nR, "move") + ")"],
        [W.read.status, '<span class="' + (done ? "wb-ok" : "") + '">' + status + "</span>"], [W.read.last, view.last || "—"],
        [W.read.probe, view.hide ? "—" : probe], [W.read.undef, p.undefAt], [W.read.moves, p.maxMoves ? n + " of at most " + p.maxMoves : String(n)]];
    }
    E.read.innerHTML = MV.readoutHTML(rows);
  }
  function paint(){ paintTop(); paintBoard(); paintMap(); paintMoves(); paintRead(); plot.render(); }

  // ----- graph twin -----
  plot.render = function(){
    var sd = sides(), V = radView(sd.ywin), j = S.k * 4, xp = j * PI / 48;
    prep(plot, V);
    var narrow = plot.W < 430, ink2 = css("--ink-2"), pen = css("--pen");
    var fL = feats(sd.L.f, sd.L.code, sd.id + "L"), fR = feats(sd.R.f, sd.R.code, sd.id + "R");
    var asym = fL.asym.concat(fR.asym.filter(function(x){ return fL.asym.indexOf(x) < 0; }));
    var sc = { view:V, xTicks:{ step:PI / 4, fmt:tickFmt(narrow) }, asymptotes:asym.map(function(x){ return { x:x, label:"" }; }), curves:[], points:[], labels:[], regions:[], segments:[], bands:[], lines:[] };
    var rev = view.reveal || { L:1, R:1 }, show = !view.hide;
    if (show) {
      if (view.shade) {
        var gb = css("--good-bg"), bb = css("--bad-bg");
        sc.bands = [{ x0:0, x1:PI / 2, color:gb }, { x0:PI / 2, x1:3 * PI / 2, color:bb }, { x0:3 * PI / 2, x1:TAU, color:gb }];
        sc.labels.push({ x:PI / 4, y:V.ymax - (V.ymax - V.ymin) * 0.08, text:"✓", color:css("--green"), align:"center" }, { x:PI, y:V.ymax - (V.ymax - V.ymin) * 0.08, text:"✗", color:css("--red"), align:"center" }, { x:7 * PI / 4, y:V.ymax - (V.ymax - V.ymin) * 0.08, text:"✓", color:css("--green"), align:"center" });
      }
      sc.lines.push({ p:[xp, 0], q:[xp, 1], color:css("--hi"), width:2.5 });
      var mL = mask(sd.L.f, sd.L.code), mR = mask(sd.R.f, sd.R.code);
      if (view.sweep) sc.curves.push({ pts:dense(plot, view.sweep.side === "L" ? mL : mR, 0, TAU * view.sweep.t), color:css("--hi"), width:9, alpha:0.8 });
      if (view.trap) {
        var tr = view.trap, base = tr.side === "L" ? mL : mR, g = gauge(plot, tr.f, base, V, { x0:0, x1:TAU * tr.t, color:css("--bad-bg") });
        sc.regions = g.regions;
      }
      if (rev.L > 0) sc.curves.push({ pts:dense(plot, mL, 0, TAU * rev.L), color:pen, width:3 });
      if (rev.R > 0) sc.curves.push({ pts:dense(plot, mR, 0, TAU * rev.R), color:ink2, width:2.4, dash:[6, 6] });
      if (view.trap) {
        sc.curves.push({ pts:dense(plot, view.trap.f, 0, TAU * view.trap.t), color:css("--red"), width:2.6, dash:[3, 4] });
        if (g.gap && view.trap.t >= 1) sc.labels.push({ x:g.gap.x, y:(g.gap.yf + g.gap.yg) / 2, text:W.diffLabel, color:css("--red"), dx:8, bg:true });
      }
      fL.holes.forEach(function(h){ if (h.x <= TAU * rev.L + 1e-9) sc.points.push({ x:h.x, y:h.y, open:true, color:pen }); });
      fR.holes.forEach(function(h){ if (h.x <= TAU * rev.R + 1e-9) sc.points.push({ x:h.x, y:h.y, open:true, color:ink2 }); });
      var lv = sideVal(sd, "L", j), rv = sideVal(sd, "R", j);
      if (!big(lv) && xp <= TAU * rev.L + 1e-9) sc.points.push({ x:xp, y:lv, r:5, color:pen });
      if (!big(rv) && xp <= TAU * rev.R + 1e-9) sc.points.push({ x:xp, y:rv, r:4, color:ink2 });
      if (view.trap && view.trap.t >= 1) { var tv = view.trap.f(xp); if (!big(tv)) sc.points.push({ x:xp, y:tv, r:4.5, color:css("--red") }); }
    }
    sc.after = function(ctx, p){
      if (!show) { hiddenMsg(ctx, p, W.hidden); return; }
      (view.marks || []).forEach(function(mk){
        var y = sd.L.f(mk.k * PI / 12), X = p.X(mk.k * PI / 12), Y = p.Y(y);
        ctx.save(); ctx.lineWidth = 2.6;
        if (mk.eq) { ctx.strokeStyle = css("--green"); ctx.beginPath(); ctx.arc(X, Y, 8, 0, TAU); ctx.stroke(); }
        else { ctx.strokeStyle = css("--red"); ctx.beginPath(); ctx.moveTo(X - 4, Y - 4); ctx.lineTo(X + 4, Y + 4); ctx.moveTo(X + 4, Y - 4); ctx.lineTo(X - 4, Y + 4); ctx.stroke(); }
        ctx.restore();
      });
    };
    var lh = sideVal(sd, "L", j), rh = sideVal(sd, "R", j);
    sc.describe = "Graph twin for " + MV.plain(m(sd.lsSrc + " = " + sd.rsSrc)) + ". " + (!show ? "The graphs are hidden until the reveal." :
      (sd.claim ? "Left side solid, right side dashed." : "The two sides draw one curve.") + (asym.length ? " Vertical asymptotes at " + asym.map(function(x){ return MV.piLabel(x, 4); }).join(", ") + "." : "") +
      (fL.holes.length + fR.holes.length ? " Open circles where a side is undefined." : "") + (view.trap ? " A red dashed line shows a different graph." : "") +
      " Probe at " + piTxt(j) + ": left side " + (big(lh) ? "undefined" : num(lh, 2)) + ", right side " + (big(rh) ? "undefined" : num(rh, 2)) + ".");
    plot.draw(sc);
  };

  // ----- events -----
  function setProbe(k){ S.k = Math.max(0, Math.min(24, k)); api.save(); paintRead(); plot.render(); }
  function clearExtras(){ view.hide = false; view.reveal = null; view.marks = null; view.shade = false; view.pop = null; view.coachNote = null; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var d = b.dataset;
    if (d.segMode) { if (S.mode !== d.segMode) { S.mode = d.segMode; clearExtras(); setBanner("", ""); api.save(); paint(); MV.changed(); } return; }
    if (d.segPanel) { S.panel = d.segPanel; api.save(); paintTop(); plot.render(); return; }
    if (d.segPv) { S.pv = d.segPv; api.save(); paintTop(); plot.render(); return; }
    if (d.segTab) { S.tab = d.segTab; api.save(); paintTop(); paintMoves(); return; }
    if (d.segSide) { S.side = d.segSide; api.save(); paintBoard(); return; }
    if (d.move) { doMove(d.move); return; }
    if (d.form) { var f = d.form; view.pop = null; doMove("double", f); return; }
    if (d.act === "popclose") { view.pop = null; paintMoves(); var db = $('[data-move="double"]', host); if (db) db.focus(); return; }
    if (d.act === "undo") { undo(); return; }
    if (d.act === "reset") { if (view.busy) return; resetProof(); view.last = null; view.coachNote = null; setBanner("", ""); api.save(); paint(); MV.changed(); return; }
    if (d.pr) { setProbe(S.k + (+d.pr)); return; }
  });
  E.sel.addEventListener("change", function(){
    if (view.busy) return;
    if (S.mode === "test") S.cid = E.sel.value; else { S.pid = E.sel.value; S.side = "L"; }
    clearExtras(); view.last = null; setBanner("", ""); api.save(); paint(); MV.changed();
  });
  E.range.addEventListener("input", function(){ setProbe(+E.range.value); });
  function probeKeys(e, el){
    var k = S.k, big6 = e.shiftKey ? 6 : 1;
    if (e.key === "PageUp" || (e.shiftKey && (e.key === "ArrowRight" || e.key === "ArrowUp"))) k += 6;
    else if (e.key === "PageDown" || (e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowDown"))) k -= 6;
    else if (el !== E.range && (e.key === "ArrowRight" || e.key === "ArrowUp")) k += big6;
    else if (el !== E.range && (e.key === "ArrowLeft" || e.key === "ArrowDown")) k -= big6;
    else if (el !== E.range && e.key === "Home") k = 0;
    else if (el !== E.range && e.key === "End") k = 24;
    else return;
    e.preventDefault(); setProbe(k);
  }
  E.range.addEventListener("keydown", function(e){ probeKeys(e, E.range); });
  plot.c.addEventListener("keydown", function(e){ probeKeys(e, plot.c); });
  plot.c.addEventListener("pointerdown", function(e){ var r = plot.c.getBoundingClientRect(), x = plot.xOf(e.clientX - r.left); setProbe(Math.round(x / (PI / 12))); });
  host.addEventListener("keydown", function(e){
    if (e.key === "Escape" && view.pop) { view.pop = null; paintMoves(); var db = $('[data-move="double"]', host); if (db) db.focus(); return; }
    var f = e.target.closest && e.target.closest("[data-form]");
    if (f && (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "ArrowUp")) {
      var all = Array.prototype.slice.call(host.querySelectorAll("[data-form]")), i = all.indexOf(f), n = all.length;
      all[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : n - 1)) % n].focus(); e.preventDefault(); return;
    }
    var sg = e.target.closest && e.target.closest(".seg [role=radio]");
    if (sg && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      var bs = Array.prototype.slice.call(sg.parentNode.querySelectorAll("button")), q = bs.indexOf(sg), nx = bs[(q + (e.key === "ArrowRight" ? 1 : bs.length - 1)) % bs.length];
      e.preventDefault(); nx.click(); var again = host.querySelector('[data-k="' + nx.dataset.k + '"]'); if (again) again.focus(); return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z") && E.board.contains(e.target)) { e.preventDefault(); undo(); }
  });

  // ----- results: bonus shelf -----
  MV.ACTS.bonus = { a:{ id:"bonus" }, stats:function(){ var nb = ["B1", "B2", "B3"].filter(function(k){ return S.done[k]; }).length; return { first:nb, total:3, done:nb, line:fill(W.bonus, { x:nb }) }; }, missed:function(){ return []; } };

  // ----- predictions -----
  function startPred(p){
    view.busy = false; view.trap = null; view.sweep = null; clearExtras(); view.last = null; setBanner("", "");
    if (p.id === "p1") { S.mode = "prove"; S.pid = "G0"; resetProof("G0"); S.side = "L"; S.k = 4; view.hide = true; }
    else if (p.id === "p2") { S.mode = "prove"; S.pid = "G1"; resetProof("G1"); S.side = "L"; S.k = 3; }
    else if (p.id === "p3") { S.mode = "test"; S.cid = "c1"; S.k = 12; view.hide = true; view.marks = [{ k:0, eq:true }, { k:12, eq:true }]; }
    else if (p.id === "p4") { S.mode = "test"; S.cid = "c2"; S.k = 4; view.hide = true; }
    S.pv = S.mode === "test" ? "graph" : "board"; S.panel = "graph"; api.save(); paint();
  }
  function reveal(done){
    view.hide = false; view.reveal = { L:0, R:0 }; paintRead();
    MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ if (view.reveal) { view.reveal.L = t; plot.render(); } }, done:function(){
      MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ if (view.reveal) { view.reveal.R = t; plot.render(); } }, done:function(){ view.reveal = null; plot.render(); done(); } });
    } });
  }
  function sweep(from, to, ms, each, done){
    var k = from;
    (function next(){ setProbe(k); var w = each ? each(k) : 0; if (k >= to) { done(); return; } k++; MV.wait(ms + (w || 0), next); })();
  }
  function runPred(p, done){
    S.pv = "graph"; S.panel = "graph"; paintTop(); plot.render();
    if (p.id === "p1") reveal(function(){ sweep(0, 24, 110, null, function(){ setProbe(4); done(); }); });
    else if (p.id === "p2") runTrap("q", "cancel", "L", function(){ view.coachNote = W.p2coach; paintMoves(); done(); });
    else if (p.id === "p3") reveal(function(){
      view.marks = [];
      sweep(0, 24, 230, function(k){ var a = sin(2 * k * PI / 12), b = 2 * sin(k * PI / 12); view.marks.push({ k:k, eq:Math.abs(a - b) < 1e-9 }); plot.render(); return k === 6 ? 1200 : 0; }, function(){ setProbe(6); done(); });
    });
    else if (p.id === "p4") reveal(function(){ view.shade = true; plot.render(); MV.wait(700, function(){ setProbe(12); done(); }); });
    else done();
  }
  // show each prediction's starting setup while the student is still deciding
  var shownPred = null;
  var predHost = $("#pred");
  if (predHost && window.MutationObserver) new MutationObserver(function(){
    var t = predHost.querySelector(".pred-top .tiny"); if (!t) return;
    var mm = /Prediction (\d+)/.exec(t.textContent); if (!mm) return;
    var p = C.predictions[+mm[1] - 1];
    if (!p || p.id === shownPred) return; shownPred = p.id;
    if (!MV.S.preds[p.id] && !view.busy) startPred(p);
  }).observe(predHost, { childList:true });

  // ----- challenges -----
  function chal(id){
    var c = C.challenges.filter(function(x){ return x.id === id; })[0], M = c.msgs, pid = { tc1:"TC1", tc2:"TC2", tc3:"TC3" }[id], b = board(pid), n = nMoves(pid), done = complete(pid);
    var lines = b.L.concat(b.R).map(function(l){ return l.s; });
    if (!n) return { ok:false, msg:S.pid === pid && S.mode === "prove" ? (id === "tc1" ? M.L0 : M.notYet.replace("{L}", m(src(pid, curS(pid, "L")))).replace("{R}", m(src(pid, curS(pid, "R"))))) : M.pick };
    if (id === "tc1") {
      if (b.R.length) return { ok:false, msg:M.rs };
      var ls = curS(pid, "L");
      if (ls === "L5") return { ok:true };
      return { ok:false, msg:M[ls] || (ls === "L2s" ? M.L1 : M.L0) };
    }
    if (id === "tc2") {
      if (done && n <= 5) return { ok:true };
      if (done) return { ok:false, msg:fill(lines.some(function(s){ return s.charAt(0) === "T"; }) ? M.viaT : M.long, { n:n }) };
      return { ok:false, msg:fill(M.notYet, { L:m(src(pid, curS(pid, "L"))), R:m(src(pid, curS(pid, "R"))) }) };
    }
    if (id === "tc3") {
      if (done && n <= 4) return { ok:true };
      if (done) {
        if (lines.some(function(s){ return /Dd$/.test(s); })) return { ok:false, msg:fill(M.cs, { n:n }) };
        if (lines.some(function(s){ return /Dc2?$/.test(s) || s.charAt(0) === "H"; })) return { ok:false, msg:fill(M.s2, { n:n }) };
        return { ok:false, msg:fill(C.challenges[1].msgs.long, { n:n }) };
      }
      return { ok:false, msg:M.notYet };
    }
    return { ok:false };
  }

  paint();
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: counterexample hunter ----------
var RF = {
  R1:{ L:function(x){ return cos(2 * x); }, R:function(x){ return 2 * cos(x); } },
  R2:{ L:function(x){ return tan(x) * cos(x); }, R:function(x){ return sin(x); } },
  R3:{ L:function(x){ return cos(x - PI / 3); }, R:function(x){ return cos(x) - 0.5; } },
  R4:{ L:function(x){ var t = tan(x), s = 1 / cos(x); return t * t - s * s; }, R:function(){ return 1; } },
  R5:{ L:function(x){ var a = sin(x) + cos(x); return a * a; }, R:function(x){ return 1 + sin(2 * x); } },
  R6:{ L:function(x){ return sin(12 * x); }, R:function(){ return 0; } }
};
function part3(host, api){
  var C = MV.C.part3, U = C.ui, R = C.rounds, S = api.S;
  if (typeof S.i !== "number") S.i = 0; S.fine = !!S.fine; S.diff = !!S.diff; S.r = S.r || {}; if (typeof S.j !== "number") S.j = 16;
  var view = { rev:null, fb:null };
  host.innerHTML = '<div class="hu"><div class="pred-top"><span class="tiny muted" id="hu-n"></span><span class="dots" id="hu-dots" aria-hidden="true"></span></div>' +
    '<div class="hu-claim" id="hu-claim"></div><div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="hu-plot" role="img" tabindex="0" aria-label="Graphs of both sides"></canvas></div>' +
    '<div class="wb-pr"><span class="tiny b">' + U.probe + '</span><button type="button" class="btn ghost pr-btn" data-hp="-1" aria-label="Move the probe left">−</button><input type="range" id="hu-range" min="0" max="24" step="1" aria-label="Probe x"><button type="button" class="btn ghost pr-btn" data-hp="1" aria-label="Move the probe right">+</button>' +
    '<button type="button" class="btn ghost sm hu-fine" id="hu-fine" aria-pressed="false">' + U.fine + '</button><output id="hu-px" class="pr-x"></output></div>' +
    '<div class="seg-wrap"><button type="button" class="btn ghost sm" id="hu-diff" aria-pressed="false">' + U.diff + "</button></div></div>" +
    '<div><dl class="read" id="hu-read" aria-live="polite"></dl><p class="hu-q" id="hu-q"></p><div class="chips hu-v" role="radiogroup" id="hu-v"></div><div class="q-actions" id="hu-act"></div>' +
    '<p class="tiny" id="hu-cx"></p><div id="hu-fb" aria-live="polite"></div><p class="tiny" id="hu-sum"></p><details class="alg" id="hu-alg"><summary>' + U.alg + '</summary><p id="hu-alg-t"></p></details></div></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="hu-prev" data-k="huprev">' + U.prev + '</button><button type="button" class="btn ghost sm" id="hu-next" data-k="hunext">' + U.next + "</button></div></div>";
  var plot = new MV.Plot($("#hu-plot", host), radView([-2, 2])), range = $("#hu-range", host);
  function rd(){ return R[S.i]; }
  function rs(id){ return S.r[id] || (S.r[id] = { hunch:null, locked:false, pick:null, cx:null, tries:0, solved:false, first:null }); }
  function code(r){ return r.undef && r.undef.ls; }
  function vals(r, j){ var x = j * PI / 48, F = RF[r.id], u = undefJ(code(r), j); return { L:u ? NaN : F.L(x), R:F.R(x), u:u }; }
  function verdictT(id){ var v = U.verdicts.filter(function(x){ return x.id === id; })[0]; return v ? v.t : "—"; }
  function cxStatus(r, j){ var v = vals(r, j); if (big(v.L) || big(v.R)) return "undef"; return Math.abs(v.L - v.R) < 1e-9 ? "equal" : "ok"; }
  function stats(){ var f = 0, d = 0, h = 0; R.forEach(function(r){ var x = S.r[r.id]; if (!x) return; if (x.solved) d++; if (x.first) f++; if (x.locked && x.hunch === MV.ans(r)) h++; }); return { f:f, d:d, h:h }; }
  MV.ACTS.hunter = { a:{ id:"hunter" },
    stats:function(){ var s = stats(); return { first:s.f, total:6, done:s.d, line:"Counterexample hunter (first try): " + s.f + "/6; hunches right: " + s.h + "/6" + (s.d < 6 ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; R.forEach(function(r){ var x = S.r[r.id]; if (x && (x.tries > 0)) g = g.concat(MV.goalIdx(r.goal)); }); return g; } };
  plot.render = function(){
    var r = rd(), x = rs(r.id), V = radView(r.ywin), F = RF[r.id], j = S.j, xp = j * PI / 48;
    prep(plot, V);
    var narrow = plot.W < 430, pen = css("--pen"), ink2 = css("--ink-2"), show = x.locked, rev = view.rev || { L:1, R:1 };
    var fL = feats(F.L, code(r), r.id), mL = mask(F.L, code(r));
    var sc = { view:V, xTicks:{ step:PI / 4, fmt:tickFmt(narrow) }, curves:[], points:[], labels:[], regions:[], lines:[] };
    if (show) {
      if (S.diff) sc.regions = gauge(plot, mL, F.R, V).regions;
      sc.lines.push({ p:[xp, 0], q:[xp, 1], color:css("--hi"), width:2.5 });
      if (rev.L > 0) sc.curves.push({ pts:dense(plot, mL, 0, TAU * rev.L), color:pen, width:3 });
      if (rev.R > 0) sc.curves.push({ pts:dense(plot, F.R, 0, TAU * rev.R), color:ink2, width:r.zeroRS ? 3 : 2.4, dash:[6, 6] });
      if (r.zeroRS && rev.R >= 1) sc.labels.push({ x:TAU * 0.98, y:V.ymin + (V.ymax - V.ymin) * 0.12, text:MV.plain(U.rightSide), color:ink2, align:"right", bg:true, font:"italic 13px " + (plot.fontM || "serif") });
      fL.holes.forEach(function(h){ if (h.x <= TAU * rev.L + 1e-9) sc.points.push({ x:h.x, y:h.y, open:true, color:pen }); });
      var v = vals(r, j);
      if (!big(v.L) && rev.L >= 1) sc.points.push({ x:xp, y:v.L, r:5, color:pen });
      if (!big(v.R) && rev.R >= 1) sc.points.push({ x:xp, y:v.R, r:4, color:ink2 });
    }
    sc.after = function(ctx, p){ if (!show) hiddenMsg(ctx, p, MV.plain(U.hidden)); };
    var vv = vals(r, j);
    sc.describe = "Graphs for the claim " + MV.plain(m(r.claim)) + ". " + (show ? "Left side solid, right side dashed." + (fL.holes.length ? " Open circles where the left side is undefined." : "") + " Probe at " + piTxt(j) + ": left side " + (big(vv.L) ? "undefined" : num(vv.L, 2)) + ", right side " + num(vv.R, 2) + "." : "The graphs are hidden until you lock in your hunch.");
    plot.draw(sc);
  };
  function paintRead(){
    var r = rd(), x = rs(r.id), j = S.j, v = vals(r, j), ex = exactAt(j, r.angles || "x");
    var step = S.fine ? 1 : 4;
    range.max = S.fine ? 96 : 24; range.value = Math.round(j / step); range.setAttribute("aria-valuetext", "x = " + piTxt(j));
    $("#hu-px", host).innerHTML = m("x = " + piSrc(j));
    var lh = valHTML(v.L, ex), rh = valHTML(v.R, ex), here;
    if (!lh) here = fill(U.undef, { side:"Left", reason:(r.reasons && r.reasons.ls) || "a bottom is 0" });
    else here = Math.abs(v.L - v.R) < 1e-9 ? U.equal : U.differ;
    $("#hu-read", host).innerHTML = MV.readoutHTML([["Claim", m(r.claim)], ["Probe", x.locked ? "At " + m("x = " + piTxt(j)) + ": left side = " + (lh || "undefined") + ", right side = " + rh : "—"], ["Here", x.locked ? here : "—"]]);
  }
  function chipsHTML(sel, dis){
    return U.verdicts.map(function(o){ return '<button type="button" class="chip' + (sel === o.id ? " on" : "") + '" role="radio" aria-checked="' + (sel === o.id) + '" data-v="' + o.id + '" data-k="huv' + o.id + '"' + (dis ? " disabled" : "") + ">" + o.t + "</button>"; }).join("");
  }
  function paint(){
    var r = rd(), x = rs(r.id), ans = MV.ans(r);
    $("#hu-n", host).textContent = fill(U.round, { i:S.i + 1 }) + (r.stretch ? " (stretch)" : "");
    $("#hu-dots", host).innerHTML = R.map(function(q, i){ var y = S.r[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#hu-claim", host).innerHTML = '<p class="hu-ct">Claim: ' + m(r.claim) + "</p>" + (r.note ? '<p class="wb-note">' + r.note + "</p>" : "");
    $("#hu-q", host).innerHTML = x.locked ? U.finalQ : U.hunchQ;
    MV.keepFocus($("#hu-v", host), function(){ $("#hu-v", host).innerHTML = chipsHTML(x.locked ? x.pick : x.hunch, x.solved); });
    var act = "";
    if (!x.locked) act = '<button type="button" class="btn primary sm" data-act="lock" data-k="hulock"' + (x.hunch ? "" : " disabled") + ">" + U.lock + "</button>";
    else if (!x.solved) act = '<button type="button" class="btn sm" data-act="use" data-k="huuse"' + (x.pick && x.pick !== "id" ? "" : " disabled") + ">" + U.use + '</button><button type="button" class="btn primary sm" data-act="submit" data-k="husub"' + (x.pick && (x.pick === "id" || x.cx != null) ? "" : " disabled") + ">" + U.submit + "</button>";
    MV.keepFocus($("#hu-act", host), function(){ $("#hu-act", host).innerHTML = act; });
    $("#hu-cx", host).innerHTML = x.locked && !x.solved && x.pick && x.pick !== "id" ? (x.cx != null ? fill(U.cxSet, { x:m("x = " + piTxt(x.cx)) }) : U.cxNeed) : "";
    var fb = "";
    if (x.solved) fb = '<div class="fb good" role="status"><p><strong>' + U.solved + "</strong>" + (x.first ? "" : ' <span class="muted">' + U.notFirst + "</span>") + (ans !== "id" && x.cx != null ? " " + m("x = " + piTxt(x.cx)) + " is a counterexample." : "") + "</p></div>";
    else if (view.fb) fb = '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + view.fb + "</p></div>";
    $("#hu-fb", host).innerHTML = fb;
    $("#hu-sum", host).innerHTML = x.solved ? fill(U.summary, { h:verdictT(x.hunch), v:verdictT(x.pick) }) : "";
    var alg = $("#hu-alg", host); $("#hu-alg-t", host).innerHTML = r.alg; alg.hidden = !x.solved; if (x.solved && !alg.dataset.opened) { alg.open = true; alg.dataset.opened = "1"; }
    var fine = $("#hu-fine", host); fine.setAttribute("aria-pressed", S.fine); fine.classList.toggle("on", S.fine);
    var dif = $("#hu-diff", host); dif.setAttribute("aria-pressed", S.diff); dif.classList.toggle("on", S.diff);
    $("#hu-prev", host).disabled = S.i === 0; $("#hu-next", host).disabled = S.i === R.length - 1;
    paintRead(); plot.render();
  }
  function setJ(j){ S.j = Math.max(0, Math.min(96, j)); if (!S.fine) S.j = Math.round(S.j / 4) * 4; api.save(); paintRead(); plot.render(); }
  function submit(){
    var r = rd(), x = rs(r.id), ans = MV.ans(r), msg = null;
    if (x.pick !== ans) {
      if (r.fb.cxUndef && x.cx != null && x.pick !== "id" && cxStatus(r, x.cx) === "undef") msg = r.fb.cxUndef;
      else msg = r.fb[x.pick] || "Look at the two graphs again and compare them with your verdict.";
    } else if (ans !== "id") {
      var c = x.cx == null ? "none" : cxStatus(r, x.cx);
      if (c === "none") msg = U.cxNeed;
      else if (c === "undef") msg = r.fb.cxUndef || U.rightCx + " " + fill(U.undef, { side:"Left", reason:(r.reasons && r.reasons.ls) || "" });
      else if (c === "equal") { var v = vals(r, x.cx); msg = r.fb.cxEqual ? fill(r.fb.cxEqual, { v:valHTML(v.L, exactAt(x.cx, r.angles || "x")) }) : U.rightCx; }
    }
    if (msg) { x.tries++; view.fb = msg; }
    else { x.solved = true; x.first = x.tries === 0; view.fb = null; }
    api.save(); paint(); MV.focusFb($("#hu-fb", host).parentNode);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var r = rd(), x = rs(r.id);
    if (b.dataset.v) { if (x.locked) { x.pick = b.dataset.v; if (x.pick === "id") x.cx = null; } else x.hunch = b.dataset.v; view.fb = null; api.save(); paint(); return; }
    if (b.dataset.act === "lock") {
      x.locked = true; api.save(); view.rev = { L:0, R:0 }; paint();
      MV.tween({ dur:800, ease:function(t){ return t; }, step:function(t){ if (view.rev) { view.rev.L = t; plot.render(); } }, done:function(){
        MV.tween({ dur:800, ease:function(t){ return t; }, step:function(t){ if (view.rev) { view.rev.R = t; plot.render(); } }, done:function(){ view.rev = null; plot.render(); } });
      } });
      var f = $("#hu-v button", host); if (f) f.focus();
      return;
    }
    if (b.dataset.act === "use") { x.cx = S.j; view.fb = null; api.save(); paint(); return; }
    if (b.dataset.act === "submit") { submit(); return; }
    if (b.dataset.hp) { setJ(S.j + (+b.dataset.hp) * (S.fine ? 1 : 4)); return; }
    if (b.id === "hu-fine") { S.fine = !S.fine; setJ(S.j); paint(); return; }
    if (b.id === "hu-diff") { S.diff = !S.diff; api.save(); paint(); return; }
    if (b.id === "hu-prev" || b.id === "hu-next") { S.i += b.id === "hu-prev" ? -1 : 1; view.fb = null; view.rev = null; api.save(); paint(); var a = $("#hu-alg", host); delete a.dataset.opened; return; }
  });
  range.addEventListener("input", function(){ setJ(+range.value * (S.fine ? 1 : 4)); });
  function keys(e, onRange){
    var st = S.fine ? 1 : 4, j = S.j;
    if (e.key === "PageUp" || (e.shiftKey && (e.key === "ArrowRight" || e.key === "ArrowUp"))) j += 24;
    else if (e.key === "PageDown" || (e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowDown"))) j -= 24;
    else if (!onRange && (e.key === "ArrowRight" || e.key === "ArrowUp")) j += st;
    else if (!onRange && (e.key === "ArrowLeft" || e.key === "ArrowDown")) j -= st;
    else if (!onRange && e.key === "Home") j = 0;
    else if (!onRange && e.key === "End") j = 96;
    else return;
    e.preventDefault(); setJ(j);
  }
  range.addEventListener("keydown", function(e){ keys(e, true); });
  plot.c.addEventListener("keydown", function(e){ keys(e, false); });
  plot.c.addEventListener("pointerdown", function(e){ var r = plot.c.getBoundingClientRect(), xx = plot.xOf(e.clientX - r.left), st = S.fine ? 1 : 4; setJ(Math.round(xx / (PI / 48) / st) * st); });
  $("#hu-v", host).addEventListener("keydown", function(e){
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    var bs = Array.prototype.slice.call(this.querySelectorAll("button:not([disabled])")), i = bs.indexOf(document.activeElement); if (i < 0 || !bs.length) return;
    e.preventDefault(); var nb = bs[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : bs.length - 1)) % bs.length]; nb.click(); var again = $('[data-k="' + nb.dataset.k + '"]', host); if (again) again.focus();
  });
  paint();
  return {};
}

// ---------- Practice 1: put the proof in order, with a decoy tray ----------
// @component N5 orderTray — N5 ordering with fixed first and last lines and a one-slot decoy tray (To tray / Back to list);
//   Check reports a tray holding a proof line, a decoy left in the proof, or the first line out of place (named orders);
//   move tags appear after a correct check.
function orderAct(host, api, a){
  var S = api.S, U = a.ui; S.seq = S.seq || {};
  var sel = {}, msgs = {};
  function sq(s){ return S.seq[s.id] || (S.seq[s.id] = { list:s.steps.map(function(_, i){ return i; }), tray:null, tries:0, hint:0, solved:false, first:null }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.sequences.map(function(s, si){
        var x = sq(s), ans = x.solved ? MV.ans(s) : null, cur = sel[s.id], mk = msgs[s.id];
        var h = '<div class="q' + (si ? " part" : "") + '" data-seq="' + s.id + '" style="border-bottom:0"><p class="task">' + fill(U.seq, { i:si + 1 }) + s.prompt + "</p>";
        h += '<ol class="olist po-list"><li class="po-fixed"><span class="po-in">' + s.first + "</span></li>";
        h += x.list.map(function(stepI, pos){
          var isSel = cur === "p" + pos && !x.solved, cls = "ostep" + (x.solved ? " good" : (mk && mk.pos === pos ? " bad" : ""));
          var tag = ans ? '<span class="wb-tag">' + ans.tags[ans.order.indexOf(stepI)] + "</span>" : "";
          return '<li><button type="button" class="' + cls + '" aria-pressed="' + isSel + '" data-k="' + s.id + "s" + stepI + '" data-pos="' + pos + '"' + (x.solved ? " disabled" : "") + '><span class="sn">' + (pos + 1) + '.</span><span class="po-in">' + s.steps[stepI] + "</span>" + tag + "</button>" +
            (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + s.id + 'up"' + (pos === 0 ? " disabled" : "") + ">" + U.up + '</button><button type="button" class="btn ghost" data-mv="down" data-k="' + s.id + 'down"' + (pos === x.list.length - 1 ? " disabled" : "") + ">" + U.down + '</button><button type="button" class="btn ghost" data-mv="tray" data-k="' + s.id + 'tray">' + U.toTray + "</button></span>" : "") + "</li>";
        }).join("");
        h += '<li class="po-fixed"><span class="po-in">' + s.last + "</span></li></ol>";
        var trSel = cur === "t" && !x.solved;
        h += '<div class="po-tray' + (mk && mk.tray ? " bad" : "") + '"><p class="tiny b">' + U.tray + "</p>" + (x.tray == null ? '<p class="tiny muted po-empty">' + U.trayEmpty + "</p>" :
          '<div class="po-trow"><button type="button" class="ostep' + (x.solved ? " good" : "") + '" aria-pressed="' + trSel + '" data-tr="1" data-k="' + s.id + 'tr"' + (x.solved ? " disabled" : "") + '><span class="po-in">' + s.steps[x.tray] + "</span>" + (ans ? '<span class="wb-tag">' + ans.decoyTag + "</span>" : "") + "</button>" +
          (trSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="back" data-k="' + s.id + 'back">' + U.back + "</button></span>" : "") + "</div>") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + s.id + 'chk">' + U.check + "</button>" + MV.hintBtn(s.id + "hint", x.hint) + "</div>" + MV.hintsHTML(s.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>' + U.good + "</strong>" + (x.first ? "" : ' <span class="muted">' + U.notFirst + "</span>") + "</p></div>";
        else if (mk) h += '<div class="fb bad" role="status"><p><strong>✗ Not yet.</strong> ' + mk.html + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  function check(s, x){
    var ans = MV.ans(s), okList = x.list.length === ans.order.length && x.list.every(function(v, i){ return v === ans.order[i]; });
    if (x.tray === ans.decoy && okList) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[s.id] = null; sel[s.id] = null; return; }
    x.tries++;
    if (x.tray != null && x.tray !== ans.decoy) { msgs[s.id] = { tray:true, html:U.trayBad }; return; }
    if (x.list.indexOf(ans.decoy) >= 0) { msgs[s.id] = { pos:x.list.indexOf(ans.decoy), html:U.decoyIn + " " + s.decoyFb }; return; }
    var pos = 0; while (pos < x.list.length && x.list[pos] === ans.order[pos]) pos++;
    var at = function(n){ return x.list.indexOf(ans.order[n - 1]); };
    var named = (s.wrong || []).filter(function(w){ return at(w.above) < at(w.below); })[0];
    msgs[s.id] = { pos:pos, html:named ? named.fb : fill(U.out, { n:pos + 1 }) };
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-seq]"); if (!box) return;
    var s = a.sequences.filter(function(q){ return q.id === box.dataset.seq; })[0], x = sq(s), cur = sel[s.id];
    if (b.dataset.pos != null) { var k = "p" + b.dataset.pos; sel[s.id] = cur === k ? null : k; paint(); return; }
    if (b.dataset.tr) { sel[s.id] = cur === "t" ? null : "t"; paint(); return; }
    if (b.dataset.mv) {
      var focusK = null;
      if (b.dataset.mv === "back" && x.tray != null) { x.list.push(x.tray); x.tray = null; sel[s.id] = "p" + (x.list.length - 1); }
      else if (cur && cur.charAt(0) === "p") {
        var i = +cur.slice(1);
        if (b.dataset.mv === "tray") { var out = x.list[i]; if (x.tray != null) x.list.splice(i, 1, x.tray); else x.list.splice(i, 1); x.tray = out; sel[s.id] = "t"; focusK = s.id + "tr"; }
        else { var j = b.dataset.mv === "up" ? i - 1 : i + 1; if (j < 0 || j >= x.list.length) return; var t = x.list[i]; x.list[i] = x.list[j]; x.list[j] = t; sel[s.id] = "p" + j; focusK = s.id + b.dataset.mv; }
      }
      msgs[s.id] = null; api.save(); paint();
      var nb = focusK && host.querySelector('[data-k="' + focusK + '"]'); if (nb && !nb.disabled) nb.focus();
      return;
    }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") { check(s, x); api.save(); paint(); MV.focusFb(host.querySelector('[data-seq="' + s.id + '"]')); }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.sequences.forEach(function(s){ var x = sq(s); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.sequences.length, done:d, line:a.summary + " (first try): " + f + "/" + a.sequences.length + (d < a.sequences.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.sequences.forEach(function(s){ var x = sq(s); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(s.goal)); }); return g; }
  };
}

// ---------- Practice 2: make it an identity ----------
// @component N4 identityBoxes — fill-in-the-coefficients statement with number boxes inline in the math (superscript
//   and stacked-fraction boxes too), range checks, named wrong answers, and an N23 overlay-gauge preview after each check.
var MK = {
  mi1:{ L:function(x){ return (1 - sin(x)) * (1 + sin(x)); }, R:function(x, v){ return v.a * Math.pow(cos(x), v.n); } },
  mi2:{ L:function(x){ return tan(x) + 1 / tan(x); }, R:function(x, v){ return v.a / sin(v.k * x); }, U:"sc" },
  mi3:{ L:function(x){ return Math.pow(sin(x), 4) - Math.pow(cos(x), 4); }, R:function(x, v){ return v.a * cos(v.k * x); } },
  mi4:{ L:function(x){ var c = cos(x), s = sin(x); return 1 / (c * c) + 1 / (s * s); }, R:function(x, v){ var s = sin(v.k * x); return v.a / (s * s); }, U:"sc" },
  mi5:{ L:function(x){ return cos(3 * x); }, R:function(x, v){ var c = cos(x); return v.a * c * c * c + v.b * c; } },
  mi6:{ L:function(x){ return sin(3 * x); }, R:function(x, v){ var s = sin(x); return v.a * s + v.b * s * s * s; } },
  mi7:{ L:function(x){ return tan(x + PI / 4); }, R:function(x, v){ var t = tan(x); return (v.a + t) / (v.b - t); } },
  mi8:{ L:function(x){ return cos(x + PI / 6) * cos(x - PI / 6); }, R:function(x, v){ var c = cos(x); return c * c - v.p / v.q; } }
};
var RANGE = { ab:[-6, 6], k:[1, 6], n:[1, 4], int:[-999, 999] };
function makeAct(host, api, a){
  var S = api.S, U = a.ui; if (typeof S.i !== "number") S.i = 0; S.items = S.items || {};
  var msg = {};
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { v:{}, tries:0, hint:0, solved:false, first:null, pv:null }); }
  function box(it, k, x){ return '<input type="number" step="1" class="mk-box" data-box="' + k + '" aria-label="Box ' + k + '" value="' + MV.esc(x.v[k] == null ? "" : x.v[k]) + '"' + (x.solved ? " disabled" : "") + ">"; }
  function partsHTML(it, x, parts){
    return parts.map(function(p){
      if (typeof p === "object") return '<span class="mk-frac"><span class="mk-fn">' + partsHTML(it, x, p.num) + '</span><span class="mk-fd">' + partsHTML(it, x, p.den) + "</span></span>";
      if (p.charAt(0) === "#") return box(it, p.slice(1), x);
      if (p.charAt(0) === "^") return '<sup class="mk-sup">' + box(it, p.slice(1), x) + "</sup>";
      return m(p.replace(/^ +/, "&nbsp;").replace(/ +$/, "&nbsp;"));
    }).join("");
  }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="mk-n"></span><span class="dots" id="mk-dots" aria-hidden="true"></span></div>' +
    '<div class="mk-wrap"><div><p class="mk-st" id="mk-st"></p><div class="q-actions"><button type="button" class="btn primary sm" id="mk-check" data-k="mkchk">' + U.check + '</button><span id="mk-hint"></span></div><div id="mk-hints"></div><div id="mk-fb" aria-live="polite"></div></div>' +
    '<div class="mk-pv" id="mk-pv" hidden><canvas class="plot" id="mk-plot" role="img" aria-label="Both sides graphed"></canvas><p class="tiny" id="mk-gap"></p></div></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="mk-prev" data-k="mkprev">' + U.prev + '</button><button type="button" class="btn ghost sm" id="mk-next" data-k="mknext">' + U.next + "</button></div>";
  var plot = new MV.Plot($("#mk-plot", host), radView([-2, 2]));
  plot.render = function(){
    var it = a.items[S.i], x = ist(it); if (!x.pv) return;
    var F = MK[it.id], V = radView(it.ywin), v = x.pv, Lf = mask(F.L, F.U), Rf = function(t){ return F.R(t, v); };
    prep(plot, V);
    var g = gauge(plot, Lf, Rf, V);
    plot.draw({ view:V, xTicks:{ step:PI / 4, fmt:tickFmt(plot.W < 430) }, regions:g.regions, curves:[{ pts:dense(plot, Lf, 0, TAU), color:css("--pen"), width:3 }, { pts:dense(plot, Rf, 0, TAU), color:css("--ink-2"), width:2.4, dash:[6, 6] }],
      segments:gaugeMarker(g.gap), describe:"Left side solid, right side dashed. " + (g.gap ? "Largest gap on screen about " + num(g.gap.d, 2) + " near x = " + num(g.gap.x, 2) + "." : "The two graphs are one curve.") });
    $("#mk-gap", host).innerHTML = g.gap ? fill(U.gap, { g:"≈ " + num(g.gap.d, 2) }) + " " + U.gapNote : U.gap0;
  };
  function read(it, x){
    var out = {}, bad = false, frac = false;
    Object.keys(it.boxes).forEach(function(k){
      var raw = x.v[k], v = raw === "" || raw == null ? NaN : Number(raw), rg = RANGE[it.boxes[k]];
      if (it.boxes[k] === "int") frac = true;
      if (!isFinite(v) || Math.round(v) !== v || v < rg[0] || v > rg[1] || (k === "q" && v === 0)) bad = true;
      out[k] = v;
    });
    return bad ? { bad:true, frac:frac, empty:Object.keys(it.boxes).some(function(k){ return x.v[k] == null || x.v[k] === ""; }) } : { v:out };
  }
  function paint(){
    var it = a.items[S.i], x = ist(it);
    $("#mk-n", host).textContent = fill(U.item, { i:S.i + 1 }) + (it.star ? " ★" : "");
    $("#mk-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    MV.keepFocus($("#mk-st", host), function(){ $("#mk-st", host).innerHTML = partsHTML(it, x, it.parts); });
    $("#mk-check", host).disabled = x.solved;
    $("#mk-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("mkh" + it.id, x.hint);
    $("#mk-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    $("#mk-fb", host).innerHTML = x.solved ? '<div class="fb good" role="status"><p><strong>' + U.good + "</strong>" + (x.first ? "" : ' <span class="muted">' + U.notFirst + "</span>") + "</p></div>" : (msg[it.id] ? '<div class="fb bad" role="status"><p>' + msg[it.id] + "</p></div>" : "");
    $("#mk-pv", host).hidden = !x.pv; if (x.pv) plot.render();
    $("#mk-prev", host).disabled = S.i === 0; $("#mk-next", host).disabled = S.i === a.items.length - 1;
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.box; if (!k) return; var it = a.items[S.i]; ist(it).v[k] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.box) $("#mk-check", host).click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = ist(it);
    if (b.id === "mk-prev" || b.id === "mk-next") { S.i += b.id === "mk-prev" ? -1 : 1; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id === "mk-check") {
      var r = read(it, x);
      if (r.bad) { msg[it.id] = r.empty ? U.fill : (r.frac ? U.fracRange : U.range); paint(); return; }
      var ans = MV.ans(it), v = r.v, ok = ans.frac != null ? Math.abs(v.p / v.q - ans.frac) < 1e-9 : Object.keys(ans).every(function(k){ return v[k] === ans[k]; });
      x.pv = v;
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
      else {
        x.tries++;
        var named = (it.wrong || []).filter(function(w){ return w.v ? Object.keys(w.v).every(function(k){ return w.v[k] === v[k]; }) : Math.abs(v.p / v.q - w.val) < 1e-9; })[0];
        msg[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : U.fallback);
      }
      api.save(); paint(); MV.focusFb(host);
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: flatten the wave ----------
var task = (function(){
  var api, plot, T;
  function read(){
    var s = api ? api.S : {}, raw = ["p", "q", "r"].map(function(k){ return s[k] == null ? "" : String(s[k]); });
    var v = raw.map(function(t){ return t.trim() === "" ? NaN : Number(t); });
    return { raw:raw, v:v, nums:v.every(function(x){ return isFinite(x); }) };
  }
  function fr(v){ return MV.frac(v, 2); }
  function shape(d){ var p = d.v[0], q = d.v[1], r = d.v[2], mid = (p + q) / 2, amp = Math.abs((q - p) / 2 + r); return { mid:mid, max:mid + amp, min:mid - amp, f:function(x){ return p * sin(x) * sin(x) + q * cos(x) * cos(x) + r * cos(2 * x); } }; }
  function capSrc(d){
    if (!d.nums) return "y = p sin^2x + q cos^2x + r cos 2x";
    var terms = [[d.v[0], "sin^2x", ""], [d.v[1], "cos^2x", ""], [d.v[2], "cos 2x", " "]], out = "";
    terms.forEach(function(t){
      var c = t[0]; if (!c) return;
      var a = Math.abs(c), co = a === 1 ? "" : num(a) + t[2];
      out += (out ? (c < 0 ? " - " : " + ") : (c < 0 ? "-" : "")) + co + t[1];
    });
    return "y = " + (out || "0");
  }
  function draw(){
    var d = read(), V = radView([-13, 13]);
    prep(plot, V);
    var sc = { view:V, xTicks:{ step:PI / 4, fmt:tickFmt(plot.W < 430) }, yTicks:{ step:3 }, lines:[{ p:[0, 3], q:[1, 3], color:css("--ink-2"), dash:[8, 6], width:2 }], curves:[], regions:[], labels:[{ x:TAU, y:3, text:MV.plain(T.ui.target), align:"right", dy:-14, color:css("--ink-2"), bg:true, font:"italic 13px " + (plot.fontM || "serif") }] };
    var h = $("#fw-read");
    if (d.nums) {
      var s = shape(d);
      sc.regions = gauge(plot, s.f, function(){ return 3; }, V).regions;
      sc.curves.push({ pts:dense(plot, s.f, 0, TAU), color:css("--pen"), width:3 });
      sc.describe = "Graph of " + MV.plain(m(capSrc(d))) + " from 0 to 2π, with the target line y = 3. Highest value " + fr(s.max) + ", lowest value " + fr(s.min) + ".";
      if (h) h.innerHTML = fill(T.ui.hi, { max:m(fr(s.max).replace(MV.MINUS, "-")), min:m(fr(s.min).replace(MV.MINUS, "-")) });
    } else { sc.describe = "Target line y = 3. Enter p, q and r to see your graph."; if (h) h.innerHTML = T.ui.empty; }
    plot.draw(sc);
    var cp = $("#fw-cap"); if (cp) cp.innerHTML = m(capSrc(d));
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task;
      inp.innerHTML = '<div class="fw-in">' + ["p", "q", "r"].map(function(k){
        return '<div class="fw-row"><label for="fw-' + k + '" class="fw-name">' + m(k + " =") + '</label><button type="button" class="btn ghost pr-btn" data-step="' + k + '" data-d="-1" aria-label="' + T.ui.minus + " " + k + '">−</button>' +
          '<input type="number" step="1" min="-6" max="6" id="fw-' + k + '" data-fw="' + k + '" class="fw-box" autocomplete="off" value="' + MV.esc(a.S[k] == null ? "" : a.S[k]) + '"><button type="button" class="btn ghost pr-btn" data-step="' + k + '" data-d="1" aria-label="' + T.ui.plus + " " + k + '">+</button></div>';
      }).join("") + '</div><p class="fw-cap" id="fw-cap" aria-live="polite"></p>';
      pv.innerHTML = '<canvas class="plot" id="fw-plot" role="img" aria-label="Your graph and the target line y = 3"></canvas><p class="tiny" id="fw-read" aria-live="polite"></p>';
      plot = new MV.Plot($("#fw-plot"), radView([-13, 13])); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.fw; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-step]"); if (!b) return;
        var k = b.dataset.step, cur = Number(a.S[k]); if (!isFinite(cur) || a.S[k] === "" || a.S[k] == null) cur = 0; else cur += +b.dataset.d;
        cur = Math.max(-6, Math.min(6, Math.round(cur))); a.S[k] = String(cur); $("#fw-" + k).value = cur; a.save(); draw(); a.update();
      });
      draw();
    },
    read:read,
    valid:function(d){ return d.nums ? true : MV.C.task.tips[0]; },
    checks:function(d){
      if (!d.nums) return [false, false, false, false];
      var p = d.v[0], q = d.v[1], r = d.v[2];
      return [d.v.every(function(v){ return Math.round(v) === v && v >= -6 && v <= 6; }), p !== q, Math.abs((q + r) - (p - r)) < 1e-9, Math.abs((p + q) / 2 - 3) < 1e-9];
    },
    tips:function(d, c){
      var TT = MV.C.task.tips, out = [];
      if (!c[0]) return [TT[0]];
      var s = shape(d), F = function(v){ return m(fr(v).replace(MV.MINUS, "-")); };
      if (!c[1]) out.push(TT[1]);
      if (!c[2]) out.push(fill(TT[2], { min:F(s.min), max:F(s.max) }));
      else if (!c[3]) out.push(fill(TT[3], { v:F(s.mid) }));
      return out;
    },
    key:function(d){
      setTimeout(function(){ var st = MV.taskState(), fb = $("#task-fb .fb.good"); if (fb && st.found.length >= 6 && !fb.querySelector(".fw-all")) fb.insertAdjacentHTML("beforeend", '<p class="fw-all"><strong>' + MV.C.task.all6 + "</strong></p>"); }, 0);
      return d.v.join(",");
    },
    label:function(k){ return "(" + k.split(",").map(function(v){ return num(+v); }).join(", ") + ")"; },
    text:function(k){ return "(" + k.split(",").map(function(v){ return num(+v); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ order:orderAct, make:makeAct },
  task:task
});
})();
