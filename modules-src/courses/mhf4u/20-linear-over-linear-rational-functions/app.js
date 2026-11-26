// MHF4U 20 Linear over Linear Rational Functions: hero, Asymptote crosshair (Explore), Sketch from the equation (Part 3),
// Match the graph, Build the function, Design to spec (task). Plan: mhf4u/plan/modules/20-linear-over-linear-rational-functions.md
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, M = MV.m;

// ---------- exact numbers ----------
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r2(v){ return Math.round(v * 2) / 2; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function Q(n, d){ if (d === undefined) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return { n:n / g, d:d / g }; }
function ratOf(v){ for (var d = 1; d <= 1000; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9 * Math.max(1, Math.abs(v))) return Q(n, d); } return null; }
function qOf(v){ return (v && typeof v === "object") ? v : (ratOf(v) || Q(Math.round(v * 1000), 1000)); }
function qadd(a, b){ return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
function qsub(a, b){ return Q(a.n * b.d - b.n * a.d, a.d * b.d); }
function qmul(a, b){ return Q(a.n * b.n, a.d * b.d); }
function qdiv(a, b){ return Q(a.n * b.d, a.d * b.n); }
function qeq(a, b){ return !!a && !!b && a.n === b.n && a.d === b.d; }
function qv(a){ return a.n / a.d; }
function qkey(a){ return a.d === 1 ? String(a.n) : a.n + "/" + a.d; }
function qsgn(a){ return a.n > 0 ? 1 : a.n < 0 ? -1 : 0; }
function qabs(a){ return Q(Math.abs(a.n), a.d); }
function qneg(a){ return Q(-a.n, a.d); }
// m() source for a value: integers plain, fractions stacked
function qM(a){ a = qOf(a); return a.d === 1 ? String(a.n) : (a.n < 0 ? "-" : "") + "{" + Math.abs(a.n) + "}/{" + a.d + "}"; }
function qT(a){ a = qOf(a); return a.d === 1 ? num(a.n) : (a.n < 0 ? MINUS : "") + Math.abs(a.n) + "/" + a.d; }
function ptM(x, y){ return "(" + qM(x) + ", " + qM(y) + ")"; }
function ptT(x, y){ return "(" + qT(x) + ", " + qT(y) + ")"; }
function par(a){ return qsgn(a) < 0 ? "(" + qM(a) + ")" : qM(a); }
function tpl(s, o){ return String(s || "").replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : m; }); }
function decQ(t){ var p = t.split("."), f = p[1] || ""; return { n:parseInt((p[0] || "0") + f, 10), d:Math.pow(10, f.length) }; }
// whole numbers, decimals and simple fractions ("−3/2", "0.5"); null otherwise
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

// ---------- the function y = (ax + b)/(cx + d) ----------
// @component linOverLin — exact model of (ax + b)/(cx + d): crosshair (−d/c, a/c), stretch (bc − ad)/c², intercepts, std form, crosshair-form m() source
// whole-number coefficients with no common factor; the first non-zero of c, d, a, b made positive (so c > 0 when c ≠ 0)
function stdCoefs(L){
  L = L.map(qOf);
  var den = L.reduce(function(m, r){ return m * r.d / gcd(m, r.d); }, 1);
  var ints = L.map(function(r){ return r.n * den / r.d; });
  var g = ints.reduce(function(m, v){ return gcd(m, v); }, 0) || 1;
  ints = ints.map(function(v){ return v / g + 0; });
  var lead = [2, 3, 0, 1].map(function(i){ return ints[i]; }).filter(function(v){ return v !== 0; })[0];
  if (lead < 0) ints = ints.map(function(v){ return -v + 0; });
  return ints;
}
function sameFn(L1, L2){ return stdCoefs(L1).join() === stdCoefs(L2).join(); }
// c ≠ 0 required
function fromCoef(a, b, c, d){
  a = qOf(a); b = qOf(b); c = qOf(c); d = qOf(d);
  var F = { a:a, b:b, c:c, d:d };
  F.det = qsub(qmul(a, d), qmul(b, c));
  F.special = F.det.n === 0;
  F.H = qdiv(qneg(d), c); F.Qv = qdiv(a, c);
  F.S = qdiv(qsub(qmul(b, c), qmul(a, d)), qmul(c, c));
  F.h = qv(F.H); F.q = qv(F.Qv); F.s = qv(F.S);
  F.std = stdCoefs([a, b, c, d]);
  F.xi = a.n !== 0 ? qdiv(qneg(b), a) : null;
  F.yi = d.n !== 0 ? qdiv(b, d) : null;
  F.f = function(x){ return (qv(a) * x + qv(b)) / (qv(c) * x + qv(d)); };
  return F;
}
function fromCross(h, q, s){ var H = qOf(h), V = qOf(q), S = qOf(s); return fromCoef(V, qsub(S, qmul(V, H)), Q(1), qneg(H)); }
function fAt(F, X){ var den = qadd(qmul(F.c, X), F.d); if (den.n === 0) return null; return qdiv(qadd(qmul(F.a, X), F.b), den); }
// m() source of v·x + w with signs folded
function coefM(a){ return a.d === 1 ? String(a.n) : (a.n < 0 ? "-" : "") + "{" + Math.abs(a.n) + "}/{" + a.d + "}"; }
function linM(a, b, v){
  a = qOf(a); b = qOf(b); v = v || "x"; var s = "";
  if (a.n !== 0) s = (qeq(a, Q(1)) ? "" : qeq(a, Q(-1)) ? "-" : coefM(a)) + v;
  if (b.n !== 0 || !s) s += s ? (b.n > 0 ? " + " : " - ") + qM(qabs(b)) : qM(b);
  return s;
}
function fracM(L){ return "{" + linM(L[0], L[1]) + "}/{" + linM(L[2], L[3]) + "}"; }
// crosshair form; col = parameter colours (violet stretch, teal wall, magenta level)
function crossM(F, col){
  var A = function(t){ return col ? "@a{" + t + "}" : t; }, D = function(t){ return col ? "@d{" + t + "}" : t; }, C = function(t){ return col ? "@c{" + t + "}" : t; };
  var den = F.H.n === 0 ? "x" : "x " + (F.H.n > 0 ? "- " : "+ ") + D(qM(qabs(F.H)));
  var s = (F.S.n < 0 ? A("-") : "") + "{" + A(qM(qabs(F.S))) + "}/{" + den + "}";
  if (F.Qv.n !== 0) s += (F.Qv.n > 0 ? " + " : " - ") + C(qM(qabs(F.Qv)));
  return s;
}
function cornersOf(F){ return F.s > 0 ? ["ur", "ll"] : ["ul", "lr"]; }
var CNAME = { ul:"upper-left", ur:"upper-right", ll:"lower-left", lr:"lower-right" };
function pairName(cn){ return cn.indexOf("ur") >= 0 ? "upper right and lower left" : "upper left and lower right"; }
function cornerOf(x, y, h, q){ var sx = qsgn(qsub(x, h)), sy = qsgn(qsub(y, q)); if (!sx || !sy) return null; return (sy > 0 ? "u" : "l") + (sx > 0 ? "r" : "l"); }

