// MHF4U 37 Inverse of Exponential Functions: hero (twins across y = x), swap machine (Explore), form translator (Part 3),
// twin-graph number boxes (Practice 2) and the "Land it in the window" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS, RM = MV.reduceMotion;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function LIN(t){ return t; }
function def(o, d){ Object.keys(d).forEach(function(k){ if (o[k] === undefined) o[k] = JSON.parse(JSON.stringify(d[k])); }); return o; }

// ---------- exact rationals [n, d] ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function Q(n, d){ if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return [n / g, d / g]; }
function qpow(q, k){ return k >= 0 ? Q(Math.pow(q[0], k), Math.pow(q[1], k)) : Q(Math.pow(q[1], -k), Math.pow(q[0], -k)); }
function qv(q){ return q[0] / q[1]; }
function qs(q){ return (q[0] < 0 ? MINUS : "") + Math.abs(q[0]) + (q[1] === 1 ? "" : "/" + q[1]); }
function isq(n){ var r = Math.round(Math.sqrt(n)); return r * r === n ? r : -1; }
// a value as an exact fraction when its denominator is small, else 2 decimal places with a flag
function fracOf(v){ for (var d = 1; d <= 1024; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9 * Math.max(1, Math.abs(v))) return qs(Q(n, d)); } return null; }
function coordTxt(x, y){ var a = fracOf(x), b = fracOf(y); return (a && b ? "" : "≈ ") + "(" + (a || num(x, 2)) + ", " + (b || num(y, 2)) + ")"; }

