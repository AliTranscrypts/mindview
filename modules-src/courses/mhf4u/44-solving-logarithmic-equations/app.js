// MHF4U 44 Solving Logarithmic Equations: hero storyboard, Domain gate (Solve mode with the N15 move chooser, Build mode with
// N9 sliders), Root audit (Part 3), solution-set entry (Practice 1 and 3), "Six apart" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, MINUS = MV.MINUS, m = MV.m;
function fill(t, o){ return String(t == null ? "" : t).replace(/\{(\w+)\}/g, function(s, k){ return o[k] != null ? o[k] : s; }); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function near(a, b, e){ return Math.abs(a - b) < (e || 1e-9); }
var LIN = function(t){ return t; };
function seq(list){ var i = 0; (function next(){ if (i >= list.length) return; var it = list[i++]; it(next); })(); }

// ---------- exact rationals ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function Q(n, d){ d = d == null ? 1 : d; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n:n / g, d:d / g }; }
function qv(q){ return q.n / q.d; }
function qadd(a, b){ return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
function qmul(a, b){ return Q(a.n * b.n, a.d * b.d); }
function qdiv(a, b){ return Q(a.n * b.d, a.d * b.n); }
function qpow(a, k){ var r = Q(1); for (var i = 0; i < Math.abs(k); i++) r = qmul(r, a); return k < 0 ? qdiv(Q(1), r) : r; }
function qs(q){ return (q.n < 0 ? "-" : "") + Math.abs(q.n) + (q.d === 1 ? "" : "/" + q.d); }
function qt(q){ return qs(q).replace("-", MINUS); }
function toQ(v){ for (var d = 1; d <= 64; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return Q(n, d); } return null; }
function pf(c, x){ var y = 0; for (var i = 0; i < c.length; i++) y = y * x + c[i]; return y; }
function pq(c, q){ var y = Q(0); for (var i = 0; i < c.length; i++) y = qadd(qmul(y, q), Q(c[i])); return y; }

// ---------- exact logs ----------
function logExact(b, q){
  if (q.n <= 0) return null;
  var k, p;
  if (q.d === 1) { for (k = 0, p = 1; p < q.n && k < 60; k++) p *= b; return p === q.n ? k : null; }
  if (q.n === 1) { for (k = 0, p = 1; p < q.d && k < 60; k++) p *= b; return p === q.d ? -k : null; }
  return null;
}
function logv(b, x){ return Math.log(x) / Math.log(b); }
function lg(b){ return b === 10 ? "log" : "log_" + b; }
function lgArg(b, q){ var s = qs(q); return lg(b) + (q.n < 0 || q.d !== 1 ? "(" + s + ")" : " " + s); }
function lgArgC(b, q){ return (b === 10 ? "log" : "log_{" + b + "}") + "(" + qs(q) + ")"; }
function linLab(p){ return p === 0 ? "x" : "x " + (p < 0 ? "- " : "+ ") + Math.abs(p); }
function wrapLab(l){ return /[+\-]/.test(l) ? "(" + l + ")" : l; }
// value of each term k·log_b(arg) at an exact x
function termVals(terms, xq){ return terms.map(function(t){ return { k:t[0], lab:t[2], v:pq(t[1], xq) }; }); }
function termSrc(b, tv){
  return tv.map(function(t, i){ var c = Math.abs(t.k), s = (c === 1 ? "" : c + " ") + lgArg(b, t.v); return i === 0 ? (t.k < 0 ? "-" : "") + s : (t.k < 0 ? " - " : " + ") + s; }).join("");
}
// a side made of logs, evaluated exactly where possible: {src (m source), v (float)}; every argument must be positive
function sideEval(b, tv){
  var ex = tv.map(function(t){ return logExact(b, t.v); }), all = ex.every(function(e){ return e !== null; }), src = termSrc(b, tv);
  var P = Q(1); tv.forEach(function(t){ P = qmul(P, qpow(t.v, t.k)); });
  var v = 0; tv.forEach(function(t){ v += t.k * logv(b, qv(t.v)); });
  var single = tv.length === 1 && tv[0].k === 1, pe = logExact(b, P);
  function part(t, i, val){ var c = Math.abs(t.k), s = val; if (c !== 1) s = c + " × " + (String(val).charAt(0) === "-" ? "(" + val + ")" : val); return i === 0 ? (t.k < 0 ? "-" : "") + s : (t.k < 0 ? " - " : " + ") + (String(s).charAt(0) === "-" ? "(" + s + ")" : s); }
  if (all) {
    var tot = 0; tv.forEach(function(t, i){ tot += t.k * ex[i]; });
    return { src:src + (single ? "" : " = " + tv.map(function(t, i){ return part(t, i, String(ex[i])); }).join("")) + " = " + tot, v:tot };
  }
  if (pe !== null) return { src:src + (single ? "" : " = " + lgArg(b, P)) + " = " + pe, v:pe };
  if (tv.length > 1 && ex.some(function(e){ return e !== null; })) return { src:src + " = " + tv.map(function(t, i){ return ex[i] !== null ? part(t, i, String(ex[i])) : part(t, i, lgArg(b, t.v)); }).join("") + " ≈ " + num(v, 3), v:v };
  return { src:src + (single ? "" : " = " + lgArg(b, P)) + " ≈ " + num(v, 3), v:v };
}

// ---------- intervals and sampling ----------
function runs(pred, a, b, N){
  N = N || 700; var out = [], h = (b - a) / N, inR = !!pred(a), s = a;
  function edge(x0, x1, want){ for (var k = 0; k < 48; k++) { var mid = (x0 + x1) / 2; if (!!pred(mid) === want) x1 = mid; else x0 = mid; } return x1; }
  for (var i = 1; i <= N; i++) {
    var x = a + h * i, ok = !!pred(x);
    if (ok !== inR) { var e = edge(x - h, x, ok); if (inR) out.push([s, e]); else s = e; inR = ok; }
  }
  if (inR) out.push([s, b]);
  return out;
}
function sampleRun(f, a, b, ca, cb){
  var xs = [], N = 240, i, w = b - a;
  if (!(w > 0)) return [];
  for (i = 0; i <= N; i++) xs.push(a + w * i / N);
  if (ca) for (i = 1; i <= 100; i++) xs.push(a + w * 0.25 * Math.pow(10, -i / 9));
  if (cb) for (i = 1; i <= 100; i++) xs.push(b - w * 0.25 * Math.pow(10, -i / 9));
  xs.sort(function(p, q){ return p - q; });
  var out = [];
  xs.forEach(function(x){ var y = f(x); if (isFinite(y)) out.push([x, clamp(y, -1e7, 1e7)]); });
  return out;
}
// sampled pieces of f where pred holds, inside [a, b]
function pieces(f, pred, a, b){
  return runs(pred, a, b).map(function(r){ return sampleRun(f, r[0], r[1], r[0] > a + 1e-9, r[1] < b - 1e-9); }).filter(function(p){ return p.length > 1; });
}

// ---------- canvas helpers ----------
// @component G11 canvasMath (from MHF4U 37 / 40) — canvas text with ^{…} superscripts and _{…} subscripts in the math font
// (single letters italic, words such as "log" upright); o.dry measures only; returns the width
function cmath(ctx, s, x, y, o){
  o = o || {};
  var F = o.size || 14, fm = css("--font-math") || "serif", segs = [], i = 0;
  function push(t, lv){ t.split(/([A-Za-z]+)/).forEach(function(w, k){ if (w) segs.push({ t:w, lv:lv, it:k % 2 === 1 && w.length === 1 }); }); }
  while (i < s.length) {
    var c = s[i];
    if ((c === "^" || c === "_") && i + 1 < s.length) {
      var g, j;
      if (s[i + 1] === "{") { j = s.indexOf("}", i + 2); g = s.slice(i + 2, j); i = j + 1; } else { g = s[i + 1]; i += 2; }
      push(g.replace(/-/g, MINUS), c === "^" ? 1 : -1); continue;
    }
    var k = i; while (k < s.length && s[k] !== "^" && s[k] !== "_") k++;
    push(s.slice(i, k).replace(/-/g, MINUS), 0); i = k;
  }
  function font(sg){ return (sg.it ? "italic " : "") + (o.weight || 600) + " " + (sg.lv ? Math.round(F * 0.72) : F) + "px " + fm; }
  var w = 0; segs.forEach(function(sg){ ctx.font = font(sg); sg.w = ctx.measureText(sg.t).width + (sg.it ? 1 : 0); w += sg.w; });
  if (o.dry) return w;
  var x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  ctx.save(); ctx.textBaseline = "middle"; ctx.textAlign = "left"; if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.bg) { var ga = ctx.globalAlpha; ctx.globalAlpha = ga * 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, y - F * 0.75, w + 6, F * 1.5); ctx.globalAlpha = ga; }
  ctx.fillStyle = o.color || css("--ink");
  segs.forEach(function(sg){ ctx.font = font(sg); ctx.fillText(sg.t, x0, y + (sg.lv === 1 ? -F * 0.38 : sg.lv === -1 ? F * 0.3 : 0)); x0 += sg.w; });
  ctx.restore();
  return w;
}
function uiText(ctx, s, x, y, o){
  o = o || {};
  ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  ctx.font = (o.weight || 400) + " " + (o.size || 12) + "px " + (css("--font-ui") || "sans-serif");
  var w = ctx.measureText(s).width, al = o.align || "center", x0 = al === "center" ? x - w / 2 : al === "right" ? x - w : x;
  if (o.bg) { var ga = ctx.globalAlpha; ctx.globalAlpha = ga * 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, y - 8, w + 6, 16); ctx.globalAlpha = ga; }
  ctx.fillStyle = o.color || css("--ink-2"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(s, x0, y);
  ctx.restore(); return w;
}
function pill(ctx, cx, cy, txt, o){
  o = o || {};
  ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  ctx.font = "700 12px " + (css("--font-ui") || "sans-serif");
  var w = Math.max(24, ctx.measureText(txt).width + 14), h = 20, x = cx - w / 2, y = cy - h / 2;
  ctx.fillStyle = css("--sheet"); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.6; ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, 10); else ctx.rect(x, y, w, h);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = css("--ink"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, cx, cy + 0.5);
  ctx.restore(); return w;
}
function vline(ctx, X, y0, y1, col, w, dash, alpha){ ctx.save(); if (alpha != null) ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = w || 1.5; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(X, y0); ctx.lineTo(X, y1); ctx.stroke(); ctx.restore(); }
function hatchRect(ctx, x0, y0, w, h, col){
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.beginPath();
  for (var k = x0 - h; k < x0 + w + h; k += 6) { ctx.moveTo(k, y0 + h); ctx.lineTo(k + h, y0); }
  ctx.stroke(); ctx.restore();
}
function tri(ctx, x, y, dir, s, col){ ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x + dir * s, y); ctx.lineTo(x - dir * s * 0.5, y - s * 0.8); ctx.lineTo(x - dir * s * 0.5, y + s * 0.8); ctx.closePath(); ctx.fill(); ctx.restore(); }

// @component radioGroup (from MHF4U 25 / 32 / 39) — segmented control or chip row as a real radio group (arrow keys, roving tabindex, lock)
function radios(host, o){
  var val = String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (val === "" && x === o.options[0]) ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span>" + (locked && o.lockIcon ? '<span class="lg-lockic" aria-label="locked">🔒</span>' : "") + "</span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); i = i < 0 ? (d > 0 ? 0 : ids.length - 1) : (i + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } } };
}
// @component N9 stepSlider (from MHF4U 32 / 39) — slider over integer values with 40 px − / + buttons, a formatted value and a lock
function stepSlider(host, o){
  host.innerHTML = '<div class="lw-sl1" style="--sc:var(' + (o.color || "--ink") + ')"><div class="lw-sl-top"><label for="lg-' + o.id + '-in">' + o.label + '<span class="lg-lockic" hidden> 🔒</span></label><output id="lg-' + o.id + '-o" for="lg-' + o.id + '-in"></output></div>' +
    '<div class="lw-sl-row"><button type="button" class="btn ghost lw-pm" data-pm="-1" data-k="' + o.id + 'm" aria-label="Decrease ' + o.name + '">' + MINUS + '</button><input type="range" id="lg-' + o.id + '-in" min="' + o.min + '" max="' + o.max + '" step="1">' +
    '<button type="button" class="btn ghost lw-pm" data-pm="1" data-k="' + o.id + 'p" aria-label="Increase ' + o.name + '">+</button></div></div>';
  var inp = host.querySelector("input"), out = host.querySelector("output"), btns = host.querySelectorAll("[data-pm]"), ic = host.querySelector(".lg-lockic"), cur = o.value, locked = false, busy = false;
  function paint(){
    inp.value = Math.round(cur); out.innerHTML = o.fmt(cur); inp.setAttribute("aria-valuetext", o.name + " = " + MV.plain(o.fmt(cur)));
    var dis = locked || busy; inp.disabled = dis; btns[0].disabled = dis || cur <= o.min; btns[1].disabled = dis || cur >= o.max; ic.hidden = !locked;
  }
  function go(v){ v = clamp(Math.round(v), o.min, o.max); if (v === cur) { paint(); return; } cur = v; paint(); o.onChange(cur); }
  inp.addEventListener("input", function(){ cur = +inp.value; paint(); o.onChange(cur); });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pm]"); if (!b || b.disabled) return; go(cur + (+b.dataset.pm)); });
  paint();
  return { set:function(v){ cur = v; paint(); }, lock:function(b){ locked = !!b; paint(); }, busy:function(b){ busy = !!b; paint(); }, get:function(){ return cur; } };
}

