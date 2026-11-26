// MHF4U 40 Power Law of Logarithms: hero (log ruler), Power stacker (Explore: Stack / Measure / Graph), Base bridge
// (Part 3: block bars + build sheet + "Why it works" reason chips), Power moves (Practice 2) and the "Same graph, new recipe" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS, RM = MV.reduceMotion;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function LIN(t){ return t; }
function def(o, d){ Object.keys(d).forEach(function(k){ if (o[k] === undefined) o[k] = JSON.parse(JSON.stringify(d[k])); }); return o; }
function sub(s, o){ return String(s).replace(/\{(\w+)\}/g, function(a, k){ return o[k] != null ? o[k] : a; }); }

// ---------- exact rationals [n, d] ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function Q(n, d){ if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return [n / g, d / g]; }
function qadd(a, b){ return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
function qmul(a, b){ return Q(a[0] * b[0], a[1] * b[1]); }
function qdiv(a, b){ return Q(a[0] * b[1], a[1] * b[0]); }
function qeq(a, b){ return a[0] === b[0] && a[1] === b[1]; }
function qv(a){ return a[0] / a[1]; }
function qs(a){ return (a[0] < 0 ? MINUS : "") + Math.abs(a[0]) + (a[1] === 1 ? "" : "/" + a[1]); }
function qw(a){ return (a[1] !== 1 || a[0] < 0) ? "(" + qs(a) + ")" : qs(a); }          // wrapped for "×"
function sig4(v){ var a = Math.abs(v); if (!isFinite(v)) return "—"; if (!a) return "0"; return num(+v.toPrecision(4), Math.max(0, 3 - Math.floor(Math.log10(a)))); }

// @component exactPow — numbers as prime-exponent maps with rational exponents ("8", "1/9", "√2"): exact logs
// (logQ: is log_b x a fraction?), exact powers, simplest radical form of x^(p/q) for q = 2, 3
function fac(n){ var e = {}, p = 2; while (n > 1 && p * p <= n) { while (n % p === 0) { e[p] = (e[p] || 0) + 1; n /= p; } p++; } if (n > 1) e[n] = (e[n] || 0) + 1; return e; }
var NUMS = {};
function N(k){
  k = String(k);
  if (NUMS[k]) return NUMS[k];
  var root = k.charAt(0) === "√", body = root ? k.slice(1) : k, parts = body.split("/"), a = +parts[0], b = parts[1] ? +parts[1] : 1, e = {};
  var fa = fac(a), fb = fac(b);
  Object.keys(fa).forEach(function(p){ e[p] = Q(fa[p], root ? 2 : 1); });
  Object.keys(fb).forEach(function(p){ e[p] = qadd(e[p] || [0, 1], Q(-fb[p], root ? 2 : 1)); });
  return (NUMS[k] = { k:k, v:root ? Math.sqrt(a / b) : a / b, e:e, frac:b !== 1, root:root });
}
function logQ(b, x){
  var keys = {}, k = null, ok = true;
  Object.keys(b.e).concat(Object.keys(x.e)).forEach(function(p){ keys[p] = 1; });
  var ps = Object.keys(keys);
  if (!ps.some(function(p){ return b.e[p] && b.e[p][0]; })) return null;
  ps.forEach(function(p){
    var eb = b.e[p] || [0, 1], ex = x.e[p] || [0, 1];
    if (!eb[0]) { if (ex[0]) ok = false; return; }
    var r = qdiv(ex, eb); if (k === null) k = r; else if (!qeq(k, r)) ok = false;
  });
  return ok ? (k || [0, 1]) : null;
}
function powQ(x, n){
  var A = 1, B = 1, ok = true;
  Object.keys(x.e).forEach(function(p){ var t = qmul(x.e[p], n); if (t[1] !== 1) ok = false; else if (t[0] > 0) A *= Math.pow(+p, t[0]); else B *= Math.pow(+p, -t[0]); });
  return ok ? [A, B] : null;
}
function radQ(x, n){
  var q = n[1], A = 1, B = 1, R = 1, bad = false;
  if (q !== 2 && q !== 3) return null;
  Object.keys(x.e).forEach(function(p){
    var t = qmul(x.e[p], n); if (q % t[1]) { bad = true; return; }
    var a = t[0] * (q / t[1]), w = Math.floor(a / q), r = a - w * q;
    if (w > 0) A *= Math.pow(+p, w); else if (w < 0) B *= Math.pow(+p, -w);
    R *= Math.pow(+p, r);
  });
  if (bad || R === 1) return null;
  return (A === 1 ? "" : A) + (q === 2 ? "√" : "∛") + R + (B === 1 ? "" : "/" + B);
}
function fr(ab){ return ab[1] === 1 ? num(ab[0]) : num(ab[0]) + "/" + num(ab[1]); }
function scaled(x, n){ var e = {}; Object.keys(x.e).forEach(function(p){ e[p] = qmul(x.e[p], n); }); return { e:e }; }
// value of x^n: {src (m() source after "x^n = "), txt (short text for canvas), v, exact}
function powInfo(x, n){
  var v = Math.pow(x.v, qv(n)), ex = powQ(x, n);
  if (ex) { var r0 = (n[1] === 2 || n[1] === 3) && n[0] > 0 && !x.frac && !x.root ? (n[1] === 2 ? "√" : "∛") + Math.round(Math.pow(x.v, n[0])) + " = " : "";
    return { src:r0 + fr(ex), txt:fr(ex), arg:fr(ex), v:v, exact:true }; }
  var r = radQ(x, n);
  if (r) { var mid = n[0] > 0 && !x.frac ? (n[1] === 2 ? "√" : "∛") + Math.round(Math.pow(x.v, n[0])) : null;
    return { src:(mid && mid !== r ? mid + " = " : "") + r + " ≈ " + num(v, 3), txt:"≈ " + num(v, 3), arg:r, v:v, exact:false, rad:true }; }
  return { src:"≈ " + sig4(v), txt:"≈ " + sig4(v), arg:null, v:v, exact:false };
}

// ---------- canvas helpers ----------
// @component G11 canvasMath (from MHF4U 37) — canvas text with ^{…} superscripts and _{…} subscripts in the math font
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
  if (o.bg) { var ga = ctx.globalAlpha; ctx.globalAlpha = ga * 0.85; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, y - F * 0.8, w + 6, F * 1.6); ctx.globalAlpha = ga; }
  ctx.fillStyle = o.color || css("--ink");
  segs.forEach(function(sg){ ctx.font = font(sg); ctx.fillText(sg.t, x0, y + (sg.lv === 1 ? -F * 0.38 : sg.lv === -1 ? F * 0.3 : 0)); x0 += sg.w; });
  ctx.restore();
  return w;
}
function uiText(ctx, s, x, y, o){
  o = o || {};
  ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  ctx.font = (o.weight || 400) + " " + (o.size || 12) + "px " + (css("--font-ui") || "sans-serif");
  ctx.fillStyle = o.color || css("--ink-2"); ctx.textAlign = o.align || "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y);
  var w = ctx.measureText(s).width; ctx.restore(); return w;
}
function seg(ctx, x1, y1, x2, y2, col, w, dash){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1.5; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function tri(ctx, x, y, dir, s, col){ ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x + dir * s, y); ctx.lineTo(x - dir * s * 0.4, y - s * 0.75); ctx.lineTo(x - dir * s * 0.4, y + s * 0.75); ctx.closePath(); ctx.fill(); ctx.restore(); }
function hatch(ctx, x0, y0, w, h, col){
  if (w < 0) { x0 += w; w = -w; }
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.beginPath();
  for (var k = x0 - h; k < x0 + w + h; k += 6) { ctx.moveTo(k, y0 + h); ctx.lineTo(k + h, y0); }
  ctx.stroke(); ctx.restore();
}
// a block or stick from px a to px b (either order) in a lane: fill colour/alpha, outline, dashed ghost after `fill` (0..1)
function block(ctx, a, b, y, h, o){
  var L = Math.min(a, b), R = Math.max(a, b), w = R - L, f = o.fill == null ? 1 : o.fill, sp = (b - a) * f;
  if (w < 0.5) return;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (f > 0) {
    var fa = a, fb = a + sp, fl = Math.min(fa, fb), fw = Math.abs(sp);
    ctx.save(); ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * (o.fillAlpha == null ? 1 : o.fillAlpha); ctx.fillStyle = o.fillCol || css("--hi-soft"); ctx.fillRect(fl, y, fw, h); ctx.restore();
    ctx.strokeStyle = o.line || css("--ink"); ctx.lineWidth = 1.5; ctx.strokeRect(fl, y, fw, h);
  }
  if (f < 1) { var ga = a + sp, gl = Math.min(ga, b), gw = Math.abs(b - ga); ctx.setLineDash([5, 4]); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.3; ctx.strokeRect(gl, y + 0.5, gw, h - 1); ctx.setLineDash([]); }
  if (o.arrow && w * f > 14) tri(ctx, a + sp - Math.sign(b - a) * 7, y + h / 2, Math.sign(b - a), 6, o.line || css("--ink"));
  ctx.restore();
}

// @component radioGroup (from MHF4U 25/32/37) — segmented control or chip row as a real radio group (arrow keys, roving tabindex, lock)
function radios(host, o){
  var val = String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? " disabled" : "") + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ b = !!b; if (b !== locked) { locked = b; paint(); } } };
}
// @component N9 stepSlider (from MHF4U 32/37) — slider over a list of positions with 40 px − / + buttons, a formatted value
// and Page Up / Page Down steps (o.page)
function stepSlider(host, o){
  host.innerHTML = '<div class="pl-sl" style="--sc:var(' + o.color + ')"><div class="pl-sl-top"><label for="sl40-' + o.id + '">' + o.label + '</label><output id="sl40-' + o.id + '-o" for="sl40-' + o.id + '"></output></div>' +
    '<div class="pl-sl-row"><button type="button" class="btn ghost pl-pm" data-pm="-1" data-k="' + o.id + 'm" aria-label="Decrease ' + o.name + '">' + MINUS + '</button><input type="range" id="sl40-' + o.id + '" min="0" max="' + (o.n - 1) + '" step="1">' +
    '<button type="button" class="btn ghost pl-pm" data-pm="1" data-k="' + o.id + 'p" aria-label="Increase ' + o.name + '">+</button></div></div>';
  var inp = host.querySelector("input"), out = host.querySelector("output"), btns = host.querySelectorAll("[data-pm]"), cur = o.idx, locked = false, label = null;
  function paint(){
    inp.value = cur; out.innerHTML = label || o.fmt(cur); inp.setAttribute("aria-valuetext", MV.plain(label || o.fmt(cur)));
    inp.disabled = locked; btns[0].disabled = locked || cur <= 0; btns[1].disabled = locked || cur >= o.n - 1;
  }
  function go(i, how){ i = clamp(i, 0, o.n - 1); label = null; if (i === cur) { paint(); return; } cur = i; paint(); o.onChange(cur, how); }
  inp.addEventListener("input", function(){ cur = +inp.value; label = null; paint(); o.onChange(cur, "drag"); });
  inp.addEventListener("keydown", function(e){ if (e.key === "PageUp" || e.key === "PageDown") { e.preventDefault(); if (!locked) go(cur + (e.key === "PageUp" ? 1 : -1) * (o.page || 2), "key"); } });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pm]"); if (!b || b.disabled) return; go(cur + +b.dataset.pm, "step"); });
  paint();
  return { set:function(i, lab){ cur = i; label = lab || null; paint(); }, lock:function(b){ locked = !!b; paint(); }, get:function(){ return cur; } };
}