// ---------- canvas helpers ----------
// @component G11 canvasMath — canvas text with ^{…} superscripts and _{…} subscripts in the math font (single letters italic,
// words such as "log" upright), optional sheet-coloured backing; returns the width drawn
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
  var x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  ctx.save(); ctx.textBaseline = "middle"; ctx.textAlign = "left";
  if (o.bg !== false) { ctx.globalAlpha = 0.85; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, y - F * 0.8, w + 6, F * 1.6); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink");
  segs.forEach(function(sg){ ctx.font = font(sg); ctx.fillText(sg.t, x0, y + (sg.lv === 1 ? -F * 0.38 : sg.lv === -1 ? F * 0.3 : 0)); x0 += sg.w; });
  ctx.restore();
  return w;
}
// label beside a point, pushed away from y = x (up-left above the line, down-right below it), kept inside the canvas
function ptLabel(p, x, y, text, o){
  o = o || {};
  var X = p.X(x), Y = p.Y(y), above = o.side ? o.side > 0 : y >= x, F = o.size || 13;
  var ctx = p.ctx; ctx.font = "600 " + F + "px " + (css("--font-math") || "serif");
  var w = ctx.measureText(text.replace(/[\^_{}]/g, "")).width + 8;
  var g = o.gap || 9, lx = above ? X - g : X + g, ly = above ? Y - g - 4 : Y + g + 5, al = above ? "right" : "left";
  if (al === "right" && lx - w < 2) { al = "left"; lx = X + g; }
  if (al === "left" && lx + w > p.W - 2) { al = "right"; lx = X - g; }
  ly = clamp(ly, F, p.H - F);
  cmath(ctx, text, lx, ly, { size:F, align:al, color:o.color });
}
// @component G11 edgeArrow — a small arrow at the window edge pointing toward a point that lies off the graph
function edgeArrow(p, x, y, color){
  var X = p.X(x), Y = p.Y(y);
  if (X >= -2 && X <= p.W + 2 && Y >= -2 && Y <= p.H + 2) return false;
  var cx = clamp(X, 18, p.W - 18), cy = clamp(Y, 18, p.H - 18), dx = X - cx, dy = Y - cy, L = Math.hypot(dx, dy) || 1;
  dx /= L; dy /= L;
  var ctx = p.ctx, tx = cx + dx * 9, ty = cy + dy * 9, a = Math.atan2(dy, dx);
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.2; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(cx - dx * 7, cy - dy * 7); ctx.lineTo(tx, ty); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx + dx * 4, ty + dy * 4); ctx.lineTo(tx - 7 * Math.cos(a - 0.55), ty - 7 * Math.sin(a - 0.55)); ctx.lineTo(tx - 7 * Math.cos(a + 0.55), ty - 7 * Math.sin(a + 0.55)); ctx.closePath(); ctx.fill();
  ctx.restore(); return true;
}
function inView(p, x, y){ var X = p.X(x), Y = p.Y(y); return X >= -2 && X <= p.W + 2 && Y >= -2 && Y <= p.H + 2; }
// @component G11 mirrorSeg — dotted segment from a point to its twin across y = x, a 6 px right-angle square and a --hi
// midpoint dot; s (0…1) grows it from the point to the midpoint, then on to the twin
function mirrorSeg(p, a, b, s, o){
  o = o || {}; if (s == null) s = 1; if (s <= 0) return;
  var ctx = p.ctx, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  var e = s < 0.5 ? [lerp(a[0], mx, s * 2), lerp(a[1], my, s * 2)] : [lerp(mx, b[0], s * 2 - 1), lerp(my, b[1], s * 2 - 1)];
  var col = o.color || css("--ink-2");
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.setLineDash([2, 4]); ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(p.X(a[0]), p.Y(a[1])); ctx.lineTo(p.X(e[0]), p.Y(e[1])); ctx.stroke(); ctx.setLineDash([]);
  var MX = p.X(mx), MY = p.Y(my), vx = p.X(a[0]) - MX, vy = p.Y(a[1]) - MY, vl = Math.hypot(vx, vy);
  if (s >= 0.5 && vl > 9) {
    vx /= vl; vy /= vl;
    var ux = Math.SQRT1_2, uy = -Math.SQRT1_2;
    if (ux * vx + uy * vy > 0.5) { ux = -ux; uy = -uy; }
    ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(MX + 6 * ux, MY + 6 * uy); ctx.lineTo(MX + 6 * ux + 6 * vx, MY + 6 * uy + 6 * vy); ctx.lineTo(MX + 6 * vx, MY + 6 * vy); ctx.stroke();
    ctx.fillStyle = css("--hi"); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(MX, MY, 3.6, 0, 6.3); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}
function yxLine(p){
  var v = p.v, lo = Math.max(v.xmin, v.ymin), hi = Math.min(v.xmax, v.ymax);
  p.segment({ x1:lo, y1:lo, x2:hi, y2:hi, color:css("--ink-2"), width:1.5, dash:[2, 5] });
  var t = lo + (hi - lo) * 0.82;
  cmath(p.ctx, "y = x", Math.min(p.X(t) + 8, p.W - 44), p.Y(t) + 12, { size:13, color:css("--ink-2") });
}
// dense parameter samples of y = b^x and of its swap (b^t, t), covering every window used in this module
function curvePts(b, kind){
  var lb = Math.log(b), lo = -6, hi = 11, out = [], N = 1500;
  if (Math.abs(lb) < 1e-9) { for (var j = 0; j <= 400; j++) { var s = -60 + j * 0.3; out.push(kind === "exp" ? [s, 1] : [1, s]); } return out; }
  var t1 = Math.log(1e-4) / lb, t2 = Math.log(80) / lb;
  lo = Math.max(-3000, Math.min(lo, t1, t2)); hi = Math.min(3000, Math.max(hi, t1, t2));
  for (var i = 0; i <= N; i++) { var t = lo + (hi - lo) * i / N, y = Math.exp(t * lb); out.push(kind === "exp" ? [t, y] : [y, t]); }
  return out;
}
function foldPt(x, y, c){ return [(1 + c) / 2 * x + (1 - c) / 2 * y, (1 - c) / 2 * x + (1 + c) / 2 * y]; }
function evenTicks(p){ return function(t){ return p.W < 480 && Math.round(t) % 2 ? "" : num(t); }; }

// @component radioGroup (from MHF4U 25/32) — segmented control or chip row as a real radio group (arrow keys, roving tabindex, lock)
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
// @component N9 stepSlider (from MHF4U 32) — slider over a list of positions with 40 px − / + buttons and a formatted value;
// here also Shift + arrow for big steps (o.big)
function stepSlider(host, o){
  host.innerHTML = '<div class="wt-sl" style="--sc:var(' + o.color + ')"><div class="wt-sl-top"><label for="sl37-' + o.id + '">' + o.label + '</label><output id="sl37-' + o.id + '-o" for="sl37-' + o.id + '"></output></div>' +
    '<div class="wt-sl-row"><button type="button" class="btn ghost wt-pm" data-pm="-1" data-k="' + o.id + 'm" aria-label="Decrease ' + o.name + '">' + MINUS + '</button><input type="range" id="sl37-' + o.id + '" min="0" max="' + (o.n - 1) + '" step="1">' +
    '<button type="button" class="btn ghost wt-pm" data-pm="1" data-k="' + o.id + 'p" aria-label="Increase ' + o.name + '">+</button></div></div>';
  var inp = host.querySelector("input"), out = host.querySelector("output"), btns = host.querySelectorAll("[data-pm]"), cur = o.idx, locked = false;
  function paint(){
    inp.value = cur; out.innerHTML = o.fmt(cur); inp.setAttribute("aria-valuetext", o.say(cur));
    inp.disabled = locked; btns[0].disabled = locked || cur <= 0; btns[1].disabled = locked || cur >= o.n - 1;
  }
  function go(i, how){ i = clamp(i, 0, o.n - 1); if (i === cur) { paint(); return; } cur = i; paint(); o.onChange(cur, how); }
  inp.addEventListener("input", function(){ cur = +inp.value; paint(); o.onChange(cur, "drag"); });
  inp.addEventListener("keydown", function(e){
    if (o.big && e.shiftKey && /^Arrow/.test(e.key)) { e.preventDefault(); if (!locked) go(cur + ((e.key === "ArrowRight" || e.key === "ArrowUp") ? o.big : -o.big), "key"); }
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pm]"); if (!b || b.disabled) return; go(cur + +b.dataset.pm, "step"); });
  paint();
  return { set:function(i){ cur = i; paint(); }, lock:function(b){ locked = !!b; paint(); }, get:function(){ return cur; } };
}

// ---------- the module's bases and points ----------
var BASES = [[1, 5], [1, 4], [1, 3], [1, 2], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]], B2 = 5, B1 = 4;
var XS = [-3, -2, -1, 0, 1, 2, 3];
var EV = { xmin:-4, xmax:9, ymin:-4, ymax:9 };
function bval(i){ return BASES[i][0] / BASES[i][1]; }
function bS(i){ return qs(BASES[i]); }
function powSrc(i, e, plain){ var b = plain ? bS(i) : "@b{" + bS(i) + "}"; return (BASES[i][1] === 1 ? b : "(" + b + ")") + "^{" + e + "}"; }
function logSrc(i, plain){ return "log_{" + (plain ? bS(i) : "@b{" + bS(i) + "}") + "}"; }
function argSrc(s){ return /\//.test(s) || s.charAt(0) === MINUS ? "(" + s + ")" : " " + s; }
// P = (p, b^p) with p in tenths: exact when b^p is a whole number or a fraction, else 3 significant figures
function pAt(bi, p10){
  var b = BASES[bi], q = null;
  if (b[0] === b[1]) q = [1, 1];
  else if (p10 % 10 === 0) q = qpow(b, p10 / 10);
  else if (p10 % 5 === 0) { var rn = isq(b[0]), rd = isq(b[1]); if (rn > 0 && rd > 0) q = qpow([rn, rd], p10 / 5); }
  var p = p10 / 10, v = q ? qv(q) : Math.pow(bval(bi), p), ps = num(p, 1), ys = q ? qs(q) : v.toPrecision(3);
  var onLine = Math.abs(v - p) < 1e-12;
  if (onLine) ys = ps;
  return { q:q, v:v, p:p, ps:ps, ys:ys, exact:!!q, onLine:onLine };
}

// ---------- hero: twins across y = x (storyboard in the plan) ----------
function hero(f){
  var p = new MV.Plot(f.canvas, EV, { equal:true });
  var PTS = [[3, 8, "8"], [2, 4, "4"], [1, 2, "2"], [0, 1, "1"], [-1, 0.5, "1/2"]];
  var CAPS = ["`@b{2}^3 = 8 ⟺ log_{@b{2}} 8 = 3`", "`@b{2}^2 = 4 ⟺ log_{@b{2}} 4 = 2`", "`@b{2}^1 = 2 ⟺ log_{@b{2}} 2 = 1`", "`@b{2}^0 = 1 ⟺ log_{@b{2}} 1 = 0`", "`@b{2}^{-1} = 1/2 ⟺ log_{@b{2}}(1/2) = -1`"];
  var FINAL = "Same numbers, swapped: `y = @b{2}^x` and `y = log_{@b{2}} x`";
  var H = RM ? { yx:1, ex:1, k:5, s:1, lg:1, asy:1 } : { yx:0, ex:0, k:0, s:0, lg:0, asy:0 };
  var EXP = curvePts(2, "exp"), LOG = curvePts(2, "log");
  function cap(s){ f.cap.innerHTML = MV.md(s); }
  p.render = function(){
    p.draw({ view:EV, equal:true, xTicks:{ step:1, fmt:evenTicks(p) }, yTicks:{ step:1, fmt:evenTicks(p) },
      describe:"Graph of y = 2ˣ and its inverse y = log₂ x, mirror images in the line y = x. Twin points: (3, 8) and (8, 3), (2, 4) and (4, 2), (1, 2) and (2, 1), (0, 1) and (1, 0), (−1, 1/2) and (1/2, −1).",
      after:function(ctx){
        var K = { ink2:css("--ink-2"), pen:css("--pen"), f3:css("--f3") };
        if (H.asy > 0) {
          ctx.save(); ctx.globalAlpha = H.asy;
          p.segment({ x1:EV.xmin - 1, y1:0, x2:EV.xmax + 1, y2:0, color:K.ink2, width:1.5, dash:[8, 6] });
          p.segment({ x1:0, y1:EV.ymin - 1, x2:0, y2:EV.ymax + 1, color:K.ink2, width:1.5, dash:[8, 6] });
          ctx.restore();
          cmath(ctx, "y = 0", p.X(-3.9), p.Y(0) - 12, { size:13, color:K.ink2, weight:400 });
          cmath(ctx, "x = 0", p.X(0) + 6, p.Y(-3.6), { size:13, color:K.ink2, weight:400 });
        }
        if (H.yx > 0) { var e = EV.xmin + (EV.xmax - EV.xmin) * H.yx; p.segment({ x1:EV.xmin, y1:EV.xmin, x2:e, y2:e, color:K.ink2, width:1.5, dash:[2, 5] }); if (H.yx >= 1) cmath(ctx, "y = x", Math.min(p.X(6.7) + 8, p.W - 44), p.Y(6.7) + 12, { size:13, color:K.ink2 }); }
        if (H.ex > 0) {
          var xe = EV.xmin + (EV.xmax - EV.xmin + 0.5) * H.ex;
          p.curve({ pts:EXP.filter(function(q){ return q[0] <= xe; }), color:K.pen, width:3, arrows:H.ex >= 1 });
          PTS.forEach(function(q){ if (q[0] <= xe) p.point({ x:q[0], y:q[1], r:4.5, color:K.pen }); });
        }
        if (H.lg > 0) p.curve({ pts:LOG.slice(0, Math.max(2, Math.round(LOG.length * H.lg))), color:K.f3, width:2.6, arrows:H.lg >= 1 });
        for (var i = 0; i < Math.min(H.k + 1, 5); i++) {
          var s = i < H.k ? 1 : H.s; if (s <= 0) continue;
          mirrorSeg(p, [PTS[i][0], PTS[i][1]], [PTS[i][1], PTS[i][0]], s);
          if (s >= 1) p.point({ x:PTS[i][1], y:PTS[i][0], r:4.5, color:K.f3 });
        }
      } });
  };
  if (RM) { cap(FINAL); p.render(); return; }
  cap("");
  p.render();
  function twin(i){
    if (i >= 5) { MV.tween({ dur:1200, ease:LIN, step:function(t){ H.lg = t; p.render(); }, done:function(){ MV.tween({ dur:500, step:function(t){ H.asy = t; p.render(); }, done:function(){ cap(FINAL); } }); } }); return; }
    H.k = i; H.s = 0;
    MV.tween({ dur:400, ease:LIN, step:function(t){ H.s = t; p.render(); }, done:function(){ cap(CAPS[i]); MV.wait(650, function(){ H.k = i + 1; H.s = 0; twin(i + 1); }); } });
  }
  MV.wait(400, function(){
    MV.tween({ dur:500, ease:LIN, step:function(t){ H.yx = t; p.render(); }, done:function(){
      MV.tween({ dur:1200, ease:LIN, step:function(t){ H.ex = t; p.render(); }, done:function(){ MV.wait(400, function(){ twin(0); }); } });
    } });
  });
}

// ---------- Explore: the swap machine ----------
function explore(host, api){
  var S = def(api.S, { bi:B2, mode:"swap", sw:[false, false, false, false, false, false, false], ord:[], sorted:false, folded:false, pi:40,
    show:{ yx:true, asy:true, mir:true, lab:false }, pv:"graph", tc3open:false });
  var A = { b:null, fold:null, rows:{}, guide:null, curve:null, asyX:null, pulse:-1, hiAsy:false, hiPts:false, p2arrow:false, ghost2:false,
    vlt:null, vltLit:false, snap:null, fade:0, pred:null, focusRow:6, swipe:false, cancel:[], raf:0 };
  host.innerHTML = '<div class="ix" id="ix"><div class="ix-pv" id="ix-pv"></div>' +
    '<div class="ix-left"><p class="eq-cap ix-cap" id="ix-cap" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap ix-gwrap" data-mv="graph"><canvas class="plot square" id="ix-plot" tabindex="0" role="img" aria-label="Swap machine graph"></canvas></div>' +
    '<p class="tiny muted ix-keys" id="ix-keys"></p><div class="ix-ctl" id="ix-ctl"></div></div>' +
    '<div class="ix-right"><div class="ix-tblbox" id="ix-tbl"></div><div class="ix-read"><h4 class="ix-rh">Readout</h4><dl class="read" id="ix-read" aria-live="polite"></dl></div></div></div>';
  var ix = $("#ix"), cv = $("#ix-plot"), plot = new MV.Plot(cv, EV, { equal:true });
  $("#ix-ctl").innerHTML = '<div class="ix-row ix-modes" id="ix-mode"></div><div class="ix-base" id="ix-base"></div>' +
    '<div class="ix-row ix-swaponly"><button type="button" class="btn ghost sm" data-ixa="all" data-k="ixall">Swap all</button><button type="button" class="btn ghost sm" data-ixa="none" data-k="ixnone">Unswap all</button><button type="button" class="btn ghost sm" data-ixa="sort" data-k="ixsort" id="ix-sort">Sort by <i>x</i></button></div>' +
    '<div class="ix-probeonly"><div class="ix-row"><button type="button" class="btn primary sm" id="ix-fold" data-ixa="fold" data-k="ixfold"></button></div><div id="ix-psl"></div></div>' +
    '<div class="ix-row ix-show" id="ix-show" role="group" aria-label="Show on the graph"></div>' +
    '<div class="ix-row"><button type="button" class="btn ghost sm" data-ixa="reset" data-k="ixreset">Reset</button></div>' +
    '<p class="ix-locknote" id="ix-locknote" hidden></p>';
  ix.dataset.pv = S.pv;
  var pv = radios($("#ix-pv"), { aria:"Show the graph or the table", options:[{ id:"graph", t:"Graph" }, { id:"table", t:"Table" }], value:S.pv,
    onChange:function(v){ S.pv = v; ix.dataset.pv = v; api.save(); if (v === "graph") draw(); } });
  var modeRG = radios($("#ix-mode"), { label:"Mode", options:[{ id:"swap", t:"Swap rows" }, { id:"probe", t:"Fold and probe" }], value:S.mode,
    onChange:function(v){ touch(); S.mode = v; changed(); } });
  var baseSl = stepSlider($("#ix-base"), { id:"b", name:"base b", color:"--p-b", n:9, idx:S.bi, label:"Base " + m("@b{b}"),
    fmt:function(i){ return m("@b{b} = @b{" + bS(i) + "}"); }, say:function(i){ return "b = " + bS(i); },
    onChange:function(i){ touch(); setBase(i); } });
  var probeSl = stepSlider($("#ix-psl"), { id:"p", name:"the x-coordinate of P", color:"--ink", n:61, idx:S.pi, big:10, label:m("x") + "-coordinate of " + m("P"),
    fmt:function(i){ return m("p = " + num((i - 30) / 10, 1)); }, say:function(i){ return "p = " + num((i - 30) / 10, 1); },
    onChange:function(i){ touch(); setProbe(i); } });

  function save(){ api.save(); }
  function changed(){ save(); render(); MV.changed(); }
  function count(){ return S.sw.filter(Boolean).length; }
  function locked(){ return !!S.tc3open; }
  function busy(){ return !!A.pred; }
  function invShown(){ if (locked()) return false; return S.mode === "probe" ? S.folded : count() === 7; }
  function lastRow(){ for (var k = S.ord.length - 1; k >= 0; k--) if (S.sw[S.ord[k]]) return S.ord[k]; return -1; }
  function track(c){ A.cancel.push(c); return c; }
  function stopAll(){
    A.cancel.forEach(function(c){ try { c(); } catch (e) {} }); A.cancel = [];
    A.b = null; A.fold = null; A.rows = {}; A.guide = null; A.curve = null; A.asyX = null; A.snap = null; A.fade = 0;
    stopPulse();
  }
  // any student action clears the prediction-only marks
  function touch(){ A.hiAsy = A.hiPts = A.p2arrow = A.ghost2 = A.vltLit = false; A.vlt = null; stopPulse(); }
  function stopPulse(){ A.pulse = -1; if (A.raf) cancelAnimationFrame(A.raf); A.raf = 0; }
  function startPulse(i){
    stopPulse(); A.pulse = i;
    if (RM) { draw(); return; }
    (function loop(){ draw(); A.raf = requestAnimationFrame(loop); })();
  }

  // ----- state changes -----
  function setBase(i){
    var from = A.b != null ? A.b : bval(S.bi); S.bi = i; save(); render(); MV.changed();
    track(MV.tween({ dur:400, step:function(t){ A.b = lerp(from, bval(i), t); draw(); }, done:function(){ A.b = null; draw(); } }));
  }
  function setProbe(i){
    i = clamp(i, 0, 60); if (i === S.pi) return;
    S.pi = i; save();
    if ((i - 30) % 10 === 0) A.swipe = true;
    probeSl.set(i); render(); MV.changed();
  }
  function foldTo(target, done){
    var from = A.fold != null ? A.fold : (S.folded ? 1 : 0); A.fold = from;
    track(MV.tween({ dur:1600 * Math.abs(target - from), step:function(t){ A.fold = lerp(from, target, t); draw(); },
      done:function(){ A.fold = null; S.folded = target === 1; save(); render(); MV.changed(); if (done) done(); } }));
  }
  function segS(t){ return clamp((t - 0.25) / 0.7, 0, 1); }
  function swapRows(list, done){
    var before = count();
    list.forEach(function(i){ S.sw[i] = true; S.ord = S.ord.filter(function(k){ return k !== i; }).concat([i]); A.rows[i] = 0; });
    save(); render(list); MV.changed();
    track(MV.tween({ dur:1300, ease:LIN, step:function(t){ list.forEach(function(i){ A.rows[i] = t; }); draw(); }, done:function(){
      list.forEach(function(i){ delete A.rows[i]; });
      var n = count();
      if (before < 3 && n >= 3 && n < 7) track(MV.tween({ dur:400, step:function(t){ A.guide = t; draw(); }, done:function(){ A.guide = null; draw(); } }));
      if (n === 7 && before < 7) {
        A.curve = 0; A.asyX = 0;
        track(MV.tween({ dur:1200, ease:LIN, step:function(t){ A.curve = t; draw(); }, done:function(){ A.curve = null;
          track(MV.tween({ dur:500, ease:LIN, step:function(t){ A.asyX = t; draw(); }, done:function(){ A.asyX = null; render(); if (done) done(); } })); } }));
        render(); return;
      }
      render(); if (done) done();
    } }));
  }
  function toggleRow(i){
    if (S.sw[i]) { S.sw[i] = false; S.ord = S.ord.filter(function(k){ return k !== i; }); S.sorted = false; delete A.rows[i]; changed(); return; }
    swapRows([i]);
  }
  function crossfade(apply, dur, done){
    var c = document.createElement("canvas"); c.width = cv.width; c.height = cv.height;
    try { c.getContext("2d").drawImage(cv, 0, 0); A.snap = c; } catch (e) { A.snap = null; }
    apply(); A.fade = 0; render();
    track(MV.tween({ dur:dur, ease:LIN, step:function(t){ A.fade = t; draw(); }, done:function(){ A.snap = null; draw(); if (done) done(); } }));
  }
  function setTc3(open){
    if (busy()) return;
    stopAll(); touch();
    S.tc3open = open;
    if (open) { S.mode = "probe"; S.folded = false; }
    changed();
    if (open) { var g = $(".ix-gwrap"); S.pv = "graph"; ix.dataset.pv = "graph"; pv.set("graph"); if (g && g.scrollIntoView) g.scrollIntoView({ block:"center", behavior:RM ? "auto" : "smooth" }); }
  }
  function afterTc3(){
    if (!S.tc3open) return;
    S.tc3open = false; S.mode = "probe"; S.folded = false; save(); render();
    MV.wait(150, function(){ foldTo(1); });
  }

  // ----- graph -----
  function rings(){
    var out = [], st = MV.S.chal || {};
    if (A.pred) return out;
    if (locked()) return [{ x:8, y:1.5, lab:"(8, 3/2)" }];
    if (!(st.tc2 && st.tc2.solved)) out.push({ x:1 / 16, y:2, lab:"(1/16, 2)" });
    if (st.tc3 && !st.tc3.solved && st.tc3.tries) out.push({ x:8, y:1.5, lab:"(8, 3/2)" });
    return out;
  }
  function draw(){
    plot.draw({ view:EV, equal:true, xTicks:{ step:1, fmt:evenTicks(plot) }, yTicks:{ step:1, fmt:evenTicks(plot) }, describe:describe(), after:scene });
  }
  plot.render = draw;
  function scene(ctx, p){
    var K = { ink:css("--ink"), ink2:css("--ink-2"), pen:css("--pen"), f3:css("--f3"), hi:css("--hi") };
    var b = A.b != null ? A.b : bval(S.bi), one = Math.abs(Math.log(b)) < 1e-6, lock = locked(), probe = S.mode === "probe";
    var ft = probe ? (A.fold != null ? A.fold : (S.folded ? 1 : 0)) : 0, c = Math.cos(Math.PI * ft), n = count(), all = n === 7;
    var EXP = curvePts(b, "exp"), LOG = curvePts(b, "log"), big = b > 1;
    // asymptotes (drawn over the axes)
    if (S.show.asy && !lock && !one) {
      if (A.hiAsy) { var h1 = foldPt(-60, 0, c), h2 = foldPt(60, 0, c); p.segment({ x1:h1[0], y1:h1[1], x2:h2[0], y2:h2[1], color:K.hi, width:7, alpha:0.7 }); }
      p.segment({ x1:EV.xmin - 1, y1:0, x2:EV.xmax + 1, y2:0, color:K.ink2, width:1.5, dash:[8, 6] });
      cmath(ctx, "y = 0", big ? p.X(-3.85) : p.X(8.9), p.Y(0) - 12, { size:13, color:K.ink2, weight:400, align:big ? "left" : "right" });
      var logAsy = probe ? ft > 0 : (all && (A.asyX == null || A.asyX > 0));
      if (logAsy) {
        if (probe && ft < 1) {
          var a1 = foldPt(-60, 0, c), a2 = foldPt(60, 0, c), la = foldPt(big ? -3.4 : 8.4, 0.45, c);
          p.segment({ x1:a1[0], y1:a1[1], x2:a2[0], y2:a2[1], color:K.ink2, width:1.5, dash:[8, 6] });
          cmath(ctx, ft > 0.5 ? "x = 0" : "y = 0", p.X(la[0]), p.Y(la[1]), { size:13, color:K.ink2, weight:400 });
        } else {
          var top = EV.ymax + 1, bot = A.asyX != null && !probe ? top - (top - EV.ymin + 1) * A.asyX : EV.ymin - 1;
          p.segment({ x1:0, y1:top, x2:0, y2:bot, color:K.ink2, width:1.5, dash:[8, 6] });
          if (A.asyX == null || probe) cmath(ctx, "x = 0", p.X(0) + 6, big ? p.Y(-3.5) : p.Y(8.4), { size:13, color:K.ink2, weight:400 });
        }
      }
    }
    if (S.show.yx) yxLine(p);
    if (A.ghost2) p.curve({ pts:curvePts(2, "log"), color:K.f3, width:2, alpha:0.35, dash:[6, 5] });
    // y = b^x (and, in Fold and probe, its image under the fold)
    if (probe && ft > 0 && !lock) {
      p.curve({ pts:EXP, color:K.pen, width:3, alpha:0.5 });
      var moved = EXP.map(function(q){ return foldPt(q[0], q[1], c); });
      if (one && ft >= 1) drawVert(p, K);
      else p.curve({ pts:moved, color:c >= 0 ? K.pen : K.f3, width:c >= 0 ? 3 : 2.6, arrows:ft >= 1 });
    } else p.curve({ pts:EXP, color:K.pen, width:3, arrows:true });
    // Swap rows: the guide and the inverse through the swapped points
    if (!probe && !lock) {
      if (one) { if (n >= 3) { if (all) drawVert(p, K); else p.curve({ pts:LOG, color:K.f3, width:2, dash:[2, 5], alpha:0.6 }); } }
      else if (all) p.curve({ pts:A.curve != null ? LOG.slice(0, Math.max(2, Math.round(LOG.length * A.curve))) : LOG, color:K.f3, width:2.6, arrows:A.curve == null });
      else if (n >= 3) p.curve({ pts:LOG, color:K.f3, width:2, dash:[2, 5], alpha:0.6 * (A.guide != null ? A.guide : 1) });
    }
    // points, twins and mirror segments
    var lr = lastRow(), focused = document.activeElement === cv;
    if (!probe) {
      XS.forEach(function(x, i){
        var y = Math.pow(b, x), Qp = [x, y], Tp = [y, x], sw = S.sw[i] && !lock, an = A.rows[i];
        if (sw) {
          var s = an != null ? segS(an) : 1;
          if (S.show.mir || an != null) mirrorSeg(p, Qp, Tp, s);
          if (s >= 1) { if (inView(p, y, x)) p.point({ x:y, y:x, r:4.5, color:K.f3 }); else edgeArrow(p, y, x, K.f3); }
        }
        var pulse = (A.pulse === i && !RM) ? 2.5 + 2.5 * Math.sin(performance.now() / 160) : (an != null && an < 0.25 ? 4 * Math.sin(an / 0.25 * Math.PI) : 0);
        if (A.pulse === i || (an != null && an < 0.25)) { ctx.save(); ctx.strokeStyle = K.hi; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), 8 + pulse, 0, 6.3); ctx.stroke(); ctx.restore(); }
        if (inView(p, x, y)) p.point({ x:x, y:y, r:4.5, color:K.pen }); else edgeArrow(p, x, y, K.pen);
        if (focused && A.focusRow === i) { ctx.save(); ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); var fx = clamp(p.X(x), 12, p.W - 12), fy = clamp(p.Y(y), 12, p.H - 12); ctx.arc(fx, fy, 12, 0, 6.3); ctx.stroke(); ctx.restore(); }
      });
      if (A.b == null) XS.forEach(function(x, i){
        if (!(S.show.lab || i === lr)) return;
        var q = qpow(BASES[S.bi], x), y = qv(q), sz = i === lr ? 13 : 11;
        if (inView(p, x, y)) ptLabel(p, x, y, "(" + num(x) + ", " + qs(q) + ")", { size:sz, side:y >= x ? 1 : -1 });
        if (S.sw[i] && !lock && A.rows[i] == null && inView(p, y, x)) ptLabel(p, y, x, "(" + qs(q) + ", " + num(x) + ")", { size:sz, side:y >= x ? -1 : 1, color:css("--ink") });
      });
    } else if (!lock) {
      var pp = (S.pi - 30) / 10, py = Math.pow(b, pp), P = [pp, py], P2 = [py, pp];
      if (S.show.mir) mirrorSeg(p, P, P2, 1);
      if (inView(p, py, pp)) { p.point({ x:py, y:pp, r:4.5, color:K.f3 }); ptLabel(p, py, pp, "P′", { side:py >= pp ? -1 : 1 }); } else edgeArrow(p, py, pp, K.f3);
      if (inView(p, pp, py)) { p.point({ x:pp, y:py, r:7, color:K.ink, ring:true }); ptLabel(p, pp, py, "P", { side:py >= pp ? 1 : -1, gap:15 }); } else edgeArrow(p, pp, py, K.ink);
      if (focused) { ctx.save(); ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(clamp(p.X(pp), 14, p.W - 14), clamp(p.Y(py), 14, p.H - 14), 15, 0, 6.3); ctx.stroke(); ctx.restore(); }
    }
    if (A.hiPts && probe) [-3, -2, -1].forEach(function(x){
      var q = foldPt(x, Math.pow(b, x), c);
      p.point({ x:q[0], y:q[1], r:5, color:c >= 0 ? K.pen : K.f3, ring:true });
    });
    if (A.p2arrow) {
      p.annArrow({ from:[1.8, -1.9], to:[0.6, -2.95], color:K.ink });
      cmath(ctx, "as x → 0^{+}, y → −∞", p.X(1.9), p.Y(-1.75), { size:13 });
    }
    rings().forEach(function(r){
      ctx.save(); ctx.strokeStyle = K.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(p.X(r.x), p.Y(r.y), 8, 0, 6.3); ctx.stroke(); ctx.restore();
      cmath(ctx, r.lab, p.X(r.x) + (r.x > 6 ? -13 : 13), p.Y(r.y) - 14, { size:13, align:r.x > 6 ? "right" : "left" });
    });
    if (A.vlt != null || A.vltLit) {
      if (A.vltLit) p.segment({ x1:1, y1:EV.ymin - 1, x2:1, y2:EV.ymax + 1, color:K.hi, width:7, alpha:0.6 });
      if (A.vlt != null) p.segment({ x1:A.vlt, y1:EV.ymin - 1, x2:A.vlt, y2:EV.ymax + 1, color:K.ink, width:1.5, dash:[3, 4] });
      if (A.vltLit) drawVert(p, K);
    }
    if (A.snap) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - A.fade; ctx.drawImage(A.snap, 0, 0); ctx.restore(); }
  }
  function drawVert(p, K){
    p.segment({ x1:1, y1:EV.ymin - 1, x2:1, y2:EV.ymax + 1, color:K.f3, width:2.6, dash:[10, 6] });
    p.label({ x:1, y:8.4, dx:7, text:"x = 1: not a function", color:K.f3, font:"600 13px " + (css("--font-ui") || "sans-serif"), bg:true });
  }
  function describe(){
    var bi = S.bi, one = bi === B1, f = MV.plain(m("y = " + powSrc(bi, "x", true))), g = MV.plain(m("y = " + logSrc(bi, true) + " x"));
    if (locked()) return "Graph of " + f + ", the line y = x and the ringed point (8, 3/2). The inverse is hidden until you check TC3.";
    if (one) return "Graph of the flat line y = 1" + (invShown() ? " and its twin, the vertical line x = 1, which is not a function." : ".");
    var s = "Graph of " + f + (invShown() ? " and its inverse " + g + ", mirror images in the line y = x." : ".");
    if (S.mode === "probe") { var P = pAt(bi, S.pi - 30); return s + " P at (" + P.ps + ", " + P.ys + "), its twin P′ at (" + P.ys + ", " + P.ps + ")."; }
    var tw = XS.map(function(x, i){ return S.sw[i] ? "(" + qs(qpow(BASES[bi], x)) + ", " + num(x) + ")" : null; }).filter(Boolean);
    return s + " " + tw.length + " of 7 rows swapped" + (tw.length ? ": twins at " + tw.join(", ") + "." : ".");
  }

  // ----- caption, table, readout, controls -----
  function capHTML(){
    var bi = S.bi, s = m("y = " + powSrc(bi, "x"));
    if (invShown()) s += " " + m("⟷") + " " + (bi === B1 ? m("x = 1") : m("y = " + logSrc(bi) + " x"));
    return s;
  }
  function paintTable(slide){
    var bi = S.bi, lock = locked(), n = count(), all = n === 7 && !lock, one = bi === B1, swapMode = S.mode === "swap" && !lock && !busy();
    var order = XS.map(function(_, i){ return i; });
    if (S.sorted && all) order.sort(function(a, c){ return Math.pow(bval(bi), XS[a]) - Math.pow(bval(bi), XS[c]); });
    var head = all && !one ? m("y = " + logSrc(bi) + " x") : m("y = " + powSrc(bi, "x"));
    var h = '<div class="tbl-wrap"><table class="vt ix-t"><caption class="vh">Table of values</caption><thead><tr><th scope="col">' + m("x") + '</th><th scope="col">' + head + '</th><th scope="col"><span class="vh">Swap</span></th></tr></thead><tbody>';
    order.forEach(function(i){
      var x = XS[i], q = qpow(BASES[bi], x), y = qv(q), sw = S.sw[i] && !lock, px = sw ? y : x, py = sw ? x : y;
      var off = px < EV.xmin || px > EV.xmax || py < EV.ymin || py > EV.ymax;
      h += '<tr class="' + (sw ? "ix-swr" : "") + '" data-row="' + i + '"><td><span class="ix-v" data-c="0">' + m(sw ? qs(q) : num(x)) + '</span></td><td><span class="ix-v" data-c="1">' + m(sw ? num(x) : qs(q)) + "</span>" +
        (sw ? ' <span class="ix-mk" aria-hidden="true">⇄</span><span class="vh">(swapped)</span>' : "") + (off ? ' <small class="ix-off">off the graph</small>' : "") + "</td>" +
        '<td><button type="button" class="btn ghost sm ix-swb" data-swap="' + i + '" data-k="sw' + i + '" aria-pressed="' + sw + '" aria-label="Swap the row x = ' + num(x) + (sw ? " back" : "") + '"' + (swapMode ? "" : " disabled") + ">Swap</button></td></tr>";
    });
    h += "</tbody></table></div>";
    if (all) h += '<p class="ix-tline">' + (one ? "Every row has " + m("x = 1") + ", with seven different " + m("y") + "-values. This is the vertical line " + m("x = 1") + ", not a function, so there is no log base 1."
      : "This is now a table of " + m("y = " + logSrc(bi) + " x") + ". Its " + m("y") + "-values are exponents.") + "</p>";
    if (S.mode !== "swap" && !lock) h += '<p class="tiny muted ix-tline">Switch to Swap rows to swap the table.</p>';
    var box = $("#ix-tbl");
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    if (slide && !RM) slide.forEach(function(i){
      var tr = box.querySelector('tr[data-row="' + i + '"]'); if (!tr) return;
      var a = tr.querySelector('[data-c="0"]'), c = tr.querySelector('[data-c="1"]'), d = c.getBoundingClientRect().left - a.getBoundingClientRect().left;
      track(MV.tween({ dur:600, step:function(t){ a.style.transform = "translateX(" + (d * (1 - t)) + "px)"; c.style.transform = "translateX(" + (-d * (1 - t)) + "px)"; }, done:function(){ a.style.transform = c.style.transform = ""; } }));
    });
  }
  function readRows(){
    var bi = S.bi, one = bi === B1, lock = locked(), R = [], big = bval(bi) > 1;
    var F = m("y = " + powSrc(bi, "x")), G = m("y = " + logSrc(bi) + " x");
    R.push(["Function", F]);
    R.push(["Inverse", one ? "Swap: " + m("x = " + powSrc(bi, "y")) + ". Every power of 1 is 1, so this is the vertical line " + m("x = 1") + ". It isn’t a function, so there is no logarithm with base 1."
      : "Swap: " + m("x = " + powSrc(bi, "y")) + ". Name the exponent: " + G]);
    R.push(["Direction", one ? m("y = 1^x") + " is flat: " + m("y = 1") + " for every " + m("x") + "." : big ? "Both graphs rise from left to right (" + m("@b{b} > 1") + ")." : "Both graphs fall from left to right (" + m("0 < @b{b} < 1") + ")."]);
    if (!lock) {
      var p10 = S.mode === "probe" ? S.pi - 30 : (lastRow() >= 0 ? XS[lastRow()] * 10 : null);
      var lp = m("P") + " on " + F, lp2 = one ? m("P′") + " on the line " + m("x = 1") : m("P′") + " on " + G;
      if (p10 == null) { R.push([lp, "No row swapped yet."]); R.push([lp2, "—"]); R.push(["Two ways to say it", "—"]); R.push(["Mirror check", "—"]); }
      else {
        var P = pAt(bi, p10), eq = P.exact ? " = " : " ≈ ";
        R.push([lp, m("P" + eq + "(" + P.ps + ", " + P.ys + ")")]);
        R.push([lp2, one ? m("P′ = (1, " + P.ps + ")") : m("P′" + eq + "(" + P.ys + ", " + P.ps + ")")]);
        R.push(["Two ways to say it", one ? m("1^p = 1") + " for every " + m("p") + ", so there is no log base 1." : m(powSrc(bi, P.ps) + eq + P.ys) + " and " + m(logSrc(bi) + argSrc(P.ys) + eq + P.ps), "two"]);
        var mid = (P.p + P.v) / 2, mexact = P.exact && Math.abs(mid * 100 - Math.round(mid * 100)) < 1e-9;
        var mc;
        if (P.onLine) mc = one ? m("P = (1, 1)") + " is on " + m("y = x") + ", so it is its own twin." : m("P = (" + P.ps + ", " + P.ys + ")") + " is on the line " + m("y = x") + ", so it is its own twin: " + m(powSrc(bi, P.ps) + " = " + P.ys) + " and " + m(logSrc(bi) + argSrc(P.ys) + " = " + P.ps) + ".";
        else mc = "The segment " + m("PP′") + " crosses " + m("y = x") + " at a right angle, at its midpoint " + (mexact ? "" : "≈ ") + m("(" + num(mid, 2) + ", " + num(mid, 2) + ")") + ".";
        R.push(["Mirror check", mc]);
      }
    }
    R.push(["Asymptotes", one ? "None: these are straight lines." : F + ": " + m("y = 0") + " (horizontal). " + G + ": " + m("x = 0") + " (vertical)."]);
    R.push(["Domain and range", one ? m("y = 1") + " has domain " + m("{x ∈ ℝ}") + " and range " + m("{1}") + "; its twin " + m("x = 1") + " is not a function."
      : F + ": domain " + m("{x ∈ ℝ}") + ", range " + m("{y ∈ ℝ | y > 0}") + ". " + G + ": domain " + m("{x ∈ ℝ | x > 0}") + ", range " + m("{y ∈ ℝ}") + ". They swap."]);
    if (S.mode === "swap" && !lock) {
      var n = count();
      R.push(["Table", n < 7 ? n + " of 7 rows swapped" : one ? "All 7 rows swapped: every row has " + m("x = 1") + ", so this is the line " + m("x = 1") + ", not a function." : "All 7 rows swapped: this is now a table of " + G + "."]);
    }
    return R;
  }
  function paintRead(){
    var R = readRows();
    $("#ix-read").innerHTML = R.map(function(r){ return "<div" + (r[2] ? ' data-r="' + r[2] + '"' : "") + "><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    if (A.swipe) { A.swipe = false; var d = $('#ix-read [data-r="two"] dd'); if (d && !RM) { d.classList.add("ix-swipe"); setTimeout(function(){ d.classList.remove("ix-swipe"); }, 450); } }
  }
  function paintCtl(){
    var b = busy(), lock = locked();
    ix.classList.toggle("ix-tc3", lock); ix.classList.toggle("ix-probe", S.mode === "probe"); ix.classList.toggle("ix-swapm", S.mode === "swap");
    modeRG.set(S.mode); modeRG.lock(b);
    baseSl.set(S.bi); baseSl.lock(b); probeSl.set(S.pi); probeSl.lock(b || lock);
    var fold = $("#ix-fold"); fold.innerHTML = S.folded ? "Unfold" : "Fold across " + m("y = x"); fold.disabled = b || A.fold != null; fold.setAttribute("aria-pressed", S.folded);
    $$("[data-ixa]", $("#ix-ctl")).forEach(function(x){ if (x.id !== "ix-fold") x.disabled = b; });
    $("#ix-sort").hidden = count() < 7;
    var sh = $("#ix-show");
    MV.keepFocus(sh, function(){ sh.innerHTML = [["yx", "Line " + m("y = x")], ["asy", "Asymptotes"], ["mir", "Mirror segments"], ["lab", "Show all labels"]].map(function(t){
      return '<button type="button" class="btn ghost sm ix-tog" data-tog="' + t[0] + '" data-k="tog' + t[0] + '" aria-pressed="' + !!S.show[t[0]] + '"' + (b ? " disabled" : "") + ">" + t[1] + "</button>"; }).join(""); });
    var note = $("#ix-locknote"); note.hidden = !lock;
    if (lock) note.innerHTML = "<strong>TC3 is open.</strong> Only " + m("y = @b{b}^x") + ", the line " + m("y = x") + ", the ring and the base slider are showing. Set the base, then press <strong>Check challenge</strong> in TC3.";
    $("#ix-keys").innerHTML = lock ? "" : S.mode === "swap" ? "Tap a dot or a Swap button to swap its row. Keyboard: focus the graph, choose a point with the arrow keys, then press Enter."
      : "Drag " + m("P") + " along the curve, or use the slider. Keyboard: focus the graph and use the arrow keys (Shift for steps of 1, Home and End for the ends).";
    cv.style.touchAction = S.mode === "probe" && !lock ? "none" : "pan-y";
  }
  function render(slide){
    $("#ix-cap").innerHTML = capHTML();
    paintTable(slide); paintRead(); paintCtl(); draw();
  }

  // ----- events -----
  $("#ix-ctl").addEventListener("click", function(e){
    var t = e.target.closest("button"); if (!t || t.disabled || busy()) return;
    if (t.dataset.tog) { S.show[t.dataset.tog] = !S.show[t.dataset.tog]; save(); paintCtl(); draw(); return; }
    var a = t.dataset.ixa; if (!a) return;
    touch();
    if (a === "fold") { if (locked()) return; foldTo(S.folded ? 0 : 1); paintCtl(); }
    else if (a === "all") { var todo = XS.map(function(_, i){ return i; }).filter(function(i){ return !S.sw[i]; }); if (todo.length) swapRows(todo); }
    else if (a === "none") { S.sw = S.sw.map(function(){ return false; }); S.ord = []; S.sorted = false; A.rows = {}; changed(); }
    else if (a === "sort") { S.sorted = true; changed(); }
    else if (a === "reset") { stopAll(); S.bi = B2; S.mode = "swap"; S.sw = S.sw.map(function(){ return false; }); S.ord = []; S.sorted = false; S.folded = false; S.pi = 40; S.tc3open = false; changed(); }
  });
  $("#ix-tbl").addEventListener("click", function(e){
    var t = e.target.closest("[data-swap]"); if (!t || t.disabled || busy() || locked() || S.mode !== "swap") return;
    touch(); toggleRow(+t.dataset.swap);
  });
  function local(e){ var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function hitRow(px, py){
    var best = -1, bd = 16, b = bval(S.bi);
    XS.forEach(function(x, i){
      var y = Math.pow(b, x), d = Math.hypot(plot.X(x) - px, plot.Y(y) - py);
      if (S.sw[i]) d = Math.min(d, Math.hypot(plot.X(y) - px, plot.Y(x) - py));
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }
  function nearProbe(px, py){
    var best = { i:S.pi, d:1e9 }, b = bval(S.bi);
    for (var i = 0; i <= 60; i++) { var x = (i - 30) / 10, d = Math.hypot(plot.X(x) - px, clamp(plot.Y(Math.pow(b, x)), -40, plot.H + 40) - py); if (d < best.d) best = { i:i, d:d }; }
    return best;
  }
  var dragging = false;
  cv.addEventListener("pointerdown", function(e){
    if (busy() || locked()) return;
    var q = local(e);
    if (S.mode === "swap") { var i = hitRow(q[0], q[1]); if (i >= 0) { e.preventDefault(); touch(); A.focusRow = i; toggleRow(i); } return; }
    var k = nearProbe(q[0], q[1]); if (k.d > 34) return;
    e.preventDefault(); dragging = true; try { cv.setPointerCapture(e.pointerId); } catch (err) {}
    touch(); setProbe(k.i);
  });
  cv.addEventListener("pointermove", function(e){ if (!dragging) return; var q = local(e); setProbe(nearProbe(q[0], q[1]).i); });
  function endDrag(){ dragging = false; }
  cv.addEventListener("pointerup", endDrag); cv.addEventListener("pointercancel", endDrag);
  cv.addEventListener("focus", draw); cv.addEventListener("blur", draw);
  cv.addEventListener("keydown", function(e){
    if (busy() || locked()) return;
    var k = e.key, dir = (k === "ArrowRight" || k === "ArrowUp") ? 1 : (k === "ArrowLeft" || k === "ArrowDown") ? -1 : 0;
    if (S.mode === "probe") {
      if (dir) { e.preventDefault(); touch(); setProbe(S.pi + dir * (e.shiftKey ? 10 : 1)); }
      else if (k === "Home" || k === "End") { e.preventDefault(); touch(); setProbe(k === "Home" ? 0 : 60); }
      return;
    }
    if (dir) { e.preventDefault(); A.focusRow = (A.focusRow + dir + 7) % 7; draw(); }
    else if (k === "Enter" || k === " ") { e.preventDefault(); touch(); toggleRow(A.focusRow); }
  });
  // TC3 "commit first": an Open button inside the challenge card (the toolkit repaints the card, so re-add it each time)
  function injectTc3(){
    var box = document.querySelector('#chal [data-c="tc3"] .q-actions'); if (!box || box.querySelector("[data-tc3]")) return;
    var st = MV.S.chal.tc3 || {}; if (st.solved || st.tries) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "btn ghost sm"; b.dataset.tc3 = "1"; b.dataset.k = "tc3open";
    b.textContent = S.tc3open ? "Close (show everything again)" : "Open this challenge (hide the inverse)"; b.setAttribute("aria-pressed", S.tc3open ? "true" : "false");
    box.insertBefore(b, box.firstChild);
  }
  var chalHost = $("#chal");
  if (chalHost) {
    new MutationObserver(injectTc3).observe(chalHost, { childList:true });
    chalHost.addEventListener("click", function(e){
      var b = e.target.closest("[data-tc3]"); if (!b) return;
      setTc3(!S.tc3open);
      var nb = document.querySelector('#chal [data-tc3]'); if (nb) { nb.textContent = S.tc3open ? "Close (show everything again)" : "Open this challenge (hide the inverse)"; nb.setAttribute("aria-pressed", S.tc3open ? "true" : "false"); }
    });
  }
  render();

  // ----- predictions -----
  function startPred(p){
    stopAll(); touch(); A.pred = p.id; S.tc3open = false;
    S.bi = B2; S.pi = 40; S.pv = "graph"; ix.dataset.pv = "graph"; pv.set("graph");
    if (p.id === "p1") { S.mode = "swap"; S.sw = S.sw.map(function(){ return false; }); S.ord = []; S.sorted = false; S.folded = false; }
    else { S.mode = "probe"; S.folded = p.id !== "p2"; if (p.id === "p2") { A.hiAsy = true; A.hiPts = true; } }
    save(); render();
    if (p.id === "p1") startPulse(6);
  }
  function runPred(p, done){
    var fin = function(){ A.pred = null; save(); render(); MV.changed(); done(); };
    if (p.id === "p1") { stopPulse(); swapRows([6], function(){ MV.wait(300, fin); }); }
    else if (p.id === "p2") foldTo(1, function(){ A.p2arrow = true; draw(); MV.wait(500, fin); });
    else if (p.id === "p3") {
      A.ghost2 = true; draw();
      MV.wait(500, function(){
        crossfade(function(){ S.bi = 3; S.folded = false; }, 600, function(){
          MV.wait(250, function(){ foldTo(1, function(){
            S.pi = 0; render();
            track(MV.tween({ dur:2400, ease:LIN, step:function(t){ var i = Math.round(60 * t); if (i !== S.pi) { S.pi = i; probeSl.set(i); paintRead(); draw(); } }, done:function(){ S.pi = 60; MV.wait(300, fin); } }));
          }); });
        });
      });
    }
    else if (p.id === "p4") {
      track(MV.tween({ dur:1800, ease:LIN, step:function(t){ A.b = lerp(2, 1, t); draw(); }, done:function(){
        A.b = null; S.bi = B1; render();
        A.vlt = EV.xmin;
        track(MV.tween({ dur:1600, ease:LIN, step:function(t){ A.vlt = lerp(EV.xmin, EV.xmax, t); if (A.vlt >= 1) A.vltLit = true; draw(); }, done:function(){ A.vlt = null; A.vltLit = true; draw(); MV.wait(300, fin); } }));
      } }));
    }
    else fin();
  }

  // ----- challenges -----
  function chal(id, opt){
    var bi = S.bi, live = opt && opt.live, M = function(s){ return { ok:false, msg:MV.md(s) }; };
    if (id === "tc1") {
      if (S.mode !== "probe") return M("Switch to Fold and probe to use `P`.");
      if (bi !== B2) return M("Keep `b = 2` for this challenge.");
      var p10 = S.pi - 30;
      if (p10 === -30) return { ok:true };
      if (p10 === 30) return M("Your twin is (8, 3): `log_{2} 8 = 3`. You need `x = 1/8`, a fraction, and that takes a <strong>negative</strong> exponent.");
      if (p10 === -10 || p10 === -20) return M("Right direction: numbers between 0 and 1 have negative logs here. Your twin is at `x = " + (p10 === -10 ? "1/2" : "1/4") + "`. Each step of 1 to the left halves the `x`-value again.");
      var P = pAt(bi, p10);
      return M("Your twin is at " + (P.exact ? "" : "≈ ") + "(" + P.ys + ", " + P.ps + "). Its `x`-coordinate needs to be 1/8 = 0.125.");
    }
    if (id === "tc2") {
      if (bi === 1) return { ok:true };
      var T2 = { 7:"Your curve passes through (1/16, −2), because `4^{-2} = 1/16`. You need the exponent +2, so the base itself must be a fraction.",
        3:"Your curve passes through (1/16, 4), because `(1/2)^4 = 1/16`. The exponent must be 2, so you need a base whose <strong>square</strong> is 1/16.",
        5:"Your curve passes through (1/16, −4): wrong sign and wrong size.",
        2:"Close to the ring, but not through it. `(1/3)^2 = 1/9`, so your curve reaches height 2 at `x = 1/9`, a little right of 1/16. You need a base whose square is exactly 1/16.",
        0:"Close to the ring, but not through it. `(1/5)^2 = 1/25`, so your curve reaches height 2 at `x = 1/25`, a little left of 1/16. You need a base whose square is exactly 1/16.",
        4:"There’s no log curve with base 1. Look at the vertical line." };
      return M(T2[bi] || "Write the target as an exponential statement: `b^2 = 1/16`.");
    }
    if (id === "tc3") {
      if (live) return { ok:false };
      var r = bi === 7 ? { ok:true } : M(({ 5:"Your curve passes through (8, 3): `log_{2} 8 = 3`, twice what you need. A bigger base reaches 8 with a smaller exponent.",
        6:"`3^{3/2} = 3√3 ≈ 5.2`, short of 8, so your curve is above the ring at `x = 8` (`log_{3} 8 ≈ 1.89`). Try a bigger base.",
        8:"`5^{3/2} = 5√5 ≈ 11.2`, past 8, so your curve is below the ring (`log_{5} 8 ≈ 1.29`). Try a smaller base.",
        1:"Your curve passes through (8, −3/2): right size, wrong sign. Base 1/4 reaches 8 only with a negative exponent: `(1/4)^{-3/2} = 8`.",
        3:"Your curve passes through (8, −3): `(1/2)^{-3} = 8`.",
        4:"There’s no log with base 1." })[bi] || "With a base below 1, a positive exponent gives a number below 1, never 8. So at `x = 8` your curve is below the `x`-axis, nowhere near the ring. Translate `log_{b} 8 = 3/2` into exponential form.");
      MV.wait(30, afterTc3);
      return r;
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:chal };
}

// ---------- Part 3: the form translator ----------
var ROLE = { base:"base", exp:"exponent", res:"result" };
var SLOTN = { exp:{ base:"base", exp:"exponent", res:"result" }, log:{ base:"base", res:"number inside the log", exp:"value of the log" } };
// @component statementBuilder — exponential "▢^▢ = ▢" and log "log_▢ ▢ = ▢" templates with three role tiles (base, exponent,
// result): tap a tile, then a slot (keyboard: Enter, Escape), FLIP travel on curved paths (arrows that stay 2 s with reduced
// motion), and a check that names the misplaced pair (base ⟷ result, base ⟷ exponent, exponent ⟷ result) or all three
function tplHTML(form, slot){
  if (form === "exp") return '<span class="tr-st tr-exp">' + slot("base") + '<span class="tr-sup">' + slot("exp") + '</span><span class="tr-op">=</span>' + slot("res") + "</span>";
  return '<span class="tr-st tr-log"><span class="tr-lw">log</span><span class="tr-sub">' + slot("base") + "</span>" + slot("res") + '<span class="tr-op">=</span>' + slot("exp") + "</span>";
}
function tileInner(val, role, show){ return '<span class="tr-tv">' + m(show && role === "base" ? "@b{" + val + "}" : val) + "</span>" + (show ? "<small>" + ROLE[role] + "</small>" : ""); }
function tileSpan(id, val, role, show, extra){ return '<span class="tr-tile' + (show ? " tr-r-" + role : "") + (extra || "") + '" data-tid="' + id + '">' + tileInner(val, role, show) + "</span>"; }
function rects(board){ var o = {}; $$("[data-tid]", board).forEach(function(el){ o[el.dataset.tid] = el.getBoundingClientRect(); }); return o; }
function flip(board, before, dur){
  var arrows = [];
  $$("[data-tid]", board).forEach(function(el){
    var b0 = before[el.dataset.tid]; if (!b0) return;
    var b1 = el.getBoundingClientRect(), dx = b0.left - b1.left, dy = b0.top - b1.top;
    if (Math.abs(dx) + Math.abs(dy) < 2) return;
    if (RM) { arrows.push([b0, b1]); return; }
    var L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, bend = Math.min(46, L * 0.3);
    el.style.transform = "translate(" + dx + "px," + dy + "px)"; el.classList.add("tr-moving");
    MV.tween({ dur:dur, step:function(t){ var u = 1 - t, a = Math.sin(Math.PI * t) * bend; el.style.transform = "translate(" + (dx * u + nx * a) + "px," + (dy * u + ny * a) + "px)"; },
      done:function(){ el.style.transform = ""; el.classList.remove("tr-moving"); } });
  });
  if (!arrows.length) return;
  var br = board.getBoundingClientRect(), NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "tr-arrows"); svg.setAttribute("width", br.width); svg.setAttribute("height", br.height); svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = '<defs><marker id="tr-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>' +
    arrows.map(function(a){ var x1 = a[0].left + a[0].width / 2 - br.left, y1 = a[0].top + a[0].height / 2 - br.top, x2 = a[1].left + a[1].width / 2 - br.left, y2 = a[1].top + a[1].height / 2 - br.top;
      return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#tr-ah)"/>'; }).join("");
  board.appendChild(svg);
  setTimeout(function(){ svg.remove(); }, 2000);
}
function bnum(s){ var r = MV.parseNum(String(s).replace(MINUS, "-")); return r ? r[0] : NaN; }
// @component G9+G11 twinScene — equal-scale mini-graph: y = b^x (pen) and y = log_b x (teal) or any f/g pair, y = x, twin pairs
// with mirror segments and labels (edge arrows when off the window), rings, guide lines and highlighted gridlines
function twinScene(p, o){
  var K = { ink:css("--ink"), ink2:css("--ink-2"), pen:css("--pen"), f3:css("--f3"), hi:css("--hi") }, ctx = p.ctx;
  (o.grid || []).forEach(function(g){ if (g.x != null) p.segment({ x1:g.x, y1:p.v.ymin, x2:g.x, y2:p.v.ymax, color:K.hi, width:2.5 }); else p.segment({ x1:p.v.xmin, y1:g.y, x2:p.v.xmax, y2:g.y, color:K.hi, width:2.5 }); });
  yxLine(p);
  (o.faint || []).forEach(function(b){ p.curve({ pts:curvePts(b, "log"), color:K.ink2, width:2, alpha:0.35 }); });
  if (o.b && Math.abs(Math.log(o.b)) > 1e-9) { p.curve({ pts:curvePts(o.b, "exp"), color:K.pen, width:3, arrows:true }); if (!o.noLog) p.curve({ pts:curvePts(o.b, "log"), color:K.f3, width:2.6 }); }
  if (o.f) p.curve({ f:o.f, color:K.pen, width:3, arrows:true });
  if (o.g) p.curve({ f:o.g, color:K.f3, width:2.6 });
  (o.lines || []).forEach(function(l){ if (l.x != null) p.segment({ x1:l.x, y1:p.v.ymin - 1, x2:l.x, y2:p.v.ymax + 1, color:K.ink, width:1.5 }); else p.segment({ x1:p.v.xmin - 1, y1:l.y, x2:p.v.xmax + 1, y2:l.y, color:K.ink, width:1.5 }); });
  (o.rings || []).forEach(function(r){ ctx.save(); ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.X(r[0]), p.Y(r[1]), 7, 0, 6.3); ctx.stroke(); ctx.restore(); });
  (o.pairs || []).forEach(function(pr){
    var a = pr.a, b = [pr.a[1], pr.a[0]];
    mirrorSeg(p, a, b, pr.s == null ? 1 : pr.s);
    if (pr.s == null || pr.s >= 1) { if (inView(p, b[0], b[1])) p.point({ x:b[0], y:b[1], r:5, color:K.f3 }); else edgeArrow(p, b[0], b[1], K.f3); }
    if (inView(p, a[0], a[1])) p.point({ x:a[0], y:a[1], r:5, color:K.pen }); else edgeArrow(p, a[0], a[1], K.pen);
    if (pr.la && inView(p, a[0], a[1])) ptLabel(p, a[0], a[1], pr.la, { side:a[1] >= a[0] ? 1 : -1 });
    if (pr.lb && (pr.s == null || pr.s >= 1) && inView(p, b[0], b[1])) ptLabel(p, b[0], b[1], pr.lb, { side:a[1] >= a[0] ? -1 : 1 });
  });
}
function part3(host, api){
  var S = def(api.S, { round:"A", aI:0, aDone:false, bI:0, B:{}, cI:0, C:{} });
  var C = MV.C.part3, RA = C.roundA, RB = C.roundB, RC = C.roundC;
  host.innerHTML = '<div class="tr"><div id="tr-rounds" class="tr-rounds"></div><div class="tr-grid"><div class="tr-board" id="tr-board"></div>' +
    '<div class="tr-side"><canvas class="plot square" id="tr-plot" role="img" aria-label="Mirror mini-graph"></canvas><p class="tiny muted tr-gnote" id="tr-gnote" aria-live="polite"></p></div></div></div>';
  var board = $("#tr-board"), plot = new MV.Plot($("#tr-plot"), { xmin:-4, xmax:10, ymin:-4, ymax:10 }, { equal:true });
  var G = { lo:-4, hi:10, o:{}, desc:"" };
  plot.render = function(){ plot.draw({ view:{ xmin:G.lo, xmax:G.hi, ymin:G.lo, ymax:G.hi }, equal:true, xTicks:{ step:tick(G) }, yTicks:{ step:tick(G) }, describe:G.desc, after:function(){ twinScene(plot, G.o); } }); };
  function tick(g){ var r = g.hi - g.lo; return r > 40 ? 10 : r > 20 ? 5 : r > 12 ? 2 : 1; }
  function graph(lo, hi, o, desc, note){ G.lo = lo; G.hi = hi; G.o = o; G.desc = desc; $("#tr-gnote").innerHTML = note || ""; plot.render(); }
  radios($("#tr-rounds"), { aria:"Choose a round", cls:"chips", options:[{ id:"A", t:"Round A: Watch" }, { id:"B", t:"Round B: Translate" }, { id:"C", t:"Round C: Solve" }], value:S.round,
    onChange:function(v){ S.round = v; api.save(); paint(); } });
  function paint(){ if (S.round === "A") paintA(); else if (S.round === "B") paintB(); else paintC(); }

  // ----- Round A: watch the tiles (N13 player; a fresh host each time the round is shown) -----
  function factBoard(f, phase){
    var vals = { base:f.b, exp:f.e, res:f.r };
    function slot(form){ return function(role){ return '<span class="tr-slot' + (phase === (form === "exp" ? 0 : 1) ? " full" : "") + '">' + (phase === (form === "exp" ? 0 : 1) ? tileSpan("a" + role, vals[role], role, true) : "") + "</span>"; }; }
    return '<div class="tr-forms"><div class="tr-form"><span class="tr-flab">Exponential form</span>' + tplHTML("exp", slot("exp")) + '</div><div class="tr-form"><span class="tr-flab">Log form</span>' + tplHTML("log", slot("log")) + "</div></div>";
  }
  function graphA(i, animate){
    var f = RA.facts[i >> 1], b = bnum(f.b), e = bnum(f.e), r = bnum(f.r), ph = i & 1;
    var pair = { a:[e, r], la:f.b + "^{" + f.e + "} = " + f.r, lb:ph ? "log_{" + f.b + "}" + (/\//.test(f.r) ? "(" + f.r + ")" : " " + f.r) + " = " + f.e.replace("-", MINUS) : null, s:ph ? 1 : 0 };
    graph(f.view[0], f.view[1], { b:b, pairs:[pair] }, "Mini-graph: y = " + f.b + "ˣ and its inverse. " + (ph ? "Twin points (" + MV.plain(m(f.e)) + ", " + MV.plain(m(f.r)) + ") and (" + MV.plain(m(f.r)) + ", " + MV.plain(m(f.e)) + ")." : "The point (" + MV.plain(m(f.e)) + ", " + MV.plain(m(f.r)) + ")."));
    if (ph && animate && !RM) MV.tween({ dur:1200, ease:LIN, step:function(t){ pair.s = t; plot.render(); } });
  }
  function paintA(){
    board.innerHTML = '<h3 class="tr-h">' + RA.title + '</h3><p class="tiny muted">' + RA.intro + '</p><div id="tr-a-tpl"></div><div class="tr-player"></div><p class="tr-after" id="tr-a-after"' + (S.aDone ? "" : " hidden") + ">" + RA.after + "</p>";
    var tpl = $("#tr-a-tpl"), prev = null;
    MV.player($(".tr-player", board), { count:6, interval:2100, label:function(i){ return "Fact " + ((i >> 1) + 1) + " of 3: " + (i & 1 ? "log form" : "exponential form"); },
      render:function(i){
        var same = prev != null && (prev >> 1) === (i >> 1), before = same ? rects(tpl) : null;
        tpl.innerHTML = factBoard(RA.facts[i >> 1], i & 1);
        if (before) flip(tpl, before, 1200);
        graphA(i, same && (i & 1));
        prev = i; S.aI = i;
        if (i === 5 && !S.aDone) { S.aDone = true; MV.wait(RM ? 0 : 1200, function(){ var a = $("#tr-a-after"); if (a) a.hidden = false; }); }
        api.save();
      } });
  }

  // ----- Round B: translate -----
  function bst(it){ var x = S.B[it.id]; if (!x) { var A0 = MV.ans(it), loc = {}; Object.keys(A0).forEach(function(role){ loc[A0[role]] = "g:" + role; }); x = S.B[it.id] = { loc:loc, tries:0, hint:0, solved:false, first:null }; } return x; }
  var bSel = null, bMsg = {};
  function roleOf(it, ti){ var A0 = MV.ans(it); for (var r in A0) if (A0[r] === ti) return r; return null; }
  function paintB(focusK){
    var it = RB.items[S.bI], x = bst(it), giv = it.form === "log" ? "exp" : "log", done = x.solved;
    var at = {}; Object.keys(x.loc).forEach(function(ti){ at[x.loc[ti]] = +ti; });
    function slot(side){ return function(role){
      var key = side + ":" + role, ti = at[key], has = ti != null, show = done;
      if (done) return '<span class="tr-slot full">' + tileSpan("b" + (side === "t" ? ti : "g" + role), side === "t" ? it.tiles[ti] : it.tiles[MV.ans(it)[role]], role, true) + "</span>";
      var fm = side === "t" ? it.form : giv, lab = (side === "t" ? "Your " : "Given ") + (fm === "log" ? "log" : "exponential") + " form, " + SLOTN[fm][role] + " slot";
      return '<button type="button" class="tr-slot' + (has ? " full" : "") + (has && bSel === ti ? " on" : "") + '" data-slot="' + key + '" data-k="bs' + key + '" aria-label="' + MV.esc(lab + ": " + (has ? MV.plain(m(it.tiles[ti])) : "empty")) + '"' + (has && bSel === ti ? ' aria-pressed="true"' : "") + ">" +
        (has ? tileSpan("b" + ti, it.tiles[ti], roleOf(it, ti), show) : (side === "g" ? '<span class="tr-ghost" aria-hidden="true">' + m(it.tiles[MV.ans(it)[role]]) + "</span>" : "")) + "</button>";
    }; }
    var full = ["base", "exp", "res"].every(function(r){ return at["t:" + r] != null; });
    var h = '<h3 class="tr-h">' + RB.title + '</h3><p class="tiny muted">' + RB.intro + "</p>";
    h += '<div class="pred-top"><span class="tiny muted">Item ' + (S.bI + 1) + " of " + RB.items.length + '</span><span class="dots" aria-hidden="true">' + RB.items.map(function(q, i){ var y = S.B[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.bI ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<p class="tr-task">Given ' + it.given + ". Write it in " + (it.form === "log" ? "log" : "exponential") + " form.</p>";
    var gForm = '<div class="tr-form tr-given"><span class="tr-flab">Given: ' + (giv === "exp" ? "exponential" : "log") + " form</span>" + tplHTML(giv, slot("g")) + "</div>";
    var tForm = '<div class="tr-form tr-target"><span class="tr-flab">Your ' + (it.form === "log" ? "log" : "exponential") + " form</span>" + tplHTML(it.form, slot("t")) + "</div>";
    h += '<div class="tr-forms" id="tr-b-forms">' + (giv === "exp" ? gForm + tForm : tForm + gForm) + "</div>";
    if (!done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-bact="check" data-k="bchk"' + (full ? "" : " disabled") + '>Check</button><button type="button" class="btn ghost sm" data-bact="reset" data-k="breset">Put the tiles back</button>' + MV.hintBtn("bh" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (done) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.build + ".</strong> The two forms are twin points on the mini-graph." + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (bMsg[it.id]) h += '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + bMsg[it.id] + " " + RB.again + "</p></div>";
    var nf = RB.items.filter(function(q){ return S.B[q.id] && S.B[q.id].first; }).length, nd = RB.items.filter(function(q){ return S.B[q.id] && S.B[q.id].solved; }).length;
    h += '<p class="tr-tally">' + nf + " of " + RB.items.length + " on the first try" + (nd < RB.items.length ? " (" + nd + " done)" : "") + ".</p>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-bact="prev" data-k="bprev"' + (S.bI === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (done ? "primary" : "ghost") + ' sm" data-bact="next" data-k="bnext"' + (S.bI === RB.items.length - 1 ? " disabled" : "") + ">Next</button></div>";
    var before = focusK === "flip" ? rects(board) : null;
    MV.keepFocus(board, function(){ board.innerHTML = h; });
    if (before) flip(board, before, 450);
    var b = bnum(it.tiles[MV.ans(it).base]);
    graph(it.view[0], it.view[1], { b:b, pairs:done ? [{ a:it.pts[0], la:it.labels[0], lb:it.labels[1] }] : [] },
      "Mini-graph of y = " + MV.plain(m(it.tiles[MV.ans(it).base])) + "ˣ and its inverse." + (done ? " Twin points " + MV.plain(it.labels[0].replace(/[{}]/g, "")) + " and " + MV.plain(it.labels[1].replace(/[{}]/g, "")) + "." : ""), done && it.note ? MV.md(it.note) : "");
  }
  function moveTile(x, ti, key){
    var other = null; Object.keys(x.loc).forEach(function(k){ if (x.loc[k] === key) other = k; });
    if (other != null && +other !== ti) x.loc[other] = x.loc[ti];
    x.loc[ti] = key;
  }
  function checkB(it, x){
    var A0 = MV.ans(it), wrong = [];
    ["base", "exp", "res"].forEach(function(r){ if (x.loc[A0[r]] !== "t:" + r) wrong.push(r); });
    if (!wrong.length) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; bMsg[it.id] = null; return; }
    x.tries++;
    var w = wrong.sort().join(",");
    bMsg[it.id] = w === "base,res" ? it.wrong.BR : w === "base,exp" ? it.wrong.BE : w === "exp,res" ? it.wrong.ER : RB.all;
  }
  board.addEventListener("click", function(e){
    if (S.round !== "B") return;
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = RB.items[S.bI], x = bst(it);
    if (b.dataset.slot) {
      var key = b.dataset.slot, at = null; Object.keys(x.loc).forEach(function(k){ if (x.loc[k] === key) at = +k; });
      if (bSel != null && bSel !== at) { moveTile(x, bSel, key); bSel = null; bMsg[it.id] = null; api.save(); paintB("flip"); return; }
      bSel = at != null && bSel !== at ? at : null; paintB(); return;
    }
    var a = b.dataset.bact; if (!a) return;
    if (a === "check") { checkB(it, x); bSel = null; api.save(); paintB(); MV.focusFb(board); return; }
    if (a === "reset") { delete S.B[it.id]; var y = bst(it); y.tries = x.tries; y.hint = x.hint; bSel = null; bMsg[it.id] = null; api.save(); paintB("flip"); return; }
    if (a === "prev" || a === "next") { S.bI = clamp(S.bI + (a === "prev" ? -1 : 1), 0, RB.items.length - 1); bSel = null; api.save(); paintB(); return; }
  });
  board.addEventListener("keydown", function(e){ if (e.key === "Escape" && S.round === "B" && bSel != null) { bSel = null; paintB(); } });

  // ----- Round C: solve by translating -----
  function cst(it){ return S.C[it.id] || (S.C[it.id] = { a1:null, a2:null, t1:0, t2:0, hint:0, first:null }); }
  function chipsHTML(it, step, x){
    var st = it["step" + step], last = x["a" + step], done = last != null && MV.ok(st.options[last]);
    var h = '<p class="tr-step">' + st.q + '</p><div class="sq-c tr-chips" role="group" aria-label="' + MV.esc(MV.plain(st.q)) + '">' + st.options.map(function(o, i){
      return '<button type="button" class="chip' + (last === i ? " on" : "") + '" data-cstep="' + step + '" data-ci="' + i + '" data-k="c' + it.id + step + i + '" aria-pressed="' + (last === i) + '"' + (done ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (last != null) { var o = st.options[last], good = MV.ok(o); h += '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p><strong>' + (good ? "✓ Correct." : "✗ Not quite.") + "</strong> " + o.why + (good ? "" : " Try again.") + "</p></div>"; }
    return { h:h, done:done };
  }
  function graphC(it, show){
    var v = it.view, desc = "Mini-graph for " + MV.plain(it.prompt) + (show ? "" : " Empty axes until you answer step 2.");
    if (!show) { graph(v[0], v[1], {}, desc); return; }
    if (it.kind === "expEq") { var xs = Math.log(it.c) / Math.log(it.b);
      graph(v[0], v[1], { b:it.b, grid:[{ x:2 }, { x:3 }, { y:2 }, { y:3 }], lines:[{ y:it.c }, { x:it.c }], pairs:[{ a:[xs, it.c], la:"(log_{3} 10, 10)", lb:"(10, log_{3} 10)" }] },
        desc + " The line y = 10 meets y = 3ˣ between x = 2 and x = 3; its mirror x = 10 meets y = log₃ x between heights 2 and 3."); }
    else if (it.kind === "base") graph(v[0], v[1], { b:3, faint:[2, 4], rings:[[9, 2]], pairs:[{ a:[2, 9], la:"(2, 9)", lb:"(9, 2)" }] },
      desc + " Faint log curves for bases 2 and 4; the base-3 curve passes through the ring (9, 2), and its twin (2, 9) is on y = 3ˣ.");
    else graph(v[0], v[1], { b:it.b, lines:[{ y:it.c }, { x:it.c }], pairs:[{ a:[it.c, 27], la:"(3/2, 27)", lb:"(27, 3/2)" }] },
      desc + " The line y = 3/2 meets y = log₉ x at (27, 3/2); its twin (3/2, 27) is on y = 9ˣ.");
  }
  function paintC(){
    var it = RC.items[S.cI], x = cst(it);
    var h = '<h3 class="tr-h">' + RC.title + '</h3><p class="tiny muted">' + RC.intro + "</p>";
    h += '<div class="pred-top"><span class="tiny muted">Equation ' + (S.cI + 1) + " of " + RC.items.length + '</span><span class="dots" aria-hidden="true">' + RC.items.map(function(q, i){ var y = S.C[q.id]; return '<span class="dot' + (y && y.first != null ? " done" : "") + (i === S.cI ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<p class="tr-task">' + it.prompt + "</p>";
    var s1 = chipsHTML(it, 1, x); h += s1.h;
    if (s1.done) { var s2 = chipsHTML(it, 2, x); h += s2.h; }
    var solved = x.first != null;
    if (!solved) h += '<div class="q-actions">' + MV.hintBtn("ch" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    var nf = RC.items.filter(function(q){ return S.C[q.id] && S.C[q.id].first; }).length, nd = RC.items.filter(function(q){ return S.C[q.id] && S.C[q.id].first != null; }).length;
    h += '<p class="tr-tally">' + nf + " of " + RC.items.length + " on the first try" + (nd < RC.items.length ? " (" + nd + " done)" : "") + ".</p>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-cact="prev" data-k="cprev"' + (S.cI === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (solved ? "primary" : "ghost") + ' sm" data-cact="next" data-k="cnext"' + (S.cI === RC.items.length - 1 ? " disabled" : "") + ">Next</button></div>";
    MV.keepFocus(board, function(){ board.innerHTML = h; });
    graphC(it, x.a2 != null);
  }
  board.addEventListener("click", function(e){
    if (S.round !== "C") return;
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = RC.items[S.cI], x = cst(it);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintC(); return; }
    if (b.dataset.cstep) {
      var step = +b.dataset.cstep, i = +b.dataset.ci, good = MV.ok(it["step" + step].options[i]);
      x["a" + step] = i; if (!good) x["t" + step]++;
      if (step === 2 && good && x.first == null) x.first = x.t1 === 0 && x.t2 === 0 && x.hint < 3;
      api.save(); paintC(); MV.focusFb(board); return;
    }
    if (b.dataset.cact) { S.cI = clamp(S.cI + (b.dataset.cact === "prev" ? -1 : 1), 0, RC.items.length - 1); api.save(); paintC(); }
  });
  board.addEventListener("click", function(e){
    if (S.round !== "B") return;
    var b = e.target.closest('[data-act="hint"]'); if (!b || b.disabled) return;
    var x = bst(RB.items[S.bI]); x.hint = Math.min(3, x.hint + 1); api.save(); paintB();
  });
  // results summary lines for the two scored rounds
  MV.ACTS.trB = { stats:function(){ var f = 0, d = 0; RB.items.forEach(function(q){ var y = S.B[q.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:RB.items.length, done:d, line:"Translator Round B (first try): " + f + "/" + RB.items.length + (d < RB.items.length ? " (unfinished)" : "") }; },
    missed:function(){ return RB.items.some(function(q){ var y = S.B[q.id]; return y && (y.tries > 0 || y.hint >= 3); }) ? [2] : []; } };
  MV.ACTS.trC = { stats:function(){ var f = 0, d = 0; RC.items.forEach(function(q){ var y = S.C[q.id]; if (y && y.first != null) d++; if (y && y.first) f++; }); return { first:f, total:RC.items.length, done:d, line:"Translator Round C (first try): " + f + "/" + RC.items.length + (d < RC.items.length ? " (unfinished)" : "") }; },
    missed:function(){ return RC.items.some(function(q){ var y = S.C[q.id]; return y && (y.t1 > 0 || y.t2 > 0 || y.hint >= 3); }) ? [3] : []; } };
  paint();
}

// ---------- Practice 2: translate, solve, work backwards (number boxes + twin mini-graph) ----------
var TWG = {
  n1:{ v:[-4, 45], o:function(a){ var o = { b:0.2, lines:[{ y:40 }, { x:40 }], pairs:[] }; if (a) [a.lo, a.hi].forEach(function(e){ o.pairs.push(pr(e, Math.pow(0.2, e))); }); return o; } },
  n2:{ v:[-5, 5], o:function(a){ return { b:3, pairs:a ? [pr(-4, a.v)] : [] }; } },
  n3:{ v:[-4, 34], o:function(a){ var ok = a && a.v > 0 && Math.abs(a.v - 1) > 1e-9; return { b:ok ? a.v : null, rings:[[2.5, 32], [32, 2.5]], pairs:ok ? [pr(2.5, Math.pow(a.v, 2.5))] : [] }; } },
  n4:{ v:[-4, 11], o:function(a){ return { b:1 / 3, rings:[[3, 1 / 27]], pairs:a ? [pr(-2, a.v)] : [] }; } },
  n5:{ v:[-2, 4], o:function(a){ return { b:4, pairs:a ? [pr(0.5, a.v)] : [] }; } },
  n6:{ v:[-4, 40], o:function(a){ return { f:function(x){ return Math.pow(2, x) + 3; }, g:function(x){ return x > 3 ? Math.log2(x - 3) : NaN; }, pairs:a ? [pr(5, a.v)] : [] }; } },
  n7:{ v:[-4, 66], o:function(a){ return { f:function(x){ return Math.pow(2, x) - 3; }, g:function(x){ return x > -3 ? Math.log2(x + 3) : NaN; }, pairs:a ? [pr(a.v, 61)] : [] }; } },
  n8:{ v:[-0.5, 1.5], o:function(a){ return { b:1 / 16, rings:[[0.25, 0.5]], pairs:a ? [pr(a.x, a.y)] : [] }; } }
};
function pr(x, y){ var t = coordTxt(x, y), u = coordTxt(y, x); return { a:[x, y], la:t, lb:u }; }
function twinsAct(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var msgs = {}, bads = {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="tw-top" id="tw-top"></div><div class="tw-gbox"><canvas class="plot square" id="tw-plot" role="img" aria-label="Twin mini-graph"></canvas><p class="tiny muted" id="tw-gnote" aria-live="polite"></p></div><div class="q-actions" id="tw-nav"></div>';
  var top = $("#tw-top", host), plot = new MV.Plot($("#tw-plot", host), { xmin:-4, xmax:10, ymin:-4, ymax:10 }, { equal:true });
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { vals:{}, tries:0, hint:0, solved:false, first:null, last:null }); }
  function inp(it, b){ var x = ist(it), bad = bads[it.id] && bads[it.id][b.id]; return '<label class="tw-lab"><span>' + b.label + '</span><input class="tw-in' + (bad ? " bad" : "") + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-tw="' + b.id + '" data-k="tw' + it.id + b.id + '" value="' + MV.esc(x.vals[b.id] || "") + '"' + (x.solved ? " disabled" : "") + "></label>"; }
  plot.render = function(){
    var it = a.items[S.i], x = ist(it), g = TWG[it.id], v = g.v, o = g.o(x.last);
    var dsc = "Mini-graph for item " + (S.i + 1) + (o.pairs.length ? ": your twin points " + o.pairs.map(function(q){ return q.la + " and " + q.lb; }).join("; ") + "." : ". Check an answer to see its twin points.");
    plot.draw({ view:{ xmin:v[0], xmax:v[1], ymin:v[0], ymax:v[1] }, equal:true, xTicks:{ step:tk(v) }, yTicks:{ step:tk(v) }, describe:dsc, after:function(){ twinScene(plot, o); } });
    $("#tw-gnote", host).textContent = o.pairs.length ? "Your answer makes the twin points " + o.pairs.map(function(q){ return q.la + " and " + q.lb; }).join("; ") + "." : "Check an answer to see the twin points it makes.";
  };
  function tk(v){ var r = v[1] - v[0]; return r > 40 ? 10 : r > 20 ? 5 : r > 8 ? 1 : 0.5; }
  function paint(){
    var it = a.items[S.i], x = ist(it);
    var h = '<div class="pred-top"><span class="tiny muted">Item ' + (S.i + 1) + " of " + a.items.length + '</span><span class="dots" aria-hidden="true">' + a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<p class="tr-task">' + it.prompt + "</p>";
    h += '<div class="tw-row">' + (it.point ? '<span class="m tw-par">(</span>' + inp(it, it.boxes[0]) + '<span class="m tw-par">,</span>' + inp(it, it.boxes[1]) + '<span class="m tw-par">)</span>' : it.boxes.map(function(b){ return inp(it, b); }).join("")) + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="twchk">Check</button>' + MV.hintBtn("twh" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p>' + (it.right ? it.right.replace(/^✓ Correct\./, "<strong>✓ Correct.</strong>") : "<strong>✓ Correct: " + it.display + ".</strong>") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(top, function(){ top.innerHTML = h; });
    var nav = $("#tw-nav", host);
    MV.keepFocus(nav, function(){ nav.innerHTML = '<button type="button" class="btn ghost sm" data-act="prev" data-k="twprev"' + (S.i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-act="next" data-k="twnext"' + (S.i === a.items.length - 1 ? " disabled" : "") + ">Next</button>"; });
    plot.render();
  }
  function near(u, w){ return Math.abs(u - w) < 1e-6 * Math.max(1, Math.abs(w)); }
  function check(){
    var it = a.items[S.i], x = ist(it), A0 = MV.ans(it), v = {}, empty = false;
    Object.keys(A0).forEach(function(id){ var r = MV.parseNum(x.vals[id]); if (!r || r.length !== 1) empty = true; else v[id] = r[0]; });
    if (empty) { msgs[it.id] = "Fill in " + (Object.keys(A0).length > 1 ? "both boxes" : "the box") + " with a whole number or a fraction, such as −5 or 2/7."; paint(); MV.focusFb(top); return; }
    x.last = v;
    var bad = {}; Object.keys(A0).forEach(function(id){ if (!near(v[id], A0[id])) bad[id] = 1; });
    if (!Object.keys(bad).length) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; bads[it.id] = null; api.save(); paint(); MV.focusFb(top); return; }
    x.tries++; bads[it.id] = bad;
    var w = (it.wrong || []).filter(function(q){ return Object.keys(q.match).every(function(id){ return v[id] != null && near(v[id], q.match[id]); }); })[0];
    var fb = w ? w.fb : (it.id === "n1" && near(v.lo, A0.hi) && near(v.hi, A0.lo)) ? "Type the smaller number first." : a.fallback;
    msgs[it.id] = "<strong>✗ Not quite.</strong> " + fb + " Try again.";
    api.save(); paint(); MV.focusFb(top);
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.tw) return; ist(a.items[S.i]).vals[t.dataset.tw] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){
    var t = e.target; if (e.key !== "Enter" || !t.dataset || !t.dataset.tw) return;
    e.preventDefault(); var all = $$(".tw-in", host), nx = all.slice(all.indexOf(t) + 1).filter(function(n){ return !n.value.trim(); })[0];
    if (nx) nx.focus(); else check();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = ist(it);
    if (b.dataset.act === "check") { check(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "prev" || b.dataset.act === "next") { S.i = clamp(S.i + (b.dataset.act === "prev" ? -1 : 1), 0, a.items.length - 1); api.save(); paint(); }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: land it in the window ----------
var task = (function(){
  var api, pe, pl;
  function read(){
    var s = api ? api.S : {}, n = +(s.n || 2), d = +(s.d || 1), r = MV.parseNum(s.c), c = r && r.length === 1 ? r[0] : NaN;
    return { n:n, d:d, c:c, cs:s.c, okc:isFinite(c) };
  }
  function base(dd){ return Q(dd.n, dd.d); }
  function bTxt(dd){ return dd.d === 1 ? String(dd.n) : dd.n + "/" + dd.d; }
  function sol(dd){ return dd.n === dd.d || !(dd.c > 0) ? null : Math.log(dd.c) / Math.log(dd.n / dd.d); }
  function checks(dd){
    var l1 = dd.n !== dd.d, l2 = dd.okc && Number.isInteger(dd.c) && dd.c >= 2 && dd.c <= 30;
    var l3 = l1 && dd.okc && (dd.n / dd.d - 1) * (dd.c - 1) < 0;
    // −2 < log_b c < −1 ⟺ c strictly between b⁻¹ = d/n and b⁻² = d²/n² (exact integer comparison)
    var lo = Math.min(dd.d * dd.n, dd.d * dd.d), hi = Math.max(dd.d * dd.n, dd.d * dd.d);
    var l4 = l1 && dd.okc && dd.c * dd.n * dd.n > lo && dd.c * dd.n * dd.n < hi;
    return [l1, l2, l3, l4];
  }
  function capHTML(){
    var dd = read(), bb = bTxt(dd), q = base(dd), red = qs(q), src = dd.d === 1 ? "@b{" + bb + "}" : "(@b{" + bb + "})";
    if (!dd.okc) return m(src + "^x = c") + ' <span class="muted tiny">Enter ' + m("c") + ".</span>";
    var h = m(src + "^x = " + num(dd.c));
    if (dd.n === dd.d) h += ": this base is 1, and " + m("1^x = 1") + " for every " + m("x") + ".";
    else h += ", so " + m("x = log_{@b{" + bb + "}} " + num(dd.c));
    if (red !== bb && dd.n !== dd.d) h += ' <span class="tiny muted">(' + bb + " is the same base as " + red + ".)</span>";
    return h;
  }
  function drawExp(){
    var dd = read(), b = dd.n / dd.d, x0 = sol(dd), V = { xmin:-4, xmax:4, ymin:-1, ymax:32 };
    pe.draw({ view:V, xTicks:{ step:1 }, yTicks:{ step:5 }, bands:[{ x0:-2, x1:-1 }],
      curves:[{ f:function(x){ return Math.pow(b, x); }, color:css("--pen"), width:3, arrows:true }],
      describe:"Exponential view: y = " + bTxt(dd) + "ˣ, the line y = " + (dd.okc ? num(dd.c) : "c") + " and the band −2 < x < −1." + (x0 != null && dd.okc ? " They meet at x ≈ " + num(x0, 2) + "." : ""),
      after:function(ctx, p){
        if (!dd.okc) return;
        p.segment({ x1:V.xmin - 1, y1:dd.c, x2:V.xmax + 1, y2:dd.c, color:css("--ink"), width:1.5 });
        if (x0 == null) return;
        if (x0 >= V.xmin && x0 <= V.xmax) { p.point({ x:x0, y:dd.c, r:5, color:css("--ink") }); cmath(ctx, "x = log_{" + bTxt(dd) + "} " + num(dd.c), clamp(p.X(x0), 70, p.W - 70), clamp(p.Y(dd.c) - 16, 12, p.H - 12), { size:13, align:"center" }); }
        else edgeArrow(p, x0, dd.c, css("--ink"));
      } });
  }
  function drawLog(){
    var dd = read(), b = dd.n / dd.d, x0 = sol(dd), V = { xmin:-1, xmax:32, ymin:-4, ymax:4 };
    pl.draw({ view:V, xTicks:{ step:5 }, yTicks:{ step:1 },
      describe:"Log view, the same picture reflected in y = x: y = log of x with base " + bTxt(dd) + ", the line x = " + (dd.okc ? num(dd.c) : "c") + " and the band −2 < y < −1.",
      after:function(ctx, p){
        ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(0, p.Y(-1), p.W, p.Y(-2) - p.Y(-1)); ctx.restore();
        if (dd.n !== dd.d) p.curve({ pts:curvePts(b, "log"), color:css("--f3"), width:2.6 });
        else p.segment({ x1:1, y1:V.ymin - 1, x2:1, y2:V.ymax + 1, color:css("--f3"), width:2.6, dash:[10, 6] });
        if (!dd.okc) return;
        p.segment({ x1:dd.c, y1:V.ymin - 1, x2:dd.c, y2:V.ymax + 1, color:css("--ink"), width:1.5 });
        if (x0 == null) return;
        if (x0 >= V.ymin && x0 <= V.ymax) { p.point({ x:dd.c, y:x0, r:5, color:css("--ink") }); cmath(ctx, "y = log_{" + bTxt(dd) + "} " + num(dd.c), clamp(p.X(dd.c) + 8, 4, p.W - 90), clamp(p.Y(x0) + (x0 > 0 ? 16 : -16), 12, p.H - 12), { size:13 }); }
        else edgeArrow(p, dd.c, x0, css("--ink"));
      } });
  }
  function upd(){ $("#lw-cap").innerHTML = capHTML(); drawExp(); drawLog(); }
  function opts(sel){ var h = ""; for (var k = 1; k <= 9; k++) h += '<option value="' + k + '"' + (k === sel ? " selected" : "") + ">" + k + "</option>"; return h; }
  return {
    render:function(inp, pv, a){
      api = a; def(a.S, { n:"2", d:"1", c:"3" });
      inp.innerHTML = '<div class="lw-in"><span class="lw-blab">' + m("@b{b} =") + '</span><span class="lw-frac"><select id="lw-n" aria-label="Numerator of b">' + opts(+a.S.n) + '</select><span class="lw-bar" aria-hidden="true"></span><select id="lw-d" aria-label="Denominator of b">' + opts(+a.S.d) + "</select></span>" +
        '<label class="lw-clab" for="lw-c">' + m("c =") + '</label><input id="lw-c" class="numin" type="number" min="1" max="30" step="1" value="' + MV.esc(a.S.c) + '"></div><p class="eq-cap lw-cap" id="lw-cap" aria-live="polite"></p>';
      pv.innerHTML = '<div class="lw-pv"><figure><canvas class="plot" id="lw-pe" role="img" aria-label="Exponential view"></canvas><figcaption class="tiny muted">Exponential view</figcaption></figure><figure><canvas class="plot" id="lw-pl" role="img" aria-label="Log view"></canvas><figcaption class="tiny muted">Log view (reflected in ' + m("y = x") + ")</figcaption></figure></div>";
      pe = new MV.Plot($("#lw-pe"), { xmin:-4, xmax:4, ymin:-1, ymax:32 }); pe.render = drawExp;
      pl = new MV.Plot($("#lw-pl"), { xmin:-1, xmax:32, ymin:-4, ymax:4 }); pl.render = drawLog;
      inp.addEventListener("change", function(e){ var t = e.target; if (t.id === "lw-n") a.S.n = t.value; else if (t.id === "lw-d") a.S.d = t.value; else return; a.save(); upd(); a.update(); });
      inp.addEventListener("input", function(e){ if (e.target.id !== "lw-c") return; a.S.c = e.target.value; a.save(); upd(); a.update(); });
      upd();
    },
    read:read,
    valid:function(dd){ return dd.okc ? true : "Enter a whole number for " + m("c") + "."; },
    checks:checks,
    tips:function(dd, c){
      var T = MV.C.task.tips, i = c.indexOf(false); if (i < 0) return [];
      if (i === 2) { var x0 = sol(dd); return [T[2].replace("{sign}", x0 != null && Math.abs(x0) < 1e-12 ? "0" : "positive")]; }
      if (i === 3) {
        var b1 = Q(dd.d, dd.n), b2 = Q(dd.d * dd.d, dd.n * dd.n), cv = dd.c * b1[1], where;
        if (dd.c * b1[1] < b1[0]) where = "below " + m("b^{-1}"); else if (dd.c * b1[1] === b1[0]) where = "equal to " + m("b^{-1}");
        else if (dd.c * b2[1] === b2[0]) where = "equal to " + m("b^{-2}"); else where = "above " + m("b^{-2}");
        void cv;
        return [T[3].replace("{b1}", qs(b1)).replace("{b2}", qs(b2)).replace("{c}", num(dd.c)).replace("{where}", where)];
      }
      return [T[i]];
    },
    key:function(dd){ var q = base(dd), k = qs(q); api.S.found = api.S.found || {}; if (api.S.found[k] == null) api.S.found[k] = dd.c; return k; },
    label:function(k){ var c = (api && api.S.found || {})[k]; return "(" + m("@b{" + k + "}") + ", " + (c != null ? num(c) : "…") + ")"; },
    text:function(k){ var c = (api && api.S.found || {})[k]; return "b = " + k + (c != null ? ", c = " + num(c) : ""); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ twins:twinsAct },
  task:task
});
})();