// ---------- @component gateLanes (module-specific) ----------
// Domain gate picture: a Plot graph (left side in --pen with its ghost branch, right side in --f3, walls, the unlog morph,
// crossings with dotted guides, axis tokens, probe) above an argument-lane canvas (one lane per log of the original equation,
// the gate lane, the combined lane with its ghost part hatched, candidate tokens that drop through the lanes to a verdict).
// Both canvases share one x-scale: the lanes' 56 px label gutter is matched by widening the graph's window on the left.
var GUT = 56, LH = 24, LTOP = 24;
function extView(v, W){ var w = Math.max(W, GUT + 60), span = v.xmax - v.xmin; return { xmin:v.xmin - span * GUT / (w - GUT), xmax:v.xmax, ymin:v.ymin, ymax:v.ymax }; }
function gateView(gc, lc){
  var gp = new MV.Plot(gc, { xmin:-5, xmax:5, ymin:-5, ymax:5 }), lp = new MV.Plot(lc, { xmin:-5, xmax:5, ymin:0, ymax:1 }), spec = null;
  gp.render = function(){ if (spec) drawGraph(gp, spec); };
  lp.render = function(){ if (spec) drawLanes(lp, spec); };
  function size(){ var n = spec && spec.lanes ? spec.lanes.rows.length : 0, h = (LTOP + n * LH + 8) + "px"; if (lc.style.height !== h) lc.style.height = h; }
  return { gp:gp, lp:lp, draw:function(s){ spec = s; size(); gp.render(); lp.render(); }, spec:function(){ return spec; } };
}
function drawGraph(p, s){
  var W = p.c.getBoundingClientRect().width, v = extView(s.view, W);
  p.draw({ view:v, describe:s.describe, after:function(ctx){
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), hs = css("--hi-soft");
    (s.walls || []).forEach(function(wl, i, all){
      var X = p.X(wl.x); if (X < -2 || X > p.W + 2) return;
      vline(ctx, X, 0, p.H, ink2, 1.5, [8, 6], wl.alpha);
      var left = all.length > 1 && i === 0 && X > 70;
      cmath(ctx, "x = " + wl.lab, X + (left ? -6 : 6), 34, { size:13, align:left ? "right" : "left", color:ink2, alpha:wl.alpha, bg:true, weight:400 });
    });
    (s.curves || []).forEach(function(cv){
      if (cv.glow) p.curve({ pts:cv.pts, color:hs, width:11, alpha:cv.alpha });
      p.curve({ pts:cv.pts, color:cv.color || pen, width:cv.width || 3, dash:cv.dash, alpha:cv.alpha });
    });
    (s.guides || []).forEach(function(g){ vline(ctx, p.X(g.x), p.Y(g.y), p.H, ink2, 1.3, [2, 4], g.alpha); });
    (s.cross || []).forEach(function(c){
      var a = c.alpha == null ? 1 : c.alpha; if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      if (c.ghost) p.point({ x:c.x, y:c.y, r:6.5, open:true, color:ink });
      else p.point({ x:c.x, y:c.y, r:5.5, color:ink, ring:true });
      ctx.restore();
    });
    (s.labels || []).forEach(function(l){
      var X = clamp(p.X(l.x), 70, p.W - 70), Y = clamp(p.Y(l.y), 16, p.H - 30);
      l.lines.forEach(function(t, k){ uiText(ctx, t, X, Y + k * 15, { bg:true, color:l.color || ink2, alpha:l.alpha, size:12 }); });
    });
    (s.edges || []).forEach(function(e){ var Y = clamp(p.Y(e.y), 10, p.H - 10); tri(ctx, e.dir > 0 ? p.W - 12 : 12, Y, e.dir, 9, css("--pen")); uiText(ctx, e.dir > 0 ? "→" : "←", e.dir > 0 ? p.W - 28 : 28, Y - 14, { weight:700, color:ink, bg:true }); });
    if (s.bracket) {
      var b = s.bracket, Y0 = clamp(p.Y(0) + 26, 30, p.H - 18), xa = p.X(b.a), xb = p.X(b.b);
      ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(xa, Y0 - 7); ctx.lineTo(xa, Y0); ctx.lineTo(xb, Y0); ctx.lineTo(xb, Y0 - 7); ctx.stroke(); ctx.restore();
      uiText(ctx, b.txt, (xa + xb) / 2, Y0 + 11, { weight:700, color:ink, bg:true });
    }
    (s.axisTokens || []).forEach(function(t){ var Y = clamp(p.Y(t.y), 12, p.H - 12); pill(ctx, p.X(t.x), Y, t.txt, { alpha:t.alpha }); });
    if (s.counter) uiText(ctx, s.counter, 8, 14, { align:"left", weight:700, color:ink, bg:true });
    if (s.probe != null) {
      var PX = p.X(s.probe); vline(ctx, PX, 0, p.H, ink, 1.5);
      ctx.save(); ctx.beginPath(); ctx.arc(PX, 14, 8, 0, Math.PI * 2); ctx.fillStyle = css("--hi"); ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = ink; ctx.stroke(); ctx.restore();
    }
  } });
}
function drawLanes(p, s){
  var W = p.c.getBoundingClientRect().width, v = extView(s.view, W), L = s.lanes;
  p.draw({ view:{ xmin:v.xmin, xmax:v.xmax, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:L.describe, after:function(ctx){
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), x0 = p.X(s.view.xmin), x1 = p.X(s.view.xmax);
    vline(ctx, GUT - 2, LTOP - 2, p.H - 4, css("--rule"), 1);
    L.rows.forEach(function(r, i){
      var cy = LTOP + i * LH + LH / 2, a = r.alpha == null ? 1 : r.alpha;
      if (r.type === "gate") uiText(ctx, "Gate", GUT - 7, cy, { align:"right", weight:700, color:ink, alpha:Math.max(a, 0.35), size:11.5 });
      else if (r.type === "comb") uiText(ctx, "combined", GUT - 6, cy, { align:"right", weight:700, color:ink2, alpha:a, size:10.5 });
      else cmath(ctx, r.lab, GUT - 7, cy, { size:12.5, align:"right", alpha:Math.max(a > 0 ? 1 : 0.35, 0.35), weight:600 });
      if (a <= 0) return;
      var R = runs(r.pos, s.view.xmin, s.view.xmax, 500);
      ctx.save(); ctx.beginPath(); ctx.rect(x0 - 8, cy - LH / 2, (x1 - x0 + 16) * (r.type === "arg" ? a : 1), LH); ctx.clip();
      if (r.type !== "arg") ctx.globalAlpha = a;
      if (r.type === "gate") {
        R.forEach(function(q){ var xa = p.X(q[0]), xb = p.X(q[1]); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(xa, cy - 8, xb - xa, 16); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 1; ctx.strokeRect(xa + 0.5, cy - 7.5, xb - xa - 1, 15); });
        var big = R.slice().sort(function(q1, q2){ return (q2[1] - q2[0]) - (q1[1] - q1[0]); })[0];
        if (big && r.lab) cmath(ctx, r.lab, clamp(p.X(big[0]) + 8, x0 + 4, x1 - 60), cy, { size:12.5, align:"left", weight:600 });
      } else {
        vline(ctx, 0, 0, 0, ink2, 0);
        ctx.strokeStyle = ink2; ctx.lineWidth = 1.4; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x1, cy); ctx.stroke(); ctx.setLineDash([]);
        R.forEach(function(q){
          var xa = p.X(q[0]), xb = p.X(q[1]);
          ctx.fillStyle = css("--sheet"); ctx.fillRect(xa, cy - 4, xb - xa, 8);
          ctx.fillStyle = pen; ctx.fillRect(xa, cy - 3, xb - xa, 6);
          if (r.type === "comb" && r.ghost) runs(function(x){ return r.pos(x) && r.ghost(x); }, q[0], q[1], 200).forEach(function(g){ var ga = p.X(g[0]), gb = p.X(g[1]); ctx.fillStyle = css("--sheet"); ctx.fillRect(ga, cy - 6, gb - ga, 12); hatchRect(ctx, ga, cy - 6, gb - ga, 12, ink2); if (gb - ga > 44) uiText(ctx, "ghost", (ga + gb) / 2, cy, { weight:700, color:ink, bg:true, size:11 }); });
        });
        R.forEach(function(q){ [q[0], q[1]].forEach(function(z, k){ if ((k === 0 && z > s.view.xmin + 1e-6) || (k === 1 && z < s.view.xmax - 1e-6)) { ctx.beginPath(); ctx.arc(p.X(z), cy, 4.5, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = pen; ctx.stroke(); } }); });
        if (r.type === "comb" && r.lab) { var cw = cmath(ctx, r.lab, 0, 0, { dry:true, size:12 }); ctx.fillStyle = css("--sheet"); ctx.fillRect(x1 - cw - 8, cy - 9, cw + 10, 18); cmath(ctx, r.lab, x1 - 4, cy - 1, { size:12, align:"right", weight:600 }); }
      }
      ctx.restore();
    });
    if (L.note) uiText(ctx, L.note, (x0 + x1) / 2, LTOP + (L.rows.length * LH) / 2, { color:ink2, bg:true });
    (L.guides || []).forEach(function(g){ vline(ctx, p.X(g), 0, p.H, ink2, 1.3, [2, 4]); });
    if (L.probe != null) vline(ctx, p.X(L.probe), 0, p.H, ink, 1.5);
    (L.tokens || []).forEach(function(t){
      var tt = Math.min(t.t, t.stop), Y = 12 + tt * LH, X = p.X(t.x);
      if (X < x0 - 4 || X > x1 + 4) return;
      var w = pill(ctx, X, Y, t.txt);
      if (t.t < t.stop - 1e-6) return;
      var right = X < x1 - (t.pass ? 84 : 150), sx = X + (right ? 1 : -1) * (w / 2 + 6);
      if (t.pass) { uiText(ctx, "✓", sx, Y, { align:right ? "left" : "right", weight:700, color:css("--green"), size:15 }); uiText(ctx, "solution", sx + (right ? 16 : -16), Y, { align:right ? "left" : "right", weight:700, color:css("--green"), bg:true }); }
      else { uiText(ctx, "✗", sx, Y, { align:right ? "left" : "right", weight:700, color:css("--red"), size:15 }); var fw = cmath(ctx, t.fail, 0, 0, { dry:true, size:12.5 }); cmath(ctx, t.fail, right ? sx + 16 : sx - 16 - fw, Y, { size:12.5, color:css("--red"), bg:true, weight:600 }); }
    });
  } });
}

// ---------- the equation bank (Solve mode) ----------
// L: left terms [k, argument polynomial (high → low), label]; R: number, or RT: right terms; walls: wall x-values by stage
var EQM = {
  S1:{ b:2, view:{ xmin:-6, xmax:8, ymin:-4, ymax:6 }, moves:["restr", "combine", "convert", "solve", "check"], L:[[1, [1, 0], "x"], [1, [1, -2], "x - 2"]], R:3, comb:"x(x - 2)", walls:{ orig:[2], comb:[0, 2], conv:[] }, cands:[Q(4), Q(-2)], probe:3 },
  S2:{ b:3, view:{ xmin:-12, xmax:6, ymin:-3, ymax:5 }, moves:["restr", "combine", "convert", "solve", "check"], L:[[1, [1, 6], "x + 6"], [-1, [1, 0], "x"]], R:2, comb:"(x + 6)/x", walls:{ orig:[0], comb:[-6, 0], conv:[0] }, cands:[Q(3, 4)], probe:2 },
  S3:{ b:10, view:{ xmin:-8, xmax:5, ymin:-2, ymax:2 }, moves:["restr", "combine", "convert", "solve", "check"], L:[[1, [1, 3], "x + 3"], [1, [1, 0], "x"]], R:1, comb:"x(x + 3)", walls:{ orig:[0], comb:[-3, 0], conv:[] }, cands:[Q(2), Q(-5)], probe:1 },
  S4:{ b:2, view:{ xmin:-11, xmax:3, ymin:-4, ymax:6 }, moves:["restr", "combine", "convert", "solve", "check"], L:[[1, [1, 6], "x + 6"], [1, [1, 4], "x + 4"]], R:3, comb:"(x + 6)(x + 4)", walls:{ orig:[-4], comb:[-6, -4], conv:[] }, cands:[Q(-2), Q(-8)], probe:-1 },
  S5:{ b:5, view:{ xmin:-3, xmax:6, ymin:-3, ymax:3 }, moves:["restr", "power", "drop", "solve", "check"], L:[[2, [1, 0], "x"]], RT:[[1, [3, 4], "3x + 4"]], comb:"x^{2}", walls:{ orig:[0], comb:[0], conv:[] }, cands:[Q(4), Q(-1)], probe:2 },
  S6:{ b:2, view:{ xmin:-7, xmax:11, ymin:-3, ymax:7 }, moves:["restr", "convert", "solve", "check"], L:[[1, [1, -4, 0], "x^{2} - 4x"]], R:5, comb:null, walls:{ orig:[0, 4], conv:[] }, cands:[Q(8), Q(-4)], probe:6 }
};
function eqArgs(e){ return e.L.concat(e.RT || []); }
function leftReal(e, x){ return e.L.every(function(t){ return pf(t[1], x) > 0; }); }
function combArg(e, x){ var P = 1; e.L.forEach(function(t){ P *= Math.pow(pf(t[1], x), t[0]); }); return P; }
function leftOrig(e, x){ if (!leftReal(e, x)) return NaN; var y = 0; e.L.forEach(function(t){ y += t[0] * logv(e.b, pf(t[1], x)); }); return y; }
function leftComb(e, x){ var a = combArg(e, x); return a > 0 ? logv(e.b, a) : NaN; }
function rightLog(e, x){ if (!e.RT) return e.R; return e.RT.every(function(t){ return pf(t[1], x) > 0; }) ? logv(e.b, pf(e.RT[0][1], x)) : NaN; }
function rightConv(e, x){ return e.RT ? pf(e.RT[0][1], x) : Math.pow(e.b, e.R); }
function morphY(y, t, b){ return t <= 0 ? y : (1 - t) * y + t * Math.pow(b, clamp(y, -60, 60)); }
// converted window: crossings, y = 0 and the lowest point of each new curve, padded by 15%
function view3(e){
  var v = e.view, ys = [0];
  e.cands.forEach(function(c){ ys.push(rightConv(e, qv(c))); });
  [function(x){ return combArg(e, x); }, function(x){ return rightConv(e, x); }].forEach(function(f){
    var N = 400, h = (v.xmax - v.xmin) / N, prev = null, cur = f(v.xmin), nx, low = [];
    if (isFinite(cur)) low.push(cur);
    var last = f(v.xmax); if (isFinite(last)) low.push(last);
    for (var i = 1; i < N; i++) { nx = f(v.xmin + h * (i + 1)); if (prev != null && isFinite(prev) && isFinite(cur) && isFinite(nx) && cur <= prev && cur <= nx) low.push(cur); prev = cur; cur = nx; }
    if (low.length) ys.push(Math.min.apply(null, low));
  });
  var lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys), pad = (hi - lo) * 0.15;
  return { xmin:v.xmin, xmax:v.xmax, ymin:lo - pad, ymax:hi + pad };
}
Object.keys(EQM).forEach(function(k){ EQM[k].v3 = view3(EQM[k]); });