// ---------- drawing ----------
// points of one branch of y = q + s/(x − h) for view v, dense near the wall (G16)
function hypPts(h, q, s, v, side){
  var span = v.xmax - v.xmin, yr = v.ymax - v.ymin, ylim = Math.max(Math.abs(v.ymin - q), Math.abs(v.ymax - q)) + yr;
  var x0 = v.xmin - span * 0.02, x1 = v.xmax + span * 0.02, gap = Math.abs(s) / ylim;
  var a = side < 0 ? x0 : Math.max(x0, h + gap), b = side < 0 ? Math.min(x1, h - gap) : x1;
  if (!(b > a)) return [];
  var xs = [], i, N = 260, lo = yr * 0.01;
  for (i = 0; i <= N; i++) xs.push(a + (b - a) * i / N);
  for (i = 0; i <= 160; i++) { var Y = lo * Math.pow(ylim / lo, i / 160), xx = h + side * Math.abs(s) / Y; if (xx > a && xx < b) xs.push(xx); }
  xs.sort(function(p, r){ return p - r; });
  return xs.map(function(x){ return [x, q + s / (x - h)]; });
}
function endHeads(p, pts, color, size){
  var v = p.v, ins = function(r){ return r[0] >= v.xmin && r[0] <= v.xmax && r[1] >= v.ymin && r[1] <= v.ymax; };
  var i0 = -1, i1 = -1, i;
  for (i = 0; i < pts.length; i++) if (ins(pts[i])) { i0 = i; break; }
  for (i = pts.length - 1; i >= 0; i--) if (ins(pts[i])) { i1 = i; break; }
  if (i0 < 0 || i1 - i0 < 2) return;
  function back(k, dir){ var X0 = p.X(pts[k][0]), Y0 = p.Y(pts[k][1]), j = k; while (j + dir >= 0 && j + dir < pts.length) { j += dir; if (Math.hypot(p.X(pts[j][0]) - X0, p.Y(pts[j][1]) - Y0) >= 14) break; } return j; }
  p.head(pts[back(i0, 1)], pts[i0], color, size || 13);
  p.head(pts[back(i1, -1)], pts[i1], color, size || 13);
}
function visPts(p, pts){ var v = p.v, m = (v.ymax - v.ymin) * 0.02; return pts.filter(function(r){ return r[1] >= v.ymin - m && r[1] <= v.ymax + m; }); }
// o: {color, width, dash, alpha, heads, reveal (0..1 per branch, left first)}
function drawHyp(p, h, q, s, o){
  o = o || {};
  var col = o.color || css("--pen");
  [-1, 1].forEach(function(side, k){
    var pts = hypPts(h, q, s, p.v, side); if (!pts.length) return;
    if (o.reveal != null) { var t = clamp(o.reveal * 2 - k, 0, 1); if (t <= 0) return; var vp = visPts(p, pts); pts = vp.slice(0, Math.max(2, Math.ceil(vp.length * t))); if (t < 1) { p.curve({ pts:pts, color:col, width:o.width || 3, dash:o.dash, alpha:o.alpha }); return; } }
    p.curve({ pts:pts, color:col, width:o.width || 3, dash:o.dash, alpha:o.alpha });
    if (o.heads !== false) endHeads(p, pts, col, o.head);
  });
}
// @component G11 canvasFracLabel — canvas labels with stacked fractions and per-token colours: toks = [{t, c, i (italic)} | {fn, fd, c}]
function tokVal(r, col){ r = qOf(r); if (r.d === 1) return [{ t:num(r.n), c:col }]; return (r.n < 0 ? [{ t:MINUS, c:col }] : []).concat([{ fn:String(Math.abs(r.n)), fd:String(r.d), c:col }]); }
function tokPt(x, y, col){ return [{ t:"(", c:col }].concat(tokVal(x, col), [{ t:", ", c:col }], tokVal(y, col), [{ t:")", c:col }]); }
function drawToks(ctx, p, toks, X, Y, o){
  o = o || {};
  var sz = o.size || 14, fs = Math.round(sz * 0.8), fm = p.fontM || "serif", ink = css("--ink");
  var fontOf = function(tk){ return (tk.i ? "italic " : "") + "600 " + sz + "px " + fm; };
  ctx.save();
  var ws = toks.map(function(tk){ if (tk.fn != null) { ctx.font = "600 " + fs + "px " + fm; return Math.max(ctx.measureText(tk.fn).width, ctx.measureText(tk.fd).width) + 4; } ctx.font = fontOf(tk); return ctx.measureText(tk.t).width; });
  var w = ws.reduce(function(s, x){ return s + x; }, 0), hasF = toks.some(function(tk){ return tk.fn != null; }), hh = hasF ? sz * 1.75 : sz * 1.2;
  var x0 = o.align === "right" ? X - w : o.align === "center" ? X - w / 2 : X;
  x0 = clamp(x0, 3, Math.max(3, p.W - w - 3)); Y = clamp(Y, hh / 2 + 2, p.H - hh / 2 - 2);
  if (o.bg !== false) { ctx.globalAlpha = 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, Y - hh / 2, w + 6, hh); ctx.globalAlpha = 1; }
  ctx.textBaseline = "middle";
  var x = x0;
  toks.forEach(function(tk, i){
    ctx.fillStyle = tk.c || ink;
    if (tk.fn != null) {
      ctx.font = "600 " + fs + "px " + fm; ctx.textAlign = "center";
      ctx.fillText(tk.fn, x + ws[i] / 2, Y - fs * 0.6); ctx.fillText(tk.fd, x + ws[i] / 2, Y + fs * 0.66);
      ctx.fillRect(x + 1.5, Y - 0.6, ws[i] - 3, 1.3);
    } else { ctx.font = fontOf(tk); ctx.textAlign = "left"; ctx.fillText(tk.t, x, Y); }
    x += ws[i];
  });
  ctx.restore();
  return { x:x0, w:w, h:hh };
}
function dashV(ctx, p, x, col){ var X = p.X(x); if (X < -2 || X > p.W + 2) return; ctx.save(); ctx.strokeStyle = col || css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore(); }
function dashH(ctx, p, y, col){ var Y = p.Y(y); if (Y < -2 || Y > p.H + 2) return; ctx.save(); ctx.strokeStyle = col || css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(p.W, Y); ctx.stroke(); ctx.restore(); }
// dashed asymptotes with labels "x = 2" (number teal) and "y = 1" (number magenta)
function asymLabelled(ctx, p, H, V, s){
  var ink2 = css("--ink-2"), up = s == null || s < 0;
  dashV(ctx, p, qv(H)); dashH(ctx, p, qv(V));
  var X = p.X(qv(H)), Y = p.Y(qv(V)), left = s != null && s > 0 ? X > 70 : X > p.W - 70;
  if (X > -2 && X < p.W + 2) drawToks(ctx, p, [{ t:"x", i:true, c:ink2 }, { t:" = ", c:ink2 }].concat(tokVal(H, css("--p-d"))), X + (left ? -6 : 6), 16, { align:left ? "right" : "left" });
  if (Y > -2 && Y < p.H + 2) drawToks(ctx, p, [{ t:"y", i:true, c:ink2 }, { t:" = ", c:ink2 }].concat(tokVal(V, css("--p-c"))), p.W - 6, Y + (up ? (Y < 30 ? 16 : -14) : (Y > p.H - 30 ? -14 : 16)), { align:"right" });
}
// intercept dots with labels placed away from each other
function interceptLabels(ctx, p, F, labels){
  var ink = css("--ink"), xi = F.xi ? qv(F.xi) : null, yi = F.yi ? qv(F.yi) : null;
  if (xi != null) { p.point({ x:xi, y:0, r:5, color:ink }); if (labels !== false) drawToks(ctx, p, tokPt(F.xi, Q(0)), p.X(xi) + (xi < 0 ? -8 : 8), p.Y(0) + (yi != null && yi < 0 ? -16 : 18), { align:xi < 0 ? "right" : "left", size:13 }); }
  if (yi != null) { p.point({ x:0, y:yi, r:5, color:ink }); if (labels !== false) { var right = xi != null ? xi < 0 : F.h < 0; drawToks(ctx, p, tokPt(Q(0), F.yi), p.X(0) + (right ? 10 : -10), p.Y(yi), { align:right ? "left" : "right", size:13 }); } }
}
function shadeCorners(ctx, p, h, q, cn, words){
  var X = clamp(p.X(h), 0, p.W), Y = clamp(p.Y(q), 0, p.H), R = { ul:[0, 0, X, Y], ur:[X, 0, p.W - X, Y], ll:[0, Y, X, p.H - Y], lr:[X, Y, p.W - X, p.H - Y] };
  ctx.save(); ctx.fillStyle = css("--hi-soft");
  cn.forEach(function(k){ var r = R[k]; ctx.fillRect(r[0], r[1], r[2], r[3]); });
  if (words) {
    ctx.font = "italic 13px " + (p.fontUI || "sans-serif"); ctx.fillStyle = css("--ink-2");
    cn.forEach(function(k){ var r = R[k]; if (r[2] < 60 || r[3] < 30) return; var right = k[1] === "r", up = k[0] === "u"; ctx.textAlign = right ? "right" : "left"; ctx.textBaseline = up ? "top" : "bottom"; ctx.fillText("branch", right ? p.W - 8 : 8, up ? 30 : p.H - 8); });
  }
  ctx.restore();
}
function ring(ctx, p, x, y, col, r, w){ var X = p.X(x), Y = p.Y(y); if (X < -12 || X > p.W + 12 || Y < -12 || Y > p.H + 12) return; ctx.save(); ctx.beginPath(); ctx.arc(X, Y, r || 7, 0, Math.PI * 2); ctx.lineWidth = w || 2.5; ctx.strokeStyle = col; ctx.stroke(); ctx.restore(); }
// a point that may be off the window: drawn at the edge as a half-dot with a small arrow
function edgeDot(ctx, p, x, y, col, o){
  o = o || {};
  var X = p.X(x), Y = p.Y(y), off = Y < 0 ? -1 : Y > p.H ? 1 : 0;
  if (X < -10 || X > p.W + 10) return;
  if (!off) { if (o.ring) { ctx.save(); ctx.beginPath(); ctx.arc(X, Y, 12, 0, Math.PI * 2); ctx.fillStyle = css("--hi"); ctx.fill(); ctx.restore(); } ctx.save(); ctx.beginPath(); ctx.arc(X, Y, o.r || 7, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--sheet"); ctx.stroke(); ctx.restore(); return; }
  var Ye = off < 0 ? 0 : p.H, tip = off < 0 ? 3 : p.H - 3, base = off < 0 ? 14 : p.H - 14;
  ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X, Ye, 9, off < 0 ? 0 : Math.PI, off < 0 ? Math.PI : Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(X + 16, tip); ctx.lineTo(X + 11, base); ctx.lineTo(X + 21, base); ctx.closePath(); ctx.fill(); ctx.restore();
}
function evenFmt(t){ return Math.round(t) % 2 === 0 ? num(t) : ""; }

// ---------- hero (storyboard: parent → stretch 3 → move to (2, 1) → intercepts → equation) ----------
function hero(f){
  if (!f.canvas) return;
  var V = { xmin:-6, xmax:6, ymin:-4.5, ymax:4.5 }, p = new MV.Plot(f.canvas, V), st = { par:0, k:1, kOn:false, h:0, q:0, mv:false, ints:false };
  var A = css, cap = f.cap;
  p.render = function(){
    p.draw({ view:V, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:1, fmt:evenFmt },
      describe:"y = 1/x stretched by 3 and moved so its crosshair is (2, 1): the graph of y = (x + 1)/(x − 2), with asymptotes x = 2 and y = 1 and intercepts (−1, 0) and (0, −1/2).",
      after:function(ctx, q){
        var ink2 = A("--ink-2"), vio = A("--acol"), teal = A("--p-d"), mag = A("--p-c");
        drawHyp(q, 0, 0, 1, { color:ink2, width:2, dash:[6, 6], alpha:0.6, heads:false, reveal:st.par < 1 ? st.par : null });
        if (st.mv) { if (st.lab) asymLabelled(ctx, q, Q(2), Q(1), 3); else { dashV(ctx, q, st.h); dashH(ctx, q, st.q); } }
        if (st.mv && st.h > 0.01) q.segment({ x1:0, y1:0, x2:st.h, y2:0, color:teal, width:2.4, arrow:true });
        if (st.mv && st.q > 0.01) q.segment({ x1:2, y1:0, x2:2, y2:st.q, color:mag, width:2.4, arrow:true });
        if (st.kOn) {
          drawHyp(q, st.h, st.q, st.k, { color:A("--pen"), width:3 });
          var bx = st.h + 1;
          q.segment({ x1:bx, y1:st.q, x2:bx, y2:st.q + st.k, color:vio, width:2.4 });
          q.segment({ x1:bx - 0.12, y1:st.q, x2:bx + 0.12, y2:st.q, color:vio, width:2.4 });
          q.segment({ x1:bx - 0.12, y1:st.q + st.k, x2:bx + 0.12, y2:st.q + st.k, color:vio, width:2.4 });
          drawToks(ctx, q, [{ t:"stretch " + num(Math.round(st.k * 10) / 10), c:vio }], q.X(bx) + 8, q.Y(st.q + st.k / 2), { align:"left", size:13 });
        }
        ring(ctx, q, st.h, st.q, A("--ink"), 6, 2.2);
        if (st.ints) {
          q.point({ x:-1, y:0, r:5, color:A("--ink") }); q.point({ x:0, y:-0.5, r:5, color:A("--ink") });
          drawToks(ctx, q, tokPt(Q(-1), Q(0)), q.X(-1) - 8, q.Y(0) - 16, { align:"right", size:13 });
          drawToks(ctx, q, tokPt(Q(0), Q(-1, 2)), q.X(0) + 8, q.Y(-0.5) + 18, { align:"left", size:13 });
        }
      } });
  };
  var eqC = M("y = {@a{3}}/{x - @d{2}} + @c{1}"), eqB = M("y = {@a{3}}/{x - @d{2}} + @c{1} = {x + 1}/{x - 2}");
  var sent = '<span class="hero-sent">' + M("y = {x + 1}/{x - 2}") + " is " + M("y = 1/x") + " stretched by 3, with its crosshair moved to (2, 1).</span>";
  function final(){ st = { par:1, k:3, kOn:true, h:2, q:1, mv:true, lab:true, ints:true }; cap.innerHTML = eqB + "<br>" + sent; p.render(); }
  if (MV.reduceMotion) { final(); return; }
  p.render();
  var lin = function(t){ return t; };
  MV.tween({ dur:1000, ease:lin, step:function(t){ st.par = t; p.render(); }, done:function(){
    st.par = 1; st.kOn = true; cap.innerHTML = '<span class="p-a">stretch 3</span>';
    MV.wait(200, function(){
      MV.tween({ dur:1000, step:function(t){ st.k = 1 + 2 * t; p.render(); }, done:function(){
        MV.wait(200, function(){
          st.mv = true;
          MV.tween({ dur:700, step:function(t){ st.h = 2 * t; p.render(); }, done:function(){
            MV.tween({ dur:700, step:function(t){ st.q = t; p.render(); }, done:function(){
              st.h = 2; st.q = 1; st.lab = true; p.render();
              MV.wait(350, function(){ st.ints = true; p.render();
                MV.wait(350, function(){ cap.innerHTML = eqC;
                  MV.wait(1100, function(){ cap.innerHTML = eqB;
                    MV.wait(1100, function(){ final(); }); }); }); });
            } });
          } });
        });
      } });
    });
  } });
}

// ---------- Explore: asymptote crosshair (two modes, three lenses, half-turn test) ----------
var DEF = { xmin:-10, xmax:10, ymin:-7.5, ymax:7.5 };
function cp(v){ return { xmin:v.xmin, xmax:v.xmax, ymin:v.ymin, ymax:v.ymax }; }
function lerpView(a, b, t){
  var g = function(u, w){ return u * Math.pow(w / u, t); };
  var cx = (a.xmin + a.xmax) / 2 + ((b.xmin + b.xmax) / 2 - (a.xmin + a.xmax) / 2) * t, cy = (a.ymin + a.ymax) / 2 + ((b.ymin + b.ymax) / 2 - (a.ymin + a.ymax) / 2) * t;
  var wx = g((a.xmax - a.xmin) / 2, (b.xmax - b.xmin) / 2), wy = g((a.ymax - a.ymin) / 2, (b.ymax - b.ymin) / 2);
  return { xmin:cx - wx, xmax:cx + wx, ymin:cy - wy, ymax:cy + wy };
}
function sameView(a, b){ return ["xmin", "xmax", "ymin", "ymax"].every(function(k){ return Math.abs(a[k] - b[k]) < 1e-9; }); }
var EXP = null;
function explore(host, api){
  var C = api.content, U = C.ui, S = api.S;
  if (!S.mode) { S.mode = "cross"; S.h = 2; S.q = 1; S.s = 3; S.a = 1; S.b = 1; S.c = 1; S.d = -2; S.lens = "off"; S.parent = false; S.u = 2; }
  var T = { view:cp(DEF), spin:null, busy:false, rows:null, trace:null, p4:null, extra:null, far:null, anim:null };
  var L = MV.pgLayout(host, { aria:"Asymptote crosshair graph" });
  host.firstChild.classList.add("ax");
  L.graph.insertAdjacentHTML("afterbegin", '<div class="ax-mode" id="ax-mode"></div>');
  L.graph.insertAdjacentHTML("beforeend", '<div id="ax-tbl" class="ax-tbl"></div>');
  L.ctrl.innerHTML = '<div id="ax-sl" class="ax-sl"></div>' +
    '<div id="ax-st" class="ax-st" role="group" aria-label="Coefficients a, b, c and d" hidden>' + ["a", "b", "c", "d"].map(function(k){
      return '<div class="ax-stp"><span class="ax-stl m"><i>' + k + '</i></span><button type="button" class="btn ghost sm" data-co="' + k + '" data-dir="-1" data-k="axs' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + '</button>' +
        '<input type="number" class="numin ax-in" id="ax-' + k + '" data-ci="' + k + '" min="-9" max="9" step="1" aria-label="' + k + '">' +
        '<button type="button" class="btn ghost sm" data-co="' + k + '" data-dir="1" data-k="axs' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
    }).join("") + '<p class="tiny muted ax-stnote">Whole numbers from −9 to 9; ' + M("c") + ' can’t be 0.</p></div>' +
    '<div id="ax-lens"></div>' +
    '<div class="q-actions"><button type="button" class="btn sm" id="ax-turn">Half-turn test</button><button type="button" class="btn ghost sm" id="ax-par" aria-pressed="false">Show ' + M("y = 1/x") + "</button></div>";
  L.read.classList.add("ax-read");
  L.read.insertAdjacentHTML("afterend", '<button type="button" class="btn ghost sm ax-all" id="ax-all" aria-expanded="false">Show all features</button>');
  var plot = new MV.Plot(L.canvas, DEF);
  function cur(){ return S.mode === "cross" ? fromCross(S.h, S.q, S.s) : fromCoef(S.a, S.b, S.c, S.d); }
  function banner(kind, html){ L.banner.className = "banner" + (kind ? " " + kind : ""); L.banner.innerHTML = html || ""; }

  // ----- views -----
  function baseView(F){
    var v = cp(DEF);
    if (S.mode !== "coef") return v;
    if (F.h < v.xmin + 1 || F.h > v.xmax - 1) { v.xmin = F.h - 10; v.xmax = F.h + 10; }
    if (F.q < v.ymin + 1 || F.q > v.ymax - 1) { v.ymin = F.q - 7.5; v.ymax = F.q + 7.5; }
    return v;
  }
  function lensView(F){
    if (F.special) return baseView(F);
    if (S.lens === "near") return { xmin:F.h - 1.5, xmax:F.h + 1.5, ymin:F.q - 20, ymax:F.q + 20 };
    if (S.lens === "far") return { xmin:-1000, xmax:1000, ymin:F.q - 5, ymax:F.q + 5 };
    return baseView(F);
  }
  function stopAnim(){ if (T.anim) { T.anim(); T.anim = null; } }
  function goView(target, dur, step, done){
    stopAnim();
    var from = cp(T.view);
    if (sameView(from, target)) { T.view = cp(target); if (step) step(1); if (done) done(); return; }
    T.anim = MV.tween({ dur:dur, step:function(t){ T.view = lerpView(from, target, t); if (step) step(t); quick(); }, done:function(){ T.anim = null; T.view = cp(target); quick(); if (done) done(); } });
  }

  // ----- controls -----
  var modeSeg = MV.seg($("#ax-mode", host), { label:"Mode", options:[{ id:"cross", t:U.modes[0] }, { id:"coef", t:U.modes[1] }], value:S.mode, onChange:function(v){ if (!setMode(v)) modeSeg.set(S.mode); } });
  var lensSeg = MV.seg($("#ax-lens", host), { label:"Lens", options:[{ id:"off", t:U.lenses[0] }, { id:"near", t:U.lenses[1] }, { id:"far", t:U.lenses[2] }, { id:"rect", t:U.lenses[3] }], value:S.lens, onChange:function(v){ setLens(v); } });
  [$("#ax-mode", host), $("#ax-lens", host)].forEach(function(g){
    g.addEventListener("keydown", function(e){
      var b = e.target.closest("[data-seg]"); if (!b) return;
      var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0; if (!d) return;
      e.preventDefault(); var all = $$("[data-seg]", g), i = all.indexOf(b), nb = all[(i + d + all.length) % all.length]; nb.focus(); nb.click();
    });
  });
  var sl = MV.sliders($("#ax-sl", host), [
    { id:"s", label:'<span class="p-a">stretch</span>', param:"a", min:-8, max:8, step:0.5, value:S.s, skip:[0] },
    { id:"h", label:'<span class="p-d">vertical asymptote</span>', param:"d", min:-6, max:6, step:0.5, value:S.h },
    { id:"q", label:'<span class="p-c">horizontal asymptote</span>', param:"c", min:-5, max:5, step:0.5, value:S.q }], function(id, v){ S[id] = v; userChange(); });
  var stHost = $("#ax-st", host);
  stHost.addEventListener("click", function(e){
    var b = e.target.closest("[data-co]"); if (!b || T.busy) return;
    var k = b.dataset.co, v = S[k] + (+b.dataset.dir);
    if (k === "c" && v === 0) v += +b.dataset.dir;
    if (v < -9 || v > 9) return;
    S[k] = v; userChange();
  });
  stHost.addEventListener("input", function(e){
    var k = e.target.dataset.ci; if (!k || T.busy) return;
    var raw = e.target.value.trim(); if (!/^-?\d+$/.test(raw)) return;
    var v = +raw; if (v < -9 || v > 9) return;
    if (k === "c" && v === 0) { v = S.c > 0 ? -1 : 1; e.target.value = v; }
    if (v === S[k]) return;
    S[k] = v; userChange();
  });
  stHost.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset.ci) { e.preventDefault(); var k = e.target.dataset.ci; e.target.value = S[k]; paint(); } });
  stHost.addEventListener("change", function(e){ var k = e.target.dataset.ci; if (k) e.target.value = S[k]; });
  $("#ax-turn", host).addEventListener("click", halfTurn);
  var parBtn = $("#ax-par", host);
  parBtn.addEventListener("click", function(){ S.parent = !S.parent; api.save(); paint(); });
  var allBtn = $("#ax-all", host);
  allBtn.addEventListener("click", function(){ var on = !L.read.classList.contains("all"); L.read.classList.toggle("all", on); allBtn.setAttribute("aria-expanded", String(on)); allBtn.textContent = on ? "Show fewer features" : "Show all features"; });

  // ----- drag handles (G7) -----
  function inView(y){ var v = T.view; return clamp(y, v.ymin, v.ymax); }
  var drag = MV.drag(plot, {
    handles:function(){
      var out = [], F = cur(); if (T.busy) return out;
      if (S.mode === "cross") {
        out.push({ id:"X", x:S.h, y:S.q, label:"Crosshair at (" + num(S.h) + ", " + num(S.q) + "). Arrow keys move it by 0.5; Shift with an arrow moves it by 2." });
        if (S.lens !== "far") out.push({ id:"S", x:clamp(S.h + 1, T.view.xmin, T.view.xmax), y:inView(S.q + S.s), label:"Stretch handle: stretch " + num(S.s) + ". Up and Down change it by 0.5." });
      }
      if (S.lens === "rect" && !F.special) out.push({ id:"P", x:clamp(F.h + S.u, T.view.xmin, T.view.xmax), y:inView(F.q + F.s / S.u), label:"Point P on the curve at x = " + num(F.h + S.u) + ". Left and Right move it along the curve by 0.5." });
      return out;
    },
    move:function(id, x, y){
      if (T.busy) return;
      if (id === "X") { S.h = clamp(r2(x), -6, 6); S.q = clamp(r2(y), -5, 5); }
      else if (id === "S") { var ns = clamp(r2(y - S.q), -8, 8); if (ns === 0) ns = y - S.q >= 0 ? 0.5 : -0.5; S.s = ns; }
      else if (id === "P") { var F = cur(), nu = r2(x - F.h); if (nu === 0) nu = x - F.h >= 0 ? 0.5 : -0.5; nu = clamp(nu, T.view.xmin - F.h + 0.5, T.view.xmax - F.h - 0.5); if (nu === 0) nu = 0.5; S.u = nu; }
      userChange();
    },
    key:function(id, e){
      if (T.busy) return false;
      var k = e.key, d = k === "ArrowRight" || k === "ArrowUp" ? 1 : k === "ArrowLeft" || k === "ArrowDown" ? -1 : 0; if (!d) return false;
      var stp = e.shiftKey ? 2 : 0.5;
      if (id === "X") { if (k === "ArrowLeft" || k === "ArrowRight") S.h = clamp(S.h + d * stp, -6, 6); else S.q = clamp(S.q + d * stp, -5, 5); }
      else if (id === "S") { var ns = S.s + d * 0.5; if (ns === 0) ns += d * 0.5; if (ns < -8 || ns > 8) return true; S.s = ns; }
      else if (id === "P") { var nu = S.u + d * 0.5; if (nu === 0) nu += d * 0.5; var F = cur(); if (F.h + nu < T.view.xmin || F.h + nu > T.view.xmax) return true; S.u = nu; }
      userChange(); return true;
    },
    step:{ x:0.5, y:0.5 }, big:4
  });
  plot.c.style.touchAction = "pan-y";

  // ----- state changes -----
  function clearOverlays(){ T.rows = null; T.trace = null; T.p4 = null; T.extra = null; T.spin = null; T.far = null; }
  function userChange(keepBanner){
    if (T.busy) return;
    clearOverlays(); if (!keepBanner) banner("", "");
    var F = cur(), target = lensView(F), base = S.mode === "coef" && (S.lens === "off" || S.lens === "rect");
    if (base && !sameView(target, T.view)) goView(target, 300);
    else { stopAnim(); T.view = target; }
    if (base && !keepBanner && !sameView(target, DEF)) banner("", U.panned);
    api.save(); paint(); MV.changed();
  }
  function setMode(m){
    if (m === S.mode || T.busy) return m === S.mode;
    if (m === "coef") {
      var F = fromCross(S.h, S.q, S.s), st = F.std, msg = "";
      if (!st.every(function(v){ return v >= -9 && v <= 9; })) { st = nearestFit(F); msg = U.nearest; }
      S.a = st[0]; S.b = st[1]; S.c = st[2]; S.d = st[3]; S.mode = "coef";
      userChange(true); banner("", msg);
    } else {
      var G = fromCoef(S.a, S.b, S.c, S.d);
      if (G.special) { banner("bad", U.refuse); return false; }
      var h = clamp(r2(G.h), -6, 6), q = clamp(r2(G.q), -5, 5), s = clamp(r2(G.s), -8, 8);
      if (s === 0) s = G.s >= 0 ? 0.5 : -0.5;
      var moved = Math.abs(h - G.h) > 1e-9 || Math.abs(q - G.q) > 1e-9 || Math.abs(s - G.s) > 1e-9;
      S.h = h; S.q = q; S.s = s; S.mode = "cross";
      userChange(true); banner("", moved ? U.rounded : "");
    }
    return true;
  }
  function nearestFit(F){
    var best = null, bd = Infinity;
    for (var c = 1; c <= 9; c++) for (var a = -9; a <= 9; a++) for (var d = -9; d <= 9; d++) for (var b = -9; b <= 9; b++) {
      var det = a * d - b * c; if (!det) continue;
      var h = -d / c, q = a / c, s = (b * c - a * d) / (c * c), dd = (h - F.h) * (h - F.h) + (q - F.q) * (q - F.q) + 0.5 * (s - F.s) * (s - F.s);
      if (dd < bd - 1e-12) { bd = dd; best = [a, b, c, d]; }
    }
    return stdCoefs(best);
  }
  function setLens(v){
    if (T.busy) { lensSeg.set(S.lens); return; }
    S.lens = v; clearOverlays(); banner("", "");
    var F = cur(); api.save();
    goView(lensView(F), 800, null, function(){ paint(); });
    paint();
  }
  function halfTurn(){
    var F = cur(); if (F.special || T.busy) return;
    stopAnim(); T.spin = 0;
    T.anim = MV.tween({ dur:1200, step:function(t){ T.spin = t; plot.render(); }, done:function(){ T.anim = null; T.spin = 1; plot.render(); banner("good", tpl(U.halfTurn, { pt:M(ptM(F.H, F.Qv)) })); } });
  }

  // ----- caption, table, readout -----
  function caption(F){
    var left;
    if (S.mode === "coef") {
      var a = Q(S.a), b = Q(S.b), c = Q(S.c), d = Q(S.d), w = (T.view.xmax - T.view.xmin) / 2, z = clamp(Math.log(w / 10) / Math.log(100), 0, 1), op = (1 - 0.7 * z).toFixed(2);
      var term = function(k, cst){ var lead = k.n !== 0 ? M(linM(k, Q(0))) : ""; var tail = cst.n === 0 ? "" : '<span class="ax-fade" style="opacity:' + op + '">' + M(lead ? (cst.n > 0 ? " + " : " - ") + qM(qabs(cst)) : qM(cst)) + "</span>"; return (lead + tail) || M("0"); };
      left = '<span class="m"><i>y</i> = <span class="frac"><span class="fn">' + term(a, b) + '</span><span class="fd">' + term(c, d) + "</span></span></span>";
    } else left = M("y = " + fracM(F.std));
    return left + " " + M("= " + crossM(F, true));
  }
  function tableHTML(F){
    if (F.special) return "";
    var rows = [], cls = [], head;
    if (T.rows) { head = ["`x`", "`y`"]; T.rows.forEach(function(r){ rows.push([num(r[0], 2), num(r[1], 2)]); cls.push(""); }); }
    else if (S.lens === "near") {
      head = ["`x`", "`y`", "±"];
      [-1, -0.1, -0.01, 0.01, 0.1, 1].forEach(function(dx){ var x = F.h + dx, y = F.f(x), sg = F.s / dx > 0; rows.push([num(x, 2), num(y, 2), sg ? "+" : MINUS]); cls.push(sg ? "ax-pos" : "ax-neg"); });
    } else if (S.lens === "far") {
      head = ["`x`", "`y`", "above or below " + M("y = " + qM(F.Qv))];
      [-1000, -100, -10, 10, 100, 1000].forEach(function(x){ if (T.far != null && Math.abs(x) > T.far + 1e-9) { rows.push([num(x), "", ""]); cls.push(""); return; } var y = F.f(x); rows.push([num(x), (y < 0 ? MINUS : "") + Math.abs(y).toFixed(3), y > F.q ? "above" : "below"]); cls.push(""); });
    } else return "";
    head = head.map(function(h){ return MV.md(h); });
    return '<div class="tbl-wrap"><table class="vt"><caption class="vh">Table of values</caption><thead><tr>' + head.map(function(h){ return '<th scope="col">' + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function(r, i){ return '<tr class="' + cls[i] + '">' + r.map(function(c){ return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>" +
      (S.lens === "near" && !T.rows ? '<p class="tiny muted ax-tnote">± is the sign of ' + M("y - " + par(F.Qv)) + ": above (+) or below (" + MINUS + ") the level line.</p>" : "");
  }
  function ivM(a, b){ return "(" + (a == null ? "-∞" : qM(a)) + ", " + (b == null ? "∞" : qM(b)) + ")"; }
  function readRows(F){
    var D = "—";
    var rows = [];
    if (T.extra) T.extra.forEach(function(r){ rows.push({ k:r[0], v:r[1], hl:true }); });
    var std = F.std, sp = F.special;
    rows.push({ k:"Standard form", v:M("y = " + fracM(std)) });
    rows.push({ k:"Crosshair form", v:sp ? D : M("y = " + crossM(F, true)) });
    rows.push({ k:"Crosshair", v:sp ? D : M(ptM(F.H, F.Qv)) });
    var vaWhy;
    if (S.mode === "cross") vaWhy = "the bottom, " + M(linM(std[2], std[3])) + ", is 0 here and the top isn’t";
    else { var nd = qdiv(qneg(Q(S.d)), Q(S.c)), fr = (function(){ var n = -S.d, dd = S.c; if (dd < 0) { n = -n; dd = -dd; } return dd === 1 || gcd(n, dd) === 1 ? "" : (n < 0 ? "-" : "") + "{" + Math.abs(n) + "}/{" + dd + "} = "; })(); vaWhy = M(linM(Q(S.c), Q(S.d)) + " = 0") + " at " + M("x = " + fr + qM(nd)); }
    rows.push({ k:"Vertical asymptote (wall)", v:sp ? D : M("x = " + qM(F.H)) + " · " + vaWhy });
    var ac = S.mode === "coef" ? [S.a, S.c] : [std[0], std[2]], haWhy;
    if (ac[0] === 0) haWhy = "far away the top stays constant while the bottom grows, so " + M("y -> 0");
    else { var cxM = linM(Q(ac[1]), Q(0)); haWhy = "far away, " + M("y ≈ " + linM(Q(ac[0]), Q(0)) + "/" + (ac[1] < 0 ? "(" + cxM + ")" : cxM) + " = " + ac[0] + "/" + (ac[1] < 0 ? "(" + ac[1] + ")" : ac[1])); }
    rows.push({ k:"Horizontal asymptote (level line)", v:sp ? D : M("y = " + qM(F.Qv)) + " · " + haWhy });
    rows.push({ k:"Domain", v:sp ? D : M("{x ∈ ℝ | x ≠ " + qM(F.H) + "}") });
    rows.push({ k:"Range", v:sp ? D : M("{y ∈ ℝ | y ≠ " + qM(F.Qv) + "}") });
    rows.push({ k:M("x") + "-intercept", v:sp ? D : F.xi ? M(ptM(F.xi, Q(0))) : MV.md(U.noXint) });
    rows.push({ k:M("y") + "-intercept", v:sp ? D : F.yi ? M(ptM(Q(0), F.yi)) : MV.md(U.noYint) });
    var pos = F.s > 0;
    rows.push({ k:"Branches", v:sp ? D : (pos ? "Upper right and lower left of the crosshair (stretch " + M(qM(F.S)) + " > 0)" : "Upper left and lower right of the crosshair (stretch " + M(qM(F.S)) + " < 0)") });
    rows.push({ k:"Rising or falling", v:sp ? D : (pos ? "Decreasing" : "Increasing") + " on " + M(ivM(null, F.H)) + " and on " + M(ivM(F.H, null)) });
    var hM = qM(F.H), vM = qM(F.Qv);
    rows.push({ k:"Next to the wall", v:sp ? D : "As " + M("x -> " + hM + "^{-}") + ", " + M("y -> " + (pos ? "-∞" : "∞")) + ". As " + M("x -> " + hM + "^{+}") + ", " + M("y -> " + (pos ? "∞" : "-∞")) + "." });
    rows.push({ k:"Far away", v:sp ? D : "As " + M("x -> -∞") + ", " + M("y -> " + vM + "^{" + (pos ? "-" : "+") + "}") + " (from " + (pos ? "below" : "above") + "). As " + M("x -> ∞") + ", " + M("y -> " + vM + "^{" + (pos ? "+" : "-") + "}") + " (from " + (pos ? "above" : "below") + ")." });
    if (!sp) {
      var cuts = [F.H].concat(F.xi ? [F.xi] : []).sort(function(u, w){ return qv(u) - qv(w); }), P = [], N = [];
      for (var i = 0; i <= cuts.length; i++) {
        var lo = i ? cuts[i - 1] : null, hi = i < cuts.length ? cuts[i] : null;
        var tx = lo == null ? qv(hi) - 1 : hi == null ? qv(lo) + 1 : (qv(lo) + qv(hi)) / 2;
        (F.f(tx) > 0 ? P : N).push(ivM(lo, hi));
      }
      rows.push({ k:"Positive / negative", v:(P.length ? "Positive on " + M(P.join(" ∪ ")) + ". " : "") + (N.length ? "Negative on " + M(N.join(" ∪ ")) + "." : "") });
    } else rows.push({ k:"Positive / negative", v:D });
    rows.push({ k:"Symmetry", v:sp ? D : "A half turn about " + M(ptM(F.H, F.Qv)) + " maps the graph onto itself." });
    if (S.mode === "coef" && sp) rows.splice(T.extra ? T.extra.length : 0, 0, { k:"Special case", v:tpl(U.special, { line:M("y = " + qM(F.Qv)), hole:M("x = " + qM(F.H)) }), hl:true });
    return rows;
  }
  function describe(F){
    if (F.special) return "Graph of " + MV.plain(M("y = " + fracM(F.std))) + ": the horizontal line y = " + qT(F.Qv) + " with a hole at x = " + qT(F.H) + ".";
    var cn = cornersOf(F);
    return "Graph of " + MV.plain(M("y = " + fracM(F.std))) + ". Vertical asymptote x = " + qT(F.H) + ", horizontal asymptote y = " + qT(F.Qv) + ". Branches in the " + CNAME[cn[0]] + " and " + CNAME[cn[1]] + " corners. " +
      (F.xi ? "x-intercept " + ptT(F.xi, Q(0)) : "No x-intercept") + ", " + (F.yi ? "y-intercept " + ptT(Q(0), F.yi) : "no y-intercept") + "." +
      (S.lens === "near" ? " View zoomed in next to the wall." : S.lens === "far" ? " View zoomed out to x = ±1000." : "") + (S.lens === "rect" ? " Rectangle from the crosshair to P has signed area " + qT(F.S) + "." : "");
  }

  // ----- canvas -----
  plot.render = function(){
    var F = cur();
    plot.draw({ view:T.view, describe:describe(F), after:function(ctx, p){ scene(ctx, p, F); } });
  };
  function scene(ctx, p, F){
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), vio = css("--acol"), teal = css("--p-d"), mag = css("--p-c"), hi = css("--hi");
    var lensOn = S.lens === "near" || S.lens === "far";
    if (S.parent) drawHyp(p, 0, 0, 1, { color:ink2, width:2, dash:[6, 6], alpha:0.6, heads:false });
    if (F.special) {
      p.curve({ f:function(){ return F.q; }, color:pen, width:3 });
      p.point({ x:F.h, y:F.q, open:true, r:5.5, color:pen });
      drawTC3(ctx, p);
      return;
    }
    var h = F.h, q = F.q, s = F.s, cn = cornersOf(F);
    shadeCorners(ctx, p, h, q, cn, true);
    asymLabelled(ctx, p, F.H, F.Qv, s);
    if (S.mode === "cross" && !lensOn) {
      if (h) p.segment({ x1:0, y1:0, x2:h, y2:0, color:teal, width:2.2, arrow:true });
      if (q) p.segment({ x1:h, y1:0, x2:h, y2:q, color:mag, width:2.2, arrow:true });
    }
    if (S.lens === "rect") {
      var u = S.u, px = h + u, py = q + s / u, X0 = p.X(h), Y0 = p.Y(q), X1 = p.X(px), Y1 = p.Y(py);
      ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = vio; ctx.fillRect(Math.min(X0, X1), Math.min(Y0, Y1), Math.abs(X1 - X0), Math.abs(Y1 - Y0)); ctx.globalAlpha = 1;
      ctx.strokeStyle = vio; ctx.lineWidth = 1.5; ctx.strokeRect(Math.min(X0, X1), Math.min(Y0, Y1), Math.abs(X1 - X0), Math.abs(Y1 - Y0)); ctx.restore();
      var tk = [{ t:"(", c:vio }, { t:"x", i:true, c:vio }].concat(F.H.n ? [{ t:F.H.n > 0 ? " − " : " + ", c:vio }].concat(tokVal(qabs(F.H), vio)) : [], [{ t:")(", c:vio }, { t:"y", i:true, c:vio }], F.Qv.n ? [{ t:F.Qv.n > 0 ? " − " : " + ", c:vio }].concat(tokVal(qabs(F.Qv), vio)) : [], [{ t:") = ", c:vio }], tokVal(F.S, vio));
      drawToks(ctx, p, tk, X1 + (u > 0 ? 12 : -12), Y1 + 20, { align:u > 0 ? "left" : "right", size:13 });
    }
    if (T.p4 && T.p4.hl) [-1, 1].forEach(function(side){ var t = side < 0 ? T.p4.hl.l : T.p4.hl.r; if (!t) return; var pts = visPts(p, hypPts(h, q, s, p.v, side)); pts = pts.slice(0, Math.max(2, Math.ceil(pts.length * t))); p.curve({ pts:pts, color:hi, width:10, alpha:0.85 }); });
    drawHyp(p, h, q, s, { color:pen, width:3 });
    if (T.spin != null) {
      var th = Math.PI * T.spin, cx = p.X(h), cy = p.Y(q), cs = Math.cos(th), sn = Math.sin(th);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, p.W, p.H); ctx.clip();
      ctx.globalAlpha = MV.reduceMotion ? 0.3 : 0.35; ctx.strokeStyle = pen; ctx.lineWidth = MV.reduceMotion ? 10 : 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
      [-1, 1].forEach(function(side){
        var pts = hypPts(h, q, s, p.v, side); ctx.beginPath(); var pen0 = false;
        pts.forEach(function(r){ var X = p.X(r[0]) - cx, Y = p.Y(r[1]) - cy; if (!isFinite(Y) || Math.abs(Y) > p.H * 4) { pen0 = false; return; } var rx = cx + X * cs - Y * sn, ry = cy + X * sn + Y * cs; if (!pen0) { ctx.moveTo(rx, ry); pen0 = true; } else ctx.lineTo(rx, ry); });
        ctx.stroke();
      });
      ctx.restore();
    }
    if (!lensOn || S.lens === "near") {
      interceptLabels(ctx, p, F, S.lens !== "near");
    }
    // stretch bracket, handle and its half-turn partner
    if (!lensOn || S.lens === "near") {
      var bx = h + 1, top = q + s, Yt = clamp(p.Y(top), -4, p.H + 4);
      ctx.save(); ctx.strokeStyle = vio; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(p.X(bx), p.Y(q)); ctx.lineTo(p.X(bx), Yt); ctx.moveTo(p.X(bx) - 6, p.Y(q)); ctx.lineTo(p.X(bx) + 6, p.Y(q)); ctx.stroke(); ctx.restore();
      if (S.lens !== "rect") drawToks(ctx, p, [{ t:"stretch ", c:vio }].concat(tokVal(F.S, vio)), p.X(bx) + 9, (p.Y(q) + Yt) / 2, { align:"left", size:13 });
      ring(ctx, p, h - 1, q - s, vio, 6, 2.4);
      edgeDot(ctx, p, bx, top, vio, { ring:S.mode === "cross" && !T.busy, r:7 });
    }
    p.point({ x:h, y:q, r:7, color:ink, ring:S.mode === "cross" && !T.busy });
    if (S.lens === "rect") { var ux = h + S.u, uy = q + s / S.u; edgeDot(ctx, p, ux, uy, vio, { ring:!T.busy, r:7 }); if (p.Y(uy) > 0 && p.Y(uy) < p.H) drawToks(ctx, p, [{ t:"P", i:true, c:vio }, { t:" ", c:vio }].concat(tokPt(qOf(ux), qOf(uy), vio)), p.X(ux) + 12, p.Y(uy) - 16, { align:"left", size:13 }); }
    if (T.trace) { var tx = T.trace.x, ty = F.f(tx); edgeDot(ctx, p, tx, ty, ink, { r:6.5 }); if (p.Y(ty) > 0 && p.Y(ty) < p.H) drawToks(ctx, p, [{ t:"(" + num(tx, 2) + ", " + num(ty, 2) + ")" }], p.X(tx) - 10, p.Y(ty), { align:"right", size:13 }); }
    if (T.p4) {
      [[1, "A"], [3, "B"]].forEach(function(pt){
        var x = pt[0], y = F.f(x) * T.p4.t, X = p.X(x), Y0 = p.Y(0), Y1 = p.Y(y);
        ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(X - 6, Math.min(Y0, Y1), 12, Math.abs(Y1 - Y0)); ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.strokeRect(X - 6, Math.min(Y0, Y1), 12, Math.abs(Y1 - Y0)); ctx.restore();
        p.point({ x:x, y:y, r:6, color:ink });
        if (T.p4.t >= 1) drawToks(ctx, p, [{ t:pt[1], i:true }, { t:"(" + num(x) + ", " + num(F.f(x)) + ")" }], X + (x < 2 ? -10 : 10), Y1, { align:x < 2 ? "right" : "left", size:13 });
      });
    }
    drawTC3(ctx, p);
  }
  function drawTC3(ctx, p){
    if (T.busy) return;
    var st = MV.S.chal && MV.S.chal.tc3; if (st && st.solved) return;
    [[0, 3], [4, -1]].forEach(function(pt){ ring(ctx, p, pt[0], pt[1], css("--hi"), 9, 3.2); });
  }
  // quick repaint during animations
  function quick(){ var F = cur(); L.cap.innerHTML = caption(F); $("#ax-tbl", host).innerHTML = tableHTML(F); plot.render(); }
  function paint(){
    var F = cur();
    if (modeSeg.get() !== S.mode) modeSeg.set(S.mode);
    if (lensSeg.get() !== S.lens) lensSeg.set(S.lens);
    $("#ax-sl", host).hidden = S.mode !== "cross"; stHost.hidden = S.mode !== "coef";
    if (S.mode === "cross") { sl.set("s", S.s); sl.set("h", S.h); sl.set("q", S.q); }
    ["a", "b", "c", "d"].forEach(function(k){ var el = $("#ax-" + k, host); if (document.activeElement !== el) el.value = S[k]; });
    parBtn.setAttribute("aria-pressed", String(!!S.parent)); parBtn.classList.toggle("on", !!S.parent);
    $("#ax-turn", host).disabled = F.special;
    L.cap.innerHTML = caption(F);
    $("#ax-tbl", host).innerHTML = tableHTML(F);
    L.read.innerHTML = readRows(F).map(function(r){ return '<div' + (r.hl ? ' class="hl"' : "") + "><dt>" + r.k + "</dt><dd>" + r.v + "</dd></div>"; }).join("");
    plot.render();
  }
  function setBusy(b){ T.busy = b; L.ctrl.inert = b; $("#ax-mode", host).inert = b; host.classList.toggle("ax-busy", b); }

  // ----- predictions -----
  function startPred(p){
    stopAnim(); clearOverlays(); setBusy(true);
    var st = p.start; S.mode = st.mode;
    if (st.mode === "coef") { S.a = st.a; S.b = st.b; S.c = st.c; S.d = st.d; } else { S.h = st.h; S.q = st.q; S.s = st.s; }
    S.lens = "off"; T.view = baseView(cur());
    if (p.id === "p3") { T.trace = { x:0 }; T.rows = [[0, -2]]; }
    banner("", ""); paint();
  }
  function runPred(p, done){
    var F = cur(), fin = function(){ setBusy(false); api.save(); paint(); MV.changed(); done(); };
    if (p.id === "p1") {
      S.lens = "far"; T.far = 10; paint();
      goView(lensView(F), 2500, function(){ T.far = (T.view.xmax - T.view.xmin) / 2; }, function(){ T.far = null; quick(); MV.wait(400, fin); });
    } else if (p.id === "p2") {
      var seq = [1, 0, -1, -2, -3, -4, -5];
      if (MV.reduceMotion) {
        T.extra = [["Stretch", p.rmNote]];
        var frames = [1, -2, -5], j = 0;
        (function nextF(){ S.b = frames[j]; paint(); j++; if (j < frames.length) setTimeout(nextF, 1000); else setTimeout(fin, 1000); })();
      } else {
        var i = 0;
        (function step(){ S.b = seq[i]; paint(); i++; if (i < seq.length) setTimeout(step, 600); else setTimeout(fin, 700); })();
      }
    } else if (p.id === "p3") {
      S.lens = "near"; paint();
      goView(lensView(F), 800, null, function(){
        var marks = [1, 1.9];
        T.anim = MV.tween({ dur:2600, ease:function(t){ return t; }, step:function(t){
          var x = 2 - 2 * Math.pow(0.005, t); if (t >= 1) x = 1.99;
          T.trace.x = x;
          while (marks.length && x >= marks[0] - 1e-9) { var m = marks.shift(); T.rows.push([m, F.f(m)]); }
          if (t >= 1 && T.rows[T.rows.length - 1][0] !== 1.99) T.rows.push([1.99, F.f(1.99)]);
          quick();
        }, done:function(){
          T.anim = null;
          if (T.rows[T.rows.length - 1][0] !== 1.99) T.rows.push([1.99, F.f(1.99)]);
          MV.wait(500, function(){ T.trace.x = 2.01; T.rows.push([2.01, F.f(2.01)]); quick(); MV.wait(900, fin); });
        } });
      });
    } else if (p.id === "p4") {
      T.p4 = { t:0, hl:null };
      T.anim = MV.tween({ dur:900, step:function(t){ T.p4.t = t; plot.render(); }, done:function(){
        T.anim = null; T.p4.t = 1;
        T.extra = [["Values", M("f(1) = -5") + " and " + M("f(3) = 7")]]; paint();
        MV.wait(500, function(){
          T.p4.hl = { l:0, r:0 };
          T.anim = MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ T.p4.hl.l = t; plot.render(); }, done:function(){
            T.anim = MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ T.p4.hl.r = t; plot.render(); }, done:function(){ T.anim = null; MV.wait(300, fin); } });
          } });
        });
      } });
    } else fin();
  }

  // ----- challenges -----
  function chal(id, opt){
    var c = C.challenges.filter(function(x){ return x.id === id; })[0], fb = c.fb, F = cur();
    if (id === "tc1") {
      if (S.mode !== "cross") return { ok:false, msg:fb.mode };
      if (S.h === -3 && S.q === 2 && S.s < 0) return { ok:true };
      if (S.h === 3 && S.q === 2) return { ok:false, msg:fb.c32 };
      if (S.h === 2 && S.q === -3) return { ok:false, msg:fb.c2m3 };
      if (S.h === -3 && S.q === 2) return { ok:false, msg:fb.pos };
      if (S.h === -3 && S.q === -2) return { ok:false, msg:fb.cm3m2 };
      return { ok:false, msg:fb.other };
    }
    if (id === "tc2") {
      if (S.mode !== "coef") return { ok:false, msg:fb.mode };
      if (F.special) return { ok:false, msg:fb.special };
      if (F.xi && qeq(F.xi, Q(3)) && qeq(F.H, Q(-1)) && qeq(F.Qv, Q(2))) return { ok:true };
      var L4 = [S.a, S.b, S.c, S.d];
      if (sameFn(L4, [2, 6, 1, 1])) return { ok:false, msg:fb.w1 };
      if (sameFn(L4, [2, -6, 1, -1])) return { ok:false, msg:fb.w2 };
      if (sameFn(L4, [1, -3, 2, 2])) return { ok:false, msg:fb.w3 };
      if (sameFn(L4, [1, -3, 1, 1])) return { ok:false, msg:fb.w4 };
      return { ok:false, msg:fb.other };
    }
    if (id === "tc3") {
      if (F.special) return { ok:false, msg:C.challenges[1].fb.special };
      if (qeq(F.H, Q(0)) || qeq(F.H, Q(4))) return { ok:false, msg:fb.wall };
      var f0 = fAt(F, Q(0)), f4 = fAt(F, Q(4)), thru = qeq(f0, Q(3)) && qeq(f4, Q(-1));
      if (thru && qeq(F.Qv, Q(1))) return { ok:true };
      if (thru) return { ok:false, msg:tpl(fb.both, { ha:M("y = " + qM(F.Qv)) }) };
      if (sameFn(F.std, fromCross(2, 1, 4).std)) return { ok:false, msg:fb.corners };
      if (!qeq(F.Qv, Q(1))) return { ok:false, msg:fb.level };
      return { ok:false, msg:tpl(fb.other, { f0:M("y = " + qM(f0)), f4:M("y = " + qM(f4)) }) };
    }
    return { ok:false };
  }

  // initial view (a lens may have been saved)
  T.view = lensView(cur());
  paint();
  EXP = { repaint:function(){ plot.render(); } };
  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id, opt){ var r = chal(id, opt); if (!opt || !opt.live) setTimeout(function(){ plot.render(); }, 0); return r; }
  };
}

