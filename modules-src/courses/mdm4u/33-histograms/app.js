// MDM4U 33 Frequency Distributions & Histograms: hero (30 chips drop into left-inclusive bins, the piles become touching
// bars, a frequency polygon threads the midpoints), Histogram studio (Explore: D10 histogram builder with width/start chips,
// vertical-scale switch, polygon, add-a-value and tappable bars; a shape gallery), The right graph (Part 3: three stations),
// Left-leaning histogram task. Every class is a ≤ x < a + w (left endpoint included). Bars --pen, polygon --ink, tail arrow --hi.
(function(){
"use strict";
var $ = MV.$;
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
function dN(v, dp){ dp = dp == null ? 2 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
function d2(v){ return (Math.round(v * 100) / 100).toFixed(2); }
function cls(a, b){ return "[" + dN(a, 1) + ", " + dN(b, 1) + ")"; }
function ord(k){ var s = ["th", "st", "nd", "rd"], v = k % 100; return k + (s[(v - 20) % 10] || s[v] || s[0]); }
function swHTML(id, lab, on){ return '<button type="button" class="cc-switch hg-sw" role="switch" id="' + id + '" data-k="' + id + '" aria-checked="' + !!on + '"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>' + lab + "</button>"; }
var LIN = function(t){ return t; };

// @component radioGroup (copied from MDM4U 19 / 18) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t, aria}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh, setOptions}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) || ids.indexOf(val) < 0 ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector('[tabindex="0"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint,
    setOptions:function(list){ o.options = list; paint(); } };
}

// @component D10 histogramBuilder — frequency distribution with equal-width, left-inclusive classes (a ≤ x < a + w) and an SVG
// histogram: touching bars (--pen) over a number line, optional frequency polygon at the midpoints (--ink), bar labels, a
// tail arrow (--hi over --ink), a falling value chip, focusable bars (role=button, Enter/Space) for tap-to-select.
// distOf(vals, start, w) -> {edges, f, rel, cum, n (counted), below (values under the start)}
// histSVG({edges, ys, ymax, ticks:[{v, t}], labels:[text], poly:bool, sel, tap:bool, grow:[0–1 per bar], chip:{x, y, t, note},
//   arrow:{x1, x2, y, len (0–1)}, hiAxis, yLabel, xLabel, aria}) -> svg markup (viewBox 520 × 300)
function distOf(vals, start, w){
  var hi = start, below = 0;
  vals.forEach(function(v){ if (v < start) below++; else hi = Math.max(hi, v); });
  var k = Math.max(1, Math.floor((hi - start) / w + 1e-9) + 1), edges = [], f = [], i;
  for (i = 0; i <= k; i++) edges.push(start + i * w);
  for (i = 0; i < k; i++) f.push(0);
  vals.forEach(function(v){ if (v < start) return; var j = Math.floor((v - start) / w + 1e-9); if (j >= 0 && j < k) f[j]++; });
  var n = f.reduce(function(a, b){ return a + b; }, 0), run = 0;
  return { edges:edges, f:f, n:n, below:below, rel:f.map(function(x){ return n ? x / n : 0; }), cum:f.map(function(x){ run += x; return run; }) };
}
function yStep(top){ return top <= 6 ? 1 : top <= 12 ? 2 : top <= 25 ? 5 : top <= 50 ? 10 : 20; }
function medianClass(d){
  if (!d.n) return { t:"—", i:[] };
  var k1 = Math.ceil(d.n / 2), k2 = d.n % 2 ? k1 : k1 + 1;
  function at(k){ for (var i = 0; i < d.cum.length; i++) if (d.cum[i] >= k) return i; return d.cum.length - 1; }
  var i1 = at(k1), i2 = at(k2), pos = k1 === k2 ? "the " + ord(k1) + " value" : "the " + ord(k1) + " and " + ord(k2) + " values";
  if (i1 === i2) return { t:cls(d.edges[i1], d.edges[i1 + 1]) + " (" + pos + ")", i:[i1] };
  return { t:"between " + cls(d.edges[i1], d.edges[i1 + 1]) + " and " + cls(d.edges[i2], d.edges[i2 + 1]) + " (" + pos + ")", i:[i1, i2] };
}
function modalClass(d){
  var mx = Math.max.apply(null, d.f); if (!mx) return "—";
  var ids = []; d.f.forEach(function(x, i){ if (x === mx) ids.push(i); });
  if (ids.length === d.f.length && ids.length > 1) return "none: all " + ids.length + " classes tie";
  return ids.map(function(i){ return cls(d.edges[i], d.edges[i + 1]); }).join(" and ") + (ids.length > 1 ? " (a tie)" : "");
}
function histSVG(o){
  var W = 520, H = 300, L = 54, R = 16, T = 30, B = 50, k = o.edges.length - 1, w = o.edges[1] - o.edges[0];
  var x0 = o.edges[0] - (o.pad == null ? 0.25 : o.pad) * w, x1 = o.edges[k] + (o.pad == null ? 0.25 : o.pad) * w, yb = H - B;
  var X = function(x){ return L + (x - x0) / (x1 - x0) * (W - L - R); }, Y = function(y){ return yb - y / o.ymax * (yb - T); };
  var s = '<svg class="hg-svg" viewBox="0 0 ' + W + " " + H + '" ' + (o.tap ? 'role="group"' : 'role="img"') + ' aria-label="' + MV.esc(o.aria || "Histogram") + '">';
  // grid + y ticks
  (o.ticks || []).forEach(function(t){ var y = Y(t.v); s += '<line class="hg-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '"/><text class="hg-yt' + (o.hiAxis ? " hg-hiax" : "") + '" x="' + (L - 7) + '" y="' + (y + 4).toFixed(1) + '">' + t.t + "</text>"; });
  if (o.hiAxis) s += '<rect class="hg-axhi" x="2" y="' + (T - 12) + '" width="' + (L - 4) + '" height="' + (yb - T + 24) + '" rx="6"/>';
  // bars
  var lab = o.labels || [], mid = [];
  for (var i = 0; i < k; i++) {
    var a = o.edges[i], b = o.edges[i + 1], g = o.grow ? o.grow[i] : 1, y = o.ys[i] * (g == null ? 1 : g), bx = X(a), bw = X(b) - X(a), top = Y(y);
    mid.push([X((a + b) / 2), Y(o.ys[i])]);
    var on = o.sel === i, name = cls(a, b) + ": " + (lab[i] != null ? lab[i] : o.ys[i]);
    s += "<g" + (o.tap ? ' class="hg-b" data-bar="' + i + '" tabindex="0" role="button" aria-pressed="' + on + '" aria-label="' + MV.esc(name) + '"' : "") + ">" +
      '<rect class="hg-hit" x="' + bx.toFixed(1) + '" y="' + T + '" width="' + bw.toFixed(1) + '" height="' + (yb - T) + '"/>' +
      (y > 0 ? '<rect class="hg-bar' + (on ? " hg-on" : "") + '" x="' + bx.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (yb - top).toFixed(1) + '"/>' : "") +
      (on ? '<rect class="hg-selbd" x="' + (bx + 1.5).toFixed(1) + '" y="' + (Math.min(top, yb - 4) + 1.5).toFixed(1) + '" width="' + (bw - 3).toFixed(1) + '" height="' + Math.max(1, yb - Math.min(top, yb - 4) - 3).toFixed(1) + '"/>' : "") +
      (lab[i] != null && (g == null || g >= 1) && bw >= 22 ? '<text class="hg-bl" x="' + (bx + bw / 2).toFixed(1) + '" y="' + (top - 5).toFixed(1) + '">' + lab[i] + "</text>" : "") + "</g>";
  }
  // polygon
  if (o.poly && k > 0) {
    var pts = mid.map(function(p){ return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
    s += '<polyline class="hg-poly" points="' + pts + '"' + (o.polyLen != null ? ' pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + (1 - o.polyLen).toFixed(3) + '"' : "") + "/>";
    if (o.polyLen == null || o.polyLen >= 1) mid.forEach(function(p){ s += '<circle class="hg-pt" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.2"/>'; });
  }
  // axis + x ticks (every edge; thinned when crowded)
  s += '<line class="hg-ax" x1="' + L + '" x2="' + (W - R) + '" y1="' + yb + '" y2="' + yb + '"/><line class="hg-ax" x1="' + L + '" x2="' + L + '" y1="' + (T - 8) + '" y2="' + yb + '"/>';
  var every = k > 12 ? 2 : 1;
  o.edges.forEach(function(e, j){ var x = X(e); s += '<line class="hg-ax" x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="' + yb + '" y2="' + (yb + 5) + '"/>' + (j % every ? "" : '<text class="hg-xt" x="' + x.toFixed(1) + '" y="' + (yb + 20) + '">' + dN(e, 1) + "</text>"); });
  if (o.xLabel) s += '<text class="hg-axl" x="' + (W - R) + '" y="' + (H - 6) + '" text-anchor="end">' + o.xLabel + "</text>";
  if (o.yLabel) s += '<text class="hg-axl" x="' + (L + 4) + '" y="' + (T - 14) + '" text-anchor="start">' + o.yLabel + "</text>";
  // tail arrow
  if (o.arrow) {
    var ax1 = X(o.arrow.x1), ax2 = ax1 + (X(o.arrow.x2) - ax1) * (o.arrow.len == null ? 1 : o.arrow.len), ay = Y(o.arrow.y), dir = ax2 >= ax1 ? 1 : -1;
    var head = Math.abs(ax2 - ax1) > 14 ? '<path d="M' + ax2.toFixed(1) + " " + ay.toFixed(1) + "l" + (-13 * dir) + " -8v16z" + '"/>' : "";
    s += '<g class="hg-arrow-u"><line x1="' + ax1.toFixed(1) + '" x2="' + ax2.toFixed(1) + '" y1="' + ay.toFixed(1) + '" y2="' + ay.toFixed(1) + '"/>' + head + "</g>" +
      '<g class="hg-arrow"><line x1="' + ax1.toFixed(1) + '" x2="' + ax2.toFixed(1) + '" y1="' + ay.toFixed(1) + '" y2="' + ay.toFixed(1) + '"/>' + head + "</g>";
    if (o.arrow.len == null || o.arrow.len >= 1) s += '<text class="hg-tail" x="' + ((ax1 + ax2) / 2).toFixed(1) + '" y="' + (ay - 12).toFixed(1) + '">long tail</text>';
  }
  // a value chip (P2)
  if (o.chip) {
    var cx = X(o.chip.x), cy = Y(o.chip.y) - 12;
    s += '<g class="hg-chip"><rect x="' + (cx - 20).toFixed(1) + '" y="' + (cy - 12).toFixed(1) + '" width="40" height="24" rx="6"/><text x="' + cx.toFixed(1) + '" y="' + (cy + 5).toFixed(1) + '">' + o.chip.t + "</text></g>";
    if (o.chip.note) s += '<text class="hg-note" x="' + Math.min(W - 80, cx + 28).toFixed(1) + '" y="' + (cy + 5).toFixed(1) + '" text-anchor="start">' + o.chip.note + "</text>";
  }
  return s + "</svg>";
}
// y set-up for a scale: freq / rel (same bar heights, axis ÷ n) / cum
function scaleOf(d, sc){
  var mf = Math.max(1, Math.max.apply(null, d.f)), st = yStep(mf), top = Math.ceil(mf / st) * st, n = Math.max(1, d.n), ticks = [], v;
  if (sc === "cum") { var sc2 = yStep(n); top = Math.ceil(n / sc2) * sc2; for (v = 0; v <= top + 1e-9; v += sc2) ticks.push({ v:v, t:String(v) }); return { ys:d.cum, ymax:top * 1.08, ticks:ticks, labels:d.cum.map(String), yLabel:"cumulative frequency" }; }
  for (v = 0; v <= top + 1e-9; v += st) ticks.push({ v:v, t:sc === "rel" ? d2(v / n) : String(v) });
  return { ys:d.f, ymax:top * 1.1, ticks:ticks, labels:sc === "rel" ? d.rel.map(d2) : d.f.map(String), yLabel:sc === "rel" ? "relative frequency" : "frequency" };
}

// ---------- data ----------
var BASE = [22, 25, 28, 30, 31, 34, 35, 36, 38, 39, 40, 40, 41, 42, 44, 45, 45, 47, 48, 49, 50, 52, 53, 55, 57, 59, 60, 63, 66, 68];
var GAL = {
  sym:{ t:"Adult heights", unit:"height (cm)", st:150, w:5, f:[2, 5, 9, 5, 2], shape:"sym" },
  inc:{ t:"Household incomes", unit:"income ($1000s)", st:0, w:30, f:[9, 7, 4, 2, 1], shape:"right" },
  quiz:{ t:"Marks on an easy quiz", unit:"mark (%)", st:50, w:10, f:[1, 2, 4, 7, 9], shape:"left" },
  rnd:{ t:"Random numbers from 0 to 50", unit:"number", st:0, w:10, f:[5, 5, 5, 5, 5], shape:"uni" },
  sleep:{ t:"Sleep times of two age groups combined", unit:"sleep (h)", st:5, w:1.5, f:[2, 7, 3, 7, 2], shape:"bi" }
};
var GAL_ORDER = ["sym", "inc", "quiz", "rnd", "sleep"];
var SHAPES = [{ id:"sym", t:"Symmetric" }, { id:"right", t:"Skewed right" }, { id:"left", t:"Skewed left" }, { id:"uni", t:"Uniform" }, { id:"bi", t:"Bimodal" }];
function shapeT(id){ return SHAPES.filter(function(s){ return s.id === id; })[0].t; }
var GAL_WHY = { sym:"The bars mirror each other around one central peak.", right:"Most values are low, with a long tail of high ones. Skew is named for the tail.", left:"Most values are high, with a long tail of low ones. Skew is named for the tail.",
  uni:"Every class has the same frequency.", bi:"Two separate peaks: two groups mixed together." };
function galFb(card, g){
  var s = card.shape;
  if (g === s) return { ok:true, t:"✓ " + shapeT(s) + ". " + GAL_WHY[s] };
  if ((s === "right" && g === "left") || (s === "left" && g === "right")) return { t:"✗ Not quite. Skew is named for the long tail. The tail of short bars is on the " + (s === "right" ? "right" : "left") + ", so it’s " + shapeT(s).toLowerCase() + "." };
  if (s === "bi" && g === "sym") return { t:"✗ Not quite. It is symmetric too, but two separate peaks make it bimodal; the more informative name wins." };
  return { t:"✗ Not quite. It’s " + shapeT(s).toLowerCase() + ". " + GAL_WHY[s] };
}

// ---------- Explore: Histogram studio ----------
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (S.mode !== "gallery") S.mode = "studio";
    S.w = [5, 10, 15, 20].indexOf(+S.w) >= 0 ? +S.w : 10;
    S.st = [15, 20].indexOf(+S.st) >= 0 ? +S.st : 20;
    if (["freq", "rel", "cum"].indexOf(S.sc) < 0) S.sc = "freq";
    S.poly = S.poly == null ? true : !!S.poly;
    S.add = (Array.isArray(S.add) ? S.add : []).map(Number).filter(function(v){ return isFinite(v) && v >= 0 && v <= 80; }).slice(0, 20);
    S.sel = S.sel == null || !isFinite(+S.sel) ? null : +S.sel;
    if (!GAL[S.card]) S.card = "inc";
    S.guess = obj(S.guess); S.rev = obj(S.rev);
  }
  sanitize();
  var anim = null, pv = {}, msg = "", built = "", prevKey = "", prevR = [], growStop = null, grow = null;
  host.innerHTML =
    '<div class="hg-top"><div id="hg-mode"></div></div>' +
    '<div class="pg hg-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap hg-cap" id="hg-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="hg-plot" id="hg-plot"></div><p class="tiny hg-data" id="hg-data"></p></div>' +
    '<div class="pg-ctrl"><div id="hg-ctrl"></div><p class="tiny hg-msg" id="hg-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="hg-read" aria-live="polite"></dl><div id="hg-tbl" class="hg-tbl"></div></div></div>';
  var modeR = radios($("#hg-mode", host), { label:"Mode", options:[{ id:"studio", t:"Studio" }, { id:"gallery", t:"Shape gallery" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; msg = ""; save(); render(); MV.changed(); } });
  var wR, stR, scR, cardR;

  function save(){ api.save(); }
  function vals(){ return BASE.concat(S.add); }
  function cur(){
    if (S.mode === "gallery") { var c = GAL[S.card], e = [], run = 0, n = 0; c.f.forEach(function(x){ n += x; }); for (var i = 0; i <= c.f.length; i++) e.push(c.st + i * c.w);
      return { edges:e, f:c.f.slice(), n:n, below:0, rel:c.f.map(function(x){ return x / n; }), cum:c.f.map(function(x){ run += x; return run; }) }; }
    return distOf(vals(), S.st, S.w);
  }
  // animation bookkeeping: a user action finishes a running prediction animation at once
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){ if (!anim) return; var a = anim; anim = null; a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} }); pv = {}; if (a.fin) a.fin(); render(); MV.changed(); }
  function endAnim(){ var a = anim; anim = null; pv = {}; if (a && a.fin) a.fin(); render(); MV.changed(); }
  function user(){ cancelAnim(); MV.banner("", ""); }

  // --- painting ---
  function render(){
    sanitize(); modeR.set(S.mode);
    paintCtrl(); paintPlot(true); paintRead(); paintMsg();
  }
  function paintMsg(){ $("#hg-msg", host).innerHTML = msg ? MV.md(msg) : ""; }
  function paintCtrl(){
    var box = $("#hg-ctrl", host);
    if (built !== S.mode) {
      built = S.mode;
      if (S.mode === "studio") {
        box.innerHTML = '<div class="hg-panel"><p class="hg-sh">Classes <span class="mdm-model">model data</span></p><div id="hg-w"></div><div id="hg-st"></div><div id="hg-sc"></div>' + swHTML("hg-poly", "Frequency polygon", S.poly) +
          '<p class="hg-sh hg-sh2">Add a value</p><div class="hg-add"><label for="hg-in" class="hg-al">Value (0–80)</label><input id="hg-in" class="numin hg-in" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-k="hgin">' +
          '<button type="button" class="btn sm" id="hg-addb" data-k="hgadd">Add</button><button type="button" class="btn ghost sm" id="hg-undo" data-k="hgundo">Undo</button></div><p class="tiny muted" id="hg-added"></p>' +
          '<p class="tiny muted hg-how">Tap a bar (or Tab to it and press Enter) to select its class.</p></div>';
        wR = radios($("#hg-w", box), { label:"Class width", options:[5, 10, 15, 20].map(function(v){ return { id:v, t:String(v) }; }), value:S.w, cls:"chips",
          onChange:function(v){ user(); S.w = +v; S.sel = null; msg = ""; save(); render(); MV.changed(); } });
        stR = radios($("#hg-st", box), { label:"Start", options:[15, 20].map(function(v){ return { id:v, t:String(v) }; }), value:S.st, cls:"chips",
          onChange:function(v){ user(); S.st = +v; S.sel = null; msg = ""; save(); render(); MV.changed(); } });
        scR = radios($("#hg-sc", box), { label:"Vertical scale", options:[{ id:"freq", t:"Frequency" }, { id:"rel", t:"Relative frequency" }, { id:"cum", t:"Cumulative frequency" }], value:S.sc, cls:"seg",
          onChange:function(v){ user(); S.sc = v; msg = ""; save(); render(); MV.changed(); } });
      } else {
        box.innerHTML = '<div class="hg-panel"><p class="hg-sh">Shape gallery <span class="mdm-model">model data</span></p><div id="hg-card"></div><p class="hg-sh hg-sh2">Which shape is it?</p><div class="hg-guess" id="hg-guess" role="group" aria-label="Choose a shape"></div><div id="hg-gfb"></div></div>';
        cardR = radios($("#hg-card", box), { label:"Card", options:GAL_ORDER.map(function(k){ return { id:k, t:GAL[k].t }; }), value:S.card, cls:"chips",
          onChange:function(v){ user(); S.card = v; save(); render(); MV.changed(); } });
      }
    }
    if (S.mode === "studio") {
      wR.set(S.w); stR.set(S.st); scR.set(S.sc);
      var pb = $("#hg-poly", box); pb.setAttribute("aria-checked", String(S.poly && S.sc !== "cum")); pb.disabled = S.sc === "cum";
      $("#hg-undo", box).disabled = !S.add.length; $("#hg-addb", box).disabled = S.add.length >= 20;
      $("#hg-added", box).innerHTML = S.add.length ? "You added: " + S.add.map(function(v){ return dN(v, 1); }).join(", ") + " (" + S.add.length + ")" : "No values added yet.";
    } else {
      cardR.set(S.card);
      var g = S.guess[S.card], gb = $("#hg-guess", box);
      MV.keepFocus(gb, function(){ gb.innerHTML = SHAPES.map(function(s){ return '<button type="button" class="btn ghost sm hg-gb" data-shape="' + s.id + '" data-k="hgg' + s.id + '" aria-pressed="' + (g === s.id) + '">' + s.t + "</button>"; }).join(""); });
      var fb = g ? galFb(GAL[S.card], g) : null;
      $("#hg-gfb", box).innerHTML = fb ? MV.fbHTML(fb.ok ? "good" : "bad", fb.t) : "";
    }
  }
  function paintPlot(animate){
    var d = cur(), gal = S.mode === "gallery", sc = gal ? scaleOf(d, "freq") : scaleOf(d, S.sc), key = d.edges.join(",") + "|" + (gal ? "g" : S.sc);
    var ratios = sc.ys.map(function(y){ return y / sc.ymax; });
    if (animate && key !== prevKey + "" && !MV.reduceMotion && !pv.noGrow) {
      var same = prevR.length === ratios.length, from = ratios.map(function(r, i){ return same ? prevR[i] : 0; });
      if (growStop) growStop();
      grow = ratios.map(function(r, i){ return r ? from[i] / r : 0; });
      growStop = MV.tween({ dur:420, step:function(t){ grow = ratios.map(function(r, i){ return r ? (from[i] + (r - from[i]) * t) / r : 1; }); draw(d, sc); }, done:function(){ grow = null; growStop = null; draw(d, sc); } });
    } else if (animate && growStop && key !== prevKey) { growStop(); growStop = null; grow = null; }
    prevKey = key; prevR = ratios;
    draw(d, sc);
    var cap = $("#hg-cap", host);
    cap.innerHTML = gal ? GAL[S.card].t : "Start " + S.st + ", width " + S.w + ": " + (d.f.length) + " classes";
    var dt = $("#hg-data", host);
    dt.innerHTML = gal ? "" : '<span class="mdm-model">model data</span> Minutes 30 students spent on social media one evening: ' + BASE.join(", ") + (S.add.length ? '; added: <strong>' + S.add.map(function(v){ return dN(v, 1); }).join(", ") + "</strong>" : "") + ".";
  }
  function draw(d, sc){
    var gal = S.mode === "gallery", c = GAL[S.card], arrow = null;
    if (gal && (S.rev[S.card] || pv.arrow != null) && (c.shape === "right" || c.shape === "left")) {
      var e = d.edges, mx = Math.max.apply(null, d.f), pk = d.f.indexOf(mx), last = d.f.length;
      arrow = c.shape === "right" ? { x1:e[pk + 1], x2:e[last] + 0.15 * c.w, y:mx * 0.55 } : { x1:e[pk], x2:e[0] - 0.15 * c.w, y:mx * 0.55 };
      if (pv.arrow != null) arrow.len = pv.arrow;
    }
    var aria = (gal ? c.t + " histogram: " : "Histogram, " + sc.yLabel + ": ") + d.f.map(function(x, i){ return cls(d.edges[i], d.edges[i + 1]) + " " + sc.labels[i]; }).join(", ") + "." +
      (S.poly && !gal && S.sc !== "cum" ? " A frequency polygon joins the midpoints." : "") + (arrow ? " An arrow marks the long tail on the " + (c.shape === "right" ? "right." : "left.") : "");
    $("#hg-plot", host).innerHTML = histSVG({ edges:d.edges, ys:sc.ys, ymax:sc.ymax, ticks:sc.ticks, labels:sc.labels, yLabel:sc.yLabel, xLabel:gal ? c.unit : "minutes",
      poly:!gal && S.poly && S.sc !== "cum", sel:gal ? null : S.sel, tap:!gal, grow:grow, chip:pv.chip, arrow:arrow, hiAxis:!!pv.hiAxis, aria:aria });
  }
  function paintRead(){
    var d = cur(), gal = S.mode === "gallery", rows = [];
    if (gal) {
      var c = GAL[S.card], shown = S.rev[S.card] || S.guess[S.card];
      rows.push(["<i>n</i>", String(d.n)]);
      rows.push(["Classes", d.f.length + ": " + cls(d.edges[0], d.edges[1]) + " … " + cls(d.edges[d.f.length - 1], d.edges[d.f.length])]);
      rows.push(["Modal class", modalClass(d)]);
      rows.push(["Median class", medianClass(d).t]);
      rows.push(["Shape", shown ? "<strong>" + shapeT(c.shape) + "</strong>" : '<span class="muted">choose a shape first</span>']);
    } else {
      rows.push(["<i>n</i>", String(d.n) + (d.below ? ' <span class="tiny">(' + d.below + " value" + (d.below > 1 ? "s" : "") + " below the first class not counted)</span>" : "")]);
      rows.push(["Classes", d.f.length + ": " + cls(d.edges[0], d.edges[1]) + " … " + cls(d.edges[d.f.length - 1], d.edges[d.f.length])]);
      rows.push(["Modal class", modalClass(d)]);
      rows.push(["Median class", medianClass(d).t]);
      if (S.sel != null && S.sel < d.f.length) rows.push(["Selected bar", cls(d.edges[S.sel], d.edges[S.sel + 1]) + ": frequency " + d.f[S.sel] + ", relative " + d2(d.rel[S.sel]) + ", cumulative " + d.cum[S.sel]]);
    }
    var rd = $("#hg-read", host); MV.keepFocus(rd, function(){ rd.innerHTML = MV.readoutHTML(rows); });
    var trs = d.f.map(function(x, i){ return [cls(d.edges[i], d.edges[i + 1]), dN((d.edges[i] + d.edges[i + 1]) / 2, 2), String(x), d2(d.rel[i]), String(d.cum[i])]; });
    trs.push(["<strong>Total</strong>", "", "<strong>" + d.n + "</strong>", "1.00", ""]);
    $("#hg-tbl", host).innerHTML = MV.tableHTML({ head:["Class", "Midpoint", "Frequency", "Relative", "Cumulative"], rows:trs, caption:"Frequency table", hiRow:!gal && S.sel != null && S.sel < d.f.length ? S.sel : undefined });
  }

  // --- input ---
  function addValue(){
    var inp = $("#hg-in", host), raw = String(inp.value || "").replace(/[−–]/g, "-").replace(/\s/g, ""), v = raw === "" ? NaN : Number(raw);
    if (!isFinite(v)) { msg = "Type a number from 0 to 80, then press Add."; paintMsg(); return; }
    if (v < 0 || v > 80) { msg = "Choose a value from 0 to 80."; paintMsg(); return; }
    if (S.add.length >= 20) { msg = "That’s 20 added values. Undo some first."; paintMsg(); return; }
    v = Math.round(v * 10) / 10;
    S.add.push(v); inp.value = ""; msg = "Added " + dN(v, 1) + ": it goes in " + (v < S.st ? "no class (it’s below the start, " + S.st + ")" : (function(){ var j = Math.floor((v - S.st) / S.w + 1e-9); return cls(S.st + j * S.w, S.st + (j + 1) * S.w); })()) + ".";
    save(); render(); MV.changed();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button, [data-bar]"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.id === "hg-poly") { user(); S.poly = !S.poly; save(); render(); return; }
    if (b.id === "hg-addb") { user(); addValue(); return; }
    if (b.id === "hg-undo") { user(); if (S.add.length) { var v = S.add.pop(); msg = "Removed " + dN(v, 1) + "."; } save(); render(); MV.changed(); return; }
    if (b.dataset.shape) { user(); S.guess[S.card] = b.dataset.shape; S.rev[S.card] = true; save(); render(); MV.changed(); return; }
    if (b.dataset.bar != null) { user(); var i = +b.dataset.bar; S.sel = S.sel === i ? null : i; save(); render(); MV.changed(); var nb = host.querySelector('[data-bar="' + i + '"]'); if (nb) nb.focus({ preventScroll:true }); }
  });
  host.addEventListener("keydown", function(e){
    var t = e.target;
    if (t.id === "hg-in" && e.key === "Enter") { e.preventDefault(); user(); addValue(); return; }
    if (t.dataset && t.dataset.bar != null && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); t.dispatchEvent(new MouseEvent("click", { bubbles:true })); }
  });

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); msg = ""; var s = p.start || {};
    if (s.mode === "gallery") { S.mode = "gallery"; S.card = s.card; delete S.guess[s.card]; delete S.rev[s.card]; }
    else { S.mode = "studio"; S.st = s.st; S.w = s.w; S.sc = s.sc; S.add = []; S.sel = null; }
    save(); pv = { noGrow:true }; render(); pv = {};
  }
  function runPred(p, done){
    if (p.id === "p1") {
      newAnim(function(){ S.w = 20; save(); if (done) { var d0 = done; done = null; d0(); } });
      later(300, function(){ S.w = 20; save(); render(); later(MV.reduceMotion ? 0 : 700, endAnim); });
      return;
    }
    if (p.id === "p2") {
      newAnim(function(){ if (S.add.indexOf(50) < 0) S.add.push(50); save(); if (done) { var d0 = done; done = null; d0(); } });
      var top = scaleOf(cur(), "freq").ymax * 0.92;
      if (MV.reduceMotion) { later(0, endAnim); return; }
      pv.chip = { x:50, y:top, t:"50", note:"left endpoint included" }; paintPlot(false);
      later(1300, function(){
        var stop = MV.tween({ dur:900, ease:LIN, step:function(t){ var u = t * t; pv.chip = { x:50 + 5 * Math.min(1, t * 2.2), y:top + (6 - top) * u, t:"50" }; paintPlot(false); },
          done:function(){ pv = {}; S.add.push(50); save(); render(); MV.changed(); later(600, endAnim); } });
        anim.stops.push(stop);
      });
      return;
    }
    if (p.id === "p3") {
      newAnim(function(){ S.sc = "rel"; save(); if (done) { var d0 = done; done = null; d0(); } });
      later(300, function(){ S.sc = "rel"; save(); pv = { hiAxis:true }; render(); later(MV.reduceMotion ? 0 : 1400, endAnim); });
      return;
    }
    if (p.id === "p4") {
      newAnim(function(){ S.rev[S.card] = true; save(); if (done) { var d0 = done; done = null; d0(); } });
      pv.arrow = 0; paintPlot(false);
      var stop = MV.tween({ dur:1200, step:function(t){ pv.arrow = t; paintPlot(false); }, done:function(){ later(300, endAnim); } });
      anim.stops.push(stop);
      return;
    }
    if (done) done();
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (S.mode !== "studio") return R("Switch to <strong>Studio</strong> mode.");
    var d = cur();
    if (id === "tc1") {
      if (S.add.length) return R("Undo the values you added, so the data are the original 30.");
      if (d.f.length === 5 && d.n === 30) return { ok:true };
      if (S.w === 10 && S.st === 15) return R("Starting at 15 adds a nearly empty first class.");
      if (S.w === 15) return R("Too wide.");
      if (S.w === 20) return R("Too wide: only 3 classes.");
      return R("Too narrow: that makes " + d.f.length + " classes. Aim for 5.");
    }
    if (id === "tc2") {
      if (S.sc !== "cum") return R("Switch the vertical scale to <strong>Cumulative frequency</strong>.");
      if (S.st !== 20 || S.w !== 10) return R("Use start 20 and width 10.");
      if (S.add.length) return R("Undo the values you added, so the data are the original 30.");
      if (S.sel == null) return R("Tap a bar first.");
      if (S.sel === 2) return { ok:true };
      if (S.sel === 1) return R("By the end of [30, 40) only 10 values are counted. The median is the 15th–16th.");
      if (S.sel === 4) return R("That’s where the cumulative total reaches 30, not 15.");
      return R("The cumulative total first reaches 15 in another class. Read the totals 3, 10, 20, …");
    }
    if (id === "tc3") {
      if (S.st !== 20 || S.w !== 10 || S.sc === "cum") return R("Use start 20, width 10 and a frequency view.");
      if (S.add.some(function(v){ return v < 20 || v >= 70; })) return R("Keep the new values from 20 to 69.");
      if (S.add.length !== 4) return R("Add exactly 4 values (you’ve added " + S.add.length + ").");
      var f = d.f;
      if (f.length === 5 && f[0] === f[4] && f[1] === f[3]) return { ok:true };
      if (S.add.indexOf(50) >= 0 && f[3] > f[1]) return R("50 goes into [50, 60).");
      var a = distOf(S.add, 20, 10).f.concat([0, 0, 0, 0, 0]);
      if (a[0] === a[4] && a[1] === a[3]) return R("The ends started at 3 and 4. Fix the imbalance first.");
      return R("Now the bars are " + f.join(", ") + ": the first and last must match, and so must the second and fourth.");
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: chips drop into bins, piles become bars, the polygon draws ----------
function hero(f){
  var box = $("#hg-hero"); if (!box) return;
  var W = 640, H = 300, L = 50, BW = 76, Y0 = 258, U = 13, CW = 44, edges = [20, 30, 40, 50, 60, 70], F = [3, 7, 10, 6, 4];
  var rng = MV.mdm.seededRandom("mdm33-hero"), special = 10;
  var order = BASE.map(function(v, i){ return i; }).filter(function(i){ return i !== special; });
  order = MV.shuffle ? MV.shuffle(order, 33) : order; order.push(special);
  var chips = BASE.map(function(v, i){ return { v:v, bin:Math.floor((v - 20) / 10), cx:L + 10 + rng() * (5 * BW - 64), cy:16 + rng() * 70 }; });
  var cnt = [0, 0, 0, 0, 0];
  order.forEach(function(i, j){ var c = chips[i]; c.slot = cnt[c.bin]++; c.t0 = i === special ? 900 + j * 110 + 200 : 900 + j * 110; });
  var tSpec = chips[special].t0, END = tSpec + 500 + 1100 + 450 + 200 + 600 + 900;
  function binX(b){ return L + b * BW + BW / 2; }
  function ease(t){ return t < 0 ? 0 : t > 1 ? 1 : t * t; }
  function frame(T){
    var s = '<svg class="hg-svg hg-herosvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Thirty number chips drop into five classes from 20 to 70; the chip 40 pauses at a boundary and drops into [40, 50) because the left endpoint is included. The piles become touching bars of heights 3, 7, 10, 6 and 4, and a frequency polygon joins the midpoints. A frequency table sits beside the histogram.">';
    var tBars = tSpec + 500 + 1100 + 450 + 200, aBar = Math.max(0, Math.min(1, (T - tBars) / 600)), tPoly = tBars + 700, aPoly = Math.max(0, Math.min(1, (T - tPoly) / 800));
    var landed = [0, 0, 0, 0, 0];
    // bars
    F.forEach(function(v, b){ if (aBar > 0) s += '<rect class="hg-bar" opacity="' + aBar.toFixed(2) + '" x="' + (L + b * BW) + '" y="' + (Y0 - v * U) + '" width="' + BW + '" height="' + v * U + '"/>'; });
    // chips
    chips.forEach(function(c, i){
      var px, py, tx = binX(c.bin), ty = Y0 - (c.slot + 1) * U + 6, t = T - c.t0, note = false;
      if (i === special) {
        var bx = L + 2 * BW, by = Y0 - 11 * U - 8;
        if (t <= 0) { px = c.cx; py = c.cy; }
        else if (t < 500) { var u = ease(t / 500); px = c.cx + (bx - c.cx) * u; py = c.cy + (by - c.cy) * u; }
        else if (t < 1600) { px = bx; py = by; note = true; }
        else if (t < 2050) { var u2 = ease((t - 1600) / 450); px = bx + (tx - bx) * Math.min(1, u2 * 2); py = by + (ty - by) * u2; }
        else { px = tx; py = ty; }
        if (t >= 2050) landed[c.bin]++;
      } else if (t <= 0) { px = c.cx; py = c.cy; }
      else if (t < 450) { var u3 = ease(t / 450); px = c.cx + (tx - c.cx) * u3; py = c.cy + (ty - c.cy) * u3; }
      else { px = tx; py = ty; landed[c.bin]++; }
      var op = (T < 400 ? T / 400 : 1) * (1 - aBar);
      if (op > 0.01) s += '<g class="hg-hchip" opacity="' + op.toFixed(2) + '"><rect x="' + (px - CW / 2).toFixed(1) + '" y="' + (py - 6).toFixed(1) + '" width="' + CW + '" height="12" rx="3"/><text x="' + px.toFixed(1) + '" y="' + (py + 4).toFixed(1) + '">' + c.v + "</text></g>";
      if (note) s += '<line class="hg-bd" x1="' + (L + 2 * BW) + '" x2="' + (L + 2 * BW) + '" y1="' + (py + 8).toFixed(1) + '" y2="' + Y0 + '"/><text class="hg-note" x="' + (L + 2 * BW + 28) + '" y="' + (py + 4).toFixed(1) + '" text-anchor="start">left endpoint included</text>';
    });
    // polygon
    if (aPoly > 0) {
      var pts = F.map(function(v, b){ return binX(b) + "," + (Y0 - v * U); }).join(" ");
      s += '<polyline class="hg-poly" points="' + pts + '" pathLength="1" stroke-dasharray="1" stroke-dashoffset="' + (1 - aPoly).toFixed(3) + '"/>';
      if (aPoly >= 1) F.forEach(function(v, b){ s += '<circle class="hg-pt" cx="' + binX(b) + '" cy="' + (Y0 - v * U) + '" r="4.2"/>'; });
    }
    // axis
    s += '<line class="hg-ax" x1="' + (L - 8) + '" x2="' + (L + 5 * BW + 8) + '" y1="' + Y0 + '" y2="' + Y0 + '"/>';
    edges.forEach(function(e, j){ var x = L + j * BW; s += '<line class="hg-ax" x1="' + x + '" x2="' + x + '" y1="' + Y0 + '" y2="' + (Y0 + 5) + '"/><text class="hg-xt" x="' + x + '" y="' + (Y0 + 21) + '">' + e + "</text>"; });
    s += '<text class="hg-axl" x="' + (L + 5 * BW) + '" y="' + (H - 4) + '" text-anchor="end">minutes</text>';
    // table
    var tx0 = 470;
    s += '<rect class="hg-tb" x="' + tx0 + '" y="70" width="156" height="' + (34 + 5 * 26 + 30) + '" rx="8"/><text class="hg-th" x="' + (tx0 + 46) + '" y="94">Class</text><text class="hg-th" x="' + (tx0 + 124) + '" y="94">f</text>';
    F.forEach(function(v, b){ var y = 122 + b * 26; s += '<text class="hg-td" x="' + (tx0 + 46) + '" y="' + y + '">' + cls(edges[b], edges[b + 1]) + '</text><text class="hg-td" x="' + (tx0 + 124) + '" y="' + y + '">' + (T >= END - 1 ? v : landed[b]) + "</text>"; });
    s += '<text class="hg-td hg-tot" x="' + (tx0 + 46) + '" y="' + (122 + 5 * 26 + 6) + '">Total</text><text class="hg-td hg-tot" x="' + (tx0 + 124) + '" y="' + (122 + 5 * 26 + 6) + '">' + (T >= END - 1 ? 30 : landed.reduce(function(a, b){ return a + b; }, 0)) + "</text>";
    box.innerHTML = s + "</svg>";
  }
  var cap = f.cap;
  function last(){ frame(END + 10); if (cap) cap.textContent = "Grouped into classes [20, 30) … [60, 70): frequencies 3, 7, 10, 6, 4, with a frequency polygon through the midpoints."; }
  if (MV.reduceMotion) { last(); return; }
  if (cap) cap.textContent = "Thirty values in a cloud";
  var t0 = null, phase = 0;
  function tick(now){
    if (t0 == null) t0 = now;
    var T = now - t0;
    if (cap) {
      var ph = T < 900 ? 0 : T < tSpec + 500 ? 1 : T < tSpec + 1600 ? 2 : T < tSpec + 2250 ? 3 : T < tSpec + 2950 ? 4 : 5;
      if (ph !== phase) { phase = ph; cap.textContent = ["Thirty values in a cloud", "Each value drops into its class", "40 sits on a boundary: the left endpoint is included", "So 40 goes in [40, 50)", "The piles become touching bars", "A frequency polygon joins the midpoints"][ph]; }
    }
    if (T >= END) { last(); return; }
    frame(T); requestAnimationFrame(tick);
  }
  frame(0); requestAnimationFrame(tick);
}

// ---------- Part 3: The right graph (three stations) ----------
function sketch(type, kind){
  var s = '<svg class="hg-svg hg-sk" viewBox="0 0 260 150" role="img" aria-label="', body = "", aria = "", rng = MV.mdm.seededRandom("mdm33-" + type + kind), i;
  var bx0 = 24, bx1 = 248, yb = 126;
  function axis(){ return '<line class="hg-ax" x1="' + bx0 + '" x2="' + bx1 + '" y1="' + yb + '" y2="' + yb + '"/>'; }
  function bars(hs, labs, gap){
    var n = hs.length, mx = Math.max.apply(null, hs), w = (bx1 - bx0) / n, h = "";
    hs.forEach(function(v, j){ var bh = v / mx * 100, x = bx0 + j * w + (gap ? w * 0.15 : 0), bw = gap ? w * 0.7 : w; h += '<rect class="hg-bar" x="' + x.toFixed(1) + '" y="' + (yb - bh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '"/>'; });
    if (labs) labs.forEach(function(t, j){ var x = gap ? bx0 + (j + 0.5) * w : bx0 + j * w * (n / (labs.length - 1)); h += '<text class="hg-xt hg-sm" x="' + x.toFixed(1) + '" y="' + (yb + 15) + '">' + t + "</text>"; });
    return h;
  }
  function many(n){ var a = []; for (var j = 0; j < n; j++) a.push(1 + Math.floor(rng() * 3)); return a; }
  function pie(cx, cy, r, parts){
    var tot = parts.reduce(function(a, b){ return a + b; }, 0), a0 = -Math.PI / 2, h = "";
    parts.forEach(function(p, j){ var a1 = a0 + p / tot * 2 * Math.PI, lg = a1 - a0 > Math.PI ? 1 : 0;
      h += '<path class="hg-slice hg-s' + (j % 4) + '" d="M' + cx + " " + cy + "L" + (cx + r * Math.cos(a0)).toFixed(1) + " " + (cy + r * Math.sin(a0)).toFixed(1) + "A" + r + " " + r + " 0 " + lg + " 1 " + (cx + r * Math.cos(a1)).toFixed(1) + " " + (cy + r * Math.sin(a1)).toFixed(1) + 'Z"/>'; a0 = a1; });
    return h;
  }
  function boxp(y, q){ var X = function(v){ return bx0 + (v - 40) / 60 * (bx1 - bx0); };
    return '<line class="hg-ax" x1="' + X(q[0]) + '" x2="' + X(q[4]) + '" y1="' + y + '" y2="' + y + '"/><rect class="hg-box" x="' + X(q[1]) + '" y="' + (y - 13) + '" width="' + (X(q[3]) - X(q[1])) + '" height="26"/><line class="hg-ax hg-med" x1="' + X(q[2]) + '" x2="' + X(q[2]) + '" y1="' + (y - 13) + '" y2="' + (y + 13) + '"/>'; }
  function txt(lines){ return lines.map(function(t, j){ return '<text class="hg-stem" x="20" y="' + (26 + j * 22) + '">' + t + "</text>"; }).join(""); }
  if (type === "hist") {
    if (kind === "cat") { body = axis() + bars([7, 4, 5, 3], ["A", "B", "C", "D", ""], false); aria = "Touching bars labelled with service names placed on a number line"; }
    else if (kind === "disc") { body = axis() + bars([5, 9, 6, 3, 1], ["0", "1", "2", "3", "4", "5"], false); aria = "Touching bars for 0 to 4 pets"; }
    else if (kind === "small") { body = axis() + bars([1, 3, 6, 7, 3], ["50", "60", "70", "80", "90", "100"], false); aria = "A histogram of 20 marks with 5 classes"; }
    else if (kind === "two") { body = axis() + bars([1, 3, 5, 3, 1, 2, 4, 6, 4, 2], null, false) + '<text class="hg-xt hg-sm" x="80" y="141">class 1</text><text class="hg-xt hg-sm" x="192" y="141">class 2</text>'; aria = "Two histograms side by side"; }
    else { body = axis() + bars([2, 5, 9, 12, 8, 4, 1], ["150", "160", "170", "180", "190", "200", "210", "220"].slice(0, 8), false); aria = "A histogram of heights grouped into classes"; }
  } else if (type === "bar") {
    if (kind === "cat") { body = axis() + bars([7, 4, 5, 3], ["A", "B", "C", "D"], true); aria = "Separate bars, one per streaming service"; }
    else if (kind === "disc") { body = axis() + bars([5, 9, 6, 3, 1], ["0", "1", "2", "3", "4"], true); aria = "Separate bars for 0 to 4 pets"; }
    else if (kind === "two") { body = axis() + bars([3, 4, 5, 6, 4, 5, 6, 7, 3, 2], null, true); aria = "Pairs of bars, one per mark"; }
    else { body = axis() + bars(many(kind === "small" ? 20 : 70), null, true); aria = "Dozens of thin one-value bars"; }
  } else if (type === "circle") {
    if (kind === "cat") { body = pie(130, 72, 62, [7, 4, 5, 3]); aria = "A circle graph with 4 slices"; }
    else if (kind === "disc") { body = pie(130, 72, 62, [5, 9, 6, 3, 1]); aria = "A circle graph with 5 slices"; }
    else if (kind === "two") { body = pie(70, 72, 52, [3, 5, 4, 2]) + pie(190, 72, 52, [2, 4, 6, 3]); aria = "Two circle graphs"; }
    else { body = pie(130, 72, 62, many(kind === "small" ? 20 : 70)); aria = "A circle graph with dozens of thin slices"; }
  } else if (type === "stem") {
    if (kind === "cat") { body = txt(["? | ? ? ?", "Stems need numbers:", "service names have no digits."]); aria = "A stem-and-leaf plot cannot hold names"; }
    else if (kind === "disc") { body = txt(["0 | 0 0 0 0 0 1 1 1 1 1 1 1 1 1", "     2 2 2 2 2 2 3 3 3 4", "(every value has stem 0)"]); aria = "Every value sits on stem 0"; }
    else if (kind === "small") { body = txt(["5 | 8", "6 | 2 5 9", "7 | 0 3 4 6 8 8", "8 | 1 2 4 5 7 9", "9 | 0 3 6"]); aria = "A stem-and-leaf plot of 20 marks"; }
    else if (kind === "two") { body = txt(["class 1        class 2", "  8 5 | 6 | 2", "9 7 4 1 | 7 | 0 3 5", "  6 3 0 | 8 | 1 4 6 8"]); aria = "A back-to-back stem-and-leaf plot"; }
    else { body = txt(["15 | 2 3 4 4 5 6 7 7 8 9 9 …", "16 | 0 0 1 1 2 3 3 4 4 5 5 6 …", "17 | 0 0 0 1 1 2 2 3 3 4 4 4 5 …", "18 | 0 1 2 2 3 4 5 6 7 …", "(100 leaves)"]); aria = "Long rows of leaves for 100 heights"; }
  } else {
    if (kind === "cat") { body = txt(["Box plots need numbers", "to find quartiles:", "services have none."]); aria = "Box plots cannot be drawn for categories"; }
    else if (kind === "two") { body = boxp(40, [45, 58, 66, 74, 92]) + boxp(96, [52, 66, 75, 82, 97]) + '<text class="hg-xt hg-sm" x="26" y="20" text-anchor="start">class 1</text><text class="hg-xt hg-sm" x="26" y="76" text-anchor="start">class 2</text>'; aria = "Two box plots on one scale"; }
    else { body = boxp(70, [42, 58, 68, 76, 96]); aria = "A single box plot"; }
  }
  return s + MV.esc(aria) + '">' + body + "</svg>";
}
function broken(id){
  var s = '<svg class="hg-svg hg-bk" viewBox="0 0 300 170" role="img" aria-label="', body = "", aria = "", yb = 140, x0 = 30, x1 = 290;
  function rect(x, w, h){ return '<rect class="hg-bar" x="' + x.toFixed(1) + '" y="' + (yb - h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '"/>'; }
  function lab(x, t){ return '<text class="hg-xt hg-sm" x="' + x.toFixed(1) + '" y="' + (yb + 15) + '">' + t + "</text>"; }
  var ax = '<line class="hg-ax" x1="' + x0 + '" x2="' + x1 + '" y1="' + yb + '" y2="' + yb + '"/><line class="hg-ax" x1="' + x0 + '" x2="' + x0 + '" y1="20" y2="' + yb + '"/>';
  if (id === "g1") {
    var c = [["red", 9], ["blue", 12], ["green", 7], ["purple", 5], ["black", 8]], w = (x1 - x0) / 5;
    c.forEach(function(q, j){ body += rect(x0 + j * w + w * 0.15, w * 0.7, q[1] * 9) + lab(x0 + (j + 0.5) * w, q[0]); });
    aria = "Bars with gaps labelled red, blue, green, purple and black, titled as a histogram";
  } else if (id === "g2") {
    var f = [6, 9, 12, 8], ed = ["0", "10", "20", "40", "80"], w2 = (x1 - x0) / 4;
    f.forEach(function(v, j){ body += rect(x0 + j * w2, w2, v * 9); }); ed.forEach(function(t, j){ body += lab(x0 + j * w2, t); });
    aria = "Four touching bars of equal width over the class edges 0, 10, 20, 40 and 80";
  } else {
    var rng = MV.mdm.seededRandom("mdm33-g3"), w3 = (x1 - x0) / 70;
    for (var j = 0; j < 70; j++) body += rect(x0 + j * w3 + w3 * 0.2, w3 * 0.6, 12 + Math.floor(rng() * 3) * 14);
    body += lab(x0 + 4, "151") + lab(x1 - 6, "196");
    aria = "Seventy thin bars, one for each height, all about the same height";
  }
  return s + MV.esc(aria) + '">' + body + ax + "</svg>";
}
function pieSVG(rfs, labels, aria){
  var cx = 110, cy = 100, r = 84, a0 = -Math.PI / 2, h = '<svg class="hg-svg hg-pie" viewBox="0 0 330 200" role="img" aria-label="' + MV.esc(aria) + '">', tot = 0;
  rfs.forEach(function(p, j){ var a1 = a0 + p * 2 * Math.PI, lg = a1 - a0 > Math.PI ? 1 : 0;
    h += '<path class="hg-slice hg-s' + j + '" d="M' + cx + " " + cy + "L" + (cx + r * Math.cos(a0)).toFixed(1) + " " + (cy + r * Math.sin(a0)).toFixed(1) + "A" + r + " " + r + " 0 " + lg + " 1 " + (cx + r * Math.cos(a1)).toFixed(1) + " " + (cy + r * Math.sin(a1)).toFixed(1) + 'Z"/>';
    var am = (a0 + a1) / 2; h += '<text class="hg-pl" x="' + (cx + r * 0.62 * Math.cos(am)).toFixed(1) + '" y="' + (cy + r * 0.62 * Math.sin(am) + 4).toFixed(1) + '">' + Math.round(p * 360) + "°</text>"; a0 = a1; tot += p; });
  if (tot < 0.999) { var lg2 = (1 - tot) > 0.5 ? 1 : 0; h += '<path class="hg-gap" d="M' + cx + " " + cy + "L" + (cx + r * Math.cos(a0)).toFixed(1) + " " + (cy + r * Math.sin(a0)).toFixed(1) + "A" + r + " " + r + " 0 " + lg2 + " 1 " + cx + " " + (cy - r) + 'Z"/>'; }
  labels.forEach(function(t, j){ h += '<rect class="hg-slice hg-s' + j + '" x="214" y="' + (50 + j * 26) + '" width="14" height="14"/><text class="hg-lg" x="234" y="' + (62 + j * 26) + '">' + t + "</text>"; });
  return h + "</svg>";
}
function part3(host, api){
  var S = api.S, P = api.content || {}, CARDS = P.cards || [], GR = P.graphs || [], PR = P.problems || [], BK = P.broken || [], CI = P.circle;
  if (!CARDS.length) return {};
  if (["s1", "s2", "s3"].indexOf(S.cur) < 0) S.cur = "s1";
  S.it = obj(S.it); S.cs = obj(S.cs);
  var msgs = {};
  function ist(id){ var x = S.it[id] = obj(S.it[id]); x.tries = x.tries || 0; return x; }
  function okFor(c, g){ var a = MV.ans(c); return Array.isArray(a) ? a.indexOf(g) >= 0 : a === g; }
  function gT(id){ return GR.filter(function(g){ return g.id === id; })[0].t; }
  function done(sid){ return sid === "s1" ? CARDS.every(function(c){ return ist(c.id).solved; }) : sid === "s2" ? BK.every(function(b){ return ist(b.id).solved; }) : !!ist("circ").solved; }
  var tabOpts = [{ id:"s1", t:"" }, { id:"s2", t:"" }, { id:"s3", t:"" }];
  function tabText(){ ["Match the data", "Broken graphs", "Circle graph check"].forEach(function(t, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + t + (done(tabOpts[i].id) ? ' <span aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="rg-tabs"></div><div id="rg-body" class="hg-p3"></div>';
  tabText();
  var tabsR = radios($("#rg-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });

  function s1HTML(){
    var sel = S.cs.card, pvG = S.cs.g, h = '<p>Tap a data card, then tap a graph type to preview it. Press <strong>Confirm</strong> when the graph fits the data. <span class="mdm-model">model data</span></p><div class="hg-cards" role="group" aria-label="Data cards">';
    h += CARDS.map(function(c){ var x = ist(c.id); return '<button type="button" class="hg-dc' + (x.solved ? " hg-placed" : "") + '" data-card="' + c.id + '" data-k="rgc' + c.id + '" aria-pressed="' + (sel === c.id) + '"' + (x.solved ? " disabled" : "") + ">" + c.t + (x.solved ? '<span class="hg-on-g">✓ ' + gT(x.on) + "</span>" : "") + "</button>"; }).join("") + "</div>";
    if (sel && !ist(sel).solved) {
      var card = CARDS.filter(function(c){ return c.id === sel; })[0];
      h += '<p class="hg-sh">Graph type for “' + card.t + '”</p><div class="hg-gts" role="group" aria-label="Graph types">' + GR.map(function(g){ return '<button type="button" class="btn ghost sm" data-gt="' + g.id + '" data-k="rgg' + g.id + '" aria-pressed="' + (pvG === g.id) + '">' + g.t + "</button>"; }).join("") + "</div>";
      if (pvG) h += '<div class="hg-prev"><p class="tiny muted">Preview: ' + gT(pvG) + "</p>" + sketch(pvG, card.kind) + '<div class="q-actions"><button type="button" class="btn primary sm" id="rg-conf" data-k="rgconf">Confirm</button></div></div>';
      if (msgs[sel]) h += MV.fbHTML("bad", msgs[sel]);
    }
    var last = S.cs.last && ist(S.cs.last).solved ? CARDS.filter(function(c){ return c.id === S.cs.last; })[0] : null;
    if (last) h += MV.fbHTML("good", "<strong>✓ " + last.t + ": " + gT(ist(last.id).on) + ".</strong> " + last.why + (ist(last.id).first ? "" : ' <span class="muted">(not first try)</span>'));
    if (done("s1")) h += '<p class="hg-after">All five placed. The type of data decides the graph: categories get bars with gaps (or a circle), grouped numbers get a histogram.</p>';
    return h;
  }
  function s2HTML(){
    return "<p>Each graph has one problem. Choose it from the chips.</p>" + BK.map(function(b){
      var x = ist(b.id), fb = x.solved ? MV.fbHTML("good", "<strong>✓ " + PR.filter(function(p){ return p.id === MV.ans(b); })[0].t + ".</strong> " + b.why + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : msgs[b.id] ? MV.fbHTML("bad", msgs[b.id]) : "";
      return '<div class="hg-bkc" data-bk="' + b.id + '"><p class="hg-sh">' + b.title + "</p>" + broken(b.id) +
        '<div class="hg-gts" role="group" aria-label="What is wrong?">' + PR.map(function(p){ return '<button type="button" class="btn ghost sm" data-pr="' + p.id + '" data-k="rg' + b.id + p.id + '"' + (x.solved ? " disabled" : "") + (x.solved && MV.ans(b) === p.id ? ' aria-pressed="true"' : "") + ">" + p.t + "</button>"; }).join("") + "</div>" + fb + "</div>";
    }).join("");
  }
  function s3HTML(){
    var x = ist("circ"), h = "<p>" + CI.title + ' <span class="mdm-model">' + CI.unit + "</span>: find each slice’s angle. Angle = relative frequency × 360°.</p>";
    h += '<div class="hg-angs">' + CI.rows.map(function(r){ var v = (S.cs.ang && S.cs.ang[r.id]) || ""; return '<div class="numrow"><label for="rg-' + r.id + '">' + r.t + " (" + d2(r.rf) + ")</label><input class=\"numin hg-ain\" id=\"rg-" + r.id + '" data-ang="' + r.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(v) + '"' + (x.solved ? " disabled" : "") + '><span aria-hidden="true">°</span></div>'; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" id="rg-ang" data-k="rgang">Check</button></div>' + (msgs.circ ? MV.fbHTML("bad", msgs.circ) : "");
    else {
      h += MV.fbHTML("good", "<strong>✓ Correct: 126°, 90°, 72°, 72°.</strong> Each angle is the relative frequency × 360°." + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      var alt = !!S.cs.alt, rfs = alt ? [0.35, 0.25, 0.2, 0.15] : CI.rows.map(function(r){ return r.rf; });
      h += pieSVG(rfs, CI.rows.map(function(r){ return r.t; }), "Circle graph with angles " + rfs.map(function(p){ return Math.round(p * 360) + "°"; }).join(", ") + (alt ? ", leaving a gap of 18°." : "."));
      h += '<details class="alg" id="rg-det"' + (S.cs.open ? " open" : "") + '><summary>Check it with data</summary><p>126° + 90° + 72° + 72° = 360°, because 0.35 + 0.25 + 0.20 + 0.20 = 1. The angles total 360° only if the relative frequencies total 1.</p>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="rg-alt" data-k="rgalt" aria-pressed="' + alt + '">' + (alt ? "Back to the real data" : "Try 0.35, 0.25, 0.20, 0.15 (total 0.95)") + "</button></div>" +
        (alt ? '<p class="tiny">The angles total 126° + 90° + 72° + 54° = 342°: an 18° gap is left, so something is missing from the data.</p>' : "") + "</details>";
    }
    return h;
  }
  function paint(){
    tabText(); tabsR.refresh();
    var body = $("#rg-body", host);
    MV.keepFocus(body, function(){ body.innerHTML = S.cur === "s1" ? s1HTML() : S.cur === "s2" ? s2HTML() : s3HTML(); });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.card) { S.cs.card = b.dataset.card; S.cs.g = null; api.save(); paint(); return; }
    if (b.dataset.gt) { S.cs.g = b.dataset.gt; api.save(); paint(); return; }
    if (b.id === "rg-conf") {
      var c = CARDS.filter(function(z){ return z.id === S.cs.card; })[0], x = ist(c.id), g = S.cs.g;
      if (okFor(c, g)) { x.solved = true; x.on = g; x.first = x.tries === 0; msgs[c.id] = null; S.cs.last = c.id; S.cs.card = null; S.cs.g = null; }
      else { x.tries++; msgs[c.id] = "<strong>✗ Not quite.</strong> Check it with data: " + ((c.wrong || {})[g] || "This graph doesn’t fit the data.") + " Try another graph."; }
      api.save(); paint(); MV.focusFb(host.querySelector("#rg-body")); return;
    }
    if (b.dataset.pr) {
      var bk = b.closest("[data-bk]").dataset.bk, item = BK.filter(function(z){ return z.id === bk; })[0], y = ist(bk);
      if (MV.ans(item) === b.dataset.pr) { y.solved = true; y.first = y.tries === 0; msgs[bk] = null; }
      else { y.tries++; msgs[bk] = "<strong>✗ Not quite.</strong> " + ((item.wrong || {})[b.dataset.pr] || "Look again.") + " Try another chip."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-bk="' + bk + '"]')); return;
    }
    if (b.id === "rg-ang") {
      var z = ist("circ"), A = S.cs.ang || {}, bad = [];
      CI.rows.forEach(function(r){ var v = MV.parseNum(String(A[r.id] || "").replace(/°/g, "")); v = v && v.length === 1 ? v[0] : null;
        if (v == null || Math.abs(v - MV.ans(r)) > 0.01) bad.push(r.t + (v != null && Math.abs(v - r.rf * 100) < 0.01 ? ": multiply by 360°, not 100." : v != null && Math.abs(v - r.rf) < 1e-9 ? ": that’s the relative frequency; × 360°." : ": " + d2(r.rf) + " × 360°.")); });
      if (!bad.length) { z.solved = true; z.first = z.tries === 0; msgs.circ = null; }
      else { z.tries++; msgs.circ = "<strong>✗ Not quite.</strong> " + bad.join(" ") + " Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector("#rg-body")); return;
    }
    if (b.id === "rg-alt") { S.cs.alt = !S.cs.alt; S.cs.open = true; api.save(); paint(); }
  });
  host.addEventListener("input", function(e){ var t = e.target; if (t.dataset && t.dataset.ang) { S.cs.ang = obj(S.cs.ang); S.cs.ang[t.dataset.ang] = t.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.ang) { e.preventDefault(); var b = $("#rg-ang", host); if (b) b.click(); } });
  host.addEventListener("toggle", function(e){ if (e.target.id === "rg-det") { S.cs.open = e.target.open; api.save(); } }, true);
  paint();
  return {};
}

// ---------- Performance task: Left-leaning histogram ----------
var task = (function(){
  var api = null, ED = [0, 10, 20, 30, 40, 50];
  function st(){ var s = api ? api.S : {}; if (!Array.isArray(s.f) || s.f.length !== 5) s.f = [1, 2, 3, 4, 1]; s.f = s.f.map(function(v){ return clampI(v, 0, 10, 0); }); return s; }
  function read(){ return { f:st().f.slice() }; }
  function key(d){ return d.f.join(", "); }
  function paint(){
    var pv = $("#ll-pv"); if (!pv) return;
    var d = read(), f = d.f, n = f.reduce(function(a, b){ return a + b; }, 0), run = 0, cum = f.map(function(x){ run += x; return run; });
    var dd = { edges:ED, f:f, n:n, rel:f.map(function(x){ return n ? x / n : 0; }), cum:cum }, sc = scaleOf(dd, "freq");
    var med = medianClass(dd);
    pv.innerHTML = histSVG({ edges:ED, ys:f, ymax:Math.max(sc.ymax, 11), ticks:[0, 2, 4, 6, 8, 10].map(function(v){ return { v:v, t:String(v) }; }), labels:f.map(String), yLabel:"frequency", xLabel:"value", poly:false,
        aria:"Histogram with frequencies " + f.join(", ") + " in the classes [0, 10) to [40, 50)." }) +
      MV.tableHTML({ head:["Class", "Frequency", "Relative", "Cumulative"], caption:"Your frequency table", rows:f.map(function(x, i){ return [cls(ED[i], ED[i + 1]), String(x), n ? d2(x / n) : "—", String(cum[i])]; }).concat([["<strong>Total</strong>", "<strong>" + n + "</strong>", n ? "1.00" : "—", ""]]) }) +
      '<dl class="read" aria-live="polite">' + MV.readoutHTML([["Median class", n ? med.t : "—"]]) + "</dl>";
  }
  return {
    render:function(inp, pvw, a){
      api = a; st();
      inp.innerHTML = '<div class="ll-in">' + [0, 1, 2, 3, 4].map(function(i){ return '<label class="slider"><span class="slider-top"><span><i>f</i>' + "₁₂₃₄₅"[i] + " " + cls(ED[i], ED[i + 1]) + '</span><output id="ll-o' + i + '">' + api.S.f[i] + '</output></span><input type="range" min="0" max="10" step="1" id="ll-s' + i + '" data-ll="' + i + '" value="' + api.S.f[i] + '" aria-valuetext="' + api.S.f[i] + '"></label>'; }).join("") + "</div>";
      pvw.innerHTML = '<div id="ll-pv" class="ll-pv"></div>';
      inp.addEventListener("input", function(e){ var t = e.target; if (t.dataset.ll == null) return; var i = +t.dataset.ll; api.S.f[i] = clampI(t.value, 0, 10, 0); $("#ll-o" + i).textContent = api.S.f[i]; t.setAttribute("aria-valuetext", String(api.S.f[i])); api.save(); paint(); api.update(); });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var f = d.f, n = f.reduce(function(a, b){ return a + b; }, 0);
      return [n === 20, f.every(function(x){ return x >= 1; }), f[0] < f[1] && f[1] < f[2] && f[2] < f[3] && f[4] < f[3], f[0] + f[1] + f[2] <= 9 && f[0] + f[1] + f[2] + f[3] >= 11, f[4] === 2];
    },
    key:key,
    label:function(k){ return "Frequencies " + k; },
    text:function(k){ return k; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