// animation parameters at rest after n moves
function restP(e, n){
  var done = e.moves.slice(0, n), P = { draw:1, line:1, lanes:0, gate:0, ghost:0, comb:0, morph:0, fade:0, glide:0, tok:0, drop:0, blink:0 };
  function has(k){ return done.indexOf(k) >= 0; }
  if (has("restr")) { P.lanes = eqArgs(e).length; P.gate = 1; }
  if (has("combine") || has("power")) { P.ghost = 1; P.comb = 1; }
  if (has("convert") || has("drop")) { P.morph = 1; P.fade = 1; P.glide = 1; }
  if (has("solve")) P.tok = 1;
  if (has("check")) P.drop = eqArgs(e).length + 1;
  return P;
}
function phases(e, mv){
  var n = eqArgs(e).length;
  if (mv === "restr") return [{ k:"lanes", a:0, b:n, d:300 * n, ease:LIN }, { k:"gate", a:0, b:1, d:300 }];
  if (mv === "combine" || mv === "power") return [{ k:["ghost", "comb"], a:0, b:1, d:800 }];
  if (mv === "convert" || mv === "drop") return [{ k:"morph", a:0, b:1, d:1500 }, { k:"fade", a:0, b:1, d:300 }, { k:"glide", a:0, b:1, d:400 }];
  if (mv === "solve") return [{ k:"tok", a:0, b:1, d:600 }];
  if (mv === "check") return [{ k:"drop", a:0, b:n + 1, d:400 * (n + 1), ease:LIN }];
  return [];
}
// run phases on P (forwards or backwards), repainting each frame
function animate(P, list, back, paint, done){
  var L = back ? list.slice().reverse() : list;
  seq(L.map(function(ph){ return function(next){
    var keys = [].concat(ph.k), a = back ? ph.b : ph.a, b = back ? ph.a : ph.b;
    MV.tween({ dur:ph.d, ease:ph.ease, step:function(t){ keys.forEach(function(k){ P[k] = lerp(a, b, t); }); paint(); }, done:next });
  }; }).concat([function(){ if (done) done(); }]));
}
// failing lane of a candidate (index into the original arguments) or -1
function failIdx(args, x){ for (var i = 0; i < args.length; i++) if (!(pf(args[i][1], x) > 0)) return i; return -1; }
function shortTxt(q){ return qt(q); }

// graph + lanes spec for an equation of the bank at parameters P
function solveSpec(id, P, o){
  o = o || {};
  var e = EQM[id], b = e.b, v0 = e.view, t = P.morph, args = eqArgs(e), nA = args.length;
  var v = { xmin:v0.xmin, xmax:v0.xmax, ymin:lerp(v0.ymin, e.v3.ymin, P.glide), ymax:lerp(v0.ymax, e.v3.ymax, P.glide) };
  var xa = v.xmin - (v.xmax - v.xmin) * 0.6, xb = v.xmax;   // sample into the gutter too
  var pen = css("--pen"), f3 = css("--f3"), curves = [], labels = [], wallsX, comb = P.ghost > 0 && e.comb;
  function mp(pts){ return t > 0 ? pts.map(function(q){ return [q[0], morphY(q[1], t, b)]; }) : pts; }
  // left side: the real branch, revealed outward from the wall during the hero's first step
  var lf = comb ? function(x){ return leftComb(e, x); } : function(x){ return leftOrig(e, x); };
  var realPred = function(x){ return leftReal(e, x) && isFinite(lf(x)); };
  var wallR = e.walls.orig[e.walls.orig.length - 1], drawTo = wallR + (v.xmax - wallR) * P.draw + 1e-9;
  pieces(lf, function(x){ return realPred(x) && x <= drawTo; }, xa, xb).forEach(function(pts){ curves.push({ pts:mp(pts), color:pen, width:3 }); });
  // ghost branch (after a widening move), grown outward from its wall
  if (comb) {
    var gpred = function(x){ return combArg(e, x) > 0 && !leftReal(e, x); };
    runs(gpred, xa, xb).forEach(function(r){
      var w = r[1] < xb - 1e-9 ? r[1] : r[0], dir = w === r[1] ? -1 : 1, far = Math.abs((dir < 0 ? Math.max(r[0], xa) : Math.min(r[1], xb)) - w), reach = far * P.ghost;
      var pts = sampleRun(lf, r[0], r[1], r[0] > xa + 1e-9, r[1] < xb - 1e-9).filter(function(q){ return Math.abs(q[0] - w) <= reach + 1e-9; });
      if (pts.length > 1) curves.push({ pts:mp(pts), color:pen, width:3, dash:[6, 6], glow:true });
      var mid = (Math.max(r[0], v.xmin) + Math.min(r[1], v.xmax)) / 2;
      if (P.ghost > 0.9 && t < 0.05 && !o.noGhostLabel && Math.min(r[1], v.xmax) - Math.max(r[0], v.xmin) > 0.5) labels.push({ x:mid, y:v.ymin + (v.ymax - v.ymin) * 0.12, lines:["ghost branch:", "exists only after combining"], alpha:Math.min(1, (P.ghost - 0.9) * 10) });
    });
  }
  // fade-in parts after the morph: where the old logs never existed
  if (t >= 1 && P.fade > 0) {
    var A = function(x){ return e.comb ? combArg(e, x) : pf(e.L[0][1], x); };
    var nolog = runs(function(x){ return !(A(x) > 0); }, xa, xb);
    nolog.forEach(function(r){ var pts = sampleRun(A, r[0], r[1], false, false); if (pts.length > 1) curves.push({ pts:pts, color:pen, width:2.6, dash:[5, 5], alpha:P.fade }); });
    var best = nolog.filter(function(r){ return Math.min(r[1], v.xmax) - Math.max(r[0], v.xmin) > 0.3; })[0];
    if (e.RT) {
      var rn = runs(function(x){ return !(pf(e.RT[0][1], x) > 0); }, xa, xb);
      rn.forEach(function(r){ var pts = sampleRun(function(x){ return rightConv(e, x); }, r[0], r[1], false, false); if (pts.length > 1) curves.push({ pts:pts, color:f3, width:2.4, dash:[5, 5], alpha:P.fade }); });
      if (!best) best = rn[0];
    }
    if (best) { var bm = (Math.max(best[0], v.xmin) + Math.min(best[1], v.xmax)) / 2; labels.push({ x:bm, y:v.ymin + (v.ymax - v.ymin) * 0.72, lines:["argument ≤ 0 here:", "no log existed"], alpha:P.fade }); }
  }
  // right side
  if (e.RT) pieces(function(x){ return rightLog(e, x); }, function(x){ return isFinite(rightLog(e, x)); }, xa, xb).forEach(function(pts){ curves.push({ pts:mp(pts), color:f3, width:2.6 }); });
  else { var ry = morphY(e.R, t, b), x2 = lerp(xa, xb, P.line); curves.push({ pts:[[xa, ry], [x2, ry]], color:f3, width:2.6 }); }
  // walls
  if (t >= 1) wallsX = e.walls.conv.map(function(x){ return { x:x, lab:num(x), alpha:1 }; });
  else wallsX = (comb ? e.walls.comb : e.walls.orig).map(function(x){ return { x:x, lab:num(x), alpha:1 - t }; });
  // crossings, guides, tokens
  var cross = [], guides = [], axisTok = [], laneTok = [];
  e.cands.forEach(function(c){
    var x = qv(c), ghost = !leftReal(e, x), y = morphY(rightLog(e, x), t, b);
    var vis = ghost ? (comb && P.ghost >= 0.98) : (P.draw >= 0.999 && P.line >= 0.999);
    if (!vis && !(P.tok > 0)) return;
    var blink = ghost && P.blink > 0 ? 0.25 + 0.75 * Math.abs(Math.cos(P.blink * Math.PI * 2)) : 1;
    cross.push({ x:x, y:y, ghost:ghost, alpha:blink });
    guides.push({ x:x, y:y, alpha:1 });
    if (P.tok > 0 && P.drop <= 0) axisTok.push({ x:x, y:lerp(y, 0, P.tok), txt:shortTxt(c), alpha:Math.min(1, P.tok * 3) });
    if (P.drop > 0) { var fi = failIdx(args, x); laneTok.push({ x:x, txt:shortTxt(c), t:P.drop, stop:fi < 0 ? nA + 1 : fi + 1, pass:fi < 0, fail:fi < 0 ? "" : lgArgC(b, pq(args[fi][1], c)) + " doesn’t exist" }); }
  });
  // lanes
  var rows = args.map(function(a, i){ return { type:"arg", lab:a[2], pos:function(x){ return pf(a[1], x) > 0; }, alpha:clamp(P.lanes - i, 0, 1) }; });
  rows.push({ type:"gate", lab:o.gateLab || "", pos:function(x){ return args.every(function(a){ return pf(a[1], x) > 0; }); }, alpha:P.gate });
  if (e.comb && !o.noComb) rows.push({ type:"comb", lab:e.comb, pos:function(x){ return combArg(e, x) > 0; }, ghost:function(x){ return !leftReal(e, x); }, alpha:P.comb });
  return { view:v, curves:curves, labels:labels, walls:wallsX, cross:cross, guides:guides, axisTokens:axisTok, probe:o.probe,
    describe:o.describe || "", lanes:{ rows:rows, guides:guides.map(function(g){ return g.x; }), tokens:laneTok, probe:o.probe, note:P.lanes <= 0 && o.laneNote ? o.laneNote : "", describe:o.laneDescribe || "" } };
}

