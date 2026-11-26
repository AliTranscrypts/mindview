// MHF4U 28 Compound Angles: hero, compound angle visualiser (Explore), the π/12 clock and the double-angle lab (Part 3, #exact),
// "Exact values, forwards and backwards" (Practice 2) and the "Set the question" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, PI = Math.PI, MINUS = MV.MINUS;
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : m; }); }
function clamp01(t){ return Math.max(0, Math.min(1, t)); }

// ---------- exact values on the π/12 grid (k = twelfths of π) ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function mod24(k){ return ((k % 24) + 24) % 24; }
function angT(k, den){ den = den || 12; if (!k) return "0"; var g = gcd(k, den), n = k / g, d = den / g, a = Math.abs(n); return (n < 0 ? MINUS : "") + (a === 1 ? "" : a) + "π" + (d === 1 ? "" : "/" + d); }
function angS(k, den){ return angT(k, den).replace(MINUS, "-"); }
function angSp(k, den){ den = den || 12; if (!k) return "0"; var g = gcd(k, den), n = Math.abs(k / g), d = den / g; return (k < 0 ? "negative " : "") + (n === 1 ? "" : n + " ") + "pi" + (d === 1 ? "" : " over " + d); }
function tw(k){ return (k === 1 ? "" : k) + "π/12"; }
function special(k){ return k % 2 === 0 || k % 3 === 0; }
function sgn(x){ return Math.abs(x) < 1e-9 ? 0 : x > 0 ? 1 : -1; }
function refOf(k){ var m = mod24(k) % 12; return m <= 6 ? m : 12 - m; }
function quadOf(k){ var kk = mod24(k); return kk % 6 === 0 ? 0 : Math.floor(kk / 6) + 1; }
// a term [n, d, r] is (n/d)·√r; rows: sin, cos, tan of the reference angle
var REFT = { 0:[[0, 1, 1], [1, 1, 1], [0, 1, 1]], 2:[[1, 2, 1], [1, 2, 3], [1, 3, 3]], 3:[[1, 2, 2], [1, 2, 2], [1, 1, 1]], 4:[[1, 2, 3], [1, 2, 1], [1, 1, 3]], 6:[[1, 1, 1], [0, 1, 1], null] };
var FI = { sin:0, cos:1, tan:2 };
function fv(fn, x){ return fn === "sin" ? Math.sin(x) : fn === "cos" ? Math.cos(x) : Math.tan(x); }
function term(k, fn){
  var t = REFT[refOf(k)][FI[fn]]; if (!t) return null;
  var a = k * PI / 12, s = fn === "tan" ? sgn(Math.sin(a)) * sgn(Math.cos(a)) : sgn(fv(fn, a));
  return [s * t[0], t[1], t[2]];
}
function tmul(a, b){ var n = a[0] * b[0], d = a[1] * b[1], r = a[2] * b[2]; if (r === 4) { n *= 2; r = 1; } else if (r === 9) { n *= 3; r = 1; } if (!n) return [0, 1, 1]; var g = gcd(n, d); return [n / g, d / g, r]; }
function tS(t){ var n = t[0], d = t[1], r = t[2]; if (!n) return "0"; var a = Math.abs(n), top = r === 1 ? String(a) : (a === 1 ? "" : a) + "√" + r; return (n < 0 ? "-" : "") + (d === 1 ? top : "{" + top + "}/{" + d + "}"); }
function tV(t){ return t[0] / t[1] * Math.sqrt(t[2]); }
function join(a, op, t){ if (t[0] < 0) { t = [-t[0], t[1], t[2]]; op = op === "+" ? "-" : "+"; } return a + " " + op + " " + tS(t); }
function par(t){ return "(" + tS(t) + ")"; }
var BIG = "{√6 + √2}/{4}", SMALL = "{√6 - √2}/{4}";
// exact value (MV.m source) of a ratio at kπ/12; x: write a negative small value as (√2 − √6)/4; null = undefined
function exact(k, fn, x){
  if (special(k)) { var t = term(k, fn); return t ? tS(t) : null; }
  var ref = refOf(k), v = fv(fn, k * PI / 12), big = fn === "tan" ? ref === 5 : (fn === "sin") === (ref === 5);
  if (fn === "tan") { var s = big ? "2 + √3" : "2 - √3"; return v < 0 ? "-(" + s + ")" : s; }
  if (v > 0) return big ? BIG : SMALL;
  return big ? "-" + BIG : x ? "{√2 - √6}/{4}" : "-" + SMALL;
}
function d3(v){ var r = Math.round(v * 1000) / 1000; if (Math.abs(r) < 5e-4) r = 0; return (r < 0 ? MINUS : "") + Math.abs(r).toFixed(3); }
function ex3(v){ return Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-6; }
function dec(v){ return (ex3(v) ? "= " : "≈ ") + d3(v); }
function decS(v){ return (ex3(v) ? "= " : "≈ ") + (v > 5e-4 ? "+" : "") + d3(v); }
function hasRoot(s){ return /√/.test(s); }
function mx(s, v){ return MV.m(s) + (hasRoot(s) ? " ≈ " + d3(v) : ""); }
function eqv(s, v){ return s != null ? "= " + MV.m(s) : dec(v); }
function tf(t){ return Math.abs(Math.abs(t) - 1) < 1e-9 ? MV.num(t) : ""; }

// ---------- canvas maths labels (adapted from @component N12 unitCircle, module 26) and drawing ----------
var FNW = { sin:1, cos:1, tan:1 };
function grp(s, i){ var d = 0, j = i; for (; j < s.length; j++) { if (s[j] === "{") d++; else if (s[j] === "}") { d--; if (!d) break; } } return [s.slice(i + 1, j), j + 1]; }
function parse(src){
  var out = [], i = 0, buf = "";
  function flush(){ if (buf) { out.push({ t:buf }); buf = ""; } }
  while (i < src.length) {
    var ch = src[i];
    if (ch === "{") {
      var g = grp(src, i);
      if (src[g[1]] === "/" && src[g[1] + 1] === "{") { var g2 = grp(src, g[1] + 1); flush(); out.push({ fn:parse(g[0]), fd:parse(g2[0]) }); i = g2[1]; continue; }
      flush(); out = out.concat(parse(g[0])); i = g[1]; continue;
    }
    if (ch === "√") { var mm = /^\d+/.exec(src.slice(i + 1)) || [""]; flush(); out.push({ r:mm[0] }); i += 1 + mm[0].length; continue; }
    if (/[A-Za-z]/.test(ch)) {
      var w = /^[A-Za-z]+/.exec(src.slice(i))[0];
      if (FNW[w]) buf += w; else { flush(); w.split("").forEach(function(c){ out.push({ t:c, i:true }); }); }
      i += w.length; continue;
    }
    buf += ch === "-" ? MINUS : ch; i++;
  }
  flush();
  return out;
}
function fnt(sz, it, fm){ return (it ? "italic " : "") + "600 " + sz + "px " + fm; }
function sum(a){ return a.reduce(function(s, x){ return s + x; }, 0); }
function widths(ctx, toks, sz, fm){
  return toks.map(function(tk){
    if (tk.fn) { var fs = Math.max(9, Math.round(sz * 0.78)); return Math.max(sum(widths(ctx, tk.fn, fs, fm)), sum(widths(ctx, tk.fd, fs, fm))) + 4; }
    if (tk.r != null) { ctx.font = fnt(sz, false, fm); return sz * 0.62 + ctx.measureText(tk.r).width + 1.5; }
    ctx.font = fnt(sz, tk.i, fm); return ctx.measureText(tk.t).width;
  });
}
function drawToks(ctx, toks, x, y, sz, fm, col){
  var ws = widths(ctx, toks, sz, fm);
  toks.forEach(function(tk, i){
    if (tk.fn) {
      var fs = Math.max(9, Math.round(sz * 0.78)), wn = sum(widths(ctx, tk.fn, fs, fm)), wd = sum(widths(ctx, tk.fd, fs, fm));
      drawToks(ctx, tk.fn, x + (ws[i] - wn) / 2, y - fs * 0.64, fs, fm, col);
      drawToks(ctx, tk.fd, x + (ws[i] - wd) / 2, y + fs * 0.68, fs, fm, col);
      ctx.fillStyle = col; ctx.fillRect(x + 1.5, y - 0.6, ws[i] - 3, Math.max(1.1, sz / 12));
    } else if (tk.r != null) {
      ctx.font = fnt(sz, false, fm); var rw = ctx.measureText(tk.r).width, h = sz * 0.5;
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, sz / 13); ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x + sz * 0.03, y + h * 0.1); ctx.lineTo(x + sz * 0.13, y); ctx.lineTo(x + sz * 0.3, y + h * 0.82); ctx.lineTo(x + sz * 0.55, y - h * 1.02); ctx.lineTo(x + sz * 0.62 + rw + 1, y - h * 1.02); ctx.stroke(); ctx.restore();
      ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(tk.r, x + sz * 0.6, y + sz * 0.05);
    } else { ctx.font = fnt(sz, tk.i, fm); ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(tk.t, x, y + sz * 0.05); }
    x += ws[i];
  });
}
// math label at pixel (X, Y): o = {size, color, align, bg, bgColor}
function label(ctx, p, src, X, Y, o){
  o = o || {};
  var sz = o.size || 14, fm = p.fontM || css("--font-math") || "serif", tk = parse(src);
  if (sz >= 12 && p.W < 420) sz = Math.round(sz * 0.86);
  var w = sum(widths(ctx, tk, sz, fm));
  var hh = tk.some(function(t){ return t.fn; }) ? sz * 2.05 : sz * 1.35;
  var x0 = o.align === "right" ? X - w : o.align === "center" ? X - w / 2 : X;
  x0 = Math.max(3, Math.min(p.W - w - 3, x0)); Y = Math.max(hh / 2 + 2, Math.min(p.H - hh / 2 - 2, Y));
  ctx.save();
  if (o.bg !== false) { ctx.globalAlpha = 0.88; ctx.fillStyle = o.bgColor || css("--sheet"); ctx.fillRect(x0 - 3, Y - hh / 2, w + 6, hh); ctx.globalAlpha = 1; }
  drawToks(ctx, tk, x0, Y, sz, fm, o.color || css("--ink"));
  ctx.restore();
}
// plain UI text
function txt(ctx, p, s, X, Y, o){
  o = o || {}; var sz = o.size || 12;
  ctx.save(); ctx.font = (o.bold ? "700 " : "400 ") + sz + "px " + (p.fontUI || "sans-serif"); ctx.textBaseline = "middle";
  var w = ctx.measureText(s).width, x0 = o.align === "right" ? X - w : o.align === "center" ? X - w / 2 : X;
  x0 = Math.max(2, Math.min(p.W - w - 2, x0));
  if (o.bg) { ctx.globalAlpha = 0.85; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 2, Y - sz * 0.7, w + 4, sz * 1.4); ctx.globalAlpha = 1; }
  ctx.fillStyle = o.color || css("--ink-2"); ctx.textAlign = "left"; ctx.fillText(s, x0, Y); ctx.restore();
}
// @component G8 circleDraw — unit circle (partial sweep), arms, single/double arc markers, right-angle marks, filled triangles,
//   arcs at any vertex (pilot in MHF4U 28: compound build, double-angle chord picture)
function seg(ctx, p, x1, y1, x2, y2, col, w, dash, alpha, cap){
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.lineCap = cap || "round"; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(p.X(x1), p.Y(y1)); ctx.lineTo(p.X(x2), p.Y(y2)); ctx.stroke(); ctx.restore();
}
function dot(ctx, p, x, y, r, fill, stroke, sw){
  ctx.save(); ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), r, 0, 2 * PI);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw || 2; ctx.stroke(); }
  ctx.restore();
}
function poly(ctx, p, pts, o){
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.beginPath();
  pts.forEach(function(q, i){ if (i) ctx.lineTo(p.X(q[0]), p.Y(q[1])); else ctx.moveTo(p.X(q[0]), p.Y(q[1])); }); ctx.closePath();
  if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
  if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.width || 2; if (o.dash) ctx.setLineDash(o.dash); ctx.stroke(); }
  ctx.restore();
}
function arcAt(ctx, p, cx, cy, r, a0, a1, col, w){
  if (Math.abs(a1 - a0) < 1e-6) return;
  var R = p.X(r) - p.X(0);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1.8; ctx.beginPath(); ctx.arc(p.X(cx), p.Y(cy), R, -a0, -a1, a1 > a0); ctx.stroke(); ctx.restore();
}
function circle(ctx, p, frac, col){
  var R = p.X(1) - p.X(0);
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.X(0), p.Y(0), R, 0, -2 * PI * frac, true); ctx.stroke(); ctx.restore();
}
function unit(dx, dy){ var L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; }
function rightMark(ctx, p, V, u, w, col){
  var s = 0.075, a = [V[0] + u[0] * s, V[1] + u[1] * s], b = [a[0] + w[0] * s, a[1] + w[1] * s], c = [V[0] + w[0] * s, V[1] + w[1] * s];
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.X(a[0]), p.Y(a[1])); ctx.lineTo(p.X(b[0]), p.Y(b[1])); ctx.lineTo(p.X(c[0]), p.Y(c[1])); ctx.stroke(); ctx.restore();
}
// @component G13 valueBars — signed stacked value bars, vertical (vbar, hatched option) and horizontal (hbar), in plot units
// vertical bar from y0 to y1 at x (w in px); o = {hatch, alpha, outline}
function vbar(ctx, p, x, y0, y1, w, col, o){
  o = o || {}; if (Math.abs(y1 - y0) < 1e-9) return;
  var X = p.X(x) - w / 2, Ya = p.Y(Math.max(y0, y1)), h = Math.abs(p.Y(y0) - p.Y(y1));
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
  if (o.hatch) {
    ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.strokeRect(X, Ya, w, h);
    ctx.beginPath(); ctx.rect(X, Ya, w, h); ctx.clip(); ctx.beginPath();
    for (var d = -w; d < h + w; d += 6) { ctx.moveTo(X, Ya + d); ctx.lineTo(X + w, Ya + d - w); }
    ctx.stroke();
  } else { ctx.fillStyle = col; ctx.fillRect(X, Ya, w, h); }
  ctx.restore();
}
function hbar(ctx, p, x0, x1, y, h, col){
  if (Math.abs(x1 - x0) < 1e-9) return;
  ctx.save(); ctx.fillStyle = col; ctx.fillRect(p.X(Math.min(x0, x1)), p.Y(y) - h / 2, Math.abs(p.X(x1) - p.X(x0)), h); ctx.restore();
}
function doubleArc(ctx, p, a0, a1, r, col){ arcAt(ctx, p, 0, 0, r, a0, a1, col, 1.8); arcAt(ctx, p, 0, 0, r + 0.05, a0, a1, col, 1.8); }
function angLab(ctx, p, s, r, ang, col){ label(ctx, p, s, p.X(r * Math.cos(ang)), p.Y(r * Math.sin(ang)), { size:14, align:"center", color:col }); }

