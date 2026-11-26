// MDM4U 15 Combinations & Probability: hero (a deck fans out, two cards are dealt, the hearts lift out: 78/1326 = 1/17, and the
// ghost (1/4)² = 1/16 is crossed out), Hand dealer (Explore: Group or Deck source, event builder, Count / Simulate (D6, seeded) /
// Order check (D1 tree) modes), Lotteries and fair games (Part 3: mini-lottery ticket checker and case builder, the 6-of-49
// scale, is it fair?), Design a marble bag task. Every count comes from MV.mdm (exact arithmetic); simulations are seeded.
(function(){
"use strict";
var $ = MV.$, F = MV.mdm.frac, css = MV.css;
function M(s){ return MV.m(s); }
var NNB = " ";   // narrow no-break space (thousands)
function big(v){ return MV.mdm.fmt(v).replace(/ /g, NNB); }
function C(n, r){ if (r < 0 || r > n) return 0; var v = MV.mdm.nCr(n, r); return typeof v === "bigint" ? Number(v) : v; }
function Pn(n, r){ if (r < 0 || r > n) return 0; var v = MV.mdm.nPr(n, r); return typeof v === "bigint" ? Number(v) : v; }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function Pw(w){ return '<span class="m"><i>P</i>(' + w + ")</span>"; }
function ftxt(f){ return F.txt(f).replace(/ /g, NNB); }
function d4(f){ return (f.n / f.d).toFixed(4); }
// "60/120 = 1/2 = 0.5000": the count fraction, lowest terms, 4 decimals
function probTxt(fav, tot){ var f = F.of(fav, tot), s = big(fav) + "/" + big(tot); if (f.n !== fav || f.d !== tot) s += " = " + ftxt(f); if (f.d !== 1) s += (F.exactDec(f, 4) ? " = " : " ≈ ") + d4(f); return s; }
function h32(s){ var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function money(v){ return "$" + v.toFixed(2); }
function sliderHTML(id, label, param){
  var col = "var(" + ({ n:"--pen", d:"--p-d", k:"--p-k" }[param] || "--pen") + ")";
  return '<label class="slider"><span class="slider-top"><span id="' + id + '-lab">' + label + '</span><output id="' + id + '-out" style="color:' + col + '"></output></span><input type="range" id="' + id + '" data-csl="' + id + '" step="1" style="accent-color:' + col + '"></label>';
}
function setSl(root, id, v, min, max, label){ var el = $("#" + id, root); el.min = min; el.max = max; el.value = v; $("#" + id + "-out", root).textContent = v; el.setAttribute("aria-valuetext", String(v)); if (label != null) $("#" + id + "-lab", root).innerHTML = label; }
function barHTML(segs, max, label){
  return '<div class="cp-bar" role="img" aria-label="' + MV.esc(label) + '">' + segs.map(function(s){ return s.v > 0 ? '<span class="cp-seg ' + s.cls + '" style="width:' + (100 * s.v / max).toFixed(2) + '%"><span>' + (s.t != null ? s.t : s.v) + "</span></span>" : ""; }).join("") + "</div>";
}

// @component radioGroup (copied from MDM4U 11) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// @component D1 treeDiagram — copied from MDM4U 01 (display-only use here: tap:false, children() for draws without replacement).
// t = treeDiagram(host, { children(path) -> [{id, t, p}], leafText(path), leafAria(path), leafNote(path), showP, tap, orient,
//   minLeaf, levelH, rowH, colW, maxH, label }); t.mark(keys); t.reveal(r); t.grow(from, to, done) -> cancel(); t.set(o); t.render()
function treeDiagram(host, o){
  var marked = {}, rev = Infinity, fk = null, lastW = 0;
  host.classList.add("d1"); if (o.bare) host.classList.add("bare");
  host.innerHTML = '<div class="d1-scroll"><div class="d1-box"><svg class="d1-svg" aria-hidden="true" focusable="false"></svg><div class="d1-in" role="group"></div></div></div>';
  var scroll = host.querySelector(".d1-scroll"), box = host.querySelector(".d1-box"), svg = host.querySelector(".d1-svg"), inner = host.querySelector(".d1-in");
  function key(p){ return p.join(","); }
  function branchesAt(p){ if (o.children) return o.children(p) || []; var s = (o.stages || [])[p.length]; return s ? s.branches : []; }
  function build(){
    var leaves = [], all = [], root = { path:[], depth:0 };
    (function rec(n){ all.push(n); var bs = branchesAt(n.path); if (!bs.length) { n.leaf = true; leaves.push(n); return; }
      n.kids = bs.map(function(b){ return { path:n.path.concat([b.id]), b:b, depth:n.depth + 1, parent:n }; }); n.kids.forEach(rec); })(root);
    var D = 0; leaves.forEach(function(l){ D = Math.max(D, l.depth); });
    return { root:root, leaves:leaves, all:all, D:D };
  }
  function centre(n, prop){ if (n.leaf) return [n[prop], n[prop]]; var lo = Infinity, hi = -Infinity; n.kids.forEach(function(c){ var r = centre(c, prop); lo = Math.min(lo, r[0]); hi = Math.max(hi, r[1]); }); n[prop] = (lo + hi) / 2; return [lo, hi]; }
  function layout(T, W){
    var nL = T.leaves.length, D = T.D, orient = o.orient || "auto", names = o.stageNames !== false && !o.bare;
    if (orient === "auto") orient = nL * (o.minLeaf || 58) <= W ? "down" : "right";
    var g = { orient:orient, names:names };
    if (orient === "down") {
      var lw = W / Math.max(1, nL), lh = o.levelH || 58, top = 16;
      T.leaves.forEach(function(l, i){ l.x = lw * (i + 0.5); });
      centre(T.root, "x");
      T.all.forEach(function(n){ n.y = top + n.depth * lh; });
      g.leafY = top + D * lh + 38; g.H = g.leafY + 22; g.W = W;
    } else {
      var rowH = o.rowH || 36, top2 = names ? 30 : 10, left = 14, leafW = o.leafW || 92;
      var colW = Math.max(40, Math.min(o.colW || 96, (W - left - leafW - 30) / Math.max(1, D)));
      T.leaves.forEach(function(l, i){ l.y = top2 + rowH * (i + 0.5); });
      centre(T.root, "y");
      T.all.forEach(function(n){ n.x = left + n.depth * colW; });
      g.leafX = left + D * colW + 24; g.H = top2 + nL * rowH + 8; g.W = Math.max(W, g.leafX + leafW + 8); g.colW = colW; g.left = left;
    }
    return g;
  }
  function render(){
    var T = build(), W = Math.max(220, Math.floor(scroll.clientWidth || host.clientWidth || 320)); lastW = W;
    var g = layout(T, W), on = {}, onLeaf = {};
    Object.keys(marked).forEach(function(k){ if (!marked[k]) return; onLeaf[k] = 1; var p = k.split(","); for (var i = 1; i <= p.length; i++) on[p.slice(0, i).join(",")] = 1; });
    host.classList.toggle("right", g.orient === "right"); host.classList.toggle("down", g.orient === "down");
    if (o.maxH) scroll.style.maxHeight = o.maxH + "px";
    box.style.height = g.H + "px"; box.style.width = g.W + "px";
    svg.setAttribute("width", g.W); svg.setAttribute("height", g.H); svg.setAttribute("viewBox", "0 0 " + g.W + " " + g.H);
    var e = "", hi = "", h = "";
    var fx = function(v){ return Math.round(v * 10) / 10; };
    T.all.forEach(function(n){
      if (!n.parent) return;
      var f = Math.max(0, Math.min(1, rev - (n.depth - 1))); if (f <= 0) return;
      var x0 = n.parent.x, y0 = n.parent.y, x1 = x0 + (n.x - x0) * f, y1 = y0 + (n.y - y0) * f;
      var seg = "M" + fx(x0) + " " + fx(y0) + "L" + fx(x1) + " " + fx(y1);
      e += seg; if (on[key(n.path)] && f >= 1) hi += seg;
      if (o.showP && n.b.p != null && f >= 1) h += '<span class="d1-p" style="left:' + fx((x0 + n.x) / 2) + "px;top:" + fx((y0 + n.y) / 2 - (g.orient === "down" ? 0 : 10)) + 'px">' + n.b.p + "</span>";
      if (f > 0.55) h += '<span class="d1-lab' + (on[key(n.path)] ? " on" : "") + '" style="left:' + fx(n.x) + "px;top:" + fx(n.y) + "px" + (f < 1 ? ";opacity:" + ((f - 0.55) / 0.45).toFixed(2) : "") + '">' + n.b.t + "</span>";
    });
    T.leaves.forEach(function(l){ if (l.leaf && T.all.length > 1) {
      var k = key(l.path), x = g.orient === "down" ? l.x : g.leafX, y = g.orient === "down" ? g.leafY : l.y;
      if (rev < T.D) return;
      var con = g.orient === "right" ? "M" + fx(l.x + 14) + " " + fx(l.y) + "L" + fx(x - 4) + " " + fx(l.y) : "M" + fx(l.x) + " " + fx(l.y + 13) + "L" + fx(l.x) + " " + fx(y - 15);
      e += con; if (onLeaf[k]) hi += con;
      var txt = o.leafText ? o.leafText(l.path) : l.path.join(""), note = o.leafNote ? o.leafNote(l.path) : "";
      var aria = (o.leafAria ? o.leafAria(l.path) : MV.plain(txt)) + (note ? ", " + MV.plain(note) : "");
      if (o.tap === false) h += '<span class="d1-leaf' + (onLeaf[k] ? " on" : "") + '" style="left:' + fx(x) + "px;top:" + fx(y) + 'px">' + txt + (note ? ' <small>' + note + "</small>" : "") + "</span>";
      else h += '<button type="button" class="d1-leaf' + (onLeaf[k] ? " on" : "") + '" data-key="' + k + '" aria-pressed="' + !!onLeaf[k] + '" aria-label="' + MV.esc(aria) + '" tabindex="' + (k === fk ? 0 : -1) + '" style="left:' + fx(x) + "px;top:" + fx(y) + 'px">' + txt + (note ? ' <small>' + note + "</small>" : "") + "</button>";
    } });
    h = '<span class="d1-root" style="left:' + fx(T.root.x) + "px;top:" + fx(T.root.y) + 'px"></span>' + h;
    if (g.names && g.orient === "right") (o.stages || []).forEach(function(s, i){ if (rev >= i + 0.55) h += '<span class="d1-stage" style="left:' + fx(g.left + (i + 1) * g.colW) + 'px;top:4px">' + s.name + "</span>"; });
    svg.innerHTML = (hi ? '<path class="d1-hi" d="' + hi + '"/>' : "") + '<path class="d1-e" d="' + e + '"/>';
    var had = inner.contains(document.activeElement) ? document.activeElement.dataset.key : null;
    inner.setAttribute("aria-label", o.label || "Tree diagram");
    inner.innerHTML = h;
    var leafBtns = inner.querySelectorAll("button.d1-leaf");
    if (leafBtns.length && !inner.querySelector('button[tabindex="0"]')) { leafBtns[0].tabIndex = 0; fk = leafBtns[0].dataset.key; }
    if (had) { var b = inner.querySelector('[data-key="' + had + '"]'); if (b) b.focus({ preventScroll:true }); }
  }
  if (window.ResizeObserver) new ResizeObserver(function(){ var w = Math.floor(scroll.clientWidth); if (w && Math.abs(w - lastW) > 2) render(); }).observe(scroll);
  return {
    mark:function(keys){ marked = {}; (keys || []).forEach(function(k){ marked[k] = 1; }); },
    reveal:function(r){ rev = r == null ? Infinity : r; },
    grow:function(from, to, done){
      var live = true, stop = null, lvl = from;
      function next(){
        if (!live) return;
        if (lvl >= to) { rev = Infinity; render(); if (done) done(); return; }
        var a = lvl; stop = MV.tween({ dur:620, ease:function(t){ return t; }, step:function(t){ rev = a + t; render(); }, done:function(){ lvl = a + 1; rev = lvl; render(); setTimeout(next, MV.reduceMotion ? 0 : 380); } });
      }
      next();
      return function(){ live = false; if (stop) stop(); };
    },
    set:function(n){ Object.keys(n).forEach(function(k){ o[k] = n[k]; }); },
    render:render
  };
}

// @component D6 simulator — deal version (adapted from MDM4U 01 / 05 makeSim): repeatable deals of r different items from a pool
// of n (partial Fisher–Yates on MV.mdm.seededRandom), kept as hands so a new event is re-scored on the same deals.
// sim = dealSim(); sim.sync(key, seed, n, r, count) re-deals silently when the pool changed or the count differs;
// sim.run(m, {step(sim), done(sim)}) animates over ≤ 40 frames (instant with reduced motion); sim.hands; sim.stop(); sim.busy().
// drawRF(plot, hits[0/1], exact, describe): running relative frequency (--pen, solid) against the exact value (--ink, dashed),
// with the y-axis scaled to the exact value so small probabilities stay readable.
function dealSim(){
  var s = { key:null, hands:[], rng:null, n:0, r:0, raf:null };
  function one(){ var a = [], i; for (i = 0; i < s.n; i++) a.push(i); for (i = 0; i < s.r; i++) { var j = i + s.rng.int(s.n - i), t = a[i]; a[i] = a[j]; a[j] = t; } s.hands.push(a.slice(0, s.r)); }
  s.stop = function(){ if (s.raf) cancelAnimationFrame(s.raf); s.raf = null; };
  s.busy = function(){ return !!s.raf; };
  s.sync = function(key, seed, n, r, count){
    if (s.key !== key || s.hands.length > count) { s.stop(); s.key = key; s.n = n; s.r = r; s.hands = []; s.rng = MV.mdm.seededRandom(seed); }
    while (s.hands.length < count) one();
  };
  s.run = function(m, cb){
    s.stop(); cb = cb || {};
    if (MV.reduceMotion) { for (var i = 0; i < m; i++) one(); if (cb.step) cb.step(s); if (cb.done) cb.done(s); return; }
    var left = m, frames = Math.min(40, Math.max(1, Math.ceil(m / 12))), per = Math.ceil(m / frames);
    (function tick(){ var k = Math.min(per, left); for (var j = 0; j < k; j++) one(); left -= k; if (cb.step) cb.step(s);
      if (left > 0) s.raf = requestAnimationFrame(tick); else { s.raf = null; if (cb.done) cb.done(s); } })();
  };
  return s;
}
function drawRF(plot, hits, p, desc){
  var n = hits.length, xmax = Math.max(10, n), every = Math.max(1, Math.ceil(n / 600)), pts = [], h = 0, i;
  var ymax = Math.min(1.05, Math.max(0.12, p * 2.2));
  for (i = 0; i < n; i++) { h += hits[i]; if (i >= 19 && h / (i + 1) > ymax * 0.95) ymax = Math.min(1.05, h / (i + 1) * 1.15); }
  for (h = 0, i = 0; i < n; i++) { h += hits[i]; if ((i + 1) % every === 0 || i === n - 1) pts.push([i + 1, Math.min(h / (i + 1), ymax)]); }
  var step = ymax <= 0.16 ? 0.025 : ymax <= 0.32 ? 0.05 : ymax <= 0.6 ? 0.1 : 0.25, pen = css("--pen"), ink = css("--ink");
  var W = Math.max(200, plot.c.clientWidth || 600), padL = Math.max(0.09, 46 / W), padR = Math.max(0.03, 20 / W);
  plot.draw({ view:{ xmin:-xmax * padL, xmax:xmax * (1 + padR), ymin:-ymax * 0.1, ymax:ymax }, grid:true,
    yTicks:{ step:step, fmt:function(v){ return MV.num(v, step < 0.05 ? 3 : 2); } }, xTicks:{ fmt:function(v){ return MV.num(v, 0); } },
    curves:pts.length > 1 ? [{ pts:pts, color:pen, width:2.6 }] : [], points:pts.length === 1 ? [{ x:pts[0][0], y:pts[0][1], color:pen, r:4 }] : [],
    segments:[{ x1:0, y1:p, x2:xmax, y2:p, color:ink, width:1.6, dash:[7, 6] }],
    xLabel:"deals", yLabel:"relative frequency", describe:desc });
}

// ---------- the model: a group of two types, or a standard deck ----------
var NAMES = { gb:{ A:["girl", "girls", "G"], B:["boy", "boys", "B"], t:"girls / boys" }, rb:{ A:["red", "red", "R"], B:["blue", "blue", "B"], t:"red / blue" },
  dw:{ A:["defective", "defective", "D"], B:["working", "working", "W"], t:"defective / working" } };
var SUITS = [{ s:"♠", n:"spades" }, { s:"♥", n:"hearts" }, { s:"♦", n:"diamonds" }, { s:"♣", n:"clubs" }];
var RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
function suitOf(c){ return Math.floor(c / 13); }
function rankOf(c){ return c % 13; }
var CATS = {
  h:{ t:"♥ Hearts", one:"heart", many:"hearts", n:13, lab:"♥", f:function(c){ return suitOf(c) === 1; } },
  f:{ t:"Face cards", one:"face card", many:"face cards", n:12, lab:"F", f:function(c){ return rankOf(c) >= 10; } },
  a:{ t:"Aces", one:"ace", many:"aces", n:4, lab:"A", f:function(c){ return rankOf(c) === 0; } },
  hs:{ t:"One heart and one spade" }
};
var DEF = { src:"group", a:6, b:4, names:"rb", who:"A", gr:3, dr:2, kind:"ex", k:2, cat:"h", mode:"count", deals:0 };
var SEEDS = { "g|6|4|3":25, "d|2":34 };   // seeds whose first 1000 deals match the plan's readout (0.497) and P3 (0.059)

function model(S){
  var m = { src:S.src, kind:S.kind };
  if (S.src === "deck") {
    m.n = 52; m.r = S.dr; m.cat = S.cat; m.k = Math.min(S.k, m.r);
    if (S.cat === "hs") { m.hs = true; return m; }
    var c = CATS[S.cat]; m.sA = c.n; m.sB = 52 - c.n; m.one = c.one; m.many = c.many; m.labS = c.lab; m.labO = "other";
    m.isS = function(x){ return c.f(x); };
  } else {
    var nm = NAMES[S.names] || NAMES.rb, w = S.who === "B" ? "B" : "A", o = w === "A" ? "B" : "A";
    m.n = S.a + S.b; m.r = Math.min(S.gr, m.n); m.k = Math.min(S.k, m.r); m.sA = w === "A" ? S.a : S.b; m.sB = m.n - m.sA;
    m.one = nm[w][0]; m.many = nm[w][1]; m.labS = nm[w][2]; m.labO = nm[o][2];
    m.isS = function(x){ return (x < S.a) === (w === "A"); };
  }
  return m;
}
function caseList(m){
  var r = m.r, k = m.k, out = [], j;
  if (m.kind === "no") return [0];
  if (m.kind === "ex") return [k];
  if (m.kind === "al") { for (j = k; j <= r; j++) out.push(j); return out; }
  for (j = 0; j <= k; j++) out.push(j); return out;
}
function cnt(m, j){ return C(m.sA, j) * C(m.sB, m.r - j); }
function favOf(m){ if (m.hs) return m.r >= 2 ? 169 * C(26, m.r - 2) : 0; return caseList(m).reduce(function(s, j){ return s + cnt(m, j); }, 0); }
function sCount(m, hand){ var j = 0; hand.forEach(function(x){ if (m.isS(x)) j++; }); return j; }
function hit(m, hand){
  if (m.hs) { var h = 0, sp = 0; hand.forEach(function(c){ var s = suitOf(c); if (s === 1) h++; else if (s === 0) sp++; }); return h === 1 && sp === 1; }
  return caseList(m).indexOf(sCount(m, hand)) >= 0;
}
function wN(m, j){ return j + " " + (j === 1 ? m.one : m.many); }
function phrase(m){
  if (m.hs) return "one heart and one spade";
  var k = m.k;
  if (m.kind === "no" || (k === 0 && m.kind !== "al")) return "no " + m.many;
  if (m.kind === "ex") return k === m.r && m.r === 2 ? "both " + m.many : k === m.r && m.r > 2 ? "all " + m.r + " " + m.many : "exactly " + wN(m, k);
  if (m.kind === "al") return k === 0 ? "any selection" : "at least " + wN(m, k);
  return "at most " + wN(m, k);
}
function compPhrase(m){
  if (m.hs) return "not one heart and one spade";
  var k = m.k;
  if (m.kind === "no" || (k === 0 && m.kind !== "al")) return "at least 1 " + m.one;
  if (m.kind === "ex") return "not " + phrase(m);
  if (m.kind === "al") return k === 0 ? "nothing" : k === 1 ? "no " + m.many : "at most " + wN(m, k - 1);
  return k >= m.r ? "nothing" : "at least " + wN(m, k + 1);
}
function termSrc(m, j){ var p = []; if (j > 0) p.push("C(" + m.sA + ", " + j + ")"); if (m.r - j > 0) p.push("C(" + m.sB + ", " + (m.r - j) + ")"); return p.join(" × "); }
function termVal(m, j){ var p = []; if (j > 0) p.push(big(C(m.sA, j))); if (m.r - j > 0) p.push(big(C(m.sB, m.r - j))); return p.join(" × "); }
function hsSrc(m){ return "C(13, 1) × C(13, 1)" + (m.r > 2 ? " × C(26, " + (m.r - 2) + ")" : ""); }
function hsVal(m){ return "13 × 13" + (m.r > 2 ? " × " + big(C(26, m.r - 2)) : ""); }
function sumSrc(m, js){ return js.map(function(j){ return termSrc(m, j); }).join(" + "); }
// Count-mode lines: [{lab, ex (math source), res (html after "="), key}] in reveal order
function countLines(m){
  var T = C(m.n, m.r), fav = favOf(m), f = F.of(fav, T), L = [], tot = "C(" + m.n + ", " + m.r + ")";
  L.push({ key:"tot", lab:"Possible selections", ex:tot, res:big(T) });
  if (m.hs) {
    if (m.r < 2) { L.push({ key:"fav", lab:"Favourable selections", ex:"", res:"0: one card can’t be a heart and a spade", txt:true }); L.push({ key:"main", lab:"Probability", ex:"", res:"0" }); return L; }
    L.push({ key:"fav", lab:"Favourable selections", ex:hsSrc(m), res:hsVal(m) + " = " + big(fav) });
    L.push({ key:"main", lab:"Probability", ex:hsSrc(m) + " ÷ " + tot, res:hsVal(m) + " ÷ " + big(T) + " = " + ftxt(f) });
    return L;
  }
  var js = caseList(m);
  if (js.length === 1) {
    var j = js[0], tv = termVal(m, j), single = tv.indexOf("×") < 0;
    L.push({ key:"fav", lab:"Favourable selections", ex:termSrc(m, j), res:(single ? "" : tv + " = ") + big(fav) });
    L.push({ key:"main", lab:"Probability", ex:termSrc(m, j) + " ÷ " + tot, res:(single ? big(fav) : tv) + " ÷ " + big(T) + " = " + ftxt(f) });
    return L;
  }
  var all = [], comp = [], i;
  for (i = 0; i <= m.r; i++) all.push(i);
  comp = all.filter(function(x){ return js.indexOf(x) < 0; });
  var vals = js.map(function(x){ return cnt(m, x); });
  if (!comp.length) { L.push({ key:"main", lab:"Probability", ex:"", res:"every selection counts: " + big(T) + "/" + big(T) + " = 1", txt:true }); return L; }
  var cvals = comp.map(function(x){ return cnt(m, x); }), cfav = cvals.reduce(function(a, b){ return a + b; }, 0);
  L.push({ key:"comp", lab:"Complement route", ex:"1 - " + (comp.length > 1 ? "[" + sumSrc(m, comp) + "]" : sumSrc(m, comp)) + " ÷ " + tot,
    res:"1 - " + (comp.length > 1 ? "(" + cvals.map(big).join(" + ") + ")" : big(cfav)) + "/" + big(T) + " = " + big(T - cfav) + "/" + big(T) + (f.d !== T || f.n !== fav ? " = " + ftxt(f) : "") });
  L.push({ key:"cases", lab:"Cases route", ex:"[" + sumSrc(m, js) + "] ÷ " + tot,
    res:"(" + vals.map(big).join(" + ") + ") ÷ " + big(T) + " = " + big(fav) + "/" + big(T) + (f.d !== T || f.n !== fav ? " = " + ftxt(f) : "") });
  return L;
}
// with replacement, for contrast: {ex (math source), val (text)}
function wrInfo(m){
  var n = m.n, r = m.r, num = 0, den = Math.pow(n, r), ex, dec = false;
  if (m.hs) {
    if (r < 2) return { ex:"", val:"0" };
    var co = r * (r - 1); num = co * 169 * Math.pow(26, r - 2);
    ex = (co > 1 ? co + " × " : "") + "1/4 × 1/4" + (r > 2 ? " × 1/2" : "");
  } else {
    var p = F.of(m.sA, n), q = F.of(m.sB, n); dec = 10 % p.d === 0;
    var ps = dec ? F.dec(p, 1) : F.txt(p), qs = dec ? F.dec(q, 1) : F.txt(q), js = caseList(m);
    var pw = function(s, e){ return e === 0 ? "" : e === 1 ? s : "(" + s + ")^" + e; };
    js.forEach(function(j){ num += C(r, j) * Math.pow(m.sA, j) * Math.pow(m.sB, r - j); });
    if (js.length === 1) { var j = js[0], parts = []; if (C(r, j) > 1) parts.push(String(C(r, j))); if (j) parts.push(pw(ps, j)); if (r - j) parts.push(pw(qs, r - j)); ex = parts.join(" × "); }
    else if (m.kind === "al" && m.k === 1) ex = "1 - " + pw(qs, r);
    else ex = null;
  }
  var f = F.of(num, den), val = dec && F.exactDec(f, 4) ? F.dec(f, 4) : ftxt(f) + (f.d === 1 ? "" : (F.exactDec(f, 4) ? " = " : " ≈ ") + d4(f));
  return { ex:ex, val:val, f:f };
}

// ---------- Explore: Hand dealer ----------
function explore(host, api){
  var S = api.S;
  function sanitize(){
    S.src = S.src === "deck" ? "deck" : "group";
    S.a = clampI(S.a, 1, 8, DEF.a); S.b = clampI(S.b, 1, 8, DEF.b);
    if (!NAMES[S.names]) S.names = DEF.names;
    S.who = S.who === "B" ? "B" : "A";
    S.gr = clampI(S.gr, 1, Math.min(5, S.a + S.b), DEF.gr); S.dr = clampI(S.dr, 1, 3, DEF.dr);
    if (["ex", "al", "am", "no"].indexOf(S.kind) < 0) S.kind = DEF.kind;
    S.k = clampI(S.k, 0, S.src === "deck" ? S.dr : S.gr, DEF.k);
    if (!CATS[S.cat]) S.cat = DEF.cat;
    if (["count", "sim", "order"].indexOf(S.mode) < 0) S.mode = DEF.mode;
    S.deals = clampI(S.deals, 0, 10000, 0);
  }
  sanitize();
  var sim = dealSim(), pv = {}, anim = null, msg = "", tree = null, lastDeal = 0, plot;

  host.innerHTML =
    '<div class="cp-top"><div id="cp-src"></div><div id="cp-mode"></div></div>' +
    '<div class="pg cp-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap cp-cap" id="cp-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="cp-pool" id="cp-pool" role="img"></div>' +
      '<div id="cp-cv" class="cp-cv"></div>' +
      '<div id="cp-sv" class="cp-sv" hidden><div class="cp-hand" id="cp-hand" aria-live="polite"></div><canvas class="plot wide" id="cp-plot" role="img" aria-label="Relative frequency graph"></canvas><p class="tiny muted" id="cp-stxt"></p></div>' +
      '<div id="cp-ov" class="cp-ov" hidden><div id="cp-olines" class="cp-lines"></div><div id="cp-tree" class="cp-tree"></div><p class="tiny muted" id="cp-tnote"></p></div>' +
      '<p class="cp-aha" id="cp-aha"></p></div>' +
    '<div class="pg-ctrl cp-ctrl">' +
      '<div class="cp-panel" id="cp-gp"><p class="cp-sh">Group</p>' + sliderHTML("cp-a", "", "n") + sliderHTML("cp-b", "", "d") + '<div id="cp-names"></div></div>' +
      '<div class="cp-panel" id="cp-dp" hidden><p class="cp-sh">Deck</p><div id="cp-cat"></div><p class="tiny muted">Hands of 1 to 3 cards keep the counts small. Bigger hands grow fast: there are ' + M("C(52, 5)") + " = 2" + NNB + "598" + NNB + "960 five-card hands.</p></div>" +
      '<div class="cp-panel">' + sliderHTML("cp-r", "", "k") + "</div>" +
      '<div class="cp-panel" id="cp-evp"><p class="cp-sh">Event</p><div id="cp-who"></div><div id="cp-kind"></div><div id="cp-kw">' + sliderHTML("cp-k", M("k"), "k") + '</div><p class="cp-evtxt" id="cp-evtxt"></p></div>' +
      '<div class="cp-btns"><button type="button" class="btn primary sm" id="cp-d1" data-k="cpd1">Deal once</button><button type="button" class="btn sm" id="cp-d1000" data-k="cpd1000">Deal 1000</button>' +
        '<button type="button" class="btn ghost sm" id="cp-reset" data-k="cpreset">Reset</button></div>' +
      '<p class="tiny cp-msg" id="cp-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="cp-read" aria-live="polite"></dl></div></div>';

  plot = new MV.Plot($("#cp-plot", host), { xmin:0, xmax:10, ymin:0, ymax:1 });
  plot.render = paintPlot;
  function ctl(){ user(); }
  var srcR = radios($("#cp-src", host), { label:"Source", options:[{ id:"group", t:"Group" }, { id:"deck", t:"Deck" }], value:S.src, cls:"seg",
    onChange:function(v){ ctl(); S.src = v; S.k = Math.min(S.k, v === "deck" ? S.dr : S.gr); S.deals = 0; msg = ""; save(); render(); MV.changed(); } });
  var modeR = radios($("#cp-mode", host), { label:"Mode", options:[{ id:"count", t:"Count" }, { id:"sim", t:"Simulate" }, { id:"order", t:"Order check" }], value:S.mode, cls:"seg",
    onChange:function(v){ ctl(); S.mode = v; msg = ""; save(); render(); MV.changed(); } });
  var namesR = radios($("#cp-names", host), { label:"Names", options:Object.keys(NAMES).map(function(k){ return { id:k, t:NAMES[k].t }; }), value:S.names, cls:"chips",
    onChange:function(v){ ctl(); S.names = v; save(); render(); MV.changed(); } });
  var catR = radios($("#cp-cat", host), { label:"Cards to count", options:Object.keys(CATS).map(function(k){ return { id:k, t:CATS[k].t }; }), value:S.cat, cls:"chips",
    onChange:function(v){ ctl(); S.cat = v; save(); render(); MV.changed(); } });
  var whoOpts = [{ id:"A", t:"" }, { id:"B", t:"" }];
  var whoR = radios($("#cp-who", host), { label:"Count", options:whoOpts, value:S.who, cls:"chips",
    onChange:function(v){ ctl(); S.who = v; save(); render(); MV.changed(); } });
  var kindR = radios($("#cp-kind", host), { label:"Kind", options:[{ id:"ex", t:"exactly " + M("k") }, { id:"al", t:"at least " + M("k") }, { id:"am", t:"at most " + M("k") }, { id:"no", t:"none" }], value:S.kind, cls:"chips",
    onChange:function(v){ ctl(); S.kind = v; save(); render(); MV.changed(); } });

  function save(){ api.save(); }
  function user(){ cancelAnim(); if (sim.busy()) { sim.stop(); S.deals = sim.hands.length; } pv = {}; MV.banner("", ""); }
  function poolKey(){ return S.src === "deck" ? "d|" + S.dr : "g|" + S.a + "|" + S.b + "|" + Math.min(S.gr, S.a + S.b); }
  function seed(){ var k = poolKey(); return SEEDS[k] != null ? SEEDS[k] : h32("cp15|" + k); }
  function syncSim(){ var m = model(S); if (!sim.busy()) sim.sync(poolKey(), seed(), m.n, m.r, S.deals); }
  function hitsArr(m){ return sim.hands.map(function(h){ return hit(m, h) ? 1 : 0; }); }

  // --- animation bookkeeping (predictions and deals); any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(setTimeout(function(){ if (anim === a) fn(); }, MV.reduceMotion ? 0 : ms)); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } paintBtns(); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    if (sim.busy()) { sim.stop(); sim.key = null; }
    pv = {};
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }

  // --- painting ---
  function render(){
    sanitize(); syncSim();
    var m = model(S), deck = S.src === "deck";
    srcR.set(S.src); modeR.set(S.mode); namesR.set(S.names); catR.set(S.cat); whoR.set(S.who); kindR.set(S.kind);
    var nm = NAMES[S.names];
    whoOpts[0].t = nm.A[1]; whoOpts[1].t = nm.B[1]; whoR.refresh();
    $("#cp-gp", host).hidden = deck; $("#cp-dp", host).hidden = !deck;
    setSl(host, "cp-a", S.a, 1, 8, '<i class="mdm-sw" style="background:var(--ev-a)"></i> ' + MV.cap(nm.A[1]) + " (" + nm.A[2] + ")");
    setSl(host, "cp-b", S.b, 1, 8, '<i class="mdm-sw" style="background:var(--ev-b)"></i> ' + MV.cap(nm.B[1]) + " (" + nm.B[2] + ")");
    setSl(host, "cp-r", m.r, 1, deck ? 3 : Math.min(5, S.a + S.b), (deck ? "Hand size " : "Selection size ") + M("r"));
    $("#cp-who", host).hidden = deck;
    $("#cp-kind", host).hidden = !!m.hs;
    $("#cp-kw", host).hidden = !!m.hs || S.kind === "no";
    if (!m.hs && S.kind !== "no") setSl(host, "cp-k", m.k, 0, m.r);
    $("#cp-evtxt", host).innerHTML = "Event: " + Pw(phrase(m)) + (m.hs ? '<span class="tiny muted"> (exactly 1 heart and 1 spade' + (m.r > 2 ? "; the rest from the other 26 cards" : "") + ")</span>" : "");
    $("#cp-sv", host).hidden = S.mode !== "sim"; $("#cp-cv", host).hidden = S.mode !== "count"; $("#cp-ov", host).hidden = S.mode !== "order";
    paintPool(m); paintCount(m); paintSim(m); paintOrder(m); paintRead(m); paintCap(m); paintAha(m); paintBtns();
    $("#cp-msg", host).innerHTML = msg;
  }
  function hidden(key){ if (!pv.hide) return false; return (pv.show || []).indexOf(key) < 0; }
  function paintPool(m){
    var box = $("#cp-pool", host), h = "", lab;
    if (S.src === "deck") {
      h = '<div class="cp-deckwrap"><div class="cp-deck">';
      SUITS.forEach(function(su, si){
        h += '<span class="cp-ds"><b>' + su.s + "</b> " + su.n + "</span>";
        RANKS.forEach(function(rk, ri){ var c = si * 13 + ri, on = m.hs ? si <= 1 : m.isS(c); h += '<span class="cp-dc' + (on ? " on" : "") + '">' + rk + "</span>"; });
      });
      h += "</div></div>";
      lab = m.hs ? "A standard deck of 52 cards. The 13 hearts and the 13 spades are marked." : "A standard deck of 52 cards, 4 suits of 13. The " + m.sA + " " + m.many + " are marked.";
      h += '<p class="tiny muted cp-plab">' + (m.hs ? "Marked: the 13 hearts (♥) and the 13 spades (♠)." : "Marked: the " + m.sA + " " + m.many + "; the other " + m.sB + " cards are unmarked.") + "</p>";
    } else {
      var nm = NAMES[S.names], i;
      h = '<div class="cp-toks">';
      for (i = 0; i < S.a; i++) h += '<span class="cp-tok a' + (S.who === "A" ? " s" : "") + '">' + nm.A[2] + "</span>";
      for (i = 0; i < S.b; i++) h += '<span class="cp-tok b' + (S.who === "B" ? " s" : "") + '">' + nm.B[2] + "</span>";
      h += '</div><p class="tiny muted cp-plab">' + S.a + " " + nm.A[1] + " (" + nm.A[2] + ") and " + S.b + " " + nm.B[1] + " (" + nm.B[2] + "): " + (S.a + S.b) + " in all. Counting: " + nm[S.who][1] + ".</p>";
      lab = S.a + " " + nm.A[1] + " and " + S.b + " " + nm.B[1] + "; the event counts " + nm[S.who][1] + ".";
    }
    box.innerHTML = h; box.setAttribute("aria-label", lab);
  }
  function lineHTML(L){
    return '<ol class="cp-lines">' + L.map(function(l){
      var hid = hidden(l.key);
      return '<li class="' + (pv.fresh === l.key ? "fresh" : "") + '"><span class="cp-ll">' + l.lab + "</span> " + (l.ex ? M(l.ex) + " = " : "") + (hid ? '<span class="cp-q">?</span>' : l.txt ? l.res : M(l.res)) + "</li>";
    }).join("") + "</ol>";
  }
  function paintCount(m){
    if (S.mode !== "count") return;
    var box = $("#cp-cv", host), L = countLines(m), al = m.kind === "al" || m.kind === "am";
    box.innerHTML = lineHTML(L) + (al && !m.hs && L.length > 2 ? '<p class="tiny muted">Both routes give the same answer: the cases add up the selections you want; the complement removes the ones you don’t.</p>' : "");
  }
  function handHTML(m, hand, fresh){
    var nm = NAMES[S.names];
    return '<div class="cp-hrow">' + hand.map(function(x, i){
      var st = fresh && !MV.reduceMotion ? ' style="animation-delay:' + (i * 140) + 'ms"' : "", cls = fresh && !MV.reduceMotion ? " cp-in" : "";
      if (S.src === "deck") { var su = SUITS[suitOf(x)], on = m.hs ? suitOf(x) <= 1 : m.isS(x);
        return '<span class="cp-card' + (on ? " on" : "") + cls + '"' + st + '><b>' + RANKS[rankOf(x)] + "</b><i>" + su.s + "</i><small>" + su.n + "</small></span>"; }
      var isA = x < S.a;
      return '<span class="cp-tok big ' + (isA ? "a" : "b") + (m.isS(x) ? " s" : "") + cls + '"' + st + ">" + (isA ? nm.A[2] : nm.B[2]) + "</span>";
    }).join("") + "</div>";
  }
  function handText(m, hand){
    var nm = NAMES[S.names];
    return hand.map(function(x){ return S.src === "deck" ? RANKS[rankOf(x)] + " of " + SUITS[suitOf(x)].n : (x < S.a ? nm.A[0] : nm.B[0]); }).join(", ");
  }
  function paintSim(m){
    if (S.mode !== "sim") return;
    var n = sim.hands.length, hits = hitsArr(m), hcount = hits.reduce(function(a, b){ return a + b; }, 0), last = sim.hands[n - 1], hb = $("#cp-hand", host);
    var T = C(m.n, m.r), fav = favOf(m), f = F.of(fav, T);
    if (!n) hb.innerHTML = '<p class="muted cp-hnone">No deals yet. Press <strong>Deal once</strong> to deal one ' + (S.src === "deck" ? "hand" : "selection") + ", or <strong>Deal 1000</strong>.</p>";
    else {
      var fresh = lastDeal === n && !pv.noFresh, ok = hit(m, last); lastDeal = -1;
      hb.innerHTML = '<p class="cp-hl">Deal ' + big(n) + ":</p>" + handHTML(m, last, fresh) +
        '<p class="cp-hv ' + (ok ? "yes" : "no") + '">' + (ok ? "✓ " + phrase(m) : "✗ not " + phrase(m)) + '</p><p class="vh">' + handText(m, last) + "</p>";
    }
    var txt = n ? big(n) + " deal" + (n === 1 ? "" : "s") + ": the event happened " + big(hcount) + " time" + (hcount === 1 ? "" : "s") + " (relative frequency " + (hcount / n).toFixed(3) + "). " : "";
    $("#cp-stxt", host).innerHTML = txt + "Dashed line: the exact value" + (hidden("exact") ? "" : ", " + ftxt(f)) + ". The deals are seeded: the same settings give the same deals every time.";
    paintPlot();
  }
  function paintPlot(){
    if (S.mode !== "sim") return;
    var m = model(S), T = C(m.n, m.r), fav = favOf(m), p = fav / T, hits = hitsArr(m), n = hits.length, hc = hits.reduce(function(a, b){ return a + b; }, 0);
    drawRF(plot, hits, p, "Relative frequency of " + phrase(m) + " over " + n + " deals" + (n ? ": " + (hc / n).toFixed(3) : "") + ". The dashed line is the exact value, " + p.toFixed(4) + ".");
  }
  function orderInfo(m){
    var T = C(m.n, m.r), fav = favOf(m), rf = MV.mdm.fact(m.r), PT = Pn(m.n, m.r), favO = fav * rf, f = F.of(fav, T), ex = null, ev = null, js = m.hs ? null : caseList(m);
    if (!m.hs && js.length === 1) {
      var j = js[0], parts = [], vals = [];
      if (j === m.r) { parts.push("P(" + m.sA + ", " + j + ")"); vals.push(big(Pn(m.sA, j))); }
      else if (j === 0) { parts.push("P(" + m.sB + ", " + m.r + ")"); vals.push(big(Pn(m.sB, m.r))); }
      else { parts.push("C(" + m.r + ", " + j + ")", "P(" + m.sA + ", " + j + ")", "P(" + m.sB + ", " + (m.r - j) + ")"); vals.push(C(m.r, j), big(Pn(m.sA, j)), big(Pn(m.sB, m.r - j))); }
      ex = parts.join(" × ") + " ÷ P(" + m.n + ", " + m.r + ")"; ev = vals.join(" × ") + " ÷ " + big(PT);
    } else { ex = big(fav) + " × " + m.r + "! ÷ P(" + m.n + ", " + m.r + ")"; ev = big(fav) + " × " + rf + " ÷ " + big(PT); }
    return { T:T, fav:fav, rf:rf, PT:PT, favO:favO, f:f, ex:ex, ev:ev };
  }
  function paintOrder(m){
    if (S.mode !== "order") return;
    var o = orderInfo(m), L = [];
    L.push({ key:"un", lab:"Unordered", ex:"", res:big(o.fav) + " ÷ C(" + m.n + ", " + m.r + ") = " + probTxt(o.fav, o.T) });
    L.push({ key:"ord", lab:"Ordered", ex:o.ex, res:(o.ev.indexOf("×") >= 0 ? o.ev + " = " : "") + big(o.favO) + "/" + big(o.PT) + (o.fav ? " = " + ftxt(o.f) : "") });
    $("#cp-olines", host).innerHTML = lineHTML(L) + '<p class="cp-onote">' + (hidden("ord") ? "Count the hands in order on the top <strong>and</strong> the bottom." :
      m.r === 1 ? "With one item there’s no order to count: " + M("1! = 1") + "." :
      "Each unordered selection appears " + M(m.r + "! = " + o.rf) + " times in order, so the top <strong>and</strong> the bottom are both multiplied by " + o.rf + ": the fraction doesn’t change.") + "</p>";
    paintTree(m, o);
  }
  function treeTypes(m){
    if (m.hs) return [{ id:"H", t:"♥", c:13, nm:"heart" }, { id:"S", t:"♠", c:13, nm:"spade" }, { id:"O", t:"other", c:26, nm:"other card" }];
    return [{ id:"S", t:m.labS, c:m.sA, nm:m.one }, { id:"O", t:m.labO, c:m.sB, nm:"other" }];
  }
  function paintTree(m, o){
    var tb = $("#cp-tree", host), note = $("#cp-tnote", host), lim = m.hs ? 2 : 3;
    if (m.r > lim || (m.hs && m.r < 2)) { tb.hidden = true; note.innerHTML = m.hs && m.r < 2 ? "" : "The tree of ordered draws has " + Math.pow(m.hs ? 3 : 2, m.r) + " paths here, too many to draw; the formula above adds them for you. Try " + M("r <= " + lim) + " to see the tree."; return; }
    tb.hidden = false;
    var types = treeTypes(m);
    function left(path){ var c = {}; types.forEach(function(t){ c[t.id] = t.c; }); path.forEach(function(id){ c[id]--; }); return c; }
    function prod(path){ var num = 1, den = 1; path.forEach(function(id, i){ var c = left(path.slice(0, i)); num *= c[id]; den *= m.n - i; }); return { n:num, d:den }; }
    function good(path){ if (m.hs) return path.filter(function(x){ return x === "H"; }).length === 1 && path.filter(function(x){ return x === "S"; }).length === 1; return caseList(m).indexOf(path.filter(function(x){ return x === "S"; }).length) >= 0; }
    var opts = { tap:false, showP:true, minLeaf:150, levelH:62, rowH:38, colW:110, leafW:120, maxH:440, label:"Tree of ordered draws without replacement",
      stages:[{ name:"Draw 1" }, { name:"Draw 2" }, { name:"Draw 3" }].slice(0, m.r),
      children:function(path){ if (path.length >= m.r) return []; var c = left(path), d = m.n - path.length; return types.filter(function(t){ return c[t.id] > 0; }).map(function(t){ return { id:t.id, t:t.t, p:c[t.id] + "/" + d }; }); },
      leafText:function(path){ return path.map(function(id){ return types.filter(function(t){ return t.id === id; })[0].t; }).join(" "); },
      leafNote:function(path){ var p = prod(path); return big(p.n) + "/" + big(p.d); },
      leafAria:function(path){ return path.map(function(id){ return types.filter(function(t){ return t.id === id; })[0].nm; }).join(", "); } };
    if (!tree) tree = treeDiagram(tb, opts); else tree.set(opts);
    var keys = [], sum = [];
    (function rec(p){ if (p.length === m.r) { if (good(p)) { keys.push(p.join(",")); sum.push(prod(p)); } return; } opts.children(p).forEach(function(b){ rec(p.concat([b.id])); }); })([]);
    tree.mark(hidden("ord") ? [] : keys);
    if (!pv.growing) { tree.reveal(pv.treeRev != null ? pv.treeRev : null); tree.render(); }
    note.innerHTML = hidden("ord") ? "Each path multiplies its branch fractions: the cards left after each draw." :
      "Marked paths: the ordered draws in the event. " + (sum.length ? "Add them: " + (sum.length <= 4 && sum.length > 1 ? sum.map(function(p){ return big(p.n); }).join(" + ") + " = " : "") + big(o.favO) + " of the " + big(o.PT) + " ordered draws, " + M(ftxt(o.f)) + "." : "No path is in the event.");
  }
  function paintRead(m){
    var T = C(m.n, m.r), fav = favOf(m), f = F.of(fav, T), cf = F.comp(f), rows = [], L = countLines(m), favRow = L.filter(function(l){ return l.key === "fav"; })[0];
    rows.push(["Possible selections", M("C(" + m.n + ", " + m.r + ") = " + big(T))]);
    var fr;
    if (favRow) fr = (favRow.ex ? M(favRow.ex) + " = " : "") + (favRow.txt ? favRow.res : M(favRow.res));
    else { var js = caseList(m); fr = js.length > 1 ? M(js.map(function(j){ return big(cnt(m, j)); }).join(" + ") + " = " + big(fav)) : big(fav); }
    rows.push(["Favourable selections", hidden("fav") && hidden("main") && hidden("cases") ? '<span class="cp-q">?</span>' : fr]);
    rows.push(["Probability", hidden("prob") ? Pw(phrase(m)) + ' = <span class="cp-q">?</span>' : Pw(phrase(m)) + " = " + M(probTxt(fav, T))]);
    rows.push(["Complement", hidden("prob") ? '<span class="cp-q">?</span>' : Pw(compPhrase(m)) + " = " + M(ftxt(cf))]);
    var n = sim.hands.length, hc = hitsArr(m).reduce(function(a, b){ return a + b; }, 0);
    rows.push(["Simulated (" + big(n || 1000) + (n === 1 ? " deal)" : " deals)"), S.mode !== "sim" ? '<span class="muted">Simulate mode</span>' : !n ? '<span class="muted">Press Deal 1000</span>' : M((hc / n).toFixed(3)) + ' <span class="tiny muted">(' + big(hc) + " of " + big(n) + ")</span>"]);
    var w = wrInfo(m);
    rows.push(["With replacement (for contrast)", '<span class="cp-grey">' + M((w.ex ? w.ex + " = " : "") + w.val) + ' <span class="cp-not">not this situation</span></span>']);
    $("#cp-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(m){
    var T = C(m.n, m.r), fav = favOf(m), f = F.of(fav, T), c = $("#cp-cap", host);
    c.innerHTML = pv.cap != null ? MV.md(pv.cap) : Pw(phrase(m)) + " = " + (hidden("prob") ? "?" : M(F.src(f)));
    c.classList.toggle("long", MV.plain(c.innerHTML).length > 26);
  }
  function paintAha(m){
    var a = $("#cp-aha", host), T = C(m.n, m.r), fav = favOf(m), f = F.of(fav, T), w = wrInfo(m), show = !pv.hide && S.mode !== "order" && fav > 0;
    a.hidden = !show; if (!show) return;
    a.innerHTML = "Two counts and a division: " + big(fav) + " favourable ÷ " + big(T) + " possible = " + M(F.src(f)) + "." +
      (F.eq(w.f, f) ? "" : " Multiplying single-draw chances (" + w.val.split(" ")[0] + ") would treat the draws as replaced: a different situation.");
  }
  function paintBtns(){
    var busy = sim.busy() || !!(anim && pv.hide);
    $("#cp-d1", host).disabled = busy || S.deals >= 10000; $("#cp-d1000", host).disabled = busy || S.deals > 9000;
  }

  // --- deals ---
  function deal(k){
    user();
    if (S.mode !== "sim") { S.mode = "sim"; msg = "Simulate mode: deals and the relative-frequency line."; }
    else msg = "";
    syncSim();
    var m = model(S);
    if (k === 1) { sim.run(1); S.deals = sim.hands.length; lastDeal = S.deals; save(); render(); MV.changed(); return; }
    lastDeal = 0; paintBtns();
    sim.run(k, { step:function(){ S.deals = sim.hands.length; paintSim(m); paintRead(m); }, done:function(){ S.deals = sim.hands.length; save(); render(); MV.changed(); } });
    paintBtns();
  }

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg")) return;
    if (b.id === "cp-d1") { deal(1); return; }
    if (b.id === "cp-d1000") { deal(1000); return; }
    if (b.id === "cp-reset") { user(); Object.keys(DEF).forEach(function(k){ S[k] = DEF[k]; }); msg = ""; lastDeal = 0; sim.key = null; save(); render(); MV.changed(); }
  });
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.csl; if (!id) return;
    var v = +e.target.value; user();
    if (id === "cp-a") S.a = v; else if (id === "cp-b") S.b = v;
    else if (id === "cp-r") { if (S.src === "deck") S.dr = v; else S.gr = v; }
    else if (id === "cp-k") S.k = v;
    if (id !== "cp-k") { var r = S.src === "deck" ? S.dr : Math.min(S.gr, S.a + S.b); if (S.src !== "deck") S.gr = r; if (S.k > r) S.k = r; }
    if (id === "cp-a" || id === "cp-b" || id === "cp-r") { S.deals = 0; lastDeal = 0; }
    msg = ""; save(); render(); MV.changed();
  });

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim();
    var s = p.start || {};
    S.src = s.src; S.mode = s.mode; S.kind = s.kind; S.k = s.k;
    if (s.src === "group") { S.a = s.a; S.b = s.b; S.names = s.names; S.gr = s.r; S.who = s.who; } else { S.cat = s.cat; S.dr = s.r; }
    S.deals = 0; lastDeal = 0; msg = ""; sim.key = null;
    pv = { hide:true, show:[], treeRev:p.id === "p4" ? 0 : null };
    save(); render();
  }
  function step(keys, cap, fresh){ pv.show = pv.show.concat(keys); if (cap != null) pv.cap = cap; pv.fresh = fresh || null; render(); }
  function finish(){ pv = {}; render(); MV.changed(); later(250, endAnim); }
  function runPred(p, done){
    newAnim(done);
    if (p.id === "p1") {
      later(300, function(){ step(["tot"], "All committees: `C(9, 3) = 84`", "tot"); });
      later(1600, function(){ step(["fav"], "All-girl committees: `C(4, 3) = 4`", "fav"); });
      later(2900, function(){ step(["main", "prob"], "`4/84 = 1/21`", "main"); });
      later(4300, finish);
    } else if (p.id === "p2") {
      later(300, function(){ step(["tot"], "All committees: `C(9, 3) = 84`", "tot"); });
      later(1500, function(){ step(["comp"], "Complement: one count, `C(5, 3) = 10`", "comp"); });
      later(3000, function(){ step(["cases", "prob"], "Cases: `40 + 30 + 4 = 74`, the same", "cases"); });
      later(4600, finish);
    } else if (p.id === "p3") {
      later(300, function(){ step([], "Dealing 1000 hands of 2 …"); pv.noFresh = true;
        syncSim(); var m = model(S); paintBtns();
        anim.stops.push(function(){ sim.stop(); });
        sim.run(1000, { step:function(){ S.deals = sim.hands.length; paintSim(m); paintRead(m); }, done:function(){
          S.deals = sim.hands.length; save(); var hc = hitsArr(m).reduce(function(a, b){ return a + b; }, 0);
          step(["prob", "fav", "main", "exact"], (hc / S.deals).toFixed(3) + " simulated; exact `1/17` ≈ 0.0588 < `1/16`");
          later(1400, finish);
        } });
      });
    } else {
      later(300, function(){ step(["un"], "Unordered: `78/1326`", "un"); });
      later(1400, function(){
        pv.growing = true; step([], "Ordered: `13/52 × 12/51`");
        var cancel = tree ? tree.grow(0, 2, function(){ pv.growing = false; pv.treeRev = null;
          step(["ord", "prob", "fav", "main"], "`P(13, 2) ÷ P(52, 2) = 156/2652 = 1/17`", "ord"); later(1300, finish); }) : null;
        if (cancel) anim.stops.push(cancel); else { pv.growing = false; step(["ord", "prob"], null, "ord"); later(900, finish); }
      });
    }
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return chal(id); }
  };

  function girlSet(){ var m = model(S), out = []; for (var j = 0; j <= m.r; j++) { var g = S.who === "A" ? j : m.r - j; if (caseList(m).indexOf(j) >= 0) out.push(g); } return out.sort().join(","); }
  function chal(id){
    var m = model(S), grp = S.src === "group", r = m.r;
    if (id === "tc1") {
      if (!grp) return { ok:false, msg:"Use the <strong>Group</strong> source: a bag of red and blue marbles." };
      if (S.a + S.b !== 10) return { ok:false, msg:"The bag needs 10 marbles: red + blue = 10. Yours has " + (S.a + S.b) + "." };
      if (r !== 2) return { ok:false, msg:"Draw 2 marbles: set " + M("r = 2") + "." };
      if (girlSet() !== "2") return { ok:false, msg:"Set the event to exactly 2 red (both red)." };
      if (S.a === 6) return { ok:true };
      if (S.a === 5) return { ok:false, msg:M("C(5, 2)/C(10, 2) = 10/45 = 2/9") + "." };
      if (S.a === 7) return { ok:false, msg:M("21/45 = 7/15") + "." };
      var v = C(S.a, 2), f = F.of(v, 45);
      return { ok:false, msg:M("C(" + S.a + ", 2)/C(10, 2) = " + v + "/45" + (f.n !== v ? " = " + F.txt(f) : "")) + ", not " + M("1/3") + "." };
    }
    if (id === "tc2") {
      if (!grp || S.a !== 4 || S.b !== 5 || r !== 3) return { ok:false, msg:"Set up the group first: 4 girls, 5 boys and a committee of 3." };
      var gs = girlSet();
      if (gs === "2") return { ok:true };
      if (gs === "1") return { ok:false, msg:"That’s " + M("40/84") + "; one more girl." };
      if (gs === "2,3") return { ok:false, msg:"That includes 3 girls too." };
      var fv = favOf(m), ff = F.of(fv, 84);
      return { ok:false, msg:"That event has " + fv + " committees: " + M(fv + "/84" + (ff.n !== fv ? " = " + F.txt(ff) : "")) + ". Which event has 30?" };
    }
    if (id === "tc3") {
      if (!grp) return { ok:false, msg:"Use the <strong>Group</strong> source: " + M("g") + " girls and " + M("b") + " boys." };
      if (S.a + S.b !== 10) return { ok:false, msg:"Use a group of 10 people: " + M("g + b = 10") + ". Yours has " + (S.a + S.b) + "." };
      if (r !== 3) return { ok:false, msg:"Use a committee of 3: set " + M("r = 3") + "." };
      if (S.a === 4) return { ok:true };
      if (S.a === 3) return { ok:false, msg:M("1 - C(7, 3)/120 = 1 - 35/120 = 17/24") + "." };
      if (S.a === 5) return { ok:false, msg:M("1 - 10/120 = 11/12") + "." };
      var nb = C(S.b, 3), fc = F.comp(F.of(nb, 120));
      return { ok:false, msg:M("1 - C(" + S.b + ", 3)/120 = 1 - " + nb + "/120 = " + F.txt(fc)) + ", not " + M("5/6") + "." };
    }
    return { ok:false };
  }
}