// ---------- Build mode model: log_b(x + p) ± log_b(x + q) = m ----------
function bpow(b, mm){ return Number.isInteger(mm) ? (mm >= 0 ? Q(Math.pow(b, mm)) : Q(1, Math.pow(b, -mm))) : null; }
function sqPart(n){ var s = 1; for (var k = 2; k * k <= n; k++) while (n % (k * k) === 0) { n /= k * k; s *= k; } return [s, n]; }
// candidate labels: {x, src (m source after "x = " or with ≈), txt (short), real}
function buildCands(B){
  var p = B.p, q = B.q, b = B.b, mm = B.m, g = Math.max(-p, -q), out = [], Bq = bpow(b, mm), Bv = Math.pow(b, mm);
  if (B.tpl === "sum") {
    var Dv = (p - q) * (p - q) + 4 * Bv, sD = Math.sqrt(Dv), s = (-(p + q) + sD) / 2, r = (-(p + q) - sD) / 2, Dq = Bq ? qadd(Q((p - q) * (p - q)), qmul(Q(4), Bq)) : null;
    var lab = function(sign, x){
      if (Dq && Dq.d === 1) {
        var sp = sqPart(Dq.n), S = sp[0], Rr = sp[1];
        if (Rr === 1) { var qq = Q(-(p + q) + sign * S, 2); return { src:"x = " + qs(qq), txt:qt(qq), q:qq }; }
        var A = Q(-(p + q), 2), C = Q(S, 2), cs = (C.d === 1 ? (C.n === 1 ? "" : C.n) : "") + "√" + Rr, src;
        if (A.d === 1 && C.d === 1) src = A.n === 0 ? (sign < 0 ? "-" : "") + cs : A.n + (sign < 0 ? " - " : " + ") + cs;
        else src = (-(p + q) === 0 ? (sign < 0 ? "-" : "") + "{" + (S === 1 ? "" : S) + "√" + Rr + "}/{2}" : "{" + (-(p + q)) + (sign < 0 ? " - " : " + ") + (S === 1 ? "" : S) + "√" + Rr + "}/{2}");
        return { src:"x = " + src + " ≈ " + num(x, 2), txt:"≈" + num(x, 2), exact:src };
      }
      return { src:"x ≈ " + num(x, 2), txt:"≈" + num(x, 2) };
    };
    var ls = lab(1, s), lr = lab(-1, r);
    out.push(Object.assign({ x:s, real:true }, ls), Object.assign({ x:r, real:false }, lr));
  } else if (p !== q && mm !== 0) {
    var x = (q * Bv - p) / (1 - Bv), xq = Bq ? qdiv(qadd(qmul(Q(q), Bq), Q(-p)), qadd(Q(1), qmul(Q(-1), Bq))) : null;
    out.push({ x:x, real:x > g, src:xq ? "x = " + qs(xq) : "x ≈ " + num(x, 2), txt:xq ? qt(xq) : "≈" + num(x, 2), q:xq });
  }
  return out;
}
function bEqSrc(B, col){
  var L = col ? "log_{@b{" + B.b + "}}" : "log_" + B.b, a = linLab(B.p), c = linLab(B.q);
  var mm = Number.isInteger(B.m) ? String(B.m) : num(B.m, 2).replace(MINUS, "-");
  return L + (B.p === 0 ? " " + a : "(" + a + ")") + (B.tpl === "sum" ? " + " : " - ") + L + (B.q === 0 ? " " + c : "(" + c + ")") + " = " + mm;
}
function bArgs(B){ return [[1, [1, B.p], linLab(B.p)], [B.tpl === "sum" ? 1 : -1, [1, B.q], linLab(B.q)]]; }
function bComb(B, x){ var a = x + B.p, c = x + B.q; return B.tpl === "sum" ? a * c : a / c; }
function bProdLab(B){
  var a = linLab(B.p), c = linLab(B.q);
  if (B.tpl === "diff") return wrapLab(a) + "/" + wrapLab(c);
  if (B.p === B.q) return B.p === 0 ? "x^{2}" : "(" + a + ")^{2}";
  if (B.p === 0) return "x(" + c + ")"; if (B.q === 0) return "x(" + a + ")";
  return "(" + a + ")(" + c + ")";
}
function bView(B){
  if (B.view) return B.view;
  var g = Math.max(-B.p, -B.q), lo = Math.min(-B.p, -B.q), cs = buildCands(B), xmin = lo - 6, xmax = g + 6;
  cs.forEach(function(c){ if (c.x < xmin + 1 && c.x > lo - 14) xmin = Math.floor(c.x) - 1; if (c.x > xmax - 1 && c.x < g + 14) xmax = Math.ceil(c.x) + 1; });
  return { xmin:xmin, xmax:xmax, ymin:Math.min(-4, Math.floor(B.m) - 2), ymax:Math.max(6, Math.ceil(B.m) + 2) };
}
function buildSpec(B, o){
  o = o || {};
  var b = B.b, v = bView(B), g = Math.max(-B.p, -B.q), lo = Math.min(-B.p, -B.q), args = bArgs(B), pen = css("--pen"), f3 = css("--f3");
  var xa = v.xmin - (v.xmax - v.xmin) * 0.6, xb = v.xmax, curves = [];
  var lf = function(x){ var a = x + B.p, c = x + B.q; return a > 0 && c > 0 ? logv(b, a) + (B.tpl === "sum" ? 1 : -1) * logv(b, c) : NaN; };
  pieces(lf, function(x){ return isFinite(lf(x)); }, xa, xb).forEach(function(pts){ curves.push({ pts:pts, color:pen, width:3 }); });
  var cf = function(x){ var a = bComb(B, x); return a > 0 && isFinite(a) ? logv(b, a) : NaN; };
  pieces(cf, function(x){ return x < lo && isFinite(cf(x)); }, xa, xb).forEach(function(pts){ curves.push({ pts:pts, color:pen, width:3, dash:[6, 6], glow:true }); });
  curves.push({ pts:[[xa, B.m], [xb, B.m]], color:f3, width:2.6 });
  var walls = [-B.p, -B.q].filter(function(x, i, a){ return a.indexOf(x) === i; }).sort(function(x1, x2){ return x1 - x2; }).map(function(x){ return { x:x, lab:num(x), alpha:1 }; });
  var cs = buildCands(B), cross = [], guides = [], tokens = [], edges = [], sol = 0, ext = 0;
  cs.forEach(function(c){
    if (c.real) sol++; else ext++;
    if (c.x > v.xmax || c.x < v.xmin) { edges.push({ y:B.m, dir:c.x > v.xmax ? 1 : -1 }); return; }
    cross.push({ x:c.x, y:B.m, ghost:!c.real }); guides.push({ x:c.x, y:B.m });
    var fi = failIdx(args, c.x), av = args[fi < 0 ? 0 : fi][1], argQ = c.q ? pq(av, c.q) : null;
    tokens.push({ x:c.x, txt:c.txt, t:3, stop:fi < 0 ? 3 : fi + 1, pass:fi < 0, fail:fi < 0 ? "" : (argQ ? lgArgC(b, argQ) : (b === 10 ? "log" : "log_{" + b + "}") + "(" + num(pf(av, c.x), 2).replace(MINUS, "-") + ")") + " doesn’t exist" });
  });
  if (B.tpl === "diff" && B.p === B.q) { sol = 0; ext = 0; }
  var gateLab = "x > " + num(g).replace(MINUS, "-");
  var rows = [
    { type:"arg", lab:args[0][2], pos:function(x){ return x + B.p > 0; }, alpha:1 },
    { type:"arg", lab:args[1][2], pos:function(x){ return x + B.q > 0; }, alpha:1 },
    { type:"gate", lab:gateLab, pos:function(x){ return x > g; }, alpha:1 },
    { type:"comb", lab:bProdLab(B), pos:function(x){ var a = bComb(B, x); return a > 0 && isFinite(a); }, ghost:function(x){ return x <= g; }, alpha:1 }];
  return { view:v, curves:curves, labels:[], walls:walls, cross:cross, guides:guides, axisTokens:[], edges:edges, probe:o.probe, bracket:o.bracket,
    counter:o.counter === false ? "" : fill(MV.C.explore.txt.counter, { s:sol, e:ext }), describe:o.describe || "",
    lanes:{ rows:rows, guides:guides.map(function(q){ return q.x; }), tokens:tokens, probe:o.probe, describe:o.laneDescribe || "" } };
}

// ---------- probe readout (exact at multiples of 1/4) ----------
function argRow(tv){ return tv.map(function(t){ var pos = t.v.n > 0; return m(t.lab + " = " + qs(t.v) + (pos ? " > 0" : "")) + (pos ? " ✓" : " ✗"); }).join(" · "); }
function probeRows(b, L, R, xq, showComb, ghostSide){
  var T = MV.C.explore.txt, RD = MV.C.explore.read, tv = termVals(L, xq), rows = [], bad = tv.filter(function(t){ return t.v.n <= 0; })[0];
  var rtv = typeof R === "number" ? null : termVals(R, xq);
  var allTv = rtv ? tv.concat(rtv) : tv, rbad = rtv ? rtv.filter(function(t){ return t.v.n <= 0; })[0] : null;
  rows.push([RD.args, argRow(allTv)]);
  var left = bad ? null : sideEval(b, tv);
  rows.push([RD.left, bad ? fill(T.undef, { log:m(lgArg(b, bad.v)) }) : m(left.src)]);
  if (showComb) {
    var P = Q(1); tv.forEach(function(t){ P = qmul(P, qpow(t.v, t.k)); });
    var prod = tv.map(function(t, i){ var s = "(" + qs(t.v) + ")" + (Math.abs(t.k) === 2 ? "^2" : ""); return i === 0 ? s : (t.k < 0 ? " ÷ " : "") + s; }).join("");
    var cs;
    if (P.n <= 0) cs = fill(T.undef, { log:m(lgArg(b, P)) });
    else { var pe = logExact(b, P), cv = pe !== null ? " = " + pe : " ≈ " + num(logv(b, qv(P)), 3); cs = bad ? m(lg(b) + "(" + prod + ") = " + lgArg(b, P) + cv) + " " + T.ghostTag : m(lgArg(b, P) + cv); }
    rows.push([RD.comb, cs]);
  }
  var right = rtv ? (rbad ? null : sideEval(b, rtv)) : null;
  rows.push([RD.right, rtv ? (rbad ? fill(T.undef, { log:m(lgArg(b, rbad.v)) }) : m(right.src)) : m(typeof R === "number" && !Number.isInteger(R) ? num(R, 2) : String(R))]);
  var eq;
  if (bad || rbad) eq = T.eqNone;
  else { var lv = left.v, rv = rtv ? right.v : R; eq = Math.abs(lv - rv) < 1e-9 ? T.eqYes : fill(T.eqNo, { a:num(lv, 3), b:num(rv, 3) }); }
  rows.push([RD.equal, eq]);
  return rows;
}
// gate check line for one candidate of the bank
function gateLine(e, c){
  var T = MV.C.explore.txt, args = eqArgs(e), b = e.b, vals = args.map(function(a){ return { lab:a[2], v:pq(a[1], c), k:a[0] }; });
  var fi = vals.map(function(x){ return x.v.n > 0; }).indexOf(false), xs = m("x = " + qs(c));
  if (fi >= 0) return fill(T.fail, { x:xs, arg:m(vals[fi].lab + " = " + qs(vals[fi].v)), log:m(lgArg(b, vals[fi].v)) });
  var argsTxt = vals.map(function(x){ return m(x.lab + " = " + qs(x.v) + " > 0"); }).join(" and ");
  var chk;
  if (e.RT) { var tv = termVals(e.L, c), P = Q(1); tv.forEach(function(t){ P = qmul(P, qpow(t.v, t.k)); }); chk = m(termSrc(b, tv) + " = " + lgArg(b, P)) + ", which is the right side, " + m(lgArg(b, pq(e.RT[0][1], c))); }
  else chk = m(sideEval(b, termVals(e.L, c)).src);
  return fill(T.pass, { x:xs, args:argsTxt, check:chk });
}

// ---------- hero ----------
function hero(f){
  var lc = $("#hero-lanes"); if (!f.canvas || !lc) return;
  var gv = gateView(f.canvas, lc), H = MV.C.hero, e = EQM.S1, nA = 2;
  var P = { draw:0, line:0, lanes:0, gate:0, ghost:0, comb:0, morph:0, fade:0, glide:0, tok:0, drop:0, blink:0 };
  var desc = f.canvas.getAttribute("aria-label"), ldesc = lc.getAttribute("aria-label");
  function paint(){ gv.draw(solveSpec("S1", P, { noComb:true, gateLab:"x > 2", describe:desc, laneDescribe:ldesc, noGhostLabel:P.drop > 0 })); }
  function cap(h){ if (f.cap) f.cap.innerHTML = h; }
  if (MV.reduceMotion) { P = { draw:1, line:1, lanes:nA, gate:1, ghost:1, comb:0, morph:0, fade:0, glide:0, tok:1, drop:nA + 1, blink:0 }; cap(H.caps[1]); paint(); return; }
  paint();
  function tw(keys, a, b, d, ease){ return function(next){ MV.tween({ dur:d, ease:ease, step:function(t){ [].concat(keys).forEach(function(k){ P[k] = lerp(a, b, t); }); paint(); }, done:next }); }; }
  function pause(ms){ return function(next){ MV.wait(ms, next); }; }
  seq([pause(500), tw("draw", 0, 1, 1000), tw("line", 0, 1, 500), pause(700),
    function(next){ cap(H.caps[0]); next(); }, pause(400), tw("ghost", 0, 1, 1000), pause(600),
    tw("tok", 0, 1, 600), pause(400), tw("lanes", 0, nA, 600, LIN), tw("gate", 0, 1, 300), pause(300),
    tw("drop", 0, nA + 1, 1200, LIN), pause(500), function(){ cap(H.caps[1]); }]);
}

