// MHF4U 41 Product and Quotient Laws: hero (log ruler), slide rule + length strip (Explore), log law clinic with a claim
// tester (Part 3), move chooser (Practice 1), "Build it" number boxes (Practice 2) and the "Land exactly on 2" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS, RM = MV.reduceMotion;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function near(a, b, e){ return Math.abs(a - b) < (e || 1e-9); }
function isInt(v){ return isFinite(v) && near(v, Math.round(v), 1e-9); }
function lg(v){ return Math.log(v) / Math.LN10; }
function logb(v, b){ return Math.log(v) / Math.log(b); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function copy(o){ return JSON.parse(JSON.stringify(o)); }
// exact fraction text ("7/3", "−1/2", "4") when the denominator is at most maxDen, else null
function fracOf(v, maxDen){
  for (var d = 1; d <= (maxDen || 64); d++) { var n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9 * Math.max(1, Math.abs(v))) { var g = gcd(n, d); n /= g; return (n < 0 ? MINUS : "") + Math.abs(n) + (d / g === 1 ? "" : "/" + d / g); } }
  return null;
}
// a value with at most 3 decimal places -> its text, else null
function dec3(v){ var r = Math.round(v * 1000) / 1000; return near(v, r, 1e-9 * Math.max(1, Math.abs(v))) ? num(r, 3) : null; }
function vt0(v){ var d = dec3(v); return d != null ? d : num(v, 3); }
function vt(v){ var d = dec3(v); return d != null ? d : "≈ " + num(v, 3); }
// three decimal places, kept ("0.740")
function f3(v){ var s = Math.abs(v).toFixed(3); return (v < 0 && s !== "0.000" ? MINUS : "") + s; }
function fv3(v){ return isInt(v) ? num(Math.round(v)) : f3(v); }
function approx(v){ return isInt(v) ? "= " + num(Math.round(v)) : "≈ " + f3(v); }
// "log 6", "log_2 32", "log(7/3)"; brown puts the base in the --p-b colour (m() source only)
function lname(v, b, brown){
  var d = dec3(v), sub = b === 10 ? "" : "_{" + (brown ? "@b{" + b + "}" : b) + "}";
  return "log" + sub + (d != null && v > 0 ? " " + d : "(" + (fracOf(v, 400) || num(v, 3)) + ")");
}
// spoken text for buttons: "log₄ 2" -> "log base 4 of 2", "log x" -> "log of x"
function say(h){
  var s = MV.plain(h).replace(/log([₀-₉]+)/g, function(_, d){ return "log base " + d.replace(/[₀-₉]/g, function(c){ return "₀₁₂₃₄₅₆₇₈₉".indexOf(c); }) + " of"; });
  s = s.replace(/log_(\w+)/g, "log base $1 of").replace(/\blog(?= |\()(?! base| of)/g, "log of");
  return s.replace(/ of\s*\(/g, " of (").replace(/\//g, " over ").replace(/\s+/g, " ").trim();
}

// ---------- canvas helpers ----------
// @component G11 canvasMath (from MHF4U 37) — canvas text with ^{…} superscripts and _{…} subscripts in the math font
// (single letters italic, words such as "log" upright), optional sheet-coloured backing; o.measure returns the width only
function cmath(ctx, s, x, y, o){
  o = o || {};
  var F = o.size || 14, fm = css("--font-math") || "serif", segs = [], i = 0, A = o.alpha == null ? 1 : o.alpha;
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
  if (o.measure) return w;
  var x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  ctx.save(); ctx.textBaseline = "middle"; ctx.textAlign = "left";
  if (o.bg !== false) { ctx.globalAlpha = 0.85 * A; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, y - F * 0.8, w + 6, F * 1.6); }
  ctx.globalAlpha = A; ctx.fillStyle = o.color || css("--ink");
  segs.forEach(function(sg){ ctx.font = font(sg); ctx.fillText(sg.t, x0, y + (sg.lv === 1 ? -F * 0.38 : sg.lv === -1 ? F * 0.3 : 0)); x0 += sg.w; });
  ctx.restore();
  return w;
}
// centred label kept inside the canvas; returns {x, w}
function clab(ctx, W, s, x, y, o){
  o = o || {}; var w = cmath(ctx, s, 0, 0, { size:o.size, measure:true, weight:o.weight }); x = clamp(x, w / 2 + 4, W - w / 2 - 4);
  cmath(ctx, s, x, y, { size:o.size, align:"center", color:o.color, alpha:o.alpha, weight:o.weight }); return { x:x, w:w };
}
function uiText(ctx, s, x, y, o){
  o = o || {}; ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.font = (o.weight || 400) + " " + (o.size || 12) + "px " + (css("--font-ui") || "sans-serif");
  ctx.fillStyle = o.color || css("--ink-2"); ctx.textAlign = o.align || "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y); ctx.restore();
}
// @component lengthStrip — horizontal bars in log units drawn end to end: a bar from xa to xb (px) with an arrow tip at xb
// (so bars that point back show it), optional --hi glow, dashed outline (o.dash) and alpha; used by the hero, the slide
// rule's strip, the clinic's Bars view and the task preview
function sbar(ctx, xa, xb, y, o){
  var w = o.w || 12, dir = xb >= xa ? 1 : -1, len = Math.abs(xb - xa);
  if (len < 0.5) return;
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
  if (o.glow) { ctx.fillStyle = css("--hi"); ctx.fillRect(Math.min(xa, xb) - 5, y - w / 2 - 5, len + 10, w + 10); }
  var head = o.arrow === false ? 0 : Math.min(w * 0.95, len), xe = xb - dir * head;
  if (o.dash) {
    ctx.strokeStyle = o.color; ctx.lineWidth = 2; ctx.setLineDash(o.dash);
    ctx.strokeRect(Math.min(xa, xe), y - w / 2 + 1, Math.abs(xe - xa), w - 2); ctx.setLineDash([]);
  } else { ctx.fillStyle = o.color; ctx.fillRect(Math.min(xa, xe), y - w / 2, Math.abs(xe - xa), w); }
  if (head) { ctx.fillStyle = o.color; ctx.beginPath(); ctx.moveTo(xb, y); ctx.lineTo(xe, y - w * 0.85); ctx.lineTo(xe, y + w * 0.85); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function ring(ctx, x, y, r, col, lw, alpha){ ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = lw || 3; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.stroke(); ctx.restore(); }
function diamond(ctx, x, y, s, col, alpha){ ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s, y); ctx.closePath(); ctx.fill(); ctx.restore(); }
function vline(ctx, x, y0, y1, col, lw, dash, alpha){ ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = lw || 1; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore(); }
function hline(ctx, x0, x1, y, col, lw, alpha){ ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = col; ctx.lineWidth = lw || 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore(); }

// @component radioGroup (from MHF4U 25/37) — segmented control or chip row as a real radio group (arrow keys, roving
// tabindex, lock); here options may be a function (labels that change with the mode) and refresh() repaints
function radios(host, o){
  var val = String(o.value), locked = false;
  function opts(){ return typeof o.options === "function" ? o.options() : o.options; }
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      opts().map(function(x){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? " disabled" : "") + (x.say ? ' aria-label="' + MV.esc(x.say) + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = opts().map(function(x){ return String(x.id); }), i = (ids.indexOf(val) + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}
// @component N9 markSlider (adapted from MHF4U 32/37 stepSlider) — range input over a list of marks with 40 px − / + buttons;
// the value may sit between marks (shown exactly until it is moved, then it snaps); arrows ±1 mark, Shift + arrow or
// Page Up/Down to the next labelled mark, Home / End to the ends. o: {id, label(), list(), get(), set(v, how), fmt(v), isLab(v)}
function markSlider(host, o){
  host.innerHTML = '<div class="sl41"><div class="sl41-top"><label for="sl41-' + o.id + '"></label><output for="sl41-' + o.id + '"></output></div>' +
    '<div class="sl41-row"><button type="button" class="btn ghost sl41-pm" data-pm="-1" data-k="' + o.id + 'm">' + MINUS + '</button><input type="range" id="sl41-' + o.id + '" min="0" step="1">' +
    '<button type="button" class="btn ghost sl41-pm" data-pm="1" data-k="' + o.id + 'p">+</button></div></div>';
  var lab = host.querySelector("label"), out = host.querySelector("output"), inp = host.querySelector("input"), btns = host.querySelectorAll("[data-pm]"), locked = false;
  function at(){ var l = o.list(), v = o.get(), k = 0; for (var i = 0; i < l.length; i++) if (l[i] <= v + 1e-9) k = i; return k; }
  function next(dir, big){
    var l = o.list(), v = o.get(), c = l.filter(function(w){ return dir > 0 ? w > v + 1e-9 : w < v - 1e-9; });
    if (big) { var cb = c.filter(o.isLab); if (cb.length) c = cb; }
    return c.length ? (dir > 0 ? c[0] : c[c.length - 1]) : null;
  }
  function paint(){
    var l = o.list(), v = o.get(), name = MV.plain(o.label());
    lab.innerHTML = o.label(); out.innerHTML = o.fmt(v);
    inp.max = l.length - 1; inp.value = at(); inp.setAttribute("aria-valuetext", MV.plain(o.fmt(v)));
    inp.disabled = locked; btns[0].disabled = locked || next(-1) == null; btns[1].disabled = locked || next(1) == null;
    btns[0].setAttribute("aria-label", "Down one mark: " + name); btns[1].setAttribute("aria-label", "Up one mark: " + name);
  }
  function go(v, how){ if (v == null || locked) return; o.set(v, how); }
  inp.addEventListener("input", function(){ go(o.list()[+inp.value], "drag"); });
  inp.addEventListener("keydown", function(e){
    var k = e.key, d = (k === "ArrowRight" || k === "ArrowUp") ? 1 : (k === "ArrowLeft" || k === "ArrowDown") ? -1 : 0;
    if (d) { e.preventDefault(); go(next(d, e.shiftKey), "key"); return; }
    if (k === "PageUp" || k === "PageDown") { e.preventDefault(); go(next(k === "PageUp" ? 1 : -1, true), "key"); return; }
    if (k === "Home" || k === "End") { e.preventDefault(); var l = o.list(); go(k === "Home" ? l[0] : l[l.length - 1], "key"); }
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pm]"); if (!b || b.disabled) return; go(next(+b.dataset.pm, false), "step"); });
  paint();
  return { paint:paint, step:function(d, big){ go(next(d, big), "key"); }, lock:function(b){ locked = !!b; paint(); } };
}

// ---------- hero: a log ruler that multiplies by adding lengths (storyboard in the plan) ----------
function hero(f){
  var p = new MV.Plot(f.canvas, { xmin:0, xmax:1, ymin:0, ymax:1 });
  var K = [1, 2, 4, 8, 16, 32, 64, 128], Hs = { rule:0, blue:0, teal:0, ink:0, ring:0, up:0, rev:0, ring8:0 };
  var CAP1 = "`8 × 16 = 128`, so `log_2 8 + log_2 16 = log_2 128`", CAP2 = "`128 ÷ 16 = 8`, so `log_2 128 - log_2 16 = log_2 8`";
  function cap(n){ f.cap.innerHTML = n ? '<span class="hero41-cap">' + MV.md(CAP1) + "</span>" + (n > 1 ? '<span class="hero41-cap">' + MV.md(CAP2) + "</span>" : "") : ""; }
  p.render = function(){
    p.draw({ grid:false, axes:false, describe:"A log-scale ruler marked 1, 2, 4, 8, 16, 32, 64 and 128, equally spaced, over a length axis in units of log base 2 from 0 to 7. A blue bar log base 2 of 8 = 3 and a teal bar log base 2 of 16 = 4 end to end reach 128: log base 2 of 128 = 7, so 2 cubed times 2 to the 4 is 2 to the 7. Going back 4 units from 128 lands on 8: 128 ÷ 16 = 8.",
      after:function(ctx){
        var W = p.W, H = p.H, pad = Math.max(22, W * 0.07), X = function(k){ return pad + k / 7 * (W - 2 * pad); };
        var yR = H * 0.38, y1 = H * 0.55, y2 = H * 0.69, yA = H * 0.84, F = W < 360 ? 12 : 14;
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3c = css("--f3"), hi = css("--hi");
        var reach = Hs.rule * 7.6 - 0.3;
        if (Hs.rule > 0) {
          hline(ctx, X(0) - 10, X(0) - 10 + (X(7) - X(0) + 20) * Hs.rule, yR, ink, 2);
          hline(ctx, X(0), X(0) + (X(7) - X(0)) * Hs.rule, yA, ink2, 1.5);
          K.forEach(function(v, k){
            var pop = clamp((reach - k) * 2.5, 0, 1); if (pop <= 0) return;
            vline(ctx, X(k), yR, yR - 10 * pop, ink, 2);
            uiText(ctx, String(v), X(k), yR - 22, { size:Math.round(F * (0.6 + 0.4 * pop)), color:ink, weight:700, alpha:pop });
            vline(ctx, X(k), yA, yA + 6, ink2, 1.2, null, pop);
            uiText(ctx, String(k), X(k), yA + 16, { size:F - 2, alpha:pop });
          });
          if (Hs.rule >= 1) cmath(ctx, "length in units of log_2", W / 2, Math.min(H - 10, yA + 34), { size:F - 2, align:"center", color:ink2, weight:400, bg:false });
        }
        if (Hs.blue > 0) sbar(ctx, X(0), X(3 * Hs.blue), y1, { color:pen, w:12 });
        if (Hs.teal > 0 && Hs.rev < 1) sbar(ctx, X(3), X(3 + 4 * Hs.teal), y1, { color:f3c, w:12, alpha:1 - Hs.rev });
        if (Hs.rev > 0) sbar(ctx, X(7), X(7 - 4 * Hs.rev), y1, { color:f3c, w:12 });
        if (Hs.ink > 0) sbar(ctx, X(0), X(7 * Hs.ink), y2, { color:ink, w:16 });
        if (Hs.ring > 0) ring(ctx, X(7), yR, 12, hi, 3.5, Hs.ring);
        if (Hs.ring8 > 0) ring(ctx, X(3), yR, 12, hi, 3.5, Hs.ring8);
        // the three labels, then they slide up into one line 2³ × 2⁴ = 2⁷
        var TF = F + 6, yT = H * 0.12, parts = ["2^3", "×", "2^4", "=", "2^7"], ws = parts.map(function(s){ return cmath(ctx, s, 0, 0, { size:TF, measure:true }) + 14; });
        var tot = ws.reduce(function(a, b){ return a + b; }, 0), xs = [], cx = W / 2 - tot / 2;
        ws.forEach(function(w){ xs.push(cx + w / 2); cx += w; });
        var labs = [{ t:"log_2 8 = 3", to:"2^3", x:X(1.5), y:y1 - 20, slot:0, col:pen, on:Hs.blue }, { t:"log_2 16 = 4", to:"2^4", x:X(5), y:y1 - 20, slot:2, col:f3c, on:Hs.teal }, { t:"log_2 128 = 7", to:"2^7", x:X(3.5), y:y2 + 22, slot:4, col:ink, on:Hs.ink }];
        labs.forEach(function(L){
          if (L.on < 1) return;
          var u = Hs.up, x = lerp(L.x, xs[L.slot], u), y = lerp(L.y, yT, u);
          if (u < 1) clab(ctx, W, L.t, x, y, { size:F, color:L.col, alpha:1 - u });
          if (u > 0) clab(ctx, W, L.to, x, y, { size:TF, color:L.col, alpha:u });
        });
        if (Hs.up > 0) { cmath(ctx, "×", xs[1], yT, { size:TF, align:"center", alpha:Hs.up, bg:false }); cmath(ctx, "=", xs[3], yT, { size:TF, align:"center", alpha:Hs.up, bg:false }); }
      } });
  };
  if (RM) { Object.keys(Hs).forEach(function(k){ Hs[k] = 1; }); cap(2); p.render(); return; }
  cap(0); p.render();
  var steps = [{ k:"rule", dur:800 }, { k:"blue", dur:800 }, { k:"teal", dur:1000 }, { k:"ink", dur:600, then:function(){ Hs.ring = 1; cap(1); } }, { wait:700 }, { k:"up", dur:600 }, { wait:600 }, { k:"rev", dur:800, then:function(){ Hs.ring8 = 1; cap(2); } }];
  var i = 0;
  (function next(){
    if (i >= steps.length) { p.render(); return; }
    var s = steps[i++];
    if (s.wait) { MV.wait(s.wait, next); return; }
    MV.tween({ dur:s.dur, ease:s.k === "rule" ? function(t){ return t; } : null, step:function(t){ Hs[s.k] = t; p.render(); }, done:function(){ Hs[s.k] = 1; if (s.then) s.then(); p.render(); next(); } });
  })();
}

// ---------- Explore: slide rule (D and C scales, cursor) with the length strip under it ----------
var HALF = []; for (var h2 = 2; h2 <= 19; h2++) HALF.push(h2 / 2);
function rd(v){ return Math.round(v * 1e6) / 1e6; }
function halves(a, b){ var o = []; for (var k = a * 2; k <= b * 2; k++) o.push(k / 2); return o; }
var DLOG = HALF.map(function(v){ return rd(v / 10); }).concat(HALF, HALF.map(function(v){ return v * 10; }), [100]);
var CLOG = HALF.concat([10]);
var DORD = halves(0, 20), DORDS = halves(-10, 20), CORD = halves(0, 10);
var LIST = {
  log:{ mul:{ a:DLOG.filter(function(v){ return v <= 10; }), b:CLOG }, div:{ a:DLOG.filter(function(v){ return v >= 1; }), b:CLOG } },
  ord:{ mul:{ a:CORD, b:CORD }, div:{ a:DORD, b:CORD } }
};
function decade(v){ return Math.pow(10, Math.floor(lg(v) + 1e-9)); }
function labLog(v){ return isInt(v / decade(v)); }
function phoneLog(v){ var q = v / decade(v); return isInt(q) && [1, 2, 3, 5].indexOf(Math.round(q)) >= 0; }
function key(v){ return String(Math.round(v * 1000)); }
var SR0 = { rul:"log", op:"mul", b:10, x:1, y:1, z:1, pairs:false, last:"b" };
function frameOf(st){
  var P = function(v){ return st.rul === "log" ? lg(v) : v; };
  if (st.op === "mul") { var ci = P(st.x); return { ci:ci, cu:ci + P(st.y) }; }
  var cu = P(st.z); return { ci:cu - P(st.y), cu:cu };
}
function answer(st){ var L = st.rul === "log"; return st.op === "mul" ? (L ? rd(st.x * st.y) : st.x + st.y) : (L ? st.z / st.y : st.z - st.y); }
function geom(rul, op, W){
  var L = rul === "log", u0 = L ? -1 : op === "div" ? -10 : 0, u1 = L ? 2 : 20, pad = W < 480 ? 18 : 26;
  return { L:L, op:op, u0:u0, u1:u1, pad:pad, X:function(u){ return pad + (u - u0) / (u1 - u0) * (W - 2 * pad); }, U:function(px){ return u0 + (px - pad) / (W - 2 * pad) * (u1 - u0); }, p:function(v){ return L ? lg(v) : v; } };
}
function powersOf(b){ var o = [], k0 = Math.ceil(-1 / lg(b) - 1e-9), k1 = Math.floor(2 / lg(b) + 1e-9); for (var k = k0; k <= k1; k++) o.push({ k:k, v:Math.pow(b, k) }); return o; }
function onList(v, list){ return list.some(function(w){ return near(w, v, 1e-7); }); }
function snapTo(v, list){ var best = list[0]; list.forEach(function(w){ if (Math.abs(w - v) < Math.abs(best - v) - 1e-12) best = w; }); return best; }

function slideRule(host, api){
  var S = api.S;
  Object.keys(SR0).forEach(function(k){ if (S[k] === undefined) S[k] = SR0[k]; });
  var Lo = MV.pgLayout(host, { aria:"Slide rule" });
  host.classList.add("sr");
  var cv = Lo.canvas; cv.classList.add("sr-cv"); cv.tabIndex = 0;
  Lo.graph.insertAdjacentHTML("beforeend", '<p class="tiny muted sr-leg">C, the top scale, slides; D, the bottom scale, is fixed. The yellow window is the cursor. Drag either one, use the controls, or focus the rule and press the arrow keys.</p>');
  Lo.ctrl.innerHTML = '<div class="sr-row"><div id="sr-rul"></div><div id="sr-op"></div></div><div class="sr-row" id="sr-units"></div><div id="sr-sa"></div><div id="sr-sb"></div>' +
    '<div class="sr-row"><button type="button" class="btn ghost sm sr-tog" id="sr-pairs" data-k="srpairs" aria-pressed="false">Show every pair</button><button type="button" class="btn ghost sm" id="sr-reset" data-k="srreset">Reset</button></div>';
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 });
  var P = { ci:0, cu:0, res:1, ring:0, pairs:S.pairs ? 1 : 0, unitT:1, oldB:S.b, sw:null, ov:{} };
  var cancels = [], timers = [], pending = null, drag = null;
  function halt(){ cancels.forEach(function(c){ c(); }); cancels = []; timers.forEach(clearTimeout); timers = []; P.sw = null; P.unitT = 1; P.pairs = S.pairs ? 1 : 0; P.ring = 0; P.res = 1; }
  function tw(o){ cancels.push(MV.tween(o)); }
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }
  function user(){ if (pending) { var d = pending; pending = null; d(); } halt(); P.ov = {}; }
  function snapDisplay(){ var f = frameOf(S); P.ci = f.ci; P.cu = f.cu; P.res = 1; }
  function W(){ return plot.W || cv.getBoundingClientRect().width || 600; }
  function G(){ return geom(S.rul, S.op, W()); }

  // ----- controls -----
  var rulR = radios($("#sr-rul", host), { label:"Rulers", value:S.rul, options:[{ id:"log", t:"Log" }, { id:"ord", t:"Ordinary" }], onChange:function(v){ user(); switchRulers(v); } });
  var opR = radios($("#sr-op", host), { label:"Operation", value:S.op, options:function(){ var L = S.rul === "log"; return [{ id:"mul", t:L ? "Multiply" : "Add" }, { id:"div", t:L ? "Divide" : "Subtract" }]; }, onChange:function(v){ user(); switchOp(v); } });
  var unR = radios($("#sr-units", host), { label:"Units", aria:"Units for the length strip", cls:"chips bchips", value:String(S.b),
    options:[{ id:"10", t:m("log"), say:"log, base 10" }, { id:"2", t:m("log_2"), say:"log base 2" }, { id:"3", t:m("log_3"), say:"log base 3" }], onChange:function(v){ user(); setUnits(+v); } });
  function isLab(v){ return S.rul === "log" ? labLog(v) : isInt(v); }
  var sa = markSlider($("#sr-sa", host), { id:"a",
    label:function(){ var L = S.rul === "log"; return S.op === "mul" ? "Slide: C’s " + (L ? "1" : "0") + " above D’s" : "Cursor on D’s"; },
    list:function(){ return LIST[S.rul][S.op].a; }, get:function(){ return S.op === "mul" ? S.x : S.z; },
    set:function(v, how){ setVal("a", v, how); }, fmt:function(v){ return vt(v); }, isLab:isLab });
  var sb = markSlider($("#sr-sb", host), { id:"b",
    label:function(){ return S.op === "mul" ? "Cursor on C’s" : "Divisor: C’s mark under the cursor"; },
    list:function(){ return LIST[S.rul][S.op].b; }, get:function(){ return S.y; },
    set:function(v, how){ setVal("b", v, how); }, fmt:function(v){ return vt(v); }, isLab:isLab });
  var SL = { a:sa, b:sb };

  function setVal(w, v, how){
    user();
    if (w === "a") { if (S.op === "mul") S.x = v; else S.z = v; } else S.y = v;
    S.last = w; api.save(); refresh();
    if (how === "drag") { snapDisplay(); draw(); }
    else glide(S.op === "mul" ? (w === "a" ? 800 : 500) : (w === "a" ? 500 : 800));
    MV.changed();
  }
  function switchRulers(r, cb){
    if (r === S.rul) { if (cb) cb(); return; }
    halt();
    var g0 = G(), f0 = { ci:P.ci, cu:P.cu }, st0 = copy(S), Ls;
    S.rul = r; Ls = LIST[r][S.op];
    if (S.op === "mul") { S.x = snapTo(S.x, Ls.a); S.y = snapTo(S.y, Ls.b); } else { S.z = snapTo(S.z, Ls.a); S.y = snapTo(S.y, Ls.b); }
    api.save(); refresh(); snapDisplay();
    P.sw = { g0:g0, f0:f0, st0:st0, t:0 };
    tw({ dur:1000, step:function(t){ if (P.sw) P.sw.t = t; draw(); }, done:function(){ P.sw = null; draw(); flash("cmp"); if (cb) cb(); } });
    MV.changed();
  }
  function switchOp(op){
    halt();
    var L = S.rul === "log", g0 = G(), f0 = { ci:P.ci, cu:P.cu }, st0 = copy(S);
    if (op === "div") S.z = L ? rd(S.x * S.y) : S.x + S.y;
    else { var xv = L ? S.z / S.y : S.z - S.y, la = LIST[S.rul].mul.a; S.x = (xv >= la[0] - 1e-9 && xv <= la[la.length - 1] + 1e-9) ? (L ? xv : snapTo(xv, la)) : snapTo(xv, la); }
    S.op = op; S.last = "b"; api.save(); refresh(); snapDisplay();
    if (!L) { P.sw = { g0:g0, f0:f0, st0:st0, t:0 }; tw({ dur:700, step:function(t){ if (P.sw) P.sw.t = t; draw(); }, done:function(){ P.sw = null; draw(); } }); }
    else draw();
    MV.changed();
  }
  function setUnits(b){
    P.oldB = S.b; S.b = b; P.unitT = 0; api.save(); refresh();
    tw({ dur:400, step:function(t){ P.unitT = t; draw(); }, done:function(){ P.unitT = 1; draw(); } });
    MV.changed();
  }
  function pairsTo(on, cb){ S.pairs = on; api.save(); refresh(); tw({ dur:on ? 600 : 200, ease:function(t){ return t; }, step:function(t){ P.pairs = on ? t : 1 - t; draw(); }, done:function(){ P.pairs = on ? 1 : 0; draw(); if (cb) cb(); } }); }
  function glide(dur, cb, o){
    o = o || {}; halt();
    var f0 = { ci:P.ci, cu:P.cu }, f1 = frameOf(S);
    if (o.res !== false) P.res = 0;
    tw({ dur:dur, step:function(t){ P.ci = lerp(f0.ci, f1.ci, t); P.cu = lerp(f0.cu, f1.cu, t); draw(); }, done:function(){ P.ci = f1.ci; P.cu = f1.cu; if (o.res === false) pulse(cb); else result(cb); } });
  }
  function result(cb){ P.res = 0; draw(); later(300, function(){ tw({ dur:600, step:function(t){ P.res = t; draw(); }, done:function(){ P.res = 1; pulse(cb); } }); }); }
  function pulse(cb){ tw({ dur:400, ease:function(t){ return t; }, step:function(t){ P.ring = Math.sin(Math.PI * t); draw(); }, done:function(){ P.ring = 0; draw(); if (cb) cb(); } }); }
  function flash(k){ var el = Lo.read.querySelector('[data-row="' + k + '"]'); if (!el) return; el.classList.remove("sr-flash"); void el.offsetWidth; el.classList.add("sr-flash"); setTimeout(function(){ el.classList.remove("sr-flash"); }, 1400); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "sr-pairs") { user(); pairsTo(!S.pairs); MV.changed(); }
    else if (b.id === "sr-reset") { user(); Object.keys(SR0).forEach(function(k){ S[k] = SR0[k]; }); P.pairs = 0; P.oldB = 10; api.save(); refresh(); snapDisplay(); draw(); MV.changed(); }
  });

  // ----- dragging on the rule, and arrow keys on the focused canvas -----
  var Y = { c0:42, b:92, d1:142 };
  function nearestU(list, u){ var g = G(), best = list[0], bd = Infinity; list.forEach(function(v){ var d = Math.abs(g.p(v) - u); if (d < bd) { bd = d; best = v; } }); return best; }
  cv.addEventListener("pointerdown", function(e){
    var r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top, g = G();
    if (py > Y.d1 + 14) return;
    var which = Math.abs(px - g.X(P.cu)) <= 16 ? "cur" : (py >= Y.c0 - 6 && py <= Y.b + 2 ? "c" : null);
    if (!which) return;
    e.preventDefault(); user(); P.res = 1; P.ci = frameOf(S).ci; P.cu = frameOf(S).cu;
    drag = { which:which, off:which === "c" ? g.X(P.ci) - px : g.X(P.cu) - px };
    try { cv.setPointerCapture(e.pointerId); } catch (err) {}
    cv.focus({ preventScroll:true });
  });
  cv.addEventListener("pointermove", function(e){
    if (!drag) return;
    var r = cv.getBoundingClientRect(), g = G(), u = g.U(e.clientX - r.left + drag.off), Ls = LIST[S.rul][S.op], pa = Ls.a.map(g.p), pb = Ls.b.map(g.p);
    var amin = pa[0], amax = pa[pa.length - 1], bmin = pb[0], bmax = pb[pb.length - 1];
    if (S.op === "mul") {
      if (drag.which === "c") { P.ci = clamp(u, amin, amax); P.cu = P.ci + g.p(S.y); S.x = nearestU(Ls.a, P.ci); S.last = "a"; }
      else { P.cu = clamp(u, P.ci + bmin, P.ci + bmax); S.y = nearestU(Ls.b, P.cu - P.ci); S.last = "b"; }
    } else {
      if (drag.which === "cur") { P.cu = clamp(u, amin, amax); P.ci = P.cu - g.p(S.y); S.z = nearestU(Ls.a, P.cu); S.last = "a"; }
      else { P.ci = clamp(u, P.cu - bmax, P.cu - bmin); S.y = nearestU(Ls.b, P.cu - P.ci); S.last = "b"; }
    }
    refresh(); draw(); MV.changed();
  });
  function endDrag(){ if (!drag) return; drag = null; api.save(); glide(150, null, { res:false }); MV.changed(); }
  cv.addEventListener("pointerup", endDrag); cv.addEventListener("pointercancel", endDrag);
  cv.addEventListener("keydown", function(e){
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault(); SL[S.last === "a" ? "a" : "b"].step(e.key === "ArrowRight" ? 1 : -1, e.shiftKey);
  });

  // ----- readout -----
  function rows(){
    var L = S.rul === "log", mul = S.op === "mul", b = S.b, x = S.x, y = S.y, z = S.z, A = answer(S), c0 = L ? "1" : "0", R = [];
    R.push(["rul", "Rulers", L ? "Log rulers: the distance from 1 to any number is its logarithm." : "Ordinary rulers: the distance from 0 to any number is the number itself."]);
    R.push(["set", "Setting", mul ? "C’s " + c0 + " is above D’s " + vt(x) + ". The cursor is on C’s " + vt(y) + "." : "The cursor is on D’s " + vt(z) + ", with C’s " + vt(y) + " under it. C’s " + c0 + " is above D’s " + vt(A) + "."]);
    var where = mul ? "under the cursor" : "under C’s " + c0, marks = L ? DLOG : DORDS, d3 = dec3(A), ans;
    if (onList(A, marks)) ans = "D reads <strong>" + num(A) + "</strong> " + where + ".";
    else if (d3 != null) {
      var lo = marks.filter(function(v){ return v < A; }).pop(), hi = marks.filter(function(v){ return v > A; })[0];
      ans = "D reads <strong>" + d3 + "</strong> " + where + (lo != null && hi != null ? " (between the " + num(lo) + " and " + num(hi) + " marks)" : "") + ".";
    } else ans = "D reads <strong>≈ " + num(A, 3) + "</strong> " + where + " (exactly " + m(fracOf(A, 400) || num(A, 3)) + ").";
    R.push(["ans", "Answer", ans]);
    var opS = mul ? (L ? " × " : " + ") : (L ? " ÷ " : " - "), first = mul ? x : z, numS = vt0(first) + opS + vt0(y) + (d3 != null ? " = " + d3 : " ≈ " + num(A, 3));
    R.push(["num", "Numbers", m(numS) + (!L && !mul && A < 0 ? ": the answer bar points left, past 0." : "")]);
    R.push(["len", "Lengths", L ? m(lname(first, b, true) + (mul ? " + " : " - ") + lname(y, b, true) + " = " + lname(A, b, true)) : "Each length is the number itself."]);
    if (L) {
      var la = logb(first, b), lb = logb(y, b), lt = logb(A, b), r3 = function(v){ return Math.round(parseFloat(f3(v).replace(MINUS, "-")) * 1000); };
      var same = (mul ? r3(la) + r3(lb) : r3(la) - r3(lb)) === r3(lt) || (isInt(la) && isInt(lb) && isInt(lt));
      R.push(["val", "Length values", m(fv3(la) + (mul ? " + " : " - ") + fv3(lb) + (same ? " = " : " ≈ ") + fv3(lt)) + (same ? "" : " (each value is rounded, so the last digit may not add up)")]);
      var bs = "@b{" + b + "}", whole = isInt(la) && isInt(lb) && isInt(lt);
      R.push(["pow", "As powers", m(bs + "^{" + fv3(la) + "}" + (mul ? " × " : " ÷ ") + bs + "^{" + fv3(lb) + "} " + (whole ? "=" : "≈") + " " + bs + "^{" + fv3(lt) + "}")]);
    }
    var cmp;
    if (L) cmp = "Ordinary rulers set the same way would show " + m(vt0(first) + (mul ? " + " : " - ") + vt0(y) + " = " + vt0(mul ? first + y : first - y)) + ".";
    else if ((mul ? x === 0 : z === 0) || y === 0) cmp = "Log rulers have no 0: " + m("log 0") + " is undefined, because no power of 10 equals 0.";
    else if (y < 1) cmp = "The log C scale starts at 1, so there’s no matching log setting.";
    else { var q = mul ? first * y : first / y, q3 = dec3(q); cmp = "Log rulers set the same way would show " + m(vt0(first) + (mul ? " × " : " ÷ ") + vt0(y) + (q3 != null ? " = " + q3 : " ≈ " + num(q, 3))) + "."; }
    R.push(["cmp", "Compare", cmp]);
    if (L) {
      var subj = [];
      if (mul && x < 1) subj.push("blue bar"); if (!mul && z < 1) subj.push("ink bar");
      if (A < 1) subj.push("answer bar");
      if (subj.length) R.push(["neg", "Negative length", "The " + subj.join(" and the ") + (subj.length > 1 ? " point" : " points") + " left: numbers between 0 and 1 have negative logs."]);
    }
    return R;
  }
  function refresh(){
    var R = rows();
    Lo.read.innerHTML = R.map(function(r){ return '<div data-row="' + r[0] + '"><dt>' + r[1] + "</dt><dd>" + r[2] + "</dd></div>"; }).join("");
    var nr = R.filter(function(r){ return r[0] === "num"; })[0];
    Lo.cap.innerHTML = nr[2].split(":")[0];
    rulR.set(S.rul); opR.refresh(); opR.set(S.op); unR.set(String(S.b)); unR.lock(S.rul !== "log");
    sa.paint(); sb.paint();
    var pb = $("#sr-pairs", host); pb.setAttribute("aria-pressed", String(!!S.pairs)); pb.disabled = S.op !== "mul"; pb.classList.toggle("on", !!S.pairs);
  }
  function describe(){
    var L = S.rul === "log", mul = S.op === "mul", A = answer(S), first = mul ? S.x : S.z;
    var nm = function(v){ return L ? say(m(lname(v, S.b, false))) : vt(v); };
    var s = (L ? "Slide rule" : "Ordinary rulers") + (mul ? "" : " in " + (L ? "Divide" : "Subtract") + " mode") + ". ";
    s += mul ? "C’s " + (L ? 1 : 0) + " is above D’s " + vt(S.x) + ". The cursor is on C’s " + vt(S.y) + ", over D’s " + vt(A) + ". " : "The cursor is on D’s " + vt(S.z) + " with C’s " + vt(S.y) + " under it; C’s " + (L ? 1 : 0) + " is above D’s " + vt(A) + ". ";
    return s + "Lengths: " + nm(first) + (mul ? " plus " : " minus ") + nm(S.y) + " equals " + nm(A) + ".";
  }

  // ----- drawing -----
  function dTicks(g, ph){
    var list = g.L ? DLOG : (g.op === "div" ? DORDS : DORD), out = {}, s = g.X(1) - g.X(0), step = s >= 24 ? 1 : s * 2 >= 22 ? 2 : 5;
    list.forEach(function(v){
      var major = g.L ? labLog(v) : isInt(v), lab = g.L ? (ph ? phoneLog(v) : major) : major && (v < 0 ? (v === -5 || v === -10) : v % step === 0);
      out[key(v)] = { v:v, X:g.X(g.p(v)), major:major, lab:lab, faint:v < 0 };
    });
    return out;
  }
  function cTicks(g, ci, ph){
    var list = g.L ? CLOG : CORD, out = {}, s = g.X(1) - g.X(0), step = s >= 24 ? 1 : s * 2 >= 22 ? 2 : 5;
    list.forEach(function(v){
      var major = isInt(v), lab = g.L ? (ph ? [1, 2, 3, 5, 10].indexOf(v) >= 0 : major) : major && v % step === 0;
      out[key(v)] = { v:v, X:g.X(ci + g.p(v)), major:major, lab:lab };
    });
    return out;
  }
  function merge(A, B, t){
    var out = [];
    Object.keys(B).forEach(function(k){ var b = B[k], a = A[k]; out.push({ v:b.v, X:a ? lerp(a.X, b.X, t) : b.X, al:a ? 1 : t, major:b.major, faint:b.faint, labAl:b.lab ? (a && a.lab ? 1 : t) : (a && a.lab ? 1 - t : 0) }); });
    Object.keys(A).forEach(function(k){ if (B[k]) return; var a = A[k]; out.push({ v:a.v, X:a.X, al:1 - t, major:a.major, faint:a.faint, labAl:a.lab ? 1 - t : 0 }); });
    return out;
  }
  // scale labels that fit: decade marks first, then 2 and 5, then 3, then the rest; a label that would overlap one already
  // placed is skipped (the tick stays)
  function prio(v, L){ if (L) { var q = Math.round(v / decade(v)); return q === 1 ? 0 : (q === 2 || q === 5) ? 1 : q === 3 ? 2 : 3; } return v % 10 === 0 ? 0 : v % 5 === 0 ? 1 : v % 2 === 0 ? 2 : 3; }
  function fit(ctx, ticks, Wd, L){
    ctx.font = "400 12px " + (css("--font-ui") || "sans-serif");
    var placed = [], out = [];
    ticks.filter(function(k){ return k.labAl > 0 && k.X > -10 && k.X < Wd + 10; }).sort(function(a, b){ return prio(Math.abs(a.v), L) - prio(Math.abs(b.v), L) || a.X - b.X; }).forEach(function(k){
      var w = ctx.measureText(num(k.v)).width + 6, l = k.X - w / 2, r = k.X + w / 2;
      if (placed.some(function(p){ return l < p[1] && r > p[0]; })) return;
      placed.push([l, r]); out.push(k);
    });
    return out;
  }
  function draw(){ plot.draw({ grid:false, axes:false, describe:describe(), after:paint }); }
  plot.render = draw;
  function paint(ctx){
    var Wd = plot.W, ph = Wd < 520, g1 = G(), sw = P.sw, t = sw ? sw.t : 1, g0 = sw ? sw.g0 : g1;
    var K = { ink:css("--ink"), ink2:css("--ink-2"), paper:css("--paper"), rule:css("--rule"), pen:css("--pen"), f3:css("--f3"), hi:css("--hi"), his:css("--hi-soft"), pb:css("--p-b"), sheet:css("--sheet") };
    var f1 = { ci:P.ci, cu:P.cu }, f0 = sw ? sw.f0 : f1, dark = MV.effectiveTheme() === "dark", ov = P.ov || {};
    var yC0 = Y.c0, yB = Y.b, yD1 = Y.d1;
    // D body
    var dl = lerp(g0.X(g0.u0), g1.X(g1.u0), t) - 8, dr = lerp(g0.X(g0.u1), g1.X(g1.u1), t) + 8;
    ctx.save(); ctx.fillStyle = K.paper; ctx.strokeStyle = K.rule; ctx.lineWidth = 1.2; ctx.fillRect(dl, yB, dr - dl, yD1 - yB); ctx.strokeRect(dl, yB, dr - dl, yD1 - yB); ctx.restore();
    var x0neg = !g1.L && g1.u0 < 0 ? g1.X(0) : null;
    if (x0neg != null) { ctx.save(); ctx.globalAlpha = 0.55 * t; ctx.fillStyle = K.sheet; ctx.fillRect(dl + 1, yB + 1, x0neg - dl - 1, yD1 - yB - 2); ctx.restore(); }
    // C body
    var cOf = function(g, ci, v){ return g.X(ci + g.p(v)); }, cl0 = g1.L ? 1 : 0;
    var cl = lerp(cOf(g0, f0.ci, g0.L ? 1 : 0), cOf(g1, f1.ci, cl0), t) - 8, cr = lerp(cOf(g0, f0.ci, 10), cOf(g1, f1.ci, 10), t) + 8;
    var cA = ov.dimC ? 0.3 : 1;
    ctx.save(); ctx.globalAlpha = cA; ctx.fillStyle = K.sheet; ctx.strokeStyle = K.ink2; ctx.lineWidth = 1.2; ctx.fillRect(cl, yC0, cr - cl, yB - yC0); ctx.strokeRect(cl, yC0, cr - cl, yB - yC0); ctx.restore();
    uiText(ctx, "C", 7, yC0 + 10, { size:11, weight:700, alpha:cA }); uiText(ctx, "D", 7, yD1 - 9, { size:11, weight:700 });
    // ticks
    var dT = merge(sw ? dTicks(g0, ph) : {}, dTicks(g1, ph), t), cT = merge(sw ? cTicks(g0, f0.ci, ph) : {}, cTicks(g1, f1.ci, ph), t);
    if (!sw) { dT.forEach(function(k){ k.al = 1; k.labAl = k.labAl ? 1 : 0; }); cT.forEach(function(k){ k.al = 1; k.labAl = k.labAl ? 1 : 0; }); }
    dT.forEach(function(k){
      if (k.X < -4 || k.X > Wd + 4 || k.al <= 0) return;
      vline(ctx, k.X, yB, yB + (k.major ? 14 : 7), K.ink2, k.major ? 1.4 : 1, null, k.al * (k.faint ? 0.5 : 1));
    });
    fit(ctx, dT, Wd, g1.L).forEach(function(k){ uiText(ctx, num(k.v), k.X, yB + 24, { size:12, color:K.ink, alpha:k.labAl * (k.faint ? 0.6 : 1) }); });
    cT.forEach(function(k){
      if (k.X < -4 || k.X > Wd + 4 || k.al <= 0) return;
      vline(ctx, k.X, yB, yB - (k.major ? 14 : 7), K.ink2, k.major ? 1.4 : 1, null, k.al * cA);
    });
    fit(ctx, cT, Wd, g1.L).forEach(function(k){
      uiText(ctx, num(k.v), k.X, yB - 23, { size:12, color:K.ink, alpha:k.labAl * cA });
      if (near(k.v, g1.L ? 1 : 0)) uiText(ctx, "index", k.X, yB - 36, { size:10, alpha:k.labAl * cA });
    });
    // brown markers at the powers of the base (log rulers)
    var mk = function(g, b, a, sc){ if (!g.L) return; powersOf(b).forEach(function(q){ var X = g.X(lg(q.v)); diamond(ctx, X, yD1 - 6, 5 * sc, K.pb, a); }); };
    if (sw) { mk(g0, sw.st0.b, 1 - t, 1); mk(g1, S.b, t, 1); }
    else if (P.unitT < 1) { mk(g1, P.oldB, 1 - P.unitT, 1); mk(g1, S.b, 1, P.unitT); }
    else mk(g1, S.b, 1, 1);
    // show every pair (Multiply)
    if (S.op === "mul" && P.pairs > 0 && !sw) {
      var ks = g1.L ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], n = ks.length, lastR = -1e9, pw = g1.L ? powersOf(S.b) : [];
      ks.forEach(function(k, i){
        var Dv = g1.L ? rd(S.x * k) : S.x + k; if (Dv > (g1.L ? 100 : 20) + 1e-9) return;
        var a = clamp(P.pairs * (n + 1) - i, 0, 1); if (a <= 0) return;
        var X = g1.X(f1.ci + g1.p(k)), thick = pw.some(function(q){ return near(q.v, Dv, 1e-7); });
        vline(ctx, X, yB - 16, yD1 + 4, K.ink2, thick ? 2.6 : 1.2, [3, 3], 0.75 * a);
        var s = vt0(Dv), w = s.length * 6.5 + 6;
        if (X - w / 2 > lastR + 2) { uiText(ctx, s, X, yD1 + 15, { size:11, color:K.ink, weight:thick ? 700 : 400, alpha:a }); lastR = X + w / 2; }
      });
    }
    // P1 brackets (equal ratios make equal gaps)
    (ov.br || []).forEach(function(br, i){
      var xa = g1.X(br.a), xb = g1.X(br.b), y = yD1 + 9 - 14 * (br.lift || 0);
      ctx.save(); ctx.strokeStyle = K.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(xa, y - 5); ctx.lineTo(xa, y); ctx.lineTo(xb, y); ctx.lineTo(xb, y - 5); ctx.stroke(); ctx.restore();
      var full = xb - xa > 96, lbl = full ? "log 2 ≈ 0.301" : "≈ 0.301";
      if (!br.lift) clab(ctx, Wd, lbl, (xa + xb) / 2, y + 12 + (i % 2) * 14, { size:12 });
    });
    // cursor
    var Xc = lerp(g0.X(f0.cu), g1.X(f1.cu), t);
    ctx.save(); ctx.fillStyle = K.his; ctx.fillRect(Xc - 12, yC0 - 22, 24, yD1 - yC0 + 28); if (dark) { ctx.strokeStyle = K.hi; ctx.lineWidth = 1; ctx.strokeRect(Xc - 12, yC0 - 22, 24, yD1 - yC0 + 28); } ctx.restore();
    vline(ctx, Xc, yC0 - 22, yD1 + 6, K.ink, 1.5);
    if (!sw && !ov.br) {
      clab(ctx, Wd, "C " + vt0(S.y), Xc, yC0 - 21, { size:11 });
      var Dc = S.op === "mul" ? answer(S) : S.z;
      clab(ctx, Wd, "D " + vt0(Dc), Xc, yD1 + (S.pairs && S.op === "mul" ? 30 : 16), { size:11 });
    }
    // strip
    var sTop = yD1 + 40;
    if (ov.ord > 0) paintOrdOverlay(ctx, g1, sTop, K, ov.ord);
    var stripA = ov.dimC ? 0.25 : 1;
    if (sw) { if (t < 0.5) paintStrip(ctx, g0, f0, sw.st0, (1 - 2 * t) * stripA, ph, K, sTop); else paintStrip(ctx, g1, f1, S, (2 * t - 1) * stripA, ph, K, sTop); }
    else paintStrip(ctx, g1, f1, S, stripA * (1 - (ov.ord || 0)), ph, K, sTop);
    // result guide and ring on D
    if (!sw && P.res >= 1 && !ov.dimC) {
      var ansU = S.op === "mul" ? f1.cu : f1.ci, Xa = g1.X(ansU);
      vline(ctx, Xa, sTop + 70, yB, K.ink2, 1.2, [2, 4], 0.8);
      ring(ctx, Xa, yB, 8 + 5 * P.ring, K.hi, 3);
    }
  }
  function paintStrip(ctx, g, f, st, alpha, ph, K, sTop){
    if (alpha <= 0.01) return;
    var Wd = plot.W, L = g.L, mul = st.op === "mul", b = st.b, row1 = sTop + 24, row2 = row1 + 48, yA = row2 + 36;
    // axis
    hline(ctx, g.X(g.u0), g.X(g.u1), yA, K.ink2, 1.4, alpha);
    if (L) {
      var axisFor = function(bb, a){ var ub = lg(bb); for (var k = Math.ceil(-1 / ub - 1e-9); k <= Math.floor(2 / ub + 1e-9); k++) { var X = g.X(k * ub); vline(ctx, X, yA, yA + (k === 0 ? 9 : 6), K.ink2, k === 0 ? 2 : 1.2, null, a); uiText(ctx, num(k), X, yA + 16, { size:12, color:K.ink, alpha:a }); } };
      if (P.unitT < 1 && st === S) { axisFor(P.oldB, alpha * (1 - P.unitT)); axisFor(b, alpha * P.unitT); } else axisFor(b, alpha);
      var unitS = b === 10 ? "log" : "log_" + b, cw = cmath(ctx, "Length units: " + unitS, 0, 0, { size:12, measure:true, weight:400 });
      cmath(ctx, "Length units: ", Wd / 2 - cw / 2, yA + 33, { size:12, weight:400, color:K.ink2, bg:false, alpha:alpha });
      cmath(ctx, unitS, Wd / 2 - cw / 2 + cmath(ctx, "Length units: ", 0, 0, { size:12, measure:true, weight:400 }), yA + 33, { size:12, weight:700, color:K.pb, bg:false, alpha:alpha });
    } else {
      var s = g.X(1) - g.X(0), step = s >= 24 ? 1 : s * 2 >= 22 ? 2 : 5;
      for (var v = g.u0; v <= g.u1; v++) { var Xo = g.X(v), fa = v < 0 ? 0.5 : 1; vline(ctx, Xo, yA, yA + (v === 0 ? 9 : 5), K.ink2, v === 0 ? 2 : 1, null, alpha * fa); if (v < 0 ? (v === -5 || v === -10) : v % step === 0) uiText(ctx, num(v), Xo, yA + 16, { size:12, color:K.ink, alpha:alpha * fa }); }
      uiText(ctx, "Lengths are the numbers themselves", Wd / 2, yA + 33, { size:12, alpha:alpha });
    }
    // bars
    var x = st.x, y = st.y, z = st.z, A = answer(st), lab = function(v){ if (!L) return vt0(v).replace("-", MINUS); var l = logb(v, b); return lname(v, b, false) + " " + approx(l); };
    var bars1, bar2;
    if (mul) { bars1 = [{ a:0, b:f.ci, col:K.pen, t:lab(x) }, { a:f.ci, b:f.cu, col:K.f3, t:lab(y) }]; bar2 = { a:0, b:f.cu, col:K.ink, w:16, t:lab(A) }; }
    else { bars1 = [{ a:0, b:f.cu, col:K.ink, t:lab(z) }, { a:f.cu, b:f.ci, col:K.f3, t:lab(y) }]; bar2 = { a:0, b:f.ci, col:K.pen, w:14, t:lab(A) }; }
    bars1.forEach(function(br){ sbar(ctx, g.X(br.a), g.X(br.b), row1, { color:br.col, w:12, alpha:alpha }); });
    var res = st === S ? P.res : 1;
    if (res > 0) sbar(ctx, g.X(bar2.a), g.X(lerp(bar2.a, bar2.b, res)), row2, { color:bar2.col, w:bar2.w, alpha:alpha });
    // labels: first bar above; second above unless it would overlap, then below the row
    var l1 = bars1[0], l2 = bars1[1], c1 = (g.X(l1.a) + g.X(l1.b)) / 2, c2 = (g.X(l2.a) + g.X(l2.b)) / 2;
    var w1 = cmath(ctx, l1.t, 0, 0, { size:12, measure:true }), w2 = cmath(ctx, l2.t, 0, 0, { size:12, measure:true });
    var p1 = clab(ctx, Wd, l1.t, c1, row1 - 17, { size:12, color:l1.col, alpha:alpha }), c2c = clamp(c2, w2 / 2 + 4, Wd - w2 / 2 - 4);
    var clash = Math.abs(c2c - p1.x) < (w1 + w2) / 2 + 8;
    clab(ctx, Wd, l2.t, c2, clash ? row1 + 18 : row1 - 17, { size:12, color:l2.col, alpha:alpha });
    if (res >= 1) clab(ctx, Wd, bar2.t, (g.X(bar2.a) + g.X(bar2.b)) / 2, row2 + 19, { size:12, color:bar2.col, alpha:alpha });
  }
  function paintOrdOverlay(ctx, g, sTop, K, a){
    var Wd = plot.W, x0 = g.X(-1), x1 = g.X(2), X = function(v){ return x0 + v / 16 * (x1 - x0); }, y = sTop + 40;
    ctx.save(); ctx.globalAlpha = 0.9 * a; ctx.fillStyle = K.paper; ctx.fillRect(x0 - 10, y - 32, x1 - x0 + 20, 92); ctx.restore();
    uiText(ctx, "An ordinary ruler, for comparison", Wd / 2, y - 22, { size:12, weight:700, alpha:a });
    hline(ctx, X(0), X(16), y, K.ink2, 1.5, a);
    for (var v = 0; v <= 16; v++) { vline(ctx, X(v), y, y + ([0, 1, 2, 4, 8, 16].indexOf(v) >= 0 ? 9 : 5), K.ink2, 1.2, null, a); if ([0, 1, 2, 4, 8, 16].indexOf(v) >= 0) uiText(ctx, String(v), X(v), y + 18, { size:11, color:K.ink, alpha:a }); }
    [[1, 2, "1 to 2"], [4, 8, "4 to 8: four times as long"]].forEach(function(q){
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = K.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(q[0]), y - 4); ctx.lineTo(X(q[0]), y - 9); ctx.lineTo(X(q[1]), y - 9); ctx.lineTo(X(q[1]), y - 4); ctx.stroke(); ctx.restore();
      clab(ctx, Wd, q[2], (X(q[0]) + X(q[1])) / 2, y + 36, { size:11, alpha:a });
    });
  }

  // ----- challenges -----
  function no(msg){ return { ok:false, msg:msg }; }
  function chal(id){
    var L = S.rul === "log", mul = S.op === "mul", x = S.x, y = S.y, z = S.z;
    if (id === "tc1") {
      if (!L || !mul) return no("Use log rulers in Multiply mode for this one.");
      if (S.b !== 10) return no("Switch the units to base 10 first: how long “1 unit” is depends on the base.");
      var p = rd(x * y);
      if (near(p, 10) && !near(x, 1) && !near(y, 1)) return { ok:true };
      if (near(x + y, 10) && !near(p, 10)) return no("Your numbers add to 10, but the lengths add to " + m(lname(p, 10) + " " + approx(lg(p))) + ". Adding lengths multiplies the numbers: you need a <strong>product</strong> of 10.");
      if (near(p, 10)) return no("That lands on 10, but one of your lengths is " + m("log 1 = 0") + ". Use two lengths that aren’t 0.");
      return no("The total is " + m(lname(p, 10) + " " + approx(lg(p))) + ". For exactly 1 unit, D must read " + m("10^1 = 10") + ".");
    }
    if (id === "tc2") {
      if (!L || mul) return no("Use log rulers in Divide mode for this one.");
      var q = z / y, bad = function(v){ return near(v, 1) || near(v, 2); };
      if (near(q, 0.5) && !bad(z) && !bad(y)) return { ok:true };
      if (near(q, 2)) return no("Your answer is " + m(lname(z, 10) + " - " + lname(y, 10) + " = log 2") + ": the right size, but it points right. The dividend must be half the divisor, not double it: for example, " + m("log 3 - log 6 = log(1/2) = -log 2") + ".");
      if (near(q, 0.5)) return no("Right quotient, but this one uses 1 or 2. Try a pair such as 3 and 6.");
      if (near(y - z, 2)) return no("Your numbers differ by 2, but subtracting logs divides the numbers: " + m(lname(z, 10) + " - " + lname(y, 10) + " = " + lname(q, 10) + " " + approx(lg(q))) + ". The dividend must be <strong>half</strong> the divisor.");
      return no("The answer bar is " + m(lname(q, 10) + " " + approx(lg(q))) + ". For " + m("-log 2") + ", the quotient must be 1/2.");
    }
    if (id === "tc3") {
      if (!L || !mul) return no("Use log rulers in Multiply mode for this one.");
      if (S.b !== 3) return no("Switch the units to base 3 first.");
      var p3 = rd(x * y), pw = function(v){ return [1 / 9, 1 / 3, 1, 3, 9].some(function(w){ return near(v, w, 1e-7); }); };
      if (near(p3, 9) && !pw(x) && !pw(y)) return { ok:true };
      if (near(p3, 9)) { var pv = pw(x) ? x : y; return no("That lands on exactly 2 units, but " + m("log_3 " + vt0(pv) + " = " + num(Math.round(logb(pv, 3)))) + " is a whole number of units. Find a pair with no power of 3."); }
      if (near(x + y, 9)) return no("Your numbers add to 9, but the lengths add to " + m(lname(p3, 3) + " " + approx(logb(p3, 3))) + ". Adding lengths multiplies the numbers.");
      if (near(p3, 6)) return no("Your product is 6 = 2 × 3. Two units in base 3 means " + m("3^2") + ", which is 9.");
      return no("The total is " + m(lname(p3, 3) + " " + approx(logb(p3, 3))) + ". For exactly 2 units, D must read " + m("3^2 = 9") + ".");
    }
    return { ok:false };
  }

  // ----- predictions -----
  function fin(){ if (pending) { var d = pending; pending = null; d(); } }
  var runs = {
    p1:function(){
      var br = P.ov.br;
      (function copyB(i){
        if (i > 3) {
          P.ov.ord = 0;
          tw({ dur:300, step:function(t){ P.ov.ord = t; draw(); }, done:function(){ later(2000, function(){ tw({ dur:300, step:function(t){ P.ov.ord = 1 - t; draw(); }, done:function(){ P.ov.ord = 0; draw(); fin(); } }); }); } });
          return;
        }
        var from = { a:lg(Math.pow(2, i - 1)), b:lg(Math.pow(2, i)) }, to = { a:lg(Math.pow(2, i)), b:lg(Math.pow(2, i + 1)) }, nb = { a:from.a, b:from.b, lift:0 };
        br.push(nb);
        tw({ dur:600, step:function(t){ nb.a = lerp(from.a, to.a, t); nb.b = lerp(from.b, to.b, t); nb.lift = Math.sin(Math.PI * t); draw(); }, done:function(){ nb.a = to.a; nb.b = to.b; nb.lift = 0; draw(); copyB(i + 1); } });
      })(1);
    },
    p2:function(){
      S.x = 2; S.last = "a"; api.save(); refresh(); MV.changed();
      glide(800, function(){ pairsTo(true, function(){ later(600, function(){ switchRulers("ord", function(){ later(2000, function(){ switchRulers("log", fin); }); }); }); }); });
    },
    p3:function(){ S.y = 3; S.last = "b"; api.save(); refresh(); MV.changed(); glide(800, fin); },
    p4:function(){ S.y = 8; S.last = "b"; api.save(); refresh(); MV.changed(); glide(500, function(){ flash("pow"); later(500, fin); }); }
  };

  refresh(); snapDisplay(); draw();
  return {
    predict:{
      start:function(p){
        fin(); halt(); P.ov = {};
        Object.keys(SR0).forEach(function(k){ S[k] = SR0[k]; }); Object.keys(p.start || {}).forEach(function(k){ S[k] = p.start[k]; });
        P.pairs = 0; P.oldB = S.b;
        if (p.id === "p1") P.ov = { dimC:true, br:[{ a:0, b:lg(2), lift:0 }] };
        api.save(); refresh(); snapDisplay(); draw(); MV.changed();
      },
      run:function(p, done){ pending = done; if (runs[p.id]) runs[p.id](); else fin(); }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: law or impostor? The log law clinic ----------
// @component claimTester — a claimed identity in one or two inputs: steppers over test values, both sides evaluated (exact
// when tidy), a test log (N14), Bars view (length strip) and Graphs view (both sides as curves of x with y fixed, crossings
// ringed), counterexample / lucky-pair tracking
var TV = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 16];
function l2(v){ return Math.log(v) / Math.LN2; }
function F2(v){ return fracOf(v, 2); }
function A2(v){ return isInt(v) ? " " + num(v) : "(" + F2(v) + ")"; }
function LG(v){ return "log_2" + A2(v); }
function PW(v){ return isInt(v) ? num(v) : "(" + F2(v) + ")"; }
var CL = {
  c1:{ L:function(x, y){ return l2(x + y); }, R:function(x, y){ return l2(x) + l2(y); }, Ls:function(x, y){ return "log_2(" + F2(x) + " + " + F2(y) + ")"; }, Rs:function(x, y){ return LG(x) + " + " + LG(y); }, where:function(y){ return y > 1 + 1e-9 ? y / (y - 1) : null; } },
  c2:{ L:function(x, y){ return l2(x / y); }, R:function(x, y){ return l2(x) - l2(y); }, Ls:function(x, y){ return "log_2(" + F2(x) + " ÷ " + F2(y) + ")"; }, Rs:function(x, y){ return LG(x) + " - " + LG(y); }, same:true },
  c3:{ L:function(x, y){ return l2(x * y); }, R:function(x, y){ return l2(x) * l2(y); }, Ls:function(x, y){ return "log_2(" + F2(x) + " × " + F2(y) + ")"; }, Rs:function(x, y){ return LG(x) + " · " + LG(y); }, where:function(y){ var a = l2(y); return near(a, 1) ? "par" : Math.pow(2, a / (a - 1)); } },
  c4:{ L:function(x, y){ return l2(x * x * y); }, R:function(x, y){ return 2 * l2(x) + l2(y); }, Ls:function(x, y){ return "log_2(" + PW(x) + "^2 × " + F2(y) + ")"; }, Rs:function(x, y){ return "2 " + LG(x) + " + " + LG(y); }, same:true },
  c5:{ L:function(x, y){ return l2(x / y); }, R:function(x, y){ return near(y, 1) ? NaN : l2(x) / l2(y); }, Ls:function(x, y){ return "log_2(" + F2(x) + " ÷ " + F2(y) + ")"; }, Rs:function(x, y){ return LG(x) + " ÷ " + LG(y); }, where:function(y){ if (near(y, 1)) return "undef"; var a = l2(y); return near(a, 1) ? "par" : Math.pow(2, a * a / (a - 1)); } },
  c6:{ L:function(x){ return l2(2 * x); }, R:function(x){ return 2 * l2(x); }, Ls:function(x){ return "log_2(2 × " + F2(x) + ")"; }, Rs:function(x){ return "2 " + LG(x); }, where:function(){ return 2; }, one:true }
};
function sideTxt(v){ if (!isFinite(v)) return "undefined"; var f = fracOf(v, 12); return f != null ? f : "≈ " + f3(v); }
function sig3(v){ return num(Number(v.toPrecision(3)), 3); }
function whereTxt(c, y){
  if (c.same) return "At every `x`: the two sides are the same curve";
  var w = c.where(y);
  if (w === "undef") return "The right side is undefined for `y = 1`, because `log_2 1 = 0` and you can’t divide by 0";
  if (w === "par") return "Nowhere: the curves are parallel";
  if (w == null) return "Nowhere";
  if (w > 20) return "At `x ≈ " + sig3(w) + "`, outside this window";
  var fr = fracOf(w, 20); return "Only at `x " + (fr ? "= " + fr : "≈ " + sig3(w)) + "`";
}
function clinic(host, api){
  var C = api.content, U = C.ui, S = api.S, IDS = C.cases.map(function(c){ return c.id; });
  if (!S.cur || IDS.indexOf(S.cur) < 0) S.cur = "c1";
  if (S.xi == null) S.xi = 3; if (S.yi == null) S.yi = 4; if (!S.view) S.view = "bars"; if (!S.cs) S.cs = {};
  var algOpen = {}, msg = null;
  function caseOf(id){ return C.cases.filter(function(c){ return c.id === id; })[0]; }
  function cs(id){ return S.cs[id] || (S.cs[id] = { diag:null, tests:[], hint:0, q:{ tries:0, last:null, done:false, first:null } }); }
  function isLaw(c){ return MV.ans(c) === "law"; }
  function status(id){
    var c = CL[id], st = cs(id), counter = false, lucky = false, seen = {};
    st.tests.forEach(function(t){ var Lv = c.L(t.x, t.y), Rv = c.R(t.x, t.y); seen[t.x + "|" + (c.one ? "" : t.y)] = 1; if (!isFinite(Rv) || !near(Lv, Rv)) counter = true; else lucky = true; });
    var n = Object.keys(seen).length, law = isLaw(caseOf(id));
    return { counter:counter, lucky:lucky, n:n, done:law ? n >= 3 : counter && lucky };
  }
  host.innerHTML = '<p class="tiny muted cl-note">' + C.note + '</p><div class="cl-tabs" role="group" aria-label="Cases"></div><div class="cl-claim"></div><div class="cl-diag"></div><div class="cl-goal"></div>' +
    '<div class="cl-tester"><div class="cl-view"><div class="cl-vsw"></div><div class="plot-wrap"><canvas class="plot cl-bars" role="img" aria-label="Bars view"></canvas><canvas class="plot cl-graph" role="img" aria-label="Graphs view" hidden></canvas></div>' +
    '<p class="tiny muted cl-gcap"></p><dl class="read cl-where" aria-live="polite"></dl></div>' +
    '<div class="cl-ctrl"><div class="cl-steps"></div><div class="cl-vals" aria-live="polite"></div><div class="q-actions"><button type="button" class="btn primary sm" data-act="test" data-k="cltest">Test this pair</button></div><div class="cl-msg" aria-live="polite"></div></div></div>' +
    '<div class="cl-log"><h4>Test log</h4><div class="cl-tbl"></div></div><div class="cl-verdict"></div><div class="cl-q"></div><div class="cl-after"></div>';
  var E = {}; ["tabs", "claim", "diag", "goal", "vsw", "gcap", "where", "steps", "vals", "msg", "tbl", "verdict", "q", "after"].forEach(function(k){ E[k] = host.querySelector(".cl-" + k); });
  var cvB = host.querySelector(".cl-bars"), cvG = host.querySelector(".cl-graph");
  var pB = new MV.Plot(cvB, { xmin:0, xmax:1, ymin:0, ymax:1 }), pG = new MV.Plot(cvG, { xmin:0, xmax:20, ymin:-4, ymax:8 });
  var vR = radios(E.vsw, { label:"View", value:S.view, options:[{ id:"bars", t:"Bars" }, { id:"graphs", t:"Graphs" }], onChange:function(v){ S.view = v; api.save(); paintView(); } });
  function xy(){ return { x:TV[S.xi], y:TV[S.yi] }; }
  pB.render = function(){
    var c = CL[S.cur], v = xy(), Lv = c.L(v.x, v.y), Rv = c.R(v.x, v.y), eq = isFinite(Rv) && near(Lv, Rv);
    pB.draw({ grid:false, axes:false, describe:"Bars view in units of log base 2. Left side " + sideTxt(Lv) + ", right side " + sideTxt(Rv) + (eq ? ": equal." : isFinite(Rv) ? ": not equal." : "."),
      after:function(ctx){
        var W = pB.W, H = pB.H, ph = W < 480, padL = ph ? 66 : 86, X = function(u){ return padL + (u + 4) / 12 * (W - padL - 16); };
        var yL = H * 0.25, yR = H * 0.55, yA = H * 0.8, K = { pen:css("--pen"), f3:css("--f3"), ink:css("--ink"), ink2:css("--ink-2"), his:css("--hi-soft"), hi:css("--hi") };
        hline(ctx, X(-4), X(8), yA, K.ink2, 1.4);
        for (var k = -4; k <= 8; k++) { vline(ctx, X(k), yA, yA + (k === 0 ? 9 : 5), K.ink2, k === 0 ? 2 : 1); if (!ph || k % 2 === 0) uiText(ctx, num(k), X(k), yA + 16, { size:12, color:K.ink }); }
        vline(ctx, X(0), yL - 16, yA, K.ink2, 1, [2, 4], 0.6);
        uiText(ctx, "Left side", 6, yL, { size:13, weight:700, color:K.ink, align:"left" }); uiText(ctx, "Right side", 6, yR, { size:13, weight:700, color:K.ink, align:"left" });
        cmath(ctx, "units of log_2", W - 8, Math.min(H - 8, yA + 32), { size:12, align:"right", color:K.ink2, weight:400, bg:false });
        var eL = clamp(Lv, -4, 8), eR = isFinite(Rv) ? clamp(Rv, -4, 8) : null;
        if (isFinite(Rv) && !eq) {
          var a = Math.min(X(eL), X(eR)), b = Math.max(X(eL), X(eR));
          ctx.save(); ctx.fillStyle = K.his; ctx.fillRect(a, yL - 10, b - a, yR - yL + 20); ctx.restore();
          var d = Math.abs(Lv - Rv), dt = fracOf(d, 12);
          clab(ctx, W, "difference " + (dt ? "= " + dt : "≈ " + f3(d)), (a + b) / 2, (yL + yR) / 2, { size:12, weight:700 });
        }
        function side(v, e, y, col){
          if (e == null) {
            ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.strokeRect(X(0), y - 8, X(2.6) - X(0), 16); ctx.restore();
            uiText(ctx, "undefined", (X(0) + X(2.6)) / 2, y, { size:12, weight:700, color:K.ink }); return;
          }
          sbar(ctx, X(0), X(e), y, { color:col, w:14, glow:eq });
          var s = sideTxt(v), right = v >= 0, tx = X(e) + (right ? 12 : -12);
          if (Math.abs(X(e) - X(0)) < 2) tx = X(0) + 12;
          var w = ctx.measureText ? cmath(ctx, s, 0, 0, { size:13, measure:true }) : 30;
          if (right && tx + w > W - 4) { tx = X(e) - 12; right = false; }
          if (!right && tx - w < padL) { tx = X(e) + 12; right = true; }
          cmath(ctx, s, tx, y, { size:13, align:right ? "left" : "right", color:K.ink });
        }
        side(Lv, eL, yL, K.pen); side(Rv, eR, yR, K.f3);
        if (eq) { var bx = X(eL); ctx.save(); ctx.fillStyle = K.hi; ctx.beginPath(); ctx.arc(bx, (yL + yR) / 2, 11, 0, 6.3); ctx.fill(); ctx.restore(); uiText(ctx, "=", bx, (yL + yR) / 2 + 1, { size:16, weight:700, color:css("--hi-ink") }); }
      } });
  };
  pG.render = function(){
    var c = CL[S.cur], v = xy(), K = { pen:css("--pen"), f3:css("--f3"), ink2:css("--ink-2"), hi:css("--hi") };
    var fL = function(t){ return c.L(t, v.y); }, fR = function(t){ var r = c.R(t, v.y); return isFinite(r) ? r : NaN; };
    var Lv = fL(v.x), Rv = fR(v.x), w = c.same ? null : c.where(v.y), pts = [];
    if (Lv >= -4 && Lv <= 8) pts.push({ x:v.x, y:Lv, color:K.pen, r:5 });
    if (isFinite(Rv) && Rv >= -4 && Rv <= 8) pts.push({ x:v.x, y:Rv, color:K.f3, r:5 });
    pG.draw({ view:{ xmin:0, xmax:20, ymin:-4, ymax:8 }, xTicks:{ step:2 }, yTicks:{ step:2 },
      curves:[{ f:fL, color:K.pen, width:3, domain:[0.0005, 20.5] }, { f:fR, color:K.f3, width:2.6, dash:[8, 6], domain:[0.0005, 20.5] }],
      segments:[{ x1:v.x, y1:-4, x2:v.x, y2:8, color:K.ink2, width:1.5, dash:[2, 4] }], points:pts,
      describe:"Graph of both sides of case " + S.cur.slice(1) + (c.one ? "" : " with y = " + F2(v.y)) + ". " + MV.plain(MV.md(whereTxt(c, v.y))) + ".",
      after:function(ctx, P){
        if (typeof w === "number" && w > 0 && w <= 20) {
          var yv = fL(w);
          if (yv >= -4 && yv <= 8) { ring(ctx, P.X(w), P.Y(yv), 10, K.hi, 3.5); var fr = fracOf(w, 20); clab(ctx, P.W, "x " + (fr ? "= " + fr : "≈ " + sig3(w)), P.X(w), P.Y(yv) - 24, { size:13 }); }
        }
      } });
  };
  function paintView(){
    vR.set(S.view); cvB.hidden = S.view !== "bars"; cvG.hidden = S.view !== "graphs";
    var c = CL[S.cur], v = xy();
    E.gcap.innerHTML = S.view === "graphs" ? (c.one ? "Both sides as functions of " + m("x") + "." : "Both sides as functions of " + m("x") + ", with " + m("y = " + F2(v.y)) + ".") + ' <span class="cl-key"><span class="cl-sw" style="background:var(--pen)"></span>left side, solid <span class="cl-sw cl-dash"></span>right side, dashed</span>' : "Bars in units of " + m("log_2") + ".";
    E.where.innerHTML = S.view === "graphs" ? "<div><dt>Where the sides agree</dt><dd>" + MV.md(whereTxt(c, v.y)) + "</dd></div>" : "";
    E.where.hidden = S.view !== "graphs";
    if (S.view === "bars") pB.render(); else pG.render();
  }
  function stepper(k, i){
    var lab = k === "x" ? m("x") : m("y");
    return '<div class="cl-stp"><span class="cl-stl">' + lab + '</span><button type="button" class="btn ghost cl-pm" data-st="' + k + '" data-d="-1" data-k="cl' + k + 'm" aria-label="Smaller ' + k + '"' + (i <= 0 ? " disabled" : "") + ">" + MINUS + '</button><output class="cl-sv" aria-live="polite">' + m(F2(TV[i])) + '</output><button type="button" class="btn ghost cl-pm" data-st="' + k + '" data-d="1" data-k="cl' + k + 'p" aria-label="Larger ' + k + '"' + (i >= TV.length - 1 ? " disabled" : "") + ">+</button></div>";
  }
  function optsHTML(q, st){
    var ri = MV.right(q.options);
    return '<div class="opts">' + q.options.map(function(o, i){
      var c = "opt"; if (st.done && i === ri) c += " right"; else if (st.last === i && i !== ri) c += " wrong";
      return '<button type="button" class="' + c + '" data-qi="' + i + '" data-k="clq' + i + '"' + (st.done ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + o.t + "</span></button>";
    }).join("") + "</div>";
  }
  function paint(){
    var id = S.cur, cc = caseOf(id), c = CL[id], st = cs(id), stt = status(id), law = isLaw(cc), v = xy(), n = IDS.indexOf(id) + 1;
    MV.keepFocus(E.tabs, function(){ E.tabs.innerHTML = IDS.map(function(k, i){ var s = cs(k); return '<button type="button" class="chip cl-tab' + (k === id ? " on" : "") + '" data-case="' + k + '" data-k="cltab' + k + '" aria-pressed="' + (k === id) + '">Case ' + (i + 1) + ' <span aria-hidden="true">' + (s.q.done ? "✓" : "○") + '</span><span class="vh">' + (s.q.done ? " (closed)" : "") + "</span></button>"; }).join(""); });
    E.claim.innerHTML = '<h3>Case ' + n + "</h3><p class=\"cl-cl\">" + cc.claim + "</p>";
    // stage 1: diagnose
    MV.keepFocus(E.diag, function(){
      E.diag.innerHTML = '<div class="cl-stage"><p class="cl-sh"><span class="cl-n">1</span>Diagnose</p><p>' + (c.one ? U.diagnose1 : U.diagnose) + '</p><div class="chips" role="group" aria-label="Your diagnosis">' +
        [["law", "Law"], ["imp", "Impostor"]].map(function(o){ return '<button type="button" class="chip' + (st.diag === o[0] ? " on" : "") + '" data-diag="' + o[0] + '" data-k="cld' + o[0] + '" aria-pressed="' + (st.diag === o[0]) + '"' + (st.diag ? " disabled" : "") + ">" + o[1] + "</button>"; }).join("") + "</div>" +
        (st.diag ? '<p class="tiny muted">Your diagnosis is locked in: <strong>' + (st.diag === "law" ? "Law" : "Impostor") + "</strong>. Now test it.</p>" : '<p class="tiny muted">Choose before you test. Your diagnosis locks, and then the tester unlocks.</p>') + "</div>";
    });
    // stage 2: test goals
    MV.keepFocus(E.goal, function(){
      if (!st.diag) { E.goal.innerHTML = ""; return; }
      var h = '<div class="cl-stage"><p class="cl-sh"><span class="cl-n">2</span>Test</p>';
      if (law) h += "<p>" + U.testLaw + '</p><p class="cl-prog"><span class="chip cl-pc' + (stt.n >= 3 ? " got" : "") + '">Pairs tested: ' + Math.min(3, stt.n) + " of 3 " + (stt.n >= 3 ? "✓" : "○") + "</span></p>" + (cc.tip ? '<p class="tiny muted"><strong>Test tip:</strong> ' + cc.tip + "</p>" : "");
      else {
        h += "<p>" + (c.one ? U.testImp1 : U.testImp) + '</p><p class="cl-prog"><span class="chip cl-pc' + (stt.counter ? " got" : "") + '">Counterexample ' + (stt.counter ? "✓" : "○") + '</span><span class="chip cl-pc' + (stt.lucky ? " got" : "") + '">' + (c.one ? "Lucky value " : "Lucky pair ") + (stt.lucky ? "✓" : "○") + "</span></p>";
        if (!stt.lucky) h += '<div class="q-actions">' + MV.hintBtn("clh" + id, st.hint) + "</div>" + MV.hintsHTML(cc.hints, st.hint);
      }
      E.goal.innerHTML = h + "</div>";
    });
    // tester
    MV.keepFocus(E.steps, function(){ E.steps.innerHTML = stepper("x", S.xi) + (c.one ? "" : stepper("y", S.yi)); });
    var Lv = c.L(v.x, v.y), Rv = c.R(v.x, v.y);
    E.vals.innerHTML = '<p><span class="cl-sw" style="background:var(--pen)"></span><strong>Left side:</strong> ' + m(c.Ls(v.x, v.y)) + " " + (isFinite(Lv) ? (fracOf(Lv, 12) != null ? "= " + fracOf(Lv, 12) : "≈ " + f3(Lv)) : "is undefined") + "</p>" +
      '<p><span class="cl-sw" style="background:var(--f3)"></span><strong>Right side:</strong> ' + m(c.Rs(v.x, v.y)) + " " + (isFinite(Rv) ? (fracOf(Rv, 12) != null ? "= " + fracOf(Rv, 12) : "≈ " + f3(Rv)) : "is undefined, because " + m("log_2 1 = 0")) + "</p>";
    var tb = host.querySelector('[data-act="test"]'); tb.disabled = !st.diag; tb.textContent = c.one ? "Test this value" : "Test this pair";
    E.msg.innerHTML = !st.diag ? '<p class="tiny muted">Make your diagnosis first.</p>' : msg ? '<p class="tiny">' + msg + "</p>" : "";
    // test log (newest first)
    var rowsT = st.tests.slice().reverse().map(function(t){
      var a = c.L(t.x, t.y), b = c.R(t.x, t.y), mk = !isFinite(b) ? "undefined: counterexample" : near(a, b) ? "✓" : "✗";
      return [m(F2(t.x)), c.one ? "—" : m(F2(t.y)), sideTxt(a), sideTxt(b), mk];
    });
    E.tbl.innerHTML = rowsT.length ? MV.tableHTML({ head:["`x`", "`y`", "left side", "right side", "equal?"].map(MV.md), rows:rowsT, caption:"Test log for case " + n }) : '<p class="tiny muted">No tests yet. Each pair you test adds a row here.</p>';
    // stage 3: verdict
    if (stt.done) {
      var right = st.diag === MV.ans(cc), name = st.diag === "law" ? "Law" : "Impostor", vt1 = cc.verdict.replace(/^(Law|Impostor)\./, "<strong>$1.</strong>");
      E.verdict.innerHTML = '<div class="cl-stage"><p class="cl-sh"><span class="cl-n">3</span>Verdict</p><p>' + vt1 + "</p><p>" + (right ? "Your diagnosis: " + name + " ✓" : "Your diagnosis: " + name + ". ✗ It didn’t hold up.") + '</p><details class="alg"' + (algOpen[id] ? " open" : "") + ' data-alg="' + id + '"><summary>Check it with algebra</summary><p style="margin:10px 0 0">' + cc.alg + "</p></details></div>";
      MV.keepFocus(E.q, function(){
        var q = cc.q, qs = st.q, ri = MV.right(q.options), fb = "";
        if (qs.last != null) { var o = q.options[qs.last], good = qs.last === ri; fb = '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p>' + (good ? "<strong>✓</strong> " : "<strong>✗ Not quite.</strong> ") + o.why + (good ? (qs.first ? "" : ' <span class="muted">(not first try)</span>') : " Try another answer.") + "</p></div>"; }
        E.q.innerHTML = '<div class="cl-stage"><p class="cl-sh"><span class="cl-n">4</span>' + (law ? "Use it" : "Repair") + '</p><p class="q-prompt">' + q.prompt + "</p>" + optsHTML(q, qs) + fb + "</div>";
      });
    } else { E.verdict.innerHTML = ""; E.q.innerHTML = ""; }
    var closed = IDS.filter(function(k){ return cs(k).q.done; }).length;
    E.after.innerHTML = closed === IDS.length ? '<div class="refresh"><h4>All six cases closed</h4><p>' + U.after + "</p><p><strong>Diagnosed right before testing: " + diagRight() + "/6</strong></p></div>" : "";
    paintView();
  }
  function diagRight(){ return IDS.filter(function(k){ var s = cs(k); return s.diag && s.diag === MV.ans(caseOf(k)); }).length; }
  host.addEventListener("toggle", function(e){ var d = e.target; if (d && d.dataset && d.dataset.alg) algOpen[d.dataset.alg] = d.open; }, true);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".cl-vsw")) return;
    var id = S.cur, st = cs(id), c = CL[id];
    if (b.dataset.case) { S.cur = b.dataset.case; msg = null; S.view = status(S.cur).done && isLaw(caseOf(S.cur)) ? "graphs" : "bars"; }
    else if (b.dataset.diag) { st.diag = b.dataset.diag; msg = null; }
    else if (b.dataset.st) { var k = b.dataset.st === "x" ? "xi" : "yi"; S[k] = clamp(S[k] + +b.dataset.d, 0, TV.length - 1); msg = null; }
    else if (b.dataset.act === "hint") st.hint = Math.min(3, st.hint + 1);
    else if (b.dataset.act === "test") {
      var v = xy(), dup = st.tests.some(function(t){ return t.x === v.x && (c.one || t.y === v.y); });
      if (dup) msg = "You’ve already tested this " + (c.one ? "value" : "pair") + ". Try another.";
      else {
        var before = status(id);
        st.tests.push({ x:v.x, y:v.y }); msg = null;
        var after = status(id);
        if (!before.done && after.done && isLaw(caseOf(id))) S.view = "graphs";
      }
    } else if (b.dataset.qi != null) {
      var qs = st.q, qi = +b.dataset.qi, ri = MV.right(caseOf(id).q.options);
      qs.tries++; qs.last = qi;
      if (qi === ri) { qs.done = true; qs.first = qs.tries === 1; }
      api.save(); paint(); MV.focusFb(E.q); return;
    } else return;
    api.save(); paint();
  });
  MV.ACTS.clinic = {
    stats:function(){
      var closed = IDS.filter(function(k){ return cs(k).q.done; }).length, rep = IDS.filter(function(k){ return cs(k).q.first === true; }).length;
      return { first:rep, total:6, done:closed, line:"Log law clinic: " + closed + "/6 cases closed; diagnosed right before testing: " + diagRight() + "/6; repairs right first time: " + rep + "/6" };
    },
    missed:function(){
      var g = [];
      IDS.forEach(function(k){
        var s = cs(k), law = isLaw(caseOf(k)), wrongDiag = s.diag && s.diag !== MV.ans(caseOf(k)), qBad = s.q.first === false || (s.q.tries > 0 && !s.q.done && s.q.last !== MV.right(caseOf(k).q.options));
        if (law) { if (wrongDiag) g.push(0); if (qBad) g.push(3); }
        else if (wrongDiag || qBad || s.hint >= 3) g.push(4);
      });
      return g;
    }
  };
  paint();
  return {};
}