// ---------- small widgets ----------
// @component radioGroup — segmented control as a real radio group (arrow keys, roving tabindex)
// radio group with arrow keys: o = {label, options:[{id, t}], value, onChange(id)}
function radios(host, o){
  var val = o.value;
  function paint(){
    host.innerHTML = '<div class="seg-wrap">' + (o.label ? '<span class="tiny" style="font-weight:700" aria-hidden="true">' + o.label + "</span>" : "") +
      '<span class="seg" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.label || "Options")) + '">' + o.options.map(function(x){
        var on = val === x.id; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (val == null && x === o.options[0]) ? 0 : -1) + '" data-rv="' + x.id + '"' + (o.disabled ? " disabled" : "") + ">" + x.t + "</button>";
      }).join("") + "</span></div>";
  }
  function pick(id, focus){
    var changed = id !== val; val = id; paint();
    if (focus) { var b = host.querySelector('[data-rv="' + id + '"]'); if (b) b.focus({ preventScroll:true }); }
    if (changed && o.onChange) o.onChange(id);
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rv]"); if (b && !b.disabled) pick(b.dataset.rv, true); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rv]"); if (!b) return;
    var d = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[e.key]; if (d == null) return;
    e.preventDefault(); var n = o.options.length, i = o.options.map(function(x){ return x.id; }).indexOf(b.dataset.rv);
    pick(o.options[(i + d + n) % n].id, true);
  });
  paint();
  return { set:function(id){ val = id; paint(); }, get:function(){ return val; }, disable:function(v){ o.disabled = v; paint(); } };
}
// @component N9 angleSlider — N9 slider row with 40 px − and + buttons, π-multiple output, PageUp/PageDown steps
// angle slider with − and + buttons: o = {id, label, min, max, value, den, color, page, onChange(k)}
function angSlider(host, o){
  var col = o.color ? ' style="accent-color:' + o.color + '"' : "", oc = o.color ? ' style="color:' + o.color + '"' : "";
  host.innerHTML = '<div class="cx-sl"><div class="slider-top"><label for="' + o.id + '">' + o.label + '</label><output id="' + o.id + '-out" for="' + o.id + '"' + oc + "></output></div>" +
    '<div class="cx-slrow"><button type="button" class="btn sm cx-pm" data-d="-1" data-k="' + o.id + 'm" aria-label="' + MV.esc(MV.plain(o.label)) + ': step down">−</button>' +
    '<input type="range" id="' + o.id + '" step="1"' + col + '><button type="button" class="btn sm cx-pm" data-d="1" data-k="' + o.id + 'p" aria-label="' + MV.esc(MV.plain(o.label)) + ': step up">+</button></div></div>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host), val = o.value;
  function paint(){
    inp.min = o.min; inp.max = o.max; inp.value = val; out.innerHTML = MV.m(angS(val, o.den));
    inp.setAttribute("aria-valuetext", angSp(val, o.den));
    host.querySelector('[data-d="-1"]').disabled = val <= o.min; host.querySelector('[data-d="1"]').disabled = val >= o.max;
  }
  function set(v){ v = Math.max(o.min, Math.min(o.max, v)); if (v === val) { paint(); return; } val = v; paint(); o.onChange(v); }
  inp.addEventListener("input", function(){ set(+inp.value); });
  inp.addEventListener("keydown", function(e){ if (e.key === "PageUp" || e.key === "PageDown") { e.preventDefault(); set(val + (e.key === "PageUp" ? 1 : -1) * o.page); } });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (b && !b.disabled) set(val + (+b.dataset.d)); });
  paint();
  return { get:function(){ return val; }, set:function(v){ val = v; paint(); }, range:function(a, b){ o.min = a; o.max = b; paint(); } };
}
function chipsHTML(list){ return list.map(function(c){ return '<button type="button" class="chip' + (c.on ? " on" : "") + '" aria-pressed="' + !!c.on + '" data-tg="' + c.id + '" data-k="tg' + c.id + '">' + c.t + "</button>"; }).join(""); }
function fbBox(good, html){ return '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p>' + html + "</p></div>"; }

// ---------- hero (storyboard in the plan; reduced motion shows the final frame with both captions) ----------
function hero(f){
  if (!f.canvas) return;
  var H = MV.C.hero, p = new MV.Plot(f.canvas, { xmin:-1.4, xmax:2.2, ymin:-1.4, ymax:2.2 }, { equal:true });
  var a0 = PI / 3, b0 = PI / 6, sa = Math.sin(a0), sb = Math.sin(b0), Q = [Math.cos(b0) * Math.cos(a0), Math.cos(b0) * Math.sin(a0)];
  var st = { c:0, a:0, b:0, fl:0, out:false, sw:0, perp:0, split:0 };
  f.cap.classList.add("cx-hcap");
  function cap(n){ f.cap.innerHTML = n === 0 ? "&nbsp;" : n === 1 ? H.caps[0] : H.caps[0] + "<br>" + H.caps[1]; }
  p.render = function(){
    p.draw({ view:{ xmin:-1.4, xmax:2.2, ymin:-1.4, ymax:2.2 }, equal:true, xTicks:{ step:0.5, fmt:tf }, yTicks:{ step:0.5, fmt:tf },
      describe:st.split >= 1 ? "Unit circle with a = π/3 and b = π/6. Turning on from a by b reaches the top of the circle, P = (0, 1). Its height 1 splits into sin a cos b = 3/4 and cos a sin b = 1/4." : "Unit circle. Two arms, a = π/3 and b = π/6, and a bar stacking their heights.",
      after:function(ctx){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3"), hi = css("--hi"), bw = (p.X(0.24) - p.X(0)), bx = 1.6;
        circle(ctx, p, st.c, ink2);
        if (st.c >= 1) { seg(ctx, p, 1.05, 1, 2.2, 1, ink2, 1.5, [6, 5]); txt(ctx, p, MV.plain(H.labels.top), p.X(2.18), p.Y(1) - 10, { align:"right", size:11 }); }
        if (st.a > 0) { var aa = a0 * st.a; seg(ctx, p, 0, 0, Math.cos(aa), Math.sin(aa), ink, 2.5); arcAt(ctx, p, 0, 0, 0.2, 0, aa, ink); if (st.a >= 1) angLab(ctx, p, "a", 0.31, a0 / 2, ink); }
        if (st.b > 0) {
          var base = a0 * st.sw, tip = base + b0 * st.b;
          seg(ctx, p, 0, 0, Math.cos(tip), Math.sin(tip), ink2, 2.5, [7, 5]); doubleArc(ctx, p, base, tip, 0.36, ink2);
          if (st.b >= 1) angLab(ctx, p, "b", 0.55, base + b0 / 2, ink2);
        }
        if (st.sw < 1) {
          var h1 = Math.sin(a0 * st.a), h2 = Math.sin(b0 * st.b), k = st.sw > 0 ? (sa + sb + (1 - sa - sb) * st.sw) / (sa + sb) : 1;
          vbar(ctx, p, bx, 0, h1 * k, bw, ink); vbar(ctx, p, bx, h1 * k, (h1 + h2) * k, bw, ink2, { hatch:true });
          if (st.out && (h1 + h2) * k > 1) {
            ctx.save(); ctx.globalAlpha = st.fl * 0.8; ctx.fillStyle = hi; ctx.fillRect(p.X(bx) - bw / 2, p.Y((h1 + h2) * k), bw, p.Y(1) - p.Y((h1 + h2) * k)); ctx.restore();
            ctx.save(); ctx.strokeStyle = hi; ctx.lineWidth = 2.5; ctx.strokeRect(p.X(bx) - bw / 2 - 2, p.Y((h1 + h2) * k) - 2, bw + 4, p.Y(1) - p.Y((h1 + h2) * k) + 2); ctx.restore();
          }
        } else {
          seg(ctx, p, 0, 0, 0, 1, pen, 3);
          if (st.split <= 0) vbar(ctx, p, bx, 0, 1, bw, pen);
          else {
            vbar(ctx, p, bx, 0, 0.75, bw, pen); vbar(ctx, p, bx, 0.75, 1, bw, f3);
            ctx.save(); ctx.globalAlpha = st.split;
            label(ctx, p, "sin a cos b", p.X(bx) - bw / 2 - 6, p.Y(0.375), { size:12, align:"right", color:pen });
            label(ctx, p, "cos a sin b", p.X(bx) - bw / 2 - 6, p.Y(0.875), { size:12, align:"right", color:f3 });
            ctx.restore();
          }
          if (st.perp > 0) { seg(ctx, p, 0, 1, Q[0] * st.perp, 1 + (Q[1] - 1) * st.perp, ink2, 2, [5, 4]); if (st.perp >= 1) rightMark(ctx, p, Q, unit(-Q[0], -Q[1]), unit(-Q[0], 1 - Q[1]), ink2); }
          dot(ctx, p, 0, 1, 11, hi, null); dot(ctx, p, 0, 1, 6, pen, css("--sheet"), 2);
          label(ctx, p, "P", p.X(0) + 12, p.Y(1) - 12, { size:14, color:pen, bg:false });
        }
      } });
  };
  if (MV.reduceMotion) { st = { c:1, a:1, b:1, fl:0, out:false, sw:1, perp:1, split:1 }; p.render(); cap(2); return; }
  cap(0); p.render();
  function tw(key, dur, done){ MV.tween({ dur:dur, step:function(t){ st[key] = t; p.render(); }, done:function(){ st[key] = 1; p.render(); if (done) done(); } }); }
  tw("c", 1100, function(){ tw("a", 900, function(){ tw("b", 700, function(){
    st.out = true; cap(1);
    MV.tween({ dur:900, step:function(t){ st.fl = 1 - t; p.render(); }, done:function(){ st.fl = 0; p.render();
      MV.wait(900, function(){ tw("sw", 1200, function(){ tw("perp", 700, function(){ tw("split", 700, function(){ cap(2); }); }); }); });
    } });
  }); }); });
}