// ---------- log notation (m() sources) ----------
function lb(b, plain){ b = String(b); return b === "10" ? "log" : "log_{" + (plain ? b : "@b{" + b + "}") + "}"; }
function arg(s){ s = String(s); return /\/|^[−-]|√.*\//.test(s) || /^\d+√/.test(s) ? "(" + s + ")" : " " + s; }
function nsrc(n){ return "@n{" + qs(n) + "}"; }
function nmul(n){ return n[1] !== 1 ? "(" + nsrc(n) + ")" : nsrc(n); }
function xb(x){ return x.frac || x.root ? "(" + x.k + ")" : x.k; }

// ---------- @component G4+G14 logRuler — log ruler: number side (integer powers of a base, plus always-labelled numbers),
// length side (lengths from 1 in chosen units, cross-fading on a units change), auto-fit window handled by the caller ----------
function powLabel(B, k){
  var v = Math.pow(B, Math.abs(k)), s = v < 1e6 ? num(Math.round(v)) : B + "^{" + Math.abs(k) + "}";
  return k < 0 ? "1/" + s : s;
}
function rulerBase(ctx, p, o){
  var W = p.W, y = o.y, y0 = y - 11, y1 = y + 11, lo = p.v.xmin, hi = p.v.xmax, ink = css("--ink"), ink2 = css("--ink-2");
  ctx.save();
  if (o.reveal != null && o.reveal < 1) { ctx.beginPath(); ctx.rect(0, 0, W * o.reveal, p.H); ctx.clip(); }
  ctx.fillStyle = css("--paper"); ctx.fillRect(0, y0, W, 22);
  seg(ctx, 0, y0, W, y0, ink, 1.5); seg(ctx, 0, y1, W, y1, ink, 1.5);
  // number side
  var B = o.tickLn, k0 = Math.ceil(lo / B - 1e-9), k1 = Math.floor(hi / B + 1e-9), sp = B / (hi - lo) * W, placed = [];
  function fits(x0, x1, row){ return !placed.some(function(q){ return q.row === row && x0 < q.x1 + 6 && x1 > q.x0 - 6; }); }
  (o.specials || []).forEach(function(s){
    var X = p.X(s.u); if (X < -4 || X > W + 4) return;
    seg(ctx, X, y0, X, y0 - 9, s.color || ink, 2);
    var w = cmath(ctx, s.t, 0, 0, { size:13, dry:true }), x0 = clamp(X - w / 2, 2, W - w - 2), row = 0;
    while (row < 2 && !fits(x0, x0 + w, row)) row++;
    placed.push({ x0:x0, x1:x0 + w, row:row });
    cmath(ctx, s.t, x0, y0 - 19 - row * 16, { size:13, color:s.color || ink });
  });
  if (sp >= 4) for (var k = k0; k <= k1; k++) {
    var X = p.X(k * B); seg(ctx, X, y0, X, y0 - 6, ink, 1.2);
    if (sp < 30) continue;
    var t = powLabel(o.tickBase, k), w = cmath(ctx, t, 0, 0, { size:12, weight:400, dry:true }), x0 = X - w / 2;
    if (x0 < 1 || x0 + w > W - 1 || !fits(x0, x0 + w, 0)) continue;
    placed.push({ x0:x0, x1:x0 + w, row:0 });
    cmath(ctx, t, x0, y0 - 19, { size:12, weight:400, color:ink });
  }
  // length side
  function lengths(U, alpha){
    var span = (hi - lo) / U, step = span < 3 ? 0.5 : 1, px = function(s){ return s * U / (hi - lo) * W; };
    while (px(step) < 30) step = step < 1 ? 1 : step < 2 ? 2 : step < 5 ? 5 : step * 2;
    var tick = px(1) >= 6 ? (span < 3 ? 0.5 : 1) : step;
    for (var u = Math.ceil(lo / U / tick - 1e-9) * tick; u <= hi / U + 1e-9; u += tick) {
      var X = p.X(u * U); seg(ctx, X, y1, X, y1 + 6, ink, 1);
      var r = Math.round(u / step); if (Math.abs(u - r * step) > 1e-6) continue;
      uiText(ctx, num(u, 3), X, y1 + 15, { alpha:alpha, color:ink2 });
    }
  }
  if (o.lens) o.lens.forEach(function(L){ var X = p.X(L.u); seg(ctx, X, y1, X, y1 + 6, ink, 1); uiText(ctx, L.t, X, y1 + 15, { alpha:L.a, color:ink2 }); });
  else if (o.fade) { ctx.save(); lengths(o.fade.from, 1 - o.fade.t); lengths(o.fade.to, o.fade.t); ctx.restore(); }
  else lengths(o.unitLn, 1);
  ctx.restore();
}

// ---------- hero: one block copied three times on a base-2 ruler, then relabelled in base 10 (plan storyboard) ----------
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:-0.4 * Math.LN2, xmax:6.75 * Math.LN2, ymin:0, ymax:1 });
  var H = RM ? { rv:1, b1:1, s2:1, s3:1, rel:1, fl:0 } : { rv:0, b1:0, s2:0, s3:0, rel:0, fl:0, flAt:0 };
  var L2 = Math.LN2;
  function cap(s){ f.cap.innerHTML = s ? MV.md(s) : ""; }
  p.render = function(){
    p.draw({ grid:false, axes:false, view:p.view, describe:H.rel ? "Log ruler with the three blocks ending at 64, relabelled in base-10 lengths: 6 times 0.301 is 1.806." : "Base-2 log ruler from 1 to 64 with blocks of length log base 2 of 4 laid end to end.", after:function(ctx){
      var W = p.W, Hh = p.H, y = Math.max(64, Hh * 0.36), ly = y + 50, lh = Math.max(28, Hh * 0.12);
      var specials = [0, 1, 2, 3, 4, 5, 6].map(function(k){ return { u:k * L2, t:String(Math.pow(2, k)) }; });
      var lens = []; [0, 1, 2, 3, 4, 5, 6].forEach(function(k){ lens.push({ u:k * L2, t:String(k), a:1 - H.rel }); if (H.rel) lens.push({ u:k * L2, t:num(k * 0.301, 3), a:H.rel }); });
      rulerBase(ctx, p, { y:y, tickLn:L2, tickBase:2, specials:specials, lens:lens, reveal:H.rv });
      var X = function(u){ return p.X(u * L2); };
      if (H.b1) {
        block(ctx, X(0), X(2), ly, lh, { alpha:H.b1 });
        if (H.s2) block(ctx, X(2 * H.s2), X(2 * H.s2 + 2), ly, lh, {});
        if (H.s3) block(ctx, X(2 + 2 * H.s3), X(4 + 2 * H.s3), ly, lh, {});
        cmath(ctx, "log_{2} 4 = 2", (X(0) + X(2)) / 2, ly + lh / 2, { size:13, align:"center", alpha:H.b1 });
        if (H.s2 >= 1) uiText(ctx, "×4", X(2), ly + lh + 12, { color:css("--ink"), weight:700 });
        if (H.s3 >= 1) uiText(ctx, "×4", X(4), ly + lh + 12, { color:css("--ink"), weight:700 });
      }
      if (H.fl > 0) { ctx.save(); ctx.globalAlpha = H.fl; ctx.strokeStyle = css("--hi"); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(X(H.flAt), y - 11, 9, 0, 6.3); ctx.stroke(); ctx.restore(); }
    } });
  };
  var C1 = "`log_{@b{2}}(4^{@n{3}}) = @n{3} log_{@b{2}} 4 = @n{3} × 2 = 6`";
  var C2 = "Same blocks, different ruler: `log_{@b{2}} 64 = log 64 / log @b{2} = 6 log 2 / log 2 = 6`";
  if (RM) { cap(C2); p.render(); return; }
  cap(""); p.render();
  function tw(key, dur, done){ MV.tween({ dur:dur, ease:key === "rv" ? LIN : MV.ease, step:function(t){ H[key] = t; p.render(); }, done:done }); }
  function flash(at, done){ H.flAt = at; MV.tween({ dur:700, ease:LIN, step:function(t){ H.fl = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7; p.render(); }, done:function(){ H.fl = 0; p.render(); if (done) done(); } }); }
  tw("rv", 1200, function(){ setTimeout(function(){ tw("b1", 500, function(){ setTimeout(function(){
    tw("s2", 600, function(){ flash(4); setTimeout(function(){ tw("s3", 600, function(){ flash(6); cap(C1);
      setTimeout(function(){ tw("rel", 800, function(){ cap(C2); }); }, 2200); }); }, 400); });
  }, 300); }); }, 300); });
}

// ---------- Explore: Power stacker ----------
var XS = ["1/3", "1/2", "2", "3", "4", "5", "8", "9", "10", "16", "25", "27", "100"];
var MBASES = ["1/9", "1/3", "1/2", "√2", "2", "3", "4", "5", "8", "9", "10", "16", "27"];
var MLIST = (function(){ var a = []; [100, 81, 64, 32, 27, 16, 10, 9, 8, 7, 6, 5, 4, 3, 2].forEach(function(d){ a.push("1/" + d); }); for (var i = 1; i <= 100; i++) a.push(String(i)); [125, 128, 243, 256, 512, 625, 729, 1000].forEach(function(v){ a.push(String(v)); }); return a; })();
var MLN = MLIST.map(function(k){ return Math.log(N(k).v); });
var SN = []; for (var i15 = -6; i15 <= 8; i15++) SN.push(i15 / 2);
var GN = SN.filter(function(v){ return v !== 0; });
function nearestM(u){ var best = 0; for (var i = 1; i < MLN.length; i++) if (Math.abs(MLN[i] - u) < Math.abs(MLN[best] - u)) best = i; return best; }
function chipT(k){ return m(k); }