// ---------- Explore: Domain gate ----------
var PRED = {
  p1:{ mode:"solve", eq:"S1", n:1 },
  p2:{ mode:"solve", eq:"S1", n:2 },
  p3:{ mode:"build", B:{ tpl:"sum", b:2, p:0, q:-2, m:-3, view:{ xmin:-6, xmax:8, ymin:-5, ymax:7 } } },
  p4:{ mode:"build", B:{ tpl:"diff", b:2, p:1, q:-3, m:2, view:{ xmin:-10, xmax:16, ymin:-4, ymax:6 } } }
};
var LOCKS = { tc1:{ tpl:"sum", b:3, p:0, q:6 }, tc2:{ tpl:"sum", b:2, m:1 }, tc3:{ tpl:"diff", b:2 } };
function explore(host, api){
  var C = api.content, S = api.S, T = C.txt, RD = C.read, BANK = {};
  C.bank.forEach(function(q){ BANK[q.id] = q; });
  if (!S.mode) S.mode = "solve";
  if (!S.eq || !EQM[S.eq]) S.eq = "S1";
  S.st = S.st || {}; S.gp = S.gp || {}; S.probe = S.probe || {};
  if (!S.B) S.B = { tpl:"sum", b:2, p:0, q:-2, m:3 };
  if (!S.lock) S.lock = "free";
  if (S.probeB == null) S.probeB = 3;
  var view = { panel:null, fb:null, busy:false, P:null, stop:"" };
  host.innerHTML = '<div class="lg"><div class="lg-modes"></div>' +
    '<div class="lg-sbar"><div class="lg-eqs"></div><p class="tiny muted lg-note">' + C.bankNote + "</p></div>" +
    '<div class="lg-bbar" hidden><div class="lg-tpl"></div><div class="lg-base"></div><div class="lg-lock"></div></div>' +
    '<div class="lg-main"><div class="lg-graph" data-mv="graph"><ol class="lg-hist" aria-label="Earlier lines"></ol><div class="eq-cap lg-cap" aria-live="polite"></div><p class="lg-stop" aria-live="polite"></p>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p><div class="lg-pic"><div class="plot-wrap"><canvas class="plot" role="img" aria-label="Domain gate graph"></canvas></div><canvas class="lg-lanes" role="img" aria-label="Argument lanes"></canvas></div><p class="tiny muted lg-shows"></p></div>' +
    '<div class="lg-side"><div class="lg-solve"><p class="lg-h">Choose the next move</p><div class="lg-moves" role="group" aria-label="Moves"></div><div class="lg-panel"></div><div class="lg-fb" aria-live="polite"></div>' +
    '<div class="q-actions lg-nav"><button type="button" class="btn ghost sm" data-act="back" data-k="lgback">' + C.back + '</button><button type="button" class="btn ghost sm" data-act="again" data-k="lgagain">' + C.again + "</button></div></div>" +
    '<div class="lg-build" hidden><div class="lg-sl"></div><div class="lg-sl"></div><div class="lg-sl"></div><p class="tiny lg-locknote"></p></div>' +
    '<dl class="read lg-read" aria-live="polite"></dl><h4 class="lg-ph"></h4><dl class="read lg-pread" aria-live="polite"></dl></div></div></div>';
  var E = { modes:$(".lg-modes", host), sbar:$(".lg-sbar", host), bbar:$(".lg-bbar", host), eqs:$(".lg-eqs", host), hist:$(".lg-hist", host), cap:$(".lg-cap", host), stop:$(".lg-stop", host),
    shows:$(".lg-shows", host), solve:$(".lg-solve", host), build:$(".lg-build", host), moves:$(".lg-moves", host), panel:$(".lg-panel", host), fb:$(".lg-fb", host),
    read:$(".lg-read", host), ph:$(".lg-ph", host), pread:$(".lg-pread", host), locknote:$(".lg-locknote", host) };
  var gv = gateView($("canvas.plot", host), $("canvas.lg-lanes", host));
  function cur(){ return S.st[S.eq] || (S.st[S.eq] = { n:0 }); }
  function E0(){ return EQM[S.eq]; }
  function restNow(){ view.P = restP(E0(), cur().n); }
  // ----- controls -----
  var modeRG = radios(E.modes, { options:C.modes, value:S.mode, aria:"Mode", onChange:function(v){ S.mode = v; view.panel = null; view.fb = null; MV.banner("", ""); view.stop = ""; save(); paint(); } });
  var eqRG = radios(E.eqs, { options:C.bank.map(function(q){ return { id:q.id, t:'<span class="lg-tag">' + q.id + "</span> " + q.eq }; }), value:S.eq, cls:"chips", aria:"Equation bank", onChange:function(v){ S.eq = v; view.panel = null; view.fb = null; MV.banner("", ""); restNow(); save(); paint(); } });
  var tplRG = radios($(".lg-tpl", host), { options:C.build.tpls, value:S.B.tpl, label:C.build.tplLabel, aria:"Template", cls:"chips", lockIcon:true, onChange:function(v){ S.B.tpl = v; userB(); } });
  var baseRG = radios($(".lg-base", host), { options:[{ id:2, t:m("@b{2}") }, { id:3, t:m("@b{3}") }], value:S.B.b, label:C.build.baseLabel, aria:"Base b", cls:"chips lg-bch", lockIcon:true, onChange:function(v){ S.B.b = +v; userB(); } });
  var lockRG = radios($(".lg-lock", host), { options:C.build.locks, value:S.lock, label:C.build.lockLabel, aria:"Lock values for a challenge", cls:"chips", onChange:function(v){ S.lock = v; var L = LOCKS[v]; if (L) Object.keys(L).forEach(function(k){ S.B[k] = L[k]; }); delete S.B.view; syncB(); userB(); } });
  var slh = host.querySelectorAll(".lg-sl"), fmtV = function(v){ return m(Number.isInteger(v) ? String(v) : num(v, 2).replace(MINUS, "-")); };
  var SL = {
    p:stepSlider(slh[0], { id:"p", name:"p", label:m("p"), min:-6, max:6, value:S.B.p, fmt:fmtV, onChange:function(v){ S.B.p = v; userB(); } }),
    q:stepSlider(slh[1], { id:"q", name:"q", label:m("q"), min:-6, max:6, value:S.B.q, fmt:fmtV, onChange:function(v){ S.B.q = v; userB(); } }),
    m:stepSlider(slh[2], { id:"m", name:"m", label:m("m"), min:-3, max:5, value:S.B.m, fmt:fmtV, onChange:function(v){ S.B.m = v; userB(); } })
  };
  function syncB(){
    tplRG.set(S.B.tpl); baseRG.set(S.B.b); lockRG.set(S.lock); SL.p.set(S.B.p); SL.q.set(S.B.q); SL.m.set(S.B.m);
    var L = LOCKS[S.lock] || {};
    tplRG.lock(!!L.tpl || view.busy); baseRG.lock(!!L.b || view.busy); SL.p.lock(L.p != null); SL.q.lock(L.q != null); SL.m.lock(L.m != null);
    ["p", "q", "m"].forEach(function(k){ SL[k].busy(view.busy); }); lockRG.lock(view.busy);
    var names = [];
    if (L.tpl) names.push(L.tpl === "sum" ? "Sum template" : "Difference template");
    if (L.b) names.push("base " + L.b); ["p", "q", "m"].forEach(function(k){ if (L[k] != null) names.push(m(k + " = " + L[k])); });
    E.locknote.innerHTML = names.length ? fill(C.build.lockNote, { list:names.join(", ") }) : "";
  }
  function userB(){ delete S.B.view; view.stop = ""; MV.banner("", ""); save(); paint(); }
  function save(){ api.save(); MV.changed(); }
  // ----- solve-mode moves -----
  function moveFb(e, n, id){
    var next = e.moves[n], F = C.moveFb;
    if (next == null) return F.done;
    if (id === next) return null;
    if (id === "restr") return F.restrDone;
    if (next === "restr") return F.first;
    if (next === "combine") return id === "convert" ? F.c_convert : id === "drop" ? F.c_drop : id === "power" ? F.c_power : F.inLogs;
    if (next === "power") return id === "combine" ? F.p_combine : id === "drop" ? F.p_drop : id === "convert" ? F.p_convert : F.inLogs;
    if (next === "convert") return id === "drop" ? F.v_drop : (id === "combine" || id === "power") ? F.v_one : F.inLogs;
    if (next === "drop") return id === "convert" ? F.d_convert : F.d_other;
    if (next === "solve") return id === "check" ? F.s_check : F.s_logs;
    return F.k_other;
  }
  function doMove(id){
    var e = E0(), st = cur(), fb = moveFb(e, st.n, id);
    MV.banner("", "");
    if (fb) { view.fb = { kind:"bad", html:"<strong>✗</strong> " + fb }; view.panel = null; paint(); MV.focusFb(E.fb); return; }
    view.fb = null;
    if (id === "restr") { view.panel = { kind:"restr", last:null }; paint(); return; }
    var bk = BANK[S.eq];
    if (bk.cards && bk.cards[id]) { view.panel = { kind:"cards", move:id, last:null, order:MV.shuffle(bk.cards[id].map(function(_, i){ return i; }), S.eq + id) }; paint(); return; }
    if (id === "check") { view.panel = { kind:"gate", pick:{} }; paint(); return; }
    advance();
  }
  function advance(after){
    var e = E0(), st = cur(), mv = e.moves[st.n];
    view.panel = null; view.busy = true; view.P = restP(e, st.n); paint();
    animate(view.P, phases(e, mv), false, drawPic, function(){ st.n++; view.busy = false; restNow(); save(); paint(); if (after) after(); });
  }
  function back(){
    var e = E0(), st = cur(); if (st.n <= 0 || view.busy) return;
    var mv = e.moves[st.n - 1];
    view.panel = null; view.fb = null; view.busy = true; MV.banner("", ""); view.P = restP(e, st.n); paint();
    animate(view.P, phases(e, mv), true, drawPic, function(){ st.n--; view.busy = false; restNow(); save(); paint(); });
  }
  // ----- painting -----
  function lineFor(e, n){
    var bk = BANK[S.eq], done = e.moves.slice(0, n), lines = [bk.eq];
    if (done.indexOf("combine") >= 0 || done.indexOf("power") >= 0) lines.push(bk.lines.comb);
    if (done.indexOf("convert") >= 0 || done.indexOf("drop") >= 0) lines.push(bk.lines.conv);
    if (done.indexOf("solve") >= 0) lines.push(bk.lines.exp, bk.lines.fac);
    return lines;
  }
  function stageKey(e, n){ var d = e.moves.slice(0, n); return d.indexOf("solve") >= 0 ? "solve" : (d.indexOf("convert") >= 0 || d.indexOf("drop") >= 0) ? "conv" : (d.indexOf("combine") >= 0 || d.indexOf("power") >= 0) ? "comb" : "orig"; }
  function probeQ(){ var x = S.mode === "build" ? S.probeB : (S.probe[S.eq] != null ? S.probe[S.eq] : E0().probe); return toQ(x) || Q(Math.round(x * 4), 4); }
  function probeX(){ return qv(probeQ()); }
  function drawPic(){
    if (S.mode === "build") {
      gv.draw(buildSpec(S.B, { probe:probeX(), describe:bDescribe(), laneDescribe:"Argument lanes for " + MV.plain(m(linLab(S.B.p))) + " and " + MV.plain(m(linLab(S.B.q))) + ", the gate and the combined argument." }));
      return;
    }
    var e = E0(), P = view.P || restP(e, cur().n), bk = BANK[S.eq];
    gv.draw(solveSpec(S.eq, P, { probe:probeX(), gateLab:gateLabel(e), laneNote:"The lanes appear when you state the restrictions.", describe:sDescribe(e, P), laneDescribe:"Argument lanes for " + eqArgs(e).map(function(a){ return MV.plain(m(a[2])); }).join(", ") + (P.gate > 0 ? ". Gate: " + MV.plain(bk.restr) : "") + "." }));
  }
  function gateLabel(e){ var g = MV.plain(BANK[S.eq].restr); var k = g.lastIndexOf("so "); return k >= 0 ? g.slice(k + 3).replace(/−/g, "-").replace(/ or /g, " or ") : ""; }
  function sDescribe(e, P){
    var lines = lineFor(e, cur().n), cs = e.cands.map(function(c){ return "x = " + qt(c) + (leftReal(e, qv(c)) ? ", on the real branch" : ", on the ghost branch"); });
    return "Graph of " + MV.plain(lines[Math.min(lines.length - 1, 2)]) + ": left side in blue, right side in teal" + (P.ghost > 0 && e.comb ? ", with a dashed ghost branch where only the combined log exists" : "") + ". Crossings at " + cs.join(" and ") + ".";
  }
  function bDescribe(){ var cs = buildCands(S.B); return "Graph of " + MV.plain(m(bEqSrc(S.B))) + ". " + (cs.length ? cs.map(function(c){ return MV.plain(m(c.src)) + (c.real ? ", a solution" : ", extraneous"); }).join("; ") : "No candidate") + "."; }
  function paintMoves(){
    var dis = view.busy || S.mode !== "solve";
    MV.keepFocus(E.moves, function(){ E.moves.innerHTML = C.moves.map(function(x){ return '<button type="button" class="btn lg-mv" data-move="' + x.id + '" data-k="lgm' + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join(""); });
  }
  function paintPanel(){
    var pn = view.panel, bk = BANK[S.eq], e = E0(), h = "";
    if (pn && pn.kind === "restr") {
      var opts = bk.restrict.options;
      h = '<div class="lg-pbox"><p class="lg-q">' + C.restrictQ + '</p><div class="lg-chips" role="group" aria-label="Restrictions">' + opts.map(function(o, i){ return '<button type="button" class="chip lg-chip' + (pn.last === i ? " on" : "") + '" data-rc="' + i + '" data-k="lgrc' + i + '" aria-pressed="' + (pn.last === i) + '">' + o.t + "</button>"; }).join("") + "</div>";
      if (pn.last != null) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + opts[pn.last].why);
      h += "</div>";
    } else if (pn && pn.kind === "cards") {
      var cards = bk.cards[pn.move];
      h = '<div class="lg-pbox"><p class="lg-q">' + C.cardQ + '</p><div class="lg-cards" role="group" aria-label="Result cards">' + pn.order.map(function(i){ var c = cards[i]; return '<button type="button" class="opt lg-card' + (pn.last === i ? " wrong" : "") + '" data-cd="' + i + '" data-k="lgcd' + i + '"><span>' + c.t + "</span></button>"; }).join("") + "</div>";
      if (pn.last != null) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + cards[pn.last].why + " Pick again.");
      h += "</div>";
    } else if (pn && pn.kind === "gate") {
      h = '<div class="lg-pbox"><p class="lg-q">' + C.gateQ + '</p><div class="lg-chips" role="group" aria-label="Candidates the gate will reject">' + e.cands.map(function(c, i){ var on = !!pn.pick[i]; return '<button type="button" class="chip lg-chip' + (on ? " on" : "") + '" data-gp="' + i + '" data-k="lggp' + i + '" aria-pressed="' + on + '">' + m("x = " + qs(c)) + "</button>"; }).join("") +
        '<button type="button" class="chip lg-chip' + (pn.none ? " on" : "") + '" data-gp="none" data-k="lggpn" aria-pressed="' + !!pn.none + '">' + C.gateNone + '</button></div><div class="q-actions"><button type="button" class="btn primary sm" data-act="run" data-k="lgrun"' + (pn.none || Object.keys(pn.pick).some(function(k){ return pn.pick[k]; }) ? "" : " disabled") + ">" + C.gateRun + "</button></div></div>";
    }
    MV.keepFocus(E.panel, function(){ E.panel.innerHTML = h; });
    E.fb.innerHTML = view.fb ? MV.fbHTML(view.fb.kind, view.fb.html) : "";
  }
  function paintRead(){
    var rows = [];
    if (S.mode === "build") {
      var B = S.B, g = Math.max(-B.p, -B.q), cs = buildCands(B), a = linLab(B.p), c = linLab(B.q), Bq = bpow(B.b, B.m);
      rows.push([RD.bEq, m(bEqSrc(B, true))]);
      rows.push([RD.bRestr, m(a + " > 0") + " and " + m(c + " > 0") + ", so " + m("x > " + g)]);
      var one = B.tpl === "sum" ? "log_{@b{" + B.b + "}}(" + bProdLab(B).replace("^{2}", "^2") + ")" : "log_{@b{" + B.b + "}}({" + a + "}/{" + c + "})";
      var mm = Number.isInteger(B.m) ? String(B.m) : num(B.m, 2).replace(MINUS, "-");
      rows.push([RD.bOne, m(one + " = " + mm)]);
      var lhs = B.tpl === "sum" ? bProdLab(B).replace("^{2}", "^2") : "{" + a + "}/{" + c + "}";
      rows.push([RD.bExp, m(lhs + " = @b{" + B.b + "}^{" + mm + "} = " + (Bq ? qs(Bq) : "") ) .replace(/ = <\/span>$/, "</span>") + (Bq ? "" : " ≈ " + num(Math.pow(B.b, B.m), 3))]);
      var cand, gate, res;
      if (B.tpl === "diff" && B.p === B.q) { cand = "—"; gate = "—"; res = fill(T.bSame, { L:m("log_{@b{" + B.b + "}} 1 = 0"), G:m("x > " + g) }); }
      else if (!cs.length) { cand = fill(T.bNoCand, { E:m(a + " = " + c) }); gate = "—"; res = T.noSol; }
      else {
        cand = cs.map(function(x){ return m(x.src); }).join(" or ");
        gate = cs.map(function(x){
          var av = [x.x + B.p, x.x + B.q].map(function(v, i){ return x.q ? qs(qadd(x.q, Q(i ? B.q : B.p))) : (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : "≈ " + num(v, 2).replace(MINUS, "-")); });
          return fill(x.real ? T.bGatePass : T.bGateFail, { x:m(/^x ≈/.test(x.src) ? x.src : x.src.replace(/ ≈ .*$/, "")), a:m(av[0]), b:m(av[1]) });
        }).join(". ") + ".";
        var sol = cs.filter(function(x){ return x.real; })[0], ex = cs.filter(function(x){ return !x.real; })[0], nm = function(x){ return m(x.exact ? "x = " + x.exact : x.src); };
        res = sol && ex ? fill(T.bOne, { s:nm(sol), r:nm(ex) }) : sol ? fill(T.bOnly, { s:nm(sol) }) : T.bNone;
      }
      rows.push([RD.bCands, cand], [RD.bGate, gate], [RD.bResult, res]);
    } else {
      var e = E0(), st = cur(), bk = BANK[S.eq], n = st.n, done = e.moves.slice(0, n), key = stageKey(e, n), lines = lineFor(e, n);
      rows.push([RD.orig, bk.eq], [RD.line, lines[lines.length - 1]]);
      if (done.indexOf("restr") >= 0) rows.push([RD.restr, bk.restr]);
      rows.push([RD.exists, bk.dom[key]], [RD.ghost, bk.ghost && bk.ghost[key] ? fill(T.ghostSome, { r:bk.ghost[key] }) : T.ghostNone]);
      if (done.indexOf("solve") >= 0) rows.push([RD.cands, bk.cands]);
      if (done.indexOf("check") >= 0) rows.push([RD.gate, e.cands.map(function(c){ return gateLine(e, c); }).join(" ")], [RD.sol, bk.solution]);
    }
    E.read.innerHTML = MV.readoutHTML(rows);
    var xq = probeQ();
    E.ph.innerHTML = fill(RD.probe, { x:m(qs(xq)) });
    if (S.mode === "build") E.pread.innerHTML = MV.readoutHTML(probeRows(S.B.b, bArgs(S.B), S.B.m, xq, true));
    else { var e2 = E0(), d2 = e2.moves.slice(0, cur().n); E.pread.innerHTML = MV.readoutHTML(probeRows(e2.b, e2.L, e2.RT || e2.R, xq, e2.comb && (d2.indexOf("combine") >= 0 || d2.indexOf("power") >= 0))); }
  }
  function paint(){
    var build = S.mode === "build";
    modeRG.set(S.mode); modeRG.lock(view.busy); eqRG.set(S.eq); eqRG.lock(view.busy);
    E.sbar.hidden = build; E.bbar.hidden = !build; E.solve.hidden = build; E.build.hidden = !build; E.hist.hidden = build;
    if (build) {
      syncB();
      E.cap.innerHTML = m(bEqSrc(S.B, true)); E.shows.innerHTML = "";
    } else {
      var e = E0(), lines = lineFor(e, cur().n), bk = BANK[S.eq];
      E.cap.innerHTML = lines[lines.length - 1];
      MV.keepFocus(E.hist, function(){ E.hist.innerHTML = lines.slice(0, -1).map(function(l){ return '<li class="lg-l">' + l + "</li>"; }).join(""); });
      E.shows.innerHTML = "<strong>" + bk.id + ":</strong> " + bk.shows;
      paintMoves(); paintPanel();
      $('[data-act="back"]', host).disabled = view.busy || cur().n === 0;
      $('[data-act="again"]', host).disabled = view.busy || cur().n === 0;
    }
    E.stop.innerHTML = view.stop || "";
    paintRead(); drawPic();
  }
  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var d = b.dataset;
    if (d.move) { if (!view.busy) doMove(d.move); return; }
    if (d.rc != null) {
      var opt = BANK[S.eq].restrict.options[+d.rc];
      if (MV.ok(opt)) { view.panel = null; view.fb = { kind:"good", html:"<strong>✓ Correct.</strong> " + BANK[S.eq].restr + "." }; advance(); }
      else { view.panel.last = +d.rc; paintPanel(); MV.focusFb(E.panel); }
      return;
    }
    if (d.cd != null) {
      var card = BANK[S.eq].cards[view.panel.move][+d.cd];
      if (MV.ok(card)) { view.fb = { kind:"good", html:"<strong>✓ Correct.</strong> " + card.t }; advance(); }
      else { view.panel.last = +d.cd; paintPanel(); MV.focusFb(E.panel); }
      return;
    }
    if (d.gp != null) {
      var pn = view.panel;
      if (d.gp === "none") { pn.none = !pn.none; if (pn.none) pn.pick = {}; }
      else { pn.pick[d.gp] = !pn.pick[d.gp]; if (pn.pick[d.gp]) pn.none = false; }
      paintPanel(); return;
    }
    if (d.act === "run") {
      var e0 = E0(), pk = view.panel.pick, args = eqArgs(e0), right = e0.cands.every(function(c, i){ return !!pk[i] === (failIdx(args, qv(c)) >= 0); });
      if (!S.gp[S.eq]) S.gp[S.eq] = { right:right };
      view.fb = null;
      advance(function(){ MV.banner(right ? "good" : "bad", right ? C.gateRight : C.gateWrong); });
      return;
    }
    if (d.act === "back") { back(); return; }
    if (d.act === "again") { if (view.busy) return; cur().n = 0; view.panel = null; view.fb = null; MV.banner("", ""); restNow(); save(); paint(); return; }
  });
  // ----- probe (G7) -----
  var drag = MV.drag(gv.gp, {
    handles:function(){ return gv.gp.v ? [{ id:"probe", x:probeX(), y:gv.gp.yOf(14), label:"Probe at x = " + qt(probeQ()) + ". Use the arrow keys to move it; Shift moves by 1." }] : []; },
    axis:"x", step:{ x:0.25 }, big:4,
    move:function(id, x){ setProbe(x); },
    key:function(id, e){ var v = S.mode === "build" ? bView(S.B) : E0().view; if (e.key === "Home") { setProbe(v.xmin); return true; } if (e.key === "End") { setProbe(v.xmax); return true; } return false; }
  });
  function setProbe(x){
    var v = S.mode === "build" ? bView(S.B) : E0().view, cands = S.mode === "build" ? buildCands(S.B).filter(function(c){ return c.q; }).map(function(c){ return qv(c.q); }) : E0().cands.map(qv);
    x = clamp(Math.round(x * 4) / 4, Math.ceil(v.xmin * 4) / 4, Math.floor(v.xmax * 4) / 4);
    cands.forEach(function(c){ if (Math.abs(c - x) <= 0.15 + 1e-9 || Math.abs(c - x) < 0.13) x = c; });
    if (S.mode === "build") S.probeB = x; else S.probe[S.eq] = x;
    api.save(); paintRead(); drawPic();
  }
  void drag;
  restNow(); paint();
  // ----- predictions and challenges -----
  function loadPred(p){
    var sc = PRED[p.id]; view.panel = null; view.fb = null; view.stop = "";
    if (sc.mode === "solve") { S.mode = "solve"; S.eq = sc.eq; cur().n = sc.n; restNow(); }
    else { S.mode = "build"; S.lock = "free"; S.B = JSON.parse(JSON.stringify(sc.B)); S.probeB = sc.B.tpl === "sum" ? 3 : 5; }
    save(); paint();
  }
  function sweep(from, to, dur, stops, done){
    var keys = Object.keys(stops).map(Number).sort(function(a, b){ return from < to ? a - b : b - a; }), shown = {};
    view.busy = true; paint();
    function stopAt(mm){ keys.forEach(function(k){ if (!shown[k] && (from < to ? mm >= k - 1e-9 : mm <= k + 1e-9)) { shown[k] = true; view.stop = stops[String(k)]; E.stop.innerHTML = view.stop; } }); }
    MV.tween({ dur:dur, ease:LIN, step:function(t){ var mm = lerp(from, to, t); S.B.m = Math.abs(mm - Math.round(mm)) < 1e-6 ? Math.round(mm) : mm; SL.m.set(S.B.m); stopAt(mm); paintRead(); drawPic(); E.cap.innerHTML = m(bEqSrc(S.B, true)); },
      done:function(){ S.B.m = to; view.busy = false; stopAt(to); save(); paint(); done(); } });
  }
  return {
    predict:{
      start:function(p){ loadPred(p); },
      run:function(p, done){
        var e = EQM.S1;
        if (p.id === "p1") {
          view.busy = true; view.P = restP(e, 1); paint();
          seq([function(nx){ E.cap.innerHTML = BANK.S1.lines.comb; nx(); },
            function(nx){ animate(view.P, [{ k:["ghost", "comb"], a:0, b:1, d:1000 }], false, drawPic, nx); },
            function(nx){ MV.tween({ dur:900, ease:LIN, step:function(t){ view.P.blink = t * 2; drawPic(); }, done:function(){ view.P.blink = 0; nx(); } }); },
            function(){ cur().n = 2; view.busy = false; restNow(); save(); paint(); done(); }]);
        } else if (p.id === "p2") {
          view.busy = true; view.P = restP(e, 2); paint();
          animate(view.P, phases(e, "convert"), false, drawPic, function(){ cur().n = 3; view.busy = false; restNow(); save(); paint(); done(); });
        } else if (p.id === "p3") sweep(-3, 5, 4000, p.stops, done);
        else if (p.id === "p4") sweep(2, -2, 5000, p.stops, done);
        else done();
      }
    },
    challenge:function(id){ return chalTest(id, S, C); }
  };
}
function chalTest(id, S, C){
  var B = S.B, c = C.challenges.filter(function(x){ return x.id === id; })[0], M = c.msgs, L = LOCKS[id];
  var setOK = Object.keys(L).every(function(k){ return B[k] === L[k]; });
  if (S.mode !== "build" || !setOK) return { ok:false, msg:M.setup };
  var cs = buildCands(B);
  if (id === "tc1") {
    if (B.m === 3) return { ok:true };
    var named = { 2:M.m2, 4:M.m4, 1:M.m1 }[B.m];
    if (named) return { ok:false, msg:named };
    var s = cs.filter(function(x){ return x.real; })[0];
    return { ok:false, msg:fill(M.other, { s:s ? m(s.src) : "—" }) };
  }
  if (id === "tc2") {
    var a = -4 + B.p, b = -4 + B.q;
    if (a * b === 2 && a > 0 && b > 0) return { ok:true };
    if ((B.p === 3 && B.q === 2) || (B.p === 2 && B.q === 3)) return { ok:false, msg:M.named };
    return { ok:false, msg:fill(M.other, { a:num(a), b:num(b), p:num(a * b) }) };
  }
  if (id === "tc3") {
    if (B.p === B.q) return { ok:false, msg:M.pq };
    if (B.m === 0) return { ok:false, msg:M.m0 };
    var cd = cs[0];
    if (!cd || !cd.q || cd.q.n !== cd.q.d) return { ok:false, msg:fill(M.other, { c:cd ? m(cd.src) : "—" }) };
    if (1 + B.q > 0) return { ok:false, msg:fill(M.passes, { a:num(1 + B.p), b:num(1 + B.q) }) };
    return { ok:true };
  }
  return { ok:false };
}