// ---------- Explore: compound angle visualiser ----------
var VIEW_ADD = { xmin:-1.4, xmax:3.0, ymin:-2.2, ymax:2.2 }, VIEW_BUILD = { xmin:-1.3, xmax:1.9, ymin:-1.6, ymax:1.6 };
function explore(host, api){
  var S = api.S, EXC = MV.C.explore, U = EXC.ui, M = {};
  EXC.challenges.forEach(function(c){ M[c.id] = c.msgs; });
  if (!S.mode) { S.mode = "add"; S.a = 4; S.b = 2; }
  if (S.stage == null) S.stage = 0;
  if (S.nums == null) S.nums = true;
  S.tried = S.tried || {}; S.eq = S.eq || {};
  var A = { av:null, bv:null, th:null, sw:0, hide:false, grow:1, stT:1, fl:0, out:false, hl:false, cancel:null, timers:[] };
  var L = MV.pgLayout(host, { shape:"square", aria:"Unit circle" });
  var plot = new MV.Plot(L.canvas, VIEW_ADD, { equal:true });
  var form = document.createElement("div"); form.className = "cx-form"; form.id = "cx-form"; form.setAttribute("aria-live", "polite"); L.graph.appendChild(form);
  L.ctrl.innerHTML = '<div id="cx-mode"></div><div id="cx-sa"></div><div id="cx-sb"></div>' +
    '<div id="cx-build"><div id="cx-player"></div><p class="cx-cap" id="cx-cap" aria-live="polite"></p>' +
    '<div class="cx-pin"><button type="button" class="btn ghost sm" id="cx-pin" data-k="cxpin">' + U.pin + '</button><button type="button" class="btn ghost sm" id="cx-unpin" data-k="cxunpin">' + U.unpin + '</button><span class="tiny" id="cx-pinned"></span></div></div>' +
    '<div class="chips cx-tg" id="cx-tg" role="group" aria-label="Show on the picture"></div>';
  var modeR = radios($("#cx-mode", host), { label:U.modeLabel, options:[{ id:"add", t:U.modes[0] }, { id:"plus", t:U.modes[1] }, { id:"minus", t:U.modes[2] }], value:S.mode, onChange:setMode });
  var slA = angSlider($("#cx-sa", host), { id:"cx-a", label:U.sa, min:0, max:24, value:S.a, page:3, onChange:function(v){ userMove("a", v); } });
  var slB = angSlider($("#cx-sb", host), { id:"cx-b", label:U.sb, min:0, max:24, value:S.b, page:3, onChange:function(v){ userMove("b", v); } });
  var quiet = true;
  var player = MV.player($("#cx-player", host), { count:6, interval:1300,
    label:function(i){ return "Stage " + (i + 1) + " of 6: " + U.stages[i]; },
    render:function(i){
      if (quiet || S.mode === "add") return;
      var prev = S.showAll ? 5 : S.stage; S.stage = i;
      if (i === 5) { S.played = true; S.showAll = true; } else S.showAll = false;
      A.hl = false; api.save();
      if (i > prev && !MV.reduceMotion) animStage(); else { A.stT = 1; paint(); }
      paintToggles();
    } });
  quiet = false;

  // ----- placing the key-ideas panels after the predictions -----
  var predPart = $("#pred") && $("#pred").parentNode, foundBox = null, scoreEl = null;
  if (predPart) {
    var wrap = document.createElement("div"); wrap.className = "part";
    wrap.innerHTML = '<details class="alg cx-found" id="cx-found"><summary>' + EXC.found.title + '</summary><p class="tiny" id="cx-score"></p>' + EXC.found.html + "</details>" +
      '<details class="alg"><summary>' + EXC.derive.title + "</summary>" + EXC.derive.html + "</details>";
    predPart.parentNode.insertBefore(wrap, predPart.nextSibling);
    foundBox = $("#cx-found", wrap); scoreEl = $("#cx-score", wrap);
  }
  function paintFound(open){
    if (!foundBox) return;
    var P = EXC.predictions, done = MV.S.preds[P[P.length - 1].id], n = P.filter(function(p){ var s = MV.S.preds[p.id]; return s && s.correct; }).length;
    foundBox.hidden = !done; scoreEl.textContent = tpl(EXC.found.score, { n:n });
    if (open && done) foundBox.open = true;
  }
  paintFound(false);

  function stop(){ if (A.cancel) { A.cancel(); A.cancel = null; } A.timers.forEach(clearTimeout); A.timers = []; }
  function later(ms, fn){ A.timers.push(MV.wait(ms, fn)); }
  function cur(){
    var a = A.av != null ? A.av : S.a * PI / 12, b = A.bv != null ? A.bv : S.b * PI / 12, ok = A.av == null && A.bv == null && A.th == null;
    return { a:a, b:b, ka:ok ? S.a : null, kb:ok ? S.b : null, s:S.mode === "minus" ? -1 : 1 };
  }
  function sync(){
    modeR.set(S.mode);
    if (S.mode === "add") { slA.range(0, 24); slB.range(0, 24); } else { slA.range(0, 12); slB.range(0, 6); }
    slA.set(S.a); slB.set(S.b);
    $("#cx-build", host).hidden = S.mode === "add";
    quiet = true; player.go(S.showAll ? 5 : S.stage); quiet = false;
    paintToggles(); paintPin();
  }
  function paintToggles(){
    var list = [];
    if (S.mode !== "add") {
      if (S.played) list.push({ id:"all", t:U.showAll, on:S.showAll });
      list.push({ id:"nums", t:U.nums, on:S.nums }, { id:"tan", t:U.tan, on:S.tan });
    }
    MV.keepFocus($("#cx-tg", host), function(){ $("#cx-tg", host).innerHTML = chipsHTML(list); });
  }
  function pinText(pn){ var s = pn.mode === "plus" ? "+" : "-"; return MV.m("a = " + angS(pn.a) + ", b = " + angS(pn.b) + ", a " + s + " b = " + angS(pn.a + (s === "+" ? 1 : -1) * pn.b)); }
  function paintPin(){
    $("#cx-pinned", host).innerHTML = S.pin ? U.pinned + " " + pinText(S.pin) : "";
    $("#cx-unpin", host).hidden = !S.pin;
  }
  function setMode(m){
    stop(); var msgs = [];
    if (m !== "add") {
      if (!S.built) { S.built = true; if (S.mode === "add") { S.a = 3; S.b = 2; } }
      if (S.a > 12) { S.a = 12; msgs.push(tpl(U.clamp, { v:"a", val:"π", range:"0 ≤ a ≤ π" })); }
      if (S.b > 6) { S.b = 6; msgs.push(tpl(U.clamp, { v:"b", val:"π/2", range:"0 ≤ b ≤ π/2" })); }
    }
    S.mode = m; A.hl = false; A.sw = 0; A.hide = false; A.av = A.bv = A.th = null; A.grow = 1; A.stT = 1;
    api.save(); sync(); paint(); MV.banner("", msgs.map(function(x){ return MV.plain(x); }).join(" ")); MV.changed(); rest(); flash();
  }
  function userMove(which, v){
    stop(); S[which] = v; A.hl = false; A.sw = 0; A.hide = false; A.av = A.bv = A.th = null; A.grow = 1; A.stT = 1;
    api.save(); paint(); MV.changed(); rest(); flash();
  }
  var restT = null;
  function rest(){
    clearTimeout(restT); if (S.mode !== "add") return;
    restT = setTimeout(function(){
      if (S.mode !== "add" || A.av != null || A.bv != null) return;
      var key = S.a + "," + S.b, a = S.a * PI / 12, b = S.b * PI / 12;
      if (!S.tried[key]) { S.tried[key] = 1; if (Math.abs(Math.sin(a + b) - Math.sin(a) - Math.sin(b)) < 1e-9) S.eq[key] = 1; api.save(); readout(); }
    }, 500);
  }
  function flash(){
    if (S.mode !== "add") return;
    var c = cur(), tot = Math.sin(c.a) + Math.sin(c.b);
    A.out = Math.abs(tot) > 1 + 1e-9;
    if (!A.out || MV.reduceMotion) { A.fl = 0; draw(); return; }
    if (A.cancel) A.cancel();
    A.cancel = MV.tween({ dur:900, step:function(t){ A.fl = 1 - t; draw(); }, done:function(){ A.fl = 0; A.cancel = null; draw(); } });
  }
  function animStage(){
    stop(); A.stT = 0; paint();
    A.cancel = MV.tween({ dur:700, ease:function(t){ return t; }, step:function(t){ A.stT = t; draw(); }, done:function(){ A.stT = 1; A.cancel = null; paint(); } });
  }

  // ----- drawing -----
  function draw(){
    var c = cur(), add = S.mode === "add";
    plot.draw({ view:add ? VIEW_ADD : VIEW_BUILD, equal:true, xTicks:{ step:0.5, fmt:tf }, yTicks:{ step:0.5, fmt:tf }, describe:describe(c),
      after:function(ctx, p){ if (add) drawAdd(ctx, p, c); else drawBuild(ctx, p, c); } });
  }
  function describe(c){
    var P = [Math.cos(c.a + c.s * c.b), Math.sin(c.a + c.s * c.b)], an = function(k, v){ return k != null ? angT(k) : "about " + d3(v); };
    if (S.mode === "add") return "Unit circle. Arm a at " + an(c.ka, c.a) + " and arm b at " + an(c.kb, c.b) + ", both from the positive x-axis. Bars: sin a + sin b is about " + d3(Math.sin(c.a) + Math.sin(c.b)) + (A.hide ? "." : "; sin(a + b) is about " + d3(Math.sin(c.a + c.b)) + ".");
    var p1 = Math.sin(c.a) * Math.cos(c.b), p2 = c.s * Math.cos(c.a) * Math.sin(c.b);
    return "Unit circle. Arm a at " + an(c.ka, c.a) + ", turned " + (c.s > 0 ? "on" : "back") + " by b = " + an(c.kb, c.b) + ". Point P about (" + d3(P[0]) + ", " + d3(P[1]) + "). Height = piece 1, " + d3(p1) + ", plus piece 2, " + d3(p2) + ".";
  }
  function drawAdd(ctx, p, c){
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), hi = css("--hi");
    var sa = Math.sin(c.a), sb = Math.sin(c.b), sab = Math.sin(c.a + c.b), x1 = 1.6, x2 = 2.3, bw = p.X(0.26) - p.X(0);
    circle(ctx, p, 1, ink2);
    seg(ctx, p, -1.4, 1, 3.0, 1, ink2, 1.5, [6, 5], 0.8); seg(ctx, p, -1.4, -1, 3.0, -1, ink2, 1.5, [6, 5], 0.8);
    txt(ctx, p, U.top, p.X(-1.4) + 4, p.Y(1) - 9, { size:11 });
    txt(ctx, p, U.bottom, p.X(-1.4) + 4, p.Y(-1) + 9, { size:11 });
    seg(ctx, p, 0, 0, Math.cos(c.a), Math.sin(c.a), ink, 2.5); arcAt(ctx, p, 0, 0, 0.2, 0, c.a, ink); if (c.a > 0.05) angLab(ctx, p, "a", 0.3, c.a / 2, ink);
    var base = c.a * A.sw, tip = base + c.b;
    seg(ctx, p, 0, 0, Math.cos(tip), Math.sin(tip), ink2, 2.5, [7, 5]); doubleArc(ctx, p, base, tip, 0.36, ink2); if (c.b > 0.05) angLab(ctx, p, "b", 0.55, base + c.b / 2, ink2);
    vbar(ctx, p, x1, 0, sa, bw, ink); vbar(ctx, p, x1, sa, sa + sb, bw, ink2, { hatch:true });
    var tot = sa + sb;
    if (Math.abs(tot) > 1 + 1e-9) {
      var e = tot > 0 ? 1 : -1, ya = p.Y(Math.max(e, tot)), h = Math.abs(p.Y(tot) - p.Y(e));
      ctx.save(); ctx.globalAlpha = A.fl * 0.85; ctx.fillStyle = hi; ctx.fillRect(p.X(x1) - bw / 2, ya, bw, h); ctx.restore();
      ctx.save(); ctx.strokeStyle = hi; ctx.lineWidth = 2.5; ctx.strokeRect(p.X(x1) - bw / 2 - 2, ya - 2, bw + 4, h + 4); ctx.restore();
      txt(ctx, p, tot > 0 ? U.over : U.under, p.X(3.0) - 3, p.Y(tot > 0 ? Math.min(tot + 0.22, 1.85) : Math.max(tot - 0.22, -1.85)), { align:"right", size:11, bg:true, color:css("--ink") });
    }
    label(ctx, p, MV.plain(U.col1), p.X(x1) - bw / 2, p.Y(-2.06), { size:12, align:"left" });
    if (!A.hide) {
      var P = [Math.cos(c.a + c.b), Math.sin(c.a + c.b)];
      seg(ctx, p, 0, 0, P[0], P[1], pen, 3);
      vbar(ctx, p, x2, 0, sab * A.grow, bw, pen);
      seg(ctx, p, P[0], P[1], x2 - 0.15, sab * A.grow, ink2, 1.3, [2, 4]);
      dot(ctx, p, P[0], P[1], 11, hi, null); dot(ctx, p, P[0], P[1], 6, pen, css("--sheet"), 2);
      label(ctx, p, "P", p.X(P[0] * 1.17), p.Y(P[1] * 1.17), { size:14, color:pen, align:"center", bg:false });
      label(ctx, p, MV.plain(U.col2), p.X(x2) + bw / 2, p.Y(2.06), { size:12, align:"right", color:pen });
    }
  }
  function drawBuild(ctx, p, c){
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3"), hi = css("--hi"), hiS = css("--hi-soft");
    var A0 = c.a, B0 = c.b, th = A.th != null ? A.th : c.s * B0, st = S.showAll ? 5 : S.stage, t = A.stT;
    var ca = Math.cos(A0), sa = Math.sin(A0), cb = Math.cos(B0);
    var Q = [cb * ca, cb * sa], P = [Math.cos(A0 + th), Math.sin(A0 + th)], T = [P[0], Q[1]];
    var vis = function(k){ return k < st ? 1 : k === st ? t : 0; };
    var v0 = vis(0), v1 = vis(1), v2 = vis(2), v3 = vis(3), v4 = vis(4), colX = 1.45, mX = 1.7, ry = -1.4, cw = 11;
    circle(ctx, p, 1, ink2);
    if (S.pin) {
      var pa = S.pin.a * PI / 12, pc = pa + (S.pin.mode === "plus" ? 1 : -1) * S.pin.b * PI / 12;
      seg(ctx, p, 0, 0, Math.cos(pa), Math.sin(pa), ink2, 2, [3, 4], 0.6); seg(ctx, p, 0, 0, Math.cos(pc), Math.sin(pc), ink2, 2.5, [7, 5], 0.6);
      dot(ctx, p, Math.cos(pc), Math.sin(pc), 8, null, ink2, 2);
    }
    if (v2 > 0) poly(ctx, p, [[0, 0], Q, P], { fill:hiS, alpha:v2 });
    if (v0 > 0) {
      var aa = A0 * v0;
      seg(ctx, p, Math.cos(aa), Math.sin(aa), 1.32 * Math.cos(aa), 1.32 * Math.sin(aa), ink2, 1.5, null, 0.5);
      seg(ctx, p, 0, 0, Math.cos(aa), Math.sin(aa), ink, 2.5); arcAt(ctx, p, 0, 0, 0.2, 0, aa, ink);
      if (v0 >= 1 && A0 > 0.05) angLab(ctx, p, "a", 0.29, A0 / 2, ink);
    }
    if (v1 > 0) {
      var pa1 = A0 + th * v1;
      seg(ctx, p, 0, 0, Math.cos(pa1), Math.sin(pa1), pen, 3); doubleArc(ctx, p, A0, pa1, 0.36, ink);
      if (v1 >= 1) {
        if (Math.abs(th) > 0.05) angLab(ctx, p, "b", 0.53, A0 + th / 2, ink);
        var nx = -Math.sin(A0 + th), ny = Math.cos(A0 + th), sd = th >= 0 ? 1 : -1;
        label(ctx, p, "1", p.X(P[0] * 0.62 + nx * 0.09 * sd), p.Y(P[1] * 0.62 + ny * 0.09 * sd), { size:13, align:"center", color:pen });
      }
    }
    var lab = function(name, v){ return S.nums ? name + " " + dec(v) : name; };
    if (v2 > 0) {
      seg(ctx, p, P[0], P[1], P[0] + (Q[0] - P[0]) * v2, P[1] + (Q[1] - P[1]) * v2, ink2, 2, [5, 4]);
      if (v2 >= 1 && A.th == null && Math.abs(Math.sin(B0)) > 0.03 && cb > 0.03) {
        rightMark(ctx, p, Q, unit(-Q[0], -Q[1]), unit(P[0] - Q[0], P[1] - Q[1]), ink2);
        var side = unit(P[0] - Q[0], P[1] - Q[1]);
        label(ctx, p, lab("cos b", cb), p.X(Q[0] / 2 - side[0] * 0.13), p.Y(Q[1] / 2 - side[1] * 0.13), { size:12, align:"center" });
        label(ctx, p, lab("sin b", Math.sin(B0)), p.X((P[0] + Q[0]) / 2 + ca * 0.16), p.Y((P[1] + Q[1]) / 2 + sa * 0.16), { size:12, align:"center" });
      }
    }
    if (v3 > 0) {
      var dr = clamp01(v3 / 0.35), sl = clamp01((v3 - 0.35) / 0.65);
      seg(ctx, p, Q[0], Q[1], Q[0], Q[1] * (1 - dr), ink2, 2, [5, 4]);
      if (dr >= 1) {
        if (Math.abs(Q[0]) > 0.04 && Math.abs(Q[1]) > 0.04) rightMark(ctx, p, [Q[0], 0], [sgn(-Q[0]) || 1, 0], [0, sgn(Q[1]) || 1], ink2);
        seg(ctx, p, Q[0], 0, Q[0], Q[1], pen, 4.5); seg(ctx, p, 0, 0, Q[0], 0, pen, 4.5);
        if (sl < 1) { var xx = Q[0] + (colX - Q[0]) * sl, yy = ry * sl; seg(ctx, p, xx, 0, xx, Q[1], pen, 4.5 + 5 * sl, null, 1, "butt"); seg(ctx, p, 0, yy, Q[0], yy, pen, 4.5 + 5 * sl, null, 1, "butt"); }
      }
    }
    if (v4 > 0) {
      var dr2 = clamp01(v4 / 0.35), sl2 = clamp01((v4 - 0.35) / 0.65);
      seg(ctx, p, Q[0], Q[1], Q[0] + (T[0] - Q[0]) * dr2, Q[1], ink2, 2, [5, 4]);
      seg(ctx, p, P[0], P[1], P[0], P[1] + (T[1] - P[1]) * dr2, ink2, 2, [5, 4]);
      if (dr2 >= 1) {
        if (Math.abs(P[0] - Q[0]) > 0.04 && Math.abs(P[1] - Q[1]) > 0.04) rightMark(ctx, p, T, [sgn(Q[0] - T[0]) || 1, 0], [0, sgn(P[1] - T[1]) || 1], ink2);
        var u1 = unit(Q[0] - P[0], Q[1] - P[1]), u2 = unit(T[0] - P[0], T[1] - P[1]), g1 = Math.atan2(u1[1], u1[0]), g2 = Math.atan2(u2[1], u2[0]);
        var dg = Math.atan2(Math.sin(g2 - g1), Math.cos(g2 - g1)), mcol = st === 4 && t < 1 ? hi : ink;
        if (Math.abs(Q[1] - P[1]) > 0.04 && Math.abs(Q[0] - P[0]) > 0.04) {
          arcAt(ctx, p, P[0], P[1], 0.15, g1, g1 + dg, mcol, st === 4 && t < 1 ? 4 : 1.8);
          var gm = g1 + dg / 2; label(ctx, p, "a", p.X(P[0] + 0.25 * Math.cos(gm)), p.Y(P[1] + 0.25 * Math.sin(gm)), { size:13, align:"center", bgColor:st === 4 && t < 1 ? hi : null });
        }
        seg(ctx, p, P[0], T[1], P[0], P[1], f3, 4.5); seg(ctx, p, Q[0], Q[1], P[0], Q[1], f3, 4.5);
        if (sl2 < 1) { var x2 = P[0] + (colX - P[0]) * sl2, y2 = Q[1] + (ry - Q[1]) * sl2; seg(ctx, p, x2, Q[1], x2, P[1], f3, 4.5 + 5 * sl2, null, 1, "butt"); seg(ctx, p, Q[0], y2, P[0], y2, f3, 4.5 + 5 * sl2, null, 1, "butt"); }
      }
    }
    var has1 = st > 3 || (st === 3 && t >= 1), has2 = st > 4 || (st === 4 && t >= 1);
    if (v1 >= 1) {
      seg(ctx, p, mX, 0, mX, P[1], ink, 4, null, 1, "butt");
      var solid = st >= 5 && (st > 5 || t >= 1);
      seg(ctx, p, P[0], P[1], mX, P[1], solid ? ink : ink2, solid ? 1.6 : 1.3, solid ? null : [2, 4]);
      seg(ctx, p, P[0], ry - 0.09, P[0], ry + 0.09, ink, 2);
      seg(ctx, p, -1.3, ry, 1.3, ry, css("--rule"), 1);
    }
    if (has1) { seg(ctx, p, colX, 0, colX, Q[1], pen, cw, null, 1, "butt"); hbar(ctx, p, 0, Q[0], ry, cw, pen); }
    if (has2) { seg(ctx, p, colX, Q[1], colX, P[1], f3, cw, null, 1, "butt"); hbar(ctx, p, Q[0], P[0], ry, cw, f3); }
    if (has1) {
      label(ctx, p, "①", p.X(colX) - 10, p.Y(Q[1] / 2), { size:13, align:"right", color:pen });
      if (Math.abs(Q[0]) > 0.08) label(ctx, p, "①", p.X(Q[0] / 2), p.Y(ry) + 16, { size:12, align:"center", color:pen });
    }
    if (has2) {
      if (Math.abs(P[1] - Q[1]) > 0.06) label(ctx, p, "②", p.X(colX) - 10, p.Y((Q[1] + P[1]) / 2), { size:13, align:"right", color:f3 });
      if (Math.abs(P[0] - Q[0]) > 0.08) label(ctx, p, "②", p.X((Q[0] + P[0]) / 2), p.Y(ry) - 16, { size:12, align:"center", color:f3 });
    }
    if (v1 >= 1) {
      dot(ctx, p, P[0], P[1], 11, hi, null); dot(ctx, p, P[0], P[1], 6, pen, css("--sheet"), 2);
      label(ctx, p, "P", p.X(P[0] * 1.15), p.Y(P[1] * 1.15), { size:14, color:pen, align:"center", bg:false });
      label(ctx, p, "O", p.X(0) - 10, p.Y(0) + 11, { size:13, align:"center", bg:false });
      if (v2 >= 1) { var sq = unit(P[0] - Q[0], P[1] - Q[1]); label(ctx, p, "Q", p.X(Q[0] - sq[0] * 0.12), p.Y(Q[1] - sq[1] * 0.12), { size:13, align:"center", bg:false }); }
      if (v3 >= 0.35) label(ctx, p, "R", p.X(Q[0]), p.Y(0) + (Q[1] >= 0 ? 11 : -11), { size:13, align:"center", bg:false });
      if (v4 >= 0.35) label(ctx, p, "T", p.X(T[0] + (T[0] >= Q[0] ? 0.08 : -0.08)), p.Y(T[1] + (T[1] >= P[1] ? 0.08 : -0.08)), { size:13, align:"center", bg:false });
    }
  }
  function formHTML(){
    var s = S.mode === "minus" ? -1 : 1, o1 = s > 0 ? "+" : "-", o2 = s > 0 ? "-" : "+";
    var u = function(src, n){ return '<span class="cx-u' + n + '">' + MV.m(src) + '<span class="cx-pc" aria-hidden="true">' + (n === 1 ? "①" : "②") + '</span><span class="vh"> (piece ' + n + ")</span></span>"; };
    var sg = function(o){ return A.hl ? '<span class="cx-hl">' + MV.m(o) + "</span>" : MV.m(o); };
    return "<p>" + MV.m("sin(a " + o1 + " b) =") + " " + u("sin a cos b", 1) + " " + sg(o1) + " " + u("cos a sin b", 2) + "</p><p>" + MV.m("cos(a " + o1 + " b) =") + " " + u("cos a cos b", 1) + " " + sg(o2) + " " + u("sin a sin b", 2) + "</p>";
  }
  function paintForm(){
    var st = S.showAll ? 5 : S.stage, show = S.mode !== "add" && st === 5 && A.stT >= 1;
    form.innerHTML = show ? formHTML() : "";
    var c = cur(), capT = "";
    if (S.mode !== "add") {
      var i = st;
      if (i === 2) capT = U.cap3; else if (i === 4) capT = U.cap5;
      if (i === 3 || i === 4) { var ca = Math.cos(c.a), sa = Math.sin(c.a), th = c.s * c.b, P = [Math.cos(c.a + th), Math.sin(c.a + th)], Q = [Math.cos(c.b) * ca, Math.cos(c.b) * sa]; if (Q[0] < -1e-9 || Q[1] < -1e-9 || (i === 4 && (P[1] - Q[1] < -1e-9 || P[0] - Q[0] < -1e-9))) capT += (capT ? " " : "") + U.signed; }
    }
    $("#cx-cap", host).innerHTML = capT;
    L.cap.innerHTML = S.mode === "add" ? (c.ka != null ? MV.m("a + b = " + angS(c.ka + c.kb)) : "") : (c.ka != null ? MV.m("a " + (c.s > 0 ? "+" : "-") + " b = " + angS(c.ka + c.s * c.kb)) : "");
  }

  // ----- readout -----
  function angRow(c, s){
    if (c.ka == null) return MV.m("a ≈ " + d3(c.a) + ", b ≈ " + d3(c.b));
    var k = c.ka + s * c.kb, h = MV.m("a = " + angS(c.ka) + ", b = " + angS(c.kb) + ", a " + (s > 0 ? "+" : "-") + " b = " + angS(k));
    if (S.mode === "add" && k >= 24) return h + ", " + tpl(U.samePoint, { v:MV.m(angS(k - 24)) });
    return h + ' <span class="muted">(' + (k < 0 ? MINUS : "") + Math.abs(k * 15) + "°)</span>";
  }
  function pm(html, s){ return html.replace("±", s > 0 ? "+" : MINUS); }
  function addRows(c){
    var R = U.rows, sp = c.ka != null && special(c.ka) && special(c.kb), sa = Math.sin(c.a), sb = Math.sin(c.b), sab = Math.sin(c.a + c.b);
    var k = sp ? c.ka + c.kb : null, rows = [[R.angles, angRow(c, 1)]];
    rows.push([R.sum, sp ? MV.m(join(tS(term(c.ka, "sin")), "+", term(c.kb, "sin"))) + " " + dec(sa + sb) : dec(sa + sb)]);
    var ca = Math.cos(c.a), cbv = Math.cos(c.b), cab = Math.cos(c.a + c.b);
    var exS = function(v, fn){ return sp && special(k) ? mx(exact(k, fn), v) : dec(v); };
    if (A.hide) { rows.push([R.sinab, "?"]); rows.push([R.verdict, "?"]); }
    else {
      rows.push([R.sinab, exS(sab, "sin")]);
      var gap = sa + sb - sab;
      rows.push([R.verdict, Math.abs(gap) < 1e-9 ? U.equal : tpl(U.notEqual, { gap:d3(Math.abs(gap)), dir:gap > 0 ? U.big : U.small })]);
    }
    rows.push([R.cosrow, (sp ? MV.m(join(tS(term(c.ka, "cos")), "+", term(c.kb, "cos"))) + " " + dec(ca + cbv) : dec(ca + cbv)) + " vs " + (A.hide ? "?" : exS(cab, "cos"))]);
    rows.push([R.tally, tpl(U.tally, { n:Object.keys(S.tried).length, m:Object.keys(S.eq).length })]);
    return rows;
  }
  function buildRows(c){
    var R = U.rows, s = c.s, o = s > 0 ? "+" : "-", oc = s > 0 ? "-" : "+", rows = [];
    var sp = c.ka != null && special(c.ka) && special(c.kb), k = c.ka != null ? c.ka + s * c.kb : null;
    var sa = Math.sin(c.a), ca = Math.cos(c.a), sb = Math.sin(c.b), cb = Math.cos(c.b), p1 = sa * cb, p2 = ca * sb, q1 = ca * cb, q2 = sa * sb, h = p1 + s * p2, r = q1 - s * q2;
    rows.push([R.angles, angRow(c, s)]);
    rows.push([R.point, MV.m("(cos(a " + o + " b), sin(a " + o + " b))") + " ≈ (" + d3(r) + ", " + d3(h) + ")"]);
    var note = "";
    if (c.ka != null && !sp) {
      var ns = [c.ka, c.kb].filter(function(x){ return !special(x); }).filter(function(x, i, arr){ return arr.indexOf(x) === i; }).map(function(x){ return MV.m(angS(x)); });
      note = '<br><span class="tiny muted">' + tpl(ns.length > 1 ? U.notSpecial2 : U.notSpecial, { v:ns.join(" and ") }) + "</span>";
    }
    function line(f1, f2, x1, x2, y1, y2, op, val, fn){
      var head = f1 + " " + op + " " + f2;
      if (sp) {
        var T1 = tmul(term(c.ka, x1[0]), term(c.kb, x1[1])), T2 = tmul(term(c.ka, x2[0]), term(c.kb, x2[1]));
        var src = head + " = " + par(term(c.ka, x1[0])) + par(term(c.kb, x1[1])) + " " + op + " " + par(term(c.ka, x2[0])) + par(term(c.kb, x2[1])) + " = " + join(tS(T1), op, T2) + " = " + exact(k, fn, true);
        return MV.m(src) + (hasRoot(exact(k, fn, true)) ? " ≈ " + d3(val) : "");
      }
      var v1 = y1[0] * y1[1], v2 = y2[0] * y2[1], sg2 = op === "+" ? 1 : -1, w2 = sg2 * v2, opd = w2 < 0 ? MINUS : "+";
      var same = Math.round(Math.round(v1 * 1000) + sg2 * Math.round(v2 * 1000)) === Math.round(val * 1000);
      return MV.m(head) + " ≈ " + d3(y1[0]) + " × " + d3(y1[1]) + " " + (op === "+" ? "+" : MINUS) + " " + d3(y2[0]) + " × " + d3(y2[1]) + " ≈ " + d3(v1) + " " + opd + " " + d3(Math.abs(w2)) + (same ? " = " : " ≈ ") + d3(val);
    }
    rows.push([pm(R.height, s), line("sin a cos b", "cos a sin b", ["sin", "cos"], ["cos", "sin"], [sa, cb], [ca, sb], o, h, "sin") + note]);
    rows.push([R.hp, "① " + MV.m("sin a cos b") + " " + dec(p1) + " · ② " + (s > 0 ? MV.m("cos a sin b") + " " + dec(p2) : MV.m("-cos a sin b") + " " + decS(-p2) + (ca < -1e-9 && sb > 1e-9 ? " " + U.subAdds : ""))]);
    rows.push([pm(R.run, s), line("cos a cos b", "sin a sin b", ["cos", "cos"], ["sin", "sin"], [ca, cb], [sa, sb], oc, r, "cos")]);
    rows.push([R.rp, "① " + MV.m("cos a cos b") + " " + dec(q1) + " · ② " + (s > 0 ? MV.m("-sin a sin b") + " " + decS(-q2) : MV.m("+sin a sin b") + " " + decS(q2))]);
    if (S.tan) tanRows(c, rows, sp, k, o, oc);
    rows.push([R.check, tpl(U.checkRow, { v:d3(Math.sin(c.a + (A.th != null ? A.th : s * c.b))) })]);
    if (S.pin) {
      var pn = S.pin, kp = pn.a + (pn.mode === "plus" ? 1 : -1) * pn.b, spn = special(pn.a) && special(pn.b);
      rows.push([U.pinned, pinText(pn) + "<br>" + (spn ? MV.m("P = (" + exact(kp, "cos", true) + ", " + exact(kp, "sin", true) + ")") : "P ≈ (" + d3(Math.cos(kp * PI / 12)) + ", " + d3(Math.sin(kp * PI / 12)) + ")")]);
    }
    return rows;
  }
  function tanRows(c, rows, sp, k, o, oc){
    var R = U.rows, s = c.s, lab = pm(R.tan, s), fr = MV.m("{tan a " + o + " tan b}/{1 " + oc + " tan a tan b}"), den, denS = null, val;
    var ang = c.a + s * c.b, cosv = Math.cos(ang);
    var badA = Math.abs(Math.cos(c.a)) < 1e-9, badB = Math.abs(Math.cos(c.b)) < 1e-9;
    if (badA || badB) {
      var v = Math.abs(cosv) < 1e-9 ? U.undef : (sp ? "= " + mx(exact(k, "tan", true), Math.tan(ang)) : dec(Math.tan(ang)));
      if (Math.abs(cosv) < 1e-9) rows.push([lab, U.undef]);
      else rows.push([lab, pm(tpl(U.tanNo, { which:MV.m(badA ? "tan a" : "tan b"), v:v }), s).replace("±", s > 0 ? "+" : MINUS)]);
      return;
    }
    if (sp) {
      var ta = term(c.ka, "tan"), tb = term(c.kb, "tan"), pr = tmul(ta, tb);
      if (pr[2] === 1) { var nn = pr[1] - s * pr[0], g = gcd(nn, pr[1]) || 1; denS = tS([nn / g, pr[1] / g, 1]); } else denS = join("1", oc, pr);
      den = 1 - s * tV(pr);
      var num = join(tS(ta), o, tb);
      val = Math.abs(den) < 1e-9 ? tpl(U.tanUndef, { den:MV.m("1 " + oc + " tan a tan b") }) : MV.m("{tan a " + o + " tan b}/{1 " + oc + " tan a tan b} = {" + num + "}/{" + denS + "} = " + exact(k, "tan", true)) + (hasRoot(exact(k, "tan", true)) ? " ≈ " + d3(Math.tan(ang)) : "");
    } else {
      den = 1 - s * Math.tan(c.a) * Math.tan(c.b);
      val = Math.abs(den) < 1e-9 ? tpl(U.tanUndef, { den:MV.m("1 " + oc + " tan a tan b") }) : fr + " " + dec((Math.tan(c.a) + s * Math.tan(c.b)) / den);
    }
    rows.push([lab, val]);
    var w = Math.min(Math.abs(den), 2) / 2 * 100;
    rows.push([U.rows.den, MV.m("1 " + oc + " tan a tan b" + (denS != null ? " = " + denS : "")) + " " + (denS != null && !hasRoot(denS) ? "" : dec(den)) +
      '<span class="cx-dbar" aria-hidden="true"><b style="width:' + w.toFixed(1) + '%"></b></span>']);
  }
  function readout(){ var c = cur(); L.read.innerHTML = MV.readoutHTML(S.mode === "add" ? addRows(c) : buildRows(c)); }
  function paint(){ draw(); readout(); paintForm(); }
  plot.render = draw;

  // ----- controls -----
  L.ctrl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.tg) {
      var k = b.dataset.tg;
      if (k === "all") S.showAll = !S.showAll;
      else if (k === "nums") S.nums = !S.nums; else if (k === "tan") S.tan = !S.tan;
      A.stT = 1; api.save(); paintToggles(); paint(); return;
    }
    if (b.id === "cx-pin") { stop(); S.pin = { mode:S.mode, a:S.a, b:S.b }; api.save(); paintPin(); paint(); MV.changed(); return; }
    if (b.id === "cx-unpin") { S.pin = null; api.save(); paintPin(); paint(); MV.changed(); $("#cx-pin", host).focus(); }
  });

  // ----- predictions -----
  function startPred(p){
    stop(); var s0 = p.start;
    S.mode = s0.mode; S.a = s0.a; S.b = s0.b; if (s0.mode !== "add") S.built = true;
    A.av = A.bv = A.th = null; A.sw = 0; A.hl = false; A.hide = !!s0.hide; A.grow = 1; A.stT = 1; A.out = false; A.fl = 0;
    if (s0.all) { S.showAll = true; S.played = true; }
    if (s0.tan) { S.tan = true; S.showAll = true; S.played = true; }
    api.save(); sync(); paint(); MV.changed();
  }
  function runPred(p, done){
    var fin = function(){ A.cancel = null; api.save(); sync(); paint(); MV.changed(); paintFound(p.id === "p4"); done(); };
    if (p.id === "p1") {
      A.out = true;
      var go = function(){
        A.cancel = MV.tween({ dur:1200, step:function(t){ A.sw = t; draw(); }, done:function(){
          A.sw = 1; A.hide = false; A.grow = 0; readout();
          A.cancel = MV.tween({ dur:700, step:function(t){ A.grow = t; draw(); }, done:function(){ A.grow = 1; fin(); } });
        } });
      };
      if (MV.reduceMotion) { A.fl = 0; go(); }
      else A.cancel = MV.tween({ dur:900, step:function(t){ A.fl = 1 - t; draw(); }, done:function(){ A.fl = 0; later(300, go); } });
    } else if (p.id === "p2") {
      var said = false;
      A.cancel = MV.tween({ dur:2000, ease:function(t){ return t; }, step:function(t){
        A.bv = t * PI / 3; if (!said && A.bv >= PI / 6) { said = true; MV.banner("", MV.plain(U.onAxis)); } paint();
      }, done:function(){ A.bv = null; S.b = 4; MV.banner("", MV.plain(U.onAxis)); fin(); } });
    } else if (p.id === "p3") {
      var B0 = S.b * PI / 12;
      A.cancel = MV.tween({ dur:1500, step:function(t){ A.th = B0 * (1 - 2 * t); draw(); }, done:function(){ A.th = null; S.mode = "minus"; A.hl = true; fin(); } });
    } else if (p.id === "p4") {
      var i = 0;
      var next = function(){ i++; S.b = i; paint(); if (i < 3) later(900, next); else later(400, fin); };
      later(900, next);
    } else done();
  }

  // ----- challenges -----
  function bInfo(mode, a, b){ var s = mode === "plus" ? 1 : -1; return { mode:mode, a:a, b:b, s:s, k:a + s * b, sp:special(a) && special(b), nz:a > 0 && b > 0 }; }
  function goodB(x){ return x.sp && x.nz && x.k === 7; }
  function named1(x){
    var m = M.tc1, opS = x.s > 0 ? "+" : "-";
    if (x.k === 7) return m.nonSpecial;
    if (x.s < 0 && x.a + x.b === 7) return tpl(m.sumAngles, { calc:MV.m(angS(x.a) + " - " + angS(x.b) + " = " + angS(x.k)) });
    if (x.k === 5) return tpl(m.five, { calc:MV.m(angS(x.a) + " " + opS + " " + angS(x.b) + " = " + tw(x.a) + " " + opS + " " + tw(x.b) + " = 5π/12") });
    return tpl(m.other, { v:MV.m(angS(x.k)) });
  }
  function tc1(){
    var m = M.tc1;
    if (S.mode === "add") return { ok:false, msg:m.mode };
    var c = bInfo(S.mode, S.a, S.b), pn = S.pin ? bInfo(S.pin.mode, S.pin.a, S.pin.b) : null;
    if (pn && goodB(c) && goodB(pn)) return pn.mode !== c.mode ? { ok:true } : { ok:false, msg:tpl(m.same, { op:MV.m(c.s > 0 ? "a + b" : "a - b") }) };
    if (!goodB(c)) return { ok:false, msg:named1(c) };
    if (!pn) return { ok:false, msg:m.pin };
    return { ok:false, msg:named1(pn) };
  }
  function pieceStr(ka, kb, f1, f2, v){ return special(ka) && special(kb) ? "= " + MV.m(tS(tmul(term(ka, f1), term(kb, f2)))) : dec(v); }
  function tc2(){
    var m = M.tc2;
    if (S.mode !== "plus") return { ok:false, msg:m.mode };
    var a = S.a * PI / 12, b = S.b * PI / 12, p1 = Math.sin(a) * Math.cos(b), p2 = Math.cos(a) * Math.sin(b), h = Math.sin(a + b);
    var eq = Math.abs(p1 - p2) < 1e-9, hit = Math.abs(h - Math.sqrt(3) / 2) < 1e-9;
    if (eq && hit) return { ok:true };
    var P1 = pieceStr(S.a, S.b, "sin", "cos", p1), P2 = pieceStr(S.a, S.b, "cos", "sin", p2);
    if (eq && S.a === S.b) return { ok:false, msg:tpl(m.eqWrong, { v:MV.m(exact(2 * S.a, "sin", true)) }) };
    if (hit) return { ok:false, msg:tpl(m.heightOnly, { p1:P1, p2:P2 }) };
    if (Math.abs(p1 - p2) < 0.15) return { ok:false, msg:tpl(m.close, { p1:P1, p2:P2 }) };
    var sp = special(S.a) && special(S.b);
    return { ok:false, msg:tpl(m.other, { p1:P1, p2:P2, h:sp ? mx(exact(S.a + S.b, "sin", true), h) : "≈ " + d3(h) }) };
  }
  function tc3(){
    var m = M.tc3;
    if (S.mode !== "add") return { ok:false, msg:m.mode };
    var a = S.a * PI / 12, b = S.b * PI / 12, l = Math.sin(a + b), r = Math.sin(a) + Math.sin(b), k = S.a + S.b, sp = special(S.a) && special(S.b);
    var zero = S.a === 0 || S.a === 24 || S.b === 0 || S.b === 24;
    if (Math.abs(l - r) < 1e-9) return zero ? { ok:false, msg:m.zero } : { ok:true };
    if (k % 12 === 0 && k % 24 !== 0) return { ok:false, msg:tpl(m.half, { s:MV.m("sin " + angS(k)) }) };
    if (Math.abs(r) < 1e-9) return { ok:false, msg:tpl(m.cancel, { v:MV.m(angS(k)), sv:MV.m("sin(" + angS(k) + ")") + " " + eqv(sp ? exact(k, "sin", true) : null, l) }) };
    var lv = sp && special(k) ? eqv(exact(k, "sin", true), l) : dec(l), rv = sp ? "= " + MV.m(join(tS(term(S.a, "sin")), "+", term(S.b, "sin"))) + " " + dec(r) : dec(r);
    return { ok:false, msg:tpl(m.other, { l:MV.m("sin(a + b)") + " " + lv, r:MV.m("sin a + sin b") + " " + rv }) };
  }

  sync(); paint(); rest();
  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
}