function explore(host, api){
  var C = api.content, S = def(api.S, { mode:"stack", sb:2, sx:"8", sn:[2, 1], sex:false, mb:"8", mx:"32", mu:"2", msw:false, gl:"power", gn:2, gb:10, gcb:"2", gz:6, ch:null });
  var O = { busy:false, win:null, winC:null, nA:null, slide:null, g45:0, fade:null, p3note:"", rm:"", hideBlue:false, blueT:1, leftT:1, flash:false, p4:false, cancel:[] };
  host.innerHTML = '<div class="pl-top" id="pl-mode"></div><div class="pl-chal" id="pl-chal" hidden></div>' +
    '<div class="pg pl-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap pl-cap" id="pl-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot" id="pl-cv" role="img" aria-label="Power stacker"></canvas></div><p class="tiny muted pl-note" id="pl-note" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="pl-cs"><div class="pl-row" id="pl-sb"></div><div class="pl-row"><span class="rg-lab pl-lab">Block number ' + m("x") + ':</span><div class="pl-scroll" id="pl-sx"></div></div><div class="pl-row" id="pl-sn"></div>' +
      '<div class="pl-row pl-exact"><span class="pl-exl">Exact ' + m("@n{n}") + ':</span><span class="nm-row"><span class="m">' + m("@n{n} =") + '</span><button type="button" class="btn ghost sm pl-sign" id="pl-sign" data-k="plsign" aria-label="Sign: positive. Press to make it negative.">+</button>' +
      '<input class="numin pl-in" id="pl-p" type="text" inputmode="numeric" autocomplete="off" aria-label="Numerator p, a whole number from 0 to 24"><span class="m">/</span><input class="numin pl-in" id="pl-q" type="text" inputmode="numeric" autocomplete="off" aria-label="Denominator q, a whole number from 1 to 6">' +
      '<button type="button" class="btn sm" id="pl-apply" data-k="plapply">Apply</button></span><span class="tiny pl-exmsg" id="pl-exmsg" aria-live="polite"></span></div></div>' +
    '<div id="pl-cm"><div class="pl-row" id="pl-mb"></div><div class="pl-row"><span class="nm-row"><label for="pl-mx" class="m">' + m("x =") + '</label><input class="numin pl-in2" id="pl-mx" type="text" inputmode="text" autocomplete="off"><button type="button" class="btn sm" id="pl-mxgo" data-k="plmxgo">Set</button></span><span class="tiny pl-exmsg" id="pl-mxmsg" aria-live="polite"></span></div>' +
      '<p class="tiny muted pl-help">Or drag the blue pointer along the ruler. On the pointer, arrow keys move to the next number, Shift + arrow jumps 10 numbers, and Home and End go to 1/100 and 1000.</p>' +
      '<div class="pl-row" id="pl-mu"></div><div class="pl-row"><button type="button" class="btn ghost sm pl-tog" id="pl-msw" data-k="plmsw" aria-pressed="false">Swap roles</button></div></div>' +
    '<div id="pl-cg"><div class="pl-row" id="pl-gl"></div><div id="pl-gp"><div class="pl-row" id="pl-gn"></div><div class="pl-row" id="pl-gb"></div></div><div id="pl-gc"><div class="pl-row" id="pl-gcb"></div></div><div class="pl-row" id="pl-gz"></div></div></div>' +
    '<div class="pg-read"><dl class="read" id="pl-read" aria-live="polite"></dl></div></div>';
  var cv = $("#pl-cv", host), plot = new MV.Plot(cv, { xmin:-1, xmax:3, ymin:0, ymax:1 });
  // ----- controls -----
  var rMode = radios($("#pl-mode", host), { label:"Mode:", aria:"Mode", options:[{ id:"stack", t:"Stack" }, { id:"measure", t:"Measure" }, { id:"graph", t:"Graph" }], value:S.mode, onChange:function(v){ if (O.busy) return; if (S.ch) S.ch = null; S.mode = v; userChange(true); } });
  var rSB = radios($("#pl-sb", host), { label:"Base " + m("@b{b}") + ":", aria:"Base b", cls:"chips pl-b", options:[2, 3, 10].map(function(v){ return { id:v, t:m(String(v)) }; }), value:S.sb, onChange:function(v){ S.sb = +v; userChange(); } });
  var rSX = radios($("#pl-sx", host), { label:"", aria:"Block number x", cls:"chips", options:XS.map(function(k){ return { id:k, t:chipT(k) }; }), value:S.sx, onChange:function(v){ S.sx = v; userChange(); } });
  function nFmt(v){ return m("@n{n} = " + qs(Q(Math.round(v * 2), 2))); }
  var slN = stepSlider($("#pl-sn", host), { id:"n", name:"n", color:"--pen", label:"Copies " + m("@n{n}"), n:SN.length, idx:SN.indexOf(qv(S.sn)) < 0 ? 0 : SN.indexOf(qv(S.sn)), fmt:function(i){ return nFmt(SN[i]); }, onChange:function(i){ S.sn = Q(SN[i] * 2, 2); S.sex = false; userChange(); } });
  var rMB = radios($("#pl-mb", host), { label:"Base " + m("@b{b}") + ":", aria:"Base b", cls:"chips pl-b", options:MBASES.map(function(k){ return { id:k, t:chipT(k) }; }), value:S.mb, onChange:function(v){ S.mb = v; userChange(); } });
  var rMU = radios($("#pl-mu", host), { label:"Ruler units:", aria:"Ruler units", options:[{ id:"10", t:"base 10" }, { id:"2", t:"base 2" }, { id:"3", t:"base 3" }], value:S.mu, onChange:function(v){ S.mu = v; userChange(); } });
  var rGL = radios($("#pl-gl", host), { label:"Law:", aria:"Law", cls:"chips", options:[{ id:"power", t:"Power law" }, { id:"cob", t:"Change of base" }], value:S.gl, onChange:function(v){ S.gl = v; userChange(); } });
  var slG = stepSlider($("#pl-gn", host), { id:"gn", name:"n", color:"--pen", label:m("@n{n}"), n:GN.length, idx:Math.max(0, GN.indexOf(S.gn)), fmt:function(i){ return nFmt(GN[i]); }, onChange:function(i){ S.gn = GN[i]; userChange(); } });
  var rGB = radios($("#pl-gb", host), { label:"Base " + m("@b{b}") + ":", aria:"Base b", cls:"chips pl-b", options:[2, 3, 10].map(function(v){ return { id:v, t:m(String(v)) }; }), value:S.gb, onChange:function(v){ S.gb = +v; userChange(); } });
  var rGC = radios($("#pl-gcb", host), { label:"Base " + m("@b{b}") + ":", aria:"Base b", cls:"chips pl-b", options:["1/10", "1/2", "2", "3", "5", "10", "100"].map(function(k){ return { id:k, t:chipT(k) }; }), value:S.gcb, onChange:function(v){ S.gcb = v; userChange(); } });
  var rGZ = radios($("#pl-gz", host), { label:"Window:", aria:"y window", options:[{ id:6, t:m("-6 ≤ y ≤ 6") }, { id:12, t:m("-12 ≤ y ≤ 12") }], value:S.gz, onChange:function(v){ S.gz = +v; userChange(); } });
  // exact n box
  var sign = 1, pIn = $("#pl-p", host), qIn = $("#pl-q", host), apBtn = $("#pl-apply", host), exMsg = $("#pl-exmsg", host), sgBtn = $("#pl-sign", host);
  function exVal(){
    var p = pIn.value.trim(), q = qIn.value.trim();
    if (!/^\d+$/.test(p) || !/^\d+$/.test(q)) return { bad:true };
    var pn = +p, qn = +q; if (pn > 24 || qn < 1 || qn > 6) return { bad:true, msg:"Use a whole number from 0 to 24 on top and from 1 to 6 underneath." };
    var v = sign * pn / qn; if (v < -3 || v > 4) return { bad:true, msg:"Choose " + m("@n{n}") + " from −3 to 4." };
    return { n:Q(sign * pn, qn) };
  }
  function exPaint(){ var r = exVal(); apBtn.disabled = !!r.bad || O.busy; exMsg.innerHTML = r.msg || ""; sgBtn.textContent = sign < 0 ? MINUS : "+"; sgBtn.setAttribute("aria-label", "Sign: " + (sign < 0 ? "negative" : "positive") + ". Press to change it."); }
  sgBtn.addEventListener("click", function(){ if (O.busy) return; sign = -sign; exPaint(); });
  pIn.addEventListener("input", exPaint); qIn.addEventListener("input", exPaint);
  [pIn, qIn].forEach(function(el){ el.addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); if (!apBtn.disabled) apBtn.click(); } }); });
  apBtn.addEventListener("click", function(){ var r = exVal(); if (r.bad || O.busy) return; S.sn = r.n; S.sex = true; userChange(); });
  // measure number box
  var mxIn = $("#pl-mx", host), mxMsg = $("#pl-mxmsg", host);
  function setMx(){
    var raw = mxIn.value.trim().replace(/−/g, "-").replace(/\s+/g, ""), k = /^\d+$/.test(raw) ? String(+raw) : /^1\/\d+$/.test(raw) ? "1/" + (+raw.slice(2)) : raw;
    if (MLIST.indexOf(k) < 0) { mxMsg.innerHTML = "Choose a whole number from 1 to 100, one of 125, 128, 243, 256, 512, 625, 729 and 1000, or one of the fractions 1/2 to 1/10, 1/16, 1/27, 1/32, 1/64, 1/81 and 1/100."; return; }
    mxMsg.innerHTML = ""; if (O.busy) return; S.mx = k; userChange();
  }
  $("#pl-mxgo", host).addEventListener("click", setMx);
  mxIn.addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); setMx(); } });
  $("#pl-msw", host).addEventListener("click", function(){ if (O.busy) return; S.msw = !S.msw; userChange(); });
  // challenge note
  host.addEventListener("click", function(e){ if (e.target.closest("#pl-free")) { S.ch = null; userChange(); var r = $("#pl-mode [aria-checked=true]", host); if (r) r.focus(); } });

  // ----- geometry, windows -----
  function stackGeo(){ var x = N(S.sx), L = Math.log(x.v), nv = O.nA != null ? O.nA : qv(S.sn), ends = [0, L, nv * L], c = Math.ceil(Math.abs(nv) - 1e-9);
    ends.push((nv < 0 ? -1 : 1) * c * L); if (O.slide) ends.push((O.slide.k + 1) * L); if (O.g45) ends.push(Math.log(4.5));
    return { ends:ends, minW:2 * Math.log(S.sb) }; }
  function measGeo(){ var b = N(S.mb), x = N(S.mx), Lb = Math.log(b.v), Lx = Math.log(x.v), ends = [0, Lb, Lx];
    var c = Lx / Lb, n1 = Math.ceil(Math.abs(c) - 1e-9); ends.push(Math.sign(Lx || 1) * n1 * Math.abs(Lb));
    if (S.msw && Math.abs(Lx) > 1e-12) { var n2 = Math.ceil(Math.abs(Lb / Lx) - 1e-9); ends.push(Math.sign(Lb) * n2 * Math.abs(Lx)); }
    return { ends:ends, minW:2 * Math.LN2 }; }
  function target(){
    var g = S.mode === "stack" ? stackGeo() : measGeo(), lo = Math.min.apply(null, g.ends), hi = Math.max.apply(null, g.ends), w = hi - lo;
    lo -= w * 0.15; hi += w * 0.15;
    if (hi - lo < g.minW) { var c = (lo + hi) / 2; lo = c - g.minW / 2; hi = c + g.minW / 2; }
    return { lo:lo, hi:hi };
  }
  function fit(now){
    if (S.mode === "graph") { plot.render(); return; }
    var t = target();
    if (O.winC) { O.winC(); O.winC = null; }
    if (now || RM || !O.win || (Math.abs(t.lo - O.win.lo) < 1e-9 && Math.abs(t.hi - O.win.hi) < 1e-9)) { O.win = t; plot.render(); return; }
    var a = { lo:O.win.lo, hi:O.win.hi };
    O.winC = MV.tween({ dur:400, step:function(s){ O.win = { lo:lerp(a.lo, t.lo, s), hi:lerp(a.hi, t.hi, s) }; plot.render(); }, done:function(){ O.winC = null; } });
  }

  // ----- drawing -----
  function geo(){ var H = plot.H, me = S.mode === "measure", y = me ? Math.max(58, H * 0.22) : Math.max(66, H * 0.27); return { y:y, lane:y + (me ? 63 : 52), lh:me ? Math.max(28, H * 0.075) : Math.max(28, H * 0.09) }; }
  function drawStack(ctx, p){
    var b = S.sb, x = N(S.sx), L = Math.log(x.v), nv = O.nA != null ? O.nA : qv(S.sn), G = geo(), X = function(u){ return p.X(u); };
    var exactN = O.nA == null && !O.slide, pi = exactN ? powInfo(x, S.sn) : { txt:"≈ " + sig4(Math.pow(x.v, nv)) };
    var endU = O.slide ? (O.slide.k + O.slide.t) * L : nv * L;
    var specials = [{ u:0, t:"1" }, { u:L, t:x.k }];
    if (Math.abs(endU) > 1e-9 && Math.abs(endU - L) > 1e-9) specials.push({ u:endU, t:O.slide ? "" : pi.txt });
    rulerBase(ctx, p, { y:G.y, tickLn:Math.log(b), tickBase:b, unitLn:Math.log(b), specials:specials.filter(function(s){ return s.t; }) });
    var ly = G.lane, lh = G.lh, w1 = Math.abs(X(L) - X(0)), ink = css("--ink"), lab = function(s, u){ if (w1 >= 36) cmath(ctx, s, X(u), ly + lh + 13, { size:13, align:"center", color:ink }); };
    var xs = x.k, xp = x.frac ? "(" + xs + ")" : xs, fq = Q(Math.abs(S.sn[0]) % S.sn[1], S.sn[1]);
    var part = function(){ return qeq(fq, [1, 2]) ? "√" + xp : qeq(fq, [1, 3]) ? "∛" + xp : xp + "^{" + qs(fq) + "}"; };
    if (nv >= 0) {
      var cnt = Math.ceil(nv - 1e-9);
      for (var k = 0; k < cnt; k++) { var f = Math.min(1, nv - k); block(ctx, X(k * L), X((k + 1) * L), ly, lh, { fill:f }); if (k > 0) lab("×" + xs, k * L); if (f < 1 && exactN && f > 0) lab("×" + part(), (k + f / 2) * L); }
      if (O.slide) { block(ctx, X((O.slide.k - 1 + O.slide.t) * L), X((O.slide.k + O.slide.t) * L), ly, lh, {}); if (O.slide.t >= 1) lab("×" + xs, O.slide.k * L); }
      if (nv >= 1 && w1 > 0) { var bl = (b === 10 ? "log" : "log_{" + b + "}") + (x.frac ? "(" + xs + ")" : " " + xs); if (cmath(ctx, bl, 0, 0, { size:13, dry:true }) + 10 < w1) cmath(ctx, bl, (X(0) + X(L)) / 2, ly + lh / 2, { size:13, align:"center" }); }
    } else {
      block(ctx, X(0), X(L), ly, lh, { alpha:0.35 });
      if (w1 > 70) cmath(ctx, (b === 10 ? "log" : "log_{" + b + "}") + (x.frac ? "(" + xs + ")" : " " + xs), (X(0) + X(L)) / 2, ly + lh / 2, { size:13, align:"center", alpha:0.6 });
      var c2 = Math.ceil(-nv - 1e-9);
      for (var j = 0; j < c2; j++) { var f2 = Math.min(1, -nv - j); block(ctx, X(-j * L), X(-(j + 1) * L), ly, lh, { fill:f2, arrow:true }); if (j > 0) lab("÷" + xs, -j * L); if (f2 < 1 && exactN && f2 > 0) lab("÷" + part(), -(j + f2 / 2) * L); }
    }
    // stack end pointer
    var ex = X(endU); seg(ctx, ex, G.y + 11, ex, ly + lh + 2, css("--ink-2"), 1.2, [3, 3]);
    ctx.save(); ctx.beginPath(); ctx.arc(ex, G.y, 9.5, 0, 6.3); ctx.fillStyle = css("--hi"); ctx.fill(); ctx.beginPath(); ctx.arc(ex, G.y, 5, 0, 6.3); ctx.fillStyle = css("--ink"); ctx.fill(); ctx.restore();
    if (O.g45) { var gx = X(Math.log(4.5)); seg(ctx, gx, G.y - 11, gx, ly + lh + 30, css("--ink-2"), 1.5, [4, 4]); uiText(ctx, "4.5 is here, not halfway", clamp(gx, 80, p.W - 80), ly + lh + 40, { alpha:O.g45, weight:700 }); }
  }
  function lenTxt(k, uk){ var q = logQ(N(uk), N(k)); return q ? qs(q) : "≈ " + num(Math.log(N(k).v) / Math.log(+uk), 3); }
  function sticks(ctx, p, Lt, Ls, y, h, col, fillA, labelTxt){
    // lay sticks of signed length Ls along the length 0 → Lt; returns nothing
    if (Math.abs(Lt) < 1e-12) return;
    var c = Lt / Ls, n = Math.ceil(Math.abs(c) - 1e-9), dir = Math.sign(Lt), s = Math.abs(Ls), X = function(u){ return p.X(u); };
    var wpx = Math.abs(X(s) - X(0)), every = wpx >= 18 ? 1 : wpx >= 9 ? 2 : wpx >= 4 ? 5 : 10;
    for (var k = 0; k < n; k++) {
      var a = dir * k * s, b2 = dir * (k + 1) * s, cut = Math.abs(b2) > Math.abs(Lt) + 1e-9;
      var fromA = Math.sign(Ls) === dir ? a : b2, toB = Math.sign(Ls) === dir ? b2 : a;
      block(ctx, X(fromA), X(toB), y, h, { fillCol:col, fillAlpha:fillA, line:col, arrow:true });
      if (cut) hatch(ctx, X(Lt), y, X(b2) - X(Lt), h, css("--ink-2"));
      if ((k + 1) % every === 0 || k === 0) uiText(ctx, String(k + 1), (X(a) + X(b2)) / 2, y - 7, { color:col, weight:700, size:11 });
    }
    if (labelTxt && wpx > 40) uiText(ctx, labelTxt, (X(0) + X(dir * s)) / 2, y + h / 2, { color:css("--ink"), weight:700 });
    if (c < 0) {
      var e0 = X(0), e1 = X(dir * n * s), mid = (e0 + e1) / 2, by = y - 21;
      seg(ctx, e0, by + 4, e0, by, col, 1.5); seg(ctx, e1, by + 4, e1, by, col, 1.5); seg(ctx, e0, by, e1, by, col, 1.5);
      ctx.save(); ctx.fillStyle = css("--sheet"); ctx.fillRect(mid - 11, by - 8, 22, 16); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.strokeRect(mid - 11, by - 8, 22, 16); ctx.restore();
      uiText(ctx, MINUS, mid, by, { color:col, weight:700, size:17 });
    }
  }
  // dimension line from 1 to L with its label beside the far end (or before the start when there's no room)
  function dimLine(ctx, p, L, y, col, txts){
    var a = p.X(0), b2 = p.X(L), d = L < 0 ? -1 : 1; seg(ctx, a, y, b2, y, col, 2); seg(ctx, a, y - 5, a, y + 5, col, 2); seg(ctx, b2, y - 5, b2, y + 5, col, 2);
    var w = Math.max.apply(null, txts.map(function(t){ return uiText(ctx, t.t, -999, -999, { weight:700 }); })), x0, al;
    if (d > 0) { if (b2 + 6 + w < p.W - 2) { x0 = b2 + 6; al = "left"; } else if (a - 6 - w > 2) { x0 = a - 6; al = "right"; } else { x0 = (a + b2) / 2; al = "center"; } }
    else { if (b2 - 6 - w > 2) { x0 = b2 - 6; al = "right"; } else if (a + 6 + w < p.W - 2) { x0 = a + 6; al = "left"; } else { x0 = (a + b2) / 2; al = "center"; } }
    txts.forEach(function(t){
      if (al === "center") { ctx.save(); ctx.globalAlpha = 0.85 * (t.a == null ? 1 : t.a); ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - w / 2 - 3, y - 8, w + 6, 16); ctx.restore(); }
      uiText(ctx, t.t, x0, y, { color:col, weight:700, align:al, alpha:t.a });
    });
  }
  function drawMeasure(ctx, p){
    var b = N(S.mb), x = N(S.mx), Lb = Math.log(b.v), Lx = Math.log(x.v), G = geo(), U = Math.log(+S.mu), pen = css("--pen"), pb = css("--p-b");
    var fade = O.fade ? { from:Math.log(+O.fade.from), to:Math.log(+O.fade.to), t:O.fade.t } : null;
    rulerBase(ctx, p, { y:G.y, tickLn:U, tickBase:+S.mu, unitLn:U, fade:fade, specials:[{ u:0, t:"1" }, { u:Lb, t:b.k, color:pb }, { u:Lx, t:x.k, color:pen }].filter(function(s, i, a){ return i === 0 || Math.abs(s.u) > 1e-9; }) });
    // the x-length on the ruler
    seg(ctx, p.X(0), G.y, p.X(Lx), G.y, pen, 4);
    var ly = G.lane, lh = G.lh;
    var lt = function(k){ if (!fade) return lenTxt(k, S.mu); return null; };
    sticks(ctx, p, Lx, Lb, ly, lh, pb, 0.2, lt(b.k));
    if (fade) { var sx = (p.X(0) + p.X(Math.sign(Lx || 1) * Math.abs(Lb))) / 2; uiText(ctx, lenTxt(b.k, O.fade.from), sx, ly + lh / 2, { color:css("--ink"), weight:700, alpha:1 - fade.t }); uiText(ctx, lenTxt(b.k, O.fade.to), sx, ly + lh / 2, { color:css("--ink"), weight:700, alpha:fade.t }); }
    var dy = ly + lh + 9, lt2 = function(k){ return fade ? [{ t:"length " + lenTxt(k, O.fade.from), a:1 - fade.t }, { t:"length " + lenTxt(k, O.fade.to), a:fade.t }] : [{ t:"length " + lenTxt(k, S.mu) }]; };
    if (Math.abs(Lx) > 1e-12) dimLine(ctx, p, Lx, dy, pen, lt2(x.k));
    if (S.msw) {
      var y2 = dy + 38;
      if (Math.abs(Lx) < 1e-12) uiText(ctx, "1 can’t be a base: no swapped count", p.W / 2, y2 + lh / 2, { weight:700 });
      else { sticks(ctx, p, Lb, Lx, y2, lh, pen, 0.15, fade ? null : lenTxt(x.k, S.mu)); dimLine(ctx, p, Lb, y2 + lh + 9, pb, lt2(b.k)); }
    }
    // the draggable pointer at x
    var px = p.X(Lx); ctx.save(); ctx.beginPath(); ctx.arc(px, G.y, 8, 0, 6.3); ctx.fillStyle = pen; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--sheet"); ctx.stroke(); ctx.restore();
  }
  function fPow(n, b){ return function(x){ return Math.log(Math.pow(x, n)) / Math.log(b); }; }
  function drawGraph(p){
    var z = S.gz, view = { xmin:-10, xmax:10, ymin:-z, ymax:z }, pen = css("--pen"), f3 = css("--f3"), ink2 = css("--ink-2");
    if (S.gl === "power") {
      var n = S.gn, b = S.gb, even = n % 2 === 0, f1 = fPow(n, b), f2 = function(x){ return n * Math.log(x) / Math.log(b); };
      var curves = [];
      if (!O.hideBlue) {
        if (even && O.leftT > 0) curves.push({ f:f1, domain:[-(0.05 + 9.95 * O.leftT) - (O.leftT >= 1 ? 1 : 0), -0.0001], color:css("--hi-soft"), width:14 });
        curves.push({ f:f1, domain:[0.0001, O.blueT >= 1 ? 11 : 0.05 + 9.95 * O.blueT], color:pen, width:3 });
        if (even && O.leftT > 0) curves.push({ f:f1, domain:[O.leftT >= 1 ? -11 : -(0.05 + 9.95 * O.leftT), -0.0001], color:pen, width:3 });
      }
      curves.push({ f:f2, color:f3, width:3, dash:[10, 6] });
      if (O.flash) curves.push({ f:function(x){ var l = Math.log10(x); return l * l; }, color:ink2, width:2.4, dash:[6, 6] });
      var pts = [{ x:b, y:n, r:4.5, color:css("--ink") }]; if (even && !O.hideBlue && O.leftT >= 1) pts.push({ x:-b, y:n, r:4.5, color:css("--ink") });
      p.draw({ view:view, asymptotes:[{ x:0, label:"x = 0" }], curves:curves, points:pts, describe:gDescribe(), after:function(ctx){
        if (even && !O.hideBlue && O.leftT >= 1) { var lx = -5, ly = f1(lx); cmath(ctx, O.p4 ? "only log(x^{2}) here: log((-10)^{2}) = log 100 = 2" : "only " + lb(b, true) + "(x^{" + qs(Q(n * 2, 2)) + "}) here", p.X(-9.6), clamp(p.Y(ly) + (ly > 0 ? 22 : -22), 16, p.H - 16), { size:13, bg:true }); }
        if (O.flash) cmath(ctx, "(log x)^{2}: a different function", p.X(9.6), p.Y(Math.min(z * 0.8, 3.6)), { size:13, align:"right", color:ink2, bg:true });
      } });
    } else {
      var bk = S.gcb, bv = N(bk).v, lbv = Math.log10(bv), fb = function(x){ return Math.log10(x) / lbv; };
      var segs = [], pts2 = [{ x:10, y:1, r:4, color:ink2 }, { x:10, y:1 / lbv, r:4.5, color:css("--ink") }];
      if (bv <= 10) pts2.push({ x:bv, y:lbv, r:4, color:ink2 }, { x:bv, y:1, r:4.5, color:css("--ink") });
      p.draw({ view:view, asymptotes:[{ x:0, label:"x = 0" }], curves:[{ f:function(x){ return Math.log10(x); }, color:ink2, width:2, dash:[6, 6], alpha:0.6 }, { f:fb, color:pen, width:3 }], segments:segs, points:pts2, describe:gDescribe(), after:function(ctx){
        if (Math.abs(lbv - 1) > 1e-9) [[10, 1], [0.1, -1]].forEach(function(q, i){
          var y2 = q[1] / lbv; if (Math.abs(y2) > z) y2 = Math.sign(y2) * z;
          var ax = i ? q[0] : p.xOf(p.X(q[0]) - 6); p.segment({ x1:ax, y1:q[1], x2:ax, y2:y2, color:css("--ink"), width:2, arrow:true });
          cmath(ctx, "× 1/log" + arg(bk), i ? p.X(q[0]) + 8 : p.X(q[0]) - 8, p.Y((q[1] + y2) / 2), { size:13, align:i ? "left" : "right", bg:true });
        });
      } });
    }
  }
  plot.render = function(){
    if (S.mode === "graph") { drawGraph(plot); return; }
    var w = O.win || target();
    plot.draw({ grid:false, axes:false, view:{ xmin:w.lo, xmax:w.hi, ymin:0, ymax:1 }, describe:describe(), after:function(ctx, p){ if (S.mode === "stack") drawStack(ctx, p); else drawMeasure(ctx, p); } });
  };
  var drag = MV.drag(plot, {
    axis:"x",
    handles:function(){ if (S.mode !== "measure" || !plot.H) return []; var G = geo(); return [{ id:"x", x:Math.log(N(S.mx).v), y:1 - G.y / plot.H, label:"Number x on the ruler: " + MV.plain(S.mx) + ". Arrow keys move to the next number." }]; },
    snap:function(x, y){ return [MLN[nearestM(x)], y]; },
    move:function(id, x){ if (O.busy) return; var k = MLIST[nearestM(x)]; if (k !== S.mx) { S.mx = k; O.dragging = true; userChange(); } },
    end:function(){ O.dragging = false; fit(); },
    key:function(id, e){
      if (O.busy) return true;
      var i = MLIST.indexOf(S.mx), d = 0;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") d = e.shiftKey ? 10 : 1; else if (e.key === "ArrowLeft" || e.key === "ArrowDown") d = e.shiftKey ? -10 : -1;
      else if (e.key === "Home") { S.mx = MLIST[0]; userChange(); return true; } else if (e.key === "End") { S.mx = MLIST[MLIST.length - 1]; userChange(); return true; } else return false;
      S.mx = MLIST[clamp(i + d, 0, MLIST.length - 1)]; userChange(); return true;
    }
  });

  // ----- captions, readouts, descriptions -----
  function stackRows(){
    var b = S.sb, x = N(S.sx), n = S.sn, Lq = logQ(N(b), x), Lv = Math.log(x.v) / Math.log(b), pi = powInfo(x, n), lg = lb(b), nL = Lq ? qmul(n, Lq) : null;
    var rows = [];
    rows.push(["Block", Lq ? m(lg + arg(x.k) + " = " + qs(Lq)) + ", because " + m("@b{" + b + "}^{" + qs(Lq) + "} = " + x.k) : m(lg + arg(x.k) + " ≈ " + num(Lv, 3)) + " (" + m(x.k) + " isn’t a power of " + m("@b{" + b + "}") + ", even a fractional one)"]);
    rows.push(["Copies", m("@n{n} = " + qs(n)) + (S.sex ? " (exact)" : "")]);
    rows.push(["Stack length", Lq ? m(nmul(n) + " × " + qw(Lq) + " = " + qs(nL)) : m(nmul(n) + " × " + (Lv < 0 ? "(" + num(Lv, 3) + ")" : num(Lv, 3)) + " ≈ " + num(qv(n) * Lv, 3))]);
    rows.push(["Lands on", m(xb(x) + "^{" + nsrc(n) + "} = " + pi.src).replace("= ≈", "≈")]);
    var leftArg = pi.exact ? pi.arg : pi.rad ? pi.arg : xb(x) + "^{" + qs(n) + "}", leftQ = logQ(N(b), scaled(x, n)), right = Lq ? qmul(n, Lq) : null;
    var lv = Math.log(Math.pow(x.v, qv(n))) / Math.log(b), rv = qv(n) * Lv;
    rows.push(["Power law check", m(lg + arg(leftArg) + (leftQ ? " = " + qs(leftQ) : " ≈ " + num(lv, 3))) + " and " + m(nmul(n) + " " + lg + arg(x.k) + (right ? " = " + qs(right) : " ≈ " + num(rv, 3))) + ": the two sides agree"]);
    var V = pi.exact ? pi.arg : pi.rad ? pi.arg : pi.txt.replace("≈ ", "");
    rows.push(["Direction", n[0] === 0 ? "No blocks: " + m(xb(x) + "^0 = 1") + ", and " + m(lg + " 1 = 0") + "." : pi.v > 1 ? "Right of 1: " + m(V + " > 1") + ", so its log is positive." : "Left of 1: " + m(V) + " is between 0 and 1, so its log is negative."]);
    var av = Math.abs(qv(n)), w = Math.floor(av + 1e-9), f = av - w, fq = Q(Math.round(f * n[1]), n[1]), each = "";
    var rootOf = function(){ return fq[0] === 1 && fq[1] === 2 ? "√" + (x.frac ? "(" + x.k + ")" : x.k) : fq[0] === 1 && fq[1] === 3 ? "∛" + (x.frac ? "(" + x.k + ")" : x.k) : xb(x) + "^{" + qs(fq) + "}"; };
    var partName = fq[0] === 1 && fq[1] === 2 ? "Half a" : "A " + qs(fq);
    if (n[0] === 0) each = "No blocks.";
    else if (n[0] > 0) each = (w ? "multiplies by " + m(x.k) + "." : "") + (f > 1e-9 ? (w ? " " : "") + partName + " block multiplies by " + m(rootOf()) + "." : "");
    else each = (w ? "Each backward block divides by " + m(x.k) + "." : "") + (f > 1e-9 ? (w ? " " : "") + partName + " backward block divides by " + m(rootOf()) + "." : "");
    rows.push(["Each block", each]);
    return rows;
  }
  function stackCap(){
    var b = S.sb, x = N(S.sx), n = S.sn, Lq = logQ(N(b), x), Lv = Math.log(x.v) / Math.log(b), lg = lb(b);
    var s = lg + "(" + xb(x) + "^{" + nsrc(n) + "}) = " + nmul(n) + " " + lg + arg(x.k);
    s += Lq ? " = " + nmul(n) + " × " + qw(Lq) + " = " + qs(qmul(n, Lq)) : " ≈ " + num(qv(n) * Lv, 3);
    return m(s);
  }
  function stickName(k, col){ return m(col ? "@b{" + k + "}" : k) + "-stick"; }
  function cnt(){ var b = N(S.mb), x = N(S.mx); return { q:logQ(b, x), v:Math.log(x.v) / Math.log(b.v) }; }
  function lenParts(uk){ var b = N(S.mb), x = N(S.mx), qx = logQ(N(uk), x), qb = logQ(N(uk), b); return { qx:qx, qb:qb, lx:Math.log(x.v) / Math.log(+uk), lbv:Math.log(b.v) / Math.log(+uk) }; }
  function divTxt(P, c){
    var a = P.qx ? qs(P.qx) : num(P.lx, 3), d = P.qb ? qw(P.qb) : P.lbv < 0 ? "(" + num(P.lbv, 3) + ")" : num(P.lbv, 3);
    var exactL = P.qx && P.qb, s = (exactL ? "" : "≈ ") + a + " ÷ " + d;
    if (c.q) return s + " = " + qs(c.q) + (c.q[1] !== 1 ? " ≈ " + num(qv(c.q), 3) : "");
    return s + " ≈ " + num(c.v, 3);
  }
  function measRows(){
    var b = N(S.mb), x = N(S.mx), c = cnt(), P = lenParts(S.mu), lu = lb(S.mu, true), rows = [], lbb = lb(b.k);
    rows.push(["Question", m(lbb + arg(x.k)) + ": how many " + stickName(b.k, true) + "s fit into the length from 1 to " + m(x.k) + "?"]);
    rows.push(["Length to " + m("x"), (P.qx ? qs(P.qx) : "≈ " + num(P.lx, 3)) + " (that’s " + m(lu + arg(x.k)) + ")"]);
    rows.push(["One " + m("@b{b}") + "-stick", (P.qb ? qs(P.qb) : "≈ " + num(P.lbv, 3)) + " (that’s " + m(lu + arg(b.k)) + ")"]);
    rows.push(["Count", m(divTxt(P, c))]);
    rows.push(["Change of base", m(lbb + arg(x.k) + " = log" + arg(x.k) + " / log" + arg(b.k) + (S.mu !== "10" ? " = " + lu + arg(x.k) + " / " + lu + arg(b.k) : ""))]);
    rows.push(["Any ruler", ["10", "2", "3"].map(function(u){ var Q2 = lenParts(u); return "base " + u + ": " + m((Q2.qx ? qs(Q2.qx) : num(Q2.lx, 3)) + " ÷ " + (Q2.qb ? qw(Q2.qb) : Q2.lbv < 0 ? "(" + num(Q2.lbv, 3) + ")" : num(Q2.lbv, 3))); }).join(" · ") + ". Same count."]);
    if (S.msw) {
      if (x.v === 1) rows.push(["Swapped", "1 can’t be a base, so " + m("log_1" + arg(b.k)) + " doesn’t exist."]);
      else { var q2 = logQ(x, b); rows.push(["Swapped", m("log_{" + x.k + "}" + arg(b.k) + (q2 ? " = " + qs(q2) + " = 1 ÷ " + qw(c.q) : " ≈ " + num(1 / c.v, 3) + " ≈ 1 ÷ " + num(c.v, 3)))]); }
    }
    if (c.v < 0) {
      if (b.v < 1) rows.push(["Direction", "The " + stickName(b.k, true) + "s point left, because " + m(b.k) + " is less than 1. Counting left-pointing sticks along a right-pointing length gives a negative count."]);
      else rows.push(["Direction", "The length to " + m(x.k) + " points left, because " + m(x.k) + " is less than 1. Counting right-pointing " + stickName(b.k, true) + "s along a left-pointing length gives a negative count."]);
    }
    return rows;
  }
  function measCap(){
    var b = N(S.mb), x = N(S.mx), c = cnt(), P = lenParts(S.mu);
    return m(lb(b.k) + arg(x.k)) + " = (length to " + m(x.k) + ") ÷ (length of one " + stickName(b.k, true) + ") = " + m(divTxt(P, c).replace(/ ≈ [\d.−]+$/, function(s){ return c.q ? "" : s; }));
  }
  function gRows(){
    var rows = [];
    if (S.gl === "power") {
      var n = S.gn, b = S.gb, nq = Q(n * 2, 2), lg = lb(b), even = n % 2 === 0, L1 = lg + "(x^{" + nsrc(nq) + "})", L2 = nmul(nq) + " " + lg + " x";
      rows.push(["Curves", "Blue: " + m("y = " + L1) + ". Teal, dashed: " + m("y = " + L2) + "."]);
      rows.push(["Domains", m(L1) + ": " + m(even ? "{x ∈ ℝ | x ≠ 0}" : "{x ∈ ℝ | x > 0}") + ". " + m(L2) + ": " + m("{x ∈ ℝ | x > 0}") + "."]);
      rows.push(["Where they agree", "At every " + m("x > 0")]);
      var bn = powInfo(N(b), nq);
      rows.push(["Where they differ", even ? "For " + m("x < 0") + ", only " + m(L1) + " exists: " + m(lg + "((-" + b + ")^{" + nsrc(nq) + "}) = " + lg + arg(bn.arg) + " = " + qs(nq)) + ", but " + m(nmul(nq) + " " + lg + "(-" + b + ")") + " is undefined." : "Nowhere: same domain, same values."]);
      var an = Math.abs(n), base = b === 10 ? m("y = log x") : m("y = " + lg + " x"), kind;
      if (n === 1) kind = "the same curve"; else if (n === -1) kind = "a reflection in the " + m("x") + "-axis only";
      else kind = (an > 1 ? "a vertical stretch by a factor of " + num(an) : "a vertical compression by a factor of 1/2") + (n < 0 ? " and a reflection in the " + m("x") + "-axis" : "");
      rows.push(["Compared with " + base, "Every height × " + m(n < 0 || nq[1] !== 1 ? "(" + nsrc(nq) + ")" : nsrc(nq)) + ": " + kind + " (for " + m("x > 0") + ")"]);
      rows.push(["Sample points", "At " + m("x = " + b) + ": " + m(lg + "(" + b + "^{" + nsrc(nq) + "}) = " + qs(nq)) + " and " + m(nmul(nq) + " " + lg + " " + b + " = " + qs(nq)) + (even ? ". At " + m("x = -" + b) + ": " + m(lg + "((-" + b + ")^{" + nsrc(nq) + "}) = " + qs(nq)) + ", but " + m(nmul(nq) + " " + lg + "(-" + b + ")") + " is undefined." : "")]);
    } else {
      var bk = S.gcb, bv = N(bk).v, lbv = Math.log10(bv), F = 1 / lbv, lgb = lb(bk), ex = { "10":"1", "100":"1/2", "1/10":"−1" }[bk];
      var Fs = ex ? ex : num(F, 3), about = ex ? Fs : "about " + num(F, 3);
      rows.push(["Curves", "Blue: " + m("y = " + lgb + " x") + ". Dashed: " + m("y = log x") + "."]);
      rows.push(["Stretch factor", m("1/log" + arg(bk) + (bk === "10" ? "" : " = " + lgb + " 10") + (ex ? " = " + ex : " ≈ " + Fs))]);
      var kind2 = bk === "10" ? "the same graph" : bk === "100" ? "a vertical compression by a factor of 1/2" : bk === "1/10" ? "a reflection in the " + m("x") + "-axis only" : bv < 1 ? "a vertical stretch by a factor of about " + num(Math.abs(F), 3) + " and a reflection in the " + m("x") + "-axis" : "a vertical stretch";
      rows.push(["Meaning", m(lgb + " x = log x / log" + arg(bk)) + ": every height of " + m("y = log x") + " is multiplied by " + (ex ? m(ex) : about.replace(/−/, MINUS)) + ". That’s " + kind2 + "."]);
      var at2 = bv > 10 ? " (off the graph)" : "";
      rows.push(["Sample points", "At " + m("x = 10") + ": " + m("log 10 = 1") + " and " + m(lgb + " 10" + (ex ? " = " + ex : " ≈ " + num(F, 3))) + (bk === "10" ? "" : ". At " + m("x = " + bk) + ": " + m("log" + arg(bk) + (bk === "10" || bk === "100" || bk === "1/10" ? " = " + qs(logQ(N(10), N(bk))) : " ≈ " + num(lbv, 3))) + " and " + m(lgb + arg(bk) + " = 1") + at2) + "."]);
    }
    return rows;
  }
  function gCap(){
    if (S.gl === "power") { var nq = Q(S.gn * 2, 2), lg = lb(S.gb); return m("y = " + lg + "(x^{" + nsrc(nq) + "})") + " and " + m("y = " + nmul(nq) + " " + lg + " x"); }
    return m("y = " + lb(S.gcb) + " x = log x / log" + arg(S.gcb));
  }
  function describe(){
    if (S.mode === "stack") { var x = N(S.sx), pi = powInfo(x, S.sn); return "Log ruler, base " + S.sb + ". A block of length log base " + S.sb + " of " + x.k + ", " + qs(S.sn) + " copies, ending at " + pi.txt.replace("≈ ", "about ") + "."; }
    var c = cnt(); return "Log ruler in base-" + S.mu + " units. Sticks of length log " + S.mb + " laid along the length from 1 to " + S.mx + ": the count is " + (c.q ? qs(c.q) : "about " + num(c.v, 3)) + "." + (S.msw ? " A second lane measures the other way." : "");
  }
  function gDescribe(){
    if (S.gl === "power") { var n = S.gn, even = n % 2 === 0; return "Graph of y = log base " + S.gb + " of x to the " + num(n) + (O.hideBlue ? " (not drawn yet)" : even ? ", two branches," : ", right branch only,") + " and y = " + num(n) + " log x, right branch only. They match for x > 0."; }
    return "Graph of y = log base " + S.gcb + " of x and the dashed parent y = log x; every height is multiplied by 1/log " + S.gcb + ".";
  }
  // ----- paint -----
  function chalNote(){
    var el = $("#pl-chal", host);
    if (!S.ch) { el.hidden = true; el.innerHTML = ""; return; }
    var t = { tc1:"Stack mode: the base 3 and the block 9 are locked.", tc2:"Stack mode: the base 2 and the block 8 are locked.", tc3:"Measure mode is on. Choose any base and number." }[S.ch];
    el.hidden = false; el.innerHTML = "<p><strong>Challenge " + S.ch.slice(2) + " is set up.</strong> " + t + '</p><button type="button" class="btn ghost sm" id="pl-free" data-k="plfree">Free play</button>';
  }
  function paint(now){
    var lockAll = O.busy, lockSX = lockAll || S.ch === "tc1" || S.ch === "tc2";
    rMode.set(S.mode); rMode.lock(lockAll || S.ch === "tc1" || S.ch === "tc2");
    $("#pl-cs", host).hidden = S.mode !== "stack"; $("#pl-cm", host).hidden = S.mode !== "measure"; $("#pl-cg", host).hidden = S.mode !== "graph";
    rSB.set(S.sb); rSB.lock(lockSX); rSX.set(S.sx); rSX.lock(lockSX);
    var nv = qv(S.sn), idx = clamp(Math.round((nv + 3) * 2), 0, SN.length - 1);
    slN.set(idx, S.sex ? m("@n{n} = " + qs(S.sn)) + " (exact)" : null); slN.lock(lockAll); exPaint(); sgBtn.disabled = lockAll; pIn.disabled = qIn.disabled = lockAll;
    rMB.set(S.mb); rMB.lock(lockAll); rMU.set(S.mu); rMU.lock(lockAll); $("#pl-msw", host).setAttribute("aria-pressed", S.msw); $("#pl-msw", host).disabled = lockAll; $("#pl-mxgo", host).disabled = lockAll;
    if (document.activeElement !== mxIn) mxIn.value = S.mx;
    rGL.set(S.gl); rGL.lock(lockAll); $("#pl-gp", host).hidden = S.gl !== "power"; $("#pl-gc", host).hidden = S.gl !== "cob";
    slG.set(Math.max(0, GN.indexOf(S.gn))); slG.lock(lockAll); rGB.set(S.gb); rGB.lock(lockAll); rGC.set(S.gcb); rGC.lock(lockAll); rGZ.set(S.gz); rGZ.lock(lockAll);
    $("#pl-cap", host).innerHTML = S.mode === "stack" ? stackCap() : S.mode === "measure" ? measCap() : gCap();
    $("#pl-read", host).innerHTML = MV.readoutHTML(S.mode === "stack" ? stackRows() : S.mode === "measure" ? measRows() : gRows());
    $("#pl-note", host).innerHTML = [O.rm, O.p3note].filter(Boolean).join(" ");
    chalNote();
    fit(now);
  }
  function clearFx(){ O.g45 = 0; O.p3note = ""; O.rm = ""; O.p4 = false; O.flash = false; O.hideBlue = false; O.blueT = 1; O.leftT = 1; O.nA = null; O.slide = null; O.fade = null; }
  function userChange(now){ if (O.busy) return; clearFx(); api.save(); paint(now); MV.changed(); }
  function cancelAll(){ O.cancel.forEach(function(c){ try { c(); } catch (e) {} }); O.cancel = []; }
  function tw(dur, step, done, ease){ O.cancel.push(MV.tween({ dur:dur, ease:ease, step:step, done:done })); }

  // ----- challenges: tapping a challenge card sets the stacker up for it -----
  function enterChal(id){
    if (O.busy || S.ch === id) return;
    var st = MV.S.chal && MV.S.chal[id]; if (st && st.solved) return;
    S.ch = id;
    if (id === "tc1") { S.mode = "stack"; S.sb = 3; S.sx = "9"; }
    if (id === "tc2") { S.mode = "stack"; S.sb = 2; S.sx = "8"; }
    if (id === "tc3") S.mode = "measure";
    clearFx(); api.save(); paint(true); MV.changed();
  }
  var chalBox = $("#chal");
  if (chalBox) chalBox.addEventListener("click", function(e){ var c = e.target.closest("[data-c]"); if (c) enterChal(c.dataset.c); }, true);
  var CH = {}; (C.challenges || []).forEach(function(c){ CH[c.id] = c; });
  function landTxt(x, n){ var pi = powInfo(x, n); return m(pi.exact ? pi.arg : pi.rad ? pi.arg + " ≈ " + num(pi.v, 3) : pi.txt); }
  function challenge(id){
    var c = CH[id], F = c.fb, n = S.sn;
    if (id === "tc1" || id === "tc2") {
      var want = id === "tc1" ? { b:3, x:"9", ok:[-2, 1] } : { b:2, x:"8", ok:[2, 3] };
      if (S.mode !== "stack" || S.sb !== want.b || S.sx !== want.x) return { ok:false, msg:c.general };
      if (qeq(n, want.ok)) return { ok:true };
      var key = qs(n), named = id === "tc1" ? { "2":F.n2, "−4":F.nm4, "−1/2":F.nmh, "−1":F.nm1 } : { "1/2":F.nh, "1/3":F.n13, "3/2":F.n32, "1":F.n1 };
      return { ok:false, msg:named[key] || sub(F.other, { v:landTxt(N(want.x), n) }) };
    }
    if (S.mode !== "measure") return { ok:false, msg:c.general };
    var b = N(S.mb), x = N(S.mx);
    if (x.v === 1) return { ok:false, msg:F.one };
    if (Math.abs(x.v - b.v) < 1e-12) return { ok:false, msg:F.same };
    var q = logQ(b, x);
    if (q && qeq(q, [-1, 1])) return { ok:true };
    var L1 = m("log_{" + b.k + "}" + arg(x.k)), L2 = m("log_{" + x.k + "}" + arg(b.k));
    if (q) return { ok:false, msg:sub(F.pair, { L1:L1, v1:m(qs(q)), L2:L2, v2:m(qs(qdiv([1, 1], q))) }) };
    var v = Math.log(x.v) / Math.log(b.v);
    return { ok:false, msg:sub(F.other, { v1:"≈ " + num(v, 3), v2:"≈ " + num(1 / v, 3) }) };
  }

  paint(true);
  return {
    predict:{
      start:function(p){
        cancelAll(); O.busy = false; clearFx(); S.ch = null;
        var s = p.start;
        if (s.mode === "stack") { S.mode = "stack"; S.sb = s.b; S.sx = s.x; S.sn = s.n.slice(); S.sex = false; }
        else if (s.mode === "measure") { S.mode = "measure"; S.mb = s.b; S.mx = s.x; S.mu = s.units; S.msw = s.swap; }
        else { S.mode = "graph"; S.gl = s.law; S.gb = s.b; S.gn = s.n; S.gz = 6; O.hideBlue = p.id === "p4"; }
        O.busy = true; api.save(); paint(true);
      },
      run:function(p, done){
        var fin = function(){ O.busy = false; if (RM) O.rm = p.rm || ""; api.save(); paint(); MV.changed(); done(); };
        if (p.id === "p1") {
          var slide = function(k, cb){ O.slide = { k:k, t:0 }; fit(); tw(600, function(t){ O.slide.t = t; plot.render(); }, function(){ O.slide = null; S.sn = [k + 1, 1]; paint(); cb(); }); };
          slide(1, function(){ MV.wait(250, function(){ slide(2, fin); }); });
        } else if (p.id === "p2") {
          tw(800, function(t){ O.nA = 1 - 0.5 * t; plot.render(); }, function(){ O.nA = null; S.sn = [1, 2]; O.g45 = RM ? 1 : 0.01; paint();
            tw(500, function(t){ O.g45 = Math.max(0.01, t); fit(); }, fin); });
        } else if (p.id === "p3") {
          O.fade = { from:"2", to:"10", t:0 };
          tw(800, function(t){ O.fade.t = t; plot.render(); }, function(){ O.fade = null; S.mu = "10"; O.p3note = "1.505 ÷ 0.903 ≈ 1.667, the same 5/3."; fin(); });
        } else if (p.id === "p4") {
          O.hideBlue = false; O.blueT = 0; O.leftT = 0; O.p4 = true;
          tw(1000, function(t){ O.blueT = t; plot.render(); }, function(){
            tw(1000, function(t){ O.leftT = t; plot.render(); }, function(){ O.flash = true; plot.render(); MV.wait(2000, function(){ O.flash = false; fin(); }); }, LIN);
          }, LIN);
        } else fin();
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: Base bridge ----------
// @component blockBars — two lanes (number, base) of equal c-blocks from a shared start line, with the measure animation
// (copies of the base bar laid along the number bar and counted)
function bridge(host, api){
  var C = api.content, R = C.rounds, S = def(api.S, { r:0, st:{}, why:{} }), msgs = {}, anim = { t:null };
  function st(id){ return S.st[id] || (S.st[id] = { tries:0, hint:0, solved:false, first:null, vals:[] }); }
  function nSolved(r){ var k = 0; while (k < r.steps.length && st(r.steps[k].id).solved) k++; return k; }
  host.innerHTML = '<div class="bb"><div class="bb-fig"><canvas class="plot" id="bb-cv" role="img" aria-label="Block bars"></canvas><p class="tiny muted bb-say" id="bb-say" aria-live="polite"></p></div>' +
    '<div class="bb-sheet"><div id="bb-rounds"></div><div id="bb-body"></div></div></div><details class="alg bb-why" id="bb-why"><summary>' + C.why.title + "</summary><div id=\"bb-whyb\"></div></details>";
  var plot = new MV.Plot($("#bb-cv", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  var rR = radios($("#bb-rounds", host), { label:"", aria:"Round", cls:"chips", options:R.map(function(r, i){ return { id:i, t:"Round " + (i + 1) }; }), value:S.r, onChange:function(v){ S.r = +v; anim.t = null; api.save(); paint(); } });
  function round(){ return R[S.r]; }
  // ----- canvas -----
  plot.render = function(){
    var r = round(), k = nSolved(r), ink = css("--ink"), ink2 = css("--ink-2"), pb = css("--p-b"), r3 = r.id === "r3";
    var p = r.p, q = r3 ? Math.log(5) / Math.LN2 : r.q;
    var showNum = r.id === "r2" ? k >= 2 : k >= 1, labels = r3 ? k >= 1 : k >= 2, done = k >= 3;
    plot.draw({ grid:false, axes:false, view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, describe:say(r, k), after:function(ctx, P){
      var W = P.W, H = P.H, lo = Math.min(0, q, p) - 0.25, hi = Math.max(0, q, p, r3 ? 3 : 0) + 0.25, u = (W - 30) / (hi - lo), X = function(e){ return 15 + (e - lo) * u; };
      var lh = Math.max(28, H * 0.12), yN = Math.max(48, H * 0.2), yB = yN + lh + Math.max(78, H * 0.3);
      if (showNum) seg(ctx, X(0), yN - 8, X(0), yB + lh + 8, ink, 2);
      var nl = q < 0 && showNum;
      cmath(ctx, "Number lane: " + r.num, nl ? X(0) - 8 : showNum ? X(0) + 8 : 12, yN - 22, { size:14, align:nl ? "right" : "left" }); cmath(ctx, "Base lane: " + r.base, showNum ? X(0) + 8 : 12, yB - 22, { size:14, color:pb });
      function lane(e, y, opt){
        var full = Math.floor(Math.abs(e) + 1e-9), part = Math.abs(e) - full, dir = e < 0 ? -1 : 1, n = Math.ceil(Math.abs(e) - 1e-9);
        for (var i = 0; i < n; i++) {
          var len = i < full ? 1 : part, g = opt.ghostFrom != null && i >= opt.ghostFrom;
          if (g) { block(ctx, X(dir * i), X(dir * (i + 1)), y, lh, { fill:opt.shade || 0 }); continue; }
          block(ctx, X(dir * i), X(dir * (i + len)), y, lh, { arrow:dir < 0 });
          var bw = Math.abs(X(dir * (i + len)) - X(dir * i));
          if (bw >= 36) uiText(ctx, "×" + r.c, (X(dir * i) + X(dir * (i + len))) / 2, y + lh / 2, { color:ink, weight:700 });
        }
      }
      if (showNum) {
        if (r3) { lane(3, yN, { ghostFrom:2, shade:done ? anim.shade == null ? q - 2 : anim.shade : 0 });
          var p5 = X(q); seg(ctx, p5, yN - 6, p5, yN + lh + 6, css("--pen"), 2.5); cmath(ctx, "5", p5, yN + lh + 16, { size:14, align:"center", color:css("--pen") });
          [[0, "1"], [1, "2"], [2, "4"], [3, "8"]].forEach(function(v){ cmath(ctx, v[1], v[0] ? X(v[0]) : X(0) + 6, yN - 8, { size:12, align:v[0] ? "center" : "left", color:ink2, weight:400 }); });
        } else lane(q, yN, {});
        lane(p, yB, {});
        if (labels && !r3) { uiText(ctx, num(q) .replace("-", MINUS) + (Math.abs(q) === 1 ? " block" : " blocks") + (q < 0 ? ", pointing left" : ""), X(q) + (q < 0 ? -6 : 6), yN + lh + 14, { align:q < 0 ? "left" : "right", weight:700, color:ink }); uiText(ctx, (p === 0.5 ? "1/2 block" : num(p) + " blocks"), X(p) + 6, yB + lh + 14, { align:"right", weight:700, color:ink }); }
        if (r3) uiText(ctx, "1 block", X(1), yB + lh + 14, { align:"right", weight:700, color:ink });
      } else uiText(ctx, r3 ? "Bracket 5 between powers of 2 to fill the lanes." : k >= 1 ? "Write each number as a power of 3 to fill the lanes." : "Choose a common base to fill the lanes.", W / 2, yN + lh / 2, { color:ink2 });
      // measure animation: copies of the base bar laid along the number bar
      if (done && !r3) {
        var tot = Math.abs(q / p), t = anim.t == null ? 1 : anim.t, shown = tot * t, dir = q < 0 ? -1 : 1, yc = yN + lh + 26, ch = Math.max(18, lh * 0.6);
        for (var i = 0; i < Math.ceil(shown - 1e-9); i++) {
          var f = Math.min(1, shown - i), a = X(dir * i * Math.abs(p)), b2 = X(dir * (i + f) * Math.abs(p));
          block(ctx, a, b2, yc, ch, { fillCol:pb, fillAlpha:0.2, line:pb });
          if (Math.abs(b2 - a) > 12) uiText(ctx, f < 1 && Math.abs(f - 0.5) < 1e-6 && t >= 1 ? "½" : String(i + 1), (a + b2) / 2, yc + ch / 2, { color:pb, weight:700, size:11 });
        }
        if (t >= 1) cmath(ctx, r.copies, q < 0 ? X(q) - 4 : X(q) + 4, yc + ch + 14, { size:15, align:q < 0 ? "left" : "right", color:pb });
      }
    } });
  };
  function say(r, k){
    if (r.id === "r1") return ["Find log base 4 of 128. Step 1: choose a common base.", "Each block is ×2. The base lane has 2 blocks and the number lane has 7.", "The 4-bar is 2 blocks long and the 128-bar is 7 blocks long.", "3½ copies of the 2-block bar fit along the 7-block bar: log base 4 of 128 is 7/2."][k];
    if (r.id === "r2") return ["Find log base root 3 of 1/27. Step 1: choose a common base.", "Base 3 chosen. Step 2: write root 3 and 1/27 as powers of 3.", "Each block is ×3. The base lane has half a block; the number lane has 3 blocks pointing left.", "Six half blocks are laid leftward along the 1/27 bar: the count is −6."][k];
    return ["Estimate log base 2 of 5. Step 1: bracket it between whole-number powers of 2.", "Two 2-blocks reach 4, a third reaches 8, and 5 sits inside the third block. " + MV.plain(r.steps[0].note), "log base 2 of 5 is log 5 divided by log 2, about 0.699 ÷ 0.301.", "The third block is shaded to 0.32 of its length and lands on 5: log base 2 of 5 is about 2.3."][k];
  }
  // ----- build sheet -----
  function inputs(s, x, open){
    var h = "";
    if (s.kind === "chips") return '<div class="chips bb-chips" role="group" aria-label="' + MV.esc(MV.plain(s.label)) + '">' + s.chips.map(function(c){ return '<button type="button" class="chip bb-chip" data-chip="' + c + '" data-k="' + s.id + "c" + c + '"' + (open ? "" : " disabled") + ">" + m(c) + "</button>"; }).join("") + "</div>";
    h += '<p class="bb-frame">';
    s.boxes.forEach(function(b, i){
      var dec = s.kind === "dec" || (s.id === "r3s2"), mode = dec ? "decimal" : "text";
      h += '<span class="bb-pre">' + b.pre + "</span>" + (b.sup ? '<sup class="bb-sup">' : " ") + '<input class="numin bb-in" type="text" inputmode="' + mode + '" autocomplete="off" data-box="' + i + '" data-k="' + s.id + "b" + i + '" aria-label="' + MV.esc(MV.plain(s.label)) + ", box " + (i + 1) + '" value="' + MV.esc(x.vals[i] || "") + '"' + (open ? "" : " disabled") + ">" + (b.sup ? "</sup>" : "") + " ";
    });
    return h + (s.post ? '<span class="bb-pre">' + s.post + "</span>" : "") + "</p>";
  }
  function ansText(s){ var a = MV.ans(s); if (s.kind === "chips") return m(a); if (s.display) return s.display; if (s.id === "r1s2") return m("4 = 2^2") + " and " + m("128 = 2^7"); if (s.id === "r2s2") return m("√3 = 3^{1/2}") + " and " + m("1/27 = 3^{-3}"); if (s.id === "r3s1") return m("2^2 < 5 < 2^3"); if (s.id === "r3s2") return m("log_2 5 ≈ 0.699 / 0.301"); return String(a); }
  function paint(){
    var r = round(), k = nSolved(r), h = '<h3 class="bb-h">' + r.title + '</h3><p class="bb-find">' + r.find + "</p>" + MV.usesHTML(r.use);
    r.steps.forEach(function(s, i){
      var x = st(s.id), open = i === k, locked = i > k;
      h += '<div class="bb-step' + (x.solved ? " done" : locked ? " locked" : "") + '" data-step="' + s.id + '"><p class="bb-lab"><strong>' + (x.solved ? "✓ " : "") + s.label + (locked ? "</strong> <span class=\"muted\">(unlocks when the step above is right)</span>" : "</strong>") + "</p>";
      if (x.solved) h += '<p class="bb-ans">' + ansText(s) + (x.first ? "" : ' <span class="muted tiny">(not first try)</span>') + "</p>" + (s.check ? '<p class="bb-check">' + s.check + "</p>" : "") + (s.note ? '<p class="tiny muted">' + s.note + "</p>" : "");
      else if (open) {
        h += inputs(s, x, true) + '<div class="q-actions">' + (s.kind === "chips" ? "" : '<button type="button" class="btn primary sm" data-act="check" data-k="' + s.id + 'chk">Check</button>') + MV.hintBtn(s.id + "h", x.hint) + "</div>" + MV.hintsHTML(s.hints, x.hint);
        if (msgs[s.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[s.id]);
      }
      h += "</div>";
    });
    if (k >= 3) h += MV.fbHTML("good", "<strong>✓ Round " + (S.r + 1) + " complete.</strong>" + (S.r < R.length - 1 ? " Go on to Round " + (S.r + 2) + "." : ""));
    var body = $("#bb-body", host);
    MV.keepFocus(body, function(){ body.innerHTML = h; });
    rR.set(S.r);
    $("#bb-say", host).textContent = say(r, k);
    plot.render();
  }
  function judge(s, raw){
    var A = MV.ans(s);
    if (s.kind === "chips") return raw[0] === A ? { ok:true } : { ok:false, fb:(s.wrong && s.wrong[raw[0]]) || s.wrongAll };
    var vals = raw.map(function(v){ var r = MV.parseNum(v); return r && r.length === 1 ? r[0] : null; });
    if (vals.some(function(v){ return v === null; })) return { bad:true };
    var eq = function(a, b){ return Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b)); };
    if (Array.isArray(A)) {
      if (vals.every(function(v, i){ return eq(v, A[i]); })) return { ok:true };
      var w = (s.wrong || []).filter(function(w){ return w.box != null ? eq(vals[w.box], w.v) : w.v.every(function(t, i){ return eq(vals[i], t); }); })[0];
      return { ok:false, fb:w ? w.fb : s.general };
    }
    var v = vals[0];
    if (typeof A === "object" ? v >= A.lo - 1e-9 && v <= A.hi + 1e-9 : eq(v, A)) return { ok:true };
    var w2 = (s.wrong || []).filter(function(w){ return eq(v, w.v); })[0];
    if (w2) return { ok:false, fb:w2.fb };
    if (s.outside) { if (v < 2 || v > 3) return { ok:false, fb:s.outside }; return { ok:false, fb:sub(s.inside, { a:num(v, 4), p:num(0.301 * v, 4) }) }; }
    return { ok:false, fb:s.general };
  }
  function playMeasure(r){
    if (r.id === "r3") { var q = Math.log(5) / Math.LN2 - 2; if (RM) { anim.shade = null; plot.render(); return; } anim.shade = 0; MV.tween({ dur:1500, step:function(t){ anim.shade = q * t; plot.render(); }, done:function(){ anim.shade = null; plot.render(); } }); return; }
    if (RM) { anim.t = null; plot.render(); return; }
    anim.t = 0; MV.tween({ dur:1500, ease:LIN, step:function(t){ anim.t = t; plot.render(); }, done:function(){ anim.t = null; plot.render(); } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-step]"); if (!box) return;
    var r = round(), s = r.steps.filter(function(q){ return q.id === box.dataset.step; })[0], x = st(s.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    var raw = null;
    if (b.dataset.chip != null) raw = [b.dataset.chip];
    else if (b.dataset.act === "check") raw = $$("[data-box]", box).map(function(el){ return el.value; });
    if (!raw) return;
    var res = judge(s, raw);
    if (res.bad) { msgs[s.id] = "Enter a number in " + (raw.length > 1 ? "each box" : "the box") + ", such as 3, −2, 1/2 or 0.4."; paint(); return; }
    if (res.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[s.id] = null; api.save(); paint(); if (nSolved(r) >= 3) playMeasure(r); var nx = $('[data-step] input:not([disabled])', host) || $('[data-step] .bb-chip:not([disabled])', host); if (nx) nx.focus({ preventScroll:true }); else MV.focusFb($("#bb-body", host)); return; }
    x.tries++; msgs[s.id] = res.fb; api.save(); paint(); MV.focusFb($('[data-step="' + s.id + '"]', host));
  });
  host.addEventListener("input", function(e){ var el = e.target; if (el.dataset.box == null) return; var box = el.closest("[data-step]"), x = st(box.dataset.step); x.vals[+el.dataset.box] = el.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.box != null) { e.preventDefault(); var b = e.target.closest("[data-step]").querySelector('[data-act="check"]'); if (b) b.click(); } });
  // ----- Why it works: reason chips (recorded, not scored) -----
  var W = C.why, wfb = {};
  function why(){
    var h = '<p class="tiny muted">' + W.intro + "</p>";
    W.proofs.forEach(function(pf){
      var ws = S.why[pf.id] || (S.why[pf.id] = {});
      h += '<div class="bb-proof"><p class="bb-ph"><strong>' + pf.title + "</strong></p><ol>";
      pf.lines.forEach(function(L, i){
        var lk = pf.id + "-" + i, sv = ws[i] || {}, right = MV.ans(L);
        h += '<li><p class="bb-line">' + L.t + (sv.ok ? ' <span class="bb-reason">(' + W.reasons[right] + ")</span>" : "") + "</p>";
        if (sv.ok) { if (L.note) h += '<p class="tiny">' + L.note + "</p>"; }
        else {
          h += '<div class="chips bb-rc" role="group" aria-label="Reason for line ' + (i + 1) + '">' + W.reasons.map(function(t, j){ return '<button type="button" class="chip" data-why="' + lk + '" data-j="' + j + '" data-k="w' + lk + j + '" aria-pressed="' + (sv.last === j) + '">' + t + "</button>"; }).join("") + "</div>";
          if (wfb[lk]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + wfb[lk] + " Try another reason.");
        }
        h += "</li>";
      });
      h += "</ol>";
      if (pf.id === "pf2" && pf.lines.every(function(L, i){ return (ws[i] || {}).ok; })) h += MV.fbHTML("good", "<strong>✓ Both proofs done.</strong> " + W.closing);
      h += "</div>";
    });
    var el = $("#bb-whyb", host); MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  $("#bb-whyb", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-why]"); if (!b) return;
    var parts = b.dataset.why.split("-"), pf = W.proofs.filter(function(q){ return q.id === parts[0]; })[0], i = +parts[1], L = pf.lines[i], j = +b.dataset.j;
    var ws = S.why[pf.id] || (S.why[pf.id] = {}), sv = ws[i] || (ws[i] = { tries:0 });
    sv.last = j; sv.tries++;
    if (j === MV.ans(L)) { sv.ok = true; wfb[b.dataset.why] = null; } else wfb[b.dataset.why] = (L.special && L.special[String(j)]) || W.wrongFb[j];
    api.save(); why();
    var li = $('[data-why="' + b.dataset.why + '"]', host); if (li) MV.focusFb(li.closest("li")); else MV.focusFb($("#bb-whyb", host));
  });
  // results summary line (registered like a practice activity)
  var all = []; R.forEach(function(r){ r.steps.forEach(function(s){ all.push([r, s]); }); });
  MV.ACTS.bridge = { a:{ id:"bridge" },
    stats:function(){ var f = 0, d = 0; all.forEach(function(rs){ var x = st(rs[1].id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:all.length, done:d, line:"Base bridge (steps right first try): " + f + "/" + all.length + (d < all.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; all.forEach(function(rs){ var x = st(rs[1].id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(rs[0].goal)); }); return g; } };
  if (S.r == null || S.r >= R.length) S.r = 0;
  paint(); why();
  return {};
}

// ---------- Practice 2: Power moves (N4 number entry with a range answer for estimates) ----------
// @component N4 rangeBoxes — one box per item (fraction, number or decimal keypad), exact answers or an accepted range {v, lo, hi},
// named wrong entries, three-level hints, first-try scoring
function moves(host, api, a){
  var S = api.S; S.items = S.items || {}; var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  function eq(x, y){ return Math.abs(x - y) <= 1e-6 * Math.max(1, Math.abs(y)); }
  function judge(it, raw){
    var r = MV.parseNum(raw); if (!r || r.length !== 1) return { bad:true };
    var v = r[0], A = MV.ans(it);
    if (typeof A === "object" ? v >= A.lo - 1e-9 && v <= A.hi + 1e-9 : eq(v, A)) return { ok:true };
    var w = (it.wrong || []).filter(function(w){ return eq(v, w.v); })[0];
    return { ok:false, fb:w ? w.fb : null };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), mode = it.box === "fraction" ? "text" : "decimal";
        var h = '<div class="q" data-ni="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="numrow"><label for="pm-' + it.id + '">Your answer:</label><input class="numin" id="pm-' + it.id + '" data-nin="' + it.id + '" type="text" inputmode="' + mode + '" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var b = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ni]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.ni; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = "Enter a number, such as 12, −3.5 or −4/3."; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb || "Check your work and try again."); }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ni="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Same graph, new recipe ----------
var task = (function(){
  var api, plot, T;
  function k2(v){ var k = Math.round(Math.log2(v)); return Math.pow(2, k) === v ? k : null; }    // v = 2^k exactly?
  function read(){
    var s = api ? api.S : {}, n = +s.n, q = +s.b, frac = !!s.frac;
    var okN = /^[−-]?\d+$/.test(String(s.n || "").trim()) && n >= -6 && n <= 6 && n !== 0;
    var okB = /^\d+$/.test(String(s.b || "").trim()) && q >= 2 && q <= 100;
    var k = okB ? (frac ? (k2(q) == null ? null : -k2(q)) : k2(q)) : null;
    return { n:n, q:q, frac:frac, k:k, valid:okN && okB, bk:frac ? "1/" + q : String(q), bv:frac ? 1 / q : q };
  }
  function eqSrc(d){ return "y = " + lb(d.bk) + "(x^{" + nsrc(Q(d.n)) + "})"; }
  function draw(){
    var d = read(), ink2 = css("--ink-2"), pen = css("--pen"), curves = [{ f:function(x){ return Math.log2(Math.abs(x)); }, color:ink2, width:2, dash:[6, 6] }], match = [false, false];
    if (d.valid) {
      var f = function(x){ return Math.log(Math.pow(x, d.n)) / Math.log(d.bv); };
      curves.push({ f:f, color:pen, width:3 });
      match[0] = d.k != null && d.k === d.n; match[1] = match[0] && d.n % 2 === 0;
    }
    var pts = [[0.5, -1], [2, 1], [4, 2], [8, 3], [-2, 1], [-4, 2], [-8, 3]].map(function(q){ return { x:q[0], y:q[1], open:true, r:4, color:ink2 }; });
    plot.draw({ view:{ xmin:-10, xmax:10, ymin:-4, ymax:5 }, asymptotes:[{ x:0, label:"x = 0" }], curves:curves, points:pts,
      describe:d.valid ? "Target graph, dashed, with two mirror-image branches, and your graph " + MV.plain(m(eqSrc(d))) + (match[0] ? ". The right branch matches." : "") + (match[1] ? " The left branch matches." : "") : "Target graph, dashed, with two mirror-image branches through (2, 1), (4, 2), (8, 3) and their mirror images.",
      after:function(ctx, p){ if (match[0]) uiText(ctx, "matches", p.X(6), p.Y(Math.log2(6)) - 16, { color:css("--ink"), weight:700, size:13 }); if (match[1]) uiText(ctx, "matches", p.X(-6), p.Y(Math.log2(6)) - 16, { color:css("--ink"), weight:700, size:13 }); } });
  }
  function caption(){ var d = read(), el = $("#rc-cap"); if (el) el.innerHTML = d.valid ? m(eqSrc(d)) : '<span class="muted tiny">Enter ' + m("@n{n}") + " and " + m("@b{b}") + " to see your equation.</span>"; }
  function at4(d){ if (d.k != null) return m(qs(Q(2 * d.n, d.k))); return "≈ " + num(d.n * Math.log(4) / Math.log(d.bv), 3); }
  function atm8(d){ if (d.k != null) return m(qs(Q(3 * d.n, d.k))); return "≈ " + num(d.n * Math.log(8) / Math.log(d.bv), 3); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; def(a.S, { n:"", b:"", frac:false });
      inp.innerHTML = '<div class="rc-in"><div class="rc-row"><span class="rc-lab">' + m("@n{n}") + '</span><button type="button" class="btn ghost rc-pm" data-npm="-1" data-k="rcnm" aria-label="Decrease n">' + MINUS + '</button><input id="rc-n" type="number" step="1" min="-6" max="6" class="rc-box" aria-label="n, a whole number from −6 to 6, not 0" value="' + MV.esc(a.S.n) + '"><button type="button" class="btn ghost rc-pm" data-npm="1" data-k="rcnp" aria-label="Increase n">+</button><span class="tiny muted">a whole number from −6 to 6, not 0</span></div>' +
        '<div class="rc-row"><span class="rc-lab">' + m("@b{b}") + '</span><button type="button" class="btn ghost rc-frac" id="rc-frac" data-k="rcfrac" aria-pressed="' + a.S.frac + '" aria-label="Unit fraction 1 over q">1/</button><input id="rc-b" type="number" step="1" min="2" max="100" class="rc-box" aria-label="b, a whole number from 2 to 100 (or q when 1/ is on)" value="' + MV.esc(a.S.b) + '"><span class="tiny muted">a whole number from 2 to 100, or press 1/ for a unit fraction</span></div>' +
        '<p class="eq-cap rc-cap" id="rc-cap" aria-live="polite"></p></div>';
      pv.innerHTML = '<canvas class="plot" id="rc-plot" role="img" aria-label="Target graph and your graph"></canvas><p class="tiny muted">Dashed: the target. Blue: your graph. Open rings: the seven target points.</p>';
      plot = new MV.Plot($("#rc-plot"), { xmin:-10, xmax:10, ymin:-4, ymax:5 }); plot.render = draw;
      function upd(){ a.save(); caption(); draw(); a.update(); }
      inp.addEventListener("input", function(e){ if (e.target.id === "rc-n") a.S.n = e.target.value; else if (e.target.id === "rc-b") a.S.b = e.target.value; else return; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.npm) { var v = parseInt(String(a.S.n).replace(MINUS, "-"), 10); if (isNaN(v)) v = 0; v += +b.dataset.npm; if (v === 0) v += +b.dataset.npm; v = clamp(v, -6, 6); a.S.n = String(v); $("#rc-n").value = v; upd(); }
        else if (b.id === "rc-frac") { a.S.frac = !a.S.frac; b.setAttribute("aria-pressed", a.S.frac); upd(); }
      });
      $("#task-check").addEventListener("click", function(){ setTimeout(function(){ var ts = MV.taskState(), fb = $("#task-fb .fb.good"); if (fb && ts.found.length >= 5 && T.after5) fb.insertAdjacentHTML("beforeend", "<p>" + T.after5 + "</p>"); }, 0); });
      caption(); draw();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter a whole number " + m("@n{n}") + " from −6 to 6 (not 0) and a base " + m("@b{b}") + ": a whole number from 2 to 100, or 1/" + m("q") + " with " + m("q") + " from 2 to 100."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      var two = d.k != null && d.k === d.n, even = d.n % 2 === 0;
      return [two, even, even && two, !(d.bk === "4")];
    },
    tips:function(d, c){
      var out = [];
      if (!c[0]) out.push(sub(T.tips[0], { v:at4(d) }));
      if (!c[1]) out.push(T.tips[1]);
      if (!c[2] && c[1]) out.push(sub(T.tips[2], { v:atm8(d) }));
      if (!c[3]) out.push(T.tips[3]);
      return out;
    },
    key:function(d){ return d.n + "|" + d.bk; },
    label:function(k){ var p = k.split("|"); return m("y = " + lb(p[1]) + "(x^{" + nsrc(Q(+p[0])) + "})"); },
    text:function(k){ var p = k.split("|"); return MV.plain(m("y = " + lb(p[1], true) + "(x^{" + qs(Q(+p[0])) + "})")); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:bridge,
  activities:{ moves:moves },
  task:task
});
})();
