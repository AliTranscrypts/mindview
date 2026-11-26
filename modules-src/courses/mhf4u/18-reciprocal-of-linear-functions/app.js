// MHF4U 18 Reciprocal of Linear Functions: hero, Reciprocal twin (Explore), Closing in (Part 3), Line meets its twin
// (matching thumbnails), Work backwards, Design a reciprocal (task). Plan: mhf4u/plan/modules/18-…md
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, M = MV.m;

// ---------- numbers ----------
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function near(a, b){ return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
function isInt(v){ return Math.abs(v - Math.round(v)) < 1e-9; }
function ratOf(v){ for (var d = 1; d <= 600; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9 * Math.max(1, Math.abs(v))) return [n, d]; } return null; }
// Number format rule: whole numbers as integers; decimals that end within 3 places; otherwise a reduced fraction.
function F(v){
  if (isInt(v)) return num(Math.round(v));
  if (Math.abs(Math.round(v * 1000) / 1000 - v) < 1e-9) return num(v, 3);
  var r = ratOf(v); return r ? (r[0] < 0 ? MINUS : "") + Math.abs(r[0]) + "/" + r[1] : num(v, 3);
}
// Reciprocal of a line value L: 1/n when L is a whole number n other than ±1.
function RF(L){ if (isInt(L)) { var n = Math.round(L); return Math.abs(n) === 1 ? num(n) : (n < 0 ? MINUS : "") + "1/" + Math.abs(n); } return F(1 / L); }
// fraction form (products in Work backwards match the clue’s 1/4)
function Fr(v){ var r = ratOf(v); return !r ? F(v) : r[1] === 1 ? num(r[0]) : (r[0] < 0 ? MINUS : "") + Math.abs(r[0]) + "/" + r[1]; }
function tpl(s, o){ return String(s || "").replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : m; }); }
function lin(t){ return t; }
// m() source for a coefficient's size: integer, decimal or a small stacked fraction
function coefM(v){ var t = F(v); if (t.indexOf("/") < 0) return t; var p = t.replace(MINUS, "").split("/"); return "{" + p[0] + "}/{" + p[1] + "}"; }
// kx − c with simplified signs ("x", "−x", "+ 2", just "kx" when c = 0)
function lineM(k, c){
  var s = (k < 0 ? "-" : "") + (near(Math.abs(k), 1) ? "" : coefM(Math.abs(k))) + "x";
  if (!near(c, 0)) s += (c > 0 ? " - " : " + ") + coefM(Math.abs(c));
  return s;
}
function recipM(k, c, stacked){
  var l = lineM(k, c);
  if (l === "x") return "y = 1/x";
  return stacked ? "y = {1}/{" + l + "}" : "y = 1/(" + l + ")";
}
function factM(k, z){
  if (near(z, 0) || near(k, 1)) return null;
  return (near(k, -1) ? "-" : coefM(Math.abs(k)).replace(/^/, k < 0 ? "-" : "")) + "(x " + (z > 0 ? "- " + F(z) : "+ " + F(-z)) + ")";
}
function ptTxt(x, y){ return '<span class="nw">(' + F(x) + ", " + F(y) + ")</span>"; }

// ---------- exact fractions (task) ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function Q(n, d){ if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n:n / g, d:d / g }; }
function decQ(t){ var p = t.split("."), f = p[1] || ""; return { n:parseInt((p[0] || "0") + f, 10), d:Math.pow(10, f.length) }; }
function parseQ(raw){
  var s = String(raw == null ? "" : raw).trim().replace(/[−–]/g, "-").replace(/\s+/g, "");
  var m = /^([+-]?)(\d+(?:\.\d+)?|\.\d+)(?:\/([+-]?)(\d+(?:\.\d+)?|\.\d+))?$/.exec(s);
  if (!m || s.length > 14) return null;
  var a = decQ(m[2]); if (m[1] === "-") a.n = -a.n;
  if (m[4] == null) return Q(a.n, a.d);
  var b = decQ(m[4]); if (m[3] === "-") b.n = -b.n;
  if (b.n === 0) return null;
  return Q(a.n * b.d, a.d * b.n);
}
function qsub(a, b){ return Q(a.n * b.d - b.n * a.d, a.d * b.d); }
function qmul(a, b){ return Q(a.n * b.n, a.d * b.d); }
function qdiv(a, b){ return Q(a.n * b.d, a.d * b.n); }
function qv(a){ return a.n / a.d; }
function qtxt(a){ return a.d === 1 ? num(a.n) : (a.n < 0 ? MINUS : "") + Math.abs(a.n) + "/" + a.d; }