// ---------- Part 3: sketch from the equation ----------
// @component N8 sketchBuilder — place wall/level line (tap an axis or button + arrows), fraction intercept boxes with None chips, diagonal corner
// regions, "Draw my sketch" from the student's own features, live self-consistency line, named per-feature feedback, true-graph overlay
var PV = { xmin:-8, xmax:8, ymin:-6, ymax:6 };
function part3(host, api){
  var C = api.content, U = C.ui, R = C.rounds, S = api.S;
  S.r = S.r || 0; S.st = S.st || {};
  var KEY = R.map(function(r){ return fromCoef(r.abcd[0], r.abcd[1], r.abcd[2], r.abcd[3]); });
  var fbList = null, reveal = null, cmsg = "";
  function st(i){ i = i == null ? S.r : i; var id = R[i].id; return S.st[id] || (S.st[id] = { va:null, ha:null, xi:"", yi:"", xn:false, yn:false, cn:[], drawn:false, tries:0, hint:0, solved:false, first:null, marks:null }); }
  host.innerHTML = '<div class="chips sk-rounds" id="sk-rounds" role="group" aria-label="Rounds"></div><p class="eq-cap sk-eq" id="sk-eq"></p>' +
    '<div class="sym sk"><div><div class="plot-wrap"><canvas class="plot" id="sk-plot" role="img" aria-label="Sketch grid"></canvas></div><p class="tiny muted sk-leg">Your sketch: long dashes. The true graph appears in blue when all five features are right.</p></div>' +
    '<div><ol class="sk-steps">' +
      '<li><strong>' + U.steps[0] + '</strong><p class="tiny muted">' + U.wallHow + '</p><div class="q-actions"><button type="button" class="btn sm" id="sk-va">Place vertical asymptote</button><span id="sk-vav" class="sk-v"></span></div></li>' +
      '<li><strong>' + U.steps[1] + '</strong><p class="tiny muted">' + U.levelHow + '</p><div class="q-actions"><button type="button" class="btn sm" id="sk-ha">Place horizontal asymptote</button><span id="sk-hav" class="sk-v"></span></div></li>' +
      '<li><strong>' + U.steps[2] + '</strong><div class="sk-int"><label for="sk-xi">' + M("x") + "-intercept: " + M("x =") + '</label><input class="numin sk-in" id="sk-xi" type="text" autocomplete="off" spellcheck="false"><button type="button" class="chip" id="sk-xn" aria-pressed="false">None</button></div>' +
        '<div class="sk-int"><label for="sk-yi">' + M("y") + "-intercept: " + M("y =") + '</label><input class="numin sk-in" id="sk-yi" type="text" autocomplete="off" spellcheck="false"><button type="button" class="chip" id="sk-yn" aria-pressed="false">None</button></div></li>' +
      '<li><strong>' + U.steps[3] + '</strong><p class="tiny muted">' + U.cornerHow + '</p><div class="sk-corn" id="sk-corn" role="group" aria-label="Corners around your crosshair">' +
        ["ul", "ur", "ll", "lr"].map(function(k){ return '<button type="button" class="chip" data-cn="' + k + '" data-k="skc' + k + '" aria-pressed="false">' + MV.cap(CNAME[k].replace("-", " ")) + "</button>"; }).join("") + '</div><p class="sk-cmsg" id="sk-cmsg" aria-live="polite"></p></li>' +
      '<li><strong>' + U.steps[4] + '</strong><div class="q-actions"><button type="button" class="btn sm" id="sk-draw">Draw my sketch</button></div></li></ol>' +
    '<ul class="checks sk-checks" id="sk-checks"></ul>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="sk-check">Check my sketch</button><span id="sk-hb"></span></div><div id="sk-hints"></div><div id="sk-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="sk-prev">Previous round</button><button type="button" class="btn ghost sm" id="sk-next">Next round</button></div>' +
    '<details class="alg" id="sk-alg"><summary>Check it with algebra</summary><div id="sk-algb"></div></details></div></div>';
  var plot = new MV.Plot($("#sk-plot", host), PV), dragged = false;
  function q2(v){ return Q(Math.round(v * 2), 2); }
  function entry(x, k){ if (x[k + "n"]) return { none:true }; var v = parseQ(x[k + "i"]); return v ? { v:v } : null; }
  function ready(x){ return x.va != null && x.ha != null && x.cn.length === 2 && !!entry(x, "x") && !!entry(x, "y"); }
  // line 6: do the student's own features fit together?
  function agree(x){
    if (!ready(x)) return { ok:false, msg:"" };
    var h = q2(x.va), q = q2(x.ha), ex = entry(x, "x"), ey = entry(x, "y"), w = { x:M("x") + "-intercept", y:M("y") + "-intercept" };
    var pts = []; if (ey.v) pts.push({ k:"y", x:Q(0), y:ey.v }); if (ex.v) pts.push({ k:"x", x:ex.v, y:Q(0) });
    for (var i = 0; i < pts.length; i++) {
      var pt = pts[i], cr = cornerOf(pt.x, pt.y, h, q), pm = M(ptM(pt.x, pt.y));
      if (!cr) return { ok:false, msg:tpl(U.agreeOn, { which:w[pt.k], pt:pm }) };
      if (x.cn.indexOf(cr) < 0) return { ok:false, msg:tpl(U.agreeI, { which:w[pt.k], pt:pm, corner:CNAME[cr], pair:pairName(x.cn) }) };
    }
    if (ey.none && h.n !== 0) return { ok:false, msg:U.agreeY };
    if (ex.none && q.n !== 0) return { ok:false, msg:U.agreeX };
    if (ey.v && ex.v) {
      var ry = qmul(qsub(Q(0), h), qsub(ey.v, q)), rx = qmul(qsub(ex.v, h), qsub(Q(0), q));
      if (!qeq(ry, rx)) return { ok:false, msg:tpl(U.agreeIII, { ry:M("(0 - " + par(h) + ")(" + qM(ey.v) + " - " + par(q) + ") = " + qM(ry)), py:M(ptM(Q(0), ey.v)), rx:M("(" + qM(ex.v) + " - " + par(h) + ")(0 - " + par(q) + ") = " + qM(rx)), px:M(ptM(ex.v, Q(0))) }) };
    }
    return { ok:true, msg:"" };
  }
  // the student's sketch: through the y-intercept (or the x-intercept), stretch ±1 if that point contradicts the corners
  function sketch(x){
    if (x.va == null || x.ha == null || x.cn.length !== 2) return null;
    var h = q2(x.va), q = q2(x.ha), pos = x.cn.indexOf("ur") >= 0, ex = entry(x, "x"), ey = entry(x, "y"), bad = {}, s = null;
    var thr = ey && ey.v ? { k:"y", x:Q(0), y:ey.v } : ex && ex.v ? { k:"x", x:ex.v, y:Q(0) } : null;
    if (thr) { var r = qmul(qsub(thr.x, h), qsub(thr.y, q)); if (r.n !== 0 && (r.n > 0) === pos) s = r; else bad[thr.k] = true; }
    if (!s) s = Q(pos ? 1 : -1);
    if (ey && ey.v && ex && ex.v) { var ry = qmul(qsub(Q(0), h), qsub(ey.v, q)), rx = qmul(qsub(ex.v, h), qsub(Q(0), q)); if (!qeq(ry, rx)) bad.x = true; }
    return { h:qv(h), q:qv(q), s:qv(s), bad:bad };
  }
  plot.render = function(){
    var i = S.r, x = st(i), K = KEY[i], ink = css("--ink"), red = css("--red"), ex = entry(x, "x"), ey = entry(x, "y"), sk = x.drawn ? sketch(x) : null;
    var desc = "Sketch grid for " + MV.plain(R[i].eq) + ". " + (x.va != null ? "Your wall x = " + num(x.va) + ". " : "No wall yet. ") + (x.ha != null ? "Your level line y = " + num(x.ha) + ". " : "No level line yet. ") +
      (x.cn.length ? "Shaded corners: " + x.cn.map(function(k){ return CNAME[k]; }).join(" and ") + ". " : "") + (sk ? "Your sketch is drawn with long dashes. " : "") + (x.solved ? "The true graph is drawn in blue." : "");
    plot.draw({ view:PV, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:1, fmt:evenFmt }, describe:desc, after:function(ctx, p){
      if (x.va != null && x.ha != null && x.cn.length) shadeCorners(ctx, p, x.va, x.ha, x.cn, false);
      if (x.va != null) { dashV(ctx, p, x.va, ink); drawToks(ctx, p, [{ t:"x", i:true }, { t:" = " }].concat(tokVal(q2(x.va))), p.X(x.va) + 6, 16, { align:p.X(x.va) > p.W - 70 ? "right" : "left", size:13 }); }
      if (x.ha != null) { dashH(ctx, p, x.ha, ink); drawToks(ctx, p, [{ t:"y", i:true }, { t:" = " }].concat(tokVal(q2(x.ha))), p.W - 6, p.Y(x.ha) - 14, { align:"right", size:13 }); }
      if (sk) drawHyp(p, sk.h, sk.q, sk.s, { color:ink, width:2.6, dash:[14, 8] });
      if (x.solved || reveal != null) drawHyp(p, K.h, K.q, K.s, { color:css("--pen"), width:3.2, reveal:reveal });
      [["x", ex], ["y", ey]].forEach(function(e){
        if (!e[1] || !e[1].v) return;
        var px = e[0] === "x" ? e[1].v : Q(0), py = e[0] === "x" ? Q(0) : e[1].v, X = p.X(qv(px)), Y = p.Y(qv(py));
        p.point({ x:qv(px), y:qv(py), r:5.5, color:ink });
        if (sk && sk.bad[e[0]]) { ctx.save(); ctx.beginPath(); ctx.arc(X, Y, 10, 0, Math.PI * 2); ctx.lineWidth = 2.6; ctx.strokeStyle = red; ctx.stroke(); ctx.restore(); }
        drawToks(ctx, p, tokPt(px, py), X + 10, Y + (e[0] === "x" ? 18 : -16), { align:"left", size:13 });
      });
      if (x.va != null && x.ha != null) p.point({ x:x.va, y:x.ha, r:4, color:ink });
    } });
  };
  var drag = MV.drag(plot, {
    handles:function(){ var x = st(), out = []; if (x.solved) return out; if (x.va != null) out.push({ id:"va", x:x.va, y:0, label:"Your vertical asymptote x = " + num(x.va) + ". Left and Right move it by 0.5." }); if (x.ha != null) out.push({ id:"ha", x:0, y:x.ha, label:"Your horizontal asymptote y = " + num(x.ha) + ". Up and Down move it by 0.5." }); return out; },
    move:function(id, px, py, how){ var x = st(); if (x.solved) return; if (how === "drag") dragged = true; if (id === "va") setLine("va", clamp(r2(px), -7.5, 7.5)); else setLine("ha", clamp(r2(py), -5.5, 5.5)); },
    key:function(id, e){ var x = st(); if (x.solved) return false; var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0; if (!d) return false; if (id === "va") setLine("va", clamp(x.va + d * 0.5, -7.5, 7.5)); else setLine("ha", clamp(x.ha + d * 0.5, -5.5, 5.5)); return true; },
    step:{ x:0.5, y:0.5 }, big:4
  });
  plot.c.style.touchAction = "pan-y";
  plot.c.addEventListener("pointerdown", function(){ dragged = false; });
  plot.c.addEventListener("click", function(e){
    var x = st(); if (x.solved) return;
    if (dragged) { dragged = false; return; }
    var r = plot.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, X0 = plot.X(0), Y0 = plot.Y(0);
    var dX = Math.abs(px - X0), dY = Math.abs(py - Y0);
    if (Math.min(dX, dY) <= 14) { if (dY <= dX) setLine("va", clamp(r2(plot.xOf(px)), -7.5, 7.5)); else setLine("ha", clamp(r2(plot.yOf(py)), -5.5, 5.5)); return; }
    if (x.va != null && x.ha != null) { var xx = plot.xOf(px), yy = plot.yOf(py); if (xx === x.va || yy === x.ha) return; toggleCorner((yy > x.ha ? "u" : "l") + (xx > x.va ? "r" : "l")); }
  });
  function changed(lineIdx){ var x = st(); if (x.marks && lineIdx != null) lineIdx.forEach(function(k){ x.marks[k] = null; }); fbList = null; api.save(); paint(); }
  function setLine(k, v){ var x = st(); if (x[k] === v) { paint(); return; } x[k] = v; changed(k === "va" ? [0] : [1]); }
  function toggleCorner(k){
    var x = st(), i = x.cn.indexOf(k), opp = { ul:"lr", lr:"ul", ur:"ll", ll:"ur" };
    cmsg = "";
    if (i >= 0) x.cn.splice(i, 1);
    else if (x.cn.length === 0) x.cn.push(k);
    else if (x.cn.length === 1) { if (opp[x.cn[0]] === k) x.cn.push(k); else cmsg = U.notDiagonal; }
    else x.cn = [k];
    changed([4]);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var x = st();
    if (b.dataset.r != null) { S.r = +b.dataset.r; fbList = null; cmsg = ""; reveal = null; api.save(); paint(true); return; }
    if (b.id === "sk-prev" || b.id === "sk-next") { S.r += b.id === "sk-prev" ? -1 : 1; fbList = null; cmsg = ""; reveal = null; api.save(); paint(true); return; }
    if (x.solved) return;
    if (b.id === "sk-va") { if (x.va == null) setLine("va", 0); drag.sync(); drag.focus("va"); return; }
    if (b.id === "sk-ha") { if (x.ha == null) setLine("ha", 0); drag.sync(); drag.focus("ha"); return; }
    if (b.id === "sk-xn" || b.id === "sk-yn") { var k = b.id === "sk-xn" ? "xn" : "yn"; x[k] = !x[k]; changed([k === "xn" ? 2 : 3]); return; }
    if (b.dataset.cn) { if (x.va == null || x.ha == null) return; toggleCorner(b.dataset.cn); return; }
    if (b.id === "sk-draw") { x.drawn = true; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id === "sk-check") check();
  });
  host.addEventListener("input", function(e){ var t = e.target, x = st(); if (t.id !== "sk-xi" && t.id !== "sk-yi") return; x[t.id === "sk-xi" ? "xi" : "yi"] = t.value; if (x.marks) x.marks[t.id === "sk-xi" ? 2 : 3] = null; fbList = null; api.save(); paint(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && (e.target.id === "sk-xi" || e.target.id === "sk-yi")) { var b = $("#sk-check", host); if (!b.disabled) b.click(); } });
  function check(){
    var i = S.r, x = st(), K = KEY[i], r = R[i], W = r.wrong, G = U.generic;
    if (!ready(x)) return;
    var h = q2(x.va), q = q2(x.ha), ex = entry(x, "x"), ey = entry(x, "y"), want = cornersOf(K);
    var okC = x.cn.length === 2 && x.cn.indexOf(want[0]) >= 0 && x.cn.indexOf(want[1]) >= 0;
    var okX = K.xi ? !!ex.v && qeq(ex.v, K.xi) : !!ex.none, okY = K.yi ? !!ey.v && qeq(ey.v, K.yi) : !!ey.none;
    x.marks = [qeq(h, K.H), qeq(q, K.Qv), okX, okY, okC];
    var msgs = [], lab = U.checks;
    if (!x.marks[0]) msgs.push([lab[0], (W.va && W.va[qkey(h)]) || G.va]);
    if (!x.marks[1]) msgs.push([lab[1], (W.ha && W.ha[qkey(q)]) || G.ha]);
    if (!x.marks[2]) msgs.push([lab[2], ex.none ? G.none : (W.xi && W.xi[qkey(ex.v)]) || G.xi]);
    if (!x.marks[3]) msgs.push([lab[3], ey.none ? G.none : (W.yi && W.yi[qkey(ey.v)]) || G.yi]);
    if (!x.marks[4]) msgs.push([lab[4], W.corners]);
    if (!msgs.length) {
      x.solved = true; x.first = x.tries === 0 && x.hint < 3; fbList = null; api.save(); paint();
      reveal = 0;
      MV.tween({ dur:1200, ease:function(t){ return t; }, step:function(t){ reveal = t; plot.render(); }, done:function(){ reveal = null; plot.render(); } });
    } else { x.tries++; fbList = msgs; api.save(); paint(); }
    MV.focusFb($("#sk-fb", host));
  }
  function paint(load){
    var i = S.r, x = st(), r = R[i], ag = agree(x);
    MV.keepFocus($("#sk-rounds", host), function(){ $("#sk-rounds", host).innerHTML = R.map(function(rr, k){ var y = st(k); return '<button type="button" class="chip' + (k === i ? " on" : "") + '" data-r="' + k + '" data-k="skr' + k + '" aria-pressed="' + (k === i) + '">' + (y.solved ? "✓ " : "") + "Round " + (k + 1) + "</button>"; }).join(""); });
    $("#sk-eq", host).innerHTML = r.eq;
    if (load || document.activeElement !== $("#sk-xi", host)) $("#sk-xi", host).value = x.xi;
    if (load || document.activeElement !== $("#sk-yi", host)) $("#sk-yi", host).value = x.yi;
    $("#sk-xi", host).disabled = x.xn || x.solved; $("#sk-yi", host).disabled = x.yn || x.solved;
    [["xn", "#sk-xn"], ["yn", "#sk-yn"]].forEach(function(z){ var b = $(z[1], host); b.setAttribute("aria-pressed", String(!!x[z[0]])); b.classList.toggle("on", !!x[z[0]]); b.disabled = x.solved; });
    $("#sk-vav", host).innerHTML = x.va != null ? M("x = " + qM(q2(x.va))) : "";
    $("#sk-hav", host).innerHTML = x.ha != null ? M("y = " + qM(q2(x.ha))) : "";
    $("#sk-va", host).disabled = x.solved; $("#sk-ha", host).disabled = x.solved;
    $$("[data-cn]", host).forEach(function(b){ var on = x.cn.indexOf(b.dataset.cn) >= 0; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); b.disabled = x.solved || x.va == null || x.ha == null; });
    $("#sk-cmsg", host).textContent = cmsg;
    $("#sk-draw", host).disabled = x.solved || x.va == null || x.ha == null || x.cn.length !== 2;
    var marks = x.marks || [];
    $("#sk-checks", host).innerHTML = U.checks.map(function(lab, k){
      var st6 = k === 5, ok = st6 ? ag.ok : marks[k] === true, bad = st6 ? !ag.ok && !!ag.msg : marks[k] === false;
      return '<li class="' + (ok ? "yes" : bad ? "no bad" : "no") + '"><span class="mk" aria-hidden="true">' + (ok ? "✓" : bad ? "✗" : "○") + "</span><span>" + lab + '<span class="vh">' + (ok ? " (met)" : " (not met)") + "</span>" + (st6 && ag.msg ? '<span class="sk-why">' + ag.msg + "</span>" : "") + "</span></li>";
    }).join("");
    $("#sk-check", host).disabled = x.solved || !ready(x);
    MV.keepFocus($("#sk-hb", host), function(){ $("#sk-hb", host).innerHTML = x.solved ? "" : MV.hintBtn("skh" + r.id, x.hint); });
    $("#sk-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(r.hints, x.hint);
    var fb = "";
    if (x.solved) fb = '<div class="fb good" role="status"><p><strong>✓ ' + U.allRight + "</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (fbList) fb = '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong></p><ul class="sk-fbl">' + fbList.map(function(m){ return "<li><strong>" + m[0] + ":</strong> " + m[1] + "</li>"; }).join("") + "</ul></div>";
    $("#sk-fb", host).innerHTML = fb;
    $("#sk-prev", host).disabled = i === 0; $("#sk-next", host).disabled = i === R.length - 1;
    var alg = $("#sk-alg", host), open = alg.open;
    $("#sk-algb", host).innerHTML = '<p><strong>This round:</strong> ' + r.alg + "</p>" + C.algGeneral.map(function(g){ return "<p><strong>" + g[0] + ":</strong> " + g[1] + "</p>"; }).join("");
    alg.open = open;
    plot.render();
  }
  paint(true);
  // results summary line and goals to review (registered like a practice activity)
  MV.ACTS.sketch = { a:{ id:"sketch" },
    stats:function(){ var f = 0, d = 0; R.forEach(function(r, i){ var y = st(i); if (y.solved) d++; if (y.first) f++; }); return { first:f, total:R.length, done:d, line:"Sketch from the equation (first try): " + f + "/" + R.length + " rounds" + (d < R.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; R.forEach(function(r, i){ var y = st(i); if (y.tries > 0 || y.hint >= 3) g = g.concat(MV.goalIdx(r.goal)); }); return g; } };
  return {};
}

// ---------- Practice 1: Match the graph (N6 with K5 thumbnails) ----------
// @component N6 graphMatch (copied from MHF4U 18, adapted) — equations on the left, graph thumbnails labelled P–U on the right,
// mismatch feedback built from the first differing feature (wall, level line, corners)
var TV = { xmin:-6, xmax:6, ymin:-4.5, ymax:4.5 };
function matchAct(host, api, a){
  var S = api.S; S.done = S.done || {}; S.tries = S.tries || {}; S.hints = S.hints || {};
  var sel = null, msg = null, K = MV.ans(a), FB = a.fb;
  function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
  function fnOf(it){ return fromCoef(it.abcd[0], it.abcd[1], it.abcd[2], it.abcd[3]); }
  function desc(it){ var F = fnOf(it), cn = cornersOf(F); return "Graph " + it.name + ": vertical asymptote x = " + qT(F.H) + ", horizontal asymptote y = " + qT(F.Qv) + ", branches " + CNAME[cn[0]] + " and " + CNAME[cn[1]] + ", x-intercept " + ptT(F.xi, Q(0)) + ", y-intercept " + ptT(Q(0), F.yi) + "."; }
  host.innerHTML = '<p class="how">' + a.how + '</p><div id="mg-sel"></div><div id="mg-msg"></div><p class="sort-done" id="mg-done" hidden></p>' +
    '<div class="mg"><div class="mg-eqs"><h4>Equations</h4><div class="mg-eqrow" role="group" aria-label="Equations">' + a.left.map(function(L){ return '<button type="button" class="mitem mg-eq" data-l="' + L.id + '" data-k="mgl' + L.id + '" aria-pressed="false"><span class="pair-n"></span><span>' + L.t + "</span></button>"; }).join("") + "</div></div>" +
    '<div class="mg-gs"><h4>Graphs</h4><div class="mg-grid" role="group" aria-label="Graphs">' + a.right.map(function(R){ return '<button type="button" class="mg-th" data-r="' + R.id + '" data-k="mgr' + R.id + '"><span class="mg-tag">' + R.name + '</span><canvas class="plot mg-c" role="img" aria-label="' + MV.esc(desc(R)) + '"></canvas><span class="mg-eqd"></span></button>'; }).join("") + "</div></div></div>";
  a.right.forEach(function(R){
    var cv = host.querySelector('[data-r="' + R.id + '"] canvas'), p = new MV.Plot(cv, TV), F = fnOf(R);
    p.render = function(){ p.draw({ view:TV, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:1, fmt:evenFmt }, describe:desc(R), after:function(ctx, q){
      dashV(ctx, q, F.h); dashH(ctx, q, F.q);
      drawHyp(q, F.h, F.q, F.s, { width:2.6, head:11 });
      q.point({ x:qv(F.xi), y:0, r:4.5, color:css("--ink") }); q.point({ x:0, y:qv(F.yi), r:4.5, color:css("--ink") });
    } }); };
    p.render();
  });
  function stats(){ var f = 0, d = 0, miss = []; a.left.forEach(function(L){ var bad = (S.tries[L.id] || 0) > 0 || (S.hints[L.id] || 0) >= 3; if (S.done[L.id]) { d++; if (!bad) f++; } if (bad) miss.push(L); }); return { first:f, done:d, total:a.left.length, miss:miss }; }
  function paint(){
    var doneR = {};
    a.left.forEach(function(L, i){ if (S.done[L.id]) doneR[K[L.id]] = { i:i + 1, L:L }; });
    $$(".mg-eq", host).forEach(function(b, i){ var id = b.dataset.l, d = !!S.done[id]; b.classList.toggle("done", d); b.disabled = d; b.setAttribute("aria-pressed", String(sel === id)); b.querySelector(".pair-n").textContent = d ? "✓ " + (i + 1) : ""; });
    $$(".mg-th", host).forEach(function(b){ var dr = doneR[b.dataset.r]; b.classList.toggle("done", !!dr); b.disabled = !!dr; b.querySelector(".mg-eqd").innerHTML = dr ? '<span class="pair-n">✓ ' + dr.i + "</span> " + dr.L.t : ""; });
    var L = sel ? byId(a.left, sel) : null, lv = L ? (S.hints[sel] || 0) : 0;
    MV.keepFocus($("#mg-sel", host), function(){ $("#mg-sel", host).innerHTML = L ? '<div class="sel-bar"><span>Selected: ' + L.t + "</span>" + MV.hintBtn("mgh" + a.id, lv) + "</div>" + MV.hintsHTML(L.hints, lv) : ""; });
    $("#mg-msg", host).innerHTML = msg ? '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>" : "";
    var s = stats(), dn = $("#mg-done", host); dn.hidden = s.done < s.total; dn.textContent = "All matched! You got " + s.first + " of " + s.total + " right on the first try, without the worked solution.";
  }
  function mismatch(L, R){
    var f = fnOf(L), g = fnOf(R);
    if (!qeq(f.H, g.H)) return tpl(FB.wall, { gva:M("x = " + qM(g.H)), va:M("x = " + qM(f.H)) });
    if (!qeq(f.Qv, g.Qv)) return tpl(FB.level, { gha:M("y = " + qM(g.Qv)), ha:M(qM(f.Qv)) });
    return tpl(FB.corners, { yi:M(ptM(Q(0), f.yi)) });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.l) { sel = sel === b.dataset.l ? null : b.dataset.l; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { S.hints[sel] = Math.min(3, (S.hints[sel] || 0) + 1); api.save(); paint(); return; }
    if (b.dataset.r) {
      if (!sel) { msg = { type:"", html:"Tap an equation first, then tap its graph." }; paint(); return; }
      var L = byId(a.left, sel), R = byId(a.right, b.dataset.r);
      if (K[sel] === R.id) { S.done[sel] = true; msg = { type:"good", html:"<strong>✓ Matched.</strong> " + L.why }; sel = null; api.save(); paint(); MV.focusFb($("#mg-msg", host)); }
      else { S.tries[sel] = (S.tries[sel] || 0) + 1; msg = { type:"bad", html:"<strong>✗ Not a match.</strong> " + mismatch(L, R) + " " + FB.tail }; api.save(); paint(); MV.focusFb($("#mg-msg", host)); }
    }
  });
  paint();
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:a.summary + " (first try): " + s.first + "/" + s.total + (s.done < s.total ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; stats().miss.forEach(function(L){ g = g.concat(MV.goalIdx(L.goal != null ? L.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 3: Build the function (N4 fill-in-the-coefficients) ----------
// @component N4 fracBoxes — y = ([ ]x + [ ])/([ ]x + [ ]) stacked number boxes (fractions allowed), named wrong entries matched literally then as the
// same function, degenerate-entry messages, feature-by-feature generic feedback, mini-graph after each Check
var BV = { xmin:-8, xmax:8, ymin:-6, ymax:6 };
function fracFrame(pre, kind){
  var box = function(i, lab){ return '<input class="numin bf-in" id="' + pre + i + '" data-bi="' + i + '" type="' + (kind || "text") + '"' + (kind === "number" ? ' min="-9" max="9" step="1"' : "") + ' autocomplete="off" spellcheck="false" aria-label="' + lab + '" placeholder="' + lab + '">'; };
  return '<div class="bf"><span class="m bf-y"><i>y</i> =</span><span class="bf-frac"><span class="bf-row">' + box(0, "a") + '<span class="m"><i>x</i> +</span>' + box(1, "b") + '</span><span class="bf-row bf-bot">' + box(2, "c") + '<span class="m"><i>x</i> +</span>' + box(3, "d") + "</span></span></div>";
}
function buildAct(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var msg = {}, MS = a.msgs;
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="bd-n"></span><span class="dots" id="bd-dots" aria-hidden="true"></span></div><p class="pred-q" id="bd-clue"></p>' +
    '<div class="design bd"><div>' + fracFrame("bd-") + '<p class="eq-cap bd-cap" id="bd-cap" aria-live="polite"></p>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="bd-check">Check</button><span id="bd-hb"></span></div><div id="bd-hints"></div><div id="bd-fb"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="bd-prev">Previous</button><button type="button" class="btn ghost sm" id="bd-next">Next item</button></div></div>' +
    '<div><canvas class="plot" id="bd-plot" role="img" aria-label="Mini-graph"></canvas><p class="tiny muted" id="bd-pn"></p></div></div>';
  var plot = new MV.Plot($("#bd-plot", host), BV);
  function cur(){ return a.items[S.i]; }
  function ist(it){ it = it || cur(); return S.items[it.id] || (S.items[it.id] = { v:["", "", "", ""], tries:0, hint:0, solved:false, first:null, last:null }); }
  function vals(x){ var v = x.v.map(parseQ); return v.every(Boolean) ? v : null; }
  function featPts(it){ var out = []; it.feats.forEach(function(f){ if (f.k === "pt") out.push([f.x, f.y]); if (f.k === "xi") out.push([f.v, 0]); if (f.k === "yi") out.push([0, f.v]); }); return out; }
  plot.render = function(){
    var it = cur(), x = ist(it), L = x.last ? x.last.map(function(k){ var p = k.split("/"); return Q(+p[0], p[1] ? +p[1] : 1); }) : null, F = L && L[2].n !== 0 ? fromCoef(L[0], L[1], L[2], L[3]) : null;
    var desc = "Mini-graph for item " + (S.i + 1) + ". " + (L ? "Your function " + MV.plain(M("y = " + fracM(L))) + "." : "Your function appears here after you check.") + " Hollow rings mark the listed points.";
    plot.draw({ view:BV, xTicks:{ step:1, fmt:evenFmt }, yTicks:{ step:1, fmt:evenFmt }, describe:desc, after:function(ctx, p){
      var pen = css("--pen"), ink = css("--ink");
      if (F && !F.special) { asymLabelled(ctx, p, F.H, F.Qv, F.s); drawHyp(p, F.h, F.q, F.s, { width:2.8 }); }
      else if (F && F.special) { p.curve({ f:function(){ return F.q; }, color:pen, width:2.8 }); p.point({ x:F.h, y:F.q, open:true, r:5.5, color:pen }); }
      else if (L && L[3].n !== 0) p.curve({ f:function(t){ return (qv(L[0]) * t + qv(L[1])) / qv(L[3]); }, color:pen, width:2.8, arrows:true });
      featPts(it).forEach(function(pt){ ring(ctx, p, pt[0], pt[1], ink, 7, 2); });
    } });
  };
  function cap(){ var x = ist(), v = vals(x); $("#bd-cap", host).innerHTML = v ? M("y = " + fracM(v)) : ""; }
  function list(it, F){
    var out = [];
    it.feats.forEach(function(f){
      var ok, txt, need;
      if (f.k === "va") { ok = qeq(F.H, qOf(f.v)); txt = "wall " + M("x = " + qM(F.H)); need = M("x = " + qM(f.v)); }
      else if (f.k === "ha" || f.k === "never") { ok = qeq(F.Qv, qOf(f.v)); txt = "level line " + M("y = " + qM(F.Qv)); need = M("y = " + qM(f.v)); }
      else if (f.k === "xi") { ok = !!F.xi && qeq(F.xi, qOf(f.v)); txt = F.xi ? M("x") + "-intercept " + M(ptM(F.xi, Q(0))) : "no " + M("x") + "-intercept"; need = M(ptM(f.v, 0)); }
      else if (f.k === "yi") { ok = !!F.yi && qeq(F.yi, qOf(f.v)); txt = F.yi ? M("y") + "-intercept " + M(ptM(Q(0), F.yi)) : "no " + M("y") + "-intercept"; need = M(ptM(0, f.v)); }
      else { var y = fAt(F, qOf(f.x)); ok = !!y && qeq(y, qOf(f.y)); txt = y ? M("f(" + qM(f.x) + ") = " + qM(y)) : M("f(" + qM(f.x) + ")") + " undefined"; need = qT(f.y); }
      out.push(txt + (ok ? " ✓" : " ✗ (needs " + need + ")"));
    });
    return out.join(", ");
  }
  function paint(load){
    var it = cur(), x = ist(it);
    $("#bd-n", host).textContent = "Item " + (S.i + 1) + " of " + a.items.length + (it.star ? " ★" : "");
    $("#bd-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#bd-clue", host).innerHTML = it.clue;
    $$(".bf-in", host).forEach(function(el, i){ if (load) el.value = x.v[i]; el.disabled = x.solved; });
    $("#bd-check", host).disabled = x.solved;
    MV.keepFocus($("#bd-hb", host), function(){ $("#bd-hb", host).innerHTML = x.solved ? "" : MV.hintBtn("bdh" + it.id, x.hint); });
    $("#bd-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    var A = MV.ans(it);
    $("#bd-fb", host).innerHTML = x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct: ' + M("y = " + fracM(A)) + ".</strong> Any non-zero multiple of the top and bottom is the same function." + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : (msg[it.id] ? '<div class="fb bad" role="status"><p>' + msg[it.id] + "</p></div>" : "");
    $("#bd-prev", host).disabled = S.i === 0; $("#bd-next", host).disabled = S.i === a.items.length - 1;
    $("#bd-pn", host).textContent = x.last ? "Your last checked function. Hollow rings mark the listed points." : "Hollow rings mark the listed points. Your function appears after you check.";
    cap(); plot.render();
  }
  host.addEventListener("input", function(e){ var i = e.target.dataset.bi; if (i == null) return; ist().v[+i] = e.target.value; api.save(); cap(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset.bi != null) $("#bd-check", host).click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = cur(), x = ist(it);
    if (b.id === "bd-prev" || b.id === "bd-next") { S.i += b.id === "bd-prev" ? -1 : 1; api.save(); paint(true); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.id !== "bd-check") return;
    var v = vals(x);
    if (!v) { msg[it.id] = MS.empty; paint(); MV.focusFb($("#bd-fb", host)); return; }
    x.last = v.map(qkey);
    var A = MV.ans(it);
    if (v[2].n !== 0 && sameFn(v, A)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
    else {
      x.tries++;
      var lit = (it.wrong || []).filter(function(w){ return w.abcd.every(function(c, k){ return qeq(qOf(c), v[k]); }); })[0];
      var named = lit || (it.wrong || []).filter(function(w){ return sameFn(v, w.abcd); })[0], m;
      if (named) m = named.fb;
      else if (v[2].n === 0) m = MS.c0;
      else { var F = fromCoef(v[0], v[1], v[2], v[3]); m = F.special ? tpl(MS.special, { line:M("y = " + qM(F.Qv)), hole:M("x = " + qM(F.H)) }) : tpl(MS.generic, { list:list(it, F) }); }
      msg[it.id] = "<strong>✗ Not quite.</strong> " + m + " Try again.";
    }
    api.save(); paint(); MV.focusFb($("#bd-fb", host));
  });
  paint(true);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design to spec ----------
var task = (function(){
  var api, plot;
  function TC(){ return MV.C.task; }
  function read(){
    var s = api ? api.S : {}, raw = s.v || ["", "", "", ""], v = raw.map(function(t){ t = String(t).trim(); return /^-?\d+$/.test(t) ? +t : null; });
    var filled = v.every(function(n){ return n !== null && n >= -9 && n <= 9; });
    return { raw:raw, v:v, filled:filled, a:v[0], b:v[1], c:v[2], d:v[3] };
  }
  function line1(d){ return d.filled && d.c !== 0 && d.a * d.d - d.b * d.c !== 0; }
  function checks(d){
    if (!line1(d)) return [false, false, false, false, false];
    var det = d.a * d.d - d.b * d.c;
    return [true, d.a === 2 * d.c, d.d !== 0 && d.b === -d.d, det < 0, d.a !== 0 && (-d.b / d.a) % 1 === 0];
  }
  function decorate(){
    var d = read(), lis = $$("#task-checks li");
    if (!line1(d)) lis.slice(1).forEach(function(li){ if (!li.querySelector(".tk-gate")) li.lastElementChild.insertAdjacentHTML("beforeend", ' <span class="tiny muted tk-gate">' + TC().tipsMore.gate + "</span>"); });
  }
  function live(){
    var d = read(), el = $("#tk-read"); if (!el) return;
    var rows = [];
    if (d.filled && d.c !== 0) {
      var F = fromCoef(d.a, d.b, d.c, d.d);
      rows.push(["Standard form", M("y = " + fracM(F.std))]);
      rows.push(["Crosshair form", F.special ? "— (the top is a multiple of the bottom)" : M("y = " + crossM(F, true))]);
    } else rows.push(["Your function", '<span class="muted">' + TC().tipsMore.empty + "</span>"]);
    el.innerHTML = MV.readoutHTML(rows);
    draw();
  }
  function draw(){
    if (!plot) return;
    var d = read(), F = d.filled && d.c !== 0 ? fromCoef(d.a, d.b, d.c, d.d) : null;
    plot.draw({ view:DEF, describe:F ? (F.special ? "Your function is the line y = " + qT(F.Qv) + " with a hole at x = " + qT(F.H) + "." : "Your function: crosshair " + ptT(F.H, F.Qv) + ", branches " + pairName(cornersOf(F)) + (F.xi ? ", x-intercept " + ptT(F.xi, Q(0)) : "") + (F.yi ? ", y-intercept " + ptT(Q(0), F.yi) : "") + ".") : "No function yet. Fill in the four boxes.",
      after:function(ctx, p){
        if (!F) return;
        var pen = css("--pen"), ink = css("--ink");
        if (F.special) { p.curve({ f:function(){ return F.q; }, color:pen, width:3 }); p.point({ x:F.h, y:F.q, open:true, r:5.5, color:pen }); return; }
        shadeCorners(ctx, p, F.h, F.q, cornersOf(F), true);
        asymLabelled(ctx, p, F.H, F.Qv, F.s);
        drawHyp(p, F.h, F.q, F.s, { width:3 });
        interceptLabels(ctx, p, F);
        p.point({ x:F.h, y:F.q, r:6, color:ink });
      } });
  }
  function keyOf(d){ return stdCoefs([d.a, d.b, d.c, d.d]).join(","); }
  return {
    render:function(inp, pv, a){
      api = a; a.S.v = a.S.v || ["", "", "", ""];
      inp.innerHTML = '<p class="tiny muted">Whole numbers from −9 to 9 in each box.</p>' + fracFrame("tk-", "number") + '<dl class="read tk-read" id="tk-read" aria-live="polite"></dl>';
      $$(".bf-in", inp).forEach(function(el, i){ el.value = a.S.v[i]; });
      pv.innerHTML = '<canvas class="plot" id="tk-plot" role="img" aria-label="Preview of your design"></canvas>';
      plot = new MV.Plot($("#tk-plot"), DEF); plot.render = draw;
      inp.addEventListener("input", function(e){ var i = e.target.dataset.bi; if (i == null) return; a.S.v[+i] = e.target.value; a.save(); live(); a.update(); decorate(); });
      var T = TC().tipsMore;
      $("#task-check").addEventListener("click", function(){
        var d = read(), all = line1(d) && checks(d).every(Boolean), k = all ? keyOf(d) : null, was = k && MV.taskState().found.indexOf(k) >= 0;
        setTimeout(function(){
          var fb = $("#task-fb .fb.good"); if (!fb || !all) return;
          if (was) fb.insertAdjacentHTML("beforeend", "<p>" + T.same + "</p>");
          if (MV.taskState().found.length >= 4) fb.insertAdjacentHTML("beforeend", "<p>" + T.all4 + "</p>");
        }, 0);
      });
      live(); setTimeout(decorate, 0);
    },
    read:read,
    valid:function(d){ return d.filled ? true : TC().tipsMore.empty; },
    checks:checks,
    tips:function(d, r){
      var T = TC(), X = T.tipsMore, out = [];
      if (!r[0]) return [T.tips[0]];
      if (!r[1]) out.push(T.tips[1]);
      if (!r[2]) out.push(d.d === 0 ? X.d0 : T.tips[2]);
      if (!r[3]) out.push(r[1] && r[2] ? X.dec23 : T.tips[3]);
      if (!r[4]) out.push(d.a === 0 ? X.a0 : tpl(T.tips[4], { v:M(qM(Q(-d.b, d.a))) }));
      return out;
    },
    key:keyOf,
    label:function(k){ return M("y = " + fracM(k.split(",").map(Number))); },
    text:function(k){ return MV.plain(M("y = " + fracM(k.split(",").map(Number)))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ match:matchAct, build:buildAct },
  task:task,
  onShow:function(v){ if (v === "explore" && EXP) EXP.repaint(); }
});
})();