// ---------- Part 3: root audit ----------
// per chain: strip pieces (domain), solutions, and the "Graph this line" functions
var SQ5 = Math.sqrt(5);
function lgf(b){ return function(x){ return x > 0 ? logv(b, x) : NaN; }; }
var l2 = lgf(2), l3 = lgf(3), l4 = lgf(4);
var AUD = {
  A:{ lines:[
    { dom:[[8, Infinity, false]], sol:[9], L:function(x){ return l3(x) + l3(x - 8); }, R:function(){ return 2; }, v:{ ymin:-4, ymax:5 } },
    { dom:[[-Infinity, 0, false], [8, Infinity, false]], sol:[-1, 9], L:function(x){ return l3(x * (x - 8)); }, R:function(){ return 2; }, v:{ ymin:-4, ymax:5 } },
    { dom:[[-Infinity, Infinity]], sol:[-1, 9], L:function(x){ return x * (x - 8); }, R:function(){ return 9; }, v:{ ymin:-20, ymax:40 } },
    { dom:[[-Infinity, Infinity]], sol:[-1, 9], L:function(x){ return (x - 9) * (x + 1); }, R:function(){ return 0; }, v:{ ymin:-30, ymax:40 } }] },
  B:{ lines:[
    { dom:[[-Infinity, 0, false], [0, Infinity, false]], sol:[-9, 9], L:function(x){ return x ? l3(x * x) : NaN; }, R:function(){ return 4; }, v:{ ymin:-3, ymax:6 } },
    { dom:[[0, Infinity, false]], sol:[9], L:function(x){ return 2 * l3(x); }, R:function(){ return 4; }, v:{ ymin:-3, ymax:6 } },
    { dom:[[0, Infinity, false]], sol:[9], L:function(x){ return l3(x); }, R:function(){ return 2; }, v:{ ymin:-3, ymax:6 } },
    { dom:[[-Infinity, Infinity]], sol:[9], L:function(x){ return x; }, R:function(){ return 9; }, v:{ ymin:-12, ymax:14 } }] },
  C:{ lines:[
    { dom:[[SQ5, Infinity, false]], sol:[5], L:function(x){ return x > 0 ? l2(x * x - 5) : NaN; }, R:function(x){ return 2 + l2(x); }, v:{ ymin:-4, ymax:7 } },
    { dom:[[SQ5, Infinity, false]], sol:[5], L:function(x){ return l2(x * x - 5) - l2(x); }, R:function(){ return 2; }, v:{ ymin:-4, ymax:6 } },
    { dom:[[-SQ5, 0, false, false], [SQ5, Infinity, false]], sol:[-1, 5], L:function(x){ return l2((x * x - 5) / x); }, R:function(){ return 2; }, v:{ ymin:-4, ymax:6 } },
    { dom:[[-Infinity, 0, false], [0, Infinity, false]], sol:[-1, 5], L:function(x){ return (x * x - 5) / x; }, R:function(){ return 4; }, v:{ ymin:-10, ymax:12 } }] },
  D:{ lines:[
    { dom:[[0, Infinity, false]], sol:[5], L:function(x){ return 2 * l4(x); }, R:function(x){ return l4(2 * x + 15); }, v:{ ymin:-3, ymax:4 } },
    { dom:[[0, Infinity, false]], sol:[5], L:function(x){ return 2 * l4(x); }, R:function(x){ return l4(2 * x + 15); }, v:{ ymin:-3, ymax:4 } },
    { dom:[[-7.5, 0, false, false], [0, Infinity, false]], sol:[-3, 5], L:function(x){ return x ? l4(x * x) : NaN; }, R:function(x){ return l4(2 * x + 15); }, v:{ ymin:-3, ymax:4 } },
    { dom:[[-Infinity, Infinity]], sol:[-3, 5], L:function(x){ return x * x; }, R:function(x){ return 2 * x + 15; }, v:{ ymin:-10, ymax:40 } }] }
};
function inDom(dom, x){ return dom.some(function(d){ return x > d[0] && x < d[1]; }); }
function stripDraw(p, chain, line, prevLine, rev){
  var a = chain.strip[0], b = chain.strip[1], pad = (b - a) * 0.04;
  p.draw({ view:{ xmin:a - pad, xmax:b + pad, ymin:-1, ymax:1 }, grid:false, axes:false, ticks:false, describe:p.c.getAttribute("aria-label"), after:function(ctx){
    var ink = css("--ink"), ink2 = css("--ink-2"), cy = p.H * 0.6, X0 = p.X(a - pad), X1 = p.X(b + pad);
    ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(X0, cy); ctx.lineTo(X1, cy); ctx.stroke(); ctx.restore();
    line.dom.forEach(function(d){
      var xa = p.X(Math.max(d[0], a - pad)), xb = p.X(Math.min(d[1], b + pad));
      ctx.fillStyle = css("--sheet"); ctx.fillRect(xa, cy - 3, xb - xa, 6); ctx.fillStyle = ink; ctx.fillRect(xa, cy - 1.5, xb - xa, 3);
      [d[0], d[1]].forEach(function(z){ if (isFinite(z) && z >= a - pad && z <= b + pad) { ctx.beginPath(); ctx.arc(p.X(z), cy, 4, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = ink; ctx.stroke(); } });
    });
    var span = b - a, step = span > 16 ? 4 : 2, small = p.W < 300;
    ctx.font = "11px " + (css("--font-ui") || "sans-serif"); ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (var t = Math.ceil(a); t <= b; t++) { var X = p.X(t); ctx.strokeStyle = ink2; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X, cy - 3); ctx.lineTo(X, cy + 3); ctx.stroke(); if (t % (small ? step * 2 : step) === 0) ctx.fillText(num(t), X, cy + 7); }
    var r = rev == null ? 1 : rev;
    line.sol.forEach(function(x){
      var gained = prevLine && prevLine.sol.indexOf(x) < 0, X = p.X(x), dy = gained ? 0 : (prevLine ? -14 * (1 - r) : 0);
      ctx.save(); ctx.globalAlpha = gained ? r : Math.max(0.15, r);
      if (gained) { ctx.beginPath(); ctx.arc(X, cy + dy, 11 * Math.min(1, r * 1.3), 0, Math.PI * 2); ctx.fillStyle = css("--hi"); ctx.fill(); }
      ctx.beginPath(); ctx.arc(X, cy + dy, 5.5, 0, Math.PI * 2); ctx.fillStyle = ink; ctx.fill();
      ctx.restore();
      uiText(ctx, num(x) + (gained ? " gained" : ""), X, cy - 15, { weight:700, color:ink, bg:true, alpha:gained ? r : 1, size:11.5 });
    });
    if (prevLine) prevLine.sol.forEach(function(x){
      if (line.sol.indexOf(x) >= 0) return;
      var X = p.X(x);
      ctx.save(); ctx.globalAlpha = r; ctx.beginPath(); ctx.arc(X, cy, 5.5, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke(); ctx.restore();
      uiText(ctx, num(x) + " lost ✗", X, cy - 15, { weight:700, color:css("--red"), bg:true, alpha:r, size:11.5 });
    });
  } });
}
function part3(host, api){
  var C = api.content, S = api.S, CH = C.chains;
  if (!S.chain) S.chain = "A";
  S.calls = S.calls || {}; S.rev = S.rev || {}; S.right = S.right || {};
  CH.forEach(function(c){ S.calls[c.id] = S.calls[c.id] || [null, null, null]; S.rev[c.id] = S.rev[c.id] || [false, false, false]; S.right[c.id] = S.right[c.id] || [null, null, null]; });
  var view = { anim:{}, graph:null, gt:1, from:null };
  host.innerHTML = '<div class="ra"><div class="ra-chains"></div><p class="ra-tally" aria-live="polite"></p><div class="ra-gwrap" hidden><p class="ra-gcap"></p><canvas class="plot ra-plot" role="img" aria-label="Graph of the chosen line"></canvas></div><ol class="ra-list"></ol><div class="ra-note"></div></div>';
  var chRG = radios($(".ra-chains", host), { options:CH.map(function(c){ return { id:c.id, t:c.name + ' <span class="ra-sub">(' + c.sub + ")</span>" }; }), value:S.chain, cls:"chips", aria:"Chain", onChange:function(v){ S.chain = v; view.graph = null; api.save(); paint(); } });
  void chRG;
  var gplot = new MV.Plot($(".ra-plot", host), { xmin:-5, xmax:5, ymin:-5, ymax:5 }), strips = [];
  function chain(){ return CH.filter(function(c){ return c.id === S.chain; })[0]; }
  function tally(){ var r = 0, n = 0; CH.forEach(function(c){ S.right[c.id].forEach(function(x){ if (x != null) n++; if (x === true) r++; }); }); return { r:r, n:n, total:12 }; }
  gplot.render = function(){
    var ch = chain(), gi = view.graph; if (gi == null) return;
    var A = AUD[ch.id], ln = A.lines[gi], from = view.from != null ? A.lines[view.from] : null, t = view.gt;
    var v = { xmin:ch.strip[0], xmax:ch.strip[1], ymin:from ? lerp(from.v.ymin, ln.v.ymin, t) : ln.v.ymin, ymax:from ? lerp(from.v.ymax, ln.v.ymax, t) : ln.v.ymax };
    var curves = [], pts = [];
    [[ln, t], [from, 1 - t]].forEach(function(pr){
      var L = pr[0], al = pr[1]; if (!L || al <= 0.01) return;
      pieces(L.L, function(x){ return isFinite(L.L(x)); }, v.xmin, v.xmax).forEach(function(q){ curves.push({ pts:q, color:css("--pen"), width:3, alpha:al }); });
      pieces(L.R, function(x){ return isFinite(L.R(x)); }, v.xmin, v.xmax).forEach(function(q){ curves.push({ pts:q, color:css("--f3"), width:2.6, alpha:al }); });
      L.sol.forEach(function(x){ pts.push({ x:x, y:L.R(x), al:al }); });
    });
    gplot.draw({ view:v, curves:curves, describe:"Graph of L" + (gi + 1) + " of " + ch.name + ": left side in blue, right side in teal, crossings at x = " + ln.sol.map(function(x){ return num(x); }).join(" and ") + ".", after:function(ctx){
      pts.forEach(function(q){ ctx.save(); ctx.globalAlpha = q.al; gplot.point({ x:q.x, y:q.y, r:6.5, open:true, color:css("--ink"), ring:true }); ctx.restore(); });
    } });
  };
  function paint(){
    var ch = chain(), A = AUD[ch.id], calls = S.calls[ch.id], rev = S.rev[ch.id], ta = tally();
    $(".ra-tally", host).innerHTML = fill(C.tally, { r:ta.r, n:ta.total });
    var h = "";
    ch.lines.forEach(function(ln, i){
      var shown = i === 0 || rev[i - 1];
      h += '<li class="ra-line"><div class="ra-l"><span class="ra-n">L' + (i + 1) + '</span><span class="ra-eq">' + ln.eq + '</span><span class="ra-dom">' + ln.dom + '</span><button type="button" class="btn ghost sm ra-gb" data-gl="' + i + '" data-k="ragl' + i + '"' + (view.graph === i ? ' aria-pressed="true"' : ' aria-pressed="false"') + ">" + C.graphBtn + "</button></div>" +
        '<div class="ra-s">' + (shown ? '<canvas class="ra-strip" data-strip="' + i + '" role="img" aria-label="Solution strip for L' + (i + 1) + ': solutions ' + MV.esc(ln.sol) + "; domain " + MV.esc(MV.plain(ln.dom)) + '"></canvas><span class="vh">L' + (i + 1) + " solutions: " + ln.sol + ". Domain: " + MV.plain(ln.dom) + "</span>" : '<p class="ra-hide tiny muted">Reveal the step above to see this strip.</p>') + "</div></li>";
      if (i < ch.steps.length) {
        var stp = ch.steps[i], can = i === 0 || rev[i - 1], done = rev[i];
        h += '<li class="ra-step"><div class="ra-arrow" aria-hidden="true">↓</div><div class="ra-sbody"><p class="ra-sname"><strong>' + stp.name + '</strong></p><div class="ra-calls" role="group" aria-label="' + MV.esc(MV.plain(stp.name)) + ': keeps, gains or loses?">' +
          C.calls.map(function(c){ var on = calls[i] === c.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-call="' + c.id + '" data-si="' + i + '" data-k="rac' + i + c.id + '" aria-pressed="' + on + '"' + (!can || done ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") +
          '</div>' + (done ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-rev="' + i + '" data-k="rarev' + i + '"' + (!can || !calls[i] ? " disabled" : "") + ">" + C.revealBtn + "</button></div>");
        if (done) {
          var ans = MV.ans(stp), good = calls[i] === ans, lab = C.calls.filter(function(c){ return c.id === ans; })[0].t, fb = "";
          if (!good) {
            if (ans === "keeps") fb = stp.keep === "conv" ? C.wrongFb.keepsConv : stp.keep === "drop" ? C.wrongFb.keepsDrop : C.wrongFb.keepsSame;
            else fb = fill(C.wrongFb[ans], { old:ch.lines[i].ineq, "new":ch.lines[i + 1].ineq, v:stp.v });
          }
          h += '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p><strong>' + (good ? "✓ " : "✗ ") + lab + ".</strong> " + stp.reason + "</p>" + (good ? "" : "<p>" + fb + "</p>") + "</div>";
        }
        h += "</div></li>";
      }
    });
    MV.keepFocus($(".ra-list", host), function(){ $(".ra-list", host).innerHTML = h; });
    $(".ra-note", host).innerHTML = rev[2] ? '<div class="refresh"><h4>' + ch.name + "</h4><p>" + ch.note + "</p></div>" : "";
    strips = [];
    host.querySelectorAll("canvas.ra-strip").forEach(function(cv){
      var i = +cv.dataset.strip, p = new MV.Plot(cv, { xmin:0, xmax:1, ymin:-1, ymax:1 });
      p.render = function(){ var a = view.anim[ch.id + i]; stripDraw(p, ch, A.lines[i], i > 0 ? A.lines[i - 1] : null, a == null ? 1 : a); };
      p.render(); strips.push(p);
    });
    var gw = $(".ra-gwrap", host);
    gw.hidden = view.graph == null;
    if (view.graph != null) { $(".ra-gcap", host).innerHTML = "<strong>L" + (view.graph + 1) + ":</strong> " + ch.lines[view.graph].eq; gplot.render(); }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var ch = chain(), d = b.dataset;
    if (d.call) { S.calls[ch.id][+d.si] = d.call; api.save(); paint(); return; }
    if (d.rev != null) {
      var i = +d.rev, stp = ch.steps[i];
      S.rev[ch.id][i] = true; S.right[ch.id][i] = S.calls[ch.id][i] === MV.ans(stp); api.save();
      view.anim[ch.id + (i + 1)] = 0; paint();
      var key = ch.id + (i + 1);
      MV.tween({ dur:700, step:function(t){ view.anim[key] = t; strips.forEach(function(p){ p.render(); }); }, done:function(){ delete view.anim[key]; strips.forEach(function(p){ p.render(); }); } });
      MV.focusFb($(".ra-list", host).children[2 * i + 1]);
      return;
    }
    if (d.gl != null) {
      var gi = +d.gl;
      if (view.graph === gi) { view.graph = null; paint(); return; }
      view.from = view.graph; view.graph = gi; view.gt = view.from == null ? 1 : 0; paint();
      if (view.from != null) MV.tween({ dur:700, step:function(t){ view.gt = t; gplot.render(); }, done:function(){ view.from = null; view.gt = 1; gplot.render(); } });
      var gw = $(".ra-gwrap", host); if (gw.scrollIntoView && !MV.reduceMotion) { var r = gw.getBoundingClientRect(); if (r.top < 60) gw.scrollIntoView({ block:"nearest", behavior:"smooth" }); }
    }
  });
  paint();
  return { tally:tally };
}

// ---------- Practice: solution-set entry ----------
// @component N4 solutionSet — one item at a time: a solution set in up to three number boxes (+ adds a box, − removes one)
//   with a "No solution" toggle, or a labelled pair of boxes, or one box; fractions and negatives, a decimal only if exactly
//   equal; the set is checked as a whole (order ignored), named wrong sets / values get their feedback, three-level hints,
//   first-try scoring (right on the first Check, without the worked solution)
function solutionSet(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var msgs = {};
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { vals:it.kind === "pair" ? ["", ""] : [""], none:false, tries:0, hint:0, solved:false, first:null }); }
  function box(it, x, i, label){
    return '<label class="ss-box">' + (label ? '<span class="ss-lab">' + label + "</span>" : "") + '<input class="numin ss-in" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-ss="' + i + '" data-k="ss' + it.id + i + '" aria-label="' + MV.esc(label ? MV.plain(label) : "Solution " + (i + 1)) + '" value="' + MV.esc(x.vals[i] || "") + '"' + (x.solved || x.none ? " disabled" : "") + ">" + (it.unit ? '<span class="ss-unit">' + it.unit + "</span>" : "") + "</label>";
  }
  function paint(){
    var it = a.items[S.i], x = ist(it);
    var h = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted">Problem ' + (S.i + 1) + " of " + a.items.length + (it.tag ? " · " + it.tag : "") + '</span><span class="dots" aria-hidden="true">' +
      a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<p class="ss-q">' + (it.kind === "set" && a.id === "solve" ? "Solve " + it.prompt + "." : it.prompt) + "</p>";
    if (it.kind === "set") {
      h += '<div class="ss-row"><span class="ss-x">' + m("x =") + "</span>" + x.vals.map(function(_, i){ return box(it, x, i); }).join('<span class="ss-or">or</span>') + "</div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="add" data-k="ssadd" aria-label="Add another box"' + (x.vals.length >= 3 || x.none ? " disabled" : "") + ">" + a.add + '</button><button type="button" class="btn ghost sm" data-act="less" data-k="ssless" aria-label="Remove the last box"' + (x.vals.length <= 1 || x.none ? " disabled" : "") + ">" + a.less + '</button><button type="button" class="chip ss-none' + (x.none ? " on" : "") + '" data-act="none" data-k="ssnone" aria-pressed="' + x.none + '">' + a.noSol + "</button></div>";
    } else if (it.kind === "pair") h += '<div class="ss-row">' + box(it, x, 0, it.labels[0]) + box(it, x, 1, it.labels[1]) + "</div>";
    else h += '<div class="ss-row">' + box(it, x, 0, it.unit ? "" : "") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="sschk">Check</button>' + MV.hintBtn("ssh" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="prev" data-k="ssprev"' + (S.i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-act="next" data-k="ssnext"' + (S.i === a.items.length - 1 ? " disabled" : "") + ">Next</button></div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  function eqv(u, v, tol){ return Math.abs(u - v) <= (tol || 1e-9) * Math.max(1, Math.abs(v)); }
  function sameSet(xs, ys, tol){ if (xs.length !== ys.length) return false; return xs.every(function(u){ return ys.some(function(v){ return eqv(u, v, tol); }); }) && ys.every(function(v){ return xs.some(function(u){ return eqv(u, v, tol); }); }); }
  function listTxt(vs){ return vs.map(function(v){ var q = toQ(v); return q ? qt(q) : num(v, 4); }).join(", "); }
  function judge(it, x){
    var raw = x.vals.map(function(s){ return String(s || "").trim(); }), vals = [];
    if (it.kind === "set" && x.none) {
      if (MV.ans(it) === "none") return { ok:true };
      var nw = (it.wrong || []).filter(function(w){ return w.none; })[0];
      return { fb:nw ? nw.fb : fill(a.fallback, { list:a.noSol }) };
    }
    for (var i = 0; i < raw.length; i++) {
      if (!raw[i]) { if (it.kind === "set") continue; return { soft:"Fill in both boxes first." }; }
      var r = MV.parseNum(raw[i]); if (!r || r.length !== 1) return { soft:"Enter one number in each box, such as −3, 3/4 or 20." };
      vals.push(r[0]);
    }
    if (!vals.length) return { soft:"Enter a solution, or press " + a.noSol + "." };
    var ans = MV.ans(it);
    if (it.kind === "set") {
      var u = []; vals.forEach(function(v){ if (!u.some(function(w){ return eqv(w, v, 1e-9); })) u.push(v); });
      if (ans !== "none" && sameSet(u, ans)) return { ok:true };
      var named = (it.wrong || []).filter(function(w){ return w.match && sameSet(u, w.match, w.tol || 1e-6); })[0];
      return { fb:named ? named.fb : fill(a.fallback, { list:listTxt(u) }) };
    }
    if (it.kind === "pair") {
      if (eqv(vals[0], ans[0]) && eqv(vals[1], ans[1])) return { ok:true };
      var wp = (it.wrongPair || []).filter(function(w){ return eqv(vals[0], w.match[0], 1e-6) && eqv(vals[1], w.match[1], 1e-6); })[0];
      if (wp) return { fb:wp.fb };
      if (!eqv(vals[0], ans[0])) { var wa = (it.wrongA || []).filter(function(w){ return eqv(vals[0], w.match, 1e-6); })[0]; if (wa) return { fb:wa.fb }; }
      else { var wb = (it.wrongB || []).filter(function(w){ return eqv(vals[1], w.match, 1e-6); })[0]; if (wb) return { fb:wb.fb }; }
      return { fb:fill(a.fallbackOne, { list:listTxt(vals) }) };
    }
    if (eqv(vals[0], ans)) return { ok:true };
    var w1 = (it.wrong || []).filter(function(w){ return eqv(vals[0], w.match, w.tol || 1e-6); })[0];
    return { fb:w1 ? w1.fb : fill(a.fallbackOne, { list:listTxt(vals) }) };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || t.dataset.ss == null) return; var it = a.items[S.i]; ist(it).vals[+t.dataset.ss] = t.value; msgs[it.id] = null; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.ss != null) { e.preventDefault(); var b = host.querySelector('[data-act="check"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = ist(it), act = b.dataset.act;
    if (act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (act === "add") { if (x.vals.length < 3) x.vals.push(""); api.save(); paint(); var ins = host.querySelectorAll(".ss-in"); if (ins.length) ins[ins.length - 1].focus(); return; }
    if (act === "less") { if (x.vals.length > 1) x.vals.pop(); api.save(); paint(); return; }
    if (act === "none") { x.none = !x.none; msgs[it.id] = null; api.save(); paint(); return; }
    if (act === "prev" || act === "next") { S.i = clamp(S.i + (act === "prev" ? -1 : 1), 0, a.items.length - 1); api.save(); paint(); return; }
    if (act === "check") {
      var r = judge(it, x);
      if (r.soft) msgs[it.id] = r.soft;
      else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = (/^Not quite/.test(r.fb) ? "<strong>✗</strong> " : "<strong>✗ Not quite.</strong> ") + r.fb + " Try again."; }
      api.save(); paint(); MV.focusFb(host);
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Six apart ----------
var task = (function(){
  var api, gv, KEYS = ["p", "q", "m"], LIM = { p:[-8, 8], q:[-8, 8], m:[1, 7] };
  function read(){
    var s = api ? api.S : {}, v = KEYS.map(function(k){ var r = MV.parseNum(s[k]); return r && r.length === 1 ? r[0] : NaN; });
    var d = { p:v[0], q:v[1], m:v[2] };
    d.ok = KEYS.every(function(k){ return Number.isInteger(d[k]) && d[k] >= LIM[k][0] && d[k] <= LIM[k][1]; });
    return d;
  }
  function info(d){
    var D = (d.p - d.q) * (d.p - d.q) + Math.pow(2, d.m + 2), r = Math.round(Math.sqrt(D)), sq = r * r === D, P = -(d.p + d.q);
    return { D:D, sq:sq, rt:r, s:(P + Math.sqrt(D)) / 2, r:(P - Math.sqrt(D)) / 2, intS:sq && Math.abs(P + r) % 2 === 0 };
  }
  function gapTxt(I){ if (I.sq) return num(I.rt); var sp = sqPart(I.D); return (sp[0] === 1 ? "" : sp[0]) + "√" + sp[1] + " ≈ " + num(Math.sqrt(I.D), 2); }
  function solTxt(d){ var cs = buildCands({ tpl:"sum", b:2, p:d.p, q:d.q, m:d.m }), s = cs.filter(function(c){ return c.real; })[0]; return s ? m(s.src) : "—"; }
  function draw(){
    var d = read();
    if (!d.ok) { gv.draw(buildSpec({ tpl:"sum", b:2, p:0, q:-2, m:3 }, { describe:"Enter p, q and m to see your equation." })); return; }
    var B = { tpl:"sum", b:2, p:d.p, q:d.q, m:d.m }, I = info(d), cs = buildCands(B), v = bView(B);
    var xmin = Math.min(v.xmin, Math.floor(I.r) - 2), xmax = Math.max(v.xmax, Math.ceil(I.s) + 2);
    B.view = { xmin:xmin, xmax:xmax, ymin:Math.min(-4, d.m - 2), ymax:Math.max(6, d.m + 2) };
    gv.draw(buildSpec(B, { bracket:{ a:I.r, b:I.s, txt:"gap " + gapTxt(I) }, describe:"Graph of " + MV.plain(m(bEqSrc(B))) + ". " + cs.map(function(c){ return MV.plain(m(c.src)) + (c.real ? ", the solution" : ", extraneous"); }).join("; ") + ". Gap " + gapTxt(I) + "." }));
  }
  function preview(){
    var d = read(), el = $("#sa-eq"); if (!el) return;
    el.innerHTML = d.ok ? m(bEqSrc({ tpl:"sum", b:2, p:d.p, q:d.q, m:d.m })) : '<span class="muted">Enter whole numbers for ' + m("p") + ", " + m("q") + " and " + m("m") + ".</span>";
  }
  return {
    render:function(inp, pv, A){
      api = A; var S = A.S;
      if (S.p == null) S.p = "0"; if (S.q == null) S.q = "-2"; if (S.m == null) S.m = "3";
      inp.innerHTML = '<p class="eq-cap sa-eq" id="sa-eq" aria-live="polite"></p><p class="tiny muted sa-base">Base: 2 (fixed)</p><div class="inrow sa-row">' + KEYS.map(function(k){
        return '<label for="sa-' + k + '"><span>' + m(k) + '</span><span class="sa-box"><button type="button" class="btn ghost sm" data-dk="' + k + '" data-d="-1" aria-label="Decrease ' + k + '">' + MINUS + '</button><input id="sa-' + k + '" data-sa="' + k + '" type="number" step="1" min="' + LIM[k][0] + '" max="' + LIM[k][1] + '" value="' + MV.esc(S[k]) + '"><button type="button" class="btn ghost sm" data-dk="' + k + '" data-d="1" aria-label="Increase ' + k + '">+</button></span></label>';
      }).join("") + "</div>";
      pv.innerHTML = '<div class="lg-pic"><div class="plot-wrap"><canvas class="plot" id="sa-plot" role="img" aria-label="Graph of your equation"></canvas></div><canvas class="lg-lanes" id="sa-lanes" role="img" aria-label="Argument lanes for your equation"></canvas></div>';
      gv = gateView($("#sa-plot"), $("#sa-lanes"));
      function upd(){ A.save(); preview(); draw(); A.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset.sa; if (!k) return; S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-dk]"); if (!b) return; var k = b.dataset.dk, r = MV.parseNum(S[k]), v = r && r.length === 1 ? Math.round(r[0]) : 0; v = clamp(v + (+b.dataset.d), LIM[k][0], LIM[k][1]); S[k] = String(v); $("#sa-" + k).value = v; upd(); });
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var ts = MV.taskState(), fb = $("#task-fb .fb.good");
        if (fb && ts.found.length >= 4 && !fb.querySelector(".sa-all")) fb.insertAdjacentHTML("beforeend", '<p class="sa-all">' + MV.C.task.allFound + "</p>");
      }, 0); });
      preview(); draw();
    },
    read:read,
    valid:function(d){ return d.ok ? true : "Enter whole numbers: " + m("p") + " and " + m("q") + " from −8 to 8, and " + m("m") + " from 1 to 7."; },
    checks:function(d){ if (!d.ok) return [false, false, false]; var I = info(d); return [I.intS, I.s < -1e-9, I.D === 36]; },
    tips:function(d, c){
      var T = MV.C.task.tips, I = info(d), out = [];
      if (!c[0]) out.push(fill(T[0], { s:solTxt(d) }));
      if (!c[1]) out.push(fill(T[1], { s:solTxt(d) }));
      if (!c[2]) out.push(fill(T[2], { g:gapTxt(I) }));
      return out;
    },
    key:function(d){ return [Math.min(d.p, d.q), Math.max(d.p, d.q), d.m].join(","); },
    label:function(k){ var p = k.split(",").map(Number); return m(bEqSrc({ tpl:"sum", b:2, p:p[0], q:p[1], m:p[2] })); },
    text:function(k){ var p = k.split(",").map(Number); return "p = " + num(p[0]) + ", q = " + num(p[1]) + ", m = " + num(p[2]); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ solve:solutionSet, beyond:solutionSet },
  task:task,
  summaryLines:function(){
    var ex = (MV.S.app && MV.S.app.explore) || {}, gp = ex.gp || {}, ks = Object.keys(gp), r = ks.filter(function(k){ return gp[k].right; }).length;
    var p3 = (MV.S.app && MV.S.app.part3) || {}, rr = 0;
    Object.keys(p3.right || {}).forEach(function(c){ (p3.right[c] || []).forEach(function(x){ if (x === true) rr++; }); });
    return [fill(MV.C.explore.gateSummary, { r:r, n:ks.length }), fill(MV.C.part3.summaryLine, { r:rr, n:12 })];
  }
});
})();