// ---------- Part 3: the π/12 clock and the double-angle lab ----------
// @component valuePalette — exact-value palette (−1 … 1, nine tiles) with slot feedback: sign, sine/cosine swap, wrong family
var PAL = ["-1", "-r3", "-r2", "-h", "0", "h", "r2", "r3", "1"];
var PALV = { "1":1, r3:Math.sqrt(3) / 2, r2:Math.SQRT2 / 2, h:0.5, "0":0 };
var PALM = { "1":"1", r3:"{√3}/{2}", r2:"{√2}/{2}", h:"{1}/{2}", "0":"0" };
function palVal(k){ return k[0] === "-" ? -PALV[k.slice(1)] : PALV[k]; }
function palSrc(k){ return k[0] === "-" ? "-" + PALM[k.slice(1)] : PALM[k]; }
function palKey(v){ for (var i = 0; i < PAL.length; i++) if (Math.abs(palVal(PAL[i]) - v) < 1e-9) return PAL[i]; return null; }
function part3(host, api){
  var S = api.S, P3 = MV.C.part3, K = P3.clock, LB = P3.lab, RD = K.rounds;
  if (!S.view) S.view = "clock";
  S.r = S.r || [{}, {}, {}, {}]; if (S.cur == null) S.cur = 0;
  S.grid = S.grid || { cells:{}, done:false };
  if (S.th == null) S.th = 4; if (S.ls == null) S.ls = 0;
  host.innerHTML = '<div id="p3-view" class="p3-view"></div>' +
    '<div id="ck-pane"><div class="sym ck"><div><div class="plot-wrap ck-wrap"><canvas class="plot square" id="ck-plot" role="img" aria-label="The π/12 clock"></canvas></div><div class="chips" id="ck-tg"></div></div><div id="ck-work"></div></div></div>' +
    '<div id="lab-pane" hidden><div class="pg"><div class="pg-graph"><p class="eq-cap" id="lab-eq" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot square" id="lab-plot" role="img" aria-label="Double-angle lab"></canvas></div></div>' +
    '<div class="pg-ctrl"><div id="lab-sl"></div><div id="lab-player"></div><p class="cx-cap" id="lab-cap" aria-live="polite"></p><div class="chips" id="lab-tg"></div></div>' +
    '<div class="pg-read"><dl class="read" id="lab-read" aria-live="polite"></dl><details class="alg"><summary>' + LB.alg.title + "</summary>" + th(LB.alg.html) + "</details></div></div></div>";
  radios($("#p3-view", host), { label:P3.viewLabel, options:[{ id:"clock", t:P3.views[0] }, { id:"lab", t:P3.views[1] }], value:S.view, onChange:function(v){ S.view = v; api.save(); showView(); } });
  function showView(){ $("#ck-pane", host).hidden = S.view !== "clock"; $("#lab-pane", host).hidden = S.view !== "lab"; if (S.view === "clock") ck.render(); else lp.render(); }
  function th(html){ return String(html).replace(/θ/g, '<span class="p-t">θ</span>'); }

  // ===== the π/12 clock =====
  var NEW = [1, 5, 7, 11, 13, 17, 19, 23], GRID = K.reflect.rows;
  var ck = new MV.Plot($("#ck-plot", host), { xmin:-1.45, xmax:1.45, ymin:-1.45, ymax:1.45 }, { equal:true });
  var anim = { t:1, ring:0, cancel:null }, msg = { order:null };
  function rs(i){ return S.r[i]; }
  function solvedK(k){ for (var i = 0; i < 4; i++) if (RD[i].k === k) return !!rs(i).done; return S.grid.done && NEW.indexOf(k) >= 0; }
  function fName(i){ return MV.m(RD[i].r + "(" + angS(RD[i].k) + ")"); }
  function opOf(st){ return st.split ? st.split.op : "+"; }
  function landK(sp){ return sp.a + (sp.op === "+" ? 1 : -1) * sp.b; }
  function drawClock(){
    var i = S.cur < 4 ? S.cur : -1, st = i >= 0 ? rs(i) : null, wide = (ck.W || 0) >= 430, showAll = S.labels || wide;
    ck.draw({ view:{ xmin:-1.45, xmax:1.45, ymin:-1.45, ymax:1.45 }, equal:true, xTicks:{ step:0.5, fmt:tf }, yTicks:{ step:0.5, fmt:tf },
      describe:"The π/12 clock: the unit circle with 24 dots at the multiples of π/12. " + NEW.filter(solvedK).length + " of the 8 new dots are solved." + (st && st.on ? " Round " + (i + 1) + ": find " + RD[i].r + " of " + angT(RD[i].k) + "." : ""),
      after:function(ctx, p){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), hi = css("--hi");
        circle(ctx, p, 1, ink2);
        if (st && st.on && st.turn) {
          var sp = st.turn, A0 = sp.a * PI / 12, B0 = (sp.op === "+" ? 1 : -1) * sp.b * PI / 12, ta = clamp01(anim.t / 0.45), tb = clamp01((anim.t - 0.45) / 0.55);
          seg(ctx, p, 0, 0, Math.cos(A0 * ta), Math.sin(A0 * ta), ink, 2.5); arcAt(ctx, p, 0, 0, 0.18, 0, A0 * ta, ink);
          if (tb > 0) { var e = A0 + B0 * tb; seg(ctx, p, 0, 0, Math.cos(e), Math.sin(e), pen, 3); doubleArc(ctx, p, A0, e, 0.32, ink); }
        }
        for (var k = 0; k < 24; k++) {
          var a = k * PI / 12, x = Math.cos(a), y = Math.sin(a);
          if (special(k)) dot(ctx, p, x, y, 4, ink, null);
          else if (solvedK(k)) dot(ctx, p, x, y, 6, pen, null);
          else { dot(ctx, p, x, y, 6, css("--sheet"), pen, 2); txt(ctx, p, "?", p.X(x) - 3.5, p.Y(y), { size:11, bold:true, color:pen }); }
        }
        if (i >= 0 && anim.ring > 0) dot(ctx, p, Math.cos(RD[i].k * PI / 12), Math.sin(RD[i].k * PI / 12), 9 + 10 * anim.ring, null, hi, 3.5 * (1 - anim.ring) + 1);
        var cur = i >= 0 ? RD[i].k : null;
        for (var k2 = 0; k2 < 24; k2++) {
          var isNew = !special(k2), on = showAll || k2 === cur || (isNew && solvedK(k2));
          if (!on) continue;
          var a2 = k2 * PI / 12;
          label(ctx, p, angS(k2).replace(/(\d*)π\/(\d+)/, "{$1π}/{$2}"), p.X(1.25 * Math.cos(a2)), p.Y(1.25 * Math.sin(a2)), { size:11, align:"center", color:isNew ? pen : ink2, bg:false });
        }
        var last = -1; for (var j = 0; j < 4; j++) if (rs(j).done) last = j;
        if (last >= 0 && (S.cur < 4 || !S.grid.done)) {
          var kk = RD[last].k, aa = kk * PI / 12, cx = Math.cos(aa), sy = Math.sin(aa), isSin = RD[last].r === "sin";
          if (isSin) seg(ctx, p, cx, 0, cx, sy, pen, 3); else seg(ctx, p, 0, sy, cx, sy, pen, 3);
          label(ctx, p, "≈ " + d3(isSin ? sy : cx), isSin ? p.X(cx) + (cx >= 0 ? 8 : -8) : p.X(cx / 2), isSin ? p.Y(sy / 2) : p.Y(sy) + 14, { size:12, align:isSin ? (cx >= 0 ? "left" : "right") : "center", color:pen });
          label(ctx, p, "(" + exact(kk, "cos") + ", " + exact(kk, "sin") + ")", p.X(0.55 * cx), p.Y(0.55 * sy) + (sy >= 0 ? -6 : 6), { size:12, align:"center", color:pen });
        }
      } });
  }
  ck.render = drawClock;
  // invisible buttons over the 8 new dots, one tab stop, arrow keys move between them
  var dbox = document.createElement("div"); dbox.className = "ck-dots"; dbox.setAttribute("role", "group"); dbox.setAttribute("aria-label", "New dots on the clock");
  $(".ck-wrap", host).appendChild(dbox);
  var dfocus = 1;
  function syncDots(){
    dbox.innerHTML = NEW.map(function(k){
      var a = k * PI / 12, ri = RD.map(function(r){ return r.k; }).indexOf(k), lab = angT(k) + (solvedK(k) ? " (solved)" : ri === S.cur && !rs(ri).on ? ": start round " + (ri + 1) : ri >= 0 && !rs(ri).done ? ": round " + (ri + 1) : "");
      return '<button type="button" class="ck-dot" data-ck="' + k + '" tabindex="' + (k === dfocus ? 0 : -1) + '" aria-label="' + MV.esc(lab) + '" style="left:' + (ck.c.offsetLeft + ck.X(Math.cos(a))) + "px;top:" + (ck.c.offsetTop + ck.Y(Math.sin(a))) + 'px"></button>';
    }).join("");
  }
  ck.onDrawn(function(){ var f = document.activeElement && document.activeElement.dataset && document.activeElement.dataset.ck; syncDots(); if (f) { var b = dbox.querySelector('[data-ck="' + f + '"]'); if (b) b.focus({ preventScroll:true }); } });
  dbox.addEventListener("click", function(e){
    var b = e.target.closest("[data-ck]"); if (!b) return;
    var k = +b.dataset.ck; dfocus = k;
    var ri = RD.map(function(r){ return r.k; }).indexOf(k);
    if (S.cur < 4 && ri === S.cur) { rs(ri).on = true; msg.order = null; api.save(); }
    else if (S.cur < 4 && !solvedK(k)) msg.order = tpl(K.order, { v:MV.m(angS(RD[S.cur].k)) });
    paintWork(); drawClock();
  });
  dbox.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-ck]"); if (!b) return;
    var d = { ArrowRight:1, ArrowUp:1, ArrowLeft:-1, ArrowDown:-1 }[e.key]; if (d == null) return;
    e.preventDefault(); var i = NEW.indexOf(+b.dataset.ck); dfocus = NEW[(i + d + 8) % 8]; syncDots(); var nb = dbox.querySelector('[data-ck="' + dfocus + '"]'); if (nb) nb.focus();
  });
  function paintToggleC(){ MV.keepFocus($("#ck-tg", host), function(){ $("#ck-tg", host).innerHTML = chipsHTML([{ id:"labels", t:K.labels, on:S.labels }]); }); }
  $("#ck-tg", host).addEventListener("click", function(e){ var b = e.target.closest("[data-tg]"); if (!b) return; S.labels = !S.labels; api.save(); paintToggleC(); drawClock(); });

  var ui = {};   // transient feedback per round
  function formulaChips(i){
    var R = RD[i], st = rs(i), o = opOf(st), x = o === "+" ? "-" : "+", F = R.r === "sin" ? K.fSin : K.fCos;
    var sinF = function(op){ return "sin a cos b " + op + " cos a sin b"; }, cosF = function(op){ return "cos a cos b " + op + " sin a sin b"; };
    var A0 = st.split.a, B0 = st.split.b, sg = o === "+" ? 1 : -1, list;
    var spl = function(fn){ var v = fv(fn, A0 * PI / 12) + sg * fv(fn, B0 * PI / 12); return tpl(F.split, { word:o === "+" ? K.sum : K.diff, expr:MV.m(fn + "(" + angS(A0) + ") " + o + " " + fn + "(" + angS(B0) + ")"), v:MV.num(v, 2), h:MV.num(fv(fn, R.k * PI / 12), 2) }); };
    if (R.r === "sin") list = [
      { id:"ok", src:sinF(o), fb:tpl(F.ok, { op:MV.m("a " + o + " b") }) },
      { id:"sign", src:sinF(x), fb:tpl(F.sign, { other:MV.m("sin(a " + x + " b)") }) },
      { id:"cross", src:cosF(x), fb:tpl(F.cross, { other:MV.m("cos(a " + o + " b)") }) },
      { id:"split", src:"sin a " + o + " sin b", fb:spl("sin") }];
    else list = [
      { id:"ok", src:cosF(x), fb:tpl(F.ok, { op:MV.m("a " + o + " b") }) },
      { id:"sign", src:cosF(o), fb:F.sign },
      { id:"cross", src:sinF(o), fb:F.cross },
      { id:"split", src:"cos a " + o + " cos b", fb:spl("cos") }];
    return MV.shuffle(list, "ck" + i + o);
  }
  function slots(i){
    var st = rs(i), sp = st.split, o = opOf(st), A0 = sp.a, B0 = sp.b;
    if (RD[i].r === "sin") return { op:o, s:[["sin", A0], ["cos", B0], ["cos", A0], ["sin", B0]] };
    return { op:o === "+" ? "-" : "+", s:[["cos", A0], ["cos", B0], ["sin", A0], ["sin", B0]] };
  }
  function slotFb(fn, k, key){
    var want = fv(fn, k * PI / 12), got = palVal(key), other = fn === "sin" ? "cos" : "sin", ov = fv(other, k * PI / 12), ang = MV.m(angS(k));
    if (Math.abs(Math.abs(got) - Math.abs(want)) < 1e-9) return tpl(K.slotSign, { f:MV.m(fn + "(" + angS(k) + ")"), ang:ang, q:quadOf(k), r:fn === "sin" ? "sine" : "cosine", pn:want > 0 ? K.positive : K.negative });
    if (Math.abs(Math.abs(got) - Math.abs(ov)) < 1e-9) return tpl(K.slotSwap, { f:MV.m(other + "(" + angS(k) + ")") });
    var ag = Math.abs(got), fam = Math.abs(ag - 0.5) < 1e-9 || Math.abs(ag - Math.sqrt(3) / 2) < 1e-9 ? K.fam.h : Math.abs(ag - Math.SQRT2 / 2) < 1e-9 ? K.fam.r2 : K.fam.ax;
    return tpl(K.slotFam, { fam:fam, ang:ang, ref:MV.m(angS(refOf(k))) });
  }
  function doneLine(i){
    var R = RD[i], st = rs(i), sp = st.split, o = sp.op, other = R.r === "sin" ? "cos" : "sin", a = angS(sp.a), b = angS(sp.b);
    var expr = other === "cos" ? "cos(" + angS(R.k) + ") = cos(" + a + ")cos(" + b + ") " + (o === "+" ? "-" : "+") + " sin(" + a + ")sin(" + b + ")" : "sin(" + angS(R.k) + ") = sin(" + a + ")cos(" + b + ") " + o + " cos(" + a + ")sin(" + b + ")";
    return MV.m(R.r + "(" + angS(R.k) + ") = " + exact(R.k, R.r, R.k === 7)) + ' <span class="muted">' + tpl(K.other, { expr:MV.m(expr), v:MV.m(exact(R.k, other, R.k === 7)) }) + "</span>";
  }
  function roundHTML(i){
    var R = RD[i], st = rs(i), u = ui[i] || (ui[i] = {}), h = '<div class="ck-round" data-round="' + i + '"><h3 class="ck-h">' + tpl(K.roundHead, { n:i + 1, f:fName(i) }) + "</h3>";
    h += '<div class="q-actions">' + MV.hintBtn("ckh" + i, st.hint || 0) + "</div>" + MV.hintsHTML(R.hints, st.hint || 0);
    var sel = st.pick || {}, lock = !!st.splitOk;
    var tile = function(grp, k, txt){ var on = sel[grp] === k; return '<button type="button" class="fchip ck-tile" aria-pressed="' + on + '" data-pk="' + grp + '" data-v="' + k + '" data-k="ck' + grp + k + '"' + (lock || anim.cancel ? " disabled" : "") + ">" + txt + "</button>"; };
    h += '<div class="ck-step"><h4>1. ' + K.steps[0] + "</h4>";
    h += '<p class="tiny ck-lab">' + K.tilesA + '</p><div class="ck-tiles" role="group" aria-label="' + MV.esc(MV.plain(K.tilesA)) + '">' + [2, 3, 4, 6, 8, 9, 10, 12].map(function(k){ return tile("a", k, MV.m(angS(k))); }).join("") + "</div>";
    h += '<p class="tiny ck-lab">' + K.op + '</p><div class="ck-tiles" role="group" aria-label="' + MV.esc(K.op) + '">' + tile("op", "+", "+") + tile("op", "-", MINUS) + "</div>";
    h += '<p class="tiny ck-lab">' + K.tilesB + '</p><div class="ck-tiles" role="group" aria-label="' + MV.esc(MV.plain(K.tilesB)) + '">' + [2, 3, 4].map(function(k){ return tile("b", k, MV.m(angS(k))); }).join("") + "</div>";
    if (!lock) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-ckact="turn" data-k="ckturn"' + (sel.a && sel.op && sel.b && !anim.cancel ? "" : " disabled") + ">" + K.turn + "</button></div>";
    if (u.split) h += fbBox(u.split.good, u.split.html);
    h += "</div>";
    if (st.splitOk) {
      h += '<div class="ck-step"><h4>2. ' + K.steps[1] + '</h4><div class="opts ck-opts">' + formulaChips(i).map(function(c){
        var cls = "opt" + (st.fOk && c.id === "ok" ? " right" : u.fwrong === c.id ? " wrong" : "");
        return '<button type="button" class="' + cls + '" data-cf="' + c.id + '" data-k="ckf' + c.id + '"' + (st.fOk ? " disabled" : "") + "><span>" + MV.m(c.src) + "</span></button>";
      }).join("") + "</div>";
      if (u.f) h += fbBox(u.f.good, u.f.html);
      h += "</div>";
    }
    if (st.fOk) {
      var SL = slots(i), vals = st.slots || (st.slots = [null, null, null, null]);
      var sb = function(j){ var s = SL.s[j], v = vals[j], okv = v != null && Math.abs(palVal(v) - fv(s[0], s[1] * PI / 12)) < 1e-9, on = u.sel === j && !okv;
        return '<button type="button" class="ck-slot' + (okv ? " good" : v != null ? " bad" : "") + '" aria-pressed="' + on + '" data-sl="' + j + '" data-k="cks' + j + '"' + (okv || st.vOk ? " disabled" : "") + '><span class="ck-sf">' + MV.m(s[0] + "(" + angS(s[1]) + ")") + '</span><span class="ck-sv">' + (v != null ? MV.m(palSrc(v)) : "?") + "</span></button>"; };
      h += '<div class="ck-step"><h4>3. ' + K.steps[2] + "</h4>" + (st.vOk ? "" : '<p class="how">' + K.slotHow + "</p>");
      h += '<div class="ck-form">' + sb(0) + sb(1) + '<span class="ck-op">' + (SL.op === "+" ? "+" : MINUS) + "</span>" + sb(2) + sb(3) + "</div>";
      if (!st.vOk) h += '<div class="ck-pal" role="group" aria-label="' + MV.esc(K.palette) + '">' + PAL.map(function(k){ return '<button type="button" class="ck-pt" data-pal="' + k + '" data-k="ckp' + k + '">' + MV.m(palSrc(k)) + "</button>"; }).join("") + "</div>";
      if (u.v) h += fbBox(u.v.good, u.v.html);
      h += "</div>";
    }
    if (st.vOk) {
      h += '<div class="ck-step"><h4>4. ' + K.steps[3] + '</h4><div class="opts ck-opts">' + R.combine.map(function(c, j){
        var cls = "opt" + (st.done && MV.ok(c) ? " right" : u.cwrong === j ? " wrong" : "");
        return '<button type="button" class="' + cls + '" data-cc="' + j + '" data-k="ckc' + j + '"' + (st.done ? " disabled" : "") + "><span>" + c.t + "</span></button>";
      }).join("") + "</div>";
      if (u.c) h += fbBox(u.c.good, u.c.html);
      h += "</div>";
    }
    return h + "</div>";
  }
  function gridHTML(){
    var G = S.grid, cols = K.reflect.cols, h = '<div class="ck-round"><h3 class="ck-h">' + K.reflect.title + "</h3><p>" + K.reflect.intro + "</p>";
    var pair = function(k, col, opts){ var v = (G.cells[k] || {})[col], bad = G.checked && G.bad && G.bad[k + col];
      return '<span class="sg-pair' + (bad ? " bad" : "") + '" role="group" aria-label="' + MV.esc(angT(k) + ": " + MV.plain(cols[col === "ref" ? 1 : col === "s" ? 2 : 3])) + '">' + opts.map(function(o){ return '<button type="button" aria-pressed="' + (v === o.v) + '" data-gk="' + k + '" data-gc="' + col + '" data-gv="' + o.v + '" data-k="g' + k + col + o.v + '"' + (G.done ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</span>"; };
    h += '<div class="tbl-wrap"><table class="vt ck-grid"><thead><tr>' + cols.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      GRID.map(function(r){ return '<tr><th scope="row">' + MV.m(angS(r.k)) + "</th><td>" + pair(r.k, "ref", [{ v:"1", t:MV.m("π/12") }, { v:"5", t:MV.m("5π/12") }]) + "</td><td>" + pair(r.k, "s", [{ v:"+", t:"+" }, { v:"−", t:MINUS }]) + "</td><td>" + pair(r.k, "c", [{ v:"+", t:"+" }, { v:"−", t:MINUS }]) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    if (!G.done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-ckact="grid" data-k="ckgrid">' + K.reflect.check + "</button></div>";
    if (G.fb) h += fbBox(G.done, G.fb);
    return h + "</div>";
  }
  function paintWork(){
    var h = "", w = $("#ck-work", host);
    var solved = RD.map(function(r, i){ return rs(i).done ? "<li>" + doneLine(i) + "</li>" : ""; }).join("");
    if (solved) h += '<ul class="ck-done">' + solved + "</ul>";
    if (S.cur < 4) {
      if (!rs(S.cur).on) h += '<p class="ck-start">' + tpl(K.start, { n:S.cur + 1, f:fName(S.cur) }) + "</p>" + (msg.order ? '<p class="tiny muted">' + msg.order + "</p>" : "");
      else h += roundHTML(S.cur);
    } else if (!S.grid.done) h += gridHTML();
    else h += gridHTML() + '<div class="fb good" role="status"><p>' + K.done + '</p></div><details class="alg"><summary>' + K.dbl.title + "</summary><p>" + K.dbl.html + "</p></details>";
    MV.keepFocus(w, function(){ w.innerHTML = h; });
  }
  function bad(i){ var st = rs(i); st.bad = (st.bad || 0) + 1; }
  $("#ck-work", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var i = S.cur, st = i < 4 ? rs(i) : null, u = i < 4 ? (ui[i] || (ui[i] = {})) : null, R = RD[i];
    if (b.dataset.act === "hint" && st) { st.hint = Math.min(3, (st.hint || 0) + 1); api.save(); paintWork(); return; }
    if (b.dataset.pk) { st.pick = st.pick || {}; var v = b.dataset.pk === "op" ? b.dataset.v : +b.dataset.v; st.pick[b.dataset.pk] = v; u.split = null; api.save(); paintWork(); return; }
    if (b.dataset.ckact === "turn") {
      var sp = { a:st.pick.a, op:st.pick.op, b:st.pick.b }, k = landK(sp);
      st.turn = sp; anim.t = 0; anim.ring = 0;
      var finish = function(){
        anim.cancel = null; anim.t = 1;
        var calc = angS(sp.a) + " " + sp.op + " " + angS(sp.b);
        if (k === R.k) {
          st.split = sp; st.splitOk = true;
          u.split = { good:true, html:"✓ " + tpl(K.hit, { calc:MV.m(calc + " = " + tw(sp.a) + " " + sp.op + " " + tw(sp.b) + " = " + angS(k)) }) };
          MV.tween({ dur:900, step:function(t){ anim.ring = 1 - t; drawClock(); }, done:function(){ anim.ring = 0; drawClock(); } });
        } else {
          bad(i);
          var tip = sp.a + sp.b === R.k ? K.tryAdd : sp.a - sp.b === R.k ? K.trySub : ".";
          u.split = { good:false, html:"✗ " + (special(k) ? tpl(K.special, { calc:MV.m(calc + " = " + angS(k)), t:MV.m(angS(R.k)) }) : tpl(K.miss, { calc:MV.m(calc + " = " + tw(sp.a) + " " + sp.op + " " + tw(sp.b) + " = " + angS(k)), t:MV.m(angS(R.k)), tip:tip })) };
        }
        api.save(); paintWork(); drawClock(); MV.focusFb($("#ck-work", host));
      };
      var cn = MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ anim.t = t; drawClock(); }, done:finish });
      if (anim.t < 1) { anim.cancel = cn; paintWork(); }
      return;
    }
    if (b.dataset.cf) {
      var ch = formulaChips(i).filter(function(c){ return c.id === b.dataset.cf; })[0];
      if (ch.id === "ok") { st.fOk = true; u.fwrong = null; u.f = { good:true, html:"✓ " + ch.fb }; } else { bad(i); u.fwrong = ch.id; u.f = { good:false, html:"✗ " + ch.fb }; }
      api.save(); paintWork(); MV.focusFb($("#ck-work", host)); return;
    }
    if (b.dataset.sl != null) { u.sel = +b.dataset.sl; paintWork(); return; }
    if (b.dataset.pal) {
      var SL = slots(i), vals = st.slots, j = u.sel;
      var okAt = function(q){ return vals[q] != null && Math.abs(palVal(vals[q]) - fv(SL.s[q][0], SL.s[q][1] * PI / 12)) < 1e-9; };
      if (j == null || okAt(j)) { j = null; for (var q = 0; q < 4; q++) if (!okAt(q)) { j = q; break; } }
      if (j == null) return;
      vals[j] = b.dataset.pal; u.sel = j;
      if (okAt(j)) {
        u.v = null; var nx = null; for (var q2 = 0; q2 < 4; q2++) if (!okAt(q2)) { nx = q2; break; }
        u.sel = nx; if (nx == null) { st.vOk = true; u.v = { good:true, html:K.slotsDone }; }
      } else { bad(i); u.v = { good:false, html:"✗ " + slotFb(SL.s[j][0], SL.s[j][1], vals[j]) }; }
      api.save(); paintWork(); if (u.v) MV.focusFb($("#ck-work", host)); return;
    }
    if (b.dataset.cc != null) {
      var cj = +b.dataset.cc, c = R.combine[cj];
      if (MV.ok(c)) { st.done = true; st.first = (st.bad || 0) === 0 && (st.hint || 0) < 3; u.cwrong = null; u.c = { good:true, html:"✓ " + c.why }; S.cur = i + 1; dfocus = i + 1 < 4 ? RD[i + 1].k : 13; }
      else { bad(i); u.cwrong = cj; u.c = { good:false, html:"✗ " + c.why }; }
      api.save(); paintWork(); drawClock(); MV.focusFb($("#ck-work", host)); return;
    }
    if (b.dataset.gk) { var G = S.grid; G.cells[b.dataset.gk] = G.cells[b.dataset.gk] || {}; G.cells[b.dataset.gk][b.dataset.gc] = b.dataset.gv; G.checked = false; G.fb = null; api.save(); paintWork(); return; }
    if (b.dataset.ckact === "grid") {
      var G2 = S.grid, fbs = []; G2.bad = {}; G2.tries = (G2.tries || 0) + 1;
      GRID.forEach(function(r){ var c2 = G2.cells[r.k] || {}, rowBad = false;
        if (c2.ref !== String(r.ref)) { G2.bad[r.k + "ref"] = 1; rowBad = true; }
        if (c2.s !== r.s) { G2.bad[r.k + "s"] = 1; rowBad = true; }
        if (c2.c !== r.c) { G2.bad[r.k + "c"] = 1; rowBad = true; }
        if (rowBad) fbs.push(r.fb); });
      G2.checked = true;
      if (!fbs.length) { G2.done = true; G2.fb = K.reflect.good; } else G2.fb = "✗ " + fbs.join(" ");
      api.save(); paintWork(); drawClock(); MV.focusFb($("#ck-work", host));
    }
  });
  MV.ACTS.clock = { a:{ id:"clock" },
    stats:function(){ var f = 0, d = 0; S.r.forEach(function(r){ if (r.done) d++; if (r.first) f++; }); return { first:f, total:4, done:d, line:MV.plain(K.summary) + ": " + f + "/4" + (d < 4 ? " (unfinished)" : "") }; },
    missed:function(){ return S.r.some(function(r){ return (r.bad || 0) > 0 || (r.hint || 0) >= 3; }) ? MV.goalIdx(3) : []; } };

  // ===== the double-angle lab =====
  var lp = new MV.Plot($("#lab-plot", host), { xmin:-1.3, xmax:1.3, ymin:-1.3, ymax:1.3 }, { equal:true });
  var lab = { t:1, cancel:null, fl:0 }, lquiet = true;
  var lsl = angSlider($("#lab-sl", host), { id:"lab-th", label:LB.theta, min:0, max:12, value:S.th, den:24, page:2, color:"var(--p-t)", onChange:function(v){ S.th = v; lab.t = 1; api.save(); paintLab(); labFlash(); } });
  var lplay = MV.player($("#lab-player", host), { count:4, interval:1300, label:function(i){ return "Stage " + (i + 1) + " of 4: " + th(LB.stages[i]); },
    render:function(i){
      if (lquiet) return;
      var prev = S.ls; S.ls = i; api.save();
      if (lab.cancel) { lab.cancel(); lab.cancel = null; }
      if (i > prev && !MV.reduceMotion) { lab.t = 0; paintLab(); lab.cancel = MV.tween({ dur:800, ease:function(t){ return t; }, step:function(t){ lab.t = t; drawLab(); }, done:function(){ lab.t = 1; lab.cancel = null; paintLab(); } }); }
      else { lab.t = 1; paintLab(); }
    } });
  lplay.go(S.ls); lquiet = false;
  function paintLabTg(){ MV.keepFocus($("#lab-tg", host), function(){ $("#lab-tg", host).innerHTML = chipsHTML([{ id:"cmp", t:th(LB.compare), on:S.cmp }]); }); }
  $("#lab-tg", host).addEventListener("click", function(e){ var b = e.target.closest("[data-tg]"); if (!b) return; S.cmp = !S.cmp; api.save(); paintLabTg(); paintLab(); labFlash(); });
  function labFlash(){
    var t0 = S.th * PI / 24;
    if (!S.cmp || 2 * Math.sin(t0) <= 1 + 1e-9 || MV.reduceMotion) { lab.fl = 0; drawLab(); return; }
    MV.tween({ dur:900, step:function(t){ lab.fl = 1 - t; drawLab(); }, done:function(){ lab.fl = 0; drawLab(); } });
  }
  function drawLab(){
    var t0 = S.th * PI / 24, two = 2 * t0, st = S.ls, t = lab.t, vis = function(k){ return k < st ? 1 : k === st ? t : 0; };
    var P = [Math.cos(two), Math.sin(two)], Ap = [-1, 0], Mm = [(P[0] - 1) / 2, P[1] / 2], F = [P[0], 0];
    lp.draw({ view:{ xmin:-1.3, xmax:1.3, ymin:-1.3, ymax:1.3 }, equal:true, xTicks:{ step:0.5, fmt:tf }, yTicks:{ step:0.5, fmt:tf },
      describe:"Unit circle with A = (−1, 0) and P at angle 2θ = " + angT(2 * S.th, 24) + ". The chord AP is " + d3(2 * Math.cos(t0)) + " long; the height of P is " + d3(P[1]) + (S.cmp ? "; the comparison bar 2 sin θ is " + d3(2 * Math.sin(t0)) : "") + ".",
      after:function(ctx, p){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), ct = css("--p-t"), hi = css("--hi");
        var v0 = vis(0), v1 = vis(1), v2 = vis(2), v3 = vis(3);
        circle(ctx, p, 1, ink2);
        dot(ctx, p, -1, 0, 4.5, ink, null); label(ctx, p, "A", p.X(-1) - 12, p.Y(0) - 12, { size:14, align:"center", bg:false });
        label(ctx, p, "O", p.X(0) + 2, p.Y(0) + 12, { size:13, align:"center", bg:false });
        if (v3 > 0) {
          seg(ctx, p, P[0], P[1], P[0], P[1] * (1 - clamp01(v3 / 0.4)), ink2, 2, [5, 4]);
          if (v3 >= 0.4) {
            if (P[1] > 0.04 && P[0] > -0.96) rightMark(ctx, p, F, [-1, 0], [0, 1], ink2);
            seg(ctx, p, F[0], 0, P[0], P[1], pen, 4.5);
            seg(ctx, p, -1, -0.13, F[0], -0.13, ink, 1.5); seg(ctx, p, -1, -0.08, -1, -0.18, ink, 1.5); seg(ctx, p, F[0], -0.08, F[0], -0.18, ink, 1.5);
            label(ctx, p, "2cos²θ", p.X((F[0] - 1) / 2), p.Y(-0.25), { size:12, align:"center" });
            if (P[1] > 0.05) { var rgt = P[0] < 0.55, lx = P[0] + (rgt ? (S.cmp ? 0.26 : 0.07) : -0.07); label(ctx, p, "sin 2θ = 2 sin θ cos θ", p.X(lx), p.Y(rgt ? P[1] / 2 : P[1] * 0.3), { size:12, align:rgt ? "left" : "right", color:pen }); }
            label(ctx, p, "F", p.X(F[0]) + 10, p.Y(0) + 11, { size:13, align:"center", bg:false });
          }
        }
        if (v0 > 0) {
          var aa = two * v0;
          seg(ctx, p, 0, 0, Math.cos(aa), Math.sin(aa), pen, 3); arcAt(ctx, p, 0, 0, 0.2, 0, aa, ct, 2.5);
          if (v0 >= 1 && two > 0.1) label(ctx, p, "2θ", p.X(0.33 * Math.cos(two / 2)), p.Y(0.33 * Math.sin(two / 2)), { size:13, align:"center", color:ct });
        }
        if (v1 > 0) {
          seg(ctx, p, -1, 0, -1 + (P[0] + 1) * v1, P[1] * v1, ink, 2.5);
          if (v1 >= 1) {
            var tick = function(x, y, ang){ var n = [-Math.sin(ang), Math.cos(ang)]; seg(ctx, p, x - n[0] * 0.05, y - n[1] * 0.05, x + n[0] * 0.05, y + n[1] * 0.05, ink, 1.8); };
            tick(-0.5, 0, 0); tick(P[0] / 2, P[1] / 2, two);
            if (t0 > 0.05 && t0 < PI / 2 - 0.05) {
              arcAt(ctx, p, -1, 0, 0.2, 0, t0, ct, 2.2); label(ctx, p, "θ", p.X(-1 + 0.31 * Math.cos(t0 / 2)), p.Y(0.31 * Math.sin(t0 / 2)), { size:13, align:"center", color:ct });
              arcAt(ctx, p, P[0], P[1], 0.2, t0 + PI, two + PI, ct, 2.2);
              var mid = (t0 + two) / 2 + PI; label(ctx, p, "θ", p.X(P[0] + 0.31 * Math.cos(mid)), p.Y(P[1] + 0.31 * Math.sin(mid)), { size:13, align:"center", color:ct });
            }
          }
        }
        if (v2 > 0) {
          seg(ctx, p, 0, 0, Mm[0] * v2, Mm[1] * v2, ink2, 2, [5, 4]);
          if (v2 >= 1 && Math.hypot(P[0] + 1, P[1]) > 0.08) {
            if (Math.hypot(Mm[0], Mm[1]) > 0.06) rightMark(ctx, p, Mm, unit(-Mm[0], -Mm[1]), unit(P[0] - Mm[0], P[1] - Mm[1]), ink2);
            var n2 = Math.hypot(Mm[0], Mm[1]) > 0.06 ? unit(Mm[0], Mm[1]) : [0, 1], off = 0.12;
            seg(ctx, p, -1 + n2[0] * off, n2[1] * off, P[0] + n2[0] * off, P[1] + n2[1] * off, ink, 1.5);
            seg(ctx, p, -1 + n2[0] * 0.07, n2[1] * 0.07, -1 + n2[0] * 0.17, n2[1] * 0.17, ink, 1.5); seg(ctx, p, P[0] + n2[0] * 0.07, P[1] + n2[1] * 0.07, P[0] + n2[0] * 0.17, P[1] + n2[1] * 0.17, ink, 1.5);
            label(ctx, p, "2 cos θ", p.X(Mm[0] + n2[0] * 0.24), p.Y(Mm[1] + n2[1] * 0.24), { size:12, align:"center" });
            label(ctx, p, "M", p.X(Mm[0] - n2[0] * 0.1), p.Y(Mm[1] - n2[1] * 0.1), { size:13, align:"center", bg:false });
          }
        }
        if (S.cmp) {
          var hb = 2 * Math.sin(t0), bx = P[0] + (P[0] > 0.95 ? -0.16 : 0.16), top = Math.min(hb, 1.3);
          seg(ctx, p, bx, 0, bx, top, ink2, 6, [6, 4], 1, "butt");
          if (hb > 1 + 1e-9) {
            ctx.save(); ctx.globalAlpha = lab.fl * 0.85; ctx.fillStyle = hi; ctx.fillRect(p.X(bx) - 5, p.Y(top), 10, p.Y(1) - p.Y(top)); ctx.restore();
            ctx.save(); ctx.strokeStyle = hi; ctx.lineWidth = 2.5; ctx.strokeRect(p.X(bx) - 6, p.Y(top) - 1, 12, p.Y(1) - p.Y(top) + 2); ctx.restore();
          }
          txt(ctx, p, MV.plain(LB.cmpLab), p.X(bx) + (bx > 0.2 ? -8 : 8), p.Y(Math.min(hb, 1.15) + 0.1), { size:11, align:bx > 0.2 ? "right" : "left", bg:true });
        }
        if (v0 >= 1) { dot(ctx, p, P[0], P[1], 6, pen, css("--sheet"), 2); label(ctx, p, "P", p.X(P[0] * 1.14), p.Y(P[1] * 1.14), { size:14, align:"center", color:pen, bg:false }); }
      } });
  }
  lp.render = drawLab;
  // exact strings for θ = 0, π/12, …, π/2 (index = twelfths)
  var LX = {
    s:["0", SMALL, "{1}/{2}", "{√2}/{2}", "{√3}/{2}", BIG, "1"],
    chord:["2", "{√6 + √2}/{2}", "√3", "√2", "1", "{√6 - √2}/{2}", "0"],
    s2:["0", "{2 - √3}/{4}", "{1}/{4}", "{1}/{2}", "{3}/{4}", "{2 + √3}/{4}", "1"],
    twoS2:["0", "{2 - √3}/{2}", "{1}/{2}", "1", "{3}/{2}", "{2 + √3}/{2}", "2"],
    tan:["0", "2 - √3", "{√3}/{3}", "1", "√3", "2 + √3", null],
    twoTan:["0", "4 - 2√3", "{2√3}/{3}", "2", "2√3", "4 + 2√3", null],
    tan2:["0", "(2 - √3)^2", "{1}/{3}", "1", "3", "(2 + √3)^2", null],
    twoSin:["0", "{√6 - √2}/{2}", "1", "√2", "√3", "{√6 + √2}/{2}", "2"]
  };
  function labRows(){
    var R = LB.rows, k = S.th, t0 = k * PI / 24, two = 2 * t0, rows = [], ev = k % 2 === 0, j = k / 2, k2 = k;   // 2θ = kπ/12
    var sn = Math.sin(t0), cs = Math.cos(t0);
    rows.push([th(R.angles), MV.m("θ = " + angS(k, 24) + ", 2θ = " + angS(k2))]);
    rows.push([th(R.chord), ev ? mx(LX.chord[j], 2 * cs) : dec(2 * cs)]);
    rows.push([th(R.height), special(k2) || ev ? mx(exact(k2, "sin"), Math.sin(two)) : dec(Math.sin(two))]);
    rows.push([th(R.prod), ev ? MV.m("2 × " + LX.s[j] + " × " + LX.s[6 - j] + " = " + exact(k2, "sin")) : "≈ 2 × " + d3(sn) + " × " + d3(cs) + " " + dec(2 * sn * cs)]);
    if (ev) {
      var c2 = LX.s2[6 - j], s2 = LX.s2[j], ex = exact(k2, "cos");
      rows.push([th(R.cos3), MV.m("cos^2θ - sin^2θ = " + c2 + " - " + s2 + " = " + ex) + "<br>" + MV.m("2cos^2θ - 1 = " + LX.twoS2[6 - j] + " - 1 = " + ex) + "<br>" + MV.m("1 - 2sin^2θ = 1 - " + LX.twoS2[j] + " = " + ex)]);
    } else rows.push([th(R.cos3), dec(Math.cos(two)) + " " + tpl(LB.allThree, { v:MV.m(exact(k2, "cos")), ang:MV.m(angS(k2)) })]);
    var tv;
    if (k === 12) tv = th(LB.tanNo);
    else if (k === 6) tv = th(LB.tanUndef);
    else if (ev) { var ex2 = exact(k2, "tan"); tv = MV.m("{" + LX.twoTan[j] + "}/{1 - " + LX.tan2[j] + "} = " + ex2) + (hasRoot(ex2) ? " ≈ " + d3(Math.tan(two)) : ""); }
    else tv = special(k2) ? MV.m(exact(k2, "tan")) + " " + tpl(LB.tanExact, { ang:MV.m(angS(k2)) }) : dec(Math.tan(two));
    rows.push([th(R.tan), tv]);
    if (S.cmp) rows.push([th(R.two), (ev ? MV.m(LX.twoSin[j]) + (hasRoot(LX.twoSin[j]) ? " ≈ " + d3(2 * sn) : "") : dec(2 * sn)) + (k === 0 ? th(LB.same) : tpl(th(LB.more), { v:dec(Math.sin(two)) }))]);
    return rows;
  }
  function paintLab(){
    drawLab();
    $("#lab-read", host).innerHTML = MV.readoutHTML(labRows());
    $("#lab-eq", host).innerHTML = MV.m("@t{θ} = " + angS(S.th, 24) + ", 2@t{θ} = " + angS(S.th));
    $("#lab-cap", host).innerHTML = th(LB.caps[S.ls]) + (S.th === 0 || S.th === 12 ? " " + LB.flat : "");
  }
  paintLabTg(); paintToggleC(); paintWork(); paintLab(); drawClock(); showView();
  return {};
}

// ---------- Practice 2: exact values, forwards and backwards ----------
function entries(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msg = {};
  function ist(id){ return S.items[id] || (S.items[id] = { v:["", ""], pal:null, tries:0, hint:0, solved:false, first:null }); }
  function box(it, j, lab){ var x = ist(it.id); return '<input type="text" class="numin en-box" autocomplete="off" spellcheck="false" data-ei="' + it.id + '" data-j="' + j + '" aria-label="' + MV.esc(lab) + '" value="' + MV.esc(x.v[j] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function inputHTML(it){
    var x = ist(it.id);
    if (it.kind === "r62") return '<span class="en-frac"><span class="en-top">' + MV.m("(") + box(it, 0, "p, the number in front of √6") + MV.m("√6 +") + box(it, 1, "q, the number in front of √2") + MV.m("√2)") + '</span><span class="en-bar" aria-hidden="true"></span><span class="en-bot">' + MV.m("4") + "</span></span>";
    if (it.kind === "r3") return box(it, 0, "p, the whole part") + MV.m("+") + box(it, 1, "q, the number in front of √3") + MV.m("√3");
    if (it.kind === "sin3") return MV.m("sin 3θ =") + box(it, 0, "p, the number in front of sin θ") + MV.m("sin θ +") + box(it, 1, "q, the number in front of sin cubed θ") + MV.m("sin^3θ");
    if (it.kind === "frac") return box(it, 0, "your answer");
    return '<span class="tiny muted">' + a.palHow + '</span><div class="ck-pal en-pal" role="group" aria-label="Exact-value palette">' + PAL.map(function(k){ return '<button type="button" class="ck-pt" aria-pressed="' + (x.pal === k) + '" data-ep="' + it.id + '" data-pv="' + k + '" data-k="ep' + it.id + k + '"' + (x.solved ? " disabled" : "") + ">" + MV.m(palSrc(k)) + "</button>"; }).join("") + "</div>";
  }
  function shown(it){
    var v = MV.ans(it);
    if (it.kind === "r62") return MV.m(v[0] > 0 ? "{√6 - √2}/{4}" : "{√2 - √6}/{4}");
    if (it.kind === "r3") return MV.m(v[0] + " - √3");
    if (it.kind === "sin3") return MV.m(v[0] + " sin θ - " + Math.abs(v[1]) + "sin^3θ");
    if (it.kind === "pal") return MV.m(palSrc(v));
    return MV.m(String(v).replace(/^(-?)(\d+)\/(\d+)$/, "$1{$2}/{$3}"));
  }
  function paintItem(it, n){
    var x = ist(it.id), el = host.querySelector('[data-en="' + it.id + '"]');
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + n + '</span><div class="q-prompt">' + (it.star ? '<span class="tag">★ ' + a.nonRoutine + (it.tag ? ": " + it.tag : "") + "</span> " : "") + it.prompt + "</div></div>";
    h += '<div class="en-in">' + inputHTML(it) + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-ec="' + it.id + '" data-k="ec' + it.id + '">Check</button>' + MV.hintBtn("eh" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += fbBox(true, "<strong>✓ Correct:</strong> " + shown(it) + "." + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msg[it.id]) h += msg[it.id];
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it){ return '<div class="q en" data-en="' + it.id + '"></div>'; }).join("");
  a.items.forEach(function(it, i){ paintItem(it, i + 1); });
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset.ei) return; ist(t.dataset.ei).v[+t.dataset.j] = t.value; api.save(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box2 = b.closest("[data-en]"); if (!box2) return;
    var it = a.items.filter(function(q){ return q.id === box2.dataset.en; })[0], x = ist(it.id), n = a.items.indexOf(it) + 1;
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it, n); return; }
    if (b.dataset.ep) { x.pal = b.dataset.pv; msg[it.id] = null; api.save(); paintItem(it, n); return; }
    if (b.dataset.ec) {
      var want = MV.ans(it), got, right, known = null;
      if (it.kind === "pal") {
        if (!x.pal) { msg[it.id] = fbBox(false, a.fill); paintItem(it, n); return; }
        got = x.pal; right = got === want; (it.wrong || []).forEach(function(w){ if (w.m === got) known = w.fb; });
      } else {
        var nb = it.kind === "frac" ? 1 : 2, vals = [];
        for (var j = 0; j < nb; j++) { var r = MV.parseNum(x.v[j]); if (!r || r.length !== 1) { msg[it.id] = fbBox(false, a.fill); paintItem(it, n); MV.focusFb(box2); return; } vals.push(r[0]); }
        var near = function(u, v){ return Math.abs(u - v) < 1e-6; };
        if (it.kind === "frac") { var wv = MV.parseNum(want)[0]; right = near(vals[0], wv); (it.wrong || []).forEach(function(w){ if (near(MV.parseNum(w.m)[0], vals[0])) known = w.fb; }); }
        else { right = near(vals[0], want[0]) && near(vals[1], want[1]); (it.wrong || []).forEach(function(w){ if (near(w.m[0], vals[0]) && near(w.m[1], vals[1])) known = w.fb; }); }
      }
      if (right) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
      else { x.tries++; msg[it.id] = fbBox(false, "<strong>✗ Not quite.</strong> " + (known ? known + " Try again." : a.generic)); }
      api.save(); paintItem(it, n); MV.focusFb(box2);
    }
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Set the question ----------
var task = (function(){
  var api, plot, pressing = false, QS = ["1", "2", "3", "4", "6"], R6 = Math.sqrt(6), R2 = Math.SQRT2, R3 = Math.sqrt(3);
  var KEYS = [
    { id:"b", t:"(√6 + √2)/4", m:BIG, v:(R6 + R2) / 4 }, { id:"s", t:"(√6 − √2)/4", m:SMALL, v:(R6 - R2) / 4 },
    { id:"-b", t:"−(√6 + √2)/4", m:"-" + BIG, v:-(R6 + R2) / 4 }, { id:"-s", t:"−(√6 − √2)/4", m:"-" + SMALL, v:-(R6 - R2) / 4 },
    { id:"t+", t:"2 + √3", m:"2 + √3", v:2 + R3 }, { id:"t-", t:"2 − √3", m:"2 - √3", v:2 - R3 },
    { id:"-t+", t:"−(2 + √3)", m:"-(2 + √3)", v:-(2 + R3) }, { id:"-t-", t:"−(2 − √3)", m:"-(2 - √3)", v:-(2 - R3) }];
  function keyOf(id){ return KEYS.filter(function(k){ return k.id === id; })[0]; }
  function U(){ return MV.C.task.ui; }
  function piK(p, q){ p = String(p == null ? "" : p).trim(); if (!/^\d+$/.test(p) || +p > 24 || QS.indexOf(String(q)) < 0) return null; return (+p) * 12 / (+q); }
  function read(){
    var s = api ? api.S : {}, xp = String(s.xp == null ? "" : s.xp).trim();
    return { kx:/^\d+$/.test(xp) && +xp >= 1 && +xp <= 23 ? +xp : null, ka:piK(s.ap, s.aq), kb:piK(s.bp, s.bq), op:s.op || "", r:s.r || "", key:s.key || "" };
  }
  function rv(r, k){ var a = k * PI / 12; return r === "tan" ? Math.sin(a) / Math.cos(a) : fv(r, a); }
  function land(d){ return d.ka != null && d.kb != null && d.op ? d.ka + (d.op === "+" ? 1 : -1) * d.kb : null; }
  function keyOk(d){ var k = keyOf(d.key); return !!(k && d.kx != null && d.r && Math.abs(k.v - rv(d.r, d.kx)) < 1e-9); }
  function inR(k){ return k != null && k > 0 && k < 24 && k % 6 !== 0; }
  function checks(d){
    var L = land(d);
    return [d.kx != null && !special(d.kx), inR(d.ka) && inR(d.kb) && quadOf(d.ka) !== quadOf(d.kb), L != null && d.kx != null && L === d.kx,
      d.kx != null && !!d.r && rv(d.r, d.kx) < -1e-9, pressing && keyOk(d)];
  }
  function sig(d){ return [d.kx, d.ka, d.op, d.kb, d.r, d.key].join("|"); }
  function where(k){ var u = U(); return k == null ? "?" : (k <= 0 || k >= 24) ? u.outside : k % 6 === 0 ? u.axis : tpl(u.quad, { n:quadOf(k) }); }
  function draw(){
    var d = read(), c = checks(d), L = land(d);
    plot.draw({ view:{ xmin:-1.45, xmax:1.45, ymin:-1.45, ymax:1.45 }, equal:true, xTicks:{ step:0.5, fmt:tf }, yTicks:{ step:0.5, fmt:tf },
      describe:"Unit circle preview." + (d.kx != null ? " Target x = " + angT(d.kx) + "." : "") + (d.ka != null ? " Arm a at " + angT(d.ka) + "." : "") + (L != null ? " The turn lands at " + angT(L) + "." : ""),
      after:function(ctx, p){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen");
        circle(ctx, p, 1, ink2);
        if (d.ka != null) { var A0 = d.ka * PI / 12; seg(ctx, p, 0, 0, Math.cos(A0), Math.sin(A0), ink, 2.5); arcAt(ctx, p, 0, 0, 0.18, 0, A0, ink); }
        if (L != null) { var A1 = d.ka * PI / 12, E = L * PI / 12; seg(ctx, p, 0, 0, Math.cos(E), Math.sin(E), pen, 3); doubleArc(ctx, p, A1, E, 0.3, ink); }
        if (d.kx != null) {
          var X = d.kx * PI / 12, xx = Math.cos(X), yy = Math.sin(X);
          if (c[2]) dot(ctx, p, xx, yy, 8, pen, null);
          else { dot(ctx, p, xx, yy, 8, css("--sheet"), pen, 2.2); txt(ctx, p, "?", p.X(xx) - 3.5, p.Y(yy), { size:12, bold:true, color:pen }); }
          label(ctx, p, angS(d.kx).replace(/(\d*)π\/(\d+)/, "{$1π}/{$2}"), p.X(1.27 * xx), p.Y(1.27 * yy), { size:12, align:"center", color:pen, bg:false });
        }
        if (L != null && !(d.kx != null && mod24(L) === d.kx)) { var E2 = L * PI / 12; dot(ctx, p, Math.cos(E2), Math.sin(E2), 6, pen, css("--sheet"), 2); }
        else if (L != null) { var E3 = L * PI / 12; dot(ctx, p, Math.cos(E3), Math.sin(E3), 4, css("--sheet"), null); }
      } });
    var capEl = $("#tk-cot");
    if (capEl) capEl.innerHTML = L != null && d.kx != null && L !== d.kx && mod24(L) === d.kx ? tpl(U().cot, { eq:MV.m(angS(L) + " = " + angS(d.kx) + " " + (L > d.kx ? "+" : "-") + " 2π") }) : "";
  }
  function live(){
    var d = read(), u = U(), el = $("#tk-live"); if (!el) return;
    el.innerHTML = d.kx != null && d.ka != null && d.kb != null && d.op && d.r ? tpl(u.live, { rx:MV.m(d.r + "(" + angS(d.kx) + ")"), eq:MV.m(angS(d.kx) + " = " + angS(d.ka) + " " + d.op + " " + angS(d.kb)) }) : '<span class="muted">' + u.liveWait + "</span>";
    var kv = $("#tk-keyv"); if (kv) { var k = keyOf(d.key); kv.innerHTML = k ? MV.m(k.m) : ""; }
  }
  function patch(){
    var li = $("#task-checks") && $("#task-checks").children[4]; if (!li) return;
    var d = read(), S = api.S, done = S.chk && S.chk.sig === sig(d);
    li.className = done ? (S.chk.ok ? "yes" : "no") : "no";
    li.innerHTML = '<span class="mk" aria-hidden="true">' + (done ? (S.chk.ok ? "✓" : "✗") : "○") + "</span><span>" + MV.C.task.checks[4] + (done ? "" : ' <span class="tiny muted">(' + U().pending + ")</span>") + '<span class="vh">' + (done ? (S.chk.ok ? " (met)" : " (not met)") : "") + "</span></span>";
  }
  function upd(){ draw(); live(); api.update(); patch(); }
  function post(){
    var d = read(), S = api.S, T = MV.C.task;
    if (!(d.kx != null && d.ka != null && d.kb != null && d.op && d.r && d.key)) return;
    var ok = keyOk(d); S.chk = { sig:sig(d), ok:ok }; if (S.first == null) S.first = ok;
    api.save(); patch();
    var st = MV.taskState(), rs = {};
    st.found.forEach(function(k){ rs[k.split("|")[4]] = 1; });
    var fb = $("#task-fb .fb.good");
    if (fb && rs.sin && rs.cos && rs.tan && checks(d).every(function(x, i){ return i === 4 ? ok : x; })) { var pp = document.createElement("p"); pp.innerHTML = T.afterEach; fb.appendChild(pp); }
    MV.paintSummary();
  }
  function qText(k){ var p = k.split("|"); return MV.m(p[4] + "(" + angS(+p[0]) + ")") + ", " + MV.m(angS(+p[0]) + " = " + angS(+p[1]) + " " + p[2] + " " + angS(+p[3])); }
  return {
    render:function(inp, pv, a){
      api = a; var S = a.S, u = U();
      var pq = function(n){
        var q = S[n + "q"] || "";
        return '<div class="tk-row"><span class="tk-name">' + MV.m(n + " =") + '</span><span class="tk-frac"><input id="tk-' + n + 'p" data-tk="' + n + 'p" type="text" inputmode="numeric" autocomplete="off" maxlength="2" aria-label="' + n + ': the number in front of π, p (0 to 24)" value="' + MV.esc(S[n + "p"] || "") + '">' +
          '<span class="tk-line" aria-hidden="true"></span><select id="tk-' + n + 'q" data-tk="' + n + 'q" aria-label="' + n + ': the denominator q"><option value="">q</option>' + QS.map(function(x){ return '<option value="' + x + '"' + (q === x ? " selected" : "") + ">" + x + "</option>"; }).join("") + '</select></span><span class="tk-pi">π</span></div>';
      };
      inp.innerHTML = '<div class="tk-in">' +
        '<div class="tk-row"><span class="tk-name">' + MV.m("x =") + '</span><button type="button" class="btn sm cx-pm" data-xs="-1" aria-label="x: step down">−</button><input id="tk-xp" data-tk="xp" type="text" inputmode="numeric" autocomplete="off" maxlength="2" aria-label="x: the number of twelfths of π (1 to 23)" value="' + MV.esc(S.xp || "") + '"><button type="button" class="btn sm cx-pm" data-xs="1" aria-label="x: step up">+</button><span class="tk-pi">' + MV.m("π/12") + "</span></div>" +
        pq("a") + '<div class="tk-row" id="tk-op"></div>' + pq("b") + '<div class="tk-row" id="tk-r"></div>' +
        '<div class="tk-row tk-keyrow"><label for="tk-key" class="tk-lab">' + u.key + '</label><select id="tk-key" data-tk="key"><option value="">' + u.keyPick + "</option>" + KEYS.map(function(k){ return '<option value="' + k.id + '"' + (S.key === k.id ? " selected" : "") + ">" + k.t + "</option>"; }).join("") + '</select><span id="tk-keyv" class="tk-keyv"></span></div>' +
        '<p class="tiny muted tk-note">' + u.keyNote + '</p><p class="tiny muted">' + u.pq + "</p></div>";
      radios($("#tk-op", inp), { label:u.op, value:S.op || null, options:[{ id:"+", t:"+" }, { id:"-", t:MINUS }], onChange:function(v){ S.op = v; a.save(); upd(); } });
      radios($("#tk-r", inp), { label:u.ratio, value:S.r || null, options:[{ id:"sin", t:MV.m("sin") }, { id:"cos", t:MV.m("cos") }, { id:"tan", t:MV.m("tan") }], onChange:function(v){ S.r = v; a.save(); upd(); } });
      pv.innerHTML = '<div id="tk-pvbox"><p class="tk-live" id="tk-live" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot square" id="tk-plot" role="img" aria-label="Unit circle preview"></canvas></div><p class="tiny" id="tk-cot" aria-live="polite"></p></div>';
      plot = new MV.Plot($("#tk-plot"), { xmin:-1.45, xmax:1.45, ymin:-1.45, ymax:1.45 }, { equal:true }); plot.render = draw;
      var on = function(e){ var k = e.target.dataset.tk; if (!k) return; S[k] = e.target.value; a.save(); upd(); };
      inp.addEventListener("input", on); inp.addEventListener("change", on);
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-xs]"); if (!b) return; var v = parseInt(S.xp, 10); v = isNaN(v) ? 1 : Math.max(1, Math.min(23, v + (+b.dataset.xs))); S.xp = String(v); $("#tk-xp").value = S.xp; a.save(); upd(); });
      var btn = $("#task-check"); if (btn) btn.addEventListener("click", function(){ pressing = true; setTimeout(function(){ pressing = false; post(); }, 0); });
      // phones: the preview sits above the checklist
      var mq = window.matchMedia ? window.matchMedia("(max-width: 820px)") : null, box = $("#tk-pvbox");
      var place = function(){ if (mq && mq.matches) inp.appendChild(box); else pv.appendChild(box); plot.render(); };
      if (mq) { if (mq.addEventListener) mq.addEventListener("change", place); place(); }
      draw(); live(); setTimeout(patch, 0);
    },
    read:read,
    valid:function(d){ return d.kx != null && d.ka != null && d.kb != null && d.op && d.r && d.key ? true : U().fill; },
    checks:checks,
    tips:function(d, c){
      var T = MV.C.task, out = [], L = land(d), opm = MV.m("a " + (d.op || "+") + " b");
      if (!c[0]) out.push(T.tips[0]);
      if (!c[1]) out.push(tpl(T.tips[1], { qa:where(d.ka), qb:where(d.kb) }));
      if (!c[2]) {
        if (L != null && d.kx != null && mod24(L) === d.kx) out.push(tpl(T.tipCot, { ab:opm, v:MV.m(angS(L)), xpm:MV.m(angS(d.kx) + " " + (L > d.kx ? "+" : "-") + " 2π"), x:MV.m(angS(d.kx)), xeq:MV.m(angS(d.kx) + " = a " + d.op + " b") }));
        else out.push(tpl(T.tips[2], { ab:opm, v:MV.m(L != null ? angS(L) : "?") }));
      }
      if (!c[3] && d.kx != null && d.r) out.push(tpl(T.tips[3], { rx:MV.m(d.r + " x"), n:quadOf(d.kx), r:MV.m(d.r) }));
      if (!c[4]) out.push(tpl(T.tips[4], { rab:MV.m(d.r + "(a " + d.op + " b)") }));
      return out;
    },
    key:function(d){ return [d.kx, d.ka, d.op, d.kb, d.r].join("|"); },
    label:function(k){ return qText(k); },
    text:function(k){ return MV.plain(qText(k)); },
    summary:function(ts){
      var u = U(), S = ts.app || {}, list = (ts.found || []).map(function(k){ return MV.plain(qText(k)); }).join("; ");
      return [tpl(u.line, { s:ts.found && ts.found.length ? tpl(u.solved, { q:list }) : u.notSolved, f:S.first == null ? u.firstNot : S.first ? u.firstYes : u.firstNo })];
    }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ entries:entries },
  task:task
});
})();