// ---------- Practice 1: one move at a time ----------
// @component N15 moveChooser (single-column mode) — the current line in large math with earlier lines and stamped law
// names above it; 3–4 move cards in a fixed shuffle; a right move writes the next line (slides in), a wrong move gets its
// feedback and is crossed out; three-level hints; first try = every move right first time, without the worked solution
function moves(host, api, a){
  var S = api.S; if (S.i == null) S.i = 0; S.it = S.it || {};
  var msg = {};
  function st(it){ return S.it[it.id] || (S.it[it.id] = { step:0, miss:0, hint:0, done:false, first:null, bad:{} }); }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted mo-n"></span><span class="dots mo-dots" aria-hidden="true"></span></div><p class="pred-q mo-p"></p>' +
    '<div class="mo-board"><ol class="mo-hist"></ol><div class="mo-line" aria-live="polite"></div></div><p class="tiny muted mo-ask"></p><div class="mo-cards" role="group" aria-label="Moves"></div><div class="mo-fb"></div>' +
    '<div class="q-actions mo-hb"></div><div class="mo-hints"></div><div class="q-actions"><button type="button" class="btn ghost sm" data-nav="-1" data-k="moprev">Previous</button><button type="button" class="btn ghost sm" data-nav="1" data-k="monext">Next item</button></div>';
  var E = {}; ["n", "dots", "p", "hist", "line", "ask", "cards", "fb", "hb", "hints"].forEach(function(k){ E[k] = host.querySelector(".mo-" + k); });
  function order(it, s){ return MV.shuffle(it.steps[s].moves.map(function(_, i){ return i; }), MV.meta.id + it.id + s); }
  function paint(anim){
    var it = a.items[S.i], x = st(it);
    E.n.textContent = "Item " + (S.i + 1) + " of " + a.items.length;
    E.dots.innerHTML = a.items.map(function(q, i){ var y = S.it[q.id]; return '<span class="dot' + (y && y.done ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    E.p.innerHTML = it.prompt;
    var h = "";
    for (var k = 0; k < x.step; k++) h += '<li><span class="mo-l">' + it.steps[k].line + "</span>" + (k ? '<span class="mo-stamp">' + it.steps[k - 1].stamp + "</span>" : "") + "</li>";
    E.hist.innerHTML = h;
    var cur = x.done ? it.end : it.steps[x.step].line, stamp = x.step ? it.steps[x.step - 1].stamp : "";
    E.line.innerHTML = '<span class="mo-l">' + cur + "</span>" + (stamp ? '<span class="mo-stamp">' + stamp + "</span>" : "");
    E.line.classList.remove("mo-in"); if (anim) { void E.line.offsetWidth; E.line.classList.add("mo-in"); }
    E.ask.textContent = x.done ? "" : "Step " + (x.step + 1) + " of " + it.steps.length + ": choose the next move.";
    MV.keepFocus(E.cards, function(){
      E.cards.innerHTML = x.done ? "" : order(it, x.step).map(function(i){
        var mv = it.steps[x.step].moves[i], bad = !!x.bad[i];
        return '<button type="button" class="mo-card' + (bad ? " wrong" : "") + '" data-mv="' + i + '" data-k="mo' + it.id + x.step + "_" + i + '" aria-label="' + MV.esc(say(mv.t)) + (bad ? ", already tried" : "") + '"' + (bad ? " disabled" : "") + ">" + (bad ? '<span class="mo-x" aria-hidden="true">✗</span>' : "") + "<span>" + mv.t + "</span></button>";
      }).join("");
    });
    var mm = msg[it.id];
    E.fb.innerHTML = x.done ? '<div class="fb good" role="status"><p><strong>✓ Done.</strong> Every move is a law that works for all positive values.' + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : mm ? '<div class="fb ' + mm.k + '" role="status"><p>' + mm.h + "</p></div>" : "";
    MV.keepFocus(E.hb, function(){ E.hb.innerHTML = x.done ? "" : MV.hintBtn("moh" + it.id, x.hint); });
    E.hints.innerHTML = x.done ? "" : MV.hintsHTML(it.hints, x.hint);
    MV.keepFocus(host, function(){
      host.querySelector('[data-nav="-1"]').disabled = S.i === 0; host.querySelector('[data-nav="1"]').disabled = S.i === a.items.length - 1;
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = st(it);
    if (b.dataset.nav) { S.i = clamp(S.i + +b.dataset.nav, 0, a.items.length - 1); api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.mv != null) {
      var i = +b.dataset.mv, mv = it.steps[x.step].moves[i];
      if (MV.ok(mv)) {
        var stamp = it.steps[x.step].stamp; x.step++; x.bad = {};
        if (x.step >= it.steps.length) { x.done = true; x.first = x.miss === 0 && x.hint < 3; msg[it.id] = null; }
        else msg[it.id] = { k:"good", h:"<strong>✓ " + stamp + ".</strong> Now choose the next move." };
        api.save(); paint(true); MV.focusFb(E.fb.parentNode);
      } else {
        x.miss++; x.bad[i] = 1; msg[it.id] = { k:"bad", h:"<strong>✗ Not quite.</strong> " + mv.fb + " Try another move." };
        api.save(); paint(); MV.focusFb(E.fb.parentNode);
      }
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.it[it.id]; if (y && y.done) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.it[it.id]; if (y && (y.miss > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Practice 2: build it, then work backwards ----------
// @component N4 coefBoxes — number entry in three forms: "fill in the coefficients" boxes inline in the math (whole numbers,
// negatives allowed), a single number box (decimal with tolerance, or text so 25/2 works), and a stacked fraction box;
// named wrong answers, a fallback per item, hints, first try tracked
function build(host, api, a){
  var S = api.S; S.it = S.it || {};
  var msg = {};
  function st(id){ return S.it[id] || (S.it[id] = { v:[], tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){ return (i === 0 ? '<p class="bw-given">' + a.given + "</p>" : "") + '<div class="q" data-bw="' + it.id + '"></div>'; }).join("");
  function inp(it, k, x, extra){ return '<input class="numin bw-in" data-bi="' + k + '" data-k="' + it.id + "i" + k + '" autocomplete="off" value="' + MV.esc(x.v[k] == null ? "" : x.v[k]) + '"' + (x.solved ? " disabled" : "") + extra + ">"; }
  function body(it, x){
    if (it.kind === "coef") {
      var bi = 0, nb = it.frame.filter(function(p){ return p === null; }).length;
      return '<div class="bw-frame">' + it.frame.map(function(p){ if (p !== null) return '<span class="bw-t">' + p + "</span>"; var k = bi++; return inp(it, k, x, ' type="number" step="1" aria-label="Box ' + (k + 1) + " of " + nb + '"'); }).join("") + "</div>";
    }
    if (it.kind === "frac") return '<div class="bw-frame"><span class="bw-t">' + (it.label || "") + '</span><span class="bw-frac">' + inp(it, 0, x, ' type="number" step="1" inputmode="numeric" aria-label="Numerator"') + '<span class="bw-bar" aria-hidden="true"></span>' + inp(it, 1, x, ' type="number" step="1" inputmode="numeric" aria-label="Denominator"') + "</span></div>";
    return '<div class="bw-frame"><span class="bw-t">' + (it.label || "Your answer:") + "</span>" + inp(it, 0, x, it.box === "text" ? ' type="text" aria-label="Your answer"' : ' type="number" step="any" aria-label="Your answer"') + "</div>";
  }
  function paintItem(it, i){
    var box = host.querySelector('[data-bw="' + it.id + '"]'), x = st(it.id), mm = msg[it.id];
    MV.keepFocus(box, function(){
      var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + (it.prompt ? "<p>" + it.prompt + "</p>" : "") + MV.usesHTML(it.use) + body(it, x) + "</div></div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (mm) h += '<div class="fb ' + (mm.bad ? "bad" : "") + '" role="status"><p>' + mm.h + "</p></div>";
      box.innerHTML = h;
    });
  }
  function val(s){ var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : null; }
  function judge(it, x){
    var A = MV.ans(it), tol = it.tol == null ? 1e-9 : it.tol, wrong = it.wrong || [];
    if (it.kind === "coef") {
      var n = A.length, vs = [];
      for (var k = 0; k < n; k++) { var v = val(x.v[k]); if (v == null || !isInt(v)) return { invalid:"Fill in every box with a whole number (negatives are fine)." }; vs.push(Math.round(v)); }
      if (vs.every(function(v, j){ return v === A[j]; })) return { ok:true };
      var w = wrong.filter(function(q){ return q.match.every(function(v, j){ return v === vs[j]; }); })[0];
      return { ok:false, fb:w ? w.fb : null };
    }
    var got;
    if (it.kind === "frac") {
      var nu = val(x.v[0]), de = (x.v[1] == null || String(x.v[1]).trim() === "") ? 1 : val(x.v[1]);
      if (nu == null || de == null || de === 0 || !isInt(nu) || !isInt(de)) return { invalid:"Enter a whole number on top and a whole number (not 0) below." };
      got = nu / de; if (near(got, A[0] / A[1])) return { ok:true };
    } else {
      got = val(x.v[0]); if (got == null) return { invalid:"Enter a number, such as 12, −3.5 or 3/4." };
      if (Math.abs(got - A) <= tol + 1e-12) return { ok:true };
    }
    var w2 = wrong.filter(function(q){ return Math.abs(got - q.match) <= Math.max(5e-4, 1e-9 * Math.abs(q.match)); })[0];
    return { ok:false, fb:w2 ? w2.fb : null };
  }
  host.addEventListener("input", function(e){
    var t = e.target, box = t.closest("[data-bw]"); if (!box || t.dataset.bi == null) return;
    st(box.dataset.bw).v[+t.dataset.bi] = t.value; api.save();
  });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter") return; var box = e.target.closest("[data-bw]"); if (!box || e.target.dataset.bi == null) return; var b = box.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-bw]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.bw; })[0], i = a.items.indexOf(it), x = st(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it, i); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.invalid) msg[it.id] = { bad:false, h:r.invalid };
      else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
      else { x.tries++; msg[it.id] = { bad:true, h:"<strong>✗ Not quite.</strong> " + (r.fb ? r.fb + " Try again." : it.general) }; }
      api.save(); paintItem(it, i); MV.focusFb(box);
    }
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.it[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.it[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: land exactly on 2 ----------
var task = (function(){
  var api = null, plot = null, ax = { lo:0, hi:4 }, axCancel = null, BASES = [2, 3, 5, 6, 10];
  function whole(s){ s = String(s == null ? "" : s).trim(); return /^\d+$/.test(s) ? parseInt(s, 10) : NaN; }
  function read(){ var s = api ? api.S : {}, b = +(s.b || 3), v = [whole(s.m), whole(s.n), whole(s.p)]; return { b:b, v:v, all:v.every(function(x){ return x >= 1; }) }; }
  function powK(n, b){ if (!(n >= 1)) return -1; var k = 0, p = 1; while (p < n) { p *= b; k++; } return p === n ? k : -1; }
  function lnm(n, b){ return "log" + (b === 10 ? "" : "_{@b{" + b + "}}") + " " + n; }
  function checks(d){
    if (!d.all) return [false, false, false];
    var v = d.v, b = d.b;
    return [v.every(function(x){ return x >= 2 && x <= 60; }) && v[0] !== v[1] && v[1] !== v[2] && v[0] !== v[2], v.every(function(x){ return powK(x, b) < 0; }), v[0] * v[1] === b * b * v[2]];
  }
  function ratio(d){ var t = d.v[0] * d.v[1], g = gcd(t, d.v[2]); return { n:t / g, d:d.v[2] / g, txt:t / g + (d.v[2] / g === 1 ? "" : "/" + d.v[2] / g), val:t / d.v[2] }; }
  function totTxt(d){
    var c = checks(d), tot = logb(d.v[0] * d.v[1] / d.v[2], d.b);
    if (c[2]) return "Total: exactly 2";
    if (f3(tot) === "2.000") return "Total ≈ " + tot.toFixed(6) + ": close, but not exactly 2";
    return "Total ≈ " + f3(tot);
  }
  function draw(){
    if (!plot) return;
    var d = read(), K = { pen:css("--pen"), f3:css("--f3"), ink:css("--ink"), ink2:css("--ink-2"), pb:css("--p-b") };
    var lm = d.all ? logb(d.v[0], d.b) : 0, ln = d.all ? logb(d.v[1], d.b) : 0, lp = d.all ? logb(d.v[2], d.b) : 0, tot = lm + ln - lp;
    plot.draw({ grid:false, axes:false, describe:d.all ? "Length strip in units of log base " + d.b + ": log of " + d.v[0] + " is about " + f3(lm) + ", plus log of " + d.v[1] + " is about " + f3(ln) + ", minus log of " + d.v[2] + " is about " + f3(lp) + ". Total " + totTxt(d).replace("Total", "").replace(":", "").trim() + ". Target: 2 units." : "Empty length strip. Enter m, n and p.",
      after:function(ctx){
        var Wd = plot.W, pad = 22, X = function(u){ return pad + (u - ax.lo) / (ax.hi - ax.lo) * (Wd - 2 * pad); };
        var y1 = 64, y2 = 94, y3 = 142, yA = 186;
        hline(ctx, X(ax.lo), X(ax.hi), yA, K.ink2, 1.4);
        for (var k = Math.ceil(ax.lo - 1e-9); k <= ax.hi + 1e-9; k++) { vline(ctx, X(k), yA, yA + (k === 0 ? 9 : 5), K.ink2, k === 0 ? 2 : 1); uiText(ctx, num(k), X(k), yA + 16, { size:12, color:K.ink }); }
        var bs = String(d.b), cw = cmath(ctx, "Length units: log_" + bs, 0, 0, { size:12, measure:true, weight:400 }), cw0 = cmath(ctx, "Length units: ", 0, 0, { size:12, measure:true, weight:400 });
        cmath(ctx, "Length units: ", Wd / 2 - cw / 2, yA + 34, { size:12, weight:400, color:K.ink2, bg:false });
        cmath(ctx, d.b === 10 ? "log" : "log_" + bs, Wd / 2 - cw / 2 + cw0, yA + 34, { size:12, weight:700, color:K.pb, bg:false });
        // target at 2 units
        vline(ctx, X(2), 22, yA, K.pb, 1.5, [5, 4]); diamond(ctx, X(2), yA, 6, K.pb);
        cmath(ctx, bs + "^2 = " + d.b * d.b, X(2) + 6, 12, { size:13, color:K.pb, align:"left" });
        if (!d.all) return;
        sbar(ctx, X(0), X(lm), y1, { color:K.pen, w:12 });
        sbar(ctx, X(lm), X(lm + ln), y1, { color:K.f3, w:12 });
        sbar(ctx, X(lm + ln), X(tot), y2, { color:K.ink2, w:12, dash:[5, 3] });
        sbar(ctx, X(0), X(tot), y3, { color:K.ink, w:16 });
        var l1 = "log_" + bs + " " + d.v[0] + " " + approx(lm), l2s = "log_" + bs + " " + d.v[1] + " " + approx(ln), l3 = "−log_" + bs + " " + d.v[2] + " " + approx(-lp);
        if (d.b === 10) { l1 = l1.replace("log_10", "log"); l2s = l2s.replace("log_10", "log"); l3 = l3.replace("log_10", "log"); }
        var a = clab(ctx, Wd, l1, (X(0) + X(lm)) / 2, y1 - 18, { size:12, color:K.pen }), wb = cmath(ctx, l2s, 0, 0, { size:12, measure:true }), cb = clamp((X(lm) + X(lm + ln)) / 2, wb / 2 + 4, Wd - wb / 2 - 4);
        clab(ctx, Wd, l2s, cb, Math.abs(cb - a.x) < (a.w + wb) / 2 + 8 ? y1 - 36 : y1 - 18, { size:12, color:K.f3 });
        clab(ctx, Wd, l3, (X(lm + ln) + X(tot)) / 2, y2 + 18, { size:12, color:K.ink2 });
        clab(ctx, Wd, "total " + (checks(d)[2] ? "= 2" : "≈ " + f3(tot)), (X(0) + X(tot)) / 2, y3 + 20, { size:12, color:K.ink, weight:700 });
      } });
  }
  function rescale(){
    var d = read(), lo = 0, hi = 4;
    if (d.all) { var lm = logb(d.v[0], d.b), ln = logb(d.v[1], d.b), tot = lm + ln - logb(d.v[2], d.b); hi = Math.max(4, Math.ceil(lm + ln + 0.35)); lo = Math.min(0, Math.floor(tot - 0.35)); }
    if (lo === ax.lo && hi === ax.hi) { draw(); return; }
    if (axCancel) axCancel();
    var a0 = { lo:ax.lo, hi:ax.hi };
    axCancel = MV.tween({ dur:400, step:function(t){ ax.lo = lerp(a0.lo, lo, t); ax.hi = lerp(a0.hi, hi, t); draw(); }, done:function(){ ax.lo = lo; ax.hi = hi; axCancel = null; draw(); } });
  }
  function caption(){
    var d = read(), b = d.b, f = function(k, i){ return isNaN(d.v[i]) ? k : String(d.v[i]); };
    var L = b === 10 ? "log" : "log_{@b{" + b + "}}";
    $("#la-cap").innerHTML = m(L + " " + f("m", 0) + " + " + L + " " + f("n", 1) + " - " + L + " " + f("p", 2));
    $("#la-tot").innerHTML = d.all ? totTxt(d) : '<span class="muted">Enter ' + m("m") + ", " + m("n") + " and " + m("p") + " to see the total.</span>";
  }
  function update(){ caption(); rescale(); if (api) api.update(); }
  return {
    render:function(inpH, pv, A){
      api = A; if (!A.S.b) A.S.b = 3;
      inpH.innerHTML = '<div id="la-b"></div><div class="inrow">' + ["m", "n", "p"].map(function(k){ return '<label for="la-' + k + '"><span>' + m(k) + '</span><input id="la-' + k + '" data-f="' + k + '" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(A.S[k] || "") + '"></label>'; }).join("") + '</div><p class="la-cap" id="la-cap" aria-live="polite"></p>';
      pv.innerHTML = '<canvas class="plot la-cv" id="la-cv" role="img" aria-label="Length strip preview"></canvas><p class="la-tot" id="la-tot" aria-live="polite"></p>';
      radios($("#la-b"), { label:"Base", aria:"Base b", cls:"chips bchips", value:String(A.S.b), options:BASES.map(function(b){ return { id:String(b), t:m("@b{b} = " + b), say:"b = " + b }; }), onChange:function(v){ A.S.b = +v; A.save(); update(); } });
      plot = new MV.Plot($("#la-cv"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      inpH.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.f; if (!k) return; A.S[k] = e.target.value; A.save(); update(); });
      caption(); rescale(); draw();
    },
    read:read,
    valid:function(d){ return d.all ? true : "Enter a positive whole number in each of the three boxes."; },
    checks:checks,
    tips:function(d, c){
      var out = [], v = d.v, b = d.b, B2 = b * b;
      if (!c[0]) out.push("Use three different whole numbers from 2 to 60.");
      if (!c[1]) { var bad = v.filter(function(x){ return powK(x, b) >= 0; })[0]; out.push(bad + " is a power of " + b + ", so " + m(lnm(bad, b) + " = " + powK(bad, b)) + " is a whole number. Choose numbers that aren’t powers of " + m("@b{b}") + ". They can share a factor with " + m("@b{b}") + "; they just can’t be made of " + m("@b{b}") + " alone."); }
      if (!c[2]) {
        var r = ratio(d), tot = logb(r.val, b), tt = f3(tot) === "2.000" ? tot.toFixed(6) : f3(tot);
        var L = b === 10 ? "log" : "log_{@b{" + b + "}}", t = "Right now " + m("m × n ÷ p = " + r.txt) + ", so the total is " + m(L + (r.d === 1 ? " " + r.txt : "(" + r.txt + ")") + " ≈ " + tt) + ". For exactly 2 you need " + m("m × n ÷ p = @b{b}^2 = " + B2) + ".";
        if (v[0] + v[1] - v[2] === B2) t += " You made " + m("m + n - p = " + B2) + ". The laws turn adding logs into <strong>multiplying</strong> numbers.";
        if (v[0] * v[1] === 2 * b * v[2]) t += " 2 units means " + m("@b{b}^2") + ", not 2 × " + m("@b{b}") + ".";
        out.push(t);
      }
      return out;
    },
    key:function(d){ return d.b + "|" + Math.min(d.v[0], d.v[1]) + "," + Math.max(d.v[0], d.v[1]) + "," + d.v[2]; },
    label:function(k){ var p = k.split("|"); return m("@b{b} = " + p[0]) + ": (" + p[1].split(",").join(", ") + ")"; },
    text:function(k){ var p = k.split("|"); return "b = " + p[0] + ": " + p[1].split(",").join(", "); }
  };
})();

MV.module({
  hero:hero,
  explore:slideRule,
  part3:clinic,
  activities:{ moves:moves, build:build },
  task:task
});
})();