// ---------- drawing the reciprocal (G1, G16) ----------
// @component G1+G16 recipPieces — y = 1/(k(x − z)) as two pieces sampled densely near the asymptote, arrowheads at all four ends (piecePts, endHeads, drawRecip, asymLabels)
// Points of one piece of y = 1/(k(x − z)) for view v (side −1 left, +1 right), dense in y near the asymptote.
function piecePts(k, z, v, side){
  var span = v.xmax - v.xmin, yr = v.ymax - v.ymin, ylim = Math.max(Math.abs(v.ymin), Math.abs(v.ymax)) + yr;
  var x0 = v.xmin - span * 0.02, x1 = v.xmax + span * 0.02, gap = 1 / (Math.abs(k) * ylim);
  var a = side < 0 ? x0 : Math.max(x0, z + gap), b = side < 0 ? Math.min(x1, z - gap) : x1;
  if (!(b > a)) return [];
  var xs = [], i, N = 260, lo = yr * 0.02, s = side * (k > 0 ? 1 : -1);
  for (i = 0; i <= N; i++) xs.push(a + (b - a) * i / N);
  for (i = 0; i <= 200; i++) { var yy = lo * Math.pow(ylim / lo, i / 200), xx = z + 1 / (k * s * yy); if (xx > a && xx < b) xs.push(xx); }
  xs.sort(function(p, q){ return p - q; });
  return xs.map(function(x){ return [x, 1 / (k * (x - z))]; });
}
// arrowheads at both visible ends of a piece
function endHeads(p, pts, color, size){
  var v = p.v, ins = function(q){ return q[0] >= v.xmin && q[0] <= v.xmax && q[1] >= v.ymin && q[1] <= v.ymax; };
  var i0 = -1, i1 = -1, i;
  for (i = 0; i < pts.length; i++) if (ins(pts[i])) { i0 = i; break; }
  for (i = pts.length - 1; i >= 0; i--) if (ins(pts[i])) { i1 = i; break; }
  if (i0 < 0 || i1 - i0 < 2) return;
  function back(i, dir){ var X0 = p.X(pts[i][0]), Y0 = p.Y(pts[i][1]), j = i; while (j + dir >= 0 && j + dir < pts.length) { j += dir; if (Math.hypot(p.X(pts[j][0]) - X0, p.Y(pts[j][1]) - Y0) >= 14) break; } return j; }
  p.head(pts[back(i0, 1)], pts[i0], color, size || 13);
  p.head(pts[back(i1, -1)], pts[i1], color, size || 13);
}
// both pieces; rev = {l, r} draw progress (0..1) or null for complete
function drawRecip(p, k, z, opt){
  opt = opt || {};
  var col = opt.color || css("--pen"), w = opt.width || 3.2, rev = opt.rev;
  [[-1, rev ? rev.l : 1], [1, rev ? rev.r : 1]].forEach(function(pc){
    if (pc[1] <= 0) return;
    var pts = piecePts(k, z, p.v, pc[0]); if (!pts.length) return;
    if (pc[1] < 1) pts = pts.slice(0, Math.max(2, Math.ceil(pts.length * pc[1])));
    p.curve({ pts:pts, color:col, width:w });
    if (pc[1] >= 1 && opt.heads !== false) endHeads(p, pts, col, opt.head);
  });
}
function bgLabel(ctx, p, txt, X, Y, align, color, font){
  ctx.save(); ctx.font = font || ("600 13px " + (p.fontM || "serif")); ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
  var w = ctx.measureText(txt).width, bx = align === "right" ? X - w : align === "center" ? X - w / 2 : X;
  bx = clamp(bx, 2, p.W - w - 2); X = align === "right" ? bx + w : align === "center" ? bx + w / 2 : bx;
  ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(bx - 3, Y - 9, w + 6, 18); ctx.globalAlpha = 1;
  ctx.fillStyle = color || css("--ink"); ctx.fillText(txt, X, Y); ctx.restore();
}
function hLine(ctx, p, y, dash, label){
  var Y = p.Y(y); if (Y < -2 || Y > p.H + 2) return;
  ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash(dash || [2, 4]); ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(p.W, Y); ctx.stroke(); ctx.restore();
  if (label) bgLabel(ctx, p, label, 6, Y + (y > 0 ? -11 : 11), "left", css("--ink-2"), "italic 13px " + (p.fontM || "serif"));
}
// @component G13 valueBar (variant of MHF4U 11's) — coloured bar from (x, 0) to (x, v), offset dx px, edge arrow when off the window, tip label
function vbar(ctx, p, x, v, col, dx, lab, side){
  var X = p.X(x) + dx, Y0 = clamp(p.Y(0), 0, p.H), vw = p.v, tip = clamp(v, vw.ymin, vw.ymax), Yt = p.Y(tip), out = v > vw.ymax ? 1 : v < vw.ymin ? -1 : 0;
  ctx.save(); ctx.fillStyle = col; ctx.fillRect(X - 3, Math.min(Y0, Yt), 6, Math.max(1, Math.abs(Yt - Y0)));
  ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 1; ctx.strokeRect(X - 3, Math.min(Y0, Yt), 6, Math.max(1, Math.abs(Yt - Y0)));
  if (out) { var ye = out > 0 ? 1 : p.H - 1, yb = ye + (out > 0 ? 12 : -12); ctx.beginPath(); ctx.moveTo(X, ye); ctx.lineTo(X - 7, yb); ctx.lineTo(X + 7, yb); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  if (lab) bgLabel(ctx, p, lab + (out ? (out > 0 ? " ↑" : " ↓") : ""), X + (side === "left" ? -8 : 8), clamp(Yt + (v > 0 ? 10 : -10), 12, p.H - 12), side === "left" ? "right" : "left", col);
}
// asymptote labels in the empty corners: for k > 0 the right piece runs up beside x = z and above y = 0 on the right
function asymLabels(ctx, p, z, k){
  var X = p.X(z), Y = p.Y(0), ink2 = css("--ink-2"), f = "italic 13px " + (p.fontM || "serif");
  if (X >= 0 && X <= p.W) bgLabel(ctx, p, "x = " + F(z), X + (k > 0 ? -6 : 6), 14, k > 0 ? "right" : "left", ink2, f);
  if (Y >= 0 && Y <= p.H) bgLabel(ctx, p, "y = 0", p.W - 6, Y + (k > 0 ? 12 : -12), "right", ink2, f);
}
function lerpView(a, b, t){
  var cx = (a.xmin + a.xmax) / 2 * (1 - t) + (b.xmin + b.xmax) / 2 * t, cy = (a.ymin + a.ymax) / 2 * (1 - t) + (b.ymin + b.ymax) / 2 * t;
  var hw = (a.xmax - a.xmin) / 2 * Math.pow((b.xmax - b.xmin) / (a.xmax - a.xmin), t), hh = (a.ymax - a.ymin) / 2 * Math.pow((b.ymax - b.ymin) / (a.ymax - a.ymin), t);
  return { xmin:cx - hw, xmax:cx + hw, ymin:cy - hh, ymax:cy + hh };
}
function evenFmt(v){ return Math.round(v) % 2 === 0 ? num(v) : ""; }

// ---------- hero: storyboard in the plan (reduced motion: final frame) ----------
function hero(f){
  var H = MV.C.hero.fig, LB = H.labels, p = new MV.Plot(f.canvas, { xmin:-2, xmax:6, ymin:-3, ymax:3 });
  var MAPS = [[4, 2, 0.5], [2.5, 0.5, 2], [0, -2, -0.5], [1.5, -0.5, -2]];
  var st = { line:0, pulse:0, asym:0, guides:0, ring:false, arrows:0, at:0, r:0, l:0, fin:false };
  p.render = function(){
    p.draw({ xTicks:{ step:1 }, yTicks:{ step:1 }, describe:MV.plain(H.aria), after:function(ctx, q){
      var f3 = css("--f3"), pen = css("--pen"), ink2 = css("--ink-2");
      if (st.guides > 0) { ctx.save(); ctx.globalAlpha = st.guides; hLine(ctx, q, 1, [2, 4], "y = 1"); hLine(ctx, q, -1, [2, 4], "y = " + MINUS + "1"); ctx.restore(); }
      if (st.asym > 0) { q.segment({ x1:2, y1:-3 * st.asym, x2:2, y2:3 * st.asym, color:ink2, width:1.5, dash:[8, 6] }); if (st.asym >= 1) bgLabel(ctx, q, LB.asym, q.X(2) - 6, 14, "right", ink2, "italic 13px " + q.fontM); }
      if (st.line > 0) {
        var xe = -2 + 8 * st.line; q.curve({ pts:[[-2, -4], [xe, xe - 2]], color:f3, width:2.6 });
        if (st.line >= 1) { q.head([4.4, 2.4], [5, 3], f3, 12); q.head([-1.4, -3.4], [-1, -3], f3, 12); bgLabel(ctx, q, LB.line, q.X(3.7), q.Y(2.4), "right", f3); }
      }
      if (st.pulse > 0 && st.pulse < 1) { var rr = 7 + 9 * Math.abs(Math.sin(st.pulse * Math.PI * 2)); ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(q.X(2), q.Y(0), rr, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); q.point({ x:2, y:0, r:5, color:f3 }); }
      for (var i = 0; i < 4; i++) {
        if (i > st.arrows || (i === st.arrows && !(st.at > 0))) continue;
        var m = MAPS[i], t = i < st.arrows ? 1 : st.at, y2 = m[1] + (m[2] - m[1]) * t;
        if (t > 0.02) q.segment({ x1:m[0], y1:m[1], x2:m[0], y2:y2, color:css("--ink"), width:2, arrow:true });
        q.point({ x:m[0], y:m[1], r:4.5, color:f3 });
        if (t >= 1) q.point({ x:m[0], y:m[2], r:5, color:pen });
      }
      if (st.r > 0 || st.l > 0) drawRecip(q, 1, 2, { rev:{ l:st.l, r:st.r }, head:12 });
      if (st.ring) {
        [[3, 1], [1, -1]].forEach(function(pt){
          q.point({ x:pt[0], y:pt[1], r:6, ring:true, color:css("--ink") });
          bgLabel(ctx, q, st.fin ? "(" + F(pt[0]) + ", " + F(pt[1]) + ")" : LB.stay, q.X(pt[0]) + (pt[1] > 0 ? 12 : -12), q.Y(pt[1]) + (pt[1] > 0 ? -14 : 14), pt[1] > 0 ? "left" : "right");
        });
      }
    } });
  };
  function cap(i){ f.cap.innerHTML = H.steps[i] || ""; }
  function finalFrame(){ st = { line:1, pulse:0, asym:1, guides:1, ring:true, arrows:0, at:0, r:1, l:1, fin:true }; cap(3); p.render(); }
  if (MV.reduceMotion) { finalFrame(); return; }
  var T = function(dur, fn, done){ MV.tween({ dur:dur, ease:lin, step:fn, done:done }); };
  p.render();
  MV.wait(400, function(){
    T(600, function(t){ st.line = t; p.render(); }, function(){
      MV.wait(250, function(){ T(1100, function(t){ st.pulse = t; p.render(); }, function(){ st.pulse = 0;
        T(600, function(t){ st.asym = t; p.render(); }, function(){ cap(0);
          MV.wait(1300, function(){ st.ring = true; T(600, function(t){ st.guides = t; p.render(); }, function(){ cap(1);
            MV.wait(1500, function(){ cap(2);
              var i = 0;
              (function one(){
                if (i >= 4) { MV.wait(700, function(){ T(700, function(t){ st.r = t; p.render(); }, function(){ T(700, function(t){ st.l = t; p.render(); }, function(){ MV.wait(500, finalFrame); }); }); }); return; }
                st.arrows = i; T(400, function(t){ st.at = t; p.render(); }, function(){ st.arrows = i + 1; st.at = 0; i++; p.render(); MV.wait(160, one); });
              })();
            });
          }); });
        });
      }); });
    });
  });
}

// ---------- Explore: Reciprocal twin ----------
var XV = { xmin:-8, xmax:8, ymin:-6, ymax:6 }, TV = { xmin:-8, xmax:8, ymin:-4.5, ymax:4.5 }, ZOOM = { xmin:-30, xmax:130, ymin:-105, ymax:15 };
// @component reciprocalTwin — line + reciprocal with drag handles Z (zero) and S (slope), Overlay / Twin panels, probe with value bars, ±1 guides, sign and big ↔ small bands, feature readout
function explore(host, api){
  var S = api.S, C = api.content, DEF = { k:1, z:2, view:"overlay", probe:false, p:3, guides:true, signs:false, big:false };
  Object.keys(DEF).forEach(function(key){ if (S[key] == null) S[key] = DEF[key]; });
  var X = { hide:false, rev:null, kv:null, pv:null, zoom:null, marks:[], hl:null, busy:false, tgt:null, all:false };
  host.innerHTML = '<div class="pg rt"><div class="pg-graph" data-mv="graph"><p class="eq-cap rt-cap" id="rt-cap"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap rt-ov"><canvas class="plot" id="rt-c0" role="img" aria-label="Twin graph"></canvas></div>' +
    '<div class="rt-tw" hidden><div class="plot-wrap"><canvas class="plot wide" id="rt-c1" role="img" aria-label="Line panel"></canvas></div><div class="plot-wrap"><canvas class="plot wide" id="rt-c2" role="img" aria-label="Reciprocal panel"></canvas></div></div>' +
    '<p class="rt-leg" id="rt-leg"></p></div>' +
    '<div class="pg-ctrl"><div class="rt-sl" id="rt-sl"></div><div id="rt-view"></div><div class="chips rt-tg" id="rt-tg" role="group" aria-label="Layers"></div>' +
    '<div class="q-actions" style="margin-top:4px"><button type="button" class="btn ghost sm" id="rt-reset">Reset</button></div><p class="tiny muted rt-note">' + (C.note || "") + "</p></div>" +
    '<div class="pg-read"><dl class="read rt-read" id="rt-read"></dl><button type="button" class="btn ghost sm rt-all" id="rt-all" aria-expanded="false">Show all features</button><p class="vh" id="rt-say" aria-live="polite"></p></div></div>';
  var po = new MV.Plot($("#rt-c0", host), XV), pt = new MV.Plot($("#rt-c1", host), TV), pb = new MV.Plot($("#rt-c2", host), TV);
  function kNow(){ return X.kv != null ? X.kv : S.k; }
  function pNow(){ return X.pv != null ? X.pv : S.p; }
  function probeOn(){ return S.probe || X.pv != null; }
  function vOf(role){ return X.zoom || (role === "o" ? XV : TV); }
  function invPts(k, z){ var d = 1 / Math.abs(k), up = k > 0; return [[z - d, up ? -1 : 1], [z + d, up ? 1 : -1]]; }
  function activeChal(){
    if (X.busy) return null;
    var T = C.challenges || [], st = MV.S.chal || {}, open = T.filter(function(c){ return !(st[c.id] && st[c.id].solved); });
    if (X.tgt) { var c = open.filter(function(x){ return x.id === X.tgt; })[0]; if (c) return c; }
    return open[0] || null;
  }

  function scene(p, role){
    var k = kNow(), z = S.z, c = k * z, v = vOf(role), showLine = role !== "b", showRec = role !== "t" && !X.hide;
    var bands = [];
    if (S.signs) bands.push({ x0:k > 0 ? z : -1e9, x1:k > 0 ? 1e9 : z });
    if (S.big) bands.push({ x0:z - 1 / Math.abs(k), x1:z + 1 / Math.abs(k) });
    var sc = { view:v, bands:bands, asymptotes:[], describe:describe(role) };
    if (!X.zoom) { sc.xTicks = { step:1, fmt:evenFmt }; sc.yTicks = { step:1, fmt:evenFmt }; }
    if (role === "t") sc.yLabel = "line"; else if (role === "b") sc.yLabel = "reciprocal";
    if (showRec) sc.asymptotes = [{ x:z, label:"" }, { y:0, label:"" }];
    sc.after = function(ctx, q){
      var f3 = css("--f3"), pen = css("--pen"), ink = css("--ink");
      if (S.signs) bgLabel(ctx, q, "line > 0, so reciprocal > 0", q.X(k > 0 ? (Math.max(z, q.v.xmin) + q.v.xmax) / 2 : (q.v.xmin + Math.min(z, q.v.xmax)) / 2), 34, "center", ink, "600 12px " + q.fontUI);
      if (S.big) bgLabel(ctx, q, "|line| < 1, so |reciprocal| > 1", q.X(z), q.H - 38, "center", ink, "600 12px " + q.fontUI);
      if (S.guides && !X.zoom) { hLine(ctx, q, 1, [2, 4], "y = 1"); hLine(ctx, q, -1, [2, 4], "y = " + MINUS + "1"); }
      if (showLine) q.curve({ f:function(x){ return k * (x - z); }, color:f3, width:2.6, arrows:true });
      if (showRec) { drawRecip(q, k, z, { rev:X.rev }); asymLabels(ctx, q, z, k); }
      if (probeOn()) drawProbe(ctx, q, role, k, z);
      if (S.guides && !X.zoom && !(role === "o" && X.hide)) invPts(k, z).forEach(function(ip){
        q.point({ x:ip[0], y:ip[1], r:6, color:ink });
        var left = ip[0] < z; bgLabel(ctx, q, "(" + F(ip[0]) + ", " + F(ip[1]) + ")", q.X(ip[0]) + (left ? -9 : 9), q.Y(ip[1]) + (ip[1] > 0 ? -13 : 13), left ? "right" : "left");
      });
      if (role !== "b") {
        q.point({ x:z, y:0, r:7, ring:true, color:ink }); bgLabel(ctx, q, "Z", q.X(z) + 10, q.Y(0) + 14, "left", ink, "700 12px " + q.fontUI);
        q.point({ x:z + 1, y:k, r:7, ring:true, color:ink }); bgLabel(ctx, q, "S", q.X(z + 1) + 12, q.Y(k) + 13, "left", ink, "700 12px " + q.fontUI);
      }
      var ch = role !== "t" && !X.zoom ? activeChal() : null;
      if (ch) (ch.targets || []).forEach(function(tg){ q.point({ x:tg[0], y:tg[1], r:7, open:true, color:ink }); bgLabel(ctx, q, tg[2], q.X(tg[0]) + 11, q.Y(tg[1]) + (tg[1] >= 0 ? -12 : 12), "left"); });
      if (role !== "t") X.marks.forEach(function(mk){ q.point({ x:mk.x, y:mk.y, r:6, color:pen }); bgLabel(ctx, q, mk.label, q.X(mk.x) + (mk.x < z ? -10 : 10), q.Y(mk.y) + (mk.y > 0 ? -14 : 14), mk.x < z ? "right" : "left", pen); });
    };
    return sc;
  }
  function drawProbe(ctx, q, role, k, z){
    var P = pNow(), L = k * (P - z), Xp = q.X(P);
    if (Xp < -10 || Xp > q.W + 10) return;
    ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(Xp, 0); ctx.lineTo(Xp, q.H); ctx.stroke(); ctx.restore();
    var f3 = css("--f3"), pen = css("--pen");
    if (role !== "b") vbar(ctx, q, P, L, f3, role === "o" ? -5 : 0, F(L), "left");
    if (role !== "t" && !near(L, 0) && !X.hide) vbar(ctx, q, P, 1 / L, pen, role === "o" ? 5 : 0, RF(L), "right");
    // grip at the top of the probe line
    ctx.save(); ctx.fillStyle = css("--ink"); ctx.beginPath(); ctx.moveTo(Xp - 8, 2); ctx.lineTo(Xp + 8, 2); ctx.lineTo(Xp, 14); ctx.closePath(); ctx.fill(); ctx.restore();
    if (role !== "t") bgLabel(ctx, q, "x = " + F(P), Xp + 8, q.H - 12, "left", css("--ink"), "italic 13px " + q.fontM);
  }
  function describe(role){
    var k = kNow(), z = S.z, c = k * z, lt = MV.plain(M("y = " + lineM(k, c))), rt = MV.plain(M(recipM(k, c, false))), ip = invPts(k, z);
    var inv = "Invariant points (" + F(Math.min(ip[0][0], ip[1][0])) + ", " + F(ip[0][0] < ip[1][0] ? ip[0][1] : ip[1][1]) + ") and (" + F(Math.max(ip[0][0], ip[1][0])) + ", " + F(ip[0][0] < ip[1][0] ? ip[1][1] : ip[0][1]) + "). ";
    var shape = k > 0 ? "The reciprocal falls on each piece: below the x-axis to the left of " + F(z) + ", above it to the right." : "The reciprocal rises on each piece: above the x-axis to the left of " + F(z) + ", below it to the right.";
    var s;
    if (role === "t") s = "Top panel: the line " + lt + " in teal, crossing the x-axis at its zero, x = " + F(z) + ".";
    else if (X.hide) s = "Line " + lt + " in teal. Its reciprocal is hidden for now.";
    else s = (role === "b" ? "Bottom panel: the reciprocal " + rt + " in blue. " : "Line " + lt + " in teal and its reciprocal " + rt + " in blue. ") + "Vertical asymptote x = " + F(z) + ", horizontal asymptote y = 0. " + inv + shape;
    if (probeOn()) s += " " + MV.plain(probeTxt());
    return s;
  }
  function probeTxt(){
    var k = S.k, z = S.z, P = pNow(), L = k * (P - z), h = "At " + M("x = " + F(P)) + ": ";
    if (near(L, 0)) return h + "line = 0, reciprocal undefined (vertical asymptote)";
    var note = near(Math.abs(L), 1) ? "(invariant point)" : Math.abs(L) > 1 ? "(|line| > 1, so |reciprocal| < 1)" : "(|line| < 1, so |reciprocal| > 1)";
    return h + "line = " + F(L) + ", reciprocal = " + RF(L) + " " + note;
  }
  function readout(){
    var k = S.k, z = S.z, c = k * z, up = k > 0, rows = [], fm = factM(k, z);
    var Lv = "(" + MINUS + "∞, " + F(z) + ")", Rv = "(" + F(z) + ", ∞)";
    rows.push(["Line", M("y = " + lineM(k, c)) + (fm ? " " + M("= " + fm) : ""), 1]);
    if (X.hide) { rows.push(["Reciprocal", "Hidden for now. Watch it appear.", 0]); return rows; }
    rows.push(["Reciprocal", M(recipM(k, c, true)), 1]);
    rows.push(["<i>k</i> and <i>c</i>", M("k = " + F(k)) + ", " + M("c = " + F(c)) + ' <span class="muted">(the line’s <i>y</i>-intercept is ' + M("-c = " + F(-c)) + ")</span>", 1]);
    rows.push(["Vertical asymptote", M("x = " + F(z)) + ' <span class="muted">(the line’s zero: ' + M(lineM(k, c) + " = 0") + " when " + M("x = " + F(c) + "/" + (k < 0 ? "(" + F(k) + ")" : F(k))) + ")</span>", 0]);
    rows.push(["Horizontal asymptote", M("y = 0") + ' <span class="muted">(far out, the line is huge, so 1 ÷ line is close to 0)</span>', 1]);
    rows.push(["Domain", M("{x ∈ ℝ | x ≠ " + F(z) + "}"), 1]);
    rows.push(["Range", '<span class="rt-rng" tabindex="0" aria-describedby="rt-tipn">' + M("{y ∈ ℝ | y ≠ 0}") + '</span><span class="rt-tip" id="rt-tipn">1 ÷ (anything) is never 0</span>', 1]);
    rows.push(["<i>y</i>-intercept", near(z, 0) ? "None: the vertical asymptote is the <i>y</i>-axis" : '<span class="nw">(0, ' + RF(-c) + ")</span>: the line’s <i>y</i>-intercept " + F(-c) + ", flipped", 0]);
    rows.push(["<i>x</i>-intercept", "None: 1 ÷ (anything) is never 0", 1]);
    var ip = invPts(k, z);
    rows.push(["Invariant points", ptTxt(ip[0][0], ip[0][1]) + " and " + ptTxt(ip[1][0], ip[1][1]) + ": where the line is " + (up ? MINUS + "1 or 1" : "1 or " + MINUS + "1") + ' <span class="muted">(each ' + M("1/|k|") + " = " + F(1 / Math.abs(k)) + " from the asymptote)</span>", 0, "inv"]);
    rows.push(["Positive / negative", (up ? "Negative on " + M(Lv) + ", positive on " + M(Rv) : "Positive on " + M(Lv) + ", negative on " + M(Rv)) + ": the same as the line", 1]);
    rows.push(["Increasing / decreasing", (up ? "The line rises (" + M("k > 0") + "), so the reciprocal is decreasing on " : "The line falls (" + M("k < 0") + "), so the reciprocal is increasing on ") + M(Lv) + " and on " + M(Rv), 0]);
    rows.push(["Near the asymptote", "As " + M("x → " + F(z) + "^{-}") + ", " + M("y → " + (up ? "-∞" : "+∞")) + "; as " + M("x → " + F(z) + "^{+}") + ", " + M("y → " + (up ? "+∞" : "-∞")), 0]);
    rows.push(["At the ends", "As " + M("x → -∞") + ", " + M("y → 0^{" + (up ? "-" : "+") + "}") + "; as " + M("x → ∞") + ", " + M("y → 0^{" + (up ? "+" : "-") + "}"), 1]);
    if (probeOn()) rows.push(["Probe", probeTxt(), 0]);
    return rows;
  }
  function paintRead(){
    var dl = $("#rt-read", host);
    dl.innerHTML = readout().map(function(r){ return '<div class="' + (r[2] ? "rt-x" : "") + (r[3] && r[3] === X.hl ? " hl" : "") + '"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    dl.classList.toggle("all", X.all);
  }
  function paintCap(){
    var k = S.k, c = k * S.z;
    $("#rt-cap", host).innerHTML = '<span class="w">Line</span> ' + M("y = " + lineM(k, c)) + '<span class="w"> · reciprocal</span> ' + M(recipM(k, c, true));
    var ch = activeChal();
    $("#rt-leg", host).innerHTML = '<span><i class="sw" style="background:var(--f3)"></i>line</span><span><i class="sw" style="background:var(--pen)"></i>reciprocal</span><span><i class="sw dash"></i>asymptotes</span>' +
      (ch ? '<span>○ target points for challenge ' + ((C.challenges || []).indexOf(ch) + 1) + "</span>" : "");
  }
  function render(){
    var tw = S.view === "twin";
    $(".rt-ov", host).hidden = tw; $(".rt-tw", host).hidden = !tw;
    if (tw) { pt.render(); pb.render(); } else po.render();
  }
  po.render = function(){ if (S.view !== "twin") po.draw(scene(po, "o")); };
  pt.render = function(){ if (S.view === "twin") pt.draw(scene(pt, "t")); };
  pb.render = function(){ if (S.view === "twin") pb.draw(scene(pb, "b")); };
  function paintToggles(){
    var T = [["probe", "Probe"], ["guides", "±1 guides"], ["signs", "Sign bands"], ["big", "Big ↔ small band"]];
    MV.keepFocus($("#rt-tg", host), function(){
      $("#rt-tg", host).innerHTML = T.map(function(t){ var on = !!S[t[0]]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-tg="' + t[0] + '" data-k="rttg' + t[0] + '">' + t[1] + "</button>"; }).join("");
    });
  }
  function paint(){
    sl.set("z", S.z); sl.set("k", S.k);
    if (seg.get() !== S.view) seg.set(S.view);
    paintToggles(); paintCap(); paintRead(); render();
  }
  var sayT = null;
  function say(){
    clearTimeout(sayT);
    sayT = setTimeout(function(){
      var k = S.k, z = S.z, c = k * z, ip = invPts(k, z);
      var t = "Line " + MV.plain(M("y = " + lineM(k, c))) + ". Vertical asymptote x = " + F(z) + ". " + (near(z, 0) ? "No y-intercept. " : "y-intercept (0, " + RF(-c) + "). ") +
        "Invariant points (" + F(ip[0][0]) + ", " + F(ip[0][1]) + ") and (" + F(ip[1][0]) + ", " + F(ip[1][1]) + "). The reciprocal is " + (k > 0 ? "decreasing" : "increasing") + " on each piece." + (probeOn() ? " " + MV.plain(probeTxt()) : "");
      $("#rt-say", host).textContent = t;
    }, 250);
  }
  function userTouch(){ X.hide = false; X.rev = null; X.kv = null; X.pv = null; X.zoom = null; X.marks = []; X.hl = null; }
  function setState(o){ Object.keys(o).forEach(function(key){ S[key] = o[key]; }); userTouch(); api.save(); paint(); MV.changed(); }

  var sl = MV.sliders($("#rt-sl", host), [
    { id:"z", label:"Zero of the line", min:-6, max:6, step:0.5, value:S.z, fmt:F },
    { id:"k", label:M("k") + ", the slope", min:-4, max:4, step:0.5, value:S.k, skip:[0], fmt:F, note:M("k") + " skips 0: a horizontal line has no zero, so no asymptote." }
  ], function(id, v){ var o = {}; o[id] = v; setState(o); });
  $("#rt-sl", host).addEventListener("change", say);
  var seg = MV.seg($("#rt-view", host), { label:"View:", value:S.view, options:[{ id:"overlay", t:"Overlay" }, { id:"twin", t:"Twin panels" }],
    onChange:function(v){ var o = { view:v }; if (v === "twin") o.probe = true; setState(o); say(); } });
  $("#rt-tg", host).addEventListener("click", function(e){ var b = e.target.closest("[data-tg]"); if (!b) return; var o = {}; o[b.dataset.tg] = !S[b.dataset.tg]; setState(o); say(); });
  $("#rt-reset", host).addEventListener("click", function(){ setState(Object.assign({}, DEF)); say(); });
  $("#rt-all", host).addEventListener("click", function(){ X.all = !X.all; this.textContent = X.all ? "Show fewer features" : "Show all features"; this.setAttribute("aria-expanded", String(X.all)); paintRead(); });

  // drag handles Z, S and the probe (G7): keyboard per the plan
  function move(id, x, y){
    if (id === "Z") setState({ z:clamp(Math.round(x * 2) / 2, -6, 6) });
    else if (id === "S") { var kk = clamp(Math.round(y * 2) / 2, -4, 4); if (kk === 0) kk = y >= 0 ? 0.5 : -0.5; if (kk !== S.k || X.kv != null) setState({ k:kk }); }
    else if (id === "P") setState({ p:clamp(Math.round(x * 4) / 4, -8, 8) });
  }
  function key(id, e){
    var K = e.key, big = e.shiftKey;
    if (id === "Z") {
      if (K === "ArrowLeft" || K === "ArrowRight") { setState({ z:clamp(S.z + (K === "ArrowRight" ? 1 : -1) * (big ? 2 : 0.5), -6, 6) }); say(); return true; }
      if (K === "Home" || K === "End") { setState({ z:K === "Home" ? -6 : 6 }); say(); return true; }
      return K === "ArrowUp" || K === "ArrowDown";
    }
    if (id === "S") {
      if (K === "ArrowUp" || K === "ArrowDown") { var d = (K === "ArrowUp" ? 1 : -1) * (big ? 2 : 0.5), nk = S.k + d; if (nk === 0) nk += d > 0 ? 0.5 : -0.5; nk = clamp(nk, -4, 4); if (nk === 0) nk = S.k; setState({ k:nk }); say(); return true; }
      return K === "ArrowLeft" || K === "ArrowRight";
    }
    if (id === "P") {
      if (K === "ArrowLeft" || K === "ArrowRight") { setState({ p:clamp(S.p + (K === "ArrowRight" ? 1 : -1) * (big ? 1 : 0.25), -8, 8) }); say(); return true; }
      if (K === "Home" || K === "End") { setState({ p:K === "Home" ? -8 : 8 }); say(); return true; }
      return K === "ArrowUp" || K === "ArrowDown";
    }
    return false;
  }
  function handles(p, role){
    var out = [], v = p.v || vOf(role);
    if (role !== "b") out.push({ id:"Z", x:S.z, y:0, label:"Zero handle Z, at x = " + F(S.z) + ". Left and right arrow keys move it; Home and End jump to the ends." },
      { id:"S", x:S.z + 1, y:kNow(), label:"Slope handle S: k = " + F(S.k) + ". Up and down arrow keys change k." });
    if (probeOn()) out.push({ id:"P", x:pNow(), y:v.ymax - (v.ymax - v.ymin) * 0.03, label:"Probe at x = " + F(pNow()) + ". Left and right arrow keys move it." });
    return out;
  }
  [[po, "o"], [pt, "t"], [pb, "b"]].forEach(function(pr){
    MV.drag(pr[0], { axis:"xy", handles:function(){ return handles(pr[0], pr[1]); }, move:move, key:key, end:say });
    pr[0].c.style.touchAction = "pan-y";
  });
  // which challenge's target rings to show: the one the student is working on
  function chalFocus(e){ var box = e.target && e.target.closest && e.target.closest("#chal [data-c]"); if (!box) return; X.tgt = box.dataset.c; setTimeout(function(){ paintCap(); render(); }, 0); }
  document.addEventListener("click", chalFocus); document.addEventListener("focusin", chalFocus);

  paint(); say();

  // ----- predictions (K9/K10) -----
  function startPred(p){
    var s = p.start || {};
    userTouch(); X.busy = true; X.tgt = null;
    Object.assign(S, { k:s.k, z:s.z, view:"overlay", probe:!!s.probe, p:s.p != null ? s.p : 3, guides:s.guides != null ? s.guides : S.guides, signs:false, big:false });
    X.hide = !!s.hide;
    paint();
  }
  function finisher(done){ return function(){ X.busy = false; api.save(); paint(); MV.changed(); say(); done(); }; }
  function runPred(p, done){
    var fin = finisher(done);
    if (p.id === "p1") {
      MV.wait(500, function(){ S.signs = true; paint(); MV.wait(900, function(){
        X.hide = false; X.rev = { l:0, r:0 }; paint();
        MV.tween({ dur:800, ease:lin, step:function(t){ X.rev.r = t; render(); }, done:function(){
          MV.tween({ dur:800, ease:lin, step:function(t){ X.rev.l = t; render(); }, done:function(){ X.rev = null; fin(); } });
        } });
      }); });
    } else if (p.id === "p2") {
      X.hl = "inv"; paintRead();
      MV.wait(300, function(){ MV.tween({ dur:2000, step:function(t){ X.kv = 1 + 3 * t; render(); }, done:function(){ X.kv = null; S.k = 4; fin(); } }); });
    } else if (p.id === "p3") {
      var stops = [4, 6, 8], i = 0, from = 2;
      var next = function(){
        if (i >= stops.length) {
          MV.wait(300, function(){ MV.tween({ dur:1400, step:function(t){ X.zoom = lerpView(XV, ZOOM, t); render(); }, done:function(){ X.zoom = ZOOM; MV.wait(400, function(){ X.pv = 100; S.p = 8; paint(); MV.wait(700, fin); }); } }); });
          return;
        }
        var to = stops[i++], f0 = from; from = to;
        MV.tween({ dur:700, step:function(t){ X.pv = f0 + (to - f0) * t; render(); }, done:function(){ X.pv = to; paint(); MV.wait(900, next); } });
      };
      MV.wait(300, next);
    } else if (p.id === "p4") {
      MV.wait(300, function(){
        MV.tween({ dur:1200, ease:lin, step:function(t){ X.pv = 1 + 0.97 * t; render(); }, done:function(){
          X.pv = 2.03; render();
          MV.wait(300, function(){ MV.tween({ dur:1100, ease:function(t){ return 1 - (1 - t) * (1 - t); }, step:function(t){ X.pv = 2.03 + 0.97 * t; render(); }, done:function(){
            X.pv = null; S.p = 3; X.marks = [{ x:1, y:-1, label:"y(1) = " + MINUS + "1" }, { x:3, y:1, label:"y(3) = 1" }]; fin();
          } }); });
        } });
      });
    } else fin();
  }

  // ----- target challenges: exact tests and named wrong states from the plan -----
  function chal(id){ return (C.challenges || []).filter(function(c){ return c.id === id; })[0] || {}; }
  function test(id){
    var k = S.k, z = S.z, c = k * z, N = chal(id).named || {};
    if (id === "tc1") {
      if (z === 2 && k === 1) return { ok:true };
      if (z === 2 && k === -1) return { ok:false, msg:N.kneg };
      if (z === 2) return { ok:false, msg:tpl(N.kother, { v:M(RF(k)) }) };
      if (z === 3) return { ok:false, msg:N.z3 };
      if (z === -2) return { ok:false, msg:N.zneg2 };
      return { ok:false };
    }
    if (id === "tc2") {
      var at3 = 3 * k - c;
      if (near(c, 4) && near(at3, 2)) return { ok:true };
      if (k === 2 && z === -2) return { ok:false, msg:N.flip };
      if (near(c, 4)) return { ok:false, msg:tpl(N.first, { v:M(near(at3, 0) ? "undefined" : RF(at3)) }) };
      if (near(at3, 2)) return { ok:false, msg:tpl(N.second, { v:near(c, 0) ? "undefined (`x = 0` is your asymptote)" : M(RF(-c)) }) };
      return { ok:false };
    }
    if (id === "tc3") {
      if (k === -0.5 && near(c, -2)) return { ok:true };
      if (k === 0.5 && near(c, -2)) return { ok:false, msg:N.kpos };
      if (k < 0 && near(c, -2)) return { ok:false, msg:tpl(N.spacing, { v:M(F(2 / Math.abs(k))) }) };
      if (k === -0.5 && z !== 0) return { ok:false, msg:tpl(N.yint, { v:M(RF(-c)) }) };
      if (k === -0.5 && z === 0) return { ok:false, msg:N.zero0 };
      return { ok:false };
    }
    return { ok:false };
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ var r = test(id); if (r.msg) r.msg = MV.md(r.msg); return r; }
  };
}

// ---------- Part 3: Closing in on the asymptote ----------
function yFmt(v){
  if (Math.abs(Math.round(v * 1e4) / 1e4 - v) <= 1e-9 * Math.max(1, Math.abs(v))) return num(v, 4);
  return "≈ " + num(Number(v.toPrecision(3)), 10);
}
function hY(k, h){ return Math.abs(h) < 1 ? (1 / h) / k : 1 / (k * h); }
// @component N11 signLine (simplest mode) + rider zoom — one critical value as an open mark, +/− radio chips each side,
// four arrow chip pairs, a "Close in" / "Head for the ends" rider animation with ×10 rescale (G10) and an N14 approach table
function part3(host, api){
  var S = api.S, C = api.content, CARDS = C.cards, FB = C.fb;
  if (S.i == null) S.i = 0; S.cards = S.cards || {};
  var T = { tok:0, view:null, h:null, rows:null, busy:false }, fbHTML = "";
  function card(){ return CARDS[S.i]; }
  function cs(){ var c = card(); return S.cards[c.id] || (S.cards[c.id] = { L:null, R:null, al:null, ar:null, el:null, er:null, line:false, closed:false, ends:false, res:null, solved:false, tries:0 }); }
  function want(c){ var up = c.k > 0; return { L:up ? "-" : "+", R:up ? "+" : "-", al:up ? "-i" : "+i", ar:up ? "+i" : "-i", el:up ? "0-" : "0+", er:up ? "0+" : "0-" }; }
  function base(a){ return { xmin:a - 1.2, xmax:a + 1.2, ymin:-1.5, ymax:1.5 }; }
  host.innerHTML = '<div class="sym ci"><div class="ci-left">' +
    '<h3 class="ci-h">1. Choose a card</h3><div class="chips" id="ci-cards" role="group" aria-label="Cards"></div><p class="eq-cap" id="ci-eq"></p>' +
    '<h3 class="ci-h">2. Build the sign line</h3><p class="tiny muted" id="ci-slt"></p>' +
    '<div id="ci-lw" hidden><canvas class="plot wide ci-line" id="ci-line" role="img" aria-label="Graph of the line"></canvas></div>' +
    '<canvas class="plot nl" id="ci-nl" role="img" aria-label="Sign line"></canvas><div id="ci-signs"></div>' +
    '<h3 class="ci-h">3. Predict the four arrows</h3><div id="ci-arr"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="ci-close">Close in</button><button type="button" class="btn sm" id="ci-ends">Head for the ends</button><button type="button" class="btn primary sm" id="ci-check">Check my arrows</button></div>' +
    '<div id="ci-fb" aria-live="polite"></div></div>' +
    '<div class="ci-right" data-mv="ci-graph"><div class="plot-wrap"><canvas class="plot" id="ci-plot" role="img" aria-label="Graph near the asymptote"></canvas></div>' +
    '<p class="tiny muted" id="ci-note" aria-live="polite"></p><div id="ci-tbl"></div>' +
    '<details class="alg" id="ci-alg"><summary>Check it with algebra</summary>' + (C.alg || "") + '<p class="ci-live" id="ci-live"></p></details></div></div>';
  var pg = new MV.Plot($("#ci-plot", host), base(3)), pnl = new MV.Plot($("#ci-nl", host), { xmin:0, xmax:6, ymin:-1, ymax:1 }), pln = new MV.Plot($("#ci-line", host), base(3));
  pg.render = function(){
    var c = card(), a = c.a, k = c.k, v = T.view || base(a), h = T.h;
    var yS = function(hh){ var s = yFmt(hY(k, hh)); return s.charAt(0) === "≈" ? "y " + s : "y = " + s; };
    var desc = "Graph of " + MV.plain(c.eq) + " near its vertical asymptote x = " + F(a) + ", for x from " + num(v.xmin, 5) + " to " + num(v.xmax, 5) + " and y from " + num(v.ymin, 5) + " to " + num(v.ymax, 5) + "." +
      (h != null ? " Riders at x = " + num(a - h, 6) + " (" + yS(-h) + ") and x = " + num(a + h, 6) + " (" + yS(h) + ")." : "");
    pg.draw({ view:v, xTicks:{ step:MV.niceStep((v.xmax - v.xmin) / 5), fmt:function(t){ return num(t, 5); } }, yTicks:{ fmt:function(){ return ""; } }, asymptotes:[{ x:a, label:"" }, { y:0, label:"" }], describe:desc,
      after:function(ctx, p){
        var step = MV.niceStep((v.ymax - v.ymin) / 6);
        for (var y = Math.ceil(v.ymin / step) * step; y <= v.ymax + 1e-9; y += step) { if (Math.abs(y) < step * 1e-6) continue; var Y = p.Y(y); if (Y < 10 || Y > p.H - 10) continue; bgLabel(ctx, p, num(y, 5), 5, Y, "left", css("--ink-2"), "12px " + p.fontUI); }
        drawRecip(p, k, a); asymLabels(ctx, p, a, k);
        if (h != null) [[-1, "left"], [1, "right"]].forEach(function(sd){
          var x = a + sd[0] * h, y = hY(k, sd[0] * h), Y = p.Y(y), X = p.X(x), pen = css("--pen");
          if (Y >= 0 && Y <= p.H && X >= 0 && X <= p.W) { p.point({ x:x, y:y, r:7, color:pen }); bgLabel(ctx, p, sd[1], X + (sd[0] < 0 ? -11 : 11), clamp(Y + (y > 0 ? 14 : -14), 10, p.H - 10), sd[0] < 0 ? "right" : "left", pen, "600 12px " + p.fontUI); }
          else if (X >= 0 && X <= p.W) { var ye = Y < 0 ? 2 : p.H - 2, d = Y < 0 ? 1 : -1; ctx.save(); ctx.fillStyle = pen; ctx.beginPath(); ctx.moveTo(X, ye); ctx.lineTo(X - 8, ye + d * 13); ctx.lineTo(X + 8, ye + d * 13); ctx.closePath(); ctx.fill(); ctx.restore(); bgLabel(ctx, p, sd[1] + (Y < 0 ? " ↑" : " ↓"), X + (sd[0] < 0 ? -11 : 11), Y < 0 ? 22 : p.H - 22, sd[0] < 0 ? "right" : "left", pen, "600 12px " + p.fontUI); }
          else { bgLabel(ctx, p, sd[1] + (sd[0] < 0 ? " ←" : " →"), sd[0] < 0 ? 6 : p.W - 6, p.Y(clamp(y, v.ymin, v.ymax)) + (y > 0 ? 12 : -12), sd[0] < 0 ? "left" : "right", pen, "600 12px " + p.fontUI); }
        });
      } });
  };
  pnl.render = function(){
    var c = card(), st = cs(), a = c.a;
    var sg = function(s){ return s === "+" ? "positive" : s === "-" ? "negative" : "not chosen yet"; };
    pnl.draw({ numberLine:{ min:a - 3, max:a + 3, step:1, y:0.66, dots:[{ x:a, closed:false, color:css("--ink") }], marks:[{ x:a, label:"x = " + F(a) }] },
      describe:"Sign line for the line " + MV.plain(c.line) + ", with an open mark at x = " + F(a) + " (never included). Left of " + F(a) + ": " + sg(st.L) + ". Right of " + F(a) + ": " + sg(st.R) + ".",
      after:function(ctx, p){
        [["L", a - 1.6], ["R", a + 1.6]].forEach(function(s){
          var v = st[s[0]]; ctx.save(); ctx.font = "700 30px " + p.fontM; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = v ? css("--ink") : css("--ink-2");
          ctx.fillText(v === "+" ? "+" : v === "-" ? MINUS : "?", p.X(s[1]), p.H * 0.66 - 30); ctx.restore();
        });
      } });
  };
  pln.render = function(){
    var c = card(), a = c.a, k = c.k, R = 3 * Math.abs(k) + 1;
    pln.draw({ view:{ xmin:a - 3, xmax:a + 3, ymin:-R, ymax:R }, yTicks:{ fmt:function(){ return ""; } }, xTicks:{ step:1 }, describe:"The line " + MV.plain(c.line) + " in teal, crossing the x-axis at x = " + F(a) + ".",
      after:function(ctx, p){ p.curve({ f:function(x){ return k * x - c.c; }, color:css("--f3"), width:2.6, arrows:true }); p.point({ x:a, y:0, r:5, open:true, color:css("--ink") }); bgLabel(ctx, p, "y = " + MV.plain(c.line), k > 0 ? 8 : p.W - 8, 14, k > 0 ? "left" : "right", css("--f3"), "italic 14px " + p.fontM); } });
  };
  function radio(key, label, aria, opts){
    var st = cs(), r = st.res ? st.res[key] : null;
    return '<div class="ci-row"><span class="ci-lab">' + label + '</span><span class="ci-ch" role="radiogroup" aria-label="' + MV.esc(aria) + '">' + opts.map(function(o){
      var on = st[key] === o[0]; return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" aria-label="' + o[2] + '" data-key="' + key + '" data-v="' + o[0] + '" data-k="ci' + key + o[0] + '">' + o[1] + "</button>";
    }).join("") + "</span>" + (r == null ? "" : '<span class="ci-mk ' + (r ? "ok" : "no") + '">' + (r ? "✓" : "✗") + '<span class="vh">' + (r ? " right" : " not right") + "</span></span>") + "</div>";
  }
  var SG = [["+", "+", "positive"], ["-", MINUS, "negative"]], INF = [["+i", M("+∞"), "plus infinity"], ["-i", M("-∞"), "minus infinity"]], ZER = [["0+", M("0^{+}"), "0 from above"], ["0-", M("0^{-}"), "0 from below"]];
  function paint(){
    var c = card(), st = cs(), a = F(c.a), w = want(c);
    MV.keepFocus($("#ci-cards", host), function(){ $("#ci-cards", host).innerHTML = CARDS.map(function(x, i){ var s = S.cards[x.id]; return '<button type="button" class="chip' + (i === S.i ? " on" : "") + '" aria-pressed="' + (i === S.i) + '" data-card="' + i + '" data-k="cic' + i + '">Card ' + (i + 1) + (s && s.solved ? " ✓" : "") + "</button>"; }).join(""); });
    $("#ci-eq", host).innerHTML = c.eqs;
    $("#ci-slt", host).innerHTML = "The line " + c.line + " is 0 at " + M("x = " + a) + ", which is never included. Tap the line’s sign on each side.";
    $("#ci-lw", host).hidden = !st.line;
    MV.keepFocus($("#ci-signs", host), function(){
      $("#ci-signs", host).innerHTML = radio("L", "Left of " + M(a) + ":", "Sign of the line left of " + MV.plain(a), SG) + radio("R", "Right of " + M(a) + ":", "Sign of the line right of " + MV.plain(a), SG) +
        '<div class="chips" style="margin:6px 0 0"><button type="button" class="chip' + (st.line ? " on" : "") + '" aria-pressed="' + st.line + '" id="ci-showl" data-k="cishowl">Show the line</button></div>';
    });
    MV.keepFocus($("#ci-arr", host), function(){
      $("#ci-arr", host).innerHTML = radio("al", "As " + M("x → " + a + "^{-}") + ", " + M("y →"), "As x approaches " + MV.plain(a) + " from the left, y approaches", INF) +
        radio("ar", "As " + M("x → " + a + "^{+}") + ", " + M("y →"), "As x approaches " + MV.plain(a) + " from the right, y approaches", INF) +
        radio("el", "As " + M("x → -∞") + ", " + M("y →"), "As x approaches minus infinity, y approaches", ZER) +
        radio("er", "As " + M("x → ∞") + ", " + M("y →"), "As x approaches infinity, y approaches", ZER);
    });
    $("#ci-close", host).disabled = T.busy; $("#ci-ends", host).disabled = T.busy;
    $("#ci-fb", host).innerHTML = fbHTML;
    var rows = T.rows || (st.closed || st.ends ? [1].concat(st.closed ? [0.1, 0.01, 0.001] : [], st.ends ? [10, 100, 1000] : []) : []);
    $("#ci-tbl", host).innerHTML = rows.length ? MV.tableHTML({ head:["Rider", "<i>h</i>", "<i>x</i>", "Line, <i>kh</i>", "<i>y</i>"], caption:"Approach table for " + MV.plain(c.eq),
      rows:rows.reduce(function(out, h){ [-1, 1].forEach(function(s){ var hh = s * h; out.push([s < 0 ? "left" : "right", num(hh, 6), num(Number((c.a + hh).toFixed(6)), 6), num(Number((c.k * hh).toFixed(9)), 9), yFmt(hY(c.k, hh))]); }); return out; }, []) }) : "";
    $("#ci-note", host).innerHTML = MV.reduceMotion && st.closed ? FB.rm : "";
    var y3 = hY(c.k, 0.001), yt = yFmt(y3);
    $("#ci-live", host).innerHTML = tpl(FB.live, { n:S.i + 1, k:M("k = " + F(c.k)), a:M("a = " + a), h:M("h = 0.001"), calc:M("y = 1/(" + F(c.k) + " × 0.001)") + " " + (yt.charAt(0) === "≈" ? M(yt) : M("= " + yt)) });
    pnl.render(); if (st.line) pln.render(); pg.render();
    void w;
  }
  function fbLine(key, c){
    var up = c.k > 0, sL = up ? "negative" : "positive", sR = up ? "positive" : "negative", a = M(F(c.a));
    if (key === "L") return tpl(FB.sign, { xeq:M("x = " + c.tl.x), calc:c.tl.calc, sgn:sL });
    if (key === "R") return tpl(FB.sign, { xeq:M("x = " + c.tr.x), calc:c.tr.calc, sgn:sR });
    if (key === "al") return tpl(FB.near, { side:"left", a:a, sgn:sL, xeq:M("x = " + c.tl.x), v:c.tl.v, arrow:M("y → " + (up ? "-∞" : "+∞")) });
    if (key === "ar") return tpl(FB.near, { side:"right", a:a, sgn:sR, xeq:M("x = " + c.tr.x), v:c.tr.v, arrow:M("y → " + (up ? "+∞" : "-∞")) });
    if (key === "el") return tpl(FB.end, { side:"left", sgn:sL, xeq:M("x = " + F(c.a - 100)), v:F(-100 * c.k), arrow:M("y → 0^{" + (up ? "-" : "+") + "}") });
    return tpl(FB.end, { side:"right", sgn:sR, xeq:M("x = " + F(c.a + 100)), v:F(100 * c.k), arrow:M("y → 0^{" + (up ? "+" : "-") + "}") });
  }
  var LAB = function(key, c){ var a = F(c.a); return { L:"Left of " + M(a), R:"Right of " + M(a), al:"As " + M("x → " + a + "^{-}"), ar:"As " + M("x → " + a + "^{+}"), el:"As " + M("x → -∞"), er:"As " + M("x → ∞") }[key]; };
  function check(){
    var c = card(), st = cs(), w = want(c), keys = ["L", "R", "al", "ar", "el", "er"];
    if (keys.some(function(k){ return !st[k]; })) { fbHTML = '<div class="fb" role="status"><p>Choose a sign for each side and an answer for each arrow first.</p></div>'; paint(); return; }
    st.res = {}; st.tries++;
    var bad = keys.filter(function(k){ st.res[k] = st[k] === w[k]; return !st.res[k]; });
    if (!bad.length) { st.solved = true; fbHTML = '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + FB.done + "</p></div>"; }
    else fbHTML = '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong></p><ul class="ci-fbl">' + bad.map(function(k){ return "<li><strong>" + LAB(k, c) + ":</strong> " + fbLine(k, c) + "</li>"; }).join("") + "</ul><p>" + FB.fix + "</p></div>";
    api.save(); paint(); MV.focusFb($("#ci-fb", host));
  }
  function scrollGraph(){ var g = $(".ci-right", host), r = g.getBoundingClientRect(); if (r.top < 100 || r.top > window.innerHeight * 0.6) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  function run(kind){
    if (T.busy) return;
    var c = card(), st = cs(), a = c.a, tok = ++T.tok;
    var stops = kind === "close" ? [0.1, 0.01, 0.001] : [10, 100, 1000];
    var vFor = function(h){ return kind === "close" ? { xmin:a - 1.2 * h, xmax:a + 1.2 * h, ymin:-1.5 / h, ymax:1.5 / h } : { xmin:a - 1.2 * h, xmax:a + 1.2 * h, ymin:-1.5, ymax:1.5 }; };
    var keep = (kind === "close" ? st.ends : st.closed) ? (kind === "close" ? [10, 100, 1000] : [0.1, 0.01, 0.001]) : [];
    var fin = function(){ if (tok !== T.tok) return; T.busy = false; T.rows = null; st[kind === "close" ? "closed" : "ends"] = true; api.save(); paint(); };
    if (MV.reduceMotion) { T.view = vFor(stops[2]); T.h = stops[2]; fin(); return; }
    T.busy = true; T.view = base(a); T.h = 1; T.rows = kind === "close" ? [1].concat(keep) : [1, 0.1, 0.01, 0.001].filter(function(h){ return h === 1 || st.closed; });
    paint(); scrollGraph();
    var i = 0;
    var step = function(){
      if (tok !== T.tok) return;
      if (i >= stops.length) { MV.wait(300, fin); return; }
      var h0 = T.h, h1 = stops[i], v0 = T.view, v1 = vFor(h1);
      MV.tween({ dur:900, step:function(t){ if (tok !== T.tok) return; T.h = h0 * Math.pow(h1 / h0, t); pg.render(); }, done:function(){
        if (tok !== T.tok) return; T.h = h1;
        MV.wait(250, function(){ MV.tween({ dur:900, step:function(t){ if (tok !== T.tok) return; T.view = lerpView(v0, v1, t); pg.render(); }, done:function(){
          if (tok !== T.tok) return; T.view = v1;
          T.rows = kind === "close" ? T.rows.filter(function(h){ return h <= 1; }).concat([h1], keep) : T.rows.concat([h1]);
          T.rows.sort(function(p, q){ var ap = p > 1 ? 1 : 0, aq = q > 1 ? 1 : 0; return ap - aq || (ap ? p - q : q - p); });
          paint(); i++; MV.wait(900, step);
        } }); });
      } });
    };
    MV.wait(450, step);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var st = cs();
    if (b.dataset.card != null) { S.i = +b.dataset.card; T.tok++; T.busy = false; T.view = null; T.h = null; T.rows = null; fbHTML = ""; api.save(); paint(); return; }
    if (b.dataset.key) { st[b.dataset.key] = b.dataset.v; st.res = null; fbHTML = ""; api.save(); paint(); return; }
    if (b.id === "ci-showl") { st.line = !st.line; api.save(); paint(); return; }
    if (b.id === "ci-close") run("close");
    else if (b.id === "ci-ends") run("ends");
    else if (b.id === "ci-check") check();
  });
  // radio groups: arrow keys move between the two chips
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest('[role="radio"]'); if (!b) return;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key) < 0) return;
    e.preventDefault(); var sib = $$('[role="radio"]', b.parentNode), j = (sib.indexOf(b) + (e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1) + sib.length) % sib.length;
    sib[j].click(); var nb = host.querySelector('[data-k="' + sib[j].dataset.k + '"]'); if (nb) nb.focus();
  });
  paint();
  return {};
}

// ---------- Practice 1: Line meets its twin ----------
// @component N6 graphMatch — matching pairs where both columns are K5 graph thumbnails (equations revealed once matched),
// pair-specific feedback from the data, and a sticky sideways strip for the left column on phones
function twin(host, api, a){
  var S = api.S; S.done = S.done || {}; S.tries = S.tries || {}; S.hints = S.hints || {};
  var sel = null, msg = null, K = MV.ans(a), FB = a.fb, LV = { xmin:-5, xmax:5, ymin:-4, ymax:4 };
  function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
  function zOf(it){ return it.c / it.k; }
  function lineDesc(it){ var z = zOf(it); return (it.k > 0 ? "Rising" : "Falling") + " line crossing the x-axis at x = " + F(z) + " and passing through (" + F(z + 1) + ", " + F(it.k) + ")"; }
  function thumb(kind, it){
    var d = kind === "l" ? lineDesc(it) : MV.plain(it.desc);
    return '<button type="button" class="tw-th" data-' + kind + '="' + it.id + '" data-k="tw' + it.id + '" aria-pressed="false"><span class="tw-tag">' + it.name + '</span><canvas class="plot tw-c" role="img" aria-label="' + MV.esc(it.name + ": " + d) + '"></canvas><span class="tw-eq"></span></button>';
  }
  host.innerHTML = '<p class="how">' + a.how + '</p><div id="tw-sel"></div><div id="tw-msg"></div><p class="sort-done" id="tw-done" hidden></p>' +
    '<div class="tw"><div class="tw-col tw-lines"><h4>Lines</h4><div class="tw-grid" role="group" aria-label="Lines">' + a.left.map(function(it){ return thumb("l", it); }).join("") + "</div></div>" +
    '<div class="tw-col tw-recs"><h4>Reciprocals</h4><div class="tw-grid" role="group" aria-label="Reciprocal graphs">' + a.right.map(function(it){ return thumb("r", it); }).join("") + "</div></div></div>";
  function drawThumb(p, kind, it){
    var z = zOf(it);
    p.draw({ view:LV, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:1, fmt:evenFmt }, asymptotes:kind === "r" ? [{ x:z, label:"" }, { y:0, label:"" }] : [],
      describe:it.name + ": " + (kind === "l" ? lineDesc(it) : MV.plain(it.desc)),
      after:function(ctx, q){ if (kind === "l") q.curve({ f:function(x){ return it.k * x - it.c; }, color:css("--f3"), width:2.6, arrows:true }); else drawRecip(q, it.k, z, { width:2.8, head:11 }); } });
  }
  [["l", a.left], ["r", a.right]].forEach(function(g){
    g[1].forEach(function(it){ var cv = host.querySelector('[data-' + g[0] + '="' + it.id + '"] canvas'), p = new MV.Plot(cv, LV); p.render = function(){ drawThumb(p, g[0], it); }; p.render(); });
  });
  function stats(){ var f = 0, d = 0, miss = []; a.left.forEach(function(L){ var bad = (S.tries[L.id] || 0) > 0 || (S.hints[L.id] || 0) >= 3; if (S.done[L.id]) { d++; if (!bad) f++; } if (bad) miss.push(L); }); return { first:f, done:d, total:a.left.length, miss:miss }; }
  function pairTxt(L){ var R = byId(a.right, K[L.id]); return L.eq + " ↔ " + R.eq; }
  function paint(){
    var doneR = {}, n = 0;
    a.left.forEach(function(L, i){ if (S.done[L.id]) doneR[K[L.id]] = { i:i + 1, L:L }; });
    $$(".tw-th", host).forEach(function(b){
      var id = b.dataset.l || b.dataset.r, L = b.dataset.l ? byId(a.left, id) : null, dr = b.dataset.r ? doneR[id] : null, done = L ? !!S.done[id] : !!dr;
      var Ld = L || (dr && dr.L);
      b.classList.toggle("done", done); b.disabled = done; b.setAttribute("aria-pressed", String(!!L && sel === id));
      b.querySelector(".tw-eq").innerHTML = done ? '<span class="pair-n">✓ ' + (L ? a.left.indexOf(L) + 1 : dr.i) + "</span> " + pairTxt(Ld) : "";
      var base = b.querySelector("canvas").getAttribute("aria-label");
      b.setAttribute("aria-label", base + (done ? ". Matched: " + MV.plain(pairTxt(Ld)) : ""));
    });
    var L = sel ? byId(a.left, sel) : null, lv = L ? (S.hints[sel] || 0) : 0;
    $("#tw-sel", host).innerHTML = L ? '<div class="sel-bar"><span>Selected: <strong>' + L.name + "</strong></span>" + MV.hintBtn("twh" + a.id, lv) + "</div>" + MV.hintsHTML(L.hints, lv) : "";
    $("#tw-msg", host).innerHTML = msg ? '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>" : "";
    var s = stats(); n = s.done;
    var dn = $("#tw-done", host); dn.hidden = n < s.total; dn.textContent = "All matched! You got " + s.first + " of " + s.total + " right on the first try, without the worked solution.";
  }
  function mismatch(L, R){
    var z1 = zOf(L), z2 = zOf(R);
    if (!near(z1, z2)) return tpl(FB.asym, { a2:M("x = " + F(z2)), z1:M("x = " + F(z1)) });
    if ((L.k > 0) !== (R.k > 0)) return tpl(FB.dir, { d2:R.k < 0 ? "rises" : "falls", d1:L.k > 0 ? "rises" : "falls" });
    var x1 = (L.c + 1) / L.k, x2 = (R.c + 1) / R.k;
    return tpl(FB.steep, { x1:M("x = " + F(x1)), x1v:F(x1), x2v:F(x2) });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.l) { sel = sel === b.dataset.l ? null : b.dataset.l; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { S.hints[sel] = Math.min(3, (S.hints[sel] || 0) + 1); api.save(); MV.keepFocus(host, paint); return; }
    if (b.dataset.r) {
      if (!sel) { msg = { type:"", html:"Tap a line first, then tap the reciprocal graph that belongs to it." }; paint(); return; }
      var L = byId(a.left, sel), R = byId(a.right, b.dataset.r);
      if (K[sel] === R.id) { S.done[sel] = true; msg = { type:"good", html:"<strong>✓ Matched.</strong> " + pairTxt(L) + ". " + R.desc + "." }; sel = null; api.save(); paint(); MV.focusFb($("#tw-msg", host)); }
      else { S.tries[sel] = (S.tries[sel] || 0) + 1; msg = { type:"bad", html:"<strong>✗ Not a match.</strong> " + mismatch(L, R) + " " + FB.tail }; api.save(); paint(); MV.focusFb($("#tw-msg", host)); }
    }
  });
  function stick(){ var hd = $("header.top"); host.style.setProperty("--tw-top", (hd ? hd.offsetHeight : 0) + "px"); }
  window.addEventListener("resize", stick); stick(); twin.stick = stick;
  paint();
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:a.summary + " (first try): " + s.first + "/" + s.total + (s.done < s.total ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; stats().miss.forEach(function(L){ g = g.concat(MV.goalIdx(L.goal != null ? L.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 3: Work backwards ----------
// @component N4 coefBoxes — y = 1/([k]x − [c]) number boxes (fractions allowed), live caption, named wrong answers, preview after each check
var WV = { xmin:-4, xmax:8, ymin:-4, ymax:4 };
function backwards(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var msg = {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="wb-n"></span><span class="dots" id="wb-dots" aria-hidden="true"></span></div><p class="pred-q" id="wb-clue"></p>' +
    '<div class="design wb"><div>' +
    '<div class="wb-frame"><span class="m"><i>y</i> = 1/(</span><input class="numin wb-in" id="wb-k" type="text" autocomplete="off" spellcheck="false" placeholder="k" aria-label="k"><span class="m"><i>x</i> − </span><input class="numin wb-in" id="wb-c" type="text" autocomplete="off" spellcheck="false" placeholder="c" aria-label="c"><span class="m">)</span></div>' +
    '<p class="eq-cap wb-cap" id="wb-cap" aria-live="polite"></p>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="wb-check">Check</button><span id="wb-hint"></span></div><div id="wb-hints"></div><div id="wb-fb"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="wb-prev">Previous</button><button type="button" class="btn ghost sm" id="wb-next">Next clue</button></div></div>' +
    '<div><canvas class="plot" id="wb-plot" role="img" aria-label="Preview graph"></canvas><p class="tiny muted" id="wb-pn"></p></div></div>';
  var plot = new MV.Plot($("#wb-plot", host), WV);
  function cur(){ return a.items[S.i]; }
  function ist(it){ it = it || cur(); return S.items[it.id] || (S.items[it.id] = { k:"", c:"", tries:0, hint:0, solved:false, first:null, last:null }); }
  function val(raw){ var r = MV.parseNum(raw); return r && r.length === 1 ? r[0] : null; }
  plot.render = function(){
    var it = cur(), x = ist(it), L = x.last, k = L ? L.k : null, c = L ? L.c : null, z = L ? c / k : null;
    var desc = "Preview for clue " + (S.i + 1) + ". " + (L ? "Your function " + MV.plain(M(recipM(k, c, false))) + ", with asymptote x = " + F(z) + "." : "Your function appears here after you check.") + ((it.rings || []).length ? " Clue points: " + it.rings.map(function(r){ return r[2]; }).join(", ") + "." : "");
    plot.draw({ view:WV, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:1, fmt:evenFmt }, bands:it.shade ? [{ x0:it.shade[0], x1:it.shade[1] }] : [], asymptotes:L ? [{ x:z, label:"" }, { y:0, label:"" }] : [], describe:desc,
      after:function(ctx, p){
        var ink = css("--ink"), pen = css("--pen");
        if (it.guide != null) hLine(ctx, p, it.guide, [2, 4], "y = " + F(it.guide));
        if (L) { drawRecip(p, k, z); asymLabels(ctx, p, z, k); }
        if (it.va != null) { p.point({ x:it.va, y:0, r:7, open:true, color:ink }); bgLabel(ctx, p, "asymptote x = " + F(it.va), p.X(it.va) + 10, p.Y(0) + 16, "left"); }
        (it.rings || []).forEach(function(r){ p.point({ x:r[0], y:r[1], r:7, open:true, color:ink }); bgLabel(ctx, p, r[2], p.X(r[0]) + 11, p.Y(r[1]) + (r[1] >= 0 ? -12 : 12), "left"); });
        if (it.product && L) {
          var h = 1, yv = 1 / (k * h); if (Math.abs(yv) > 3.5) { h = 2; yv = 1 / (k * h); } if (Math.abs(yv) > 3.5) { h = 4; yv = 1 / (k * h); }
          var px = z + h, ay = Math.abs(yv);
          p.segment({ x1:z, y1:yv, x2:px, y2:yv, color:ink, width:1.6, dash:[4, 3] }); p.segment({ x1:px, y1:0, x2:px, y2:yv, color:ink, width:1.6, dash:[4, 3] });
          p.point({ x:px, y:yv, r:6, color:pen });
          bgLabel(ctx, p, Fr(h), p.X(z + h / 2), p.Y(yv) + (yv > 0 ? -11 : 11), "center", ink, "600 12px " + p.fontUI);
          bgLabel(ctx, p, Fr(ay), p.X(px) + 8, p.Y(yv / 2), "left", ink, "600 12px " + p.fontUI);
          bgLabel(ctx, p, Fr(h) + " × " + Fr(ay) + " = " + Fr(h * ay), p.X(px) + 8, p.Y(yv) + (yv > 0 ? -14 : 14), "left", pen);
        }
      } });
  };
  function cap(){
    var x = ist(), k = val(x.k), c = val(x.c), el = $("#wb-cap", host);
    el.innerHTML = k != null && c != null && k !== 0 ? M(recipM(k, c, true)) : "";
  }
  function paint(load){
    var it = cur(), x = ist(it);
    $("#wb-n", host).textContent = "Clue " + (S.i + 1) + " of " + a.items.length + (it.stretch ? " · Stretch" : "");
    $("#wb-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#wb-clue", host).innerHTML = it.clue;
    if (load) { $("#wb-k", host).value = x.k; $("#wb-c", host).value = x.c; }
    $("#wb-k", host).disabled = x.solved; $("#wb-c", host).disabled = x.solved;
    $("#wb-check", host).disabled = x.solved;
    MV.keepFocus(host, function(){
      $("#wb-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("wbh" + it.id, x.hint);
      $("#wb-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    });
    var A = MV.ans(it);
    $("#wb-fb", host).innerHTML = x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct: ' + M("k = " + F(A.k)) + ", " + M("c = " + F(A.c)) + ", so " + M(recipM(A.k, A.c, false)) + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : (msg[it.id] ? '<div class="fb bad" role="status"><p>' + msg[it.id] + "</p></div>" : "");
    $("#wb-prev", host).disabled = S.i === 0; $("#wb-next", host).disabled = S.i === a.items.length - 1;
    $("#wb-pn", host).textContent = x.last ? "Preview of your last check. Hollow rings mark the clues." : "Hollow rings mark the clues. Your function appears after you check.";
    cap(); plot.render();
  }
  host.addEventListener("input", function(e){ var t = e.target; if (t.id !== "wb-k" && t.id !== "wb-c") return; ist()[t.id === "wb-k" ? "k" : "c"] = t.value; api.save(); cap(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && (e.target.id === "wb-k" || e.target.id === "wb-c")) $("#wb-check", host).click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = cur(), x = ist(it);
    if (b.id === "wb-prev" || b.id === "wb-next") { S.i += b.id === "wb-prev" ? -1 : 1; api.save(); paint(true); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id !== "wb-check") return;
    var k = val(x.k), c = val(x.c), A = MV.ans(it);
    if (k == null || c == null) msg[it.id] = a.empty;
    else if (k === 0) msg[it.id] = a.kzero;
    else {
      x.last = { k:k, c:c };
      if (near(k, A.k) && near(c, A.c)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
      else {
        x.tries++;
        var named = (it.wrong || []).filter(function(w){ return near(w.k, k) && near(w.c, c); })[0];
        msg[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : near(c, 0) ? a.fallback0 : tpl(a.fallback, { xa:M("x = " + F(c / k)), v:M(F(1 / -c)) }));
      }
    }
    api.save(); paint(); MV.focusFb($("#wb-fb", host));
  });
  paint(true);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a reciprocal ----------
var DV = { xmin:-2, xmax:10, ymin:-3, ymax:3 };
var task = (function(){
  var api, plot;
  function TC(){ return MV.C.task; }
  function read(){
    var s = api ? api.S : {}, k = parseQ(s.k), c = parseQ(s.c);
    return { rk:s.k || "", rc:s.c || "", k:k, c:c, valid:!!(k && c && k.n !== 0) };
  }
  function at4(d){ return qsub(qmul(Q(4, 1), d.k), d.c); }
  function asym(d){ return qdiv(d.c, d.k); }
  function live(){
    var d = read(), el = $("#dr-read"); if (!el) return;
    var rows = [];
    if (d.valid) {
      var k = qv(d.k), c = qv(d.c), q = at4(d);
      rows.push(["Your function", M(recipM(k, c, true))]);
      rows.push(["Vertical asymptote", M("x = c/k = " + qtxt(asym(d)))]);
      rows.push(["At " + M("x = 4"), q.n === 0 ? "undefined: " + M("x = 4") + " is your asymptote" : M("y = " + qtxt(qdiv(Q(1, 1), q)))]);
    } else rows.push(["Your function", d.k && d.k.n === 0 ? "A line with " + M("k = 0") + " is horizontal, so it has no zero." : '<span class="muted">Enter a number in each box.</span>']);
    el.innerHTML = MV.readoutHTML(rows);
    draw();
  }
  function draw(){
    if (!plot) return;
    var d = read(), s = api ? api.S : {}, k = d.valid ? qv(d.k) : null, c = d.valid ? qv(d.c) : null, z = d.valid ? c / k : null;
    plot.draw({ view:DV, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:1 }, asymptotes:d.valid ? [{ x:z, label:"" }, { y:0, label:"" }] : [],
      describe:(d.valid ? "Your reciprocal " + MV.plain(M(recipM(k, c, false))) + " with its asymptote x = " + F(z) + ". " : "No function yet. ") + "The target point (4, 1/2) is a hollow ring; the gate 0 < x < 8 is shaded along the x-axis." + (s.line && d.valid ? " The line is shown in teal with the point (4, 2)." : ""),
      after:function(ctx, p){
        var x0 = p.X(0), x8 = p.X(8), Y0 = p.Y(0);
        ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(x0, Y0 - 8, x8 - x0, 16); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, Y0 - 8); ctx.lineTo(x0, Y0 + 8); ctx.moveTo(x8, Y0 - 8); ctx.lineTo(x8, Y0 + 8); ctx.stroke(); ctx.restore();
        bgLabel(ctx, p, "gate: 0 < x < 8", p.X(4), Y0 + 20, "center", css("--ink-2"), "600 12px " + p.fontUI);
        if (d.valid && s.line) { p.curve({ f:function(x){ return k * x - c; }, color:css("--f3"), width:2.6, arrows:true }); p.point({ x:4, y:2, r:7, open:true, color:css("--f3") }); bgLabel(ctx, p, "(4, 2)", p.X(4) + 11, p.Y(2) - 10, "left", css("--f3")); }
        if (d.valid) { drawRecip(p, k, z); asymLabels(ctx, p, z, k); }
        p.point({ x:4, y:0.5, r:7, open:true, color:css("--ink") }); bgLabel(ctx, p, "(4, 1/2)", p.X(4) + 11, p.Y(0.5) - 11, "left");
      } });
  }
  return {
    render:function(inp, pv, a){
      api = a; a.S.k = a.S.k || ""; a.S.c = a.S.c || "";
      inp.innerHTML = '<div class="wb-frame"><span class="m"><i>y</i> = 1/(</span><input class="numin wb-in" id="dr-k" type="text" autocomplete="off" spellcheck="false" placeholder="k" aria-label="k" value="' + MV.esc(a.S.k) + '"><span class="m"><i>x</i> − </span><input class="numin wb-in" id="dr-c" type="text" autocomplete="off" spellcheck="false" placeholder="c" aria-label="c" value="' + MV.esc(a.S.c) + '"><span class="m">)</span></div>' +
        '<dl class="read dr-read" id="dr-read" aria-live="polite"></dl>';
      pv.innerHTML = '<canvas class="plot wide" id="dr-plot" role="img" aria-label="Preview of your design"></canvas><div class="chips" style="margin-top:10px"><button type="button" class="chip" id="dr-line" aria-pressed="false">Show the line</button></div>';
      plot = new MV.Plot($("#dr-plot"), DV); plot.render = draw;
      var lb = $("#dr-line"); function lbPaint(){ lb.classList.toggle("on", !!a.S.line); lb.setAttribute("aria-pressed", String(!!a.S.line)); }
      lb.addEventListener("click", function(){ a.S.line = !a.S.line; a.save(); lbPaint(); draw(); });
      inp.addEventListener("input", function(e){ var id = e.target.id; if (id !== "dr-k" && id !== "dr-c") return; a.S[id === "dr-k" ? "k" : "c"] = e.target.value; a.save(); live(); a.update(); });
      lbPaint(); live();
    },
    read:read,
    valid:function(d){ return d.valid ? true : TC().tips[0]; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      var q = at4(d), z = asym(d);
      return [true, q.n === 2 && q.d === 1, d.k.n < 0, z.d === 1 && z.n > 0 && z.n < 8];
    },
    tips:function(d, r){
      var T = TC(), out = [];
      if (!r[1]) { var q = at4(d); out.push(q.n === 0 ? T.tip2zero : tpl(T.tips[1], { v:M(qtxt(qdiv(Q(1, 1), q))) })); }
      if (!r[2]) out.push(T.tips[2]);
      if (!r[3]) out.push(tpl(T.tips[3], { v:M(qtxt(asym(d))) }));
      return out;
    },
    key:function(d){ return d.k.n + "/" + d.k.d + "|" + d.c.n + "/" + d.c.d; },
    label:function(key){ var p = key.split("|").map(function(t){ var x = t.split("/"); return Q(+x[0], +x[1]); }); return M("(k, c) = (" + qtxt(p[0]) + ", " + qtxt(p[1]) + ")"); },
    text:function(key){ var p = key.split("|").map(function(t){ var x = t.split("/"); return Q(+x[0], +x[1]); }); return "(k, c) = (" + qtxt(p[0]) + ", " + qtxt(p[1]) + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ twin:twin, backwards:backwards },
  task:task,
  onShow:function(v){ if (v === "practice" && twin.stick) twin.stick(); }
});
})();
