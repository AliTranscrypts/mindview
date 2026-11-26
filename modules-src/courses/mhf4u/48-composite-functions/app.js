// MHF4U 48 Composite Functions: hero (two machines trade places), the two-machine pipeline (Explore), Station A
// (linear inside or outside) and Station B (decompose it) for Part 3, "Inside out, then backwards" (Practice 2),
// the "Break it at 2" task and the Final Check graphs.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS, RM = MV.reduceMotion;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function LIN(t){ return t; }
function fill(s, o){ return String(s).replace(/#([1-9A-Z])/g, function(_, k){ return o[k] != null ? o[k] : "#" + k; }); }
function def(o, d){ Object.keys(d).forEach(function(k){ if (o[k] === undefined) o[k] = JSON.parse(JSON.stringify(d[k])); }); return o; }
function rect(el, base){ var a = el.getBoundingClientRect(), b = base.getBoundingClientRect(); return { x:a.left - b.left + a.width / 2, y:a.top - b.top + a.height / 2, w:a.width, h:a.height }; }
function mid(a, b){ return { x:(a.x + b.x) / 2, y:(a.y + b.y) / 2 }; }
function cap1(h){ return h.charAt(0).toUpperCase() + h.slice(1); }

// @component G11 canvasMath (from MHF4U 37) — canvas text with ^{…} superscripts and _{…} subscripts in the math font
// (single letters italic, words such as "log" upright), optional sheet-coloured backing; returns the width drawn
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
// @component G11 edgeArrow (from MHF4U 37) — a small arrow at the window edge pointing toward a point that lies off the graph
function edgeArrow(p, x, y, color){
  var X = p.X(x), Y = p.Y(y);
  if (!isFinite(X) || !isFinite(Y)) { X = isFinite(X) ? X : (x > 0 ? 1e6 : -1e6); Y = isFinite(Y) ? Y : (y > 0 ? -1e6 : 1e6); }
  if (X >= -2 && X <= p.W + 2 && Y >= -2 && Y <= p.H + 2) return false;
  var cx = clamp(X, 18, p.W - 18), cy = clamp(Y, 18, p.H - 18), dx = X - cx, dy = Y - cy, L = Math.hypot(dx, dy) || 1;
  dx /= L; dy /= L;
  var ctx = p.ctx, tx = cx + dx * 9, ty = cy + dy * 9, a = Math.atan2(dy, dx);
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.2; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(cx - dx * 7, cy - dy * 7); ctx.lineTo(tx, ty); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx + dx * 4, ty + dy * 4); ctx.lineTo(tx - 7 * Math.cos(a - 0.55), ty - 7 * Math.sin(a - 0.55)); ctx.lineTo(tx - 7 * Math.cos(a + 0.55), ty - 7 * Math.sin(a + 0.55)); ctx.closePath(); ctx.fill();
  ctx.restore(); return true;
}
// @component radioGroup (from MHF4U 25/37) — segmented control or chip row as a real radio group (arrow keys, roving tabindex, lock)
function radios(host, o){
  var val = String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
// @component N9 stepSlider (from MHF4U 32/37) — slider over a list of positions with 40 px − / + buttons, a formatted value,
// Shift + arrow for big steps (o.big)
function stepSlider(host, o){
  host.innerHTML = '<div class="wt-sl" style="--sc:var(' + o.color + ')"><div class="wt-sl-top"><label for="sl48-' + o.id + '">' + o.label + '</label><output id="sl48-' + o.id + '-o" for="sl48-' + o.id + '"></output></div>' +
    '<div class="wt-sl-row"><button type="button" class="btn ghost wt-pm" data-pm="-1" data-k="' + o.id + 'm" aria-label="Decrease ' + o.name + '">' + MINUS + '</button><input type="range" id="sl48-' + o.id + '" min="0" max="' + (o.n - 1) + '" step="1">' +
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
// red ✗ on a graph, with an optional short note (canvas maths)
function cross(p, x, y, note){
  var X = clamp(p.X(x), 8, p.W - 8), Y = clamp(p.Y(y), 10, p.H - 10), ctx = p.ctx, col = css("--red");
  ctx.save(); ctx.fillStyle = col; ctx.font = "700 20px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("✗", X, Y); ctx.restore();
  if (note) { var right = X > p.W * 0.55; cmath(ctx, note, right ? X - 14 : X + 14, clamp(Y - 18, 12, p.H - 12), { size:12, color:col, align:right ? "right" : "left", weight:700 }); }
}
function seg(p, a, b, o){
  o = o || {};
  var v = p.v, cl = function(t, lo, hi){ return clamp(t, lo - 30, hi + 30); };
  var x1 = cl(a[0], v.xmin, v.xmax), y1 = cl(a[1], v.ymin, v.ymax), x2 = cl(b[0], v.xmin, v.xmax), y2 = cl(b[1], v.ymin, v.ymax);
  if (Math.abs(x1 - x2) + Math.abs(y1 - y2) < 1e-9) return;
  p.segment({ x1:x1, y1:y1, x2:x2, y2:y2, color:o.color || css("--ink-2"), width:o.width || 2, dash:o.dash || [2, 4], alpha:o.alpha, arrow:o.arrow });
}
function ring(p, x, y, r){ var ctx = p.ctx, X = p.X(x), Y = p.Y(y); ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3.2; ctx.beginPath(); ctx.arc(X, Y, r || 10, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }

// ---------- the function library: exact-looking values and substitutions ----------
var LIB = {
  p3:{ s:"x + 3", f:function(x){ return x + 3; } },
  m3:{ s:"x − 3", f:function(x){ return x - 3; } },
  sq:{ s:"x^2", f:function(x){ return x * x; } },
  rt:{ s:"√x", f:function(x){ return x >= 0 ? Math.sqrt(x) : NaN; }, need:"ge", lo:0 },
  rc:{ s:"1/x", f:function(x){ return x !== 0 ? 1 / x : NaN; }, need:"ne" },
  ex:{ s:"2^x", f:function(x){ return Math.pow(2, x); } },
  lg:{ s:"log_{2} x", f:function(x){ return x > 0 ? Math.log2(x) : NaN; }, need:"gt", lo:1e-12 }
};
var IDS = ["p3", "m3", "sq", "rt", "rc", "ex", "lg"], KIND = { p3:"sum", m3:"sum", sq:"sq", rt:"rad", rc:"frac", ex:"pow", lg:"log" };
function acc(id, v){ var n = LIB[id].need; if (!isFinite(v)) return false; return n === "ge" ? v >= 0 : n === "ne" ? v !== 0 : n === "gt" ? v > 0 : true; }
function isEx(v){ if (!isFinite(v)) return false; var s = v * 1e4; return Math.abs(s - Math.round(s)) <= 1e-9 * Math.max(1, Math.abs(s)); }
// a value: exact decimals (≤ 4 places) print as numbers; anything else keeps its exact form s (m() source)
function VAL(v, s, k){
  if (Math.abs(v) > 1e6) return { v:v, s:s, k:k, ex:false, big:true };
  if (isEx(v)) { var r = Math.round(v * 1e4) / 1e4; if (Object.is(r, -0)) r = 0; return { v:r, s:num(r, 4), k:r < 0 ? "neg" : "n", ex:true }; }
  return { v:v, s:s, k:k, ex:false };
}
function sub(id, a){
  var s = a.s, br = "(" + s + ")";
  if (id === "p3") return s + " + 3";
  if (id === "m3") return s + " − 3";
  if (id === "sq") return (a.k === "n" ? s : br) + "^2";
  if (id === "rt") return "√{" + s + "}";
  if (id === "rc") return "1/" + (a.k === "n" || a.k === "rad" ? s : br);
  if (id === "ex") return "2^{" + s + "}";
  return "log_{2}" + (a.k === "n" || a.k === "rad" ? " " + s : br);
}
function apply(id, a, U){
  var s = sub(id, a);
  if (!acc(id, a.v)) return { ok:false, sub:s, why:id === "rt" ? U.why.rt : id === "rc" ? U.why.rc : a.v === 0 ? U.why.lg0 : U.why.lgn };
  return { ok:true, sub:s, out:VAL(LIB[id].f(a.v), s, KIND[id]) };
}
function bigTxt(v, U){ return v > 0 ? U.big : U.bigNeg; }
function eqHTML(lhs, r, U){
  var head = lhs + " = " + r.sub;
  if (!r.ok) return m(head) + " " + r.why;
  var u = r.out;
  if (u.big) return m(head) + ", " + bigTxt(u.v, U);
  return m(u.ex ? head + " = " + u.s : head + " ≈ " + num(u.v, 2));
}
function shortV(u){ return u.ex ? num(u.v, 4) : "≈ " + num(u.v, 2); }
function pipe(inner, outer, x, U){
  var a = VAL(x), r1 = apply(inner, a, U), r = { x:x, a:a, r1:r1, inner:inner, outer:outer };
  if (r1.ok) { r.u = r1.out.v; r.r2 = apply(outer, r1.out, U); if (r.r2.ok) r.y = r.r2.out.v; }
  r.ok = !!(r.r2 && r.r2.ok); r.fail = !r1.ok ? 1 : !r.r2.ok ? 2 : 0;
  return r;
}
function compF(key){ var o = key.split("|"), F = LIB[o[0]].f, G = LIB[o[1]].f; return function(x){ return F(G(x)); }; }

// composite table (outer|inner): [composite, simplified, domain code, range condition, "lhs|when|rhs" for √, 1/x and log outers]
var TAB = {
  "p3|p3":["(x + 3) + 3", "x + 6", "R", ""], "p3|m3":["(x − 3) + 3", "x", "R", ""], "p3|sq":["x^2 + 3", "", "R", "y ≥ 3"], "p3|rt":["√x + 3", "", "ge:0", "y ≥ 3"],
  "p3|rc":["1/x + 3", "", "ne:0", "y ≠ 3"], "p3|ex":["2^x + 3", "", "R", "y > 3"], "p3|lg":["log_{2} x + 3", "", "gt:0", ""],
  "m3|p3":["(x + 3) − 3", "x", "R", ""], "m3|m3":["(x − 3) − 3", "x − 6", "R", ""], "m3|sq":["x^2 − 3", "", "R", "y ≥ −3"], "m3|rt":["√x − 3", "", "ge:0", "y ≥ −3"],
  "m3|rc":["1/x − 3", "", "ne:0", "y ≠ −3"], "m3|ex":["2^x − 3", "", "R", "y > −3"], "m3|lg":["log_{2} x − 3", "", "gt:0", ""],
  "sq|p3":["(x + 3)^2", "", "R", "y ≥ 0"], "sq|m3":["(x − 3)^2", "", "R", "y ≥ 0"], "sq|sq":["(x^2)^2", "x^4", "R", "y ≥ 0"], "sq|rt":["(√x)^2", "x, for x ≥ 0", "ge:0", "y ≥ 0"],
  "sq|rc":["(1/x)^2", "1/x^2", "ne:0", "y > 0"], "sq|ex":["(2^x)^2", "4^x", "R", "y > 0"], "sq|lg":["(log_{2} x)^2", "", "gt:0", "y ≥ 0"],
  "rt|p3":["√{x + 3}", "", "ge:-3", "y ≥ 0", "x + 3 ≥ 0|when|x ≥ −3"], "rt|m3":["√{x − 3}", "", "ge:3", "y ≥ 0", "x − 3 ≥ 0|when|x ≥ 3"],
  "rt|sq":["√{x^2}", "x for x ≥ 0, −x for x < 0", "R", "y ≥ 0", "x^2 ≥ 0|for every|x"], "rt|rt":["√{√x}", "^{4}√x", "ge:0", "y ≥ 0", "√x ≥ 0|for every|x ≥ 0"],
  "rt|rc":["√{1/x}", "1/√x", "gt:0", "y > 0", "1/x ≥ 0|when|x > 0"], "rt|ex":["√{2^x}", "2^{x/2}", "R", "y > 0", "2^x ≥ 0|for every|x"],
  "rt|lg":["√{log_{2} x}", "", "ge:1", "y ≥ 0", "log_{2} x ≥ 0|when|x ≥ 1"],
  "rc|p3":["{1}/{x + 3}", "", "ne:-3", "y ≠ 0", "x + 3 ≠ 0|when|x ≠ −3"], "rc|m3":["{1}/{x − 3}", "", "ne:3", "y ≠ 0", "x − 3 ≠ 0|when|x ≠ 3"],
  "rc|sq":["1/x^2", "", "ne:0", "y > 0", "x^2 ≠ 0|when|x ≠ 0"], "rc|rt":["1/√x", "", "gt:0", "y > 0", "√x ≠ 0|when|x > 0"],
  "rc|rc":["1/(1/x)", "x, for x ≠ 0", "ne:0", "y ≠ 0", "1/x ≠ 0|for every|x ≠ 0"], "rc|ex":["1/2^x", "2^{−x}", "R", "y > 0", "2^x ≠ 0|for every|x"],
  "rc|lg":["{1}/{log_{2} x}", "", "x1", "y ≠ 0", "log_{2} x ≠ 0|when|x ≠ 1"],
  "ex|p3":["2^{x + 3}", "", "R", "y > 0"], "ex|m3":["2^{x − 3}", "", "R", "y > 0"], "ex|sq":["2^{x^2}", "", "R", "y ≥ 1"], "ex|rt":["2^{√x}", "", "ge:0", "y ≥ 1"],
  "ex|rc":["2^{1/x}", "", "ne:0", "y > 0, y ≠ 1"], "ex|ex":["2^{2^x}", "", "R", "y > 1"], "ex|lg":["2^{log_{2} x}", "x, for x > 0", "gt:0", "y > 0"],
  "lg|p3":["log_{2}(x + 3)", "", "gt:-3", "", "x + 3 > 0|when|x > −3"], "lg|m3":["log_{2}(x − 3)", "", "gt:3", "", "x − 3 > 0|when|x > 3"],
  "lg|sq":["log_{2}(x^2)", "", "ne:0", "", "x^2 > 0|when|x ≠ 0"], "lg|rt":["log_{2} √x", "{1}/{2} log_{2} x", "gt:0", "", "√x > 0|when|x > 0"],
  "lg|rc":["log_{2}(1/x)", "−log_{2} x", "gt:0", "", "1/x > 0|when|x > 0"], "lg|ex":["log_{2}(2^x)", "x", "R", "", "2^x > 0|for every|x"],
  "lg|lg":["log_{2}(log_{2} x)", "", "gt:1", "", "log_{2} x > 0|when|x > 1"]
};
function domTxt(c){
  if (c === "R") return "{x ∈ ℝ}";
  if (c === "x1") return "{x ∈ ℝ | x > 0, x ≠ 1}";
  var p = c.split(":"); return "{x ∈ ℝ | x " + { ge:"≥", gt:">", ne:"≠" }[p[0]] + " " + num(+p[1]) + "}";
}
function domPieces(c){
  var I = Infinity; if (c === "R") return [[-I, I, 0, 0]]; if (c === "x1") return [[0, 1, 0, 0], [1, I, 0, 0]];
  var p = c.split(":"), a = +p[1];
  return p[0] === "ge" ? [[a, I, 1, 0]] : p[0] === "gt" ? [[a, I, 0, 0]] : [[-I, a, 0, 0], [a, I, 0, 0]];
}
function rangeTxt(r){ return r ? "{y ∈ ℝ | " + r + "}" : "{y ∈ ℝ}"; }

// composite pieces (curves + end dots) for key on [lo, hi] (G1 breaks, G2 filled dots and open circles)
function compScene(key, R, o){
  var F = compF(key), curves = [], pts = [], ink = css("--ink");
  domPieces(TAB[key][2]).forEach(function(pc){
    var a = Math.max(pc[0], R[0]), b = Math.min(pc[1], R[1]); if (!(b > a)) return;
    curves.push({ f:F, color:ink, width:o.dash ? 3 : 3.4, dash:o.dash || null, domain:[a + (pc[2] ? 0 : 1e-9), b] });
    [[pc[0], pc[2], 1], [pc[1], pc[3], -1]].forEach(function(e){
      var ex = e[0]; if (!isFinite(ex) || ex < R[0] - 1e-9 || ex > R[1] + 1e-9) return;
      if (e[1]) pts.push({ x:ex, y:F(ex), color:ink, r:5 });
      else { var L = F(ex + e[2] * 1e-9); if (isFinite(L) && Math.abs(L) < 40) pts.push({ x:ex, y:L, open:true, color:ink, r:5.5 }); }
    });
  });
  return { curves:curves, pts:pts };
}
function drawLib(id, color, width){ var F = LIB[id]; return { f:F.f, color:color, width:width, domain:F.lo != null ? [F.lo, Infinity] : undefined }; }
function fnColor(n){ return n === "g" ? css("--f3") : css("--pen"); }
function fnWidth(n){ return n === "g" ? 2.6 : 3; }

// ---------- the two tables for Table machines (N14) ----------
var TBL = { g:{ xs:[-2, -1, 0, 1, 2, 3], ys:[3, 1, 0, -1, 2, 5] }, f:{ xs:[-1, 0, 1, 2, 3, 4], ys:[4, 2, 0, -2, 1, 3] }, fi:{ xs:[-2, 0, 1, 2, 3, 4], ys:[2, 1, 3, 0, 4, -1] } };
var TNAME = { f:"f", g:"g", fi:"f^{-1}" };
function tLook(n, x){ if (x == null) return null; var t = TBL[n], i = t.xs.indexOf(x); return i < 0 ? null : t.ys[i]; }

// ---------- hero: two machines, then they trade places ----------
function heroStrip(host, order, U){
  var M = { g:'<div class="cf-mach cf-c-g" data-h="g"><span class="cf-mn">' + m("g") + '</span><span class="cf-mf">' + m("x + 1") + "</span></div>",
    f:'<div class="cf-mach cf-c-f" data-h="f"><span class="cf-mn">' + m("f") + '</span><span class="cf-mf">' + m("x^2") + "</span></div>" };
  host.innerHTML = '<div class="cf-sline"><div class="cf-io cf-in"><small>' + U.inLab + "</small><b>" + m("2") + '</b></div><span class="cf-arr"></span>' + M[order[0]] + '<span class="cf-arr"></span>' + M[order[1]] +
    '<span class="cf-arr"></span><div class="cf-io cf-out"><small>' + U.outLab + '</small><b class="cf-hout">?</b></div></div><span class="cf-ball" hidden><span></span></span>';
}
function hero(f){
  var C = MV.C, U = C.explore.ui, caps = C.hero.caps, strip = $("#cf-hstrip"); if (!f.canvas || !strip) return;
  var p = new MV.Plot(f.canvas, { xmin:-3, xmax:3, ymin:-1, ymax:10 });
  var H = RM ? { p1:true, c1:1, p2:true, c2:1, cap:3 } : { p1:false, c1:0, p2:false, c2:0, cap:0 };
  function capPaint(){ f.cap.innerHTML = caps.slice(0, H.cap).map(function(c, i){ return '<span class="cf-hc' + (i === 2 ? " cf-hfin" : "") + '">' + c + "</span>"; }).join(""); }
  p.render = function(){
    var ink = css("--ink"), cv = [];
    if (H.c1 > 0) cv.push({ f:function(x){ return (x + 1) * (x + 1); }, color:ink, width:3.4, domain:[-3, -3 + 6 * H.c1] });
    if (H.c2 > 0) cv.push({ f:function(x){ return x * x + 1; }, color:ink, width:3, dash:[10, 6], domain:[-3, -3 + 6 * H.c2] });
    var pts = []; if (H.p1) pts.push({ x:2, y:9, color:ink, r:5.5 }); if (H.p2) pts.push({ x:2, y:5, color:ink, r:5.5 });
    p.draw({ view:{ xmin:-3, xmax:3, ymin:-1, ymax:10 }, xTicks:{ step:1 }, yTicks:{ step:2 }, curves:cv, points:pts,
      after:function(ctx){
        if (H.p1) cmath(ctx, "(2, 9)", p.X(2) - 10, p.Y(9) - 4, { size:13, align:"right" });
        if (H.p2) cmath(ctx, "(2, 5)", p.X(2) + 10, p.Y(5) + 10, { size:13 });
        if (H.c1 >= 1) cmath(ctx, "y = (x + 1)^2", p.X(-2.6), p.Y(8.2), { size:13 });
        if (H.c2 >= 1) cmath(ctx, "y = x^2 + 1", p.X(-0.4), p.Y(0.6), { size:13, align:"center" });
      },
      describe:"Graph from x = −3 to 3. " + (H.c1 >= 1 ? "Solid curve y = (x + 1)², through (2, 9). " : "") + (H.c2 >= 1 ? "Dashed curve y = x² + 1, through (2, 5)." : "") });
  };
  if (RM) { heroStrip(strip, "fg", U); strip.classList.add("on"); strip.querySelector(".cf-hout").innerHTML = m("5"); capPaint(); p.render(); return; }
  heroStrip(strip, "gf", U); capPaint(); p.render();
  var ball = strip.querySelector(".cf-ball");
  function at(sel){ return rect(strip.querySelector(sel), strip); }
  function put(P, lab){ ball.hidden = false; ball.style.transform = "translate(" + P.x + "px," + P.y + "px) translate(-50%,-50%)"; if (lab != null) ball.firstChild.innerHTML = m(lab); }
  function roll(P, Q, dur, next){ MV.tween({ dur:dur, step:function(t){ put({ x:lerp(P.x, Q.x, t), y:lerp(P.y, Q.y, t) }); }, done:next }); }
  function pass(first, second, v1, v2, after){
    var A = at(".cf-in"), B = at('[data-h="' + first + '"]'), Cc = at('[data-h="' + second + '"]'), D = at(".cf-out");
    put(A, "2"); roll(A, B, 450, function(){ put(B, v1); MV.wait(250, function(){ roll(B, Cc, 500, function(){ put(Cc, v2); MV.wait(250, function(){ roll(Cc, D, 400, function(){ ball.hidden = true; strip.querySelector(".cf-hout").innerHTML = m(v2); after(); }); }); }); }); });
  }
  MV.wait(200, function(){ strip.classList.add("on"); });
  MV.wait(900, function(){
    pass("g", "f", "3", "9", function(){
      H.cap = 1; capPaint(); H.p1 = true; p.render();
      MV.tween({ dur:1000, ease:LIN, step:function(t){ H.c1 = t; p.render(); }, done:function(){
        MV.wait(500, function(){
          var a = strip.querySelector('[data-h="g"]'), b = strip.querySelector('[data-h="f"]'), ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), dx = rb.left + rb.width / 2 - ra.left - ra.width / 2;
          strip.querySelector(".cf-hout").textContent = "?";
          MV.tween({ dur:600, step:function(t){ var o = Math.sin(Math.PI * t) * 18; a.style.transform = "translate(" + dx * t + "px," + (-o) + "px)"; b.style.transform = "translate(" + (-dx * t) + "px," + o + "px)"; }, done:function(){
            heroStrip(strip, "fg", U); strip.classList.add("on"); ball = strip.querySelector(".cf-ball");
            MV.wait(300, function(){
              pass("f", "g", "4", "5", function(){
                H.cap = 2; capPaint(); H.p2 = true; p.render();
                MV.tween({ dur:1000, ease:LIN, step:function(t){ H.c2 = t; p.render(); }, done:function(){ H.cap = 3; capPaint(); } });
              });
            });
          } });
        });
      } });
    });
  });
}

// ---------- Explore: the two-machine pipeline ----------
var EXV = { xmin:-5, xmax:9, ymin:-5, ymax:9 };
function explore(host, api){
  var C = api.content, U = C.ui, R = U.rows;
  var S = def(api.S, { mode:"formula", f:"sq", g:"m3", order:"fg", both:false, xi:12, view:"two", to:"f", ti:"g", sent:[], last:null, commit:null });
  if (!LIB[S.f]) S.f = "sq"; if (!LIB[S.g]) S.g = "m3"; if (!TBL[S.to]) S.to = "f"; if (!TBL[S.ti]) S.ti = "g";
  var V = { stage:4, fronts:[null, null], flash:null, tr:{}, head:null, tracing:false, busy:false, ring:null, outHide:false, domFlash:false, pred:false, tbl:null, cancels:[], timers:[], onAbort:null, open:false };
  host.innerHTML = '<div class="cf-ex" id="cf-ex">' +
    '<div class="cf-ctl"><div id="cf-mode"></div>' +
      '<div class="cf-fctl"><div id="cf-fch"></div><div id="cf-gch"></div><div class="cf-row"><div id="cf-ord"></div><button type="button" class="btn ghost sm cf-tog" id="cf-both" aria-pressed="false">' + U.both + '</button><div id="cf-view"></div></div></div>' +
      '<div class="cf-tctl"><div id="cf-och"></div><div id="cf-ich"></div></div></div>' +
    '<div class="cf-stage" data-mv="graph"><div class="eq-cap cf-cap" id="cf-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="cf-strip" id="cf-strip"><div class="cf-sline" id="cf-sline" role="group"></div><span class="cf-ball" id="cf-ball" hidden aria-hidden="true"><span></span></span></div>' +
      '<div class="cf-runrow"><div class="cf-inwrap cf-fctl" id="cf-xsl"></div><div class="cf-btns"><button type="button" class="btn primary sm" id="cf-run">' + U.run + '</button><button type="button" class="btn sm" id="cf-trace">' + U.trace + '</button><button type="button" class="btn primary sm" id="cf-fill">' + U.fill + '</button><button type="button" class="btn ghost sm" id="cf-reset">' + U.reset + "</button></div></div>" +
      '<div class="cf-main"><div class="cf-look" id="cf-look">' +
        '<div class="cf-two"><div><p class="cf-gcap" id="cf-cap0"></p><div class="plot-wrap"><canvas class="plot square" id="cf-p0" role="img"></canvas></div></div><div><p class="cf-gcap" id="cf-cap1"></p><div class="plot-wrap"><canvas class="plot square" id="cf-p1" role="img"></canvas></div></div></div>' +
        '<div class="cf-one"><div class="plot-wrap"><canvas class="plot square" id="cf-p2" role="img"></canvas></div><p class="cf-legend" id="cf-leg"></p></div>' +
        '<div class="cf-tables" id="cf-tables"></div><span class="cf-vchip" id="cf-vchip" hidden aria-hidden="true"></span>' +
      '</div><div class="cf-read" id="cf-readw"><dl class="read" id="cf-read" aria-live="polite"></dl><button type="button" class="btn ghost sm cf-morebtn" id="cf-more" aria-expanded="false">' + U.more + "</button></div></div>" +
    "</div></div>";
  var root = $("#cf-ex", host), sline = $("#cf-sline", host), strip = $("#cf-strip", host), look = $("#cf-look", host), tablesHost = $("#cf-tables", host), chip = $("#cf-vchip", host), ballEl = $("#cf-ball", host);
  var P0 = new MV.Plot($("#cf-p0", host), EXV), P1 = new MV.Plot($("#cf-p1", host), EXV), P2 = new MV.Plot($("#cf-p2", host), EXV, { equal:true });
  function X(){ return -4 + 0.5 * S.xi; }
  function cur(){ var fg = S.order === "fg"; return { inner:fg ? S.g : S.f, outer:fg ? S.f : S.g, iN:fg ? "g" : "f", oN:fg ? "f" : "g", key:fg ? S.f + "|" + S.g : S.g + "|" + S.f }; }
  function pipeNow(){ var c = cur(); return pipe(c.inner, c.outer, X(), U); }
  function save(){ api.save(); }
  // ----- animation bookkeeping -----
  function tw(o){ V.cancels.push(MV.tween(o)); }
  function wt(ms, fn){ V.timers.push(MV.wait(ms, fn)); }
  function halt(){
    V.cancels.forEach(function(c){ c(); }); V.timers.forEach(clearTimeout); V.cancels = []; V.timers = [];
    V.busy = false; V.tracing = false; V.head = null; ballEl.hidden = true; chip.hidden = true;
    Array.prototype.forEach.call(sline.querySelectorAll(".cf-mach"), function(el){ el.style.transform = ""; });
  }
  function stopAll(){ halt(); V.outHide = false; V.stage = 4; if (V.onAbort) { var f = V.onAbort; V.onAbort = null; f(); } }
  function resetRun(){ V.fronts = [null, null]; V.flash = null; V.stage = 4; V.ring = null; V.outHide = false; }
  // ----- controls -----
  var modeRG = radios($("#cf-mode", host), { aria:"Mode", options:[{ id:"formula", t:U.modes[0] }, { id:"table", t:U.modes[1] }], value:S.mode,
    onChange:function(v){ stopAll(); S.mode = v; resetRun(); V.tbl = null; save(); paint(); MV.changed(); } });
  function fnOpts(){ return IDS.map(function(id){ return { id:id, t:m(LIB[id].s), aria:MV.plain(m(LIB[id].s)) }; }); }
  var fRG = radios($("#cf-fch", host), { label:m("f") + ":", aria:"Function f", cls:"chips cf-fn", options:fnOpts(), value:S.f, onChange:function(v){ stopAll(); S.f = v; V.tr = {}; resetRun(); save(); paint(); MV.changed(); } });
  var gRG = radios($("#cf-gch", host), { label:m("g") + ":", aria:"Function g", cls:"chips cf-fn", options:fnOpts(), value:S.g, onChange:function(v){ stopAll(); S.g = v; V.tr = {}; resetRun(); save(); paint(); MV.changed(); } });
  var ordRG = radios($("#cf-ord", host), { aria:"Order", options:[{ id:"fg", t:U.orders[0] }, { id:"gf", t:U.orders[1] }], value:S.order, onChange:function(v){ stopAll(); swapAnim(v); } });
  var viewRG = radios($("#cf-view", host), { aria:"View", options:[{ id:"two", t:U.views[0] }, { id:"one", t:U.views[1] }], value:S.view, onChange:function(v){ S.view = v; chip.hidden = true; save(); paint(); } });
  var oRG = radios($("#cf-och", host), { label:U.outer, aria:"Outer machine", cls:"chips cf-fn", options:["f", "g", "fi"].map(function(n){ return { id:n, t:m(TNAME[n]) }; }), value:S.to, onChange:function(v){ stopAll(); S.to = v; S.sent = []; S.last = null; V.tbl = null; resetRun(); save(); paint(); MV.changed(); } });
  var iRG = radios($("#cf-ich", host), { label:U.inner, aria:"Inner machine", cls:"chips cf-fn", options:["f", "g", "fi"].map(function(n){ return { id:n, t:m(TNAME[n]) }; }), value:S.ti, onChange:function(v){ stopAll(); S.ti = v; S.sent = []; S.last = null; V.tbl = null; resetRun(); save(); paint(); MV.changed(); } });
  var xsl = stepSlider($("#cf-xsl", host), { id:"x", name:"input x", label:U.input, color:"--ink", n:25, idx:S.xi, big:4,
    fmt:function(i){ return m(num(-4 + 0.5 * i)); }, say:function(i){ return "x = " + num(-4 + 0.5 * i); }, onChange:function(i){ setXi(i); } });
  function setXi(i){ stopAll(); S.xi = clamp(i, 0, 24); resetRun(); xsl.set(S.xi); save(); paint(); MV.changed(); }
  function syncControls(){ modeRG.set(S.mode); fRG.set(S.f); gRG.set(S.g); ordRG.set(S.order); viewRG.set(S.view); oRG.set(S.to); iRG.set(S.ti); xsl.set(S.xi); }
  $("#cf-both", host).addEventListener("click", function(){ stopAll(); S.both = !S.both; save(); paint(); MV.changed(); });
  $("#cf-run", host).addEventListener("click", function(){ stopAll(); run(); });
  $("#cf-trace", host).addEventListener("click", function(){ if (V.tracing) { stopAll(); paint(); return; } stopAll(); var c = cur(); startTrace(S.both ? [S.f + "|" + S.g, S.g + "|" + S.f] : [c.key]); });
  $("#cf-fill", host).addEventListener("click", function(){ stopAll(); fillTable(); });
  $("#cf-reset", host).addEventListener("click", function(){ stopAll(); S.mode = "formula"; S.f = "sq"; S.g = "m3"; S.order = "fg"; S.xi = 12; S.view = "two"; S.both = false; V.tr = {}; resetRun(); syncControls(); save(); paint(); MV.changed(); });
  $("#cf-more", host).addEventListener("click", function(){ V.open = !V.open; paint(); });
  tablesHost.addEventListener("click", function(e){ var b = e.target.closest("[data-row]"); if (!b) return; stopAll(); sendRow(+b.dataset.row, [500, 400]); });
  // draggable input dot on the x-axis (G7): inner graph in Two graphs view, the single graph in One graph view
  function dragOn(p, view){
    MV.drag(p, { axis:"x", step:{ x:0.5, y:1 }, big:4,
      handles:function(){ return S.mode === "formula" && S.view === view ? [{ id:"x", x:X(), y:0, label:"Input x = " + num(X()) + ". Arrow keys move it." }] : []; },
      snap:function(x){ return [clamp(Math.round(x * 2) / 2, -4, 8), 0]; },
      move:function(id, x){ var i = Math.round((x + 4) * 2); if (i !== S.xi) setXi(i); } });
  }
  dragOn(P0, "two"); dragOn(P2, "one");
  // ----- the machine strip -----
  function slots(){
    if (S.mode === "formula") { var c = cur(); return [{ n:c.iN, form:m(LIB[c.inner].s) }, { n:c.oN, form:m(LIB[c.outer].s) }]; }
    return [{ n:S.ti, form:U.table }, { n:S.to, form:U.table }];
  }
  function renderStrip(){
    var sI = slots(), xs = "?", out = "?", arr = '<span class="cf-arr" aria-hidden="true"></span>';
    if (S.mode === "formula") { var r = pipeNow(); xs = m(num(X())); if (!V.outHide) out = r.ok ? (r.r2.out.big ? m((r.y > 0 ? "> " : "< −") + "1 000 000") : m(shortV(r.r2.out))) : "—"; }
    else if (S.last != null) { xs = m(num(S.last)); if (!V.outHide) { var y = tLook(S.to, tLook(S.ti, S.last)); out = y == null ? "—" : m(num(y)); } }
    function mach(i){
      var s = sI[i], fl = V.flash && V.flash.slot === i;
      return '<div class="cf-mach cf-c-' + s.n + (fl ? " cf-rej" : "") + '" data-slot="' + i + '"><span class="cf-mn">' + m(TNAME[s.n]) + '</span><span class="cf-mf">' + s.form + '</span><span class="cf-mfront">' + (fl ? '<span class="cf-rejm">' + V.flash.msg + "</span>" : (V.fronts[i] || "")) + "</span></div>";
    }
    sline.innerHTML = '<div class="cf-io cf-in"><small>' + U.inLab + "</small><b>" + xs + "</b></div>" + arr + mach(0) + arr + mach(1) + arr + '<div class="cf-io cf-out"><small>' + U.outLab + "</small><b>" + out + "</b></div>";
    sline.setAttribute("aria-label", MV.plain(U.stripLab + ": " + sI.map(function(s){ return m(TNAME[s.n]) + " (" + s.form + ")"; }).join(", then ")));
  }
  function renderCap(){
    var cap = $("#cf-cap", host);
    if (S.mode === "formula") {
      var c = cur(), r = pipeNow(), xs = num(X()), s = c.oN + "(" + c.iN + "(" + xs + "))";
      if (!r.r1.ok) { cap.innerHTML = m(s) + U.undefTail; return; }
      s += " = " + c.oN + "(" + r.r1.out.s + ")";
      if (!r.r2.ok) { cap.innerHTML = m(s) + U.undefTail; return; }
      var u = r.r2.out; cap.innerHTML = u.big ? m(s) + ", " + bigTxt(u.v, U) : m(s + (u.ex ? " = " + u.s : " ≈ " + num(u.v, 2)));
      return;
    }
    var nm = TNAME[S.to] + "(" + TNAME[S.ti] + "(";
    if (S.last == null) { cap.innerHTML = m(nm + "x))"); return; }
    var uu = tLook(S.ti, S.last), yy = tLook(S.to, uu), t = nm + num(S.last) + ")) = " + TNAME[S.to] + "(" + num(uu) + ")";
    cap.innerHTML = yy == null ? m(t) + U.undefTail : m(t + " = " + num(yy));
  }
  // ----- readout -----
  function domHidden(){
    if (V.pred) return false;
    var ch = MV.S.chal || {}, st = ch.tc2;
    if (st && st.solved) return false;
    var done = (MV.C.explore.predictions || []).every(function(p){ return MV.S.preds && MV.S.preds[p.id]; });
    return done || !!(st && (st.tries || st.hint));
  }
  function renderRead(){
    var rows = [], dl = $("#cf-read", host);
    if (S.mode === "formula") {
      var c = cur(), r = pipeNow(), xs = num(X()), T = TAB[c.key], name = c.oN + "(" + c.iN + "(" + xs + "))", cn = c.oN + "(" + c.iN + "(x))";
      rows.push([R.order, m(cn) + ": " + fill(U.actsFirst, { 1:m(c.iN), 2:m(c.oN) })]);
      rows.push([R.input, m("x = " + xs)]);
      rows.push([R.m1, r.r1.ok ? eqHTML(c.iN + "(" + xs + ")", r.r1, U) : eqHTML(c.iN + "(" + xs + ")", r.r1, U) + ": " + fill(U.notIn, { 1:m(xs), 2:m(c.iN) })]);
      rows.push([R.m2, r.r1.ok ? eqHTML(c.oN + "(" + r.r1.out.s + ")", r.r2, U) + (r.r2.ok ? "" : ".") : "—"]);
      var res;
      if (!r.ok) res = m(name) + " " + fill(U.isUndef, { 1:m(xs), 2:m(cn) });
      else { var u = r.r2.out; res = u.big ? m(name) + " " + U.is + " " + bigTxt(u.v, U) : m(name + (u.ex ? " = " + u.s : " ≈ " + num(u.v, 2))); }
      rows.push([R.result, res]);
      var extra = [];
      if (S.both) {
        var r2 = pipe(c.outer, c.inner, X(), U), ch2 = c.iN + "(" + c.oN + "(" + xs + "))", line;
        if (!r2.r1.ok) line = m(ch2) + " " + fill(U.isUndef, { 1:m(xs), 2:m(c.oN) });
        else { line = eqHTML(ch2 + " = " + c.iN + "(" + r2.r1.out.s + ")", r2.r2, U) + (r2.r2.ok ? "" : "."); }
        extra.push([R.other, line]);
      }
      extra.push([R.comp, m(cn + " = " + T[0] + (T[1] ? " = " + T[1] : "")) + (c.key === "lg|sq" ? " " + U.lgsqNote : "")]);
      if (domHidden()) extra.push([R.dom, '<span class="muted">' + U.hiddenDom + "</span>"]);
      else {
        extra.push([R.dom, m(domTxt(T[2])), V.domFlash ? "cf-flash" : ""]);
        var nI = LIB[c.inner].need, nO = LIB[c.outer].need, w1 = nI ? fill(U.why1, { 1:m(c.iN), 2:m("x " + { ge:"≥", ne:"≠", gt:">" }[nI] + " 0") }) : fill(U.why1all, { 1:m(c.iN) });
        var w2;
        if (!nO) w2 = fill(U.why2all, { 1:m(c.oN) });
        else { var cc = T[4].split("|"); w2 = fill(U.why2, { 1:m(c.oN), 2:m(c.iN + "(x) " + { ge:"≥", ne:"≠", gt:">" }[nO] + " 0"), 3:m(cc[0]) + " " + cc[1] + " " + m(cc[2]) }); }
        extra.push([R.why, w1 + " " + w2]);
      }
      extra.push([R.range, m(rangeTxt(T[3]))]);
      extra.forEach(function(e){ e[2] = (e[2] || "") + " cf-extra"; });
      rows = rows.concat(extra);
    } else {
      var oN = TNAME[S.to], iN = TNAME[S.ti], cname = oN + "(" + iN + "(x))";
      rows.push([R.order, m(cname) + ": " + fill(U.tOrder, { 1:m("x"), 2:m(iN), 3:m(iN + "(x)"), 4:m(oN) })]);
      if (S.last == null) rows.push([R.l1, U.tableNone]);
      else {
        var x = S.last, u2 = tLook(S.ti, x), y2 = tLook(S.to, u2), nm = oN + "(" + iN + "(" + num(x) + "))";
        rows.push([R.l1, m(iN + "(" + num(x) + ") = " + num(u2))]);
        rows.push([R.l2, y2 == null ? fill(U.tMiss, { 1:m(num(u2)), 2:m(oN), 3:m(nm) }) : fill(U.tHit, { 1:m(oN + "(" + num(u2) + ") = " + num(y2)), 2:m(nm + " = " + num(y2)) })]);
      }
      var xsAll = TBL[S.ti].xs, sent = xsAll.filter(function(v){ return S.sent.indexOf(v) >= 0; }), okx = sent.filter(function(v){ return tLook(S.to, tLook(S.ti, v)) != null; });
      if (sent.length) rows.push([R.ctab, fill(sent.length === xsAll.length ? U.tDef : U.tDefSoFar, { 1:m(cname), 2:okx.length ? m("x = " + okx.map(function(v){ return num(v); }).join(", ")) : U.noRows, 3:okx.length, 4:xsAll.length }), " cf-extra"]);
      if (((S.to === "f" && S.ti === "fi") || (S.to === "fi" && S.ti === "f")) && sent.length === xsAll.length) rows.push([R.pattern, fill(U.pattern, { 1:m(cname.replace("(x))", "(x))")), 2:m(iN) }), " cf-extra"]);
    }
    dl.innerHTML = rows.map(function(r){ return '<div class="' + (r[2] || "").trim() + '"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    var w = $("#cf-readw", host); w.classList.toggle("open", V.open); var mb = $("#cf-more", host); mb.textContent = V.open ? U.less : U.more; mb.setAttribute("aria-expanded", String(V.open));
  }
  // ----- graphs -----
  function vTxt(v){ return isEx(v) ? num(v, 4) : "≈ " + num(v, 2); }
  function stageOf(){ return V.stage; }
  function pathOne(p, r, s, alpha, note){
    var x = r.x, P = [[x, 0]];
    if (r.r1.ok) { P.push([x, r.u], [r.u, r.u]); if (r.r2.ok) P.push([r.u, r.y], [x, r.y]); }
    var n = P.length - 1, lim = Math.min(s, n);
    for (var i = 0; i < n && i < lim; i++) { var t = clamp(lim - i, 0, 1), A = P[i], B = P[i + 1]; seg(p, A, [lerp(A[0], B[0], t), lerp(A[1], B[1], t)], { alpha:alpha, arrow:t >= 1 && Math.hypot(B[0] - A[0], B[1] - A[1]) > 0.8 }); }
    if (r.fail === 1 && s >= 0.5) cross(p, x, 0, note);
    if (r.fail === 2 && s >= 2.5) cross(p, r.u, r.u, note);
    if (r.r1.ok && s >= 2) { if (!edgeArrow(p, r.u, r.u, css("--ink-2"))) p.point({ x:r.u, y:r.u, r:3.5, color:css("--ink-2") }); }
    if (r.ok && s >= 4 && alpha == null) {
      if (!edgeArrow(p, x, r.y, css("--ink"))) { p.point({ x:x, y:r.y, ring:true, color:css("--ink"), r:5.5 }); cmath(p.ctx, "(" + num(x) + ", " + vTxt(r.y) + ")", p.X(x) + (p.X(x) > p.W * 0.6 ? -12 : 12), clamp(p.Y(r.y) - 14, 12, p.H - 12), { size:13, align:p.X(x) > p.W * 0.6 ? "right" : "left" }); }
    }
  }
  function noteFor(r, iN){ var N = U.notes; return r.fail === 1 ? N.inner[r.inner] : r.fail === 2 ? fill(N.outer[r.outer], { 1:iN }) : null; }
  function drawOne(){
    if (S.mode !== "formula" || S.view !== "one") return;
    var c = cur(), r = pipeNow(), cv = [drawLib(c.inner, fnColor(c.iN), fnWidth(c.iN)), drawLib(c.outer, fnColor(c.oN), fnWidth(c.oN))], pts = [];
    var want = S.both ? [[S.f + "|" + S.g, null], [S.g + "|" + S.f, [10, 6]]] : (V.tr[c.key] ? [[c.key, null]] : []);
    want.forEach(function(w){ var Rg = V.tr[w[0]] || (S.both && !V.tracing ? [-Infinity, Infinity] : null); if (!Rg) return; var sc = compScene(w[0], Rg, { dash:w[1] }); cv = cv.concat(sc.curves); pts = pts.concat(sc.pts); });
    P2.draw({ view:EXV, equal:true, xTicks:{ step:2 }, yTicks:{ step:2 }, curves:cv, points:pts,
      after:function(ctx, p){
        var lo = Math.max(p.v.xmin, p.v.ymin), hi = Math.min(p.v.xmax, p.v.ymax);
        p.segment({ x1:lo, y1:lo, x2:hi, y2:hi, color:css("--ink-2"), width:1.5, dash:[2, 5] });
        cmath(ctx, "y = x", p.X(7.6), p.Y(7.6) + 14, { size:12, color:css("--ink-2") });
        if (V.head) { var o = V.head.key.split("|"), hr = pipe(o[1], o[0], V.head.x, U); pathOne(p, hr, 4, 0.5, noteFor(hr, V.head.key === c.key ? c.iN : c.oN)); }
        else pathOne(p, r, stageOf(), null, null);
        p.point({ x:r.x, y:0, r:5, color:css("--ink"), ring:true });
        if (V.ring) ring(p, V.ring.x, V.ring.y, 11);
      },
      describe:describeOne(c, r) });
    $("#cf-leg", host).innerHTML = '<span><i class="cf-sw" style="background:var(' + (c.iN === "g" ? "--f3" : "--pen") + ')"></i>' + m(c.iN + "(x) = " + LIB[c.inner].s) + '</span><span><i class="cf-sw" style="background:var(' + (c.oN === "g" ? "--f3" : "--pen") + ')"></i>' + m(c.oN + "(x) = " + LIB[c.outer].s) + "</span>" +
      (want.length ? '<span><i class="cf-sw cf-sw-ink"></i>' + m((S.both ? "f(g(x))" : c.oN + "(" + c.iN + "(x))")) + "</span>" : "") + (S.both ? '<span><i class="cf-sw cf-sw-dash"></i>' + m("g(f(x))") + "</span>" : "");
  }
  function describeOne(c, r){
    var s = "One graph: " + MV.plain(m(c.iN + "(x) = " + LIB[c.inner].s)) + " and " + MV.plain(m(c.oN + "(x) = " + LIB[c.outer].s)) + ", with the line y = x. Input " + num(r.x) + ": ";
    s += r.r1.ok ? c.iN + "(" + num(r.x) + ") = " + vTxt(r.u) + (r.r2.ok ? ", " + c.oN + "(" + vTxt(r.u) + ") = " + vTxt(r.y) + ", composite point (" + num(r.x) + ", " + vTxt(r.y) + ")." : ", which " + c.oN + " can’t accept.") : c.iN + " can’t accept it.";
    if (V.tr[c.key] || S.both) s += " Composite " + MV.plain(m(TAB[c.key][0])) + " drawn.";
    return s;
  }
  function drawTwo(p, side){
    if (S.mode !== "formula" || S.view !== "two") return;
    var c = cur(), r = pipeNow(), id = side ? c.outer : c.inner, n = side ? c.oN : c.iN, s = stageOf();
    $("#cf-cap" + side, host).innerHTML = (side ? U.outerG : U.innerG) + " " + m(n + "(x) = " + LIB[id].s);
    p.draw({ view:EXV, xTicks:{ step:2 }, yTicks:{ step:2 }, curves:[drawLib(id, fnColor(n), fnWidth(n))],
      after:function(ctx){
        if (!side) {
          var t1 = clamp(s, 0, 1), t2 = clamp(s - 1, 0, 1);
          if (r.r1.ok) {
            if (t1 > 0) seg(p, [r.x, 0], [r.x, lerp(0, r.u, t1)], { arrow:t1 >= 1 && Math.abs(r.u) > 0.8 });
            if (t2 > 0) seg(p, [r.x, r.u], [lerp(r.x, 0, t2), r.u], { arrow:t2 >= 1 && Math.abs(r.x) > 0.8 });
            if (s >= 2) { if (!edgeArrow(p, r.x, r.u, css("--ink-2"))) { p.point({ x:r.x, y:r.u, r:4, color:fnColor(n) }); cmath(ctx, vTxt(r.u), clamp(p.X(0) - 6, 40, p.W), clamp(p.Y(r.u), 10, p.H - 10), { size:13, align:"right" }); } }
          } else if (s >= 0.5) cross(p, r.x, 0, null);
          p.point({ x:r.x, y:0, r:5, color:css("--ink"), ring:true });
        } else if (r.r1.ok) {
          var t3 = clamp((s - 2.5) * 2, 0, 1), t4 = clamp(s - 3, 0, 1);
          if (s >= 2.5) { p.point({ x:r.u, y:0, r:4, color:css("--ink") }); if (!edgeArrow(p, r.u, 0, css("--ink"))) cmath(ctx, vTxt(r.u), clamp(p.X(r.u), 30, p.W - 30), p.Y(0) + 26, { size:13, align:"center" }); }
          if (r.r2.ok) {
            if (t3 > 0) seg(p, [r.u, 0], [r.u, lerp(0, r.y, t3)], { arrow:t3 >= 1 && Math.abs(r.y) > 0.8 });
            if (t4 > 0) seg(p, [r.u, r.y], [lerp(r.u, 0, t4), r.y], { arrow:t4 >= 1 && Math.abs(r.u) > 0.8 });
            if (s >= 4) { if (!edgeArrow(p, r.u, r.y, css("--ink-2"))) { p.point({ x:r.u, y:r.y, r:4, color:fnColor(n) }); cmath(ctx, vTxt(r.y), clamp(p.X(0) - 6, 40, p.W), clamp(p.Y(r.y), 10, p.H - 10), { size:13, align:"right" }); } }
          } else if (s >= 2.5) cross(p, r.u, 0, null);
        }
      },
      describe:(side ? "Outer" : "Inner") + " graph: " + MV.plain(m(n + "(x) = " + LIB[id].s)) + ". " + (side ? (r.r1.ok ? (r.r2.ok ? "Input " + vTxt(r.u) + ": " + n + "(" + vTxt(r.u) + ") = " + vTxt(r.y) + "." : vTxt(r.u) + " is not in its domain.") : "Nothing reaches it.") : (r.r1.ok ? "Input " + num(r.x) + ": " + n + "(" + num(r.x) + ") = " + vTxt(r.u) + "." : num(r.x) + " is not in its domain.")) });
    if (side) placeChip(r, s);
  }
  function placeChip(r, s){
    if (!(r.r1.ok && s > 2 && s < 2.5) || S.view !== "two") { chip.hidden = true; return; }
    var lr = look.getBoundingClientRect(), a = P0.c.getBoundingClientRect(), b = P1.c.getBoundingClientRect(), t = clamp((s - 2) * 2, 0, 1);
    var ax = a.left - lr.left + clamp(P0.X(0), 0, P0.W), ay = a.top - lr.top + clamp(P0.Y(r.u), 0, P0.H), bx = b.left - lr.left + clamp(P1.X(r.u), 0, P1.W), by = b.top - lr.top + clamp(P1.Y(0), 0, P1.H);
    chip.hidden = false; chip.innerHTML = m(vTxt(r.u)); chip.style.left = lerp(ax, bx, t) + "px"; chip.style.top = lerp(ay, by, t) + "px";
  }
  P0.render = function(){ drawTwo(P0, 0); }; P1.render = function(){ drawTwo(P1, 1); }; P2.render = drawOne;
  function renderGraphs(){ P0.render(); P1.render(); P2.render(); }
  // ----- tables -----
  function paintTables(){
    var oN = TNAME[S.to], iN = TNAME[S.ti], it = TBL[S.ti], ot = TBL[S.to], tb = V.tbl || {};
    function hd(a, b){ return '<div class="cf-tr hd"><span>' + m(a) + "</span><span>" + m(b) + "</span></div>"; }
    var h = '<div class="cf-tw"><p class="cf-gcap">' + U.innerT + " " + m(iN) + '</p><div class="cf-tt" role="group" aria-label="' + MV.esc(MV.plain(U.innerT + " " + m(iN))) + '">' + hd("x", iN + "(x)") +
      it.xs.map(function(x, i){ return '<button type="button" class="cf-tr' + (tb.x === x ? " on" : "") + '" data-row="' + x + '" data-k="row' + i + '" aria-label="' + MV.esc(fill(U.sendLab, { 1:num(x), 2:MV.plain(m(iN + "(" + num(x) + ") = " + num(it.ys[i]))) })) + '"' + (V.busy ? " disabled" : "") + "><span>" + m(num(x)) + "</span><span data-v>" + m(num(it.ys[i])) + "</span></button>"; }).join("") + "</div></div>";
    h += '<div class="cf-tw"><p class="cf-gcap">' + U.outerT + " " + m(oN) + (tb.st === 3 ? ' <span class="cf-notin">' + U.notInput + "</span>" : "") + '</p><div class="cf-tt" data-t="outer">' + hd("x", oN + "(x)") +
      ot.xs.map(function(x, i){ return '<div class="cf-tr' + (tb.st >= 2 && tb.st < 3 && tb.u === x ? " on" : "") + '" data-orow="' + x + '"><span>' + m(num(x)) + "</span><span>" + m(num(ot.ys[i])) + "</span></div>"; }).join("") + "</div></div>";
    h += '<div class="cf-tw"><p class="cf-gcap">' + U.compT + '</p><div class="cf-tt" data-t="comp">' + hd("x", oN + "(" + iN + "(x))") +
      it.xs.map(function(x){ var sent = S.sent.indexOf(x) >= 0, y = tLook(S.to, tLook(S.ti, x)); return '<div class="cf-tr' + (tb.x === x && tb.st === 2.5 ? " on" : "") + '" data-crow="' + x + '"><span>' + m(num(x)) + "</span><span>" + (sent ? (y == null ? "—" : m(num(y))) : "") + "</span></div>"; }).join("") + "</div></div>";
    MV.keepFocus(tablesHost, function(){ tablesHost.innerHTML = h; });
  }
  function fly(from, to, html, dur, cb){
    if (!from || !to || RM) { cb(); return; }
    var a = rect(from, look), b = rect(to, look);
    chip.hidden = false; chip.innerHTML = html;
    tw({ dur:dur, step:function(t){ chip.style.left = lerp(a.x, b.x, t) + "px"; chip.style.top = lerp(a.y, b.y, t) + "px"; }, done:function(){ chip.hidden = true; cb(); } });
  }
  function sendRow(x, dur, done){
    halt(); var u = tLook(S.ti, x), y = tLook(S.to, u), oN = TNAME[S.to], iN = TNAME[S.ti];
    V.busy = true; V.tbl = { x:x, u:u, y:y, st:1 }; S.last = x; V.outHide = true; V.flash = null; V.fronts = [m(iN + "(" + num(x) + ") = " + num(u)), null];
    paint();
    var src = tablesHost.querySelector('[data-row="' + x + '"] [data-v]'), row = tablesHost.querySelector('[data-orow="' + u + '"]'), outT = tablesHost.querySelector('[data-t="outer"]');
    fly(src, row ? row.lastChild : outT, m(num(u)), dur[0], function(){
      if (y == null) {
        V.tbl.st = 3; V.flash = { slot:1, msg:fill(U.cant, { 1:m(num(u)) }) }; finish();
        var o2 = tablesHost.querySelector('[data-t="outer"]'); if (o2 && !RM) o2.classList.add("cf-shake");
        return;
      }
      V.tbl.st = 2; V.fronts[1] = m(oN + "(" + num(u) + ") = " + num(y)); paintTables(); renderStrip();
      var r2 = tablesHost.querySelector('[data-orow="' + u + '"]'), cc = tablesHost.querySelector('[data-crow="' + x + '"]');
      fly(r2 && r2.lastChild, cc && cc.lastChild, m(num(y)), dur[1], function(){ V.tbl.st = 2.5; finish(); });
    });
    function finish(){ if (S.sent.indexOf(x) < 0) S.sent.push(x); V.busy = false; V.outHide = false; save(); paint(); MV.changed(); if (done) done(); }
  }
  function fillTable(){
    var xs = TBL[S.ti].xs.slice(), i = 0;
    function next(){ if (i >= xs.length) return; var x = xs[i++]; sendRow(x, [400, 300], function(){ V.busy = true; wt(100, function(){ V.busy = false; next(); }); }); }
    next();
  }
  // ----- run: a ball through both machines, the graph path in step -----
  function ballAt(P, lab){ ballEl.hidden = false; ballEl.style.transform = "translate(" + P.x + "px," + P.y + "px) translate(-50%,-50%)"; if (lab != null) ballEl.firstChild.innerHTML = lab; }
  function run(done){
    if (S.mode !== "formula") { if (done) done(); return; }
    halt();
    var r = pipeNow(), c = cur(), xs = num(X());
    V.busy = true; V.fronts = [null, null]; V.flash = null; V.stage = 0; V.outHide = true; V.ring = null; paint();
    var A = rect(sline.querySelector(".cf-in"), strip), B = rect(sline.querySelector('[data-slot="0"]'), strip), Cc = rect(sline.querySelector('[data-slot="1"]'), strip), D = rect(sline.querySelector(".cf-out"), strip), BC = mid(B, Cc);
    function front(i, html){ V.fronts[i] = html; var f = sline.querySelector('[data-slot="' + i + '"] .cf-mfront'); if (f) f.innerHTML = html; }
    function end(){ V.busy = false; V.stage = 4; V.outHide = false; ballEl.hidden = true; paint(); MV.changed(); if (done) done(); }
    function reject(i, at, back, val){
      V.flash = { slot:i, msg:fill(U.cant, { 1:m(val) }) }; V.stage = i ? 2.5 : 0.5; renderStrip(); renderGraphs();
      tw({ dur:380, step:function(t){ ballAt({ x:lerp(at.x, back.x, t), y:lerp(at.y, back.y, t) }); }, done:function(){ wt(500, end); } });
    }
    ballAt(A, m(xs));
    tw({ dur:400, step:function(t){ ballAt({ x:lerp(A.x, B.x, t), y:lerp(A.y, B.y, t) }); }, done:function(){
      if (!r.r1.ok) { reject(0, B, mid(A, B), xs); return; }
      front(0, eqHTML(c.iN + "(" + xs + ")", r.r1, U));
      tw({ dur:500, ease:LIN, step:function(t){ V.stage = 2 * t; renderGraphs(); }, done:function(){
        ballAt(B, m(shortV(r.r1.out)));
        tw({ dur:350, step:function(t){ ballAt({ x:lerp(B.x, BC.x, t), y:lerp(B.y, BC.y, t) }); V.stage = 2 + 0.5 * t; renderGraphs(); }, done:function(){
          tw({ dur:400, step:function(t){ ballAt({ x:lerp(BC.x, Cc.x, t), y:lerp(BC.y, Cc.y, t) }); V.stage = r.r2.ok ? 2.5 + 0.5 * t : 2.49; renderGraphs(); }, done:function(){
            if (!r.r2.ok) { reject(1, Cc, BC, r.r1.out.s); return; }
            front(1, eqHTML(c.oN + "(" + r.r1.out.s + ")", r.r2, U));
            wt(450, function(){
              ballAt(Cc, r.r2.out.big ? m((r.y > 0 ? "> " : "< −") + "10^6") : m(shortV(r.r2.out)));
              tw({ dur:350, step:function(t){ ballAt({ x:lerp(Cc.x, D.x, t), y:lerp(Cc.y, D.y, t) }); V.stage = 3 + t; renderGraphs(); }, done:end });
            });
          } });
        } });
      } });
    } });
  }
  // ----- swap: the machines slide past each other and trade places -----
  function swapAnim(v, done){
    halt();
    var a = sline.querySelector('[data-slot="0"]'), b = sline.querySelector('[data-slot="1"]');
    function fin(){ a.style.transform = ""; b.style.transform = ""; S.order = v; ordRG.set(v); resetRun(); V.busy = false; save(); paint(); MV.changed(); if (done) done(); }
    if (S.mode !== "formula" || !a || !b) { fin(); return; }
    var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), dx = rb.left + rb.width / 2 - ra.left - ra.width / 2, dy = rb.top + rb.height / 2 - ra.top - ra.height / 2, vert = Math.abs(dy) > Math.abs(dx);
    V.busy = true; V.fronts = [null, null]; V.flash = null; ballEl.hidden = true;
    Array.prototype.forEach.call(sline.querySelectorAll(".cf-mfront"), function(el){ el.innerHTML = ""; });
    tw({ dur:600, step:function(t){ var o = Math.sin(Math.PI * t) * 24;
      a.style.transform = "translate(" + (dx * t + (vert ? o : 0)) + "px," + (dy * t - (vert ? 0 : o)) + "px)";
      b.style.transform = "translate(" + (-dx * t - (vert ? o : 0)) + "px," + (-dy * t + (vert ? 0 : o)) + "px)"; }, done:fin });
  }
  // ----- trace: sweep the input and grow the composite -----
  function startTrace(list, done, full){
    halt(); S.view = "one"; viewRG.set("one"); V.tracing = true; V.busy = true; V.ring = null; paint();
    var i = 0;
    function next(){
      if (i >= list.length) { V.tracing = false; V.busy = false; V.head = null; save(); paint(); MV.changed(); if (done) done(); return; }
      var it = list[i++], key = typeof it === "string" ? it : it[0], from = typeof it === "string" ? -5 : it[1], to = typeof it === "string" ? 9 : it[2];
      if (typeof it === "string") delete V.tr[key];
      var old = V.tr[key];
      tw({ dur:Math.abs(to - from) / 14 * (full || 4000), ease:LIN, step:function(t){
        var x = lerp(from, to, t), lo = Math.min(from, x), hi = Math.max(from, x);
        if (old) { lo = Math.min(lo, old[0]); hi = Math.max(hi, old[1]); }
        V.tr[key] = [lo, hi]; V.head = t < 1 ? { key:key, x:x } : null; P2.render();
      }, done:function(){ V.head = null; next(); } });
    }
    next();
  }
  function syncBtns(){
    var f = S.mode === "formula";
    $("#cf-run", host).disabled = V.busy || !f; $("#cf-fill", host).disabled = V.busy;
    var tb = $("#cf-trace", host); tb.textContent = V.tracing ? U.stop : U.trace; tb.disabled = V.busy && !V.tracing;
    var bb = $("#cf-both", host); bb.setAttribute("aria-pressed", String(S.both));
  }
  function paint(){
    root.className = "cf-ex " + (S.mode === "formula" ? "is-formula" : "is-table") + " v-" + S.view;
    renderStrip(); renderCap(); renderRead();
    if (S.mode === "formula") renderGraphs(); else { chip.hidden = true; paintTables(); }
    syncBtns();
  }
  // ----- TC3: commit chips inside the challenge prompt -----
  var CH = C.challenges, CM = CH[2].commit;
  function commitUI(){
    var box = document.querySelector("#chal [data-cf-commit]"); if (!box) return;
    if (!box.firstChild) box.innerHTML = '<span class="tiny cf-cl">' + CM.label + '</span><span class="cf-cchips"><button type="button" class="chip" data-commit="match" data-k="cmtm">' + CM.match + '</button><button type="button" class="chip" data-commit="differ" data-k="cmtd">' + CM.differ + '</button></span><span class="tiny muted cf-cnote" data-cnote></span>';
    Array.prototype.forEach.call(box.querySelectorAll("[data-commit]"), function(b){ var on = S.commit === b.dataset.commit; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
    var note = box.querySelector("[data-cnote]"), txt = S.commit ? MV.plain(fill(CM.said, { 1:CM[S.commit] })) : MV.plain(CM.need);
    if (note && note.textContent !== txt) note.textContent = txt;
    var chk = document.querySelector('#chal [data-c="tc3"] [data-act="check"]'); if (chk && chk.disabled !== !S.commit) chk.disabled = !S.commit;
  }
  var chal = document.getElementById("chal");
  if (chal) {
    new MutationObserver(commitUI).observe(chal, { childList:true, subtree:true });
    chal.addEventListener("click", function(e){ var b = e.target.closest("[data-commit]"); if (!b) return; S.commit = b.dataset.commit; save(); commitUI(); MV.liveChallenges(); });
  }
  function sameGraph(a, b){
    var F = compF(a + "|" + b), G = compF(b + "|" + a);
    for (var x = -8; x <= 10; x += 0.0625) {
      var xs = [x, x + 0.0173]; for (var k = 0; k < 2; k++) { var y1 = F(xs[k]), y2 = G(xs[k]); if (isNaN(y1) !== isNaN(y2)) return false; if (!isNaN(y1) && Math.abs(y1 - y2) > 1e-9 * Math.max(1, Math.abs(y1))) return false; }
    }
    return true;
  }
  function challenge(id, opt){
    var M;
    if (id === "tc1") {
      M = CH[0].msgs;
      if (S.mode !== "table") return { ok:false, msg:M.mode };
      if (S.to === "g" && S.ti === "f") return { ok:false, msg:M.swapped };
      if (!(S.to === "f" && S.ti === "g")) return { ok:false, msg:M.pair };
      if (S.last == null) return { ok:false, msg:M.none };
      if (S.last === 1) return { ok:true };
      if (S.last === -1) return { ok:false, msg:M.rowM1 };
      if (S.last === 3) return { ok:false, msg:M.row3 };
      return { ok:false, msg:fill(M.other, { 1:num(S.last), 2:num(tLook("f", tLook("g", S.last))) }) };
    }
    if (id === "tc2") {
      M = CH[1].msgs;
      if (S.mode !== "formula") return { ok:false, msg:M.mode };
      var k = cur().key;
      if (TAB[k][2] === "ge:1") { if (!opt.live) setTimeout(paint, 0); return { ok:true }; }
      if (!opt.live) setTimeout(paint, 0);
      if (k === "lg|lg") return { ok:false, msg:M.lglg };
      if (k === "rt|m3") return { ok:false, msg:M.rtm3 };
      if (k === "sq|lg" || k === "lg|rt") return { ok:false, msg:M.lgout };
      return { ok:false, msg:fill(M.other, { 1:m(domTxt(TAB[k][2])) }) };
    }
    if (id === "tc3") {
      M = CH[2].msgs;
      if (S.mode !== "formula") return { ok:false, msg:M.mode };
      if (opt.live && !S.commit) return { ok:false };
      var ok = S.f !== S.g && sameGraph(S.f, S.g);
      if (!opt.live && S.f !== S.g) setTimeout(function(){ stopAll(); S.both = true; startTrace([S.f + "|" + S.g, S.g + "|" + S.f]); }, 0);
      if (ok) return { ok:true };
      var pr = [S.f, S.g].sort().join("|");
      if (S.f === S.g) return { ok:false, msg:M.same };
      if (pr === "ex|lg") return { ok:false, msg:M.explog };
      if (pr === "rt|sq") return { ok:false, msg:M.sqrt };
      if (pr === "p3|sq" || pr === "m3|sq") return { ok:false, msg:M.shiftsq };
      return { ok:false, msg:M.other };
    }
    return { ok:false };
  }
  // ----- predictions -----
  var predict = {
    start:function(p){
      stopAll(); var s = p.start;
      S.mode = "formula"; S.f = s.f; S.g = s.g; S.order = s.order; S.xi = (s.x + 4) * 2; S.view = s.view; S.both = false;
      V.tr = {}; if (s.traced) V.tr[S.f + "|" + S.g] = s.traced.slice(); resetRun(); V.pred = true;
      if (s.ran) { var r = pipeNow(), c = cur(); V.fronts = [eqHTML(c.iN + "(" + num(X()) + ")", r.r1, U), eqHTML(c.oN + "(" + r.r1.out.s + ")", r.r2, U)]; }
      syncControls(); save(); paint();
    },
    run:function(p, done){
      var once = false;
      function fin(){ if (once) return; once = true; V.onAbort = null; V.pred = false; V.domFlash = false; save(); paint(); MV.changed(); done(); }
      V.onAbort = fin;
      if (p.id === "p1") swapAnim("gf", function(){ run(function(){ wt(500, function(){ S.both = true; S.view = "one"; viewRG.set("one"); paint(); startTrace([S.f + "|" + S.g, S.g + "|" + S.f], function(){ V.ring = { x:-1, y:4 }; paint(); wt(700, fin); }, 2600); }); }); });
      else if (p.id === "p2") startTrace([cur().key], function(){ V.domFlash = true; V.open = true; paint(); wt(1600, fin); });
      else if (p.id === "p3") startTrace([cur().key], function(){ wt(500, function(){ swapAnim("gf", function(){ startTrace([cur().key], fin, 3000); }); }); });
      else if (p.id === "p4") startTrace([[cur().key, 0, -5]], function(){ S.xi = 2; xsl.set(2); resetRun(); paint(); run(fin); });
      else fin();
    }
  };
  paint();
  return { predict:predict, challenge:challenge };
}

// ---------- Part 3 ----------
// Station A: a linear function L(x) = A(x + B) inside or outside a parent
var AST = [-2, -1, -0.5, 0.5, 1, 2];
var PAR = {
  sq:{ s:"x^2", f:function(x){ return x * x; }, keys:[[-1, 1], [0, 0], [1, 1], [2, 4]], kp:[1, 1] },
  rt:{ s:"√x", f:function(x){ return x >= 0 ? Math.sqrt(x) : NaN; }, keys:[[0, 0], [1, 1], [4, 2]], kp:[1, 1] },
  ex:{ s:"2^x", f:function(x){ return Math.pow(2, x); }, keys:[[-1, 0.5], [0, 1], [1, 2], [2, 4]], kp:[1, 2] }
};
function fr(v){ return MV.frac(v, 12); }               // inline fraction text: 1/2, −3/2
function frS(v){ var t = fr(v); return /\//.test(t) ? (t.charAt(0) === MINUS ? MINUS : "") + "{" + t.replace(MINUS, "").split("/")[0] + "}/{" + t.split("/")[1] + "}" : t; }   // stacked m() source
function coefS(A){ return A === 1 ? "" : A === -1 ? MINUS : frS(A); }
function linS(A, B){ return coefS(A) + (B === 0 ? "x" : "(x " + (B > 0 ? "+ " : "− ") + Math.abs(B) + ")"); }
function inS(par, A, B){ var L = linS(A, B); return par === "sq" ? (L === "x" ? "x^2" : "(" + L + ")^2") : par === "rt" ? "√{" + L + "}" : "2^{" + L + "}"; }
function timesS(A, fs, par){ return A === 1 ? fs : A === -1 ? MINUS + fs : frS(A) + (par === "ex" ? " · " : "") + fs; }
function outS(par, A, B){
  var fs = PAR[par].s, AB = A * B, tail = AB === 0 ? "" : (AB > 0 ? " + " : " − ") + frS(Math.abs(AB));
  if (B === 0) return timesS(A, fs, par);
  if (A === 1) return fs + tail;
  return coefS(A) + "(" + fs + (B > 0 ? " + " : " − ") + Math.abs(B) + ") = " + timesS(A, fs, par) + tail;
}
function stationA(host, api, SA){
  var S = api.S.A = def(api.S.A || {}, { parent:"rt", ai:4, B:0, pos:"in", keys:true, cur:"S1", t:{} }), U = SA.ui, RR = U.rows;
  var V = { anim:null, msg:{} };
  host.innerHTML = '<h3 class="cf-h3">' + SA.title + "</h3>" +
    '<div class="cf-sa"><div class="cf-sa-l"><div class="cf-mini" id="sa-strip" aria-hidden="true"></div><div class="plot-wrap"><canvas class="plot" id="sa-plot" role="img"></canvas></div></div>' +
    '<div class="cf-sa-r"><div id="sa-par"></div><div id="sa-A"></div><div id="sa-B"></div><div class="cf-row"><div id="sa-pos"></div><button type="button" class="btn ghost sm cf-tog" id="sa-keys" aria-pressed="true">' + U.keys + '</button></div><dl class="read" id="sa-read" aria-live="polite"></dl></div>' +
    '<div class="cf-tgt"><h4>' + U.targets + '</h4><p class="how">' + U.intro + '</p><div id="sa-tsel"></div><div id="sa-tcard"></div><p class="tiny muted" id="sa-tally"></p></div></div>';
  var plot = new MV.Plot($("#sa-plot", host), { xmin:-8, xmax:8, ymin:-4, ymax:8 }, { equal:true });
  function A(){ return AST[S.ai]; }
  function F(par, a, b, pos){ var P = PAR[par].f; return pos === "in" ? function(x){ return P(a * (x + b)); } : function(x){ return a * (P(x) + b); }; }
  function mapPt(pt, a, b, pos){ return pos === "in" ? [pt[0] / a - b, pt[1]] : [pt[0], a * pt[1] + a * b]; }
  function dom(par, a, b, pos){ if (par !== "rt") return null; if (pos === "out") return [0, Infinity]; return a > 0 ? [-b, Infinity] : [-Infinity, -b]; }
  var parRG = radios($("#sa-par", host), { label:U.parent, aria:"Parent function", cls:"chips cf-fn", options:["sq", "rt", "ex"].map(function(k){ return { id:k, t:m(PAR[k].s) }; }), value:S.parent, onChange:function(v){ S.parent = v; V.anim = null; save(); paint(); } });
  var aSl = stepSlider($("#sa-A", host), { id:"A", name:"A", label:U.A, color:"--ink", n:6, idx:S.ai, fmt:function(i){ return m(frS(AST[i])); }, say:function(i){ return "A = " + fr(AST[i]); }, onChange:function(i){ S.ai = i; V.anim = null; save(); paint(); } });
  var bSl = stepSlider($("#sa-B", host), { id:"B", name:"B", label:U.B, color:"--ink", n:7, idx:S.B + 3, fmt:function(i){ return m(num(i - 3)); }, say:function(i){ return "B = " + num(i - 3); }, onChange:function(i){ S.B = i - 3; V.anim = null; save(); paint(); } });
  var posRG = radios($("#sa-pos", host), { aria:"Position of L", options:[{ id:"in", t:U.pos[0] }, { id:"out", t:U.pos[1] }], value:S.pos, onChange:function(v){ changePos(v); } });
  $("#sa-keys", host).addEventListener("click", function(){ S.keys = !S.keys; save(); paint(); });
  function save(){ api.save(); }
  function changePos(v){
    var a = A(), b = S.B, old = { pos:S.pos, F:F(S.parent, a, b, S.pos), dom:dom(S.parent, a, b, S.pos), pts:PAR[S.parent].keys.map(function(pt){ return mapPt(pt, a, b, S.pos); }) };
    var st = $("#sa-strip", host), Lb = st.querySelector(".cf-L"), Pb = st.querySelector(".cf-P");
    var dx = Lb && Pb ? (Pb.getBoundingClientRect().left + Pb.getBoundingClientRect().width / 2) - (Lb.getBoundingClientRect().left + Lb.getBoundingClientRect().width / 2) : 0;
    S.pos = v; save(); V.anim = { t:0, old:old };
    MV.tween({ dur:800, step:function(t){ V.anim.t = t; if (Lb) { Lb.style.transform = "translate(" + dx * t + "px," + (-Math.sin(Math.PI * t) * 14) + "px)"; Pb.style.transform = "translate(" + (-dx * t) + "px," + (Math.sin(Math.PI * t) * 14) + "px)"; } drawPlot(); },
      done:function(){ V.anim = null; paint(); } });
    renderRead();
  }
  function stripHTML(){
    var L = '<span class="cf-box cf-L">' + m("L(x) = " + linS(A(), S.B)) + "</span>", P = '<span class="cf-box cf-P">' + m("f(x) = " + PAR[S.parent].s) + "</span>", ar = '<span class="cf-arr"></span>';
    return '<span class="cf-mx">' + m("x") + "</span>" + ar + (S.pos === "in" ? L + ar + P : P + ar + L) + ar + '<span class="cf-mx">' + m("y") + "</span>";
  }
  function targ(){ return SA.targets.filter(function(t){ return t.id === S.cur; })[0]; }
  function tst(id){ return S.t[id] || (S.t[id] = { tries:0, hint:0, solved:false, first:null, found:[] }); }
  function drawPlot(){
    var a = A(), b = S.B, par = S.parent, ink = css("--ink"), ink2 = css("--ink-2"), T = targ(), cv = [], pts = [];
    var tgt = TGT[T.id];
    cv.push({ f:tgt.f, color:ink2, width:7, alpha:0.22, domain:tgt.dom });
    cv.push({ f:PAR[par].f, color:ink2, width:2, dash:[6, 6], alpha:0.6, domain:par === "rt" ? [0, Infinity] : undefined });
    var t = V.anim ? V.anim.t : 1, newF = F(par, a, b, S.pos), d = dom(par, a, b, S.pos);
    if (V.anim) cv.push({ f:V.anim.old.F, color:ink, width:3.4, alpha:1 - t, domain:V.anim.old.dom || undefined });
    cv.push({ f:newF, color:ink, width:3.4, alpha:V.anim ? t : 1, domain:d || undefined });
    var newPts = PAR[par].keys.map(function(pt){ return mapPt(pt, a, b, S.pos); });
    var shown = newPts.map(function(q, i){ var o = V.anim ? V.anim.old.pts[i] : q; return [lerp(o[0], q[0], t), lerp(o[1], q[1], t)]; });
    plot.draw({ view:{ xmin:-8, xmax:8, ymin:-4, ymax:8 }, equal:true, xTicks:{ step:2 }, yTicks:{ step:2 }, curves:cv,
      after:function(ctx, p){
        tgt.pts.forEach(function(q){ ring(p, q[0], q[1], 9); });
        PAR[par].keys.forEach(function(q, i){
          p.point({ x:q[0], y:q[1], r:3.5, color:ink2 });
          if (S.keys) { var s2 = shown[i]; if (Math.hypot(s2[0] - q[0], s2[1] - q[1]) > 0.3) p.segment({ x1:q[0], y1:q[1], x2:s2[0], y2:s2[1], color:ink2, width:1.4, arrow:true }); }
        });
        if (S.keys) shown.forEach(function(s2){ p.point({ x:s2[0], y:s2[1], r:4.5, color:ink }); });
        cmath(ctx, "y = f(x)", p.X(par === "rt" ? 5.2 : par === "sq" ? 2.3 : 2.6), p.Y(par === "rt" ? 2.9 : 6.5), { size:12, color:ink2 });
      },
      describe:"Parent y = " + MV.plain(m(PAR[par].s)) + " dashed; composite " + MV.plain(m("y = " + (S.pos === "in" ? inS(par, a, b) : outS(par, a, b).split(" = ")[0]))) + " solid; faint target curve with three ringed points. " + MV.plain(T.prompt) });
  }
  function renderRead(){
    var a = A(), b = S.B, par = S.parent, pin = S.pos === "in", kp = PAR[par].kp, img = mapPt(kp, a, b, S.pos), rows = [];
    rows.push([RR.comp, m("y = " + (pin ? inS(par, a, b) : outS(par, a, b)))]);
    if (pin) rows.push([RR.std, m("y = f(@k{k}(x − @d{d}))") + " " + U.with + " " + m("@k{k} = @k{" + fr(a) + "}") + ", " + m("@d{d} = @d{" + num(-b) + "}")]);
    else rows.push([RR.std, m("y = @a{a}f(x) + @c{c}") + " " + U.with + " " + m("@a{a} = @a{" + fr(a) + "}") + ", " + m("@c{c} = @c{" + fr(a * b) + "}")]);
    var W = U.what, parts = [], tr = "";
    if (pin) {
      if (a < 0) parts.push(W.reflY);
      if (Math.abs(a) < 1) parts.push(fill(W.hStr, { 1:fr(1 / Math.abs(a)) })); else if (Math.abs(a) > 1) parts.push(fill(W.hComp, { 1:fr(1 / Math.abs(a)) }));
      if (b) tr = fill(b > 0 ? W.left : W.right, { 1:num(Math.abs(b)), 2:Math.abs(b) === 1 ? W.unit : W.units });
    } else {
      if (a < 0) parts.push(W.reflX);
      if (Math.abs(a) > 1) parts.push(fill(W.vStr, { 1:fr(Math.abs(a)) })); else if (Math.abs(a) < 1) parts.push(fill(W.vComp, { 1:fr(Math.abs(a)) }));
      if (a * b) tr = fill(a * b > 0 ? W.up : W.down, { 1:fr(Math.abs(a * b)), 2:Math.abs(a * b) === 1 ? W.unit : W.units });
    }
    var what = parts.join(", ") + (tr ? (parts.length ? W.then : "") + tr : "");
    rows.push([RR.what, what ? cap1(what) : W.none]);
    rows.push([RR.key, m("(" + num(kp[0]) + ", " + num(kp[1]) + ") → (" + num(img[0]) + ", " + num(img[1]) + ")")]);
    var dm = par !== "rt" ? "{x ∈ ℝ}" : !pin ? "{x ∈ ℝ | x ≥ 0}" : a > 0 ? "{x ∈ ℝ | x ≥ " + num(-b) + "}" : "{x ∈ ℝ | x ≤ " + num(-b) + "}";
    rows.push([RR.dom, m(dm)]);
    var rg, gt = par === "ex";
    if (pin) rg = gt ? "{y ∈ ℝ | y > 0}" : "{y ∈ ℝ | y ≥ 0}";
    else rg = "{y ∈ ℝ | y " + (a > 0 ? (gt ? ">" : "≥") : (gt ? "<" : "≤")) + " " + fr(a * b) + "}";
    rows.push([RR.range, m(rg)]);
    $("#sa-read", host).innerHTML = MV.readoutHTML(rows);
  }
  var tselRG = radios($("#sa-tsel", host), { aria:"Choose a target", cls:"chips", options:SA.targets.map(function(t, i){ return { id:t.id, t:U.tName + " " + (i + 1) }; }), value:S.cur,
    onChange:function(v){ S.cur = v; var T = targ(); if (S.parent !== T.parent) { S.parent = T.parent; parRG.set(T.parent); } save(); paint(); } });
  function tselPaint(){ /* tick marks on solved targets */ Array.prototype.forEach.call($("#sa-tsel", host).querySelectorAll("[data-rg]"), function(bt, i){ var st = S.t[SA.targets[i].id]; bt.innerHTML = (st && st.solved ? "✓ " : "") + U.tName + " " + (i + 1); }); }
  function setting(){ return [S.pos, A(), S.B]; }
  function same(a, b){ return a[0] === b[0] && Math.abs(a[1] - b[1]) < 1e-9 && a[2] === b[2]; }
  function check(){
    var T = targ(), st = tst(T.id), s = setting(), ans = MV.ans(T);
    if (S.parent !== T.parent) { V.msg[T.id] = { bad:true, html:fill(U.parentFirst, { 1:m("y = " + PAR[T.parent].s) }) }; return; }
    var hit = ans.filter(function(a){ return same(a, s); })[0];
    if (hit) {
      if (ans.length === 1) { st.solved = true; st.first = st.tries === 0 && st.hint < 3; V.msg[T.id] = null; return; }
      var key = hit.join(",");
      if (st.found.indexOf(key) >= 0) { st.tries++; V.msg[T.id] = { bad:true, html:T.again }; return; }
      st.found.push(key);
      if (st.found.length >= ans.length) { st.solved = true; st.first = st.tries === 0 && st.hint < 3; V.msg[T.id] = null; }
      else V.msg[T.id] = { bad:false, html:T.oneMore };
      return;
    }
    st.tries++;
    var nm = (T.named || []).filter(function(n){ return n.pos === s[0] && Math.abs(n.A - s[1]) < 1e-9 && (n.B === undefined || n.B === s[2]); })[0];
    V.msg[T.id] = { bad:true, html:nm ? nm.fb : SA.general };
  }
  function cardPaint(){
    var T = targ(), st = tst(T.id), msg = V.msg[T.id], h = '<div class="q-head"><div class="q-prompt">' + T.prompt + "</div></div>";
    if (MV.ans(T).length > 1 && st.found.length && !st.solved) h += '<p class="tiny">' + fill(U.found, { 1:st.found.map(function(k){ var p = k.split(","); return (p[0] === "in" ? U.inW : U.outW) + " " + m("A = " + fr(+p[1]) + ", B = " + num(+p[2])); }).join("; ") }) + "</p>";
    if (st.solved) h += '<div class="fb good" role="status"><p><strong>' + U.met + "</strong> " + (T.both || "") + (st.first ? "" : ' <span class="muted">' + U.notFirst + "</span>") + "</p></div>";
    else {
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="tcheck" data-k="sachk">' + U.check + "</button>" + MV.hintBtn("sah" + T.id, st.hint) + "</div>" + MV.hintsHTML(T.hints, st.hint);
      if (msg) h += msg.bad ? '<div class="fb bad" role="status"><p><strong>' + U.notYet + "</strong> " + msg.html + "</p></div>" : '<div class="fb" role="status"><p>' + msg.html + "</p></div>";
    }
    MV.keepFocus($("#sa-tcard", host), function(){ $("#sa-tcard", host).innerHTML = h; });
    var f = SA.targets.filter(function(t){ return tst(t.id).first; }).length;
    $("#sa-tally", host).textContent = fill(U.tally, { 1:f });
    tselPaint();
  }
  $("#sa-tcard", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var T = targ(), st = tst(T.id);
    if (b.dataset.act === "hint") { st.hint = Math.min(3, st.hint + 1); save(); cardPaint(); return; }
    if (b.dataset.act === "tcheck") { check(); save(); cardPaint(); MV.focusFb($("#sa-tcard", host)); }
  });
  function paint(){ $("#sa-strip", host).innerHTML = stripHTML(); $("#sa-keys", host).setAttribute("aria-pressed", String(S.keys)); drawPlot(); renderRead(); cardPaint(); }
  plot.render = drawPlot;
  paint();
  MV.ACTS.stationA = { a:{ id:"stationA" },
    stats:function(){ var f = 0, d = 0; SA.targets.forEach(function(t){ var y = S.t[t.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:3, done:d, line:fill(U.sumLine, { 1:f }) + (d < 3 ? " " + U.unfinished : "") }; },
    missed:function(){ return SA.targets.some(function(t){ var y = S.t[t.id]; return y && (y.tries > 0 || y.hint >= 3); }) ? MV.goalIdx(6) : []; } };
}
var TGT = {
  S1:{ f:function(x){ var v = 2 * x + 6; return v >= 0 ? Math.sqrt(v) : NaN; }, dom:[-3, Infinity], pts:[[-3, 0], [-2.5, 1], [-1, 2]] },
  S2:{ f:function(x){ return Math.pow(2, x + 1); }, dom:undefined, pts:[[-1, 1], [0, 2], [1, 4]] },
  S3:{ f:function(x){ var v = 3 - x; return v >= 0 ? Math.sqrt(v) : NaN; }, dom:[-Infinity, 3], pts:[[3, 0], [2, 1], [-1, 2]] }
};

// Station B: decompose it (N7 select all that apply, with a card tester)
function sq(v){ return v >= 0 ? Math.sqrt(v) : NaN; }
function inv(v){ return v === 0 || !isFinite(v) ? NaN : 1 / v; }
var DFN = {
  d1:{ h:function(x){ return Math.pow(2 * x - 5, 3); }, c:[[function(x){ return 2 * x - 5; }, function(x){ return x * x * x; }], [function(x){ return x * x * x; }, function(x){ return 2 * x - 5; }], [function(x){ return 2 * x; }, function(x){ return Math.pow(x - 5, 3); }], [function(x){ return 2 * x - 5; }, function(x){ return 3 * x; }]] },
  d2:{ h:function(x){ return Math.sqrt(x * x + 9); }, c:[[function(x){ return x * x + 9; }, sq], [function(x){ return x * x; }, function(x){ return sq(x + 9); }], [sq, function(x){ return x * x + 9; }], [function(x){ return x * x; }, function(x){ return sq(x) + 3; }]] },
  d3:{ h:function(x){ return inv((x - 4) * (x - 4)); }, c:[[function(x){ return x - 4; }, function(x){ return inv(x * x); }], [function(x){ return (x - 4) * (x - 4); }, inv], [inv, function(x){ return (x - 4) * (x - 4); }], [function(x){ return x * x; }, function(x){ return inv(x - 4); }]] },
  d4:{ h:function(x){ return (3 * x + 1) * (3 * x + 1) + 5; }, c:[[function(x){ return 3 * x + 1; }, function(x){ return x * x + 5; }], [function(x){ return (3 * x + 1) * (3 * x + 1); }, function(x){ return x + 5; }], [function(x){ return 3 * x; }, function(x){ return (x + 1) * (x + 1) + 5; }], [function(x){ return x * x + 5; }, function(x){ return 3 * x + 1; }]] }
};
function qTxt(v, U){
  if (!isFinite(v) || isNaN(v)) return U.undef;
  if (isEx(v)) return m(num(v, 4));
  for (var d = 2; d <= 400; d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return m(num(n) + "/" + d); }
  return m("≈ " + num(v, 2));
}
function ulMark(html){ return html.replace(/⟦/g, '<span class="cf-ul">').replace(/⟧/g, "</span>"); }
function stationB(host, api, SB){
  var S = api.S.B = def(api.S.B || {}, { cur:0, items:{}, tx:{} }), U = SB.ui, V = { test:null, msg:{} }, L = "abcd";
  host.innerHTML = '<h3 class="cf-h3">' + SB.title + '</h3><p class="how">' + SB.intro + '</p><div id="sb-sel"></div>' +
    '<div class="cf-sb"><div class="cf-sb-l"><p class="cf-hbig" id="sb-h"></p><div class="cf-cards" id="sb-cards"></div><div id="sb-act"></div></div>' +
    '<div class="cf-sb-r"><div class="cf-strip cf-mini2" id="sb-strip"></div><div id="sb-x"></div><div class="plot-wrap"><canvas class="plot" id="sb-plot" role="img"></canvas></div><p class="cf-legend" id="sb-leg"></p></div></div>';
  var plot = new MV.Plot($("#sb-plot", host), { xmin:-5, xmax:5, ymin:-2, ymax:10 });
  function it(){ return SB.items[S.cur]; }
  function ist(id){ return S.items[id] || (S.items[id] = { sel:[], tries:0, hint:0, solved:false, first:null }); }
  function tx(){ var I = it(); return S.tx[I.id] != null ? S.tx[I.id] : I.test; }
  var selRG = radios($("#sb-sel", host), { aria:"Choose a function to decompose", cls:"chips", options:SB.items.map(function(I, i){ return { id:i, t:U.fn + " " + (i + 1) }; }), value:S.cur,
    onChange:function(v){ S.cur = +v; V.test = null; api.save(); paint(); } });
  var xSl = stepSlider($("#sb-x", host), { id:"sbx", name:"test input", label:U.input, color:"--ink", n:11, idx:tx() + 5, fmt:function(i){ return m("x = " + num(i - 5)); }, say:function(i){ return "x = " + num(i - 5); },
    onChange:function(i){ S.tx[it().id] = i - 5; api.save(); paintTest(); } });
  function paintSel(){ Array.prototype.forEach.call($("#sb-sel", host).querySelectorAll("[data-rg]"), function(bt, i){ var st = S.items[SB.items[i].id]; bt.innerHTML = (st && st.solved ? "✓ " : "") + U.fn + " " + (i + 1); }); }
  function paintTest(){
    var I = it(), st = ist(I.id), x = tx(), ci = V.test, c = ci == null ? null : I.cards[ci], fn = DFN[I.id];
    $("#sb-h", host).innerHTML = c && c.u ? ulMark(m("h(x) = " + c.u)) : m("h(x) = " + I.hs);
    var sh;
    if (c == null) sh = '<p class="tiny muted">' + U.pick + "</p>";
    else {
      var g = fn.c[ci][0](x), y = fn.c[ci][1](g);
      sh = '<div class="cf-sline"><div class="cf-io"><small>' + U.inLab + "</small><b>" + m(num(x)) + '</b></div><span class="cf-arr"></span><div class="cf-mach cf-c-g"><span class="cf-mn">' + m("g") + '</span><span class="cf-mf">' + c.g + '</span><span class="cf-mfront">' + m("g(" + num(x) + ") =") + " " + qTxt(g, U) + '</span></div><span class="cf-arr"></span>' +
        '<div class="cf-mach cf-c-f"><span class="cf-mn">' + m("f") + '</span><span class="cf-mf">' + c.f + '</span><span class="cf-mfront">' + (isFinite(g) ? m("f(") + qTxt(g, U) + m(") =") + " " + qTxt(y, U) : "—") + '</span></div><span class="cf-arr"></span><div class="cf-io"><small>' + U.outLab + "</small><b>" + qTxt(y, U) + "</b></div></div>" +
        '<p class="tiny">' + fill(U.hAt, { 1:m("h(" + num(x) + ") ="), 2:qTxt(fn.h(x), U) }) + "</p>";
    }
    $("#sb-strip", host).innerHTML = sh;
    drawPlot();
  }
  function drawPlot(){
    var I = it(), st = ist(I.id), fn = DFN[I.id], ans = MV.ans(I), cv = [], ink = css("--ink"), pen = css("--pen"), x = tx();
    var show = st.solved ? ans : (V.test == null ? [] : [V.test]);
    var comps = show.map(function(ci){ return function(t){ return fn.c[ci][1](fn.c[ci][0](t)); }; });
    cv.push({ f:fn.h, color:ink, width:3.4 });
    comps.forEach(function(F){ cv.push({ f:F, color:pen, width:3 }); });
    plot.draw({ view:{ xmin:-5, xmax:5, ymin:-2, ymax:10 }, xTicks:{ step:1 }, yTicks:{ step:2 }, curves:cv,
      after:function(ctx, p){
        if (comps.length === 1 && !st.solved) {          // shade the gap where the card differs from h (G6)
          var F = comps[0]; ctx.save(); ctx.fillStyle = css("--hi-soft");
          for (var px = 0; px < p.W; px += 2) { var t = p.xOf(px + 1), a = fn.h(t), b = F(t); if (isFinite(a) && isFinite(b) && Math.abs(a - b) > 1e-6) { var y1 = clamp(p.Y(Math.max(a, b)), -5, p.H + 5), y2 = clamp(p.Y(Math.min(a, b)), -5, p.H + 5); ctx.fillRect(px, y1, 2, y2 - y1); } }
          ctx.restore();
          var y = F(x); if (isFinite(y)) p.point({ x:x, y:y, r:4.5, color:pen });
        }
        var hy = fn.h(x); if (isFinite(hy)) p.point({ x:x, y:hy, r:5, color:ink, ring:true });
      },
      describe:"Graph of h(x) = " + MV.plain(m(I.hs)) + " in ink" + (comps.length ? ", with " + (st.solved ? "every valid card’s composite on top of it" : "the tested card’s composite in blue") : "") + "." });
    $("#sb-leg", host).innerHTML = '<span><i class="cf-sw cf-sw-ink"></i>' + U.hLabel + "</span>" + (comps.length ? '<span><i class="cf-sw" style="background:var(--pen)"></i>' + U.cLabel + "</span>" : "");
  }
  function paintCards(){
    var I = it(), st = ist(I.id);
    var h = I.cards.map(function(c, i){
      var on = st.sel.indexOf(i) >= 0;
      return '<div class="cf-card' + (on ? " on" : "") + (V.test === i ? " tested" : "") + '"><p class="cf-cardt"><strong>' + L[i] + ".</strong> " + m("g(x) =") + " " + c.g + ", " + m("f(x) =") + " " + c.f + "</p>" +
        '<div class="cf-cardb"><button type="button" class="btn ghost sm" data-test="' + i + '" data-k="sbt' + i + '">' + U.test + '</button><button type="button" class="btn sm cf-tog" data-sel="' + i + '" data-k="sbs' + i + '" aria-pressed="' + on + '"' + (st.solved ? " disabled" : "") + ">" + (on ? "✓ " + U.selected : U.select) + "</button></div></div>";
    }).join("");
    MV.keepFocus($("#sb-cards", host), function(){ $("#sb-cards", host).innerHTML = h; });
    var a = "";
    if (st.solved) a = '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + SB.right + (st.first ? "" : ' <span class="muted">' + U.notFirst + "</span>") + "</p><p>" + U.algLab + " " + I.alg + "</p></div>";
    else {
      a = '<div class="q-actions"><button type="button" class="btn primary sm" data-act="sbcheck" data-k="sbchk">' + U.check + "</button>" + MV.hintBtn("sbh" + I.id, st.hint) + "</div>" + MV.hintsHTML(I.hints, st.hint);
      var msg = V.msg[I.id]; if (msg) a += '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong></p>' + msg.map(function(t){ return "<p>" + t + "</p>"; }).join("") + "<p>" + SB.end + "</p></div>";
    }
    MV.keepFocus($("#sb-act", host), function(){ $("#sb-act", host).innerHTML = a; });
    paintSel();
  }
  function judge(I, sel){
    var ans = MV.ans(I), lines = [];
    I.cards.forEach(function(c, i){
      var on = sel.indexOf(i) >= 0, valid = ans.indexOf(i) >= 0;
      if (on && !valid) {
        if (c.special) lines.push(c.special);
        else { var s = fill(SB.wrongCard, { L:L[i], B:c.builds, X:m(num(I.test)), V:m(c.v), H:m(I.hv) }); if (c.rev) s += " " + fill(SB.reversed, { G:c.g, I:I.inner }); lines.push(s); }
      }
      if (!on && valid) lines.push(fill(SB.missed, { L:L[i], G:c.g }));
    });
    return lines;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var I = it(), st = ist(I.id);
    if (b.dataset.test != null) { V.test = +b.dataset.test; if (S.tx[I.id] == null) { xSl.set(I.test + 5); } paintCards(); paintTest(); return; }
    if (b.dataset.sel != null) { var k = +b.dataset.sel, j = st.sel.indexOf(k); if (j < 0) st.sel.push(k); else st.sel.splice(j, 1); st.sel.sort(); V.msg[I.id] = null; api.save(); paintCards(); return; }
    if (b.dataset.act === "hint") { st.hint = Math.min(3, st.hint + 1); api.save(); paintCards(); return; }
    if (b.dataset.act === "sbcheck") {
      if (!st.sel.length) { V.msg[I.id] = [U.none]; paintCards(); MV.focusFb($("#sb-act", host)); return; }
      var lines = judge(I, st.sel);
      if (!lines.length) { st.solved = true; st.first = st.tries === 0 && st.hint < 3; V.msg[I.id] = null; V.test = null; }
      else { st.tries++; V.msg[I.id] = st.sel.length ? lines : [U.none]; }
      api.save(); paintCards(); paintTest(); MV.focusFb($("#sb-act", host));
    }
  });
  function paint(){ selRG.set(S.cur); xSl.set(tx() + 5); paintCards(); paintTest(); }
  plot.render = drawPlot;
  paint();
  MV.ACTS.stationB = { a:{ id:"stationB" },
    stats:function(){ var f = 0, d = 0; SB.items.forEach(function(I){ var y = S.items[I.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:4, done:d, line:fill(U.sumLine, { 1:f }) + (d < 4 ? " " + U.unfinished : "") }; },
    missed:function(){ return SB.items.some(function(I){ var y = S.items[I.id]; return y && (y.tries > 0 || y.hint >= 3); }) ? MV.goalIdx(4) : []; } };
}
function part3(host, api){
  var C = api.content;
  host.innerHTML = '<div id="cf-sa" class="cf-station"></div><div id="cf-sb" class="cf-station part"></div>';
  stationA($("#cf-sa", host), api, C.stationA);
  stationB($("#cf-sb", host), api, C.stationB);
  return {};
}

// ---------- Practice 2: inside out, then backwards (N4 number entry with two-box fill-ins) ----------
// @component N4 fillBoxes — number entry where an item is one box or a "g(x) = □x + □" pair of boxes (fractions allowed),
// several accepted answers, named wrong values, three-level hints, first-try scoring
function backwards(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {}, gF = function(x){ return x * x - 2 * x - 1; };
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="cf-p2fig"><div>' + MV.tableHTML({ head:[m("x")].concat(a.fig.xs.map(function(v){ return m(num(v)); })), rows:[[m("f(x)")].concat(a.fig.fs.map(function(v){ return m(num(v)); }))], caption:"Table of f" }) + '</div><div class="cf-p2g"><canvas class="plot" id="cf-p2c" role="img" aria-label="' + MV.esc(a.fig.aria) + '"></canvas></div></div><div id="cf-p2i"></div>';
  var p = new MV.Plot($("#cf-p2c", host), { xmin:-3, xmax:5, ymin:-3, ymax:8 });
  p.render = function(){
    var f3 = css("--f3");
    p.draw({ view:{ xmin:-3, xmax:5, ymin:-3, ymax:8 }, xTicks:{ step:1 }, yTicks:{ step:1 }, curves:[{ f:gF, color:f3, width:2.6 }],
      points:[-2, -1, 0, 1, 2, 3, 4].map(function(x){ return { x:x, y:gF(x), r:4, color:f3 }; }),
      after:function(ctx, pl){ cmath(ctx, a.fig.label, pl.X(3.55), pl.Y(5.6), { size:14, color:f3, align:"right" }); }, describe:a.fig.aria });
  };
  function ist(id){ return S.items[id] || (S.items[id] = { vals:["", ""], tries:0, hint:0, solved:false, first:null }); }
  function parse(s){ var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : null; }
  function judge(it, x){
    var ans = MV.ans(it), near = function(u, v){ return Math.abs(u - v) < 1e-9 * Math.max(1, Math.abs(v)); };
    if (it.boxes) {
      var m1 = parse(x.vals[0]), b1 = parse(x.vals[1]); if (m1 == null || b1 == null) return { bad:a.badBox };
      if (ans.some(function(pr){ return near(m1, pr[0]) && near(b1, pr[1]); })) return { ok:true };
      var w = (it.wrong || []).filter(function(w){ return near(m1, w.match[0]) && near(b1, w.match[1]); })[0];
      return { fb:w ? w.fb : null };
    }
    var v = parse(x.vals[0]); if (v == null) return { bad:a.bad };
    if (near(v, ans)) return { ok:true };
    var w2 = (it.wrong || []).filter(function(w){ return near(v, w.match); })[0];
    return { fb:w2 ? w2.fb : null };
  }
  function inputs(it, x){
    var dis = x.solved ? " disabled" : "";
    if (it.boxes) return '<div class="numrow"><span class="m cf-gx">' + m("g(x) =") + '</span><input class="numin cf-bx" type="text" autocomplete="off" data-bin="' + it.id + '" data-j="0" aria-label="' + MV.esc(it.id.toUpperCase() + ": coefficient of x") + '" value="' + MV.esc(x.vals[0]) + '"' + dis + '><span class="m">' + m("x +") + '</span><input class="numin cf-bx" type="text" autocomplete="off" data-bin="' + it.id + '" data-j="1" aria-label="' + MV.esc(it.id.toUpperCase() + ": constant term") + '" value="' + MV.esc(x.vals[1]) + '"' + dis + "></div>";
    return '<div class="numrow"><label for="cf-bi-' + it.id + '">' + a.label + '</label><input class="numin short" id="cf-bi-' + it.id + '" type="text" autocomplete="off" data-bin="' + it.id + '" data-j="0" value="' + MV.esc(x.vals[0]) + '"' + dis + "></div>";
  }
  function paint(){
    MV.keepFocus($("#cf-p2i", host), function(){
      $("#cf-p2i", host).innerHTML = a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-bi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">N' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div></div>" + inputs(it, x);
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.right || "") + (x.first ? "" : ' <span class="muted">' + a.notFirst + "</span>") + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bin) return; ist(t.dataset.bin).vals[+t.dataset.j] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.bin) { var b = host.querySelector('[data-k="' + e.target.dataset.bin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-bi]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.bi; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = r.bad; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = r.fb ? "<strong>✗ Not quite.</strong> " + r.fb + " " + a.tryAgain : "<strong>✗</strong> " + a.fallback; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-bi="' + it.id + '"]'));
    }
  });
  paint(); p.render();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: Break it at 2 ----------
var MS = [-3, -2, -1, -0.5, 0.5, 1, 2, 3], OUTS = ["sq", "rt", "rc", "ex", "lg"];
function linG(mv, b){ var t = mv === 1 ? "x" : mv === -1 ? "−x" : mv === 0.5 ? "x/2" : mv === -0.5 ? "−x/2" : num(mv) + "x"; return t + (b > 0 ? " + " + b : b < 0 ? " − " + Math.abs(b) : ""); }
function hSrc(f, mv, b){ var L = linG(mv, b); return f === "rt" ? "√{" + L + "}" : f === "rc" ? "{1}/{" + L + "}" : f === "lg" ? "log_{2}(" + L + ")" : f === "sq" ? (L === "x" ? "x^2" : "(" + L + ")^2") : "2^{" + L + "}"; }
function hfS(g){ return Number.isInteger(g) ? num(g) : (g < 0 ? MINUS : "") + Math.abs(g * 2) + "/2"; }
function hVal(f, g){      // exact value of f(g) as m() source, or null when undefined
  if (!acc(f, g)) return null;
  if (f === "rt") { var r = Math.sqrt(g); return isEx(r) ? num(r, 4) : "√{" + hfS(g) + "}"; }
  if (f === "rc") return MV.frac(1 / g, 12);
  if (f === "lg") { var L = Math.log2(g); return Number.isInteger(Math.round(L * 1e9) / 1e9) ? num(Math.round(L)) : "log_{2}(" + hfS(g) + ")"; }
  if (f === "sq") return MV.frac(g * g, 12);
  return Number.isInteger(g) ? (g >= 0 ? num(Math.pow(2, g)) : "1/" + Math.pow(2, -g)) : "2^{" + hfS(g) + "}";
}
var task = (function(){
  var api, plot, T;
  function read(){ var s = api ? api.S : {}; return { f:OUTS.indexOf(s.f) >= 0 ? s.f : "rt", m:s.m != null ? +s.m : 1, b:s.b != null ? +s.b : 0 }; }
  function g(d, x){ return d.m * x + d.b; }
  function hTxt(d, x){ var v = hVal(d.f, g(d, x)); return v == null ? m(T.ui.undef) : m(v); }
  function caption(){
    var d = read(), el = $("#bk-cap"); if (!el) return;
    el.innerHTML = m("h(x) = " + hSrc(d.f, d.m, d.b)) + '<br><span class="cf-hvals">' + [2, 3, 4].map(function(x){ return m("h(" + x + ") =") + " " + hTxt(d, x); }).join(" · ") + "</span>";
  }
  function draw(){
    var d = read(), F = function(x){ return LIB[d.f].f(g(d, x)); }, ink = css("--ink"), pts = [], asy = [], dom;
    var x0 = -d.b / d.m;
    if (d.f === "rt") { dom = d.m > 0 ? [x0, Infinity] : [-Infinity, x0]; pts.push({ x:x0, y:0, color:ink, r:5 }); }
    if (d.f === "lg" || d.f === "rc") asy.push({ x:x0, label:x0 === 2 || x0 === 3 ? "" : "x = " + MV.frac(x0, 12) });
    var cv = [{ f:function(x){ return g(d, x); }, color:css("--f3"), width:2, alpha:0.5 }];
    if (d.f === "rc") { cv.push({ f:F, color:ink, width:3.4, domain:[-Infinity, x0 - 1e-9] }, { f:F, color:ink, width:3.4, domain:[x0 + 1e-9, Infinity] }); }
    else cv.push({ f:F, color:ink, width:3.4, domain:dom || (d.f === "lg" ? (d.m > 0 ? [x0 + 1e-9, Infinity] : [-Infinity, x0 - 1e-9]) : undefined) });
    pts.push({ x:4, y:1, open:true, color:ink, r:7 });
    plot.draw({ view:{ xmin:-1, xmax:7, ymin:-3, ymax:5 }, xTicks:{ step:1 }, yTicks:{ step:1 }, asymptotes:asy, curves:cv, points:pts,
      after:function(ctx, p){
        [2, 3].forEach(function(x){ p.segment({ x1:x, y1:-3, x2:x, y2:5, color:css("--ink-2"), width:1, dash:[3, 4] }); cmath(ctx, "x = " + x, p.X(x) + 4, 12, { size:12, color:css("--ink-2") }); });
        cmath(ctx, T.ui.target, p.X(4) + 10, p.Y(1) - 14, { size:12 });
      },
      describe:"Preview: " + MV.plain(m("h(x) = " + hSrc(d.f, d.m, d.b))) + ", with guides at x = 2 and x = 3, the target point (4, 1) and the inner line y = " + MV.plain(m(linG(d.m, d.b))) + "." });
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task;
      a.S.f = OUTS.indexOf(a.S.f) >= 0 ? a.S.f : "rt"; if (a.S.m == null) a.S.m = 1; if (a.S.b == null) a.S.b = 0;
      inp.innerHTML = '<div id="bk-f"></div><div class="cf-row cf-bkrow"><label class="cf-sel">' + T.ui.m + ' <select id="bk-m">' + MS.map(function(v){ return '<option value="' + v + '">' + MV.frac(v, 2) + "</option>"; }).join("") + '</select></label><label class="cf-sel">' + T.ui.b + ' <select id="bk-b">' + [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(function(v){ return '<option value="' + v + '">' + num(v) + "</option>"; }).join("") + '</select></label></div><p class="cf-bkcap" id="bk-cap" aria-live="polite"></p>';
      pv.innerHTML = '<canvas class="plot square" id="bk-plot" role="img"></canvas>';
      plot = new MV.Plot($("#bk-plot"), { xmin:-1, xmax:7, ymin:-3, ymax:5 }); plot.render = draw;
      radios($("#bk-f"), { label:T.ui.outer, aria:"Outer function f", cls:"chips cf-fn", options:OUTS.map(function(k){ return { id:k, t:m(LIB[k].s) }; }), value:a.S.f, onChange:function(v){ a.S.f = v; a.save(); caption(); draw(); a.update(); } });
      $("#bk-m").value = String(a.S.m); $("#bk-b").value = String(a.S.b);
      inp.addEventListener("change", function(e){ if (e.target.id === "bk-m") a.S.m = +e.target.value; else if (e.target.id === "bk-b") a.S.b = +e.target.value; else return; a.save(); caption(); draw(); a.update(); });
      caption(); draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var g2 = g(d, 2), g3 = g(d, 3), g4 = g(d, 4), ok4 = d.f === "rt" || d.f === "rc" ? g4 === 1 : d.f === "lg" ? g4 === 2 : d.f === "sq" ? Math.abs(g4) === 1 : g4 === 0;
      return [!acc(d.f, g2), acc(d.f, g3), acc(d.f, g4) && ok4];
    },
    tips:function(d, c){
      var out = [], F = T.forbid;
      if (!c[0]) out.push(fill(T.tips[0], { 1:hTxt(d, 2), 2:F[d.f] || fill(F.any, { 1:m(LIB[d.f].s) }) }));
      if (!c[1]) out.push(fill(T.tips[1], { 1:m(hfS(g(d, 3))) }));
      if (!c[2]) out.push(fill(T.tips[2], { 1:hTxt(d, 4) }));
      return out;
    },
    key:function(d){ return d.f + "|" + d.m + "|" + d.b; },
    label:function(k){ var p = k.split("|"); return "(" + m(LIB[p[0]].s) + ", " + m("g(x) = " + linG(+p[1], +p[2])) + ")"; },
    text:function(k){ var p = k.split("|"); return MV.plain(m("h(x) = " + hSrc(p[0], +p[1], +p[2]))); }
  };
})();

// ---------- Final Check graphs (T2) ----------
function t2fig(p, view, f, g, fz, gp, desc){
  var pen = css("--pen"), f3 = css("--f3");
  p.draw({ view:view, xTicks:{ step:1 }, yTicks:{ step:1 }, curves:[{ f:f, color:pen, width:3 }, { f:g, color:f3, width:2.6 }],
    points:fz.map(function(x){ return { x:x, y:0, r:4.5, color:pen }; }).concat(gp.map(function(q){ return { x:q[0], y:q[1], r:4, color:f3 }; })),
    after:function(ctx, pl){
      var xf = view.xmax - 0.6, xg = -Math.sqrt(view.ymax - 1 - g(0)) ;
      cmath(ctx, "y = f(x)", clamp(pl.X(xf), 60, pl.W - 6), clamp(pl.Y(f(xf)) + 16, 14, pl.H - 14), { size:13, color:pen, align:"right" });
      cmath(ctx, "y = g(x)", pl.X(xg) + 8, clamp(pl.Y(g(xg)) + 12, 14, pl.H - 14), { size:13, color:f3 });
    }, describe:desc });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ backwards:backwards },
  task:task,
  figures:{
    t2a:function(p){ t2fig(p, { xmin:-4, xmax:4, ymin:-4, ymax:8 }, function(x){ return (x + 1) * (x - 2); }, function(x){ return x * x - 2; }, [-1, 2], [[0, -2], [-1, -1], [1, -1], [-2, 2], [2, 2]], "Two parabolas: f crosses the x-axis at −1 and 2; g has vertex (0, −2) and passes through (±1, −1) and (±2, 2)."); },
    t2b:function(p){ t2fig(p, { xmin:-4, xmax:7, ymin:-7, ymax:8 }, function(x){ return (x - 1) * (x - 6); }, function(x){ return x * x - 3; }, [1, 6], [[0, -3], [-2, 1], [2, 1], [-3, 6], [3, 6]], "Two parabolas: f crosses the x-axis at 1 and 6; g has vertex (0, −3) and passes through (±2, 1) and (±3, 6)."); }
  }
});
})();