// ---------- hero: the deck fans out, 2 cards are dealt; C(52, 2) = 1326; the hearts lift: C(13, 2) = 78; 78/1326 = 1/17; (1/4)² crossed out ----------
function hero(f){
  var svg = $("#cp-hsvg"), cap = f.cap;
  if (!svg) return;
  var PX = 132, PY = 192, R0 = 78, R1 = 138, A = 62;
  var st = { fan:0, deal:0, lift:0, t1:0, t2:0, t3:0, red:0, gh:0, x:0 };
  function r1(v){ return Math.round(v * 10) / 10; }
  function draw(){
    var h = "", i;
    for (i = 0; i < 52; i++) {
      var hrt = i >= 13 && i < 26, ang = (-A + i * (2 * A / 51)) * st.fan, out = hrt ? 16 * st.lift : 0;
      h += '<g transform="translate(' + PX + " " + PY + ") rotate(" + r1(ang) + ')"><rect class="cp-hc' + (hrt && st.lift > 0.5 ? " on" : "") + '" x="-7" y="' + r1(-R1 - out) + '" width="14" height="' + (R1 - R0) + '" rx="2"/>' +
        (hrt ? '<text class="cp-hs" x="0" y="' + r1(-R1 - out + 11) + '">♥</text>' : "") + "</g>";
    }
    [0, 1].forEach(function(j){
      var tx = PX - 30 + j * 32, ty = PY + 6, x = PX - 11 + (tx - PX + 11) * st.deal, y = PY - 60 + (ty - PY + 60) * st.deal;
      if (st.deal > 0) h += '<rect class="cp-hd" x="' + r1(x) + '" y="' + r1(y) + '" width="24" height="34" rx="3"/>';
    });
    var X = 270;
    if (st.t1) h += '<g style="opacity:' + st.t1.toFixed(2) + '"><text class="cp-ht" x="' + X + '" y="30">possible hands</text><text class="cp-hm" x="' + X + '" y="50">C(52, 2) = 1326</text></g>';
    if (st.t2) h += '<g style="opacity:' + st.t2.toFixed(2) + '"><text class="cp-ht" x="' + X + '" y="80">hands with 2 hearts</text><text class="cp-hm" x="' + X + '" y="100">C(13, 2) = 78</text></g>';
    if (st.t3) h += '<g style="opacity:' + st.t3.toFixed(2) + '"><text class="cp-hm big" x="' + X + '" y="138">' + (st.red ? "78/1326 = 1/17" : "78/1326") + "</text></g>";
    if (st.gh) h += '<g style="opacity:' + st.gh.toFixed(2) + '"><text class="cp-hg" x="' + X + '" y="176">(1/4)² = 1/16</text>' +
      (st.x ? '<line class="cp-hx" x1="' + (X - 4) + '" y1="171" x2="' + r1(X - 4 + 112 * st.x) + '" y2="171"/>' : "") +
      (st.x >= 1 ? '<text class="cp-hn" x="' + X + '" y="198">the second card</text><text class="cp-hn" x="' + X + '" y="213">comes from 51</text>' : "") + "</g>";
    svg.innerHTML = h;
  }
  function last(){ st = { fan:1, deal:1, lift:1, t1:1, t2:1, t3:1, red:1, gh:1, x:1 }; draw(); cap.textContent = "Two hearts: 78 of the 1326 equally likely hands, 1/17 (not 1/16)"; }
  if (MV.reduceMotion) { last(); return; }
  draw(); cap.textContent = "A standard deck: 52 cards";
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  MV.wait(400, function(){
    tw(1100, function(t){ st.fan = t; draw(); }, function(){
      cap.textContent = "Two cards are dealt face down";
      tw(700, function(t){ st.deal = t; draw(); }, function(){
        cap.textContent = "Any 2 of the 52 cards: C(52, 2) = 1326 hands";
        tw(500, function(t){ st.t1 = t; draw(); }, function(){
          MV.wait(900, function(){
            cap.textContent = "The 13 hearts lift out: C(13, 2) = 78 two-heart hands";
            tw(800, function(t){ st.lift = t; st.t2 = t; draw(); }, function(){
              MV.wait(800, function(){
                cap.textContent = "Favourable ÷ total";
                tw(500, function(t){ st.t3 = t; draw(); }, function(){
                  MV.wait(800, function(){ st.red = 1; draw(); cap.textContent = "78/1326 reduces to 1/17";
                    MV.wait(1000, function(){
                      cap.textContent = "Not (1/4)² = 1/16: that would put the first card back";
                      tw(500, function(t){ st.gh = t; draw(); }, function(){
                        MV.wait(500, function(){ tw(600, function(t){ st.x = t; draw(); }, function(){ last(); }); });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

// ---------- Part 3: Lotteries and fair games (three stations) ----------
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.s1 = S.s1 && typeof S.s1 === "object" ? S.s1 : {};
  if (!Array.isArray(S.s1.ticket) || S.s1.ticket.length > 3 || S.s1.ticket.some(function(x){ return !(x >= 1 && x <= 10); })) S.s1.ticket = [2, 5, 9];
  S.s1.draws = clampI(S.s1.draws, 0, 500, 0);
  S.s1.c = S.s1.c && typeof S.s1.c === "object" ? S.s1.c : {};
  [0, 1, 2, 3].forEach(function(mm){ var x = S.s1.c[mm]; S.s1.c[mm] = Array.isArray(x) ? [clampI(x[0], 0, 3, 0), clampI(x[1], 0, 3, 0)] : [0, 0]; });
  S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {}; if (["cm", "m", "km", "row"].indexOf(S.s2.zoom) < 0) S.s2.zoom = "cm";
  S.s3 = S.s3 && typeof S.s3 === "object" ? S.s3 : {}; S.s3.t = clampI(S.s3.t, 1, 10, 1);
  var msg = {}, draws = [];
  function replay(){ var g = MV.mdm.seededRandom(1515); draws = []; for (var i = 0; i < S.s1.draws; i++) draws.push(drawOne(g)); return g; }
  function drawOne(g){ var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], i; for (i = 0; i < 3; i++) { var j = i + g.int(10 - i), t = a[i]; a[i] = a[j]; a[j] = t; } return a.slice(0, 3).sort(function(x, y){ return x - y; }); }
  var rng = replay();
  host.innerHTML = '<div id="lo-tabs" class="lo-tabs"></div><div id="lo-body" class="lo-body"></div>';
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function built(mm){ var c = S.s1.c[mm]; return c[0] === mm && c[1] === 3 - mm; }
  function done(id){ if (id === "s1") return [0, 1, 2, 3].every(built); if (id === "s2") return !!S.s2.seen; return !!S.s3.seen; }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + (done(s.id) ? ' <span class="lo-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#lo-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function card(s, i){ return '<div class="lo-card"><span class="lo-lab">Station ' + (i + 1) + " · " + s.title + '</span><p class="lo-prob">' + MV.md(s.problem || "") + "</p></div>"; }
  function matches(d){ return d.filter(function(x){ return S.s1.ticket.indexOf(x) >= 0; }).length; }

  function s1HTML(s){
    var x = S.s1, h = card(s, 0), tk = x.ticket;
    h += '<div class="lo-grid2"><section><h4>Your ticket <span class="tiny muted">(' + tk.length + " of 3 numbers)</span></h4><div class=\"lo-nums\" role=\"group\" aria-label=\"Ticket numbers 1 to 10\">";
    for (var i = 1; i <= 10; i++) { var on = tk.indexOf(i) >= 0; h += '<button type="button" class="lo-num' + (on ? " on" : "") + '" data-tn="' + i + '" data-k="tn' + i + '" aria-pressed="' + on + '">' + i + "</button>"; }
    h += "</div>" + (msg.s1 ? '<p class="tiny lo-msg" role="status">' + msg.s1 + "</p>" : "");
    h += '<div class="lo-drawrow"><button type="button" class="btn sm primary" data-ld="1" data-k="ld1"' + (tk.length !== 3 || x.draws >= 500 ? " disabled" : "") + ">Draw 3 numbers</button>" +
      '<button type="button" class="btn sm ghost" data-ld="0" data-k="ld0"' + (x.draws ? "" : " disabled") + ">Clear draws</button></div>";
    if (draws.length) {
      var d = draws[draws.length - 1], mt = matches(d), tally = [0, 0, 0, 0];
      draws.forEach(function(dd){ tally[matches(dd)]++; });
      h += '<div class="lo-draw" aria-live="polite"><p class="tiny muted">Draw ' + draws.length + ":</p><div class=\"lo-balls\">" + d.map(function(n){ var hit = tk.indexOf(n) >= 0; return '<span class="lo-ball' + (hit ? " hit" : "") + '">' + n + (hit ? '<i aria-hidden="true">✓</i>' : "") + "</span>"; }).join("") + "</div>" +
        '<p class="lo-mt"><strong>' + mt + " match" + (mt === 1 ? "" : "es") + "</strong> with your ticket " + tk.join(", ") + ".</p>" +
        '<p class="tiny muted">Your ' + draws.length + " draw" + (draws.length === 1 ? "" : "s") + " so far: " + [3, 2, 1, 0].map(function(k){ return k + " match" + (k === 1 ? "" : "es") + " × " + tally[k]; }).join(" · ") + "</p></div>";
    } else h += '<p class="tiny muted">Pick 3 numbers, then draw. The draws are seeded: they repeat in the same order every time.</p>';
    h += '</section><section><h4>Count each match case</h4><p class="tiny muted">' + s.task + "</p>";
    var tot = 0;
    h += '<ol class="lo-cases">' + s.cases.map(function(cs){
      var c = x.c[cs.m], v = C(3, c[0]) * C(7, c[1]), ok = built(cs.m), note = "";
      if (ok) tot += cs.v;
      else if (c[0] + c[1] !== 3) note = "A draw has 3 numbers: the two parts must add to 3.";
      else note = "That counts the draws with " + c[0] + " match" + (c[0] === 1 ? "" : "es") + ".";
      function stp(part, val, lab){ return '<span class="lo-part"><span class="lo-pl">' + (part ? "from the other 7" : "from your 3") + '</span><span class="lo-stp"><button type="button" class="btn ghost sm" data-cs="' + cs.m + "|" + part + '|-1" data-k="cs' + cs.m + part + 'm" aria-label="' + MV.esc(lab + " minus 1") + '"' + (val <= 0 ? " disabled" : "") + '>−</button>' +
        '<span class="lo-sv">' + M("C(" + (part ? 7 : 3) + ", " + val + ")") + '</span><button type="button" class="btn ghost sm" data-cs="' + cs.m + "|" + part + '|1" data-k="cs' + cs.m + part + 'p" aria-label="' + MV.esc(lab + " plus 1") + '"' + (val >= 3 ? " disabled" : "") + ">+</button></span></span>"; }
      return '<li class="' + (ok ? "ok" : "") + '"><p class="lo-cl">' + cs.lab + (ok ? ' <span class="lo-tick">✓</span>' : "") + "</p>" +
        '<div class="lo-crow">' + stp(0, c[0], cs.lab + ": from your 3") + '<span class="lo-x" aria-hidden="true">×</span>' + stp(1, c[1], cs.lab + ": from the other 7") + '<span class="lo-eq">= <strong>' + v + "</strong></span></div>" +
        (ok ? '<p class="lo-cp">' + MV.md(cs.p) + "</p>" : '<p class="tiny muted lo-cn">' + note + "</p>") + "</li>";
    }).join("") + "</ol>";
    var segs = s.cases.map(function(cs, i){ return { v:built(cs.m) ? cs.v : 0, cls:"c" + i, t:cs.v }; });
    h += '<p class="lo-bl">All ' + M("C(10, 3)") + " = 120 draws: " + tot + "/120 counted</p>" + barHTML(segs, 120, "Bar of the 120 draws: " + tot + " counted so far");
    h += '<p class="lo-key tiny">' + s.cases.map(function(cs, i){ return '<span><i class="lo-sw c' + i + '"></i> ' + cs.lab + "</span>"; }).join("") + "</p>";
    if (done("s1")) h += '<p class="lo-done"><strong>✓ ' + s.sumNote + "</strong></p>";
    h += '</section></div><details class="alg"><summary>Check it with algebra</summary><p>' + M("C(3, 3)C(7, 0) + C(3, 2)C(7, 1) + C(3, 1)C(7, 2) + C(3, 0)C(7, 3)") + "</p><p>" + M("= 1 + 21 + 63 + 35 = 120 = C(10, 3)") + "</p></details>";
    return h;
  }
  var ZOOM = { cm:{ t:"10 cm", n:100, len:"10 cm" }, m:{ t:"1 m", n:1000, len:"1 m" }, km:{ t:"1 km", n:1000000, len:"1 km" }, row:{ t:"The whole row", n:13983816, len:"13.98 km" } };
  function rowSVG(z){
    var W = 600, h = '<svg class="lo-rsvg" viewBox="0 0 ' + W + ' 96" aria-hidden="true" focusable="false"><defs><pattern id="lo-pat" width="5" height="8" patternUnits="userSpaceOnUse"><ellipse class="lo-grain" cx="2.5" cy="4" rx="2" ry="1.3"/></pattern></defs>', i, x;
    if (z === "cm") { for (i = 0; i < 100; i++) h += '<ellipse class="lo-grain" cx="' + (12 + i * 5.76).toFixed(1) + '" cy="36" rx="2.4" ry="1.6"/>'; }
    else if (z === "m") h += '<rect x="12" y="30" width="576" height="12" fill="url(#lo-pat)"/>';
    else h += '<rect class="lo-strip" x="12" y="31" width="576" height="10" rx="2"/>';
    var ticks = z === "cm" ? [0, 10, 1, "cm"] : z === "m" ? [0, 100, 10, "cm"] : z === "km" ? [0, 1000, 100, "m"] : [0, 14, 1, "km"];
    for (var v = ticks[0]; v <= ticks[1]; v += ticks[2]) { x = 12 + 576 * (z === "row" ? v / 13.983816 : v / ticks[1]); if (x > 589) break; h += '<line class="lo-tk" x1="' + x.toFixed(1) + '" y1="48" x2="' + x.toFixed(1) + '" y2="56"/>' + (z !== "row" || v % 2 === 0 ? '<text class="lo-tt" x="' + x.toFixed(1) + '" y="72">' + v + "</text>" : ""); }
    h += '<text class="lo-tt" x="588" y="88" text-anchor="end">' + ticks[3] + "</text>";
    if (z === "row") { x = 12 + 576 * (8.61 / 13.983816); h += '<line class="lo-win" x1="' + x.toFixed(1) + '" y1="8" x2="' + x.toFixed(1) + '" y2="30"/><circle class="lo-wd" cx="' + x.toFixed(1) + '" cy="36" r="4"/><text class="lo-wt" x="' + x.toFixed(1) + '" y="12">the one winning grain</text>'; }
    return h + "</svg>";
  }
  function s2HTML(s){
    var z = S.s2.zoom, Z = ZOOM[z], h = card(s, 1);
    h += '<p class="lo-pic">' + s.picture + "</p>";
    h += '<div id="lo-zoom"></div>';
    h += '<div class="lo-row" role="img" aria-label="' + MV.esc("A row of rice grains, 1 mm each, " + Z.len + " long: " + MV.mdm.fmt(Z.n) + " grains." + (z === "row" ? " One grain, about 8.6 km along, is the winning ticket." : "")) + '">' + rowSVG(z) + "</div>";
    h += '<dl class="read lo-read">' + MV.readoutHTML([["This view", Z.len + " of rice: " + big(Z.n) + " grains, so " + big(Z.n) + " tickets"],
      ["The whole row", big(13983816) + " grains ≈ 13.98 km"], ["Winning grains", "1 in the whole row"]]) + "</dl>";
    if (z !== "row") h += '<p class="tiny muted">' + (z === "cm" ? "Station 1’s whole lottery, 120 tickets, would fill just 12 cm of this row." : "Keep zooming out: the row goes on for about 14 km.") + "</p>";
    else h += '<p class="lo-done"><strong>One grain in about 14 km of rice:</strong> a 6-of-49 ticket wins the top prize about 1 time in ' + big(13983816) + ".</p>";
    h += '<details class="alg"><summary>Check it with algebra</summary><p>' + M("C(49, 6) = {49 × 48 × 47 × 46 × 45 × 44}/{6 × 5 × 4 × 3 × 2 × 1}") + "</p><p>" + M("= {10" + NNB + "068" + NNB + "347" + NNB + "520}/{720} = 13" + NNB + "983" + NNB + "816") + "</p><p>13" + NNB + "983" + NNB + "816 mm = 13" + NNB + "983.816 m ≈ 14 km.</p></details>";
    return h;
  }
  function s3HTML(s){
    var t = S.s3.t, h = card(s, 2), chance = F.of(t, 120), pay = 100 * t / 120, cost = 2 * t, loss = cost - pay;
    h += '<div class="lo-tix"><span class="lo-tl">Tickets in one draw (all different):</span><button type="button" class="btn ghost sm" data-tx="-1" data-k="txm" aria-label="One ticket fewer"' + (t <= 1 ? " disabled" : "") + '>−</button><output class="lo-tv" aria-live="polite">' + t + '</output><button type="button" class="btn ghost sm" data-tx="1" data-k="txp" aria-label="One ticket more"' + (t >= 10 ? " disabled" : "") + ">+</button></div>";
    h += '<dl class="read lo-read">' + MV.readoutHTML([
      ["Chance of winning", M(t + "/120" + (chance.d !== 120 ? " = " + F.txt(chance) : ""))],
      ["Cost", "2 × " + t + " = " + money(cost)],
      ["Average payout", "100 × " + M(t + "/120") + " ≈ " + money(pay)],
      ["Average loss", money(cost) + " − " + money(pay) + " ≈ <strong>" + money(loss) + "</strong>" + (t > 1 ? " (" + t + " × $1.17)" : "")]]) + "</dl>";
    h += '<p class="lo-bl">Per draw, on average</p>' + barHTML([{ v:cost, cls:"cost", t:"cost " + money(cost) }], 20, "Cost " + money(cost)) + barHTML([{ v:pay, cls:"pay", t:"back " + money(pay) }], 20, "Average payout " + money(pay));
    h += "<p>" + MV.md(s.payout) + "</p><p>" + MV.md(s.more) + "</p>";
    h += '<p class="lo-m6"><strong>' + s.m6 + "</strong></p><p>" + s.why + "</p>";
    h += '<details class="alg"><summary>Check it with algebra</summary><p>Average payout per ticket: ' + M("100 × 1/120 = 5/6") + " ≈ $0.83.</p><p>Average loss per ticket: " + M("2 - 5/6 = 7/6") + " ≈ $1.17.</p><p>10 tickets: chance " + M("10/120 = 1/12") + "; average loss " + M("10 × 7/6 = 35/3") + " ≈ $11.67.</p></details>";
    return h;
  }
  var zoomR = null;
  function paint(){
    tabText(); tabs.refresh();
    var s = st(S.cur), body = $("#lo-body", host);
    var old = $("details.alg", body), open = old ? old.open : false;
    var h = s.id === "s1" ? s1HTML(s) : s.id === "s2" ? s2HTML(s) : s3HTML(s);
    MV.keepFocus(body, function(){ body.innerHTML = h; });
    var d = $("details.alg", body); if (d && open) d.open = true;
    if (s.id === "s2") {
      var zh = $("#lo-zoom", body), had = zoomR && zoomR.focus;
      zoomR = radios(zh, { label:"Zoom", options:Object.keys(ZOOM).map(function(k){ return { id:k, t:ZOOM[k].t }; }), value:S.s2.zoom, cls:"seg",
        onChange:function(v){ S.s2.zoom = v; if (v === "row") S.s2.seen = true; api.save(); paint(); var b = $('#lo-zoom [data-rg="' + v + '"]', host); if (b) b.focus(); } });
      void had;
    }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !$("#lo-body", host).contains(b) || b.closest(".rg")) return;
    var x = S.s1;
    if (b.dataset.tn) {
      var n = +b.dataset.tn, j = x.ticket.indexOf(n);
      if (j >= 0) { x.ticket.splice(j, 1); msg.s1 = null; }
      else if (x.ticket.length >= 3) msg.s1 = "A ticket has 3 numbers. Tap one of yours to remove it first.";
      else { x.ticket.push(n); x.ticket.sort(function(p, q){ return p - q; }); msg.s1 = null; }
    } else if (b.dataset.ld) {
      if (b.dataset.ld === "1") { if (x.ticket.length === 3) { x.draws++; draws.push(drawOne(rng)); } }
      else { x.draws = 0; rng = replay(); }
    } else if (b.dataset.cs) {
      var p = b.dataset.cs.split("|"), c = x.c[p[0]]; c[+p[1]] = Math.max(0, Math.min(3, c[+p[1]] + (+p[2])));
    } else if (b.dataset.tx) { S.s3.t = Math.max(1, Math.min(10, S.s3.t + (+b.dataset.tx))); if (S.s3.t > 1) S.s3.seen = true; }
    else return;
    api.save(); paint();
  });
  paint();
  return {};
}

// ---------- Performance task: Design a marble bag ----------
var task = (function(){
  var api = null;
  function read(){ var s = api ? api.S : {}; return { r:clampI(s.r, 1, 8, 2), b:clampI(s.b, 1, 8, 2) }; }
  function vals(d){ var T = C(d.r + d.b, 2); return { T:T, rr:C(d.r, 2), mix:d.r * d.b, bb:C(d.b, 2) }; }
  function fr(n, T){ var f = F.of(n, T); return n + "/" + T + (f.n !== n || f.d !== T ? " = " + F.txt(f) : ""); }
  function paint(){
    var d = read(), v = vals(d), pvw = $("#mb-pv");
    if (!pvw) return;
    var h = '<p class="tiny muted" style="margin:0 0 4px">Your bag: ' + (d.r + d.b) + " marbles</p><div class=\"cp-toks mb-toks\" role=\"img\" aria-label=\"" + MV.esc(d.r + " red and " + d.b + " blue marbles") + '">';
    for (var i = 0; i < d.r; i++) h += '<span class="cp-tok a">R</span>';
    for (i = 0; i < d.b; i++) h += '<span class="cp-tok b">B</span>';
    h += "</div>";
    h += '<dl class="read mb-read">' + MV.readoutHTML([
      ["Total pairs", M("C(" + d.r + " + " + d.b + ", 2) = C(" + (d.r + d.b) + ", 2)") + " = " + v.T],
      [Pw("both red"), M("C(" + d.r + ", 2)") + " ÷ " + v.T + " = " + M(fr(v.rr, v.T))],
      [Pw("one of each"), M(d.r + " × " + d.b) + " ÷ " + v.T + " = " + M(fr(v.mix, v.T))],
      [Pw("both blue"), M("C(" + d.b + ", 2)") + " ÷ " + v.T + " = " + M(fr(v.bb, v.T))]]) + "</dl>";
    h += barHTML([{ v:v.rr, cls:"rr", t:v.rr ? "RR" : "" }, { v:v.mix, cls:"mix", t:"RB" }, { v:v.bb, cls:"bb", t:v.bb ? "BB" : "" }], v.T,
      "Of " + v.T + " pairs: " + v.rr + " both red, " + v.mix + " one of each, " + v.bb + " both blue") +
      '<p class="tiny muted">The bar shows all ' + v.T + " equally likely pairs: RR both red, RB one of each, BB both blue.</p>";
    pvw.innerHTML = h;
  }
  function info(k){ var p = k.split(","), d = { r:+p[0], b:+p[1] }, v = vals(d); return { d:d, v:v, s:[F.txt(F.of(v.rr, v.T)), F.txt(F.of(v.mix, v.T)), F.txt(F.of(v.bb, v.T))] }; }
  return {
    render:function(inp, pv, a){
      api = a; var d = read(); a.S.r = d.r; a.S.b = d.b;
      inp.innerHTML = '<div id="mb-sl" class="mb-sl"></div>';
      MV.sliders($("#mb-sl"), [
        { id:"mbr", label:'<i class="mdm-sw" style="background:var(--ev-a)"></i> Red ' + M("r"), param:"n", min:1, max:8, step:1, value:d.r },
        { id:"mbb", label:'<i class="mdm-sw" style="background:var(--ev-b)"></i> Blue ' + M("b"), param:"d", min:1, max:8, step:1, value:d.b }], function(id, val){
        if (id === "mbr") a.S.r = val; else a.S.b = val;
        a.save(); paint(); a.update();
      });
      pv.innerHTML = '<div class="mb-pv" id="mb-pv" aria-live="polite"></div>';
      paint();
      var host = $("#task");
      if (host && !host.dataset.mbAll) {
        host.dataset.mbAll = "1";
        host.addEventListener("click", function(e){
          if (!e.target.closest || !e.target.closest("#task-check")) return;
          var T = MV.C.task, ts = MV.taskState(), fb = $("#task-fb");
          if (T && T.afterAll && ts.found.length >= 4 && fb && fb.querySelector(".fb.good") && !fb.querySelector(".mb-all")) fb.querySelector(".fb.good").insertAdjacentHTML("beforeend", '<p class="mb-all">' + T.afterAll + "</p>");
        });
      }
    },
    read:read,
    valid:function(d){ return d.r >= 1 && d.r <= 8 && d.b >= 1 && d.b <= 8 ? true : "Choose whole numbers from 1 to 8."; },
    checks:function(d){ var v = vals(d); return [2 * v.mix >= v.T, v.rr > v.bb, d.b >= 2, d.r + d.b <= 8]; },
    key:function(d){ return d.r + "," + d.b; },
    label:function(k){ var x = info(k); return M("(r, b) = (" + x.d.r + ", " + x.d.b + ")") + ": " + x.s.map(function(s){ return M(s); }).join(", "); },
    text:function(k){ var x = info(k); return "(r, b) = (" + x.d.r + ", " + x.d.b + "): " + x.s.join(", "); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
